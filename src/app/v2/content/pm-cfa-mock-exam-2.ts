import type { V2Lesson } from "../lib/types";

export const pmcfaMockExam2: V2Lesson = {
  slug: "pm-cfa-mock-exam-2",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-CFA Mock Exam 2: 18 Soal Gaya CFA",
  estMinutes: 60,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing",
      title: "Aturan mock: 18 soal, target 70%, 27 menit",
      prose: [
        "Mock kedua meniru format item-set CFA Level 1: tiga vignette, masing-masing diikuti 6 soal. Total 18 soal. Target lulus: 70%, yaitu minimal 13 jawaban benar dari 18. Waktu yang disarankan: 27 menit, yaitu 90 detik per soal — kerjakan dengan timer menyala.",
        "Mock ini menguji tiga area yang BELUM diujikan di Mock Exam 1: Economics (vignette A), Corporate Issuers (vignette B), dan Alternatives (vignette C). Mock 1 menguji Ethics, FSA, serta Quant dan Equity — gabungan skor kedua mock memberi gambaran kesiapanmu yang lebih lengkap daripada satu mock saja.",
        "Aturan main sama seperti Mock 1: soal konsep dikerjakan TANPA kalkulator; soal hitung boleh memakai kalkulator BA II Plus dan formula sheet dari lesson sebelumnya. Jangan mengintip kunci sebelum selesai — nilai mock yang jujur lebih berguna daripada nilai mock yang bagus.",
      ],
      tasks: [],
      note: {
        title: "Cara memakai mock ini",
        type: "pitfall",
        body: "Godaan terbesar adalah mengerjakan vignette demi vignette sambil mengintip kunci. Tahan. Kerjakan 18 soal berturut-turut dulu, catat jawabanmu di kertas, baru buka Langkah 6 untuk pembahasan.",
      },
      reference: "18 soal · target 13 benar (70%) · 27 menit · area baru: Economics, Corporate Issuers, Alternatives.",
    },
    {
      id: "vignette-a-economics",
      eyebrow: "Langkah 2 · Vignette A · Economics",
      title: "Vignette A: Negara Arunika — uang, suku bunga, dan kurs",
      prose: [
        "Negara Arunika (ilustratif, semua angka dalam persen kecuali kurs): uang beredar tumbuh 8% per tahun, kecepatan uang tetap, PDB riil tumbuh 5%. Inflasi aktual 3,0% dengan target bank sentral 2,5%; suku bunga acuan 5,50%; suku bunga riil netral 2,0%; output gap positif 1,0%. Pengangguran 5,1% dengan NAIRU 5,5%.",
        "Kurs spot 15.000 AUR per USD. Suku bunga domestik 5,50% dan suku bunga AS 2,00%. Inflasi AS 1,5%. Pemerintah Arunika menaikkan belanja (fiskal ekspansif) sementara bank sentral menahan suku bunga di level ketat, dengan mobilitas modal yang tinggi.",
        "Enam soal berikut menguji teori kuantitas uang, Taylor rule, kurva Phillips, paritas suku bunga dan daya beli, serta bauran kebijakan dari data yang sama. Semua angka ilustratif.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Uang beredar tumbuh 8%, kecepatan uang tetap, PDB riil tumbuh 5%. Menurut teori kuantitas uang, inflasi sekitar?",
          options: [
            { text: "3,0%", why: "Benar: inflasi = pertumbuhan uang + perubahan kecepatan − pertumbuhan riil = 8 + 0 − 5 = 3,0%.", correct: true },
            { text: "8,0%", why: "Salah: 8% adalah pertumbuhan uang, bukan inflasi — pertumbuhan output riil 5% menyerap sebagian uang baru.", },
            { text: "13,0%", why: "Salah: menjumlahkan semuanya (8 + 5) membalik tanda pertumbuhan riil.", },
          ],
        },
        {
          q: "Suku bunga riil netral 2,0%, inflasi 3,0%, target inflasi 2,5%, output gap +1,0%. Berapa suku bunga menurut Taylor rule?",
          options: [
            { text: "5,50%", why: "Salah: itu suku bunga acuan aktual, bukan hasil Taylor rule.", },
            { text: "5,75%", why: "Benar: 2,0 + 3,0 + 0,5 × (3,0 − 2,5) + 0,5 × 1,0 = 5,75%. Suku bunga aktual 5,50% berarti kebijakan sedikit lebih longgar dari Taylor.", correct: true },
            { text: "6,50%", why: "Salah: 6,50% didapat bila lupa bobot 0,5 pada selisih inflasi dan output gap.", },
          ],
        },
        {
          q: "Pengangguran 5,1% sementara NAIRU 5,5%. Apa implikasinya bagi inflasi?",
          options: [
            { text: "Tekanan inflasi ke atas — pasar tenaga kerja lebih ketat dari tingkat alaminya", why: "Benar: pengangguran di bawah NAIRU berarti permintaan tenaga kerja melebihi penawaran alaminya, mendorong upah lalu harga.", correct: true },
            { text: "Tekanan deflasi — pengangguran masih tinggi", why: "Salah: 5,1% memang tampak tinggi secara absolut, tetapi yang relevan adalah perbandingan dengan NAIRU 5,5%.", },
            { text: "Tidak ada efek — NAIRU tidak memengaruhi inflasi", why: "Salah: NAIRU justru definisi pengangguran yang konsisten dengan inflasi stabil.", },
          ],
        },
        {
          q: "Spot 15.000 AUR per USD, suku bunga domestik 5,50%, suku bunga AS 2,00%. Menurut uncovered interest parity, kurs yang diharapkan setahun lagi?",
          options: [
            { text: "15.000 — kurs tidak berubah", why: "Salah: selisih suku bunga 3,5 poin harus tercermin pada ekspektasi kurs, kalau tidak ada arbitrase tanpa risiko.", },
            { text: "15.514,71 — AUR diperkirakan melemah sekitar 3,43%", why: "Benar: 15.000 × 1,055 ÷ 1,02 = 15.514,71. Mata uang bersuku bunga lebih tinggi diperkirakan terdepresiasi.", correct: true },
            { text: "14.516,59 — AUR diperkirakan menguat", why: "Salah: rasio dibalik — yang benar (1 + i domestik) ÷ (1 + i asing), bukan sebaliknya.", },
          ],
        },
        {
          q: "Inflasi Arunika 3,0% dan inflasi AS 1,5%. Menurut relative purchasing power parity, kurs yang diharapkan setahun lagi?",
          options: [
            { text: "15.514,71", why: "Salah: itu hasil uncovered interest parity (selisih suku bunga), bukan PPP (selisih inflasi).", },
            { text: "15.221,67 — AUR diperkirakan melemah sekitar 1,48%", why: "Benar: 15.000 × 1,03 ÷ 1,015 = 15.221,67. PPP dan UIP memberi angka berbeda karena memakai selisih yang berbeda.", correct: true },
            { text: "15.000 — PPP selalu memprediksi kurs tetap", why: "Salah: PPP memprediksi kurs bergerak sebesar selisih inflasi.", },
          ],
        },
        {
          q: "Fiskal ekspansif + moneter ketat, dengan mobilitas modal tinggi. Menurut Mundell-Fleming, dampak bersihnya pada AUR?",
          options: [
            { text: "Cenderung menguat — suku bunga tinggi menarik modal masuk", why: "Benar: moneter ketat menaikkan suku bunga dan menarik arus modal masuk; dengan mobilitas tinggi efek ini mengalahkan tekanan melemah dari defisit fiskal.", correct: true },
            { text: "Cenderung melemah — defisit fiskal selalu melemahkan mata uang", why: "Salah: defisit fiskal memang menekan, tetapi suku bunga ketat yang menarik modal masuk adalah efek yang dominan di sini.", },
            { text: "Tidak berpengaruh — kedua kebijakan saling meniadakan", why: "Salah: keduanya tidak meniadakan — masing-masing bekerja lewat jalur yang berbeda (suku bunga vs permintaan agregat).", },
          ],
        },
      ],
      reference: "Vignette A: inflasi QT 3,0%; Taylor 5,75%; pengangguran di bawah NAIRU = tekanan inflasi; UIP 15.514,71; PPP 15.221,67; fiskal ekspansif + moneter ketat = mata uang cenderung menguat.",
    },
    {
      id: "vignette-b-corporate",
      eyebrow: "Langkah 3 · Vignette B · Corporate Issuers",
      title: "Vignette B: PT Maju Bersama — struktur modal dan dividen",
      prose: [
        "PT Maju Bersama (ilustratif, semua angka dalam Rp miliar kecuali harga saham): EBIT Rp1.200, beban bunga Rp200 dari utang Rp2.000 dengan kupon 10%, tarif pajak 22%, saham beredar 650 juta lembar, harga pasar Rp12.000 per lembar, payout ratio 50%, pertumbuhan dividen konstan 4%. Risk-free rate 6%, beta saham 1,1, equity risk premium 6%, biaya modal tanpa utang 12%.",
        "Dari angka-angka itu kamu bisa menghitung seluruh ukuran di bawah ini. Periksa konsistensinya dulu: laba bersih = (1.200 − 200) × (1 − 22%) = Rp780 miliar; EPS = 780 ÷ 650 = Rp1.200; DPS = 50% × 1.200 = Rp600. Nilai pasar ekuitas = 12.000 × 650 juta = Rp7.800 miliar; total modal = 7.800 + 2.000 = Rp9.800 miliar.",
        "Enam soal berikut menguji laba dan dividen, WACC, Modigliani-Miller, valuasi dividen, kebijakan dividen, dan tata kelola dari data yang sama.",
      ],
      tasks: [],
      quiz: [
        {
          q: "EBIT Rp1.200 miliar, beban bunga Rp200 miliar, pajak 22%, saham 650 juta, payout 50%. Berapa EPS dan DPS?",
          options: [
            { text: "EPS Rp1.440, DPS Rp720", why: "Salah: 1.440 didapat dari laba sebelum bunga (1.200 × 0,78 ÷ 650) — bunga Rp200 miliar belum dikurangkan.", },
            { text: "EPS Rp1.200, DPS Rp600", why: "Benar: laba bersih 780 ÷ 650 = 1.200; DPS = 50% × 1.200 = 600.", correct: true },
            { text: "EPS Rp1.200, DPS Rp1.200", why: "Salah: DPS sama dengan EPS berarti payout 100%, padahal payout-nya 50%.", },
          ],
        },
        {
          q: "Risk-free 6%, beta 1,1, ERP 6%; utang Rp2.000 miliar @ 10%, pajak 22%; nilai pasar ekuitas Rp7.800 miliar. Berapa WACC?",
          options: [
            { text: "12,60%", why: "Salah: itu cost of equity saja (6 + 1,1 × 6) — utang yang lebih murah belum masuk ke rata-rata tertimbang.", },
            { text: "10,20%", why: "Salah: 10,20% didapat dari bobot 50/50; bobot pasar yang benar adalah 20,41% utang dan 79,59% ekuitas.", },
            { text: "11,62%", why: "Benar: CoE 12,6%; CoD setelah pajak 7,8%; WACC = 20,41% × 7,8% + 79,59% × 12,6% = 11,62%.", correct: true },
          ],
        },
        {
          q: "Dengan biaya modal tanpa utang 12% dan pajak 22%, berapa nilai perusahaan menurut Modigliani-Miller dengan pajak?",
          options: [
            { text: "Rp7.800 miliar", why: "Salah: itu nilai perusahaan tanpa utang (1.200 × 0,78 ÷ 0,12) — tax shield utang belum ditambahkan.", },
            { text: "Rp8.240 miliar", why: "Benar: Vu = 7.800; VL = 7.800 + 0,22 × 2.000 = 8.240. Utang menambah nilai sebesar tax shield.", correct: true },
            { text: "Rp9.800 miliar", why: "Salah: itu total modal menurut harga pasar (7.800 + 2.000), bukan nilai menurut teori MM.", },
          ],
        },
        {
          q: "DPS Rp600, pertumbuhan 4%, cost of equity 12,6%. Nilai wajar Gordon growth dan kesimpulan vs harga pasar Rp12.000?",
          options: [
            { text: "Rp7.255,81 — overvalued menurut model", why: "Benar: D1 = 600 × 1,04 = 624; V0 = 624 ÷ (0,126 − 0,04) = 7.255,81. Harga pasar 12.000 jauh di atas nilai model.", correct: true },
            { text: "Rp7.255,81 — undervalued menurut model", why: "Salah: angkanya benar tetapi arahnya terbalik — harga di atas nilai wajar berarti overvalued.", },
            { text: "Rp15.000 — undervalued menurut model", why: "Salah: 15.000 didapat dari 600 ÷ 0,04 — membagi dengan g saja, bukan dengan (k − g).", },
          ],
        },
        {
          q: "Manajer mengusulkan mengganti dividen dengan buyback saham senilai sama. Dalam dunia Modigliani-Miller tanpa pajak dan tanpa sinyal, dampaknya pada nilai pemegang saham?",
          options: [
            { text: "Tidak ada — nilai sama, yang berubah hanya bentuk pengembalian kas dan perlakuan pajaknya", why: "Benar: dividen vs buyback tidak mengubah nilai total di bawah asumsi MM; perbedaannya muncul dari pajak dan sinyal yang dikirim ke pasar.", correct: true },
            { text: "Buyback selalu menaikkan harga saham", why: "Salah: buyback mengurangi jumlah saham tetapi juga mengurangi kas perusahaan — harga per lembar tidak otomatis naik.", },
            { text: "Dividen selalu lebih baik dari buyback", why: "Salah: preferensi tergantung pajak investor dan sinyal; tidak ada yang selalu lebih baik.", },
          ],
        },
        {
          q: "Manajer memakai free cash flow besar untuk akuisisi yang merusak nilai demi memperbesar kerajaannya (empire building). Masalah dan obatnya?",
          options: [
            { text: "Masalah agensi — kembalikan kas berlebih ke pemegang saham lewat dividen/buyback dan perkuat dewan independen", why: "Benar: kas berlebih + pengawasan lemah = insentif manajer membelanjakan untuk ukuran, bukan nilai. Obatnya adalah disiplin kas dan tata kelola.", correct: true },
            { text: "Tambah utang agar manajer makin leluasa", why: "Salah: utang justru mendisiplinkan manajer lewat kewajiban bunga — tetapi menambah utang tanpa alasan bukan obat untuk empire building.", },
            { text: "Biarkan — akuisisi besar selalu menciptakan sinergi", why: "Salah: sebagian besar akuisisi yang didorong ego manajer menghancurkan nilai pemegang saham.", },
          ],
        },
      ],
      reference: "Vignette B: EPS 1.200, DPS 600; WACC 11,62%; VL MM 8.240; DDM 7.255,81 (overvalued); dividen vs buyback netral di bawah MM; empire building = masalah agensi.",
    },
    {
      id: "vignette-c-alternatives",
      eyebrow: "Langkah 4 · Vignette C · Alternatives",
      title: "Vignette C: dana alternatif — hedge fund, private equity, properti",
      prose: [
        "Hedge fund Alpha (ilustratif, semua angka dalam Rp miliar): AUM awal Rp1.000. Tahun 1 gross return +20%; management fee 2% dari AUM awal; incentive fee 20% dari laba di atas high-water mark, dihitung setelah management fee. Tahun 2 gross return −10%; management fee 2% dari AUM awal tahun 2; high-water mark = NAV akhir tahun 1.",
        "Dana private equity Beta: committed capital Rp500 miliar, called Rp400 miliar, distributed Rp300 miliar, NAV Rp250 miliar. Properti komersial: NOI Rp120 miliar per tahun, cap rate 8%. Emas: harga spot Rp100 juta per kg, futures satu tahun Rp105 juta per kg.",
        "Enam soal berikut menguji fee hedge fund, high-water mark, metrik private equity, valuasi properti, struktur futures, dan likuiditas alternatif dari data yang sama.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Hedge fund Alpha tahun 1: AUM awal 1.000, gross return +20%, management fee 2% dari AUM awal, incentive 20% dari laba setelah management fee. Berapa net return investor?",
          options: [
            { text: "20,0%", why: "Salah: itu gross return — fee belum dikurangkan.", },
            { text: "18,0%", why: "Salah: 18% hanya mengurangkan management fee (200 − 20 = 180); incentive fee 36 belum dikurangkan.", },
            { text: "14,4%", why: "Benar: laba kotor 200 − management fee 20 − incentive 36 = 144; 144 ÷ 1.000 = 14,4%.", correct: true },
          ],
        },
        {
          q: "Tahun 2 Alpha: AUM awal 1.144, gross return −10%, management fee 2% dari AUM awal. Berapa incentive fee tahun 2?",
          options: [
            { text: "Rp22,88 miliar", why: "Salah: itu management fee tahun 2 (2% × 1.144), bukan incentive fee.", },
            { text: "Rp0 — NAV akhir di bawah high-water mark", why: "Benar: NAV akhir 1.006,72 (1.144 × 0,9 − 22,88) berada di bawah HWM 1.144, jadi tidak ada incentive fee sampai kerugian tertutup.", correct: true },
            { text: "20% dari kerugian", why: "Salah: incentive fee hanya dibayar atas laba di atas HWM — tidak ada laba, tidak ada fee, dan tidak ada fee negatif.", },
          ],
        },
        {
          q: "PE Beta: committed 500, called 400, distributed 300, NAV 250. Berapa DPI, RVPI, dan TVPI?",
          options: [
            { text: "DPI 0,75x; RVPI 0,625x; TVPI 1,375x", why: "Benar: DPI = 300 ÷ 400; RVPI = 250 ÷ 400; TVPI = (300 + 250) ÷ 400 = 1,375x.", correct: true },
            { text: "DPI 1,375x; RVPI 0,75x; TVPI 0,625x", why: "Salah: urutannya terbalik — TVPI adalah total (distribusi + NAV) dibagi called, bukan DPI.", },
            { text: "DPI 0,60x; RVPI 0,50x; TVPI 1,10x", why: "Salah: itu hasil bila memakai committed 500 sebagai penyebut — penyebut yang benar adalah called 400.", },
          ],
        },
        {
          q: "Properti komersial dengan NOI Rp120 miliar per tahun dan cap rate 8%. Berapa nilainya?",
          options: [
            { text: "Rp960 miliar", why: "Salah: 120 × 8 mengalikan, bukan membagi — cap rate adalah pembagi.", },
            { text: "Rp1.500 miliar", why: "Benar: 120 ÷ 0,08 = 1.500.", correct: true },
            { text: "Rp1.200 miliar", why: "Salah: 120 ÷ 0,10 memakai cap rate 10%, bukan 8%.", },
          ],
        },
        {
          q: "Harga spot emas 100, futures satu tahun 105 (Rp juta per kg). Struktur pasar dan roll yield bagi posisi long?",
          options: [
            { text: "Contango — roll yield negatif bagi long", why: "Benar: futures di atas spot = contango; long harus roll ke kontrak yang lebih mahal, menggerus return.", correct: true },
            { text: "Backwardation — roll yield positif bagi long", why: "Salah: backwardation adalah futures di bawah spot — kebalikan dari data ini.", },
            { text: "Contango — roll yield positif bagi long", why: "Salah: struktur pasarnya benar, tetapi roll yield contango merugikan long, bukan menguntungkan.", },
          ],
        },
        {
          q: "Dana alternatif umumnya punya lock-up dan valuasi triwulanan (bukan harian). Konsekuensi untuk analisis risiko?",
          options: [
            { text: "Return tampak lebih halus dan risiko tampak lebih rendah dari kenyataannya (stale pricing)", why: "Benar: valuasi jarang membuat volatilitas terukur turun; ditambah lock-up, investor tidak bisa keluar saat harga jatuh.", correct: true },
            { text: "Alternatif selalu lebih likuid dari saham publik", why: "Salah: lock-up dan redemption gate justru membuat alternatif jauh kurang likuid.", },
            { text: "Tidak ada konsekuensi — valuasi triwulanan sama akuratnya dengan harian", why: "Salah: valuasi jarang menyembunyikan pergerakan harga antar periode dan meremehkan risiko ekor.", },
          ],
        },
      ],
      reference: "Vignette C: HF net return Y1 14,4%; incentive Y2 Rp0 (di bawah HWM); PE DPI 0,75x / RVPI 0,625x / TVPI 1,375x; properti 1.500; contango = roll yield negatif; lock-up + stale pricing meremehkan risiko.",
    },
    {
      id: "soal-lepas",
      eyebrow: "Langkah 5 · Jeda",
      title: "Tidak ada soal lepas: 18 soal sudah lengkap",
      prose: [
        "Mock ini sengaja TIDAK menambah soal lepas. Delapan belas soal dari tiga vignette (6 + 6 + 6) sudah mencapai target, dan menambah soal justru mengaburkan diagnosis: bila skormu rendah, kamu perlu tahu vignette mana yang bocor, bukan sekadar total soal yang lebih banyak.",
        "Gunakan langkah ini sebagai jeda: tutup timer, tarik napas, dan tulis di kertas berapa jawaban yang kamu YAKINI benar per vignette — sebelum membuka kunci di Langkah 6. Perbandingan antara keyakinan dan skor nyata adalah data paling jujur tentang kalibrasi dirimu: overconfidence (yakin 16, benar 11) adalah masalah yang berbeda dari ketidakpahaman, dan obatnya berbeda.",
        "Bila kamu mengerjakan mock ini dalam 27 menit, catat juga waktu per vignette. Vignette yang memakan waktu lebih dari 9 menit adalah vignette yang prosesnya belum otomatis — itulah yang dilatih ulang, bukan sekadar materinya.",
      ],
      tasks: [],
      note: {
        title: "Kalibrasi diri",
        type: "risk",
        body: "Kandidat yang yakin 16 dan benar 11 lebih berbahaya dari kandidat yang yakin 11 dan benar 11: yang pertama akan mengulang kesalahan yang sama di ujian sesungguhnya karena merasa sudah bisa. Tulis keyakinanmu SEBELUM melihat kunci.",
      },
      reference: "18 soal = 6 Economics + 6 Corporate Issuers + 6 Alternatives. Diagnosis per vignette, bukan sekadar total.",
    },
    {
      id: "kunci-pembahasan",
      eyebrow: "Langkah 6 · Pembahasan",
      title: "Kunci dan pembahasan: pola kesalahan per vignette",
      prose: [
        "Vignette A (Economics): jawaban benar adalah inflasi teori kuantitas 3,0%; Taylor rule 5,75% (suku bunga aktual 5,50% sedikit longgar); pengangguran di bawah NAIRU menekan inflasi ke atas; UIP 15.514,71; PPP 15.221,67; dan fiskal ekspansif plus moneter ketat cenderung menguatkan AUR. Pola kesalahan yang paling umum: membalik rasio pada UIP dan PPP, serta memakai suku bunga aktual sebagai jawaban Taylor rule. Tulis rumusnya di kartu: inflasi = pertumbuhan uang − pertumbuhan riil; Taylor = r* + inflasi + 0,5 × selisih inflasi + 0,5 × output gap.",
        "Vignette B (Corporate Issuers): jawaban benar adalah EPS Rp1.200 dan DPS Rp600; WACC 11,62%; nilai MM dengan pajak Rp8.240 miliar; DDM Rp7.255,81 sehingga saham overvalued menurut model; dividen vs buyback netral di bawah MM; dan empire building adalah masalah agensi yang diobati dengan disiplin kas. Pola kesalahan yang paling umum: lupa mengurangkan bunga sebelum menghitung laba bersih, memakai cost of equity sebagai WACC, dan memakai nilai pasar total modal sebagai jawaban MM.",
        "Vignette C (Alternatives): jawaban benar adalah net return hedge fund tahun 1 sebesar 14,4%; incentive fee tahun 2 sebesar Rp0 karena NAV di bawah high-water mark; DPI 0,75x, RVPI 0,625x, TVPI 1,375x; nilai properti Rp1.500 miliar; contango dengan roll yield negatif bagi long; dan lock-up plus stale pricing membuat risiko tampak lebih rendah dari kenyataannya. Pola kesalahan yang paling umum: lupa incentive fee saat menghitung net return, memakai committed capital sebagai penyebut metrik PE, dan mengira contango menguntungkan posisi long.",
        "Skor dirimu per vignette: Economics yang bocor berarti rumus makro belum otomatis — kembali ke lesson PM-A3 dan formula sheet. Corporate Issuers yang bocor berarti WACC dan MM belum di luar kepala — drill formula sheet dengan kalkulator. Alternatives yang bocor berarti struktur fee dan metrik belum hafal — baca ulang lesson PM-A9 dan hitung ulang contoh fee di atas dengan tangan.",
      ],
      tasks: [],
      reference: "Tiga pola jebakan: rasio UIP/PPP yang terbalik; bunga yang lupa dikurangkan sebelum laba bersih; fee hedge fund yang hanya dihitung sebagian.",
    },
    {
      id: "error-log",
      eyebrow: "Langkah 7 · Error log",
      title: "Error log: ubah soal salah menjadi jadwal belajar",
      prose: [
        "Untuk SETIAP soal yang salah, catat satu baris dengan lima kolom: (1) topik — misal Taylor rule atau high-water mark; (2) penyebab — pilih satu: konsep (tidak tahu rumusnya), hitung (tahu rumus, salah angka atau tanda), atau baca soal (salah memahami vignette); (3) perbaikan — satu kalimat, misal tulis rumus UIP di kartu dan drill 5 soal; (4) tanggal review — 2 hari lagi untuk penyebab konsep, 1 hari lagi untuk penyebab hitung; (5) status — terbuka sampai kamu menjawab soal sejenis dengan benar tanpa melihat catatan.",
        "Penyebab menentukan obatnya. Soal salah karena konsep berarti kembali ke lesson dan formula sheet; salah karena hitung berarti drill kalkulator 10 soal sejenis; salah karena baca soal berarti latihan membaca vignette dengan teknik garis bawah — tandai aktor, angka, dan kata kunci seperti tanpa mengungkapkan sebelum menjawab.",
        "Setelah mengisi error log, buka halaman /v2/review: setiap soal quiz di mock ini otomatis menjadi kartu spaced-repetition yang dijadwalkan algoritma FSRS, dan soal yang kamu jawab salah akan muncul lebih cepat. Tandai kartu sebagai Again bila kamu masih belum bisa menjawabnya tanpa catatan, Good bila bisa dengan sedikit berpikir, dan Easy hanya bila jawabannya langsung muncul. Kartu yang ditandai Easy padahal kamu menebak adalah kartu yang hilang dari jadwalmu — jujurlah pada tombolmu.",
      ],
      tasks: [],
      note: {
        title: "Aturan error log",
        type: "pitfall",
        body: "Error log tanpa tanggal review adalah daftar keluhan, bukan rencana belajar. Setiap baris WAJIB punya tanggal review — bila tanggalnya lewat dan barisnya masih terbuka, itu prioritas hari itu.",
      },
      reference: "Kolom error log: topik, penyebab (konsep/hitung/baca soal), perbaikan, tanggal review, status.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Skor diri dan langkah berikutnya",
      prose: [
        "Hitung skormu: jumlah jawaban benar dibagi 18, dikali 100%. Ambang lulus mock ini 70%, yaitu 13 benar. Bila kamu mendapat 13 sampai 15, kamu di jalur lulus — fokuskan minggu ini pada vignette terlemahmu saja. Bila 10 sampai 12, fondasimu ada tetapi satu area bocor besar — kerjakan ulang lesson area itu plus drill kalkulatornya. Bila di bawah 10, jangan buru-buru mock berikutnya — kembali ke formula sheet dan drill sampai rumus-rumusnya otomatis.",
        "Perhatikan juga distribusi skor, bukan hanya totalnya. Total 13 dengan Economics 6/6 tetapi Alternatives 3/6 berbeda artinya dari total 13 dengan ketiganya 4-5/6: yang pertama punya satu lubang yang dalam, yang kedua punya fondasi yang merata tetapi belum tajam. Lubang yang dalam diperbaiki dengan satu lesson; fondasi yang merata diperbaiki dengan drill campuran.",
        "Bandingkan dengan Mock Exam 1: bila Mock 1 tinggi dan Mock 2 rendah, kelemahanmu spesifik di Economics, Corporate Issuers, atau Alternatives — bukan di fondasi CFA secara umum. Bila keduanya rendah di area yang sama (misal hitung), obatnya adalah drill kalkulator, bukan membaca ulang teori. Mock berikutnya baru berguna setelah error log langkah 7 terisi dan kartu-kartu review-nya dijadwalkan.",
      ],
      tasks: [],
      summary: [
        "18 soal, target 13 benar (70%), waktu 27 menit.",
        "Vignette A: inflasi QT 3,0%; Taylor 5,75%; UIP 15.514,71; PPP 15.221,67.",
        "Vignette B: EPS 1.200, DPS 600; WACC 11,62%; VL MM 8.240; DDM 7.255,81 (overvalued).",
        "Vignette C: HF net 14,4%, incentive Y2 Rp0; PE DPI 0,75x / RVPI 0,625x / TVPI 1,375x; properti 1.500; contango.",
        "Isi error log untuk setiap soal salah: topik, penyebab, perbaikan, tanggal review, status.",
        "Soal salah otomatis menjadi kartu FSRS di /v2/review — jawab jujur dengan Again, Hard, Good, atau Easy.",
      ],
      next: { label: "PM-CFA Flashcards: Kilat 32 Kartu Lintas Area", href: "/v2/learn/pm-cfa-flashcards" },
      quiz: [
        {
          q: "Kamu mendapat 15 benar dari 18, tetapi Vignette C hanya 2 dari 6. Apa langkah berikutnya yang tepat?",
          options: [
            { text: "Kerjakan ulang Mock Exam 1 besok", why: "Salah: Mock 1 tidak menguji Alternatives — mengulang mock yang salah area tidak menambal lubang yang bocor.", },
            { text: "Isi error log untuk 4 soal Alternatives yang salah, kerjakan ulang lesson PM-A9, lalu drill fee dan metrik alternatif", why: "Benar: 15/18 berarti fondasi kuat dengan satu lubang dalam — diagnosis per vignette menunjuk langsung ke obatnya.", correct: true },
            { text: "Anggap lulus — 15 dari 18 sudah di atas ambang", why: "Salah: lulus mock bukan lulus ujian; lubang 2/6 di satu area adalah risiko nyata di ujian sesungguhnya.", },
          ],
        },
      ],
    },
  ],
};
