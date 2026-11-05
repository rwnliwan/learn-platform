import type { V2Lesson } from "../lib/types";

// Pipeline evaluasi RAG: golden dataset -> eksekusi -> metrik -> gerbang CI.
const EVAL_PIPE_SVG = `<svg viewBox="0 0 640 200" role="img" aria-label="Pipeline evaluasi: dataset emas, jalankan RAG, hitung metrik faithfulness dan precision, gerbang CI lolos atau tahan rilis."><g font-family="var(--font-ui)" font-size="11">
<rect x="15" y="60" width="130" height="80" rx="8" fill="var(--c1)" fill-opacity="0.25" stroke="var(--c1)" stroke-width="1.5"/>
<text x="80" y="85" text-anchor="middle" fill="var(--text)">Golden dataset</text>
<text x="80" y="103" text-anchor="middle" fill="var(--chart-text)" font-size="10">120 pertanyaan +</text>
<text x="80" y="119" text-anchor="middle" fill="var(--chart-text)" font-size="10">jawaban acuan</text>
<rect x="185" y="60" width="130" height="80" rx="8" fill="var(--c2)" fill-opacity="0.25" stroke="var(--c2)" stroke-width="1.5"/>
<text x="250" y="85" text-anchor="middle" fill="var(--text)">Jalankan RAG</text>
<text x="250" y="103" text-anchor="middle" fill="var(--chart-text)" font-size="10">jawab + catat</text>
<text x="250" y="119" text-anchor="middle" fill="var(--chart-text)" font-size="10">chunk terambil</text>
<rect x="355" y="60" width="130" height="80" rx="8" fill="var(--c3)" fill-opacity="0.25" stroke="var(--c3)" stroke-width="1.5"/>
<text x="420" y="85" text-anchor="middle" fill="var(--text)">Hitung metrik</text>
<text x="420" y="103" text-anchor="middle" fill="var(--chart-text)" font-size="10">faithfulness,</text>
<text x="420" y="119" text-anchor="middle" fill="var(--chart-text)" font-size="10">context precision</text>
<polygon points="555,60 625,100 555,140 485,100" fill="var(--c4)" fill-opacity="0.25" stroke="var(--c4)" stroke-width="1.5"/>
<text x="555" y="95" text-anchor="middle" fill="var(--text)" font-size="10">Gerbang CI</text>
<text x="555" y="111" text-anchor="middle" fill="var(--chart-text)" font-size="10">lolos / tahan</text>
<line x1="145" y1="100" x2="183" y2="100" stroke="var(--chart-grid)" stroke-width="1.5"/><polygon points="183,94 183,106 191,100" fill="var(--chart-grid)"/>
<line x1="315" y1="100" x2="353" y2="100" stroke="var(--chart-grid)" stroke-width="1.5"/><polygon points="353,94 353,106 361,100" fill="var(--chart-grid)"/>
<line x1="485" y1="100" x2="483" y2="100" stroke="var(--chart-grid)" stroke-width="1.5"/><polygon points="483,94 483,106 491,100" fill="var(--chart-grid)"/>
<text x="320" y="175" text-anchor="middle" fill="var(--chart-text)" font-size="10">setiap rilis prompt/model/index menjalankan pipeline yang SAMA — regresi terdeteksi sebagai angka, bukan firasat</text>
</g></svg>`;

export const llmops20: V2Lesson = {
  slug: "llmops20-evaluasi-llm-rag",
  track: "LLMOps",
  module: "Evaluasi & Observabilitas",
  title: "LLMOps20 — Evaluasi LLM & RAG: RAGAS, DeepEval, LangSmith",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "`Modelnya terasa lebih pintar` bukan metrik. Tim yang mengoperasikan RAG/LLM butuh angka yang bisa dibandingkan antar rilis: apakah jawaban berdasar konteks, apakah chunk yang diambil relevan, dan apakah perubahan kemarin merusak sesuatu. Lesson ini tentang membangun mesin evaluasi itu — dari sudut platform/ops, bukan riset.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan dan menghitung metrik RAGAS inti: faithfulness, answer relevancy, context precision/recall; (2) merancang golden dataset dan gerbang CI evaluasi; (3) memakai trace sebagai bahan evaluasi, bukan sekadar debugging; (4) menempatkan LLM-as-judge pada porsinya yang benar; (5) membandingkan RAGAS, DeepEval, dan LangSmith untuk kebutuhan timmu.",
        "Urutan lesson: cerita skor yang menipu → metrik RAGAS → golden dataset & CI → tracing & LLM-as-judge → lab metrik → peta keputusan → mini-case → kuis.",
      ],
      tasks: [],
      reference: "Evaluasi ops = angka yang bisa dibandingkan antar rilis. `Terasa lebih pintar` bukan angka.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Skor naik 8 poin, komplain naik 3x lipat",
      prose: [
        "Tim RAG Bank Artha mengganti model embedding dan prompt peringkas. LLM-as-judge mereka — model lain yang menilai jawaban — melaporkan skor naik 8 poin: jawaban `lebih lengkap dan fasih`. Rilis jalan 100%. Seminggu kemudian, komplain CS naik 3x lipat: nasabah menerima jawaban yang fasih, rinci, dan SALAH — mengutip `promo` yang tidak ada dan `syarat` yang sudah kedaluwarsa.",
        "Twist-nya: judge menilai kefasihan, bukan kebenaran. Model baru memang menulis lebih bagus — sehingga halusinasinya juga lebih meyakinkan. Yang tidak diukur: faithfulness (berapa klaim jawaban yang didukung konteks) dan context precision (berapa chunk terambil yang relevan). Dua metrik itu justru TURUN di rilis baru: chunk relevan turun dari 71% ke 44% karena embedding baru.",
        "Tim rollback, lalu membangun yang seharusnya ada sejak awal: golden dataset 120 pertanyaan dengan jawaban acuan + gerbang CI yang menghitung faithfulness dan context precision setiap rilis. Rilis berikutnya yang `skor judge-nya naik` TERTAHAN gerbang karena faithfulness turun 6 poin — dan postmortem membuktikan gerbang itu benar.",
        "Lesson ini membangun pemahaman metrik-metrik itu — agar `skor naik` berikutnya bisa ditanya: skor APA yang naik?",
      ],
      tasks: [],
      note: {
        title: "Mitos: satu skor evaluasi cukup untuk memutuskan rilis",
        type: "pitfall",
        body: "Yang benar: satu skor menyembunyikan trade-off. Skor kefasihan bisa naik bersamaan dengan faithfulness yang turun — persis seperti di cerita. Keputusan rilis butuh PANEL metrik (groundedness + relevansi + biaya), bukan satu angka.",
      },
      reference: "Judge mengukur kefasihan. Faithfulness & retrieval metrics mengukur kebenaran. Keduanya dibutuhkan.",
    },
    {
      id: "metrik-ragas",
      eyebrow: "Langkah 3 · Konsep",
      title: "Metrik RAGAS: faithfulness, relevancy, precision/recall",
      prose: [
        "RAGAS memecah kualitas RAG menjadi klaim yang bisa dihitung. Faithfulness = proporsi klaim dalam jawaban yang DIDUKUNG konteks terambil. Caranya: pecah jawaban jadi klaim atomik (`promo berakhir 31 Jan`, `syarat: saldo min 10jt`), lalu untuk tiap klaim tanyakan `apakah konteks mendukung ini?` (ya/tidak). Faithfulness 0,25 = 3 dari 4 klaim tidak berdasar — jawaban fasih yang berbahaya. Panggil dia Si Auditor yang Membaca Sumber: ia tidak peduli jawabanmu indah, ia peduli tiap kalimatmu ada buktinya.",
        "Answer relevancy = seberapa relevan jawaban terhadap PERTANYAAN (bukan konteks). Diukur terbalik: buat pertanyaan sintetis dari jawaban, lalu hitung kemiripan dengan pertanyaan asli — jawaban yang ngelantur menghasilkan pertanyaan sintetis yang jauh dari aslinya. Context precision@k = dari k chunk yang diambil, berapa yang relevan dengan pertanyaan. Context recall = dari semua chunk yang SEHARUSNYA diambil (menurut acuan), berapa yang berhasil diambil.",
        "Keempatnya menjawab kegagalan berbeda. Faithfulness rendah + precision tinggi = model mengarang walau konteks bagus (salahkan generator/prompt). Faithfulness tinggi + precision rendah = jawaban benar tapi beruntung — konteksnya sampah, lain kali bisa salah (salahkan retriever/embedding). Pola baca ini menentukan ke mana perbaikan diarahkan — tanpa metrik terpisah, tim menebak.",
        "💡 Intuisi: metrik RAG seperti panel instrumen pesawat — satu indikator tidak menerbangkan pesawat. Faithfulness = `apakah kita jujur`, precision/recall = `apakah radar kita melihat yang benar`, relevancy = `apakah kita menjawab yang ditanya`. Pilot yang hanya melihat satu indikator akan menabrak gunung dengan percaya diri.",
      ],
      formula: String.raw`F = \frac{n_{dukung}}{n_{klaim}} \quad\quad P@k = \frac{n_{relevan}}{k} \quad\quad R = \frac{n_{relevan}}{n_{seharusnya}}`,
      formulaNote: "F = faithfulness; n_dukung = klaim jawaban yang didukung konteks; n_klaim = total klaim. P@k = context precision@k; n_relevan = chunk terambil yang relevan; k = jumlah chunk diambil. R = context recall; n_seharusnya = chunk relevan menurut jawaban acuan. Contoh: jawaban 4 klaim, 1 didukung → F = 0,25 (kritis). Ambil 3 chunk, 2 relevan → P@3 = 0,67.",
      tasks: [],
      note: {
        title: "Mitos: faithfulness tinggi = jawaban benar",
        type: "pitfall",
        body: "Yang benar: faithfulness hanya menjamin jawaban SETIA pada konteks — kalau konteksnya salah/kedaluwarsa, jawaban yang faithful tetap salah. Itulah mengapa faithfulness selalu dibaca berpasangan dengan context precision: setia pada sumber yang tepat, bukan sekadar setia.",
      },
      reference: "Faithfulness → salahkan generator. Precision/recall → salahkan retriever. Baca berpasangan.",
    },
    {
      id: "golden-ci",
      eyebrow: "Langkah 4 · Konsep",
      title: "Golden dataset & gerbang CI evaluasi",
      prose: [
        "Golden dataset = 50–200 pasangan (pertanyaan, jawaban acuan, chunk yang seharusnya terambil) yang dikurasi manusia dan DIKUNCI. `Dikunci` artinya: tidak boleh ditambah kasus yang `kebetulan gagal kemarin` tanpa review — kalau tidak, dataset menjadi cermin bug kemarin, bukan cermin kebutuhan pengguna. Komposisinya meniru distribusi produksi: 70% pertanyaan umum, 20% edge case, 10% adversarial (pertanyaan menjebak, ejaan salah, topik di luar cakupan).",
        "Gerbang CI: setiap perubahan (prompt baru, model baru, embedding baru, index di-rebuild) menjalankan SELURUH golden dataset dan menghitung panel metrik. Aturan rilis: tidak ada metrik inti yang turun > ambang (mis. faithfulness turun > 3 poin = tahan), dan tidak ada kasus `kritis` baru (kasus yang dulu lulus sekarang gagal = regresi). Angka ambang ditulis di awal, bukan dinegosiasi setelah hasil keluar — kalau tidak, setiap rilis akan `kebetulan` lolos.",
        "Biaya evaluasi adalah biaya operasional nyata: 120 pertanyaan × (biaya jawab + biaya judge) per rilis. Trik ops: (1) evaluasi berjenjang — 30 kasus cepat tiap commit, 120 penuh tiap rilis; (2) cache jawaban untuk kasus yang tidak berubah perilakunya; (3) judge murah (model kecil) untuk skrining, judge mahal hanya untuk kasus sengketa. Evaluasi yang terlalu mahal akan dilewati tim — dan evaluasi yang dilewati = tidak ada evaluasi.",
        "💡 Intuisi: golden dataset adalah `ujian nasional` untuk RAG-mu. Tanpa ujian yang tetap, setiap rilis dinilai dengan soal berbeda — dan `nilai naik` tidak ada artinya. Ujian yang baik tidak berubah tiap semester; yang berubah adalah muridnya.",
      ],
      tasks: [],
      note: {
        title: "Mitos: dataset evaluasi bisa dibuat otomatis 100% oleh LLM",
        type: "pitfall",
        body: "Yang benar: LLM bisa MEMBANTU membuat draf kasus, tetapi jawaban acuannya harus diverifikasi manusia — kalau tidak, kamu mengukur `seberapa mirip model dengan dirinya sendiri`, bukan dengan kebenaran. 20% sampel acuan wajib di-review manusia tiap kuartal.",
      },
      reference: "Golden dataset: dikunci, meniru produksi, 50–200 kasus. Gerbang CI: ambang ditulis sebelum hasil.",
    },
    {
      id: "tracing-judge",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tracing sebagai bahan eval & porsi LLM-as-judge",
      prose: [
        "Trace (dari lesson agen ops) bukan sekadar alat debugging — ia bahan baku evaluasi. Setiap trace RAG mencatat: pertanyaan, chunk terambil (id + skor), prompt final, jawaban, token, latency. Dari 10.000 trace produksi, kamu bisa menambang: kasus faithfulness rendah untuk ditambah ke golden dataset, pola chunk yang selalu tidak relevan (sinyal embedding buruk), dan distribusi latency per komponen untuk SLO.",
        "LLM-as-judge: model penilai untuk aspek yang sulit dihitung (nada, kelengkapan, kefasihan). Porsinya yang benar: (1) judge HANYA untuk aspek subjektif — tidak pernah sebagai satu-satunya penentu faithfulness (itu bisa dihitung); (2) judge itu sendiri harus dievaluasi — ukur kesepakatan judge vs manusia di 100 sampel (target ≥ 85%); (3) judge yang menilai keluaran model sekeluarga dengannya bias menguntungkan — pakai judge dari keluarga berbeda untuk keputusan rilis.",
        "Membandingkan tool. RAGAS: library metrik (faithfulness, relevancy, precision/recall) — bagus untuk dihitung di CI, butuh kamu rangkai sendiri pipelinenya. DeepEval: framework evaluasi dengan 14+ metrik + integrasi CI + dataset sintetis — lebih `baterai termasuk`. LangSmith: platform tracing + evaluasi + dataset management — kuat saat kamu sudah di ekosistem LangChain dan butuh kolaborasi tim. Pilihannya bukan `mana yang terbaik` melainkan `di mana timmu sudah berada`: sudah pakai LangSmith → pakai evaluasinya; butuh metrik murni di CI → RAGAS/DeepEval.",
        "💡 Intuisi: judge itu seperti juri lomba masak — bagus untuk menilai `presentasi`, buruk untuk menilai `apakah bahan-bahannya benar`. Jangan minta juri presentasi memutuskan apakah dagingnya basi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk use case keuangan/regulasi, hasil evaluasi adalah bukti kepatuhan: simpan metrik per rilis + golden dataset versinya sebagai artefak audit. Saat regulator atau auditor bertanya `bagaimana kamu tahu versi baru tidak lebih buruk`, jawabannya adalah riwayat gerbang CI — bukan `kami sudah mengujinya`.",
      },
      reference: "Trace = tambang kasus evaluasi. Judge = untuk subjektif saja, harus dievaluasi juga.",
    },
    {
      id: "lab-metrik",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: hitung faithfulness & context precision",
      prose: [
        "Empat kasus evaluasi tertanam di bawah. Tiap kasus: daftar klaim jawaban, klaim mana yang didukung konteks, chunk yang terambil, dan chunk mana yang relevan.",
        "Tugasmu: (1) hitung `faith` = faithfulness per kasus dan `rata_faith`; (2) hitung `prec` = context precision per kasus dan `rata_prec`; (3) kumpulkan `gagal` = id kasus dengan faithfulness < 0,5 — kasus yang wajib masuk backlog perbaikan.",
        "Coba eksplorasi: ubah ambang di `gagal` menjadi < 0,7 — kasus mana yang ikut masuk? Itulah cara membaca sensitivitas ambang: ambang menentukan workload perbaikan, bukan kualitas model.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `faith` (list per kasus) dan `rata_faith`" },
        { id: "t2", text: "Hitung `prec` (list per kasus) dan `rata_prec`" },
        { id: "t3", text: "Kumpulkan `gagal` = id kasus dengan faithfulness < 0,5" },
      ],
      expected: "rata_faith=0.729 rata_prec=0.708 kasus perlu perbaikan: [3]",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjumlahkan lalu lupa membagi (rata-rata), atau memakai `len(ambil)` untuk faithfulness. Faithfulness = dukung/klaim (soal jawaban), precision = relevan/ambil (soal retrieval). Dua penyebut berbeda untuk dua kegagalan berbeda.",
      },
      hints: [
        "faithfulness kasus = len(k['dukung']) / len(k['klaim']).",
        "precision kasus = len(k['relevan']) / len(k['ambil']).",
        "gagal = [k['id'] for k in KASUS if ... < 0.5].",
      ],
      code: {
        starter: `# 4 kasus evaluasi RAG. JANGAN UBAH data ini.
KASUS = [
    {"id": 1, "klaim": ["a1", "a2", "a3"], "dukung": ["a1", "a3"], "ambil": [1, 2, 3], "relevan": [1, 3]},
    {"id": 2, "klaim": ["b1", "b2"], "dukung": ["b1", "b2"], "ambil": [2, 4], "relevan": [2]},
    {"id": 3, "klaim": ["c1", "c2", "c3", "c4"], "dukung": ["c2"], "ambil": [5], "relevan": [5]},
    {"id": 4, "klaim": ["d1"], "dukung": ["d1"], "ambil": [6, 7, 8], "relevan": [6, 7]},
]

# TULIS KODEMU: faithfulness & precision per kasus
faith =
prec =
rata_faith =
rata_prec =
gagal =

print(f"faithfulness: {[round(f, 2) for f in faith]} rata={rata_faith:.3f}")
print(f"precision: {[round(p, 2) for p in prec]} rata={rata_prec:.3f}")
print(f"kasus perlu perbaikan: {gagal}")`,
        lockLines: 8,
        solution: `# 4 kasus evaluasi RAG. JANGAN UBAH data ini.
KASUS = [
    {"id": 1, "klaim": ["a1", "a2", "a3"], "dukung": ["a1", "a3"], "ambil": [1, 2, 3], "relevan": [1, 3]},
    {"id": 2, "klaim": ["b1", "b2"], "dukung": ["b1", "b2"], "ambil": [2, 4], "relevan": [2]},
    {"id": 3, "klaim": ["c1", "c2", "c3", "c4"], "dukung": ["c2"], "ambil": [5], "relevan": [5]},
    {"id": 4, "klaim": ["d1"], "dukung": ["d1"], "ambil": [6, 7, 8], "relevan": [6, 7]},
]

# TULIS KODEMU: faithfulness & precision per kasus
faith = [len(k["dukung"]) / len(k["klaim"]) for k in KASUS]
prec = [len(k["relevan"]) / len(k["ambil"]) for k in KASUS]
rata_faith = sum(faith) / len(faith)
rata_prec = sum(prec) / len(prec)
gagal = [k["id"] for k in KASUS if len(k["dukung"]) / len(k["klaim"]) < 0.5]

print(f"faithfulness: {[round(f, 2) for f in faith]} rata={rata_faith:.3f}")
print(f"precision: {[round(p, 2) for p in prec]} rata={rata_prec:.3f}")
print(f"kasus perlu perbaikan: {gagal}")`,
        checks: [
          { kind: "defined", task: "t1", name: "faith", label: "`faith` terdefinisi", msg: "Hitung faithfulness tiap kasus sebagai list." },
          { kind: "equal", task: "t1", name: "rata_faith", value: 0.729, tol: 0.002, label: "`rata_faith` ≈ 0,729", msg: "(0,667+1,0+0,25+1,0)/4 = 0,729." },
          { kind: "equal", task: "t2", name: "rata_prec", value: 0.708, tol: 0.002, label: "`rata_prec` ≈ 0,708", msg: "(0,667+0,5+1,0+0,667)/4 = 0,708." },
          { kind: "equal", task: "t3", name: "gagal", value: [3], label: "`gagal` = [3]", msg: "Hanya kasus 3 yang faithfulness-nya (0,25) di bawah 0,5." },
          { kind: "stdout_matches", task: "t1", pattern: "rata=0\\.729", label: "Cetak rata faithfulness", msg: "Samakan format: rata=0.729." },
          { kind: "stdout_matches", task: "t3", pattern: "kasus perlu perbaikan: \\[3\\]", label: "Cetak daftar kasus gagal", msg: "Samakan format: kasus perlu perbaikan: [3]." },
        ],
      },
      reference: "Dua metrik, dua penyebut, dua pemilik masalah: faithfulness → generator, precision → retriever.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Bangun atau beli, dan seberapa dalam",
      prose: [
        "Lima skenario. Satu: tim kecil, RAG pertama, butuh evaluasi minggu ini → DeepEval (baterai termasuk: metrik + CI + dataset sintetis) atau RAGAS + skrip CI sendiri; jangan bangun framework dari nol. Dua: sudah pakai LangChain/LangSmith untuk tracing → pakai evaluasi LangSmith (dataset management + kolaborasi); datanya sudah di sana.",
        "Tiga: kebutuhan regulasi/audit ketat → metrik yang bisa dihitung deterministik (faithfulness, precision/recall) sebagai gerbang wajib + judge hanya untuk aspek subjektif; simpan artefak per rilis. Empat: rilis tiap hari → evaluasi berjenjang (30 kasus cepat per commit, penuh per rilis) + cache; evaluasi yang lebih lambat dari siklus rilis akan dilewati. Lima: skor judge naik tapi metrik groundedness turun → TAHAN rilis dan investigasi (pelajaran cerita tadi); judge tidak pernah mengalahkan metrik terhitung.",
        "Aturan praktis 10 detik: `butuh cepat = DeepEval; sudah di LangSmith = pakai itu; butuh audit = metrik terhitung + artefak; rilis harian = berjenjang; judge vs metrik konflik = metrik menang`.",
      ],
      figure: {
        svg: EVAL_PIPE_SVG,
        alt: "Pipeline evaluasi: dataset emas, jalankan RAG, hitung metrik faithfulness dan precision, gerbang CI lolos atau tahan rilis.",
        caption: "Cara membaca: alir kiri ke kanan — dataset tetap, eksekusi, metrik, keputusan. Interpretasi: yang membuat evaluasi bisa dipercaya bukan metriknya yang canggih, melainkan datasetnya yang tetap dan ambangnya yang ditulis sebelum hasil keluar.",
      },
      tasks: [],
      note: {
        title: "Mitos: evaluasi sekali di awal cukup",
        type: "pitfall",
        body: "Yang benar: setiap rilis (prompt, model, embedding, index) bisa menggeser perilaku. Evaluasi adalah pajak tiap rilis — bukan biaya satu kali. Tim yang `sudah dievaluasi bulan lalu` sedang mengoperasikan keyakinan, bukan sistem.",
      },
      reference: "Pilih tool sesuai posisi tim. Evaluasi = pajak tiap rilis.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "120 kasus, 2 jam, dan rilis yang tertahan",
      prose: [
        "Bank Artha pasca-insiden: golden dataset 120 kasus. Rilis kandidat: prompt baru. Hasil CI: faithfulness 0,81 → 0,75 (turun 6 poin, ambang 3), context precision 0,72 → 0,74 (naik), skor judge 82 → 88 (naik), biaya evaluasi Rp1,8 juta per run penuh, waktu run 2 jam.",
        "Pertanyaan analisis: (a) loloskan atau tahan rilis ini? dengan alasan memakai aturan gerbang; (b) jika tim produk menekan (`judge naik, precision naik, cuma faithfulness yang turun dikit`), apa jawabanmu berbasis data; (c) rancang evaluasi berjenjang agar run harian < 20 menit tanpa kehilangan kemampuan menangkap regresi faithfulness.",
        "Pembahasan: (a) TAHAN — faithfulness turun 6 poin melewati ambang 3; aturan ditulis sebelum hasil, tidak dinegosiasi sesudahnya. (b) `dikit` = 6 poin = ~7 kasus tambahan berhalusinasi per 120; judge dan precision mengukur hal lain (kefasihan, retrieval) — tidak menebus ketidaksetiaan pada konteks. Data yang benar: 3 metrik vs 1 metrik, bukan `mayoritas menang`. (c) 30 kasus cepat: pilih 30 kasus dengan faithfulness historis paling sensitif (pernah gagal/nyaris gagal) → run 20 menit; run penuh 120 tiap rilis mingguan + tiap perubahan embedding/index; cache jawaban untuk 90 kasus stabil.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan `tahan rilis` yang tercatat dengan angka adalah perisai tim saat insiden: `kami menahan karena faithfulness turun 6 poin pada 12 Maret` jauh lebih kuat dari `kami merasa belum siap`. Dokumentasikan setiap penahanan sebagai artefak.",
      },
      reference: "Ambang ditulis dulu, hasil kemudian. Yang turun melewati ambang = tahan, tanpa negosiasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Faithfulness = klaim didukung / total klaim; precision@k = relevan terambil / k; recall = relevan terambil / seharusnya.",
        "Faithfulness rendah + precision tinggi → salahkan generator; sebaliknya → salahkan retriever.",
        "Golden dataset: dikunci, meniru produksi, 50–200 kasus; gerbang CI dengan ambang pra-tulis.",
        "Trace = tambang kasus evaluasi; judge hanya untuk aspek subjektif dan harus dievaluasi juga.",
        "RAGAS = metrik untuk CI; DeepEval = baterai termasuk; LangSmith = tracing + evaluasi terpadu.",
        "Evaluasi = pajak tiap rilis; judge tidak pernah mengalahkan metrik terhitung.",
      ],
      next: { label: "LLMOps21 — Gateway LLM & Semantic Caching", href: "/learn/llmops21-gateway-semantic-caching" },
      quiz: [
        {
          q: "Jawaban RAG: 4 klaim, hanya 1 yang didukung konteks. Faithfulness-nya dan vonisnya?",
          options: [
            { text: "0,75 — bagus", why: "Terbalik: 1/4 = 0,25, bukan 0,75." },
            { text: "0,25 — kritis, jawaban fasih tapi tidak berdasar", why: "1 didukung dari 4 klaim = 0,25. Ini pola `halusinasi meyakinkan` — prioritas perbaikan tertinggi.", correct: true },
            { text: "0,25 — tidak masalah selama fasih", why: "Kefasihan tanpa dukungan = misinformasi yang meyakinkan; justru paling berbahaya." },
            { text: "Tidak bisa dihitung tanpa LLM judge", why: "Faithfulness bisa dihitung deterministik dari klaim vs konteks — tidak butuh judge." },
          ],
        },
        {
          q: "Faithfulness 0,9 tetapi context precision 0,3. Ke mana perbaikan diarahkan?",
          options: [
            { text: "Ke generator/prompt", why: "Generator sudah setia pada konteks (0,9) — bukan dia masalahnya." },
            { text: "Ke retriever/embedding: jawaban benar tapi beruntung", why: "Konteks yang diambil mostly tidak relevan; jawaban benar kali ini adalah keberuntungan. Lain kali bisa salah.", correct: true },
            { text: "Ke model yang lebih besar", why: "Model lebih besar tidak memperbaiki retrieval yang buruk." },
            { text: "Tidak perlu perbaikan — faithfulness sudah tinggi", why: "Precision 0,3 berarti fondasinya rapuh; ini bom waktu." },
          ],
        },
        {
          q: "Tim ingin menambah 50 kasus `yang kemarin gagal` ke golden dataset tanpa review. Mengapa ini buruk?",
          options: [
            { text: "Karena dataset menjadi terlalu besar", why: "Ukuran bukan masalah utama; 170 kasus masih wajar." },
            { text: "Karena dataset berhenti menjadi cermin kebutuhan pengguna dan menjadi cermin bug kemarin", why: "Golden dataset harus meniru distribusi produksi dan dikunci. Menambah kasus reaktif tanpa review menggesernya menjadi overfit ke insiden terakhir.", correct: true },
            { text: "Karena menambah biaya evaluasi", why: "Biaya naik sedikit, tetapi itu bukan alasan utamanya." },
            { text: "Karena LLM tidak bisa menjawab 170 pertanyaan", why: "Jumlah pertanyaan bukan batasan teknis." },
          ],
        },
        {
          q: "Kapan LLM-as-judge boleh menjadi SATU-SATUNYA penentu lolos rilis?",
          options: [
            { text: "Tidak pernah — untuk faithfulness selalu ada metrik terhitung", why: "Judge mengukur aspek subjektif; faithfulness/precision bisa dihitung deterministik dan tidak boleh diserahkan ke opini model.", correct: true },
            { text: "Bila judge-nya model terbaru yang paling pintar", why: "Kepintaran tidak mengubah sifatnya: judge menilai, bukan menghitung. Bias keluarga-model tetap ada." },
            { text: "Bila skornya di atas 90", why: "Skor tinggi dari alat yang salah tidak menjadi benar." },
            { text: "Bila tidak ada waktu membangun metrik", why: "Tidak ada waktu = alasan menunda rilis, bukan alasan memakai alat yang salah." },
          ],
        },
        {
          q: "Rilis harian dengan evaluasi penuh 2 jam. Strategi yang benar?",
          options: [
            { text: "Evaluasi mingguan saja", why: "Rilis harian tanpa evaluasi harian = 6 hari buta per minggu." },
            { text: "Evaluasi berjenjang: 30 kasus sensitif per commit, penuh per rilis besar", why: "Kasus yang historisnya sensitif menangkap regresi dengan cepat; run penuh tetap ada untuk perubahan besar. Evaluasi harus lebih cepat dari siklus rilis.", correct: true },
            { text: "Kurangi golden dataset menjadi 10 kasus", why: "10 kasus tidak mewakili distribusi produksi; regresi lolos diam-diam." },
            { text: "Minta developer menilai manual tiap rilis", why: "Tidak scalable dan tidak konsisten antar penilai." },
          ],
        },
        {
          q: "Trace produksi menunjukkan satu pola chunk yang selalu tidak relevan. Tindak lanjut yang benar?",
          options: [
            { text: "Hapus chunk itu dari index", why: "Menghapus gejala tanpa memahami sebab; pola yang sama akan muncul di chunk lain." },
            { text: "Tambahkan kasusnya ke golden dataset + investigasi embedding/chunking di balik pola itu", why: "Trace adalah tambang evaluasi: pola sistematis = sinyal masalah retriever (embedding/chunking), dan kasusnya diabadikan agar regresi tertangkap.", correct: true },
            { text: "Abaikan — satu pola tidak signifikan", why: "Pola yang sistematis justru paling signifikan: ia terjadi terus-menerus." },
            { text: "Naikkan k (ambil lebih banyak chunk)", why: "Menambah chunk tanpa memperbaiki relevansi hanya menambah noise dan biaya." },
          ],
        },
      ],
    },
  ],
};
