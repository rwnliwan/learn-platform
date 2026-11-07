import type { V2Lesson } from "../lib/types";

export const pmcfaFlashcards: V2Lesson = {
  slug: "pm-cfa-flashcards",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-CFA Flashcards: Kilat 32 Kartu Lintas Area",
  estMinutes: 45,
  steps: [
    {
      id: "cara-kerja",
      eyebrow: "Langkah 1 · Cara kerja",
      title: "Cara kerja: tiap soal otomatis jadi kartu FSRS",
      prose: [
        "Lesson ini berisi 32 soal kilat lintas area CFA Level 1, dibagi empat bank soal: Ethics dan GIPS, Quant dan Economics, FSA dan Corporate Issuers, lalu Equity, Fixed Income, Derivatives, Alternatives, dan Portfolio Management. Setiap soal dirancang dijawab dalam 30 sampai 60 detik — bila satu soal memakan waktu lebih dari itu, itulah kartu yang perlu sering muncul.",
        "Kamu TIDAK perlu membuat kartu secara manual. Setiap soal quiz di platform ini otomatis menjadi kartu spaced-repetition dengan kode quiz:slug:step:nomor-soal, dijadwalkan oleh algoritma FSRS, dan muncul untuk direview di halaman /v2/review. Kartu yang kamu jawab salah muncul lagi lebih cepat; kartu yang kamu jawab benar dengan mudah dijadwalkan lebih jauh.",
        "Saat mereview di /v2/review, kamu menilai dirimu dengan empat tombol. Again berarti kamu tidak bisa menjawab atau jawabanmu salah — kartu kembali hari ini juga. Hard berarti kamu menjawab benar tetapi dengan susah payah. Good berarti kamu menjawab benar dengan berpikir sebentar. Easy berarti jawabannya langsung muncul tanpa berpikir. Jujurlah: menekan Easy pada kartu yang sebenarnya kamu tebak sama dengan membuang kartu itu dari jadwalmu.",
      ],
      tasks: [],
      note: {
        title: "Aturan main",
        type: "pitfall",
        body: "Jangan menumpuk kartu baru: 32 kartu ini cukup untuk satu sesi. Selesaikan satu bank soal, review kartu-kartu yang salah di /v2/review, baru lanjut ke bank berikutnya.",
      },
      reference: "32 kartu otomatis menjadi kartu FSRS di /v2/review. Again = ulang hari ini; Easy = jadwal jauh.",
    },
    {
      id: "bank-ethics-gips",
      eyebrow: "Langkah 2 · Bank soal 1 dari 4",
      title: "Ethics dan GIPS: 8 kartu kilat",
      prose: [
        "Delapan soal kilat Ethics dan GIPS. Jawab cepat, tanpa kalkulator, tanpa membuka catatan — kecepatan adalah bagian dari latihannya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Code of Ethics CFA berisi berapa janji aspirasional?",
          options: [
            { text: "6 janji", why: "Benar: Code berisi 6 prinsip aspirasional; Standards berisi 7 kelompok aturan yang ditegakkan.", correct: true },
            { text: "7 janji", why: "Salah: 7 adalah jumlah kelompok Standards, bukan janji Code.", },
            { text: "10 janji", why: "Salah: tidak ada 10 janji dalam Code of Ethics.", },
          ],
        },
        {
          q: "Dalam hierarki loyalitas CFA, siapa yang paling tinggi?",
          options: [
            { text: "Employer", why: "Salah: employer di bawah klien.", },
            { text: "Klien", why: "Benar: klien lebih tinggi dari employer, employer lebih tinggi dari diri sendiri.", correct: true },
            { text: "Diri sendiri", why: "Salah: kepentingan pribadi selalu paling bawah.", },
          ],
        },
        {
          q: "Standar mana yang melarang trading atas info material nonpublik?",
          options: [
            { text: "II(A) Material Nonpublic Information", why: "Benar: II(A) melarang trading dan tipping atas info material nonpublik.", correct: true },
            { text: "I(C) Misrepresentation", why: "Salah: I(C) soal pernyataan yang menyesatkan, bukan info nonpublik.", },
            { text: "V(A) Diligence and Reasonable Basis", why: "Salah: V(A) soal basis analisis yang wajar.", },
          ],
        },
        {
          q: "Manajer wajib mendahulukan transaksi klien atas transaksi pribadinya. Standar mana?",
          options: [
            { text: "VI(B) Priority of Transactions", why: "Benar: transaksi klien didahulukan dari transaksi pribadi atau employer.", correct: true },
            { text: "III(E) Confidentiality", why: "Salah: III(E) soal menjaga info klien.", },
            { text: "VII(A) Conduct as Participants", why: "Salah: VII(A) adalah pasal perilaku anggota secara umum.", },
          ],
        },
        {
          q: "Fee referral yang diterima konsultan dari manajer yang ia rekomendasikan wajib?",
          options: [
            { text: "Diungkapkan tertulis kepada klien sebelum rekomendasi (VI(C))", why: "Benar: referral fee adalah konflik material yang wajib diungkapkan dan disetujui klien.", correct: true },
            { text: "Disembunyikan agar klien tidak bingung", why: "Salah: menyembunyikan konflik justru pelanggarannya.", },
            { text: "Dibagi dua dengan klien", why: "Salah: tidak ada aturan bagi hasil fee referral dengan klien.", },
          ],
        },
        {
          q: "GIPS mewajibkan semua portofolio diskresioner dengan mandat serupa masuk ke?",
          options: [
            { text: "Composite yang sama — tidak boleh cherry-pick", why: "Benar: composite lengkap mencegah manajer hanya memamerkan portofolio yang menang.", correct: true },
            { text: "Laporan tahunan saja", why: "Salah: composite adalah jantung GIPS, bukan sekadar laporan.", },
            { text: "Composite terbaik saja", why: "Salah: memilih yang terbaik adalah cherry-picking yang dilarang GIPS.", },
          ],
        },
        {
          q: "Berapa histori minimum yang disyaratkan GIPS?",
          options: [
            { text: "5 tahun, menuju 10 tahun", why: "Benar: GIPS mensyaratkan histori 5 tahun dan membangun menuju 10 tahun.", correct: true },
            { text: "1 tahun", why: "Salah: 1 tahun terlalu pendek untuk menilai kinerja manajer.", },
            { text: "3 tahun", why: "Salah: minimum GIPS adalah 5 tahun, bukan 3.", },
          ],
        },
        {
          q: "Verification GIPS oleh pihak ketiga berarti?",
          options: [
            { text: "Angka return diaudit dan dijamin benar", why: "Salah: verification bukan audit angka dan tidak menjamin return.", },
            { text: "Proses klaim compliance diverifikasi, bukan angka per portofolio", why: "Benar: verification menguji proses di level perusahaan, bukan mengaudit angka.", correct: true },
            { text: "Manajer dijamin tidak akan rugi", why: "Salah: tidak ada standar yang menjamin return investasi.", },
          ],
        },
      ],
      reference: "Bank 1: Code 6 janji; hierarki klien di atas employer; II(A), VI(B), VI(C); GIPS composite dan 5 tahun.",
    },
    {
      id: "bank-quant-econ",
      eyebrow: "Langkah 3 · Bank soal 2 dari 4",
      title: "Quant dan Economics: 8 kartu kilat",
      prose: [
        "Delapan soal kilat Quant dan Economics. Soal hitung boleh memakai kalkulator; soal konsep dijawab dari ingatan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rp1.000 diinvestasikan 10 tahun pada 8% (ilustratif). FV?",
          options: [
            { text: "Rp2.158,92", why: "Benar: 1.000 × 1,08^10 = 2.158,92.", correct: true },
            { text: "Rp1.800,00", why: "Salah: itu bunga sederhana, bukan bunga majemuk.", },
            { text: "Rp2.500,00", why: "Salah: 1,08^10 ≈ 2,16, bukan 2,5.", },
          ],
        },
        {
          q: "Proyek NPV positif pada biaya modal 10% berarti?",
          options: [
            { text: "Proyek menciptakan nilai di atas biaya modal — terima", why: "Benar: NPV positif berarti nilai kini arus masuk melebihi investasi.", correct: true },
            { text: "Proyek harus ditolak", why: "Salah: NPV negatif yang ditolak, bukan positif.", },
            { text: "Proyek impas", why: "Salah: impas berarti NPV nol, bukan positif.", },
          ],
        },
        {
          q: "Varians sampel memakai pembagi?",
          options: [
            { text: "n − 1", why: "Benar: pembagi n−1 adalah koreksi Bessel untuk sampel.", correct: true },
            { text: "n", why: "Salah: pembagi n menghasilkan population variance, bukan sample variance.", },
            { text: "n + 1", why: "Salah: tidak ada rumus varians dengan pembagi n+1.", },
          ],
        },
        {
          q: "Korelasi antara dua aset adalah −1. Artinya?",
          options: [
            { text: "Keduanya bergerak berlawanan arah secara sempurna", why: "Benar: korelasi −1 adalah hubungan linear negatif sempurna — bahan diversifikasi terbaik.", correct: true },
            { text: "Keduanya tidak berhubungan sama sekali", why: "Salah: tidak berhubungan adalah korelasi 0.", },
            { text: "Keduanya bergerak seirama sempurna", why: "Salah: seirama sempurna adalah korelasi +1.", },
          ],
        },
        {
          q: "Elastisitas harga permintaan −0,5 berarti?",
          options: [
            { text: "Permintaan inelastis: harga naik 1% menurunkan kuantitas 0,5%", why: "Benar: nilai absolut di bawah 1 berarti inelastis.", correct: true },
            { text: "Permintaan elastis sempurna", why: "Salah: elastis berarti nilai absolut di atas 1.", },
            { text: "Permintaan naik saat harga naik", why: "Salah: elastisitas negatif berarti kuantitas turun saat harga naik.", },
          ],
        },
        {
          q: "GDP dihitung dengan pendekatan pengeluaran: C + I + G + (X − M). M adalah?",
          options: [
            { text: "Impor — dikurangkan karena dibelanjakan untuk barang luar negeri", why: "Benar: impor dikurangkan karena konsumsi dan investasi sudah mencakup barang impor.", correct: true },
            { text: "Impor — ditambahkan ke GDP", why: "Salah: impor dikurangkan, bukan ditambahkan.", },
            { text: "Pajak — ditambahkan ke belanja pemerintah", why: "Salah: M adalah impor, bukan pajak.", },
          ],
        },
        {
          q: "Bank sentral menaikkan suku bunga acuan. Dampak yang paling langsung pada obligasi?",
          options: [
            { text: "Harga obligasi turun karena YTM naik", why: "Benar: harga dan yield bergerak berlawanan arah.", correct: true },
            { text: "Harga obligasi naik", why: "Salah: yield naik berarti diskonto naik, harga turun.", },
            { text: "Harga obligasi tidak berubah", why: "Salah: harga obligasi sensitif terhadap perubahan yield.", },
          ],
        },
        {
          q: "Inflasi yang tinggi dan tidak terduga paling merugikan?",
          options: [
            { text: "Pemberi pinjaman dengan bunga tetap — dibayar kembali dengan uang yang nilainya turun", why: "Benar: lender menerima pembayaran nominal tetap yang daya belinya merosot.", correct: true },
            { text: "Peminjam dengan bunga tetap", why: "Salah: peminjam justru diuntungkan karena utangnya dibayar dengan uang yang lebih murah.", },
            { text: "Pemilik aset riil seperti properti", why: "Salah: aset riil cenderung menjaga nilai saat inflasi.", },
          ],
        },
      ],
      reference: "Bank 2: FV 2.158,92; NPV positif terima; pembagi n−1; korelasi −1; GDP mengurangkan impor.",
    },
    {
      id: "bank-fsa-corporate",
      eyebrow: "Langkah 4 · Bank soal 3 dari 4",
      title: "FSA dan Corporate Issuers: 8 kartu kilat",
      prose: [
        "Delapan soal kilat FSA dan Corporate Issuers. Hitung rasio dari angka yang diberikan; jangan menebak arah rumusnya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Persediaan LIFO Rp200, LIFO reserve Rp40 (ilustratif). Persediaan FIFO?",
          options: [
            { text: "Rp240", why: "Benar: FIFO = LIFO + reserve = 200 + 40.", correct: true },
            { text: "Rp160", why: "Salah: reserve ditambahkan, bukan dikurangkan.", },
            { text: "Rp200", why: "Salah: itu nilai LIFO-nya.", },
          ],
        },
        {
          q: "COGS LIFO Rp600, LIFO reserve naik Rp10 (ilustratif). COGS FIFO?",
          options: [
            { text: "Rp590", why: "Benar: COGS FIFO = 600 − 10 = 590.", correct: true },
            { text: "Rp610", why: "Salah: arahnya terbalik.", },
            { text: "Rp600", why: "Salah: konversi FIFO mengubah COGS sebesar perubahan reserve.", },
          ],
        },
        {
          q: "Laba bersih Rp90, ekuitas Rp500 (ilustratif). ROE?",
          options: [
            { text: "18%", why: "Benar: 90 ÷ 500 = 18%.", correct: true },
            { text: "9%", why: "Salah: itu ROA bila total aset 1.000.", },
            { text: "25%", why: "Salah: 25% adalah tarif pajak pada contoh ini.", },
          ],
        },
        {
          q: "DTL (deferred tax liability) muncul ketika?",
          options: [
            { text: "Laba akuntansi lebih besar dari laba pajak hari ini — pajak ditunda ke masa depan", why: "Benar: perbedaan temporer ini menciptakan kewajiban pajak masa depan.", correct: true },
            { text: "Perusahaan membayar pajak lebih dari yang terutang", why: "Salah: itu menciptakan DTA, bukan DTL.", },
            { text: "Ada perbedaan permanen antara laba akuntansi dan pajak", why: "Salah: perbedaan permanen tidak menciptakan DTL atau DTA.", },
          ],
        },
        {
          q: "Dalam analisis DuPont, ROE tinggi yang berasal dari leverage tinggi menandakan?",
          options: [
            { text: "Kerapuhan — ROE didongkrak utang, bukan operasi", why: "Benar: leverage memperbesar ROE sekaligus risiko; margin dan perputaran adalah kualitas.", correct: true },
            { text: "Kualitas operasi yang unggul", why: "Salah: kualitas operasi terlihat dari margin dan perputaran, bukan leverage.", },
            { text: "Tidak ada arti apa-apa", why: "Salah: sumber ROE adalah informasi penting bagi analis.", },
          ],
        },
        {
          q: "Perusahaan menerbitkan obligasi baru untuk membeli kembali sahamnya. Dampak langsung pada leverage?",
          options: [
            { text: "Leverage naik — utang bertambah, ekuitas berkurang", why: "Benar: aset tetap, utang naik, ekuitas turun — rasio utang terhadap ekuitas naik.", correct: true },
            { text: "Leverage turun", why: "Salah: menambah utang sambil mengurangi ekuitas menaikkan leverage.", },
            { text: "Leverage tidak berubah", why: "Salah: kedua sisi struktur modal bergerak ke arah leverage lebih tinggi.", },
          ],
        },
        {
          q: "WACC memakai biaya utang setelah pajak karena?",
          options: [
            { text: "Bunga utang mengurangi pajak — penghematan pajak adalah biaya yang sesungguhnya lebih rendah", why: "Benar: biaya utang efektif = r_d × (1 − t).", correct: true },
            { text: "Utang tidak pernah dikenai pajak", why: "Salah: yang mengurangi pajak adalah bunga, bukan pokok utang.", },
            { text: "Pajak tidak relevan untuk utang", why: "Salah: justru karena pajak relevan, WACC mengoreksi biaya utang.", },
          ],
        },
        {
          q: "Arus kas operasi Rp120, belanja modal Rp40 (ilustratif). Free cash flow to the firm sebelum penyesuaian lain?",
          options: [
            { text: "Rp80", why: "Benar: FCFF ≈ CFO − capex = 120 − 40 = 80, sebelum penyesuaian bunga dan perubahan modal kerja lainnya.", correct: true },
            { text: "Rp160", why: "Salah: capex dikurangkan, bukan ditambahkan.", },
            { text: "Rp120", why: "Salah: itu CFO-nya, belum dikurangi belanja modal.", },
          ],
        },
      ],
      reference: "Bank 3: FIFO 240; COGS FIFO 590; ROE 18%; DTL dari laba akuntansi di atas laba pajak; WACC memakai r_d(1−t).",
    },
    {
      id: "bank-equity-fi-deriv",
      eyebrow: "Langkah 5 · Bank soal 4 dari 4",
      title: "Equity, FI, Derivatives, Alternatives, PM: 8 kartu kilat",
      prose: [
        "Delapan soal kilat terakhir: Equity, Fixed Income, Derivatives, Alternatives, dan Portfolio Management. Setelah bank ini, 32 kartu lengkap sudah dijadwalkan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "D1 Rp5, k 12%, g 4% (ilustratif). Nilai wajar Gordon growth?",
          options: [
            { text: "Rp62,50", why: "Benar: 5 ÷ (0,12 − 0,04) = 62,50.", correct: true },
            { text: "Rp31,25", why: "Salah: 5 ÷ 0,16 memakai k ditambah g.", },
            { text: "Rp125,00", why: "Salah: itu 5 ÷ 0,04.", },
          ],
        },
        {
          q: "CAPM: risk-free 3%, beta 1,2, return pasar 10% (ilustratif). Required return?",
          options: [
            { text: "11,4%", why: "Benar: 3% + 1,2 × 7% = 11,4%.", correct: true },
            { text: "15,0%", why: "Salah: lupa mengurangkan risk-free dari return pasar.", },
            { text: "10,0%", why: "Salah: itu return pasar.", },
          ],
        },
        {
          q: "Durasi modified obligasi 7 tahun. YTM naik 1%. Perubahan harga kira-kira?",
          options: [
            { text: "Turun sekitar 7%", why: "Benar: perubahan harga persen ≈ −durasi modified × perubahan YTM = −7%.", correct: true },
            { text: "Naik sekitar 7%", why: "Salah: harga dan yield bergerak berlawanan arah.", },
            { text: "Turun sekitar 1%", why: "Salah: 1% adalah perubahan yield, bukan perubahan harga.", },
          ],
        },
        {
          q: "VaR 95% harian Rp100 juta berarti?",
          options: [
            { text: "Ada peluang 5% kerugian harian melebihi Rp100 juta", why: "Benar: VaR adalah ambang kerugian pada tingkat keyakinan tertentu.", correct: true },
            { text: "Kerugian maksimum yang mungkin adalah Rp100 juta", why: "Salah: VaR diam tentang seberapa buruk ekor di luar ambang.", },
            { text: "Kerugian harian pasti Rp100 juta", why: "Salah: VaR adalah ambang probabilitas, bukan kepastian.", },
          ],
        },
        {
          q: "Sharpe ratio portofolio: return 12%, risk-free 3%, SD 15% (ilustratif). Nilainya?",
          options: [
            { text: "0,60", why: "Benar: (12% − 3%) ÷ 15% = 0,60.", correct: true },
            { text: "0,80", why: "Salah: lupa mengurangkan risk-free.", },
            { text: "0,45", why: "Salah: tidak ada kombinasi rumus Sharpe yang menghasilkan angka ini.", },
          ],
        },
        {
          q: "Pembeli call option membayar premi dan memperoleh?",
          options: [
            { text: "Hak, bukan kewajiban, membeli aset pada harga strike", why: "Benar: pembeli call punya hak; penjual yang berkewajiban.", correct: true },
            { text: "Kewajiban membeli aset pada harga strike", why: "Salah: kewajiban ada pada penjual call, bukan pembeli.", },
            { text: "Aset itu sendiri secara langsung", why: "Salah: option memberi hak atas aset, bukan asetnya.", },
          ],
        },
        {
          q: "Keunggulan utama diversifikasi antar aset berkorelasi rendah adalah?",
          options: [
            { text: "Menurunkan risiko portofolio tanpa harus menurunkan expected return sebanding", why: "Benar: korelasi rendah membuat kerugian satu aset diimbangi aset lain.", correct: true },
            { text: "Menjamin return positif", why: "Salah: diversifikasi mengurangi risiko, bukan menjamin return.", },
            { text: "Menghilangkan semua risiko", why: "Salah: risiko sistematis tidak bisa didiversifikasi.", },
          ],
        },
        {
          q: "Reksa dana yang mengenakan performance fee paling tepat dinilai dengan?",
          options: [
            { text: "Return bersih setelah fee dibandingkan benchmark sebanding", why: "Benar: investor menerima return bersih; fee hanya beralasan bila return bersih mengalahkan benchmark.", correct: true },
            { text: "Return kotor sebelum fee saja", why: "Salah: return kotor mengabaikan biaya yang dibayar investor.", },
            { text: "Total aset yang dikelola saja", why: "Salah: ukuran dana bukan ukuran kinerja.", },
          ],
        },
      ],
      reference: "Bank 4: Gordon 62,50; CAPM 11,4%; durasi 7 berarti harga turun 7% saat yield naik 1%; VaR 95% dan Sharpe 0,60.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Strategi review: 15 menit sehari, jangan menumpuk kartu baru",
      prose: [
        "Kamu baru saja menjawab 32 soal kilat. Jangan menambah kartu baru hari ini — buka /v2/review dan selesaikan kartu-kartu yang dijadwalkan hari ini, terutama yang kamu jawab salah. Strategi yang bekerja: 15 menit review setiap hari mengalahkan 2 jam review seminggu sekali, karena FSRS menjadwalkan kartu tepat sebelum kamu melupakannya.",
        "Bila satu bank soal terasa jauh lebih lemah dari yang lain, itulah prioritasmu: kerjakan ulang lesson dan formula sheet area itu, lalu kembali ke bank soal ini. Kartu yang sudah Easy tiga kali berturut-turut boleh dianggap dikuasai — tetapi jangan hapus kebiasaan review hariannya.",
      ],
      tasks: [],
      summary: [
        "32 kartu kilat sudah otomatis menjadi kartu FSRS di /v2/review.",
        "Review 15 menit setiap hari — jangan menumpuk kartu baru sebelum kartu lama tuntas.",
        "Again bila salah atau tidak bisa menjawab; Easy hanya bila jawaban langsung muncul.",
        "Bank soal terlemah menentukan lesson berikutnya, bukan bank soal yang sudah kuat.",
      ],
      next: { label: "PM-CFA Formula Sheet: Rumus yang Wajib di Luar Kepala", href: "/learn/pm-cfa-formula-sheet" },
    },
  ],
};
