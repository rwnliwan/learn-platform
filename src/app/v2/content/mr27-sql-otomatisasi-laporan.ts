import type { V2Lesson } from "../lib/types";

const FIG_PIPELINE = `<svg viewBox=\"0 0 560 380\" role=\"img\" aria-label=\"Pipa otomasi laporan harian dan grafik utilisasi limit per desk.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Pipa laporan harian: dari data mentah ke keputusan</text>
<rect x=\"20\" y=\"40\" width=\"115\" height=\"52\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.25\" stroke=\"var(--c1)\" stroke-width=\"1.5\"/>
<text x=\"77\" y=\"60\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">1. Extract</text>
<text x=\"77\" y=\"76\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">posisi + harga pasar</text>
<rect x=\"155\" y=\"40\" width=\"115\" height=\"52\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.25\" stroke=\"var(--c2)\" stroke-width=\"1.5\"/>
<text x=\"212\" y=\"60\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">2. Hitung</text>
<text x=\"212\" y=\"76\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">eksposur &amp; utilisasi</text>
<rect x=\"290\" y=\"40\" width=\"115\" height=\"52\" rx=\"8\" fill=\"var(--c4)\" opacity=\"0.25\" stroke=\"var(--c4)\" stroke-width=\"1.5\"/>
<text x=\"347\" y=\"60\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">3. Validasi</text>
<text x=\"347\" y=\"76\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">checks: total, harga</text>
<rect x=\"425\" y=\"40\" width=\"115\" height=\"52\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.25\" stroke=\"var(--c1)\" stroke-width=\"1.5\"/>
<text x=\"482\" y=\"60\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">4. Distribusi</text>
<text x=\"482\" y=\"76\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">email + dashboard</text>
<line x1=\"135\" y1=\"66\" x2=\"155\" y2=\"66\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\" marker-end=\"url(#ah)\"/>
<line x1=\"270\" y1=\"66\" x2=\"290\" y2=\"66\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"405\" y1=\"66\" x2=\"425\" y2=\"66\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<defs><marker id=\"ah\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L6,3 L0,6\" fill=\"none\" stroke=\"var(--chart-text)\" stroke-width=\"1.2\"/></marker></defs>
<text x=\"14\" y=\"122\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Utilisasi limit per desk (contoh lab)</text>
<line x1=\"60\" y1=\"330\" x2=\"520\" y2=\"330\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<text x=\"290\" y=\"356\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Desk →</text>
<text x=\"20\" y=\"220\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" transform=\"rotate(-90 20 220)\">Utilisasi % →</text>
<line x1=\"60\" y1=\"118\" x2=\"520\" y2=\"118\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/>
<text x=\"524\" y=\"122\" font-size=\"10\" fill=\"var(--c4)\">ambang WASPADA 90%</text>
<rect x=\"110\" y=\"141\" width=\"90\" height=\"189\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<text x=\"155\" y=\"348\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">FX Trading</text>
<text x=\"155\" y=\"134\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">80,0%</text>
<rect x=\"245\" y=\"141\" width=\"90\" height=\"189\" fill=\"var(--c2)\" opacity=\"0.85\"/>
<text x=\"290\" y=\"348\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Rates</text>
<text x=\"290\" y=\"134\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">80,0%</text>
<rect x=\"380\" y=\"80\" width=\"90\" height=\"250\" fill=\"var(--c4)\" opacity=\"0.85\"/>
<text x=\"425\" y=\"348\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">Ekuitas</text>
<text x=\"425\" y=\"72\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\">96,9% WASPADA</text>
</g>
</svg>`;

export const mr27: V2Lesson = {
  slug: "mr27-sql-otomatisasi-laporan",
  track: "Market Risk",
  module: "Pelaporan & Otomatisasi Data",
  title: "MR27 — SQL & Otomatisasi Laporan Market Risk: Dari Copy-Paste ke Pipa",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laporan jam 9 yang membuat Ardi hampir dipecat",
      prose: [
        "Setiap pagi pukul 07.30, Ardi — analis market risk di sebuah bank devisa Jakarta — menjalankan ritual yang sama: mengunduh posisi dari sistem treasury, membuka harga pasar dari terminal, lalu copy-paste semuanya ke spreadsheet laporan harian untuk komite. Ritual itu memakan 90 menit, dan ia benci setiap menitnya. Selasa pagi itu, ia terburu-buru: ada satu harga obligasi yang ia ketik manual, 98,50 menjadi 89,50. Satu digit.",
        "Laporan terkirim jam 09.02. Utilisasi limit desk Rates tercatat 71% — 'aman'. Padahal dengan harga yang benar, angkanya 96% — nyaris jebol. Kesalahan itu baru ketahuan Kamis, saat dealer bertanya kenapa laporannya 'tiba-tiba' melonjak. Tidak ada yang rugi uang hari itu. Tetapi kepala divisinya berkata kalimat yang menempel di kepala Ardi sampai sekarang: 'Laporan yang salah dan terlihat rapi lebih berbahaya daripada laporan yang telat.'",
        "Twist-nya: masalah Ardi bukan kecepatan mengetik — melainkan tidak adanya mesin yang memeriksa pekerjaannya. Manusia membuat kesalahan; pipa yang baik menangkapnya sebelum sampai ke komite. Lesson ini mengajarkan dua hal yang diminta pasar kerja 2026 dari analis risiko: SQL untuk membaca posisi langsung dari datanya (bukan dari spreadsheet), dan pola otomasi laporan harian — extract, hitung, validasi, distribusi — sehingga 'laporan jam 9' menjadi produk mesin yang bisa diaudit, bukan karya tangan yang bisa salah ketik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Laporan risiko adalah produk: ia punya 'pabrik' (query + kode), 'kendali mutu' (checks validasi), dan 'jadwal kirim' (otomasi). Analis yang hanya bisa membaca laporan = operator; analis yang bisa membangun pabriknya = pemilik proses. Pasar membayar yang kedua.",
      },
      reference: "Laporan salah yang rapi > laporan telat: bangun pipa, bukan ritual.",
    },
    {
      id: "eksposur",
      eyebrow: "Langkah 2 · Konsep",
      title: "Membaca posisi dengan SQL: agregasi adalah separuh pekerjaan analis",
      prose: [
        "Pertanyaan paling dasar market risk setiap pagi: 'berapa eksposur kita, di mana?' Jawabannya selalu agregasi — jumlahkan nilai posisi per desk, per mata uang, per tenor. Di SQL, itu GROUP BY: SELECT desk, SUM(notional * harga) FROM posisi GROUP BY desk. Satu query menggantikan 90 menit copy-paste Ardi, dan — yang lebih penting — query yang sama menghasilkan angka yang sama setiap kali dijalankan. Reproducibility adalah fondasi audit.",
        "Kedua, gabungkan posisi dengan limit: JOIN tabel posisi ke tabel limit, lalu hitung utilisasi. Utilisasi limit = eksposur / limit × 100%. Angka inilah yang menentukan warna di dashboard: di bawah 90% hijau, 90-100% kuning (WASPADA), di atas 100% merah (JEBOL). Analis tidak 'merasakan' risiko — ia menghitungnya, dan SQL adalah kalkulatornya.",
        "Kepribadian konsep ini: SQL adalah 'bahasa bertanya yang jujur'. Ia tidak bisa berbohong tentang data yang ada — tetapi ia juga tidak akan memberitahumu tentang data yang TIDAK ada (harga basi kemarin tetap dijumlahkan dengan patuh). Kejujuran parsial inilah yang membuat langkah validasi wajib ada.",
        "🚨 Mitos: 'Kalau datanya sudah di database, pasti benar.' Yang benar: database menyimpan apa yang dimasukkan — termasuk harga basi, posisi duplikat, dan kurs yang belum update. Query yang bagus atas data yang buruk = jawaban yang salah dengan percaya diri tinggi.",
        "🚨 Mitos: 'Excel cukup untuk laporan harian.' Yang benar: Excel cukup untuk analisis ad-hoc SEKALI. Untuk laporan yang diulang 250 hari setahun, spreadsheet manual = 250 peluang salah ketik. Pipa query + kode = tulis sekali, jalankan selamanya.",
      ],
      tasks: [],
      formula: String.raw`\text{Utilisasi} = \frac{\text{Eksposur}}{\text{Limit}} \times 100\%`,
      formulaNote: "Eksposur = total nilai posisi (notional × harga, dalam satuan yang sama); Limit = batas risiko yang ditetapkan komite. Interpretasi: utilisasi 96,9% artinya desk memakai hampir seluruh jatah risikonya — ruang gerak tinggal 3,1%. Contoh angka: eksposur Rp126 juta atas limit Rp130 juta → 126/130 × 100% = 96,9% → status WASPADA.",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji cepat kualitas query-mu: jalankan dua kali — hasilnya harus identik. Lalu ubah satu harga input 1% — hasil harus berubah proporsional. Query yang lolos kedua uji ini 'hidup' (terhubung ke data); yang tidak, mungkin membaca tabel yang salah atau cache basi.",
      },
      reference: "GROUP BY + JOIN = separuh pekerjaan analis risiko harian.",
    },
    {
      id: "kualitas",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kontrol kualitas data pasar: tiga pembunuh senyap laporan",
      prose: [
        "Pembunuh pertama: harga basi (stale price). Obligasi yang tidak diperdagangkan hari ini masih tercatat dengan harga kemarin — sistem tidak protes, query tidak protes, hanya analis yang harus protes. Kontrolnya: bandingkan timestamp harga dengan tanggal laporan; harga yang umurnya > 1 hari kerja untuk instrumen likuid = flag merah.",
        "Pembunuh kedua: posisi duplikat atau hilang. Booking yang dikoreksi kadang tercatat dua kali (yang lama tidak dihapus); trade yang gagal settlement kadang tidak masuk. Kontrolnya: rekonsiliasi — total eksposur dari query vs total dari sistem sumber (front office). Selisih ≠ 0 = investigasi sebelum laporan dikirim, bukan sesudah.",
        "Pembunuh ketiga: satuan dan kurs yang campur. Notional USD dijumlahkan dengan notional IDR tanpa konversi = angka raksasa yang salah total. Kontrolnya: checks eksplisit — setiap baris harus punya mata uang, setiap mata uang non-IDR harus punya kurs hari ini, dan total dalam IDR harus masuk akal (bandingkan dengan total kemarin: perubahan > 20% tanpa penjelasan = flag).",
        "Aturan emasnya: validasi adalah GERBANG, bukan hiasan. Pipa yang baik BERHENTI dan berteriak bila checks gagal — ia tidak mengirim laporan 'seadanya'. Laporan yang tidak terkirim karena checks gagal adalah keberhasilan sistem, bukan kegagalannya.",
        "🚨 Mitos: 'Checks validasi memperlambat laporan.' Yang benar: checks yang gagal SEKALI mencegah satu insiden Ardi — yang biayanya (kepercayaan komite) jauh lebih mahal dari 5 menit investigasi. Yang memperlambat justru investigasi manual SETELAH kesalahan sampai ke direksi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tiga checks minimum laporan harian: (1) kelengkapan — semua desk & tanggal terisi; (2) kewajaran — total berubah < ambang vs kemarin; (3) kesegaran — tidak ada harga lebih tua dari toleransi. Tulis ketiganya sebagai kode, bukan sebagai 'kebiasaan'.",
      },
      reference: "Stale price, duplikat, satuan campur: tiga yang harus ditangkap mesin.",
    },
    {
      id: "pipa",
      eyebrow: "Langkah 4 · Konsep",
      title: "Pola otomasi: extract → hitung → validasi → distribusi",
      prose: [
        "Pipa laporan harian yang matang punya empat tahap yang selalu sama. Extract: tarik posisi dari sistem sumber dan harga pasar dari feed — catat timestamp penarikan setiap tabel (provenance). Hitung: agregasi eksposur, utilisasi, sensitivitas — semua dalam kode berversi, bukan spreadsheet. Validasi: jalankan checks (tiga checks minimum dari langkah sebelumnya); bila gagal, pipa BERHENTI dan mengirim alert ke analis, bukan laporan ke komite. Distribusi: bila lolos, kirim ke email komite + update dashboard — dengan stempel 'lolos validasi' dan tautan ke kode versinya.",
        "Dua sifat yang membedakan pipa profesional dari skrip asal jalan. Idempotency: menjalankan pipa dua kali untuk tanggal yang sama menghasilkan hasil yang sama — tidak ada duplikat, tidak ada angka ganda. Caranya: tulis hasil per tanggal (partition), dan tulis-ulang menimpa, bukan menumpuk. Auditability: setiap angka di laporan bisa ditelusur balik ke query, versi kode, dan timestamp data — 'angka ini dari mana?' harus terjawab dalam 5 menit.",
        "Kepribadian konsep ini: pipa adalah 'karyawan yang tidak pernah lelah dan tidak pernah berbohong'. Ia tidak pintar — ia hanya konsisten. Dan konsistensi + checks mengalahkan analis terpintar yang bekerja manual setiap pagi dalam keadaan mengantuk.",
        "🚨 Mitos: 'Otomasi = tidak butuh analis lagi.' Yang benar: otomasi memindahkan analis dari 'tukang ketik' menjadi 'penjaga gerbang' — ia menyelidiki alert validasi, menjelaskan anomali ke komite, dan memperbaiki checks. Pekerjaan yang tersisa justru yang paling bernilai (dan paling sulit diotomasi).",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Mulai otomasi dari SATU laporan yang paling menyakitkan (biasanya laporan harian limit), bukan dari 'platform data' ambisius. Pipa kecil yang jalan 250 hari > arsitektur besar yang tidak pernah selesai. Kemenangan pertama membangun kepercayaan untuk investasi berikutnya.",
      },
      reference: "Extract → hitung → validasi → distribusi; gagal validasi = berhenti, bukan kirim.",
    },
    {
      id: "figure-pipa",
      eyebrow: "Langkah 5 · Visual",
      title: "Membaca pipa dan grafik utilisasi",
      prose: [
        "Diagram atas menunjukkan empat tahap pipa beserta apa yang mengalir di tiap tahap. Perhatikan tahap 3 (Validasi) — ia adalah satu-satunya tahap yang bisa MENGHENTIKAN aliran. Pipa tanpa gerbang validasi hanyalah 'copy-paste otomatis': lebih cepat salah, bukan lebih benar.",
        "Grafik bawah memplot utilisasi limit tiga desk dari lab lesson ini. Garis putus-putus adalah ambang WASPADA 90% — batas yang disepakati: di atasnya, desk harus menjelaskan rencana (kurangi posisi atau minta kenaikan limit sementara), bukan sekadar 'dicatat'.",
      ],
      figure: {
        svg: FIG_PIPELINE,
        alt: "Diagram pipa otomasi laporan harian dan grafik utilisasi limit per desk.",
        caption: "Cara membaca: diagram atas = 4 tahap pipa berurutan (panah = aliran data); tahap Validasi bisa menghentikan aliran bila checks gagal. Grafik bawah: sumbu X = desk, tinggi batang = utilisasi limit (%), garis putus-putus = ambang WASPADA 90%. Interpretasi: FX Trading dan Rates aman di 80,0%; Ekuitas 96,9% melewati ambang — batang oranye menandakan desk ini butuh tindakan hari ini, bukan besok.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca 'utilisasi 96,9%' sebagai 'masih di bawah 100%, jadi aman'. Ambang 90% ada karena dari 90 ke 100 hanya butuh satu hari buruk — buffer 10% adalah waktu reaksi, bukan hiasan. Analis yang menunggu 100% selalu terlambat.",
      },
      reference: "Validasi = gerbang; ambang 90% = waktu reaksi.",
    },
    {
      id: "lab-limit",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: query utilisasi limit & flag WASPADA",
      prose: [
        "Bangun mini-pipa dalam Python: database SQLite in-memory berisi tabel posisi (desk, mata uang, notional, harga) dan tabel limit. Tugasmu: tulis query agregasi eksposur per desk (JOIN + GROUP BY), hitung utilisasi, dan cetak flag WASPADA untuk utilisasi ≥ 90%. Data sudah disediakan dan terkunci — yang kamu tulis hanya logika query dan perhitungannya.",
        "Hasil yang benar: Ekuitas 126,0 (utilisasi 96,9% → WASPADA), FX Trading 80,0 (80,0%), Rates 200,0 (80,0%). Perhatikan: tanpa ORDER BY, urutan baris GROUP BY tidak dijamin — tulis ORDER BY agar laporanmu deterministik setiap dijalankan. Eksplorasi: ubah ambang menjadi 85% — desk apa saja yang kena flag? Turunkan limit Ekuitas menjadi 120 — apa yang berubah?",
      ],
      tasks: [
        { id: "t1", text: "Tulis query: eksposur per desk via JOIN + GROUP BY + ORDER BY" },
        { id: "t2", text: "Hitung utilisasi tiap desk, cetak dengan flag WASPADA bila ≥ 90%" },
      ],
      expected: "Ekuitas: eksposur=126.0 util=96.9% WASPADA\nFX Trading: eksposur=80.0 util=80.0%\nRates: eksposur=200.0 util=80.0%",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan pola lab ini: query menghitung, Python memformat dan memberi flag. Di dunia nyata polanya sama — SQL untuk agregasi (tempatnya di database), kode untuk logika bisnis (tempatnya di aplikasi). Mencampur keduanya (logika bisnis di dalam query raksasa) membuat pipa sulit diuji.",
      },
      hints: [
        "Eksposur = SUM(notional_juta * harga); JOIN posisi ke batas ON desk.",
        "Utilisasi = eksposur / limit_juta * 100; flag bila >= 90.",
        "ORDER BY p.desk agar urutan baris selalu sama.",
      ],
      code: {
        starter: "import sqlite3\n\n# Data posisi & limit — JANGAN UBAH.\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE posisi(desk TEXT, ccy TEXT, notional_juta REAL, harga REAL)\")\ncur.execute(\"CREATE TABLE batas(desk TEXT PRIMARY KEY, limit_juta REAL)\")\ncur.executemany(\"INSERT INTO posisi VALUES (?,?,?,?)\", [\n    (\"FX Trading\", \"USD\", 50, 1.0),\n    (\"FX Trading\", \"EUR\", 30, 1.0),\n    (\"Rates\", \"IDR\", 200, 1.0),\n    (\"Ekuitas\", \"IDR\", 120, 1.05),\n])\ncur.executemany(\"INSERT INTO batas VALUES (?,?)\", [\n    (\"FX Trading\", 100),\n    (\"Rates\", 250),\n    (\"Ekuitas\", 130),\n])\n\n# TULIS KODEMU: eksposur per desk, utilisasi, dan flag WASPADA (>=90%)\nq = \"\"\"\n    -- TULIS QUERY-MU: JOIN posisi ke batas, GROUP BY desk, ORDER BY desk\n\"\"\"\nrows = cur.execute(q).fetchall()\n\neks_ekuitas = \nutil_ekuitas = \nfor desk, eksposur, limit in rows:\n    util = \n    flag = \n    print(f\"{desk}: eksposur={eksposur:.1f} util={util:.1f}%{flag}\")\n",
        lockLines: 18,
        solution: "import sqlite3\n\n# Data posisi & limit — JANGAN UBAH.\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE posisi(desk TEXT, ccy TEXT, notional_juta REAL, harga REAL)\")\ncur.execute(\"CREATE TABLE batas(desk TEXT PRIMARY KEY, limit_juta REAL)\")\ncur.executemany(\"INSERT INTO posisi VALUES (?,?,?,?)\", [\n    (\"FX Trading\", \"USD\", 50, 1.0),\n    (\"FX Trading\", \"EUR\", 30, 1.0),\n    (\"Rates\", \"IDR\", 200, 1.0),\n    (\"Ekuitas\", \"IDR\", 120, 1.05),\n])\ncur.executemany(\"INSERT INTO batas VALUES (?,?)\", [\n    (\"FX Trading\", 100),\n    (\"Rates\", 250),\n    (\"Ekuitas\", 130),\n])\n\n# TULIS KODEMU: eksposur per desk, utilisasi, dan flag WASPADA (>=90%)\nq = \"\"\"\n    SELECT p.desk, SUM(p.notional_juta * p.harga) AS eksposur, b.limit_juta\n    FROM posisi p JOIN batas b ON p.desk = b.desk\n    GROUP BY p.desk\n    ORDER BY p.desk\n\"\"\"\nrows = cur.execute(q).fetchall()\n\neks_ekuitas = rows[0][1]\nutil_ekuitas = rows[0][1] / rows[0][2] * 100\nfor desk, eksposur, limit in rows:\n    util = eksposur / limit * 100\n    flag = \" WASPADA\" if util >= 90 else \"\"\n    print(f\"{desk}: eksposur={eksposur:.1f} util={util:.1f}%{flag}\")\n",
        checks: [
          { kind: "equal", task: "t1", name: "eks_ekuitas", value: 126.0, tol: 0.01, label: "Eksposur Ekuitas = 126,0", msg: "120 × 1,05 = 126,0 (dalam juta)." },
          { kind: "equal", task: "t2", name: "util_ekuitas", value: 96.92, tol: 0.05, label: "Utilisasi Ekuitas ≈ 96,9%", msg: "126 / 130 × 100% = 96,92%." },
          { kind: "stdout_matches", task: "t2", label: "Baris Ekuitas tercetak dengan flag", msg: "Format: 'Ekuitas: eksposur=126.0 util=96.9% WASPADA'.", pattern: "Ekuitas: eksposur=126.0 util=96.9% WASPADA" },
          { kind: "contains", task: "t1", name: "q", value: "GROUP BY", label: "Memakai agregasi GROUP BY", msg: "Agregasi per desk memakai GROUP BY di query." },
        ],
      },
      reference: "JOIN + GROUP BY + ORDER BY = fondasi query laporan risiko.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Empat pagi yang berbeda: apa yang dilakukan penjaga gerbang",
      prose: [
        "Skenario satu — checks lolos semua, satu desk WASPADA 96,9%: KIRIM laporan + lampirkan catatan tindakan. Laporan jalan normal; flag WASPADA memicu proses bisnis (desk menjelaskan rencana), bukan kegagalan pipa. Pipa yang baik membedakan 'peringatan bisnis' dari 'kegagalan teknis'.",
        "Skenario dua — checks gagal: total eksposur berubah 35% vs kemarin tanpa penjelasan: BERHENTI, jangan kirim. Kirim alert ke analis dengan diff-nya (desk mana yang bergerak). Laporan yang tidak terkirim karena checks gagal = sistem bekerja. Analis menyelidiki, memperbaiki data, lalu menjalankan ulang — idempotency menjamin hasil tetap benar.",
        "Skenario tiga — harga obligasi basi 3 hari (tidak ada perdagangan): KIRIM dengan catatan kaki + flag. Untuk instrumen illiquid, 'harga terakhir yang tersedia' adalah praktik yang sah — ASALKAN ditandai eksplisit sebagai stale dan analis tahu ia membaca angka kemarin. Yang dilarang adalah stale yang tidak ditandai.",
        "Skenario empat — permintaan ad-hoc direksi ('berapa eksposur kita ke sektor properti, jam 2 siang ini?'): JANGAN bangun pipa baru. Jawab dengan query ad-hoc sekali pakai dari tabel yang sama. Pipa untuk yang berulang; query cepat untuk yang sekali. Membangun pipa untuk permintaan sekali = over-engineering.",
        "Aturan praktis 10 detik: (1) apakah checks lolos? tidak → berhenti; (2) apakah ada flag bisnis? ya → kirim + catatan tindakan; (3) apakah ini permintaan berulang? ya → jadikan pipa, tidak → query ad-hoc.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengirim laporan 'seadanya' karena 'komite sudah menunggu'. Sekali komite menerima laporan yang checks-nya gagal, standar runtuh selamanya — berikutnya tidak ada yang percaya gerbang validasi. Kepercayaan pada laporan dibangun bertahun-tahun, runtuh dalam satu pengiriman.",
      },
      reference: "Lolos → kirim + tindakan; gagal → berhenti + selidiki; ad-hoc → query cepat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Bank Samudra: harga basi yang menyembunyikan jebolnya limit",
      prose: [
        "Desk FX Bank Samudra memegang USD 80 juta. Limit desk: Rp1.270 miliar. Pagi ini feed harga USD/IDR tercatat 15.750 — harga KEMARIN; harga hari ini 15.900 (rupiah melemah semalam). Analis junior memakai angka di feed tanpa memeriksa timestamp. Pertanyaan: (a) berapa eksposur dengan harga benar vs harga basi? (b) berapa utilisasi masing-masing terhadap limit? (c) apa vonis dan akar masalahnya?",
        "Pembahasan: (a) Harga benar: 80.000.000 × 15.900 = Rp1.272 miliar. Harga basi: 80.000.000 × 15.750 = Rp1.260 miliar. Selisih Rp12 miliar dari satu hari basi. (b) Utilisasi benar: 1.272/1.270 × 100% = 100,2% → JEBOL. Utilisasi basi: 1.260/1.270 × 100% = 99,2% → 'hampir jebol tapi aman'. Satu harga basi mengubah vonis dari merah menjadi kuning. (c) Vonis: limit JEBOL — desk harus mengurangi posisi atau meminta persetujuan pengecualian hari ini. Akar masalah: tidak ada checks kesegaran harga di pipa; feed kemarin dianggap harga hari ini. Perbaikan: checks 'umur harga ≤ 1 hari kerja untuk USD/IDR' + alert otomatis bila feed tidak update.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan: selisihnya 'hanya' Rp12 miliar dari Rp1,27 triliun (0,9%) — tetapi melintasi ambang keputusan. Risiko operasional sering tinggal TEPAT di sekitar ambang: kecil secara nominal, besar secara keputusan. Inilah kenapa checks kesegaran data bukan 'nice to have'.",
      },
      reference: "0,9% selisih harga = beda vonis aman vs jebol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima soal campuran dari semua langkah. Target: skor ≥ 4 dari 5. Baca juga alasan opsi yang salah — di sanalah miskonsepsi bersembunyi.",
      ],
      tasks: [],
      summary: [
        "Laporan risiko adalah produk: pabriknya query + kode, kendali mutunya checks validasi, jadwal kirimnya otomasi. SQL (GROUP BY + JOIN) menggantikan ritual copy-paste dengan angka yang reproduksibel.",
        "Tiga pembunuh senyap: harga basi, posisi duplikat/hilang, satuan & kurs campur — semuanya harus ditangkap checks mesin, bukan mata analis yang mengantuk.",
        "Pola pipa: extract → hitung → validasi → distribusi. Validasi adalah GERBANG: gagal = berhenti + alert, bukan kirim seadanya. Sifat profesional: idempotency dan auditability.",
        "Utilisasi = eksposur/limit × 100%; ambang WASPADA 90% adalah waktu reaksi — analis yang menunggu 100% selalu terlambat.",
        "Mini-case Bank Samudra: harga basi 1 hari (0,9%) mengubah vonis dari JEBOL (100,2%) menjadi 'aman' (99,2%) — checks kesegaran harga adalah kebutuhan, bukan kemewahan.",
      ],
      quiz: [
        {
          q: "Mengapa ritual copy-paste Ardi berbahaya, padahal ia 'hanya' salah ketik sekali?",
          options: [
            { text: "Tidak ada checks yang menangkap kesalahan sebelum sampai ke komite", why: "Benar: masalahnya bukan salah ketiknya (manusia pasti salah), melainkan tidak ada mesin yang memeriksanya.", correct: true },
            { text: "Karena copy-paste selalu lebih lambat dari query", why: "Kecepatan bukan inti masalah — laporan yang cepat tapi salah lebih berbahaya." },
            { text: "Karena spreadsheet tidak bisa menjumlahkan dengan benar", why: "Spreadsheet menjumlahkan dengan benar; yang salah adalah inputnya." },
            { text: "Karena Ardi kurang teliti dan harus diganti", why: "Menyalahkan orang adalah solusi yang salah — sistem yang bergantung pada ketelitian manusia setiap pagi pasti gagal." },
          ],
        },
        {
          q: "Untuk menjawab 'berapa eksposur per desk?', konstruksi SQL yang tepat adalah…",
          options: [
            { text: "JOIN posisi ke limit, lalu GROUP BY desk dengan SUM(notional × harga)", why: "Benar: agregasi per kelompok = GROUP BY; limit digabung via JOIN.", correct: true },
            { text: "WHERE desk = 'Ekuitas' lalu jumlahkan manual", why: "Itu menjawab satu desk, bukan semua — dan 'manual' mengembalikan kita ke era Ardi." },
            { text: "ORDER BY eksposur DESC tanpa GROUP BY", why: "ORDER BY mengurutkan baris, bukan mengagregasi — tanpa GROUP BY tidak ada total per desk." },
            { text: "SELECT * FROM posisi dan hitung di kepala", why: "Itu ritual copy-paste versi query — tidak scalable dan tidak teraudit." },
          ],
        },
        {
          q: "Checks validasi gagal (total berubah 35% tanpa penjelasan). Tindakan yang benar?",
          options: [
            { text: "Berhenti, jangan kirim laporan; selidiki diff-nya lalu jalankan ulang", why: "Benar: gerbang validasi ada untuk dipakai; laporan tak terkirim karena checks gagal = sistem bekerja.", correct: true },
            { text: "Kirim saja dengan catatan 'angka belum final'", why: "Catatan tidak mengembalikan kepercayaan — sekali komite menerima laporan gagal-checks, standar runtuh." },
            { text: "Ubah ambang checks agar lolos, lalu kirim", why: "Itu memalsukan kendali mutu — pelanggaran integritas, bukan solusi." },
            { text: "Tunggu sampai angkanya 'kembali normal' sendiri", why: "Menunggu tanpa investigasi = membiarkan kemungkinan kesalahan sistemik berjalan." },
          ],
        },
        {
          q: "Obligasi illiquid tidak diperdagangkan 3 hari. Perlakuan yang benar dalam laporan?",
          options: [
            { text: "Pakai harga terakhir yang tersedia, tandai eksplisit sebagai stale", why: "Benar: praktik sah untuk instrumen illiquid — yang dilarang adalah stale yang tidak ditandai.", correct: true },
            { text: "Keluarkan dari laporan sampai ada harga baru", why: "Mengeluarkan posisi = menyembunyikan eksposur — lebih berbahaya dari harga basi." },
            { text: "Tebak harganya dari obligasi sejenis tanpa mencatat", why: "Tebakan tanpa catatan = angka fiktif; analis berikutnya mengira itu harga pasar." },
            { text: "Pakai harga 3 hari lalu dan diam saja", why: "Inilah dosa Ardi versi obligasi: stale yang tidak ditandai." },
          ],
        },
        {
          q: "Ambang WASPADA 90% (bukan 100%). Alasan yang paling tepat?",
          options: [
            { text: "Buffer 10% adalah waktu reaksi — dari 90 ke 100 hanya butuh satu hari buruk", why: "Benar: ambang adalah alat peringatan dini, bukan garis finis.", correct: true },
            { text: "Karena 90% adalah angka keberuntungan manajemen risiko", why: "Tidak ada yang kebetulan dalam penetapan ambang — ia dihitung dari volatilitas harian." },
            { text: "Agar laporan terlihat lebih sibuk", why: "Flag yang terlalu sering justru diabaikan (alert fatigue) — ambang harus dikalibrasi, bukan diramaikan." },
            { text: "Karena regulator melarang utilisasi di atas 90%", why: "Tidak ada larangan umum seperti itu; ambang adalah kebijakan internal bank." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira otomasi = 'laporan selesai, analis bisa santai'. Kenyataannya analis pindah peran: dari tukang ketik menjadi penjaga gerbang + penerjemah anomali untuk komite. Pekerjaan yang tersisa justru membutuhkan judgment paling dalam.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa laporan yang TIDAK terkirim (checks gagal) bisa menjadi kabar baik.",
        "Ingat angka mini-case: 0,9% selisih harga = beda vonis. Itulah harga sebuah checks.",
      ],
      next: { label: "MR28 — Jalur Sertifikasi & Regulasi Market Risk Indonesia", href: "/v2/learn/mr28-sertifikasi-regulasi" },
      reference: "Pipa + checks = laporan yang bisa dipercaya komite.",
    },
  ],
};
