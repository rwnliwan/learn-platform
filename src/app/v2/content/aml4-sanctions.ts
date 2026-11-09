import type { V2Lesson } from "../lib/types";

// Trade-off threshold: 0.80 -> 4 flagged, precision 75%; 0.90 -> 3 flagged, precision 100%.
const THRESH_SVG = `<svg viewBox="0 0 480 280" role="img" aria-label="Perbandingan dua ambang screening sanksi.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="30" x2="440" y2="30"/><line x1="60" y1="90" x2="440" y2="90"/><line x1="60" y1="150" x2="440" y2="150"/><line x1="60" y1="210" x2="440" y2="210"/></g>
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<text x="180" y="252" fill="var(--chart-text)">ambang 0,80</text>
<text x="360" y="252" fill="var(--chart-text)">ambang 0,90</text>
</g>
<g>
<rect x="120" y="120" width="120" height="90" fill="var(--c2)"/><rect x="120" y="90" width="120" height="30" fill="var(--c1)"/>
<rect x="300" y="120" width="120" height="90" fill="var(--c2)"/>
</g>
<g font-size="12" font-family="var(--font-ui)" text-anchor="middle" fill="var(--text)">
<text x="180" y="140">4 flagged</text><text x="180" y="185">3 TP + 1 FP</text>
<text x="360" y="140">3 flagged</text><text x="360" y="185">3 TP + 0 FP</text>
</g>
<g font-size="13" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">
<text x="180" y="70" fill="var(--c3)">precision 75%</text>
<text x="360" y="70" fill="var(--c1)">precision 100%</text>
</g>
<g font-size="11" font-family="var(--font-ui)"><rect x="66" y="222" width="10" height="10" fill="var(--c1)"/><text x="82" y="231" fill="var(--chart-text)">true match</text><rect x="190" y="222" width="10" height="10" fill="var(--c2)"/><text x="206" y="231" fill="var(--chart-text)">false match</text></g>
</svg>`;

export const aml4: V2Lesson = {
  slug: "aml4-sanctions",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML4 — Sanctions & Name Screening",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu huruf vokal yang harganya denda",
      prose: [
        "Transfer keluar Rp1,2 miliar atas nama \"Mohammad Al-Sayed\" lewat screening bank dengan mulus: exact-match ke daftar sanksi menghasilkan \"tidak ditemukan.\" Tiga bulan kemudian regulator datang dengan daftar OFAC: di sana tertulis \"Muhammad Al Sayyid\" — ejaan transliterasi yang berbeda dari nama yang lolos screening. Bank didenda karena \"sistem screening tidak memadai.\"",
        "Twist-nya: tim IT bank bersikeras sistem mereka \"bekerja sesuai spesifikasi.\" Dan memang benar — spesifikasinya yang salah. Regulator tidak menghukum karena ada typo; ia menghukum karena bank menganggap kewajiban screening = pencocokan string persis. Putusannya tajam: \"Kewajibanmu adalah menemukan, bukan mengeja dengan persis.\"",
        "Screening sanksi adalah pertahanan paling hitam-putih di AML: kalau nama ada di list PBB/OFAC/UE (atau DTTOT Indonesia), transaksinya wajib diblokir dan dilaporkan. Tidak ada \"mungkin.\" Lesson ini tentang membangun penyaring yang menemukan walau ejaannya bergeser — dan menyetelnya agar tidak menenggelamkan analis dalam false match.",
        "Setelah lesson ini kamu bisa: menjelaskan cara kerja fuzzy matching nama, menghitung precision pada dua ambang, membedakan true vs false match, dan memutuskan kapan threshold perlu dituning ulang.",
      ],
      tasks: [],
      reference: "Screening sanksi = kewajiban menemukan. Exact-match untuk nama transliterasi = tidak menemukan.",
    },
    {
      id: "list",
      eyebrow: "Langkah 2 · Daftar sanksi",
      title: "Siapa yang wajib kamu blokir",
      prose: [
        "Empat daftar utama: Dewan Keamanan PBB (mengikat semua negara anggota), OFAC milik Amerika (berdampak ekstrateritorial — bank non-AS pun takut secondary sanctions), Uni Eropa, dan di Indonesia DTTOT (Daftar Terduga Teroris dan Organisasi Teroris) dari Polri/Densus. Daftar berubah tiap minggu: nama ditambah, kadang dihapus. Screening yang dijalankan sekali saat onboarding = screening basi dalam sebulan.",
        "Alurnya: setiap transaksi (dan setiap nasabah baru, plus rescreening berkala seluruh basis nasabah) dicocokkan ke daftar. True match → blokir dana + laporkan ke otoritas (di Indonesia: PPATK & Polri). False match → tutup dengan dokumentasi adjudikasi. \"Mungkin match\" → tahan dulu, investigasi, jangan lepas.",
        "Kenapa ini paling ketat? Karena sanksinya bukan denda administratif biasa — melainkan pidana, pencabutan izin, dan pengucilan dari sistem dolar. Tidak ada bank yang mau menjadi \"bank yang memproses uang orang sanksi.\"",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Screening = cek saat buka rekening, selesai.\" Daftar sanksi hidup: OFAC menambah puluhan entri per bulan. Nasabah bersih tahun lalu bisa masuk list tahun ini. Tanpa rescreening berkala (harian untuk transaksi, periodik untuk basis nasabah), kamu memblokir masa lalu, bukan masa kini.",
      },
      reference: "Rescreening = screening yang diulang. Daftar berubah → hasil kemarin kedaluwarsa.",
    },
    {
      id: "fuzzy",
      eyebrow: "Langkah 3 · Fuzzy matching",
      title: "Mengukur kemiripan, bukan kesamaan",
      prose: [
        "Fuzzy matching mengubah \"sama/tidak\" menjadi skor 0-1. Metode klasik: jarak Levenshtein d(a,b) = jumlah edit minimum (tambah/hapus/ganti huruf) untuk mengubah a menjadi b. Normalisasi: sim = 1 − d / max(panjang). \"Mohammad Al-Sayed\" vs \"Muhammad Al Sayyid\": setelah normalisasi (kapital, buang tanda baca) jaraknya kecil → sim = 0,8125 ≥ ambang 0,80 → flagged (hanya 0,0125 di atas ambang). Exact-match akan memberi 0.",
        "Ambang (threshold) adalah kenop trade-off: ambang rendah (0,70) menangkap lebih banyak varian ejaan tapi membanjiri analis dengan false match (nama pasaran seperti \"Ahmad Hidayat\"); ambang tinggi (0,95) bersih tapi meloloskan \"Muhammad Al Sayyid\" versi vokal-beda. Tidak ada ambang benar global — ada ambang yang tepat untuk volume dan kapasitas timmu.",
        "Cara membaca diagram: dua kolom = dua ambang. Tinggi total = jumlah flagged; hijau = true match, biru = false match. Interpretasi: ambang 0,80 menangkap 4 (3 benar + 1 salah → precision 75%); ambang 0,90 menangkap 3 dan semuanya benar (precision 100%). Kenaikan ambang membuang tepat 1 false match di data ini — tapi ingat, di data nyata ambang tinggi juga bisa membuang true match yang ejaannya jauh.",
      ],
      formula: String.raw`\mathrm{sim}(a,b) = 1 - \frac{d(a,b)}{\max(|a|,|b|)} \qquad P = \frac{TP}{TP + FP}`,
      formulaNote: "sim = kemiripan 0-1. d(a,b) = jarak Levenshtein (jumlah edit minimum). |a| = panjang string. P = precision: dari yang di-flag, berapa fraksi yang benar-benar match. Flag jika sim ≥ ambang.",
      figure: {
        svg: THRESH_SVG,
        alt: "Perbandingan dua ambang screening sanksi.",
        caption: "Ambang 0,80 vs 0,90 pada 10 nama kandidat: 75% vs 100% precision. Ambang = kenop trade-off.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Normalisasi sebelum membandingkan: uppercase semua, buang tanda baca/spasi ganda, dan — yang paling penting — normalisasi transliterasi (ou→u, ph→f).",
      },
      reference: "Tune ambang dari data adjudikasi historis, bukan dari firasat. Plot precision per ambang tiap kuartal.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab screening",
      title: "Setel ambangmu sendiri",
      prose: [
        "Sepuluh nama kandidat, tiga entri daftar sanksi. Tiga di antaranya adalah true match — ketiganya exact pasca-normalisasi (sim 1,0), BUKAN varian ejaan; varian ejaan \"Mohammad Al-Sayed\" justru dilabeli FP. Implementasikan jarak Levenshtein + kemiripan ternormalisasi, lalu evaluasi dua ambang: 0,80 dan 0,90. Hitung precision-nya.",
        "Setelah selesai, bereksperimenlah: turunkan ambang ke 0,70 — siapa yang ikut ke-flag? (Petunjuk: \"Chen Way\".) Naikkan ke 0,95 — siapa yang lolos? Itulah harga tiap kenop.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `lev`, `norm`, dan `sim`" },
        { id: "t2", text: "Evaluasi ambang 0.80 dan 0.90, cetak flagged + precision" },
      ],
      expected: "ambang 0.8: 4 flagged, precision 75.0% (1 FP: Mohammad Al-Sayed) | ambang 0.9: 3 flagged, precision 100.0%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Precision 100% = ambang sempurna, pakai 0,90 selamanya.\" Precision hanya mengukur yang di-flag. Ia tidak mengukur yang lolos: \"M. Al Sayyid\" (singkatan) tidak ke-flag di kedua ambang — recall-nya bocor diam-diam. Ambang tinggi + tanpa daftar alias = percaya diri yang palsu.",
      },
      hints: [
        "norm: uppercase + buang semua non-huruf: \"\".join(c for c in s.upper() if c.isalpha()).",
        "lev: dynamic programming klasik, dp[j] = min(tambah, hapus, ganti).",
        "sim = 1 - lev(a,b)/max(len(a),len(b)); flag jika max sim ke daftar >= ambang.",
      ],
      code: {
        starter: `# 10 kandidat vs 3 entri daftar sanksi\nkandidat = ["Mohammad Al-Sayed", "Muhammad Al Sayyid", "M. Al Sayyid", "Ahmad Al Sayed",\n            "Vladimir Petrov", "V. Petrov", "Chen Wei", "Chen Way",\n            "Budi Santoso", "Siti Rahayu"]\ndaftar = ["MUHAMMAD AL SAYYID", "VLADIMIR PETROV", "CHEN WEI"]\nbenar = {"Muhammad Al Sayyid", "Vladimir Petrov", "Chen Wei"}\n\n# TULIS KODEMU: jarak Levenshtein, normalisasi, kemiripan\ndef lev(a, b):\n    return\ndef norm(s):\n    return\ndef sim(a, b):\n    return\n\ndef evaluasi(ambang):\n    flag = [k for k in kandidat if max(sim(k, d) for d in daftar) >= ambang]\n    tp = sum(1 for k in flag if k in benar)\n    prec = tp / len(flag) * 100 if flag else 0\n    return flag, tp, prec\n\nfor t in [0.80, 0.90]:\n    flag, tp, prec = evaluasi(t)\n    print(f"ambang {t}: flagged={len(flag)}  TP={tp}  precision={prec:.1f}%")`,
        lockLines: 7,
        solution: `# 10 kandidat vs 3 entri daftar sanksi\nkandidat = ["Mohammad Al-Sayed", "Muhammad Al Sayyid", "M. Al Sayyid", "Ahmad Al Sayed",\n            "Vladimir Petrov", "V. Petrov", "Chen Wei", "Chen Way",\n            "Budi Santoso", "Siti Rahayu"]\ndaftar = ["MUHAMMAD AL SAYYID", "VLADIMIR PETROV", "CHEN WEI"]\nbenar = {"Muhammad Al Sayyid", "Vladimir Petrov", "Chen Wei"}\n\n# TULIS KODEMU: jarak Levenshtein, normalisasi, kemiripan\ndef lev(a, b):\n    dp = list(range(len(b) + 1))\n    for i, ca in enumerate(a, 1):\n        ndp = [i]\n        for j, cb in enumerate(b, 1):\n            ndp.append(min(dp[j] + 1, ndp[-1] + 1, dp[j-1] + (ca != cb)))\n        dp = ndp\n    return dp[-1]\ndef norm(s):\n    return "".join(c for c in s.upper() if c.isalpha())\ndef sim(a, b):\n    a, b = norm(a), norm(b)\n    return 1 - lev(a, b) / max(len(a), len(b))\n\ndef evaluasi(ambang):\n    flag = [k for k in kandidat if max(sim(k, d) for d in daftar) >= ambang]\n    tp = sum(1 for k in flag if k in benar)\n    prec = tp / len(flag) * 100 if flag else 0\n    return flag, tp, prec\n\nfor t in [0.80, 0.90]:\n    flag, tp, prec = evaluasi(t)\n    print(f"ambang {t}: flagged={len(flag)}  TP={tp}  precision={prec:.1f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "lev", label: "`lev` terdefinisi", msg: "Implementasikan jarak Levenshtein dengan dynamic programming." },
          { kind: "defined", task: "t1", name: "sim", label: "`sim` terdefinisi", msg: "sim(a,b) = 1 - lev/max(len) setelah normalisasi." },
          { kind: "stdout_matches", task: "t2", pattern: "ambang 0\\.8: flagged=4\\s+TP=3\\s+precision=75\\.0%", label: "Ambang 0.8: precision 75%", msg: "4 flagged (1 FP: Mohammad Al-Sayed), TP=3 → 75.0%." },
          { kind: "stdout_matches", task: "t2", pattern: "ambang 0\\.9: flagged=3\\s+TP=3\\s+precision=100\\.0%", label: "Ambang 0.9: precision 100%", msg: "3 flagged, semuanya TP → 100.0%." },
        ],
      },
      reference: "DP Levenshtein: dp[i][j] = min(hapus, tambah, ganti). Cukup 1 baris dp.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Recall",
      title: "Harga precision 100%: recall yang bocor",
      prose: [
        "Lab lesson ini menunjukkan ambang 0,90 → precision 100%. Terlihat sempurna — sampai mini-case: K4 (true match, skor 0,82) tertangkap di 0,80 (0,82 ≥ 0,80) dan lolos hanya di 0,90. Precision tidak melihat yang lolos; recall yang melihat: recall = tertangkap / total true. Di data lab yang diperkaya K4 (3 true match dari 10 nama): ambang 0,80 menangkap 3 dari 3 → recall 100%, precision 75%; ambang 0,90 menangkap 2 dari 3 → recall 67%, precision 100%.",
        "F1 menggabungkan keduanya: 2×P×R/(P+R). Ambang 0,80: P=75%, R=100% → F1 0,857. Ambang 0,90: P=100%, R=67% → F1 0,800. Di data ini 0,80 menang. Tetapi F1 mengasumsikan FP dan FN sama mahalnya — untuk sanksi, asumsi itu salah: satu dana teroris yang lolos (FN) jauh lebih mahal daripada 100 false match (FP).",
        "Implikasinya: untuk screening sanksi, recall lebih penting daripada precision. Pilih ambang yang lebih rendah (0,80 atau 0,75), terima banjir FP, lalu redam dengan whitelist nama pasaran + adjudikasi cepat. 'Precision 100%' yang membanggakan bisa berarti 'recall 50%' yang berbahaya.",
        "Lab menghitung P/R/F1 kedua ambang. Eksperimen: turunkan ke 0,70 — recall tetap 100% (3/3), precision turun ke 60% (3 benar dari 5 flagged). Itulah harga recall penuh: analis mengadjudikasi 2 FP tambahan per 10 nama. Untuk sanksi, harga itu layak dibayar.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `metrik` (precision, recall, F1)" },
        { id: "t2", text: "Jalankan dan bandingkan dua ambang" },
      ],
      expected: "Ambang 0.8: precision 75%, recall 100%, F1 0.857\nAmbang 0.9: precision 100%, recall 67%, F1 0.800",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Precision 100% = sistem sempurna.” Precision tidak menghitung yang lolos. Sistem dengan precision 100% dan recall 50% = setengah penjahat lewat dengan mulus. Untuk sanksi, yang lolos (FN) jauh lebih mahal daripada yang salah flag (FP).",
      },
      hints: [
        "recall = tp / total_true (3 true match: K1, K2, K4).",
        "F1 = 2PR/(P+R); 0,80 menang di data ini.",
      ],
      code: {
        starter: "# (nama, skor, true_label). JANGAN UBAH.\ndata = [(\"K1\",0.97,1),(\"K2\",0.91,1),(\"K3\",0.86,0),(\"K4\",0.82,1),(\"K5\",0.71,0),\n        (\"N6\",0.65,0),(\"N7\",0.60,0),(\"N8\",0.55,0),(\"N9\",0.50,0),(\"N10\",0.45,0)]\n\n# TULIS KODEMU: precision, recall, F1 per ambang\ndef metrik(ambang):\n    return  # (precision, recall, f1)\n\nfor amb in (0.80, 0.90):\n    p, r, f1 = metrik(amb)\n    print(f\"Ambang {amb}: precision {p:.0%}, recall {r:.0%}, F1 {f1:.3f}\")",
        lockLines: 4,
        solution: "# (nama, skor, true_label). JANGAN UBAH.\ndata = [(\"K1\",0.97,1),(\"K2\",0.91,1),(\"K3\",0.86,0),(\"K4\",0.82,1),(\"K5\",0.71,0),\n        (\"N6\",0.65,0),(\"N7\",0.60,0),(\"N8\",0.55,0),(\"N9\",0.50,0),(\"N10\",0.45,0)]\n\n# TULIS KODEMU: precision, recall, F1 per ambang\ndef metrik(ambang):\n    flag = [d for d in data if d[1] >= ambang]\n    tp = sum(d[2] for d in flag)\n    total_true = sum(d[2] for d in data)\n    p = tp / len(flag) if flag else 0\n    r = tp / total_true if total_true else 0\n    f1 = 2 * p * r / (p + r) if (p + r) else 0\n    return (p, r, f1)\n\nfor amb in (0.80, 0.90):\n    p, r, f1 = metrik(amb)\n    print(f\"Ambang {amb}: precision {p:.0%}, recall {r:.0%}, F1 {f1:.3f}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Recall 0,80 = 100%", msg: "3 dari 3 true tertangkap.", pattern: "Ambang 0\\.8: precision 75%, recall 100%, F1 0\\.857" },
          { kind: "stdout_matches", task: "t2", label: "Recall 0,90 = 67%", msg: "K4 lolos di ambang tinggi.", pattern: "Ambang 0\\.9: precision 100%, recall 67%, F1 0\\.800" }
        ],
      },
      reference: "Sanksi = recall dulu. Precision 100% bisa menyembunyikan recall 67%.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Harga salah putus",
      title: "Precision 100% yang mahal",
      prose: [
        "Pendalaman tadi menunjukkan ambang 0,9 memberi precision 100% tetapi recall 67% (K4, skor 0,82, lolos) — lab pertama sendiri memberi recall 100% di 0,90, karena datanya tidak memuat kasus batas seperti K4. Lab ini menempelkan harga: false positive (tahan orang tak bersalah) = Rp50 juta biaya review; false negative (sanksi lolos) = Rp2 miliar denda + reputasi. Dengan harga ini, satu FN sama mahalnya dengan 40 FP.",
        "Hasilnya: ambang 0,8 (1 FP, 0 FN) berbayar Rp50 juta; ambang 0,9 (0 FP, 1 FN) berbayar Rp2 miliar. Precision sempurna ternyata 40× lebih mahal. Inilah mengapa compliance memakai ambang longgar + review manusia, bukan ambang ketat otomatis.",
      ],
      tasks: [
        { id: "t1", text: "Hitung biaya = FP*50 + FN*2000 (Rp jt)" },
        { id: "t2", text: "Jalankan dan bandingkan kedua ambang" },
      ],
      expected: "ambang 0.8: FP=1, FN=0 -> biaya Rp50 jt\nambang 0.9: FP=0, FN=1 -> biaya Rp2000 jt",
      note: {
        title: "Precision bukan tujuan.",
        type: "pitfall",
        body: "“Precision 100% = sistem terbaik.” Di sanctions, FN jauh lebih mahal dari FP — precision sempurna dengan recall bocor adalah kegagalan yang dibungkus angka bagus. Optimasi yang benar: minimalkan biaya total, bukan maksimalkan satu metrik.",
      },
      hints: [
        "biaya = fp*50 + fn*2000, dalam Rp juta.",
        "Bandingkan: 50 vs 2000 — mana yang lebih murah?",
      ],
      code: {
        starter: "# (FP, FN) per ambang. JANGAN UBAH.\nhasil = {\"ambang 0.8\": (1, 0), \"ambang 0.9\": (0, 1)}\n\n# TULIS KODEMU: biaya = FP*50 + FN*2000 (Rp jt)\nfor ambang, (fp, fn) in hasil.items():\n    biaya = \n    print(f\"{ambang}: FP={fp}, FN={fn} -> biaya Rp{biaya} jt\")",
        lockLines: 4,
        solution: "# (FP, FN) per ambang. JANGAN UBAH.\nhasil = {\"ambang 0.8\": (1, 0), \"ambang 0.9\": (0, 1)}\n\n# TULIS KODEMU: biaya = FP*50 + FN*2000 (Rp jt)\nfor ambang, (fp, fn) in hasil.items():\n    biaya = fp*50 + fn*2000\n    print(f\"{ambang}: FP={fp}, FN={fn} -> biaya Rp{biaya} jt\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Biaya ambang 0.8", msg: "1 FP × Rp50 jt = Rp50 jt.", pattern: "ambang 0\.8: FP=1, FN=0 -\> biaya Rp50 jt" },
          { kind: "stdout_matches", task: "t2", label: "Biaya ambang 0.9", msg: "1 FN × Rp2 M = Rp2000 jt.", pattern: "ambang 0\.9: FP=0, FN=1 -\> biaya Rp2000 jt" }
        ],
      },
      reference: "1 FN = 40 FP dalam rupiah. Ambang longgar + review manusia mengalahkan precision 100% otomatis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat hasil screening, empat tindakan",
      prose: [
        "Satu: true match jelas — skor 0,97 + tanggal lahir cocok dengan entri list → blokir dana SEKARANG + laporkan. Tidak ada \"tunggu konfirmasi atasan sampai besok\"; dana yang lolos = pelanggaran.",
        "Dua: kemungkinan match tapi info kurang — skor 0,84, tanpa tanggal lahir pembanding → tahan transaksi + investigasi: minta dokumen identitas tambahan, cek database internal. Prinsip: tahan dulu lebih murah daripada melepas lalu menyesal.",
        "Tiga: false match nama pasaran — \"Ahmad Hidayat\" skor 0,81 tapi NIK/tanggal lahir beda jauh → tutup sebagai false match + masukkan ke whitelist dengan alasan tertulis. Tanpa whitelist, nama yang sama akan membanjiri analis setiap minggu.",
        "Empat: daftar sanksi diperbarui → rescreening: jalankan ulang seluruh basis nasabah terhadap delta daftar, prioritaskan nasabah aktif bertransaksi. Pembaruan list tanpa rescreening = punya radar tapi tidak dinyalakan.",
        "Aturan praktis 10 detik: skor ≥0,9 + identifier cocok = blokir. Skor 0,8-0,9 = tahan + investigasi. Nama pasaran = butuh identifier kedua (tgl lahir/NIK) sebelum panik.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Whitelist false match adalah investasi: tiap adjudikasi \"nama sama, orang beda\" yang didokumentasikan menghemat 15 menit analis setiap kali nama itu muncul lagi. Bank besar punya ratusan ribu entri whitelist — itulah yang membuat precision operasional mereka tinggi, bukan ambang ajaib.",
      },
      reference: "Adjudikasi tanpa dokumentasi = kerja bakti yang diulang tiap minggu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Lima kandidat, ambang 0,85",
      prose: [
        "Lima transfer masuk antrean screening dengan skor kemiripan tertinggi ke daftar: K1 = 0,97 (tanggal lahir cocok → true), K2 = 0,91 (NIK cocok → true), K3 = 0,86 (tanggal lahir beda 20 tahun → false), K4 = 0,82 (true, varian ejaan jauh), K5 = 0,71 (false). Ambang operasional bank: 0,85.",
        "Pertanyaan: (a) Siapa yang ke-flag di ambang 0,85? Berapa precision-nya? (b) Di ambang 0,90? (c) Masalah apa yang tidak terlihat dari kedua angka precision itu?",
        "Pembahasan: (a) Flagged = K1, K2, K3 (≥0,85). TP = 2 → precision 2/3 = 66,7%. Satu FP (K3) harus diadjudikasi. (b) Flagged = K1, K2 → precision 100%. Terlihat sempurna. (c) K4 (true match, skor 0,82) lolos di kedua ambang — precision 100% menyembunyikan recall yang bocor. Inilah jebakan lab tadi: \"M. Al Sayyid\" versi mini-case ini. Solusinya bukan menurunkan ambang sampai banjir, melainkan daftar alias + normalisasi transliterasi yang lebih baik.",
      ],
      tasks: [],
      reference: "Precision tanpa recall = setengah cerita. Ukur keduanya dari data adjudikasi.",
    },
    {
          id: "gap-r9-pep-ubo",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P5-G2)",
          title: "PEP & UBO: screening sampai ke pemilik sebenarnya",
          prose: [
            "Lesson ini menscreening NAMA terhadap daftar sanksi — tetapi dua pemeriksaan yang wajib menyertainya belum diajarkan: PEP dan UBO. PEP (Politically Exposed Person) adalah pejabat publik (dan keluarga/orang dekatnya) yang karena jabatannya berisiko korupsi/penyuapan. UBO (Ultimate Beneficial Owner) adalah pemilik manfaat AKHIR dari sebuah badan hukum — orang yang benar-benar mengendalikan perusahaan, bukan nama direktur di atas kertas.",
            "Aturan kuncinya: PEP → EDD (Enhanced Due Diligence), BUKAN blokir otomatis. Menjadi PEP bukan kejahatan — tetapi transaksinya harus dipahami sumber dananya (source of wealth/funds) dengan bukti lebih dalam. Sebaliknya, UBO yang tidak teridentifikasi adalah red flag tersendiri: perusahaan cangkang (shell company) dengan nominee director dan UBO tersembunyi adalah kendaraan klasik pencucian uang. Screening yang berhenti di nama rekening — tanpa menelusuri UBO — sedang memeriksa topeng, bukan wajah.",
            "Contoh angka (5 nasabah badan hukum): PEP = [ya, tidak, tidak, ya, tidak] (2 orang); UBO teridentifikasi = [ya, ya, tidak, ya, tidak] — nasabah ke-3 UBO-nya TIDAK teridentifikasi. EDD wajib untuk: semua PEP (2) + nasabah UBO tak teridentifikasi (1) = 3 nasabah. Catatan: nasabah ke-4 adalah PEP sekaligus UBO teridentifikasi — tetap EDD karena PEP, tetapi bukan karena UBO. Screening yang baik menghitung UNION-nya, bukan menjumlahkan daftarnya.",
          ],
          formula: String.raw`\text{EDD} = \text{PEP} \cup \text{UBO tak teridentifikasi}`,
          formulaNote: "PEP → EDD (bukan blokir). UBO = pemilik manfaat akhir; UBO tak teridentifikasi = red flag. Contoh angka: 5 nasabah → PEP 2, UBO tak teridentifikasi 1, EDD 3 (union, bukan jumlah).",
          tasks: [
            { id: "t1", text: "Hitung `pep`, `ubo_hilang`, dan `edd` (union) dari 5 nasabah" },
            { id: "t2", text: "Cetak ketiganya" },
          ],
          expected: "pep=2 ubo_hilang=1 edd=3",
          hints: [
            "edd = nasabah yang PEP ATAU UBO-nya hilang — hitung union-nya.",
            "Nasabah ke-4 PEP + UBO ada = 1 EDD, bukan 2.",
          ],
          code: {
            starter: `# (is_pep, ubo_teridentifikasi) per nasabah\nnasabah = [(True, True), (False, True), (False, False), (True, True), (False, True)]\n\n# TULIS KODEMU: hitung EDD (PEP atau UBO hilang)\npep = \nubo_hilang = \nedd = \n\nprint(f"pep={pep} ubo_hilang={ubo_hilang} edd={edd}")`,
            lockLines: 4,
            solution: `# (is_pep, ubo_teridentifikasi) per nasabah\nnasabah = [(True, True), (False, True), (False, False), (True, True), (False, True)]\n\n# TULIS KODEMU: hitung EDD (PEP atau UBO hilang)\npep = sum(1 for p, _ in nasabah if p)\nubo_hilang = sum(1 for _, u in nasabah if not u)\nedd = sum(1 for p, u in nasabah if p or not u)\n\nprint(f"pep={pep} ubo_hilang={ubo_hilang} edd={edd}")`,
            checks: [
              { kind: "equal", task: "t1", name: "pep", value: 2, label: "`pep` seharusnya 2", msg: "Nasabah 1 dan 4 adalah PEP." },
              { kind: "equal", task: "t1", name: "ubo_hilang", value: 1, label: "`ubo_hilang` seharusnya 1", msg: "Hanya nasabah 3 UBO-nya tak teridentifikasi." },
              { kind: "equal", task: "t1", name: "edd", value: 3, label: "`edd` seharusnya 3", msg: "Union PEP dan UBO-hilang: nasabah 1, 3, 4." },
              { kind: "stdout_matches", task: "t2", pattern: "pep=2\\s+ubo_hilang=1\\s+edd=3", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Nasabah adalah PEP (pejabat) dengan sumber dana jelas dan terdokumentasi. Tindakan yang benar?",
              options: [
                { text: "EDD — periksa lebih dalam, tetapi jangan blokir otomatis", why: "Benar: PEP → EDD, bukan blokir; menjadi PEP bukan kejahatan.", correct: true },
                { text: "Blokir rekening — PEP terlalu berisiko", why: "Salah: PEP bukan daftar sanksi; pemblokiran tanpa dasar adalah pelanggaran." },
                { text: "Perlakukan seperti nasabah biasa", why: "Salah: PEP wajib EDD — sumber dana harus dipahami lebih dalam." },
              ],
            },
          ],
          reference: "PEP → EDD (bukan blokir). UBO tak teridentifikasi = red flag. EDD = union keduanya.",
        },
    {
          id: "gap-r9-validasi-independen",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P5-G3)",
          title: "Validasi independen: jangan tune ambang di data yang sama",
          prose: [
            "Lesson ini men-tune ambang dari data adjudikasi — tetapi belum mengajarkan pemisahan yang membuat tuning itu sah: data TUNE dan data TEST harus BERBEDA. Ambang yang dipilih karena bekerja baik di data yang sama tempat ia diuji adalah ambang yang overfit: ia menghafal noise adjudikasi, bukan menangkap pola sanksi. Aturan: bagi label adjudikasi menjadi set tune (pilih ambang) dan set test independen (konfirmasi) — dan JANGAN PERNAH mengintip set test sebelum ambang dikunci.",
            "Contoh angka: set tune (data lesson ini) memberi ambang 0,80 biaya Rp50 jt (1 FP, 0 FN) vs ambang 0,90 biaya Rp2.000 jt (0 FP, 1 FN) — 0,80 menang telak. Tetapi di set test independen (100 nama baru yang diadjudikasi terpisah), ambang 0,80 memberi FP=2, FN=1 → biaya 2×50 + 1×2.000 = Rp2.100 jt; ambang 0,90 memberi FP=0, FN=2 → Rp4.000 jt. Urutannya sama (0,80 tetap menang), tetapi BIAYA nyatanya 42× lipat dari perkiraan tune-set (Rp50 jt → Rp2.100 jt). Tanpa test independen, kamu akan menjanjikan direksi biaya Rp50 jt — dan membayar Rp2.100 jt.",
            "Aturan praktis: (1) kunci ambang di tune-set; (2) laporkan metrik FINAL hanya dari test-set; (3) bila test-set jauh lebih buruk, ambangmu overfit — ulangi dengan tune-set lebih besar, bukan dengan mengintip test-set lalu me-retune (itu hanya memindahkan overfit satu langkah). Validasi independen bukan birokrasi — ia satu-satunya cara mengetahui ambangmu bekerja di dunia nyata.",
          ],
          formula: String.raw`\text{biaya} = FP \times 50 + FN \times 2000 \quad (\text{Rp jt}) \qquad \text{tune} \neq \text{test}`,
          formulaNote: "Tune ambang di set tune, konfirmasi di set test independen — jangan pernah retune dari test-set. Contoh angka: tune-set 0,80 = Rp50 jt; test-set 0,80 = Rp2.100 jt (FP=2, FN=1), 0,90 = Rp4.000 jt (FP=0, FN=2).",
          tasks: [
            { id: "t1", text: "Hitung `biaya_080` dan `biaya_090` di SET TEST (FP×50 + FN×2000)" },
            { id: "t2", text: "Cetak keduanya" },
          ],
          expected: "biaya_080=2100 biaya_090=4000",
          hints: [
            "biaya = fp*50 + fn*2000 (Rp jt).",
            "Test-set: 0,80 → FP=2, FN=1; 0,90 → FP=0, FN=2.",
          ],
          code: {
            starter: `# (FP, FN) di SET TEST independen\ntest = {"ambang 0.80": (2, 1), "ambang 0.90": (0, 2)}\n\n# TULIS KODEMU: biaya test-set per ambang\nbiaya_080 = \nbiaya_090 = \n\nprint(f"biaya_080={biaya_080} biaya_090={biaya_090}")`,
            lockLines: 4,
            solution: `# (FP, FN) di SET TEST independen\ntest = {"ambang 0.80": (2, 1), "ambang 0.90": (0, 2)}\n\n# TULIS KODEMU: biaya test-set per ambang\nbiaya_080 = test["ambang 0.80"][0] * 50 + test["ambang 0.80"][1] * 2000\nbiaya_090 = test["ambang 0.90"][0] * 50 + test["ambang 0.90"][1] * 2000\n\nprint(f"biaya_080={biaya_080} biaya_090={biaya_090}")`,
            checks: [
              { kind: "equal", task: "t1", name: "biaya_080", value: 2100, label: "`biaya_080` seharusnya Rp2.100 jt", msg: "2×50 + 1×2.000 = 2.100." },
              { kind: "equal", task: "t1", name: "biaya_090", value: 4000, label: "`biaya_090` seharusnya Rp4.000 jt", msg: "0×50 + 2×2.000 = 4.000." },
              { kind: "stdout_matches", task: "t2", pattern: "biaya_080=2100\\s+biaya_090=4000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Ambang 0,80 menang di tune-set (Rp50 jt) tetapi di test-set biayanya Rp2.100 jt. Apa yang harus dilakukan?",
              options: [
                { text: "Terima biaya test-set sebagai estimasi jujur; retune hanya dengan tune-set yang lebih besar", why: "Benar: test-set adalah cermin dunia nyata; mengintipnya lalu me-retune hanya memindahkan overfit.", correct: true },
                { text: "Retune ambang sampai test-set memberi Rp50 jt lagi", why: "Salah: itu overfit ke test-set — metriknya menjadi fiksi." },
                { text: "Buang test-set — tune-set sudah cukup membuktikan", why: "Salah: tanpa test independen kamu tidak tahu ambangmu bekerja di luar data tune." },
              ],
            },
          ],
          reference: "Tune ≠ test: kunci ambang di tune-set, laporkan metrik final dari test-set.",
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
        "Daftar sanksi: PBB, OFAC, UE, DTTOT — berubah tiap minggu, wajib rescreening.",
        "Fuzzy matching: sim = 1 − d/max(|a|,|b|); normalisasi dulu, jarak kemudian.",
        "Ambang = trade-off precision vs banjir FP; tune dari data adjudikasi.",
        "True match + identifier cocok → blokir + lapor; ragu → tahan + investigasi.",
        "False match nama pasaran → whitelist + dokumentasi; singkatan/alias butuh daftar alias.",
      ],
      next: { label: "AML5 — Tipologi: Structuring & Smurfing", href: "/v2/learn/aml5-structuring" },
      quiz: [
        {
          q: "\"Muhammad Al Sayyid\" (list) vs \"Mohammad Al-Sayed\" (nasabah). Exact-match lolos. Kesalahan utamanya?",
          options: [
            { text: "Typo nasabah", why: "Transliterasi Arab-Latin memang punya banyak varian — bukan typo." },
            { text: "Spesifikasi sistem: kewajiban screening adalah menemukan, dan nama transliterasi wajib fuzzy-match ternormalisasi", why: "Inilah putusan regulator di cerita pembuka. Exact-match untuk nama = tidak screening.", correct: true },
            { text: "Daftar OFAC kurang lengkap", why: "Daftarnya benar; yang gagal adalah pencocokannya." },
            { text: "Nasabah sengaja mengelabui", why: "Tidak ada bukti kesengajaan — varian ejaan adalah hal normal." },
          ],
        },
        {
          q: "sim(\"Chen Wei\", \"Chen Way\") setelah normalisasi. Perkiraan dan artinya?",
          options: [
            { text: "1,0 — identik", why: "Berbeda 2 huruf (A→E, Y→I): tidak identik." },
            { text: "≈0,93 — sangat mirip, aman di semua ambang", why: "Jaraknya 2 huruf, bukan 0,5: 1−2/7 ≈ 0,71, bukan 0,93." },
            { text: "≈0,71 — tidak ke-flag di ambang 0,80 maupun 0,90", why: "Jarak Levenshtein = 2 (A→E, Y→I), panjang 7 → sim ≈ 0,714. Di bawah kedua ambang.", correct: true },
            { text: "0,0 — beda total", why: "Lima dari tujuh huruf sama — jauh dari beda total." },
          ],
        },
        {
          q: "Skor 0,84, nama pasaran, tanpa identifier pembanding. Tindakan?",
          options: [
            { text: "Blokir + laporkan", why: "Tanpa identifier cocok, pemblokiran = gegabah dan bermasalah hukum." },
            { text: "Tahan + investigasi: kumpulkan identifier (tgl lahir/NIK), adjudikasi, dokumentasikan", why: "Zona abu-abu = zona investigasi. Tahan lebih murah daripada melepas.", correct: true },
            { text: "Lepaskan, skor di bawah 0,9", why: "0,84 bukan rendah untuk nama sanksi — melepas tanpa cek = pelanggaran." },
            { text: "Abaikan, nama pasaran pasti false", why: "\"Pasti\" tanpa verifikasi = cara tercepat mendapat denda." },
          ],
        },
        {
          q: "Precision screening naik dari 60% ke 95% setelah tuning. Apa yang WAJIB dicek sebelum merayakan?",
          options: [
            { text: "Tidak ada, 95% sudah bagus", why: "Precision naik bisa berarti ambang naik — dan true match ikut terbuang." },
            { text: "Recall: apakah true match yang dulu tertangkap masih tertangkap — precision tanpa recall = setengah cerita", why: "Kasus K4 (0,82) di mini-case: precision 100% tapi true match lolos. Ukur keduanya.", correct: true },
            { text: "Ganti algoritma", why: "Tidak ada alasan mengganti yang sudah membaik." },
            { text: "Naikkan ambang lagi", why: "Menaikkan terus = recall makin bocor. Tuning berhenti di titik optimal." },
          ],
        },
        {
          q: "OFAC menambah 40 entri baru hari ini. Langkah operasional yang benar?",
          options: [
            { text: "Tunggu screening onboarding berikutnya", why: "Nasabah existing tidak pernah onboarding ulang — mereka butuh rescreening." },
            { text: "Rescreening basis nasabah terhadap delta daftar, prioritaskan yang aktif bertransaksi", why: "Inilah gunanya delta screening harian + rescreening periodik penuh.", correct: true },
            { text: "Hanya cek transaksi hari ini", why: "Nasabah yang masuk list kemarin tapi tidak transaksi hari ini tetap wajib diblokir dananya." },
            { text: "Tidak perlu, list lama sudah cukup", why: "List lama = daftar orang yang dilarang kemarin. Kewajibanmu yang hari ini." },
          ],
        },
      ],
    },
  ],
};
