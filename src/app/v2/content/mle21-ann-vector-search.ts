import type { V2Lesson } from "../lib/types";

// Kurva recall@10 vs nprobe dari Lab 2 (seed 22, data berisik sigma=3.0):
// nprobe 1/2/4/8/16 -> recall 0.870/0.920/0.970/0.990/1.000, speedup 32/16/8/4/2x.
const FIG_RECALL = `<svg viewBox="0 0 480 270" role="img" aria-label="recall@10 naik saat nprobe membesar; target 0,95 tercapai di nprobe=4.">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600" font-family="var(--font-ui)">recall@10 vs nprobe (data berisik)</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="210" x2="460" y2="210"/><line x1="60" y1="150" x2="460" y2="150"/><line x1="60" y1="90" x2="460" y2="90"/><line x1="60" y1="40" x2="460" y2="40"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="214">0,85</text><text x="54" y="154">0,90</text><text x="54" y="94">0,95</text><text x="54" y="44">1,00</text></g>
<line x1="60" y1="90" x2="460" y2="90" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="8 5"/>
<text x="452" y="82" font-size="11" fill="#e11d48" font-family="var(--font-ui)" text-anchor="end">target 0,95</text>
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="72" y="186" width="52" height="24" fill="var(--c2)" opacity="0.9"/><text x="98" y="230" fill="var(--chart-text)">n=1</text><text x="98" y="178" fill="var(--text)" font-size="11">0,870</text><text x="98" y="248" fill="var(--text-muted)" font-size="10">32x</text>
<rect x="152" y="126" width="52" height="84" fill="var(--c2)" opacity="0.9"/><text x="178" y="230" fill="var(--chart-text)">n=2</text><text x="178" y="118" fill="var(--text)" font-size="11">0,920</text><text x="178" y="248" fill="var(--text-muted)" font-size="10">16x</text>
<rect x="232" y="66" width="52" height="144" fill="var(--c1)" opacity="0.9"/><text x="258" y="230" fill="var(--chart-text)">n=4</text><text x="258" y="58" fill="var(--text)" font-size="11">0,970</text><text x="258" y="248" fill="var(--text-muted)" font-size="10">8x</text>
<rect x="312" y="42" width="52" height="168" fill="var(--c2)" opacity="0.9"/><text x="338" y="230" fill="var(--chart-text)">n=8</text><text x="338" y="34" fill="var(--text)" font-size="11">0,990</text><text x="338" y="248" fill="var(--text-muted)" font-size="10">4x</text>
<rect x="392" y="30" width="52" height="180" fill="var(--c2)" opacity="0.9"/><text x="418" y="230" fill="var(--chart-text)">n=16</text><text x="418" y="22" fill="var(--text)" font-size="11">1,000</text><text x="418" y="248" fill="var(--text-muted)" font-size="10">2x</text>
</g>
<text x="240" y="264" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">nprobe membesar: recall naik, penghematan komputasi turun</text>
</svg>`;

// Skema HNSW: 3 lapisan; atas jarang (lompatan jauh), bawah rapat (tetangga dekat).
const FIG_HNSW = `<svg viewBox="0 0 480 300" role="img" aria-label="HNSW: tiga lapisan graf; pencarian turun dari lompatan jauh ke tetangga dekat.">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600" font-family="var(--font-ui)">HNSW: jalan tol di atas, jalan lokal di bawah</text>
<g font-family="var(--font-ui)" font-size="11">
<text x="16" y="70" fill="var(--text-muted)">lapisan 2</text>
<text x="16" y="160" fill="var(--text-muted)">lapisan 1</text>
<text x="16" y="250" fill="var(--text-muted)">lapisan 0</text>
<g stroke="var(--c4)" stroke-width="2">
<line x1="100" y1="66" x2="220" y2="66"/><line x1="220" y1="66" x2="340" y2="66"/><line x1="100" y1="66" x2="340" y2="66"/>
<circle cx="100" cy="66" r="9" fill="var(--c4)"/><circle cx="220" cy="66" r="9" fill="var(--c4)"/><circle cx="340" cy="66" r="9" fill="#e11d48"/>
</g>
<g stroke="var(--c2)" stroke-width="1.5">
<line x1="80" y1="156" x2="140" y2="156"/><line x1="140" y1="156" x2="200" y2="156"/><line x1="200" y1="156" x2="260" y2="156"/><line x1="260" y1="156" x2="320" y2="156"/><line x1="320" y1="156" x2="380" y2="156"/>
<circle cx="80" cy="156" r="7" fill="var(--c2)"/><circle cx="140" cy="156" r="7" fill="var(--c2)"/><circle cx="200" cy="156" r="7" fill="var(--c2)"/><circle cx="260" cy="156" r="7" fill="var(--c2)"/><circle cx="320" cy="156" r="7" fill="#e11d48"/><circle cx="380" cy="156" r="7" fill="var(--c2)"/>
</g>
<g stroke="var(--c1)" stroke-width="1">
<line x1="70" y1="246" x2="110" y2="246"/><line x1="110" y1="246" x2="150" y2="246"/><line x1="150" y1="246" x2="190" y2="246"/><line x1="190" y1="246" x2="230" y2="246"/><line x1="230" y1="246" x2="270" y2="246"/><line x1="270" y1="246" x2="310" y2="246"/><line x1="310" y1="246" x2="350" y2="246"/><line x1="350" y1="246" x2="390" y2="246"/><line x1="390" y1="246" x2="430" y2="246"/>
<g fill="var(--c1)"><circle cx="70" cy="246" r="6"/><circle cx="110" cy="246" r="6"/><circle cx="150" cy="246" r="6"/><circle cx="190" cy="246" r="6"/><circle cx="230" cy="246" r="6"/><circle cx="270" cy="246" r="6"/><circle cx="310" cy="246" r="6"/><circle cx="350" cy="246" r="6" fill="#e11d48"/><circle cx="390" cy="246" r="6"/><circle cx="430" cy="246" r="6"/></g>
</g>
<g stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="4 3"><line x1="340" y1="75" x2="320" y2="149"/><line x1="320" y1="163" x2="350" y2="239"/></g>
<path d="M 340 66 L 320 156 L 350 246" fill="none" stroke="#e11d48" stroke-width="2.5" marker-end="url(#ah2)"/>
<defs><marker id="ah2" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="#e11d48" stroke-width="1.5"/></marker></defs>
<text x="392" y="110" fill="var(--text)" font-size="11">query masuk</text>
<text x="392" y="126" fill="var(--text)" font-size="11">di puncak,</text>
<text x="392" y="142" fill="var(--text)" font-size="11">turun greedy</text>
<text x="392" y="200" fill="var(--text)" font-size="11">beam search (ef)</text>
<text x="392" y="216" fill="var(--text)" font-size="11">di lapisan 0</text>
</g>
<text x="240" y="292" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">atas: sedikit node, lompatan jauh (ef=1) · bawah: semua node, presisi (ef = dial)</text>
</svg>`;

export const mle21: V2Lesson = {
  slug: "mle21-ann-vector-search",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE21 — Vector Search at Scale: HNSW & ANN",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-tanyadok",
      eyebrow: "Langkah 1 · Cerita",
      title: "Chatbot yang menjawab setelah pasiennya pulang",
      prose: [
        "Startup kesehatan “TanyaDok” meluncurkan chatbot RAG: tiap pertanyaan pasien diubah menjadi vektor 768-dimensi, lalu dicari 10 dokumen medis paling mirip dari 100 juta potongan artikel. Demo ke investor berjalan mulus — dengan 10 ribu dokumen. Saat korpus naik ke 100 juta, tiap pertanyaan butuh 14 detik untuk dijawab. Pasien menutup aplikasi di detik ke-4. Tim menambah GPU — tetap 9 detik. Masalahnya bukan hardware: 100 juta × 768 perkalian = 76,8 miliar operasi, dan 307 GB memori harus dibaca, untuk SATU pertanyaan.",
        "Solusinya datang bukan dari GPU yang lebih besar, melainkan dari pertanyaan yang lebih cerdas: “apakah kita benar-benar harus membandingkan dengan SEMUA 100 juta?” Jawabannya tidak. Dengan indeks yang tepat, 10 tetangga terdekat bisa ditemukan dalam 15 milidetik — 900x lebih cepat — dengan mengorbankan hanya 2-3% akurasi yang bahkan tidak terlihat oleh pengguna. Teknik inilah yang dipakai Pinecone, Weaviate, dan pencarian vektor Google: Approximate Nearest Neighbor (ANN) search.",
        "Twist-nya: di vector search, “exact” adalah kemewahan yang tidak kamu butuhkan, dan “approximate” bukan tebakan liar — ia terukur presisi sebagai recall. Lesson ini membangun mesinnya dari nol: IVF (partisi ruang ala FAISS) lalu HNSW (graf berlapis dari paper Malkov & Yashunin 2016), plus cara memilih titik yang tepat di kurva trade-off recall-vs-latensi. Subtitle lesson ini: Mencari 100 Juta Vektor dalam Milidetik — HNSW.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan mengapa brute-force cosine tidak bisa skala dan menghitung biayanya; (2) membangun indeks IVF dan mengukur recall@10; (3) menjelaskan cara kerja HNSW berlapis dan peran parameter M, efConstruction, ef; (4) memilih nprobe/ef dari kurva recall-vs-latensi; (5) memetakan kapan memakai brute force, IVF-PQ, HNSW, atau ScaNN.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · IVF dan recall@k — Langkah 3 · Lab IVF — Langkah 4 · HNSW — Langkah 5 · Lab recall-latency — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Brute force 100M vektor = belasan detik/query. ANN = milidetik dengan recall terukur.",
    },
    {
      id: "konsep-ivf",
      eyebrow: "Langkah 2 · IVF dan recall@k",
      title: "IVF: jangan bandingkan dengan semua orang",
      prose: [
        "Prasyarat ringkas — embedding (aie3): model seperti word2vec atau BERT memetakan teks/gambar menjadi vektor angka; dua vektor yang searah = mirip, diukur dengan cosine similarity (1 = identik, 0 = tak berhubungan). Lesson ini mengasumsikan vektor-vektor itu sudah ada di tanganmu — pertanyaannya sekarang murni engineering: bagaimana menemukan tetangga terdekat di antara 100 juta vektor dalam milidetik?",
        "Ide IVF (Inverted File Index, dipopulerkan FAISS dari Meta) meminjam trik buku telepon: jangan cari satu per satu, kelompokkan dulu. Saat indeks dibangun, 100 juta vektor diklaster dengan k-means menjadi nlist sel (mis. 65.536), tiap vektor dicatat masuk sel mana — seperti indeks di belakang buku. Saat query datang, cari nprobe sel yang centroid-nya paling dekat dengan query, lalu bandingkan query HANYA dengan vektor di sel-sel itu. Dengan nprobe=8 dari 65.536 sel, kamu memindai ~0,01% korpus.",
        "Harga yang dibayar bernama recall@k: fraksi dari k tetangga SEJATI (hasil brute force) yang masih ditemukan oleh pencarian approximasi. recall@10 = 0,97 berarti “dari 10 tetangga terdekat yang sebenarnya, 9,7 masih ketemu”. Inilah “approximate” yang terukur — bukan tebakan, melainkan angka yang kamu pilih secara sadar, seperti di lab berikutnya.",
        "Aturan praktis dari paper FAISS (Douze dkk., 2024): jumlah komputasi jarak ≈ K_IVF + P_IVF × N/K_IVF — minimum saat K_IVF ≈ √(P_IVF × N), sehingga anjuran kasarnya nlist sebanding √N. Dan kabar baiknya: nprobe bisa diubah-ubah TANPA me-retrain indeks — dial yang bisa diputar kapan saja, persis seperti yang kamu lakukan di Lab 2.",
        "Kepribadian IVF: si pustakawan yang rapi tapi kaku. Ia brilian saat data punya struktur cluster (vektor-vektor mengelompok dalam topik), karena sel k-means selaras dengan struktur itu. Ia menderita saat data tersebar merata tanpa gugus — sel-sel menjadi arbitrer dan recall anjlok kecuali nprobe dibesarkan. Dan ia tidak suka perubahan: data baru yang masuk tiap menit memaksa k-means dilatih ulang berkala.",
      ],
      formula: String.raw`\text{recall@k} = \frac{|A_k \cap E_k|}{k}`,
      formulaNote: "recall@k = fraksi tetangga sejati yang ditemukan; A_k = top-k hasil ANN; E_k = top-k hasil brute-force (ground truth); k = jumlah tetangga yang diminta. Contoh lab: recall@10 = 0,990 dengan nprobe=1 berarti 9,9 dari 10 tetangga sejati ketemu sambil memindai hanya 3,1% korpus. Interpretasi: angka ini = 'berapa persen kebenaran yang berhasil dipertahankan demi kecepatan'.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "“ANN = tidak akurat, jadi lebih buruk dari brute force.” Salah kaprah — “approximate” di sini terukur sebagai recall, bukan vonis kualitas. HNSW yang disetel benar mencapai recall 0,99+ dalam milidetik; 1% yang hilang hampir tidak pernah mengubah jawaban akhir RAG atau rekomendasi. Perbandingan yang benar bukan akurat-vs-tidak, melainkan: titik mana di kurva recall-vs-latensi yang kontrak produkmu butuhkan?",
      },
      reference: "IVF = klaster lalu pindai nprobe sel. recall@k mengukur harga kecepatan.",
    },
    {
      id: "lab-ivf",
      eyebrow: "Langkah 3 · Lab IVF",
      title: "Lab: membangun IVF dan mengukur recall@10",
      prose: [
        "Bangun indeks IVF dari nol dengan numpy: 2.000 vektor 32-dimensi yang memang berstruktur 32 gugus (seperti topik dokumen), klaster dengan k-means sederhana (10 iterasi Lloyd), lalu untuk tiap query bandingkan top-10 brute force vs top-10 IVF pada nprobe = 1, 4, 16. Ukur dua hal: recall@10 dan persen korpus yang terpindai.",
        "Eksplorasi wajib: (1) amati nprobe=1 — recall 0,990 sambil memindai 3,1% korpus: inilah keajaiban partisi saat data berstruktur; (2) ubah noise data 1,0 → 3,0 — recall di nprobe kecil jatuh (struktur gugus kabur, sel k-means tak lagi selaras); (3) naikkan nlist 32 → 128 — sel makin kecil, pindaian makin murah, tapi butuh nprobe lebih besar untuk recall yang sama. Pada nprobe berapa recall@10 pertama kali menyentuh 1,000?",
        "Cara membaca: recall@10 = 0,990 berarti “dari 10 tetangga sejati, rata-rata 9,9 masih ditemukan”. Interpretasi: kolom “terpindai” adalah tagihan kecepatanmu — 3,1% berarti ~32x lebih sedikit komputasi jarak daripada brute force, dengan harga hanya 1% tetangga yang meleset.",
      ],
      tasks: [
        { id: "t1", text: "Bangun `Q`/`Qn` (20 query) dan `exact` = top-10 brute force per query" },
        { id: "t2", text: "Tulis `ivf(nprobe)` yang mengembalikan `(recall@10, persen_terpindai)`; UJI mencetak untuk nprobe 1, 4, 16" },
      ],
      expected: "nprobe=1 recall@10=0.990 terpindai=3.1% · nprobe=4 recall@10=1.000 terpindai=12.5% · nprobe=16 recall@10=1.000 terpindai=50.0%",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "IVF = “tanya satpam gedung dulu”. Daripada mengetuk 2.000 pintu (brute force), kamu tanya satpam “tamu saya mirip penghuni lantai berapa?” (cari sel terdekat), lalu hanya mengetuk pintu di lantai itu. Kalau penghuni memang mengelompok per lantai (data berstruktur), tamu ketemu dalam sekejap.",
      },
      hints: [
        "query: Q = centers[rng.integers(0, nlist, nq)] + rng.normal(0, 1.0, (nq, d)), lalu normalisasi",
        "exact: np.argsort(-(Qn @ Xn.T), axis=1)[:, :10]",
        "sel terdekat: np.argsort(-(Qn @ C.T), axis=1)[:, :nprobe]; kandidat = gabungan vektor di sel-sel itu",
        "recall = rata-rata |top10_ivf ∩ top10_exact| / 10; terpindai = nprobe/nlist*100",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(21)
n, d, nlist, nq = 2000, 32, 32, 20
centers = rng.normal(0, 3, (nlist, d))
lab = rng.integers(0, nlist, n)
X = centers[lab] + rng.normal(0, 1.0, (n, d))
Xn = X / np.linalg.norm(X, axis=1, keepdims=True)
C = Xn[rng.choice(n, nlist, replace=False)]
for _ in range(10):
    a = ((Xn[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)
    for j in range(nlist):
        m = a == j
        if m.any():
            C[j] = Xn[m].mean(0)

# TULIS KODEMU
# TODO t1: Q = 20 query (centers + noise), Qn = normalisasi; exact = top-10 brute force
# TODO t2: fungsi ivf(nprobe) -> (recall@10, persen_terpindai)

# UJI (jangan ubah)
for np_ in (1, 4, 16):
    rec, pct = ivf(np_)
    print(f"nprobe={np_} recall@10={rec:.3f} terpindai={pct:.1f}%")`,
        lockLines: 16,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(21)
n, d, nlist, nq = 2000, 32, 32, 20
centers = rng.normal(0, 3, (nlist, d))
lab = rng.integers(0, nlist, n)
X = centers[lab] + rng.normal(0, 1.0, (n, d))
Xn = X / np.linalg.norm(X, axis=1, keepdims=True)
C = Xn[rng.choice(n, nlist, replace=False)]
for _ in range(10):
    a = ((Xn[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)
    for j in range(nlist):
        m = a == j
        if m.any():
            C[j] = Xn[m].mean(0)

# TULIS KODEMU
Q = centers[rng.integers(0, nlist, nq)] + rng.normal(0, 1.0, (nq, d))
Qn = Q / np.linalg.norm(Q, axis=1, keepdims=True)
exact = np.argsort(-(Qn @ Xn.T), axis=1)[:, :10]

def ivf(nprobe):
    near = np.argsort(-(Qn @ C.T), axis=1)[:, :nprobe]
    rec = 0.0
    for i in range(nq):
        cand = np.concatenate([np.where(a == c)[0] for c in near[i]])
        s = Xn[cand] @ Qn[i]
        top = cand[np.argsort(-s)[:10]]
        rec += len(set(top) & set(exact[i])) / 10
    return round(rec / nq, 3), round(nprobe / nlist * 100, 1)

# UJI (jangan ubah)
for np_ in (1, 4, 16):
    rec, pct = ivf(np_)
    print(f"nprobe={np_} recall@10={rec:.3f} terpindai={pct:.1f}%")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "nprobe=1\\s+recall@10=0\\.990", label: "nprobe=1: recall@10 = 0.990", msg: "Brute-force top-10 dan normalisasi query benar." },
          { kind: "stdout_matches", task: "t2", pattern: "nprobe=16\\s+recall@10=1\\.000", label: "nprobe=16: recall@10 = 1.000", msg: "Agregasi kandidat antar-sel benar." },
          { kind: "stdout_matches", task: "t2", pattern: "terpindai=3\\.1%", label: "Hanya 3,1% korpus terpindai", msg: "Fraksi pindaian = nprobe/nlist." },
        ],
      },
      reference: "IVF dari nol: k-means, sel terdekat, recall@10 vs fraksi terpindai.",
    },
    {
      id: "konsep-hnsw",
      eyebrow: "Langkah 4 · HNSW",
      title: "HNSW: jalan tol di atas graf",
      prose: [
        "Papernya: “Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs”, Malkov & Yashunin, arXiv 1603.09320 (2016; versi jurnal TPAMI 2020). Idenya meminjam dari teori six degrees of separation: di small-world graph, tiap node bisa mencapai node mana pun dalam sedikit lompatan. HNSW menumpuk BANYAK graf berlapis — lapisan atas berisi sedikit node dengan koneksi jarak jauh (“jalan tol”), lapisan bawah berisi semua node dengan koneksi ke tetangga dekat (“jalan lokal”).",
        "Cara mencari: query masuk di puncak, bergerak greedy (ef=1, selalu ke tetangga terdekat) melintasi jalan tol sampai tak bisa lebih dekat, lalu TURUN satu lapisan dan ulangi — makin ke bawah makin presisi. Di lapisan 0 (dasar), pencarian berubah menjadi beam search dengan lebar kandidat ef: makin besar ef, makin banyak kandidat dijelajahi, makin tinggi recall, makin lambat. Tiga parameter mengendalikan semuanya: M = jumlah koneksi maksimum per node per lapisan (default 16; lapisan 0 dapat 2M); efConstruction = lebar beam SAAT membangun graf (default 200 — makin besar, graf makin berkualitas, build makin lambat); ef = lebar beam SAAT query — inilah dial recall-vs-latensi yang bisa diputar per query TANPA rebuild.",
        "Detail yang sering ditanya di interview: tiap node mendapat “lantai” acak dari distribusi eksponensial (level = floor(-ln(uniform) × mL), mL = 1/ln(M)) — sedikit node mencapai puncak, seperti piramida. Koneksi dipilih dengan heuristik diversitas arah (bukan sekadar “M tetangga terdekat”), agar graf tidak punya jalan buntu. Dan HNSW mendukung incremental indexing: vektor baru disisipkan kapan saja tanpa membangun ulang — keunggulan besar atas IVF yang butuh retrain k-means.",
        "Keluarga besar ANN di produksi: FAISS (Meta; Johnson–Douze–Jégou 2017, pustaka oleh Douze dkk. 2024) menyediakan semuanya — IVF, PQ (kompresi product quantization), dan HNSW — sering digabung (mis. IVF10000_HNSW32,PQ16: partisi IVF + kuantisasi PQ + HNSW sebagai coarse quantizer). ScaNN (Google Research; Guo dkk. 2020, “Accelerating Large-Scale Inference with Anisotropic Vector Quantization”) mengambil jalur berbeda: kuantisasi yang dirancang khusus untuk maximum inner-product search, plus pruning ruang pencarian — mencapai state-of-the-art di benchmark ann-benchmarks (glove-100-angular). Pilihannya bukan “mana yang terbaik”, melainkan “mana yang cocok dengan kendalanya” — itulah Lab 2 dan peta keputusan.",
      ],
      formula: String.raw`N_{\text{dist}} = K_{\text{IVF}} + P_{\text{IVF}} \times \frac{N}{K_{\text{IVF}}}`,
      formulaNote: "N_dist = jumlah komputasi jarak per query (model biaya FAISS); K_IVF = nlist (jumlah sel); P_IVF = nprobe (sel yang dipindai); N = ukuran korpus. Contoh konkret: N = 100 juta, K_IVF = 100 ribu, P_IVF = 10 → 100rb + 10 × 1.000 = 110rb komputasi vs 100 juta brute force — ~900x lebih sedikit. Interpretasi: rumus ini = 'kalkulator tagihan' sebelum kamu menulis satu baris kode indeks.",
      figure: {
        svg: FIG_HNSW,
        alt: "HNSW tiga lapisan: query masuk di puncak, turun greedy, beam search di lapisan dasar.",
        caption: "Pencarian HNSW: jalan tol di atas (ef=1), presisi di bawah (ef = dial).",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "“M lebih besar selalu lebih baik.” Salah — paper HNSW sendiri menunjukkan diminishing returns: M=40 tidak lebih baik secara bermakna dari M=20, sementara memori dan waktu build naik terus. M mengendalikan kepadatan jalan (kualitas graf), ef mengendalikan usaha pencarian (recall saat query). Naikkan M secukupnya sekali saat build; putar ef setiap hari sesuai SLA.",
      },
      reference: "HNSW = graf berlapis; M/efConstruction saat build, ef saat query. Incremental, tanpa retrain.",
    },
    {
      id: "lab-tradeoff",
      eyebrow: "Langkah 5 · Lab recall-latency",
      title: "Lab: memilih titik di kurva recall-vs-latensi",
      prose: [
        "Sekarang datanya dibuat lebih berisik (seperti embedding dunia nyata yang tidak rapi) dan tugasmu adalah keputusan engineering sungguhan: sapu nprobe = 1, 2, 4, 8, 16, catat recall@10 dan speedup vs brute force (speedup = nlist/nprobe), lalu pilih nprobe TERKECIL yang mencapai recall@10 ≥ 0,95 — titik termurah yang masih memenuhi kontrak.",
        "Eksplorasi wajib: (1) bandingkan kurva ini dengan Lab 1 (data bersih) — data berisik butuh nprobe 4x lebih besar untuk recall yang sama; (2) ubah target 0,95 → 0,99 — berapa nprobe sekarang, dan berapa speedup yang tersisa? (3) renungkan: nprobe=16 memberi recall 1,000 tapi hanya 2x lebih hemat dari brute force — pada titik itu, untuk apa indeksnya?",
        "Cara membaca chart: sumbu-x = nprobe (usaha pencarian), sumbu-y = recall@10, angka kecil di bawah tiap bar = speedup vs brute force, garis merah = target kontrak 0,95. Interpretasi: bar hijau (nprobe=4) adalah titik termurah yang menembus garis merah — recall 0,970 dengan 8x penghematan. Bar di kanannya = membayar komputasi lebih untuk recall yang nyaris tidak naik: diminishing returns yang terlihat.",
      ],
      figure: {
        svg: FIG_RECALL,
        alt: "recall@10 naik 0,870 → 1,000 saat nprobe 1 → 16; target 0,95 tercapai di nprobe=4.",
        caption: "Kurva trade-off dari lab: nprobe=4 = titik termurah di atas target.",
      },
      tasks: [
        { id: "t1", text: "Isi `hasil` = list `(nprobe, recall@10, speedup)` untuk nprobe 1, 2, 4, 8, 16; print tiap baris" },
        { id: "t2", text: "Tulis `pilih(hasil)` = nprobe terkecil dengan recall ≥ 0.95; print pilihan" },
      ],
      expected: "nprobe= 4 recall@10=0.970 speedup=8.0x · ringkasan: [(1, 0.87), (2, 0.92), (4, 0.97), (8, 0.99), (16, 1.0)] · nprobe_pilihan = 4",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Memilih nprobe = memilih “berapa lantai yang diketuk satpam”. Target recall adalah kontrak dengan produk: di bawahnya, jawaban salah; di atasnya, kamu membakar uang komputasi untuk presisi yang tak terlihat. Engineer yang baik bukan yang memaksimalkan recall, melainkan yang menemukan titik termurah di atas garis merah.",
      },
      hints: [
        "recall dihitung seperti Lab 1; speedup = nlist / nprobe",
        "pilih: min(p for p, r, s in hasil if r >= 0.95)",
        "format print t1: f\"nprobe={np_:2d} recall@10={rec:.3f} speedup={nlist/np_:.1f}x\"",
      ],
      code: {
        starter: `# SEED — jangan ubah (index IVF sudah jadi, data berisik)
import numpy as np
rng = np.random.default_rng(22)
n, d, nlist, nq = 2000, 32, 32, 20
centers = rng.normal(0, 3, (nlist, d))
lab = rng.integers(0, nlist, n)
X = centers[lab] + rng.normal(0, 3.0, (n, d))
Xn = X / np.linalg.norm(X, axis=1, keepdims=True)
C = Xn[rng.choice(n, nlist, replace=False)]
for _ in range(10):
    a = ((Xn[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)
    for j in range(nlist):
        m = a == j
        if m.any():
            C[j] = Xn[m].mean(0)
Q = centers[rng.integers(0, nlist, nq)] + rng.normal(0, 3.0, (nq, d))
Qn = Q / np.linalg.norm(Q, axis=1, keepdims=True)
exact = np.argsort(-(Qn @ Xn.T), axis=1)[:, :10]

# TULIS KODEMU
# TODO t1: hasil = [(nprobe, recall@10, speedup) untuk nprobe di (1,2,4,8,16)]; print tiap baris
# TODO t2: pilih(hasil) = nprobe terkecil dengan recall >= 0.95; print pilihan

# UJI (jangan ubah)
print("ringkasan:", [(p, round(r, 3)) for p, r, s in hasil])
print("nprobe_pilihan =", pilih(hasil))`,
        lockLines: 19,
        solution: `# SEED — jangan ubah (index IVF sudah jadi, data berisik)
import numpy as np
rng = np.random.default_rng(22)
n, d, nlist, nq = 2000, 32, 32, 20
centers = rng.normal(0, 3, (nlist, d))
lab = rng.integers(0, nlist, n)
X = centers[lab] + rng.normal(0, 3.0, (n, d))
Xn = X / np.linalg.norm(X, axis=1, keepdims=True)
C = Xn[rng.choice(n, nlist, replace=False)]
for _ in range(10):
    a = ((Xn[:, None, :] - C[None]) ** 2).sum(-1).argmin(1)
    for j in range(nlist):
        m = a == j
        if m.any():
            C[j] = Xn[m].mean(0)
Q = centers[rng.integers(0, nlist, nq)] + rng.normal(0, 3.0, (nq, d))
Qn = Q / np.linalg.norm(Q, axis=1, keepdims=True)
exact = np.argsort(-(Qn @ Xn.T), axis=1)[:, :10]

# TULIS KODEMU
hasil = []
for np_ in (1, 2, 4, 8, 16):
    near = np.argsort(-(Qn @ C.T), axis=1)[:, :np_]
    rec = 0.0
    for i in range(nq):
        cand = np.concatenate([np.where(a == c)[0] for c in near[i]])
        s = Xn[cand] @ Qn[i]
        top = cand[np.argsort(-s)[:10]]
        rec += len(set(top) & set(exact[i])) / 10
    rec /= nq
    hasil.append((np_, rec, nlist / np_))
    print(f"nprobe={np_:2d} recall@10={rec:.3f} speedup={nlist/np_:.1f}x")

def pilih(hasil):
    return min(p for p, r, s in hasil if r >= 0.95)

print(f"pilihan: nprobe={pilih(hasil)} (recall >= 0.95, hemat komputasi maksimal)")

# UJI (jangan ubah)
print("ringkasan:", [(p, round(r, 3)) for p, r, s in hasil])
print("nprobe_pilihan =", pilih(hasil))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "nprobe=\\s*4\\s+recall@10=0\\.970", label: "nprobe=4: recall@10 = 0.970", msg: "Sweep nprobe dan perhitungan recall benar." },
          { kind: "stdout_matches", task: "t2", pattern: "nprobe_pilihan\\s*=\\s*4", label: "Pilihan nprobe = 4", msg: "nprobe terkecil di atas target 0,95." },
        ],
      },
      reference: "Sapu nprobe, pilih titik termurah di atas target recall.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: index apa untuk korpusmu?",
      prose: [
        "Skenario 1 — korpus < 100 ribu vektor → brute force (IndexFlat). Eksak, tanpa parameter, dan cukup cepat — ANN adalah optimasi prematur di sini.",
        "Skenario 2 — 100 ribu–10 juta vektor, RAM longgar, butuh recall ≥ 0,97 → HNSW (M=16, efConstruction=200). Putar ef per query sesuai SLA; data baru bisa disisipkan kapan saja.",
        "Skenario 3 — > 10 juta vektor atau RAM terbatas → IVF-PQ (FAISS): nlist ≈ √N, nprobe = dial; terima recall 0,90–0,95. Kompresi PQ memangkas memori 8–32x.",
        "Skenario 4 — butuh maximum inner-product (RAG, dot-product ranking) dengan QPS tinggi → ScaNN: kuantisasi anisotropik yang dirancang untuk MIPS, bukan sekadar jarak Euclidean.",
        "Skenario 5 — data mengalir tiap menit (feed, marketplace) → HNSW (incremental), bukan IVF murni yang butuh retrain k-means berkala.",
        "Aturan praktis 10 detik: (1) hitung tagihan brute force dulu (N × d × 4 byte, detik per query); (2) RAM cukup + recall tinggi = HNSW; (3) RAM sempit = IVF-PQ/ScaNN; (4) dial (nprobe/ef) selalu dari kurva recall-vs-latensi di datamu sendiri — bukan angka brosur.",
      ],
      tasks: [],
    },
    {
      id: "minicase-tanyadok",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 100 juta chunk, SLA 200ms, RAM 64GB",
      prose: [
        "TanyaDok kembali dengan kontrak nyata: 100 juta potongan dokumen medis (768-dimensi), SLA p95 200ms, recall@10 ≥ 0,95, dan 8 mesin @ 64GB RAM. Tiga kandidat di atas meja. Kandidat A — brute force: butuh 307 GB RAM (100jt × 768 × 4 byte) dan membaca semuanya per query = belasan detik. Mati sebelum bertanding. Kandidat B — IVF-PQ (FAISS, nlist=65536, PQ64): hanya 6,4 GB, ~10ms per query, tetapi recall@10 ≈ 0,93 (estimasi) — jebol target 0,95. Kandidat C — HNSW sharded ke 8 mesin (M=16): 12,5 juta vektor per mesin × ~3,3 KB ≈ 41 GB RAM, recall@10 ≈ 0,98, p95 ≈ 15ms — lolos ketiga kontrak sekaligus.",
        "Pembahasan: keputusan ini BUKAN “HNSW paling canggih” — melainkan satu-satunya kandidat yang lolos SEMUA kendala. Brute force gagal di fisika (bandwidth memori), IVF-PQ gagal di kontrak recall. Pelajaran umumnya: pilih indeks dari kendala (RAM, SLA, recall minimum), bukan dari hype. Dan perhatikan bahwa pemenangnya butuh 8 mesin, bukan 1 — biaya infra adalah bagian dari keputusan, bukan catatan kaki.",
        "Cara membaca: selalu susun tabel kandidat × kendala (RAM, latensi p95, recall@10) sebelum memilih. Interpretasi: sel yang merah = kandidat gugur, tak peduli seberapa elegan algoritmanya. Yang di-deploy = yang semua selnya hijau dengan biaya termurah.",
        "Jebakan yang dihindari: tim hampir memilih B karena “satu mesin cukup dan 0,93 kan dekat dengan 0,95” — lupa bahwa 2% recall yang hilang terkonsentrasi di dokumen langka yang justru paling kritis di domain medis.",
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
        "Brute force = N × d komputasi per query; di 100 juta vektor ia mati di bandwidth memori.",
        "IVF = klaster k-means (nlist) lalu pindai nprobe sel; nprobe = dial tanpa retrain.",
        "recall@k = fraksi tetangga sejati yang ditemukan — 'approximate' yang terukur, bukan tebakan.",
        "HNSW = graf berlapis (Malkov & Yashunin 2016): jalan tol di atas (ef=1), beam search di dasar (ef = dial).",
        "M/efConstruction = keputusan build; ef/nprobe = keputusan query — putar dari kurva recall-vs-latensi.",
        "Pilih indeks dari kendala (RAM, SLA, recall): HNSW bila RAM longgar, IVF-PQ/ScaNN bila sempit.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "recall@10 = 0,97 pada indeks ANN. Artinya?",
          options: [
            { text: "Dari 10 tetangga terdekat yang sebenarnya, rata-rata 9,7 masih ditemukan", why: "Tepat: recall@k = |ANN ∩ eksak| / k — fraksi kebenaran yang dipertahankan.", correct: true },
            { text: "Model 97% akurat", why: "Bukan akurasi model — ini fraksi tetangga sejati yang ditemukan indeks.", correct: false },
            { text: "97% query dijawab benar", why: "Query tidak punya 'benar/salah' — recall mengukur kelengkapan tetangga, bukan kebenaran jawaban.", correct: false },
            { text: "Indeks 97% lebih cepat dari brute force", why: "Kecepatan diukur terpisah (latensi/QPS) — recall hanya mengukur kualitas hasil.", correct: false },
          ],
        },
        {
          q: "nprobe dinaikkan dari 4 ke 16. Apa yang terjadi?",
          options: [
            { text: "Recall naik (atau tetap), latensi naik — lebih banyak sel dipindai", why: "Tepat: trade-off fundamental IVF, terlihat di kurva Lab 2.", correct: true },
            { text: "Recall turun karena sel bertabrakan", why: "Terbalik — sel tambahan hanya menambah kandidat, tidak merusak yang sudah ada.", correct: false },
            { text: "Tidak ada efek, nprobe hanya kosmetik", why: "nprobe adalah dial utama IVF — efeknya langsung ke recall dan latensi.", correct: false },
            { text: "Indeks harus di-retrain dulu", why: "Tidak — nprobe bisa diubah per query tanpa menyentuh indeks.", correct: false },
          ],
        },
        {
          q: "Mengapa pencarian HNSW cepat meski grafnya raksasa?",
          options: [
            { text: "Lapisan atas melompat jauh secara greedy (ef=1); presisi hanya di lapisan dasar", why: "Tepat: hierarki = jalan tol di atas, jalan lokal di bawah.", correct: true },
            { text: "Karena grafnya kecil", why: "Grafnya justru besar (semua vektor + koneksinya) — yang kecil adalah usaha pencariannya.", correct: false },
            { text: "Karena vektornya dikompresi", why: "Itu trik PQ/ScaNN — HNSW menyimpan vektor penuh dan menang lewat navigasi graf.", correct: false },
            { text: "Karena memakai GPU", why: "HNSW unggul di CPU justru karena pola aksesnya tak teratur — bukan soal GPU.", correct: false },
          ],
        },
        {
          q: "SLA mengetat: p95 harus turun dari 50ms ke 20ms, recall boleh turun sedikit. Yang diputar?",
          options: [
            { text: "Turunkan ef (HNSW) / nprobe (IVF) — dial query-time, tanpa rebuild", why: "Tepat: ef dan nprobe adalah dial recall-vs-latensi yang bisa diubah per query.", correct: true },
            { text: "Turunkan M lalu rebuild indeks", why: "M adalah keputusan build-time — rebuild mahal dan tidak perlu untuk penyesuaian SLA.", correct: false },
            { text: "Naikkan efConstruction", why: "Itu parameter build (kualitas graf), tidak berpengaruh ke latensi query yang sudah berjalan.", correct: false },
            { text: "Ganti ke brute force agar pasti cepat", why: "Terbalik total — brute force adalah yang paling lambat di korpus besar.", correct: false },
          ],
        },
        {
          q: "Korpus 100 juta vektor 768-dimensi, RAM mesin 16GB, butuh MIPS untuk RAG. Pilihan paling masuk akal?",
          options: [
            { text: "ScaNN / IVF-PQ: kuantisasi agar muat di RAM, dirancang untuk inner-product", why: "Tepat: vektor penuh butuh 307GB — kuantisasi satu-satunya jalan, dan ScaNN dioptimasi untuk MIPS.", correct: true },
            { text: "HNSW full vector di satu mesin", why: "307GB tidak muat di 16GB — HNSW butuh vektor penuh + overhead graf.", correct: false },
            { text: "Brute force dengan batching", why: "Batching tidak mengubah fisika: 307GB tetap harus dibaca per query.", correct: false },
            { text: "Kecilkan dimensi ke 8 agar muat", why: "Merusak kualitas embedding demi infra — kuantisasi (PQ/ScaNN) mempertahankan kualitas jauh lebih baik.", correct: false },
          ],
        },
      ],
    },
  ],
};
