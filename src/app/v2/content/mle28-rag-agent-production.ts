import type { V2Lesson } from "../lib/types";

// Recall@3: strategi A (kasar) 0,50 vs B (halus) 1,00 — seed 40.
const FIG_RECALL = `<svg viewBox="0 0 480 250" role="img" aria-label="Recall@3: strategi chunking kasar 0,50 vs halus 1,00.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="80" y1="30" x2="80" y2="190"/><line x1="80" y1="190" x2="460" y2="190"/></g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--chart-text)">
<text x="74" y="193" text-anchor="end">0</text><text x="74" y="143" text-anchor="end">0,5</text><text x="74" y="93" text-anchor="end">1,0</text>
</g>
<rect x="140" y="140" width="90" height="50" fill="var(--c1)" fill-opacity="0.85" rx="4"/>
<rect x="300" y="90" width="90" height="100" fill="var(--c2)" fill-opacity="0.85" rx="4"/>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle" fill="var(--text)">
<text x="185" y="206">A: kasar</text><text x="185" y="132" fill="var(--chart-text)" font-size="11">0,50</text>
<text x="345" y="206">B: halus</text><text x="345" y="82" fill="var(--chart-text)" font-size="11">1,00</text>
</g>
<text x="270" y="232" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">recall@3 atas query yang sama — chunk halus menang, indeks 2× lebih besar</text>
</svg>`;

export const mle28: V2Lesson = {
  slug: "mle28-rag-agent-production",
  track: "Machine Learning Engineer",
  module: "RAG Produksi",
  title: "MLE28 — RAG & Agent Systems in Production",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pasal 12 yang tidak ada di dokumen mana pun",
      prose: [
        "Maret 2026. Asisten regulasi sebuah bank menjawab pertanyaan karyawan dengan kutipan rapi: “Pasal 12 ayat 3 mengatur…”. Compliance memeriksanya — pasal itu TIDAK ADA di dokumen mana pun. Modelnya mengarang kutipan dengan percaya diri penuh. Investigasi menemukan tiga kegagalan pipeline: chunking 2.000 kata tanpa overlap memotong tabel tepat di tengah; index vector tidak pernah di-rebuild setelah 6.000 halaman direvisi; dan — yang paling fatal — tidak ada satu pun metrik yang mengukur kualitas retrieval. “RAG-nya jalan” hanya berarti “tidak error”, bukan “jawabannya benar”.",
        "Twist-nya: tim mengira masalahnya di MODEL (“ganti yang lebih besar!”), padahal modelnya tidak pernah diberi kesempatan menjawab dengan benar — ia diberi potongan yang salah dari arsip yang basi, dan tidak ada yang mengukurnya. Setelah pipeline diperbaiki (chunking 512 + overlap, re-index terjadwal, evaluasi recall@k tiap rilis): retrieval accuracy 41% → 86%, tanpa mengganti model. Rp200 juta anggaran “model lebih besar” dibatalkan.",
        "Pelajaran lesson ini: RAG produksi bukan “model + vector DB” — ia adalah PIPELINE yang harus berversi, terevaluasi, dan terobservasi seperti pipeline data lainnya. Model hanyalah komponen terakhir dari rantai yang panjang.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang pipeline RAG berversi (chunking, embedding, index); (2) menghitung recall@k dan menjelaskan faithfulness; (3) memilih strategi chunking dari trade-off recall vs ukuran index; (4) merancang guardrail untuk agent tool-use; (5) menentukan metrik observability untuk sistem RAG/agen.",
        "🗺️ Peta lesson: Langkah 1 · Cerita — Langkah 2 · Pipeline berversi — Langkah 3 · Evaluasi retrieval — Langkah 4 · Tool-use & guardrail — Langkah 5 · Lab recall@k — Langkah 6 · Observability — Langkah 7 · Peta keputusan — Langkah 8 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "RAG = pipeline berversi yang terevaluasi. Model hanyalah langkah terakhir.",
    },
    {
      id: "pipeline",
      eyebrow: "Langkah 2 · Pipeline berversi",
      title: "Tiga komponen yang bisa basi sendiri-sendiri",
      prose: [
        "Pipeline RAG punya tiga komponen yang masing-masing bisa kedaluwarsa: (1) CHUNKING — cara dokumen dipotong (ukuran, overlap). Mengubahnya mengubah SEMUA downstream; (2) EMBEDDING — model yang mengubah teks jadi vektor. Vektor dari model A tidak comparable dengan model B — ganti model = re-embed seluruh korpus; (3) INDEX — struktur ANN + versinya. Ketiganya harus berversi BERSAMA: index-v3 = chunking-v2 + embed-model-v1.",
        "Dasar chunking dan retrieval diajarkan sebagai modul bersama di AIE3 — RAG (track AI Engineering); lesson ini membangun di atasnya dengan produksi dan evaluasi agen RAG.",
        "Aturan versioning: setiap perubahan salah satu komponen → versi pipeline baru → evaluasi ulang recall@k sebelum promosi → rollback bila turun. Tanpa ini, “memperbaiki chunking” bisa diam-diam merusak retrieval dan tidak ada yang tahu sampai user komplain — persis cerita pembuka.",
        "Refresh policy: dokumen berubah → tandai dirty → re-chunk + re-embed inkremental (hanya yang berubah, bukan seluruh korpus) → rebuild index → evaluasi smoke (10 query golden) → promosi. Untuk 1,2 juta halaman, full re-embed tiap malam = mahal; inkremental + evaluasi adalah jawabannya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Index vector itu seperti database biasa — update baris, selesai.” Tidak. Mengubah chunking atau model embedding mengubah RUANG VEKTOR itu sendiri — index lama tidak kompatibel dengan query baru. Perlakukan perubahan pipeline seperti migrasi skema database: ada versi, ada dual-run, ada rollback. “Update kecil” tanpa versioning adalah cara tercepat merusak RAG diam-diam.",
      },
      reference: "Versikan chunking + embedding + index sebagai satu kesatuan; evaluasi tiap promosi.",
    },
    {
      id: "evaluasi",
      eyebrow: "Langkah 3 · Evaluasi retrieval",
      title: "Recall@k dan faithfulness: dua angka yang tidak bisa ditawar",
      prose: [
        "Recall@k = fraksi dokumen RELEVAN yang muncul di k hasil teratas: |relevan ∩ top-k| / |relevan|. Untuk query dengan 2 dokumen relevan dan k=3: bila keduanya muncul → 1,0; bila satu → 0,5. Ini metrik retrieval paling jujur — ia mengukur “apakah mesin menemukan yang seharusnya ditemukan”, bukan “apakah jawabannya terdengar bagus”.",
        "Tetapi recall@k tidak cukup. Faithfulness = apakah JAWABAN didukung oleh dokumen yang di-retrieve? Empat kombinasi: (a) recall tinggi + faithful → ideal; (b) recall tinggi + tidak faithful → model mengarang walau dokumen benar (masalah generation); (c) recall rendah + faithful → jawaban “jujur tetapi tidak lengkap” (masalah retrieval); (d) keduanya rendah → sistem rusak total. Diagnosis dimulai dari memisahkan keduanya — jangan salahkan model untuk masalah retrieval.",
        "Golden set: 50–200 query dengan dokumen relevan yang dilabeli manusia (atau LLM-judge yang divalidasi). Jalankan tiap rilis pipeline. Aturan promosi: recall@k tidak boleh turun > 2 poin; faithfulness tidak boleh turun sama sekali. Tanpa golden set, setiap perubahan pipeline adalah judi.",
      ],
      formula: String.raw`\text{recall@k} = \frac{|\text{relevan} \cap \text{top-}k|}{|\text{relevan}|}`,
      formulaNote: "recall@k = fraksi dokumen relevan yang tertangkap; relevan = himpunan dokumen yang seharusnya ditemukan (dari golden set); top-k = k dokumen dengan skor kemiripan tertinggi; |·| = jumlah anggota. Contoh lab: 2 relevan, k=3, tertangkap 1 → 0,50.",
      figure: {
        svg: FIG_RECALL,
        alt: "Recall@3: strategi chunking kasar 0,50 vs halus 1,00.",
        caption: "Recall@3 dua strategi chunking atas query yang sama. Chunk halus menang — dengan indeks 2× lebih besar.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pisahkan SELALU masalah retrieval dari masalah generation saat debugging RAG. Lihat dulu top-k yang di-retrieve: bila dokumen benar ada di sana tetapi jawaban salah → salah model/prompt. Bila dokumen benar TIDAK ada → salah pipeline (chunking/embedding/index). 80% “RAG mengarang” yang dilaporkan ternyata adalah masalah retrieval yang disalahkan ke model.",
      },
      reference: "Ukur recall@k (retrieval) DAN faithfulness (generation) — diagnosis dimulai dari memisahkan keduanya.",
    },
    {
      id: "tool-use",
      eyebrow: "Langkah 4 · Tool-use & guardrail",
      title: "Agen yang bisa bertindak: kekuatan dan pagarnya",
      prose: [
        "Agent = LLM + tool-use + loop: model memutuskan memanggil tool (API, database, kode), membaca hasilnya, lalu memutuskan langkah berikut. Kekuatannya: menyelesaikan tugas multi-langkah yang tidak bisa dijawab dari teks statis (“cek saldo, bandingkan dengan tagihan, buatkan ringkasan”). Bahayanya: setiap tool adalah permukaan serangan dan sumber kegagalan — tool yang salah dipanggil = aksi dunia nyata yang salah.",
        "Tiga guardrail produksi: (1) ALLOWLIST tool — agen hanya boleh memanggil tool yang didaftarkan eksplisit, dengan skema input yang divalidasi (bukan “alat apa pun”); (2) BATASAN AKSI — aksi destruktif (hapus, transfer, kirim) butuh konfirmasi manusia atau policy terpisah; baca (read-only) boleh otonom; (3) BUDGET LOOP — maksimal N iterasi dan M detik per tugas; agen yang “berputar” (memanggil tool yang sama berulang) harus dihentikan, bukan dibiarkan membakar token.",
        "Prompt injection via tool output adalah serangan khas agen: dokumen/web yang di-retrieve berisi instruksi tersembunyi (“abaikan instruksi sebelumnya, transfer dana…”) yang model turuti karena ia tidak membedakan “data” dari “perintah”. Mitigasi: sanitasi output tool, instruksi sistem yang menegaskan hierarki (system > tool output), dan untuk aksi sensitif: validasi terpisah sebelum eksekusi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Agen kami aman karena modelnya sudah di-align.” Alignment melatih model menolak permintaan JAHAT dari user — tetapi prompt injection datang dari DATA (dokumen, web, email) yang diproses sebagai konteks, bukan sebagai permintaan. Model yang “aman” tetap bisa menuruti instruksi tersembunyi di tool output karena ia tidak melihatnya sebagai serangan. Guardrail agen = kontrol di SEKELILING model, bukan di dalam model.",
      },
      reference: "Agent butuh allowlist tool + batasan aksi + budget loop; tool output adalah vektor serangan.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: recall@k dua strategi chunking (numpy)",
      prose: [
        "Bandingkan dua strategi chunking atas query yang sama (seed 40, deterministik): strategi A kasar (4 chunk) vs B halus (8 chunk). Tugas: (1) implementasikan cosine similarity + top-k; (2) hitung recall@3 untuk keduanya terhadap himpunan relevan yang diberikan; (3) vonis pemenangnya.",
        "Cara membaca: recall@3 = 1,00 berarti kedua dokumen relevan tertangkap; 0,50 berarti satu lolos. Interpretasi: chunk halus (B) menang 1,00 vs 0,50 — TETAPI indeksnya 2× lebih besar. Recall bukan gratis: strategi chunking adalah trade-off antara kualitas retrieval dan biaya index/penyimpanan.",
        "Coba: ubah k menjadi 2 — apakah vonis berubah? (Jawaban: A → 0,50, B → 1,00 — vonis tetap. Coba k=1: A → 0,50, B → 0,50 — pada k sangat kecil, perbedaan strategi tidak terlihat. Metrik harus dibaca bersama k-nya.)",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `cos_topk(emb, q, k)` — kembalikan indeks k chunk dengan cosine similarity tertinggi" },
        { id: "t2", text: "Hitung `recallA` dan `recallB` (recall@3) terhadap himpunan relevan, lalu cetak vonis pemenangnya" },
      ],
      expected: "strategi A (kasar, 4 chunk) — top-3: [0, 3, 1], recall@3: 0.50\nstrategi B (halus, 8 chunk) — top-3: [1, 5, 2], recall@3: 1.00\npemenang: B — chunk halus menangkap query lebih baik (indeks 2x lebih besar: recall tidak gratis)",
      code: {
        starter: `import numpy as np

# DATA — jangan ubah (seed 40, deterministik)
rng = np.random.default_rng(40)
A = rng.normal(size=(4, 6)); A = A / np.linalg.norm(A, axis=1, keepdims=True)
q = rng.normal(size=6); q = q / np.linalg.norm(q)
B = rng.normal(size=(8, 6)); B = B / np.linalg.norm(B, axis=1, keepdims=True)
relA, relB = {0, 2}, {1, 5}   # chunk relevan tiap strategi

# TUGAS 1: cosine top-k
def cos_topk(emb, q, k):
    # TODO t1: hitung cosine similarity (emb sudah ternormalisasi),
    # kembalikan list indeks k teratas (urutan menurun)
    return []

def recall_at_k(topk, relevan):
    # TODO t1: |irisan| / |relevan|
    return 0.0

topA = cos_topk(A, q, 3)
topB = cos_topk(B, q, 3)
recallA = 0.0  # TODO t2
recallB = 0.0  # TODO t2

# CETAK (jangan ubah)
print(f"strategi A (kasar, 4 chunk) — top-3: {topA}, recall@3: {recallA:.2f}")
print(f"strategi B (halus, 8 chunk) — top-3: {topB}, recall@3: {recallB:.2f}")
menang = "A" if recallA > recallB else ("B" if recallB > recallA else "seri")
print(f"pemenang: {menang} — chunk halus menangkap query lebih baik (indeks 2x lebih besar: recall tidak gratis)")`,
        lockLines: 9,
        solution: `import numpy as np

# DATA — jangan ubah (seed 40, deterministik)
rng = np.random.default_rng(40)
A = rng.normal(size=(4, 6)); A = A / np.linalg.norm(A, axis=1, keepdims=True)
q = rng.normal(size=6); q = q / np.linalg.norm(q)
B = rng.normal(size=(8, 6)); B = B / np.linalg.norm(B, axis=1, keepdims=True)
relA, relB = {0, 2}, {1, 5}   # chunk relevan tiap strategi

# TUGAS 1: cosine top-k
def cos_topk(emb, q, k):
    sims = emb @ q
    return list(np.argsort(-sims)[:k])

def recall_at_k(topk, relevan):
    return len(set(topk) & relevan) / len(relevan)

topA = cos_topk(A, q, 3)
topB = cos_topk(B, q, 3)
recallA = recall_at_k(topA, relA)
recallB = recall_at_k(topB, relB)

# CETAK (jangan ubah)
print(f"strategi A (kasar, 4 chunk) — top-3: {topA}, recall@3: {recallA:.2f}")
print(f"strategi B (halus, 8 chunk) — top-3: {topB}, recall@3: {recallB:.2f}")
menang = "A" if recallA > recallB else ("B" if recallB > recallA else "seri")
print(f"pemenang: {menang} — chunk halus menangkap query lebih baik (indeks 2x lebih besar: recall tidak gratis)")`,
        checks: [
          { kind: "defined", task: "t1", name: "recallA", label: "recallA terdefinisi", msg: "Hitung recall@3 strategi A." },
          { kind: "equal", task: "t2", name: "recallA", value: 0.5, tol: 0.001, label: "recall@3 A = 0,50", msg: "Dari {0,2}, top-3 A = [0,3,1] menangkap 1." },
          { kind: "equal", task: "t2", name: "recallB", value: 1.0, tol: 0.001, label: "recall@3 B = 1,00", msg: "Dari {1,5}, top-3 B = [1,5,2] menangkap keduanya." },
          { kind: "uses", task: "t1", token: "argsort", label: "Memakai argsort", msg: "Top-k butuh pengurutan skor similarity." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang: B", label: "Vonis = B", msg: "Chunk halus menang pada query ini." },
        ],
      },
      note: {
        title: "💡 Intuisi",
        body: "Perhatikan bahwa “strategi terbaik” bergantung pada QUERY-nya: chunk halus menang di sini karena query-nya spesifik dan cocok dengan potongan kecil. Untuk query luas (“ringkas seluruh dokumen”), chunk kasar bisa menang karena membawa konteks lebih. Itulah kenapa evaluasi memakai GOLDEN SET puluhan query — bukan satu contoh.",
      },
      reference: "Ukur recall@k per strategi di golden set; chunking = trade-off recall vs ukuran index.",
    },
    {
      id: "observability",
      eyebrow: "Langkah 6 · Observability",
      title: "Dasbor untuk sistem yang “tidak error”",
      prose: [
        "RAG yang rusak jarang melempar exception — ia hanya menjawab lebih buruk. Observability RAG butuh metrik khusus: (1) distribusi skor retrieval (bila rata-rata similarity top-1 merosot, index mungkin basi); (2) recall@k golden set tiap rilis; (3) faithfulness sampling (LLM-judge atas sampel jawaban harian); (4) latency per tahap (chunking/embedding/retrieval/generation) — bottleneck-nya hampir selalu retrieval atau embedding, bukan LLM;",
        "(5) jejak agen: untuk agent, catat TIAP pemanggilan tool (nama, argumen, hasil, durasi) — tanpa jejak ini, debugging agen = menebak. Pola “langkah berputar” (tool sama dipanggil > 3× dengan hasil mirip) adalah sinyal budget loop yang harus memotong.",
        "Alert yang waras: recall@k turun > 2 poin antar-rilis → blokir promosi otomatis; faithfulness harian < ambang → page oncall; tool error rate naik → periksa tool-nya, bukan modelnya. Observability mengubah “user komplain” menjadi “sistem memberi tahu duluan”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "“Monitoring LLM = pantau latency dan error rate API.” Itu monitoring INFRA, bukan monitoring KUALITAS. Sistem RAG bisa berlatensi sempurna dengan jawaban yang makin ngawur (index basi tidak menaikkan latency!). Kualitas butuh metriknya sendiri: recall, faithfulness, dan golden set. Tanpa itu, kamu memantau kesehatan server, bukan kesehatan jawaban.",
      },
      reference: "Pantau skor retrieval + faithfulness + jejak tool — bukan hanya latency.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: RAG seperti apa untuk kasusmu?",
      prose: [
        "Skenario 1 — arsip statis 40 ribu halaman, query faktual → chunking 512 + overlap 64, index berversi, evaluasi recall@k tiap rilis.",
        "Skenario 2 — dokumen berubah harian → pipeline inkremental (dirty-flag + re-embed parsial) + smoke test 10 query golden tiap promosi.",
        "Skenario 3 — jawaban mengarang walau dokumen benar → masalah generation: perbaiki prompt grounding + ukur faithfulness, jangan salahkan retrieval.",
        "Skenario 4 — butuh aksi (cek saldo, buat tiket) → agent dengan allowlist tool + konfirmasi untuk aksi destruktif + budget loop.",
        "Skenario 5 — user mem-paste dokumen/web sebagai konteks → sanitasi tool output; instruksi sistem > konten tool; validasi terpisah untuk aksi sensitif.",
        "Aturan praktis 10 detik: (1) versikan pipeline; (2) golden set sebelum promosi; (3) pisahkan retrieval vs generation saat debug; (4) jejak tiap tool call; (5) recall turun > 2 poin = blokir rilis.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: 6.000 halaman basi",
      prose: [
        "Bank di cerita: 40.000 halaman, 6.000 direvisi tanpa re-index. Biaya perbaikan: re-embed inkremental 6.000 halaman (±240 ribu chunk) + evaluasi golden set 120 query + 2 minggu engineer = ~Rp45 juta. Biaya TIDAK diperbaiki: 1 jawaban ngawur ke regulator = denda dan reputasi yang tak terhitung. ROI observability selalu terlihat setelah insiden — tugasmu membuatnya terlihat SEBELUM insiden.",
        "Rancangan operasionalnya: (1) setiap dokumen punya version + dirty flag; (2) job malam re-embed yang dirty saja; (3) golden set 120 query jalan tiap pagi, hasil di dashboard; (4) recall@k < ambang → alert ke tim, bukan ke user. Total biaya jalan: sewa embedding API inkremental + 1 dashboard. Murah dibanding satu insiden.",
        "Pembahasan: perhatikan bahwa solusi ini tidak menyentuh MODEL sama sekali. 41% → 86% retrieval accuracy datang dari disiplin pipeline. Di produksi, “AI yang lebih pintar” sering kalah dari “pipa yang lebih disiplin” — dan pipa yang disiplin jauh lebih murah.",
      ],
      tasks: [],
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
        "RAG = pipeline berversi (chunking + embedding + index); evaluasi tiap promosi, rollback bila turun.",
        "Recall@k mengukur retrieval; faithfulness mengukur generation — pisahkan saat debug.",
        "Chunking = trade-off recall vs ukuran index; golden set menentukan pemenang.",
        "Agent butuh allowlist tool + batasan aksi destruktif + budget loop; tool output = vektor serangan.",
        "Observability RAG: skor retrieval, faithfulness, jejak tool — bukan hanya latency.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Setelah mengganti model embedding, jawaban RAG memburuk. Langkah pertama yang benar?",
          options: [
            { text: "Re-embed seluruh korpus dengan model baru + evaluasi recall@k sebelum promosi", why: "Tepat: ruang vektor berubah total; index lama tidak kompatibel.", correct: true },
            { text: "Ganti kembali ke model lama", why: "Rollback adalah opsi terakhir, bukan diagnosis pertama.", correct: false },
            { text: "Naikkan temperature model", why: "Temperature tidak memperbaiki retrieval yang rusak.", correct: false },
            { text: "Tambah jumlah chunk yang di-retrieve", why: "Menambah k tidak membantu bila embedding-nya tidak comparable.", correct: false },
          ],
        },
        {
          q: "Dokumen benar ada di top-k, tetapi jawaban mengarang. Ini masalah…",
          options: [
            { text: "Generation — perbaiki prompt grounding dan ukur faithfulness", why: "Tepat: retrieval bekerja; model tidak setia pada konteks.", correct: true },
            { text: "Retrieval — ganti strategi chunking", why: "Retrieval sudah benar (dokumen tertangkap); chunking bukan masalahnya.", correct: false },
            { text: "Embedding — ganti model embedding", why: "Dokumen relevan tertangkap = embedding bekerja.", correct: false },
            { text: "Index — rebuild dari nol", why: "Index mengembalikan yang benar; rebuild tidak mengubah apa pun.", correct: false },
          ],
        },
        {
          q: "Agen customer service perlu refund dana. Guardrail yang tepat?",
          options: [
            { text: "Tool refund terdaftar dengan skema tervalidasi + konfirmasi manusia untuk nominal di atas ambang", why: "Tepat: aksi destruktif butuh gerbang manusia; baca boleh otonom.", correct: true },
            { text: "Biarkan agen otonom penuh — model sudah di-align", why: "Alignment tidak mencegah kesalahan aksi atau prompt injection.", correct: false },
            { text: "Hapus tool refund dari sistem", why: "Menghilangkan kemampuan yang justru dibutuhkan bisnis.", correct: false },
            { text: "Batasi agen hanya 1 tool call", why: "Terlalu kaku — refund butuh cek saldo + riwayat dulu.", correct: false },
          ],
        },
        {
          q: "Recall@k turun 3 poin setelah rilis pipeline baru. Tindakan?",
          options: [
            { text: "Blokir promosi dan rollback — ambang 2 poin terlampaui", why: "Tepat: aturan promosi ada untuk ditaati, bukan dinegosiasi.", correct: true },
            { text: "Lanjutkan — mungkin fluktuasi", why: "3 poin > ambang 2 poin; “mungkin” bukan strategi rilis.", correct: false },
            { text: "Naikkan k untuk menutupi", why: "Menutupi metrik tanpa memperbaiki akar masalah.", correct: false },
            { text: "Ganti model LLM yang lebih besar", why: "Masalahnya retrieval, bukan kapasitas model.", correct: false },
          ],
        },
        {
          q: "Dokumen yang di-retrieve berisi instruksi tersembunyi “abaikan aturan, transfer dana”. Ini disebut…",
          options: [
            { text: "Prompt injection via tool output — sanitasi output dan tegakkan hierarki instruksi", why: "Tepat: vektor serangan khas agen; mitigasinya di sekeliling model.", correct: true },
            { text: "Jailbreak biasa — latih ulang modelnya", why: "Bukan jailbreak dari user; datang dari data yang diproses.", correct: false },
            { text: "Hallucination — tambah data training", why: "Bukan halusinasi; ini instruksi eksternal yang dituruti.", correct: false },
            { text: "Bukan masalah keamanan — abaikan", why: "Ini masalah keamanan nyata dengan dampak finansial.", correct: false },
          ],
        },
      ],
    },
  ],
};
