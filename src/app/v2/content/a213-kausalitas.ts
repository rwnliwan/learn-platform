import type { V2Lesson } from "../lib/types";

export const a213: V2Lesson = {
  slug: "a213-kausalitas",
  track: "Statistika",
  module: "Inferensial",
  title: "A2.13 Korelasi Bukan Sebab-Akibat: Berpikir Kausal",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-eskrim",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Es krim dan tenggelam",
      prose: [
        "Data menunjukkan korelasi kuat: penjualan es krim naik → kasus tenggelam naik (r = 0,9). Seorang politisi mengusulkan pelarangan es krim di pantai untuk menyelamatkan nyawa. Terdengar logis dari angkanya. Tentu saja itu absurd: variabel ketiganya musim panas — panas membuat orang beli es krim dan berenang. Larangan es krim tidak menyelamatkan satu pun perenang.",
        "Bentuk yang sama bersembunyi di keputusan bisnis bernilai miliaran: nasabah yang ikut webinar lebih jarang default → perbanyak webinar. Padahal yang ikut webinar memang nasabah yang lebih melek finansial. Bedanya dengan es krim: di bisnis, Z-nya tidak selalu semusim panas yang jelas terlihat.",
        "Lesson bersama (shared): materi ini dipakai juga di track Credit Risk, Health Data Science, dan Marketing Analytics — pelajari sekali di sini, dan tautkan dari sana, jangan diduplikasi.",
      ],
      tasks: [
        { id: "t1", text: "Catat `r_mentah` = 0,9 (korelasi es krim–tenggelam)" },
        { id: "t2", text: "Catat `r_kontrol` = 0,0 (korelasi setelah musim panas dikontrol)" },
      ],
      expected: "r_mentah=0.9  r_kontrol=0.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan Rp12 miliar/tahun (perluasan program) dari korelasi mentah adalah risiko model klasik. Selalu tanya: variabel ketiga apa yang menggerakkan keduanya — sebelum budget dikeluarkan.",
      },
      hints: [
        "r_mentah = 0,9 dari cerita.",
        "Setelah Z dikontrol, korelasi lenyap.",
        "r_kontrol = 0.0",
      ],
      code: {
        starter: `# korelasi es krim vs tenggelam\n\n# TULIS KODEMU\nr_mentah = \nr_kontrol = \n\nprint(f"r_mentah={r_mentah}  r_kontrol={r_kontrol}")`,
        lockLines: 1,
        solution: `# korelasi es krim vs tenggelam\n\n# TULIS KODEMU\nr_mentah = 0.9\nr_kontrol = 0.0  # setelah musim panas dikontrol\n\nprint(f"r_mentah={r_mentah}  r_kontrol={r_kontrol}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r_mentah", value: 0.9, tol: 1e-9, label: "`r_mentah` seharusnya 0.9", msg: "Korelasi mentahnya memang 0,9 — nyata tapi bukan kausal." },
          { kind: "equal", task: "t2", name: "r_kontrol", value: 0.0, tol: 1e-9, label: "`r_kontrol` seharusnya 0.0", msg: "Setelah Z dikontrol, korelasi lenyap — bukti confounder." },
          { kind: "stdout_matches", task: "t2", pattern: "r_mentah=0\\.9\\s+r_kontrol=0(\\.0)?", label: "`print` menampilkan keduanya", msg: "Format: r_mentah=...  r_kontrol=... ." },
        ],
      },
      reference: "Uji intervensi: jika X kupaksa berubah, Y ikut? Larang es krim → tenggelam tetap.",
    },
    {
      id: "empat-penjelasan",
      eyebrow: "Langkah 2 · Korelasi vs kausasi",
      title: "Empat penjelasan untuk satu korelasi",
      prose: [
        "Kausasi berarti mengintervensi X mengubah Y. Setiap korelasi X–Y punya empat penjelasan kandidat. X → Y (kausasi langsung): es krim → tenggelam? Salah. Y → X (kausalitas terbalik): kota dengan banyak polisi punya kriminalitas tinggi — bukan polisi menyebabkan kriminalitas, tapi kriminalitas menyebabkan penempatan polisi.",
        "Z → X dan Z → Y (confounder): musim panas → keduanya; webinar & default, keduanya ← literasi finansial. Kebetulan: korelasi spurious — konsumsi keju vs kematian terlilit sprei (r = 0,95, keduanya naik seiring waktu). Korelasi adalah pengamat yang mencatat mereka selalu bersama; kausasi adalah eksperimentalis yang bertanya kalau yang satu kuubah, yang lain ikut?",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Data observasional yang besar bisa membuktikan kausasi. Salah: pengamat tidak bisa menjawab pertanyaan eksperimentalis — tidak peduli seberapa banyak data observasionalnya. Jika pertanyaan intervensinya tidak masuk akal (paksa orang ikut webinar?), klaim kausalnya pun goyah.",
      },
      reference: "Korelasi = hipotesis, bukan kesimpulan.",
    },
    {
      id: "confounder-dag",
      eyebrow: "Langkah 3 · Confounder dan DAG",
      title: "Gambar panahnya dulu, baru putuskan yang dikontrol",
      prose: [
        "Confounder adalah variabel Z yang memengaruhi X maupun Y — menciptakan korelasi palsu. DAG (Directed Acyclic Graph): usia → ikut program dan usia → default. Tanpa mengontrol usia, perbandingan ikut vs tidak ikut tercemar: peserta lebih muda, dan yang muda memang lebih jarang default. Solusi: bandingkan dalam kelompok usia yang sama — tutup jalur Z.",
        "Tiga respons: (1) ukur & kendalikan (stratifikasi/regresi/matching) — butuh Z teramati; (2) randomisasi — memutus panah Z→X secara desain (keajaiban RCT: confounder teramati maupun tak teramati jadi seimbang!); (3) kuasi-eksperimen (DiD, IV, RDD) — saat randomisasi mustahil.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kontrol semua variabel dalam regresi = kausal. Salah: mengontrol sembarang variabel bisa menambah bias! Mengontrol mediator (X→M→Y) menghapus efek yang ingin diukur; mengontrol collider menciptakan korelasi palsu. DAG dulu, baru putuskan apa yang dikontrol — bukan sebaliknya.",
      },
      reference: "Kontrol confounder; JANGAN kontrol mediator/collider.",
    },
    {
      id: "simpson",
      eyebrow: "Langkah 4 · Simpson's paradox",
      title: "Agregat berbohong, segmen berkata jujur",
      prose: [
        "Paradoks Simpson: tren di level agregat berbalik saat data dipecah per segmen. Kampanye A menang 62% vs 55% secara agregat — unggul 7 poin. Tapi B menang di segmen muda (85% vs 80%) DAN segmen tua (40% vs 30%).",
        "Mekanisme paradox: A menghabiskan 83% budget di segmen tua yang sulit untuk siapa pun, sementara B fokus di segmen muda yang mudah. Agregat menghukum A atas komposisi, bukan kualitas. Keputusan benar: B lebih baik — dan A perlu diaudit alokasi segmennya. Pertahanan: selalu cek hasil per segmen besar sebelum merayakan kemenangan agregat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `agregat` = selisih A − B secara agregat" },
        { id: "t2", text: "Hitung `muda` = selisih A − B di segmen muda" },
        { id: "t3", text: "Hitung `tua` = selisih A − B di segmen tua" },
      ],
      expected: "agregat=7  muda=-5  tua=-10",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Simpson's paradox adalah confounder yang terlihat: segmen memengaruhi alokasi (X) dan hasil (Y). Dalam laporan risiko, agregat tanpa pecahan segmen bisa membalik kesimpulan — selalu stratifikasi sebelum memutuskan.",
      },
      hints: [
        "Agregat: A 62, B 55.",
        "Muda: A 80, B 85. Tua: A 30, B 40.",
        "tua = 30 - 40",
      ],
      code: {
        starter: `# konversi (%) kampanye A vs B\n\n# TULIS KODEMU\nagregat = \nmuda = \ntua = \n\nprint(f"agregat={agregat}  muda={muda}  tua={tua}")`,
        lockLines: 1,
        solution: `# konversi (%) kampanye A vs B\n\n# TULIS KODEMU\nagregat = 62 - 55\nmuda = 80 - 85\ntua = 30 - 40\n\nprint(f"agregat={agregat}  muda={muda}  tua={tua}")`,
        checks: [
          { kind: "equal", task: "t1", name: "agregat", value: 7, tol: 1e-9, label: "`agregat` seharusnya 7", msg: "62 − 55 = +7 untuk A." },
          { kind: "equal", task: "t2", name: "muda", value: -5, tol: 1e-9, label: "`muda` seharusnya -5", msg: "80 − 85 = −5: A kalah di segmen muda." },
          { kind: "equal", task: "t3", name: "tua", value: -10, tol: 1e-9, label: "`tua` seharusnya -10", msg: "30 − 40 = −10: A kalah di segmen tua." },
          { kind: "stdout_matches", task: "t3", pattern: "agregat=7\\s+muda=-5\\s+tua=-10", label: "`print` menampilkan ketiganya", msg: "Format: agregat=...  muda=...  tua=... ." },
        ],
      },
      reference: "Agregat tanpa kontrol confounder = kebohongan. Cek per segmen.",
    },
    {
      id: "did",
      eyebrow: "Langkah 5 · Difference-in-differences",
      title: "Kurangi tren umum, sisakan efek kausal",
      prose: [
        "Tangga bukti: RCT (emas) — confounder teramati & tak teramati seimbang; kuasi-eksperimen DiD/RDD/IV (perak) — kausal dengan asumsi yang bisa diperdebatkan; observasional + kontrol (perunggu) — hanya sebaik Z yang terukur; korelasi mentah — bukan bukti kausal.",
        "DiD: kota A (kampanye) konversi 5% → 7%; kota B (kontrol) 5% → 6%. Estimasi naif pre-post: +2 poin. Tapi B juga naik 1 poin (tren umum!). DiD = (7−5) − (6−5) = +1 poin — efek kausal dengan asumsi parallel trends. Asumsi nyawa DiD: tanpa perlakuan, kedua grup bergerak paralel — cek dengan data pra-periode. Jika A memang trennya lebih curam, estimasi bias.",
      ],
      formula: String.raw`\text{DiD} = (Y_{A,1} - Y_{A,0}) - (Y_{B,1} - Y_{B,0})`,
      formulaNote: "DiD = estimasi difference-in-differences; Y_{A,1} dan Y_{A,0} = outcome grup perlakuan sesudah dan sebelum; Y_{B,1} dan Y_{B,0} = outcome grup kontrol sesudah dan sebelum; selisih kedua perubahan = efek kausal bila asumsi tren paralel berlaku.",
      tasks: [
        { id: "t1", text: "Hitung `naif` = perubahan kota A saja" },
        { id: "t2", text: "Hitung `did` = perubahan A − perubahan B" },
      ],
      expected: "naif=2  did=1",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Pre-post di grup perlakuan cukup untuk klaim kausal. Salah: tanpa grup kontrol, tren waktu umum ikut terhitung sebagai efek. DiD mengurangkan tren umum — tapi hanya sah jika parallel trends terpenuhi. Plot pra-perlakuan adalah pemeriksaan wajib, bukan opsional.",
      },
      hints: [
        "naif = 7 − 5.",
        "did = (7−5) − (6−5).",
        "did = (7-5)-(6-5)",
      ],
      code: {
        starter: `# konversi (%) sebelum -> sesudah\na_sebelum, a_sesudah = 5, 7  # kota kampanye\nb_sebelum, b_sesudah = 5, 6  # kota kontrol\n\n# TULIS KODEMU\nnaif = \ndid = \n\nprint(f"naif={naif}  did={did}")`,
        lockLines: 3,
        solution: `# konversi (%) sebelum -> sesudah\na_sebelum, a_sesudah = 5, 7  # kota kampanye\nb_sebelum, b_sesudah = 5, 6  # kota kontrol\n\n# TULIS KODEMU\nnaif = a_sesudah - a_sebelum\ndid = (a_sesudah-a_sebelum) - (b_sesudah-b_sebelum)\n\nprint(f"naif={naif}  did={did}")`,
        checks: [
          { kind: "equal", task: "t1", name: "naif", value: 2, tol: 1e-9, label: "`naif` seharusnya 2", msg: "7 − 5 = 2 poin — tapi mencakup tren umum." },
          { kind: "equal", task: "t2", name: "did", value: 1, tol: 1e-9, label: "`did` seharusnya 1", msg: "(7−5) − (6−5) = 1 poin efek kausal." },
          { kind: "stdout_matches", task: "t2", pattern: "naif=2\\s+did=1", label: "`print` menampilkan keduanya", msg: "Format: naif=...  did=... ." },
        ],
      },
      reference: "DiD = kurangi tren umum. Asumsi parallel trends wajib dicek.",
    },
    {
      id: "senjata-lain",
      eyebrow: "Langkah 6 · IV, RDD, matching",
      title: "Mencari randomisasi alami di dunia",
      prose: [
        "IV (Instrumental Variable): cari Z yang memengaruhi X tapi hanya memengaruhi Y melalui X. Contoh: lotre wajib militer sebagai instrumen pengaruh dinas militer terhadap pendapatan. Syarat exclusion tidak bisa diuji — harus diargumenkan. RDD: perlakuan berbasis ambang skor (beasiswa untuk nilai ≥ 80). Di sekitar ambang, yang 79 vs 81 hampir identik kecuali perlakuannya — randomisasi lokal! Lompatan hasil di ambang = efek kausal (lokal di sekitar ambang).",
        "Matching/Propensity Score: carikan tiap individu perlakuan kembaran kontrol dengan karakteristik mirip. Kelemahan fundamental: hanya menyeimbangkan Z yang teramati. Peta keputusan: bisa randomisasi → RCT; ada grup kontrol + sebelum/sesudah → DiD (cek parallel trends); perlakuan berbasis ambang → RDD; hanya observasional → kontrol + DAG; hanya korelasi → jangan klaim kausal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Semua metode kuasi-eksperimen mencari randomisasi alami — variasi dunia yang seolah mengacak perlakuan (ambang aturan, lotre, peluncuran bertahap). Keterampilannya bukan rumusnya, melainkan matanya: melihat peluang eksperimen alami dalam kebijakan dan proses bisnis.",
      },
      reference: "Sebutkan asumsinya: dengan asumsi tidak ada confounder tak teramati…",
    },
    {
      id: "minicase-pelatihan",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Apakah program pelatihan menurunkan default?",
      prose: [
        "DanaKita menjalankan program literasi keuangan (sukarela) di 2024. Peserta default 4%; non-peserta 9%. Tim CSR mengklaim program menurunkan default 5 poin — perluas ke semua nasabah! Biaya perluasan: Rp12 miliar/tahun. Data tambahan: peserta rata-rata 28 tahun, skor kredit awal 720; non-peserta 45 tahun, skor awal 640. Program hanya dibuka di 10 dari 30 kota.",
        "(a) Confounder: usia (muda → ikut & melek digital), skor kredit awal (720 vs 640 — peserta memang lebih sehat sebelum program!), kota (hanya kota besar). (b) Klaim 5 poin tidak kredibel: self-selection — yang ikut sudah lebih sehat finansialnya. 5 poin mencampur efek program + perbedaan bawaan. (c) Opsi mahal (emas): RCT — tawarkan ke 2.000 nasabah acak vs 2.000 kontrol. Opsi murah (perak): DiD — 10 kota program vs 20 kota kontrol, cek parallel trends 2022–2023 dulu. Jangan perluas Rp12 M/tahun berdasarkan 4% vs 9% mentah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `klaim` = selisih default non-peserta − peserta" },
        { id: "t2", text: "Hitung `selisih_skor` = skor awal peserta − non-peserta" },
      ],
      expected: "klaim=5  selisih_skor=80",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Itu keputusan Rp12 miliar dari korelasi. Selisih skor awal 80 poin menunjukkan perbedaan bawaan yang besar — klaim 5 poin kemungkinan besar mayoritasnya perbedaan bawaan, bukan efek program. Evaluasi kausal dulu, baru perluas.",
      },
      hints: [
        "klaim = 9 − 4.",
        "selisih_skor = 720 − 640.",
        "Bandingkan: klaim 5 poin vs gap bawaan 80 poin skor.",
      ],
      code: {
        starter: `# default (%), skor kredit awal\npeserta, non = 4, 9\nskor_peserta, skor_non = 720, 640\n\n# TULIS KODEMU\nklaim = \nselisih_skor = \n\nprint(f"klaim={klaim}  selisih_skor={selisih_skor}")`,
        lockLines: 3,
        solution: `# default (%), skor kredit awal\npeserta, non = 4, 9\nskor_peserta, skor_non = 720, 640\n\n# TULIS KODEMU\nklaim = non - peserta\nselisih_skor = skor_peserta - skor_non\n\nprint(f"klaim={klaim}  selisih_skor={selisih_skor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "klaim", value: 5, tol: 1e-9, label: "`klaim` seharusnya 5", msg: "9 − 4 = 5 poin — klaim mentah yang tidak kredibel." },
          { kind: "equal", task: "t2", name: "selisih_skor", value: 80, tol: 1e-9, label: "`selisih_skor` seharusnya 80", msg: "720 − 640 = 80 poin gap bawaan — self-selection jelas." },
          { kind: "stdout_matches", task: "t2", pattern: "klaim=5\\s+selisih_skor=80", label: "`print` menampilkan keduanya", msg: "Format: klaim=...  selisih_skor=... ." },
        ],
      },
      reference: "Es krim vs tenggelam versi korporat: jangan klaim kausal dari sini.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Korelasi ≠ kausasi: empat penjelasan — X→Y, Y→X, Z→keduanya, kebetulan.",
        "Confounder: gambar DAG dulu; kontrol confounder, jangan kontrol mediator/collider.",
        "Simpson's paradox: cek per segmen sebelum percaya agregat.",
        "RCT = standar emas (menyeimbangkan confounder tak teramati); DiD butuh parallel trends.",
        "IV/RDD/matching mencari randomisasi alami; hanya korelasi → jangan klaim kausal.",
      ],
      next: { label: "A2.2 — Estimasi & MLE", href: "/learn/a22-estimasi-mle" },
      quiz: [
        {
          q: "Kampanye A menang agregat tapi kalah di tiap segmen. Penjelasan & tindakan?",
          options: [
            { text: "Data salah — mustahil", why: "Mungkin — ini Simpson's paradox yang klasik." },
            { text: "Simpson's paradox: komposisi segmen beda. Keputusan dari per-segmen: B lebih baik; audit alokasi A", why: "Agregat mencampur kualitas dengan komposisi alokasi.", correct: true },
            { text: "A tetap menang — agregat yang benar", why: "Agregat menghukum A atas komposisi, bukan kualitas." },
            { text: "Gabungkan segmennya", why: "Menggabungkan justru menyembunyikan masalahnya." },
          ],
        },
        {
          q: "Mengapa RCT disebut standar emas kausalitas?",
          options: [
            { text: "Karena mahal", why: "Mahal bukan alasan ilmiah." },
            { text: "Karena randomisasi menyeimbangkan confounder teramati maupun tak teramati", why: "Randomisasi memutus semua panah Z→X, termasuk Z yang tidak kamu ketahui.", correct: true },
            { text: "Karena butuh n besar", why: "n besar soal power, bukan soal kausalitas." },
            { text: "Karena selalu etis", why: "Tidak selalu — kadang randomisasi tidak etis (itulah gunanya kuasi-eksperimen)." },
          ],
        },
        {
          q: "Dalam DAG X→M→Y (M mediator), kamu mengontrol M dalam regresi. Apa akibatnya?",
          options: [
            { text: "Estimasi lebih akurat", why: "Sebaliknya: ia menghapus efek yang ingin diukur." },
            { text: "Menghapus (sebagian) efek X→Y yang ingin diukur — mengontrol mediator memblokir jalur kausal itu sendiri", why: "Seperti mengukur efek obat sambil mengontrol kadar obat dalam darah.", correct: true },
            { text: "Tidak ada efek", why: "Ada: jalur kausalnya terblokir." },
            { text: "Menambah power", why: "Power bukan masalahnya — bias yang muncul." },
          ],
        },
        {
          q: "Syarat nyawa DiD yang harus diperiksa sebelum percaya hasilnya?",
          options: [
            { text: "n > 1000", why: "n soal presisi, bukan validitas DiD." },
            { text: "Parallel trends: tanpa perlakuan, kedua grup bergerak paralel — cek tren pra-perlakuan", why: "DiD mengurangkan tren via kontrol — hanya sah jika trennya memang sama.", correct: true },
            { text: "Data normal", why: "DiD tidak butuh normalitas." },
            { text: "Tidak ada missing data", why: "Missing soal kualitas data umum, bukan syarat DiD." },
          ],
        },
        {
          q: "Beasiswa diberikan untuk nilai ≥ 80. Metode kuasi-eksperimen paling tepat untuk efek beasiswa?",
          options: [
            { text: "Bandingkan semua penerima vs bukan penerima", why: "Penerima memang nilainya lebih tinggi — self-selection." },
            { text: "RDD: bandingkan yang 79 vs 81 — di sekitar ambang keduanya hampir identik kecuali beasiswanya", why: "Ambang tajam = eksperimen alami; lompatan di ambang = efek kausal lokal.", correct: true },
            { text: "DiD", why: "DiD butuh grup kontrol + sebelum/sesudah — tidak ada di sini." },
            { text: "Korelasi nilai vs pendapatan", why: "Korelasi bukan efek kausal beasiswa." },
          ],
        },
      ],
      note: {
        title: "Intuisi: korelasi adalah rumor, kausasi adalah kesaksian",
        body: "Lima heuristik. Satu: sebelum mempercayai klaim kausal, tanya “variabel Z apa yang bisa menjelaskan keduanya?” — confounder adalah pembunuh klaim yang paling sering lolos sensor. Dua: DiD berdiri di atas asumsi parallel trends — asumsi yang tidak bisa dibuktikan, hanya dipertahankan dengan cerita yang masuk akal plus placebo test; tanpanya DiD hanyalah selisih ganda yang berharap. Tiga: mengontrol variabel yang salah lebih buruk dari tidak mengontrol — collider membuka jalur bias baru, mediator menghapus efek yang ingin kamu ukur; gambar DAG dulu, baru putuskan. Empat: RCT kecil yang bersih mengalahkan observasional raksasa yang kotor — randomisasi adalah satu-satunya cara memutus panah dari confounder tak teramati. Lima: korelasi adalah titik awal penyelidikan, bukan akhir — ia berkata “ada yang berhubungan”, tugasmulah mencari tahu apa yang menyebabkan apa, lewat jalur mana. Enam: bedakan level klaimmu — asosiasi terkontrol dari regresi observasional adalah bukti perunggu; klaim kausal butuh desain (RCT atau kuasi-eksperimen) ditambah asumsi yang kamu berani pertahankan di depan skeptis.",
      },
    },
  ],
};
