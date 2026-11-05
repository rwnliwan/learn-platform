import type { V2Lesson } from "../lib/types";

// precision@k lab: noise=0.5, sig=2.0, d=8, seed 7 -> p@5=0.99, p@10=0.982, p@20=0.973.
const FIG_PK = `<svg viewBox="0 0 480 250" role="img" aria-label="Precision at k: turun perlahan saat k membesar.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="205" x2="460" y2="205"/><line x1="60" y1="155" x2="460" y2="155"/><line x1="60" y1="105" x2="460" y2="105"/><line x1="60" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="209">0,90</text><text x="54" y="159">0,93</text><text x="54" y="109">0,96</text><text x="54" y="59">0,99</text></g>
<g font-size="12" font-family="var(--font-ui)">
<rect x="130" y="50" width="70" height="155" fill="var(--c1)"/><text x="165" y="225" fill="var(--chart-text)" text-anchor="middle">p@5</text><text x="165" y="42" fill="var(--text)" text-anchor="middle">0,990</text>
<rect x="245" y="67" width="70" height="138" fill="var(--c2)"/><text x="280" y="225" fill="var(--chart-text)" text-anchor="middle">p@10</text><text x="280" y="59" fill="var(--text)" text-anchor="middle">0,982</text>
<rect x="360" y="84" width="70" height="121" fill="var(--c4)"/><text x="395" y="225" fill="var(--chart-text)" text-anchor="middle">p@20</text><text x="395" y="76" fill="var(--text)" text-anchor="middle">0,973</text>
</g>
<text x="260" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">k membesar, presisi turun perlahan: wajar, kandidat makin jauh</text>
</svg>`;

// Skema two-tower: query tower dan item tower bertemu di ruang embedding yang sama.
const FIG_TWOTOWER = `<svg viewBox="0 0 480 260" role="img" aria-label="Skema two-tower: dua menara, satu ruang embedding.">
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<rect x="20" y="100" width="120" height="70" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/><text x="80" y="128" fill="var(--text)">menara</text><text x="80" y="146" fill="var(--text)">query</text>
<rect x="340" y="100" width="120" height="70" rx="8" fill="none" stroke="var(--c2)" stroke-width="2"/><text x="400" y="128" fill="var(--text)">menara</text><text x="400" y="146" fill="var(--text)">item</text>
<rect x="185" y="100" width="110" height="70" rx="8" fill="none" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4"/><text x="240" y="128" fill="var(--text)">ruang</text><text x="240" y="146" fill="var(--text)">embedding</text>
<line x1="140" y1="135" x2="185" y2="135" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/><line x1="340" y1="135" x2="295" y2="135" stroke="var(--chart-text)" stroke-width="2" marker-end="url(#ah)"/>
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="none" stroke="var(--chart-text)" stroke-width="1.5"/></marker></defs>
<text x="80" y="200" fill="var(--chart-text)">user, playlist, konteks</text>
<text x="400" y="200" fill="var(--chart-text)">precompute sekali, ANN index</text>
<text x="240" y="200" fill="var(--chart-text)">dot product = kemiripan</text>
</g>
<text x="240" y="240" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">menara dipisah saat serving: item dihitung sekali, query real-time</text>
</svg>`;

export const mle20: V2Lesson = {
  slug: "mle20-recommender-systems",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE20 — Recommender Systems: Two-Tower Retrieval dan Ranking",
  estMinutes: 52,
  steps: [
    {
      id: "cerita-clickbait",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model dengan CTR tertinggi justru merusak produk",
      prose: [
        "Tim rekomendasi video menaikkan objective ke click-through rate (CTR). Hasilnya spektakuler: CTR naik 18% dalam sebulan, dasbor hijau semua. Lalu tim produk melihat metrik lain: rata-rata durasi tonton TURUN 12%. Model belajar satu trik — thumbnail dan judul clickbait ('KAMU TIDAK AKAN PERCAYA...') yang diklik lalu ditinggal dalam 20 detik. Angka benar secara matematis (klik memang naik), salah secara makna (pengalaman hancur).",
        "Perbaikannya bukan model yang lebih besar, melainkan objective yang jujur: ganti target dari 'klik' menjadi 'durasi tonton berbobot' (watch time). Rekomendasi berubah total — clickbait lenyap dari feed, video yang benar-benar ditonton sampai habis naik. Pelajaran pahit ini didokumentasikan di paper YouTube 'Deep Neural Networks for YouTube Recommendations': fitur yang dioptimasi menentukan perilaku yang dipelajari, bukan arsitekturnya.",
        "Twist-nya: di recommender systems, pertanyaan tersulit bukan 'model apa?' melainkan 'apa yang kita sebut SUKSES?'. Matriks interaksi, embedding, dan ANN index hanyalah mesin — objective adalah kemudinya. Lesson ini membangun mesinnya dari nol: matrix factorization sebagai fondasi, lalu two-tower retrieval plus ranking seperti yang dipakai Google untuk korpus ratusan juta item.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan matrix factorization sebagai kompresi matriks interaksi; (2) membangun simulator two-tower dan mengukur precision@k; (3) menjelaskan mengapa item embedding bisa di-precompute (decoupled inference); (4) menghitung trade-off ANN: recall yang dikorbankan vs latensi yang dihemat; (5) memetakan kapan MF cukup dan kapan butuh two-tower plus ranking.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Matrix factorization — Langkah 3 · Lab two-tower — Langkah 4 · Two-tower dan ANN — Langkah 5 · Lab ANN — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Objective menentukan perilaku model. CTR naik belum tentu produk membaik.",
    },
    {
      id: "konsep-mf",
      eyebrow: "Langkah 2 · Matrix factorization",
      title: "Matrix factorization: si pencatat pola",
      prose: [
        "Bayangkan tabel raksasa: baris = 1 juta user, kolom = 100 ribu film, sel = rating (kebanyakan KOSONG — 99,9% kosong, inilah sparsity). Matrix factorization (MF) menebak sel kosong dengan trik elegan: pecah tabel R menjadi dua tabel kecil, P (user × k) dan Q (item × k). Prediksi rating = dot product baris user dengan baris item. Dengan k = 50, 100 miliar sel diringkas menjadi 55 juta angka — kompresi 1.800x yang justru menangkap POLA ('penggemar sci-fi gelap menyukai...').",
        "Setiap baris P dan Q adalah embedding: vektor k-dimensi yang merepresentasikan 'selera' user dan 'karakter' item di ruang laten yang sama. Faktor laten ini TIDAK diberi nama oleh manusia — model menemukannya sendiri dari pola co-occurrence ('yang menonton A juga menonton B'). Inilah collaborative filtering: rekomendasi lahir dari perilaku kolektif, bukan dari isi konten.",
        "Cara melatihnya — ALS (alternating least squares): kunci Q, selesaikan P dengan least squares biasa; kunci P, selesaikan Q; ulangi sampai konvergen. Seperti menyetel dua sisi radio bergantian sampai siarannya jernih. Untuk data implisit (klik, tonton, beli — bukan rating bintang), variannya WMF (weighted MF): interaksi yang teramati diberi bobot keyakinan lebih tinggi daripada sel kosong, karena 'tidak diklik' belum tentu 'tidak suka' (mungkin belum terlihat).",
        "Kepribadian MF: si pencatat pola yang setia tapi buta isi. Ia tahu 'orang sepertimu menyukai ini' dengan akurat, tetapi tidak mengerti APA filmnya — judul, genre, bahkan bahasa tidak ia baca. Konsekuensinya: cold start. Item baru dengan nol interaksi = baris Q acak = tidak pernah direkomendasikan. Lagu baru dari musisi indie mustahil viral lewat MF murni, betapapun bagusnya.",
        "Kapan memakai: katalog stabil, interaksi melimpah, dan budget komputasi terbatas. MF melatih 100 juta interaksi dalam hitungan jam di satu mesin — jauh lebih murah dari deep learning. Batasnya: butuh fitur konten (teks, audio, gambar), butuh cold start, atau butuh skala ratusan juta item dengan latensi milidetik — di situlah two-tower mengambil alih.",
        "Prasyarat ringkas — data pipeline (mle2): interaksi mentah (klik, view, purchase) harus dibersihkan dan diubah menjadi matriks user-item sebelum MF bisa bekerja; kualitas rekomendasi tidak pernah melampaui kualitas pipeline yang memberinya makan. Evaluasi (mle4): recommender TIDAK dinilai dengan akurasi — metriknya precision@k ('dari 10 rekomendasi, berapa yang relevan?') dan recall@k, karena urutan dan relevansi top-k jauh lebih penting daripada menebak semua sel matriks.",
      ],
      formula: String.raw`\hat{r}_{ui} = \mathbf{p}_u \cdot \mathbf{q}_i = \sum_{f=1}^{k} p_{uf}\, q_{if}`,
      formulaNote: "r̂_ui = prediksi rating user u untuk item i; p_u = embedding user (vektor k-dimensi); q_i = embedding item; k = jumlah faktor laten. Contoh lab: dot product 0,92 = sangat mirip = kandidat kuat direkomendasikan. Interpretasi: angka ini = 'seberapa cocok selera u dengan karakter i', bukan probabilitas.",
      figure: {
        svg: FIG_PK,
        alt: "Precision@k turun perlahan: 0,990 di k=5; 0,982 di k=10; 0,973 di k=20.",
        caption: "Precision@k dari lab: k membesar, presisi turun perlahan.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'Matrix factorization mengerti isi konten.' Salah total — MF hanya membaca POLA INTERAKSI, tidak pernah membaca judul, genre, atau lirik. Buktinya: beri ia katalog film dengan judul diacak — hasilnya identik. Kalau butuh 'mengerti isi' (cold start item baru), butuh menara yang membaca fitur konten: two-tower.",
      },
      reference: "R ≈ P·Qᵀ: kompresi pola interaksi. Buta isi, lemah cold start, murah dilatih.",
    },
    {
      id: "lab-twotower",
      eyebrow: "Langkah 3 · Lab two-tower",
      title: "Lab: simulator two-tower dengan numpy",
      prose: [
        "Simulasikan dua menara yang 'sudah terlatih': menara user memetakan tiap user ke embedding 8-dimensi yang menonjol di dimensi kategori favoritnya, menara item memetakan tiap item ke dimensi kategorinya, plus noise. Normalisasi tiap baris (cosine = dot product vektor satuan), hitung skor = U·Vᵀ, ambil top-20 per user, lalu ukur precision@k terhadap ground truth (item yang kategorinya cocok).",
        "Eksplorasi wajib: (1) ubah noise 0,5 → 0,15 — lihat precision@k mendekati 1,0 sempurna (menara yang 'terlatih baik'); (2) ubah noise → 1,0 — ruang embedding berantakan, precision anjlok (inilah mengapa objective dan data training menentukan segalanya); (3) ubah d = 8 → 2 — kapasitas ruang laten kekecilan, kategori bertabrakan. Pada nilai noise berapa precision@20 turun di bawah 0,90?",
        "Cara membaca: precision@k = fraksi top-k yang relevan. Interpretasi: p@5 = 0,99 berarti 'dari 5 rekomendasi teratas, rata-rata 4,95 relevan' — retrieval bekerja. Penurunan p@5 → p@20 yang landai = wajar (kandidat peringkat bawah memang makin jauh dari query).",
      ],
      tasks: [
        { id: "t1", text: "Normalisasi baris `U` dan `V`, hitung `scores = Un @ Vn.T` dan `top20`" },
        { id: "t2", text: "Tulis `precision_at_k(topk, k)`, `print` p@5, p@10, p@20" },
      ],
      expected: "p@5 = 0.99, p@10 = 0.982, p@20 = 0.973",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Embedding = 'sidik jari selera'. Dua menara yang baik memetakan user dan item ke RUANG YANG SAMA sehingga dot product menjadi penggaris kemiripan. Retrieval lalu menjadi soal geometri: 'siapa tetangga terdekat query ini?' — bukan lagi soal menebak rating satu per satu.",
      },
      hints: [
        "normalisasi: Un = U / np.linalg.norm(U, axis=1, keepdims=True)",
        "top-20 per user: np.argsort(-scores, axis=1)[:, :20]",
        "relevan = item yang kategorinya == pref user; precision = irisan/k",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(7)
n_users, n_items, d, n_cat = 60, 400, 8, 8
pref = np.arange(n_users) % n_cat
cat = np.arange(n_items) % n_cat
U = rng.normal(0, 0.5, (n_users, d)); U[np.arange(n_users), pref] += 2.0
V = rng.normal(0, 0.5, (n_items, d)); V[np.arange(n_items), cat] += 2.0

# TULIS KODEMU
# TODO t1: normalisasi baris U -> Un, V -> Vn (cosine = dot product vektor satuan)
# TODO t1: scores = Un @ Vn.T ; top20 = 20 skor tertinggi per user
# TODO t2: fungsi precision_at_k(topk, k) lalu print p@5, p@10, p@20

# UJI (jangan ubah)
def precision_at_k(topk, k):
    hits = 0.0
    for i in range(n_users):
        rel = set(np.where(cat == pref[i])[0])
        hits += len(set(topk[i, :k]) & rel) / k
    return round(hits / n_users, 3)
print("p@5  =", precision_at_k(top20, 5))
print("p@10 =", precision_at_k(top20, 10))
print("p@20 =", precision_at_k(top20, 20))`,
        lockLines: 8,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(7)
n_users, n_items, d, n_cat = 60, 400, 8, 8
pref = np.arange(n_users) % n_cat
cat = np.arange(n_items) % n_cat
U = rng.normal(0, 0.5, (n_users, d)); U[np.arange(n_users), pref] += 2.0
V = rng.normal(0, 0.5, (n_items, d)); V[np.arange(n_items), cat] += 2.0

# TULIS KODEMU
Un = U / np.linalg.norm(U, axis=1, keepdims=True)
Vn = V / np.linalg.norm(V, axis=1, keepdims=True)
scores = Un @ Vn.T
top20 = np.argsort(-scores, axis=1)[:, :20]

# UJI (jangan ubah)
def precision_at_k(topk, k):
    hits = 0.0
    for i in range(n_users):
        rel = set(np.where(cat == pref[i])[0])
        hits += len(set(topk[i, :k]) & rel) / k
    return round(hits / n_users, 3)
print("p@5  =", precision_at_k(top20, 5))
print("p@10 =", precision_at_k(top20, 10))
print("p@20 =", precision_at_k(top20, 20))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "p@5\\s*=\\s*0\\.99", label: "p@5 = 0.99", msg: "Normalisasi + skor benar." },
          { kind: "stdout_matches", task: "t2", pattern: "p@10\\s*=\\s*0\\.982", label: "p@10 = 0.982", msg: "Top-k dan precision@k benar." },
          { kind: "stdout_matches", task: "t2", pattern: "p@20\\s*=\\s*0\\.973", label: "p@20 = 0.973", msg: "Konsisten dengan seed 7." },
        ],
      },
      reference: "Cosine retrieval: normalisasi, dot product, top-k, precision@k.",
    },
    {
      id: "konsep-twotower",
      eyebrow: "Langkah 4 · Two-tower dan ANN",
      title: "Two-tower: dari matrix factorization ke deep retrieval",
      prose: [
        "Evolusi retrieval menurut Google melalui tiga zaman. Zaman 1 — token-based: cocokkan kata kunci (inverted index), presisi tinggi tapi recall payah ('beach vibes' tidak menemukan 'beach tunes'). Zaman 2 — factorization: MF memampatkan matriks interaksi menjadi embedding, generalisasi jauh lebih baik, tetapi buta fitur konten. Zaman 3 — neural deep retrieval: two-tower encoder, dua neural network yang membaca fitur mentah (teks judul, fitur audio, metadata, konteks user) dan memetakannya ke ruang embedding bersama.",
        "Arsitekturnya sederhana dan jenius: menara QUERY memproses fitur user/konteks menjadi vektor q; menara ITEM memproses fitur item menjadi vektor c; kemiripan = dot product q·c. Saat training, pasangan positif (playlist, lagu yang ditambahkan) didekatkan, pasangan negatif dijauhkan — orientasi ruang embedding sepenuhnya ditentukan oleh contoh training yang dipilih. Ganti pasangan training (judul playlist vs fitur audio), dapat ruang yang berbeda: training pair adalah 'kurikulum' yang menentukan apa arti 'mirip'.",
        "Keunggulan yang mengubah segalanya — decoupled inference: menara item TIDAK membutuhkan query. Artinya seluruh katalog (100 juta item) di-embed SEKALI secara offline (batch job), hasilnya disimpan di ANN index. Saat serving, hanya menara query yang jalan real-time (satu forward pass), lalu cari tetangga terdekat di index. Tanpa pemisahan ini, tiap request harus menjalankan model untuk 100 juta item — mustahil di bawah 50ms.",
        "ANN (approximate nearest neighbors) adalah harga yang dibayar untuk kecepatan: pencarian eksak di 100 juta vektor terlalu lambat, jadi index seperti ScaNN (Google, dipakai di Search/YouTube/Ads) memakai kuantisasi dan partisi untuk menjawab 10-100x lebih cepat dengan recall ~95-97%. 'Approximate' di sini terukur: kamu tahu persis berapa recall yang dikorbankan, seperti di lab berikutnya.",
        "Retrieval hanyalah tahap 1. Sistem produksi = dua tahap: RETRIEVAL menyaring 100 juta → ratusan kandidat (cepat, recall-oriented, fitur murah), lalu RANKING menyusun ratusan → puluhan final (presisi-oriented, boleh pakai fitur mahal: deep CTR model, konteks real-time, aturan bisnis). Retrieval yang buruk tidak bisa diselamatkan ranking sebagus apa pun — kandidat yang tidak lolos tahap 1 tidak akan pernah tampil.",
        "Catatan kepemilikan sudut: association rules ('yang beli A juga beli B') dibahas di mk8 dari sudut BISNIS keranjang belanja. Lesson ini membangun dari sudut ENGINEERING: embedding, ruang vektor, dan index — mesin di balik aturan itu, bukan aturan itu sendiri.",
      ],
      formula: String.raw`s(q, c) = \frac{\mathbf{q} \cdot \mathbf{c}}{\lVert\mathbf{q}\rVert\,\lVert\mathbf{c}\rVert} \qquad \text{top-}k = \arg\max_c s(q, c)`,
      formulaNote: "s(q,c) = kemiripan cosine antara embedding query q dan item c (1 = identik, 0 = tak berhubungan); top-k = k item dengan skor tertinggi. Contoh lab: cosine 0,97 = tetangga sangat dekat = kandidat retrieval. Interpretasi: retrieval = 'k tetangga terdekat di ruang selera'.",
      figure: {
        svg: FIG_TWOTOWER,
        alt: "Dua menara (query dan item) bertemu di ruang embedding; item di-precompute ke ANN index.",
        caption: "Decoupled inference: item dihitung sekali, query real-time.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        body: "'Menara lebih dalam selalu menang di retrieval.' Salah — retrieval hidup di bawah budget latensi milidetik. Menara raksasa yang akurat tapi lambat kalah dari MF sederhana plus ANN yang menjawab dalam 20ms. Akurasi tanpa latensi = tidak ter-deploy. Ukur recall@k PADA budget latensi, bukan akurasi offline semata.",
      },
      reference: "Query tower real-time, item tower precompute. Retrieval cepat, ranking presisi.",
    },
    {
      id: "lab-ann",
      eyebrow: "Langkah 5 · Lab ANN",
      title: "Lab: harga kecepatan ANN (stdlib saja)",
      prose: [
        "Lab ini murni standard library — tanpa numpy. Simulasikan trik inti ANN seperti ScaNN: kuantisasi. Embedding item fp32 dibulatkan ke 1 desimal (mewakili kompresi int8), lalu bandingkan top-20 'eksak' vs 'terkuantisasi': recall@20 = berapa dari 20 tetangga sejati yang masih ditemukan. Bonus: hitung penghematan memori index (fp32 4 byte vs int8 1 byte).",
        "Eksplorasi: (1) ubah pembulatan round(x,1) → round(x,0) — recall jatuh ke berapa? (kuantisasi agresif = murah tapi buta); (2) naikkan n_items 400 → 2000 — waktu pencarian eksak tumbuh linear, inilah mengapa korpus 100 juta butuh ANN; (3) renungkan: recall 0,97 berarti 3% kandidat terbaik hilang — untuk tahap retrieval yang dilanjutkan ranking, apakah itu dapat diterima?",
        "Cara membaca: recall@20 = 0,97 berarti 'dari 20 tetangga sejati, 19,4 masih ketemu setelah kompresi'. Interpretasi: inilah 'approximate' yang terukur — kamu menukar 3% recall dengan index 4x lebih kecil dan pencarian jauh lebih cepat. Keputusan engineering = memilih titik tukar yang tepat, bukan mengejar sempurna.",
      ],
      tasks: [
        { id: "t1", text: "Kuantisasi `V` ke 1 desimal (`Vq`), normalisasi ulang, hitung `approx` top-20" },
        { id: "t2", text: "Hitung `recall@20` vs exact dan penghematan memori, `print` keduanya" },
      ],
      expected: "recall@20 = 0.97, memori 12.5 KB -> 3.12 KB",
      note: {
        title: "💡 Intuisi",
        body: "ANN = 'peta yang dilipat'. Peta detail (eksak) akurat tapi besar dan lambat dibaca; peta lipat (terkuantisasi) sedikit kurang presisi tapi muat di saku dan dibaca sekejap. Selama kamu tahu lipatannya mengorbankan berapa persen akurasi (recall terukur), itu engineering — bukan tebak-tebakan.",
      },
      hints: [
        "Vq = normed([[round(x, 1) for x in row] for row in V])",
        "recall = rata-rata |approx ∩ exact| / 20 per query",
        "memori = n_items * d * byte_per_komponen / 1024 KB",
      ],
      code: {
        starter: `# SEED — jangan ubah (stdlib saja)
import random, math
rng = random.Random(7)
n_items, d, n_cat, n_q = 400, 8, 8, 5
cat = [j % n_cat for j in range(n_items)]
queries = [rng.randrange(n_cat) for _ in range(n_q)]
V = [[rng.gauss(0, 0.5) + (2.0 if c == cat[j] else 0.0) for c in range(d)] for j in range(n_items)]
Q = [[rng.gauss(0, 0.5) + (2.0 if c == q else 0.0) for c in range(d)] for q in queries]

# TULIS KODEMU
def normed(M):
    return [[x / math.sqrt(sum(v*v for v in row)) for x in row] for row in M]
Vn, Qn = normed(V), normed(Q)
def topk(Qn_, Vn_, k):
    out = []
    for q in Qn_:
        s = sorted(range(n_items), key=lambda j: -sum(a*b for a, b in zip(q, Vn_[j])))
        out.append(s[:k])
    return out
exact = topk(Qn, Vn, 20)
# TODO t1: Vq = kuantisasi V ke 1 desimal lalu normalisasi; approx = topk(Qn, Vq, 20)
# TODO t2: rec = rata-rata irisan(approx, exact)/20; mem_fp32, mem_int8 (KB); print keduanya

# UJI (jangan ubah)
print("recall@20 =", round(rec, 4))
print("memori fp32 =", round(mem_fp32, 2), "KB -> int8 =", round(mem_int8, 2), "KB (4x hemat)")`,
        lockLines: 9,
        solution: `# SEED — jangan ubah (stdlib saja)
import random, math
rng = random.Random(7)
n_items, d, n_cat, n_q = 400, 8, 8, 5
cat = [j % n_cat for j in range(n_items)]
queries = [rng.randrange(n_cat) for _ in range(n_q)]
V = [[rng.gauss(0, 0.5) + (2.0 if c == cat[j] else 0.0) for c in range(d)] for j in range(n_items)]
Q = [[rng.gauss(0, 0.5) + (2.0 if c == q else 0.0) for c in range(d)] for q in queries]

# TULIS KODEMU
def normed(M):
    return [[x / math.sqrt(sum(v*v for v in row)) for x in row] for row in M]
Vn, Qn = normed(V), normed(Q)
def topk(Qn_, Vn_, k):
    out = []
    for q in Qn_:
        s = sorted(range(n_items), key=lambda j: -sum(a*b for a, b in zip(q, Vn_[j])))
        out.append(s[:k])
    return out
exact = topk(Qn, Vn, 20)
Vq = normed([[round(x, 1) for x in row] for row in V])
approx = topk(Qn, Vq, 20)
rec = sum(len(set(a) & set(e)) / 20 for a, e in zip(approx, exact)) / n_q
print("recall@20 =", round(rec, 4))
mem_fp32 = n_items * d * 4 / 1024
mem_int8 = n_items * d * 1 / 1024
print("memori fp32 =", round(mem_fp32, 2), "KB -> int8 =", round(mem_int8, 2), "KB (4x hemat)")

# UJI (jangan ubah)
print("recall@20 =", round(rec, 4))
print("memori fp32 =", round(mem_fp32, 2), "KB -> int8 =", round(mem_int8, 2), "KB (4x hemat)")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "recall@20\\s*=\\s*0\\.97", label: "recall@20 = 0.97", msg: "Kuantisasi + ANN recall benar." },
          { kind: "stdout_matches", task: "t2", pattern: "12\\.5\\s*KB\\s*->\\s*int8\\s*=\\s*3\\.12", label: "Hemat memori 4x", msg: "Perhitungan byte index benar." },
        ],
      },
      reference: "Kuantisasi: recall terukur turun sedikit, memori/latensi turun banyak.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: mesin rekomendasi mana untuk siapa?",
      prose: [
        "Skenario 1 — katalog < 100 ribu item, interaksi melimpah, tim kecil → MF (ALS/WMF). Murah dilatih, mudah dirawat, tidak butuh GPU. Cukup untuk 80% MVP.",
        "Skenario 2 — item baru tiap jam (berita, marketplace) → two-tower dengan fitur konten. Cold start terpecahkan karena menara item membaca metadata, bukan menunggu interaksi.",
        "Skenario 3 — korpus > 10 juta item, SLA < 50ms → two-tower + ANN index (ScaNN/FAISS). Precompute item embedding offline; serving = embed query + nearest neighbor.",
        "Skenario 4 — butuh presisi bisnis (promosi, pricing) → dua tahap: retrieval (ratusan kandidat) + ranking model dengan fitur mahal. Jangan ranking langsung di 100 juta item.",
        "Skenario 5 — objective meragukan (CTR naik, retensi turun) → berhenti tuning model, perbaiki objective dulu. Seperti cerita pembuka: kemudi salah = mesin sehebat apa pun salah arah.",
        "Aturan praktis 10 detik: (1) tentukan objective yang jujur DULU; (2) katalog kecil = MF; (3) butuh konten/cold start = two-tower; (4) skala besar + cepat = +ANN; (5) presisi akhir = +ranking.",
      ],
      tasks: [],
    },
    {
      id: "minicase-marketplace",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: marketplace 10 juta produk, SLA 50ms",
      prose: [
        "Marketplace 'SerbaAda' punya 10 juta produk dan 40 juta user aktif bulanan. Tim 3 orang, SLA p95 50ms untuk slot rekomendasi di homepage. Kandidat A: MF-ALS — training 6 jam di 1 mesin, recall@100 = 0,81, serving via dot product brute-force 10 juta item = 380ms (JEBOL SLA). Kandidat B: two-tower + ScaNN — training 14 jam di 4 GPU, recall@100 = 0,93, index build 40 menit, serving p95 18ms (AMAN).",
        "Biaya: Kandidat B butuh GPU training Rp45 juta/bulan vs Rp8 juta untuk A — selisih Rp37 juta/bulan. Tetapi: recall 0,81 → 0,93 berarti 12% lebih banyak klik relevan; dengan GMV Rp2 triliun/bulan dan kontribusi rekomendasi 15%, kenaikan konversi 0,4% = Rp1,2 miliar GMV tambahan. ROI 32x lipat dari selisih biaya infra.",
        "Pembahasan: keputusan BUKAN 'model paling canggih', melainkan 'yang memenuhi SLA dengan ROI positif'. MF gagal bukan karena akurasinya jelek, melainkan karena serving-nya tidak bisa dipisah (tidak ada decoupled inference) — 380ms untuk 10 juta dot product tidak bisa dinegosiasi. Two-tower menang karena ARSITEKTUR SERVING-nya, bukan karena deep learning-nya.",
        "Cara membaca: selalu ukur recall@k PADA budget latensi. Interpretasi: angka offline tanpa SLA = fiksi. Yang di-deploy = yang lolos SLA dengan recall terbaik.",
        "Jebakan yang dihindari: tim hampir memilih A karena 'lebih murah' — lupa bahwa rekomendasi yang tidak tampil tepat waktu = tidak ada rekomendasi sama sekali.",
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
        "MF = kompresi matriks interaksi (R ≈ P·Qᵀ); kuat pola, buta isi, lemah cold start.",
        "Two-tower = dua menara ke satu ruang embedding; training pair menentukan arti 'mirip'.",
        "Decoupled inference: item di-precompute ke ANN index; serving = embed query + nearest neighbor.",
        "ANN menukar sedikit recall (terukur) dengan latensi dan memori jauh lebih kecil.",
        "Produksi = retrieval (cepat, ratusan kandidat) + ranking (presisi, puluhan final).",
        "Objective dulu, model kemudian: CTR naik bisa berarti produk rusak.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Dot product 0,97 antara embedding user dan item. Artinya?",
          options: [
            { text: "Sangat mirip di ruang selera — kandidat kuat direkomendasikan", why: "Tepat: cosine ≈ 1 = tetangga dekat = relevan menurut model.", correct: true },
            { text: "Probabilitas user membeli = 97%", why: "Bukan probabilitas — ini skor kemiripan geometris, bukan peluang.", correct: false },
            { text: "Model 97% yakin", why: "Bukan confidence — dot product tidak dikalibrasi sebagai keyakinan.", correct: false },
            { text: "Item pasti dibeli", why: "Tidak ada kepastian — skor tinggi = prioritas tampil, bukan vonis beli.", correct: false },
          ],
        },
        {
          q: "Mengapa embedding 100 juta item bisa dihitung SEKALI (precompute)?",
          options: [
            { text: "Menara item tidak butuh query — inference terpisah (decoupled)", why: "Tepat: inilah keunggulan two-tower untuk serving.", correct: true },
            { text: "Karena embedding tidak pernah berubah", why: "Berubah tiap retrain — precompute diulang tiap model baru.", correct: false },
            { text: "Karena MF lebih cepat", why: "Bukan soal MF — ini sifat arsitektur two-tower.", correct: false },
            { text: "Karena ANN menyimpannya otomatis", why: "ANN menyimpan HASIL precompute; pemisahannya dari arsitektur menara.", correct: false },
          ],
        },
        {
          q: "Lagu baru (0 play) dari musisi indie. MF vs two-tower?",
          options: [
            { text: "Two-tower bisa merekomendasikan dari fitur audio/metadata; MF tidak", why: "Tepat: cold start = kelemahan MF, kekuatan tower konten.", correct: true },
            { text: "MF lebih baik karena datanya bersih", why: "MF buta total untuk item tanpa interaksi — tidak ada baris Q yang bermakna.", correct: false },
            { text: "Keduanya sama-sama tidak bisa", why: "Two-tower membaca fitur konten — tidak butuh riwayat interaksi.", correct: false },
            { text: "Tunggu 1.000 play dulu baru rekomendasikan", why: "Itu menyerah pada cold start — padahal tower konten menyelesaikannya.", correct: false },
          ],
        },
        {
          q: "ANN (ScaNN) mengorbankan apa demi kecepatan?",
          options: [
            { text: "Sedikit recall (terukur, mis. 3%) demi latensi 10-100x lebih cepat", why: "Tepat: 'approximate' yang terukur seperti di lab.", correct: true },
            { text: "Tidak mengorbankan apa-apa", why: "Approximate selalu punya harga — diukur sebagai recall.", correct: false },
            { text: "Akurasi training model", why: "ANN di serving, bukan training — modelnya tidak berubah.", correct: false },
            { text: "Jumlah item di katalog", why: "Katalog tetap 100 juta — yang dikompres representasinya.", correct: false },
          ],
        },
        {
          q: "Tahap ranking boleh pakai fitur mahal (deep CTR, konteks real-time). Mengapa?",
          options: [
            { text: "Hanya menilai ratusan kandidat, bukan 100 juta item", why: "Tepat: retrieval menyaring dulu — ranking bekerja di ruang kecil.", correct: true },
            { text: "Karena ranking tidak butuh cepat", why: "Tetap butuh cepat — hanya skalanya 1.000x lebih kecil.", correct: false },
            { text: "Karena retrieval tidak pakai ML", why: "Retrieval juga ML (two-tower) — beda budget komputasi, bukan beda teknologi.", correct: false },
            { text: "Fitur mahal hanya untuk laporan", why: "Fitur mahal justru paling berpengaruh di tahap akhir penyusunan.", correct: false },
          ],
        },
      ],
    },
  ],
};
