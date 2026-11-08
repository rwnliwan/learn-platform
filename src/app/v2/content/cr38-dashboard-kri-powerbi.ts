import type { V2Lesson } from "../lib/types";

const FIG_KRI = `<svg viewBox="0 0 520 300" role="img" aria-label="Panel KRI: NPL dan migrasi per segmen dengan lampu traffic light.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Dashboard KRI kredit — lampu per segmen</text>
<text x="10" y="58" font-size="11" fill="var(--chart-text)" opacity="0.7">Segmen</text>
<text x="150" y="58" font-size="11" fill="var(--chart-text)" opacity="0.7">NPL (ambang 3 / 8%)</text>
<text x="350" y="58" font-size="11" fill="var(--chart-text)" opacity="0.7">Migrasi 31-90 (ambang 5 / 15%)</text>
<text x="10" y="94" font-size="12" fill="var(--chart-text)">Ritel</text>
<circle cx="160" cy="90" r="8" fill="#46a758"/>
<text x="178" y="95" font-size="12" fill="var(--chart-text)">0,00%</text>
<circle cx="360" cy="90" r="8" fill="#e5484d"/>
<text x="378" y="95" font-size="12" fill="var(--chart-text)">18,18%</text>
<text x="10" y="130" font-size="12" fill="var(--chart-text)">SME</text>
<circle cx="160" cy="126" r="8" fill="#e5484d"/>
<text x="178" y="131" font-size="12" fill="var(--chart-text)">15,09%</text>
<circle cx="360" cy="126" r="8" fill="#46a758"/>
<text x="378" y="131" font-size="12" fill="var(--chart-text)">0,00%</text>
<text x="10" y="166" font-size="12" fill="var(--chart-text)">Korporat</text>
<circle cx="160" cy="162" r="8" fill="#e5484d"/>
<text x="178" y="167" font-size="12" fill="var(--chart-text)">14,29%</text>
<circle cx="360" cy="162" r="8" fill="#e5484d"/>
<text x="378" y="167" font-size="12" fill="var(--chart-text)">21,43%</text>
<text x="10" y="212" font-size="10" fill="var(--chart-text)" opacity="0.75">Hijau: di bawah ambang perhatian. Kuning: waspada + rencana aksi. Merah: eskalasi.</text>
<text x="10" y="238" font-size="10" fill="var(--chart-text)" opacity="0.75">Ritel: NPL hijau TETAPI migrasi merah — indikator leading berteriak lebih dulu.</text>
<text x="10" y="264" font-size="10" fill="var(--chart-text)" opacity="0.75">SME &amp; Korporat: NPL merah — kerugian sudah terjadi, fokus ke workout dan recovery.</text>
</g>
</svg>`;

export const cr38: V2Lesson = {
  slug: "cr38-dashboard-kri-powerbi",
  track: "Credit Risk",
  module: "Pelaporan & Monitoring",
  title: "CR38 — Dashboard KRI & Power BI untuk Credit Risk",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rapat yang terlalu tenang",
      prose: [
        "Rapat komite risiko Bank Nusantara, triwulan III. Head of Risk membuka dashboard KRI di layar besar: NPL 2,1% — di bawah ambang 3%, lampu hijau. CKPN stabil, hapus buku rendah. Semua indikator hijau, semua orang tenang. Rapat selesai 20 menit lebih cepat dari jadwal.",
        "Tiga bulan kemudian NPL melejit ke 6,8%. Cadangan melonjak Rp180 miliar, dua debitur korporat direstrukturisasi darurat. Direksi bertanya satu kalimat yang dingin: 'Kok bisa tidak kelihatan?'",
        "Twist-nya: masalahnya bukan datanya — melainkan KRI yang dipilih. Dashboard itu hanya menampilkan indikator lagging: NPL, CKPN, hapus buku — semuanya cermin kaca spion, merekam apa yang SUDAH terjadi. Indikator leading tidak ada di dashboard sama sekali: migrasi DPD 31–90 di segmen Ritel sudah 18% saat rapat itu berlangsung, restrukturisasi SME naik dua kuartal beruntun. Badai sudah terlihat di speedometer — tetapi komite hanya menatap spion.",
        "Setelah lesson ini kamu bisa: (1) membedakan KRI leading vs lagging dan menjelaskan kapan masing-masing dipakai; (2) menghitung NPL ratio dan migration rate dari data portofolio; (3) merancang ambang traffic light yang terkalibrasi; (4) mengenali tiga jebakan dashboard yang menenangkan palsu. Prasyarat ringkas: NPL = porsi kredit macet (Kol 4–5) terhadap total baki; DPD = days past due, jumlah hari keterlambatan pembayaran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "KRI yang salah tidak netral — ia aktif menenangkan. Komite yang melihat dashboard hijau akan menyetujui ekspansi kredit tepat di saat seharusnya mengerem. Memilih KRI adalah keputusan risiko, bukan keputusan desain.",
      },
      reference: "Lagging = spion (NPL, CKPN). Leading = speedometer (migrasi DPD, restrukturisasi).",
    },
    {
      id: "kri-leading-lagging",
      eyebrow: "Langkah 2 · Konsep",
      title: "KRI leading vs lagging: speedometer dan kaca spion",
      prose: [
        "Key Risk Indicator (KRI) adalah metrik yang dipantau rutin untuk mendeteksi perubahan profil risiko sebelum menjadi kerugian. KRI leading bergerak DULUAN: migrasi DPD 31–90 hari, pertumbuhan restrukturisasi, utilisasi limit kartu kredit, penurunan skor perilaku. KRI lagging bergerak BELAKANGAN: NPL, CKPN (cadangan), hapus buku — semuanya mencatat kerugian yang sudah terjadi.",
        "Kepribadiannya: KRI leading adalah 'si speedometer' — berisik, kadang false alarm, tetapi memberi waktu bereaksi. KRI lagging adalah 'si kaca spion' — tenang, akurat, tetapi hanya berguna untuk melihat ke belakang. Bank yang hanya memantau lagging seperti sopir yang menyetir sambil menatap spion: ia tahu persis apa yang sudah dilewati, dan tidak tahu apa yang ada di depan.",
        "Aturan pakainya: leading untuk aksi pencegahan (pengetatan underwriting, penambahan kolektor, pembatasan limit), lagging untuk akuntansi dan pelaporan (CKPN, pengungkapan ke regulator). Dashboard komite risiko yang sehat memuat keduanya — tetapi keputusan diambil dari leading, bukan dari lagging.",
        "Contoh konkret dari data lesson ini: segmen Ritel NPL-nya 0% (lagging hijau sempurna) tetapi migrasi DPD 31–90-nya 18,18% (leading merah menyala). Analis yang hanya membaca NPL akan menulis 'Ritel sehat' di laporannya — dan tiga bulan kemudian menulis memo penjelasan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: NPL turun = risiko turun",
        type: "pitfall",
        body: "Mitos: 'NPL turun dari 5% ke 3%, risiko kita membaik.' Yang benar: NPL bisa turun karena hapus buku besar-besaran (menghapus pembilang DAN penyebut) atau evergreening (restrukturisasi kredit bermasalah agar kembali Kol 1). Selalu tanya: NPL turun karena apa — perbaikan kualitas, atau akuntansi?",
      },
      hints: [
        "Leading: migrasi DPD, restrukturisasi, utilisasi, skor perilaku.",
        "Lagging: NPL, CKPN, hapus buku.",
      ],
      reference: "Leading = aksi pencegahan. Lagging = akuntansi & pelaporan.",
    },
    {
      id: "ambang-eskalasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Ambang dan eskalasi: lampu lalu lintas risiko",
      prose: [
        "KRI tanpa ambang hanyalah angka hiasan. Pola bakunya traffic light: HIJAU (di bawah ambang perhatian — pantau rutin), KUNING (melewati ambang perhatian — waspada, pemilik KRI wajib punya rencana aksi), MERAH (melewati ambang kritis — eskalasi ke komite, aksi wajib dalam tenggat). Setiap warna harus punya pemilik dan respons yang terdefinisi — lampu merah tanpa aksi yang jelas hanya membuat semua orang terbiasa mengabaikan lampu merah.",
        "Ambang yang baik dikalibrasi dari tiga sumber: sejarah internal (distribusi KRI 3–5 tahun terakhir), risk appetite bank (berapa besar kerugian yang masih bisa ditoleransi), dan pembanding industri. Ambang yang buruk adalah angka cantik yang disalin dari bank lain tanpa kalibrasi — ia akan berbunyi terus (alarm fatigue) atau tidak pernah berbunyi (ketenangan palsu).",
        "Dua rumus fondasi dashboard KRI kredit:",
      ],
      formula: String.raw`\text{NPL} = \frac{\text{Baki debet Kol 4--5}}{\text{Total baki debet}} \times 100\%, \qquad \text{Migrasi}_{31-90} = \frac{\text{Baki DPD 31--90}}{\text{Total baki debet}} \times 100\%`,
      formulaNote: "Baki debet Kol 4–5 = sisa utang debitur macet/diragukan; total baki debet = seluruh sisa utang segmen. Contoh SME di lesson ini: 80/530 = 15,09% — merah. Interpretasi: NPL mengukur kerugian yang sudah mengkristal; migrasi mengukur antrean kerugian berikutnya. Keduanya dibagi total baki agar sebanding antar-segmen.",
      tasks: [],
      note: {
        title: "💡 Intuisi: ambang tanpa pemilik = dekorasi",
        body: "Bank yang matang tidak bertanya 'berapa ambangnya?' melainkan 'siapa yang bangun jam 2 pagi kalau lampu merah menyala?' Ambang yang tidak menunjuk pemilik dan tenggat aksi akan diabaikan tepat saat paling dibutuhkan — karena saat krisis, semua orang mengira orang lain yang menangani.",
      },
      reference: "Hijau = pantau. Kuning = rencana aksi. Merah = eskalasi + tenggat.",
    },
    {
      id: "anatomi-dashboard",
      eyebrow: "Langkah 4 · Konsep",
      title: "Anatomi dashboard risiko kredit: empat panel wajib",
      prose: [
        "Dashboard KRI kredit yang layak komite punya empat panel. Panel 1 — NPL per segmen: membandingkan antar-segmen, bukan hanya angka bank keseluruhan (angka agregat menyembunyikan segmen yang berdarah). Panel 2 — migrasi kolektibilitas: matriks perpindahan Kol 1→2→3 per kuartal, atau vintage curve untuk kredit baru. Panel 3 — konsentrasi eksposur: porsi segmen/debitur terbesar (satu debitur 20% portofolio = risiko nama tunggal). Panel 4 — tren restrukturisasi dan hapus buku: pembeda antara 'NPL turun karena sembuh' vs 'NPL turun karena dihapus'.",
        "Di Power BI, keempat panel ini dihubungkan oleh satu model data: tabel fakta kredit (per fasilitas per periode) + tabel dimensi (segmen, kolektibilitas, wilayah). Satu filter periode mengubah seluruh panel serentak — itulah bedanya dashboard dengan empat laporan Excel yang ditempel. Kunci desainnya: satu definisi KRI dipakai di semua panel (single source of truth), bukan tiap panel menghitung versinya sendiri.",
        "Cara membaca figur: tiap baris = satu segmen; lingkaran = lampu traffic light; angka = nilai KRI. Interpretasi: Ritel — NPL hijau (0,00%) TETAPI migrasi merah (18,18%): antrean masalah sedang terbentuk. SME — NPL merah (15,09%), migrasi hijau (0,00%): kerugian sudah terjadi, tidak ada gelombang susulan dari migrasi dini. Korporat — keduanya merah: butuh perhatian paling besar.",
      ],
      figure: {
        svg: FIG_KRI,
        alt: "Panel KRI: Ritel NPL 0,00% hijau dan migrasi 18,18% merah; SME NPL 15,09% merah dan migrasi 0,00% hijau; Korporat keduanya merah.",
        caption: "Lampu per segmen: Ritel hijau-merah (peringatan dini), SME merah-hijau (kerugian terjadi), Korporat merah-merah.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: satu angka bank = kondisi bank",
        type: "pitfall",
        body: "Mitos: 'NPL bank 2,1%, kita sehat.' Yang benar: angka agregat adalah rata-rata yang bisa menyembunyikan segmen berdarah — Korporat 14,29% tertutup oleh bobotnya yang besar di penyebut. Selalu baca KRI per segmen sebelum menyimpulkan; agregat hanya untuk laporan regulator.",
      },
      reference: "4 panel: NPL segmen, migrasi, konsentrasi, restrukturisasi + hapus buku.",
    },
    {
      id: "jebakan-dashboard",
      eyebrow: "Langkah 5 · Konsep",
      title: "Tiga jebakan dashboard yang menenangkan palsu",
      prose: [
        "Jebakan 1 — Evergreening: kredit bermasalah direstrukturisasi (top-up kecil, perpanjangan tenor) agar klasifikasinya kembali Kol 1. NPL tetap hijau, tetapi risiko menumpuk di bawah permukaan. Penangkalnya: panel tren restrukturisasi — bila restrukturisasi naik bersamaan dengan NPL yang datar, itu bau evergreening.",
        "Jebakan 2 — Definisi berubah diam-diam: tahun lalu NPL dihitung gross, tahun ini net setelah agunan; atau cakupan segmen berubah. Tren yang 'membaik' ternyata hanya ganti penggaris. Penangkalnya: kamus definisi KRI yang berversi, dan setiap perubahan definisi dicatat dengan tanggal efektif — analis yang membandingkan apel tahun lalu dengan jeruk tahun ini akan menarik kesimpulan salah.",
        "Jebakan 3 — Dilihat tapi tidak dibaca: dashboard dibuka tiap rapat, tidak ada yang bertanya 'kenapa migrasi Ritel naik?'. Dashboard tanpa narasi analis dan tanpa tindak lanjut adalah televisi — menyala, berisik, tidak mengubah apa pun. Penangkalnya: setiap lampu kuning/merah wajib ditemani satu paragraf penjelasan pemilik KRI dan satu aksi dengan tenggat.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: dashboard bagus = risiko terkendali",
        type: "pitfall",
        body: "Mitos: 'Dashboard kita sudah Power BI real-time, jadi risiko terpantau.' Yang benar: dashboard hanya seberharga keputusan yang dihasilkannya. Bank Nusantara punya dashboard real-time — dan tetap kecolongan, karena yang ditampilkan hanya indikator lagging. Teknologi tidak memperbaiki KRI yang salah pilih.",
      },
      reference: "3 jebakan: evergreening, definisi berubah, dilihat-tak-dibaca.",
    },
    {
      id: "lab-kri",
      eyebrow: "Langkah 6 · Lab",
      title: "Bangun panel KRI: dari tabel ke lampu",
      prose: [
        "Tabel kredit 12 fasilitas lintas 3 segmen sudah tersedia di database. Tugasmu: hitung NPL per segmen (baki Kol 4+ dibagi total baki), hitung migrasi dini per segmen (baki DPD 31–90 dibagi total baki), lalu terapkan ambang traffic light — NPL: kuning di atas 3%, merah di atas 8%; migrasi: kuning di atas 5%, merah di atas 15% — dan cetak panelnya.",
        "Eksplorasi: setelah lolos, ubah ambang merah NPL dari 8% menjadi 20% — berapa segmen yang tadinya merah kini hijau? Itulah cara ambang yang longgar menciptakan ketenangan palsu. Lalu kembalikan, dan ubah DPD debitur 3 (Ritel) dari 45 menjadi 10 — lampu apa yang berubah di Ritel?",
      ],
      tasks: [
        { id: "t1", text: "Hitung dict `npl` berisi NPL (%) per segmen dari tabel" },
        { id: "t2", text: "Hitung dict `migrasi` berisi migrasi DPD 31–90 (%) per segmen" },
        { id: "t3", text: "Terapkan fungsi `lampu` dan cetak panel untuk 3 segmen" },
      ],
      expected: "Ritel    | NPL  0.00% HIJAU  | Migrasi 18.18% MERAH\nSME      | NPL 15.09% MERAH  | Migrasi  0.00% HIJAU\nKorporat | NPL 14.29% MERAH  | Migrasi 21.43% MERAH",
      code: {
        starter: "import sqlite3\n\n# Data JANGAN UBAH.\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE kredit(id INTEGER, segmen TEXT, baki REAL, kol INTEGER, dpd INTEGER)\")\nrows = [\n    (1,\"Ritel\",50.0,1,0),(2,\"Ritel\",30.0,1,15),(3,\"Ritel\",20.0,2,45),(4,\"Ritel\",10.0,1,20),\n    (5,\"SME\",200.0,1,0),(6,\"SME\",150.0,1,10),(7,\"SME\",100.0,3,100),(8,\"SME\",80.0,4,130),\n    (9,\"Korporat\",500.0,1,0),(10,\"Korporat\",400.0,1,5),(11,\"Korporat\",300.0,2,60),(12,\"Korporat\",200.0,5,210),\n]\ncur.executemany(\"INSERT INTO kredit VALUES (?,?,?,?,?)\", rows)\n\n# TULIS KODEMU: t1 NPL per segmen (baki Kol 4+ / total baki * 100)\nnpl = {}\n\n# t2: migrasi dini per segmen (baki DPD 31-90 / total baki * 100)\nmigrasi = {}\n\n# t3: lampu traffic light, lalu cetak panel\ndef lampu(nilai, kuning, merah):\n    pass\n\nfor seg in [\"Ritel\",\"SME\",\"Korporat\"]:\n    pass\n",
        lockLines: 12,
        solution: "import sqlite3\n\n# Data JANGAN UBAH.\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\ncur.execute(\"CREATE TABLE kredit(id INTEGER, segmen TEXT, baki REAL, kol INTEGER, dpd INTEGER)\")\nrows = [\n    (1,\"Ritel\",50.0,1,0),(2,\"Ritel\",30.0,1,15),(3,\"Ritel\",20.0,2,45),(4,\"Ritel\",10.0,1,20),\n    (5,\"SME\",200.0,1,0),(6,\"SME\",150.0,1,10),(7,\"SME\",100.0,3,100),(8,\"SME\",80.0,4,130),\n    (9,\"Korporat\",500.0,1,0),(10,\"Korporat\",400.0,1,5),(11,\"Korporat\",300.0,2,60),(12,\"Korporat\",200.0,5,210),\n]\ncur.executemany(\"INSERT INTO kredit VALUES (?,?,?,?,?)\", rows)\n\n# TULIS KODEMU: t1 NPL per segmen (baki Kol 4+ / total baki * 100)\nnpl = {}\nfor seg in [\"Ritel\",\"SME\",\"Korporat\"]:\n    tot = cur.execute(\"SELECT SUM(baki) FROM kredit WHERE segmen=?\", (seg,)).fetchone()[0]\n    macet = cur.execute(\"SELECT SUM(baki) FROM kredit WHERE segmen=? AND kol>=4\", (seg,)).fetchone()[0] or 0.0\n    npl[seg] = round(macet/tot*100, 2)\n\n# t2: migrasi dini per segmen (baki DPD 31-90 / total baki * 100)\nmigrasi = {}\nfor seg in [\"Ritel\",\"SME\",\"Korporat\"]:\n    tot = cur.execute(\"SELECT SUM(baki) FROM kredit WHERE segmen=?\", (seg,)).fetchone()[0]\n    mig = cur.execute(\"SELECT SUM(baki) FROM kredit WHERE segmen=? AND dpd>30 AND dpd<=90\", (seg,)).fetchone()[0] or 0.0\n    migrasi[seg] = round(mig/tot*100, 2)\n\nnpl_sme = npl[\"SME\"]\nnpl_kor = npl[\"Korporat\"]\nmig_ritel = migrasi[\"Ritel\"]\n\n# t3: lampu traffic light, lalu cetak panel\ndef lampu(nilai, kuning, merah):\n    if nilai > merah:\n        return \"MERAH\"\n    if nilai > kuning:\n        return \"KUNING\"\n    return \"HIJAU\"\n\nfor seg in [\"Ritel\",\"SME\",\"Korporat\"]:\n    l_npl = lampu(npl[seg], 3.0, 8.0)\n    l_mig = lampu(migrasi[seg], 5.0, 15.0)\n    print(f\"{seg:8s} | NPL {npl[seg]:5.2f}% {l_npl:6s} | Migrasi {migrasi[seg]:5.2f}% {l_mig}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "NPL SME = 15,09%", msg: "Baki Kol 4+ SME = 80 dari total 530.", name: "npl_sme", value: 15.09, tol: 0.01 },
          { kind: "equal", task: "t1", label: "NPL Korporat = 14,29%", msg: "Baki Kol 4+ Korporat = 200 dari total 1400.", name: "npl_kor", value: 14.29, tol: 0.01 },
          { kind: "equal", task: "t2", label: "Migrasi Ritel = 18,18%", msg: "Baki DPD 31-90 Ritel = 20 dari total 110.", name: "mig_ritel", value: 18.18, tol: 0.01 },
          { kind: "stdout_matches", task: "t3", label: "Ritel hijau-merah", msg: "NPL Ritel hijau, migrasinya merah — kontras leading vs lagging.", pattern: "Ritel.*HIJAU.*MERAH" },
          { kind: "stdout_matches", task: "t3", label: "Korporat merah-merah", msg: "Kedua KRI Korporat melewati ambang merah.", pattern: "Korporat.*MERAH.*MERAH" },
        ],
      },
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Membaca dashboard: empat skenario",
      prose: [
        "Skenario 1 — Semua hijau tetapi satu segmen anomali di detail: jangan percaya agregat. Drill down ke segmen itu, minta penjelasan tertulis pemilik KRI dalam 3 hari kerja. Agregat hijau + segmen merah = agregatnya yang menipu.",
        "Skenario 2 — Leading merah, lagging hijau (kasus Ritel): investigasi dini. Tambah kolektor, ketatkan underwriting segmen itu, siapkan pencadangan bertahap. Ini jendela aksi terbaik — masalahnya masih murah untuk diperbaiki.",
        "Skenario 3 — Leading hijau, lagging merah (kasus SME): kerugian sudah terjadi. Fokus ke workout dan recovery, bukan pencegahan. Jangan buang energi mengetatkan underwriting untuk kredit yang sudah macet — selamatkan yang bisa diselamatkan.",
        "Skenario 4 — KRI bergerak tanpa penjelasan bisnis yang masuk akal: audit definisi dan data dulu sebelum eskalasi. Tanya: apakah definisi berubah? Apakah ada migrasi sistem? Eskalasi atas angka yang salah definisi hanya membuang kredibilitas fungsi risiko.",
        "Aturan praktis 10 detik: baca per segmen dulu, bukan agregat → leading merah = aksi dini → lagging merah = recovery → angka aneh = cek definisi dulu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: dashboard dibaca dari kanan ke kiri waktu",
        body: "Analis junior membaca dashboard dari kiri (angka terbesar). Analis senior membaca dari 'masa depan': cek leading dulu, baru lagging. Urutan baca yang benar: migrasi → restrukturisasi → NPL → CKPN. Yang paling kanan (lagging) hanya konfirmasi — keputusan sudah diambil dari yang kiri.",
      },
      reference: "Segmen dulu, bukan agregat. Leading = aksi. Lagging = recovery.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dua segmen, dua cerita",
      prose: [
        "Data triwulan berjalan: SME — NPL 15,09% (merah), migrasi 0,00% (hijau). Ritel — NPL 0,00% (hijau), migrasi 18,18% (merah). Komite punya satu slot perhatian bulan ini: tim workout hanya bisa fokus ke satu segmen. Analis junior mengusulkan SME — 'NPL-nya 15%, itu yang berdarah.' Pertanyaan: (1) Apa yang benar dan yang kurang dari usulan itu? (2) Keputusanmu dan alasannya?",
        "Pembahasan: (1) Yang benar: SME memang butuh workout — kerugian 15,09% sudah terjadi dan tidak akan sembuh sendiri. Yang kurang: ia melewatkan bahwa migrasi Ritel 18,18% adalah antrean kerugian berikutnya; mengabaikannya berarti rapat berikutnya membahas NPL Ritel yang meledak. (2) Bagi perhatian: tim workout ke SME (recovery), tim analis + kolektor ke Ritel (pencegahan dini — telepon debitur DPD 30+, review limit). Pelajaran: leading dan lagging menuntut respons yang BERBEDA — mencampur keduanya menjadi satu prioritas adalah cara tercepat salah alokasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biaya pencegahan di fase leading (telepon kolektor, pengetatan limit) adalah puluhan juta. Biaya workout di fase lagging (restrukturisasi, CKPN, hapus buku) adalah miliaran. Setiap kuartal keterlambatan membaca leading menaikkan biaya penanganan sekitar satu orde besar — itulah ekonomi di balik dashboard KRI.",
      },
      reference: "SME = workout. Ritel = cegah. Beda fase, beda respons.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — KRI adalah pilihan, bukan fakta alam.",
      ],
      tasks: [],
      summary: [
        "KRI leading (migrasi DPD, restrukturisasi) untuk pencegahan; KRI lagging (NPL, CKPN) untuk akuntansi & pelaporan.",
        "NPL = baki Kol 4–5 / total baki; migrasi 31–90 = baki DPD 31–90 / total baki.",
        "Traffic light butuh ambang terkalibrasi + pemilik + aksi per warna.",
        "Baca KRI per segmen — agregat bisa menyembunyikan segmen berdarah.",
        "3 jebakan: evergreening, definisi berubah diam-diam, dilihat tapi tidak dibaca.",
      ],
      next: { label: "CR39 — Internal Rating System: Arsitektur & Kalibrasi", href: "/v2/learn/cr39-internal-rating-system" },
      quiz: [
        {
          q: "NPL turun dari 5% ke 3% setelah bank menghapus buku Rp50 miliar kredit macet. Interpretasi yang benar…",
          options: [
            { text: "Risiko membaik — NPL turun", why: "Salah: hapus buku menghapus pembilang dan penyebut; risikonya sudah terealisasi sebagai kerugian, bukan membaik.", },
            { text: "Belum tentu membaik — tanya dulu NPL turun karena apa", why: "Benar: NPL bisa turun karena hapus buku atau evergreening. Perbaikan sejati hanya bila kualitas portofolio membaik.", correct: true },
            { text: "Risiko memburuk — hapus buku selalu buruk", why: "Salah: hapus buku atas kredit yang memang tak tertagih adalah pembersihan yang sehat.", },
            { text: "Tidak bisa disimpulkan apa-apa", why: "Salah: bisa disimpulkan sebagian — cek tren restrukturisasi dan migrasi untuk memastikan.", },
          ],
        },
        {
          q: "KRI leading yang paling tepat untuk deteksi dini pemburukan ritel…",
          options: [
            { text: "NPL per segmen", why: "Salah: NPL adalah lagging — ia mencatat yang sudah macet.", },
            { text: "Migrasi DPD 31–90 hari", why: "Benar: keterlambatan dini adalah antrean kredit macet berikutnya.", correct: true },
            { text: "CKPN triwulan berjalan", why: "Salah: CKPN mengikuti kerugian yang sudah teridentifikasi.", },
            { text: "Total baki debet", why: "Salah: itu ukuran volume, bukan risiko.", },
          ],
        },
        {
          q: "Dashboard: NPL hijau di semua segmen, tetapi migrasi Ritel 18% (merah). Tindakan yang tepat…",
          options: [
            { text: "Tidak ada — semua NPL hijau", why: "Salah: persis kesalahan Bank Nusantara — mengabaikan leading.", },
            { text: "Investigasi Ritel dan siapkan aksi pencegahan dini", why: "Benar: leading merah = jendela aksi termurah; tunggu NPL merah berarti terlambat.", correct: true },
            { text: "Naikkan ambang migrasi agar hijau", why: "Salah: mengubah ambang agar lampu hijau adalah ketenangan palsu yang disengaja.", },
            { text: "Tunggu triwulan depan untuk konfirmasi", why: "Salah: menunggu konfirmasi dari lagging = membiarkan antrean menjadi kerugian.", },
          ],
        },
        {
          q: "Ambang traffic light yang baik ditentukan dari…",
          options: [
            { text: "Angka cantik yang dipakai bank lain", why: "Salah: ambang tiruan tidak terkalibrasi dengan portofolio sendiri.", },
            { text: "Sejarah internal + risk appetite + pembanding industri", why: "Benar: kalibrasi tiga sumber membuat ambang berbunyi saat seharusnya.", correct: true },
            { text: "Target NPL direksi tahun ini", why: "Salah: target bisnis bukan ambang risiko — mencampurnya merusak kedua fungsi.", },
            { text: "Rata-rata industri saja", why: "Salah: portofolio tiap bank berbeda; rata-rata industri hanya pembanding.", },
          ],
        },
        {
          q: "Evergreening berbahaya terutama karena…",
          options: [
            { text: "Melanggar aturan akuntansi secara langsung", why: "Salah: bahayanya bukan teknis akuntansi, melainkan informasi.", },
            { text: "NPL terlihat hijau padahal risiko menumpuk di bawah permukaan", why: "Benar: restrukturisasi kosmetik mengembalikan Kol 1 tanpa memperbaiki kemampuan bayar.", correct: true },
            { text: "Menaikkan NPL secara artifisial", why: "Salah: evergreening MENURUNKAN NPL tercatat, bukan menaikkan.", },
            { text: "Mengurangi laba bank", why: "Salah: justru menunda pengakuan kerugian sehingga laba terlihat baik.", },
          ],
        },
      ],
    },
  ],
};
