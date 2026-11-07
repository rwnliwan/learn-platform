import type { V2Lesson } from "../lib/types";

export const pma10b: V2Lesson = {
  slug: "pm-a10b-IPS-risiko",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A10B Portfolio Management: IPS, Manajemen Risiko & Rebalancing",
  estMinutes: 60,
  steps: [
    {
      id: "ips-kerangka",
      eyebrow: "Langkah 1 · Kerangka IPS",
      title: "IPS: diagnosis tertulis sebelum resep investasi",
      prose: [
        "PM-A10 memperkenalkan IPS sebagai jangkar anti-bias: satu dokumen tertulis berisi tujuan, toleransi risiko, horizon, likuiditas, pajak, dan regulasi. Lesson ini menyusunnya secara sistematis dengan kerangka RR dan TTLLU. RR adalah objectives: Return (return yang dibutuhkan) dan Risk (risiko yang bersedia dan mampu ditanggung). TTLLU adalah constraints: Time horizon, Tax, Liquidity, Legal, dan Unique circumstances. Objectives menjawab mau ke mana; constraints menjawab apa yang membatasi perjalananmu.",
        "Return objective ditentukan oleh kebutuhan, bukan oleh keinginan. Seorang pensiunan yang butuh penarikan 5 persen per tahun dari portofolionya ditambah inflasi 3 persen membutuhkan return nominal sekitar 8 persen — angka itu berasal dari aritmetika kebutuhan hidupnya, bukan dari target pasar saham. Risk objective punya dua sisi yang sering bertikai: ability (kemampuan menanggung risiko — ditentukan horizon panjang, penghasilan stabil, dan tidak ada kebutuhan likuiditas mendesak) dan willingness (kesediaan psikologis menanggung risiko — ditentukan pengalaman dan temperamen). Bila ability tinggi tetapi willingness rendah, willingness yang menang dalam penentuan kebijakan: portofolio yang membuat klien tidak bisa tidur adalah portofolio yang salah, seberapa pun benarnya secara matematis.",
        "Constraints TTLLU adalah tempat IPS menjadi konkret. Time: horizon 20 tahun berarti portofolio bisa menahan volatilitas saham; horizon 2 tahun berarti tidak. Tax: pajak atas dividen dan capital gain mengubah return setelah pajak — dan penempatan aset antar rekening kena pajak dan tidak kena pajak adalah keputusan alokasi tersendiri. Liquidity: kebutuhan kas dalam waktu dekat harus dikeluarkan dari portofolio berisiko. Legal: dana pensiun dan yayasan punya batasan regulasi yang mengikat. Unique: pantangan etis, konsentrasi saham perusahaan tempat bekerja, atau warisan yang tidak boleh dijual. IPS yang baik menulis semuanya dalam satu halaman yang bisa dibaca dalam lima menit — bila IPS-mu butuh 40 halaman, tidak ada yang akan membacanya saat pasar panik, dan saat itulah ia paling dibutuhkan. Bobot CFA L1 untuk Portfolio Management umumnya berada pada rentang 5 sampai 8 persen (ilustratif sebagai rentang bobot yang dipublikasikan).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menentukan return objective dari keinginan (saya mau 20 persen per tahun) bukan dari kebutuhan. Return yang dibutuhkan berasal dari aritmetika tujuan hidup; bila angkanya tidak tercapai dengan risiko yang wajar, jawabannya adalah menabung lebih banyak atau menunda tujuan — bukan mengambil risiko lebih besar.",
      },
      reference: "RR = Return dan Risk objectives. TTLLU = Time, Tax, Liquidity, Legal, Unique. Willingness mengalahkan ability bila bertikai.",
    },
    {
      id: "ips-contoh",
      eyebrow: "Langkah 2 · Contoh Investor",
      title: "IPS Dina: dari angka kebutuhan ke alokasi",
      prose: [
        "Contoh ilustratif: Dina, 40 tahun, karyawan swasta berpenghasilan stabil, berencana pensiun di usia 60 tahun. Ia menghitung kebutuhan dananya: untuk mempertahankan gaya hidup, ia membutuhkan return nominal 9 persen per tahun. Dengan risk-free rate 4 persen dan premi risiko pasar 5 persen, CAPM menyiratkan beta portofolio sekitar 1,0 — (9 dikurangi 4) dibagi 5 = 1,0. Artinya targetnya setara dengan risiko pasar secara keseluruhan: ambisius tetapi tidak gila. Bila targetnya 12 persen, beta yang dibutuhkan adalah 1,6 — dan Dina harus ditanya apakah ia sungguh bersedia menanggung ayunan sebesar itu.",
        "Constraints Dina: Time horizon 20 tahun sampai pensiun, lalu 25 tahun masa pensiun — horizon panjang yang mendukung saham. Tax: ia berada pada tarif pajak yang membuat penempatan obligasi di rekening kena pajak menjadi tidak efisien — obligasi lebih baik di rekening pensiun yang ditangguhkan pajaknya. Liquidity: ia butuh 50 juta rupiah dalam 2 tahun untuk uang muka rumah — dana itu dikeluarkan dari portofolio berisiko dan disimpan di deposito. Legal: tidak ada batasan khusus. Unique: ia memegang saham perusahaan tempatnya bekerja senilai 20 persen portofolionya — konsentrasi yang mengikat gajinya dan investasinya pada satu nasib, sehingga IPS menetapkan rencana penjualan bertahap.",
        "Dari IPS ini lahir kebijakan alokasi: 60 persen saham, 40 persen obligasi, dengan saham perusahaan tempat bekerja dijual bertahap sampai di bawah 5 persen portofolio. Perhatikan urutannya: IPS dulu, alokasi kemudian. Manajer yang menawarkan alokasi sebelum membaca IPS sedang menjual produk, bukan memberi nasihat. Dan IPS Dina bukan dokumen mati: ia direview tiap ada perubahan hidup — bukan tiap ada gejolak pasar.",
      ],
      formula: String.raw`\beta_{\text{implisit}} = \frac{R_{\text{target}} - R_f}{E(R_m) - R_f}`,
      formulaNote: "R_target = return yang dibutuhkan (9%); R_f = risk-free rate (4%); E(R_m) dikurangi R_f = premi risiko pasar (5%). Interpretasi: rumus CAPM dibalik — dari target return, kita membaca beta yang dibutuhkan, lalu menilai apakah risiko itu wajar bagi investor. Contoh angka (ilustratif): (9 dikurangi 4) dibagi 5 = 1,0 — setara risiko pasar.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Konsentrasi saham perusahaan tempat bekerja adalah risiko ganda: bila perusahaan bermasalah, Dina kehilangan gaji dan investasi sekaligus. IPS yang baik menetapkan batas konsentrasi dan rencana penjualan bertahap — sebelum krisis, bukan sesudahnya.",
      },
      reference: "Return dari kebutuhan, beta implisit dari CAPM terbalik, alokasi lahir dari IPS — bukan sebaliknya.",
    },
    {
      id: "var",
      eyebrow: "Langkah 3 · Value at Risk",
      title: "VaR: tiga cara menjawab 'seberapa buruk besok?'",
      prose: [
        "Value at Risk menjawab satu pertanyaan: berapa kerugian maksimum yang diharapkan tidak terlampaui dengan tingkat kepercayaan tertentu dalam horizon tertentu? VaR 95 persen harian 33 juta rupiah berarti: pada 95 persen hari, kerugian tidak melebihi 33 juta; pada 5 persen hari — sekitar satu hari dari dua puluh — kerugian bisa melebihi itu, dan VaR tidak mengatakan seberapa besar kelebihannya. Kalimat terakhir itu adalah kelemahan VaR yang paling berbahaya: ia diam tentang ekor.",
        "Tiga metode menghitungnya. Pertama, parametrik (variance-covariance): asumsikan return berdistribusi normal dengan mean dan standar deviasi yang diketahui, lalu kalikan z-score dengan standar deviasi dan nilai portofolio. Contoh ilustratif: portofolio 1.000 juta rupiah, standar deviasi harian 2 persen, mean nol. VaR 95 persen = 1,65 dikali 0,02 dikali 1.000 = 33 juta rupiah; VaR 99 persen = 2,33 dikali 0,02 dikali 1.000 = 46,6 juta rupiah. Cepat dan sederhana — tetapi buta terhadap fat tail karena mengasumsikan normal. Kedua, historis: urutkan return historis dan ambil persentil ke-5 — tanpa asumsi distribusi, tetapi buta terhadap masa depan yang belum pernah terjadi. Ketiga, Monte Carlo: simulasikan ribuan skenario dari model dan ambil persentilnya — paling fleksibel, tetapi hasilnya hanya sebagus model dan asumsinya.",
        "Pelengkap wajib VaR adalah Expected Shortfall: rata-rata kerugian PADA hari-hari ketika VaR terlampaui. Bila VaR 95 persen adalah 33 juta tetapi Expected Shortfall adalah 70 juta, maka pada hari buruk yang sesungguhnya kamu rata-rata rugi 70 juta — bukan 33 juta. Regulator dan manajer risiko modern lebih memperhatikan Expected Shortfall justru karena ia tidak diam tentang ekor. Aturan praktis: laporkan keduanya berdampingan — VaR untuk ambang sehari-hari, Expected Shortfall untuk hari bencana.",
      ],
      formula: String.raw`VaR_{95\%} = z_{95\%} \times \sigma \times V \quad;\quad z_{95\%} = 1{,}65 \quad;\quad z_{99\%} = 2{,}33`,
      formulaNote: "z = skor normal untuk tingkat kepercayaan; sigma = standar deviasi harian (2%); V = nilai portofolio (1.000 juta rupiah, ilustratif). Interpretasi: VaR adalah ambang kerugian — bukan kerugian maksimum. Contoh angka: VaR 95% = 1,65 dikali 0,02 dikali 1.000 = 33 juta rupiah; VaR 99% = 2,33 dikali 0,02 dikali 1.000 = 46,6 juta rupiah.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "VaR diam tentang ekor: VaR 95 persen 33 juta tidak berarti kerugian maksimum 33 juta — pada 5 persen hari terburuk, kerugian bisa jauh lebih besar. Selalu dampingi dengan Expected Shortfall dan stress test.",
      },
      quiz: [
        {
          q: "VaR 95 persen harian portofoliomu adalah 33 juta rupiah. Pernyataan yang benar?",
          options: [
            { text: "Kerugian maksimum besok adalah 33 juta", why: "Salah: VaR bukan batas maksimum — pada 5 persen hari, kerugian bisa melebihi 33 juta tanpa batas yang dikatakan VaR." },
            { text: "Pada 95 persen hari, kerugian tidak melebihi 33 juta; pada 5 persen hari bisa lebih, dan VaR tidak mengatakan seberapa besar", why: "Benar: VaR adalah ambang persentil, bukan plafon kerugian — ekornya tetap tidak terukur.", correct: true },
            { text: "Kamu pasti rugi 33 juta besok", why: "Salah: VaR adalah ambang statistik, bukan prediksi kerugian besok." },
            { text: "Portofolio aman — VaR kecil berarti risiko kecil", why: "Salah: VaR kecil pada tingkat kepercayaan 95 persen tidak mengatakan apa-apa tentang 5 persen hari terburuk." },
          ],
        },
        {
          q: "Metode VaR mana yang tidak mengasumsikan distribusi normal?",
          options: [
            { text: "Parametrik — memakai z-score dari kurva normal", why: "Salah: parametrik justru mengasumsikan normal — itulah kelemahannya terhadap fat tail." },
            { text: "Historis — mengambil persentil langsung dari return masa lalu", why: "Benar: historis tidak mengasumsikan distribusi apa pun; kelemahannya adalah masa depan bisa lebih buruk dari sejarah.", correct: true },
            { text: "Monte Carlo — mensimulasikan dari distribusi normal", why: "Salah: Monte Carlo mensimulasikan dari model yang kamu pilih — bisa normal, bisa t, bisa apa pun — fleksibilitas itulah kelebihannya." },
            { text: "Semua metode mengasumsikan normal", why: "Salah: historis tidak mengasumsikan distribusi apa pun." },
          ],
        },
      ],
      reference: "VaR = ambang kerugian pada tingkat kepercayaan, bukan maksimum. Tiga metode: parametrik, historis, Monte Carlo. Dampingi dengan Expected Shortfall.",
    },
    {
      id: "stress-risk-budget",
      eyebrow: "Langkah 4 · Stress Test & Risk Budgeting",
      title: "Stress test dan risk budgeting: dari ambang ke skenario",
      prose: [
        "VaR menjawab hari biasa yang buruk; stress test menjawab hari yang belum pernah terjadi. Stress test mengambil skenario ekstrem — krisis 2008, kenaikan suku bunga 300 basis poin, rupiah melemah 20 persen — dan menghitung dampaknya pada portofolio secara langsung, tanpa bersembunyi di balik probabilitas. Contoh ilustratif: portofolio Dina 500 juta rupiah, 60 persen saham (300 juta) dan 40 persen obligasi (200 juta). Skenario saham jatuh 30 persen: saham menjadi 210 juta, total portofolio 410 juta — turun 18 persen. Angka ini tidak memakai probabilitas sama sekali — ia memakai skenario. Itulah kekuatannya: dewan direksi dan klien memahami skenario jauh lebih baik daripada persentil.",
        "Risk budgeting membalik pertanyaan: bukan berapa return yang kita harapkan dari tiap aset, melainkan berapa RISIKO yang kita alokasikan ke tiap aset. Dua aset bisa menyumbang return yang sama tetapi risiko yang sangat berbeda — aset bervolatilitas tinggi dengan korelasi tinggi ke portofolio memakan risk budget besar untuk return yang sama. Manajer yang mengalokasikan risk budget secara sadar — misalnya 70 persen risk budget ke saham, 30 persen ke obligasi — mengelola risiko sebagai sumber daya yang langka, bukan sebagai efek samping. Bila satu posisi diam-diam memakan 80 persen risk budget-mu, kamu tidak terdiversifikasi — kamu terkonsentrasi dengan extra steps.",
        "Ketiganya bekerja sebagai sistem: VaR untuk pemantauan harian, stress test untuk ketahanan terhadap skenario, risk budgeting untuk alokasi risiko yang disengaja. Portofolio yang hanya dipantau VaR-nya adalah mobil yang hanya punya speedometer tanpa rem — ia tahu seberapa cepat ia melaju, tetapi tidak tahu apa yang terjadi saat jalan menanjak atau rem blong. IPS yang baik menulis ketiganya: ambang VaR, skenario stress test, dan risk budget per kelas aset.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengelola risiko hanya dengan VaR harian. VaR buta terhadap ekor dan terhadap skenario yang belum pernah terjadi — stress test dan risk budgeting adalah pelengkap yang wajib, bukan hiasan.",
      },
      reference: "VaR = pemantauan harian. Stress test = skenario ekstrem tanpa probabilitas. Risk budgeting = alokasi risiko sebagai sumber daya.",
    },
    {
      id: "lab-var",
      eyebrow: "Langkah 5 · Lab: VaR Parametrik",
      title: "Hitung sendiri: VaR 95 persen = 33 juta",
      prose: [
        "Sekarang giliranmu. Portofolio ilustratif senilai 1.000 juta rupiah, standar deviasi return harian 2 persen, mean return harian nol. Hitung VaR 95 persen dan VaR 99 persen dengan metode parametrik: kalikan z-score dengan standar deviasi dan nilai portofolio. Z-score 95 persen adalah 1,65; z-score 99 persen adalah 2,33.",
        "Perhatikan apa yang TIDAK kamu hitung: kamu tidak menghitung berapa kerugian pada hari terburuk — VaR tidak menjawab itu. VaR 99 persen 46,6 juta bukan kerugian maksimum; ia hanya ambang yang dilampaui satu hari dari seratus. Bila kamu ingin tahu rata-rata kerugian pada hari-hari yang melampaui ambang itu, kamu butuh Expected Shortfall — dan itu membutuhkan distribusi ekor, bukan sekadar z-score.",
        "Uji pemahamanmu setelah lab: bila standar deviasi harian naik dari 2 persen menjadi 3 persen, VaR 95 persen naik menjadi 49,5 juta — naik sebanding. VaR parametrik adalah linear dalam volatilitas: dua kali lipat volatilitas berarti dua kali lipat VaR. Itulah mengapa lonjakan volatilitas di krisis membuat VaR membengkak tepat saat kamu paling tidak menginginkannya — dan mengapa limit berbasis VaR bisa memaksamu menjual di titik terburuk.",
      ],
      formula: String.raw`VaR_{95\%} = 1{,}65 \times 0{,}02 \times 1.000 = 33 \quad;\quad VaR_{99\%} = 2{,}33 \times 0{,}02 \times 1.000 = 46{,}6`,
      formulaNote: "Nilai portofolio 1.000 juta rupiah, standar deviasi harian 2 persen, mean nol — semua ilustratif. Interpretasi: pada 95 persen hari, kerugian tidak melebihi 33 juta; pada 99 persen hari, tidak melebihi 46,6 juta. Contoh angka: 1,65 dikali 20 = 33; 2,33 dikali 20 = 46,6.",
      tasks: [
        { id: "t1", text: "Hitung `var95` (z 1,65, sigma 2%, nilai 1000 juta)" },
        { id: "t2", text: "Hitung `var99` (z 2,33), cetak keduanya" },
      ],
      expected: "var95=33.0  var99=46.6",
      hints: [
        "VaR = z dikali sigma dikali nilai portofolio.",
        "Sigma 2 persen = 0,02 dalam desimal.",
        "var95 = 1.65 * 0.02 * 1000\nvar99 = 2.33 * 0.02 * 1000",
      ],
      code: {
        starter: `nilai, sigma = 1000, 0.02\n\n# TULIS KODEMU (satuan: juta rupiah)\nvar95 = \nvar99 = \n\nprint(f"var95={var95:.1f}  var99={var99:.1f}")`,
        lockLines: 1,
        solution: `nilai, sigma = 1000, 0.02\n\n# TULIS KODEMU (satuan: juta rupiah)\nvar95 = 1.65 * sigma * nilai\nvar99 = 2.33 * sigma * nilai\n\nprint(f"var95={var95:.1f}  var99={var99:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95", value: 33, tol: 0.01, label: "`var95` seharusnya 33", msg: "1,65 dikali 0,02 dikali 1.000 = 33 juta rupiah." },
          { kind: "equal", task: "t2", name: "var99", value: 46.6, tol: 0.01, label: "`var99` seharusnya 46.6", msg: "2,33 dikali 0,02 dikali 1.000 = 46,6 juta rupiah." },
          { kind: "stdout_matches", task: "t2", pattern: "var95=33\\.0\\s+var99=46\\.6", label: "`print` menampilkan keduanya", msg: "Format: var95=...  var99=... ." },
        ],
      },
      reference: "VaR parametrik = z dikali sigma dikali nilai. VaR 95% = 33 juta; VaR 99% = 46,6 juta (ilustratif).",
    },
    {
      id: "rebalancing",
      eyebrow: "Langkah 6 · Rebalancing + Lab",
      title: "Calendar vs tolerance band — dan kapan pajak berkata jangan",
      prose: [
        "Tanpa rebalancing, portofolio melayang: pemenang membesar, profil risikomu berubah tanpa kamu sadari. Dua metode mengembalikannya. Calendar rebalancing: rebalance pada jadwal tetap — misalnya tiap kuartal atau tiap tahun — apa pun yang terjadi di pasar. Sederhana dan disiplin, tetapi bisa rebalance saat tidak perlu (biaya transaksi untuk pergeseran kecil) atau terlambat saat pasar bergerak cepat. Tolerance-band rebalancing: rebalance hanya bila bobot menyimpang melewati ambang — misalnya saham ditarget 60 persen dengan band 5 poin, sehingga rebalance hanya bila saham di luar 55 sampai 65 persen. Lebih efisien secara biaya, tetapi butuh pemantauan terus-menerus dan ambang yang ditetapkan dengan sengaja.",
        "Contoh ilustratif: portofolio 500 juta rupiah, target saham 60 persen (300 juta), obligasi 40 persen (200 juta). Saham naik sehingga menjadi 330 juta dari total 500 juta — bobot 66 persen, melewati band atas 65 persen. Tindakan: jual saham 30 juta dan beli obligasi 30 juta, kembali ke 300 dan 200. Menjual pemenang dan membeli yang tertinggal terasa berlawanan dengan naluri — tetapi itulah disiplin rebalancing: menjual mahal dan membeli murah secara mekanis, tanpa perlu menebak arah pasar.",
        "Pengecualian yang wajib diingat adalah pajak. Di rekening kena pajak, menjual saham yang naik berarti merealisasi capital gain dan membayar pajak hari ini — biaya yang nyata. Rebalancing yang tax-aware memilih urutan: pertama, arahkan aliran kas baru (gaji, dividen) ke aset yang kurang bobot; kedua, rebalance di dalam rekening yang ditangguhkan pajaknya (pensiun) di mana penjualan tidak memicu pajak; ketiga, bila harus menjual di rekening kena pajak, dahulukan lot yang rugi (tax-loss harvesting) atau lot yang sudah lama dipegang. Aturan praktis: rebalance dengan uang baru dan di rekening pensiun dulu; sentuh rekening kena pajak hanya bila band sudah jauh terlampaui dan manfaat risikonya melebihi biaya pajaknya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `jual` (kelebihan saham di atas target 60% dari 500 juta)" },
        { id: "t2", text: "Cetak jumlah yang dijual dan bobot saham kini (66%)" },
      ],
      expected: "jual=30  bobot=66%",
      hints: [
        "Target saham = 60 persen dikali 500 juta = 300 juta.",
        "Jual = saham kini 330 juta dikurangi target 300 juta.",
        "jual = 330 - 0.60 * 500",
      ],
      code: {
        starter: `total, saham_kini = 500, 330\n\n# TULIS KODEMU (satuan: juta rupiah)\njual = \nbobot = saham_kini / total * 100\n\nprint(f"jual={jual:.0f}  bobot={bobot:.0f}%")`,
        lockLines: 1,
        solution: `total, saham_kini = 500, 330\n\n# TULIS KODEMU (satuan: juta rupiah)\njual = saham_kini - 0.60 * total\nbobot = saham_kini / total * 100\n\nprint(f"jual={jual:.0f}  bobot={bobot:.0f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "jual", value: 30, tol: 1e-9, label: "`jual` seharusnya 30", msg: "330 dikurangi 300 = 30 juta rupiah dijual dan dialihkan ke obligasi." },
          { kind: "equal", task: "t2", name: "bobot", value: 66, tol: 1e-9, label: "`bobot` seharusnya 66", msg: "330 dibagi 500 = 66 persen — melewati band atas 65 persen, rebalance dipicu." },
          { kind: "stdout_matches", task: "t2", pattern: "jual=30\\s+bobot=66%", label: "`print` menampilkan keduanya", msg: "Format: jual=...  bobot=...%." },
        ],
      },
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rebalancing tanpa memperhatikan pajak bisa menghabiskan manfaatnya: capital gain yang direalisasi tiap kuartal adalah biaya pasti untuk manfaat risiko yang tidak pasti. Pakai uang baru dan rekening pensiun dulu.",
      },
      quiz: [
        {
          q: "Target saham 60 persen, band 5 poin. Bobot saham kini 66 persen. Tindakan tolerance-band?",
          options: [
            { text: "Diam — masih dalam band", why: "Salah: band atas adalah 65 persen — 66 persen sudah melewatinya." },
            { text: "Rebalance: jual saham sampai kembali ke 60 persen", why: "Benar: 66 persen melewati band 55 sampai 65 persen — jual 30 juta dari 500 juta dan alihkan ke obligasi.", correct: true },
            { text: "Beli saham lagi — momentum bagus", why: "Salah: itu menambah konsentrasi pada aset yang sudah membesar — kebalikan dari rebalancing." },
            { text: "Tunggu jadwal kuartalan — calendar selalu menang", why: "Salah: tolerance-band justru bereaksi saat ambang terlampaui, tanpa menunggu jadwal." },
          ],
        },
        {
          q: "Rebalancing paling tax-aware dilakukan dengan urutan apa?",
          options: [
            { text: "Jual semua pemenang di rekening kena pajak tiap bulan", why: "Salah: itu merealisasi capital gain terus-menerus — biaya pajak tertinggi." },
            { text: "Uang baru dulu, lalu rekening pensiun, terakhir jual di rekening kena pajak", why: "Benar: aliran kas baru dan rekening yang ditangguhkan pajaknya tidak memicu pajak hari ini.", correct: true },
            { text: "Jangan pernah rebalance — pajak selalu lebih mahal dari manfaatnya", why: "Salah: tidak rebalance membiarkan profil risiko melayang — manfaat rebalancing nyata, hanya caranya yang harus tax-aware." },
            { text: "Jual yang rugi dulu tanpa melihat band", why: "Salah: tax-loss harvesting adalah alat, bukan pemicu — rebalance tetap dipicu oleh band atau jadwal." },
          ],
        },
      ],
      reference: "Calendar = jadwal tetap. Tolerance band = rebalance saat melewati ambang. Tax-aware: uang baru, rekening pensiun, baru jual kena pajak.",
    },
    {
      id: "behavioral",
      eyebrow: "Langkah 7 · Behavioral & Vignette",
      title: "Empat bias yang paling merusak portofolio — dan mitigasi prosesnya",
      prose: [
        "Loss aversion: kerugian terasa sekitar dua kali lebih menyakitkan daripada keuntungan yang sama besarnya menyenangkan. Akibatnya investor menahan saham rugi terlalu lama (belum rugi kalau belum dijual) dan menjual saham untung terlalu cepat (mengunci keuntungan kecil). Mitigasi proses: stop-loss tertulis di IPS — potong mekanis pada ambang yang disepakati, tanpa negosiasi dengan emosi; dan evaluasi portofolio secara keseluruhan, bukan per posisi, sehingga satu posisi rugi tidak mendominasi perasaan.",
        "Overconfidence dan anchoring adalah pasangan yang berbahaya. Overconfidence: satu tahun kinerja bagus dianggap bukti skill, sehingga investor memperbesar taruhan dan mengabaikan diversifikasi — padahal satu tahun hampir tidak mengandung informasi tentang skill. Anchoring: harga beli menjadi jangkar — investor menolak menjual di bawah harga beli meski fundamentalnya sudah berubah, karena harga beli terasa seperti nilai yang benar. Mitigasi proses: catat alasan beli secara tertulis saat membeli; review posisi berdasarkan alasan itu, bukan berdasarkan harga beli; dan batasi bobot maksimum per posisi agar satu keyakinan tidak mendominasi portofolio.",
        "Herding: mengikuti kerumunan karena kerumunan terasa aman — membeli di puncak karena semua orang membeli, menjual di dasar karena semua orang menjual. Herding adalah loss aversion yang dilakukan bersama-sama. Mitigasi proses: IPS yang menetapkan alokasi dan aturan rebalancing sebelumnya — saat kerumunan membeli, rebalancing mekanis justru menjual; saat kerumunan menjual, rebalancing mekanis justru membeli. Proses yang tertulis adalah satu-satunya lawan yang seimbang bagi emosi yang tidak tertulis.",
        "Vignette penutup: IPS berubah saat hidup berubah. Dina menikah dan memiliki anak — horizon dan kebutuhan likuiditasnya berubah, IPS direview. Ia menerima warisan — konsentrasi dan pajaknya berubah, IPS direview. Ia pensiun — return objective berubah dari akumulasi menjadi penarikan, IPS direview. Yang TIDAK memicu review IPS adalah gejolak pasar: pasar jatuh 20 persen bukan alasan mengubah IPS — itu justru saat IPS paling dibutuhkan sebagai jangkar. Review karena hidup berubah; bertahan karena pasar berubah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengubah IPS karena pasar jatuh. IPS direview saat hidup berubah (pernikahan, anak, warisan, pensiun) — bukan saat pasar bergejolak. Mengubah IPS di tengah panik berarti membuang jangkar tepat saat badai.",
      },
      quiz: [
        {
          q: "Investor berkata: pokoknya saya tidak jual saham ini sebelum balik modal — padahal fundamentalnya sudah memburuk. Bias apa, dan mitigasinya?",
          options: [
            { text: "Overconfidence — batasi bobot posisi", why: "Salah: ini bukan soal terlalu percaya diri, melainkan soal menolak merealisasi kerugian." },
            { text: "Loss aversion + anchoring pada harga beli — potong mekanis sesuai stop-loss tertulis di IPS", why: "Benar: menolak rugi (loss aversion) dengan jangkar harga beli (anchoring); lawannya adalah aturan potong yang ditulis sebelum emosi mengambil alih.", correct: true },
            { text: "Herding — jangan ikut kerumunan", why: "Salah: tidak ada kerumunan dalam cerita ini — ini keputusan individual yang terikat harga beli." },
            { text: "Tidak ada bias — menunggu balik modal adalah strategi yang rasional", why: "Salah: harga beli adalah biaya hangus; keputusan harus berdasarkan prospek ke depan, bukan harga beli." },
          ],
        },
        {
          q: "Kapan IPS seharusnya direview?",
          options: [
            { text: "Setiap kali pasar jatuh lebih dari 10 persen", why: "Salah: gejolak pasar bukan pemicu review — justru saat IPS harus dipegang sebagai jangkar." },
            { text: "Saat hidup berubah: pernikahan, anak, warisan, pensiun", why: "Benar: perubahan hidup mengubah tujuan, horizon, dan constraints — itulah yang membuat IPS lama tidak lagi cocok.", correct: true },
            { text: "Setiap kali ada saham yang naik dua kali lipat", why: "Salah: kenaikan satu saham ditangani rebalancing, bukan review IPS." },
            { text: "Tidak pernah — IPS ditulis sekali seumur hidup", why: "Salah: IPS yang tidak pernah direview menjadi dokumen mati yang tidak lagi mencerminkan hidupmu." },
          ],
        },
      ],
      reference: "Loss aversion: tahan rugi, jual untung cepat. Overconfidence: satu tahun bagus dianggap skill. Anchoring: harga beli jadi jangkar. Herding: ikut kerumunan. Lawan semuanya: proses tertulis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: IPS, VaR, rebalancing, behavioral, dan vignette.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Return objective Dina 9 persen, Rf 4 persen, premi pasar 5 persen. Beta implisit portofolionya?",
          options: [
            { text: "1,0 — setara risiko pasar", why: "Benar: (9 dikurangi 4) dibagi 5 = 1,0.", correct: true },
            { text: "1,6 — agresif", why: "Salah: 1,6 adalah beta untuk target 12 persen, bukan 9 persen." },
            { text: "0,5 — defensif", why: "Salah: 0,5 memberi required return 6,5 persen, bukan 9 persen." },
            { text: "Tidak bisa dihitung tanpa harga saham", why: "Salah: beta implisit dihitung dari target return dan CAPM terbalik — tidak butuh harga saham." },
          ],
        },
        {
          q: "Portofolio 1.000 juta, sigma harian 2 persen. VaR 95 persen parametrik?",
          options: [
            { text: "20 juta", why: "Salah: itu 2 persen dikali 1.000 tanpa z-score — VaR memakai z 1,65." },
            { text: "33 juta", why: "Benar: 1,65 dikali 0,02 dikali 1.000 = 33 juta.", correct: true },
            { text: "46,6 juta", why: "Salah: itu VaR 99 persen (z 2,33), bukan 95 persen." },
            { text: "50 juta", why: "Salah: tidak ada dasarnya — hitung 1,65 dikali 20." },
          ],
        },
        {
          q: "Portofolio 500 juta, saham 330 juta, target 60 persen, band 5 poin. Berapa yang dijual saat rebalance?",
          options: [
            { text: "Tidak jual — masih dalam band", why: "Salah: 66 persen melewati band atas 65 persen." },
            { text: "30 juta — kembali ke target 300 juta", why: "Benar: 330 dikurangi 300 = 30 juta dialihkan ke obligasi.", correct: true },
            { text: "25 juta — kembali ke batas band 65 persen", why: "Salah: tolerance-band rebalance kembali ke target 60 persen, bukan ke tepi band." },
            { text: "165 juta — jual setengah saham", why: "Salah: tidak ada dasarnya — yang dijual hanya kelebihan di atas target." },
          ],
        },
        {
          q: "Saham jatuh 30 persen dalam stress test portofolio 500 juta (60 persen saham, 40 persen obligasi). Total portofolio menjadi?",
          options: [
            { text: "350 juta — turun 30 persen", why: "Salah: hanya bagian saham yang jatuh 30 persen; obligasi diasumsikan tetap 200 juta." },
            { text: "410 juta — saham 210 juta ditambah obligasi 200 juta", why: "Benar: 300 dikali 0,7 = 210; 210 ditambah 200 = 410 — turun 18 persen.", correct: true },
            { text: "470 juta — turun 6 persen", why: "Salah: cek 300 dikali 0,7 dan tambahkan 200." },
            { text: "500 juta — obligasi menutupi seluruhnya", why: "Salah: obligasi tetap, tidak naik — ia menahan, bukan menutupi seluruh kerugian saham." },
          ],
        },
        {
          q: "Dina pensiun. Apa yang berubah pada IPS-nya?",
          options: [
            { text: "Tidak ada — IPS tidak pernah berubah", why: "Salah: pensiun mengubah return objective dari akumulasi menjadi penarikan — IPS wajib direview." },
            { text: "Return objective berubah dari akumulasi ke penarikan; horizon, likuiditas, dan constraints direview", why: "Benar: perubahan hidup adalah pemicu review IPS — tujuan dan batasannya ditulis ulang.", correct: true },
            { text: "Hanya alokasi saham yang naik — pensiunan butuh return lebih tinggi", why: "Salah: pensiun biasanya menurunkan toleransi risiko, bukan menaikkan alokasi saham." },
            { text: "IPS dibuang — pensiunan tidak butuh IPS", why: "Salah: pensiunan justru paling butuh IPS — penarikan yang disiplin adalah jangkar melawan panik." },
          ],
        },
      ],
      summary: [
        "IPS: RR (return, risk) objectives dan TTLLU (time, tax, liquidity, legal, unique) constraints; willingness mengalahkan ability bila bertikai.",
        "Beta implisit dari CAPM terbalik: target Dina 9 persen berarti beta sekitar 1,0 — setara risiko pasar.",
        "VaR adalah ambang, bukan maksimum: VaR 95 persen 33 juta; VaR 99 persen 46,6 juta; dampingi dengan Expected Shortfall dan stress test.",
        "Risk budgeting mengalokasikan risiko sebagai sumber daya; stress test menguji skenario tanpa probabilitas.",
        "Rebalancing: calendar vs tolerance band; tax-aware — uang baru dulu, rekening pensiun, baru jual kena pajak.",
        "Empat bias: loss aversion, overconfidence, anchoring, herding — lawannya proses tertulis. IPS direview saat hidup berubah, bukan saat pasar bergejolak.",
      ],
      next: { label: "PM-B1 — Regresi Berganda: Model & Misspesifikasi", href: "/learn/pm-b1-regresi" },
    },
  ],
};
