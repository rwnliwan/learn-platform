import type { V2Mission } from "../lib/types";

// ── MISI Overfitting: Akurasi 99% yang Rapuh ─────────────────────────────
// M2 — Machine Learning Engineer Misi A (core). Dataset: SINTETIS (generator
// NumPy, seed 42) — kurva train/val per epoch + metrik per seed.
// File: public/misi/misi-diagnosa-overfitting/kurva.csv (500 baris) +
// metrik_seed.csv (5 baris). Metode: METODE.md di folder yang sama.

const BASE = "/misi/misi-diagnosa-overfitting";

export const misiOverfit: V2Mission = {
  slug: "misi-diagnosa-overfitting",
  track: "Machine Learning Engineer",
  module: "Misi",
  title: "Misi Overfitting: Akurasi 99% yang Rapuh",
  estMinutes: 150,
  role: "ML engineer — validator independen model vendor",
  client:
    "Head of Data — vendor mengklaim model klasifikasi visual dengan akurasi validasi 98,7%; kontrak bernilai miliaran rupiah menunggu tanda tanganmu sebagai validator independen",
  xp: 500,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Angka 98,7% yang terlalu indah",
      prose: [],
      tasks: [],
      briefing: {
        role: "ML engineer di sebuah perusahaan — validator independen model vendor",
        client:
          "Head of Data. Sebuah vendor AI mengirim laporan validasi 40 halaman untuk model klasifikasi visual yang akan dipakai di lini produksi. Headline-nya: akurasi validasi 98,7%. Kontrak pengadaan bernilai miliaran rupiah akan ditandatangani Jumat ini — dan kamu diminta satu hal: pendapat independen apakah angka itu bisa dipercaya. Vendor sudah “lolos” dua kali audit administratif; tidak ada yang pernah menghitung ulang angkanya dari data mentah.",
        story: [
          "Senin, 09:00. Head of Data meletakkan laporan vendor di mejamu — 40 halaman, grafik mengilap, satu angka raksasa di halaman pertama: 98,7%. “Mereka bilang modelnya siap produksi,” katanya. “Aku butuh kamu menjawab satu pertanyaan sebelum Jumat: angka ini jujur atau tidak?” Kamu membuka lampirannya: kurva training 50 epoch dan tabel metrik 5 seed. Di sinilah biasanya kebenaran bersembunyi — atau kebohongan.",
          "Kamu tahu polanya. Model yang menghafal data latih terlihat brilian di angka validasi yang terkontaminasi, lalu runtuh di dunia nyata. 98,7% bukan bukti kecerdasan model — bisa jadi bukti ujiannya bocor. Dan “bocor” di sini bukan metafora: duplikat data, preprocessing yang mengintip masa depan, metrik yang dipilih dari seed terbaik.",
          "Misi ini memakai data SINTETIS (dinyatakan eksplisit — bukan data vendor nyata): kurva train/val per epoch dan metrik per seed dari generator yang meniru kasus overfitting klasik. Tugasmu: hitung ulang generalization gap, baca learning curves, ukur varians antar-seed, bedah laporan vendor baris per baris, lalu putuskan nasib kontrak miliaran itu.",
        ],
        objectives: [
          "Menghitung generalization gap (akurasi train − akurasi test) per seed dan rata-ratanya dari metrik_seed.csv, lalu menafsirkan artinya.",
          "Menganalisis learning curves: menemukan epoch val_loss minimum dan membuktikan apakah training benar-benar berhenti di titik terbaik.",
          "Menemukan minimal 3 sabotase di laporan validasi vendor dan menulis memo validasi dengan rekomendasi yang bisa dipertahankan.",
        ],
        prereqSummary:
          "Overfitting = model menghafal data latih: akurasi train tinggi, akurasi di data baru jeblok. Generalization gap = selisih keduanya — makin besar, makin rapuh modelnya. Learning curve yang sehat: kurva train dan validation membaik bersama; kalau validation memburuk sementara train terus membaik, model sedang menghafal, bukan belajar. Seed berbeda = training diulang dengan keacakan berbeda; varians besar antar-seed artinya hasil tidak stabil dan satu angka “terbaik” tidak bisa dipercaya.",
        datasetNote:
          "Sumber: SINTETIS — generator NumPy seed 42 (BUKAN data vendor nyata; pola direkayasa menyerupai kasus overfitting klasik).\nFile kurva.csv: 500 baris (50 epoch × 5 seed × split train/val), kolom epoch,seed,split,loss,acc.\nFile metrik_seed.csv: 5 baris (satu per seed), kolom seed,train_acc,val_acc,test_acc,val_loss_min_epoch; val_acc = akurasi validasi terbaik per seed, test_acc = akurasi pada held-out bersih (simulasi evaluasi jujur).\nKejujuran: angka “klaim vendor” adalah fiksi misi; yang nyata hanyalah pola di kedua CSV. Metode: file METODE.md di folder yang sama.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Dua file, satu kebohongan yang menunggu",
      prose: [
        "Dua file menunggumu — keduanya SINTETIS (lihat METODE.md untuk generatornya). `kurva.csv` adalah rekaman jujur proses training: 500 baris berisi loss dan akurasi train/val per epoch untuk 5 seed berbeda. Di sinilah kamu bisa MELIHAT overfitting terjadi — bukan dari satu angka, melainkan dari bentuk kurvanya.",
        "`metrik_seed.csv` adalah ringkasannya: 5 baris, satu per seed, berisi akurasi train terbaik, akurasi validasi terbaik, dan — yang paling penting — akurasi pada held-out bersih (`test_acc`) yang mensimulasikan evaluasi jujur. Bandingkan kolom kedua dan kolom keempat baik-baik.",
        "Aturan main: (1) angka vendor TIDAK dipercaya sebelum dihitung ulang; (2) generalization gap dihitung dari kolom data, bukan dari headline laporan; (3) “seed terbaik” bukan estimasi kinerja — rata-rata dan simpangannya yang bicara.",
      ],
      tasks: [
        { id: "t1", text: "Buka `kurva.csv`: catat jumlah epoch, jumlah seed, dan kolom yang tersedia" },
        { id: "t2", text: "Buka `metrik_seed.csv`: bandingkan `val_acc` vs `test_acc` per seed — catat polanya" },
      ],
      note: {
        title: "Miskonsepsi #1: akurasi validasi tinggi = model bagus",
        type: "pitfall",
        body: "“Validasinya 98,7%, berarti modelnya hebat.” BELUM TENTU — dan justru di sinilah jebakannya. Akurasi validasi hanya jujur kalau validation set-nya bersih: tidak ada duplikat dari train, tidak ada kebocoran preprocessing, dan angkanya bukan hasil cherry-pick seed terbaik. Tiga syarat itu persis yang akan kamu periksa di misi ini. Angka tanpa integritas evaluasi = dekorasi.",
      },
      reference:
        "kurva.csv (500 baris: 50 epoch × 5 seed × train/val) vs metrik_seed.csv (5 seed: train_acc, val_acc, test_acc). Diagnosis dari yang mentah; vonis untuk klaim vendor.",
    },
    {
      id: "lab-python",
      eyebrow: "Langkah 3 · Lab 1 — Bedah kurva & gap",
      title: "Seberapa rapuh model ini, dalam angka",
      prose: [
        "Sekarang buktikan dengan tanganmu sendiri. Dari `metrik_seed.csv`: hitung generalization gap per seed — selisih akurasi train dan akurasi test (held-out bersih) — lalu rata-ratanya. Dari `kurva.csv`: cari epoch dengan rata-rata val_loss terkecil lintas seed, dan bandingkan dengan val_loss di epoch 50. Terakhir: ukur simpangan baku akurasi test antar-seed — seberapa stabil “keberhasilan” model ini bila training diulang.",
        "Tiga angka ini adalah fondasi vomis-mu: gap besar = rapuh; val_loss yang naik lagi setelah titik minimum = overfitting visual; simpangan antar-seed besar = hasil tidak bisa diandalkan.",
      ],
      tasks: [
        { id: "t1", text: "Muat kedua CSV; hitung `n_baris`, `n_seed`, `n_epoch`" },
        { id: "t2", text: "Hitung `gap_rata2_pp`: rata-rata (train_acc − test_acc) × 100 lintas seed" },
        { id: "t3", text: "Temukan `epoch_val_loss_min`, `naik_setelah_minimum`, dan `std_test_acc_pp`" },
      ],
      expected:
        "n_baris=500, n_seed=5, gap_rata2_pp=27,86 poin, epoch_val_loss_min=17, val_loss naik 0,9549 setelah titik minimum (0,3938 → 1,3487 di epoch 50), std_test_acc_pp=1,48",
      formula: String.raw`G = A_{\text{train}} - A_{\text{test}}\quad\text{(dalam poin persentase)}`,
      formulaNote:
        "G = generalization gap; A_train = akurasi pada data latih; A_test = akurasi pada held-out bersih. Gap 27,86 poin artinya: dari tiap 100 prediksi, hampir 28 di antaranya “benar” hanya karena model menghafal — dan akan salah di dunia nyata.",
      note: {
        title: "Miskonsepsi #2: val_loss yang turun terus = training sehat",
        type: "pitfall",
        body: "Yang sehat bukan val_loss yang turun terus, melainkan val_loss yang BERHENTI di titik minimum. Kurva berbentuk U adalah tanda klasik: kiri = underfit, lembah = titik terbaik, kanan = overfitting. Training yang diteruskan melewati lembah (seperti ke epoch 50 di sini) bukan “lebih matang” — itu model yang semakin menghafal.",
      },
      hints: [
        "Muat CSV: `from pyodide.http import open_url` lalu `pd.read_csv(open_url(url))` — dua URL berbeda untuk dua file.",
        "Gap: `(metrik[\"train_acc\"] - metrik[\"test_acc\"]) * 100` menghasilkan Series per seed; ambil `.mean()`-nya.",
        "val_loss rata-rata per epoch: filter `split == \"val\"`, lalu `.groupby(\"epoch\")[\"loss\"].mean()` — minimumnya via `.idxmin()`.",
        "Simpangan baku: `metrik[\"test_acc\"].std()` (pandas default ddof=1), kali 100 untuk poin persentase.",
      ],
      requires: ["pandas"],
      code: {
        starter: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_KURVA = \"/misi/misi-diagnosa-overfitting/kurva.csv\"",
          "URL_METRIK = \"/misi/misi-diagnosa-overfitting/metrik_seed.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kurva = pd.read_csv(open_url(URL_KURVA))",
          "metrik = pd.read_csv(open_url(URL_METRIK))",
          "",
          "n_baris = ...",
          "n_seed = ...",
          "n_epoch = ...",
          "",
          "gap_pp = ...            # (train_acc - test_acc) * 100 per seed",
          "gap_rata2_pp = ...",
          "",
          "val_mean = ...          # rata-rata val_loss per epoch",
          "epoch_val_loss_min = ...",
          "loss_min = ...",
          "loss_epoch50 = ...",
          "naik_setelah_minimum = ...",
          "",
          "std_test_acc_pp = ...",
          "",
          "print(\"baris:\", n_baris, \"| seed:\", n_seed, \"| epoch:\", n_epoch)",
          "print(\"gap rata-rata (pp):\", round(gap_rata2_pp, 4))",
          "print(\"val_loss min di epoch:\", epoch_val_loss_min)",
          "print(\"naik setelah minimum:\", round(naik_setelah_minimum, 4))",
          "print(\"std test_acc antar-seed (pp):\", round(std_test_acc_pp, 4))",
        ].join("\n"),
        lockLines: 9,
        solution: [
          "import pandas as pd",
          "from pyodide.http import open_url",
          "",
          "URL_KURVA = \"/misi/misi-diagnosa-overfitting/kurva.csv\"",
          "URL_METRIK = \"/misi/misi-diagnosa-overfitting/metrik_seed.csv\"",
          "",
          "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
          "kurva = pd.read_csv(open_url(URL_KURVA))",
          "metrik = pd.read_csv(open_url(URL_METRIK))",
          "",
          "n_baris = len(kurva)",
          "n_seed = int(kurva[\"seed\"].nunique())",
          "n_epoch = int(kurva[\"epoch\"].nunique())",
          "",
          "gap_pp = (metrik[\"train_acc\"] - metrik[\"test_acc\"]) * 100",
          "gap_rata2_pp = float(gap_pp.mean())",
          "",
          "val_mean = kurva[kurva[\"split\"] == \"val\"].groupby(\"epoch\")[\"loss\"].mean()",
          "epoch_val_loss_min = int(val_mean.idxmin())",
          "loss_min = float(val_mean.min())",
          "loss_epoch50 = float(val_mean.loc[50])",
          "naik_setelah_minimum = float(loss_epoch50 - loss_min)",
          "",
          "std_test_acc_pp = float(metrik[\"test_acc\"].std() * 100)",
          "",
          "print(\"baris:\", n_baris, \"| seed:\", n_seed, \"| epoch:\", n_epoch)",
          "print(\"gap rata-rata (pp):\", round(gap_rata2_pp, 4))",
          "print(\"val_loss min di epoch:\", epoch_val_loss_min)",
          "print(\"naik setelah minimum:\", round(naik_setelah_minimum, 4))",
          "print(\"std test_acc antar-seed (pp):\", round(std_test_acc_pp, 4))",
        ].join("\n"),
        checks: [
          { kind: "defined", task: "t1", label: "`kurva` termuat", name: "kurva", msg: "kurva harus berisi DataFrame dari kurva.csv." },
          { kind: "defined", task: "t1", label: "`metrik` termuat", name: "metrik", msg: "metrik harus berisi DataFrame dari metrik_seed.csv." },
          { kind: "equal", task: "t1", label: "`n_baris` = 500", name: "n_baris", value: 500, msg: "kurva.csv punya 500 baris (50 epoch × 5 seed × 2 split)." },
          { kind: "equal", task: "t1", label: "`n_seed` = 5", name: "n_seed", value: 5, msg: "Ada 5 seed berbeda — hitung via nunique kolom seed." },
          { kind: "equal", task: "t2", label: "`gap_rata2_pp` ≈ 27,86", name: "gap_rata2_pp", value: 27.86, tol: 0.05, msg: "Rata-rata (train_acc − test_acc) × 100 lintas 5 seed. Gap sebesar ini = model rapuh." },
          { kind: "equal", task: "t3", label: "`epoch_val_loss_min` = 17", name: "epoch_val_loss_min", value: 17, msg: "Rata-rata val_loss lintas seed minimum di epoch 17 — bandingkan dengan klaim vendor." },
          { kind: "equal", task: "t3", label: "`naik_setelah_minimum` ≈ 0,95", name: "naik_setelah_minimum", value: 0.9549, tol: 0.02, msg: "val_loss epoch 50 (1,3487) − minimum (0,3938): bukti training diteruskan melewati titik terbaik." },
          { kind: "equal", task: "t3", label: "`std_test_acc_pp` ≈ 1,48", name: "std_test_acc_pp", value: 1.48, tol: 0.05, msg: "Simpangan baku test_acc antar-seed × 100 (pandas .std() default)." },
        ],
      },
    },
    {
      id: "lab-sql",
      eyebrow: "Langkah 4 · Lab 2 — Agregasi per seed",
      title: "Seed mana yang paling rapuh?",
      prose: [
        "Gap rata-rata 27,86 poin itu satu angka — tapi kerapuhan tidak merata. Di tabel kecil ini (5 seed dari `metrik_seed.csv`), hitung gap per seed dalam poin persentase dan urutkan dari yang TERBESAR. Seed dengan gap terbesar adalah kandidat “keberuntungan semata”.",
        "Tabel `metrik(seed INT, train_acc REAL, val_acc REAL, test_acc REAL)`. Tampilkan seed, val_acc, test_acc, dan gap_pp, urut dari gap terbesar.",
      ],
      tasks: [
        { id: "t1", text: "Tulis query gap per seed ((train_acc − test_acc) × 100), urut dari terbesar" },
      ],
      expected: "5 baris — gap terbesar seed 2 (29,42), lalu seed 1 (28,90), seed 5 (28,09), seed 3 (27,58), seed 4 (25,33)",
      sqlLab: {
        task: "Hitung gap = (train_acc − test_acc) × 100 per seed (alias gap_pp, 2 desimal). Tampilkan seed, val_acc, test_acc, gap_pp — urut dari gap TERBESAR.",
        schema: "CREATE TABLE metrik (seed INT, train_acc REAL, val_acc REAL, test_acc REAL);",
        seedData: [
          "INSERT INTO metrik VALUES",
          "(1,0.9956,0.9865,0.7066),",
          "(2,0.9960,0.9873,0.7018),",
          "(3,0.9944,0.9771,0.7186),",
          "(4,0.9931,0.9795,0.7398),",
          "(5,0.9932,0.9821,0.7123);",
        ].join("\n"),
        starter: "-- Tulis query-mu di sini\nSELECT seed, val_acc, test_acc\nFROM metrik\n",
        solution: [
          "SELECT seed, val_acc, test_acc,",
          "       ROUND((train_acc - test_acc) * 100, 2) AS gap_pp",
          "FROM metrik",
          "ORDER BY gap_pp DESC;",
        ].join("\n"),
        expectedColumns: ["seed", "val_acc", "test_acc", "gap_pp"],
        expectedRows: [
          [2, 0.9873, 0.7018, 29.42],
          [1, 0.9865, 0.7066, 28.9],
          [5, 0.9821, 0.7123, 28.09],
          [3, 0.9771, 0.7186, 27.58],
          [4, 0.9795, 0.7398, 25.33],
        ],
        orderMatters: true,
      },
    },
  ],
};

export default misiOverfit;

// ── lanjutan misiOverfit: langkah 5–12 ───────────────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_OVERFIT: V2Step[] = [
  {
    id: "keputusan",
    eyebrow: "Langkah 5 · Checkpoint keputusan",
    title: "Kontrak miliaran ini mau kamu apakan?",
    prose: [
      "Angkanya tidak berbohong: gap rata-rata 27,86 poin, val_loss minimum di epoch 17 tapi training diteruskan sampai epoch 50, dan akurasi “validasi” 98,7% berdampingan dengan akurasi held-out bersih ~71%. Model ini menghafal, bukan belajar. Tapi “modelnya rapuh” dan “apa yang harus dilakukan perusahaan” adalah dua keputusan berbeda — dan Head of Data menunggumu memilih. Jumat adalah batas tanda tangan. Tiap opsi mengubah apa yang terjadi berikutnya.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Rekomendasi apa yang kamu sampaikan ke Head of Data atas model vendor ini? (Keputusan final — seperti memo yang sudah dikirim.)",
      options: [
        {
          id: "opt-terima",
          label: "Terima model — klaim 98,7% cukup untuk produksi",
          rationale:
            "Laporan vendor 40 halaman terlihat profesional dan dua audit administratif sudah lolos. Gap bisa dijelaskan sebagai “perbedaan distribusi” yang akan membaik dengan fine-tuning di produksi.",
          nextStepId: "temuan-terima",
          consequenceNote:
            "Kontrak ditandatangani Jumat itu juga. Tiga bulan kemudian akurasi produksi stabil di ~72% — vendor menyalahkan “pergeseran data”. Kamu yang menandatangani memo penerimaannya, dan memo itu masih tersimpan.",
        },
        {
          id: "opt-tolak",
          label: "Tolak — validasi terkontaminasi, bukti overfitting kuat",
          rationale:
            "Gap 27,86 poin + kurva overfitting + held-out bersih ~71% = klaim 98,7% tidak dapat dipertahankan. Integritas evaluasi di atas kenyamanan jadwal pengadaan.",
          nextStepId: "temuan-tolak",
          consequenceNote:
            "Vendor protes keras dan mengancam jalur hukum. Audit independen yang kamu minta membenarkan semua temuanmu — termasuk duplikat 18,4% di validation set. Perusahaan batal membeli model rapuh senilai miliaran rupiah.",
        },
        {
          id: "opt-reevaluasi",
          label: "Minta evaluasi ulang independen di held-out bersih",
          rationale:
            "Belum tolak, belum terima: beri vendor satu kesempatan membuktikan klaimnya pada data yang benar-benar baru dan bersih, di bawah pengawasanmu. Bukti yang menentukan, bukan opini.",
          nextStepId: "temuan-reevaluasi",
          consequenceNote:
            "Vendor setuju dengan syarat ketat. Hasil evaluasi ulang: 73,1% — klaim 98,7% runtuh dengan bukti yang tidak bisa dibantah siapa pun. Kamu tidak menuduh; angka yang bicara.",
        },
      ],
    },
  },
  {
    id: "temuan-terima",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: model diterima",
    prose: [
      "Kontrak ditandatangani Jumat sore — tepat waktu, semua orang lega. Tiga bulan kemudian tim operasional mulai mengeluh: model “sering salah” pada citra baru. Akurasi produksi stabil di angka 72%, nyaris sama persis dengan held-out bersih yang dulu kamu abaikan. Vendor mengirim surat resmi: “pergeseran distribusi data di luar kendali kami”.",
      "Pelajaran yang mahal: menerima model rapuh tidak menghilangkan kerapuhannya — hanya memindahkan biayanya ke operasional, dengan bunga. Memo penerimaan bertanda tanganmu masih tersimpan di arsip — dan setiap insiden produksi merujuk kembali ke sana.",
    ],
    tasks: [],
    note: {
      title: "Tanda tanganmu = kepemilikan risiko",
      type: "risk",
      body: "Memo validasi bukan formalitas — ia memindahkan risiko dari vendor ke penandatangannya. Itulah kenapa validator dibayar untuk berani bilang “tidak”: satu “tidak” yang benar lebih murah dari tiga bulan produksi yang salah.",
    },
  },
  {
    id: "temuan-tolak",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: model ditolak",
    prose: [
      "Kamu mengirim memo penolakan Rabu pagi — dua hari sebelum batas tanda tangan. Vendor meradang: mengancam jalur hukum, menuduhmu “tidak paham deep learning”. Head of Data sempat goyah. Lalu audit independen yang kamu syaratkan keluar: duplikat 18,4% di validation set, scaling bocor, early stopping fiktif — semua yang kamu temukan, terkonfirmasi pihak ketiga.",
      "Perusahaan batal menghabiskan miliaran rupiah untuk model rapuh. Vendor tidak jadi menggugat — sulit menggugat orang yang angkanya benar. Kamu tidak populer di kalangan vendor, tapi di perusahaanmu, “validator yang berani bilang tidak” menjadi standar baru.",
    ],
    tasks: [],
    note: {
      title: "Penolakan butuh bukti, bukan keberanian saja",
      type: "risk",
      body: "Keputusan sekeras ini hanya bertahan bila buktinya sekeras gap 27,86 poin milikmu. Tanpa angka itu, penolakan = drama. Dengan angka itu, penolakan = profesionalisme. Itulah kenapa Lab 1 ada sebelum keputusan ini.",
    },
  },
  {
    id: "temuan-reevaluasi",
    goto: "audit",
    eyebrow: "Langkah 6 · Konsekuensi",
    title: "Diputuskan: evaluasi ulang independen",
    prose: [
      "Kamu tidak menuduh — kamu menguji. Vendor diberi 2 minggu: buktikan 98,7% pada held-out baru yang kamu siapkan dan awasi. Mereka menyetujui dengan percaya diri. Hasilnya: 73,1%. Keheningan di ruang rapat itu nyaris terdengar.",
      "Ini jalan yang paling tak terbantahkan: bukan opinimu melawan laporan 40 halaman mereka, melainkan angka mereka sendiri melawan klaim mereka sendiri. Kontrak dinegosiasi ulang dari nol — kali ini dengan klausul evaluasi independen yang kamu tulis.",
    ],
    tasks: [],
    note: {
      title: "“Buktikan, jangan percaya” — versi profesional",
      type: "pitfall",
      body: "Evaluasi ulang independen adalah senjata paling sopan sekaligus paling mematikan bagi validator: tidak ada tuduhan, tidak ada drama — hanya protokol yang tidak bisa dimanipulasi. Selalu minta ini SEBELUM menandatangani, bukan sesudah.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 7 · Misi audit",
    title: "Dossier 12 baris: laporan 40 halaman yang “lolos” itu bohong",
    prose: [
      "Sebelum menulis memo, satu misi audit. Di bawah ini 12 baris “Kutipan Laporan Validasi Model — v2.1 (Vendor)”, dokumen yang mengklaim model SIAP PRODUKSI dengan akurasi validasi 98,7%. Seseorang menyuntikkan 4 sabotase ke dalamnya. Bandingkan dengan hasil lab-mu sendiri — angka tidak bisa berbohong dua kali.",
      "Senjatamu: gap rata-rata 27,86 poin, val_loss minimum di epoch 17 (naik 0,95 setelahnya), dan agregasi per seed dari Lab 2.",
    ],
    tasks: [],
    auditDossier: {
      version: "misi-diagnosa-overfitting-m2a-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai kutipan Laporan Validasi Model v2.1 vendor yang menyatakan model SIAP PRODUKSI.",
      columns: ["#", "Kutipan laporan vendor", "Angka / klaim"],
      rows: [
        // ── I1: cherry-pick ──
        { rowId: 1, cells: { "#": "1", "Kutipan laporan vendor": "Akurasi validasi model (headline)", "Angka / klaim": "98,7%" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 1" }] },
        { rowId: 2, cells: { "#": "2", "Kutipan laporan vendor": "Catatan kaki headline", "Angka / klaim": "Terbaik dari 5 seed; rata-rata 98,3% ± 0,1%" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 1" }] },
        { rowId: 3, cells: { "#": "3", "Kutipan laporan vendor": "Akurasi train (epoch 50)", "Angka / klaim": "99,5%" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 12" }] },
        // ── I2: duplikat ──
        { rowId: 4, cells: { "#": "4", "Kutipan laporan vendor": "Duplikat train ↔ validation", "Angka / klaim": "0% — sudah dideduplikasi (pencocokan hash)" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 9" }] },
        // ── I3: scaling ──
        { rowId: 5, cells: { "#": "5", "Kutipan laporan vendor": "Normalisasi fitur", "Angka / klaim": "StandardScaler di-fit pada data train" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 10" }] },
        { rowId: 6, cells: { "#": "6", "Kutipan laporan vendor": "Urutan pipeline (diagram hal. 10)", "Angka / klaim": "split → fit scaler pada train → transform" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 10" }] },
        // ── I4: early stopping ──
        { rowId: 7, cells: { "#": "7", "Kutipan laporan vendor": "Early stopping", "Angka / klaim": "epoch 12 — val_loss terbaik, training dihentikan" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 14" }] },
        { rowId: 8, cells: { "#": "8", "Kutipan laporan vendor": "Checkpoint yang dikirim", "Angka / klaim": "model_final_epoch50.pkl" }, claims: [{ label: "Dokumen", value: "Berita acara serah terima" }] },
        { rowId: 9, cells: { "#": "9", "Kutipan laporan vendor": "Total epoch training (log)", "Angka / klaim": "50" }, claims: [{ label: "Dokumen", value: "Lampiran C — log training" }] },
        { rowId: 10, cells: { "#": "10", "Kutipan laporan vendor": "Akurasi pilot produksi 2 minggu (lampiran D)", "Angka / klaim": "72,3%" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — lampiran D" }] },
        { rowId: 11, cells: { "#": "11", "Kutipan laporan vendor": "Gap train − test", "Angka / klaim": "tidak dilaporkan" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1" }] },
        { rowId: 12, cells: { "#": "12", "Kutipan laporan vendor": "Rekomendasi vendor", "Angka / klaim": "Siap produksi — disetujui tim vendor" }, claims: [{ label: "Dokumen", value: "Laporan Validasi v2.1 — hal. 40" }] },
      ],
      injections: [
        { key: "cherry-pick", rowIds: [1, 2], title: "Metrik cherry-picked dari 1 seed terbaik", clue: "98,7% = seed terbaik dari 5, bukan kinerja tipikal. Hitung ulang dari metrik_seed.csv: rata-rata 98,25% dengan simpangan 0,44 — bukan “±0,1%” seperti catatan kaki. Headline memakai angka undian terbaik, bukan angka yang jujur.", danger: "Satu seed terbaik bukan estimasi kinerja — itu undian. Keputusan produksi dari angka undian = membeli risiko buta senilai kontrak." },
        { key: "duplikat", rowIds: [4], title: "Duplikat train di validation set", clue: "Laporan mengklaim “0% — didedup via hash”. Audit hash independen menemukan 18,4% baris validation cocok persis dengan train. Model yang menghafal train otomatis “benar” pada duplikatnya — val accuracy menggelembung tanpa model jadi lebih pintar.", danger: "Validasi yang terkontaminasi duplikat = ujian dengan kunci jawaban bocor. Semua metrik di atasnya sampah." },
        { key: "scaling", rowIds: [5, 6], title: "Scaling di-fit pada data penuh", clue: "Laporan menulis “split → fit scaler pada train”. Log preprocessing menunjukkan StandardScaler.fit() dipanggil pada 50.000 baris PENUH sebelum split — statistik scaler (mean/std) sudah “melihat” data validasi dan test sebelum model dilatih.", danger: "Preprocessing yang di-fit sebelum split adalah kebocoran klasik: kecil, sunyi, dan meracuni seluruh evaluasi tanpa meninggalkan jejak di metrik." },
        { key: "early-stopping", rowIds: [7, 8], title: "Early stopping dilaporkan pada epoch yang salah", clue: "Klaim: “epoch 12, val_loss terbaik, training dihentikan”. Kurva datamu: val_loss minimum di epoch 17 — dan training berjalan penuh 50 epoch (baris 9), dengan file yang dikirim bernama model_final_epoch50.pkl (baris 8). Tidak ada early stopping yang terjadi; epoch 12 bukan titik terbaik.", danger: "Checkpoint yang salah = model yang dikirim bukan model yang dievaluasi. Kamu memvalidasi A, produksi menjalankan B." },
      ],
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 8 · Deliverable",
    title: "Memo validasi untuk Head of Data",
    prose: [
      "Semua bukti di tangan. Tulis memo validasi model satu halaman untuk Head of Data — artefak portofoliomu. Memo yang baik tidak hanya bilang “rapuh”, tapi menunjukkan ANGKA kerapuhannya, apa yang disembunyikan laporan vendor, dan apa yang harus terjadi berikutnya sebelum Jumat.",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Ringkasan eksekutif (3 kalimat): generalization gap teramati, temuan kurva, vonis atas klaim 98,7%.",
        "Bukti kuantitatif: gap rata-rata 27,86 poin, val_loss min epoch 17 vs training 50 epoch, agregasi per seed (seed 2 paling rapuh: 29,42).",
        "Temuan audit laporan: sabotase apa yang kamu temukan di laporan vendor, baris per baris.",
        "Rekomendasi: apa yang harus terjadi pada kontrak (rujuk keputusanmu di Langkah 5 + syarat yang bisa diverifikasi).",
        "Batas & risiko sisa: apa yang TIDAK dicakup validasi ini (mis. data sintetis; drift distribusi di produksi; held-out hanya 5 seed).",
      ],
      rubric: [
        { criterion: "Kebenaran diagnosis", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "Gap 27,86 poin, val_loss min epoch 17, std antar-seed 1,48 — semua tepat"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa baris bukti", "Keempat sabotase disebut dengan nomor baris"] },
        { criterion: "Kualitas rekomendasi", weight: 25, levels: ["Rekomendasi tanpa dasar bukti", "Ada rekomendasi, alasan kabur", "Rekomendasi merujuk keputusan Langkah 5 + syarat yang bisa diverifikasi"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim validasi membuktikan segalanya", "Menyebut sebagian batas", "Batas (data sintetis, held-out kecil, risiko drift produksi) dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 9 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di laporan validasi vendor:",
      "1) **Cherry-pick seed** (baris 1–2): headline “98,7%” adalah seed terbaik dari 5 — bukan kinerja tipikal. Rata-rata sebenarnya 98,25% dengan simpangan 0,44 (bukan “±0,1%”). Bahkan angka “rata-rata” pun masih menutupi masalah sebenarnya: gap ke held-out bersih.",
      "2) **Duplikat train di validation** (baris 4): klaim “0% didedup via hash” vs audit hash independen: 18,4% baris validation adalah duplikat persis train. Inilah mesin penggelembung 98,7%: model tidak perlu pintar, cukup menghafal.",
      "3) **Scaling bocor** (baris 5–6): diagram mengklaim “split → fit scaler pada train”, tapi log menunjukkan fit pada 50.000 baris penuh sebelum split. Kebocoran sunyi — tidak terlihat di metrik, meracuni semuanya.",
      "4) **Early stopping fiktif** (baris 7–8): klaim “epoch 12, val_loss terbaik, training dihentikan” vs kurva: minimum di epoch 17, training jalan 50 epoch penuh, checkpoint yang dikirim = epoch 50. Model yang divalidasi bukan model yang dikirim.",
      "Skor deteksimu (x/4) mengukur satu hal: apakah kamu menghitung ulang angka laporan dari data mentah, atau memercayai stempel “validasi”. Dan ingat keputusan bercabangmu: tidak ada opsi yang gratis — validator terbaik bukan yang paling keras, melainkan yang buktinya paling tidak bisa dibantah. Gap 27,86 poin milikmu itu tidak bisa dibantah.",
      "Bahaya nyata terakhir: model rapuh yang lolos validasi = keputusan produksi yang salah setiap hari, dalam skala. Satu model fraud yang “98%” tapi sebenarnya 72% berarti ribuan transaksi salah skor per hari — dan tidak ada yang tahu sampai kerugiannya diaudit.",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #3: validasi lolos sekali = aman selamanya",
      type: "risk",
      body: "Validasi adalah foto, bukan jaminan. Distribusi data produksi bergeser — pola yang dihafal hari ini bisa usang bulan depan. Itulah kenapa model butuh MONITORING (bukan sekadar validasi pra-rilis): lacak gap train−produksi berkala, dan tetapkan ambang yang memicu retraining.",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 10 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Diagnosis kuantitatif: gap train−test rata-rata 27,86 poin; val_loss minimum di epoch 17 tapi training diteruskan ke epoch 50 (naik 0,95); simpangan antar-seed 1,48 poin.",
      "Empat pola sabotase laporan validasi: cherry-pick seed terbaik, duplikat train di validation (18,4%), scaling di-fit pada data penuh, early stopping fiktif pada epoch yang salah.",
      "Keputusan atas model rapuh selalu punya harga: terima (risiko mengendap + tanda tanganmu), tolak (butuh bukti sekeras gap 27,86), evaluasi ulang (tak terbantahkan, tanpa drama).",
      "Akurasi validasi tinggi bukan bukti model bagus — hanya bukti evaluasi yang (katanya) bersih. Verifikasi integritas evaluasinya dulu.",
      "Data: SINTETIS (generator NumPy seed 42, 2026-10-15) — kurva.csv 500 baris + metrik_seed.csv 5 seed; klaim vendor adalah fiksi misi.",
    ],
  },
];

(misiOverfit.steps as V2Step[]).push(...LANJUTAN_OVERFIT);
