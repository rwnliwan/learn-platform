import type { V2Lesson } from "../lib/types";

// Gateway: request -> cache semantik? -> router model -> fallback. Dan satu cache yang bocor.
const GATEWAY_SVG = `<svg viewBox="0 0 640 230" role="img" aria-label="Alur gateway: request dicek ke cache semantik; hit mengembalikan jawaban tersimpan, miss diteruskan ke router yang memilih model murah atau mahal lalu fallback bila gagal."><g font-family="var(--font-ui)" font-size="11">
<rect x="20" y="90" width="110" height="40" rx="6" fill="var(--c1)"/><text x="75" y="114" text-anchor="middle" fill="var(--text)">Request</text>
<polygon points="175,80 255,110 175,140 95,110" fill="var(--c2)" fill-opacity="0.4" stroke="var(--c2)" stroke-width="1.5"/>
<text x="175" y="107" text-anchor="middle" fill="var(--text)" font-size="10">Cache hit?</text>
<text x="175" y="122" text-anchor="middle" fill="var(--chart-text)" font-size="10">cos ≥ 0,95</text>
<rect x="300" y="40" width="140" height="40" rx="6" fill="var(--c3)"/><text x="370" y="64" text-anchor="middle" fill="var(--text)" font-size="10">Kembalikan jawaban</text>
<text x="240" y="60" fill="var(--chart-text)" font-size="10">ya → Rp0</text>
<rect x="300" y="130" width="140" height="40" rx="6" fill="var(--c2)"/><text x="370" y="147" text-anchor="middle" fill="var(--text)" font-size="10">Router: pilih model</text>
<text x="370" y="163" text-anchor="middle" fill="var(--chart-text)" font-size="10">murah vs mahal</text>
<text x="240" y="150" fill="var(--chart-text)" font-size="10">tidak →</text>
<rect x="490" y="130" width="130" height="40" rx="6" fill="var(--c4)"/><text x="555" y="147" text-anchor="middle" fill="var(--text)" font-size="10">Fallback</text>
<text x="555" y="163" text-anchor="middle" fill="var(--chart-text)" font-size="10">model cadangan</text>
<line x1="255" y1="110" x2="300" y2="60" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="255" y1="110" x2="300" y2="150" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="440" y1="150" x2="488" y2="150" stroke="var(--chart-grid)" stroke-width="1.5"/><polygon points="488,144 488,156 496,150" fill="var(--chart-grid)"/>
<rect x="300" y="185" width="320" height="34" rx="6" fill="var(--c4)" fill-opacity="0.3" stroke="var(--c4)" stroke-width="1.5"/>
<text x="460" y="206" text-anchor="middle" fill="var(--text)" font-size="10">⚠ cache key WAJIB memuat user_id — jawaban personal tidak boleh dibagi</text>
</g></svg>`;

export const llmops21: V2Lesson = {
  slug: "llmops21-gateway-semantic-caching",
  track: "LLMOps",
  module: "Ekonomi & Gateway",
  title: "LLMOps21 — Gateway LLM: LiteLLM, Portkey & Semantic Caching",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Tagihan LLM perusahaan jarang meledak karena `modelnya mahal` — ia meledak karena arsitekturnya boros: setiap request memanggil model termahal, request yang sama dibayar berulang kali, dan tidak ada yang memegang rem budget. Gateway (LiteLLM, Portkey) adalah lapisan di depan semua model yang mengatur routing, fallback, caching, dan budget. Lesson ini tentang mengoperasikannya — termasuk satu cara caching bisa membocorkan data.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan fungsi gateway: routing multi-model, fallback/retry, observability terpusat; (2) merancang semantic cache (threshold kemiripan, TTL, invalidasi) dan menghitung penghematannya; (3) menegakkan structured outputs via JSON schema; (4) memasang budget guardrail per tim/use case; (5) menghindari kebocoran data via cache key yang salah.",
        "Urutan lesson: cerita tagihan yang meledak → gateway & routing → semantic caching → structured outputs & budget → lab router+cache → peta keputusan → mini-case → kuis.",
      ],
      tasks: [],
      reference: "Gateway = resepsionis yang hafal langganan: tahu siapa boleh ke mana, ingat jawaban kemarin, dan memegang dompet.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Tagihan 3x lipat dan jawaban yang tertukar",
      prose: [
        "Startup SapaPelanggan memakai satu model mahal untuk SEMUA request CS: `ringkas keluhan`, `jawab FAQ`, `draf email`. Tagihan bulanan naik 3x dalam dua bulan. Audit log menemukan fakta memalukan: 61% request adalah variasi dari 40 pertanyaan yang sama (`di mana paket saya?` dalam 200 ejaan berbeda) — setiap varian dibayar penuh ke model termahal, berulang kali, setiap hari.",
        "Solusinya bekerja terlalu baik. Mereka memasang semantic cache: request mirip (cosine ≥ 0,95) mendapat jawaban tersimpan, Rp0. Tagihan turun 55% bulan pertama. Lalu datang komplain yang dingin: nasabah A menerima ringkasan keluhan milik nasabah B — lengkap dengan nomor rekeningnya. Cache key hanya berisi teks pertanyaan (`ringkas keluhanku`), tanpa identitas pengguna. Dua nasabah dengan keluhan mirip mendapat jawaban yang sama — termasuk data personal.",
        "Twist-nya: penghematan 55% itu nyata dan benar — dan kebocorannya juga nyata, dari desain yang sama. Cache yang menghemat uang adalah cache yang sama yang membocorkan data, karena keduanya berasal dari satu keputusan: `kapan dua request dianggap sama`.",
        "Lesson ini membangun ketiga kemampuan: routing ke model yang tepat, caching yang hemat, dan cache key yang tidak membocorkan.",
      ],
      tasks: [],
      note: {
        title: "Mitos: cache semantik = cache biasa yang lebih pintar",
        type: "pitfall",
        body: "Yang benar: cache biasa memakai kunci eksak (string sama persis); cache semantik memakai kunci KEMIRIPAN (cosine ≥ ambang). Konsekuensinya: dua request yang `dianggap sama` oleh mesin bisa jadi milik dua orang berbeda — sehingga identitas pengguna WAJIB menjadi bagian cache key untuk konten personal. Kunci yang salah = kebocoran yang sistematis.",
      },
      reference: "`Kapan dua request dianggap sama` adalah keputusan keamanan, bukan sekadar optimasi.",
    },
    {
      id: "gateway-routing",
      eyebrow: "Langkah 3 · Konsep",
      title: "Gateway & routing: satu pintu untuk semua model",
      prose: [
        "Gateway adalah proxy di depan semua panggilan LLM. Aplikasi memanggil SATU endpoint (`gateway/chat`), dan gateway yang memutuskan: model mana (murah vs mahal), provider mana (utama vs cadangan), dengan retry/fallback seperti apa. Tanpa gateway, setiap tim me-wire modelnya sendiri — dan saat provider A down atau harga berubah, 12 tim mengubah kode masing-masing. Dengan gateway, perubahan routing = satu config.",
        "Routing cerdas memakai klasifikasi tugas. Aturannya: tugas rutin/terbatas (klasifikasi, ekstraksi field, FAQ) → model murah; tugas kompleks/berisiko (penalaran, draf legal, keputusan) → model mahal. Klasifikasinya bisa rule-based (panjang, kata kunci, jenis tugas) atau model kecil sebagai router. Kuncinya: keputusan routing TERCATAT di trace — saat kualitas turun, kamu bisa menjawab `apakah karena model murahnya kebanyakan tugas sulit?`",
        "Fallback & retry policy: provider utama timeout/error → coba provider cadangan → kalau masih gagal, kembalikan error yang jujur (bukan jawaban ngawur). Retry hanya untuk error transient (timeout, 429, 5xx) — tidak pernah untuk 400 (request salah; retry 10x tetap salah dan tetap bayar). Setiap retry tercatat; retry storm (semua request retry bersamaan saat provider goyang) dicegah dengan backoff + jitter + circuit breaker.",
        "LiteLLM dan Portkey adalah implementasi populer: LiteLLM (open-source) memberi satu interface OpenAI-compatible ke 100+ provider + routing/fallback; Portkey (managed) menambah gateway dengan guardrail, caching, dan analitik biaya per tim. Pilihannya mengikuti pola lesson lalu: sudah butuh managed + analitik → Portkey; ingin kontrol penuh di infrastruktur sendiri → LiteLLM.",
        "💡 Intuisi: gateway itu seperti resepsionis hotel yang hafal langganan — tamu reguler dengan urusan sederhana diarahkan ke staf cepat, tamu dengan urusan rumit ke manajer, dan kalau manajer sibuk ada penggantinya. Tanpa resepsionis, semua tamu antre di satu meja manajer yang mahal.",
      ],
      tasks: [],
      note: {
        title: "Mitos: satu model terbaik untuk semua request = paling sederhana",
        type: "pitfall",
        body: "Yang benar: `sederhana` di kode = `mahal` di tagihan + `rapuh` saat provider down. Satu model untuk semua adalah arsitektur yang tidak punya rencana B. Gateway memindahkan kompleksitas dari 12 codebase ke 1 config — total kompleksitas TURUN.",
      },
      reference: "Satu endpoint, banyak model. Routing tercatat. Fallback hanya untuk transient.",
    },
    {
      id: "caching-outputs",
      eyebrow: "Langkah 4 · Konsep",
      title: "Semantic caching, structured outputs & budget guardrail",
      prose: [
        "Semantic cache bekerja dalam tiga langkah: (1) embed request menjadi vektor; (2) cari vektor tersimpan dengan cosine similarity ≥ ambang (umumnya 0,95–0,98); (3) jika ketemu (hit), kembalikan jawaban tersimpan tanpa memanggil model — biaya Rp0. Jika tidak (miss), panggil model dan SIMPAN pasangan (vektor, jawaban) ke cache. Hit rate = hit / total request; penghematan = (biaya_tanpa − biaya_dengan) / biaya_tanpa.",
        "Tiga keputusan desain yang menentukan. Ambang: terlalu rendah (0,85) → jawaban `mirip tapi salah konteks` ikut terpakai; terlalu tinggi (0,999) → hit rate anjlok, cache tidak berguna. TTL & invalidasi: jawaban soal `promo bulan ini` basi bulan depan — cache butuh masa berlaku per kategori konten. Dan cache key: untuk konten personal, key = hash(embedding + user_id + versi_konten); untuk konten publik (FAQ), key = hash(embedding) saja. Salah satu komponen hilang = insiden SapaPelanggan terulang.",
        "Structured outputs: memaksa model mengembalikan JSON sesuai schema (bukan `JSON-ish` yang kadang valid). Gunanya operasional: downstream (database, API, agen) tidak perlu parser defensif untuk setiap respons. Ditegakkan di gateway (validasi schema + retry terbatas bila tidak valid) — bukan dengan `mohon jawab dalam JSON` di prompt, karena `mohon` bukan kontrol.",
        "Budget guardrail: batas belanja per tim/use case/hari di level gateway — bukan di tiap aplikasi. Saat 80% tercapai: alert; 100%: request non-kritis ditolak dengan pesan jelas, request kritis tetap jalan (allowlist). Guardrail tanpa allowlist kritis = pemadam yang mematikan seluruh gedung; guardrail tanpa alert = tagihan kejutan.",
        "💡 Intuisi: cache semantik itu seperti pelayan restoran yang hafal pesanan langganan — `yang biasa, ya?` menghemat waktu. Tetapi pelayan yang salah mengenali pelanggan akan mengantar pesanan orang lain ke mejamu. Hafalan (cache) harus dipasangkan dengan pengenalan (identitas).",
      ],
      formula: String.raw`\cos(u,v) = \frac{u \cdot v}{\lVert u \rVert \, \lVert v \rVert} \quad\quad H = \frac{n_{hit}}{n_{total}} \quad\quad S = \frac{C_{tanpa} - C_{cache}}{C_{tanpa}}`,
      formulaNote: "cos(u,v) = kemiripan kosinus dua vektor prompt; u·v = dot product; ||·|| = panjang vektor. H = hit rate; n_hit = request terjawab dari cache. S = penghematan; C_tanpa = biaya tanpa cache; C_cache = biaya dengan cache. Contoh: 100 request, 55 hit → H = 0,55; biaya tanpa Rp100 rb, dengan Rp45 rb → S = 55%. Aturan: hit dihitung hanya bila cos ≥ ambang (0,95).",
      tasks: [],
      note: {
        title: "Mitos: menaikkan ambang cache selalu lebih aman",
        type: "pitfall",
        body: "Yang benar: ambang 0,999 memang hampir menghilangkan false hit — tetapi juga membunuh hit rate (hampir tidak ada yang `cukup mirip`), sehingga cache menjadi pajangan. Keamanan cache dijaga oleh cache KEY yang benar (termasuk user_id), bukan oleh ambang yang ekstrem. Ambang mengatur ekonomi, key mengatur keamanan.",
      },
      reference: "Cache: ambang → ekonomi; key (+user_id) → keamanan; TTL → kebasian. Structured output: schema di gateway.",
    },
    {
      id: "lab-router-cache",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: router + cache semantik",
      prose: [
        "Log 5 request tertanam di bawah: tiap request punya vektor prompt 3-dimensi, token, model, dan harga. Aturan main: untuk tiap request berurutan, hitung kemiripan kosinus maksimum dengan vektor yang sudah di-cache; jika ≥ 0,95 → HIT (biaya 0, tidak disimpan ulang); jika tidak → MISS (bayar sesuai token × harga, lalu simpan vektornya).",
        "Tugasmu: (1) tulis `cos(u, v)`; (2) simulasikan cache dan hitung `hit`, `biaya_tanpa`, `biaya_cache`; (3) hitung `hit_rate` dan `hemat` (proporsi penghematan).",
        "Coba eksplorasi: turunkan AMBANG menjadi 0,90 — apakah hit bertambah? (Tidak untuk data ini: pasangan mirip berikutnya hanya 0,02.) Lalu naikkan ke 0,999 — apa yang terjadi pada q2/q4? Itulah sensitivitas ambang: ekonomi cache ditentukan di sini.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `cos(u, v)` = kemiripan kosinus dua vektor" },
        { id: "t2", text: "Simulasikan cache berurutan → `hit`, `biaya_tanpa`, `biaya_cache`" },
        { id: "t3", text: "Hitung `hit_rate` dan `hemat` dari hasil simulasi" },
      ],
      expected: "hit_rate=0.40 hemat=33.2%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung biaya `biaya_tanpa` hanya dari request yang MISS — padahal tanpa cache SEMUA request membayar, termasuk yang nantinya hit. `biaya_tanpa` = jumlah biaya seluruh 5 request; `biaya_cache` = jumlah biaya request yang miss saja.",
      },
      hints: [
        "cos = dot(u,v) / (norm(u)*norm(v)); norm = sqrt(sum(x*x)).",
        "Untuk tiap request: terbaik = max cos dengan vektor di cache (0.0 bila cache kosong).",
        "biaya = tin/1000*pin + tout/1000*pout; hemat = (tanpa - cache)/tanpa.",
      ],
      code: {
        starter: `import math

# Log request: (id, vektor prompt, token_in, token_out, model, harga_in/1k, harga_out/1k)
LOG = [
    ("q1", [1.0, 0.0, 0.0], 400, 150, "mahal", 0.03, 0.06),
    ("q2", [0.99, 0.01, 0.0], 420, 0, "mahal", 0.03, 0.06),
    ("q3", [0.0, 1.0, 0.0], 300, 200, "mahal", 0.03, 0.06),
    ("q4", [0.0, 0.99, 0.02], 310, 0, "mahal", 0.03, 0.06),
    ("q5", [0.0, 0.0, 1.0], 500, 250, "murah", 0.002, 0.004),
]
AMBANG = 0.95

# TULIS KODEMU
def cos(u, v):
    pass

cache = []
biaya_tanpa = 0.0
biaya_cache = 0.0
hit = 0
hit_rate =
hemat =

print(f"hit_rate={hit_rate:.2f}")
print(f"biaya_tanpa=$" f"{biaya_tanpa:.4f}" f" biaya_cache=$" f"{biaya_cache:.4f}" f" hemat=" f"{hemat:.1%}")`,
        lockLines: 12,
        solution: `import math

# Log request: (id, vektor prompt, token_in, token_out, model, harga_in/1k, harga_out/1k)
LOG = [
    ("q1", [1.0, 0.0, 0.0], 400, 150, "mahal", 0.03, 0.06),
    ("q2", [0.99, 0.01, 0.0], 420, 0, "mahal", 0.03, 0.06),
    ("q3", [0.0, 1.0, 0.0], 300, 200, "mahal", 0.03, 0.06),
    ("q4", [0.0, 0.99, 0.02], 310, 0, "mahal", 0.03, 0.06),
    ("q5", [0.0, 0.0, 1.0], 500, 250, "murah", 0.002, 0.004),
]
AMBANG = 0.95

# TULIS KODEMU
def cos(u, v):
    d = sum(a * b for a, b in zip(u, v))
    nu = math.sqrt(sum(a * a for a in u))
    nv = math.sqrt(sum(b * b for b in v))
    return d / (nu * nv)

cache = []
biaya_tanpa = 0.0
biaya_cache = 0.0
hit = 0
for rid, v, tin, tout, model, pin, pout in LOG:
    biaya = tin / 1000 * pin + tout / 1000 * pout
    biaya_tanpa += biaya
    terbaik = max((cos(v, cv) for cv, _ in cache), default=0.0)
    if terbaik >= AMBANG:
        hit += 1
    else:
        biaya_cache += biaya
        cache.append((v, biaya))

hit_rate = hit / len(LOG)
hemat = (biaya_tanpa - biaya_cache) / biaya_tanpa
print(f"hit_rate={hit_rate:.2f}")
print(f"biaya_tanpa=$" f"{biaya_tanpa:.4f}" f" biaya_cache=$" f"{biaya_cache:.4f}" f" hemat=" f"{hemat:.1%}")`,
        checks: [
          { kind: "defined", task: "t1", name: "cos", label: "`cos` terdefinisi", msg: "Tulis fungsi cos(u, v)." },
          { kind: "equal", task: "t2", name: "hit", value: 2, label: "`hit` = 2", msg: "q2 mirip q1 dan q4 mirip q3 (cos ≥ 0,95); q1, q3, q5 miss." },
          { kind: "equal", task: "t2", name: "biaya_cache", value: 0.044, tol: 0.0005, label: "`biaya_cache` ≈ $0,044", msg: "Hanya q1+q3+q5 yang membayar: 0,021+0,021+0,002." },
          { kind: "equal", task: "t3", name: "hemat", value: 0.332, tol: 0.005, label: "`hemat` ≈ 33,2%", msg: "(0,0659−0,044)/0,0659 ≈ 0,332." },
          { kind: "stdout_matches", task: "t3", pattern: "hit_rate=0\\.40", label: "Cetak hit_rate", msg: "Samakan format: hit_rate=0.40." },
          { kind: "stdout_matches", task: "t3", pattern: "hemat=33\\.2%", label: "Cetak hemat", msg: "Samakan format: hemat=33.2%." },
        ],
      },
      reference: "Cache = ingatan + identitas + masa berlaku. Hitung dulu, baru percaya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Di mana menaruh uang dan di mana menaruh kunci",
      prose: [
        "Lima skenario. Satu: 60%+ request adalah variasi pertanyaan sama (FAQ, status) → semantic cache dulu (ROI tercepat), baru routing. Dua: workload campuran dengan 10% tugas kritis → routing model murah/mahal + budget guardrail per tim; tugas kritis di allowlist guardrail. Tiga: provider utama sering goyang → gateway dengan fallback otomatis + circuit breaker; jangan andalkan satu provider apa pun SLA-nya.",
        "Empat: jawaban dipakai downstream otomatis (DB, API, agen lain) → structured outputs dengan schema di gateway + validasi; jangan percaya `mohon jawab JSON`. Lima: konten personal (data nasabah, ringkasan akun) → cache key WAJIB memuat user_id + versi konten, atau JANGAN cache sama sekali; penghematan tidak pernah lebih penting dari privasi.",
        "Aturan praktis 10 detik: `sering & sama = cache; campur = route; goyang = fallback; downstream = schema; personal = key+user atau jangan cache`. Dan satu aturan nol: tidak ada request yang membayar model mahal untuk pekerjaan model murah — itu bukan strategi, itu donasi.",
      ],
      figure: {
        svg: GATEWAY_SVG,
        alt: "Alur gateway: request dicek ke cache semantik; hit mengembalikan jawaban tersimpan, miss diteruskan ke router yang memilih model murah atau mahal lalu fallback bila gagal.",
        caption: "Cara membaca: mulai dari kotak Request; belah ketupat = keputusan cache (ya = Rp0); di bawah = router lalu fallback. Interpretasi: tiga mekanisme penghematan berlapis (cache → route murah → fallback) — dan kotak peringatan merah: semuanya batal jika cache key-nya salah.",
      },
      tasks: [],
      note: {
        title: "Mitos: gateway menambah latency sehingga merugikan",
        type: "pitfall",
        body: "Yang benar: gateway menambah ~5–20ms per request — tetapi menghemat ratusan ms-to-detik lewat cache hit dan menghindari retry mahal. Yang diukur adalah latency END-TO-END per tugas berhasil, bukan latency per hop. Gateway yang baik menurunkan keduanya: biaya dan waktu.",
      },
      reference: "Cache untuk yang sering, route untuk yang campur, schema untuk downstream, key+user untuk personal.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rp180 juta/bulan menjadi Rp74 juta — dengan aman",
      prose: [
        "SapaPelanggan pasca-insiden: 900.000 request/bulan, tagihan Rp180 juta (semua ke model mahal: Rp200/1k token in-out gabungan rata-rata). Analisis: 55% request adalah variasi 40 pertanyaan (cocok untuk cache, konten PUBLIK: FAQ & status), 30% tugas rutin (klasifikasi, ekstraksi → model murah Rp20/1k), 15% kompleks (tetap model mahal). Cache key baru: hash(embedding + user_id) untuk personal, hash(embedding) untuk publik.",
        "Pertanyaan analisis: (a) hitung tagihan baru: cache menghemat 55% porsi publiknya (asumsi 80% dari 55% itu publik), routing memindahkan 30% ke model 10x lebih murah — berapa totalnya? (b) untuk 15% konten personal yang di-cache, tulis aturan cache key yang aman; (c) rancang budget guardrail: ambang alert dan aturan saat 100% tercapai untuk tim CS vs tim eksperimen.",
        "Pembahasan: (a) porsi publik ter-cache: 0,55 × 0,8 = 44% request → Rp0. Sisanya 56%: 30% ke model murah (Rp20 vs Rp200 = 1/10) dan 26% tetap mahal. Tagihan ≈ 180 × (0,30×0,1 + 0,26×1) = 180 × 0,29 ≈ Rp52 juta — plus sisa cache-miss publik ~Rp22 juta → total ±Rp74 juta (hemat ~59%). (b) key = hash(embedding_normalized + user_id + versi_konten) + TTL 7 hari; konten personal TIDAK memakai key publik bersama. (c) alert 80%: notifikasi + review; 100%: tim eksperimen ditolak (pesan jelas), tim CS (kritis) tetap jalan via allowlist + eskalasi ke VP Eng.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Penghematan 59% adalah angka bisnis; cache key yang aman adalah kontrol risiko. Keduanya harus hadir di proposal yang sama — proposal yang hanya membawa angka penghematan tanpa desain key akan mengulang insiden SapaPelanggan. Finansial dan risiko ditandatangani bersama.",
      },
      reference: "Hitung dulu (Rp180jt → Rp74jt), amankan dulu (key+user), baru rayakan.",
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
        "Gateway: satu endpoint, routing murah/mahal tercatat, fallback hanya untuk transient.",
        "Semantic cache: hit bila cos ≥ ambang; hit rate & penghematan dihitung, bukan dirasa.",
        "Cache key konten personal WAJIB memuat user_id; ambang mengatur ekonomi, key mengatur keamanan.",
        "Structured outputs: schema ditegakkan di gateway, bukan dimohon di prompt.",
        "Budget guardrail: alert 80%, tolak non-kritis di 100%, allowlist untuk kritis.",
        "Tidak ada request membayar model mahal untuk pekerjaan model murah.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "61% request adalah variasi 40 pertanyaan yang sama, semuanya ke model termahal. Intervensi pertama dengan ROI tercepat?",
          options: [
            { text: "Ganti ke model yang lebih murah untuk semua request", why: "Menurunkan biaya per request tetapi tetap membayar 61% duplikasi — menyisakan setengah penghematan di meja." },
            { text: "Semantic cache untuk pertanyaan berulang (konten publik)", why: "61% variasi pertanyaan sama = hit rate potensial > 50% dengan biaya Rp0 per hit. Ini intervensi dengan ROI tercepat sebelum routing.", correct: true },
            { text: "Naikkan ambang cache ke 0,999", why: "Ambang ekstrem membunuh hit rate — cache menjadi tidak berguna." },
            { text: "Tambah GPU sendiri", why: "Capex besar untuk masalah yang sebenarnya adalah arsitektur boros, bukan kapasitas." },
          ],
        },
        {
          q: "Dua nasabah dengan keluhan mirip mendapat ringkasan milik satu sama lain dari cache. Akar masalahnya?",
          options: [
            { text: "Ambang cosine terlalu rendah", why: "Ambang mengatur false hit antar TEKS mirip — tetapi kedua keluhan memang mirip; masalahnya identitas, bukan kemiripan." },
            { text: "Cache key tidak memuat user_id untuk konten personal", why: "Kunci `teks saja` membuat dua orang dengan teks mirip dianggap `sama`. Untuk konten personal, key wajib memuat identitas.", correct: true },
            { text: "Model embedding yang buruk", why: "Embedding bekerja benar: teksnya memang mirip. Yang salah adalah keputusan `dianggap sama` tanpa identitas." },
            { text: "TTL terlalu panjang", why: "TTL mengatur kebasian, bukan kebocoran antar-pengguna." },
          ],
        },
        {
          q: "Downstream otomatis (database) memakai output LLM. Cara operasional yang benar memastikan format?",
          options: [
            { text: "Tambahkan `mohon jawab dalam JSON` di system prompt", why: "`Mohon` bukan kontrol — model kadang tetap mengembalikan JSON-ish yang tidak valid." },
            { text: "Structured outputs: schema ditegakkan di gateway + validasi + retry terbatas", why: "Kontrol di level sistem: schema divalidasi mesin, bukan diharapkan dari kesopanan model.", correct: true },
            { text: "Parsing dengan regex yang toleran", why: "Regex toleran menyembunyikan format rusak; downstream tetap rapuh." },
            { text: "Pakai model yang lebih besar", why: "Model besar juga bisa mengembalikan format salah — ini masalah penegakan, bukan kecerdasan." },
          ],
        },
        {
          q: "Provider utama mengembalikan HTTP 400 untuk request. Kebijakan retry yang benar?",
          options: [
            { text: "Retry 3x dengan backoff, lalu fallback", why: "400 = request salah; retry 10x tetap salah dan tetap membayar. Retry hanya untuk transient (timeout, 429, 5xx)." },
            { text: "Jangan retry; catat dan kembalikan error yang jujur (atau fallback bila kebijakan mengizinkan)", why: "400 bukan transient — mengulanginya adalah donasi ke provider. Fallback ke provider lain boleh bila memang diinginkan, bukan retry buta.", correct: true },
            { text: "Retry sampai berhasil", why: "Itu cara tercepat membakar budget untuk request yang tidak akan pernah berhasil." },
            { text: "Diamkan dan kembalikan cache lama", why: "Mengembalikan jawaban basi untuk request yang salah format = dua kesalahan sekaligus." },
          ],
        },
        {
          q: "Budget guardrail mencapai 100% untuk tim eksperimen (non-kritis). Tindakan yang benar?",
          options: [
            { text: "Naikkan budget diam-diam agar tidak mengganggu", why: "Guardrail yang dinaikkan diam-diam = tidak ada guardrail." },
            { text: "Tolak request non-kritis dengan pesan jelas + eskalasi; tim kritis tetap jalan via allowlist", why: "Itulah fungsi guardrail: melindungi yang kritis dengan mengorbankan yang non-kritis, secara transparan dan tercatat.", correct: true },
            { text: "Matikan semua request termasuk tim CS", why: "Mematikan yang kritis karena yang non-kritis boros = menghukum korban." },
            { text: "Pindahkan semua ke model termurah otomatis", why: "Perubahan model diam-diam mengubah kualitas; itu keputusan, bukan darurat." },
          ],
        },
        {
          q: "Apa yang HARUS tercatat di trace untuk setiap request via gateway?",
          options: [
            { text: "Hanya model yang dipakai dan biayanya", why: "Tidak cukup untuk diagnosis: tanpa tahu cache hit/miss dan alasan routing, penurunan kualitas tidak terlacak." },
            { text: "Cache hit/miss + alasan routing + model + fallback yang terjadi + biaya", why: "Kelima ini menjawab semua pertanyaan pasca-insiden: `kenapa mahal?` (miss/routing), `kenapa salah?` (model), `kenapa lambat?` (fallback).", correct: true },
            { text: "Hanya prompt dan respons lengkap", why: "Menyimpan semua prompt/respons mahal dan berisiko privasi; yang dibutuhkan adalah keputusan-keputusan, bukan seluruh isi." },
            { text: "Tidak perlu trace — gateway sudah menghemat", why: "Penghematan tanpa observability = tidak bisa membuktikan dari mana penghematan datang atau kapan ia rusak." },
          ],
        },
      ],
    },
  ],
};
