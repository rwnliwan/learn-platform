import type { V2Lesson, V2Step } from "../lib/types";

// ── PROYEK TERPANDU E2: Pipeline VCF ke Laporan Varian ────────────────────
// Capstone track Bioinformatika — level advanced. Setting: lab genomik RS,
// proband anak dengan dugaan kelainan genetik; 400 varian sintetis.
// Dataset: 100% SINTETIS deterministik (seed 2026) — proband.vcf (400 varian),
// anotasi_referensi.csv (kunci jawaban), laporan_vendor.csv (impostor),
// jarak_genetik.csv (matriks 6x6 untuk UPGMA).
// Snapshot: public/proyek/pj-vcf-varian/ (+ METODE.md).
// Ground truth (dari harness scripts/harness_vcf.py, SEMUA PASS):
// QC (DP>=20, QUAL>=30, FILTER=PASS): lolos 375, gagal 25;
// kandidat (AF<0,01 & CSQ relevan): 11 = 3 Patogenik + 8 VUS;
// patogenik: var_0042 (G6PD stop_gained), var_0177 (HBB frameshift),
//   var_0331 (CFTR splice_donor); vendor: FP=2 (var_0108, var_0256),
//   FN=1 (var_0177); UPGMA: merge pertama S2+S5, tetangga S1 = S3.
// Impostor: laporan vendor "GenoSure Lab" — 2 FP + 1 FN terukur,
// klaim "akurasi 99%" tanpa denominator; 5 pelanggaran terukur.
// PENYEDERHANAAN DINYATAKAN: aturan klasifikasi mirip-ACMG yang sangat
// sederhana; ini melatih pipeline thinking, BUKAN alat diagnosis.

const BASE = "/proyek/pj-vcf-varian";

export const pjVcfVarianMeta = {
  role: "Analis bioinformatika — lab genomik rumah sakit",
  client: "Dokter spesialis anak + komite etik RS: dari 400 varian sampai laporan klinis yang bisa dipertanggungjawabkan",
  tagline:
    "QC, anotasi, klasifikasi, filogenetik — lalu adili laporan vendor yang salah menuduh 2 varian dan melewatkan 1 yang patogenik.",
};

export const pjVcfVarian: V2Lesson = {
  slug: "pj-vcf-varian",
  track: "Bioinformatika",
  module: "Proyek Terpandu",
  title: "Proyek: Pipeline VCF ke Laporan Varian — Dari 400 Varian ke 3 yang Bermakna",
  estMinutes: 300,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing proyek",
      title: "Satu pasien, 400 kandidat, 3 jawaban",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis bioinformatika di lab genomik rumah sakit — kamu menjalankan pipeline dari file VCF mentah sampai laporan varian untuk dokter, dan mempertahankan setiap keputusan filter di depan komite etik.",
        client:
          "Dokter spesialis anak + komite etik RS. Proband: anak 6 tahun dengan dugaan kelainan genetik; sekuensing eksom menghasilkan 400 varian kandidat. Pertanyaannya: varian mana yang menjelaskan gejalanya — dan seberapa yakin kita? Di tengah proyek, vendor 'GenoSure Lab' akan menyodorkan laporan jadi dengan klaim 'akurasi 99%': tugasmu mengauditnya varian per varian, karena satu false negative di sini = diagnosis yang terlewat.",
        story: [
          "Kamis, 14:00. Dokter anak meletakkan hasil eksom di mejamu: '400 varian, dok. Keluarga sudah menunggu dua bulan. Mana yang menyebabkan sakit anak saya?' Di layar sebelah, email dari vendor: laporan jadi, 48 jam, akurasi 99%. Godaannya nyata — tetapi kamu tahu: tidak ada jalan pintas yang bisa dipertanggungjawabkan tanpa pipeline yang kamu pahami baris per baris.",
          "Pekerjaan ini berlapis seperti saringan bertingkat: pertama buang yang datanya buruk (QC), lalu buang yang terlalu umum untuk menjadi penyebab penyakit langka (frekuensi populasi), lalu anotasi (gen apa? consequence apa?), lalu klasifikasikan — sampai tersisa segelintir kandidat yang layak dibahas dengan dokter. Setiap saringan harus punya ALASAN yang tertulis.",
          "Proyek ini multi-sesi (±300 menit): kamu mem-parsing VCF, menerapkan QC, membangun filter frekuensi + consequence, mengklasifikasi dengan aturan yang dinyatakan eksplisit, membangun pohon filogenetik UPGMA dari matriks jarak, lalu menghadapi laporan vendor: 2 varian benign yang dituduh patogenik, 1 varian patogenik yang dilewatkan. Semua terukur terhadap ground truth. Temukan semuanya.",
        ],
        objectives: [
          "Mem-parsing VCF dan menerapkan QC (DP, QUAL, FILTER) — 400 varian menjadi 375 yang layak analisis.",
          "Membangun saringan frekuensi populasi + consequence dan menganotasi kandidat terhadap referensi.",
          "Mengklasifikasikan kandidat (Patogenik/VUS/Benign) dengan aturan eksplisit yang cocok 100% dengan kunci referensi.",
          "Membangun pohon filogenetik UPGMA dan mengaudit laporan vendor: 2 FP + 1 FN yang terukur.",
        ],
        prereqSummary:
          "VCF (Variant Call Format) = file teks tabular berisi varian genetik: kolom CHROM (kromosom), POS (posisi), ID, REF/ALT (alel referensi/alternatif), QUAL (kualitas pemanggilan), FILTER (lolos/tidak), INFO (detail: DP = kedalaman baca, GQ = kualitas genotipe, AF = frekuensi alel di populasi, GENE, CSQ = consequence/dampak terhadap protein). QC = membuang varian dengan data buruk (DP rendah, QUAL rendah, FILTER gagal) sebelum dianalisis. Frekuensi populasi (AF): varian penyebab penyakit langka HARUS langka di populasi — AF > 1–5% praktis menyingkirkan kandidatur patogenik. Klasifikasi gaya ACMG (disederhanakan di sini): Patogenik / VUS (Variant of Uncertain Significance — belum jelas) / Benign, berdasarkan kombinasi frekuensi + consequence. UPGMA = metode membangun pohon filogenetik dengan menggabungkan pasangan terdekat secara iteratif.",
        datasetNote:
          "Sumber: 100% SINTETIS untuk proyek ini (generator deterministik, seed 2026) — 400 varian proband.\nIsi: `proband.vcf` (CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO) + `anotasi_referensi.csv` (kunci jawaban: gen, consequence, frekuensi, status klinis) + `laporan_vendor.csv` (laporan vendor impostor) + `jarak_genetik.csv` (matriks jarak 6 sampel).\nKejujuran: (1) BUKAN data pasien nyata — header VCF mencantumkan peringatan sintetis; (2) aturan klasifikasi adalah versi ACMG yang SANGAT disederhanakan (AF + consequence saja) — praktik klinik memakai puluhan kriteria + kurasi manual; (3) proyek ini melatih *pipeline thinking*, bukan alat diagnosis — laporan nyata wajib validasi lab basah (mis. Sanger) + konseling genetik. Detail + ground truth: METODE.md.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Empat file, satu rantai bukti",
      prose: [
        "`proband.vcf`: 400 baris varian (+ 3 baris header `#`), kolom `CHROM, POS, ID (var_0001–var_0400), REF, ALT, QUAL, FILTER, INFO` — INFO berisi `DP;GQ;AF;GENE;CSQ`. `anotasi_referensi.csv`: 400 baris, `ID, gen, consequence, frekuensi_populasi, status_klinis` — ini KUNCI JAWABAN proyek: status klinis referensi tiap varian. `laporan_vendor.csv`: klasifikasi vendor (`ID, gen, klasifikasi_vendor, keyakinan, catatan`) — baru dibuka penuh di Langkah 9. `jarak_genetik.csv`: matriks 6×6 simetris (S1_proband, S2–S6), diagonal 0 — bahan filogenetik Lab 4.",
        "Aturan main: (1) kunci jawaban BOLEH dipakai untuk memverifikasi pipeline-mu — tetapi pipeline harus MENGHASILKANNYA dari VCF, bukan menyalinnya; (2) setiap filter punya alasan tertulis; (3) laporan vendor diaudit varian per varian terhadap kunci jawaban.",
      ],
      tasks: [
        { id: "t1", text: "Buka `proband.vcf`: catat 8 kolom dan format kolom INFO" },
        { id: "t2", text: "Buka `anotasi_referensi.csv`: catat 5 kolom dan 3 nilai status_klinis" },
        { id: "t3", text: "Buka `jarak_genetik.csv`: verifikasi simetris (2 sel cermin) dan diagonal 0" },
      ],
      note: {
        title: "Miskonsepsi #1: kunci jawaban membuat proyek ini 'contekan'",
        type: "pitfall",
        body: "Kunci jawaban di sini berperan seperti jawaban di belakang buku latihan: ia memverifikasi METODOLOGImu, bukan menggantikannya. Di dunia nyata tidak ada kunci jawaban — yang ada hanya pipeline yang sudah TERBUKTI benar di data sintetis seperti ini. Nilai proyek ini justru di situ: saat kamu menghadapi data tanpa kunci, kamu memakai pipeline yang sama yang sudah kamu buktikan 100% cocok di sini.",
      },
      reference:
        "proband.vcf (400 varian) + anotasi_referensi.csv (400 baris) + laporan_vendor.csv + jarak_genetik.csv (6×6). Ground truth lengkap: METODE.md.",
    },
  ],
};

// ── Lanjutan A: lab QC, konsep anotasi, lab filter, lab klasifikasi ──
const LANJUTAN_VCF_A: V2Step[] = [
  {
    id: "lab-qc",
    eyebrow: "Langkah 3 · Lab 1 — Quality control",
    title: "Buang yang datanya buruk, sebelum ia berbohong",
    prose: [
      "Varian dengan data buruk = varian yang berbohong: depth rendah (DP) berarti alelnya dibaca sedikit — bisa jadi artefak sekuensing; QUAL rendah berarti pemanggil varian sendiri tidak yakin; FILTER = q10 berarti gagal ambang kualitas lab. Aturan QC proyek ini (ditulis eksplisit, bisa diperdebatkan): DP ≥ 20, QUAL ≥ 30, FILTER = PASS. Tiga-tiganya harus lolos.",
      "Catatan penting: QC membuang DATA BURUK, bukan varian jinak — varian benign yang datanya bagus TETAP lolos QC (ia akan tersaring di tahap frekuensi nanti). Mencampuradukkan keduanya adalah kesalahan konseptual yang mahal.",
    ],
    tasks: [
      { id: "t1", text: "Parsing `proband.vcf` (lewati baris `#`) → `n_total`" },
      { id: "t2", text: "Ekstrak DP dari kolom INFO; terapkan 3 saringan → `n_lolos`, `n_gagal`" },
      { id: "t3", text: "Jawab: mengapa varian benign TETAP boleh lolos QC?" },
    ],
    expected: "n_total=400, n_lolos=375, n_gagal=25",
    hints: [
      "Baca dengan `pd.read_csv(open_url(URL), sep='\\t', comment='#', header=None, names=[...])` — 8 nama kolom.",
      "INFO = string 'DP=..;GQ=..;AF=..;GENE=..;CSQ=..': tulis fungsi kecil untuk mengambil nilai per kunci.",
      "Saringan: `(vcf['DP'] >= 20) & (vcf['QUAL'] >= 30) & (vcf['FILTER'] == 'PASS')`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "URL_VCF = BASE + \"/proband.vcf\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(URL_VCF), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "",
        "# TUGASMU: lengkapi QC",
        "n_total = ...",
        "vcf[\"DP\"] = ...            # int(ambil_info(s, 'DP')) per baris INFO",
        "lolos = ...                  # 3 saringan sekaligus",
        "n_lolos = ...",
        "n_gagal = ...",
        "",
        "print(\"total:\", n_total, \"| lolos QC:\", n_lolos, \"| gagal:\", n_gagal)",
      ].join("\n"),
      lockLines: 15,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "URL_VCF = BASE + \"/proband.vcf\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(URL_VCF), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "",
        "n_total = len(vcf)",
        "vcf[\"DP\"] = vcf[\"INFO\"].apply(lambda s: int(ambil_info(s, \"DP\")))",
        "lolos = vcf[(vcf[\"DP\"] >= 20) & (vcf[\"QUAL\"] >= 30) & (vcf[\"FILTER\"] == \"PASS\")]",
        "n_lolos = len(lolos)",
        "n_gagal = n_total - n_lolos",
        "",
        "print(\"total:\", n_total, \"| lolos QC:\", n_lolos, \"| gagal:\", n_gagal)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`n_total` = 400", name: "n_total", value: 400, msg: "400 varian di VCF proband." },
        { kind: "equal", task: "t2", label: "`n_lolos` = 375", name: "n_lolos", value: 375, msg: "375 varian layak analisis." },
        { kind: "equal", task: "t2", label: "`n_gagal` = 25", name: "n_gagal", value: 25, msg: "25 varian dibuang karena data buruk — bukan karena jinak." },
      ],
    },
    quiz: [
      {
        q: "Salah satu varian patogenik (var_0177, HBB) ternyata punya DP = 12. Tindakan yang benar…",
        options: [
          { text: "Loloskan — ia patogenik, sayang dibuang", why: "Salah — dan justru skenario ini TIDAK terjadi di dataset (ketiganya lolos QC). Meloloskan data buruk karena 'kelihatannya penting' = mengorbankan integritas pipeline untuk satu kasus.", correct: false },
          { text: "Tetap buang di QC, catat sebagai temuan yang butuh validasi ulang (sekuensing ulang / Sanger) — bukan sebagai hasil pipeline", why: "Benar. QC tidak mengenal 'pengecualian karena penting'. Varian penting dengan data buruk = kandidat VALIDASI ULANG, bukan kandidat laporan.", correct: true },
          { text: "Turunkan ambang DP menjadi 10 agar ia lolos", why: "Salah — mengubah aturan agar hasil yang diinginkan lolos = cherry-picking metodologis. Ambang diubah hanya dengan justifikasi yang didokumentasikan SEBELUM melihat hasilnya.", correct: false },
        ],
      },
    ],
  },
  {
    id: "konsep-anotasi",
    eyebrow: "Langkah 4 · Konsep inti",
    title: "Frekuensi dan consequence: dua saringan kebenaran",
    prose: [
      "Setelah QC, 375 varian masih terlalu banyak untuk dibahas dengan dokter. Dua saringan berikutnya memangkas berdasarkan BIOLOGI, bukan kualitas data. Pertama, frekuensi populasi (AF): penyakit langka disebabkan varian LANGKA. Varian dengan AF 35% (seperti var_0108 di dataset ini) ditemukan pada sepertiga populasi — ia tidak mungkin menjadi penyebab penyakit langka yang fully penetrant. Ambang proyek: AF < 0,01 (1%) untuk kandidat.",
      "Kedua, consequence (CSQ): dampak varian terhadap protein. `stop_gained` (kodon stop prematur — protein terpotong), `frameshift_variant` (pergeseran bingkai baca — protein hancur), `splice_donor_variant` (sambungan intron-ekson rusak) = dampak TINGGI. `missense_variant` (satu asam amino berubah) = dampak SEDANG, perlu bukti tambahan. `synonymous_variant`/`intron_variant`/`upstream_gene_variant` = dampak RENDAH. Kandidat proyek: consequence tinggi/sedang SAJA.",
      "Klasifikasi akhirnya memakai aturan eksplisit: AF < 0,001 DAN consequence tinggi → Patogenik; AF < 0,01 DAN missense → VUS; sisanya Benign. Ini versi ACMG yang SANGAT disederhanakan — dinyatakan sebagai asumsi, bukan standar klinik.",
    ],
    tasks: [
      { id: "t1", text: "Jelaskan: mengapa AF 35% menyingkirkan kandidatur patogenik untuk penyakit langka?" },
      { id: "t2", text: "Urutkan 6 consequence di atas dari dampak tertinggi ke terendah" },
      { id: "t3", text: "Tuliskan aturan klasifikasi proyek dengan kata-katamu sendiri" },
    ],
    note: {
      title: "Miskonsepsi #2: varian langka = patogenik",
      type: "pitfall",
      body: "AF < 0,01 adalah SYARAT PERLU, bukan syarat cukup. Setiap manusia membawa ribuan varian langka yang tidak berbahaya — kelangkaan saja tidak membuktikan kausalitas. Itulah kenapa saringan kedua (consequence) dan klasifikasi berlapis ada: langka + berdampak tinggi + (di dunia nyata) bukti fungsional/segregasi keluarga. Satu saringan tidak pernah cukup.",
    },
    quiz: [
      {
        q: "var_0108: synonymous_variant, AF = 35,25%. Vendor mengklaimnya 'Patogenik'. Kesalahan vendor yang paling fundamental…",
        options: [
          { text: "Consequence-nya synonymous — tidak mengubah protein", why: "Itu benar sebagai masalah kedua, tetapi bukan yang paling fundamental.", correct: false },
          { text: "AF 35,25% = varian umum; penyakit langka tidak disebabkan varian yang dibawa sepertiga populasi — saringan frekuensi DILANGGAR sebelum consequence dibahas", why: "Benar. Urutan saringan itu penting: frekuensi adalah saringan pertama dan termurah. Melewatkannya = gagal di langkah paling dasar.", correct: true },
          { text: "Gen TP53 terlalu terkenal untuk dipercaya", why: "Salah — ketenaran gen bukan kriteria klasifikasi.", correct: false },
        ],
      },
    ],
  },
  {
    id: "lab-filter",
    eyebrow: "Langkah 5 · Lab 2 — Filter & anotasi",
    title: "Dari 375 ke 11",
    prose: [
      "Terapkan dua saringan biologis ke 375 varian lolos QC: AF < 0,01 DAN consequence ∈ {stop_gained, frameshift_variant, splice_donor_variant, missense_variant}. Lalu gabungkan (merge) dengan `anotasi_referensi.csv` untuk melihat status klinis referensi tiap kandidat — verifikasi, bukan contekan: pipelinemulah yang harus menghasilkan daftar ini.",
    ],
    tasks: [
      { id: "t1", text: "Ekstrak AF & CSQ dari INFO; terapkan saringan → `kandidat`, hitung `n_kandidat`" },
      { id: "t2", text: "Merge dengan anotasi referensi; daftarkan `pat_ids` (ID patogenik, dipisah koma, terurut)" },
      { id: "t3", text: "Jawab: berapa VUS di antara kandidat? (cek kolom status_klinis)" },
    ],
    expected: "n_kandidat=11 (3 Patogenik + 8 VUS), pat_ids=var_0042,var_0177,var_0331",
    hints: [
      "AF: `float(ambil_info(s, 'AF'))`, CSQ: `ambil_info(s, 'CSQ')` — fungsi ambil_info dari Lab 1 dipakai ulang (tulis ulang di lab ini).",
      "Saringan: `(lolos['AF'] < 0.01) & (lolos['CSQ'].isin(CSQ_RELEVAN))`.",
      "Merge: `kandidat.merge(ref, left_on='ID', right_on='ID')`; patogenik: `m[m['status_klinis']=='Patogenik']['ID']`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(BASE + \"/proband.vcf\"), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "vcf[\"DP\"] = vcf[\"INFO\"].apply(lambda s: int(ambil_info(s, \"DP\")))",
        "vcf[\"AF\"] = vcf[\"INFO\"].apply(lambda s: float(ambil_info(s, \"AF\")))",
        "vcf[\"CSQ\"] = vcf[\"INFO\"].apply(lambda s: ambil_info(s, \"CSQ\"))",
        "lolos = vcf[(vcf[\"DP\"] >= 20) & (vcf[\"QUAL\"] >= 30) & (vcf[\"FILTER\"] == \"PASS\")].copy()",
        "",
        "CSQ_RELEVAN = {\"stop_gained\", \"frameshift_variant\", \"splice_donor_variant\", \"missense_variant\"}",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "",
        "# TUGASMU",
        "kandidat = ...",
        "n_kandidat = ...",
        "m = ...                 # merge kandidat dengan ref",
        "pat_ids = ...           # string ID patogenik terurut, dipisah koma",
        "",
        "print(\"kandidat:\", n_kandidat)",
        "print(\"patogenik:\", pat_ids)",
      ].join("\n"),
      lockLines: 17,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(BASE + \"/proband.vcf\"), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "vcf[\"DP\"] = vcf[\"INFO\"].apply(lambda s: int(ambil_info(s, \"DP\")))",
        "vcf[\"AF\"] = vcf[\"INFO\"].apply(lambda s: float(ambil_info(s, \"AF\")))",
        "vcf[\"CSQ\"] = vcf[\"INFO\"].apply(lambda s: ambil_info(s, \"CSQ\"))",
        "lolos = vcf[(vcf[\"DP\"] >= 20) & (vcf[\"QUAL\"] >= 30) & (vcf[\"FILTER\"] == \"PASS\")].copy()",
        "",
        "CSQ_RELEVAN = {\"stop_gained\", \"frameshift_variant\", \"splice_donor_variant\", \"missense_variant\"}",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "",
        "kandidat = lolos[(lolos[\"AF\"] < 0.01) & (lolos[\"CSQ\"].isin(CSQ_RELEVAN))].copy()",
        "n_kandidat = len(kandidat)",
        "m = kandidat.merge(ref, left_on=\"ID\", right_on=\"ID\")",
        "pat_ids = \",\".join(sorted(m[m[\"status_klinis\"] == \"Patogenik\"][\"ID\"].tolist()))",
        "",
        "print(\"kandidat:\", n_kandidat)",
        "print(\"patogenik:\", pat_ids)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t1", label: "`n_kandidat` = 11", name: "n_kandidat", value: 11, msg: "11 varian lolos saringan frekuensi + consequence." },
        { kind: "equal", task: "t2", label: "`pat_ids` tepat", name: "pat_ids", value: "var_0042,var_0177,var_0331", msg: "var_0042 (G6PD stop_gained), var_0177 (HBB frameshift), var_0331 (CFTR splice_donor)." },
      ],
    },
    quiz: [
      {
        q: "400 → 375 (QC) → 11 (filter). Saringan mana yang memangkas PALING banyak, dan apa artinya?",
        options: [
          { text: "QC (25 varian) — kualitas data adalah masalah terbesar", why: "Salah — 25 < 364. QC penting, tetapi bukan pemangkas terbesar.", correct: false },
          { text: "Filter frekuensi + consequence (364 varian) — sebagian besar varian manusia adalah umum/tidak berdampak; pipeline yang baik membuang 90%+ kandidat dengan alasan biologis sebelum analisis mendalam", why: "Benar. Inilah gunanya saringan berlapis: analisis mahal (klasifikasi manual, validasi) hanya untuk segelintir kandidat yang layak.", correct: true },
          { text: "Keduanya sama pentingnya secara kuantitas", why: "Salah — 25 vs 364 tidak sebanding.", correct: false },
        ],
      },
    ],
  },
  {
    id: "lab-klasifikasi",
    eyebrow: "Langkah 6 · Lab 3 — Klasifikasi",
    title: "Aturan tertulis, hasil terverifikasi",
    prose: [
      "Terakhir: klasifikasikan 11 kandidat dengan aturan eksplisit proyek — AF < 0,001 DAN consequence tinggi (stop_gained/frameshift_variant/splice_donor_variant) → Patogenik; AF < 0,01 DAN missense_variant → VUS; sisanya → Benign. Lalu bandingkan dengan `status_klinis` referensi: berapa yang cocok? Aturan yang baik di data sintetis = aturan yang berani diuji di data nyata.",
    ],
    tasks: [
      { id: "t1", text: "Implementasikan fungsi `klasifikasi(af, csq)` sesuai aturan" },
      { id: "t2", text: "Terapkan ke 11 kandidat; hitung `n_cocok` vs referensi" },
      { id: "t3", text: "Hitung `n_pred_patogenik`; verifikasi ID-nya" },
    ],
    expected: "n_cocok=11/11, n_pred_patogenik=3 (var_0042, var_0177, var_0331)",
    hints: [
      "Consequence tinggi: `csq in ('stop_gained', 'frameshift_variant', 'splice_donor_variant')`.",
      "`m['prediksi'] = m.apply(lambda r: klasifikasi(r['AF'], r['CSQ']), axis=1)`.",
      "Cocok: `(m['prediksi'] == m['status_klinis']).sum()`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(BASE + \"/proband.vcf\"), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "vcf[\"DP\"] = vcf[\"INFO\"].apply(lambda s: int(ambil_info(s, \"DP\")))",
        "vcf[\"AF\"] = vcf[\"INFO\"].apply(lambda s: float(ambil_info(s, \"AF\")))",
        "vcf[\"CSQ\"] = vcf[\"INFO\"].apply(lambda s: ambil_info(s, \"CSQ\"))",
        "lolos = vcf[(vcf[\"DP\"] >= 20) & (vcf[\"QUAL\"] >= 30) & (vcf[\"FILTER\"] == \"PASS\")].copy()",
        "CSQ_RELEVAN = {\"stop_gained\", \"frameshift_variant\", \"splice_donor_variant\", \"missense_variant\"}",
        "kandidat = lolos[(lolos[\"AF\"] < 0.01) & (lolos[\"CSQ\"].isin(CSQ_RELEVAN))].copy()",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "m = kandidat.merge(ref, left_on=\"ID\", right_on=\"ID\")",
        "",
        "# TUGASMU",
        "def klasifikasi(af, csq):",
        "    ...",
        "",
        "m[\"prediksi\"] = ...",
        "n_cocok = ...",
        "n_pred_patogenik = ...",
        "",
        "print(\"cocok dengan referensi:\", n_cocok, \"/\", len(m))",
        "print(\"prediksi patogenik:\", n_pred_patogenik)",
      ].join("\n"),
      lockLines: 22,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "",
        "def ambil_info(s, kunci):",
        "    for kv in s.split(\";\"):",
        "        if kv.startswith(kunci + \"=\"):",
        "            return kv.split(\"=\", 1)[1]",
        "    return None",
        "",
        "cols = [\"CHROM\", \"POS\", \"ID\", \"REF\", \"ALT\", \"QUAL\", \"FILTER\", \"INFO\"]",
        "vcf = pd.read_csv(open_url(BASE + \"/proband.vcf\"), sep=\"\\t\", comment=\"#\", header=None, names=cols)",
        "vcf[\"DP\"] = vcf[\"INFO\"].apply(lambda s: int(ambil_info(s, \"DP\")))",
        "vcf[\"AF\"] = vcf[\"INFO\"].apply(lambda s: float(ambil_info(s, \"AF\")))",
        "vcf[\"CSQ\"] = vcf[\"INFO\"].apply(lambda s: ambil_info(s, \"CSQ\"))",
        "lolos = vcf[(vcf[\"DP\"] >= 20) & (vcf[\"QUAL\"] >= 30) & (vcf[\"FILTER\"] == \"PASS\")].copy()",
        "CSQ_RELEVAN = {\"stop_gained\", \"frameshift_variant\", \"splice_donor_variant\", \"missense_variant\"}",
        "kandidat = lolos[(lolos[\"AF\"] < 0.01) & (lolos[\"CSQ\"].isin(CSQ_RELEVAN))].copy()",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "m = kandidat.merge(ref, left_on=\"ID\", right_on=\"ID\")",
        "",
        "def klasifikasi(af, csq):",
        "    if af < 0.001 and csq in (\"stop_gained\", \"frameshift_variant\", \"splice_donor_variant\"):",
        "        return \"Patogenik\"",
        "    if af < 0.01 and csq == \"missense_variant\":",
        "        return \"VUS\"",
        "    return \"Benign\"",
        "",
        "m[\"prediksi\"] = m.apply(lambda r: klasifikasi(r[\"AF\"], r[\"CSQ\"]), axis=1)",
        "n_cocok = int((m[\"prediksi\"] == m[\"status_klinis\"]).sum())",
        "n_pred_patogenik = int((m[\"prediksi\"] == \"Patogenik\").sum())",
        "",
        "print(\"cocok dengan referensi:\", n_cocok, \"/\", len(m))",
        "print(\"prediksi patogenik:\", n_pred_patogenik)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t2", label: "`n_cocok` = 11/11", name: "n_cocok", value: 11, msg: "Aturan sederhana cocok 100% dengan referensi di dataset ini." },
        { kind: "equal", task: "t3", label: "`n_pred_patogenik` = 3", name: "n_pred_patogenik", value: 3, msg: "Tiga varian patogenik teridentifikasi — siap dibahas dengan dokter." },
      ],
    },
  },
];

(pjVcfVarian.steps as V2Step[]).push(...LANJUTAN_VCF_A);

// ── Lanjutan B: keputusan VUS, lab filogenetik, dossier vendor ──
const LANJUTAN_VCF_B: V2Step[] = [
  {
    id: "keputusan-vus",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "VUS di gen jantung: bicara sekarang atau tunggu?",
    prose: [
      "Di antara 8 VUS ada var_0159: missense di BRCA1, AF 0,007 — gen yang terkait risiko kanker payudara/ovarium. Proband adalah anak 6 tahun. Dokter bertanya: 'Sampaikan ke keluarga sekarang?' Dua respons sama-sama profesional — tetapi membawa konsekuensi yang berbeda. Inilah wilayah paling manusiawi dari bioinformatika: ketidakpastian yang harus dikomunikasikan, bukan disembunyikan.",
    ],
    tasks: [],
    decision: {
      prompt: "Bagaimana kamu menangani temuan VUS var_0159 (BRCA1, missense, AF 0,007)?",
      options: [
        {
          id: "opt-lapor",
          label: "Laporkan sekarang — dengan penjelasan ketidakpastian yang eksplisit",
          rationale:
            "VUS dilaporkan sebagai VUS: apa yang diketahui (missense, langka), apa yang TIDAK diketahui (apakah mengganggu fungsi protein), dan langkah berikut (segregasi keluarga, database update berkala). Keluarga mendapat informasi + konteks.",
          nextStepId: "lab-filogenetik",
          consequenceNote:
            "Keluarga awalnya cemas — 'jadi anak saya berisiko kanker?' Kamu jelaskan: VUS BUKAN diagnosis; ia adalah hipotesis yang menunggu bukti. Kamu tawarkan tes segregasi: bila varian ini ada pada orang tua yang sehat di usia 40-an, kecurigaan menurun. Komunikasi yang jujur mengubah kecemasan menjadi rencana. Laporanmu mencatat: VUS harus DIEVALUASI ULANG berkala — varian yang hari ini VUS bisa direklasifikasi tahun depan saat bukti bertambah.",
        },
        {
          id: "opt-tahan",
          label: "Tahan dulu — validasi segregasi keluarga sebelum bicara",
          rationale:
            "Minta sampel orang tua dulu; bila varian diturunkan dari orang tua sehat, ia hampir pasti bukan penyebab. Bicara setelah bukti lebih kuat.",
          nextStepId: "lab-filogenetik",
          consequenceNote:
            "Dua bulan menunggu sampel orang tua — dan ternyata varian tidak diturunkan dari siapa pun (de novo): kecurigaan justru NAIK. Penundaanmu membeli informasi yang berharga, tetapi kamu belajar: 'tahan dulu' bukan tanpa biaya — keluarga menunggu dalam ketidakpastian yang juga menyakitkan. Keputusan ini benar secara ilmiah, tetapi kamu catat pelajarannya: komunikasikan RENCANA penundaannya ('kami menunggu X karena Y, hasilnya maksimal tanggal Z'), bukan diam.",
        },
      ],
    },
  },
  {
    id: "lab-filogenetik",
    eyebrow: "Langkah 8 · Lab 4 — Filogenetik UPGMA",
    title: "Pohon dari matriks jarak",
    prose: [
      "Sisi lain proyek: 6 sampel (S1_proband, S2–S6) dengan matriks jarak genetik berpasangan. UPGMA (Unweighted Pair Group Method with Arithmetic Mean) membangun pohon dengan aturan sederhana yang diulang: (1) gabungkan DUA klaster dengan jarak terkecil; (2) jarak klaster baru ke klaster lain = RATA-RATA jarak anggotanya; (3) ulangi sampai satu pohon. Tidak ada parameter, tidak ada asumsi tersembunyi — ideal untuk diaudit.",
      "Dua pertanyaan yang harus dijawab angkamu: pasangan mana yang bergabung PERTAMA (jarak terkecil di matriks)? dan siapa tetangga terdekat S1_proband?",
    ],
    tasks: [
      { id: "t1", text: "Bangun dict `jarak` {(a,b): d} untuk a < b dari `jarak_genetik.csv`" },
      { id: "t2", text: "Implementasikan loop UPGMA → `gabungan` (list pasangan)" },
      { id: "t3", text: "Tentukan `pasangan_pertama` ('X+Y') dan `tetangga_s1`" },
    ],
    expected: "pasangan_pertama=S2+S5 (jarak 0,008), tetangga_s1=S3 (jarak 0,015)",
    hints: [
      "Matriks: `j = pd.read_csv(open_url(URL), index_col=0)`; `jarak[(a,b)] = float(j.loc[a, b])` untuk a < b (string).",
      "Pasangan terdekat: `min(d, key=d.get)` — d adalah dict jarak klaster saat itu.",
      "Jarak klaster baru ke s: rata-rata BERBOBOT jumlah anggota: (dx*len(mx) + dy*len(my)) / (len(mx)+len(my)).",
      "Setelah loop, dict `d` asli sudah berubah — hitung tetangga_s1 dari `jarak` (yang tak berubah).",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/proyek/pj-vcf-varian/jarak_genetik.csv\"",
        "j = pd.read_csv(open_url(URL), index_col=0)",
        "sampel = list(j.index)",
        "",
        "jarak = {}",
        "for a in sampel:",
        "    for b in sampel:",
        "        if a < b:",
        "            jarak[(a, b)] = float(j.loc[a, b])",
        "",
        "# TUGASMU: lengkapi UPGMA",
        "klaster = ...                 # {nama: [anggota]}",
        "d = ...                       # salinan dict jarak yang akan berubah",
        "gabungan = []",
        "while len(klaster) > 1:",
        "    x, y = ...                # pasangan jarak terkecil",
        "    gabungan.append((x, y))",
        "    d.pop((x, y))",
        "    mx, my = klaster.pop(x), klaster.pop(y)",
        "    baru = f\"[{x}+{y}]\"",
        "    for s in list(klaster):",
        "        dx = ...              # ambil & hapus jarak (x, s)",
        "        dy = ...              # ambil & hapus jarak (y, s)",
        "        d[(min(baru, s), max(baru, s))] = (dx * len(mx) + dy * len(my)) / (len(mx) + len(my))",
        "    klaster[baru] = mx + my",
        "",
        "pasangan_pertama = f\"{gabungan[0][0]}+{gabungan[0][1]}\"",
        "tetangga_s1 = ...           # dari dict 'jarak' yang asli",
        "",
        "print(\"urutan gabungan:\", [f\"{a}+{b}\" for a, b in gabungan])",
        "print(\"pasangan pertama:\", pasangan_pertama, \"| tetangga S1:\", tetangga_s1)",
      ].join("\n"),
      lockLines: 12,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/proyek/pj-vcf-varian/jarak_genetik.csv\"",
        "j = pd.read_csv(open_url(URL), index_col=0)",
        "sampel = list(j.index)",
        "",
        "jarak = {}",
        "for a in sampel:",
        "    for b in sampel:",
        "        if a < b:",
        "            jarak[(a, b)] = float(j.loc[a, b])",
        "",
        "klaster = {s: [s] for s in sampel}",
        "d = dict(jarak)",
        "gabungan = []",
        "while len(klaster) > 1:",
        "    x, y = min(d, key=d.get)",
        "    gabungan.append((x, y))",
        "    d.pop((x, y))",
        "    mx, my = klaster.pop(x), klaster.pop(y)",
        "    baru = f\"[{x}+{y}]\"",
        "    for s in list(klaster):",
        "        dx = d.pop((min(x, s), max(x, s)))",
        "        dy = d.pop((min(y, s), max(y, s)))",
        "        d[(min(baru, s), max(baru, s))] = (dx * len(mx) + dy * len(my)) / (len(mx) + len(my))",
        "    klaster[baru] = mx + my",
        "",
        "pasangan_pertama = f\"{gabungan[0][0]}+{gabungan[0][1]}\"",
        "tetangga_s1 = min([s for s in sampel if s != \"S1_proband\"],",
        "                  key=lambda s: jarak[(min(\"S1_proband\", s), max(\"S1_proband\", s))])",
        "",
        "print(\"urutan gabungan:\", [f\"{a}+{b}\" for a, b in gabungan])",
        "print(\"pasangan pertama:\", pasangan_pertama, \"| tetangga S1:\", tetangga_s1)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t3", label: "`pasangan_pertama` = S2+S5", name: "pasangan_pertama", value: "S2+S5", msg: "Jarak terkecil di matriks: S2–S5 = 0,008." },
        { kind: "equal", task: "t3", label: "`tetangga_s1` = S3", name: "tetangga_s1", value: "S3", msg: "Sampel terdekat proband: S3 (0,015)." },
      ],
    },
    quiz: [
      {
        q: "UPGMA menggabungkan S2+S5 dulu (jarak 0,008), bukan S1+S3 (0,015). Mengapa 'tamak' (greedy) seperti ini bisa dipertanggungjawabkan?",
        options: [
          { text: "Karena jarak terkecil selalu pasangan yang paling mirip — tidak ada asumsi tambahan", why: "Benar. UPGMA tidak menebak struktur; ia mengikuti data: gabungkan yang paling mirip, hitung ulang jarak sebagai rata-rata, ulangi. Setiap langkah bisa diaudit dari matriks.", correct: true },
          { text: "Karena 0,008 < 0,015 — angka kecil selalu benar", why: "Salah — 'angka kecil' bukan argumen. Argumennya adalah prosedurnya yang transparan dan deterministik.", correct: false },
          { text: "Karena S2 dan S5 pasti kerabat dekat", why: "Salah — 'pasti' terlalu kuat. Jarak kecil = mirip secara genetik pada data ini; interpretasi kerabat butuh konteks sampel.", correct: false },
        ],
      },
    ],
  },
  {
    id: "dossier-vendor",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Membedah laporan 'GenoSure Lab'",
    prose: [
      "Map terbuka. 'GenoSure Lab' — vendor sekuensing dengan template laporan yang rapi — mengirim laporan jadi untuk proband: 48 jam, 'akurasi 99%'. Dokter sudah membaca ringkasannya. Kamu membuka file mentahnya (`laporan_vendor.csv`) dan membandingkannya varian per varian dengan kunci jawaban. Tiga baris tidak cocok — dan ketidakcocokannya berpola.",
      "Kamu punya keunggulan yang tidak dimiliki template: pipeline yang sudah kamu buktikan 11/11 cocok dengan referensi (Lab 3), definisi QC yang tertulis, dan pemahaman bahwa di genomik klinis, satu false negative = diagnosis yang terlewat = anak yang tidak tertangani.",
    ],
    tasks: [
      { id: "t1", text: "Bandingkan tiap baris `laporan_vendor.csv` vs `anotasi_referensi.csv`: catat yang berbeda" },
      { id: "t2", text: "Untuk tiap perbedaan: apakah vendor OVERCALL (benign→patogenik) atau UNDERCALL (patogenik→bukan)?" },
      { id: "t3", text: "Periksa klaim 'akurasi 99%': 99% dari APA? (denominatornya)" },
      { id: "t4", text: "Cari jejak QC di laporan vendor: apakah ia menyebut DP/QUAL/FILTER?" },
    ],
    auditDossier: {
      version: "genosure-laporan-2026-10",
      snapshotDate: "2026-10-16",
      intro: "Dossier laporan GenoSure Lab untuk proband: klaim 'akurasi 99%', 48 jam. Audit varian-per-varian terhadap anotasi referensi sebelum laporan diteruskan ke dokter.",
      columns: ["#", "Klaim / isi laporan", "Nilai", "Catatan kaki"],
      rows: [
        { rowId: 1, cells: { "#": "1", "Klaim / isi laporan": "Akurasi klasifikasi", "Nilai": "99%", "Catatan kaki": "Berdasarkan validasi internal" }, claims: [] },
        { rowId: 2, cells: { "#": "2", "Klaim / isi laporan": "var_0108 (TP53) — Patogenik", "Nilai": "keyakinan 99%", "Catatan kaki": "Model AI prediktif — mengabaikan frekuensi populasi" }, claims: [] },
        { rowId: 3, cells: { "#": "3", "Klaim / isi laporan": "var_0256 (CFTR) — Patogenik", "Nilai": "keyakinan 99%", "Catatan kaki": "Model AI prediktif — mengabaikan frekuensi populasi" }, claims: [] },
        { rowId: 4, cells: { "#": "4", "Klaim / isi laporan": "var_0177 (HBB) — VUS", "Nilai": "keyakinan 95%", "Catatan kaki": "Di bawah ambang keyakinan model" }, claims: [] },
        { rowId: 5, cells: { "#": "5", "Klaim / isi laporan": "Jejak quality control", "Nilai": "Tidak dicantumkan", "Catatan kaki": "Laporan tidak menyebut DP/QUAL/FILTER" }, claims: [] },
        { rowId: 6, cells: { "#": "6", "Klaim / isi laporan": "Waktu pengerjaan", "Nilai": "48 jam", "Catatan kaki": "Dari sampel diterima" }, claims: [] }
      ],
      injections: [
        { key: "I1", rowIds: [2], title: "False positive #1: var_0108", clue: "Baris 2 — synonymous_variant, AF 35,25%: varian yang dibawa SEPERTIGA populasi dilabel 'Patogenik' dengan keyakinan 99%. Catatan kakinya sendiri mengaku: 'mengabaikan frekuensi populasi'.", danger: "Overcall pada varian umum = diagnosis palsu. Di klinik nyata, label 'patogenik' pada varian benign memicu tes lanjutan, kecemasan keluarga, bahkan intervensi yang tidak perlu. Saringan frekuensi adalah pertahanan pertama — vendor melewatinya." },
        { key: "I2", rowIds: [3], title: "False positive #2: var_0256", clue: "Baris 3 — upstream_gene_variant, AF 13,43%: lagi-lagi varian umum (13% populasi) dilabel patogenik. Pola yang sama dengan I1: model vendor tidak memakai filter frekuensi.", danger: "Dua FP dengan pola identik = cacat SISTEMATIS, bukan kesalahan acak. Satu FP bisa jadi apes; dua FP berpola berarti pipeline vendor memang tidak menyaring frekuensi — dan semua 'patogenik' lainnya patut dicurigai." },
        { key: "I3", rowIds: [4], title: "False negative: var_0177 dilewatkan", clue: "Baris 4 — frameshift_variant di HBB, AF 0,0004: varian dengan consequence TERTINGGI dan frekuensi langka dilabel 'VUS' karena 'di bawah ambang keyakinan model'. Model mengalahkan biologi.", danger: "Undercall pada varian patogenik = diagnosis yang TERLEWAT — kegagalan paling mahal di genomik klinis. Anak tidak mendapat penanganan yang seharusnya. Pelajaran: ambang keyakinan model tidak boleh mengalahkan aturan biologis yang eksplisit (frameshift + langka = patogenik, titik)." },
        { key: "I4", rowIds: [1], title: "'Akurasi 99%' tanpa denominator", clue: "Baris 1 — 99% dari APA? Dari 400 varian yang mayoritas benign dan mudah (varian umum yang jelas jinak), akurasi 99% bisa berarti 'benar di 396 varian mudah, salah di 3 yang penting'. Tidak ada definisi evaluasi.", danger: "Akurasi tanpa denominator dan tanpa stratifikasi = angka hiasan. Di klasifikasi varian, yang penting BUKAN akurasi keseluruhan — melainkan: berapa patogenik yang tertangkap (recall patogenik) dan berapa benign yang dituduh (false positive rate). Vendor tidak melaporkan keduanya." },
        { key: "I5", rowIds: [5], title: "Laporan tanpa jejak QC", clue: "Baris 5 — tidak satu pun parameter QC (DP/QUAL/FILTER) disebut. Varian dengan data buruk (25 varian gagal QC di dataset ini) tidak jelas nasibnya: dibuang diam-diam? ikut dilaporkan?", danger: "Laporan tanpa jejak QC = rantai bukti yang putus. Kamu tidak bisa menilai kepercayaan satu varian pun tanpa tahu kualitas datanya. Standar: setiap varian yang dilaporkan HARUS mencantumkan metrik QC-nya — atau laporan itu tidak bisa diaudit." }
      ],
    },
  },
];

(pjVcfVarian.steps as V2Step[]).push(...LANJUTAN_VCF_B);

// ── Lanjutan C: lab audit, keputusan vendor, laporan klinis, deliverable ──
const LANJUTAN_VCF_C: V2Step[] = [
  {
    id: "lab-audit",
    eyebrow: "Langkah 10 · Lab 5 — Audit vendor terukur",
    title: "Tiga baris yang tidak cocok — sebagai angka",
    prose: [
      "Dossier memberimu polanya; sekarang jadikan ANGKA: gabungkan `laporan_vendor.csv` dengan `anotasi_referensi.csv`, lalu hitung false positive (vendor bilang Patogenik, referensi bilang Benign) dan false negative (referensi bilang Patogenik, vendor bilang bukan). Definisi ini PENTING: FP/FN selalu relatif terhadap kunci jawaban — tanpa referensi, audit tidak bisa dilakukan.",
      "Perhatikan juga apa yang TIDAK dihitung: 'akurasi 99%' vendor tidak bisa direproduksi karena denominatornya tidak didefinisikan — dan ketidakbisa-direproduksi-an itu sendiri adalah temuan audit.",
    ],
    tasks: [
      { id: "t1", text: "Merge laporan vendor dengan anotasi referensi (on='ID')" },
      { id: "t2", text: "Hitung `n_fp`: vendor Patogenik & referensi Benign" },
      { id: "t3", text: "Hitung `n_fn`: referensi Patogenik & vendor bukan Patogenik; sebutkan ID-nya" },
    ],
    expected: "n_fp=2 (var_0108, var_0256), n_fn=1 (var_0177)",
    hints: [
      "`m = ven.merge(ref, on='ID')` — kolomnya: klasifikasi_vendor, status_klinis.",
      "FP: `(m['klasifikasi_vendor'] == 'Patogenik') & (m['status_klinis'] == 'Benign')`.",
      "FN: `(m['status_klinis'] == 'Patogenik') & (m['klasifikasi_vendor'] != 'Patogenik')`.",
    ],
    requires: ["pandas"],
    code: {
      starter: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "ven = pd.read_csv(open_url(BASE + \"/laporan_vendor.csv\"))",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "",
        "# TUGASMU",
        "m = ...",
        "n_fp = ...",
        "n_fn = ...",
        "id_fn = ...           # ID varian yang dilewatkan vendor",
        "",
        "print(\"false positive:\", n_fp)",
        "print(\"false negative:\", n_fn, id_fn)",
      ].join("\n"),
      lockLines: 5,
      solution: [
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "BASE = \"/proyek/pj-vcf-varian\"",
        "ven = pd.read_csv(open_url(BASE + \"/laporan_vendor.csv\"))",
        "ref = pd.read_csv(open_url(BASE + \"/anotasi_referensi.csv\"))",
        "",
        "m = ven.merge(ref, on=\"ID\")",
        "n_fp = int(((m[\"klasifikasi_vendor\"] == \"Patogenik\") & (m[\"status_klinis\"] == \"Benign\")).sum())",
        "n_fn = int(((m[\"status_klinis\"] == \"Patogenik\") & (m[\"klasifikasi_vendor\"] != \"Patogenik\")).sum())",
        "id_fn = \",\".join(m[(m[\"status_klinis\"] == \"Patogenik\") & (m[\"klasifikasi_vendor\"] != \"Patogenik\")][\"ID\"].tolist())",
        "",
        "print(\"false positive:\", n_fp)",
        "print(\"false negative:\", n_fn, id_fn)",
      ].join("\n"),
      checks: [
        { kind: "equal", task: "t2", label: "`n_fp` = 2", name: "n_fp", value: 2, msg: "Dua varian benign dituduh patogenik (var_0108, var_0256)." },
        { kind: "equal", task: "t3", label: "`n_fn` = 1", name: "n_fn", value: 1, msg: "Satu varian patogenik dilewatkan (var_0177) — kegagalan termahal." },
        { kind: "equal", task: "t3", label: "`id_fn` = var_0177", name: "id_fn", value: "var_0177", msg: "Frameshift HBB yang dilabel 'VUS' oleh vendor." },
      ],
    },
    quiz: [
      {
        q: "Vendor menawarkan 'perbaikan': mereka akan menurunkan ambang model agar var_0177 tertangkap. Masalahnya…",
        options: [
          { text: "Itu solusi yang bagus — FN hilang", why: "Salah — menurunkan ambang tanpa memperbaiki saringan frekuensi akan MENAMBAH false positive. FN hilang, FP meledak. Itu bukan perbaikan, itu menggeser masalah.", correct: false },
          { text: "Menggeser ambang tidak memperbaiki cacat sistematis (tidak ada filter frekuensi); yang dibutuhkan adalah perbaiki pipeline, bukan putar ambang", why: "Benar. FN dan FP di sini berasal dari desain yang salah (mengabaikan frekuensi populasi), bukan dari ambang yang salah. Putar ambang = mengobati gejala.", correct: true },
          { text: "Tidak ada masalah — terima saja", why: "Salah — menerima 'perbaikan' tanpa memahami akar masalah adalah cara tercepat mengulanginya.", correct: false },
        ],
      },
    ],
  },
  {
    id: "keputusan-vendor",
    eyebrow: "Langkah 11 · Checkpoint keputusan",
    title: "Tolak, atau minta pengerjaan ulang?",
    prose: [
      "Tiga kesalahan terukur ada di mejamu, dan Lab 5 baru saja mengonfirmasi polanya: 2 FP + 1 FN. Dokter sudah membaca ringkasan vendor. Keputusanmu sekarang bukan soal bioinformatika — soal TANGGUNG JAWAB PROFESIONAL: bagaimana merespons laporan yang salah di depan dokter yang akan mengambil keputusan klinis?",
    ],
    tasks: [],
    decision: {
      prompt: "Bagaimana kamu merespons laporan GenoSure Lab?",
      options: [
        {
          id: "opt-tolak",
          label: "Tolak & dokumentasikan — 3 kesalahan + 2 cacat metodologis, tertulis",
          rationale:
            "Penolakan formal dengan memo: tiap kesalahan dirujuk ke ID varian + baris dossier. Dokter mendapat penjelasan kenapa laporan ini tidak bisa dipakai.",
          nextStepId: "laporan-klinis",
          consequenceNote:
            "Dokter awalnya keberatan — 'tapi 99% dan 48 jam…'. Kamu tunjukkan var_0177: frameshift HBB yang dilabel VUS — 'satu diagnosis yang terlewat, dok'. Ia mengerti — dan untuk pertama kalinya MEMAHAMI kenapa kecepatan tanpa audit adalah risiko klinis. Memo penolakanmu menjadi lampiran pengadaan lab.",
        },
        {
          id: "opt-rework",
          label: "Minta pengerjaan ulang dengan syarat tertulis",
          rationale:
            "Beri kesempatan: laporan boleh dikerjakan ulang ASALKAN memakai filter frekuensi populasi, mencantumkan jejak QC per varian, dan dievaluasi dengan metrik terstratifikasi (bukan 'akurasi 99%'). Syarat tertulis.",
          nextStepId: "laporan-klinis",
          consequenceNote:
            "Vendor tidak pernah kembali dengan pengerjaan ulang — karena pipeline mereka memang tidak dirancang untuk memenuhi syarat itu. Ketidakhadirannya adalah konfirmasi: laporan awal memang tidak bisa dipertahankan. Syarat tertulismu menjadi standar pengadaan yang bekerja bahkan saat kamu tidak ada.",
        },
      ],
    },
  },
  {
    id: "laporan-klinis",
    eyebrow: "Langkah 12 · Komunikasi klinis",
    title: "Laporan yang dibaca dokter — dan keluarga",
    prose: [
      "Pipeline selesai; sekarang hasilnya harus DIBACA manusia yang mengambil keputusan. Laporan klinis yang baik punya struktur tetap: (1) HASIL — varian patogenik yang ditemukan (ID, gen, consequence, frekuensi, klasifikasi) — hanya 3, bukan 400; (2) INTERPRETASI — apa artinya untuk pasien, dengan tingkat keyakinan; (3) VUS — dilaporkan TERPISAH dengan penjelasan ketidakpastian (bukan disembunyikan, bukan dibesar-besarkan); (4) KETERBATASAN — metode, ambang, dan apa yang TIDAK diperiksa (mis. varian struktural besar di luar cakupan eksom); (5) REKOMENDASI — validasi Sanger untuk 3 patogenik, segregasi keluarga untuk VUS prioritas, evaluasi ulang berkala.",
      "Aturan emas: laporan tidak pernah menyatakan lebih dari yang didukung data. 'VUS' ditulis sebagai 'VUS' — bukan 'kemungkinan patogenik', bukan 'kemungkinan jinak'. Bahasa adalah bagian dari akurasi.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan 5 bagian laporan klinis dan isi tiap bagian untuk kasus proband ini" },
      { id: "t2", text: "Tuliskan kalimat untuk var_0159 (VUS BRCA1) yang jujur namun tidak menimbulkan panik" },
      { id: "t3", text: "Tuliskan 3 keterbatasan yang WAJIB dicantumkan" },
    ],
    quiz: [
      {
        q: "Keluarga bertanya: 'Jadi anak saya PASTI sakit karena var_0042?' Jawaban yang benar…",
        options: [
          { text: "'Ya — patogenik berarti pasti sakit'", why: "Salah — 'patogenik' = varian yang terbukti menyebabkan penyakit pada tingkat populasi/penelitian, BUKAN vonis individual. Penetrance (peluang bermanifestasi) tidak pernah 100% untuk semua kondisi.", correct: false },
          { text: "'Varian ini terbukti merusak fungsi gen G6PD dan sangat langka — ia penjelasan TERBAIK untuk gejala, tetapi kepastian klinis butuh korelasi dengan gejala + validasi lab. Dokter yang memutuskan, bukan file VCF'", why: "Benar. Lapisan kejujuran: klasifikasi varian ≠ diagnosis klinis. Kamu melaporkan bukti; dokter menegakkan diagnosis.", correct: true },
          { text: "'Tidak — varian tidak menentukan apa-apa'", why: "Salah — itu meremehkan bukti yang kuat. Kejujuran bukan berarti mengecilkan temuan.", correct: false },
        ],
      },
    ],
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 13 · Deliverable",
    title: "Laporan varian untuk komite etik",
    prose: [
      "Semua angka sudah di tangan: 400 → 375 (QC) → 11 (filter) → 3 patogenik yang terverifikasi 11/11, pohon UPGMA, 3 kesalahan vendor yang terukur, dan struktur laporan klinis. Sekarang ubah menjadi SATU dokumen yang dibaca komite etik: laporan varian proband + rekomendasi.",
      "Dokumen yang baik menjawab: bagaimana pipeline berjalan (dan terbukti benar), apa yang ditemukan (3 patogenik + 8 VUS, masing-masing dengan bukti), mengapa laporan vendor ditolak (dengan ID varian), dan apa langkah berikut yang bertanggung jawab.",
    ],
    tasks: [
      { id: "t1", text: "Tulis laporan ≤ 5 halaman mengikuti template" },
      { id: "t2", text: "Cantumkan angka kunci: hasil tiap saringan + ID 3 patogenik + hasil UPGMA" },
      { id: "t3", text: "Tulis penolakan vendor (2 FP + 1 FN + 2 cacat metodologis, dengan ID)" },
      { id: "t4", text: "Tulis rekomendasi: validasi, segregasi, evaluasi ulang" },
    ],
    deliverable: {
      template: [
        "PARAGRAF 1 — METODE & VALIDASI: pipeline 4 tahap (QC → filter → klasifikasi → filogenetik); angka tiap saringan (400 → 375 → 11); aturan klasifikasi eksplisit; verifikasi 11/11 cocok dengan referensi; penyederhanaan yang dinyatakan.",
        "PARAGRAF 2 — TEMUAN: 3 varian patogenik (var_0042 G6PD stop_gained AF 0,0001; var_0177 HBB frameshift AF 0,0004; var_0331 CFTR splice_donor AF 0,0002) + 8 VUS (daftar ID) — masing-masing dengan bukti (frekuensi, consequence, QC).",
        "PARAGRAF 3 — FILOGENETIK: UPGMA 6 sampel; merge pertama S2+S5 (0,008); tetangga terdekat proband S3 (0,015); interpretasi yang dinyatakan hati-hati (kemiripan genetik ≠ kesimpulan klinis).",
        "PARAGRAF 4 — PENOLAKAN VENDOR: 2 FP (var_0108 AF 35,25% synonymous; var_0256 AF 13,43% upstream) + 1 FN (var_0177) + 2 cacat metodologis ('akurasi 99%' tanpa denominator; tanpa jejak QC) + rekomendasi tertulis.",
        "PARAGRAF 5 — REKOMENDASI: validasi Sanger untuk 3 patogenik; segregasi keluarga untuk VUS prioritas (contoh var_0159); evaluasi ulang VUS berkala; konseling genetik untuk keluarga.",
      ],
      rubric: [
        { criterion: "Pipeline terbukti (angka tiap saringan)", weight: 25, levels: ["Hasil ditempel tanpa metode", "Metode disebut tanpa angka", "400→375→11→3 dengan aturan eksplisit; verifikasi 11/11; penyederhanaan dinyatakan"] },
        { criterion: "Temuan lengkap dengan bukti", weight: 25, levels: ["Hanya daftar ID", "ID tanpa bukti pendukung", "3 patogenik + 8 VUS masing-masing dengan frekuensi, consequence, dan metrik QC"] },
        { criterion: "Audit vendor: kesalahan terukur", weight: 25, levels: ["Penolakan tanpa ID varian", "Sebagian kesalahan tanpa pola", "2 FP + 1 FN dengan ID + 2 cacat metodologis + rekomendasi tertulis"] },
        { criterion: "Tanggung jawab klinis", weight: 25, levels: ["Tidak ada rekomendasi lanjutan", "Rekomendasi generik", "Validasi Sanger + segregasi + evaluasi ulang VUS + konseling genetik"] },
      ],
    },
  },
  {
    id: "keterbatasan",
    eyebrow: "Langkah 14 · Kejujuran metodologis",
    title: "Apa yang TIDAK bisa dikatakan pipeline ini",
    prose: [
      "Pipeline yang baik tahu batasnya — dan menuliskannya. Batas proyek ini: (1) aturan klasifikasi SANGAT disederhanakan (AF + consequence saja; ACMG nyata memakai puluhan kriteria: segregasi, fungsional, de novo, dsb.); (2) eksom tidak melihat varian struktural besar, delesi/duplikasi luas, atau varian deep-intronik — 'tidak ditemukan' ≠ 'tidak ada'; (3) VUS adalah status SEMENTARA — 8 VUS hari ini bisa menjadi patogenik/benign tahun depan saat bukti bertambah, sehingga evaluasi ulang berkala adalah kewajiban, bukan opsi; (4) data sintetis: pipeline yang 11/11 di sini masih harus divalidasi di data nyata sebelum dipakai klinis.",
      "Menuliskan keterbatasan bukan melemahkan laporan — ia adalah hal yang membuat laporan bisa DIPERCAYA. Dokumen yang mengaku sempurna adalah brosur; dokumen yang menulis batasnya adalah instrumen klinis.",
    ],
    tasks: [
      { id: "t1", text: "Tuliskan 4 keterbatasan di atas dengan kata-katamu sendiri" },
      { id: "t2", text: "Untuk tiap keterbatasan: apa mitigasinya dalam praktik?" },
      { id: "t3", text: "Jawab: mengapa 'tidak ditemukan varian patogenik' ≠ 'pasien sehat'?" },
    ],
    quiz: [
      {
        q: "Laporan menulis: 'Tidak ditemukan varian patogenik pada panel ini.' Keluarga membaca: 'Anak saya tidak punya kelainan genetik.' Masalahnya…",
        options: [
          { text: "Tidak ada masalah — itu kesimpulan yang logis", why: "Salah — 'tidak ditemukan PADA PANEL INI dengan METODE INI' ≠ 'tidak ada kelainan genetik'. Varian struktural, deep-intronik, dan gen di luar panel tidak tercakup.", correct: false },
          { text: "Overinterpretasi: hasil negatif hanya berlaku untuk ruang lingkup yang diperiksa — laporan harus menyatakan cakupannya agar tidak dibaca sebagai vonis 'sehat'", why: "Benar. Inilah kenapa bagian KETERBATASAN wajib ada: ia melindungi keluarga dari kesimpulan yang salah DAN melindungi lab dari tuntutan.", correct: true },
          { text: "Keluarga tidak perlu membaca laporan teknis", why: "Salah — keluarga BERHAK memahami, dengan bahasa yang dijelaskan. Menyembunyikan bukan solusi.", correct: false },
        ],
      },
    ],
  },
  {
    id: "debrief",
    eyebrow: "Langkah 15 · Debrief",
    title: "Ground truth dibuka — dan cermin untuk angkamu sendiri",
    prose: [
      "Lima pelanggaran vendor tadi — semuanya versi 'profesional' dari jebakan yang sudah kamu hadapi sendiri di proyek ini:",
      "I1 — var_0108: synonymous, AF 35,25% — dilabel 'Patogenik' 99%. Catatan kakinya sendiri mengaku mengabaikan frekuensi populasi. Saringan termurah (frekuensi) dilewati.",
      "I2 — var_0256: upstream, AF 13,43% — pola yang sama. Dua FP berpola = cacat sistematis, bukan apes.",
      "I3 — var_0177: frameshift HBB, AF 0,0004 — dilabel 'VUS' karena 'di bawah ambang keyakinan model'. Model mengalahkan biologi; satu diagnosis terlewat.",
      "I4 — 'Akurasi 99%' tanpa denominator: dari 400 varian yang mayoritas mudah, 99% bisa berarti benar di semua yang mudah dan salah di semua yang penting. Yang penting: recall patogenik & false positive rate — tidak dilaporkan.",
      "I5 — Tanpa jejak QC: 25 varian gagal QC di dataset ini tidak jelas nasibnya di laporan vendor. Rantai bukti putus di langkah pertama.",
      "Dan cerminnya — untuk angkamu SENDIRI: 400 → 375 → 11 → 3, UPGMA S2+S5, 11/11 cocok — semuanya angka LAB dari dataset sintetis dengan aturan yang disederhanakan. Mereka membuktikan metodologimu bekerja, bukan bahwa pipeline ini siap klinis. Ground truth proyek ini: 25 gagal QC; 11 kandidat (3 Patogenik: var_0042/var_0177/var_0331; 8 VUS); vendor 2 FP + 1 FN. Di dunia nyata, aturan klasifikasi nyata jauh lebih kaya — dan setiap laporan butuh validasi basah + kurasi manusia. Pipeline yang jujur tentang batasnya adalah pipeline yang bisa dipercaya.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4: pipeline otomatis = pipeline objektif",
      type: "risk",
      body: "'Model AI 99%' terdengar objektif — tetapi setiap ambang (DP ≥ 20, AF < 0,01), setiap aturan (frameshift = patogenik), dan setiap pengecualian adalah KEPUTUSAN manusia yang dikodekan. Objektivitas pipeline = transparansi keputusannya, bukan ketiadaan keputusannya. Di kariermu, setiap kali seseorang menyodorkan hasil otomatis, pertanyaan pertamamu selalu sama: 'aturan apa yang dikodekan di dalamnya, dan siapa yang menulisnya?'",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 16 · Rangkuman",
    title: "Yang kamu bawa pulang",
    prose: [],
    tasks: [],
    summary: [
      "QC membuang DATA BURUK, bukan varian jinak: 400 → 375 (DP ≥ 20, QUAL ≥ 30, FILTER = PASS; 25 dibuang). Varian penting dengan data buruk = kandidat validasi ulang, bukan kandidat laporan.",
      "Dua saringan biologis memangkas 375 → 11: frekuensi populasi (AF < 0,01 — varian umum tidak menyebabkan penyakit langka) + consequence (stop_gained/frameshift/splice_donor = tinggi; missense = sedang).",
      "Klasifikasi beraturan eksplisit: AF < 0,001 & consequence tinggi → Patogenik; AF < 0,01 & missense → VUS; sisanya Benign. Hasil: 3 patogenik (var_0042 G6PD, var_0177 HBB, var_0331 CFTR) + 8 VUS — cocok 11/11 dengan referensi.",
      "VUS adalah status sementara yang dikomunikasikan jujur: dilaporkan terpisah dengan ketidakpastiannya, ditindaklanjuti dengan segregasi keluarga, dievaluasi ulang berkala.",
      "UPGMA: gabungkan pasangan terdekat, hitung ulang jarak sebagai rata-rata berbobot, ulangi. Merge pertama S2+S5 (0,008); tetangga terdekat proband S3 (0,015). Prosedur deterministik = bisa diaudit.",
      "Audit vendor menemukan 3 kesalahan + 2 cacat terukur: 2 FP pada varian umum (AF 35% & 13%), 1 FN pada frameshift HBB, 'akurasi 99%' tanpa denominator, tanpa jejak QC.",
      "Laporan klinis: HASIL + INTERPRETASI + VUS terpisah + KETERBATASAN + REKOMENDASI. Klasifikasi varian ≠ diagnosis klinis — dokter yang menegakkan diagnosis.",
      "Keterbatasan ditulis, bukan disembunyikan: aturan disederhanakan, eksom buta terhadap varian struktural, VUS bisa direklasifikasi, data sintetis butuh validasi nyata.",
      "Deliverable-mu: laporan varian ≤ 5 halaman (metode & validasi, temuan berbukti, filogenetik, penolakan vendor ber-ID, rekomendasi) — dokumen yang siap dibaca komite etik.",
    ],
  },
];

(pjVcfVarian.steps as V2Step[]).push(...LANJUTAN_VCF_B, ...LANJUTAN_VCF_C);
