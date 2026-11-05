import type { V2Lesson } from "../lib/types";

export const cr2: V2Lesson = {
  slug: "cr2-kolektibilitas",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR2 — DPD & Kolektibilitas",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Telat 45 hari — macet atau belum?",
      prose: [
        "Rabu sore, tim collection Bank Nusantara menatap daftar tunggakan. Nama PT Sinar Abadi menyala kuning: telat 45 hari, outstanding Rp 2 M. Debt collector senior, Pak Warto, mengusulkan: \"Sita agunannya saja, ini sudah macet!\"",
        "Analis Rina menggeleng. \"Belum macet, Pak. 45 hari itu Kolektibilitas 2 — Dalam Perhatian Khusus. Macet itu Kolektibilitas 5, telatnya di atas 180 hari atau sudah tidak ada harapan.\" Sebulan kemudian Sinar Abadi membayar lunas — ternyata telat karena direktur keuangannya opname di RS. Kalau agunannya disita di hari ke-45, bank kehilangan nasabah bagus dan kena masalah hukum.",
        "Intinya: \"macet\" bukan perasaan — melainkan definisi resmi berlapis (DPD → kolektibilitas → NPL) yang menentukan berapa miliar rupiah cadangan yang harus dikunci bank. Salah label Rp 2 M ini saja bisa menggeser laba cabang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap perpindahan kolektibilitas menaik menandatangani cek cadangan atas nama bank. Kolek 3–5 berarti CKPN melonjak dan langsung memakan laba. Itulah mengapa perpindahan Kolek 2 → 3 selalu diperdebatkan sengit antara tim bisnis dan tim risiko.",
      },
      reference: "DPD → kolektibilitas 1–5 → NPL: bahasa resmi kredit bermasalah.",
    },
    {
      id: "dpd",
      eyebrow: "Langkah 2 · DPD",
      title: "DPD — jam dinding setiap kredit",
      prose: [
        "DPD (Days Past Due) = jumlah hari keterlambatan, dihitung dari tanggal jatuh tempo tertua yang belum dibayar sampai tanggal laporan. Tanggal laporan adalah \"hari ini\" versi analis (tanggal cut-off data). Jatuh tempo tertua = cicilan paling lama yang masih nunggak — bukan cicilan terakhir. Kalau cicilan Januari dan Februari nunggak, DPD dihitung dari Januari.",
        "Contoh: cicilan Rp 5 jt jatuh tempo tiap tanggal 15. Nasabah terakhir bayar untuk cicilan 15 Agustus. Hari ini 13 Oktober. Jatuh tempo tertua yang belum dibayar = 15 September. DPD = 13 Okt − 15 Sep = 28 hari → Kolektibilitas 2 (DPK). Belum NPL. Catatan: cicilan Agustus sudah lewat 59 hari tapi sudah dibayar — tidak dihitung. DPD selalu dari yang belum dibayar.",
        "DPD adalah bahasa universal risiko kredit — dari analis Jakarta sampai regulator Basel, semua bicara DPD. DPD 0 = sehat, DPD 90+ = zona merah global (definisi default Basel, detail di CR5).",
      ],
      formula: String.raw`\text{DPD} = \text{Tanggal Laporan} - \text{Tanggal Jatuh Tempo Tertua yang Belum Dibayar}`,
      formulaNote: "Tanggal Laporan = cut-off analisis (\"hari ini\" versi analis). Tanggal Jatuh Tempo Tertua yang Belum Dibayar = cicilan paling lama yang masih nunggak — bukan cicilan terakhir. Contoh: jatuh tempo 15 Sep, laporan 13 Okt → 28 hari → Kolek 2. Salah pakai cicilan yang sudah dibayar = DPD 0 palsu.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung DPD dari cicilan terakhir atau dari jatuh tempo yang sudah dibayar. DPD selalu dari jatuh tempo TERTUA yang BELUM dibayar. Cicilan lama yang sudah lunas tidak ikut hitung.",
      },
      reference: "Ambang global: DPD 90+ hari = zona default (Basel).",
    },
    {
      id: "kolektibilitas",
      eyebrow: "Langkah 3 · Kolektibilitas",
      title: "Lampu lalu lintas OJK: 1 sampai 5",
      prose: [
        "OJK mewajibkan bank mengklasifikasikan setiap kredit ke 5 kolektibilitas. Kolek 1 — Lancar: bayar tepat waktu (DPD 0). Kolek 2 — Dalam Perhatian Khusus (DPK): menunggak 1–90 hari; \"batuk-batuk\", perlu perhatian, belum sakit. Kolek 3 — Kurang Lancar: menunggak 91–180 hari. Kolek 4 — Diragukan: menunggak 181–270 hari. Kolek 5 — Macet: menunggak di atas 270 hari, atau sudah tidak ada prospek (bangkrut, hilang).",
        "Pola sehat berbentuk tangga turun — makin parah makin kecil. Yang wajib diwaspadai: Kolek 2 (DPK) yang menggelembung. DPK adalah ruang tunggu NPL — kalau ekonomi memburuk, inilah yang pertama jatuh ke Kolek 3. Analis cerdas memonitor DPK, bukan cuma NPL.",
        "Untuk kredit korporasi/komersial, OJK menilai 3 pilar: prospek usaha, kinerja debitur, DAN kemampuan bayar. Perusahaan yang bayar tepat waktu tapi industrinya kolaps bisa diturunkan kolektibilitasnya meski DPD-nya 0 — ini downgrade kualitatif, dan sering jadi sumber konflik antara RM yang membela nasabah dan analis risiko.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Kolektibilitas hanya soal telat bayar.\" Untuk segmen komersial, DPD 0 tidak otomatis Kolek 1. Menunggu telat bayar dulu sebelum bertindak = menunggu terlambat.",
      },
      reference: "Kolek 1: DPD 0 · Kolek 2: 1–90 · Kolek 3: 91–180 · Kolek 4: 181–270 · Kolek 5: >270 hari.",
    },
    {
      id: "lab-dpd",
      eyebrow: "Langkah 4 · Lab DPD",
      title: "Kalkulator DPD & kolektibilitas",
      prose: [
        "Mesin penentu status kredit. Jatuh tempo 15 September 2026, tanggal laporan 13 Oktober 2026. Tugasmu: hitung DPD dari selisih tanggal, lalu tentukan kolektibilitasnya (1–5).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dpd` = selisih hari `tgl_laporan` − `jatuh_tempo`" },
        { id: "t2", text: "Tentukan `kolek`: 1 jika dpd=0, 2 jika ≤90, 3 jika ≤180, 4 jika ≤270, 5 jika lebih" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "dpd=28 kolek=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa bahwa selisih date menghasilkan objek timedelta — ambil atribut .days-nya. Tanpa itu, yang tercetak bukan angka hari.",
      },
      hints: [
        "Konsep: DPD adalah jarak waktu antara tanggal jatuh tempo dan tanggal laporan. Kolektibilitas membaca jarak itu dari ambang paling rendah ke atas — berhenti di ambang pertama yang cocok.",
        "Clue: selisih dua tanggal menghasilkan durasi yang menyimpan jumlah harinya sebagai sebuah atribut. Ambangnya: 0 → Kolek 1; ≤90 → 2; ≤180 → 3; ≤270 → 4; selebihnya 5.",
        "Skeleton: `dpd = (tgl_laporan - jatuh_tempo)...` lalu `kolek = 1 if dpd == 0 else ...`",
      ],
      code: {
        starter: `from datetime import date\n\njatuh_tempo = date(2026, 9, 15)   # cicilan seharusnya dibayar\ntgl_laporan = date(2026, 10, 13)  # hari ini (tanggal analisis)\n\n# TULIS KODEMU\ndpd = \nkolek = \n\nprint(f"dpd={dpd} kolek={kolek}")`,
        lockLines: 4,
        solution: `from datetime import date\n\njatuh_tempo = date(2026, 9, 15)   # cicilan seharusnya dibayar\ntgl_laporan = date(2026, 10, 13)  # hari ini (tanggal analisis)\n\n# TULIS KODEMU\ndpd = (tgl_laporan - jatuh_tempo).days\nkolek = 1 if dpd == 0 else (2 if dpd <= 90 else (3 if dpd <= 180 else (4 if dpd <= 270 else 5)))\n\nprint(f"dpd={dpd} kolek={kolek}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dpd", value: 28, tol: 1e-9, label: "`dpd` seharusnya 28", msg: "13 Okt − 15 Sep = 28 hari. Cek .days-nya." },
          { kind: "equal", task: "t2", name: "kolek", value: 2, tol: 1e-9, label: "`kolek` seharusnya 2", msg: "DPD 28 masuk 1–90 hari → Kolek 2 (DPK)." },
          { kind: "stdout_matches", task: "t3", pattern: "dpd=28\\s+kolek=2", label: "`print` menampilkan dpd dan kolek", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: mundurkan jatuh_tempo ke 2026-06-01 — lihat status berubah jadi NPL di hari ke-91.",
    },
    {
      id: "npl",
      eyebrow: "Langkah 5 · NPL",
      title: "Satu angka yang menggerakkan direksi",
      prose: [
        "NPL (Non-Performing Loan) = kredit Kolektibilitas 3, 4, 5 dibagi total kredit. OJK memberi perhatian khusus bila NPL gross di atas 5%. NPL net mengurangkan cadangan (CKPN) yang sudah dibentuk. Coverage ratio mengukur seberapa tebal bantal cadangan terhadap NPL: coverage 75% artinya tiap Rp 100 kredit macet sudah \"dibayar di muka\" Rp 75 lewat cadangan. Coverage tinggi = bank defensif (aman tapi laba tertahan); coverage rendah = bank agresif (laba cantik tapi rapuh).",
        "NPL adalah rasio — bisa turun karena pembilang mengecil (bagus: debitur sembuh atau write-off) ATAU penyebut membesar (netral: kredit tumbuh). Lebih licik lagi: bank bisa menekan NPL dengan restrukturisasi agresif — kredit macet \"disulap\" jadi lancar di atas kertas (evergreening). Selalu bedah: NPL gross vs net, write-off, pertumbuhan kredit, dan Kolek 2.",
        "Write-off (hapus buku): bank menghapus kredit macet dari neraca — mengakui kerugian. Di Indonesia ada dua tahap: hapus buku (keluar dari neraca, upaya tagih jalan terus) vs hapus tagih (benar-benar dilepas, butuh persetujuan khusus). Hapus buku bukan menyerah. Restrukturisasi: mengubah syarat kredit agar debitur bisa bayar — turun bunga, perpanjang tenor, potong pokok, konversi ke saham. Restrukturisasi sehat punya covenant baru + monitoring ketat. Yang cuma \"perpanjang tenor biar Kolek 1 lagi\" tanpa perbaikan usaha = evergreening — menunda bom waktu.",
      ],
      formula: String.raw`\text{NPL gross} = \frac{\text{Kolek 3+4+5}}{\text{Total Kredit}} \qquad \text{NPL net} = \frac{\text{Kolek 3+4+5} - \text{CKPN}}{\text{Total Kredit}} \qquad \text{Coverage} = \frac{\text{CKPN}}{\text{Kolek 3+4+5}}`,
      formulaNote: "Kolek 3+4+5 = rupiah kredit macet (pembilang). Total Kredit = seluruh outstanding (penyebut). CKPN = cadangan yang sudah dibentuk. Contoh: 29,8/1.000 = 2,98% gross; (29,8−22)/1.000 = 0,78% net; 22/29,8 = 73,8% coverage — tiap Rp 100 macet sudah dicadangkan Rp 73,8 di muka.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"NPL turun pasti kabar baik.\" Rayakan setelah bedah, bukan sebelum: debitur sembuh, write-off agresif, atau kredit tumbuh cepat — ketiganya menurunkan rasio dengan cerita yang sangat berbeda.",
      },
      reference: "Ambang perhatian OJK: NPL gross > 5%.",
    },
    {
      id: "lab-npl",
      eyebrow: "Langkah 6 · Lab NPL",
      title: "NPL gross vs NPL net",
      prose: [
        "Dua wajah dari angka yang sama. Total kredit Rp 1.000 M, Kolek 3+4+5 Rp 29,8 M, CKPN Rp 22 M. Tugasmu: hitung NPL gross, NPL net, dan coverage ratio. Rasakan trade-off-nya: coverage tinggi = aman tapi mahal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_gross` (%)" },
        { id: "t2", text: "Hitung `npl_net` (%), setelah dikurangi CKPN" },
        { id: "t3", text: "Hitung `coverage` (%), lalu cetak ketiganya" },
      ],
      expected: "gross=2.98 net=0.78 coverage=73.8",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank A: NPL gross 3%, coverage 80%. Bank B: NPL gross 3%, coverage 30%. NPL-nya sama, tetapi Bank A jauh lebih defensif — sudah mencadangkan Rp 80 per Rp 100 NPL. Kalau kondisi memburuk, Bank B yang kelabakan.",
      },
      hints: [
        "Konsep: NPL gross mengukur porsi kredit bermasalah dari seluruh kredit; NPL net mengurangkan dulu cadangan yang sudah dibentuk — kerugian yang sudah dicadangkan tidak lagi membebani modal; coverage melihat dari sisi lain — seberapa tebal cadangan dibanding kredit bermasalah.",
        "Clue: gross = (Kolek 3+4+5 ÷ total kredit) × 100. Net memakai pembilang (Kolek 3+4+5 − CKPN). Coverage = (CKPN ÷ Kolek 3+4+5) × 100.",
        "Skeleton: `npl_gross = kolek_345 / ... * 100`, `npl_net = (... - ckpn) / total_kredit * 100`, `coverage = ... / kolek_345 * 100`.",
      ],
      code: {
        starter: `total_kredit = 1000.0  # miliar Rp\nkolek_345 = 29.8      # Kolek 3+4+5, miliar Rp\nckpn = 22.0           # cadangan yang sudah dibentuk, miliar Rp\n\n# TULIS KODEMU\nnpl_gross = \nnpl_net = \ncoverage = \n\nprint(f"gross={npl_gross:.2f} net={npl_net:.2f} coverage={coverage:.1f}")`,
        lockLines: 3,
        solution: `total_kredit = 1000.0  # miliar Rp\nkolek_345 = 29.8      # Kolek 3+4+5, miliar Rp\nckpn = 22.0           # cadangan yang sudah dibentuk, miliar Rp\n\n# TULIS KODEMU\nnpl_gross = kolek_345 / total_kredit * 100\nnpl_net = (kolek_345 - ckpn) / total_kredit * 100\ncoverage = ckpn / kolek_345 * 100\n\nprint(f"gross={npl_gross:.2f} net={npl_net:.2f} coverage={coverage:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_gross", value: 2.98, tol: 0.01, label: "`npl_gross` seharusnya 2.98", msg: "29.8 / 1000 × 100 = 2.98." },
          { kind: "equal", task: "t2", name: "npl_net", value: 0.78, tol: 0.01, label: "`npl_net` seharusnya 0.78", msg: "(29.8 − 22) / 1000 × 100 = 0.78." },
          { kind: "equal", task: "t3", name: "coverage", value: 73.8, tol: 0.2, label: "`coverage` sekitar 73.8", msg: "22 / 29.8 × 100 ≈ 73.8." },
          { kind: "stdout_matches", task: "t3", pattern: "gross=2\\.98\\s+net=0\\.78\\s+coverage=73\\.8", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: naikkan ckpn jadi 29,8 (coverage 100%) — NPL net = 0%, tetapi cadangan terkunci Rp 29,8 M.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: membaca status kredit",
      prose: [
        "Skenario 1 — Telat 45 hari, debitur kooperatif. → Kolektibilitas 2 (Dalam Perhatian Khusus): telepon dan pantau — ini ruang tunggu, bukan vonis. Contoh nyata: PT Sinar Abadi telat 45 hari karena direktur keuangannya opname — sebulan kemudian lunas. Menyita agunannya di hari ke-45 = kehilangan nasabah bagus + masalah hukum.",
        "Skenario 2 — Telat 120 hari tanpa prospek pembayaran. → Kolektibilitas 3: naikkan CKPN, investigasi serius — lampu kuning menyala.",
        "Skenario 3 — Telat di atas 270 hari atau debitur bangkrut/hilang. → Kolektibilitas 5 (Macet): akui kerugiannya, bentuk cadangan penuh, serahkan ke remedial. Menunda pengakuan tidak mengurangi kerugian — ia menundanya dengan bunga.",
        "Skenario 4 — Bayar tepat waktu (DPD 0) tetapi industrinya kolaps. → Downgrade kualitatif mengikuti 3 pilar OJK (prospek usaha, kinerja debitur, kemampuan bayar). Contoh nyata: perusahaan yang DPD-nya 0 tetapi sektornya mati bisa diturunkan kolektibilitasnya — kolektibilitas adalah termometer, bukan sekadar jam dinding DPD.",
        "Skenario 5 — NPL naik kuartalan. → Bedah tiga arah sebelum menyalahkan tim kredit: pembilang (apakah write-off ditahan?), penyebut (apakah kredit tumbuh cukup mengencerkan?), dan Kolek 2 (apakah arus masalah baru memburuk?). Contoh nyata: NPL 2,8% → 3,4% karena write-off ditahan Rp 600 M → Rp 200 M — bukan karena debitur memburuk.",
        "Aturan praktis 10 detik: DPD menentukan kotak, kotak menentukan cadangan; baca DPK (Kolek 2) untuk masa depan, NPL untuk masa lalu — dan bedah NPL sebelum menghakimi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira NPL turun = keadaan membaik, tanpa memeriksa write-off, pertumbuhan kredit, dan restrukturisasi. NPL bisa turun karena 'sampah dibuang' (write-off), karena 'ember diperbesar' (kredit tumbuh), atau karena 'sampah disulap' (evergreening) — tiga cerita yang maknanya berlawanan.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "NPL naik — salah siapa?",
      prose: [
        "Bank Nusantara, laporan kuartal: NPL gross naik dari 2,8% ke 3,4% dalam setahun. Direksi panik, menuduh tim kredit \"kendor\". Kamu diminta membedah. Data: total kredit Rp 50 T → Rp 52 T (tumbuh hanya 4%, di bawah target 10%); Kolek 3+4+5 Rp 1,4 T → Rp 1,77 T; write-off tahun ini Rp 200 M (tahun lalu Rp 600 M — direksi menahan write-off \"demi laba\"); Kolek 2 Rp 2,0 T → Rp 2,1 T (relatif stabil).",
        "Pembahasan: bukan (terutama) debitur. Pertama, write-off ditahan — tahun lalu Rp 600 M kredit macet dibersihkan dari pembilang; tahun ini cuma Rp 200 M, jadi Rp 400 M \"sampah lama\" masih nangkring di NPL. Kedua, penyebut loyo — kredit cuma tumbuh 4%, tidak cukup mengencerkan NPL. Kolek 2 stabil = arus masalah baru tidak memburuk. Rekomendasi: (1) lanjutkan write-off untuk kolek 5 yang recovery-nya tidak ekonomis — NPL bersih lebih jujur daripada NPL cantik; (2) jangan salahkan tim kredit; fokus ke akselerasi penyaluran sehat agar penyebut tumbuh. Pelajaran: NPL adalah rasio — baca pembilang DAN penyebut.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Debitur DPD 0 di bank kita tetapi SLIK mencatat tunggakan 60 hari di dua bank lain = perlakukan sebagai Kolek 2 mental: naikkan monitoring, siapkan skenario antisipatif. Debitur memprioritaskan pembayaran — giliran kita bisa tiba bulan depan.",
      },
      reference: "Aturan 10 detik: NPL turun? Bedah tiga penyebab — debitur sembuh, write-off, atau kredit tumbuh.",
    },
    {
      id: "evergreening-bedah",
      eyebrow: "Langkah 9 · Evergreening",
      title: "Operasi plastik kredit macet",
      prose: [
        "Evergreening = restrukturisasi kosmetik yang membuat kredit macet terlihat lancar tanpa memperbaiki kemampuan bayar debitur. Tanda-tanda forensiknya: restrukturisasi tepat sebelum DPD 90 (lolos dari NPL di detik terakhir), perpanjangan tenor tanpa perbaikan usaha yang terverifikasi, bunga yang dikapitalisasi menjadi pokok (utang bertambah agar terlihat \"dibayar\"), dan — yang paling telanjang — kredit baru untuk membayar kredit lama.",
        "Contoh dengan angka: kredit Rp 10 M di DPD 85 direstrukturisasi (tenor +3 tahun) → kembali Kolek 1, NPL \"terselamatkan\" Rp 10 M. Enam bulan kemudian default juga — dengan bunga yang terakrual Rp 1,2 M. Kerugian kini Rp 11,2 M vs Rp 10 M jika diakui sejak awal; plus Rp 0,6 M pendapatan bunga fiktif 6 bulan yang harus dibalik (reversal), memukul laba dua kali. Evergreening tidak mengurangi kerugian — ia menundanya dengan bunga.",
        "Bedakan dengan restrukturisasi sehat: ada covenant baru yang terukur, monitoring diperketat, proyeksi usaha di-haircut (bukan dipertahankan), dan seringkali ada pengorbanan kreditor (potong bunga/pokok). Uji satu kalimatnya: \"apakah syarat baru membuat debitur LEBIH MUNGKIN membayar, atau hanya membuat LAPORAN terlihat lebih baik?\" Jika jawabannya yang kedua, itu operasi plastik.",
        "Aturan keputusan. Satu: setiap restrukturisasi dalam 30 hari sebelum ambang NPL → review independen (bukan oleh RM yang sama). Dua: lacak \"restrukturisasi lalu default dalam 12 bulan\" — di atas 40% berarti pabrik evergreening, bukan program penyelamatan. Tiga: restrukturisasi kedua untuk debitur yang sama = otomatis eskalasi ke komite. Empat: jangan pernah menilai keberhasilan restrukturisasi dari \"kolektibilitas membaik\" — nilai dari arus kas aktual yang masuk 12 bulan kemudian.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kolektibilitas adalah termometer, bukan termostat",
        body: "Termometer mengukur demam; ia tidak menyembuhkan. Kolektibilitas pun begitu — ia mengukur, bukan memperbaiki. Menembak termometernya (re-aging, evergreening) tidak menurunkan demam; ia hanya membutakan dokter. Heuristik yang paling berharga di lesson ini: jangan awasi NPL — awasi ruang tunggunya. Kolek 2 (DPK) adalah tempat NPL diputuskan, berbulan-bulan sebelum tercetak. Satu angka mengalahkan semua dashboard: TINGKAT MIGRASI Kolek 2 → 3. Jika 25% DPK bermigrasi tiap kuartal, NPL 6 bulan ke depan sudah bisa diramal hari ini — dan masih bisa dicegah dengan collection di bucket awal. Analis yang menatap NPL seperti dokter yang menghitung mayat; analis yang menatap migrasi DPK seperti dokter yang memeriksa pasien demam. Rawat yang demam, jangan hitung yang gugur. Jadikan migrasi DPK sebagai KPI collection, bukan NPL — karena NPL adalah hasil yang sudah terlambat untuk di-KPI-kan. Tim collection yang dinilai dari \"berapa DPK yang sembuh\" akan bekerja di hulu tempat uang masih bisa diselamatkan; tim yang dinilai dari NPL akan sibuk menjelaskan mengapa angka yang sudah mati itu tidak bisa diubah.",
      },
      reference: "Awasi ruang tunggu (DPK), bukan kamar mayat (NPL).",
    },
    {
      id: "transfer-portofolio",
      kind: "transfer",
      noLiteral: ["kolek", "npl_gross", "n_dpk"],
      eyebrow: "Transfer check · tanpa petunjuk",
      title: "Portofolio baru, tanpa jaring pengaman",
      prose: [
        "Bank Nusantara menyerahkan portofolio cabang baru — 8 debitur yang belum pernah kamu lihat di lesson ini. Tidak ada petunjuk, tidak ada hasil yang diharapkan. Terapkan sendiri: klasifikasikan tiap debitur, hitung NPL gross portofolio ini, dan hitung berapa debitur yang duduk di ruang tunggu DPK.",
        "Aturan mainnya sama seperti yang sudah kamu pelajari: DPD menentukan kotak (0 → Kolek 1, ≤90 → 2, ≤180 → 3, ≤270 → 4, selebihnya 5); NPL gross hanya menghitung Kolek 3, 4, 5 dibagi total outstanding.",
      ],
      tasks: [
        { id: "t1", text: "Klasifikasikan tiap debitur ke `kolek` (list angka 1–5) dari kolom `dpd`" },
        { id: "t2", text: "Hitung `npl_gross` (%) portofolio ini" },
        { id: "t3", text: "Hitung `n_dpk` = jumlah debitur berstatus Kolek 2, lalu cetak ketiganya" },
      ],
      code: {
        starter: `# DATA — jangan ubah
nama = ["UD Maju Terus", "PT Cahaya Timur", "CV Berkah Jaya", "H. Sulaiman", "PT Nusa Karya", "Koperasi Tani Makmur", "UD Sumber Rejeki", "PT Wira Steel"]
dpd = [0, 12, 95, 150, 200, 310, 45, 75]
outstanding = [120, 85, 40, 60, 25, 18, 90, 110]  # miliar Rp

# TULIS KODEMU: klasifikasikan tiap debitur ke kolektibilitas 1-5
kolek =

# TULIS KODEMU: NPL gross (%) — pembilang HANYA Kolek 3, 4, 5
npl_gross =

# TULIS KODEMU: jumlah debitur DPK (Kolek 2), lalu cetak semuanya
n_dpk =

print(f"kolek={kolek}")
print(f"npl_gross={npl_gross:.2f} n_dpk={n_dpk}")`,
        lockLines: 4,
        solution: `# DATA — jangan ubah
nama = ["UD Maju Terus", "PT Cahaya Timur", "CV Berkah Jaya", "H. Sulaiman", "PT Nusa Karya", "Koperasi Tani Makmur", "UD Sumber Rejeki", "PT Wira Steel"]
dpd = [0, 12, 95, 150, 200, 310, 45, 75]
outstanding = [120, 85, 40, 60, 25, 18, 90, 110]  # miliar Rp

# TULIS KODEMU: klasifikasikan tiap debitur ke kolektibilitas 1-5
kolek = [1 if d == 0 else (2 if d <= 90 else (3 if d <= 180 else (4 if d <= 270 else 5))) for d in dpd]

# TULIS KODEMU: NPL gross (%) — pembilang HANYA Kolek 3, 4, 5
npl_macet = sum(o for o, k in zip(outstanding, kolek) if k >= 3)
npl_gross = npl_macet / sum(outstanding) * 100

# TULIS KODEMU: jumlah debitur DPK (Kolek 2), lalu cetak semuanya
n_dpk = sum(1 for k in kolek if k == 2)

print(f"kolek={kolek}")
print(f"npl_gross={npl_gross:.2f} n_dpk={n_dpk}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kolek", value: [1, 2, 3, 3, 4, 5, 2, 2], label: "BLIND · klasifikasi `kolek` tiap debitur", msg: "Periksa tiap DPD terhadap ambangnya: 0 → 1, ≤90 → 2, ≤180 → 3, ≤270 → 4, selebihnya 5. Hati-hati di dekat batas 90 dan 180." },
          { kind: "equal", task: "t2", name: "npl_gross", value: 26.09, tol: 0.02, label: "BLIND · `npl_gross` portofolio", msg: "Jumlahkan outstanding debitur Kolek 3, 4, 5 — itu pembilangnya — bagi total outstanding, kali 100." },
          { kind: "equal", task: "t3", name: "n_dpk", value: 3, tol: 1e-9, label: "BLIND · jumlah debitur DPK", msg: "DPK = debitur dengan Kolek tepat 2. Hitung dari list kolek yang sudah kamu buat." },
          { kind: "stdout_matches", task: "t3", pattern: "npl_gross=26\\.09\\s+n_dpk=3", label: "BLIND · `print` menampilkan ketiganya", msg: "Pastikan format cetaknya sama dengan pola yang diminta." },
        ],
      },
      reference: "Transfer check lolos tanpa petunjuk = bukti kamu bisa, bukan sekadar bisa mengikuti.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "DPD dihitung dari jatuh tempo tertua yang BELUM dibayar; ambang global 90+ hari.",
        "Kolektibilitas 1–5: 1 lancar, 2 DPK (1–90 hari), 3–5 = NPL. Untuk korporasi ada 3 pilar penilaian.",
        "NPL gross vs net vs coverage bercerita beda — selalu tanya ketiganya.",
        "Hapus buku ≠ hapus tagih ≠ menyerah. Restrukturisasi tanpa perbaikan fundamental = evergreening.",
        "NPL adalah rasio — bedah pembilang (write-off, debitur) dan penyebut (pertumbuhan kredit).",
      ],
      next: { label: "CR3 — PD, LGD, EAD", href: "/learn/cr3-pd-lgd-ead" },
      quiz: [
        {
          q: "Cicilan jatuh tempo 15 September belum dibayar. Hari ini 13 Oktober. DPD dan kolektibilitasnya?",
          options: [
            { text: "DPD 28, Kolek 1 (Lancar)", why: "DPD 28 sudah menunggak — tidak mungkin Kolek 1." },
            { text: "DPD 28, Kolek 2 (DPK) — belum NPL", why: "DPD dari jatuh tempo tertua yang BELUM dibayar (15 Sep, bukan 15 Agu yang sudah dibayar) = 28 hari → Kolek 2. Belum NPL.", correct: true },
            { text: "DPD 59, Kolek 2 (DPK)", why: "59 hari itu kalau cicilan Agustus belum dibayar — faktanya sudah dibayar." },
            { text: "DPD 91, Kolek 3 (NPL)", why: "DPD-nya 28, bukan 91. Jangan asal tambah." },
          ],
        },
        {
          q: "Bank A: NPL gross 3%, coverage 80%. Bank B: NPL gross 3%, coverage 30%. Mana yang lebih defensif?",
          options: [
            { text: "Bank B — cadangannya kecil, labanya lebih besar", why: "Laba besar hari ini dengan bantal tipis = rapuh, bukan kuat." },
            { text: "Sama saja — NPL-nya sama", why: "NPL sama tetapi ketahanan berbeda — itulah gunanya coverage ratio." },
            { text: "Tidak bisa dibandingkan", why: "Justru bisa: coverage ratio adalah pembandingnya." },
            { text: "Bank A — cadangannya jauh lebih tebal untuk NPL yang sama", why: "Bank A sudah mencadangkan Rp 80 per Rp 100 NPL vs Bank B cuma Rp 30. Kalau kondisi memburuk, Bank B yang kelabakan.", correct: true },
          ],
        },
        {
          q: "Perusahaan bayar tepat waktu (DPD 0) tapi harga komoditasnya anjlok 50% dan 2 pesaing bangkrut. Analis risiko sebaiknya?",
          options: [
            { text: "Tetap Kolek 1 — DPD 0 berarti lancar", why: "Untuk segmen komersial, OJK menilai 3 pilar — DPD 0 tidak otomatis Kolek 1." },
            { text: "Langsung Kolek 5", why: "Terlalu jauh — belum ada tunggakan atau kepastian bangkrut." },
            { text: "Pertimbangkan downgrade kualitatif — prospek usaha adalah pilar penilaian selain DPD", why: "Menunggu telat bayar = menunggu terlambat. Prospek usaha yang kolaps adalah dasar downgrade yang sah.", correct: true },
            { text: "Tunggu sampai telat bayar dulu", why: "Itu reaktif, bukan manajemen risiko." },
          ],
        },
        {
          q: "Restrukturisasi kredit: mana yang merupakan red flag evergreening?",
          options: [
            { text: "Perpanjang tenor berulang kali agar status kembali Kolek 1, tanpa perbaikan arus kas debitur", why: "Ciri khas evergreening: status akuntansi membaik sementara realitas ekonomi tidak berubah.", correct: true },
            { text: "Perpanjang tenor + turun bunga + covenant ketat + monitoring bulanan", why: "Ini restrukturisasi sehat: ada perbaikan syarat plus pengamanan." },
            { text: "Konversi sebagian utang menjadi saham dengan valuasi independen", why: "Ini restrukturisasi substantif, bukan kosmetik." },
            { text: "Penjadwalan ulang dengan grace period 3 bulan untuk debitur yang usahanya masih jalan", why: "Grace period untuk usaha yang masih jalan adalah fisioterapi yang wajar." },
          ],
        },
        {
          q: "Debitur DPD 0 di bank kita, tetapi SLIK mencatat tunggakan 60 hari di dua bank lain. Sikap analis yang tepat?",
          options: [
            { text: "Tetap Kolek 1 — yang penting bayar ke kita lancar", why: "Debitur memprioritaskan pembayaran — giliran kita bisa tiba bulan depan." },
            { text: "Waspada: perlakukan sebagai sinyal Kolek 2 — naikkan monitoring, siapkan skenario antisipatif", why: "SLIK adalah radar dini; mengabaikannya = terbang buta.", correct: true },
            { text: "Langsung turunkan ke Kolek 5", why: "Belum ada tunggakan di kita — Kolek 5 terlalu jauh." },
            { text: "Tetap Kolek 1 dan naikkan limitnya — ia terbukti membayar ke kita", why: "Membayar ke kita hari ini bukan jaminan bulan depan; menaikkan limit saat SLIK memburuk justru menambah eksposur ke debitur yang kesulitan." },
          ],
        },
      ],
    },
  ],
};
