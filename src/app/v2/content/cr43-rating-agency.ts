import type { V2Lesson } from "../lib/types";

export const cr43: V2Lesson = {
  slug: "cr43-rating-agency",
  track: "Credit Risk",
  module: "Rating & Pemodelan",
  title: "CR43 — Metodologi Rating Agency: Standard and Poor's, Moody's, dan Fitch dari Dalam",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu notch turun — biaya pinjaman naik Rp5 miliar setahun",
      prose: [
        "PT MajuBersama berperingkat BBB — investment grade terendah. Komite rating Standard and Poor's menurunkan satu notch menjadi BB+ — 'junk' tertinggi. Konsekuensinya seketika: biaya pinjaman naik 150 bps, beberapa dana pensiun yang hanya boleh memegang investment grade TERPAKSA menjual obligasinya, dan harga obligasi jatuh 8 persen dalam seminggu. Satu notch — tiga huruf — mengubah nasib perusahaan. Dan MajuBersama tidak gagal bayar satu rupiah pun; yang berubah hanya OPINI tentang kemampuannya membayar di masa depan.",
        "Inilah kekuatan rating agency: opini mereka adalah gerbang. Investment grade vs speculative grade menentukan siapa boleh membeli, berapa biaya modal, dan berapa agunan yang harus diserahkan. Pemeringkat bukan regulator — mereka perusahaan swasta yang menjual opini. Tetapi opini itu tertanam di regulasi (Basel memakai rating eksternal untuk bobot risiko, CR4a), di kontrak (covenant yang memicu pelunasan dini bila rating turun), dan di mandat investasi (dana pensiun dilarang memegang junk).",
        "Lesson ini membangun topik yang hanya disebut sebagai sumber data: CR10, CR29, dan CR41 menyebut Standard and Poor's, Moody's, atau Fitch sebagai penyedia data default — tetapi tidak ada lesson tentang METODOLOGI mereka: skala rating, through-the-cycle, proses komite, outlook, watch, dan pemetaan ke PD. Setelah lesson ini kamu bisa: (1) membaca skala rating tiga agensi dan memetakannya; (2) menjelaskan through-the-cycle vs point-in-time; (3) menjelaskan proses komite rating dan peran analis; (4) membedakan outlook, watch, dan downgrade; (5) memetakan rating ke PD dan menghitung EL portofolio.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "CR10, CR29, dan CR41 menyebut lembaga pemeringkat sebagai sumber data (misalnya tabel default historis) — tetapi tidak ada lesson tentang metodologi mereka. CR39 membahas internal rating system bank sendiri — bukan rating eksternal. Lesson ini membangun metodologi eksternal dari nol: skala, through-the-cycle, komite, outlook dan watch, serta pemetaan rating ke PD.",
      },
      reference: "BBB (PD 0,18 persen) dan BB (PD 0,9 persen). EL: BBB Rp500 juta × 0,18 persen × LGD 45 persen = Rp0,405 juta; BB Rp300 juta × 0,9 persen × 45 persen = Rp1,215 juta; total Rp1,62 juta.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca rating seperti analis pemeringkat — dan tahu apa yang tidak dikatakan rating itu.",
        "(1) Membaca skala rating tiga agensi dan memetakannya satu sama lain;",
        "(2) Menjelaskan through-the-cycle vs point-in-time;",
        "(3) Menjelaskan proses komite rating — dari analis ke voting;",
        "(4) Membedakan outlook, watch, dan downgrade — serta efek cliff investment grade;",
        "(5) Memetakan rating ke PD dan menghitung EL portofolio.",
      ],
      tasks: [],
    },
    {
      id: "skala",
      eyebrow: "Langkah 3 · Teori",
      title: "Skala rating: tiga bahasa untuk satu risiko",
      prose: [
        "Tiga agensi besar memakai skala yang mirip tetapi tidak identik. Standard and Poor's dan Fitch: AAA, AA, A, BBB, BB, B, CCC, CC, C, D (gagal bayar) — dengan plus dan minus (AA+, AA, AA−). Moody's: Aaa, Aa, A, Baa, Ba, B, Caa, Ca, C — dengan angka 1, 2, 3 (Aa1, Aa2, Aa3). Pemetaan kasarnya: AAA = Aaa; AA = Aa; A = A; BBB = Baa; BB = Ba; B = B; CCC = Caa. Garis terpenting: BBB/Baa ke ATAS adalah investment grade; BB/Ba ke BAWAH adalah speculative grade ('junk'). Satu notch melewati garis itu — BBB− ke BB+ — adalah cliff: bukan penurunan biasa, melainkan perubahan kategori yang memicu penjualan paksa.",
        "Rating mengukur probabilitas gagal bayar RELATIF, bukan absolut. AAA bukan berarti 'tidak mungkin gagal' — melainkan 'paling kecil kemungkinannya gagal dibanding yang lain'. Pemetaan ke PD memakai tabel default historis (data puluhan tahun): AAA 0,01 persen, AA 0,02 persen, A 0,05 persen, BBB 0,18 persen, BB 0,9 persen, B 4,5 persen, CCC 25 persen (angka ilustratif dari tabel historis agensi — dipakai di lab). Perhatikan lompatannya: dari BBB ke BB, PD naik 5 kali lipat; dari BB ke B, 5 kali lagi. Rating KIRA-KIRA logaritmik — PD naik beberapa kali lipat per notch — tetapi rasionya tidak konstan (2×, 2,5×, 3,6×, 5×, 5×, 5,6× antar notch berurutan), jadi ini gambaran kasar, bukan skala log yang eksak.",
        "Through-the-cycle (TTC) adalah filosofi pemeringkat: rating menilai kemampuan membayar MELALUI siklus — bukan pada titik siklus hari ini. Perusahaan yang melemah karena resesi 1 tahun tidak langsung diturunkan bila fundamental jangka panjangnya utuh; perusahaan yang membaik karena booming 1 tahun tidak langsung dinaikkan. Konsekuensinya: rating BERGERAK LAMBAT — stabil, tetapi terlambat. Lawannya, point-in-time (PIT, CR10), menilai risiko HARI INI — bergerak cepat, tetapi bergejolak. Bank memakai PIT untuk pricing dan pencadangan (IFRS 9), agensi memakai TTC untuk rating publik. Keduanya benar — untuk pertanyaan yang berbeda.",
        "Stabilitas TTC punya harga: rating sering terlambat mengenali kerusakan. Enron berperingkat investment grade 4 hari sebelum bangkrut (2001). Lehman berperingkat A sampai seminggu sebelum jatuh (2008). Pemeringkat membela diri: 'Rating adalah opini jangka panjang, bukan peringatan dini.' Kritikus menjawab: 'Opini yang terlambat adalah opini yang tidak berguna.' Investor yang bijak memakai rating sebagai SATU input — bersama spread pasar (E5), harga CDS, dan analisis sendiri (CR17). Pasar sering 'menurunkan rating' berbulan-bulan sebelum agensi melakukannya: spread yang melebar adalah rating pasar yang lebih cepat.",
      ],
      tasks: [],
      formula: String.raw`\text{EL} = EAD \times PD_{rating} \times LGD`,
      formulaNote: "EL = expected loss; EAD = eksposur; PD dari tabel pemetaan rating; LGD = 45 persen. Contoh: BBB 500 × 0,18 persen × 45 persen = 0,405; BB 300 × 0,9 persen × 45 persen = 1,215; total 1,62 (juta rupiah).",
      reference: "PD ilustratif: AAA 0,01 persen; BBB 0,18 persen; BB 0,9 persen; B 4,5 persen; CCC 25 persen. Cliff: BBB− ke BB+.",
    },
    {
      id: "komite-outlook",
      eyebrow: "Langkah 4 · Teori",
      title: "Komite, outlook, dan watch: bagaimana rating diputuskan",
      prose: [
        "Proses rating punya lima tahap. Pertama, analis utama mengumpulkan laporan keuangan, bertemu manajemen, dan membangun model — termasuk analisis industri (CR18) dan posisi kompetitif. Kedua, analis menulis rekomendasi dengan argumen dan angka. Ketiga, komite rating — 5–10 analis senior termasuk yang TIDAK terlibat dalam transaksi itu — mendengarkan, menginterogasi, dan VOTING. Keempat, emiten diberi kesempatan menanggapi (appeal) sebelum publikasi — tetapi komite tidak wajib mengubah keputusannya. Kelima, rating dipublikasikan dengan laporan yang menjelaskan alasan — dan pasar bereaksi.",
        "Dua hal membuat proses ini penting. Pertama, komite adalah pengaman terhadap analis tunggal yang terlalu dekat dengan emiten — 'capture' adalah risiko nyata ketika analis bertemu manajemen tiap kuartal. Kedua, modelnya KUALITATIF-kuantitatif: angka (leverage, coverage, arus kas) ditimbang bersama faktor kualitatif (kualitas manajemen, posisi pasar, tata kelola). Dua perusahaan dengan leverage yang sama bisa berperingkat berbeda — karena yang satu punya manajemen yang dipercaya dan yang lain tidak. Inilah yang membedakan rating agency dari model statistik murni (CR10): judgment manusia adalah bagian dari metodologi, bukan cacatnya.",
        "Outlook dan watch adalah sinyal dini. Outlook (positif, stabil, negatif) berarti rating MUNGKIN berubah — biasanya dalam 6–24 bulan, tetapi itu praktik umum agensi, bukan aturan baku: tiap agensi punya horizon dan definisinya sendiri. Watch (credit watch positif/negatif) berarti rating MUNGKIN berubah — biasanya dalam 90 hari, juga praktik umum, bukan tenggat hukum — biasanya setelah peristiwa besar (akuisisi, skandal). Downgrade adalah perubahan itu sendiri. Investor yang menunggu downgrade sudah terlambat — pasar bergerak saat outlook berubah menjadi negatif, bukan saat rating turun. Dan efek cliff: dana yang mandatnya 'investment grade only' harus menjual saat BB+ — bukan saat perusahaan benar-benar gagal.",
        "Konflik kepentingan yang jujur: model issuer-pays — emiten MEMBAYAR agensi yang menilainya. Agensi membela diri dengan pemisahan tim komersial dan analitis ('firewall') — tetapi insentifnya tetap: agensi yang terlalu keras kehilangan klien ke agensi lain (rating shopping). Reformasi pasca-2008 (Dodd-Frank, regulasi UE) menambah transparansi dan akuntabilitas — tetapi tidak mengubah model issuer-pays. Investor yang memahami konflik ini tidak membuang rating — ia memakai rating dengan diskon yang sesuai.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira rating AAA berarti 'aman'. AAA berarti 'paling kecil kemungkinannya gagal DIBANDING yang lain' — bukan 'tidak mungkin gagal'. AAA 2008 (tranche CDO) gagal karena modelnya salah, bukan karena hurufnya berbohong.",
      },
      reference: "Outlook: biasanya 6–24 bulan. Watch: biasanya 90 hari. Issuer-pays: emiten membayar agensi yang menilainya.",
    },
    {
      id: "lab-rating",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin EL dari rating",
      prose: [
        "Lab ini membangun mesin EL dari rating: dari eksposur, PD pemetaan rating, dan LGD — hitung EL tiap debitur dan total portofolio.",
        "Hitung dulu di kepala. Debitur BBB: 500 × 0,0018 × 0,45 = 0,405 juta. Debitur BB: 300 × 0,009 × 0,45 = 1,215 juta. Total EL = 0,405 + 1,215 = Rp1,62 juta. Perhatikan: eksposur BB lebih kecil (300 vs 500), tetapi EL-nya tiga kali lebih besar — karena PD-nya lima kali lipat.",
        "Tugas lab: tulis fungsi yang menerima eksposur dan PD dua debitur plus LGD — lalu mencetak EL BBB, EL BB, dan total EL. Tiga angka ini adalah ringkasan risiko portofolio dari sudut rating.",
        "Setelah lolos, coba eksperimen: turunkan MajuBersama dari BBB ke BB (cliff) dan lihat EL-nya naik dari 0,405 menjadi 2,025 juta (500 × 0,009 × 0,45) — lima kali lipat dari satu notch. Lalu tanyakan: berapa modal yang harus ditambah bank untuk satu notch itu?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `el_bbb` (500 dikali PD BBB dikali LGD)" },
        { id: "t2", text: "Hitung `el_bb` (300 dikali PD BB dikali LGD)" },
        { id: "t3", text: "Hitung `el_total` (el_bbb + el_bb)" },
      ],
      expected: "el_bbb=0.405\nel_bb=1.215\nel_total=1.62",
      hints: [
        "EL = EAD x PD x LGD.",
        "PD BBB = 0,0018; PD BB = 0,009; LGD = 0,45.",
        "Total EL = jumlah EL tiap debitur.",
      ],
      code: {
        starter: `# Portofolio: BBB Rp500 jt (PD 0,18%), BB Rp300 jt (PD 0,9%), LGD 45%.\nead_bbb = 500.0\npd_bbb = 0.0018\nead_bb = 300.0\npd_bb = 0.009\nlgd = 0.45\n\n# TULIS KODEMU: hitung el_bbb, el_bb, el_total.\n# Cetak, per baris: el_bbb, el_bb, el_total.\n\n`,
        lockLines: 6,
        solution: `# Portofolio: BBB Rp500 jt (PD 0,18%), BB Rp300 jt (PD 0,9%), LGD 45%.\nead_bbb = 500.0\npd_bbb = 0.0018\nead_bb = 300.0\npd_bb = 0.009\nlgd = 0.45\n\n\nel_bbb = ead_bbb * pd_bbb * lgd\nel_bb = ead_bb * pd_bb * lgd\nel_total = el_bbb + el_bb\nprint(f"el_bbb={el_bbb:.3f}")\nprint(f"el_bb={el_bb:.3f}")\nprint(f"el_total={el_total:.3f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "el_bbb", value: 0.405, tol: 0.001, label: "EL BBB Rp0,405 juta", msg: "500 x 0,0018 x 0,45 = 0,405." },
          { kind: "equal", task: "t2", name: "el_bb", value: 1.215, tol: 0.001, label: "EL BB Rp1,215 juta", msg: "300 x 0,009 x 0,45 = 1,215. Eksposur lebih kecil, EL tiga kali lebih besar — PD lima kali lipat." },
          { kind: "equal", task: "t3", name: "el_total", value: 1.62, tol: 0.001, label: "Total EL Rp1,62 juta", msg: "0,405 + 1,215 = 1,62." },
        ],
      },
      reference: "EL BBB Rp0,405 juta; EL BB Rp1,215 juta; total Rp1,62 juta.",
    },
    {
      id: "praktik",
      eyebrow: "Langkah 6 · Teori",
      title: "Praktik: memakai rating dengan benar — dan dengan diskon",
      prose: [
        "Investor yang memakai rating dengan benar mengikuti empat aturan. Pertama, bandingkan rating dengan spread pasar: bila obligasi BBB diperdagangkan dengan spread seperti BB, pasar sudah 'menurunkan rating'-nya — percayai pasar, bukan hurufnya. Kedua, baca laporan ratingnya — bukan hanya hurufnya: alasan komite (leverage naik, arus kas melemah) lebih informatif dari hurufnya. Ketiga, perhatikan outlook dan watch — sinyal dini lebih berharga dari downgrade itu sendiri. Keempat, diversifikasi agensi: bila dua agensi berkata BBB dan satu berkata BB (split rating), ambil yang TERBURUK untuk kehati-hatian — atau rata-rata dengan bobot, tetapi jangan ambil yang terbaik.",
        "Untuk bank, rating eksternal punya fungsi regulasi: Basel memakai rating eksternal untuk bobot risiko ATMR. Basel III final (standardised approach): AAA–AA 20 persen, A 50 persen, BBB 75 persen, BB 100 persen, B ke bawah 150 persen. Perhatian: angka ini BERUBAH antar kerangka — Basel II memberi BBB 100 persen (bukan 75 persen) dan tidak memakai bucket yang sama persis; periksa versi yang berlaku sebelum memakai angka ini. Satu notch BBB ke BB menaikkan bobot risiko dari 75 persen ke 100 persen (Basel III final) — bank harus memegang modal lebih besar untuk eksposur yang sama, dan menagihnya lewat bunga. Inilah mengapa penurunan rating MajuBersama menaikkan biaya pinjamannya.",
        "Dua pembedaan yang wajib dikenal sebelum memakai rating apa pun. Pertama, rating ISSUER vs rating ISSUE: rating issuer menilai kemampuan membayar perusahaan secara umum; rating issue menilai satu obligasi tertentu — dan bisa berbeda: obligasi beragunan (secured) bisa satu-dua notch DI ATAS rating issuer, obligasi subordinasi bisa DI BAWAH. Jangan memakai rating issuer untuk menghargai obligasi subordinasi. Kedua, rating SOLICITED vs UNSOLICITED: rating solicited diminta dan dibayar emiten (dengan akses ke data internal); rating unsolicited diterbitkan agensi atas inisiatif sendiri dari data publik — tanpa bayaran dan tanpa akses manajemen — dan biasanya ditandai secara eksplisit. Rating unsolicited cenderung lebih konservatif dan lebih jarang diperbarui; jangan membandingkannya seolah setara dengan solicited.",
        "Di Indonesia, Pefindo adalah pemeringkat domestik — dengan skala yang sama (idAAA, idAA, dan seterusnya) tetapi kalibrasi nasional: idAAA berarti 'terbaik di Indonesia', bukan 'terbaik di dunia'. Peringkat nasional TIDAK bisa dibandingkan langsung dengan peringkat global — perusahaan idAAA bisa berperingkat BB secara global. Investor yang membandingkan idAAA dengan AAA global sedang membandingkan juara nasional dengan juara dunia.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membandingkan peringkat nasional (idAAA) dengan peringkat global (AAA). Skala nasional dikalibrasi terhadap risiko negara itu sendiri — idAAA adalah yang terbaik DI INDONESIA, bukan yang terbaik di dunia.",
      },
      reference: "Bobot ATMR Basel III final: AAA–AA 20 persen, A 50 persen, BBB 75 persen, BB 100 persen, B ke bawah 150 persen (Basel II: BBB 100 persen). Pefindo: skala nasional (idAAA).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: MajuBersama — menjual sebelum cliff",
      prose: [
        "Tiga bulan sebelum downgrade MajuBersama, tiga sinyal muncul: outlook berubah menjadi negatif, spread obligasinya melebar dari 150 bps ke 280 bps (sudah seperti BB), dan laporan rating menyebut leverage naik dua kuartal berturut-turut. Manajer dana yang membaca sinyal itu menjual obligasi MajuBersama di harga 98 — rugi 2 persen. Manajer yang menunggu downgrade menjual di harga 90 — rugi 10 persen — setelah dana pensiun lain ikut menjual paksa karena mandat investment grade.",
        "Keputusan menjual di 98 bukan keputusan yang 'benar' secara hasil semata — MajuBersama tidak gagal bayar, dan obligasinya pulih ke 95 setahun kemudian. Tetapi keputusan itu benar secara PROSES: outlook negatif + spread BB + leverage naik adalah tiga sinyal independen yang semuanya menunjuk arah yang sama. Investor yang menunggu 'bukti' berupa downgrade sedang menunggu pasar memberitahunya apa yang sudah diketahuinya tiga bulan lalu.",
        "Pelajaran mini-case ini: rating adalah opini yang bergerak lambat — dan kelambatan itu adalah fitur (stabilitas TTC) sekaligus cacat (terlambat). Investor yang memakai rating harus melengkapinya dengan sinyal pasar yang bergerak cepat — spread, CDS, dan analisis sendiri. Hurufnya memberi tahu KATEGORI risikonya; spread memberi tahu HARGA risikonya hari ini.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, tiga sinyal independen (outlook, spread, leverage) dipakai bersama — bukan satu sinyal. Kedua, tindakan diambil sebelum cliff — bukan sesudahnya. Ketiga, keputusan dinilai dari proses — bukan dari hasil yang mengandung pemulihan setahun kemudian.",
      },
      reference: "Jual di 98 (rugi 2 persen) vs jual di 90 setelah downgrade (rugi 10 persen). Tiga sinyal: outlook negatif, spread 280 bps, leverage naik.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "EL BBB Rp0,405 juta; EL BB Rp1,215 juta; total Rp1,62 juta.",
        "Cliff: BBB− ke BB+ mengubah kategori — penjualan paksa oleh mandat investment grade.",
        "Through-the-cycle: stabil tetapi terlambat. Point-in-time: cepat tetapi bergejolak.",
        "Outlook biasanya 6–24 bulan; watch biasanya 90 hari; downgrade adalah perubahannya.",
        "Issuer-pays: emiten membayar agensi — pakai rating dengan diskon yang sesuai.",
      ],
      next: { label: "CR44 — Model Portofolio Kredit Bernama: CreditMetrics, CreditRisk+, dan KMV", href: "/v2/learn/cr44-model-portofolio-kredit" },
      quiz: [
        {
          q: "Portofolio: BBB Rp500 juta (PD 0,18 persen), BB Rp300 juta (PD 0,9 persen), LGD 45 persen. Berapa EL tiap debitur dan totalnya?",
          options: [
            { text: "EL BBB Rp0,405 juta; EL BB Rp1,215 juta; total Rp1,62 juta", why: "Tepat: 500 × 0,0018 × 0,45 = 0,405; 300 × 0,009 × 0,45 = 1,215; total 1,62.", correct: true },
            { text: "EL BBB Rp0,9 juta; EL BB Rp2,7 juta; total Rp3,6 juta", why: "Salah: itu memakai PD 0,4 persen dan 2 persen — bukan PD pemetaan rating (0,18 dan 0,9 persen)." },
            { text: "EL BBB Rp2,25 juta; EL BB Rp1,35 juta; total Rp3,6 juta", why: "Salah: itu EAD × LGD tanpa PD — EL tanpa PD berarti mengasumsikan semua debitur pasti gagal." },
            { text: "EL BBB Rp0,405 juta; EL BB Rp0,405 juta; total Rp0,81 juta", why: "Salah: EL BB memakai PD BB (0,9 persen) — lima kali PD BBB. Menyamakan keduanya mengabaikan perbedaan rating." },
          ],
        },
        {
          q: "MajuBersama turun dari BBB− ke BB+. Kenapa ini lebih dari sekadar 'satu notch'?",
          options: [
            { text: "Karena PD-nya naik lima kali lipat — dari 0,18 persen ke 0,9 persen", why: "Itu benar, tetapi bukan alasan utamanya. Alasan utamanya adalah perubahan kategori." },
            { text: "Karena melewati cliff investment grade — dana bermandat investment grade TERPAKSA menjual, dan bobot ATMR bank melonjak", why: "Tepat: perubahan kategori memicu penjualan paksa dan modal bank dua kali lipat. Itulah cliff.", correct: true },
            { text: "Karena perusahaannya langsung gagal bayar", why: "Salah: downgrade bukan default. MajuBersama tidak gagal bayar satu rupiah pun — yang berubah adalah opini tentang masa depannya." },
            { text: "Karena rating tidak bisa naik kembali setelah turun", why: "Salah: rating bisa naik kembali bila fundamental membaik. Downgrade bukan vonis permanen." },
          ],
        },
        {
          q: "Apa beda through-the-cycle (TTC) dan point-in-time (PIT)?",
          options: [
            { text: "TTC menilai risiko hari ini; PIT menilai risiko melalui siklus", why: "Salah: terbalik. TTC menilai MELALUI siklus (stabil, lambat); PIT menilai HARI INI (cepat, bergejolak)." },
            { text: "TTC menilai kemampuan membayar melalui siklus — stabil tetapi terlambat; PIT menilai risiko hari ini — cepat tetapi bergejolak", why: "Tepat: agensi memakai TTC, bank memakai PIT untuk pricing dan pencadangan. Keduanya benar untuk pertanyaan berbeda.", correct: true },
            { text: "TTC hanya untuk perusahaan besar; PIT hanya untuk ritel", why: "Salah: pembedanya adalah HORIZON penilaian, bukan ukuran debitur." },
            { text: "Tidak ada beda — keduanya istilah yang sama", why: "Salah: keduanya adalah filosofi yang berlawanan — dan perbedaan itulah yang menjelaskan kenapa rating bergerak lambat sementara spread bergerak cepat." },
          ],
        },
        {
          q: "Outlook berubah menjadi negatif, tetapi rating belum turun. Apa yang harus dilakukan investor?",
          options: [
            { text: "Tidak ada — rating belum berubah berarti tidak ada yang terjadi", why: "Salah: outlook negatif adalah sinyal dini 6–24 bulan. Pasar bergerak saat outlook berubah, bukan saat rating turun." },
            { text: "Periksa spread dan fundamental — outlook negatif + spread melebar adalah sinyal untuk bertindak sebelum downgrade", why: "Tepat: tiga sinyal independen (outlook, spread, leverage) lebih berharga dari menunggu downgrade.", correct: true },
            { text: "Beli lebih banyak — outlook negatif berarti harga akan naik", why: "Salah: outlook negatif berarti risiko naik — harga obligasi cenderung TURUN, bukan naik." },
            { text: "Jual semua obligasi perusahaan itu seketika tanpa analisis", why: "Salah: outlook negatif adalah sinyal untuk MEMERIKSA, bukan perintah jual otomatis. Analisis dulu, lalu putuskan." },
          ],
        },
        {
          q: "Apa masalah model issuer-pays — dan bagaimana investor menyikapinya?",
          options: [
            { text: "Tidak ada masalah — agensi selalu independen", why: "Salah: emiten membayar agensi yang menilainya — insentif untuk tidak terlalu keras itu nyata (rating shopping). Firewall membantu, tetapi tidak menghilangkan insentif." },
            { text: "Emiten membayar agensi — insentif untuk tidak terlalu keras; investor memakai rating sebagai satu input bersama spread dan analisis sendiri", why: "Tepat: rating dipakai dengan diskon yang sesuai — dilengkapi sinyal pasar yang bergerak cepat.", correct: true },
            { text: "Investor harus mengabaikan rating seluruhnya", why: "Salah: membuang rating berarti membuang informasi komite dan puluhan tahun data default. Yang benar adalah memakai dengan diskon, bukan membuang." },
            { text: "Masalahnya hanya pada agensi kecil — tiga besar tidak terpengaruh", why: "Salah: tiga besar justru yang paling terpengaruh — merekalah yang bersaing memperebutkan klien emiten besar." },
          ],
        },
      ],
    },
  ],
};
