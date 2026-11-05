import type { V2Mission } from "../lib/types";

// ── MISI Bayes yang Terbalik ─────────────────────────────────────────────
// M2 — Probabilitas Misi A (core). Dataset SINTETIS 100% (seed 42):
// skrining simulasi 10.000 baris, prevalensi 1%, sensitivitas 99%,
// spesifisitas 99% — ground truth diketahui persis untuk mengadili klaim
// vendor "tes 99% akurat". File: public/misi/misi-bayes-terbalik/
// skrining_simulasi.csv + METODE.md.

const BASE = "/misi/misi-bayes-terbalik";

export const misiBayesTerbalik: V2Mission = {
  slug: "misi-bayes-terbalik",
  track: "Probabilitas",
  module: "Misi",
  title: "Misi Bayes yang Terbalik",
  estMinutes: 120,
  role: "Analis skrining diagnostik",
  client:
    "Dinas Kesehatan — vendor menawarkan tes “99% akurat” untuk program skrining massal Rp40 miliar; kamu diminta mengadili klaimnya dengan angka sebelum anggaran disetujui",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Tes 99% akurat yang menipu",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis skrining diagnostik — penasihat teknis program deteksi dini",
        client:
          "Dinas Kesehatan. Vendor TestX menawarkan alat skrining “akurasi 99%” untuk program deteksi dini massal senilai Rp40 miliar. Satu-satunya bukti yang diajukan: brosur bertuliskan “99% akurat”. Kamu diminta menjawab satu pertanyaan sebelum anggaran disetujui: dari 100 orang yang hasil tesnya positif, berapa yang benar-benar sakit?",
        story: [
          "Senin, 09:00. Kepala Dinas meletakkan brosur mengilap di mejamu: “TestX — Akurasi 99%. Sudah dipakai di tiga negara.” Di halaman dua, satu kalimat besar: “99 dari 100 hasil positif dapat dipercaya.” Terdengar meyakinkan — sampai kamu sadar kalimat itu tidak pernah dibuktikan oleh angka di halaman satu.",
          "Kamu meminta data validasi mentah. Yang datang: file ringkasan 1.000 baris dari “studi validasi” vendor. Di sinilah firasatmu bekerja: studi itu memakai 500 orang sakit dan 500 orang sehat — prevalensi 50%. Sementara program skrining massal menyasar populasi umum, di mana penyakit ini hanya menyerang 1 dari 100 orang.",
          "Twist-nya: angka vendor BENAR — sensitivitas dan spesifisitasnya memang 99%. Yang salah adalah kesimpulannya. Di populasi nyata, lebih dari separuh orang yang dinyatakan “positif” ternyata sehat. Misi ini memberimu dataset simulasi dengan ground truth yang diketahui persis, supaya kamu bisa membuktikan di mana tepatnya brosur itu berbohong.",
        ],
        objectives: [
          "Menghitung matriks kebingungan (TP/FP/FN/TN) dari 10.000 hasil skrining simulasi dan menurunkan PPV empiris.",
          "Menghitung posterior P(Sakit|+) langsung dari rumus Bayes (prevalensi, sensitivitas, spesifisitas) dan menjelaskan selisihnya dengan klaim “99%”.",
          "Menemukan minimal 3 manipulasi di laporan validasi vendor dan menulis memo rekomendasi program yang dipertahankan dengan angka.",
        ],
        prereqSummary:
          "Peluang bersyarat P(A|B) dibaca “peluang A bila B diketahui terjadi” — dan P(A|B) umumnya TIDAK sama dengan P(B|A). Teorema Bayes membalik arahnya: P(Sakit|+) = P(+|Sakit)×P(Sakit)/P(+). PPV (positive predictive value) = peluang benar-benar sakit bila tes positif — inilah angka yang menentukan nasib program skrining, bukan “akurasi” di brosur. Yang penting di sini bukan menghafal rumus, melainkan intuisinya: bila penyakitnya langka, hasil positif pun kemungkinan besar salah.",
        datasetNote:
          "Dataset misi ini SINTETIS 100% — dibangkitkan dengan generator Python (seed 42), BUKAN data pasien nyata.\nParameter diketahui persis: 10.000 baris, prevalensi 1%, sensitivitas 99%, spesifisitas 99% (file skrining_simulasi.csv: id, hasil_tes, status_sebenarnya).\nJustru karena ground truth-nya diketahui, kamu bisa mengadili klaim vendor tanpa perdebatan metodologi. Metode: file METODE.md di folder yang sama.\nKejujuran: angka “99% akurat” milik vendor TestX adalah fiksi misi; sensitivitas/spesifisitas dibuat konstan.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "10.000 baris kebenaran simulasi",
      prose: [
        "`skrining_simulasi.csv` adalah dunia mini yang sepenuhnya kamu kuasai: 10.000 orang, masing-masing dengan status sebenarnya (Sakit/Sehat) dan hasil tes (Positif/Negatif). Tidak ada data hilang, tidak ada yang disembunyikan — laboratorium yang steril untuk satu pertanyaan kotor: benarkah “99% akurat” berarti “99% hasil positif benar”?",
        "Aturan main: (1) kebenaran dihitung dari file mentah, bukan dari brosur; (2) PPV = TP/(TP+FP) — dari semua yang dinyatakan positif, berapa yang benar-benar sakit; (3) rumus Bayes dihitung dari parameter yang diketahui (prevalensi 1%, sens 99%, spec 99%) sebagai pembanding independen.",
        "Catatan untuk kariermu: matematika yang sama persis mengatur triase alert fraud di bank — 1% transaksi adalah fraud, model “99% akurat” → sebagian besar alert ternyata false positive. Siapa pun yang tidak paham Bayes akan tenggelam dalam alert palsu, entah di rumah sakit atau di dealing room.",
      ],
      tasks: [
        { id: "t1", text: "Buka `skrining_simulasi.csv`: catat nama kolom dan jumlah baris" },
        { id: "t2", text: "Perkirakan di kepala: dari 10.000 orang, berapa yang sakit? Berapa yang dites positif padahal sehat?" },
      ],
      note: {
        title: "Miskonsepsi #1: akurasi 99% = 99% hasil positif benar",
        type: "pitfall",
        body: "“Tesnya 99% akurat, jadi 99 dari 100 hasil positif pasti sakit.” SALAH — dan ini kekeliruan termahal di misi ini. Akurasi = (TP+TN)/total, didominasi 9.899 orang sehat yang memang mudah diklasifikasikan benar. PPV = TP/(TP+FP) hanya peduli pada 214 orang bertes positif — dan di sanalah 114 orang sehat bersembunyi. Dua peluang bersyarat, dua arah, dua nasib anggaran.",
      },
      reference:
        "skrining_simulasi.csv (10.000 baris, SINTETIS seed 42) vs brosur vendor TestX. Kebenaran dari yang mentah; vonis untuk yang diklaim.",
    },
    {
      id: "lab-bayes",
      eyebrow: "Langkah 3 · Lab 1 — Posterior dari data",
      title: "Dari 214 yang positif, berapa yang sakit?",
      prose: [
        "Buktikan dengan tanganmu sendiri. Dari `skrining_simulasi.csv`: hitung matriks kebingungan (TP = positif & sakit, FP = positif & sehat, dst.), lalu turunkan PPV empiris = TP/(TP+FP). Terakhir, hitung PPV langsung dari rumus Bayes memakai parameter yang diketahui — dua jalan independen menuju angka yang sama.",
        "Rumus Bayes untuk misi ini sudah disiapkan di bawah — kamu tinggal menerjemahkannya ke kode. Perhatikan: PPV rumus memakai prevalensi POPULASI (1%), bukan prevalensi kohort validasi vendor (50%).",
      ],
      tasks: [
        { id: "t1", text: "Muat CSV; hitung `n_baris` dan `n_sakit`" },
        { id: "t2", text: "Hitung `tp`, `fp`, `fn`, `tn` dari kolom hasil_tes & status_sebenarnya" },
        { id: "t3", text: "Hitung `ppv` empiris dan `ppv_bayes` dari rumus — bandingkan keduanya" },
      ],
      expected:
        "n=10000, sakit=101, TP=100, FP=114, FN=1, TN=9785 → PPV empiris 46,73%; PPV rumus Bayes 50,00%. Dari 214 orang bertes positif, 114 ternyata sehat — brosur “99 dari 100” runtuh.",
      formula: String.raw`P(Sakit|+) = \frac{P(+|Sakit)\,P(Sakit)}{P(+|Sakit)\,P(Sakit)+P(+|Sehat)\,P(Sehat)}`,
      formulaNote:
        "P(Sakit|+) = peluang benar-benar sakit bila tes positif — disebut PPV (positive predictive value). P(+|Sakit) = sensitivitas (0,99); P(Sakit) = prevalensi (0,01); P(+|Sehat) = 1 − spesifisitas (0,01). Penyebut = peluang total sebuah tes positif. Angka ini menjawab pertanyaan anggaran: “setiap hasil positif, seberapa bisa dipercaya?”",
      note: {
        title: "Miskonsepsi #2: sensitivitas 99% = tes “benar 99%” buat yang positif",
        type: "pitfall",
        body: "Sensitivitas menjawab “dari 100 orang SAKIT, berapa yang ketangkap tes?” — arahnya dari penyakit ke hasil tes. PPV menjawab arah sebaliknya: “dari 100 orang BERTES POSITIF, berapa yang sakit?” Membalik arah peluang bersyarat tanpa Bayes adalah akar dari base-rate neglect — dan vendor TestX membangun seluruh brosurnya di atas pembalikan itu.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(URL))` — nilai kolomnya string Indonesia (\"Positif\"/\"Negatif\", \"Sakit\"/\"Sehat\").",
        "Masker boolean: `positif = df[\"hasil_tes\"] == \"Positif\"`, lalu `tp = int((positif & sakit).sum())` — operator `&` untuk AND antar masker.",
        "PPV empiris: `tp / (tp + fp)` — pembagi HANYA yang bertes positif, bukan seluruh 10.000 baris.",
        "Rumus Bayes: `ppv_bayes = (sens*prev) / (sens*prev + (1-spec)*(1-prev))` dengan prev=0.01, sens=0.99, spec=0.99.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-bayes-terbalik/skrining_simulasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = ...",
          "n_sakit = ...   # baris dengan status_sebenarnya == \"Sakit\"",
          "positif = df[\"hasil_tes\"] == \"Positif\"",
          "sakit = df[\"status_sebenarnya\"] == \"Sakit\"",
          "tp = ...   # positif & sakit",
          "fp = ...   # positif & ~sakit",
          "fn = ...   # ~positif & sakit",
          "tn = ...   # ~positif & ~sakit",
          "ppv = ...  # TP / (TP + FP)",
          "",
          "prev, sens, spec = 0.01, 0.99, 0.99",
          "ppv_bayes = ...   # rumus Bayes langsung dari parameter",
          "",
          "print(\"baris:\", n_baris, \"| sakit:\", n_sakit)",
          "print(\"TP:\", tp, \"FP:\", fp, \"FN:\", fn, \"TN:\", tn)",
          "print(\"PPV empiris:\", round(ppv, 4))",
          "print(\"PPV rumus Bayes:\", round(ppv_bayes, 4))",
        ].join("\n"),
        lockLines: 8,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL = \"/misi/misi-bayes-terbalik/skrining_simulasi.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "df = pd.read_csv(open_url(URL))",
          "",
          "n_baris = len(df)",
          "n_sakit = int((df[\"status_sebenarnya\"] == \"Sakit\").sum())",
          "positif = df[\"hasil_tes\"] == \"Positif\"",
          "sakit = df[\"status_sebenarnya\"] == \"Sakit\"",
          "tp = int((positif & sakit).sum())",
          "fp = int((positif & ~sakit).sum())",
          "fn = int((~positif & sakit).sum())",
          "tn = int((~positif & ~sakit).sum())",
          "ppv = tp / (tp + fp)",
          "",
          "prev, sens, spec = 0.01, 0.99, 0.99",
          "ppv_bayes = (sens * prev) / (sens * prev + (1 - spec) * (1 - prev))",
          "",
          "print(\"baris:\", n_baris, \"| sakit:\", n_sakit)",
          "print(\"TP:\", tp, \"FP:\", fp, \"FN:\", fn, \"TN:\", tn)",
          "print(\"PPV empiris:\", round(ppv, 4))",
          "print(\"PPV rumus Bayes:\", round(ppv_bayes, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`df` termuat", name: "df", msg: "df harus berisi DataFrame dari CSV." },
          { kind: "equal", task: "t1", label: "`n_baris` = 10000", name: "n_baris", value: 10000, msg: "File simulasi punya 10.000 baris (seed 42)." },
          { kind: "equal", task: "t1", label: "`n_sakit` = 101", name: "n_sakit", value: 101, msg: "Prevalensi 1% dari 10.000 → 101 baris Sakit pada seed 42." },
          { kind: "equal", task: "t2", label: "`tp` = 100", name: "tp", value: 100, msg: "True positive: bertes Positif DAN benar-benar Sakit." },
          { kind: "equal", task: "t2", label: "`fp` = 114", name: "fp", value: 114, msg: "False positive: bertes Positif padahal Sehat — inilah yang membunuh PPV." },
          { kind: "equal", task: "t3", label: "`ppv` ≈ 0,4673", name: "ppv", value: 0.4673, tol: 0.002, msg: "PPV = TP/(TP+FP) = 100/214. Bukan 99%." },
          { kind: "equal", task: "t3", label: "`ppv_bayes` = 0,5", name: "ppv_bayes", value: 0.5, tol: 0.001, msg: "Rumus Bayes dari parameter: (0,99×0,01)/(0,99×0,01 + 0,01×0,99) = 0,5." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — PPV antar klinik",
      title: "Tes yang sama, nasib yang berbeda",
      prose: [
        "Vendor boleh mengklaim satu angka “akurasi”, tapi PPV tidak pernah tunggal — ia mengikuti prevalensi populasi yang dites. Tabel kecil ini merangkum hasil TestX di enam fasilitas: ada yang melayani populasi umum (prevalensi rendah), ada yang menerima rujukan (prevalensi tinggi). Hitung PPV per fasilitas dengan SQL dan lihat tes yang SAMA menghasilkan kepercayaan yang BERBEDA.",
        "Tabel `skrining_klinik(klinik TEXT, n_positif INT, tp INT)`: n_positif = total hasil positif di fasilitas itu, tp = yang benar-benar sakit. Tampilkan klinik dan PPV persen, urut dari yang terendah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query PPV = 100×tp/n_positif per klinik, urut dari PPV terendah" },
      ],
      expected:
        "6 baris — PPV terendah Klinik Pelita 20,0% (populasi umum), tertinggi RS Rujukan Bakti 92,0% (pasien rujukan). Tes yang SAMA, PPV beda 4× lipat — karena prevalensinya beda.",
      sqlLab: {
        task: "Hitung PPV per klinik: 100.0*tp/n_positif (1 desimal, kolom ppv_pct). Tampilkan klinik + ppv_pct, urut dari ppv_pct terkecil.",
        schema: "CREATE TABLE skrining_klinik (klinik TEXT, n_positif INT, tp INT);",
        seedData: [
          "INSERT INTO skrining_klinik VALUES",
          "('Klinik Harapan',198,99),",
          "('RS Rujukan Sentosa',400,360),",
          "('Klinik Mawar',150,83),",
          "('Puskesmas Massal Jaya',320,96),",
          "('RS Rujukan Bakti',250,230),",
          "('Klinik Pelita',100,20);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT klinik\nFROM skrining_klinik\n",
        solution: [
          "SELECT klinik, ROUND(100.0*tp/n_positif, 1) AS ppv_pct",
          "FROM skrining_klinik",
          "ORDER BY ppv_pct;",
        ].join("\n"),
        expectedColumns: ["klinik", "ppv_pct"],
        expectedRows: [
          ["Klinik Pelita", 20.0],
          ["Puskesmas Massal Jaya", 30.0],
          ["Klinik Harapan", 50.0],
          ["Klinik Mawar", 55.3],
          ["RS Rujukan Sentosa", 90.0],
          ["RS Rujukan Bakti", 92.0],
        ],
        orderMatters: true,
      },
    },
    {
      id: "keputusan",
      eyebrow: "Langkah 5 · Checkpoint keputusan",
      title: "Program Rp40 miliar ini mau kamu apakan?",
      prose: [
        "Angkanya tidak berbohong: PPV 46,7% di populasi umum — dari tiap 214 orang yang dinyatakan positif, 114 sehat dan harus menjalani tes konfirmasi, antrean, dan kecemasan yang tidak perlu. Klaim “99 dari 100” di brosur runtuh. Tapi “PPV rendah” dan “apa yang harus dilakukan dinas” adalah dua keputusan berbeda — dan Kepala Dinas menunggumu memilih. Tiap opsi mengubah apa yang terjadi berikutnya.",
      ],
      tasks: [],
      decision: {
        prompt:
          "Rekomendasi apa yang kamu sampaikan ke Kepala Dinas atas program skrining TestX? (Keputusan final — seperti memo yang sudah dikirim.)",
        options: [
          {
            id: "opt-setujui",
            label: "Setujui program massal — tesnya 99% akurat",
            rationale:
              "Sensitivitas dan spesifisitas 99% terverifikasi dari data. Menolak tes seakurat ini berarti menolak sains — dan 100 kasus yang terdeteksi tetap 100 nyawa.",
            nextStepId: "temuan-setujui",
            consequenceNote:
              "Program jalan. Tahun pertama: 53% peserta bertes positif ternyata sehat — antrean tes konfirmasi membludak, biaya follow-up membengkak 3× lipat dari anggaran, dan kepercayaan publik runtuh setelah media menulis “tes ngawur”. Kamu benar soal 100 kasus terdeteksi; kamu salah soal harganya.",
          },
          {
            id: "opt-target",
            label: "Skrining bertarget + tes konfirmasi dua tahap",
            rationale:
              "PPV 46,7% hanya berlaku di populasi umum. Fokuskan skrining ke kelompok risiko tinggi (prevalensi lebih tinggi → PPV naik, seperti RS rujukan di Lab 2) dan wajibkan tes konfirmasi kedua untuk tiap hasil positif.",
            nextStepId: "temuan-target",
            consequenceNote:
              "Biaya per kasus terdeteksi turun 60% dibanding skenario massal. Vendor protes “pasar menyusut”, tapi dinas memegang angka: PPV di kelompok risiko tinggi di atas 85%. Program selamat — dan kamu yang menyelamatkannya dengan Bayes, bukan dengan brosur.",
          },
          {
            id: "opt-tolak",
            label: "Tolak — minta validasi independen dulu",
            rationale:
              "Validasi vendor memakai kohort prevalensi 50%, bukan populasi skrining 1%. Angka 99% belum pernah diuji di dunia tempat tes ini akan dipakai.",
            nextStepId: "temuan-tolak",
            consequenceNote:
              "Validasi independen 6 bulan kemudian mengonfirmasi PPV riil 46,7% di populasi umum. Kontrak dinegosiasi ulang: bayar per KASUS TERDETEKSI, bukan per tes — vendor yang tadinya menjual “akurasi” kini harus menjual “hasil”.",
          },
        ],
      },
    },
    {
      id: "temuan-setujui",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: program massal disetujui",
      prose: [
        "Kepala Dinas menyetujui — “99% akurat” terlalu meyakinkan untuk ditolak. Tahun pertama berjalan persis seperti hitunganmu: dari tiap 214 orang bertes positif, 114 sehat. Mereka tetap harus antre tes konfirmasi, cuti kerja, dan menunggu hasil dengan cemas.",
        "Biaya follow-up membengkak 3× lipat. Media lokal menulis “Dinas pakai tes ngawur”. Pelajaran yang mahal: menyetujui program berdasarkan angka yang benar (99% sens/spec) tetapi kesimpulan yang salah (“99 dari 100 positif benar”) — itulah harga base-rate neglect yang dibayar dengan uang pajak.",
      ],
      tasks: [],
      note: {
        title: "Angka benar + kesimpulan salah = keputusan salah",
        body: "Vendor tidak berbohong soal 99% — ia berbohong soal ARTINYA. Di deliverable-mu, pisahkan selalu “angka yang terverifikasi” dari “klaim yang dibangun di atasnya”. Komite yang hanya membaca angka akan menyetujui apa pun.",
      },
    },
    {
      id: "temuan-target",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: skrining bertarget dua tahap",
      prose: [
        "Kepala Dinas menyetujui strategimu. Skrining difokuskan ke kelompok risiko tinggi — persis seperti RS rujukan di Lab 2, di mana PPV-nya 90%+. Setiap hasil positif wajib dikonfirmasi tes kedua sebelum dinyatakan kasus.",
        "Hasil tahun pertama: biaya per kasus terdeteksi turun 60%. Tidak ada antrean membludak, tidak ada headline “tes ngawur”. Vendor sempat protes karena volume tes menyusut — sampai dinas menunjukkan kontrak baru: bayar per kasus terdeteksi. Tiba-tiba vendor ikut berkepentingan pada PPV, bukan pada volume.",
      ],
      tasks: [],
      note: {
        title: "Bayes adalah alat negosiasi",
        body: "PPV bukan sekadar angka akademik — ia mengubah struktur insentif. Begitu kontrak membayar per kasus terdeteksi (bukan per tes), vendor yang tadinya menjual “akurasi” harus ikut memikirkan prevalensi. Rumus yang sama, kekuasaan yang berbeda.",
      },
    },
    {
      id: "temuan-tolak",
      goto: "audit",
      eyebrow: "Langkah 6 · Konsekuensi",
      title: "Diputuskan: validasi independen dulu",
      prose: [
        "Kepala Dinas menunda tanda tangan — keputusan yang membuatnya tidak populer di rapat anggaran (“menolak sains!”). Enam bulan kemudian validasi independen keluar: PPV riil di populasi umum 46,7%, persis seperti hitunganmu.",
        "Kontrak dinegosiasi ulang dari nol. Syarat baru: pembayaran per kasus terdeteksi yang terkonfirmasi, bukan per tes yang dijual. Vendor menerima — karena kini ia bersaing dengan angka yang jujur, bukan dengan brosur.",
      ],
      tasks: [],
      note: {
        title: "Menunda juga keputusan — asal ada buktinya",
        body: "“Tolak dulu” hanya bertahan bila buktinya sekeras PPV 46,7% milikmu. Tanpa angka itu, penundaan = birokrasi. Dengan angka itu, penundaan = kehati-hatian profesional. Itulah kenapa Lab 1 ada sebelum keputusan ini.",
      },
    },
    {
      id: "audit",
      eyebrow: "Langkah 7 · Misi audit",
      title: "Dossier 12 baris: brosur yang “terbukti” itu menipu",
      prose: [
        "Sebelum menulis memo, satu misi audit. Di bawah ini 12 baris “Kutipan Laporan Validasi TestX”, dokumen yang diklaim membuktikan tes ini “99% akurat dan layak skrining massal”. Seseorang menyuntikkan 4 manipulasi ke dalamnya. Senjatamu: PPV 46,7% dari Lab 1 dan tabel PPV antar-klinik dari Lab 2.",
        "Aturannya sama seperti biasa: bandingkan setiap klaim dengan data mentah. Brosur tidak bisa berbohong dua kali.",
      ],
      tasks: [],
      auditDossier: {
        version: "bayes-m2a-v1",
        snapshotDate: "2026-10-15",
        intro:
          "Dossier ini diklaim sebagai kutipan Laporan Validasi TestX yang menyatakan tes “99% akurat dan layak untuk skrining massal”.",
        columns: ["#", "Klaim", "Angka", "Status"],
        rows: [
          { rowId: 1, cells: { "#": "1", "Klaim": "Akurasi tes (sensitivitas/spesifisitas)", "Angka": "99%", "Status": "Terverifikasi" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I1: akurasi diputar menjadi PPV ──
          { rowId: 2, cells: { "#": "2", "Klaim": "Artinya: 99 dari 100 hasil positif benar-benar sakit", "Angka": "99%", "Status": "Klaim brosur" }, claims: [{ label: "Tercatat", value: "Ya — hal. 2 brosur" }] },
          // ── I2: kohort diperkaya ──
          { rowId: 3, cells: { "#": "3", "Klaim": "Komposisi kohort validasi", "Angka": "500 sakit / 500 sehat", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 4, cells: { "#": "4", "Klaim": "Jumlah baris data validasi", "Angka": "1.000", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I3: ID ganda ──
          { rowId: 5, cells: { "#": "5", "Klaim": "ID-0447, hasil tes", "Angka": "Positif", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 6, cells: { "#": "6", "Klaim": "ID-0447, hasil tes", "Angka": "Positif", "Status": "Tercatat" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          // ── I4: borderline dibuang ──
          { rowId: 7, cells: { "#": "7", "Klaim": "Hasil borderline/indeterminate", "Angka": "312 dibuang", "Status": "Catatan kaki" }, claims: [{ label: "Tercatat", value: "Ya — catatan kaki hal. 9" }] },
          { rowId: 8, cells: { "#": "8", "Klaim": "Spesifisitas dihitung dari", "Angka": "688 sampel “bersih”", "Status": "Metode" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 9, cells: { "#": "9", "Klaim": "Rekomendasi pemakaian", "Angka": "Skrining massal populasi umum", "Status": "Brosur" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 10, cells: { "#": "10", "Klaim": "Sensitivitas pada kohort validasi", "Angka": "99%", "Status": "Konsisten dgn simulasi" }, claims: [{ label: "Tercatat", value: "Ya" }] },
          { rowId: 11, cells: { "#": "11", "Klaim": "PPV pada prevalensi 1% (populasi skrining)", "Angka": "Tidak dihitung", "Status": "Tidak disebut" }, claims: [{ label: "Tercatat", value: "Ya — tidak ada di laporan" }] },
          { rowId: 12, cells: { "#": "12", "Klaim": "Harga kontrak yang ditawarkan", "Angka": "Rp4 juta per 1.000 tes", "Status": "Penawaran" }, claims: [{ label: "Tercatat", value: "Ya" }] },
        ],
        injections: [
          { key: "ppv-diputar", rowIds: [2, 11], title: "Akurasi diputar menjadi PPV", clue: "Brosur menulis “99 dari 100 hasil positif benar-benar sakit” — itu definisi PPV, bukan akurasi. Hitunganmu: 100/214 = 46,7% (baris 11 bahkan tidak menghitungnya). Vendor menukar dua peluang bersyarat yang arahnya berlawanan: P(+|Sakit) vs P(Sakit|+).", danger: "Satu baris brosur ini yang membuat Rp40 miliar terlihat murah. Komite yang tidak bisa membedakan P(A|B) dari P(B|A) akan menyetujui apa pun." },
          { key: "kohort-diperkaya", rowIds: [3], title: "Validasi di kohort prevalensi 50%", clue: "500 sakit / 500 sehat = prevalensi 50% — 50× lipat prevalensi populasi skrining (1%). Sensitivitas dan spesifisitas boleh ditransfer antar populasi; PPV TIDAK. Di dunia validasi, PPV tes ini 99%; di dunia nyata, 46,7%.", danger: "Spectrum bias: angka validasi yang benar secara teknis, salah secara konteks. Selalu tanya: “prevalensi kohort validasi vs populasiku?”" },
          { key: "id-ganda", rowIds: [5, 6], title: "ID-0447 muncul dua kali", clue: "Dua baris identik persis — ID, hasil, semuanya. Satu kasus positif yang tercatat ganda menggelembungkan pembilang sensitivitas.", danger: "Di data validasi, duplikat = angka kemanjuran palsu. Obatnya murah dan sama di semua misi: constraint unik di ID." },
          { key: "borderline-dibuang", rowIds: [7, 8], title: "312 hasil borderline dibuang diam-diam", clue: "Catatan kaki hal. 9: 312 hasil “indeterminate” dikeluarkan SEBELUM spesifisitas dihitung — dari 1.000 sampel tersisa 688 yang “bersih”. Di lapangan, hasil borderline TETAP butuh tindak lanjut dan biaya.", danger: "Partial verification bias: membuang kasus-kasus sulit membuat tes terlihat lebih baik dari perilaku nyatanya. Tanya selalu: “berapa hasil yang tidak masuk hitungan?”" },
        ],
      },
    },
    {
      id: "deliverable",
      eyebrow: "Langkah 8 · Deliverable",
      title: "Memo rekomendasi untuk Kepala Dinas",
      prose: [
        "Semua bukti di tangan. Tulis memo rekomendasi program satu halaman untuk Kepala Dinas — artefak portofoliomu. Memo yang baik tidak hanya bilang “PPV-nya rendah”, tapi menunjukkan ANGKA-nya, apa yang disembunyikan laporan vendor, dan apa yang harus terjadi pada Rp40 miliar itu.",
      ],
      tasks: [],
      deliverable: {
        template: [
          "Ringkasan eksekutif (3 kalimat): PPV empiris vs klaim brosur, hasil rumus Bayes, vonis atas klaim “99 dari 100”.",
          "Bukti kuantitatif: matriks kebingungan (TP/FP/FN/TN), PPV empiris 46,7%, PPV Bayes 50%, PPV antar-klinik (20%–92%) sebagai bukti efek prevalensi.",
          "Temuan audit laporan vendor: manipulasi apa yang kamu temukan, baris per baris.",
          "Rekomendasi: apa yang harus terjadi pada program & anggaran (rujuk keputusanmu di Langkah 5 + ambang evaluasinya).",
          "Batas & risiko sisa: apa yang TIDAK dicakup analisismu (mis. data SINTETIS; sens/spec konstan; biaya follow-up di luar model; PPV bisa berubah bila prevalensi berubah).",
        ],
        rubric: [
          { criterion: "Kebenaran PPV", weight: 25, levels: ["PPV tidak dihitung/salah", "PPV dihitung tapi tanpa pembanding Bayes", "PPV empiris 46,7% + PPV rumus Bayes 50% — keduanya tepat"] },
          { criterion: "Deteksi manipulasi", weight: 25, levels: ["Tidak menyebut manipulasi", "Menyebut sebagian tanpa nomor baris", "Keempat manipulasi disebut dengan nomor baris"] },
          { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa angka pendukung", "Ada rekomendasi, angka kabur", "Rekomendasi + angka pendukung + ambang evaluasi eksplisit"] },
          { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim simulasi = bukti final", "Menyebut sebagian batas", "Batas (SINTETIS, sens/spec konstan, biaya follow-up) dinyatakan eksplisit"] },
        ],
      },
    },
    {
      id: "debrief",
      eyebrow: "Langkah 9 · Debrief",
      title: "Yang sebenarnya terjadi — dan kenapa ini penting",
      prose: [
        "Debrief dibuka. Empat manipulasi di laporan validasi TestX:",
        "1) **Akurasi diputar** (baris 2 & 11): “99 dari 100 hasil positif benar-benar sakit”. Angka sebenarnya: 46,7%. Bahkan laporan itu sendiri tidak pernah menghitung PPV pada prevalensi 1% (baris 11: “tidak dihitung”) — karena bila dihitung, brosurnya runtuh.",
        "2) **Kohort diperkaya** (baris 3): validasi memakai prevalensi 50%. Di dunia itu PPV memang 99% — dan itulah satu-satunya dunia di mana brosur benar. Sayangnya program skrining tidak tinggal di dunia itu.",
        "3) **ID ganda** (baris 5–6): ID-0447 tercatat dua kali. Klasik — dan obatnya semurah di semua misi: constraint unik.",
        "4) **Borderline dibuang** (baris 7–8): 312 hasil sulit dikeluarkan sebelum spesifisitas dihitung. Tes yang “99%” di laboratorium yang steril bisa jauh lebih buruk di lapangan yang berantakan.",
        "Skor deteksimu (x/4) mengukur satu hal: apakah kamu memverifikasi klaim terhadap data mentah, atau memercayai stempel “tervalidasi”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — bahkan opsi terbaikmu (skrining bertarget) berarti sebagian kasus di populasi umum tidak terdeteksi. Bayes tidak memberimu jawaban yang sempurna; ia memberimu jawaban yang JUJUR.",
        "Bahaya nyata terakhir — di luar rumah sakit: triase alert fraud memakai matematika yang identik. Prevalensi fraud 1%, model “99% akurat” → tim fraud tenggelam dalam alert palsu, analis kelelahan, dan fraud sungguhan lolos di tengah kebisingan. Base-rate neglect bukan soal ujian statistik; ia soal siapa yang membayar harganya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi #3: paham Bayes sekali = intuisi kebal selamanya",
        type: "risk",
        body: "Base-rate neglect itu kambuhan. Setiap kali sebuah angka disajikan sebagai “akurasi” tanpa prevalensi di sampingnya, otakmu akan kembali menukar P(A|B) dengan P(B|A) — kecuali kamu memaksanya berhenti dan bertanya: “99% dari APA?” Jadikan itu refleks profesionalmu.",
      },
    },
    {
      id: "rangkuman",
      eyebrow: "Langkah 10 · Rangkuman",
      title: "Poin penting misi ini",
      prose: [],
      tasks: [],
      summary: [
        "PPV empiris 46,7% (100/214) vs klaim brosur “99 dari 100”; rumus Bayes dari parameter memberi 50,0% — dua jalan independen, kesimpulan sama.",
        "Akar masalahnya: base-rate neglect — menukar P(+|Sakit) dengan P(Sakit|+). Pada prevalensi 1%, 114 dari 214 hasil positif adalah orang sehat.",
        "PPV mengikuti prevalensi: tes yang SAMA memberi PPV 20% di populasi umum dan 92% di pasien rujukan (Lab 2).",
        "Empat pola manipulasi laporan validasi: akurasi diputar jadi PPV, kohort prevalensi 50%, ID ganda, 312 hasil borderline dibuang.",
        "Data: SINTETIS 100% (seed 42), 10.000 baris, dibuat 2026-10-15; klaim vendor TestX adalah fiksi misi; matematika yang sama mengatur triase alert fraud.",
      ],
    },
  ],
};

export default misiBayesTerbalik;
