import type { V2Lesson } from "../lib/types";

export const a313: V2Lesson = {
  slug: "a313-kausal",
  track: "Statistika",
  module: "Modeling & ML Dasar",
  title: "A3.13 Inferensi Kausal: Dari Berhubungan ke Menyebabkan",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-program-sehat",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Program yang dituduh menyebabkan default",
      prose: [
        "Bank meluncurkan Program Sehat Finansial — edukasi plus restrukturisasi untuk nasabah berisiko. Setahun kemudian: nasabah peserta program default 18 persen, non-peserta 9 persen. Kesimpulan manajemen: program menyebabkan default naik 2 kali lipat — hentikan.",
        "Analis yang teliti melihat siapa yang ikut: program ditawarkan ke nasabah yang sudah menunggak 60+ hari — kelompok yang memang berisiko tinggi dari sananya. Membandingkan peserta vs non-peserta = membandingkan apel busuk vs apel segar, lalu menyalahkan programnya. Setelah dibandingkan dengan kelompok kontrol yang setara risikonya, program ternyata menurunkan default 3 poin.",
        "Angka 18 vs 9 persen itu benar secara matematis — yang salah adalah lompatan ke menyebabkan. Inilah selection bias: perbedaan yang diamati mencerminkan siapa yang dipilih, bukan efek perlakuan.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan menghentikan program efektif (atau melanjutkan program merugikan) berdasarkan perbandingan naif adalah risiko keputusan bisnis — angka benar, kesimpulan salah.",
      },
      reference: "Selalu tanya dulu: siapa yang masuk kelompok treatment, dan kenapa?",
    },
    {
      id: "dekomposisi-bias",
      eyebrow: "Langkah 2 · Dekomposisi",
      title: "Selisih yang diamati = efek + bias seleksi",
      prose: [
        "Sejak awal track kita mengulang mantra: koefisien regresi = asosiasi terkontrol, bukan kausalitas. Lesson ini menjawab bagaimana caranya tahu sebab-akibat. Kerangka potential outcomes: tiap unit punya Y(1) (hasil jika diperlakukan) dan Y(0) (hasil jika tidak) — tapi kita hanya mengamati satu di antaranya.",
        "Efek kausal rata-rata (ATE) = rata-rata dari Y(1) - Y(0). Yang kita amati adalah E[Y|D=1] - E[Y|D=0], dan keduanya tidak sama. Selisih yang diamati = ATE + selection bias: perbedaan bawaan antara kelompok yang memilih treatment vs tidak.",
        "Di cerita tadi: 18 - 9 = 9 poin selisih teramati, padahal efek sebenarnya -3 poin — artinya selection bias-nya +12 poin, mendominasi dan membalik tanda. Tanpa counterfactual yang kredibel, angka tidak mengatakan apa-apa tentang efek.",
      ],
      formula: String.raw`E[Y \mid D=1] - E[Y \mid D=0] = \underbrace{E[Y(1)-Y(0)]}_{\text{ATE}} + \text{selection bias}`,
      formulaNote: "D=1 ikut program, Y(1)/Y(0) hasil potensial dengan/tanpa program.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira mengontrol banyak variabel di regresi menyelesaikan selection bias. Variabel tak teramati (motivasi, karakter) tidak bisa dikontrol — butuh desain, bukan regresi lebih panjang.",
      },
      reference: "Omitted variable bias + Simpson's paradox = alasan regresi observasional tidak cukup.",
    },
    {
      id: "rct-itt-late",
      eyebrow: "Langkah 3 · RCT",
      title: "Randomisasi: emas kausal",
      prose: [
        "Randomisasi memutus hubungan D dengan potential outcomes (Y(0), Y(1)): kelompok treatment dan kontrol setara secara ekspektasi — termasuk karakteristik tak teramati. Selection bias = 0, yang tersisa hanya ATE. Inilah satu-satunya metode yang tidak butuh asumsi tidak ada confounder tak teramati.",
        "Di dunia nyata ada non-compliance: 12 persen kelompok reminder tidak menerima SMS (nomor tidak valid) tapi tetap dihitung sebagai treatment. Estimasi 0,9 poin itu adalah ITT (intent-to-treat): efek ditawari program, bukan efek menerima. ITT-lah yang policy-relevant — di dunia nyata nomor invalid selalu ada.",
        "Efek pada yang benar-benar menerima (LATE) = ITT dibagi tingkat compliance: 0,9 / 0,88 = 1,02 poin. Hitung sendiri di bawah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `late` = ITT dibagi compliance" },
        { id: "t2", text: "Cetak `late` dengan `print`" },
      ],
      expected: "late=1.02",
      note: {
        title: "Sering salah",
        body: "Membuang non-complier dari analisis (analisis per-protocol). Itu merusak randomisasi dan mengembalikan selection bias — yang patuh vs tidak patuh beda karakteristiknya.",
      },
      hints: [
        "Compliance = 1 - 0,12 = 0,88.",
        "LATE = itt / compliance.",
        "late = 0.9 / 0.88",
      ],
      code: {
        starter: `# Hasil RCT SMS reminder: ITT 0,9 poin, 12% nomor tidak valid\nitt = 0.9          # poin, intent-to-treat\nnoncomp = 0.12     # tidak menerima SMS\n\n# TULIS KODEMU: LATE = efek pada yang benar-benar menerima\ncompliance = \nlate = \n\nprint(f"late={late:.2f}")`,
        lockLines: 3,
        solution: `# Hasil RCT SMS reminder: ITT 0,9 poin, 12% nomor tidak valid\nitt = 0.9          # poin, intent-to-treat\nnoncomp = 0.12     # tidak menerima SMS\n\n# TULIS KODEMU: LATE = efek pada yang benar-benar menerima\ncompliance = 1 - noncomp\nlate = itt / compliance\n\nprint(f"late={late:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "late", value: 1.0227, tol: 0.01, label: "`late` sekitar 1.02", msg: "0,9 / 0,88 = 1,02. Cek compliance = 1 - 0,12." },
          { kind: "stdout_matches", task: "t2", pattern: "late=1\\.02", label: "`print` menampilkan LATE", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ITT = efek ditawari (policy-relevant). LATE = ITT / compliance.",
    },
    {
      id: "lab-did",
      eyebrow: "Langkah 4 · Lab: DiD",
      title: "Difference-in-Differences dari nol",
      prose: [
        "Program restrukturisasi di Cabang A (treatment), Cabang B kontrol. Efek benar: -2,5 poin. Ada tren waktu umum (ekonomi memburuk). Perbandingan naif sesudah-saja tercemar seleksi (baseline cabang beda); perbandingan sebelum-sesudah di A tercemar tren waktu.",
        "DiD = (perubahan treatment) - (perubahan kontrol). Asumsi kunci: parallel trends — tanpa program, A akan bergerak seperti B. Asumsi ini tidak bisa dibuktikan untuk periode pasca, tapi bisa diuji di pra-periode: plot tren kedua kelompok sebelum program, harus sejajar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `naif` = selisih sesudah-saja (A1 - B1)" },
        { id: "t2", text: "Hitung `did` = (A1-A0) - (B1-B0)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "naif=-2.6 did=-3.7",
      note: {
        title: "Sering salah",
        body: "Percaya DiD tanpa mengecek parallel trends pra-program. Tren pra yang tidak sejajar adalah red flag keras — cari kontrol lain atau ganti metode.",
      },
      hints: [
        "Naif = a1 - b1 (sesudah saja, tanpa penyesuaian).",
        "DiD mengurangkan perubahan kontrol dari perubahan treatment.",
        "did = (a1 - a0) - (b1 - b0)",
      ],
      code: {
        starter: `# Default rate (%), Cabang A = treatment, B = kontrol\n# A: 9.5 -> 7.0 ; B: 8.4 -> 9.6 (efek benar -2.5, ada tren waktu)\na0, a1 = 9.5, 7.0\nb0, b1 = 8.4, 9.6\n\n# TULIS KODEMU\nnaif = \ndid = \n\nprint(f"naif={naif:+.1f} did={did:+.1f}")`,
        lockLines: 4,
        solution: `# Default rate (%), Cabang A = treatment, B = kontrol\n# A: 9.5 -> 7.0 ; B: 8.4 -> 9.6 (efek benar -2.5, ada tren waktu)\na0, a1 = 9.5, 7.0\nb0, b1 = 8.4, 9.6\n\n# TULIS KODEMU\nnaif = a1 - b1\ndid = (a1 - a0) - (b1 - b0)\n\nprint(f"naif={naif:+.1f} did={did:+.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "naif", value: -2.6, tol: 0.05, label: "`naif` sekitar -2.6", msg: "7,0 - 9,6 = -2,6. Tercemar baseline beda." },
          { kind: "equal", task: "t2", name: "did", value: -3.7, tol: 0.05, label: "`did` sekitar -3.7", msg: "(-2,5) - (+1,2) = -3,7. Nilai benar -2,5; selisihnya noise sampling." },
          { kind: "stdout_matches", task: "t3", pattern: "naif=-2\\.6\\s+did=-3\\.7", label: "`print` menampilkan kedua estimasi", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "DiD = perubahan treatment dikurangi perubahan kontrol. Uji parallel trends di pra-periode.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Langkah 5 · Kuis singkat",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua pertanyaan dari langkah 1 sampai 4. Jawab, baca alasannya, lalu lanjut.",
      ],
      tasks: [],
      quiz: [
        {
          q: "DiD mensyaratkan parallel trends. Cara memverifikasinya?",
          options: [
            { text: "Tidak bisa — asumsi buta", why: "Salah. Pra-periode bisa diuji." },
            { text: "Plot tren kedua kelompok di periode pra-program: harus bergerak sejajar", why: "Benar. Tren pra yang tidak sejajar = red flag keras.", correct: true },
            { text: "Lihat R kuadrat model", why: "Salah. R kuadrat tidak menguji asumsi tren." },
            { text: "Tanya manajemen", why: "Salah. Verifikasi memakai data, bukan opini." },
          ],
        },
        {
          q: "RDD: kredit disetujui jika skor >= 650. Efek yang diidentifikasi berlaku untuk?",
          options: [
            { text: "Semua nasabah", why: "Salah. RDD tidak mengidentifikasi efek populasi." },
            { text: "Hanya di sekitar ambang 650 (LATE lokal) — tidak bisa digeneralisasi ke skor 400 atau 800", why: "Benar. Nasabah 651 vs 649 nyaris identik; jangan ekstrapolasi.", correct: true },
            { text: "Hanya yang ditolak", why: "Salah. Efek diidentifikasi di kedua sisi ambang." },
            { text: "Seluruh populasi", why: "Salah. Itu justru yang tidak bisa diklaim RDD." },
          ],
        },
      ],
      reference: "Parallel trends diuji di pra-periode. RDD = efek lokal di cutoff.",
    },
    {
      id: "rdd-iv-collider",
      eyebrow: "Langkah 6 · RDD, IV, collider",
      title: "Tiga alat lain, tiga jebakan lain",
      prose: [
        "RDD (regression discontinuity): saat treatment ditentukan ambang tajam (skor >= 650 disetujui), nasabah 651 vs 649 nyaris identik — perbandingan di sekitar cutoff seperti eksperimen lokal. Efeknya LATE lokal: jangan ekstrapolasi ke skor 400 atau 800.",
        "IV (instrumental variable): instrumen Z harus relevan (mempengaruhi D) dan memenuhi exclusion (hanya mempengaruhi Y via D). Exclusion tidak bisa diuji dari data — fondasinya argumen domain. Instrumen meragukan = klaim kausal meragukan; skeptisisme terhadap IV selalu sehat.",
        "Collider: jangan kontrol variabel yang dipengaruhi treatment DAN outcome. Meneliti efek jam belajar ke IPK sambil mengontrol nilai UTS (dipengaruhi jam belajar dan kecerdasan) membuka jalur bias — Berkson's paradox. Mengontrol collider menciptakan korelasi palsu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengontrol semua yang tersedia. Kontrol yang benar = confounder (mempengaruhi treatment dan outcome). Mengontrol mediator menghilangkan efek yang ingin diukur; mengontrol collider menciptakan bias baru.",
      },
      reference: "RDD: lokal di cutoff. IV: exclusion tak-teruji. Collider: jangan dikontrol.",
    },
    {
      id: "mini-case-reminder",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Apakah reminder menurunkan default?",
      prose: [
        "Bank mengirim SMS reminder H-3 jatuh tempo ke 50.000 nasabah (dipilih acak dari 100.000; 50.000 sisanya kontrol). Hasil 6 bulan: default kelompok reminder 7,2 persen, kontrol 8,1 persen. Tim produk merayakan: reminder menurunkan default 0,9 poin. Audit menemukan: 12 persen kelompok reminder tidak menerima SMS (nomor tidak valid) tapi tetap dihitung sebagai treatment; nasabah yang tahu dirinya diobservasi (ada survei kepuasan) perilakunya berubah; efek di bulan 1-2 besar, bulan 5-6 hilang.",
        "Estimasi 0,9 poin itu ITT: efek ditawari reminder. Efek pada yang benar-benar menerima (LATE) = 0,9 / 0,88 = 1,02 poin. ITT adalah estimasi yang policy-relevant — inilah efek program di dunia nyata di mana nomor invalid selalu ada.",
        "Ancaman validitas: efek Hawthorne (perilaku berubah karena diobservasi) mengancam external validity — efek mungkin menyusut saat survei dihentikan. Efek memudar di bulan 5-6 adalah fatigue, bukan alasan menolak: hitung steady-state effect, bukan efek bulan madu. Rekomendasi: lanjutkan dengan monitoring — 0,9 poin x 50.000 nasabah x LGD rata-rata jauh melebihi biaya SMS — tapi ukur ulang tanpa survei dan pantau fatigue.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Efek bulan madu yang dihitung sebagai efek permanen membuat business case palsu. Keputusan skala program harus memakai steady-state effect, bukan puncak awal.",
      },
      reference: "ITT untuk keputusan program. Hawthorne -> ukur ulang tanpa observasi. Fatigue -> pakai steady-state.",
    },
    {
      id: "pendalaman-dag-backdoor",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "DAG, kriteria backdoor & do-calculus konseptual",
      prose: [
        "DAG (directed acyclic graph) adalah cara menggambar asumsi kausalmu sebelum satu baris regresi ditulis. Setiap panah = klaim sebab-akibat. Tiga peran variabel: confounder — panah ke treatment DAN outcome (tutup jalurnya dengan mengontrol); mediator — di jalur treatment → outcome (JANGAN dikontrol bila ingin efek total — mengontrolnya menghapus efek yang ingin diukur); collider — dua panah masuk (JANGAN dikontrol — membukanya menciptakan bias, Berkson's paradox). DAG memaksa asumsi yang biasanya implisit menjadi eksplisit — dan asumsi yang eksplisit bisa diserang, diuji, didiskusikan.",
        "Kriteria backdoor (Pearl) memberi aturan formal kapan efek kausal teridentifikasi dari observasi: kontrol himpunan Z yang (a) memblokir SEMUA jalur backdoor dari D ke Y (jalur yang masuk ke D lewat panah belakang), dan (b) tidak mengandung turunan dari D. Rumus penyesuaiannya: P(y|do(x)) = jumlah atas z dari P(y|x,z) x P(z) — rata-ratakan efek kondisional atas distribusi confounder. Inilah fondasi matematis dari mengontrol confounder yang benar.",
        "Operator do adalah jantung do-calculus: P(y|do(x)) berarti distribusi Y bila kita MENGINTERVENSI X = x — secara grafis, memutus semua panah yang masuk ke X. Beda dengan P(y|x) biasa yang hanya observasi dan tercemar selection bias. Tiga aturan do-calculus memberi tahu kapan distribusi intervensi bisa dihitung dari data observasional murni. Pesan praktisnya brutal tapi jujur: bila DAG-mu membutuhkan asumsi yang tidak bisa dipertahankan (mis. tidak ada confounder tak terukur padahal jelas ada), tidak ada rumus yang menyelamatkan — ganti desain (RCT, IV, RDD), bukan ganti rumus.",
        "Satu peringatan untuk IV: weak instruments. Instrumen dengan relevansi lemah (F-statistik tahap pertama < 10, aturan Stock-Yogo) menghasilkan estimasi yang bias menuju OLS dengan standard error meledak — lebih buruk daripada tidak memakai IV sama sekali, karena memberi ilusi identifikasi. Selalu laporkan F-stat tahap pertama; di bawah 10, jangan klaim kausal dari IV itu. Skeptisisme terhadap IV bukan sinisme — ia disiplin.",
      ],
      formula: String.raw`P(y \mid do(x)) = \sum_z P(y \mid x, z) \, P(z)`,
      formulaNote: "Rumus penyesuaian backdoor: P(y|do(x)) = efek kausal intervensi (bukan observasi); z = himpunan confounder yang memblokir semua jalur backdoor; jumlahkan efek kondisional atas distribusi z. Berbeda dari P(y|x) biasa yang tercemar selection bias.",
      tasks: [],
      reference: "Gambar DAG dulu. Kontrol = confounder. Jangan sentuh mediator/collider. do ≠ observasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kausalitas adalah soal desain, bukan soal regresi",
        body: "Tidak ada teknik statistik yang mengubah data observasional menjadi eksperimen — yang mengubah adalah desain: randomisasi, ambang, atau waktu. Tiga heuristik. Pertama: sebelum bertanya metodenya apa, tanya apa counterfactual-nya. Bila kamu tidak bisa menjawab dengan jelas (dibandingkan dengan apa?), metodenya tidak akan menolong — kamu belum punya pertanyaan kausal. Kedua: korelasi + mekanisme + desain kredibel = klaim kausal yang bisa dipertahankan; korelasi saja = hipotesis yang belum diuji. Ketiga: tulis asumsi identifikasimu secara eksplisit — parallel trends, exclusion, tidak ada confounder tak terukur — lalu serang asumsimu sendiri dengan placebo test (mis. DiD di periode pra-program harus nol). Aturan praktis: efek yang hanya muncul di satu spesifikasi = efek yang tidak ada. Hasil kausal yang kokoh bertahan di berbagai spesifikasi yang masuk akal; yang rapuh runtuh saat kontrol ditambah satu.",
      },
      summary: [
        "Selisih teramati = ATE + selection bias. Angka benar tidak menjamin kesimpulan kausal benar.",
        "Randomisasi memutus hubungan treatment dengan potential outcomes — satu-satunya metode tanpa asumsi confounder tak teramati.",
        "ITT = efek ditawari (policy-relevant); LATE = ITT / compliance. Jangan buang non-complier.",
        "DiD butuh parallel trends (uji di pra-periode). RDD = efek lokal di cutoff. IV bertumpu pada exclusion yang tak-teruji.",
        "Jangan kontrol collider atau mediator. Kontrol yang benar = confounder.",
      ],
      next: { label: "A3.14 — Explainability", href: "/v2/learn/a314-explainability" },
      quiz: [
        {
          q: "Peserta program default 18%, non-peserta 9%. Klaim program menyebabkan default 2x lipat — masalah?",
          options: [
            { text: "Tidak ada — angka jelas", why: "Salah. Angka benar, lompatan kausalnya yang salah." },
            { text: "Selection bias: peserta dipilih dari yang sudah berisiko. Perbandingan ini mengukur seleksi, bukan efek", why: "Benar. Selisih teramati = ATE + selection bias; di sini bias mendominasi.", correct: true },
            { text: "Sampel kurang besar", why: "Salah. Masalahnya bias, bukan ukuran." },
            { text: "Harus pakai median", why: "Salah. Median dari perbandingan bias tetap bias." },
          ],
        },
        {
          q: "Mengapa randomisasi membuat perbandingan rata-rata = efek kausal?",
          options: [
            { text: "Sampel jadi besar", why: "Salah. Ukuran bukan mekanismenya." },
            { text: "Randomisasi memutus hubungan D dengan potential outcomes sehingga selection bias = 0 — yang tersisa hanya ATE", why: "Benar. Semua karakteristik seimbang secara ekspektasi, termasuk yang tak teramati.", correct: true },
            { text: "Menghilangkan variansi", why: "Salah. Variansi tetap ada; yang hilang biasnya." },
            { text: "Membuat data normal", why: "Salah. Tidak ada hubungan dengan normalitas." },
          ],
        },
        {
          q: "Meneliti efek jam belajar ke IPK dengan mengontrol nilai UTS (dipengaruhi jam belajar dan kecerdasan). Masalah?",
          options: [
            { text: "Tidak ada — kontrol yang bagus", why: "Salah. UTS bukan confounder." },
            { text: "UTS adalah collider: mengontrolnya membuka jalur bias (Berkson's paradox)", why: "Benar. Di antara mahasiswa ber-UTS sama, muncul hubungan palsu antara rajin dan cerdas.", correct: true },
            { text: "Harus kontrol lebih banyak variabel", why: "Salah. Menambah kontrol yang salah memperparah." },
            { text: "UTS mediator — boleh dikontrol", why: "Salah. Mediator pun tidak boleh dikontrol jika ingin efek total." },
          ],
        },
        {
          q: "Instrumen Z untuk D memenuhi relevan tapi exclusion diragukan (Z mungkin mempengaruhi Y langsung). Akibat?",
          options: [
            { text: "Tidak masalah — relevan sudah cukup", why: "Salah. Relevan tanpa exclusion tidak cukup." },
            { text: "Estimasi IV bias — exclusion tidak bisa diuji dari data, harus argumen domain", why: "Benar. Fondasi IV adalah argumen substantif, bukan statistik.", correct: true },
            { text: "Gunakan OLS saja", why: "Salah. OLS punya masalah selection bias sendiri." },
            { text: "Perbesar sampel", why: "Salah. Sampel besar tidak memperbaiki asumsi." },
          ],
        },
        {
          q: "DAG: Z → D, Z → Y, dan D → M → Y. Himpunan kontrol yang benar untuk efek total D → Y?",
          options: [
            { text: "Kontrol Z dan M — semakin banyak semakin baik", why: "Salah. M adalah mediator." },
            { text: "Hanya Z. M adalah mediator di jalur kausal — mengontrolnya menghapus efek yang ingin diukur", why: "Benar. Kriteria backdoor: blokir jalur backdoor (via Z), jangan sentuh turunan D.", correct: true },
            { text: "Hanya M", why: "Salah. M bukan confounder; mengontrolnya justru menghilangkan efek." },
            { text: "Tidak perlu kontrol apapun", why: "Salah. Jalur backdoor via Z tetap terbuka." },
          ],
        },
        {
          q: "Estimasi IV dengan F-statistik tahap pertama = 3. Bagaimana menilainya?",
          options: [
            { text: "Sah — yang penting relevan secara teori", why: "Salah. Relevansi lemah = weak instrument." },
            { text: "Tidak kredibel: weak instrument (F < 10, aturan Stock-Yogo) — estimasi bias ke OLS dengan SE meledak. Jangan klaim kausal", why: "Benar. Selalu laporkan F-stat tahap pertama.", correct: true },
            { text: "Perbesar sampel agar F naik", why: "Salah. F kecil bisa jadi cerminan instrumen yang memang lemah." },
            { text: "Ganti ke OLS saja", why: "Salah. OLS punya selection bias sendiri; solusinya cari instrumen/desain lebih baik." },
          ],
        },
        {
          q: "Apa beda P(y|do(x)) dengan P(y|x) biasa?",
          options: [
            { text: "Tidak ada — notasi berbeda, arti sama", why: "Salah. Bedanya fundamental." },
            { text: "do(x) = intervensi: memutus panah masuk ke X di DAG. P(y|x) observasional tercemar confounding; P(y|do(x)) adalah efek kausal", why: "Benar. Observasi ≠ intervensi bila ada jalur backdoor.", correct: true },
            { text: "do(x) hanya untuk RCT", why: "Salah. do adalah operator teoretis; RCT adalah salah satu cara mengidentifikasinya." },
            { text: "P(y|x) selalu lebih besar", why: "Salah. Tidak ada hubungan ordinal seperti itu." },
          ],
        },
      ],
    },
  ],
};
