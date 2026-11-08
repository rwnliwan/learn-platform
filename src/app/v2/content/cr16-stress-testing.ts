import type { V2Lesson } from "../lib/types";

export const cr16: V2Lesson = {
  slug: "cr16-stress-testing",
  track: "Credit Risk",
  module: "Risiko Portofolio & Stress Testing",
  title: "CR16 — Stress Testing",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Latihan kebakaran untuk neraca",
      prose: [
        "Gedung itu rutin latihan kebakaran — alarm berbunyi, semua turun lewat tangga darurat. Tidak ada api sungguhan. Tetapi saat kebakaran betulan terjadi di 2023, evakuasi berjalan mulus: tidak ada korban.",
        "Stress test adalah latihan kebakaran untuk neraca bank: \"bagaimana jika pengangguran 12%, harga properti jatuh 40%, rupiah melemah 30% — bersamaan?\" Tidak ada krisis sungguhan — tetapi bank menghitung: berapa CKPN tambahan? Berapa KPMM tersisa? Tindakan apa yang disiapkan?",
        "Bank yang rajin latihan (dan bertindak atas hasilnya: tambah modal, kurangi eksposur) selamat dari 2008, 2020. Bank yang menganggapnya formalitas... tidak ada di sini untuk bercerita.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Stress test terbaik bukan yang skenarionya paling seram — melainkan yang hasilnya mengubah keputusan. Stress test yang tidak menghasilkan action plan = latihan kebakaran tanpa tangga darurat.",
      },
      reference: "Stress test = simulasi gempa untuk gedung: bukan meramal gempa, melainkan memastikan gedung tidak roboh.",
    },
    {
      id: "rantai",
      eyebrow: "Langkah 2 · Rantai",
      title: "Skenario buruk yang disengaja",
      prose: [
        "Tiga jenis skenario: baseline — proyeksi normal (untuk perbandingan); adverse — resesi moderat (misal: GDP −2%, pengangguran 9%); severely adverse — krisis berat (GDP −5%, pengangguran 12%, properti −40%).",
        "Rantai transmisi: skenario makro → model satelit (CR11) → PD/LGD naik → ECL/CKPN naik → laba turun → modal turun; migrasi rating → RWA naik (bobot risiko naik); modal turun + RWA naik → KPMM jatuh (jepitan dua sisi!).",
        "Skenario harus parah tapi masuk akal (severe but plausible). Terlalu ringan = tidak menguji apa-apa. Terlalu ekstrem (\"meteor jatuh\") = tidak ada yang bertindak (dianggap fiksi). Patokan: lebih buruk dari resesi historis terburuk, tetapi masih bisa dibayangkan terjadi.",
      ],
      tasks: [],
      reference: "Melompati langkah rantai = angka tidak bisa dipertahankan (auditor akan bertanya 'PD naiknya dari mana?').",
    },
    {
      id: "lab-migrasi",
      eyebrow: "Langkah 3 · Lab Migrasi",
      title: "Peta perpindahan rating",
      prose: [
        "Migration matrix = tabel probabilitas perpindahan rating dalam 1 tahun (baris = rating awal). Matriks `migrasi` dan `portofolio` (Rp M) terkunci. Tugasmu: hitung default baru per rating dan totalnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `default_bbb` dan `default_bb` (Rp M)" },
        { id: "t2", text: "Hitung `default_total` (semua rating)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "BBB=32.5 BB=31.5 total=81.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Migration matrix historis bisa langsung dipakai untuk stres.\" Matriks historis = rata-rata masa lalu (termasuk tahun boom). Untuk stres, matriks harus disesuaikan: naikkan probabilitas downgrade/default sesuai skenario. Memakai matriks rata-rata untuk skenario krisis = menguji banjir dengan data musim kemarau.",
      },
      hints: [
        "Default rating r = portofolio[r] × migrasi[r][3].",
        "Kolom ke-4 (indeks 3) = default.",
        "default_bbb = portofolio['BBB'] * migrasi['BBB'][3]",
      ],
      code: {
        starter: `migrasi = {\n    "AAA": [0.92, 0.07, 0.01, 0.00],\n    "AA":  [0.05, 0.85, 0.09, 0.01],\n    "A":   [0.03, 0.10, 0.82, 0.05],\n    "BBB": [0.02, 0.05, 0.80, 0.13],\n    "BB":  [0.01, 0.03, 0.75, 0.21],\n}\nportofolio = {"AAA": 100, "AA": 200, "A": 300, "BBB": 250, "BB": 150}\n\n# TULIS KODEMU\ndefault_bbb = \ndefault_bb = \ndefault_total = \n\nprint(f"BBB={default_bbb:.1f} BB={default_bb:.1f} total={default_total:.1f}")`,
        lockLines: 10,
        solution: `migrasi = {\n    "AAA": [0.92, 0.07, 0.01, 0.00],\n    "AA":  [0.05, 0.85, 0.09, 0.01],\n    "A":   [0.03, 0.10, 0.82, 0.05],\n    "BBB": [0.02, 0.05, 0.80, 0.13],\n    "BB":  [0.01, 0.03, 0.75, 0.21],\n}\nportofolio = {"AAA": 100, "AA": 200, "A": 300, "BBB": 250, "BB": 150}\n\n# TULIS KODEMU\ndefault_bbb = portofolio["BBB"] * migrasi["BBB"][3]\ndefault_bb = portofolio["BB"] * migrasi["BB"][3]\ndefault_total = sum(portofolio[r] * migrasi[r][3] for r in portofolio)\n\nprint(f"BBB={default_bbb:.1f} BB={default_bb:.1f} total={default_total:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "default_bbb", value: 32.5, tol: 1e-9, label: "`default_bbb` seharusnya 32.5", msg: "250 × 0.13 = 32.5." },
          { kind: "equal", task: "t1", name: "default_bb", value: 31.5, tol: 1e-9, label: "`default_bb` seharusnya 31.5", msg: "150 × 0.21 = 31.5." },
          { kind: "equal", task: "t2", name: "default_total", value: 81.0, tol: 1e-9, label: "`default_total` seharusnya 81.0", msg: "Jumlahkan semua rating: 0 + 2 + 15 + 32.5 + 31.5." },
          { kind: "stdout_matches", task: "t3", pattern: "BBB=32\\.5\\s+BB=31\\.5\\s+total=81\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pola monotonik: makin rendah rating awal, makin besar porsi default.",
    },
    {
      id: "reverse",
      eyebrow: "Langkah 4 · Reverse",
      title: "Mulai dari kematian",
      prose: [
        "Reverse stress test = dibalik: bukan \"skenario X → dampak Y\", melainkan \"dampak fatal Y → skenario apa yang menyebabkannya?\" Contoh: \"NPL berapa yang membuat KPMM jebol 8%?\" → jawab: 15% → \"skenario apa yang membuat NPL 15%?\"",
        "Kegunaan: menetapkan risk appetite (\"kita tidak boleh...\") dan menemukan titik buta — kombinasi faktor yang tidak terpikirkan dalam skenario normal (misal: NPL naik bersamaan dengan rush penarikan dana).",
        "Stress test normal menjawab \"seberapa sakit?\"; reverse stress test menjawab \"apa yang membunuh kita?\". Bank hanya butuh satu dari keduanya untuk bertahan — tetapi butuh keduanya untuk tidur nyenyak.",
      ],
      tasks: [],
      reference: "KPMM menyentuh 8% di sekitar NPL 13–14% — itulah titik mati bank ini. Mulai dari kematian, rancang pencegahannya.",
    },
    {
      id: "lab-kpmm",
      eyebrow: "Langkah 5 · Lab KPMM",
      title: "Apakah bank selamat?",
      prose: [
        "Fungsi `stress_test(npl)` terkunci: CKPN tambahan = (npl−npl_awal) × 50.000 × coverage 60%; RWA naik 15% per 5pp kenaikan NPL (migrasi). Modal awal Rp 5200 M, RWA awal Rp 40000 M. Tugasmu: hitung KPMM skenario ringan (NPL 5%) dan berat (NPL 10%), lalu tentukan status skenario berat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `kpmm_ringan` dan `kpmm_berat` (%)" },
        { id: "t2", text: "Tentukan `status_berat` (AMAN/WASPADA/KRITIS!)" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "ringan=10.35 WASPADA berat=6.02 KRITIS!",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jepitan dua sisi: stres menekan pembilang (modal via CKPN) DAN menggelembungkan penyebut (RWA via downgrade) bersamaan. Menghitung satu sisi saja = optimis 1+ poin KPMM — selisih yang bisa menentukan 'nyaman' vs 'OJK menelepon'.",
      },
      hints: [
        "stress_test mengembalikan (ckpn, modal, rwa, kpmm) — ambil elemen ke-4.",
        "Status: >=12 AMAN; >=9 WASPADA; selain itu KRITIS!.",
        "kpmm_ringan = stress_test(0.05)[3]",
      ],
      code: {
        starter: `modal_awal, rwa_awal, npl_awal = 5200, 40000, 0.025\n\ndef stress_test(npl_stress):\n    ckpn_tambahan = (npl_stress - npl_awal) * 50000 * 0.60\n    modal = modal_awal - ckpn_tambahan\n    rwa = rwa_awal * (1 + (npl_stress - npl_awal) * 3)\n    kpmm = modal / rwa * 100\n    return ckpn_tambahan, modal, rwa, kpmm\n\n# TULIS KODEMU\nkpmm_ringan = \nkpmm_berat = \nstatus_berat = \n\nprint(f"ringan={kpmm_ringan:.2f}% berat={kpmm_berat:.2f}% status={status_berat}")`,
        lockLines: 8,
        solution: `modal_awal, rwa_awal, npl_awal = 5200, 40000, 0.025\n\ndef stress_test(npl_stress):\n    ckpn_tambahan = (npl_stress - npl_awal) * 50000 * 0.60\n    modal = modal_awal - ckpn_tambahan\n    rwa = rwa_awal * (1 + (npl_stress - npl_awal) * 3)\n    kpmm = modal / rwa * 100\n    return ckpn_tambahan, modal, rwa, kpmm\n\n# TULIS KODEMU\nkpmm_ringan = stress_test(0.05)[3]\nkpmm_berat = stress_test(0.10)[3]\nstatus_berat = "KRITIS!" if kpmm_berat < 9 else ("WASPADA" if kpmm_berat < 12 else "AMAN")\n\nprint(f"ringan={kpmm_ringan:.2f}% berat={kpmm_berat:.2f}% status={status_berat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kpmm_ringan", value: 10.35, tol: 0.05, label: "`kpmm_ringan` sekitar 10.35", msg: "Modal 4450 / RWA 43000 = 10.35%." },
          { kind: "equal", task: "t1", name: "kpmm_berat", value: 6.02, tol: 0.05, label: "`kpmm_berat` sekitar 6.02", msg: "Modal 2950 / RWA 49000 = 6.02% — di bawah minimum!" },
          { kind: "equal", task: "t2", name: "status_berat", value: "KRITIS!", label: "`status_berat` seharusnya 'KRITIS!'", msg: "6.02 < 9 → KRITIS!." },
          { kind: "stdout_matches", task: "t3", pattern: "ringan=10\\.35%\\s+berat=6\\.02%\\s+status=KRITIS!", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Hasil 9,2% (zona kuning) → bertindak proporsional: tahan dividen, siapkan contingency capital plan.",
    },
    {
      id: "jepitan",
      eyebrow: "Langkah 6 · Jepitan",
      title: "Dua sisi yang menekan",
      prose: [
        "Mekanisme stress test yang paling penting untuk dihayati: stres menekan pembilang (modal turun via CKPN tambahan) DAN menggelembungkan penyebut (RWA naik via migrasi/downgrade) bersamaan. Contoh: stress test menghitung CKPN tambahan Rp 2 T tetapi RWA dianggap tetap — yang terlewat: downgrade menaikkan RWA juga. KPMM 14,3% → 10% (bukan 11,4% jika RWA tetap); selisih 1,4 poin = selisih 'nyaman' vs 'OJK menelepon'.",
        "Menghitung satu sisi = optimis 1+ poin KPMM — selisih yang bisa menentukan hidup-mati keputusan. Selalu tunjukkan kedua sisi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "KPMM stres 9,2% (masih di atas 8%) → jangan santai. Bertindak proporsional sekarang: tahan sebagian dividen, siapkan contingency capital plan, ketatkan limit sensitif — modal disiapkan saat murah (sehat), bukan saat mahal (krisis).",
      },
      reference: "Modal termurah disiapkan saat bank sehat — rights issue saat krisis = dilusi brutal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: stress test yang mengubah keputusan",
      prose: [
        "Skenario 1 — Merancang skenario. → Severe but plausible: lebih buruk dari resesi historis terburuk, tetapi masih bisa dibayangkan (1998: GDP −13% adalah preseden Indonesia). Terlalu ringan = tidak menguji apa-apa; terlalu ekstrem ('meteor jatuh') = tidak ada yang bertindak.",
        "Skenario 2 — Menerjemahkan makro menjadi PD/LGD. → Wajib lewat model satelit ber-backtest (regresi 10 tahun, R² teruji). 'PD naik 50% karena skenario berat' tanpa model = angka firasat yang runtuh di pertanyaan pertama auditor: 'PD naiknya dari mana?'",
        "Skenario 3 — Menghitung dampak ke KPMM. → Hitung DUA sisi: modal turun (CKPN tambahan) DAN RWA naik (migrasi/downgrade). Contoh nyata: 14,3% → 10% (bukan 11,4% bila RWA dianggap tetap) — selisih 1,4 poin = selisih 'nyaman' vs 'OJK menelepon'.",
        "Skenario 4 — Menetapkan risk appetite. → Reverse stress test: mulai dari kematian ('NPL berapa yang menjebol KPMM 8%?') lalu cari skenarionya. Stress test normal menjawab 'seberapa sakit?'; reverse menjawab 'apa yang membunuh kita?' — bank butuh keduanya untuk tidur nyenyak.",
        "Skenario 5 — Hasil keluar: KPMM 14% → 8,7%. → Ubah keputusan: tahan dividen (Bank B menahan Rp 900 M modal), susun contingency capital plan, sesuaikan limit sektor. Laporan 200 halaman yang tidak mengubah satu keputusan pun = teater — Bank A membuktikannya Maret 2020.",
        "Aturan praktis 10 detik: nilai stress test = keputusan yang berubah, bukan halaman yang dihasilkan; skenario boleh diperdebatkan, tetapi rantai transmisinya harus bisa dipertahankan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Direksi memprotes skenario 'terlalu ekstrem' dan meminta 'pakai yang ringan saja agar hasilnya bagus' — formalitas berbahaya yang memberi rasa aman palsu. Ironisnya hasil 8,7% justru kabar baik: bank selamat dari skenario seberat itu — itulah yang ingin didengar OJK dan pasar.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Skenario 'terlalu ekstrem'?",
      prose: [
        "Tim risiko Bank Nusantara mengusulkan skenario severely adverse: GDP −4%, pengangguran 12%, harga properti −35%. Hasil: KPMM jatuh 14% → 8,7%. Direksi protes: \"Terlalu ekstrem! Tidak pernah terjadi!\" (Padahal 1998: GDP −13%, 2020: −2% dalam sekuartal.) \"Kalau dipublikasikan, pasar panik!\" Usulan tandingan: pakai skenario \"ringan saja\" agar hasilnya bagus.",
        "Pertahankan dengan tiga argumen: (1) preseden historis — 1998 jauh lebih buruk; skenario ini plausible secara historis Indonesia. (2) Tujuan — stress test bukan ramalan (tidak harus \"mungkin terjadi tahun ini\"), melainkan uji ketahanan; seperti uji tabrak mobil (tidak ada yang berharap tabrakan, tetapi mobil harus lolos). (3) Hasil 8,7% justru kabar baik: bank selamat dari skenario seberat ini — itu yang ingin didengar OJK/pasar.",
        "Risiko skenario ringan: (1) formalitas berbahaya — memberi rasa aman palsu; (2) OJK menolak — regulator menilai kewajaran skenario (ICAAP); (3) saat krisis betulan datang, bank tidak punya contingency plan — dan direksi akan bertanya \"kenapa stress test tidak menangkap ini?\" Pelajaran: skenario yang \"nyaman\" = stress test yang gagal.",
      ],
      tasks: [],
      reference: "Skenario yang 'nyaman' gagal pada tujuannya — dan analis yang menandatanganinya ikut bertanggung jawab.",
    },
    {
      id: "teater",
      eyebrow: "Langkah 9 · Dari teater ke keputusan",
      title: "Stress test yang mengubah neraca",
      prose: [
        "Dua bank fiktif yang terinspirasi kisah nyata. Bank A menjalankan stress test tahunan dengan khidmat: 200 halaman laporan, skenario severely adverse lengkap, hasil KPMM 14% → 9,1%. Direksi membaca ringkasan eksekutif, mengangguk, laporan disimpan. Tidak ada keputusan yang berubah: dividen tetap dibagikan 60% dari laba (Rp 1,8 triliun), tidak ada contingency capital plan, limit sektor properti tetap. Maret 2020: pasar panik, NPL naik 3% → 7% dalam dua kuartal, KPMM menyentuh 9,4% — di atas minimum 8%, tetapi pasar mencium bau darah; harga saham bank jatuh 40%, cost of fund naik 150 bps. Direksi mengadakan rapat darurat dan bertanya: \"kenapa stress test kita tidak mencegah ini?\" Jawabannya pahit: stress test-nya menangkap — manusianya tidak bertindak. Bank B, dengan hasil yang mirip (14% → 8,7%), melakukan tiga hal berbeda: menahan dividen menjadi 30% (menahan Rp 900 miliar modal di dalam bank), menyiapkan standby rights issue Rp 2 triliun (dokumen siap, tinggal eksekusi), dan memangkas limit baru ke sektor properti 25%. Biaya dari ketiga keputusan itu: Rp 900 miliar dividen yang \"hilang\" + Rp 150 juta biaya penasihat standby. Saat 2020 datang, Bank B melewatinya dengan KPMM 11,2% — dan justru mengakuisisi portofolio Bank A yang terpaksa dijual murah.",
        "Bandingkan dua cara kerja ini — teater vs keputusan. Teater: stress test adalah acara tahunan untuk memuaskan OJK; metrik keberhasilannya = \"laporan selesai tepat waktu dan OJK tidak komplain\". Keputusan: stress test adalah alat alokasi modal; metrik keberhasilannya = \"berapa keputusan yang berubah karena hasilnya\". Cara salah yang umum: mengukur kualitas stress test dari kecanggihan modelnya (model satelit machine learning! 50 skenario!). Kecanggihan tanpa keputusan = teater berbiaya mahal. Cara benar: setiap stress test WAJIB menghasilkan minimal satu dari empat keputusan — (1) tahan/kurangi dividen, (2) tambah modal atau siapkan contingency capital, (3) kurangi limit/eksposur sektor sensitif, (4) ubah pricing untuk mencerminkan biaya modal stres. Jika hasil stress test \"tidak mengubah apa-apa\", maka ada dua kemungkinan: banknya super kuat (buktikan dengan buffer yang terukur), atau skenarionya terlalu ringan (kembali ke mini-case langkah 7 — skenario yang nyaman = stress test yang gagal).",
        "Aturan keputusan untuk analis: tulis \"action trigger\" SEBELUM stress test dijalankan, bukan sesudah hasilnya keluar. Contoh yang disepakati komite di awal tahun: \"jika KPMM stres < 10% → dividen otomatis dipangkas ke 30%; jika < 9% → contingency capital plan diaktifkan; jika NPL stres > 8% → limit properti dibekukan.\" Menetapkan pemicu sebelum melihat hasil mencegah negosiasi politik sesudahnya — persis logika pemicu SICR tertulis. Dan ada dimensi waktu yang kritis: modal yang disiapkan saat bank sehat (laba ditahan, rights issue dari posisi kuat) biayanya murah; modal yang dicari saat krisis (rights issue darurat di harga saham jatuh 40%) biayanya brutal — dilusi 2-3x lipat. Inilah ekonomi terdalam stress test: ia memindahkan keputusan modal dari \"saat mahal dan panik\" ke \"saat murah dan tenang\". Bank A membayar Rp 900 miliar dividen + kehilangan akuisisi murah; Bank B \"membayar\" Rp 900 miliar laba ditahan + Rp 150 juta biaya penasihat — dan membeli masa depan dengan diskon. Stress test yang baik bukan ramalan; ia adalah mesin pemindah waktu untuk keputusan modal.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Nilai stress test = keputusan yang berubah, bukan halaman yang dihasilkan",
        body: "Setiap kali selesai menjalankan stress test, ajukan satu pertanyaan sebelum menutup laptop: \"keputusan apa yang berbeda besok pagi karena angka-angka ini?\" Jika jawabannya \"tidak ada\", kamu baru saja menyelesaikan teater — bukan stress test. Heuristiknya: kualitas stress test berbanding lurus dengan ketidaknyamanan yang ia hasilkan. Hasil yang membuat semua orang nyaman (\"KPMM stres 13%, aman!\") hampir pasti salah satu dari dua hal: skenario terlalu ringan, atau rantai transmisinya bocor (satu sisi jepitan tidak dihitung). Sebaliknya, hasil yang membuat direksi tidak nyaman (\"8,7%? kita harus tahan dividen?\") adalah tanda mesinnya bekerja — ketidaknyamanan itulah bahan bakar keputusan. Tanda paling cepat untuk membedakan teater dari yang asli: lihat notulen komite. Teater menghasilkan notulen \"laporan diterima dan disetujui\". Yang asli menghasilkan notulen \"disetujui: dividen 30%, standby rights issue Rp 2 T, limit properti −25%\". Analis yang laporannya tidak pernah mengubah keputusan akan perlahan dianggap dekorasi — dan saat krisis datang, dekorasi adalah yang pertama disalahkan.",
      },
      reference: "Action trigger ditulis sebelum hasil keluar. Modal murah disiapkan saat tenang.",
    },
    {
      id: "satelit",
      eyebrow: "Langkah 10 · Rantai yang bocor",
      title: "\"PD naiknya dari mana?\"",
      prose: [
        "Langkah rantai menyebut model satelit sekilas: skenario makro → model satelit → PD/LGD naik. Di sinilah rantai stress test paling sering bocor — dan kebocoran ini tidak terlihat sampai auditor atau OJK bertanya. Model satelit = model yang menerjemahkan variabel makro (GDP, pengangguran, suku bunga) menjadi parameter risiko (PD, LGD, NPL). Contoh yang benar: regresi dari 10 tahun data — setiap kenaikan pengangguran 1 poin menaikkan NPL segmen KTA 0,8 poin (R² 0,72, teruji). Contoh yang bocor: \"PD naik 50% karena skenario berat\" — angka dari firasat, tanpa model, tanpa data, tanpa backtest. Keduanya menghasilkan \"PD stres\", tetapi yang pertama bisa dipertahankan di depan auditor, yang kedua runtuh di pertanyaan pertama: \"PD naiknya dari mana?\" Referensi langkah rantai sudah mengingatkan: melompati langkah = angka tidak bisa dipertahankan. Pendalamannya: bagaimana memastikan tiap sambungan rantai tidak bocor.",
        "Tiga uji kebocoran untuk setiap model satelit. Pertama, uji arah dan besaran: apakah tanda koefisiennya masuk akal? Pengangguran naik → NPL naik (positif) — jika regresi menghasilkan tanda negatif, datanya atau spesifikasinya salah, bukan \"temuan menarik\". Besaran: kenaikan pengangguran 1 poin menaikkan NPL 0,8 poin — bandingkan dengan literatur dan pengalaman krisis 2020 (saat pengangguran naik ~2 poin, NPL KTA naik ~1,5 poin — konsisten). Kedua, uji backtest: jalankan model satelit \"seolah\" tahun 2019 dengan data sampai 2019, prediksi NPL 2020, bandingkan dengan aktual. Selisih >30% = model tidak layak untuk stres — ia bahkan tidak bisa menjelaskan masa lalu yang sudah terjadi. Ketiga, uji konsistensi antar segmen: jika satelit KTA bilang NPL naik 3 poin tetapi satelit KPR (yang lebih sensitif ke pengangguran) bilang naik 1 poin, salah satunya salah — peta yang tidak konsisten antar wilayahnya adalah peta yang salah.",
        "Mode kegagalan yang paling mahal: satelit yang \"disewa\" dari konsultan tanpa transfer pemahaman. Bank membayar mahal untuk model satelit, menjalankannya tiap tahun sebagai black box — tidak ada yang di bank memahami mengapa pengangguran 12% menghasilkan PD 6,2% dan bukan 4% atau 9%. Saat OJK bertanya dalam review ICAAP, tim hanya bisa menjawab \"menurut model konsultan\". Itu bukan jawaban — itu pengakuan bahwa bank tidak menguasai rantai transmisinya sendiri. Aturan keputusan: setiap parameter stres yang masuk ke perhitungan KPMM wajib punya \"kartu identitas\" satu halaman — nama model, data latih (periode + cakupan), koefisien kunci dengan interpretasi bisnis, hasil backtest terakhir, nama pemilik di internal bank. Tidak ada kartu identitas = tidak boleh dipakai untuk keputusan modal. Dan satu prinsip pamungkas: model satelit yang sederhana tetapi dipahami (regresi linear yang di-backtest) mengalahkan model canggih yang misterius (machine learning tanpa interpretasi) untuk stress testing regulatori — karena di depan OJK, \"saya paham dan bisa menjelaskan\" mengalahkan \"modelnya lebih akurat 2%\". Rantai transmisi yang bocor di satu sambungan membuat seluruh stress test — seberapa pun tebal laporannya — menjadi teater.",
      ],
      tasks: [],
      reference: "Tiap sambungan rantai wajib punya jejak: model + backtest + pemilik. Black box = teater.",
    },
    {
      id: "reverse-kerja",
      eyebrow: "Langkah 11 · Reverse working",
      title: "Dari titik mati ke peta jalan",
      prose: [
        "Langkah reverse menyebut konsepnya sekilas — mulai dari kematian, cari skenarionya. Mari kerjakan dengan angka sampai tuntas, karena di sinilah reverse stress test berubah dari slogan menjadi alat. Bank Nusantara: modal Rp 5.200 miliar, RWA Rp 40.000 miliar, KPMM 13%, NPL awal 2,5%. Pertanyaan reverse: NPL berapa yang membuat KPMM jebol ke 8% (batas minimum)? Pakai mesin yang sama dengan lab langkah 5: CKPN tambahan = (NPL − 2,5%) × 50.000 × 60%; RWA naik 3x kenaikan NPL. Coba NPL 13%: CKPN = 10,5% × 50.000 × 60% = Rp 3.150 miliar → modal = 5.200 − 3.150 = Rp 2.050 miliar; RWA = 40.000 × (1 + 10,5% × 3) = Rp 52.600 miliar → KPMM = 2.050/52.600 = 3,9% — sudah jauh di bawah 8%. Coba NPL 10%: CKPN = 7,5% × 50.000 × 60% = Rp 2.250 miliar → modal Rp 2.950 miliar; RWA = 40.000 × 1,225 = Rp 49.000 miliar → KPMM = 6,02% (persis lab langkah 5!). Masih di bawah 8%. Coba NPL 8%: CKPN = 5,5% × 50.000 × 60% = Rp 1.650 miliar → modal Rp 3.550 miliar; RWA = 40.000 × 1,165 = Rp 46.600 miliar → KPMM = 7,6%. Coba NPL 7,5%: CKPN Rp 1.500 miliar → modal Rp 3.700 miliar; RWA Rp 46.000 miliar → KPMM = 8,04%. Titik matinya: NPL ≈ 7,6%.",
        "Sekarang pertanyaan kedua — yang lebih penting: skenario apa yang membuat NPL 7,6%? NPL 2,5% → 7,6% berarti tambahan Rp 2,55 triliun kredit macet (5,1% × Rp 50 triliun). Dari data historis bank: setiap kenaikan pengangguran 1 poin menaikkan NPL ~0,8 poin; setiap penurunan harga properti 10% menaikkan LGD dan NPL segmen KPR ~0,5 poin. Kombinasi yang menghasilkan +5,1 poin NPL: pengangguran 6% → 11% (+5 poin → +4 poin NPL) PLUS harga properti −25% (+1,25 poin NPL) — total ≈ +5,25 poin. Skenario \"kematian\": resesi dalam dengan pengangguran 11% dan properti −25% bersamaan. Apakah plausible? 1998: pengangguran melonjak di atas 10%, properti jatuh >40% — ya, pernah terjadi di Indonesia. Maka inilah peta jalannya: (1) risk appetite statement ditulis ulang — \"Bank tidak mengambil eksposur yang membuat NPL menembus 7% dalam skenario pengangguran 11% + properti −25%\"; (2) limit sektor properti diturunkan sampai uji itu lolos; (3) contingency plan: jika pengangguran menyentuh 9% (tanda awal menuju 11%), aktifkan mode hemat modal — persis seperti alarm kebakaran yang bunyi SEBELUM api sampai.",
        "Bandingkan dengan stress test normal (forward): forward menjawab \"skenario X → KPMM Y\" — berguna untuk meyakinkan OJK bahwa bank selamat. Reverse menjawab \"KPMM 8% → skenario Z\" — berguna untuk meyakinkan DIREKSI tentang apa yang harus dihindari. Keduanya dibutuhkan karena audiensnya beda: regulator ingin bukti ketahanan, direksi butuh peta bahaya. Cara salah yang umum: melakukan reverse sekali, menemukan titik mati, lalu menyimpannya di laci (\"sudah dikerjakan tahun lalu\"). Titik mati BERGERAK: setiap kredit baru menggesernya; setiap perubahan modal menggesernya. Bank yang agresif ekspansi properti 20% tahun ini mungkin menggeser titik matinya dari NPL 7,6% ke 6,8% — tanpa ada yang sadar, karena tidak dihitung ulang. Aturan keputusan: hitung ulang titik mati (NPL jebol 8%) setiap kuartal, tampilkan trennya di dashboard komite risiko. Titik mati yang MENDEKAT (7,6% → 7,0% → 6,8%) adalah sinyal bahwa pertumbuhan sedang memakan buffer ketahanan — bank tumbuh semakin rapuh. Itu adalah kalimat yang harus membuat direksi tidak nyaman — dan ketidaknyamanan itulah gunanya reverse stress test.",
      ],
      tasks: [],
      reference: "Titik mati bergerak — hitung ulang tiap kuartal. Yang mendekat = pertumbuhan memakan ketahanan.",
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
        "Skenario: severe but plausible — parah tapi masuk akal.",
        "Rantai: makro → satelit → ECL/CKPN (modal turun) + RWA naik → KPMM jatuh.",
        "Matriks historis harus di-stress (dimiringkan) untuk skenario buruk.",
        "Reverse stress test: dari dampak fatal → cari skenario penyebab → tetapkan appetite.",
        "Jepitan dua sisi: hitung modal DAN RWA — satu sisi = optimis 1+ poin.",
      ],
      next: { label: "CR17A — Kredit Korporasi 1", href: "/v2/learn/cr17a-corporate-credit-1" },
      quiz: [
        {
          q: "Syarat skenario stress test yang baik?",
          options: [
            { text: "Seringan mungkin agar hasil bagus", why: "Terlalu ringan = tidak menguji apa-apa." },
            { text: "Severe but plausible — lebih buruk dari krisis historis tetapi masih bisa dibayangkan; membuat direksi tidak nyaman tetapi mau bertindak", why: "Terlalu ringan = tidak menguji; terlalu fiksi = tidak ada yang bertindak.", correct: true },
            { text: "Se-ekstrem mungkin (meteor jatuh)", why: "Terlalu fiksi = tidak ada yang bertindak." },
            { text: "Sama dengan baseline", why: "Itu bukan stress test." },
          ],
        },
        {
          q: "Rantai transmisi stress test yang benar?",
          options: [
            { text: "Skenario → langsung KPMM", why: "Melompati langkah = angka tidak bisa dipertahankan." },
            { text: "Skenario makro → satelit (PD/LGD naik) → ECL/CKPN naik (modal turun) + RWA naik (migrasi) → KPMM jatuh", why: "Rantai lengkap. Auditor akan bertanya 'PD naiknya dari mana?'.", correct: true },
            { text: "Skenario → naikkan suku bunga → selesai", why: "Terlalu sempit — stres bekerja di banyak jalur." },
            { text: "Tidak ada rantai baku", why: "Rantai ini adalah baku praktiknya." },
          ],
        },
        {
          q: "Apa itu reverse stress test?",
          options: [
            { text: "Stress test yang dibatalkan", why: "Bukan." },
            { text: "Mulai dari dampak fatal (KPMM jebol) → cari skenario penyebabnya → tetapkan risk appetite & pencegahan", why: "Dibalik. Berguna menetapkan batas dan menemukan titik buta.", correct: true },
            { text: "Stress test untuk tahun lalu", why: "Itu backtest." },
            { text: "Stress test yang hasilnya bagus", why: "Bukan soal hasil." },
          ],
        },
        {
          q: "Stress test menghitung CKPN tambahan Rp 2 T tetapi RWA dianggap tetap. Apa yang terlewat?",
          options: [
            { text: "Tidak ada — RWA memang tetap", why: "Downgrade menaikkan RWA." },
            { text: "Jepitan dua sisi: downgrade menaikkan RWA juga — contoh: KPMM 14,3% → 10% (bukan 11,4% jika RWA tetap)", why: "Menghitung satu sisi = optimis 1+ poin KPMM — selisih 'nyaman' vs 'OJK menelepon'.", correct: true },
            { text: "RWA selalu turun saat stres", why: "Terbalik — RWA naik." },
            { text: "CKPN tidak memengaruhi modal", why: "CKPN menurunkan modal via laba." },
          ],
        },
        {
          q: "Direksi minta skenario 'diringankan' agar hasil bagus. Responsmu?",
          options: [
            { text: "Ikuti saja — mereka atasan", why: "Integritas analis dipertaruhkan." },
            { text: "Tolak dengan argumen: preseden historis, tujuan uji ketahanan (bukan ramalan), dan hasil 8,7% justru bukti ketahanan; skenario ringan = rasa aman palsu + ditolak OJK", why: "Stress test yang 'nyaman' gagal pada tujuannya — dan analis yang menandatanganinya ikut bertanggung jawab.", correct: true },
            { text: "Buat dua versi: asli dan palsu", why: "Dua versi = integritas ganda." },
            { text: "Berhenti kerja", why: "Terlalu drastis sebelum berargumen." },
          ],
        },
      ],
    },
  ],
};
