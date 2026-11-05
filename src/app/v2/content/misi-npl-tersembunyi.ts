import type { V2Mission } from "../lib/types";

// ── MISI NPL TERSEMBUNYI: Angka yang Terlalu Bagus untuk Dipercaya ───────
// Misi B — Credit Risk (edge: data lebih kotor, ambiguitas, sinyal konflik).
// Dataset: Statlog German Credit (UCI id 144; CC BY 4.0 — badge lisensi di
// halaman dataset, diverifikasi 2026-10-15; OpenML credit-g identik berlisensi
// "Public"). 1000 fasilitas, class good/bad dipakai sebagai label kinerja
// lancar/macet (penyederhanaan yang didokumentasikan di METODE.md).
// File: public/misi/misi-npl-tersembunyi/loanbook.csv (bersih) +
// loanbook_audit.csv (kotoran terdokumentasi K1-K4) + restrukturisasi.csv
// (SINTETIS, 40 fasilitas) + METODE.md.

const BASE = "/misi/misi-npl-tersembunyi";

export const misiNplTersembunyi: V2Mission = {
  slug: "misi-npl-tersembunyi",
  track: "Credit Risk",
  module: "Misi",
  title: "NPL 2%: Angka yang Terlalu Bagus untuk Dipercaya",
  estMinutes: 170,
  role: "Senior Credit Risk Auditor (auditor risiko kredit senior)",
  client:
    "Direksi bank — bank melaporkan NPL 2% padahal rata-rata industri 3,5%; beredar rumor restrukturisasi massal yang dicatat “lancar”; kamu diminta membuktikan atau membantah dengan data loan book",
  xp: 600,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "NPL 2% di tengah industri yang 3,5%",
      prose: [],
      tasks: [],
      briefing: {
        role: "Senior Credit Risk Auditor (auditor risiko kredit senior) yang disewa direksi",
        client:
          "Direksi bank. Bank ini melaporkan NPL (non-performing loan) 2% — jauh di bawah rata-rata industri 3,5%. Angka itu menopang harga saham, bonus manajemen, dan kepercayaan regulator. Tapi beredar rumor: ada restrukturisasi massal yang di sistem tercatat “lancar”. Direksi terbelah — sebagian ingin kebenaran, sebagian ingin angka itu tidak diganggu. Kamu dipanggil karena kamu orang luar: tidak punya karier yang dipertaruhkan di bank ini, dan laporanmu akan dibaca regulator bila keadaan memburuk.",
        story: [
          "Rabu sore, 16:20. Ruang rapat direksi lantai 28. Direktur Kepatuhan menggeser satu map ke arahmu: ekstrak loan book 1.000 fasilitas kredit ritel — kolomnya lengkap, dari checking account sampai employment_since, dengan label kinerja good/bad di ujung tiap baris. “Ini data mentahnya,” katanya pelan. “Laporan resmi kami bilang NPL 2%. Tapi kalau Anda hitung sendiri dari map ini, Anda akan dapat angka yang sangat berbeda. Saya butuh Anda membuktikan saya salah — atau membuktikan saya benar.”",
          "Kamu membuka map itu malam harinya. Hitungan kasarmu langsung mengganjal: proporsi fasilitas “bad” di loan book ini sekitar 30% — lima belas kali lipat dari NPL 2% yang dilaporkan. Selisih sebesar itu tidak bisa dijelaskan oleh perbedaan definisi semata. Lalu ada lampiran kedua: daftar 40 fasilitas yang direstrukturisasi tahun lalu — dan bisik-bisik bahwa fasilitas-fasilitas seperti itu tetap tercatat “lancar” di sistem pelaporan.",
          "Inilah misi edge: datanya kotor, dua sumber bisa bercerita beda, dan tiap angka yang kamu sentuh punya konsekuensi karier untuk seseorang. Tugasmu: bangun angka NPL yang jujur dari loan book, uji klaim “tidak pernah direstrukturisasi” terhadap daftar restrukturisasi, temukan sabotase di salinan audit, putuskan apa yang kamu lakukan dengan temuanmu — lalu tulis memo yang berani menyebut angka koreksinya.",
        ],
        objectives: [
          "Menghitung bad rate per segmen (employment_since × purpose) dari loan book bersih dan mengidentifikasi segmen berisiko tertinggi dengan bukti n yang memadai.",
          "Menemukan debitur dengan status konflik (satu fasilitas “lancar”, satu “macet”) memakai SQL, serta menghitung fasilitas dengan beban cicilan mustahil di file audit.",
          "Menemukan 4 sabotase di dossier audit, memilih satu dari tiga jalur keputusan, dan menulis memo audit untuk direksi yang berani menyatakan NPL terkoreksi — lengkap dengan batas-batas datanya.",
        ],
        prereqSummary:
          "NPL (non-performing loan) = rasio kredit bermasalah terhadap total kredit — angka yang menentukan cadangan kerugian, harga saham bank, dan perhatian regulator. Restrukturisasi/forbearance = keringanan syarat kredit untuk debitur kesulitan (wajar bila transparan, berbahaya bila dipakai menyamarkan kredit macet sebagai “lancar”). Evergreening = pola lebih gelap: fasilitas baru diberikan agar debitur bisa membayar fasilitas lama, sehingga yang macet terlihat hidup terus.",
        datasetNote:
          "Sumber: Statlog German Credit (Prof. Dr. Hans Hofmann, Universität Hamburg), via UCI ML Repository id 144 — lisensi CC BY 4.0 (badge di halaman dataset, diverifikasi 2026-10-15); dataset identik di OpenML credit-g berlisensi “Public”. Atribusi: “Statlog German Credit (Hofmann, UCI ML Repository, CC BY 4.0)”.\nSlice: 1.000 fasilitas, kode kategorikal didekode ke label Inggris deskriptif; class “good”/“bad” dipakai sebagai label kinerja lancar/macet (penyederhanaan yang disengaja dan didokumentasikan).\nKejujuran: file loanbook.csv = data bersih. File loanbook_audit.csv = salinan yang SENGAJA dikotori (missing values, duplikat konflik, installment_rate mustahil, kode tak valid — daftar lengkap di METODE.md). File restrukturisasi.csv = SINTETIS (40 fasilitas berparameter, seed 42) untuk melatih skeptisisme terhadap klaim “tidak pernah direstrukturisasi”.\nPeringatan: selisih 30% bad di loan book vs NPL 2% yang dilaporkan adalah inti misteri misi ini — jangan “menjelaskannya pergi” sebelum menghitung.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Tiga file, tiga cerita yang belum tentu sama",
      prose: [
        "Tiga file menunggumu di data room. `loanbook.csv` adalah ekstrak bersih: 1.000 baris, 21 kolom — dari `checking_account` dan `duration_months` sampai `employment_since`, `installment_rate`, dan `class` (“good”/“bad”). Ini fondasimu membangun angka yang jujur. Hitung dulu bad rate keseluruhannya, dan tahan keinginan untuk langsung menyimpulkan.",
        "`loanbook_audit.csv` adalah “salinan yang sudah diaudit” dari unit pelapor — dan disinilah edge-nya. Seseorang menyuntikkan kotoran yang lebih berat dari misi-misi biasa: 5% missing acak di `employment_since` dan `savings`, dua pasang duplikat KONFLIK (baris yang sama tapi class berbeda), tiga `installment_rate` mustahil di atas 60, dan dua kode `purpose` yang tidak valid. Detail tiap suntikan ada di `METODE.md` — tapi membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
        "`restrukturisasi.csv` adalah file ketiga — dan yang paling berbahaya. Isinya 40 fasilitas yang direstrukturisasi, dengan kolom `facility_ref` (format F-0001 sampai F-1000, merujuk ke nomor baris data di loanbook.csv), debitur, tanggal, status sebelum restrukturisasi, dan keterangan. File ini SINTETIS — dinyatakan jujur di header METODE.md — tapi di dalam cerita misi ini ia diperlakukan sebagai daftar resmi dari unit bisnis. Tugasmu nanti: mengujinya melawan klaim dossier.",
        "Aturan main data room: (1) angka jujur HANYA dari file bersih; (2) kecurigaan HANYA dari file audit dan dossier; (3) dua sumber yang bercerita beda bukan berarti satu bohong — bisa berarti definisinya beda, dan membuktikan yang mana butuh angka, bukan firasat.",
      ],
      tasks: [
        { id: "t1", text: "Buka `loanbook.csv` dan catat: berapa baris, berapa kolom, dan apa arti `class`" },
        { id: "t2", text: "Buka `restrukturisasi.csv` — pahami format `facility_ref` dan catat bahwa file ini SINTETIS" },
        { id: "t3", text: "Bandingkan sekilas: adakah `facility_ref` yang juga muncul dengan label “lancar” di tempat lain?" },
      ],
      note: {
        title: "Miskonsepsi #1: angka resmi = angka yang benar",
        type: "pitfall",
        body: "“Kan sudah diaudit, pasti benar.” Kenyataannya: NPL 2% itu angka LAPORAN — hasil dari definisi, pengecualian, dan pilihan klasifikasi. Loan book 1.000 baris ini adalah angka MENTAH. Tugas auditor bukan memilih mana yang dipercaya, melainkan merekonsiliasi keduanya sampai selisihnya bisa dijelaskan baris per baris — atau sampai terbukti tidak bisa dijelaskan.",
      },
      reference:
        "loanbook.csv (bersih, 1.000 baris) vs loanbook_audit.csv (kotoran K1–K4) vs restrukturisasi.csv (SINTETIS, 40 fasilitas). Angka jujur dari yang bersih; audit pada yang kotor.",
    },
    {
      id: "lab-eda",
      eyebrow: "Langkah 3 · Lab 1 — Peta segmen berisiko",
      title: "Segmen mana yang paling “bad”? (Awas jebakan n kecil)",
      prose: [
        "Sebelum menuduh ada yang disembunyikan, kamu butuh peta: di segmen mana fasilitas “bad” menumpuk? Lab ini menghitung bad rate per kombinasi `employment_since` × `purpose` dari file BERSIH — crosstab klasik analis risiko. Tapi misi ini edge: sel dengan bad rate TERTINGGI mentah ternyata cuma punya n = 1. Satu baris. Kalau kamu melaporkan “segmen unemployed × education = 100% bad” ke direksi, kamu sedang mempresentasikan noise sebagai temuan.",
        "Jadi lab ini dua lapis: temukan sel tertinggi mentah (dan catat n-nya sebagai bukti jebakan), lalu saring hanya sel dengan n minimal 10 dan temukan yang tertinggi di situ. Itulah segmen yang boleh kamu sebut “berisiko tertinggi” — dengan n yang bisa dipertahankan di depan direksi.",
        "Data dimuat langsung dari server dengan `open_url` — path relatif ke situs ini, tanpa token.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; hitung `n_baris` dan `n_bad` (class “bad”)" },
        { id: "t2", text: "Crosstab bad rate per (`employment_since`, `purpose`); simpan n sel tertingginya di `worst_n_raw` (ini jebakannya)" },
        { id: "t3", text: "Saring sel dengan n minimal 10; simpan `worst_emp`, `worst_purp`, `worst_rate`, `worst_n` — lalu print semuanya" },
      ],
      expected:
        "n_baris=1000, n_bad=300, worst_n_raw=1 (sel mentah tertinggi cuma 1 baris — noise), segmen terbaik (n minimal 10): lt_1yr × business, bad rate 0.5385, n=13",
      note: {
        title: "Miskonsepsi #2: ranking = kebenaran",
        type: "pitfall",
        body: "Ranking bad rate per segmen terlihat objektif — tapi ranking tidak tahu ukuran sampel. Sel n=1 dengan 100% bad akan selalu “menang” atas sel n=500 dengan 40% bad, padahal yang kedua jauh lebih bisa dipercaya. Dalam audit, angka tanpa n adalah opini yang menyamar sebagai statistik. Selalu laporkan n — dan tetapkan ambang minimum SEBELUM melihat hasilnya, bukan sesudah.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))`.",
        "Kolom bantu: `df[\"bad\"] = (df[\"class\"] == \"bad\").astype(int)` — lalu `df.groupby([\"employment_since\", \"purpose\"])[\"bad\"].agg([\"mean\", \"count\"])`.",
        "Sel tertinggi: `ct[\"mean\"].idxmax()` mengembalikan tuple (employment_since, purpose); `ct.loc[sel, \"count\"]` mengambil n-nya.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-npl-tersembunyi/loanbook.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...        # banyak baris",
          "n_bad = ...          # banyak class \"bad\"",
          "",
          "df[\"bad\"] = (df[\"class\"] == \"bad\").astype(int)",
          "ct = ...             # crosstab: mean + count per (employment_since, purpose)",
          "",
          "worst_raw = ...        # index sel bad_rate tertinggi (mentah)",
          "worst_emp_raw, worst_purp_raw = worst_raw",
          "worst_rate_raw = ...   # bad_rate sel tersebut",
          "worst_n_raw = ...      # n sel tersebut (jebakan!)",
          "",
          "ct_ok = ...            # hanya sel dengan count >= 10",
          "worst = ...            # index sel tertinggi setelah filter",
          "worst_emp, worst_purp = worst",
          "worst_rate = ...",
          "worst_n = ...",
          "",
          "print(\"baris:\", n_baris, \"| bad:\", n_bad)",
          "print(\"sel mentah tertinggi:\", worst_emp_raw, \"x\", worst_purp_raw,",
          "      worst_rate_raw, \"n =\", worst_n_raw)",
          "print(\"sel terbaik (n>=10):\", worst_emp, \"x\", worst_purp,",
          "      worst_rate, \"n =\", worst_n)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-npl-tersembunyi/loanbook.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "n_bad = int((df[\"class\"] == \"bad\").sum())",
          "",
          "df[\"bad\"] = (df[\"class\"] == \"bad\").astype(int)",
          "ct = df.groupby([\"employment_since\", \"purpose\"])[\"bad\"].agg([\"mean\", \"count\"])",
          "",
          "worst_raw = ct[\"mean\"].idxmax()",
          "worst_emp_raw, worst_purp_raw = worst_raw",
          "worst_rate_raw = float(ct[\"mean\"].max())",
          "worst_n_raw = int(ct.loc[worst_raw, \"count\"])",
          "",
          "ct_ok = ct[ct[\"count\"] >= 10]",
          "worst = ct_ok[\"mean\"].idxmax()",
          "worst_emp, worst_purp = worst",
          "worst_rate = float(ct_ok[\"mean\"].max())",
          "worst_n = int(ct_ok.loc[worst, \"count\"])",
          "",
          "print(\"baris:\", n_baris, \"| bad:\", n_bad)",
          "print(\"sel mentah tertinggi:\", worst_emp_raw, \"x\", worst_purp_raw,",
          "      worst_rate_raw, \"n =\", worst_n_raw)",
          "print(\"sel terbaik (n>=10):\", worst_emp, \"x\", worst_purp,",
          "      worst_rate, \"n =\", worst_n)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari loanbook.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 1000", name: "n_baris", value: 1000, msg: "File bersih punya tepat 1.000 baris fasilitas." },
          { kind: "equal", task: "t1", label: "`n_bad` = 300", name: "n_bad", value: 300, msg: "Hitung baris dengan class tepat sama dengan \"bad\" — ini 30%, inti misteri misi ini." },
          { kind: "equal", task: "t2", label: "`worst_n_raw` = 1 (jebakan noise)", name: "worst_n_raw", value: 1, msg: "Sel mentah tertinggi (bad rate 1.0) cuma punya n = 1 — bukti ranking mentah menipu." },
          { kind: "equal", task: "t3", label: "`worst_emp` = \"lt_1yr\"", name: "worst_emp", value: "lt_1yr", msg: "Setelah filter n minimal 10, segmen employment tertingginya adalah karyawan di bawah 1 tahun." },
          { kind: "equal", task: "t3", label: "`worst_purp` = \"business\"", name: "worst_purp", value: "business", msg: "Pasangannya: purpose business — kredit usaha oleh karyawan baru, kombinasi paling berisiko." },
          { kind: "equal", task: "t3", label: "`worst_rate` ≈ 0.5385", name: "worst_rate", value: 0.538462, tol: 0.005, msg: "Bad rate segmen lt_1yr × business = 7 dari 13 fasilitas." },
          { kind: "equal", task: "t3", label: "`worst_n` = 13", name: "worst_n", value: 13, msg: "n sel tersebut = 13 — cukup besar untuk dilaporkan, tidak seperti n = 1 tadi." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Satu debitur, dua status",
      title: "Debitur yang “lancar” sekaligus “macet”: siapa dia?",
      prose: [
        "Senjata keduamu: SQL — dan targetnya lebih licik dari duplikat biasa. Di tabel kecil `fasilitas(id, debitur, status, kolektibilitas, restructured_flag)` ini ada debitur yang muncul DUA kali dengan status KONFLIK: satu baris “lancar”, satu baris “macet”. Di dunia nyata, inilah pola yang membuat NPL bisa “dipilih”: kalau satu debitur punya dua status, status mana yang masuk laporan?",
        "Kolom `restructured_flag` adalah petunjuk tambahan: perhatikan polanya pada baris-baris yang konflik — tapi jangan terkecoh, flag itu bukan bukti, cuma korelasi. Temukan debitur-debitur konflik dengan `GROUP BY` + `HAVING COUNT(DISTINCT status) > 1`.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang menemukan debitur dengan status konflik (lebih dari satu status berbeda)" },
      ],
      expected: "2 debitur: H. Santoso dan Ny. Rahma — masing-masing punya satu baris “lancar” dan satu “macet”",
      hints: [
        "Kelompokkan per debitur, lalu saring grup yang punya lebih dari satu nilai status berbeda.",
        "Fungsi yang menghitung nilai UNIK (bukan total baris): COUNT(DISTINCT status).",
      ],
      sqlLab: {
        task: "Temukan debitur dengan status konflik: kelompokkan per debitur dan saring yang memiliki lebih dari satu status berbeda.",
        schema: "CREATE TABLE fasilitas (id INTEGER, debitur TEXT, status TEXT, kolektibilitas TEXT, restructured_flag INTEGER);",
        seedData: [
          "INSERT INTO fasilitas VALUES",
          "(1, 'H. Santoso', 'lancar', '1 (Lancar)', 0),",
          "(2, 'Ny. Rahma', 'lancar', '1 (Lancar)', 0),",
          "(3, 'PT Maju Jaya', 'lancar', '1 (Lancar)', 0),",
          "(4, 'D. Prasetyo', 'macet', '5 (Macet)', 0),",
          "(5, 'H. Santoso', 'macet', '5 (Macet)', 1),",
          "(6, 'CV Berkah', 'lancar', '2 (Dalam perhatian khusus)', 1),",
          "(7, 'Ny. Rahma', 'macet', '5 (Macet)', 1),",
          "(8, 'PT Sinar Abadi', 'lancar', '1 (Lancar)', 0),",
          "(9, 'R. Wijaya', 'macet', '5 (Macet)', 0),",
          "(10, 'T. Hidayat', 'lancar', '3 (Kurang lancar)', 0),",
          "(11, 'K. Setiawan', 'macet', '4 (Diragukan)', 0),",
          "(12, 'UD Lancar Rejeki', 'lancar', '1 (Lancar)', 1);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT debitur\nFROM fasilitas\n",
        solution: [
          "SELECT debitur, COUNT(DISTINCT status) AS n_status",
          "FROM fasilitas",
          "GROUP BY debitur",
          "HAVING COUNT(DISTINCT status) > 1;",
        ].join("\n"),
        expectedColumns: ["debitur", "n_status"],
        expectedRows: [
          ["H. Santoso", 2],
          ["Ny. Rahma", 2],
        ],
      },
    },
    {
      id: "lab-segmen",
      eyebrow: "Langkah 5 · Lab 3 — Vintage dan beban mustahil",
      title: "Kredit makin lama, makin macet? + cicilan 88% dari gaji",
      prose: [
        "Dua analisis dalam satu lab. Pertama, “vintage analysis” sederhana ala analis portofolio: kelompokkan fasilitas by `duration_months` menjadi vintage pendek (kurang dari 12 bulan), menengah (12–36), dan panjang (lebih dari 36) — lalu bandingkan bad rate-nya. Hipotesis yang diuji: apakah tenor lebih panjang berarti risiko lebih tinggi? Datanya akan menjawab — dan jawabannya tidak ambigu.",
        "Kedua, beralih ke file AUDIT: hitung berapa fasilitas yang punya `installment_rate` di atas 40. Installment rate adalah cicilan sebagai persentase pendapatan — di file bersih, nilai maksimumnya cuma 4. Angka di atas 40 berarti cicilan 40% dari pendapatan ke atas — dan kamu akan menemukan sesuatu yang jauh lebih ekstrem. Ini bukan sekadar anomali statistik: angka mustahil yang lolos ke file audit berarti tidak ada validasi di pintu masuk data.",
      ],
      tasks: [
        { id: "t1", text: "Buat kolom `vintage` (pendek/menengah/panjang); hitung bad rate per vintage → `bad_pendek`, `bad_menengah`, `bad_panjang`" },
        { id: "t2", text: "Di file AUDIT, hitung `n_mustahil` = fasilitas dengan `installment_rate` > 40; print semuanya" },
      ],
      expected:
        "bad_pendek=0.15, bad_menengah=0.3111, bad_panjang=0.5172 — tenor panjang jauh lebih berisiko; n_mustahil=3 di file audit (termasuk 88%)",
      hints: [
        "Fungsi vintage: `if m < 12: \"pendek\"` lalu `elif m <= 36: \"menengah\"` lalu `\"panjang\"`; terapkan dengan `df[\"duration_months\"].map(vintage)`.",
        "File audit dimuat dari URL kedua; kolom `installment_rate` di sana bertipe numerik — bandingkan langsung dengan 40.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-npl-tersembunyi/loanbook.csv\"",
          "URL_AUDIT = \"/misi/misi-npl-tersembunyi/loanbook_audit.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "da = pd.read_csv(open_url(URL_AUDIT))",
          "",
          "df[\"bad\"] = (df[\"class\"] == \"bad\").astype(int)",
          "",
          "def vintage(m):",
          "    if m < 12:",
          "        return \"pendek\"",
          "    if m <= 36:",
          "        return \"menengah\"",
          "    return \"panjang\"",
          "",
          "df[\"vintage\"] = ...",
          "vr = ...                  # bad rate per vintage",
          "bad_pendek = ...",
          "bad_menengah = ...",
          "bad_panjang = ...",
          "",
          "n_mustahil = ...          # installment_rate > 40 di file AUDIT",
          "",
          "print(\"bad_rate vintage — pendek:\", bad_pendek,",
          "      \"menengah:\", bad_menengah, \"panjang:\", bad_panjang)",
          "print(\"installment_rate > 40 di audit:\", n_mustahil)",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-npl-tersembunyi/loanbook.csv\"",
          "URL_AUDIT = \"/misi/misi-npl-tersembunyi/loanbook_audit.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "da = pd.read_csv(open_url(URL_AUDIT))",
          "",
          "df[\"bad\"] = (df[\"class\"] == \"bad\").astype(int)",
          "",
          "def vintage(m):",
          "    if m < 12:",
          "        return \"pendek\"",
          "    if m <= 36:",
          "        return \"menengah\"",
          "    return \"panjang\"",
          "",
          "df[\"vintage\"] = df[\"duration_months\"].map(vintage)",
          "vr = df.groupby(\"vintage\")[\"bad\"].mean()",
          "bad_pendek = float(vr[\"pendek\"])",
          "bad_menengah = float(vr[\"menengah\"])",
          "bad_panjang = float(vr[\"panjang\"])",
          "",
          "n_mustahil = int((da[\"installment_rate\"] > 40).sum())",
          "",
          "print(\"bad_rate vintage — pendek:\", bad_pendek,",
          "      \"menengah:\", bad_menengah, \"panjang:\", bad_panjang)",
          "print(\"installment_rate > 40 di audit:\", n_mustahil)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` dan `da` termuat", name: "df", msg: "df harus berisi DataFrame loanbook.csv (da = file audit)." },
          { kind: "equal", task: "t1", label: "`bad_pendek` = 0.15", name: "bad_pendek", value: 0.15, tol: 1e-6, msg: "Bad rate vintage pendek (tenor di bawah 12 bulan) = 27 dari 180." },
          { kind: "equal", task: "t1", label: "`bad_menengah` ≈ 0.3111", name: "bad_menengah", value: 0.31105, tol: 1e-4, msg: "Bad rate vintage menengah (12–36 bulan) = 228 dari 733." },
          { kind: "equal", task: "t1", label: "`bad_panjang` ≈ 0.5172", name: "bad_panjang", value: 0.517241, tol: 1e-4, msg: "Bad rate vintage panjang (di atas 36 bulan) = 45 dari 87 — lebih dari setengahnya macet." },
          { kind: "equal", task: "t2", label: "`n_mustahil` = 3", name: "n_mustahil", value: 3, tol: 0, msg: "Tiga fasilitas di file audit punya installment_rate di atas 40 (maksimum di file bersih cuma 4)." },
        ],
      },
    },
  ],
};

export default misiNplTersembunyi;

// ── lanjutan misiNplTersembunyi: append langkah 6–11 ke array steps ───────
import type { V2Step } from "../lib/types";

const LANJUTAN_NPL: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Angka koreksimu siap — sekarang apa?",
    prose: [
      "Semua bukti di tangan. Bad rate loan book 30% — bukan 2%. Segmen karyawan baru × kredit usaha di 53,8%. Vintage panjang di 51,7%. Dua debitur dengan status konflik. Tiga installment rate mustahil di file audit. Dan daftar 40 fasilitas restrukturisasi yang menunggu diuji melawan klaim “tidak pernah direstrukturisasi”.",
      "Direktur Kepatuhan menelepon malam ini: “Laporan resmi kuartal berikutnya terbit dua minggu lagi. Apa pun yang Anda putuskan, putuskan sekarang — karena setelah angka 2% itu terbit lagi, mengubahnya sepuluh kali lebih mahal.” Tiga jalur di depanmu. Tidak ada yang tanpa biaya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Apa yang kamu lakukan dengan temuanmu? (Keputusan final — seperti rekomendasi yang sudah dikirim ke direksi.)",
      options: [
        {
          id: "opt-restate",
          label: "Restate NPL dan laporkan ke direksi — jujur, mengguncang pasar",
          rationale:
            "Hitung NPL terkoreksi dari loan book, sajikan ke direksi apa adanya: angka 2% tidak bisa direkonsiliasi. Jujur secara profesional — tapi harga saham bisa jatuh, bonus hangus, dan namamu yang menandatangani.",
          nextStepId: "temuan-restate",
          consequenceNote:
            "Direksi terbelah — tapi angka 30% vs 2% terlalu besar untuk didiamkan. Restatement dilakukan; harga saham turun 8% dalam seminggu, dua direktur mengundurkan diri. Kamu dicap “auditor yang membunuh kuartal” — tapi juga satu-satunya yang datanya tidak terbantahkan. Sementara itu, fasilitas-fasilitas yang direstrukturisasi tetap belum disentuh siapa pun: kebenaran angka tidak otomatis memperbaiki penagihan.",
        },
        {
          id: "opt-diam",
          label: "Remediasi diam-diam: perbaiki sistem, biarkan angka lama",
          rationale:
            "Jangan sentuh angka 2% yang sudah terbit — tapi paksa perbaikan: validasi input, dedup status konflik, reklasifikasi fasilitas restrukturisasi secara bertahap. Bank selamat dari guncangan; masalah diperbaiki dari dalam.",
          nextStepId: "temuan-diam",
          consequenceNote:
            "Validasi input dipasang, duplikat konflik dibersihkan, 40 fasilitas restrukturisasi direklasifikasi diam-diam selama dua kuartal. NPL “resmi” merangkak naik ke 4,1% tanpa pengumuman dramatis — pasar menerimanya sebagai “pengetatan metodologi”. Tapi kamu tahu: dua kuartal laporan yang tetap salah sudah terbit dengan tanda tanganmu diam-diam di baliknya. Dan rumor restrukturisasi massal tidak pernah terjawab secara terbuka.",
        },
        {
          id: "opt-regulator",
          label: "Eskalasi ke regulator dengan bukti — langkah nuklir",
          rationale:
            "Selisih 30% vs 2% bukan salah hitung — ini dugaan pelaporan palsu. Serahkan dossier ke regulator sebelum laporan kuartal terbit. Kariermu sebagai auditor bank selesai; integritas sistem terjaga.",
          nextStepId: "temuan-regulator",
          consequenceNote:
            "Regulator membuka pemeriksaan khusus. Hasilnya: denda besar, direksi diganti, bank masuk pengawasan intensif selama setahun. Kamu tidak akan pernah dipekerjakan bank komersial lagi — tapi namamu ada di laporan pemeriksaan sebagai whistleblower yang datanya rapi. Harga yang tidak terlihat: 2.000 karyawan bank yang tidak bersalah ikut menanggung reputasi “bank yang diperiksa regulator”.",
        },
      ],
    },
  },
  {
    id: "temuan-restate",
    eyebrow: "Langkah 7 · Temuan lapangan",
    title: "Jalur restatement: kebenaran yang mahal",
    prose: [
      "Kamu menyajikan angka koreksinya di depan direksi: NPL yang bisa direkonsiliasi dari loan book berada di kisaran 30% — bukan 2%. Ruangan itu sunyi. Direktur Utama meminta satu hal: “Buktikan bahwa 2% itu salah, bukan bahwa 30% itu benar.” Dan kamu bisa — karena kamu punya baris per barisnya: segmen, vintage, status konflik, dan daftar restrukturisasi yang klaimnya runtuh saat diuji.",
      "Restatement dilakukan. Harga saham turun 8% dalam seminggu, analis menurunkan rating, dua direktur mengundurkan diri. Kamu dicap “auditor yang membunuh kuartal” di grup WhatsApp para bankir — tapi tidak satu pun dari mereka yang bisa membantah angkamu, karena metodologimu terbuka dan bisa direplikasi.",
      "Tapi ada harga yang kamu bayar: kebenaran angka tidak otomatis memperbaiki penagihan. Fasilitas-fasilitas restrukturisasi yang kamu ungkap tetap menunggak — dan sekarang bank harus mencadangkan kerugian yang selama ini disembunyikan. Kejujuran punya tagihan, dan tagihannya datang sekaligus.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Pelajaran keputusan: kebenaran tanpa rencana = guncangan tanpa arah",
      body: "Kamu memilih jalur paling jujur — dan paling mahal. Pelajarannya: restatement bukan akhir, melainkan awal dari pekerjaan remediasi. Di deliverable-mu, tulis bukan cuma ANGKA koreksinya, tapi RENCANA 90 hari setelahnya: siapa menagih apa, cadangan berapa, dan bagaimana mencegah pengulangan.",
    },
  },
  {
    id: "temuan-diam",
    eyebrow: "Langkah 7 · Temuan lapangan",
    title: "Jalur remediasi diam-diam: perbaikan tanpa guncangan",
    prose: [
      "Kamu memilih jalur yang tidak dipilih auditor heroik di film: perbaiki sistemnya, biarkan angka lamanya. Dalam enam bulan, validasi input dipasang di pintu masuk data (installment_rate mustahil kini tertolak otomatis), duplikat status konflik dibersihkan dengan aturan sumber kebenaran tunggal, dan 40 fasilitas restrukturisasi direklasifikasi bertahap ke kolektibilitas yang benar.",
      "NPL resmi merangkak dari 2% ke 4,1% selama dua kuartal — pasar membacanya sebagai “pengetatan metodologi”, bukan skandal. Tidak ada saham jatuh, tidak ada direktur mundur. Dari sudut pandang stabilitas sistem keuangan, ini hasil yang rapi.",
      "Tapi ada harga yang kamu bayar — dan kamu yang harus menuliskannya dengan jujur di deliverable: dua kuartal laporan yang tetap salah sudah terbit dengan pengetahuanmu di baliknya. Rumor restrukturisasi massal tidak pernah dijawab secara terbuka. Kamu memperbaiki mesinnya, tapi membiarkan kebohongan lamanya tetap tercatat dalam sejarah sebagai kebenaran.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Pelajaran keputusan: stabilitas bukan pembenaran",
      body: "Kamu memilih dampak sistemik minimal — insting yang dewasa. Tapi ingat: “tidak mengguncang pasar” bukan argumen etis, melainkan argumen taktis. Di deliverable-mu, nyatakan eksplisit: angka historis mana yang tetap salah, dan apa risikonya bila suatu hari regulator menemukannya sendiri.",
    },
  },
  {
    id: "temuan-regulator",
    eyebrow: "Langkah 7 · Temuan lapangan",
    title: "Jalur eskalasi: langkah nuklir dan harganya",
    prose: [
      "Kamu menyerahkan dossier ke regulator — 20 baris, 4 sabotase, angka koreksi, dan daftar restrukturisasi — sebelum laporan kuartal terbit. Tiga minggu kemudian, pemeriksaan khusus dibuka. Hasilnya brutal: denda besar, direksi diganti, bank masuk pengawasan intensif selama setahun penuh.",
      "Dari sudut pandang sistem: ini kemenangan. Pelaporan palsu dihukum, preseden terbentuk, bank-bank lain mendadak “menemukan” masalah serupa di laporannya sendiri dan memperbaikinya sukarela. Satu eskalasimu memperbaiki satu industri.",
      "Tapi ada harga yang kamu bayar — dan bukan cuma kariermu di perbankan komersial yang selesai. Dua ribu karyawan bank yang tidak bersalah ikut menanggung reputasi “bank yang diperiksa regulator”; beberapa nasabah menarik dananya karena panik, memperburuk likuiditas bank yang sebenarnya masih bisa diselamatkan. Langkah nuklir tidak mengenal kerusakan kolateral yang presisi.",
    ],
    tasks: [],
    goto: "audit",
    note: {
      title: "Pelajaran keputusan: eskalasi adalah senjata, bukan solusi",
      body: "Kamu memilih integritas sistem di atas segalanya — dan sistem memang membaik. Tapi eskalasi memindahkan masalah dari “angka yang salah” menjadi “kepercayaan yang runtuh”, dan yang kedua jauh lebih mahal diperbaiki. Di deliverable-mu, tulis: kapan eskalasi DIBENARKAN (bukti kuat + jalur internal buntu) dan kapan ia cuma pelarian dari keputusan sulit.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 20 baris: buktikan atau bantah rumor restrukturisasi",
    prose: [
      "Sekarang misi auditnya. Di bawah ini 20 baris dari `loanbook_audit.csv` — dossier yang diklaim “sudah terverifikasi audit internal”. Seseorang menyuntikkan 4 sabotase ke dalamnya tanpa pengumuman. Tandai baris yang janggal, lalu buka debrief.",
      "Senjatamu: crosstab Lab 1 (segmen lt_1yr × business = 53,8% bad), teknik konflik Lab 2 (GROUP BY + HAVING), vintage Lab 3 (tenor panjang = 51,7% bad), daftar `restrukturisasi.csv` (40 fasilitas — uji klaim “tidak pernah direstrukturisasi” terhadapnya), dan akal sehat tentang angka mustahil (installment_rate maksimum di file bersih cuma 4; tanggal cair tidak bisa setelah tanggal jatuh tempo).",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-npl-tersembunyi-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi 20 baris fasilitas dari loanbook_audit.csv yang sudah terverifikasi audit internal — termasuk klaim riwayat restrukturisasi tiap debitur.",
      columns: ["Debitur", "Fasilitas", "Status", "Kolektibilitas"],
      rows: [
        { rowId: 1, cells: { "Debitur": "Hj. Aminah", "Fasilitas": "F-0007", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 2, cells: { "Debitur": "PT Cahaya Timur", "Fasilitas": "F-0019", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I3: installment_rate mustahil 88% ──
        { rowId: 3, cells: { "Debitur": "S. Nugroho", "Fasilitas": "F-0700", "Status": "Lancar", "Kolektibilitas": "2 (Dalam perhatian khusus)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Installment rate", value: "88% dari pendapatan" }] },
        { rowId: 4, cells: { "Debitur": "PT Sinar Abadi", "Fasilitas": "F-0021", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I1: direstrukturisasi tapi diklaim tidak pernah (F-0012 ada di restrukturisasi.csv) ──
        { rowId: 5, cells: { "Debitur": "PT Maju Jaya", "Fasilitas": "F-0012", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 6, cells: { "Debitur": "R. Wijaya", "Fasilitas": "F-0088", "Status": "Macet", "Kolektibilitas": "5 (Macet)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I2: ID ganda status konflik, pasangan 1 ──
        { rowId: 7, cells: { "Debitur": "H. Santoso", "Fasilitas": "F-1001", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 8, cells: { "Debitur": "H. Santoso", "Fasilitas": "F-1001", "Status": "Macet", "Kolektibilitas": "5 (Macet)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 9, cells: { "Debitur": "PT Bumi Raya", "Fasilitas": "F-0110", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 10, cells: { "Debitur": "K. Setiawan", "Fasilitas": "F-0121", "Status": "Macet", "Kolektibilitas": "4 (Diragukan)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I1: direstrukturisasi tapi diklaim tidak pernah (F-0047 ada di restrukturisasi.csv) ──
        { rowId: 11, cells: { "Debitur": "D. Prasetyo", "Fasilitas": "F-0047", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 12, cells: { "Debitur": "T. Hidayat", "Fasilitas": "F-0098", "Status": "Macet", "Kolektibilitas": "5 (Macet)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I2: ID ganda status konflik, pasangan 2 ──
        { rowId: 13, cells: { "Debitur": "Ny. Rahma", "Fasilitas": "F-1002", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 14, cells: { "Debitur": "Ny. Rahma", "Fasilitas": "F-1002", "Status": "Macet", "Kolektibilitas": "5 (Macet)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 15, cells: { "Debitur": "UD Sumber Makmur", "Fasilitas": "F-0130", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 16, cells: { "Debitur": "B. Kurniawan", "Fasilitas": "F-0161", "Status": "Lancar", "Kolektibilitas": "2 (Dalam perhatian khusus)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        // ── I4: kronologi mustahil (cair setelah jatuh tempo) ──
        { rowId: 17, cells: { "Debitur": "PT Delta Farma", "Fasilitas": "F-0144", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Tanggal cair", value: "2024-03-15" }, { label: "Tanggal jatuh tempo", value: "2023-11-30" }] },
        { rowId: 18, cells: { "Debitur": "Ny. Lestari", "Fasilitas": "F-0150", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Tanggal cair", value: "2024-06-01" }, { label: "Tanggal jatuh tempo", value: "2024-01-15" }] },
        { rowId: 19, cells: { "Debitur": "PT Artha Graha", "Fasilitas": "F-0165", "Status": "Macet", "Kolektibilitas": "5 (Macet)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
        { rowId: 20, cells: { "Debitur": "F. Ramadhan", "Fasilitas": "F-0170", "Status": "Lancar", "Kolektibilitas": "1 (Lancar)" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi audit internal" }, { label: "Riwayat restrukturisasi", value: "Tidak pernah" }] },
      ],
      injections: [
        { key: "restrukturisasi-disembunyikan", rowIds: [5, 11], title: "Fasilitas direstrukturisasi tapi dicatat “lancar”", clue: "F-0012 (PT Maju Jaya) dan F-0047 (D. Prasetyo) TERCATAT di restrukturisasi.csv — tapi dossier mengklaim “tidak pernah direstrukturisasi” dan berlabel lancar. Uji silang dua sumber: inilah buktinya.", danger: "Forbearance yang disamarkan: kredit bermasalah dicatat lancar → NPL dilaporkan 2%. Di dunia nyata, ini inti skandal pelaporan — dan alasan restrukturisasi massal disebut “rumor”, bukan “fakta”, sampai ada yang menguji silang." },
        { key: "id-ganda-status-konflik", rowIds: [7, 8, 13, 14], title: "ID debitur ganda dengan status konflik", clue: "F-1001 muncul dua kali — sekali “Lancar”, sekali “Macet”; begitu juga F-1002. Ini duplikat konflik dari file audit (baris 1001–1002: salinan baris 697 & 728 dengan class dibalik).", danger: "Status mana yang benar? Tanpa aturan sumber kebenaran tunggal, angka NPL bisa dipilih sesuai selera pelapor — inilah mekanisme “angka resmi” 2% bisa dipertahankan." },
        { key: "installment-rate-mustahil", rowIds: [3], title: "Installment rate 88% — mustahil", clue: "Baris F-0700 di file audit punya installment_rate 88 — cicilan 88% dari pendapatan. Di file bersih, maksimumnya cuma 4. (Dua lagi: 75 dan 92.)", danger: "Angka mustahil yang lolos ke file audit = tidak ada validasi di pintu masuk. Semua rasio turunan — debt service ratio, affordability — ikut tercemar tanpa ada yang sadar." },
        { key: "kronologi-mustahil", rowIds: [17, 18], title: "Tanggal cair setelah tanggal jatuh tempo", clue: "Klaim dossier: tanggal pencairan 2024-03-15 tapi jatuh tempo 2023-11-30. Waktu tidak berjalan mundur — baris ini direkayasa atau digabung dari dua sumber yang tidak sinkron.", danger: "Kronologi mustahil adalah tanda dua sumber “bercerita” beda. Di forensik kredit, ini sinyal data tempelan — dan data tempelan tidak boleh dipakai menghitung NPL." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 9 · Deliverable",
    title: "Memo audit untuk direksi: berani menyebut angkanya",
    prose: [
      "Semua bukti di tangan, keputusan sudah diambil. Sekarang tulis seperti profesional: memo audit satu halaman untuk direksi. Ini artefak portofoliomu — tulis seolah akan dibaca pengambil keputusan sungguhan, dan seolah regulator akan membacanya juga.",
      "Standar memo ini lebih tinggi dari misi biasa: kamu WAJIB menyebut angka NPL terkoreksi (bukan bersembunyi di balik “perlu kajian lebih lanjut”) dan WAJIB menyatakan apa yang tidak bisa disimpulkan dari data ini.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa NPL terkoreksi menurut hitunganmu, dan apa artinya bagi bank?",
        "Bukti kuantitatif: bad rate loan book, segmen dan vintage berisiko tertinggi (dengan n), temuan status konflik, dan hasil uji silang restrukturisasi — rujuk angka, bukan kesan.",
        "Temuan kualitas data: 4 sabotase di dossier/file audit, masing-masing dengan bukti baris.",
        "Rekomendasi sesuai jalur keputusanmu — plus biaya peluangnya: apa yang kamu korbankan dengan jalur ini, dan rencana 90 hari setelahnya.",
        "Batas data (kejujuran): apa yang TIDAK bisa disimpulkan (mis. class good/bad adalah label kinerja sampel ini, bukan definisi NPL regulator; file restrukturisasi sintetis — di dunia nyata butuh verifikasi dokumen asli; tanpa data arus kas debitur, sebab musabab macet tidak bisa dipastikan).",
      ],
      rubric: [
        { criterion: "Keberanian menyatakan NPL yang dikoreksi", weight: 30, levels: ["Menghindari angka koreksi / bersembunyi di balik jargon", "Menyebut angka tapi tanpa metodologi yang bisa direplikasi", "Angka koreksi dinyatakan eksplisit dengan metodologi yang bisa direplikasi baris per baris"] },
        { criterion: "Kualitas bukti kuantitatif", weight: 25, levels: ["Klaim tanpa angka", "Angka ada tapi tanpa n / tanpa uji silang sumber", "Segmen, vintage, konflik, dan uji silang restrukturisasi — semua dengan angka dan n"] },
        { criterion: "Kejujuran batas data", weight: 25, levels: ["Mengklaim lebih dari yang didukung data", "Menyebut sebagian batas", "Batas (definisi label, data sintetis, kausalitas) dinyatakan eksplisit"] },
        { criterion: "Kualitas keputusan dan biaya peluang", weight: 20, levels: ["Rekomendasi tanpa alasan", "Alasan ada tapi biaya peluang tak diakui", "Jalur keputusan + biaya peluang + rencana 90 hari eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 10 · Debrief",
    title: "Yang sebenarnya terjadi — evergreening, forbearance, dan angka 2%",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan ke dossier — semuanya pola nyata di pelaporan kredit:",
      "1) **Restrukturisasi yang disembunyikan** (baris 5 & 11): F-0012 dan F-0047 tercatat di `restrukturisasi.csv`, tapi dossier mengklaim “tidak pernah direstrukturisasi” dan berlabel “lancar”. Inilah forbearance yang disamarkan — keringanan yang seharusnya transparan justru dipakai menghapus jejak masalah. Rumor “restrukturisasi massal yang dicatat lancar” TERBUKTI untuk dua fasilitas ini — dan pola dua ini membuat 38 lainnya patut dicurigai.",
      "2) **ID ganda status konflik** (baris 7–8, 13–14): F-1001 dan F-1002 — masing-masing muncul dua kali, sekali “Lancar” sekali “Macet”. Di file audit ini adalah baris 1001–1002: salinan baris 697 & 728 dengan class dibalik. Tanpa aturan sumber kebenaran tunggal, pelapor bebas memilih status yang masuk laporan — dan tebak status mana yang dipilih untuk NPL 2%.",
      "3) **Installment rate mustahil** (baris 3): 88% dari pendapatan — di file bersih maksimumnya 4. Dua lagi (75 dan 92) ada di file audit. Ini bukan sekadar typo lucu: angka mustahil yang lolos berarti tidak ada validasi di pintu masuk, sehingga SEMUA rasio turunan ikut tercemar.",
      "4) **Kronologi mustahil** (baris 17–18): tanggal cair setelah tanggal jatuh tempo. Tanda klasik data tempelan dari dua sumber yang tidak sinkron — dua sumber yang “bercerita” beda.",
      "Pelajaran intinya bernama evergreening: pola di mana fasilitas bermasalah “dihidupkan” terus lewat restrukturisasi berulang, perpanjangan tenor, atau fasilitas baru untuk menutup yang lama — sehingga tidak pernah tercatat macet. Forbearance yang sehat itu transparan dan dilaporkan; evergreening adalah forbearance yang disembunyikan. Selisih antara 30% bad di loan book dan 2% NPL resmi adalah ruang tempat evergreening bersembunyi — dan satu-satunya cara membuktikannya adalah uji silang baris per baris seperti yang kamu lakukan.",
      "Skor deteksimu (x/4) bukan nilai ujian — itu cerminan sistem verifikasi yang kamu bawa. Dan ingat keputusan bercabangmu: tidak ada jalur yang gratis. Auditor yang dewasa menuliskan biaya peluangnya — karena itulah satu-satunya cara memastikan keputusan berikutnya lebih baik.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: menemukan masalah = menyelesaikan masalah",
      type: "risk",
      body: "Kamu menemukan 4 sabotase dan menghitung NPL koreksi — tapi tidak satu pun fasilitas macet yang tertagih karenanya. Audit selesai saat temuan DIPERBAIKI dan perbaikannya diverifikasi: validasi input dipasang, duplikat dibersihkan, reklasifikasi selesai. Laporan tanpa tindak lanjut adalah arsip, bukan audit.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 11 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Rekonsiliasi dulu, percaya kemudian: bad rate 30% di loan book vs NPL 2% resmi adalah selisih yang wajib dijelaskan baris per baris — bukan “dijelaskan pergi” dengan definisi.",
      "Ranking segmen menipu tanpa n: sel mentah tertinggi (bad rate 1,0) cuma n = 1; segmen yang layak dilaporkan adalah lt_1yr × business (53,8%, n = 13). Vintage panjang (di atas 36 bulan) = 51,7% bad.",
      "Empat pola sabotase: restrukturisasi yang disembunyikan (uji silang dua sumber), ID ganda status konflik (GROUP BY + HAVING COUNT DISTINCT), angka mustahil (validasi di pintu masuk), kronologi mustahil (tanda data tempelan).",
      "Evergreening = forbearance yang disembunyikan: fasilitas bermasalah “dihidupkan” terus agar tak tercatat macet. Obatnya transparansi + uji silang, bukan kepercayaan.",
      "Keputusan audit selalu punya biaya peluang: restatement (jujur tapi mengguncang), remediasi diam-diam (stabil tapi membiarkan sejarah salah), eskalasi (sistemik tapi meruntuhkan kepercayaan). Tulis biaya peluangmu — dan batas datamu.",
    ],
  },
];

(misiNplTersembunyi.steps as V2Step[]).push(...LANJUTAN_NPL);
