import type { V2Lesson } from "../lib/types";

export const pma9b: V2Lesson = {
  slug: "pm-a9b-hedge-fund-pe",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A9B Alternatives: Hedge Fund, PE & Aset Riil",
  estMinutes: 60,
  steps: [
    {
      id: "hf-strategi",
      eyebrow: "Langkah 1 · Strategi Hedge Fund",
      title: "Long/short, event-driven, macro: tiga mesin yang berbeda",
      prose: [
        "PM-A9 memperkenalkan hedge fund sebagai pembeli alpha dengan fee 2-and-20. Lesson ini membedah mesinnya. Long/short equity adalah strategi paling umum: beli saham yang dinilai murah, short saham yang dinilai mahal, sehingga eksposur pasar bersihnya kecil dan return diharapkan datang dari pemilihan saham, bukan dari arah pasar. Seorang manajer long/short yang netral pasar dengan gross exposure 200 persen (long 150 persen, short 50 persen) bisa untung di pasar yang datar — asal pilihannya benar — dan bisa rugi di pasar yang naik — asal pilihannya salah. Beta yang kecil bukan berarti risiko yang kecil.",
        "Event-driven bertaruh pada peristiwa korporasi: merger arbitrage membeli saham target akuisisi dan short saham pengakuisisi, mengunci selisih antara harga pasar dan harga akuisisi; bila akuisisi batal, selisih itu meledak ke arah yang salah. Distressed debt membeli utang perusahaan bermasalah dengan harapan restrukturisasi. Macro/global bertaruh pada arah besar: suku bunga, mata uang, komoditas — memakai leverage dan derivatif sehingga satu keputusan bisa berukuran raksasa. Ketiga mesin ini tidak punya kesamaan selain label hedge fund — menilai mereka dengan satu tolok ukur adalah kesalahan kategori.",
        "Pertanyaan yang membedakan pembeli yang cerdas: berapa return strategi ini yang TIDAK dijelaskan oleh pasar? Itulah alpha yang kamu beli — dan satu-satunya yang layak dibayar dengan fee 2-and-20. Manajer long/short dengan beta 0,8 terhadap pasar pada dasarnya menjual beta yang dibungkus sebagai alpha: 80 persen return-nya bisa kamu replikasi sendiri dengan ETF murah. Minta regresi return fund terhadap faktor pasar sebelum percaya klaim alpha. Bobot CFA L1 untuk Alternatives umumnya berada pada rentang 5 sampai 8 persen (ilustratif sebagai rentang bobot yang dipublikasikan).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membayar fee hedge fund untuk beta. Bila return fund bergerak seiring pasar (beta tinggi), kamu membeli ETF mahal — bukan alpha. Alpha adalah sisa return setelah faktor pasar dijelaskan.",
      },
      reference: "Long/short: alpha dari pemilihan saham. Event-driven: alpha dari peristiwa korporasi. Macro: alpha dari arah besar. Uji: berapa return yang tidak dijelaskan pasar?",
    },
    {
      id: "hf-risiko-tersembunyi",
      eyebrow: "Langkah 2 · Risiko Tersembunyi",
      title: "Risiko yang tidak terlihat di return: leverage, likuiditas, survivorship",
      prose: [
        "Return hedge fund yang dilaporkan menyembunyikan tiga risiko. Pertama, leverage: fund yang memakai leverage 3x mengubah return aset 5 persen menjadi return ekuitas 15 persen — dan mengubah kerugian 5 persen menjadi 15 persen. Leverage mengembang return bagus dan return buruk secara simetris; laporan yang hanya memamerkan tahun bagus menyembunyikan bahwa fund itu hidup di ujung tali. Tanyakan gross exposure dan leverage, bukan hanya return.",
        "Kedua, likuiditas: banyak strategi hedge fund memegang aset yang tidak bisa dijual cepat — dan fund itu sendiri membatasi penarikan (lockup, gate, notice period 90 hari). Di krisis, kamu menemukan bahwa return 12 persenmu tidak bisa dicairkan saat kamu paling membutuhkannya, sementara manajer mengenakan gate dan menahan danamu. Likuiditas adalah risiko yang baru terlihat saat kamu mencoba keluar.",
        "Ketiga, survivorship bias: database hedge fund hanya berisi fund yang masih hidup. Contoh ilustratif: misalkan 100 fund berdiri, 30 fund yang rugi besar tutup dan hilang dari database, sehingga rata-rata return 70 fund yang tersisa terlihat 3 sampai 4 poin lebih tinggi daripada rata-rata seluruh 100 fund. Angka yang kamu baca di brosur adalah rata-rata para penyintas — bukan rata-rata semua yang mencoba. Ditambah backfill bias: fund baru hanya memasukkan sejarahnya ke database setelah terbukti bagus, sehingga tahun-tahun awal yang jelek tidak pernah tercatat. Aturan praktis: kurangi 2 sampai 4 poin dari return yang dilaporkan sebagai koreksi kasar atas bias-bias ini (ilustratif sebagai aturan jaga-jaga), lalu tanyakan apakah alpha-nya masih tersisa.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Leverage, lockup, dan survivorship bias adalah tiga cara return terlihat lebih baik daripada kenyataannya. Fund yang tidak mau membuka leverage dan daftar fund pendahulunya yang sudah tutup sedang menyembunyikan sesuatu.",
      },
      quiz: [
        {
          q: "Database melaporkan rata-rata return hedge fund 12 persen. Mengapa angka itu kemungkinan besar terlalu tinggi?",
          options: [
            { text: "Karena fund yang gagal tutup dan hilang dari database — survivorship bias", why: "Benar: hanya para penyintas yang tercatat; fund yang rugi besar dan tutup tidak masuk rata-rata.", correct: true },
            { text: "Karena database salah menjumlah", why: "Salah: masalahnya bukan aritmetika, melainkan sampelnya — fund gagal tidak ada di dalamnya." },
            { text: "Karena return fund memang selalu 12 persen", why: "Salah: tidak ada return yang selalu tetap — dan angka itu adalah rata-rata sampel yang bias." },
            { text: "Karena fee 2-and-20 belum dikurangkan", why: "Salah: fee adalah soal net vs gross, bukan soal fund yang hilang dari database." },
          ],
        },
        {
          q: "Manajer long/short mengklaim alpha 6 persen, tetapi regresi menunjukkan beta 0,8 terhadap pasar. Penilaianmu?",
          options: [
            { text: "Alpha 6 persen itu murni — klaim diterima", why: "Salah: beta 0,8 berarti sebagian besar return-nya dijelaskan pasar; alpha murni jauh lebih kecil dari 6 persen." },
            { text: "Sebagian besar return-nya adalah beta yang dibungkus alpha — fee 2-and-20 tidak layak untuk itu", why: "Benar: beta bisa direplikasi murah via ETF; yang layak dibayar mahal hanyalah sisa return yang tidak dijelaskan pasar.", correct: true },
            { text: "Beta tinggi berarti risikonya rendah", why: "Salah: beta tinggi berarti return-nya bergerak seiring pasar — bukan berarti risikonya rendah." },
            { text: "Beta tidak relevan untuk hedge fund", why: "Salah: beta justru alat utama membedakan alpha dari beta pada fund apa pun." },
          ],
        },
      ],
      reference: "Leverage mengembang untung dan rugi. Lockup menyembunyikan risiko likuiditas. Survivorship bias menaikkan rata-rata laporan.",
    },
    {
      id: "lbo",
      eyebrow: "Langkah 3 · LBO Sederhana",
      title: "Membeli perusahaan dengan uang pinjaman: sources dan uses",
      prose: [
        "Private equity membeli perusahaan lewat leveraged buyout (LBO): sebagian besar harga beli dibayar dengan utang, sisanya dengan ekuitas sponsor. Contoh ilustratif: sebuah perusahaan fiktif, PT MajuBersama, dibeli seharga 1.000 (satuan juta rupiah, ilustratif). Sources: utang 600 dan ekuitas sponsor 400 — total 1.000. Uses: harga beli 1.000. Struktur ini berarti sponsor hanya menaruh 40 persen dari harga, tetapi mengendalikan 100 persen perusahaan — dan arus kas perusahaan dipakai membayar bunga dan mencicil utang.",
        "Lima tahun kemudian (ilustratif), perusahaan dijual dengan enterprise value 1.400, sementara sisa utang tinggal 500 karena dicicil dari arus kas. Nilai ekuitas saat exit = 1.400 dikurangi 500 = 900. Sponsor menaruh 400 dan menerima 900: MOIC (multiple on invested capital) = 900 dibagi 400 = 2,25x. IRR = 2,25 pangkat (1 dibagi 5) dikurangi 1 = 17,6 persen per tahun. Perhatikan dari mana return itu datang: enterprise value hanya naik 40 persen (1.000 ke 1.400), tetapi ekuitas naik 125 persen (400 ke 900) — leverage mengembang keuntungan, persis seperti di hedge fund.",
        "Cerminnya juga sama: bila enterprise value jatuh ke 800 sementara utang tersisa 500, ekuitas tinggal 300 — sponsor rugi 25 persen padahal nilai perusahaan hanya turun 20 persen. Dan bila perusahaan tidak menghasilkan arus kas yang cukup untuk membayar bunga, sponsor harus menyuntik modal tambahan atau kehilangan perusahaan ke kreditur. LBO adalah mesin pengembang: ia mengembang keberhasilan operasional menjadi keberhasilan ekuitas — dan mengembang kegagalan dengan cara yang sama.",
      ],
      formula: String.raw`MOIC = \frac{\text{nilai ekuitas saat exit}}{\text{ekuitas yang disetor}} \quad;\quad IRR = MOIC^{1/T} - 1`,
      formulaNote: "Nilai ekuitas saat exit = enterprise value dikurangi sisa utang (1.400 dikurangi 500 = 900); ekuitas disetor = 400; T = horizon tahun (5). Interpretasi: MOIC mengukur berapa kali lipat modal kembali; IRR menganualisasikannya. Contoh angka (ilustratif): MOIC = 900 dibagi 400 = 2,25x; IRR = 2,25 pangkat 0,2 dikurangi 1 = 17,6 persen.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca IRR LBO 17,6 persen sebagai kinerja operasional perusahaan. Sebagian besarnya adalah leverage — enterprise value hanya naik 40 persen. Pisahkan pertumbuhan nilai perusahaan dari efek utang sebelum memuji manajer.",
      },
      quiz: [
        {
          q: "LBO: beli 1.000 (utang 600, ekuitas 400). Exit: EV 1.400, sisa utang 500. MOIC sponsor?",
          options: [
            { text: "1,40x — EV naik 40 persen", why: "Salah: itu kenaikan enterprise value, bukan ekuitas sponsor — utang yang berkurang ikut mengembang ekuitas." },
            { text: "2,25x — ekuitas 900 dari modal 400", why: "Benar: (1.400 dikurangi 500) dibagi 400 = 900 dibagi 400 = 2,25x.", correct: true },
            { text: "3,50x — EV dibagi utang", why: "Salah: EV dibagi utang bukan ukuran return ekuitas." },
            { text: "0,90x — sponsor rugi", why: "Salah: ekuitas exit 900 lebih besar dari modal 400 — sponsor untung." },
          ],
        },
      ],
      reference: "Sources = utang + ekuitas. Exit equity = EV dikurangi sisa utang. Leverage mengembang untung dan rugi.",
    },
    {
      id: "lab-dpi-irr",
      eyebrow: "Langkah 4 · Lab: DPI & Jebakan IRR",
      title: "IRR bisa menipu — DPI tidak bisa",
      prose: [
        "PM-A9 mengajarkan DPI dan TVPI: DPI adalah kas yang benar-benar kembali dibagi modal yang disetor; TVPI menambah NAV appraisal. Lesson ini menambahkan jebakan IRR. IRR adalah tingkat diskonto yang membuat NPV arus kas nol — ia sensitif terhadap WAKTU, bukan hanya jumlah. Fund yang mengembalikan modal kecil di awal lalu menahan sisanya bertahun-tahun bisa menampilkan IRR tinggi sementara sebagian besar uangmu masih terkunci dan DPI-nya rendah.",
        "Contoh ilustratif: sebuah fund fiktif memanggil modal 100 (satuan juta rupiah). Selama 7 tahun ia mendistribusikan 60 sebagai kas, dan NAV appraisal tersisa 120. DPI = 60 dibagi 100 = 0,6x — baru 60 persen modal kembali sebagai kas. TVPI = (60 ditambah 120) dibagi 100 = 1,8x — terlihat bagus di kertas. Fund ini bisa mengklaim IRR yang mengesankan bila distribusi 60 itu datang cepat di awal — tetapi bagimu, 40 persen modalmu belum kembali setelah 7 tahun, dan 120 sisanya adalah taksiran manajer sendiri yang belum tentu bisa dijual segitu.",
        "Aturan LP berpengalaman, diulang karena penting: percaya DPI, curigai RVPI. IRR tanpa DPI adalah cerita; DPI adalah rekening koran. Fund dengan IRR 25 persen tetapi DPI 0,3x setelah 7 tahun sedang menjual cerita — bukan kas. Hitung sendiri di lab: DPI dan TVPI dari angka di atas, lalu bandingkan keduanya dan putuskan mana yang kamu percaya.",
      ],
      formula: String.raw`DPI = \frac{\text{distribusi}}{\text{paid-in}} \quad;\quad TVPI = \frac{\text{distribusi} + \text{NAV}}{\text{paid-in}}`,
      formulaNote: "Distribusi = kas kembali (60); NAV = nilai appraisal sisa (120); paid-in = modal disetor (100) — semua ilustratif dalam jutaan rupiah. Interpretasi: DPI mengukur kas nyata; TVPI menambah janji kertas. Contoh angka: DPI = 60 dibagi 100 = 0,6x; TVPI = 180 dibagi 100 = 1,8x.",
      tasks: [
        { id: "t1", text: "Hitung `dpi` (distribusi dibagi paid-in)" },
        { id: "t2", text: "Hitung `tvpi` ((distribusi + NAV) dibagi paid-in), cetak keduanya" },
      ],
      expected: "dpi=0.6x  tvpi=1.8x",
      hints: [
        "DPI = distribusi dibagi paid-in.",
        "TVPI = (distribusi + NAV) dibagi paid-in.",
        "dpi = dist / paid\ntvpi = (dist + nav) / paid",
      ],
      code: {
        starter: `paid, dist, nav = 100, 60, 120\n\n# TULIS KODEMU\ndpi = \ntvpi = \n\nprint(f"dpi={dpi:.1f}x  tvpi={tvpi:.1f}x")`,
        lockLines: 1,
        solution: `paid, dist, nav = 100, 60, 120\n\n# TULIS KODEMU\ndpi = dist / paid\ntvpi = (dist + nav) / paid\n\nprint(f"dpi={dpi:.1f}x  tvpi={tvpi:.1f}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "dpi", value: 0.6, tol: 1e-9, label: "`dpi` seharusnya 0.6", msg: "60 dibagi 100 = 0,6x — baru 60 persen modal kembali sebagai kas." },
          { kind: "equal", task: "t2", name: "tvpi", value: 1.8, tol: 1e-9, label: "`tvpi` seharusnya 1.8", msg: "(60 ditambah 120) dibagi 100 = 1,8x — bagus di kertas, kasnya belum." },
          { kind: "stdout_matches", task: "t2", pattern: "dpi=0\\.6x\\s+tvpi=1\\.8x", label: "`print` menampilkan keduanya", msg: "Format: dpi=...x  tvpi=...x." },
        ],
      },
      reference: "DPI = kas kembali. TVPI = DPI + RVPI. IRR tanpa DPI adalah cerita.",
    },
    {
      id: "lab-real-estate",
      eyebrow: "Langkah 5 · Lab: Real Estate — NOI & Cap Rate",
      title: "Menilai properti dari arus kasnya, bukan dari brosurnya",
      prose: [
        "Aset riil pertama adalah real estate, dan alat nilainya adalah cap rate: NOI dibagi harga properti. NOI (net operating income) adalah pendapatan sewa kotor dikurangi biaya operasional (perawatan, pajak properti, manajemen, kekosongan) — sebelum bunga dan pajak penghasilan. Cap rate adalah imbal hasil arus kas properti seolah dibeli tunai tanpa utang; kebalikannya, harga = NOI dibagi cap rate, adalah cara pasar menilai properti.",
        "Contoh ilustratif: sebuah ruko fiktif menghasilkan NOI 160 juta rupiah per tahun dan ditawarkan seharga 2.000 juta rupiah. Cap rate = 160 dibagi 2.000 = 8 persen. Bila pasar menuntut cap rate 10 persen untuk properti sejenis — karena lokasinya lebih berisiko atau sewanya kurang stabil — maka harga wajar = 160 dibagi 0,10 = 1.600 juta rupiah. Harga penawaran 2.000 juta berarti kamu membayar 400 juta lebih mahal daripada pasar untuk risiko itu. Cap rate yang lebih tinggi berarti harga lebih rendah: pasar menuntut imbal hasil lebih besar untuk risiko lebih besar.",
        "Jebakan yang paling umum adalah NOI yang digelembungkan: penjual menghitung sewa penuh tanpa kekosongan, mengabaikan biaya perawatan besar yang segera jatuh tempo, atau memakai sewa penyewa yang sebentar lagi pindah. Selalu hitung NOI dengan asumsi kekosongan 5 sampai 10 persen (ilustratif) dan cadangan perawatan — NOI yang jujur adalah fondasi seluruh valuasi. Dan ingat leverage: cap rate 8 persen dengan utang berbunga 10 persen berarti leverage MERUGI — arus kas properti tidak cukup menutup bunga, apalagi pokok.",
      ],
      formula: String.raw`\text{Cap rate} = \frac{NOI}{\text{harga}} \quad;\quad \text{Harga wajar} = \frac{NOI}{\text{cap rate pasar}}`,
      formulaNote: "NOI = pendapatan sewa dikurangi biaya operasional (160 juta rupiah, ilustratif); harga = harga penawaran (2.000 juta rupiah, ilustratif). Interpretasi: cap rate adalah imbal hasil tunai properti; harga wajar membalik rumus dengan cap rate yang dituntut pasar. Contoh angka: cap rate = 160 dibagi 2.000 = 8 persen; harga wajar pada cap rate pasar 10 persen = 160 dibagi 0,10 = 1.600 juta rupiah.",
      tasks: [
        { id: "t1", text: "Hitung `cap_rate` (NOI dibagi harga, desimal)" },
        { id: "t2", text: "Hitung `harga_wajar` (NOI dibagi cap rate pasar 10%), cetak keduanya" },
      ],
      expected: "cap_rate=8.0%  harga_wajar=1600",
      hints: [
        "Cap rate = NOI dibagi harga.",
        "Harga wajar = NOI dibagi cap rate pasar (0,10).",
        "cap_rate = noi / harga\nharga_wajar = noi / 0.10",
      ],
      code: {
        starter: `noi, harga = 160, 2000\n\n# TULIS KODEMU (satuan: juta rupiah)\ncap_rate = \nharga_wajar = \n\nprint(f"cap_rate={cap_rate*100:.1f}%  harga_wajar={harga_wajar:.0f}")`,
        lockLines: 1,
        solution: `noi, harga = 160, 2000\n\n# TULIS KODEMU (satuan: juta rupiah)\ncap_rate = noi / harga\nharga_wajar = noi / 0.10\n\nprint(f"cap_rate={cap_rate*100:.1f}%  harga_wajar={harga_wajar:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cap_rate", value: 0.08, tol: 1e-9, label: "`cap_rate` seharusnya 0.08", msg: "160 dibagi 2.000 = 8 persen." },
          { kind: "equal", task: "t2", name: "harga_wajar", value: 1600, tol: 1e-9, label: "`harga_wajar` seharusnya 1600", msg: "160 dibagi 0,10 = 1.600 — penawaran 2.000 kemahalan 400." },
          { kind: "stdout_matches", task: "t2", pattern: "cap_rate=8\\.0%\\s+harga_wajar=1600", label: "`print` menampilkan keduanya", msg: "Format: cap_rate=...%  harga_wajar=... ." },
        ],
      },
      reference: "Cap rate = NOI dibagi harga. Harga wajar = NOI dibagi cap rate pasar. NOI jujur = fondasi valuasi.",
    },
    {
      id: "komoditas",
      eyebrow: "Langkah 6 · Komoditas",
      title: "Contango menggerogoti, backwardation memberi",
      prose: [
        "Aset riil kedua adalah komoditas, dan hampir semua investor membelinya lewat futures — bukan dengan menumpuk minyak di gudang. Di sinilah kurva futures menentukan nasibmu. Contango berarti harga futures lebih tinggi daripada spot: setiap kali kontrak jatuh tempo, kamu harus roll ke kontrak berikutnya yang lebih mahal — membayar selisihnya setiap bulan. Backwardation berarti futures lebih murah daripada spot: setiap roll kamu pindah ke kontrak yang lebih murah — menerima selisihnya.",
        "Contoh ilustratif: harga spot minyak 80 dolar per barel, kontrak bulan depan 84 dolar — contango 5 persen per gulir. Bila spot diam di 80 selama setahun dan kamu roll 12 kali, kamu membayar sekitar 5 persen tiap gulir — puluhan persen setahun — hanya untuk tetap memegang posisi yang sama. Spot tidak bergerak, tetapi investasimu tergerus. Inilah yang terjadi pada contoh PM-A9: spot naik 10 persen tetapi ETF futures rugi 14 persen. Sebaliknya, bila kontrak bulan depan 76 dolar (backwardation 5 persen), setiap roll memberimu sekitar 5 persen — roll yield positif yang menambah return bahkan bila spot diam.",
        "Mengapa kurva berbentuk begitu? Contango muncul bila biaya penyimpanan dan pembiayaan tinggi — pasar membayar pemegang persediaan untuk menyimpan. Backwardation muncul bila persediaan langka dan pembeli butuh barang sekarang — convenience yield, nilai dari memiliki barang fisik di tangan saat langka, menekan harga futures. Aturan praktis: sebelum membeli ETF komoditas, lihat kurvanya. Bila contango curam, kamu tidak sedang bertaruh harga naik — kamu sedang membayar sewa gudang setiap bulan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ETF komoditas bukan harga spot. Di contango curam, roll drag bisa menghapus seluruh kenaikan spot — dan investor yang tidak memeriksa kurva akan menyalahkan ETF yang bekerja persis sesuai desainnya.",
      },
      quiz: [
        {
          q: "Spot minyak 80, futures bulan depan 84. Kamu memegang ETF futures dan spot diam setahun. Apa yang terjadi?",
          options: [
            { text: "Tidak ada perubahan — spot diam berarti return nol", why: "Salah: ETF futures tidak memegang spot — ia roll kontrak, dan tiap roll di contango membayar selisih." },
            { text: "Rugi dari roll yield negatif — tiap gulir membayar sekitar 5 persen", why: "Benar: contango berarti kontrak berikutnya lebih mahal; 12 guliran setahun menggerogoti puluhan persen.", correct: true },
            { text: "Untung — futures lebih mahal berarti pasar optimistis", why: "Salah: futures lebih mahal justru berarti kamu membayar lebih setiap roll — bukan keuntungan." },
            { text: "ETF akan beralih memegang spot secara otomatis", why: "Salah: ETF futures tetap roll futures; ia tidak berubah menjadi gudang minyak." },
          ],
        },
        {
          q: "Kapan investasi komoditas via futures mendapat roll yield POSITIF?",
          options: [
            { text: "Saat contango — futures lebih mahal dari spot", why: "Salah: contango memberi roll yield negatif — kamu membayar tiap gulir." },
            { text: "Saat backwardation — futures lebih murah dari spot", why: "Benar: tiap roll pindah ke kontrak yang lebih murah — selisihnya menjadi keuntunganmu.", correct: true },
            { text: "Saat spot naik tajam", why: "Salah: kenaikan spot membantu, tetapi roll yield ditentukan bentuk kurva, bukan arah spot." },
            { text: "Saat volatilitas tinggi", why: "Salah: volatilitas bukan penentu roll yield — bentuk kurva futures-lah penentunya." },
          ],
        },
      ],
      reference: "Contango: futures di atas spot, roll negatif. Backwardation: futures di bawah spot, roll positif. Cek kurva sebelum beli ETF komoditas.",
    },
    {
      id: "due-diligence",
      eyebrow: "Langkah 7 · Due Diligence",
      title: "Tiga pertanyaan yang membedakan manajer asli dari pemasaran",
      prose: [
        "Pertanyaan pertama: berapa persen kekayaan pribadi Anda yang ikut di fund ini, dan apakah co-invest itu sejajar dengan kami? Manajer yang menaruh uangnya sendiri di fund yang sama — dengan syarat yang sama — punya insentif yang sejajar denganmu. Manajer yang hanya hidup dari management fee 2 persen dibayar apa pun yang terjadi tidak punya alasan untuk peduli bila fund-nya stagnan. Jawaban yang meyakinkan adalah angka dan bukti — bukan janji. Bila co-invest-nya kecil atau tidak ada, fee yang ia terima adalah satu-satunya taruhannya.",
        "Pertanyaan kedua: tunjukkan return per vintage dan daftar fund yang sudah dilikuidasi penuh — termasuk yang gagal. Satu vintage hebat bisa menutupi tiga vintage yang biasa-biasa saja, dan IRR gabungan menyembunyikan itu semua. Manajer asli membuka seluruh sejarahnya, termasuk fund yang ditutup karena kinerja buruk; pemasaran hanya membuka vintage terbaiknya. Bila manajer tidak bisa menunjukkan fund yang gagal, itu bukan bukti ia tidak pernah gagal — itu bukti ia menyembunyikan yang gagal.",
        "Pertanyaan ketiga: siapa yang menilai NAV, seberapa sering, dan kapan terakhir kali valuasi independen dilakukan? NAV yang dinilai sendiri oleh manajer — dengan metodologi yang tidak tertulis — adalah angka yang bisa diatur: naikkan sedikit tiap kuartal, dan volatilitas tampak rendah, Sharpe tampak tinggi. Manajer asli memakai administrator independen dan metodologi tertulis; ia tidak keberatan kamu memeriksa. Tiga jawaban ini — co-invest, seluruh vintage, valuasi independen — memisahkan manajer yang menjual kinerja dari manajer yang menjual brosur.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menerima track record gabungan tanpa vintage dan tanpa daftar fund yang tutup. Satu vintage hebat dan survivorship bias bisa membuat manajer biasa terlihat legendaris.",
      },
      quiz: [
        {
          q: "Manajer memamerkan IRR gabungan 22 persen tetapi menolak menunjukkan return per vintage dan fund yang sudah tutup. Sikapmu?",
          options: [
            { text: "Investasi — IRR 22 persen sudah cukup membuktikan", why: "Salah: IRR gabungan menyembunyikan vintage yang buruk; tanpa seluruh sejarah, kamu menilai brosur, bukan manajer." },
            { text: "Tolak sampai seluruh vintage dan fund yang gagal dibuka — satu vintage hebat bisa menutupi tiga yang biasa", why: "Benar: transparansi vintage dan fund yang tutup adalah uji kejujuran pertama seorang manajer.", correct: true },
            { text: "Investasi setengah — kompromi", why: "Salah: kompromi tanpa informasi bukan diversifikasi — itu taruhan buta dengan setengah modal." },
            { text: "Tanyakan fee-nya saja — bila fee rendah, invest", why: "Salah: fee murah pada manajer yang menyembunyikan sejarah tetap berarti membeli kucing dalam karung." },
          ],
        },
      ],
      reference: "Tiga pertanyaan: co-invest pribadi, seluruh vintage termasuk yang gagal, valuasi NAV independen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: hedge fund, LBO, DPI, cap rate, dan komoditas.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fund fiktif: paid-in 100, distribusi 60, NAV 120. DPI dan TVPI?",
          options: [
            { text: "DPI 1,8x, TVPI 0,6x", why: "Salah: tertukar — 1,8x adalah TVPI, 0,6x adalah DPI." },
            { text: "DPI 0,6x, TVPI 1,8x — kas baru 60 persen kembali", why: "Benar: DPI = 60 dibagi 100 = 0,6x; TVPI = 180 dibagi 100 = 1,8x. Percaya DPI, curigai RVPI.", correct: true },
            { text: "DPI 1,2x, TVPI 0,6x", why: "Salah: 1,2x adalah RVPI (120 dibagi 100) — janji kertas, bukan kas." },
            { text: "Keduanya 0,6x", why: "Salah: TVPI menambah NAV — keduanya berbeda selama NAV belum nol." },
          ],
        },
        {
          q: "LBO: EV naik 40 persen tetapi ekuitas sponsor naik 125 persen. Penjelasan?",
          options: [
            { text: "Kinerja operasional yang luar biasa", why: "Salah: EV hanya naik 40 persen — sisanya adalah efek leverage dari utang yang berkurang." },
            { text: "Leverage: utang tetap dicicil sehingga ekuitas mengembang lebih cepat dari EV", why: "Benar: ekuitas = EV dikurangi utang; utang yang menyusut mengembang return ekuitas di kedua arah.", correct: true },
            { text: "Kesalahan hitung — keduanya harus sama", why: "Salah: tidak ada kesalahan — leverage memang membuat return ekuitas berbeda dari return EV." },
            { text: "MOIC selalu lebih besar dari kenaikan EV", why: "Salah: MOIC bisa lebih kecil bila EV turun — leverage mengembang kedua arah." },
          ],
        },
        {
          q: "Properti NOI 160 juta, harga 2.000 juta. Cap rate pasar 10 persen. Harga wajar?",
          options: [
            { text: "2.000 juta — harga penawaran sudah wajar", why: "Salah: cap rate penawaran hanya 8 persen, di bawah 10 persen yang dituntut pasar — harganya kemahalan." },
            { text: "1.600 juta — NOI dibagi cap rate pasar", why: "Benar: 160 dibagi 0,10 = 1.600. Penawaran 2.000 berarti premi 400 juta untuk risiko yang sama.", correct: true },
            { text: "1.280 juta — NOI dibagi 12,5 persen", why: "Salah: 12,5 persen bukan cap rate pasar dalam contoh ini." },
            { text: "2.500 juta — NOI dikali harga", why: "Salah: rumus harga wajar adalah NOI dibagi cap rate, bukan dikali harga." },
          ],
        },
        {
          q: "Fund melaporkan IRR 25 persen tetapi DPI 0,3x setelah 7 tahun. Apa artinya?",
          options: [
            { text: "Fund sangat sukses — IRR tinggi membuktikan", why: "Salah: DPI 0,3x berarti baru 30 persen modal kembali sebagai kas setelah 7 tahun — IRR-nya cerita, kasnya nyata." },
            { text: "IRR menipu bila distribusi awal kecil dan cepat — yang kembali sebagai kas baru 30 persen", why: "Benar: IRR sensitif terhadap waktu; distribusi kecil di awal bisa menggelembungkan IRR sementara sebagian besar modal masih terkunci.", correct: true },
            { text: "DPI tidak relevan bila IRR tinggi", why: "Salah: DPI justru yang paling relevan — kas yang kembali adalah satu-satunya return yang bisa dibelanjakan." },
            { text: "Fund pasti bangkrut", why: "Salah: DPI rendah bukan bukti bangkrut — tetapi bukti klaim IRR-nya tidak didukung kas." },
          ],
        },
        {
          q: "Database hedge fund melaporkan rata-rata return 12 persen. Koreksi paling penting sebelum percaya?",
          options: [
            { text: "Tidak ada — database resmi selalu benar", why: "Salah: database hanya berisi fund yang masih hidup — fund gagal yang tutup tidak tercatat." },
            { text: "Kurangi beberapa poin untuk survivorship dan backfill bias — rata-rata penyintas bukan rata-rata semua fund", why: "Benar: fund yang rugi besar tutup dan hilang; fund baru hanya memasukkan sejarah setelah terbukti bagus.", correct: true },
            { text: "Tambah fee 2-and-20 ke return-nya", why: "Salah: fee mengurangi return investor, bukan menambahkannya — dan itu soal lain dari bias sampel." },
            { text: "Ganti database lain", why: "Salah: semua database hedge fund punya bias yang sama — solusinya koreksi, bukan ganti sumber." },
          ],
        },
      ],
      summary: [
        "Hedge fund: long/short, event-driven, macro — tiga mesin berbeda; bayar hanya untuk alpha yang tidak dijelaskan pasar.",
        "Risiko tersembunyi: leverage mengembang kedua arah, lockup menyembunyikan risiko likuiditas, survivorship bias menaikkan rata-rata laporan.",
        "LBO: sources = utang + ekuitas; exit equity = EV dikurangi sisa utang; MOIC 2,25x dan IRR 17,6 persen dalam contoh ilustratif.",
        "DPI adalah kas nyata; TVPI menambah janji kertas; IRR tanpa DPI adalah cerita.",
        "Real estate: cap rate = NOI dibagi harga; harga wajar = NOI dibagi cap rate pasar. Komoditas: contango menggerogoti, backwardation memberi.",
        "Due diligence: co-invest pribadi, seluruh vintage termasuk yang gagal, valuasi NAV independen.",
      ],
      next: { label: "PM-A10B — Portfolio Management: IPS, Manajemen Risiko & Rebalancing", href: "/learn/pm-a10b-IPS-risiko" },
    },
  ],
};
