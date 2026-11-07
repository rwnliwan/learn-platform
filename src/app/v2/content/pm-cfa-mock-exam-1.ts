import type { V2Lesson } from "../lib/types";

export const pmcfaMockExam1: V2Lesson = {
  slug: "pm-cfa-mock-exam-1",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-CFA Mock Exam 1: 18 Soal Gaya CFA",
  estMinutes: 60,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing",
      title: "Aturan mock: 18 soal, target 70%, 27 menit",
      prose: [
        "Mock ini meniru format item-set CFA Level 1: tiga vignette, masing-masing diikuti 6 soal. Total 18 soal. Target lulus: 70%, yaitu minimal 13 jawaban benar dari 18. Waktu yang disarankan: 27 menit, yaitu 90 detik per soal — kerjakan dengan timer menyala.",
        "Aturan main: soal konsep (vignette A) dikerjakan TANPA kalkulator; soal hitung (vignette B dan C) boleh memakai kalkulator BA II Plus dan formula sheet dari lesson sebelumnya. Jangan mengintip kunci sebelum selesai — nilai mock yang jujur lebih berguna daripada nilai mock yang bagus.",
        "Setelah selesai, hitung skormu di Langkah 8, lalu isi error log di Langkah 7 untuk setiap soal yang salah. Mock yang tidak diikuti error log hanya mengukur; mock yang diikuti error log mengajar.",
      ],
      tasks: [],
      note: {
        title: "Cara memakai mock ini",
        type: "pitfall",
        body: "Godaan terbesar adalah mengerjakan vignette demi vignette sambil mengintip kunci. Tahan. Kerjakan 18 soal berturut-turut dulu, catat jawabanmu di kertas, baru buka Langkah 6 untuk pembahasan.",
      },
      reference: "18 soal · target 13 benar (70%) · 27 menit · soal konsep tanpa kalkulator.",
    },
    {
      id: "vignette-a-ethics",
      eyebrow: "Langkah 2 · Vignette A · Ethics",
      title: "Vignette A: analis, klien, dan hadiah dari broker",
      prose: [
        "Sari adalah analis di sebuah manajer investasi. Ia menerima jam tangan mewah dari broker yang rutin menerima order kliennya, tanpa mengungkapkan hadiah itu kepada siapa pun, dan tidak pernah membandingkan biaya eksekusi broker lain. Di kantor yang sama, Budi menerbitkan rekomendasi BUY untuk emiten X tanpa mengungkapkan fee konsultasi Rp200 juta yang ia terima dari emiten X bulan lalu — analisisnya sendiri benar secara teknis.",
        "Sementara itu, konsultan Dana Pensiun Sejahtera merekomendasikan manajer investasi Y kepada kliennya dan menerima fee 1% dari Y, tanpa memberitahu klien. Di meja lain, seorang karyawan mendengar rencana merger yang belum diumumkan lalu menceritakannya kepada temannya agar temannya membeli saham itu.",
        "Enam soal berikut menguji Standards of Professional Conduct atas keempat situasi di atas. Semua angka dan nama dalam vignette ini ilustratif.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Sari menerima jam tangan mewah dari broker dan tidak pernah membandingkan biaya eksekusi. Pelanggaran utamanya?",
          options: [
            { text: "I(B) Independence and Objectivity — hadiah mengancam objektivitas dan III(A) loyalitas ke klien", why: "Benar: hadiah mewah mengancam objektivitas (I(B)) dan Sari mengabaikan best execution untuk klien (III(A)).", correct: true },
            { text: "VII(B) Reference to CFA — penyalahgunaan gelar", why: "Salah: tidak ada soal gelar CFA di sini; masalahnya hadiah dan eksekusi.", },
            { text: "Tidak ada pelanggaran — hadiah itu legal", why: "Salah: standar CFA lebih tinggi dari hukum; legal belum tentu patuh.", },
          ],
        },
        {
          q: "Budi menerbitkan BUY untuk emiten X tanpa mengungkapkan fee konsultasi Rp200 juta dari emiten X. Analisisnya benar. Ini?",
          options: [
            { text: "Tidak melanggar — analisisnya benar", why: "Salah: standar menilai proses dan disclosure, bukan kebenaran hasil akhir.", },
            { text: "I(B) + VI(A) — objektivitas terancam dan konflik tidak diungkapkan", why: "Benar: fee adalah konflik material yang wajib diungkapkan tertulis; kebenaran analisis tidak menyembuhkan.", correct: true },
            { text: "Hanya III(E) — kerahasiaan klien", why: "Salah: III(E) soal menjaga info klien, bukan soal konflik kepentingan analis.", },
          ],
        },
        {
          q: "Konsultan menerima fee 1% dari manajer Y yang ia rekomendasikan, tanpa memberitahu klien dana pensiun. Ini?",
          options: [
            { text: "VI(C) Referral Fees + III(A) — wajib diungkapkan tertulis sebelum rekomendasi", why: "Benar: fee 1% adalah konflik material; klien berhak tahu insentif di balik rekomendasi sebelum bertindak.", correct: true },
            { text: "Boleh — manajer Y memang bagus", why: "Salah: kualitas manajer tidak menghapus kewajiban disclosure.", },
            { text: "Hanya masalah etiket bisnis", why: "Salah: ini pelanggaran standar yang bisa ditegakkan, bukan sekadar etiket.", },
          ],
        },
        {
          q: "Karyawan menceritakan rencana merger yang belum diumumkan kepada temannya agar temannya membeli saham. Ini?",
          options: [
            { text: "Boleh — bukan dia yang trading", why: "Salah: II(A) melarang trading DAN tipping atas info material nonpublik.", },
            { text: "Pelanggaran II(A) — tipping info material nonpublik", why: "Benar: meneruskan info material nonpublik adalah tipping, terlepas dari siapa yang akhirnya trading.", correct: true },
            { text: "Hanya pelanggaran bila temannya untung", why: "Salah: pelanggaran terjadi saat info diteruskan, bukan saat profit direalisasi.", },
          ],
        },
        {
          q: "Perintah atasan Sari bertentangan dengan kepentingan klien. Menurut hierarki CFA, siapa yang menang?",
          options: [
            { text: "Atasan — yang menggaji", why: "Salah: gaji tidak mengalahkan kewajiban fidusia ke klien.", },
            { text: "Klien — hierarki III(A) di atas IV(A)", why: "Benar: klien lebih tinggi dari employer, employer lebih tinggi dari diri sendiri.", correct: true },
            { text: "Siapa yang kerugiannya lebih besar", why: "Salah: hierarki CFA bersifat prinsip, bukan kalkulasi kerugian.", },
          ],
        },
        {
          q: "Manajer mengklaim GIPS compliant tetapi brosurnya hanya menampilkan 3 composite terbaik dari 12 composite. Masalahnya?",
          options: [
            { text: "Tidak ada — datanya asli", why: "Salah: angka asli tidak cukup; GIPS menuntut kelengkapan composite.", },
            { text: "Cherry-pick composite + I(C) misrepresentation", why: "Benar: GIPS mewajibkan SEMUA portofolio diskresioner semandat masuk composite.", correct: true },
            { text: "Hanya soal desain brosur", why: "Salah: ini pelanggaran substansi GIPS dan misrepresentation.", },
          ],
        },
      ],
      reference: "Vignette A: I(B), VI(A), VI(C), II(A), hierarki klien di atas employer, GIPS composite lengkap.",
    },
    {
      id: "vignette-b-fsa",
      eyebrow: "Langkah 3 · Vignette B · FSA",
      title: "Vignette B: laporan keuangan PT Sinar Jaya",
      prose: [
        "PT Sinar Jaya (ilustratif, semua angka dalam Rp miliar): pendapatan Rp1.000, COGS Rp600, laba kotor Rp400, beban operasi Rp250, EBIT Rp150, beban bunga Rp30, EBT Rp120, pajak Rp30 (tarif 25%), laba bersih Rp90. Neraca: kas Rp80, piutang Rp120, persediaan (LIFO) Rp200, PPE Rp600 — total aset Rp1.000. Utang usaha Rp100, utang jangka pendek Rp50, utang jangka panjang Rp350 — total liabilitas Rp500; ekuitas Rp500. LIFO reserve Rp40 dan naik Rp10 selama tahun berjalan.",
        "Dari angka-angka itu kamu bisa menghitung seluruh rasio di bawah ini. Periksa konsistensinya dulu: total aset Rp1.000 sama dengan liabilitas Rp500 ditambah ekuitas Rp500; laba kotor Rp400 sama dengan pendapatan Rp1.000 dikurangi COGS Rp600; EBT Rp120 dikurangi pajak Rp30 sama dengan laba bersih Rp90. Bila satu angka tidak cocok, hitung ulang sebelum menjawab.",
        "Enam soal berikut menguji rasio, konversi LIFO-FIFO, dan interpretasi laporan keuangan dari data yang sama.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Aset lancar Rp400 (kas 80 + piutang 120 + persediaan 200) dan liabilitas lancar Rp150 (utang usaha 100 + utang jangka pendek 50). Current ratio?",
          options: [
            { text: "1,50", why: "Salah: 400 ÷ 150 bukan 1,50. Coba hitung lagi: 150 × 2 = 300, sisanya 100.", },
            { text: "2,67", why: "Benar: 400 ÷ 150 = 2,67. Perusahaan punya aset lancar 2,67 kali liabilitas lancarnya.", correct: true },
            { text: "4,00", why: "Salah: itu 600 ÷ 150 — kamu memakai PPE, bukan aset lancar.", },
          ],
        },
        {
          q: "Laba bersih Rp90 dan ekuitas Rp500. ROE PT Sinar Jaya?",
          options: [
            { text: "9%", why: "Salah: itu ROA (90 ÷ 1.000). ROE memakai ekuitas sebagai penyebut.", },
            { text: "18%", why: "Benar: 90 ÷ 500 = 18%.", correct: true },
            { text: "25%", why: "Salah: 25% adalah tarif pajak, bukan ROE.", },
          ],
        },
        {
          q: "Persediaan LIFO Rp200, LIFO reserve Rp40. Berapa persediaan FIFO?",
          options: [
            { text: "Rp160 miliar", why: "Salah: reserve ditambahkan, bukan dikurangkan.", },
            { text: "Rp240 miliar", why: "Benar: persediaan FIFO = 200 + 40 = 240.", correct: true },
            { text: "Rp200 miliar", why: "Salah: itu nilai LIFO-nya, belum dikonversi.", },
          ],
        },
        {
          q: "COGS LIFO Rp600 dan LIFO reserve naik Rp10 selama tahun berjalan. Berapa COGS FIFO?",
          options: [
            { text: "Rp610 miliar", why: "Salah: arahnya terbalik — COGS FIFO = COGS LIFO dikurangi kenaikan reserve.", },
            { text: "Rp590 miliar", why: "Benar: 600 − 10 = 590. Saat harga naik, COGS FIFO lebih kecil dari COGS LIFO.", correct: true },
            { text: "Rp600 miliar", why: "Salah: itu COGS LIFO-nya; konversi FIFO mengubah COGS sebesar perubahan reserve.", },
          ],
        },
        {
          q: "EBIT Rp150 dan beban bunga Rp30. Interest coverage ratio?",
          options: [
            { text: "3,0x", why: "Salah: 150 ÷ 30 = 5, bukan 3.", },
            { text: "5,0x", why: "Benar: 150 ÷ 30 = 5,0. EBIT menutupi beban bunga lima kali.", correct: true },
            { text: "0,2x", why: "Salah: itu 30 ÷ 150 — rumusnya terbalik.", },
          ],
        },
        {
          q: "Gross margin PT Sinar Jaya adalah 40% (400 ÷ 1.000). Manajer mengklaim margin ini membuktikan perusahaan lebih efisien dari pesaing bermargin 35%. Kelemahan klaim itu?",
          options: [
            { text: "Margin tanpa pembanding sejenis (bauran produk, industri, tren) belum membuktikan efisiensi", why: "Benar: margin 40% vs 35% bisa berasal dari bauran produk atau segmen yang berbeda, bukan efisiensi. Bandingkan dengan perusahaan sejenis dan tren historis.", correct: true },
            { text: "Gross margin tidak pernah bisa dibandingkan antar perusahaan", why: "Salah: bisa dibandingkan, asal pembandingnya sejenis dan definisinya sama.", },
            { text: "Margin 40% pasti salah hitung", why: "Salah: 400 ÷ 1.000 memang 40%; hitungannya benar, interpretasinya yang prematur.", },
          ],
        },
      ],
      reference: "Vignette B: current ratio 2,67; ROE 18%; FIFO inventory 240; COGS FIFO 590; interest coverage 5,0x.",
    },
    {
      id: "vignette-c-quant-equity",
      eyebrow: "Langkah 4 · Vignette C · Quant dan Equity",
      title: "Vignette C: return lima tahun dan valuasi saham",
      prose: [
        "Sebuah saham (ilustratif) mencatat return tahunan 8%, minus 2%, 12%, 5%, dan 7% selama lima tahun. Risk-free rate 3%, return pasar 10%, beta saham 1,2. Saham itu diperkirakan membayar dividen tahun depan Rp5, required return 12%, dan pertumbuhan dividen konstan 4%.",
        "Hitung dulu statistik dasarnya sebelum menjawab: mean return = (8 − 2 + 12 + 5 + 7) ÷ 5 = 6%. Sample standar deviasi (pembagi n−1) = 5,15%. Required return CAPM = 3% + 1,2 × (10% − 3%) = 11,4%. Nilai wajar Gordon growth = 5 ÷ (0,12 − 0,04) = Rp62,50.",
        "Enam soal berikut menguji statistik return, CAPM, dan valuasi dari data yang sama. Perhatikan jebakan pembagi n vs n−1 dan jebakan memakai return pasar mentah-mentah sebagai premi risiko.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Return 8%, minus 2%, 12%, 5%, 7% (ilustratif). Mean return?",
          options: [
            { text: "5%", why: "Salah: jumlah return = 30, dibagi 5 = 6%, bukan 5%.", },
            { text: "6%", why: "Benar: (8 − 2 + 12 + 5 + 7) ÷ 5 = 30 ÷ 5 = 6%.", correct: true },
            { text: "7%", why: "Salah: 7% adalah return tahun terakhir, bukan rata-rata lima tahun.", },
          ],
        },
        {
          q: "Sample standar deviasi return di atas adalah 5,15%. Seorang kandidat memakai pembagi n dan mendapat 4,61%. Kesalahannya?",
          options: [
            { text: "Tidak ada — keduanya benar", why: "Salah: 4,61% adalah population SD; untuk sampel, CFA memakai pembagi n−1.", },
            { text: "Memakai population SD, bukan sample SD (pembagi n−1)", why: "Benar: data lima tahun adalah sampel, jadi penyebutnya 4, bukan 5.", correct: true },
            { text: "Salah memasukkan return negatif", why: "Salah: return minus 2% sudah benar masuk ke perhitungan mean dan varians.", },
          ],
        },
        {
          q: "Risk-free 3%, beta 1,2, return pasar 10% (ilustratif). Required return CAPM?",
          options: [
            { text: "15,0%", why: "Salah: 3% + 1,2 × 10% lupa mengurangkan risk-free dari return pasar.", },
            { text: "11,4%", why: "Benar: 3% + 1,2 × (10% − 3%) = 3% + 8,4% = 11,4%.", correct: true },
            { text: "10,0%", why: "Salah: itu return pasar, bukan return saham ber-beta 1,2.", },
          ],
        },
        {
          q: "Dividen tahun depan Rp5, required return 12%, pertumbuhan konstan 4% (ilustratif). Nilai wajar Gordon growth?",
          options: [
            { text: "Rp62,50", why: "Benar: 5 ÷ (0,12 − 0,04) = 5 ÷ 0,08 = 62,50.", correct: true },
            { text: "Rp31,25", why: "Salah: 5 ÷ 0,16 memakai k ditambah g; rumusnya k dikurangi g.", },
            { text: "Rp125,00", why: "Salah: itu 5 ÷ 0,04 — hanya membagi dengan g.", },
          ],
        },
        {
          q: "Harga pasar saham itu Rp75, di atas nilai wajar Gordon Rp62,50. Dengan asumsi model benar, kesimpulannya?",
          options: [
            { text: "Saham undervalued — beli", why: "Salah: harga di ATAS nilai wajar berarti overvalued, bukan undervalued.", },
            { text: "Saham overvalued menurut model — jangan beli pada harga ini", why: "Benar: membayar Rp75 untuk aset bernilai Rp62,50 adalah membayar premi di atas nilai wajar.", correct: true },
            { text: "Model tidak memberi kesimpulan apa-apa", why: "Salah: perbandingan harga vs nilai wajar justru inti keputusan valuasi.", },
          ],
        },
        {
          q: "Manajer mengklaim Sharpe ratio portofolionya 0,60 (return 12%, risk-free 3%, SD 15%) membuktikan ia lebih baik dari manajer lain ber-Sharpe 0,50. Kelemahan klaim itu?",
          options: [
            { text: "Sharpe tidak pernah bisa dibandingkan", why: "Salah: Sharpe bisa dibandingkan, asal periode dan kelas aset sebanding.", },
            { text: "Perbandingan hanya valid bila periode dan kelas aset sebanding; Sharpe juga meremehkan risiko ekor", why: "Benar: Sharpe dari periode atau aset berbeda tidak sebanding, dan SD meremehkan risiko distribusi berekor gemuk.", correct: true },
            { text: "Sharpe 0,60 pasti salah hitung", why: "Salah: (12% − 3%) ÷ 15% memang 0,60.", },
          ],
        },
      ],
      reference: "Vignette C: mean 6%; sample SD 5,15%; CAPM 11,4%; Gordon Rp62,50; harga 75 berarti overvalued.",
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
      reference: "18 soal = 6 Ethics + 6 FSA + 6 Quant dan Equity. Diagnosis per vignette, bukan sekadar total.",
    },
    {
      id: "kunci-pembahasan",
      eyebrow: "Langkah 6 · Pembahasan",
      title: "Kunci dan pembahasan: pola kesalahan per vignette",
      prose: [
        "Vignette A (Ethics): jawaban benar adalah I(B) + III(A) untuk jam tangan Sari; I(B) + VI(A) untuk fee Budi; VI(C) + III(A) untuk fee konsultan; II(A) untuk tipping merger; klien menang atas atasan; dan cherry-pick composite + I(C) untuk klaim GIPS. Pola kesalahan yang paling umum: menganggap analisis yang benar menyembuhkan pelanggaran (soal Budi) dan menganggap legal sama dengan etis (soal Sari). Ingat: standar CFA menilai proses dan disclosure, bukan hasil akhir.",
        "Vignette B (FSA): jawaban benar adalah current ratio 2,67; ROE 18%; persediaan FIFO Rp240 miliar; COGS FIFO Rp590 miliar; interest coverage 5,0x; dan margin tanpa pembanding belum membuktikan efisiensi. Pola kesalahan yang paling umum: memakai total aset sebagai penyebut ROE (itu ROA), mengurangkan LIFO reserve dari persediaan, dan membalik arah konversi COGS. Tulis rumus konversi LIFO di kartu: inventory FIFO = LIFO + reserve; COGS FIFO = COGS LIFO − perubahan reserve.",
        "Vignette C (Quant dan Equity): jawaban benar adalah mean 6%; kesalahan kandidat adalah memakai population SD (pembagi n); CAPM 11,4%; Gordon Rp62,50; harga Rp75 berarti overvalued; dan Sharpe hanya sebanding bila periode dan aset sebanding. Pola kesalahan yang paling umum: memakai return pasar 10% langsung sebagai premi risiko (premi = 10% − 3% = 7%), dan membagi dividen dengan g saja atau dengan k + g pada Gordon growth.",
        "Skor dirimu per vignette: Ethics yang bocor berarti hafalan standar belum otomatis — kembali ke lesson PM-A1 dan formula sheet Langkah 7. FSA yang bocor berarti rumus rasio belum di luar kepala — drill formula sheet Langkah 7 dengan kalkulator. Quant dan Equity yang bocor berarti kesalahan tanda dan pembagi — drill kalkulator di lesson sebelumnya.",
      ],
      tasks: [],
      reference: "Tiga pola jebakan: hasil benar tidak menyembuhkan pelanggaran; arah konversi LIFO; premi risiko = Rm − Rf.",
    },
    {
      id: "error-log",
      eyebrow: "Langkah 7 · Error log",
      title: "Error log: ubah soal salah menjadi jadwal belajar",
      prose: [
        "Untuk SETIAP soal yang salah, catat satu baris dengan lima kolom: (1) topik — misal LIFO reserve atau CAPM; (2) penyebab — pilih satu: konsep (tidak tahu rumusnya), hitung (tahu rumus, salah angka atau tanda), atau baca soal (salah memahami vignette); (3) perbaikan — satu kalimat, misal tulis rumus COGS FIFO di kartu dan drill 5 soal; (4) tanggal review — 2 hari lagi untuk penyebab konsep, 1 hari lagi untuk penyebab hitung; (5) status — terbuka sampai kamu menjawab soal sejenis dengan benar tanpa melihat catatan.",
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
        "Perhatikan juga distribusi skor, bukan hanya totalnya. Total 13 dengan Ethics 6/6 tetapi FSA 3/6 berbeda artinya dari total 13 dengan ketiganya 4-5/6: yang pertama punya satu lubang yang dalam, yang kedua punya fondasi yang merata tetapi belum tajam. Lubang yang dalam diperbaiki dengan satu lesson; fondasi yang merata diperbaiki dengan drill campuran.",
        "Mock berikutnya baru berguna setelah error log langkah 7 terisi dan kartu-kartu review-nya dijadwalkan. Mengulang mock yang sama besok tanpa memperbaiki apa pun hanya mengukur ingatan jangka pendek, bukan pemahaman.",
      ],
      tasks: [],
      summary: [
        "18 soal, target 13 benar (70%), waktu 27 menit.",
        "Vignette A: standar menilai proses dan disclosure, bukan hasil; legal belum tentu etis.",
        "Vignette B: current ratio 2,67; ROE 18%; FIFO inventory 240; COGS FIFO 590; coverage 5,0x.",
        "Vignette C: mean 6%; sample SD 5,15%; CAPM 11,4%; Gordon Rp62,50; harga 75 overvalued.",
        "Isi error log untuk setiap soal salah: topik, penyebab, perbaikan, tanggal review, status.",
        "Soal salah otomatis menjadi kartu FSRS di /v2/review — jawab jujur dengan Again, Hard, Good, atau Easy.",
      ],
      next: { label: "PM-CFA Mock Exam 2: 18 Soal Gaya CFA", href: "/v2/learn/pm-cfa-mock-exam-2" },
      quiz: [
        {
          q: "Kamu mendapat 12 benar dari 18 (67%). Apa langkah berikutnya yang tepat?",
          options: [
            { text: "Langsung mock berikutnya besok", why: "Salah: mengulang mock tanpa memperbaiki apa pun hanya mengukur ingatan jangka pendek.", },
            { text: "Isi error log per soal salah, perbaiki area terlemah, lalu mock ulang setelah review", why: "Benar: 12/18 berarti satu area bocor — diagnosis dulu lewat error log, baru ukur ulang.", correct: true },
            { text: "Anggap lulus — 67% sudah dekat dengan 70%", why: "Salah: dekat bukan lulus; ambang 70% berarti 13 benar, dan 12 berarti masih ada lubang.", },
          ],
        },
      ],
    },
  ],
};
