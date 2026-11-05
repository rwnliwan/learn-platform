import type { V2Lesson } from "../lib/types";

export const a11: V2Lesson = {
  slug: "a11-tipe-data",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.1 Tipe Data: Salah Skala, Salah Semua",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-kolektibilitas",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Rata-rata kolektibilitas 1,5 yang menyembunyikan macet",
      prose: [
        "Bank Maju Jaya memamerkan dashboard cabangnya ke direksi. KPI-nya: rata-rata skor kolektibilitas debitur, 1 = lancar sampai 5 = macet. Cabang Surabaya mencetak 1,5 — sangat sehat, kata slidenya.",
        "Tiga bulan kemudian tim audit turun. Di balik angka 1,5 itu: 80 debitur lancar (skor 1), 10 kurang lancar (skor 2), dan 10 sudah macet total (skor 5). Hitungannya benar: (80×1 + 10×2 + 10×5) / 100 = 1,5. Matematikanya tidak salah, maknanya yang salah total: skor kolektibilitas adalah peringkat, bukan angka sungguhan. Merata-ratakannya seperti merata-ratakan panas, hangat, dingin lalu menyimpulkan suam-suam kuku.",
      ],
      formula: String.raw`\text{rata-rata} = \frac{80(1) + 10(2) + 10(5)}{100} = 1{,}5 \qquad \text{macet} = \frac{10}{100} = 0{,}1`,
      formulaNote: "Pembilang = jumlah skor tertimbang: 80 debitur skor 1, 10 skor 2, 10 skor 5; 100 = total debitur; hasilnya 1,5 — rata-rata yang benar secara aritmetika tetapi menyesatkan karena skornya ordinal; 10/100 = 0,1 = proporsi debitur macet yang disembunyikan rata-rata.",
      tasks: [
        { id: "t1", text: "Bangun daftar `skor` lalu hitung `rata`-nya" },
        { id: "t2", text: "Hitung proporsi debitur macet (`skor` 5) sebagai `macet`" },
      ],
      expected: "rata=1.5  macet=0.1",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Satu angka rata-rata bisa menyembunyikan konsentrasi risiko. Debitur macet 10% adalah angka yang harus muncul di laporan, bukan terkubur dalam rata-rata yang cantik.",
      },
      hints: [
        "Bangun list dengan perkalian: [1]*80.",
        "Rata-rata = sum(skor) / len(skor).",
        "macet = skor.count(5) / len(skor)",
      ],
      code: {
        starter: `# Surabaya: 80 lancar (1), 10 kurang lancar (2), 10 macet (5)\nskor = [1]*80 + [2]*10 + [5]*10\n\n# TULIS KODEMU\nrata = \nmacet = \n\nprint(f"rata={rata}  macet={macet}")`,
        lockLines: 2,
        solution: `# Surabaya: 80 lancar (1), 10 kurang lancar (2), 10 macet (5)\nskor = [1]*80 + [2]*10 + [5]*10\n\n# TULIS KODEMU\nrata = sum(skor) / len(skor)\nmacet = skor.count(5) / len(skor)\n\nprint(f"rata={rata}  macet={macet}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata", value: 1.5, tol: 1e-9, label: "`rata` seharusnya 1.5", msg: "(80×1 + 10×2 + 10×5)/100 = 1,5. Cek komposisi list-nya." },
          { kind: "equal", task: "t2", name: "macet", value: 0.1, tol: 1e-9, label: "`macet` seharusnya 0.1", msg: "10 dari 100 debitur berskor 5. Hitung skor.count(5) / len(skor)." },
          { kind: "stdout_matches", task: "t2", pattern: "rata=1\\.5\\s+macet=0\\.1", label: "`print` menampilkan keduanya", msg: "Format: rata=...  macet=... ." },
        ],
      },
      reference: "sum(list), len(list), list.count(x).",
    },
    {
      id: "nominal",
      eyebrow: "Langkah 2 · Nominal",
      title: "Nominal: label yang buta angka",
      prose: [
        "Data nominal hanyalah label untuk membedakan kategori. Tidak ada lebih besar atau lebih kecil — hanya sama atau beda. Contoh: jenis kelamin, kode cabang JKT-01, status perkawinan, jenis kartu.",
        "Satu-satunya operasi yang valid adalah = dan ≠. Penjumlahan, pengurangan, perkalian, pembagian semuanya tidak bermakna. Satu-satunya ringkasan yang valid adalah frekuensi dan modus (kategori tersering): dari 10 laporan fraud — phising 6, skimming 3, social-engineering 1 — modusnya phising.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `modus` dari daftar `laporan`" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "modus=phising",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kodenya angka, jadi dihitung. Kode pos 10110 terlihat seperti angka, tapi itu label wilayah. Tesnya: kalau kodenya diganti nama kota tanpa mengubah makna analisismu, itu nominal. Rata-rata kode pos adalah omong kosong.",
      },
      hints: [
        "Modus = nilai dengan frekuensi tertinggi.",
        "Pola: max(set(laporan), key=laporan.count).",
        "modus = max(set(laporan), key=laporan.count)",
      ],
      code: {
        starter: `laporan = ["phising"]*6 + ["skimming"]*3 + ["social-engineering"]\n\n# TULIS KODEMU: kategori tersering\nmodus = \n\nprint(f"modus={modus}")`,
        lockLines: 1,
        solution: `laporan = ["phising"]*6 + ["skimming"]*3 + ["social-engineering"]\n\n# TULIS KODEMU: kategori tersering\nmodus = max(set(laporan), key=laporan.count)\n\nprint(f"modus={modus}")`,
        checks: [
          { kind: "defined", task: "t1", name: "modus", label: "`modus` terdefinisi", msg: "Buat variabel bernama modus di kode editable." },
          { kind: "stdout_matches", task: "t2", pattern: "modus=phising", label: "`print` menampilkan phising", msg: "phising muncul 6 kali, paling sering. Cek pola max(set(...), key=....count)." },
        ],
      },
      reference: "max(set(list), key=list.count) = modus.",
    },
    {
      id: "ordinal",
      eyebrow: "Langkah 3 · Ordinal",
      title: "Ordinal: urutan ada, jaraknya misterius",
      prose: [
        "Data ordinal punya urutan yang bermakna, tapi jarak antar level tidak diketahui sama. Rating kredit AAA > AA > A > BBB; tingkat kepuasan 1–5; kolektibilitas 1–5. Boleh dibandingkan urutannya, tidak boleh dijumlahkan.",
        "Portofolio 100 debitur: 70 rating A, 20 B, 8 C, 2 D. Kode buatan A=1, B=2, C=3, D=4 memberi rata-rata 1,42 — terbaca aman. Tapi PD riil tiap rating tidak berjarak sama: A=0,2%, B=1%, C=5%, D=20%. Expected loss sebenarnya 1,14%, dan 2 debitur rating D tenggelam di antara 70 debitur A.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata_rating` dari kode buatan (A=1, B=2, C=3, D=4)" },
        { id: "t2", text: "Hitung `el_riil` (persen) dari PD sebenarnya tiap rating" },
      ],
      expected: "rata_rating=1.42  el_riil=1.14",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Angka 1–4 itu buatanmu sendiri, bukan sifat datanya. Jarak A→B (PD naik 0,5%) jauh lebih kecil dari C→D (PD naik 15%). Kalau kesimpulanmu runtuh saat mapping diganti 1,2,3,4 menjadi 1,4,9,16 — analisismu memang tidak valid dari awal.",
      },
      hints: [
        "rata_rating = jumlah(kode × jumlah) / total debitur.",
        "el_riil dihitung dari PD, bukan dari kode buatan.",
        "el_riil = sum(komposisi[r]*pd[r] for r in komposisi)/n*100",
      ],
      code: {
        starter: `komposisi = {"A": 70, "B": 20, "C": 8, "D": 2}\nkode    = {"A": 1, "B": 2, "C": 3, "D": 4}        # angka BUATAN\npd_riil = {"A": 0.002, "B": 0.01, "C": 0.05, "D": 0.20}  # PD sebenarnya\n\nn = sum(komposisi.values())\n\n# TULIS KODEMU\nrata_rating = \nel_riil = \n\nprint(f"rata_rating={rata_rating:.2f}  el_riil={el_riil:.2f}")`,
        lockLines: 5,
        solution: `komposisi = {"A": 70, "B": 20, "C": 8, "D": 2}\nkode    = {"A": 1, "B": 2, "C": 3, "D": 4}        # angka BUATAN\npd_riil = {"A": 0.002, "B": 0.01, "C": 0.05, "D": 0.20}  # PD sebenarnya\n\nn = sum(komposisi.values())\n\n# TULIS KODEMU\nrata_rating = sum(komposisi[r]*kode[r] for r in komposisi) / n\nel_riil = sum(komposisi[r]*pd_riil[r] for r in komposisi) / n * 100\n\nprint(f"rata_rating={rata_rating:.2f}  el_riil={el_riil:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata_rating", value: 1.42, tol: 1e-9, label: "`rata_rating` seharusnya 1.42", msg: "(70×1 + 20×2 + 8×3 + 2×4)/100 = 1,42." },
          { kind: "equal", task: "t2", name: "el_riil", value: 1.14, tol: 1e-9, label: "`el_riil` seharusnya 1.14", msg: "(70×0,002 + 20×0,01 + 8×0,05 + 2×0,20)/100 × 100 = 1,14." },
          { kind: "stdout_matches", task: "t2", pattern: "rata_rating=1\\.42\\s+el_riil=1\\.14", label: "`print` menampilkan keduanya", msg: "Format dua desimal: rata_rating=1.42  el_riil=1.14." },
        ],
      },
      reference: "Rata-rata ordinal memberi rasa aman yang palsu; expected loss dihitung dari PD riil.",
    },
    {
      id: "interval",
      eyebrow: "Langkah 4 · Interval",
      title: "Interval: jarak akurat, nol palsu",
      prose: [
        "Skala interval punya jarak yang bermakna dan sama, tapi angka nolnya arbitrer — nol bukan berarti tidak ada. Contoh: suhu Celsius, tahun kalender, skor IQ. Selisih boleh, klaim kelipatan dilarang.",
        "Suhu naik dari 20°C ke 40°C: selisihnya 20°C, benar. Tapi klaim 2x lipat salah — nol Celsius itu titik beku air yang dipilih manusia. Dalam Kelvin (nol absolut): 313K vs 293K, rasionya 1,07, bukan 2.",
      ],
      formula: String.raw`\frac{313}{293} \approx 1{,}07 \neq 2`,
      formulaNote: "313K = 40 derajat Celsius dalam Kelvin; 293K = 20 derajat Celsius dalam Kelvin; rasio 1,07 membuktikan klaim dua kali lipat salah — nol Celsius arbitrer (titik beku air), nol Kelvin absolut.",
      tasks: [
        { id: "t1", text: "Hitung `ratio` suhu dalam Kelvin (313/293), dibulatkan 2 desimal" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "ratio=1.07",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "40°C dua kali lebih panas dari 20°C. Yang dua kali hanya angkanya, bukan panasnya. Setiap klaim N kali lipat butuh nol absolut — termasuk di bisnis: tidak ada persen perubahan dari baseline nol yang arbitrer.",
      },
      hints: [
        "Kelvin = Celsius + 273,15 → 40°C = 313K, 20°C = 293K.",
        "Bagi lalu bulatkan dua desimal dengan round().",
        "ratio = round(313/293, 2)",
      ],
      code: {
        starter: `# 40°C = 313K, 20°C = 293K (nol absolut)\n\n# TULIS KODEMU\nratio = \n\nprint(f"ratio={ratio}")`,
        lockLines: 1,
        solution: `# 40°C = 313K, 20°C = 293K (nol absolut)\n\n# TULIS KODEMU\nratio = round(313/293, 2)\n\nprint(f"ratio={ratio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ratio", value: 1.07, tol: 1e-9, label: "`ratio` seharusnya 1.07", msg: "313/293 = 1,068… dibulatkan 1,07." },
          { kind: "stdout_matches", task: "t2", pattern: "ratio=1\\.07", label: "`print` menampilkan rasio", msg: "Format: ratio=1.07." },
        ],
      },
      reference: "round(angka, 2). Interval: selisih boleh, klaim kelipatan dilarang.",
    },
    {
      id: "rasio-grain",
      eyebrow: "Langkah 5 · Rasio dan grain",
      title: "Rasio: angka sejati — dan pertanyaan grain",
      prose: [
        "Skala rasio punya nol yang sesungguhnya: Rp 0 berarti tidak berpenghasilan. Semua operasi valid — DPD 60 memang dua kali DPD 30. Mean, SD, persen perubahan: semua boleh. Tapi justru karena paling enak dipakai, skala rasio paling sering dipalsukan: tahun 2026 adalah interval, nomor punggung 10 adalah nominal.",
        "Satu pertanyaan mendahului semuanya: satu baris data = apa? Tabel 3 baris transaksi dari 2 nasabah: COUNT(*) = 3 menghitung transaksi, bukan nasabah. AVG(saldo) di tabel transaksi = rata-rata per transaksi, bukan per nasabah — makna yang berbeda total.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `transaksi` = jumlah baris" },
        { id: "t2", text: "Hitung `nasabah` = jumlah nasabah unik" },
      ],
      expected: "transaksi=3  nasabah=2",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Salah grain = salah agregasi = salah keputusan. Laporan NPL per transaksi vs per nasabah bisa memberi kesan yang berbeda total ke regulator. Tulis dulu: satu baris = ___.",
      },
      hints: [
        "Jumlah baris = len(trans).",
        "Nasabah unik: ambil kolom pertama tiap baris, pakai set().",
        "nasabah = len(set(t[0] for t in trans))",
      ],
      code: {
        starter: `# 3 baris transaksi, hanya 2 nasabah\ntrans = [("N1", 50), ("N2", 80), ("N1", 60)]\n\n# TULIS KODEMU\ntransaksi = \nnasabah = \n\nprint(f"transaksi={transaksi}  nasabah={nasabah}")`,
        lockLines: 2,
        solution: `# 3 baris transaksi, hanya 2 nasabah\ntrans = [("N1", 50), ("N2", 80), ("N1", 60)]\n\n# TULIS KODEMU\ntransaksi = len(trans)\nnasabah = len(set(t[0] for t in trans))\n\nprint(f"transaksi={transaksi}  nasabah={nasabah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "transaksi", value: 3, tol: 1e-9, label: "`transaksi` seharusnya 3", msg: "Tiga baris = tiga transaksi. len(trans)." },
          { kind: "equal", task: "t2", name: "nasabah", value: 2, tol: 1e-9, label: "`nasabah` seharusnya 2", msg: "N1 muncul dua kali. set() membuang duplikat." },
          { kind: "stdout_matches", task: "t2", pattern: "transaksi=3\\s+nasabah=2", label: "`print` menampilkan keduanya", msg: "Format: transaksi=3  nasabah=2." },
        ],
      },
      reference: "len(list), len(set(...)). Grain menentukan makna setiap agregasi.",
    },
    {
      id: "minicase-kpi",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Surabaya vs Medan: angka sama, risiko beda",
      prose: [
        "Kamu analis di Bank Maju Jaya. Dua cabang melaporkan rata-rata skor kolektibilitas (1 = lancar … 5 = macet): Surabaya 80% skor 1, 10% skor 2, 10% skor 5 → rata-rata 1,5. Medan 60% skor 1, 40% skor 2 → rata-rata 1,4.",
        "Direksi menyimpulkan Medan sedikit lebih baik, keduanya sangat sehat. Dua kesalahan: skornya ordinal sehingga rata-rata tidak bermakna, dan Surabaya menyembunyikan 10% debitur macet total di balik rata-rata yang cantik. Medan justru jauh lebih sehat — tidak ada satu pun debitur macet.",
        "Metrik yang jujur: laporkan distribusi per bucket plus NPL ratio (skor 3–5). Surabaya NPL = 10%, Medan NPL = 0%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung rata-rata skor kedua cabang (`sby`, `mdn`)" },
        { id: "t2", text: "Hitung NPL ratio kedua cabang (`npl_sby`, `npl_mdn`) sebagai proporsi skor ≥ 3" },
      ],
      expected: "sby=1.5  mdn=1.4  npl_sby=0.1  npl_mdn=0.0",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk CKPN (cadangan kerugian), jangan rata-ratakan skor — petakan tiap bucket ke PD riil lalu hitung expected loss = Σ exposure × PD × LGD per bucket. Skor 5 dengan PD ~100% tidak boleh diencerkan oleh skor 1.",
      },
      hints: [
        "sby = [1]*80 + [2]*10 + [5]*10; mdn = [1]*60 + [2]*40.",
        "NPL = proporsi skor ≥ 3: sum(1 for x in s if x >= 3)/len(s).",
        "Bandingkan angka mean-nya dengan angka NPL-nya.",
      ],
      code: {
        starter: `s = [1]*80 + [2]*10 + [5]*10   # Surabaya\nm = [1]*60 + [2]*40           # Medan\n\n# TULIS KODEMU\nsby = \nmdn = \nnpl_sby = \nnpl_mdn = \n\nprint(f"sby={sby}  mdn={mdn}  npl_sby={npl_sby}  npl_mdn={npl_mdn}")`,
        lockLines: 2,
        solution: `s = [1]*80 + [2]*10 + [5]*10   # Surabaya\nm = [1]*60 + [2]*40           # Medan\n\n# TULIS KODEMU\nsby = sum(s)/len(s)\nmdn = sum(m)/len(m)\nnpl_sby = sum(1 for x in s if x >= 3)/len(s)\nnpl_mdn = sum(1 for x in m if x >= 3)/len(m)\n\nprint(f"sby={sby}  mdn={mdn}  npl_sby={npl_sby}  npl_mdn={npl_mdn}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sby", value: 1.5, tol: 1e-9, label: "`sby` seharusnya 1.5", msg: "Rata-rata Surabaya: (80×1 + 10×2 + 10×5)/100." },
          { kind: "equal", task: "t1", name: "mdn", value: 1.4, tol: 1e-9, label: "`mdn` seharusnya 1.4", msg: "Rata-rata Medan: (60×1 + 40×2)/100." },
          { kind: "equal", task: "t2", name: "npl_sby", value: 0.1, tol: 1e-9, label: "`npl_sby` seharusnya 0.1", msg: "10 dari 100 debitur Surabaya berskor 5 (≥ 3)." },
          { kind: "equal", task: "t2", name: "npl_mdn", value: 0.0, tol: 1e-9, label: "`npl_mdn` seharusnya 0.0", msg: "Medan tidak punya skor ≥ 3." },
          { kind: "stdout_matches", task: "t2", pattern: "npl_sby=0\\.1\\s+npl_mdn=0\\.0", label: "`print` menampilkan NPL keduanya", msg: "Format: sby=... mdn=... npl_sby=... npl_mdn=... ." },
        ],
      },
      reference: "Proporsi bersyarat: sum(1 for x in data if x >= 3)/len(data).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Nominal = label buta angka → hanya frekuensi/modus; mean/median/SD tidak bermakna.",
        "Ordinal = urutan tanpa jarak pasti → median/modus; mean skor dilarang karena mapping angkanya buatanmu.",
        "Interval = jarak sama, nol palsu → mean/SD valid, tapi dilarang klaim N kali lipat.",
        "Rasio = nol absolut → semua operasi valid; pastikan kolom angka bukan berkedok (kode, tahun, skor).",
        "Tulis grain dulu — satu baris = ___ — sebelum query agregasi apa pun.",
      ],
      next: { label: "A1.3 — Ukuran Sebaran", href: "/learn/a13-sebaran" },
      quiz: [
        {
          q: "Kolom kode_pos berisi 10110, 20112, 30114. Skala apa ini?",
          options: [
            { text: "Ordinal — karena angkanya berurutan", why: "Urutan angka tidak bermakna: 20112 tidak lebih besar dari 10110 secara wilayah." },
            { text: "Nominal — karena hanya label wilayah", why: "Kode pos hanya label. Tes ganti label: ganti jadi nama kota tanpa mengubah makna.", correct: true },
            { text: "Interval — karena selisihnya bermakna", why: "Selisih kode pos tidak menyatakan apa-apa tentang jarak wilayah." },
            { text: "Rasio — karena bisa dihitung rata-rata", why: "Bisa dihitung bukan berarti bermakna. Rata-rata kode pos tidak menunjuk wilayah mana pun." },
          ],
        },
        {
          q: "Survei kepuasan (1–5) dirata-rata jadi 3,7 lalu dilaporkan nasabah puas. Masalah utamanya?",
          options: [
            { text: "Tidak ada — 3,7 di atas 3 jadi memang puas", why: "Skor kepuasan ordinal; jarak 1→2 belum tentu sama dengan 4→5, jadi mean 3,7 tidak bermakna." },
            { text: "Skor ordinal: jarak antar level tidak diketahui, mean tidak bermakna", why: "Mean 3,7 memberi presisi palsu atas jarak yang tidak pernah diukur. Laporkan median + % skor 4–5.", correct: true },
            { text: "Sampelnya kurang besar", why: "Ukuran sampel tidak memperbaiki masalah skala." },
            { text: "Harusnya pakai standar deviasi juga", why: "SD dari skor ordinal juga tidak bermakna." },
          ],
        },
        {
          q: "Suhu naik dari 20°C ke 40°C. Pernyataan mana yang benar?",
          options: [
            { text: "Suhu menjadi 2x lipat lebih panas", why: "Dalam Kelvin hanya 313K/293K ≈ 1,07x. Nol Celsius itu nol palsu." },
            { text: "Suhu naik 20°C — klaim kelipatan tidak valid untuk skala interval", why: "Skala interval mengizinkan selisih, melarang klaim rasio.", correct: true },
            { text: "Suhu naik 100% dalam skala Kelvin", why: "Kenaikan Kelvin-nya 20/293 ≈ 6,8%, bukan 100%." },
          ],
        },
        {
          q: "Tabel 10.000 baris, setiap kombinasi bulan+nasabah muncul tepat sekali. Grain-nya?",
          options: [
            { text: "Satu baris = satu transaksi", why: "Tidak ada kolom transaksi; polanya snapshot bulanan." },
            { text: "Satu baris = satu nasabah per bulan", why: "Setiap nasabah punya satu baris per bulan. COUNT(*) = jumlah snapshot, bukan nasabah unik.", correct: true },
            { text: "Satu baris = satu bulan", why: "Kalau begitu tiap bulan hanya satu baris, bukan ribuan." },
          ],
        },
        {
          q: "DPD (days past due) 0, 15, 30, 90. Skala apa?",
          options: [
            { text: "Nominal", why: "DPD punya urutan dan jarak yang bermakna, bukan sekadar label." },
            { text: "Ordinal", why: "Jaraknya bermakna (30 hari menunggak = 2x 15 hari), jadi lebih dari ordinal." },
            { text: "Interval", why: "Nol-nya absolut (tidak menunggak sama sekali), jadi ini rasio." },
            { text: "Rasio", why: "DPD 0 = ketiadaan tunggakan. DPD 60 memang dua kali DPD 30. Semua operasi valid.", correct: true },
          ],
        },
      ],
      note: {
        title: "Intuisi: skala data adalah kontrak operasi yang diizinkan",
        body: "Lima heuristik. Satu: sebelum menghitung apa pun, tanya skalanya — rata-rata skor ordinal 1 sampai 5 adalah pelanggaran kontrak yang terlihat rapi di dashboard. Dua: kode angka bukan angka — skor 1=lancar sampai 5=macet tidak berjarak sama; rata-rata 1,5 bisa menyembunyikan 10 persen debitur macet total. Tiga: bedakan nol palsu dari nol sejati — suhu 40 derajat bukan “dua kali” 20 derajat, tetapi DPD 60 hari memang dua kali DPD 30 hari; klaim kelipatan hanya sah di skala rasio. Empat: grain dulu, selalu — satu baris sama dengan apa? Salah menjawab berarti COUNT, rata-rata, dan rate semuanya salah sejak fondasi. Lima: agregasi buta skala menghasilkan KPI yang rapi tetapi dusta — analis senior selalu membuka distribusi di balik rata-rata; angka tunggal tanpa distribusi adalah cerita yang belum selesai diperiksa. Enam: dokumentasikan skala di kamus data — setiap kolom punya skala yang tertulis eksplisit; analis berikutnya tidak boleh menebak apakah 1 sampai 5 itu ordinal atau interval.",
      },
    },
  ],
};
