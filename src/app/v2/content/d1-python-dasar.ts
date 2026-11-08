import type { V2Lesson } from "../lib/types";

export const d1: V2Lesson = {
  slug: "d1-python-dasar",
  track: "Python",
  module: "Dasar Python",
  title: "D1 Python Dasar: Bahasa Kedua Seorang Analis",
  estMinutes: 65,
  tryFirst: true,
  steps: [
    {
      id: "tipe-data",
      eyebrow: "Langkah 1 · Tipe data",
      title: "Cerita pembuka: SQL bertemu batasnya",
      prose: [
        "Kamu sudah bisa SQL. Lalu datang permintaan: ambil data transaksi dari API, bersihkan, hitung model skor kredit, kirim email laporan otomatis tiap pagi. SQL tidak bisa panggil API, tidak bisa kirim email, tidak bisa machine learning.",
        "Python mengisi semua celah itu: API, cleaning kompleks, statistik, ML, otomasi. Kombinasi SQL (ambil data) + Python (olah data) adalah 90% pekerjaan data analyst. Track ini mengajarkan Python untuk analisis, bukan Python umum.",
        "Fondasinya: lima tipe dasar. `int` (32), `float` (8.5), `str` ('Andi'), `bool` (True), dan `None` — padanan NULL di SQL, artinya tidak tahu, bukan 0. Python tidak menebak konversi: `'5' + 3` itu error, bukan 8. Kamu harus eksplisit: `int('5') + 3`.",
      ],
      tasks: [
        { id: "t1", text: "Ubah `teks` menjadi integer lalu tambahkan 3, simpan di `hasil`" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "hasil=8",
      note: {
        title: "Sering salah",
        body: "Menulis `'5' + 3` dan mengira hasilnya 8. Python tidak melakukan konversi implisit antara str dan int. Error `can only concatenate str` hampir selalu berarti masalah konversi tipe: bungkus dengan `int()` atau `float()` dulu.",
      },
      hints: [
        "Python tidak mengubah tipe data diam-diam: teks dan angka itu dua dunia berbeda. Supaya bisa dijumlahkan, teksnya harus diubah dulu menjadi bilangan — konversi ini harus eksplisit, ditulis di kode.",
        "Ada fungsi bawaan bernama `int()` yang mengubah string angka menjadi integer. Ingat: variabel `teks` saat ini berisi string '5', bukan angka 5.",
        "hasil = ...(teks) + ... — isi fungsi konversinya dan angka penambahnya.",
      ],
      code: {
        starter: `teks = '5'\n\n# TULIS KODEMU: ubah teks jadi int, lalu tambah 3\nhasil = \n\nprint(f"hasil={hasil}")`,
        lockLines: 1,
        solution: `teks = '5'\n\n# TULIS KODEMU: ubah teks jadi int, lalu tambah 3\nhasil = int(teks) + 3\n\nprint(f"hasil={hasil}")`,
        checks: [
          { kind: "defined", task: "t1", name: "hasil", label: "`hasil` terdefinisi", msg: "Buat variabel bernama hasil di kode editable." },
          { kind: "equal", task: "t1", name: "hasil", value: 8, tol: 1e-9, label: "`hasil` seharusnya 8", msg: "int('5') = 5, lalu 5 + 3 = 8." },
          { kind: "stdout_matches", task: "t2", pattern: "hasil=8", label: "`print` menampilkan hasil", msg: "Cetak dengan format hasil=... seperti contoh." },
        ],
      },
      reference: "int(x), float(x), str(x). None = tidak ada nilai, bukan 0.",
    },
    {
      id: "alur-kontrol",
      eyebrow: "Langkah 2 · if / elif / else",
      title: "Keputusan berurutan: bucket DPD",
      prose: [
        "Analisis kredit penuh dengan klasifikasi: DPD 0 berarti lancar, 1-30 ringan, 31-90 sedang, di atas itu berat. Di Python ini ditulis dengan `if` / `elif` / `else` — dicek berurutan, berhenti di kondisi pertama yang benar.",
        "Dua hal yang menjebak pemula: indentasi 4 spasi menentukan blok (tidak ada kurung kurawal), dan urutan kondisi menentukan prioritas. Untuk dpd = 45: bukan 0, lebih dari 30, kurang dari sama dengan 90 — jadi bucketnya sedang.",
      ],
      tasks: [
        { id: "t1", text: "Tulis rantai `if`/`elif`/`else` yang mengisi `bucket` dari `dpd`" },
        { id: "t2", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "bucket=sedang",
      note: {
        title: "Sering salah",
        body: "Menulis kondisi tumpang tindih tanpa urutan yang benar, misalnya `if dpd <= 90` sebelum `if dpd <= 30` — maka dpd = 15 ikut masuk cabang pertama. Urutkan dari paling spesifik (atau paling kecil) ke paling umum.",
      },
      hints: [
        "Kondisi dicek berurutan dari atas — cabang pertama yang benar menang, sisanya dilewati. Urutan menentukan: uji dari batas terkecil ke terbesar, agar dpd kecil tidak tertelan cabang yang lebih besar.",
        "Kamu butuh rantai `if` / `elif` / `else`. Di dalamnya ada perbandingan `==` dan `<=`, dan tiap cabang mengisi `bucket` dengan salah satu dari: \"lancar\", \"ringan\", \"sedang\", \"berat\".",
        "if ...:\n    bucket = ...\nelif ...:\n    bucket = ...\nelif ...:\n    bucket = ...\nelse:\n    bucket = ...",
      ],
      code: {
        starter: `dpd = 45\n\n# TULIS KODEMU: isi bucket dari dpd (lancar/ringan/sedang/berat)\nif :\n    bucket = \n\nprint(f"bucket={bucket}")`,
        lockLines: 1,
        solution: `dpd = 45\n\n# TULIS KODEMU: isi bucket dari dpd (lancar/ringan/sedang/berat)\nif dpd == 0:\n    bucket = "lancar"\nelif dpd <= 30:\n    bucket = "ringan"\nelif dpd <= 90:\n    bucket = "sedang"\nelse:\n    bucket = "berat"\n\nprint(f"bucket={bucket}")`,
        checks: [
          { kind: "defined", task: "t1", name: "bucket", label: "`bucket` terdefinisi", msg: "Buat variabel bernama bucket di dalam rantai if." },
          { kind: "equal", task: "t1", name: "bucket", value: "sedang", label: "`bucket` seharusnya 'sedang'", msg: "dpd = 45: bukan 0, lewat 30, kena <= 90." },
          { kind: "stdout_matches", task: "t2", pattern: "bucket=sedang", label: "`print` menampilkan bucket", msg: "Cetak dengan format bucket=... ." },
        ],
      },
      reference: "if / elif / else + indentasi 4 spasi. Kondisi dicek berurutan.",
    },
    {
      id: "loop-akumulator",
      eyebrow: "Langkah 3 · for dan akumulator",
      title: "Loop: pola akumulator",
      prose: [
        "Pola paling umum di analisis manual: mulai dari 0, lewati tiap elemen, tambahkan. Ini disebut akumulator — dan ia adalah fondasi `sum()`, `mean()`, dan seluruh agregasi.",
        "`range(3)` menghasilkan 0, 1, 2 — berhenti sebelum 3. `for g in gaji` mengiterasi langsung tiap elemen. Catatan untuk nanti: di pandas kamu akan menghindari loop (vectorize, D3/D4), tapi loop tetap alat untuk logika, bukan komputasi massal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `total` gaji dengan loop `for` (tanpa `sum()`)" },
        { id: "t2", text: "Hitung `rata` = total / banyak data, cetak 2 desimal" },
      ],
      expected: "rata=9166666.67",
      note: {
        title: "Sering salah",
        body: "Lupa inisialisasi `total = 0` sebelum loop, atau membagi dengan angka tebakan. Banyaknya data = `len(gaji)`, bukan angka yang kamu kira-kira.",
      },
      hints: [
        "Pola akumulator: siapkan wadah bernilai awal, lalu kunjungi tiap elemen satu per satu dan kumpulkan ke wadah itu. Loop hanya untuk mengumpulkan — rata-rata dihitung setelah loop selesai.",
        "Kamu butuh `for g in gaji:` dengan `total` yang sudah diinisialisasi sebelum loop, dan banyaknya data didapat dari `len(...)`. Ingat: langkah ini melarang fungsi `sum()`.",
        "total = 0\nfor ...:\n    total = ...\nrata = ... / ...",
      ],
      code: {
        starter: `gaji = [8_000_000, 12_500_000, 7_000_000]\n\n# TULIS KODEMU: total dengan loop, lalu rata-rata\ntotal = 0\n\nrata = \n\nprint(f"rata={rata:.2f}")`,
        lockLines: 1,
        solution: `gaji = [8_000_000, 12_500_000, 7_000_000]\n\n# TULIS KODEMU: total dengan loop, lalu rata-rata\ntotal = 0\nfor g in gaji:\n    total = total + g\n\nrata = total / len(gaji)\n\nprint(f"rata={rata:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total", value: 27500000, tol: 1e-9, label: "`total` seharusnya 27500000", msg: "8jt + 12,5jt + 7jt = 27,5jt." },
          { kind: "equal", task: "t2", name: "rata", value: 9166666.67, tol: 0.01, label: "`rata` seharusnya 9166666.67", msg: "27500000 / 3 = 9166666.67." },
          { kind: "forbids", task: "t1", token: "sum", label: "tanpa fungsi sum()", msg: "Langkah ini melatih pola akumulator manual — tulis loop-nya." },
          { kind: "stdout_matches", task: "t2", pattern: "rata=9166666\\.67", label: "`print` menampilkan rata-rata", msg: "Format: rata=... dengan 2 desimal." },
        ],
      },
      reference: "for x in data: ... ; range(n) = 0..n-1. Underscore 8_000_000 hanya pemisah baca.",
    },
    {
      id: "fungsi",
      eyebrow: "Langkah 4 · Fungsi",
      title: "Fungsi: bungkus logika jadi reusable",
      prose: [
        "Setiap kali kamu copy-paste kode 2 kali, jadikan fungsi. `def npl_pct(macet, total)` dengan docstring menjelaskan kontraknya, dan guard clause `if total == 0: return 0.0` mencegah crash saat data kotor.",
        "Aturan fungsi analis: satu tugas, di bawah 20 baris, nama jelas (`bucket_dpd`, bukan `f`). Fungsi bisnis selalu butuh validasi input — kalimat tidak mungkin negatif adalah undangan bug.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `npl_pct(macet, total)` yang mengembalikan persen NPL" },
        { id: "t2", text: "Tangani `total == 0` agar tidak ZeroDivisionError" },
      ],
      expected: "npl=4.2  npl_nol=0.0",
      note: {
        title: "Sering salah",
        body: "Menulis fungsi tanpa guard clause untuk pembagi nol. Data nyata selalu punya kasus tepi: total 0, list kosong, nilai negatif. Tulis penjaganya sebelum kamu membutuhkannya.",
      },
      hints: [
        "Fungsi yang membagi harus siap menghadapi pembagi nol — data nyata selalu punya kasus tepi. Amankan dulu kasus berbahayanya di baris paling awal, baru hitung normalnya.",
        "Struktur `def npl_pct(macet, total):` dengan docstring sudah diberi. Di dalamnya kamu butuh pemeriksaan `total == 0` sebagai penjaga di awal, dan `return` untuk rumus persen NPL.",
        "def npl_pct(macet, total):\n    \"\"\"NPL % — macet dan total dalam satuan sama.\"\"\"\n    if ...:\n        return ...\n    return ...",
      ],
      code: {
        starter: `# TULIS KODEMU: fungsi npl_pct(macet, total)\ndef npl_pct(macet, total):\n    """NPL % — macet dan total dalam satuan sama."""\n\n\nprint(f"npl={npl_pct(42, 1000)}")\nprint(f"npl_nol={npl_pct(0, 0)}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: fungsi npl_pct(macet, total)\ndef npl_pct(macet, total):\n    """NPL % — macet dan total dalam satuan sama."""\n    if total == 0:\n        return 0.0\n    return 100.0 * macet / total\n\n\nprint(f"npl={npl_pct(42, 1000)}")\nprint(f"npl_nol={npl_pct(0, 0)}")`,
        checks: [
          { kind: "defined", task: "t1", name: "npl_pct", label: "`npl_pct` terdefinisi", msg: "Definisikan fungsi bernama npl_pct." },
          { kind: "stdout_matches", task: "t1", pattern: "npl=4\\.2", label: "npl_pct(42, 1000) = 4.2", msg: "100.0 * 42 / 1000 = 4.2." },
          { kind: "stdout_matches", task: "t2", pattern: "npl_nol=0\\.0", label: "npl_pct(0, 0) = 0.0 tanpa crash", msg: "Tambahkan guard: if total == 0: return 0.0." },
        ],
      },
      reference: "def nama(param): ... return .... Docstring menjelaskan kontrak fungsi.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Kuis tengah",
      title: "Cek cepat sebelum lanjut",
      prose: [
        "Dua soal cepat dari langkah 1-3. Jawab, lalu baca alasan tiap opsi.",
      ],
      tasks: [],
      quiz: [
        {
          q: "'5' + 3 di Python menghasilkan...",
          options: [
            { text: "8", why: "Itu yang terjadi di JavaScript, bukan Python. Python tidak mengonversi otomatis." },
            { text: "'53'", why: "Itu hasil '5' + '3' (string + string). Di sini 3 adalah int." },
            { text: "Error (str + int)", why: "Python menolak mencampur tipe tanpa konversi eksplisit. Pakai int('5') + 3.", correct: true },
            { text: "53 (integer)", why: "Itu menggabungkan digit lalu menganggapnya angka — Python tidak melakukan itu tanpa int() eksplisit." },
          ],
        },
        {
          q: "range(3) menghasilkan...",
          options: [
            { text: "1, 2, 3", why: "range mulai dari 0, bukan 1." },
            { text: "0, 1, 2", why: "Mulai dari 0 dan berhenti sebelum 3.", correct: true },
            { text: "0, 1, 2, 3", why: "Batas akhir tidak termasuk." },
            { text: "3, 2, 1", why: "range tidak menghitung mundur kecuali diberi step negatif." },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Python vs SQL: kapan memakai yang mana",
      prose: [
        "Tidak ada bahasa yang lebih baik — hanya yang lebih tepat untuk pekerjaan ini. Ambil, filter, dan agregat di database: SQL, karena deklaratif dan dekat dengan data. API, file, scraping, statistik, ML, otomasi terjadwal: Python, karena SQL tidak bisa melakukannya.",
        "Saat keduanya bisa, mulai dari SQL: jangan tarik 1 juta baris untuk di-filter di Python. Filter di database, analisis di Python. Analis senior bukan yang fanatik satu bahasa — ia bilingual dan tahu kapan memakai yang mana.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risiko kredit, pola SQL-dulu-Python-kemudian melindungi dari dua kegagalan: menarik data mentah raksasa (lambat, boros) dan menghitung metrik risiko di lapisan yang salah (tidak teraudit). Agregat di database = satu sumber kebenaran.",
      },
      reference: "SQL = ambil data; Python = olah data. Fungsi untuk logika yang dipakai 2x atau lebih.",
    },
    {
      id: "minicase-denda",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Kalkulator denda keterlambatan",
      prose: [
        "Bank menetapkan denda 2% per bulan dari tunggakan, dihitung harian pro-rata. Seorang nasabah menunggak Rp 5 juta selama 45 hari. Tulis fungsi `denda(tunggakan, hari)` dan hitung dendanya.",
        "Lalu uji kasus tepinya: hari = 0 seharusnya 0. Hari negatif? Denda negatif tidak masuk akal — fungsi bisnis yang baik menolak input itu dengan `raise ValueError`.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `denda(tunggakan, hari)` = tunggakan x 2% x hari/30" },
        { id: "t2", text: "Tambahkan validasi: hari negatif melempar `ValueError`" },
      ],
      expected: "denda=150,000",
      note: {
        title: "Sering salah",
        body: "Lupa validasi input lalu mengembalikan denda negatif untuk hari negatif. Di sistem nyata, angka negatif bisa lolos ke laporan dan mengurangi tagihan. Validasi di fungsi = pertahanan pertama.",
      },
      hints: [
        "Fungsi bisnis yang baik menolak input yang tidak masuk akal sebelum menghitung — denda untuk hari negatif tidak ada artinya. Tolak dulu, hitung kemudian.",
        "Di awal fungsi, periksa `hari < 0` lalu lempar `raise ValueError(...)`. Rumusnya: tunggakan dikali 2% per bulan, dihitung pro-rata per hari dari 30 hari.",
        "def denda(tunggakan, hari):\n    \"\"\"Denda 2% per bulan, pro-rata harian.\"\"\"\n    if ...:\n        raise ValueError(...)\n    return ...",
      ],
      code: {
        starter: `# TULIS KODEMU: fungsi denda(tunggakan, hari)\ndef denda(tunggakan, hari):\n    """Denda 2% per bulan, pro-rata harian."""\n\n\nprint(f"denda={denda(5_000_000, 45):,.0f}")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: fungsi denda(tunggakan, hari)\ndef denda(tunggakan, hari):\n    """Denda 2% per bulan, pro-rata harian."""\n    if hari < 0:\n        raise ValueError("hari tidak boleh negatif")\n    return tunggakan * 0.02 * hari / 30\n\n\nprint(f"denda={denda(5_000_000, 45):,.0f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "denda", label: "`denda` terdefinisi", msg: "Definisikan fungsi bernama denda." },
          { kind: "uses", task: "t2", token: "ValueError", label: "validasi memakai ValueError", msg: "Tambahkan raise ValueError untuk hari negatif." },
          { kind: "stdout_matches", task: "t1", pattern: "denda=150,000", label: "`print` menampilkan 150,000", msg: "5000000 x 0.02 x 45/30 = 150000." },
        ],
      },
      reference: "raise ValueError(...) untuk input bisnis yang tidak valid. Denda riil memakai compounding — ini fondasinya.",
    },
    {
      id: "intuisi-praktisi",
      eyebrow: "Langkah 7 · Intuisi",
      title: "Intuisi: Python analis ditulis untuk dibaca, bukan untuk dikagumi",
      prose: [
        "Setelah enam langkah, kamu punya fondasi. Ini heuristik yang membedakan kode analis yang bertahan 2 tahun dari kode yang ditulis ulang tiap kuartal.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Python analis ditulis untuk dibaca, bukan untuk dikagumi",
        body: "Tiga pabrik bug terbesar di kode analis Python: asumsi tipe implisit, mutasi diam-diam, dan copy-paste. Python tidak menebak — '5' + 3 error, bukan 8 — jadi jadikan eksplisit sebagai kebiasaan: konversi tipe ditulis, bukan diharapkan. Heuristik pertama: tipe dulu, logika kemudian — saat output aneh, cetak type() sebelum menyalahkan logika; 80% \"bug logika\" analis ternyata kolom bertipe object. Heuristik kedua: setiap kali kamu copy-paste blok kode kedua kalinya, jadikan fungsi dengan docstring sebagai kontrak — kontrak itu dibaca orang yang debug jam 2 pagi, dan orang itu seringnya kamu sendiri 6 bulan lagi. Heuristik ketiga: None berarti tidak tahu, bukan 0 dan bukan string kosong — memperlakukannya sebagai 0 adalah cara paling sopan memalsukan laporan. Heuristik keempat: angka ajaib dilarang berkeliaran — 90 di if dpd > 90 harus bernama BATAS_MACET, karena 6 bulan lagi tidak ada yang ingat 90 itu hari, persen, atau rupiah. Uji seniornya sederhana: bisakah rekanmu memahami fungsi ini tanpa meneleponmu? Kode yang butuh penjelasan lisan adalah utang yang bunganya dibayar tiap ada turnover tim.",
      },
      reference: "Eksplisit > implisit; tipe dulu; fungsi = kontrak; None bukan 0; angka ajaib dilarang.",
    },
    {
      id: "transfer-cicilan",
      kind: "transfer",
      eyebrow: "Transfer check · tanpa petunjuk",
      title: "Kasus baru: cicilan pinjaman koperasi",
      prose: [
        "Tanpa petunjuk, tanpa nilai yang diharapkan: koperasi menawarkan pinjaman Rp 240 juta tenor 12 bulan, cicilan flat per bulan. Datanya tiba sebagai string dari formulir — persis seperti kasus teks '5' di langkah 1.",
        "Tulis fungsi `cicilan(p, t)` yang menerima angka ATAU string angka, menolak tenor yang tidak positif dengan `ValueError`, lalu pakai fungsi itu untuk menghitung total yang dibayar nasabah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `cicilan(p, t)`: konversi input ke angka, tolak tenor ≤ 0 dengan `ValueError`, kembalikan cicilan per bulan" },
        { id: "t2", text: "Hitung `total_bayar` untuk data di atas memakai fungsi itu, cetak dengan format ribuan" },
      ],
      noLiteral: ["total_bayar"],
      code: {
        starter: `pokok = '240000000'\ntenor = '12'\n\n# TULIS KODEMU: fungsi cicilan(p, t) + total_bayar\ndef cicilan(p, t):\n    """Cicilan flat per bulan. p dan t boleh angka atau string angka."""\n\ntotal_bayar = \n\nprint(f"total={total_bayar:,.0f}")`,
        lockLines: 2,
        solution: `pokok = '240000000'\ntenor = '12'\n\n# TULIS KODEMU: fungsi cicilan(p, t) + total_bayar\ndef cicilan(p, t):\n    """Cicilan flat per bulan. p dan t boleh angka atau string angka."""\n    p = float(p)\n    t = int(t)\n    if t <= 0:\n        raise ValueError("tenor harus positif")\n    return p / t\n\ntotal_bayar = cicilan(pokok, tenor) * int(tenor)\n\nprint(f"total={total_bayar:,.0f}")`,
        checks: [
          { kind: "defined", task: "t1", name: "cicilan", label: "fungsi `cicilan` terdefinisi", msg: "Definisikan fungsi bernama cicilan dengan dua parameter." },
          { kind: "uses", task: "t1", token: "ValueError", label: "validasi memakai ValueError", msg: "Tolak tenor yang tidak positif dengan raise ValueError." },
          { kind: "uses", task: "t1", token: "cicilan", label: "`cicilan` dipakai di perhitungan", msg: "Hitung total_bayar dengan memanggil fungsi cicilan — bukan menulis angkanya langsung." },
          { kind: "equal", task: "t2", name: "total_bayar", value: 240000000, tol: 1e-9, label: "`total_bayar` konsisten dengan cicilan × tenor", msg: "Kalikan cicilan per bulan dengan tenor — total harus kembali ke pokok pinjaman." },
          { kind: "stdout_matches", task: "t2", pattern: "total=240,000,000", label: "hasil tercetak dengan format ribuan", msg: "Cetak dengan format total=... memakai pemisah ribuan." },
        ],
      },
      reference: "Konversi eksplisit dulu (float/int), validasi input bisnis, fungsi kecil yang bisa dipakai ulang.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat soal campuran dari seluruh lesson. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Kapan copy-paste sebaiknya dijadikan fungsi?",
          options: [
            { text: "Tidak pernah", why: "Copy-paste berulang = bug saat diubah di satu tempat tapi lupa di tempat lain." },
            { text: "Saat dipakai 2x atau lebih", why: "Aturan DRY: dipakai ulang berarti layak dibungkus fungsi.", correct: true },
            { text: "Hanya jika lebih dari 100 baris", why: "Fungsi 5 baris yang dipakai 10x tetap layak jadi fungsi." },
            { text: "Selalu, bahkan 1x", why: "Fungsi untuk sekali pakai menambah kompleksitas tanpa manfaat." },
          ],
        },
        {
          q: "None paling mirip dengan...",
          options: [
            { text: "0", why: "0 adalah nilai, None adalah ketiadaan nilai." },
            { text: "NULL di SQL: tidak tahu", why: "Keduanya berarti tidak ada nilai, bukan nol atau kosong.", correct: true },
            { text: "String kosong", why: "String kosong adalah nilai yang valid, bukan ketiadaan." },
            { text: "False", why: "False adalah boolean, bukan ketiadaan nilai." },
          ],
        },
        {
          q: "Tugas: ambil data dari API lalu hitung model. Alat yang tepat...",
          options: [
            { text: "SQL saja", why: "SQL tidak bisa memanggil API atau melatih model." },
            { text: "Python (SQL tidak bisa panggil API/ML)", why: "Python mengisi celah SQL: API, statistik, ML, otomasi.", correct: true },
            { text: "Excel", why: "Tidak bisa memanggil API secara terprogram dengan andal." },
            { text: "Python untuk API, SQL untuk model", why: "Pembagiannya terbalik: SQL tidak melatih model ML — Python yang mengisi API, statistik, dan ML." },
          ],
        },
        {
          q: "print(7 // 2) menghasilkan... dan kapan // berguna?",
          options: [
            { text: "3.5 — tidak pernah berguna", why: "7 // 2 = 3 (floor division), dan ia berguna untuk hitung grup penuh." },
            { text: "3 — untuk hitung berapa grup penuh, mis. 100 nasabah // 10 per batch", why: "// adalah floor division. Berguna untuk pembagian grup.", correct: true },
            { text: "1 — sisa pembagian", why: "Itu %, bukan //. 7 % 2 = 1." },
            { text: "Error", why: "// adalah operator valid di Python." },
          ],
        },
      ],
      summary: [
        "Tipe: int/float/str/bool/None — konversi eksplisit, tidak ada tebakan otomatis.",
        "Kontrol: if/elif/else, for, while — indentasi 4 spasi adalah blok.",
        "Fungsi: def + return + docstring + guard clause; DRY untuk logika 2x pakai.",
        "SQL + Python pasangan komplementer: SQL ambil data, Python olah data.",
        "Fungsi bisnis selalu validasi input: raise ValueError untuk yang tidak valid.",
      ],
      next: { label: "D2 — Struktur Data", href: "/v2/learn/d2-struktur-data" },
    },
  ],
};
