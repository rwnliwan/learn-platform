import type { V2Lesson } from "../lib/types";

const FIG_EVENT = `<svg viewBox="0 0 560 340" role="img" aria-label="Model data GA4: event dengan parameter, user properties, dan item.">
<g font-family="var(--font-ui)">
<text x="14" y="26" font-size="13" fill="var(--chart-text)" font-weight="bold">Model data GA4: semuanya adalah event</text>
<rect x="180" y="48" width="200" height="52" rx="10" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="280" y="70" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">event: purchase</text>
<text x="280" y="88" font-size="10" fill="var(--chart-text)" text-anchor="middle">nama event + timestamp</text>
<line x1="280" y1="100" x2="90" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="280" y1="100" x2="280" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="280" y1="100" x2="470" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="10" y="140" width="160" height="70" rx="8" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="2"/>
<text x="90" y="162" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">parameters</text>
<text x="90" y="180" font-size="10" fill="var(--chart-text)" text-anchor="middle">value: 250000</text>
<text x="90" y="196" font-size="10" fill="var(--chart-text)" text-anchor="middle">currency: IDR</text>
<rect x="200" y="140" width="160" height="70" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="280" y="162" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">user properties</text>
<text x="280" y="180" font-size="10" fill="var(--chart-text)" text-anchor="middle">tier: gold</text>
<text x="280" y="196" font-size="10" fill="var(--chart-text)" text-anchor="middle">kota: Makassar</text>
<rect x="390" y="140" width="160" height="70" rx="8" fill="var(--c2)" opacity="0.25" stroke="var(--c2)" stroke-width="2"/>
<text x="470" y="162" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">items[]</text>
<text x="470" y="180" font-size="10" fill="var(--chart-text)" text-anchor="middle">sku: KOPI-001</text>
<text x="470" y="196" font-size="10" fill="var(--chart-text)" text-anchor="middle">qty: 2</text>
<rect x="60" y="240" width="440" height="60" rx="8" fill="var(--chart-text)" opacity="0.08" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="280" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Tidak ada lagi &quot;pageview vs event&quot; — semua interaksi</text>
<text x="280" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">adalah event dengan struktur yang sama.</text>
<text x="280" y="322" font-size="10" fill="var(--chart-text)" text-anchor="middle">Session &amp; user dihitung DARI event (bukan tipe hit terpisah).</text>
</g>
</svg>`;

export const mk20: V2Lesson = {
  slug: "mk20-ga4",
  track: "Marketing Analytics",
  module: "Tracking & Data",
  title: "MK20 — GA4: Pengukuran Berbasis Event",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "1 Juli 2023: dasbor yang mati dalam semalam",
      prose: [
        "Senin pagi, 3 Juli 2023. Head of growth sebuah e-commerce fashion di Jakarta membuka dasbor seperti biasa — dan menemukan angka nol di mana-mana. Bukan error: Universal Analytics (UA), alat ukur yang dipakai timnya 8 tahun, resmi dimatikan Google 1 Juli 2023. Data historisnya berhenti mengalir; tim yang menunda migrasi ke Google Analytics 4 (GA4) kini buta: tidak tahu campaign mana yang menghasilkan, tidak tahu conversion rate minggu ini.",
        "Twist-nya: tim yang 'rajin' pun kaget. Mereka sudah install GA4 setahun sebelumnya — tetapi angkanya TIDAK COCOK dengan UA: session turun 30%, bounce rate 'hilang', conversion beda definisi. Mereka mengira GA4-nya rusak. Kenyataannya GA4 tidak rusak — ia mengukur DUNIA YANG BERBEDA dengan kamus yang berbeda: bukan lagi 'halaman dilihat berapa kali' (hit-based), melainkan 'pengguna melakukan apa' (event-based). Lesson ini mengajarkan kamus baru itu: model event, DebugView, sampai ekspor BigQuery — fondasi yang kini disyaratkan di lowongan kerja analis (Spiralyze dan Novade secara eksplisit mensyaratkan GA4/GTM).",
      ],
      tasks: [],
      note: {
        title: "Konteks karir",
        type: "risk",
        body: "Lowongan 'Google Analytics and Tagging Specialist' (Spiralyze) dan 'Digital Marketing Specialist' (Novade Solutions) mencantumkan GA4/GTM sebagai syarat — bukan nilai tambah. Analis marketing yang hanya paham UA di 2026 seperti akuntan yang hanya bisa pembukuan kertas.",
      },
      reference: "UA mati 1 Juli 2023. GA4 = kamus baru: event-based, bukan hit-based.",
    },
    {
      id: "model-event",
      eyebrow: "Langkah 2 · Konsep",
      title: "Model event: satu kamus untuk semua interaksi",
      prose: [
        "Di UA ada tiga tipe hit berbeda: pageview, event, transaction — masing-masing dengan aturan sendiri. Di GA4, semuanya runtuh menjadi SATU struktur: event. Pageview hanyalah event bernama page_view; pembelian adalah event purchase; scroll adalah event scroll. Setiap event membawa tiga lapis informasi: parameters (detail kejadian itu: value, currency, page_location), user properties (atribut penggunanya: tier, kota), dan items[] (khusus commerce: sku, qty, harga per item).",
        "Konsekuensinya besar. Satu: kamu bebas MENCIPTAKAN event sendiri — generate_lead, mulai_trial, video_50persen — tanpa menunggu Google menyediakan tipe hit-nya. Dua: analisis menjadi fleksibel — karena semua event berstruktur sama, kamu bisa bertanya 'dari yang menonton video 50%, berapa yang purchase dalam 7 hari?' langsung di antarmuka Explore. Tiga: session dan user DIHITUNG dari event (session dimulai oleh event session_start), bukan dikirim sebagai hit terpisah — inilah salah satu alasan angka GA4 vs UA tidak pernah cocok.",
        "Kepribadian konsep ini: GA4 adalah 'bahasa', bukan 'formulir'. UA seperti formulir pajak dengan kolom tetap — rapi tetapi kaku. GA4 seperti bahasa dengan kosakata bebas — kuat sekali bila timmu disiplin memberi nama, kacau sekali bila tiap orang menamai seenaknya.",
        "🚨 Mitos: 'Angka GA4 harusnya sama dengan UA kalau setting-nya benar.' Yang benar: keduanya mengukur dengan definisi berbeda (session dihitung berbeda, user dihitung berbeda, timezone dan filter berbeda). Selisih 10-30% adalah NORMAL — jangan kejar angka yang cocok, kejar definisi yang konsisten ke depan.",
        "🚨 Mitos: 'Event otomatis (enhanced measurement) cukup, tidak perlu tagging manual.' Yang benar: enhanced measurement hanya menangkap interaksi generik (scroll, click keluar, pageview). Event bisnis — purchase dengan value, generate_lead dengan skor — WAJIB di-tag manual via GTM atau kode. Dasbor revenue dari event otomatis = nol.",
      ],
      tasks: [],
      figure: {
        svg: FIG_EVENT,
        alt: "Model data GA4: event dengan parameter, user properties, dan item.",
        caption: "Cara membaca: kotak atas = satu event (nama + waktu); tiga kotak bawah = tiga lapis datanya (parameters, user properties, items). Interpretasi: setiap interaksi — pageview, klik, pembelian — memakai struktur yang SAMA; bedanya hanya nama event dan isinya. Inilah mengapa GA4 fleksibel: analis bebas menciptakan event bisnis sendiri tanpa menunggu tipe hit baru dari Google.",
      },
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menamai event seenaknya: 'beli', 'Purchase', 'PEMBELIAN' untuk hal yang sama. GA4 case-sensitive — tiga nama itu tiga event berbeda dan dasbormu pecah. Tetapkan konvensi snake_case sejak hari pertama (purchase, generate_lead) dan kunci di dokumen tagging plan.",
      },
      reference: "Satu struktur event; tiga lapis data; session/user dihitung dari event.",
    },
    {
      id: "debugview",
      eyebrow: "Langkah 3 · Konsep",
      title: "DebugView: laboratorium sebelum data tayang",
      prose: [
        "Masalah klasik tagging: kamu pasang event purchase, tunggu 24 jam, ternyata value-nya tidak terkirim — sehari data hilang. DebugView memangkas siklus ini menjadi detik: buka halaman dengan mode debug (ekstensi Chrome GA Debugger atau parameter debug_mode), lakukan pembelian percobaan, dan lihat event mengalir REAL-TIME di antarmuka GA4 lengkap dengan parameters-nya.",
        "Alur kerja yang benar: satu — tulis tagging plan (nama event + parameter wajib per event). Dua — implementasi di GTM/kode. Tiga — verifikasi di DebugView: event muncul? parameter value terisi angka bukan teks? currency = IDR? Empat — BARU publish. Tim yang melewatkan langkah tiga akan menemukan bug-nya di laporan bulanan — saat data sudah terlanjur rusak dan tidak bisa diperbaiki mundur (GA4 tidak bisa reprocess data historis).",
        "Dua jebakan DebugView. Satu: data debug TIDAK masuk laporan reguler — ia hanya tampil di panel DebugView, jadi aman untuk testing dengan data dummy. Dua: DebugView menampilkan event dari PERANGKATMU saja — untuk testing lintas perangkat (misal alur beli di HP), buka debug di HP itu juga.",
        "🚨 Mitos: 'Kalau event muncul di DebugView, laporannya pasti benar.' Yang benar: DebugView memverifikasi PENGIRIMAN, bukan KEBENARAN bisnis — event purchase bisa terkirim dua kali (duplikat) atau dengan value salah dan tetap terlihat 'hijau' di DebugView. Verifikasi duplikat dan nilai butuh langkah lanjutan (lihat lab BigQuery).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Aturan 10 menit: setiap event baru WAJIB terlihat benar di DebugView dalam 10 menit setelah implementasi — nama snake_case, parameter wajib terisi, tipe data benar (value = angka). Bug tagging yang lolos 24 jam pertama biasanya hidup selamanya di data historis.",
      },
      reference: "Tagging plan → implementasi → DebugView → publish. GA4 tak bisa reprocess.",
    },
    {
      id: "key-events",
      eyebrow: "Langkah 4 · Konsep",
      title: "Key events, engagement, dan atribusi bawaan",
      prose: [
        "Di GA4 tidak ada lagi 'Goals' seperti UA — ada key events: event apa pun yang kamu tandai sebagai penting (purchase, generate_lead). Tandanya bisa diubah kapan saja TANPA mengubah tagging — fleksibilitas yang tidak dimiliki UA. Satu catatan: key event dihitung per event occurrence, jadi bila satu sesi ada 2 purchase, key event count = 2 — bedakan dengan 'sesi yang mengandung purchase' di analisis funnel.",
        "Bounce rate UA mati; penggantinya engaged sessions: sesi yang berlangsung >10 detik, ATAU punya conversion, ATAU membuka ≥2 pageview. Engagement rate = engaged sessions / total sessions. Angka ini lebih jujur untuk konten — pembaca yang menghabiskan 5 menit di satu artikel panjang kini dihitung engaged, padahal di UA ia 'bounce'.",
        "Atribusi bawaan GA4 memakai data-driven attribution (DDA) sebagai default: kredit conversion dibagi ke touchpoint berdasarkan model, bukan aturan posisi (first/last click). Kamu bisa membandingkan model di Advertising snapshot — tetapi ingat: DDA butuh volume data cukup; akun kecil akan fallback ke aturan sederhana. Dan seluruh atribusi GA4 tetap terbatas pada data yang GA4 lihat — klik iklan yang diblokir adblocker tidak masuk model (inilah jembatan ke lesson server-side tracking).",
        "🚨 Mitos: 'Engagement rate 60% berarti 60% pengunjung tertarik.' Yang benar: 60% SESI memenuhi definisi teknis engaged — definisi yang longgar untuk situs satu halaman (10 detik saja cukup). Bandingkan engagement antar halaman sejenis, jangan antar situs berbeda jenis.",
      ],
      tasks: [],
      formula: String.raw`\text{Engagement rate} = \frac{\text{engaged sessions}}{\text{total sessions}} \times 100\%`,
      formulaNote: "Engaged sessions = sesi dengan durasi >10 detik ATAU mengandung key event ATAU ≥2 pageview; total sessions = semua sesi. Interpretasi: angka ini menjawab 'berapa persen kunjungan yang bukan sekadar mampir'. Contoh: 6.000 engaged dari 10.000 sesi = 60%. Bandingkan dengan periode sebelumnya atau antar channel — angka absolutnya tidak bermakna tanpa pembanding.",
      reference: "Key events = goals yang fleksibel; engagement gantikan bounce; DDA default.",
    },
    {
      id: "lab-event",
      eyebrow: "Langkah 5 · Lab",
      title: "Membangun agregat GA4 dari event log mentah",
      prose: [
        "Simulasikan event log mentah (seperti yang GA4 terima): tiap baris = satu event dengan nama, user_id, session_id, dan parameters. Tugasmu: hitung metrik seperti GA4 — total users, total sessions, purchase count, dan conversion rate (sesi dengan purchase / total sesi).",
        "Perhatikan jebakannya: satu user bisa punya banyak sesi, satu sesi bisa punya banyak purchase — metrik GA4 dihitung pada level yang tepat (users ≠ sessions ≠ events). Inilah alasan angka 'tidak cocok' bila kamu mencampur level. Eksplorasi: tambah event refund — bagaimana conversion rate berubah bila refund dihitung terpisah vs mengurangi purchase?",
      ],
      tasks: [
        { id: "t1", text: "Hitung users unik, sessions unik, dan total event purchase" },
        { id: "t2", text: "Hitung conversion rate = sesi dgn purchase / total sesi, cetak keempat angka" },
      ],
      expected: "users=8 sessions=12 purchases=5 conv_rate=33.33%",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Inilah 'mesin' di balik setiap angka GA4: event log → agregasi per level (user/session/event). Analis yang paham level agregasi tidak akan pernah salah baca 'conversion 41%' sebagai '41% pengguna membeli' — yang benar: 41% SESI mengandung pembelian.",
      },
      hints: [
        "Gunakan set() untuk users dan sessions unik dari tiap event.",
        "Kumpulkan session_id dari event purchase ke set lain, lalu bagi dengan total sesi.",
        "Format: f\"users={len(u)} sessions={len(s)} purchases={p} conv_rate={cr:.2%}\".",
      ],
      code: {
        starter: "# Event log mentah: (event_name, user_id, session_id). JANGAN UBAH.\nlog = [\n    (\"page_view\",\"u1\",\"s1\"),(\"scroll\",\"u1\",\"s1\"),(\"purchase\",\"u1\",\"s1\"),\n    (\"page_view\",\"u2\",\"s2\"),(\"page_view\",\"u2\",\"s3\"),(\"purchase\",\"u2\",\"s3\"),\n    (\"page_view\",\"u3\",\"s4\"),(\"scroll\",\"u3\",\"s4\"),\n    (\"page_view\",\"u4\",\"s5\"),(\"purchase\",\"u4\",\"s5\"),(\"purchase\",\"u4\",\"s5\"),\n    (\"page_view\",\"u5\",\"s6\"),(\"page_view\",\"u6\",\"s7\"),(\"scroll\",\"u6\",\"s7\"),\n    (\"page_view\",\"u7\",\"s8\"),(\"page_view\",\"u7\",\"s9\"),(\"purchase\",\"u7\",\"s9\"),\n    (\"page_view\",\"u8\",\"s10\"),(\"page_view\",\"u8\",\"s11\"),(\"page_view\",\"u8\",\"s12\"),\n]\n\n# TULIS KODEMU: users, sessions, purchases, conversion rate\nusers =\nsessions =\npurchases =\nsesi_beli =\nconv_rate =\nprint(f\"users={len(users)} sessions={len(sessions)} purchases={purchases} conv_rate={conv_rate:.2%}\")\n",
        lockLines: 12,
        solution: "# Event log mentah: (event_name, user_id, session_id). JANGAN UBAH.\nlog = [\n    (\"page_view\",\"u1\",\"s1\"),(\"scroll\",\"u1\",\"s1\"),(\"purchase\",\"u1\",\"s1\"),\n    (\"page_view\",\"u2\",\"s2\"),(\"page_view\",\"u2\",\"s3\"),(\"purchase\",\"u2\",\"s3\"),\n    (\"page_view\",\"u3\",\"s4\"),(\"scroll\",\"u3\",\"s4\"),\n    (\"page_view\",\"u4\",\"s5\"),(\"purchase\",\"u4\",\"s5\"),(\"purchase\",\"u4\",\"s5\"),\n    (\"page_view\",\"u5\",\"s6\"),(\"page_view\",\"u6\",\"s7\"),(\"scroll\",\"u6\",\"s7\"),\n    (\"page_view\",\"u7\",\"s8\"),(\"page_view\",\"u7\",\"s9\"),(\"purchase\",\"u7\",\"s9\"),\n    (\"page_view\",\"u8\",\"s10\"),(\"page_view\",\"u8\",\"s11\"),(\"page_view\",\"u8\",\"s12\"),\n]\n\n# TULIS KODEMU: users, sessions, purchases, conversion rate\nusers = {e[1] for e in log}\nsessions = {e[2] for e in log}\npurchases = sum(1 for e in log if e[0] == \"purchase\")\nsesi_beli = {e[2] for e in log if e[0] == \"purchase\"}\nconv_rate = len(sesi_beli) / len(sessions)\nprint(f\"users={len(users)} sessions={len(sessions)} purchases={purchases} conv_rate={conv_rate:.2%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "users=8 sessions=12", msg: "8 user unik, 12 sesi unik dari log.", pattern: "users=8 sessions=12" },
          { kind: "stdout_matches", task: "t2", label: "purchases=5 conv_rate=33.33%", msg: "5 event purchase; 4 sesi berisi purchase / 12 sesi.", pattern: "purchases=5 conv_rate=33.33%" },
        ],
      },
      reference: "Agregasi per level: user ≠ session ≠ event. Conversion GA4 = per sesi.",
    },
    {
      id: "bigquery",
      eyebrow: "Langkah 6 · Konsep + Lab",
      title: "BigQuery export: saat antarmuka GA4 tidak cukup",
      prose: [
        "GA4 punya batas: sampling di laporan besar, retensi data 14 bulan maksimal, dan analisis lintas tahun yang lambat. BigQuery export menyelesaikan ketiganya: setiap hari (atau streaming intra-day) GA4 menulis event MENTAH ke dataset BigQuery milikmu — tanpa sampling, retensi terserahmu, dan bisa di-query dengan SQL penuh.",
        "Skemanya khas: satu baris per event, dengan kolom nested event_params (array key-value) — jadi query-nya memakai UNNEST untuk 'membuka' parameter. Contoh pola: SELECT (SELECT value.int_value FROM UNNEST(event_params) WHERE key='value') AS nilai FROM dataset.events_* WHERE event_name='purchase'. Sekali paham pola UNNEST ini, seluruh export terbuka.",
        "Tiga kasus yang HANYA bisa dijawab via BigQuery: satu — deteksi duplikat purchase (hitung event_id kembar); dua — analisis funnel lintas 2 tahun; tiga — join data GA4 dengan data CRM/warehouse (inilah fondasi CDP). Biaya: export-nya gratis, yang berbayar adalah query BigQuery-nya — batasi dengan partisi tanggal (_TABLE_SUFFIX) agar tidak memindai terabyte.",
        "Lab di bawah meniru persis struktur export BigQuery (event + event_params sebagai list pasangan key-value) dalam Python: flatten parameter purchase, hitung total revenue, dan deteksi duplikat via transaction_id. Inilah skill yang ditagih di tes teknis analis: 'buka' nested params, agregasi benar.",
      ],
      tasks: [
        { id: "t1", text: "Flatten event_params tiap purchase jadi dict; hitung total revenue (value)" },
        { id: "t2", text: "Deteksi transaction_id duplikat; cetak revenue + jumlah duplikat" },
      ],
      expected: "revenue=1250000 duplikat=1",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjumlah value tanpa deduplikasi transaction_id. Satu bug tagging (purchase terkirim 2×) menggandakan revenue di laporan — dan bug ini TIDAK terlihat di DebugView. Audit duplikat via BigQuery adalah SOP bulanan tim data yang matang.",
      },
      hints: [
        "params = {k: v for k, v in ev['event_params']} untuk tiap event.",
        "value ada di params['value']; transaction_id di params['transaction_id'].",
        "Lacak id yang sudah terlihat dengan set; bila muncul lagi → duplikat, jangan jumlahkan 2×.",
      ],
      code: {
        starter: "# Tiruan export BigQuery: 1 baris/event, event_params nested. JANGAN UBAH.\nevents = [\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",250000),(\"transaction_id\",\"T1\")]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",500000),(\"transaction_id\",\"T2\")]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",250000),(\"transaction_id\",\"T1\")]},\n    {\"event_name\":\"page_view\",\"event_params\":[]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",500000),(\"transaction_id\",\"T3\")]},\n]\n\n# TULIS KODEMU: revenue terdedup + hitung duplikat\nrevenue = 0\nterlihat = set()\nduplikat = 0\nfor ev in events:\n    if ev[\"event_name\"] != \"purchase\":\n        continue\n    p = {k: v for k, v in ev[\"event_params\"]}\n    tid = p[\"transaction_id\"]\n    if tid in terlihat:\n        duplikat += 1\n        continue\n    terlihat.add(tid)\n    revenue += p[\"value\"]\nprint(f\"revenue={revenue} duplikat={duplikat}\")\n",
        lockLines: 9,
        solution: "# Tiruan export BigQuery: 1 baris/event, event_params nested. JANGAN UBAH.\nevents = [\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",250000),(\"transaction_id\",\"T1\")]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",500000),(\"transaction_id\",\"T2\")]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",250000),(\"transaction_id\",\"T1\")]},\n    {\"event_name\":\"page_view\",\"event_params\":[]},\n    {\"event_name\":\"purchase\",\"event_params\":[(\"value\",500000),(\"transaction_id\",\"T3\")]},\n]\n\n# TULIS KODEMU: revenue terdedup + hitung duplikat\nrevenue = 0\nterlihat = set()\nduplikat = 0\nfor ev in events:\n    if ev[\"event_name\"] != \"purchase\":\n        continue\n    p = {k: v for k, v in ev[\"event_params\"]}\n    tid = p[\"transaction_id\"]\n    if tid in terlihat:\n        duplikat += 1\n        continue\n    terlihat.add(tid)\n    revenue += p[\"value\"]\nprint(f\"revenue={revenue} duplikat={duplikat}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "revenue=1250000 duplikat=1", msg: "T1+T2+T3 = 1.250.000; T1 kedua = 1 duplikat.", pattern: "revenue=1250000 duplikat=1" },
          { kind: "forbids", task: "t1", label: "Tidak menjumlah mentah tanpa dedup", msg: "Jangan jumlahkan semua value tanpa cek transaction_id.", token: "sum(" },
        ],
      },
      reference: "UNNEST event_params; dedup via transaction_id; partisi tanggal hemat biaya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Antarmuka, Explore, atau BigQuery?",
      prose: [
        "Skenario satu — laporan rutin mingguan (traffic, conversion per channel): pakai ANTARMUKA standar GA4. Cepat, cukup, dan definisinya konsisten untuk stakeholder non-teknis. Jangan over-engineering.",
        "Skenario dua — pertanyaan ad-hoc lintas event ('dari penonton video 50%, berapa yang purchase 7 hari kemudian?'): pakai EXPLORE (funnel/path exploration). Fleksibel tanpa SQL, tetapi terbatas pada retensi 14 bulan dan sampling di volume besar.",
        "Skenario tiga — audit data, funnel 2 tahun, join dengan CRM: pakai BIGQUERY export. Satu-satunya jalan untuk data mentah tanpa sampling — tetapi butuh skill SQL nested dan disiplin biaya query.",
        "Skenario empat — event bisnis kritis (purchase, lead): implementasi via GTM server-side atau Measurement Protocol DENGAN DebugView + audit duplikat bulanan. Event uang tidak boleh hanya mengandalkan tagging browser.",
        "Aturan praktis 10 detik: stakeholder rutin → antarmuka; analis eksplorasi → Explore; data mentah/join/audit → BigQuery; event uang → tagging serius + audit. Pilih alat sesuai pertanyaan, bukan sesuai kebiasaan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengekspor ke BigQuery 'untuk jaga-jaga' tanpa pernah query. Export yang tidak dipakai = biaya penyimpanan + ilusi kesiapan. Nyalakan export saat ada minimal SATU kasus nyata (audit duplikat bulanan adalah kandidat pertama yang layak).",
      },
      reference: "Antarmuka = rutin; Explore = ad-hoc; BigQuery = mentah; event uang = tagging serius.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Revenue naik 40% — atau bug tagging?",
      prose: [
        "E-commerce 'SinarRitel': laporan GA4 Oktober menunjukkan purchase +40% vs September, tetapi revenue bank (settlement payment gateway) hanya +5%. Tim marketing merayakan; tim finance curiga. Audit BigQuery menemukan: event_id duplikat 32% dari purchase — tim dev memasang ulang tag purchase di halaman 'terima kasih' TANPA menghapus tag lama saat migrasi tema website 1 Oktober. Setiap pembeli mengirim purchase 2× (sebagian 3× karena refresh).",
        "Pertanyaan: (a) berapa revenue SEBENARNYA bila GA4 melaporkan Rp1,75 miliar dengan 32% event duplikat? (b) apa perbaikan permanennya? Pembahasan: (a) Bila 32% event adalah duplikat, event unik ≈ 68% — revenue riil ≈ Rp1,19 miliar, KENAIKAN NYATA hanya ~5% (cocok dengan settlement!). (b) Hapus tag ganda, tambahkan deduplikasi berbasis transaction_id di laporan (seperti lab), JADIKAN audit duplikat SOP bulanan, dan kunci perubahan tema website ke checklist tagging. Pelajaran: angka GA4 yang 'terlalu bagus' hampir selalu bug tagging — verifikasi ke sumber kebenaran eksternal (payment gateway) sebelum merayakan.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "SOP 'tiga sumber': setiap angka revenue marketing WAJIB rekonsiliasi dengan (1) payment gateway, (2) BigQuery terdedup, (3) laporan GA4. Bila ketiganya selisih >5%, ada bug — cari dulu, rayakan kemudian.",
      },
      reference: "Angka terlalu bagus = bug tagging sampai terbukti bukan.",
    },
    {
      id: "intuisi-bahasa",
      eyebrow: "Langkah 9 · Intuisi",
      title: "GA4 bukan alat — ia bahasa yang kamu tulis sendiri",
      prose: [
        "Seluruh lesson ini bermuara pada satu kesadaran: GA4 memberimu kosakata, bukan jawaban. Tiga heuristik pemakainya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: yang menguasai kamus, menguasai kebenaran",
        body: "Heuristik pertama: definisi adalah keputusan bisnis, bukan fakta teknis. 'Purchase', 'engaged', 'aktif' — setiap nama event dan setiap ambang adalah pilihan yang kamu buat, dan pilihan itu menentukan angka yang dilihat direksi. Analis senior menghabiskan 30% waktunya untuk tagging plan BUKAN karena ia lambat, melainkan karena ia tahu: kamus yang ceroboh menghasilkan kebenaran yang ceroboh. Tulis tagging plan seperti kamu menulis kontrak — karena memang kontrak: antara kamu hari ini dan kamu enam bulan lagi yang harus menjelaskan angka. Heuristik kedua: curigai angka yang terlalu bagus SEBELUM merayakannya. Revenue +40% sementara settlement +5% bukan kabar baik — ia bug tagging yang belum ketahuan. SOP 'tiga sumber' (gateway, BigQuery terdedup, laporan GA4) bukan birokrasi; ia satu-satunya hal yang memisahkan analis dari pembohong yang tidak sadar. Heuristik ketiga: pilih alat sesuai pertanyaan, bukan sesuai kenyamanan. Antarmuka untuk rutin, Explore untuk eksplorasi, BigQuery untuk kebenaran mentah. Analis yang hanya nyaman di satu alat akan memaksa semua pertanyaan masuk ke alat itu — dan menjawab pertanyaan yang salah dengan sangat efisien. Kuasai ketiganya, dan GA4 berubah dari 'alat Google yang membingungkan' menjadi bahasa ibu analitikamu.",
      },
      reference: "Kamus = kontrak; curigai angka bagus; alat mengikuti pertanyaan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5.",
      ],
      tasks: [],
      summary: [
        "GA4 event-based: semua interaksi adalah event (nama + parameters + user properties + items[]); session/user dihitung DARI event — selisih 10-30% vs UA adalah normal, bukan bug.",
        "Tagging disiplin: konvensi snake_case sejak hari pertama; alur tagging plan → implementasi → DebugView → publish; GA4 tidak bisa reprocess data historis — bug yang lolos 24 jam hidup selamanya.",
        "Key events menggantikan goals (fleksibel, bisa diubah tanpa retagging); engagement rate menggantikan bounce rate; atribusi default data-driven (DDA) tetapi buta terhadap traffic yang diblokir.",
        "BigQuery export = data mentah tanpa sampling: pola UNNEST event_params, dedup via transaction_id, partisi tanggal hemat biaya; satu-satunya jalan untuk audit duplikat, funnel lintas tahun, dan join CRM.",
        "Pilih alat sesuai pertanyaan: antarmuka (rutin), Explore (ad-hoc), BigQuery (mentah/audit), tagging serius untuk event uang; angka revenue selalu rekonsiliasi tiga sumber.",
        "GA4 adalah bahasa: definisi event = keputusan bisnis; curigai angka terlalu bagus; alat mengikuti pertanyaan.",
      ],
      next: { label: "MK21 — Server-Side Tracking", href: "/v2/learn/mk21-server-side" },
      quiz: [
        {
          q: "Di GA4, page_view dan purchase pada dasarnya adalah:",
          options: [
            { text: "Event dengan struktur sama — beda hanya nama dan isinya", why: "Benar: model event GA4 meruntuhkan semua tipe hit menjadi satu struktur.", correct: true },
            { text: "Dua tipe hit berbeda seperti di UA", why: "Itu model UA; di GA4 tidak ada lagi tipe hit terpisah." },
            { text: "Hanya page_view yang event; purchase adalah transaksi terpisah", why: "Purchase juga event — dengan parameters value/currency/items." },
            { text: "Data yang disimpan di properti berbeda", why: "Keduanya mengalir ke properti yang sama sebagai event stream." },
          ],
        },
        {
          q: "Angka session GA4 30% lebih rendah dari UA. Respons yang tepat?",
          options: [
            { text: "Wajar — definisi session berbeda; kejar konsistensi definisi ke depan, bukan angka yang cocok", why: "Benar: selisih 10-30% normal karena metodologi berbeda.", correct: true },
            { text: "Setting GA4 pasti salah — samakan sampai angkanya identik", why: "Identik tidak mungkin; definisinya memang berbeda." },
            { text: "Kembali ke UA karena datanya lebih lengkap", why: "UA sudah dimatikan 1 Juli 2023 — tidak ada jalan kembali." },
            { text: "Naikkan sampling agar angkanya naik", why: "Sampling tidak mengubah definisi session." },
          ],
        },
        {
          q: "Fungsi utama DebugView dalam alur tagging:",
          options: [
            { text: "Verifikasi pengiriman event real-time SEBELUM publish — karena GA4 tak bisa reprocess", why: "Benar: menangkap bug dalam hitungan detik, bukan di laporan bulanan.", correct: true },
            { text: "Menggantikan laporan reguler untuk stakeholder", why: "DebugView hanya menampilkan perangkat sendiri, bukan agregat." },
            { text: "Memperbaiki data historis yang rusak", why: "GA4 tidak bisa reprocess — data rusak permanen." },
            { text: "Menghitung atribusi data-driven otomatis", why: "Atribusi dihitung di laporan Advertising, bukan DebugView." },
          ],
        },
        {
          q: "Laporan GA4 menunjukkan revenue Rp1,75 miliar (+40%), settlement gateway hanya +5%. Dugaan pertama yang paling mungkin?",
          options: [
            { text: "Bug tagging: event purchase duplikat — audit via BigQuery pakai transaction_id", why: "Benar: pola klasik tag ganda; verifikasi ke sumber eksternal dulu.", correct: true },
            { text: "Payment gateway yang salah mencatat", why: "Gateway adalah sumber kebenaran uang riil — kecil kemungkinan salah sebesar itu." },
            { text: "Atribusi DDA membesar-besarkan revenue", why: "DDA membagi kredit, tidak menggandakan nilai purchase." },
            { text: "Itu pertumbuhan asli — rayakan saja", why: "Selisih 35 poin vs uang riil = sinyal bug, bukan pertumbuhan." },
          ],
        },
        {
          q: "Kapan BigQuery export WAJIB dipakai (tidak cukup antarmuka/Explore)?",
          options: [
            { text: "Audit duplikat purchase, funnel lintas 2 tahun, join GA4 dengan CRM", why: "Benar: ketiganya butuh data mentah tanpa sampling — hanya ada di export.", correct: true },
            { text: "Laporan traffic mingguan untuk direksi", why: "Antarmuka standar sudah cukup dan lebih cepat." },
            { text: "Melihat event yang baru dipasang 10 menit lalu", why: "Itu tugas DebugView (real-time), bukan BigQuery." },
            { text: "Mengganti seluruh fungsi analis marketing", why: "BigQuery adalah alat, bukan pengganti analis." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghafal definisi GA4 tanpa pernah membuka DebugView. Lesson ini baru 'selesai' bila kamu sudah: (1) melihat event mengalir di DebugView, (2) menulis satu query UNNEST di BigQuery. Teori tanpa sentuhan alat = pengetahuan pajangan.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa 'purchase' bisa tercatat 2× padahal pembeli hanya bayar sekali.",
        "Ingat pola SQL: UNNEST(event_params) + WHERE key='value' — itulah kunci seluruh export.",
      ],
      reference: "Event-based; DebugView dulu; BigQuery untuk yang mentah; rekonsiliasi tiga sumber.",
    },
  ],
};
