import type { V2Lesson } from "../lib/types";

// Dua model di tiga jenis tugas: tidak ada yang menang di semuanya (pola temuan MTEB).
const FIG_TASKS = `<svg viewBox="0 0 560 270" role="img" aria-label="Perbandingan dua model embedding di tiga jenis tugas.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="280" y="20">Skor per jenis tugas (0-1)</text></g>
<g font-size="11" font-family="var(--font-ui)">
<text x="120" y="52" fill="var(--text-muted)" text-anchor="middle">retrieval ID</text>
<rect x="40" y="60" width="71" height="26" fill="var(--c4)" opacity="0.6"/><text x="46" y="77" fill="var(--text)">A: 0,71</text>
<rect x="40" y="90" width="87" height="26" fill="var(--c1)"/><text x="46" y="107" fill="var(--text)">B: 0,87 ✓</text>
<text x="280" y="52" fill="var(--text-muted)" text-anchor="middle">STS Inggris</text>
<rect x="200" y="60" width="86" height="26" fill="var(--c4)"/><text x="206" y="77" fill="var(--text)">A: 0,86 ✓</text>
<rect x="200" y="90" width="80" height="26" fill="var(--c1)" opacity="0.6"/><text x="206" y="107" fill="var(--text)">B: 0,80</text>
<text x="440" y="52" fill="var(--text-muted)" text-anchor="middle">klasifikasi</text>
<rect x="360" y="60" width="83" height="26" fill="var(--c4)"/><text x="366" y="77" fill="var(--text)">A: 0,83 ✓</text>
<rect x="360" y="90" width="79" height="26" fill="var(--c1)" opacity="0.6"/><text x="366" y="107" fill="var(--text)">B: 0,79</text>
</g>
<text x="280" y="150" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">A = model besar English-centric · B = model kecil multilingual</text>
<text x="280" y="168" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">Juara umum (A) kalah di satu-satunya tugas yang penting: retrieval bahasa Indonesia</text>
<text x="280" y="196" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">rata-rata A (0,80) &gt; rata-rata B (0,79) — tetapi rata-rata menipu</text>
<text x="280" y="238" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">angka ilustratif — pola sesuai temuan kunci MTEB: tidak ada metode dominan di semua tugas</text>
</svg>`;

// Kurva Matryoshka: dimensi dipotong, recall@1 bertahan (angka dari Lab langkah 4).
const FIG_MRL = `<svg viewBox="0 0 520 250" role="img" aria-label="Recall at 1 vs dimensi embedding Matryoshka.">
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)">
<text x="60" y="30">recall@1</text><text x="430" y="225">dimensi →</text>
</g>
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="80" y="60" width="90" height="140" fill="var(--c3)"/><text x="125" y="135" fill="var(--text)">1,00</text><text x="125" y="220" fill="var(--text-muted)">dim 8</text>
<rect x="215" y="60" width="90" height="140" fill="var(--c3)"/><text x="260" y="135" fill="var(--text)">1,00</text><text x="260" y="220" fill="var(--text-muted)">dim 4</text>
<rect x="350" y="107" width="90" height="93" fill="var(--c2)"/><text x="395" y="158" fill="var(--text)">0,67</text><text x="395" y="220" fill="var(--text-muted)">dim 2</text>
</g>
<text x="260" y="242" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">angka dari Lab langkah 4 — potong 8→4 gratis, 8→2 mulai membayar</text>
</svg>`;

export const aie16: V2Lesson = {
  slug: "aie16-embedding-selection",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE16 — Embedding: Memilih & Fine-Tuning Model",
  estMinutes: 52,
  steps: [
    {
      id: "cerita-skor-salah",
      eyebrow: "Langkah 1 · Cerita",
      title: "Memilih Otak Retrieval: benchmark MTEB & fine-tune embedding",
      prose: [
        "Startup legal-tech memilih model embedding 'terbesar dan terpopuler' untuk pencarian 200.000 dokumen hukum Indonesia. Tujuh miliar parameter — pasti bagus, pikir mereka. Hasil uji: query 'wanprestasi' tidak menemukan dokumen tentang 'ingkar janji', padahal itu sinonim hukum yang sama. Model raksasa itu buta Bahasa Indonesia. Ironisnya, model 400 juta parameter yang multilingual mengalahkannya telak di data mereka.",
        "Twist-nya: yang mereka butuhkan bukan model terbesar — melainkan model yang MENANG di tugas retrieval berbahasa Indonesia. Dan itu tidak terlihat dari jumlah parameter, tidak terlihat dari popularitas di forum, tidak terlihat dari skor rata-rata leaderboard. Terlihat dari SATU kolom spesifik di papan skor embedding: retrieval, bahasa Indonesia. Mereka salah membaca papan skor — dan membayarnya dengan tiga bulan performa buruk.",
        "Lesson ini membedah tiga hal: (1) MTEB — papan skor universal embedding, cara membacanya tanpa tertipu rata-rata; (2) fine-tuning embedding untuk domain spesifik — kapan layak, kapan bunuh diri; (3) Matryoshka — satu model, banyak ukuran, potong dimensi sesuai budget tanpa latih ulang. (Catatan kepemilikan: 'MTEB' sempat disebut selintas di mle13 sebagai tips memilih model — di sini kita bedah penuh: benchmark-nya, cara bacanya, fine-tune-nya.)",
        "Bekal kilat (agar lesson ini mandiri): lesson RAG dasar mengubah teks menjadi vektor embedding dan mengukur kedekatan dengan cosine similarity; lesson hybrid search menunjukkan dense retrieval unggul di parafrase tetapi buta istilah spesifik — kualitas keduanya ditentukan oleh MODEL EMBEDDING yang kamu pilih. Lesson ini: memilih, menilai, dan melatihnya dengan benar.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan temuan kunci MTEB dan implikasinya; (2) membaca leaderboard embedding tanpa tertipu skor rata-rata; (3) memutuskan kapan fine-tune embedding layak vs kapan tidak; (4) menerapkan Matryoshka truncation sesuai budget; (5) menghitung tradeoff dimensi vs storage/latensi.",
        "🗺️ Isi lesson (⏱ 52 mnt · 1 lab · 6 kuis · 1 mini-case): Langkah 1 · Cerita — Langkah 2 · MTEB: si papan skor universal — Langkah 3 · Fine-tune & Matryoshka — Langkah 4 · Lab: seleksi + truncation — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case legal-tech — Langkah 7 · ANN & vector DB — Checkpoint.",
      ],
      tasks: [],
      reference: "Pilih model yang menang di TUGASMU, bukan juara umum papan skor.",
    },
    {
      id: "konsep-mteb",
      eyebrow: "Langkah 2 · MTEB",
      title: "MTEB — si papan skor universal",
      prose: [
        "Masalah yang diselesaikan MTEB: embedding biasanya dievaluasi pada segelintir dataset dari SATU tugas (misalnya semantic textual similarity) — tidak jelas apakah juara STS juga bagus untuk retrieval, clustering, atau reranking. Paper 'MTEB: Massive Text Embedding Benchmark' (Muennighoff, Tazi, Magne, Reimers — arXiv 2210.07316, Oktober 2022, revisi Maret 2023) membangun benchmark masif: 8 jenis tugas embedding mencakup 58 dataset dan 112 bahasa, dengan 33 model di-benchmark. Kode open-source dan leaderboard publik di Hugging Face Spaces.",
        "Temuan kuncinya — hafalkan, karena ini mengubah cara memilih model: TIDAK ADA satu metode embedding pun yang mendominasi semua tugas. Bidang ini belum konvergen ke satu metode universal. Artinya juara STS bisa kalah di retrieval; juara Inggris bisa kalah di Indonesia. 'Model embedding terbaik' tanpa menyebut TUGAS = kalimat yang tidak bermakna.",
        "Cara membaca leaderboard tanpa tertipu — empat aturan. (1) Filter jenis tugas = RETRIEVAL bila membangun RAG; abaikan kolom STS/clustering. (2) Perhatikan bahasa: untuk dokumen Indonesia, cari hasil pada benchmark multilingual — paper lanjutannya, MMTEB (Massive Multilingual Text Embedding Benchmark, arXiv 2502.13595, 2025), memperluas cakupan multilingual secara besar-besaran. (3) Jangan pakai skor rata-rata: rata-rata menyembunyikan kekalahan di tugasmu (lihat chart — A menang rata-rata tetapi kalah di retrieval ID). (4) Cek versi benchmark: package mteb menyediakan benchmark 'MTEB(eng, v2)' — pastikan membandingkan apel dengan apel, bukan v1 vs v2.",
        "Kepribadian MTEB: seperti rapor 8 mata pelajaran untuk 33 murid. Murid peringkat 1 umum bisa ranking 20 di matematika — dan jika kamu merekrut guru matematika, peringkat umumnya tidak relevan. Kebanyakan tim merekrut 'murid peringkat 1 umum' untuk pekerjaan matematika, lalu heran kenapa jeblok.",
        "Batasan jujur leaderboard: skor MTEB diukur pada dataset publik — domain KHUSUS (hukum Indonesia, medis, log internal) bisa berperilaku berbeda. Leaderboard = shortlist 3 kandidat, BUKAN keputusan final. Keputusan final = uji 100 pasangan query-dokumen berlabel dari domainmu sendiri (±2 jam kerja). Leaderboard menghemat waktu seleksi; ia tidak menggantikan pengukuran.",
        "Cara membaca chart: tiga kelompok batang = tiga jenis tugas; dua warna = model A (besar, English-centric) vs B (kecil, multilingual). Interpretasi: A menang di STS dan klasifikasi — tetapi SATU-SATUNYA tugas yang penting untuk RAG, retrieval bahasa Indonesia, dimenangkan B (0,87 vs 0,71). Rata-rata A lebih tinggi (0,80 vs 0,79) — dan rata-rata inilah yang menipu tim legal-tech di cerita pembuka.",
      ],
      formula: String.raw`\cos(\mathbf{a},\mathbf{b}) = \frac{\mathbf{a}\cdot\mathbf{b}}{\|\mathbf{a}\|\,\|\mathbf{b}\|}`,
      formulaNote: "a, b = vektor embedding dua teks (query dan dokumen); a·b = dot product (jumlah perkalian komponen seposisi); ||·|| = norma/panjang vektor. Hasil 1 = searah (sangat mirip), 0 = tegak lurus (tidak berhubungan). Seluruh leaderboard retrieval pada dasarnya merangking model berdasarkan seberapa baik cosine ini memisahkan dokumen relevan dari yang tidak — pada 58 dataset, bukan satu.",
      figure: {
        svg: FIG_TASKS,
        alt: "Perbandingan dua model embedding di tiga jenis tugas: retrieval Indonesia, STS Inggris, klasifikasi.",
        caption: "Juara umum belum tentu juara di tugasmu — pola temuan kunci MTEB.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Sebelum membuka leaderboard, tulis dulu 'spesifikasi lowongan'-mu: tugas = retrieval, bahasa = Indonesia, budget = 384 dimensi, latensi < 50ms. Lalu filter leaderboard dengan spesifikasi itu. Orang yang membuka leaderboard tanpa spesifikasi = orang yang belanja tanpa daftar: pulang membawa yang populer, bukan yang dibutuhkan.",
      },
      reference: "MTEB: 8 tugas, 58 dataset, 112 bahasa — tidak ada juara di semua tugas.",
    },
    {
      id: "konsep-finetune-matryoshka",
      eyebrow: "Langkah 3 · Fine-tune & Matryoshka",
      title: "Melatih sendiri vs memotong cerdas",
      prose: [
        "Fine-tuning embedding = melatih ulang model embedding pada data DOMAINMU dengan contrastive learning. Bahannya: pasangan (query, dokumen positif) — misalnya dari log klik pengguna: query 'wanprestasi' yang diklik ke dokumen 'ingkar janji' = pasangan positif. Dokumen yang tidak diklik = negatif. Training mendekatkan vektor pasangan positif dan menjauhkan pasangan negatif — rumus InfoNCE di bawah adalah jantungnya. Kapan layak: domain dengan kosakata khusus (hukum, medis, internal perusahaan) di mana model umum gagal MENGENALI sinonim domain. Syarat: ratusan hingga ribuan pasangan berlabel berkualitas.",
        "Kepribadian fine-tune: seperti kursus bahasa daerah untuk penerjemah umum. Penerjemah Inggris-Indonesia umum tidak paham 'wanprestasi' = 'ingkar janji'; setelah kursus hukum 3 bulan, paham. Tetapi kursus butuh murid (data label), guru (GPU), dan waktu — dan ada risiko ia 'lupa' kemampuan umumnya (catastrophic forgetting) bila data kursus terlalu sempit.",
        "Matryoshka Representation Learning menyerang masalah yang berbeda: UKURAN vs BIAYA. Paper 'Matryoshka Representation Learning' (Kusupati et al. — arXiv 2205.13147, Mei 2022, revisi Februari 2024) melatih SATU embedding dengan informasi bersarang coarse-to-fine — seperti boneka Rusia: dimensi pertama menyimpan gambaran kasar, dimensi berikutnya menambah detail. Saat deploy, kamu POTONG vektor sesuai budget (1024 → 256 → 128) TANPA latih ulang. Hasil paper: hingga 14x lebih kecil dengan akurasi setara, hingga 14x lebih cepat untuk retrieval skala besar, tanpa biaya tambahan saat inference/deployment.",
        "Kepribadian Matryoshka: seperti foto yang disimpan berlapis — thumbnail 10KB cukup untuk kenali wajah, versi penuh 2MB untuk detail. Kamu tidak memotret ulang saat butuh thumbnail; kamu memotong dari yang ada. Model Matryoshka = satu pemotretan, banyak ukuran, pilih sesuai kebutuhan hari ini.",
        "Kapan memakai yang mana — ini peta intinya. Masalah = model tidak paham istilah domain (wanprestasi vs ingkar janji) → fine-tune contrastive (atau pilih model domain-specific). Masalah = embedding terlalu besar/mahal (storage, latensi, biaya API) → Matryoshka truncation. Keduanya bisa digabung: fine-tune model Matryoshka pada domainmu, lalu potong sesuai budget. Urutan kerja yang hemat: (1) pilih model tepat via MTEB + uji 100 sampel, (2) potong dengan Matryoshka bila perlu, (3) fine-tune HANYA bila (1)-(2) masih gagal di istilah domain.",
        "Cara membaca chart: tiga batang = recall@1 pada dimensi 8, 4, dan 2 (angka dari Lab langkah 4). Interpretasi: potong 8→4 GRATIS (recall tetap 1,00) — informasi pentingnya muat di separuh dimensi pertama, sesuai janji coarse-to-fine. Potong 8→2 MULAI MEMBAYAR (0,67). Pelajaran: truncation bukan 'semakin kecil semakin baik' — ukur titik patahnya di datamu, lalu berhenti satu langkah sebelumnya.",
      ],
      formula: String.raw`\mathcal{L} = -\log\frac{e^{s(q,d^+)/\tau}}{\sum_{d \in D} e^{s(q,d)/\tau}}`,
      formulaNote: "L = InfoNCE loss (yang diminimalkan saat training); q = query; d+ = dokumen POSITIF (relevan); D = himpunan positif + negatif; s(q,d) = skor kemiripan (mis. cosine); τ ('tau') = temperature — τ kecil membuat model 'tegas' membedakan. Intuisi: loss kecil ketika skor positif JAUH lebih besar dari semua negatif — model belajar menarik yang relevan mendekat dan mendorong yang tidak relevan menjauh.",
      figure: {
        svg: FIG_MRL,
        alt: "Recall at 1 pada dimensi 8, 4, dan 2 setelah Matryoshka truncation.",
        caption: "Matryoshka: potong dimensi sesuai budget — ukur titik patahnya.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Fine-tune embedding selalu membantu untuk domain spesifik.' Tidak selalu — fine-tune dengan 50 pasangan berlabel = overfit + catastrophic forgetting: model hafal 50 contoh itu tetapi kemampuan umumnya rusak. Syarat minimum yang waras: ratusan pasangan berkualitas, validasi pada data yang TIDAK dilatih, dan bandingkan dengan baseline 'pilih model yang tepat + Matryoshka' SEBELUM mengklaim fine-tune yang menang. Banyak 'keberhasilan fine-tune' sebenarnya hanya keberhasilan memilih data evaluasi yang cocok.",
      },
      reference: "Fine-tune = ajari istilah domain (butuh data label). Matryoshka = potong dimensi sesuai budget (tanpa latih ulang).",
    },
    {
      id: "lab-seleksi-truncation",
      eyebrow: "Langkah 4 · Lab seleksi",
      title: "Lab: recall@1 vs dimensi + biaya storage",
      prose: [
        "Enam dokumen tiruan, tiga query (tiap query = vektor dokumen target + noise kecil — simulasi pasangan relevan). Dua model imajiner diwakili SATU set vektor yang dipotong: dimensi penuh 8 vs Matryoshka-truncated 4 vs 2. Tugasmu: implementasikan `cosine`, `recall_at_1(dim)`, dan `storage_mb` — lalu tentukan titik potong yang waras.",
        "Coba eksplorasi: (1) ubah noise dari 0,15 menjadi 0,5 — query makin kabur; apakah dim=4 masih bertahan? (2) ubah TARGETS menjadi [1, 3, 4] — apakah kesimpulan truncation berubah? (3) hitung storage untuk 10 juta dokumen pada dim 1024 vs 256 — kapan 4x penghematan menjadi keputusan bisnis?",
        "Cara membaca output: `recall@1` per dimensi = kualitas retrieval; `storage` = biaya. Interpretasi: keputusan embedding = perkalian keduanya. Dimensi 4 memberi kualitas dimensi 8 dengan storage separuh — 'makan siang gratis' Matryoshka. Dimensi 2 menghemat lebih banyak tetapi membayar dengan kualitas — di sinilah intuisi bisnis masuk: berapa nilai 0,33 poin recall bagimu?",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `cosine(a, b)` dan `recall_at_1(dim)`: potong vektor ke `dim` pertama, prediksi = argmax similarity" },
        { id: "t2", text: "Implementasikan `storage_mb(n_docs, dim)` untuk float32 (4 byte), print perbandingan" },
      ],
      expected: "recall@1 dim=8: 1.0, dim=4: 1.0, dim=2: 0.667; storage 30.5 MB vs 7.6 MB",
      note: {
        title: "💡 Intuisi",
        body: "Matryoshka DULU sebelum ganti model atau fine-tune: potong 1024→256, ukur recall@5 di datamu. Sering turun < 2 poin dengan storage 4x lebih hemat dan latensi turun signifikan. Ini eksperimen 30 menit yang mengalahkan 3 minggu fine-tune — lakukan SELALU sebelum yang mahal.",
      },
      hints: [
        "cosine: dot = sum(x*y ...); na/nb = akar jumlah kuadrat; kembalikan dot/(na*nb)",
        "recall_at_1: untuk tiap (t, qv): sims = [cosine(qv[:dim], dv[:dim]) ...]; pred = argmax; hits += (pred == t)",
        "storage_mb: n_docs * dim * 4 / 1024 / 1024",
      ],
      code: {
        starter: `# SEED — jangan ubah
import math, random
rng = random.Random(1)
DIM = 8
DOCS = [
    "suku bunga deposito dua belas bulan",
    "cara blokir kartu kredit hilang",
    "bunga deposito dan pajak tabungan",
    "syarat pengajuan kpr rumah",
    "biaya administrasi kartu debit",
    "limit transfer antar bank",
]
TARGETS = [2, 0, 5]
DOC_VECS = [[rng.gauss(0, 1) for _ in range(DIM)] for _ in DOCS]
Q_VECS = []
for t in TARGETS:
    Q_VECS.append((t, [x + rng.gauss(0, 0.15) for x in DOC_VECS[t]]))

# TULIS KODEMU (di bawah garis ini)
def cosine(a, b):
    # TODO t1
    return 0.0

def recall_at_1(dim):
    # TODO t1: potong [:dim], argmax similarity, hitung fraksi benar
    return 0.0

def storage_mb(n_docs, dim):
    # TODO t2: float32 = 4 byte
    return 0.0

# UJI (jangan ubah)
for d in [8, 4, 2]:
    print("recall@1 dim=" + str(d) + ":", round(recall_at_1(d), 3))
print("storage dim=8:", round(storage_mb(1000000, 8), 1), "MB")
print("storage dim=2:", round(storage_mb(1000000, 2), 1), "MB")`,
        lockLines: 18,
        solution: `# SEED — jangan ubah
import math, random
rng = random.Random(1)
DIM = 8
DOCS = [
    "suku bunga deposito dua belas bulan",
    "cara blokir kartu kredit hilang",
    "bunga deposito dan pajak tabungan",
    "syarat pengajuan kpr rumah",
    "biaya administrasi kartu debit",
    "limit transfer antar bank",
]
TARGETS = [2, 0, 5]
DOC_VECS = [[rng.gauss(0, 1) for _ in range(DIM)] for _ in DOCS]
Q_VECS = []
for t in TARGETS:
    Q_VECS.append((t, [x + rng.gauss(0, 0.15) for x in DOC_VECS[t]]))

# TULIS KODEMU (di bawah garis ini)
def cosine(a, b):
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    return dot/(na*nb)

def recall_at_1(dim):
    hits = 0
    for t, qv in Q_VECS:
        sims = [cosine(qv[:dim], dv[:dim]) for dv in DOC_VECS]
        pred = max(range(len(sims)), key=lambda i: sims[i])
        hits += (pred == t)
    return hits / len(Q_VECS)

def storage_mb(n_docs, dim):
    return n_docs * dim * 4 / 1024 / 1024

# UJI (jangan ubah)
for d in [8, 4, 2]:
    print("recall@1 dim=" + str(d) + ":", round(recall_at_1(d), 3))
print("storage dim=8:", round(storage_mb(1000000, 8), 1), "MB")
print("storage dim=2:", round(storage_mb(1000000, 2), 1), "MB")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "recall@1 dim=8: 1\\.0", label: "Recall dimensi penuh 1,0", msg: "Baseline tanpa truncation." },
          { kind: "stdout_matches", task: "t1", pattern: "recall@1 dim=4: 1\\.0", label: "Truncation 8→4 gratis", msg: "Coarse-to-fine: informasi penting di dimensi awal." },
          { kind: "stdout_matches", task: "t1", pattern: "recall@1 dim=2: 0\\.667", label: "Truncation 8→2 mulai membayar", msg: "Titik patah terukur — berhenti satu langkah sebelumnya." },
          { kind: "stdout_matches", task: "t2", pattern: "storage dim=8: 30\\.5 MB", label: "Storage terhitung benar", msg: "1 juta × 8 × 4 byte = 30,5 MB." },
        ],
      },
      reference: "Ukur titik patah truncation di datamu — gratis sampai terbukti membayar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: pilih, potong, atau latih?",
      prose: [
        "Skenario 1 — dokumen Indonesia / multilingual → filter leaderboard MTEB pada tugas RETRIEVAL + hasil multilingual (rujukan MMTEB). Jangan bawa pulang juara STS Inggris untuk pekerjaan retrieval Indonesia.",
        "Skenario 2 — storage/latensi/biaya API membengkak → Matryoshka truncation DULU. Potong bertahap (1024→512→256), ukur recall@5 tiap tahap, berhenti satu langkah sebelum titik patah. Eksperimen 30 menit.",
        "Skenario 3 — istilah domain spesifik gagal dikenali (sinonim hukum, kode produk, singkatan internal) → fine-tune contrastive. Syarat: ratusan pasangan (query, dokumen) berlabel dari log klik/penilaian manusia. Tanpa data label = jangan fine-tune.",
        "Skenario 4 — tidak ada data label SAMA SEKALI → jangan fine-tune; pilih model terbaik via MTEB + uji 100 sampel + hybrid BM25 untuk istilah spesifik. BM25 menutup lubang istilah tanpa sebaris data latih.",
        "Skenario 5 — butuh keduanya (domain spesifik + budget ketat) → fine-tune model yang SUDAH Matryoshka, lalu potong sesuai budget. Satu training, banyak ukuran deploy.",
        "Aturan praktis 10 detik: (1) tulis spesifikasi (tugas, bahasa, dimensi, latensi) SEBELUM buka leaderboard. (2) shortlist 3 via MTEB retrieval. (3) uji 100 sampel domainmu — pemenang di sini yang dipakai. (4) potong dengan Matryoshka bila perlu. (5) fine-tune hanya bila istilah domain masih gagal.",
      ],
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Model embedding terbesar = retrieval terbaik.' Temuan kunci MTEB membantahnya langsung: tidak ada metode yang dominan di semua tugas — model kecil yang tepat mengalahkan raksasa di tugas dan bahasa yang spesifik (kasus legal-tech: 400M multilingual > 7B English-centric untuk retrieval Indonesia). Parameter = kapasitas, bukan relevansi. Ukur di tugasMU.",
      },
    },
    {
      id: "minicase-legaltech",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: 1 juta chunk hukum, 4 GB vs 1 GB",
      prose: [
        "Situasi: startup legal-tech, 1 juta chunk dokumen hukum Indonesia. Pilihan awal: model 7B English-centric, 1024 dimensi, float32. Storage vektor: 1 juta × 1024 × 4 byte = 4 GB — belum termasuk index HNSW. Uji 100 pasangan query-dokumen berlabel: recall@5 = 0,71. Query 'wanprestasi' gagal menemukan 'ingkar janji'.",
        "Intervensi bertahap. Tahap 1 — seleksi ulang via MTEB: shortlist 3 model dengan skor retrieval multilingual tertinggi, uji pada 100 sampel: pemenang = model 400M multilingual, 768 dimensi, recall@5 = 0,87 (+16 poin). Storage: 1 juta × 768 × 4 = 3 GB. Tahap 2 — Matryoshka truncation 768→256: recall@5 = 0,86 (-1 poin), storage = 1 GB (-67%). Tahap 3 — fine-tune contrastive dengan 2.000 pasangan dari log klik 3 bulan: recall@5 = 0,91 (+5 poin) pada istilah hukum spesifik.",
        "Hasil akhir: recall@5 0,71 → 0,91 (+20 poin), storage 4 GB → 1 GB, latensi query turun ~3x (vektor lebih pendek). Total biaya: 2 jam uji seleksi + 1 hari setup truncation + 2 hari fine-tune — vs 3 bulan performa buruk karena 'model terbesar pasti terbaik'.",
        "Pembahasan: perhatikan urutannya — seleksi DULU (gratis, 2 jam), potong KEDUA (murah, 1 hari), latih TERAKHIR (mahal, butuh data). Kebanyakan tim membalik urutan: langsung fine-tune model yang salah pilih. Dan angka yang meyakinkan manajemen bukan 'recall naik 20 poin', melainkan 'storage -75%, latensi -67%, akurasi +20 poin' — metrik teknik diterjemahkan ke metrik bisnis.",
      ],
      tasks: [],
    },    {
      id: "ann-hnsw-pgvector",
      eyebrow: "Langkah 7 · ANN & vector DB",
      title: "ANN, HNSW, pgvector: kapan brute force menyerah",
      prose: [
        "Pencarian brute force membandingkan query dengan SEMUA vektor: 1 juta vektor kali 768 dimensi berarti sekitar 768 juta perkalian per query (angka ilustratif). Akurat sempurna, tetapi lambat — dan melambat linear saat korpus tumbuh. ANN (approximate nearest neighbor) menukar sedikit recall dengan kecepatan besar: jawaban yang hampir benar, jauh lebih cepat.",
        "HNSW (Hierarchical Navigable Small World) adalah algoritma ANN yang paling dipakai: vektor disusun dalam graf berlapis — lapisan atas jarang dan kasar untuk melompat jauh, lapisan bawah padat untuk presisi. Pencarian menavigasi dari atas ke bawah seperti peta: zoom out untuk arah, zoom in untuk alamat. Kompleksitasnya kira-kira logaritmik terhadap ukuran korpus, bukan linear.",
        "pgvector adalah ekstensi Postgres yang memberi tipe data vector plus index HNSW dan IVFFlat. Pilih pgvector bila datamu sudah di Postgres dan skalanya menengah: satu database untuk data relasional dan vektor, tanpa layanan baru. Pilih vector DB khusus (Qdrant, Weaviate, Pinecone) bila skalanya besar atau butuh filtering metadata yang kaya dan replikasi khusus vektor.",
        "Angka ilustratif untuk 1 juta vektor 768 dimensi: brute force sekitar 400 ms per query, HNSW sekitar 8 ms di perangkat keras yang sama — sekitar 50 kali lebih cepat dengan recall@10 sekitar 0,99. Angka pastinya tergantung perangkat keras dan parameter — karena itu aturannya: ukur recall@k di datamu sendiri, jangan percaya brosur. Recall 0,99 berarti 1 dari 100 tetangga terbaik terlewat; untuk RAG, itu biasanya jauh lebih murah daripada 400 ms per query.",
        "Untuk HNSW sampai ke implementasi dan matematikanya — termasuk kapan ANN kalah dari brute force dan cara mengukur recall — lanjut ke MLE21 — ANN & Vector Search di track Machine Learning Engineer (modul bersama lintas track).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memilih vector DB khusus untuk 50 ribu vektor yang sudah ada di Postgres. HNSW di pgvector cukup — layanan baru berarti operasi baru, backup baru, dan tagihan baru. Skala dulu, teknologi mengikuti.",
      },
      reference: "Brute force linear, HNSW kira-kira logaritmik. pgvector bila data sudah di Postgres; vector DB khusus bila skala besar.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan dari semua langkah. Setiap opsi menjelaskan alasan benar/salahnya.",
      ],
      tasks: [],
      summary: [
        "MTEB (8 tugas, 58 dataset, 112 bahasa): tidak ada metode embedding yang dominan di semua tugas — 'terbaik' tanpa menyebut tugas = tidak bermakna.",
        "Baca leaderboard dengan spesifikasi: filter tugas = retrieval, perhatikan bahasa (MMTEB untuk multilingual), jangan pakai skor rata-rata.",
        "Keputusan final = uji 100 pasangan berlabel dari domainmu (±2 jam); leaderboard hanya shortlist.",
        "Fine-tune contrastive (InfoNCE) untuk istilah domain spesifik — butuh ratusan pasangan berlabel; tanpa data = jangan.",
        "Matryoshka: satu model, potong dimensi sesuai budget tanpa latih ulang — ukur titik patahnya; urutan hemat: pilih → potong → latih.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Apa temuan kunci paper MTEB?",
          options: [
            { text: "Tidak ada satu metode embedding pun yang mendominasi semua tugas", why: "Tepat: 33 model di-benchmark — bidang belum konvergen ke metode universal.", correct: true },
            { text: "Model terbesar selalu menang", why: "Kebalikannya — ukuran tidak menjamin dominasi lintas tugas.", correct: false },
            { text: "STS cukup untuk menilai semua embedding", why: "Justru masalah yang diselesaikan MTEB: STS saja tidak cukup.", correct: false },
            { text: "Semua model sama bagusnya", why: "Tidak — peringkat BERBEDA per tugas, itulah temuannya.", correct: false },
          ],
        },
        {
          q: "Mengapa skor rata-rata leaderboard berbahaya untuk memilih model RAG?",
          options: [
            { text: "Rata-rata menyembunyikan kekalahan di tugas yang penting bagimu", why: "Tepat: model A menang rata-rata tetapi kalah di retrieval Indonesia — satu-satunya yang penting.", correct: true },
            { text: "Rata-rata sulit dihitung", why: "Mudah dihitung; masalahnya maknanya.", correct: false },
            { text: "Leaderboard tidak menampilkan rata-rata", why: "Menampilkan; justru itu yang menipu.", correct: false },
            { text: "Rata-rata selalu salah secara matematis", why: "Matematikanya benar; relevansinya yang salah.", correct: false },
          ],
        },
        {
          q: "Kapan fine-tune embedding merupakan keputusan TEPAT?",
          options: [
            { text: "Domain beristilah khusus + ratusan pasangan (query, dokumen) berlabel tersedia", why: "Tepat: contrastive learning butuh data pasangan berkualitas.", correct: true },
            { text: "Baru mulai dan belum punya data label sama sekali", why: "Tanpa data label fine-tune = overfit; pilih model + hybrid dulu.", correct: false },
            { text: "Ingin storage lebih kecil", why: "Itu pekerjaan Matryoshka truncation, bukan fine-tune.", correct: false },
            { text: "Selalu — fine-tune tidak pernah merugikan", why: "Risiko catastrophic forgetting + biaya; bukan gratis.", correct: false },
          ],
        },
        {
          q: "Apa keuntungan utama Matryoshka Representation Learning?",
          options: [
            { text: "Satu model, potong dimensi sesuai budget tanpa latih ulang", why: "Tepat: coarse-to-fine bersarang; hingga 14x lebih kecil dengan akurasi setara.", correct: true },
            { text: "Menghapus kebutuhan akan embedding", why: "Tetap embedding — hanya fleksibel ukurannya.", correct: false },
            { text: "Otomatis memilih model terbaik di MTEB", why: "Tidak ada hubungannya dengan seleksi model.", correct: false },
            { text: "Membuat training 14x lebih cepat", why: "Paper mengklaim hingga 14x lebih kecil/cepat saat RETRIEVAL, bukan training.", correct: false },
          ],
        },
        {
          q: "Urutan kerja yang paling hemat untuk masalah embedding?",
          options: [
            { text: "Pilih via MTEB + uji 100 sampel → potong Matryoshka → fine-tune bila masih gagal", why: "Tepat: dari gratis ke mahal; tiap tahap diukur.", correct: true },
            { text: "Langsung fine-tune model terbesar", why: "Termahal dulu tanpa diagnosis — pola yang gagal di cerita pembuka.", correct: false },
            { text: "Potong dimensi dulu baru pilih model", why: "Pilih yang tepat dulu; memotong model yang salah = menghemat kesalahan.", correct: false },
            { text: "Pakai skor rata-rata leaderboard langsung", why: "Itu jebakan yang dibahas seluruh lesson ini.", correct: false },
          ],
        },
        {
          q: "Korpus 1 juta dokumen, butuh recall@10 sekitar 0,99 dan latensi di bawah 20 ms per query. Pilihan yang tepat?",
          options: [
            { text: "Brute force atas semua vektor", why: "Akurat tetapi sekitar 400 ms per query pada skala ini — melanggar latensi.", },
            { text: "HNSW — lewat pgvector bila data sudah di Postgres, atau vector DB khusus bila skala/filtering menuntut", why: "Benar: sekitar 8 ms dengan recall 0,99 — menukar 1 persen recall dengan kecepatan 50 kali lipat.", correct: true },
            { text: "BM25 saja tanpa vektor", why: "BM25 tidak menangkap kesamaan makna — recall semantiknya jatuh.", },
            { text: "Perkecil embedding ke 8 dimensi agar brute force cepat", why: "Itu menghancurkan kualitas retrieval demi kecepatan — HNSW menyelesaikan keduanya.", },
          ],
        },
      ],
    },
  ],
};
