import type { V2Mission, V2Step } from "../lib/types";

// ── MISI CAPSTONE #3: Jejak Data — Pipeline yang Tak Punya Tuan ──────────
// Data Management (track rumah) × Data Engineer.
// Narasi: data steward di perusahaan yang pipelinenya "sudah jalan
// bertahun-tahun tanpa dokumentasi" — regulator meminta bukti lineage
// end-to-end dan kepemilikan data. Dua lensa: tata kelola (katalog,
// ownership, definisi, retensi) + rekayasa (rekonstruksi lineage dari log,
// kontrak skema).
// Dataset: 100% SINTETIS (dinyatakan eksplisit), seed 42.
// Snapshot: public/misi/misi-gabung-lineage-governance/ (5 CSV + METODE.md).

const BASE = "/misi/misi-gabung-lineage-governance";

export const misiGabungLineageGovernance: V2Mission = {
  slug: "misi-gabung-lineage-governance",
  track: "Data Management",
  module: "Misi",
  title: "Misi Jejak Data: Pipeline yang Tak Punya Tuan",
  estMinutes: 180,
  role: "Data steward",
  client:
    "Chief Data Officer — regulator meminta bukti lineage end-to-end dan kepemilikan data atas Laporan Risiko Kredit Bulanan; pipeline sudah berjalan 7 tahun tanpa dokumentasi yang hidup",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Surat yang tidak bisa dijawab dengan “nanti saya cek dulu”",
      prose: [],
      tasks: [
        { id: "t1", text: "Catat 3 objectives misi ini dengan kata-katamu sendiri" },
        { id: "t2", text: "Tulis ringkasan prasyarat (lineage, ownership, retensi) dalam 2–3 kalimat" },
      ],
      briefing: {
        role: "Data steward di PT Bank Aruna Digital (fiktif) — penjaga katalog, definisi, dan kepemilikan data",
        client:
          "Chief Data Officer (CDO). Jumat 16:40 ia meneruskan surat regulator: dalam 30 hari, bank harus menyerahkan BUKTI lineage end-to-end dan kepemilikan data untuk Laporan Risiko Kredit Bulanan — laporan yang menentukan berapa besar cadangan kerugian bank. Pipeline laporan ini sudah berjalan 7 tahun. Dokumentasi lineage terakhir bertanggal 2021 (“dokumen v0.3”), pemilik banyak tabel sudah pindah divisi atau resign, dan tidak ada yang berani bersumpah dokumen itu masih benar. Kamu diminta membangun paket bukti dari NOL: rekonstruksi lineage dari log yang ada, petakan siapa pemilik tiap kolom, bereskan definisi yang konflik, dan tulis apa adanya — termasuk bagian yang tidak bisa dibuktikan.",
        story: [
          "Senin pagi, ruang rapat lantai 12. CDO meletakkan surat regulator di meja — dua halaman, bahasa formal, tenggat 30 hari. “Mereka tidak minta laporan baru,” katanya. “Mereka minta bukti bahwa kita TAHU dari mana tiap angka di laporan itu berasal, dan SIAPA yang bertanggung jawab atas tiap kolomnya. Kalau kita tidak bisa membuktikan, mereka anggap kita tidak mengendalikannya.”",
          "Kamu membuka dokumen lineage v0.3 dari 2021. Sembilan klaim edge, rapi, meyakinkan — dan langsung terasa ada yang janggal: dokumen ini mengklaim aliran langsung dari tabel sumber ke data mart, padahal kamu ingat ada tabel staging di antaranya. Klaim semanis ini biasanya berarti satu dari dua hal: penulisnya jenius, atau penulisnya tidak pernah melihat log aslinya.",
          "Di sinilah dua keahlianmu bertemu. Sebagai steward, kamu paham tata kelola: katalog, ownership, definisi, retensi. Sebagai engineer, kamu bisa membaca log pipeline apa adanya. Regulator tidak butuh cerita bagus — mereka butuh bukti. Dan bukti dimulai dari mengakui apa yang tidak kamu ketahui.",
        ],
        objectives: [
          "Merekonstruksi lineage terverifikasi dari 30 hari log pipeline dan menghitung cakupan bukti (coverage) terhadap klaim dokumen lama.",
          "Menemukan seluruh kolom orphan (tanpa pemilik), definisi kosong, dan pelanggaran kebijakan retensi dari kontrak skema dan matriks ownership.",
          "Menemukan minimal 3 suntikan palsu di paket serah terima governance dan menulis Paket Bukti Governance yang jujur — termasuk bagian yang tidak bisa dibuktikan.",
        ],
        prereqSummary:
          "Lineage = peta asal-usul data: tabel/kolom mana mengalir menjadi apa, lewat pipeline mana. Ownership = kejelasan siapa yang bertanggung jawab atas tiap aset data bila ada masalah. Retensi = aturan berapa lama data boleh disimpan sebelum wajib dihapus. Tiga hal ini adalah fondasi tata kelola; tanpa ketiganya, “data-driven” hanya slogan.",
        datasetNote:
          "STATUS DATA: 100% SINTETIS — seluruh file di folder ini fiktif (perusahaan, tim, tabel, angka, tanggal run), dibuat dengan seed 42 untuk misi ini. Bukan data nyata, bukan PII nyata.\nFile: pipeline_log.csv (34 run, 30 hari: 2026-09-15 s.d. 2026-10-14), skema_kontrak.csv (25 baris kontrak 6 tabel), matriks_ownership.csv (25 baris, 7 orphan), klaim_lineage_lama.csv (9 klaim dokumen v0.3 2021), glosarium.csv (6 istilah, 1 konflik).\nKejujuran: log hanya 30 hari — tidak bisa membuktikan lineage 7 tahun; klaim dokumen lama memang dirancang cacat. Total <10 KB. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Lima file, lima tingkat kejujuran",
      prose: [
        "Lima file menunggumu di data room. Masing-masing “jujur” dengan caranya sendiri — dan tugas steward yang baik adalah tahu file mana yang bisa dipercaya untuk apa. `pipeline_log.csv` adalah saksi paling jujur: mesin tidak beropini, ia mencatat apa yang terjadi. `klaim_lineage_lama.csv` adalah sebaliknya: dokumen manusia, rapi, dan belum tentu benar.",
        "`skema_kontrak.csv` menunjukkan apa yang SEHARUSNYA terjadi (kontrak), `matriks_ownership.csv` menunjukkan siapa yang MENGAKU bertanggung jawab, dan `glosarium.csv` menunjukkan apakah kita bahkan sepakat tentang arti kata-katanya. Kesenjangan di antara kelimanya — itulah pekerjaanmu.",
        "Aturan main: (1) lineage yang sah = yang terbukti di log, bukan yang tertulis di dokumen; (2) kolom tanpa pemilik = risiko, bukan “nanti saja”; (3) definisi yang konflik = dua kebenaran yang tidak bisa dipakai bersamaan.",
      ],
      tasks: [
        { id: "t1", text: "Buka `pipeline_log.csv`: catat jumlah run dan rentang tanggalnya" },
        { id: "t2", text: "Buka `matriks_ownership.csv`: hitung kasar berapa baris berstatus orphan" },
        { id: "t3", text: "Buka `glosarium.csv`: temukan istilah yang definisinya konflik" },
      ],
      note: {
        title: "Miskonsepsi #1: dokumen lama = kebenaran",
        type: "pitfall",
        body: "“Kan sudah ada dokumen lineage dari 2021, tinggal pakai.” Dokumen adalah KLAIM, bukan bukti. Klaim menua: tabel berubah, orang resign, pipeline ditulis ulang — dokumennya tidak ikut diperbarui. Di misi ini kamu akan mengukur persis seberapa banyak klaim 2021 yang masih didukung bukti 2026. Petunjuk: tidak banyak.",
      },
      reference:
        "pipeline_log.csv (saksi mesin) vs klaim_lineage_lama.csv (klaim manusia). Kontrak vs kepemilikan vs definisi: tiga cermin yang harus saling cocok.",
    },
    {
      id: "lab-lineage",
      eyebrow: "Langkah 3 · Lab 1 — Rekonstruksi lineage dari log",
      title: "Percayai log, bukan legenda",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `pipeline_log.csv`: bangun himpunan edge (source_table → target_table) yang berstatus SUCCESS — itulah lineage yang benar-benar terjadi 30 hari terakhir. Lalu bandingkan dengan `klaim_lineage_lama.csv`: berapa klaim yang source-nya bahkan tidak pernah muncul di log? Berapa yang cocok penuh dengan edge sukses?",
        "Terakhir, hitung cakupan bukti (coverage): proporsi edge klaim yang terbukti di log. Angka inilah yang akan kamu bawa ke regulator — bukan perasaan, bukan “kayaknya masih sama”.",
      ],
      tasks: [
        { id: "t1", text: "Muat 4 CSV; hitung `n_run`, `tgl_awal`, `tgl_akhir`" },
        { id: "t2", text: "Hitung `n_edge_sukses` (pasangan tabel unik, status SUCCESS) dan `n_tabel_tanpa_kontrak`" },
        { id: "t3", text: "Bandingkan klaim vs log: `n_edge_klaim`, `n_klaim_tak_terbukti`, `n_klaim_terbukti`, `coverage`" },
        { id: "t4", text: "Hitung `n_orphan` dari matriks ownership" },
      ],
      expected:
        "n_run=34, 2026-09-15 s.d. 2026-10-14; n_edge_sukses=7; n_tabel_tanpa_kontrak=3 (stg_*); n_edge_klaim=7; n_klaim_tak_terbukti=2; n_klaim_terbukti=1; coverage=0,1429; n_orphan=7",
      formula: String.raw`C = \frac{|E_{bukti}|}{|E_{klaim}|}`,
      formulaNote:
        "C = cakupan bukti lineage (0 sampai 1). E_bukti = himpunan pasangan tabel klaim yang terbukti muncul sebagai edge SUCCESS di log. E_klaim = himpunan pasangan tabel unik dalam klaim dokumen lama. Di misi ini: 1/7 = 0,1429 — hanya 14% klaim dokumen 2021 yang didukung bukti log 2026. Regulator membaca angka ini sebagai: “86% peta kalian adalah karangan.”",
      note: {
        title: "Edge sukses vs edge klaim: dua bahasa berbeda",
        type: "pitfall",
        body: "Dokumen lama mengklaim aliran LANGSUNG core_rekening → dm_kredit. Log berkata alirannya core_rekening → stg_rekening → dm_kredit. Klaimnya “disederhanakan” — dan penyederhanaan itulah yang membuatnya salah: tabel staging tidak punya kontrak, tidak punya pemilik, tapi dilewati data PII setiap hari. Lineage yang melompati perantara = lineage yang buta terhadap risiko di perantara itu.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(BASE + \"/pipeline_log.csv\"))`.",
        "Edge unik: `log[log[\"status\"]==\"SUCCESS\"][[\"source_table\",\"target_table\"]].drop_duplicates()` lalu `len(...)`.",
        "Tabel tanpa kontrak: himpunan tabel di log MINUS himpunan `table_name` di skema — pakai `set`.",
        "Klaim tak terbukti: pasangan klaim yang `source_table`-nya tidak ada di himpunan source log (status apa pun).",
        "Orphan: `(own[\"status_pemilik\"]==\"orphan\").sum()` — bandingkan dengan hitungan kasarmu di data room.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-lineage-governance\"",
          "",
          "log = pd.read_csv(open_url(BASE + \"/pipeline_log.csv\"))",
          "klaim = pd.read_csv(open_url(BASE + \"/klaim_lineage_lama.csv\"))",
          "skm = pd.read_csv(open_url(BASE + \"/skema_kontrak.csv\"))",
          "own = pd.read_csv(open_url(BASE + \"/matriks_ownership.csv\"))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "n_run = ...",
          "tgl_awal = ...   # YYYY-MM-DD dari started_at paling awal",
          "tgl_akhir = ...  # YYYY-MM-DD dari started_at paling akhir",
          "",
          "edge_sukses = ...  # DataFrame pasangan unik (source_table, target_table), status SUCCESS",
          "n_edge_sukses = ...",
          "",
          "tabel_log = ...      # himpunan semua tabel yang muncul di log",
          "tabel_kontrak = ...  # himpunan table_name di skema_kontrak",
          "n_tabel_tanpa_kontrak = ...",
          "",
          "pasangan_klaim = ...   # himpunan pasangan (source_table, target_table) unik dari klaim",
          "n_edge_klaim = ...",
          "sumber_log = ...       # himpunan source_table yang pernah muncul di log",
          "n_klaim_tak_terbukti = ...  # pasangan klaim yang source-nya tak pernah muncul di log",
          "n_klaim_terbukti = ...     # pasangan klaim yang ADA di edge_sukses",
          "coverage = ...            # dibulatkan 4 desimal",
          "",
          "n_orphan = ...  # baris matriks dengan status_pemilik == \"orphan\"",
          "",
          "print(\"run:\", n_run, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"edge sukses:\", n_edge_sukses, \"| tabel tanpa kontrak:\", n_tabel_tanpa_kontrak)",
          "print(\"klaim:\", n_edge_klaim, \"| tak terbukti:\", n_klaim_tak_terbukti, \"| terbukti:\", n_klaim_terbukti)",
          "print(\"coverage:\", coverage, \"| orphan:\", n_orphan)",
        ].join("\n"),
        lockLines: 11,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-gabung-lineage-governance\"",
          "",
          "log = pd.read_csv(open_url(BASE + \"/pipeline_log.csv\"))",
          "klaim = pd.read_csv(open_url(BASE + \"/klaim_lineage_lama.csv\"))",
          "skm = pd.read_csv(open_url(BASE + \"/skema_kontrak.csv\"))",
          "own = pd.read_csv(open_url(BASE + \"/matriks_ownership.csv\"))",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "n_run = len(log)",
          "tgl_awal = log[\"started_at\"].min()[:10]",
          "tgl_akhir = log[\"started_at\"].max()[:10]",
          "",
          "edge_sukses = log[log[\"status\"] == \"SUCCESS\"][[\"source_table\", \"target_table\"]].drop_duplicates()",
          "n_edge_sukses = int(len(edge_sukses))",
          "",
          "tabel_log = set(log[\"source_table\"]) | set(log[\"target_table\"])",
          "tabel_kontrak = set(skm[\"table_name\"])",
          "n_tabel_tanpa_kontrak = len(tabel_log - tabel_kontrak)",
          "",
          "pasangan_klaim = set(zip(klaim[\"source_table\"], klaim[\"target_table\"]))",
          "n_edge_klaim = len(pasangan_klaim)",
          "sumber_log = set(log[\"source_table\"])",
          "n_klaim_tak_terbukti = sum(1 for s, t in pasangan_klaim if s not in sumber_log)",
          "edge_set = set(map(tuple, edge_sukses.values))",
          "n_klaim_terbukti = sum(1 for p in pasangan_klaim if p in edge_set)",
          "coverage = round(n_klaim_terbukti / n_edge_klaim, 4)",
          "",
          "n_orphan = int((own[\"status_pemilik\"] == \"orphan\").sum())",
          "",
          "print(\"run:\", n_run, \"|\", tgl_awal, \"s.d.\", tgl_akhir)",
          "print(\"edge sukses:\", n_edge_sukses, \"| tabel tanpa kontrak:\", n_tabel_tanpa_kontrak)",
          "print(\"klaim:\", n_edge_klaim, \"| tak terbukti:\", n_klaim_tak_terbukti, \"| terbukti:\", n_klaim_terbukti)",
          "print(\"coverage:\", coverage, \"| orphan:\", n_orphan)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`log` termuat", name: "log", msg: "log harus berisi DataFrame dari pipeline_log.csv." },
          { kind: "equal", task: "t1", label: "`n_run` = 34", name: "n_run", value: 34, msg: "File punya 34 run (2026-09-15 s.d. 2026-10-14)." },
          { kind: "equal", task: "t1", label: "`tgl_awal` = 2026-09-15", name: "tgl_awal", value: "2026-09-15", msg: "Ambil 10 karakter pertama dari started_at minimum." },
          { kind: "equal", task: "t2", label: "`n_edge_sukses` = 7", name: "n_edge_sukses", value: 7, msg: "7 pasangan tabel unik berstatus SUCCESS (arsip selalu FAILED)." },
          { kind: "equal", task: "t2", label: "`n_tabel_tanpa_kontrak` = 3", name: "n_tabel_tanpa_kontrak", value: 3, msg: "stg_rekening, stg_nasabah, stg_risk — staging tanpa kontrak." },
          { kind: "equal", task: "t3", label: "`n_edge_klaim` = 7", name: "n_edge_klaim", value: 7, msg: "9 klaim baris, tapi hanya 7 pasangan tabel UNIK." },
          { kind: "equal", task: "t3", label: "`n_klaim_tak_terbukti` = 2", name: "n_klaim_tak_terbukti", value: 2, msg: "core_kolektibilitas dan arsip_laporan→regulator_server: source tak pernah muncul di log." },
          { kind: "equal", task: "t3", label: "`n_klaim_terbukti` = 1", name: "n_klaim_terbukti", value: 1, msg: "Hanya dm_kredit→lap_risiko_bulanan yang cocok penuh dengan edge sukses." },
          { kind: "equal", task: "t3", label: "`coverage` ≈ 0,1429", name: "coverage", value: 0.1429, tol: 0.001, msg: "1/7 dibulatkan 4 desimal. Di bawah 0,2 = dokumen lama praktis tidak bisa dipakai." },
          { kind: "equal", task: "t4", label: "`n_orphan` = 7", name: "n_orphan", value: 7, msg: "7 baris matriks berstatus orphan — termasuk dm_kredit.limit_kredit." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Audit kepemilikan & retensi",
      title: "Siapa pemiliknya? Berapa lama boleh disimpan?",
      prose: [
        "Lineage menjawab “dari mana”. Sekarang dua pertanyaan tata kelola: (1) kolom mana yang TIDAK PUNYA pemilik — karena saat insiden, kolom orphan tidak punya siapa-siapa untuk dihubungi; (2) tabel mana yang melanggar kebijakan retensi — karena menyimpan PII lebih lama dari aturan = denda menunggu waktu.",
        "Kebijakan retensi bank: tabel `laporan` wajib 2555 hari (7 tahun), `mart` 1095 hari, `mentah` (berisi PII) hanya 90 hari lalu wajib dihapus. Tabel `ownership(tabel, kolom, pemilik, status_pemilik)` dan `kontrak(tabel, kolom, definisi, retention_days, kategori)` sudah disiapkan.",
      ],
      tasks: [
        { id: "t1", text: "Query 1: semua kolom orphan (tabel + kolom), urut" },
        { id: "t2", text: "Query 2: pelanggaran retensi vs kebijakan kategori (pakai CASE/OR)" },
      ],
      expected:
        "Q1: 5 baris orphan (arsip_laporan 2, core_nasabah 2, dm_kredit.limit_kredit). Q2: 4 baris — arsip_laporan retensi kosong (2), core_nasabah 1825 hari vs kebijakan 90 (2).",
      sqlLab: {
        task: "Q1: tampilkan tabel + kolom yang status_pemilik-nya 'orphan', urut. Q2: tampilkan tabel, kolom, retention_days, kategori yang MELANGGAR kebijakan (laporan→2555, mart→1095, mentah→90; kosong = pelanggaran). Jalankan dua query terpisah.",
        schema: "CREATE TABLE ownership (tabel TEXT, kolom TEXT, pemilik TEXT, status_pemilik TEXT);\nCREATE TABLE kontrak (tabel TEXT, kolom TEXT, definisi TEXT, retention_days TEXT, kategori TEXT);",
        seedData: [
          "INSERT INTO ownership VALUES",
          "('core_rekening','rekening_id','Tim Data Platform','terkonfirmasi'),",
          "('core_rekening','limit_kredit','Tim Data Platform','terkonfirmasi'),",
          "('core_nasabah','nasabah_id','','orphan'),",
          "('core_nasabah','nama','','orphan'),",
          "('risk_score_harian','skor','Tim Risiko','terkonfirmasi'),",
          "('risk_score_harian','model_version','Tim Risiko','belum_terverifikasi'),",
          "('dm_kredit','nasabah_id','Tim Analitik Risiko','terkonfirmasi'),",
          "('dm_kredit','limit_kredit','','orphan'),",
          "('dm_kredit','status_nasabah','Tim Analitik Risiko','belum_terverifikasi'),",
          "('lap_risiko_bulanan','periode','Tim Analitik Risiko','terkonfirmasi'),",
          "('lap_risiko_bulanan','rasio_npl','Tim Analitik Risiko','terkonfirmasi'),",
          "('arsip_laporan','periode','','orphan'),",
          "('arsip_laporan','file_path','','orphan');",
          "INSERT INTO kontrak VALUES",
          "('core_rekening','rekening_id','ID rekening unik core banking','90','mentah'),",
          "('core_rekening','limit_kredit','Plafon kredit disetujui (IDR)','90','mentah'),",
          "('core_nasabah','nasabah_id','ID nasabah unik','1825','mentah'),",
          "('core_nasabah','nama','Nama lengkap nasabah (PII)','1825','mentah'),",
          "('risk_score_harian','skor','Skor risiko 0-100','90','mentah'),",
          "('risk_score_harian','model_version','','90','mentah'),",
          "('dm_kredit','limit_kredit','Plafon kredit (disalin dari core_rekening)','1095','mart'),",
          "('dm_kredit','skor_risiko','Skor risiko terakhir','1095','mart'),",
          "('lap_risiko_bulanan','periode','Periode YYYY-MM','2555','laporan'),",
          "('lap_risiko_bulanan','rasio_npl','% kredit macet thd total','2555','laporan'),",
          "('arsip_laporan','periode','Periode arsip','','laporan'),",
          "('arsip_laporan','file_path','Lokasi file arsip','','laporan');",
        ].join("\n"),
        starter: "-- Q1: kolom orphan\nSELECT tabel, kolom\nFROM ownership\nWHERE status_pemilik = 'orphan'\nORDER BY tabel, kolom;\n\n-- Q2: pelanggaran retensi (tulis di bawah)\n",
        solution: [
          "SELECT tabel, kolom",
          "FROM ownership",
          "WHERE status_pemilik = 'orphan'",
          "ORDER BY tabel, kolom;",
          "",
          "SELECT tabel, kolom, retention_days, kategori",
          "FROM kontrak",
          "WHERE retention_days IS NULL OR retention_days = ''",
          "   OR (kategori = 'laporan' AND CAST(retention_days AS INT) < 2555)",
          "   OR (kategori = 'mart' AND CAST(retention_days AS INT) < 1095)",
          "   OR (kategori = 'mentah' AND CAST(retention_days AS INT) != 90)",
          "ORDER BY tabel, kolom;",
        ].join("\n"),
        expectedColumns: ["tabel", "kolom", "retention_days", "kategori"],
        expectedRows: [
          ["arsip_laporan", "file_path", "", "laporan"],
          ["arsip_laporan", "periode", "", "laporan"],
          ["core_nasabah", "nama", "1825", "mentah"],
          ["core_nasabah", "nasabah_id", "1825", "mentah"],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiGabungLineageGovernance;

// ── lanjutan: keputusan bercabang, kontrak, audit, deliverable, debrief ──
const LANJUTAN_CAP3: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Tenggat 30 hari, bukti 14%: apa strategimu?",
    prose: [
      "Angkanya tidak berbohong: coverage lineage 14%, 7 kolom orphan, 3 tabel staging tanpa kontrak dan tanpa pemilik, retensi PII dilanggar, satu definisi konflik. Regulator menunggu dalam 30 hari. Tidak ada opsi yang sempurna — dan “menunggu sampai semuanya rapi” bukan opsi karena tenggatnya nyata. Pilih strategimu; tiap pilihan mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [
      { id: "t1", text: "Pilih satu opsi dan baca konsekuensinya sampai habis" },
    ],
    decision: {
      prompt:
        "Strategi apa yang kamu ajukan ke CDO untuk menjawab regulator dalam 30 hari? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-kirim-cepat",
          label: "Kirim lineage dari log 30 hari, klaim sebagai bukti lengkap",
          rationale:
            "Cepat dan terlihat rapi: 7 edge sukses + matriks ownership yang “mayoritas terkonfirmasi”. Regulator dapat paket tepat waktu; detail 7 tahun bisa menyusul.",
          nextStepId: "cabang-kirim",
          consequenceNote:
            "Regulator membalas 2 minggu kemudian: “Bukti 30 hari tidak menjawab lineage 7 tahun; klaim tanpa bukti untuk 86% edge.” Skor kepercayaan turun — sekarang setiap klaimmu diverifikasi dua kali lipat.",
        },
        {
          id: "opt-beku-audit",
          label: "Minta penundaan resmi 6 minggu, audit penuh + bekukan perubahan pipeline",
          rationale:
            "Jujur soal kondisi: dokumen mati, bukti parsial. Minta waktu untuk audit penuh, kontrak ulang staging, dan tetapkan owner definitif. Risiko: regulator bisa menolak dan bisnis terganggu.",
          nextStepId: "cabang-beku",
          consequenceNote:
            "Regulator memberi 45 hari tambahan dengan syarat: laporan kemajuan tiap 2 minggu. Audit penuh menemukan 2 gap lagi yang tidak terlihat dari log 30 hari. Kepercayaan naik — tapi kamu berutang deliverable tiap 2 minggu.",
        },
        {
          id: "opt-tebak-owner",
          label: "Isi kekosongan owner dengan tebakan terbaik tim, tandai “sementara”",
          rationale:
            "Pragmatis: tim tahu kira-kira siapa pemiliknya. Isi dulu agar matriks terlihat lengkap, verifikasi menyusul. “Sementara” membuatnya jujur, kan?",
          nextStepId: "cabang-tebak",
          consequenceNote:
            "Tiga minggu kemudian insiden: kebocoran di tabel staging. “Owner sementara” yang kamu tulis tidak tahu-menahu soal tabel itu — dan label “sementara” tidak terbaca oleh regulator. Tebakan yang salah lebih buruk daripada kekosongan yang jujur.",
        },
      ],
    },
  },
  {
    id: "cabang-kirim",
    goto: "kontrak",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: kirim cepat",
    prose: [
      "Paket terkirim tepat waktu — 7 edge, matriks yang “mayoritas terkonfirmasi”, narasi yang rapi. Dua minggu kemudian balasan regulator tiba, dan isinya dingin: “Bukti 30 hari tidak menjawab lineage 7 tahun. Untuk 86% edge yang diklaim tanpa bukti log, mohon sertakan bukti alternatif atau cabut klaimnya.”",
      "Pelajaran yang mahal: mengirim klaim yang tidak bisa kamu pertahankan tidak menghemat waktu — ia meminjam waktu dengan bunga. Sekarang setiap kalimat di paketmu dibaca dengan curiga, dan beban pembuktiannya berlipat.",
    ],
    tasks: [
      { id: "t1", text: "Tulis satu kalimat: apa yang seharusnya dikirim selain klaim?" },
    ],
    note: {
      title: "Klaim tanpa bukti = utang kepercayaan",
      type: "risk",
      body: "Regulator tidak menghukum ketidaktahuan — mereka menghukum klaim palsu. “Kami hanya bisa membuktikan 14%, sisanya sedang diaudit” hampir selalu diterima lebih baik daripada paket rapi yang runtuh saat diverifikasi. Di deliverable-mu, setiap klaim wajib ditemani tingkat buktinya.",
    },
  },
  {
    id: "cabang-beku",
    goto: "kontrak",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: minta waktu, audit penuh",
    prose: [
      "CDO meneruskan permintaanmu — dan, di luar dugaan, regulator menyetujui 45 hari tambahan dengan satu syarat: laporan kemajuan tiap 2 minggu. Audit penuh yang kamu jalankan menemukan dua hal yang tidak terlihat dari log 30 hari: tabel staging ternyata juga dipakai pipeline lain di luar LRK, dan satu kolom “sementara” sudah dipakai laporan lain selama 2 tahun.",
      "Kejujuranmu dibayar dengan kepercayaan — tapi juga dengan utang: tiap 2 minggu kamu harus menunjukkan kemajuan nyata. “Sedang diaudit” tanpa artefak baru adalah cara lambat untuk kehilangan kepercayaan yang baru didapat.",
    ],
    tasks: [
      { id: "t1", text: "Tulis satu kalimat: artefak apa yang kamu tunjukkan di laporan kemajuan pertama?" },
    ],
    note: {
      title: "Waktu tambahan = kontrak, bukan hadiah",
      type: "risk",
      body: "Penundaan yang disetujui selalu bersyarat: milestone, artefak, tanggal. Tanpa itu, “minta waktu” = “menunda masalah”. Di rencana remediasimu nanti, setiap janji wajib punya tanggal dan pemilik.",
    },
  },
  {
    id: "cabang-tebak",
    goto: "kontrak",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: isi dengan tebakan",
    prose: [
      "Matriks terlihat lengkap. Tiga minggu kemudian insiden: akses aneh ke tabel staging terdeteksi. Tim keamanan menghubungi “owner” yang kamu tulis — ia menjawab: “Saya tidak pernah pegang tabel itu.” Label “sementara” yang kamu anggap jujur ternyata tidak pernah dibaca siapa pun; yang tercatat di sistem hanyalah nama.",
      "Pelajaran paling pahit di misi ini: kekosongan yang jujur (“orphan — belum ada pemilik”) adalah informasi. Tebakan yang salah adalah disinformasi. Yang pertama bisa diperbaiki; yang kedua menyesatkan orang yang sedang memadamkan kebakaran.",
    ],
    tasks: [
      { id: "t1", text: "Tulis satu kalimat: kenapa “orphan” lebih aman daripada tebakan?" },
    ],
    note: {
      title: "Jangan pernah menebak kepemilikan",
      type: "risk",
      body: "Ownership fiktif lebih berbahaya daripada tidak ada ownership: ia memberi rasa aman palsu dan mengarahkan insiden ke orang yang salah. Aturan steward: kolom tanpa pemilik ditulis ORPHAN dengan huruf kapital, bukan diisi nama “yang paling mungkin”.",
    },
  },
  {
    id: "kontrak",
    eyebrow: "Langkah 7 · Kontrak & definisi",
    title: "Ketika satu nama punya dua arti",
    prose: [
      "Sebelum audit, satu fondasi terakhir: kontrak skema dan glosarium. Kontrak skema menjawab “kolom ini seharusnya seperti apa” (tipe, boleh kosong, retensi). Glosarium menjawab “kata ini artinya apa”. Keduanya rusak di misi ini — dan kerusakan definisi adalah yang paling licin, karena tidak ada error di log.",
      "Mini-case: kolom `status_nasabah` di `dm_kredit`. Tim Bisnis mendefinisikannya “aktif = ada transaksi 90 hari terakhir”. Tim Operasional: “aktif = rekening tidak diblokir”. Satu kolom, dua definisi, dua angka “nasabah aktif” yang berbeda — dan keduanya mengalir ke `rasio_npl` di laporan regulator. Tidak ada pipeline yang gagal. Tidak ada alert. Hanya dua kebenaran yang tidak bisa dipakai bersamaan.",
      "Kontrak yang baik menangkap ini sebelum produksi: definisi kanonis ditulis sekali, disetujui steward, dan kolom yang melanggar kontrak ditolak di gerbang ingest — bukan ditemukan auditor 7 tahun kemudian.",
    ],
    tasks: [
      { id: "t1", text: "Buka `glosarium.csv`: tulis kedua definisi `status_nasabah` yang konflik" },
      { id: "t2", text: "Buka `skema_kontrak.csv`: temukan 2 kolom dengan definisi kosong" },
      { id: "t3", text: "Jawab: siapa yang dirugikan bila definisi ganda ini lolos ke laporan?" },
    ],
    note: {
      title: "Miskonsepsi #2: nama kolom sama = arti sama",
      type: "pitfall",
      body: "“Kan namanya sama-sama status_nasabah, pasti artinya sama.” Nama adalah label, bukan definisi. Di misi ini dua tim memakai label yang sama untuk dua aturan bisnis yang berbeda — dan lineage kolomnya terlihat “bersih” karena mesin tidak membaca arti kata. Steward membaca arti kata; itulah bedanya dengan engineer murni.",
    },
    reference:
      "glosarium.csv (arti kata) + skema_kontrak.csv kolom definition (arti kolom). Bila keduanya kosong atau konflik, lineage-mu hanya peta tanpa legenda.",
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 12 baris: paket serah terima yang “siap kirim” itu bohong",
    prose: [
      "Sebelum menulis deliverable, satu misi audit. Di bawah ini 12 baris “Paket Serah Terima Data Governance — LRK”, dokumen yang diklaim SIAP dikirim ke regulator. Seseorang menyuntikkan 4 kebohongan ke dalamnya. Senjatamu: angka dari Lab 1 dan Lab 2 — coverage 0,1429, 7 orphan, pelanggaran retensi, dan glosarium yang kamu baca sendiri.",
      "Aturannya sama seperti biasa: verifikasi tiap klaim terhadap sumber mentah. Dokumen yang rapi bukan bukti — kecocokan dengan data mentahlah buktinya.",
    ],
    tasks: [
      { id: "t1", text: "Tandai 4 baris yang klaimnya tidak cocok dengan data mentah" },
    ],
    auditDossier: {
      version: "cap3-governance-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Paket Serah Terima Data Governance LRK yang SIAP dikirim ke regulator.",
      columns: ["Aset", "Klaim", "Status klaim"],
      rows: [
        { rowId: 1, cells: { "Aset": "pipeline_log.csv (34 run, 30 hari)", "Klaim": "Sumber bukti utama lineage — run harian 6 pipeline", "Status klaim": "Terverifikasi" }, claims: [{ label: "Sumber", value: "Log pipeline internal" }] },
        // ── I1: owner palsu ──
        { rowId: 2, cells: { "Aset": "dm_kredit.limit_kredit", "Klaim": "Pemilik: Tim Risiko — terkonfirmasi 2024-11-02", "Status klaim": "Diklaim" }, claims: [{ label: "Owner", value: "Tim Risiko (terkonfirmasi)" }] },
        { rowId: 3, cells: { "Aset": "dm_kredit → lap_risiko_bulanan", "Klaim": "Edge terverifikasi di log sukses", "Status klaim": "Terverifikasi" }, claims: [{ label: "Bukti", value: "pipeline_log.csv" }] },
        // ── I2: lineage palsu ──
        { rowId: 4, cells: { "Aset": "arsip_laporan → regulator_server", "Klaim": "Pengiriman arsip ke regulator otomatis dan sukses tiap bulan", "Status klaim": "Diklaim" }, claims: [{ label: "Mekanisme", value: "Otomatis bulanan" }] },
        { rowId: 5, cells: { "Aset": "core_kolektibilitas", "Klaim": "Tabel sumber status_nasabah menurut dokumen v0.3 — tak terlacak di log 30 hari", "Status klaim": "Tak terbukti" }, claims: [{ label: "Catatan", value: "Butuh investigasi" }] },
        // ── I3: retensi bohong ──
        { rowId: 6, cells: { "Aset": "Retensi seluruh tabel", "Klaim": "Semua tabel retensi 7 tahun sesuai kebijakan", "Status klaim": "Diklaim" }, claims: [{ label: "Kebijakan", value: "7 tahun, seragam" }] },
        // ── I4: definisi tunggal palsu ──
        { rowId: 7, cells: { "Aset": "status_nasabah", "Klaim": "Satu definisi kanonis, disetujui semua tim", "Status klaim": "Diklaim" }, claims: [{ label: "Definisi", value: "Kanonis tunggal" }] },
        { rowId: 8, cells: { "Aset": "stg_rekening / stg_nasabah / stg_risk", "Klaim": "Tabel staging tanpa kontrak dan tanpa pemilik — gap terkonfirmasi", "Status klaim": "Terverifikasi" }, claims: [{ label: "Gap", value: "3 tabel staging" }] },
        { rowId: 9, cells: { "Aset": "core_nasabah (PII)", "Klaim": "Retensi aktual 1825 hari vs kebijakan 90 hari — pelanggaran", "Status klaim": "Terverifikasi" }, claims: [{ label: "Pelanggaran", value: "Retensi PII" }] },
        { rowId: 10, cells: { "Aset": "klaim_lineage_lama.csv", "Klaim": "Coverage terverifikasi: 1 dari 7 edge (14%)", "Status klaim": "Terverifikasi" }, claims: [{ label: "Coverage", value: "0,1429" }] },
        { rowId: 11, cells: { "Aset": "matriks_ownership.csv", "Klaim": "7 kolom orphan, 6 belum terverifikasi", "Status klaim": "Terverifikasi" }, claims: [{ label: "Gap", value: "13 dari 25 baris" }] },
        { rowId: 12, cells: { "Aset": "glosarium.csv", "Klaim": "6 istilah; 1 konflik definisi terbuka (status_nasabah)", "Status klaim": "Terverifikasi" }, claims: [{ label: "Konflik", value: "1 istilah" }] },
      ],
      injections: [
        { key: "owner-palsu", rowIds: [2], title: "Owner yang diklaim “sudah ada”", clue: "Buka matriks_ownership.csv — cari baris dm_kredit.limit_kredit. Statusnya orphan, tanpa tanggal verifikasi. Klaim “terkonfirmasi 2024-11-02” tidak ada di sumber mana pun.", danger: "Owner fiktif = saat insiden, tidak ada yang benar-benar bertanggung jawab. Regulator membaca ini sebagai pemalsuan bukti — lebih berat daripada mengakui kekosongan." },
        { key: "lineage-palsu", rowIds: [4], title: "Lineage pengiriman yang tidak pernah sukses", clue: "Filter pipeline_log.csv untuk pipeline “arsip” — semua run berstatus FAILED dan owner-nya kosong. Tidak ada satu pun pengiriman sukses dalam 30 hari.", danger: "Mengklaim pengiriman otomatis yang nyatanya selalu gagal = arsip laporan regulator mungkin tidak ada saat diminta. Ini temuan audit, bukan sekadar gap dokumentasi." },
        { key: "retensi-bohong", rowIds: [6], title: "Retensi “7 tahun seragam”", clue: "Bandingkan kolom retention_days di skema_kontrak.csv dengan kebijakan kategori: core_nasabah (PII, mentah) menyimpan 1825 hari padahal kebijakan 90 hari; arsip_laporan bahkan kosong.", danger: "Menyimpan PII 5 tahun melanggar kebijakan 90 hari — denda dan risiko kebocoran. Retensi kosong = tidak ada dasar menyimpan data sama sekali." },
        { key: "definisi-tunggal-palsu", rowIds: [7], title: "Definisi kanonis yang tidak ada", clue: "Cari status_nasabah di glosarium.csv — ada DUA baris berstatus konflik dari dua tim berbeda. Tidak ada definisi tunggal yang disetujui.", danger: "Dua definisi = dua angka “nasabah aktif” dari data yang sama. Laporan ke regulator bisa berbeda tergantung siapa yang menghitung — tanpa ada yang salah secara teknis." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Paket Bukti Governance untuk regulator",
    prose: [
      "Semua bukti di tangan. Tulis Paket Bukti Governance — artefak portofoliomu sebagai data steward. Paket yang baik tidak menyembunyikan lubangnya: ia menunjukkan lineage yang terbukti, menandai yang tidak terbukti, mendaftar orphan dengan jujur, dan melampirkan rencana remediasi bertanggal.",
      "Ingat keputusan bercabangmu: strategi apa pun yang kamu pilih, paket ini harus bisa dipertahankan baris per baris saat regulator bertanya “buktinya mana?”.",
    ],
    tasks: [
      { id: "t1", text: "Draf 5 bagian paket bukti mengikuti template" },
      { id: "t2", text: "Nilai drafmu sendiri dengan rubrik (total 100)" },
    ],
    deliverable: {
      template: [
        "Lineage terverifikasi: daftar edge yang terbukti di log (7 edge sukses) + coverage 0,1429 + daftar klaim yang TAK terbukti dan statusnya (dicabut / dalam investigasi).",
        "Matriks ownership + gap: 7 kolom orphan (tulis ORPHAN, jangan ditebak), 6 belum terverifikasi, 3 tabel staging tanpa pemilik — beserta pemilik sementara yang DITUNJUK resmi bila ada.",
        "Definisi & kontrak: glosarium final untuk status_nasabah (satu definisi disepakati + tanggal persetujuan), daftar kolom tanpa definisi, dan kontrak skema staging yang baru ditulis.",
        "Retensi: temuan pelanggaran (core_nasabah 1825 vs 90 hari; arsip_laporan kosong) + tindakan koreksi + tanggal.",
        "Rencana remediasi & batas jujur: apa yang belum bisa dibuktikan (lineage 7 tahun), milestone tiap 2 minggu, pemilik tiap aksi, dan tanggal target.",
      ],
      rubric: [
        { criterion: "Kebenaran lineage terverifikasi", weight: 25, levels: ["Edge diklaim tanpa bukti log", "Sebagian edge cocok, coverage tidak dihitung", "7 edge sukses, coverage 0,1429, klaim tak terbukti ditandai statusnya"] },
        { criterion: "Kejujuran gap ownership", weight: 25, levels: ["Orphan diisi tebakan nama", "Orphan disebut tapi tidak lengkap", "7 orphan ditulis eksplisit sebagai ORPHAN + 3 tabel staging tanpa pemilik"] },
        { criterion: "Definisi & retensi", weight: 25, levels: ["Konflik definisi / pelanggaran retensi tidak disebut", "Disebut sebagian tanpa tindakan", "Satu definisi kanonis + pelanggaran retensi + tanggal koreksi"] },
        { criterion: "Kejujuran batas & rencana", weight: 25, levels: ["Mengklaim bukti lengkap", "Batas disebut tanpa rencana", "Batas (log 30 hari ≠ 7 tahun) eksplisit + milestone 2 mingguan + pemilik tiap aksi"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat suntikan di paket serah terima:",
      "1) **Owner palsu** (baris 2): “Tim Risiko — terkonfirmasi 2024-11-02”. Matriks berkata orphan. Tidak ada tanggal itu di sumber mana pun. Seseorang mengisi kekosongan dengan nama yang terdengar meyakinkan — pola yang sama dengan opsi “tebak owner” di keputusan bercabangmu.",
      "2) **Lineage palsu** (baris 4): “pengiriman arsip otomatis dan sukses tiap bulan”. Log berkata pipeline arsip FAILED di semua run, owner kosong. Klaim ini bukan sekadar salah — ia menutupi kemungkinan bahwa arsip laporan regulator tidak pernah terkirim.",
      "3) **Retensi bohong** (baris 6): “semua tabel 7 tahun”. Kenyataannya: PII disimpan 1825 hari melawan kebijakan 90 hari, dan arsip tidak punya angka retensi sama sekali. Satu kalimat rapi menyembunyikan dua pelanggaran.",
      "4) **Definisi tunggal palsu** (baris 7): “satu definisi kanonis”. Glosarium menunjukkan dua definisi konflik. Klaim ini berbahaya justru karena tidak bisa dibantah oleh mesin — hanya oleh manusia yang membaca.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap sumber mentah, atau memercayai kerapian dokumen. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis. Kirim cepat meminjam kepercayaan dengan bunga; minta waktu mengikatmu pada milestone; tebak owner menanam disinformasi. Steward yang baik bukan yang memilih opsi sempurna — melainkan yang jujur tentang harga opsinya.",
      "Bahaya nyata terakhir: pipeline tanpa tuan adalah bom waktu organisasi. Saat insiden kebocoran terjadi, pertanyaan pertama bukan “datanya di mana” melainkan “siapa yang bertanggung jawab” — dan “tidak tahu” bukan jawaban yang diterima regulator maupun pengadilan.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan: opsi keputusan mana yang paling mahal harganya? Tulis alasannya" },
    ],
    note: {
      title: "Governance bukan birokrasi — ia asuransi",
      type: "risk",
      body: "Katalog, ownership, definisi, dan retensi terasa seperti paperwork sampai hari ketika: regulator datang, data bocor, atau dua tim bertengkar soal angka yang sama. Hari itu, “paperwork” berubah menjadi satu-satunya hal yang melindungimu. Steward yang baik membangunnya SEBELUM hari itu tiba.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [
      { id: "t1", text: "Tutup misi: sebutkan 1 hal yang akan kamu lakukan berbeda sebagai steward mulai besok" },
    ],
    summary: [
      "Lineage yang sah = yang terbukti di log: 7 edge sukses dari 34 run; coverage klaim dokumen lama hanya 0,1429 (1 dari 7 edge) — 86% klaim tak didukung bukti.",
      "Tiga tabel staging (stg_*) dilewati data PII setiap hari tanpa kontrak skema dan tanpa pemilik — gap terbesar misi ini.",
      "Governance diukur dari lubangnya: 7 kolom orphan (tulis ORPHAN, jangan ditebak), 6 belum terverifikasi, 2 definisi kosong, 1 konflik definisi, 2 pelanggaran retensi.",
      "Empat pola kebohongan paket governance: owner palsu, lineage palsu, retensi bohong, definisi tunggal palsu — semuanya terdeteksi dengan membandingkan klaim vs sumber mentah.",
      "Keputusan atas bukti parsial selalu punya harga: kirim cepat (utang kepercayaan), minta waktu (utang milestone), tebak owner (disinformasi). Kejujuran tentang batas adalah strategi, bukan kelemahan.",
      "Data: 100% SINTETIS, seed 42, dibuat 2026-10-15 — PT Bank Aruna Digital fiktif; log hanya 30 hari sehingga tidak bisa membuktikan lineage 7 tahun (dan itu dinyatakan, bukan disembunyikan).",
    ],
  },
];

(misiGabungLineageGovernance.steps as V2Step[]).push(...LANJUTAN_CAP3);
