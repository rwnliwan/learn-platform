import type { V2Lesson } from "../lib/types";

export const mle13: V2Lesson = {
  slug: "mle13-llm-ml",
  track: "Machine Learning Engineer",
  module: "Skala & Tanggung Jawab",
  title: "MLE13 — LLM dalam Sistem ML",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "LLM bukan pengganti sistem ML — ia adalah KOMPONEN baru di dalamnya: sebagai pemberi fitur (embedding), sebagai pekerja (klasifikasi/generasi), dan sebagai juri (evaluasi). Lesson ini menempatkannya dengan tepat.",
        "Tujuan lesson ini:",
        "• Menjelaskan embedding sebagai fitur dan similarity search.",
        "• Menghitung cosine similarity dari nol dan retrieval top-k.",
        "• Merancang pola integrasi: LLM sebagai fitur, pekerja, dan juri.",
        "• Mengevaluasi kelayakan LLM-as-judge dengan angka agreement.",
        "• Memutuskan kapan memakai LLM vs model klasik untuk 4 skenario.",
        "Isi lesson: cerita classifier 2 hari → embedding + lab cosine → pola integrasi → LLM-as-judge + lab → cost & guardrails → peta keputusan → mini-case → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Classifier intent yang selesai dalam 2 hari",
      prose: [
        "Tim CS sebuah bank merencanakan proyek 3 bulan: membangun classifier intent chatbot dari nol — kumpulkan 10 ribu label, latih model, tuning, deploy.",
        "Seorang MLE junior mencoba jalan pintas: ambil embedding dari model pre-trained, tulis 20 contoh intent sebagai 'jangkar', klasifikasikan dengan cosine similarity ke jangkar terdekat. Waktu pengerjaan: 2 hari. F1: 0,91 — mengalahkan target proyek 3 bulan (0,88).",
        "Twist-nya: yang mahal bukan training-nya — melainkan tidak tahu bahwa masalah ini sudah 'solved' oleh representasi yang dipelajari orang lain. Embedding adalah transfer learning yang paling mudah dipakai: pengetahuan bahasa dunia, gratis, tanpa training.",
        "Pelajaran: sebelum melatih apa pun untuk teks, tanyakan dulu 'apakah embedding + metode sederhana cukup?' Seringkali cukup — dan 45x lebih cepat.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: 'untuk NLP harus fine-tune LLM sendiri'",
        type: "pitfall",
        body: "Yang benar: hierarki usaha — (1) embedding + cosine/kNN, (2) prompt LLM, (3) fine-tune. Kebanyakan kasus klasifikasi/retrieval selesai di level 1–2. Fine-tune adalah opsi terakhir, bukan pertama.",
      },
    },
    {
      id: "embedding",
      eyebrow: "Langkah 3 · Embedding sebagai fitur",
      title: "Cosine similarity: kedekatan makna sebagai angka",
      prose: [
        "Embedding mengubah teks menjadi vektor angka (ratusan dimensi) di mana teks yang mirip maknanya berdekatan. Cosine similarity mengukur kedekatan: 1 = identik arah, 0 = tidak berhubungan.",
        "Pola retrieval: ubah dokumen menjadi embedding SEKALI (offline), simpan di vector DB; saat query datang, embed query, cari tetangga terdekat. Inilah fondasi RAG dan semantic search.",
        "Kenapa cosine, bukan jarak Euclidean? Karena pada embedding teks, ARAH vektor membawa makna; panjangnya sering artefak frekuensi kata. Cosine mengabaikan panjang — fokus pada arah.",
        "Lab: 5 dokumen 2D + 1 query. Cosine tertinggi: d1 (0,993), d2 (0,992) — keduanya tentang topik yang sama dengan query. Top-2 retrieval bekerja persis seperti sistem nyata, hanya dimensinya 2 bukan 768.",
        "Mengapa cosine, bukan Euclidean — contoh angka. v1=“kucing” (panjang 5,2), v2=“kucing kucing kucing” (panjang 15,6, arah SAMA). Euclidean distance = 10,4 (“jauh”!) — padahal maknanya identik. Cosine = 0,99 (“sama”). Euclidean menghukum panjang teks; cosine tidak. Untuk teks (panjang bervariasi, makna yang penting): cosine. Untuk vektor fitur numerik (skala penting): Euclidean. Pilih metrik sesuai MAKNA JARAK di domainmu — bukan default library.",
        "Embedding model — pilih dengan 3 kriteria. (1) Bahasa: multilingual untuk Indonesia (bukan English-only!). (2) Dimensi vs biaya: 384-dim cukup untuk kebanyakan kasus (bukan 1536!). (3) Benchmark MTEB untuk domainmu. Jangan default ke “yang populer” — uji 3 kandidat pada 100 sampel domainmu, pilih yang cosine-nya paling sesuai label manusia. 2 jam evaluasi = menghemat Rp10 juta/bln API yang salah pilih.",
      ],
      formula: String.raw`\text{cos}(a,b) = \frac{a \cdot b}{\|a\|\,\|b\|}`,
      formulaNote: "cos(a,b) = (a·b)/(|a|·|b|): a·b = dot product; |a|,|b| = panjang vektor. Hasil 1 = arah IDENTIK (makna sama), 0 = tidak berhubungan, −1 = berlawanan. Cosine mengabaikan PANJANG vektor — yang penting ARAH (makna), bukan magnitude (panjang teks). “Saya suka kucing” vs “saya sangat sangat suka kucing” ≈ cos 0,95 — makna sama, panjang beda.",
      figure: {
        svg: `<svg viewBox="0 0 480 200" role="img" aria-label="Cosine similarity query vs dokumen">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Cosine similarity query vs dokumen</text>
<line x1="46" y1="166.0" x2="466" y2="166.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="170.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.0</text>
<line x1="46" y1="131.0" x2="466" y2="131.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="135.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.2</text>
<line x1="46" y1="96.0" x2="466" y2="96.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="100.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.5</text>
<line x1="46" y1="61.0" x2="466" y2="61.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="65.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0.7</text>
<line x1="46" y1="26.0" x2="466" y2="26.0" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="40" y="30.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1.0</text>
<rect x="61.1" y="26.0" width="53.8" height="140.0" fill="var(--c1)" rx="3"/>
<text x="88.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.99</text>
<text x="88.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d1</text>
<rect x="145.1" y="26.0" width="53.8" height="140.0" fill="var(--c2)" rx="3"/>
<text x="172.0" y="20.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.99</text>
<text x="172.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d2</text>
<rect x="229.1" y="45.8" width="53.8" height="120.2" fill="var(--c3)" rx="3"/>
<text x="256.0" y="39.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.85</text>
<text x="256.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d5</text>
<rect x="313.1" y="102.4" width="53.8" height="63.6" fill="var(--c4)" rx="3"/>
<text x="340.0" y="96.4" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.45</text>
<text x="340.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d4</text>
<rect x="397.1" y="112.3" width="53.8" height="53.7" fill="var(--c1)" rx="3"/>
<text x="424.0" y="106.3" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0.38</text>
<text x="424.0" y="182.0" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">d3</text>
<line x1="46" y1="166" x2="466" y2="166" stroke="var(--chart-grid)" stroke-width="1"/>
</svg>`,
        alt: "Bar chart cosine similarity: d1 dan d2 tertinggi (~0,99).",
        caption: "Cara membaca: tinggi batang = cosine similarity query terhadap tiap dokumen. Interpretasi: d1/d2 nyaris 1 (sangat relevan) — sistem akan mengambil keduanya sebagai konteks. Inilah 'pencarian makna', bukan pencocokan kata.",
      },
      tasks: [
        { id: "t1", text: "Tulis fungsi `cosine(a, b)` dari nol" },
        { id: "t2", text: "Hitung skor semua dokumen, ambil `top2` teratas" },
        { id: "t3", text: "Cetak top2 dan skor d1 (3 desimal)" },
      ],
      expected: "",
      note: {
        title: "💡 Intuisi: embedding = kamus makna yang bisa dihitung",
        body: "'Raja - pria + wanita = ratu' adalah contoh klasik: operasi aritmetika pada embedding menangkap hubungan semantik. Retrieval modern = aritmetika makna dalam skala besar.",
      },
      hints: [
        "dot = sum(x*y for x,y in zip(a,b)); norm = sqrt(sum(x*x for x in a)).",
        "cosine = dot / (na * nb).",
        "sorted(skor, key=skor.get, reverse=True)[:2] untuk top-2.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import math
docs = {"d1": (0.9, 0.1), "d2": (0.8, 0.3), "d3": (0.1, 0.9), "d4": (0.2, 0.8), "d5": (0.5, 0.5)}
query = (0.85, 0.2)

# TULIS KODEMU: cosine similarity
def cosine(a, b):
    
skor = 
top2 = 

print(f"top2={top2}  skor_d1={skor['d1']:.3f}")`,
        lockLines: 4,
        solution: `# === SEED TERKUNCI: jangan ubah 2 baris berikut ===
import math
docs = {"d1": (0.9, 0.1), "d2": (0.8, 0.3), "d3": (0.1, 0.9), "d4": (0.2, 0.8), "d5": (0.5, 0.5)}
query = (0.85, 0.2)

# TULIS KODEMU: cosine similarity
def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(x * x for x in b))
    return dot / (na * nb)
skor = {d: cosine(v, query) for d, v in docs.items()}
top2 = sorted(skor, key=skor.get, reverse=True)[:2]

print(f"top2={top2}  skor_d1={skor['d1']:.3f}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t2",
            "label": "`top2` = [d1, d2]",
            "name": "top2",
            "value": [
              "d1",
              "d2",
            ],
            "tol": 1e-09,
            "msg": "d1 (0.993) dan d2 (0.992) paling dekat dengan query.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan skor",
            "pattern": "skor_d1=0\\.993",
            "msg": "Cosine d1 vs query = 0.993.",
          },
        ],
      },
      reference: "Cosine = dot product ternormalisasi. 1 = searah, 0 = ortogonal.",
    },
    {
      id: "pola",
      eyebrow: "Langkah 4 · Tiga peran LLM",
      title: "Fitur, pekerja, juri",
      prose: [
        "Peran 1 — LLM sebagai pemberi fitur: embedding untuk classifier, clustering, atau retrieval. Murah, deterministik, mudah di-cache. Inilah peran dengan ROI tertinggi.",
        "Peran 2 — LLM sebagai pekerja: klasifikasi/generasi via prompt. Fleksibel (tanpa training), tetapi mahal, lambat, dan non-deterministik. Cocok untuk kasus kompleks bervolume rendah.",
        "Peran 3 — LLM sebagai juri (LLM-as-judge): menilai output sistem lain (mis. kualitas ringkasan). Skala evaluasi tanpa manusia — TETAPI harus divalidasi: bandingkan dengan label manusia dulu (agreement rate).",
        "Aturan: jangan pakai LLM sebagai juri tanpa mengukur agreement-nya. Juri yang tidak tervalidasi = opini mahal yang terlihat seperti metrik.",
        "Pola 2 — LLM sebagai PEKERJA: kapan worth it? Klasifikasi 10.000 dokumen SEKALI (proyek migrasi): LLM $120 SEKALI vs bangun classifier 3 bulan (Rp45 juta) — LLM menang telak. Klasifikasi 5.000/detik KONTINU: LLM $36.000/bln vs classifier Rp5 juta/bln — classifier menang. Aturan: SEKALI/JARANG → LLM; KONTINU/VOLUME → classifier khusus. Dan pola 3 — LLM sebagai JURI: hanya jika agreement ≥0,8 vs manusia (mle13 quiz) — juri yang tak terkalibrasi = opini mahal.",
        "Anti-pola — kapan JANGAN pakai LLM. (1) Butuh determinisme 100% (aturan compliance) → aturan manual. (2) Latency <10ms → model kecil/aturan. (3) Data sensitif + API eksternal → self-host atau jangan. (4) Tugas yang LEBIH MURAH dengan regex (ekstrak tanggal!) → regex. LLM = palu mahal; tidak semua masalah = paku. Checklist “apakah LLM benar-benar dibutuhkan?” menghemat Rp30 juta/bln untuk tim yang jujur menjawabnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `agreement`: proporsi judge == human" },
        { id: "t2", text: "Hitung `cost` = n × $0.002; tentukan `verdict` (agreement ≥ 0.8 → 'layak')" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "",
      note: {
        title: "🚨 Mitos: 'LLM-as-judge bisa langsung menggantikan evaluator manusia'",
        type: "pitfall",
        body: "Yang benar: judge harus dikalibrasi dulu terhadap manusia (agreement ≥ 0,8) DAN di-rekalibrasi berkala — LLM judge bisa drift mengikuti update model. Tanpa itu, ia mengukur dirinya sendiri.",
      },
      hints: [
        "agreement = sum(1 for h, j in zip(human, judge) if h == j) / n.",
        "cost = n * 0.002.",
        "verdict = 'layak' jika agreement >= 0.8 else 'belum layak'.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
import random
random.seed(61)
n = 200
human = [random.choice([0, 1]) for _ in range(n)]
judge = [h if random.random() < 0.85 else 1 - h for h in human]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: validasi LLM-as-judge
agreement = 
cost = 
verdict = 

print(f"agreement={agreement:.2f}  cost=\${cost:.2f}  verdict={verdict}")`,
        lockLines: 7,
        solution: `# === SEED TERKUNCI: jangan ubah 3 baris berikut ===
import random
random.seed(61)
n = 200
human = [random.choice([0, 1]) for _ in range(n)]
judge = [h if random.random() < 0.85 else 1 - h for h in human]
# === AKHIR BLOK TERKUNCI ===

# TULIS KODEMU: validasi LLM-as-judge
agreement = sum(1 for h, j in zip(human, judge) if h == j) / n
cost = n * 0.002
verdict = "layak" if agreement >= 0.8 else "belum layak"

print(f"agreement={agreement:.2f}  cost=\${cost:.2f}  verdict={verdict}")`,
        checks: [
          {
            "kind": "equal",
            "task": "t1",
            "label": "`agreement` ≈ 0.82",
            "name": "agreement",
            "value": 0.82,
            "tol": 0.01,
            "msg": "Judge setuju dengan manusia 82% — di atas ambang 0.8.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` memvonis layak",
            "pattern": "verdict=layak",
            "msg": "0.82 ≥ 0.8 → layak dipakai sebagai juri.",
          },
        ],
      },
      reference: "Validasi judge = bandingkan dengan ground truth manusia. Ulangi berkala.",
    },
    {
      id: "ops",
      eyebrow: "Langkah 5 · Cost, latency, guardrails",
      title: "Harga nyata memakai LLM di produksi",
      prose: [
        "Cost: LLM API ditagih per token. 3 juta pertanyaan/bulan × $0,012 = $36.000/bulan (mini-case MLE11). Tuas: cache, routing ke model kecil, prompt lebih pendek.",
        "Latency: ratusan ms hingga detik — jauh di atas SLO real-time ketat. Solusi: streaming token (UX terasa cepat), atau LLM hanya untuk jalur kompleks.",
        "Non-determinisme: prompt sama bisa hasil beda (temperature > 0). Untuk keputusan konsisten: temperature 0 + validasi output terstruktur (JSON schema).",
        "Guardrails: filter input (PII, prompt injection), filter output (konten berbahaya), dan fallback ke sistem klasik jika LLM gagal/timeout. LLM tanpa guardrails di produksi = pintu terbuka.",
        "Tiga tuas biaya LLM — dengan angka. (1) CACHE: 30% query berulang × $0,012 = hemat $10.800/bln (dari $36.000). Implementasi: hash prompt → simpan respons 24 jam. (2) ROUTING: 80% mudah → model kecil ($0,001): hemat $28.800/bln. Router = classifier kecil (Rp500 ribu/bln). (3) PROMPT PENDEK: 2.000 → 800 token: −60% biaya input. Total: $36.000 → ~$4.000 (−89%). Tidak ada tuas yang “canggih” — semuanya disiplin dasar. Tagihan LLM = cerminan kedisiplinan arsitektur.",
        "Non-determinisme — risiko yang diremehkan. Temperature >0: output BERBEDA tiap panggil — untuk klasifikasi = inkonsistensi (dokumen sama, label beda!). Untuk produksi: temperature=0 + seed (jika didukung). Tetapi BAHKAN itu tidak menjamin 100% deterministik (infrastruktur provider). Untuk keputusan kritis: JANGAN pakai LLM langsung — pakai sebagai PEMBERI FITUR (embedding, deterministik) + classifier deterministik. Arsitektur = menempatkan non-determinisme di tempat yang aman.",
        "Evals untuk LLM — golden set 200 sampel. (1) Sampel dari PRODUKSI (bukan yang “menarik”). (2) Label manusia untuk 200. (3) Metrik: akurasi + biaya + latency per sampel. (4) Jalankan tiap ganti prompt/model. Tanpa evals: “model baru kayaknya lebih baik” = opini Rp36 juta/bln. Dengan evals: keputusan. Evals = Rp2 juta sekali (labeling) untuk melindungi Rp432 juta/tahun. Rasio 1:216.",
      ],
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: LLM adalah karyawan brilian yang kadang mengarang",
        body: "Kamu tidak memberi karyawan baru akses produksi tanpa supervisi. Perlakukan LLM sama: batasi wewenangnya, verifikasi outputnya, siapkan fallback-nya.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "LLM atau model klasik?",
      prose: [
        "Skenario 1 — Klasifikasi intent chatbot, 10 ribu contoh → embedding + cosine/kNN. Alasan: murah, cepat, F1 0,91 tanpa training (cerita pembuka).",
        "Skenario 2 — Ringkasan dokumen kompleks bervolume rendah → LLM via prompt. Alasan: fleksibilitas mengalahkan biaya untuk kasus sulit dan jarang.",
        "Skenario 3 — Fraud real-time 5.000 rps, SLO 100ms → model klasik (gradient boosting). Alasan: LLM terlalu lambat dan mahal untuk throughput ini.",
        "Skenario 4 — Evaluasi 100 ribu ringkasan/bulan → LLM-as-judge (setelah validasi agreement ≥ 0,8). Alasan: manusia tidak berskala; judge tervalidasi cukup baik.",
        "Aturan praktis 10 detik: (1) Apakah embedding + sederhana cukup? (2) Apakah latency/biaya LLM masuk akal untuk volumenya? (3) Apakah output butuh determinisme? Jawaban menentukan peran LLM.",
        "Skenario 3 — butuh penjelasan “mengapa dokumen ini relevan?” (compliance) → embedding + cosine SAJA tidak cukup (skor 0,87 tidak bisa dijelaskan ke auditor). Tambah: highlight kata berkontribusi + aturan bisnis (“skor >0,8 DAN mengandung kata kunci regulasi”). Atau: pakai LLM untuk EXPLAIN (bukan untuk decide). Prinsip: yang memutuskan boleh statistik; yang menjelaskan harus bisa dibaca manusia. Compliance = bukan sekadar akurat, tetapi DAPAT DIJELASKAN.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "E-commerce: search yang mengerti 'sepatu lari murah'",
      prose: [
        "Search keyword lama: 'sepatu lari murah' → cocokkan kata → hasil sedikit karena produk bertuliskan 'running shoes diskon'. Conversion search: 1,8%.",
        "Solusi embedding: embed 2 juta produk sekali (offline, $400), embed query saat datang, cosine top-20. 'Sepatu lari murah' kini menemukan 'running shoes diskon' — makna, bukan kata. Conversion: 1,8% → 3,1% (+72%).",
        "Biaya operasional: embedding query $0,0001 + vector search 40ms — jauh di bawah SLO 300ms. Tidak ada LLM generatif sama sekali.",
        "Pertanyaan: (a) Kenapa tidak pakai LLM generatif untuk search? (b) Kapan embedding perlu di-refresh? (c) Risiko terbesar?",
        "Pembahasan: (a) Search butuh retrieval cepat dan murah per query — LLM generatif lambat, mahal, dan tidak memberi ranking deterministik. (b) Saat katalog berubah signifikan (produk baru tidak punya embedding) atau model embedding di-upgrade → re-embed terjadwal + versioning (MLE8!). (c) Drift makna: embedding lama untuk tren baru ('quiet luxury') — monitor kualitas retrieval via click-through rate.",
        "Search semantik — angka lengkap. Keyword: “sepatu lari murah” → 120 hasil (sedikit yang cocok kata) → konversi 1,8%. Semantik (embedding + cosine): “running shoes diskon”, “sneakers jogging promo” ikut cocok → 850 hasil relevan → konversi 3,4% (+89%!). Biaya: embedding 100.000 produk SEKALI ($50) + cosine per query (gratis, komputasi lokal). ROI: +1,6 poin konversi × Rp10 miliar GMV = Rp160 juta/bln — dari $50. Pencarian = masalah ML klasik yang “selesai” dengan embedding.",
      ],
      tasks: [
      ],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah.",
        "Refleksi: LLM = komponen, bukan sihir. Tiga peran (fitur/pekerja/juri), tiga tuas biaya (cache/routing/prompt), tiga risiko (non-determinisme/input jahat/biaya). Satu prinsip: “mulai dari yang TERMURAH (embedding + aturan), naik hanya jika terbukti tidak cukup”. Hierarki yang disiplin = tagihan yang waras. Yang mulai dari LLM untuk segalanya = tagihan yang mengejutkan.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Klasifikasi intent, 10 ribu contoh, butuh cepat. Pendekatan pertama?",
          options: [
            {
              text: "Fine-tune LLM 70B",
              why: "Opsi terakhir — mahal dan lambat untuk masalah ini.",
            },
            {
              text: "Embedding + cosine/kNN",
              why: "Tepat: 2 hari, F1 0,91 — mulai dari yang termurah.",
              correct: true,
            },
            {
              text: "Rule-based manual",
              why: "Intent bahasa terlalu variatif untuk aturan manual.",
            },
            {
              text: "Tidak usah dibuat",
              why: "Solusi murah tersedia; tidak ada alasan menunda.",
            },
          ],
        },
        {
          q: "Kenapa cosine similarity (bukan Euclidean) untuk embedding teks?",
          options: [
            {
              text: "Lebih cepat dihitung",
              why: "Salah: keduanya SAMA-SAMA murah secara komputasi (O(d) per pasangan) — tetapi cosine BENAR secara makna untuk teks (mengabaikan panjang), Euclidean SALAH (menghukum teks panjang). “Sebanding komputasi” ≠ “sama baik”. Pilih berdasarkan MAKNA, bukan kecepatan.",
            },
            {
              text: "Arah vektor membawa makna; panjang sering artefak",
              why: "Tepat: cosine fokus pada arah, mengabaikan panjang.",
              correct: true,
            },
            {
              text: "Euclidean tidak bisa untuk vektor",
              why: "Euclidean valid untuk vektor; hanya kurang tepat untuk makna.",
            },
            {
              text: "Cosine selalu 1",
              why: "Tidak — bervariasi 0 hingga 1 sesuai kedekatan.",
            },
          ],
        },
        {
          q: "LLM-as-judge agreement 0,65 vs manusia. Keputusan?",
          options: [
            {
              text: "Pakai saja, lumayan",
              why: "0,65 < 0,8 — juri tidak cukup selaras dengan manusia.",
            },
            {
              text: "Belum layak — perbaiki prompt/kalibrasi atau tetap pakai manusia",
              why: "Tepat: di bawah ambang, ia adalah opini mahal bukan metrik.",
              correct: true,
            },
            {
              text: "Naikkan temperature",
              why: "Menaikkan temperature menambah variansi, bukan agreement.",
            },
            {
              text: "Kurangi sampel validasi",
              why: "Mengurangi sampel menyembunyikan masalah, bukan memperbaikinya.",
            },
          ],
        },
        {
          q: "Fraud real-time 5.000 rps, SLO 100ms. Pilihan arsitektur?",
          options: [
            {
              text: "LLM via API untuk tiap transaksi",
              why: "Terlalu lambat (detik) dan mahal untuk 5.000 rps.",
            },
            {
              text: "Model klasik (boosting) yang teroptimasi",
              why: "Tepat: latency ms, biaya rendah, throughput tinggi.",
              correct: true,
            },
            {
              text: "Manual review semua",
              why: "Tidak berskala: LLM API ~1–5 detik per request × 5.000 rps = butuh 25.000 koneksi paralel — mustahil dan bangkrut ($36.000/bln × 100). Untuk 5.000 rps: model kecil lokal (ms, murah) atau aturan. Arsitektur = fungsi dari SKALA; skala mengubah segalanya.",
            },
            {
              text: "Embedding + LLM chain",
              why: "Menambah latency berlapis — berlawanan dengan SLO.",
            },
          ],
        },
        {
          q: "Risiko terbesar LLM di produksi tanpa guardrails?",
          options: [
            {
              text: "Terlalu akurat",
              why: "Bukan risiko DIBANDING opsi lain: murah = keuntungan, bukan risiko. Risiko sesungguhnya = non-determinisme (output berubah-ubah) + input jahat (prompt injection) + biaya tak terkendali. Jangan tertukar antara “murah” (fitur) dan “risiko” (bahaya).",
            },
            {
              text: "Output tak terduga (halusinasi, prompt injection) tanpa fallback",
              why: "Tepat: non-determinisme + input jahat = insiden tanpa pengaman.",
              correct: true,
            },
            {
              text: "Kode terlalu rapi",
              why: "Tidak relevan dengan keputusan arsitektur: opsi ini tidak membahas trade-off biaya/latency/risiko. Setiap jawaban yang baik menyebut angka (ms? $/bulan? rps?) — tanpa angka = opini.",
            },
            {
              text: "Terlalu murah",
              why: "LLM justru mahal; dan murah bukan risiko.",
            },
          ],
        },
      ],
      summary: [
        "Hierarki usaha NLP: embedding + sederhana → prompt LLM → fine-tune (terakhir).",
        "Cosine similarity mengukur kedekatan makna (arah vektor).",
        "Tiga peran LLM: pemberi fitur (termurah), pekerja (fleksibel), juri (harus divalidasi).",
        "LLM-as-judge butuh agreement ≥ 0,8 vs manusia + rekalibrasi berkala.",
        "LLM mahal, lambat, non-deterministik — butuh guardrails dan fallback.",
        "Untuk throughput tinggi / SLO ketat, model klasik sering menang.",
      ],
      next: { label: "MLE14 — Capstone: Sistem ML End-to-End", href: "/v2/learn/mle14-capstone" },
    },
  ],
};
