import type { V2Lesson } from "../lib/types";

const FIG_DTI = `<svg viewBox="0 0 600 300" role="img" aria-label="Rasio DTI lima aplikasi dengan ambang 40 persen.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">DTI lima aplikasi vs ambang 40%</text>
<text x="10" y="66" font-size="11" fill="var(--chart-text)">A1 Toko Berkah</text>
<rect x="170" y="52" width="224" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="400" y="69" font-size="11" fill="var(--chart-text)">32%</text>
<text x="10" y="104" font-size="11" fill="var(--chart-text)">A2 CV Maju Jaya</text>
<rect x="170" y="90" width="385" height="22" fill="var(--c5, #e5484d)" opacity="0.9"/>
<text x="561" y="107" font-size="11" fill="var(--chart-text)">55%</text>
<text x="10" y="142" font-size="11" fill="var(--chart-text)">A3 UD Sinar</text>
<rect x="170" y="128" width="140" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="316" y="145" font-size="11" fill="var(--chart-text)">20%</text>
<text x="10" y="180" font-size="11" fill="var(--chart-text)">A4 PT Agro Lestari</text>
<rect x="170" y="166" width="245" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="421" y="183" font-size="11" fill="var(--chart-text)">35%</text>
<text x="10" y="218" font-size="11" fill="var(--chart-text)">A5 Kios Melati</text>
<rect x="170" y="204" width="406" height="22" fill="var(--c5, #e5484d)" opacity="0.9"/>
<text x="582" y="221" font-size="11" fill="var(--chart-text)">58%</text>
<line x1="450" y1="44" x2="450" y2="232" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.7"/>
<text x="454" y="40" font-size="10" fill="var(--chart-text)" opacity="0.8">Ambang 40%</text>
<text x="10" y="262" font-size="10" fill="var(--chart-text)" opacity="0.75">A2 dan A5 melewati ambang — tetapi DTI saja tidak cukup: A5 juga LTV 125% dan riwayat 60 hari telat.</text>
</g>
</svg>`;

export const cr36: V2Lesson = {
  slug: "cr36-python-credit-analytics",
  track: "Credit Risk",
  module: "Tooling Analis",
  title: "CR36 — Python untuk Credit Risk Analytics: Dari Data Mentah ke Flag Early-Warning",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tumpukan 47 aplikasi dan satu sore yang hilang",
      prose: [
        "Analis kredit Bagas menerima 47 aplikasi kredit UMKM yang harus diringkas sebelum komite kredit Kamis pagi. Cara lamanya: buka satu per satu di Excel, hitung DTI manual, catat riwayat telat dari SLIK, lalu rekap di slide. Sore itu habis untuk 11 aplikasi — 36 sisanya menunggu, dan komite tidak bisa ditunda.",
        "Twist-nya: Bagas tidak lembur. Ia menulis satu skrip Python 30 baris: baca data aplikasi, hitung DTI dan LTV otomatis, ekstrak keterlambatan maksimum dari riwayat pembayaran, lalu keluarkan daftar 'flag' — aplikasi yang butuh perhatian khusus. 47 aplikasi selesai dalam 4 detik. Komite Kamis membahas 6 aplikasi ber-flag secara mendalam, sisanya lolos jalur cepat.",
        "Inilah kenapa Python adalah syarat eksplisit di lowongan credit risk — bukan untuk menggantikan judgment analis, melainkan untuk memindahkannya ke tempat yang paling berharga: dari menghitung ke memutuskan. Lesson ini membangun workflow itu dari nol, hanya dengan standard library.",
        "Setelah lesson ini kamu bisa: (1) menghitung DTI dan LTV dari data aplikasi; (2) membangun fitur perilaku dari riwayat pembayaran (keterlambatan maksimum, utilisasi); (3) membuat ringkasan portofolio dan daftar flag early-warning otomatis; (4) menjelaskan kapan flag berarti 'tolak' dan kapan berarti 'selidiki'. Prasyarat ringkas: DTI (debt-to-income) = porsi penghasilan untuk membayar utang; LTV (loan-to-value) = plafon dibanding nilai agunan. Python dasar (loop, dict, list) cukup.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Otomatisasi perhitungan bukan otomatisasi keputusan. Skrip Bagas tidak menolak siapa pun — ia hanya memastikan komite menghabiskan waktunya untuk 6 aplikasi yang benar-benar berisiko, bukan untuk menghitung 47 aplikasi satu per satu.",
      },
      reference: "Python = memindahkan analis dari menghitung ke memutuskan. 47 aplikasi, 4 detik, 6 flag.",
    },
    {
      id: "dti-ltv",
      eyebrow: "Langkah 2 · Konsep",
      title: "DTI dan LTV: dua rasio yang menentukan segalanya",
      prose: [
        "DTI menjawab: 'berapa persen penghasilannya sudah habis untuk utang sebelum kredit baru ini?' Rumusnya cicilan total (existing + yang diajukan) dibagi penghasilan. Ambang umum analis Indonesia: di atas 40% berarti debitur hidup dari gaji ke gaji — satu guncangan (sakit, sepi order) dan cicilan macet. Perhatikan: pembilangnya adalah TOTAL cicilan — cicilan lama DITAMBAH cicilan kredit yang diajukan. DTI yang hanya memakai cicilan lama (existing-only) meremehkan beban sebenarnya; data lesson ini memuat keduanya (cicilan_lama dan cicilan_baru) dan lab menghitung DTI total.",
        "LTV menjawab: 'jika debitur gagal bayar, seberapa besar bantalan agunannya?' Plafon dibagi nilai agunan. LTV 67% berarti agunan 1,5x lipat dari pinjaman — masih ada ruang jika harga agunan turun. LTV 125% berarti pinjaman LEBIH BESAR dari agunannya: bila debitur gagal dan agunan dijual senilai taksiran, bank menanggung kekurangan sekitar 25 persen — tetapi selama debitur membayar, tidak ada kerugian yang terjadi; kerugiannya POTENSIAL (tergantung gagal bayar + harga jual agunan + biaya lelang), bukan kerugian yang 'sudah terjadi bahkan sebelum melelang'.",
        "Kepribadiannya: DTI adalah 'dokter' — ia memeriksa kesehatan arus kas hari ini. LTV adalah 'asuransi' — ia baru bicara saat yang terburuk terjadi. Dokter yang baik tidak menggantikan asuransi: aplikasi dengan DTI sehat tapi LTV 125% tetap berbahaya, seperti A5 di figur — DTI-nya 58% (jelas gagal, bukan 'hampir lolos') dan agunannya tidak menutup pinjaman.",
        "Cara membaca figur: tiap batang = DTI TOTAL satu aplikasi (cicilan lama + cicilan baru, dibagi penghasilan); garis putus-putus = ambang 40%; batang merah = melewati ambang. Interpretasi: A2 (55%) dan A5 (58%) melewati ambang — tetapi jangan berhenti di DTI: A5 punya dua masalah tambahan (LTV 125%, riwayat telat 60 hari) yang membuatnya jauh lebih berisiko dari A2.",
      ],
      formula: String.raw`\text{DTI} = \frac{\text{Cicilan existing} + \text{Cicilan diajukan}}{\text{Penghasilan}} \times 100\%, \quad \text{LTV} = \frac{\text{Plafon}}{\text{Nilai agunan}} \times 100\%`,
      formulaNote: "DTI: pembilang = total kewajiban cicilan per bulan (existing + diajukan); penyebut = penghasilan per bulan. Contoh A2: (18+4)/40 = 55% — di atas ambang 40%. LTV: contoh A5: 50/40 = 125% — pinjaman melebihi agunan. Interpretasi: DTI mengukur kemampuan membayar (arus kas), LTV mengukur bantalan kerugian (agunan). Keduanya harus lolos — satu gagal, aplikasi ber-flag.",
      figure: {
        svg: FIG_DTI,
        alt: "DTI total lima aplikasi: A1 32%, A2 55%, A3 20%, A4 35%, A5 58%; ambang 40% dilampaui A2 dan A5.",
        caption: "DTI saja tidak cukup — A5 gagal di DTI (58%) dan juga di LTV dan riwayat.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: DTI rendah = pasti aman",
        type: "pitfall",
        body: "Mitos: aplikasi dengan DTI 20% pasti layak. Yang benar: DTI mengukur rata-rata, bukan volatilitas. Pedagang musiman bisa DTI 20% dari penghasilan rata-rata tahunan tetapi 80% di bulan sepi — dan cicilan jatuh tempo tiap bulan, bukan tiap tahun. Selalu tanya: seberapa stabil penghasilannya? DTI tanpa konteks volatilitas adalah angka buta.",
      },
      hints: [
        "DTI > 40% = flag. LTV > 90% = flag. Keduanya dihitung SEBELUM melihat riwayat.",
        "Agunan None (tanpa agunan) bukan LTV 0 — ia berarti tidak ada bantalan sama sekali.",
      ],
      reference: "DTI = dokter arus kas. LTV = asuransi agunan. Keduanya harus lolos.",
    },
    {
      id: "fitur-perilaku",
      eyebrow: "Langkah 3 · Konsep",
      title: "Fitur perilaku: masa lalu adalah data terbaik",
      prose: [
        "Rasio statis (DTI, LTV) adalah foto. Riwayat pembayaran adalah film — dan film selalu lebih jujur. Dari deretan DPD 6 bulan [0, 45, 60, 30, 0, 0], analis mengekstrak fitur: keterlambatan maksimum (60 hari), berapa bulan telat, dan apakah polanya memburuk atau membaik.",
        "Keterlambatan maksimum adalah fitur perilaku paling kuat dalam praktik: debitur yang pernah 60 hari telat punya probabilitas macet berkali-kali lipat dibanding yang tidak pernah telat — berapa pun DTI-nya. Itu sebabnya A5 (DTI 58%) tetap ber-flag merah: filmnya menunjukkan 60 hari telat.",
        "Fitur perilaku lain yang murah tapi tajam: tren (apakah DPD membesar dari waktu ke waktu?), frekuensi (berapa bulan dari 6 yang telat?), dan pemulihan (apakah setelah telat ia kembali lancar?). Ketiganya bisa dihitung dari satu list angka — tidak butuh model machine learning, hanya butuh ketelitian.",
        "Satu fitur lagi yang dijanjikan di tujuan lesson ini: UTILISASI — porsi limit kredit yang sedang dipakai (saldo dibagi limit). Utilisasi tinggi menandakan debitur hidup dari kredit bergulir: A2 memakai 16 dari limit 20 (80%), A5 memakai 7 dari 8 (87,5%) — keduanya di atas ambang waspada 75 persen — sementara A1 hanya 30% dan A4 20%. Utilisasi dihitung di lab yang sama (tugas t1) dan menjadi flag keempat yang murah: debitur yang DTI-nya sehat tetapi utilisasinya 90% kemungkinan besar sedang menutup lubang dengan kartu kredit.",
        "Kapan memakai fitur perilaku: selalu, untuk setiap aplikasi dengan riwayat. Kapan tidak cukup: debitur baru tanpa riwayat (thin file) — di sinilah DTI, LTV, dan data alternatif (mutasi rekening, e-commerce) mengambil alih.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: riwayat lama tidak relevan",
        type: "pitfall",
        body: "Mitos: 'telat 60 hari dua tahun lalu tidak penting, sekarang ia lancar.' Yang benar: model perilaku menunjukkan keterlambatan parah meninggalkan 'bekas' statistik selama bertahun-tahun — bukan karena analis pendendam, melainkan karena pola kesulitan keuangan cenderung berulang. Yang berubah adalah bobotnya: telat 60 hari tahun lalu lebih berat dari telat 60 hari lima tahun lalu, tetapi tidak pernah nol.",
      },
      hints: [
        "max(dpd_hist) = satu baris Python, fitur paling prediktif.",
        "Pola [0,45,60,30,0,0] memburuk lalu membaik — tanya kenapa, jangan hanya catat angkanya.",
      ],
      reference: "Foto (DTI/LTV) + film (riwayat) = profil lengkap. max DPD = fitur termurah dan tertajam.",
    },
    {
      id: "lab-flag",
      eyebrow: "Langkah 4 · Lab",
      title: "Skrip analis: 5 aplikasi, daftar flag otomatis",
      prose: [
        "Lima aplikasi sudah tersedia sebagai list of dict. Tugasmu: hitung DTI TOTAL (cicilan lama + cicilan baru, dibagi penghasilan), LTV, keterlambatan maksimum, dan utilisasi (saldo dipakai dibagi limit) per aplikasi, terapkan tiga aturan flag (DTI > 40%, max DPD >= 30 hari, LTV > 90%), lalu cetak ringkasannya. Ini adalah inti skrip Bagas — versi miniatur yang sama persis polanya dengan versi 47 aplikasi.",
        "Eksplorasi: setelah lolos, coba ubah ambang DTI menjadi 35% — berapa aplikasi ber-flag sekarang? Lalu kembalikan. Rasakan betapa satu angka ambang mengubah beban kerja komite: itulah kenapa ambang adalah keputusan bisnis, bukan sekadar angka teknis.",
      ],
      tasks: [
        { id: "t1", text: "Untuk tiap aplikasi hitung `dti` (TOTAL: cicilan lama + cicilan baru), `ltv` (None bila tanpa agunan), `max_dpd`, dan `utilisasi` (pakai/limit, None bila tanpa limit)" },
        { id: "t2", text: "Terapkan aturan flag ke tiap aplikasi, kumpulkan id ber-flag ke list `flags`, hitung `n_flag`" },
        { id: "t3", text: "Jalankan dan pastikan ringkasan tercetak dengan benar" },
      ],
      expected: "Aplikasi ber-flag: 2 -> A2, A5 | DTI A2 = 0.550; LTV A5 = 1.25 | Utilisasi A2 = 0.80",
      code: {
        starter: "# Data JANGAN UBAH.\naplikasi = [\n    {\"id\":\"A1\",\"penghasilan\":25.0,\"cicilan_lama\":6.0,\"cicilan_baru\":2.0,\"plafon\":120.0,\"agunan\":180.0,\"limit\":10.0,\"pakai\":3.0,\"dpd_hist\":[0,0,5,0,12,0]},\n    {\"id\":\"A2\",\"penghasilan\":40.0,\"cicilan_lama\":18.0,\"cicilan_baru\":4.0,\"plafon\":300.0,\"agunan\":350.0,\"limit\":20.0,\"pakai\":16.0,\"dpd_hist\":[0,15,0,35,10,0]},\n    {\"id\":\"A3\",\"penghasilan\":15.0,\"cicilan_lama\":2.0,\"cicilan_baru\":1.0,\"plafon\":60.0,\"agunan\":None,\"limit\":None,\"pakai\":0.0,\"dpd_hist\":[0,0,0,0,0,0]},\n    {\"id\":\"A4\",\"penghasilan\":80.0,\"cicilan_lama\":20.0,\"cicilan_baru\":8.0,\"plafon\":500.0,\"agunan\":700.0,\"limit\":50.0,\"pakai\":10.0,\"dpd_hist\":[0,0,0,20,0,5]},\n    {\"id\":\"A5\",\"penghasilan\":12.0,\"cicilan_lama\":5.0,\"cicilan_baru\":2.0,\"plafon\":50.0,\"agunan\":40.0,\"limit\":8.0,\"pakai\":7.0,\"dpd_hist\":[0,45,60,30,0,0]},\n]\n\n# TULIS KODEMU: t1 hitung dti, ltv, max_dpd, utilisasi per aplikasi\nfor a in aplikasi:\n    a[\"dti\"] =\n    a[\"ltv\"] =\n    a[\"max_dpd\"] =\n    a[\"utilisasi\"] =\n\n# t2: aturan flag -> list flags dan n_flag\nflags =\nn_flag =\n\ndti_a2 = aplikasi[1][\"dti\"]\nltv_a5 = aplikasi[4][\"ltv\"]\nutil_a2 = aplikasi[1][\"utilisasi\"]\nprint(f\"Aplikasi ber-flag: {n_flag} -> {\", \".join(flags)}\")\nprint(f\"DTI A2 = {dti_a2:.3f}; LTV A5 = {ltv_a5:.2f}\")\nprint(f\"Utilisasi A2 = {util_a2:.2f}\")\n",
        lockLines: 8,
        solution: "# Data JANGAN UBAH.\naplikasi = [\n    {\"id\":\"A1\",\"penghasilan\":25.0,\"cicilan_lama\":6.0,\"cicilan_baru\":2.0,\"plafon\":120.0,\"agunan\":180.0,\"limit\":10.0,\"pakai\":3.0,\"dpd_hist\":[0,0,5,0,12,0]},\n    {\"id\":\"A2\",\"penghasilan\":40.0,\"cicilan_lama\":18.0,\"cicilan_baru\":4.0,\"plafon\":300.0,\"agunan\":350.0,\"limit\":20.0,\"pakai\":16.0,\"dpd_hist\":[0,15,0,35,10,0]},\n    {\"id\":\"A3\",\"penghasilan\":15.0,\"cicilan_lama\":2.0,\"cicilan_baru\":1.0,\"plafon\":60.0,\"agunan\":None,\"limit\":None,\"pakai\":0.0,\"dpd_hist\":[0,0,0,0,0,0]},\n    {\"id\":\"A4\",\"penghasilan\":80.0,\"cicilan_lama\":20.0,\"cicilan_baru\":8.0,\"plafon\":500.0,\"agunan\":700.0,\"limit\":50.0,\"pakai\":10.0,\"dpd_hist\":[0,0,0,20,0,5]},\n    {\"id\":\"A5\",\"penghasilan\":12.0,\"cicilan_lama\":5.0,\"cicilan_baru\":2.0,\"plafon\":50.0,\"agunan\":40.0,\"limit\":8.0,\"pakai\":7.0,\"dpd_hist\":[0,45,60,30,0,0]},\n]\n\n# TULIS KODEMU: t1 hitung dti, ltv, max_dpd, utilisasi per aplikasi\nfor a in aplikasi:\n    a[\"dti\"] = (a[\"cicilan_lama\"] + a[\"cicilan_baru\"]) / a[\"penghasilan\"]\n    a[\"ltv\"] = (a[\"plafon\"] / a[\"agunan\"]) if a[\"agunan\"] else None\n    a[\"max_dpd\"] = max(a[\"dpd_hist\"])\n    a[\"utilisasi\"] = (a[\"pakai\"] / a[\"limit\"]) if a[\"limit\"] else None\n\n# t2: aturan flag -> list flags dan n_flag\nflags = [a[\"id\"] for a in aplikasi if (a[\"dti\"] > 0.4) or (a[\"max_dpd\"] >= 30) or (a[\"ltv\"] is not None and a[\"ltv\"] > 0.9)]\nn_flag = len(flags)\n\ndti_a2 = aplikasi[1][\"dti\"]\nltv_a5 = aplikasi[4][\"ltv\"]\nutil_a2 = aplikasi[1][\"utilisasi\"]\nprint(f\"Aplikasi ber-flag: {n_flag} -> {\", \".join(flags)}\")\nprint(f\"DTI A2 = {dti_a2:.3f}; LTV A5 = {ltv_a5:.2f}\")\nprint(f\"Utilisasi A2 = {util_a2:.2f}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "DTI A2 = 0,55", msg: "(18+4)/40 = 0,55 — DTI TOTAL (existing + diajukan), di atas ambang 40%.", name: "dti_a2", value: 0.55, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "LTV A5 = 1,25", msg: "50/40 = 1,25 — pinjaman melebihi agunan.", name: "ltv_a5", value: 1.25, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "Utilisasi A2 = 0,80", msg: "16/20 = 0,80 — di atas ambang waspada 75%.", name: "util_a2", value: 0.8, tol: 1e-9 },
          { kind: "equal", task: "t2", label: "n_flag = 2", msg: "A2 (DTI + riwayat) dan A5 (DTI + LTV + riwayat).", name: "n_flag", value: 2, tol: 0 },
          { kind: "contains", task: "t2", label: "flags memuat A5", msg: "A5 gagal di tiga aturan sekaligus.", name: "flags", value: "A5" },
          { kind: "stdout_matches", task: "t3", label: "ringkasan tercetak", msg: "Format: jumlah, daftar id, DTI A2, LTV A5, utilisasi A2.", pattern: "Aplikasi ber-flag: 2 -> A2, A5" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Flag bukan vonis: empat skenario tindak lanjut",
      prose: [
        "Skenario 1 — Flag DTI saja (mis. A2 tanpa riwayat buruk): selidiki struktur penghasilan. Jika penghasilan stabil dan terdokumentasi, masih bisa lolos dengan plafon diturunkan atau tenor dipanjangkan. Flag DTI = negosiasi, bukan penolakan.",
        "Skenario 2 — Flag riwayat saja (max DPD >= 30, DTI/LTV sehat): tanya cerita di balik keterlambatan. Telat karena bencana/sakit yang sudah lewat berbeda dengan telat karena gali lubang tutup lubang. Minta bukti pemulihan 6 bulan terakhir.",
        "Skenario 3 — Flag ganda/tripel (seperti A5: DTI + LTV + riwayat): tolak atau minta restrukturisasi total aplikasi — turunkan plafon di bawah nilai agunan DAN minta uang muka. Satu flag = selidiki; tiga flag = jangan berharap.",
        "Skenario 4 — Tanpa flag tetapi thin file (A3: tanpa agunan, tanpa riwayat): jangan langsung setujui. Tanpa film dan tanpa asuransi, analis butuh data alternatif — mutasi rekening 6 bulan, riwayat e-commerce, atau plafon bertahap kecil dulu.",
        "Aturan praktis 10 detik: hitung DTI/LTV/max DPD → 0 flag = jalur cepat; 1 flag = selidiki penyebabnya; 2+ flag = tolak atau rombak total; thin file = minta data alternatif.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: flag yang paling mahal adalah yang terlewat",
        body: "False negative (A5 lolos tanpa flag) biayanya macet Rp50 juta. False positive (A1 kena flag) biayanya hanya 30 menit verifikasi tambahan. Aturan flag yang baik sedikit 'cerewet' — lebih baik menyelidiki 10 aplikasi sehat daripada meloloskan 1 aplikasi beracun.",
      },
      reference: "1 flag = selidiki. 2+ flag = rombak/tolak. Thin file = data alternatif.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Komite Kamis: A2 ditunda, A5 ditolak",
      prose: [
        "Komite kredit membahas dua aplikasi ber-flag. A2 (CV Maju Jaya): DTI total 55%, max DPD 35 hari, tetapi LTV 86% sehat dan keterlambatan terjadi 4 bulan lalu saat banjir mengganggu distribusi — 2 bulan terakhir lancar. A5 (Kios Melati): DTI total 58%, LTV 125%, max DPD 60 hari dengan pola memburuk lalu sedikit membaik. Pertanyaan: keputusan apa untuk masing-masing, dan dengan syarat apa?",
        "Pembahasan: A2 = TUNDA — jangan setujui dulu. DTI total 55% di atas ambang, dan masalahnya BUKAN plafon baru: cicilan LAMA saja sudah 18/40 = 45% — sudah di atas ambang 40% sebelum kredit baru dihitung. Memotong plafon 300 → 250 juta tidak memperbaiki ini: dengan asumsi cicilan baru berskala lurus dengan plafon (asumsi yang harus dinyatakan eksplisit — tanpa data rate dan tenor, angka pastinya tidak dapat dihitung), cicilan baru turun dari 4,0 menjadi 3,33 dan DTI total hanya turun ke (18+3,33)/40 = 53% — masih gagal. Agar DTI ≤ 40%, total cicilan harus ≤ 16 — DI BAWAH cicilan lama 18 saja. Artinya: tidak ada plafon baru yang bisa membuat A2 lolos tanpa restrukturisasi utang lamanya. Syarat yang benar: restrukturisasi cicilan lama (perpanjangan tenor) hingga total cicilan ≤ 16, baru ajukan kembali; penyebab keterlambatan yang jelas (banjir, sudah pulih 2 bulan) mendukung restrukturisasi itu, bukan persetujuan langsung. A5 = TOLAK. Tiga flag independen (arus kas, agunan, perilaku) dengan pola memburuk — tidak ada satu pun syarat yang memperbaiki ketiganya sekaligus. Pelajaran: flag memicu pertanyaan yang tepat; jawaban analis — bukan skrip — yang memutuskan. Dan DTI total mengingatkan: plafon baru yang kecil tidak menyelamatkan debitur yang utang lamanya saja sudah melebihi ambang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Komite yang baik tidak bertanya 'berapa DTI-nya?' lalu selesai — ia bertanya 'kenapa DTI-nya begitu, dan apa yang berubah?'. Skrip memberi angka dalam 4 detik; analis memberi makna dalam 4 menit. Keduanya dibutuhkan, tidak ada yang menggantikan yang lain.",
      },
      reference: "A2 = tunda (DTI lama saja sudah 45%; butuh restrukturisasi cicilan lama). A5 = tolak (tiga flag independen).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — rasio tanpa interpretasi hanyalah aritmetika.",
      ],
      tasks: [],
      summary: [
        "DTI = (cicilan lama + cicilan baru)/penghasilan; > 40% = flag. Mengukur kemampuan membayar, bukan volatilitasnya.",
        "LTV = plafon/agunan; > 90% = flag. Bantalan kerugian saat gagal bayar; tanpa agunan = tanpa bantalan.",
        "Fitur perilaku (max DPD, tren, frekuensi) dari riwayat = film yang lebih jujur dari foto rasio.",
        "Flag = pemicu penyelidikan, bukan vonis otomatis; 1 flag selidiki, 2+ flag rombak/tolak.",
        "Thin file (tanpa riwayat/agunan) butuh data alternatif — jangan loloskan buta.",
      ],
      next: { label: "CR37 — Membaca Data Biro Kredit (SLIK/iDeb)", href: "/v2/learn/cr37-slik-biro-kredit" },
      quiz: [
        {
          q: "Aplikasi dengan DTI 25% tetapi riwayat menunjukkan max DPD 60 hari. Keputusan yang benar…",
          options: [
            { text: "Setujui — DTI sehat berarti kemampuan membayar baik", why: "Salah: DTI adalah foto rata-rata; film riwayat menunjukkan perilaku nyata — max DPD 60 adalah flag kuat.", },
            { text: "Beri flag dan selidiki cerita di balik keterlambatan 60 hari", why: "Benar: fitur perilaku mengalahkan rasio statis; satu flag = selidiki, bukan tolak otomatis.", correct: true },
            { text: "Tolak langsung — riwayat buruk tidak bisa dimaafkan", why: "Salah: flag memicu penyelidikan; penolakan butuh konteks (penyebab, pemulihan).", },
            { text: "Minta agunan tambahan lalu setujui", why: "Salah: agunan menutup LGD, bukan PD — masalah perilaku tidak selesai dengan agunan.", },
          ],
        },
        {
          q: "LTV 125% artinya…",
          options: [
            { text: "Agunan 25% lebih besar dari pinjaman — aman", why: "Salah: terbalik. LTV = plafon/agunan; 125% berarti pinjaman melebihi agunan.", },
            { text: "Pinjaman 25% lebih besar dari agunan — bank rugi bahkan sebelum lelang", why: "Benar: tidak ada bantalan; gagal bayar = kerugian hampir pasti.", correct: true },
            { text: "Debitur membayar 25% di muka — uang muka sehat", why: "Salah: itu DP 25%, kebalikan dari LTV 125%.", },
            { text: "Suku bunga 25% lebih tinggi dari pasar", why: "Salah: LTV bukan ukuran harga, melainkan ukuran bantalan agunan.", },
          ],
        },
        {
          q: "Kenapa analis menghitung max DPD dari riwayat, bukan rata-rata DPD?",
          options: [
            { text: "Karena max lebih mudah dihitung", why: "Salah: kemudahan bukan alasan — rata-rata sama mudahnya.", },
            { text: "Karena keterlambatan terparah paling prediktif terhadap gagal bayar", why: "Benar: satu episode 60 hari telat membawa sinyal risiko lebih kuat dari rata-rata yang halus.", correct: true },
            { text: "Karena regulator mewajibkan max, bukan rata-rata", why: "Salah: tidak ada kewajiban semacam itu; ini pilihan analitis.", },
            { text: "Karena rata-rata DPD selalu nol", why: "Salah: rata-rata DPD jarang nol pada debitur bermasalah.", },
          ],
        },
        {
          q: "Aplikasi tanpa agunan dan tanpa riwayat (thin file) sebaiknya…",
          options: [
            { text: "Disetujui bila DTI sehat — tidak ada bukti risiko", why: "Salah: tidak ada bukti BUKAN bukti tidak ada risiko; thin file = ketidakpastian tertinggi.", },
            { text: "Diminta data alternatif (mutasi, e-commerce) atau plafon bertahap kecil", why: "Benar: ganti film dan asuransi yang hilang dengan data lain + eksposur bertahap.", correct: true },
            { text: "Ditolak — tanpa agunan tidak boleh ada kredit", why: "Salah: KTA/KUR tanpa agunan adalah produk sah; yang dibutuhkan manajemen risiko, bukan penolakan buta.", },
            { text: "Diberi plafon besar agar datanya cepat terbentuk", why: "Salah: memperbesar eksposur justru saat ketidakpastian tertinggi — kebalikan dari prinsip kehati-hatian.", },
          ],
        },
        {
          q: "Manfaat utama otomatisasi perhitungan flag bagi analis adalah…",
          options: [
            { text: "Menggantikan judgment analis dengan aturan", why: "Salah: flag memicu penyelidikan; keputusan tetap milik analis dan komite.", },
            { text: "Memindahkan waktu analis dari menghitung ke memutuskan", why: "Benar: 47 aplikasi dalam 4 detik — komite fokus pada 6 yang berisiko.", correct: true },
            { text: "Menghilangkan kebutuhan data SLIK", why: "Salah: otomatisasi justru memaksimalkan nilai data yang ada, bukan menghilangkannya.", },
            { text: "Menjamin tidak ada kredit macet", why: "Salah: tidak ada sistem yang menjamin nol macet; tujuannya risiko terukur, bukan nol.", },
          ],
        },
      ],
    },
  ],
};
