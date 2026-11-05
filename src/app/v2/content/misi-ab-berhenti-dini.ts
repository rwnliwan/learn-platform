import type { V2Mission } from "../lib/types";

// ── MISI A/B: Tombol Hijau yang Terlalu Cepat ────────────────────────────
// M2 — Marketing Analytics Misi B (edge). Dataset SINTETIS 100% (simulasi
// Python, seed 42; BUKAN hasil eksperimen nyata). File: public/misi/
// misi-ab-berhenti-dini/eksperimen_aa.csv (30 eksperimen A/A × 28 hari).
// Metode: METODE.md.

export const misiAbBerhentiDini: V2Mission = {
  slug: "misi-ab-berhenti-dini",
  track: "Marketing Analytics",
  module: "Misi",
  title: "Misi A/B yang Berhenti Dini",
  estMinutes: 130,
  role: "Product data analyst",
  client:
    "Product Manager — varian B “menang” di hari ke-9 (p = 0,041); ia ingin ship ke 100% pengguna hari ini juga",
  xp: 520,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tombol hijau di hari ke-9",
      prose: [],
      tasks: [],
      briefing: {
        role: "Product data analyst — orang yang ditanya “jadi ship atau tidak?” setiap kali dashboard berubah warna",
        client:
          "Product Manager (PM). Eksperimen checkout baru berjalan 9 dari 28 hari yang direncanakan; dashboard pagi ini hijau: varian B +12% conversion, p = 0,041. PM ingin ship ke 100% pengguna hari ini — “momentum penting, kompetitor tidak menunggu.” Kamu diminta second opinion independen: apakah kemenangan hari ke-9 ini bisa dipercaya, atau hanya artefak dari kebiasaan tim yang mengintip dashboard tiap pagi.",
        story: [
          "Kamis, 09:41. Notifikasi dashboard: hijaunya menyala. PM meneruskan tangkapan layar ke grup: “Varian B menang! +12%, p = 0,041 di hari ke-9. Ship hari ini?” Tiga emoji api menyusul. Kamu menatap angka itu lebih lama dari yang lain — karena kamu tahu kebiasaan tim ini: dashboard dibuka tiap pagi, dan “p < 0,05” dirayakan kapan pun ia muncul.",
          "Masalahnya: uji statistik di dashboard itu dirancang untuk dibaca SEKALI di akhir — bukan tiap hari sampai hijau. Setiap pagi adalah satu kesempatan baru untuk salah, dan tim ini sudah mengintip 9 kali. Pertanyaannya bukan “apakah p < 0,05”, melainkan “p < 0,05 setelah berapa kali mengintip”.",
          "Misi ini memakai data SINTETIS 100% (simulasi Python, seed 42 — bukan eksperimen nyata) dengan properti yang mustahil dimiliki data nyata: 30 eksperimen A/A di mana efek sebenarnya = NOL. Setiap “kemenangan” yang kamu temukan di sana adalah false positive yang terdokumentasi — laboratorium sempurna untuk melihat seberapa parah kerusakan yang ditimbulkan kebiasaan mengintip.",
        ],
        objectives: [
          "Menghitung false positive rate pada 30 eksperimen A/A dengan tiga cara analisis: horizon tetap (uji sekali di hari ke-28), intip harian (berhenti saat pertama signifikan), dan koreksi Bonferroni.",
          "Menjelaskan mengapa p-value yang dihitung setelah mengintip tiap hari tidak lagi berarti “peluang salah 5%” — dengan angka, bukan slogan.",
          "Menemukan minimal 3 suntikan di laporan eksperimen vendor dan menulis rekomendasi ship/tidak + desain sequential testing yang jujur.",
        ],
        prereqSummary:
          "Uji A/B membandingkan dua proporsi konversi dengan uji-z; p < 0,05 dibaca “signifikan”. False positive = eksperimen TANPA efek yang dinyatakan menang — dalam data A/A (kedua lengan identik), SEMUA kemenangan adalah false positive. Peeking / optional stopping = menguji tiap hari dan berhenti saat hijau: tiap intipan adalah kesempatan baru untuk salah sehingga peluang false positive jauh di atas 5%. Sequential testing (mis. koreksi Bonferroni: ambang per intipan = alpha/jumlah intipan) = aturan berhenti dini yang tetap menjaga false positive.",
        datasetNote:
          "Data SINTETIS 100% — simulasi Python (seed 42), BUKAN hasil eksperimen nyata.\nFile eksperimen_aa.csv: 30 eksperimen A/A × 28 hari = 840 baris. Tiap hari: 1.000 pengunjung per lengan, peluang konversi 0,10 di KEDUA lengan — efek sebenarnya = NOL, jadi setiap “signifikan” yang kamu temukan adalah false positive yang tercatat.\nKolom n_kontrol/konv_kontrol/n_varian/konv_varian bersifat KUMULATIF (hari ke-9 = total hari 1–9).\nMetode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "30 eksperimen yang semuanya bohong — dan itu disengaja",
      prose: [
        "Satu file: `eksperimen_aa.csv`. 30 eksperimen, masing-masing 28 baris harian. Setiap baris mencatat jumlah pengunjung dan konversi KUMULATIF per lengan sampai hari itu. Kedua lengan dibangkitkan dari peluang yang SAMA PERSIS (0,10) — tidak ada varian yang “lebih baik”. Ini A/A testing: eksperimen yang seharusnya tidak pernah menang.",
        "Kata SINTETIS di sini adalah fondasi seluruh misi. Di dunia nyata kamu tidak pernah tahu efek sebenarnya — itu sebabnya peeking begitu berbahaya: ia terasa seperti “membaca data”, padahal ia memanen noise. Di sini kamu memegang kebenarannya (NOL), sehingga kamu bisa mengukur persis berapa banyak kebohongan yang dihasilkan tiap cara analisis.",
        "Aturan main: (1) uji-z dua proporsi memakai count KUMULATIF hari itu; (2) “signifikan” = |z| > 1,96 (alpha 5% dua sisi); (3) tiga cara analisis dibandingkan apel-dengan-apel pada 30 eksperimen yang SAMA.",
        "Cara membaca grafik di bawah: tinggi batang = jumlah eksperimen yang “menang” (signifikan) dari 30 — padahal efek sebenarnya nol, jadi semuanya false positive. Garis putus-putus = ekspektasi bila false positive benar-benar 5% (1,5 eksperimen).",
        "Interpretasi: cara “horizon tetap” menghasilkan 1 false positive — wajar untuk 5%. Cara “intip harian” menghasilkan 7 — hampir LIMA KALI lipat ekspektasi. Itu bukan sial; itu matematika peeking. Koreksi Bonferroni (ambang super ketat per intipan) menekan kembali ke 0.",
      ],
      tasks: [
        { id: "t1", text: "Buka `eksperimen_aa.csv`: catat jumlah eksperimen, jumlah hari, dan arti kolom kumulatif" },
        { id: "t2", text: "Pastikan kamu paham: mengapa SETIAP hasil signifikan di file ini otomatis false positive?" },
      ],
      figure: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="330" viewBox="0 0 640 330" role="img">
<rect x="0" y="0" width="640" height="330" fill="none"/>
<text x="320" y="24" text-anchor="middle" fill="#e8e6e3" font-size="15" font-weight="bold">False positive dari 30 eksperimen A/A (efek sebenarnya = NOL)</text>
<g stroke="#3a3a3a" stroke-width="1">
<line x1="60" y1="250" x2="600" y2="250"/><line x1="60" y1="200" x2="600" y2="200"/>
<line x1="60" y1="150" x2="600" y2="150"/><line x1="60" y1="100" x2="600" y2="100"/>
<line x1="60" y1="50" x2="600" y2="50"/>
</g>
<line x1="60" y1="212.5" x2="600" y2="212.5" stroke="#d9a441" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="596" y="206" text-anchor="end" fill="#d9a441" font-size="11">ekspektasi 5% (1,5)</text>
<g fill="#8a8a8a" font-size="11" text-anchor="end">
<text x="55" y="254">0</text><text x="55" y="204">2</text><text x="55" y="154">4</text><text x="55" y="104">6</text>
</g>
<g>
<rect x="115" y="225" width="90" height="25" fill="#45b8a8"/>
<rect x="275" y="75" width="90" height="175" fill="#c25b5b"/>
<rect x="435" y="249" width="90" height="1" fill="#45b8a8"/>
</g>
<g fill="#e8e6e3" font-size="13" font-weight="bold" text-anchor="middle">
<text x="160" y="218">1</text><text x="320" y="68">7</text><text x="480" y="242">0</text>
</g>
<g fill="#e8e6e3" font-size="12" text-anchor="middle">
<text x="160" y="272">Horizon tetap</text><text x="160" y="288" fill="#8a8a8a" font-size="11">uji sekali, hari ke-28</text>
<text x="320" y="272">Intip harian</text><text x="320" y="288" fill="#8a8a8a" font-size="11">berhenti saat pertama hijau</text>
<text x="480" y="272">Bonferroni</text><text x="480" y="288" fill="#8a8a8a" font-size="11">ambang |z| &gt; 3,12</text>
</g>
</svg>`,
        alt: "Diagram batang: false positive per metode analisis pada 30 eksperimen A/A — horizon tetap 1, intip harian 7, Bonferroni 0",
        caption: "Data SINTETIS misi ini. Intip harian: 7 dari 30 “menang” padahal tidak ada efek — 23,3% false positive.",
      },
      note: {
        title: "Miskonsepsi #1: p < 0,05 berarti “95% yakin varian menang”",
        type: "pitfall",
        body: "SALAH — dan ini miskonsepsi paling mahal di eksperimen. p-value = peluang melihat data SEEKSTREM ini (atau lebih) JIKA sebenarnya tidak ada efek. p = 0,041 artinya: “bila varian sama saja dengan kontrol, data segila ini muncul 4,1% dari waktu.” Ia BUKAN peluang hipotesis benar, dan ia dihitung dengan asumsi kamu hanya menguji SEKALI. Uji 9 kali dan laporkan yang terbaik — angka 0,041 itu sudah tidak berarti apa-apa.",
      },
      reference:
        "eksperimen_aa.csv (30 eksperimen A/A × 28 hari, kumulatif, efek sebenarnya NOL). Tiga cara analisis diuji pada data yang SAMA; setiap “signifikan” = false positive yang tercatat.",
    },
    {
      id: "lab-peek",
      eyebrow: "Langkah 3 · Lab 1 — Ukur kerusakan akibat mengintip",
      title: "Seberapa parah 9 kali intipan?",
      prose: [
        "Sekarang ukur sendiri. Untuk tiap dari 30 eksperimen: (a) uji-z SEKALI pada data hari ke-28 (horizon tetap); (b) pindai hari 1–28 dan catat eksperimen yang PERNAH |z| > 1,96 (intip harian — berhenti di hari pertama yang hijau); (c) ulangi (b) dengan ambang Bonferroni yang super ketat. Hitung berapa “pemenang” yang dihasilkan tiap cara — ingat, semuanya false positive.",
        "Fakta yang akan kamu temukan: ada eksperimen yang “menang” di hari ke-1. Satu hari. Seribu pengunjung per lengan. Itulah noise yang dirayakan sebagai kemenangan bila kamu mengintip.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_eksperimen` dan `n_hari`" },
        { id: "t2", text: "Tulis `z_dua_proporsi`; hitung `fp_tetap` (uji sekali di hari ke-28)" },
        { id: "t3", text: "Hitung `fp_peek` (hari pertama |z| > 1,96 dalam 28 hari)" },
        { id: "t4", text: "Hitung `ambang_bonf` lalu `fp_bonferroni`" },
        { id: "t5", text: "Hitung `rasio_inflasi` = fp_peek / fp_tetap" },
      ],
      expected:
        "n_eksperimen=30, n_hari=28, fp_tetap=1, fp_peek=7, ambang_bonf=3,1237, fp_bonferroni=0, rasio_inflasi=7,0",
      formula: String.raw`z = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}(1-\hat{p})\left(\frac{1}{n_1}+\frac{1}{n_2}\right)}}`,
      formulaNote:
        "p̂1, p̂2 = proporsi konversi kumulatif tiap lengan sampai hari itu (konv/n); p̂ = proporsi gabungan (k1+k2)/(n1+n2); n1, n2 = pengunjung kumulatif tiap lengan. |z| > 1,96 = signifikan pada alpha 5% dua sisi. Contoh: di hari ke-9 satu eksperimen mencatat z = 2,04 — hijau di dashboard, padahal efek sebenarnya nol.",
      note: {
        title: "Miskonsepsi #2: berhenti saat signifikan = efisien",
        type: "pitfall",
        body: "“Kenapa menunggu 28 hari kalau hari ke-9 sudah signifikan? Itu buang waktu.” SALAH — itu tepatnya peeking. Berhenti HANYA saat hijau berarti kamu memberi noise 28 kesempatan untuk terlihat seperti sinyal, tapi tidak memberi sinyal 28 kesempatan yang setara. Hasilnya: 23,3% false positive, bukan 5%. Efisiensi sejati = sequential testing dengan ambang yang disesuaikan, bukan berhenti saat senang.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — URL sudah disiapkan.",
        "Uji-z: terjemahkan rumus di atas dengan `math.sqrt`; hati-hati pembagian dengan nol tidak terjadi di data ini.",
        "Horizon tetap: `g.iloc[-1]` untuk tiap grup `df.groupby(\"eksperimen_id\")` — uji SEKALI per eksperimen.",
        "Peek: loop `g.iterrows()` dari hari pertama; `return True` pada |z| > 1,96 pertama.",
        "Bonferroni: `NormalDist().inv_cdf(1 - 0.05/2/28)` lalu `round(..., 4)` — ambang dua sisi untuk 28 intipan.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "import math",
          "from statistics import NormalDist",
          "",
          "URL = \"/misi/misi-ab-berhenti-dini/eksperimen_aa.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_eksperimen = ...",
          "n_hari = ...",
          "",
          "def z_dua_proporsi(k1, n1, k2, n2):",
          "    ...",
          "",
          "def uji_tetap(g):",
          "    ...",
          "",
          "fp_tetap = ...",
          "",
          "def uji_peek(g):",
          "    ...",
          "",
          "fp_peek = ...",
          "",
          "ambang_bonf = ...",
          "",
          "def uji_bonferroni(g):",
          "    ...",
          "",
          "fp_bonferroni = ...",
          "",
          "rasio_inflasi = ...",
          "",
          "print(\"eksperimen:\", n_eksperimen, \"| hari:\", n_hari)",
          "print(\"false positive horizon tetap:\", fp_tetap)",
          "print(\"false positive intip harian:\", fp_peek)",
          "print(\"ambang Bonferroni:\", ambang_bonf, \"| false positive Bonferroni:\", fp_bonferroni)",
          "print(\"rasio inflasi:\", rasio_inflasi)",
          "",
        ].join("\n"),
        lockLines: 10,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "import math",
          "from statistics import NormalDist",
          "",
          "URL = \"/misi/misi-ab-berhenti-dini/eksperimen_aa.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_eksperimen = int(df[\"eksperimen_id\"].nunique())",
          "n_hari = int(df[\"hari\"].max())",
          "",
          "def z_dua_proporsi(k1, n1, k2, n2):",
          "    p1 = k1 / n1",
          "    p2 = k2 / n2",
          "    p_pool = (k1 + k2) / (n1 + n2)",
          "    se = math.sqrt(p_pool * (1 - p_pool) * (1 / n1 + 1 / n2))",
          "    return (p1 - p2) / se",
          "",
          "def uji_tetap(g):",
          "    b = g.iloc[-1]",
          "    z = z_dua_proporsi(b[\"konv_kontrol\"], b[\"n_kontrol\"], b[\"konv_varian\"], b[\"n_varian\"])",
          "    return abs(z) > 1.96",
          "",
          "fp_tetap = sum(1 for _, g in df.groupby(\"eksperimen_id\") if uji_tetap(g))",
          "",
          "def uji_peek(g):",
          "    for _, b in g.iterrows():",
          "        z = z_dua_proporsi(b[\"konv_kontrol\"], b[\"n_kontrol\"], b[\"konv_varian\"], b[\"n_varian\"])",
          "        if abs(z) > 1.96:",
          "            return True",
          "    return False",
          "",
          "fp_peek = sum(1 for _, g in df.groupby(\"eksperimen_id\") if uji_peek(g))",
          "",
          "ambang_bonf = round(NormalDist().inv_cdf(1 - 0.05 / 2 / 28), 4)",
          "",
          "def uji_bonferroni(g):",
          "    for _, b in g.iterrows():",
          "        z = z_dua_proporsi(b[\"konv_kontrol\"], b[\"n_kontrol\"], b[\"konv_varian\"], b[\"n_varian\"])",
          "        if abs(z) > ambang_bonf:",
          "            return True",
          "    return False",
          "",
          "fp_bonferroni = sum(1 for _, g in df.groupby(\"eksperimen_id\") if uji_bonferroni(g))",
          "",
          "rasio_inflasi = round(fp_peek / fp_tetap, 2)",
          "",
          "print(\"eksperimen:\", n_eksperimen, \"| hari:\", n_hari)",
          "print(\"false positive horizon tetap:\", fp_tetap)",
          "print(\"false positive intip harian:\", fp_peek)",
          "print(\"ambang Bonferroni:\", ambang_bonf, \"| false positive Bonferroni:\", fp_bonferroni)",
          "print(\"rasio inflasi:\", rasio_inflasi)",
          "",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari eksperimen_aa.csv." },
          { kind: "equal", task: "t1", label: "`n_eksperimen` = 30", name: "n_eksperimen", value: 30, msg: "File punya 30 eksperimen A/A." },
          { kind: "equal", task: "t1", label: "`n_hari` = 28", name: "n_hari", value: 28, msg: "Tiap eksperimen berjalan 28 hari." },
          { kind: "equal", task: "t2", label: "`fp_tetap` = 1", name: "fp_tetap", value: 1, msg: "Uji SEKALI di hari ke-28: 1 dari 30 signifikan (3,3%) — wajar untuk alpha 5%." },
          { kind: "equal", task: "t3", label: "`fp_peek` = 7", name: "fp_peek", value: 7, msg: "Intip tiap hari, berhenti di hijau pertama: 7 dari 30 “menang” (23,3%). Pindai hari 1–28 per eksperimen." },
          { kind: "equal", task: "t4", label: "`ambang_bonf` = 3,1237", name: "ambang_bonf", value: 3.1237, tol: 0.001, msg: "round(NormalDist().inv_cdf(1 - 0.05/2/28), 4) — ambang dua sisi untuk 28 intipan." },
          { kind: "equal", task: "t4", label: "`fp_bonferroni` = 0", name: "fp_bonferroni", value: 0, msg: "Dengan ambang 3,12 tidak satu pun “menang” — harga dari koreksi konservatif." },
          { kind: "equal", task: "t5", label: "`rasio_inflasi` = 7,0", name: "rasio_inflasi", value: 7.0, tol: 0.01, msg: "fp_peek / fp_tetap = 7 — mengintip melipatgandakan false positive 7×." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — False positive dalam satu query",
      title: "Tiga metode, satu tabel",
      prose: [
        "PM tidak membaca notebook — ia membaca tabel. Di tabel kecil ini (sudah diagregasi dari Lab 1), hitung false positive rate tiap metode analisis dalam satu query. Karena ini data A/A, setiap “signifikan” = false positive — jadi FPR = n_signifikan / n_eksperimen.",
        "Tabel `ringkasan_metode(metode TEXT, n_eksperimen INT, n_signifikan INT)`. Tampilkan metode, n_signifikan, fpr_pct — urut dari FPR tertinggi.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query FPR per metode, urut dari fpr_pct tertinggi" },
      ],
      expected: "3 baris — peek (7; 23,3%), tetap (1; 3,3%), bonferroni (0; 0,0%)",
      sqlLab: {
        task: "Untuk tiap metode tampilkan metode, n_signifikan, dan FPR (%) = 100*n_signifikan/n_eksperimen (1 desimal). Urut dari FPR TERTINGGI.",
        schema: "CREATE TABLE ringkasan_metode(metode TEXT, n_eksperimen INT, n_signifikan INT);",
        seedData: [
          "INSERT INTO ringkasan_metode VALUES",
          "('tetap',30,1),",
          "('peek',30,7),",
          "('bonferroni',30,0);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT metode\nFROM ringkasan_metode\n",
        solution: [
          "SELECT metode, n_signifikan,",
          "  ROUND(100.0*n_signifikan/n_eksperimen, 1) AS fpr_pct",
          "FROM ringkasan_metode",
          "ORDER BY fpr_pct DESC;",
        ].join("\n"),
        expectedColumns: ["metode", "n_signifikan", "fpr_pct"],
        expectedRows: [
          ["peek", 7, 23.3],
          ["tetap", 1, 3.3],
          ["bonferroni", 0, 0.0],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiAbBerhentiDini;

// ── lanjutan misiAbBerhentiDini: langkah 5–12 ────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_AB: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Ship hari ini atau tunggu?",
    prose: [
      "Angkanya lengkap di tanganmu. Pada 30 eksperimen TANPA efek, kebiasaan tim (intip tiap hari, berhenti saat hijau) menghasilkan 23,3% false positive — 7× lipat dari yang dijanjikan dashboard. Eksperimen PM “menang” di hari ke-9 dengan p = 0,041 — pola yang persis sama dengan 7 false positive di lab-mu. PM menunggu jawabanmu sebelum makan siang.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke PM atas varian B yang “menang” di hari ke-9? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-ship",
          label: "Ship sekarang — p < 0,05, momentum penting",
          rationale:
            "p = 0,041 < 0,05 adalah kriteria yang disepakati tim. Menunda ship yang sudah signifikan berarti membiarkan kompetitor bergerak duluan demi purisme statistik.",
          nextStepId: "konsekuensi-ship",
          consequenceNote:
            "Varian B ship ke 100%. Tiga bulan kemudian metriknya datar — tidak ada +12% apa pun. Rollback memakan 2 sprint, dan kepercayaan tim pada eksperimen anjlok: “data bisa bilang apa saja”. Kamu benar secara prosedural; noise yang kamu ship tidak peduli prosedur.",
        },
        {
          id: "opt-tunggu",
          label: "Tunggu horizon 28 hari — keputusan di akhir, bukan di tengah",
          rationale:
            "Desain eksperimen berkata 28 hari; p-value hanya valid bila dibaca sekali di akhir. Kemenangan hari ke-9 adalah kandidat false positive sampai hari ke-28 membuktikannya.",
          nextStepId: "konsekuensi-tunggu",
          consequenceNote:
            "Eksperimen berjalan penuh. Hari ke-28: p = 0,31 — tidak signifikan. Varian B tidak di-ship; tim terhindar dari rollback 2 sprint. PM kesal 19 hari, lalu berterima kasih 3 bulan.",
        },
        {
          id: "opt-sequential",
          label: "Lanjut dengan desain sequential — berhenti dini hanya bila melewati ambang ketat",
          rationale:
            "Berhenti dini boleh, asal aturannya disepakati SEBELUM eksperimen: ambang alpha spending (mis. Bonferroni 3,12) yang menjaga false positive tetap 5% meski mengintip.",
          nextStepId: "konsekuensi-sequential",
          consequenceNote:
            "Tim menyepakati ambang sequential sebelum lanjut. Varian B tidak pernah menyentuh 3,12 — eksperimen selesai di hari ke-28 tanpa ship. Mulai kuartal depan semua eksperimen tim memakai desain sequential; dashboard hijau kini berarti sesuatu yang sesungguhnya.",
        },
      ],
    },
  },
  {
    id: "konsekuensi-ship",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: ship hari ini",
    prose: [
      "Varian B meluncur ke 100% pengguna sore itu juga — lengkap dengan pengumuman “+12% conversion” di grup. Tiga bulan kemudian: metriknya datar. Tidak ada +12% apa pun. Yang di-ship adalah noise hari ke-9 yang kebetulan hijau.",
      "Biayanya bukan cuma rollback 2 sprint. Yang lebih mahal: tim sekarang percaya “data bisa bilang apa saja” — dan orang yang berhenti percaya pada eksperimen akan kembali mengambil keputusan dengan firasat. Satu ship yang prematur meracuni budaya eksperimen bertahun-tahun.",
    ],
    tasks: [],
    note: {
      title: "False positive yang di-ship membayar dua kali",
      body: "Pertama saat rollback (biaya engineering). Kedua saat kepercayaan hilang (biaya budaya). Itulah kenapa false positive 23,3% bukan “angka statistik” — ia adalah 23,3% keputusan produk yang salah.",
    },
  },
  {
    id: "konsekuensi-tunggu",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: tunggu 28 hari",
    prose: [
      "PM kesal — 19 hari menunggu untuk “kepastian”. Hari ke-28 tiba: p = 0,31. Tidak signifikan. Varian B tidak di-ship, tidak ada rollback, tidak ada pengumuman yang harus ditarik. Tiga bulan kemudian PM mengaku: “Untung kita tunggu.”",
      "Harga yang kamu bayar nyata: 19 hari “kecepatan” yang dikorbankan. Tapi kecepatan menuju keputusan yang salah bukan kecepatan — itu kecelakaan yang dipercepat.",
    ],
    tasks: [],
    note: {
      title: "Disiplin horizon adalah asuransi termurah",
      body: "Menunggu 28 hari terasa mahal di minggu ke-2 dan terasa murah di bulan ke-3. Asuransi selalu begitu: dibayar di muka, dihargai belakangan.",
    },
  },
  {
    id: "konsekuensi-sequential",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: sequential testing",
    prose: [
      "Tim menyepakati aturan SEBELUM melanjutkan: berhenti dini hanya bila |z| > 3,12 (ambang Bonferroni untuk 28 intipan). Varian B — yang “menang” di 2,04 — tidak pernah mendekati ambang itu. Eksperimen selesai di hari ke-28 tanpa ship, tanpa drama.",
      "Mulai kuartal depan, semua eksperimen tim memakai desain sequential. Dashboard hijau kini berarti sesuatu yang sesungguhnya — karena aturannya ditulis sebelum datanya dilihat.",
    ],
    tasks: [],
    note: {
      title: "Aturan berhenti ditulis sebelum data dilihat",
      body: "Inilah pembeda sequential testing vs peeking: bukan “apakah kamu mengintip”, melainkan “apakah ambang intipanmu disepakati sebelum eksperimen”. Peeking = aturan dibuat setelah melihat hijau. Sequential = aturan dibuat sebelum melihat apa pun.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 16 baris: laporan eksperimen yang “signifikan” itu bocor",
    prose: [
      "Sebelum menulis rekomendasi, satu misi audit. Di bawah ini 16 baris “Laporan Eksperimen EXP-07 — Dashboard Vendor”, dokumen yang dipakai PM untuk menuntut ship hari ini. Seseorang menyuntikkan 4 kebocoran ke dalamnya. Senjatamu: angka Lab 1 dan Lab 2 — dan ingatan bahwa p = 0,041 yang dirayakan itu dihitung pada hari ke-9, saat tim berhenti mengintip.",
    ],
    tasks: [],
    auditDossier: {
      version: "ab-m2b-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai Laporan Eksperimen EXP-07 dari dashboard vendor yang dipakai PM sebagai dasar tuntutan ship hari ini (varian B “menang” di hari ke-9, p = 0,041).",
      columns: ["Eksperimen", "Metrik", "Nilai", "Klaim"],
      rows: [
        { rowId: 1, cells: { "Eksperimen": "EXP-07", "Metrik": "Metrik utama (protokol)", "Nilai": "conversion rate", "Klaim": "Dokumen desain eksperimen" }, claims: [{ label: "Sumber", value: "Disepakati sebelum jalan" }] },
        { rowId: 2, cells: { "Eksperimen": "EXP-07", "Metrik": "Horizon analisis", "Nilai": "28 hari", "Klaim": "Dokumen desain eksperimen" }, claims: [{ label: "Sumber", value: "Disepakati sebelum jalan" }] },
        { rowId: 3, cells: { "Eksperimen": "EXP-07", "Metrik": "Alpha", "Nilai": "0,05", "Klaim": "Dokumen desain eksperimen" }, claims: [{ label: "Sumber", value: "Dua sisi" }] },
        { rowId: 4, cells: { "Eksperimen": "EXP-07", "Metrik": "n kontrol (kumulatif)", "Nilai": "28.000", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-28" }] },
        // ── I3: sample ratio mismatch ──
        { rowId: 5, cells: { "Eksperimen": "EXP-07", "Metrik": "n varian (kumulatif)", "Nilai": "21.500", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-28" }] },
        { rowId: 6, cells: { "Eksperimen": "EXP-07", "Metrik": "Randomisasi", "Nilai": "50/50 seimbang", "Klaim": "Sesuai protokol" }, claims: [{ label: "Status", value: "Diklaim seimbang" }] },
        // ── I1: p-value dihitung pada hari berhenti ──
        { rowId: 7, cells: { "Eksperimen": "EXP-07", "Metrik": "p-value", "Nilai": "0,041", "Klaim": "Dihitung pada hari ke-9, saat berhenti" }, claims: [{ label: "Catatan", value: "Uji dilakukan tiap hari" }] },
        { rowId: 8, cells: { "Eksperimen": "EXP-07", "Metrik": "Keputusan", "Nilai": "Ship", "Klaim": "p < 0,05" }, claims: [{ label: "Dasar", value: "Kriteria tim" }] },
        { rowId: 9, cells: { "Eksperimen": "EXP-07", "Metrik": "Pendapatan varian", "Nilai": "Rp 412,6 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-28" }] },
        // ── I4: baris ganda ──
        { rowId: 10, cells: { "Eksperimen": "EXP-07", "Metrik": "Pendapatan varian", "Nilai": "Rp 412,6 jt", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-28" }] },
        // ── I2: metrik diganti setelah hasil keluar ──
        { rowId: 11, cells: { "Eksperimen": "EXP-07", "Metrik": "Metrik dilaporkan", "Nilai": "revenue per visitor", "Klaim": "Diganti 12 Okt, setelah hasil keluar" }, claims: [{ label: "Catatan", value: "Beda dari protokol" }] },
        { rowId: 12, cells: { "Eksperimen": "EXP-07", "Metrik": "conversion kontrol", "Nilai": "10,2%", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-9" }] },
        { rowId: 13, cells: { "Eksperimen": "EXP-07", "Metrik": "conversion varian", "Nilai": "11,4%", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-9" }] },
        { rowId: 14, cells: { "Eksperimen": "—", "Metrik": "Praktik tim", "Nilai": "—", "Klaim": "Dashboard diintip tiap pagi" }, claims: [{ label: "Status", value: "Kebiasaan, bukan prosedur" }] },
        { rowId: 15, cells: { "Eksperimen": "EXP-07", "Metrik": "z-statistik", "Nilai": "2,04", "Klaim": "Tercatat" }, claims: [{ label: "Status", value: "Hari ke-9" }] },
        { rowId: 16, cells: { "Eksperimen": "—", "Metrik": "Rekomendasi", "Nilai": "—", "Klaim": "Ship ke 100%" }, claims: [{ label: "Dasar", value: "p = 0,041 < 0,05" }] },
      ],
      injections: [
        { key: "p-saat-berhenti", rowIds: [7], title: "p-value dihitung pada hari berhenti", clue: "p = 0,041 “dihitung pada hari ke-9, saat berhenti” — dengan “uji dilakukan tiap hari”. p-value uji fixed-horizon hanya valid bila dibaca SEKALI sesuai desain (hari ke-28). Setelah 9 kali intipan, peluang false positive bukan 5% lagi — di lab-mu: 23,3%. Angka 0,041 ini adalah harga dari 9 tiket lotre, bukan satu.", danger: "p-value pasca-peeking adalah angka yang terlihat ilmiah tapi kehilangan maknanya. Di pekerjaan nyata, inilah cara “kemenangan” palsu lolos review: angkanya benar, prosedurnya yang merusaknya." },
        { key: "ganti-metrik", rowIds: [1, 11], title: "Metrik utama diganti setelah hasil keluar", clue: "Protokol (baris 1): conversion rate, disepakati SEBELUM jalan. Yang dilaporkan (baris 11): revenue per visitor — “diganti 12 Okt, setelah hasil keluar”. Mengganti metrik setelah melihat data = satu bentuk peeking lagi: memilih lensa yang membuat hasil terlihat hijau.", danger: "Metric switching menggandakan peluang false positive secara diam-diam: tiap metrik alternatif adalah satu “intipan” tambahan yang tidak tercatat." },
        { key: "rasio-sampel", rowIds: [4, 5, 6], title: "Sample ratio mismatch: 50/50 yang tidak 50/50", clue: "n kontrol 28.000 vs n varian 21.500 = 56,6% vs 43,4% — tapi baris 6 mengklaim “50/50 seimbang”. Selisih 6,6 poin pada 49.500 pengguna tidak bisa dijelaskan oleh noise acak; randomisasinya rusak (biasanya bug assignment atau filter pasca-randomisasi).", danger: "SRM berarti kedua lengan tidak lagi sebanding — SEMUA perbandingan setelahnya cacat, tidak peduli seberapa hijau p-value-nya. Cek SRM adalah langkah pertama sebelum membaca hasil apa pun." },
        { key: "baris-ganda", rowIds: [9, 10], title: "Pendapatan varian tercatat dua kali", clue: "Baris 9 dan 10 identik persis — Rp 412,6 jt dua kali. Klasik duplikat: total pendapatan di laporan ini digelembungkan 2× untuk baris tersebut. Obatnya sama seperti di misi lain: agregasi + constraint unik sebelum percaya total.", danger: "Duplikat di laporan eksperimen membuat “dampak bisnis” kemenangan terlihat dua kali lipat — memperkuat tekanan untuk ship sesuatu yang seharusnya tidak di-ship." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Rekomendasi ship untuk PM",
    prose: [
      "Semua bukti di tangan. Tulis rekomendasi satu halaman untuk PM — artefak portofoliomu. Rekomendasi yang baik tidak hanya bilang “jangan ship”, tapi menunjukkan ANGKA kerusakan peeking, apa yang bocor di laporan EXP-07, dan desain eksperimen seperti apa yang membuat “hijau” berikutnya bisa dipercaya.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): vonis atas kemenangan hari ke-9; rekomendasi ship/tidak.",
        "Bukti kuantitatif: false positive 1 vs 7 vs 0 dari 30 eksperimen A/A; rasio inflasi 7,0; ambang Bonferroni 3,1237 vs z teramati 2,04.",
        "Temuan audit laporan EXP-07: kebocoran apa yang kamu temukan, baris per baris, dan bagaimana tiap kebocoran merusak kepercayaan pada “kemenangan”.",
        "Rekomendasi: apa yang harus terjadi pada varian B (rujuk keputusanmu di Langkah 5) + desain sequential testing untuk eksperimen berikutnya (aturan berhenti, ambang, siapa yang boleh mengintip).",
        "Batas & risiko sisa: data SINTETIS A/A (efek nol oleh desain); Bonferroni konservatif (bisa melewatkan efek kecil yang nyata); hasil satu simulasi, bukan hukum alam.",
      ],
      rubric: [
        { criterion: "Kebenaran analisis peeking", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "fp_tetap=1, fp_peek=7, fp_bonferroni=0, rasio 7,0 — semua tepat dengan interpretasi"] },
        { criterion: "Deteksi kebocoran", weight: 25, levels: ["Tidak menyebut kebocoran", "Menyebut sebagian tanpa baris bukti", "Keempat kebocoran disebut dengan nomor baris + penjelasan efeknya pada vonis"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa aturan berhenti", "Ada rekomendasi, aturan kabur", "Rekomendasi + desain sequential konkret (ambang, kapan boleh berhenti, guardrail SRM)"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim simulasi = bukti universal", "Menyebut sebagian batas", "Batas (SINTETIS A/A, Bonferroni konservatif, satu simulasi) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat kebocoran di laporan EXP-07:",
      "1) **p-value dihitung pada hari berhenti** (baris 7): 0,041 setelah 9 kali intipan. Itu bukan “peluang salah 4,1%” — itu harga 9 tiket lotre. Di lab-mu, prosedur yang sama menghasilkan 23,3% false positive.",
      "2) **Metrik diganti setelah hasil keluar** (baris 1, 11): protokol berkata conversion rate; laporan menyajikan revenue per visitor. Tiap metrik alternatif = satu intipan tak tercatat.",
      "3) **Sample ratio mismatch** (baris 4–6): 28.000 vs 21.500 diklaim “50/50 seimbang”. Randomisasi yang rusak meracuni SEMUA perbandingan — tidak peduli sehijau apa p-value-nya.",
      "4) **Baris ganda** (baris 9–10): Rp 412,6 jt tercatat dua kali — “dampak bisnis” kemenangan digelembungkan 2×, memperkuat tekanan ship.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu membaca laporan eksperimen seperti auditor (cek prosedur, cek randomisasi, cek konsistensi) atau seperti penonton dashboard (hijau = menang). Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — menunggu 28 hari membayar dengan “kecepatan”, ship prematur membayar dengan rollback + kepercayaan.",
      "Bahaya nyata terakhir: peeking tidak terlihat seperti kecurangan. Ia terlihat seperti “rajin memantau data”. Itulah kenapa ia menjadi cara paling umum eksperimen berbohong di industri — bukan karena orang jahat, melainkan karena dashboard selalu terbuka dan ambang hijau selalu menggoda.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: sequential testing = peeking yang dilegalkan",
      type: "risk",
      body: "Bukan. Peeking = berhenti saat SENANG (aturan dibuat setelah melihat data). Sequential testing = berhenti saat ATURAN terpenuhi (ambang disepakati sebelum data dilihat, false positive tetap terjaga). Bedanya bukan pada “mengintip atau tidak” — melainkan pada kapan aturannya ditulis.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Pada 30 eksperimen A/A (efek = NOL): horizon tetap → 1 false positive (3,3%); intip harian → 7 (23,3%); Bonferroni (|z| > 3,1237) → 0. Rasio inflasi peeking = 7,0.",
      "p-value hanya bermakna bila dibaca sesuai desain (sekali, di akhir). Tiap intipan tambahan adalah tiket lotre baru — p = 0,041 setelah 9 intipan bukan “peluang salah 4,1%”.",
      "Empat kebocoran laporan EXP-07: p-value dihitung saat berhenti, metrik diganti pasca-hasil, sample ratio mismatch (56,6% vs 43,4%), baris pendapatan ganda.",
      "Keputusan atas kemenangan dini selalu punya harga: ship (rollback + kepercayaan), tunggu 28 hari (korban “kecepatan”), sequential (aturan disepakati sebelum data).",
      "Data: SINTETIS 100% (simulasi Python, seed 42), 30 × 28 hari × 1.000 pengunjung/lengan, dibekukan 2026-10-15 — efek nol oleh desain agar false positive terukur; Bonferroni konservatif dan bisa melewatkan efek kecil yang nyata.",
    ],
  },
];

(misiAbBerhentiDini.steps as V2Step[]).push(...LANJUTAN_AB);
