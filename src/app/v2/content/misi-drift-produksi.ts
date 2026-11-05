import type { V2Mission } from "../lib/types";

// ── MISI DRIFT: Model yang Kedaluwarsa Diam-Diam ─────────────────────────
// M2 — MLOps Misi A (solo). Dataset SINTETIS (generator numpy, seed 42):
// log serving mingguan 10 minggu (distribusi 4 fitur + akurasi proxy).
// File: public/misi/misi-drift-produksi/distribusi_mingguan.csv (240 baris) +
// akurasi_mingguan.csv (10 baris). Metode: METODE.md.

const BASE = "/misi/misi-drift-produksi";

export const misiDrift: V2Mission = {
  slug: "misi-drift-produksi",
  track: "MLOps",
  module: "Misi",
  title: "Misi Drift: Model yang Kedaluwarsa Diam-Diam",
  estMinutes: 150,
  role: "MLOps engineer",
  client:
    "Head of Data Science — dashboard monitoring mengklaim “tidak ada drift”, tapi akurasi bisnis turun tiga bulan terakhir",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Lampu hijau yang terlalu sempurna",
      prose: [],
      tasks: [],
      briefing: {
        role: "MLOps engineer — pemilik pipeline monitoring model skoring kredit di produksi",
        client:
          "Head of Data Science. Model skoring kredit sudah 8 bulan di produksi. Dashboard monitoring internal mengklaim “tidak ada drift” — semua lampu hijau. Tapi tim bisnis melaporkan keputusan model memburuk tiga bulan terakhir: approval yang berujung macet naik. Kamu diminta audit independen: hitung ulang drift dari log serving mentah, uji secara statistik, dan putuskan nasib model ini.",
        story: [
          "Senin, 09:00. Slack dari Head of Data Science: “Dashboard kita hijau semua, tapi NPL naik 2 poin dalam 3 bulan. Salah satu dari dua ini berbohong — dashboard atau data bisnis. Cari tahu yang mana.” Kamu buka dashboard monitoring: PSI agregat 0,23, ambang 0,35, status “SEHAT”. Lampu hijau yang sempurna. Terlalu sempurna.",
          "Kamu tahu pola ini. Dashboard yang tidak pernah merah bukanlah dashboard yang bagus — itu dashboard yang tidak mengukur apa-apa. Model yang dilatih pada populasi 2024 kini melayani populasi yang sudah bergeser: distribusi skor kredit internal nasabah baru berbeda dari data training, tapi tidak ada yang membandingkan distribusi per fitur — yang ada hanya satu angka agregat.",
          "Misi ini memakai data SINTETIS: log serving mingguan selama 10 minggu (distribusi 4 fitur per minggu + akurasi proxy). Tugasmu: hitung PSI dan uji KS per fitur dari data mentah, temukan sabotase di dashboard monitoring, dan putuskan — retrain segera, rollback, atau pantau dengan ambang baru.",
        ],
        objectives: [
          "Menghitung PSI per fitur per minggu dari log serving mentah dan mengidentifikasi fitur yang melewati ambang 0,1 (pergeseran kecil) dan 0,25 (pergeseran besar).",
          "Menguji pergeseran distribusi dengan uji Kolmogorov-Smirnov dua sampel dan membandingkan kesimpulannya dengan PSI.",
          "Menemukan keempat sabotase di dashboard monitoring dan menulis laporan insiden + rencana monitoring dengan ambang tindakan eksplisit.",
        ],
        prereqSummary:
          "PSI (Population Stability Index) mengukur seberapa jauh distribusi data produksi bergeser dari distribusi referensi: di bawah 0,1 berarti stabil, 0,1–0,25 pergeseran kecil, di atas 0,25 pergeseran besar. Uji Kolmogorov-Smirnov membandingkan dua distribusi secara statistik — D besar dengan p-value kecil berarti pergeserannya nyata, bukan noise sampling. Reference window adalah distribusi pembandingnya: kalau ia basi dan tidak pernah diperbarui, semua perbandingan ikut basi.",
        datasetNote:
          "Sumber: SINTETIS — generator Python (numpy, seed 42), BUKAN data produksi nyata.\nFile distribusi_mingguan.csv: 240 baris = 10 minggu × 4 fitur × 6 bin (kolom minggu, fitur, bin, n_ref, n_cur; n_ref = 2000 sampel populasi referensi, n_cur ≈ 1000 sampel minggu berjalan).\nFile akurasi_mingguan.csv: 10 baris akurasi proxy mingguan.\nPola drift dirancang: skor_kredit_internal bergeser mulai minggu 5, pendapatan mulai minggu 7, dua fitur lain stabil. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Log mentah vs klaim dashboard",
      prose: [
        "Dua file menunggumu. `distribusi_mingguan.csv` adalah kebenaran mentah: untuk tiap minggu dan tiap fitur, 6 bin distribusi dengan jumlah sampel referensi (`n_ref`, populasi training) dan jumlah sampel minggu berjalan (`n_cur`). Dari sinilah PSI dan uji KS dihitung — bukan dari angka jadi siapa pun.",
        "`akurasi_mingguan.csv` adalah cermin bisnisnya: akurasi proxy model per minggu. Inilah angka yang dikeluhkan tim bisnis — dan yang tidak pernah muncul di dashboard monitoring.",
        "Aturan main: (1) drift dihitung dari file mentah, per fitur, per minggu — tidak ada agregat sebelum waktunya; (2) ambang baku industri: PSI < 0,1 stabil, 0,1–0,25 pergeseran kecil, > 0,25 pergeseran besar; (3) vonis “ada/tidak ada drift” diambil dari angka, bukan dari warna lampu dashboard.",
      ],
      tasks: [
        { id: "t1", text: "Buka `distribusi_mingguan.csv`: catat 4 nama fitur dan rentang minggu" },
        { id: "t2", text: "Buka `akurasi_mingguan.csv`: catat tren akurasi proxy dari minggu 1 ke minggu 10" },
      ],
      note: {
        title: "Miskonsepsi #1: dashboard hijau = model sehat",
        type: "pitfall",
        body: "“Semua lampu hijau, berarti model baik-baik saja.” SALAH — dan kesalahpahaman ini mahal. Hijau hanya berarti “di bawah ambang yang ditetapkan”. Kalau ambangnya dinaikkan diam-diam, atau metriknya diagregasi sampai sinyalnya hilang, hijau = buta. Dashboard tidak berbohong tentang angkanya; ia berbohong tentang apa yang TIDAK ditampilkannya.",
      },
      reference:
        "Data SINTETIS (seed 42): distribusi_mingguan.csv (240 baris, mentah) vs akurasi_mingguan.csv (cermin bisnis). Drift dihitung dari yang mentah; vonis untuk klaim “SEHAT” milik dashboard.",
    },
    {
      id: "lab-drift",
      eyebrow: "Langkah 3 · Lab 1 — PSI & uji KS",
      title: "Fitur mana yang bergeser?",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `distribusi_mingguan.csv`: hitung PSI per fitur untuk minggu ke-10 — bandingkan proporsi tiap bin minggu berjalan terhadap proporsi referensi. Lalu uji Kolmogorov-Smirnov: D = selisih kumulatif maksimum antara dua distribusi, dengan p-value dari deret Kolmogorov. Terakhir: tunjuk satu fitur yang terdrift.",
        "Rumus PSI sudah disiapkan di petunjuk — kamu tinggal menerjemahkannya ke kode. Ambang baku: 0,1 dan 0,25. Data ini tidak punya bin kosong, jadi tidak perlu trik smoothing.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; siapkan fungsi `psi` dan `ks_dan_p`" },
        { id: "t2", text: "Hitung `psi_skorkredit_w10`, `psi_pendapatan_w10`, `psi_umur_w10`" },
        { id: "t3", text: "Hitung KS (D dan p) untuk skor_kredit & umur di minggu 10; tentukan `fitur_terdrift`" },
      ],
      expected:
        "psi skor_kredit_internal minggu 10 = 0,7156 (> 0,25 → drift BESAR); pendapatan = 0,2107 (0,1–0,25 → drift kecil); umur_pemohon = 0,0092 (stabil). KS-D skor_kredit = 0,3474 (p ≈ 0 → signifikan); KS-D umur = 0,0255 (p = 0,77 → noise). Fitur terdrift: skor_kredit_internal.",
      formula: String.raw`PSI = \sum_{i=1}^{6} (a_i - e_i)\,\ln\left(\frac{a_i}{e_i}\right)`,
      formulaNote:
        "a_i = proporsi bin i pada minggu berjalan (n_cur / total n_cur), e_i = proporsi bin i pada referensi (n_ref / total n_ref). Abaikan bin berproporsi nol (tidak ada di data ini). Ambang: < 0,1 stabil; 0,1–0,25 pergeseran kecil; > 0,25 pergeseran besar. Untuk KS: D = max |kumulatif_cur − kumulatif_ref|; λ = D·√(n₁n₂/(n₁+n₂)); p ≈ 2·Σ(−1)ᵏ⁻¹·exp(−2k²λ²), k = 1..100.",
      note: {
        title: "Miskonsepsi #2: PSI kecil = tidak ada masalah",
        type: "pitfall",
        body: "“PSI agregat cuma 0,23, masih di bawah ambang 0,35 — aman.” SALAH. Agregat adalah rata-rata: satu fitur kritis dengan PSI 0,72 bisa tenggelam di antara tiga fitur stabil. Drift tidak menyerang semua fitur sekaligus — ia menyerang satu-dua fitur yang paling penting. Selalu hitung PER FITUR; agregat hanya untuk ringkasan, tidak pernah untuk vonis.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — kolom minggu/fitur/bin/n_ref/n_cur.",
        "Fungsi psi: ubah count jadi proporsi dulu (`n_cur / n_cur.sum()`), lalu terapkan rumus — pakai `numpy.log`.",
        "Pilih satu fitur satu minggu: `sub = df[(df['minggu']==10) & (df['fitur']=='skor_kredit_internal')].sort_values('bin')`.",
        "KS: D = `np.max(np.abs(np.cumsum(a) - np.cumsum(e)))`; p-value pakai deret di formulaNote dengan `math.exp` dan `math.sqrt`.",
        "n₁ = total n_cur, n₂ = total n_ref untuk minggu-fitur itu.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "import math",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-drift-produksi/distribusi_mingguan.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "def psi(n_cur, n_ref):",
          "    ...",
          "",
          "def ks_dan_p(n_cur, n_ref):",
          "    ...   # kembalikan (D, p)",
          "",
          "def ambil(fitur, minggu=10):",
          "    sub = df[(df[\"minggu\"] == minggu) & (df[\"fitur\"] == fitur)].sort_values(\"bin\")",
          "    return sub[\"n_cur\"].to_numpy(float), sub[\"n_ref\"].to_numpy(float)",
          "",
          "nc, nr = ambil(\"skor_kredit_internal\")",
          "psi_skorkredit_w10 = ...",
          "ksd_skorkredit_w10, ksp_skorkredit_w10 = ...",
          "",
          "nc, nr = ambil(\"pendapatan\")",
          "psi_pendapatan_w10 = ...",
          "",
          "nc, nr = ambil(\"umur_pemohon\")",
          "psi_umur_w10 = ...",
          "ksd_umur_w10, ksp_umur_w10 = ...",
          "",
          "fitur_terdrift = ...",
          "",
          "print(\"PSI skor_kredit w10:\", round(psi_skorkredit_w10, 4))",
          "print(\"PSI pendapatan w10:\", round(psi_pendapatan_w10, 4))",
          "print(\"PSI umur w10:\", round(psi_umur_w10, 4))",
          "print(\"KS skor_kredit: D =\", round(ksd_skorkredit_w10, 4), \"p =\", ksp_skorkredit_w10)",
          "print(\"KS umur: D =\", round(ksd_umur_w10, 4), \"p =\", round(ksp_umur_w10, 4))",
          "print(\"Fitur terdrift:\", fitur_terdrift)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "import math",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-drift-produksi/distribusi_mingguan.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "def psi(n_cur, n_ref):",
          "    a = n_cur / n_cur.sum()",
          "    e = n_ref / n_ref.sum()",
          "    m = (a > 0) & (e > 0)",
          "    return float(((a[m] - e[m]) * np.log(a[m] / e[m])).sum())",
          "",
          "def ks_dan_p(n_cur, n_ref):",
          "    a = n_cur / n_cur.sum()",
          "    e = n_ref / n_ref.sum()",
          "    d = float(np.max(np.abs(np.cumsum(a) - np.cumsum(e))))",
          "    n1, n2 = float(n_cur.sum()), float(n_ref.sum())",
          "    lam = d * math.sqrt(n1 * n2 / (n1 + n2))",
          "    s = sum(((-1) ** (k - 1)) * math.exp(-2 * k * k * lam * lam) for k in range(1, 101))",
          "    p = min(1.0, max(0.0, 2 * s))",
          "    return d, p",
          "",
          "def ambil(fitur, minggu=10):",
          "    sub = df[(df[\"minggu\"] == minggu) & (df[\"fitur\"] == fitur)].sort_values(\"bin\")",
          "    return sub[\"n_cur\"].to_numpy(float), sub[\"n_ref\"].to_numpy(float)",
          "",
          "nc, nr = ambil(\"skor_kredit_internal\")",
          "psi_skorkredit_w10 = psi(nc, nr)",
          "ksd_skorkredit_w10, ksp_skorkredit_w10 = ks_dan_p(nc, nr)",
          "",
          "nc, nr = ambil(\"pendapatan\")",
          "psi_pendapatan_w10 = psi(nc, nr)",
          "",
          "nc, nr = ambil(\"umur_pemohon\")",
          "psi_umur_w10 = psi(nc, nr)",
          "ksd_umur_w10, ksp_umur_w10 = ks_dan_p(nc, nr)",
          "",
          "fitur_terdrift = \"skor_kredit_internal\"",
          "",
          "print(\"PSI skor_kredit w10:\", round(psi_skorkredit_w10, 4))",
          "print(\"PSI pendapatan w10:\", round(psi_pendapatan_w10, 4))",
          "print(\"PSI umur w10:\", round(psi_umur_w10, 4))",
          "print(\"KS skor_kredit: D =\", round(ksd_skorkredit_w10, 4), \"p =\", ksp_skorkredit_w10)",
          "print(\"KS umur: D =\", round(ksd_umur_w10, 4), \"p =\", round(ksp_umur_w10, 4))",
          "print(\"Fitur terdrift:\", fitur_terdrift)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV distribusi." },
          { kind: "equal", task: "t2", label: "`psi_skorkredit_w10` ≈ 0,7156", name: "psi_skorkredit_w10", value: 0.7156, tol: 0.01, msg: "Jauh di atas 0,25 → drift BESAR. Periksa rumus PSI dan pemilihan baris minggu 10." },
          { kind: "equal", task: "t2", label: "`psi_pendapatan_w10` ≈ 0,2107", name: "psi_pendapatan_w10", value: 0.2107, tol: 0.01, msg: "Masuk zona 0,1–0,25 → drift kecil. Pastikan proporsi dihitung per minggu-fitur." },
          { kind: "equal", task: "t2", label: "`psi_umur_w10` ≈ 0,0092", name: "psi_umur_w10", value: 0.0092, tol: 0.005, msg: "Fitur stabil — PSI harus di bawah 0,1 (noise sampling saja)." },
          { kind: "equal", task: "t3", label: "`ksd_skorkredit_w10` ≈ 0,3474", name: "ksd_skorkredit_w10", value: 0.3474, tol: 0.01, msg: "D = selisih kumulatif maksimum antara distribusi minggu 10 dan referensi." },
          { kind: "equal", task: "t3", label: "`ksp_skorkredit_w10` ≈ 0", name: "ksp_skorkredit_w10", value: 0, tol: 0.01, msg: "Pergeseran sebesar ini tidak mungkin noise — p-value praktis nol." },
          { kind: "equal", task: "t3", label: "`ksd_umur_w10` ≈ 0,0255", name: "ksd_umur_w10", value: 0.0255, tol: 0.01, msg: "D kecil = distribusi nyaris identik dengan referensi." },
          { kind: "equal", task: "t3", label: "`ksp_umur_w10` ≈ 0,77", name: "ksp_umur_w10", value: 0.7705, tol: 0.05, msg: "p besar = tidak ada bukti pergeseran. Periksa deret Kolmogorov di formulaNote." },
          { kind: "equal", task: "t3", label: "`fitur_terdrift` benar", name: "fitur_terdrift", value: "skor_kredit_internal", msg: "Satu-satunya fitur yang melewati ambang drift besar (0,25)." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Kapan bisnisnya mulai turun?",
      title: "Angka yang tidak ada di dashboard",
      prose: [
        "Dashboard monitoring tidak menampilkan akurasi proxy — hanya metrik distribusi. Padahal tim bisnis mengeluh soal itu. Di tabel kecil ini (10 minggu akurasi proxy), saring minggu-minggu di mana akurasi turun di bawah 0,83.",
        "Tabel `akurasi(minggu INTEGER, acc_proxy REAL, n_prediksi INTEGER)`. Tampilkan minggu dan acc_proxy untuk baris dengan `acc_proxy < 0.83`, urut dari yang paling awal.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query minggu-minggu dengan acc_proxy < 0,83, urut dari paling awal" },
      ],
      expected: "4 baris — minggu 7 (0,8283), 8 (0,813), 9 (0,8004), 10 (0,7898). Akurasi turun 4 minggu beruntun sementara dashboard tetap hijau.",
      sqlLab: {
        task: "Saring minggu-minggu di mana akurasi proxy TURUN di bawah 0,83. Tampilkan minggu + acc_proxy, urut dari yang paling awal.",
        schema: "CREATE TABLE akurasi (minggu INTEGER, acc_proxy REAL, n_prediksi INTEGER);",
        seedData: [
          "INSERT INTO akurasi VALUES",
          "(1,0.8756,5113),",
          "(2,0.8584,4933),",
          "(3,0.8699,5122),",
          "(4,0.8593,5020),",
          "(5,0.8507,5191),",
          "(6,0.844,4919),",
          "(7,0.8283,5216),",
          "(8,0.813,5173),",
          "(9,0.8004,4915),",
          "(10,0.7898,4991);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT minggu, acc_proxy\nFROM akurasi\n",
        solution: [
          "SELECT minggu, acc_proxy",
          "FROM akurasi",
          "WHERE acc_proxy < 0.83",
          "ORDER BY minggu;",
        ].join("\n"),
        expectedColumns: ["minggu", "acc_proxy"],
        expectedRows: [
          [7, 0.8283],
          [8, 0.813],
          [9, 0.8004],
          [10, 0.7898],
        ],
        orderMatters: true,
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 5 · Checkpoint keputusan",
      title: "Model yang kedaluwarsa ini mau kamu apakan?",
      prose: [
        "Angkanya tidak berbohong: skor_kredit_internal PSI 0,72 (drift besar sejak minggu 7), KS p-value praktis nol, akurasi proxy turun 4 minggu beruntun ke 0,79. Sementara dashboard mengklaim “SEHAT” dengan PSI agregat 0,23. Head of Data Science menunggumu memilih — dan tiap opsi mengubah apa yang terjadi berikutnya.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Keputusan apa yang kamu ambil atas model skoring kredit ini? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-retrain",
            label: "Retrain segera dengan data 6 bulan terakhir",
            rationale:
              "Drift terbukti secara statistik dan reference window basi. Model harus belajar ulang dari populasi sekarang — bukan ditambal.",
            nextStepId: "kons-retrain",
            consequenceNote:
              "Retrain selesai dalam 3 minggu; akurasi proxy pulih ke 0,86. Tapi tanpa monitoring yang diperbaiki, drift berikutnya juga akan telat terdeteksi — kamu menukar satu masalah dengan kalender.",
          },
          {
            id: "opt-rollback",
            label: "Rollback: bekukan keputusan otomatis untuk segmen berisiko",
            rationale:
              "Batasi kerusakan dulu — kembalikan segmen berisiko ke scorecard manual sementara investigasi berjalan. Jangan biarkan model yang drift terus memutuskan.",
            nextStepId: "kons-rollback",
            consequenceNote:
              "NPL berhenti naik, tapi throughput approval turun 40% — tim bisnis protes keras. Rollback membeli waktu, bukan solusi; dalam 2 minggu kamu tetap harus memilih retrain atau tidak.",
          },
          {
            id: "opt-pantau",
            label: "Pantau dengan ambang baru — tanpa retrain",
            rationale:
              "Drift baru menyerang satu fitur; retrain itu mahal. Ketatkan ambang PSI ke 0,1 per fitur + alert otomatis ke pemilik model.",
            nextStepId: "kons-pantau",
            consequenceNote:
              "Alert berbunyi tiap minggu — dalam sebulan tim mulai mengabaikannya (alert fatigue). Tiga bulan kemudian drift pendapatan ikut melewati 0,25 dan kamu retrain juga — hanya lebih telat, lebih mahal, dan dengan NPL yang sudah naik.",
          },
        ],
      },
    },
    {
      id: "kons-retrain",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: retrain segera",
      prose: [
        "Head of Data Science menyetujui retrain. Tiga minggu kemudian model baru live — dilatih pada 6 bulan data terakhir, akurasi proxy kembali ke 0,86. Tim bisnis bernapas lega.",
        "Tapi ada yang mengganjal: dashboard monitoring tidak berubah sama sekali. Reference window masih beku, ambang masih 0,35, agregat masih menyembunyikan per fitur. Kamu memperbaiki modelnya — bukan sistem yang seharusnya menangkap masalah ini lebih awal. Drift berikutnya hanya soal waktu.",
      ],
      tasks: [],
      note: {
        title: "Retrain tanpa memperbaiki monitoring = me-reset jam",
        body: "Model baru = reference baru. Tanpa jadwal update reference dan alert per fitur, kamu akan mengulang misi ini 8 bulan dari sekarang — dengan angka yang sama persis. Di deliverable-mu, retrain WAJIB dipasangkan dengan rencana monitoring baru.",
      },
    },
    {
      id: "kons-rollback",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: rollback sementara",
      prose: [
        "Segmen berisiko dikembalikan ke scorecard manual. NPL berhenti naik minggu itu juga — kemenangan yang terasa. Lalu tim bisnis datang dengan angka lain: throughput approval turun 40%, dan antrean manual menumpuk.",
        "Dua minggu kemudian kamu tetap harus menjawab pertanyaan yang sama: retrain atau tidak. Rollback adalah perban yang bagus — tapi perban bukan penyembuh. Setidaknya kamu membeli 2 minggu tanpa kerusakan baru, dan dalam 2 minggu itu investigasi drift-mu selesai.",
      ],
      tasks: [],
      note: {
        title: "Rollback membeli waktu — belanjakan dengan benar",
        body: "Waktu yang dibeli rollback hanya berharga bila dipakai untuk diagnosis (seperti Lab 1-mu) dan perbaikan monitoring. Rollback tanpa tindak lanjut = menunda keputusan sambil membayar 40% throughput.",
      },
    },
    {
      id: "kons-pantau",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: pantau dengan ambang baru",
      prose: [
        "Ambang dikembalikan ke 0,1 per fitur, alert otomatis dipasang. Minggu pertama: 3 alert. Minggu kedua: 5 alert. Minggu keempat: tim mulai me-mute channel alert — “itu-itu lagi”.",
        "Tiga bulan kemudian drift pendapatan ikut melewati 0,25. Kamu akhirnya retrain juga — hanya saja sekarang dengan NPL yang sudah naik 2 poin dan kepercayaan tim bisnis yang terkikis. Pelajaran mahal: alert tanpa pemilik dan tanpa tindakan yang jelas hanya menghasilkan kebisingan.",
      ],
      tasks: [],
      note: {
        title: "Alert tanpa tindakan = kebisingan",
        body: "“Kita pantau dulu” hanya bermakna bila tiap ambang punya pemilik dan tindakan (“PSI > 0,25 → pemilik model investigasi dalam 1 minggu”). Tanpa itu, alert fatigue menjamin sinyal berikutnya juga terlewat.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 7 · Misi audit",
      title: "Dossier 14 baris: dashboard “sehat” yang buta",
      prose: [
        "Sebelum menulis laporan, satu misi audit. Di bawah ini 14 baris “Snapshot Dashboard Monitoring Model — 10 minggu”, dokumen internal yang mengklaim model SEHAT. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — PSI 0,72 milikmu tidak bisa dibantah oleh lampu hijau.",
        "Senjatamu: PSI per fitur minggu 10 (0,72 / 0,21 / < 0,01 / < 0,01), KS yang signifikan, dan 4 minggu akurasi di bawah 0,83 dari Lab 2.",
      ],
      tasks: [],
      auditDossier: {
        version: "misi-drift-produksi-m2a-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai snapshot Dashboard Monitoring Model 10 minggu terakhir yang menyatakan model SEHAT.",
        columns: ["Minggu", "Klaim dashboard", "PSI agregat", "Status"],
        rows: [
          { rowId: 1, cells: { "Minggu": "M1", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,01", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 2, cells: { "Minggu": "M2", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,01", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 3, cells: { "Minggu": "M3", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,01", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 4, cells: { "Minggu": "M4", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,00", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 5, cells: { "Minggu": "M5", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,01", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          // ── I4: minggu hilang diisi rata-rata ──
          { rowId: 6, cells: { "Minggu": "M6", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,02", "Status": "Sehat" }, claims: [{ label: "Catatan", value: "Data minggu 6 hilang — diisi rata-rata minggu 5" }] },
          { rowId: 7, cells: { "Minggu": "M7", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,07", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 8, cells: { "Minggu": "M8", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,11", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 9, cells: { "Minggu": "M9", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,17", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          { rowId: 10, cells: { "Minggu": "M10", "Klaim dashboard": "Distribusi stabil", "PSI agregat": "0,23", "Status": "Sehat" }, claims: [{ label: "Sumber", value: "Log serving" }] },
          // ── I1: reference window basi ──
          { rowId: 11, cells: { "Minggu": "—", "Klaim dashboard": "Reference window diperbarui tiap kuartal", "PSI agregat": "—", "Status": "Kebijakan" }, claims: [{ label: "Fakta", value: "Snapshot referensi beku 2024-01 — tidak pernah diperbarui" }] },
          // ── I3: ambang dinaikkan diam-diam ──
          { rowId: 12, cells: { "Minggu": "—", "Klaim dashboard": "Ambang alert PSI: 0,35", "PSI agregat": "—", "Status": "Kebijakan" }, claims: [{ label: "Riwayat", value: "Diubah dari 0,1 menjadi 0,35 pada 2026-03 — tanpa changelog" }] },
          // ── I2: agregasi menyembunyikan drift ──
          { rowId: 13, cells: { "Minggu": "M10", "Klaim dashboard": "Rincian per fitur: tidak ditampilkan", "PSI agregat": "0,23", "Status": "Sehat" }, claims: [{ label: "Fakta", value: "PSI per fitur M10 — skor_kredit_internal 0,72; pendapatan 0,21; sisanya < 0,01" }] },
          { rowId: 14, cells: { "Minggu": "—", "Klaim dashboard": "Kesimpulan: model SEHAT, tidak perlu tindakan", "PSI agregat": "—", "Status": "Keputusan" }, claims: [{ label: "Didasarkan", value: "13 baris di atas" }] },
        ],
        injections: [
          { key: "reference-basi", rowIds: [11], title: "Reference window basi", clue: "Dashboard mengklaim reference diperbarui tiap kuartal — faktanya snapshot beku 2024-01. “Tidak ada drift” di sini artinya “tidak ada drift relatif terhadap populasi dua tahun lalu”.", danger: "Reference basi membuat SEMUA metrik drift buta arah: model bisa melayani populasi yang sama sekali berbeda sambil dashboard tetap hijau. Di kredit, ini = keputusan approval atas populasi yang tidak dikenali model." },
          { key: "agregasi-menyembunyikan", rowIds: [13], title: "Agregat menyembunyikan drift fitur", clue: "PSI agregat M10 = 0,23 terlihat “di bawah ambang”. Tapi skor_kredit_internal sendirian 0,72 — hampir tiga kali lipat ambang drift besar. Dashboard tidak pernah menampilkan angka per fitur.", danger: "Satu fitur kritis yang drift bisa menghancurkan model sendirian — agregat merata-ratakannya dengan fitur yang stabil. Aturan: alert SELALU per fitur, tidak pernah hanya agregat." },
          { key: "ambang-dinaikkan", rowIds: [12], title: "Ambang alert dinaikkan diam-diam", clue: "Ambang 0,1 → 0,35 pada 2026-03 tanpa changelog. Dengan ambang lama, alert sudah berbunyi sejak minggu 8 (agregat 0,11) — dan untuk skor_kredit_internal sejak minggu 7.", danger: "Mengubah ambang tanpa catatan = mengubah definisi “sehat” tanpa sepengetahuan siapa pun. Ini cara termurah membuat masalah hilang dari dashboard tanpa memperbaiki apa pun." },
          { key: "minggu-hilang", rowIds: [6], title: "Minggu 6 yang hilang diisi rata-rata", clue: "Data minggu 6 hilang dan diisi rata-rata minggu 5 — tepat saat skor_kredit_internal mulai bergeser (PSI 0,05 di minggu 6). Chart terlihat mulus di titik infleksi.", danger: "Imputasi diam-diam menghapus sinyal paling penting: titik awal perubahan. Di forensik data, minggu yang “terlalu mulus” justru yang paling dicurigai." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 8 · Deliverable",
      title: "Laporan insiden drift + rencana monitoring",
      prose: [
        "Semua bukti di tangan. Tulis laporan insiden drift satu halaman untuk Head of Data Science — artefak portofoliomu. Laporan yang baik tidak hanya bilang “ada drift”, tapi menunjukkan ANGKA pergeserannya, apa yang disembunyikan dashboard, dan bagaimana monitoring harus dibangun ulang agar ini tidak terulang.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan insiden (3 kalimat): apa yang diklaim dashboard vs apa yang ditemukan dari log mentah.",
          "Bukti kuantitatif: PSI per fitur per minggu, ambang yang dilewati (0,1 / 0,25), hasil uji KS, tren akurasi proxy 4 minggu terakhir.",
          "Temuan audit dashboard: keempat sabotase, baris per baris, dan bagaimana masing-masing menyembunyikan drift.",
          "Rencana monitoring baru: metrik per fitur, ambang + tindakan untuk tiap ambang, frekuensi update reference window, pemilik tiap alert.",
          "Batas & risiko sisa: apa yang TIDAK ditangkap PSI/KS (mis. drift konsep/label, perubahan perilaku yang belum tercermin di distribusi fitur).",
        ],
        rubric: [
          { criterion: "Kebenaran perhitungan drift", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "PSI per fitur + KS benar (skor_kredit 0,72; pendapatan 0,21; KS p≈0 vs p=0,77)"] },
          { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris"] },
          { criterion: "Kualitas rencana monitoring", weight: 25, levels: ["Tanpa ambang tindakan", "Ada rencana, ambang kabur", "Metrik per fitur + ambang eksplisit + pemilik + jadwal update reference"] },
          { criterion: "Keputusan & kejujuran batas", weight: 20, levels: ["Keputusan tanpa alasan", "Ada keputusan, alasan lemah", "Keputusan konsisten dengan bukti + batas PSI/KS dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 9 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di dashboard monitoring:",
        "1) **Reference basi** (baris 11): diklaim diperbarui tiap kuartal, faktanya beku 2024-01. Semua PSI dihitung terhadap populasi dua tahun lalu — “tidak ada drift” yang dilaporkan adalah perbandingan terhadap masa lalu yang makin jauh.",
        "2) **Agregat menyembunyikan drift** (baris 13): dashboard hanya menampilkan PSI agregat 0,23. Kenyataannya skor_kredit_internal sendirian 0,72 — drift besar yang tenggelam di rata-rata tiga fitur stabil.",
        "3) **Ambang dinaikkan diam-diam** (baris 12): 0,1 → 0,35 tanpa changelog. Dengan ambang lama, alert berbunyi sejak minggu 8 — dan untuk skor_kredit_internal sejak minggu 7. Seseorang memilih mengubah definisi “sehat” daripada memperbaiki masalah.",
        "4) **Minggu 6 diisi rata-rata** (baris 6): data hilang, diisi rata-rata minggu 5 — tepat di titik infleksi drift. Chart terlihat mulus di momen paling penting.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menghitung ulang dari data mentah, atau memercayai lampu hijau. Dan ingat keputusan bercabangmu: retrain memperbaiki model tapi bukan sistemnya; rollback membeli waktu; “pantau” tanpa tindakan = kebisingan. Tidak ada opsi yang gratis — yang ada hanya harga yang berbeda.",
        "Bahaya nyata terakhir: model kredit yang kedaluwarsa diam-diam tidak langsung runtuh — ia membusuk perlahan. Approval demi approval diberikan ke populasi yang tidak dikenali model, NPL naik 2 poin, dan ketika akhirnya ketahuan, kerugiannya sudah terakumulasi berbulan-bulan. Itulah kenapa monitoring adalah bagian dari model, bukan aksesori.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: retrain = obat drift",
        type: "pitfall",
        body: "“Sudah retrain, masalah selesai.” BELUM — retrain tanpa memperbaiki monitoring hanya me-reset jam hitung mundur. Drift berikutnya akan telat terdeteksi dengan cara yang persis sama. Obat drift yang sebenarnya: monitoring per fitur + reference window yang hidup + ambang yang tidak bisa diubah diam-diam.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 10 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Drift terukur: skor_kredit_internal PSI 0,72 (drift besar, sejak minggu 7) dan pendapatan PSI 0,21 (drift kecil) di minggu 10; KS mengonfirmasi (p≈0 vs p=0,77 untuk fitur stabil).",
        "Empat pola sabotase dashboard: reference basi, agregat menyembunyikan drift per fitur, ambang dinaikkan diam-diam, minggu hilang diisi rata-rata.",
        "Keputusan atas model drift selalu punya harga: retrain (model pulih, sistem tetap buta), rollback (waktu terbeli, throughput turun), pantau tanpa tindakan (alert fatigue).",
        "PSI agregat tidak pernah cukup untuk vonis — alert drift SELALU per fitur, dengan ambang 0,1/0,25 dan pemilik yang jelas.",
        "Data: SINTETIS (generator numpy, seed 42) — 240 baris distribusi + 10 baris akurasi, dibekukan 2026-10-15; pola drift dirancang untuk misi ini.",
      ],
    },
  ],
};

export default misiDrift;
