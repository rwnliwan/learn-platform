import type { V2Lesson } from "../lib/types";

export const cr13: V2Lesson = {
  slug: "cr13-ead-ccf",
  track: "Credit Risk",
  module: "LGD, EAD & ECL",
  title: "CR13 — EAD & CCF: Risiko yang Tidur",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Limit Rp 100 juta yang \"tidak terpakai\"",
      prose: [
        "Bu Sinta punya kartu kredit limit Rp 100 juta, terpakai cuma Rp 10 juta. Ia bangga: \"Saya hemat, tidak seperti tetangga yang limitnya jebol.\" Lalu usahanya goyah. Dalam 3 bulan sebelum akhirnya macet, ia menarik: Rp 30 juta (bayar supplier), Rp 25 juta (gaji karyawan), Rp 20 juta (tutup lubang)... Total saat default: Rp 85 juta — dari yang tadinya \"cuma\" Rp 10 juta.",
        "Bank mencatat kerugiannya dari Rp 85 juta — 8,5× lipat dari yang terlihat saat ia \"hemat\". Limit yang tidak terpakai ternyata bukan \"tidak ada risiko\" — melainkan risiko yang sedang tidur.",
        "Debitur yang kesulitan cenderung menghabiskan limitnya sebelum macet — seperti orang tenggelam yang meraih apa saja. Fenomena ini bernama CCF (Credit Conversion Factor).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk fasilitas revolving, komitmen = risiko. Bank sudah berjanji menyediakan limit — dan janji itu akan ditagih tepat saat bank paling tidak ingin membayarnya (saat debitur kritis). Paradoks komitmen kredit: asuransi yang diklaim saat perusahaan asuransi ikut kesulitan.",
      },
      reference: "EAD = foto di momen kecelakaan — bukan foto hari ini.",
    },
    {
      id: "ead",
      eyebrow: "Langkah 2 · EAD",
      title: "Dua jenis fasilitas, dua rumus",
      prose: [
        "EAD (Exposure at Default) = total tagihan bank pada saat debitur default. Term loan (KPR, KTA angsuran): EAD ≈ sisa pokok (+ tunggakan bunga). Pasti, tidak bisa ditarik lagi — tidak butuh CCF. Revolving (kartu kredit, cerukan, KMK revolving): EAD = outstanding + (undrawn × CCF) — karena debitur bisa menarik sisa limit sebelum macet.",
        "Contoh: kartu kredit limit Rp 100 jt, outstanding Rp 60 jt, CCF 35% (kondisi menurun). Undrawn = 100 − 60 = Rp 40 jt. Tambahan = 40 × 35% = Rp 14 jt. EAD = 60 + 14 = Rp 74 jt (bukan 60!). Selisih Rp 14 jt = \"utang masa depan\" yang belum terjadi tetapi harus dicadangkan hari ini.",
        "18,9% dari EAD tidak terlihat di laporan hari ini. Bank yang menghitung EL dari outstanding saja underestimate sekitar seperlima eksposur kartu kreditnya. Inilah mengapa CCF wajib dalam perhitungan ECL dan modal.",
      ],
      formula: String.raw`\text{EAD}_{\text{revolving}} = \text{Outstanding} + (\text{Undrawn} \times \text{CCF})`,
      formulaNote: "Undrawn = limit − outstanding. Untuk term loan: EAD ≈ sisa pokok.",
      tasks: [],
      reference: "Beda produk, beda formula: term loan pasti, revolving butuh CCF.",
    },
    {
      id: "lab-ead",
      eyebrow: "Langkah 3 · Lab EAD",
      title: "Kalkulator EAD & CCF",
      prose: [
        "Kartu kredit: limit Rp 100 jt, outstanding Rp 60 jt, undrawn Rp 40 jt. CCF tergantung kondisi: sehat 10%, menurun 35%, kritis 70%. Tugasmu: hitung EAD untuk ketiga kondisi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ead_sehat` (CCF 10%) dan `ead_menurun` (CCF 35%)" },
        { id: "t2", text: "Hitung `ead_kritis` (CCF 70%)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "sehat=64.0 menurun=74.0 kritis=88.0",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"EAD = outstanding hari ini. Limit yang belum dipakai bukan risiko.\" Untuk revolving, komitmen = risiko. Bank memakai CCF flat untuk semua nasabah = meremehkan yang kritis 2× (underestimate tepat di segmen terpenting) dan menghukum yang sehat.",
      },
      hints: [
        "EAD = outstanding + undrawn × CCF.",
        "Undrawn = limit − outstanding = 40.",
        "ead_sehat = outstanding + undrawn * 0.10",
      ],
      code: {
        starter: `limit = 100       # juta Rp\noutstanding = 60  # terpakai saat ini\nundrawn = limit - outstanding\n\n# TULIS KODEMU: EAD untuk 3 kondisi\nccf_sehat, ccf_menurun, ccf_kritis = 0.10, 0.35, 0.70\nead_sehat = \nead_menurun = \nead_kritis = \n\nprint(f"sehat={ead_sehat:.1f} menurun={ead_menurun:.1f} kritis={ead_kritis:.1f}")`,
        lockLines: 4,
        solution: `limit = 100       # juta Rp\noutstanding = 60  # terpakai saat ini\nundrawn = limit - outstanding\n\n# TULIS KODEMU: EAD untuk 3 kondisi\nccf_sehat, ccf_menurun, ccf_kritis = 0.10, 0.35, 0.70\nead_sehat = outstanding + undrawn * ccf_sehat\nead_menurun = outstanding + undrawn * ccf_menurun\nead_kritis = outstanding + undrawn * ccf_kritis\n\nprint(f"sehat={ead_sehat:.1f} menurun={ead_menurun:.1f} kritis={ead_kritis:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ead_sehat", value: 64.0, tol: 1e-9, label: "`ead_sehat` seharusnya 64.0", msg: "60 + 40×0.10 = 64." },
          { kind: "equal", task: "t1", name: "ead_menurun", value: 74.0, tol: 1e-9, label: "`ead_menurun` seharusnya 74.0", msg: "60 + 40×0.35 = 74." },
          { kind: "equal", task: "t2", name: "ead_kritis", value: 88.0, tol: 1e-9, label: "`ead_kritis` seharusnya 88.0", msg: "60 + 40×0.70 = 88." },
          { kind: "stdout_matches", task: "t3", pattern: "sehat=64\\.0\\s+menurun=74\\.0\\s+kritis=88\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: outstanding 95 (hampir max) — undrawn kecil, CCF tidak masalah. Bahaya = limit BESAR yang BELUM dipakai.",
    },
    {
      id: "ccf",
      eyebrow: "Langkah 4 · CCF",
      title: "Kebiasaan buruk sebelum jatuh",
      prose: [
        "CCF (Credit Conversion Factor) = % dari limit yang belum ditarik yang diperkirakan akan ditarik sebelum default. Diestimasi dari data historis: lihat debitur yang default 12 bulan lalu — berapa % undrawn mereka yang \"menguap\" menjadi outstanding?",
        "Fakta kunci: CCF naik saat debitur memburuk — debitur sehat CCF ~10%, debitur kritis CCF ~70%. Ini adverse drawdown: yang paling butuh (kritis) justru paling agresif menarik. Perilaku rasional dari sisi debitur (bertahan hidup) = bencana dari sisi bank. CCF harus kondisional, bukan flat.",
        "CCF seperti mengukur seberapa rakus orang makan saat tahu kapal akan tenggelam — yang panik mengambil paling banyak. Debitur korporasi dengan fasilitas standby Rp 100 M, terpakai Rp 20 M, kondisi memburuk: ia bisa menarik Rp 80 M sisanya sebelum default (adverse drawdown) — EAD bisa 5× outstanding. Inilah fungsi MAC clause: menahan penarikan saat kondisi memburuk drastis.",
      ],
      tasks: [],
      reference: "CCF historis: sehat ~10% · menurun ~35% · kritis ~70% (7× lipat!).",
    },
    {
      id: "utilisasi",
      eyebrow: "Langkah 5 · Utilisasi",
      title: "Pedang bermata dua",
      prose: [
        "Utilisasi = outstanding / limit. Ia adalah pedang bermata dua. Mata 1 — prediktor PD: utilisasi tinggi → PD tinggi (debitur kepepet). Utilisasi >80% = sinyal EWS (CR9). Mata 2 — sumber EAD tersembunyi: utilisasi rendah + limit besar = undrawn besar = CCF bisa meledak.",
        "Debitur paling berbahaya untuk EAD: limit jumbo, utilisasi kecil, kondisi memburuk — \"bom tidur\". Di laporan terlihat aman (outstanding kecil), tetapi undrawn raksasa siap ditarik.",
        "Hafalkan pasangan ini: utilisasi tinggi → soal PD; limit besar menganggur → soal EAD. Saat me-review portofolio kartu kredit, tanyakan keduanya: \"siapa yang utilisasinya meledak?\" DAN \"berapa total undrawn dari limit tidur?\" — jawaban kedua sering lebih mengejutkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "30% kartu tidak aktif 12 bulan dengan total undrawn Rp 1,1 T. Tindakan termurah: pangkas limit kartu tidur ke 2× pemakaian historis — hapus EAD hantu tanpa ganggu nasabah aktif. Diet EAD termurah.",
      },
      reference: "Review limit menganggur adalah pekerjaan EAD, bukan pekerjaan bisnis.",
    },
    {
      id: "lab-utilisasi",
      eyebrow: "Langkah 6 · Lab Utilisasi",
      title: "Utilisasi sebagai prediktor",
      prose: [
        "200.000 nasabah kartu kredit disimulasikan (terkunci): utilisasi ~ beta(2,5) — kebanyakan rendah; PD naik eksponensial dengan utilisasi. Tugasmu: hitung default rate band utilisasi 0–20% dan 60–80%, lalu bandingkan. Jumlah 200.000 sengaja besar: band 60–80% hanya berisi ~4% nasabah, jadi dengan 5.000 nasabah rasionya berisik — n besar membuat angka yang kamu ukur jujur terhadap modelnya (nilai analitik: ≈1,32% vs ≈4,34%, rasio ≈3,3).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rate_rendah` (%) band 0–20%" },
        { id: "t2", text: "Hitung `rate_tinggi` (%) band 60–80% dan `rasio` = tinggi/rendah" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "rendah=1.30 tinggi=4.34 rasio=3.3",
      hints: [
        "Saring nasabah dengan 0 <= u < 0.2 untuk band rendah.",
        "Default rate = rata-rata status default × 100.",
        "b = [d for u, d in nasabah if 0 <= u < 0.2]; rate = sum(b)/len(b)*100",
      ],
      code: {
        starter: `import random, math\nrandom.seed(77)\n\nnasabah = []\nfor _ in range(200000):\n    util = random.betavariate(2, 5)\n    pd = 0.01 * math.exp(2.2 * util)\n    nasabah.append((util, random.random() < pd))\n\n# TULIS KODEMU: default rate dua band utilisasi\nrate_rendah = \nrate_tinggi = \nrasio = \n\nprint(f"rendah={rate_rendah:.2f} tinggi={rate_tinggi:.2f} rasio={rasio:.1f}")`,
        lockLines: 7,
        solution: `import random, math\nrandom.seed(77)\n\nnasabah = []\nfor _ in range(200000):\n    util = random.betavariate(2, 5)\n    pd = 0.01 * math.exp(2.2 * util)\n    nasabah.append((util, random.random() < pd))\n\n# TULIS KODEMU: default rate dua band utilisasi\nb_rendah = [d for u, d in nasabah if 0 <= u < 0.2]\nb_tinggi = [d for u, d in nasabah if 0.6 <= u < 0.8]\nrate_rendah = sum(b_rendah)/len(b_rendah)*100\nrate_tinggi = sum(b_tinggi)/len(b_tinggi)*100\nrasio = rate_tinggi / rate_rendah\n\nprint(f"rendah={rate_rendah:.2f} tinggi={rate_tinggi:.2f} rasio={rasio:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rate_rendah", value: 1.30, tol: 0.2, label: "`rate_rendah` sekitar 1.30", msg: "Band 0–20%: default rate rendah." },
          { kind: "equal", task: "t2", name: "rate_tinggi", value: 4.34, tol: 0.4, label: "`rate_tinggi` sekitar 4.34", msg: "Band 60–80%: jauh lebih tinggi." },
          { kind: "equal", task: "t2", name: "rasio", value: 3.3, tol: 0.8, label: "`rasio` sekitar 3.3", msg: "Hubungan eksponensial: ~3× lipat." },
          { kind: "stdout_matches", task: "t3", pattern: "rendah=1\\.30\\s+tinggi=4\\.34\\s+rasio=3\\.3", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Pelajaran ganda: utilisasi tinggi = PD tinggi; utilisasi RENDAH + limit BESAR = EAD tersembunyi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: menjinakkan EAD hantu",
      prose: [
        "Skenario 1 — Fasilitas revolving (kartu kredit, cerukan, KMK revolving). → EAD = outstanding + (undrawn × CCF), dengan CCF kondisional: sehat 10%, menurun 35%, kritis 70%. Contoh nyata: limit Rp 100 jt, outstanding Rp 60 jt, kondisi menurun → EAD Rp 74 jt, bukan 60. Rp 14 jt = 'utang masa depan' yang harus dicadangkan hari ini.",
        "Skenario 2 — Limit jumbo menganggur + debitur memburuk (bom tidur). → Pangkas limit / pasang MAC clause yang bisa dieksekusi. Contoh nyata: 30% kartu tidur dengan undrawn Rp 1,1 T dipangkas → Rp 700 M EAD hantu hilang dengan biaya komplain ~2%.",
        "Skenario 3 — Mengestimasi CCF. → Pendekatan kohort per segmen utilisasi, bukan flat. Contoh nyata: utilisasi <30% → CCF 55% (banyak yang bisa ditarik); utilisasi >70% → CCF 15%. CCF flat 40% melebih-lebihkan yang satu, meremehkan yang lain.",
        "Skenario 4 — Komitmen sudah ACC tetapi belum cair (pipeline KPR Rp 1,6 T, jeda 45 hari). → Catat EAD hantu pipeline: 1% memburuk dalam jeda × dicairkan = Rp 16 M dengan PD di atas rata-rata. Putuskan sebelum memburuk: cairkan atau batalkan — jangan biarkan mengambang.",
        "Skenario 5 — Utilisasi meledak di satu sisi, undrawn raksasa di sisi lain. → Hafalkan pasangan: utilisasi tinggi = soal PD (EWS); limit besar menganggur = soal EAD. Tanyakan keduanya setiap review portofolio.",
        "Aturan praktis 10 detik: EAD satu-satunya tuas EL yang murah — diet limit tidur hari ini (pangkas, MAC clause, borrowing base) selalu lebih murah dari CKPN esok hari.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menghitung EL kartu kredit dari outstanding saja — 18,9% eksposur tidak terlihat di laporan. Bu Sinta yang 'hemat' (terpakai Rp 10 jt dari limit Rp 100 jt) default di Rp 85 jt: bank mencatat kerugian 8,5× lipat dari yang terlihat. Limit tak terpakai bukan 'tidak ada risiko' — melainkan risiko yang sedang tidur.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bom limit tidur",
      prose: [
        "Audit portofolio kartu kredit Bank Nusantara menemukan: 50.000 kartu dengan limit total Rp 5 T, outstanding hanya Rp 1,2 T (utilisasi 24%); 30% kartu tidak aktif >12 bulan — tetapi limitnya tetap penuh (total undrawn Rp 1,1 T); CCF historis debitur kritis: 60%; skenario stres: 5% pemegang kartu \"tidur\" mengalami kesulitan bersamaan (PHK massal sektor).",
        "Pembahasan: EAD tersembunyi = 5% × Rp 1,1 T = Rp 55 M undrawn terdampak × CCF 60% = Rp 33 M EAD tambahan — muncul bersamaan dengan gelombang default (korelasi!). Dan ini belum termasuk undrawn kartu aktif.",
        "Rekomendasi: (1) program pemangkasan limit tidur — turunkan limit kartu tidak aktif >12 bulan ke maks 2× pemakaian historis, target hapus Rp 500 M EAD hantu dalam 6 bulan; (2) aturan limit dinamis — limit turun otomatis jika sinyal EWS merah (dengan pemberitahuan + klausul kontrak); (3) laporkan EAD (bukan outstanding) di dashboard direksi — agar \"bom tidur\" terlihat.",
      ],
      tasks: [],
      reference: "Limit yang tidak terpakai = risiko yang sedang tidur, bukan tidak ada risiko.",
    },
    {
      id: "ccf-estimasi",
      eyebrow: "Langkah 9 · Estimasi CCF",
      title: "Mengestimasi CCF tanpa menebak",
      prose: [
        "Cara mengestimasi CCF yang benar disebut pendekatan kohort: ambil semua debitur yang default 12 bulan lalu, lihat posisi undrawn mereka pada tanggal referensi (12 bulan sebelum default), lalu hitung berapa yang \"menguap\" menjadi outstanding. CCF = rata-rata penarikan tambahan dibagi undrawn awal. Pemilihan tanggal referensi adalah separuh metodologi: 12 bulan sebelum default adalah standar (cakrawala satu tahun, konsisten dengan PD), tetapi untuk produk digital yang penarikannya instan, jendela 3–6 bulan memberi sinyal yang lebih tajam.",
        "Contoh dengan angka: 1.000 debitur kartu kredit yang default. Undrawn rata-rata Rp 40 jt setahun sebelum default; penarikan tambahan rata-rata Rp 16 jt → CCF agregat 40%. Tetapi segmentasikan per utilisasi awal: utilisasi di bawah 30% → CCF 55% (banyak yang bisa ditarik); utilisasi di atas 70% → CCF 15% (hampir tidak ada sisa). CCF flat 40% melebih-lebihkan debitur padat dan meremehkan debitur lengang — persis kelompok \"bom tidur\" yang paling berbahaya. Segmentasi minimum yang sehat: produk × band utilisasi.",
        "Cara salah yang umum: memakai CCF downturn untuk seluruh portofolio \"agar konservatif\", lalu heran mengapa pricing tidak kompetitif — atau sebaliknya, memakai CCF periode tenang untuk ECL saat ekonomi memburuk. Yang benar: CCF untuk ECL harus kondisional terhadap skenario (seperti PD), dan untuk modal ada floor regulasi — fasilitas yang bisa dibatalkan kapan saja (unconditionally cancellable, seperti kartu kredit) punya floor 10% di pendekatan standar. Floor bukan target; estimasi internal yang sehat untuk kartu tidur biasanya jauh di atasnya.",
        "Aturan keputusan. Satu: estimasi ulang CCF tiap tahun — perilaku penarikan berubah (pasca-pandemi, penarikan digital jauh lebih cepat). Dua: CCF = maksimum(estimasi internal tersegmentasi, floor regulasi). Tiga: dokumentasikan tanggal referensi dan definisi default yang dipakai — mengganti salah satunya diam-diam mengubah seluruh angka. Empat: backtest — bandingkan EAD prediksi vs outstanding aktual saat default per segmen; selisih sistematis satu arah berarti metodologimu bias.",
      ],
      tasks: [],
      reference: "CCF kohort tersegmentasi: produk × band utilisasi, re-estimasi tahunan.",
    },
    {
      id: "ead-taktis",
      eyebrow: "Langkah 10 · EAD taktis",
      title: "Tiga jurus menurunkan EAD hantu",
      prose: [
        "EAD adalah satu-satunya komponen EL yang bisa diturunkan hampir tanpa biaya — tidak seperti PD (butuh underwriting lebih ketat = mengorbankan pertumbuhan) atau LGD (butuh agunan = mengorbankan segmen). Tiga jurus taktisnya: pangkas limit kartu tidur, pasang MAC clause yang benar-benar bisa dieksekusi untuk korporasi, dan terapkan borrowing base (limit mengikuti nilai agunan berjalan) untuk KMK agunan persediaan/piutang.",
        "Contoh dengan angka: 30% kartu tidur dengan undrawn Rp 1,1 T dipangkas ke 2× pemakaian historis → undrawn turun ke Rp 0,4 T. EAD hantu yang hilang: Rp 700 M. Dengan CCF stres 60%, EAD yang benar-benar terhapus dari skenario buruk = Rp 420 M. Biayanya: komplain nasabah sekitar 2%, sebagian besar diam saja karena kartunya memang tidak dipakai. Bandingkan dengan alternatifnya — menaikkan CKPN untuk menutup EAD yang sama: butuh modal dan menggerus laba. Diet EAD selalu lebih murah daripada obat cadangan.",
        "Cara salah yang klasik: memangkas limit justru saat krisis berlangsung. Itu pro-cyclical — nasabah yang sedang kesulitan melihat limitnya dipotong, panik, lalu menarik sisanya sebelum benar-benar dibekukan (rush to draw yang justru mempercepat EAD). Jurus yang benar: pangkas diam-diam saat portofolio sehat, sebagai hygiene tahunan. Waktu eksekusi adalah separuh dari strateginya.",
        "Aturan keputusan. Satu: review otomatis limit kartu tidur tiap 12 bulan — jadikan proses, bukan proyek. Dua: untuk korporasi, uji MAC clause ke tim legal setahun sekali; klausul yang tidak bisa dieksekusi adalah dekorasi. Tiga: tetapkan cap undrawn per nasabah untuk segmen konsumer (misalnya 3× penghasilan bulanan). Empat: ukur keberhasilan bukan dari \"limit dipangkas\", melainkan dari EAD stres yang turun — metriknya adalah rupiah risiko, bukan jumlah kartu.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: undrawn limit adalah opsi jual yang kamu berikan gratis",
        body: "Setiap rupiah undrawn adalah put option yang bank jual ke debitur dengan premi nol — hak (bukan kewajiban) untuk menarik dana, yang akan dieksekusi persis saat bank paling tidak menginginkannya. Begitu kamu melihatnya sebagai opsi, seluruh perilaku menjadi intuitif: nilainya meledak saat kondisi memburuk (seperti semua put option), dan penjual opsi yang waras mematok batas eksposur. Heuristik meja kerja: sebelum meminta tambahan modal atau menaikkan cadangan, dietkan dulu EAD — memangkas Rp 700 M undrawn tidur menghapus risiko dengan biaya nyaris nol, sementara menutupnya dengan modal butuh Rp 56 M modal mahal (8% dari RWA). Urutan pertahanan yang benar: kecilkan EAD dulu, perkuat LGD kedua, dan hanya terakhir minta modal. Bank yang langsung lompat ke langkah ketiga sedang membayar mahal untuk risiko yang sebenarnya bisa dihapus gratis. Satu kebiasaan yang membedakan analis EAD yang baik: setiap kali melihat limit besar yang menganggur, ia tidak bertanya \"berapa outstanding-nya?\" melainkan \"berapa yang bisa hilang besok pagi?\" — karena EAD hidup di masa depan yang buruk, bukan di laporan hari ini.",
      },
      reference: "EAD diet dulu, modal kemudian.",
    },
    {
      id: "ead-komitmen",
      eyebrow: "Langkah 11 · Komitmen",
      title: "EAD yang belum lahir: komitmen yang terlupakan",
      prose: [
        "Ada EAD yang bahkan tidak muncul sebagai \"undrawn\" di laporan: komitmen yang sudah disetujui tetapi belum dicairkan. KPR yang sudah ACC Rp 800 jt tetapi akadnya bulan depan; KMK konstruksi yang pencairannya bertahap mengikuti progres; fasilitas modal kerja yang baru ditandatangani. Selama belum cair, outstanding-nya nol — tetapi bank sudah terikat janji. Jika debitur memburuk di antara ACC dan pencairan, bank menghadapi pilihan buruk: cairkan ke debitur yang sudah bermasalah, atau batalkan dan hadapi gugatan.",
        "Contoh dengan angka: pipeline KPR Bank Nusantara — 2.000 aplikasi sudah ACC, total Rp 1,6 T, rata-rata jeda ACC-ke-akad 45 hari. Asumsikan 1% memburuk signifikan dalam jeda itu dan tetap dicairkan (karena membatalkan lebih mahal secara hukum dan reputasi): EAD \"hantu pipeline\" = Rp 16 M dengan PD yang jauh di atas rata-rata portofolio. Kecil dibanding outstanding Rp 40 T? Ya — tetapi ini adalah Rp 16 M dengan PD 15–20%, yang EL-nya setara Rp 160 M kredit normal. Analis yang hanya membaca outstanding tidak pernah melihat angka ini.",
        "Cara salah: mengabaikan pipeline sepenuhnya (\"belum cair = belum risiko\") atau menghitungnya dengan CCF kartu kredit yang tidak relevan. Cara benar: perlakukan pipeline sebagai segmen EAD tersendiri — EAD = nilai komitmen × probabilitas pencairan (untuk KPR sehat mendekati 95%; untuk fasilitas bertahap, ikuti jadwal). Pertahankan daftar pantauan: setiap komitmen di atas Rp 5 M yang jedanya melebihi 60 hari wajib di-review ulang kelayakannya sebelum akad. Aturan keputusan: semakin panjang jeda ACC-ke-cair, semakin besar EAD hantu — percepat akad atau pasang klausul peninjauan ulang; jangan biarkan janji menggantung tanpa tanggal kedaluwarsa.",
      ],
      tasks: [],
      reference: "Pipeline ACC-belum-cair = segmen EAD tersendiri dengan PD di atas rata-rata.",
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
        "EAD term loan = sisa pokok; EAD revolving = outstanding + undrawn × CCF.",
        "CCF naik saat debitur memburuk (adverse drawdown): sehat ~10%, kritis ~70%. Harus kondisional, bukan flat.",
        "Utilisasi = pedang bermata dua: tinggi → soal PD; rendah + limit besar → soal EAD.",
        "Bom tidur: limit jumbo + utilisasi kecil + kondisi memburuk. Diet EAD termurah = pangkas limit tidur.",
        "Fasilitas standby korporasi: waspadai penarikan penuh sebelum default — wajib MAC clause.",
      ],
      next: { label: "CR14A — ECL & Staging", href: "/learn/cr14a-ecl-staging" },
      quiz: [
        {
          q: "Kartu kredit: limit Rp 100 jt, outstanding Rp 60 jt, CCF 35%. EAD?",
          options: [
            { text: "Rp 60 jt (outstanding saja)", why: "Mengabaikan undrawn = underestimate." },
            { text: "Rp 74 jt (60 + 40×35%)", why: "60 + (100−60)×0,35 = 74. Rp 14 jt adalah 'utang masa depan' yang harus dicadangkan hari ini.", correct: true },
            { text: "Rp 100 jt (limit penuh)", why: "Tidak semua undrawn akan ditarik — CCF yang menentukan." },
            { text: "Rp 14 jt", why: "Itu tambahannya saja, bukan total EAD." },
          ],
        },
        {
          q: "Mengapa CCF debitur kritis (70%) jauh lebih tinggi dari yang sehat (10%)?",
          options: [
            { text: "Bank sengaja menaikkan", why: "CCF diestimasi dari data, bukan ditetapkan." },
            { text: "Adverse drawdown: yang kesulitan cenderung menghabiskan limit sebelum macet — seperti orang tenggelam meraih apa saja", why: "Perilaku rasional dari sisi debitur = bencana dari sisi bank. CCF harus kondisional.", correct: true },
            { text: "Salah hitung", why: "Ini pola empiris yang konsisten." },
            { text: "Regulasi mewajibkan", why: "Regulasi tidak menetapkan angka CCF." },
          ],
        },
        {
          q: "Utilisasi 90% vs utilisasi 10% (limit Rp 100 jt). Mana benar?",
          options: [
            { text: "90% lebih berbahaya untuk PD; 10% + limit besar = EAD tersembunyi (undrawn 90 jt × CCF)", why: "Pedang bermata dua. Analis memantau keduanya.", correct: true },
            { text: "10% selalu aman", why: "Aman untuk PD, tetapi EAD tersembunyi besar." },
            { text: "90% selalu lebih baik (nasabah aktif)", why: "Utilisasi 90% = sinyal PD tinggi." },
            { text: "Tidak ada bedanya", why: "Bedanya besar — untuk PD maupun EAD." },
          ],
        },
        {
          q: "Untuk KPR angsuran (term loan), EAD dihitung sebagai?",
          options: [
            { text: "Outstanding + undrawn × CCF", why: "Itu rumus revolving." },
            { text: "Sisa pokok (+ tunggakan) — tidak ada penarikan lagi, jadi tidak butuh CCF", why: "Term loan tidak revolving — EAD pasti. Beda produk, beda formula.", correct: true },
            { text: "Limit awal", why: "Limit awal sudah berkurang oleh angsuran." },
            { text: "Selalu sama dengan EAD kartu kredit", why: "Berbeda — kartu kredit revolving." },
          ],
        },
        {
          q: "Bank memakai CCF flat 35% untuk semua kartu kredit; data aktual: sehat 12%, kritis 72%. Apa masalahnya?",
          options: [
            { text: "Tidak ada — flat lebih sederhana", why: "Sederhana tetapi salah di kedua arah." },
            { text: "Salah dua arah: segmen sehat overestimate (tidak kompetitif), segmen kritis underestimate 2× (kurang cadangan tepat di segmen terpenting)", why: "Yang sehat 'dihukum' berlebihan, yang kritis diremehkan. CCF harus kondisional.", correct: true },
            { text: "Flat selalu underestimate", why: "Tidak selalu — untuk segmen sehat justru overestimate." },
            { text: "CCF tidak penting", why: "CCF menentukan sekitar seperlima EAD kartu kredit (dalam contoh: 14/74 ≈ 19%)." },
          ],
        },
      ],
    },
  ],
};
