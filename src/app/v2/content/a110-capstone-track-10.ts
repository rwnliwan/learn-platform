import type { V2Lesson } from "../lib/types";

const A110_SCHEMA = `CREATE TABLE nasabah (
  nasabah_id TEXT PRIMARY KEY,
  nama TEXT,
  kota TEXT,
  penghasilan_jt REAL
);
CREATE TABLE transaksi (
  id TEXT PRIMARY KEY,
  nasabah_id TEXT,
  nominal_jt REAL,
  dpd INTEGER,
  tujuan TEXT
);`;

const A110_SEED = `INSERT INTO nasabah VALUES ('N001', 'Andi', 'Makassar', 4);
INSERT INTO nasabah VALUES ('N002', 'Budi', 'Jakarta', 8);
INSERT INTO nasabah VALUES ('N003', 'Citra', 'Bandung', 12);
INSERT INTO nasabah VALUES ('N004', 'Dedi', 'Surabaya', 3);
INSERT INTO nasabah VALUES ('N005', 'Eka', 'Medan', 20);
INSERT INTO transaksi VALUES ('T001', 'N001', 10, 0, 'modal kerja');
INSERT INTO transaksi VALUES ('T002', 'N001', 15, 120, 'konsumsi');
INSERT INTO transaksi VALUES ('T003', 'N002', 20, 0, 'modal kerja');
INSERT INTO transaksi VALUES ('T004', 'N002', 25, 30, 'konsumsi');
INSERT INTO transaksi VALUES ('T005', 'N003', 50, 0, 'investasi');
INSERT INTO transaksi VALUES ('T006', 'N003', 30, 95, 'konsumsi');
INSERT INTO transaksi VALUES ('T007', 'N004', 8, 150, 'konsumsi');
INSERT INTO transaksi VALUES ('T008', 'N004', 12, 0, 'modal kerja');
INSERT INTO transaksi VALUES ('T009', 'N005', 100, 0, 'investasi');
INSERT INTO transaksi VALUES ('T010', 'N005', 60, 10, 'modal kerja');`;

export const a110: V2Lesson = {
  slug: "a110-capstone-track-10",
  track: "Statistika",
  module: "Capstone",
  title: "A1.10 Capstone Track 10: Pipeline Kredit dari SQL ke Python",
  estMinutes: 60,
  steps: [
    {
      id: "brief",
      eyebrow: "Langkah 1 · Brief capstone",
      title: "Brief: analis junior, Bank Maju Jaya, 10.000 transaksi sintetis",
      prose: [
        "Peranmu: analis kredit junior di Bank Maju Jaya. Klienmu adalah direksi bank, yang meminta jawaban atas satu pertanyaan: di segmen mana kredit macet terkonsentrasi, dan apa yang harus bank lakukan mulai bulan depan? Dataset yang kamu terima berisi 10.000 transaksi kredit — SINTETIS dan berlabel ilustratif, dibuat untuk latihan, bukan data nasabah sungguhan.",
        "Grain dataset ini: satu baris sama dengan satu transaksi kredit. Satu nasabah bisa punya lebih dari satu transaksi, jadi menghitung nasabah dan menghitung transaksi adalah dua hal yang berbeda — kesalahan grain di sini merambat ke semua angka di bawahnya. Dokumentasikan grain di baris pertama setiap notebook dan query-mu.",
        "Deliverable capstone ini ada dua: (1) laporan satu halaman untuk direksi — temuan, angka kunci, rekomendasi, dan batasan; (2) pipeline yang bisa diulang — query SQL yang sama, notebook Python yang sama, dan hasil yang sama bila dijalankan ulang minggu depan. Laporan yang tidak bisa direproduksi adalah opini; pipeline yang tidak bisa dijelaskan ke direksi adalah hobi.",
      ],
      tasks: [],
      note: {
        title: "Aturan capstone",
        type: "risk",
        body: "Semua angka dalam lesson ini sintetis dan berlabel ilustratif. Jangan mengutipnya sebagai fakta tentang bank mana pun. Yang dinilai adalah caramu bekerja: grain yang benar, audit kualitas, perhitungan yang bisa dilacak, dan rekomendasi yang jujur tentang batasannya.",
      },
      reference: "Grain: satu baris = satu transaksi. Deliverable: laporan 1 halaman + pipeline yang bisa diulang.",
    },
    {
      id: "sql-lab",
      eyebrow: "Langkah 2 · Lab SQL",
      title: "Lab SQL: agregasi per nasabah dan filter macet",
      prose: [
        "Langkah pertama pipeline adalah SQL: agregasi dilakukan di database, bukan di notebook. Skema lab berisi dua tabel: nasabah (nasabah_id, nama, kota, penghasilan_jt) dan transaksi (id, nasabah_id, nominal_jt, dpd, tujuan). Seed-nya 5 nasabah dan 10 transaksi — potongan kecil yang sengaja dibuat deterministik supaya kamu bisa menghitung jawaban yang diharapkan dengan tangan.",
        "Tugasmu: untuk setiap nasabah, tampilkan nama, jumlah transaksi, total nominal, dan DPD maksimum — lalu saring hanya nasabah yang punya transaksi macet, yaitu DPD maksimum 90 atau lebih. Urutkan berdasarkan total nominal dari yang terbesar. Perhatikan: filter DPD maksimum memakai HAVING, bukan WHERE, karena ia menyaring HASIL agregasi, bukan baris mentah.",
        "Jawaban yang diharapkan (dihitung dari seed): Citra 2 transaksi, total Rp80 juta, DPD maks 95; Andi 2 transaksi, total Rp25 juta, DPD maks 120; Dedi 2 transaksi, total Rp20 juta, DPD maks 150. Budi dan Eka tidak muncul karena DPD maksimum mereka di bawah 90.",
      ],
      tasks: [
        { id: "t1", text: "Tulis SELECT dengan JOIN nasabah-transaksi, GROUP BY nama, HAVING MAX(dpd) 90 atau lebih, ORDER BY total_nominal DESC" },
      ],
      sqlLab: {
        task: "Tampilkan nama, jumlah transaksi (n_trx), total nominal (total_nominal), dan DPD maksimum (dpd_max) per nasabah, hanya untuk nasabah dengan DPD maksimum 90 atau lebih. Urutkan total_nominal dari terbesar (ORDER BY total_nominal DESC).",
        schema: A110_SCHEMA,
        seedData: A110_SEED,
        starter: "SELECT\n",
        solution: "SELECT n.nama, COUNT(*) AS n_trx, SUM(t.nominal_jt) AS total_nominal, MAX(t.dpd) AS dpd_max FROM transaksi t JOIN nasabah n ON t.nasabah_id = n.nasabah_id GROUP BY n.nama HAVING MAX(t.dpd) >= 90 ORDER BY total_nominal DESC",
        expectedColumns: ["nama", "n_trx", "total_nominal", "dpd_max"],
        expectedRows: [["Citra", 2, 80.0, 95], ["Andi", 2, 25.0, 120], ["Dedi", 2, 20.0, 150]],
        orderMatters: true,
      },
      reference: "Agregasi di SQL: GROUP BY untuk per nasabah, HAVING untuk filter hasil agregasi, MAX(dpd) untuk status macet.",
    },
    {
      id: "cleaning-lab",
      eyebrow: "Langkah 3 · Lab Python",
      title: "Lab cleaning: missing, duplikat, dan umur 250 tahun",
      prose: [
        "Data kotor sintetis (ilustratif) di lab ini berisi 10 pengajuan: penghasilan kosong pada 3 dari 10 baris, ID pengajuan 102 muncul dua kali, dan umur 250 muncul dua kali. Tugasmu: hitung dulu seberapa kotor datanya, baru bersihkan — urutan ini penting, karena angka kotornya sendiri adalah temuan yang masuk laporan.",
        "Keputusan cleaning yang dipakai di sini: (1) duplikat ID 102 dibuang dengan menyimpan kemunculan PERTAMA saja, sehingga tersisa 9 baris; (2) umur 250 ditandai tidak valid dan dikeluarkan dari perhitungan rata-rata umur, bukan dihapus diam-diam — barisnya tetap ada, nilainya yang tidak dipakai; (3) penghasilan kosong TIDAK diisi dengan rata-rata, karena dari lesson EDA kamu tahu missing bisa menjadi sinyal risiko — ia dilaporkan apa adanya.",
        "Hasil yang diharapkan: miss rate penghasilan 30,0% (3 dari 10), duplikat 1, outlier umur 2, baris bersih 9. Setelah dibersihkan, rata-rata penghasilan (dari 6 nilai yang terisi) adalah Rp8,83 juta, dan rata-rata umur valid (7 nilai, tanpa 250) adalah 30,14 tahun. Perhatikan: rata-rata penghasilan sebelum cleaning tidak bisa dihitung dengan jujur tanpa keputusan tentang missing — itulah kenapa audit mendahului analisis.",
      ],
      formula: String.raw`\text{miss rate} = \frac{n_{kosong}}{n_{total}} \times 100\%`,
      formulaNote: "miss rate = persentase nilai kosong pada kolom itu; n_kosong = baris kosong; n_total = total baris sebelum cleaning (10 pada lab ini).",
      tasks: [
        { id: "t1", text: "Hitung `miss_rate` penghasilan (persen) dan `duplikat` (ID ganda)" },
        { id: "t2", text: "Hitung `outlier` (umur di atas 100) dan `n_bersih` setelah dedup ID" },
        { id: "t3", text: "Hitung `mean_peng_bersih` dan `mean_umur_valid` setelah cleaning" },
      ],
      expected: "miss_rate=30.0  duplikat=1  outlier=2  n_bersih=9  mean_peng_bersih=8.83  mean_umur_valid=30.14",
      hints: [
        "miss_rate = jumlah None di penghasilan / 10 * 100.",
        "duplikat = len(ids) - len(set(ids)); outlier = jumlah umur di atas 100.",
        "Dedup dengan menyimpan kemunculan pertama tiap ID; rata-rata umur valid hanya dari umur di bawah 100.",
      ],
      code: {
        starter: `# Data kotor sintetis (ilustratif): 10 pengajuan\nids = [101, 102, 103, 102, 104, 105, 106, 107, 108, 109]\numur = [25, 32, 250, 41, 28, 19, 33, 250, 45, 29]\npenghasilan = [5, None, 8, 12, None, 4, 20, 7, None, 9]\n\n# TULIS KODEMU\nmiss_rate = \nduplikat = \noutlier = \n# dedup: simpan kemunculan pertama tiap ID\nseen, kept = set(), []\nfor i, u, p in zip(ids, umur, penghasilan):\n    if i not in seen:\n        seen.add(i)\n        kept.append((u, p))\nn_bersih = \nmean_peng_bersih = \nmean_umur_valid = \n\nprint(f"miss_rate={miss_rate}  duplikat={duplikat}  outlier={outlier}  n_bersih={n_bersih}  mean_peng_bersih={mean_peng_bersih}  mean_umur_valid={mean_umur_valid}")`,
        lockLines: 5,
        solution: `# Data kotor sintetis (ilustratif): 10 pengajuan\nids = [101, 102, 103, 102, 104, 105, 106, 107, 108, 109]\numur = [25, 32, 250, 41, 28, 19, 33, 250, 45, 29]\npenghasilan = [5, None, 8, 12, None, 4, 20, 7, None, 9]\n\n# TULIS KODEMU\nmiss_rate = round(sum(1 for x in penghasilan if x is None) / len(penghasilan) * 100, 2)\nduplikat = len(ids) - len(set(ids))\noutlier = sum(1 for x in umur if x > 100)\n# dedup: simpan kemunculan pertama tiap ID\nseen, kept = set(), []\nfor i, u, p in zip(ids, umur, penghasilan):\n    if i not in seen:\n        seen.add(i)\n        kept.append((u, p))\nn_bersih = len(kept)\nmean_peng_bersih = round(sum(p for _, p in kept if p is not None) / sum(1 for _, p in kept if p is not None), 2)\nmean_umur_valid = round(sum(u for u, _ in kept if u < 100) / sum(1 for u, _ in kept if u < 100), 2)\n\nprint(f"miss_rate={miss_rate}  duplikat={duplikat}  outlier={outlier}  n_bersih={n_bersih}  mean_peng_bersih={mean_peng_bersih}  mean_umur_valid={mean_umur_valid}")`,
        checks: [
          { kind: "equal", task: "t1", name: "miss_rate", value: 30.0, tol: 0.01, label: "`miss_rate` sekitar 30.0", msg: "3 dari 10 penghasilan kosong = 30%." },
          { kind: "equal", task: "t1", name: "duplikat", value: 1, tol: 0, label: "`duplikat` seharusnya 1", msg: "ID 102 muncul dua kali = 1 duplikat." },
          { kind: "equal", task: "t2", name: "outlier", value: 2, tol: 0, label: "`outlier` seharusnya 2", msg: "Umur 250 muncul dua kali." },
          { kind: "equal", task: "t2", name: "n_bersih", value: 9, tol: 0, label: "`n_bersih` seharusnya 9", msg: "10 baris dikurangi 1 duplikat = 9." },
          { kind: "equal", task: "t3", name: "mean_peng_bersih", value: 8.83, tol: 0.01, label: "`mean_peng_bersih` sekitar 8.83", msg: "(5+8+4+20+7+9) ÷ 6 = 53 ÷ 6 = 8,83." },
          { kind: "equal", task: "t3", name: "mean_umur_valid", value: 30.14, tol: 0.01, label: "`mean_umur_valid` sekitar 30.14", msg: "(25+32+28+19+33+45+29) ÷ 7 = 211 ÷ 7 = 30,14." },
          { kind: "stdout_matches", task: "t3", pattern: "miss_rate=30(\\.0)?\\s+duplikat=1\\s+outlier=2\\s+n_bersih=9\\s+mean_peng_bersih=8\\.83\\s+mean_umur_valid=30\\.14", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Audit dulu, bersihkan kemudian. Outlier diinvestigasi, bukan auto-hapus; missing dilaporkan, bukan disembunyikan.",
    },
    {
      id: "eda-lab",
      eyebrow: "Langkah 4 · Lab Python",
      title: "Lab EDA: NPL per segmen penghasilan",
      prose: [
        "Segmentasi risiko memakai metrik utama: NPL per segmen, yaitu jumlah macet dibagi total debitur segmen, dikali 100%. Angka segmen di lab ini berasal dari potongan sintetis 150 nasabah (ilustratif) — BUKAN dari 10 baris seed SQL pada Langkah 2, yang terlalu kecil untuk estimasi segmen. Memakai 10 baris untuk estimasi populasi adalah kesalahan yang sama besarnya dengan salah grain.",
        "Hasilnya: segmen penghasilan di bawah 5 juta — 8 macet dari 40 debitur, NPL 20,0%. Segmen 5 sampai 10 juta — 6 dari 60, NPL 10,0%. Segmen di atas 10 juta — 2 dari 50, NPL 4,0%. NPL keseluruhan 16 dari 150, yaitu 10,67%. Rasio risiko segmen terendah terhadap tertinggi adalah 20,0 dibagi 4,0 = 5,0 kali lipat — temuan terkuat capstone ini.",
        "Pola menurun monoton (20, lalu 10, lalu 4) lebih meyakinkan daripada satu angka ekstrem: ia konsisten dengan cerita ekonomi bahwa penghasilan rendah berarti bantalan keuangan tipis. Tetapi ingat batasannya: EDA menemukan asosiasi, bukan kausalitas — jangan tulis penghasilan rendah MENYEBABKAN macet; tulis macet TERKONSENTRASI pada segmen berpenghasilan rendah.",
      ],
      formula: String.raw`NPL_{segmen} = \frac{n_{macet}}{n_{total}} \times 100\%`,
      formulaNote: "NPL segmen = rasio kredit macet (DPD 90 atau lebih) per segmen; n_macet = debitur macet di segmen itu; n_total = total debitur segmen.",
      tasks: [
        { id: "t1", text: "Hitung `dr_rendah`, `dr_menengah`, `dr_tinggi` (NPL per segmen, persen)" },
        { id: "t2", text: "Hitung `npl_total` keseluruhan dan `rasio` = dr_rendah dibagi dr_tinggi" },
      ],
      expected: "dr_rendah=20.0  dr_menengah=10.0  dr_tinggi=4.0  npl_total=10.67  rasio=5.0",
      hints: [
        "dr = macet / n * 100 per segmen.",
        "npl_total = (8+6+2) / (40+60+50) * 100.",
        "rasio = dr_rendah / dr_tinggi.",
      ],
      code: {
        starter: `# Segmentasi risiko (ilustratif): potongan sintetis 150 nasabah\nn = [40, 60, 50]  # rendah, menengah, tinggi\nmacet = [8, 6, 2]\n\n# TULIS KODEMU\ndr_rendah = \ndr_menengah = \ndr_tinggi = \nnpl_total = \nrasio = \n\nprint(f"dr_rendah={dr_rendah}  dr_menengah={dr_menengah}  dr_tinggi={dr_tinggi}  npl_total={npl_total}  rasio={rasio}")`,
        lockLines: 4,
        solution: `# Segmentasi risiko (ilustratif): potongan sintetis 150 nasabah\nn = [40, 60, 50]  # rendah, menengah, tinggi\nmacet = [8, 6, 2]\n\n# TULIS KODEMU\ndr_rendah = round(macet[0] / n[0] * 100, 2)\ndr_menengah = round(macet[1] / n[1] * 100, 2)\ndr_tinggi = round(macet[2] / n[2] * 100, 2)\nnpl_total = round(sum(macet) / sum(n) * 100, 2)\nrasio = round(dr_rendah / dr_tinggi, 2)\n\nprint(f"dr_rendah={dr_rendah}  dr_menengah={dr_menengah}  dr_tinggi={dr_tinggi}  npl_total={npl_total}  rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dr_rendah", value: 20.0, tol: 0.01, label: "`dr_rendah` sekitar 20.0", msg: "8 ÷ 40 × 100% = 20%." },
          { kind: "equal", task: "t1", name: "dr_menengah", value: 10.0, tol: 0.01, label: "`dr_menengah` sekitar 10.0", msg: "6 ÷ 60 × 100% = 10%." },
          { kind: "equal", task: "t1", name: "dr_tinggi", value: 4.0, tol: 0.01, label: "`dr_tinggi` sekitar 4.0", msg: "2 ÷ 50 × 100% = 4%." },
          { kind: "equal", task: "t2", name: "npl_total", value: 10.67, tol: 0.01, label: "`npl_total` sekitar 10.67", msg: "16 ÷ 150 × 100% = 10,67%." },
          { kind: "equal", task: "t2", name: "rasio", value: 5.0, tol: 0.01, label: "`rasio` sekitar 5.0", msg: "20,0 ÷ 4,0 = 5,0 kali lipat." },
          { kind: "stdout_matches", task: "t2", pattern: "dr_rendah=20(\\.0)?\\s+dr_menengah=10(\\.0)?\\s+dr_tinggi=4(\\.0)?\\s+npl_total=10\\.67\\s+rasio=5(\\.0)?", label: "`print` menampilkan semuanya", msg: "Format: dr_rendah=...  dr_menengah=...  dr_tinggi=...  npl_total=...  rasio=... ." },
        ],
      },
      reference: "NPL per segmen + rasio antar segmen = bahasa EDA untuk direksi. Asosiasi, bukan kausalitas.",
    },
    {
      id: "pipeline-lab",
      eyebrow: "Langkah 5 · Lab Python",
      title: "Lab pipeline: agregasi di SQL, analisis di Python",
      prose: [
        "Inilah pola handoff capstone: SQL melakukan agregasi, Python melakukan analisis. Query SQL di lab ini mengelompokkan 10 transaksi seed berdasarkan tujuan kredit dan menghitung jumlah transaksi serta jumlah macet (DPD 90 atau lebih) per tujuan. Python kemudian mengubah hitungan itu menjadi NPL per tujuan dan menarik kesimpulan.",
        "Hasilnya: kredit konsumsi 3 macet dari 4 transaksi, NPL 75,0%; kredit modal kerja 0 dari 4, NPL 0,0%; kredit investasi 0 dari 2, NPL 0,0%. NPL keseluruhan pada 10 baris ini adalah 3 dari 10, yaitu 30,0% — jauh di atas NPL 10,67% pada potongan 150 nasabah di Langkah 4.",
        "Selisih itu BUKAN kesalahan hitung, melainkan pelajaran utama langkah ini: n kecil menyesatkan. Empat transaksi konsumsi tidak cukup untuk menyimpulkan NPL konsumsi 75% di populasi 10.000 transaksi. Aturan pembagian kerja yang benar: agregasi berat (jutaan baris) dilakukan SQL di database, analisis dan interpretasi dilakukan Python di notebook — dan interpretasi WAJIB menyebut ukuran sampelnya. Pipeline yang baik memindahkan angka, bukan memindahkan tanggung jawab berpikir.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `npl_konsumsi`, `npl_modal`, `npl_investasi` dari hasil query (persen)" },
        { id: "t2", text: "Hitung `npl_total` keseluruhan dari 10 transaksi" },
      ],
      expected: "npl_konsumsi=75.0  npl_modal=0.0  npl_investasi=0.0  npl_total=30.0",
      hints: [
        "hasil berisi tuple (tujuan, n, macet) — ubah ke dict: {tujuan: (n, macet)}.",
        "npl = macet / n * 100 per tujuan.",
        "npl_total = total macet / total transaksi * 100.",
      ],
      code: {
        starter: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE transaksi (id TEXT, nasabah_id TEXT, nominal_jt REAL, dpd INTEGER, tujuan TEXT)")\ncur.executemany("INSERT INTO transaksi VALUES (?,?,?,?,?)", [\n    ("T001", "N001", 10, 0, "modal kerja"),\n    ("T002", "N001", 15, 120, "konsumsi"),\n    ("T003", "N002", 20, 0, "modal kerja"),\n    ("T004", "N002", 25, 30, "konsumsi"),\n    ("T005", "N003", 50, 0, "investasi"),\n    ("T006", "N003", 30, 95, "konsumsi"),\n    ("T007", "N004", 8, 150, "konsumsi"),\n    ("T008", "N004", 12, 0, "modal kerja"),\n    ("T009", "N005", 100, 0, "investasi"),\n    ("T010", "N005", 60, 10, "modal kerja"),\n])\n# Agregasi di SQL: per tujuan, jumlah transaksi dan jumlah macet (dpd >= 90)\nhasil = cur.execute("SELECT tujuan, COUNT(*), SUM(CASE WHEN dpd >= 90 THEN 1 ELSE 0 END) FROM transaksi GROUP BY tujuan").fetchall()\n\n# TULIS KODEMU\nd = \nnpl_konsumsi = \nnpl_modal = \nnpl_investasi = \nnpl_total = \n\nprint(f"npl_konsumsi={npl_konsumsi}  npl_modal={npl_modal}  npl_investasi={npl_investasi}  npl_total={npl_total}")`,
        lockLines: 19,
        solution: `import sqlite3\ncon = sqlite3.connect(":memory:")\ncur = con.cursor()\ncur.execute("CREATE TABLE transaksi (id TEXT, nasabah_id TEXT, nominal_jt REAL, dpd INTEGER, tujuan TEXT)")\ncur.executemany("INSERT INTO transaksi VALUES (?,?,?,?,?)", [\n    ("T001", "N001", 10, 0, "modal kerja"),\n    ("T002", "N001", 15, 120, "konsumsi"),\n    ("T003", "N002", 20, 0, "modal kerja"),\n    ("T004", "N002", 25, 30, "konsumsi"),\n    ("T005", "N003", 50, 0, "investasi"),\n    ("T006", "N003", 30, 95, "konsumsi"),\n    ("T007", "N004", 8, 150, "konsumsi"),\n    ("T008", "N004", 12, 0, "modal kerja"),\n    ("T009", "N005", 100, 0, "investasi"),\n    ("T010", "N005", 60, 10, "modal kerja"),\n])\n# Agregasi di SQL: per tujuan, jumlah transaksi dan jumlah macet (dpd >= 90)\nhasil = cur.execute("SELECT tujuan, COUNT(*), SUM(CASE WHEN dpd >= 90 THEN 1 ELSE 0 END) FROM transaksi GROUP BY tujuan").fetchall()\n\n# TULIS KODEMU\nd = {tujuan: (n, macet) for tujuan, n, macet in hasil}\nnpl_konsumsi = round(d["konsumsi"][1] / d["konsumsi"][0] * 100, 2)\nnpl_modal = round(d["modal kerja"][1] / d["modal kerja"][0] * 100, 2)\nnpl_investasi = round(d["investasi"][1] / d["investasi"][0] * 100, 2)\nnpl_total = round(sum(m for _, m in d.values()) / sum(n for n, _ in d.values()) * 100, 2)\n\nprint(f"npl_konsumsi={npl_konsumsi}  npl_modal={npl_modal}  npl_investasi={npl_investasi}  npl_total={npl_total}")`,
        checks: [
          { kind: "equal", task: "t1", name: "npl_konsumsi", value: 75.0, tol: 0.01, label: "`npl_konsumsi` sekitar 75.0", msg: "3 macet dari 4 transaksi konsumsi = 75% — tetapi n=4, sangat tidak stabil." },
          { kind: "equal", task: "t1", name: "npl_modal", value: 0.0, tol: 0.01, label: "`npl_modal` sekitar 0.0", msg: "0 macet dari 4 transaksi modal kerja = 0%." },
          { kind: "equal", task: "t1", name: "npl_investasi", value: 0.0, tol: 0.01, label: "`npl_investasi` sekitar 0.0", msg: "0 macet dari 2 transaksi investasi = 0%." },
          { kind: "equal", task: "t2", name: "npl_total", value: 30.0, tol: 0.01, label: "`npl_total` sekitar 30.0", msg: "3 macet dari 10 transaksi = 30% — bandingkan dengan 10,67% pada 150 nasabah." },
          { kind: "stdout_matches", task: "t2", pattern: "npl_konsumsi=75(\\.0)?\\s+npl_modal=0(\\.0)?\\s+npl_investasi=0(\\.0)?\\s+npl_total=30(\\.0)?", label: "`print` menampilkan semuanya", msg: "Format: npl_konsumsi=...  npl_modal=...  npl_investasi=...  npl_total=... ." },
        ],
      },
      reference: "SQL agregasi, Python analisis. Selalu sebut ukuran sampel saat melaporkan NPL.",
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 6 · Deliverable",
      title: "Laporan satu halaman: struktur dan rubrik nilai diri",
      prose: [
        "Laporan satu halaman untuk direksi punya lima bagian. Judul dan pertanyaan: satu kalimat tentang segmen mana yang macet dan apa yang harus dilakukan. Temuan kunci: tiga angka — NPL keseluruhan 10,67% (ilustratif, 150 nasabah), NPL segmen di bawah 5 juta 20,0% atau 5,0 kali segmen di atas 10 juta, dan kredit konsumsi sebagai segmen tujuan yang paling berisiko pada data kecil. Rekomendasi: verifikasi manual untuk segmen di bawah 5 juta mulai bulan depan, pricing dibedakan per tujuan kredit, dan penghasilan kosong masuk antrean investigasi, bukan auto-approve.",
        "Bagian keempat adalah batasan — dan ini yang membedakan laporan analis dari laporan penjual: data sintetis ilustratif, potongan EDA 150 nasabah, seed SQL hanya 10 baris, dan EDA menemukan asosiasi bukan kausalitas. Bagian kelima adalah jejak audit: query SQL Langkah 2, notebook cleaning Langkah 3, dan perhitungan EDA Langkah 4 — setiap angka di laporan harus bisa dilacak ke baris-baris ini.",
        "Rubrik nilai diri, 0 sampai 2 per kriteria (target 7 dari 8): (1) grain dan definisi macet (DPD 90 atau lebih) tertulis eksplisit; (2) audit kualitas dilaporkan — miss rate, duplikat, outlier; (3) semua angka bisa dilacak ke query atau notebook; (4) rekomendasi menyebut pemilik dan tenggat, serta batasan ditulis jujur. Di bawah 7 berarti ada bagian yang harus dilengkapi sebelum laporan ini layak ditunjukkan ke orang lain.",
      ],
      tasks: [],
      note: {
        title: "Ujian satu halaman",
        type: "pitfall",
        body: "Laporan yang butuh dua halaman untuk menjelaskan satu temuan belum menemukan temuannya. Bila satu halaman tidak cukup, masalahnya bukan halamannya — melainkan kamu belum memutuskan mana temuan utamanya.",
      },
      reference: "Struktur: pertanyaan, temuan kunci, rekomendasi, batasan, jejak audit. Rubrik 4 kriteria, target 7 dari 8.",
    },
    {
      id: "minicase-review",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Direksi mempertanyakan angka: jejak audit dari laporan ke data mentah",
      prose: [
        "Seminggu setelah laporanmu diserahkan, seorang direktur bertanya di rapat: angka NPL 20% untuk segmen di bawah 5 juta itu dari mana? Dan kenapa laporan lain menyebut NPL bank 30%? Dua pertanyaan, dua jawaban yang berbeda sifatnya — dan keduanya harus bisa kamu jawab tanpa membuka laptop orang lain.",
        "Untuk angka 20%: jejak auditnya adalah laporan Langkah 6 merujuk ke perhitungan EDA Langkah 4 — 8 macet dari 40 debitur segmen di bawah 5 juta pada potongan sintetis 150 nasabah — yang datanya dibersihkan di Langkah 3 dengan keputusan terdokumentasi (duplikat ID 102 dibuang, umur 250 dikeluarkan dari rata-rata, missing dilaporkan bukan diisi). Setiap langkah punya angka dan keputusan yang bisa ditunjukkan.",
        "Untuk angka 30%: itu NPL pada 10 baris seed SQL Langkah 5 — 3 macet dari 10 transaksi — dan laporanmu TIDAK pernah mengklaim angka itu sebagai NPL bank. Bila seseorang mengutip 30% sebagai NPL bank, ia mengutip angka dari sampel latihan 10 baris seolah-olah itu populasi 10.000 transaksi. Jawabanmu di rapat: tunjukkan perbedaan denominatornya — 10 transaksi vs 150 nasabah vs 10.000 transaksi populasi — dan minta laporan lain itu menunjukkan jejak audit yang sama. Analis yang bisa mempertahankan angkanya dengan jejak audit lebih berharga daripada analis yang angkanya tidak pernah dipertanyakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dua angka NPL yang berbeda untuk bank yang sama bukan selalu kesalahan — sering kali keduanya benar dengan denominator berbeda. Bahaya muncul bila denominatornya disembunyikan. Selalu tulis n di samping setiap persentase.",
      },
      reference: "Jejak audit: laporan ke EDA ke cleaning ke data mentah. Selalu tulis n di samping persentase.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan penutup capstone. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Grain: satu baris = satu transaksi; nasabah dan transaksi dihitung terpisah.",
        "Audit sebelum analisis: miss rate penghasilan 30% (3 dari 10 baris, per kolom penghasilan), 1 duplikat, 2 outlier umur — dilaporkan, bukan disembunyikan.",
        "NPL segmen di bawah 5 juta 20,0% (8/40), 5–10 juta 10,0% (6/60), di atas 10 juta 4,0% (2/50); NPL keseluruhan 10,67% (16/150) — lima kali lipat segmen terendah vs tertinggi.",
        "Pipeline: agregasi di SQL, analisis di Python; n kecil menyesatkan — selalu tulis n di samping persentase.",
        "Laporan 1 halaman: pertanyaan, temuan, rekomendasi, batasan, jejak audit; rubrik nilai diri target 7 dari 8.",
      ],
      next: { label: "E1 — Struktur Pasar", href: "/v2/learn/e1-struktur-pasar" },
      quiz: [
        {
          q: "Dataset capstone: satu baris sama dengan satu transaksi, satu nasabah bisa punya banyak transaksi. Bila kamu menghitung rata-rata transaksi per nasabah dari 10 baris dan 5 nasabah, hasilnya?",
          options: [
            { text: "2,0 — 10 transaksi dibagi 5 nasabah", why: "Benar: grain adalah transaksi, jadi penyebut nasabahnya adalah nasabah unik (5), bukan baris.", correct: true },
            { text: "1,0 — 10 baris dibagi 10 nasabah", why: "Salah: nasabah uniknya 5, bukan 10 — mengira satu baris sama dengan satu nasabah adalah kesalahan grain.", },
            { text: "10,0 — jumlah barisnya", why: "Salah: itu jumlah transaksi, bukan rata-rata per nasabah.", },
          ],
        },
        {
          q: "Penghasilan kosong punya NPL lebih tinggi dari rata-rata. Tindakan yang tepat?",
          options: [
            { text: "Hapus baris missing — datanya tidak lengkap", why: "Salah: menghapus membuang sinyal dan membuat sampel bias.", },
            { text: "Perlakukan missing sebagai sinyal: laporkan miss rate dan investigasi polanya", why: "Benar: missing yang prediktif adalah temuan, bukan sampah.", correct: true },
            { text: "Isi dengan rata-rata lalu lupakan", why: "Salah: imputasi rata-rata menyembunyikan sinyal di balik angka rata-rata.", },
          ],
        },
        {
          q: "NPL konsumsi 75% dihitung dari 4 transaksi, sementara NPL keseluruhan 10,67% dari 150 nasabah. Kesimpulan yang tepat?",
          options: [
            { text: "NPL konsumsi bank adalah 75%", why: "Salah: n=4 terlalu kecil untuk estimasi populasi; 75% adalah angka sampel kecil yang tidak stabil.", },
            { text: "75% adalah sinyal untuk diselidiki pada data penuh, bukan estimasi populasi", why: "Benar: sampel kecil memberi hipotesis, bukan kesimpulan — selidiki pada 10.000 transaksi.", correct: true },
            { text: "Angka 75% pasti salah hitung", why: "Salah: 3 dari 4 memang 75%; hitungannya benar, interpretasinya yang harus hati-hati.", },
          ],
        },
        {
          q: "Direktur mempertanyakan angka NPL 20% di laporanmu. Respons profesional?",
          options: [
            { text: "Tunjukkan jejak audit: 8 dari 40 debitur segmen itu, dari potongan 150 nasabah, setelah cleaning terdokumentasi", why: "Benar: setiap angka harus bisa dilacak ke perhitungan dan keputusan cleaning-nya.", correct: true },
            { text: "Katakan angkanya dari model yang canggih", why: "Salah: otoritas model bukan jejak audit.", },
            { text: "Ganti angkanya dengan yang direktur harapkan", why: "Salah: mengubah angka agar menyenangkan audiens adalah pelanggaran integritas.", },
          ],
        },
        {
          q: "Kenapa agregasi dilakukan di SQL dan analisis di Python, bukan semuanya di Python?",
          options: [
            { text: "SQL lebih cepat untuk agregasi jutaan baris di database; Python lebih kuat untuk analisis dan interpretasi", why: "Benar: pembagian kerja mengikuti kekuatan masing-masing — agregasi di tempat data berada, analisis di notebook.", correct: true },
            { text: "Python tidak bisa menghitung rata-rata", why: "Salah: Python bisa, tetapi memindahkan jutaan baris ke notebook hanya untuk agregasi adalah pemborosan.", },
            { text: "SQL wajib dipakai di semua capstone", why: "Salah: bukan soal kewajiban, melainkan soal pembagian kerja yang efisien dan bisa direproduksi.", },
          ],
        },
      ],
    },
  ],
};
