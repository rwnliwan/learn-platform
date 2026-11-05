import type { V2Lesson } from "../lib/types";

export const cr18: V2Lesson = {
  slug: "cr18-industry-country-risk",
  track: "Credit Risk",
  module: "Kredit Korporasi",
  title: "CR18 — Risiko Industri & Negara",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Ikan sehat di kolam beracun",
      prose: [
        "Analis junior membela debitur tekstil: \"Rasionya bagus!\" Kepala risikonya menjawab dingin: \"Ikan paling sehat pun mati kalau kolamnya beracun.\"",
        "Analisis perusahaan (CR17) hanya separuh cerita. Separuh lainnya: industri dan negara tempat perusahaan berenang. Lesson ini tentang \"kolamnya\" — dan cara mengukurnya sebelum menceburkan uang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Saat menilai debitur, tanyakan tiga lapis: (1) perusahaannya sehat? (CR17), (2) industrinya sehat? (lesson ini), (3) negaranya stabil? (di bawah). Kelemahan di lapis mana pun menular ke atas. Perusahaan hebat + industri sekarat = tetap berisiko.",
      },
      reference: "Industry risk seperti cuaca di kolam — nelayan terbaik pun tidak bisa memancing saat badai.",
    },
    {
      id: "industri",
      eyebrow: "Langkah 2 · Industri",
      title: "Lima faktor penilaian",
      prose: [
        "Industry risk = risiko yang melekat pada sektor usaha, terlepas dari kualitas perusahaan individual. Lima faktor: siklus & volatilitas (komoditas liar; kesehatan stabil); kompetisi & hambatan masuk (tekstil mudah; pelabuhan sulit); regulasi & kebijakan (tambang: royalti & larangan ekspor; fintech: POJK ketat); tren permintaan (EV tumbuh; batubara PLTU menurun struktural); ESG & transisi (terancam transisi energi/iklim?).",
        "Tekstil (default rate 8,5%) vs teknologi (1,2%) — beda 7× lipat! Artinya: debitur tekstil \"terbaik\" bisa lebih berisiko dari debitur teknologi \"biasa\". Implikasi pricing: bunga harus mencerminkan risiko industri, bukan cuma rasio perusahaan (CR21).",
        "Debitur tekstil terbaik (DSCR 2,0) vs debitur teknologi biasa (DSCR 1,5): yang berisiko lebih tinggi = tekstil — default rate industrinya 7× lipat; \"kolam beracun\" mengalahkan \"ikan sehat\".",
      ],
      tasks: [],
      reference: "Penilaian industri: siklus, kompetisi, regulasi, tren permintaan, ESG.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 3 · Lab Skor",
      title: "Dari lima faktor ke satu vonis",
      prose: [
        "Nilai tiap faktor 1 (buruk)–5 (bagus), lalu bobot. Data industri batubara terkunci: siklus 2 (25%), kompetisi 2 (20%), regulasi 3 (20%), tren permintaan 2 (20%), ESG 1 (15%). Tugasmu: hitung skor total dan vonis (<2,5 = BERISIKO TINGGI; <3,5 = SEDANG; else RENDAH).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total_skor`" },
        { id: "t2", text: "Tentukan `vonis` sesuai ambang" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "skor=2.05 vonis=BERISIKO TINGGI",
      hints: [
        "total_skor = jumlah skor × bobot.",
        "2×0,25 + 2×0,20 + 3×0,20 + 2×0,20 + 1×0,15.",
        "vonis = 'BERISIKO TINGGI - batasi eksposur' jika total < 2,5.",
      ],
      code: {
        starter: `faktor = {\n    "Siklus & volatilitas harga": {"skor": 2, "bobot": 0.25},\n    "Kompetisi & hambatan masuk": {"skor": 2, "bobot": 0.20},\n    "Regulasi & kebijakan":       {"skor": 3, "bobot": 0.20},\n    "Tren permintaan":            {"skor": 2, "bobot": 0.20},\n    "ESG / transisi energi":      {"skor": 1, "bobot": 0.15},\n}\n\n# TULIS KODEMU\ntotal_skor = \nvonis = \n\nprint(f"skor={total_skor:.2f} vonis={vonis}")`,
        lockLines: 7,
        solution: `faktor = {\n    "Siklus & volatilitas harga": {"skor": 2, "bobot": 0.25},\n    "Kompetisi & hambatan masuk": {"skor": 2, "bobot": 0.20},\n    "Regulasi & kebijakan":       {"skor": 3, "bobot": 0.20},\n    "Tren permintaan":            {"skor": 2, "bobot": 0.20},\n    "ESG / transisi energi":      {"skor": 1, "bobot": 0.15},\n}\n\n# TULIS KODEMU\ntotal_skor = sum(f["skor"] * f["bobot"] for f in faktor.values())\nvonis = "BERISIKO TINGGI - batasi eksposur" if total_skor < 2.5 else ("SEDANG - selektif" if total_skor < 3.5 else "RENDAH - boleh ekspansi")\n\nprint(f"skor={total_skor:.2f} vonis={vonis}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_skor", value: 2.05, tol: 1e-9, label: "`total_skor` seharusnya 2.05", msg: "0.50+0.40+0.60+0.40+0.15 = 2.05." },
          { kind: "equal", task: "t2", name: "vonis", value: "BERISIKO TINGGI - batasi eksposur", label: "`vonis` = BERISIKO TINGGI", msg: "2.05 < 2.5 → berisiko tinggi." },
          { kind: "stdout_matches", task: "t3", pattern: "skor=2\\.05\\s+vonis=BERISIKO TINGGI", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ESG skor 1/5 menyeret total — transisi energi adalah risiko kredit.",
    },
    {
      id: "siklus",
      eyebrow: "Langkah 4 · Siklus",
      title: "Roller coaster batubara",
      prose: [
        "Indonesia = ekonomi komoditas. Batubara, sawit, nikel menentukan nasib ribuan debitur. Harga batubara: dari 60 (2020) ke 350 (2022) lalu ke 130 (2025) — naik-turun 5× lipat dalam 5 tahun! Perusahaan tambang dengan BEP 100: tahun 2022 untung besar (bagi dividen jor-joran), tahun 2020 hampir mati.",
        "Pelajaran kredit: (1) uji DSCR pada harga konservatif (bukan harga puncak!); (2) waspadai perilaku boom — dividen besar & ekspansi agresif di puncak = bom waktu; (3) covenant berbasis harga komoditas.",
        "Tambang cash cost US$110/ton mengajukan ekspansi saat harga US$350 (DSCR 10×). Di harga normal US$100 ia rugi kas. Vonis: TOLAK — ini taruhan harga komoditas, bukan kredit investasi; uji DSCR di harga stres, bukan puncak. Operator biaya tinggi hanya hidup saat harga abnormal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Harga komoditas sedang tinggi — saatnya ekspansi kredit tambang.\" Harga puncak = waktu TERBURUK untuk ekspansi agresif (membeli di puncak siklus). Disiplin kredit komoditas: nilai kelayakan pada harga through-the-cycle (rata-rata jangka panjang), bukan harga spot. Bank yang ekspansi di 2022 (harga 350) menanggung default 2024–2025.",
      },
      reference: "Risiko klaster: 80% smelter di 2 kawasan — pemadaman listrik menghentikan semua; korelasi tersembunyi.",
    },
    {
      id: "negara",
      eyebrow: "Langkah 5 · Negara",
      title: "Country risk",
      prose: [
        "Country risk = risiko akibat kondisi negara tempat debitur beroperasi (untuk kredit lintas batas atau debitur terpapar valuta asing). Empat komponen: risiko transfer — pemerintah membatasi aliran devisa keluar (debitur mau bayar, tetapi tidak bisa kirim dolar); risiko konversi — depresiasi tajam mata uang lokal (utang dolar membengkak dalam rupiah); risiko sovereign — pemerintah gagal bayar / krisis politik; risiko makro lokal — resesi, inflasi, suku bunga negara tersebut.",
        "Perusahaan Indonesia berpendapatan rupiah, berutang dolar AS: risiko utamanya = risiko konversi — depresiasi rupiah membengkakkan utang dalam rupiah; butuh hedging atau natural hedge. Tanpa hedge, depresiasi 20% = cicilan naik 20% dalam rupiah — DSCR jebol.",
        "Aturan praktis: rating debitur tidak boleh melampaui rating sovereign negaranya (sovereign ceiling) — kecuali ada mitigasi kuat (pendapatan ekspor dominan, jaminan luar negeri). Sovereign paling berat (30%) — jika negaranya gagal bayar, semua debitur ikut terseret.",
      ],
      tasks: [],
      reference: "Untuk Indonesia: pantau defisit transaksi berjalan, cadangan devisa, stabilitas politik — ketiganya menentukan ceiling semua debitur.",
    },
    {
      id: "lab-lampu",
      eyebrow: "Langkah 6 · Lab Lampu",
      title: "Dashboard 5 lampu",
      prose: [
        "Early warning korporasi: tiap lampu hijau/kuning/merah; 2+ merah = komite darurat. Fungsi `lampu` dan `lampu_list` terkunci (DSCR 1,15; harga/BEP 0,95; konsentrasi pelanggan 55%; rumor 1/bln; keterlambatan laporan 45 hari). Tugasmu: hitung jumlah lampu merah dan putuskan komite darurat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `n_merah` dari `lampu_list`" },
        { id: "t2", text: "Tentukan `komite_darurat` (True jika n_merah ≥ 2)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "merah=4 darurat=True",
      hints: [
        "Status merah = 'MERAH!!' (perhatikan dua tanda seru).",
        "n_merah = sum(1 for nama, st, nilai in lampu_list if st == 'MERAH!!')",
        "komite_darurat = n_merah >= 2",
      ],
      code: {
        starter: `def lampu(nama, nilai, ambang_kuning, ambang_merah, terbalik=False):\n    if not terbalik:\n        st = "HIJAU " if nilai < ambang_kuning else ("KUNING " if nilai < ambang_merah else "MERAH!!")\n    else:\n        st = "HIJAU " if nilai > ambang_kuning else ("KUNING " if nilai > ambang_merah else "MERAH!!")\n    return nama, st, nilai\n\nlampu_list = [\n    lampu("DSCR", 1.15, 1.5, 1.2, terbalik=True),\n    lampu("Harga komoditas vs BEP", 0.95, 1.2, 1.0, terbalik=True),\n    lampu("Konsentrasi pelanggan top-1", 55, 30, 50),\n    lampu("Rumor pasar / berita negatif", 1, 1, 2),\n    lampu("Keterlambatan lapor keuangan", 45, 15, 30),\n]\n\n# TULIS KODEMU\nn_merah = \nkomite_darurat = \n\nprint(f"merah={n_merah} darurat={komite_darurat}")`,
        lockLines: 13,
        solution: `def lampu(nama, nilai, ambang_kuning, ambang_merah, terbalik=False):\n    if not terbalik:\n        st = "HIJAU " if nilai < ambang_kuning else ("KUNING " if nilai < ambang_merah else "MERAH!!")\n    else:\n        st = "HIJAU " if nilai > ambang_kuning else ("KUNING " if nilai > ambang_merah else "MERAH!!")\n    return nama, st, nilai\n\nlampu_list = [\n    lampu("DSCR", 1.15, 1.5, 1.2, terbalik=True),\n    lampu("Harga komoditas vs BEP", 0.95, 1.2, 1.0, terbalik=True),\n    lampu("Konsentrasi pelanggan top-1", 55, 30, 50),\n    lampu("Rumor pasar / berita negatif", 1, 1, 2),\n    lampu("Keterlambatan lapor keuangan", 45, 15, 30),\n]\n\n# TULIS KODEMU\nn_merah = sum(1 for nama, st, nilai in lampu_list if st == "MERAH!!")\nkomite_darurat = n_merah >= 2\n\nprint(f"merah={n_merah} darurat={komite_darurat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_merah", value: 4, label: "`n_merah` seharusnya 4", msg: "Merah: DSCR, harga/BEP, konsentrasi pelanggan, keterlambatan laporan. Rumor masih kuning." },
          { kind: "equal", task: "t2", name: "komite_darurat", value: true, label: "`komite_darurat` seharusnya True", msg: "4 ≥ 2 → komite darurat." },
          { kind: "stdout_matches", task: "t3", pattern: "merah=4\\s+darurat=True", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "2+ merah = komite darurat. EWS yang tidak memicu aksi = dekorasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: menilai kolam sebelum ikannya",
      prose: [
        "Skenario 1 — Debitur komoditas mengajukan kredit investasi. → Uji DSCR pada harga konservatif/TTC, bukan spot. Contoh nyata: tambang BEP US$85 mengajukan ekspansi saat harga US$350 (DSCR 10×) — di harga normal US$100 ia rugi kas. Vonis: TOLAK — ini taruhan harga komoditas, bukan kredit investasi.",
        "Skenario 2 — Perusahaan berpendapatan rupiah, berutang dolar. → Baca dalam dua mata uang: depresiasi 20% = cicilan naik 20% dalam rupiah. Contoh nyata: PT Kabel Nusantara — bunga USD 3,5 jt = Rp 55,3 M di kurs 15.800 → Rp 59,5 M di kurs 17.000; pokok Rp 790 M → Rp 850 M. Wajib hedging atau natural hedge.",
        "Skenario 3 — Menetapkan rating debitur. → Tidak boleh melampaui rating sovereign negaranya (Indonesia: BBB) tanpa mitigasi kuat. Memberi rating A ke perusahaan domestik murni = mengklaim ia lebih aman dari negaranya sendiri — klaim yang jarang benar.",
        "Skenario 4 — Portofolio 15 nama lintas '5 sektor'. → Petakan klaster: kawasan operasi, pelanggan induk, pelabuhan yang sama. Contoh nyata: 13 dari 15 debitur bergantung pada satu smelter induk di dua kawasan — diversifikasi nama, konsentrasi risiko.",
        "Skenario 5 — Proyek berisiko transisi (batubara, tenor 10 tahun). → Tolak tenor panjang atau perpendek + covenant harga + cash sweep. Contoh nyata: DSCR TTC 1,15× (< 1,25× ambang aman) + phase-out 2035 + pajak karbon 2028 = aset berisiko stranded sebelum lunas.",
        "Aturan praktis 10 detik: ikan paling sehat pun mati di kolam beracun — nilai industri (default rate tekstil 8,5% vs teknologi 1,2%) dan negara dulu, rasio perusahaan kemudian; harga harus mencerminkan risiko kolam.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "'Rasionya bagus!' untuk debitur tekstil — padahal default rate industrinya 7× lipat teknologi. Debitur tekstil TERBAIK (DSCR 2,0) bisa lebih berisiko dari debitur teknologi BIASA (DSCR 1,5). Analis junior membela ikannya; kepala risiko menunjuk kolamnya.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Tambang di tengah transisi energi",
      prose: [
        "PT Batu Bara Sejahtera mengajukan kredit investasi Rp 300 M tenor 10 tahun untuk tambang baru. Data: DSCR (harga spot 130) = 2,2×; DSCR (harga TTC 90) = 1,15×; BEP 85 USD/ton; cadangan 15 tahun; manajemen berpengalaman; harga spot 130, tetapi tren 3 tahun menurun (350 → 130); pemerintah: pajak karbon diwacanakan 2028; beberapa negara tujuan ekspor mengumumkan phase-out batubara 2035.",
        "Keputusan: TOLAK tenor 10 tahun; pertimbangkan maksimal 5 tahun dengan mitigasi berat — atau tolak total. (1) DSCR TTC 1,15× — di bawah ambang aman 1,25×; hanya layak di harga spot yang sedang menurun. (2) Risiko transisi: tenor 10 tahun melewati phase-out 2035 + pajak karbon 2028 — aset berisiko stranded sebelum lunas. (3) Siklus: ekspansi di tren turun = membeli di \"puncak yang lewat\".",
        "Jika direksi memaksa ACC: tenor 5 tahun + DSCR covenant pada harga 90 + cash sweep (kelebihan kas saat harga tinggi untuk percepat pelunasan) + pricing +2%. Pelajaran: analisis industri yang jujur kadang berarti menolak uang — dan itulah pekerjaan analis.",
      ],
      tasks: [],
      reference: "ESG bukan kosmetik — ia adalah risiko kredit dengan horizon panjang. Kredit 15 tahun ke PLTU = bertaruh melawan transisi energi.",
    },
    {
      id: "lindung-fx",
      eyebrow: "Langkah 9 · Mitigasi FX",
      title: "Utang dolar, gaji rupiah",
      prose: [
        "Langkah country risk menyebut risiko konversi sekilas: perusahaan berpendapatan rupiah, berutang dolar. Ini layak pendalaman dengan angka karena inilah pembunuh diam-diam debitur Indonesia — tidak terlihat di laporan laba rugi sampai terlambat. Contoh: PT Kabel Nusantara, manufaktur kabel di Bekasi. Pendapatan 100% rupiah: Rp 800 miliar per tahun. Utang: obligasi USD 50 juta, bunga 7%, tenor 5 tahun — diterbitkan saat kurs Rp 15.800/USD karena \"bunga dolar lebih murah dari bunga rupiah 11%\". Beban bunga tahunan = 50 jt × 7% = USD 3,5 juta = Rp 55,3 miliar di kurs awal. EBITDA Rp 140 miliar → interest coverage 2,53x — mepet tetapi lolos. Delapan belas bulan kemudian rupiah melemah ke Rp 17.000/USD (depresiasi 7,6% — biasa saja untuk rupiah). Beban bunga kini = 3,5 jt × 17.000 = Rp 59,5 miliar. Pokok utang dalam rupiah: 50 jt × 15.800 = Rp 790 miliar → 50 jt × 17.000 = Rp 850 miliar — naik Rp 60 miliar tanpa perusahaan meminjam satu dolar pun tambahan. DER: ekuitas Rp 400 miliar → total utang naik Rp 60 miliar → DER naik 0,15x dalam semalam, murni dari kurs.",
        "Cara salah yang paling umum: \"tidak usah hedge, rupiah pasti menguat lagi\" — spekulasi yang menyamar sebagai strategi. Atau sebaliknya: hedge 100% dengan forward 5 tahun yang biayanya 4% per tahun — menghapus seluruh keuntungan bunga murah dolar (7% + 4% = 11% = sama dengan pinjam rupiah, plus biaya transaksi). Cara benar dimulai dari natural hedge test: apakah perusahaan punya pendapatan dolar yang menutup kewajiban dolarnya? PT Kabel Nusantara: ekspor 0% — tidak lolos; butuh financial hedge. Aturan keputusannya tiga lapis. Pertama, hitung \"DSCR dalam dua mata uang\": DSCR-rupiah (semua dalam Rp, kurs saat ini) DAN DSCR-dolar (pendapatan dolar vs kewajiban dolar). Jika DSCR-dolar < 1 tanpa pendapatan dolar, itu bukan kredit — itu taruhan kurs. Kedua, tetapkan hedge ratio policy: untuk debitur tanpa natural hedge, wajib lindung nilai minimum 50% eksposur pokok+bunga 12 bulan ke depan (instrumen: forward untuk kepastian, atau call spread untuk batas biaya). Biaya hedge 2–3% per tahun adalah premi asuransi — bandingkan dengan Rp 60 miliar kenaikan pokok di contoh: premi Rp 790 miliar × 2,5% = Rp 19,75 miliar per tahun terlihat mahal, sampai depresiasi 7,6% menagih Rp 60 miliar sekaligus. Ketiga, covenant berbasis kurs: jika kurs melewati Rp 16.500, debitur wajib menambah hedge ratio ke 75% dalam 30 hari — otomatis, bukan negosiasi.",
        "Mode kegagalan nyata yang sering terlewat: lindung nilai yang kedaluwarsa. Banyak debitur hedge 12 bulan untuk utang 5 tahun — \"nanti diperpanjang\". Saat perpanjangan tiba, kurs sudah bergerak merugikan dan biaya hedge baru melonjak 2x lipat; manajemen menunda \"menunggu kurs membaik\" — dan justru saat itulah lindung nilai paling dibutuhkan. Kasus 2013 (taper tantrum) dan 2020: puluhan korporasi Indonesia dengan utang dolar \"ter-hedge sebagian\" mengalami lonjakan beban yang sama persis dengan yang tidak hedge — karena hedge-nya kedaluwarsa di momen terburuk. Aturan: tenor hedge minimum 70% dari tenor utang untuk debitur tanpa natural hedge; perpanjangan hedge adalah covenant, bukan pilihan. Dan untuk analis: saat membaca laporan keuangan debitur berutang valas, SELALU hitung ulang DER dan coverage dengan kurs stres (+15%, +25%) — angka laporan memakai kurs tanggal neraca, yang bisa jadi hari tenang sebelum badai. Debitur yang \"lolos\" di kurs laporan tetapi jebol di kurs +15% adalah debitur yang hidup dari cuaca, bukan dari kekuatan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Baca debitur valas dalam dua mata uang — laba rupiah bisa menutupi kebangkrutan dolar",
        body: "Laporan keuangan berbahasa rupiah; kewajiban berbahasa dolar. Analis yang hanya membaca satu bahasa akan tertipu oleh penerjemahan. Heuristiknya: untuk setiap debitur dengan utang valas >20% total utang, buat dua neraca mini di kepalamu — satu dalam rupiah (seperti laporan), satu dalam dolar (pendapatan dolar vs kewajiban dolar). Jika neraca dolarnya defisit dan tidak ada hedge, perusahaan itu sedang berspekulasi kurs — apapun kata direkturnya tentang \"strategi pendanaan\". Tanda paling cepat: tanyakan \"berapa persen pendapatanmu dalam dolar?\" Jika jawabannya di bawah 30% sementara utang dolar di atas 50% total utang, kamu tidak sedang menganalisis perusahaan manufaktur — kamu sedang menganalisis hedge fund kurs yang kebetulan punya pabrik. Dan ingat asimetri waktu: depresiasi 8% dalam sebulan menghancurkan 3 tahun efisiensi operasional. Pabrik yang memangkas biaya 2% per tahun dengan susah payah bisa kehilangan seluruh hasilnya dalam satu minggu pergerakan kurs. Itulah mengapa hedge bukan \"biaya tambahan\" — ia adalah penjaga agar kerja keras operasional tidak dirampok oleh sesuatu yang di luar kendali manajemen.",
      },
      reference: "DSCR dua mata uang; hedge ratio minimum 50%; tenor hedge ≥70% tenor utang.",
    },
    {
      id: "risiko-klaster",
      eyebrow: "Langkah 10 · Risiko klaster",
      title: "Diversifikasi nama, konsentrasi risiko",
      prose: [
        "Referensi langkah siklus menyebut sekilas: 80% smelter di 2 kawasan — pemadaman listrik menghentikan semua; korelasi tersembunyi. Ini adalah salah satu kegagalan diversifikasi paling mahal dalam kredit korporasi, dan layak pendalaman. Bayangkan portofolio Bank Nusantara: 15 debitur \"terdiversifikasi\" — 5 smelter nikel, 4 kontraktor tambang, 3 perusahaan logistik, 2 pemasok alat berat, 1 perusahaan katering. Di atas kertas: 5 sektor berbeda, 15 nama berbeda, tidak ada yang melebihi 3% portofolio. Komite tidur nyenyak. Kenyataannya: 13 dari 15 beroperasi di dua kawasan industri yang sama di Sulawesi; 11 bergantung pada satu smelter induk sebagai pelanggan atau pemberi kerja; semuanya memakai satu pelabuhan yang sama untuk ekspor. Satu kejadian — pemadaman listrik 3 minggu, atau banjir yang menutup jalan hauling, atau moratorium ekspor — menghantam 13 debitur SERENTAK. Diversifikasi nama tanpa diversifikasi risiko = ilusi.",
        "Angkanya membuat ilusi ini terukur. Asumsikan tiap debitur PD individual 2% dan korelasi default antar debitur \"normal\" 0,1 → peluang 5+ dari 15 default bersamaan ≈ 0,3% (nyaris mustahil). Tetapi jika korelasi sebenarnya 0,6 (satu kawasan, satu pelanggan induk, satu pelabuhan) → peluang 5+ default bersamaan melonjak ke ~8% — 27 kali lipat! Inilah yang dimaksud korelasi tersembunyi: PD individual tetap 2% (analisis per debitur \"benar\"), tetapi risiko PORTOFOLIO jauh lebih besar dari jumlah bagian-bagiannya. Cara salah yang umum: limit konsentrasi dihitung per nama (\"maks 5% per debitur — aman!\") tanpa peta ketergantungan. Cara benar: klaster mapping — untuk setiap debitur korporasi besar, catat tiga ketergantungan: geografi (kawasan), rantai nilai (pelanggan/pemasok dominan), dan infrastruktur bersama (pelabuhan, listrik, jalan). Lalu hitung eksposur PER KLASTER, bukan per nama: \"eksposur kawasan IMIP: Rp 4,2 triliun (18% portofolio korporasi)\" — angka yang membuat komite terbangun.",
        "Aturan keputusannya. Pertama, tetapkan limit klaster: tidak ada klaster geografi/rantai nilai tunggal yang melebihi 15% portofolio korporasi — lebih ketat dari limit per nama, karena klaster gagal bersamaan. Kedua, uji skenario klaster setahun sekali: \"pelabuhan X tutup 1 bulan\" → debitur mana yang DSCR-nya jebol? Hasilnya sering mengejutkan: debitur \"sehat\" dengan DSCR 2,5x bisa jatuh ke 0,8x jika 70% penjualannya lewat satu pelabuhan. Ketiga, untuk debitur baru di klaster yang sudah padat, terapkan \"pajak klaster\": pricing +0,5% atau agunan lebih keras — bukan untuk menghukum, melainkan untuk mencerminkan bahwa kredit ke-16 di klaster yang sama menambah risiko sistemik, bukan hanya risiko individual. Mode kegagalan yang harus diwaspadai: \"klaster sukses\" — kawasan yang sedang booming (semua debitur tumbuh, semua lancar) justru menumpuk eksposur tercepat; euforia membuat limit klaster \"disesuaikan\" naik — persis sebelum siklus berbalik. Disiplin klaster diuji saat semua orang optimis, bukan saat semua orang takut.",
        "Membangun peta klaster tidak butuh sistem mahal — butuh disiplin. Mulai dari 20 debitur korporasi terbesar: untuk tiap nama, isi tiga kolom (kawasan operasi, pelanggan/pemasok dominan, infrastruktur kritis) dari memo kredit yang SUDAH ada — informasinya 80% tersedia, hanya belum pernah dikumpulkan. Agregatkan per klaster, tampilkan sebagai heatmap di komite risiko kuartalan. Pengalaman bank-bank yang melakukannya: temuan pertama hampir selalu mengejutkan (\"40% eksposur korporasi kita ternyata bergantung pada dua kawasan?\"), dan dalam 12 bulan limit klaster menjadi bagian standar setiap memo baru — analis otomatis menulis \"eksposur klaster kawasan X saat ini 12%, limit 15%, kredit ini menambah 1,2%\". Itulah institutionalization: dari wawasan menjadi kebiasaan. Dan ingat — klaster tidak hanya geografi: \"semua debitur yang pelanggan utamanya pemerintah daerah\" adalah klaster (risiko APBD), \"semua yang bahan bakunya impor dari satu negara\" adalah klaster (risiko rantai pasok). Di mana ada ketergantungan bersama, di sana ada klaster — tugas analis adalah memberinya nama sebelum krisis memberinya pelajaran.",
      ],
      tasks: [],
      reference: "Limit klaster 15% < limit per nama. Diversifikasi diukur dari ketergantungan, bukan jumlah nama.",
    },
    {
      id: "plafon-sovereign",
      eyebrow: "Langkah 11 · Sovereign ceiling",
      title: "Langit-langit kaca",
      prose: [
        "Langkah country risk menyebut sovereign ceiling sekilas: rating debitur tidak boleh melampaui rating sovereign. Aturannya terdengar absolut — praktiknya berlapis, dan memahaminya dengan angka membedakan analis junior dari senior. Contoh: sovereign Indonesia berperingkat BBB (skala internasional). PT Semen Nusantara — penjualan 100% domestik rupiah, aset di Indonesia — mengajukan obligasi USD 300 juta. Rating maksimalnya: BBB, tidak peduli sekuat apapun neracanya. Mengapa? Karena jika Indonesia mengalami krisis (moratorium devisa, depresiasi 50%), Semen Nusantara ikut tenggelam: pelanggannya bangkrut, rupiahnya anjlok, dan pemerintah bisa membatasi pembayaran ke luar negeri. Memberinya rating A (di atas sovereign) berarti mengklaim ia lebih aman dari negaranya sendiri — klaim yang jarang benar. Konsekuensinya ke pricing: spread obligasinya = spread sovereign + spread korporat; tidak ada \"diskon\" karena fundamentalnya bagus — langit-langitnya kaca, tetapi tetap langit-langit.",
        "Pengecualiannya — dan inilah yang sering salah dipahami — adalah debitur yang \"tidak tinggal\" di negaranya secara ekonomi. PT Energi Nusantara: 80% pendapatan ekspor dalam USD, kas operasi disimpan di Singapura, utang diterbitkan via SPV di luar negeri dengan cash waterfall yang memotong pembayaran bunga SEBELUM kas masuk Indonesia. Perusahaan ini bisa mendapat BBB+ — satu notch DI ATAS sovereign. Logikanya: bahkan jika Indonesia moratorium devisa, pembayaran obligasi sudah diamankan di luar negeri sebelum moratorium menyentuhnya. Tetapi perhatikan — pengecualian ini mahal dan sempit. Uji tiga syarat untuk menembus ceiling: (1) pendapatan valuta asing dominan (>50% dan stabil — bukan satu kontrak); (2) struktur offshore yang benar-benar memisahkan arus kas (kas di luar negeri cukup untuk 12 bulan debt service tanpa \"pulang\" dulu); (3) tidak bergantung pada izin pemerintah yang bisa dicabut semalam (kuota ekspor, lisensi tambang — jika iya, ceiling tetap berlaku karena sovereign bisa mematikan keran pendapatannya). Gagal satu syarat = kembali ke ceiling. Cara salah yang umum: \"ekspor 60% = otomatis di atas sovereign\" tanpa memeriksa ke mana kasnya mengalir — jika kas ekspor tetap masuk rekening Jakarta dulu, moratorium devisa tetap mencekiknya.",
        "Satu kebingungan terakhir yang wajib diluruskan — karena muncul di setiap wawancara kerja: rating Pefindo AAA (nasional) vs rating BBB (internasional). Keduanya benar, keduanya beda bahasa. Skala nasional mengukur risiko RELATIF dalam satu negara: AAA nasional = \"paling aman di Indonesia\". Skala internasional mengukur risiko ABSOLUT global: BBB = \"risiko menengah dunia\". PT Semen Nusantara bisa AAA nasional DAN BBB internasional sekaligus — tidak kontradiksi, seperti \"terpintar di kelas\" vs \"peringkat 500 nasional\". Kesalahan analis: membandingkan kupon obligasi AAA nasional dengan AAA internasional (\"kok bunganya lebih tinggi?\") — tentu lebih tinggi, karena AAA nasional Indonesia ≈ BBB internasional. Aturan keputusan: untuk kredit domestik rupiah, pakai skala nasional (praktis, sebanding dengan kompetitor lokal); untuk obligasi valas atau kredit lintas batas, SELALU konversi ke skala internasional dan terapkan sovereign ceiling — di sanalah langit-langit kaca itu berada.",
      ],
      tasks: [],
      reference: "Ceiling = BBB untuk domestik murni; tembus hanya dengan 3 syarat (valas dominan, kas offshore, bebas izin cabut).",
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
        "Industry risk: lima faktor — siklus, kompetisi, regulasi, tren permintaan, ESG.",
        "Disiplin komoditas: uji DSCR di harga through-the-cycle, bukan puncak.",
        "Sovereign ceiling: rating debitur tidak melampaui rating sovereign.",
        "Risiko konversi: utang dolar + pendapatan rupiah = DSCR jebol saat depresiasi.",
        "Risiko transisi ESG: tenor panjang terpapar kebijakan iklim masa depan.",
      ],
      next: { label: "CR19 — Validasi Model", href: "/learn/cr19-validasi-model" },
      quiz: [
        {
          q: "Debitur tekstil terbaik (DSCR 2,0) vs debitur teknologi biasa (DSCR 1,5). Mana berisiko lebih tinggi?",
          options: [
            { text: "Teknologi — DSCR lebih rendah", why: "DSCR bukan satu-satunya penentu." },
            { text: "Tekstil — default rate industrinya 7× lipat; 'kolam beracun' mengalahkan 'ikan sehat'", why: "Industry risk bisa mendominasi.", correct: true },
            { text: "Sama saja", why: "Tidak sama — risikonya berbeda jauh." },
            { text: "Tidak bisa dibandingkan", why: "Bisa — via default rate industri." },
          ],
        },
        {
          q: "Harga batubara di puncak (350). Kapan waktu tepat ekspansi kredit tambang?",
          options: [
            { text: "Sekarang — harga bagus", why: "Puncak = waktu terburuk." },
            { text: "Tidak sekarang — uji kelayakan pada harga through-the-cycle (90); ekspansi di puncak = membeli di puncak siklus", why: "Bank yang ekspansi di puncak menanggung default di lembah.", correct: true },
            { text: "Tunggu harga 500", why: "Semakin puncak semakin berbahaya." },
            { text: "Selalu tepat", why: "Timing siklus menentukan." },
          ],
        },
        {
          q: "Perusahaan Indonesia berpendapatan rupiah, berutang dolar AS. Risiko utamanya?",
          options: [
            { text: "Tidak ada — dolar stabil", why: "Dolar tidak stabil terhadap rupiah." },
            { text: "Risiko konversi: depresiasi rupiah membengkakkan utang dalam rupiah; butuh hedging atau natural hedge", why: "Tanpa hedge, depresiasi 20% = cicilan naik 20% dalam rupiah — DSCR jebol.", correct: true },
            { text: "Risiko transfer saja", why: "Transfer = soal aliran devisa, bukan nilai tukar." },
            { text: "Hanya risiko suku bunga", why: "Risiko nilai tukar yang dominan." },
          ],
        },
        {
          q: "Apa itu 'sovereign ceiling'?",
          options: [
            { text: "Batas utang pemerintah", why: "Bukan itu." },
            { text: "Rating debitur umumnya tidak boleh melampaui rating sovereign negaranya — kecuali ada mitigasi kuat", why: "Negara yang gagal bayar menyeret semua.", correct: true },
            { text: "Plafon kredit bank", why: "Bukan." },
            { text: "Batas BMPK", why: "BMPK soal eksposur tunggal." },
          ],
        },
        {
          q: "Kredit 15 tahun ke PLTU batubara. Risiko ESG yang paling relevan?",
          options: [
            { text: "Tidak ada — ESG hanya kosmetik", why: "ESG adalah risiko kredit horizon panjang." },
            { text: "Risiko transisi: pajak karbon & phase-out batubara bisa membuat aset stranded sebelum kredit lunas", why: "Tenor panjang = terpapar kebijakan iklim masa depan.", correct: true },
            { text: "Hanya risiko fisik banjir", why: "Transisi lebih relevan untuk PLTU." },
            { text: "ESG tidak mempengaruhi kredit", why: "Mempengaruhi — via aset stranded." },
          ],
        },
      ],
    },
  ],
};
