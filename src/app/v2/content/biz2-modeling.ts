import type { V2Lesson } from "../lib/types";

// Star schema: fact_penjualan di tengah, 3 dimensi di sekelilingnya.
const STAR_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Star schema: tabel fact penjualan di tengah, dikelilingi dimensi produk, pelanggan, dan tanggal.">
<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--text-muted)"/></marker></defs>
<g font-family="var(--font-ui)">
<rect x="200" y="110" width="120" height="80" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="260" y="136" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)">fact_penjualan</text>
<text x="260" y="156" text-anchor="middle" font-size="11" fill="var(--text-muted)">order_id, tgl</text>
<text x="260" y="172" text-anchor="middle" font-size="11" fill="var(--text-muted)">qty, harga, revenue</text>
<rect x="30" y="40" width="120" height="70" rx="8" fill="var(--bg-panel)" stroke="var(--c2)" stroke-width="2"/>
<text x="90" y="66" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">dim_produk</text>
<text x="90" y="86" text-anchor="middle" font-size="11" fill="var(--text-muted)">product_id, kategori</text>
<rect x="370" y="40" width="120" height="70" rx="8" fill="var(--bg-panel)" stroke="var(--c3)" stroke-width="2"/>
<text x="430" y="66" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">dim_pelanggan</text>
<text x="430" y="86" text-anchor="middle" font-size="11" fill="var(--text-muted)">customer_id, kota</text>
<rect x="200" y="220" width="120" height="60" rx="8" fill="var(--bg-panel)" stroke="var(--c4)" stroke-width="2"/>
<text x="260" y="244" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">dim_tanggal</text>
<text x="260" y="262" text-anchor="middle" font-size="11" fill="var(--text-muted)">tgl, bulan, kuartal</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5" marker-end="url(#ah)">
<line x1="150" y1="90" x2="205" y2="125"/><line x1="370" y1="90" x2="315" y2="125"/><line x1="260" y1="220" x2="260" y2="192"/>
</g>
<g font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">
<text x="168" y="102">N:1</text><text x="338" y="102">N:1</text><text x="268" y="210">N:1</text>
</g>
<text x="260" y="296" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Satu fact di grain baris-order; dimensi menjawab siapa / apa / kapan.</text>
</svg>`;

export const biz2: V2Lesson = {
  slug: "biz2-modeling",
  track: "Business Intelligence",
  module: "Fondasi BI",
  title: "BI2 — Data Modeling: Star Schema",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Query yang benar, angka yang 3x lipat",
      prose: [
        "Rina, analis di distributor FMCG, diminta total revenue September. Ia menulis query rapi: JOIN tabel order ke tabel promo, SUM(harga × qty). Hasilnya: Rp2.244.000. Finance bilang angka yang benar Rp748.000. Selisih tepat 3x lipat.",
        "Tidak ada yang salah dengan sintaks SQL-nya. Yang salah adalah makna join-nya: satu order bisa punya 3 promo, sehingga tiap baris order terduplikasi 3 kali sebelum di-SUM. Ini disebut fan trap — kipas yang mengembangbiakkan baris.",
        "Twist-nya: bug ini lolos code review karena query-nya terlihat benar dan angkanya \u201Cmasuk akal\u201D. Tidak ada error, tidak ada warning. Satu-satunya yang bisa menangkapnya adalah pemahaman tentang grain — di level apa satu baris data itu dihitung.",
        "Di lesson ini kamu akan bisa: (1) menjelaskan perbedaan fact dan dimension serta apa itu grain; (2) merancang star schema dari tabel transaksi mentah; (3) mendeteksi dan memperbaiki fan trap sebelum angkanya naik ke dashboard; (4) memilih star vs snowflake vs wide table.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merancang star schema yang tahan terhadap jebakan join dan menjelaskan tiap pilihannya.",
        "(1) Membedakan fact vs dimensi dan memilih grain yang benar untuk satu fact table; (2) menjelaskan kenapa fan trap menggandakan angka dan cara menghindarinya;",
        "(3) Memakai surrogate key dengan alasan yang tepat (bukan ritual); (4) Menerapkan SCD tipe 2 agar histori tidak tertimpa — revenue ikut kota yang benar pada tanggalnya.",
        "(5) Memilih antara star, snowflake, dan flat berdasar pola query analis — bukan berdasar selera arsitek.",
      ],
      tasks: [],
    },

    {
      id: "fact-dimensi",
      eyebrow: "Langkah 3 · Fact vs dimensi",
      title: "Fact: yang diukur. Dimensi: yang menjawab siapa-apa-kapan",
      prose: [
        "Tabel fact menyimpan kejadian bisnis yang bisa diukur: penjualan, klik, pembayaran. Kolomnya angka (qty, harga, revenue) plus kunci ke dimensi. Tabel dimensi menyimpan konteks: siapa pelanggannya, apa produknya, kapan terjadinya.",
        "Grain adalah kontrak terpenting dalam modeling: satu baris fact = satu apa? Satu baris per order-line? Per order? Per hari per toko? Semua agregasi di atasnya harus menghormati grain ini. Rina gagal karena grain query-nya berubah diam-diam dari \u201Cper order-line\u201D menjadi \u201Cper order-line per promo\u201D.",
        "Kepribadian: fact adalah \u201Csi pencatat\u201D — jujur, kurus, hanya mencatat kejadian. Dimensi adalah \u201Csi pencerita\u201D — gemuk dengan atribut (nama, kota, kategori) yang membuat angka bisa diiris-iris.",
        "💡 Intuisi kunci: sebelum menulis SELECT, tulis dulu grain-nya dalam satu kalimat: \u201Csatu baris = satu ___.\u201D Kalau kalimat itu berubah di tengah query (karena join ke tabel ber-multiplisitas), berhentilah — kamu sedang membangun fan trap.",
      ],
      formula: String.raw`R = \sum_{i=1}^{n} q_i \cdot p_i \qquad R_{salah} = R \times m`,
      formulaNote:
        "R = revenue benar: jumlah qty × harga per baris pada grain yang tepat. R_salah = revenue dari join yang fan-out: tiap baris terduplikasi m kali (m = jumlah baris pasangannya), sehingga total ikut terkalikan m. Di kasus Rina, m = 3.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: JOIN selalu aman kalau key-nya cocok",
        body: "Key cocok hanya menjamin barisnya berpasangan, bukan grain-nya sama. Join 1 baris order ke 3 baris promo menghasilkan 3 baris — SUM setelah itu menghitung 3x. Aturan: cek multiplisitas kedua sisi SEBELUM agregat. Kalau satu sisi bisa banyak (N), agregat dulu ke grain 1, baru join.",
      },
    },
    {
      id: "star-schema",
      eyebrow: "Langkah 4 · Star schema",
      title: "Star schema: satu fact, dikelilingi dimensi",
      prose: [
        "Star schema menaruh tabel fact di tengah, dikelilingi tabel dimensi yang di-join langsung (relasi N:1). Bentuknya seperti bintang — makanya disebut star. Query-nya sederhana: filter di dimensi, agregat di fact.",
        "Cara membaca: kotak tengah fact_penjualan menyimpan angka (qty, harga, revenue) per baris order. Tiga kotak dimensi menjawab: produk apa (dim_produk), siapa beli (dim_pelanggan), kapan (dim_tanggal). Panah N:1 berarti banyak baris fact menunjuk satu baris dimensi — tidak pernah sebaliknya.",
        "Interpretasi: karena dimensi selalu di sisi \u201C1\u201D, join fact → dimensi TIDAK PERNAH menggandakan baris. Itulah jaminan keamanan star schema: selama kamu hanya join ke dimensi (bukan ke tabel fact lain atau tabel multi-nilai), SUM-mu aman.",
        "💡 Intuisi kunci: snowflake (dimensi di-normalisasi bertingkat) menghemat storage tapi menambah join; wide table (satu tabel denormalisasi raksasa) tercepat dibaca tapi boros dan rawan inkonsistensi. Star adalah titik tengah yang dimenangkan untuk 80% kebutuhan BI.",
      ],
      figure: {
        svg: STAR_SVG,
        alt: "Diagram star schema: fact_penjualan di tengah, dim_produk, dim_pelanggan, dim_tanggal di sekeliling.",
        caption: "Star schema: fact di tengah (angka), dimensi di sekeliling (konteks). Relasi selalu N:1 dari fact ke dimensi.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: surrogate key itu pemborosan",
        body: "Banyak yang memakai kode natural (mis. kode_produk \u201CA-123\u201D) sebagai key. Masalah: kode natural bisa berubah (rebranding, merger) dan bisa dipakai ulang. Surrogate key (integer buatan) kebal terhadap itu semua, join-nya lebih cepat, dan memungkinkan SCD Tipe 2 — melacak histori perubahan dimensi.",
      },
    },
    {
      id: "lab-star",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: bangun star schema, jebak fan trap-nya",
      prose: [
        "Tabel mentah `stg` (8 baris transaksi, grain = per order-line) sudah tersedia. Tugasmu: (1) buat `dim_produk` dan `fact_penjualan`, hitung `rev_benar`; (2) join fact ke `product_tags` (tiap produk punya 2 tag) dan hitung `rev_salah` — saksikan sendiri angkanya mengembang 2x; (3) hitung `faktor` penggelembungnya.",
        "Coba juga: ganti SELECT pada `rev_salah` menjadi COUNT(*) — berapa baris yang dihasilkan join itu? Bandingkan dengan 8 baris fact. Itulah bukti visual fan trap.",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Buat `dim_produk` + `fact_penjualan`, hitung `rev_benar`" },
        { id: "t2", text: "Hitung `rev_salah` dari join fact → dim → product_tags" },
        { id: "t3", text: "Hitung `faktor = rev_salah / rev_benar`, cetak ketiganya" },
      ],
      expected: "rev_benar=748000  rev_salah=1496000  faktor=2.0",
      note: {
        title: "Sering salah",
        body: "Lupa mengisi fact dari stg via JOIN ke dim_produk (product_id), malah copy kolom produk mentah. Fact yang baik menyimpan kunci dimensi, bukan teks bebas — teks bebas tidak bisa SCD dan rawan typo.",
      },
      hints: [
        "dim_produk: INSERT INTO dim_produk(produk, kategori) SELECT DISTINCT produk, kategori FROM stg.",
        "fact: INSERT INTO fact_penjualan SELECT ..., d.product_id, ..., qty*harga FROM stg s JOIN dim_produk d ON d.produk=s.produk.",
        "rev_salah: SUM(f.revenue) FROM fact_penjualan f JOIN dim_produk d ON ... JOIN product_tags t ON t.produk=d.produk.",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE stg (order_id TEXT, tgl TEXT, customer TEXT, kota TEXT, produk TEXT, kategori TEXT, qty INT, harga REAL)")\ncur.executemany("INSERT INTO stg VALUES (?,?,?,?,?,?,?,?)", [\n    ("ORD-01","2026-09-01","Budi","Jakarta","Kopi Arabika","Minuman",2,95000),\n    ("ORD-01","2026-09-01","Budi","Jakarta","Gula Aren","Bahan",1,28000),\n    ("ORD-02","2026-09-02","Sari","Bandung","Kopi Arabika","Minuman",1,95000),\n    ("ORD-03","2026-09-03","Budi","Jakarta","Teh Melati","Minuman",3,32000),\n    ("ORD-04","2026-09-04","Dewi","Surabaya","Gula Aren","Bahan",2,28000),\n    ("ORD-05","2026-09-05","Sari","Bandung","Kopi Robusta","Minuman",2,78000),\n    ("ORD-06","2026-09-06","Agus","Jakarta","Teh Melati","Minuman",1,32000),\n    ("ORD-07","2026-09-07","Dewi","Surabaya","Kopi Arabika","Minuman",1,95000)])\ncur.execute("CREATE TABLE product_tags (produk TEXT, tag TEXT)")\ncur.executemany("INSERT INTO product_tags VALUES (?,?)", [\n    ("Kopi Arabika","biji"),("Kopi Arabika","premium"),("Gula Aren","pemanis"),("Gula Aren","lokal"),\n    ("Teh Melati","daun"),("Teh Melati","wangi"),("Kopi Robusta","biji"),("Kopi Robusta","ekonomis")])\n\n# TULIS KODEMU: dim_produk, fact_penjualan, rev_benar, rev_salah, faktor\ncur.execute("CREATE TABLE dim_produk (product_id INTEGER PRIMARY KEY, produk TEXT, kategori TEXT)")\ncur.execute("CREATE TABLE fact_penjualan (order_id TEXT, tgl TEXT, customer TEXT, kota TEXT, product_id INT, qty INT, harga REAL, revenue REAL)")\nrev_benar = 0\nrev_salah = 0\nfaktor = 0\n\nprint(f"rev_benar={rev_benar:.0f}  rev_salah={rev_salah:.0f}  faktor={faktor}")`,
        lockLines: 14,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE stg (order_id TEXT, tgl TEXT, customer TEXT, kota TEXT, produk TEXT, kategori TEXT, qty INT, harga REAL)")\ncur.executemany("INSERT INTO stg VALUES (?,?,?,?,?,?,?,?)", [\n    ("ORD-01","2026-09-01","Budi","Jakarta","Kopi Arabika","Minuman",2,95000),\n    ("ORD-01","2026-09-01","Budi","Jakarta","Gula Aren","Bahan",1,28000),\n    ("ORD-02","2026-09-02","Sari","Bandung","Kopi Arabika","Minuman",1,95000),\n    ("ORD-03","2026-09-03","Budi","Jakarta","Teh Melati","Minuman",3,32000),\n    ("ORD-04","2026-09-04","Dewi","Surabaya","Gula Aren","Bahan",2,28000),\n    ("ORD-05","2026-09-05","Sari","Bandung","Kopi Robusta","Minuman",2,78000),\n    ("ORD-06","2026-09-06","Agus","Jakarta","Teh Melati","Minuman",1,32000),\n    ("ORD-07","2026-09-07","Dewi","Surabaya","Kopi Arabika","Minuman",1,95000)])\ncur.execute("CREATE TABLE product_tags (produk TEXT, tag TEXT)")\ncur.executemany("INSERT INTO product_tags VALUES (?,?)", [\n    ("Kopi Arabika","biji"),("Kopi Arabika","premium"),("Gula Aren","pemanis"),("Gula Aren","lokal"),\n    ("Teh Melati","daun"),("Teh Melati","wangi"),("Kopi Robusta","biji"),("Kopi Robusta","ekonomis")])\n\n# TULIS KODEMU: dim_produk, fact_penjualan, rev_benar, rev_salah, faktor\ncur.execute("CREATE TABLE dim_produk (product_id INTEGER PRIMARY KEY, produk TEXT, kategori TEXT)")\ncur.execute("CREATE TABLE fact_penjualan (order_id TEXT, tgl TEXT, customer TEXT, kota TEXT, product_id INT, qty INT, harga REAL, revenue REAL)")\ncur.execute("INSERT INTO dim_produk (produk, kategori) SELECT DISTINCT produk, kategori FROM stg")\ncur.execute("""INSERT INTO fact_penjualan\n  SELECT s.order_id, s.tgl, s.customer, s.kota, d.product_id, s.qty, s.harga, s.qty*s.harga\n  FROM stg s JOIN dim_produk d ON d.produk = s.produk""")\nrev_benar = cur.execute("SELECT SUM(revenue) FROM fact_penjualan").fetchone()[0]\nrev_salah = cur.execute("""SELECT SUM(f.revenue) FROM fact_penjualan f\n  JOIN dim_produk d ON d.product_id = f.product_id\n  JOIN product_tags t ON t.produk = d.produk""").fetchone()[0]\nfaktor = rev_salah / rev_benar\n\nprint(f"rev_benar={rev_benar:.0f}  rev_salah={rev_salah:.0f}  faktor={faktor}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rev_benar", value: 748000.0, tol: 1.0, label: "`rev_benar` = 748000", msg: "SUM(qty*harga) 8 baris = 748000. Cek INSERT fact-nya." },
          { kind: "equal", task: "t2", name: "rev_salah", value: 1496000.0, tol: 1.0, label: "`rev_salah` = 1496000", msg: "Join ke product_tags menggandakan tiap baris (2 tag/produk)." },
          { kind: "equal", task: "t3", name: "faktor", value: 2.0, tol: 1e-9, label: "`faktor` = 2.0", msg: "1496000 / 748000 = 2.0." },
          { kind: "stdout_matches", task: "t3", pattern: "rev_benar=748000\\s+rev_salah=1496000\\s+faktor=2\\.0", label: "`print` menampilkan ketiganya", msg: "Samakan format dengan hasil yang diharapkan." },
        ],
      },
      reference: "INSERT INTO ... SELECT ... FROM. JOIN berantai: fact → dim → tags.",
    },    {
      id: "lab2-scd2-kota",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: revenue ikut kota yang benar (SCD tipe 2)",
      prose: [
        "Pelanggan P1 pindah dari Jakarta ke Bandung pada 10 Maret. Order Februari-nya 40 juta — milik kota mana? Jawaban naif ('kota kini') memindahkan 40 juta itu ke Bandung dan menggelembungkan satu kota sambil mengempiskan yang lain.",
        "Tugasmu: bangun logika SCD tipe 2 — order dikaitkan ke kota yang berlaku PADA TANGGAL order — lalu bandingkan revenue Jakarta yang benar vs yang salah.",
        "Coba juga: bagaimana kalau P1 pindah dua kali? Struktur (valid_from, valid_to) tetap sama — hanya barisnya bertambah. Itulah kenapa tipe 2 disebut 'ingatan penuh'.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `kota_saat(cust, tgl)`: kota dari dim yang rentangnya mencakup tgl" },
        { id: "t2", text: "Hitung `rev_jkt_benar`: jumlah amount order yang kota_saat-nya Jakarta" },
        { id: "t3", text: "Hitung `rev_jkt_salah` (pakai kota kini) dan `selisih` = salah − benar" },
      ],
      expected: "rev_jkt_benar=100  rev_jkt_salah=60  selisih=-40",
      note: {
        title: "Sering salah",
        body: "Lupa bahwa valid_to = None berarti 'berlaku sampai sekarang'. Tanpa penanganan None, order setelah 10 Maret tidak ketemu kotanya.",
      },
      hints: [
        "Fungsi kota_saat: loop dim, cocokkan cust dan vf <= tgl <= vt (atau vt None).",
        "rev_jkt_benar = sum amount order dengan kota_saat(c, t) == 'Jakarta'.",
        "kota_kini P1 = Bandung: order O1 (40 jt) ikut pindah ke Bandung pada hitungan salah.",
      ],
      code: {
        starter: `# Pelanggan P1 pindah Jakarta -> Bandung pada 2025-03-10.\n# Dimensi SCD tipe 2: (cust, kota, valid_from, valid_to)  -- valid_to None = berlaku kini\ndim = [\n    ("P1", "Jakarta", "2025-01-01", "2025-03-09"),\n    ("P1", "Bandung", "2025-03-10", None),\n    ("P2", "Jakarta", "2025-01-01", None),\n]\n# Order: (order_id, cust, tanggal, amount_jt)\norders = [\n    ("O1", "P1", "2025-02-05", 40), ("O2", "P1", "2025-04-02", 60),\n    ("O3", "P2", "2025-02-20", 25), ("O4", "P2", "2025-05-11", 35),\n]\n# TULIS KODEMU: rev_jkt_benar, rev_jkt_salah, selisih\nrev_jkt_benar = 0\nrev_jkt_salah = 0\nselisih = 0\n`,
        lockLines: 12,
        solution: `# Pelanggan P1 pindah Jakarta -> Bandung pada 2025-03-10.\n# Dimensi SCD tipe 2: (cust, kota, valid_from, valid_to)  -- valid_to None = berlaku kini\ndim = [\n    ("P1", "Jakarta", "2025-01-01", "2025-03-09"),\n    ("P1", "Bandung", "2025-03-10", None),\n    ("P2", "Jakarta", "2025-01-01", None),\n]\n# Order: (order_id, cust, tanggal, amount_jt)\norders = [\n    ("O1", "P1", "2025-02-05", 40), ("O2", "P1", "2025-04-02", 60),\n    ("O3", "P2", "2025-02-20", 25), ("O4", "P2", "2025-05-11", 35),\n]\n\n# TULIS KODEMU: rev_jkt_benar (SCD2), rev_jkt_salah (kota kini), selisih\ndef kota_saat(cust, tgl):\n    for c, kota, vf, vt in dim:\n        if c == cust and vf <= tgl and (vt is None or tgl <= vt):\n            return kota\n    return None\n\nrev_jkt_benar = sum(a for _, c, t, a in orders if kota_saat(c, t) == "Jakarta")\nkota_kini = {"P1": "Bandung", "P2": "Jakarta"}\nrev_jkt_salah = sum(a for _, c, t, a in orders if kota_kini[c] == "Jakarta")\nselisih = rev_jkt_salah - rev_jkt_benar\n\nprint(f"rev_jkt_benar={rev_jkt_benar}  rev_jkt_salah={rev_jkt_salah}  selisih={selisih}")\n`,
        checks: [
          { kind: "equal", task: "t2", name: "rev_jkt_benar", value: 100, label: "`rev_jkt_benar` = 100", msg: "Order dikaitkan ke kota pada tanggal order (SCD2)." },
          { kind: "equal", task: "t3", name: "rev_jkt_salah", value: 60, label: "`rev_jkt_salah` = 60", msg: "Kota kini memindahkan order Feb P1 ke Bandung." },
          { kind: "equal", task: "t3", name: "selisih", value: -40, label: "`selisih` = −40", msg: "salah − benar = 60 − 100." },
        ],
      },
      reference: "SCD tipe 2: join fact ke dimensi memakai rentang tanggal berlaku, bukan key pelanggan saja.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Grain adalah kontrak: satu baris fact = satu peristiwa bisnis yang tak terbagi. Kalau kamu tidak bisa menyelesaikan kalimat 'satu baris di tabel ini adalah satu ___', grain-mu belum benar — dan semua angka di atasnya goyah.",
        "💡 Fan trap tidak berbunyi saat terjadi. Satu-satunya alarm adalah kebiasaan: setiap join fact→dim→dim, tanyakan 'apakah baris fact saya berlipat?' dan buktikan dengan COUNT sebelum dan sesudah join.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: SCD tipe 2 adalah mesin waktu — bayar sewanya dengan sadar",
        body: "Slowly Changing Dimension tipe 2 adalah mesin waktu: ia menyimpan setiap versi kebenaran sehingga laporan lama bisa direproduksi persis seperti hari itu. Kedengarannya wajib — sampai kamu membayar sewanya. Setiap atribut SCD2 melipatgandakan baris dimensi tiap kali berubah, memaksa setiap query historis memakai filter tanggal berlaku yang mudah dilupakan, dan membuat ETL-mu mengelola rentang tanggal alih-alih data. Heuristik praktisinya: SCD2 hanya untuk atribut yang memenuhi DUA syarat — dipakai di filter atau grouping laporan, DAN nilainya pernah dipertanyakan secara historis (\"dulu kota pelanggan ini apa?\"). Atribut yang tidak memenuhi keduanya = tipe 1, timpa saja. Dari pengalaman, 80–90% atribut cukup tipe 1; hanya segelintir seperti status pelanggan atau kategori produk yang benar-benar butuh mesin waktu. Uji termurahnya: tanyakan ke analis, \"pernahkah ada laporan yang menanyakan nilai atribut ini tiga bulan lalu?\" Tidak pernah = tipe 1. Jebakan yang paling mahal adalah SCD2 setengah hati: dimensi berversi tetapi tidak ada satu pun query yang memakai filter tanggal berlakunya — kamu membayar sewa mesin waktu tanpa pernah naik ke dalamnya. Dan ingat: sekali atribut dijadikan SCD2, menurunkannya kembali ke tipe 1 berarti menulis ulang sejarah — keputusan yang hampir tidak pernah diambil. Pilih dengan sadar di awal.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: model apa untuk kebutuhan apa",
      prose: [
        "Skenario 1 — Dashboard & laporan rutin, query agregat cepat oleh banyak orang. → Star schema: join sederhana, mudah dipahami bisnis, SUM aman.",
        "Skenario 2 — Storage mahal / write-heavy, dimensi sangat besar. → Snowflake: normalisasi dimensi bertingkat, hemat tempat, join lebih panjang — boleh, asal tim paham.",
        "Skenario 3 — Eksplorasi ad-hoc cepat oleh satu analis. → Wide table denormalisasi: satu tabel lebar, tanpa join. Wajib dokumentasikan grain-nya besar-besar, karena fan trap mengintai.",
        "Skenario 4 — Dua fact beda grain (order-line vs order-promo). → Jangan join langsung. Agregat masing-masing ke grain yang sama dulu (conformed dimension), baru gabungkan.",
        "Skenario 5 — Atribut dimensi berubah dan histori penting (pelanggan pindah kota). → SCD Tipe 2: baris dimensi baru per perubahan, fact lama tetap menunjuk baris lama. Overwrite (Tipe 1) hanya bila histori tidak penting.",
        "Aturan praktis 10 detik: untuk BI, default = star. Menyimpang dari star harus punya alasan tertulis — bukan karena \u201Ckelihatannya lebih rapi\u201D.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: pelanggan pindah kota, revenue ikut pindah?",
      prose: [
        "Budi (Jakarta) belanja Rp500 ribu di Januari. Februari ia pindah ke Bandung, lalu belanja Rp300 ribu. Dimensi pelanggan memakai SCD Tipe 1 (overwrite kota). Laporan \u201Crevenue per kota 2026\u201D menampilkan Jakarta Rp0, Bandung Rp800 ribu.",
        "Padahal secara historis, Rp500 ribu itu terjadi di Jakarta. Overwrite menulis ulang masa lalu. Dengan SCD Tipe 2, Budi punya dua baris dimensi (Jakarta: Jan, Bandung: Feb–), dan fact Januari tetap menunjuk baris Jakarta: Jakarta Rp500 ribu, Bandung Rp300 ribu.",
        "Keputusan: Tipe 1 hanya untuk koreksi salah ketik (\u201CJkarta\u201D → \u201CJakarta\u201D). Untuk perubahan nyata yang berdampak pada analisis historis, pakai Tipe 2. Biaya: baris dimensi bertambah — murah dibanding laporan historis yang salah.",
        "💡 Intuisi kunci: tanyakan \u201Ckalau atribut ini berubah, apakah laporan tahun lalu boleh berubah?\u201D Ya → Tipe 1. Tidak → Tipe 2. Satu pertanyaan ini menyelesaikan 90% debat SCD.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang data modeling. Perhatikan jebakan grain di setiap soal.",
      ],
      tasks: [],
      summary: [
        "Fact = kejadian terukur; dimensi = konteks (siapa/apa/kapan). Grain = kontrak satu baris.",
        "Star schema: fact di tengah, dimensi N:1 di sekeliling — join ke dimensi tidak menggandakan baris.",
        "Fan trap: join ke tabel multi-nilai menggandakan baris sebelum agregat; agregat dulu, baru join.",
        "Surrogate key melindungi dari perubahan kode natural dan memungkinkan SCD Tipe 2.",
        "Default untuk BI adalah star; penyimpangan butuh alasan tertulis.",
      ],
      next: { label: "BI3 — SQL Analitik untuk BI", href: "/v2/learn/biz3-sql" },
      quiz: [
        {
          q: "Query Rina menghasilkan 3x revenue karena join ke tabel promo (1 order : 3 promo). Perbaikan yang benar?",
          options: [
            { text: "Pakai SELECT DISTINCT sebelum SUM", why: "DISTINCT pada baris duplikat hasil join tidak mengembalikan grain semula — barisnya memang 3x, bukan duplikat semu." },
            { text: "Agregat dulu per grain yang benar, baru join", why: "Tepat: hitung SUM di grain order-line dulu, lalu join hasilnya. Atau jangan join ke tabel multi-nilai sebelum agregat.", correct: true },
            { text: "Ganti INNER JOIN menjadi LEFT JOIN", why: "Jenis join tidak mengubah multiplisitas; LEFT JOIN tetap menggandakan baris yang cocok." },
            { text: "Bagi hasil SUM dengan 3", why: "Menambal gejala, bukan sebab — rapuh begitu jumlah promo per order berubah." },
          ],
        },
        {
          q: "Satu baris fact_penjualan sebaiknya mewakili…",
          options: [
            { text: "Satu order-line (satu produk dalam satu order)", why: "Tepat: grain ini konsisten — qty × harga selalu bermakna, dan agregat ke order/hari/produk semuanya valid.", correct: true },
            { text: "Satu order, dengan produk digabung koma", why: "Melanggar atomicity: tidak bisa agregat per produk tanpa parsing string." },
            { text: "Satu hari, satu toko", why: "Itu grain agregat — valid untuk fact lain (fact_harian), tapi menghilangkan detail produk." },
            { text: "Bebas, asal konsisten", why: "Konsisten saja tidak cukup; grain menentukan pertanyaan apa yang masih bisa dijawab." },
          ],
        },
        {
          q: "Kenapa star schema aman dari fan trap saat join fact ke dimensi?",
          options: [
            { text: "Karena dimensinya kecil", why: "Ukuran tidak relevan; yang penting relasinya." },
            { text: "Karena relasinya selalu N:1 dari fact ke dimensi", why: "Tepat: tiap baris fact menunjuk tepat satu baris dimensi, jadi jumlah baris tidak berubah setelah join.", correct: true },
            { text: "Karena memakai surrogate key", why: "Surrogate key membantu SCD dan performa, bukan mencegah duplikasi baris." },
            { text: "Karena fact tidak boleh di-join", why: "Fact justru selalu di-join ke dimensi; itu pola query BI yang normal." },
          ],
        },
        {
          q: "Pelanggan pindah kota; laporan historis per kota TIDAK boleh berubah. Pilihan tepat?",
          options: [
            { text: "SCD Tipe 1 (overwrite)", why: "Overwrite menulis ulang masa lalu — laporan historis ikut berubah. Salah untuk kasus ini." },
            { text: "SCD Tipe 2 (baris baru per perubahan)", why: "Tepat: fact lama tetap menunjuk baris dimensi lama; histori terjaga.", correct: true },
            { text: "Hapus fact lama", why: "Menghapus data = menghancurkan audit trail. Tidak pernah menjadi solusi modeling." },
            { text: "Buat tabel fact baru", why: "Tidak menyelesaikan masalah atribut dimensi yang berubah." },
          ],
        },
        {
          q: "Kapan wide table (satu tabel denormalisasi) masuk akal?",
          options: [
            { text: "Untuk semua kebutuhan BI", why: "Berlebihan: boros storage dan rawan inkonsistensi untuk pemakaian luas." },
            { text: "Eksplorasi ad-hoc cepat oleh satu analis", why: "Tepat: tanpa join = cepat dieksplorasi; risikonya terkendali karena satu pengguna yang paham grain-nya.", correct: true },
            { text: "Ketika grain belum diketahui", why: "Justru alasan untuk TIDAK denormalisasi — tanpa grain yang jelas, wide table adalah fan trap yang menunggu." },
            { text: "Untuk menggantikan data warehouse", why: "Wide table adalah pola akses, bukan pengganti arsitektur penyimpanan." },
          ],
        },
        {
          q: "Fact penjualan (grain: 1 baris = 1 item order) di-join ke dim_promo (1 order bisa punya 2 promo). Revenue dilaporkan 2x lipat. Akar masalahnya?",
          options: [
            { text: "Surrogate key fact salah generate", why: "Surrogate key tidak ada hubungannya dengan penggandaan baris; ia hanya identifier." },
            { text: "Fan trap: join melewati tabel dengan relasi one-to-many ganda", why: "Tepat: 1 item × 2 promo = 2 baris. Solusinya alokasi (bagi proporsional) atau agregat promo dulu sebelum join — bukan join mentah.", correct: true },
            { text: "Tipe data amount salah (int vs decimal)", why: "Tipe data memengaruhi presisi, bukan melipatgandakan baris." },
            { text: "Query lupa WHERE tahun berjalan", why: "Itu filter, bukan penyebab pelipatan 2x yang sistematis." },
          ],
        },
      ],
    },
  ],
};
