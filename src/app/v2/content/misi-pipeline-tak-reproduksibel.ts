import type { V2Mission } from "../lib/types";

// ── MISI REPRO: Angka yang Tak Bisa Diulang ───────────────────────────────
// M2 — MLOps Misi B (solo). Dataset SINTETIS (dirancang manual, seed 42
// dinyatakan): 13 baris log run eksperimen (seed, versi paket, hash snapshot
// data, metrik AUC, status).
// File: public/misi/misi-pipeline-tak-reproduksibel/run_eksperimen.csv.
// Metode: METODE.md.

const BASE = "/misi/misi-pipeline-tak-reproduksibel";

export const misiRepro: V2Mission = {
  slug: "misi-pipeline-tak-reproduksibel",
  track: "MLOps",
  module: "Misi",
  title: "Misi Pipeline: Angka yang Tak Bisa Diulang",
  estMinutes: 135,
  role: "MLOps engineer",
  client:
    "CTO — vendor mengklaim “hasil kami reproduksibel”, kontrak renewal tiga tahun dipertaruhkan",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Satu slide yang menentukan kontrak",
      prose: [],
      tasks: [],
      briefing: {
        role: "MLOps engineer — auditor independen pipeline ML vendor",
        client:
          "CTO. Vendor model kredit mengklaim pipeline mereka “sepenuhnya reproduksibel”: seed tetap, dependensi terkunci, snapshot data berversi. Klaim itu jadi dasar kontrak renewal tiga tahun. Kamu diminta audit: verifikasi klaim itu dari log run mentah — bukan dari slide presentasi mereka.",
        story: [
          "Kamis, 16:30. CTO meneruskan satu slide dari vendor: “Reproducibility: 12/12 run identik, AUC 0,8724.” Di bawahnya stempel “TERVERIFIKASI INTERNAL”. “Mereka minta renewal tiga tahun,” katanya. “Sebelum saya tanda tangan, saya mau kamu membuktikan angka ini — dari log mentah, bukan dari slide.”",
          "Kamu tahu aturan mainnya. “Reproduksibel” bukan berarti “angkanya bagus” — melainkan “angka yang sama muncul lagi bila semua inputnya sama”: seed yang sama, kode yang sama, data yang sama, versi paket yang sama. Satu saja berbeda dan angkanya berubah, klaimnya runtuh.",
          "Misi ini memakai data SINTETIS: 13 baris log run eksperimen (seed, versi paket, hash snapshot data, metrik AUC, status). Tugasmu: uji klaim reproduksibilitas dari data mentah, verifikasi hash snapshot, temukan sabotase di laporan vendor, dan putuskan nasib kontraknya.",
        ],
        objectives: [
          "Mengelompokkan run berdasarkan (seed, versi paket, hash data) dan menguji apakah metrik dalam satu grup benar-benar identik.",
          "Memverifikasi konsistensi hash snapshot data antar run yang diklaim “reproduced”.",
          "Menemukan keempat sabotase di laporan vendor dan menulis laporan audit dengan rekomendasi kontrak yang dipertahankan.",
        ],
        prereqSummary:
          "Reproduksibel = menjalankan ulang pipeline dengan input yang SAMA (seed, kode, data, versi paket) menghasilkan angka yang SAMA persis. Seed mengunci keacakan; hash snapshot memastikan datanya identik; pin versi paket memastikan komputasinya identik. Kalau seed dicatat di log tapi tidak diteruskan ke kode, “seed 42” hanyalah hiasan — angkanya tetap acak.",
        datasetNote:
          "Sumber: SINTETIS — 13 baris log run eksperimen yang dirancang manual (seed 42 dinyatakan sebagai seed generator klaim, bukan hasil sampling acak).\nFile run_eksperimen.csv: kolom run_id, seed, paket_sklearn, hash_data, metrik_auc, status. Satu run berstatus FAILED.\nMetode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Log mentah vs klaim vendor",
      prose: [
        "`run_eksperimen.csv` adalah kebenaran mentah: 13 baris log run. Tiap baris mencatat `seed` yang diklaim, `paket_sklearn` yang dipakai, `hash_data` snapshot data, `metrik_auc` yang dihasilkan, dan `status` run. Dari sinilah klaim “12/12 run identik” harus diuji — bukan dari slide.",
        "Satu baris berstatus FAILED dengan metrik kosong. Perhatikan: laporan vendor mengklaim “12/12 run” — sementara file ini punya 13 baris. Selisih satu baris itu bukan detail kecil.",
        "Aturan main: (1) reproduksibilitas diuji PER GRUP konfigurasi identik (seed + paket + hash sama) — bukan per slide; (2) dalam satu grup, metrik harus IDENTIK persis (simpangan baku = 0), bukan “mirip”; (3) hash snapshot yang berbeda = data yang berbeda = tidak bisa dibandingkan.",
      ],
      tasks: [
        { id: "t1", text: "Buka `run_eksperimen.csv`: hitung jumlah baris dan daftar nilai unik kolom `status`" },
        { id: "t2", text: "Catat berapa nilai `hash_data` yang berbeda dan run mana yang statusnya FAILED" },
      ],
      note: {
        title: "Miskonsepsi #1: seed tercatat = seed dipakai",
        type: "pitfall",
        body: "“Di log tertulis seed 42, jadi run ini terkontrol.” SALAH — dan ini pola kegagalan paling umum di industri. Mencatat seed di config/log tidak sama dengan meneruskannya ke RNG di kode. Kalau satu jalur kode memanggil random tanpa seed, log “seed=42” hanyalah kosmetik. Bukti satu-satunya: run berkonfigurasi identik menghasilkan metrik identik.",
      },
      reference:
        "Data SINTETIS (seed 42 dinyatakan): run_eksperimen.csv (13 baris, mentah) vs klaim vendor “12/12 run identik”. Reproduksibilitas diuji dari yang mentah; vonis untuk klaim di slide.",
    },
    {
      id: "lab-repro",
      eyebrow: "Langkah 3 · Lab 1 — Uji klaim “identik”",
      title: "Sama input, beda angka?",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `run_eksperimen.csv`: kelompokkan run berkonfigurasi identik (seed 42, sklearn 1.4.0, hash a3f9c1, status OK) — lalu hitung simpangan baku metrik AUC dalam grup itu. Klaim “identik” berarti simpangan baku = 0 persis. Terakhir: verifikasi hash — run mana yang snapshot datanya berbeda dari mayoritas.",
        "Rumus simpangan baku sampel sudah disiapkan di petunjuk. Ingat: pandas `.std()` default memakai ddof=1 — pakai itu, dan bandingkan dengan ekspektasi 0.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_run` dan `n_gagal`" },
        { id: "t2", text: "Bentuk grup konsensus (seed 42, sklearn 1.4.0, hash a3f9c1, OK); hitung `std_grup_konsensus`" },
        { id: "t3", text: "Temukan `run_hash_beda` — run dengan hash_data berbeda dari mayoritas" },
      ],
      expected:
        "n_run = 13 (1 FAILED); grup konsensus 9 run: std metrik = 0,0012 ≠ 0 → TIDAK reproduksibel. Hash unik: a3f9c1 & 7b2e44 — run r11 memakai snapshot data berbeda.",
      formula: String.raw`\sigma = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}`,
      formulaNote:
        "σ = simpangan baku sampel (ddof=1 — default pandas `.std()`). Untuk input yang benar-benar identik, reproduksibel berarti σ = 0 PERSIS, bukan “kecil”. Hash: semua run yang dibandingkan wajib punya `hash_data` yang sama — hash beda = data beda.",
      note: {
        title: "Miskonsepsi #2: angka mirip = reproduksibel",
        type: "pitfall",
        body: "“0,8698 vs 0,8733 — mirip kan? Berarti reproduksibel.” SALAH. Reproduksibel bukan soal “mirip”, melainkan IDENTIK. Selisih 0,0035 pada AUC bisa membalik keputusan model di ambang bisnis — dan yang lebih penting: kalau inputnya sama persis, tidak ada alasan angkanya berbeda. “Mirip” = ada keacakan yang tidak terkunci.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — baris FAILED punya metrik kosong (NaN).",
        "Grup konsensus: filter empat kondisi sekaligus dengan `&` — ingat tanda kurung di tiap kondisi.",
        "Simpangan baku: `kons[\"metrik_auc\"].std()` — default ddof=1, jangan ubah.",
        "Hash beda: `df.loc[df[\"hash_data\"] != \"a3f9c1\", \"run_id\"]` — ambil yang pertama.",
        "`n_gagal`: hitung baris dengan `df[\"status\"] == \"FAILED\"`.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-pipeline-tak-reproduksibel/run_eksperimen.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_run = ...",
          "n_gagal = ...",
          "",
          "kons = ...   # 9 run: seed 42, sklearn 1.4.0, hash a3f9c1, status OK",
          "std_grup_konsensus = ...",
          "",
          "run_hash_beda = ...   # run_id yang hash_datanya beda dari mayoritas",
          "",
          "print(\"run:\", n_run, \"| gagal:\", n_gagal)",
          "print(\"std grup konsensus:\", round(std_grup_konsensus, 6))",
          "print(\"hash beda:\", run_hash_beda)",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "import numpy as np",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-pipeline-tak-reproduksibel/run_eksperimen.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_run = len(df)",
          "n_gagal = int((df[\"status\"] == \"FAILED\").sum())",
          "",
          "kons = df[(df[\"seed\"] == 42) & (df[\"paket_sklearn\"] == \"sklearn 1.4.0\") & (df[\"hash_data\"] == \"a3f9c1\") & (df[\"status\"] == \"OK\")]",
          "std_grup_konsensus = float(kons[\"metrik_auc\"].std())",
          "",
          "run_hash_beda = df.loc[df[\"hash_data\"] != \"a3f9c1\", \"run_id\"].iloc[0]",
          "",
          "print(\"run:\", n_run, \"| gagal:\", n_gagal)",
          "print(\"std grup konsensus:\", round(std_grup_konsensus, 6))",
          "print(\"hash beda:\", run_hash_beda)",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV run eksperimen." },
          { kind: "equal", task: "t1", label: "`n_run` = 13", name: "n_run", value: 13, msg: "File punya 13 baris run (vendor hanya melaporkan 12)." },
          { kind: "equal", task: "t1", label: "`n_gagal` = 1", name: "n_gagal", value: 1, msg: "Satu run berstatus FAILED — baris yang hilang dari laporan vendor." },
          { kind: "equal", task: "t2", label: "`std_grup_konsensus` ≈ 0,0012", name: "std_grup_konsensus", value: 0.001203, tol: 0.0001, msg: "Bukan 0 → konfigurasi “identik” menghasilkan metrik berbeda. Periksa filter 4 kondisi & .std()." },
          { kind: "equal", task: "t3", label: "`run_hash_beda` = r11", name: "run_hash_beda", value: "r11", msg: "Satu-satunya run dengan hash_data = 7b2e44 (bukan a3f9c1)." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Run mana yang “identik” tapi tidak?",
      title: "Daftar run yang metriknya tak konsisten",
      prose: [
        "Klaim vendor: semua run berkonfigurasi konsensus menghasilkan AUC 0,8724. Di tabel kecil ini (13 run), saring run-run yang MEMENUHI konfigurasi konsensus (seed 42, sklearn 1.4.0, hash a3f9c1, status OK) TAPI metriknya berbeda dari 0,8724.",
        "Tabel `runs(run_id TEXT, seed INTEGER, paket_sklearn TEXT, hash_data TEXT, metrik_auc REAL, status TEXT)`. Tampilkan run_id dan metrik_auc, urut run_id.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query run konsensus yang metriknya ≠ 0,8724, urut run_id" },
      ],
      expected: "5 baris — r05 (0,8701), r06 (0,8733), r07 (0,8719), r08 (0,8698), r09 (0,8729). Lima run “terkontrol” yang ternyata acak.",
      sqlLab: {
        task: "Tampilkan run-run berkonfigurasi KONSENSUS (seed=42, sklearn 1.4.0, hash a3f9c1, status OK) yang metrik_auc-nya BERBEDA dari 0,8724. Kolom: run_id + metrik_auc, urut run_id.",
        schema: "CREATE TABLE runs (run_id TEXT, seed INTEGER, paket_sklearn TEXT, hash_data TEXT, metrik_auc REAL, status TEXT);",
        seedData: [
          "INSERT INTO runs VALUES",
          "('r01',42,'sklearn 1.4.0','a3f9c1',0.8724,'OK'),",
          "('r02',42,'sklearn 1.4.0','a3f9c1',0.8724,'OK'),",
          "('r03',42,'sklearn 1.4.0','a3f9c1',0.8724,'OK'),",
          "('r04',42,'sklearn 1.4.0','a3f9c1',0.8724,'OK'),",
          "('r05',42,'sklearn 1.4.0','a3f9c1',0.8701,'OK'),",
          "('r06',42,'sklearn 1.4.0','a3f9c1',0.8733,'OK'),",
          "('r07',42,'sklearn 1.4.0','a3f9c1',0.8719,'OK'),",
          "('r08',42,'sklearn 1.4.0','a3f9c1',0.8698,'OK'),",
          "('r09',42,'sklearn 1.4.0','a3f9c1',0.8729,'OK'),",
          "('r10',42,'sklearn 1.3.2','a3f9c1',0.8611,'OK'),",
          "('r11',42,'sklearn 1.4.0','7b2e44',0.8751,'OK'),",
          "('r12',42,'sklearn 1.4.0','a3f9c1',NULL,'FAILED'),",
          "('r13',7,'sklearn 1.4.0','a3f9c1',0.8662,'OK');",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT run_id, metrik_auc\nFROM runs\n",
        solution: [
          "SELECT run_id, metrik_auc",
          "FROM runs",
          "WHERE seed = 42",
          "  AND paket_sklearn = 'sklearn 1.4.0'",
          "  AND hash_data = 'a3f9c1'",
          "  AND status = 'OK'",
          "  AND metrik_auc != 0.8724",
          "ORDER BY run_id;",
        ].join("\n"),
        expectedColumns: ["run_id", "metrik_auc"],
        expectedRows: [
          ["r05", 0.8701],
          ["r06", 0.8733],
          ["r07", 0.8719],
          ["r08", 0.8698],
          ["r09", 0.8729],
        ],
        orderMatters: true,
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 5 · Checkpoint keputusan",
      title: "Klaim vendor ini mau kamu apakan?",
      prose: [
        "Angkanya tidak berbohong: 9 run “berkonfigurasi identik” punya std metrik 0,0012 (bukan 0), satu run memakai snapshot data berbeda, satu run beda versi paket, dan satu run gagal disembunyikan dari laporan. Klaim “12/12 run identik” runtuh di empat titik. CTO menunggumu memilih — dan tiap opsi mengubah apa yang terjadi berikutnya.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Rekomendasi apa yang kamu sampaikan ke CTO soal klaim reproduksibilitas vendor? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-bekukan",
            label: "Bekukan kontrak — pipeline harus deterministik dulu",
            rationale:
              "Empat pola kegagalan dalam 13 run; klaim “12/12 identik” terbukti salah. Renewal hanya bila audit ulang lolos dengan bukti mentah.",
            nextStepId: "kons-bekukan",
            consequenceNote:
              "Vendor protes, timeline molor 2 bulan. Tapi audit ulang menemukan bug seed yang mereka perbaiki — kontrak renewal akhirnya ditandatangani dengan SLA reproduksibilitas tertulis. Kamu membayar 2 bulan untuk kepastian.",
          },
          {
            id: "opt-pinning",
            label: "Terima bersyarat — dengan pinning + hash check otomatis",
            rationale:
              "Masalahnya spesifik dan bisa diperbaiki: seed diteruskan ke kode, dependensi di-pin, hash dicek di CI. Beri vendor 30 hari dengan kriteria lolos yang eksplisit.",
            nextStepId: "kons-pinning",
            consequenceNote:
              "Vendor memperbaiki dalam 3 minggu; 20/20 run identik di CI. Kamu dapat pipeline yang bekerja DAN hubungan vendor yang utuh — tapi kamu yang menanggung risiko 30 hari masa tenggang itu.",
          },
          {
            id: "opt-tolak",
            label: "Tolak klaim — cari vendor lain",
            rationale:
              "Laporan menyembunyikan run gagal dan memakai snapshot berbeda sambil mengklaim “reproduced”. Ini soal integritas, bukan soal teknis.",
            nextStepId: "kons-tolak",
            consequenceNote:
              "Migrasi vendor memakan 6 bulan dan biaya 2x lipat. Klaimmu benar secara forensik — tapi CTO bertanya apakah tidak ada jalan tengah. Integritas ada harganya, dan kali ini harganya mahal.",
          },
        ],
      },
    },
    {
      id: "kons-bekukan",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: kontrak dibekukan",
      prose: [
        "CTO membekukan renewal. Vendor protes — “hanya masalah kecil dokumentasi”. Tapi audit ulang yang kamu syaratkan (20 run, CI terbuka, hash dicek otomatis) menemukan bug seed yang nyata: satu modul memang tidak meneruskan seed ke RNG.",
        "Dua bulan kemudian kontrak ditandatangani — kali ini dengan SLA reproduksibilitas tertulis: “20/20 run identik, diverifikasi CI”. Kamu membayar 2 bulan penundaan untuk sesuatu yang tidak bisa dibeli: kepastian bahwa angka vendor bisa dipegang.",
      ],
      tasks: [],
      note: {
        title: "Syarat yang bisa diverifikasi > janji yang manis",
        body: "“Kami akan perbaiki” bukan syarat kontrak. “20/20 run identik di CI dengan hash check otomatis” adalah syarat kontrak. Di deliverable-mu, setiap rekomendasi bersyarat wajib punya kriteria lolos yang bisa dicek ulang oleh orang lain.",
      },
    },
    {
      id: "kons-pinning",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: terima bersyarat",
      prose: [
        "Vendor diberi 30 hari: seed diteruskan ke semua RNG, dependensi di-pin via lockfile, hash snapshot dicek otomatis di CI. Tiga minggu kemudian hasilnya masuk: 20/20 run identik, AUC 0,8724 stabil.",
        "Kamu mendapat pipeline yang bekerja DAN hubungan vendor yang utuh. Tapi jujur: selama 30 hari masa tenggang itu, kamulah yang menanggung risiko — kalau mereka gagal, kamulah yang harus menjelaskan ke CTO kenapa diberi kesempatan. Jalan tengah selalu punya penanggung risiko; pastikan itu keputusan sadar, bukan harapan.",
      ],
      tasks: [],
      note: {
        title: "Jalan tengah butuh tenggat dan kriteria",
        body: "“Bersyarat” tanpa tenggat = “diterima”. Syaratmu harus punya tanggal (“30 hari”) dan kriteria lolos yang terukur (“20/20 run identik”). Tanpa keduanya, bersyarat hanyalah penundaan yang sopan.",
      },
    },
    {
      id: "kons-tolak",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: klaim ditolak",
      prose: [
        "CTO membatalkan renewal. Forensikmu tidak terbantahkan — tapi 6 bulan berikutnya adalah migrasi vendor: integrasi ulang, validasi ulang, biaya 2x lipat. Di satu rapat, CTO bertanya pelan: “Apakah tidak ada jalan tengah waktu itu?”",
        "Kamu tetap benar secara teknis: laporan yang menyembunyikan run gagal adalah masalah integritas. Tapi misi ini mengajarkan harga sebuah vonis: semakin keras keputusanmu, semakin kuat buktinya harus — dan semakin jujur kamu harus tentang biayanya. Validator terbaik tahu kapan cukup dengan “bekukan sampai diperbaiki”.",
      ],
      tasks: [],
      note: {
        title: "Vonis terkeras butuh bukti terkuat",
        body: "Menolak vendor = keputusan termahal di misi ini. Ia benar secara forensik, tapi “bekukan sampai deterministik” mencapai 90% manfaatnya dengan 10% biayanya. Keras bukan selalu bijak — proporsional itu yang dinilai.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 7 · Misi audit",
      title: "Dossier 12 baris: laporan vendor yang “reproduced”",
      prose: [
        "Sebelum menulis laporan, satu misi audit. Di bawah ini 12 baris “Laporan Reproduksibilitas Vendor Q3”, dokumen yang mengklaim pipeline REPRODUKSIBEL. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — std 0,0012 milikmu tidak bisa dibantah oleh stempel “reproduced”.",
        "Senjatamu: 13 run di log mentah (bukan 12), std grup konsensus 0,0012, hash 7b2e44 milik r11, dan 1 run FAILED yang hilang.",
      ],
      tasks: [],
      auditDossier: {
        version: "misi-pipeline-tak-reproduksibel-m2b-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai Laporan Reproduksibilitas Vendor Q3 yang menyatakan pipeline REPRODUKSIBEL.",
        columns: ["Run", "Seed", "Paket", "Hash data", "AUC", "Klaim vendor"],
        rows: [
          { rowId: 1, cells: { "Run": "r01", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8724", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 2, cells: { "Run": "r02", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8724", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 3, cells: { "Run": "r03", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8724", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          { rowId: 4, cells: { "Run": "r04", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8724", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I3: seed dicatat tapi tak dipakai ──
          { rowId: 5, cells: { "Run": "r05–r09", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8698–0,8733", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Fakta", value: "9 run berkonfigurasi identik, metrik TIDAK identik (std 0,0012)" }] },
          // ── I2: dependensi tak di-pin ──
          { rowId: 6, cells: { "Run": "r10", "Seed": "42", "Paket": "sklearn 1.3.2", "Hash data": "a3f9c1", "AUC": "0,8611", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Fakta", value: "Versi paket berbeda dari semua run lain" }] },
          // ── I1: snapshot berbeda ──
          { rowId: 7, cells: { "Run": "r11", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "7b2e44", "AUC": "0,8751", "Klaim vendor": "Reproduced ✓" }, claims: [{ label: "Fakta", value: "Hash snapshot berbeda — datanya BUKAN yang sama" }] },
          // ── I4: run gagal disembunyikan ──
          { rowId: 8, cells: { "Run": "—", "Seed": "—", "Paket": "—", "Hash data": "—", "AUC": "—", "Klaim vendor": "Total: 12 run, semua OK" }, claims: [{ label: "Fakta", value: "Log mentah punya 13 run — 1 berstatus FAILED" }] },
          { rowId: 9, cells: { "Run": "r12", "Seed": "42", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "—", "Klaim vendor": "Dikeluarkan dari laporan" }, claims: [{ label: "Status", value: "FAILED" }] },
          { rowId: 10, cells: { "Run": "r13", "Seed": "7", "Paket": "sklearn 1.4.0", "Hash data": "a3f9c1", "AUC": "0,8662", "Klaim vendor": "Tidak dibandingkan (beda seed — wajar)" }, claims: [{ label: "Terverifikasi", value: "Ya" }] },
          // ── I3 (metode) ──
          { rowId: 11, cells: { "Run": "Metode", "Seed": "Seed 42 dicatat di semua run", "Paket": "—", "Hash data": "—", "AUC": "—", "Klaim vendor": "Diteruskan ke RNG" }, claims: [{ label: "Fakta", value: "Kode memanggil RNG tanpa seed — catatan seed tidak dipakai" }] },
          { rowId: 12, cells: { "Run": "Kesimpulan", "Seed": "—", "Paket": "—", "Hash data": "—", "AUC": "—", "Klaim vendor": "Pipeline reproduksibel" }, claims: [{ label: "Didasarkan", value: "11 baris di atas" }] },
        ],
        injections: [
          { key: "snapshot-beda", rowIds: [7], title: "“Reproduced” dengan snapshot berbeda", clue: "r11 dilabel reproduced tapi hash_data = 7b2e44, bukan a3f9c1. Reproduksibel mensyaratkan DATA yang sama — hash adalah buktinya, bukan klaimnya.", danger: "Membandingkan metrik antar snapshot berbeda = membandingkan apel dan jeruk. Di produksi, ini menyembunyikan degradasi yang sebenarnya disebabkan perubahan data." },
          { key: "dep-tak-di-pin", rowIds: [6], title: "Dependensi tak di-pin mengubah perilaku", clue: "r10 memakai sklearn 1.3.2 (bukan 1.4.0) dan AUC-nya 0,8611 — turun 0,0113 dari konsensus. Tanpa pin versi, “kode yang sama” bisa berperilaku beda.", danger: "Minor version bump bisa mengubah hasil numerik. Tanpa lockfile, pipeline yang “tidak diubah” bisa berubah perilakunya setiap kali environment di-build ulang." },
          { key: "seed-tak-dipakai", rowIds: [5, 11], title: "Seed dicatat tapi tak dipakai", clue: "9 run berkonfigurasi identik (seed 42 tercatat di semua) punya std metrik 0,0012 — bukan 0. Baris metode mengklaim seed diteruskan ke RNG; faktanya satu jalur kode memanggil RNG tanpa seed.", danger: "Pola paling umum di industri: seed ada di config/log, tapi satu jalur kode lupa meneruskannya. Hasilnya eksperimen yang terlihat terkontrol tapi sebenarnya acak — dan keputusan bisnis diambil di atasnya." },
          { key: "run-gagal-disembunyikan", rowIds: [8, 9], title: "Satu run gagal disembunyikan", clue: "Laporan: “12 run, semua OK”. Log mentah: 13 run — r12 FAILED, dikeluarkan diam-diam dari laporan.", danger: "Menyembunyikan kegagalan = survivorship bias yang disengaja. Keputusan kontrak yang diambil dari “12/12 sukses” berdiri di atas 13 run yang sebenarnya terjadi." },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 8 · Deliverable",
      title: "Laporan audit reproduksibilitas + rekomendasi kontrak",
      prose: [
        "Semua bukti di tangan. Tulis laporan audit reproduksibilitas satu halaman untuk CTO — artefak portofoliomu. Laporan yang baik tidak hanya bilang “tidak reproduksibel”, tapi menunjukkan ANGKA kegagalannya, apa yang disembunyikan laporan vendor, dan syarat kontrak yang bisa diverifikasi.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): klaim vendor vs temuan — berapa run yang benar-benar identik.",
          "Bukti kuantitatif: std grup konsensus, hash snapshot yang berbeda, versi paket yang menyimpang, run yang hilang dari laporan.",
          "Temuan audit laporan: keempat sabotase, baris per baris.",
          "Rekomendasi kontrak: bekukan / terima bersyarat dengan pinning / tolak — rujuk keputusanmu di Langkah 5 + syarat yang bisa diverifikasi ulang.",
          "Batas & risiko sisa: apa yang TIDAK diuji audit ini (mis. nondeterminisme GPU, kebocoran data antar split train/test).",
        ],
        rubric: [
          { criterion: "Kebenaran analisis run", weight: 30, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "13 run, std 0,0012, hash beda r11, 1 run FAILED — semua tepat"] },
          { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris"] },
          { criterion: "Kualitas rekomendasi kontrak", weight: 25, levels: ["Tanpa syarat verifikasi", "Ada rekomendasi, syarat kabur", "Rekomendasi + syarat yang bisa dicek ulang (mis. 20/20 run identik di CI)"] },
          { criterion: "Kejujuran batas", weight: 20, levels: ["Mengklaim audit membuktikan segalanya", "Menyebut sebagian batas", "Batas (nondeterminisme GPU, kebocoran split) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 9 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat sabotase di laporan vendor:",
        "1) **Snapshot berbeda** (baris 7): r11 dilabel “reproduced” dengan hash 7b2e44 — data yang berbeda dari 11 run lainnya. Reproduksibel mensyaratkan data yang sama; hash adalah buktinya.",
        "2) **Dependensi tak di-pin** (baris 6): r10 memakai sklearn 1.3.2 dan AUC-nya anjlok 0,0113 — tapi tetap dilabel reproduced. Tanpa lockfile, “kode yang sama” adalah fiksi.",
        "3) **Seed tak dipakai** (baris 5 & 11): 9 run berkonfigurasi identik, std 0,0012 — bukan 0. Metode mengklaim seed diteruskan ke RNG; kode tidak melakukannya. Pola paling umum di industri.",
        "4) **Run gagal disembunyikan** (baris 8–9): “12 run, semua OK” vs 13 run di log mentah — r12 FAILED dikeluarkan diam-diam.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menguji klaim dari log mentah, atau memercayai stempel “reproduced”. Dan ingat keputusan bercabangmu: bekukan (kepastian dengan harga waktu), bersyarat (jalan tengah dengan penanggung risiko), tolak (benar secara forensik, mahal secara bisnis). Tidak ada opsi yang gratis.",
        "Bahaya nyata terakhir: pipeline yang tidak reproduksibel bukan cuma masalah akademik — ia berarti tidak ada eksperimen yang bisa dipercaya. Setiap perbandingan model (“v2 lebih baik dari v1”) bisa jadi artefak keacakan yang tidak terkunci. Keputusan bisnis miliaran rupiah diambil di atas angka yang tidak bisa diulang.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: reproduksibel = benar",
        type: "pitfall",
        body: "“Pipeline kami reproduksibel, jadi model kami benar.” SALAH — reproduksibilitas menjamin KETERULANGAN, bukan KEBENARAN. Bug yang konsisten menghasilkan kesalahan yang konsisten dan “reproduksibel”. Setelah pipeline deterministik, pekerjaan validasi model (apakah angkanya BENAR) baru dimulai.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 10 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "Klaim runtuh: 9 run berkonfigurasi identik punya std metrik 0,0012 (bukan 0) — seed 42 tercatat tapi tidak diteruskan ke kode.",
        "Empat pola sabotase laporan: snapshot berbeda dilabel reproduced, dependensi tak di-pin, seed tak dipakai, run gagal disembunyikan.",
        "Keputusan atas klaim palsu selalu punya harga: bekukan (kepastian, 2 bulan), bersyarat (jalan tengah + tenggat + kriteria), tolak (benar forensik, mahal bisnis).",
        "Reproduksibel = IDENTIK persis (σ = 0), bukan “mirip” — dan hash snapshot adalah bukti data yang sama.",
        "Data: SINTETIS (dirancang manual, seed 42 dinyatakan) — 13 baris log run, dibekukan 2026-10-15; pola kegagalan umum di industri.",
      ],
    },
  ],
};

export default misiRepro;
