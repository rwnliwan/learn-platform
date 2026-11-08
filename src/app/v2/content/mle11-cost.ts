import type { V2Lesson } from "../lib/types";

export const mle11: V2Lesson = {
  slug: "mle11-cost",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE11 — Cost & Latency Optimization",
  estMinutes: 65,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Model terbaik di dunia tidak berguna jika terlalu lambat atau terlalu mahal untuk dijalankan. Lesson ini tentang seni mengorbankan sedikit akurasi untuk banyak kecepatan dan uang.",
        "Tujuan lesson ini:",
        "• Menjelaskan tradeoff tiga dimensi: akurasi, latency, biaya.",
        "• Menemukan himpunan Pareto dari kandidat model.",
        "• Menghitung efek kuantisasi pada ukuran model.",
        "• Membedakan teknik optimasi: kuantisasi, pruning, distilasi, caching.",
        "• Memutuskan optimasi untuk 4 skenario produk.",
        "Isi lesson: cerita tagihan $4.200 → tradeoff Pareto + lab → teknik optimasi + lab kuantisasi → cost modeling → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Tagihan $4.200/bulan yang menjadi $380",
      prose: [
        "Sebuah SaaS HR memakai model NLP 2GB untuk screening CV: latency 800ms, tagihan GPU $4.200/bulan. CFO mulai bertanya-tanya apakah fitur ini sepadan.",
        "Tim MLE tidak mengganti model — mereka menumpuk optimasi kecil: kuantisasi int8 (4x lebih kecil), batching request, caching untuk CV yang di-submit ulang, dan distilasi ke model 6x lebih kecil untuk 90% traffic mudah.",
        "Hasil: latency 800ms → 120ms, biaya $4.200 → $380/bulan. Akurasi turun 0,4 poin — dari 94,0% ke 93,6%. Tidak ada pengguna yang komplain; tidak ada metrik bisnis yang bergerak.",
        "Twist-nya: tidak ada SATU teknik ajaib. Kemenangan datang dari tumpukan 4 optimasi yang masing-masing 'kecil'. Optimasi ML adalah portofolio, bukan lotre.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'optimasi = mengorbankan banyak akurasi'",
        type: "pitfall",
        body: "Yang benar: 80% penghematan biaya/latency biasanya menelan < 1 poin akurasi. Yang mahal adalah 1% akurasi TERAKHIR — dan seringkali tidak ada yang membutuhkannya.",
      },
    },
    {
      id: "pareto",
      eyebrow: "Langkah 3 · Tradeoff tiga dimensi",
      title: "Himpunan Pareto: tidak ada yang gratis",
      prose: [
        "Setiap kandidat model punya tiga angka: akurasi (↑ baik), latency (↓ baik), biaya (↓ baik). Kandidat X 'mendominasi' Y jika X lebih baik di SEMUA dimensi — Y bisa dibuang tanpa ragu.",
        "Yang tersisa setelah membuang yang terdominasi = himpunan Pareto (frontier). Di sinilah keputusan sulit: setiap pilihan mengorbankan sesuatu. Tidak ada jawaban 'benar' — hanya jawaban yang selaras dengan prioritas produk.",
        "Lab: 6 kandidat. E didominasi B (akurasi lebih rendah, latency & biaya lebih tinggi) → buang. F didominasi C → buang. Tersisa 4: A (akurasi tertinggi), B, C, D (termurah/tercepat). Pilihan = strategi bisnis.",
        "Cara membaca: tidak ada kandidat yang 'menang' — A terbaik untuk akurasi kritis (medis), D terbaik untuk skala masif (rekomendasi), B/C untuk tengah-tengah.",
        "Frontier Pareto — contoh 4 kandidat. A: akurasi 92%, 800ms, $4.200/bln. B: 91,5%, 200ms, $1.100/bln. C: 91%, 90ms, $400/bln. D: 90%, 80ms, $380/bln. D TIDAK didominasi C — D lebih cepat (80 vs 90ms) DAN lebih murah ($380 vs $400), hanya kalah akurasi 1 poin; dominasi butuh kalah di SEMUA dimensi. Sisa frontier: A, B, C, D — tidak ada yang dominan. Pilih berdasarkan KENDALA: SLO 100ms → C dan D lolos (90ms dan 80ms); pilih C bila 1 poin akurasi itu bernilai lebih dari selisih biaya $20/bln, D bila skala dan biaya yang utama. Tanpa SLO tertulis: debat tanpa akhir. Pareto + kendala = keputusan 5 menit. Tanpa kendala = rapat 5 jam.",
        "Biaya akurasi — kurva yang harus digambar. Setiap +1 poin akurasi di atas 90% biayanya naik makin curam — bukan 2× yang tetap: 90→91%: +Rp10 juta/bln; 91→92%: +Rp25 juta/bln (2,5× kenaikan sebelumnya); 92→93%: +Rp60 juta/bln (2,4×). Kenaikan marginalnya sendiri naik ~2,4–2,5× per poin — jangan dibaca sebagai 'biaya total berlipat 2× tiap poin'. Tanya: “1 poin = berapa rupiah NILAI?” Jika 1 poin = Rp100 juta/bln (fraud): BAYAR. Jika 1 poin = Rp5 juta/bln (rekomendasi konten): JANGAN. Kurva biaya vs kurva nilai — titik optimal = di mana keduanya bersinggungan. Tanpa kurva nilai: optimasi buta.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Latency kandidat Pareto (ms)">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Latency kandidat Pareto (ms)</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">200.0</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">400.0</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">600.0</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">800.0</text>
<rect x="64.9" y="26.0" width="67.2" height="140.0" fill="var(--c1)" rx="3"/>
<text x="98.5" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">800</text>
<text x="98.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">A</text>
<rect x="169.9" y="145.0" width="67.2" height="21.0" fill="var(--c2)" rx="3"/>
<text x="203.5" y="139.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">120</text>
<text x="203.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">B</text>
<rect x="274.9" y="155.5" width="67.2" height="10.5" fill="var(--c3)" rx="3"/>
<text x="308.5" y="149.5" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">60</text>
<text x="308.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">C</text>
<rect x="379.9" y="160.8" width="67.2" height="5.2" fill="var(--c4)" rx="3"/>
<text x="413.5" y="154.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">30</text>
<text x="413.5" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">D</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart latency data LAB: A 800ms, B 120ms, C 60ms, D 30ms (bukan contoh 4-kandidat di prose: B 200ms, C 90ms, D 80ms).",
        caption: "Cara membaca: tinggi batang = latency per prediksi — gambar ini memakai data LAB (A 94,0%/800ms, B 93,6%/120ms, C 92,8%/60ms, D 90,0%/30ms), BUKAN contoh 4-kandidat di prose di atas (B 200ms, C 90ms, D 80ms). Interpretasi: A 27x lebih lambat dari D — harga dari 4 poin akurasi ekstra (94,0% vs 90,0%). Untuk screening CV (cerita pembuka), B/C adalah sweet spot.",
      },
      tasks: [
        { id: "t1", text: "Tulis fungsi `dominan(x, y)`: x lebih baik di semua dimensi" },
        { id: "t2", text: "Saring `pareto`: kandidat yang tidak didominasi siapa pun" },
        { id: "t3", text: "Cetak jumlah dan nama anggota Pareto" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: buang yang terdominasi dulu, debat sisanya",
        body: "Pareto mengubah debat kusut ('model mana terbaik?') menjadi dua langkah: eliminasi objektif (dominasi), lalu keputusan nilai (prioritas produk). Langkah pertama tidak butuh opini.",
      },
      hints: [
        "x dominan y: acc x>=y DAN lat x<=y DAN cost x<=y, dengan minimal satu ketat.",
        "pareto = [k for k in kandidat if not any(dominan(o,k) for o in kandidat if o != k)].",
        "Bandingkan tuple (nama, acc, latency, cost).",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
# (nama, akurasi, latency_ms, biaya_per_1k_$)
kandidat = [("A_besar", 0.940, 800, 4.20), ("B_quant", 0.936, 120, 0.38),
            ("C_distil", 0.928, 60, 0.15), ("D_kecil", 0.900, 30, 0.08),
            ("E_boros", 0.930, 200, 0.60), ("F_aneh", 0.910, 100, 0.30)]

# TULIS KODEMU: dominasi Pareto
def dominan(x, y):
    
pareto = 
nama = [k[0] for k in pareto]

print(f"pareto={len(pareto)}  anggota={nama}")`,
        lockLines: 5,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
# (nama, akurasi, latency_ms, biaya_per_1k_$)
kandidat = [("A_besar", 0.940, 800, 4.20), ("B_quant", 0.936, 120, 0.38),
            ("C_distil", 0.928, 60, 0.15), ("D_kecil", 0.900, 30, 0.08),
            ("E_boros", 0.930, 200, 0.60), ("F_aneh", 0.910, 100, 0.30)]

# TULIS KODEMU: dominasi Pareto
def dominan(x, y):
    baik = x[1] >= y[1] and x[2] <= y[2] and x[3] <= y[3]
    ketat = x[1] > y[1] or x[2] < y[2] or x[3] < y[3]
    return baik and ketat
pareto = [k for k in kandidat if not any(dominan(o, k) for o in kandidat if o != k)]
nama = [k[0] for k in pareto]

print(f"pareto={len(pareto)}  anggota={nama}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "4 anggota Pareto",
            "name": "nama",
            "value": ["A_besar", "B_quant", "C_distil", "D_kecil"],
            "msg": "E didominasi B, F didominasi C. Bandingkan list nama.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan jumlah",
            "pattern": "pareto=4",
            "msg": "Format: pareto=4  anggota=[...].",
          },
        ],
      },
      reference: "Pareto = tidak ada yang mengalahkan di semua dimensi. Keputusan akhir = prioritas produk.",
    },
    {
      id: "teknik",
      eyebrow: "Langkah 4 · Teknik optimasi",
      title: "Kuantisasi, pruning, distilasi, caching",
      prose: [
        "Kuantisasi: turunkan presisi bobot (fp32 → int8). Ukuran 4x lebih kecil, inference 2–4x lebih cepat — pada hardware yang mendukung int8 dan bila bottleneck-nya compute (bila bottleneck-nya memori/I/O, kecepatannya mengikuti ukuran, bukan presisi) — akurasi turun tipis. Lab: model 350 juta parameter: 1400MB → 350MB (hemat 75%).",
        "Pruning: potong bobot/koneksi yang tidak penting (mendekati nol). Model lebih ramping; butuh fine-tuning setelahnya agar akurasi pulih.",
        "Distilasi: latih model KECIL (student) meniru output model BESAR (teacher). Student belajar 'pengetahuan' teacher — sering mencapai 95%+ akurasi teacher dengan 10x lebih kecil.",
        "Caching & batching: jangan hitung ulang yang sudah dihitung (cache prediksi untuk input berulang); kumpulkan request menjadi batch (GPU suka batch besar). Keduanya 'gratis' dalam arti tanpa mengorbankan akurasi output — tetapi bukan tanpa biaya: caching butuh storage + invalidasi (cache basi = jawaban salah), batching menambah latensi antrean. 'Gratis' di sini = tanpa korban akurasi, bukan tanpa biaya operasional.",
        "Urutan kerja: ukur dulu bottleneck-nya (compute? memori? I/O?), lalu pilih teknik yang menyerang bottleneck itu. Optimasi buta = prematur.",
        "Distilasi — guru ke murid. Model besar (guru, 92%) melatih model kecil (murid) — murid belajar dari OUTPUT guru (soft labels), bukan dari data mentah. Hasil tipikal: murid 10× lebih kecil, akurasi 91% (−1 poin). Biaya: training 1× (guru sudah ada). Kapan: butuh latency ekstrem + akurasi hampir penuh. Kombinasi pamungkas: distilasi + kuantisasi — 800ms → 90ms dengan −1,5 poin. Tiga teknik (kuantisasi, distilasi, pruning) = toolbox kompresi; kuasai ketiganya.",
        "Pruning — teknik ketiga. Hapus bobot terkecil (50% parameter!) → akurasi −0,5 poin → fine-tune 1 epoch → kembali −0,1. Model 50% lebih kecil + 2× lebih cepat. Kombinasi pamungkas: pruning 50% + kuantisasi int8 = 8× lebih kecil, −0,3 poin. Tiga teknik (kuantisasi, distilasi, pruning) = toolbox LENGKAP. Urutan coba: kuantisasi (termudah) → pruning → distilasi (termahal). Jangan mulai dari yang termahal.",
      ],
      formula: String.raw`\text{ukuran} = \text{params} \times \text{bytes\_per\_param}`,
      formulaNote: "ukuran = params × bytes_per_param: params = jumlah parameter; bytes_per_param = 4 (fp32), 2 (fp16), 1 (int8). Contoh lab: 350 juta × 4 byte = 1.400MB (fp32) → 350 juta × 1 byte = 350MB (int8) — hemat 75%. Ukuran = memori = biaya loading + biaya storage + (sering) latency.",
      tasks: [
        { id: "t1", text: "Hitung `fp32_mb` dan `int8_mb` untuk 350 juta parameter" },
        { id: "t2", text: "Hitung `hemat` (%)" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'kuantisasi selalu merusak akurasi secara signifikan'",
        type: "pitfall",
        body: "Yang benar: int8 quantization-aware training biasanya < 1 poin penurunan. Yang merusak adalah kuantisasi buta tanpa kalibrasi/validasi — tekniknya benar, eksekusinya yang salah.",
      },
      hints: [
        "fp32 = 4 byte/param; int8 = 1 byte/param. MB = byte / 1e6.",
        "hemat = (1 - int8/fp32) * 100.",
        "350_000_000 = 350 juta.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
params = 350_000_000

# TULIS KODEMU: ukuran model
fp32_mb = 
int8_mb = 
hemat = 

print(f"fp32={fp32_mb:.0f}MB  int8={int8_mb:.0f}MB  hemat={hemat:.0f}%")`,
        lockLines: 2,
        solution: `# === SEED TERKUNCI: jangan ubah 1 baris berikut ===
params = 350_000_000

# TULIS KODEMU: ukuran model
fp32_mb = params * 4 / 1e6
int8_mb = params * 1 / 1e6
hemat = (1 - int8_mb / fp32_mb) * 100

print(f"fp32={fp32_mb:.0f}MB  int8={int8_mb:.0f}MB  hemat={hemat:.0f}%")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`fp32_mb` = 1400",
            "name": "fp32_mb",
            "value": 1400.0,
            "tol": 1e-09,
            "msg": "350jt × 4 byte / 1e6 = 1400 MB.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`hemat` = 75%",
            "name": "hemat",
            "value": 75.0,
            "tol": 1e-09,
            "msg": "(1 − 350/1400) × 100 = 75%.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan hasil",
            "pattern": "int8=350MB",
            "msg": "Format: fp32=...MB  int8=...MB  hemat=...%.",
          },
        ],
      },
      reference: "Kuantisasi int8 = standar industri untuk serving. Validasi akurasi setelahnya wajib.",
    },
    {
      id: "costmodel",
      eyebrow: "Langkah 5 · Cost modeling",
      title: "Berapa rupiah per prediksi?",
      prose: [
        "Metrik biaya yang benar: $/1.000 prediksi (atau Rp/prediksi). Ia menggabungkan harga compute, utilisasi, dan throughput menjadi satu angka yang bisa dibandingkan antar arsitektur.",
        "Contoh: GPU $3/jam, throughput 500 prediksi/detik, utilisasi 60% → prediksi per jam = 500 × 3600 × 0,6 = 1.080.000 → $3/1080 = $0,0028 per 1.000 prediksi. Naikkan utilisasi ke 90% (batching lebih baik) → $0,0019 — optimasi tanpa menyentuh model.",
        "Biaya tersembunyi: egress network, storage model, monitoring, dan — yang terbesar — WAKTU INSINYUR. Optimasi yang menghemat $100/bulan tetapi butuh 2 minggu kerja = rugi.",
        "Aturan: optimasi yang ROI-nya positif dulu (caching, batching, kuantisasi standar); yang eksotis (custom kernel) hanya jika skala membenarkan.",
        "$/1.000 prediksi — contoh perbandingan jujur. Opsi GPU 24/7: $2.160/bln / (1 juta prediksi) = $2,16/1.000. Opsi batch: $7,5/bln / 1 juta = $0,0075/1.000 — 288× lebih murah! Opsi serverless: $0,50/1.000 (bayar per request, tanpa standby). Pilih: volume TINGGI + pola TERATUR → GPU/batch; volume RENDAH + sporadis → serverless; di tengah → hitung ketiganya. Satu metrik ($/1.000) mengakhiri semua debat arsitektur.",
        "Biaya yang TERLUPA: (1) data transfer (egress $0,09/GB — 1TB = $90/bln!); (2) storage model version (10 versi × 2GB × $0,023 = $4,6/bln — kecil, tetapi menumpuk); (3) observability (log 100GB = $50/bln); (4) ON-CALL manusia (yang paling mahal — Rp15 juta/bln per orang!). TCO = compute + transfer + storage + observability + manusia. Yang hanya menghitung compute = meremehkan 30–50%.",
        "BEP serverless vs GPU — titik patah. GPU $2.160/bln (fixed). Serverless $0,50/1.000. BEP: 2.160/0,0005 = 4,32 juta prediksi/bulan. Di BAWAH 4,32 juta → serverless menang. Di ATAS → GPU menang. Volume 1 juta/bln: serverless $500 vs GPU $2.160 — serverless! Volume 10 juta: $5.000 vs $2.160 — GPU! Satu pembagian = keputusan arsitektur. Hitung BEP-mu; ia berubah tiap kuartal (harga berubah, volume berubah).",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: utilisasi adalah tuas termurah",
        body: "GPU yang menganggur 70% = membayar 3x lipat per prediksi. Sebelum mengecilkan model, pastikan GPU-mu sibuk dulu (batching, penjadwalan).",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Optimasi apa untuk produk apa",
      prose: [
        "Skenario 1 — Fraud real-time, SLO 100ms, model 800ms → kuantisasi + distilasi + caching. Alasan: latency adalah syarat hidup-mati; korbankan sedikit akurasi.",
        "Skenario 2 — Rekomendasi batch harian, biaya membengkak → batching + spot instance + model lebih kecil. Alasan: latency tidak kritis; yang diburu $/prediksi.",
        "Skenario 3 — Model di HP (on-device) → kuantisasi agresif + pruning + arsitektur mobile. Alasan: memori dan baterai adalah batas keras.",
        "Skenario 4 — Model medis, akurasi kritis → JANGAN optimasi agresif; validasi klinis ulang tiap perubahan. Alasan: 0,4 poin di medis bisa berarti nyawa; biaya compute bukan masalahnya.",
        "Aturan praktis 10 detik: (1) Apa batas kerasnya — latency, biaya, atau memori? (2) Berapa akurasi yang boleh dikorbankan? (3) Apakah optimasi butuh validasi ulang? Jawaban menentukan teknik.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Chatbot bank: 2 detik → 0,4 detik",
      prose: [
        "Chatbot CS bank memakai LLM 7B parameter: latency 2 detik, biaya $0,012/pertanyaan, 3 juta pertanyaan/bulan = $36.000/bulan. Target: < 0,5 detik.",
        "Intervensi bertahap: (1) Caching: 35% pertanyaan berulang (saldo, jam operasional) → dijawab cache < 50ms, biaya ~$0. (2) Klasifikasi intent ringan: 50% pertanyaan sederhana → model kecil 120ms, $0,001. (3) LLM hanya untuk 15% kompleks → 2 detik, $0,012.",
        "Hitung: latency rata-rata = 0,35×0,05 + 0,50×0,12 + 0,15×2,0 = 0,38 detik. Biaya/bulan = 3jt × (0,50×0,001 + 0,15×0,012) = 3jt × $0,0023 = $6.900 — hemat $29.100 (81%). Perhatian: 0,38 detik adalah RATA-RATA — bukan bukti tiap request <0,5 detik: 15% pertanyaan kompleks tetap 2 detik. Target '<0,5 detik' di sini hanya terpenuhi sebagai rata-rata; bila SLO-nya per request (mis. p95), desain ini gagal dan 15% kompleks butuh optimasi sendiri (mis. streaming atau model menengah).",
        "Pertanyaan: (a) Teknik apa yang paling berkontribusi pada penghematan? (b) Kenapa tidak semua ke model kecil? (c) Risiko terbesar desain ini?",
        "Pembahasan: (a) Routing — kontributor terbesar: 50% pertanyaan sederhana ke model kecil menghemat 3jt × 0,50 × ($0,012−$0,001) = $16.500/bulan, LEBIH BESAR dari caching (35% × 3jt × $0,012 = $12.600). Keduanya dibutuhkan, tetapi jangan menobatkan caching bila routing yang paling banyak menghemat. (b) 15% pertanyaan kompleks butuh kemampuan LLM; model kecil akan ngawur dan merusak kepercayaan. (c) Cache basi (info promo berubah) dan salah routing intent (pertanyaan kompleks dikira sederhana) — butuh monitoring kualitas per jalur.",
        "Solusi chatbot: LLM 7B ($36.000/bln, 2 detik) → (1) routing: 50% pertanyaan sederhana ke model kecil ($0,001 vs $0,012 — hemat 3jt × 0,50 × $0,011 = $16.500); (2) cache: 35% pertanyaan berulang dijawab nyaris gratis — hemat 3jt × 0,35 × $0,012 = $12.600; (3) LLM hanya untuk 15% kompleks. Total: $6.900/bln (−81%) dengan latency rata-rata 0,38 detik — SATU pembagian yang sama seperti di atas (bukan 80%/30% dan bukan ~$4.000: angka $28.800 itu salah hitung — 3jt × 0,80 × $0,012 memakai harga penuh seolah model kecil gratis; yang benar 3jt × 0,80 × $0,011 = $26.400 — dan 80% + 30% = 110% bertentangan dengan pembagian 35/50/15). Tidak ada “model ajaib” — hanya 3 tuas standar yang dieksekusi disiplin. Cost optimization = bukan ilmu roket, melainkan KEDISIPLINAN mengukur.",
      ],
      tasks: [
      ],
    },
    {
      id: "gap-g28-latensi-persentil",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G28)",
      title: "Latensi yang jujur: p50, p95, p99 — bukan rata-rata",
      prose: [
        "Rata-rata latensi adalah statistik yang paling sering dilaporkan dan paling sedikit memberi informasi. Dua puluh empat request dengan latensi (ms): 12, 14, 15, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 30, 33, 38, 45, 60, 90, 150, 380. Rata-ratanya 47,5 ms — angka yang tampak aman. Persentilnya bercerita lain: p50 = 23 ms (request tengah), p95 = 150 ms, p99 = 380 ms. Satu request 380 ms menarik rata-rata ke atas sampai dua kali lipat p50, dan tetap menyembunyikan bahwa 5% request menembus 150 ms. Pengguna tidak merasakan rata-rata — ia merasakan request-nya sendiri, dan request sial itu ada di ekor.",
        "Metode hitungnya: nearest-rank. Urutkan data, lalu persentil ke-p adalah data urutan ke-ceil(p/100 × n). Dengan n = 24: p50 → urutan ke-12 = 23; p95 → urutan ke-23 = 150; p99 → urutan ke-24 = 380. Perhatikan: p99 pada sampel kecil praktis sama dengan maksimum — ia tidak stabil. Jangan laporkan p99 dari 24 sampel sebagai kebenaran; laporkan bersama ukuran sampelnya, atau kumpulkan minimal ratusan sampel sebelum p99 dianggap serius. Sebaliknya p95 dari 24 sampel sudah cukup memberi sinyal.",
        "Aturan SLO: tulis batas pada persentil — misal p95 di bawah 100 ms dan p99 di bawah 250 ms — dan alarm pada persentil, bukan rata-rata. Deployment pada contoh ini gagal di keduanya (p95 150, p99 380) walau rata-ratanya 47,5 ms. Dan saat mengoptimalkan, kejar ekornya: cold start, GC pause, antrean saat burst, dan retry storm adalah penyebab ekor — bukan kecepatan rata-rata komputasi model. Mempercepat p50 dari 23 ke 20 ms tidak menolong pengguna yang terjebak 380 ms.",
      ],
      formula: String.raw`p_k = \text{data terurut ke-} \lceil k/100 \times n \rceil \qquad \text{SLO pada } p_{95}, p_{99}`,
      formulaNote: "n = 24: rata-rata 47,5 ms, p50 23, p95 150, p99 380. Rata-rata menyembunyikan ekor.",
      tasks: [
        { id: "t1", text: "Hitung `p50`, `p95`, `p99` (nearest-rank) dari daftar latensi" },
        { id: "t2", text: "Hitung `rata_rata` dan tentukan `lolos_slo` (\"ya\" bila p95 di bawah 100 dan p99 di bawah 250)" },
      ],
      expected: "p50=23  p95=150  p99=380  rata_rata=47.5  lolos_slo=tidak",
      hints: [
        "Urutkan dulu; p50 → urutan ke-12, p95 → ke-23, p99 → ke-24.",
        "Rata-rata = jumlah seluruh latensi dibagi 24.",
        "SLO: p95 di bawah 100 ms DAN p99 di bawah 250 ms.",
      ],
      code: {
        starter: `import math\n\nlatensi = [12, 14, 15, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 38, 45, 60, 90, 150, 380]\n\n# TULIS KODEMU: persentil nearest-rank, rata-rata, vonis SLO.\ndef persentil(data, p):\n    urut = sorted(data)\n    k = math.ceil(p / 100 * len(urut))\n    return urut[k - 1]\n\np50 = \np95 = \np99 = \nrata_rata = \nlolos_slo = \n\nprint(f"p50={p50}  p95={p95}  p99={p99}  rata_rata={rata_rata}  lolos_slo={lolos_slo}")`,
        lockLines: 7,
        solution: `import math\n\nlatensi = [12, 14, 15, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 38, 45, 60, 90, 150, 380]\n\n# TULIS KODEMU: persentil nearest-rank, rata-rata, vonis SLO.\ndef persentil(data, p):\n    urut = sorted(data)\n    k = math.ceil(p / 100 * len(urut))\n    return urut[k - 1]\n\np50 = persentil(latensi, 50)\np95 = persentil(latensi, 95)\np99 = persentil(latensi, 99)\nrata_rata = sum(latensi) / len(latensi)\nlolos_slo = "ya" if p95 < 100 and p99 < 250 else "tidak"\n\nprint(f"p50={p50}  p95={p95}  p99={p99}  rata_rata={rata_rata}  lolos_slo={lolos_slo}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p50", value: 23, tol: 1, label: "`p50` = 23 ms", msg: "Urutan ke-12 dari 24 data = 23." },
          { kind: "equal", task: "t1", name: "p95", value: 150, tol: 1, label: "`p95` = 150 ms", msg: "Urutan ke-23 = 150 — di atas SLO 100 ms." },
          { kind: "equal", task: "t1", name: "p99", value: 380, tol: 1, label: "`p99` = 380 ms", msg: "Urutan ke-24 = maksimum — ekor ekstrem." },
          { kind: "equal", task: "t2", name: "rata_rata", value: 47.5, tol: 0.1, label: "`rata_rata` = 47,5 ms", msg: "Jumlah 1.140 / 24 = 47,5 — tampak aman, menipu." },
          { kind: "stdout_matches", task: "t2", pattern: "p50=23\\s+p95=150\\s+p99=380\\s+rata_rata=47.5\\s+lolos_slo=tidak", label: "`print` menampilkan kelima nilai", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Rata-rata 47,5 ms tapi p99 380 ms dari 24 sampel. Pernyataan yang benar?",
          options: [
            { text: "SLO gagal — p95 150 dan p99 380 melewati batas; dan p99 dari 24 sampel belum stabil", why: "Tepat: dua kebenaran sekaligus — vonis gagal DAN catatan bahwa p99 sampel kecil = praktis maksimum.", correct: true },
            { text: "SLO lolos — rata-rata di bawah 100 ms", why: "Salah: SLO ditulis pada persentil, bukan rata-rata." },
            { text: "p99 380 ms adalah bukti akurat ekor populasi", why: "Salah: dari 24 sampel, p99 = maksimum; butuh ratusan sampel sebelum p99 stabil." },
            { text: "Fokus optimalkan p50 — itulah yang dirasakan sebagian besar pengguna", why: "Salah: p50 sudah 23 ms; yang menyakitkan adalah ekor (cold start, antrean, GC pause)." },
          ],
        },
      ],
      reference: "Latensi dilaporkan sebagai p50/p95/p99 (nearest-rank) + ukuran sampel; SLO dan alarm pada persentil, bukan rata-rata.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi cost: Pareto + $/1.000 + TCO + BEP = empat alat. Satu prinsip: “setiap 1% akurasi punya harga — tanyakan harganya SEBELUM membayar”. Dan satu kebiasaan: REVIEW BIAYA BULANAN — 1 jam, lihat tagihan, tanya “apa yang naik? kenapa?”. Tagihan yang tidak direview = tagihan yang naik diam-diam. Cost optimization = bukan proyek sekali, melainkan RITUAL.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Kandidat E (acc 0,93, lat 200ms, $0,60) vs B (acc 0,936, lat 120ms, $0,38). Nasib E?",
          options: [
            {
              text: "Tetap dipertimbangkan",
              why: "E kalah di SEMUA dimensi dari B — tidak ada alasan memilihnya.",
            },
            {
              text: "Dibuang — didominasi B di semua dimensi",
              why: "Tepat: B lebih baik di akurasi, latency, DAN biaya.",
              correct: true,
            },
            {
              text: "Dipromosikan",
              why: "Promosi butuh keunggulan, bukan kekalahan total.",
            },
            {
              text: "Dilatih ulang",
              why: "Mungkin, tetapi sebagai kandidat ia sudah gugur dari frontier.",
            },
          ],
        },
        {
          q: "Model 350M parameter di-fp32 1400MB. Setelah int8?",
          options: [
            {
              text: "1400MB, tidak berubah",
              why: "int8 = 1 byte/param vs fp32 4 byte/param.",
            },
            {
              text: "350MB (hemat 75%)",
              why: "Tepat: 350jt × 1 byte = 350MB.",
              correct: true,
            },
            {
              text: "700MB",
              why: "Itu setara 2 byte/param (fp16), bukan int8.",
            },
            {
              text: "87MB",
              why: "Terlalu kecil; hitung lagi: 350jt × 1 byte.",
            },
          ],
        },
        {
          q: "GPU menganggur 70%. Tuas termurah menurunkan $/prediksi?",
          options: [
            {
              text: "Beli GPU lebih mahal",
              why: "Menambah biaya tanpa menaikkan utilisasi.",
            },
            {
              text: "Naikkan utilisasi via batching/penjadwalan",
              why: "Tepat: utilisasi 30% → 90% = 3x lebih murah per prediksi, tanpa menyentuh model.",
              correct: true,
            },
            {
              text: "Kecilkan model 10x",
              why: "Berisiko akurasi; utilisasi dulu yang gratis.",
            },
            {
              text: "Naikkan harga ke pelanggan",
              why: "Bukan optimasi teknis; tidak menyelesaikan inefisiensi.",
            },
          ],
        },
        {
          q: "Teknik optimasi yang TIDAK mengorbankan akurasi?",
          options: [
            {
              text: "Kuantisasi agresif",
              why: "Ada penurunan kecil yang harus divalidasi.",
            },
            {
              text: "Caching prediksi untuk input berulang",
              why: "Tepat: hasil identik, hanya tidak dihitung ulang.",
              correct: true,
            },
            {
              text: "Pruning 90%",
              why: "Jelas mengorbankan akurasi tanpa fine-tuning serius.",
            },
            {
              text: "Distilasi ke model 100x lebih kecil",
              why: "Ada gap akurasi teacher-student yang harus diterima.",
            },
          ],
        },
        {
          q: "Model diagnosis medis, akurasi kritis, biaya compute bukan masalah. Sikap optimasi?",
          options: [
            {
              text: "Kuantisasi agresif untuk hemat",
              why: "Penghematan tidak sebanding risiko nyawa; butuh validasi klinis ulang.",
            },
            {
              text: "Jangan optimasi agresif; validasi klinis tiap perubahan",
              why: "Tepat: di domain kritis, 0,4 poin bisa berarti nyawa.",
              correct: true,
            },
            {
              text: "Distilasi ke model HP",
              why: "Mengorbankan akurasi demi efisiensi yang tidak dibutuhkan.",
            },
            {
              text: "Hapus monitoring untuk hemat",
              why: "Monitoring bukan biaya yang boleh dipangkas di domain kritis.",
            },
          ],
        },
      ],
      summary: [
        "Tradeoff tiga dimensi: akurasi ↑, latency ↓, biaya ↓ — tidak ada yang gratis.",
        "Pareto: buang yang terdominasi; pilih sisanya sesuai prioritas produk.",
        "Kuantisasi int8: 4x lebih kecil, 2–4x lebih cepat, akurasi turun tipis.",
        "Caching & batching: optimasi 'gratis' tanpa korban akurasi.",
        "Metrik biaya: $/1.000 prediksi; utilisasi adalah tuas termurah.",
        "Optimasi agresif butuh validasi ulang — di domain kritis (medis), jangan.",
      ],
      next: { label: "MLE12 — Fairness & Responsible ML", href: "/v2/learn/mle12-fairness" },
    },
  ],
};
