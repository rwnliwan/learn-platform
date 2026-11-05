import type { V2Lesson } from "../lib/types";

// Skor judge per kriteria untuk prompt v1 vs v2 (dari lab). Skala 1-5.
// v1: akurasi 4.00, relevansi 4.33, aman 4.67. v2: akurasi 3.67, relevansi 3.67, aman 4.33.
const JUDGE_SVG = `<svg viewBox="0 0 560 240" role="img" aria-label="Skor judge v1 vs v2 per kriteria">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<line x1="40" y1="200" x2="520" y2="200" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="140" y="220" fill="var(--text)">Akurasi</text><text x="280" y="220" fill="var(--text)">Relevansi</text><text x="420" y="220" fill="var(--text)">Aman</text>
<rect x="104" y="80" width="32" height="120" rx="4" fill="var(--c1)" fill-opacity="0.85"/><text x="120" y="72" fill="var(--text)">4,00</text>
<rect x="140" y="90" width="32" height="110" rx="4" fill="var(--c2)" fill-opacity="0.55"/><text x="156" y="82" fill="var(--text)">3,67</text>
<rect x="244" y="70" width="32" height="130" rx="4" fill="var(--c1)" fill-opacity="0.85"/><text x="260" y="62" fill="var(--text)">4,33</text>
<rect x="280" y="90" width="32" height="110" rx="4" fill="var(--c2)" fill-opacity="0.55"/><text x="296" y="82" fill="var(--text)">3,67</text>
<rect x="384" y="60" width="32" height="140" rx="4" fill="var(--c1)" fill-opacity="0.85"/><text x="400" y="52" fill="var(--text)">4,67</text>
<rect x="420" y="70" width="32" height="130" rx="4" fill="var(--c2)" fill-opacity="0.55"/><text x="436" y="62" fill="var(--text)">4,33</text>
<rect x="470" y="160" width="14" height="14" fill="var(--c1)"/><text x="492" y="171" text-anchor="start" fill="var(--text)">v1</text>
<rect x="470" y="182" width="14" height="14" fill="var(--c2)" fill-opacity="0.55"/><text x="492" y="193" text-anchor="start" fill="var(--text)">v2</text>
</g>
<text x="280" y="20" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">Skor judge (1-5): prompt v1 vs v2 per kriteria</text>
</svg>`;

export const mlops19: V2Lesson = {
  slug: "mlops19-llmops-end-to-end",
  track: "MLOps",
  module: "Serving & Skala",
  title: "MLOps19 — LLMOps End-to-End: Dari Prompt ke Produksi",
  estMinutes: 70,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu kalimat yang menghapus 8% CSAT",
      prose: [
        "April 2026. Asisten CS Koperasi Maju melayani 12.000 nasabah per hari. Jumat sore, tim produk menambahkan SATU kalimat ke system prompt: `Jawablah dengan ramah dan singkat.` — perbaikan kecil, semua orang setuju. Senin pagi, dashboard CSAT turun dari 4,4 ke 4,0. Keluhan baru: `botnya sekarang nggak mau menjelaskan langkah-langkah, cuma jawab singkat doang.`",
        "Tim ML menunjuk modelnya: `mungkin vendor mengubah model di belakang kita.` Mereka benar separuh: vendor memang merilis versi model minor di akhir pekan yang sama. Tapi akar masalahnya lebih dalam. Investigasi menemukan: (1) prompt tidak berversioning — tidak ada yang tahu persis prompt mana yang jalan Jumat vs Senin; (2) tidak ada evaluasi otomatis — tidak ada dataset emas untuk membandingkan v1 vs v2; (3) model tidak di-pin — `gpt-terbaru` di config berarti model yang berbeda tiap deployment. Tiga perubahan terjadi bersamaan, tidak satu pun tercatat, dan tidak ada yang bisa di-rollback.",
        "Twist-nya: model barunya justru LEBIH PINTAR di benchmark publik. Yang rusak bukan kecerdasannya — melainkan OPERASINYA. Prompt adalah kode. Model adalah dependensi. Dan keduanya diperlakukan seperti catatan tempel: tidak berversi, tidak dites, tidak terpantau. Lesson ini tentang LLMOps: disiplin operasional agar satu kalimat tidak pernah lagi menghapus 8% CSAT tanpa ada yang tahu.",
      ],
      tasks: [],
      reference: "Prompt adalah kode; model adalah dependensi — keduanya wajib berversi, dites, dan terpantau.",
    },
    {
      id: "versioning",
      eyebrow: "Langkah 2 · Konsep",
      title: "Versioning: Si Arsiparis yang tidak pernah lupa",
      prose: [
        "Di software biasa, tidak ada yang deploy tanpa git commit. Di LLM, masih banyak yang menempel prompt di dashboard vendor lalu mengklik `save`. Si Arsiparis punya satu aturan: SETIAP yang mempengaruhi output wajib berversi — teks prompt, template, parameter (temperature, top_p), dan ID model yang di-pin (bukan alias `terbaru`).",
        "Paket versi yang sehat = (prompt_hash, model_id, params, eval_score). Prompt di-hash (mis. sha256) sehingga perubahan satu spasi pun terdeteksi. Model di-pin ke ID persis (`model-2026-04-12`, bukan `latest`). Skor evaluasi terakhir dicatat di paket yang sama — jadi rollback berarti `kembalikan paket v1.4.2`, bukan `coba ingat-ingat prompt yang lama`.",
        "Kapan ini paling kritis: prompt yang ditulis BANYAK orang (produk, CS, legal), dan deployment yang sering. Satu kalimat dari tim produk tanpa versioning = eksperimen tak terkontrol di produksi dengan 12.000 nasabah sebagai kelinci percobaan.",
        "💡 Intuisi: kalau kamu tidak bisa menjawab `prompt apa yang jalan di produksi jam 10 pagi tadi?` dalam 30 detik, kamu tidak punya versioning — kamu punya harapan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `prompt kecil tidak perlu versioning`",
        type: "pitfall",
        body: "Cerita Koperasi Maju membuktikan sebaliknya: satu kalimat mengubah CSAT 8%. Prompt kecil = blast radius besar bila menjangkau 12.000 nasabah. Aturannya bukan `prompt besar wajib versi` — melainkan `prompt yang menyentuh produksi wajib versi, tanpa kecuali`. Biaya versioning (satu commit) hampir nol; biaya tanpanya = investigasi buta seperti Senin pagi itu.",
      },
      reference: "Versi = prompt_hash + model_id yang di-pin + params + skor eval. Rollback = kembalikan paket, bukan ingat-ingat.",
    },
    {
      id: "eval-judge",
      eyebrow: "Langkah 3 · Konsep",
      title: "LLM-as-judge: Si Juri yang butuh diawasi",
      prose: [
        "Manusia tidak bisa menilai 10.000 jawaban per hari. Solusinya: LLM lain sebagai juri (LLM-as-judge) menilai output memakai rubrik terstruktur — akurasi, relevansi, keamanan, masing-masing skala 1–5. Si Juri bekerja 24 jam, konsisten, dan murah. Tapi ia punya bias: cenderung suka jawaban PANJANG (verbosity bias), suka jawaban yang mirip gayanya sendiri (self-preference), dan bisa `tertipu` oleh jawaban yang percaya diri tapi salah.",
        "Obatnya tiga lapis. Pertama, DATASET EMAS: 50–200 contoh dengan jawaban referensi dan skor manusia — jangkar kebenaran yang tidak bergerak. Kedua, KALIBRASI: bandingkan skor juri vs skor manusia secara berkala; bila korelasinya turun di bawah ambang (mis. 0,7), juri-nya yang perlu diperbaiki, bukan modelnya. Ketiga, RUBRIK TERTULIS: juri tanpa rubrik = opini; juri dengan rubrik = pengukuran.",
        "Aturan regresi yang dipakai lab: bila skor rata-rata versi baru turun lebih dari 0,2 poin dari versi lama pada dataset emas yang SAMA, itu REGRESI — deployment ditahan. Angka 0,2 bukan hukum alam; ia ambang operasional yang disepakati tim, seperti ambang p-value di eksperimen.",
        "💡 Intuisi: juri LLM itu seperti timbangan digital — cepat dan konsisten, tapi harus dikalibrasi dengan anak timbangan (dataset emas) secara rutin, atau ia menimbang dengan percaya diri ke arah yang salah.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `skor judge naik = model membaik`",
        type: "pitfall",
        body: "Skor judge naik bisa berarti tiga hal: model membaik, juri berubah (model juri di-update vendor), atau jawaban makin panjang (verbosity bias). Tanpa dataset emas yang tetap dan kalibrasi berkala, kamu tidak tahu yang mana. Selalu tanyakan: `apa yang berubah — modelnya, jurinya, atau rubriknya?` sebelum merayakan kenaikan skor.",
      },
      reference: "Judge + rubrik + dataset emas + kalibrasi berkala. Regresi = turun >0,2 poin → tahan deployment.",
    },
    {
      id: "observability",
      eyebrow: "Langkah 4 · Konsep",
      title: "Tracing & observability: Si Pencatat Setiap Langkah",
      prose: [
        "Ketika jawaban LLM salah, pertanyaannya bukan `modelnya bodoh?` melainkan `langkah mana yang gagal?` Si Pencatat merekam tiap request sebagai TRACE: prompt yang dikirim (versi berapa), model yang dipanggil, token masuk/keluar, latensi per langkah, dan — untuk RAG — dokumen apa yang di-retrieve. Tanpa trace, debugging LLM = menebak.",
        "Tiga metrik yang selalu dipantau: (1) LATENSI — p50/p95 per langkah (retrieval? rerank? generation?); (2) BIAYA — token per request × harga; (3) KUALITAS — skor judge berjalan + rate `jawaban ditolak user`. Dashboard yang hanya menampilkan `jumlah request` sama gunanya dengan speedometer yang hanya menampilkan `mobil menyala`.",
        "Pola yang menyelamatkan Koperasi Maju: sampling trace 100% untuk request yang skor judge-nya rendah + 1% untuk sisanya. Investigasi Senin pagi itu butuh 6 jam karena tidak ada trace — dengan trace, jawabannya 10 menit: `lihat, prompt v2 + model minor baru + tanpa eval`.",
        "💡 Intuisi: observability LLM = kotak hitam pesawat. Kamu tidak membutuhkannya 99% waktu — tapi pada 1% waktu saat semuanya terbakar, ia satu-satunya yang tahu apa yang terjadi.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `logging prompt = observability`",
        type: "pitfall",
        body: "Menyimpan teks prompt saja tidak cukup. Observability butuh KORELASI: prompt versi X + model Y + dokumen Z → skor W, dalam SATU trace ID. Log terpisah yang tidak bisa di-join = tumpukan kertas, bukan kotak hitam. Dan hati-hati PII: prompt nasabah berisi data pribadi — trace wajib mask/redact sebelum disimpan (aturan retensi di lesson keamanan).",
      },
      reference: "Trace = prompt versi + model + token + latensi + retrieval, terkorelasi dalam satu ID. Sample 100% yang buruk, 1% sisanya.",
    },
    {
      id: "rag-ops",
      eyebrow: "Langkah 5 · Konsep",
      title: "RAG ops: Si Tukang Kebun yang merawat index",
      prose: [
        "RAG yang jalan hari ini bisa basi bulan depan — bukan karena kodenya berubah, melainkan karena DUNIA berubah: dokumen direvisi, produk berganti harga, regulasi diperbarui. Si Tukang Kebun punya tiga pekerjaan rutin: (1) REFRESH INDEX — dokumen baru masuk, yang kedaluwarsa keluar, dengan versioning (ingat index-v1/v2 dari lesson vector DB); (2) DETEKSI DRIFT — pantau distribusi skor retrieval dan embedding; bila rata-rata similarity top-1 turun terus, index-nya yang menua, bukan query-nya yang aneh; (3) EVAL RETRIEVAL — dataset emas untuk retriever (query → dokumen yang SEHARUSNYA ketemu), terpisah dari eval jawaban.",
        "Jebakan klasik: mengganti model embedding tanpa re-embed seluruh index. Vektor model A tidak bisa dibandingkan dengan model B — hasilnya jawaban ngawur yang terlihat percaya diri. Aturan: ganti model embedding = migrasi database, dengan jadwal, versi ganda, dan rollback.",
        "Satu angka operasional yang wajib ada: `umur index` (kapan terakhir full refresh) tampil di dashboard, berdampingan dengan skor retrieval. Index berumur 90 hari tanpa refresh pada korpus yang berubah harian = jawaban dari masa lalu yang disajikan sebagai masa kini.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: `RAG sekali jalan = selesai selamanya`",
        type: "pitfall",
        body: "RAG adalah SISTEM HIDUP, bukan artefak sekali bangun. Korpus berubah, embedding model di-update vendor, pola query bergeser. Tanpa refresh terjadwal + eval retrieval berkala, kualitasnya meluruh diam-diam — persis seperti model klasik yang concept drift, hanya saja di sini yang drift adalah `pengetahuan`nya. Jadwalkan `musim tanam` index seperti kamu menjadwalkan retraining model.",
      },
      reference: "RAG ops = refresh index terjadwal + deteksi drift retrieval + eval retriever terpisah + umur index di dashboard.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 6 · Konsep",
      title: "Biaya per request: Si Kasir yang jujur",
      prose: [
        "Tagihan LLM tidak seperti server: ia tumbuh per REQUEST, bukan per bulan. Si Kasir menghitung dengan rumus sederhana — biaya per 1.000 request = ((token_masuk + token_keluar) / 1000) × harga_per_1k_token × 1000. Contoh lab: (800 + 400)/1000 × Rp150 × 1000 = Rp180.000 per 1.000 request, alias Rp180 per request.",
        "Tiga tuas penghematan: (1) KURANGI TOKEN — prompt lebih ramping, retrieval top-3 bukan top-10, output dibatasi; (2) CACHE — pertanyaan berulang (FAQ!) tidak perlu dihitung ulang: semantic cache memotong 30–70% tagihan di banyak deployment; (3) ROUTING — model kecil untuk yang mudah, model besar hanya untuk yang sulit (tugas klasifikasi intent: model mini; jawaban akhir: model besar).",
        "Jebakan yang mahal: `max_tokens` default 4096 pada jawaban yang rata-rata 200 token — kamu membayar potensi, bukan pemakaian, di beberapa skema harga. Dan temperature tinggi = jawaban lebih panjang dan variatif = token keluar membengkak tanpa nilai tambah.",
        "💡 Intuisi: setiap request LLM adalah taksi berargo — argo berjalan per token. Arsitektur yang baik = naik taksi hanya bila perlu, berbagi tumpangan (cache), dan pilih mobil yang pas (routing model).",
      ],
      formula: String.raw`C_{1000} = \frac{T_{in} + T_{out}}{1000} \times P`,
      formulaNote: "C_1000 = biaya per 1.000 request (Rp); T_in = token input rata-rata per request (prompt + konteks retrieval); T_out = token output rata-rata per request; P = harga per 1.000 token (Rp). Contoh lab: T_in = 800, T_out = 400, P = Rp150 → C_1000 = (1200/1000) × 150 × 1000 = Rp180.000, alias Rp180/request. Interpretasi: angka ini adalah `harga pokok` tiap jawaban — semua keputusan arsitektur (cache, routing, model kecil) dinilai dari seberapa jauh ia menurunkannya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: `optimasi biaya = pakai model termurah`",
        type: "pitfall",
        body: "Model termurah dengan jawaban ngawur = CSAT turun = biaya yang JAUH lebih mahal (lihat cerita: 8% CSAT dari satu kalimat). Optimasi yang benar = biaya per JAWABAN BENAR, bukan per request. Kadang model yang 2x lebih mahal tapi 3x lebih akurat justru lebih murah per jawaban benar — hitung dengan skor judge, bukan dengan harga katalog.",
      },
      reference: "C_1000 = ((T_in + T_out)/1000) × P × 1000. Tuas: rampingkan token, cache, routing model.",
    },
    {
      id: "lab-judge",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab: jadi juri — deteksi regresi prompt v2",
      prose: [
        "SIMULASI — kamu adalah pipeline evaluasi Koperasi Maju. Data: skor judge (1–5) untuk 3 jawaban pada kriteria [akurasi, relevansi, aman], untuk prompt v1 (lama) dan v2 (satu kalimat ditambah). Tugasmu: hitung skor rata-rata tiap versi, deteksi regresi (turun > 0,2 = REGRESI), dan hitung biaya per 1.000 request dari data token.",
        "Cara membaca output: baris pertama menampilkan rata-rata v1, v2, dan deltanya beserta vonis; baris kedua menampilkan biaya per 1.000 request. Interpretasi: delta −0,44 < −0,2 → deployment v2 DITAHAN — persis keputusan yang seharusnya diambil Senin pagi itu bila pipeline ini ada.",
        "Coba eksplorasi: ubah satu skor v2 (mis. A3 akurasi 2 → 4) — pada titik berapa vonis berubah dari REGRESI menjadi AMAN? (Petunjuk: delta harus ≥ −0,2.) Ubah `t_in` jadi 2000 (konteks retrieval top-10) — berapa biaya barunya? Itulah harga keputusan arsitektur retrieval dalam rupiah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata_v1` dan `rata_v2`: rata-rata SEMUA skor (3 jawaban × 3 kriteria)" },
        { id: "t2", text: "Hitung `delta` (rata_v2 − rata_v1) dan `vonis`: \"REGRESI\" bila delta < −0,2, selain itu \"AMAN\"" },
        { id: "t3", text: "Hitung `biaya_1000`: ((t_in + t_out) / 1000) × harga_1k × 1000, lalu cocokkan output" },
      ],
      expected: "rata_v1=4.33 rata_v2=3.89 delta=-0.44 -> REGRESI\nbiaya_1000=Rp180000",
      hints: [
        "rata = jumlah semua skor / banyaknya skor (9 skor per versi).",
        "delta negatif = versi baru lebih buruk.",
        "biaya_1000 = (1200 / 1000) * 150 * 1000 — cetak dengan int().",
      ],
      code: {
        starter: `# DATA EVAL (jangan ubah): skor judge 1-5 untuk [akurasi, relevansi, aman]
v1 = [[4,5,5],[5,4,5],[3,4,4]]  # prompt versi 1 (lama)
v2 = [[4,4,5],[5,4,4],[2,3,4]]  # prompt versi 2 (satu kalimat ditambah)
t_in = 800     # token input rata-rata per request
t_out = 400    # token output rata-rata per request
harga_1k = 150 # Rp per 1000 token

# TULIS KODEMU
def rata(m):
    return ...

rata_v1 = ...
rata_v2 = ...
delta = ...
vonis = ...

biaya_1000 = ...

# CETAK (jangan ubah formatnya)
print(f"rata_v1={rata_v1:.2f} rata_v2={rata_v2:.2f} delta={delta:.2f} -> {vonis}")
print(f"biaya_1000=Rp{int(biaya_1000)}")`,
        lockLines: 8,
        solution: `# DATA EVAL (jangan ubah): skor judge 1-5 untuk [akurasi, relevansi, aman]
v1 = [[4,5,5],[5,4,5],[3,4,4]]  # prompt versi 1 (lama)
v2 = [[4,4,5],[5,4,4],[2,3,4]]  # prompt versi 2 (satu kalimat ditambah)
t_in = 800     # token input rata-rata per request
t_out = 400    # token output rata-rata per request
harga_1k = 150 # Rp per 1000 token

# TULIS KODEMU
def rata(m):
    return sum(sum(r) for r in m) / sum(len(r) for r in m)

rata_v1 = rata(v1)
rata_v2 = rata(v2)
delta = rata_v2 - rata_v1
vonis = "REGRESI" if delta < -0.2 else "AMAN"

biaya_1000 = (t_in + t_out) / 1000 * harga_1k * 1000

# CETAK (jangan ubah formatnya)
print(f"rata_v1={rata_v1:.2f} rata_v2={rata_v2:.2f} delta={delta:.2f} -> {vonis}")
print(f"biaya_1000=Rp{int(biaya_1000)}")`,
        checks: [
          { kind: "equal", task: "t1", label: "rata-rata v1", name: "rata_v1", value: 4.3333, tol: 0.005, msg: "rata_v1 = 39/9 = 4,3333." },
          { kind: "equal", task: "t1", label: "rata-rata v2", name: "rata_v2", value: 3.8889, tol: 0.005, msg: "rata_v2 = 35/9 = 3,8889." },
          { kind: "equal", task: "t2", label: "vonis regresi", name: "vonis", value: "REGRESI", msg: "delta = −0,4444 < −0,2 → REGRESI." },
          { kind: "equal", task: "t3", label: "biaya per 1000", name: "biaya_1000", value: 180000, msg: "biaya_1000 = (1200/1000) × 150 × 1000 = 180.000." },
          { kind: "stdout_matches", task: "t2", label: "vonis di stdout", msg: "Cetak baris dengan -> REGRESI.", pattern: "-> REGRESI" },
          { kind: "stdout_matches", task: "t3", label: "biaya di stdout", msg: "Cetak biaya_1000=Rp180000.", pattern: "biaya_1000=Rp180000" },
        ],
      },
      reference: "Eval = rata-rata skor judge per versi; regresi bila delta < −0,2. Biaya_1000 = Rp180.000 (Rp180/request).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: seberapa berat operasi LLM-mu?",
      prose: [
        "SKENARIO 1 — Chatbot internal 50 user/hari, prompt jarang berubah. KEPUTUSAN: RINGAN. Versioning prompt di git + eval manual 20 contoh tiap ganti prompt. Tidak perlu judge otomatis. Alasannya: blast radius kecil, biaya operasi harus proporsional — pipeline eval otomatis lebih mahal dari masalahnya.",
        "SKENARIO 2 — Asisten CS 10.000+ nasabah/hari seperti Koperasi Maju. KEPUTUSAN: PENUH. Versioning + dataset emas + judge otomatis tiap deployment + tracing + dashboard biaya. Alasannya: satu kalimat = 8% CSAT; biaya pipeline (satu engineer + infra eval) jauh lebih kecil dari biaya insiden.",
        "SKENARIO 3 — RAG atas korpus yang berubah harian (regulasi, harga, katalog). KEPUTUSAN: RAG OPS KETAT. Refresh index terjadwal + eval retriever terpisah + umur index di dashboard. Alasannya: jawaban basi = jawaban salah yang percaya diri; tanpa eval retriever kamu tidak tahu kapan index-mu menua.",
        "SKENARIO 4 — Tagihan LLM > 15% biaya infra. KEPUTUSAN: OPTIMASI BIAYA DULU. Audit token per request, pasang semantic cache untuk FAQ, routing model kecil/besar. Alasannya: arsitektur boros yang di-scale = tagihan yang di-scale. Jangan tambah fitur sebelum argo taksi dijinakkan.",
        "SKENARIO 5 — Jawaban LLM masuk keputusan berisiko (kesehatan, keuangan, hukum). KEPUTUSAN: HUMAN-IN-THE-LOOP + eval ketat. Judge otomatis tidak cukup; sampling manusia wajib + disclaimer + batasan topik. Alasannya: skor judge 4,5 tidak sama dengan `aman secara hukum` — risiko model ≠ risiko bisnis.",
        "ATURAN PRAKTIS 10 DETIK: (1) Bisa jawab `prompt apa yang jalan tadi pagi` dalam 30 detik? Tidak → versioning dulu. (2) Ada dataset emas? Tidak → buat 50 contoh sebelum deployment berikutnya. (3) Tahu biaya per 1.000 request? Tidak → hitung dengan rumus Si Kasir hari ini. (4) Index RAG berumur >30 hari tanpa eval? Refresh + eval minggu ini.",
      ],
      tasks: [
      ],
      reference: "Berat operasi ∝ blast radius × frekuensi perubahan × risiko jawaban. Mulai dari versioning + dataset emas.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: WarungAI dan prompt yang `diperbaiki` marketing",
      prose: [
        "WarungAI, chatbot katalog UMKM dengan 50.000 request/hari. Data insiden: (a) tim marketing mengubah prompt Jumat malam (`tambahkan emoji agar fun`) tanpa versioning; (b) tidak ada dataset emas — QA hanya `coba 5 pertanyaan` manual; (c) model memakai alias `terbaru`; (d) tagihan naik 40% bulan ini (rata-rata token keluar naik dari 400 ke 700 — emoji + basa-basi); (e) keluhan `jawaban ngawur` naik 3x, tapi tidak ada trace yang bisa di-join ke versi prompt.",
        "Pertanyaan 1 — Diagnosis: dari 5 data di atas, apa TIGA akar masalah WarungAI menurut kerangka 5 langkah lesson ini? Pertanyaan 2 — Hitungan: dengan 50.000 request/hari, token masuk 800, token keluar naik 400 → 700, harga Rp150/1k token — berapa kenaikan biaya per BULAN? Pertanyaan 3 — Rekomendasi: sebagai konsultan, apa 3 langkah 30 hari untuk WarungAI? (Petunjuk: pikirkan versioning, dataset emas, dan biaya — bukan `ganti model`.)",
        "Pembahasan — P1: (i) Tanpa versioning (a) + tanpa dataset emas (b) = perubahan tak terukur; (ii) model tidak di-pin (c) = dependensi bergerak; (iii) tanpa tracing terkorelasi (e) = investigasi buta; biaya (d) adalah gejala, bukan akar. P2: biaya/request lama = 1200/1000 × 150 = Rp180; baru = 1500/1000 × 150 = Rp225; selisih Rp45 × 50.000 × 30 = Rp67.500.000/bulan. Satu emoji = Rp67,5 jt/bulan. P3 (contoh jawaban baik): (1) Bekukan perubahan prompt; catat SEMUA prompt aktif ke git + pin model ID minggu ini. (2) Bangun dataset emas 50 contoh + pipeline judge otomatis; ambang regresi −0,2. (3) Audit token: batasi max_tokens, pasang semantic cache untuk FAQ — target turunkan token keluar kembali ke ~400.",
      ],
      tasks: [
        { id: "t1", text: "Tulis diagnosis 3 akar masalah WarungAI (kaitkan ke data a–e)" },
        { id: "t2", text: "Hitung kenaikan biaya per bulan akibat token keluar 400 → 700" },
        { id: "t3", text: "Susun rencana 30 hari (3 langkah) untuk WarungAI" },
      ],
      expected: "P1: tanpa versioning + tanpa dataset emas + model tak di-pin + tanpa tracing terkorelasi. P2: Rp180 → Rp225/request = +Rp67,5 jt/bln. P3: bekukan + versioning & pin model → dataset emas + judge otomatis → audit token + cache.",
      note: {
        title: "🚨 Mitos: `solusinya ganti model yang lebih pintar`",
        type: "pitfall",
        body: "WarungAI tidak punya masalah kecerdasan — ia punya masalah OPERASI. Model yang lebih pintar tanpa versioning = cara yang lebih mahal untuk mengulangi insiden yang sama. Urutannya selalu: operasi dulu (versi, eval, trace, biaya), model belakangan. Model terbaik di dunia tidak menyelamatkan deployment yang buta.",
      },
      reference: "Diagnosis (versi/eval/trace) → hitung (biaya) → resep (bekukan, emas, audit token).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [
      ],
      quiz: [
        {
          q: "Apa isi paket versioning prompt yang SEHAT?",
          options: [
            { text: "Teks prompt saja, disimpan di dashboard vendor", why: "Tidak cukup: tanpa hash, model_id yang di-pin, dan params, kamu tidak bisa mendeteksi perubahan atau rollback dengan presisi." },
            { text: "Hash prompt + ID model yang di-pin + parameter + skor evaluasi terakhir", why: "Tepat. Empat komponen Si Arsiparis: hash mendeteksi perubahan satu spasi, model_id yang di-pin menghentikan dependensi bergerak, params mencatat temperature/top_p, skor eval mencatat kualitas paket itu.", correct: true },
            { text: "Screenshot prompt sebelum diubah, disimpan di grup chat", why: "Itu arsip yang tidak bisa di-query, tidak bisa di-diff, dan tidak bisa di-rollback otomatis. Arsiparis butuh format mesin, bukan screenshot." },
            { text: "Nomor versi manual seperti `vFinal`, `vFinal2`, `vFinalBeneran`", why: "Penamaan manual tidak terverifikasi mesin dan pasti kacau. Hash + metadata terstruktur menggantikan tebakan manusia." },
          ],
        },
        {
          q: "Dari lab Langkah 7: rata_v1 = 4,33, rata_v2 = 3,89. Vonis yang benar dan alasannya?",
          options: [
            { text: "AMAN, karena selisihnya kecil (di bawah 1 poin)", why: "Ambang operasionalnya 0,2 — bukan 1,0. Delta −0,44 jauh melewati ambang. `Kecil` menurut perasaan ≠ kecil menurut kontrak." },
            { text: "REGRESI, karena delta −0,44 < −0,2 pada dataset emas yang sama", why: "Tepat. Aturan yang disepakati: turun lebih dari 0,2 poin = tahan deployment. Dataset emas yang sama memastikan perbandingannya adil.", correct: true },
            { text: "AMAN, karena v2 hanya menambah satu kalimat", why: "Cerita Koperasi Maju: satu kalimat menghapus 8% CSAT. Ukuran perubahan teks tidak memprediksi ukuran dampaknya." },
            { text: "REGRESI, karena skor di bawah 4,0", why: "Vonis regresi membandingkan v2 TERHADAP v1 (delta), bukan terhadap angka absolut 4,0. v2 = 3,5 dengan v1 = 3,4 adalah perbaikan, bukan regresi." },
          ],
        },
        {
          q: "Kelemahan utama LLM-as-judge yang HARUS dikompensasi?",
          options: [
            { text: "Juri LLM terlalu lambat untuk evaluasi harian", why: "Sebaliknya: juri LLM justru cepat dan murah — itu alasan ia dipakai. Masalahnya bukan kecepatan." },
            { text: "Bias verbosity, self-preference, dan butuh kalibrasi berkala terhadap dataset emas", why: "Tepat. Tiga kompensasinya: rubrik tertulis (lawan verbosity), dataset emas tetap (jangkar), kalibrasi berkala (deteksi juri yang melenceng).", correct: true },
            { text: "Juri LLM tidak bisa menilai bahasa Indonesia", why: "Model modern menilai banyak bahasa dengan baik. Keterbatasan bahasa bukan kelemahan strukturalnya." },
            { text: "Skor judge tidak bisa disimpan di database", why: "Skor adalah angka biasa — bisa disimpan di mana saja. Ini bukan keterbatasan teknis." },
          ],
        },
        {
          q: "Kapan `umur index` RAG menjadi metrik kritis?",
          options: [
            { text: "Selalu — setiap RAG wajib refresh tiap jam", why: "Berlebihan untuk korpus statis (mis. arsip regulasi 2020). Frekuensi refresh mengikuti frekuensi perubahan korpus." },
            { text: "Saat korpus berubah rutin (harian/mingguan): index basi = jawaban salah yang percaya diri", why: "Tepat. Aturan Si Tukang Kebun: tampilkan umur index di dashboard berdampingan dengan skor retrieval; tanpa eval retriever berkala kamu tidak tahu kapan ia menua.", correct: true },
            { text: "Hanya saat mengganti vendor vector database", why: "Itu migrasi infrastruktur, bukan umur index. Umur index soal kesegaran ISI, bukan wadahnya." },
            { text: "Tidak pernah — embedding tidak bisa basi", why: "Salah total: dokumen direvisi, harga berubah, regulasi diperbarui — vektor lama mewakili dunia lama." },
          ],
        },
        {
          q: "Dari rumus Si Kasir: T_in = 800, T_out = 400, P = Rp150. Biaya per 1.000 request?",
          options: [
            { text: "Rp120.000", why: "Itu (800/1000) × 150 × 1000 — kamu lupa menjumlahkan token keluar. Selalu T_in + T_out." },
            { text: "Rp180.000 (Rp180 per request)", why: "Tepat. (800 + 400)/1000 × 150 × 1000 = 1,2 × 150.000 = Rp180.000. Inilah harga pokok tiap jawaban di lab.", correct: true },
            { text: "Rp150.000", why: "Itu harga per 1.000 token, bukan per 1.000 request. Jangan tertukar satuannya." },
            { text: "Rp1.800.000", why: "Kelebihan satu nol — cek lagi: 1,2 × Rp150 = Rp180 per request, × 1000 = Rp180.000." },
          ],
        },
        {
          q: "WarungAI (mini-case): langkah 30 hari yang PALING tepat didahulukan?",
          options: [
            { text: "Ganti ke model yang lebih besar dan pintar", why: "Itu mitos yang dibantah lesson ini: masalahnya operasi, bukan kecerdasan. Model baru tanpa versioning = insiden yang sama dengan harga lebih mahal." },
            { text: "Bekukan perubahan prompt, catat semua prompt ke git, pin model ID, lalu bangun dataset emas", why: "Tepat. Urutan P3: hentikan pendarahan (beku + versi + pin) → pasang pengukuran (dataset emas + judge) → optimasi (audit token + cache). Operasi dulu, model belakangan.", correct: true },
            { text: "Tambah emoji lebih banyak agar CSAT naik kembali", why: "Emoji adalah PENYEBAB insiden (token keluar 400 → 700, +Rp67,5 jt/bln). Menambah penyebab bukan solusi." },
            { text: "Hapus chatbot dan kembali ke CS manusia sepenuhnya", why: "Reaksi berlebihan: masalahnya terdiagnosis dan solusinya murah (versioning + eval). Membuang sistem yang 95% benar karena 5% buta operasi = membuang bayi bersama air mandinya." },
          ],
        },
      ],
      summary: [
        "Prompt adalah kode, model adalah dependensi: versioning = hash prompt + model_id yang di-pin + params + skor eval.",
        "LLM-as-judge butuh rubrik tertulis + dataset emas + kalibrasi berkala; regresi = turun > 0,2 poin → tahan deployment.",
        "Observability = trace terkorelasi (prompt versi + model + token + latensi + retrieval) dalam satu ID; sample 100% yang buruk.",
        "RAG ops = refresh index terjadwal + deteksi drift retrieval + eval retriever terpisah; umur index tampil di dashboard.",
        "Biaya: C_1000 = ((T_in + T_out)/1000) × P × 1000; tuas = rampingkan token, semantic cache, routing model kecil/besar.",
        "Lab: v1 = 4,33 vs v2 = 3,89 (delta −0,44 → REGRESI); biaya Rp180.000/1.000 request.",
      ],
      next: { label: "MLOps20 — Managed Cloud ML", href: "/learn/mlops20-cloud-ml-platforms" },
    },
  ],
};
