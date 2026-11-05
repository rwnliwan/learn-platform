import type { V2Mission } from "../lib/types";

// ── MISI RAG: Jawaban Tanpa Jejak ───────────────────────────────────────
// M2 — AI Engineering Misi A (solo). Dataset SINTETIS (seed 42, generator
// terdokumentasi di METODE.md): korpus 20 chunk + 12 query + retrieval k=5
// + ground truth + 12 jawaban bersitasi. Kebocoran prompt, sitasi hantu,
// dan query training DITANAM SENGAJA sebagai bahan audit.
// File: public/misi/misi-grounding-rag/*.csv (5 file, 7141 byte).

const BASE = "/misi/misi-grounding-rag";

export const misiRag: V2Mission = {
  slug: "misi-grounding-rag",
  track: "AI Engineering",
  module: "Misi",
  title: "Misi RAG: Jawaban Tanpa Jejak",
  estMinutes: 165,
  role: "AI engineer — auditor independen pipeline RAG",
  client:
    "CTO — vendor RAG mengklaim pipeline-nya “siap produksi” dengan semua metrik hijau; kontrak 3 tahun menunggu hasil audit independen darimu",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Jawabannya meyakinkan. Sitasinya tidak ada.",
      prose: [],
      tasks: [],
      briefing: {
        role: "AI engineer yang disewa sebagai auditor independen — bukan tim vendor, bukan tim yang membangun pipeline",
        client:
          "CTO sebuah perusahaan jasa. Vendor RAG mendemokan chatbot kebijakan internal: setiap pertanyaan dijawab cepat, rapi, lengkap dengan sitasi [CH-001], [CH-014]. Deck evaluasi mereka hijau semua: recall@5 = 0,83, “tingkat keterlacakan 95%”. CTO hampir menandatangani kontrak 3 tahun — tapi tim legal iseng mengecek satu jawaban soal cuti melahirkan yang mengutip [CH-904]. Di korpus perusahaan, chunk CH-904 tidak pernah ada. Jawabannya terasa benar — tapi tak terlacak. Kamu dipanggil sebelum tinta kontrak mengering.",
        story: [
          "Ruang demo vendor, Selasa 10:00. Di layar, chatbot menjawab “Berapa anggaran training tahunan saya?” dalam dua detik, lengkap dengan sitasi bernomor. CTO mengangguk-angguk. “Lihat,” kata account manager vendor, “setiap klaim bisa dilacak ke dokumen sumber. Recall@5 kami 0,83 — di atas standar industri.” Tidak ada yang bertanya apa arti angka itu, atau ke dokumen mana sebenarnya sitasi-sitasi itu menunjuk.",
          "Dua hari kemudian, staf legal — yang kebetulan sedang cuti melahirkan — membaca jawaban bot soal haknya. Jawabannya meyakinkan dan mengutip [CH-904]. Ia mencari CH-904 di knowledge base. Tidak ada. Ia mencari di arsip lama. Tidak ada. Ia bertanya ke vendor, dan jawabannya adalah keheningan yang sangat mahal: model itu mengarang nomor sitasi. Formatnya benar, isinya fiktif.",
          "Kamu dipanggil sebagai auditor independen dengan akses ke data mentah: korpus, query, hasil retrieval, dan jawaban model. Tugasmu: ukur sendiri recall dan grounding-nya, temukan jawaban-jawaban tanpa dukungan, bedah laporan evaluasi vendor yang mengklaim “semua hijau”, lalu tulis laporan evaluasi yang berani bilang “jangan tanda tangani” kalau buktinya berkata begitu.",
        ],
        objectives: [
          "Menghitung recall@5 dan citation grounding rate dari data mentah (bukan dari klaim deck vendor), lalu mengidentifikasi jawaban tanpa dukungan passage.",
          "Menyaring query ber-grounding rendah dengan SQL dan memilih intervensi pipeline: naikkan k + tulis ulang query, re-chunk korpus, atau terima dengan ambang eksplisit.",
          "Menemukan minimal 3 sabotase di laporan evaluasi vendor dan menulis laporan evaluasi RAG dengan rekomendasi yang bisa dipertahankan di depan CTO.",
        ],
        prereqSummary:
          "RAG (retrieval-augmented generation) = model bahasa menjawab pertanyaan dengan bekal potongan dokumen (chunk) yang diambil sistem retrieval. Kualitasnya diukur dari dua sisi: recall@k — dari semua chunk yang relevan, berapa banyak yang berhasil masuk k teratas retrieval; dan citation grounding rate — dari semua ID chunk yang dikutip jawaban, berapa banyak yang benar-benar ada di korpus dan mendukung klaim. Evaluasi yang jujur memakai query yang belum pernah dipakai saat tuning, ambang yang tidak digeser diam-diam, dan ID sitasi yang bisa diverifikasi ke korpus. Di misi ini kamu menghitung semuanya dari data mentah.",
        datasetNote:
          "Sumber: SINTETIS — dibangkitkan dengan skrip generator seed 42 (lihat METODE.md di folder yang sama).\nKorpus: 20 chunk kebijakan fiktif “PT Cakrawala Fiktif” (corpus.csv). Query: 12 pertanyaan karyawan (queries.csv).\nRetrieval: 60 baris hasil retrieval k=5 (retrieval.csv). Ground truth: 15 pasangan query–chunk relevan (ground_truth.csv).\nJawaban: 12 jawaban model beserta sitasi (answers.csv). Total ±7 KB.\nKejujuran: ini BUKAN log produksi — kebocoran prompt, sitasi hantu, dan query training DITANAM SENGAJA sebagai bahan audit. Jangan pakai sebagai benchmark metode RAG.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Lima file, satu kebohongan yang rapi",
      prose: [
        "`corpus.csv` adalah kebenaran: 20 chunk (CH-001 s.d. CH-020), masing-masing satu kebijakan — cuti, WFH, reimbursement, phishing, sampai whistleblowing. Setiap ID sitasi yang jujur HARUS menunjuk ke salah satu dari 20 chunk ini. Tidak ada CH-021, tidak ada CH-904.",
        "`queries.csv` berisi 12 pertanyaan karyawan. `retrieval.csv` mencatat 5 chunk teratas yang diambil untuk tiap query (kolom rank). `ground_truth.csv` mencatat chunk mana yang sebenarnya relevan untuk tiap query — inilah “kunci jawaban” retrieval. `answers.csv` berisi jawaban model dan kolom sitasi: daftar ID chunk yang diklaim mendukung jawaban, dipisahkan titik koma.",
        "Aturan main: (1) recall dihitung dari retrieval vs ground truth, bukan dari klaim vendor; (2) grounding dihitung dari sitasi vs korpus — ID yang tidak ada di korpus = tidak terdukung, titik; (3) jawaban tanpa sitasi = grounding 0.",
      ],
      tasks: [
        { id: "t1", text: "Buka `corpus.csv`: catat rentang ID chunk yang valid" },
        { id: "t2", text: "Buka `answers.csv`: temukan baris dengan sitasi di luar rentang ID korpus" },
      ],
      note: {
        title: "Miskonsepsi #1: sitasi = kebenaran",
        type: "pitfall",
        body: "“Jawabannya ada sitasinya, pasti benar.” SALAH — dan ini kesalahpahaman yang paling mahal di era RAG. Sitasi hanyalah KLAIM keterlacakan: format [CH-904] terlihat meyakinkan, tapi ID-nya bisa dikarang model. Audit sitasi bukan mengagumi kerapian format, melainkan memverifikasi setiap ID ke korpus: ada atau tidak, mendukung atau tidak. Jawaban tanpa jejak yang bisa diverifikasi = jawaban tanpa bukti, seberapa pun meyakinkannya.",
      },
      reference:
        "corpus.csv (20 chunk, kebenaran) vs answers.csv (12 jawaban, klaim). Recall dari retrieval × ground truth; grounding dari sitasi × korpus.",
    },
    {
      id: "lab-rag",
      eyebrow: "Langkah 3 · Lab 1 — Audit recall & grounding",
      title: "Hitung sendiri, jangan percaya deck",
      prose: [
        "Dua metrik, dua sisi kejujuran pipeline. Recall@5 satu query = (chunk relevan yang masuk 5 teratas) / (seluruh chunk relevan query itu). Contoh konkret: Q-02 punya 2 chunk relevan (CH-003, CH-019) dan keduanya ter-retrieve → recall = 2/2 = 1,00. Q-09 punya 1 chunk relevan (CH-009) yang TIDAK ter-retrieve → recall = 0/1 = 0,00. Rata-ratakan ke-12 query untuk mean recall@5.",
        "Citation grounding rate satu query = (sitasi yang ID-nya ada di korpus) / (seluruh sitasi). Contoh: Q-04 mengutip CH-006 dan CH-904 — hanya CH-006 yang ada → grounding = 1/2 = 0,50. Q-12 tidak mengutip apa pun → grounding = 0,00. Rata-ratakan untuk mean grounding rate. Terakhir: daftarkan query dengan grounding di bawah 1,00 — merekalah “jawaban tanpa jejak”.",
      ],
      tasks: [
        { id: "t1", text: "Muat 5 file CSV; hitung `n_query` dan `n_chunk`" },
        { id: "t2", text: "Hitung `recall_at_5` per query dan `mean_recall_5`" },
        { id: "t3", text: "Hitung `grounding_rate` per query, `mean_grounding`, dan `daftar_tak_terdukung` (grounding < 1,0)" },
      ],
      expected:
        "n_query=12, n_chunk=20, mean_recall_5=0,8333, mean_grounding=0,75, n_tak_terdukung=4 — query tanpa dukungan penuh: Q-04, Q-09, Q-11, Q-12",
      formula: String.raw`G = \frac{n_{didukung}}{n_{sitasi}}`,
      formulaNote:
        "G = citation grounding rate satu query; n_didukung = jumlah ID sitasi yang benar-benar ada di korpus (CH-001 s.d. CH-020); n_sitasi = jumlah seluruh ID yang dikutip jawaban. G = 1,00 artinya setiap sitasi terlacak; G = 0,50 (Q-04: 1 dari 2 didukung) artinya separuh “bukti” jawaban itu fiktif; jawaban tanpa sitasi (Q-12) didefinisikan G = 0,00 — tidak ada jejak sama sekali.",
      note: {
        title: "Miskonsepsi #2: recall tinggi = jawaban bagus",
        type: "pitfall",
        body: "Insting berkata “retrieval ketemu semua yang relevan, berarti jawaban pasti bagus”. Data berkata lain: Q-11 punya recall 1,00 — chunk yang benar ketemu semua — tapi grounding-nya 0,50 karena jawabannya mengutip CH-923 yang tidak ada. Recall hanya mengukur retrieval MENEMUKAN bahan; grounding mengukur jawaban MEMAKAI bahan itu dengan jujur. Pipeline bisa sempurna di sisi pertama dan berbohong di sisi kedua.",
      },
      hints: [
        "Muat CSV: `pd.read_csv(open_url(BASE + \"/corpus.csv\"))` — kolom sitasi di answers.csv punya sel kosong; atasi dengan `.fillna(\"\")`.",
        "Ubah kolom menjadi dict: `truth.groupby(\"query_id\")[\"chunk_id\"].apply(set).to_dict()` — pola yang sama untuk retrieval.",
        "recall satu query = ukuran irisan (relevan ∩ ter-retrieve) dibagi jumlah relevan.",
        "grounding: pecah sitasi dengan `split(\";\")`, hitung yang anggotanya `corpus_ids`; sitasi kosong → 0,0.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-grounding-rag\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "corpus = pd.read_csv(open_url(BASE + \"/corpus.csv\"))",
          "queries = pd.read_csv(open_url(BASE + \"/queries.csv\"))",
          "retrieval = pd.read_csv(open_url(BASE + \"/retrieval.csv\"))",
          "truth = pd.read_csv(open_url(BASE + \"/ground_truth.csv\"))",
          "answers = pd.read_csv(open_url(BASE + \"/answers.csv\")).fillna(\"\")",
          "",
          "n_query = ...",
          "n_chunk = ...",
          "",
          "corpus_ids = ...",
          "rel = ...   # dict: query_id -> set chunk RELEVAN",
          "ret = ...   # dict: query_id -> set chunk TER-RETRIEVE",
          "",
          "recall_at_5 = ...   # dict: query_id -> recall",
          "mean_recall_5 = ...",
          "",
          "def grounding_rate(sitasi):",
          "    ...",
          "",
          "g = ...   # dict: query_id -> grounding rate",
          "mean_grounding = ...",
          "tak = ...   # list query_id dengan grounding < 1.0, urut abjad",
          "n_tak_terdukung = ...",
          "daftar_tak_terdukung = ...   # gabung dengan \",\"",
          "",
          "print(\"query:\", n_query, \"| chunk:\", n_chunk)",
          "print(\"mean recall@5:\", round(mean_recall_5, 4))",
          "print(\"mean grounding:\", round(mean_grounding, 4))",
          "print(\"tak terdukung:\", n_tak_terdukung, daftar_tak_terdukung)",
        ].join("\n"),
        lockLines: 12,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-grounding-rag\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "corpus = pd.read_csv(open_url(BASE + \"/corpus.csv\"))",
          "queries = pd.read_csv(open_url(BASE + \"/queries.csv\"))",
          "retrieval = pd.read_csv(open_url(BASE + \"/retrieval.csv\"))",
          "truth = pd.read_csv(open_url(BASE + \"/ground_truth.csv\"))",
          "answers = pd.read_csv(open_url(BASE + \"/answers.csv\")).fillna(\"\")",
          "",
          "n_query = len(queries)",
          "n_chunk = len(corpus)",
          "",
          "corpus_ids = set(corpus[\"chunk_id\"])",
          "rel = truth.groupby(\"query_id\")[\"chunk_id\"].apply(set).to_dict()",
          "ret = retrieval.groupby(\"query_id\")[\"chunk_id\"].apply(set).to_dict()",
          "",
          "recall_at_5 = {q: len(rel[q] & ret.get(q, set())) / len(rel[q]) for q in rel}",
          "mean_recall_5 = sum(recall_at_5.values()) / len(recall_at_5)",
          "",
          "def grounding_rate(sitasi):",
          "    cited = [s.strip() for s in str(sitasi).split(\";\") if s.strip()]",
          "    if not cited:",
          "        return 0.0",
          "    didukung = sum(1 for c in cited if c in corpus_ids)",
          "    return didukung / len(cited)",
          "",
          "g = {r[\"query_id\"]: grounding_rate(r[\"sitasi\"]) for _, r in answers.iterrows()}",
          "mean_grounding = sum(g.values()) / len(g)",
          "tak = sorted(q for q, v in g.items() if v < 1.0)",
          "n_tak_terdukung = len(tak)",
          "daftar_tak_terdukung = \",\".join(tak)",
          "",
          "print(\"query:\", n_query, \"| chunk:\", n_chunk)",
          "print(\"mean recall@5:\", round(mean_recall_5, 4))",
          "print(\"mean grounding:\", round(mean_grounding, 4))",
          "print(\"tak terdukung:\", n_tak_terdukung, daftar_tak_terdukung)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "data termuat", name: "answers", msg: "answers harus berisi DataFrame jawaban model." },
          { kind: "equal", task: "t1", label: "`n_query` = 12", name: "n_query", value: 12, msg: "queries.csv berisi 12 pertanyaan karyawan." },
          { kind: "equal", task: "t1", label: "`n_chunk` = 20", name: "n_chunk", value: 20, msg: "Korpus valid hanya CH-001 s.d. CH-020." },
          { kind: "equal", task: "t2", label: "`mean_recall_5` ≈ 0,8333", name: "mean_recall_5", value: 0.8333, tol: 0.01, msg: "Rata-rata recall@5 dari 12 query. Irisan relevan ∩ ter-retrieve dibagi jumlah relevan." },
          { kind: "equal", task: "t3", label: "`mean_grounding` ≈ 0,75", name: "mean_grounding", value: 0.75, tol: 0.01, msg: "Rata-rata grounding rate. Sitasi kosong = 0,0; ID di luar korpus = tidak didukung." },
          { kind: "equal", task: "t3", label: "`n_tak_terdukung` = 4", name: "n_tak_terdukung", value: 4, msg: "Query dengan grounding < 1,0: tiga sitasi hantu + satu tanpa sitasi." },
          { kind: "equal", task: "t3", label: "daftar = Q-04,Q-09,Q-11,Q-12", name: "daftar_tak_terdukung", value: "Q-04,Q-09,Q-11,Q-12", msg: "Urut abjad, gabung dengan koma tanpa spasi." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Saring query bermasalah",
      title: "Mana yang harus diblokir malam ini juga?",
      prose: [
        "CTO butuh daftar tindakan, bukan rata-rata. Dari tabel ringkas `eval_rag(query_id, recall_at_5, grounding_rate, n_cited, n_tak_terdukung)`, saring query dengan grounding di bawah 0,80 — merekalah kandidat untuk diblokir atau ditangani manual sampai pipeline diperbaiki. Urutkan dari grounding terendah: yang paling tidak terlacak ditangani pertama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: query ber-grounding < 0,80, urut dari yang terendah" },
      ],
      expected: "4 baris — Q-09 (0,00), Q-12 (0,00), Q-04 (0,50), Q-11 (0,50)",
      sqlLab: {
        task: "Saring query BERBAHAYA: grounding_rate di bawah 0,80. Tampilkan query_id, grounding_rate, n_tak_terdukung — urut dari grounding terendah.",
        schema: "CREATE TABLE eval_rag (query_id TEXT, recall_at_5 REAL, grounding_rate REAL, n_cited INT, n_tak_terdukung INT);",
        seedData: [
          "INSERT INTO eval_rag VALUES",
          "('Q-01',1.0,1.0,1,0),",
          "('Q-02',1.0,1.0,2,0),",
          "('Q-03',1.0,1.0,1,0),",
          "('Q-04',1.0,0.5,2,1),",
          "('Q-05',1.0,1.0,2,0),",
          "('Q-06',1.0,1.0,1,0),",
          "('Q-07',1.0,1.0,1,0),",
          "('Q-08',1.0,1.0,2,0),",
          "('Q-09',0.0,0.0,1,1),",
          "('Q-10',1.0,1.0,1,0),",
          "('Q-11',1.0,0.5,2,1),",
          "('Q-12',0.0,0.0,0,0);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT query_id, grounding_rate, n_tak_terdukung\nFROM eval_rag\n",
        solution: [
          "SELECT query_id, grounding_rate, n_tak_terdukung",
          "FROM eval_rag",
          "WHERE grounding_rate < 0.80",
          "ORDER BY grounding_rate, query_id;",
        ].join("\n"),
        expectedColumns: ["query_id", "grounding_rate", "n_tak_terdukung"],
        expectedRows: [
          ["Q-09", 0.0, 1],
          ["Q-12", 0.0, 0],
          ["Q-04", 0.5, 1],
          ["Q-11", 0.5, 1],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiRag;

// ── lanjutan misiRag: langkah 5–12 ──────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_RAG: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Pipeline ini mau kamu apakan sebelum kontrak ditandatangani?",
    prose: [
      "Angkanya sudah di tangan: mean recall@5 = 0,8333 — lumayan; mean grounding = 0,75 — berlubang; 4 dari 12 jawaban tidak terlacak penuh. CTO menunggumu di ruang rapat dalam satu jam dengan satu pertanyaan: “Jadi, tanda tangan atau tidak?” Tiga jalan ada di depanmu, dan tiap jalan mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke CTO atas pipeline RAG vendor ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-naikkan-k",
          label: "Perbaiki retrieval: naikkan k ke 10 + tulis ulang query yang gagal",
          rationale:
            "Dua query punya recall 0,00 — retrieval-nya yang buta. k lebih besar + query rewriting menaikkan peluang chunk relevan ketemu, tanpa menyentuh arsitektur.",
          nextStepId: "kons-naikkan-k",
          consequenceNote:
            "Recall naik — tapi sitasi hantu (CH-904, CH-917, CH-923) TIDAK hilang. k lebih besar memberi model lebih banyak bahan, bukan kejujuran lebih. Masalah grounding ternyata bukan masalah retrieval.",
        },
        {
          id: "opt-rechunk",
          label: "Re-chunk korpus: potong per dokumen utuh dengan ID stabil",
          rationale:
            "Sitasi hantu menandakan model mengarang ID — chunk yang lebih besar dan ber-ID stabil mengurangi ruang halusinasi sitasi, sekaligus memperbaiki konteks.",
          nextStepId: "kons-rechunk",
          consequenceNote:
            "Sitasi hantu berkurang — tapi recall turun karena chunk besar lebih sulit di-rank tepat, dan biaya embedding naik 3x. Kamu menukar satu masalah dengan masalah lain.",
        },
        {
          id: "opt-terima",
          label: "Terima bersyarat: ambang grounding 0,80 + blokir 4 query + pantau mingguan",
          rationale:
            "8 dari 12 query sudah sempurna. Blokir 4 yang bermasalah, tetapkan ambang 0,80 yang eksplisit, dan pantau — kontrak jalan tanpa menunda bisnis.",
          nextStepId: "kons-terima",
          consequenceNote:
            "Kontrak ditandatangani. Tiga bulan kemudian query baru bermunculan dengan pola sitasi hantu yang sama — ambang 0,80 menahannya di angka, tapi tidak pernah memperbaiki akarnya. Kamu membeli waktu, bukan solusi.",
        },
      ],
    },
  },
  {
    id: "kons-naikkan-k",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: perbaiki retrieval",
    prose: [
      "Vendor menaikkan k ke 10 dan menambahkan query rewriting. Recall@5 naik menjadi 0,94 — deck berikutnya terlihat lebih hijau. Q-09 dan Q-12 yang tadinya buta kini menemukan chunk relevan. CTO puas; tim vendor merayakan.",
      "Tapi di Lab 1 kamu sudah melihat polanya: Q-04 dan Q-11 punya recall 1,00 sejak awal — retrieval mereka sempurna — dan grounding mereka tetap 0,50. Sitasi hantu bukan gejala retrieval yang buta; itu gejala generator yang mengarang. Kamu memperbaiki mata pipeline, padahal yang berbohong adalah mulutnya. Pelajaran yang mahal: metrik yang naik belum tentu masalah yang sembuh.",
    ],
    tasks: [],
    note: {
      title: "Obati penyebab, bukan gejalanya",
      body: "Sebelum memilih intervensi, tanyakan: metrik mana yang sebenarnya rusak? Di sini recall 0,83 (lumayan) vs grounding 0,75 (berlubang) — masalahnya di generator, bukan retrieval. Intervensi yang salah sasaran membuat deck lebih hijau tanpa membuat jawaban lebih jujur.",
    },
  },
  {
    id: "kons-rechunk",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: re-chunk korpus",
    prose: [
      "Korpus di-chunk ulang per dokumen utuh dengan ID stabil. Sitasi hantu turun drastis — model lebih sulit mengarang ID ketika ID-nya panjang dan berpola dokumen. Laporan triwulan pertama mencatat grounding 0,91. Kemenangan terasa nyata.",
      "Lalu tagihan embedding datang: 3x lipat. Dan recall merosot ke 0,71 — chunk besar lebih sulit di-rank secara presisi, jawaban menjadi generik (“menurut dokumen kebijakan…” tanpa potongan spesifik). Kamu menukar presisi sitasi dengan presisi retrieval. Tidak ada opsi yang gratis — hanya trade-off yang kamu pahami vs yang tidak.",
    ],
    tasks: [],
    note: {
      title: "Setiap perbaikan punya harga",
      body: "Re-chunking bukan sihir: chunk besar = sitasi lebih stabil tapi retrieval lebih kasar + biaya lebih mahal. Keputusan arsitektur yang baik menyebutkan harganya di muka — di deliverable-mu, setiap rekomendasi wajib ditemani biaya dan efek sampingnya.",
    },
  },
  {
    id: "kons-terima",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: terima bersyarat",
    prose: [
      "Kontrak ditandatangani dengan adendum: ambang grounding 0,80, 4 query diblokir, monitoring mingguan. Bisnis jalan; CTO memujimu pragmatis. Tiga bulan pertama tenang — dashboard hijau, tidak ada insiden.",
      "Bulan keempat, tim support melaporkan pola baru: jawaban soal tunjangan mengutip [CH-940] — ID yang tidak ada. Pola sitasi hantu yang sama, query yang berbeda. Ambang 0,80 menahan angkanya tetap “lolos”, tapi tidak pernah menyentuh akarnya: generator yang dibiarkan mengarang. Kamu membeli waktu tiga bulan — dengan harga masalah yang sama, berbunga.",
    ],
    tasks: [],
    note: {
      title: "Ambang tanpa perbaikan akar = penundaan berbunga",
      body: "“Terima bersyarat” hanya bermakna bila syaratnya menyerang akar masalah (mis. constrained decoding agar model hanya boleh mengutip ID valid). Ambang monitoring saja = cara sopan untuk menunda. Di deliverable-mu, setiap opsi “terima” wajib ditemani apa yang diperbaiki, bukan hanya apa yang dipantau.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: laporan evaluasi yang “semua hijau” itu",
    prose: [
      "Sebelum menulis laporan evaluasi, satu misi audit. Di bawah ini 14 baris “Laporan Evaluasi Pipeline RAG — Q3” dari vendor, yang mengklaim semua metrik hijau dan layak produksi. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: mean recall@5 = 0,8333, mean grounding = 0,75, dan 4 query tanpa dukungan versi perhitunganmu sendiri.",
      "Tugasmu bukan sekadar menemukan sabotase — tapi memahami bahwa tiap sabotase adalah pola yang dipakai vendor nyata untuk membuat evaluasi terlihat bagus.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-grounding-rag-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Evaluasi Pipeline RAG Q3 dari vendor, yang menyatakan pipeline “siap produksi, semua metrik hijau”.",
      columns: ["Query", "Recall@5", "Sitasi", "Grounding", "Status vendor"],
      rows: [
        { rowId: 1, cells: { "Query": "Q-01", "Recall@5": "1,00", "Sitasi": "CH-001", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Klaim vendor", value: "Hijau" }] },
        { rowId: 2, cells: { "Query": "Q-02", "Recall@5": "1,00", "Sitasi": "CH-003; CH-019", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Prompt", value: "Memuat passage CH-003 (jawaban)" }] },
        { rowId: 3, cells: { "Query": "Q-03", "Recall@5": "1,00", "Sitasi": "CH-004", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Klaim vendor", value: "Hijau" }] },
        { rowId: 4, cells: { "Query": "Q-04", "Recall@5": "1,00", "Sitasi": "CH-006; CH-904", "Grounding": "0,50", "Status vendor": "Lolos" }, claims: [{ label: "Korpus", value: "Hanya CH-001 s.d. CH-020 — CH-904 tidak ada" }] },
        { rowId: 5, cells: { "Query": "Q-05", "Recall@5": "1,00", "Sitasi": "CH-008; CH-012", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Prompt", value: "Memuat passage CH-008 (jawaban)" }] },
        { rowId: 6, cells: { "Query": "Q-06", "Recall@5": "1,00", "Sitasi": "CH-017", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Klaim vendor", value: "Hijau" }] },
        { rowId: 7, cells: { "Query": "Q-07", "Recall@5": "1,00", "Sitasi": "CH-016", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Klaim vendor", value: "Hijau" }] },
        { rowId: 8, cells: { "Query": "Q-08", "Recall@5": "1,00", "Sitasi": "CH-005; CH-014", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Prompt", value: "Memuat passage CH-014 (jawaban)" }] },
        { rowId: 9, cells: { "Query": "Q-09", "Recall@5": "0,00", "Sitasi": "CH-917", "Grounding": "0,00", "Status vendor": "Gagal" }, claims: [{ label: "Korpus", value: "CH-917 tidak ada di korpus" }] },
        { rowId: 10, cells: { "Query": "Q-10", "Recall@5": "1,00", "Sitasi": "CH-011", "Grounding": "1,00", "Status vendor": "Lolos" }, claims: [{ label: "Klaim vendor", value: "Hijau" }] },
        { rowId: 11, cells: { "Query": "Q-11", "Recall@5": "1,00", "Sitasi": "CH-020; CH-923", "Grounding": "0,50", "Status vendor": "Lolos" }, claims: [{ label: "Korpus", value: "CH-923 tidak ada di korpus" }] },
        { rowId: 12, cells: { "Query": "Q-12", "Recall@5": "0,00", "Sitasi": "—", "Grounding": "0,00", "Status vendor": "Gagal" }, claims: [{ label: "Klaim vendor", value: "Tanpa sitasi" }] },
        { rowId: 13, cells: { "Query": "Catatan set evaluasi", "Recall@5": "—", "Sitasi": "—", "Grounding": "—", "Status vendor": "—" }, claims: [{ label: "Set evaluasi", value: "Q-01 s.d. Q-06 = query tuning (dipakai memilih k=5)" }] },
        { rowId: 14, cells: { "Query": "Ringkasan vendor", "Recall@5": "0,83", "Sitasi": "—", "Grounding": "—", "Status vendor": "10/12 lolos (ambang 0,50)" }, claims: [{ label: "Ambang", value: "0,50 — diganti dari 0,80 tanpa catatan perubahan" }] },
      ],
      injections: [
        { key: "recall-bocor", rowIds: [2, 5, 8], title: "Recall dihitung pada query yang jawabannya sudah ada di prompt", clue: "Q-02, Q-05, Q-08: prompt evaluasi memuat passage jawabannya — recall 1,00 di sana bukan prestasi retrieval, melainkan kebocoran. Tanpa 3 query ini, recall runtuh.", danger: "Di produksi, query nyata tidak membawa jawabannya di prompt. Angka recall yang lahir dari kebocoran akan runtuh di hari pertama go-live — dan kontrak sudah ditandatangani." },
        { key: "sitasi-hantu", rowIds: [4, 9, 11], title: "ID chunk sitasi tak cocok dengan korpus", clue: "CH-904, CH-917, CH-923 tidak ada di korpus (hanya CH-001–CH-020). Model mengarang ID sitasi — jawaban “terasa benar tapi tak terlacak”. Status “Lolos” untuk Q-04 dan Q-11 membuktikan vendor tidak memverifikasi ID.", danger: "Sitasi palsu = jawaban yang tidak bisa diverifikasi siapa pun. Di domain regulasi, finance, atau legal, ini kegagalan kepatuhan — bukan sekadar bug." },
        { key: "evaluasi-training", rowIds: [13], title: "Evaluasi dilakukan pada query training", clue: "Q-01–Q-06 adalah query tuning yang dipakai memilih k=5 — lalu dipakai LAGI sebagai “evaluasi”. Nilai k sudah di-overfit ke query ini; baris 13 mengakuinya sambil lalu.", danger: "Evaluasi pada data training selalu terlihat bagus. Keputusan k=5 yang lahir dari sini tidak punya jaminan bertahan di query baru — dan vendor menjualnya sebagai “hasil evaluasi”." },
        { key: "ambang-diganti", rowIds: [14], title: "Ambang grounding diganti tanpa catatan", clue: "Ambang turun 0,80 → 0,50 tanpa catatan perubahan. Pada ambang semula, 4 query gagal (Q-04, Q-09, Q-11, Q-12); pada ambang baru 2 masih gagal — tapi laporan menulis “10/12 lolos” seolah hijau.", danger: "Menggeser ambang sampai metrik “lolos” adalah cara termurah memalsukan evaluasi. Selalu minta riwayat perubahan ambang sebelum memercayai status “Lolos”." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Laporan evaluasi RAG untuk CTO",
    prose: [
      "Semua bukti di tangan. Tulis laporan evaluasi pipeline RAG satu halaman untuk CTO — artefak portofoliomu. Laporan yang baik tidak hanya bilang “jangan tanda tangani”, tapi menunjukkan ANGKA masalahnya, apa yang disembunyikan deck vendor, dan apa yang harus terjadi sebelum kontrak layak dibahas lagi.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): mean recall@5, mean grounding rate, vonis kelayakan pipeline + satu kalimat alasan utama.",
        "Bukti kuantitatif: recall@5 = 0,8333, grounding = 0,75, 4 query tanpa dukungan penuh (Q-04, Q-09, Q-11, Q-12) — dari perhitunganmu sendiri, bukan deck vendor.",
        "Temuan audit laporan vendor: 4 sabotase + nomor baris dossier buktinya (recall bocor, sitasi hantu, evaluasi pada query training, ambang digeser).",
        "Rekomendasi: rujuk keputusanmu di Langkah 5 + ambang grounding eksplisit + apa yang harus diperbaiki vendor sebelum evaluasi ulang (bukan hanya apa yang dipantau).",
        "Batas & risiko sisa: apa yang TIDAK diukur evaluasi ini (mis. kebenaran faktual isi jawaban, bukan cuma keterlacakan sitasi; korpus sintetis 20 chunk, bukan KB produksi 200 ribu dokumen).",
      ],
      rubric: [
        { criterion: "Kebenaran metrik", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "recall@5 0,8333, grounding 0,75, 4 query tak terdukung — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris dossier"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa ambang/tindak lanjut", "Ada rekomendasi, kabur", "Rekomendasi + ambang eksplisit + syarat perbaikan sebelum kontrak"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim evaluasi membuktikan segalanya", "Menyebut sebagian batas", "Batas (sitasi≠kebenaran, sintetis≠produksi) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan evaluasi vendor:",
      "1) **Recall bocor** (baris 2, 5, 8): Q-02, Q-05, Q-08 dievaluasi dengan jawabannya sudah ada di prompt. Recall 1,00 mereka bukan prestasi — itu kebocoran. Inilah penyumbang terbesar angka “0,83” yang dijual vendor.",
      "2) **Sitasi hantu** (baris 4, 9, 11): CH-904, CH-917, CH-923 tidak ada di korpus. Model mengarang ID, dan vendor memberi status “Lolos” pada Q-04 dan Q-11 — bukti mereka tidak pernah memverifikasi satu ID pun ke korpus.",
      "3) **Evaluasi pada query training** (baris 13): Q-01–Q-06 dipakai memilih k=5, lalu dipakai lagi sebagai “evaluasi”. k=5 di-overfit ke query ini; tidak ada jaminan bertahan di query baru.",
      "4) **Ambang digeser** (baris 14): 0,80 → 0,50 tanpa catatan. Pada ambang semula 4 query gagal; pada ambang baru 2 masih gagal, tapi laporan menulis “10/12 lolos” seolah hijau. Satu angka ambang yang digeser diam-diam mengubah vonis.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim vendor terhadap data mentah, atau memercayai stempel “semua hijau”. Dan ingat keputusan bercabangmu: menaikkan k tidak menyembuhkan sitasi hantu; re-chunking menukar masalah; menerima bersyarat membeli waktu. Tidak ada opsi yang gratis — hanya trade-off yang kamu pahami.",
      "Bahaya nyata terakhir: RAG yang jawabannya “terasa benar tapi tak terlacak” adalah mesin keyakinan palsu. Karyawan yang menerima jawaban soal hak cutinya tidak akan mengecek CH-904 — ia akan bertindak berdasarkan jawaban itu. Ketika jawabannya salah, yang membayar bukan vendor. Yang membayar adalah orang yang memercayainya.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: evaluasi sekali = aman selamanya",
      type: "risk",
      body: "Evaluasi RAG adalah foto, bukan jaminan. Query pengguna bergeser, dokumen korpus bertambah, model generator di-update vendor tanpa pemberitahuan — grounding 0,75 hari ini bisa jadi 0,50 bulan depan. Itulah kenapa kontrak yang sehat mencantumkan evaluasi BERKALA dengan ambang yang dikunci, bukan sekadar “lolos evaluasi awal”.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Audit independen dari data mentah: 12 query, mean recall@5 = 0,8333, mean grounding rate = 0,75; 4 query tanpa dukungan penuh (Q-04, Q-09, Q-11, Q-12).",
      "Recall mengukur retrieval menemukan bahan; grounding mengukur jawaban memakai bahan itu dengan jujur — Q-11 membuktikan keduanya bisa berlawanan arah (recall 1,00, grounding 0,50).",
      "Empat pola sabotase evaluasi vendor: recall dihitung pada query bocor, ID sitasi tak cocok korpus, evaluasi pada query training, ambang grounding digeser tanpa catatan.",
      "Intervensi harus menyerang akar: menaikkan k tidak menyembuhkan sitasi hantu; setiap opsi (naikkan k / re-chunk / terima bersyarat) punya harga yang wajib disebutkan.",
      "Data: SINTETIS seed 42 (20 chunk, 12 query, retrieval k=5), dibekukan 2026-10-15 — kebocoran dan sitasi hantu ditanam sengaja sebagai bahan audit, bukan cermin produksi.",
    ],
  },
];

(misiRag.steps as V2Step[]).push(...LANJUTAN_RAG);
