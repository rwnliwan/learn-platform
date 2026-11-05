import type { V2Lesson } from "../lib/types";

// ── Figure: latensi batch vs CDC + beban database ──────────────────────────
const CDC_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Perbandingan latensi dan beban database: batch harian, batch per jam, CDC">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="70" y1="20" x2="70" y2="200"/><line x1="70" y1="200" x2="530" y2="200"/>
</g>
<g font-family="var(--font-ui)">
<rect x="110" y="40" width="70" height="160" fill="var(--chart-text)" opacity="0.5"/>
<text x="145" y="218" text-anchor="middle" font-size="11" fill="var(--text)">Batch harian</text>
<text x="145" y="32" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">24 jam</text>
<rect x="250" y="120" width="70" height="80" fill="var(--chart-text)" opacity="0.5"/>
<text x="285" y="218" text-anchor="middle" font-size="11" fill="var(--text)">Batch per jam</text>
<text x="285" y="112" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">1 jam</text>
<rect x="390" y="188" width="70" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="425" y="218" text-anchor="middle" font-size="11" fill="var(--text)">CDC</text>
<text x="425" y="180" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">detik</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)">
<rect x="96" y="60" width="98" height="10" fill="var(--c2)" opacity="0.85"/>
<text x="200" y="70">beban DB: full scan</text>
<rect x="236" y="140" width="98" height="10" fill="var(--c2)" opacity="0.85"/>
<text x="340" y="150">beban: scan inkremental</text>
<rect x="376" y="192" width="98" height="6" fill="var(--c2)" opacity="0.85"/>
<text x="480" y="200">beban: baca log</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="70" y="240">latensi data (kiri, abu) vs beban database sumber (kanan, oranye) — ilustrasi</text>
</g>
</svg>`;

export const de19: V2Lesson = {
  slug: "de19-cdc-debezium",
  track: "Data Engineer",
  module: "Platform Data",
  title: "CDC & Debezium: Menangkap Perubahan Saat Terjadi",
  estMinutes: 68,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Fraud yang terdeteksi besok pagi — padahal uangnya hilang tadi malam",
      prose: [
        "Tim fraud sebuah bank punya model deteksi yang bagus — akurasinya 94%. Masalahnya: model itu membaca data transaksi dari batch ETL harian yang jalan jam 2 pagi. Seorang nasabah melaporkan dana raib jam 9 malam; pola fraud-nya (lima transfer kecil beruntun ke rekening baru) sebenarnya sudah “terlihat” di database jam 9 lebih lima menit — tetapi batch baru jalan lima jam kemudian. Saat analis datang pagi hari, uangnya sudah pindah tiga kali. Twist-nya: tidak ada yang salah dengan modelnya. Yang salah adalah asumsi arsitekturnya: bahwa “data kemarin” cukup cepat untuk kejahatan yang terjadi “sekarang”.",
        "Solusinya adalah Change Data Capture (CDC): menangkap setiap perubahan di database sumber SAAT terjadi — dari transaction log (WAL di Postgres, binlog di MySQL) — dan mengalirkannya ke Kafka sebagai event. Debezium adalah platform open-source paling populer untuk ini: ia membaca log database (bukan meng-query tabel, jadi tidak membebani database operasional) dan menerbitkan event terstruktur (before/after, operasi, timestamp) yang bisa dikonsumsi real-time.",
        "Di lesson ini kamu belajar anatomi CDC, cara kerja Debezium (connector → Kafka → event), dan kapan CDC tepat — serta kapan batch biasa sebenarnya cukup.",
      ],
      tasks: [],
      note: {
        title: "Kenapa CDC ada di jantung platform data real-time",
        type: "risk",
        body: "Setiap use case “deteksi sekarang” — fraud, alerting, sinkronisasi stok, personalisasi — butuh data yang umurnya detik, bukan jam. CDC adalah cara mendapatkan data detik tanpa mengorbankan database operasional. Arsitek yang hanya tahu batch akan selalu kalah cepat dari masalahnya.",
      },
      reference: "CDC = tangkap perubahan dari transaction log saat terjadi → event ke Kafka. Debezium = connector open-source untuk itu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan tiga pendekatan CDC (query-based, trigger-based, log-based) dan trade-off-nya; (2) menjelaskan arsitektur Debezium: connector membaca log → event ke topik Kafka; (3) membaca struktur event Debezium (before/after/op/ts_ms) dan menggunakannya; (4) menghitung lag CDC dan memutuskan kapan batch sudah cukup.",
        "Rutenya: cerita → bekal ringkas → dua konsep inti (pendekatan CDC; Debezium & event) → lab Python (parser event Debezium + hitung lag) → chart latensi vs beban → peta keputusan → mini-case sinkronisasi stok → kuis → rangkuman. Estimasi 55 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Dari batch vs streaming: batch memproses data dalam interval (per jam/harian) — murah dan sederhana, tetapi latensinya sebesar intervalnya; streaming memproses event saat datang — latensi detik, tetapi arsitekturnya lebih kompleks. CDC adalah jembatan: ia mengubah database batch-minded menjadi sumber event streaming tanpa mengubah aplikasinya. Dari Kafka: topik adalah log append-only tempat event mengalir; konsumer membaca sesuai kecepatan masing-masing — fondasi yang dipakai Debezium untuk mendistribusikan perubahan.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: CDC menjawab pertanyaan “apa yang BERUBAH?” — bukan “bagaimana keadaan sekarang?”. Database menjawab yang kedua; log perubahan menjawab yang pertama. Keduanya benar, untuk pertanyaan berbeda.",
      ],
      reference: "Bekal: (1) batch = murah, latensi = interval; streaming = cepat, kompleks; (2) Kafka topik = log append-only untuk event.",
    },
    {
      id: "konsep-pendekatan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga Pendekatan CDC — Si Penanya, Si Pengintip, Si Pembaca Diari",
      prose: [
        "Definisi: CDC (Change Data Capture) adalah teknik menangkap perubahan data di sistem sumber untuk direplikasi/diolah di tempat lain. Tiga pendekatan: (1) Query-based — polling tabel dengan kolom `updated_at`/kolom versi; (2) Trigger-based — trigger database menulis setiap perubahan ke tabel bayangan; (3) Log-based — membaca transaction log (WAL/binlog) tempat database mencatat SEMUA perubahan untuk keperluan recovery-nya sendiri.",
        "Kepribadiannya: si Penanya (query-based) — sopan tetapi berisik; ia menelepon database tiap 5 menit bertanya “ada yang berubah?”; database lelah menjawab, dan perubahan yang terjadi lalu dibatalkan di antara dua panggilan tidak pernah terdengar. Si Pengintip (trigger-based) — ia menyadap setiap transaksi; akurat, tetapi setiap INSERT/UPDATE membayar pajak trigger (latensi tulis naik). Si Pembaca Diari (log-based) — ia membaca buku harian yang memang ditulis database untuk dirinya sendiri; tidak mengganggu siapa pun, tidak melewatkan apa pun, termasuk urutan kejadiannya.",
        "Kapan memakai: query-based untuk tabel kecil dan kebutuhan near-real-time yang longgar (murah, tetapi butuh kolom timestamp yang bisa dipercaya); trigger-based jarang dianjurkan di produksi modern (pajak tulis + risiko); log-based (Debezium) untuk kebutuhan real-time serius — ia satu-satunya yang menangkap DELETE, urutan, dan tidak membebani query operasional.",
      ],
      formula: String.raw`\text{lag}_{\text{CDC}} = t_{\text{event keluar}} - t_{\text{commit}}`,
      formulaNote: "t_commit = saat transaksi di-commit di database sumber; t_event keluar = saat event tersedia di topik Kafka. Lag CDC yang sehat = detik (biasanya < 5 detik). Interpretasi: lag adalah “umur” data saat dibaca konsumer — dashboard fraud dengan lag 30 detik membaca masa 30 detik lalu. Kalau lag tumbuh terus (t_commit makin jauh tertinggal), connector-nya tidak sanggup mengejar log: waktunya scale atau investigasi.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “CDC = real-time, jadi pasti lebih baik dari batch”",
        type: "pitfall",
        body: "Yang benar: real-time adalah kebutuhan, bukan kemuliaan. Kalau keputusan bisnisnya bulanan (laporan keuangan), CDC hanya menambah kompleksitas tanpa nilai. CDC tepat ketika ada aksi yang harus terjadi dalam menit/detik (blokir fraud, update stok, alert). Tanya dulu “keputusan apa yang menunggu data ini?” sebelum membangun pipeline real-time.",
      },
      hints: [
        "💡 Intuisi: log-based CDC itu “gratis” dari sisi database — database memang menulis WAL/binlog untuk recovery-nya sendiri. Debezium hanya membaca salinannya. Inilah kenapa ia tidak membebani query operasional seperti polling.",
      ],
      reference: "Query = berisik & bisa terlewat; trigger = pajak tulis; log-based = lengkap & tidak mengganggu. Pilih berdasar kebutuhan aksi.",
    },
    {
      id: "konsep-debezium",
      eyebrow: "Langkah 4 · Konsep",
      title: "Debezium — Si Penerjemah Buku Harian Database",
      prose: [
        "Definisi: Debezium adalah platform CDC open-source (di atas Kafka Connect) yang membaca transaction log database — WAL Postgres, binlog MySQL, redo log Oracle — dan menerbitkan setiap perubahan sebagai event JSON terstruktur ke topik Kafka. Satu event membawa: `before` (baris sebelum berubah), `after` (baris sesudah), `op` (c=create/insert, u=update, d=delete, r=snapshot read), `ts_ms` (waktu event), dan `source` (LSN/posisi log, nama tabel).",
        "Kepribadiannya: Debezium seperti penerjemah simultan yang duduk di samping database dan membisikkan ke Kafka: “baris 42 di tabel transfer baru saja berubah — saldonya dari 10 juta menjadi 0, operasinya update, jam 21:05:03”. Konsumer (deteksi fraud, materialized view, data lake) mendengar bisikan yang sama, masing-masing bereaksi sesuai kebutuhannya. Sifat kuncinya: (1) tidak mengubah aplikasi — database tidak tahu ia dibaca; (2) menangkap DELETE — yang tidak bisa ditangkap query `updated_at`; (3) snapshot awal + streaming — saat connector baru dipasang, ia membaca seluruh tabel dulu (snapshot, op=r), lalu lanjut streaming dari log.",
        "Kapan memakai: sinkronisasi database operasional ke warehouse/lake secara real-time, event sourcing, cache invalidation, dan semua deteksi “sekarang”. Kapan TIDAK: database sumber tidak mengaktifkan log yang cukup (mis. WAL level minimal di Postgres) — prasyarat infrastruktur harus dipenuhi dulu; dan untuk tabel yang berubah 1× sehari, batch tetap lebih murah.",
      ],
      formula: String.raw`\text{event rate} = \frac{\text{perubahan}}{\text{detik}} \quad \Rightarrow \quad \text{partisi Kafka} \geq \left\lceil\frac{\text{event rate}}{\text{throughput per partisi}}\right\rceil`,
      formulaNote: "Perencanaan kapasitas topik CDC. Contoh: tabel transfer berubah 500×/detik pada jam sibuk; satu partisi Kafka sanggup ~2.000 event/detik → butuh minimal 1 partisi, tetapi praktiknya beri 3–6 untuk pertumbuhan + ordering per kunci. Interpretasi: CDC memindahkan beban dari “query database tiap menit” menjadi “throughput Kafka” — kapasitasnya harus direncanakan, bukan diasumsikan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Event Debezium = baris tabel, tinggal dibaca”",
        type: "pitfall",
        body: "Yang benar: event adalah PERUBAHAN, bukan keadaan. Konsumer harus melipat (fold) event berurutan untuk merekonstruksi keadaan — dan harus menangani op=d (delete: `after`=null), out-of-order, serta duplikat (at-least-once). Yang membaca event seperti membaca tabel akan salah hitung saat ada delete atau replay.",
      },
      hints: [
        "💡 Intuisi: `before`/`after` adalah hadiah terbesar Debezium — untuk deteksi fraud, selisih before→after (saldo 10 juta → 0) jauh lebih informatif daripada nilai akhirnya saja. Desain konsumer yang memakai keduanya.",
      ],
      reference: "Event = {before, after, op, ts_ms, source}. Lipat berurutan; tangani delete & duplikat. Snapshot dulu, streaming kemudian.",
    },
    {
      id: "lab-event",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Parser event Debezium & penghitung lag",
      prose: [
        "Waktunya jadi konsumernya. Di bawah ada aliran event Debezium (sintetis, format disederhanakan) dari tabel `transfer`. Tugasmu: tulis parser yang (1) menghitung lag tiap event (ts_keluar − ts_commit), (2) merekonstruksi saldo akhir tiap rekening dengan melipat event berurutan (op c/u/d), (3) menandai event fraud: transfer keluar > Rp5 juta dalam satu event.",
        "Coba: setelah lolos, tambahkan satu event duplikat (id sama) ke aliran dan lihat apa yang terjadi pada saldo — lalu pikirkan: bagaimana konsumer produksi menangani duplikat? (Petunjuk: idempotency key.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `lag(e)`: kembalikan e['ts_keluar'] - e['ts_commit'] (detik)" },
        { id: "t2", text: "Hitung `max_lag` = lag terbesar di aliran" },
        { id: "t3", text: "Lengkapi `lipat(events)`: dict rekening → saldo akhir (c/u pakai after, d hapus rekening)" },
        { id: "t4", text: "Kumpulkan `fraud` = id event dengan op='u' dan after['saldo'] < before['saldo'] - 5000000" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak" },
      ],
      expected: "max lag: 4 detik\nsaldo akhir: {'R001': 2000000, 'R003': 15000000}\nindikasi fraud: ['E004']",
      code: {
        starter: `# Aliran event Debezium (SINTETIS — format disederhanakan)
events = [
    {"id": "E001", "op": "c", "rek": "R001", "before": None, "after": {"saldo": 10000000}, "ts_commit": 100, "ts_keluar": 102},
    {"id": "E002", "op": "c", "rek": "R002", "before": None, "after": {"saldo": 5000000}, "ts_commit": 105, "ts_keluar": 107},
    {"id": "E003", "op": "u", "rek": "R001", "before": {"saldo": 10000000}, "after": {"saldo": 8000000}, "ts_commit": 110, "ts_keluar": 114},
    {"id": "E004", "op": "u", "rek": "R001", "before": {"saldo": 8000000}, "after": {"saldo": 2000000}, "ts_commit": 120, "ts_keluar": 121},
    {"id": "E005", "op": "d", "rek": "R002", "before": {"saldo": 5000000}, "after": None, "ts_commit": 130, "ts_keluar": 133},
    {"id": "E006", "op": "c", "rek": "R003", "before": None, "after": {"saldo": 15000000}, "ts_commit": 140, "ts_keluar": 141},
]

# TULIS KODEMU DI BAWAH INI
def lag(e):
    return

max_lag = 0  # TODO: max(lag(e) for e in events)

def lipat(events):
    return

saldo = {}  # TODO: saldo = lipat(events)

fraud = []  # TODO: id event u dengan penurunan saldo > 5 juta

print(f"max lag: {max_lag} detik")
print(f"saldo akhir: {saldo}")
print(f"indikasi fraud: {fraud}")`,
        lockLines: 10,
        solution: `# Aliran event Debezium (SINTETIS — format disederhanakan)
events = [
    {"id": "E001", "op": "c", "rek": "R001", "before": None, "after": {"saldo": 10000000}, "ts_commit": 100, "ts_keluar": 102},
    {"id": "E002", "op": "c", "rek": "R002", "before": None, "after": {"saldo": 5000000}, "ts_commit": 105, "ts_keluar": 107},
    {"id": "E003", "op": "u", "rek": "R001", "before": {"saldo": 10000000}, "after": {"saldo": 8000000}, "ts_commit": 110, "ts_keluar": 114},
    {"id": "E004", "op": "u", "rek": "R001", "before": {"saldo": 8000000}, "after": {"saldo": 2000000}, "ts_commit": 120, "ts_keluar": 121},
    {"id": "E005", "op": "d", "rek": "R002", "before": {"saldo": 5000000}, "after": None, "ts_commit": 130, "ts_keluar": 133},
    {"id": "E006", "op": "c", "rek": "R003", "before": None, "after": {"saldo": 15000000}, "ts_commit": 140, "ts_keluar": 141},
]

# TULIS KODEMU DI BAWAH INI
def lag(e):
    return e["ts_keluar"] - e["ts_commit"]

max_lag = max(lag(e) for e in events)

def lipat(events):
    s = {}
    for e in events:
        if e["op"] in ("c", "u"):
            s[e["rek"]] = e["after"]["saldo"]
        elif e["op"] == "d":
            s.pop(e["rek"], None)
    return s

saldo = lipat(events)

fraud = [e["id"] for e in events
         if e["op"] == "u" and e["before"]["saldo"] - e["after"]["saldo"] > 5000000]

print(f"max lag: {max_lag} detik")
print(f"saldo akhir: {saldo}")
print(f"indikasi fraud: {fraud}")`,
        checks: [
          { kind: "equal", task: "t2", name: "max_lag", value: 4, tol: 0, label: "`max_lag` harus 4", msg: "Lag tiap event: 2,2,4,1,3,1 → max 4 detik." },
          { kind: "equal", task: "t3", name: "saldo", value: {"R001": 2000000, "R003": 15000000}, tol: 0, label: "Saldo akhir tepat", msg: "R001: 10jt→8jt→2jt; R002 di-delete; R003: 15jt." },
          { kind: "equal", task: "t4", name: "fraud", value: ["E004"], tol: 0, label: "`fraud` = ['E004']", msg: "E004: turun 6 juta (> 5 juta). E003 hanya turun 2 juta." },
          { kind: "stdout_matches", task: "t5", pattern: "max lag: 4 detik", label: "Ringkasan lag tercetak", msg: "Baris pertama: 'max lag: 4 detik'." },
          { kind: "stdout_matches", task: "t5", pattern: "indikasi fraud: \\['E004'\\]", label: "Indikasi fraud tercetak", msg: "Baris ketiga: \"indikasi fraud: ['E004']\"." },
        ],
      },
      reference: "Konsumer CDC: hitung lag, lipat event berurutan (tangani delete), waspadai duplikat.",
    },
    {
      id: "chart-latensi",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca chart latensi vs beban",
      prose: [
        "Chart di bawah membandingkan tiga strategi pengambilan data: batch harian, batch per jam, dan CDC (ilustrasi).",
        "Cara membaca: batang abu = latensi data (berapa lama dari perubahan sampai bisa dipakai) — makin pendek makin baik. Batang oranye = beban pada database sumber — makin pendek makin ringan.",
        "Interpretasi: batch harian punya latensi 24 jam dengan beban full scan setiap malam — murah infrastrukturnya, mahal keterlambatannya (cerita fraud di pembuka). Batch per jam memangkas latensi menjadi 1 jam tetapi bebannya naik (scan inkremental tiap jam mengganggu operasional). CDC mencapai latensi detik DENGAN beban terkecil — karena ia membaca log yang memang sudah ditulis, bukan meng-query tabel. Pelajaran chart ini: CDC bukan sekadar “lebih cepat” — ia mematahkan trade-off lama antara kecepatan dan beban database.",
      ],
      figure: {
        svg: CDC_SVG,
        alt: "Perbandingan: batch harian latensi 24 jam beban full scan; batch per jam latensi 1 jam beban inkremental; CDC latensi detik beban baca log.",
        caption: "Latensi vs beban database: batch harian, batch per jam, CDC (ilustrasi).",
      },
      tasks: [],
      reference: "CDC mematahkan trade-off: latensi detik dengan beban baca log — bukan full scan.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Butuh data segar — strategi apa?",
      prose: [
        "Empat skenario keputusan CDC:",
        "Skenario 1 — Deteksi fraud butuh reaksi < 1 menit. → CDC log-based (Debezium) + streaming. Alasan: satu-satunya pendekatan dengan lag detik tanpa membebani database transaksional.",
        "Skenario 2 — Dashboard penjualan harian untuk manajemen. → Batch harian cukup. Alasan: keputusan bisnisnya harian; CDC hanya menambah kompleksitas tanpa ada aksi yang menunggu.",
        "Skenario 3 — Sinkronisasi katalog produk (berubah beberapa kali sehari) ke search engine. → CDC atau batch per jam — keduanya bisa; pilih berdasar biaya. Alasan: latensi menit masih bisa diterima; jangan bayar kompleksitas real-time untuk kebutuhan near-real-time.",
        "Skenario 4 — Tabel audit yang hanya di-append dan dibaca mingguan. → Batch, bahkan tanpa CDC. Alasan: tidak ada perubahan yang “terlewat” (append-only + dibaca jarang) — polling sederhana sudah tepat.",
        "Aturan praktis 10 detik: data segar untuk apa? → (1) aksi dalam detik/menit? → CDC log-based; (2) keputusan jam/harian? → batch; (3) butuh DELETE & urutan? → log-based, bukan query; (4) database sumber sanggup? → cek WAL/binlog dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memasang Debezium lalu lupa memonitor lag. Connector yang lag-nya tumbuh diam-diam (tidak sanggup mengejar log) menghasilkan “real-time” yang palsu — dashboard terlihat live padahal membaca data 2 jam lalu. Alert lag adalah bagian wajib instalasi CDC.",
      },
      reference: "Pilih berdasar aksi yang menunggu data, bukan berdasar gengsi arsitektur. Monitor lag selalu.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Stok e-commerce: 50.000 SKU, oversell tiap flash sale",
      prose: [
        "Skenario (sintetis, untuk latihan): marketplace dengan 50.000 SKU mengalami oversell setiap flash sale — barang terjual 120 unit padahal stok 100. Investigasi: stok di database order ter-update real-time, tetapi search engine (yang menampilkan “stok tersedia”) di-sync via batch per 15 menit. Dalam 15 menit flash sale, 20 pembeli melihat stok yang sama.",
        "Pertanyaan analisis: (1) Di mana tepatnya latensi merusak? (2) Rancangan CDC apa yang menyelesaikan ini? (3) Apa yang TIDAK diselesaikan CDC di sini?",
        "Pembahasan: (1) Latensi 15 menit antara database order dan search engine — jendela di mana keputusan (tampilkan “beli”) dibuat dari data basi. (2) Debezium membaca WAL tabel stok → event ke Kafka → konsumer meng-update search engine dalam detik; lag < 5 detik membuat jendela oversell menyusut dari 15 menit menjadi hitungan detik. Tambahan: gunakan `before`/`after` untuk validasi (stok tidak boleh negatif — event yang melanggar ditahan). (3) CDC tidak menyelesaikan race condition di database itu sendiri (dua order bersamaan tetap butuh transaksi/constraint di sumber) dan tidak menggantikan idempotency di konsumer — event duplikat yang diproses dua kali tetap bisa mengacaukan hitungan bila konsumer tidak idempoten.",
        "Catatan arsitektur: CDC memindahkan masalah dari “data basi” menjadi “konsumer yang benar” — lipat berurutan, tangani duplikat, validasi bisnis. Kecepatan tanpa kebenaran hanya membuat kesalahan terjadi lebih cepat.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Oversell bukan sekadar masalah teknis — ia janji yang diingkari ke pelanggan (refund, voucher, reputasi). Dalam flash sale, 15 menit data basi bisa berarti ratusan order fiktif. Analis risiko operasional harus mengukur “jendela basi” sebagai risiko, bukan sekadar metrik pipeline.",
      },
      reference: "CDC menyusutkan jendela basi; kebenaran tetap tugas konsumer (urutan, idempoten, validasi).",
    },
    {
      id: "pendalaman-semantik",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Ordering, exactly-once, dan evolusi skema di dunia nyata",
      prose: [
        "Ordering guarantees — janji yang lebih sempit dari dugaan. Kafka HANYA menjamin urutan di dalam SATU partisi. Debezium memanfaatkan ini: key event = primary key tabel, sehingga semua perubahan satu baris selalu masuk partisi yang sama → urutan PER BARIS terjamin. Tetapi urutan ANTAR TABEL tidak dijamin (event tabel order dan tabel payment bisa tiba dalam urutan apa pun), urutan antar partisi tidak dijamin, dan event dari satu transaksi database bisa tersebar di beberapa batch. Desain konsumer senior: JANGAN PERNAH mengasumsikan 'event A selalu datang sebelum event B' lintas tabel — join antar stream butuh windowing dengan toleransi; metadata transaksi Debezium (transaction id, total_order) dipakai untuk mengelompokkan event satu transaksi bila atomicity dibutuhkan.",
        "Exactly-once end-to-end — rantai yang sekuat mata terlemahnya. Komponennya: producer idempotent + transaksional (Debezium/Kafka), stream processor dengan checkpointing dan transactional sink (Flink/Kafka Streams), dan sink yang idempoten. Satu mata rantai at-least-once (mis. sink REST tanpa idempotency key) → SELURUH rantai at-least-once, tak peduli seberapa canggih Kafka-nya. Karena itu urutan kerja praktisi: (1) desain konsumer IDEMPOTEN dulu — murah, selalu benar, menahan duplikat apa pun; (2) bangun exactly-once infra kemudian — mahal dan kompleks, hanya bila nilai bisnisnya (finansial!) membenarkan. Uji senior: kill -9 proses di tengah beban, nyalakan lagi, hitung ulang agregat — hasilnya HARUS identik. Bila tidak, exactly-once-mu ilusi.",
        "Schema evolution — DDL sumber adalah kejadian produksi, bukan teori. ALTER TABLE ADD COLUMN di database operasional → event Debezium berikutnya membawa skema BARU. Dengan Schema Registry (Avro/Protobuf): tetapkan kompatibilitas BACKWARD sebagai default — konsumer baru bisa membaca data lama. Tambah kolom dengan nilai default = backward-compatible (konsumer lama mengabaikan). RENAME kolom = hapus + tambah = BREAKING — konsumer lama crash atau salah baca; rename butuh koordinasi deploy (konsumer dulu, baru DDL) atau dua fase. Praktik tim: uji kompatibilitas skema di CI Schema Registry — DDL yang breaking DITOLAK otomatis sebelum menyentuh produksi. Skema adalah kontrak API; perlakukan seperti kontrak API.",
        "Late & out-of-order — urutan log vs urutan kejadian bisnis. Urutan commit di WAL (processing time) BELUM TENTU urutan kejadian bisnis (event time): transaksi jam 21:05 bisa masuk log jam 21:40 karena batch upstream, jam database skew, atau retry. Stream processor menanganinya dengan watermark (batas keterlambatan yang masih ditoleransi) + jendela waktu (window): event yang terlambat melewati watermark TIDAK dibuang diam-diam — ia ke side output untuk penanganan eksplisit (koreksi, alert). Agregat per jam yang sudah 'ditutup' lalu kedatangan data telat butuh mekanisme revisi (retraction/update) — desain yang mengabaikan ini menghasilkan dashboard yang 'benar kemarin, salah setelah koreksi'.",
        "Backfill & re-snapshot tanpa drama. Kebutuhan nyata: tabel baru ditambahkan ke connector, snapshot awal corrupt, atau perlu re-seed setelah bug konsumer. Cara junior: restart connector full — SEMUA tabel re-snapshot, streaming berhenti, downtime. Cara senior: Debezium incremental snapshot — membaca ulang SATU tabel sambil streaming tabel lain terus berjalan (berbasis watermark, tanpa lock lama). Strategi: snapshot → validasi (count snapshot vs count sumber HARUS cocok) → streaming lanjut. Aturan: tidak ada 'restart full untuk tambah satu tabel' — itu downtime yang direncanakan dengan buruk.",
        "Trade-off latensi vs konsistensi — kapan eventual cukup, kapan tidak. Sinkronisasi KUAT itu mahal: menjamin 'baca setelah tulis sendiri selalu konsisten' butuh penantian/koordinasi yang membunuh latensi detik. Pola transactional outbox menyelesaikannya dengan elegan: aplikasi menulis data bisnis + baris event ke tabel OUTBOX dalam SATU transaksi database (atomic — tidak ada dual-write problem: DB ter-commit tetapi event hilang, atau sebaliknya), lalu Debezium membaca tabel outbox dan menerbitkannya ke Kafka. Kapan eventual cukup: dashboard, rekomendasi, analitik. Kapan butuh kuat: saldo, stok, status order milik user yang baru saja beraksi. Aturan: klasifikasikan per use case — satu arsitektur 'kuat untuk semua' = membayar mahal untuk yang tidak butuh.",
        "Observabilitas CDC — yang membedakan instalasi mainan dari produksi. Dashboard wajib: lag per connector per tabel (bukan cuma rata-rata!), throughput event, dan umur snapshot terakhir. Dead Letter Queue (DLQ): event yang gagal di-deserialisasi (skema tak cocok, data corrupt) JANGAN menghentikan connector — ia ke DLQ dengan alert, pipeline utama terus jalan. Tanpa DLQ, satu baris 'nakal' di database sumber menghentikan seluruh replikasi — dan kamu mengetahuinya dari komplain user, bukan dari monitoring. Retensi DLQ + playbook 'cara memutar ulang DLQ setelah perbaikan' adalah bagian instalasi, bukan tambahan.",
        "Tombstone, compaction, dan retensi. DELETE di sumber → event tombstone (key + null) → log compaction Kafka menghapus jejak key itu dari topik. Topik CDC BUKAN arsip abadi: retensi panjang = storage mahal + replay raksasa saat konsumer baru join. Arsitektur senior: topik CDC retensi pendek-menengah (jam–hari, cukup untuk operasional + replay darurat), arsip jangka panjang ke data lake via sink connector. Konsumer baru yang butuh histori PENUH tidak replay 6 bulan topik — ia baca snapshot lake + lanjutkan dari offset kini. Retensi adalah keputusan biaya, bukan default.",
      ],
      formula: String.raw`\text{lag}_{\text{ujung-ke-ujung}} = \text{lag}_{\text{CDC}} + \text{lag}_{\text{proses}} + \text{lag}_{\text{sink}}`,
      formulaNote: "Dekomposisi lag untuk atribusi bottleneck. Contoh: lag ujung-ke-ujung 45 detik = CDC 3 dtk + stream processor 40 dtk + sink 2 dtk → masalahnya di PROCESSOR (bukan connector!) — scale atau tuning windowing di sana. Tanpa dekomposisi, tim menuduh Debezium dan mengutak-atik yang salah. Ukur per stage, perbaiki yang dominan.",
      tasks: [],
      note: {
        title: "Intuisi: CDC memindahkan kompleksitas, bukan menghilangkannya",
        body: "Heuristik yang menenangkan sekaligus mewaspadakan: batch menaruh kompleksitas di query (mahal, lambat, tetapi sederhana dipahami); CDC menaruhnya di konsumer (cepat, murah di sumber, tetapi konsumer harus dewasa: idempoten, sadar urutan, toleran skema). Bau masalah yang harus membuatmu berhenti: 'event pasti urut' (tidak — hanya per partisi), 'sekali proses pasti cukup' (tidak — at-least-once itu kontrak), 'tambah kolom kan gampang' (di DDL ya, di kontrak skema belum tentu), dan 'lag 3 detik berarti sehat' (lag ujung-ke-ujung yang diukur, bukan lag connector saja). Ritual sehatnya: idempoten dulu sebelum exactly-once; monitor lag PER STAGE bukan cuma ujung; uji kill -9 sebelum klaim ketahanan; DDL breaking ditolak di CI; replay adalah skenario yang dilatih, bukan musibah yang ditakuti. CDC yang dewasa bukan yang tidak pernah gagal — melainkan yang gagal dengan cara yang sudah diperhitungkan. Dan satu heuristik terakhir: bila arsitektur CDC-mu tidak bisa dijelaskan ke engineer baru dalam 10 menit tanpa diagram, ia terlalu kompleks — sederhanakan. Sistem real-time yang hanya dipahami satu orang adalah single point of failure yang berkedok kecanggihan.",
      },
      reference: "Urutan = per partisi saja. Exactly-once = rantai; idempoten dulu. Skema = kontrak (backward default). Event telat → side output. Outbox untuk atomic. Retensi = keputusan biaya.",
    },
    {
      id: "ingestion-api",
      eyebrow: "Langkah 10 · Konsep",
      title: "Ingestion dari API & File — Si Penanya yang Sopan vs Si Pendengar yang Setia",
      prose: [
        "Definisi: ingestion adalah gerbang masuk platform data — memindahkan data dari sistem sumber (API, database, file) ke tempat kita bisa mengolahnya (warehouse, lake, stream). Lesson ini sejauh ini dalam tentang CDC — satu dari empat keluarga ingestion. Tiga saudaranya: API pull (kita yang bertanya), webhook push (kita yang diberitahu), dan file drop (data diantar sebagai file ke landing zone). Memilih keluarga yang salah = membayar latensi atau kompleksitas yang tidak perlu — sama seperti memilih CDC untuk laporan bulanan.",
        "Kepribadiannya: si Penanya yang Sopan (REST polling) — ia menelepon API tiap 15 menit: “ada data baru?”. Sopan, sederhana, jadwal di tangan kita; tetapi di antara dua panggilan data selalu basi, dan tiap panggilan membayar biaya berupa kuota rate limit. Si Pendengar yang Setia (webhook) — ia tidak menelepon; ia menunggu ditelepon. Sumber mengirim event ke endpoint kita saat sesuatu terjadi — latensi detik tanpa polling; tetapi endpoint kita harus selalu hidup, idempoten (webhook yang timeout DIKIRIM ULANG oleh sumber!), dan memverifikasi signature — kalau tidak, siapa pun bisa berpura-pura menjadi sumber.",
        "Pagination — seni membaca buku yang halamannya terus ditulis ulang. Offset pagination (page=1,2,3…) goyang: bila baris baru masuk di tengah sync, semua offset bergeser — record terlewat diam-diam atau terbaca dua kali. Cursor pagination (after=token) stabil: token menunjuk posisi logis, bukan nomor baris. Dan satu kebenaran pahit: API yang baik SENGAJA memberi overlap antar-halaman (halaman 1 berakhir di record 100, halaman 2 mulai di record 99) agar tidak ada yang terlewat saat data bergerak. Artinya duplikat antar-halaman adalah fitur, bukan bug — tugasmu mendeduplikasinya dengan idempotency key.",
        "Idempotency key adalah kunci bisnis yang stabil dan unik — id transaksi, bukan nomor urut buatanmu. Prinsipnya: proses dua kali, hasil sekali. Implementasinya di landing: simpan dulu semua record mentah apa adanya (lapisan bronze), lalu dedupe berdasar key sebelum transform — “pertama menang” atau “terbaru menang”, putuskan secara sadar dan dokumentasikan. Tanpa ini, retry yang sah (timeout lalu kirim ulang) berubah menjadi double-counting di dashboard.",
        "Rate limit adalah kontrak, bukan saran. API menjawab 429 (Too Many Requests) bila kamu melewati kuota — dan retry membabi-buta justru memperparah keadaan (retry storm: makin ditolak, makin ngotot). Pola yang benar: exponential backoff + jitter (tunggu 1 detik, 2 detik, 4 detik… plus acak agar tidak serempak dengan orang lain), hormati header Retry-After bila ada, dan JANGAN pernah melewati halaman yang gagal — ulangi halaman yang sama setelah backoff, atau datamu berlubang diam-diam.",
        "Backfill dari API — mengisi masa lalu. API publik sering membatasi histori (30/90 hari) dan menerapkan kuota laju khusus untuk backfill. Rencanakan sejak awal: (1) mulai backfill SEBELUM butuh — jendela histori menyusut setiap hari; (2) simpan response mentah per halaman — bisa diproses ulang tanpa memanggil API lagi; (3) catat watermark (sampai tanggal mana sudah terisi) agar backfill bisa dilanjutkan, bukan diulang dari nol.",
        "File drop — si kurir tua yang masih diandalkan. Bank, partner, dan sistem legacy mengirim CSV/Parquet ke SFTP atau bucket S3 tiap malam. Aturannya: (1) penamaan file deterministik (mis. data=2026-10-19/part-*.parquet) agar partisi jelas; (2) file dengan nama sama = data sama → lewati (idempoten gratis); (3) validasi sebelum load — jumlah baris, checksum, skema — karena file setengah-tertulis adalah racun (tulis dulu sebagai .tmp, lalu rename atomik); (4) arsipkan file mentah — ia adalah “replay log” termurahmu saat pipeline downstream rusak.",
      ],
      formula: String.raw`\text{request per sync} = \left\lceil \frac{N}{\text{page size}} \right\rceil \times (1 + r_{\text{retry}})`,
      formulaNote: "N = total record per sync; r_retry = fraksi request yang kena 429/timeout dan harus diulang. Contoh: 12.000 record dengan page size 100 → 120 halaman; retry 10% → ±132 request per sync. Sync tiap 15 menit = 528 request/jam (aman di kuota 1.000/jam); sync tiap menit = 7.920/jam (mati kena 429). Interpretasi: interval polling adalah tuas antara kesegaran data dan kuota — hitung bebannya SEBELUM menjanjikan “real-time” ke bisnis.",
      tasks: [
        { id: "t1", text: "Lengkapi loop pagination: panggil `api_get(page, 4)` sampai `next_page` None; tampung semua record ke `mentah`" },
        { id: "t2", text: "Tangani 429: saat `RuntimeError`, panggil `tunggu()`, naikkan `retry_count`, dan ULANGI halaman yang sama (jangan dilewati)" },
        { id: "t3", text: "Dedupe `mentah` berdasar idempotency key `id` (pertama menang) → `bersih`" },
        { id: "t4", text: "Hitung `total` = jumlah `amount` dari record unik, dan `id_unik` = daftar id terurut" },
        { id: "t5", text: "Jalankan dan pastikan ringkasan tercetak: 15 mentah, 12 unik, Rp3.150.000, retry 1x" },
      ],
      expected: "record mentah: 15\nrecord unik: 12\ntotal amount: Rp3,150,000\nretry karena 429: 1x",
      code: {
        starter: `# ── Mock API sumber (JANGAN DIUBAH) ──────────────────────────────
API_DB = [{"id": f"TXN-{i:03d}", "amount": 100000 + i * 25000} for i in range(1, 13)]

request_count = 0
RATE_LIMIT = 3  # API menolak request ke-4+ dalam satu jendela

def api_get(page, page_size=4):
    """GET /transfers?page=N — halaman overlap 1 record (duplikat antar-halaman).
    Kembalikan (batch, next_page). Lempar RuntimeError('429') bila limit terlampaui."""
    global request_count
    request_count += 1
    if request_count > RATE_LIMIT:
        raise RuntimeError("429 Too Many Requests: tunggu jendela berikutnya")
    start = (page - 1) * (page_size - 1)
    batch = API_DB[start:start + page_size]
    lanjut = page + 1 if start + page_size < len(API_DB) else None
    return batch, lanjut

def tunggu():
    """Simulasi backoff: jendela rate limit di-reset, request bisa dilanjut."""
    global request_count
    request_count = 0

# ── TULIS KODEMU DI BAWAH INI ────────────────────────────────────
mentah = []       # TODO t1: semua record dari semua halaman (duplikat OK)
page = 1

# TODO t2: ulangi halaman yang gagal karena 429 (panggil tunggu(), JANGAN lewati halaman)

bersih = []       # TODO t3: dedupe berdasar idempotency key "id" (pertama menang)

total = 0         # TODO t4: jumlahkan amount dari record unik
retry_count = 0   # TODO t2: hitung berapa kali kena 429

print(f"record mentah: {len(mentah)}")
print(f"record unik: {len(bersih)}")
print(f"total amount: Rp{total:,}")
print(f"retry karena 429: {retry_count}x")`,
        lockLines: 22,
        solution: `# ── Mock API sumber (JANGAN DIUBAH) ──────────────────────────────
API_DB = [{"id": f"TXN-{i:03d}", "amount": 100000 + i * 25000} for i in range(1, 13)]

request_count = 0
RATE_LIMIT = 3  # API menolak request ke-4+ dalam satu jendela

def api_get(page, page_size=4):
    """GET /transfers?page=N — halaman overlap 1 record (duplikat antar-halaman).
    Kembalikan (batch, next_page). Lempar RuntimeError('429') bila limit terlampaui."""
    global request_count
    request_count += 1
    if request_count > RATE_LIMIT:
        raise RuntimeError("429 Too Many Requests: tunggu jendela berikutnya")
    start = (page - 1) * (page_size - 1)
    batch = API_DB[start:start + page_size]
    lanjut = page + 1 if start + page_size < len(API_DB) else None
    return batch, lanjut

def tunggu():
    """Simulasi backoff: jendela rate limit di-reset, request bisa dilanjut."""
    global request_count
    request_count = 0

# ── SOLUSI ───────────────────────────────────────────────────────
mentah = []
page = 1
retry_count = 0
while page is not None:
    try:
        batch, page = api_get(page, 4)
        mentah.extend(batch)
    except RuntimeError:
        retry_count += 1
        tunggu()  # backoff: reset jendela, ulangi halaman yang SAMA

terlihat = {}
for r in mentah:
    terlihat.setdefault(r["id"], r)  # idempotency key: pertama menang
bersih = list(terlihat.values())
total = sum(r["amount"] for r in bersih)
n_mentah = len(mentah)
id_unik = sorted(r["id"] for r in bersih)

print(f"record mentah: {n_mentah}")
print(f"record unik: {len(bersih)}")
print(f"total amount: Rp{total:,}")
print(f"retry karena 429: {retry_count}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_mentah", value: 15, tol: 0, label: "15 record mentah (4+4+4+3)", msg: "Halaman overlap 1 record: 4+4+4+3 = 15 record mentah. Loop sampai next_page None." },
          { kind: "equal", task: "t2", name: "retry_count", value: 1, tol: 0, label: "1x retry karena 429", msg: "Request ke-4 kena rate limit (limit 3). Panggil tunggu() lalu ulangi halaman yang sama — jangan dilewati." },
          { kind: "equal", task: "t3", name: "id_unik", value: ["TXN-001","TXN-002","TXN-003","TXN-004","TXN-005","TXN-006","TXN-007","TXN-008","TXN-009","TXN-010","TXN-011","TXN-012"], tol: 0, label: "12 id unik setelah dedupe", msg: "Dedupe berdasar id: TXN-004, TXN-007, TXN-010 muncul dua kali (overlap antar-halaman)." },
          { kind: "equal", task: "t4", name: "total", value: 3150000, tol: 0, label: "Total Rp3.150.000", msg: "Jumlahkan amount dari 12 record unik (125rb + 150rb + … + 400rb)." },
          { kind: "stdout_matches", task: "t5", pattern: "record unik: 12", label: "Ringkasan tercetak", msg: "Baris 'record unik: 12' harus tercetak di output." },
        ],
      },
      note: {
        title: "🚨 Mitos: “offset pagination itu sederhana dan cukup”",
        type: "pitfall",
        body: "Yang benar: offset aman hanya bila tabel sumber beku selama sync — yang hampir tidak pernah terjadi di produksi. Di tabel yang terus ditulis, baris baru menyisip di depan → semua offset sesudahnya bergeser → satu record terlewat diam-diam ATAU terbaca dua kali. Minta cursor pagination ke pemilik API; bila tidak ada, dedupe berdasar idempotency key adalah jaring pengaman wajib — bukan opsional. Dan ingat: “tidak ada duplikat” adalah asumsi, bukan fakta; ukur (hitung duplikat per sync) sebelum percaya.",
      },
      hints: [
        "💡 Intuisi: polling, webhook, CDC, dan file menjawab pertanyaan “bagaimana data sampai ke kita” — bukan “seberapa cepat”. Pilih berdasar siapa yang mengontrol tempo: kita (polling/file), sumber (webhook), atau log database (CDC).",
        "💡 Intuisi: simpan SELALU response mentah sebelum parsing (lapisan bronze). Parsing bisa diperbaiki dan diulang; API call yang sudah lewat tidak bisa diulang gratis.",
      ],
      reference: "API: polling (kita bertanya, latensi = interval) vs webhook (diberitahu; butuh endpoint idempoten + verifikasi signature). Pagination pakai cursor; duplikat antar-halaman = fitur → dedupe via idempotency key. 429 → backoff, ulangi halaman yang sama.",
    },
    {
      id: "connector-ingestion",
      eyebrow: "Langkah 11 · Konsep",
      title: "Connector & Tooling Ingestion — Beli, Sewa, atau Bangun Sendiri?",
      prose: [
        "Definisi: connector ingestion (Airbyte, Fivetran, Stitch, Meltano, dlt) adalah software yang sudah tahu cara “berbicara” ke ratusan sumber: ia mengurus auth/OAuth, pagination, incremental sync, normalisasi JSON nested menjadi tabel, retry, dan monitoring — hal yang sama yang baru saja kamu tulis manual di lab, tetapi untuk 300+ API sekaligus.",
        "Yang sebenarnya kamu beli ada lima: (1) incremental sync yang benar — connector menyimpan state cursor per stream, jadi sync kedua hanya mengambil yang baru, bukan full refresh tiap jam; (2) normalisasi skema — JSON bertingkat dipecah menjadi tabel relasional yang bisa di-query; (3) penanganan error & alerting bawaan (429, schema drift, kredensial kedaluwarsa); (4) kredensial terpusat dengan rotasi; (5) pemeliharaan terhadap API yang berubah — tim vendor yang memperbarui connector saat penyedia API mengubah responsnya, bukan kamu yang lembur.",
        "Kapan membangun sendiri: sumbernya 1–3, API-nya stabil dan berdokumentasi baik, DAN timmu punya kapasitas memeliharanya selamanya — connector buatan sendiri adalah janji pemeliharaan abadi. Kapan membeli/menyewa: banyak sumber, API sering berubah, tim kecil, atau butuh cepat. Pola modernnya ELT: connector hanya me-LOAD mentah ke warehouse (bronze), transformasi dikerjakan dbt — separation of concerns yang membuat debug jauh lebih mudah.",
        "Jebakan biaya — harga per baris. Model bisnis yang umum: bayar per MAR (monthly active rows) atau per credit per juta baris. Satu tabel 50 juta baris yang di-full-refresh tiap jam “karena gampang” = 50 juta × 24 × 30 = 36 MILIAR baris per bulan — tagihan yang membuat CFO pingsan. Aturannya: selalu pilih incremental sync, sesuaikan frekuensi dengan kebutuhan aksi (ingat aturan 10 detik di langkah 7: tidak ada aksi real-time → tidak perlu sync per menit), dan pasang alert biaya SEBELUM tagihan datang.",
        "Jebakan skema yang berubah diam-diam. API menambah field baru, mengubah tipe string menjadi number, atau me-rename tanpa pengumuman. Connector punya dua mode: “tambah kolom otomatis” (nyaman, tetapi tabelmu tumbuh liar dan tipe bisa salah tebak) atau “gagal saat skema berubah” (aman, tetapi sync berhenti). Tidak ada jawaban universal — yang berbahaya adalah tidak tahu kamu memakai mode yang mana. Praktik senior: mode gagal-di-staging, tambah-otomatis-di-prod DENGAN alert, plus uji kompatibilitas sebelum promosi.",
        "Jebakan yang sama seperti lab: connector umumnya at-least-once — event bisa terkirim dua kali karena retry internal atau restart. Jangan percaya “connector pasti tepat sekali”; dedupe/merge berdasar key di warehouse (upsert/merge by idempotency key) tetap menjadi tanggung jawabmu. Connector memindahkan data; kebenaran tetap milikmu.",
        "Satu pengecualian: logika bisnis yang aneh. API dengan autentikasi eksotis, rate limit berbeda per endpoint, atau kebutuhan transformasi SEBELUM load karena regulasi (PII harus di-mask sebelum meninggalkan VPC) — di sinilah kode sendiri (atau framework ringan seperti dlt) menang, karena connector generik tidak bisa menebak keanehan bisnismu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “pakai connector managed = tidak perlu paham ingestion”",
        type: "pitfall",
        body: "Yang benar: connector menyembunyikan kompleksitas, bukan menghilangkannya. Saat sync gagal jam 3 pagi — schema drift, kuota API habis, kredensial kedaluwarsa — yang debug tetap kamu, dan debug tanpa paham pagination/incremental/idempotency = menebak dalam gelap. Lab di langkah sebelumnya bukan latihan usang: ia adalah model mental yang kamu pakai setiap kali connector bertingkah. Beli kecepatannya, kuasai prinsipnya.",
      },
      hints: [
        "💡 Intuisi: connector adalah “sewa keahlian” — kamu menyewa tim yang sudah pernah berdarah-darah dengan 300 API aneh. Sewalah untuk hal generik; bangun sendiri hanya untuk hal yang benar-benar unik bagi bisnismu.",
      ],
      reference: "Connector = beli incremental sync + normalisasi + error handling + maintenance API. ELT: load mentah, transform di dbt. Waspadai: harga per baris, schema drift diam-diam, duplikat at-least-once. Paham prinsipnya tetap wajib.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "CDC menangkap perubahan saat terjadi; tiga pendekatan: query-based (berisik, bisa terlewat), trigger-based (pajak tulis), log-based (lengkap, tidak mengganggu).",
        "Debezium membaca transaction log (WAL/binlog) → event {before, after, op, ts_ms} ke Kafka; snapshot awal lalu streaming.",
        "Lag CDC = t_event − t_commit; sehat = detik; lag yang tumbuh = connector tidak sanggup mengejar log.",
        "Konsumer melipat event berurutan, menangani delete (after=null) dan duplikat (idempoten) — event bukan tabel.",
        "Pilih CDC bila ada aksi dalam detik/menit; batch cukup bila keputusan harian; monitor lag selalu.",
      ],
      quiz: [
        {
          q: "Kenapa log-based CDC (Debezium) tidak membebani database operasional seperti query polling?",
          options: [
            { text: "Ia membaca transaction log yang memang ditulis database untuk recovery — bukan meng-query tabel", why: "Benar: WAL/binlog adalah efek samping yang sudah ada; Debezium hanya membaca salinannya. Polling justru menambah query.", correct: true },
            { text: "Karena Debezium berjalan di server yang sama dengan database", why: "Salah: lokasi bukan alasannya — alasannya sumber datanya (log vs query tabel)." },
            { text: "Karena Kafka menanggung bebannya", why: "Salah: Kafka menampung event, tetapi “tidak membebani DB” berasal dari cara membaca (log), bukan dari Kafka." },
            { text: "Karena CDC hanya membaca di malam hari", why: "Salah: itu batch. CDC membaca log secara kontinu — justru itu keunggulannya." },
          ],
        },
        {
          q: "Event Debezium: op='d', before={saldo: 5jt}, after=null. Interpretasi yang benar?",
          options: [
            { text: "Baris dihapus — konsumer harus menghapus rekening dari state lipatannya", why: "Benar: op=d (delete) dengan after=null. Konsumer yang mengabaikan delete akan menyimpan hantu selamanya.", correct: true },
            { text: "Saldo menjadi nol", why: "Salah: null ≠ 0. Dihapus berarti baris tidak ada — beda dengan saldo nol yang masih tercatat." },
            { text: "Event rusak — after seharusnya tidak null", why: "Salah: after=null adalah kontrak resmi untuk delete, bukan kerusakan." },
            { text: "Abaikan saja, delete tidak penting", why: "Salah: mengabaikan delete = state konsumer menyimpang permanen dari sumber. Ini bug klasik konsumer CDC." },
          ],
        },
        {
          q: "Lag CDC tumbuh dari 3 detik menjadi 40 menit dalam 2 jam. Diagnosis paling mungkin?",
          options: [
            { text: "Connector tidak sanggup mengejar laju log — perlu scale consumer atau investigasi bottleneck", why: "Benar: lag yang tumbuh monoton = produksi event > konsumsi. Bukan sekadar “lambat”, melainkan tertinggal yang memburuk.", correct: true },
            { text: "Normal — lag berfluktuasi", why: "Salah: fluktuasi wajar dalam detik; tren naik 2 jam ke 40 menit adalah kegagalan, bukan fluktuasi." },
            { text: "Database sumber mati", why: "Salah: bila sumber mati tidak ada event baru — lag tidak tumbuh karena tidak ada t_commit baru yang tertinggal." },
            { text: "Kafka kepenuhan — hapus topiknya", why: "Salah: menghapus topik menghancurkan data dan tidak menyelesaikan kecepatan konsumsi. Diagnosis dulu, bukan destruksi." },
          ],
        },
        {
          q: "Konsumer menerima event yang sama dua kali (at-least-once). Penanganan yang benar?",
          options: [
            { text: "Buat konsumer idempoten — memproses event yang sama dua kali menghasilkan hasil yang sama (pakai id event sebagai kunci)", why: "Benar: duplikat adalah kontrak at-least-once, bukan bug. Idempotency key (id event) membuat proses ulang aman.", correct: true },
            { text: "Minta Debezium mengirim exactly-once", why: "Salah: exactly-once end-to-end butuh dukungan di semua lapisan termasuk sink — tidak bisa “diminta” begitu saja." },
            { text: "Abaikan duplikat — jarang terjadi", why: "Salah: “jarang” × volume besar = sering. Dan satu duplikat pada agregat finansial bisa berarti selisih nyata." },
            { text: "Restart connector setiap jam", why: "Salah: restart justru sering MENYEBABKAN replay/duplikat, bukan menghilangkannya." },
          ],
        },
        {
          q: "Kapan batch harian LEBIH tepat daripada CDC?",
          options: [
            { text: "Ketika keputusan bisnisnya harian/mingguan dan tidak ada aksi real-time yang menunggu data", why: "Benar: arsitektur mengikuti kebutuhan aksi. Real-time tanpa aksi yang menunggu = kompleksitas tanpa nilai.", correct: true },
            { text: "Tidak pernah — CDC selalu lebih baik", why: "Salah: “lebih baik” tanpa konteks kebutuhan adalah gengsi arsitektur, bukan engineering." },
            { text: "Ketika database-nya kecil", why: "Salah: ukuran database bukan penentunya — urgensi aksinyalah yang menentukan." },
            { text: "Ketika tim belum bisa Kafka", why: "Salah: keterbatasan skill adalah kendala sementara yang diatasi dengan belajar, bukan dasar keputusan arsitektur permanen." },
          ],
        },
        {
          q: "Konsumer men-join stream tabel order dan payment dengan asumsi event order selalu tiba lebih dulu. Apa risikonya?",
          options: [
            { text: "Urutan antar-tabel tidak dijamin — join bisa salah atau kehilangan pasangan", why: "Benar: garansi urutan hanya per partisi; event dua tabel bisa tiba dalam urutan apa pun. Join butuh windowing + toleransi.", correct: true },
            { text: "Aman karena satu connector Debezium", why: "Salah: satu connector tidak menciptakan urutan global antar topik/partisi.", correct: false },
            { text: "Aman bila keduanya dari satu transaksi database", why: "Salah: event satu transaksi pun bisa tersebar di beberapa batch — butuh metadata transaksi untuk regrouping.", correct: false },
            { text: "Kafka menjamin urutan global semua event", why: "Salah: Kafka TIDAK pernah menjamin urutan global — hanya per partisi.", correct: false },
          ],
        },
        {
          q: "Kolom `nama` di-rename menjadi `nama_lengkap` di database sumber (Avro + Schema Registry). Dampak ke konsumer lama?",
          options: [
            { text: "Breaking change — rename = hapus + tambah; konsumer lama bisa crash/salah baca", why: "Benar: rename tidak backward-compatible — butuh koordinasi deploy atau migrasi dua fase.", correct: true },
            { text: "Otomatis aman karena Schema Registry", why: "Salah: registry MENDETEKSI ketidakcocokan, bukan menyulapnya jadi cocok.", correct: false },
            { text: "Hanya warning di log", why: "Salah: deserialisasi Avro dengan skema tak cocok = error, bukan warning.", correct: false },
            { text: "Debezium menolak DDL rename", why: "Salah: Debezium meneruskan perubahan skema — penolakannya harus dikonfigurasi di CI registry.", correct: false },
          ],
        },
      ],
    },
  ],
};
