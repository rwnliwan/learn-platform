import type { V2Lesson } from "../lib/types";

export const mle10: V2Lesson = {
  slug: "mle10-scaling",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE10 — Scaling: Distributed Training",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Ketika satu GPU butuh 9 hari dan deadline-mu 2 hari, jawabannya adalah paralelisme. Tetapi 8 GPU tidak berarti 8x lebih cepat — lesson ini menjelaskan kenapa dan kapan scaling worth it.",
        "Tujuan lesson ini:",
        "• Menjelaskan data parallel vs model parallel.",
        "• Menghitung speedup teoritis dengan Hukum Amdahl.",
        "• Memodelkan overhead komunikasi dan menemukan jumlah GPU optimal.",
        "• Membedakan synchronous vs asynchronous SGD.",
        "• Memutuskan strategi scaling untuk 4 skenario.",
        "Isi lesson: cerita 8 GPU yang tidak 8x → paralelisme + lab Amdahl → overhead komunikasi + lab → sinkron vs asinkron → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Delapan GPU yang tidak 8x lebih cepat",
      prose: [
        "Tim riset sebuah bank melatih model credit scoring pada 40 juta baris data. Satu GPU: 9 hari. Deadline direksi: 2 hari. Solusi yang tampak jelas: sewa 8 GPU — 9/8 = 1,1 hari. Selesai sebelum deadline, bukan?",
        "Hasilnya: 3,8 hari. Bukan 1,1. Tagihan 8 GPU × 3,8 hari = 2,7x lebih mahal dari estimasi, dan deadline tetap terlewat.",
        "Twist-nya: bottleneck bukan komputasi — melainkan KOMUNIKASI. Tiap GPU menghitung gradient-nya sendiri, lalu semua gradient harus disinkronkan (allreduce) sebelum lanjut. Semakin banyak GPU, semakin besar waktu yang habis untuk 'ngobrol' dibanding 'bekerja'.",
        "Pelajaran: scaling punya hukum fisika. Memahaminya mengubah keputusan dari 'tambah GPU sampai cukup' menjadi 'hitung dulu titik optimalnya'.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'n GPU = n kali lebih cepat'",
        type: "pitfall",
        body: "Yang benar: bagian sekuensial (baca data, sinkronisasi) tidak bisa diparalelkan. Hukum Amdahl memberi batas atas speedup — dan overhead komunikasi bisa membuat n besar JUSTRU lebih lambat.",
      },
    },
    {
      id: "paralel",
      eyebrow: "Langkah 3 · Data vs model parallel",
      title: "Dua cara membagi kerja",
      prose: [
        "Data parallel: tiap GPU memegang SALINAN model penuh, tetapi data berbeda (batch dibagi). Setelah tiap batch, gradient dirata-ratakan (allreduce). Cocok untuk: model muat di 1 GPU, data sangat besar. Ini pola paling umum.",
        "Model parallel: MODEL-nya dibagi antar GPU (lapisan 1–10 di GPU-A, 11–20 di GPU-B). Cocok untuk: model raksasa yang tidak muat di 1 GPU (LLM). Lebih kompleks — aktivasi harus dikirim antar GPU tiap forward/backward.",
        "Hukum Amdahl: jika fraksi p dari pekerjaan bisa diparalelkan, speedup maksimal dengan n pekerja = 1/((1−p) + p/n). Dengan p = 0,9 dan n = 8: speedup = 4,71x — bukan 8x. Efisiensi: 58,8%.",
        "Interpretasi: 41% potensi hilang ke bagian sekuensial. Inilah 'pajak' paralelisme yang tidak bisa dihindari — sebelum menghitung overhead komunikasi.",
        "Data vs model parallel — pilih dengan 1 pertanyaan: “apakah model MUAT di 1 GPU?” MUAT → data parallel (standar, sederhana). TIDAK MUAT (LLM 70B) → model/tensor parallel (kompleks, komunikasi intensif) atau pipeline parallel. Salah pilih = tidak jalan sama sekali (OOM) atau komunikasi 10×. Untuk 95% kasus industri (model <10B parameter): data parallel. Jangan bayar kompleksitas yang tidak dibutuhkan.",
        "Model parallel — sekilas untuk wawasan. LLM 70B tidak muat di 1 GPU (140GB > 80GB): pecah LAYER ke 2 GPU (pipeline) atau pecah TENSOR ke 4 GPU (tensor parallel). Komunikasi: tiap layer = kirim aktivasi (GBs!) — 10× overhead vs data parallel. Kapan: HANYA jika model tidak muat. Jangan “coba-coba” model parallel untuk model 7B (muat!) — membayar 10× komunikasi untuk 0 manfaat. Aturan: muat = data parallel; tidak muat = model parallel; ragu = ukur memori dulu (1 baris nvidia-smi).",
      ],
      formula: String.raw`S(n) = \frac{1}{(1-p) + p/n}`,
      formulaNote: "S(n) = percepatan dengan n GPU; p = fraksi komputasi yang bisa diparalelkan (0–1). Contoh: p=0,9, n=8 → S = 1/(0,1 + 0,9/8) = 1/0,2125 = 4,7× — BUKAN 8×. (1−p) = fraksi sekuensial (komunikasi, sinkronisasi) yang TIDAK bisa dipercepat. Hukum Amdahl: tambah GPU sebanyak apa pun, S(n) ≤ 1/(1−p).",
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Speedup teoritis (p=0,9, Hukum Amdahl)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Speedup teoritis (p=0,9, Hukum Amdahl)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1.2</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2.4</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3.5</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4.7</text>
<rect x="64.9" y="136.3" width="67.2" height="29.7" fill="var(--c1)" rx="3"/>
<text x="98.5" y="130.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1</text>
<text x="98.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 GPU</text>
<rect x="169.9" y="111.9" width="67.2" height="54.1" fill="var(--c2)" rx="3"/>
<text x="203.5" y="105.9" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">1.82</text>
<text x="203.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2 GPU</text>
<rect x="274.9" y="74.5" width="67.2" height="91.5" fill="var(--c3)" rx="3"/>
<text x="308.5" y="68.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">3.08</text>
<text x="308.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4 GPU</text>
<rect x="379.9" y="26.0" width="67.2" height="140.0" fill="var(--c4)" rx="3"/>
<text x="413.5" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">4.71</text>
<text x="413.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">8 GPU</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart speedup: 1, 1.82, 3.08, 4.71 untuk 1, 2, 4, 8 GPU.",
        caption: "Cara membaca: tinggi batang = speedup vs 1 GPU. Interpretasi: kenaikan melambat — dari 4 ke 8 GPU hanya menambah 1,6x speedup tetapi menggandakan biaya. Titik inilah ekonomi scaling mulai dipertanyakan.",
      },
      tasks: [
        { id: "t1", text: "Tulis fungsi `speedup(n, p)` sesuai Hukum Amdahl" },
        { id: "t2", text: "Hitung `s8` (n=8, p=0.9) dan `efisiensi` (%)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: cari p dulu sebelum sewa GPU",
        body: "Ukur fraksi sekuensial kode-mu (profiling) SEBELUM scaling. Jika p = 0,5, speedup maksimal (n→∞) hanya 2x — sewa 100 GPU pun sia-sia. Optimasi sekuensial sering lebih murah dari tambah GPU.",
      },
      hints: [
        "speedup = 1 / ((1 - p) + p / n).",
        "efisiensi = s8 / 8 * 100.",
        "f-string {x:.2f} untuk 2 desimal.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
p = 0.9

# TULIS KODEMU: Hukum Amdahl
def speedup(n, p):
    
s8 = 
efisiensi = 

print(f"speedup_8={s8:.2f}x  efisiensi={efisiensi:.1f}%")`,
        lockLines: 2,
        solution: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
p = 0.9

# TULIS KODEMU: Hukum Amdahl
def speedup(n, p):
    return 1 / ((1 - p) + p / n)
s8 = speedup(8, p)
efisiensi = s8 / 8 * 100

print(f"speedup_8={s8:.2f}x  efisiensi={efisiensi:.1f}%")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`s8` ≈ 4.71x",
            "name": "s8",
            "value": 4.7058823529411775,
            "tol": 0.01,
            "msg": "1/(0.1 + 0.9/8) = 4.71. Bukan 8x.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan efisiensi",
            "pattern": "efisiensi=58\\.8%",
            "msg": "4.71/8 × 100 = 58.8%.",
          },
        ],
      },
      reference: "Hukum Amdahl = batas atas teoritis. Realita selalu di bawahnya.",
    },
    {
      id: "overhead",
      eyebrow: "Langkah 4 · Overhead komunikasi",
      title: "Ketika 8 GPU lebih lambat dari 4 GPU",
      prose: [
        "Amdahl belum menghitung biaya 'ngobrol': tiap sinkronisasi gradient butuh waktu yang tumbuh dengan jumlah GPU. Model sederhana: waktu(n) = T1 × ((1−p) + p/n) + k×(n−1), dengan k = biaya komunikasi per GPU tambahan.",
        "Lab: training 216 jam (9 hari), p = 0,95, k = 8 jam. Hasil: 1 GPU = 216 jam; 2 = 123,4; 4 = 86,1; 8 = 92,5 jam. DELAPAN GPU LEBIH LAMBAT DARI EMPAT.",
        "Twist-nya: titik optimal bukan 'sebanyak mungkin', melainkan n* di mana turunan waktu = 0. Melewatinya = membayar lebih untuk hasil lebih buruk. Inilah yang terjadi di cerita pembuka.",
        "Solusi dunia nyata: gradient accumulation (sinkronisasi lebih jarang), kompresi gradient, topologi komunikasi efisien (ring allreduce), dan — paling sering dilupakan — perbesar batch agar rasio komputasi/komunikasi naik.",
        "n OPTIMAL — bukan maksimal. Total waktu(n) = T1×((1−p) + p/n) + k×(n−1); biaya(n) = n × tarif × waktu(n). Contoh: T1=9 hari, p=0,95, k=0,1 hari, tarif Rp2 juta/hari/GPU. n=4: waktu = 9×(0,05+0,2375)+0,3 = 2,89 hari; biaya = 4×2×2,89 = Rp23,1 juta. n=8: waktu = 9×(0,05+0,1188)+0,7 = 2,22 hari; biaya = 8×2×2,22 = Rp35,5 juta. n=8 hanya 23% lebih cepat tetapi 54% lebih mahal! n optimal = yang memenuhi DEADLINE dengan biaya minimal — bukan yang tercepat. Hitung SEBELUM sewa.",
        "Straggler — GPU yang lambat menahan semua. Synchronous SGD: 8 GPU, 7 selesai dalam 10 detik, 1 butuh 25 detik (thermal throttling) → tiap step = 25 detik (bukan rata-rata 11,9!). Solusi: (1) deteksi + ganti node; (2) backup workers (10 worker untuk 8 slot — yang selesai duluan dipakai); (3) async SGD (toleransi staleness). Straggler 1 dari 100 GPU di cluster besar = pajak 10–20% yang tidak terlihat di rumus Amdahl. Monitor per-GPU throughput — yang tidak diukur tidak dioptimasi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `waktu(n)`: Amdahl + overhead komunikasi" },
        { id: "t2", text: "Hitung waktu untuk n = 1, 2, 4, 8; tentukan `terbaik`" },
        { id: "t3", text: "Cetak waktu n=4, n=8, dan GPU terbaik" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'kalau lambat, tambah GPU lagi'",
        type: "pitfall",
        body: "Yang benar: di atas titik optimal, tambah GPU = tambah lambat + tambah mahal. Diagnosis dulu (profiling: berapa % waktu untuk komunikasi?) baru tambah hardware.",
      },
      hints: [
        "waktu = T1*((1-p) + p/n) + k*(n-1).",
        "Hitung untuk [1,2,4,8], cari n dengan waktu minimum.",
        "min(range, key=...) atau loop manual.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
T1, p, k = 216, 0.95, 8.0   # jam, fraksi paralel, overhead/GPU

# TULIS KODEMU
def waktu(n):
    
hasil = {n: waktu(n) for n in (1, 2, 4, 8)}
terbaik = 

print(f"waktu_4={hasil[4]:.1f}jam  waktu_8={hasil[8]:.1f}jam  terbaik={terbaik} GPU")`,
        lockLines: 2,
        solution: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
T1, p, k = 216, 0.95, 8.0   # jam, fraksi paralel, overhead/GPU

# TULIS KODEMU
def waktu(n):
    return T1 * ((1 - p) + p / n) + k * (n - 1)
hasil = {n: waktu(n) for n in (1, 2, 4, 8)}
terbaik = min(hasil, key=hasil.get)

print(f"waktu_4={hasil[4]:.1f}jam  waktu_8={hasil[8]:.1f}jam  terbaik={terbaik} GPU")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`terbaik` = 4 GPU",
            "name": "terbaik",
            "value": 4,
            "tol": 1e-09,
            "msg": "waktu(4)=86.1 < waktu(8)=92.5. Titik optimal terlampaui di 8.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan perbandingan",
            "pattern": "waktu_8=92\\.5jam",
            "msg": "Format: waktu_4=...jam  waktu_8=...jam  terbaik=... GPU.",
          },
        ],
      },
      reference: "Overhead komunikasi tumbuh dengan n; komputasi menyusut dengan 1/n.",
    },
    {
      id: "sgd",
      eyebrow: "Langkah 5 · Sinkron vs asinkron",
      title: "Staleness: harga kecepatan",
      prose: [
        "Synchronous SGD: semua GPU sinkron tiap step — konsisten, tetapi GPU tercepat menunggu yang terlambat (straggler).",
        "Asynchronous SGD: tiap GPU update model global kapan pun selesai — tidak ada menunggu, tetapi gradient bisa basi (stale): dihitung dari bobot 10 step lalu. Staleness menambah noise dan bisa merusak konvergensi.",
        "Praktik modern: synchronous dengan optimasi (backup workers: abaikan straggler paling lambat) untuk kebanyakan kasus; asinkron hanya bila straggler sangat parah dan toleransi noise tinggi.",
        "Aturan: sinkron = benar tetapi kadang lambat; asinkron = cepat tetapi kadang salah arah. Pilih berdasarkan mana yang lebih mahal bagimu: waktu atau akurasi.",
        "Gradient accumulation — “GPU miskin” tetap bisa. Mau batch 1024 tetapi GPU hanya muat 128? Akumulasi 8 step → update SEKALI. Efek = batch 1024 dengan 1 GPU! Biaya: 8× waktu per update (tetapi konvergensi setara). Ini BUKAN pengganti multi-GPU (tetap 1 GPU = lambat), tetapi memungkinkan EKSPERIMEN batch besar sebelum sewa cluster. Hemat: Rp0 vs Rp35 juta untuk validasi ide. Validasi murah → sewa mahal hanya untuk yang terbukti.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: distributed training = ekonomi, bukan cuma teknik",
        body: "Setiap keputusan scaling adalah tradeoff uang vs waktu vs akurasi. Insinyur yang baik menghitung ketiganya sebelum menyewa cluster.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Strategi scaling per situasi",
      prose: [
        "Skenario 1 — Model muat 1 GPU, data 40 juta baris, deadline ketat → data parallel multi-GPU, hitung n optimal dulu. Alasan: pola standar dengan ROI jelas.",
        "Skenario 2 — Model 70B parameter, tidak muat 1 GPU → model parallel / pipeline parallel. Alasan: tidak ada pilihan — modelnya memang tidak muat.",
        "Skenario 3 — Training 2 jam di 1 GPU, ingin 30 menit → JANGAN distributed; optimasi single-GPU dulu (mixed precision, batch lebih besar). Alasan: overhead distributed tidak sebanding untuk job kecil.",
        "Skenario 4 — Eksperimen banyak varian kecil → JANGAN 1 job besar; jalankan banyak job paralel (hyperparameter search). Alasan: paralelisme antar-eksperimen 100% efisien (tidak ada komunikasi).",
        "Aturan praktis 10 detik: (1) Apakah model muat 1 GPU? (2) Berapa p (fraksi paralel)? (3) Apakah job cukup besar untuk menutup overhead? Tidak → optimasi dulu.",
        "Skenario 3 — deadline 2 hari, T1=9 hari, budget Rp50 juta → hitung n optimal DULU (seperti di atas), sewa n optimal, bukan n maksimal. Jika n optimal tidak memenuhi deadline → opsi: (1) kurangi data (sampel 50%?); (2) sederhanakan model; (3) nego deadline dengan DATA (tunjukkan kurva waktu vs n). “Tidak bisa” dengan angka = profesional; “coba 32 GPU” tanpa hitung = judi Rp100 juta.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "E-commerce: Rp180 juta untuk training yang bisa Rp45 juta",
      prose: [
        "Tim e-commerce menyewa 16 GPU selama 10 hari (Rp180 juta) untuk training model rekomendasi. Hasil: selesai 6,5 hari — lebih cepat dari 9 hari estimasi 1 GPU, tetapi...",
        "Analisis pasca: p = 0,88 (banyak preprocessing sekuensial), overhead komunikasi tinggi. Perhitungan ulang: 4 GPU → 4,2 hari dengan biaya Rp45 juta. 16 GPU → 6,5 hari?? — tunggu, kenapa 16 GPU LEBIH LAMBAT dari estimasi?",
        "Karena di atas titik optimal: waktu(16) > waktu(8) > waktu(4). Mereka membayar 4x lipat untuk hasil yang lebih buruk dari opsi 4 GPU.",
        "Pertanyaan: (a) Di mana kesalahan keputusan? (b) Berapa penghematan jika memakai 4 GPU? (c) Proses apa yang mencegah terulang?",
        "Pembahasan: (a) Sewa maksimal tanpa menghitung titik optimal — 'lebih banyak = lebih baik' yang salah. (b) Rp180jt − Rp45jt = Rp135 juta + selesai lebih cepat (4,2 vs 6,5 hari). (c) Wajib: ukur p via profiling di 1–2 GPU, hitung kurva waktu vs n, baru sewa. Aturan: tidak ada sewa > 4 GPU tanpa kurva scaling.",
        "Audit Rp180 juta: 16 GPU × 10 hari, selesai 6,5 hari. Analisis: (1) p aktual 0,85 (bukan 0,95 asumsi) → S(16) = 1/(0,15+0,053) = 4,9× (bukan 16×!). (2) Straggler: 2 GPU lambat 30%. (3) Seharusnya: n=8 optimal → waktu 3,5 hari, biaya Rp56 juta. PEMBOROSAN: Rp124 juta (69%!). Tiga baris perhitungan SEBELUM sewa menghemat Rp124 juta. “Sewa dulu, hitung kemudian” = strategi termahal di cloud.",
        "Keputusan yang benar — dengan angka. Deadline 2 hari, T1=9 hari. Opsi n=8: waktu 2,22 hari (MELESET deadline!), biaya Rp35,5 juta. Opsi n=16: waktu ~1,8 hari (lolos!), biaya Rp180 juta. Opsi C: kurangi data 50% (sampel stratifikasi) + n=8: T1=4,5 hari → waktu 1,2 hari, biaya Rp18 juta + validasi sampel (apakah representatif?). Opsi C: 10× lebih murah, lolos deadline — JIKA sampling valid. Kreativitas > brute force. “Sewa lebih banyak” = solusi termalas; “pikir lebih keras” = solusi termurah.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi scaling: Hukum Amdahl + biaya komunikasi + straggler = tiga realitas. Satu ritual: HITUNG SEBELUM SEWA (n optimal, bukan maksimal). Satu prinsip: skala untuk DEADLINE, bukan untuk gengsi. Dan satu jebakan: “tambah GPU” untuk masalah yang sebenarnya DATA (pipeline lambat) atau MODEL (tidak konvergen) — scale-up tidak memperbaiki yang rusak, ia hanya mempercepat yang rusak dengan lebih mahal.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "8 GPU, p = 0,9. Speedup ekspektasi?",
          options: [
            {
              text: "8x",
              why: "Mengabaikan bagian sekuensial — mitos yang dibantah Amdahl.",
            },
            {
              text: "≈ 4,7x",
              why: "Tepat: 1/(0,1 + 0,9/8) = 4,71.",
              correct: true,
            },
            {
              text: "0,9x",
              why: "Itu bukan cara membaca p.",
            },
            {
              text: "72x",
              why: "Tidak ada dasarnya.",
            },
          ],
        },
        {
          q: "waktu(4) = 86 jam, waktu(8) = 92 jam. Keputusan?",
          options: [
            {
              text: "Pakai 8 GPU, lebih banyak lebih baik",
              why: "Data menunjukkan 8 GPU lebih lambat — titik optimal terlampaui.",
            },
            {
              text: "Pakai 4 GPU — titik optimal, lebih cepat dan murah",
              why: "Tepat: 86 < 92, dan biaya setengahnya.",
              correct: true,
            },
            {
              text: "Pakai 16 GPU",
              why: "Tren menunjukkan makin buruk setelah 4.",
            },
            {
              text: "Kembali ke 1 GPU",
              why: "216 jam > 86 jam; 4 GPU tetap jauh lebih baik dari 1.",
            },
          ],
        },
        {
          q: "Model 70B parameter tidak muat di 1 GPU. Solusi?",
          options: [
            {
              text: "Data parallel biasa",
              why: "Data parallel butuh salinan model penuh per GPU — tidak muat.",
            },
            {
              text: "Model parallel / pipeline parallel",
              why: "Tepat: modelnya yang dibagi antar GPU.",
              correct: true,
            },
            {
              text: "Perkecil data",
              why: "Masalahnya ukuran model, bukan data.",
            },
            {
              text: "Training lebih lama di 1 GPU",
              why: "Tidak muat = tidak bisa, bukan soal waktu.",
            },
          ],
        },
        {
          q: "Kelemahan utama asynchronous SGD?",
          options: [
            {
              text: "Terlalu lambat",
              why: "Justru lebih cepat karena tanpa menunggu — masalahnya di tempat lain.",
            },
            {
              text: "Gradient basi (stale) merusak konvergensi",
              why: "Tepat: update dari bobot lama menambah noise.",
              correct: true,
            },
            {
              text: "Butuh lebih banyak data",
              why: "Tidak berhubungan dengan jumlah data.",
            },
            {
              text: "Tidak bisa diimplementasikan",
              why: "Bisa, dan dipakai di beberapa sistem.",
            },
          ],
        },
        {
          q: "20 varian eksperimen kecil, masing-masing 1 jam di 1 GPU. Strategi?",
          options: [
            {
              text: "Distributed training 20 GPU untuk 1 varian",
              why: "Overhead tidak sebanding untuk job 1 jam.",
            },
            {
              text: "Jalankan 20 job paralel (1 GPU each)",
              why: "Tepat: paralelisme antar-eksperimen 100% efisien, tanpa komunikasi.",
              correct: true,
            },
            {
              text: "Berurutan di 1 GPU",
              why: "20 jam vs 1 jam — buang waktu tanpa alasan.",
            },
            {
              text: "Gabungkan jadi 1 model besar",
              why: "Mengubah pertanyaan riset, bukan strategi komputasi.",
            },
          ],
        },
      ],
      summary: [
        "Data parallel: model sama, data dibagi; model parallel: model dibagi (untuk model raksasa).",
        "Hukum Amdahl: S(n) = 1/((1−p) + p/n) — batas atas speedup.",
        "Overhead komunikasi bisa membuat n besar lebih lambat — ada titik optimal.",
        "Ukur p dulu (profiling), hitung kurva, baru sewa GPU.",
        "Sinkron = konsisten; asinkron = cepat tetapi gradient basi.",
        "Banyak eksperimen kecil → paralel antar-job, bukan distributed training.",
      ],
      next: { label: "MLE11 — Cost & Latency Optimization", href: "/v2/learn/mle11-cost" },
    },
  ],
};
