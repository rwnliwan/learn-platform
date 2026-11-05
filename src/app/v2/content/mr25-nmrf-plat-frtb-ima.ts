import type { V2Lesson } from "../lib/types";

const FIG_TIPE = `<svg viewBox="0 0 520 300" role="img" aria-label="Alur klasifikasi faktor risiko: modellable, NMRF Type 1, NMRF Type 2.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">RFET: apakah faktor bisa dimodelkan?</text>
<rect x="180" y="50" width="160" height="44" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="260" y="77" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Faktor risiko</text>
<line x1="260" y1="94" x2="120" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="260" y1="94" x2="260" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="260" y1="94" x2="400" y2="130" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="30" y="130" width="180" height="60" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="120" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Modellable</text>
<text x="120" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">lolos RFET → masuk model ES</text>
<rect x="170" y="130" width="180" height="60" rx="8" fill="var(--c4)" opacity="0.3" stroke="var(--c4)" stroke-width="2"/>
<text x="260" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">NMRF Type 1</text>
<text x="260" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">data kualitatif OK → ES + add-on</text>
<rect x="310" y="130" width="180" height="60" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="400" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">NMRF Type 2</text>
<text x="400" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">gagal semua → SES penuh</text>
<text x="260" y="230" font-size="11" fill="var(--chart-text)" text-anchor="middle">Semakin kanan, semakin mahal modalnya.</text>
<text x="260" y="252" font-size="10" fill="var(--chart-text)" text-anchor="middle">Aturan baru: 16 harga terverifikasi (LH &gt; 20 hari) vs 24 sebelumnya.</text>
</g>
</svg>`;

export const mr25: V2Lesson = {
  slug: "mr25-nmrf-plat-frtb-ima",
  track: "Market Risk",
  module: "Regulasi & Modal",
  title: "MR25 — NMRF & PLAT: Ujian Tersulit FRTB-IMA",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Desk yang lolos backtest tapi gagal ujian",
      prose: [
        "Mei 2027. Desk komoditas sebuah bank Eropa merayakan: model Expected Shortfall (ES) mereka lolos backtest 250 hari dengan hanya 3 pelanggaran — jauh di bawah batas. Modal IMA mereka 35% lebih ringan dibanding pendekatan standar. Lalu surat dari supervisor datang: profit and loss attribution test (PLAT) desk mereka GAGAL dua kuartal berturut-turut. Konsekuensinya: desk itu dicabut dari IMA dan kembali ke pendekatan standar — modalnya melonjak Rp420 miliar dalam semalam.",
        "Twist-nya: backtest menguji apakah angkanya benar; PLAT menguji apakah modelnya jujur — apakah P&L yang diprediksi model risiko benar-benar menjelaskan P&L yang dicatat front office. Model bisa 'lolos angka' tetapi 'gagal jujur'. Dan di FRTB, kejujuran model adalah syarat mutlak untuk memakai model internal. Inilah ujian yang membuat banyak bank memilih tidak mengajukan IMA sama sekali.",
        "Setelah lesson ini kamu bisa: (1) membedakan risk factor yang modellable dari non-modellable (NMRF); (2) menjelaskan perbedaan NMRF Type 1 vs Type 2 menurut kerangka terbaru; (3) menghitung capital charge SES sederhana untuk NMRF; (4) menjelaskan mengapa PLAT adalah ujian tersulit dan bagaimana regulator memberi masa transisi. Konteks karir: pertanyaan 'jelaskan NMRF' adalah filter wawancara untuk peran market risk di bank besar — kandidat yang bisa menjelaskan Type 1 vs Type 2 terdengar seperti sudah membaca dokumen regulator, bukan sekadar textbook.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "FRTB-IMA bukan hak, melainkan izin: tiap trading desk harus lolos RFET (risk factor eligibility test), backtesting, dan PLAT untuk BOLEH memakai model internal. Satu ujian gagal = desk kembali ke pendekatan standar yang modalnya lebih mahal. Izin ini mahal dijaga — itulah harga memakai model sendiri.",
      },
      reference: "Backtest = angka benar. PLAT = model jujur. Keduanya wajib.",
    },
    {
      id: "nmrf",
      eyebrow: "Langkah 2 · Konsep",
      title: "NMRF: faktor yang tidak bisa dimodelkan",
      prose: [
        "Risk factor disebut modellable bila ada cukup data harga yang bisa diverifikasi — pasarnya cukup likuid sehingga model punya 'bahan bakar' data. Risk factor eligibility test (RFET) adalah uji datanya: sebuah faktor harus punya minimal 24 harga terverifikasi dalam 12 bulan (aturan lama), atau 16 harga bila liquidity horizon-nya lebih dari 20 hari (aturan baru 2026 — lihat langkah 3). Faktor yang gagal RFET = non-modellable risk factor (NMRF): model tidak boleh berpura-pura bisa memodelkannya.",
        "Contoh faktor yang biasanya NMRF: basis risiko eksotik (misal selisih dua indeks yang jarang diperdagangkan), saham lapis ketiga yang transaksinya sepi, volatilitas implisit opsi eksotik tenor panjang, dan spread kredit emiten kecil yang obligasinya jarang berpindah tangan. Ciri umumnya: datanya tidak cukup, bukan modelnya yang bodoh.",
        "NMRF tidak 'diabaikan' — ia dikenai capital charge sendiri bernama stressed expected shortfall (SES): ukuran kerugian ekstrem faktor itu pada periode stres, dihitung terpisah dari model ES utama. Filosofinya: yang tidak bisa dimodelkan dengan presisi harus dicadangkan dengan konservatif. Ketidakpastian data dibayar dengan modal.",
        "Tiga miskonsepsi. Satu: 'NMRF = faktor tidak penting.' Justru sebaliknya — NMRF sering muncul di posisi eksotik yang paling berisiko. Dua: 'Kalau data kurang, pakai proxy saja.' Proxy tanpa bukti kecukupan data = NMRF yang disamarkan; supervisor akan menanyakannya. Tiga: 'SES itu hukuman.' SES adalah harga ketidakpastian, bukan denda — bank yang memperbaiki data bisa 'mempromosikan' faktornya menjadi modellable.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ringkas kerangka FRTB (fondasi yang diasumsikan lesson ini): FRTB menggantikan VaR 10-hari dengan Expected Shortfall 97,5% sebagai ukuran utama; bank boleh memakai model internal (IMA) hanya untuk desk yang lolos tiga ujian — RFET, backtesting, PLAT; desk yang gagal memakai pendekatan standar (SA) yang lebih mahal modalnya. Lesson ini membahas dua ujian yang paling menyakitkan: RFET/NMRF dan PLAT.",
      },
      hints: [
        "Hafalkan: RFET = ujian DATA (cukup harga terverifikasi?), PLAT = ujian KEJUJURAN (model menjelaskan P&L?).",
        "Tanya untuk tiap faktor eksotik: 'berapa harga terverifikasi dalam 12 bulan terakhir?'",
      ],
      reference: "Gagal RFET = NMRF = SES charge. Data kurang = modal mahal.",
    },
    {
      id: "type1-type2",
      eyebrow: "Langkah 3 · Konsep",
      title: "Type 1 vs Type 2: terobosan 2026",
      prose: [
        "Juni 2026, Bank of England menerbitkan kertas konsultasi CP9/26 tentang penyesuaian IMA. Isi terpentingnya: NMRF dipecah dua. Type 1 = faktor yang memenuhi standar data KUALITATIF (ada proses pengumpulan harga yang kredibel, definisi jelas) tetapi gagal syarat KUANTITATIF (jumlah harga terverifikasi kurang). Type 2 = faktor yang gagal keduanya — datanya benar-benar tidak layak.",
        "Perlakuan modalnya berbeda — dan di sinilah insentifnya. Type 1 BOLEH masuk ke dalam model ES utama (sehingga ikut mendapat manfaat diversifikasi dengan faktor lain), tetapi tetap dikenai NMRF capital add-on dengan asumsi korelasi NOL antar faktor (konservatif: tidak ada diskon diversifikasi untuk add-on-nya). Type 2 tetap memakai perlakuan lama: SES penuh yang dihitung terpisah, tanpa manfaat diversifikasi sama sekali.",
        "Contoh konkret: faktor 'basis cross-currency 10 tahun IDR/USD' punya 10 harga terverifikasi dalam setahun (kurang dari 16 yang disyaratkan untuk liquidity horizon panjang) tetapi bank punya proses kuotasi dealer yang terdokumentasi → Type 1: masuk ES + add-on. Faktor 'volatilitas implisit opsi sawit eksotik' yang hanya punya 3 harga dan tanpa proses kuotasi → Type 2: SES penuh.",
        "Rumus modal IMA keseluruhan (disederhanakan): modal = IMCC + SES + DRC + RRAO. IMCC = internal models capital charge (berbasis ES untuk faktor modellable); SES = charge untuk NMRF; DRC = default risk charge (risiko gagal bayar); RRAO = residual risk add-on (risiko yang tidak tertangkap model). Interpretasi: IMA bukan satu angka model — ia tumpukan empat lapis, dan SES adalah 'pajak ketidakpastian data'.",
        "Dua miskonsepsi. Satu: 'Type 1 = bebas charge.' Salah — Type 1 tetap kena add-on; yang dihemat adalah ia boleh masuk ES sehingga tidak didobel-hukum. Dua: 'Asumsi korelasi nol itu hukuman.' Justru itu kompromi: regulator memberi jalan masuk ke ES tetapi menutup celah diversifikasi palsu untuk bagian yang datanya tipis.",
      ],
      figure: {
        svg: FIG_TIPE,
        alt: "Alur klasifikasi faktor risiko: modellable, NMRF Type 1, NMRF Type 2.",
        caption: "Cara membaca: tiga kotak = tiga hasil RFET, kiri ke kanan (modellable → NMRF Type 1 → NMRF Type 2). Interpretasi: semakin kanan semakin mahal modalnya — Type 2 kena SES penuh tanpa diversifikasi.",
      },
      formula: String.raw`\text{SES}_{T2} = \sqrt{\sum_i \text{SES}_i^2}`,
      formulaNote: "SES_i = stressed expected shortfall faktor NMRF Type 2 ke-i (Rp miliar); penjumlahan kuadrat = agregasi TANPA manfaat diversifikasi (ekuivalen asumsi korelasi sempurna antar faktor — paling konservatif). Contoh lab: SES 120, 80, 60 → akar(14400+6400+3600) = Rp156,2 miliar, jauh di bawah jumlah biasa Rp260 miliar tetapi di atas nol — 'diskon' yang diberikan hanya dari matematika kuadrat, bukan dari diversifikasi ekonomi. Interpretasi: angka ini bilang 'kami tidak tahu korelasinya, jadi kami asumsikan yang terburuk'.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKita punya 20 harga — cukup untuk modellable.\u201D Untuk liquidity horizon > 20 hari, ambang barunya 16 (bukan 24) — 20 CUKUP. Tetapi untuk faktor likuid (LH ≤ 20 hari), ambang tetap 24 — 20 TIDAK cukup. Selalu pasangkan jumlah harga dengan liquidity horizon faktornya; angka tanpa konteks horizon = jawaban setengah.",
      },
      hints: [
        "Uji cepat: faktor dengan 10 harga + proses kuotasi bagus = Type 1 atau 2? (Type 1.)",
        "Ingat insentifnya: perbaiki data kualitatif → faktor naik kelas dari Type 2 ke Type 1.",
      ],
      reference: "Type 1: kualitatif OK → ES + add-on. Type 2: gagal semua → SES penuh.",
    },
    {
      id: "plat",
      eyebrow: "Langkah 4 · Konsep",
      title: "PLAT: ketika model harus menjelaskan P&L",
      prose: [
        "Profit and loss attribution test (PLAT) membandingkan dua deret harian per desk: P&L aktual front office vs P&L hipotetis yang dihitung dari faktor risiko model. Dua uji statistik memeriksa apakah keduanya 'cukup mirip'. Bila model risiko memakai faktor yang benar, P&L hipotetis harus menjelaskan sebagian besar P&L aktual. Bila tidak mirip — misal front office mem-price memakai faktor yang tidak ada di model risiko — PLAT gagal.",
        "Inilah yang membuatnya tersulit: PLAT bukan soal statistik canggih, melainkan soal KESELARASAN ORGANISASI. Front office memakai model pricing sendiri (sering lebih kaya faktor); risk memakai model tersendiri. PLAT memaksa keduanya bicara dalam bahasa yang sama. Kegagalan PLAT biasanya bukan 'model salah hitung' melainkan 'dua tim memakai kamus berbeda' — masalah tata kelola, bukan matematika.",
        "Kabar baiknya: regulator memberi masa transisi. Di Inggris, CP9/26 mengusulkan PLAT hanya untuk monitoring (tidak mengikat modal) selama 3 tahun. Di Uni Eropa, Regulation 2026/1221 (berlaku 12 September 2026) memberi relief serupa: selama 1 Januari 2027–31 Desember 2029, hasil PLAT dipakai untuk monitoring TANPA konsekuensi modal langsung, dan bank boleh menghitung ES mingguan (bukan harian). Relief = waktu memperbaiki, bukan izin berhenti: bank tetap harus menjalankan tesnya dan menunjukkan rencana remediasi.",
        "Dua miskonsepsi. Satu: 'PLAT gagal = model jelek, buang.' Seringkali modelnya baik-baik saja — yang rusak adalah keselarasan data antara front office dan risk. Dua: 'Masa relief = PLAT tidak penting.' Relief berakhir 31 Desember 2029 (EU) — bank yang tidak memperbaiki selama relief akan terkena dampak penuh sekaligus. Supervisor menilai PROGRES selama masa transisi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "PLAT gagal dua periode = desk kehilangan izin IMA (kembali ke SA). Karena SA memakai bobot risiko standar yang konservatif, satu desk yang 'pindah paksa' bisa menambah modal ratusan miliar — seperti cerita pembuka. Inilah mengapa head of market risk memantau PLAT tiap pagi, bukan tiap kuartal.",
      },
      hints: [
        "Hafalkan tanggal: EU relief 1 Jan 2027 – 31 Des 2029; UK IMA penuh 1 Jan 2028.",
        "Tanya ke tim: 'apakah faktor pricing front office = faktor model risiko kita?'",
      ],
      reference: "PLAT = uji keselarasan FO vs risk. Relief = waktu, bukan pengampunan.",
    },
    {
      id: "tersulit",
      eyebrow: "Langkah 5 · Konsep",
      title: "Mengapa ini bagian tersulit IMA",
      prose: [
        "Tiga alasan. Pertama, RFET adalah ujian DATA, bukan ujian model — bank tidak bisa 'memperbaiki model' untuk lolos; yang harus diperbaiki adalah infrastruktur data harga (kuotasi dealer, feed pasar, arsip 12 bulan). Membangunnya butuh 1-2 tahun dan mahal. Kedua, PLAT adalah ujian ORGANISASI — butuh front office, risk, IT, dan validasi duduk semeja menyelaraskan definisi faktor. Ketiga, keduanya diuji PER DESK: bank dengan 30 desk harus lolos 30 kali; satu desk bermasalah tidak menular, tetapi juga tidak bisa 'ditutupi' desk lain.",
        "Implikasi ke bank: keputusan mengajukan IMA adalah keputusan EKONOMI per desk. Desk dengan faktor likuid (FX mayor, suku bunga) → IMA menghemat modal besar, layak diperjuangkan. Desk eksotik dengan banyak NMRF Type 2 → biaya data + SES bisa lebih mahal daripada langsung memakai SA. Bank yang cerdas tidak mengajukan semua desk — ia memilih medan pertempurannya.",
        "Konteks Indonesia: OJK belum mengadopsi FRTB-IMA penuh seperti Basel; bank Indonesia yang punya cabang/trading di yurisdiksi FRTB (Singapura, London, Frankfurt) tetap harus menghadapinya di sana. Dan arah regulasi global jelas — analis Indonesia yang memahami NMRF/PLAT hari ini sedang menyiapkan diri untuk 3-5 tahun ke depan, bukan sekadar teori jauh.",
        "Satu miskonsepsi terakhir: 'IMA selalu lebih murah daripada SA.' Tidak — untuk desk eksotik, SES + biaya kepatuhan bisa membuat IMA LEBIH MAHAL. IMA adalah alat presisi: tepat di tangan yang tepat, mahal di tangan yang salah.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKita ajukan semua desk ke IMA — kan model kita bagus.\u201D Kualitas model bukan penentu; kelengkapan DATA (RFET) dan KESELARASAN (PLAT) yang menentukan. Desk dengan model brilian tetapi data harga tipis akan gagal RFET sebelum modelnya sempat dinilai.",
      },
      hints: [
        "Aturan praktis: desk likuid → perjuangkan IMA; desk eksotik → hitung dulu biaya SES-nya.",
        "Untuk wawancara: sebutkan angka 16 vs 24 dan Type 1 vs Type 2 — pewawancara langsung tahu kamu update.",
      ],
      reference: "IMA = keputusan ekonomi per desk, bukan gengsi.",
    },
    {
      id: "lab-ses",
      eyebrow: "Langkah 6 · Lab",
      title: "Menghitung SES untuk NMRF Type 2",
      prose: [
        "Desk komoditas punya tiga faktor NMRF Type 2 dengan SES masing-masing Rp120, Rp80, dan Rp60 miliar. Hitung SES total = akar(jumlah kuadrat) — agregasi tanpa manfaat diversifikasi. Bandingkan dengan penjumlahan biasa untuk melihat 'pajak konservatisme'.",
        "Perhatikan: Rp156,2 miliar vs Rp260 miliar bila dijumlah biasa. Regulator memberi 'diskon matematika' (kuadrat) tetapi menolak 'diskon ekonomi' (diversifikasi) — karena untuk faktor yang datanya tidak layak, klaim diversifikasi tidak bisa dipercaya. Eksperimen: tambah faktor keempat SES 100 — berapa total barunya?",
      ],
      tasks: [
        { id: "t1", text: "Hitung SES total = akar(jumlah SES_i kuadrat)" },
        { id: "t2", text: "Cetak total + selisih vs penjumlahan biasa" },
      ],
      expected: "SES total Type 2: Rp156.2 miliar\nPenjumlahan biasa: Rp260.0 miliar\nPajak konservatisme: Rp103.8 miliar",
      note: {
        title: "💡 Intuisi",
        body: "Akar jumlah kuadrat SELALU lebih kecil dari jumlah biasa — tetapi untuk NMRF, ini bukan diversifikasi, melainkan 'kompromi ketidaktahuan'. Regulator bilang: kami tidak tahu korelasinya, jadi kami pakai rumus yang tidak butuh korelasi sama sekali.",
      },
      hints: [
        "total = math.sqrt(sum(x**2 for x in ses)).",
        "Format 1 desimal; pajak = jumlah biasa − total.",
      ],
      code: {
        starter: "import math\n\n# SES tiap faktor NMRF Type 2, Rp miliar. JANGAN UBAH.\nses = [120, 80, 60]\n\n# TULIS KODEMU: SES total + pajak konservatisme\ntotal = \nbiasa = sum(ses)\nprint(f\"SES total Type 2: Rp{total:.1f} miliar\")\nprint(f\"Penjumlahan biasa: Rp{biasa:.1f} miliar\")\nprint(f\"Pajak konservatisme: Rp{biasa-total:.1f} miliar\")\n",
        lockLines: 9,
        solution: "import math\n\n# SES tiap faktor NMRF Type 2, Rp miliar. JANGAN UBAH.\nses = [120, 80, 60]\n\n# TULIS KODEMU: SES total + pajak konservatisme\ntotal = math.sqrt(sum(x ** 2 for x in ses))\nbiasa = sum(ses)\nprint(f\"SES total Type 2: Rp{total:.1f} miliar\")\nprint(f\"Penjumlahan biasa: Rp{biasa:.1f} miliar\")\nprint(f\"Pajak konservatisme: Rp{biasa-total:.1f} miliar\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "SES total 156.2", msg: "akar(24400).", pattern: "SES total Type 2: Rp156.2 miliar" },
          { kind: "stdout_matches", task: "t2", label: "Pajak 103.8", msg: "260-156.2.", pattern: "Pajak konservatisme: Rp103.8 miliar" },
        ],
      },
      reference: "SES total = akar(jumlah kuadrat). Tanpa diversifikasi.",
    },
    {
      id: "lab-rfet",
      eyebrow: "Langkah 7 · Lab",
      title: "Klasifikasi RFET: modellable, Type 1, atau Type 2?",
      prose: [
        "Lima faktor dengan jumlah harga terverifikasi, liquidity horizon (hari), dan status data kualitatif. Terapkan aturan baru: ambang = 24 bila LH ≤ 20 hari, 16 bila LH > 20 hari. Lolos ambang → modellable; gagal ambang tetapi kualitatif OK → NMRF Type 1; gagal keduanya → NMRF Type 2.",
        "Hasil yang benar: EUR/USD spot (500 harga) → modellable; basis XCCY 10y (10 harga, LH 60, kualitatif OK) → Type 1; saham lapis-3 (3 harga, kualitatif gagal) → Type 2; sawit spot (200 harga) → modellable; vol implisit eksotik (18 harga, LH 60, kualitatif OK) → modellable (18 ≥ 16 — aturan baru menyelamatkannya!).",
        "Perhatikan faktor terakhir: di aturan lama (24) ia NMRF; di aturan baru (16) ia modellable. Satu perubahan angka regulator mengubah nasib modal sebuah desk — inilah mengapa analis risiko membaca kertas konsultasi, bukan hanya textbook.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan ambang per faktor (24 vs 16) lalu klasifikasikan" },
        { id: "t2", text: "Cetak 'nama: klasifikasi' untuk kelimanya" },
      ],
      expected: "EUR/USD spot: modellable\nBasis XCCY 10y: NMRF Type 1\nSaham lapis-3: NMRF Type 2\nSawit spot: modellable\nVol implisit eksotik: modellable",
      note: {
        title: "💡 Intuisi",
        body: "RFET adalah akuntansi data: hitung harga, bandingkan ambang, selesai. Tidak ada statistik canggih — dan justru itu yang membuatnya kejam: tidak ada argumen model yang bisa menyelamatkan data yang tidak ada.",
      },
      hints: [
        "ambang = 16 if lh > 20 else 24.",
        "Urutan cek: lolos ambang → modellable; elif kualitatif → Type 1; else Type 2.",
      ],
      code: {
        starter: "# (nama, jumlah harga, liquidity horizon hari, kualitatif OK). JANGAN UBAH.\nfaktor = [(\"EUR/USD spot\", 500, 10, True), (\"Basis XCCY 10y\", 10, 60, True),\n          (\"Saham lapis-3\", 3, 60, False), (\"Sawit spot\", 200, 10, True),\n          (\"Vol implisit eksotik\", 18, 60, True)]\n\n# TULIS KODEMU: klasifikasi tiap faktor\nfor nama, harga, lh, kual in faktor:\n    ambang = \n    if harga >= ambang:\n        hasil = \"modellable\"\n    elif kual:\n        hasil = \"NMRF Type 1\"\n    else:\n        hasil = \"NMRF Type 2\"\n    print(f\"{nama}: {hasil}\")\n",
        lockLines: 10,
        solution: "# (nama, jumlah harga, liquidity horizon hari, kualitatif OK). JANGAN UBAH.\nfaktor = [(\"EUR/USD spot\", 500, 10, True), (\"Basis XCCY 10y\", 10, 60, True),\n          (\"Saham lapis-3\", 3, 60, False), (\"Sawit spot\", 200, 10, True),\n          (\"Vol implisit eksotik\", 18, 60, True)]\n\n# TULIS KODEMU: klasifikasi tiap faktor\nfor nama, harga, lh, kual in faktor:\n    ambang = 16 if lh > 20 else 24\n    if harga >= ambang:\n        hasil = \"modellable\"\n    elif kual:\n        hasil = \"NMRF Type 1\"\n    else:\n        hasil = \"NMRF Type 2\"\n    print(f\"{nama}: {hasil}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "XCCY Type 1", msg: "10 < 16, kualitatif OK.", pattern: "Basis XCCY 10y: NMRF Type 1" },
          { kind: "stdout_matches", task: "t2", label: "Saham Type 2", msg: "Gagal ambang + kualitatif.", pattern: "Saham lapis-3: NMRF Type 2" },
          { kind: "stdout_matches", task: "t2", label: "Vol eksotik modellable", msg: "18 >= 16 (aturan baru).", pattern: "Vol implisit eksotik: modellable" },
        ],
      },
      reference: "Ambang 24 (LH≤20) / 16 (LH>20). Kualitatif OK = Type 1.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Desk baru: ajukan IMA atau tidak?",
      prose: [
        "Satu: petakan semua faktor desk dan jalankan RFET — bila >30% faktor adalah NMRF Type 2, hitung dulu SES-nya sebelum bermimpi hemat modal. Dua: uji keselarasan FO vs risk — bila model pricing front office memakai 50 faktor dan model risiko 20, PLAT hampir pasti bermasalah; selaraskan dulu. Tiga: manfaatkan masa transisi — jalankan PLAT sebagai monitoring, catat progres remediasi tiap kuartal; supervisor menilai trajektori, bukan janji.",
        "Empat: prioritaskan perbaikan data kualitatif — faktor Type 2 yang datanya diperbaiki naik menjadi Type 1 (masuk ES + add-on, bukan SES penuh). Lima: untuk desk eksotik yang SES-nya raksasa, pertimbangkan SA langsung — IMA yang mahal lebih buruk daripada SA yang jujur.",
        "Aturan praktis 10 detik: hitung harga → selaraskan kamus → monitor PLAT → perbaiki data → putuskan per desk. IMA adalah maraton kepatuhan, bukan sprint pemodelan.",
        "Satu jebakan: 'kita lolos RFET tahun ini, aman selamanya.' RFET dan PLAT adalah ujian BERKELANJUTAN — data bisa menipis (pasar sepi), model bisa menyimpang. Izin IMA seperti SIM: bisa dicabut kapan saja bila melanggar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank-bank besar kini punya 'NMRF committee' — forum lintas FO, risk, dan data yang tiap kuartal meninjau faktor mana yang bisa 'dipromosikan' dari Type 2 ke Type 1 atau ke modellable. Setiap promosi = penghematan modal nyata. Ini pekerjaan analis risiko yang paling langsung terlihat di laporan keuangan.",
      },
      reference: "RFET → selaraskan → monitor → perbaiki → putuskan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Desk komoditas di persimpangan",
      prose: [
        "Desk komoditas bank 'Nusantara Global' (cabang London) punya 12 faktor risiko. RFET: 7 modellable, 3 NMRF Type 1 (SES add-on total Rp90 miliar), 2 NMRF Type 2 (SES Rp120 miliar dan Rp80 miliar → total akar(14400+6400) = Rp144,2 miliar). PLAT: gagal 1 kuartal karena model pricing FO memakai kurva forward yang berbeda dari model risiko. Modal SA untuk desk ini: Rp1,1 triliun; modal IMA (bila lolos): Rp780 miliar.",
        "Pertanyaan: (a) Berapa total 'pajak NMRF' desk ini? (b) Layak tetap mengejar IMA? Pembahasan: (a) Rp90 + Rp144,2 = Rp234,2 miliar — sekitar 30% dari modal IMA. (b) Ya, layak: hemat Rp320 miliar (1.100 − 780) masih jauh di atas biaya remediasi PLAT (menyelaraskan kurva forward — pekerjaan 2-3 bulan tim kuant). Keputusan cerdas: perbaiki keselarasan kurva SEKARANG (masa monitoring 3 tahun), promosikan 1 faktor Type 2 ke Type 1 dengan memperbaiki proses kuotasi, dan pantau RFET tiap kuartal. Pelajaran: angka-angka ini mengubah 'ujian tersulit' dari momok menjadi spreadsheet keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan leverage-nya: 2-3 bulan kerja tim kuant (biaya puluhan juta) menyelamatkan Rp320 miliar modal. Inilah ekonomi IMA — dan inilah mengapa analis yang paham NMRF/PLAT dibayar mahal: mereka menerjemahkan regulasi menjadi rupiah.",
      },
      reference: "Pajak NMRF 234,2 dari 780. Tetap layak: hemat 320.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 4 dari 5.",
      ],
      summary: [
        "NMRF = faktor yang gagal RFET (data harga terverifikasi tidak cukup); ia tidak diabaikan melainkan dikenai stressed expected shortfall (SES) — ketidakpastian data dibayar dengan modal.",
        "Type 1 (CP9/26, Juni 2026): lolos standar kualitatif tetapi gagal kuantitatif → boleh masuk model ES + NMRF add-on berkorelasi nol; Type 2: gagal keduanya → SES penuh tanpa diversifikasi.",
        "Ambang RFET baru: 24 harga (liquidity horizon ≤ 20 hari) atau 16 harga (LH > 20 hari); SES Type 2 diagregasi akar(jumlah kuadrat) — contoh lab Rp156,2 miliar dari 120/80/60.",
        "PLAT menguji keselarasan P&L front office vs model risiko per desk — gagal = kembali ke SA; EU (Reg 2026/1221) dan UK memberi masa monitoring 3 tahun tanpa konsekuensi modal langsung.",
        "IMA adalah keputusan ekonomi per desk: desk likuid layak diperjuangkan, desk eksotik dengan SES raksasa bisa lebih murah di SA; perbaiki data kualitatif untuk 'mempromosikan' faktor.",
      ],
      quiz: [
        {
          q: "Faktor dengan 10 harga terverifikasi (LH 60 hari) dan proses kuotasi dealer terdokumentasi adalah:",
          options: [
            { text: "NMRF Type 1 — gagal kuantitatif (10 < 16) tetapi kualitatif OK", why: "Benar: Type 1 = kualitatif lolos, kuantitatif gagal.", correct: true },
            { text: "Modellable — karena proses kuotasinya bagus", why: "Proses bagus tidak menggantikan ambang kuantitatif 16." },
            { text: "NMRF Type 2 — karena harganya kurang", why: "Type 2 butuh gagal KEDUANYA; kualitatifnya lolos." },
            { text: "Bukan NMRF — basis XCCY selalu modellable", why: "Tidak ada faktor yang 'selalu' modellable; RFET yang menentukan." },
          ],
        },
        {
          q: "Keuntungan utama NMRF Type 1 dibanding Type 2:",
          options: [
            { text: "Boleh masuk model ES (ikut diversifikasi) + hanya kena add-on", why: "Benar: itulah insentif inti pembedaan 2026.", correct: true },
            { text: "Bebas dari semua capital charge", why: "Tetap kena NMRF add-on; tidak ada yang gratis." },
            { text: "Tidak perlu RFET lagi", why: "RFET tetap dijalankan berkala; status bisa berubah." },
            { text: "Otomatis menjadi modellable tahun depan", why: "Promosi butuh perbaikan data nyata, bukan waktu." },
          ],
        },
        {
          q: "Mengapa PLAT disebut ujian tersulit IMA?",
          options: [
            { text: "Ia menguji keselarasan organisasi (FO vs risk), bukan sekadar matematika", why: "Benar: kegagalan tipikal = kamus faktor berbeda, masalah tata kelola.", correct: true },
            { text: "Statistiknya lebih sulit dari backtesting", why: "Statistiknya sederhana; sulitnya di penyelarasan data." },
            { text: "Hanya berlaku untuk desk komoditas", why: "PLAT berlaku untuk SEMUA desk IMA." },
            { text: "Tidak ada masa transisi sama sekali", why: "Ada: 3 tahun monitoring non-binding (EU & UK)." },
          ],
        },
        {
          q: "Selama masa relief EU (2026/1221), bank WAJIB:",
          options: [
            { text: "Tetap menjalankan PLAT untuk monitoring + menunjukkan remediasi", why: "Benar: relief = waktu memperbaiki, bukan izin berhenti.", correct: true },
            { text: "Berhenti menghitung ES sampai 2030", why: "ES tetap dihitung (boleh mingguan, bukan harian)." },
            { text: "Menutup semua desk IMA", why: "Relief justru menjaga IMA tetap berjalan." },
            { text: "Mengabaikan NMRF Type 2", why: "SES untuk NMRF tetap berlaku penuh." },
          ],
        },
        {
          q: "Desk eksotik dengan SES Rp500 miliar dan hemat IMA-vs-SA hanya Rp200 miliar sebaiknya:",
          options: [
            { text: "Mempertimbangkan SA langsung — IMA lebih mahal di sini", why: "Benar: IMA adalah keputusan ekonomi per desk.", correct: true },
            { text: "Tetap memaksakan IMA demi gengsi", why: "Gengsi tidak membayar modal Rp300 miliar." },
            { text: "Menyembunyikan faktor NMRF dari laporan", why: "Itu pelanggaran regulasi, bukan strategi." },
            { text: "Menunggu relief berakhir baru memutuskan", why: "Relief soal PLAT; SES NMRF tetap berjalan." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CType 1 vs Type 2 hanya label administratif.\u201D Label ini menentukan ratusan miliar modal: Type 1 masuk ES (murah), Type 2 SES penuh (mahal). Di meja komite modal, label = uang.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa 18 harga bisa modellable di 2026 tetapi NMRF di 2024.",
        "Ingat tanggal: EU relief berakhir 31 Desember 2029.",
      ],
      reference: "NMRF = pajak data. PLAT = pajak kejujuran.",
    },
  ],
};
