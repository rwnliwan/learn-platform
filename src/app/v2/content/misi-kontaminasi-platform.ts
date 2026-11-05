import type { V2Mission } from "../lib/types";

// ── MISI KONTAMINASI PLATFORM ────────────────────────────────────────────
// M1 DATA-SAINTEK — Bioinformatika Misi B ("edge").
// Beda dari pilot misi-lab-sampel-tertukar (ILM, 2 situs, swap A/B + kolom
// duplikat + batch berkualitas rendah): misi ini memakai platform ROC
// (Roche 454) dari 3 center (MGP/NYU/SQW) dengan sudut forensik BERBEDA —
// label center yang salah, kegagalan spike-in ERCC (ground truth teknis),
// kontaminasi lintas platform (kolom ILM yang dilabeli ROC), dan replika
// yang "terlalu sempurna" (salinan + jitter).
// Dataset: Bioconductor seqc 1.46.0 (GPL-3), ROC_refseq_gene_{MGP,NYU,SQW}.rda,
// 12 sampel A/B × 2 replika, 3.092 gen (top 3000 varian + 92 ERCC).
// File: public/misi/misi-kontaminasi-platform/counts.csv (bersih) +
// counts_audit.csv + samples.csv + samples_audit.csv + ercc_qc.csv
// (4 injeksi terdokumentasi). METODE.md.

const BASE = "/misi/misi-kontaminasi-platform";

export const misiKontaminasi: V2Mission = {
  slug: "misi-kontaminasi-platform",
  track: "Bioinformatika",
  module: "Misi",
  title: "Misi Kontaminasi Platform: Kolom yang Bukan dari Sini",
  estMinutes: 150,
  role: "Bioinformatician / auditor QC core facility",
  client:
    "Kepala laboratorium genomik — paket hasil sequencing ROC dari 3 center untuk studi ekspresi diferensial; ada yang aneh di paket ini",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Paket 12 sampel, 3 center, dan satu kolom asing",
      prose: [],
      tasks: [],
      briefing: {
        role: "Bioinformatician / auditor QC di core facility genomik",
        client:
          "Kepala laboratorium genomik. Tiga center (MGP, NYU, SQW) mengirim hasil sequencing platform ROC untuk sampel referensi A (UHRR) dan B (HBRR) — total 12 sampel. Studi ekspresi diferensial (DE) antar-sampel akan menentukan kandidat biomarker. Sebelum analisis DE jalan, kamu diminta audit QC: 'Saya dengar ada yang aneh di paket ini. Pastikan tidak ada sampel yang salah label, gagal prep, atau — amit-amit — bukan dari platform ROC.'",
        story: [
          "Selasa, 10:15. Kamu membuka paket: matriks count 3.092 gen × 12 sampel, metadata sampel, dan tabel QC berisi library size + fraksi ERCC per sampel. ERCC adalah spike-in sintetik — RNA buatan dengan konsentrasi DIKETAHUI yang ditambahkan ke setiap sampel sebelum sequencing. Karena konsentrasinya diketahui, ERCC adalah 'kebenaran teknis': kalau ERCC-nya aneh, masalahnya di teknis, bukan biologi.",
          "Lima menit menatap tabel QC, alismu terangkat. Satu sampel library size-nya 677 ribu — 5 sampai 15 kali lipat sampel lain. Satu sampel fraksi ERCC-nya tepat NOL — spike-in yang seharusnya selalu ada, tidak ada sama sekali. Dan ada 'replika ketiga' yang korelasinya 0,9966 dengan replika kedua — replika biologis tidak pernah seidentik itu.",
          "Ditambah satu kecurigaan yang lebih halus: sampel yang diklaim dari center MGP, tetangga terdekatnya (korelasi tertinggi) justru sampel NYU. Label center — metadata paling dasar — mungkin salah. Misimu: bangun baseline QC yang jujur dari data bersih, temukan 4 sabotase di salinan audit, putuskan sampel mana yang prioritas diselidiki, dan tulis laporan QC yang berani berkata 'batch ini tidak bisa dipakai' bila memang begitu.",
        ],
        objectives: [
          "Membangun baseline QC: library size dan fraksi ERCC per sampel/center dari data bersih, serta struktur pengelompokan antar-center.",
          "Menemukan minimal 3 anomali (label center salah, kegagalan ERCC, kontaminasi platform, replika palsu) dengan bukti kuantitatif.",
          "Memutuskan 1 sampel prioritas investigasi forensik dengan anggaran terbatas — lengkap dengan trade-off-nya.",
          "Menulis laporan QC + rekomendasi: sampel mana dipakai/dibuang/re-sequence, dengan justifikasi teknis.",
        ],
        prereqSummary:
          "Matriks count = tabel jumlah read per gen per sampel — bahan mentah RNA-seq. Library size = total read per sampel; sampel dengan library jauh lebih kecil/besar dari yang lain patut dicurigai. Batch effect = perbedaan teknis antar-center/platform yang bisa meniru sinyal biologis; cara mengeceknya: sampel seharusnya paling mirip dengan replika se-center-nya (korelasi tertinggi). ERCC spike-in = RNA sintetik berkonsentrasi diketahui; fraksinya harus konsisten antar-sampel — fraksi NOL berarti prep gagal total.",
        datasetNote:
          "Sumber: Bioconductor experiment data package `seqc` 1.46.0 (SEQC/MAQC-III), lisensi GPL-3.\nSlice: platform ROC (Roche 454), anotasi RefSeq, 3 center (MGP, NYU, SQW) × sampel A (UHRR)/B (HBRR) × 2 replika = 12 sampel; 3.092 gen (top 3.000 varian log1p + 92 ERCC).\nFile counts.csv = matriks bersih. File counts_audit.csv + samples_audit.csv = salinan yang diaudit — SENGAJA dikotori (label center salah, ERCC di-nol-kan, satu kolom ILM dilabeli ROC, replika hasil salinan). ercc_qc.csv = tabel QC ground truth. Detail: METODE.md — jangan dibaca dulu.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali 12 sampel sebelum menuduh",
      prose: [
        "Tiga file menunggumu. `counts.csv`: matriks 3.092 gen × 12 sampel (kolom: EntrezID, Symbol, IsERCC + 12 sampel). `samples.csv`: metadata (sample, center, label A/B, replicate, platform). `ercc_qc.csv`: library size + fraksi ERCC per sampel — tabel QC yang seharusnya 'membosankan' bila semua beres.",
        "Salinan audit (`counts_audit.csv`, `samples_audit.csv`) berisi 14 'sampel' — dua di antaranya tidak ada di data bersih. Seseorang menyuntikkan 4 sabotase: label center yang salah, ERCC yang di-nol-kan, satu kolom dari platform ILM yang dilabeli ROC, dan replika hasil salinan. Detail di `METODE.md` — jangan mengintip.",
        "Aturan main: (1) baseline QC HANYA dari file bersih; (2) tuduhan HANYA pada file audit; (3) setiap tuduhan wajib punya angka — 'kelihatannya aneh' bukan bukti.",
      ],
      tasks: [
        { id: "t1", text: "Buka `samples.csv`: daftarkan 12 sampel, center, dan labelnya" },
        { id: "t2", text: "Buka `ercc_qc.csv`: berapa kisaran library size dan fraksi ERCC" },
      ],
      note: {
        title: "Miskonsepsi #1: metadata = fakta",
        type: "pitfall",
        body: "Kolom 'center' di samples.csv adalah KLAIM, bukan fakta. Metadata ditulis manusia (atau skrip manusia), dan manusia salah mengetik, salah copy-paste, salah menggabungkan file. Tugas auditor QC: verifikasi klaim metadata terhadap pola data — bukan sebaliknya.",
      },
      reference:
        "counts.csv + samples.csv + ercc_qc.csv (bersih, 12 sampel) vs counts_audit.csv + samples_audit.csv (14 'sampel', 4 sabotase).",
    },
    {
      id: "lab-qc",
      eyebrow: "Langkah 3 · Lab 1 — QC dasar",
      title: "Library size dan fraksi ERCC: dua angka yang tidak bisa berbohong",
      prose: [
        "Dua metrik QC paling dasar — dan paling sering dilewatkan karena 'terlalu sederhana'. Library size: total read per sampel. Sampel dengan library 5–15× lipat dari yang lain bukan 'bagus' — itu sampel dari dunia yang berbeda (atau platform yang berbeda). Fraksi ERCC: proporsi read yang berasal dari spike-in sintetik. ERCC ditambahkan dengan jumlah SAMA ke setiap sampel, jadi fraksinya harus konsisten — kecuali prep-nya gagal.",
        "Hitung keduanya dari file BERSIH. Di langkah audit nanti, kamu akan tahu persis angka 'normal' untuk tiap center — dan penyimpangan sekecil apa pun akan terlihat.",
      ],
      tasks: [
        { id: "t1", text: "Muat counts.csv + samples.csv; hitung library size per sampel" },
        { id: "t2", text: "Hitung fraksi ERCC per sampel (baris IsERCC==1 dibagi library size)" },
        { id: "t3", text: "Simpan: sampel dengan library size terbesar (`max_lib_sample`, nilainya `max_lib`) dan center dengan median fraksi ERCC tertinggi (`top_ercc_center`)" },
      ],
      expected:
        "max_lib_sample='NYU_B_1_R01', max_lib=139698, top_ercc_center='SQW'",
      note: {
        title: "Miskonsepsi #2: library besar = data bagus",
        type: "pitfall",
        body: "Insting berkata 'makin banyak read makin bagus'. Tapi dalam audit, library size adalah SIDIK JARI teknis: sampel ROC di sini berkisar 43–140 ribu read (untuk 3.092 gen terpilih). Sampel 677 ribu bukan 'lebih bagus' — ia berasal dari platform berbeda (ILM, ~4,4 juta read full). Library yang 'terlalu bagus' justru tersangka utama.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))`.",
        "Kolom sampel = semua kolom kecuali EntrezID, Symbol, IsERCC.",
        "Fraksi ERCC: `counts[counts['IsERCC']==1][sampel].sum() / counts[sampel].sum()` per sampel; median per center via metadata.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-kontaminasi-platform\"",
          "counts = pd.read_csv(open_url(BASE + \"/counts.csv\"))",
          "samples = pd.read_csv(open_url(BASE + \"/samples.csv\"))",
          "",
          "sampel = [c for c in counts.columns if c not in (\"EntrezID\", \"Symbol\", \"IsERCC\")]",
          "",
          "libsize = ...      # Series: total read per sampel",
          "ercc = ...         # DataFrame baris ERCC saja",
          "ercc_frac = ...    # Series: fraksi ERCC per sampel",
          "",
          "max_lib_sample = ...  # nama sampel, string",
          "max_lib = ...         # nilainya, int",
          "",
          "med_ercc = ...     # median fraksi ERCC per center (gabung info center dari samples)",
          "top_ercc_center = ... # nama center, string",
          "",
          "print(\"max lib:\", max_lib_sample, max_lib)",
          "print(\"top ERCC center:\", top_ercc_center)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-kontaminasi-platform\"",
          "counts = pd.read_csv(open_url(BASE + \"/counts.csv\"))",
          "samples = pd.read_csv(open_url(BASE + \"/samples.csv\"))",
          "",
          "sampel = [c for c in counts.columns if c not in (\"EntrezID\", \"Symbol\", \"IsERCC\")]",
          "",
          "libsize = counts[sampel].sum()",
          "ercc = counts[counts[\"IsERCC\"] == 1]",
          "ercc_frac = ercc[sampel].sum() / libsize",
          "",
          "max_lib_sample = str(libsize.idxmax())",
          "max_lib = int(libsize.max())",
          "",
          "center_of = dict(zip(samples[\"sample\"], samples[\"center\"]))",
          "med_ercc = ercc_frac.groupby([center_of[s] for s in ercc_frac.index]).median()",
          "top_ercc_center = str(med_ercc.idxmax())",
          "",
          "print(\"max lib:\", max_lib_sample, max_lib)",
          "print(\"top ERCC center:\", top_ercc_center)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`libsize` terhitung", name: "libsize", msg: "libsize harus berisi total read per sampel." },
          { kind: "equal", task: "t3", label: "`max_lib_sample` = NYU_B_1_R01", name: "max_lib_sample", value: "NYU_B_1_R01", msg: "Sampel dengan library size terbesar adalah NYU_B_1_R01." },
          { kind: "equal", task: "t3", label: "`max_lib` = 139698", name: "max_lib", value: 139698, tol: 1, msg: "Library size NYU_B_1_R01 = 139.698 read." },
          { kind: "equal", task: "t3", label: "`top_ercc_center` = SQW", name: "top_ercc_center", value: "SQW", msg: "Median fraksi ERCC tertinggi di center SQW (0,133)." },
        ],
      },
    },
    {
      id: "lab-cluster",
      eyebrow: "Langkah 4 · Lab 2 — Siapa tetangga terdekatmu?",
      title: "Batch effect: sampel harus paling mirip replika se-center-nya",
      prose: [
        "Prinsip forensik batch effect: dua replika dari center yang sama, sampel yang sama, seharusnya LEBIH MIRIP satu sama lain dibanding dengan sampel mana pun dari center lain. Kalau 'tetangga terdekat' (korelasi tertinggi) sebuah sampel justru dari center lain, ada dua kemungkinan: batch effect-nya memang sekuat itu — atau label center-nya salah.",
        "Hitung matriks korelasi (log1p) antar 12 sampel bersih, lalu untuk tiap sampel catat tetangga terdekatnya. Di data bersih, 11 dari 12 sampel tetangga-terdekatnya se-center — satu tidak. Itu normal: batch effect kuat tapi tidak absolut. Di file audit, polanya akan jauh lebih mencurigakan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung matriks korelasi Pearson dari log1p(counts) antar sampel" },
        { id: "t2", text: "Untuk tiap sampel, temukan tetangga terdekat (korelasi max, bukan dirinya sendiri); hitung `n_same_center` dan simpan sampel yang tetangganya beda center di `odd_sample`" },
      ],
      expected: "n_same_center=11, odd_sample='MGP_A_1_R01'",
      note: {
        title: "Rumus yang dipakai (dengan contoh angka konkret)",
        type: "pitfall",
        body: "Korelasi Pearson mengukur kemiripan profil ekspresi dua sampel (nilai −1 sampai 1). Replika biologis biasanya berkorelasi 0,90–0,96 di data ini — misalnya MGP_B_1_R01 vs MGP_B_1_R02 = 0,9518. Kalau dua 'replika' berkorelasi 0,9966, itu BUKAN replika biologis — itu salinan (kamu akan melihatnya di audit). Transformasi log1p dipakai agar gen bervolume besar tidak mendominasi korelasi.",
      },
      hints: [
        "log1p: `np.log1p(counts[sampel].values)`; korelasi antar kolom: `np.corrcoef(L.T)` dengan L matriks log.",
        "Nol-kan diagonal sebelum argmax agar sampel tidak 'bertetangga' dengan dirinya sendiri.",
        "Center tiap sampel dari samples.csv — samakan dengan nama kolom.",
      ],
      requires: ["pandas", "numpy"],
      code: {
        starter: [
          "import pandas as pd, numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-kontaminasi-platform\"",
          "counts = pd.read_csv(open_url(BASE + \"/counts.csv\"))",
          "samples = pd.read_csv(open_url(BASE + \"/samples.csv\"))",
          "",
          "sampel = [c for c in counts.columns if c not in (\"EntrezID\", \"Symbol\", \"IsERCC\")]",
          "L = np.log1p(counts[sampel].values)",
          "",
          "corr = ...          # matriks korelasi 12x12 antar sampel",
          "np.fill_diagonal(corr, -1)  # jangan bertetangga dengan diri sendiri",
          "",
          "center_of = ...     # dict sampel -> center",
          "n_same_center = ... # berapa sampel yang tetangga-terdekatnya se-center",
          "odd_sample = ...    # nama sampel yang tetangganya beda center (string)",
          "",
          "print(\"same-center:\", n_same_center, \"/ 12\")",
          "print(\"odd sample:\", odd_sample)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd, numpy as np",
          "from pyodide.http import open_url",
          "",
          "BASE = \"/misi/misi-kontaminasi-platform\"",
          "counts = pd.read_csv(open_url(BASE + \"/counts.csv\"))",
          "samples = pd.read_csv(open_url(BASE + \"/samples.csv\"))",
          "",
          "sampel = [c for c in counts.columns if c not in (\"EntrezID\", \"Symbol\", \"IsERCC\")]",
          "L = np.log1p(counts[sampel].values)",
          "",
          "corr = np.corrcoef(L.T)",
          "np.fill_diagonal(corr, -1)  # jangan bertetangga dengan diri sendiri",
          "",
          "center_of = dict(zip(samples[\"sample\"], samples[\"center\"]))",
          "nn = [sampel[int(np.argmax(corr[j]))] for j in range(len(sampel))]",
          "n_same_center = int(sum(1 for s, t in zip(sampel, nn) if center_of[s] == center_of[t]))",
          "odd_sample = str([s for s, t in zip(sampel, nn) if center_of[s] != center_of[t]][0])",
          "",
          "print(\"same-center:\", n_same_center, \"/ 12\")",
          "print(\"odd sample:\", odd_sample)",
        ].join("\n"),
        checks: [
          { kind: "equal", task: "t2", label: "`n_same_center` = 11", name: "n_same_center", value: 11, msg: "11 dari 12 sampel tetangga-terdekatnya se-center (batch effect kuat tapi tidak absolut)." },
          { kind: "equal", task: "t2", label: "`odd_sample` = MGP_A_1_R01", name: "odd_sample", value: "MGP_A_1_R01", msg: "MGP_A_1_R01 tetangga-terdekatnya NYU_A_1_R01 — pengecualian yang wajar di data bersih." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 5 · Lab 3 — Filter QC",
      title: "Satu query untuk menangkap dua tersangka",
      prose: [
        "Tabel `qc` adalah ringkasan 14 'sampel' dari paket yang dikirim center (versi audit — inilah yang diklaim 'sudah lolos QC internal'). Dua aturan QC keras: (1) library size tidak boleh 5× lipat dari rentang normal (43–140 ribu); (2) fraksi ERCC tidak boleh NOL — spike-in selalu ditambahkan, jadi nol berarti prep gagal total atau datanya diutak-atik.",
        "Tabel `qc(sample, center, library_size, ercc_fraction)`. Satu query, dua tersangka.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang mengembalikan sampel dengan library_size > 500000 ATAU ercc_fraction = 0" },
      ],
      expected: "2 baris: SQW_B_1_R03 (677080) dan SQW_A_1_R02 (ERCC 0)",
      sqlLab: {
        task: "Tangkap tersangka QC: library_size di atas 500.000 (bukan dari dunia ini) ATAU fraksi ERCC tepat nol (spike-in hilang).",
        schema: "CREATE TABLE qc (sample TEXT, center TEXT, library_size INTEGER, ercc_fraction REAL);",
        seedData: [
          "INSERT INTO qc VALUES",
          "('MGP_A_1_R01', 'MGP', 57901, 0.1099),",
          "('MGP_A_1_R02', 'MGP', 43187, 0.1083),",
          "('MGP_B_1_R01', 'MGP', 110668, 0.0829),",
          "('MGP_B_1_R02', 'MGP', 106842, 0.0809),",
          "('NYU_A_1_R01', 'NYU', 68203, 0.0995),",
          "('NYU_A_1_R02', 'NYU', 74383, 0.0981),",
          "('MGP_B_1_R01x', 'MGP', 139698, 0.0772),",
          "('NYU_B_1_R02', 'NYU', 134611, 0.0788),",
          "('SQW_A_1_R01', 'SQW', 60878, 0.1526),",
          "('SQW_A_1_R02', 'SQW', 49629, 0.0),",
          "('SQW_B_1_R01', 'SQW', 81838, 0.111),",
          "('SQW_B_1_R02', 'SQW', 85710, 0.1135),",
          "('SQW_B_1_R03', 'SQW', 677080, 0.0795),",
          "('MGP_B_1_R03', 'MGP', 105576, 0.0807);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT sample, center, library_size, ercc_fraction\nFROM qc\n",
        solution: [
          "SELECT sample, center, library_size, ercc_fraction",
          "FROM qc",
          "WHERE library_size > 500000 OR ercc_fraction = 0;",
        ].join("\n"),
        expectedColumns: ["sample", "center", "library_size", "ercc_fraction"],
        expectedRows: [
          ["SQW_A_1_R02", "SQW", 49629, 0.0],
          ["SQW_B_1_R03", "SQW", 677080, 0.0795],
        ],
      },
    },
  ],
};

export default misiKontaminasi;

// ── lanjutan: kuis, keputusan + 3 cabang, audit, deliverable, debrief, rangkuman
import type { V2Step } from "../lib/types";

const LANJUTAN_ROC: V2Step[] = [
  {
    id: "kuis-ercc",
    eyebrow: "Langkah 6 · Kuis konsep",
    title: "ERCC nol: apa artinya?",
    prose: [
      "ERCC adalah RNA sintetik dengan konsentrasi DIKETAHUI yang ditambahkan dalam jumlah SAMA ke setiap sampel sebelum library prep. Ia bukan gen — ia tidak 'terekspresi' atau 'tidak terekspresi' secara biologis. Ia adalah kontrol teknis: kalau ERCC-nya hilang, yang rusak adalah teknisnya.",
    ],
    tasks: [],
    quiz: [
      {
        q: "Satu sampel fraksi ERCC-nya tepat 0, sementara 11 sampel lain 0,08–0,15. Kesimpulan yang tepat?",
        options: [
          {
            text: "Library prep sampel itu gagal total (atau datanya diutak-atik) — sampel tidak bisa dipakai",
            why: "Benar. ERCC ditambahkan dalam jumlah sama ke SEMUA sampel — fraksi nol berarti spike-in tidak masuk sama sekali (prep gagal) atau count-nya dihapus. Ini bukan soal biologi, dan tidak ada normalisasi yang bisa mengembalikan molekul yang tidak pernah di-sequencing.",
            correct: true,
          },
          {
            text: "Gen-gen sampel itu memang tidak terekspresi",
            why: "Salah konsep. ERCC bukan gen endogen — ia tidak 'terekspresi'. Ia kontrol teknis yang perilakunya diketahui sebelumnya.",
          },
          {
            text: "Normalisasi (mis. TPM/CPM) akan memperbaikinya",
            why: "Salah dan berbahaya. Normalisasi hanya me-rescale angka yang ADA; ia tidak bisa menciptakan kembali read yang tidak pernah ada. Sampel ini harus dibuang atau di-sequence ulang.",
          },
        ],
      },
    ],
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 7 · Checkpoint keputusan",
    title: "Anggaran forensik hanya cukup untuk 1 sampel",
    prose: [
      "Kepala lab menelepon: investigasi forensik mendalam (re-sequence + audit chain-of-custody) hanya bisa dilakukan untuk 1 sampel minggu ini. Kamu sudah punya tiga tersangka, masing-masing menunjuk ke jenis masalah yang berbeda — dan pilihanmu mengubah apa yang terungkap di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Sampel mana yang kamu prioritaskan untuk investigasi forensik mendalam?",
      options: [
        {
          id: "opt-asing",
          label: "SQW_B_1_R03 — si 'replika ketiga' ber-library 677 ribu",
          rationale:
            "Library 5–15× lipat sampel lain. Kalau ini bukan data ROC, maka chain-of-custody seluruh batch dipertanyakan.",
          nextStepId: "temuan-asing",
          consequenceNote:
            "Terkonfirmasi: kolom itu adalah data platform ILM (Illumina) yang dilabeli ROC. Lebih buruk: kalau satu kolom bisa tertukar platform tanpa terdeteksi QC internal, seluruh klaim 'sudah lolos QC' center tersebut gugur — masalahnya sistemik, bukan satu sampel.",
        },
        {
          id: "opt-ercc",
          label: "SQW_A_1_R02 — ERCC nol total",
          rationale:
            "Spike-in yang hilang = prep gagal = sampel tidak bisa dipakai untuk DE. Ini yang paling pasti 'rusak' secara teknis.",
          nextStepId: "temuan-ercc",
          consequenceNote:
            "Terkonfirmasi: prep gagal total, sampel wajib re-sequence. Tapi ini 'hanya' satu sampel gagal — bukan masalah sistemik. Sementara itu kolom asing dan replika palsu tetap bersembunyi di batch yang akan dipakai untuk DE.",
        },
        {
          id: "opt-replika",
          label: "MGP_B_1_R03 — 'replika' berkorelasi 0,9966",
          rationale:
            "Replika biologis tidak pernah seidentik itu (normalnya 0,90–0,96). Korelasi 0,9966 = salinan + sedikit noise. Ini bau fabrikasi data.",
          nextStepId: "temuan-replika",
          consequenceNote:
            "Terkonfirmasi: MGP_B_1_R03 adalah salinan MGP_B_1_R02 + noise 1% — replika palsu. Ini masalah INTEGRITAS, bukan sekadar kualitas: ada yang sengaja menambah 'replika'. Eskalasi ke komite etik, dan semua data dari sumber yang sama harus diaudit ulang.",
        },
      ],
    },
  },
  {
    id: "temuan-asing",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan forensik",
    title: "Hasil investigasi: SQW_B_1_R03",
    prose: [
      "Forensik membandingkan kolom itu dengan arsip ILM center: cocok persis dengan sampel A_1_L01_FlowCellA platform Illumina. Seseorang (atau suatu skrip) menggabungkan file dari dua platform dan memberi label ROC pada kolom ILM.",
      "Ini temuan terburuk secara SISTEMIK: bukan satu sampel yang rusak, melainkan rantai penjagaan data (chain of custody) yang jebol. Kalau kolom bisa tertukar platform tanpa tertangkap QC internal, maka klaim 'sudah lolos QC' untuk seluruh batch tidak ada nilainya. Rekomendasi: bekukan seluruh batch, audit ulang semua penggabungan file.",
      "Harga pilihanmu: sampel ERCC-nol dan replika palsu tidak terinvestigasi — keduanya tetap akan dipakai dalam analisis DE bila batch diloloskan.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: cari masalah sistemik, bukan cuma sampel",
      body: "Satu sampel rusak = masalah sampel. Satu kolom tertukar platform = masalah PROSES. Auditor yang matang selalu bertanya: 'apakah ini kasus, atau ini gejala?' — karena gejala menuntut perombakan proses, bukan sekadar membuang satu sampel.",
    },
  },
  {
    id: "temuan-ercc",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan forensik",
    title: "Hasil investigasi: SQW_A_1_R02",
    prose: [
      "Re-sequence mengonfirmasi: library prep sampel ini gagal total — ERCC yang ditambahkan tidak terdeteksi sama sekali, dan total read-nya pun di bawah ambang. Sampel wajib dibuang dan di-sequence ulang dari RNA cadangan.",
      "Ini temuan yang paling PASTI benar secara teknis — tapi juga paling kecil dampaknya: satu sampel gagal adalah kejadian rutin di lab. Masalahnya selesai dengan re-sequence, tanpa implikasi ke sampel lain.",
      "Harga pilihanmu: kolom asing (kontaminasi platform) dan replika palsu (potensi fabrikasi) tidak tersentuh. Batch yang 'sudah dibersihkan satu sampelnya' tetap mengandung dua sabotase yang jauh lebih berbahaya.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: kepastian ≠ prioritas",
      body: "Kamu memilih tersangka yang paling pasti bersalah — insting yang bisa dimengerti. Tapi audit forensik memprioritaskan DAMPAK, bukan kepastian. Satu prep gagal vs satu rantai custody jebol vs satu indikasi fabrikasi: urutannya seharusnya dibalik.",
    },
  },
  {
    id: "temuan-replika",
    goto: "audit",
    eyebrow: "Langkah 8 · Temuan forensik",
    title: "Hasil investigasi: MGP_B_1_R03",
    prose: [
      "Analisis forensik membuktikan: MGP_B_1_R03 = MGP_B_1_R02 × (1 + noise 1%). Korelasi 0,9966 bukan keajaiban replika biologis — itu salinan dengan sedikit pengacakan agar terlihat alami. Seseorang menambahkan 'replika ketiga' yang tidak pernah di-sequence.",
      "Ini temuan terberat secara INTEGRITAS: bukan kecelakaan teknis, melainkan data yang sengaja difabrikasi. Konsekuensinya melampaui satu sampel — kredibilitas seluruh batch dari sumber ini runtuh, dan kasusnya dieskalasi ke komite etik institusi. Dalam publikasi ilmiah, ini adalah kategori pelanggaran yang mengakhiri karier.",
      "Harga pilihanmu: kontaminasi platform dan ERCC gagal tidak terinvestigasi — batch tetap mengandung keduanya bila diloloskan tanpa audit penuh.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: kenali bau fabrikasi",
      body: "Data yang 'terlalu sempurna' (korelasi 0,9966 antar replika biologis) adalah red flag klasik fabrikasi — sama seperti angka yang 'terlalu rapi' di misi DBD. Insting ini, dilatih dengan benar, adalah yang membedakan auditor senior dari skrip QC otomatis.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 9 · Misi audit",
    title: "Dossier 14 sampel: temukan 4 sabotase",
    prose: [
      "Misi auditnya. Di bawah ini ringkasan QC 14 'sampel' dari paket yang dikirim — dossier yang diklaim 'sudah lolos QC internal core facility'. Empat sabotase disuntikkan tanpa pengumuman. Tandai sampel yang janggal, lalu buka debrief.",
      "Senjatamu: baseline QC dari Lab 1 (rentang library 43–140 ribu, ERCC 0,08–0,15), logika tetangga-terdekat dari Lab 2, dan aturan 'replika biologis tidak pernah berkorelasi 0,99+'.",
    ],
    tasks: [],
    auditDossier: {
      version: "roc-m1b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi ringkasan QC 14 sampel ROC yang sudah lolos QC internal core facility.",
      columns: ["Sampel", "Center (klaim)", "Library size", "Fraksi ERCC", "Tetangga terdekat"],
      rows: [
        { rowId: 1, cells: { "Sampel": "MGP_A_1_R01", "Center (klaim)": "MGP", "Library size": "57.901", "Fraksi ERCC": "0,1099", "Tetangga terdekat": "NYU_A_1_R01 (0,92)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 2, cells: { "Sampel": "MGP_A_1_R02", "Center (klaim)": "MGP", "Library size": "43.187", "Fraksi ERCC": "0,1083", "Tetangga terdekat": "MGP_A_1_R01 (0,92)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 3, cells: { "Sampel": "MGP_B_1_R01", "Center (klaim)": "MGP", "Library size": "110.668", "Fraksi ERCC": "0,0829", "Tetangga terdekat": "MGP_B_1_R02 (0,95)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 4, cells: { "Sampel": "MGP_B_1_R02", "Center (klaim)": "MGP", "Library size": "106.842", "Fraksi ERCC": "0,0809", "Tetangga terdekat": "MGP_B_1_R03 (1,00)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 5, cells: { "Sampel": "NYU_A_1_R01", "Center (klaim)": "NYU", "Library size": "68.203", "Fraksi ERCC": "0,0995", "Tetangga terdekat": "NYU_A_1_R02 (0,93)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 6, cells: { "Sampel": "NYU_A_1_R02", "Center (klaim)": "NYU", "Library size": "74.383", "Fraksi ERCC": "0,0981", "Tetangga terdekat": "NYU_A_1_R01 (0,93)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        // ── I1: label center salah ──
        { rowId: 7, cells: { "Sampel": "MGP_B_1_R01x", "Center (klaim)": "MGP", "Library size": "139.698", "Fraksi ERCC": "0,0772", "Tetangga terdekat": "NYU_B_1_R02 (0,96)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 8, cells: { "Sampel": "NYU_B_1_R02", "Center (klaim)": "NYU", "Library size": "134.611", "Fraksi ERCC": "0,0788", "Tetangga terdekat": "MGP_B_1_R01x (0,96)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 9, cells: { "Sampel": "SQW_A_1_R01", "Center (klaim)": "SQW", "Library size": "60.878", "Fraksi ERCC": "0,1526", "Tetangga terdekat": "SQW_A_1_R02 (0,90)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        // ── I2: ERCC nol ──
        { rowId: 10, cells: { "Sampel": "SQW_A_1_R02", "Center (klaim)": "SQW", "Library size": "49.629", "Fraksi ERCC": "0,0000", "Tetangga terdekat": "SQW_A_1_R01 (0,90)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 11, cells: { "Sampel": "SQW_B_1_R01", "Center (klaim)": "SQW", "Library size": "81.838", "Fraksi ERCC": "0,1110", "Tetangga terdekat": "SQW_B_1_R02 (0,95)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        { rowId: 12, cells: { "Sampel": "SQW_B_1_R02", "Center (klaim)": "SQW", "Library size": "85.710", "Fraksi ERCC": "0,1135", "Tetangga terdekat": "SQW_B_1_R01 (0,95)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        // ── I3: kontaminasi platform ──
        { rowId: 13, cells: { "Sampel": "SQW_B_1_R03", "Center (klaim)": "SQW", "Library size": "677.080", "Fraksi ERCC": "0,0795", "Tetangga terdekat": "NYU_A_1_R01 (0,65)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
        // ── I4: replika palsu ──
        { rowId: 14, cells: { "Sampel": "MGP_B_1_R03", "Center (klaim)": "MGP", "Library size": "105.576", "Fraksi ERCC": "0,0807", "Tetangga terdekat": "MGP_B_1_R02 (1,00)" }, claims: [{ label: "Status QC", value: "Lolos QC internal" }] },
      ],
      injections: [
        { key: "wrong-center", rowIds: [7], title: "Label center salah", clue: "Diklaim MGP, tapi tetangga terdekatnya (korelasi 0,96) adalah sampel NYU — dan library size-nya identik dengan NYU_B_1_R01. Ini sampel NYU_B_1_R01 yang labelnya tertukar.", danger: "Batch effect center ikut tercampur ke dalam perbandingan A-vs-B; DE yang dihasilkan mengukur perbedaan center, bukan biologi." },
        { key: "ercc-failure", rowIds: [10], title: "Kegagalan spike-in ERCC", clue: "Fraksi ERCC tepat 0,0000 — spike-in yang ditambahkan ke semua sampel tidak ada sama sekali. Prep gagal total.", danger: "Sampel tanpa kontrol teknis tidak bisa dinormalisasi dengan benar; memakainya dalam DE meracuni seluruh perbandingan." },
        { key: "platform-contam", rowIds: [13], title: "Kontaminasi lintas platform", clue: "Library 677 ribu (5–15× lipat) + tetangga terdekat hanya berkorelasi 0,65 (asing dari semua sampel ROC). Ini kolom data ILM (Illumina) yang dilabeli ROC.", danger: "Mencampur platform dalam satu matriks = batch effect ekstrem; chain-of-custody jebol berarti tidak ada sampel yang bisa dipercaya." },
        { key: "jittered-dup", rowIds: [14], title: "Replika palsu (salinan + noise)", clue: "Korelasi 1,00 dengan MGP_B_1_R02 — replika biologis tidak pernah seidentik ini (normal 0,90–0,96). Ini salinan + noise 1%.", danger: "Replika palsu menggelembungkan n dan mengecilkan p-value secara artifisial — DE 'signifikan' yang dibangun di atasnya adalah fiksi." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Laporan QC + rekomendasi untuk kepala lab",
    prose: [
      "Semua bukti di tangan. Tulis laporan QC satu halaman untuk kepala lab — dokumen yang menentukan apakah batch ini dipakai untuk studi DE atau dibekukan. Tulis seolah dibaca orang yang mempertaruhkan reputasi labnya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): apakah batch ini layak dipakai?",
        "Temuan QC: anomali apa yang kamu temukan, dengan bukti angka per sampel.",
        "Keputusan per sampel: pakai / buang / sequence ulang — dan KENAPA.",
        "Masalah sistemik: adakah temuan yang menuntut perombakan proses (bukan cuma membuang sampel)?",
        "Batas analisis (kejujuran): apa yang TIDAK bisa kamu simpulkan dari QC ini.",
      ],
      rubric: [
        { criterion: "Deteksi anomali", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa bukti", "Semua jenis sabotase disebut dengan bukti angka"] },
        { criterion: "Kebenaran analisis", weight: 25, levels: ["Metrik QC salah/tidak dihitung", "Metrik ada tapi tak dipakai menilai", "Library size + ERCC + korelasi dipakai menilai kewajaran"] },
        { criterion: "Kualitas keputusan", weight: 20, levels: ["Prioritas tanpa alasan", "Alasan ada tapi trade-off tak diakui", "Alasan + trade-off + eskalasi yang proporsional"] },
        { criterion: "Kejujuran batas data", weight: 30, levels: ["Mengklaim lebih dari yang didukung data", "Menyebut sebagian batas", "Batas (QC ≠ kebenaran biologis; korelasi ≠ bukti) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan — semuanya pola nyata di core facility:",
      "1) **Label center salah** (baris 7): sampel NYU_B_1_R01 diklaim sebagai MGP. Di dunia nyata: salah ketik saat menggabungkan file, atau skrip yang salah memetakan kolom. Obatnya murah — validasi silang metadata vs pola data — tapi tidak ada yang melakukannya karena 'metadata pasti benar'.",
      "2) **Kegagalan ERCC** (baris 10): spike-in nol total. Inilah gunanya kontrol teknis: ia gagal dengan cara yang JELAS, tidak ambigu. Lab yang tidak memakai spike-in tidak akan pernah tahu prep-nya gagal — mereka hanya akan melihat 'data yang berisik'.",
      "3) **Kontaminasi platform** (baris 13): kolom ILM dilabeli ROC. Terdeteksi dalam 5 detik via library size — kalau ada yang melihat tabel QC. Pelajaran paling mahal di sini: QC yang tidak dibaca sama dengan tidak ada QC.",
      "4) **Replika palsu** (baris 14): salinan + noise 1%, korelasi 1,00. Di publikasi nyata, pola ini pernah menjatuhkan paper — reviewer yang jeli melihat angka yang 'terlalu sempurna'. Replika biologis berkorelasi 0,90–0,96; 1,00 adalah tanda tangan penyalin, bukan biologi.",
      "Skor deteksimu (x/4) mengukur insting forensik paling berharga di bioinformatika: curiga pada metadata, hormat pada kontrol teknis, dan ingat bahwa data yang 'terlalu sempurna' lebih berbahaya daripada data yang berisik. Dan ingat keputusan bercabangmu: kamu hanya bisa menginvestigasi satu sampel. Tuliskan di laporanmu DUA yang tidak terinvestigasi — karena 'tidak ada temuan' harus selalu dibaca sebagai 'belum diperiksa'.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: QC lolos = data benar",
      type: "risk",
      body: "QC otomatis memeriksa yang bisa dihitung: format, rentang, kelengkapan. Ia tidak memeriksa MAKNA: apakah labelnya benar, apakah kolomnya dari platform yang diklaim, apakah 'replika' itu sungguhan. Dossier ini 'lolos QC internal' — dan tetap mengandung 4 sabotase. QC adalah lantai, bukan langit-langit.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Dua metrik QC tak bisa berbohong: library size (sidik jari teknis) dan fraksi ERCC (kebenaran kontrol) — hitung keduanya SEBELUM analisis apa pun.",
      "Verifikasi metadata terhadap data: tetangga terdekat (korelasi) harus se-center; label yang menyimpang adalah tersangka.",
      "Empat pola sabotase: label center salah, kegagalan spike-in, kontaminasi lintas platform, replika palsu (korelasi ≈ 1,00).",
      "Keputusan forensik memprioritaskan DAMPAK: masalah sistemik (chain of custody) > integritas (fabrikasi) > sampel tunggal (prep gagal).",
      "Batas kejujuran: QC membuktikan data 'tidak rusak secara teknis' — ia tidak membuktikan kebenaran biologis.",
      "Data: Bioconductor seqc 1.46.0 (GPL-3), platform ROC, 3 center × A/B × 2 replika, 3.092 gen (3.000 varian + 92 ERCC).",
    ],
  },
];

(misiKontaminasi.steps as V2Step[]).push(...LANJUTAN_ROC);
