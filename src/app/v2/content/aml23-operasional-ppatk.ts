import type { V2Lesson } from "../lib/types";

const FIG_ALUR = `<svg viewBox="0 0 520 320" role="img" aria-label="Alur kerja unit AML: dari alert ke laporan resmi PPATK.">
<g font-family="var(--font-ui)">
<text x="260" y="24" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Dari alert ke laporan resmi</text>
<rect x="20" y="50" width="140" height="56" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="90" y="74" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">1. Alert masuk</text>
<text x="90" y="92" font-size="10" fill="var(--chart-text)" text-anchor="middle">sistem &amp; laporan cabang</text>
<rect x="190" y="50" width="140" height="56" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="260" y="74" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2. Triase &amp; analisis</text>
<text x="260" y="92" font-size="10" fill="var(--chart-text)" text-anchor="middle">tutup / eskalasi / dalami</text>
<rect x="360" y="50" width="140" height="56" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="430" y="74" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">3. Susun laporan</text>
<text x="430" y="92" font-size="10" fill="var(--chart-text)" text-anchor="middle">LTKM / LTKT / transfer dana</text>
<rect x="190" y="150" width="140" height="56" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="260" y="174" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">4. Kirim via sistem</text>
<text x="260" y="192" font-size="10" fill="var(--chart-text)" text-anchor="middle">goAML / SIPENA</text>
<rect x="190" y="250" width="140" height="40" rx="8" fill="var(--c5)" opacity="0.3" stroke="var(--c5)" stroke-width="2"/>
<text x="260" y="275" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">5. Arsip &amp; jejak audit</text>
<line x1="160" y1="78" x2="190" y2="78" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="330" y1="78" x2="360" y2="78" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="430" y1="106" x2="430" y2="150" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="330" y1="178" x2="260" y2="178" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="260" y1="206" x2="260" y2="250" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="260" y="312" font-size="10" fill="var(--chart-text)" text-anchor="middle">Setiap langkah tercatat: siapa, kapan, atas dasar apa.</text>
</g>
</svg>`;

export const aml23: V2Lesson = {
  slug: "aml23-operasional-ppatk",
  track: "Fraud & AML Analytics",
  module: "Anti Money Laundering",
  title: "AML23 — Operasional Pelaporan PPATK: dari Alert ke Laporan Resmi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Antrean 47 alert dan satu yang tidak boleh menunggu",
      prose: [
        "Senin pagi, Rudi membuka dashboard unit AML banknya: 47 alert menunggu triase. Kebanyakan rutin — transaksi tunai besar yang polanya normal, transfer reguler nasabah korporat. Tetapi satu alert berkedip merah: tiga setoran tunai Rp490 juta dalam dua hari dari rekening yang sama (total Rp1,47 miliar), masing-masing tepat di bawah pola yang biasa disaring. Structuring klasik.",
        "Twist-nya: alert itu bukan yang paling 'besar' nilainya — ada alert Rp2 miliar yang ternyata setoran rutin SPBU. Pelajaran operasionalnya: unit AML tidak bekerja berdasarkan nominal terbesar, melainkan berdasarkan POLA paling mencurigakan. Dan setelah pola itu terkonfirmasi, jam mulai berdetak: laporan harus disusun, direview, dan dikirim melalui sistem resmi — dengan jejak audit yang rapi.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan peran PPATK dan peta sistem pelaporannya (goAML, SIPENA, SIPENDAR); (2) membedakan jenis laporan LTKM, LTKT, dan laporan transfer dana; (3) menjalankan alur kerja unit AML dari alert hingga laporan; (4) menerapkan triase alert yang disiplin; (5) menjelaskan konsekuensi administratif keterlambatan pelaporan. Catatan sudut pandang: lesson ini ditulis dari sisi OPERASIONAL unit AML (yang menganalisis dan memutuskan), bukan dari sisi reporting (yang memformat dan mengirim) — keduanya bekerja berpasangan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "PPATK adalah Financial Intelligence Unit Indonesia — penerima dan penganalisis laporan transaksi dari seluruh pelapor. Kualitas laporan yang dikirim bankmu menentukan kualitas analisis intelijen keuangan nasional; laporan asal-asalan berarti intelijen yang buta. Menjelang MER FATF 2029, efektivitas rezim pelaporan Indonesia ikut dinilai.",
      },
      reference: "Operasional AML = pola dulu, nominal kemudian, laporan tepat waktu.",
    },
    {
      id: "ppatk-sistem",
      eyebrow: "Langkah 2 · Konsep",
      title: "PPATK dan peta sistem pelaporannya",
      prose: [
        "Si Pusat yang Melihat Semua Laporan. PPATK (Pusat Pelaporan dan Analisis Transaksi Keuangan) adalah lembaga intelijen keuangan Indonesia: ia menerima laporan transaksi dari bank, PFAK, dan pelapor lain, menganalisisnya, lalu meneruskan hasil analisis ke penegak hukum bila ada indikasi tindak pidana.",
        "Tiga nama sistem yang wajib dikenal pelapor. Pertama, goAML — sistem pelaporan transaksi yang dipakai PPATK (dikembangkan UNODC dan dipakai banyak FIU dunia); lewat sinilah laporan transaksi keuangan mencurigakan dan laporan transaksi lainnya disampaikan secara elektronik. Kedua, SIPENA — sistem terkait pendaftaran dan pelaporan pelapor. Ketiga, SIPENDAR — sistem pencarian/pendalaman data yang dipakai dalam proses analisis.",
        "Catatan kejujuran yang penting: detail teknis tiap sistem (format file, prosedur klik-per-klik, tenggat spesifik per jenis laporan) mengikuti ketentuan dan panduan resmi PPATK yang berlaku dan bisa berubah — lesson ini mengajarkan KERANGKA operasionalnya, bukan manual teknisnya. Analis yang baik tahu ke mana harus mencari panduan resmi terbaru, bukan menghafal tangkapan layar.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Laporan ke PPATK = laporan ke polisi.” Keliru alurnya: laporan masuk ke PPATK sebagai INTELIJEN keuangan; PPATK yang menganalisis dan memutuskan diteruskan ke penegak hukum atau tidak. Memahami peran ini penting — analis bank menulis laporan untuk analis PPATK, bukan dakwaan untuk jaksa.",
      },
      reference: "goAML untuk lapor, SIPENA untuk pelapor, SIPENDAR untuk dalami.",
    },
    {
      id: "jenis-laporan",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga keranjang laporan: LTKM, LTKT, transfer dana",
      prose: [
        "Si Tiga Keranjang yang Tidak Boleh Tertukar. Keranjang pertama: LTKM (Laporan Transaksi Keuangan Mencurigakan) — laporan atas transaksi yang patut diduga terkait tindak pidana, berdasarkan analisis, bukan sekadar nominal. Ini keranjang judgment analis; kualitasnya menentukan segalanya.",
        "Keranjang kedua: LTKT (Laporan Transaksi Keuangan Tunai) — laporan atas transaksi tunai yang memenuhi kriteria ketentuan; sifatnya lebih mekanis (ambang dan kriteria mengikuti ketentuan PPATK yang berlaku). Keranjang ketiga: laporan transfer dana dari dan ke luar negeri — arus lintas batas yang wajib terpantau.",
        "Kenapa pemisahan ini penting: tiap keranjang punya karakteristik tenggat dan kelengkapan berbeda. Mencampuradukkan — misalnya memperlakukan LTKM seperti LTKT yang mekanis — menghasilkan laporan mencurigakan yang dangkal: terkirim tepat waktu tetapi tidak berguna bagi analis PPATK.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“LTKM butuh bukti pidana dulu baru boleh dilaporkan.” Standarnya adalah KECURIGAAN yang beralasan hasil analisis — bukan pembuktian. Menunggu 'pasti' berarti memberi waktu dana kabur; analis PPATK-lah yang menilai lebih jauh.",
      },
      reference: "LTKM = judgment, LTKT = kriteria, transfer dana = arus lintas batas.",
    },
    {
      id: "alur-kerja",
      eyebrow: "Langkah 4 · Konsep",
      title: "Alur kerja unit AML: lima gerbang",
      prose: [
        "Si Ban Berjalan yang Tidak Boleh Macet. Gerbang 1 — alert masuk: dari sistem monitoring transaksi, laporan cabang, atau temuan manual. Gerbang 2 — triase: pilah cepat menjadi tutup (false positive jelas), eskalasi (butuh analisis mendalam), atau susun laporan (indikasi kuat). Gerbang 3 — analisis & dokumentasi: kumpulkan bukti, tulis narasi, cantumkan dasar kecurigaan.",
        "Gerbang 4 — kirim via sistem resmi (goAML/SIPENA sesuai jenisnya) dengan tenggat yang berlaku. Gerbang 5 — arsip & jejak audit: siapa memutuskan apa, kapan, atas dasar apa. Tanpa gerbang 5, seluruh pekerjaanmu tidak bisa dibuktikan saat pemeriksaan.",
        "Cara membaca figur: lima kotak berurutan dari kiri ke kanan lalu turun — alert, triase, susun laporan, kirim via sistem, arsip. Interpretasi: ini ban berjalan SATU arah; alert yang 'menunggu' di gerbang 2 adalah risiko tenggat. Unit AML yang sehat diukur dari umur antrean, bukan dari jumlah analisnya.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Triase adalah keterampilan yang paling diremehkan: analis junior ingin menganalisis SEMUA alert mendalam (lalu tenggelam), analis senior tahu mana yang bisa ditutup cepat dengan aman. Bedanya bukan keberanian, melainkan kriteria tertulis yang disepakati tim.",
      },
      figure: {
        svg: FIG_ALUR,
        alt: "Alur lima gerbang kerja unit AML: alert, triase, susun laporan, kirim via sistem, arsip.",
        caption: "Lima gerbang, satu arah: tidak ada alert yang boleh mengendap.",
      },
      reference: "Ban berjalan lima gerbang; ukur umur antrean.",
    },
    {
      id: "disiplin",
      eyebrow: "Langkah 5 · Konsep",
      title: "Disiplin tenggat dan konsekuensi administratif",
      prose: [
        "Si Jam yang Tidak Bisa dinegosiasi. Setiap jenis laporan punya tenggat penyampaian mengikuti ketentuan PPATK yang berlaku — lesson ini sengaja tidak menghafalkan angkanya karena ketentuan dapat berubah; yang harus dihafal adalah PRINSIPNYA: tenggat dihitung sejak peristiwa atau sejak kecurigaan teridentifikasi (tergantung jenis laporan), dan keterlambatan adalah temuan administratif tersendiri.",
        "Konsekuensi keterlambatan atau ketidaklengkapan bukan sekadar 'teguran': dalam rezim pengawasan, ia menjadi catatan kepatuhan institusi — memengaruhi profil risiko bank di mata pengawas dan, secara agregat, citra efektivitas rezim AML Indonesia. Satu laporan telat mungkin sepele; pola keterlambatan adalah temuan sistemik.",
        "Praktik disiplinnya: kalender tenggat yang terlihat tim, pemilik (owner) tiap laporan, dan review berjenjang sebelum kirim. Analis yang baik tidak mengandalkan ingatan untuk tenggat — ia mengandalkan sistem.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah",
        type: "pitfall",
        body: "“Yang penting laporannya bagus; telat sedikit tidak apa-apa.” Di dunia kepatuhan, KETEPATAN WAKTU adalah bagian dari kualitas. Laporan sempurna yang telat tetap temuan — dan analis PPATK tidak bisa menganalisis laporan yang belum sampai.",
      },
      reference: "Tenggat = bagian dari kualitas laporan.",
    },
    {
      id: "lab-triase",
      eyebrow: "Langkah 6 · Lab",
      title: "Triase antrean alert",
      prose: [
        "Enam alert tertanam (data sintetis). Terapkan aturan triase: skor prioritas = 3 poin bila pola structuring (3+ setoran tunai < Rp500 jt dalam 3 hari), 2 poin bila nilai ≥ Rp1 miliar, 1 poin bila lintas negara; tambah 2 poin bila nasabah berisiko tinggi. Disposisi: skor ≥ 4 → SUSUN LAPORAN; 2–3 → ESKALASI (analisis mendalam); < 2 → TUTUP.",
        "Hasil: A3 skor 5 → SUSUN LAPORAN; A1 skor 3 → ESKALASI; A6 skor 3 → ESKALASI; A2, A4, A5 → TUTUP. Perhatikan A4: nilainya Rp1,2 miliar tetapi polanya setoran rutin SPBU yang terdokumentasi → tetap TUTUP. Nominal besar tanpa pola mencurigakan bukan prioritas.",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor tiap alert sesuai aturan bobot" },
        { id: "t2", text: "Tentukan disposisi TUTUP / ESKALASI / SUSUN LAPORAN" },
        { id: "t3", text: "Cetak ringkasan + jumlah per disposisi" },
      ],
      expected: "A1: skor=3 disposisi=ESKALASI\nA2: skor=0 disposisi=TUTUP\nA3: skor=5 disposisi=SUSUN LAPORAN\nA4: skor=0 disposisi=TUTUP\nA5: skor=1 disposisi=TUTUP\nA6: skor=3 disposisi=ESKALASI\ntutup=3 eskalasi=2 lapor=1",
      note: {
        title: "💡 Intuisi",
        body: "A6 (lintas negara + nasabah berisiko tinggi, nilai kecil) mendapat ESKALASI — triase yang baik menangkap risiko KOMBINASI, bukan sekadar nominal. Inilah bedanya analis dengan filter spreadsheet.",
      },
      hints: [
        "structuring = setoran_tunai >= 3 dan tiap < 500_000_000 dalam 3 hari.",
        "skor = 3*structuring + 2*(nilai>=1M) + 1*lintas_negara + 2*risiko_tinggi.",
        "Ambang: >=4 lapor; 2-3 eskalasi; <2 tutup.",
      ],
      code: {
        starter: "# Antrean alert. JANGAN UBAH.\nalert = [\n    {\"id\": \"A1\", \"nilai\": 450_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": True, \"struct\": False},\n    {\"id\": \"A2\", \"nilai\": 80_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": False},\n    {\"id\": \"A3\", \"nilai\": 1_470_000_000, \"tunai\": 3, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": True},\n    {\"id\": \"A4\", \"nilai\": 1_200_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": False, \"rutin\": True},\n    {\"id\": \"A5\", \"nilai\": 300_000_000, \"tunai\": 0, \"lintas\": True, \"risiko_tinggi\": False, \"struct\": False},\n    {\"id\": \"A6\", \"nilai\": 150_000_000, \"tunai\": 0, \"lintas\": True, \"risiko_tinggi\": True, \"struct\": False},\n]\n\n# TULIS KODEMU: skor + disposisi\ntutup = 0\neskalasi = 0\nlapor = 0\nfor a in alert:\n    skor = \n    disposisi = \n    print(f\"{a['id']}: skor={skor} disposisi={disposisi}\")\nprint(f\"tutup={tutup} eskalasi={eskalasi} lapor={lapor}\")\n",
        lockLines: 10,
        solution: "# Antrean alert. JANGAN UBAH.\nalert = [\n    {\"id\": \"A1\", \"nilai\": 450_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": True, \"struct\": False},\n    {\"id\": \"A2\", \"nilai\": 80_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": False},\n    {\"id\": \"A3\", \"nilai\": 1_470_000_000, \"tunai\": 3, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": True},\n    {\"id\": \"A4\", \"nilai\": 1_200_000_000, \"tunai\": 1, \"lintas\": False, \"risiko_tinggi\": False, \"struct\": False, \"rutin\": True},\n    {\"id\": \"A5\", \"nilai\": 300_000_000, \"tunai\": 0, \"lintas\": True, \"risiko_tinggi\": False, \"struct\": False},\n    {\"id\": \"A6\", \"nilai\": 150_000_000, \"tunai\": 0, \"lintas\": True, \"risiko_tinggi\": True, \"struct\": False},\n]\n\n# TULIS KODEMU: skor + disposisi\ntutup = 0\neskalasi = 0\nlapor = 0\nfor a in alert:\n    skor = 0\n    if a[\"struct\"]:\n        skor += 3\n    if a[\"nilai\"] >= 1_000_000_000 and not a.get(\"rutin\"):\n        skor += 2\n    if a[\"lintas\"]:\n        skor += 1\n    if a[\"risiko_tinggi\"]:\n        skor += 2\n    if skor >= 4:\n        disposisi = \"SUSUN LAPORAN\"\n        lapor += 1\n    elif skor >= 2:\n        disposisi = \"ESKALASI\"\n        eskalasi += 1\n    else:\n        disposisi = \"TUTUP\"\n        tutup += 1\n    print(f\"{a['id']}: skor={skor} disposisi={disposisi}\")\nprint(f\"tutup={tutup} eskalasi={eskalasi} lapor={lapor}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "A3 SUSUN LAPORAN", msg: "Structuring = prioritas tertinggi.", pattern: "A3: skor=5 disposisi=SUSUN LAPORAN" },
          { kind: "stdout_matches", task: "t2", label: "A4 TUTUP", msg: "Nominal besar + pola rutin = bukan prioritas.", pattern: "A4: skor=0 disposisi=TUTUP" },
          { kind: "stdout_matches", task: "t2", label: "A6 ESKALASI", msg: "Kombinasi lintas negara + risiko tinggi.", pattern: "A6: skor=3 disposisi=ESKALASI" },
          { kind: "equal", task: "t3", name: "tutup", value: 3, label: "`tutup` = 3", msg: "A2, A4, A5." },
          { kind: "equal", task: "t3", name: "eskalasi", value: 2, label: "`eskalasi` = 2", msg: "A1 dan A6." },
          { kind: "equal", task: "t3", name: "lapor", value: 1, label: "`lapor` = 1", msg: "Hanya A3." },
        ],
      },
      reference: "Triase = pola × konteks, bukan nominal.",
    },
    {
      id: "lab-kelengkapan",
      eyebrow: "Langkah 7 · Lab",
      title: "Checklist kelengkapan berkas LTKM",
      prose: [
        "Satu draf LTKM untuk kasus A3 (structuring). Periksa kelengkapan 6 field wajib draf: identitas nasabah, rincian transaksi, pola yang diamati, dasar kecurigaan, dokumen pendukung, identitas analis. Hitung skor kelengkapan = terisi / 6 × 100%. Berkas di bawah 100% = KEMBALI (tidak boleh dikirim).",
        "Hasil: 5 dari 6 terisi (dokumen pendukung kosong) → 83,3% → KEMBALI. Pelajaran: analis yang baik menahan laporannya sendiri bila belum lengkap — mengirim berkas 83% berarti analis PPATK harus menebak 17% sisanya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung field terisi & skor kelengkapan" },
        { id: "t2", text: "Tentukan vonis KIRIM / KEMBALI + daftar yang kurang" },
      ],
      expected: "terisi=5 dari 6 (83.3%)\nkurang: dokumen_pendukung\nvonis=KEMBALI",
      hints: [
        "terisi = jumlah nilai yang tidak kosong.",
        "skor = terisi / 6 * 100; vonis KIRIM hanya bila 100.",
      ],
      code: {
        starter: "# Draf LTKM kasus A3. JANGAN UBAH.\ndraf = {\n    \"identitas_nasabah\": \"terisi\",\n    \"rincian_transaksi\": \"terisi\",\n    \"pola_diamati\": \"terisi\",\n    \"dasar_kecurigaan\": \"terisi\",\n    \"dokumen_pendukung\": \"\",\n    \"identitas_analis\": \"terisi\",\n}\n\n# TULIS KODEMU: skor kelengkapan + vonis\nterisi = \nskor = \nkurang = \nprint(f\"terisi={terisi} dari 6 ({skor:.1f}%)\")\nprint(\"kurang: \" + \", \".join(kurang))\nprint(\"vonis=\" + (\"KIRIM\" if skor == 100 else \"KEMBALI\"))\n",
        lockLines: 10,
        solution: "# Draf LTKM kasus A3. JANGAN UBAH.\ndraf = {\n    \"identitas_nasabah\": \"terisi\",\n    \"rincian_transaksi\": \"terisi\",\n    \"pola_diamati\": \"terisi\",\n    \"dasar_kecurigaan\": \"terisi\",\n    \"dokumen_pendukung\": \"\",\n    \"identitas_analis\": \"terisi\",\n}\n\n# TULIS KODEMU: skor kelengkapan + vonis\nterisi = sum(1 for v in draf.values() if v)\nskor = terisi / 6 * 100\nkurang = [k for k, v in draf.items() if not v]\nprint(f\"terisi={terisi} dari 6 ({skor:.1f}%)\")\nprint(\"kurang: \" + \", \".join(kurang))\nprint(\"vonis=\" + (\"KIRIM\" if skor == 100 else \"KEMBALI\"))\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Skor 83,3%", msg: "5 dari 6.", pattern: "terisi=5 dari 6 \\(83\\.3%\\)" },
          { kind: "stdout_matches", task: "t2", label: "Vonis KEMBALI", msg: "Di bawah 100% tidak boleh dikirim.", pattern: "vonis=KEMBALI" },
          { kind: "stdout_matches", task: "t2", label: "Dokumen kurang", msg: "Field yang kosong teridentifikasi.", pattern: "kurang: dokumen_pendukung" },
        ],
      },
      reference: "Berkas 100% atau kembali ke meja analis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: dari alert ke vonis",
      prose: [
        "Skenario 1 — Pola jelas + bukti kuat (structuring terdokumentasi) → SUSUN LAPORAN (LTKM). Jangan menunggu 'lebih yakin' — standar kecurigaan beralasan sudah terpenuhi.",
        "Skenario 2 — Sinyal campur (nilai besar tetapi pola rutin terdokumentasi) → TUTUP dengan catatan. Dokumentasikan alasan penutupan — 'tutup' tanpa catatan = tidak bisa diaudit.",
        "Skenario 3 — Sinyal lemah tetapi konteks berisiko (lintas negara + nasabah berisiko tinggi) → ESKALASI untuk analisis mendalam. Di sinilah analis senior dilibatkan.",
        "Skenario 4 — Berkas laporan belum 100% lengkap → KEMBALI ke analis. Tenggat tidak boleh dipakai sebagai alasan mengirim berkas setengah jadi; eskalasi keterlambatan ke atasan bila perlu.",
        "Aturan 10 detik: (1) polanya apa? (2) skor triase berapa? (3) berkasnya lengkap? Tiga jawaban menentukan disposisi — tanpa rapat.",
      ],
      tasks: [],
      reference: "Empat skenario, tiga pertanyaan, tanpa rapat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Malam tenggat: dua laporan, satu analis",
      prose: [
        "Jumat malam, Rudi memegang dua draf. Draf X: LTKM structuring Rp1,47 miliar — berkas 100% lengkap, tenggat Senin. Draf Y: LTKM transfer lintas negara mencurigakan — berkas 83% (dokumen pendukung belum masuk dari cabang), tenggat Senin juga. Atasan menekan: 'kirim dua-duanya malam ini, biar aman dari tenggat.'",
        "Pertanyaan: (1) Apa yang harus dilakukan Rudi? (2) Apa risiko mengikuti saran atasan? (3) Bagaimana melindungi diri secara profesional?",
        "Pembahasan: (1) Kirim Draf X malam ini; Draf Y DITAHAN — hubungi cabang untuk dokumen pendukung, siapkan pengiriman Senin pagi, dan bila dokumen tak kunjung datang, eskalasi tertulis ke atasan bahwa tenggat berisiko terlewat KARENA ketidaklengkapan berkas. (2) Mengirim berkas 83% = laporan tidak berguna + jejak bahwa analis mengirim yang diketahuinya belum lengkap — itu masalah integritas, bukan sekadar administrasi. (3) Semua komunikasi tertulis (email, bukan lisan): penolakan yang terdokumentasi melindungi analis bila atasan memaksa lewat jalur informal.",
      ],
      tasks: [],
      reference: "Tenggat tidak mengalahkan kelengkapan; semua tertulis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 5 dari 6.",
      ],
      tasks: [],
      summary: [
        "PPATK = FIU Indonesia: menerima laporan dari pelapor, menganalisis, meneruskan ke penegak hukum bila ada indikasi pidana; analis bank menulis untuk analis PPATK.",
        "Sistem: goAML untuk penyampaian laporan transaksi elektronik; SIPENA terkait pendaftaran/pelaporan pelapor; SIPENDAR untuk pencarian/pendalaman data — detail teknis mengikuti panduan resmi yang berlaku.",
        "Tiga keranjang: LTKM (kecurigaan beralasan hasil analisis), LTKT (transaksi tunai berkriteria), laporan transfer dana lintas batas.",
        "Alur lima gerbang: alert → triase → analisis & susun → kirim via sistem → arsip & jejak audit; kesehatan unit diukur dari umur antrean.",
        "Disiplin: tenggat adalah bagian kualitas; berkas < 100% = KEMBALI; standar LTKM adalah kecurigaan beralasan, bukan pembuktian.",
      ],
      quiz: [
        {
          q: "Peran PPATK dalam alur pelaporan:",
          options: [
            { text: "Menerima & menganalisis laporan sebagai intelijen keuangan, meneruskan ke penegak hukum bila ada indikasi", why: "Benar: itulah peran FIU.", correct: true },
            { text: "Menangkap pelaku pencucian uang langsung", why: "Salah: PPATK bukan aparat penegak hukum." },
            { text: "Menyetujui setiap transaksi besar sebelum diproses", why: "Salah: PPATK bekerja pasca-transaksi via laporan, bukan pre-approval." },
            { text: "Mengelola rekening bank nasabah", why: "Salah total: PPATK tidak menyentuh dana nasabah." },
          ],
        },
        {
          q: "Perbedaan LTKM dan LTKT:",
          options: [
            { text: "LTKM berbasis kecurigaan hasil analisis; LTKT berbasis kriteria transaksi tunai", why: "Benar: judgment vs kriteria.", correct: true },
            { text: "Keduanya identik, hanya beda nama", why: "Salah: dasar dan karakternya berbeda." },
            { text: "LTKM untuk tunai, LTKT untuk transfer", why: "Terbalik total." },
            { text: "LTKM tidak perlu dikirim tepat waktu", why: "Salah: keduanya terikat tenggat ketentuan yang berlaku." },
          ],
        },
        {
          q: "Alert Rp1,2 miliar ternyata setoran rutin SPBU yang terdokumentasi. Disposisi triase yang tepat:",
          options: [
            { text: "TUTUP dengan catatan alasan", why: "Benar: nominal besar + pola rutin terdokumentasi = bukan prioritas; catat alasannya.", correct: true },
            { text: "SUSUN LAPORAN karena nilainya besar", why: "Salah: triase berbasis pola, bukan nominal." },
            { text: "ESKALASI ke direksi", why: "Salah: tidak ada sinyal yang membenarkan eskalasi." },
            { text: "Abaikan tanpa catatan", why: "Salah: 'tutup' tanpa catatan tidak bisa diaudit." },
          ],
        },
        {
          q: "Draf LTKM 83% lengkap menjelang tenggat. Tindakan analis yang benar:",
          options: [
            { text: "TAHAN, lengkapi dulu; eskalasi tertulis bila tenggat terancam", why: "Benar: kelengkapan tidak bisa dikorbankan; risiko tenggat dikelola via eskalasi.", correct: true },
            { text: "Kirim apa adanya agar tidak telat", why: "Salah: berkas tak lengkap = laporan tak berguna + masalah integritas." },
            { text: "Ubah vonis menjadi bukan-mencurigakan agar tak perlu dikirim", why: "Salah dan berbahaya: memalsukan judgment analis." },
            { text: "Minta nasabah melengkapi dokumennya", why: "Salah: itu tipping-off — nasabah tidak boleh tahu ia sedang dianalisis." },
          ],
        },
        {
          q: "Standar untuk menyusun LTKM:",
          options: [
            { text: "Kecurigaan yang beralasan hasil analisis", why: "Benar: bukan pembuktian.", correct: true },
            { text: "Putusan pengadilan yang inkracht", why: "Salah: itu standar vonis, bukan standar lapor." },
            { text: "Nominal di atas Rp10 miliar", why: "Salah: LTKM tidak difilter nominal." },
            { text: "Persetujuan nasabah terlebih dahulu", why: "Salah: itu tipping-off." },
          ],
        },
        {
          q: "Fungsi gerbang ke-5 (arsip & jejak audit) dalam alur kerja:",
          options: [
            { text: "Membuktikan siapa memutuskan apa, kapan, atas dasar apa — saat pemeriksaan", why: "Benar: tanpa jejak, pekerjaan tidak bisa diverifikasi.", correct: true },
            { text: "Sekadar memenuhi syarat administrasi", why: "Meremehkan: ini bukti pertahanan analis dan institusi." },
            { text: "Menggantikan analisis yang lemah", why: "Salah: arsip tidak memperbaiki analisis buruk." },
            { text: "Hanya diperlukan bila ada kasus besar", why: "Salah: berlaku untuk setiap disposisi, termasuk penutupan." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Pekerjaan analis selesai saat laporan dikirim.” Belum: gerbang ke-5 (arsip & jejak audit) adalah bagian pekerjaan. Analis yang laporannya bagus tetapi arsipnya berantakan akan kalah saat pemeriksaan — karena pengawas menilai apa yang bisa dibuktikan, bukan apa yang diingat.",
      },
      hints: [
        "Uji cepat: sebutkan 5 gerbang + 3 keranjang laporan tanpa catatan.",
        "Ingat: pola > nominal; 100% atau kembali; tertulis, bukan lisan.",
      ],
      next: { label: "AML24 — Fraud Berwajah AI", href: "/v2/learn/aml24-ai-enabled-fraud" },
      reference: "Lapor yang benar, tepat waktu, dan bisa dibuktikan.",
    },
  ],
};
