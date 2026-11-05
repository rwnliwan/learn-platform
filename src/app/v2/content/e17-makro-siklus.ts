import type { V2Lesson } from "../lib/types";

export const e17: V2Lesson = {
  slug: "e17-makro-siklus",
  track: "Financial Markets",
  module: "Teori Pasar",
  title: "E17. Siklus Bisnis & Sinyal Resesi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-inversi",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Sinyal yang selalu benar? Inversi 2022",
      prose: [
        "Sejak 1976, setiap kali yield curve AS terinversi (bunga jangka pendek > jangka panjang), resesi selalu menyusul dalam 6–24 bulan. Delapan dari delapan. Rekor sempurna. Tahun 2022 kurva terinversi lagi — para ekonom menyiapkan liang resesi 2023… yang tidak datang-datang. Apakah rekor sempurna itu rusak? Atau sinyalnya hanya tertunda?",
        "Logika ekonominya: bank sentral menaikkan bunga pendek melawan inflasi → yield 2Y naik. Pasar yakin pengetatan mengerem ekonomi → bank sentral terpaksa memangkas bunga di masa depan → yield 10Y tetap rendah. Hasil: 2Y > 10Y = pasar bertaruh pada perlambatan. Hitung spread 10Y−2Y dari yield 2 tahun 4,8% dan 10 tahun 4,2%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `spread_bps` (10Y − 2Y, dalam basis poin)" },
        { id: "t2", text: "Tentukan `klasifikasi` (\"inverted\" jika spread < 0)" },
      ],
      expected: "spread_bps=-60  klasifikasi=inverted",
      note: {
        title: "Sering salah",
        body: "Mengubah probabilitas menjadi kepastian: “inversi = resesi pasti, jual semua!” Inversi menaikkan P(resesi) — bukan P=100%. Respons profesional = penyesuaian bertahap, bukan all-out timing.",
      },
      hints: [
        "spread = 4,2% − 4,8% = −0,6%.",
        "1% = 100 bps. Kalikan dengan 100.",
        "klasifikasi = \"inverted\" if spread_bps < 0 else \"normal\"",
      ],
      code: {
        starter: `y2, y10 = 4.8, 4.2  # %, yield US Treasury\n\n# TULIS KODEMU: spread 10Y-2Y (bps) dan klasifikasinya\nspread_bps = \nklasifikasi = \n\nprint(f"spread_bps={spread_bps:.0f}  klasifikasi={klasifikasi}")`,
        lockLines: 1,
        solution: `y2, y10 = 4.8, 4.2  # %, yield US Treasury\n\n# TULIS KODEMU: spread 10Y-2Y (bps) dan klasifikasinya\nspread_bps = (y10 - y2) * 100\nklasifikasi = "inverted" if spread_bps < 0 else "normal"\n\nprint(f"spread_bps={spread_bps:.0f}  klasifikasi={klasifikasi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "spread_bps", value: -60, tol: 1e-9, label: "`spread_bps` = −60", msg: "4,2 − 4,8 = −0,6% = −60 bps. Negatif = inversi." },
          { kind: "stdout_matches", task: "t2", pattern: "klasifikasi=inverted", label: "Klasifikasi = inverted", msg: "Inversi = sirene probabilitas (6–24 bulan), bukan vonis." },
        ],
      },
      reference: "Inversi = alarm kebakaran: berbunyi sebelum api terlihat, tapi kadang false alarm.",
    },
    {
      id: "siklus",
      eyebrow: "Langkah 2 · Siklus bisnis & kredit",
      title: "Empat musim ekonomi — dan pesta utang Minsky",
      prose: [
        "Siklus bisnis: ekspansi awal (pemulihan: bunga rendah, saham siklikal memimpin) → ekspansi lanjut (panas: inflasi naik, bank sentral mengetatkan) → puncak/kontraksi (resesi teknis: defensif + obligasi bertahan) → lembah (pesimisme maksimal, valuasi murah — titik entry terbaik bagi yang berani). Pasar mendahului ekonomi 6–12 bulan.",
        "Siklus kredit (Minsky: “stabilitas melahirkan ketidakstabilan”): pemulihan (bank hati-hati) → ekspansi (standar melonggar, spread menyempit) → puncak euforia (“kali ini beda”, leverage gila) → krisis (Minsky moment: gagal bayar naik → credit crunch → resesi). Risiko kredit SEBENARNYA tertinggi saat ekspansi/euforia — ketika semua merasa aman.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pasar merasa paling aman tepat sebelum paling berbahaya. Ukur risiko dari fundamental (leverage, standar kredit), bukan dari harga risiko (spread tipis). Spread super tipis di tengah euforia = bahaya, bukan berkah.",
      },
      reference: "Siklus = manajemen probabilitas, bukan ramalan. Beli saat menakutkan, waspada saat euforia.",
    },
    {
      id: "indikator",
      eyebrow: "Langkah 3 · Indikator & dashboard",
      title: "Dasbor pilot ekonomi: gabungkan 4 sinyal",
      prose: [
        "Tiga golongan indikator: leading (mendahului: spread 10Y−2Y, PMI, klaim pengangguran awal — untuk prakiraan, tapi noisy), coincident (bersamaan: PDB, penjualan ritel — konfirmasi posisi kini), lagging (tertinggal: pengangguran, inflasi inti — hanya konfirmasi, jangan pakai untuk prediksi!).",
        "PMI > 50 = ekspansi, < 50 = kontraksi — nowcasting tercepat karena rilis awal bulan. Gabungkan 4 indikator jadi satu skor bahaya resesi (maks 6): spread negatif +2, PMI < 50 +2, inflasi > 4% +1, pengangguran > 5,5% +1.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` bahaya resesi (0–6)" },
        { id: "t2", text: "Tentukan `status` (\"siaga\" jika skor ≥ 4)" },
      ],
      expected: "skor=6  status=siaga",
      note: {
        title: "Sering salah",
        body: "Memakai indikator lagging (pengangguran, inflasi inti) untuk prediksi. Lagging mengonfirmasi setelah fakta — untuk prakiraan pakai leading (spread, PMI).",
      },
      hints: [
        "Cek tiap indikator terhadap ambangnya, tambahkan bobotnya.",
        "Spread −0,8 < 0 → +2. PMI 47,5 < 50 → +2. Inflasi 6,2 > 4 → +1. Pengangguran 5,8 > 5,5 → +1.",
        "status = \"siaga\" if skor >= 4 else (\"waspada\" if skor >= 2 else \"ekspansi\")",
      ],
      code: {
        starter: `spread = -0.8   # 10Y-2Y, pp\npmi = 47.5\ninflasi = 6.2     # % yoy\npengangguran = 5.8  # %\n\n# TULIS KODEMU: skor bahaya resesi dan statusnya\nskor = 0\n\nstatus = \n\nprint(f"skor={skor}  status={status}")`,
        lockLines: 6,
        solution: `spread = -0.8   # 10Y-2Y, pp\npmi = 47.5\ninflasi = 6.2     # % yoy\npengangguran = 5.8  # %\n\n# TULIS KODEMU: skor bahaya resesi dan statusnya\nskor = 0\nif spread < 0:\n    skor += 2\nif pmi < 50:\n    skor += 2\nif inflasi > 4:\n    skor += 1\nif pengangguran > 5.5:\n    skor += 1\n\nstatus = "siaga" if skor >= 4 else ("waspada" if skor >= 2 else "ekspansi")\n\nprint(f"skor={skor}  status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "skor", value: 6, tol: 0, label: "`skor` = 6", msg: "2+2+1+1 = 6/6 — keempat sinyal menyala." },
          { kind: "stdout_matches", task: "t2", pattern: "status=siaga", label: "Status = siaga", msg: "Skor 4+ = siaga resesi. Indikator = kaca spion + prakiraan cuaca, BUKAN ramalan pasti." },
        ],
      },
      reference: "Leading untuk prakiraan; lagging hanya konfirmasi. Respons = penyesuaian bertahap.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang inversi dan indikator.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Spread 10Y−2Y = −0,8pp. Artinya…",
          options: [
            { text: "Ekonomi sehat", why: "Salah: itu ciri kurva normal (spread positif)." },
            { text: "Kurva terinversi — pasar bertaruh suku bunga akan turun (risiko resesi naik)", why: "Benar: sirene resesi (lead 6–24 bulan), bukan vonis.", correct: true },
            { text: "Inflasi nol", why: "Salah: inversi soal ekspektasi bunga, bukan inflasi nol." },
            { text: "Waktunya all-in saham", why: "Salah: respons tepat = kurangi risiko bertahap, bukan all-in." },
          ],
        },
        {
          q: "PMI = 47 selama 4 bulan berturut-turut. Artinya…",
          options: [
            { text: "Ekspansi kuat", why: "Salah: ekspansi = PMI > 50." },
            { text: "Kontraksi manufaktur (di bawah 50) — sinyal leading pelemahan", why: "Benar: 4 bulan tren = pola, bukan noise. Leading indicator untuk nowcasting.", correct: true },
            { text: "Tidak ada artinya", why: "Salah: PMI = nowcasting tercepat." },
            { text: "Inflasi pasti turun", why: "Salah: PMI soal aktivitas manufaktur, bukan ramalan inflasi." },
          ],
        },
      ],
    },
    {
      id: "minicase-2022",
      eyebrow: "Langkah 5 · Mini-case",
      title: "2022: inversi tanpa resesi?",
      prose: [
        "Akhir 2022: kurva AS terinversi dalam (−1pp). Konsensus: resesi 2023 “pasti”. Kamu mengurangi saham 50% ke kas. Hasil: 2023 saham AS naik 24%, resesi tak kunjung tiba hingga 2024. Kamu kehilangan reli + membayar opportunity cost besar.",
        "Pertanyaan: (a) Di mana kesalahan logikanya? (b) Respons berbasis probabilitas yang benar saat itu? (c) Pelajaran tentang “rekor sempurna” indikator?",
        "Pembahasan: (a) Mengubah probabilitas menjadi kepastian + all-out timing. Inversi menaikkan P(resesi) — bukan P=100%. Konteks unik (pasar kerja super ketat, tabungan pandemi, fiskal longgar) menunda resesi. Satu sinyal ≠ seluruh gambaran. (b) Penyesuaian bertahap: turunkan beta 20–30% (bukan 50%+), tambah durasi obligasi pendek dan kas, tulis rencana beli jika koreksi datang. Lindungi tanpa mematikan upside. (c) Rekor historis ≠ hukum fisika. Hormati sinyal sebagai update probabilitas (Bayesian), bukan ramalan dukun.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Setiap “pola sempurna” lahir dari sampel terbatas dengan konteks tertentu. All-in/all-out berdasarkan satu indikator = market timing yang datanya gagal total.",
      },
      reference: "Inversi = naikkan kewaspadaan, bukan jual semua. Siapkan likuiditas, rebalance.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Posisi per fase siklus: empat skenario",
      prose: [
        "Ekspansi awal (PMI > 50 baru, kurva menormal) → ambil risiko: siklikal, saham, durasi panjang — return terbaik historis di fase ini. Ekspansi lanjut (inflasi panas, BI hawkish) → kurangi durasi, tambah kualitas: waspadai kualitas kredit memburuk (paradoks Minsky).",
        "Inversi kurva/sinyal resesi → defensif bertahap, bukan panik: turunkan beta, tambah kas/SBN pendek, siapkan “peluru” untuk lembah. Lembah/krisis (berita mengerikan) → beli bertahap yang berkualitas: return ekspektasi tertinggi justru di sini; dollar-cost averaging mengalahkan usaha timing dasar sempurna.",
        "Aturan 10 detik: inversi = alarm, bukan vonis. Kurangi risiko bertahap; jangan all-out. Pasar mendahului ekonomi 6–12 bulan.",
      ],
      tasks: [],
      reference: "Posisi siklikal = penyesuaian bertahap, bukan saklar on/off.",
    },
    {
      id: "makro-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: kurva & indikator",
      title: "Kurva terbalik dan indikator yang bicara duluan",
      prose: [
        "Inversi kurva imbal hasil — yield 10 tahun di BAWAH yield 2 tahun — adalah alarm resesi paling terkenal di keuangan. Logikanya: investor memborong obligasi panjang (mendorong yield-nya turun) karena yakin suku bunga akan dipangkas — yang biasanya terjadi saat ekonomi melemah. Rekam jejak AS: inversi mendahului hampir setiap resesi 50 tahun terakhir, dengan jeda 6–18 bulan. Di Indonesia, pantau spread SUN 10Y vs 2Y dengan logika yang sama.",
        "Tetapi alarm bukan vonis: ada false positive (1998, 2019 AS — inversi tanpa resesi; 2022 inversi dalam tetapi resesi tidak kunjung datang). Kurva adalah agregat taruhan pasar — bisa salah, dan kadang ia memprediksi “resesi” yang berhasil dicegah justru karena semua orang waspada (prediksi yang menggagalkan dirinya sendiri).",
        "Dasbor leading indicator Indonesia versi 5 menit: (1) PMI manufaktur — di bawah 50 = kontraksi; (2) Indeks Keyakinan Konsumen (IKK) — di bawah 100 = pesimis; (3) penjualan semen & motor — denyut sektor riil; (4) cadangan devisa — amunisi BI; (5) spread SUN 10Y–2Y. Tidak ada satu indikator yang cukup — pakai konsensus tiga dari lima.",
        "Aturan praktis: (1) inversi + 2 indikator melemah = mode defensif bertahap (bukan panik jual semua); (2) indikator = untuk alokasi, bukan timing harian — lagnya bulanan; (3) catat keputusanmu: “mengurangi saham 10% karena 3 indikator merah” — akuntabilitas mengalahkan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `spread` (10Y − 2Y, 1 desimal)" },
        { id: "t2", text: "Hitung `inversi` (berapa periode spread negatif)" },
      ],
      expected: "spread=[0.7, 0.5, -0.1, -0.5]  inversi=2",
      hints: [
        "spread = [round(a − b, 1) for a, b in zip(y10, y2)].",
        "inversi = jumlah s < 0 di spread.",
      ],
      code: {
        starter: `y10 = [6.8, 6.9, 6.5, 6.2]   # yield SUN 10Y, %\ny2 = [6.1, 6.4, 6.6, 6.7]    # yield SUN 2Y, %\n\n# TULIS KODEMU\nspread = \ninversi = \n\nprint(f"spread={spread}  inversi={inversi}")`,
        lockLines: 2,
        solution: `y10 = [6.8, 6.9, 6.5, 6.2]   # yield SUN 10Y, %\ny2 = [6.1, 6.4, 6.6, 6.7]    # yield SUN 2Y, %\n\n# TULIS KODEMU\nspread = [round(a - b, 1) for a, b in zip(y10, y2)]\ninversi = sum(1 for s in spread if s < 0)\n\nprint(f"spread={spread}  inversi={inversi}")`,
        checks: [
          { kind: "equal", task: "t1", name: "spread", value: [0.7, 0.5, -0.1, -0.5], tol: 1e-9, label: "`spread` = [0.7, 0.5, -0.1, -0.5]", msg: "6,8−6,1=0,7; 6,9−6,4=0,5; 6,5−6,6=−0,1; 6,2−6,7=−0,5." },
          { kind: "equal", task: "t2", name: "inversi", value: 2, tol: 1e-9, label: "`inversi` = 2", msg: "Dua periode terakhir spread negatif — kurva terbalik." },
          { kind: "stdout_matches", task: "t2", pattern: "spread=\\[0\\.7, 0\\.5, -0\\.1, -0\\.5\\]\\s+inversi=2", label: "`print` menampilkan spread & inversi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: kurva = ramalan kolektif yang bisa salah",
        body: "Kurva imbal hasil bukan ramalan dewa — ia agregat dari jutaan taruhan berduit, dan taruhan berduit pun bisa salah bareng-bareng. Empat heuristik. Pertama: inversi = pasar bertaruh suku bunga akan turun — taruhan itu biasanya benar soal arah, sering salah soal timing (jeda 6–18 bulan); jangan trading harian dari sinyal bulanan. Kedua: satu indikator = gosip, tiga indikator = sinyal — PMI, IKK, dan penjualan semen yang kompak melemah jauh lebih bisa dipercaya dari satu spread kurva; konsensus mengalahkan bintang tunggal. Ketiga: indikator untuk alokasi, bukan prediksi — “kurangi saham 10%” adalah keputusan yang bisa dieksekusi; “resesi tahun depan” adalah ramalan yang tidak bisa ditagih; bedakan keduanya. Keempat: catat dan audit dirimu — tulis “mengurangi 10% karena 3 indikator merah, tanggal X”; tanpa catatan, kamu akan mengingat yang benar dan melupakan yang salah (hindsight bias menanti). Aturan 10 detiknya: luangkan 5 menit tiap awal bulan — PMI, IKK, semen, cadangan devisa, spread SUN; tiga merah = sabuk pengaman dikencangkan.",
      },
      reference: "Inversi = alarm, bukan vonis. 3 dari 5 indikator = sinyal. Untuk alokasi, bukan timing.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Inversi kurva (10Y−2Y < 0) = pasar bertaruh resesi; sirene probabilitas (6–24 bulan), bukan vonis.",
        "Siklus bisnis: ekspansi awal → lanjut → puncak/kontraksi → lembah. Pasar mendahului 6–12 bulan.",
        "Siklus kredit (Minsky): stabilitas → euforia → krisis. Risiko tertinggi saat semua merasa aman.",
        "Indikator: leading (spread, PMI) untuk prakiraan; lagging (pengangguran) hanya konfirmasi.",
        "Respons = penyesuaian bertahap, bukan all-in/all-out. Hormati sinyal sebagai update probabilitas.",
      ],
      next: { label: "E18 — Laporan Keuangan", href: "/learn/e18-laporan-keuangan" },
      quiz: [
        {
          q: "Respons tepat saat kurva terinversi?",
          options: [
            { text: "Jual semua saham hari ini juga", why: "Salah: all-out timing berdasarkan satu sinyal = datanya gagal total." },
            { text: "Abaikan total", why: "Salah: inversi = sinyal yang layak dihormati sebagai update probabilitas." },
            { text: "Kurangi risiko BERTAHAP (turunkan beta, tambah kualitas/kas) — pasar bisa naik dulu berbulan-bulan", why: "Benar: probabilitas, bukan kepastian. Puncak pasar sering terjadi SETELAH inversi.", correct: true },
            { text: "Beli saham gorengan", why: "Salah: kebalikan dari respons defensif yang benar." },
          ],
        },
        {
          q: "Paradoks Minsky: kapan risiko kredit SEBENARNYA tertinggi?",
          options: [
            { text: "Saat krisis (spread lebar)", why: "Salah: saat krisis risiko sudah TERHARGA — spread lebar = kompensasi besar." },
            { text: "Saat ekspansi/euforia — spread tipis tapi standar kredit longgar & leverage menumpuk", why: "Benar: pasar merasa paling aman tepat sebelum paling berbahaya.", correct: true },
            { text: "Tidak pernah", why: "Salah: risiko kredit selalu ada dan berayun." },
            { text: "Saat resesi berakhir", why: "Salah: itu justru saat peluang terbaik (spread lebar, harga murah)." },
          ],
        },
        {
          q: "Return saham historis TERBAIK terjadi di fase…",
          options: [
            { text: "Puncak euforia", why: "Salah: membeli saat “aman” (puncak) = membeli mahal." },
            { text: "Ekspansi awal — saat berita masih suram (pasar mendahului ekonomi)", why: "Benar: pasar mendahului ekonomi 6–12 bulan.", correct: true },
            { text: "Kontraksi terdalam", why: "Salah: kontraksi terdalam = masih jatuh; ekspansi awal = titik baliknya." },
            { text: "Tidak ada pola", why: "Salah: polanya konsisten — return terbaik saat pesimisme memudar." },
          ],
        },
        {
          q: "Tingkat pengangguran termasuk indikator…",
          options: [
            { text: "Leading", why: "Salah: pengangguran naik SETELAH ekonomi melemah." },
            { text: "Lagging — mengonfirmasi setelah fakta; jangan pakai untuk prediksi", why: "Benar: untuk prediksi pakai leading (spread, PMI).", correct: true },
            { text: "Coincident", why: "Salah: coincident = PDB, penjualan ritel, produksi industri." },
            { text: "Tidak termasuk indikator", why: "Salah: ia indikator lagging yang valid." },
          ],
        },
      ],
    },
  ],
};
