import type { V2Lesson } from "../lib/types";

// Tiga lapis verifikasi query AI: grain → batas → distribusi. Checklist inspektur.
const VERIFY_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Tiga lapis verifikasi query buatan AI.">
<g font-family="var(--font-ui)" font-size="11" text-anchor="middle">
<rect x="40" y="40" width="140" height="70" rx="8" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)" stroke-width="2"/>
<text x="110" y="66" fill="var(--text)" font-size="12">1 · Grain</text>
<text x="110" y="86" fill="var(--chart-text)" font-size="10">baris sebelum vs</text>
<text x="110" y="100" fill="var(--chart-text)" font-size="10">sesudah join</text>
<rect x="210" y="40" width="140" height="70" rx="8" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)" stroke-width="2"/>
<text x="280" y="66" fill="var(--text)" font-size="12">2 · Batas</text>
<text x="280" y="86" fill="var(--chart-text)" font-size="10">uji di sampel kecil</text>
<text x="280" y="100" fill="var(--chart-text)" font-size="10">dengan jawaban pasti</text>
<rect x="380" y="40" width="140" height="70" rx="8" fill="var(--c1)" fill-opacity="0.2" stroke="var(--c1)" stroke-width="2"/>
<text x="450" y="66" fill="var(--text)" font-size="12">3 · Distribusi</text>
<text x="450" y="86" fill="var(--chart-text)" font-size="10">total vs sumber;</text>
<text x="450" y="100" fill="var(--chart-text)" font-size="10">masuk akal?</text>
<line x1="180" y1="75" x2="210" y2="75" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="350" y1="75" x2="380" y2="75" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="140" y="150" width="280" height="60" rx="8" fill="var(--c3)" fill-opacity="0.15" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="280" y="175" fill="var(--text)" font-size="12">0 · Kredensial &amp; PII</text>
<text x="280" y="195" fill="var(--chart-text)" font-size="10">redact dulu, tempel kemudian — lapis nol sebelum lapis satu</text>
</g>
<text x="280" y="235" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">query AI = draf magang: inspeksi tiga lapis sebelum merge</text>
</svg>`;

export const de30: V2Lesson = {
  slug: "de30-ai-coding-tools",
  track: "Data Engineer",
  module: "Platform Data",
  title: "DE30 — AI Coding Tools untuk Data Engineer",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query yang lolos review",
      prose: [
        "Februari 2026. Tim data SinarPay memakai asisten AI untuk mempercepat penulisan query. Untuk dashboard revenue bulanan, AI menghasilkan query 40 baris yang indah: CTE rapi, window function tepat, formatting sempurna. Dua engineer me-review — 'bersih, lolos'. Dashboard naik ke produksi.",
        "Tiga minggu kemudian, finance bertanya kenapa revenue dashboard 3,2x lipat dari laporan bank. Audit menemukan DUA bug makna di query yang 'sempurna' itu. Bug 1 — fan-out join: query men-join `orders` ke `order_items` (satu order punya banyak item) lalu men-SUM kolom amount dari sisi order — setiap order terhitung sebanyak jumlah itemnya. Bug 2 — filter tanggal: `WHERE utc_ts >= '2026-01-01'` pada kolom UTC, padahal hari bisnis = Asia/Jakarta — order 31 Des 18:00 UTC (1 Jan 01:00 WIB) terbuang.",
        "Twist-nya: tidak ada yang salah dengan SINTAKS query itu. Ia jalan tanpa error, hasilnya berupa angka yang masuk akal, dan dua reviewer manusia terkecoh oleh kerapian. SQL tidak punya 'compiler error' untuk bug makna — query salah makna tetap jalan dan tetap menghasilkan angka. AI menulis draf yang meyakinkan; yang tidak ia miliki adalah pengetahuan tentang grain datamu dan definisi hari bisnismu. Lesson ini tentang memakai AI sebagai asisten magang yang cepat — dengan inspeksi tiga lapis sebelum merge.",
      ],
      tasks: [],
      reference: "Query AI = draf magang yang meyakinkan. Sintaks benar ≠ makna benar. Inspeksi wajib.",
    },
    {
      id: "asisten-magang",
      eyebrow: "Langkah 2 · Konsep",
      title: "Si Asisten Magang: kuat di boilerplate, buta konteks",
      prose: [
        "Asisten AI (Copilot, ChatGPT, Claude, dan sejenisnya) adalah magang yang mengetik 1000 baris per menit, tidak pernah lelah, dan tidak tahu apa-apa tentang BISNISMU. Ia luar biasa untuk tiga hal: BOILERPLATE (kerangka DAG Airflow, CTE skeleton, skrip migrasi), POLA UMUM (regex, parsing tanggal, pivot), dan EKSPLORASI CEPAT ('tuliskan 3 cara menghitung retensi').",
        "Ia berbahaya untuk tiga hal lain: LOGIKA BISNIS (definisi 'active', 'revenue' — ia menebak), GRAIN DATA (satu-ke-banyak yang tidak terlihat dari nama kolom), dan KONTEKS IMPLISIT (zona waktu bisnis, kalender promo, aturan regulator). Ketiganya adalah sumber 90% bug makna — dan ketiganya tidak ada di prompt kecuali kamu menuliskannya.",
        "Aturan pakainya: AI menulis DRAF, manusia menulis KEPUTUSAN. Prompt yang baik menyertakan grain ('satu baris = satu order, order_items one-to-many'), zona waktu bisnis, dan contoh input-output kecil. Prompt yang buruk: 'buatkan query revenue bulan lalu' — itu undangan untuk ditebak.",
        "💡 Intuisi: perlakukan output AI seperti kode dari magang minggu pertama yang sangat percaya diri — cepat, rapi, dan WAJIB di-review baris per baris pada bagian yang menyentuh uang atau keputusan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: query yang jalan = query yang benar",
        type: "pitfall",
        body: "SQL hanya punya dua status: error atau jalan. Tidak ada 'jalan tapi salah makna' sebagai status — padahal itulah bug paling mahal (fan-out join, filter zona waktu, double counting). Compiler tidak melindungimu dari bug makna; hanya inspeksi yang melakukannya. 'Tidak error' adalah klaim terkecil yang bisa dibuat tentang sebuah query.",
      },
      reference: "AI untuk boilerplate & pola umum. Logika bisnis, grain, dan konteks = wilayah manusia.",
    },
    {
      id: "verifikasi-tiga-lapis",
      eyebrow: "Langkah 3 · Konsep",
      title: "Verifikasi tiga lapis: Si Inspektur",
      prose: [
        "Setiap query AI yang menyentuh angka bisnis WAJIB melewati tiga lapis inspeksi. Lapis 1 — GRAIN: bandingkan jumlah baris sebelum vs sesudah join. Bila 5 order menjadi 8 baris setelah join ke order_items, SUM atas kolom sisi-order SUDAH pasti mengganda. Aturannya: agregasi HANYA setelah grain dipastikan satu-baris-per-entitas (deduplikasi atau agregasi dulu di sisi many, baru join).",
        "Lapis 2 — BATAS (boundary test): jalankan query pada SAMPEL KECIL yang jawabannya kamu hitung manual. 5 order dengan angka yang kamu tahu = Rp1.000. Bila query menjawab Rp1.400, bug-nya pasti — dan kamu menemukannya dalam 10 detik, bukan 3 minggu. AI tidak pernah keberatan diuji; yang keberatan biasanya ego kita.",
        "Lapis 3 — DISTRIBUSI: bandingkan total dengan sumber kebenaran independen (laporan bank, dashboard lama, angka kemarin). Selisih 3,2x = alarm; selisih 2% = wajar (definisi bisa sedikit beda). Lapis ini menangkap bug yang lolos dua lapis pertama — seperti filter zona waktu yang 'hanya' menggeser 1 hari di batas bulan.",
        "Cara membaca diagram: tiga kotak berurutan (grain → batas → distribusi) plus kotak lapis NOL di bawah — keamanan kredensial & PII yang harus beres SEBELUM query ditempel ke AI. Inspeksi = merge checklist, bukan ritual.",
        "Interpretasi: ketiga lapis ini murah (menit) dibanding biaya bug makna (minggu + kepercayaan). Jadikan mereka definisi 'selesai' untuk setiap query AI — seperti test untuk kode.",
      ],
      figure: {
        svg: VERIFY_SVG,
        alt: "Tiga lapis verifikasi query buatan AI: grain, batas, distribusi, plus lapis nol keamanan.",
        caption: "Inspeksi tiga lapis: grain (baris sebelum vs sesudah join), batas (sampel kecil jawaban pasti), distribusi (total vs sumber independen) — didahului lapis nol: redact kredensial & PII.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: 'AI sudah dilatih di jutaan query, pasti tahu pola yang benar'",
        type: "pitfall",
        body: "AI tahu pola UMUM (cara join yang idiomatis), tetapi tidak tahu FAKTA SPESIFIK datamu: bahwa order_items one-to-many terhadap orders di SISTEMMU, bahwa hari bisnis = WIB, bahwa 'cancelled' tidak boleh dihitung. Pola umum + fakta spesifik yang salah = query yang terlihat ahli dan salah total. Fakta spesifik harus datang darimu — di prompt atau di inspeksi.",
      },
      reference: "Grain → batas → distribusi. Query AI belum 'selesai' sebelum tiga lapis hijau.",
    },
    {
      id: "keamanan",
      eyebrow: "Langkah 4 · Konsep",
      title: "Kredensial & PII: Si Mulut Ember",
      prose: [
        "Asisten AI adalah Si Mulut Ember: apa yang kamu tempel bisa tersimpan, dilatihkan ulang, atau bocor lewat prompt injection. Tiga hal yang TIDAK BOLEH ditempel ke tool AI publik: kredensial (password, API key, connection string — pakai placeholder seperti `DB_PASS=***`), DATA PRIBADI (nama, NIK, nomor HP di sample data — anonimkan dulu), dan SKEMA SENSITIF lengkap bila perusahaannya melarang (cek kebijakan).",
        "Pola redaksi yang praktis: (1) Ganti nilai sensitif dengan token (`'Budi Santoso'` → `'NAMA_1'`, `'0812...'` → `'HP_1'`) TETAPI pertahankan BENTUK datanya (AI butuh tahu itu string nama, bukan integer). (2) Potong sampel: 5 baris cukup untuk pola; 10.000 baris tidak menambah kecerdasan AI. (3) Untuk tool enterprise (dengan DPA): tetap redact yang paling sensitif — 'enterprise' mengurangi risiko, bukan menghilangkannya.",
        "Rumus keputusannya: risiko = (sensitivitas data) × (ketidakpastian penyimpanan). Bila salah satunya tinggi, redact. Bila keduanya tinggi (data nasabah + tool publik gratis), JANGAN tempel sama sekali — tulis ulang masalahnya sebagai contoh sintetis.",
      ],
      formula: String.raw`\text{risiko} = \text{sensitivitas} \times \text{ketidakpastian}`,
      formulaNote: "risiko = tingkat bahaya menempel data ke AI; sensitivitas = seberapa rahasia datanya (PII/kredensial = tinggi); ketidakpastian = seberapa tidak jelas data disimpan/dilatihkan ulang (tool publik gratis = tinggi). Contoh: sample NIK ke tool gratis = tinggi × tinggi = JANGAN. Skema tanpa data ke tool enterprise = rendah × rendah = boleh.",
      tasks: [],
      note: {
        title: "🚨 Mitos: 'kan cuma 5 baris sample, tidak apa-apa'",
        type: "pitfall",
        body: "Lima baris dengan NIK + nama + nomor HP asli = lima korban kebocoran data. Ukuran sampel tidak mengurangi sensitivitas per baris. Anonimkan DULU (tokenisasi konsisten agar join tetap bisa dites), tempel KEMUDIAN. Kebiasaan ini murah; insiden PDP mahal.",
      },
      reference: "Redact dulu, tempel kemudian. Pertahankan bentuk data, buang isinya.",
    },
    {
      id: "pola-review",
      eyebrow: "Langkah 5 · Konsep",
      title: "Pola review: dari draf ke merge",
      prose: [
        "Workflow yang waras untuk query AI di tim data: (1) DRAF — AI menghasilkan query dari prompt yang menyertakan grain + zona waktu + contoh kecil. (2) INSPEKSI — tiga lapis (grain, batas, distribusi) oleh manusia, bukan AI yang sama ('tolong cek query-mu sendiri' = meminta magang menilai dirinya). (3) JEJAK — query final masuk version control dengan komentar ASAL ('draf: AI, diperbaiki: fan-out join') agar 6 bulan kemudian orang tahu kenapa baris itu ada.",
        "Dua anti-pola yang umum. 'AI review AI': meminta model yang sama memverifikasi outputnya — ia mengulang asumsi yang sama dan mengiyakan dirinya sendiri. 'Review kerapian': me-review formatting, bukan makna — query SinarPay lolos DUA reviewer manusia karena terlihat rapi. Review yang benar membaca query sebagai KLAIM tentang data ('query ini mengklaim satu baris = satu order') lalu menguji klaim itu.",
        "Untuk DAG/pipeline: aturan tambahan — JANGAN biarkan AI menulis kredensial, retry policy, atau alerting tanpa kamu yang menentukan angkanya. AI tidak tahu berapa biaya retry ke-5 di workload-mu; ia menebak angka yang terlihat wajar.",
        "💡 Intuisi: dalam code review, query AI mendapat label otomatis `needs-human-verification` — seperti PR dari kontributor baru yang belum punya track record. Kepercayaan dibangun per query yang lolos inspeksi, bukan per tool yang dipakai.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: semakin detail prompt, semakin tidak perlu review",
        type: "pitfall",
        body: "Prompt detail MENGURANGI bug, tidak MENGHILANGKAN kebutuhan verifikasi. Alasannya matematis: bila AI benar 95% per query dan kamu menjalankan 20 query AI per minggu, peluang ≥1 bug per minggu = 64%. Review bukan ketidakpercayaan pada AI — melainkan aritmetika.",
      },
      reference: "Draf (AI) → inspeksi 3 lapis (manusia) → jejak (version control). Review makna, bukan kerapian.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: audit query 'AI'",
      prose: [
        "Waktunya menjadi inspektur. Lab ini mensimulasikan output query buatan AI atas dataset kecil: 5 order (dengan timestamp UTC + tanggal bisnis WIB) dan hasil join ke `order_items`. Query AI mengklaim revenue = Rp1.400 dan memfilter 'bulan Januari' via kolom UTC.",
        "Tugasmu: (1) hitung revenue versi AI (SUM dari baris hasil join = fan-out) vs revenue benar (SUM distinct order); (2) hitung faktor inflasinya; (3) terapkan filter AI (`utc >= '2026-01-01'`) vs filter benar (`biz >= '2026-01-01'`) dan temukan order yang hilang.",
        "Cara membaca output: dua baris pertama = bug fan-out (1400 vs 1000); baris ketiga = besarnya (1,4x); baris keempat = bug zona waktu (o1 hilang — Rp100 tidak tercatat).",
        "Interpretasi: kedua bug ini LOLOS dari 'query jalan tanpa error'. Hanya inspeksi (grain + batas) yang menangkapnya — persis seperti di cerita SinarPay, tetapi di sini kamu menemukannya dalam 2 menit, bukan 3 minggu.",
      ],
      formula: String.raw`F = \frac{\sum_{join} a_i}{\sum_{distinct} a_j}`,
      formulaNote: "F = faktor inflasi fan-out; pembilang = SUM amount dari baris HASIL JOIN (tiap order terhitung per item); penyebut = SUM amount DISTINCT per order. Contoh lab: 1400 / 1000 = 1,4 — setiap rupiah terhitung 1,4 kali. F = 1,0 = grain benar.",
      tasks: [
        { id: "t1", text: "Lengkapi `revenue_ai` (SUM dari baris join) dan `revenue_benar` (SUM distinct order)" },
        { id: "t2", text: "Lengkapi `faktor_inflasi` = revenue_ai / revenue_benar" },
        { id: "t3", text: "Lengkapi `order_hilang` — id order yang lolos filter benar tapi gagal filter AI" },
      ],
      expected: "revenue AI (fan-out): 1400.0\nrevenue benar: 1000.0\nfaktor inflasi: 1.4x\nfilter AI melewatkan: ['o1'] (rugi Rp100.0 tercatat)",
      note: {
        title: "Sering salah",
        body: "Menghitung revenue_benar sebagai SUM(joined) / jumlah_item_rata_rata — 'koreksi' yang mengasumsikan fan-out seragam. Fan-out TIDAK seragam (o1 punya 2 item, o3 punya 3). Satu-satunya cara yang benar: agregasi di grain yang tepat (distinct order_id) SEBELUM join, bukan koreksi setelahnya.",
      },
      hints: [
        "revenue_ai: sum(a for _, a in joined).",
        "revenue_benar: sum(o['amount'] for o in orders).",
        "faktor_inflasi: revenue_ai / revenue_benar.",
        "order_hilang: [o['id'] for o in orders if o['biz'] >= '2026-01-01' and not (o['utc'] >= '2026-01-01')].",
      ],
      code: {
        starter: `# Dataset kecil dengan jawaban yang bisa dihitung manual\n` +
`orders = [\n` +
`    {"id": "o1", "amount": 100.0, "utc": "2025-12-31 18:00:00", "biz": "2026-01-01"},\n` +
`    {"id": "o2", "amount": 200.0, "utc": "2026-01-02 10:00:00", "biz": "2026-01-02"},\n` +
`    {"id": "o3", "amount": 150.0, "utc": "2025-12-30 20:00:00", "biz": "2025-12-31"},\n` +
`    {"id": "o4", "amount": 300.0, "utc": "2026-01-05 08:00:00", "biz": "2026-01-05"},\n` +
`    {"id": "o5", "amount": 250.0, "utc": "2026-01-01 02:00:00", "biz": "2026-01-01"},\n` +
`]\n` +
`# Hasil join orders -> order_items VERSI QUERY AI (fan-out: amount ikut terganda)\n` +
`joined = [\n` +
`    ("o1", 100.0), ("o1", 100.0), ("o2", 200.0), ("o3", 150.0),\n` +
`    ("o3", 150.0), ("o3", 150.0), ("o4", 300.0), ("o5", 250.0),\n` +
`]\n` +
`\n` +
`# TUGAS 1: dua versi revenue\n` +
`def revenue_ai():\n` +
`    return\n` +
`\n` +
`def revenue_benar():\n` +
`    return\n` +
`\n` +
`# TUGAS 2: seberapa besar penggandaannya?\n` +
`def faktor_inflasi():\n` +
`    return\n` +
`\n` +
`# TUGAS 3: filter AI (kolom UTC) vs filter benar (tanggal bisnis WIB)\n` +
`def order_hilang():\n` +
`    return []\n` +
`\n` +
`ra = revenue_ai()\n` +
`rb = revenue_benar()\n` +
`fi = faktor_inflasi()\n` +
`hilang = order_hilang()\n` +
`rugi = sum(o["amount"] for o in orders if o["id"] in hilang)\n` +
`print(f"revenue AI (fan-out): {ra}")\n` +
`print(f"revenue benar: {rb}")\n` +
`print(f"faktor inflasi: {fi}x")\n` +
`print(f"filter AI melewatkan: {hilang} (rugi Rp{rugi} tercatat)")\n`,
        lockLines: 12,
        solution: `# Dataset kecil dengan jawaban yang bisa dihitung manual\norders = [\n    {"id": "o1", "amount": 100.0, "utc": "2025-12-31 18:00:00", "biz": "2026-01-01"},\n    {"id": "o2", "amount": 200.0, "utc": "2026-01-02 10:00:00", "biz": "2026-01-02"},\n    {"id": "o3", "amount": 150.0, "utc": "2025-12-30 20:00:00", "biz": "2025-12-31"},\n    {"id": "o4", "amount": 300.0, "utc": "2026-01-05 08:00:00", "biz": "2026-01-05"},\n    {"id": "o5", "amount": 250.0, "utc": "2026-01-01 02:00:00", "biz": "2026-01-01"},\n]\n# Hasil join orders -> order_items VERSI QUERY AI (fan-out: amount ikut terganda)\njoined = [\n    ("o1", 100.0), ("o1", 100.0), ("o2", 200.0), ("o3", 150.0),\n    ("o3", 150.0), ("o3", 150.0), ("o4", 300.0), ("o5", 250.0),\n]\n\n# TUGAS 1: dua versi revenue\ndef revenue_ai():\n    return sum(a for _, a in joined)\n\ndef revenue_benar():\n    return sum(o["amount"] for o in orders)\n\n# TUGAS 2: seberapa besar penggandaannya?\ndef faktor_inflasi():\n    return revenue_ai() / revenue_benar()\n\n# TUGAS 3: filter AI (kolom UTC) vs filter benar (tanggal bisnis WIB)\ndef order_hilang():\n    return [o["id"] for o in orders if o["biz"] >= "2026-01-01" and not (o["utc"] >= "2026-01-01")]\n\nra = revenue_ai()\nrb = revenue_benar()\nfi = faktor_inflasi()\nhilang = order_hilang()\nrugi = sum(o["amount"] for o in orders if o["id"] in hilang)\nprint(f"revenue AI (fan-out): {ra}")\nprint(f"revenue benar: {rb}")\nprint(f"faktor inflasi: {fi}x")\nprint(f"filter AI melewatkan: {hilang} (rugi Rp{rugi} tercatat)")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "revenue_ai", label: "fungsi `revenue_ai` terdefinisi", msg: "Definisikan revenue_ai() yang men-SUM baris hasil join." },
          { kind: "equal", task: "t1", name: "ra", value: 1400.0, tol: 0.01, label: "`ra` = 1400.0", msg: "SUM 8 baris join = 1400 — inilah angka 'AI'." },
          { kind: "equal", task: "t1", name: "rb", value: 1000.0, tol: 0.01, label: "`rb` = 1000.0", msg: "SUM 5 order distinct = 1000 — inilah angka benar." },
          { kind: "equal", task: "t2", name: "fi", value: 1.4, tol: 0.01, label: "`fi` = 1.4", msg: "1400 / 1000 = 1,4x inflasi fan-out." },
          { kind: "equal", task: "t3", name: "hilang", value: ["o1"], label: "`hilang` = ['o1']", msg: "o1: biz 2026-01-01 tapi UTC masih 2025-12-31 — terbuang filter UTC." },
          { kind: "stdout_matches", task: "t3", pattern: "melewatkan: \\['o1'\\]", label: "`print` order yang hilang", msg: "Baris terakhir harus menyebut ['o1']." },
        ],
      },
      reference: "Grain dulu (distinct), baru agregasi. Zona waktu bisnis, bukan UTC mentah.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: kapan AI, kapan manusia",
      prose: [
        "Skenario 1 — Boilerplate DAG, CTE skeleton, regex parsing. → Pakai AI, review ringan. Alasan: pola umum, risiko makna rendah, hemat 80% waktu ketik.",
        "Skenario 2 — Query agregasi untuk angka bisnis (revenue, NPL). → AI boleh draf, WAJIB inspeksi 3 lapis. Alasan: bug makna tidak terlihat dari sintaks; taruhannya uang.",
        "Skenario 3 — Prompt butuh tempel skema + sample data. → Redact PII/kredensial dulu, sampel ≤ 5 baris. Alasan: mulut ember — yang ditempel bisa tersimpan.",
        "Skenario 4 — Logika inti yang hanya dipahami 1–2 orang (aturan regulator, definisi risiko). → Tulis manual, AI hanya untuk review gaya. Alasan: AI menebak konteks yang tidak ia miliki — tebakan yang rapi tetap tebakan.",
        "Skenario 5 — Review query AI. → Review MANUSIA baca klaim makna; jangan minta AI yang sama mereview dirinya. Alasan: verifikasi butuh sumber kebenaran independen.",
        "Aturan praktis 10 detik: boilerplate = gas; angka bisnis = inspeksi 3 lapis; data sensitif = redact dulu; review = manusia baca makna.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Kebijakan 'dilarang pakai AI' total. Larangan tidak menghentikan pemakaian — hanya memindahkannya ke bawah tanah tanpa review. Yang bekerja: kebijakan 'boleh, dengan inspeksi wajib' + template prompt yang menyertakan grain dan zona waktu.",
      },
      reference: "AI = magang tercepat yang pernah ada. Magang tetap butuh inspektur.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: model dbt Rp900 juta",
      prose: [
        "DanaCepat meminta AI membuat model dbt `fct_pinjaman` dari 3 sumber. AI menghasilkan 120 baris yang rapi. Inspektur (seorang manusia, 20 menit) menemukan: (1) join ke tabel cicilan menggandakan pokok — model mengklaim outstanding Rp2,7 M padahal Rp1,9 M (faktor 1,42x); (2) filter `created_at >= '2026-01-01'` memakai UTC padahal cut-off bisnis WIB — 340 pinjaman 1 Januari hilang; (3) kolom `denda` di-SUM dari tabel yang sudah agregat per bulan — double counting kedua.",
        "Dampak bila lolos: laporan risiko ke direksi overstated 42%, 340 pinjaman tak tertagih tidak masuk daftar penagihan (potensi rugi Rp900 juta), dan denda terhitung ganda. Total waktu 'penghematan' AI: 2 jam penulisan. Total waktu audit + perbaikan: 3 hari. Net: minus.",
        "Pertanyaan analisis: (1) Lapis inspeksi mana yang menangkap tiap bug? (2) Apa yang seharusnya ada di prompt awal agar 2 dari 3 bug tidak terjadi? (3) Hitung 'break-even': kapan pemakaian AI di kasus ini sebenarnya menguntungkan?",
        "Pembahasan: (1) Bug 1 = lapis grain (baris sebelum vs sesudah join); bug 2 = lapis batas (sampel 1 Januari dengan jawaban manual); bug 3 = lapis distribusi (total denda vs sumber). (2) Prompt: 'satu baris = satu pinjaman; hari bisnis = WIB; denda sudah agregat bulanan di sumber' — tiga kalimat yang mencegah tiga bug. (3) Break-even: bila inspeksi 20 menit menemukan bug senilai Rp900 juta, 'biaya' AI negatif — AI menguntungkan HANYA bila inspeksinya dilakukan. Tanpa inspeksi, AI adalah cara tercepat merugi.",
      ],
      tasks: [],
      reference: "Tiga kalimat di prompt mencegah tiga bug. Inspeksi 20 menit > 3 hari perbaikan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam soal. Semua jawaban ada di lesson ini — yang diuji adalah pemahaman, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "AI = magang tercepat: hebat untuk boilerplate & pola umum; buta logika bisnis, grain, dan konteks implisit.",
        "Bug makna tidak menyebabkan error — query salah tetap jalan dan menghasilkan angka meyakinkan.",
        "Inspeksi 3 lapis: grain (baris sebelum vs sesudah join), batas (sampel jawaban pasti), distribusi (total vs sumber).",
        "Lapis nol: redact PII/kredensial sebelum tempel; pertahankan bentuk data.",
        "Review = manusia baca KLAIM MAKNA; jangan minta AI mereview dirinya sendiri.",
      ],
      next: { label: "DE31 — SCD Type 1/2/3: Saat Dimensi Berubah, Sejarah Ikut Berubah", href: "/v2/learn/de31-scd-type-1-2-3" },
      quiz: [
        {
          q: "Query AI jalan tanpa error dan hasilnya 'masuk akal'. Apa yang BISA disimpulkan?",
          options: [
            { text: "Query benar", why: "Tidak bisa: bug makna (fan-out, zona waktu) jalan tanpa error dan terlihat masuk akal.", },
            { text: "Hanya sintaksnya valid — makna (grain, filter, definisi) masih harus diinspeksi", why: "Tepat: 'jalan' adalah klaim terkecil tentang query. Makna butuh inspeksi 3 lapis.", correct: true },
            { text: "Dua reviewer cukup sebagai jaminan", why: "Di cerita, dua reviewer lolos karena me-review kerapian, bukan makna.", },
            { text: "AI tidak pernah salah sintaks", why: "AI bisa salah sintaks juga — tetapi itu bug yang murah karena terlihat.", },
          ],
        },
        {
          q: "Lapis inspeksi mana yang menangkap fan-out join (5 order → 8 baris)?",
          options: [
            { text: "Lapis distribusi", why: "Distribusi membandingkan total — ia menangkap AKIBAT, bukan akar (grain).", },
            { text: "Lapis grain: bandingkan jumlah baris sebelum vs sesudah join", why: "Tepat: 5 → 8 baris = grain berubah = SUM sisi-order pasti mengganda.", correct: true },
            { text: "Lapis batas", why: "Batas memakai sampel kecil — berguna, tetapi grain-lah yang langsung menunjuk biang.", },
            { text: "Tidak ada — fan-out tidak terdeteksi", why: "Terdeteksi jelas di lapis 1: perbedaan jumlah baris.", },
          ],
        },
        {
          q: "Order 31 Des 18:00 UTC (= 1 Jan 01:00 WIB) hilang oleh filter `utc >= '2026-01-01'`. Pelajarannya?",
          options: [
            { text: "Jangan pernah filter tanggal", why: "Filter tanggal perlu — yang salah adalah KOLOMNYA.", },
            { text: "Pakai tanggal bisnis (WIB) untuk cut-off bisnis, bukan kolom UTC mentah", why: "Tepat: definisi 'hari' milik bisnis, bukan milik server.", correct: true },
            { text: "UTC selalu salah", why: "UTC benar untuk urutan kejadian global; salah untuk definisi hari bisnis lokal.", },
            { text: "AI tidak bisa menangani tanggal", why: "AI bisa — bila prompt menyebut zona waktu bisnis. Masalahnya konteks, bukan kemampuan.", },
          ],
        },
        {
          q: "Perlu menempel skema + 5 baris sample ke AI publik. Yang AMAN?",
          options: [
            { text: "Tempel apa adanya — cuma 5 baris", why: "Lima baris PII asli = lima korban; ukuran tidak mengurangi sensitivitas.", },
            { text: "Anonimkan PII/kredensial (token konsisten, bentuk data dipertahankan), sampel kecil", why: "Tepat: AI butuh BENTUK data (string nama), bukan ISINYA (nama asli).", correct: true },
            { text: "Tempel 10.000 baris agar AI lebih pintar", why: "Volume tidak menambah kecerdasan untuk pola; hanya menambah risiko.", },
            { text: "Jangan pernah pakai AI sama sekali", why: "Larangan total = pemakaian bawah tanah tanpa review. Kebijakan yang bekerja: boleh + inspeksi.", },
          ],
        },
        {
          q: "'Tolong review query yang kamu buat tadi' ke AI yang sama. Masalahnya?",
          options: [
            { text: "Tidak ada — efisien", why: "AI mengulang asumsi yang sama dan mengiyakan dirinya sendiri.", },
            { text: "Verifikasi butuh sumber kebenaran independen — AI mereview dirinya = mengulang asumsi yang sama", why: "Tepat: inspeksi yang sah datang dari manusia + data (grain, batas, distribusi).", correct: true },
            { text: "AI akan tersinggung", why: "AI tidak punya perasaan — tetapi juga tidak punya sudut pandang kedua.", },
            { text: "Terlalu lambat", why: "Bukan soal kecepatan — soal validitas.", },
          ],
        },
        {
          q: "AI benar 95% per query; kamu menjalankan 20 query AI per minggu. Implikasinya?",
          options: [
            { text: "Aman — 95% itu tinggi", why: "1 − 0,95^20 = 64% peluang ≥1 bug per minggu. 'Tinggi' per query ≠ aman per minggu.", },
            { text: "Peluang ≥1 bug per minggu ≈ 64% — review bukan soal ketidakpercayaan, melainkan aritmetika", why: "Tepat: 1 − 0,95²⁰ ≈ 0,64. Inilah kenapa inspeksi wajib, bukan opsional.", correct: true },
            { text: "Berarti 1 query pasti salah tiap minggu", why: "64% peluang, bukan kepastian — tetapi cukup tinggi untuk mewajibkan inspeksi.", },
            { text: "Kurangi jadi 19 query per minggu", why: "0,95^19 masih 62% — solusinya inspeksi, bukan mengurangi satu query.", },
          ],
        },
      ],
    },
  ],
};
