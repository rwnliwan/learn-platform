import type { V2Mission } from "../lib/types";

// ── MISI KARTU HANTU: Memburu Fraud di Tumpukan Transaksi ─────────────────
// Fraud/AML Misi A (core). Dataset: SINTETIS — generator berparameter
// (seed 42) yang meniru skema dataset riset fraud kartu kredit publik
// (pola Sparkov: velocity, mismatch kategori, anomali amount). TANPA data
// nasabah asli, TANPA PII; kartu berupa token, merchant fiktif.
// File: public/misi/misi-kartu-hantu/transaksi.csv (bersih, 20.000 baris) +
// transaksi_audit.csv (17 injeksi terdokumentasi). Metode: METODE.md.

const BASE = "/misi/misi-kartu-hantu";

export const misiKartuHantu: V2Mission = {
  slug: "misi-kartu-hantu",
  track: "Fraud/AML",
  module: "Misi",
  title: "Kartu Hantu: Memburu Fraud di Tumpukan Transaksi",
  estMinutes: 130,
  role: "Fraud Analyst",
  client:
    "Head of Fraud Operations bank digital — lonjakan chargeback 3 bulan terakhir; 20.000 transaksi menunggu triase dan timmu hanya bisa menelepon 50 nasabah hari ini",
  xp: 550,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "20.000 transaksi, 50 telepon sehari",
      prose: [],
      tasks: [],
      briefing: {
        role: "Fraud Analyst di bank digital",
        client:
          "Head of Fraud Operations. Chargeback menanjak tiga bulan berturut-turut; 20.000 transaksi menunggu triase, tim hanya bisa menelepon 50 nasabah per hari. Salah pilih 50 orang itu = penipu tetap jalan, nasabah asli malah marah karena kartunya diblokir.",
        story: [
          "Selasa pagi, 08:15. Head of Fraud Operations memanggilmu ke ruangannya — di layar terpampang grafik chargeback yang menanjak tiga bulan berturut-turut. “Dua puluh ribu transaksi menunggu triase,” katanya. “Tim kita cuma bisa menelepon lima puluh nasabah sehari. Kalau kita salah pilih lima puluh orang itu, penipunya tetap jalan, nasabah yang asli malah marah-marah karena kartunya kita blokir.”",
          "Kamu sudah hafal polanya: kartu yang “diambil alih” penipu tidak dipakai seperti kartu normal. Penipu tidak belanja bulanan — mereka menggasak: enam transaksi dalam enam menit, parfum mewah jam tiga pagi, sekali gesek empat puluh kali lipat kebiasaan pemiliknya. Masalahnya, pola-pola itu sesekali juga dilakukan nasabah asli — dan tiap tuduhan yang salah adalah satu hubungan nasabah yang rusak.",
          "Misi ini memberimu tumpukan transaksi untuk di-triase — data SINTETIS yang polanya realistis (kejujurannya dinyatakan di catatan dataset). Tugasmu: bangun aturan deteksi, ukur precision-nya dengan jujur, temukan sabotase yang disuntikkan ke salinan audit, putuskan respons operasionalnya, dan tulis memo yang berani berkata “aturan ini belum layak dipakai” bila memang begitu.",
        ],
        objectives: [
          "Mengukur baseline fraud dari data: fraud rate, kartu-kartu velocity, dan precision aturan sederhana “amount > 3× median kartu”.",
          "Menemukan minimal 3 dari 4 pola sabotase (velocity burst, luxury dini hari, amount anomaly, trans_id duplikat) di dossier audit dengan bukti kuantitatif.",
          "Menulis memo respons fraud: daftar kartu prioritas + bukti, aturan deteksi yang diusulkan + estimasi precision-nya, dan batas-batas data yang dinyatakan eksplisit.",
        ],
        prereqSummary:
          "Precision = dari semua transaksi yang kamu flag, berapa persen yang benar-benar fraud. Recall = dari semua fraud yang ada, berapa persen yang berhasil kamu tangkap. Keduanya tarik-menarik: aturan agresif menangkap banyak fraud (recall tinggi) tapi juga mem-flag banyak nasabah asli — tiap false positive berarti telepon salah sasaran ke nasabah yang marah, atau kartu yang diblokir sia-sia. Velocity = banyak transaksi dalam jendela waktu sempit (mis. 6 transaksi dalam 8 menit), pola klasik kartu yang diambil alih penipu.",
        datasetNote:
          "Data SINTETIS — dibangkitkan dengan generator berparameter (seed tetap 42) yang meniru skema dataset riset fraud kartu kredit publik (pola Sparkov: velocity, mismatch kategori, anomali amount) TANPA data nasabah asli dan TANPA kolom PII. Nomor kartu berupa token sintetis (card_0001 …), merchant FIKTIF (nama generik, bukan merek asli).\nFile transaksi.csv = 20.000 baris bersih (label is_fraud jujur per pola generator).\nFile transaksi_audit.csv = salinan + 17 baris injeksi TERDOKUMENTASI (2 burst velocity, 2 luxury dini hari, 2 amount anomaly ekstrem, 1 trans_id duplikat).\nPola fraud-nya realistis, tetapi angka absolutnya BUKAN kejadian nyata — jangan pernah menyebutnya “data nyata”. Metode: METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Kenali medan sebelum menyentuh angka",
      prose: [
        "Dua file menunggumu di data room — keduanya SINTETIS (dinyatakan jujur di briefing). `transaksi.csv` adalah versi bersih: 20.000 baris transaksi 60 hari dari 2.000 kartu token. Kolomnya: `trans_id, trans_time, card_id, merchant, category, amount, channel, city, is_fraud`. Label `is_fraud` di sini jujur — 189 transaksi (0,95%) ditandai fraud sesuai pola generatornya. Ini fondasimu mengukur baseline: berapa fraud rate-nya, seperti apa pola velocity-nya, seberapa bagus aturan sederhana.",
        "`transaksi_audit.csv` adalah salinan yang “dikirim” tim operasional — dan yang akan kamu audit. Isinya sama, tapi seseorang menyuntikkan 17 baris ke dalamnya tanpa pengumuman: 2 burst velocity (6 transaksi dalam 8 menit), 2 transaksi luxury jam 03:12/03:47, 2 amount anomaly 40× median kartu, dan 1 trans_id yang digandakan (double-charge). Detail tiap suntikan ada di `METODE.md` — tapi membacanya sekarang sama dengan mengintip kunci jawaban. Jangan.",
        "Aturan main data room: (1) baseline dan aturan HANYA dari file bersih; (2) kecurigaan HANYA dari file audit/dossier; (3) setiap tuduhan anomali wajib punya bukti angka — “kelihatannya aneh” bukan bukti. Dan ingat: label `is_fraud` di file bersih adalah kemewahan yang tidak kamu miliki di dunia nyata — di sana kamu harus menebak tanpa kunci jawaban.",
      ],
      tasks: [
        { id: "t1", text: "Buka `transaksi.csv` dan catat: berapa baris, kolom apa saja, berapa nilai unik `is_fraud`" },
        { id: "t2", text: "Catat definisi tiap kolom: apa arti `channel` (chip/online), dan apa bedanya `card_id` token dengan nomor kartu asli" },
      ],
      note: {
        title: "Miskonsepsi #1: akurasi 99,8% = model bagus",
        type: "pitfall",
        body: "Model yang memprediksi “semua transaksi aman” di data ini punya akurasi 99,05% — dan menangkap NOL fraud. Pada data yang timpang (fraud di bawah 1%), akurasi adalah metrik penipu: ia memberi nilai nyaris sempurna untuk model yang tidak berguna. Yang penting adalah precision (berapa flag yang benar) dan recall (berapa fraud yang ketangkap) — plus biaya dari tiap kesalahan.",
      },
      reference:
        "transaksi.csv (bersih, 20.000 baris, 189 fraud) vs transaksi_audit.csv (17 suntikan). Baseline dari yang bersih; audit pada yang kotor.",
    },
    {
      id: "lab-eda",
      eyebrow: "Langkah 3 · Lab 1 — Baseline fraud",
      title: "Seberapa jujur aturan “3× median”?",
      prose: [
        "Sebelum menuduh, ukur. Tiga angka fondasimu: (1) fraud rate — berapa persen transaksi yang fraud; (2) kartu velocity — berapa kartu dengan ≥5 transaksi dalam 10 menit (dihitung via groupby `card_id` + selisih waktu); (3) precision aturan sederhana: flag semua transaksi dengan amount > 3× median kartu itu sendiri, lalu hitung berapa persen dari yang di-flag yang benar-benar fraud.",
        "Angka ketiga adalah jantung misi ini. Precision 1,6% artinya: dari 1.000 kartu yang kamu telepon, 984 adalah nasabah asli yang tidak bersalah — padahal timmu hanya bisa menelepon 50 orang sehari. Aturan yang “menangkap fraud” tapi precision-nya rendah bukan solusi; itu mesin pembuat nasabah marah.",
        "Lab ini memakai file bersih (`transaksi.csv`). Data dimuat langsung dari server dengan `open_url` — path relatif ke situs ini, tanpa token apa pun.",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV ke `df`; hitung `n_baris` dan `fraud_rate` (rata-rata kolom `is_fraud`)" },
        { id: "t2", text: "Hitung kartu dengan ≥5 transaksi dalam 10 menit → `n_velocity_cards` (sortir per card_id, groupby + shift 4 langkah, selisih ≤ 10 menit)" },
        { id: "t3", text: "Hitung precision aturan `amount > 3× median kartu` → `precision_aturan`, lalu print keempat angka" },
      ],
      expected:
        "n_baris=20000, fraud_rate=0.0095 (0,95%), n_velocity_cards=30, precision_aturan=0.016 (1,6% dari 1360 yang di-flag)",
      note: {
        title: "Miskonsepsi #2: false positive itu gratis",
        type: "pitfall",
        body: "“Yang penting tidak ada fraud yang lolos.” Kedengarannya heroik — sampai kamu yang menelepon nasabah ke-984 yang kartunya diblokir padahal ia cuma beli kado anniversary. False positive punya harga: kepercayaan nasabah, beban call center, dan analis yang kelelahan mengejar bayangan. Aturan dengan precision 1,6% bukan “ketat”, melainkan “asal bunyi”.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))`; ubah `trans_time` ke datetime.",
        "Velocity: sortir per `card_id` + `trans_time`, lalu `groupby(\"card_id\")[\"trans_time\"].shift(-4)` = waktu transaksi ke-4 setelahnya; selisih ≤ 10 menit → kartu velocity.",
        "Precision: `median_kartu = groupby(\"card_id\")[\"amount\"].transform(\"median\")`; flag = `amount > 3*median_kartu`; precision = rata-rata `is_fraud` pada baris yang di-flag.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-kartu-hantu/transaksi.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "df[\"trans_time\"] = pd.to_datetime(df[\"trans_time\"])",
          "",
          "n_baris = ...        # banyak baris",
          "fraud_rate = ...     # rata-rata is_fraud",
          "",
          "df_v = df.sort_values([\"card_id\", \"trans_time\"]).copy()",
          "t_depan = ...        # waktu transaksi ke-4 setelahnya, per kartu",
          "selang = ...         # selisih menit t_depan - trans_time",
          "n_velocity_cards = ...  # kartu dengan selisih <= 10 menit",
          "",
          "median_kartu = ...   # median amount per kartu, sejajar tiap baris",
          "di_flag = ...        # amount > 3x median kartu",
          "precision_aturan = ...  # rata-rata is_fraud pada yang di-flag",
          "",
          "print(\"baris:\", n_baris, \"| fraud_rate:\", round(fraud_rate, 4))",
          "print(\"kartu velocity:\", n_velocity_cards)",
          "print(\"precision aturan 3x median:\", round(precision_aturan, 3))",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-kartu-hantu/transaksi.csv\"",
          "",
          "# TUGASMU: lengkapi baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "df[\"trans_time\"] = pd.to_datetime(df[\"trans_time\"])",
          "",
          "n_baris = len(df)",
          "fraud_rate = float(df[\"is_fraud\"].mean())",
          "",
          "df_v = df.sort_values([\"card_id\", \"trans_time\"]).copy()",
          "t_depan = df_v.groupby(\"card_id\")[\"trans_time\"].shift(-4)",
          "selang = (t_depan - df_v[\"trans_time\"]).dt.total_seconds() / 60",
          "n_velocity_cards = int(df_v.loc[selang <= 10, \"card_id\"].nunique())",
          "",
          "median_kartu = df_v.groupby(\"card_id\")[\"amount\"].transform(\"median\")",
          "di_flag = df_v[\"amount\"] > 3 * median_kartu",
          "precision_aturan = float(df_v.loc[di_flag, \"is_fraud\"].mean())",
          "",
          "print(\"baris:\", n_baris, \"| fraud_rate:\", round(fraud_rate, 4))",
          "print(\"kartu velocity:\", n_velocity_cards)",
          "print(\"precision aturan 3x median:\", round(precision_aturan, 3))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 20000", name: "n_baris", value: 20000, msg: "File bersih punya tepat 20.000 baris transaksi." },
          { kind: "equal", task: "t1", label: "`fraud_rate` = 0.00945", name: "fraud_rate", value: 0.00945, tol: 0.0005, msg: "Fraud rate = rata-rata is_fraud: 189/20000 = 0,945%. Kurang dari 1% — inilah kenapa akurasi menipu." },
          { kind: "equal", task: "t2", label: "`n_velocity_cards` = 30", name: "n_velocity_cards", value: 30, msg: "30 kartu punya burst 5–8 transaksi dalam <10 menit (pola generator). Kalau dapat 32, kamu menghitung file audit — lab ini memakai file BERSIH." },
          { kind: "equal", task: "t3", label: "`precision_aturan` = 0.0162", name: "precision_aturan", value: 0.016176, tol: 0.005, msg: "Dari 1360 transaksi yang di-flag, hanya ~1,6% yang benar fraud. Inilah harga aturan sederhana — 98,4% telepon salah sasaran." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Pola velocity di SQL",
      title: "Siapa yang belanja 4 kali dalam sejam?",
      prose: [
        "Senjata keduamu: SQL. Aturan velocity (“≥4 transaksi dalam 1 jam yang sama”) adalah query `GROUP BY` klasik di meja analis fraud: kelompokkan per kartu per jam, saring yang hitungannya ≥4 dengan `HAVING`. Di tabel kecil ini (12 baris laporan 4 kartu), tepat 2 kartu memenuhi pola — dan sisanya tidak.",
        "Tabel `transaksi(trans_id, trans_time, card_id, merchant, category, amount, channel, city, is_fraud)`. Kolom `trans_time` berformat `YYYY-MM-DD HH:MM:SS` — potong jamnya dengan `strftime('%Y-%m-%d %H', trans_time)`, lalu kelompokkan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query yang mengembalikan kartu dengan ≥4 transaksi dalam jam yang sama (kolom: card_id, jam, n)" },
      ],
      expected: "2 baris: card_9001 jam 2026-09-01 10 (n=4) dan card_9002 jam 2026-09-02 15 (n=4)",
      sqlLab: {
        task: "Temukan kartu dengan ≥4 transaksi dalam 1 jam yang sama: kelompokkan per (card_id, jam) dan saring dengan HAVING COUNT(*) >= 4.",
        schema: "CREATE TABLE transaksi (trans_id TEXT, trans_time TEXT, card_id TEXT, merchant TEXT, category TEXT, amount INTEGER, channel TEXT, city TEXT, is_fraud INTEGER);",
        seedData: [
          "INSERT INTO transaksi VALUES",
          "('TX-S01', '2026-09-01 10:05:00', 'card_9001', 'Kopi Sore Tebet', 'dining', 45000, 'chip', 'Jakarta', 0),",
          "('TX-S02', '2026-09-01 10:12:00', 'card_9001', 'Segar Mart Kelapa Gading', 'groceries', 230000, 'chip', 'Jakarta', 0),",
          "('TX-S03', '2026-09-01 10:23:00', 'card_9001', 'Apotek Sehat Cempaka', 'health', 85000, 'chip', 'Jakarta', 0),",
          "('TX-S04', '2026-09-01 10:47:00', 'card_9001', 'SPBU Rest Area KM 57', 'fuel', 350000, 'chip', 'Jakarta', 0),",
          "('TX-S05', '2026-09-02 15:02:00', 'card_9002', 'Gadget Plaza Mangga Dua', 'electronics', 4500000, 'online', 'Jakarta', 1),",
          "('TX-S06', '2026-09-02 15:09:00', 'card_9002', 'Butik Jam Plaza Senayan', 'luxury', 12500000, 'online', 'Jakarta', 1),",
          "('TX-S07', '2026-09-02 15:15:00', 'card_9002', 'Tas Branded Pondok Indah', 'luxury', 8700000, 'online', 'Jakarta', 1),",
          "('TX-S08', '2026-09-02 15:58:00', 'card_9002', 'Parfum Eksklusif Grand Sudirman', 'luxury', 2300000, 'online', 'Jakarta', 1),",
          "('TX-S09', '2026-09-01 10:08:00', 'card_9003', 'Kopi Sore Tebet', 'dining', 50000, 'chip', 'Bandung', 0),",
          "('TX-S10', '2026-09-01 10:31:00', 'card_9003', 'Bakmi Jawa Malioboro', 'dining', 75000, 'chip', 'Bandung', 0),",
          "('TX-S11', '2026-09-01 10:55:00', 'card_9003', 'Toko Buah Nusantara Bogor', 'groceries', 120000, 'chip', 'Bandung', 0),",
          "('TX-S12', '2026-09-03 09:15:00', 'card_9004', 'SPBU Cikampek Utama', 'fuel', 300000, 'chip', 'Jakarta', 0);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT card_id\nFROM transaksi\n",
        solution: [
          "SELECT card_id, strftime('%Y-%m-%d %H', trans_time) AS jam, COUNT(*) AS n",
          "FROM transaksi",
          "GROUP BY card_id, jam",
          "HAVING COUNT(*) >= 4;",
        ].join("\n"),
        expectedColumns: ["card_id", "jam", "n"],
        expectedRows: [
          ["card_9001", "2026-09-01 10", 4],
          ["card_9002", "2026-09-02 15", 4],
        ],
      },
    },
  ],
};

export default misiKartuHantu;

// ── lanjutan misiKartuHantu: append langkah 5–10 ke array steps ──────────
import type { V2Step } from "../lib/types";

const LANJUTAN_KARTU_HANTU: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Pagi ini: 1.360 kartu di-flag, timmu cuma bisa menelepon 50",
    prose: [
      "Aturan 3× median-mu me-flag 1.360 kartu — dan tim hanya bisa menelepon 50 nasabah hari ini. Head of Fraud Operations butuh keputusan pagi ini juga: apa yang kita lakukan dengan kartu-kartu yang di-flag? Tiga opsi, tidak ada yang gratis. Pilihanmu final — seperti memo yang sudah dikirim ke klien — dan mengubah bukti apa yang kamu lihat di langkah berikut.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Respons operasional apa yang kamu ambil pagi ini terhadap kartu-kartu yang di-flag? (Keputusan final.)",
      options: [
        {
          id: "opt-blokir",
          label: "Blokir kartu + telepon nasabah sekarang — kejar 50 kartu teratas",
          rationale:
            "Cepat dan terlihat tegas: blokir 50 kartu dengan nominal terbesar, telepon pemiliknya hari ini. Kalau benar fraud, kerugian berhenti detik ini juga.",
          nextStepId: "temuan-blokir",
          consequenceNote:
            "Dari 50 kartu yang diblokir, 49 adalah nasabah asli — call center kebanjiran komplain dan 3 nasabah menutup rekeningnya minggu itu. Satu fraudster tertangkap, tapi jaringannya sudah pindah ke kartu lain sebelum kamu sempat memetakannya.",
        },
        {
          id: "opt-monitoring",
          label: "Monitoring diam-diam 48 jam — kumpulkan bukti jaringan",
          rationale:
            "Jangan beri tahu siapa-siapa dulu: awasi 48 jam, petakan kartu-merchant yang berulang, kumpulkan bukti jaringan sebelum bertindak. Presisi penindakan jauh lebih tinggi.",
          nextStepId: "temuan-monitoring",
          consequenceNote:
            "Dalam 48 jam polanya jelas: 12 kartu berbagi 3 merchant online yang sama — satu jaringan. Kamu menangkap semuanya sekaligus. Tapi selama 48 jam itu fraud tetap berjalan: kerugian +Rp 214 juta yang sebenarnya bisa dicegah.",
        },
        {
          id: "opt-antrean",
          label: "Masukkan ke antrean manual review — aman dan prosedural",
          rationale:
            "Prosedur yang benar: semua 1.360 kartu masuk antrean review analis. Tidak ada nasabah yang diblokir sembarangan, tidak ada risiko salah tuduh.",
          nextStepId: "temuan-antrean",
          consequenceNote:
            "Antrean analis: 1.360 kartu ÷ 50 per hari = 27 hari kerja. Kartu-kartu fraud tetap aktif berminggu-minggu — dan 3 minggu kemudian chargeback meledak 2× lipat karena komplotan yang sama menggasak kartu-kartu lain yang “aman” di antrean.",
        },
      ],
    },
  },
  {
    id: "temuan-blokir",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi keputusan",
    title: "Hasil: 49 telepon salah sasaran",
    prose: [
      "Kamu memblokir 50 kartu dan menelepon pemiliknya hari itu juga. Hasilnya pahit: 49 dari 50 adalah nasabah asli — seorang ibu yang beli kado anniversary, seorang sales yang isi bensin armada, seorang traveler yang bayar hotel. Call center menerima 200+ komplain dalam dua hari; tiga nasabah menutup rekeningnya dan pindah bank.",
      "Satu fraudster tertangkap — kartu card_0986 dengan burst 6 transaksi dalam 6 menit. Tapi kemenangan itu kecil: tanpa pemetaan jaringan, kamu tidak tahu kartu mana lagi yang dipegang komplotan yang sama. Mereka sudah pindah target sebelum analis sempat melihat polanya.",
      "Pelajaran: precision 1,6% berarti tiap 50 tindakan, ~49 salah sasaran. Blokir massal tanpa prioritas bukan ketegasan — itu undian berhadiah kemarahan nasabah. Yang seharusnya diblokir duluan: kartu-kartu velocity (30 kartu dengan bukti kuat), bukan 50 kartu dengan nominal terbesar.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: presisi sebelum kecepatan",
      body: "Kecepatan tanpa presisi = memblokir nasabah sendiri. Di fraud operations, urutan yang benar: (1) ukur precision aturanmu, (2) prioritaskan bukti terkuat (velocity burst), (3) baru bertindak. Tulis di deliverable-mu: berapa precision aturan yang kamu usulkan, dan berapa false positive per hari yang kamu terima.",
    },
  },
  {
    id: "temuan-monitoring",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi keputusan",
    title: "Hasil: jaringan tertangkap, Rp 214 juta melayang",
    prose: [
      "Kamu menahan diri 48 jam. Tim analis memetakan: 12 kartu yang di-flag ternyata bertransaksi di 3 merchant online yang sama, dengan pola burst yang mirip — satu jaringan, satu komplotan. Penindakan serentak menangkap semuanya; bukti jaringannya cukup kuat untuk laporan ke kepolisian.",
      "Tapi selama 48 jam “diam-diam” itu, kartu-kartu tersebut tetap aktif. Kerugian bertambah Rp 214 juta — uang nasabah yang sebenarnya bisa dicegah kalau kamu bertindak di jam pertama.",
      "Pelajaran: monitoring memberi bukti terbaik dengan harga termahal. Trade-off ini nyata di fraud operations: tiap jam bukti tambahan = tiap jam kerugian berjalan. Keputusan yang dewasa bukan “monitoring selalu benar”, melainkan: untuk KASUS APA monitoring layak dibayar — dan kapan harus langsung blokir (velocity burst 6 transaksi/6 menit = blokir dulu, verifikasi kemudian).",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: bukti punya harga per jam",
      body: "Monitoring 48 jam membeli kepastian dengan Rp 214 juta. Kadang itu layak (jaringan besar), kadang tidak (satu kartu velocity yang jelas = blokir langsung). Di deliverable-mu, bedakan respons per pola: pola mana yang layak blokir instan, mana yang layak monitoring.",
    },
  },
  {
    id: "temuan-antrean",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi keputusan",
    title: "Hasil: antrean 27 hari, fraud jalan terus",
    prose: [
      "Kamu memilih jalur prosedural: 1.360 kartu masuk antrean manual review. Dengan kapasitas 50 kartu per hari, antrean baru habis 27 hari kerja kemudian. Tidak ada nasabah yang diblokir sembarangan — dan tidak ada fraudster yang dihentikan.",
      "Tiga minggu kemudian, chargeback meledak 2× lipat. Kartu-kartu yang “aman menunggu antrean” ternyata dipegang komplotan yang sama — mereka menggasak habis sebelum giliran review tiba. Prosedur yang sempurna melindungi bank dari komplain, tapi tidak melindungi nasabah dari pencurian.",
      "Pelajaran: kapasitas terbatas membuat PRIORITAS menjadi segalanya. Antrean FIFO (first-in-first-out) di fraud = memberi penipu waktu 27 hari. Yang benar: triase berlapis — velocity burst langsung ke puncak antrean (atau blokir otomatis), sisanya menunggu. “Aman dan prosedural” tanpa prioritas = keputusan untuk tidak memutuskan.",
    ],
    tasks: [],
    note: {
      title: "Pelajaran keputusan: antrean tanpa prioritas = hadiah untuk penipu",
      body: "50 slot per hari adalah fakta; 1.360 kartu adalah fakta. Satu-satunya variabel yang kamu kendalikan adalah URUTAN. Di deliverable-mu, tulis aturan triase eksplisit: pola apa yang naik ke prioritas 1, dan kenapa.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 20 baris: temukan 4 sabotase yang disuntikkan",
    prose: [
      "Sekarang misi auditnya. Di bawah ini 20 baris dari `transaksi_audit.csv` — dossier yang diklaim “sudah terverifikasi sistem”. Seseorang menyuntikkan 4 sabotase ke dalamnya tanpa pengumuman. Tandai baris yang janggal, lalu buka debrief.",
      "Senjatamu: baseline dari Lab 1 (fraud rate 0,95%, 30 kartu velocity, precision aturan 3× median hanya 1,6%), teknik velocity dari Lab 2, dan akal sehat — parfum jam 3 pagi bukan belanja normal, dan satu ID transaksi tidak boleh muncul dua kali.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-kartu-hantu-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim berisi 20 baris transaksi yang sudah terverifikasi sistem (cuplikan transaksi_audit.csv).",
      columns: ["Kartu", "Waktu", "Merchant", "Nominal"],
      rows: [
        { rowId: 1, cells: { "Kartu": "card_0712", "Waktu": "2026-08-17 09:17", "Merchant": "SPBU Porong Sidoarjo", "Nominal": "Rp 77.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000135" }] },
        { rowId: 2, cells: { "Kartu": "card_1964", "Waktu": "2026-08-17 09:29", "Merchant": "Sepatu Sport Senayan", "Nominal": "Rp 39.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000137" }] },
        { rowId: 3, cells: { "Kartu": "card_0923", "Waktu": "2026-08-17 09:42", "Merchant": "Ferry Merak Express", "Nominal": "Rp 230.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000139" }] },
        { rowId: 4, cells: { "Kartu": "card_1561", "Waktu": "2026-08-17 09:58", "Merchant": "Komputer Harco Mangga Dua", "Nominal": "Rp 164.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000142" }] },
        { rowId: 5, cells: { "Kartu": "card_1148", "Waktu": "2026-08-17 10:00", "Merchant": "Bakmi Jawa Malioboro", "Nominal": "Rp 510.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000144" }] },
        { rowId: 6, cells: { "Kartu": "card_0031", "Waktu": "2026-08-17 10:03", "Merchant": "Pasar Modern BSD", "Nominal": "Rp 422.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000145" }] },
        { rowId: 7, cells: { "Kartu": "card_1466", "Waktu": "2026-08-17 10:06", "Merchant": "SPBU Tol Jagorawi", "Nominal": "Rp 1.931.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000146" }] },
        { rowId: 8, cells: { "Kartu": "card_0612", "Waktu": "2026-08-17 10:08", "Merchant": "Smart Home Kemang", "Nominal": "Rp 54.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000147" }] },
        { rowId: 9, cells: { "Kartu": "card_0573", "Waktu": "2026-08-17 10:19", "Merchant": "Lab Klinik Sehat Tebet", "Nominal": "Rp 133.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000149" }] },
        { rowId: 10, cells: { "Kartu": "card_1951", "Waktu": "2026-08-17 10:25", "Merchant": "Optik Cahaya Depok", "Nominal": "Rp 194.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000151" }] },
        { rowId: 11, cells: { "Kartu": "card_0829", "Waktu": "2026-08-17 10:36", "Merchant": "Fashion Outlet Dago", "Nominal": "Rp 358.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000153" }] },
        { rowId: 12, cells: { "Kartu": "card_1074", "Waktu": "2026-08-17 10:36", "Merchant": "Tas Branded Pondok Indah", "Nominal": "Rp 244.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000154" }] },
        { rowId: 13, cells: { "Kartu": "card_1589", "Waktu": "2026-08-17 10:45", "Merchant": "Smart Home Kemang", "Nominal": "Rp 330.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000158" }] },
        // ── I1: velocity burst — 2 baris contoh dari 6 transaksi card_0986 dalam ~6 menit ──
        { rowId: 14, cells: { "Kartu": "card_0986", "Waktu": "2026-10-14 12:13", "Merchant": "Audio Visual Senayan", "Nominal": "Rp 147.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-020001" }, { label: "Pola velocity", value: "Wajar" }] },
        { rowId: 15, cells: { "Kartu": "card_0986", "Waktu": "2026-10-14 12:19", "Merchant": "SPBU Tol Jagorawi", "Nominal": "Rp 150.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-020006" }, { label: "Pola velocity", value: "Wajar" }] },
        // ── I2: luxury jam 03:12 (category mismatch) ──
        { rowId: 16, cells: { "Kartu": "card_1741", "Waktu": "2026-09-09 03:12", "Merchant": "Parfum Eksklusif Grand Sudirman", "Nominal": "Rp 5.401.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-020013" }, { label: "Jam transaksi", value: "Jam operasional" }] },
        // ── I3: amount anomaly 40× median profil kartu ──
        { rowId: 17, cells: { "Kartu": "card_1180", "Waktu": "2026-09-12 19:17", "Merchant": "Bakmi Jawa Malioboro", "Nominal": "Rp 11.080.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-020015" }, { label: "Rasio vs median", value: "Normal" }] },
        // ── I4: trans_id duplikat (double-charge) ──
        { rowId: 18, cells: { "Kartu": "card_0135", "Waktu": "2026-09-03 13:04", "Merchant": "Ayam Bakar Dago", "Nominal": "Rp 26.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-005839" }, { label: "ID unik", value: "Ya" }] },
        { rowId: 19, cells: { "Kartu": "card_0135", "Waktu": "2026-09-03 13:04", "Merchant": "Ayam Bakar Dago", "Nominal": "Rp 26.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-005839" }, { label: "ID unik", value: "Ya" }] },
        { rowId: 20, cells: { "Kartu": "card_1748", "Waktu": "2026-08-17 10:50", "Merchant": "Komputer Harco Mangga Dua", "Nominal": "Rp 770.000" }, claims: [{ label: "Status verifikasi", value: "Terverifikasi sistem" }, { label: "ID transaksi", value: "TX-000161" }] },
      ],
      injections: [
        { key: "velocity-burst", rowIds: [14, 15], title: "Velocity burst terselubung", clue: "Dua baris contoh dari 6 transaksi kartu card_0986 dalam ~6 menit (12:13–12:19, TX-020001 s.d. TX-020006) — semua channel online, semua merchant di luar kebiasaan kartu. Klaim dossier “pola wajar” adalah bohong.", danger: "Kartu yang diambil alih dikuras habis dalam hitungan menit; tiap menit tunda = limit kartu terkuras. Aturan velocity (≥5 transaksi/10 menit) menangkapnya otomatis — tanpa analis begadang." },
        { key: "luxury-dini-hari", rowIds: [16], title: "Luxury jam 03:12 (category mismatch)", clue: "Parfum Rp 5,4 juta dibeli jam 03:12 pagi via online (TX-020013). Pemilik kartu yang asli sedang tidur — pola klasik kartu curian: barang mudah dijual kembali, dibeli saat pemilik tidak sadar.", danger: "Barang luxury mudah dicairkan kembali; penipu mengincar jam tidur pemilik agar notifikasi tak terlihat. Sinyal terkuat datang dari KOMBINASI kategori × jam × channel." },
        { key: "amount-anomaly", rowIds: [17], title: "Amount anomaly 40× median kartu", clue: "Rp 11.080.000 untuk semangkuk bakmi (TX-020015) — 40× median profil kartu card_1180 (Rp 277 ribu). Bukan cuma nominal besar; ini nominal yang MUSTAHIL untuk merchant-nya.", danger: "Nominal besar SAJA bukan bukti (orang kaya belanja besar itu wajar). Yang janggal adalah nominal RELATIF terhadap kebiasaan kartu dan merchant-nya — makanya aturan memakai “3× median kartu”, bukan “di atas Rp 10 juta”." },
        { key: "duplikat-trans-id", rowIds: [18, 19], title: "trans_id ganda (double-charge)", clue: "TX-005839 muncul dua kali dengan semua kolom identik — nasabah di-charge dua kali Rp 26.000. Klaim “ID unik: Ya” di kedua baris adalah bohong.", danger: "Bukan ulah penipu — tapi nasabah tetap dirugikan, dan chargeback double-charge mengotori metrik fraud bank. Obatnya murah: constraint unik di database." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo respons fraud untuk Head of Fraud Ops",
    prose: [
      "Semua bukti di tangan. Sekarang tulis seperti profesional: memo respons fraud satu halaman untuk Head of Fraud Operations. Ini artefak portofoliomu — tulis seolah akan dibaca pengambil keputusan sungguhan yang hanya punya 50 slot telepon sehari.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): berapa fraud rate-nya, pola apa yang paling berbahaya, dan apa rekomendasi utamamu?",
        "Daftar kartu prioritas + bukti: kartu mana yang diblokir/ditelepon duluan — rujuk pola velocity/mismatch/anomaly dengan angka.",
        "Aturan deteksi yang diusulkan + estimasi precision: aturan apa yang kamu pakai, berapa precision-nya (dari Lab 1), dan berapa false positive per hari yang kamu terima.",
        "Keputusan yang TIDAK kamu ambil: opsi respons apa yang kamu tolak, dan apa risiko dari penolakan itu.",
        "Batas data (kejujuran): nyatakan bahwa data ini SINTETIS; apa yang TIDAK bisa disimpulkan (mis. tanpa data jaringan antar-kartu → komplotan tak terpetakan; tanpa label nyata → precision di dunia nyata bisa lebih buruk).",
      ],
      rubric: [
        { criterion: "Deteksi pola fraud", weight: 25, levels: ["Tidak menyebut pola velocity/mismatch/anomaly", "Menyebut pola tanpa bukti angka", "Pola disebut dengan bukti angka dari lab/audit"] },
        { criterion: "Trade-off precision vs kerugian", weight: 30, levels: ["Mengabaikan false positive / kerugian fraud", "Menyebut trade-off tanpa angka", "Precision dihitung + biaya false positive vs kerugian fraud ditimbang eksplisit"] },
        { criterion: "Kualitas keputusan operasional", weight: 20, levels: ["Pilihan tanpa alasan", "Alasan ada tapi biaya peluang tak diakui", "Alasan + biaya peluang + prioritas triase eksplisit"] },
        { criterion: "Kejujuran batas data", weight: 25, levels: ["Mengklaim data nyata / melebih-lebihkan temuan", "Menyebut sebagian batas", "SINTETIS dinyatakan + batas inferensi eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase yang disuntikkan ke dossier — semuanya pola nyata di fraud operations:",
      "1) **Velocity burst** (baris 14–15): dua baris contoh dari 6 transaksi kartu card_0986 dalam ~6 menit (TX-020001 s.d. TX-020006), semua online, semua merchant di luar kebiasaan kartu. Di dunia nyata: kartu yang diambil alih dikuras secepat mungkin sebelum pemilik sadar. Obatnya: aturan velocity otomatis (≥5 transaksi/10 menit → tahan + verifikasi), bukan analis yang begadang.",
      "2) **Luxury dini hari** (baris 16): parfum Rp 5,4 juta jam 03:12 via online. Category mismatch + jam tidur pemilik = tanda tangan kartu curian. Pelajaran: sinyal terkuat sering datang dari KOMBINASI (kategori × jam × channel), bukan satu kolom.",
      "3) **Amount anomaly** (baris 17): Rp 11.080.000 untuk bakmi — 40× median profil kartu card_1180. Pelajaran penting: nominal besar SAJA bukan bukti (orang kaya belanja besar itu wajar); yang janggal adalah nominal relatif terhadap KEBIASAAN kartu dan merchant-nya. Inilah kenapa aturanmu memakai “3× median kartu”, bukan “di atas Rp 10 juta”.",
      "4) **trans_id duplikat** (baris 18–19): TX-005839 muncul dua kali persis — double-charge Rp 26.000. Ini bukan ulah penipu, tapi nasabah tetap dirugikan dan metrik fraud bank ikut kotor. Obatnya murah: constraint unik di database — yang justru mahal adalah saat ia tidak dipasang.",
      "Dan pelajaran terbesar dari Lab 1: aturan “3× median” menangkap fraud dengan precision 1,6% — dari 1.360 yang di-flag, ~1.338 adalah nasabah asli. Di fraud operations, kamu tidak kekurangan “aturan yang menangkap”; kamu kekurangan aturan yang menangkap TANPA membakar kepercayaan 1.338 nasabah. Itulah kenapa keputusanmu di Langkah 5 punya harga — dan kenapa triase berlapis (velocity dulu, sisanya antre) mengalahkan satu aturan untuk semua.",
      "Skor deteksimu (x/4) bukan nilai ujian — itu cerminan radar fraud yang kamu bawa. Di pekerjaan nyata, tiap pola yang lolos = kerugian yang berjalan; tiap false positive = nasabah yang pergi. Keseimbangan keduanya — bukan salah satunya — adalah pekerjaan Fraud Analyst.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: fraud berhenti saat satu kartu diblokir",
      type: "risk",
      body: "Penipu tidak pensiun saat satu kartu mati — mereka pindah ke kartu berikutnya, merchant berikutnya, pola berikutnya. Itu sebabnya opsi “monitoring 48 jam” tadi menangkap JARINGAN, bukan cuma kartu. Fraud operations yang dewasa mengejar komplotan (pola antar-kartu), bukan berduel satu kartu. Dan aturanmu harus dievaluasi ulang berkala — karena musuhmu juga belajar.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Baseline dulu, tuduhan kemudian: fraud rate 0,95%, 30 kartu velocity, dan precision aturan “3× median” hanya 1,6% — angka-angka ini yang membuat keputusanmu berdasar, bukan firasat.",
      "Tiga pola fraud kartu: velocity (banyak transaksi, jendela sempit), mismatch (kategori × jam × channel yang tak wajar), amount anomaly (nominal relatif terhadap kebiasaan kartu, bukan nominal absolut).",
      "Precision vs kerugian adalah trade-off inti: aturan agresif menangkap fraud tapi membakar kepercayaan nasabah — ukur precision-mu sebelum bertindak, dan triase berlapis mengalahkan satu aturan untuk semua.",
      "Keputusan operasional selalu punya biaya peluang: blokir cepat, monitoring 48 jam, atau antrean 27 hari — catat apa yang kamu korbankan dan kenapa.",
      "Data: SINTETIS 100% (generator seed 42, 20.000 transaksi, 2.000 kartu token, merchant fiktif) — pola realistis, angka absolut BUKAN kejadian nyata; label is_fraud adalah kemewahan yang tak ada di dunia nyata.",
    ],
  },
];

(misiKartuHantu.steps as V2Step[]).push(...LANJUTAN_KARTU_HANTU);
