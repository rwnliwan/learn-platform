import type { V2Lesson } from "../lib/types";

export const pma5b: V2Lesson = {
  slug: "pm-a5b-struktur-modal",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A5B Corporate Issuers: Struktur Modal & Kebijakan Dividen",
  estMinutes: 60,
  steps: [
    {
      id: "mm-tanpa-pajak",
      eyebrow: "Langkah 1 · Modigliani-Miller Tanpa Pajak",
      title: "Tanpa pajak, struktur modal tidak mengubah nilai perusahaan",
      prose: [
        "PM-A5 mengajarkan WACC sebagai hurdle rate dan CCC sebagai ukuran kas yang nyangkut. Lesson ini menjawab pertanyaan berikutnya: berapa banyak utang yang seharusnya dipakai perusahaan, dan berapa banyak laba yang seharusnya dibagikan sebagai dividen. Bobot Corporate Issuers di CFA Level 1 adalah sekitar 8 sampai 12 persen (rentang bobot yang umum dipublikasikan, bukan angka pasti) — dan struktur modal serta dividen adalah bagian yang paling sering diuji dari topik itu.",
        "Teorema Modigliani-Miller tanpa pajak mengatakan nilai perusahaan tidak tergantung pada struktur modalnya. Intuisinya adalah arbitrase buatan sendiri: investor bisa meniru leverage perusahaan dengan meminjam sendiri, sehingga perusahaan tidak bisa menciptakan nilai hanya dengan mengubah campuran utang dan ekuitas. Yang menentukan nilai hanyalah arus kas operasi dari asetnya — bukan cara aset itu dibiayai. Contoh ilustratif: PT Maju Bersama menghasilkan EBIT Rp100 miliar per tahun selamanya (ilustratif), biaya modal asetnya 10 persen, sehingga nilai perusahaan tanpa utang adalah 100 dibagi 0,10 sama dengan Rp1.000 miliar (ilustratif).",
        "Bila perusahaan itu meminjam Rp400 miliar (ilustratif) dengan bunga 8 persen, nilai totalnya tetap Rp1.000 miliar (ilustratif) — hanya komposisinya berubah: utang Rp400 miliar dan ekuitas Rp600 miliar. Yang berubah adalah risiko pemegang saham: laba untuk ekuitas menjadi 100 dikurangi bunga 32 sama dengan Rp68 miliar (ilustratif), dan return ekuitas naik dari 10 persen menjadi 68 dibagi 600 sama dengan 11,33 persen (ilustratif). Return yang lebih tinggi itu bukan hadiah gratis — ia adalah kompensasi atas risiko yang lebih besar, karena bunga harus dibayar bahkan saat EBIT jatuh. Leverage menggeser risiko, bukan menciptakan nilai.",
      ],
      formula: String.raw`V_L = V_U \quad \text{(tanpa pajak)} \qquad;\qquad V_U = \frac{EBIT}{r_u}`,
      formulaNote: "V_L = nilai perusahaan berutang; V_U = nilai perusahaan tanpa utang; EBIT = laba sebelum bunga dan pajak (Rp100 miliar per tahun, ilustratif); r_u = biaya modal aset atau unlevered cost of capital (10 persen, ilustratif). Interpretasi: tanpa pajak, biaya kebangkrutan, dan biaya keagenan, membelah perusahaan menjadi utang dan ekuitas tidak mengubah total nilainya — seperti memotong pizza menjadi lebih banyak irisan tidak menambah pizzanya. Contoh angka: V_U = 100 dibagi 0,10 = Rp1.000 miliar; dengan utang Rp400 miliar, ekuitas bernilai Rp600 miliar dan return ekuitas 68 dibagi 600 = 11,33 persen.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menyimpulkan leverage selalu menguntungkan karena return ekuitas naik. Return naik karena risiko naik — dalam dunia MM tanpa pajak, return yang disesuaikan risiko tidak berubah sama sekali.",
      },
      quiz: [
        {
          q: "Dalam dunia Modigliani-Miller tanpa pajak, perusahaan mengganti separuh ekuitasnya dengan utang. Apa yang terjadi pada nilai total perusahaan?",
          options: [
            { text: "Nilai naik karena utang lebih murah dari ekuitas", why: "Salah: utang tampak murah hanya karena risikonya lebih rendah — biaya ekuitas naik persis mengimbangi, sehingga nilai total tidak berubah." },
            { text: "Nilai tidak berubah — hanya risiko dan return pemegang saham yang naik", why: "Benar: nilai ditentukan arus kas aset; leverage hanya membelah arus kas itu dan menggeser risiko ke pemegang saham.", correct: true },
            { text: "Nilai turun karena risiko kebangkrutan naik", why: "Salah: dalam asumsi MM tanpa pajak tidak ada biaya kebangkrutan — itu baru muncul di trade-off theory." },
            { text: "Nilai naik karena bunga mengurangi pajak", why: "Salah: tanpa pajak tidak ada tax shield — penghematan pajak baru ada di MM dengan pajak." },
          ],
        },
      ],
      reference: "MM tanpa pajak: V_L sama dengan V_U. Leverage menggeser risiko, bukan menciptakan nilai.",
    },
    {
      id: "mm-dengan-pajak",
      eyebrow: "Langkah 2 · Lab: MM Dengan Pajak",
      title: "Pajak membuat utang berharga: tax shield menambah nilai",
      prose: [
        "Begitu pajak perusahaan diperkenalkan, kesimpulan MM berbalik: utang kini menambah nilai, karena bunga bisa dikurangkan dari laba kena pajak sedangkan dividen tidak. Setiap rupiah bunga menghemat pajak sebesar tarif pajak dikali bunga itu — dan nilai kini dari seluruh penghematan pajak masa depan itu disebut tax shield. Rumusnya sederhana: nilai perusahaan berutang sama dengan nilai tanpa utang ditambah tarif pajak dikali utang.",
        "Contoh ilustratif yang sama: PT Maju Bersama bernilai Rp1.000 miliar tanpa utang (ilustratif), tarif pajak 25 persen, dan meminjam Rp400 miliar (ilustratif). Penghematan pajak per tahun adalah 25 persen dikali bunga 8 persen dikali 400 sama dengan Rp8 miliar per tahun (ilustratif). Nilai kini penghematan itu, didiskon pada biaya utang 8 persen, adalah 8 dibagi 0,08 sama dengan Rp100 miliar (ilustratif) — persis sama dengan tarif pajak dikali utang, 0,25 dikali 400.",
        "Implikasi ekstremnya patut dicatat: bila hanya tax shield yang diperhitungkan, perusahaan seharusnya berutang 100 persen — kesimpulan yang jelas salah di dunia nyata, karena perusahaan yang berutang penuh akan bangkrut pada guncangan pertama. Itulah sebabnya MM dengan pajak adalah setengah cerita: ia menjelaskan mengapa utang menarik, tetapi butuh trade-off theory untuk menjelaskan mengapa perusahaan berhenti sebelum 100 persen. Hitung sendiri di lab.",
      ],
      formula: String.raw`V_L = V_U + T_c \times D \qquad;\qquad \text{PV tax shield} = \frac{T_c \times r_d \times D}{r_d} = T_c \times D`,
      formulaNote: "V_L = nilai perusahaan berutang; V_U = nilai tanpa utang (Rp1.000 miliar, ilustratif); T_c = tarif pajak perusahaan (25 persen, ilustratif); D = utang (Rp400 miliar, ilustratif); r_d = biaya utang (8 persen, ilustratif). Interpretasi: setiap rupiah utang menambah nilai sebesar tarif pajak, karena bunga menghemat pajak selamanya. Contoh angka: tax shield = 0,25 dikali 400 = Rp100 miliar; V_L = 1.000 ditambah 100 = Rp1.100 miliar (ilustratif).",
      tasks: [
        { id: "t1", text: "Hitung `shield` (tax shield: tarif pajak dikali utang)" },
        { id: "t2", text: "Hitung `vl` (nilai perusahaan berutang), cetak keduanya" },
      ],
      expected: "shield=100  vl=1100",
      hints: [
        "Tax shield = tarif pajak dikali utang.",
        "Nilai berutang = nilai tanpa utang ditambah tax shield.",
        "shield = tc * d\nvl = vu + shield",
      ],
      code: {
        starter: `vu, tc, d = 1000, 0.25, 400  # Rp miliar (ilustratif)\n\n# TULIS KODEMU\nshield = \nvl = \n\nprint(f"shield={shield:.0f}  vl={vl:.0f}")`,
        lockLines: 1,
        solution: `vu, tc, d = 1000, 0.25, 400  # Rp miliar (ilustratif)\n\n# TULIS KODEMU\nshield = tc * d\nvl = vu + shield\n\nprint(f"shield={shield:.0f}  vl={vl:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "shield", value: 100, tol: 1e-9, label: "`shield` seharusnya 100", msg: "0,25 dikali 400 = 100. Itu juga PV penghematan pajak tahunan 8 per tahun pada 8 persen." },
          { kind: "equal", task: "t2", name: "vl", value: 1100, tol: 1e-9, label: "`vl` seharusnya 1100", msg: "1.000 ditambah 100 = 1.100. Utang menambah nilai sebesar tax shield." },
          { kind: "stdout_matches", task: "t2", pattern: "shield=100\\s+vl=1100", label: "`print` menampilkan keduanya", msg: "Format: shield=...  vl=... ." },
        ],
      },
      reference: "MM dengan pajak: V_L = V_U + T_c dikali D. Tanpa biaya distress, jawabannya 100 persen utang — jelas belum lengkap.",
    },
    {
      id: "tradeoff-vs-pecking",
      eyebrow: "Langkah 3 · Trade-off vs Pecking Order",
      title: "Dua teori, dua prediksi yang bisa diuji",
      prose: [
        "Trade-off theory melengkapi MM dengan pajak: perusahaan menambah utang selama manfaat marginal tax shield masih lebih besar dari biaya marginal financial distress — biaya kebangkrutan, kehilangan pelanggan dan supplier, serta aset yang dijual murah saat tertekan. Titik optimalnya adalah saat keduanya sama besar. Teori ini memprediksi perusahaan punya target rasio utang, kembali ke target itu setelah menyimpang, dan perusahaan yang lebih menguntungkan berutang lebih banyak karena punya lebih banyak laba untuk dilindungi pajak dan risiko distress yang lebih kecil.",
        "Pecking order theory bercerita sebaliknya: tidak ada target rasio utang sama sekali. Karena manajemen tahu lebih banyak dari investor luar (asymmetric information), menerbitkan ekuitas baru memberi sinyal buruk — pasar membaca penerbitan saham sebagai tanda saham kemahalan — sehingga perusahaan mendanai investasi dengan urutan: pertama laba ditahan, lalu utang, dan ekuitas baru sebagai pilihan terakhir. Prediksinya berlawanan dengan trade-off: perusahaan yang lebih menguntungkan berutang lebih SEDIKIT, karena laba ditahannya cukup untuk mendanai investasi tanpa utang.",
        "Perbedaan prediksi inilah yang membuat keduanya bisa diuji secara empiris — dan hasil empirisnya campuran, yang justru penting untuk ujian. Perusahaan besar yang stabil berperilaku seperti trade-off: mereka punya target leverage dan mean-reversion. Perusahaan tumbuh yang menguntungkan sering berperilaku seperti pecking order: mereka menumpuk kas dan menghindari utang. Analis yang baik tidak memilih satu teori sebagai kebenaran mutlak — ia bertanya teori mana yang menjelaskan perusahaan yang sedang ia nilai.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perusahaan tanpa target leverage yang jelas dan menumpuk utang saat laba sedang bagus melanggar kedua teori sekaligus — trade-off akan menahannya karena distress, pecking order akan memakai laba ditahan dulu. Itu tanda disiplin modal yang lemah.",
      },
      quiz: [
        {
          q: "Sebuah perusahaan sangat menguntungkan, menumpuk kas, dan hampir tidak berutang. Teori mana yang menjelaskan perilaku ini, dan apa yang diprediksi teori lawannya?",
          options: [
            { text: "Pecking order — laba ditahan cukup sehingga utang tidak diperlukan; trade-off justru memprediksi perusahaan menguntungkan berutang lebih banyak", why: "Benar: pecking order memakai dana internal dulu; trade-off memprediksi perusahaan profitable berutang lebih banyak demi tax shield.", correct: true },
            { text: "Trade-off — perusahaan menguntungkan selalu menghindari utang", why: "Salah: trade-off memprediksi sebaliknya — perusahaan menguntungkan punya lebih banyak laba untuk dilindungi pajak." },
            { text: "Keduanya memprediksi perusahaan menguntungkan tidak berutang", why: "Salah: hanya pecking order yang memprediksi itu; trade-off memprediksi utang lebih banyak." },
            { text: "Tidak ada teori yang menjelaskan — perilaku itu irasional", why: "Salah: pecking order menjelaskannya dengan rapi lewat asymmetric information dan urutan pendanaan." },
          ],
        },
      ],
      reference: "Trade-off: target utang, profitable berutang lebih banyak. Pecking order: laba ditahan dulu, profitable berutang lebih sedikit.",
    },
    {
      id: "biaya-keagenan",
      eyebrow: "Langkah 4 · Biaya Keagenan",
      title: "Utang dan ekuitas sama-sama punya biaya keagenan",
      prose: [
        "Biaya keagenan muncul karena pengelola perusahaan bukan pemiliknya: kepentingan mereka bisa berbeda. Di sisi ekuitas, masalah klasiknya adalah free cash flow — Jensen berargumen manajer dengan kas berlebih cenderung membangun imperium, membeli perusahaan lain dengan harga kemahalan, atau menikmati fasilitas mewah, karena semua itu dibayar pemegang saham. Di sinilah utang justru membantu: kewajiban membayar bunga memaksa manajer mendisiplinkan kas, karena kas yang dipakai membayar bunga tidak bisa dipakai membangun imperium.",
        "Tetapi utang menciptakan biaya keagenannya sendiri, dan dua yang paling sering diuji adalah asset substitution dan underinvestment. Asset substitution (risk shifting): saat perusahaan hampir bangkrut, pemegang saham — yang menanggung rugi terbatas — lebih suka proyek berisiko tinggi, karena bila berhasil mereka menikmati seluruh keuntungan, sedangkan bila gagal kreditur yang menanggung kerugiannya. Underinvestment (debt overhang): perusahaan menolak proyek NPV positif karena sebagian besar manfaatnya jatuh ke kreditur lama, bukan ke pemegang saham yang mendanainya.",
        "Penangkalnya dirancang ke dalam kontrak dan struktur: covenant membatasi dividen dan utang tambahan, utang jangka pendek memaksa perusahaan kembali ke pasar dan diawasi berkali-kali, dan convertible bond memberi kreditur kesempatan menjadi pemegang saham sehingga insentifnya selaras. Pesan intinya: struktur modal optimal menyeimbangkan tiga hal sekaligus — tax shield, biaya distress, dan biaya keagenan di kedua sisi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira biaya keagenan hanya soal manajemen malas. Asset substitution dan debt overhang adalah biaya keagenan UTANG — dan keduanya muncul justru saat perusahaan paling tertekan, saat keputusan paling menentukan.",
      },
      quiz: [
        {
          q: "Perusahaan yang hampir bangkrut menolak proyek dengan NPV positif karena sebagian besar keuntungannya akan jatuh ke kreditur lama. Masalah keagenan apa ini?",
          options: [
            { text: "Free cash flow problem — manajer memboroskan kas berlebih", why: "Salah: itu masalah keagenan ekuitas saat kas berlebih, bukan saat perusahaan tertekan utang." },
            { text: "Asset substitution — pemegang saham memilih proyek berisiko", why: "Salah: asset substitution adalah memilih proyek berisiko, bukan menolak proyek bagus." },
            { text: "Underinvestment atau debt overhang — utang lama menghalangi investasi yang menguntungkan", why: "Benar: pemegang saham menolak mendanai proyek bagus karena manfaatnya dinikmati kreditur lama.", correct: true },
            { text: "Signaling — pasar salah membaca penerbitan saham", why: "Salah: signaling soal informasi yang dikirim ke pasar, bukan soal penolakan proyek NPV positif." },
          ],
        },
      ],
      reference: "Ekuitas: free cash flow. Utang: asset substitution dan underinvestment. Penangkal: covenant, utang pendek, convertible.",
    },
    {
      id: "kebijakan-dividen",
      eyebrow: "Langkah 5 · Kebijakan Dividen",
      title: "Apakah dividen menaikkan nilai? Empat jawaban yang bersaing",
      prose: [
        "Teori irrelevance Modigliani-Miller mengatakan kebijakan dividen tidak memengaruhi nilai perusahaan: investor yang menginginkan kas bisa menjual sebagian sahamnya (homemade dividend), dan perusahaan yang membayar dividen besar harus menerbitkan ekuitas baru untuk mendanai investasinya. Dalam dunia tanpa pajak dan tanpa biaya transaksi, dividen hanyalah cara membelah kekayaan yang sama. Teori ini adalah titik awal — bukan kesimpulan — karena dunia nyata punya pajak, biaya, dan informasi yang tidak simetris.",
        "Tiga teori lain menantang irrelevance dari arah berbeda. Bird-in-hand (Gordon-Lintner) berargumen investor lebih menyukai dividen yang pasti hari ini daripada capital gain yang tidak pasti di masa depan, sehingga perusahaan yang membayar dividen lebih tinggi dinilai lebih mahal. Tax preference berargumen sebaliknya: bila dividen dikenai pajak lebih tinggi atau lebih cepat daripada capital gain, investor lebih suka perusahaan menahan laba, sehingga dividen rendah justru menaikkan nilai. Signaling berargumen dividen adalah sinyal: menaikkan dividen yang sulit dipalsukan memberi tahu pasar bahwa manajemen yakin laba masa depan kuat — dan pasar membalasnya dengan harga saham naik.",
        "Ada pula clientele effect: investor mengurutkan diri ke perusahaan yang kebijakan dividennya cocok dengan kebutuhan pajak dan kas mereka — dana pensiun yang bebas pajak menyukai dividen, investor bertarif pajak tinggi menyukai capital gain. Implikasi praktisnya: perubahan kebijakan dividen yang mendadak mengirim sinyal keras dan mengusir clientele yang sudah cocok, sehingga perusahaan cenderung menjaga dividen stabil dan hanya menaikkannya bila yakin bisa dipertahankan. Dividen yang dipotong mengirim sinyal yang jauh lebih buruk daripada dividen yang tidak pernah dinaikkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dividen yang dibayar dari utang — bukan dari laba — adalah red flag: perusahaan mengorbankan neraca demi mempertahankan sinyal. Cek arus kas operasi sebelum memuji yield dividen yang tinggi.",
      },
      quiz: [
        {
          q: "Perusahaan menaikkan dividennya 20 persen dan harga sahamnya naik pada hari pengumuman, padahal laba kuartal ini datar. Penjelasan yang paling konsisten dengan teori signaling?",
          options: [
            { text: "Bird-in-hand — investor selalu menyukai dividen lebih besar", why: "Salah: bird-in-hand soal preferensi dividen yang pasti, bukan soal informasi baru dari kenaikan dividen." },
            { text: "Kenaikan dividen memberi sinyal manajemen yakin laba masa depan kuat, karena dividen yang tidak bisa dipertahankan mahal untuk dipalsukan", why: "Benar: signaling bekerja karena menaikkan dividen adalah komitmen mahal — hanya perusahaan yang yakin yang berani.", correct: true },
            { text: "Irrelevance — dividen tidak memengaruhi nilai sama sekali", why: "Salah: irrelevance memprediksi harga tidak bergerak; kenyataannya harga bergerak karena informasi yang terkandung." },
            { text: "Tax preference — investor lebih suka dividen daripada capital gain", why: "Salah: tax preference justru memprediksi investor lebih suka capital gain bila pajak dividen lebih tinggi." },
          ],
        },
      ],
      reference: "Irrelevance: dividen tidak penting tanpa friksi. Bird-in-hand: dividen disukai. Tax preference: dividen dirugikan pajak. Signaling: dividen adalah pesan.",
    },
    {
      id: "dividen-residual-buyback",
      eyebrow: "Langkah 6 · Lab: Dividen Residual & Buyback",
      title: "Bayar sisa, bukan target: residual dividend dan buyback",
      prose: [
        "Residual dividend policy menerapkan pecking order ke dividen: perusahaan mendanai dulu seluruh proyek NPV positif dengan campuran target utang-ekuitasnya, lalu membagikan SISA laba sebagai dividen. Dividen menjadi variabel sisa — fluktuatif mengikuti anggaran modal — bukan angka yang dijaga stabil. Kebijakan ini murni secara teori, tetapi jarang dipakai mentah-mentah karena investor membenci dividen yang naik-turun: itulah sebabnya praktiknya sering berupa dividen dasar yang stabil ditambah dividen khusus saat sisa laba besar.",
        "Contoh ilustratif: PT Maju Bersama membukukan laba bersih Rp500 miliar (ilustratif), anggaran modal Rp400 miliar (ilustratif), dan target rasio utang 40 persen. Ekuitas yang dibutuhkan untuk mendanai anggaran itu adalah 60 persen dikali 400 sama dengan Rp240 miliar (ilustratif). Dividen residualnya adalah 500 dikurangi 240 sama dengan Rp260 miliar (ilustratif), dan payout ratio-nya 260 dibagi 500 sama dengan 52,0 persen (ilustratif). Bila anggaran modal naik menjadi Rp600 miliar, dividen residual jatuh ke 500 dikurangi 360 sama dengan Rp140 miliar — dividen berayun mengikuti investasi, bukan mengikuti keinginan investor.",
        "Buyback adalah alternatif membagikan kas yang sama: perusahaan membeli kembali sahamnya sendiri. Secara teori MM, buyback dan dividen ekuivalen — kekayaan pemegang saham sama. Praktiknya berbeda dalam tiga hal: buyback fleksibel dan tidak menciptakan ekspektasi berulang seperti dividen, buyback menunda pajak pemegang saham sampai ia menjual (sedangkan dividen dikenai pajak saat diterima), dan buyback yang dilakukan di harga kemahalan menghancurkan nilai — membeli saham sendiri di atas nilai intrinsik sama dengan membayar dividen kepada penjual dengan harga premium. Hitung dividen residualnya di lab.",
      ],
      formula: String.raw`\text{Dividen residual} = \text{Laba bersih} - (\text{Anggaran modal} \times (1 - \text{rasio utang target}))`,
      formulaNote: "Laba bersih = Rp500 miliar (ilustratif); anggaran modal = Rp400 miliar (ilustratif); rasio utang target = 40 persen (ilustratif), sehingga porsi ekuitas = 60 persen. Interpretasi: dividen adalah sisa setelah seluruh investasi yang layak didanai dengan struktur target — bila investasi naik, dividen turun, dan sebaliknya. Contoh angka: ekuitas dibutuhkan = 0,60 dikali 400 = Rp240 miliar; dividen = 500 dikurangi 240 = Rp260 miliar; payout = 260 dibagi 500 = 52,0 persen (ilustratif).",
      tasks: [
        { id: "t1", text: "Hitung `equity` yang dibutuhkan (anggaran modal dikali porsi ekuitas)" },
        { id: "t2", text: "Hitung `dividend` residual dan `payout` dalam persen, cetak ketiganya" },
      ],
      expected: "equity=240  dividend=260  payout=52.0",
      hints: [
        "Porsi ekuitas = 1 dikurangi rasio utang target.",
        "Dividen residual = laba bersih dikurangi ekuitas yang dibutuhkan.",
        "equity = budget * (1 - debt_ratio)\ndividend = ni - equity\npayout = dividend / ni * 100",
      ],
      code: {
        starter: `ni, budget, debt_ratio = 500, 400, 0.40  # Rp miliar (ilustratif)\n\n# TULIS KODEMU\nequity = \ndividend = \npayout = \n\nprint(f"equity={equity:.0f}  dividend={dividend:.0f}  payout={payout:.1f}")`,
        lockLines: 1,
        solution: `ni, budget, debt_ratio = 500, 400, 0.40  # Rp miliar (ilustratif)\n\n# TULIS KODEMU\nequity = budget * (1 - debt_ratio)\ndividend = ni - equity\npayout = dividend / ni * 100\n\nprint(f"equity={equity:.0f}  dividend={dividend:.0f}  payout={payout:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "equity", value: 240, tol: 1e-9, label: "`equity` seharusnya 240", msg: "60 persen dikali 400 = 240. Itu porsi ekuitas dari anggaran modal." },
          { kind: "equal", task: "t2", name: "dividend", value: 260, tol: 1e-9, label: "`dividend` seharusnya 260", msg: "500 dikurangi 240 = 260. Dividen adalah sisa setelah investasi didanai." },
          { kind: "equal", task: "t2", name: "payout", value: 52.0, tol: 1e-9, label: "`payout` seharusnya 52.0", msg: "260 dibagi 500 = 52,0 persen." },
          { kind: "stdout_matches", task: "t2", pattern: "equity=240\\s+dividend=260\\s+payout=52\\.0", label: "`print` menampilkan ketiganya", msg: "Format: equity=...  dividend=...  payout=... ." },
        ],
      },
      reference: "Dividen residual = laba dikurangi ekuitas untuk anggaran modal. Buyback = dividen yang fleksibel dan menunda pajak.",
    },
    {
      id: "kasus-leverage",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dua struktur modal: mana yang memaksimalkan nilai",
      prose: [
        "PT Maju Bersama memilih antara Struktur A tanpa utang dan Struktur B dengan utang Rp400 miliar (ilustratif). Nilai tanpa utangnya Rp1.000 miliar (ilustratif), tarif pajak 25 persen. Menurut MM dengan pajak saja, Struktur B menang telak: nilai 1.000 ditambah tax shield 100 sama dengan Rp1.100 miliar (ilustratif). Seorang analis yang berhenti di sini akan merekomendasikan utang — dan ia baru setengah benar.",
        "Trade-off theory menambahkan sisi biaya: perusahaan ini menjual produk siklis, pelanggannya sensitif terhadap kabar kesulitan keuangan, dan asetnya sulit dijual cepat. Nilai kini biaya distress dan biaya keagenan utangnya ditaksir Rp150 miliar (ilustratif) — angka taksiran manajemen untuk latihan ini, bukan data pasar. Nilai bersih Struktur B menjadi 1.100 dikurangi 150 sama dengan Rp950 miliar (ilustratif), yaitu Rp50 miliar DI BAWAH Struktur A. Leverage menghancurkan nilai di sini, bukan menciptakannya.",
        "Titik baliknya mudah dihitung: Struktur B hanya menang bila biaya distress di bawah tax shield Rp100 miliar (ilustratif) — misalnya bila biayanya hanya Rp60 miliar, nilai B menjadi Rp1.040 miliar dan utang layak diambil. Keputusan leverage bukan soal utang itu baik atau buruk, melainkan soal membandingkan dua angka marginal: tax shield di satu sisi, distress plus keagenan di sisi lain, untuk perusahaan spesifik ini. Analis yang memakai jawaban umum untuk perusahaan spesifik sedang menebak, bukan menganalisis.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biaya distress Rp150 miliar dalam kasus ini adalah taksiran, bukan angka pasti — dan justru di situlah risikonya: analis yang yakin pada taksirannya sendiri akan salah dengan percaya diri. Selalu uji sensitivitas: pada biaya berapa keputusanmu berbalik?",
      },
      reference: "MM dengan pajak: B menang 1.100 vs 1.000. Trade-off: B kalah 950 vs 1.000 bila distress 150. Breakeven distress = 100.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: MM tanpa dan dengan pajak, trade-off vs pecking order, biaya keagenan, dividen, dan dividen residual.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Tanpa pajak, perusahaan mengganti ekuitas dengan utang. Return ekuitas naik dari 10 persen menjadi 11,33 persen. Apakah pemegang saham menjadi lebih kaya?",
          options: [
            { text: "Ya — return lebih tinggi berarti kekayaan lebih besar", why: "Salah: return naik karena risiko naik; nilai total perusahaan tidak berubah dalam MM tanpa pajak." },
            { text: "Tidak — nilai total tetap, return naik hanya sebagai kompensasi risiko yang lebih besar", why: "Benar: leverage menggeser risiko, bukan menciptakan nilai — return yang disesuaikan risiko tidak berubah.", correct: true },
            { text: "Ya — karena bunga lebih murah dari dividen", why: "Salah: perbandingan bunga vs dividen bukan ukuran kekayaan; nilai ditentukan arus kas aset." },
            { text: "Tidak — nilai perusahaan justru turun karena risiko naik", why: "Salah: dalam asumsi MM tanpa pajak tidak ada biaya distress, jadi nilai tidak turun." },
          ],
        },
        {
          q: "V_U Rp1.000 miliar, tarif pajak 25 persen, utang Rp400 miliar. Nilai perusahaan berutang menurut MM dengan pajak?",
          options: [
            { text: "Rp1.000 miliar — utang tidak mengubah nilai", why: "Salah: itu jawaban MM tanpa pajak; dengan pajak ada tax shield." },
            { text: "Rp1.100 miliar — ditambah tax shield 100", why: "Benar: 1.000 ditambah 0,25 dikali 400 = 1.100.", correct: true },
            { text: "Rp1.400 miliar — ditambah seluruh utang", why: "Salah: yang ditambahkan hanya tax shield, bukan pokok utang." },
            { text: "Rp900 miliar — dikurangi risiko kebangkrutan", why: "Salah: MM dengan pajak mengabaikan biaya distress; itu ranah trade-off theory." },
          ],
        },
        {
          q: "Perusahaan yang sangat menguntungkan justru hampir tidak berutang. Prediksi teori mana yang terpenuhi?",
          options: [
            { text: "Trade-off theory", why: "Salah: trade-off memprediksi perusahaan menguntungkan berutang lebih banyak demi tax shield." },
            { text: "Pecking order theory — laba ditahan cukup untuk mendanai investasi", why: "Benar: urutan pendanaan memakai dana internal dulu; utang hanya bila dana internal kurang.", correct: true },
            { text: "Teori irrelevance dividen", why: "Salah: itu soal dividen, bukan soal pilihan utang perusahaan menguntungkan." },
            { text: "Teori bird-in-hand", why: "Salah: itu soal preferensi dividen investor, bukan soal leverage." },
          ],
        },
        {
          q: "Manajer perusahaan dengan kas berlebih membeli perusahaan lain dengan harga kemahalan demi memperbesar imperiumnya. Masalah keagenan apa ini?",
          options: [
            { text: "Debt overhang", why: "Salah: itu penolakan proyek bagus karena utang lama — kebalikan dari kasus ini." },
            { text: "Asset substitution", why: "Salah: itu pemegang saham memilih proyek berisiko saat hampir bangkrut." },
            { text: "Free cash flow problem — kas berlebih dipakai untuk kepentingan manajer, bukan pemegang saham", why: "Benar: Jensen — utang justru membantu di sini karena bunga mendisiplinkan kas.", correct: true },
            { text: "Clientele effect", why: "Salah: itu soal investor mengurutkan diri berdasarkan kebijakan dividen." },
          ],
        },
        {
          q: "Laba bersih Rp500 miliar, anggaran modal Rp400 miliar, target utang 40 persen. Dividen residual dan payout ratio?",
          options: [
            { text: "Rp260 miliar dan 52,0 persen", why: "Benar: ekuitas dibutuhkan 240, sisa 260, payout 260 dibagi 500 = 52,0 persen.", correct: true },
            { text: "Rp100 miliar dan 20,0 persen", why: "Salah: itu laba dikurangi anggaran penuh — lupa porsi utang 40 persen mendanai sebagian anggaran." },
            { text: "Rp500 miliar dan 100 persen", why: "Salah: laba tidak semuanya dibagikan — investasi NPV positif harus didanai dulu." },
            { text: "Rp240 miliar dan 48,0 persen", why: "Salah: 240 adalah ekuitas yang dibutuhkan, bukan dividennya." },
          ],
        },
      ],
      summary: [
        "MM tanpa pajak: nilai tidak tergantung struktur modal; leverage menggeser risiko, bukan menciptakan nilai.",
        "MM dengan pajak: V_L = V_U + T_c dikali D — tax shield membuat utang menambah nilai.",
        "Trade-off: ada target utang saat tax shield marginal sama dengan distress marginal. Pecking order: laba ditahan, lalu utang, ekuitas terakhir.",
        "Biaya keagenan: ekuitas punya free cash flow; utang punya asset substitution dan underinvestment.",
        "Dividen: irrelevance sebagai titik awal; bird-in-hand, tax preference, signaling, dan clientele menjelaskan dunia nyata.",
        "Dividen residual = laba dikurangi ekuitas untuk anggaran modal; buyback fleksibel dan menunda pajak, tetapi berbahaya bila dibeli kemahalan.",
      ],
      next: { label: "PM-A6 — Equity: Struktur Pasar, Indeks & Efisiensi", href: "/learn/pm-a6-equity" },
    },
  ],
};
