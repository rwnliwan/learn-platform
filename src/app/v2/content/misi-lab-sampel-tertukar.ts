import type { V2Mission } from "../lib/types";

// ── MISI LAB: Sampel yang Tertukar ────────────────────────────────────────
// Pilot B — Bioinformatika. Dataset: SEQC/MAQC-III (Bioconductor seqc,
// GPL-3): ILM, situs BGI+MAY, sampel A (UHRR)/B (HBRR) × 4 replika = 16 sampel;
// top 3.000 gen tervariabel + 92 ERCC; TaqMan RT-PCR sebagai ground truth.
// File: public/misi/misi-lab-sampel-tertukar/samples.csv, counts.csv,
// samples_audit.csv, counts_audit.csv, taqman_subset.csv.

const BASE = "/misi/misi-lab-sampel-tertukar";

export const misiLabTertukar: V2Mission = {
  slug: "misi-lab-sampel-tertukar",
  track: "Bioinformatika",
  module: "Misi",
  title: "Misi Lab: Sampel yang Tertukar",
  estMinutes: 150,
  role: "Bioinformatician penerima paket hasil sequencing",
  client:
    "Kepala core facility — hasil differential expression “terlalu bagus untuk jadi kenyataan”, dan paper harus submit bulan depan",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Hasil yang terlalu bagus untuk jadi kenyataan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Bioinformatician di sebuah institut riset — penjaga gerbang kualitas data sequencing",
        client:
          "Kepala core facility sequencing. Paket hasil RNA-seq (matriks count + metadata + metrik QC) baru datang dari dua situs. Analisis awal menemukan ribuan gen “terdiferensial ekspresi” antara sampel A dan B — hasil yang terlalu bagus. Paper harus submit bulan depan; kalau hasilnya ternyata artefak teknis, yang malu bukan cuma analisnya.",
        story: [
          "Rabu, 11:15. Kepala core facility memanggilmu ke ruangannya dengan wajah yang kamu kenal: campuran bangga dan takut. “Lihat ini,” katanya, menunjukkan volcano plot dengan ribuan titik merah menyala. “DE analysis A vs B — 4.000 gen signifikan. Ini bisa jadi paper besar.” Kamu menatap plot itu lebih lama darinya. Terlalu bagus. Dalam pengalamanmu, hasil biologis yang nyata itu berantakan di tepinya; hasil yang “sempurna” biasanya berarti ada yang salah di pipelinenya — batch effect, label tertukar, atau kontaminasi.",
          "Kamu meminta paket mentahnya: 16 sampel (2 situs × 2 kondisi × 4 replika), plus ERCC spike-in — RNA sintetis dengan konsentrasi yang DIKETAHUI yang ditambahkan ke tiap sampel sebagai “mata-mata” kualitas — dan data TaqMan RT-PCR sebagai ground truth independen. “Kalau ERCC-nya tidak berperilaku seperti seharusnya, tidak ada satu pun angka DE yang boleh dipercaya,” katamu. Ia mengangguk pelan. “Cek semuanya. Saya mau kebenaran, bukan paper.”",
          "Seseorang telah menyabotase salinan audit paket ini — label tertukar, kolom duplikat, batch berkualitas rendah. Tugasmu: forensik QC penuh, temukan sabotase itu, putuskan sampel mana yang layak di-re-sequence, dan tulis laporan QC yang berani berkata “jangan publish” bila memang begitu.",
        ],
        objectives: [
          "Melakukan QC forensik: library size, fraksi ERCC, dan PCA untuk mendeteksi batch effect antar situs.",
          "Mengidentifikasi 3 sabotase (label tertukar, kolom duplikat, batch berkualitas rendah) dengan bukti kuantitatif.",
          "Menulis laporan QC + rekomendasi re-sequence dengan justifikasi biaya-manfaat.",
        ],
        prereqSummary:
          "Count matrix: tabel gen × sampel berisi cacahan read — fondasi semua analisis RNA-seq. Batch effect: perbedaan teknis antar batch/situs (reagen, mesin, operator) yang bisa meniru sinyal biologis; PCA (principal component analysis) mereduksi ribuan dimensi gen menjadi 2 sumbu utama — kalau sampel mengelompok by SITUS bukan by KONDISI, itu sirene batch effect. ERCC spike-in: RNA sintetis berkonsentrasi diketahui; fraksinya harus konsisten antar sampel — kalau tidak, ada yang salah di prep.",
        datasetNote:
          "Sumber: paket data eksperimen Bioconductor `seqc` v1.46.0 (SEQC/MAQC-III), lisensi GPL-3.\nSeleksi: platform Illumina, situs BGI + MAY, sampel A (UHRR)/B (HBRR) × 4 replika = 16 sampel; kolom lane/flowcell diagregasi (jumlah). Top 3.000 gen tervariabel (varians CPM) + 92 ERCC.\nFile: samples.csv (metrik QC), counts.csv (matriks, gen × 16 sampel), taqman_subset.csv (ground truth RT-PCR). Versi audit (samples_audit.csv, counts_audit.csv) memuat 3 sabotase terdokumentasi. Metode: METODE.md. Tidak ada PII.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "16 sampel, 3.092 gen, dan 3 kebohongan",
      prose: [
        "`samples.csv` — 16 baris metrik QC: `sample_id, site, grup, replika, library_size, gen_terdeteksi, fraksi_ercc`. Ini meja forensik pertamamu: library size yang jomplang, fraksi ERCC yang tidak konsisten, dan label grup adalah tiga hal pertama yang dicek bioinformatician waras.",
        "`counts.csv` — matriks 3.092 gen × 16 sampel (simbol gen sebagai baris). `taqman_subset.csv` — nilai TaqMan RT-PCR untuk gen yang overlap: ground truth independen. Kalau RNA-seq bilang gen X naik 8× tapi TaqMan bilang 1,2×, yang dipercaya TaqMan — dan pipelinenya yang diinterogasi.",
        "Versi audit (`samples_audit.csv`, `counts_audit.csv`) adalah yang kamu forensik. Tiga sabotase menunggumu di sana — tanpa pengumuman, tentu saja.",
      ],
      tasks: [
        { id: "t1", text: "Buka `samples_audit.csv`: catat rentang library_size — adakah yang jomplang?" },
        { id: "t2", text: "Buka `counts_audit.csv`: berapa gen × berapa sampel" },
      ],
      note: {
        title: "Miskonsepsi #1: “data dari core facility pasti beres”",
        type: "risk",
        body: "Core facility menjalankan mesin dengan sempurna — tapi label sampel ditempel manusia, file di-rename manusia, dan metadata diisi manusia. Sebagian besar “temuan biologis” yang gagal direplikasi ternyata adalah kesalahan label. QC bukan ketidakpercayaan pada lab; QC adalah cara menghormati data.",
      },
      reference:
        "samples_audit.csv (16 sampel, metrik QC) + counts_audit.csv (3.092 gen × 16) + taqman_subset.csv (ground truth).",
    },
    {
      id: "lab-qc",
      eyebrow: "Langkah 3 · Lab 1 — Forensik QC",
      title: "Mana batch yang sakit?",
      prose: [
        "Forensik dimulai dari yang paling kasat mata: metrik per sampel. Muat `samples_audit.csv`, lalu jawab tiga pertanyaan: (1) berapa sampel; (2) situs mana yang library size-nya amblas (median jauh di bawah situs lain) — simpan di `situs_rendah`; (3) adakah DUA sampel dengan library size dan gen terdeteksi IDENTIK persis (duplikat terselubung) — simpan sample_id-nya di `kolom_duplikat`.",
        "Duplikat kolom adalah sabotase yang licin: di PCA ia terlihat sebagai dua titik yang berhimpit sempurna — mustahil terjadi secara alami pada data biologis.",
      ],
      tasks: [
        { id: "t1", text: "Muat samples_audit.csv ke `df`; hitung `n_sampel`" },
        { id: "t2", text: "Median library_size per site → `situs_rendah` (string, mis. \"BGI\")" },
        { id: "t3", text: "Temukan pasangan sampel dengan (library_size, gen_terdeteksi) identik → `kolom_duplikat`" },
      ],
      expected: "n_sampel=16, situs_rendah=BGI, kolom_duplikat=MAY_B_R3",
      note: {
        title: "Miskonsepsi #2: “PCA dulu, baru mikir”",
        type: "pitfall",
        body: "Banyak analis langsung melempar data ke PCA tanpa melihat metrik dasar. Padahal library size yang amblas 4× lipat sudah menjawab “ada batch sakit” sebelum PCA dibuka. Urutan forensik yang benar: metrik sederhana dulu (murah, jelas), visualisasi kemudian (mahal, butuh interpretasi).",
      },
      hints: [
        "Muat: `pd.read_csv(open_url(\"/misi/misi-lab-sampel-tertukar/samples_audit.csv\"))`.",
        "Median per site: `df.groupby(\"site\")[\"library_size\"].median()` — situs_rendah = yang mediannya terkecil.",
        "Duplikat: `df[df.duplicated(subset=[\"library_size\",\"gen_terdeteksi\"], keep=False)]` — ambil sample_id yang BUKAN kemunculan pertama.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          'URL = "/misi/misi-lab-sampel-tertukar/samples_audit.csv"',
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_sampel = ...",
          "",
          "med_site = ...  # median library_size per site",
          'situs_rendah = ...  # string nama site',
          "",
          "dup = ...  # DataFrame baris-baris duplikat (library_size & gen_terdeteksi sama)",
          "# ambil sample_id duplikat yang BUKAN kemunculan pertama:",
          "kolom_duplikat = ...",
          "",
          'print("sampel:", n_sampel, "| situs rendah:", situs_rendah, "| duplikat:", kolom_duplikat)',
        ].join("\n"),
        lockLines: 5,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          'URL = "/misi/misi-lab-sampel-tertukar/samples_audit.csv"',
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_sampel = len(df)",
          "",
          'med_site = df.groupby("site")["library_size"].median()',
          "situs_rendah = str(med_site.idxmin())",
          "",
          'dup = df[df.duplicated(subset=["library_size", "gen_terdeteksi"], keep=False)]',
          "kolom_duplikat = dup[dup.duplicated(subset=[\"library_size\", \"gen_terdeteksi\"], keep=\"first\")][\"sample_id\"].iloc[0]",
          "",
          'print("sampel:", n_sampel, "| situs rendah:", situs_rendah, "| duplikat:", kolom_duplikat)',
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus DataFrame dari samples_audit.csv." },
          { kind: "equal", task: "t1", label: "`n_sampel` = 16", name: "n_sampel", value: 16, msg: "Ada 16 sampel (2 situs × 2 grup × 4 replika)." },
          { kind: "equal", task: "t2", label: "`situs_rendah` = \"BGI\"", name: "situs_rendah", value: "BGI", msg: "Median library size BGI amblas (~1/4) — batch berkualitas rendah." },
          { kind: "equal", task: "t3", label: "`kolom_duplikat` = \"MAY_B_R3\"", name: "kolom_duplikat", value: "MAY_B_R3", msg: "MAY_B_R3 identik persis dengan MAY_A_R1 — salinan diam-diam." },
        ],
      },
    },
    {
      id: "lab-korelasi",
      eyebrow: "Langkah 4 · Lab 2 — Bukti duplikat",
      title: "Korelasi 1,0000 adalah pengakuan",
      prose: [
        "Kamu mencurigai MAY_B_R3 adalah salinan MAY_A_R1. Kecurigaan bukan bukti — buktikan dengan angka. Muat `counts_audit.csv` (3.092 gen × 16 sampel), hitung korelasi Pearson antara kolom MAY_A_R1 dan MAY_B_R3, simpan di `korelasi_duplikat`. Dua sampel biologis independen TIDAK PERNAH berkorelasi 1,0000 — bahkan replika teknis terbaik pun punya noise.",
        "Lalu hitung juga korelasi MAY_A_R1 vs MAY_A_R2 (replika sejati) sebagai pembanding — simpan di `korelasi_replika`. Selisih keduanya adalah ukuran seberapa “tidak alami” duplikat itu.",
      ],
      tasks: [
        { id: "t1", text: "Muat counts_audit.csv; hitung `korelasi_duplikat` (MAY_A_R1 vs MAY_B_R3)" },
        { id: "t2", text: "Hitung `korelasi_replika` (MAY_A_R1 vs MAY_A_R2) sebagai pembanding" },
      ],
      expected: "korelasi_duplikat=1.0 (persis), korelasi_replika≈0.99 (tinggi tapi tak sempurna)",
      note: {
        title: "Kenapa ini penting",
        body: "Duplikat terselubung menggandakan bobot satu sampel dalam DE analysis — p-value mengecil palsu, “temuan” membesar palsu. Volcano plot “terlalu bagus” yang dilihat kepala facility kemungkinan besar lahir dari sini. Satu angka korelasi = satu paper yang diselamatkan dari retraksi.",
      },
      hints: [
        "Muat: `pd.read_csv(open_url(\"/misi/misi-lab-sampel-tertukar/counts_audit.csv\"), index_col=0)`.",
        "Korelasi dua kolom: `df[\"MAY_A_R1\"].corr(df[\"MAY_B_R3\"])` — method Pearson default.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          'URL = "/misi/misi-lab-sampel-tertukar/counts_audit.csv"',
          "df = pd.read_csv(open_url(URL), index_col=0)",
          "",
          "korelasi_duplikat = ...  # MAY_A_R1 vs MAY_B_R3",
          "korelasi_replika = ...   # MAY_A_R1 vs MAY_A_R2",
          "",
          'print("korelasi duplikat:", korelasi_duplikat)',
          'print("korelasi replika sejati:", korelasi_replika)',
        ].join("\n"),
        lockLines: 5,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          'URL = "/misi/misi-lab-sampel-tertukar/counts_audit.csv"',
          "df = pd.read_csv(open_url(URL), index_col=0)",
          "",
          'korelasi_duplikat = float(df["MAY_A_R1"].corr(df["MAY_B_R3"]))',
          'korelasi_replika = float(df["MAY_A_R1"].corr(df["MAY_A_R2"]))',
          "",
          'print("korelasi duplikat:", korelasi_duplikat)',
          'print("korelasi replika sejati:", korelasi_replika)',
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`korelasi_duplikat` terhitung", name: "korelasi_duplikat", msg: "Hitung korelasi Pearson MAY_A_R1 vs MAY_B_R3." },
          { kind: "equal", task: "t1", label: "`korelasi_duplikat` = 1.0", name: "korelasi_duplikat", value: 1.0, tol: 1e-9, msg: "Duplikat persis → korelasi tepat 1.0. Inilah buktinya." },
          { kind: "defined", task: "t2", label: "`korelasi_replika` terhitung", name: "korelasi_replika", msg: "Hitung korelasi MAY_A_R1 vs MAY_A_R2." },
          { kind: "equal", task: "t2", label: "`korelasi_replika` sesuai data", name: "korelasi_replika", value: 0.9973, tol: 0.001, msg: "Replika sejati berkorelasi tinggi TAPI tidak pernah tepat 1.0 — ada noise biologis." },
        ],
      },
    },
  ],
};

export default misiLabTertukar;

// ── lanjutan misiLabTertukar: keputusan + cabang + audit + deliverable ───
import type { V2Step } from "../lib/types";

const LANJUTAN_LAB: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Re-sequence yang mana? Anggaran terbatas, paper menunggu",
    prose: [
      "Bukti forensikmu: (1) seluruh batch BGI library size-nya amblas ~4× — berkualitas rendah; (2) MAY_B_R3 adalah duplikat diam-diam dari MAY_A_R1; (3) label A/B tertukar di BGI_A_R2 dan BGI_B_R2. Kepala facility bertanya: dengan anggaran re-sequence yang hanya cukup untuk 8 sampel, apa rekomendasi teknismu?",
    ],
    tasks: [],
    decision: {
      prompt: "Sampel mana yang kamu rekomendasikan untuk re-sequence?",
      options: [
        {
          id: "opt-bgi",
          label: "Re-sequence SELURUH batch BGI (8 sampel)",
          rationale: "Batch BGI berkualitas rendah secara sistemik — semua kesimpulannya diragukan. Bersihkan total.",
          nextStepId: "temuan-bgi",
          consequenceNote: "Re-sequence 8 sampel menghabiskan seluruh anggaran — dan hasilnya mengonfirmasi batch BGI memang bermasalah. Tapi kamu tidak punya anggaran tersisa untuk memverifikasi perbaikan label yang tertukar, dan duplikat MAY_B_R3 lolos dari perhatian karena “sudah ditangani”.",
        },
        {
          id: "opt-presisi",
          label: "Re-sequence MAY_B_R3 saja + perbaiki label BGI yang tertukar secara administratif",
          rationale: "Presisi: duplikat harus diganti data baru; label tertukar adalah kesalahan administratif yang bisa diperbaiki tanpa re-sequence; batch BGI rendah tapi masih bisa dipakai dengan normalisasi hati-hati.",
          nextStepId: "temuan-presisi",
          consequenceNote: "Keputusan paling efisien: 1 re-sequence + 2 koreksi label + normalisasi ulang. Paper terselamatkan dengan biaya minimal. Tapi kamu bertaruh bahwa batch BGI yang “rendah tapi bisa dinormalisasi” tidak menyembunyikan masalah lebih dalam — taruhan yang harus kamu nyatakan eksplisit di laporan.",
        },
        {
          id: "opt-buang",
          label: "Buang MAY_B_R3 (duplikat), lanjutkan tanpa re-sequence",
          rationale: "Paling murah: duplikat dibuang, label diperbaiki, analisis jalan dengan 15 sampel. Tidak ada biaya tambahan.",
          nextStepId: "temuan-buang",
          consequenceNote: "Analisis berjalan — tapi tanpa re-sequence, kamu tidak pernah tahu apakah MAY_B_R3 yang “asli” (bukan duplikatnya) menyimpan sinyal biologis penting. Penghematan hari ini = ketidakpastian permanen di paper. Reviewer yang teliti akan bertanya: “kenapa sampel ini hilang?”",
        },
      ],
    },
  },
  {
    id: "temuan-bgi",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Delapan sampel di-sequence ulang",
    prose: [
      "Delapan sampel BGI di-sequence ulang dengan prep baru — library size kembali normal, dan hasil DE menyusut dari “4.000 gen signifikan” menjadi 1.200 yang kredibel. Kemenangan teknis yang nyata. Tapi anggarannya habis total: tidak ada dana tersisa untuk mengulang MAY_B_R3, dan koreksi label A/B yang tertukar hanya dicatat di suplemen tanpa verifikasi independen.",
      "Pelajaran: “bersihkan total” terasa memuaskan, tapi dalam sains yang anggarannya terbatas, memuaskan bukan metrik. Metriknya: berapa banyak ketidakpastian yang berhasil kamu hilangkan per rupiah.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Apakah 8 re-sequence itu necessary, atau 1 re-sequence + koreksi administratif sudah cukup? Tulis analisis biaya-manfaatnya — itulah yang membedakan teknisi dari penasihat.",
    },
  },
  {
    id: "temuan-presisi",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Satu re-sequence, dua koreksi label",
    prose: [
      "MAY_B_R3 di-sequence ulang (hasilnya: sampel biologis normal, bukan duplikat), label BGI_A_R2/BGI_B_R2 dikoreksi setelah verifikasi silang dengan log prep asli, dan batch BGI dinormalisasi dengan metode yang robust terhadap perbedaan library size. Total biaya: 1 re-sequence. Hasil DE final: 1.350 gen signifikan — masih paper yang kuat, tapi kali ini bisa dipertahankan di depan reviewer.",
      "Keputusan ini benar — dengan satu catatan yang wajib kamu tulis di laporan: kamu MENGASUMSIKAN batch BGI yang rendah kualitasnya masih bisa diselamatkan normalisasi. Asumsi itu harus dinyatakan, bukan disembunyikan.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Keputusan presisi pun punya asumsi. Tulis eksplisit: “analisis ini mengasumsikan X; bila X salah, maka Y.” Itulah kejujuran ilmiah.",
    },
  },
  {
    id: "temuan-buang",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Tanpa re-sequence — dan tanpa kepastian",
    prose: [
      "MAY_B_R3 dibuang, analisis berjalan dengan 15 sampel. Hasilnya terlihat baik-baik saja — sampai reviewer kedua bertanya: “Kenapa n=15, bukan 16? Ke mana satu sampelnya?” Kamu menjelaskan duplikat — dan ia bertanya lagi: “Bagaimana kamu tahu yang dibuang adalah duplikatnya, bukan yang aslinya?” Diam. Tanpa re-sequence, kamu tidak bisa menjawab dengan pasti.",
      "Paper akhirnya lolos setelah ronde revisi yang melelahkan — tapi pelajarannya mahal: penghematan yang menghilangkan kemampuanmu menjawab pertanyaan reviewer bukanlah penghematan.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Catat untuk deliverable-mu",
      body: "Kapan “buang dan lanjut” bisa dibenarkan? Tulis kriterianya — dan akui bahwa kasus ini tidak memenuhinya.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 sampel: temukan 3 sabotase",
    prose: [
      "Misi audit. Di bawah ini 16 sampel dari `samples_audit.csv` — dossier yang diklaim “sudah lolos QC core facility”. Tiga sabotase disuntikkan tanpa pengumuman. Tandai sampel yang janggal, lalu buka debrief.",
      "Senjatamu: library size (Lab 1), korelasi duplikat (Lab 2), dan logika label (A/B × replika harus konsisten).",
    ],
    tasks: [],
    auditDossier: {
      version: "lab-pilot-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi 16 sampel yang sudah lolos QC (cuplikan samples_audit.csv).",
      columns: ["Sampel", "Situs", "Grup", "Library size", "Fraksi ERCC"],
      rows: [
        { rowId: 1, cells: { "Sampel": "BGI_A_R1", "Situs": "BGI", "Grup": "A", "Library size": "18.087.470", "Fraksi ERCC": "0,0123" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 2, cells: { "Sampel": "BGI_A_R2", "Situs": "BGI", "Grup": "B", "Library size": "15.148.127", "Fraksi ERCC": "0,0121" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 3, cells: { "Sampel": "BGI_A_R3", "Situs": "BGI", "Grup": "A", "Library size": "18.500.289", "Fraksi ERCC": "0,012" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 4, cells: { "Sampel": "BGI_A_R4", "Situs": "BGI", "Grup": "A", "Library size": "21.550.869", "Fraksi ERCC": "0,0119" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 5, cells: { "Sampel": "BGI_B_R1", "Situs": "BGI", "Grup": "B", "Library size": "21.872.731", "Fraksi ERCC": "0,0184" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 6, cells: { "Sampel": "BGI_B_R2", "Situs": "BGI", "Grup": "A", "Library size": "21.357.332", "Fraksi ERCC": "0,0184" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 7, cells: { "Sampel": "BGI_B_R3", "Situs": "BGI", "Grup": "B", "Library size": "22.989.699", "Fraksi ERCC": "0,0173" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 8, cells: { "Sampel": "BGI_B_R4", "Situs": "BGI", "Grup": "B", "Library size": "16.983.324", "Fraksi ERCC": "0,0172" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 9, cells: { "Sampel": "MAY_A_R1", "Situs": "MAY", "Grup": "A", "Library size": "53.111.978", "Fraksi ERCC": "0,0195" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 10, cells: { "Sampel": "MAY_A_R2", "Situs": "MAY", "Grup": "A", "Library size": "99.864.612", "Fraksi ERCC": "0,0188" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 11, cells: { "Sampel": "MAY_A_R3", "Situs": "MAY", "Grup": "A", "Library size": "74.969.524", "Fraksi ERCC": "0,0195" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 12, cells: { "Sampel": "MAY_A_R4", "Situs": "MAY", "Grup": "A", "Library size": "168.975.343", "Fraksi ERCC": "0,0193" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 13, cells: { "Sampel": "MAY_B_R1", "Situs": "MAY", "Grup": "B", "Library size": "95.221.588", "Fraksi ERCC": "0,0262" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 14, cells: { "Sampel": "MAY_B_R2", "Situs": "MAY", "Grup": "B", "Library size": "83.633.641", "Fraksi ERCC": "0,0256" }, claims: [{ label: "Status QC", value: "Lolos" }] },
        { rowId: 15, cells: { "Sampel": "MAY_B_R3", "Situs": "MAY", "Grup": "B", "Library size": "53.111.978", "Fraksi ERCC": "0,0195" }, claims: [{ label: "Status QC", value: "Lolos" }, { label: "Catatan", value: "Replika konsisten" }] },
        { rowId: 16, cells: { "Sampel": "MAY_B_R4", "Situs": "MAY", "Grup": "B", "Library size": "98.093.278", "Fraksi ERCC": "0,025" }, claims: [{ label: "Status QC", value: "Lolos" }] },
      ],
      injections: [
        { key: "label-tertukar", rowIds: [2, 6], title: "Label grup A/B tertukar", clue: "BGI_A_R2 berlabel grup B dan BGI_B_R2 berlabel grup A — pola penamaan (A_R*) tidak cocok dengan labelnya. Di DE analysis, ini menukar kondisi yang dibandingkan.", danger: "Kesimpulan biologis terbalik: gen yang sebenarnya naik di kondisi A dilaporkan naik di B. Paper yang ditarik (retraksi) sering lahir dari sini." },
        { key: "kolom-duplikat", rowIds: [15], title: "Kolom duplikat terselubung", clue: "MAY_B_R3 identik persis dengan MAY_A_R1 (library size & gen terdeteksi sama; korelasi 1,0000). Klaim “replika konsisten” menutupi bahwa ini salinan, bukan replika.", danger: "Bobot satu sampel terganda dalam DE — p-value palsu mengecil, temuan palsu membesar." },
        { key: "batch-rendah", rowIds: [1, 2, 3, 4, 5, 6, 7, 8], title: "Batch BGI berkualitas rendah", clue: "Seluruh sampel BGI library size-nya ~1/4 dari MAY — konsisten di 8 sampel, jadi ini masalah batch (prep/sequencing), bukan satu sampel apes.", danger: "Perbandingan A vs B tercemar batch effect situs; tanpa koreksi, “temuan DE” = perbedaan teknis BGI vs MAY." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Laporan QC untuk kepala facility",
    prose: [
      "Tulis laporan QC seperti akan dilampirkan ke paper: temuan, bukti, rekomendasi re-sequence dengan justifikasi biaya, dan — yang paling penting — asumsi yang kamu buat.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan QC (3 kalimat): apakah paket ini layak publish apa adanya?",
        "Temuan per sabotase: bukti kuantitatif (angka library size, korelasi, pola label).",
        "Rekomendasi re-sequence: sampel mana, kenapa, dan analisis biaya-manfaat vs opsi lain.",
        "Asumsi & batas: apa yang kamu asumsikan (mis. batch BGI masih bisa dinormalisasi), dan apa yang tetap tidak bisa disimpulkan.",
        "Pelajaran sistemik: kontrol apa yang harus dipasang agar ini tidak terulang (validasi label otomatis, cek duplikat kolom, ambang library size).",
      ],
      rubric: [
        { criterion: "Deteksi sabotase", weight: 30, levels: ["Tidak menemukan", "Sebagian tanpa bukti", "Ketiga sabotase dengan bukti angka"] },
        { criterion: "Kebenaran forensik", weight: 25, levels: ["Metrik salah", "Metrik benar, interpretasi lemah", "Metrik + interpretasi + pembanding (replika) benar"] },
        { criterion: "Kualitas keputusan re-seq", weight: 20, levels: ["Tanpa justifikasi biaya", "Justifikasi ada", "Biaya-manfaat + risiko opsi lain eksplisit"] },
        { criterion: "Kejujuran asumsi", weight: 25, levels: ["Asumsi disembunyikan", "Sebagian dinyatakan", "Semua asumsi + batas dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Tiga sabotase, satu pelajaran",
    prose: [
      "Debrief dibuka. Tiga sabotase yang disuntikkan — semuanya pola nyata di core facility:",
      "1) **Label tertukar** (sampel 2 & 6): BGI_A_R2 ↔ BGI_B_R2. Di dunia nyata: tube tertukar saat prep, atau kolom metadata salah isi. Obatnya: barcode + validasi silang label vs pola ekspresi (sampel A harus mirip A lain).",
      "2) **Kolom duplikat** (sampel 15): MAY_B_R3 = salinan MAY_A_R1, korelasi tepat 1,0000. Di dunia nyata: file tersalin ganda, atau sampel yang sama di-sequence dua kali tanpa dicatat. Obatnya: cek korelasi antar-kolom otomatis di pipeline QC — apa pun yang berkorelasi 1,0000 adalah alarm.",
      "3) **Batch berkualitas rendah** (sampel 1–8): seluruh BGI library size-nya ~1/4 MAY. Di dunia nyata: batch reagen jelek, atau lane bermasalah. Obatnya: ambang library size minimum + ERCC fraction check SEBELUM analisis — bukan sesudah paper ditolak reviewer.",
      "Skor deteksimu (x/3) mengukur satu hal: apakah kamu memeriksa, atau hanya memercayai. Volcano plot “terlalu bagus” di awal misi adalah gejala klasik: hasil yang sempurna hampir selalu berarti data yang tidak diperiksa. Bioinformatician yang baik adalah orang yang paling tidak percaya pada hasil bagus — termasuk hasilnya sendiri.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: QC = langkah administratif",
      type: "risk",
      body: "QC sering dianggap “kerjaan sebelum kerjaan beneran”. Padahal dalam genomik, QC ADALAH kerjaan benerannya — sebagian besar retraksi paper omics berasal dari masalah sampel, bukan dari statistik yang salah. Satu jam forensik menghemat satu tahun mempertahankan paper yang salah.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Urutan forensik: metrik sederhana dulu (library size, ERCC), visualisasi kemudian. Library size yang amblas 4× menjawab sebelum PCA dibuka.",
      "Tiga pola sabotase lab: label tertukar (cek konsistensi penamaan vs label), kolom duplikat (korelasi tepat 1,0000 = pengakuan), batch berkualitas rendah (pola sistemik per situs, bukan satu sampel apes).",
      "Replika sejati berkorelasi tinggi tapi tak pernah 1,0000 — selisihnya adalah noise biologis yang justru membuktikan keaslian.",
      "Keputusan re-sequence = analisis biaya-manfaat: nyatakan asumsi (mis. batch rendah masih bisa dinormalisasi) dan apa yang tetap tak terjawab.",
      "Data: SEQC/MAQC-III (Bioconductor seqc, GPL-3), ILM, BGI+MAY, A/B × 4 replika, 3.092 gen (top 3.000 variabel + 92 ERCC).",
    ],
  },
];

(misiLabTertukar.steps as V2Step[]).push(...LANJUTAN_LAB);
