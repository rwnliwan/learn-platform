import type { V2Lesson } from "../lib/types";

// Penjualan harian 30 hari vs MA7: agregat bulanan terlihat sehat, tren turun.
const TREND_SVG = `<svg viewBox="0 0 520 260" role="img" aria-label="Garis penjualan harian berfluktuasi dengan spike promo hari ke-20; garis MA7 menurun dari 109 ke 87.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="40" y1="20" x2="500" y2="20"/><line x1="40" y1="70" x2="500" y2="70"/><line x1="40" y1="120" x2="500" y2="120"/><line x1="40" y1="170" x2="500" y2="170"/><line x1="40" y1="220" x2="500" y2="220"/>
</g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="34" y="24" text-anchor="end">280</text><text x="34" y="74" text-anchor="end">210</text><text x="34" y="124" text-anchor="end">140</text><text x="34" y="174" text-anchor="end">70</text><text x="34" y="224" text-anchor="end">0</text>
<text x="40" y="244">1</text><text x="180" y="244">10</text><text x="330" y="244">20</text><text x="480" y="244">30</text><text x="270" y="258" text-anchor="middle" fill="var(--text-muted)">hari ke-</text>
</g>
<polyline points="40,196 55,150 70,152 85,200 100,196 115,193 130,146 145,192 160,190 175,187 190,141 205,184 220,181 235,180 250,135 265,176 280,172 295,172 310,40 325,168 340,165 355,122 370,162 385,158 400,155 415,112 430,150 445,147 460,144 475,106 490,141" fill="none" stroke="var(--c2)" stroke-width="1.5" opacity="0.7"/>
<polyline points="130,176 145,175 160,174 175,173 190,172 205,171 220,170 235,169 250,168 265,166 280,164 295,150 310,149 325,148 340,147 355,146 370,145 385,144 400,143 415,142 430,141 445,140 460,139 475,138 490,137" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="310" cy="40" r="4" fill="var(--c4)"/>
<text x="322" y="36" font-size="11" fill="var(--text)" font-family="var(--font-ui)">promo 271,1</text>
<text x="490" y="130" font-size="11" fill="var(--c1)" font-family="var(--font-ui)" text-anchor="end" font-weight="600">MA7: 109 → 87</text>
<text x="120" y="60" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">harian</text>
<line x1="40" y1="104" x2="500" y2="104" stroke="var(--text-muted)" stroke-dasharray="5,4" stroke-width="1"/>
<text x="495" y="98" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="end">rata-rata bulanan 101,3</text>
</svg>`;

export const biz3: V2Lesson = {
  slug: "biz3-sql",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI3 — SQL Analitik untuk BI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Naik 9,2% yang sebenarnya turun",
      prose: [
        "Senin pagi, dashboard menampilkan \u201CPenjualan naik 9,2% WoW\u201D. Tim marketing selebrasi. Sore harinya CFO bertanya satu kalimat: \u201Ctrennya ke mana?\u201D Analis membuka moving average 7 hari: 109 → 87 dalam sebulan. Turun 20%.",
        "Keduanya benar secara matematis. WoW membandingkan dua titik (hari ke-23 vs ke-30). MA7 menghaluskan noise harian dan menunjukkan arah. Rata-rata bulanan 101,3 terlihat sehat — karena satu hari promo (271,1) mengangkat seluruh bulan.",
        "Twist-nya: angka yang paling sering tampil di dashboard (WoW, rata-rata bulanan) adalah angka yang paling mudah menipu. Angka yang jujur — moving average, median berjalan — butuh window function, dan itulah yang jarang ditulis.",
        "Di lesson ini kamu akan bisa: (1) memakai window function (ROW_NUMBER, LAG, AVG OVER) untuk tren dan perbandingan; (2) membangun agregasi bertingkat dengan CTE; (3) memverifikasi logika SQL dengan Python; (4) memilih kapan window vs GROUP BY.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menulis SQL analitik yang benar secara logika maupun makna bisnisnya.",
        "(1) Memakai window function untuk agregat tanpa menghancurkan granularitas baris (moving average, WoW); (2) Menyusun CTE bertingkat yang bisa dibaca manusia;",
        "(3) Membangun matriks retensi kohort dan menjelaskan kenapa retensi tidak boleh dibaca per bulan kalender;",
        "(4) Mendeteksi kapan 'naik 9,2%' sebenarnya turun — jebakan perbandingan yang salah basis.",
      ],
      tasks: [],
    },

    {
      id: "window",
      eyebrow: "Langkah 3 · Window function",
      title: "Window function: agregat tanpa menghancurkan baris",
      prose: [
        "GROUP BY menggulung baris menjadi ringkasan — detailnya hilang. Window function menghitung agregat sambil mempertahankan tiap baris: tiap hari tetap ada, tapi sekarang tiap baris membawa MA7-nya, ranking-nya, selisihnya vs minggu lalu.",
        "Tiga serangkai yang menyelesaikan 80% kebutuhan BI: `LAG/LEAD` (intip baris tetangga — untuk WoW, MoM), `SUM/AVG OVER` (running total, moving average), `ROW_NUMBER/RANK` (peringkat, top-N per grup, dedup).",
        "Kepribadian: window function adalah \u201Csi kaca pembesar\u201D — ia tidak merangkum data menjadi satu angka, ia menempelkan konteks ke tiap baris sehingga polanya terlihat.",
        "💡 Intuisi kunci: `OVER (ORDER BY tgl ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)` dibaca sebagai \u201Cuntuk tiap baris, lihat 6 baris sebelumnya plus dirinya sendiri\u201D. Frame (bingkai baris) inilah yang membuat moving average mungkin. Tanpa frame eksplisit, default-nya bisa mengikutsertakan baris masa depan — trenmu bocor.",
      ],
      formula: String.raw`MA_7(t) = \frac{1}{7}\sum_{i=0}^{6} x_{t-i} \qquad g_{WoW}(t) = \frac{x_t - x_{t-7}}{x_{t-7}}`,
      formulaNote:
        "MA_7(t) = rata-rata 7 hari terakhir sampai hari t — menghaluskan noise harian. g_WoW(t) = pertumbuhan week-on-week: selisih penjualan hari t vs 7 hari lalu, dibagi baseline-nya. Keduanya butuh \u201Cmelihat ke belakang\u201D — pekerjaan window function.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: window function sama dengan GROUP BY",
        body: "GROUP BY: 30 baris → 4 baris mingguan (detail hilang). Window: 30 baris → tetap 30 baris, masing-masing membawa MA7. Kalau kamu butuh tren per hari, GROUP BY per minggu membuang resolusi; kalau butuh ringkasan, window membuang-buang komputasi. Pilih berdasarkan bentuk output yang diinginkan.",
      },
    },
    {
      id: "agregasi-bertingkat",
      eyebrow: "Langkah 4 · Agregasi bertingkat",
      title: "CTE: bangun menara, bukan sarang subquery",
      prose: [
        "\u201CTop 3 kategori per kota berdasarkan rata-rata penjualan harian\u201D — query ini butuh tiga tingkat agregasi: harian → rata-rata per kategori per kota → ranking. Ditulis sebagai subquery bersarang, ia jadi tidak terbaca. Ditulis sebagai CTE (WITH), ia jadi tiga langkah yang masing-masing bisa diuji.",
        "Pola menara: WITH harian AS (...), WITH rata2 AS (SELECT ... FROM harian ...), SELECT ... RANK() OVER (PARTITION BY kota ORDER BY rata2 DESC) ... WHERE rnk <= 3. Tiap CTE adalah satu transformasi yang bisa di-SELECT sendiri untuk debugging.",
        "Cara membaca chart: garis tipis bergerigi = penjualan harian (noise + spike promo 271,1 di hari ke-20). Garis tebal = MA7, turun mulus dari 109 ke 87. Garis putus-putus = rata-rata bulanan 101,3 — datar dan menipu.",
        "Interpretasi: satu spike promo mengangkat rata-rata bulanan sehingga tren turun 20% tidak terlihat. MA7 jujur karena ia lokal (hanya 7 hari terakhir), bukan global.",
      ],
      figure: {
        svg: TREND_SVG,
        alt: "Garis penjualan harian dengan spike promo dan garis MA7 yang menurun.",
        caption: "Harian (tipis) vs MA7 (tebal, 109 → 87) vs rata-rata bulanan (putus-putus, 101,3). Agregat global menyembunyikan tren.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: CTE lebih lambat dari subquery",
        body: "Di database modern, CTE dan subquery setara dioptimasi menjadi rencana eksekusi yang sama. Yang berbeda adalah keterbacaan dan kemampuan di-debug. Pilih CTE untuk logika bertingkat — kecuali CTE-nya dipakai dua kali dan databasenya materialisasi (maka pertimbangkan temp table).",
      },
    },
    {
      id: "lab-window",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: tulis SQL-nya, buktikan dengan Python",
      prose: [
        "Tabel `harian` (30 hari penjualan, seed 21) sudah tersedia. Tugasmu: (1) tulis query window function untuk MA7 dan ambil nilainya di hari ke-30; (2) tulis query LAG untuk pertumbuhan WoW hari ke-30; (3) hitung ulang keduanya dengan Python murni dan pastikan sama — SQL yang tidak bisa diverifikasi adalah SQL yang tidak dipercaya.",
        "Coba juga: ganti frame menjadi `ROWS BETWEEN 13 PRECEDING AND CURRENT ROW` (MA14). Apakah trennya terlihat lebih halus atau justru tertinggal? Itulah trade-off kehalusan vs kelambatan respons.",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Tulis `q_ma` (window AVG) → `ma7_sql` hari ke-30" },
        { id: "t2", text: "Tulis `q_wow` (LAG 7 hari) → `wow_sql` hari ke-30" },
        { id: "t3", text: "Verifikasi Python → `ma7_py`, `wow_py`; cetak semua" },
      ],
      expected: "ma7_sql=86.99  wow_sql=0.0919  cocok=True",
      note: {
        title: "Sering salah",
        body: "LAG(penjualan, 7) pada 7 baris pertama menghasilkan NULL — itu benar, bukan bug. Jangan \u201Cmemperbaiki\u201D dengan COALESCE(..., 0) karena akan menghasilkan pertumbuhan -100% palsu. NULL berarti \u201Ctidak ada pembanding\u201D.",
      },
      hints: [
        "q_ma: SELECT tgl, AVG(penjualan) OVER (ORDER BY tgl ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7 FROM harian ORDER BY tgl — ambil baris terakhir.",
        "q_wow: (penjualan - LAG(penjualan,7) OVER (ORDER BY tgl)) / LAG(penjualan,7) OVER (ORDER BY tgl).",
        "Python: sales = [r[0] for r in ...]; ma7_py = sum(sales[-7:])/7; wow_py = (sales[-1]-sales[-8])/sales[-8].",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE harian (tgl TEXT, penjualan REAL)")\nimport random\nrandom.seed(21)\nfor d in range(1, 31):\n    base = 100 - 0.8*d\n    weekend = 1.4 if d % 7 in (0, 6) else 1.0\n    promo = 2.2 if d == 20 else 1.0\n    cur.execute("INSERT INTO harian VALUES (?, ?)",\n                (f"2026-09-{d:02d}", round(base*weekend*promo*random.uniform(0.9,1.1), 1)))\n\n# TULIS KODEMU: q_ma, q_wow (string SQL), lalu ma7_sql, wow_sql, ma7_py, wow_py\nq_ma = ""\nq_wow = ""\nma7_sql = 0\nwow_sql = 0\nma7_py = 0\nwow_py = 0\ncocok = False\n\nprint(f"ma7_sql={ma7_sql:.2f}  wow_sql={wow_sql:.4f}  cocok={cocok}")`,
        lockLines: 11,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE harian (tgl TEXT, penjualan REAL)")\nimport random\nrandom.seed(21)\nfor d in range(1, 31):\n    base = 100 - 0.8*d\n    weekend = 1.4 if d % 7 in (0, 6) else 1.0\n    promo = 2.2 if d == 20 else 1.0\n    cur.execute("INSERT INTO harian VALUES (?, ?)",\n                (f"2026-09-{d:02d}", round(base*weekend*promo*random.uniform(0.9,1.1), 1)))\n\n# TULIS KODEMU: q_ma, q_wow (string SQL), lalu ma7_sql, wow_sql, ma7_py, wow_py\nq_ma = """SELECT tgl, AVG(penjualan) OVER\n  (ORDER BY tgl ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS ma7\n  FROM harian ORDER BY tgl"""\nq_wow = """SELECT tgl, (penjualan - LAG(penjualan,7) OVER (ORDER BY tgl))\n  / LAG(penjualan,7) OVER (ORDER BY tgl) AS wow FROM harian ORDER BY tgl"""\nma7_sql = cur.execute(q_ma).fetchall()[-1][1]\nwow_sql = cur.execute(q_wow).fetchall()[-1][1]\nsales = [r[0] for r in cur.execute("SELECT penjualan FROM harian ORDER BY tgl").fetchall()]\nma7_py = sum(sales[-7:]) / 7\nwow_py = (sales[-1] - sales[-8]) / sales[-8]\ncocok = abs(ma7_sql - ma7_py) < 1e-9 and abs(wow_sql - wow_py) < 1e-9\n\nprint(f"ma7_sql={ma7_sql:.2f}  wow_sql={wow_sql:.4f}  cocok={cocok}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ma7_sql", value: 86.99, tol: 0.01, label: "`ma7_sql` = 86.99", msg: "MA7 hari ke-30 = rata-rata 7 hari terakhir. Cek frame ROWS-nya." },
          { kind: "equal", task: "t2", name: "wow_sql", value: 0.0919, tol: 0.0005, label: "`wow_sql` = 0.0919", msg: "(hari30 - hari23) / hari23. Cek offset LAG = 7." },
          { kind: "equal", task: "t3", name: "cocok", value: true, label: "Verifikasi Python cocok", msg: "Hitung ulang dengan Python murni dan bandingkan." },
          { kind: "stdout_matches", task: "t3", pattern: "ma7_sql=86\\.99\\s+wow_sql=0\\.0919\\s+cocok=True", label: "`print` menampilkan hasil", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "AVG(x) OVER (ORDER BY tgl ROWS BETWEEN 6 PRECEDING AND CURRENT ROW). LAG(x, 7) OVER (ORDER BY tgl).",
    },    {
      id: "lab2-retensi-kohort",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: matriks retensi kohort",
      prose: [
        "Retensi dibaca per kohort (kapan user daftar), bukan per bulan kalender — kalau tidak, user baru menutupi kaburnya user lama. Tugasmu: bangun matriks retensi dari data mentah user.",
        "Untuk tiap kohort (Jan/Feb/Mar), hitung % anggotanya yang masih aktif pada bulan ke-0 (bulan daftar), ke-1, ke-2, dan seterusnya. Lalu tentukan kohort dengan retensi bulan+1 terbaik.",
        "Coba juga: apa yang terjadi pada retensi Jan bulan+2 jika u03 ternyata churn di bulan 3, bukan 4? Satu baris data mengubah narasi — makanya definisi 'aktif' harus disepakati dulu (BI11).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `anggota` per kohort dan `aktif[(kohort, offset)]`" },
        { id: "t2", text: "Bangun `retensi`: dict (kohort, offset) → % (bulat)" },
        { id: "t3", text: "Tentukan `kohort_terbaik` dari retensi offset=1" },
      ],
      expected: "retensi_m1={1: 80, 2: 75, 3: 67}",
      note: {
        title: "Sering salah",
        body: "Offset dihitung dari bulan kohort (offset 0 = bulan daftar, selalu 100%). Salah satu jebakan klasik: memakai bulan kalender absolut sebagai offset.",
      },
      hints: [
        "offset = last - koh: user aktif pada offset 0..(last-koh).",
        "retensi[(koh,off)] = aktif[(koh,off)] / anggota[koh] * 100.",
        "Bandingkan retensi[(koh,1)] antar kohort untuk mencari yang terbaik.",
      ],
      code: {
        starter: `# (user, kohort_bulan, bulan_aktif_terakhir) -- bulan sbg integer 1=Jan\nusers = [\n    ("u01",1,3),("u02",1,1),("u03",1,4),("u04",1,2),("u05",1,3),\n    ("u06",2,4),("u07",2,2),("u08",2,5),("u09",2,3),\n    ("u10",3,5),("u11",3,3),("u12",3,4),\n]\nBULAN = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"Mei"}\n# TULIS KODEMU: retensi, kohort_terbaik\nretensi = {}\nkohort_terbaik = 0\n`,
        lockLines: 7,
        solution: `# (user, kohort_bulan, bulan_aktif_terakhir) -- bulan sbg integer 1=Jan\nusers = [\n    ("u01",1,3),("u02",1,1),("u03",1,4),("u04",1,2),("u05",1,3),\n    ("u06",2,4),("u07",2,2),("u08",2,5),("u09",2,3),\n    ("u10",3,5),("u11",3,3),("u12",3,4),\n]\nBULAN = {1:"Jan",2:"Feb",3:"Mar",4:"Apr",5:"Mei"}\n\n# TULIS KODEMU: retensi, kohort_terbaik\nfrom collections import defaultdict\nanggota = defaultdict(int); aktif = defaultdict(int)\nfor u, koh, last in users:\n    anggota[koh] += 1\n    for off in range(0, last - koh + 1):\n        aktif[(koh, off)] += 1\n\nretensi = {(koh, off): round(aktif[(koh, off)] / anggota[koh] * 100)\n           for (koh, off) in aktif}\n# retensi bulan+1 per kohort\nr1 = {koh: retensi.get((koh, 1), 0) for koh in anggota}\nkohort_terbaik = max(r1, key=r1.get)\n\nprint(f"retensi_m1={r1}")\nprint(f"kohort_terbaik={BULAN[kohort_terbaik]}  m1={r1[kohort_terbaik]}%")\n`,
        checks: [
          { kind: "defined", task: "t2", name: "retensi", label: "`retensi` terdefinisi", msg: "Dict (kohort, offset) → persen." },
          { kind: "stdout_matches", task: "t2", pattern: "retensi_m1=\\{1: 80, 2: 75, 3: 67\\}", label: "retensi bulan+1 benar", msg: "Jan 80%, Feb 75%, Mar 67%." },
          { kind: "equal", task: "t3", name: "kohort_terbaik", value: 1, label: "`kohort_terbaik` = 1 (Jan)", msg: "Retensi offset=1 tertinggi: Jan 80%." },
        ],
      },
      reference: "defaultdict untuk agregasi; offset relatif kohort, bukan bulan absolut.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Window function menjawab pertanyaan 'dibandingkan dengan', GROUP BY menjawab 'berapa totalnya'. Kalau pertanyaanmu mengandung kata 'dibandingkan', 'tren', atau 'peringkat' — itu bau window function.",
        "💡 CTE yang baik dibaca seperti daftar isi: tiap CTE bernama kata benda bisnis (bukan step1, step2). Kalau kamu tidak bisa memberi nama bisnis pada sebuah CTE, mungkin ia tidak perlu ada.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: frame default adalah jebakan yang menunggu data kembar",
        body: "Window function punya nilai default yang jarang dibaca: frame-nya. Ketika kamu menulis SUM() OVER (ORDER BY tanggal) tanpa klausa frame, database memakai default — dan default untuk agregat ber-ORDER BY adalah RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, bukan ROWS. Bedanya meledak saat ada nilai kembar di kolom pengurut: dengan RANGE, semua baris yang tanggalnya sama dianggap satu bingkai dan mendapat total yang sama; dengan ROWS, tiap baris dihitung satu per satu. Running total yang \"tiba-tiba melompat\" hampir selalu berasal dari sini. Heuristik praktisinya ada tiga. Pertama, tulis frame secara eksplisit setiap kali memakai agregat window — jangan pernah mengandalkan default, karena default adalah keputusan yang dibuat orang lain untuk datamu. Kedua, uji query-mu dengan data kembar yang disengaja: duplikatkan dua baris bertanggal sama dan lihat apakah hasilnya masih masuk akal. Kalau hasilnya berubah hanya karena duplikasi, logikamu rapuh. Ketiga, ingat urutan logisnya: WHERE tidak bisa memfilter hasil window function karena window dihitung setelah WHERE — bungkus dulu dengan CTE atau subquery, baru filter. Tiga aturan ini — frame eksplisit, uji kembar, bungkus sebelum filter — menghilangkan sebagian besar bug window function di production. Sisanya biasanya salah PARTITION BY: agregat yang seharusnya per pelanggan malah tercampur karena kolom partisinya kurang satu.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: teknik apa untuk pertanyaan apa",
      prose: [
        "Skenario 1 — \u201CTrennya ke mana?\u201D (noise harian tinggi). → Moving average / median berjalan via window. Jangan jawab dengan dua titik.",
        "Skenario 2 — \u201CBerapa total per grup?\u201D (satu angka per kategori). → GROUP BY murni. Window hanya buang komputasi.",
        "Skenario 3 — \u201CBandingkan tiap baris dengan periode lalu / dengan rata-rata grupnya.\u201D → Window (LAG, AVG OVER PARTITION BY). Detail baris tetap utuh.",
        "Skenario 4 — \u201CTop-N per grup\u201D atau \u201Cbuang duplikat, ambil terbaru\u201D. → ROW_NUMBER() OVER (PARTITION BY grup ORDER BY ...) lalu filter rn = 1.",
        "Skenario 5 — Logika 3+ tingkat (\u201Crata-rata dari rasio per hari\u201D). → CTE bertingkat; tiap tingkat bisa di-SELECT untuk verifikasi. Jangan sarang subquery.",
        "Aturan praktis 10 detik: mau ringkasan → GROUP BY. Mau konteks menempel di tiap baris → window. Mau langkah bertingkat → CTE.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: retensi kohort yang dibaca terbalik",
      prose: [
        "Tim produk melaporkan \u201Cretensi bulan ke-3 naik dari 22% ke 31%\u201D. Direksi senang. Analis senior curiga dan menarik retensi per kohort pendaftaran: kohort Januari 34% → 28% → 24%; kohort Februari 30% → 25% → 21%. Semua kohort TURUN.",
        "Yang naik adalah campuran: kohort lama (retensi rendah, basis besar) churned out, kohort baru (retensi tinggi di bulan awal) mendominasi campuran. Ini Simpson's paradox — agregat bergerak berlawanan dengan tiap grupnya.",
        "Solusi SQL: hitung retensi dengan PARTITION BY kohort, jangan satu angka global. Query: WITH basis AS (SELECT user_id, kohort, ...), aktif AS (...) SELECT kohort, bulan_ke, COUNT(aktif)/COUNT(basis) ... GROUP BY kohort, bulan_ke. Satu angka global untuk retensi hampir selalu menipu.",
        "💡 Intuisi kunci: setiap kali melihat rasio agregat yang \u201Cnaik\u201D, tanyakan: naik di tiap grupnya, atau komposisi grupnya yang berubah? 90% kejutan metrik berasal dari perubahan komposisi, bukan perubahan perilaku.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang SQL analitik. Fokus pada perbedaan window vs agregat biasa.",
      ],
      tasks: [],
      summary: [
        "Window function menempelkan konteks ke tiap baris; GROUP BY menggulung baris menjadi ringkasan.",
        "LAG/LEAD untuk perbandingan periode; AVG/SUM OVER + frame untuk moving average & running total.",
        "Frame default bisa bocor ke masa depan — tulis ROWS BETWEEN eksplisit.",
        "CTE bertingkat untuk logika multi-langkah; tiap tingkat bisa diverifikasi.",
        "Rasio agregat bisa menipu (Simpson) — iris per grup dengan PARTITION BY.",
      ],
      next: { label: "BI4 — Dashboard yang Dipakai", href: "/v2/learn/biz4-dashboard" },
      quiz: [
        {
          q: "WoW +9,2% tapi MA7 turun 109 → 87. Kesimpulan yang jujur?",
          options: [
            { text: "Penjualan membaik — ikuti WoW", why: "WoW hanya membandingkan dua titik; ia buta terhadap tren." },
            { text: "Tren menurun — MA7 lebih jujur untuk arah", why: "Tepat: MA7 menghaluskan noise dan menunjukkan arah; WoW +9,2% hanyalah pantulan dua titik.", correct: true },
            { text: "Keduanya salah, pakai rata-rata bulanan", why: "Rata-rata bulanan 101,3 justru paling menipu — terangkat satu hari promo." },
            { text: "Tidak bisa disimpulkan", why: "Bisa: data cukup untuk menyatakan tren menurun dengan keyakinan wajar." },
          ],
        },
        {
          q: "Kapan memakai window function, bukan GROUP BY?",
          options: [
            { text: "Saat butuh satu angka total per kategori", why: "Itu pekerjaan GROUP BY yang murni." },
            { text: "Saat tiap baris perlu konteks (MA7, selisih vs minggu lalu) tanpa kehilangan detail", why: "Tepat: window mempertahankan grain baris sambil menempelkan agregat.", correct: true },
            { text: "Saat datanya kecil", why: "Ukuran data bukan kriteria pemilihan teknik ini." },
            { text: "Saat tidak ada kolom tanggal", why: "Window butuh ORDER BY yang bermakna; tanpa itu hasilnya tidak stabil." },
          ],
        },
        {
          q: "Apa risiko frame default pada AVG() OVER (ORDER BY tgl)?",
          options: [
            { text: "Tidak ada — selalu 7 hari terakhir", why: "Default bukan 7 hari; ia tergantung implementasi dan bisa tak terduga." },
            { text: "Bisa mencakup baris masa depan / seluruh partisi (lookahead bias)", why: "Tepat: default frame sering ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW atau RANGE — tulis frame eksplisit.", correct: true },
            { text: "Query pasti error", why: "Tidak error — justru diam-diam menghasilkan angka yang salah." },
            { text: "Hanya lambat, hasilnya tetap benar", why: "Hasilnya bisa salah secara makna, bukan sekadar lambat." },
          ],
        },
        {
          q: "Untuk \u201Ctop 3 produk per kota\u201D, kombinasi yang tepat?",
          options: [
            { text: "GROUP BY kota, ORDER BY total DESC LIMIT 3", why: "LIMIT 3 global hanya memberi 3 baris total, bukan 3 per kota." },
            { text: "RANK() OVER (PARTITION BY kota ORDER BY total DESC), filter rank <= 3", why: "Tepat: PARTITION BY me-reset peringkat per kota.", correct: true },
            { text: "ROW_NUMBER() OVER (ORDER BY total DESC) LIMIT 3", why: "Tanpa PARTITION BY, peringkatnya global — bukan per kota." },
            { text: "COUNT(*) GROUP BY kota, produk", why: "Itu agregatnya; belum ada logika top-N per grup." },
          ],
        },
        {
          q: "Retensi agregat naik tapi tiap kohort turun. Penjelasan paling mungkin?",
          options: [
            { text: "Data salah input", why: "Mungkin, tapi bukan penjelasan paling mungkin — polanya terlalu sistematis." },
            { text: "Simpson's paradox: komposisi kohort berubah", why: "Tepat: kohort baru (retensi awal tinggi) mendominasi campuran sementara tiap kohort menurun.", correct: true },
            { text: "Query kurang filter", why: "Filter tidak menjelaskan pembalikan arah yang konsisten." },
            { text: "Itu mustahil secara matematis", why: "Sangat mungkin — inilah definisi Simpson's paradox." },
          ],
        },
        {
          q: "Kamu butuh 'rata-rata 7 hari terakhir' di SETIAP baris harian tanpa menghilangkan baris. Konstruksi yang benar?",
          options: [
            { text: "GROUP BY tanggal lalu JOIN kembali", why: "Bisa tapi berputar: menghancurkan baris lalu merekonstruksi. Window function dirancang persis untuk ini." },
            { text: "AVG(nilai) OVER (ORDER BY tanggal ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)", why: "Tepat: window frame 7 baris, tiap baris tetap ada dengan rata-rata geraknya. Inilah beda window vs GROUP BY: agregat tanpa menghancurkan granularitas.", correct: true },
            { text: "Subquery dengan LIMIT 7", why: "LIMIT memotong hasil akhir, bukan jendela per baris — hasilnya satu angka, bukan kolom baru." },
            { text: "AVG(nilai) GROUP BY tanggal", why: "Itu rata-rata per tanggal (satu baris per tanggal), bukan rata-rata 7 hari terakhir per baris." },
          ],
        },
      ],
    },
  ],
};
