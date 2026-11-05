import type { V2Lesson } from "../lib/types";

// Histogram 24 setoran: cluster 17x di band 90-99 tepat di bawah ambang 100.
const HIST_SVG = `<svg viewBox="0 0 480 300" role="img" aria-label="Histogram 24 setoran menumpuk tepat di bawah ambang 100 juta.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="52" y1="30" x2="452" y2="30"/><line x1="52" y1="90" x2="452" y2="90"/><line x1="52" y1="150" x2="452" y2="150"/><line x1="52" y1="210" x2="452" y2="210"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="46" y="94">12</text><text x="46" y="154">8</text><text x="46" y="214">4</text><text x="46" y="264">0</text></g>
<g font-size="10" font-family="var(--font-ui)" text-anchor="middle" fill="var(--chart-text)">
<rect x="66" y="240" width="40" height="20" fill="var(--c2)"/><text x="86" y="276">0-49</text><text x="86" y="236" fill="var(--text)" font-weight="600">1</text>
<rect x="116" y="220" width="40" height="40" fill="var(--c2)"/><text x="136" y="276">50-89</text><text x="136" y="216" fill="var(--text)" font-weight="600">2</text>
<rect x="166" y="40" width="80" height="220" fill="var(--c4)"/><text x="206" y="276">90-99</text><text x="206" y="34" fill="var(--text)" font-weight="600">17</text>
<rect x="266" y="180" width="40" height="80" fill="var(--c2)"/><text x="286" y="276">100-199</text><text x="286" y="176" fill="var(--text)" font-weight="600">2</text>
<rect x="316" y="220" width="40" height="40" fill="var(--c2)"/><text x="336" y="276">200-299</text><text x="336" y="216" fill="var(--text)" font-weight="600">1</text>
<rect x="366" y="240" width="40" height="20" fill="var(--c2)"/><text x="386" y="276">300+</text><text x="386" y="236" fill="var(--text)" font-weight="600">1</text>
</g>
<line x1="256" y1="20" x2="256" y2="260" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="262" y="40" font-size="12" fill="var(--c3)" font-family="var(--font-ui)" font-weight="600">ambang 100</text>
<text x="240" y="296" text-anchor="middle" font-size="12" fill="var(--text-muted)" font-family="var(--font-ui)">nominal setoran (juta Rp) — 24 setoran</text>
</svg>`;

export const aml5: V2Lesson = {
  slug: "aml5-structuring",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML5 — Tipologi: Structuring & Smurfing",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "24 setoran yang semuanya \"legal\"",
      prose: [
        "Teller cabang Jakarta Selatan hafal wajahnya: \"Pak Dedi,\" selalu Selasa dan Kamis, selalu setoran tunai Rp92-99 juta. Tidak pernah Rp100 juta — ambang review internal bank. Enam minggu, 24 setoran, total Rp2,627 miliar. Setiap setoran diperiksa sistem: di bawah ambang, lolos. Tidak satu pun alert berbunyi.",
        "Twist-nya ada di undang-undangnya: structuring bukan tentang angka — melainkan tentang niat memecah transaksi untuk menghindari pelaporan. Tiap setoran Pak Dedi legal; polanya yang kriminal. Ketika investigator akhirnya mengagregat: 20 dari 24 setoran di bawah ambang, 17 di antaranya menumpuk di Rp90-99 juta. Peluang 17 dari 20 setoran acak jatuh tepat di band 10% itu? 1 banding 118 triliun. \"Kebetulan\" dengan peluang sekecil itu bukan kebetulan — ia bukti niat.",
        "Dan Pak Dedi bukan satu-satunya: 3 \"Pak Dedi\" lain di 3 cabang berbeda, pola identik, nomor HP terdaftar sama. Itulah smurfing — structuring yang dikerjakan banyak orang (smurf) secara terkoordinasi. Lesson ini tentang melihat pola yang dirancang untuk tidak terlihat: agregat, bukan transaksi.",
        "Setelah lesson ini kamu bisa: menghitung metrik clustering di bawah ambang, menjelaskan beda structuring vs smurfing, dan memutuskan kapan pola agregat layak menjadi SAR.",
      ],
      tasks: [],
      reference: "Structuring = satu orang memecah transaksi. Smurfing = banyak orang memecah secara terkoordinasi. Keduanya = niat menghindari ambang.",
    },
    {
      id: "sinyal",
      eyebrow: "Langkah 2 · Sinyal structuring",
      title: "Tiga sidik jari di bawah ambang",
      prose: [
        "Satu: clustering tepat di bawah ambang — fraksi transaksi di band 90-100% ambang. Nasabah normal menyebar; structurer menumpuk. Metriknya: band_ratio = count(90 ≤ x < ambang) / count(x < ambang). Di kasus Pak Dedi: 17/20 = 85%. Nasabah normal di lab: 18,2%.",
        "Dua: frekuensi anomali — 24 setoran tunai 6 minggu untuk \"perorangan\" tidak punya penjelasan bisnis. Bandingkan dengan baseline segmen: pedagang pasar setor tiap hari itu normal; karyawan setor tunai 4x seminggu itu tidak.",
        "Tiga: round-number avoidance — pelaku menghindari angka bulat (Rp100 juta) agar terlihat \"alami.\" Ironisnya, penghindaran itulah yang tidak alami: distribusi manusia normal punya banyak angka bulat. Terlalu rapi = terlalu direncanakan.",
        "Smurfing menambah dimensi keempat: kesamaan antar rekening yang \"tidak saling kenal\" — nomor HP sama, alamat sama, device banking sama, jam transaksi berdekatan. Satu smurf tidak terlihat; lima smurf dengan nomor HP sama = satu organisasi.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Di bawah ambang = legal, tidak bisa diapa-apakan.\" Salah total: undang-undang TPPU mempidanakan perbuatan memecah transaksi untuk menghindari kewajiban pelaporan — niatnya yang dilarang, bukan angkanya. Tugas analis: membangun bukti niat dari pola (clustering + frekuensi + koordinasi), bukan menunggu satu transaksi melewati ambang.",
      },
      reference: "Lihat distribusi, bukan transaksi. Satu titik tidak bercerita; 24 titik bernyanyi.",
    },
    {
      id: "matematika",
      eyebrow: "Langkah 3 · Matematika kecurigaan",
      title: "Seberapa mustahil \"kebetulan\" ini?",
      prose: [
        "Uji binomial mengubah firasat menjadi angka. Asumsi nol: setoran acak uniform Rp0-100 juta. Peluang satu setoran jatuh di band Rp90-100 juta: p = 0,1. Peluang ≥17 dari 20 setoran jatuh di sana: jumlahkan suku binomial k=17..20.",
        "Hasilnya: 8,5 × 10⁻¹⁵ — 1 banding 118 triliun. Untuk konteks: peluang memenangkan lotre 6/45 sekitar 1 banding 8 juta. Pola Pak Dedi 14 miliar kali lebih mustahil daripada menang lotre. Angka ini yang membuat SAR berdiri di depan reviewer dan hakim: bukan \"saya curiga,\" melainkan \"matematika menolak kebetulan.\"",
        "Cara membaca histogram: sumbu X = nominal setoran, tinggi batang = jumlah. Garis putus-putus = ambang 100. Interpretasi: 17 dari 24 setoran menumpuk di satu batang sempit tepat di kiri garis — distribusi yang \"takut\" melewati garis. Nasabah normal menyebar; distribusi ini memiliki tepi yang terlalu tajam di ambang.",
      ],
      formula: String.raw`P(X = k) = \binom{n}{k} p^k (1-p)^{n-k} \qquad P(X \ge 17) = \sum_{k=17}^{20} \binom{20}{k} 0{,}1^k 0{,}9^{20-k} \approx 8{,}5 \times 10^{-15}`,
      formulaNote: "n = 20 setoran di bawah ambang; p = 0,1 peluang acak jatuh di band 90-100; k = yang teramati (17). Hasil ≈ 8,5×10⁻¹⁵ = 1 banding 118 triliun.",
      figure: {
        svg: HIST_SVG,
        alt: "Histogram 24 setoran menumpuk tepat di bawah ambang 100 juta.",
        caption: "24 setoran Pak Dedi: 17 menumpuk di Rp90-99 juta, tepat di bawah ambang. Tepi distribusi yang \"takut\" garis.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Pelaku structuring berpikir seperti orang yang menghindari kamera: ia fokus pada tiap langkah agar \"aman.\" Tapi kamera statistik merekam seluruh film — dan filmnya menunjukkan seseorang yang berjalan sangat hati-hati tepat di bawah garis, 17 kali berturut-turut. Tidak ada manusia normal yang berjalan seperti itu.",
      },
      reference: "Uji statistik = penerjemah firasat menjadi bahasa yang dimengerti reviewer, regulator, dan hakim.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab agregat",
      title: "Buktikan polanya dari data mentah",
      prose: [
        "Dua nasabah, masing-masing 24 setoran. Hitung untuk tiap nasabah: berapa yang di bawah ambang (100), berapa persen yang menumpuk di band 90-100, dan totalnya. Satu nasabah adalah Pak Dedi; satunya pedagang normal. Angka mana yang berteriak?",
        "Coba eksperimen: ubah AMBANG menjadi 50 — apakah pola Pak Dedi masih terlihat? (Petunjuk: band ikut bergeser ke 45-50.) Pelajaran: ambang deteksi harus mengikuti ambang regulasi; salah ambang = salah cerita.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `analisis(deps)` → (di_bawah, pct_band, total)" },
        { id: "t2", text: "Bandingkan structuring vs normal, cetak keduanya" },
      ],
      expected: "structuring: 20/24 di bawah, 85.0% di band, total Rp2627jt | normal: 11/24, 18.2%, Rp4700jt",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Total Rp2,6 miliar < Rp4,7 miliar, jadi yang normal lebih mencurigakan.\" Total bukan sinyal structuring — distribusi yang sinyal. Pedagang normal Rp4,7 miliar menyebar alami (hanya 18,2% di band). Pak Dedi Rp2,6 miliar menumpuk 85% di band. Pencuci uang tidak tertangkap karena jumlahnya; ia tertangkap karena polanya.",
      },
      hints: [
        "bawah = [d for d in deps if d < AMBANG]; band = [d for d in bawah if 90 <= d < AMBANG].",
        "pct = len(band)/len(bawah)*100, bulatkan 1 desimal.",
        "return len(bawah), round(pct, 1), sum(deps).",
      ],
      code: {
        starter: `AMBANG = 100  # juta Rp\n\nstruct = [92,95,97,93,98,91,96,94,99,92,95,97,93,96,98,91,95,45,120,250,80,310,150,60]\nnormal = [120,45,300,80,1500,60,200,90,110,75,400,95,130,55,180,70,250,85,140,65,320,105,175,50]\n\n# TULIS KODEMU: (jumlah di bawah ambang, % di band 90-100, total)\ndef analisis(deps):\n    bawah =\n    band =\n    return\n\nfor nama, d in [("structuring", struct), ("normal", normal)]:\n    b, pct, tot = analisis(d)\n    print(f"{nama}: di_bawah={b}/24  band90-100={pct}%  total=Rp{tot}jt")`,
        lockLines: 4,
        solution: `AMBANG = 100  # juta Rp\n\nstruct = [92,95,97,93,98,91,96,94,99,92,95,97,93,96,98,91,95,45,120,250,80,310,150,60]\nnormal = [120,45,300,80,1500,60,200,90,110,75,400,95,130,55,180,70,250,85,140,65,320,105,175,50]\n\n# TULIS KODEMU: (jumlah di bawah ambang, % di band 90-100, total)\ndef analisis(deps):\n    bawah = [d for d in deps if d < AMBANG]\n    band = [d for d in bawah if 90 <= d < AMBANG]\n    return len(bawah), round(len(band) / len(bawah) * 100, 1), sum(deps)\n\nfor nama, d in [("structuring", struct), ("normal", normal)]:\n    b, pct, tot = analisis(d)\n    print(f"{nama}: di_bawah={b}/24  band90-100={pct}%  total=Rp{tot}jt")`,
        checks: [
          { kind: "defined", task: "t1", name: "analisis", label: "`analisis` terdefinisi", msg: "Buat fungsi analisis(deps) yang mengembalikan (di_bawah, pct_band, total)." },
          { kind: "stdout_matches", task: "t2", pattern: "structuring: di_bawah=20/24\\s+band90-100=85\\.0%\\s+total=Rp2627jt", label: "Pola structuring terdeteksi", msg: "20 di bawah ambang, 85.0% di band 90-100, total Rp2627jt." },
          { kind: "stdout_matches", task: "t2", pattern: "normal: di_bawah=11/24\\s+band90-100=18\\.2%", label: "Pola normal kontras", msg: "Normal: 11 di bawah, hanya 18.2% di band." },
        ],
      },
      reference: "List comprehension + round(x, 1). Band = 90 <= d < AMBANG.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Smurf",
      title: "Smurf hunting: atribut bersama + pola",
      prose: [
        "Satu smurf tidak terlihat; lima smurf dengan nomor HP sama = satu organisasi. Atribut bersama adalah jejak koordinasi: nomor HP, alamat KTP, device banking, jam transaksi berdekatan. Metode: kelompokkan rekening per atribut, lalu hitung band_ratio agregat per grup. Grup 'HP-A': 3 rekening, 66 setoran, 55 di band 90–100 → 83% → SMURF?",
        "Syarat ganda penting: rasio > 70% SAJA tidak cukup — keluarga serumah bisa berbagi HP/alamat dengan pola normal. Vonis butuh atribut SAMA + pola structuring (band > 70% + volume anomali). Di lab: HP-D (2 rekening, 43 setoran, 86%) ikut ke-flag; HP-B/C/E (rasio < 20%) lolos. Atribut = kandidat; pola = vonis.",
        "Jebakan FP: agen pulsa/agen bank yang memang memproses banyak setoran tunai nasabah — atribut (device) sama, pola mirip, tetapi ada penjelasan bisnis. Selalu cek: apakah ada peran bisnis sah untuk atribut bersama ini? Jika ya → catat + pantau, bukan SAR.",
        "Lab mengelompokkan 8 rekening by nomor HP. Hasil: 2 grup smurf (HP-A, HP-D), 3 grup normal. Langkah berikutnya di dunia nyata: naikkan ke network case (AML8) — petakan siapa koordinatornya, bukan sekadar menghitung setorannya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio` dan `vonis` tiap grup HP" },
        { id: "t2", text: "Jalankan dan pastikan 2 grup ke-flag" },
      ],
      expected: "HP-A: 66 setoran, band 83% -> SMURF?\nHP-B: 24 setoran, band 17% -> normal\nHP-C: 20 setoran, band 15% -> normal\nHP-D: 43 setoran, band 86% -> SMURF?\nHP-E: 18 setoran, band 11% -> normal",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Atribut sama = pasti satu jaringan.” Keluarga serumah berbagi HP dan alamat dengan pola normal; agen pulsa memproses setoran banyak orang sebagai bisnis sah. Atribut = kandidat investigasi; pola structuring = vonis. Keduanya harus ada.",
      },
      hints: [
        "Agregat dulu per HP, baru hitung rasio.",
        "Syarat ganda: rasio > 70 DAN n >= 40.",
      ],
      code: {
        starter: "# (rekening, hp, jumlah_setoran, setoran_di_band_90_100). JANGAN UBAH.\nrekening = [(\"R1\",\"HP-A\",24,20),(\"R2\",\"HP-A\",22,18),(\"R3\",\"HP-A\",20,17),\n            (\"R4\",\"HP-B\",24,4),(\"R5\",\"HP-C\",20,3),\n            (\"R6\",\"HP-D\",22,19),(\"R7\",\"HP-D\",21,18),(\"R8\",\"HP-E\",18,2)]\n\n# TULIS KODEMU: kelompokkan per HP, vonis tiap grup\nfrom collections import defaultdict\ngrup = defaultdict(lambda: [0, 0])\nfor nama, hp, n, band in rekening:\n    grup[hp][0] += n; grup[hp][1] += band\n\nfor hp in sorted(grup):\n    n, band = grup[hp]\n    rasio =\n    vonis =  # \"SMURF?\" jika rasio > 70 dan n >= 40, selain itu \"normal\"\n    print(f\"{hp}: {n} setoran, band {rasio:.0f}% -> {vonis}\")",
        lockLines: 9,
        solution: "# (rekening, hp, jumlah_setoran, setoran_di_band_90_100). JANGAN UBAH.\nrekening = [(\"R1\",\"HP-A\",24,20),(\"R2\",\"HP-A\",22,18),(\"R3\",\"HP-A\",20,17),\n            (\"R4\",\"HP-B\",24,4),(\"R5\",\"HP-C\",20,3),\n            (\"R6\",\"HP-D\",22,19),(\"R7\",\"HP-D\",21,18),(\"R8\",\"HP-E\",18,2)]\n\n# TULIS KODEMU: kelompokkan per HP, vonis tiap grup\nfrom collections import defaultdict\ngrup = defaultdict(lambda: [0, 0])\nfor nama, hp, n, band in rekening:\n    grup[hp][0] += n; grup[hp][1] += band\n\nfor hp in sorted(grup):\n    n, band = grup[hp]\n    rasio = band / n * 100\n    vonis = \"SMURF?\" if rasio > 70 and n >= 40 else \"normal\"\n    print(f\"{hp}: {n} setoran, band {rasio:.0f}% -> {vonis}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "HP-A ke-flag", msg: "66 setoran, band 83%.", pattern: "HP-A: 66 setoran, band 83% -> SMURF\\?" },
          { kind: "stdout_matches", task: "t2", label: "HP-D ke-flag", msg: "43 setoran, band 86%.", pattern: "HP-D: 43 setoran, band 86% -> SMURF\\?" }
        ],
      },
      reference: "Atribut bersama = kandidat; band > 70% + volume = vonis. Cek penjelasan bisnis.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Jendela geser",
      title: "Smurf tidak mengenal tanggal merah",
      prose: [
        "Lab pertama memakai atribut bersama untuk menemukan kawanan. Lab ini menyerang dari sisi waktu: smurf memecah setoran agar tiap hari di bawah Rp10 juta, tetapi total 7 hari bisa Rp63 juta. Jendela geser 7 hari menjumlahkan setiap 7 hari berturut-turut — pola yang tak terlihat harian menjadi jelas mingguan.",
        "Dua jendela ter-flag (hari 1–7 dan 2–7, masing-masing Rp63 juta). Pelaku yang mengira 'sudah aman karena per hari kecil' tertangkap oleh agregasi. Inilah mengapa monitoring memakai banyak jendela sekaligus: harian, 7 hari, 30 hari.",
      ],
      tasks: [
        { id: "t1", text: "Geser jendela 7 hari, jumlahkan tiap jendela" },
        { id: "t2", text: "Jalankan dan pastikan jendela ter-flag tercetak" },
      ],
      expected: "Jendela 7 hari >= Rp60 jt: [[1, 63], [2, 63]]",
      note: {
        title: "Satu jendela = satu sudut pandang.",
        type: "pitfall",
        body: "“Jendela 7 hari bersih, berarti aman.” Smurf yang menyetor tiap 10 hari lolos dari jendela 7 hari. Monitoring profesional memakai banyak jendela (1/7/30 hari) — tiap jendela buta terhadap pola di luar ukurannya.",
      },
      hints: [
        "for i in range(len(setoran)-w+1): total = sum(setoran[i:i+w]).",
        "Simpan (hari_mulai, total) bila total >= 60.",
      ],
      code: {
        starter: "# Setoran Rp jt per hari. JANGAN UBAH.\nsetoran = [9,9,9,9,9,9,9,9,1,1,9,9,9,9]\nw = 7\n\n# TULIS KODEMU: jendela geser, flag bila total >= 60\nperingatan = []\n\nprint(f\"Jendela 7 hari >= Rp60 jt: {peringatan}\")",
        lockLines: 4,
        solution: "# Setoran Rp jt per hari. JANGAN UBAH.\nsetoran = [9,9,9,9,9,9,9,9,1,1,9,9,9,9]\nw = 7\n\n# TULIS KODEMU: jendela geser, flag bila total >= 60\nperingatan = []\nfor i in range(len(setoran)-w+1):\n    total = sum(setoran[i:i+w])\n    if total >= 60:\n        peringatan.append([i+1, total])\n\nprint(f\"Jendela 7 hari >= Rp60 jt: {peringatan}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`peringatan` = 2 jendela", msg: "Jendela hari 1 dan 2, masing-masing Rp63 jt.", name: "peringatan", value: [[1, 63], [2, 63]] },
          { kind: "stdout_matches", task: "t2", label: "Hasil tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "\\[\\[1, 63\\], \\[2, 63\\]\\]" }
        ],
      },
      reference: "Agregasi mingguan menangkap yang lolos harian. Pakai banyak jendela (1/7/30 hari) — tiap jendela punya titik buta.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat pola, empat respons",
      prose: [
        "Satu: cluster kuat (band >70%) + frekuensi anomali + tanpa penjelasan bisnis → SAR + EDD: kumpulkan 6 bulan histori, agregat lintas rekening nasabah, tulis narasi. Ini Pak Dedi.",
        "Dua: cluster lemah (band 30-50%) dengan penjelasan wajar — mis. kontraktor terima termin mingguan Rp95 juta → catat + pantau 90 hari. Jangan SAR-kan pola yang punya cerita bisnis; SAR yang lemah merusak kredibilitas tim di mata PPATK.",
        "Tiga: pola serupa di beberapa rekening dengan atribut bersama (HP/alamat/device sama) → naikkan ke network case: ini smurfing, bukan structuring individu. Investigasi melebar ke \"siapa koordinatornya,\" bukan \"berapa setorannya.\"",
        "Empat: ambang regulasi berubah (mis. ambang lapor turun) → retune: geser band deteksi, backtest ke data historis, ukur ulang FP. Pelaku membaca peraturan juga — mereka akan menumpuk di bawah ambang baru dalam hitungan minggu.",
        "Aturan praktis 10 detik: band >70% + frekuensi aneh = SAR. Ada penjelasan bisnis = pantau dulu. Multi-rekening + atribut sama = jaringan. Ambang berubah = retune minggu ini.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Smurfing terdeteksi bukan dari transaksi, melainkan dari kesamaan: lima \"orang asing\" yang setor di jam yang sama, dengan nominal yang sama, dari HP yang sama, bukanlah lima orang asing. Cari kolom yang seharusnya unik (nomor HP, device ID, alamat) tapi ternyata berbagi — di situlah organisasinya.",
      },
      reference: "Structuring = agregat per nasabah. Smurfing = agregat per atribut bersama lintas nasabah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tiga cabang, satu nomor HP",
      prose: [
        "Investigasi melebar dari Pak Dedi. Temuan: \"Pak Dedi\" (cabang Jakarta Selatan), \"Bu Rina\" (cabang Bekasi), \"Pak Andi\" (cabang Tangerang) — masing-masing 20-24 setoran Rp90-99 juta dalam 6 minggu. Total agregat: Rp7,9 miliar. Nomor HP terdaftar ketiganya: sama. Alamat KTP: tiga kota berbeda, tapi foto selfie liveness menunjukkan kemiripan wajah yang mencurigakan.",
        "Pertanyaan: (a) Ini structuring atau smurfing? (b) Hitung peluang gabungan jika tiap individu punya pola 1 banding 118 triliun dan independen. (c) Langkah investigasi berikutnya apa?",
        "Pembahasan: (a) Smurfing — multi-orang terkoordinasi, dibuktikan atribut bersama (satu nomor HP untuk tiga \"orang asing\" = mustahil alami). (b) Peluang gabungan jauh lebih kecil dari 1 banding 118 triliun — dan independensi justru runtuh karena atribut bersama membuktikan koordinasi. (c) Bekukan analisis dulu: petakan jaringan (siapa koordinator? ke mana dana bermuara?), koordinasi dengan cabang lain, siapkan SAR jaringan — bukan tiga SAR individu. Pelajaran: smurfing yang dilaporkan sebagai tiga kasus terpisah = tiga SAR lemah; sebagai satu jaringan = satu SAR kuat.",
      ],
      tasks: [],
      reference: "Atribut bersama = benang merah. Satu nomor HP meruntuhkan tiga identitas palsu.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan.",
      ],
      tasks: [],
      summary: [
        "Structuring = niat memecah transaksi menghindari ambang; smurfing = versi multi-orang terkoordinasi.",
        "Sinyal: band_ratio >70%, frekuensi anomali, round-number avoidance, atribut bersama.",
        "Uji binomial: P(≥17 dari 20 di band 10%) ≈ 8,5×10⁻¹⁵ = 1 banding 118 triliun.",
        "Deteksi = agregat per nasabah (structuring) dan per atribut bersama (smurfing).",
        "Keputusan: cluster kuat → SAR; penjelasan wajar → pantau; multi-rekening → network case.",
      ],
      next: { label: "AML6 — Tipologi: Layering & Trade-Based", href: "/v2/learn/aml6-layering" },
      quiz: [
        {
          q: "Semua setoran di bawah ambang pelaporan. Bisakah tetap dipidana?",
          options: [
            { text: "Tidak — di bawah ambang = legal", why: "Inilah miskonsepsi yang membuat Pak Dedi bebas 6 minggu. Yang dilarang = niat memecah." },
            { text: "Ya — yang dilarang adalah niat memecah untuk menghindari pelaporan, dibuktikan dari pola", why: "Clustering 85% + frekuensi + koordinasi = bukti niat. Angka legal, pola kriminal.", correct: true },
            { text: "Hanya jika total melebihi ambang", why: "Total bukan syarat; pola niatnya yang dinilai." },
            { text: "Hanya untuk setoran tunai", why: "Transfer/wire yang dipecah sama pidananya." },
          ],
        },
        {
          q: "band_ratio = 85%. Artinya?",
          options: [
            { text: "85% setoran melebihi ambang", why: "Terbalik: 85% dari yang di bawah ambang menumpuk di band 90-100%." },
            { text: "Dari setoran di bawah ambang, 85% menumpuk tepat di bawahnya — sidik jari structuring", why: "17/20 = 85%. Normal = ~18%.", correct: true },
            { text: "Nasabah setor 85 kali", why: "85% adalah fraksi, bukan jumlah." },
            { text: "Tidak berarti apa-apa", why: "Berarti segalanya: ini metrik utama deteksi." },
          ],
        },
        {
          q: "Lima rekening \"tidak saling kenal\" setor pola identik, nomor HP sama. Ini apa dan buktinya?",
          options: [
            { text: "Kebetulan — lima orang bisa sama", why: "Peluang 5 pola 1-banding-118-triliun + 1 nomor HP sama = nol praktis." },
            { text: "Smurfing — koordinasi dibuktikan atribut bersama yang seharusnya unik", why: "Satu nomor HP untuk lima identitas = satu organisasi. Naikkan ke network case.", correct: true },
            { text: "Structuring individu x5 kasus terpisah", why: "Atribut bersama meruntuhkan independensi — ini satu jaringan, bukan lima kasus." },
            { text: "Bukan apa-apa tanpa satu transaksi di atas ambang", why: "Miskonsepsi ambang lagi — niat dan koordinasi yang dinilai." },
          ],
        },
        {
          q: "Kontraktor terima termin Rp95 juta tiap minggu (kontrak terlampir). band_ratio 60%. Keputusan?",
          options: [
            { text: "SAR segera — band 60% tinggi", why: "Ada penjelasan bisnis terverifikasi (kontrak). SAR butuh kecurigaan, bukan sekadar angka." },
            { text: "Catat + pantau 90 hari; SAR hanya jika muncul sinyal tambahan", why: "Proporsional: penjelasan wajar menurunkan urgensi, tapi pola tetap dipantau.", correct: true },
            { text: "Abaikan permanen", why: "Kontrak bisa berakhir; pola tetap dalam radar." },
            { text: "Blokir rekening", why: "Pemblokiran tanpa dasar = masalah hukum." },
          ],
        },
        {
          q: "Ambang pelaporan turun dari 100 ke 50. Apa yang harus dilakukan tim deteksi?",
          options: [
            { text: "Tidak ada — sistem tetap jalan", why: "Pelaku membaca peraturan juga; mereka pindah ke bawah 50 dalam hitungan minggu." },
            { text: "Retune: geser band ke 45-50, backtest, ukur ulang FP — minggu ini", why: "Deteksi mengikuti ambang. Backtest memastikan tidak banjir FP.", correct: true },
            { text: "Naikkan ambang deteksi ke 150", why: "Berlawanan arah dengan regulasi — memperlebar lubang." },
            { text: "Matikan deteksi structuring sementara", why: "Mematikan deteksi saat pelaku adaptasi = buta di momen kritis." },
          ],
        },
      ],
    },
  ],
};
