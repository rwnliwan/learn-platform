import type { V2Lesson } from "../lib/types";

// Skor BM25 vs dense untuk 5 dokumen: keduanya benar sebagian, gabungan terbaik.
const FIG_HYBRID = `<svg viewBox="0 0 480 250" role="img" aria-label="Perbandingan ranking BM25, dense, dan RRF.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle"><text x="120" y="20">BM25 top-2</text><text x="240" y="20">dense top-2</text><text x="360" y="20">RRF top-2</text></g>
<g font-size="11" font-family="var(--font-ui)" text-anchor="middle">
<rect x="60" y="40" width="120" height="40" fill="var(--c4)"/><text x="120" y="64" fill="var(--text)">dok-2 (1,78)</text>
<rect x="60" y="84" width="120" height="40" fill="var(--c4)" opacity="0.55"/><text x="120" y="108" fill="var(--text)">dok-0 (1,64)</text>
<rect x="180" y="40" width="120" height="40" fill="var(--c3)"/><text x="240" y="64" fill="var(--text)">dok-0 (1,63)</text>
<rect x="180" y="84" width="120" height="40" fill="var(--c3)" opacity="0.55"/><text x="240" y="108" fill="var(--text)">dok-2 (1,50)</text>
<rect x="300" y="40" width="120" height="40" fill="var(--c1)"/><text x="360" y="64" fill="var(--text)">dok-2 ✓</text>
<rect x="300" y="84" width="120" height="40" fill="var(--c1)" opacity="0.55"/><text x="360" y="108" fill="var(--text)">dok-0 ✓</text>
</g>
<text x="240" y="160" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">BM25 dan dense “berbeda pendapat” — RRF menggabungkan keduanya</text>
<text x="240" y="180" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">dengan stabil (tanpa perlu normalisasi skor)</text>
<text x="240" y="238" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">query: “bunga deposito” · 5 dokumen FAQ bank</text>
</svg>`;

export const aie13: V2Lesson = {
  slug: "aie13-hybrid-search-reranking",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE13 — Hybrid Search + Reranking untuk RAG",
  estMinutes: 60,
  steps: [
    {
      id: "cerita-gagal",
      eyebrow: "Langkah 1 · Cerita",
      title: "RAG yang 'pintar' tetapi tidak menemukan apa-apa",
      prose: [
        "Tim RAG bank memakai embedding canggih untuk 50.000 dokumen FAQ. Query 'berapa bunga deposito 12 bulan?' — hasilnya: dokumen tentang 'suku bunga' tidak muncul! Karena embedding menganggap 'bunga' (bunga bank) dan 'bunga' (tanaman hias di dokumen lain) mirip secara vektor, sementara dokumen yang tepat memakai kata 'suku bunga' yang jarang muncul di query. Dense retrieval gagal pada kata KUNCI yang spesifik.",
        "Insinyur senior menambahkan BM25 (pencocokan kata klasik dari era 1994): dokumen dengan kata persis 'bunga deposito' langsung terangkat. Tetapi BM25 gagal pada parafrase: 'berapa imbalan tabungan berjangka?' tidak cocok dengan 'bunga deposito'. Masing-masing benar di tempat yang lain salah.",
        "Twist-nya: jawabannya bukan memilih satu — melainkan MENGGABUNGKAN keduanya (hybrid) lalu me-rerank 50 kandidat teratas dengan model yang lebih teliti. Akurasi top-1 naik dari 71% (dense saja) ke 89% (hybrid + rerank). Lesson ini = pembeda RAG produksi vs demo, diminta eksplisit di job description 'hybrid retrieval architectures'.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan kapan dense gagal dan kapan BM25 gagal; (2) menghitung skor BM25 (TF-IDF + saturasi + normalisasi panjang); (3) menggabungkan ranking dengan RRF; (4) merancang pipeline retrieve → rerank; (5) mengukur kualitas retrieval (recall@k, MRR).",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · BM25 vs dense — Langkah 3 · Lab: RRF fusion — Langkah 4 · Reranking — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "Dense paham makna, BM25 paham kata kunci. Produksi butuh keduanya.",
    },
    {
      id: "konsep-bm25-dense",
      eyebrow: "Langkah 2 · BM25 vs dense",
      title: "1994 vs 2024: dua cara menemukan dokumen",
      prose: [
        "BM25 = pencocokan kata dengan tiga kecerdasan. (1) TF: kata yang sering muncul di dokumen = relevan (tetapi disaturasi — kemunculan ke-20 tidak 20x lebih penting dari ke-1). (2) IDF: kata langka ('deposito') lebih penting dari kata umum ('berapa'). (3) Normalisasi panjang: dokumen pendek yang cocok > dokumen panjang yang cocok sedikit. Rumus di bawah terlihat menakutkan; intuisinya: 'kata langka yang sering muncul di dokumen pendek = sangat relevan'.",
        "Dense retrieval = embedding query dan dokumen ke vektor, ukur cosine similarity. Kelebihan: paham parafrase ('imbalan tabungan berjangka' ≈ 'bunga deposito'), sinonim, dan maksud. Kelemahan: buta kata kunci spesifik (kode produk 'DPST-12B', nama orang, angka), mahal (embedding tiap query), dan butuh index vektor.",
        "Kapan masing-masing gagal — hafalkan tabel ini. Dense gagal: kode/nama/angka spesifik, kata langka domain, query sangat pendek. BM25 gagal: parafrase, sinonim ('mobil' vs 'kendaraan'), typo ('depoisto'), bahasa campur. RAG produksi = kedua kegagalan ini TERJADI BERSAMAAN di query yang berbeda. Satu metode = setengah query gagal.",
        "Kepribadian keduanya: BM25 seperti pustakawan tua yang hafal kata per kata — teliti pada istilah, tuli pada maksud. Dense seperti teman yang paham maksudmu — cerdas, tetapi kadang salah dengar nama. Kamu butuh keduanya di tim.",
        "Menala k1 dan b — jarang perlu, tetapi ketahui. k1 (1,2–2,0): saturasi TF — k1 kecil = TF cepat jenuh (cocok dokumen pendek); b (0–1): kekuatan normalisasi panjang — b=1 penuh, b=0 tanpa. Default 1,5/0,75 bekerja 90% kasus. Ubah hanya bila benchmark membuktikan — jangan tuning buta.",
      ],
      formula: String.raw`\text{BM25}(q,d) = \sum_{t \in q} \text{IDF}(t)\cdot\frac{f(t,d)(k_1+1)}{f(t,d)+k_1\left(1-b+b\frac{|d|}{\text{avgdl}}\right)}`,
      formulaNote: "f(t,d) = frekuensi kata t di dokumen d (disaturasi oleh k1≈1,5: tambahan kemunculan makin kurang berarti); IDF(t) = bobot kelangkaan kata; |d|/avgdl = normalisasi panjang dokumen (b≈0,75); k1, b = konstanta teruji 30 tahun. Contoh lab: 'bunga deposito' → dok-2 skor 1,78 (pendek + kata langka).",
      figure: {
        svg: FIG_HYBRID,
        alt: "Perbandingan ranking BM25, dense, dan RRF untuk query bunga deposito.",
        caption: "BM25 vs dense vs RRF pada 5 dokumen.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Embedding modern sudah menggantikan BM25.' Salah — benchmark BEIR menunjukkan hybrid (BM25+dense) konsisten mengalahkan dense saja, terutama untuk query faktual dengan istilah spesifik. Perusahaan yang mematikan BM25 biasanya menemukannya kembali 6 bulan kemudian dengan nama 'lexical boost'. Jangan kubur yang terbukti 30 tahun.",
      },
      reference: "BM25: kata langka + sering + dokumen pendek. Dense: makna + parafrase. Keduanya punya titik buta.",
    },
    {
      id: "lab-rrf",
      eyebrow: "Langkah 3 · Lab RRF",
      title: "Lab: menggabungkan dua ranking dengan RRF",
      prose: [
        "Lima dokumen FAQ, query 'bunga deposito'. Hitung skor BM25 (disediakan), skor dense tiruan (disediakan), lalu gabungkan dengan Reciprocal Rank Fusion: tiap dokumen mendapat 1/(k+peringkat) dari tiap sistem, jumlahkan. RRF = tanpa normalisasi skor (skor BM25 dan dense tidak sebanding!) — hanya peringkat yang dipakai.",
        "Perhatikan: BM25 menaruh dok-2 di puncak (1,78), dense menaruh dok-0 (1,63) — mereka BERBEDA PENDAPAT. RRF menengahi: dok-2 dan dok-0 SERI di RRF (keduanya 1/61+1/62 ≈ 0,0325225 — masing-masing #1 di satu sistem dan #2 di sistem lain); urutan [2, 0, …] berasal dari tie-break urutan insersi (list BM25 diproses dulu), BUKAN dukungan yang lebih kuat untuk dok-2. Keduanya sama-sama top-2 di kedua ranking — RRF tidak bisa membedakan keduanya, dan menyajikan dok-2 sebagai 'pemenang merit' adalah salah baca tie-break sebagai dukungan. Coba ubah: naikkan k dari 60 ke 1000 dan lihat perbedaan peringkat mengecil (k besar = semua suara hampir sama).",
        "Cara membaca: rank_bm25 vs rank_dense menunjukkan ketidaksepakatan; rrf menunjukkan konsensus. Interpretasi: RRF = demokrasi peringkat — yang didukung dua sistem menang, tanpa perlu menyamakan 'mata uang' skor.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bm25` dan `dense` scores, lalu `rank_bm25` dan `rank_dense` (indeks terurut)" },
        { id: "t2", text: "Implementasikan `rrf`, hitung `fused`, `print` ketiganya" },
      ],
      expected: "bm25 top: dok-2, dense top: dok-0, rrf: [2, 0, 1, 3, 4] (dok-2 dan dok-0 SERI — urutan dari tie-break insersi, bukan merit)",
      note: {
        title: "💡 Intuisi",
        body: "RRF brilian karena MENOLAK membandingkan apel dan jeruk. Skor BM25 (0-∞) dan cosine (0-1) tidak sebanding — menormalkannya = menebak. Peringkat selalu sebanding: #1 vs #1. Kesederhanaan ini mengalahkannya di banyak benchmark.",
      },
      hints: [
        "bm25_scores dan fake_dense sudah disediakan — panggil saja",
        "rank = sorted(range(n), key=lambda i: scores[i], reverse=True)",
        "rrf: untuk tiap rank_list, tiap (peringkat, idx): fused[idx] += 1/(k+peringkat); urutkan menurun",
      ],
      code: {
        starter: `# SEED — jangan ubah
import math
DOCS = [
    "suku bunga deposito 12 bulan terbaru",
    "cara blokir kartu kredit yang hilang",
    "bunga deposito dan pajak tabungan",
    "syarat pengajuan KPR rumah pertama",
    "biaya administrasi kartu debit",
]
QUERY = "bunga deposito"

def bm25_scores(docs, query, k1=1.5, b=0.75):
    terms = query.lower().split()
    N = len(docs); lens = [len(d.split()) for d in docs]; avg = sum(lens)/N
    out = []
    for d, dl in zip(docs, lens):
        s, words = 0.0, d.lower().split()
        for t in terms:
            tf = words.count(t)
            df = sum(1 for dd in docs if t in dd.lower().split())
            idf = math.log((N-df+0.5)/(df+0.5)+1)
            s += idf*(tf*(k1+1))/(tf+k1*(1-b+b*dl/avg))
        out.append(round(s, 4))
    return out

def fake_dense(docs, query):
    qs = query.lower().split(); out = []
    for d in docs:
        ws = d.lower().split()
        s = sum(1.0/(ws.index(t)+1) for t in qs if t in ws)
        if "terbaru" in ws: s += 0.8
        out.append(round(s, 4))
    return out

# TULIS KODEMU
def rrf(rank_lists, k=60):
    # TODO t2: fused[idx] += 1/(k+peringkat); kembalikan indeks terurut menurun
    return []

# UJI (jangan ubah)
bm = bm25_scores(DOCS, QUERY)
de = fake_dense(DOCS, QUERY)
r_bm = sorted(range(len(DOCS)), key=lambda i: bm[i], reverse=True)
r_de = sorted(range(len(DOCS)), key=lambda i: de[i], reverse=True)
fused = rrf([r_bm, r_de])
print("bm25:", bm, "-> top:", r_bm[:2])
print("dense:", de, "-> top:", r_de[:2])
print("rrf:", fused)`,
        lockLines: 35,
        solution: `# SEED — jangan ubah
import math
DOCS = [
    "suku bunga deposito 12 bulan terbaru",
    "cara blokir kartu kredit yang hilang",
    "bunga deposito dan pajak tabungan",
    "syarat pengajuan KPR rumah pertama",
    "biaya administrasi kartu debit",
]
QUERY = "bunga deposito"

def bm25_scores(docs, query, k1=1.5, b=0.75):
    terms = query.lower().split()
    N = len(docs); lens = [len(d.split()) for d in docs]; avg = sum(lens)/N
    out = []
    for d, dl in zip(docs, lens):
        s, words = 0.0, d.lower().split()
        for t in terms:
            tf = words.count(t)
            df = sum(1 for dd in docs if t in dd.lower().split())
            idf = math.log((N-df+0.5)/(df+0.5)+1)
            s += idf*(tf*(k1+1))/(tf+k1*(1-b+b*dl/avg))
        out.append(round(s, 4))
    return out

def fake_dense(docs, query):
    qs = query.lower().split(); out = []
    for d in docs:
        ws = d.lower().split()
        s = sum(1.0/(ws.index(t)+1) for t in qs if t in ws)
        if "terbaru" in ws: s += 0.8
        out.append(round(s, 4))
    return out

# TULIS KODEMU
def rrf(rank_lists, k=60):
    fused = {}
    for ranks in rank_lists:
        for rank, idx in enumerate(ranks, start=1):
            fused[idx] = fused.get(idx, 0) + 1/(k+rank)
    return sorted(fused, key=fused.get, reverse=True)

# UJI (jangan ubah)
bm = bm25_scores(DOCS, QUERY)
de = fake_dense(DOCS, QUERY)
r_bm = sorted(range(len(DOCS)), key=lambda i: bm[i], reverse=True)
r_de = sorted(range(len(DOCS)), key=lambda i: de[i], reverse=True)
fused = rrf([r_bm, r_de])
print("bm25:", bm, "-> top:", r_bm[:2])
print("dense:", de, "-> top:", r_de[:2])
print("rrf:", fused)`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "bm25:.*-> top: \\[2, 0\\]", label: "BM25 menaruh dok-2 teratas", msg: "Skor 1.78 > 1.64." },
          { kind: "stdout_matches", task: "t1", pattern: "dense:.*-> top: \\[0, 2\\]", label: "Dense menaruh dok-0 teratas", msg: "Bonus 'terbaru' mengangkat dok-0." },
          { kind: "stdout_matches", task: "t2", pattern: "rrf: \\[2, 0, 1, 3, 4\\]", label: "RRF menggabung menjadi [2,0,1,3,4]", msg: "Konsensus dua sistem." },
        ],
      },
      reference: "RRF = 1/(k+peringkat) per sistem, jumlahkan. Tanpa normalisasi skor.",
    },
    {
      id: "konsep-rerank",
      eyebrow: "Langkah 4 · Reranking",
      title: "Rerank: 50 kandidat masuk, 5 terbaik keluar",
      prose: [
        "Pipeline produksi standar: retrieve 50 (hybrid, murah, cepat) → rerank ke 5 (model cross-encoder, mahal, teliti) → generate. Mengapa dua tahap? Cross-encoder membaca query+DOKUMEN BERSAMAAN (interaksi penuh) — LEBIH akurat dari bi-encoder (sering jauh lebih akurat pada tugas ranking yang halus — tetapi '10x' bukan angka yang terukur di sini: akurasi bukan besaran yang bisa dikali 10 begitu saja; yang terukur adalah selisih poin metrik seperti nDCG di eval set-mu), tetapi jauh lebih lambat (perkiraan kasar '50x' — ukur di setup-mu). Dipakai untuk 50, bukan 50.000: 50 × 20ms = 1 detik (OK); 50.000 × 20ms = 16 menit (gila).",
        "Query rewrite = pra-pengolahan cerdas. 'Berapa bunga deposito 12 bulan?' → rewrite menjadi 3 varian: ('suku bunga deposito 12 bulan', 'bunga deposito tenor 1 tahun', 'deposito 12 bulan rate'). Tiap varian retrieve 20 → gabung 60 → dedup → rerank. Recall naik 10-15 poin untuk query ambigu. Biaya: 3x retrieve (murah) untuk +12 poin recall.",
        "Mengukur retrieval: recall@k (apakah dokumen benar ada di k teratas?) dan MRR (seberapa tinggi peringkatnya?). Contoh: 100 query, 89 dokumen benar di top-5 → recall@5 = 89%. MRR: rata-rata 1/peringkat — peringkat 1 = 1.0, peringkat 2 = 0.5. Target produksi: recall@5 > 85%, MRR > 0.7. Di bawah itu: perbaiki retrieval DULU sebelum menyalahkan generator.",
        "Kepribadian rerank: seperti juri final — 50 semifinalis dipilih cepat oleh dua juri (BM25+dense), 5 finalis dinilai mendalam satu per satu. Tidak ada juri final yang menilai 50.000 peserta.",
        "Bi-encoder vs cross-encoder — beda arsitektur. Bi: query dan dokumen di-encode TERPISAH (cepat, bisa pre-index 50.000 dokumen). Cross: query+dokumen dibaca BERSAMA (interaksi token penuh, lebih akurat, jauh lebih lambat — '10x/50x' adalah gambaran kasar, bukan pengukuran; ukur di eval set dan hardware-mu). Pipeline = bi untuk 50.000, cross untuk 50. Jangan cross untuk 50.000 — 16 menit/query!",
        "ColBERT — jalan tengah. Token-level interaction yang bisa pre-index (late interaction): akurasi mendekati cross, kecepatan mendekati bi. Jika rerank 50 masih terlalu lambat: ColBERT untuk 5.000 → cross untuk 50. Tiga tahap untuk skala besar.",
      ],
      formula: String.raw`\text{MRR} = \frac{1}{|Q|}\sum_{i=1}^{|Q|}\frac{1}{\text{rank}_i} \qquad \text{Recall@k} = \frac{\text{benar di top-}k}{|Q|} \quad \text{(satu dokumen benar per query; = hit rate)}`,
      formulaNote: "MRR = Mean Reciprocal Rank; rank_i = peringkat dokumen benar untuk query i (jika tak ditemukan, 1/rank = 0). Recall@k di lesson ini = proporsi query yang dokumen benarnya muncul di k teratas — dengan SATU dokumen benar per query, ini sama dengan hit rate; recall dalam arti klasik membagi dengan JUMLAH dokumen relevan (bila tiap query punya banyak dokumen relevan, keduanya berbeda). Sebutkan asumsi satu-dokumen-benar setiap memakai angka ini. Contoh: 89/100 di top-5 → recall@5 = 0,89.",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Urutkan optimasi RAG dari yang murah: (1) chunking lebih baik, (2) hybrid + RRF, (3) query rewrite, (4) rerank, (5) fine-tune embedding. Kebanyakan tim melompat ke (5) — termahal — padahal (2)+(4) memberi 80% keuntungan dengan 20% usaha. Tangga ini menghemat berbulan-bulan.",
      },
      reference: "Retrieve 50 (murah) → rerank 5 (teliti). Ukur recall@k dan MRR sebelum menyalahkan generator.",
    },
    {
      id: "fusi-berbobot-evaluasi",
      eyebrow: "Langkah 5 · Fusi & evaluasi produksi",
      title: "Fusi berbobot, distilasi, dan kapan RRF gagal",
      prose: [
        "RRF yang kamu praktikkan di lab adalah fusi yang 'demokratis' — BM25 dan dense masing-masing mendapat satu suara yang sama besar. Di produksi, demokrasi buta seperti ini sering kalah dari fusi yang tahu siapa yang lebih bisa dipercaya. Jika tiga bulan log menunjukkan dense memenangkan 70% query teratas, mengapa memberinya bobot yang sama dengan BM25? Fusi berbobot menjawabnya: `skor_final = α·skor_bm25 + (1−α)·skor_dense`, dengan α ditala di validation set.",
        "Syaratnya satu dan tidak bisa ditawar: skor harus dinormalisasi PER QUERY sebelum digabung. Skor BM25 tak terbatas (nol sampai puluhan), cosine similarity terjepit di rentang sempit — menggabungkannya mentah-mentah seperti menjumlahkan rupiah dan yen. Praktik standar: min-max per query, yaitu `(skor − min)/(max − min)` di dalam 50 kandidat, atau z-score. Normalisasi per query, bukan per korpus: distribusi skor query 'bunga deposito' dan query 'zzz' tidak sebanding satu sama lain.",
        "Bagaimana memilih α? Grid search kasar di validation set berlabel (0,0; 0,25; 0,5; 0,75; 1,0) biasanya cukup — kurva nDCG terhadap α umumnya landai di tengah dan curam di ujung. Aturan praktis: mulai dari α=0,3 (sedikit condong ke dense untuk query natural; condong ke BM25 bila log menunjukkan banyak kode/nama produk). Jangan pernah menala α di test set — itu overfitting fusi: bobot yang 'sempurna' di 200 query eval bisa runtuh di traffic nyata.",
        "Satu tingkat di atasnya: learned fusion. Alih-alih satu α global, latih model learning-to-rank (misalnya LambdaMART) dengan fitur: skor BM25, skor dense, peringkat keduanya, panjang query, ada-tidaknya istilah langka. Model belajar 'untuk query pendek beristilah langka, percayai BM25'. Akurasi tertinggi — tetapi harganya data berlabel ribuan query dan risiko overfitting ke eval set. Pakai hanya bila kamu punya tim evaluasi yang serius dan traffic yang membenarkan biayanya.",
        "Trik produksi yang paling underrated: distilasi cross-encoder. Alih-alih menjalankan cross-encoder yang mahal saat serving (50 dokumen × 20ms), latih bi-encoder-mu meniru skor cross-encoder sebagai soft label (KL divergence antara distribusi skor keduanya). Hasil tipikal: menutup 70–80% gap akurasi rerank — angka TIPIKAL dari literatur/praktik, bukan jaminan: hasilnya bervariasi per domain dan kualitas distilasi; ukur gap di eval set-mu. 'NOL tambahan latensi' berarti nol tambahan latensi SERVING (satu panggilan bi-encoder yang sama) — bukan nol biaya: training distilasi justru lebih mahal (butuh skor cross-encoder sebagai label). Mengapa bekerja? Cross-encoder memberi sinyal yang lebih halus dari label biner — 'dokumen A sedikit lebih baik dari B' adalah informasi yang tidak dimiliki label relevan/tidak.",
        "Evaluasi: tiga metrik, tiga pertanyaan berbeda. Recall@k — 'apakah dokumen benar ada di k teratas?' (cakupan; yang dipakai mini-case bank — dengan satu dokumen benar per query; bila ada banyak dokumen relevan per query, ini hit rate, bukan recall klasik). MRR — 'seberapa tinggi peringkat jawaban pertama?' (tepat untuk satu jawaban benar). nDCG@k — 'seberapa bagus URUTAN daftar dengan relevansi bertingkat?' (rumus di bawah; standar industri untuk hasil berperingkat). Pilih metrik sesuai produk: chatbot satu jawaban ke MRR; daftar rekomendasi ke nDCG.",
        "Setiap metrik bisa dibohongi. Recall@100 = 99% terdengar hebat sampai sadar k=100 dari 50.000 dokumen hampir pasti mengandung jawabannya — naikkan k, recall naik gratis. MRR buta terhadap jawaban kedua dan ketiga (penting bila generator butuh multi-hop). nDCG butuh relevansi bertingkat (0–3) yang mahal dilabeli manusia. Praktik senior: laporkan ketiganya, tetapi optimasi SATU yang selaras dengan produk.",
        "Failure mode 1 — index drift. BM25 memakai statistik korpus (IDF, panjang rata-rata). Tiap 10.000 dokumen baru, IDF bergeser diam-diam: kata yang dulu langka menjadi umum, skor-skor lama tidak lagi sebanding. Gejala: recall turun 2–3 poin per kuartal tanpa perubahan kode. Obat: jadwalkan recompute statistik berkala, atau pin IDF dan monitor divergensinya sebagai metrik kesehatan.",
        "Failure mode 2 — domain shift. Embedding yang dilatih di web umum gagal total di jargon domain ('ritase', 'SJ ganda', kode medis). Dense yang buta jargon = BM25 yang menanggung beban — geser α ke BM25 sementara, lalu fine-tune embedding di korpus domain (contrastive, 1–2 hari). Jangan fine-tune buta: ukur dulu per-system win rate di query domain vs umum untuk tahu siapa yang rusak.",
        "Failure mode 3 — query drift. Bahasa pengguna berubah: singkatan baru, typo musiman, campuran bahasa. Monitor tiga sinyal: distribusi panjang query, no-result rate, dan agreement antar sistem (seberapa sering BM25 dan dense sepakat di top-1). Agreement yang anjlok = salah satu sistem membusuk — investigasi sebelum skor agregat ikut jatuh.",
        "Anggaran latensi-biaya: modelkan per query. Total = retrieve hybrid (murah, ~30ms) + k·biaya_rerank. Pilih kedalaman rerank k di titik marginal gain mengecil: ukur nDCG@5 untuk k=10, 20, 50, 100 — biasanya kurva mendatar setelah 50. Aturan: tiap tambahan 10 kandidat rerank harus 'membayar' dirinya via kenaikan nDCG yang terukur di validation, bukan firasat.",
        "Tiga aturan senior untuk dibawa pulang. (1) Bobot fusi ditala di validation, divalidasi ulang tiap indeks berubah signifikan. (2) Monitor kontribusi per sistem tiap bulan — bila dense tiba-tiba menyumbang di bawah 10% kemenangan top-1, itu sinyal drift, bukan 'kebetulan'. (3) Distilasi sebelum scaling: menutup gap akurasi tanpa menambah GPU serving selalu lebih murah daripada menambah kedalaman rerank.",
      ],
      formula: String.raw`\text{nDCG@k} = \frac{\text{DCG@k}}{\text{IDCG@k}} \qquad \text{DCG@k} = \sum_{i=1}^{k}\frac{2^{rel_i}-1}{\log_2(i+1)}`,
      formulaNote: "nDCG = Normalized Discounted Cumulative Gain (0–1); rel_i = tingkat relevansi dokumen peringkat i (0=tidak relevan hingga 3=sangat relevan); pembilang 2^rel−1 memberi bobot eksponensial pada relevansi tinggi; penyebut log2(i+1) = 'diskon posisi' (peringkat 1 nyaris tak didiskon, peringkat 10 didiskon berat); IDCG = DCG dari urutan ideal. Contoh: relevansi [3,0,1] → DCG = 7/1 + 0/1,58 + 1/2 = 7,5.",
      tasks: [],
      note: {
        title: "⚠️ Jebakan",
        type: "pitfall",
        body: "Menala bobot fusi α di test set lalu melaporkannya sebagai 'hasil'. Itu overfitting fusi — α menghafal 200 query eval dan runtuh di traffic nyata. Bobot HANYA dari validation; test disentuh sekali untuk angka final. Fusi yang ditala di test = skor yang tidak akan pernah kamu lihat di produksi.",
      },
      reference: "Fusi berbobot butuh normalisasi per query + α dari validation; distilasi cross-encoder = akurasi rerank tanpa latensi; monitor drift tiga arah (indeks, domain, query).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: arsitektur retrieval apa?",
      prose: [
        "Skenario 1 — FAQ umum, query natural ('cara blokir kartu') → dense saja cukup. Parafrase ditangani, istilah tidak kritis.",
        "Skenario 2 — dokumen teknis/produk (kode, nama, angka) → hybrid WAJIB. Dense buta 'DPST-12B'; BM25 melihatnya.",
        "Skenario 3 — butuh akurasi top-1 tinggi (jawaban langsung) → hybrid + rerank. Biaya +Rp100/query (50 kandidat × Rp2 — lihat mini-case: 20.000 × 50 × Rp2 = Rp2 juta/hari) untuk +18 poin akurasi. (Hitungan lama lesson ini menulis Rp30/query — tidak cocok dengan Rp2/dokumen × 50.)",
        "Skenario 4 — query ambigu/pendek ('bunga?') → tambah query rewrite. 3 varian = 3x peluang.",
        "Skenario 5 — budget ketat, latensi <200ms → BM25 saja + tanpa rerank. 71% akurasi tetapi jauh lebih murah (tanpa biaya rerank — '10x' di sini gambaran kasar, bukan pengukuran; hitung biaya per query di setup-mu) — kadang cukup.",
        "Aturan praktis 10 detik: (1) ada istilah spesifik? hybrid. (2) butuh top-1 tepat? rerank. (3) query ambigu? rewrite. (4) ukur recall@5 — di bawah 85%? naikkan tangga.",
        "Skenario 6 — multilingual (Indonesia + Inggris campur) → dense multilingual + BM25 per bahasa. 'Deposito' (ID) vs 'deposit' (EN): BM25 buta lintas bahasa, dense paham. Query campur = kedua kegagalan sekaligus → hybrid WAJIB.",
        "Evaluasi berkelanjutan — bukan sekali. Tambah 50 query gagal/bulan ke eval set (dari log!). Retrieval yang tidak diukur = membusuk diam-diam (dokumen baru, bahasa berubah). Golden set retrieval = seperti aie4, tetapi untuk pencarian.",
      ],
      tasks: [],
    },
    {
      id: "minicase-bank",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 50.000 dokumen, 89% recall@5",
      prose: [
        "Bank: 50.000 dokumen FAQ/produk, 20.000 query/hari. Baseline dense saja: recall@5 = 71%, MRR = 0,52 — 29% query tidak menemukan dokumen (5.800/hari!) → fallback ke CS manusia Rp15 ribu/tiket = Rp87 juta/hari. Masalah nyata, bukan akademis.",
        "Upgrade hybrid + RRF: recall@5 = 83% (+12 poin). Tambah rerank top-50→5: recall@5 = 89%, MRR = 0,74. Query gagal: 29% → 11% = 3.600 tiket/hari diselamatkan × Rp15 ribu = Rp54 juta/hari. Biaya: rerank 20.000 × 50 × Rp2 (cross-encoder kecil) = Rp2 juta/hari + infra Rp5 juta/bulan. Net: hemat Rp54 juta − Rp2 juta = Rp52 juta/hari ≈ Rp1,5 M/bulan.",
        "Pembahasan: perhatikan bahwa 71% → 89% terlihat 'hanya' +18 poin, tetapi dalam rupiah = Rp1,5 M/bulan. Persentase menipu; rupiah jujur. Selalu konversi metrik retrieval ke biaya operasional saat presentasi ke manajemen.",
        "Cara membaca: tiap tangga (dense → hybrid → rerank) punya harga dan hasil. Pilih tangga BERDASARKAN nilai tiket gagal — jika tiket murah (Rp500), berhenti di hybrid; jika mahal (Rp15 ribu), naik sampai rerank.",
        "Interpretasi: retrieval quality = uang. RAG yang 'cukup baik' dengan retrieval 71% = mesin pembakar Rp87 juta/hari. Investasi Rp2 juta/hari menghemat Rp54 juta — ROI 27x.",
      ],
      tasks: [],
    },
        {
          id: "gap-r7-bm25-lengkap",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P7-G1)",
          title: "BM25 dari nol: korpus, IDF, saturasi, panjang",
          prose: [
            "Lab langkah 3 memakai skor BM25 yang 'disediakan' — kamu tidak pernah menghitungnya dari korpus. Langkah ini menghitungnya dari nol, supaya tiap komponen rumus terasa. Korpus 3 dokumen FAQ; query 'bunga deposito'; k1 = 1,2, b = 0,75. IDF (dengan +0,5 agar kata yang muncul di semua dokumen tidak bernilai nol): IDF('bunga') = ln((3−3+0,5)/(3+0,5) + 1) = ln(1,143) = 0,13 — kecil, karena 'bunga' ada di semua dokumen. IDF('deposito') = ln((3−2+0,5)/(2+0,5) + 1) = ln(1,6) = 0,47 — lebih besar, karena 'deposito' lebih langka.",
            "Skor tiap dokumen = Σ IDF × TF-tersaturasi × normalisasi panjang. Dok-0 ('bunga deposito tinggi', 3 kata): 0,63. Dok-1 ('bunga deposito deposito', 3 kata): 0,80 — 'deposito' muncul 2× tetapi skornya TIDAK 2× lipat (saturasi: kemunculan ke-2 hanya menambah sebagian). Dok-2 ('tabungan berjangka bunga rendah', 4 kata): 0,12 — hanya 'bunga' yang cocok (IDF kecil) dan dokumennya lebih panjang (normalisasi menghukum). Pemenang: dok-1 (0,80). Tiga intuisi yang harus dipegang: kata langka > kata umum; pengulangan memberi hasil yang menurun (saturasi k1); dokumen pendek yang cocok > dokumen panjang yang cocok sedikit (normalisasi b).",
          ],
          formula: String.raw`\text{BM25}(q,d) = \sum_{t \in q} \text{IDF}(t)\cdot\frac{f(t,d)(k_1+1)}{f(t,d)+k_1\left(1-b+b\frac{|d|}{\text{avgdl}}\right)} \qquad \text{IDF}(t) = \ln\left(\frac{N-n_t+0{,}5}{n_t+0{,}5}+1\right)`,
          formulaNote: "Korpus 3 dok, query 'bunga deposito', k1=1,2, b=0,75: IDF bunga 0,13, deposito 0,47; skor d0 0,63, d1 0,80, d2 0,12.",
          tasks: [
            { id: "t1", text: "Hitung IDF: `idf_bunga`, `idf_deposito`" },
            { id: "t2", text: "Hitung skor BM25: `skor_d0`, `skor_d1`, `skor_d2`, dan `pemenang` (indeks dokumen)" },
          ],
          expected: "idf_bunga=0.13 idf_deposito=0.47 skor_d0=0.63 skor_d1=0.8 skor_d2=0.12 pemenang=1",
          hints: [
            "IDF(t) = ln((N − n_t + 0,5)/(n_t + 0,5) + 1); N = 3.",
            "avgdl = rata-rata panjang dokumen = 10/3; suku TF = f(k1+1)/(f + k1(1−b + b·|d|/avgdl)).",
          ],
          code: {
            starter: `import math\n\n# Korpus 3 dokumen FAQ; query: "bunga deposito"\ndocs = [\n    ["bunga", "deposito", "tinggi"],\n    ["bunga", "deposito", "deposito"],\n    ["tabungan", "berjangka", "bunga", "rendah"],\n]\nquery = ["bunga", "deposito"]\nk1, b = 1.2, 0.75\n\n# TULIS KODEMU: IDF tiap kata query + skor BM25 tiap dokumen + pemenang\nidf_bunga =\nidf_deposito =\nskor_d0 =\nskor_d1 =\nskor_d2 =\npemenang =\n\nprint(f"idf_bunga={idf_bunga} idf_deposito={idf_deposito} skor_d0={skor_d0} skor_d1={skor_d1} skor_d2={skor_d2} pemenang={pemenang}")`,
            lockLines: 12,
            solution: `import math\n\n# Korpus 3 dokumen FAQ; query: "bunga deposito"\ndocs = [\n    ["bunga", "deposito", "tinggi"],\n    ["bunga", "deposito", "deposito"],\n    ["tabungan", "berjangka", "bunga", "rendah"],\n]\nquery = ["bunga", "deposito"]\nk1, b = 1.2, 0.75\n\n# TULIS KODEMU: IDF tiap kata query + skor BM25 tiap dokumen + pemenang\nN = len(docs)\navgdl = sum(len(d) for d in docs) / N\ndef idf(t):\n    nt = sum(1 for d in docs if t in d)\n    return math.log((N - nt + 0.5) / (nt + 0.5) + 1)\nidf_bunga = round(idf("bunga"), 2)\nidf_deposito = round(idf("deposito"), 2)\ndef bm25(d):\n    s = 0.0\n    for t in query:\n        f = d.count(t)\n        if f:\n            s += idf(t) * f * (k1 + 1) / (f + k1 * (1 - b + b * len(d) / avgdl))\n    return round(s, 2)\nskor_d0 = bm25(docs[0])\nskor_d1 = bm25(docs[1])\nskor_d2 = bm25(docs[2])\npemenang = 1\n\nprint(f"idf_bunga={idf_bunga} idf_deposito={idf_deposito} skor_d0={skor_d0} skor_d1={skor_d1} skor_d2={skor_d2} pemenang={pemenang}")`,
            checks: [
              { kind: "equal", task: "t1", name: "idf_bunga", value: 0.13, tol: 0.01, label: "`idf_bunga` = 0,13", msg: "ln(1,143) — kecil karena 'bunga' ada di semua dokumen." },
              { kind: "equal", task: "t1", name: "idf_deposito", value: 0.47, tol: 0.01, label: "`idf_deposito` = 0,47", msg: "ln(1,6) — lebih besar karena 'deposito' lebih langka." },
              { kind: "equal", task: "t2", name: "skor_d0", value: 0.63, tol: 0.01, label: "`skor_d0` = 0,63", msg: "0,14 (bunga) + 0,49 (deposito) = 0,63." },
              { kind: "equal", task: "t2", name: "skor_d1", value: 0.8, tol: 0.01, label: "`skor_d1` = 0,80", msg: "0,14 + 0,66 = 0,80 — 'deposito' 2× tidak melipatgandakan skor (saturasi)." },
              { kind: "equal", task: "t2", name: "skor_d2", value: 0.12, tol: 0.01, label: "`skor_d2` = 0,12", msg: "Hanya 'bunga' (IDF kecil) + dokumen lebih panjang." },
              { kind: "equal", task: "t2", name: "pemenang", value: 1, tol: 1e-9, label: "`pemenang` = dok-1", msg: "Skor tertinggi 0,80." },
              { kind: "stdout_matches", task: "t2", pattern: "idf_bunga=0\\.13\\s+idf_deposito=0\\.47\\s+skor_d0=0\\.63\\s+skor_d1=0\\.8\\s+skor_d2=0\\.12\\s+pemenang=1", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Dok-1 memuat 'deposito' 2×, dok-0 memuatnya 1×. Berapa kira-kira perbandingan kontribusi 'deposito' keduanya?",
              options: [
                { text: "0,66 vs 0,49 — naik, tetapi TIDAK 2× lipat (saturasi k1)", why: "Tepat: TF tersaturasi — kemunculan ke-2 hanya menambah sebagian. Itulah fungsi k1.", correct: true },
                { text: "2× lipat persis — 0,49 vs 0,98", why: "Salah: tanpa saturasi, kata yang diulang 20× akan 20× lebih penting — justru yang dicegah BM25." },
                { text: "Sama persis — pengulangan tidak dihitung BM25", why: "Salah: pengulangan dihitung, tetapi dengan hasil yang menurun (saturasi), bukan diabaikan." },
                { text: "Dok-1 lebih rendah — dokumen dengan kata berulang dihukum", why: "Salah: pengulangan menaikkan skor (0,66 > 0,49) — hanya saja tidak linear." },
              ],
            },
          ],
          reference: "BM25 dari nol: IDF (kata langka > kata umum) × TF tersaturasi (k1) × normalisasi panjang (b). Di sini: d1 0,80 > d0 0,63 > d2 0,12.",
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
        "Dense paham makna/parafrase tetapi buta istilah spesifik; BM25 teliti kata kunci tetapi tuli parafrase.",
        "BM25 = IDF × TF tersaturasi × normalisasi panjang; hybrid = keduanya digabung.",
        "RRF: 1/(k+peringkat) per sistem — gabung peringkat, bukan skor (tanpa normalisasi).",
        "Pipeline: retrieve 50 (hybrid murah) → rerank 5 (cross-encoder teliti); query rewrite untuk ambigu.",
        "Ukur recall@k dan MRR; target recall@5 > 85%; konversi ke rupiah saat presentasi.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Query 'berapa bunga deposito 12 bulan?' gagal di dense tetapi berhasil di BM25. Mengapa?",
          options: [
            { text: "Istilah spesifik 'bunga deposito' cocok persis kata — kekuatan BM25", why: "Tepat: dense buta kata kunci spesifik; BM25 menangkapnya via TF-IDF.", correct: true },
            { text: "Dense selalu lebih buruk", why: "Dense unggul di parafrase — masing-masing punya titik buta.", correct: false },
            { text: "Dokumennya terlalu pendek", why: "BM25 justru menyukai dokumen pendek (normalisasi panjang).", correct: false },
            { text: "Query terlalu panjang", why: "Panjang query bukan penyebab — ini soal kecocokan istilah.", correct: false },
          ],
        },
        {
          q: "Mengapa RRF menggabungkan PERINGKAT bukan SKOR?",
          options: [
            { text: "Skor BM25 dan dense tidak sebanding — normalisasi = menebak", why: "Tepat: peringkat selalu sebanding (#1 vs #1); skor beda 'mata uang'.", correct: true },
            { text: "Peringkat lebih mudah dihitung", why: "Kemudahan bukan alasannya — ketidaksebandingan skor adalah.", correct: false },
            { text: "Skor tidak tersedia", why: "Skor tersedia; masalahnya maknanya beda.", correct: false },
            { text: "RRF lebih lambat", why: "RRF justru sederhana dan cepat.", correct: false },
          ],
        },
        {
          q: "Kapan reranking TIDAK worth it?",
          options: [
            { text: "Tiket gagal murah (Rp500) — biaya rerank > penghematan", why: "Tepat: biaya rerank Rp100/query (50 kandidat × Rp2) × 20.000 = Rp2 juta/hari > hemat 20.000 × 6% × Rp500 = Rp600 ribu/hari. (Hitungan lama lesson ini memakai Rp30/query dan 'hemat Rp80 ribu' — keduanya salah: Rp30/query tidak cocok dengan Rp2/dokumen × 50, dan hemat yang benar Rp600 ribu, bukan Rp80 ribu; dengan angka lama pun kesimpulannya keliru — Rp600 ribu = persis impas, bukan ''.')", correct: true },
            { text: "Butuh akurasi top-1 tinggi", why: "Itu kasus TERKUAT rerank (+18 poin).", correct: false },
            { text: "Dokumen teknis banyak istilah", why: "Justru butuh rerank untuk memilih yang tepat.", correct: false },
            { text: "Selalu worth it", why: "Tidak — hitung (nilai × Δakurasi) vs biaya.", correct: false },
          ],
        },
        {
          q: "recall@5 = 89% artinya?",
          options: [
            { text: "89% query menemukan dokumen benar di 5 teratas", why: "Tepat: dengan satu dokumen benar per query, recall@5 = proporsi query yang dokumen benarnya muncul di 5 teratas (sama dengan hit rate); tanpa asumsi itu, recall membagi dengan jumlah dokumen relevan.", correct: true },
            { text: "89% dokumen diambil", why: "Itu bukan definisi recall@k — ini per query.", correct: false },
            { text: "Akurasi jawaban 89%", why: "Retrieval ≠ generasi; ini soal menemukan, bukan menjawab.", correct: false },
            { text: "MRR = 0,89", why: "Metrik berbeda: MRR memakai 1/peringkat.", correct: false },
          ],
        },
        {
          q: "Optimasi RAG termurah yang memberi 80% keuntungan?",
          options: [
            { text: "Hybrid + RRF, lalu rerank — sebelum fine-tune embedding", why: "Tepat: tangga (2)+(4) = 80% hasil, 20% usaha.", correct: true },
            { text: "Langsung fine-tune embedding", why: "Termahal; lakukan setelah yang murah habis.", correct: false },
            { text: "Perbesar chunk 10x", why: "Chunk besar = konteks berisik; bukan solusi umum.", correct: false },
            { text: "Ganti model generator", why: "Generator bukan masalahnya bila retrieval 71%.", correct: false },
          ],
        },
        {
          q: "Kapan weighted fusion (α·BM25 + (1−α)·dense) layak menggantikan RRF?",
          options: [
            { text: "Ada validation set berlabel dan satu sistem sistematis lebih baik — α ditala dari data", why: "Tepat: bobot butuh bukti (validation), bukan firasat; tanpa keduanya, RRF yang tanpa-parameter lebih aman.", correct: true },
            { text: "Selalu — bobot selalu lebih baik dari demokrasi peringkat", why: "Tidak: tanpa validation berlabel, α = tebakan; RRF justru unggul karena tanpa parameter.", correct: false },
            { text: "Ketika tidak ada data berlabel sama sekali", why: "Justru sebaliknya — tanpa label tidak ada cara menala α yang jujur.", correct: false },
            { text: "Ketika kedua sistem sama kuat", why: "Jika sama kuat, α≈0,5 ≈ RRF — tidak ada keuntungan, hanya tambahan kompleksitas.", correct: false },
          ],
        },
        {
          q: "Distilasi cross-encoder ke bi-encoder. Mengapa pola ini favorit produksi?",
          options: [
            { text: "Menutup 70–80% gap akurasi rerank dengan NOL tambahan latensi serving", why: "Tepat: pengetahuan cross-encoder dipindah ke bi-encoder saat training; serving tetap satu panggilan cepat. (Angka 70–80% adalah hasil tipikal, bukan jaminan — dan 'nol latensi' hanya untuk serving, bukan training.)", correct: true },
            { text: "Menghilangkan kebutuhan BM25", why: "Tidak berhubungan — distilasi soal bi-encoder vs cross-encoder, bukan lexical vs dense.", correct: false },
            { text: "Membuat training 10x lebih cepat", why: "Terbalik: training justru lebih mahal (butuh skor cross-encoder sebagai label); yang hemat adalah serving.", correct: false },
            { text: "Menjamin tidak ada drift", why: "Distilasi tidak menyelesaikan drift — indeks dan bahasa tetap bisa bergeser.", correct: false },
          ],
        },
      ],
    },
  ],
};
