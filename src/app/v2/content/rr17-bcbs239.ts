import type { V2Lesson } from "../lib/types";

const FIG_RDARR = `<svg viewBox="0 0 480 260" role="img" aria-label="Skor kematangan empat prinsip BCBS 239 Bank Artha Dana.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)">Akurasi</text>
<rect x="130" y="36" width="238" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="374" y="54" font-size="11" fill="var(--chart-text)">72</text>
<text x="10" y="102" font-size="12" fill="var(--chart-text)">Integritas</text>
<rect x="130" y="86" width="198" height="26" fill="var(--c2)" opacity="0.9"/>
<text x="334" y="104" font-size="11" fill="var(--chart-text)">60</text>
<text x="10" y="152" font-size="12" fill="var(--chart-text)">Kelengkapan</text>
<rect x="130" y="136" width="264" height="26" fill="var(--c3)" opacity="0.9"/>
<text x="400" y="154" font-size="11" fill="var(--chart-text)">80</text>
<text x="10" y="202" font-size="12" fill="var(--chart-text)">Ketepatan waktu</text>
<rect x="130" y="186" width="182" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="318" y="204" font-size="11" fill="var(--chart-text)">55</text>
<line x1="383" y1="20" x2="383" y2="220" stroke="var(--chart-text)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="383" y="240" font-size="11" fill="var(--chart-text)" text-anchor="middle">target 85</text>
<text x="240" y="258" font-size="11" fill="var(--chart-text)" text-anchor="middle">Rata-rata 67: dua prinsip di bawah target = program perbaikan.</text>
</g>
</svg>`;

export const rr17: V2Lesson = {
  slug: "rr17-bcbs239",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR17 — BCBS 239: Risk Data Aggregation & Reporting",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "NPL 3,4% atau 3,5%: mana yang benar?",
      prose: [
        "Rapat direksi Bank Artha Dana. Slide CRO: NPL 3,4%. Slide direktur keuangan: NPL 3,5%. Direksi menatap bergantian: 'Mana yang benar?' Hening. Investigasi 2 hari menemukan: keduanya benar — dari sistem yang berbeda. CRO menarik dari data warehouse (T+1, definisi DPD > 90 hari per kamus v3.2); keuangan dari core banking langsung (real-time, cut-off berbeda 6 jam, definisi kolektibilitas 3–5).",
        "Twist-nya: tidak ada yang salah hitung, tidak ada yang berbohong. Masalahnya justru itu: bank tidak bisa menjawab 'mana yang benar' karena tidak punya SATU sumber kebenaran. Setiap direksi yang mendengar dua angka berbeda untuk metrik yang sama kehilangan kepercayaan — bukan ke angkanya, melainkan ke seluruh fungsi pelaporan.",
        "Inilah masalah yang dijawab BCBS 239 (Risk Data Aggregation & Risk Reporting / RDARR): standar global bahwa bank harus bisa mengagregasi data risiko secara akurat, utuh, dan tepat waktu — bahkan saat krisis. Empat prinsipnya: akurasi & integritas, kelengkapan, ketepatan waktu, adaptabilitas. Lesson ini = fondasi tata kelola data untuk semua lesson RR.",
        "Setelah lesson ini kamu bisa: (1) menyebutkan 4 prinsip BCBS 239 dan contohnya; (2) menghitung skor kematangan RDARR; (3) mengaudit ketepatan waktu laporan vs SLA; (4) menjelaskan golden source dan bahaya spreadsheet manual.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua angka berbeda = direksi menunda keputusan (ingat RR3: penundaan Rp200 miliar karena dua NPL). Biaya data buruk bukan denda regulator — melainkan keputusan yang tidak diambil saat seharusnya diambil.",
      },
      reference: "BCBS 239: satu angka, satu kebenaran. Empat prinsip = fondasinya.",
    },
    {
      id: "prinsip",
      eyebrow: "Langkah 2 · Konsep",
      title: "Empat prinsip RDARR",
      prose: [
        "Satu — Akurasi & integritas: angka benar DAN bisa diverifikasi. Rekonsiliasi otomatis (ingat RR4), kontrol manual yang terdokumentasi, dan tidak ada 'penyesuaian Excel' tanpa jejak. Skor Artha Dana: 72 — rekonsiliasi ada, tetapi 30% laporan masih lewat spreadsheet manual.",
        "Dua — Kelengkapan: semua risiko material tercakup, semua entitas tercakup. Bank dengan 3 anak perusahaan tetapi laporan risiko hanya 1 = tidak lengkap. Skor 80 — entitas lengkap, tetapi risiko pasar anak perusahaan sekuritas belum masuk.",
        "Tiga — Ketepatan waktu: data tersedia saat dibutuhkan, bukan saat sempat. NPL harian umur 26 jam vs SLA 24 jam = TELAT 2 jam. Di krisis, keterlambatan 2 jam = keputusan memakai data basi. Skor 55 — prinsip terlemah, prioritas perbaikan.",
        "Empat — Adaptabilitas: bisa menjawab pertanyaan adhoc baru dengan cepat (ingat RR9). 'Berapa eksposur ke sektor X?' harus terjawab dalam jam, bukan minggu. Diukur dari waktu respons adhoc rata-rata: Artha Dana 3 hari — target 4 jam.",
        "Cara membaca figur: empat batang = skor kematangan; garis putus-putus = target 85. Interpretasi: rata-rata 67, dua prinsip di bawah target — verdict BELUM SIAP, butuh program perbaikan. Prinsip terlemah (ketepatan waktu, 55) = prioritas pertama.",
      ],
      figure: {
        svg: FIG_RDARR,
        alt: "Skor kematangan empat prinsip BCBS 239.",
        caption: "Rata-rata 67 < target 85: program perbaikan, mulai dari ketepatan waktu.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“BCBS 239 = proyek IT.” IT membangun pipanya, tetapi akurasi definisi, kelengkapan cakupan, dan ketepatan waktu adalah tanggung jawab BISNIS (risk + finance). Proyek RDARR yang dipimpin murni IT = pipa bagus mengalirkan definisi yang salah.",
      },
      hints: [
        "Empat prinsip: akurasi, kelengkapan, ketepatan waktu, adaptabilitas.",
        "Skor < 70 = belum siap; 70–84 = program perbaikan; ≥85 = siap.",
      ],
      reference: "Akurasi, kelengkapan, ketepatan waktu, adaptabilitas. Terlemah dulu.",
    },
    {
      id: "agregasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Golden source vs spreadsheet liar",
      prose: [
        "Golden source = satu sistem/satu tabel yang menjadi rujukan resmi tiap metrik. NPL → fact_kredit di warehouse (bukan core banking langsung, bukan Excel analis). Semua laporan — direksi, komite, OJK — membaca dari sana. Dua angka berbeda (cerita pembuka) tidak mungkin terjadi jika keduanya membaca golden source yang sama.",
        "Musuh golden source: spreadsheet liar. Analis mengunduh data, 'membersihkan' di Excel, mengirim ke direksi — tanpa jejak, tanpa versi, tanpa bisa direproduksi. Satu spreadsheet liar = satu versi kebenaran tandingan. Aturan: spreadsheet boleh untuk ANALISIS, tidak boleh untuk LAPORAN. Laporan selalu dari sistem.",
        "Otomatisasi vs manual: agregasi manual (copy-paste 6 file tiap tanggal 5, ingat RR8) = lambat + rawan salah + tidak bisa dipercepat saat krisis. BCBS 239 menuntut agregasi yang bisa dipercepat saat stres — hanya pipeline otomatis yang bisa. Manual = tidak adaptif = gagal prinsip keempat.",
        "Data dictionary (kamus, RR3) adalah separuh golden source: tanpa definisi tunggal, satu sumber pun bisa menghasilkan dua angka (definisi DPD vs kolektibilitas di cerita pembuka). Golden source = sistem + definisi + pemilik.",
        "Contoh konkret migrasi: 30 laporan spreadsheet manual di Artha Dana dipetakan — 12 di antaranya adalah 'laporan' (dibaca direksi/komite/regulator) dan 18 'analisis' (dipakai analis sendiri). Yang 12 wajib migrasi ke warehouse dalam 90 hari; yang 18 boleh tetap, tetapi diberi watermark 'ANALISIS — BUKAN ANGKA RESMI'. Pembedaan ini penting: melarang total = analis bekerja diam-diam; mengizinkan tanpa label = angka liar beredar sebagai resmi.",
        "Ukur adaptabilitas dengan dua metrik: (1) waktu respons adhoc rata-rata (target ≤4 jam), (2) % laporan yang bisa di-regenerate untuk tanggal historis apa pun dalam 1 jam (target 100%). Yang kedua menguji 'time travel': saat direksi bertanya 'NPL Maret versi data Maret (bukan revisi)', sistem harus bisa merekonstruksi — butuh snapshot/versioning data (ingat RR8). Tanpa time travel, jawaban adhoc = tebakan berpenampilan data.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Tanya ke timmu: 'NPL resmi kita dari mana?' Jika jawabannya menyebut nama file Excel atau nama orang ('tanya Dewi'), kamu belum punya golden source — kamu punya penjaga gawang manusia. Manusia cuti; sistem tidak.",
      },
      reference: "Golden source = sistem + definisi + pemilik. Spreadsheet = analisis, bukan laporan.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 4 · Lab",
      title: "Skor kematangan RDARR",
      prose: [
        "Hitung skor kematangan 4 prinsip Bank Artha Dana dan verdict-nya. Ambang: ≥85 SIAP, 70–84 PROGRAM PERBAIKAN, <70 BELUM SIAP. Identifikasi prinsip terlemah sebagai prioritas.",
        "Eksperimen: naikkan 'Ketepatan waktu' menjadi 75 (otomasi pipeline NPL harian) — rata-rata menjadi 72 → PROGRAM PERBAIKAN. Satu perbaikan menaikkan verdict. Itulah gunanya skor: menunjukkan tuas terbesar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata`, `terendah`, dan `verdict`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Skor RDARR: 67 (terendah: Ketepatan waktu 55) -> BELUM SIAP",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Rata-rata 67, kurang 18 poin lagi.” Rata-rata menyembunyikan yang terlemah — prinsip 55 (ketepatan waktu) tidak tertolong oleh prinsip 80. Perbaiki yang terlemah dulu; rata-rata mengikuti.",
      },
      hints: [
        "rata = sum(skor.values()) / len(skor).",
        "terendah = min(skor, key=skor.get).",
      ],
      code: {
        starter: "# Skor 4 prinsip BCBS 239 Bank Artha Dana, 0-100 (JANGAN UBAH).\nskor = {\"Akurasi\": 72, \"Integritas\": 60, \"Kelengkapan\": 80, \"Ketepatan waktu\": 55}\n\n# TULIS KODEMU\nrata =\nterendah =\nverdict =\nprint(f\"Skor RDARR: {rata:.0f} (terendah: {terendah} {skor[terendah]}) -> {verdict}\")\n",
        lockLines: 2,
        solution: "# Skor 4 prinsip BCBS 239 Bank Artha Dana, 0-100 (JANGAN UBAH).\nskor = {\"Akurasi\": 72, \"Integritas\": 60, \"Kelengkapan\": 80, \"Ketepatan waktu\": 55}\n\n# TULIS KODEMU\nrata = sum(skor.values()) / len(skor)\nterendah = min(skor, key=skor.get)\nverdict = \"SIAP\" if rata >= 85 else (\"PROGRAM PERBAIKAN\" if rata >= 70 else \"BELUM SIAP\")\nprint(f\"Skor RDARR: {rata:.0f} (terendah: {terendah} {skor[terendah]}) -> {verdict}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`rata` = 67", msg: "(72+60+80+55)/4 = 66,75 → 67.", name: "rata", value: 66.75, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Verdict BELUM SIAP", msg: "67 < 70.", pattern: "Skor RDARR: 67 \\(terendah: Ketepatan waktu 55\\) -> BELUM SIAP" }
        ],
      },
      reference: "Skor = rata-rata 4 prinsip; perbaiki yang terlemah dulu.",
    },
    {
      id: "lab-waktu",
      eyebrow: "Langkah 5 · Lab",
      title: "Audit ketepatan waktu vs SLA",
      prose: [
        "Empat laporan, masing-masing punya SLA umur data. Bandingkan umur aktual vs SLA — yang TELAT masuk daftar percepatan. NPL harian: 26 jam vs 24 = TELAT 2 jam (kasus cerita pembuka versi mini).",
        "Ketepatan waktu bukan soal kecepatan absolut — melainkan soal janji (SLA) yang ditepati. Laporan triwulanan umur 1.500 jam vs SLA 2.160 = TEPAT, walau 'lebih lambat' dari NPL harian. Setiap laporan dinilai terhadap janjinya sendiri.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan `status` tiap laporan dan kumpulkan yang telat" },
        { id: "t2", text: "Jalankan dan pastikan daftar tercetak" },
      ],
      expected: "NPL harian: umur 26 jam vs SLA 24 -> TELAT\nLCR harian: umur 20 jam vs SLA 24 -> TEPAT\nKPMM bulanan: umur 400 jam vs SLA 360 -> TELAT\nProfil risiko triwulanan: umur 1500 jam vs SLA 2160 -> TEPAT\nPerlu percepatan: ['NPL harian', 'KPMM bulanan']",
      note: {
        title: "Intuisi",
        body: "SLA umur data = kontrak dengan pembaca. 'Laporan harian' yang memakai data 26 jam = laporan 'kemarin lusa' yang berlabel harian. Label tanpa SLA = janji tanpa ukuran.",
      },
      hints: [
        "status = TEPAT jika umur <= sla.",
        "Kumpulkan nama yang TELAT ke list telat.",
      ],
      code: {
        starter: "# Umur data (jam) vs SLA tiap laporan (JANGAN UBAH).\nlaporan = [(\"NPL harian\", 26, 24), (\"LCR harian\", 20, 24),\n           (\"KPMM bulanan\", 400, 360), (\"Profil risiko triwulanan\", 1500, 2160)]\n\n# TULIS KODEMU\ntelat = []\nfor nama, umur, sla in laporan:\n    status =\n    print(f\"{nama}: umur {umur} jam vs SLA {sla} -> {status}\")\n    if status == \"TELAT\":\n        telat.append(nama)\nprint(f\"Perlu percepatan: {telat if telat else 'tidak ada'}\")\n",
        lockLines: 4,
        solution: "# Umur data (jam) vs SLA tiap laporan (JANGAN UBAH).\nlaporan = [(\"NPL harian\", 26, 24), (\"LCR harian\", 20, 24),\n           (\"KPMM bulanan\", 400, 360), (\"Profil risiko triwulanan\", 1500, 2160)]\n\n# TULIS KODEMU\ntelat = []\nfor nama, umur, sla in laporan:\n    status = \"TEPAT\" if umur <= sla else \"TELAT\"\n    print(f\"{nama}: umur {umur} jam vs SLA {sla} -> {status}\")\n    if status == \"TELAT\":\n        telat.append(nama)\nprint(f\"Perlu percepatan: {telat if telat else 'tidak ada'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "NPL harian TELAT", msg: "26 > 24.", pattern: "NPL harian: umur 26 jam vs SLA 24 -> TELAT" },
          { kind: "stdout_matches", task: "t2", label: "Daftar percepatan benar", msg: "NPL harian + KPMM bulanan.", pattern: "Perlu percepatan: \\['NPL harian', 'KPMM bulanan'\\]" }
        ],
      },
      reference: "Tepat waktu = umur ≤ SLA. Yang telat = program percepatan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Temuan RDARR: respons apa",
      prose: [
        "Satu: dua angka berbeda untuk satu metrik → tetapkan golden source + definisi tunggal minggu ini; rekonsiliasi tertulis sementara. Dua: laporan lewat spreadsheet manual → migrasi ke pipeline otomatis; spreadsheet hanya untuk analisis. Tiga: umur data > SLA → percepat ETL atau longgarkan SLA dengan persetujuan (jangan diam-diam telat). Empat: pertanyaan adhoc butuh 3 hari → bangun lapisan agregat siap-query (datamart), target respons 4 jam.",
        "Aturan praktis 10 detik: angka beda → golden source. Manual → otomasi. Telat → percepat atau negosiasi SLA. Lambat adhoc → datamart.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "BCBS 239 bukan sertifikasi sekali jadi — ia otot yang dilatih. Bank yang 'lolos assessment' lalu kembali ke spreadsheet = atlet yang menang sekali lalu berhenti latihan. Skor kematangan di lab ini layak dihitung tiap kuartal.",
      },
      reference: "Golden source dulu, otomasi kemudian, datamart untuk adhoc.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Skor kepatuhan",
      title: "Seberapa patuh bankmu?",
      prose: [
        "Lab 1–2 menilai satu prinsip. Lab ini mengagregasi 11 prinsip BCBS 239 menjadi skor kepatuhan: tiap prinsip dinilai 1–4 (1 = tidak patuh, 4 = penuh). Rata-rata 2,1 = 'sebagian besar belum patuh' — dan regulator bisa membatasi ekspansi bisnis sampai skor naik.",
        "Prinsip dengan skor 1 (tata kelola data, keakuratan) adalah prioritas remediasi — bukan prinsip yang sudah 3. Alokasi anggaran mengikuti skor terendah, bukan yang paling mudah diperbaiki.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata 11 prinsip" },
        { id: "t2", text: "Jalankan dan temukan prinsip terlemah" },
      ],
      expected: "Rata-rata: 2.1/4 -> BELUM PATUH\nTerlemah: Tata kelola data (1), Keakuratan (1)",
      note: {
        title: "Rata-rata menutupi kanker.",
        type: "pitfall",
        body: "“Rata-rata 2,1, lumayan.” Satu prinsip skor 1 di tata kelola = fondasi rapuh; sebelas prinsip skor 2 = fondasi rapuh juga. Rata-rata tidak membedakan — daftar prinsip terlemah yang menentukan prioritas.",
      },
      hints: [
        "rata = sum(skor.values())/len(skor).",
        "terlemah = [k for k, v in skor.items() if v == min(skor.values())].",
      ],
      code: {
        starter: "# Skor 11 prinsip BCBS 239 (1-4). JANGAN UBAH.\nskor = {\"Tata kelola data\": 1, \"Arsitektur IT\": 2, \"Keakuratan\": 1, \"Integritas\": 2, \"Kelengkapan\": 3, \"Ketepatan waktu\": 2, \"Adaptabilitas\": 2, \"Akurasi agregasi\": 3, \"Pelaporan\": 2, \"Frekuensi\": 3, \"Distribusi\": 2}\n\n# TULIS KODEMU: rata-rata + prinsip terlemah\nrata = \nterlemah = [k for k, v in skor.items() if v == min(skor.values())]\nprint(f\"Rata-rata: {rata:.1f}/4 -> {'PATUH' if rata >= 3 else 'BELUM PATUH'}\")\nprint(f\"Terlemah: {', '.join(f'{k} ({skor[k]})' for k in terlemah)}\")",
        lockLines: 4,
        solution: "# Skor 11 prinsip BCBS 239 (1-4). JANGAN UBAH.\nskor = {\"Tata kelola data\": 1, \"Arsitektur IT\": 2, \"Keakuratan\": 1, \"Integritas\": 2, \"Kelengkapan\": 3, \"Ketepatan waktu\": 2, \"Adaptabilitas\": 2, \"Akurasi agregasi\": 3, \"Pelaporan\": 2, \"Frekuensi\": 3, \"Distribusi\": 2}\n\n# TULIS KODEMU: rata-rata + prinsip terlemah\nrata = sum(skor.values())/len(skor)\nterlemah = [k for k, v in skor.items() if v == min(skor.values())]\nprint(f\"Rata-rata: {rata:.1f}/4 -> {'PATUH' if rata >= 3 else 'BELUM PATUH'}\")\nprint(f\"Terlemah: {', '.join(f'{k} ({skor[k]})' for k in terlemah)}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Rata-rata", msg: "2,1 = BELUM PATUH.", pattern: "Rata-rata: 2\.1/4 -\> BELUM PATUH" },
          { kind: "stdout_matches", task: "t2", label: "Terlemah", msg: "Dua prinsip skor 1.", pattern: "Terlemah: Tata kelola data \\(1\\), Keakuratan \\(1\\)" }
        ],
      },
      reference: "Anggaran mengikuti skor terendah. Rata-rata 2,1 = ekspansi bisa dibatasi regulator.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Program 90 hari Artha Dana",
      prose: [
        "Skor awal: 67 (BELUM SIAP). Terlemah: ketepatan waktu 55, integritas 60. Budget: Rp500 juta, 90 hari. Tiga kandidat proyek: (A) Otomasi pipeline NPL harian Rp200 jt → ketepatan waktu 55→70. (B) Migrasi 30% laporan spreadsheet ke warehouse Rp250 jt → integritas 60→72. (C) Datamart adhoc Rp300 jt → adaptabilitas naik (tidak dihitung di 4 skor, tetapi SLA adhoc 3 hari→1 hari).",
        "Pertanyaan: pilih 2 proyek dalam budget, hitung skor akhir. Pembahasan: A + B = Rp450 jt ≤ 500. Skor baru: akurasi 72, integritas 72, kelengkapan 80, ketepatan waktu 70 → rata-rata 73,5 → PROGRAM PERBAIKAN. C ditunda ke kuartal berikut — bukan karena tidak penting, melainkan karena 4 prinsip inti harus ≥70 dulu. Pelajaran: sequence matters — fondasi (otomasi + integritas) sebelum kenyamanan (adhoc cepat).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Program RDARR tanpa sequencing = Rp500 juta habis untuk datamart yang cantik di atas data yang telat. Fondasi dulu: golden source + otomasi. Atap (adhoc cepat) belakangan.",
      },
      reference: "Budget terbatas → fondasi dulu (otomasi + integritas), atap belakangan.",
    },
    {
      id: "katalog-laporan",
      eyebrow: "Langkah 8 · Katalog",
      title: "Katalog laporan: peta semua laporan risiko",
      prose: [
        "Bank Artha Dana berumur 24 tahun. Sepanjang itu, tiap direksi dan tiap komite meminta 'laporan baru' — NPL harian, LCR mingguan, profil risiko triwulanan, dashboard khusus direksi, ringkasan untuk OJK. Suatu hari CRO baru bertanya pertanyaan sederhana: 'Kita punya berapa laporan risiko, sih?' Jawabannya mengejutkan: tidak ada yang tahu. Perkiraan kasar menyebut 60, tetapi pencarian manual menemukan 94 — termasuk 11 yang namanya sama tetapi isinya berbeda.",
        "Inilah fungsi katalog laporan: satu daftar resmi semua laporan risiko yang diproduksi. Tiap entri mencatat: nama laporan, pemilik (siapa yang bertanggung jawab), audiens (siapa yang membacanya), frekuensi, sumber data (idealnya golden source dari Lesson ini — Langkah 3), definisi kunci yang dipakai, dan tanggal review terakhir. Tanpa katalog, bank tidak bisa menjawab tiga pertanyaan dasar: apa yang kita laporkan, siapa yang bertanggung jawab, dan apakah semuanya masih perlu?",
        "Dua penyakit khas muncul saat audit katalog. Pertama, laporan yatim: laporan yang tidak punya pemilik. Dulu diminta direktur yang sudah pensiun; sampai sekarang masih dibuat tiap bulan oleh analis yang tidak berani berhenti karena 'siapa tahu masih dibaca'. Kedua, laporan zombie: masih diproduksi dan dikirim, tetapi tidak ada yang membacanya. Biaya keduanya bukan cuma jam kerja — melainkan risiko angka yatim/zombie dikutip sebagai angka resmi padahal tidak dipelihara.",
        "Rasionalisasi — menggabungkan atau memensiunkan laporan — wajib punya prosedur, bukan diam-diam berhenti. Alur sehat: umumkan kandidat pensiun ke audiens, beri masa tenggang 30–60 hari, sediakan pengalihan (laporan pengganti bila ada), lalu arsipkan dengan catatan tanggal pensiun. Berhenti diam-diam = pembaca lama merasa datanya 'hilang' dan membangun spreadsheet liar pengganti — mundur ke era sebelum katalog.",
        "💡 Intuisi: katalog laporan adalah kartu perpustakaan bank. Tanpa kartu katalog, tiap ruangan punya rak buku sendiri, tidak ada yang tahu koleksinya, dan buku yang sama ada dalam lima edisi berbeda. Dengan katalog, kamu tahu mana edisi resmi dan mana yang sudah kedaluwarsa.",
        "Katalog adalah perpanjangan prinsip BCBS 239: kelengkapan (semua laporan terdaftar, tidak ada yang liar) dan adaptabilitas (saat direksi meminta laporan baru, cek dulu katalog — mungkin 80% isinya sudah ada di laporan lain; gabungkan, bukan tambah).",
      ],
      tasks: [
        { id: "t1", text: "Buat 1 entri katalog lengkap untuk 'NPL harian' (pemilik, audiens, frekuensi, sumber, definisi, review terakhir)" },
        { id: "t2", text: "Identifikasi 1 laporan yatim dan 1 laporan zombie (hipotetis atau nyata) dan tulis alasan pensiunnya" },
      ],
      note: {
        title: "Mitos: katalog = dokumen sekali jadi.",
        type: "pitfall",
        body: "Yang benar: katalog adalah dokumen HIDUP. Tiap entri wajib punya tanggal review (mis. tahunan) dan pemilik yang menandatangani keabsahannya. Katalog tanpa review = arsip; arsip tidak mencegah laporan zombie baru lahir.",
      },
      reference: "Katalog = daftar resmi semua laporan: pemilik, audiens, sumber, definisi, review.",
    },
    {
      id: "change-management-laporan",
      eyebrow: "Langkah 9 · Perubahan",
      title: "Change management untuk laporan",
      prose: [
        "Empat jenis perubahan bisa menimpa sebuah laporan: definisi metrik berubah (NPL: DPD > 90 hari menjadi kolektibilitas 3–5), sumber data berubah (core banking langsung menjadi warehouse), format/audiens berubah, atau regulasi baru menambah kolom wajib. Masing-masing sah-sah saja — yang berbahaya adalah perubahan yang tidak tercatat. Laporan tanpa catatan perubahan = deret waktu yang tidak bisa dibandingkan antarperiode.",
        "Dampak terbesar ada di keterbandingan. Tren NPL 12 bulan terlihat membaik — tetapi jika definisi berubah di bulan ke-7 tanpa catatan, 'perbaikan' itu adalah artefak definisi, bukan perbaikan kualitas kredit. Keputusan yang diambil dari tren semu (mis. melonggarkan underwriting karena 'NPL membaik') bisa bernilai miliaran rupiah.",
        "Alur perubahan yang sehat: (1) usulan tertulis — apa yang berubah dan mengapa; (2) uji dampak — laporan historis mana yang terpengaruh, seberapa besar selisihnya; (3) persetujuan pemilik laporan (lihat katalog, Langkah 8); (4) catatan rilis — changelog tiap laporan, seperti changelog software. Tanpa persetujuan pemilik, perubahan = laporan yatim dalam bentuk lain.",
        "Saat definisi berubah, pilih satu dari dua: restatement atau jembatan. Restatement = hitung ulang seri historis dengan definisi baru (ideal, tetapi butuh data historis yang cukup). Jembatan (bridge) = sajikan dua seri berdampingan pada periode overlap — 'definisi lama' dan 'definisi baru' — lalu umumkan tanggal cutover. Yang dilarang: menyambung dua definisi dalam satu garis tanpa penjelasan.",
        "Komunikasi ke audiens adalah separuh pekerjaan. Setiap chart yang melewati masa transisi wajib membawa catatan kaki: 'Definisi NPL berubah mulai Juli (DPD>90d → kolektibilitas 3–5); tren sebelum Juli tidak sebanding.' Catatan kaki yang membosankan ini adalah yang membedakan analis profesional dari pembuat chart.",
        "💡 Intuisi: mengganti definisi tanpa catatan = mengganti penggaris di tengah mengukur. Tinggi badan 'tumbuh' 2 cm — padahal yang berubah penggarisnya. Seri data tanpa changelog = pengukuran dengan penggaris yang berganti-ganti tanpa diberi tahu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `tren_semu`, `tren_koreksi`, dan `selisih` (bias definisi)" },
        { id: "t2", text: "Jalankan dan pastikan kesimpulan tercetak" },
      ],
      expected: "Tren semu: -0.12 pp (terlihat membaik)\nTren terkoreksi: +0.48 pp (sebenarnya memburuk)\nBias definisi: 0.60 pp",
      note: {
        title: "Mitos: angka historis bisa dibandingkan begitu saja.",
        type: "pitfall",
        body: "Yang benar: sebelum membandingkan dua periode, cek dulu changelog definisi. Ada perubahan tanpa catatan? Maka yang kamu bandingkan adalah dua penggaris berbeda — restate atau bangun jembatan dulu, baru simpulkan tren.",
      },
      hints: [
        "tren_semu = rata-rata semester 2 − rata-rata semester 1 (apa adanya).",
        "Terapkan jembatan (+0.6) ke bulan 7–12, lalu hitung ulang trennya.",
      ],
      code: {
        starter: "# NPL bulanan Bank Artha Dana (%), 12 bulan. JANGAN UBAH.\nnpl = [3.4, 3.5, 3.6, 3.5, 3.7, 3.8,  # bulan 1-6: definisi lama\n       3.3, 3.4, 3.3, 3.5, 3.6, 3.7]  # bulan 7-12: definisi baru\njembatan = 0.6  # selisih terukur definisi baru vs lama (dari periode overlap)\n\n# TULIS KODEMU\ntren_semu =\nterkoreksi =\ntren_koreksi =\nselisih =\nprint(f\"Tren semu: {tren_semu:+.2f} pp (terlihat membaik)\")\nprint(f\"Tren terkoreksi: {tren_koreksi:+.2f} pp (sebenarnya memburuk)\")\nprint(f\"Bias definisi: {selisih:.2f} pp\")\n",
        lockLines: 6,
        solution: "# NPL bulanan Bank Artha Dana (%), 12 bulan. JANGAN UBAH.\nnpl = [3.4, 3.5, 3.6, 3.5, 3.7, 3.8,  # bulan 1-6: definisi lama\n       3.3, 3.4, 3.3, 3.5, 3.6, 3.7]  # bulan 7-12: definisi baru\njembatan = 0.6  # selisih terukur definisi baru vs lama (dari periode overlap)\n\n# TULIS KODEMU\ntren_semu = sum(npl[6:])/6 - sum(npl[:6])/6\nterkoreksi = npl[:6] + [x + jembatan for x in npl[6:]]\ntren_koreksi = sum(terkoreksi[6:])/6 - sum(terkoreksi[:6])/6\nselisih = tren_koreksi - tren_semu\nprint(f\"Tren semu: {tren_semu:+.2f} pp (terlihat membaik)\")\nprint(f\"Tren terkoreksi: {tren_koreksi:+.2f} pp (sebenarnya memburuk)\")\nprint(f\"Bias definisi: {selisih:.2f} pp\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`tren_semu` ≈ −0,12 pp", msg: "Rata-rata semester 2 − semester 1, apa adanya: (20,8/6) − (21,5/6).", name: "tren_semu", value: -0.117, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`tren_koreksi` ≈ +0,48 pp", msg: "Setelah jembatan +0,6 diterapkan ke bulan 7–12: (24,4/6) − (21,5/6).", name: "tren_koreksi", value: 0.483, tol: 0.01 },
          { kind: "equal", task: "t1", label: "`selisih` = 0,60 pp", msg: "Bias definisi = tren_koreksi − tren_semu.", name: "selisih", value: 0.6, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Tren semu tercetak", msg: "Terlihat membaik −0,12 pp.", pattern: "Tren semu: -0\\.12 pp" },
          { kind: "stdout_matches", task: "t2", label: "Bias definisi tercetak", msg: "Selisih 0,60 pp = ukuran artefak definisi.", pattern: "Bias definisi: 0\\.60 pp" }
        ],
      },
      reference: "Definisi berubah → restate atau jembatan. Catatan kaki wajib di masa transisi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang 4 prinsip dan golden source.",
      ],
      tasks: [],
      summary: [
        "BCBS 239: akurasi & integritas, kelengkapan, ketepatan waktu, adaptabilitas.",
        "Skor kematangan: ≥85 siap, 70–84 program perbaikan, <70 belum siap — perbaiki terlemah dulu.",
        "Golden source = sistem + definisi + pemilik; spreadsheet untuk analisis, bukan laporan.",
        "Tepat waktu = umur data ≤ SLA; agregasi manual = tidak adaptif.",
        "Dua angka beda = tetapkan golden source minggu ini + rekonsiliasi tertulis.",
      ],
      next: { label: "RR18 — Market Risk Reporting (VaR)", href: "/v2/learn/rr18-market-risk" },
      quiz: [
        {
          q: "Dua laporan menampilkan NPL berbeda (3,4% vs 3,5%). Akar masalah menurut BCBS 239?",
          options: [
            { text: "Tidak ada golden source + definisi tunggal", why: "Benar. Dua sistem + dua definisi = dua kebenaran.", correct: true },
            { text: "Analisnya salah hitung", why: "Keduanya benar secara hitungan — masalahnya sumber & definisi." },
            { text: "Datanya kurang lengkap", why: "Kelengkapan bukan masalah di sini; akurasi/integritas yang gagal." }
          ],
        },
        {
          q: "Skor 72/60/80/55. Verdict dan prioritas?",
          options: [
            { text: "BELUM SIAP; perbaiki ketepatan waktu (55) dulu", why: "Benar: rata-rata 67 < 70; terlemah = prioritas.", correct: true },
            { text: "SIAP; semua di atas 50", why: "Ambang siap = 85, bukan 50." },
            { text: "PROGRAM PERBAIKAN; perbaiki kelengkapan (80)", why: "67 < 70 = BELUM SIAP; dan perbaiki yang TERLEMAH, bukan yang tertinggi." }
          ],
        },
        {
          q: "NPL harian umur 26 jam, SLA 24 jam. Status?",
          options: [
            { text: "TELAT — perlu percepatan", why: "Benar: 26 > 24.", correct: true },
            { text: "TEPAT — cuma 2 jam", why: "SLA = kontrak; 2 jam telat = telat." },
            { text: "Tidak bisa dinilai", why: "Bisa: bandingkan umur vs SLA." }
          ],
        },
        {
          q: "Peran spreadsheet dalam RDARR?",
          options: [
            { text: "Boleh untuk analisis, tidak untuk laporan", why: "Benar. Laporan = dari sistem (golden source).", correct: true },
            { text: "Dilarang total", why: "Analisis eksploratif di spreadsheet sah-sah saja." },
            { text: "Boleh untuk laporan jika rapi", why: "Rapi ≤ terverifikasi: tanpa jejak & versi = tidak auditable." }
          ],
        },
        {
          q: "Mengapa agregasi manual gagal prinsip adaptabilitas?",
          options: [
            { text: "Tidak bisa dipercepat saat krisis/adhoc mendesak", why: "Benar. Manual = kecepatan tetap; krisis butuh kecepatan variabel.", correct: true },
            { text: "Karena mahal", why: "Biaya bukan inti prinsip ini." },
            { text: "Karena datanya pasti salah", why: "Manual bisa benar — tetapi lambat dan tidak bisa di-scale saat dibutuhkan." }
          ],
        }
      ],
      reference: "Empat prinsip. Golden source. Skor tiap kuartal.",
    },
  ],
};
