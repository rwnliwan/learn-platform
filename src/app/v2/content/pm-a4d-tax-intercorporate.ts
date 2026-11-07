import type { V2Lesson } from "../lib/types";

export const pma4d: V2Lesson = {
  slug: "pm-a4d-tax-intercorporate",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A4D Pajak Tangguhan & Intercorporate Investments",
  estMinutes: 60,
  steps: [
    {
      id: "temporer-vs-permanen",
      eyebrow: "Langkah 1 · Beda Temporer vs Permanen",
      title: "Dua jenis selisih antara laba akuntansi dan laba pajak",
      prose: [
        "PT Harmoni (fiktif, ilustratif) melaporkan laba akuntansi Rp1.000 juta tetapi laba kena pajak hanya Rp800 juta. Selisih Rp200 juta itu bukan kesalahan — ia adalah beda antara dua bahasa: bahasa akuntansi yang mengukur kinerja ekonomi, dan bahasa pajak yang mengukur kewajiban ke negara. Memahami jenis selisihnya adalah kunci membaca pajak tangguhan.",
        "Beda temporer adalah selisih yang berbalik di masa depan. Contoh klasik: depresiasi dipercepat untuk pajak tetapi garis lurus untuk akuntansi — tahun ini beban pajak lebih kecil, tahun-tahun berikutnya lebih besar, totalnya sama. Beda temporer menciptakan pajak tangguhan: kewajiban (DTL) bila pajak hari ini lebih kecil dari beban pajak akuntansi, aset (DTA) bila sebaliknya.",
        "Beda permanen adalah selisih yang tidak pernah berbalik. Contoh: denda yang tidak boleh dikurangkan pajak, atau penghasilan yang dibebaskan pajak. Beda permanen tidak menciptakan pajak tangguhan — ia hanya membuat tarif pajak efektif berbeda dari tarif statutori selamanya. Analis yang mencampuradukkan keduanya akan salah memproyeksikan beban pajak masa depan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira semua selisih laba akuntansi dan laba pajak akan berbalik. Beda permanen tidak pernah berbalik — ia mengubah ETR secara permanen, bukan menunda pajak.",
      },
      reference: "Temporer = berbalik, menciptakan DTL atau DTA. Permanen = tidak berbalik, hanya mengubah ETR.",
    },
    {
      id: "dtl-dta",
      eyebrow: "Langkah 2 · Lab: DTL & DTA",
      title: "Pajak yang ditunda: menghitung DTL dari depresiasi dipercepat",
      prose: [
        "PT Harmoni membeli mesin Rp1.000 juta (ilustratif). Untuk akuntansi, depresiasi garis lurus Rp100 juta per tahun. Untuk pajak, depresiasi dipercepat Rp500 juta di tahun pertama. Di akhir tahun pertama, nilai buku akuntansi adalah Rp900 juta, sedangkan nilai pajak (tax base) adalah Rp500 juta. Selisih Rp400 juta adalah beda temporer kena pajak: di masa depan, perusahaan akan membayar pajak atas Rp400 juta itu saat depresiasi pajaknya habis.",
        "Dengan tarif pajak 25 persen (ilustratif), deferred tax liability adalah Rp400 juta dikali 25 persen = Rp100 juta. DTL adalah utang pajak masa depan yang sudah diakui hari ini — ia duduk di neraca sebagai liabilitas, dan akan berkurang tahun demi tahun saat beda temporer berbalik.",
        "Cerminnya adalah DTA. Bila perusahaan mengakui provisi garansi Rp200 juta sebagai beban akuntansi tetapi baru boleh dikurangkan saat benar-benar dibayar, maka beda temporer yang dapat dikurangkan Rp200 juta menciptakan DTA Rp50 juta pada tarif 25 persen. DTA adalah pajak yang sudah dibayar lebih dulu secara ekonomi — manfaat pajak masa depan. Bedakan keduanya dengan satu pertanyaan: apakah selisih ini membuat pajak masa depan lebih besar (DTL) atau lebih kecil (DTA)?",
      ],
      formula: String.raw`\text{DTL} = \text{beda temporer kena pajak} \times \text{tarif pajak} \quad;\quad \text{DTA} = \text{beda temporer dapat dikurangkan} \times \text{tarif pajak}`,
      formulaNote: "Beda temporer kena pajak Rp400 juta (ilustratif): nilai buku Rp900 juta dikurangi tax base Rp500 juta. Tarif pajak 25 persen. Interpretasi: DTL Rp100 juta adalah pajak masa depan atas Rp400 juta yang belum dikenai pajak hari ini — bukan denda, melainkan penundaan. Contoh angka: 400 dikali 25 persen = Rp100 juta.",
      tasks: [
        { id: "t1", text: "Hitung `beda` temporer (nilai buku akuntansi dikurangi tax base)" },
        { id: "t2", text: "Hitung `dtl` (beda dikali tarif pajak 25%), cetak keduanya" },
      ],
      expected: "beda=400  dtl=100",
      hints: [
        "Beda temporer = nilai buku dikurangi tax base.",
        "DTL = beda dikali tarif pajak.",
        "beda = nilai_buku - tax_base\ndtl = int(beda * 0.25)",
      ],
      code: {
        starter: `nilai_buku, tax_base = 900, 500  # Rp juta, ilustratif\ntarif = 0.25\n\n# TULIS KODEMU\nbeda = \ndtl = \n\nprint(f"beda={beda}  dtl={dtl}")`,
        lockLines: 2,
        solution: `nilai_buku, tax_base = 900, 500  # Rp juta, ilustratif\ntarif = 0.25\n\n# TULIS KODEMU\nbeda = nilai_buku - tax_base\ndtl = int(beda * tarif)\n\nprint(f"beda={beda}  dtl={dtl}")`,
        checks: [
          { kind: "equal", task: "t1", name: "beda", value: 400, tol: 1e-9, label: "`beda` seharusnya 400", msg: "900 dikurangi 500 = 400. Nilai buku di atas tax base berarti pajak ditunda." },
          { kind: "equal", task: "t2", name: "dtl", value: 100, tol: 1e-9, label: "`dtl` seharusnya 100", msg: "400 dikali 25 persen = 100." },
          { kind: "stdout_matches", task: "t2", pattern: "beda=400\\s+dtl=100", label: "`print` menampilkan keduanya", msg: "Format: beda=...  dtl=... ." },
        ],
      },
      reference: "DTL = beda temporer kena pajak dikali tarif. DTA = beda dapat dikurangkan dikali tarif.",
    },
    {
      id: "valuation-allowance",
      eyebrow: "Langkah 3 · Valuation Allowance & Tarif",
      title: "Saat aset pajak diragukan — dan saat tarif berubah",
      prose: [
        "DTA hanya berharga bila perusahaan akan menghasilkan laba kena pajak di masa depan untuk memanfaatkannya. Bila manajemen menilai kemungkinan pemanfaatannya di bawah 50 persen (lebih mungkin tidak daripada ya), ia wajib membentuk valuation allowance yang mengurangi DTA. Contoh ilustratif: DTA Rp50 juta dengan allowance Rp50 juta berarti nilai bersihnya nol — perusahaan mengakui bahwa manfaat pajak itu kemungkinan besar tidak akan pernah dipakai.",
        "Valuation allowance adalah salah satu tuas manajemen laba yang paling halus. Menurunkan allowance menambah laba (beban pajak turun) tanpa satu rupiah kas masuk; menaikkannya menurunkan laba. Analis membaca perubahan allowance seperti membaca kepercayaan manajemen pada masa depan perusahaan itu sendiri: allowance yang naik tajam adalah manajemen yang pesimistis soal laba kena pajaknya.",
        "Perubahan tarif pajak memaksa penyesuaian langsung. Bila tarif naik dari 25 persen menjadi 30 persen (ilustratif), DTL Rp100 juta harus dinilai ulang menjadi Rp120 juta — selisih Rp20 juta diakui sebagai beban pajak tambahan di periode perubahan. Sebaliknya, DTA naik nilainya saat tarif naik. Aturan praktisnya: DTL membesar saat tarif naik, DTA membesar saat tarif naik — keduanya diukur ulang pada tarif yang berlaku saat beda berbalik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perusahaan merugi yang tiba-tiba melaporkan laba karena melepas valuation allowance sedang memakai masa depan untuk menambal hari ini. Pisahkan laba dari pelepasan allowance sebelum menilai kinerja operasi.",
      },
      quiz: [
        {
          q: "Tarif pajak naik dari 25 persen menjadi 30 persen. DTL Rp100 juta (dari beda Rp400 juta) menjadi?",
          options: [
            { text: "Rp120 juta, dengan beban pajak tambahan Rp20 juta", why: "Benar: 400 dikali 30 persen = 120; selisih 20 diakui sebagai beban pajak di periode perubahan.", correct: true },
            { text: "Tetap Rp100 juta", why: "Salah: DTL diukur pada tarif yang berlaku saat beda berbalik — tarif baru wajib dipakai." },
            { text: "Rp83,33 juta", why: "Salah: itu hasil membagi, bukan mengalikan dengan tarif baru." },
            { text: "Rp100 juta tetapi DTA naik", why: "Salah: DTL ikut naik saat tarif naik — sama seperti DTA." },
          ],
        },
      ],
      reference: "DTA diragukan = valuation allowance. Tarif berubah = DTL dan DTA diukur ulang, selisih lewat laba rugi.",
    },
    {
      id: "rekonsiliasi-etr",
      eyebrow: "Langkah 4 · Rekonsiliasi ETR",
      title: "Dari tarif statutori ke tarif yang benar-benar dibayar",
      prose: [
        "Tarif pajak statutori adalah angka di undang-undang — misalnya 25 persen (ilustratif). Tarif pajak efektif (ETR) adalah beban pajak dibagi laba sebelum pajak. Keduanya jarang sama, dan selisihnya diceritakan dalam rekonsiliasi ETR di catatan kaki — salah satu tabel paling jujur di laporan tahunan.",
        "Contoh ilustratif: PT Harmoni mencatat laba sebelum pajak Rp800 juta dan beban pajak Rp160 juta — ETR 20 persen, di bawah tarif statutori 25 persen. Rekonsiliasinya: beban pajak statutori 25 persen dari Rp800 juta = Rp200 juta, dikurangi penghasilan bebas pajak Rp50 juta, ditambah denda tidak dapat dikurangkan Rp10 juta — total Rp160 juta. Setiap baris adalah cerita: penghasilan bebas pajak menekan ETR, denda menaikkannya.",
        "Analis memakai ETR untuk dua hal. Pertama, menilai kualitas laba: ETR yang jauh di bawah statutori karena insentif pajak yang akan berakhir berarti laba masa depan akan tertekan saat insentif habis. Kedua, memproyeksikan beban pajak: memakai ETR tahun ini tanpa memahami komponen permanen versus temporernya adalah cara pasti salah proyeksi. Beda permanen mengubah ETR selamanya; beda temporer hanya menggesernya antar tahun.",
      ],
      formula: String.raw`ETR = \frac{\text{beban pajak}}{\text{laba sebelum pajak}}`,
      formulaNote: "Beban pajak Rp160 juta, laba sebelum pajak Rp800 juta (ilustratif). Interpretasi: ETR 20 persen berarti dari setiap Rp100 laba sebelum pajak, Rp20 menjadi beban pajak — lima poin di bawah tarif statutori 25 persen karena penghasilan bebas pajak. Contoh angka: 160 dibagi 800 = 20 persen; beban statutori Rp200 juta dikurangi Rp50 juta ditambah Rp10 juta = Rp160 juta.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memproyeksikan beban pajak dengan ETR tahun ini mentah-mentah. Bila ETR rendah karena insentif sekali saja, proyeksi akan meremehkan pajak masa depan dan melebih-lebihkan laba.",
      },
      reference: "ETR = beban pajak dibagi laba sebelum pajak. Baca rekonsiliasinya: permanen mengubah ETR, temporer hanya menggeser.",
    },
    {
      id: "klasifikasi-investasi",
      eyebrow: "Langkah 5 · Klasifikasi Investasi",
      title: "Di bawah 20, 20 sampai 50, di atas 50: tiga dunia berbeda",
      prose: [
        "Seberapa besar kepemilikan menentukan bagaimana investasi dilaporkan. Kepemilikan pasif di bawah 20 persen umumnya tidak memberi pengaruh signifikan: investasi dicatat pada fair value, dan hanya dividen yang diakui sebagai penghasilan. Investor adalah penonton — ia tidak memengaruhi keputusan investee.",
        "Kepemilikan 20 sampai 50 persen umumnya memberi significant influence: investor duduk di dewan, ikut menentukan kebijakan, dan memakai equity method. Investasi tidak lagi dicatat pada harga pasar, melainkan mengikuti bagian investor atas laba dan aset bersih investee. Ambang 20 persen adalah pedoman, bukan hukum mutlak — pengaruh signifikan bisa ada di bawah 20 persen bila ada kursi dewan, dan bisa tidak ada di atas 20 persen bila ada pemegang mayoritas yang dominan.",
        "Kepemilikan di atas 50 persen umumnya berarti control: investor mengonsolidasikan seluruh aset, liabilitas, pendapatan, dan beban investee ke laporannya sendiri, lalu mengakui non-controlling interest untuk bagian minoritas. Tiga ambang ini bukan sekadar klasifikasi — mereka menentukan apakah laba investee muncul di laporanmu, seberapa besar, dan kapan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal ambang 20 dan 50 persen sebagai aturan kaku. CFA menguji substansi pengaruhnya: kursi dewan, transaksi material, dan ketergantungan teknologi bisa mengubah klasifikasi meski persentasenya tidak melewati ambang.",
      },
      quiz: [
        {
          q: "Investor memegang 15 persen saham dan satu kursi dewan, serta menjadi pemasok utama teknologi investee. Klasifikasi yang paling tepat?",
          options: [
            { text: "Pasif — karena di bawah 20 persen", why: "Salah: ambang 20 persen adalah pedoman, bukan hukum. Kursi dewan dan ketergantungan teknologi menunjukkan significant influence." },
            { text: "Significant influence — equity method, karena substansi pengaruhnya nyata", why: "Benar: klasifikasi mengikuti substansi pengaruh, bukan hanya persentase.", correct: true },
            { text: "Control — konsolidasi", why: "Salah: control umumnya butuh di atas 50 persen atau kendali atas kebijakan keuangan dan operasi." },
            { text: "Joint venture", why: "Salah: joint venture butuh kendali bersama berdasarkan perjanjian, bukan sekadar pengaruh signifikan." },
          ],
        },
      ],
      reference: "Pasif di bawah 20 persen: fair value. Significant influence 20 sampai 50 persen: equity method. Control di atas 50 persen: konsolidasi.",
    },
    {
      id: "equity-method",
      eyebrow: "Langkah 6 · Lab: Equity Method",
      title: "Equity method: investasimu tumbuh bersama laba mereka",
      prose: [
        "Di bawah equity method, investasi awal dicatat sebesar biaya perolehan. Setiap periode, investasi bertambah sebesar bagian investor atas laba investee, dan berkurang sebesar dividen yang diterima. Logikanya: laba investee menambah kekayaan investee sehingga menambah nilai investasimu; dividen mengeluarkan kas dari investee sehingga mengurangi nilai investasimu.",
        "Contoh ilustratif: PT Harmoni membeli 30 persen PT Mitra seharga Rp500 juta. PT Mitra mencatat laba Rp200 juta dan membagikan dividen Rp50 juta. Bagian Harmoni atas laba adalah 30 persen dari Rp200 juta = Rp60 juta — investasi naik menjadi Rp560 juta dan Harmoni mengakui penghasilan investasi Rp60 juta. Dividen yang diterima adalah 30 persen dari Rp50 juta = Rp15 juta — kas masuk Rp15 juta, investasi turun menjadi Rp545 juta. Dividen bukan penghasilan di bawah equity method; ia adalah pengembalian sebagian investasi.",
        "Inilah perbedaan yang paling sering diujikan: di bawah metode pasif, dividen adalah penghasilan; di bawah equity method, dividen mengurangi investasi dan laba investee-lah yang menjadi penghasilan. Analis yang salah membaca akan menggandakan penghasilan: menghitung laba investee sekaligus dividennya sebagai penghasilan.",
      ],
      formula: String.raw`\text{Investasi akhir} = \text{investasi awal} + (\% \times \text{laba investee}) - (\% \times \text{dividen})`,
      formulaNote: "Investasi awal Rp500 juta, kepemilikan 30 persen, laba investee Rp200 juta, dividen Rp50 juta (ilustratif). Interpretasi: investasi mengikuti kekayaan investee — naik Rp60 juta karena laba, turun Rp15 juta karena dividen. Contoh angka: 500 ditambah 60 dikurangi 15 = Rp545 juta.",
      tasks: [
        { id: "t1", text: "Hitung `bagian_laba` (30% dari laba investee Rp200 juta)" },
        { id: "t2", text: "Hitung `investasi_akhir` setelah dividen Rp50 juta, cetak keduanya" },
      ],
      expected: "bagian_laba=60  investasi_akhir=545",
      hints: [
        "Bagian laba = 30 persen dikali laba investee.",
        "Dividen diterima = 30 persen dikali dividen; kurangi dari investasi.",
        "bagian_laba = 0.30 * 200\ninvestasi_akhir = 500 + bagian_laba - 0.30 * 50",
      ],
      code: {
        starter: `investasi_awal = 500  # Rp juta, ilustratif\nlaba_investee, dividen = 200, 50\nporsi = 0.30\n\n# TULIS KODEMU\nbagian_laba = \ninvestasi_akhir = \n\nprint(f"bagian_laba={bagian_laba:.0f}  investasi_akhir={investasi_akhir:.0f}")`,
        lockLines: 3,
        solution: `investasi_awal = 500  # Rp juta, ilustratif\nlaba_investee, dividen = 200, 50\nporsi = 0.30\n\n# TULIS KODEMU\nbagian_laba = porsi * laba_investee\ninvestasi_akhir = investasi_awal + bagian_laba - porsi * dividen\n\nprint(f"bagian_laba={bagian_laba:.0f}  investasi_akhir={investasi_akhir:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bagian_laba", value: 60, tol: 1e-9, label: "`bagian_laba` seharusnya 60", msg: "30 persen dari 200 = 60. Ini penghasilan investasi yang diakui." },
          { kind: "equal", task: "t2", name: "investasi_akhir", value: 545, tol: 1e-9, label: "`investasi_akhir` seharusnya 545", msg: "500 ditambah 60 dikurangi dividen 15 = 545." },
          { kind: "stdout_matches", task: "t2", pattern: "bagian_laba=60\\s+investasi_akhir=545", label: "`print` menampilkan keduanya", msg: "Format: bagian_laba=...  investasi_akhir=... ." },
        ],
      },
      reference: "Equity method: investasi naik dengan bagian laba, turun dengan dividen. Dividen bukan penghasilan.",
    },
    {
      id: "goodwill-konsolidasi",
      eyebrow: "Langkah 7 · Goodwill & Konsolidasi",
      title: "Membeli perusahaan: harga, nilai wajar, dan goodwill",
      prose: [
        "Saat perusahaan mengakuisisi kendali atas perusahaan lain, ia membayar harga pembelian. Harga itu pertama-tama dialokasikan ke aset dan liabilitas investee yang diukur pada fair value. Selisih antara harga pembelian dan nilai wajar aset bersih yang diperoleh adalah goodwill — premi yang dibayar untuk sinergi, merek, pelanggan, dan segala hal yang tidak bisa diidentifikasi satu per satu.",
        "Contoh ilustratif: PT Harmoni membeli 100 persen PT Mitra seharga Rp1.000 juta. Nilai wajar aset bersih Mitra adalah Rp800 juta. Goodwill yang diakui adalah Rp200 juta. Goodwill bukan aset yang disusutkan — ia diuji impairment setiap tahun. Bila sinergi yang dijanjikan tidak terwujud, impairment goodwill menghantam laba tahun itu, kadang sangat besar.",
        "Konsolidasi berarti laporan induk dan anak digabung baris per baris: seluruh aset, liabilitas, pendapatan, dan beban anak masuk ke laporan konsolidasi, dengan transaksi antar perusahaan dieliminasi agar tidak menggandakan penjualan internal. Bila induk hanya memiliki 80 persen, sisa 20 persen diakui sebagai non-controlling interest di ekuitas dan laba. Analis membaca konsolidasi dengan satu pertanyaan: berapa banyak laba konsolidasi yang benar-benar milik pemegang saham induk, dan berapa banyak yang milik minoritas?",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Goodwill yang besar relatif terhadap ekuitas adalah bom waktu: satu impairment bisa menghapus laba setahun. Cek rasio goodwill terhadap ekuitas sebelum memuji akuisisi yang agresif.",
      },
      quiz: [
        {
          q: "Harga pembelian Rp1.000 juta, nilai wajar aset bersih yang diperoleh Rp800 juta. Goodwill?",
          options: [
            { text: "Rp200 juta", why: "Benar: 1.000 dikurangi 800 = 200. Premi atas nilai wajar aset bersih.", correct: true },
            { text: "Rp1.800 juta", why: "Salah: itu jumlah harga dan aset bersih — bukan selisihnya." },
            { text: "Rp0 — goodwill tidak diakui", why: "Salah: goodwill diakui saat harga melebihi nilai wajar aset bersih." },
            { text: "Rp800 juta", why: "Salah: itu nilai wajar aset bersih, bukan goodwill." },
          ],
        },
      ],
      reference: "Goodwill = harga pembelian dikurangi nilai wajar aset bersih. Diuji impairment, tidak disusutkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: beda temporer, DTL, tarif, equity method, dan goodwill.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Depresiasi dipercepat untuk pajak tetapi garis lurus untuk akuntansi. Jenis beda dan dampaknya?",
          options: [
            { text: "Beda permanen — tidak ada pajak tangguhan", why: "Salah: depresiasi dipercepat berbalik di masa depan, jadi ini beda temporer." },
            { text: "Beda temporer — menciptakan DTL karena pajak hari ini lebih kecil", why: "Benar: pajak ditunda ke masa depan; DTL mengakui kewajiban itu hari ini.", correct: true },
            { text: "Beda temporer — menciptakan DTA", why: "Salah: DTA muncul bila pajak hari ini lebih besar, bukan lebih kecil." },
            { text: "Bukan beda apa-apa", why: "Salah: nilai buku dan tax base berbeda — itu definisi beda temporer." },
          ],
        },
        {
          q: "Nilai buku Rp900 juta, tax base Rp500 juta, tarif 25 persen. DTL?",
          options: [
            { text: "Rp100 juta", why: "Benar: beda 400 dikali 25 persen = 100.", correct: true },
            { text: "Rp225 juta", why: "Salah: itu 25 persen dari nilai buku penuh — yang dipakai adalah bedanya." },
            { text: "Rp125 juta", why: "Salah: itu 25 persen dari tax base — bukan dari beda temporer." },
            { text: "Rp400 juta", why: "Salah: itu beda temporernya, belum dikali tarif." },
          ],
        },
        {
          q: "Laba sebelum pajak Rp800 juta, beban pajak Rp160 juta. ETR dan artinya?",
          options: [
            { text: "20 persen — di bawah tarif statutori 25 persen karena ada pengurang permanen", why: "Benar: 160 dibagi 800 = 20 persen; selisihnya dijelaskan rekonsiliasi ETR.", correct: true },
            { text: "25 persen — sama dengan statutori", why: "Salah: 160 dibagi 800 adalah 20 persen, bukan 25 persen." },
            { text: "32 persen", why: "Salah: hitung ulang 160 dibagi 800." },
            { text: "Tidak bisa dihitung tanpa tarif statutori", why: "Salah: ETR hanya butuh beban pajak dan laba sebelum pajak." },
          ],
        },
        {
          q: "Investor 30 persen memakai equity method. Investee laba Rp200 juta, dividen Rp50 juta. Penghasilan investasi yang diakui?",
          options: [
            { text: "Rp60 juta dari bagian laba; dividen Rp15 juta mengurangi investasi", why: "Benar: penghasilan adalah bagian laba; dividen bukan penghasilan di bawah equity method.", correct: true },
            { text: "Rp15 juta dari dividen", why: "Salah: itu perlakuan metode pasif, bukan equity method." },
            { text: "Rp75 juta — laba dan dividen dijumlahkan", why: "Salah: menggandakan — dividen adalah distribusi dari laba yang sama." },
            { text: "Rp0 — tunggu investee dijual", why: "Salah: equity method mengakui bagian laba saat investee mencatatnya." },
          ],
        },
        {
          q: "Goodwill Rp200 juta dari akuisisi. Perlakuan selanjutnya?",
          options: [
            { text: "Disusutkan Rp20 juta per tahun selama 10 tahun", why: "Salah: goodwill tidak disusutkan; ia diuji impairment." },
            { text: "Diuji impairment setiap tahun; impairment diakui bila nilai terpulihkan di bawah nilai tercatat", why: "Benar: goodwill tidak diamortisasi, tetapi diuji penurunan nilai secara berkala.", correct: true },
            { text: "Langsung dihapus ke ekuitas", why: "Salah: goodwill diakui sebagai aset di neraca." },
            { text: "Tidak pernah berubah nilainya", why: "Salah: impairment bisa menurunkannya, kadang sangat besar." },
          ],
        },
      ],
      summary: [
        "Beda temporer berbalik dan menciptakan DTL atau DTA; beda permanen hanya mengubah ETR.",
        "DTL = beda temporer kena pajak dikali tarif; DTA yang diragukan dikurangi valuation allowance.",
        "Tarif berubah = DTL dan DTA diukur ulang, selisih lewat laba rugi.",
        "ETR = beban pajak dibagi laba sebelum pajak; baca rekonsiliasinya sebelum memproyeksikan pajak.",
        "Pasif di bawah 20 persen, equity method 20 sampai 50 persen, konsolidasi di atas 50 persen; goodwill = harga dikurangi nilai wajar aset bersih.",
      ],
      next: { label: "PM-A2B — Quant Lanjut: Distribusi, Uji Hipotesis & Regresi", href: "/learn/pm-a2b-quant-lanjut" },
    },
  ],
};
