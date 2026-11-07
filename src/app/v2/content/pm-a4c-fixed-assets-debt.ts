import type { V2Lesson } from "../lib/types";

export const pma4c: V2Lesson = {
  slug: "pm-a4c-fixed-assets-debt",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A4C Aset Tetap, Utang & Sewa",
  estMinutes: 60,
  steps: [
    {
      id: "kapitalisasi-vs-beban",
      eyebrow: "Langkah 1 · Kapitalisasi vs Beban",
      title: "Satu pengeluaran, dua cerita laba",
      prose: [
        "PT BangunKarya (fiktif, ilustratif) mengeluarkan Rp100 juta untuk pengembangan perangkat lunak internal. Bila dibebankan langsung, laba tahun ini turun Rp100 juta. Bila dikapitalisasi sebagai aset lalu diamortisasi Rp20 juta per tahun selama lima tahun, laba tahun ini hanya turun Rp20 juta — dan empat tahun berikutnya masing-masing turun Rp20 juta. Total beban lima tahun sama, tetapi pola labanya sangat berbeda.",
        "Kriteria kapitalisasi di bawah IFRS: pengeluaran diakui sebagai aset bila kemungkinan besar menghasilkan manfaat ekonomi masa depan dan biayanya dapat diukur andal. Biaya riset selalu dibebankan; biaya pengembangan dikapitalisasi bila kriteria terpenuhi. Di bawah US GAAP, biaya pengembangan perangkat lunak internal umumnya dibebankan, kecuali setelah kelayakan teknologi tercapai — perbedaan yang membuat laba emiten teknologi IFRS dan US GAAP sulit dibandingkan tanpa penyesuaian.",
        "Dampak ke arus kas sama pentingnya dengan dampak ke laba. Kapitalisasi memindahkan kas keluar dari arus kas operasi ke arus kas investasi — CFO terlihat lebih tinggi, padahal total kas yang keluar sama. Analis yang hanya membaca CFO akan mengira perusahaan makin sehat, padahal ia hanya memindahkan pos. Inilah sebabnya kapitalisasi agresif adalah red flag klasik: laba naik dan CFO naik, tanpa satu rupiah tambahan kas masuk.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan CFO dua emiten tanpa memeriksa kebijakan kapitalisasinya. Emiten yang mengkapitalisasi agresif menampilkan CFO yang mengembang — samakan perlakuannya dulu, atau pakai arus kas bebas yang mengurangkan capex.",
      },
      reference: "Kapitalisasi menunda beban dan memindahkan kas dari operasi ke investasi. Total kas sama, tampilannya berbeda.",
    },
    {
      id: "depresiasi",
      eyebrow: "Langkah 2 · Lab: Depresiasi",
      title: "Tiga cara menyusutkan mesin yang sama",
      prose: [
        "PT BangunKarya membeli mesin seharga Rp120 juta (ilustratif), nilai residu Rp20 juta, umur manfaat 5 tahun, total kapasitas 100.000 unit. Tiga metode depresiasi menghasilkan tiga pola beban yang berbeda — padahal mesinnya sama dan kas yang keluar sama.",
        "Straight-line membagi rata: (120 dikurangi 20) dibagi 5 = Rp20 juta per tahun. Declining-balance memakai tarif dua kali tarif garis lurus — 40 persen per tahun — atas nilai buku: tahun pertama 40 persen dari Rp120 juta = Rp48 juta, tahun kedua 40 persen dari Rp72 juta = Rp28,8 juta. Beban besar di awal, mengecil kemudian. Units-of-production mengikuti pemakaian: tahun pertama mesin memproduksi 25.000 unit, sehingga bebannya (120 dikurangi 20) dikali 25.000 dibagi 100.000 = Rp25 juta.",
        "Pilihan metode memengaruhi laba, pajak, dan rasio — tetapi tidak pernah memengaruhi kas. Metode dipercepat menurunkan laba awal dan menunda pajak; garis lurus meratakan laba. Analis tidak menilai metode mana yang benar — ia menilai apakah metode itu konsisten, apakah umur manfaatnya masuk akal dibanding pesaing, dan apakah perubahan metode dipakai untuk mendongkrak laba.",
      ],
      formula: String.raw`\text{SL} = \frac{\text{biaya} - \text{residu}}{\text{umur}} \quad;\quad \text{DDB} = \text{tarif} \times \text{nilai buku awal tahun} \quad;\quad \text{UOP} = (\text{biaya} - \text{residu}) \times \frac{\text{unit tahun ini}}{\text{total unit}}`,
      formulaNote: "Biaya Rp120 juta, residu Rp20 juta, umur 5 tahun, tarif DDB 40 persen (ilustratif). Interpretasi: ketiga metode mengalokasikan total yang sama — Rp100 juta selama umur aset — hanya polanya berbeda; depresiasi adalah alokasi, bukan penilaian. Contoh angka: SL Rp20 juta per tahun; DDB tahun pertama Rp48 juta, tahun kedua Rp28,8 juta; UOP tahun pertama Rp25 juta untuk 25.000 unit.",
      tasks: [
        { id: "t1", text: "Hitung `sl` (straight-line per tahun) dan `ddb1` (tahun pertama declining-balance)" },
        { id: "t2", text: "Hitung `ddb2` (tahun kedua) dan `uop` (tahun pertama, 25.000 unit), cetak semuanya" },
      ],
      expected: "sl=20.0  ddb1=48.0  ddb2=28.8  uop=25.0",
      hints: [
        "SL = (biaya dikurangi residu) dibagi umur.",
        "DDB tahun pertama = 40 persen dari biaya; tahun kedua = 40 persen dari nilai buku setelah tahun pertama.",
        "sl = (120 - 20) / 5\nddb1 = 120 * 0.40\nddb2 = (120 - ddb1) * 0.40\nuop = (120 - 20) * 25000 / 100000",
      ],
      code: {
        starter: `biaya, residu, umur = 120, 20, 5  # Rp juta, ilustratif\nunit_tahun1, total_unit = 25000, 100000\n\n# TULIS KODEMU\nsl = \nddb1 = \nddb2 = \nuop = \n\nprint(f"sl={sl:.1f}  ddb1={ddb1:.1f}  ddb2={ddb2:.1f}  uop={uop:.1f}")`,
        lockLines: 2,
        solution: `biaya, residu, umur = 120, 20, 5  # Rp juta, ilustratif\nunit_tahun1, total_unit = 25000, 100000\n\n# TULIS KODEMU\nsl = (biaya - residu) / umur\nddb1 = biaya * 0.40\nddb2 = (biaya - ddb1) * 0.40\nuop = (biaya - residu) * unit_tahun1 / total_unit\n\nprint(f"sl={sl:.1f}  ddb1={ddb1:.1f}  ddb2={ddb2:.1f}  uop={uop:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sl", value: 20.0, tol: 1e-9, label: "`sl` seharusnya 20.0", msg: "(120 dikurangi 20) dibagi 5 = 20." },
          { kind: "equal", task: "t1", name: "ddb1", value: 48.0, tol: 1e-9, label: "`ddb1` seharusnya 48.0", msg: "40 persen dari 120 = 48." },
          { kind: "equal", task: "t2", name: "ddb2", value: 28.8, tol: 1e-9, label: "`ddb2` seharusnya 28.8", msg: "40 persen dari nilai buku 72 = 28,8." },
          { kind: "equal", task: "t2", name: "uop", value: 25.0, tol: 1e-9, label: "`uop` seharusnya 25.0", msg: "100 dikali 25.000 dibagi 100.000 = 25." },
          { kind: "stdout_matches", task: "t2", pattern: "sl=20\\.0\\s+ddb1=48\\.0\\s+ddb2=28\\.8\\s+uop=25\\.0", label: "`print` menampilkan semuanya", msg: "Format: sl=...  ddb1=...  ddb2=...  uop=... ." },
        ],
      },
      reference: "SL merata, DDB besar di awal, UOP mengikuti pemakaian. Total alokasi sama: biaya dikurangi residu.",
    },
    {
      id: "impairment-revaluasi",
      eyebrow: "Langkah 3 · Impairment & Revaluasi",
      title: "Saat aset tidak lagi sebanding dengan catatannya",
      prose: [
        "Impairment terjadi ketika nilai tercatat aset melebihi jumlah yang bisa dipulihkan darinya. Di bawah IFRS, jumlah terpulihkan adalah yang lebih tinggi antara fair value dikurangi biaya penjualan dan value in use (nilai kini arus kas masa depan dari aset itu). Di bawah US GAAP, pengujiannya dua tahap: pertama bandingkan nilai tercatat dengan arus kas masa depan yang tidak didiskonto — bila lebih kecil, barulah ukur kerugian sebagai selisih dengan fair value.",
        "Contoh ilustratif: mesin PT BangunKarya tercatat Rp80 juta. Fair value dikurangi biaya penjualan Rp60 juta, value in use Rp65 juta — jumlah terpulihkan IFRS adalah Rp65 juta, sehingga impairment Rp15 juta diakui dan laba turun Rp15 juta. Di bawah US GAAP, arus kas tidak didiskonto sebesar Rp70 juta masih di bawah nilai tercatat Rp80 juta, sehingga impairment diukur terhadap fair value Rp60 juta — kerugiannya Rp20 juta. Standar yang sama-sama bernama impairment, angka yang berbeda.",
        "Revaluasi memperlebar jurang. IFRS mengizinkan aset tetap direvaluasi ke fair value — kenaikan dicatat di ekuitas (revaluation surplus), bukan laba, dan depresiasi berikutnya dihitung dari nilai baru yang lebih tinggi. US GAAP melarang revaluasi ke atas: nilai tercatat tidak boleh melebihi biaya historis dikurangi depresiasi dan impairment. Sebaliknya, reversal impairment: IFRS mengizinkan pembalikan (kecuali goodwill), US GAAP melarangnya. Analis yang membandingkan emiten IFRS dan US GAAP wajib menyesuaikan ketiga asimetri ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Impairment yang tidak diakui padahal harga jual aset jatuh adalah laba yang dilebih-lebihkan. Cek apakah manajemen menunda impairment dengan asumsi arus kas yang terlalu optimistis — value in use adalah tempat asumsi bersembunyi.",
      },
      quiz: [
        {
          q: "Aset tercatat Rp80 juta. Fair value dikurangi biaya penjualan Rp60 juta, value in use Rp65 juta. Impairment IFRS?",
          options: [
            { text: "Rp15 juta", why: "Benar: jumlah terpulihkan adalah yang lebih tinggi, Rp65 juta; 80 dikurangi 65 = 15.", correct: true },
            { text: "Rp20 juta", why: "Salah: itu hasil US GAAP terhadap fair value Rp60 juta — bukan cara IFRS." },
            { text: "Rp0 — tidak ada impairment", why: "Salah: nilai tercatat 80 melebihi jumlah terpulihkan 65." },
            { text: "Rp5 juta", why: "Salah: itu selisih fair value dan value in use, bukan kerugian impairment." },
          ],
        },
      ],
      reference: "IFRS: terpulihkan = lebih tinggi dari fair value kurang biaya jual dan value in use; reversal boleh kecuali goodwill. US GAAP: uji dua tahap; revaluasi ke atas dan reversal dilarang.",
    },
    {
      id: "derecognition",
      eyebrow: "Langkah 4 · Derecognition",
      title: "Menjual mesin tua: untung atau rugi?",
      prose: [
        "Saat aset tetap dijual atau dihentikan, ia dikeluarkan dari neraca (derecognition) dan selisih antara hasil penjualan dan nilai buku diakui sebagai keuntungan atau kerugian di laba rugi. Rumusnya: gain atau loss = hasil penjualan dikurangi nilai buku.",
        "Contoh ilustratif: mesin PT BangunKarya dibeli Rp120 juta, akumulasi depresiasi Rp72 juta, nilai buku Rp48 juta. Dijual seharga Rp55 juta — keuntungannya Rp7 juta. Dijual seharga Rp40 juta — kerugiannya Rp8 juta. Keuntungan ini bukan arus kas operasi murni: hasil penjualan aset adalah arus kas investasi, sedangkan keuntungan Rp7 juta hanya angka akuntansi di laba rugi.",
        "Jebakan analis ada dua. Pertama, keuntungan penjualan aset bersifat sekali saja — seperti LIFO liquidation, ia harus dikeluarkan dari laba normalisasi sebelum valuasi. Kedua, perusahaan yang rutin menjual aset untuk menambal laba operasi sedang menghabiskan modalnya sendiri: keuntungan hari ini adalah kapasitas produksi yang hilang besok. Cek frekuensinya: penjualan aset sekali dalam lima tahun wajar; setiap tahun berarti model bisnisnya bocor.",
      ],
      formula: String.raw`\text{Gain/Loss} = \text{hasil penjualan} - \text{nilai buku} \quad;\quad \text{nilai buku} = \text{biaya} - \text{akumulasi depresiasi}`,
      formulaNote: "Biaya Rp120 juta, akumulasi depresiasi Rp72 juta, nilai buku Rp48 juta (ilustratif). Interpretasi: keuntungan hanya muncul bila harga jual melebihi nilai buku — bukan bila harga jual melebihi biaya awal. Contoh angka: jual Rp55 juta menghasilkan gain Rp7 juta; jual Rp40 juta menghasilkan loss Rp8 juta.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira keuntungan penjualan aset adalah kas operasi. Hasil penjualannya masuk arus kas investasi; keuntungannya hanya penyesuaian akuntansi di laba rugi.",
      },
      reference: "Gain = hasil jual dikurangi nilai buku. Sekali saja — keluarkan dari laba normalisasi.",
    },
    {
      id: "utang-obligasi",
      eyebrow: "Langkah 5 · Utang: Obligasi",
      title: "Obligasi diskon: utang yang tumbuh sendiri",
      prose: [
        "Obligasi diterbitkan pada nilai par bila kupon sama dengan tingkat pasar, pada diskon bila kupon di bawah tingkat pasar, dan pada premium bila kupon di atas tingkat pasar. Harga penerbitan adalah nilai kini dari seluruh kupon dan pokok yang didiskonto pada tingkat pasar — bukan pada tingkat kupon.",
        "Contoh ilustratif: obligasi 3 tahun, nilai par Rp1.000 juta, kupon 5 persen per tahun (Rp50 juta), tingkat pasar 6 persen. Harganya adalah 50 dibagi 1,06 ditambah 50 dibagi 1,06 kuadrat ditambah 1.050 dibagi 1,06 pangkat tiga = Rp973,27 juta. Diskon Rp26,73 juta bukan kerugian — ia adalah bunga tambahan yang akan diakui selama umur obligasi.",
        "Amortisasi memakai effective interest method: beban bunga tiap tahun adalah nilai tercatat dikalikan tingkat pasar 6 persen, sedangkan kas kupon yang dibayar tetap Rp50 juta. Tahun pertama: beban bunga 6 persen dari Rp973,27 juta = Rp58,40 juta; kupon dibayar Rp50 juta; selisih Rp8,40 juta mengamortisasi diskon dan menaikkan nilai tercatat menjadi Rp981,67 juta. Tahun demi tahun, nilai tercatat merangkak naik hingga tepat Rp1.000 juta saat jatuh tempo. Pola ini penting: beban bunga riil (6 persen) lebih besar dari kupon kas (5 persen) — analis yang memakai kupon sebagai beban bunga akan meremehkan biaya utang.",
      ],
      formula: String.raw`\text{Harga obligasi} = \sum \frac{\text{kupon}}{(1+r)^t} + \frac{\text{pokok}}{(1+r)^N} \quad;\quad \text{beban bunga} = \text{nilai tercatat} \times r`,
      formulaNote: "Kupon Rp50 juta per tahun, pokok Rp1.000 juta, tingkat pasar r = 6 persen, tenor 3 tahun (ilustratif). Interpretasi: pasar hanya mau membayar Rp973,27 juta untuk janji kupon 5 persen saat ia bisa mendapat 6 persen di tempat lain — selisihnya adalah kompensasi. Contoh angka: harga Rp973,27 juta; beban bunga tahun pertama Rp58,40 juta; amortisasi diskon tahun pertama Rp8,40 juta.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Obligasi diskon yang besar berarti perusahaan membayar bunga efektif jauh di atas kuponnya. Cek interest coverage dengan beban bunga efektif, bukan kupon — coverage bisa jauh lebih tipis dari yang terlihat.",
      },
      quiz: [
        {
          q: "Obligasi kupon 5 persen diterbitkan saat tingkat pasar 6 persen. Bagaimana harga dan beban bunganya?",
          options: [
            { text: "Harga di atas par; beban bunga sama dengan kupon", why: "Salah: kupon di bawah pasar berarti harga di bawah par, dan beban bunga mengikuti tingkat pasar." },
            { text: "Harga di bawah par (diskon); beban bunga di atas kupon dan naik bersama nilai tercatat", why: "Benar: harga Rp973,27 juta; beban bunga tahun pertama Rp58,40 juta, di atas kupon Rp50 juta.", correct: true },
            { text: "Harga tepat par; beban bunga 5 persen", why: "Salah: harga par hanya bila kupon sama dengan tingkat pasar." },
            { text: "Harga di bawah par; beban bunga di bawah kupon", why: "Salah: beban bunga efektif 6 persen justru di atas kupon 5 persen." },
          ],
        },
      ],
      reference: "Harga = PV kupon dan pokok pada tingkat pasar. Beban bunga = nilai tercatat dikali tingkat pasar.",
    },
    {
      id: "sewa-ifrs16",
      eyebrow: "Langkah 6 · Lab: Sewa IFRS 16",
      title: "Sewa yang akhirnya masuk neraca",
      prose: [
        "IFRS 16 dan PSAK 116 menghapus sewa operasi dari luar neraca bagi penyewa: hampir semua sewa kini diakui sebagai right-of-use asset dan lease liability sebesar nilai kini pembayaran sewa. Sewa bukan lagi beban sewa sederhana — ia menjadi aset yang disusutkan dan utang yang berbunga.",
        "Contoh ilustratif: PT BangunKarya menyewa gudang dengan pembayaran Rp100 juta per tahun selama 4 tahun, tingkat diskonto 8 persen. Lease liability adalah nilai kini pembayaran: 100 dikali (1 dikurangi 1,08 pangkat negatif 4) dibagi 0,08 = Rp331,21 juta. Right-of-use asset diakui sebesar Rp331,21 juta yang sama pada awal sewa. Neraca langsung membengkak Rp331,21 juta di kedua sisi — leverage naik tanpa perusahaan meminjam satu rupiah pun dari bank.",
        "Perbedaan dengan US GAAP ada pada laba rugi. Di bawah IFRS 16, penyewa mengakui depresiasi aset hak-guna plus beban bunga atas liabilitas — beban total besar di awal (front-loaded). Di bawah US GAAP, sewa operasi tetap diakui sebagai beban sewa garis lurus tunggal, meskipun liabilitasnya kini juga masuk neraca. Dampak ke rasio: EBITDA naik di bawah IFRS 16 karena beban sewa berpindah dari beban operasi ke depresiasi dan bunga — analis yang membandingkan EBITDA lintas standar tanpa penyesuaian akan tertipu.",
      ],
      formula: String.raw`\text{Lease liability} = PMT \times \frac{1 - (1+r)^{-N}}{r}`,
      formulaNote: "PMT Rp100 juta per tahun, r = 8 persen, N = 4 tahun (ilustratif). Interpretasi: liabilitas sewa adalah nilai hari ini dari seluruh pembayaran masa depan — Rp331,21 juta, bukan total nominal Rp400 juta. Contoh angka: 100 dikali 3,3121 = Rp331,21 juta; total bunga selama sewa adalah Rp400 dikurangi Rp331,21 = Rp68,79 juta.",
      tasks: [
        { id: "t1", text: "Hitung `pv` lease liability (nilai kini 4 pembayaran Rp100 juta, diskonto 8%)" },
        { id: "t2", text: "Cetak hasilnya dengan 2 desimal" },
      ],
      expected: "pv=331.21",
      hints: [
        "Anuitas: PV = PMT dikali (1 dikurangi (1+r) pangkat negatif N) dibagi r.",
        "PMT = 100, r = 0.08, N = 4.",
        "pv = 100 * (1 - (1 + 0.08)**-4) / 0.08",
      ],
      code: {
        starter: `pmt, r, n = 100, 0.08, 4  # Rp juta, ilustratif\n\n# TULIS KODEMU\npv = \n\nprint(f"pv={pv:.2f}")`,
        lockLines: 1,
        solution: `pmt, r, n = 100, 0.08, 4  # Rp juta, ilustratif\n\n# TULIS KODEMU\npv = pmt * (1 - (1 + r)**-n) / r\n\nprint(f"pv={pv:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "pv", value: 331.21, tol: 0.01, label: "`pv` sekitar 331.21", msg: "100 dikali faktor anuitas 3,3121 = 331,21." },
          { kind: "stdout_matches", task: "t2", pattern: "pv=331\\.21", label: "`print` menampilkan pv", msg: "Format: pv=331.21." },
        ],
      },
      reference: "IFRS 16: sewa masuk neraca sebagai ROU asset dan lease liability sebesar PV pembayaran.",
    },
    {
      id: "minicase-sale-leaseback",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Jual gedung, sewa kembali: kas hari ini, beban esok",
      prose: [
        "PT BangunKarya menjual gedung kantornya seharga Rp1.000 juta (ilustratif) dan langsung menyewanya kembali selama 10 tahun. Kas masuk Rp1.000 juta hari ini, gedung hilang dari neraca, dan muncul right-of-use asset beserta lease liability sebesar nilai kini pembayaran sewa. Di laba rugi, beban depresiasi gedung digantikan depresiasi aset hak-guna plus beban bunga sewa.",
        "Sale-and-leaseback adalah transaksi yang sah tetapi rawan disalahbaca. Keuntungan penjualan yang diakui hari ini bersifat sekali saja — seperti penjualan aset di langkah 4, ia harus dikeluarkan dari laba normalisasi. Yang lebih penting: perusahaan menukar aset yang ia miliki dengan kewajiban sewa 10 tahun. Leverage ekonominya tidak hilang; ia berubah bentuk dari kepemilikan menjadi kewajiban kontraktual.",
        "Analis menilai transaksi ini dengan tiga pertanyaan. Pertama, apakah harga jual wajar — harga di atas fair value berarti sebagian hasil penjualan sebenarnya pinjaman terselubung. Kedua, berapa total pembayaran sewa selama 10 tahun dibanding harga jual — bila jauh lebih besar, perusahaan membayar mahal untuk kas hari ini. Ketiga, apa yang dilakukan dengan kas Rp1.000 juta itu — melunasi utang berbunga tinggi adalah penggunaan sehat; menambal laba operasi adalah tanda bahaya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sale-and-leaseback menjelang akhir tahun yang menghasilkan keuntungan besar adalah pola klasik window dressing: laba dan kas membaik bersamaan, tetapi kewajiban 10 tahun tidak terlihat di headline.",
      },
      reference: "Sale-and-leaseback: kas hari ini, kewajiban sewa esok. Nilai harga jual dan total sewa sebelum memuji.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: kapitalisasi, depresiasi, impairment, obligasi, dan sewa.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Perusahaan mengkapitalisasi biaya pengembangan Rp100 juta dan mengamortisasi Rp20 juta per tahun. Dampak ke CFO tahun pertama?",
          options: [
            { text: "CFO turun Rp100 juta", why: "Salah: kas keluar Rp100 juta dicatat sebagai arus kas investasi, bukan operasi." },
            { text: "CFO lebih tinggi Rp80 juta dibanding bila dibebankan, karena hanya amortisasi Rp20 juta yang mengurangi laba", why: "Benar: kapitalisasi memindahkan Rp100 juta ke investasi; CFO hanya terbebani amortisasi Rp20 juta lewat laba.", correct: true },
            { text: "CFO tidak berubah sama sekali", why: "Salah: laba yang masuk ke CFO berubah — kapitalisasi menaikkan laba tahun pertama Rp80 juta." },
            { text: "CFO naik Rp100 juta", why: "Salah: kas keluar tetap Rp100 juta — hanya klasifikasinya yang pindah." },
          ],
        },
        {
          q: "Mesin Rp120 juta, residu Rp20 juta, umur 5 tahun. Beban depresiasi tahun pertama declining-balance 40 persen?",
          options: [
            { text: "Rp48 juta", why: "Benar: 40 persen dari Rp120 juta = Rp48 juta.", correct: true },
            { text: "Rp20 juta", why: "Salah: itu straight-line, bukan declining-balance." },
            { text: "Rp28,8 juta", why: "Salah: itu tahun kedua — 40 persen dari nilai buku Rp72 juta." },
            { text: "Rp25 juta", why: "Salah: itu units-of-production untuk 25.000 unit." },
          ],
        },
        {
          q: "IFRS mengizinkan apa yang dilarang US GAAP untuk aset tetap?",
          options: [
            { text: "Revaluasi ke atas dan reversal impairment (kecuali goodwill)", why: "Benar: kedua hal ini diizinkan IFRS dan dilarang US GAAP.", correct: true },
            { text: "Depresiasi garis lurus", why: "Salah: kedua standar mengizinkan garis lurus." },
            { text: "Impairment", why: "Salah: kedua standar mewajibkan impairment, hanya cara ukurnya berbeda." },
            { text: "Kapitalisasi biaya pengembangan", why: "Salah: perbedaan ini soal aset takberwujud, bukan revaluasi aset tetap." },
          ],
        },
        {
          q: "Obligasi par Rp1.000 juta, kupon 5 persen, tingkat pasar 6 persen, tenor 3 tahun. Harga penerbitan?",
          options: [
            { text: "Rp973,27 juta (diskon)", why: "Benar: PV kupon dan pokok pada 6 persen = Rp973,27 juta.", correct: true },
            { text: "Rp1.000 juta (par)", why: "Salah: harga par hanya bila kupon sama dengan tingkat pasar." },
            { text: "Rp1.026,73 juta (premium)", why: "Salah: premium terjadi bila kupon di atas tingkat pasar." },
            { text: "Rp950 juta", why: "Salah: hitung PV-nya — 50 dibagi 1,06 ditambah 50 dibagi 1,06 kuadrat ditambah 1.050 dibagi 1,06 pangkat tiga." },
          ],
        },
        {
          q: "Sewa 4 tahun, pembayaran Rp100 juta per tahun, diskonto 8 persen. Lease liability awal?",
          options: [
            { text: "Rp331,21 juta", why: "Benar: 100 dikali faktor anuitas 3,3121 = Rp331,21 juta.", correct: true },
            { text: "Rp400 juta", why: "Salah: itu total nominal tanpa diskonto — liabilitas adalah nilai kini." },
            { text: "Rp100 juta", why: "Salah: itu satu pembayaran tahunan, bukan seluruh kewajiban." },
            { text: "Rp68,79 juta", why: "Salah: itu total bunga selama sewa, bukan liabilitasnya." },
          ],
        },
      ],
      summary: [
        "Kapitalisasi menunda beban dan memindahkan kas dari operasi ke investasi.",
        "Depresiasi: SL merata, DDB besar di awal, UOP mengikuti pemakaian; total alokasi sama.",
        "Impairment: IFRS pakai jumlah terpulihkan tertinggi; US GAAP uji dua tahap; revaluasi ke atas dan reversal hanya IFRS.",
        "Obligasi: harga = PV pada tingkat pasar; beban bunga efektif di atas kupon bila diskon.",
        "IFRS 16: sewa masuk neraca sebagai ROU asset dan lease liability sebesar PV pembayaran.",
      ],
      next: { label: "PM-A4D — Pajak Tangguhan & Intercorporate Investments", href: "/learn/pm-a4d-tax-intercorporate" },
    },
  ],
};
