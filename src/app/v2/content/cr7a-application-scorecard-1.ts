import type { V2Lesson } from "../lib/types";

export const cr7a: V2Lesson = {
  slug: "cr7a-application-scorecard-1",
  track: "Credit Risk",
  module: "Scorecard & Pemodelan PD",
  title: "CR7A — Application Scorecard 1: Binning & WoE",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "30 detik menentukan Rp 50 juta",
      prose: [
        "Dina mengajukan KTA Rp 50 juta via aplikasi. Ia mengisi form 3 menit, upload KTP, selfie. 30 detik kemudian: \"Pengajuan Anda disetujui.\" Tidak ada analis yang membaca berkasnya. Tidak ada telepon verifikasi.",
        "Yang terjadi di 30 detik itu: sistem menarik data SLIK, e-KTP, mutasi e-wallet — lalu menjalankan application scorecard: model yang mengubah ratusan data mentah menjadi satu angka (skor 720), membandingkannya dengan cut-off (650), dan memutuskan: ACC.",
        "Scorecard terlihat seperti \"nilai ujian\" sederhana — padahal di baliknya ada binning, WoE, regresi logistik, dan validasi yang masing-masing bisa salah dengan cara yang elegan. Part 1 ini membedah dapurnya: bagaimana data mentah disulap menjadi skor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di ruang risiko, Rina menatap dashboard dengan cemas: \"Approval naik 20% bulan ini. Modelnya masih valid? Atau kita sedang menyetujui bom waktu?\" Scorecard yang tidak dimonitor = mesin ACC buta.",
      },
      reference: "Application scorecard: prediksi peluang default 12 bulan saat pengajuan → skor → keputusan vs cut-off.",
    },
    {
      id: "scorecard",
      eyebrow: "Langkah 2 · Scorecard",
      title: "5C yang dikuantifikasi",
      prose: [
        "Application scorecard = model statistik yang memprediksi peluang default 12 bulan calon debitur saat pengajuan, lalu menerjemahkannya menjadi skor (misal 300–850). Dipakai untuk keputusan otomatis: skor ≥ cut-off → ACC.",
        "Scorecard adalah 5C versi robot (CR1) — character → riwayat SLIK, capacity → rasio penghasilan, capital → DP/LTV, conditions → variabel wilayah/makro. Bedanya: robot ini konsisten, tidak lelah, tidak bisa disuap — tetapi juga tidak punya common sense. Ia hanya sebagus data latihnya.",
        "Alur pembangunan: (1) Binning — kelompokkan tiap variabel; (2) WoE/IV — ukur kekuatan tiap variabel; (3) Regresi logistik — gabungkan jadi peluang; (4) Scaling PDO — ubah peluang jadi skor cantik (Part 2); (5) Cut-off & validasi — putuskan ambang ACC (Part 2).",
      ],
      tasks: [],
      reference: "Part 1 = dapur (binning, WoE/IV, regresi logistik). Part 2 = penyajian (skor, cut-off, validasi).",
    },
    {
      id: "binning",
      eyebrow: "Langkah 3 · Binning",
      title: "Mengelompokkan dunia yang kacau",
      prose: [
        "Binning = memotong variabel kontinu menjadi kelompok (bin): penghasilan → \"<3 jt\", \"3–5 jt\", \"5–10 jt\", dst. Variabel kategorik juga bisa digabung (misal: 20 jenis pekerjaan → 4 kelompok risiko). Mengapa tidak pakai angka mentah? Tiga alasan.",
        "Non-linearitas: hubungan penghasilan vs default tidak garis lurus — naik dari 3→5 jt menurunkan risiko drastis, tetapi 50→52 jt hampir tidak berpengaruh. Bin menangkap ini; garis lurus tidak. Robust terhadap outlier: penghasilan Rp 500 jt masuk bin \">20 jt\" — tidak merusak model. Missing bisa jadi bin sendiri: \"penghasilan kosong\" sering justru paling prediktif — missing = sinyal!",
        "Binning seperti menyortir buah — tidak menilai tiap buah satu per satu, melainkan mengelompokkan ke keranjang \"busuk\", \"biasa\", \"premium\". Model kemudian menilai keranjangnya, bukan buahnya. Bin yang baik punya monotonic trend (risiko naik/turun teratur antar bin) dan isi cukup (≥5% populasi per bin). Bin dengan 3 orang = bukan pola, melainkan kebetulan — model akan \"menghafal\" kebetulan itu (overfitting).",
      ],
      tasks: [],
      reference: "Waspadai pola zig-zag antar bin = biasanya artefak bin terlalu kecil, bukan pola nyata.",
    },
    {
      id: "woe-iv",
      eyebrow: "Langkah 4 · WoE & IV",
      title: "Bahasa mesin menilai risiko",
      prose: [
        "WoE (Weight of Evidence) = \"nilai risiko\" tiap bin. IV (Information Value) = \"kekuatan\" variabel secara keseluruhan. % Good = porsi nasabah lancar yang jatuh di bin ini (dari total lancar); % Bad = porsi nasabah default yang jatuh di bin ini (dari total default). WoE positif = bin ini \"lebih banyak yang lancar\" → aman. WoE negatif = \"lebih banyak yang macet\" → berisiko.",
        "Contoh: 1.000 aplikan — 150 default (Bad), 850 lancar (Good). Bin penghasilan \"<3 jt\": 120 orang, 36 default. % Bad di bin = 36/150 = 24%. % Good di bin = 84/850 = 9,9%. WoE = ln(9,9%/24%) = ln(0,4125) = −0,89 (negatif = berisiko). Kontribusi IV = (9,9% − 24%) × (−0,89) = 0,126. Jumlahkan semua bin → IV total.",
        "Interpretasi IV: <0,02 = sampah (tidak prediktif); 0,02–0,1 = lemah; 0,1–0,3 = sedang; >0,3 = kuat; >0,5 = curigai (terlalu bagus — mungkin bocor!). IV tinggi bukan tiket otomatis — cek juga korelasi antar variabel (dua variabel kuat yang berkorelasi = double counting, pilih satu).",
      ],
      formula: String.raw`\text{WoE} = \ln\left(\frac{\%\text{Good}}{\%\text{Bad}}\right) \qquad \text{IV} = \sum (\%\text{Good} - \%\text{Bad}) \times \text{WoE}`,
      formulaNote: "%Good = proporsi nasabah LANCAR yang jatuh di bin ini, dihitung dari total nasabah lancar (bukan dari total bin!). %Bad = proporsi nasabah DEFAULT yang jatuh di bin ini, dari total nasabah default. ln = logaritma natural. WoE = log dari rasio keduanya: positif artinya bin ini dihuni lebih banyak yang lancar (aman), negatif artinya lebih banyak yang macet (berisiko), nol artinya komposisinya persis seperti populasi (tidak informatif). IV = jumlahkan kontribusi tiap bin: (selisih %Good − %Bad) × WoE. Interpretasinya: WoE adalah kompas arah per bin — tanda menunjukkan ke mana risiko menunjuk, besarnya menunjukkan seberapa kuat; IV adalah total daya beda variabel — semakin besar, semakin variabel itu memisahkan good dari bad. Contoh angka dari lesson ini: bin penghasilan \"<3 jt\" berisi 120 orang dengan 36 default. %Bad = 36/150 = 24%; %Good = (120−36)/850 = 84/850 = 9,88%. WoE = ln(0,0988/0,24) = ln(0,4117) = −0,89 — negatif, bin berisiko, sesuai intuisi (penghasilan kecil = risiko lebih tinggi). Kontribusi IV bin ini = (0,0988 − 0,24) × (−0,89) = (−0,1412) × (−0,89) = 0,126. Jumlahkan kelima bin → IV total 0,330: di atas 0,3 berarti variabel penghasilan KUAT sebagai prediktor — tetapi belum tentu boleh dipakai (cek leakage dan korelasi dulu). Satu catatan tepi: rumus ini pecah di dua ujung ekstrem. Jika %Bad = 0 (bin tanpa satu pun default — seperti bin mungil di langkah 8), maka WoE = ln(sesuatu/0) = tidak terdefinisi; jika %Good = 0, WoE = ln(0) = minus takhingga. Software statistik biasanya \"menyelamatkan\" dengan menambah konstanta kecil (misal 0,5 ke tiap sel) — tetapi itu menutupi masalah, bukan menyelesaikannya. Bin dengan 0% bad bukan \"bin sempurna\", melainkan bin yang terlalu kecil untuk dipercaya — solusinya gabungkan bin (langkah 8), bukan tambal rumus. Dan perhatikan asimetri informasi: WoE hanya membandingkan KOMPOSISI relatif terhadap populasi; bin dengan 10.000 orang dan bin dengan 60 orang bisa punya WoE identik −0,89, tetapi kepercayaan kita pada keduanya berbeda jauh. Itulah mengapa aturan ukuran bin minimum (langkah 8) adalah pasangan wajib rumus ini — rumus memberi arah, ukuran sampel memberi kepercayaan.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"IV di atas 0,5 = variabel super, langsung pakai!\" IV >0,5 justru mencurigakan — kemungkinan besar kebocoran target (leakage): variabel yang \"bocor\" dari masa depan, misal \"status collection\" atau \"kolektibilitas 6 bulan setelah pencairan\". Selalu tanya: \"apakah variabel ini tersedia saat pengajuan?\"",
      },
      reference: "Tanda WoE adalah kompas risiko per bin: negatif = berisiko, positif = aman.",
    },
    {
      id: "lab-woe",
      eyebrow: "Langkah 5 · Lab WoE",
      title: "WoE & IV dari nol",
      prose: [
        "Data: 1000 aplikan, variabel PENGHASILAN (5 bin), target default. Total: [120, 210, 300, 230, 140]; yang default: [36, 42, 42, 23, 7]. Tugasmu: hitung WoE bin pertama (\"< 3 jt\") dan IV total variabel penghasilan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `woe_bin0` = ln(dist_good / dist_bad) bin pertama" },
        { id: "t2", text: "Hitung `iv` = jumlah (dist_good − dist_bad) × WoE semua bin" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "woe_bin0=-0.89 iv=0.330",
      hints: [
        "dist_bad = bad/total_bad; dist_good = good/total_good.",
        "Gunakan math.log untuk logaritma natural.",
        "Akumulasikan iv dalam loop tiap bin.",
      ],
      code: {
        starter: `import math\n\nbins = ["< 3 jt", "3-5 jt", "5-10 jt", "10-20 jt", "> 20 jt"]\ntotal = [120, 210, 300, 230, 140]   # jumlah aplikan per bin\nbad   = [36, 42, 42, 23, 7]          # yang default per bin\n\ntot_bad = sum(bad)\ntot_good = sum(total) - tot_bad\n\n# TULIS KODEMU: WoE bin pertama dan IV total\nwoe_bin0 = \niv = \n\nprint(f"woe_bin0={woe_bin0:.2f} iv={iv:.3f}")`,
        lockLines: 7,
        solution: `import math\n\nbins = ["< 3 jt", "3-5 jt", "5-10 jt", "10-20 jt", "> 20 jt"]\ntotal = [120, 210, 300, 230, 140]   # jumlah aplikan per bin\nbad   = [36, 42, 42, 23, 7]          # yang default per bin\n\ntot_bad = sum(bad)\ntot_good = sum(total) - tot_bad\n\n# TULIS KODEMU: WoE bin pertama dan IV total\nwoe_bin0 = math.log(((total[0]-bad[0])/tot_good) / (bad[0]/tot_bad))\niv = 0.0\nfor n, d in zip(total, bad):\n    g = n - d\n    dist_bad, dist_good = d/tot_bad, g/tot_good\n    woe = math.log(dist_good/dist_bad)\n    iv += (dist_good - dist_bad) * woe\n\nprint(f"woe_bin0={woe_bin0:.2f} iv={iv:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "woe_bin0", value: -0.89, tol: 0.01, label: "`woe_bin0` sekitar −0.89", msg: "ln(0.0988/0.24) ≈ −0.89 — bin berisiko." },
          { kind: "equal", task: "t2", name: "iv", value: 0.330, tol: 0.005, label: "`iv` sekitar 0.330", msg: "Jumlahkan kontribusi 5 bin = 0.330 → variabel KUAT." },
          { kind: "stdout_matches", task: "t3", pattern: "woe_bin0=-0\\.89\\s+iv=0\\.330", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "IV 0,330 > 0,3 = kuat. Coba: ubah bad bin pertama jadi 12 — lihat IV runtuh.",
    },
    {
      id: "logistik",
      eyebrow: "Langkah 6 · Regresi logistik",
      title: "Dari WoE ke peluang",
      prose: [
        "Regresi logistik menggabungkan WoE semua variabel menjadi peluang default (PD) via fungsi sigmoid. β₀ = konstanta dasar (risiko rata-rata populasi); β = bobot variabel (makin besar = makin berpengaruh); WoE = nilai bin tempat aplikan jatuh. Sigmoid memaksa hasil ke 0–100% — tidak bisa negatif atau >100%.",
        "Mengapa sigmoid, bukan linear biasa? Peluang harus di rentang 0–100% — linear bisa menghasilkan −20% atau 130% yang tidak bermakna. Sigmoid \"menekuk\" output ke 0–1. Regresi logistik seperti dewan juri — tiap variabel memberi suara (WoE × bobot), ketua (β₀) membuka sidang, sigmoid mengumumkan vonis berupa peluang.",
        "Model contoh: log-odds = −2,5 + 1,2×woe_penghasilan + 0,8×woe_dpd. Koefisien 1,2 artinya penghasilan berpengaruh lebih besar daripada riwayat DPD (0,8) — tetapi keduanya di bawah kendali data, bukan opini.",
      ],
      formula: String.raw`P(\text{default}) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 \cdot \text{WoE}_1 + \beta_2 \cdot \text{WoE}_2 + \cdots)}}`,
      formulaNote: "β₀ (beta nol) = intercept: log-odds default untuk aplikan \"rata-rata\" — titik awal sebelum variabel berbicara. β₁, β₂, … = koefisien: bobot pengaruh tiap variabel; makin besar nilai mutlaknya, makin besar suaranya dalam keputusan. WoE₁, WoE₂, … = nilai WoE dari bin tempat aplikan TERSEBUT jatuh (bukan WoE rata-rata — personal!). e = bilangan Euler ≈ 2,718, basis logaritma natural. Sigmoid 1/(1+e^(−x)) = fungsi yang menekuk garis bilangan menjadi rentang 0–1. Interpretasinya: tiap variabel memberi \"suara\" (koefisien × WoE), dijumlahkan dengan suara dasar β₀ menjadi log-odds, lalu sigmoid menerjemahkannya menjadi peluang 0–100%. Log-odds −3 ≈ peluang 4,7% (aman); log-odds 0 = peluang 50%; log-odds +2 ≈ 88% (gawat). Contoh angka: model log-odds = −2,5 + 1,2×woe_penghasilan + 0,8×woe_dpd. Aplikan dengan woe_penghasilan 0,62 dan woe_dpd 0,50 → log-odds = −2,5 + 0,744 + 0,40 = −1,356 → PD = 1/(1 + e^1,356) = 1/(1 + 3,879) = 0,2049 = 20,49%. Perhatikan: kedua WoE positif (bin aman) tetapi PD tetap 20% — karena β₀ = −2,5 menetapkan \"risiko dasar\" populasi yang cukup tinggi; WoE positif hanya meredam, bukan menghapus. Inilah mengapa intercept tidak boleh diabaikan: ia adalah ingatan model tentang seberapa berisiko populasi secara keseluruhan.",
      tasks: [],
      reference: "Koefisien kecil = variabel kurang berpengaruh. Coba: ubah 1,2 jadi 0,2 — profil 1 vs 2 jadi mirip.",
    },
    {
      id: "lab-logistik",
      eyebrow: "Langkah 7 · Lab Logistik",
      title: "Regresi logistik mini",
      prose: [
        "Model: log-odds = −2,5 + 1,2×woe_penghasilan + 0,8×woe_dpd. Fungsi predict sudah disediakan (terkunci). Tugasmu: hitung PD dua profil — Profil 1: predict(0,62, 0,50); Profil 2: predict(−0,32, −0,70) — dalam persen.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pd_profil1` (%) = predict(0.62, 0.50) × 100" },
        { id: "t2", text: "Hitung `pd_profil2` (%) = predict(-0.32, -0.70) × 100" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "profil1=20.49 profil2=3.09",
      hints: [
        "Fungsi predict mengembalikan peluang desimal — kalikan 100.",
        "Panggil predict dengan dua angka WoE tiap profil.",
        "pd_profil1 = predict(0.62, 0.50) * 100",
      ],
      code: {
        starter: `import math\n\ndef predict(woe_penghasilan, woe_dpd):\n    log_odds = -2.5 + 1.2 * woe_penghasilan + 0.8 * woe_dpd\n    pd = 1 / (1 + math.exp(-log_odds))\n    return pd\n\n# TULIS KODEMU: PD dua profil, dalam %\npd_profil1 = \npd_profil2 = \n\nprint(f"profil1={pd_profil1:.2f} profil2={pd_profil2:.2f}")`,
        lockLines: 6,
        solution: `import math\n\ndef predict(woe_penghasilan, woe_dpd):\n    log_odds = -2.5 + 1.2 * woe_penghasilan + 0.8 * woe_dpd\n    pd = 1 / (1 + math.exp(-log_odds))\n    return pd\n\n# TULIS KODEMU: PD dua profil, dalam %\npd_profil1 = predict(0.62, 0.50) * 100\npd_profil2 = predict(-0.32, -0.70) * 100\n\nprint(f"profil1={pd_profil1:.2f} profil2={pd_profil2:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pd_profil1", value: 20.49, tol: 0.05, label: "`pd_profil1` sekitar 20.49", msg: "predict(0.62, 0.50) × 100 ≈ 20.49." },
          { kind: "equal", task: "t2", name: "pd_profil2", value: 3.09, tol: 0.05, label: "`pd_profil2` sekitar 3.09", msg: "predict(-0.32, -0.70) × 100 ≈ 3.09." },
          { kind: "stdout_matches", task: "t3", pattern: "profil1=20\\.49\\s+profil2=3\\.09", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Sigmoid: 1/(1+e^(−log_odds)) — selalu di rentang 0–1.",
    },
    {
      id: "jebakan-bin",
      eyebrow: "Langkah 8 · Binning",
      title: "Ketika keranjangnya yang rusak",
      prose: [
        "Binning terlihat mekanis — potong variabel, hitung WoE, selesai. Praktiknya, di sinilah model scorecard paling sering rusak dengan cara yang elegan. Jebakan pertama: pola zig-zag. Lihat WoE lima bin penghasilan ini: −0,89, +0,15, −0,42, +0,61, +0,88. Bin 2 aman (+0,15), bin 3 tiba-tiba berisiko (−0,42), bin 4 aman lagi (+0,61). Apakah risiko benar-benar naik-turun seperti itu seiring penghasilan naik? Hampir pasti tidak — ini artefak bin yang terlalu kecil: bin 3 hanya berisi 40 orang dengan 12 default, sehingga beberapa default kebetulan mengubah tandanya. Model yang memakai bin ini akan \"belajar\" pola palsu dan menghukum aplikan berpenghasilan 5–10 juta tanpa alasan. Cara benar: gabungkan bin 2 dan 3 (atau perlebar batasnya) sampai pola WoE monoton — risiko turun teratur seiring penghasilan naik: −0,89, −0,31, −0,31, +0,61, +0,88. Aturannya: WoE antar bin yang berurutan harus bercerita dengan logika bisnis; jika tidak, yang rusak adalah keranjangnya, bukan dunianya.",
        "Jebakan kedua: bin mungil yang menghafal kebetulan. Bin \"penghasilan >50 juta\" berisi 8 orang, 0 default. Hitung WoE-nya: %Bad = 0/150 = 0 → ln(sesuatu/0) = tidak terdefinisi (atau +takhingga jika dipaksakan). Secara matematis ini \"bin paling aman sedunia\"; secara statistik ini lelucon — 8 orang tanpa default tidak membuktikan apa-apa. Model akan memberi skor fantastis ke semua aplikan berpenghasilan >50 juta, lalu terkejut saat yang kesembilan default. Aturan praktis industri: tiap bin minimum 5% populasi (dari 1.000 aplikan = 50 orang) DAN minimum ~20 kejadian bad. Di bawah itu, gabungkan dengan bin tetangga yang paling mirip risikonya — jangan pernah membiarkan bin \"sempurna\" lolos ke produksi. Ini adalah overfitting dalam bentuknya yang paling sederhana: bukan model yang terlalu kompleks, melainkan keranjang yang terlalu kecil.",
        "Jebakan ketiga — yang paling kontra-intuitif: mengisi missing value sebelum binning. Insting analis: \"penghasilan kosong = data kotor, isi dengan rata-rata (Rp 7 juta)\". Akibatnya: 120 aplikan tanpa data penghasilan masuk bin \"5–10 jt\", mengencerkan sinyal bin itu DAN menghapus sinyal paling berharga. Faktanya, di banyak portofolio Indonesia, bin \"penghasilan kosong\" justru paling prediktif: default rate 22% vs rata-rata 15% → WoE −1,2, lebih ekstrem dari bin \"<3 jt\". Mengapa? Karena \"tidak mengisi penghasilan\" berkorelasi dengan pekerjaan informal, keengganan diverifikasi, atau aplikasi asal-asalan — semuanya sinyal risiko yang nyata. Cara benar: jadikan missing sebagai bin tersendiri (\"Tidak mengisi\") dan biarkan WoE-nya berbicara. Cara salah yang umum: imputasi rata-rata — ia tidak \"membersihkan\" data, ia mencampur dua populasi berbeda (yang berpenghasilan 7 juta vs yang menyembunyikan penghasilannya) ke satu keranjang, dan model kehilangan kemampuan membedakannya. Prinsipnya: missing bukan ketiadaan informasi — missing ADALAH informasi.",
        "Ketiga jebakan ini punya akar yang sama: binning diperlakukan sebagai langkah administratif (\"bagi rata saja\"), bukan sebagai keputusan pemodelan. Padahal binning adalah tempat judgment bisnis bertemu statistik — dan ia menentukan batas atas kualitas seluruh scorecard: regresi logistik sebagus apapun tidak bisa memperbaiki bin yang rusak (garbage in, gospel out — model akan mengkhotbahkan kebohongan dengan percaya diri). Daftar periksa sebelum lanjut ke regresi: (1) setiap bin ≥5% populasi dan ≥20 bad; (2) pola WoE monoton atau punya penjelasan bisnis yang tertulis; (3) missing menjadi bin sendiri; (4) tidak ada bin \"sempurna\" (0% atau 100% bad); (5) batas bin dibulatkan ke angka yang bisa dijelaskan ke bisnis (\"<3 jt\", bukan \"<2,847 jt\" — cut point 2,847 adalah artefak algoritma, bukan kebijakan). Binning optimal otomatis (decision tree) boleh dipakai untuk usulan awal, tetapi keputusan final selalu ditinjau manusia — karena hanya manusia yang tahu bahwa \"penghasilan 5–10 jt\" adalah bahasa yang dimengerti komite, sedangkan \"5,000,001–9,999,999\" bukan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Model tidak membaca angka — ia membaca keranjang",
        body: "Setelah regresi dilatih, tidak ada yang mengingat angka mentah penghasilan Rp 7,3 juta. Yang diingat model hanyalah: \"bin 5–10 jt, WoE −0,31\". Seluruh kecerdasan scorecard diringkas menjadi daftar keranjang dan label risikonya. Heuristiknya: nilai kualitas binning bukan dari IV-nya, melainkan dari ceritanya — bisakah kamu menjelaskan kepada RM, dalam satu kalimat per bin, MENGAPA bin ini lebih berisiko dari tetangganya? Jika jawabannya \"karena datanya begitu\", berhentilah: itu bukan penjelasan, itu penyerahan pada kebetulan. Bin yang baik punya cerita bisnis (\"penghasilan di bawah UMR = buffer tipis terhadap guncangan\"); bin yang buruk hanya punya angka. Dan waspadai kombinasi paling berbahaya: IV tinggi + cerita aneh. Itu hampir selalu berarti salah satu dari dua hal — kebocoran target (variabel dari masa depan) atau artefak bin kecil. Keduanya terlihat \"hebat\" di metrik dan hancur di produksi. Analis senior membaca binning seperti editor membaca naskah: bukan menghitung kata, melainkan bertanya \"apakah paragraf ini masuk akal?\" untuk setiap keranjang.",
      },
      reference: "Binning = keputusan pemodelan, bukan administrasi. Cerita per bin > IV per variabel.",
    },
    {
      id: "minicase-leakage",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Variabel ajaib Rp 50 miliar",
      prose: [
        "Fintech pindar \"DanaKilat\" menyalurkan KTA online Rp 50 miliar per bulan. Tim data science-nya bangga: scorecard baru dengan Gini 0,81 — jauh di atas standar industri 0,5–0,6. Variabel bintangnya: \"rata_keterlambatan_tagihan_3bln\" dengan IV 1,15 — tertinggi dari 40 variabel, \"prediktor super\". Direksi menyetujui peluncuran. Tiga bulan kemudian: NPL melonjak dari 4% ke 11%. CKPN tambahan Rp 38 miliar menggerus modal. Investigasi independen menemukan definisi variabel bintang itu: rata-rata hari keterlambatan tagihan pada 3 bulan SETELAH pencairan — dihitung dari data collection. Di data training, ia memisahkan dengan sempurna: nasabah lancar rata-rata terlambat 0,2 hari; yang default 18,5 hari. Tentu saja — variabel ini BUKAN prediktor, melainkan akibat yang dicatat belakangan. Saat pengajuan (satu-satunya momen ketika scorecard dipakai), variabel ini belum ada — kosong untuk semua aplikan.",
        "Inilah leakage dalam bentuk paling murni: model \"memprediksi\" default menggunakan informasi yang hanya tersedia SETELAH default terjadi. Di training, Gini 0,81 — angka yang membuat semua orang berhenti bertanya. Di produksi, variabel ajaib itu null untuk semua orang, model jatuh kembali ke variabel-variabel biasa yang tidak pernah divalidasi dengan benar — Gini aktual 0,47, nyaris acak. Kerugiannya berlapis: Rp 38 miliar CKPN tambahan, ditambah 3 bulan menyalurkan Rp 150 miliar kredit dengan mesin ACC yang buta. Cara salah yang umum: \"tambahkan variabelnya dengan bobot kecil saja\" atau \"isi null-nya dengan rata-rata\". Keduanya tidak menyembuhkan apa-apa — variabel dari masa depan tidak bisa dijinakkan, hanya bisa dibuang. Cara benar — empat langkah audit timing yang seharusnya dilakukan SEBELUM training: (1) untuk setiap variabel, tulis kapan tepatnya nilainya tersedia dalam alur bisnis (saat pengajuan? saat verifikasi? setelah pencairan?); (2) variabel yang tersedia setelah momen keputusan = buang, tanpa diskusi; (3) curigai otomatis setiap IV > 0,5 — bukan dirayakan, melainkan diaudit; (4) validasi out-of-time dengan simulasi \"data yang benar-benar tersedia saat itu\" (bukan snapshot database hari ini yang sudah tercemar masa depan).",
        "Setelah variabel ajaib dibuang dan model dibangun ulang hanya dari variabel yang tersedia saat pengajuan, Gini \"jujur\"-nya 0,58 — tidak spektakuler, tetapi nyata. Dengan cut-off yang dikalibrasi ulang, NPL kembali ke 4,5% dalam dua kuartal. Pelajaran yang dibayar Rp 38 miliar: Gini 0,81 yang membuat semua orang berhenti bertanya adalah justru alasan untuk bertanya lebih keras. Aturan keputusan untuk tim modeling: tidak ada variabel yang masuk training sebelum \"sertifikat ketersediaan\"-nya ditandatangani — satu baris dokumen per variabel: nama, sumber, momen ketersediaan, penanggung jawab. Dan untuk validator: pertanyaan pertama bukan \"berapa Gini-nya?\" melainkan \"apakah kamu yakin semua variabel ini sudah ada saat keputusan dibuat?\" — karena leakage tidak terlihat dari metrik, hanya dari pemahaman proses bisnis. Model terbaik yang bocor lebih berbahaya dari model jelek yang jujur: yang pertama membuatmu percaya diri sambil berjalan ke jurang.",
        "Leakage punya sepupu yang lebih sulit ditangkap: variabel yang tersedia saat pengajuan, tetapi DEFINISINYA tercemar masa depan. Contoh dari multifinance pembiayaan motor: variabel \"dpd_maks_12bln\" (keterlambatan maksimum 12 bulan terakhir) — tersedia di SLIK saat pengajuan, lolos audit timing. Tetapi untuk nasabah BARU (belum pernah kredit), nilainya diisi 0 — sama persis dengan nasabah lama yang tidak pernah terlambat. Model belajar \"dpd_maks = 0 → aman\", lalu memberi skor tinggi ke ribuan nasabah baru tanpa riwayat — padahal \"0 karena tidak ada data\" dan \"0 karena tidak pernah terlambat\" adalah dua populasi berbeda (persis jebakan missing di langkah 8!). Akibatnya: NPL segmen new-to-credit 3x lipat dari proyeksi. Perbaikannya: pisahkan menjadi dua variabel — flag \"punya_riwayat\" (ya/tidak) + \"dpd_maks\" hanya untuk yang punya riwayat. Pelajaran gabungannya: audit leakage tidak berhenti di pertanyaan \"kapan tersedia?\" — lanjutkan dengan \"apakah DEFINISI nilainya sama untuk semua populasi?\" Variabel yang lolos audit pertama bisa gagal di audit kedua. Validator senior selalu meminta distribusi variabel per segmen (baru vs lama, verified vs unverified): leakage dan definisi ganda hampir selalu meninggalkan jejak di sana — paku yang menonjol di distribusi yang seharusnya mulus.",
      ],
      tasks: [],
      reference: "Gini 0,81 yang membuat semua orang berhenti bertanya = alasan untuk bertanya lebih keras.",
    },
    {
      id: "korelasi-ganda",
      eyebrow: "Langkah 10 · Double counting",
      title: "Dua saksi yang sama",
      prose: [
        "Di langkah WoE, korelasi antar variabel disebut sekilas: dua variabel kuat yang berkorelasi = double counting, pilih satu. Ini layak pendalaman karena ia adalah bug yang tidak terlihat dari metrik manapun — model tetap \"lolos\" semua uji, tetapi rapuh. Contoh nyata dari portofolio kartu kredit: variabel A \"jumlah_kartu_kredit_aktif\" (IV 0,28 — kuat) dan variabel B \"total_limit_kartu_kredit\" (IV 0,31 — kuat). Keduanya lolos semua filter: IV bagus, WoE monoton, tersedia saat pengajuan. Korelasi Pearson keduanya: 0,85 — sangat tinggi, wajar: orang dengan banyak kartu cenderung punya total limit besar. Analis junior memasukkan keduanya (\"dua-duanya kuat, kenapa tidak?\"). Model training: Gini 0,62 — bagus. Semua orang senang. Lalu model diproduksi.",
        "Masalahnya muncul pelan-pelan. Pertama, koefisien yang tidak masuk akal: model memberi koefisien +0,9 untuk A tetapi −0,4 untuk B. Artinya: semakin besar total limit kartu, semakin AMAN menurut model — padahal logika bisnis dan WoE univariat B berkata sebaliknya (limit besar = risiko lebih tinggi). Ini tanda klasik multikolinearitas: dua variabel berebut menjelaskan variasi yang sama, dan matematika \"menyelesaikan\" perebutan dengan memberi satu koefisien positif dan satu negatif — seperti dua saksi yang saling meniadakan kesaksian. Kedua, kontribusi yang tidak bertambah: model dengan A saja → Gini out-of-time 0,550; model dengan A+B → Gini out-of-time 0,556. Kenaikan 0,006 — noise statistik, bukan sinyal. B tidak menambah informasi baru; ia hanya menambah parameter yang bisa goyang. Ketiga, kerapuhan: enam bulan kemudian, satu bank penerbit mengubah kebijakan limitnya (limit awal diturunkan untuk segmen muda). Distribusi B bergeser sedikit — tetapi karena koefisien B negatif dan besar, skor ribuan aplikan berubah drastis tanpa alasan risiko yang nyata. Model yang memakai A saja hampir tidak terpengaruh.",
        "Cara salah yang umum: \"WoE kan sudah menstandardisasi — korelasi tidak masalah lagi.\" Salah total. Transformasi WoE mengubah skala tiap variabel, tetapi TIDAK mengubah hubungan antar variabel: dua variabel yang berkorelasi 0,85 dalam bentuk mentah tetap berkorelasi ~0,85 dalam bentuk WoE — keranjangnya beda, isinya orang yang sama. Cara benar — protokol tiga langkah sebelum regresi: pertama, hitung matriks korelasi (Pearson untuk WoE numerik) semua kandidat variabel; kedua, untuk setiap pasangan dengan |r| > 0,7, pilih SALAH SATU dengan kriteria berurutan: (a) IV lebih tinggi, (b) definisi lebih stabil dan murah didapat (data SLIK > data scraping), (c) lebih mudah dijelaskan ke regulator dan bisnis; ketiga, dokumentasikan variabel yang dibuang dan alasannya — validator akan bertanya \"kenapa B tidak dipakai padahal IV-nya 0,31?\" dan \"karena korelasi 0,85 dengan A\" adalah jawaban yang membuat validator mengangguk. Pengecualian langka: jika kedua variabel mengukur aspek yang benar-benar berbeda secara bisnis (misal \"tenor\" vs \"bunga\" — berkorelasi tetapi mekanismenya beda), boleh dicoba keduanya DENGAN catatan: pantau stabilitas koefisien tiap validasi berkala; tanda berbalik = keluarkan satu. Aturan praktisnya: scorecard yang baik seperti tim yang baik — anggotanya saling melengkapi, bukan saling menduplikasi. Sepuluh variabel yang independen mengalahkan dua puluh variabel yang saling menggemakan.",
      ],
      tasks: [],
      reference: "Korelasi |r| > 0,7 → pilih satu. WoE tidak menyembuhkan korelasi.",
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
        "Scorecard = 5C yang dikuantifikasi: prediksi PD 12 bulan → skor → keputusan vs cut-off.",
        "Binning menangkap non-linearitas, robust outlier, missing jadi bin informatif.",
        "WoE: tanda = kompas risiko per bin. IV: <0,02 sampah · 0,1–0,3 sedang · >0,3 kuat · >0,5 curigai leakage.",
        "Regresi logistik + sigmoid: peluang selalu 0–100%.",
        "Dua variabel kuat yang berkorelasi tinggi → pilih satu (hindari double counting).",
      ],
      next: { label: "CR7B — Application Scorecard 2", href: "/learn/cr7b-application-scorecard-2" },
      quiz: [
        {
          q: "Bin penghasilan '<3 jt': WoE = −0,89. Artinya?",
          options: [
            { text: "Bin ini aman — WoE negatif berarti bagus", why: "Terbalik: dengan konvensi ini, negatif = lebih banyak bad." },
            { text: "Bin ini berisiko — proporsi default di sini lebih tinggi dari populasi (WoE negatif = 'lebih banyak bad')", why: "Tanda WoE adalah kompas risiko per bin.", correct: true },
            { text: "WoE negatif = error hitung", why: "WoE negatif sah dan informatif." },
            { text: "Tidak ada artinya", why: "Justru sangat berarti: −0,89 adalah sinyal risiko kuat." },
          ],
        },
        {
          q: "Variabel dengan IV = 0,68. Reaksi pertama yang benar?",
          options: [
            { text: "Langsung pakai — jackpot!", why: "Terlalu bagus = curigai dulu." },
            { text: "Curiga leakage — audit apakah variabel tersedia saat pengajuan sebelum merayakan", why: "IV >0,5 = terlalu bagus, curigai bocor. Variabel 'ajaib' hampir selalu adalah akibat, bukan prediktor.", correct: true },
            { text: "Buang — terlalu tinggi", why: "Jangan langsung buang — audit dulu; kalau legitimate, itu emas." },
            { text: "Kecilkan bin-nya", why: "Bukan soal ukuran bin — soal timing ketersediaan." },
          ],
        },
        {
          q: "Mengapa scorecard memakai binning + WoE, bukan angka mentah langsung ke regresi?",
          options: [
            { text: "Supaya terlihat canggih", why: "Bukan soal penampilan." },
            { text: "Menangkap non-linearitas, robust terhadap outlier, dan missing bisa jadi bin sendiri yang informatif", why: "Tiga alasan praktis itu. Hubungan risiko jarang linear.", correct: true },
            { text: "Regulasi melarang angka mentah", why: "Tidak ada larangan seperti itu." },
            { text: "Binning mempercepat komputer", why: "Bukan alasan utamanya." },
          ],
        },
        {
          q: "Dalam regresi logistik, mengapa dipakai fungsi sigmoid (bukan linear biasa)?",
          options: [
            { text: "Sigmoid lebih cepat dihitung", why: "Bukan soal kecepatan." },
            { text: "Peluang harus di rentang 0–100% — linear bisa menghasilkan −20% atau 130% yang tidak bermakna", why: "Sigmoid 'menekuk' output ke 0–1. Peluang −20% adalah omong kosong matematis.", correct: true },
            { text: "Regulator mewajibkan sigmoid", why: "Tidak ada kewajiban seperti itu." },
            { text: "Tidak ada alasan khusus", why: "Ada: rentang output peluang." },
          ],
        },
        {
          q: "Variabel 'kolektibilitas 6 bulan setelah pencairan' punya IV 1,2 — tertinggi dari semua variabel. Tindakanmu?",
          options: [
            { text: "Langsung pakai — IV tertinggi = variabel terbaik", why: "IV tertinggi + dari masa depan = leakage klasik." },
            { text: "Buang — ini leakage: tidak tersedia saat keputusan aplikasi dibuat", why: "Model akan terlihat sempurna di data latih dan hancur di produksi. Selalu audit timing ketersediaan variabel.", correct: true },
            { text: "Pakai dengan bobot setengah", why: "Leakage tidak bisa diakali dengan bobot setengah." },
            { text: "Tanyakan ke direksi", why: "Ini keputusan metodologi, bukan direksi." },
          ],
        },
        {
          q: "Dua bin penghasilan bertetangga punya WoE +0,61 lalu −0,42 (pola zig-zag). Tindakan yang benar?",
          options: [
            { text: "Biarkan — model akan menangani non-linearitas", why: "Model tidak bisa membedakan pola nyata dari artefak; ia akan menghafal zig-zag sebagai kebenaran." },
            { text: "Curigai artefak bin kecil: gabungkan bin atau perlebar batas sampai pola WoE monoton/bercerita logis — risiko yang nyata umumnya berubah teratur", why: "Zig-zag hampir selalu = bin terlalu kecil, bukan pola ekonomi yang sebenarnya.", correct: true },
            { text: "Hapus kedua bin dari model", why: "Membuang data karena malas memperbaiki keranjangnya — sinyalnya nyata, wadahnya yang rusak." },
            { text: "Pecah lagi menjadi bin yang lebih kecil agar detail", why: "Memperkecil bin memperparah artefak — arah yang benar adalah menggabungkan, bukan memecah." },
          ],
        },
        {
          q: "Variabel A (IV 0,28) dan B (IV 0,31) berkorelasi 0,85. Keduanya dimasukkan ke regresi; koefisien B menjadi negatif padahal WoE univariat B menunjukkan risiko naik. Diagnosis dan tindakan?",
          options: [
            { text: "Normal — koefisien negatif artinya B menurunkan risiko", why: "Bertentangan dengan WoE univariat B; tanda berbalik adalah gejala, bukan temuan." },
            { text: "Multikolinearitas: A dan B berebut menjelaskan variasi yang sama — keluarkan salah satu (|r|>0,7), pilih berdasar IV, stabilitas definisi, dan kemudahan penjelasan", why: "Gini hanya naik 0,006 dengan B — ia tidak menambah informasi, hanya menambah kerapuhan.", correct: true },
            { text: "Naikkan IV threshold agar B gugur", why: "Mengubah threshold untuk mengusir satu variabel = memanipulasi aturan; masalahnya korelasi, bukan IV." },
            { text: "Tambah variabel C yang berkorelasi juga agar seimbang", why: "Menambah duplikasi tidak menyeimbangkan apa-apa — memperparah kerapuhan." },
          ],
        },
      ],
    },
  ],
};
