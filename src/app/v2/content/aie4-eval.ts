import type { V2Lesson } from "../lib/types";

// Batang EM 50% vs token-F1 84%: metrik berbeda, cerita berbeda.
const FIG_METRIK = `<svg viewBox="0 0 480 240" role="img" aria-label="Exact match 50 persen vs token-F1 84 persen pada prediksi yang sama.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="200" x2="460" y2="200"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="110" x2="460" y2="110"/><line x1="44" y1="65" x2="460" y2="65"/><line x1="44" y1="20" x2="460" y2="20"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="204">0</text><text x="38" y="159">0,25</text><text x="38" y="114">0,5</text><text x="38" y="69">0,75</text><text x="38" y="24">1</text></g>
<rect x="120" y="110" width="100" height="90" fill="var(--c4)"/>
<rect x="300" y="48.8" width="100" height="151.2" fill="var(--c1)"/>
<g fill="var(--text)" font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="170" y="100">EM 50%</text><text x="350" y="38.8">F1 0,84</text></g>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="170" y="222">exact match</text><text x="350" y="222">token-F1</text></g>
<text x="240" y="14" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">skor yang sama, metrik berbeda, kesimpulan berbeda</text>
</svg>`;

export const aie4: V2Lesson = {
  slug: "aie4-eval",
  track: "AI Engineering",
  module: "RAG & Retrieval",
  title: "AIE4 — Evaluasi LLM",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-95-persen",
      eyebrow: "Langkah 1 · Cerita",
      title: "Akurasi 95 persen yang runtuh saat diuji orang lain",
      prose: [
        "Tim chatbot NusaBank mengumumkan 'akurasi 95 persen' ke direksi. Direksi senang. Lalu tim audit menguji dengan 100 pertanyaan baru yang disusun independen — skornya 61 persen. Tidak ada yang berbohong; tim hanya menguji di 20 contoh yang mereka buat sendiri, yang kebetulan mirip dengan contoh pengembangan.",
        "Twist-nya: yang menipu bukan modelnya, melainkan metodenya. Evaluasi yang tidak independen, tidak cukup besar, dan tidak mencakup edge case adalah cermin yang menyanjung — ia memantulkan apa yang ingin kamu lihat. Engineer yang baik tidak bertanya 'berapa skormu', melainkan 'bagaimana kamu mengukurnya'.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membangun golden set yang independen dan representatif; (2) menghitung exact match dan token-F1; (3) menjelaskan kapan metrik otomatis menipu; (4) mendeteksi bias LLM-as-judge (position, verbosity); (5) merancang sampling evaluasi yang hemat.",
        "🗺️ Isi lesson: Langkah 1 · Cerita 95 persen — Langkah 2 · Golden set dan metrik otomatis — Langkah 3 · Lab: EM vs F1 — Langkah 4 · LLM-as-judge dan biasnya — Langkah 5 · Lab: position bias — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Evaluasi = golden set independen + metrik yang tepat + ukuran sampel yang cukup. Tanpa ketiganya, skor adalah hiasan.",
    },
    {
      id: "konsep-golden-metrik",
      eyebrow: "Langkah 2 · Golden set dan metrik",
      title: "Golden set: tanah tempat semua klaim berpijak",
      prose: [
        "Golden set adalah kumpulan pasangan (input, jawaban benar) yang disepakati, INDEPENDEN dari data pengembangan, dan mencakup edge case. Tiga sifatnya: independen (bukan contoh yang dipakai saat tuning prompt), representatif (mencerminkan distribusi produksi), dan dirawat (diperbarui saat ditemukan kasus gagal baru).",
        "Dua metrik otomatis untuk jawaban pasti. Exact Match (EM): 1 bila prediksi persis sama dengan emas, 0 bila tidak — keras tetapi jujur. Token-F1: mengukur irisan kata antara prediksi dan emas — adil untuk jawaban benar dengan redaksi berbeda ('kartu diblokir hubungi 1500' vs 'kartu anda sudah diblokir, hubungi 1500').",
        "Kepribadian keduanya: EM adalah hakim yang kaku — salah koma pun divonis gagal. F1 adalah mediator — menghargai usaha yang sebagian benar. Pilih hakim untuk kontrak mesin; pilih mediator untuk bahasa manusia.",
        "Ukuran sampel — matematika kecukupan. 500 tiket, akurasi 90 persen: margin of error = 1,96 × √(0,9×0,1/500) = ±2,6 persen. Klaim “naik 2 persen” (90→92) TIDAK SIGNIFIKAN (dalam margin!). Butuh ~2.000 sampel untuk ±1,3 persen. Aturan: jangan rayakan kenaikan < margin of error. 500 tiket cukup untuk “apakah >85 persen?” (ya/tidak), TIDAK cukup untuk “apakah 90 atau 92?”. Sesuaikan pertanyaan dengan ukuran sampelmu.",
        "Stratified sampling — jangan acak buta. 500 tiket: 400 mudah + 100 sulit (edge). Acak buta dari produksi (95 persen mudah): 475 mudah + 25 sulit — model 99 persen di mudah, 40 persen di sulit → skor “94 persen” MENIPU. Stratified (100 sulit dijamin): skor jujur per strata. Aturan: golden set HARUS over-sample edge case (minimal 20 persen sulit). Evaluasi yang tidak stratified = nilai rapor yang disortir.",
        "Golden set drift — kedaluwarsa diam-diam. Produk berubah (fitur baru), bahasa berubah (slang baru) → golden set 2024 menguji dunia 2024, bukan 2026. Gejala: skor tetap 92 persen tetapi komplain naik. Solusi: refresh 10 persen sampel per kuartal + tambah dari tiket yang GAGAL. Golden set = bukan monumen; ia kebun yang dirawat. Tanpa refresh: mengukur masa lalu dengan presisi tinggi.",
      ],
      formula: String.raw`F_1 = \frac{2 \cdot |\text{irisan}|}{|P| + |G|}`,
      formulaNote: "|irisan| = jumlah kata yang sama di prediksi dan jawaban emas; |P| = jumlah kata prediksi; |G| = jumlah kata emas. F1 = 1 bila identik; 0 bila tidak ada kata yang sama. Contoh lab: prediksi vs emas yang beda redaksi mendapat 0,6–0,75 — tidak nol, tidak satu.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Skor tinggi di metrik otomatis = produk siap launch.' Salah. Metrik otomatis buta terhadap halusinasi yang fasih, bias yang halus, dan jawaban 'benar tapi berbahaya'. Ia alat skrining, bukan vonis akhir — keputusan launch butuh lapisan manusia atau judge yang dikalibrasi.",
      },
      reference: "Golden set: independen, representatif, dirawat. EM untuk kontrak mesin, F1 untuk bahasa manusia.",
    },
    {
      id: "lab-em-f1",
      eyebrow: "Langkah 3 · Lab metrik",
      title: "Lab: satu prediksi, dua cerita",
      prose: [
        "Empat prediksi chatbot vs jawaban emas. Dua identik persis, dua beda redaksi tetapi (sebagian) benar. Hitung rata-rata EM dan token-F1 — lalu renungkan: metrik mana yang akan kamu laporkan ke direksi, dan mengapa jawabannya 'keduanya, dengan penjelasan'?",
        "Coba ubah: buat satu prediksi menjadi persis sama dengan emas, jalankan ulang, dan lihat EM melonjak sementara F1 naik sedikit. Itulah sensitivitas berbeda dua metrik terhadap perbaikan yang sama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `em_rata` dan `f1_rata` dari pasangan PRED dan GOLD" },
        { id: "t2", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "EM=50%  F1=0.84",
      note: {
        title: "💡 Intuisi",
        body: "EM dan F1 bukan kompetitor — mereka saksi yang berbeda. EM bersaksi 'apakah mesin bisa memakainya langsung'; F1 bersaksi 'apakah manusia menganggapnya benar'. Laporkan keduanya; selisih besar di antara mereka adalah sinyal bahwa redaksimu perlu distandarkan.",
      },
      hints: [
        "Rata-rata = jumlahkan skor tiap pasangan, bagi len(GOLD).",
        "em_rata = sum(em(p, g) for p, g in zip(PRED, GOLD))/len(GOLD)",
        "Pola sama untuk f1_rata dengan token_f1. Format: f\"EM={em_rata:.0%}  F1={f1_rata:.2f}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nGOLD = [\n    "saldo anda rp1.234.567",\n    "kartu diblokir hubungi 1500",\n    "bunga deposito 4,5 persen",\n    "tagihan listrik rp250.000",\n]\nPRED = [\n    "saldo anda rp1.234.567",\n    "kartu anda sudah diblokir, hubungi 1500",\n    "bunga deposito 5 persen",\n    "tagihan listrik rp250.000",\n]\n\ndef em(p, g):\n    return 1.0 if p == g else 0.0\n\ndef token_f1(p, g):\n    pt, gt = p.split(), g.split()\n    sisa = list(gt)\n    overlap = 0\n    for t in pt:\n        if t in sisa:\n            sisa.remove(t); overlap += 1\n    return 2*overlap/(len(pt)+len(gt)) if pt or gt else 0.0\n\n# TULIS KODEMU: rata-rata EM dan token-F1\nem_rata = \nf1_rata = \n\nprint(f"EM={em_rata:.0%}  F1={f1_rata:.2f}")`,
        lockLines: 27,
        solution: `# DATA SEED — jangan ubah\nGOLD = [\n    "saldo anda rp1.234.567",\n    "kartu diblokir hubungi 1500",\n    "bunga deposito 4,5 persen",\n    "tagihan listrik rp250.000",\n]\nPRED = [\n    "saldo anda rp1.234.567",\n    "kartu anda sudah diblokir, hubungi 1500",\n    "bunga deposito 5 persen",\n    "tagihan listrik rp250.000",\n]\n\ndef em(p, g):\n    return 1.0 if p == g else 0.0\n\ndef token_f1(p, g):\n    pt, gt = p.split(), g.split()\n    sisa = list(gt)\n    overlap = 0\n    for t in pt:\n        if t in sisa:\n            sisa.remove(t); overlap += 1\n    return 2*overlap/(len(pt)+len(gt)) if pt or gt else 0.0\n\n# TULIS KODEMU: rata-rata EM dan token-F1\nem_rata = sum(em(p, g) for p, g in zip(PRED, GOLD))/len(GOLD)\nf1_rata = sum(token_f1(p, g) for p, g in zip(PRED, GOLD))/len(GOLD)\n\nprint(f"EM={em_rata:.0%}  F1={f1_rata:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "em_rata", value: 0.5, tol: 1e-9, label: "`em_rata` seharusnya 0.5", msg: "Dua prediksi identik (1,0), dua tidak (0,0). Rata-rata = 0,5." },
          { kind: "equal", task: "t1", name: "f1_rata", value: 0.8375, tol: 0.01, label: "`f1_rata` seharusnya 0.84", msg: "(1,0 + 0,6 + 0,75 + 1,0)/4 = 0,8375." },
          { kind: "stdout_matches", task: "t2", pattern: "EM=50%\\s+F1=0\\.84", label: "`print` menampilkan keduanya", msg: "Format: EM=50%  F1=0.84." },
        ],
      },
      reference: "Laporkan EM dan F1 berpasangan; selisih besar = sinyal redaksi perlu distandarkan.",
    },
    {
      id: "konsep-judge",
      eyebrow: "Langkah 4 · LLM-as-judge",
      title: "LLM-as-judge: juri murah dengan bias mahal",
      prose: [
        "Untuk jawaban terbuka (ringkasan, chat), metrik otomatis tidak cukup — kamu butuh penilai yang memahami makna. LLM-as-judge: model lain menilai jawaban modelmu. Murah dan skalabel, tetapi punya bias sistematis yang terdokumentasi.",
        "Tiga bias utama. Position bias: saat ragu, judge cenderung memilih jawaban yang disebut duluan. Verbosity bias: jawaban panjang terlihat lebih baik, padahal hanya lebih bertele-tele. Self-preference: model cenderung menyukai gaya tulisannya sendiri. Mitigasinya: acak urutan, minta alasan sebelum vonis, dan kalibrasi terhadap sampel penilaian manusia.",
        "Kepribadian judge: ia seperti juri kontes yang bisa disuap dengan format — bukan karena jahat, melainkan karena ia juga model bahasa yang menyukai pola familiar. Jangan percaya juri tanpa mengauditnya.",
        "Position bias — angka yang mengejutkan. Judge LLM memilih jawaban yang tampil PERTAMA 62 persen (bukan 50%!) saat kualitas setara. Solusi: evaluasi dua arah (AB dan BA), hitung hanya yang konsisten → bias turun ke 51 persen. Biaya: 2x evaluasi. Tanpa koreksi: 12 persen keputusanmu = artefak posisi, bukan kualitas. Murah tetapi bias = mahal dalam keputusan salah.",
        "Batas kesepakatan manusia — plafon judge. Dua manusia setuju 85 persen (Cohen’s kappa 0,7). Judge LLM vs manusia: 82 persen — MENDEKATI plafon manusia! Artinya: judge sudah “sebagus manusia kedua”, dan sisa 15 persen = ambiguitas inheren tugas (bukan kegagalan judge). Jangan kejar 100 persen kesepakatan — kejar 85 persen (plafon). Di atas itu = overfitting ke selera 1 annotator.",
      ],
      figure: {
        svg: FIG_METRIK,
        alt: "Exact match 50 persen vs token-F1 84 persen pada prediksi yang sama.",
        caption: "Cara membaca: dua batang dari EMPAT prediksi yang sama; kiri = exact match, kanan = token-F1; sumbu Y 0–1. Interpretasi: metrik yang sama-sama 'benar' memberi cerita berbeda — 50 persen terdengar gagal, 0,84 terdengar baik. Keduanya jujur pada definisinya; yang menipu adalah melaporkan satu angka tanpa menjelaskan definisinya.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'LLM-as-judge objektif karena ia AI.' Salah. Judge adalah model bahasa dengan bias yang sama seperti model yang dinilai — position, verbosity, self-preference. Judge yang tidak dikalibrasi ke manusia hanya memindahkan subjektivitas, bukan menghilangkannya.",
      },
      reference: "Acak urutan jawaban, minta alasan dulu, kalibrasi ke sampel manusia. Audit jurimu.",
    },
    {
      id: "lab-bias",
      eyebrow: "Langkah 5 · Lab bias",
      title: "Lab: menangkap position bias dengan tangan sendiri",
      prose: [
        "Empat pasang jawaban dinilai `mock_judge` yang meniru bias nyata: bila satu jawaban jelas lebih lengkap, ia menang; bila seri (keduanya lengkap atau keduanya singkat), judge memilih yang disebut duluan. Kita ukur flip rate: berapa persen vonis BERUBAH hanya karena urutannya dibalik.",
        "Fungsi `pemenang_dibalik` memanggil judge dengan urutan terbalik lalu menerjemahkan hasilnya ke urutan asli. Bila judge konsisten, flip = 0 persen. Hasil lab akan menunjukkan angka yang mengkhawatirkan — dan itulah alasan urutan harus diacak di evaluasi sungguhan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `pemenang_dibalik(pas)` yang menilai dengan urutan terbalik" },
        { id: "t2", text: "Hitung `flip`: proporsi vonis yang berubah saat dibalik" },
        { id: "t3", text: "Cetak flip dengan `print`" },
      ],
      expected: "flip=50%",
      note: {
        title: "💡 Intuisi",
        body: "Flip rate adalah tes kesehatan termurah untuk judge-mu: nol biaya, langsung menunjukkan apakah urutan memengaruhi vonis. Judge dengan flip 50 persen pada kasus seri pada dasarnya melempar koin yang dibungkus otoritas.",
      },
      hints: [
        "Di dalam pemenang_dibalik: a, b = pas; w = mock_judge(b, a)",
        "Terjemahkan: return \"B\" if w == \"A\" else \"A\"",
        "flip = sum(1 for p in PASANGAN if mock_judge(*p) != pemenang_dibalik(p))/len(PASANGAN)",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nPASANGAN = [\n    ("Jawaban A jelas dan lengkap.", "Jawaban B singkat."),\n    ("Jawaban A singkat.", "Jawaban B jelas dan lengkap."),\n    ("Jawaban A jelas dan lengkap.", "Jawaban B jelas dan lengkap."),\n    ("Jawaban A singkat.", "Jawaban B singkat."),\n]\n\ndef mock_judge(a, b):\n    # judge bias: cenderung memilih yang disebut duluan bila ragu\n    if "lengkap" in a and "lengkap" not in b: return "A"\n    if "lengkap" in b and "lengkap" not in a: return "B"\n    return "A"  # tie -> pilih pertama (position bias)\n\n# TULIS KODEMU: hitung flip rate saat urutan dibalik\ndef pemenang_dibalik(pas):\n    \n\nflip = \n\nprint(f"flip={flip:.0%}")`,
        lockLines: 15,
        solution: `# DATA SEED — jangan ubah\nPASANGAN = [\n    ("Jawaban A jelas dan lengkap.", "Jawaban B singkat."),\n    ("Jawaban A singkat.", "Jawaban B jelas dan lengkap."),\n    ("Jawaban A jelas dan lengkap.", "Jawaban B jelas dan lengkap."),\n    ("Jawaban A singkat.", "Jawaban B singkat."),\n]\n\ndef mock_judge(a, b):\n    # judge bias: cenderung memilih yang disebut duluan bila ragu\n    if "lengkap" in a and "lengkap" not in b: return "A"\n    if "lengkap" in b and "lengkap" not in a: return "B"\n    return "A"  # tie -> pilih pertama (position bias)\n\n# TULIS KODEMU: hitung flip rate saat urutan dibalik\ndef pemenang_dibalik(pas):\n    a, b = pas\n    w = mock_judge(b, a)\n    return "B" if w == "A" else "A"\n\nflip = sum(1 for p in PASANGAN if mock_judge(*p) != pemenang_dibalik(p))/len(PASANGAN)\n\nprint(f"flip={flip:.0%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "pemenang_dibalik", label: "`pemenang_dibalik` terdefinisi", msg: "Tulis fungsi pemenang_dibalik(pas) di bagian editable." },
          { kind: "equal", task: "t2", name: "flip", value: 0.5, tol: 1e-9, label: "`flip` seharusnya 0.5", msg: "Dua kasus seri (keduanya lengkap / keduanya singkat) berbalik vonisnya: 2 dari 4." },
          { kind: "stdout_matches", task: "t3", pattern: "flip=50%", label: "`print` menampilkan flip", msg: "Format: flip=50%." },
        ],
      },
      reference: "Flip rate = tes kesehatan termurah judge. Acak urutan di evaluasi sungguhan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: metrik otomatis, judge, atau manusia?",
      prose: [
        "Satu, output punya jawaban pasti (ekstraksi, klasifikasi) — metrik otomatis (EM/F1) di golden set; murah, deterministik, bisa jalan tiap commit. Dua, output terbuka (ringkasan, percakapan) — LLM-as-judge yang sudah dikalibrasi ke manusia, dengan urutan diacak dan alasan diminta dulu.",
        "Tiga, keputusan berisiko tinggi (kredit, medis, hukum) — manusia, pada sampel yang representatif; tidak ada jalan pintas. Empat, monitoring produksi — metrik otomatis murah setiap hari sebagai alarm, audit manusia atau judge mingguan sebagai vonis.",
        "Aturan praktis 10 detik: otomatis untuk skrining, judge untuk skala, manusia untuk vonis. Jangan minta vonis dari alat skrining.",
        "Tangga biaya evaluasi — pilih sesuai taruhan. Taruhan rendah (format benar?): metrik otomatis (Rp0, instan). Taruhan sedang (nada sopan?): LLM judge (Rp150/juta token, menit). Taruhan tinggi (nasihat medis?): manusia (Rp50 ribu/sampel, hari). Campuran cerdas: otomatis untuk 100 persen, judge untuk 10 persen sampel, manusia untuk 1 persen audit. Tangga ini = 99 persen keyakinan dengan 10 persen biaya manusia penuh.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Evaluasi adalah sistem berlapis seperti keamanan bandara: metal detector (otomatis) untuk semua, pemeriksaan manual (manusia) untuk yang mencurigakan. Satu lapis saja selalu bisa dikelabui.",
      },
      reference: "Otomatis = skrining. Judge = skala (kalibrasi dulu). Manusia = vonis risiko tinggi.",
    },
    {
      id: "minicase-tiket",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 500 tiket dan sampel yang cukup",
      prose: [
        "Chatbot NusaBank menangani 500 tiket per minggu. Menilai semuanya manual: 500 x Rp25.000 = Rp12,5 juta per minggu — mahal dan lambat. Berapa sampel yang cukup untuk estimasi dengan margin error ±10 persen pada tingkat kepercayaan 95 persen? Rumus: n = z² x p(1-p) / e² = 1,96² x 0,25 / 0,01 ≈ 97 tiket.",
        "97 tiket x Rp25.000 = Rp2,4 juta — hemat Rp10,1 juta per minggu dengan informasi yang secara statistik setara untuk keputusan operasional. Tambahan cerdas: jalankan metrik otomatis dulu sebagai filter, kirim hanya kasus yang gagal EM ke manusia — sampel efektif turun ke ±60 tiket.",
        "Twist: mengukur 100 persen justru bisa lebih buruk — penilai kelelahan di tiket ke-400, kualitas penilaian turun, dan kamu membayar Rp10 juta untuk noise. Sampel yang dirancang baik mengalahkan sensus yang melelahkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dalam model risk, validasi memakai sampel out-of-time dengan ukuran yang dihitung — bukan 'sebanyak mungkin'. Prinsipnya sama: presisi yang direncanakan mengalahkan volume yang membabi buta, dan dokumentasi metodologi adalah syarat audit.",
      },
      reference: "n = z²p(1-p)/e². Untuk e=±10 persen, 95 persen CI: ±97 sampel. Sensus melelahkan bisa lebih buruk dari sampel cerdas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Golden set harus independen, representatif, dan dirawat — skor tanpa itu adalah hiasan.",
        "EM = hakim kaku untuk kontrak mesin; token-F1 = mediator untuk bahasa manusia; laporkan keduanya.",
        "LLM-as-judge punya bias: position, verbosity, self-preference — kalibrasi ke manusia, acak urutan.",
        "Flip rate adalah tes kesehatan termurah untuk judge-mu.",
        "Sampling yang dirancang (n = z²p(1-p)/e²) mengalahkan sensus yang melelahkan dan mahal.",
      ],
      next: { label: "AIE5 — Fine-Tuning: Kapan dan Bagaimana", href: "/learn/aie5-finetuning" },
      quiz: [
        {
          q: "Mengapa 'akurasi 95 persen di 20 contoh buatan sendiri' menipu?",
          options: [
            { text: "Contoh terlalu sedikit dan tidak independen dari pengembangan", why: "Tepat: 20 contoh buatan sendiri mencerminkan apa yang sudah dituning — bukan kinerja di dunia nyata.", correct: true },
            { text: "Akurasi 95 persen secara matematis tidak mungkin", why: "Sangat mungkin; masalahnya bukan angkanya, melainkan cara mengukurnya.", correct: false },
            { text: "Model tidak boleh diuji oleh timnya sendiri", why: "Boleh saja, asal contoh ujinya independen dan tidak dipakai saat pengembangan.", correct: false },
            { text: "Metrik akurasi tidak cocok untuk LLM", why: "Akurasi cocok untuk tugas klasifikasi; yang salah adalah sampelnya, bukan metriknya.", correct: false },
          ],
        },
        {
          q: "Kapan token-F1 lebih adil daripada exact match?",
          options: [
            { text: "Ketika jawaban benar tetapi redaksinya berbeda", why: "Tepat: F1 memberi kredit parsial untuk kata yang benar, EM memvonis gagal total.", correct: true },
            { text: "Ketika output harus diparse oleh mesin", why: "Itu wilayah EM: mesin butuh kepastian persis, bukan kemiripan.", correct: false },
            { text: "Ketika golden set sangat kecil", why: "Ukuran golden set tidak menentukan pilihan metrik.", correct: false },
            { text: "Tidak pernah — EM selalu lebih baik", why: "EM terlalu keras untuk bahasa manusia yang variatif.", correct: false },
          ],
        },
        {
          q: "Apa itu position bias pada LLM-as-judge?",
          options: [
            { text: "Judge cenderung memilih jawaban yang disebut duluan saat ragu", why: "Tepat: seperti di lab, kasus seri selalu dimenangkan urutan pertama — flip 50 persen.", correct: true },
            { text: "Judge hanya bisa menilai satu posisi jawaban", why: "Judge bisa menilai banyak; biasnya soal urutan, bukan kapasitas.", correct: false },
            { text: "Judge membenci jawaban yang terlalu panjang", why: "Kebalikannya: verbosity bias membuat judge menyukai jawaban panjang.", correct: false },
            { text: "Judge tidak bisa membaca bahasa Indonesia", why: "Tidak relevan dengan position bias.", correct: false },
          ],
        },
        {
          q: "Kapan penilaian manusia wajib, tidak bisa diganti metrik atau judge?",
          options: [
            { text: "Ketika budget evaluasi terbatas", why: "Budget terbatas justru alasan memakai metrik otomatis/judge.", correct: false },
            { text: "Keputusan berisiko tinggi: kredit, medis, hukum", why: "Tepat: di sinilah vonis butuh akuntabilitas manusia — tidak bisa didelegasikan ke skor.", correct: true },
            { text: "Ketika golden set sudah sangat besar", why: "Golden set besar justru membuat metrik otomatis makin bisa diandalkan.", correct: false },
            { text: "Ketika output selalu berupa angka", why: "Angka adalah kasus termudah untuk metrik otomatis.", correct: false },
          ],
        },
        {
          q: "Ciri golden set yang baik?",
          options: [
            { text: "Besar, diambil dari data training, dan tidak pernah diubah", why: "Dari data training = tidak independen; tidak diubah = tidak dirawat. Dua-duanya salah.", correct: false },
            { text: "Independen dari pengembangan, representatif, mencakup edge case, dan dirawat", why: "Tepat: empat sifat ini yang membuat skor bisa dipercaya.", correct: true },
            { text: "Kecil saja agar evaluasi cepat, 5 contoh cukup", why: "Terlalu kecil = noise mendominasi; butuh ukuran yang dihitung.", correct: false },
            { text: "Hanya berisi kasus mudah agar skor terlihat bagus", why: "Itu manipulasi metrik, bukan evaluasi.", correct: false },
          ],
        },
      ],
    },
  ],
};
