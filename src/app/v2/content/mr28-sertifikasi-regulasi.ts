import type { V2Lesson } from "../lib/types";

const FIG_JALUR = `<svg viewBox=\"0 0 560 400\" role=\"img\" aria-label=\"Peta jalur sertifikasi berdasarkan peran kerja.\">
<g font-family=\"var(--font-ui)\">
<text x=\"14\" y=\"24\" font-size=\"13\" fill=\"var(--chart-text)\" font-weight=\"bold\">Peta jalur: peran → sertifikasi yang relevan</text>
<text x=\"14\" y=\"44\" font-size=\"10\" fill=\"var(--chart-text)\">Sertifikasi mengikuti KURSI, bukan gengsi. Baca dari kiri (peranmu) ke kanan.</text>
<rect x=\"20\" y=\"70\" width=\"170\" height=\"44\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.22\" stroke=\"var(--c1)\" stroke-width=\"1.5\"/>
<text x=\"105\" y=\"88\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">Dealer / analis sekuritas</text>
<text x=\"105\" y=\"103\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">eksekusi &amp; riset efek</text>
<rect x=\"20\" y=\"130\" width=\"170\" height=\"44\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.22\" stroke=\"var(--c2)\" stroke-width=\"1.5\"/>
<text x=\"105\" y=\"148\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">Market risk analyst bank</text>
<text x=\"105\" y=\"163\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">ukur &amp; pantau risiko pasar</text>
<rect x=\"20\" y=\"190\" width=\"170\" height=\"44\" rx=\"8\" fill=\"var(--c4)\" opacity=\"0.22\" stroke=\"var(--c4)\" stroke-width=\"1.5\"/>
<text x=\"105\" y=\"208\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">Manajer investasi</text>
<text x=\"105\" y=\"223\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">kelola reksa dana</text>
<rect x=\"20\" y=\"250\" width=\"170\" height=\"44\" rx=\"8\" fill=\"var(--c1)\" opacity=\"0.22\" stroke=\"var(--c1)\" stroke-width=\"1.5\"/>
<text x=\"105\" y=\"268\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">Analis investasi / portofolio</text>
<text x=\"105\" y=\"283\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">riset &amp; valuasi</text>
<rect x=\"20\" y=\"310\" width=\"170\" height=\"44\" rx=\"8\" fill=\"var(--c2)\" opacity=\"0.22\" stroke=\"var(--c2)\" stroke-width=\"1.5\"/>
<text x=\"105\" y=\"328\" font-size=\"11\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">Risk manager korporat</text>
<text x=\"105\" y=\"343\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">lindung nilai &amp; treasury</text>
<line x1=\"190\" y1=\"92\" x2=\"330\" y2=\"92\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"190\" y1=\"152\" x2=\"330\" y2=\"182\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"190\" y1=\"212\" x2=\"330\" y2=\"242\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"190\" y1=\"272\" x2=\"330\" y2=\"272\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<line x1=\"190\" y1=\"332\" x2=\"330\" y2=\"302\" stroke=\"var(--chart-text)\" stroke-width=\"1.5\"/>
<rect x=\"330\" y=\"70\" width=\"210\" height=\"44\" rx=\"8\" fill=\"none\" stroke=\"var(--c1)\" stroke-width=\"2\"/>
<text x=\"435\" y=\"88\" font-size=\"12\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">WPPE</text>
<text x=\"435\" y=\"103\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">lisensi praktik pasar modal RI</text>
<rect x=\"330\" y=\"160\" width=\"210\" height=\"44\" rx=\"8\" fill=\"none\" stroke=\"var(--c2)\" stroke-width=\"2\"/>
<text x=\"435\" y=\"178\" font-size=\"12\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">FRM</text>
<text x=\"435\" y=\"193\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">sertifikasi global manajemen risiko</text>
<rect x=\"330\" y=\"220\" width=\"210\" height=\"44\" rx=\"8\" fill=\"none\" stroke=\"var(--c4)\" stroke-width=\"2\"/>
<text x=\"435\" y=\"238\" font-size=\"12\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">WMI</text>
<text x=\"435\" y=\"253\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">lisensi manajer investasi RI</text>
<rect x=\"330\" y=\"280\" width=\"210\" height=\"44\" rx=\"8\" fill=\"none\" stroke=\"var(--c1)\" stroke-width=\"2\" stroke-dasharray=\"6,4\"/>
<text x=\"435\" y=\"298\" font-size=\"12\" fill=\"var(--chart-text)\" text-anchor=\"middle\" font-weight=\"bold\">CFA</text>
<text x=\"435\" y=\"313\" font-size=\"10\" fill=\"var(--chart-text)\" text-anchor=\"middle\">program analis investasi global</text>
<text x=\"14\" y=\"380\" font-size=\"10\" fill=\"var(--chart-text)\">Garis putus-putus = jalur panjang; garis penuh = jalur langsung ke kursimu.</text>
</g>
</svg>`;

export const mr28: V2Lesson = {
  slug: "mr28-sertifikasi-regulasi",
  track: "Market Risk",
  module: "Karier & Regulasi",
  title: "MR28 — Jalur Sertifikasi & Regulasi Market Risk Indonesia: Pilih Senjata Sesuai Kursi",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua analis, dua jalur, dan kursi yang menentukan",
      prose: [
        "Awal 2024, dua analis muda sama-sama diterima kerja di Jakarta. Sari masuk sebagai market risk analyst di bank devisa; Dimas sebagai equity dealer di perusahaan sekuritas. Sari langsung mendaftar program sertifikasi global manajemen risiko — belajar setiap malam selama setahun. Dimas 'hanya' mengurus lisensi praktik pasar modal Indonesia — selesai dalam hitungan bulan, lalu langsung duduk di meja dealing hari pertama.",
        "Enam bulan kemudian, ironinya terlihat: Dimas sudah mengeksekusi order nasabah dan digaji penuh sebagai dealer berlisensi; Sari masih belajar — sertifikasinya belum selesai, tetapi setiap diskusi VaR dan stress test di divisinya kini ia ikuti dengan bahasa yang tepat. Tidak ada yang 'salah pilih'. Dimas butuh LISENSI untuk boleh bekerja (tanpa itu, ia tidak boleh menyentuh order nasabah); Sari butuh KEDALAMAN untuk dipercaya (tanpa itu, ia hanya 'penjaga spreadsheet').",
        "Twist-nya: pertanyaan yang benar bukan 'sertifikasi mana yang paling bergengsi?' melainkan 'kursi apa yang kududuki?'. Lisensi menjawab 'bolehkah saya bekerja di sini' — sertifikasi menjawab 'seberapa dalam saya memahami pekerjaan ini'. Lesson ini memetakan FRM, CFA, dan WPPE secara konseptual (tanpa angka biaya/jadwal — yang berubah tiap tahun), plus kerangka regulasi market risk Indonesia: siapa OJK, siapa BI, dan laporan apa yang menyentuh pekerjaanmu sehari-hari.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di industri keuangan, kredensial adalah 'bahasa kepercayaan'. Lisensi = izin praktik yang diwajibkan regulator; sertifikasi = bukti kompetensi yang dihargai pasar. Keduanya penting — tetapi urutannya ditentukan kursimu, bukan egomu.",
      },
      reference: "Lisensi = boleh bekerja; sertifikasi = dipercaya. Urutan mengikuti kursi.",
    },
    {
      id: "banding",
      eyebrow: "Langkah 2 · Konsep",
      title: "FRM vs CFA vs WPPE: tiga senjata untuk tiga medan",
      prose: [
        "FRM (Financial Risk Manager) adalah sertifikasi global yang fokus pada manajemen risiko: pengukuran risiko pasar (VaR, ES, stress test), risiko kredit, risiko operasional, dan tata kelola risiko. Medan tempurnya: divisi risk management bank, asuransi, dan manajer aset. Ia menjawab pertanyaan 'seberapa besar risiko yang kita ambil dan apakah itu sepadan?' — persis bahasa sehari-hari analis market risk.",
        "CFA (Chartered Financial Analyst) adalah program global analis investasi: valuasi, analisis laporan keuangan, manajemen portofolio, dan etika profesi. Medan tempurnya: riset ekuitas, fund management, dan investment banking. Ia menjawab 'berapa nilai wajar aset ini dan bagaimana menyusun portofolio?' — bahasa analis investasi, bukan analis risiko. Banyak risk manager mengambil CFA juga, tetapi jalurnya lebih panjang dan fokusnya berbeda.",
        "WPPE (Wakil Perantara Pedagang Efek) adalah LISENSI praktik di Indonesia: izin bagi individu yang bekerja pada perusahaan efek untuk melakukan kegiatan perantara perdagangan efek — misal dealer yang mengeksekusi order atau analis yang memberi rekomendasi di sekuritas. Bedanya dengan dua di atas: WPPE bukan soal gengsi, melainkan soal KEBOLEHAN — fungsi tertentu di perusahaan efek wajib diisi orang berlisensi. Ada kerabatnya: WPEE untuk penjamin emisi, dan WMI (Wakil Manajer Investasi) untuk yang mengelola reksa dana di manajer investasi.",
        "Cara memilih yang jujur: (1) Apa kursimu 2-3 tahun ke depan? Dealer/analis sekuritas → WPPE dulu (wajib), lalu perdalam dengan FRM/CFA. Risk analyst bank → FRM (relevan langsung). Fund manager/analis investasi → CFA (atau WMI bila di manajer investasi Indonesia). (2) Lisensi yang diwajibkan regulator selalu didahulukan — ia adalah tiket masuk, bukan pilihan. (3) Jangan kejar dua-duanya sekaligus di tahun pertama kerja; selesaikan yang membuka pintumu dulu.",
        "🚨 Mitos: 'CFA lebih bergengsi, jadi ambil CFA saja untuk semua karier keuangan.' Yang benar: CFA bergengsi DI MEDANNYA (investasi). Untuk risk manager bank, FRM lebih relevan — dan untuk dealer sekuritas Indonesia, tanpa WPPE kamu bahkan tidak boleh duduk di kursinya. Gengsi tanpa relevansi = mahal dan tidak dipakai.",
        "🚨 Mitos: 'Lisensi WPPE sekali urus, selesai selamanya.' Yang benar: lisensi adalah amanah berkelanjutan — ada kewajiban menjaga kompetensi dan kepatuhan etika selama memegangnya. Regulator bisa mencabut lisensi bila pemegangnya melanggar. Lisensi = tanggung jawab, bukan sekadar kartu.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Uji cepat: tulis deskripsi pekerjaan impianmu 3 tahun ke depan dalam satu kalimat. Lingkari kata kerjanya: 'mengeksekusi order' → WPPE; 'mengukur risiko' → FRM; 'menilai perusahaan' → CFA; 'mengelola reksa dana' → WMI. Kata kerja tidak berbohong tentang senjata yang kamu butuhkan.",
      },
      reference: "WPPE = izin praktik efek; FRM = kedalaman risiko; CFA = kedalaman investasi; WMI = kelola reksa dana.",
    },
    {
      id: "regulator",
      eyebrow: "Langkah 3 · Konsep",
      title: "OJK, BI, dan laporan yang menyentuh mejamu",
      prose: [
        "Dua institusi mengawasi dunia tempat analis market risk bekerja. OJK (Otoritas Jasa Keuangan) mengawasi industri jasa keuangan: bank, pasar modal, dan industri keuangan non-bank. Bagi analis risiko, OJK adalah penerima laporan — bank menyampaikan laporan berkala terkait profil risiko dan kecukupan modal; perusahaan efek melaporkan kegiatan usahanya. Angka-angka yang kamu hitung setiap pagi (eksposur, utilisasi limit, hasil stress test) pada akhirnya mengalir — dalam bentuk agregat — ke laporan-laporan ini.",
        "BI (Bank Indonesia) adalah bank sentral: menjaga stabilitas nilai rupiah, menetapkan dan melaksanakan kebijakan moneter, serta mengatur dan menjaga kelancaran sistem pembayaran. Bagi analis market risk, BI relevan dari sisi pasar: operasi moneter BI menggerakkan suku bunga dan likuiditas (risiko suku bunga di bukumu), dan ketentuan devisa BI memengaruhi aktivitas FX bank. Ketika BI mengubah suku bunga acuan, kurva imbal hasil yang kamu pakai untuk valuasi ikut bergeser keesokan paginya.",
        "Implikasi praktisnya: (1) Laporanmu bukan sekadar 'untuk komite' — ia adalah bahan baku rantai pelaporan yang berakhir di regulator. Angka yang tidak bisa diaudit di mejamu = angka yang tidak bisa dipertahankan di depan pengawas. (2) Perubahan kebijakan (suku bunga BI, ketentuan OJK) adalah 'gempa input' — skenario stress test-mu harus mencakupnya. (3) Kepatuhan bukan departemen lain; analis yang memahami KENAPA laporan itu ada akan menulis angka yang lebih hati-hati.",
        "🚨 Mitos: 'Regulasi itu urusan compliance, bukan urusan analis.' Yang benar: analis yang tidak paham untuk apa laporannya dipakai akan mengoptimalkan kecepatan, bukan kualitas — dan kualitaslaporan adalah tepat apa yang diperiksa pengawas saat datang.",
      ],
      tasks: [],
      formula: String.raw`\text{Kualitas laporan} = \text{Akurasi} \times \text{Ketepatan waktu} \times \text{Keterjejakan (audit trail)}`,
      formulaNote: "Bukan rumus matematika, melainkan rumus kerja: Akurasi = angka benar; Ketepatan waktu = sampai sebelum dibutuhkan; Keterjejakan = setiap angka bisa ditelusur ke sumber dan kodenya. Ketiganya PERKALIAN — bila satu nol (misal tidak teraudit), kualitasnya nol meski dua lainnya sempurna. Contoh: laporan akurat dan tepat waktu tetapi tidak bisa dijelaskan sumbernya = ditolak pengawas.",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biasakan menulis setiap laporan dengan asumsi 'pengawas akan membaca ini besok'. Bukan karena mereka selalu membaca — melainkan karena standar itu membuat laporanmu tahan uji siapa pun yang membacanya.",
      },
      reference: "OJK = pengawas & penerima laporan; BI = penggerak pasar via kebijakan moneter.",
    },
    {
      id: "figure-jalur",
      eyebrow: "Langkah 4 · Visual",
      title: "Membaca peta jalur sertifikasi",
      prose: [
        "Diagram di bawah memetakan lima peran umum ke sertifikasi yang paling relevan. Perhatikan: panah dari 'Dealer / analis sekuritas' menuju WPPE adalah garis penuh — jalur langsung dan wajib. Panah menuju CFA adalah garis putus-putus — jalur panjang yang opsional, untuk pendalaman karier, bukan tiket masuk.",
        "Perhatikan juga bahwa satu peran bisa punya dua panah (market risk analyst → FRM langsung; CFA sebagai pendalaman). Peta ini bukan 'satu peran satu sertifikasi', melainkan 'satu peran, satu prioritas, plus opsi pendalaman'.",
      ],
      figure: {
        svg: FIG_JALUR,
        alt: "Diagram alur peran kerja menuju sertifikasi FRM, CFA, WPPE, WMI.",
        caption: "Cara membaca: baca dari kiri (peran) ke kanan (sertifikasi); garis penuh = jalur langsung/wajib, garis putus-putus = pendalaman opsional jangka panjang. Interpretasi: dealer sekuritas wajib WPPE dulu (tiket masuk); market risk analyst bank prioritas FRM; analis investasi prioritas CFA; pengelola reksa dana butuh WMI. Sertifikasi mengikuti kursi — bukan sebaliknya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membaca diagram sebagai 'semakin banyak sertifikasi semakin baik'. Tumpukan sertifikasi tanpa pengalaman relevan justru menimbulkan pertanyaan di wawancara: 'kapan kamu sempat bekerja?' Satu yang relevan + pengalaman > tiga yang hanya di atas kertas.",
      },
      reference: "Prioritas mengikuti kursi; pendalaman mengikuti ambisi.",
    },
    {
      id: "lab-peta",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin rekomendasi jalur sertifikasi",
      prose: [
        "Tulis fungsi rekomendasi: diberikan data peran (nama, deskripsi peran, tugas), kembalikan sertifikasi prioritas — 'WPPE' untuk yang bekerja di perusahaan efek/sekuritas, 'WMI' untuk manajer investasi/reksa dana, 'FRM' untuk peran risiko (bank/korporat). Aturannya sederhana dan deterministik: cek kata kunci di deskripsi peran. Di dunia nyata aturannya lebih bernuansa — tetapi mesin sederhana yang konsisten > ingatan yang kabur.",
        "Lima peran sudah disediakan (terkunci). Tugasmu: implementasikan fungsi rekomendasikan, hitung berapa peran yang direkomendasikan ke tiap jalur, dan cetak peta peran → sertifikasi. Eksplorasi: tambahkan peran keenam versimu sendiri (misal 'Treasury analyst di BUMN') — jalur apa yang diberikan mesinmu, dan apakah kamu setuju?",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan fungsi rekomendasikan(peran) → WPPE/WMI/FRM" },
        { id: "t2", text: "Hitung jumlah per jalur & cetak peta peran → sertifikasi" },
      ],
      expected: "Dimas (Equity dealer di perusahaan efek) -> WPPE\nRina (Market risk analyst di bank devisa) -> FRM\nSinta (Manajer investasi reksa dana) -> WMI\nBagas (Risk manager di korporat manufaktur) -> FRM\nDewi (Analis riset di sekuritas) -> WPPE\nWPPE=2 WMI=1 FRM=2",
      note: {
        title: "💡 Intuisi",
        type: "pitfall",
        body: "Perhatikan urutan pengecekan di solusi: sekuritas dicek DULU sebelum kata 'risiko'. Kenapa? Karena 'analis riset di sekuritas' mengandung kata 'sekuritas' — lisensi (tiket masuk) mengalahkan kedalaman (pilihan). Urutan if = urutan prioritas kebijakan.",
      },
      hints: [
        "Gabungkan peran + tugas menjadi satu teks lower-case, lalu cek kata kunci.",
        "Urutan: 'perusahaan efek'/'sekuritas' → WPPE; 'manajer investasi'/'reksa dana' → WMI; sisanya → FRM.",
        "Hitung dengan sum(1 for p in peran if rekomendasikan(p) == 'WPPE').",
      ],
      code: {
        starter: "# Data peran — JANGAN UBAH.\nperan = [\n    {\"nama\": \"Dimas\", \"peran\": \"Equity dealer di perusahaan efek\", \"tugas\": \"eksekusi order saham nasabah\"},\n    {\"nama\": \"Rina\", \"peran\": \"Market risk analyst di bank devisa\", \"tugas\": \"hitung VaR dan pantau limit\"},\n    {\"nama\": \"Sinta\", \"peran\": \"Manajer investasi reksa dana\", \"tugas\": \"kelola portofolio\"},\n    {\"nama\": \"Bagas\", \"peran\": \"Risk manager di korporat manufaktur\", \"tugas\": \"lindung nilai FX dan komoditas\"},\n    {\"nama\": \"Dewi\", \"peran\": \"Analis riset di sekuritas\", \"tugas\": \"tulis rekomendasi saham\"},\n]\n\n# TULIS KODEMU: fungsi rekomendasi + hitung per jalur + cetak peta\ndef rekomendasikan(p):\n    t = \n    if :\n        return \"WPPE\"\n    if :\n        return \"WMI\"\n    return \"FRM\"\n\nn_wppe = \nn_wmi = \nn_frm = \nfor p in peran:\n    print(f\"{p['nama']} ({p['peran']}) -> {rekomendasikan(p)}\")\nprint(f\"WPPE={n_wppe} WMI={n_wmi} FRM={n_frm}\")\n",
        lockLines: 8,
        solution: "# Data peran — JANGAN UBAH.\nperan = [\n    {\"nama\": \"Dimas\", \"peran\": \"Equity dealer di perusahaan efek\", \"tugas\": \"eksekusi order saham nasabah\"},\n    {\"nama\": \"Rina\", \"peran\": \"Market risk analyst di bank devisa\", \"tugas\": \"hitung VaR dan pantau limit\"},\n    {\"nama\": \"Sinta\", \"peran\": \"Manajer investasi reksa dana\", \"tugas\": \"kelola portofolio\"},\n    {\"nama\": \"Bagas\", \"peran\": \"Risk manager di korporat manufaktur\", \"tugas\": \"lindung nilai FX dan komoditas\"},\n    {\"nama\": \"Dewi\", \"peran\": \"Analis riset di sekuritas\", \"tugas\": \"tulis rekomendasi saham\"},\n]\n\n# TULIS KODEMU: fungsi rekomendasi + hitung per jalur + cetak peta\ndef rekomendasikan(p):\n    t = (p[\"peran\"] + \" \" + p[\"tugas\"]).lower()\n    if \"perusahaan efek\" in t or \"sekuritas\" in t:\n        return \"WPPE\"\n    if \"manajer investasi\" in t or \"reksa dana\" in t:\n        return \"WMI\"\n    return \"FRM\"\n\nn_wppe = sum(1 for p in peran if rekomendasikan(p) == \"WPPE\")\nn_wmi = sum(1 for p in peran if rekomendasikan(p) == \"WMI\")\nn_frm = sum(1 for p in peran if rekomendasikan(p) == \"FRM\")\nfor p in peran:\n    print(f\"{p['nama']} ({p['peran']}) -> {rekomendasikan(p)}\")\nprint(f\"WPPE={n_wppe} WMI={n_wmi} FRM={n_frm}\")\n",
        checks: [
          { kind: "equal", task: "t2", name: "n_wppe", value: 2, label: "2 peran → WPPE", msg: "Dimas dan Dewi bekerja di sekuritas/perusahaan efek." },
          { kind: "equal", task: "t2", name: "n_wmi", value: 1, label: "1 peran → WMI", msg: "Sinta di manajer investasi reksa dana." },
          { kind: "equal", task: "t2", name: "n_frm", value: 2, label: "2 peran → FRM", msg: "Rina dan Bagas di peran risiko." },
          { kind: "stdout_matches", task: "t2", label: "Baris Dimas tercetak", msg: "Format: 'Dimas (Equity dealer di perusahaan efek) -> WPPE'.", pattern: "Dimas.*-> WPPE" },
          { kind: "uses", task: "t1", label: "Memakai fungsi rekomendasikan", msg: "Logika klasifikasi di dalam fungsi rekomendasikan.", token: "rekomendasikan" },
        ],
      },
      reference: "Aturan sederhana yang konsisten > ingatan yang kabur.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Lima persimpangan karier: keputusan 10 detik",
      prose: [
        "Skenario satu — diterima sebagai dealer di sekuritas, belum punya lisensi apa pun: URUS WPPE DULU. Tanpa lisensi kamu tidak boleh menyentuh order nasabah — ini bukan pilihan karier, ini syarat kerja. FRM/CFA bisa menyusul tahun kedua.",
        "Skenario dua — market risk analyst di bank, 2 tahun pengalaman, ingin naik ke senior: AMBIL FRM. Ia berbicara persis bahasa pekerjaanmu (VaR, ES, stress test, tata kelola) dan menjadi pembeda saat promosi. CFA terlalu jauh dari kursimu saat ini.",
        "Skenario tiga — analis riset ekuitas yang ingin pindah ke fund management: AMBIL CFA. Medan tempurnya valuasi dan portofolio — CFA adalah bahasa ibunya. Bila targetnya manajer investasi Indonesia, pelajari juga jalur WMI.",
        "Skenario empat — risk manager korporat (non-bank) yang mengelola lindung nilai FX: FRM RELEVAN, tetapi prioritaskan pengalaman dulu. Korporat menilai rekam jejak hedging lebih dari sertifikat; FRM menjadi nilai tambah, bukan tiket masuk.",
        "Skenario lima — fresh graduate, belum tahu mau ke mana: JANGAN ambil apa pun dulu — magang/kerja 6-12 bulan. Sertifikasi tanpa konteks kerja = menghafal tanpa memahami; setelah tahu kursimu, pilih sesuai peta. Pengecualian: bila sudah pasti masuk sekuritas, WPPE bisa diurus paralel.",
        "Aturan praktis 10 detik: (1) apakah kursiku mewajibkan lisensi? ya → urus lisensi; (2) kata kerja utama pekerjaanku apa? ukur risiko → FRM, nilai aset → CFA; (3) apakah aku sudah bekerja ≥ 1 tahun di bidangnya? belum → kerja dulu, sertifikasi menyusul.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengambil sertifikasi tersulit yang terlihat di LinkedIn ('biar keren') lalu berhenti di tengah karena tidak relevan dengan pekerjaan sehari-hari. Sertifikasi yang tidak dipakai = biaya hangus + waktu hangus. Relevansi > gengsi, selalu.",
      },
      reference: "Lisensi dulu bila wajib; FRM untuk risiko; CFA untuk investasi; kerja dulu bila belum tahu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rina vs Dimas, satu tahun kemudian",
      prose: [
        "Satu tahun berlalu. Rina (market risk analyst bank) menyelesaikan separuh materi FRM; ia kini memimpin review metodologi VaR di divisinya — promosi ke senior analyst tinggal menunggu waktu. Dimas (dealer sekuritas) sudah setahun mengeksekusi order dengan lisensi WPPE; ia kini mempertimbangkan FRM untuk memahami risiko posisi nasabahnya lebih dalam. Pertanyaan: (a) apakah keputusan awal mereka tepat? (b) apa langkah berikutnya yang masuk akal untuk masing-masing? (c) pelajaran umumnya apa?",
        "Pembahasan: (a) Ya — keduanya mengikuti kursinya: Dimas butuh tiket masuk (WPPE) dan mendapatkannya cepat; Rina butuh kedalaman (FRM) dan membangunnya bertahap. (b) Dimas: FRM sebagai pendalaman (ia kini melihat risiko dari sisi dealer — modal yang berharga). Rina: selesaikan FRM, lalu pertimbangkan CFA Level I bila ingin meluas ke sisi investasi — tetapi hanya bila pekerjaannya memang bergeser ke sana. (c) Pelajaran: urutan yang benar adalah lisensi-wajib → sertifikasi-relevan → pendalaman-opsional. Setiap tahap didanai oleh tahap sebelumnya (pekerjaan membiayai belajar berikutnya). Karier keuangan adalah maraton bertahap, bukan sprint sertifikasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan pola pikirnya: setiap keputusan kredensial diuji dengan 'apakah ini membuka pintu BERIKUTNYA?' — bukan 'apakah ini terlihat bagus di CV?'. Risk manager yang baik mengelola kariernya seperti mengelola portofolio: alokasi sumber daya (waktu, uang) ke return tertinggi.",
      },
      reference: "Lisensi → relevansi → pendalaman; setiap tahap didanai tahap sebelumnya.",
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
        "Tiga senjata: WPPE = lisensi praktik pasar modal Indonesia (tiket masuk fungsi di perusahaan efek); FRM = sertifikasi global manajemen risiko (bahasa analis risiko); CFA = program analis investasi global (bahasa valuasi & portofolio); plus WMI untuk pengelola reksa dana.",
        "Aturan pilih: lisensi yang diwajibkan regulator selalu didahulukan; selebihnya ikuti kata kerja pekerjaanmu (ukur risiko → FRM, nilai aset → CFA); relevansi > gengsi.",
        "OJK mengawasi industri jasa keuangan dan menerima laporan; BI menjaga stabilitas rupiah via kebijakan moneter — keduanya memengaruhi pekerjaan analis (laporanmu mengalir ke regulator; kebijakan BI menggerakkan input valuasimu).",
        "Kualitas laporan = akurasi × ketepatan waktu × keterjejakan — satu nol, semua nol.",
        "Peta karier: lisensi-wajib → sertifikasi-relevan → pendalaman-opsional; kerja 6-12 bulan dulu bila belum tahu arah.",
      ],
      quiz: [
        {
          q: "Dimas diterima sebagai equity dealer di perusahaan efek. Langkah pertama yang tepat?",
          options: [
            { text: "Mengurus WPPE — tanpa lisensi ia tidak boleh menyentuh order nasabah", why: "Benar: WPPE adalah tiket masuk, bukan pilihan; ia syarat kerja.", correct: true },
            { text: "Langsung mengambil CFA karena paling bergengsi", why: "Gengsi tanpa relevansi: CFA tidak memberinya izin praktik sebagai dealer." },
            { text: "Menunggu 2 tahun pengalaman dulu baru mengurus apa pun", why: "Menunggu = tidak bisa bekerja sebagai dealer selama itu; lisensi justru harus diurus di awal." },
            { text: "Mengambil FRM dan CFA sekaligus agar CV tebal", why: "Dua program berat sekaligus tanpa konteks kerja = risiko berhenti di tengah." },
          ],
        },
        {
          q: "Rina, market risk analyst bank devisa, ingin naik ke senior. Sertifikasi yang paling relevan?",
          options: [
            { text: "FRM — bahasanya persis pekerjaan risiko (VaR, ES, stress test, tata kelola)", why: "Benar: relevansi langsung ke kursi + menjadi pembeda saat promosi.", correct: true },
            { text: "WPPE — karena semua orang keuangan butuh lisensi", why: "WPPE untuk fungsi di perusahaan efek; Rina di bank tidak membutuhkannya." },
            { text: "CFA — karena lebih terkenal", why: "Terkenal di medannya (investasi); untuk risk analyst bank, FRM lebih tepat sasaran." },
            { text: "Tidak perlu sertifikasi, pengalaman cukup", why: "Pengalaman penting, tetapi sertifikasi yang relevan mempercepat kepercayaan atasan & komite." },
          ],
        },
        {
          q: "Apa beda MENDASAR lisensi (WPPE/WMI) dengan sertifikasi (FRM/CFA)?",
          options: [
            { text: "Lisensi = izin praktik yang diwajibkan regulator; sertifikasi = bukti kompetensi yang dihargai pasar", why: "Benar: lisensi menjawab 'bolehkah saya bekerja', sertifikasi menjawab 'seberapa dalam pemahaman saya'.", correct: true },
            { text: "Lisensi lebih sulit didapat daripada sertifikasi", why: "Umumnya terbalik: sertifikasi global menuntut studi jauh lebih panjang." },
            { text: "Sertifikasi diwajibkan undang-undang, lisensi tidak", why: "Terbalik: lisensilah yang diwajibkan untuk fungsi tertentu." },
            { text: "Tidak ada bedanya, hanya istilah pemasaran", why: "Bedanya fundamental: satu soal kebolehan hukum, satu soal kedalaman." },
          ],
        },
        {
          q: "Bank Indonesia (BI) paling relevan bagi analis market risk melalui…",
          options: [
            { text: "Kebijakan moneter & operasi pasar yang menggerakkan suku bunga, likuiditas, dan nilai tukar", why: "Benar: keputusan suku bunga BI menggeser kurva imbal hasil — input valuasi analis keesokan harinya.", correct: true },
            { text: "Penerbitan lisensi WPPE untuk dealer", why: "Itu ranah pengaturan pasar modal (OJK), bukan BI." },
            { text: "Penetapan gaji analis bank", why: "BI tidak menetapkan gaji; itu kebijakan internal bank." },
            { text: "Pemeriksaan laporan keuangan tahunan bank", why: "Pengawasan bank adalah ranah OJK." },
          ],
        },
        {
          q: "Fresh graduate yang belum tahu ingin ke mana. Nasihat yang paling jujur?",
          options: [
            { text: "Kerja/magang 6-12 bulan dulu; pilih sertifikasi setelah tahu kursinya", why: "Benar: sertifikasi tanpa konteks = menghafal tanpa memahami; peta baru berguna setelah tahu medan.", correct: true },
            { text: "Ambil CFA segera karena paling bergengsi", why: "Gengsi tanpa arah = risiko berhenti di tengah dan biaya hangus." },
            { text: "Ambil ketiganya sekaligus selagi muda dan punya waktu", why: "Waktu muda bukan alasan membakarnya untuk tiga program berat tanpa arah." },
            { text: "Tidak usah sertifikasi apa pun, pengalaman saja cukup selamanya", why: "Terlalu jauh: di titik tertentu, kredensial yang relevan mempercepat lompatan karier." },
          ],
        },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira 'selesai sertifikasi = selesai belajar'. FRM/CFA/WPPE adalah fondasi, bukan atap — regulasi berubah, produk baru muncul, model berevolusi. Yang membedakan senior dari junior bukan jumlah sertifikat, melainkan kebiasaan belajar 10 tahun setelahnya.",
      },
      hints: [
        "Uji cepat: untuk KURSIMU saat ini (atau yang kamu incar), apa kata kerjanya — dan sertifikasi apa yang mengikutinya?",
        "Ingat rumus kerja: kualitas laporan = akurasi × ketepatan waktu × keterjejakan.",
      ],
      next: { label: "MR29 — XVA: CVA, FVA, dan Biaya Tersembunyi Derivatif", href: "/v2/learn/mr29-xva" },
      reference: "Pilih senjata sesuai kursi; lisensi dulu, relevansi selalu.",
    },
  ],
};
