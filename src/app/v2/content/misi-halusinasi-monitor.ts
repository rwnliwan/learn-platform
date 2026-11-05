import type { V2Mission } from "../lib/types";

// ── MISI LLMOps B: Klaim grounded yang tak bisa diverifikasi ─────────────
// M2 — LLMOps Misi B. Dataset: SINTETIS (generator Python, seed 42),
// dibekukan 2026-10-15. File: public/misi/misi-halusinasi-monitor/
// jawaban_audit.csv (500 pasangan QA + sitasi + skor grounding) +
// laporan klaim vendor (dossier audit). Metode: METODE.md.

const BASE = "/misi/misi-halusinasi-monitor";

export const misiHalu: V2Mission = {
  slug: "misi-halusinasi-monitor",
  track: "LLMOps",
  module: "Misi",
  title: "Misi Halusinasi: Klaim yang Tak Bisa Diverifikasi",
  estMinutes: 150,
  role: "LLMOps engineer — validator klaim grounded",
  client:
    "Tim produk — asisten AI “100% grounded” mau diluncurkan 3 minggu lagi; laporan vendor mengklaim setiap jawaban terverifikasi",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "“100% grounded” — angka yang tidak pernah benar",
      prose: [],
      tasks: [],
      briefing: {
        role: "LLMOps engineer di sebuah perusahaan teknologi — validator independen klaim model",
        client:
          "Tim produk. Asisten AI baru (“asisten-v3”) dijadwalkan launch 3 minggu lagi. Deck peluncuran sudah dicetak, headline-nya: “Asisten kami 100% grounded — setiap jawaban terverifikasi.” Vendor pihak ketiga yang membangun pipeline sitasi melampirkan laporan 14 baris sebagai bukti. Kamu diminta validasi independen: benarkah 100%? Karena kalau salah, yang malu bukan vendor — tapi perusahaanmu, di depan publik.",
        story: [
          "Kamis, 16:00. Tim produk memanggilmu ke ruang war — launch tinggal 3 minggu, dan satu-satunya headline yang mereka punya adalah “100% grounded”. Di layar: laporan vendor 14 baris, rapi, meyakinkan. “Setiap jawaban punya sitasi,” kata PM. “Jadi tidak mungkin halusinasi, kan?” Kamu menatap angka 100% itu. Dalam 4 tahun berkecimpung di ML, kamu belum pernah melihat angka 100% yang jujur.",
          "Kamu tahu risikonya. Sitasi yang menunjuk passage yang salah lebih berbahaya daripada tidak ada sitasi sama sekali — karena user MEMPERCAYAINYA. “Ada sumbernya” mematikan skeptisisme, padahal sumbernya tidak mendukung klaimnya. Tugasmu: ukur grounding rate dan presisi sitasi dari 500 pasangan QA, temukan jawaban yang mengarang, dan bedah laporan vendor baris per baris.",
          "Misi ini memakai data sintetis: 500 pasangan tanya-jawab asisten-v3 beserta sitasi dan skor grounding, plus laporan klaim vendor. Di ujungnya kamu memutuskan nasib peluncuran: blokir rilis, rilis dengan disclaimer, atau perbaiki pipeline sitasi dulu — lalu menulis memo validasi yang berani bilang “klaim 100% itu salah”.",
        ],
        objectives: [
          "Menghitung grounding rate dan presisi sitasi dari 500 pasangan QA, serta mengidentifikasi jawaban tanpa dukungan passage.",
          "Menyaring jawaban berisiko dengan SQL: tidak didukung ATAU skor grounding di bawah 0,60.",
          "Menemukan 4 sabotase di laporan klaim vendor dan menulis memo validasi dengan rekomendasi rilis yang dipertahankan.",
        ],
        prereqSummary:
          "Grounding = jawaban yang DIDUKUNG oleh passage yang disitasinya (bukan sekadar “ada sitasi”). Grounding rate = fraksi jawaban yang didukung. Presisi sitasi = fraksi sitasi yang menunjuk passage yang BENAR — sitasi bisa ada tapi menunjuk passage yang salah, dan itu tetap halusinasi yang dibungkus kepercayaan. Ambang risiko di misi ini: skor_grounding < 0,60 = jawaban berisiko, wajib ditinjau manusia.",
        datasetNote:
          "Sumber: SINTETIS — generator Python (numpy, seed 42), dibuat untuk misi ini; BUKAN hasil evaluasi asisten nyata.\nSlice: 500 baris jawaban_audit.csv (id, pertanyaan, kategori, jawaban, sitasi, skor_grounding, didukung, sitasi_tepat).\nKlaim yang diaudit: “asisten-v3 100% grounded” (laporan vendor Q3).\nKejujuran: keempat sabotase laporan (sitasi salah passage, eval bocor ke prompt, ambang diturunkan diam-diam, sampel gagal dihapus) adalah skenario latihan yang disengaja. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "500 jawaban, 500 sitasi, 1 klaim",
      prose: [
        "`jawaban_audit.csv` adalah kebenaran mentah: 500 pasangan tanya-jawab asisten-v3. Setiap baris punya pertanyaan, kategori (produk/dokumen/kebijakan/teknis), jawaban, kode sitasi (mis. `P-042` — passage yang diklaim mendukung jawaban), skor grounding 0–1 dari scorer independen, serta dua kolom kunci: `didukung` (1 = jawaban didukung passage-nya) dan `sitasi_tepat` (1 = sitasi menunjuk passage yang benar).",
        "Perhatikan: `didukung` dan `sitasi_tepat` adalah DUA hal berbeda. Jawaban bisa “didukung” menurut scorer tapi sitasinya menunjuk passage yang salah — dan itu adalah temuan paling berbahaya di misi ini. Klaim vendor (“100% grounded”, “100% sitasi tepat”) akan kamu uji terhadap kedua kolom ini.",
        "Aturan main: (1) metrik dihitung dari kolom mentah, bukan dari ringkasan vendor; (2) “berisiko” = didukung=0 ATAU skor_grounding < 0,60; (3) vonis “rilis/tidak” diambil setelah audit laporan, bukan sebelum.",
      ],
      tasks: [
        { id: "t1", text: "Buka `jawaban_audit.csv`: catat 8 kolom dan jumlah baris" },
        { id: "t2", text: "Hitung distribusi kategori: produk/dokumen/kebijakan/teknis" },
      ],
      note: {
        title: "Miskonsepsi #1: ada sitasi = grounded",
        type: "pitfall",
        body: "“Jawabannya ada sitasinya, jadi pasti benar.” SALAH — dan kesalahpahaman ini adalah fondasi seluruh klaim “100% grounded”. Sitasi adalah KLAIM tentang sumber, bukan bukti. Di data ini, 26 jawaban yang “didukung” ternyata mensitasi passage yang SALAH. Sitasi palsu lebih berbahaya daripada tidak ada sitasi: ia mematikan skeptisisme user tepat saat skeptisisme paling dibutuhkan.",
      },
      reference:
        "jawaban_audit.csv (500 baris, SINTETIS, seed 42). Ukur dari yang mentah; vonis untuk klaim vendor.",
    },
    {
      id: "lab-grounding",
      eyebrow: "Langkah 3 · Lab 1 — Ukur klaimnya",
      title: "“100% grounded”, katamu?",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `jawaban_audit.csv`: hitung grounding rate (fraksi `didukung` = 1), rata-rata skor grounding, jumlah jawaban tanpa dukungan, dan presisi sitasi (fraksi `sitasi_tepat` = 1). Terakhir, hitung yang paling memalukan: berapa jawaban yang “didukung” TAPI sitasinya menunjuk passage yang salah.",
        "Klaim vendor: grounding rate 1,00 dan presisi sitasi 1,00. Setiap desimal di bawah itu adalah kebohongan yang harus dijelaskan di memo.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris`, `grounding_rate`, `rata_skor`" },
        { id: "t2", text: "Hitung `n_tak_didukung`, `presisi_sitasi`, dan `n_sitasi_salah_didukung`" },
      ],
      expected:
        "n=500; grounding rate 0,916 (klaim: 1,00); rata-rata skor 0,8449; 42 jawaban tanpa dukungan; presisi sitasi 0,89 — 26 sitasi menunjuk passage yang salah padahal jawabannya “didukung”",
      formula: String.raw`G = \frac{N_{didukung}}{N_{total}};\quad P_{sitasi} = \frac{N_{sitasi\_tepat}}{N_{total}}`,
      formulaNote:
        "G = grounding rate (fraksi jawaban yang didukung passage); P_sitasi = presisi sitasi (fraksi sitasi yang menunjuk passage yang BENAR — bukan sekadar ada). Klaim vendor: G = 1,00 dan P_sitasi = 1,00. Keduanya dihitung dari kolom mentah — bukan dari angka ringkasan laporan.",
      note: {
        title: "Miskonsepsi #2: skor grounding tinggi = aman",
        type: "pitfall",
        body: "“Rata-rata skor 0,84 — tinggi, berarti aman.” Rata-rata menyembunyikan 42 jawaban tanpa dukungan dan 26 sitasi salah passage. Skor grounding adalah PREDIKSI model scorer — ia bisa salah, dan ia tidak tahu kapan ia salah. Angka agregat tidak pernah menjadi izin untuk melewatkan audit baris-per-baris pada sampel berisiko.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — kolom didukung/sitasi_tepat bertipe integer 0/1.",
        "Grounding rate = `df[\"didukung\"].mean()` — mean dari kolom 0/1 = fraksi.",
        "Jawaban 'didukung' tapi sitasi salah: `(df[\"didukung\"]==1) & (df[\"sitasi_tepat\"]==0)` lalu `.sum()`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-halusinasi-monitor/jawaban_audit.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "grounding_rate = ...      # fraksi jawaban yang didukung (didukung=1)",
          "rata_skor = ...           # rata-rata skor_grounding",
          "",
          "n_tak_didukung = ...      # jumlah jawaban tanpa dukungan",
          "presisi_sitasi = ...      # fraksi sitasi yang menunjuk passage yang benar",
          "n_sitasi_salah_didukung = ...  # didukung=1 TAPI sitasi_tepat=0",
          "",
          "print(\"baris:\", n_baris, \"| grounding rate:\", round(grounding_rate, 4), \"| rata-rata skor:\", round(rata_skor, 4))",
          "print(\"tanpa dukungan:\", n_tak_didukung, \"| presisi sitasi:\", round(presisi_sitasi, 4))",
          "print(\"sitasi salah padahal 'didukung':\", n_sitasi_salah_didukung)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-halusinasi-monitor/jawaban_audit.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "grounding_rate = float(df[\"didukung\"].mean())",
          "rata_skor = float(df[\"skor_grounding\"].mean())",
          "",
          "n_tak_didukung = int((df[\"didukung\"] == 0).sum())",
          "presisi_sitasi = float(df[\"sitasi_tepat\"].mean())",
          "n_sitasi_salah_didukung = int(((df[\"didukung\"] == 1) & (df[\"sitasi_tepat\"] == 0)).sum())",
          "",
          "print(\"baris:\", n_baris, \"| grounding rate:\", round(grounding_rate, 4), \"| rata-rata skor:\", round(rata_skor, 4))",
          "print(\"tanpa dukungan:\", n_tak_didukung, \"| presisi sitasi:\", round(presisi_sitasi, 4))",
          "print(\"sitasi salah padahal 'didukung':\", n_sitasi_salah_didukung)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 500", name: "n_baris", value: 500, msg: "File punya 500 pasangan QA." },
          { kind: "equal", task: "t1", label: "`grounding_rate` ≈ 0,916", name: "grounding_rate", value: 0.916, tol: 0.002, msg: "Fraksi baris dengan didukung=1 — jauh dari klaim 1,00." },
          { kind: "equal", task: "t1", label: "`rata_skor` ≈ 0,8449", name: "rata_skor", value: 0.8449, tol: 0.002, msg: "Rata-rata kolom skor_grounding." },
          { kind: "equal", task: "t2", label: "`n_tak_didukung` = 42", name: "n_tak_didukung", value: 42, msg: "42 jawaban tanpa dukungan passage — klaim '0' vendor runtuh." },
          { kind: "equal", task: "t2", label: "`presisi_sitasi` ≈ 0,89", name: "presisi_sitasi", value: 0.89, tol: 0.005, msg: "Fraksi baris dengan sitasi_tepat=1 — bukan 1,00." },
          { kind: "equal", task: "t2", label: "`n_sitasi_salah_didukung` = 26", name: "n_sitasi_salah_didukung", value: 26, msg: "26 jawaban 'didukung' tapi sitasinya menunjuk passage yang salah." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Saring yang berisiko",
      title: "Temukan jawaban yang tidak boleh lolos",
      prose: [
        "42 jawaban tanpa dukungan dan 26 sitasi salah passage — tapi tim produk tidak bisa meninjau 500 baris satu per satu setiap rilis. Di tabel sampel ini (14 baris dari data mentah), tulis query yang menyaring jawaban BERISIKO: tidak didukung (`didukung` = 0) ATAU skor grounding di bawah 0,60. Urut dari skor terendah — yang paling berbahaya harus muncul pertama.",
        "Tabel `jawaban_sampel(id TEXT, skor_grounding REAL, didukung INTEGER)`. Inilah query yang seharusnya berjalan di pipeline pra-rilis: setiap jawaban yang lolos saringan ini wajib lewat tinjauan manusia.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query penyaring jawaban berisiko, urut dari skor terendah" },
      ],
      expected: "7 baris berisiko — semuanya didukung=0; terendah J-0457 (0,025), lalu J-0191 (0,151), J-0235 (0,215), …",
      sqlLab: {
        task: "Saring jawaban BERISIKO dari jawaban_sampel: didukung = 0 ATAU skor_grounding < 0,60. Tampilkan id + skor_grounding + didukung, urut dari skor terendah.",
        schema: "CREATE TABLE jawaban_sampel (id TEXT, skor_grounding REAL, didukung INTEGER);",
        seedData: [
          "INSERT INTO jawaban_sampel VALUES",
          "('J-0018',0.741,1),",
          "('J-0087',0.848,1),",
          "('J-0100',0.409,0),",
          "('J-0143',0.352,0),",
          "('J-0160',0.780,1),",
          "('J-0191',0.151,0),",
          "('J-0235',0.215,0),",
          "('J-0251',0.905,1),",
          "('J-0322',0.928,1),",
          "('J-0340',0.289,0),",
          "('J-0342',0.377,0),",
          "('J-0363',0.893,1),",
          "('J-0451',0.936,1),",
          "('J-0457',0.025,0);",
        ].join("\n"),
        starter: [
          "-- Tulis query-mu di sini",
          "-- Tabel: jawaban_sampel(id, skor_grounding, didukung)",
          "-- Saring jawaban BERISIKO: tidak didukung ATAU skor < 0,60. Urut dari skor terendah.",
          "SELECT id, skor_grounding, didukung",
          "FROM jawaban_sampel",
        ].join("\n"),
        solution: [
          "SELECT id, skor_grounding, didukung",
          "FROM jawaban_sampel",
          "WHERE didukung = 0 OR skor_grounding < 0.60",
          "ORDER BY skor_grounding;",
        ].join("\n"),
        expectedColumns: ["id", "skor_grounding", "didukung"],
        expectedRows: [
          ["J-0457", 0.025, 0],
          ["J-0191", 0.151, 0],
          ["J-0235", 0.215, 0],
          ["J-0340", 0.289, 0],
          ["J-0143", 0.352, 0],
          ["J-0342", 0.377, 0],
          ["J-0100", 0.409, 0],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiHalu;

// ── lanjutan misiHalu: langkah 5–10 ──────────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_HALU: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Rilis atau tidak?",
    prose: [
      "Angkanya tidak berbohong: grounding rate 0,916 (bukan 1,00), 42 jawaban tanpa dukungan, presisi sitasi 0,89 dengan 26 sitasi menunjuk passage yang salah. Klaim “100% grounded” sudah runtuh secara kuantitatif. Tapi “klaimnya salah” dan “apa yang harus dilakukan perusahaan” adalah dua keputusan berbeda — dan tim produk menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke tim produk soal peluncuran asisten-v3? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-blokir",
          label: "Blokir rilis sampai grounding ≥ 0,99 dan presisi sitasi ≥ 0,98",
          rationale:
            "Klaim 100% terbukti salah; 42 jawaban tanpa dukungan; 26 sitasi palsu. Meluncurkan sekarang = membohongi user dengan headline yang sudah dicetak. Kepercayaan sekali hilang tidak bisa di-restore.",
          nextStepId: "dampak-blokir",
          consequenceNote:
            "Launch mundur 6 minggu — tim produk marah besar. Tiga minggu kemudian kompetitor kena skandal sitasi palsu: deck “100% terverifikasi” mereka jadi meme industri. Tiba-tiba keputusanmu terlihat visioner, bukan pengecut. Kepercayaan yang kamu lindungi hari ini menjadi keunggulan kompetitif.",
        },
        {
          id: "opt-disclaimer",
          label: "Rilis sesuai jadwal, dengan disclaimer “beta”",
          rationale:
            "91,6% grounded sudah “cukup baik” untuk v1; disclaimer menutupi sisanya secara legal. Momentum launch dan target kuartal lebih penting daripada kesempurnaan.",
          nextStepId: "dampak-disclaimer",
          consequenceNote:
            "Disclaimer diklik 0,3% user — praktis tidak ada yang baca. Minggu ke-2: seorang user menemukan jawaban seputar kebijakan pengembalian dana dengan sitasi menunjuk passage yang salah. Screenshot-nya viral dengan caption “100% grounded katanya”. Headline yang kamu biarkan lolos menjadi headline yang menghantuimu.",
        },
        {
          id: "opt-perbaiki",
          label: "Tunda 3 minggu: perbaiki pipeline sitasi, kembalikan ambang 0,90",
          rationale:
            "Akar masalahnya di pipeline: retriever salah menunjuk passage + ambang grounding yang diturunkan diam-diam. Tiga minggu cukup untuk memperbaiki retriever, membersihkan kontaminasi eval, dan mengembalikan ambang.",
          nextStepId: "dampak-perbaiki",
          consequenceNote:
            "Tiga minggu kemudian: presisi sitasi 0,985, grounding rate 0,992 pada eval bersih. Klaim launch direvisi jujur: “99,2% grounded — terverifikasi independen.” Launch sukses tanpa skandal, dan tim produk belajar satu hal: angka yang jujur menjual lebih lama daripada angka yang bulat.",
        },
      ],
    },
  },
  {
    id: "dampak-blokir",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: rilis diblokir",
    prose: [
      "Kamu memblokir rilis — dan menjadi orang paling tidak populer di perusahaan selama 6 minggu. Target kuartal meleset, PM mengirim email panjang. Lalu kompetitor meluncurkan asisten “100% terverifikasi” mereka — dan 3 minggu kemudian kena skandal sitasi palsu yang viral. Deck mereka jadi meme; analis industri menulis “kasus klasik klaim grounding tanpa validasi independen”.",
      "Tiba-tiba semua orang ingat siapa yang memblokir rilis. Pelajaran: validator yang benar terlihat keras kepala — sampai skandal orang lain membuktikan ia benar. Integritas punya harga di muka dan dividen di belakang.",
    ],
    tasks: [],
    note: {
      title: "Blokir tanpa ambang = penundaan abadi",
      body: "“Blokir sampai bagus” hanya bermakna kalau ada angka pelepasnya: grounding ≥ 0,99 DAN presisi sitasi ≥ 0,98 pada eval bersih. Tanpa ambang eksplisit, blokir = veto sepihak yang tidak bisa dipertahankan. Di memo-mu, setiap “jangan rilis” wajib ditemani “rilis bila …”.",
    },
  },
  {
    id: "dampak-disclaimer",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: rilis dengan disclaimer",
    prose: [
      "Launch tepat waktu — perayaan di Slack. Disclaimer “beta, verifikasi informasi penting” diklik 0,3% user. Minggu ke-2, seorang user teliti menemukan jawaban soal kebijakan pengembalian dana: sitasinya menunjuk passage tentang retensi log — salah total, tapi terlihat meyakinkan. Screenshot-nya viral: “100% grounded katanya”.",
      "Tim legal bilang disclaimer melindungi secara hukum. Tim brand bilang tidak ada disclaimer yang melindungi dari meme. Pelajaran yang mahal: disclaimer adalah strategi legal, bukan strategi kepercayaan — dan user yang merasa dibohongi tidak menggugat, mereka pergi.",
    ],
    tasks: [],
    note: {
      title: "Disclaimer bukan mitigasi risiko",
      body: "Disclaimer mengurangi risiko HUKUM, bukan risiko KEPERCAYAAN. Di memo-mu, bedakan keduanya secara eksplisit: “risiko legal tertutup disclaimer; risiko reputasi TIDAK.” Keputusan rilis harus menimbang keduanya — bukan menyamarkannya.",
    },
  },
  {
    id: "dampak-perbaiki",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: perbaiki dulu, rilis kemudian",
    prose: [
      "Tiga minggu terasa lama di tengah tekanan launch — tapi terasa sebentar dibanding skandal. Retriever diperbaiki (presisi sitasi 0,89 → 0,985), eval dibersihkan dari kontaminasi, ambang dikembalikan ke 0,90 dengan changelog. Hasil akhir pada eval bersih: grounding rate 0,992.",
      "Klaim launch direvisi — dan justru menjadi lebih kuat: “99,2% grounded, terverifikasi independen.” Angka yang tidak bulat ternyata lebih dipercaya daripada 100%. Pelajaran: kejujuran metrik bukan pajak atas launch; ia adalah fitur launch.",
    ],
    tasks: [],
    note: {
      title: "Perbaiki akar, bukan angka",
      body: "Godaan terbesar setelah menemukan metrik jelek adalah memperbaiki ANGKA-nya (turunkan ambang, buang sampel gagal — persis sabotase vendor). Jalan profesional: perbaiki PIPELINE-nya (retriever, data eval, ambang yang tercatat). Metrik yang membaik karena pipeline membaik = kemajuan; metrik yang membaik karena definisi diubah = penipuan.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 14 baris: klaim “100%” yang dibangun dari 4 kebohongan",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 14 baris “Laporan Klaim Grounded Q3” dari vendor — dokumen di balik headline “100% grounded”. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: grounding rate 0,916 (bukan 1,00), 42 jawaban tanpa dukungan, presisi sitasi 0,89 dengan 26 sitasi salah passage, dan 7 jawaban berisiko dari Lab 2.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-halusinasi-monitor-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Klaim Grounded Q3 dari vendor pipeline sitasi, yang menyatakan asisten-v3 “100% grounded”.",
      columns: ["Baris", "Klaim", "Nilai"],
      rows: [
        { rowId: 1, cells: { "Baris": "1", "Klaim": "Klaim utama", "Nilai": "100% grounded" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        // ── I3: ambang diturunkan diam-diam ──
        { rowId: 2, cells: { "Baris": "2", "Klaim": "Definisi grounded", "Nilai": "skor ≥ 0,60 (konfig aktif)" }, claims: [{ label: "Konfig", value: "grounding scorer v2" }] },
        { rowId: 3, cells: { "Baris": "3", "Klaim": "Ambang sebelumnya", "Nilai": "0,90 (changelog: tidak ada)" }, claims: [{ label: "Riwayat", value: "—" }] },
        // ── I4: sampel gagal dihapus ──
        { rowId: 4, cells: { "Baris": "4", "Klaim": "Ukuran evaluasi", "Nilai": "n = 480" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 5, cells: { "Baris": "5", "Klaim": "Sampel gagal", "Nilai": "20 dikeluarkan dari laporan" }, claims: [{ label: "Alasan", value: "anomali anotasi" }] },
        // ── I1: sitasi menunjuk passage yang salah ──
        { rowId: 6, cells: { "Baris": "6", "Klaim": "Presisi sitasi", "Nilai": "100% tepat" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        // ── I2: eval set bocor ke contoh prompt ──
        { rowId: 7, cells: { "Baris": "7", "Klaim": "Contoh few-shot prompt", "Nilai": "bank contoh umum" }, claims: [{ label: "Sumber", value: "internal vendor" }] },
        { rowId: 8, cells: { "Baris": "8", "Klaim": "Sumber contoh few-shot", "Nilai": "(tidak dinyatakan)" }, claims: [{ label: "Sumber", value: "—" }] },
        { rowId: 9, cells: { "Baris": "9", "Klaim": "Grounding rate terukur", "Nilai": "100%" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 10, cells: { "Baris": "10", "Klaim": "Jawaban tanpa dukungan", "Nilai": "0" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 11, cells: { "Baris": "11", "Klaim": "Model", "Nilai": "asisten-v3" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 12, cells: { "Baris": "12", "Klaim": "Periode evaluasi", "Nilai": "Q3" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 13, cells: { "Baris": "13", "Klaim": "Metode skor", "Nilai": "grounding scorer v2" }, claims: [{ label: "Sumber", value: "Laporan vendor Q3" }] },
        { rowId: 14, cells: { "Baris": "14", "Klaim": "Rekomendasi", "Nilai": "rilis sesuai jadwal" }, claims: [{ label: "Status", value: "disetujui vendor" }] },
      ],
      injections: [
        { key: "sitasi-salah", rowIds: [6], title: "Sitasi menunjuk passage yang salah", clue: "Laporan mengklaim 100% sitasi tepat (baris 6). Data mentahmu: 26 jawaban yang “didukung” ternyata mensitasi passage yang SALAH (sitasi_tepat=0) — presisi sitasi sebenarnya 0,89. Klaim “setiap jawaban terverifikasi” runtuh pada kolom ini.", danger: "Sitasi yang menunjuk passage salah bukan verifikasi — itu halusinasi bersertifikat. User melihat “ada sumbernya” dan mematikan skeptisisme tepat saat ia paling dibutuhkan. Di domain medis/hukum, satu sitasi palsu bisa berarti keputusan yang salah dengan penuh percaya diri." },
        { key: "eval-bocor", rowIds: [7, 8], title: "Eval set bocor ke contoh prompt", clue: "“Bank contoh umum” (baris 7) ternyata diambil dari SET EVALUASI — sumbernya “tidak dinyatakan” (baris 8). Model melihat soal ujian sebelum ujian: skor 100% itu mengukur hafalan contoh, bukan kemampuan grounding.", danger: "Kontaminasi eval adalah dosa asal benchmarking: sekali contoh eval masuk ke prompt, seluruh angka laporan menjadi tidak berarti. Selalu tanya: dari mana contoh few-shot berasal, dan siapa yang menjamin ia tidak tumpang tindih dengan eval set?" },
        { key: "ambang-diturunkan", rowIds: [2, 3], title: "Ambang grounding diturunkan diam-diam", clue: "Definisi “grounded” diam-diam berubah dari skor ≥ 0,90 menjadi ≥ 0,60 (baris 2) — tanpa changelog (baris 3). Dengan ambang asli, puluhan jawaban gagal; dengan ambang baru, mereka “lolos”. Angkanya membaik, pipeline-nya tidak.", danger: "Mengubah ambang agar lolos bukan perbaikan — itu manipulasi metrik. Setiap perubahan ambang/definisi metrik WAJIB tercatat di changelog dengan alasan. Yang tidak tercatat = disembunyikan." },
        { key: "sampel-dihapus", rowIds: [4, 5], title: "Sampel gagal dihapus dari laporan", clue: "n=480 (baris 4), bukan 500 — 20 sampel gagal “dikeluarkan dari laporan” dengan alasan “anomali anotasi” (baris 5). Menghapus yang gagal lalu mengklaim 100% adalah survivor bias yang disengaja: tentu 100% kalau yang tidak 100% dibuang.", danger: "Sampel yang dibuang diam-diam adalah tempat kegagalan disembunyikan. Laporan evaluasi yang jujur melaporkan n LENGKAP + alasan eksklusi per sampel — bukan n yang sudah “dibersihkan”." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo validasi klaim untuk tim produk",
    prose: [
      "Semua bukti di tangan. Tulis memo validasi klaim satu halaman untuk tim produk — artefak portofoliomu. Memo yang baik tidak hanya bilang “klaimnya salah”, tapi menunjukkan ANGKA kesalahannya, apa yang disembunyikan laporan vendor, dan ambang rilis yang jujur.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): grounding rate 0,916 vs klaim 1,00; presisi sitasi 0,89; rekomendasi rilis.",
        "Bukti kuantitatif: n=500, 42 jawaban tanpa dukungan, 26 sitasi salah passage, 7 jawaban berisiko dari Lab 2, distribusi skor.",
        "Temuan audit: 4 sabotase laporan vendor, masing-masing dengan nomor baris dossier + bukti dari data mentah.",
        "Rekomendasi: keputusanmu di Langkah 5 + ambang rilis yang jujur (mis. grounding ≥ 0,99, presisi sitasi ≥ 0,98 pada eval bersih).",
        "Batas & risiko sisa: skor grounding adalah prediksi model scorer (bukan kebenaran mutlak); data sintetis; risiko domain sensitif (medis/hukum/keuangan) bila jawaban berisiko lolos.",
      ],
      rubric: [
        { criterion: "Kebenaran metrik", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "0,916 / 0,89 / 42 / 26 — semua tepat dengan definisi benar"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris dossier"] },
        { criterion: "Kualitas rekomendasi rilis", weight: 25, levels: ["Rekomendasi tanpa ambang rilis", "Ada rekomendasi, ambang kabur", "Rekomendasi + ambang rilis eksplisit (mis. grounding ≥ 0,99 pada eval bersih)"] },
        { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim memo menyelesaikan segalanya", "Menyebut sebagian batas", "Batas (skor = prediksi scorer, data sintetis, risiko domain sensitif) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan klaim vendor:",
      "1) **Sitasi menunjuk passage yang salah** (baris 6): 26 jawaban “didukung” mensitasi passage yang tidak mendukungnya. Presisi sitasi sebenarnya 0,89, bukan 100%. “Setiap jawaban terverifikasi” = setiap jawaban punya stiker verifikasi palsu.",
      "2) **Eval set bocor ke contoh prompt** (baris 7–8): contoh few-shot diambil dari set evaluasi. Model mengerjakan “ujian” dengan kunci jawaban di meja — skor 100% mengukur hafalan, bukan grounding.",
      "3) **Ambang diturunkan diam-diam** (baris 2–3): 0,90 → 0,60 tanpa changelog. Definisi “grounded” dilonggarkan sampai yang gagal pun lolos — lalu dilonggarkannya tidak dicatat.",
      "4) **Sampel gagal dihapus** (baris 4–5): 20 sampel gagal dibuang dengan alasan “anomali anotasi”, n dilaporkan 480. Tentu 100% — yang tidak 100% sudah dibuang duluan.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu mengukur dari data mentah, atau memercayai headline. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — bahkan opsi “benar” (perbaiki dulu) menunda launch 3 minggu. Validator terbaik bukan yang paling keras menolak, melainkan yang ambang rilisnya paling tidak bisa dibantah.",
      "Bahaya nyata terakhir: asisten AI dengan sitasi palsu di domain medis, hukum, atau keuangan — user mengikuti “sumber” yang salah dengan penuh percaya diri. Halusinasi tanpa sitasi menimbulkan keraguan; halusinasi BERSITASI menimbulkan kepastian yang salah. Yang kedua jauh lebih berbahaya.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: skor grounding tinggi = aman",
      type: "risk",
      body: "Rata-rata skor 0,84 terlihat menenangkan — sampai kamu ingat 42 jawaban tanpa dukungan bersembunyi di dalamnya. Skor grounding adalah prediksi model, dan model scorer tidak tahu kapan ia salah. Angka agregat tidak pernah menjadi izin untuk melewatkan audit baris-per-baris pada sampel berisiko. Di produksi: setiap jawaban di bawah ambang WAJIB lewat tinjauan manusia, tanpa kecuali.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Ukur klaim: 500 QA, grounding rate 0,916 (klaim 1,00), presisi sitasi 0,89 — 42 tanpa dukungan, 26 sitasi salah passage.",
      "Empat pola sabotase laporan klaim: sitasi salah passage, eval bocor ke prompt, ambang 0,90→0,60 tanpa changelog, 20 sampel gagal dihapus (n=480).",
      "Keputusan rilis selalu punya harga: blokir (kepercayaan dengan biaya momentum), disclaimer (legal aman, reputasi tidak), perbaiki dulu (tunda 3 minggu, klaim jujur 99,2%). Setiap “jangan rilis” wajib ditemani ambang pelepasnya.",
      "Sitasi adalah klaim, bukan bukti — dan halusinasi bersitasi lebih berbahaya daripada halusinasi telanjang.",
      "Data: SINTETIS (generator Python, seed 42), dibekukan 2026-10-15; “asisten-v3” fiktif, bukan produk nyata.",
    ],
  },
];

(misiHalu.steps as V2Step[]).push(...LANJUTAN_HALU);
