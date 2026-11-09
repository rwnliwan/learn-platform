import type { V2Lesson } from "../lib/types";

// Arsitektur BI suite capstone: 5 mata rantai terisi.
const SUITE_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Lima mata rantai BI: sumber, model, metrik, sajian, keputusan.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="14" y="110" width="88" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c1)" stroke-width="1.5"/>
<text x="58" y="136" text-anchor="middle" fill="var(--text)" font-weight="600">Sumber</text>
<text x="58" y="154" text-anchor="middle" fill="var(--text-muted)">12 order</text>
<text x="58" y="170" text-anchor="middle" fill="var(--text-muted)">BI2</text>
<rect x="116" y="110" width="88" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c2)" stroke-width="1.5"/>
<text x="160" y="136" text-anchor="middle" fill="var(--text)" font-weight="600">Model</text>
<text x="160" y="154" text-anchor="middle" fill="var(--text-muted)">star schema</text>
<text x="160" y="170" text-anchor="middle" fill="var(--text-muted)">BI2·BI3</text>
<rect x="218" y="110" width="88" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c3)" stroke-width="1.5"/>
<text x="262" y="136" text-anchor="middle" fill="var(--text)" font-weight="600">Metrik</text>
<text x="262" y="154" text-anchor="middle" fill="var(--text-muted)">3 KPI kanonis</text>
<text x="262" y="170" text-anchor="middle" fill="var(--text-muted)">BI5·BI11</text>
<rect x="320" y="110" width="88" height="80" rx="10" fill="var(--bg-panel)" stroke="var(--c4)" stroke-width="1.5"/>
<text x="364" y="136" text-anchor="middle" fill="var(--text)" font-weight="600">Sajian</text>
<text x="364" y="154" text-anchor="middle" fill="var(--text-muted)">1+3 dashboard</text>
<text x="364" y="170" text-anchor="middle" fill="var(--text-muted)">BI4·BI7</text>
<rect x="422" y="110" width="88" height="80" rx="10" fill="var(--success-soft)" stroke="var(--success)" stroke-width="2"/>
<text x="466" y="136" text-anchor="middle" fill="var(--success)" font-weight="700">Keputusan</text>
<text x="466" y="154" text-anchor="middle" fill="var(--text)">selamatkan</text>
<text x="466" y="170" text-anchor="middle" fill="var(--text)">kategori Bahan</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1.5">
<line x1="102" y1="150" x2="114" y2="150"/><line x1="204" y1="150" x2="216" y2="150"/><line x1="306" y1="150" x2="318" y2="150"/><line x1="408" y1="150" x2="420" y2="150"/>
</g>
<text x="260" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">BI Suite Kopi Nusantara — 5 mata rantai terisi</text>
<text x="260" y="62" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Tiap mata memakai satu lesson track ini. Rantai putus di satu titik = suite gagal.</text>
<rect x="60" y="220" width="400" height="56" rx="8" fill="var(--error-soft)" stroke="var(--error)"/>
<text x="260" y="242" text-anchor="middle" font-size="12" font-weight="700" fill="var(--error)" font-family="var(--font-ui)">Narasi 3 menit: +4,6% TAPI Bahan −66,7%</text>
<text x="260" y="262" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">Headline baik + peringatan dini = keputusan: investigasi pasokan Bahan minggu ini.</text>
</svg>`;

export const biz14: V2Lesson = {
  slug: "biz14-capstone",
  track: "Business Intelligence",
  module: "Operasi & Governance",
  title: "BI14 — Capstone: BI Suite Satu Perusahaan",
  estMinutes: 85,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "6 minggu membangun BI suite untuk 12 gerai kopi",
      prose: [
        "Kopi Nusantara — 12 gerai, 40 karyawan — memutuskan membangun BI suite dalam 6 minggu. Bukan 47 dashboard, melainkan SATU rantai keputusan yang utuh: dari order mentah sampai keputusan mingguan pemilik.",
        "Minggu 1-2: star schema dari data order (BI2) + SQL tren (BI3). Minggu 3: 3 KPI kanonis anti-gaming (BI5) + metric layer berversi (BI11). Minggu 4: dashboard 1+3 (BI4) + rekonsiliasi otomatis (BI9). Minggu 5: narasi 3 menit untuk pemilik (BI7) + framework adhoc (BI8). Minggu 6: eksperimen pertama — uji promo (BI10).",
        "Twist-nya: suite ini menemukan sesuatu yang \u201Ctidak terlihat\u201D dari kasir harian: revenue naik 4,6% — TAPI kategori Bahan anjlok 66,7%. Headline baik menyembunyikan peringatan dini. Tanpa dekomposisi (BI8), pemilik akan selebrasi sementara pemasok Bahan-nya kolaps.",
        "Di capstone ini kamu akan: (1) membangun star schema + 3 KPI + rekonsiliasi + narasi dalam SATU lab end-to-end; (2) merangkai 13 lesson menjadi arsitektur suite; (3) mempresentasikan narasi 3 menit dari angka yang kamu hitung sendiri.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa merangkai 13 lesson menjadi satu BI suite yang hidup.",
        "(1) Menyusun arsitektur suite 5 mata rantai dan memetakan tiap mata ke lesson track ini;",
        "(2) Memilih 3 KPI kanonis + counter-metric-nya untuk satu perusahaan;",
        "(3) Melakukan rollup KPI tree: gerai → region → perusahaan, tertimbang (bukan rata-rata rasio);",
        "(4) Menyusun narasi 3 menit untuk pemilik: angka, arti, dan aksi — tanpa jargon.",
      ],
      tasks: [],
    },

    {
      id: "arsitektur",
      eyebrow: "Langkah 3 · Arsitektur",
      title: "Merangkai 13 lesson menjadi satu suite",
      prose: [
        "Arsitektur suite = rantai BI dari BI1, kini tiap matanya terisi: SUMBER (order 12 baris — kecil, tapi nyata polanya) → MODEL (star schema BI2, window SQL BI3) → METRIK (3 KPI kanonis BI5+BI11, anti-gaming + berversi) → SAJIAN (dashboard 1+3 BI4, narasi BI7) → KEPUTUSAN (investigasi Bahan).",
        "Prinsip per mata: sumber — grain eksplisit, firewall kualitas (BI9). Model — star default, fan trap dicek. Metrik — tiap KPI punya counter-metric + kartu definisi. Sajian — 1 headline + 3 driver + aksi. Keputusan — pemilik bernama + tanggal review (BI1).",
        "Yang SENGAJA tidak dibangun: self-service penuh (BI6 — tim terlalu kecil), embedded multi-tenant (BI12 — satu perusahaan), NLQ (BI13 — 3 KPI tidak butuh chatbot). Capstone yang baik juga memutuskan apa yang TIDAK dibangun — dan alasannya.",
        "💡 Intuisi kunci: suite kecil yang rantainya utuh mengalahkan platform besar yang rantainya putus. 12 gerai dengan 3 KPI kanonis yang dipakai tiap Senin > 200 dashboard yang tidak dibuka.",
        "Cara membaca: lima kotak berurutan kiri ke kanan — sumber → model → metrik → sajian → keputusan. Setiap kotak berlabel lesson BI yang mengajarinya (mis. sajian = BI4). Panah hanya maju satu arah: tidak ada jalan pintas dari sumber ke keputusan.",
        "Interpretasi: suite yang hidup mengalirkan data sampai menjadi keputusan. Kalau satu mata rantai hilang (mis. tidak ada pemilik metrik), alirannya berhenti di situ — suite-nya ada, keputusannya tidak.",
      ],
      figure: {
        svg: SUITE_SVG,
        alt: "Lima mata rantai BI suite: sumber, model, metrik, sajian, keputusan.",
        caption: "Arsitektur suite: 5 mata rantai, tiap mata memakai lesson track ini. Kotak merah = narasi 3 menit hasil akhirnya.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: capstone = bangun semuanya",
        body: "Capstone = bangun yang PENTING secara utuh, dan dokumentasikan yang ditunda beserta alasannya. \u201CTidak dibangun karena tim 3 orang\u201D adalah keputusan arsitektur yang valid — jauh lebih baik dari setengah jadi yang tidak terpakai.",
      },
    },
    {
      id: "tiga-kpi",
      eyebrow: "Langkah 4 · Tiga KPI",
      title: "Tiga KPI kanonis + counter-metric-nya",
      prose: [
        "KPI 1 — revenue_net (kanonis v1): SUM(amount) WHERE status='paid'. Counter: cancel_rate (menangkap order fiktif). KPI 2 — avg_ticket: revenue / paid orders. Counter: distribusi (median) — rata-rata bisa ditarik 1 order raksasa. KPI 3 — bahan_share: revenue Bahan / revenue total. Counter: tren 4 minggu — penurunan share −68,1% (15,97% → 5,09%) adalah alarm. (Bukan −66,7%: itu penurunan REVENUE Bahan; share turun lebih dalam karena total revenue naik — dua angka, dua definisi, jangan tertukar.)",
        "Tiap KPI punya kartu definisi (BI11): dataset, filter, agregasi, versi, owner. Tanpa kartu = tidak naik ke dashboard.",
        "Uji Goodhart (BI5) per KPI: bagaimana revenue_net bisa naik tanpa perusahaan membaik? Diskon besar-besaran → counter margin menangkap. Bagaimana avg_ticket naik secara palsu? Satu order korporat → median menangkap. Bagaimana bahan_share dimanipulasi? Tidak bisa — ia rasio alami.",
        "💡 Intuisi kunci: paket KPI capstone yang baik selalu punya SATU metrik peringatan dini (bahan_share) — bukan semuanya metrik prestasi. Dashboard tanpa alarm adalah laporan, bukan sistem peringatan.",
      ],
      formula: String.raw`g = \frac{R_{Okt} - R_{Sep}}{R_{Sep}} \qquad d_{Bahan} = \frac{B_{Okt} - B_{Sep}}{B_{Sep}}`,
      formulaNote:
        "g = pertumbuhan revenue Sep→Okt = +4,6% (headline). d_Bahan = perubahan kategori Bahan = −66,7% (peringatan). Dua angka, dua pesan: yang satu untuk selebrasi, yang satu untuk aksi. Suite yang sehat menyajikan keduanya.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: KPI capstone harus semuanya naik",
        body: "KPI peringatan dini yang TURUN (bahan_share) justru KPI paling berharga — ia mencegah kejutan. Suite yang hanya menampilkan kabar baik adalah mesin validasi ego, bukan BI.",
      },
    },
    {
      id: "lab-capstone",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: bangun suite mini end-to-end",
      prose: [
        "Data 12 order (Sep vs Okt) tersedia. Tugasmu merangkai semuanya: (1) bangun `fact` via sqlite + hitung `rev_sep`, `rev_okt`, `growth`; (2) hitung 3 KPI: `avg_ticket_okt`, `cancel_rate_okt`, `bahan_drop`; (3) rekonsiliasi Okt: `bi_okt`, `fin_okt`, `gap_okt` (harus = nilai cancelled); (4) cetak paket narasi 3 menit.",
        "Ini adalah ujian integrasi: tiap langkah memakai satu lesson (BI2 modeling, BI3 SQL, BI5 KPI, BI9 rekonsiliasi, BI7 narasi). Jika satu langkah gagal, narasi akhirmu salah — seperti di dunia nyata.",
        "Coba juga: tulis SATU kalimat headline (≤ 20 kata) dari angka-angkamu untuk pemilik Kopi Nusantara. Contoh: \u201CRevenue naik 4,6% tapi kategori Bahan anjlok 66,7% — investigasi pasokan minggu ini.\u201D (17 kata).",
      ],
      requires: ["sqlite3"],
      tasks: [
        { id: "t1", text: "Bangun fact, hitung `rev_sep`, `rev_okt`, `growth`" },
        { id: "t2", text: "Hitung `avg_ticket_okt`, `cancel_rate_okt`, `bahan_drop`" },
        { id: "t3", text: "Rekonsiliasi: `bi_okt`, `fin_okt`, `gap_okt`" },
        { id: "t4", text: "Cetak paket narasi 3 menit" },
      ],
      expected: "growth=+0.0456  bahan_drop=-0.6667  gap_okt=32000 (tutup)",
      note: {
        title: "Sering salah",
        body: "Mencampur status cancelled ke revenue (lupa WHERE status='paid'). Di capstone, satu filter yang lupa merusak SEMUA angka downstream — KPI, narasi, keputusan. Inilah kenapa definisi kanonis (BI11) ditulis sekali dan dipakai di mana-mana.",
      },
      hints: [
        "fact: SELECT bulan, kategori, qty*harga AS revenue, status FROM stg — atau agregat langsung dengan WHERE status='paid'.",
        "growth = (rev_okt - rev_sep)/rev_sep; bahan_drop = (bahan_okt - bahan_sep)/bahan_sep.",
        "bi_okt = SUM semua status; fin_okt = SUM paid; gap_okt = bi_okt - fin_okt (= 32000, si cancelled O6).",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE stg (id TEXT, bulan TEXT, produk TEXT, kat TEXT, qty INT, harga REAL, status TEXT)")\ncur.executemany("INSERT INTO stg VALUES (?,?,?,?,?,?,?)", [\n    ("S1","Sep","Kopi Arabika","Minuman",2,95000,"paid"),("S2","Sep","Gula Aren","Bahan",1,28000,"paid"),\n    ("S3","Sep","Teh Melati","Minuman",3,32000,"paid"),("S4","Sep","Kopi Robusta","Minuman",2,78000,"paid"),\n    ("S5","Sep","Kopi Arabika","Minuman",1,95000,"cancelled"),("S6","Sep","Gula Aren","Bahan",2,28000,"paid"),\n    ("O1","Okt","Kopi Arabika","Minuman",1,95000,"paid"),("O2","Okt","Teh Melati","Minuman",2,32000,"paid"),\n    ("O3","Okt","Kopi Robusta","Minuman",1,78000,"paid"),("O4","Okt","Gula Aren","Bahan",1,28000,"paid"),\n    ("O5","Okt","Kopi Arabika","Minuman",3,95000,"paid"),("O6","Okt","Teh Melati","Minuman",1,32000,"cancelled")])\n\n# TULIS KODEMU: rev_sep, rev_okt, growth, avg_ticket_okt, cancel_rate_okt, bahan_drop, bi_okt, fin_okt, gap_okt\nrev_sep = 0\nrev_okt = 0\ngrowth = 0.0\navg_ticket_okt = 0.0\ncancel_rate_okt = 0.0\nbahan_drop = 0.0\nbi_okt = 0\nfin_okt = 0\ngap_okt = 0\n\nprint(f"growth={growth:+.4f}  bahan_drop={bahan_drop:.4f}  gap_okt={gap_okt}")\nprint(f"avg_ticket_okt={avg_ticket_okt:.0f}  cancel_rate_okt={cancel_rate_okt:.4f}")`,
        lockLines: 10,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE stg (id TEXT, bulan TEXT, produk TEXT, kat TEXT, qty INT, harga REAL, status TEXT)")\ncur.executemany("INSERT INTO stg VALUES (?,?,?,?,?,?,?)", [\n    ("S1","Sep","Kopi Arabika","Minuman",2,95000,"paid"),("S2","Sep","Gula Aren","Bahan",1,28000,"paid"),\n    ("S3","Sep","Teh Melati","Minuman",3,32000,"paid"),("S4","Sep","Kopi Robusta","Minuman",2,78000,"paid"),\n    ("S5","Sep","Kopi Arabika","Minuman",1,95000,"cancelled"),("S6","Sep","Gula Aren","Bahan",2,28000,"paid"),\n    ("O1","Okt","Kopi Arabika","Minuman",1,95000,"paid"),("O2","Okt","Teh Melati","Minuman",2,32000,"paid"),\n    ("O3","Okt","Kopi Robusta","Minuman",1,78000,"paid"),("O4","Okt","Gula Aren","Bahan",1,28000,"paid"),\n    ("O5","Okt","Kopi Arabika","Minuman",3,95000,"paid"),("O6","Okt","Teh Melati","Minuman",1,32000,"cancelled")])\n\n# TULIS KODEMU: rev_sep, rev_okt, growth, avg_ticket_okt, cancel_rate_okt, bahan_drop, bi_okt, fin_okt, gap_okt\ndef rev_paid(bl):\n    return cur.execute("SELECT SUM(qty*harga) FROM stg WHERE bulan=? AND status='paid'", (bl,)).fetchone()[0]\nrev_sep, rev_okt = rev_paid("Sep"), rev_paid("Okt")\ngrowth = (rev_okt - rev_sep) / rev_sep\nn_okt = cur.execute("SELECT COUNT(*) FROM stg WHERE bulan='Okt' AND status='paid'").fetchone()[0]\navg_ticket_okt = rev_okt / n_okt\ncancel_rate_okt = cur.execute("SELECT COUNT(*) FROM stg WHERE bulan='Okt' AND status='cancelled'").fetchone()[0] / 6\nbahan_sep = cur.execute("SELECT SUM(qty*harga) FROM stg WHERE bulan='Sep' AND kat='Bahan' AND status='paid'").fetchone()[0]\nbahan_okt = cur.execute("SELECT SUM(qty*harga) FROM stg WHERE bulan='Okt' AND kat='Bahan' AND status='paid'").fetchone()[0]\nbahan_drop = (bahan_okt - bahan_sep) / bahan_sep\nbi_okt = cur.execute("SELECT SUM(qty*harga) FROM stg WHERE bulan='Okt'").fetchone()[0]\nfin_okt = rev_okt\ngap_okt = bi_okt - fin_okt\n\nprint(f"growth={growth:+.4f}  bahan_drop={bahan_drop:.4f}  gap_okt={gap_okt}")\nprint(f"avg_ticket_okt={avg_ticket_okt:.0f}  cancel_rate_okt={cancel_rate_okt:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rev_sep", value: 526000, tol: 1.0, label: "`rev_sep` = 526000", msg: "SUM paid September." },
          { kind: "equal", task: "t1", name: "rev_okt", value: 550000, tol: 1.0, label: "`rev_okt` = 550000", msg: "SUM paid Oktober." },
          { kind: "equal", task: "t1", name: "growth", value: 0.0456, tol: 0.0005, label: "`growth` = +0.0456", msg: "(550000-526000)/526000." },
          { kind: "equal", task: "t2", name: "avg_ticket_okt", value: 110000, tol: 1.0, label: "`avg_ticket_okt` = 110000", msg: "550000 / 5 order paid." },
          { kind: "equal", task: "t2", name: "cancel_rate_okt", value: 0.1667, tol: 0.001, label: "`cancel_rate_okt` = 0.1667", msg: "1 dari 6 order." },
          { kind: "equal", task: "t2", name: "bahan_drop", value: -0.6667, tol: 0.001, label: "`bahan_drop` = -0.6667", msg: "(28000-84000)/84000 — alarm!" },
          { kind: "equal", task: "t3", name: "gap_okt", value: 32000, tol: 1.0, label: "`gap_okt` = 32000", msg: "Si cancelled O6 — jembatan menutup." },
          { kind: "stdout_matches", task: "t4", pattern: "growth=\\+0\\.0456\\s+bahan_drop=-0\\.6667\\s+gap_okt=32000", label: "Paket narasi tercetak", msg: "Samakan format." },
        ],
      },
      reference: "Capstone = BI2 (model) + BI3 (SQL) + BI5 (KPI) + BI9 (rekonsiliasi) + BI7 (narasi) dalam satu lab.",
    },    {
      id: "lab2-rollup-kpi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: rollup KPI tree 12 gerai",
      prose: [
        "Capstone berarti merangkai: 12 gerai menjadi 4 region menjadi 1 angka perusahaan. Tugasmu: roll up revenue dan pencapaian (revenue/target) dari level gerai ke region ke total, lalu tandai gerai kritis (< 80% target).",
        "Perhatikan jebakan: pencapaian perusahaan BUKAN rata-rata pencapaian gerai — ia total revenue / total target (tertimbang). Rata-rata sederhana memberi bobot sama ke gerai kecil dan besar.",
        "G12 hanya 50% target — tapi apakah ia kritis atau sekadar kecil? Di narasi 3 menit untuk pemilik, angka ini butuh satu kalimat konteks: 'G12 tutup 5 hari karena renovasi'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rev_total` dan `pencapaian` perusahaan (1 desimal)" },
        { id: "t2", text: "Tentukan `region_terbaik` dari pencapaian tertimbang per region" },
        { id: "t3", text: "Isi `gerai_kritis`: gerai dengan revenue/target < 80%" },
      ],
      expected: "rev_total=1610  pencapaian=91.0%",
      note: {
        title: "Sering salah",
        body: "Merata-ratakan % pencapaian gerai (mean of ratios). Pencapaian agregat = sum(revenue)/sum(target) — rasio dari total, bukan total dari rasio.",
      },
      hints: [
        "rev_total = sum revenue; pencapaian = rev_total/tgt_total*100.",
        "Agregasi per region dulu, baru bagi.",
        "gerai_kritis: r/t < 0.8, urutkan.",
      ],
      code: {
        starter: `# 12 gerai: (gerai, region, revenue_okt_jt, target_okt_jt)\nGERAI = [\n    ("G01","Barat",120,150),("G02","Barat",160,150),("G03","Barat",90,150),\n    ("G04","Timur",200,180),("G05","Timur",170,180),("G06","Timur",185,180),\n    ("G07","Selatan",140,140),("G08","Selatan",100,140),("G09","Selatan",150,140),\n    ("G10","Utara",110,120),("G11","Utara",125,120),("G12","Utara",60,120),\n]\n# TULIS KODEMU: rev_total, pencapaian, region_terbaik, gerai_kritis\nrev_total, pencapaian = 0, 0.0\nregion_terbaik = ''\ngerai_kritis = []\n`,
        lockLines: 7,
        solution: `# 12 gerai: (gerai, region, revenue_okt_jt, target_okt_jt)\nGERAI = [\n    ("G01","Barat",120,150),("G02","Barat",160,150),("G03","Barat",90,150),\n    ("G04","Timur",200,180),("G05","Timur",170,180),("G06","Timur",185,180),\n    ("G07","Selatan",140,140),("G08","Selatan",100,140),("G09","Selatan",150,140),\n    ("G10","Utara",110,120),("G11","Utara",125,120),("G12","Utara",60,120),\n]\n\n# TULIS KODEMU: rev_total, pencapaian, region_terbaik, gerai_kritis\nfrom collections import defaultdict\nrev_total = sum(r for _, _, r, _ in GERAI)\ntgt_total = sum(t for _, _, _, t in GERAI)\npencapaian = round(rev_total / tgt_total * 100, 1)\n\nreg_rev = defaultdict(int); reg_tgt = defaultdict(int)\nfor _, reg, r, t in GERAI:\n    reg_rev[reg] += r; reg_tgt[reg] += t\nach = {reg: reg_rev[reg] / reg_tgt[reg] for reg in reg_rev}\nregion_terbaik = max(ach, key=ach.get)\ngerai_kritis = sorted([g for g, _, r, t in GERAI if r / t < 0.8])\n\nprint(f"rev_total={rev_total}  pencapaian={pencapaian}%")\nprint(f"region_terbaik={region_terbaik}  gerai_kritis={gerai_kritis}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "rev_total", value: 1610, label: "`rev_total` = 1610", msg: "Jumlah revenue 12 gerai." },
          { kind: "equal", task: "t1", name: "pencapaian", value: 91.0, tol: 0.05, label: "`pencapaian` = 91,0%", msg: "1610/1770." },
          { kind: "equal", task: "t2", name: "region_terbaik", value: "Timur", label: "`region_terbaik` = Timur", msg: "Pencapaian tertimbang tertinggi." },
          { kind: "equal", task: "t3", name: "gerai_kritis", value: ["G03", "G08", "G12"], label: "`gerai_kritis` benar", msg: "Di bawah 80% target." },
        ],
      },
      reference: "Rollup tertimbang: agregat dulu, rasio kemudian.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Capstone bukan pameran semua yang kamu bisa — ia kurasi. Suite yang baik berani TIDAK membangun 80% hal yang terpikir, dan bisa menjelaskan kenapa tiap yang dibangun ada di sana.",
        "💡 Satu angka tanpa pemilik = angka mati. Setiap KPI di suite wajib punya nama manusia penanggung jawab dan tanggal review berikutnya — tulis keduanya di dashboard, bukan di dokumen terpisah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: menangkan satu keputusan end-to-end sebelum mengurus dua belas",
        body: "Capstone yang gagal biasanya bukan karena kurang lengkap — melainkan karena terlalu lengkap terlalu dini. Praktisi yang membangun BI suite tahu aturannya: menangkan SATU keputusan end-to-end sebelum mengurus dua belas. Pilih keputusan termahal yang paling sering diulang pemilik bisnis — misalnya reorder stok mingguan 12 gerai — lalu bangun SELURUH rantai untuk itu saja: sumber data, model, satu KPI kanonis, satu dashboard, dan buktikan satu keputusan nyata yang berubah karenanya. Baru setelah ada bukti tertulis \"keputusan X berubah pada tanggal Y karena suite ini\", tambah KPI kedua. Heuristiknya brutal tapi jujur: tidak ada KPI kedua sebelum KPI pertama punya keputusan yang terdokumentasi berubah. Jebakan klasik capstone: belasan lesson dirangkai jadi 40 artefak — dashboard, semantic layer, 15 KPI — dengan NOL keputusan yang berubah. Itu pameran, bukan suite. Aturan keduanya: setiap artefak harus bisa menjawab \"keputusan siapa yang dibantu artefak ini?\" dalam satu kalimat. Tidak bisa = kandidat hapus, seberapa pun keren teknologinya. Dan yang ketiga, rayakan pemotongan: suite yang baik berani TIDAK membangun 80% ide yang muncul, dan bisa menjelaskan kenapa tiap yang dibangun ada di sana. Kurasi adalah skill-nya; kelengkapan adalah jebakannya. Satu rantai keputusan yang hidup mengalahkan sepuluh rantai yang mati.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: apa dulu saat membangun suite",
      prose: [
        "Skenario 1 — Dari nol, tim kecil. → Urutan: 3 KPI kanonis (BI5/BI11) → 1 dashboard (BI4) → rekonsiliasi (BI9). Modeling menyusul saat data tumbuh. Keputusan dulu, arsitektur kemudian.",
        "Skenario 2 — Data sudah besar & berantakan. → Urutan: audit kualitas (BI9) → star schema (BI2) → metric layer (BI11) → baru sajian. Fondasi dulu, cat kemudian.",
        "Skenario 3 — Banyak stakeholder ribut. → Urutan: semantic layer + tier governance (BI6/BI11) → self-service bertahap. Damai definisi dulu, baru kecepatan.",
        "Skenario 4 — Ingin AI/NLQ. → Syarat: metric layer matang + definisi kanonis + scoping benar. AI di atas fondasi berantakan = kebohongan berkecepatan tinggi (BI13).",
        "Skenario 5 — Suite sudah jalan 1 tahun. → Audit: zombie dashboard (BI1), KPI yang di-gaming (BI5), definisi usang (BI11). Suite membusuk tanpa perawatan — jadwalkan audit 90-harian.",
        "Aturan praktis 10 detik: selalu mulai dari keputusan yang paling mahal jika salah, lalu bangun mundur ke data. Bukan dari data maju ke \u201Csemoga berguna\u201D.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: narasi 3 menit untuk pemilik",
      prose: [
        "Senin pagi, pemilik Kopi Nusantara. Narasi 3 menit dari angka lab: MENIT 1 — \u201CRevenue Oktober naik 4,6% ke Rp550 ribu — headline baik.\u201D MENIT 2 — satu chart: dua batang kategori + anotasi \u201CBahan: 84rb → 28rb (−66,7%)\u201D. \u201CKenaikan ini 100% ditopang Minuman; kategori Bahan kolaps.\u201D MENIT 3 — \u201CSo what: Bahan adalah 16% revenue September — jika tren ini menular ke Minuman, kita kehilangan Rp348 rb/bulan (66,7% dari Minuman Rp522 rb). Aksi: investigasi pasokan gula aren minggu ini; pemilik: saya butuh akses ke pemasok.\u201D",
        "Kenapa ini capstone yang lulus: (a) headline jujur (tidak disembunyikan), (b) peringatan dini spesifik (kategori + angka + tren), (c) aksi konkret dengan pemilik dan deadline, (d) semua angka bisa ditelusur ke definisi kanonis.",
        "Yang TIDAK dilakukan: tidak menyalahkan tim, tidak mengusulkan 10 aksi, tidak menampilkan 12 chart. Satu keputusan: investigasi pasokan Bahan. Itulah BI yang bekerja — rantai dari 12 baris order menjadi satu keputusan Senin pagi.",
        "💡 Intuisi kunci: capstone dinilai dari KEPUTUSAN yang dihasilkan, bukan dari kelengkapan suite. Jika setelah presentasimu pemilik tidak melakukan apa-apa, suitnya gagal — seindah apa pun arsitekturnya.",
      ],
      tasks: [],
    },
    {
      id: "paket-domain-bi",
      eyebrow: "Langkah 10 · Paket domain",
      title: "Paket domain: satu domain, satu paket laporan",
      prose: [
        "Direktur keuangan membuka folder bersama berisi 214 file. Ada tiga berkas bernama mirip: `Pendapatan_Q3_final.xlsx`, `Pendapatan_Q3_FINAL2.xlsx`, `Pendapatan_Q3_revisi_tim_sales.xlsx` — angkanya tiga-tiganya berbeda. Tidak ada yang berani bilang mana yang resmi, dan rapat dimulai sepuluh menit lagi. Ini bukan masalah data; ini masalah kurasi.",
        "Paket domain menjawabnya: untuk tiap wilayah bisnis — keuangan, operasional, pemasaran, penjualan — ada SATU paket laporan terkurasi. Paket = daftar resmi laporan domain itu, lengkap dengan definisi tiap metrik, pemiliknya, dan jadwal rilisnya. Bukan folder berisi semua file; melainkan etalase yang hanya memajang yang resmi.",
        "Isi paket yang sehat ada empat: (1) halaman ringkasan domain — satu angka kunci beserta konteksnya; (2) definisi metrik domain beserta pemilik tiap definisi (siapa yang berhak mengubahnya); (3) kalender rilis data — kapan angka diperbarui, sehingga tidak ada yang bertanya `data ini sampai kapan?`; (4) daftar laporan resmi domain — apa pun di luar daftar ini adalah laporan bayangan, bukan bagian paket.",
        "Kenapa ini mengalahkan folder campur aduk? Tiga alasan. Pertama, menemukan: audiens masuk lewat satu pintu, bukan menggeledah 214 file. Kedua, mempercayai: definisi tertulis dan berversi membuat angka bisa dipertahankan di rapat. Ketiga, mengadopsi: yang dipakai terlihat dari statistik baca — yang tidak dibaca siapa pun akhirnya ketahuan dan bisa dipensiunkan.",
        "Satu aturan keras: metrik yang hidup di dua domain harus SAMA angkanya. Pendapatan di paket keuangan = pendapatan di paket penjualan. Kalau berbeda, keduanya mati — kepercayaan audiens runtuh untuk seluruh paket. Solusinya: metrik lintas domain punya SATU definisi kanonis, satu pemilik, dan rekonsiliasi berkala antar paket — prinsip yang sama dengan rekonsiliasi BI–keuangan, kini antar domain.",
        "💡 Intuisi kunci: folder bersama = gudang; paket domain = etalase. Gudang menyimpan segalanya termasuk yang busuk; etalase hanya memajang yang layak jual, dengan label harga (definisi) dan pramuniaga (pemilik) yang jelas. Audiens tidak butuh akses gudang — mereka butuh etalase yang bisa dipercaya.",
      ],
      tasks: [
        { id: "t1", text: "Inventaris 10 laporan yang paling sering kamu buka; kelompokkan ke 4 domain (keuangan/operasional/pemasaran/penjualan) — catat yang tidak jelas domainnya" },
        { id: "t2", text: "Pilih 1 metrik yang muncul di ≥ 2 domain; tulis definisinya dalam 1 kalimat + nama pemiliknya" },
      ],
      note: {
        title: "🚨 Miskonsepsi: paket domain = folder baru bernama domain",
        type: "pitfall",
        body: "Mengganti nama folder tidak mengubah apa-apa. Paket tanpa kurasi — tanpa daftar resmi, definisi, pemilik, dan jadwal — hanyalah gudang berlabel baru. Uji paketmu: bisakah orang baru menemukan angka resmi dalam 2 menit? Kalau tidak, itu folder, bukan paket.",
      },
      reference: "Paket domain = satu pintu per domain: daftar resmi + definisi berversi + pemilik + jadwal rilis.",
    },
    {
      id: "paket-domain-praktik",
      eyebrow: "Langkah 11 · Praktik paket",
      title: "Menyusun & merawat paket domain: dari inventaris ke produk",
      prose: [
        "Menyusun paket domain butuh urutan, bukan semangat. Langkah 1 — inventaris: daftarkan SEMUA laporan yang beredar di domain itu, termasuk yang `hanya dipakai sesekali` (biasanya justru di situlah laporan bayangan bersembunyi). Langkah 2 — petakan pemilik data tiap laporan: siapa yang datanya dipakai, siapa yang paling paham angkanya. Laporan tanpa pemilik = kandidat yatim.",
        "Langkah 3 — sepakati definisi: untuk tiap metrik kunci, tulis definisi 1 kalimat yang disetujui pemiliknya. Di sinilah perang definisi pecah (lihat tiga file Pendapatan di atas) — selesaikan SEKARANG, bukan saat rapat. Langkah 4 — rilis bertahap: mulai dari SATU domain yang paling sakit (biasanya keuangan), buktikan paketnya dipakai, baru replikasi. Empat domain sekaligus = empat perang sekaligus.",
        "Definisi berubah — itu pasti. Bedanya, di dalam paket, perubahan tercatat: catatan rilis paket (versi, tanggal, apa yang berubah, kenapa, siapa menyetujui). Audiens yang membuka paket lama melihat banner `definisi berubah sejak v2.3 — lihat catatan`. Tanpa ini, tren antarperiode diam-diam putus dan tidak ada yang tahu.",
        "Adopsi diukur, bukan diasumsikan. Metrik paket: pembaca aktif per laporan, frekuensi dibuka, dan — yang paling jujur — daftar laporan yatim: 0 pembaca dalam 90 hari. Laporan yatim tidak dihapus diam-diam; ia dipensiunkan lewat prosedur: umumkan, beri masa tenggang, arsipkan. Folder yang tumbuh tanpa pemangkasan akan kembali menjadi gudang.",
        "Dan semua ini butuh satu peran: pemilik produk paket. Bukan `tim BI` secara abstrak — satu nama manusia yang menjaga backlog paket, memimpin review berkala, dan berani memensiunkan laporan yatim milik atasannya. Paket tanpa pemilik = etalase tanpa pramuniaga: lama-lama berdebu.",
        "💡 Intuisi kunci: perlakukan paket domain seperti produk, bukan proyek. Proyek selesai saat rilis; produk hidup selama dipakai. Kalau tidak ada yang mengukur adopsi dan merawat definisi, `paket domain` hanyalah nama keren untuk folder lama. Lab di bawah mensimulasikan penilaian kesehatan paket: susun paket per domain, hitung skornya, putuskan mana yang siap rilis.",
      ],
      tasks: [
        { id: "t1", text: "Kelompokkan LAPORAN per domain menjadi dict `paket`: domain → daftar nama laporan" },
        { id: "t2", text: "Hitung `kesehatan` per domain: [fraksi definisi konsisten, fraksi berpemilik, fraksi dibaca] — bulatkan 2 desimal" },
        { id: "t3", text: "Tentukan `status_paket` per domain: `siap rilis` bila ketiga skor ≥ 0,75, selainnya `butuh perbaikan`; cetak ringkasan" },
      ],
      expected: "keuangan & operasional: siap rilis | pemasaran & penjualan: butuh perbaikan (ada skor < 75%)",
      note: {
        title: "🚨 Miskonsepsi: paket dirilis sekali, lalu selesai",
        type: "pitfall",
        body: "Definisi berubah, pemilik pindah, kebutuhan bergeser. Paket yang tidak dirawat kembali menjadi folder dalam 6 bulan. Rilis adalah awal perawatan, bukan akhir pekerjaan — itu bedanya produk dan proyek.",
      },
      hints: [
        "Kelompokkan dulu: paket[domain].append(nama) untuk tiap baris LAPORAN.",
        "Skor = [definisi_konsisten, pemilik_ada, pembaca>0] sebagai fraksi 0–1; round(..., 2).",
        "Siap rilis bila all(s >= 0.75 for s in skor).",
      ],
      code: {
        starter: `# 12 laporan lintas 4 domain: (nama, domain, definisi_konsisten, pemilik, pembaca_aktif)\nLAPORAN = [\n    ("Laba Rugi Bulanan", "keuangan", True, "Dinda", 12),\n    ("Arus Kas Mingguan", "keuangan", True, "Dinda", 9),\n    ("Aging Piutang", "keuangan", False, None, 4),\n    ("Biaya per Gerai", "keuangan", True, "Raka", 7),\n    ("Target vs Realisasi Gerai", "operasional", True, "Raka", 11),\n    ("Lead Time Pasokan", "operasional", False, "Raka", 3),\n    ("Stok Bahan per Gerai", "operasional", True, None, 8),\n    ("Absensi & Lembur", "operasional", True, "Tania", 5),\n    ("Konversi Campaign", "pemasaran", False, None, 0),\n    ("Biaya Iklan per Channel", "pemasaran", True, "Nadia", 6),\n    ("Penjualan per Channel", "penjualan", True, "Nadia", 10),\n    ("Pipeline & Win Rate", "penjualan", False, "Bagas", 2),\n]\n\n# TULIS KODEMU: paket, kesehatan, status_paket\npaket = {}\nkesehatan = {}\nstatus_paket = {}\n`,
        lockLines: 17,
        solution: `# 12 laporan lintas 4 domain: (nama, domain, definisi_konsisten, pemilik, pembaca_aktif)\nLAPORAN = [\n    ("Laba Rugi Bulanan", "keuangan", True, "Dinda", 12),\n    ("Arus Kas Mingguan", "keuangan", True, "Dinda", 9),\n    ("Aging Piutang", "keuangan", False, None, 4),\n    ("Biaya per Gerai", "keuangan", True, "Raka", 7),\n    ("Target vs Realisasi Gerai", "operasional", True, "Raka", 11),\n    ("Lead Time Pasokan", "operasional", False, "Raka", 3),\n    ("Stok Bahan per Gerai", "operasional", True, None, 8),\n    ("Absensi & Lembur", "operasional", True, "Tania", 5),\n    ("Konversi Campaign", "pemasaran", False, None, 0),\n    ("Biaya Iklan per Channel", "pemasaran", True, "Nadia", 6),\n    ("Penjualan per Channel", "penjualan", True, "Nadia", 10),\n    ("Pipeline & Win Rate", "penjualan", False, "Bagas", 2),\n]\n\nfrom collections import defaultdict\n\n_p = defaultdict(list)\nfor nama, dom, _, _, _ in LAPORAN:\n    _p[dom].append(nama)\npaket = dict(_p)\n\nkesehatan = {}\nfor dom in paket:\n    rows = [r for r in LAPORAN if r[1] == dom]\n    n = len(rows)\n    d = sum(1 for r in rows if r[2]) / n\n    o = sum(1 for r in rows if r[3] is not None) / n\n    b = sum(1 for r in rows if r[4] > 0) / n\n    kesehatan[dom] = [round(d, 2), round(o, 2), round(b, 2)]\n\nstatus_paket = {}\nfor dom, skor in kesehatan.items():\n    status_paket[dom] = "siap rilis" if all(s >= 0.75 for s in skor) else "butuh perbaikan"\n\nprint(f"paket={sorted(paket)}")\nfor dom in sorted(kesehatan):\n    print(f"{dom}: {kesehatan[dom]} -> {status_paket[dom]}")\n`,
        checks: [
          { kind: "defined", task: "t1", name: "paket", label: "`paket` terdefinisi", msg: "Kelompokkan LAPORAN per domain." },
          { kind: "defined", task: "t2", name: "kesehatan", label: "`kesehatan` terdefinisi", msg: "Hitung tiga skor per domain." },
          { kind: "equal", task: "t2", name: "kesehatan", value: {"keuangan": [0.75, 0.75, 1.0], "operasional": [0.75, 0.75, 1.0], "pemasaran": [0.5, 0.5, 0.5], "penjualan": [0.5, 1.0, 1.0]}, label: "Skor kesehatan 4 domain benar", msg: "keuangan/operasional [0.75,0.75,1.0]; pemasaran [0.5,0.5,0.5]; penjualan [0.5,1.0,1.0]." },
          { kind: "equal", task: "t3", name: "status_paket", value: {"keuangan": "siap rilis", "operasional": "siap rilis", "pemasaran": "butuh perbaikan", "penjualan": "butuh perbaikan"}, label: "`status_paket` benar", msg: "Siap rilis bila ketiga skor >= 0.75." },
          { kind: "stdout_matches", task: "t3", pattern: "pemasaran: \\[0\\.5, 0\\.5, 0\\.5\\] -> butuh perbaikan", label: "Ringkasan tercetak", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "Paket = produk hidup: inventaris → definisi disepakati → rilis bertahap → catatan rilis → ukur adopsi → pensiunkan yang yatim.",
    },
    {
      id: "model-dbt-bertes",
      eyebrow: "Tambahan · BZ-C1",
      title: "Model dbt bertes: mart KPI gerai yang tidak bisa berbohong",
      prose: [
        "Capstone ini sejauh ini membangun dashboard eksekutif dan metric tree — tetapi dari mana angka dashboard itu datang? Dari model dbt (lihat BI21): stg_penjualan → int_penjualan → mart_kpi_gerai → dashboard_eksekutif. Lesson ini merangkaikan BI21 ke capstone: mart KPI gerai diuji dengan empat tes skema dbt — unique, not_null, accepted_values, relationships — SEBELUM dashboard membacanya. Dashboard yang membaca mart tanpa tes sedang membaca janji yang belum diuji.",
        "Data lab (ilustratif, sengaja kotor): mart_kpi_gerai berisi 5 baris dengan id G1, G2, G3, G2 (duplikat!), G4; satu baris tanpa tanggal (G3); satu status 'pending' (bukan 'aktif'/'tutup'); satu gerai_id G9 yang tidak ada di dim_gerai. Empat tes BI21 menangkap keempatnya: unik gagal pada G2, tidak_null gagal pada G3, nilai_diterima gagal pada 'pending', relasi gagal pada G9. Hasil: 4 dari 4 tes GAGAL — dan dashboard_eksekutif sebagai hilirnya dinyatakan TERDAMPAK: tidak boleh terbit sampai mart diperbaiki.",
        "Pelajaran capstone-nya: tes dbt bukan 'tambahan BI21' — ia adalah GERBANG antara model dan dashboard. Dalam arsitektur capstone, urutannya: model dbt dibangun → tes dijalankan (dbt build) → bila lolos, dashboard membaca mart; bila gagal, pipeline berhenti dengan nama tes yang gagal dan nilai bermasalahnya. Analis yang melewati gerbang ini sedang membangun dashboard di atas data yang ia sendiri tidak berani jamin.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan 4 tes dan isi `hasil` dengan nilai bermasalah tiap tes" },
        { id: "t2", text: "Isi `daftar_gagal` (nama tes yang gagal) dan `jumlah_gagal`" },
        { id: "t3", text: "Isi `dampak` — model/dasbor hilir yang terdampak" },
        { id: "t4", text: "Cetak ringkasan: jumlah tes gagal dan yang terdampak" },
      ],
      expected: "TES GAGAL: 4 dari 4 / TERDAMPAK: dashboard_eksekutif",
      hints: [
        "unik: kumpulkan id, cari yang muncul lebih dari sekali.",
        "relasi: gerai_id harus ada di {g['id'] for g in dim_gerai}.",
        "dampak: ikuti panah DAG — dashboard_eksekutif membaca mart_kpi_gerai.",
      ],
      code: {
        starter: `# Data tertanam (sengaja kotor) — JANGAN ubah blok ini\nmart_kpi_gerai = [\n    {"id": "G1", "tanggal": "2026-09-01", "gerai_id": "G1", "status": "aktif", "nilai": 1200000},\n    {"id": "G2", "tanggal": "2026-09-02", "gerai_id": "G9", "status": "aktif", "nilai": 900000},\n    {"id": "G3", "tanggal": None,         "gerai_id": "G1", "status": "aktif", "nilai": 1500000},\n    {"id": "G2", "tanggal": "2026-09-04", "gerai_id": "G2", "status": "aktif", "nilai": 800000},\n    {"id": "G4", "tanggal": "2026-09-05", "gerai_id": "G2", "status": "pending", "nilai": 600000},\n]\ndim_gerai = [\n    {"id": "G1", "nama": "Gerai Pusat"},\n    {"id": "G2", "nama": "Gerai Timur"},\n    {"id": "G3", "nama": "Gerai Barat"},\n    {"id": "G4", "nama": "Gerai Utara"},\n    {"id": "G5", "nama": "Gerai Selatan"},\n]\n# DAG: stg_penjualan -> int_penjualan -> mart_kpi_gerai -> dashboard_eksekutif\n# TULIS KODEMU DI BAWAH INI\n\nhasil = {}\ndaftar_gagal = []\njumlah_gagal = 0\ndampak = []\n\nprint(f"TES GAGAL: {jumlah_gagal} dari 4")\nprint(f"TERDAMPAK: {', '.join(dampak)}")`,
        lockLines: 17,
        solution: `# Data tertanam (sengaja kotor) — JANGAN ubah blok ini\nmart_kpi_gerai = [\n    {"id": "G1", "tanggal": "2026-09-01", "gerai_id": "G1", "status": "aktif", "nilai": 1200000},\n    {"id": "G2", "tanggal": "2026-09-02", "gerai_id": "G9", "status": "aktif", "nilai": 900000},\n    {"id": "G3", "tanggal": None,         "gerai_id": "G1", "status": "aktif", "nilai": 1500000},\n    {"id": "G2", "tanggal": "2026-09-04", "gerai_id": "G2", "status": "aktif", "nilai": 800000},\n    {"id": "G4", "tanggal": "2026-09-05", "gerai_id": "G2", "status": "pending", "nilai": 600000},\n]\ndim_gerai = [\n    {"id": "G1", "nama": "Gerai Pusat"},\n    {"id": "G2", "nama": "Gerai Timur"},\n    {"id": "G3", "nama": "Gerai Barat"},\n    {"id": "G4", "nama": "Gerai Utara"},\n    {"id": "G5", "nama": "Gerai Selatan"},\n]\n# DAG: stg_penjualan -> int_penjualan -> mart_kpi_gerai -> dashboard_eksekutif\n# TULIS KODEMU DI BAWAH INI\n\nids = [r["id"] for r in mart_kpi_gerai]\nhasil = {\n    "unik": sorted({i for i in ids if ids.count(i) > 1}),\n    "tidak_null": [r["id"] for r in mart_kpi_gerai if r["tanggal"] is None],\n    "nilai_diterima": sorted({r["status"] for r in mart_kpi_gerai} - {"aktif", "tutup"}),\n    "relasi": sorted({r["gerai_id"] for r in mart_kpi_gerai} - {g["id"] for g in dim_gerai}),\n}\ndaftar_gagal = [nama for nama, bermasalah in hasil.items() if bermasalah]\njumlah_gagal = len(daftar_gagal)\ndampak = ["dashboard_eksekutif"] if daftar_gagal else []\n\nprint(f"TES GAGAL: {jumlah_gagal} dari 4")\nprint(f"TERDAMPAK: {', '.join(dampak)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "hasil", label: "`hasil` terdefinisi", msg: "Isi dict hasil dengan 4 tes." },
          { kind: "equal", task: "t2", name: "daftar_gagal", value: ["unik", "tidak_null", "nilai_diterima", "relasi"], label: "`daftar_gagal` berisi 4 tes", msg: "Keempat tes gagal pada data ini — urutan: unik, tidak_null, nilai_diterima, relasi." },
          { kind: "equal", task: "t2", name: "jumlah_gagal", value: 4, label: "`jumlah_gagal` = 4", msg: "Hitung dari panjang daftar_gagal." },
          { kind: "equal", task: "t1", name: "hasil", value: {"unik": ["G2"], "tidak_null": ["G3"], "nilai_diterima": ["pending"], "relasi": ["G9"]}, label: "`hasil` berisi nilai bermasalah yang tepat", msg: "unik: G2 ganda; tidak_null: G3 tanpa tanggal; nilai_diterima: pending; relasi: G9 tak terdaftar." },
          { kind: "stdout_matches", task: "t4", pattern: "TES GAGAL: 4 dari 4", label: "Output menampilkan jumlah tes gagal", msg: "Samakan format print dengan contoh." },
          { kind: "stdout_matches", task: "t4", pattern: "TERDAMPAK: dashboard_eksekutif", label: "Output menampilkan dampak", msg: "Ikuti panah DAG dari mart_kpi_gerai." },
        ],
      },
      reference: "dbt = kontrak sebelum dashboard: 4 tes (unique, not_null, accepted_values, relationships) sebagai gerbang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu — dan kelulusan track",
      prose: [
        "Lima pertanyaan terakhir track Business Intelligence. Setiap soal merangkai beberapa lesson.",
      ],
      tasks: [],
      summary: [
        "Catatan jalur: lesson setelah capstone ini (BI15 dan seterusnya) adalah modul lanjutan opsional — capstone ini sudah menutup rangkaian inti BI1–BI14.",
        "Model dbt bertes: mart_kpi_gerai GAGAL 4 dari 4 tes (unique, not_null, accepted_values, relationships) pada data lab yang sengaja kotor — dashboard tidak boleh terbit sampai mart diperbaiki.",
        "Suite = rantai keputusan utuh: sumber → model → metrik → sajian → keputusan.",
        "Mulai dari keputusan termahal, bangun mundur ke data.",
        "Tiap KPI: kartu definisi + counter-metric + versi.",
        "Dashboard: 1 headline + 3 driver + aksi; narasi 3 menit.",
        "Audit 90-harian: zombie, gaming, definisi usang — suite membusuk tanpa perawatan.",
        "Selamat! Kamu menyelesaikan inti (core) track Business Intelligence — lesson BI1–BI14. Lesson BI15+ adalah pendalaman opsional, bukan bagian dari inti yang ditutup capstone ini.",
      ],
      next: { label: "BI15 — DAX: Measures & Time Intelligence", href: "/v2/learn/biz15-dax" },
      quiz: [
        {
          q: "Revenue +4,6% tapi Bahan −66,7%. Narasi 3 menit yang benar?",
          options: [
            { text: "Fokus selebrasi +4,6%, Bahan dibahas lain waktu", why: "Menyembunyikan peringatan dini = kegagalan BI." },
            { text: "Headline jujur + peringatan spesifik + aksi investigasi minggu ini", why: "Tepat: merangkai BI4, BI7, BI8 dalam satu narasi.", correct: true },
            { text: "Jangan laporkan Bahan agar pemilik tenang", why: "Dashboard propaganda, bukan BI." },
            { text: "Tampilkan 12 chart agar lengkap", why: "Kelengkapan mengalahkan fokus — gagal uji 3 detik." },
          ],
        },
        {
          q: "Tim 3 orang mulai dari nol. Urutan bangun yang tepat?",
          options: [
            { text: "Data warehouse enterprise 6 bulan", why: "Berlebihan untuk tim 3 orang." },
            { text: "3 KPI kanonis → 1 dashboard → rekonsiliasi; modeling menyusul", why: "Tepat: keputusan dulu, arsitektur kemudian.", correct: true },
            { text: "Chatbot NLQ dulu agar keren", why: "AI di atas fondasi berantakan = kebohongan cepat (BI13)." },
            { text: "47 dashboard sekaligus", why: "Itu cara membuat 47 zombie (BI1)." },
          ],
        },
        {
          q: "Gap rekonsiliasi 32.000 = tepat nilai 1 order cancelled. Artinya?",
          options: [
            { text: "Kebetulan", why: "Terlalu pas untuk kebetulan — selidiki." },
            { text: "Jembatan menutup: penyebab bernama (cancelled O6), suite tepercaya", why: "Tepat: prinsip BI9.", correct: true },
            { text: "Abaikan, kecil", why: "Selisih bernama harus dicatat, bukan diabaikan." },
            { text: "Hapus order itu", why: "Menghapus data merusak audit trail." },
          ],
        },
        {
          q: "KPI mana yang PALING berharga di suite ini?",
          options: [
            { text: "Revenue — karena terbesar", why: "Terbesar belum tentu paling berharga." },
            { text: "bahan_drop (−66,7%) — peringatan dini yang mencegah kejutan", why: "Tepat: nilai BI ada di keputusan yang diubah, dan alarm mengubah keputusan.", correct: true },
            { text: "avg_ticket — karena paling stabil", why: "Stabil = tidak memberi sinyal aksi." },
            { text: "cancel_rate — karena paling mudah dihitung", why: "Kemudahan bukan kriteria nilai." },
          ],
        },
        {
          q: "Setahun suite berjalan. Agenda audit 90-harian mencakup…",
          options: [
            { text: "Tambah 10 dashboard baru", why: "Menambah tanpa audit = menanam zombie." },
            { text: "Zombie dashboard, KPI yang di-gaming, definisi usang", why: "Tepat: BI1 + BI5 + BI11.", correct: true },
            { text: "Ganti semua tools", why: "Tools jarang akar masalah." },
            { text: "Tidak perlu audit jika berjalan baik", why: "Berjalan baik hari ini ≠ besok; pembusukan itu diam-diam." },
          ],
        },
        {
          q: "Pencapaian perusahaan 91% tapi 3 gerai kritis (<80%). Narasi 3 menit untuk pemilik harus...",
          options: [
            { text: "Fokus pada 91% — kabar baik menenangkan", why: "91% menenangkan tapi menyembunyikan 3 gerai yang berdarah. Pemilik butuh tahu di mana apinya, bukan rata-rata suhunya." },
            { text: "Buka dengan 3 gerai kritis + aksi per gerai, tutup dengan 91% sebagai konteks", why: "Tepat piramida terbalik untuk krisis: masalah dulu (di mana, seberapa besar, apa aksinya), konteks menenangkan kemudian. Rata-rata tidak memadamkan api.", correct: true },
            { text: "Tampilkan tabel 12 gerai lengkap", why: "12 baris dalam 3 menit = tidak ada yang diingat kecuali kebingungan. Kurasi adalah pekerjaanmu, bukan pemilik." },
            { text: "Bandingkan dengan kompetitor", why: "Kompetitor tidak menjelaskan kenapa G12 hanya 50%. Benchmark eksternal bukan obat untuk masalah internal." },
          ],
        },
      ],
    },
  ],
};
