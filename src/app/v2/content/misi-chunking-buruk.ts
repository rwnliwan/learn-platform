import type { V2Mission } from "../lib/types";

// ── MISI CHUNKING: Dokumen yang Terpotong di Tempat Salah ───────────────
// M2 — AI Engineering Misi B (solo). Dataset SINTETIS (seed 42, generator
// terdokumentasi di METODE.md): 120 chunk dari 30 dokumen × 3 strategi.
// "Semantic v2" SENGAJA dibangkitkan identik dengan fixed-512 — itu bahan
// audit, bukan bug. File: public/misi/misi-chunking-buruk/chunks.csv
// (5218 byte).

const BASE = "/misi/misi-chunking-buruk";

export const misiChunk: V2Mission = {
  slug: "misi-chunking-buruk",
  track: "AI Engineering",
  module: "Misi",
  title: "Misi Chunking: Dokumen yang Terpotong di Tempat Salah",
  estMinutes: 135,
  role: "AI engineer — penentu strategi chunking knowledge base",
  client:
    "Head of Engineering — keputusan chunking mengunci arsitektur dan biaya indexing 3 tahun ke depan; pilih berdasarkan bukti, bukan brosur vendor",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Brosurnya bilang “semantic”. Angkanya bilang “fixed”.",
      prose: [],
      tasks: [],
      briefing: {
        role: "AI engineer yang dipercaya memilih strategi chunking untuk knowledge base 200 ribu dokumen perusahaan",
        client:
          "Head of Engineering. Tiga kandidat strategi chunking di atas meja: “Semantic v2” dari vendor (harga lisensi 3x lipat, klaim “batas semantik via embedding”), “Fixed-512 + overlap-50” (baseline klasik, murah), dan “Struktur-aware” (potong per heading, buatan tim internal). Vendor menyertakan laporan benchmark: Semantic v2 menang. Head of Engineering tidak membeli brosur — ia memintamu mengaudit data benchmark mentahnya sebelum perusahaan mengunci kontrak 3 tahun.",
        story: [
          "Ruang rapat, Kamis 09:00. Slide vendor menampilkan kurva “semantic chunking” yang selalu di atas — recall 0,73, “batas cerdas”, logo yang mahal. “Fixed window itu teknologi 2022,” kata sales-nya sambil tersenyum. “Kami memotong di batas makna, bukan di batas angka.” Head of Engineering melirikmu. Ia pernah membayar 3x lipat untuk label “AI” yang isinya parameter lama — dan ia tidak mau mengulanginya.",
          "Malamnya kamu membuka file benchmark mentah: 120 chunk, 3 strategi, kolom kerusakan boundary per chunk. Baris demi baris, pola yang aneh muncul: “Semantic v2” memotong tabel di tengah dengan frekuensi yang sama persis seperti fixed-512. Distribusi panjang chunk-nya menumpuk di 512 token — bukan pola “batas semantik” yang bervariasi. Dan satu strategi keempat, “Struktur v1”, disebut di catatan kaki metodologi… tapi hasilnya tidak ada di laporan.",
          "Misi ini: ukur kualitas boundary tiap strategi dari data mentah, ukur dampaknya ke retrieval, bedah laporan benchmark vendor yang menyembunyikan 4 sabotase, lalu tulis rekomendasi chunking yang berani bilang “jangan bayar 3x untuk label” kalau buktinya berkata begitu.",
        ],
        objectives: [
          "Mengukur kualitas boundary chunk per strategi (tabel rusak, heading yatim, kalimat terpotong) dan dampaknya ke recall retrieval dari data mentah.",
          "Mengagregasi skor per strategi dengan SQL dan memilih strategi chunking berbasis bukti, dengan harga trade-off yang eksplisit.",
          "Menemukan minimal 3 sabotase di laporan benchmark vendor dan menulis rekomendasi chunking yang bisa dipertahankan di depan Head of Engineering.",
        ],
        prereqSummary:
          "Chunking = memotong dokumen menjadi potongan (chunk) agar muat diproses retrieval; strategi yang buruk memotong di tengah tabel atau kalimat sehingga maknanya rusak sebelum model sempat membacanya. Kualitas diukur dari dua sisi: kebersihan boundary (berapa chunk yang rusak) dan recall retrieval (berapa chunk relevan yang berhasil ditemukan). Evaluasi yang jujur memakai dokumen uji yang belum pernah dipakai saat tuning, menghitung chunk duplikat overlap tepat sekali, dan melaporkan SEMUA strategi yang dicoba — termasuk yang gagal. Di misi ini kamu menghitung semuanya dari data mentah.",
        datasetNote:
          "Sumber: SINTETIS — dibangkitkan dengan skrip generator seed 42 (lihat METODE.md di folder yang sama).\n120 chunk dari 30 dokumen × 3 strategi: “Semantic v2”, “Fixed-512 + overlap-50”, “Struktur-aware” (chunks.csv).\nKolom: chunk_id, doc_id, strategi, n_token, rusak_tabel, heading_yatim, kalimat_terpotong, ter_retrieve, relevan. Total ±5 KB.\nKejujuran: ini BUKAN benchmark produksi — tidak ada embedding/chunker nyata. “Semantic v2” SENGAJA berperilaku seperti fixed-512; itu bahan auditmu, bukan kesalahan data.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Satu file, 120 keputusan memotong",
      prose: [
        "`chunks.csv` adalah 120 keputusan memotong yang dibekukan: 40 chunk per strategi, dari 30 dokumen. Kolom `rusak_tabel` = 1 bila chunk memotong tabel di tengah (baris kehilangan kolomnya); `heading_yatim` = 1 bila chunk diawali heading tanpa isi; `kalimat_terpotong` = 1 bila kalimat terbelah di batas chunk. Ketiganya adalah “luka” boundary — informasi yang rusak SEBELUM retrieval sempat bekerja.",
        "Kolom `ter_retrieve` dan `relevan` mencatat hasil evaluasi retrieval: apakah chunk ini ditemukan, dan apakah ia memang relevan. Recall per strategi = (chunk relevan yang ter-retrieve) / (seluruh chunk relevan strategi itu). Strategi boleh punya recall tinggi sambil menghasilkan chunk rusak — dan justru di situlah jebakannya.",
        "Aturan main: (1) kualitas boundary dihitung dari kolom kerusakan, bukan dari klaim brosur; (2) recall dihitung per strategi dari kolom ter_retrieve × relevan; (3) chunk overlap yang duplikat dihitung SATU kali — siapa pun yang menghitungnya ganda sedang berbuat curang.",
      ],
      tasks: [
        { id: "t1", text: "Buka `chunks.csv`: catat 3 strategi dan jumlah chunk per strategi" },
        { id: "t2", text: "Bandingkan `n_token` beberapa chunk “Semantic v2” vs “Fixed-512” — apa yang kamu lihat?" },
      ],
      note: {
        title: "Miskonsepsi #1: chunk = potongan teks apa pun",
        type: "pitfall",
        body: "“Yang penting ukurannya seragam 512 token, isinya urusan nanti.” SALAH — dan ini kesalahan termahal dalam desain RAG. Boundary adalah MAKNA: chunk yang memotong tabel di tengah membuat baris kehilangan kolomnya; chunk yang membelah kalimat membuat dua potong yang masing-masing tidak lengkap. Retrieval boleh menemukan chunk-nya, tapi model menerima informasi yang sudah rusak. Kualitas chunking diukur dari kebersihan potongannya, bukan keseragaman ukurannya.",
      },
      reference:
        "chunks.csv (120 chunk, 3 strategi). Boundary dari kolom kerusakan; recall dari ter_retrieve × relevan — per strategi, dari data mentah.",
    },
    {
      id: "lab-chunk",
      eyebrow: "Langkah 3 · Lab 1 — Ukur boundary & dampak retrieval",
      title: "Potongan yang bersih vs angka yang tinggi",
      prose: [
        "Hitung tiga hal per strategi. Pertama, panjang chunk rata-rata (`n_token`): strategi “semantik” yang jujur seharusnya bervariasi mengikuti struktur dokumen — kalau rata-ratanya menempel di 512 seperti fixed window, labelnya patut dicurigai. Kedua, tingkat kerusakan tabel = (chunk dengan `rusak_tabel` = 1) / (total chunk strategi). Contoh konkret: Semantic v2 merusak 14 dari 40 chunk → 14/40 = 0,35 alias 35%.",
        "Ketiga, recall retrieval per strategi = (chunk relevan yang ter-retrieve) / (seluruh chunk relevan). Lalu jawab pertanyaan kuncinya: strategi mana yang boundary-nya paling bersih — dan apakah strategi dengan recall tertinggi juga yang paling bersih?",
      ],
      tasks: [
        { id: "t1", text: "Muat chunks.csv; hitung `n_total`" },
        { id: "t2", text: "Agregat per strategi: `mean_token`, `pct_rusak_tabel`, `pct_kalimat_terpotong`" },
        { id: "t3", text: "Hitung `recall` per strategi dan `strategi_terbaik_boundary` (kerusakan tabel terendah)" },
      ],
      expected:
        "n_total=120; Semantic v2: mean token 512,1, 35% tabel rusak, recall 0,73 | Fixed-512: mean token 512,9, 25% rusak, recall 0,83 | Struktur-aware: mean token 274,7, 2,5% rusak, recall 0,65 — boundary terbersih: Struktur-aware",
      formula: String.raw`R_{tabel} = \frac{n_{rusak\_tabel}}{n_{total}}`,
      formulaNote:
        "R_tabel = tingkat kerusakan tabel satu strategi; n_rusak_tabel = jumlah chunk strategi itu dengan rusak_tabel = 1; n_total = jumlah chunk strategi itu (40). R_tabel = 0,35 (Semantic v2: 14/40) artinya lebih dari sepertiga chunk memotong tabel di tengah — setiap chunk itu adalah jawaban tabel yang akan cacat. Bandingkan dengan Struktur-aware: 1/40 = 0,025.",
      note: {
        title: "Miskonsepsi #2: recall tertinggi = strategi terbaik",
        type: "pitfall",
        body: "Insting berkata “pilih yang recall-nya 0,83”. Data berkata: Fixed-512 memang recall tertinggi — tapi 25% chunk-nya merusak tabel, dan (seperti akan kamu temukan di audit) recall itu dihitung dengan chunk overlap yang diduplikat. Angka “terbaik” yang lahir dari cara hitung yang curang + boundary yang rusak = strategi yang terlihat menang di laporan dan gagal di produksi. Pilih berdasarkan boundary DAN recall yang dihitung jujur.",
      },
      hints: [
        "Muat CSV: `pd.read_csv(open_url(URL))` — URL sudah menunjuk ke `/misi/misi-chunking-buruk/chunks.csv`.",
        "Agregat: `g = df.groupby(\"strategi\")`, lalu `g[\"n_token\"].mean()` dan `g[\"rusak_tabel\"].mean()` — kolom 0/1 yang di-mean langsung jadi proporsi.",
        "Recall per strategi: saring dulu `df[df[\"relevan\"] == 1]`, lalu groupby strategi dan mean dari `ter_retrieve`.",
        "Strategi boundary terbaik: `pct_rusak_tabel.idxmin()` — nama strategi dengan kerusakan terendah.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-chunking-buruk/chunks.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_total = ...",
          "",
          "g = df.groupby(\"strategi\")",
          "mean_token = ...",
          "pct_rusak_tabel = ...",
          "pct_kalimat_terpotong = ...",
          "",
          "rel = df[df[\"relevan\"] == 1]",
          "recall = ...",
          "",
          "mean_token_semantik = ...",
          "mean_token_struktur = ...",
          "pct_rusak_semantik = ...",
          "pct_rusak_struktur = ...",
          "recall_struktur = ...",
          "strategi_terbaik_boundary = ...   # nama strategi, string",
          "",
          "print(\"total chunk:\", n_total)",
          "print(mean_token.round(1))",
          "print(\"pct rusak tabel:\")",
          "print(pct_rusak_tabel.round(4))",
          "print(\"recall:\")",
          "print(recall.round(4))",
          "print(\"boundary terbaik:\", strategi_terbaik_boundary)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-chunking-buruk/chunks.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_total = len(df)",
          "",
          "g = df.groupby(\"strategi\")",
          "mean_token = g[\"n_token\"].mean()",
          "pct_rusak_tabel = g[\"rusak_tabel\"].mean()",
          "pct_kalimat_terpotong = g[\"kalimat_terpotong\"].mean()",
          "",
          "rel = df[df[\"relevan\"] == 1]",
          "recall = rel.groupby(\"strategi\")[\"ter_retrieve\"].mean()",
          "",
          "mean_token_semantik = float(mean_token[\"Semantic v2\"])",
          "mean_token_struktur = float(mean_token[\"Struktur-aware\"])",
          "pct_rusak_semantik = float(pct_rusak_tabel[\"Semantic v2\"])",
          "pct_rusak_struktur = float(pct_rusak_tabel[\"Struktur-aware\"])",
          "recall_struktur = float(recall[\"Struktur-aware\"])",
          "strategi_terbaik_boundary = str(pct_rusak_tabel.idxmin())",
          "",
          "print(\"total chunk:\", n_total)",
          "print(mean_token.round(1))",
          "print(\"pct rusak tabel:\")",
          "print(pct_rusak_tabel.round(4))",
          "print(\"recall:\")",
          "print(recall.round(4))",
          "print(\"boundary terbaik:\", strategi_terbaik_boundary)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "data termuat", name: "df", msg: "df harus berisi DataFrame dari chunks.csv." },
          { kind: "equal", task: "t1", label: "`n_total` = 120", name: "n_total", value: 120, msg: "40 chunk × 3 strategi." },
          { kind: "equal", task: "t2", label: "mean token Semantic v2 ≈ 512", name: "mean_token_semantik", value: 512.1, tol: 1.0, msg: "Rata-rata n_token untuk strategi “Semantic v2”. Bandingkan dengan Fixed-512." },
          { kind: "equal", task: "t2", label: "mean token Struktur-aware ≈ 275", name: "mean_token_struktur", value: 274.7, tol: 1.0, msg: "Chunk struktur-aware mengikuti panjang section — bervariasi, tidak menempel di 512." },
          { kind: "equal", task: "t2", label: "35% tabel rusak (Semantic v2)", name: "pct_rusak_semantik", value: 0.35, tol: 0.01, msg: "Proporsi chunk Semantic v2 dengan rusak_tabel = 1." },
          { kind: "equal", task: "t2", label: "2,5% tabel rusak (Struktur-aware)", name: "pct_rusak_struktur", value: 0.025, tol: 0.01, msg: "Potong per heading hampir tidak pernah membelah tabel." },
          { kind: "equal", task: "t3", label: "recall Struktur-aware ≈ 0,65", name: "recall_struktur", value: 0.6471, tol: 0.01, msg: "Dari chunk relevan saja: mean ter_retrieve per strategi." },
          { kind: "equal", task: "t3", label: "boundary terbaik = Struktur-aware", name: "strategi_terbaik_boundary", value: "Struktur-aware", msg: "Strategi dengan pct_rusak_tabel terendah." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Agregasi per strategi",
      title: "Siapa yang merusak tabel paling banyak?",
      prose: [
        "Head of Engineering butuh satu tabel keputusan, bukan 120 baris. Dari tabel ringkas `strategi_eval(strategi, n_chunk, mean_token, pct_rusak_tabel, pct_kalimat_terpotong, recall)`, tampilkan strategi dengan kerusakan tabel di atas 10% — merekalah yang perlu penjelasan sebelum dipilih. Urutkan dari kerusakan tertinggi: yang paling merusak dibahas pertama.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: strategi dengan pct_rusak_tabel > 0,10, urut dari kerusakan tertinggi" },
      ],
      expected: "2 baris — Semantic v2 (0,35) lalu Fixed-512 + overlap-50 (0,25)",
      sqlLab: {
        task: "Tampilkan strategi yang MERUSAK TABEL di atas 10%: strategi, pct_rusak_tabel, recall — urut dari kerusakan tertinggi.",
        schema: "CREATE TABLE strategi_eval (strategi TEXT, n_chunk INT, mean_token REAL, pct_rusak_tabel REAL, pct_kalimat_terpotong REAL, recall REAL);",
        seedData: [
          "INSERT INTO strategi_eval VALUES",
          "('Semantic v2',40,512.1,0.35,0.35,0.7273),",
          "('Fixed-512 + overlap-50',40,512.9,0.25,0.325,0.8333),",
          "('Struktur-aware',40,274.7,0.025,0.075,0.6471);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT strategi, pct_rusak_tabel, recall\nFROM strategi_eval\n",
        solution: [
          "SELECT strategi, pct_rusak_tabel, recall",
          "FROM strategi_eval",
          "WHERE pct_rusak_tabel > 0.10",
          "ORDER BY pct_rusak_tabel DESC;",
        ].join("\n"),
        expectedColumns: ["strategi", "pct_rusak_tabel", "recall"],
        expectedRows: [
          ["Semantic v2", 0.35, 0.7273],
          ["Fixed-512 + overlap-50", 0.25, 0.8333],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiChunk;

// ── lanjutan misiChunk: langkah 5–12 ────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_CHUNK: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Strategi mana yang mengunci 3 tahun ke depan?",
    prose: [
      "Angkanya sudah di tangan: “Semantic v2” — mean token 512,1, 35% tabel rusak, recall 0,73; Fixed-512 + overlap-50 — mean token 512,9, 25% rusak, recall 0,83; Struktur-aware — mean token 274,7, 2,5% rusak, recall 0,65. Head of Engineering menunggumu dengan satu pertanyaan: “Jadi kita bayar yang mana?” Tiap pilihan mengunci arsitektur 3 tahun — dan tiap pilihan mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Strategi chunking mana yang kamu rekomendasikan untuk knowledge base 200 ribu dokumen? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-semantic",
          label: "“Semantic v2” — ikuti rekomendasi vendor",
          rationale:
            "Vendor sudah membuktikan recall 0,73 dengan “batas semantik”; tim tidak perlu membangun apa pun; risiko implementasi nol.",
          nextStepId: "kons-semantic",
          consequenceNote:
            "Tiga bulan setelah kontrak 3x lipat ditandatangani, tim internal membuktikan “Semantic v2” = fixed-512 dengan nama baru. Perusahaan membayar mahal untuk label — dan 35% tabel tetap rusak.",
        },
        {
          id: "opt-fixed",
          label: "Fixed-512 + overlap-50 — baseline murah, recall tertinggi",
          rationale:
            "Recall 0,83 tertinggi, tanpa lisensi, tanpa ketergantungan vendor. Overlap 50 token menutup risiko kalimat terpotong.",
          nextStepId: "kons-fixed",
          consequenceNote:
            "Recall tinggi bertahan — tapi jawaban atas pertanyaan tabel keuangan mulai cacat: 25% chunk memotong tabel di tengah. Overlap menutup kalimat terpotong, bukan tabel terbelah. Murah di lisensi, mahal di kualitas jawaban.",
        },
        {
          id: "opt-struktur",
          label: "Struktur-aware — potong per heading, buatan internal",
          rationale:
            "Boundary terbersih (2,5% tabel rusak), tanpa lisensi, sepenuhnya dikontrol tim. Recall 0,65 memang lebih rendah — trade-off yang jujur.",
          nextStepId: "kons-struktur",
          consequenceNote:
            "Jawaban tabel menjadi akurat; tim finance berhenti mengeluh. Recall 0,65 memaksa tim memperbaiki ranking — pekerjaan rumah yang nyata, bukan ilusi “sudah menang”. Tidak ada lisensi 3x lipat yang dibayar.",
        },
      ],
    },
  },
  {
    id: "kons-semantic",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: ikuti vendor",
    prose: [
      "Kontrak 3x lipat ditandatangani. Tiga bulan pertama tenang — dashboard vendor hijau, tidak ada yang komplain. Lalu insinyur barumu, yang tidak tahu soal “keputusan bersejarah” ini, menjalankan analisis distribusi token untuk optimasi biaya — dan menemukan mean token “Semantic v2” = 512,1. Identik dengan fixed-512. Tidak ada jejak “batas semantik” di mana pun.",
      "Perusahaan membayar tiga kali lipat selama tiga tahun untuk label. Dan yang lebih pahit: 35% tabel tetap rusak — masalah kualitas yang sesungguhnya tidak pernah dibahas karena semua orang sibuk mengagumi kata “semantic”. Pelajaran yang mahal: label teknologi bukan bukti; distribusi token tidak bisa berbohong.",
    ],
    tasks: [],
    note: {
      title: "Bayar untuk metrik, bukan untuk label",
      body: "Sebelum menandatangani apa pun yang berlabel “AI/semantic/cerdas”, minta satu hal: distribusi output mentahnya. Label bisa ditempel siapa pun; mean token 512,1 vs 512,9 tidak bisa dipalsukan. Di deliverable-mu, setiap klaim vendor wajib ditemani angka verifikasimu sendiri.",
    },
  },
  {
    id: "kons-fixed",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: baseline murah",
    prose: [
      "Tidak ada lisensi, recall 0,83 bertahan di produksi. Tim finance awalnya senang — sampai mereka bertanya soal tabel arus kas Q2 dan bot menjawab dengan baris yang kehilangan kolomnya. 25% chunk merusak tabel bukan angka abstrak: itu satu dari empat jawaban tabel yang cacat. Overlap 50 token yang kamu andalkan menutup kalimat terpotong — tapi tidak ada overlap yang bisa menyambung tabel yang terbelah di tengah.",
      "Kamu menghemat lisensi 3x lipat dan membayarnya dengan kepercayaan tim finance. Murah di kontrak, mahal di kualitas jawaban. Pelajaran yang nyata: recall mengukur DITEMUKANNYA chunk, bukan UTUHNYA chunk — dan untuk dokumen tabel, keutuhan adalah segalanya.",
    ],
    tasks: [],
    note: {
      title: "Overlap bukan obat untuk semua luka",
      body: "Overlap menutup satu jenis luka (kalimat terpotong) dan tidak menyentuh jenis lain (tabel terbelah, heading yatim). Sebelum memilih strategi “murah”, petakan JENIS kerusakan yang dominan di dokumenmu — di sini tabel, bukan kalimat. Di deliverable-mu, rekomendasi wajib menyebut jenis kerusakan yang ditangani dan yang tidak.",
    },
  },
  {
    id: "kons-struktur",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: struktur-aware",
    prose: [
      "Tidak ada lisensi yang dibayar. Jawaban atas pertanyaan tabel menjadi akurat — tim finance berhenti mengeluh, dan itu metrik yang tidak ada di dashboard vendor mana pun. Boundary yang bersih (2,5% rusak) berarti model menerima informasi yang utuh.",
      "Tapi recall 0,65 tidak hilang begitu saja: timmu menghabiskan satu kuartal memperbaiki ranking untuk menutup selisihnya. Pekerjaan rumah yang nyata — bukan ilusi “sudah menang” dari laporan vendor. Inilah trade-off yang jujur: kamu tahu persis apa yang dibayar (waktu tim) dan apa yang didapat (jawaban yang utuh). Tidak ada kejutan di bulan keempat.",
    ],
    tasks: [],
    note: {
      title: "Trade-off yang jujur mengalahkan kemenangan ilusi",
      body: "Struktur-aware tidak “menang” di semua metrik — ia menang di boundary dan kalah di recall. Keputusan yang baik tidak menyembunyikan kekalahannya; ia menyebutkannya beserta rencana menutupnya. Di deliverable-mu, setiap rekomendasi wajib mencantumkan metrik yang dikorbankan dan cara menutupnya.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 8 baris: benchmark yang menyembunyikan 4 hal",
    prose: [
      "Sebelum menulis rekomendasi, satu misi audit. Di bawah ini 8 baris “Laporan Benchmark Strategi Chunking” dari vendor, yang merekomendasikan “Semantic v2”. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: mean token 512,1 vs 512,9, tingkat kerusakan tabel per strategi, dan recall versi perhitunganmu sendiri.",
      "Perhatikan: dossier ini lebih pendek dari biasanya — sabotase keempat justru terletak pada apa yang TIDAK ada di tabel.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-chunking-buruk-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Benchmark Strategi Chunking dari vendor, yang merekomendasikan “Semantic v2” sebagai pemenang.",
      columns: ["Item", "Recall@10", "Chunk rusak", "Klaim vendor"],
      rows: [
        { rowId: 1, cells: { "Item": "Semantic v2", "Recall@10": "0,73", "Chunk rusak": "35%", "Klaim vendor": "Embedding + batas semantik" }, claims: [{ label: "Distribusi token", value: "Mean 512,1 — identik dengan Fixed-512" }] },
        { rowId: 2, cells: { "Item": "Fixed-512 + overlap-50", "Recall@10": "0,83", "Chunk rusak": "25%", "Klaim vendor": "Baseline klasik" }, claims: [{ label: "Klaim vendor", value: "Recall tertinggi" }] },
        { rowId: 3, cells: { "Item": "Struktur-aware", "Recall@10": "0,65", "Chunk rusak": "2,5%", "Klaim vendor": "Potong per heading" }, claims: [{ label: "Klaim vendor", value: "Boundary terbersih" }] },
        { rowId: 4, cells: { "Item": "Catatan metode recall", "Recall@10": "—", "Chunk rusak": "—", "Klaim vendor": "Chunk overlap dihitung sebagai hit terpisah" }, claims: [{ label: "Dampak", value: "Recall Fixed-512 terinflasi oleh hit ganda" }] },
        { rowId: 5, cells: { "Item": "Dokumen tuning vs uji", "Recall@10": "—", "Chunk rusak": "—", "Klaim vendor": "30 dokumen dipakai tuning DAN uji" }, claims: [{ label: "Kebocoran", value: "Set tuning = set uji — tidak ada dokumen baru" }] },
        { rowId: 6, cells: { "Item": "Struktur v1 (iterasi gagal)", "Recall@10": "?", "Chunk rusak": "?", "Klaim vendor": "Hasil tidak dilaporkan" }, claims: [{ label: "Disembunyikan", value: "Satu strategi gagal hilang dari laporan" }] },
        { rowId: 7, cells: { "Item": "Rekomendasi vendor", "Recall@10": "—", "Chunk rusak": "—", "Klaim vendor": "Pilih Semantic v2" }, claims: [{ label: "Dasar", value: "Recall 0,73 + label “semantik”" }] },
        { rowId: 8, cells: { "Item": "Distribusi token per strategi", "Recall@10": "—", "Chunk rusak": "—", "Klaim vendor": "—" }, claims: [{ label: "Semantic v2", value: "mean 512,1" }, { label: "Fixed-512", value: "mean 512,9" }, { label: "Struktur-aware", value: "mean 274,7" }] },
      ],
      injections: [
        { key: "semantic-palsu", rowIds: [1, 8], title: "Klaim “semantic” padahal fixed 512 token", clue: "Mean token Semantic v2 = 512,1 — identik dengan Fixed-512 (512,9). Tidak ada jejak “batas semantik”: distribusinya menumpuk di 512 seperti fixed window biasa. Label “semantic” hanya tempelan.", danger: "Membayar 3x lipat untuk teknologi “AI” yang isinya parameter lama dengan nama baru. Keputusan arsitektur berdasarkan label, bukan metrik — dan label tidak bisa diuji, metrik bisa." },
        { key: "overlap-ganda", rowIds: [2, 4], title: "Overlap dihitung ganda di recall", clue: "Chunk hasil overlap dihitung sebagai hit terpisah — satu dokumen yang sama menyumbang dua hit untuk satu temuan. Recall 0,83 Fixed-512 terinflasi oleh duplikat.", danger: "Metrik yang dihitung ganda membuat strategi boros terlihat terbaik — biaya indexing membengkak (chunk duplikat) tanpa manfaat retrieval nyata. Selalu tanya: apakah hit-nya di-dedup?" },
        { key: "uji-bocor", rowIds: [5], title: "Dokumen uji bocor ke tuning", clue: "30 dokumen yang dipakai menyetel parameter dipakai LAGI sebagai “uji”. Tidak ada satu pun dokumen yang belum pernah dilihat saat tuning.", danger: "Strategi yang menang di dokumen yang sama belum tentu menang di dokumen baru — keputusan deploy 3 tahun berdiri di atas evaluasi sirkular. Minta split dokumen yang benar-benar terpisah." },
        { key: "strategi-hilang", rowIds: [6], title: "Satu strategi gagal disembunyikan", clue: "“Struktur v1” — iterasi yang gagal — disebut di catatan kaki metodologi tapi hasilnya tidak ada di laporan. Kamu hanya melihat strategi yang “menang”.", danger: "Survivorship bias di laporan vendor: yang gagal disembunyikan, yang tampil terlihat selalu berhasil. Minta SEMUA hasil eksperimen, bukan yang lolos kurasi — pola kegagalan justru informasi paling berharga." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Rekomendasi chunking untuk Head of Engineering",
    prose: [
      "Semua bukti di tangan. Tulis rekomendasi strategi chunking satu halaman untuk Head of Engineering — artefak portofoliomu. Rekomendasi yang baik tidak hanya bilang “pilih yang ini”, tapi menunjukkan ANGKA per strategi, apa yang disembunyikan laporan vendor, berapa harganya, dan apa yang dikorbankan.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): strategi yang direkomendasikan, satu angka pendukung utama, satu kalimat harga/trade-off.",
        "Bukti kuantitatif: per strategi — mean token, % tabel rusak, % kalimat terpotong, recall — dari perhitunganmu sendiri, bukan brosur vendor.",
        "Temuan audit laporan vendor: 4 sabotase + nomor baris dossier buktinya (semantic palsu, overlap ganda, uji bocor, strategi hilang).",
        "Rekomendasi: rujuk keputusanmu di Langkah 5 + biaya (lisensi, indexing, waktu tim) + metrik yang dikorbankan dan cara menutupnya.",
        "Batas & risiko sisa: apa yang TIDAK diukur evaluasi ini (mis. hanya 30 dokumen sintetis; recall dihitung pada relevance buatan; perilaku pada dokumen 200 ribu yang heterogen belum teruji).",
      ],
      rubric: [
        { criterion: "Kebenaran metrik", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Mean token, % rusak, recall per strategi — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris dossier"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa harga/trade-off", "Ada rekomendasi, kabur", "Rekomendasi + biaya eksplisit + metrik yang dikorbankan"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim evaluasi membuktikan segalanya", "Menyebut sebagian batas", "Batas (sintetis, 30 dokumen, relevance buatan) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan benchmark vendor:",
      "1) **Semantic palsu** (baris 1, 8): mean token “Semantic v2” = 512,1, identik dengan Fixed-512 (512,9). Tidak ada “batas semantik” — hanya fixed window seharga 3x lipat. Distribusi token tidak bisa berbohong; brosur bisa.",
      "2) **Overlap ganda** (baris 2, 4): chunk overlap dihitung sebagai hit terpisah — recall 0,83 Fixed-512 terinflasi oleh duplikat. Tanpa hit ganda, “kemenangan” baseline ini menyusut.",
      "3) **Uji bocor** (baris 5): 30 dokumen tuning = 30 dokumen uji. Tidak ada evaluasi pada dokumen baru — seluruh perbandingan strategi berdiri di atas evaluasi sirkular.",
      "4) **Strategi hilang** (baris 6): “Struktur v1” yang gagal disembunyikan dari laporan. Kamu hanya diperlihatkan yang menang — survivorship bias yang membuat setiap strategi vendor terlihat selalu berhasil.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim vendor terhadap data mentah, atau memercayai label “semantic”. Dan ingat keputusan bercabangmu: mengikuti vendor membayar label; baseline murah membayar dengan jawaban tabel yang cacat; struktur-aware membayar dengan waktu tim. Tidak ada opsi yang gratis — hanya trade-off yang kamu pahami.",
      "Bahaya nyata terakhir: keputusan chunking mengunci 3 tahun — arsitektur, biaya indexing, dan kualitas setiap jawaban. Salah pilih di sini bukan bug yang bisa di-patch besok; itu fondasi yang menopang (atau meruntuhkan) seluruh knowledge base. Fondasi tidak dipilih dari brosur.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: benchmark vendor = kebenaran netral",
      type: "risk",
      body: "Benchmark dari penjual bukan pengukuran netral — itu materi pemasaran dengan angka. Polanya selalu sama: metrik yang menguntungkan ditonjolkan, yang merugikan disembunyikan, metodologi ditulis kecil-kecil. Aturan praktisnya: minta DATA MENTAH benchmark (bukan PDF ringkasannya), hitung ulang tiga angka kunci, dan curigai setiap strategi yang “menang” tanpa satu pun kekalahan yang dilaporkan.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Audit independen dari data mentah: 120 chunk (40/strategi) — Semantic v2: mean token 512,1, 35% tabel rusak, recall 0,73; Fixed-512: 512,9, 25% rusak, recall 0,83; Struktur-aware: 274,7, 2,5% rusak, recall 0,65.",
      "“Semantic v2” terbukti fixed-512 berlabel baru: distribusi token identik, kerusakan boundary identik — label teknologi bukan bukti.",
      "Empat pola sabotase benchmark vendor: klaim semantic palsu, overlap dihitung ganda di recall, dokumen uji bocor ke tuning, strategi gagal disembunyikan.",
      "Recall tertinggi ≠ strategi terbaik: Fixed-512 menang di recall yang terinflasi duplikat sambil merusak 25% tabel — pilih berdasarkan boundary DAN recall yang dihitung jujur, dengan harga trade-off yang eksplisit.",
      "Data: SINTETIS seed 42 (30 dokumen, 120 chunk), dibekukan 2026-10-15 — perilaku “semantic palsu” ditanam sengaja sebagai bahan audit, bukan cermin produksi.",
    ],
  },
];

(misiChunk.steps as V2Step[]).push(...LANJUTAN_CHUNK);
