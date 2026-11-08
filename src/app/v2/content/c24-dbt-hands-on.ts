import type { V2Lesson } from "../lib/types";

// ── Figure: waktu build full refresh vs incremental per hari ──────────────
const BUILD_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Diagram batang waktu build dbt: full refresh vs incremental selama 7 hari">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="216" x2="500" y2="216"/>
<line x1="60" y1="176" x2="500" y2="176"/><line x1="60" y1="136" x2="500" y2="136"/>
<line x1="60" y1="96" x2="500" y2="96"/><line x1="60" y1="56" x2="500" y2="56"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="219">0</text><text x="54" y="179">15</text><text x="54" y="139">30</text>
<text x="54" y="99">45</text><text x="54" y="59">60 mnt</text>
</g>
<g font-size="10" font-family="var(--font-ui)">
<rect x="76" y="88" width="20" height="128" fill="var(--c2)" opacity="0.85"/>
<rect x="100" y="88" width="20" height="128" fill="var(--c1)" opacity="0.9"/>
<text x="98" y="232" text-anchor="middle" fill="var(--text)">H1</text>
<rect x="132" y="84" width="20" height="132" fill="var(--c2)" opacity="0.85"/>
<rect x="156" y="197" width="20" height="19" fill="var(--c1)" opacity="0.9"/>
<text x="154" y="232" text-anchor="middle" fill="var(--text)">H2</text>
<rect x="188" y="81" width="20" height="135" fill="var(--c2)" opacity="0.85"/>
<rect x="212" y="194" width="20" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="210" y="232" text-anchor="middle" fill="var(--text)">H3</text>
<rect x="244" y="77" width="20" height="139" fill="var(--c2)" opacity="0.85"/>
<rect x="268" y="197" width="20" height="19" fill="var(--c1)" opacity="0.9"/>
<text x="266" y="232" text-anchor="middle" fill="var(--text)">H4</text>
<rect x="300" y="74" width="20" height="142" fill="var(--c2)" opacity="0.85"/>
<rect x="324" y="190" width="20" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="322" y="232" text-anchor="middle" fill="var(--text)">H5</text>
<rect x="356" y="71" width="20" height="145" fill="var(--c2)" opacity="0.85"/>
<rect x="380" y="194" width="20" height="22" fill="var(--c1)" opacity="0.9"/>
<text x="378" y="232" text-anchor="middle" fill="var(--text)">H6</text>
<rect x="412" y="67" width="20" height="149" fill="var(--c2)" opacity="0.85"/>
<rect x="436" y="187" width="20" height="29" fill="var(--c1)" opacity="0.9"/>
<text x="434" y="232" text-anchor="middle" fill="var(--text)">H7</text>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="110" y="244" width="12" height="12" fill="var(--c2)" opacity="0.85"/>
<text x="128" y="254" fill="var(--text)">Full refresh (tumbuh tiap hari)</text>
<rect x="300" y="244" width="12" height="12" fill="var(--c1)" opacity="0.9"/>
<text x="318" y="254" fill="var(--text)">Incremental (stabil)</text>
</g>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text-muted)">
<text x="60" y="30">waktu build harian model 50 jt baris (ilustrasi)</text>
</g>
</svg>`;

export const c24: V2Lesson = {
  slug: "c24-dbt-hands-on",
  track: "SQL",
  module: "Lanjutan",
  title: "dbt Hands-On: Model, Test, dan Dokumentasi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Slack 23:47: “kok angka dashboard beda sama laporan keuangan?”",
      prose: [
        "Malam itu tiga analis menatap tiga angka berbeda untuk “pendapatan Maret”: dashboard menampilkan 4,82 miliar, laporan keuangan 4,61 miliar, dan spreadsheet direktur 4,95 miliar. Ketiganya “benar” — menurut definisinya masing-masing. Analis A menghitung gross (sebelum retur), analis B menghitung net (setelah retur), analis C menghitung recognized (setelah jendela refund 14 hari). Tidak ada yang salah ketik; yang tidak ada adalah KESEPAKATAN.",
        "Twist-nya: masalahnya bukan query — melainkan tidak ada SATU PUN tempat di mana definisi “pendapatan” ditulis, diuji, dan diberi versi. Setiap analis punya SQL-nya sendiri di laptopnya sendiri. Ketika definisi berubah (jendela refund diperpanjang 7 → 14 hari), tidak ada yang tahu query mana saja yang harus diperbarui — jadi tidak ada yang diperbarui.",
        "Solusinya bernama dbt (data build tool): SQL yang diperlakukan seperti software — model berversi di Git, dependensi eksplisit lewat ref(), test otomatis seperti unit test, dan dokumentasi yang ter-generate dari kode. Riset lowongan Oktober 2026: dbt diminta 4 dari 10 listing SQL — dan 100% listing Analytics Engineer remote. Ini pembeda jalur global. Lesson ini hands-on: kamu membangun dua model berantai (staging → mart) plus test-nya, memakai sqlite3 di browser — pola pikirnya identik dengan dbt produksi, hanya mesinnya yang mini.",
      ],
      tasks: [],
      note: {
        title: "Kenapa dbt = pembeda karier",
        type: "risk",
        body: "“Bisa SQL” ada di setiap CV analis. “Membangun pipeline dbt dengan test” ada di sedikit CV — dan 100% listing Analytics Engineer remote memintanya. dbt adalah bukti kamu berpikir seperti engineer: versioned, tested, documented. Tiga kata itu menaikkan kelas lamaranmu.",
      },
      reference: "Tiga angka “benar” = tidak ada definisi bersama. dbt = SQL sebagai software.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita tiga angka. (2) Peta ini. (3) Konsep: model — Si Pohon Keluarga. (4) Konsep: test — Kontrak Data. (5) Konsep: incremental — Jangan Masak Ulang Seluruh Dapur. (6) Lab 1: staging → mart + 3 test ala dbt. (7) Lab 2: incremental load anti-duplikat. (8) Chart: full refresh vs incremental. (9) Peta keputusan: lima skenario dbt. (10) Mini-case: pipeline warisan 40 model. (11) Checkpoint: kuis + rangkuman.",
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan apa itu model dbt dan menulis dependensi dengan ref(); (2) memasang test unique, not_null, dan accepted_values pada model; (3) membedakan kapan memakai incremental vs full refresh; (4) menulis dokumentasi model (schema.yml) yang berguna; (5) membaca lineage: model mana yang rusak bila sebuah sumber berubah.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: SELECT ... FROM ... WHERE untuk memfilter; CREATE TABLE AS SELECT (CTAS) untuk menyimpan hasil query menjadi tabel; agregasi SUM/COUNT dengan GROUP BY; JOIN menggabungkan tabel. Itu saja — dbt adalah organisasi dari hal-hal yang sudah kamu kuasai.",
        "Rutenya: cerita → peta → tiga konsep → dua lab → chart → peta keputusan → mini-case → kuis. Estimasi 65 menit; tiap lab ±12 menit. Bingkai jujur: dbt asli berjalan di warehouse (BigQuery/Snowflake) via CLI; di sini kamu mensimulasikan model + test-nya dengan sqlite3 di browser — logikanya sama, skalanya mini.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap dbt sebagai “Git untuk SQL” — model = file berversi, ref() = import antar file, test = unit test, docs = README yang ter-generate otomatis. Jika kamu paham kenapa kode butuh Git + test, kamu sudah paham kenapa SQL butuh dbt.",
      ],
      reference: "Tujuan: model + ref() + test + incremental + docs. dbt = SQL sebagai software.",
    },
    {
      id: "konsep-model",
      eyebrow: "Langkah 3 · Konsep",
      title: "Model — Si Pohon Keluarga",
      prose: [
        "Definisi: model dbt adalah SATU file SQL berisi satu SELECT yang menghasilkan satu tabel/view — dengan nama, pemilik, dan silsilah yang jelas. Rantai tipikal: staging (membersihkan sumber mentah: filter status, buang NULL) → intermediate (gabung & hitung) → mart (tabel final siap-dashboard, satu per domain: mart_pendapatan, mart_pelanggan).",
        "Kepribadiannya: Model adalah anggota keluarga yang tahu silsilahnya — tiap model bisa menjawab “siapa orang tuaku?” (sumber) dan “siapa anakku?” (model yang memakaiku). SQL tradisional adalah anak yatim piatu: query di laptop siapa pun tidak tahu ia dipakai dashboard apa. dbt mencatat silsilahnya lewat ref().",
        "ref() — jantungnya dbt: alih-alih menulis FROM pesanan_mentah (nama tabel fisik yang bisa berubah), model menulis FROM {{ ref('stg_pesanan') }} — “beri aku OUTPUT dari model stg_pesanan, di mana pun ia berada”. Keuntungannya tiga: (1) dbt membangun URUTAN eksekusi otomatis (staging dulu, baru mart) — DAG, directed acyclic graph; (2) ganti nama tabel fisik? Cukup ubah satu model, semua ref() ikut; (3) lineage: dbt tahu persis model mana yang rusak bila stg_pesanan berubah.",
        "Contoh rantai (angka lab 1): pesanan_mentah (10 baris: ada status 'batal'/'retur', satu tanggal NULL) → stg_pesanan (7 baris: hanya 'selesai' + tanggal terisi) → mart_pendapatan_harian (4 baris: satu per tanggal, dengan omzet). Tiga model, tiga tanggung jawab, satu silsilah. Kapan menambah model baru vs menumpuk logika di satu model? Aturan: satu model = satu tanggung jawab yang bisa dijelaskan dalam satu kalimat. “Membersihkan pesanan mentah” = satu model. “Membersihkan pesanan DAN menghitung omzet DAN menggabung pelanggan” = tiga model yang disembunyikan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “dbt cuma untuk tim besar dengan data raksasa”",
        type: "pitfall",
        body: "Yang benar: dbt paling berharga justru saat TIM KECIL — karena di tim kecil, satu analis merangkap tiga peran dan “definisi di kepala satu orang” adalah single point of failure. dbt memindahkan definisi dari kepala ke kode yang berversi. Ukuran data tidak relevan; ukuran RISIKO kebingungan yang relevan.",
      },
      hints: [
        "💡 Intuisi silsilah: sebelum menulis model, gambar panahnya di kertas: mentah → staging → mart. Jika panahnya melingkar (A butuh B, B butuh A), desainmu salah — DAG tidak boleh punya siklus. Kertas 30 detik menghemat 3 jam debugging.",
      ],
      reference: "Satu model = satu SELECT berversi + satu tanggung jawab. ref() = silsilah + urutan otomatis.",
    },
    {
      id: "konsep-test",
      eyebrow: "Langkah 4 · Konsep",
      title: "Test — Kontrak Data",
      prose: [
        "Definisi: test dbt adalah pernyataan tentang data yang HARUS benar, yang dijalankan otomatis tiap build — seperti unit test untuk kode. Empat test bawaan (generic tests) yang menutup 90% kebutuhan: unique (tiap nilai muncul sekali — untuk primary key), not_null (tidak boleh kosong), accepted_values (hanya boleh dari daftar: 'selesai','batal','retur'), relationships (tiap kunci di tabel ini ada di tabel referensi — integrity antar tabel).",
        "Kepribadiannya: Test adalah satpam yang tidak tidur — ia memeriksa setiap truk (batch data) yang masuk gudang (model), dan menolak yang mencurigakan SEBELUM sampai ke dashboard direksi. Tanpa satpam, kamu tahu ada maling (angka aneh) hanya setelah barang hilang (keputusan salah diambil).",
        "Ditulis di mana? Di schema.yml — file dokumentasi + test di samping model: models: - name: stg_pesanan, columns: - name: order_id, tests: [unique, not_null], - name: status, tests: [{accepted_values: {values: ['selesai','batal','retur']}}]. Satu file, dua fungsi: manusia membaca dokumentasi, mesin menjalankan test. Inilah “dokumentasi yang tidak basi” — karena bila test-nya gagal, build-nya gagal, dan dokumentasinya tidak mungkin berbohong.",
        "Kapan test dipasang — dan di model mana? Aturan praktis: test unique/not_null di STAGING (setelah cleaning — di data mentah ia pasti gagal karena data mentah memang kotor, dan test yang selalu gagal = test yang diabaikan); test relationships di MART/INTERMEDIATE (setelah join); test accepted_values di kolom status/kategori di mana pun ia pertama “ditetapkan”. Test yang selalu merah sama bahayanya dengan tidak ada test: orang berhenti melihatnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Test dipasang nanti kalau pipeline sudah stabil”",
        type: "pitfall",
        body: "Yang benar: “nanti” tidak pernah tiba — dan pipeline tanpa test tidak pernah stabil, ia hanya BELUM KETAHUAN rusaknya. Test termurah (unique + not_null di staging) menangkap 70% insiden data dengan 5 baris YAML. Pasang dulu yang murah, sempurnakan belakangan.",
      },
      hints: [
        "💡 Intuisi kontrak: anggap tiap test sebagai janji tertulis ke konsumen dashboard — “order_id di tabel ini unik, saya jamin”. Janji yang diuji mesin tiap hari jauh lebih meyakinkan daripada janji di slide presentasi.",
      ],
      reference: "unique + not_null + accepted_values + relationships = 90% kebutuhan. Pasang di staging, bukan di mentah.",
    },
    {
      id: "konsep-incremental",
      eyebrow: "Langkah 5 · Konsep",
      title: "Incremental — Jangan Masak Ulang Seluruh Dapur",
      prose: [
        "Definisi: model incremental hanya memproses data BARU (atau berubah) sejak build terakhir, lalu menggabungkannya ke tabel yang sudah ada — vs full refresh yang membangun ulang SEMUANYA dari nol. Syaratnya dua: unique_key (kolom identitas untuk mengenali “sudah ada”) dan filter “hanya yang baru” (biasanya tanggal > maksimum yang sudah dimuat — watermark dari lesson C23).",
        "Kepribadiannya: Incremental adalah koki yang hanya memasak porsi TAMU BARU — bukan memasak ulang 200 porsi dari nol setiap ada 3 tamu datang. Full refresh adalah koki yang panik: tiap ada tamu baru, ia buang semua masakan dan mulai lagi. Tamunya senang (makanan selalu segar), tetapi dapurnya boros dan lelah.",
        "Contoh langkah-demi-langkah (angka lab 2): mart_event berisi event 1–3. Batch datang: event 3 (duplikat — data lama terkirim ulang), 4, 5. Full refresh: bangun ulang 5 baris dari 5 baris — murah di sini, mahal di 50 juta baris. Incremental: kenali event 3 sudah ada (unique_key = event_id) → hanya insert 4 dan 5. Hasil: 5 baris, 0 duplikat, biaya 2/5 dari full. Tanpa unique_key? Event 3 masuk dua kali — duplikat senyap yang merusak semua agregat di atasnya.",
        "Kapan WAJIB full refresh meski mahal? Tiga kasus: (1) logika model BERUBAH retroaktif (definisi “pendapatan” berubah — data lama harus dihitung ulang dengan definisi baru); (2) backfill historis (sumber lama baru tersedia); (3) tabel kecil (di bawah ~1 juta baris, full refresh sering LEBIH MURAH dari overhead incremental). Aturan: incremental untuk besar & stabil; full untuk kecil atau saat definisi berubah.",
      ],
      formula: String.raw`\text{cost}_{full} = n \times c \quad\text{vs}\quad \text{cost}_{incr} = \Delta n \times c + c_{overhead}`,
      formulaNote: "Simbol: n = total baris, Δn = baris baru, c = biaya per baris, c_overhead = biaya merge/dedup. Interpretasi: full tumbuh mengikuti n (50 juta baris = 50 menit tiap hari, dan TUMBUH); incremental mengikuti Δn (3 juta baris baru = ~4 menit, STABIL). Contoh angka chart: hari ke-7, full = 52 menit vs incremental = 9 menit — dan selisihnya melebar tiap hari karena n tumbuh sementara Δn relatif tetap.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Incremental selalu lebih murah”",
        type: "pitfall",
        body: "Yang benar: incremental punya overhead (merge, cek duplikat, watermark). Untuk tabel kecil (< 1 juta baris), overhead bisa LEBIH MAHAL dari full refresh yang sederhana. Dan incremental tanpa unique_key bukan penghematan — melainkan pabrik duplikat. Hitung, jangan asumsikan.",
      },
      hints: [
        "💡 Intuisi koki: tanyakan “berapa porsi baru vs berapa porsi total?” Rasio kecil (3 dari 50 juta) = incremental. Rasio besar atau definisi berubah = full refresh. Koki yang baik tahu kapan memasak ulang — bukan yang selalu hemat, melainkan yang tepat.",
      ],
      reference: "Incremental = Δn + unique_key + watermark. Full refresh untuk definisi berubah & tabel kecil.",
    },
    {
      id: "lab-model",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Bangun staging → mart + 3 test ala dbt",
      prose: [
        "Waktunya praktik. Tabel pesanan_mentah (10 baris) sudah tersedia — kotor seperti aslinya: ada status 'batal' dan 'retur', satu tanggal NULL. Tugasmu mensimulasikan dua model dbt berantai: (1) stg_pesanan — hanya status 'selesai' dan tanggal terisi; (2) mart_pendapatan_harian — agregat per tanggal dari staging; (3) jalankan 3 test ala dbt: unique order_id, not_null tanggal, accepted_values status.",
        "Tiga tugas, satu baris cetak. Di dbt asli, test-test ini ditulis di schema.yml dan dijalankan mesin; di sini kamu menulis query validasinya sendiri — logikanya identik.",
        "Coba: setelah lolos, jalankan test unique di tabel MENTAH (bukan staging) — apa hasilnya? (Di data ini mentah pun unik; tetapi coba bayangkan duplikat masuk — di model mana duplikat harus TERTANGKAP? Jawaban: staging, sebelum mengalir ke mart.)",
      ],
      tasks: [
        { id: "t1", text: "Buat `stg_pesanan`: SELECT * dari mentah WHERE status='selesai' AND tanggal IS NOT NULL → 7 baris" },
        { id: "t2", text: "Buat `mart_pendapatan_harian`: tanggal, SUM(qty*harga) AS omzet, COUNT(*) AS n_order dari staging GROUP BY tanggal → 4 baris" },
        { id: "t3", text: "Jalankan 3 test di staging: unique order_id, not_null tanggal, accepted_values status — hitung `lolos` (0–3)" },
      ],
      expected: "staging: 7 baris | mart: 4 baris | test lolos: 3/3",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pesanan_mentah(order_id TEXT, tanggal TEXT, pelanggan TEXT, produk TEXT, qty INTEGER, harga INTEGER, status TEXT)\")\ndata = [(\"O-001\",\"2026-03-01\",\"Andi\",\"Kopi A\",2,18000,\"selesai\"),(\"O-002\",\"2026-03-01\",\"Budi\",\"Teh C\",1,12000,\"selesai\"),(\"O-003\",\"2026-03-02\",\"Citra\",\"Kopi B\",3,15000,\"batal\"),(\"O-004\",\"2026-03-02\",\"Dewi\",\"Roti D\",5,10000,\"selesai\"),(\"O-005\",None,\"Eko\",\"Kopi A\",1,18000,\"selesai\"),(\"O-006\",\"2026-03-03\",\"Fitri\",\"Teh C\",2,12000,\"selesai\"),(\"O-007\",\"2026-03-03\",\"Gilang\",\"Kopi A\",4,18000,\"retur\"),(\"O-008\",\"2026-03-04\",\"Hesti\",\"Roti E\",2,22000,\"selesai\"),(\"O-009\",\"2026-03-04\",\"Andi\",\"Kopi B\",1,15000,\"selesai\"),(\"O-010\",\"2026-03-04\",\"Budi\",\"Teh D\",2,14000,\"selesai\")]\ncur.executemany(\"INSERT INTO pesanan_mentah VALUES (?,?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 model staging (bersihkan)\ncur.execute(\"CREATE TABLE stg_pesanan AS SELECT ...\")\n\n# t2: model mart dari staging\ncur.execute(\"CREATE TABLE mart_pendapatan_harian AS SELECT ...\")\n\n# t3: tiga test ala dbt (0 = lolos)\ntest_unique =\ntest_notnull =\ntest_values =\nlolos =\nn_stg = cur.execute(\"SELECT COUNT(*) FROM stg_pesanan\").fetchone()[0]\nn_mart = cur.execute(\"SELECT COUNT(*) FROM mart_pendapatan_harian\").fetchone()[0]\n\nprint(f\"staging: {n_stg} baris | mart: {n_mart} baris | test lolos: {lolos}/3\")\n",
        lockLines: 7,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE pesanan_mentah(order_id TEXT, tanggal TEXT, pelanggan TEXT, produk TEXT, qty INTEGER, harga INTEGER, status TEXT)\")\ndata = [(\"O-001\",\"2026-03-01\",\"Andi\",\"Kopi A\",2,18000,\"selesai\"),(\"O-002\",\"2026-03-01\",\"Budi\",\"Teh C\",1,12000,\"selesai\"),(\"O-003\",\"2026-03-02\",\"Citra\",\"Kopi B\",3,15000,\"batal\"),(\"O-004\",\"2026-03-02\",\"Dewi\",\"Roti D\",5,10000,\"selesai\"),(\"O-005\",None,\"Eko\",\"Kopi A\",1,18000,\"selesai\"),(\"O-006\",\"2026-03-03\",\"Fitri\",\"Teh C\",2,12000,\"selesai\"),(\"O-007\",\"2026-03-03\",\"Gilang\",\"Kopi A\",4,18000,\"retur\"),(\"O-008\",\"2026-03-04\",\"Hesti\",\"Roti E\",2,22000,\"selesai\"),(\"O-009\",\"2026-03-04\",\"Andi\",\"Kopi B\",1,15000,\"selesai\"),(\"O-010\",\"2026-03-04\",\"Budi\",\"Teh D\",2,14000,\"selesai\")]\ncur.executemany(\"INSERT INTO pesanan_mentah VALUES (?,?,?,?,?,?,?)\", data)\n\n# TULIS KODEMU: t1 model staging (bersihkan)\ncur.execute(\"CREATE TABLE stg_pesanan AS SELECT * FROM pesanan_mentah WHERE status='selesai' AND tanggal IS NOT NULL\")\n\n# t2: model mart dari staging\ncur.execute(\"CREATE TABLE mart_pendapatan_harian AS SELECT tanggal, SUM(qty*harga) AS omzet, COUNT(*) AS n_order FROM stg_pesanan GROUP BY tanggal\")\n\n# t3: tiga test ala dbt (0 = lolos)\ntest_unique = cur.execute(\"SELECT COUNT(*) - COUNT(DISTINCT order_id) FROM stg_pesanan\").fetchone()[0]\ntest_notnull = cur.execute(\"SELECT COUNT(*) FROM stg_pesanan WHERE tanggal IS NULL\").fetchone()[0]\ntest_values = cur.execute(\"SELECT COUNT(*) FROM stg_pesanan WHERE status NOT IN ('selesai','batal','retur')\").fetchone()[0]\nlolos = (test_unique == 0) + (test_notnull == 0) + (test_values == 0)\nn_stg = cur.execute(\"SELECT COUNT(*) FROM stg_pesanan\").fetchone()[0]\nn_mart = cur.execute(\"SELECT COUNT(*) FROM mart_pendapatan_harian\").fetchone()[0]\n\nprint(f\"staging: {n_stg} baris | mart: {n_mart} baris | test lolos: {lolos}/3\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "staging 7 baris", msg: "10 mentah − 1 batal − 1 retur − 1 tanggal NULL = 7.", name: "n_stg", value: 7, tol: 0 },
          { kind: "equal", task: "t2", label: "mart 4 baris", msg: "Satu baris per tanggal: 01, 02, 03, 04 Maret.", name: "n_mart", value: 4, tol: 0 },
          { kind: "equal", task: "t3", label: "3/3 test lolos", msg: "unique + not_null + accepted_values — kontrak staging terpenuhi.", name: "lolos", value: 3, tol: 0 },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Tiga angka: staging, mart, test.", pattern: "test lolos: 3/3" },
        ],
      },
      reference: "Staging membersihkan, mart menyajikan, test menjaga. 7 → 4 baris, 3/3 lolos.",
    },
    {
      id: "lab-incremental",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Incremental load: tolak duplikat, terima yang baru",
      prose: [
        "Lab kedua mensimulasikan model incremental dbt: tabel mart_event sudah berisi event 1–3. Batch baru datang berisi event 3 (duplikat — data lama terkirim ulang, hal yang lumrah), 4, dan 5. Tugasmu: (1) insert HANYA id yang belum ada (unique_key = event_id); (2) buktikan tidak ada duplikat dan totalnya 5.",
        "Di dbt asli ini ditulis sebagai model incremental dengan unique_key='event_id' dan filter is_incremental(); di sini kamu menulis logikanya manual — sekali paham manualnya, sintaks dbt-nya tinggal tempelan.",
        "Coba: setelah lolos, hapus filter “belum ada” dan jalankan ulang insert — lihat duplikat muncul. Itulah pabrik duplikat dari incremental tanpa unique_key (Langkah 5).",
      ],
      tasks: [
        { id: "t1", text: "Insert dari `batch` hanya event_id yang BELUM ada di `mart_event` → `n_baru` = 2" },
        { id: "t2", text: "Hitung `dup` (COUNT − COUNT DISTINCT event_id) = 0 dan `n_total` = 5" },
      ],
      expected: "baris baru: 2 | total: 5 | duplikat: 0",
      code: {
        starter: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE mart_event(event_id INTEGER PRIMARY KEY, tanggal TEXT, nilai REAL)\")\ndata = [(1,\"2026-04-01\",100.0),(2,\"2026-04-02\",150.0),(3,\"2026-04-03\",120.0)]\ncur.executemany(\"INSERT INTO mart_event VALUES (?,?,?)\", data)\nbatch = [(3,\"2026-04-03\",120.0),(4,\"2026-04-04\",180.0),(5,\"2026-04-05\",200.0)]\n\n# TULIS KODEMU: t1 incremental — hanya id baru (unique_key = event_id)\nada =\nbaru =\ncur.executemany(\"INSERT INTO mart_event VALUES (?,?,?)\", baru)\nn_baru =\n\n# t2: verifikasi\nn_total =\ndup =\n\nprint(f\"baris baru: {n_baru} | total: {n_total} | duplikat: {dup}\")\n",
        lockLines: 8,
        solution: "# Data JANGAN UBAH.\nimport sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE mart_event(event_id INTEGER PRIMARY KEY, tanggal TEXT, nilai REAL)\")\ndata = [(1,\"2026-04-01\",100.0),(2,\"2026-04-02\",150.0),(3,\"2026-04-03\",120.0)]\ncur.executemany(\"INSERT INTO mart_event VALUES (?,?,?)\", data)\nbatch = [(3,\"2026-04-03\",120.0),(4,\"2026-04-04\",180.0),(5,\"2026-04-05\",200.0)]\n\n# TULIS KODEMU: t1 incremental — hanya id baru (unique_key = event_id)\nada = {r[0] for r in cur.execute(\"SELECT event_id FROM mart_event\").fetchall()}\nbaru = [r for r in batch if r[0] not in ada]\ncur.executemany(\"INSERT INTO mart_event VALUES (?,?,?)\", baru)\nn_baru = len(baru)\n\n# t2: verifikasi\nn_total = cur.execute(\"SELECT COUNT(*) FROM mart_event\").fetchone()[0]\ndup = cur.execute(\"SELECT COUNT(*) - COUNT(DISTINCT event_id) FROM mart_event\").fetchone()[0]\n\nprint(f\"baris baru: {n_baru} | total: {n_total} | duplikat: {dup}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "n_baru = 2", msg: "Event 3 ditolak (sudah ada); 4 dan 5 diterima.", name: "n_baru", value: 2, tol: 0 },
          { kind: "equal", task: "t2", label: "n_total = 5", msg: "3 lama + 2 baru.", name: "n_total", value: 5, tol: 0 },
          { kind: "equal", task: "t2", label: "duplikat = 0", msg: "unique_key bekerja — tidak ada id ganda.", name: "dup", value: 0, tol: 0 },
          { kind: "stdout_matches", task: "t2", label: "laporan tercetak", msg: "Tiga angka: baru, total, duplikat.", pattern: "duplikat: 0" },
        ],
      },
      reference: "Incremental = kenali yang sudah ada via unique_key. Tanpa itu = pabrik duplikat.",
    },
    {
      id: "chart-build",
      eyebrow: "Langkah 8 · Chart",
      title: "Melihat penghematan: dua koki, tujuh hari",
      prose: [
        "Chart di bawah membandingkan waktu build harian model 50 juta baris selama 7 hari: batang gelap = full refresh (membangun ulang semuanya), batang terang = incremental (hanya Δn).",
        "Cara membaca: sumbu Y = menit; tiap kelompok = satu hari; dua batang per hari.",
        "Interpretasi: full refresh TUMBUH tiap hari (42 → 52 menit) mengikuti n yang membesar — ia bom waktu biaya. Incremental STABIL (~6–9 menit) mengikuti Δn — setelah hari pertama, ia datar. Pelajaran chart: pada hari ke-7 selisihnya 43 menit per hari = 5 jam per minggu = 21 jam per bulan waktu compute yang dibayar sia-sia. Inilah visual dari rumus Langkah 5 — dan alasan tim data memakai incremental bukan karena “canggih”, melainkan karena tagihannya.",
      ],
      figure: {
        svg: BUILD_SVG,
        alt: "Diagram batang 7 hari: full refresh tumbuh 42 ke 52 menit; incremental stabil 6-9 menit.",
        caption: "Full refresh (gelap) tumbuh mengikuti n; incremental (terang) stabil mengikuti Δn. Selisih melebar tiap hari.",
      },
      tasks: [],
      reference: "Full = membayar n tiap hari. Incremental = membayar Δn. Selisihnya melebar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Lima skenario dbt",
      prose: [
        "Skenario 1 — Tiga analis punya tiga definisi “pendapatan”. → Buat SATU model mart_pendapatan sebagai sumber kebenaran, berversi di Git, dengan test. Alasan: definisi di kode > definisi di kepala.",
        "Skenario 2 — Model mart 50 juta baris di-build tiap jam, makin lambat. → Ubah ke incremental dengan unique_key + watermark. Alasan: membayar Δn, bukan n (chart Langkah 8).",
        "Skenario 3 — Definisi “pendapatan” berubah (jendela refund 7 → 14 hari). → Full refresh SATU KALI untuk backfill + catat perubahan di Git. Alasan: data lama harus dihitung ulang dengan definisi baru — incremental tidak bisa memperbaiki masa lalu.",
        "Skenario 4 — Dashboard angka aneh tiap Senin pagi. → Pasang test unique/not_null di staging + relationships setelah join; jalankan tiap build. Alasan: satpam yang memeriksa tiap batch sebelum sampai ke direksi.",
        "Skenario 5 — Analis baru bergabung, butuh 2 minggu memahami pipeline. → Dokumentasi schema.yml + lineage dbt docs. Alasan: silsilah yang ter-generate dari kode tidak basi — tidak seperti wiki yang ditulis sekali lalu dilupakan.",
        "Aturan praktis 10 detik: definisi di kode (bukan kepala); test di staging; besar & stabil = incremental; definisi berubah = full refresh sekali; silsilah selalu terdokumentasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menumpuk SEMUA logika dalam satu model raksasa “biar gampang”. Model 800 baris tidak bisa di-test per bagian, tidak bisa di-incremental-kan per bagian, dan tidak ada yang berani menyentuhnya — ia menjadi monolit yang ditakuti. Satu model = satu kalimat tanggung jawab.",
      },
      reference: "Definisi di kode; test di staging; incremental untuk besar; full untuk definisi berubah.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Pipeline warisan: 40 model, nol test, angka beda-beda",
      prose: [
        "Skenario (sintetis, angka konkret): kamu mewarisi pipeline dbt 40 model tanpa satu pun test. Gejalanya: dashboard “pendapatan” beda 230 juta dari laporan keuangan; full refresh harian model terbesar (48 juta baris) memakan 55 menit dan gagal 2× seminggu karena timeout; analis baru butuh 3 minggu untuk berani menyentuh apa pun.",
        "Pertanyaan analisis: (1) Urutan perbaikan apa dalam 2 minggu pertama? (2) Model mana yang di-incremental-kan dulu dan kenapa? (3) Test apa yang dipasang pertama?",
        "Pembahasan: (1) Urutan: MINGGU 1 — pasang test unique + not_null di 3 model staging tersibuk (menangkap kotoran sumber; murah, 1 hari kerja) + tetapkan SATU model mart_pendapatan sebagai sumber kebenaran (akhiri era tiga definisi). MINGGU 2 — ubah model 48 juta baris ke incremental (55 menit → ~8 menit; kegagalan timeout hilang) + generate dbt docs untuk 10 model teratas (onboarding 3 minggu → 3 hari). (2) Model TERBESAR & paling sering di-build dulu — penghematan terbesar per usaha; model kecil (< 1 juta baris) biarkan full refresh (overhead incremental tidak sepadan). (3) unique + not_null di staging (70% insiden), lalu relationships setelah join, lalu accepted_values di kolom status. Prinsip: test termurah yang menangkap insiden terbanyak, dulu.",
        "Kaitan ke karier: “mewarisi 40 model tanpa test dan menstabilkannya dalam 2 minggu” adalah narasi yang menjual — ia menunjukkan prioritas (risiko dulu), bukan sekadar tool.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pipeline tanpa test = risiko keputusan buta yang terakumulasi: tiap dashboard di atasnya adalah klaim tanpa bukti. Test dbt adalah kontrol risiko yang murah — seperti rekonsiliasi di akuntansi: tidak ada yang memuji saat ia ada, semua panik saat ia tidak ada.",
      },
      reference: "Warisan: test murah dulu, satu sumber kebenaran, incremental untuk yang terbesar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Model dbt = satu SELECT berversi dengan satu tanggung jawab; ref() membangun silsilah + urutan eksekusi otomatis (DAG).",
        "Test = kontrak data: unique, not_null, accepted_values, relationships — dipasang di staging, dijalankan tiap build.",
        "Incremental memproses Δn (butuh unique_key + watermark); full refresh untuk tabel kecil atau saat definisi berubah retroaktif.",
        "schema.yml = dokumentasi yang tidak basi: manusia membaca, mesin menjalankan test-nya.",
        "Satu model = satu kalimat tanggung jawab; monolit 800 baris = bom waktu yang ditakuti semua orang.",
      ],
      next: { label: "C25 — Dialek Warehouse Cloud: BigQuery, Snowflake, dan Biaya Query", href: "/v2/learn/c25-dialek-warehouse-cloud" },
      quiz: [
        {
          q: "Apa fungsi {{ ref('stg_pesanan') }} dalam model dbt?",
          options: [
            { text: "Mendeklarasikan dependensi: “beri aku output model stg_pesanan” — dbt mengurutkan build otomatis dan mencatat lineage", why: "Benar: tiga manfaat Langkah 3 — urutan otomatis (DAG), tahan ganti nama tabel, lineage untuk debugging.", correct: true },
            { text: "Mempercepat query dengan caching hasil stg_pesanan", why: "Salah: ref() soal DEPENDENSI dan urutan, bukan caching. Kecepatan adalah urusan incremental/materialisasi." },
            { text: "Mengimpor fungsi Python ke dalam SQL", why: "Salah: ref() murni SQL-ke-SQL — ia merujuk model lain, bukan kode Python." },
            { text: "Membuat tabel stg_pesanan jika belum ada", why: "Salah: ref() tidak membuat apa pun — ia MERUJUK ke model yang didefinisikan terpisah dan di-build sesuai urutan DAG." },
          ],
        },
        {
          q: "Di model mana test unique + not_null sebaiknya dipasang?",
          options: [
            { text: "Di staging, setelah cleaning — di data mentah ia pasti gagal dan test yang selalu merah akan diabaikan", why: "Benar: Langkah 4 — test di titik di mana data SEHARUSNYA sudah bersih; kegagalan di sana = sinyal nyata.", correct: true },
            { text: "Di data mentah — semakin dini semakin baik", why: "Salah: data mentah memang kotor; test di sana gagal permanen dan melatih tim mengabaikan test." },
            { text: "Hanya di mart final — cukup satu titik pemeriksaan", why: "Salah: di mart, akar masalah sudah jauh — debugging menelusuri 5 model ke belakang. Test berlapis menemukan lebih cepat." },
            { text: "Tidak perlu test untuk kolom yang “jelas benar”", why: "Salah: “jelas benar” adalah asumsi yang paling sering salah — test ada justru untuk asumsi." },
          ],
        },
        {
          q: "Model incremental dijalankan ulang TANPA unique_key. Apa yang terjadi?",
          options: [
            { text: "Duplikat: baris lama yang terkirim ulang masuk lagi — pabrik duplikat senyap", why: "Benar: persis lab 2 — event 3 akan ganda tanpa filter unique_key. Agregat di atasnya ikut rusak.", correct: true },
            { text: "Tidak terjadi apa-apa — incremental otomatis mengenali duplikat", why: "Salah: tidak ada sihir — tanpa unique_key, mesin tidak tahu mana yang “sudah ada”." },
            { text: "Build gagal dengan error", why: "Salah: inilah liciknya — ia BERHASIL tanpa error, tetapi datanya salah. Gagal diam-diam > gagal berisik." },
            { text: "Data lama terhapus dan diganti yang baru", why: "Salah: itu perilaku full refresh (atau delete+insert), bukan incremental append." },
          ],
        },
        {
          q: "Definisi “pendapatan” berubah (jendela refund 7 → 14 hari). Strategi build yang benar?",
          options: [
            { text: "Full refresh SATU KALI untuk backfill dengan definisi baru + catat di Git", why: "Benar: data lama harus dihitung ulang — incremental tidak bisa memperbaiki masa lalu. Satu kali, terdokumentasi.", correct: true },
            { text: "Tetap incremental — definisi baru berlaku mulai hari ini", why: "Salah: histori tetap memakai definisi lama → tren patah di tengah (angka sebelum/sesudah tidak sebanding)." },
            { text: "Buat model baru dengan nama berbeda, biarkan yang lama", why: "Salah: dua definisi hidup berdampingan = kembali ke era tiga angka. Satu kebenaran, berversi." },
            { text: "Ubah definisinya diam-diam tanpa backfill", why: "Salah: perubahan tak tercatat = tidak bisa diaudit; tren historis menjadi kebohongan." },
          ],
        },
        {
          q: "Kolom status hanya boleh bernilai 'selesai', 'batal', 'retur'. Test dbt yang tepat?",
          options: [
            { text: "accepted_values dengan daftar ketiga nilai itu", why: "Benar: test ini memang dirancang untuk domain nilai kategorikal — 'selesaii' (typo) akan tertangkap.", correct: true },
            { text: "unique — karena tiap status harus unik", why: "Salah: unique berarti tiap NILAI muncul sekali — status justru HARUS berulang (banyak pesanan 'selesai')." },
            { text: "not_null — cukup memastikan terisi", why: "Salah: not_null tidak menangkap 'selesaii' atau 'PENDING' — terisi belum tentu sah." },
            { text: "relationships — karena status merujuk tabel lain", why: "Salah: relationships untuk foreign key antar tabel; untuk daftar nilai tetap, accepted_values lebih tepat." },
          ],
        },
        {
          q: "Manfaat utama schema.yml + dbt docs bagi tim?",
          options: [
            { text: "Dokumentasi yang ter-generate dari kode + lineage: analis baru paham pipeline dalam hitungan hari, bukan minggu", why: "Benar: silsilah dari ref() tidak bisa basi — ia dibaca dari kode yang sama yang dijalankan.", correct: true },
            { text: "Mempercepat eksekusi query", why: "Salah: dokumentasi tidak menyentuh performa — ia menyentuh PEMAHAMAN." },
            { text: "Menggantikan kebutuhan test", why: "Salah: docs menjelaskan, test memverifikasi — dua fungsi berbeda, keduanya perlu." },
            { text: "Wajib agar dbt bisa berjalan", why: "Salah: dbt berjalan tanpa docs; docs adalah investasi keterbacaan, bukan prasyarat teknis." },
          ],
        },
      ],
    },
  ],
};
