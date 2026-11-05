import type { V2Lesson } from "../lib/types";

// Diagram sebelum vs sesudah: draf 40 halaman (rekomendasi di hal. 37) vs memo 4 halaman (keputusan di hal. 1).
const LAPORAN_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Perbandingan struktur: draf 40 halaman dengan rekomendasi di halaman 37, vs memo 4 halaman dengan keputusan di halaman 1.">
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<text x="140" y="30" fill="var(--chart-text)" font-weight="600">Draf 40 halaman</text>
<g><rect x="60" y="45" width="160" height="200" fill="none" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="70" y="55" width="140" height="14" fill="var(--c3)" opacity="0.5"/><text x="140" y="66" font-size="9" fill="var(--chart-text)">25 tabel…</text>
<rect x="70" y="75" width="140" height="14" fill="var(--c3)" opacity="0.5"/><text x="140" y="86" font-size="9" fill="var(--chart-text)">12 lampiran…</text>
<rect x="70" y="200" width="140" height="30" fill="#e11d48"/><text x="140" y="213" font-size="9" fill="#fff">Rekomendasi</text><text x="140" y="225" font-size="9" fill="#fff">halaman 37</text>
</g>
<text x="280" y="150" font-size="24" fill="var(--chart-text)">→</text>
<text x="420" y="30" fill="var(--chart-text)" font-weight="600">Memo 4 halaman</text>
<g><rect x="340" y="45" width="160" height="200" fill="none" stroke="var(--chart-text)" stroke-width="1"/>
<rect x="350" y="55" width="140" height="34" fill="var(--c1)"/><text x="420" y="69" font-size="9" fill="#fff">1. Keputusan yang diminta</text><text x="420" y="81" font-size="9" fill="#fff">halaman 1</text>
<rect x="350" y="95" width="140" height="30" fill="var(--c2)"/><text x="420" y="113" font-size="9" fill="#fff">2. Rekomendasi</text>
<rect x="350" y="131" width="140" height="30" fill="var(--c2)" opacity="0.7"/><text x="420" y="149" font-size="9" fill="#fff">3. Bukti 1 halaman</text>
<rect x="350" y="167" width="140" height="30" fill="var(--c2)" opacity="0.5"/><text x="420" y="185" font-size="9" fill="#fff">4. Risiko</text>
<rect x="350" y="203" width="140" height="22" fill="none" stroke="var(--chart-text)" stroke-dasharray="4,3"/><text x="420" y="217" font-size="9" fill="var(--chart-text)">lampiran (dibaca bila perlu)</text>
</g>
</g>
<text x="280" y="272" font-size="13" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)" font-weight="600">Komite memutuskan di halaman 1 — atau tidak sama sekali</text>
<text x="280" y="290" font-size="11" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">40 halaman analisis tidak berguna jika keputusan tak terbaca.</text>
</svg>`;

export const pmE4: V2Lesson = {
  slug: "pm-e4-deliverable-institusi",
  track: "Portfolio Management",
  module: "Praktik Profesional",
  title: "PME4 — Deliverable Institusi: Laporan yang Dibaca Komite",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-laporan",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan 40 halaman yang tidak dibaca",
      prose: [
        "Rian, analis di sebuah dana pensiun, menyiapkan rekomendasi rebalancing Rp1,2 triliun untuk komite investasi. Laporannya 40 halaman: 25 tabel, 12 lampiran, metodologi lengkap — dua minggu kerja keras. Rekomendasinya ada di halaman 37. Rapat 60 menit habis membahas tabel di halaman 12 (yang bahkan bukan inti rekomendasi). Keputusan: DITUNDA — “kami perlu waktu mempelajari”.",
        "Seniornya, Bu Ratna, menulis ulang dalam satu malam menjadi 4 halaman: halaman 1 = keputusan yang diminta komite + rekomendasi + tiga angka kunci; halaman 2–3 = bukti (atribusi satu halaman); halaman 4 = risiko dan yang bisa salah. Lampiran 40 halaman tetap dilampirkan — sebagai BUKTI, bukan sebagai bacaan. Rapat berikutnya: disetujui dalam 15 menit.",
        "Twist-nya: komite tidak menolak analisis Rian — mereka tidak pernah SAMPAI ke analisisnya. Deliverable institusi bukan dinilai dari ketebalan analisis, melainkan dari satu hal: apakah pengambil keputusan bisa MEMUTUSKAN setelah membacanya. Lesson ini tentang anatomi laporan yang dibaca: struktur keputusan-dulu, atribusi satu halaman, dan bahasa risiko untuk non-teknis.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menyusun struktur laporan komite 4 halaman (keputusan → rekomendasi → bukti → risiko); (2) menulis atribusi kinerja dalam satu halaman yang menjawab “darimana return berasal”; (3) menerjemahkan risiko teknis menjadi bahasa keputusan untuk non-teknis; (4) mengidentifikasi lima kesalahan format yang membunuh kredibilitas; (5) menilai kelayakan sebuah draf laporan dengan rubrik elemen wajib.",
        "Daftar isi: 1) Cerita 40 halaman · 2) Modal dasar: anatomi 4 halaman · 3) Konsep: bahasa risiko · 4) Rumus atribusi Brinson · 5) Lab: audit draf laporan berantakan · 6) Chart struktur · 7) Peta keputusan · 8) Mini-case: memo rebalancing Rp1,2T · 9) Checkpoint.",
        "Metadata: ±60 menit · 1 lab Python · 1 chart · 6 kuis · 1 mini-case. Prasyarat: tidak ada.",
      ],
      tasks: [],
      reference: "Deliverable yang baik = pengambil keputusan bisa memutuskan setelah membacanya.",
    },
    {
      id: "modal-anatomi",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Anatomi 4 halaman: keputusan dulu, bukti kemudian",
      prose: [
        "Fondasi — struktur memo komite yang bekerja. HALAMAN 1 — KEPUTUSAN YANG DIMINTA: satu paragraf (“Komite diminta menyetujui…”) + rekomendasi eksplisit (BELI/TAHAN/JUAL/REBALANCE) + tiga angka kunci. HALAMAN 2 — BUKTI SATU HALAMAN: atribusi kinerja — darimana return berasal, dalam bahasa awam. HALAMAN 3 — RISIKO: apa yang bisa salah, seberapa besar, dan pemicunya — jujur, bukan disclaimer. HALAMAN 4 — LAMPIRAN TERPILIH: hanya yang mendukung keputusan; sisanya tersedia bila ditanya.",
        "Logikanya: komite investasi adalah pengambil keputusan BERWAKTU — mereka membaca puluhan memo. Halaman 1 menentukan apakah halaman 2 dibaca. Analis yang menaruh rekomendasi di halaman 37 sedang bermain lotre perhatian.",
        "Lesson ini menjawab: bagaimana menulis agar dibaca — struktur, atribusi, bahasa risiko, dan rubrik penilaiannya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tulis untuk pembaca yang lelah",
        body: "Bayangkan pembacamu baru selesai 3 rapat dan punya 10 menit sebelum rapatmu. Jika ia hanya membaca halaman 1, apakah ia tahu apa yang diminta, apa rekomendasimu, dan kenapa? Jika ya — laporanmu bekerja. Jika tidak — 39 halaman sisanya tidak akan menyelamatkannya.",
      },
      reference: "Halaman 1 = keputusan. Sisanya = alasan untuk percaya.",
    },
    {
      id: "konsep-bahasa",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Si Penerjemah: bahasa risiko untuk non-teknis",
      prose: [
        "Definisi: bahasa risiko untuk non-teknis adalah penerjemahan ukuran teknis menjadi kalimat keputusan — bukan penyederhanaan yang menghilangkan makna, melainkan jembatan antara angka dan tindakan.",
        "Contoh pola terjemahannya. “Tracking error 2,1%” → “Dalam tahun normal, return kita bisa meleset ±2% dari benchmark — masih dalam mandat 3%.” “Maximum drawdown -18%” → “Pada skenario stres 2008-terulang, dana bisa turun Rp216 miliar dari Rp1,2 triliun — dan butuh ~2 tahun untuk pulih berdasarkan histori.” “VaR 95% Rp30 miliar” → “Dalam 19 dari 20 hari, kerugian harian tidak melebihi Rp30 miliar — tetapi di 1 hari sisanya, kerugiannya BISA jauh lebih besar (VaR tidak bercerita tentang ekor).”",
        "Kepribadiannya: penerjemah yang baik adalah SI PENERJEMAH yang setia pada dua bahasa — ia tidak mengarang (angka tetap angka), tetapi ia tahu bahwa “2,1%” tidak berarti apa-apa bagi direksi sampai diubah menjadi rupiah, skenario, dan keputusan. Analis yang hanya bisa bicara bahasa teknis sedang berbicara sendirian.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “laporan makin tebal makin meyakinkan”",
        type: "pitfall",
        body: "Yang benar: ketebalan tanpa struktur justru menurunkan kepercayaan — komite membaca ketebalan sebagai “analisnya sendiri tidak tahu mana yang penting”. Keyakinan datang dari rekomendasi yang eksplisit + risiko yang jujur, bukan dari jumlah lampiran.",
      },
      reference: "Angka → rupiah → skenario → keputusan. Itu urutan terjemahannya.",
    },
    {
      id: "konsep-atribusi",
      eyebrow: "Langkah 4 · Konsep inti + rumus",
      title: "Atribusi Brinson: darimana return berasal, dalam satu halaman",
      prose: [
        "Halaman bukti terbaik dalam laporan komite adalah atribusi: memecah kelebihan return (vs benchmark) menjadi keputusan ALOKASI (pilih kelas aset yang tepat) vs SELEKSI (pilih sekuritas yang tepat di dalam kelas aset). Rumusnya:",
      ],
      formula: String.raw`\text{Excess} = \sum_i (w_{p,i} - w_{b,i})\, r_{b,i} + \sum_i w_{p,i}\, (r_{p,i} - r_{b,i})`,
      formulaNote:
        "w_p,i / w_b,i = bobot kelas aset i di portofolio / benchmark; r_p,i / r_b,i = return kelas aset i di portofolio / benchmark. Suku pertama = efek ALOKASI (bobot beda × return benchmark); suku kedua = efek SELEKSI (bobot portofolio × return beda). Contoh: saham OW 10pp (w_p−w_b = 0,10) dengan r_b = 10% → alokasi = 0,10 × 0,10 = 1,0pp. Ditambah seleksi: w_p = 0,60 × (14% − 10%) = 2,4pp. Total excess dari saham = 3,4pp — dan komite langsung tahu: manajer menang karena pilih sektor DAN pilih sahamnya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “jargon menunjukkan kompetensi”",
        type: "pitfall",
        body: "Yang benar: di depan komite, jargon yang tidak diterjemahkan menunjukkan analisnya tidak memahami audiensnya. Kompetensi justru terlihat saat konsep sulit dijelaskan sederhana TANPA kehilangan makna — “tracking error” menjadi “meleset ±2% dari benchmark”.",
      },
      reference: "Atribusi menjawab satu pertanyaan komite: “jadi kamu dibayar untuk apa?”.",
    },
    {
      id: "lab-laporan",
      eyebrow: "Langkah 5 · Lab",
      title: "Audit draf laporan berantakan — layak atau tidak?",
      prose: [
        "Lab ini mensimulasikan pekerjaan Bu Ratna: sebuah draf laporan datang dengan enam blok dalam urutan acak. Tugasmu: (1) hitung KELENGKAPAN — berapa dari 4 elemen wajib (keputusan, rekomendasi, bukti, risiko) yang ada; (2) hitung SKOR URUTAN — 1 dikurangi proporsi pasangan blok yang urutannya terbalik dari urutan benar (maksimum 15 inversi untuk 6 blok); (3) beri VONIS: LAYAK hanya jika kelengkapan 100% DAN skor urutan ≥ 0,8.",
        "Draf contoh ini lengkap (100%) tetapi urutannya kacau: skor urutan hanya 0,33 — vonis: TIDAK LAYAK. Persis seperti laporan Rian: isinya ada semua, tetapi komite tidak bisa menggunakannya.",
        "Coba: susun ulang list `blok` menjadi urutan benar, jalankan ulang — skor urutan menjadi 1,00 dan vonis berubah LAYAK. Itulah “satu malam Bu Ratna” dalam bentuk angka.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kelengkapan` = (elemen wajib yang ada) / 4" },
        { id: "t2", text: "Hitung `inversi` (pasangan blok yang terbalik vs `urutan_benar`), `skor_urutan = 1 − inversi/15`, dan `vonis`; cetak persis format contoh" },
      ],
      expected: "Kelengkapan=100%  Skor urutan=0.33  Vonis: TIDAK LAYAK",
      code: {
        starter: `# Blok draf laporan (id, judul) — urutannya acak
blok = [
    ("lampiran", "Lampiran: tabel 40 halaman"),
    ("risiko", "Risiko utama"),
    ("keputusan", "Keputusan yang diminta komite"),
    ("bukti", "Bukti: atribusi 1 halaman"),
    ("latar", "Latar belakang 10 halaman"),
    ("rekomendasi", "Rekomendasi"),
]
urutan_benar = ["keputusan", "rekomendasi", "bukti", "risiko", "latar", "lampiran"]
elemen_wajib = {"keputusan", "rekomendasi", "bukti", "risiko"}

# TULIS KODEMU
kelengkapan =
inversi =
skor_urutan =
vonis =

print(f"Kelengkapan={kelengkapan:.0%}  Skor urutan={skor_urutan:.2f}  Vonis: {vonis}")`,
        lockLines: 10,
        solution: `# Blok draf laporan (id, judul) — urutannya acak
blok = [
    ("lampiran", "Lampiran: tabel 40 halaman"),
    ("risiko", "Risiko utama"),
    ("keputusan", "Keputusan yang diminta komite"),
    ("bukti", "Bukti: atribusi 1 halaman"),
    ("latar", "Latar belakang 10 halaman"),
    ("rekomendasi", "Rekomendasi"),
]
urutan_benar = ["keputusan", "rekomendasi", "bukti", "risiko", "latar", "lampiran"]
elemen_wajib = {"keputusan", "rekomendasi", "bukti", "risiko"}

# TULIS KODEMU
ada = set(b[0] for b in blok)
kelengkapan = len(elemen_wajib & ada) / len(elemen_wajib)
pos = {bid: i for i, bid in enumerate(urutan_benar)}
seq = [pos[b[0]] for b in blok]
inversi = sum(1 for i in range(len(seq)) for j in range(i + 1, len(seq)) if seq[i] > seq[j])
skor_urutan = 1 - inversi / 15
vonis = "LAYAK" if kelengkapan == 1.0 and skor_urutan >= 0.8 else "TIDAK LAYAK"

print(f"Kelengkapan={kelengkapan:.0%}  Skor urutan={skor_urutan:.2f}  Vonis: {vonis}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kelengkapan", value: 1.0, tol: 1e-9, label: "`kelengkapan` = 100%", msg: "Keempat elemen wajib ada — masalahnya bukan kelengkapan." },
          { kind: "equal", task: "t2", name: "skor_urutan", value: 0.3333333333333333, tol: 1e-9, label: "`skor_urutan` ≈ 0,33", msg: "10 inversi dari 15 maksimum — urutan berantakan." },
          { kind: "equal", task: "t2", name: "vonis", value: "TIDAK LAYAK", label: "`vonis` = TIDAK LAYAK", msg: "Lengkap tapi tak terbaca = tidak layak untuk komite." },
          { kind: "stdout_matches", task: "t2", pattern: "Vonis: TIDAK LAYAK", label: "`print` menampilkan vonis", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Lengkap ≠ layak. Urutan adalah bagian dari isi.",
    },
    {
      id: "chart-struktur",
      eyebrow: "Langkah 6 · Konsep + chart",
      title: "Satu malam Bu Ratna, dalam satu gambar",
      prose: [
        "Chart di bawah membandingkan struktur draf Rian (kiri) dengan memo Bu Ratna (kanan). Perhatikan di mana “Rekomendasi” berada: halaman 37 vs halaman 1.",
        "Cara membaca chart: tiap kotak = satu bagian laporan; urutan dari atas = urutan baca; kotak merah = rekomendasi yang terkubur; kotak putus-putus = lampiran yang hanya dibaca bila perlu.",
        "Interpretasi: perbedaan keduanya BUKAN jumlah analisis — lampiran 40 halaman tetap ada di versi kanan, hanya dipindah ke peran yang benar (bukti, bukan bacaan). Deliverable institusi adalah soal ARSITEKTUR INFORMASI: keputusan di depan, bukti di tengah, detail di belakang. Analis hebat menulis dua dokumen sekaligus: memo 4 halaman untuk memutuskan, lampiran untuk membuktikan.",
      ],
      figure: { svg: LAPORAN_SVG, alt: "Perbandingan struktur laporan: draf 40 halaman vs memo 4 halaman dengan keputusan di halaman 1.", caption: "Arsitektur informasi: keputusan di depan, bukti di tengah, detail di belakang." },
      tasks: [],
      reference: "Tulis dua dokumen: memo untuk memutuskan, lampiran untuk membuktikan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: format mengikuti audiens",
      prose: [
        "Skenario 1 — Audiens komite investasi (pengambil keputusan berwaktu) → MEMO 4 HALAMAN: keputusan di hal. 1, bukti 1 halaman, risiko jujur. Alasan: mereka memutuskan, bukan mempelajari.",
        "Skenario 2 — Audiens klien ritel / peserta dana pensiun → SURAT 1 HALAMAN bahasa awam: “dana Anda turun X karena Y; yang kami lakukan Z”. Alasan: kepercayaan ritel dibangun dari keterbukaan, bukan kecanggihan.",
        "Skenario 3 — Audiens regulator / auditor → DOKUMEN LENGKAP + jejak audit: metodologi, asumsi, dan setiap angka bisa dilacak. Alasan: yang diuji adalah kepatuhan proses, bukan kecepatan baca.",
        "Skenario 4 — Rekomendasi ditolak komite → JANGAN tambah halaman; minta umpan balik spesifik (“bagian mana yang kurang meyakinkan?”), revisi TERTARGET. Alasan: penolakan biasanya soal satu keraguan — temukan dan jawab itu.",
        "Aturan praktis 10 detik: sebelum menulis, tulis dulu SATU KALIMAT: “setelah membaca ini, pembaca harus bisa memutuskan ___.” Jika kalimat itu kosong, jangan mulai menulis — pikirkan dulu keputusannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Satu laporan untuk semua audiens — memo komite yang dikirim mentah ke klien ritel (menakutkan), atau surat klien yang dipakai ke regulator (tidak cukup detail). Format mengikuti audiens; isi mengikuti keputusan.",
      },
      reference: "Satu kalimat keputusan dulu — baru menulis.",
    },
    {
      id: "minicase-rebalancing",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Memo rebalancing Rp1,2 triliun",
      prose: [
        "Kasus: Dana pensiun Rp1,2 triliun menyimpang dari target alokasi: saham 68% (target 60%), obligasi 22% (target 30%), kas 10%. Atribusi tahun berjalan: excess return +3,4pp — alokasi +1,0pp (overweight saham yang rally), seleksi +2,4pp (pemilihan saham unggul). Risiko: rebalancing Rp96 miliar butuh 8 hari (DTL), dan penjualan di pasar tipis akhir tahun bisa berbiaya 0,4%.",
        "Pertanyaan 1: Susun halaman 1 memo komite (keputusan + rekomendasi + 3 angka kunci) dalam 5 baris.",
        "Pertanyaan 2: Bagaimana menyampaikan risiko biaya 0,4% agar komite bisa memutuskan (bukan sekadar “ada risiko”)?",
        "Pembahasan: (1) Contoh halaman 1: “Komite diminta menyetujui rebalancing Rp96 miliar (saham 68%→60%). Rekomendasi: SETUJU, eksekusi bertahap 8 hari. Tiga angka: excess +3,4pp (alokasi +1,0pp, seleksi +2,4pp); biaya eksekusi estimasi 0,4% ≈ Rp384 juta; DTL 8 hari — melewati libur akhir tahun.” (2) Terjemahkan: “Biaya Rp384 juta = 0,03% dari dana — vs risiko drift alokasi yang dalam setahun bisa menggeser profil risiko dana senilai 8pp ekuitas. Keputusan: bayar biaya kecil yang pasti, hindari risiko besar yang kabur.”",
      ],
      tasks: [],
      reference: "Biaya pasti yang kecil vs risiko kabur yang besar — komite memutuskan dengan perbandingan itu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran — dari anatomi memo hingga atribusi."],
      tasks: [],
      summary: [
        "Struktur memo komite: keputusan (hal. 1) → rekomendasi → bukti 1 halaman → risiko → lampiran sebagai bukti.",
        "Bahasa risiko = angka → rupiah → skenario → keputusan; jargon tanpa terjemahan = berbicara sendirian.",
        "Atribusi Brinson: excess = efek alokasi + efek seleksi — menjawab “dibayar untuk apa?”.",
        "Rubrik draf: kelengkapan 100% DAN skor urutan ≥ 0,8 — lengkap tapi tak terbaca = tidak layak.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Di mana rekomendasi seharusnya berada dalam memo komite?",
          options: [
            { text: "Di akhir, sebagai kesimpulan logis", why: "Salah: logika “kesimpulan di akhir” bekerja untuk makalah, bukan untuk pembaca berwaktu — mereka tidak sampai ke akhir." },
            { text: "Di halaman 1, bersama keputusan yang diminta", why: "Tepat: halaman 1 menentukan apakah halaman 2 dibaca.", correct: true },
            { text: "Di lampiran, agar tidak mengganggu alur", why: "Salah: rekomendasi di lampiran = tidak ada rekomendasi." },
            { text: "Tidak perlu tertulis — sampaikan lisan", why: "Salah: keputusan institusi harus tertulis dan terdokumentasi." },
          ],
        },
        {
          q: "Excess return +3,4pp dengan alokasi +1,0pp. Berapa kontribusi seleksi?",
          options: [
            { text: "4,4pp", why: "Salah: itu penjumlahan — atribusi adalah dekomposisi, bukan penjumlahan." },
            { text: "2,4pp", why: "Tepat: 3,4 − 1,0 = 2,4pp — manajer menang di pemilihan sahamnya.", correct: true },
            { text: "1,0pp", why: "Salah: itu kontribusi alokasi, bukan seleksi." },
            { text: "Tidak bisa dihitung", why: "Salah: excess = alokasi + seleksi, maka seleksi = excess − alokasi." },
          ],
        },
        {
          q: "Terjemahan terbaik untuk “tracking error 2,1%, batas mandat 3%” ke direksi?",
          options: [
            { text: "“Tracking error kita 2,1%”", why: "Salah: angka mentah tanpa makna keputusan." },
            { text: "“Dalam tahun normal, return bisa meleset ±2% dari benchmark — masih dalam mandat 3%”", why: "Tepat: angka → implikasi → status vs batas — direksi bisa memutuskan.", correct: true },
            { text: "“Risiko kita terkendali”", why: "Salah: klaim tanpa angka = opini kosong." },
            { text: "“Rumusnya akar rata-rata kuadrat deviasi…”", why: "Salah: menjelaskan rumus ke direksi = berbicara sendirian." },
          ],
        },
        {
          q: "Draf laporan lengkap 100% tetapi skor urutan 0,33. Vonis menurut rubrik lesson ini?",
          options: [
            { text: "LAYAK — yang penting lengkap", why: "Salah: rubrik menuntut kelengkapan 100% DAN skor urutan ≥ 0,8." },
            { text: "TIDAK LAYAK — lengkap tapi tak terbaca", why: "Tepat: urutan adalah bagian dari isi; komite tidak bisa memakai draf yang berantakan.", correct: true },
            { text: "LAYAK dengan catatan", why: "Salah: tidak ada “catatan” dalam rubrik — ambangnya tegas." },
            { text: "Kembalikan ke analis tanpa dibaca", why: "Salah: vonisnya TIDAK LAYAK dengan alasan jelas — umpan balik spesifik, bukan penolakan buta." },
          ],
        },
        {
          q: "Komite menolak rekomendasi. Langkah pertama yang tepat?",
          options: [
            { text: "Tambah 20 halaman analisis pendukung", why: "Salah: penolakan jarang soal kurangnya halaman." },
            { text: "Minta umpan balik spesifik tentang keraguan mereka, revisi tertarget", why: "Tepat: temukan SATU keraguan yang sebenarnya, jawab itu.", correct: true },
            { text: "Ajukan lagi bulan depan tanpa perubahan", why: "Salah: itu menguji kesabaran, bukan menjawab keraguan." },
            { text: "Sampaikan lewat jalur informal agar lolos", why: "Salah: keputusan institusi harus lewat proses formal yang terdokumentasi." },
          ],
        },
        {
          q: "Lampiran 40 halaman dalam memo 4 halaman berperan sebagai…",
          options: [
            { text: "Bacaan wajib sebelum memutuskan", why: "Salah: jika wajib dibaca, ia bukan lampiran." },
            { text: "Bukti yang tersedia bila ditanya — bukan bacaan utama", why: "Tepat: arsitektur informasi — keputusan di depan, bukti di tengah, detail di belakang.", correct: true },
            { text: "Pemanis agar terlihat serius", why: "Salah: dekorasi tanpa fungsi merusak kepercayaan saat dibuka." },
            { text: "Tidak perlu dilampirkan", why: "Salah: tanpa bukti yang bisa diaudit, memo hanyalah opini." },
          ],
        },
      ],
    },
  ],
};
