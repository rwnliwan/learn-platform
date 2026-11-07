import type { V2Lesson } from "../lib/types";

export const pma3b: V2Lesson = {
  slug: "pm-a3b-kebijakan-siklus",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A3B Economics: Kebijakan Moneter, Siklus & Paritas FX",
  estMinutes: 60,
  steps: [
    {
      id: "transmisi-moneter",
      eyebrow: "Langkah 1 · Transmisi Moneter",
      title: "Dari suku bunga acuan ke warung kopi: rantai transmisi",
      prose: [
        "PM-A3 mengajarkan Taylor rule sebagai jangkar suku bunga dan covered interest parity sebagai jangkar forward FX. Lesson ini mengikuti uangnya: bagaimana keputusan bank sentral benar-benar sampai ke kredit, permintaan, dan inflasi — dan mengapa jalurnya panjang dan bocor. Bobot Economics di CFA Level 1 adalah sekitar 8 sampai 12 persen (rentang bobot yang umum dipublikasikan, bukan angka pasti) — dan transmisi kebijakan adalah bagian yang paling sering diuji dari topik itu.",
        "Bank sentral punya empat alat utama. Pertama, suku bunga acuan (policy rate): menaikkan acuan menaikkan suku bunga antarbank, lalu suku bunga deposito dan kredit. Kedua, operasi pasar terbuka: menjual surat berharga menyedot likuiditas dari sistem, membelinya menyuntik likuiditas. Ketiga, giro wajib minimum (reserve requirement): menaikkan cadangan wajib memaksa bank menyimpan lebih banyak dana di bank sentral dan meminjamkan lebih sedikit. Keempat, fasilitas berdiri (standing facilities) dan kebijakan makroprudensial seperti batas loan-to-value yang mengerem kredit ke sektor tertentu tanpa mengubah suku bunga acuan.",
        "Rantainya berbunyi: acuan naik, kredit mahal, konsumsi dan investasi tertahan, permintaan agregat turun, tekanan harga mereda — tetapi dengan lag 12 sampai 18 bulan, dan setiap sambungan bisa bocor. Contoh ilustratif dari Indonesia: bila suku bunga acuan naik 1 poin persentase (ilustratif), bank menaikkan bunga KPR dan kredit usaha, pengembang menunda proyek, rumah tangga menunda membeli mobil, dan permintaan melemah — tetapi bila bank kelebihan likuiditas atau perusahaan besar mendanai diri dari obligasi, transmisi melemah dan inflasi turun lebih lambat dari yang diharapkan. Analis obligasi yang hanya menonton pengumuman suku bunga tanpa menonton penyaluran kredit sedang menonton separuh cerita.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira kenaikan suku bunga langsung menurunkan inflasi. Transmisi butuh 12 sampai 18 bulan — dan di tengah jalan, ekspektasi, nilai tukar, dan kondisi kredit global bisa memperkuat atau membatalkannya.",
      },
      quiz: [
        {
          q: "Bank sentral menaikkan suku bunga acuan, tetapi penyaluran kredit justru tetap tumbuh karena bank kelebihan likuiditas. Apa artinya bagi transmisi moneter?",
          options: [
            { text: "Transmisi bekerja sempurna — kredit memang harus tumbuh", why: "Salah: tujuan pengetatan adalah memperlambat kredit; bila kredit tetap tumbuh, jalurnya bocor." },
            { text: "Transmisi melemah — sambungan dari suku bunga ke kredit bocor, sehingga efek ke inflasi akan lebih lambat atau lebih kecil", why: "Benar: likuiditas berlebih membuat bank tidak perlu meneruskan kenaikan bunga ke nasabah.", correct: true },
            { text: "Kebijakan moneter menjadi tidak relevan sama sekali", why: "Salah: transmisi melemah bukan berarti hilang — jalur nilai tukar dan ekspektasi masih bekerja." },
            { text: "Inflasi pasti langsung turun", why: "Salah: inflasi merespons dengan lag 12 sampai 18 bulan, dan hanya bila transmisi sampai ke permintaan." },
          ],
        },
      ],
      reference: "Alat: policy rate, operasi pasar terbuka, giro wajib minimum, makroprudensial. Rantai: bunga, kredit, permintaan, inflasi — lag 12 sampai 18 bulan.",
    },
    {
      id: "fiskal-multiplier",
      eyebrow: "Langkah 2 · Lab: Kebijakan Fiskal & Multiplier",
      title: "Belanja pemerintah 100, ekonomi tumbuh 500: multiplier",
      prose: [
        "Kebijakan fiskal adalah belanja dan pajak pemerintah. Belanja naik atau pajak turun menstimulasi permintaan secara langsung — berbeda dari moneter yang bekerja lewat harga kredit. Kekuatannya diukur multiplier: setiap rupiah belanja pemerintah yang dibelanjakan menjadi pendapatan seseorang, yang sebagian dibelanjakan lagi, menjadi pendapatan orang lain, dan seterusnya. Besarnya putaran itu ditentukan marginal propensity to consume (MPC): porsi setiap rupiah pendapatan tambahan yang dibelanjakan, bukan ditabung.",
        "Rumus multiplier belanja adalah satu dibagi satu dikurangi MPC. Contoh ilustratif: MPC 0,80 berarti dari setiap Rp100 pendapatan tambahan, Rp80 dibelanjakan dan Rp20 ditabung. Multiplier-nya adalah 1 dibagi 0,20 sama dengan 5. Bila pemerintah menambah belanja Rp100 triliun (ilustratif), dampak total ke output adalah 5 dikali 100 sama dengan Rp500 triliun (ilustratif) — sebelum kebocoran lain diperhitungkan. Multiplier pajak lebih kecil dan bertanda negatif, karena pemotongan pajak sebagian ditabung dulu sebelum dibelanjakan.",
        "Tetapi ada lawannya: crowding out. Bila pemerintah membiayai belanja dengan berutang besar, ia menyerap dana pinjaman, mendorong suku bunga naik, dan investasi swasta yang tersingkir mengurangi sebagian stimulus itu. Defisit juga menumpuk utang yang bunganya membebani anggaran tahun-tahun berikutnya. Itulah sebabnya stimulus fiskal paling efektif saat ekonomi lesu dan suku bunga rendah — saat crowding out kecil — dan paling berbahaya saat ekonomi sudah panas. Hitung multiplier-nya di lab.",
      ],
      formula: String.raw`\text{Multiplier belanja} = \frac{1}{1 - MPC} \qquad;\qquad \Delta Y = \text{Multiplier} \times \Delta G`,
      formulaNote: "MPC = marginal propensity to consume (0,80, ilustratif — porsi pendapatan tambahan yang dibelanjakan); ΔG = tambahan belanja pemerintah (Rp100 triliun, ilustratif); ΔY = dampak total ke output. Interpretasi: multiplier mengukur berapa kali lipat putaran belanja berantai memperbesar stimulus awal — semakin tinggi MPC, semakin besar multiplier. Contoh angka: 1 dibagi (1 dikurangi 0,80) = 5; ΔY = 5 dikali 100 = Rp500 triliun (ilustratif), sebelum crowding out.",
      tasks: [
        { id: "t1", text: "Hitung `mult` (multiplier belanja dari MPC = 0,8)" },
        { id: "t2", text: "Hitung `dy` (dampak ke output dari belanja tambahan 100), cetak keduanya" },
      ],
      expected: "mult=5.0  dy=500.0",
      hints: [
        "Multiplier = 1 dibagi (1 dikurangi MPC).",
        "Dampak output = multiplier dikali tambahan belanja.",
        "mult = 1 / (1 - mpc)\ndy = mult * dg",
      ],
      code: {
        starter: `mpc, dg = 0.8, 100  # Rp triliun (ilustratif)\n\n# TULIS KODEMU\nmult = \ndy = \n\nprint(f"mult={mult:.1f}  dy={dy:.1f}")`,
        lockLines: 1,
        solution: `mpc, dg = 0.8, 100  # Rp triliun (ilustratif)\n\n# TULIS KODEMU\nmult = 1 / (1 - mpc)\ndy = mult * dg\n\nprint(f"mult={mult:.1f}  dy={dy:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "mult", value: 5, tol: 1e-9, label: "`mult` seharusnya 5.0", msg: "1 dibagi (1 dikurangi 0,8) = 1 dibagi 0,2 = 5." },
          { kind: "equal", task: "t2", name: "dy", value: 500, tol: 1e-9, label: "`dy` seharusnya 500.0", msg: "5 dikali 100 = 500. Itu sebelum crowding out mengurangi dampaknya." },
          { kind: "stdout_matches", task: "t2", pattern: "mult=5\\.0\\s+dy=500\\.0", label: "`print` menampilkan keduanya", msg: "Format: mult=...  dy=... ." },
        ],
      },
      reference: "Multiplier belanja = 1 dibagi (1 dikurangi MPC). Fiskal kuat saat lesu; crowding out menggerogoti saat utang besar.",
    },
    {
      id: "siklus-indikator",
      eyebrow: "Langkah 3 · Siklus Bisnis",
      title: "Leading, coincident, lagging: membaca posisi ekonomi",
      prose: [
        "Siklus bisnis bergerak dalam empat fase: ekspansi, puncak, kontraksi, dan lembah. Investor yang tahu posisinya bisa memutar portofolio: saham siklis dan komoditas di awal ekspansi, saham defensif dan obligasi saat kontraksi mendekat. Masalahnya, fase ekonomi baru diketahui pasti setelah berlalu — GDP kuartal ini diumumkan kuartal depan. Itulah gunanya indikator: data yang bergerak mendahului, bersamaan, atau mengikuti siklus.",
        "Leading indicators bergerak mendahului: izin mendirikan bangunan, pesanan baru manufaktur, klaim pengangguran awal, dan selisih yield obligasi jangka panjang dikurangi jangka pendek. Coincident indicators bergerak bersamaan: GDP, produksi industri, penjualan ritel, dan jumlah pekerja. Lagging indicators bergerak belakangan dan mengonfirmasi: durasi pengangguran, biaya tenaga kerja per unit, dan rasio kredit bermasalah. Aturannya: leading untuk memprediksi, coincident untuk mengonfirmasi posisi kini, lagging untuk memverifikasi bahwa pembalikan benar terjadi.",
        "Jebakan klasiknya adalah memakai indikator lagging sebagai sinyal beli atau jual: tingkat pengangguran mencapai puncaknya justru setelah resesi berakhir, sehingga menjual saham saat pengangguran tertinggi berarti menjual di lembah. Sebaliknya, leading indicator bisa memberi false alarm — satu bulan pesanan turun belum berarti resesi. Praktik yang benar: gabungkan beberapa leading indicator, minta konfirmasi dari coincident, dan pakai lagging hanya sebagai verifikasi, bukan pemicu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjual saham karena tingkat pengangguran mencapai puncak. Pengangguran adalah lagging indicator — puncaknya datang setelah resesi berakhir, sehingga keputusan itu menjual di lembah.",
      },
      quiz: [
        {
          q: "Izin mendirikan bangunan turun tiga bulan berturut-turut, tetapi GDP masih tumbuh dan pengangguran masih rendah. Pembacaan yang benar?",
          options: [
            { text: "Ekonomi sedang baik-baik saja — GDP dan pengangguran yang menentukan", why: "Salah: GDP dan pengangguran adalah coincident dan lagging — keduanya bergerak belakangan." },
            { text: "Sinyal peringatan dini kontraksi — izin bangunan adalah leading indicator, meski perlu konfirmasi dari leading lain dan coincident", why: "Benar: leading bergerak mendahului; satu indikator saja belum cukup, tetapi arahnya adalah peringatan.", correct: true },
            { text: "Resesi sudah pasti terjadi", why: "Salah: leading indicator bisa false alarm — butuh konfirmasi dari beberapa indikator." },
            { text: "Tidak ada informasi — izin bangunan tidak berhubungan dengan siklus", why: "Salah: izin bangunan adalah leading indicator klasik untuk investasi dan konstruksi." },
          ],
        },
      ],
      reference: "Leading: izin bangunan, pesanan baru, klaim pengangguran awal. Coincident: GDP, produksi, penjualan ritel. Lagging: durasi pengangguran, kredit bermasalah.",
    },
    {
      id: "yield-curve",
      eyebrow: "Langkah 4 · Yield Curve",
      title: "Kurva terbalik: sinyal resesi yang paling ditakuti pasar",
      prose: [
        "Yield curve memetakan suku bunga obligasi pemerintah dari tenor pendek ke tenor panjang. Dalam kondisi normal ia menanjak: investor menuntut imbal hasil lebih tinggi untuk mengunci uang lebih lama. Bentuknya bercerita: kurva yang menanjak curam menandakan ekspektasi pertumbuhan dan inflasi naik; kurva yang mendatar menandakan pertumbuhan melambat; kurva terbalik — yield jangka pendek lebih tinggi dari jangka panjang — menandakan pasar mengharapkan bank sentral memangkas suku bunga karena resesi di depan.",
        "Ukuran yang paling diawasi adalah spread 10 tahun dikurangi 2 tahun. Contoh ilustratif: yield 10 tahun 6,0 persen dan yield 2 tahun 6,5 persen (ilustratif) menghasilkan spread negatif 0,5 poin persentase — kurva terbalik. Mekanismenya masuk akal: investor memborong obligasi jangka panjang untuk mengunci yield sebelum suku bunga turun, harga obligasi panjang naik, yield-nya turun di bawah yield pendek. Setiap resesi besar di Amerika Serikat dalam setengah abad terakhir didahului inversi — tetapi inversi bukan ramalan sempurna: ia memberi tahu probabilitas, bukan tanggal.",
        "Untuk investor, inversi adalah perintah bersiap, bukan perintah panik: perpendek durasi kredit berisiko, perkuat posisi defensif, dan periksa eksposur ke emiten siklis yang pendapatannya runtuh saat kontraksi. Namun perlu dicatat: di pasar dengan intervensi bank sentral yang besar atau pasar obligasi yang dangkal, sinyal kurva bisa terdistorsi — yield panjang ditekan oleh pembelian bank sentral, bukan oleh ekspektasi pasar. Selalu baca kurva bersama leading indicator lain, bukan sendirian.",
      ],
      formula: String.raw`\text{Spread} = \text{Yield 10 tahun} - \text{Yield 2 tahun} \quad;\quad \text{Spread} < 0 \Rightarrow \text{kurva terbalik}`,
      formulaNote: "Yield 10 tahun = 6,0 persen (ilustratif); yield 2 tahun = 6,5 persen (ilustratif). Interpretasi: spread negatif berarti pasar mengharapkan suku bunga turun karena resesi — investor memborong obligasi panjang dan menekan yield-nya ke bawah. Contoh angka: 6,0 dikurangi 6,5 = negatif 0,5 poin persentase — kurva terbalik, sinyal peringatan resesi yang perlu dikonfirmasi indikator lain.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inversi mendahului resesi dengan lag yang tidak pasti — kadang 6 bulan, kadang 18 bulan. Investor yang menjual semua saham pada hari pertama inversi sering melewatkan reli terakhir sebelum kontraksi benar datang.",
      },
      quiz: [
        {
          q: "Yield obligasi 10 tahun 6,0 persen dan 2 tahun 6,5 persen. Apa artinya dan apa respons yang tepat?",
          options: [
            { text: "Kurva normal menanjak — ekonomi sehat, tambah saham siklis", why: "Salah: yield pendek di atas yield panjang berarti kurva terbalik, bukan menanjak." },
            { text: "Kurva terbalik — sinyal peringatan resesi; bersiap defensif dan konfirmasi dengan leading indicator lain", why: "Benar: spread negatif 0,5 poin berarti pasar mengharapkan pemangkasan suku bunga karena kontraksi.", correct: true },
            { text: "Resesi pasti dimulai bulan depan — jual semua saham sekarang", why: "Salah: inversi memberi probabilitas dengan lag tidak pasti, bukan tanggal resesi." },
            { text: "Tidak ada arti — yield curve tidak berhubungan dengan siklus", why: "Salah: inversi mendahului setiap resesi besar AS dalam setengah abad terakhir." },
          ],
        },
      ],
      reference: "Spread 10Y dikurangi 2Y negatif = kurva terbalik = sinyal resesi. Konfirmasi dengan leading indicator, jangan panik sendirian.",
    },
    {
      id: "ppp",
      eyebrow: "Langkah 5 · Paritas Daya Beli",
      title: "PPP absolut vs relatif: kapan harga barang menentukan kurs",
      prose: [
        "Purchasing power parity (PPP) mengatakan kurs seharusnya menyamakan harga barang yang sama di dua negara. PPP absolut menyatakan kurs sama dengan rasio tingkat harga: bila sekeranjang barang yang sama berharga Rp16.000.000 di Indonesia dan 1.000 dolar di Amerika Serikat (ilustratif), kurs yang konsisten adalah Rp16.000 per dolar. Versi absolut ini jarang berlaku persis karena biaya transportasi, pajak, hambatan perdagangan, dan jasa yang tidak diperdagangkan — tukang cukur di Jakarta tidak bersaing dengan tukang cukur di New York.",
        "PPP relatif lebih berguna dan lebih sering diuji: perubahan kurs seharusnya sama dengan selisih inflasi kedua negara. Bila inflasi Indonesia 3 persen dan inflasi Amerika Serikat 2 persen (ilustratif), rupiah seharusnya terdepresiasi sekitar 1 persen terhadap dolar, karena harga-harga di Indonesia naik lebih cepat. Rumus tepatnya memakai rasio: kurs tahun depan sama dengan kurs kini dikali satu ditambah inflasi domestik dibagi satu ditambah inflasi asing. Dengan kurs awal Rp16.000 (ilustratif), kurs yang konsisten PPP adalah 16.000 dikali 1,03 dibagi 1,02 sama dengan Rp16.157 (ilustratif).",
        "PPP bekerja dalam jangka panjang — tahunan, bukan mingguan. Dalam jangka pendek kurs digerakkan arus modal, selisih suku bunga, dan sentimen, sehingga deviasi dari PPP bisa bertahan bertahun-tahun. Kegunaan praktisnya bagi analis: PPP adalah jangkar nilai wajar jangka panjang. Bila kurs berada jauh di atas nilai PPP-nya selama bertahun-tahun, mata uang itu mahal secara fundamental dan risiko koreksi menumpuk — tetapi jangan pernah memakai PPP untuk meramal kurs bulan depan.",
      ],
      formula: String.raw`S_1 = S_0 \times \frac{1 + \pi_d}{1 + \pi_f} \quad \text{(PPP relatif)} \qquad;\qquad S = \frac{P_d}{P_f} \quad \text{(PPP absolut)}`,
      formulaNote: "S_0 = kurs spot awal (Rp16.000 per dolar, ilustratif); π_d = inflasi domestik (3 persen, ilustratif); π_f = inflasi asing (2 persen, ilustratif); P_d dan P_f = tingkat harga keranjang yang sama di kedua negara. Interpretasi: PPP relatif mengatakan mata uang negara berinflasi tinggi terdepresiasi sebesar selisih inflasi — jangkar jangka panjang, bukan ramalan jangka pendek. Contoh angka: 16.000 dikali 1,03 dibagi 1,02 = Rp16.157 (ilustratif).",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai PPP absolut untuk meramal kurs bulan depan. PPP adalah jangkar jangka panjang — deviasi dari PPP bisa bertahan bertahun-tahun karena arus modal dan sentimen mendominasi jangka pendek.",
      },
      quiz: [
        {
          q: "Inflasi Indonesia 3 persen, inflasi Amerika Serikat 2 persen, kurs kini Rp16.000 per dolar. Kurs yang konsisten dengan PPP relatif?",
          options: [
            { text: "Rp16.157 — rupiah terdepresiasi sekitar selisih inflasi", why: "Benar: 16.000 dikali 1,03 dibagi 1,02 = 16.157. Negara berinflasi lebih tinggi mata uangnya melemah.", correct: true },
            { text: "Rp15.843 — rupiah menguat", why: "Salah: inflasi domestik lebih tinggi membuat rupiah melemah, bukan menguat — rumusnya terbalik." },
            { text: "Rp16.000 — kurs tidak berubah karena PPP absolut", why: "Salah: PPP relatif soal perubahan kurs mengikuti selisih inflasi, bukan kurs yang tetap." },
            { text: "Rp16.480 — rupiah melemah 3 persen penuh", why: "Salah: yang diperhitungkan adalah selisih inflasi (3 dikurangi 2), bukan inflasi domestik saja." },
          ],
        },
      ],
      reference: "PPP absolut: kurs sama dengan rasio harga. PPP relatif: perubahan kurs sama dengan selisih inflasi. Jangkar jangka panjang.",
    },
    {
      id: "irp-lab",
      eyebrow: "Langkah 6 · Lab: Interest Rate Parity",
      title: "Covered vs uncovered: menghitung forward yang wajar",
      prose: [
        "PM-A3 sudah menghitung forward wajar dari covered interest rate parity (IRP): F sama dengan S dikali satu ditambah suku bunga domestik dibagi satu ditambah suku bunga asing. Lesson ini menegaskan mengapa rumus itu harus berlaku: bila forward pasar menyimpang dari forward wajar, arbitrase covered mengunci keuntungan tanpa risiko — pinjam di mata uang berbunga rendah, konversi ke mata uang berbunga tinggi, investasikan, dan kunci kurs pulang dengan kontrak forward. Arus arbitrase inilah yang mendorong forward pasar kembali ke nilai wajarnya.",
        "Uncovered IRP adalah sepupunya yang lebih berani: ia mengklaim kurs spot masa depan yang DIHARAPKAN sama dengan forward wajar — dengan kata lain, selisih suku bunga memprediksi depresiasi mata uang berbunga tinggi. Bedanya, uncovered tidak bisa diarbitrase: tidak ada kontrak yang mengunci hasilnya, sehingga ia adalah prediksi tentang ekspektasi, bukan hukum arbitrase. Dan secara empiris, uncovered IRP sering gagal dalam jangka pendek — mata uang berbunga tinggi justru sering menguat, bukan melemah — fenomena yang disebut forward premium puzzle.",
        "Contoh ilustratif baru, berbeda dari PM-A3: kurs spot Rp16.000 per dolar (ilustratif), suku bunga rupiah 6 persen, suku bunga dolar 5 persen (ilustratif). Forward wajar satu tahun adalah 16.000 dikali 1,06 dibagi 1,05 sama dengan Rp16.152 (ilustratif). Bila pasar meng-quote forward Rp16.500, dolar forward kemahalan: arbitraseur menjual dolar forward dan mengunci keuntungan dari selisihnya. Hitung forward wajarnya di lab.",
      ],
      formula: String.raw`F = S \times \frac{1 + r_d}{1 + r_f} \quad \text{(covered IRP)} \qquad;\qquad E[S_1] = F \quad \text{(uncovered IRP)}`,
      formulaNote: "F = kurs forward wajar; S = kurs spot (Rp16.000 per dolar, ilustratif); r_d = suku bunga domestik rupiah (6 persen, ilustratif); r_f = suku bunga asing dolar (5 persen, ilustratif). Interpretasi: covered IRP adalah hukum arbitrase — deviasi berarti peluang keuntungan tanpa risiko. Uncovered IRP adalah klaim tentang ekspektasi — dan sering gagal jangka pendek. Contoh angka: 16.000 dikali 1,06 dibagi 1,05 = Rp16.152 (ilustratif).",
      tasks: [
        { id: "t1", text: "Hitung `fwd` 1 tahun dari IRP: S=16000, r_IDR=6%, r_USD=5%" },
        { id: "t2", text: "Cetak hasilnya (bilangan bulat)" },
      ],
      expected: "fwd=16152",
      hints: [
        "Forward = S dikali (1 + r_domestik) dibagi (1 + r_asing).",
        "Suku bunga domestik di pembilang, asing di penyebut.",
        "fwd = s * (1 + r_idr) / (1 + r_usd)",
      ],
      code: {
        starter: `s, r_idr, r_usd = 16000, 0.06, 0.05  # Rp per USD (ilustratif)\n\n# TULIS KODEMU\nfwd = \n\nprint(f"fwd={fwd:.0f}")`,
        lockLines: 1,
        solution: `s, r_idr, r_usd = 16000, 0.06, 0.05  # Rp per USD (ilustratif)\n\n# TULIS KODEMU\nfwd = s * (1 + r_idr) / (1 + r_usd)\n\nprint(f"fwd={fwd:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fwd", value: 16152.38, tol: 1, label: "`fwd` sekitar 16152", msg: "16.000 dikali (1,06 dibagi 1,05) = 16.152. Rupiah berbunga lebih tinggi berarti forward melemah." },
          { kind: "stdout_matches", task: "t2", pattern: "fwd=16152", label: "`print` menampilkan fwd", msg: "Format: fwd=16152." },
        ],
      },
      reference: "Covered IRP = hukum arbitrase. Uncovered IRP = ekspektasi, sering gagal jangka pendek (forward premium puzzle).",
    },
    {
      id: "carry-trade",
      eyebrow: "Langkah 7 · Carry Trade",
      title: "Kenapa carry bisa untung bertahun-tahun — lalu hancur semalam",
      prose: [
        "Carry trade adalah strategi meminjam mata uang berbunga rendah dan menginvestasikannya di mata uang berbunga tinggi, mengantongi selisih suku bunga. Contoh ilustratif: pinjam dolar pada 4,5 persen, investasikan dalam rupiah pada 5,5 persen (ilustratif). Bila kurs tidak berubah, keuntungannya adalah 5,5 dikurangi 4,5 sama dengan 1,0 persen (ilustratif). Strategi ini adalah taruhan langsung melawan uncovered IRP: menurut teori, rupiah seharusnya terdepresiasi 1 persen dan menghapus keuntungan itu — tetapi dalam praktik, mata uang berbunga tinggi sering justru menguat, sehingga carry trader untung dari dua arah sekaligus: selisih bunga dan apresiasi mata uang.",
        "Keuntungan itulah yang membuatnya berbahaya. Carry trade bekerja pelan dan stabil selama bertahun-tahun — lalu hancur dalam hitungan hari saat sentimen berbalik. Bila rupiah tiba-tiba terdepresiasi 3 persen (ilustratif), hasil carry menjadi 1,0 dikurangi 3,0 sama dengan negatif 2,0 persen (ilustratif): satu minggu pergerakan kurs menghapus tiga tahun selisih bunga. Lebih buruk lagi, semua carry trader keluar melalui pintu yang sama: mereka menjual rupiah serentak untuk melunasi pinjaman dolar, penjualan itu melemahkan rupiah lebih jauh, dan pelemahan itu memaksa trader berikutnya keluar — spiral unwinding yang mempercepat kejatuhan.",
        "Pelajaran untuk analis ada dua. Pertama, return carry trade mirip menjual asuransi: premi kecil yang teratur, kerugian besar yang jarang — profil return dengan skewness negatif yang sama seperti di PM-A2B. Kedua, jangan pernah menilai carry dari selisih suku bunga saja: tanyakan volatilitas kursnya, tanyakan siapa lagi yang berada di perdagangan yang sama, dan tanyakan apa yang terjadi bila semua orang keluar bersamaan. Carry yang terlihat gratis hampir selalu adalah risiko yang belum menagih harganya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Carry trade adalah skewness negatif: untung kecil dan sering, rugi besar dan jarang. Sharpe ratio-nya terlihat bagus sampai unwinding menghapus tahun-tahun keuntungan dalam seminggu.",
      },
      reference: "Carry = pinjam rendah, invest tinggi. Untung bila kurs stabil; hancur bila depresiasi melampaui selisih bunga; unwinding mempercepat kejatuhan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: transmisi moneter, multiplier fiskal, indikator siklus, yield curve, dan paritas FX.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Bank sentral menaikkan suku bunga acuan. Kapan dampaknya ke inflasi paling mungkin terasa penuh?",
          options: [
            { text: "Bulan yang sama — pasar langsung menyesuaikan", why: "Salah: harga obligasi bereaksi seketika, tetapi inflasi merespons lewat kredit dan permintaan dengan lag panjang." },
            { text: "12 sampai 18 bulan kemudian — transmisi lewat kredit dan permintaan butuh waktu", why: "Benar: lag transmisi moneter ke inflasi adalah 12 sampai 18 bulan.", correct: true },
            { text: "Tidak pernah — suku bunga tidak memengaruhi inflasi", why: "Salah: suku bunga memengaruhi inflasi lewat permintaan, hanya saja lambat dan bisa bocor." },
            { text: "Saat bank sentral mengumumkan, bukan saat menaikkan", why: "Salah: pengumuman memengaruhi ekspektasi, tetapi inflasi merespons perubahan kredit dan permintaan yang nyata." },
          ],
        },
        {
          q: "MPC 0,80 dan pemerintah menambah belanja Rp100 triliun. Dampak total ke output sebelum crowding out?",
          options: [
            { text: "Rp100 triliun — belanja hanya berdampak sekali", why: "Salah: belanja berputar berantai lewat konsumsi; multiplier-nya 5." },
            { text: "Rp500 triliun — multiplier 5 dikali 100", why: "Benar: 1 dibagi (1 dikurangi 0,80) = 5; 5 dikali 100 = 500.", correct: true },
            { text: "Rp80 triliun — hanya porsi yang dibelanjakan yang berdampak", why: "Salah: 80 adalah putaran pertama saja; putaran berikutnya menambah dampak sampai 500." },
            { text: "Rp20 triliun — hanya porsi yang ditabung yang berdampak", why: "Salah: tabungan adalah kebocoran, bukan pendorong multiplier." },
          ],
        },
        {
          q: "Tingkat pengangguran mencapai puncak tertinggi. Apa pembacaan siklus yang benar?",
          options: [
            { text: "Resesi baru saja dimulai — saatnya menjual saham", why: "Salah: pengangguran adalah lagging indicator; puncaknya datang setelah resesi berakhir." },
            { text: "Resesi kemungkinan sudah berakhir — pengangguran adalah lagging indicator yang mengonfirmasi belakangan", why: "Benar: memakai lagging sebagai pemicu jual berarti menjual di lembah.", correct: true },
            { text: "Ekspansi sedang memuncak — saatnya membeli saham siklis", why: "Salah: puncak pengangguran menandai akhir kontraksi, bukan puncak ekspansi." },
            { text: "Tidak ada informasi siklus dari pengangguran", why: "Salah: pengangguran adalah lagging indicator yang sah — hanya saja ia mengonfirmasi, bukan memprediksi." },
          ],
        },
        {
          q: "Yield 10 tahun 6,0 persen, yield 2 tahun 6,5 persen. Spread dan artinya?",
          options: [
            { text: "Spread positif 0,5 — kurva normal", why: "Salah: 6,0 dikurangi 6,5 adalah negatif 0,5, bukan positif." },
            { text: "Spread negatif 0,5 poin — kurva terbalik, sinyal peringatan resesi", why: "Benar: yield pendek di atas yield panjang berarti pasar mengharapkan pemangkasan suku bunga karena kontraksi.", correct: true },
            { text: "Spread nol — kurva mendatar sempurna", why: "Salah: selisihnya 0,5 poin, bukan nol." },
            { text: "Spread negatif berarti obligasi panjang lebih aman", why: "Salah: spread negatif adalah sinyal makro tentang ekspektasi resesi, bukan peringkat keamanan obligasi." },
          ],
        },
        {
          q: "Spot Rp16.000, suku bunga rupiah 6 persen, dolar 5 persen. Forward wajar 1 tahun menurut covered IRP?",
          options: [
            { text: "Rp16.152 — rupiah melemah sebesar selisih bunga", why: "Benar: 16.000 dikali 1,06 dibagi 1,05 = 16.152.", correct: true },
            { text: "Rp15.848 — rupiah menguat", why: "Salah: mata uang berbunga lebih tinggi forward-nya melemah, bukan menguat — rumusnya terbalik." },
            { text: "Rp16.000 — forward sama dengan spot", why: "Salah: selisih suku bunga 1 poin harus tercermin di forward." },
            { text: "Rp16.960 — rupiah melemah 6 persen penuh", why: "Salah: yang diperhitungkan adalah rasio selisih bunga, bukan bunga domestik saja." },
          ],
        },
      ],
      summary: [
        "Transmisi moneter: policy rate, operasi pasar terbuka, giro wajib minimum, makroprudensial — rantai bunga, kredit, permintaan, inflasi dengan lag 12 sampai 18 bulan.",
        "Fiskal: multiplier belanja = 1 dibagi (1 dikurangi MPC); crowding out menggerogoti stimulus bila utang besar.",
        "Siklus: leading memprediksi, coincident mengonfirmasi posisi kini, lagging memverifikasi belakangan.",
        "Yield curve: spread 10Y dikurangi 2Y negatif berarti kurva terbalik — sinyal peringatan resesi, bukan tanggal resesi.",
        "PPP relatif: perubahan kurs sama dengan selisih inflasi — jangkar jangka panjang.",
        "Covered IRP adalah hukum arbitrase; uncovered IRP adalah ekspektasi yang sering gagal. Carry trade untung dari selisih bunga dan hancur oleh depresiasi mendadak.",
      ],
      next: { label: "PM-A4 — Financial Statements: 3 Laporan & Rasio", href: "/learn/pm-a4-financial-statements" },
    },
  ],
};
