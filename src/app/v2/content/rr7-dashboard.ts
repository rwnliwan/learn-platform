import type { V2Lesson } from "../lib/types";

// Mock layout dashboard: 3 lapis hierarki informasi.
const FIG_DASH = `<svg viewBox=\"0 0 480 300\" role=\"img\" aria-label=\"Mock layout dashboard tiga lapis: alert, ringkasan, detail.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<rect x=\"20\" y=\"16\" width=\"440\" height=\"44\" fill=\"var(--c4)\" opacity=\"0.9\" rx=\"6\"/>
<text x=\"240\" y=\"36\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">LAPIS 1 · ALERT</text>
<text x=\"240\" y=\"53\" font-size=\"11\" fill=\"#fff\">2 metrik merah · butuh tindakan hari ini</text>
<g>
<rect x=\"20\" y=\"72\" width=\"140\" height=\"90\" fill=\"var(--c1)\" opacity=\"0.85\" rx=\"6\"/>
<rect x=\"170\" y=\"72\" width=\"140\" height=\"90\" fill=\"var(--c2)\" opacity=\"0.85\" rx=\"6\"/>
<rect x=\"320\" y=\"72\" width=\"140\" height=\"90\" fill=\"var(--c3)\" opacity=\"0.85\" rx=\"6\"/>
<text x=\"90\" y=\"106\" font-size=\"12\" font-weight=\"600\" fill=\"#fff\">NPL 3,4%</text>
<text x=\"90\" y=\"124\" font-size=\"11\" fill=\"#fff\">▲ 0,2 pp</text>
<text x=\"90\" y=\"140\" font-size=\"11\" fill=\"#fff\">vs batas 3,0%</text>
<text x=\"240\" y=\"106\" font-size=\"12\" font-weight=\"600\" fill=\"#fff\">LCR 135%</text>
<text x=\"240\" y=\"124\" font-size=\"11\" fill=\"#fff\">aman</text>
<text x=\"390\" y=\"106\" font-size=\"12\" font-weight=\"600\" fill=\"#fff\">Top-20 45%</text>
<text x=\"390\" y=\"124\" font-size=\"11\" fill=\"#fff\">▲ di atas 40%</text>
</g>
<text x=\"240\" y=\"182\" font-size=\"12\" font-weight=\"600\" fill=\"var(--chart-text)\">LAPIS 2 · RINGKASAN — 6 tile kunci, jawab dalam 30 detik</text>
<rect x=\"20\" y=\"196\" width=\"440\" height=\"60\" fill=\"none\" stroke=\"var(--chart-grid)\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\" rx=\"6\"/>
<text x=\"240\" y=\"220\" font-size=\"12\" fill=\"var(--text-muted)\">LAPIS 3 · DETAIL — klik tile → tren 12 bulan, per segmen, drill-down</text>
<text x=\"240\" y=\"240\" font-size=\"11\" fill=\"var(--text-muted)\">hanya dibuka saat lapis 1–2 memicu pertanyaan</text>
</g>
<text x=\"240\" y=\"280\" font-size=\"11\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Aturan: merah harus langka — jika semua merah, tidak ada yang merah.</text>
</svg>`;

export const rr7: V2Lesson = {
  slug: "rr7-dashboard",
  track: "Risk Reporting",
  module: "Komunikasi Risiko",
  title: "RR7 — Merancang Dashboard Risiko",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dashboard 47 tile yang mati",
      prose: [
        "Tim IT bangga meluncurkan dashboard risiko \u201Cterlengkap\u201D: 47 tile, 12 chart, semua metrik yang pernah diminta siapa pun. Tiga bulan kemudian, data penggunaan: dibuka 2 kali seminggu, rata-rata 11 detik per kunjungan. Sementara itu CRO memakai spreadsheet buatannya sendiri — 6 angka yang ia update manual tiap pagi.",
        "Twist-nya: dashboard 47 tile itu gagal menangkap kenaikan NPL SME selama 6 minggu. Bukan karena datanya tidak ada — tile NPL ada di baris 4 kolom 3 — melainkan karena 46 tile lain berteriak bersamaan: 9 tile merah setiap hari, termasuk \u201Cperingatan\u201D untuk hal-hal yang tidak pernah menjadi masalah. Sinyal NPL tenggelam dalam kebisingan. Dashboard yang \u201Clengkap\u201D justru membutakan.",
        "Setelah lesson ini kamu bisa: (1) merancang hierarki 3 lapis dashboard; (2) menetapkan threshold alert yang tidak menimbulkan fatigue; (3) memilih tile vs chart vs tabel.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Dashboard yang tidak dibuka = monitoring yang tidak berjalan = risiko yang tidak terpantau. 6 minggu keterlambatan merespons NPL = 6 minggu eksposur baru mengalir ke segmen bermasalah. Dashboard adalah kontrol risiko — jika mati, kontrolnya mati.",
      },
      reference: "Lengkap ≠ berguna. Dashboard yang dibuka tiap pagi > dashboard yang lengkap.",
    },
    {
      id: "hierarki",
      eyebrow: "Langkah 2 · Hierarki",
      title: "Tiga lapis: alert, ringkasan, detail",
      prose: [
        "Lapis 1 — Alert: maksimal 3–5 metrik yang butuh tindakan HARI INI. Ini satu-satunya bagian yang boleh berwarna merah. Lapis 2 — Ringkasan: 6–8 tile kunci yang menjawab \u201Cbagaimana kondisi kita?\u201D dalam 30 detik. Lapis 3 — Detail: tren, per segmen, drill-down — hanya dibuka saat lapis 1–2 memicu pertanyaan.",
        "Aturan 30 detik: pengguna baru harus bisa menjawab \u201Caman atau tidak?\u201D dalam 30 detik tanpa scroll dan tanpa penjelasan. Jika tidak bisa, dashboard-mu gagal — bukan penggunanya yang bodoh. CRO dengan spreadsheet 6 angka lolos tes ini; dashboard 47 tile tidak.",
        "Cara membaca figur: balok merah atas = alert (sempit, Mendesak); tiga tile = ringkasan 30 detik; kotak putus-putus = detail on-demand. Interpretasi: 90% kunjungan seharusnya selesai di lapis 1–2. Lapis 3 ada untuk investigasi, bukan untuk pajangan.",
      ],
      figure: {
        svg: FIG_DASH,
        alt: "Mock layout dashboard tiga lapis: alert, ringkasan, detail.",
        caption: "Hierarki 3 lapis. Alert sempit dan Mendesak; ringkasan 30 detik; detail hanya saat dibutuhkan.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CSemua metrik penting, jadi semua harus di layar utama.\u201D Jika semua penting, tidak ada yang penting. Layar utama = keputusan hari ini. Sisanya = arsip yang bisa dicari. Keberanian membuang adalah skill dashboard nomor satu.",
      },
      hints: [
        "Intuisi: tanya tiap tile \u201Ctindakan apa yang berubah jika angka ini bergerak?\u201D — tidak ada jawaban = buang dari layar utama.",
        "Dashboard untuk CRO ≠ dashboard untuk analis. Satu dashboard untuk semua = dashboard untuk tidak ada siapa-siapa (ingat piramida RR1).",
      ],
      reference: "Lapis 1: tindakan hari ini. Lapis 2: kondisi 30 detik. Lapis 3: investigasi.",
    },
    {
      id: "lab-alert",
      eyebrow: "Langkah 3 · Lab",
      title: "Kalibrasi alert: merah harus langka",
      prose: [
        "Alert yang menyala setiap hari = alarm kebakaran yang berbunyi tiap jam: penghuni gedung berhenti keluar. Lab ini mengklasifikasi 30 hari data KRI menjadi HIJAU (< 3,0), KUNING (3,0–3,5), MERAH (> 3,5), lalu menghitung distribusinya.",
        "Hasil: HIJAU 8, KUNING 12, MERAH 10 dari 30 hari. Merah menyala sepertiga waktu — ini dashboard yang berteriak terus. Bandingkan dengan intuisi: jika bencananya \u201Csetiap hari\u201D, maka itu bukan bencana, itu kondisi normal yang threshold-nya salah. Kalibrasi ulang threshold = separuh pekerjaan dashboard.",
      ],
      formula: String.raw`\text{Rasio merah} = \frac{\text{hari MERAH}}{\text{total hari}}`,
      formulaNote: "Contoh: 10 hari merah dari 30 hari = 33%. Interpretasi: rasio merah > 20% = threshold terlalu ketat atau metriknya memang krisis — keduanya butuh tindakan, bukan dibiarkan berteriak.",
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `status` dan hitung distribusi" },
        { id: "t2", text: "Jalankan dan nilai: apakah alert ini sehat?" },
      ],
      expected: "HIJAU=8 KUNING=12 MERAH=10 -> rasio merah 33%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CSemakin banyak alert, semakin aman — tidak ada yang lolos.\u201D Terbalik: alert yang terlalu banyak = semuanya diabaikan = tidak ada yang tertangkap. Keamanan datang dari alert yang jarang TETAPI selalu ditindaklanjuti.",
      },
      hints: [
        "status: HIJAU jika v < 3.0, KUNING jika v <= 3.5, selain itu MERAH.",
        "Gunakan collections.Counter untuk menghitung tiap status.",
        "rasio_merah = count['MERAH'] / len(kri), format :.0%.",
      ],
      code: {
        starter: `# KRI harian 30 hari. JANGAN UBAH baris ini.\nfrom collections import Counter\nkri = [2.6,2.7,2.6,2.8,2.9,2.7,2.8,3.0,3.1,2.9,3.0,3.2,3.1,3.3,3.2,\n       3.4,3.3,3.5,3.4,3.6,3.5,3.7,3.6,3.8,3.7,3.9,3.8,4.0,3.9,4.1]\n\n# TULIS KODEMU\ndef status(v):\n    return\n\nc = Counter(status(v) for v in kri)\nrasio_merah = \nprint(f"HIJAU={c['HIJAU']} KUNING={c['KUNING']} MERAH={c['MERAH']} -> rasio merah {rasio_merah:.0%}")`,
        lockLines: 4,
        solution: `# KRI harian 30 hari. JANGAN UBAH baris ini.\nfrom collections import Counter\nkri = [2.6,2.7,2.6,2.8,2.9,2.7,2.8,3.0,3.1,2.9,3.0,3.2,3.1,3.3,3.2,\n       3.4,3.3,3.5,3.4,3.6,3.5,3.7,3.6,3.8,3.7,3.9,3.8,4.0,3.9,4.1]\n\n# TULIS KODEMU\ndef status(v):\n    return "HIJAU" if v < 3.0 else ("KUNING" if v <= 3.5 else "MERAH")\n\nc = Counter(status(v) for v in kri)\nrasio_merah = c["MERAH"] / len(kri)\nprint(f"HIJAU={c['HIJAU']} KUNING={c['KUNING']} MERAH={c['MERAH']} -> rasio merah {rasio_merah:.0%}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "HIJAU=8 KUNING=12 MERAH=10", label: "Distribusi benar", msg: "8 hijau, 12 kuning, 10 merah." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio merah 33%", label: "Rasio merah 33%", msg: "10/30 = 33% — terlalu sering untuk disebut darurat." },
        ],
      },
      reference: "Merah harus langka. Rasio merah > 20% = kalibrasi ulang threshold.",
    },
    {
      id: "desain",
      eyebrow: "Langkah 4 · Desain alert",
      title: "Alert yang ditindaklanjuti, bukan diabaikan",
      prose: [
        "Empat syarat alert sehat: (1) threshold berbasis data — persentil historis atau batas regulasi, bukan angka tebakan; (2) setiap alert punya pemilik dan aksi baku (\u201CMERAH NPL → bekukan limit, pemilik Kadiv\u201D); (3) ada jeda anti-spam — alert yang sama tidak berteriak dua kali sehari; (4) review berkala — alert yang 3 bulan tidak pernah ditindaklanjuti = cabut atau kalibrasi ulang.",
        "Jebakan terbesar: threshold \u201Caman\u201D yang ditetapkan terlalu ketat agar terlihat rajin. Hasilnya persis dashboard 47 tile: 9 tile merah tiap hari, semuanya diabaikan, termasuk yang benar-benar penting. Keberanian menetapkan threshold longgar = keberanian memercayai analisismu.",
      ],
      tasks: [],
      hints: [
        "Intuisi: alert yang baik seperti alarm kebakaran — jarang berbunyi, tetapi saat berbunyi semua orang bergerak. Jika alarm berbunyi tiap jam, yang rusak bukan gedungnya.",
        "Ukur kesehatan alert: % alert yang ditindaklanjuti dalam 24 jam. Di bawah 50% = alarm rusak.",
      ],
      reference: "Threshold berbasis data + pemilik + aksi baku + anti-spam + review berkala.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Alert",
      title: "Matematika alert fatigue: harga warna merah",
      prose: [
        "Alert yang menyala setiap hari = alarm kebakaran yang berbunyi tiap jam. Matematikanya brutal: 9 tile merah per hari × 15 menit investigasi = 135 menit per hari. Dalam 30 hari: 270 merah, yang benar-benar ditindaklanjuti 18 → precision 6,7%. Artinya 93% waktu investigasi — 63 jam per bulan — terbuang untuk alarm palsu.",
        "Biaya yang lebih mahal: analis belajar mengabaikan warna merah. Saat NPL SME benar-benar naik selama 6 minggu, tidak ada yang bereaksi — bukan karena tidak melihat, melainkan karena 'merah sudah biasa'. Inilah kegagalan dashboard 47 tile di cerita pembuka: ia melatih kebutaan, bukan kewaspadaan.",
        "Kalibrasi di lab: naikkan threshold dari >3,5 menjadi >4,0 dan tambah syarat 3 hari berturut-turut (anti-spam). Hasil 30 hari yang sama: merah turun 270 → 41, yang ditindaklanjuti tetap 18 → precision 44%, jam terbuang 63 → 5,8 jam. Masih ada false alarm — tetapi warna merah kembali berarti sesuatu.",
        "Aturan operasional: setiap alert punya 'harga' (menit investigasi) dan 'hasil' (tindakan yang dipicu). Review bulanan: alert dengan precision di bawah 20% selama 3 bulan = cabut atau kalibrasi ulang. Alert bukan dekorasi dashboard — ia kontrak: 'jika saya menyala, kamu bertindak.' Kontrak yang dilanggar tiap hari = kontrak yang mati.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `stats` (precision, jam terbuang)" },
        { id: "t2", text: "Jalankan dan bandingkan dua skenario" },
      ],
      expected: "Lama: precision 6.7%, 63 jam/bulan terbuang\nBaru: precision 43.9%, 5.8 jam/bulan terbuang",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Alert = semakin banyak semakin aman.” Terbalik: semakin banyak alert, semakin sedikit yang ditindaklanjuti — termasuk yang benar-benar penting. Keamanan datang dari precision, bukan dari volume.",
      },
      hints: [
        "precision = aksi / merah * 100.",
        "Tiap merah butuh 15 menit: (merah - aksi) * 15 / 60 jam.",
      ],
      code: {
        starter: "# 30 hari observasi (JANGAN UBAH).\nmerah_lama, aksi = 270, 18   # 9 merah/hari, 18 ditindaklanjuti\nmerah_baru = 41              # setelah kalibrasi threshold\n\n# TULIS KODEMU: precision & jam terbuang per skenario\ndef stats(merah, aksi):\n    return  # (precision_%, jam_terbuang_per_bulan)\n\np1, b1 = stats(merah_lama, aksi)\np2, b2 = stats(merah_baru, aksi)\nprint(f\"Lama: precision {p1:.1f}%, {b1:.0f} jam/bulan terbuang\")\nprint(f\"Baru: precision {p2:.1f}%, {b2:.1f} jam/bulan terbuang\")",
        lockLines: 3,
        solution: "# 30 hari observasi (JANGAN UBAH).\nmerah_lama, aksi = 270, 18   # 9 merah/hari, 18 ditindaklanjuti\nmerah_baru = 41              # setelah kalibrasi threshold\n\n# TULIS KODEMU: precision & jam terbuang per skenario\ndef stats(merah, aksi):\n    prec = aksi / merah * 100\n    buang = (merah - aksi) * 15 / 60\n    return (prec, buang)\n\np1, b1 = stats(merah_lama, aksi)\np2, b2 = stats(merah_baru, aksi)\nprint(f\"Lama: precision {p1:.1f}%, {b1:.0f} jam/bulan terbuang\")\nprint(f\"Baru: precision {p2:.1f}%, {b2:.1f} jam/bulan terbuang\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Precision lama 6,7%", msg: "18/270 = 6,7%.", pattern: "Lama: precision 6\\.7%" },
          { kind: "stdout_matches", task: "t2", label: "Precision baru 43,9%", msg: "18/41 = 43,9%.", pattern: "Baru: precision 43\\.9%" }
        ],
      },
      reference: "Merah harus langka agar berarti. Precision < 20% tiga bulan = cabut.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Ambang alert",
      title: "Alert longgar vs ketat",
      prose: [
        "Lab pertama menghitung harga alert fatigue. Lab ini membandingkan dua rezim: ambang longgar (20 TP, 180 FP → precision 10%) vs ketat (15 TP, 30 FP → precision 33%). Rezim longgar menangkap 5 kasus lebih banyak tetapi membanjiri analis dengan 150 FP tambahan.",
        "Keputusannya tergantung harga: jika satu kasus terlewat = Rp1 miliar, 150 FP tambahan (Rp150 juta biaya review) masih murah. Jika kasusnya ringan, ketat lebih baik. Tidak ada ambang universal — ada harga yang harus dihitung, seperti di lab pertama.",
      ],
      tasks: [
        { id: "t1", text: "Hitung precision tiap rezim" },
        { id: "t2", text: "Jalankan dan bandingkan vonisnya" },
      ],
      expected: "longgar: precision 10.0% -> LELAH\nketat: precision 33.3% -> SEHAT",
      note: {
        title: "Ketat ≠ selalu benar.",
        type: "pitfall",
        body: "“Precision 33% mengalahkan 10%, jadi selalu pakai ambang ketat.” Ambang ketat mengorbankan recall — 5 kasus yang tadinya tertangkap kini lolos. Jika satu kasus lolos = Rp1 miliar, 'kemenangan' precision ini sangat mahal.",
      },
      hints: [
        "precision = tp/(tp+fp).",
        "Format persen: f\"{precision:.1%}\".",
      ],
      code: {
        starter: "# (TP, FP) per rezim. JANGAN UBAH.\nskenario = {\"longgar\": (20, 180), \"ketat\": (15, 30)}\n\n# TULIS KODEMU: precision + vonis\nfor nama, (tp, fp) in skenario.items():\n    precision = \n    vonis = \"LELAH\" if precision < 0.2 else \"SEHAT\"\n    print(f\"{nama}: precision {precision:.1%} -> {vonis}\")",
        lockLines: 4,
        solution: "# (TP, FP) per rezim. JANGAN UBAH.\nskenario = {\"longgar\": (20, 180), \"ketat\": (15, 30)}\n\n# TULIS KODEMU: precision + vonis\nfor nama, (tp, fp) in skenario.items():\n    precision = tp/(tp+fp)\n    vonis = \"LELAH\" if precision < 0.2 else \"SEHAT\"\n    print(f\"{nama}: precision {precision:.1%} -> {vonis}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Rezim longgar", msg: "Precision 10% = LELAH.", pattern: "longgar: precision 10\.0% -\> LELAH" },
          { kind: "stdout_matches", task: "t2", label: "Rezim ketat", msg: "Precision 33,3% = SEHAT.", pattern: "ketat: precision 33\.3% -\> SEHAT" }
        ],
      },
      reference: "Ambang = fungsi harga. Longgar menangkap lebih banyak; ketat menghemat perhatian. Hitung, jangan tebak.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Tile, chart, atau tabel?",
      prose: [
        "Satu: satu angka + status (NPL hari ini) → tile besar dengan warna status; dibaca 2 detik. Dua: tren (NPL 30 hari) → sparkline/garis mini di dalam tile; konteks tanpa halaman baru. Tiga: perbandingan banyak kategori (NPL 20 cabang) → tabel yang bisa diurutkan; chart 20 batang tidak terbaca. Empat: investigasi akar masalah → halaman detail terpisah dengan drill-down; jangan dijejalkan ke layar utama.",
        "Aturan praktis 10 detik: butuh nilai persis → tabel. Butuh pola → chart. Butuh status sekilas → tile. Campuran ketiganya di satu layar tanpa hierarki = 47 tile yang mati.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Satu angka + status → tile; tetapi tile merah hanya untuk lapis 1 (butuh tindakan HARI INI). Tile ringkasan lapis 2 tidak boleh merah setiap hari — jika merah terus, threshold-nya yang salah, bukan kondisinya.",
      },
      reference: "Nilai persis = tabel. Pola = chart. Status sekilas = tile.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Selamatkan dashboard 47 tile",
      prose: [
        "Kamu ditugaskan memperbaiki dashboard 47 tile. Data penggunaan: 2 kunjungan/minggu, 11 detik/kunjungan. 9 tile merah setiap hari. NPL SME naik 6 minggu tanpa ada yang bereaksi. Anggaran: tidak boleh tambah tile, hanya boleh mengurangi dan menyusun ulang.",
        "Rancangan penyelamatan: Lapis 1 (alert): 3 tile — NPL total vs batas, LCR vs minimum, top-20 konsentrasi vs batas. Lapis 2: 6 tile — NPL per segmen (4) + coverage + tren sparkline. Lapis 3: sisanya (38 tile) pindah ke halaman detail per segmen, dibuka via klik. Threshold dikalibrasi: merah hanya jika > batas + buffer 0,3 pp selama 3 hari berturut-turut (anti-spam + anti-noise). Target: rasio merah < 5% hari.",
        "Hasil yang diharapkan: kunjungan naik karena 30 detik cukup; NPL SME tertangkap di lapis 1 minggu pertama karena tile-nya tidak lagi tenggelam. Pelajaran: mengurangi adalah merancang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biaya dashboard buruk bukan biaya IT — melainkan 6 minggu keterlambatan respons. Dalam 6 minggu, eksposur ke segmen bermasalah bisa tumbuh Rp puluhan miliar. Dashboard = kontrol risiko yang hidup atau mati.",
      },
      reference: "Kurang + susun ulang + kalibrasi > tambah fitur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Lalu buka dashboard kantormu dan hitung rasio merahnya.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Buka dashboard kantormu dan hitung rasio merah 30 hari terakhir: merah yang ditindaklanjuti / total merah. Di bawah 20% = dashboard-mu sedang melatih kebutaan. Kalibrasi ulang minggu ini.",
      },

      summary: [
        "Hierarki 3 lapis: alert (tindakan hari ini), ringkasan (30 detik), detail (investigasi).",
        "Aturan 30 detik: \u201Caman atau tidak?\u201D terjawab tanpa scroll.",
        "Merah harus langka; rasio merah > 20% = threshold rusak.",
        "Alert sehat: threshold berbasis data + pemilik + aksi baku + anti-spam.",
        "Tile = status, chart = pola, tabel = nilai persis.",
      ],
      next: { label: "RR8 — Otomasi Pipeline Laporan", href: "/learn/rr8-otomasi" },
      quiz: [
        {
          q: "Mengapa dashboard 47 tile gagal menangkap kenaikan NPL 6 minggu?",
          options: [
            { text: "Datanya tidak ada", why: "Datanya ada — tile NPL ada di baris 4 kolom 3." },
            { text: "Sinyal tenggelam dalam 9 tile merah harian (alert fatigue)", why: "Tepat. Kebisingan membutakan; yang penting tidak terlihat.", correct: true },
            { text: "Server terlalu lambat", why: "Masalahnya desain, bukan performa." },
          ],
        },
        {
          q: "Rasio merah 33% (10 dari 30 hari). Kesimpulan?",
          options: [
            { text: "Kondisi memang krisis terus", why: "Mungkin — tetapi lebih mungkin threshold salah. Selidiki dulu." },
            { text: "Threshold terlalu ketat; kalibrasi ulang", why: "Benar. Darurat yang terjadi sepertiga waktu bukan darurat.", correct: true },
            { text: "Tambah lebih banyak alert", why: "Menambah kebisingan pada sistem yang sudah bising." },
          ],
        },
        {
          q: "Isi lapis 1 (alert) dashboard yang benar?",
          options: [
            { text: "Semua 47 metrik", why: "Itu yang membunuh dashboard aslinya." },
            { text: "3–5 metrik yang butuh tindakan hari ini", why: "Tepat. Sempit, Mendesak, berwarna merah hanya di sini.", correct: true },
            { text: "Hanya chart tren 12 bulan", why: "Tren = lapis 2/3, bukan alert hari ini." },
          ],
        },
        {
          q: "NPL 20 cabang perlu dibandingkan. Tampilan tepat?",
          options: [
            { text: "20 batang chart", why: "20 batang tidak terbaca sekilas." },
            { text: "Tabel yang bisa diurutkan", why: "Benar. Nilai persis + ranking = tabel.", correct: true },
            { text: "20 tile di layar utama", why: "Banjir tile = kembali ke 47 tile yang mati." },
          ],
        },
        {
          q: "Alert 3 bulan tidak pernah ditindaklanjuti. Tindakan?",
          options: [
            { text: "Biarkan saja", why: "Alarm yang tidak pernah direspons = kebisingan yang merusak kepercayaan." },
            { text: "Cabut atau kalibrasi ulang threshold-nya", why: "Benar. Alert tanpa tindak lanjut = alert yang salah.", correct: true },
            { text: "Naikkan volumenya agar diperhatikan", why: "Mengeraskan alarm rusak tidak memperbaikinya." },
          ],
        },
      ],
    },
  ],
};
