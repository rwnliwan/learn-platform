#!/usr/bin/env python3
"""Bioinformatics lessons BI13-BI18."""
from render import qa_scan

TRACK = "Bioinformatics"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ BI13
BI13 = {
    "slug": "bi13-epigenomik",
    "code": "BI13",
    "track": TRACK,
    "cover_title": "ChIP-seq &amp; Metilasi:<br />Epigenomik: Di Atas Genom",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Kembar Identik, Nasib Beda"),
        ("lapisan", "Lapisan Epigenetik: Metilasi, Histon, Aksesibilitas"),
        ("chipseq", "ChIP-seq &amp; ATAC-seq: Memetakan Regulasi"),
        ("metilasi", "Analisis Metilasi &amp; DMR"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Panggil Peak ChIP-seq"),
        ("lab2", "\U0001f52c Lab 2: Uji DMR Sederhana"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan tiga lapisan epigenetik: <strong>metilasi DNA, modifikasi histon, aksesibilitas kromatin</strong>.",
        "Menjelaskan prinsip <strong>ChIP-seq & ATAC-seq</strong> dan analisis peak calling.",
        "Menjelaskan analisis <strong>metilasi (beta value)</strong> dan deteksi <strong>DMR</strong>.",
        "Menghubungkan epigenomik dengan <strong>regulasi gen & penyakit</strong>.",
    ],
    "story_title": "Cerita Pembuka: Kembar Identik, Nasib Beda",
    "story": [
        "<p>Kembar identik: DNA 100% sama. Di usia 50, satu kena diabetes, satunya tidak. Sekuensing genom keduanya: tidak ada perbedaan menjelaskan. Metilasi DNA: <strong>pola berbeda di ratusan gen metabolik</strong> \u2014 pengalaman hidup (diet, stres, rokok) menulis catatan di atas genom.</p>",
        "<p>Epigenetika adalah \u201ctinta stabilo\u201d genom: tanpa mengubah huruf DNA, ia menandai bagian mana yang dibaca. Lesson ini memetakan tinta itu \u2014 teknologi ChIP-seq/ATAC-seq/metilasi \u2014 dan cara menganalisisnya. Fondasi untuk memahami regulasi gen di BI9/BI11 dan integrasi multi-omics (BI15).</p>",
    ],
    "konsep": [
        {
            "id": "lapisan",
            "title": "Lapisan Epigenetik \u2014 Si Tinta Stabilo",
            "definisi": "<strong>Metilasi DNA</strong> (5mC di CpG): umumnya menekan (promoter termetilasi = gen mati). <strong>Modifikasi histon</strong>: H3K4me3 = promoter aktif; H3K27ac = enhancer aktif; H3K27me3 = represif. <strong>Aksesibilitas</strong>: kromatin terbuka = mesin transkripsi bisa masuk.",
            "kepribadian": "Genom itu seperti partitur musik yang sama untuk semua sel; epigenetika adalah coretan konduktor: \u201cbagian ini keras (aktif), ini diam (represif)\u201d. Sel hati dan sel otak memainkan lagu berbeda dari partitur yang sama.",
            "kapan": "Regulasi gen, diferensiasi, kanker (metilasi abnormal), imprinting, penuaan.",
            "worked": (
                "\U0001f4d0 Contoh: membaca tanda histon",
                "<p>Gen X: promoter bertanda <strong>H3K4me3 + H3K27ac</strong> \u2192 aktif ditranskripsi.<br />"
                "Gen Y: <strong>H3K27me3</strong> \u2192 dibungkam (Polycomb).<br />"
                "Gen Z: <strong>H3K4me3 + H3K27me3</strong> (bivalen!) \u2192 \u201csiap tapi ditahan\u201d \u2014 khas gen perkembangan di sel punca.<br />"
                "Kanker: promoter gen supresor tumor <strong>hipermetilasi</strong> \u2192 gen mati tanpa mutasi DNA!</p>",
            ),
            "chart": {
                "var": "bi13MarksData",
                "data": [{"x": ["H3K4me3", "H3K27ac", "H3K27me3", "H3K9me3", "DNA metilasi"], "y": [1, 1, -1, -1, -1], "type": "bar", "marker": {"color": ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#e8a838"]}, "text": ["Aktif", "Aktif", "Represif", "Represif", "Represif"], "textposition": "outside"}],
                "title": "Kode Histon: Tanda Aktif vs Represif",
                "layout": {"xaxis": {"title": "Modifikasi"}, "yaxis": {"title": "", "showticklabels": False, "range": [-1.5, 1.5]}, "showlegend": False},
                "cara": "Batang biru ke atas = tanda aktif; kuning ke bawah = represif. Ini \u201ckamus\u201d dasar membaca ChIP-seq.",
                "interpretasi": "Kombinasi tanda = status regulasi. H3K4me3+H3K27ac di promoter = gen menyala. H3K27me3 = dibungkam. Bivalen (keduanya) = poised. Kanker sering membajak sistem ini: mematikan supresor tumor via metilasi, bukan mutasi.",
            },
        },
        {
            "id": "chipseq",
            "title": "ChIP-seq &amp; ATAC-seq \u2014 Si Pemeta Regulasi",
            "definisi": "<strong>ChIP-seq</strong>: antibodi menarik protein-DNA (mis. faktor transkripsi) \u2192 sekuensing \u2192 <strong>peak</strong> = lokasi ikatan. <strong>ATAC-seq</strong>: transposase menandai kromatin TERBUKA \u2192 peta aksesibilitas (lebih mudah, tanpa antibodi).",
            "kepribadian": "ChIP-seq itu seperti memotret \u201csiapa sedang memegang DNA di mana\u201d: antibodi adalah borgol yang menangkap faktor transkripsi beserta DNA yang dipegangnya. ATAC-seq lebih sederhana: ia menandai pintu-pintu yang terbuka, tanpa perlu tahu siapa yang lewat.",
            "kapan": "ChIP-seq: lokasi ikatan TF / tanda histon spesifik. ATAC-seq: peta regulasi umum, sampel sedikit, single-cell (scATAC).",
            "worked": (
                "\U0001f4d0 Contoh: peak calling",
                "<p>ChIP-seq faktor transkripsi p53: 20 juta read.<br />"
                "<strong>MACS2</strong> membandingkan dengan kontrol input: di promoter gen CDKN1A, 500 read menumpuk vs 10 di kontrol \u2192 <strong>peak</strong> (q<0,01).<br />"
                "Motif di bawah peak: cocok motif p53 \u2713 \u2014 validasi biologis.<br />"
                "<strong>ATAC-seq</strong> pada sampel sama: peak terbuka di promoter yang sama \u2192 konsisten: p53 mengikat kromatin terbuka.<br />"
                "QC: FRiP (fraction reads in peaks) >1% ChIP-TF; replikat konkordan (IDR).</p>",
            ),
            "chart": {
                "var": "bi13PeakData",
                "data": [{"x": list(range(100)), "y": [5+ (80 if 40 < i < 60 else 0) + (30 if 70 < i < 75 else 0) for i in range(100)], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "ChIP"},
                        {"x": list(range(100)), "y": [4]*100, "type": "scatter", "mode": "lines", "line": {"dash": "dash", "color": "#e8a838"}, "name": "Kontrol"}],
                "title": "Peak ChIP-seq vs Kontrol (ilustratif)",
                "layout": {"xaxis": {"title": "Posisi genom"}, "yaxis": {"title": "Kedalaman read"}, "showlegend": True},
                "cara": "Biru = sinyal ChIP, garis kuning = latar kontrol. Puncak jauh di atas kontrol = peak.",
                "interpretasi": "Peak besar (posisi 40\u201360) = ikatan kuat; peak kecil (70\u201375) = lemah tapi nyata bila lolos q-value. Peak calling = uji statistik tiap jendela vs kontrol, bukan sekadar \u201clihat yang tinggi\u201d. Selalu pakai kontrol input!",
            },
        },
        {
            "id": "metilasi",
            "title": "Analisis Metilasi &amp; DMR \u2014 Si Termometer",
            "definisi": "<strong>Bisulfite sequencing</strong>: mengubah C tak termetilasi \u2192 U (dibaca T); C termetilasi tetap C \u2192 baca metilasi per basa. <strong>Beta value</strong> = M/(M+U) (0\u20131). <strong>DMR</strong>: region dengan metilasi beda antar kondisi.",
            "rumus": r"\beta = \frac{M}{M + U + \alpha}",
            "simbol": [
                (r"M, U", "intensitas metilasi & tak termetilasi"),
                (r"\beta", "proporsi metilasi (0\u20131)"),
                (r"\alpha", "offset kecil (stabilisasi)"),
            ],
            "interpretasi": "Beta = termometer metilasi per CpG: 0 = tak termetilasi, 1 = penuh. Tapi beta heteroskedastik (variansi tergantung mean) \u2192 untuk statistik pakai M-value = log2(beta/(1-beta)).",
            "worked": (
                "\U0001f4d0 Contoh: DMR kanker",
                "<p>Promoter MLH1 (gen repair DNA): beta normal = 0,1; tumor = 0,85.<br />"
                "Delta-beta = 0,75 \u2192 <strong>hipermetilasi</strong> \u2192 gen dibungkam \u2192 kanker kolorektal (tanpa mutasi!).<br />"
                "Uji: limma pada M-value + FDR \u2192 DMR.<br />"
                "<strong>Array 850K</strong> (EPIC): murah untuk ratusan sampel; <strong>WGBS</strong>: seluruh genom, mahal. Pilih sesuai skala (mirip RNA-seq vs microarray dulu).</p>",
            ),
            "kepribadian": "Bisulfite itu seperti tes lakmus kimia: ia mengubah huruf yang tidak termetilasi sehingga terlihat beda. Beta value adalah termometernya \u2014 tapi ingat termometer ini tidak linear untuk statistik (pakai M-value).",
            "kapan": "Kanker (biomarker!), imprinting, penuaan (epigenetic clock), paparan lingkungan.",
        },
    ],
    "myths": [
        ("Epigenetik = gen diwariskan berubah",
         "Epigenetik tidak mengubah urutan DNA \u2014 ia mengubah PEMBACAAN. Dan sebagian besar tanda epigenetik di-reset tiap generasi (dengan pengecualian imprinting). \u201cTrauma diwariskan via epigenetik\u201d pada manusia = klaim yang sangat dilebih-lebihkan media."),
        ("Metilasi selalu mematikan gen",
         "Metilasi PROMOTER umumnya represif, tapi metilasi BADAN GEN justru berkorelasi dengan transkripsi aktif! Konteks (di mana) menentukan arti. Jangan generalisasi satu arah."),
        ("Peak ChIP-seq = bukti fungsi",
         "Ikatan \u2260 regulasi. Faktor transkripsi mengikat ribuan tempat; hanya sebagian yang fungsional. Butuh bukti lanjutan: motif, perubahan ekspresi saat knockout, reporter assay."),
    ],
    "tips": [
        "ChIP-seq <strong>tanpa kontrol input</strong> = tidak valid. Kontrol membedakan ikatan sejati dari bias (GC, keterbacaan). Reviewer pertama yang ditanya: \u201cmana kontrolnya?\u201d",
        "Untuk metilasi: analisis dengan <strong>M-value</strong>, presentasikan dengan <strong>beta</strong>. Statistik butuh homoskedastisitas; manusia butuh interpretabilitas.",
        "Integrasikan dengan <strong>ekspresi</strong> (BI9/BI11): DMR di promoter + gen turun = cerita regulasi lengkap. Satu lapisan = setengah cerita.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Panggil Peak ChIP-seq (Uji Poisson)",
            "intro": "Diberikan coverage per jendela (ChIP vs kontrol), uji tiap jendela dengan Poisson dan koreksi sederhana. Rasakan logika MACS2 versi mini.",
            "hint": "Ubah lambda latar 5 \u2192 15. Berapa peak hilang? Itulah kenapa estimasi latar lokal (MACS2) penting \u2014 latar tidak seragam di genom.",
            "code": (
                "import math\n"
                "latar = 5  # rata-rata read kontrol per jendela\n"
                "chip = [4, 6, 5, 45, 60, 52, 6, 5, 20, 4, 5, 48, 7, 5]\n"
                "def p_poisson(k, lam):\n"
                "    return 1 - sum(math.exp(-lam)*lam**i/math.factorial(i) for i in range(k))\n"
                "print('jendela: chip-count -> p-value')\n"
                "for i, k in enumerate(chip):\n"
                "    p = p_poisson(k, latar)\n"
                "    tanda = ' PEAK' if p < 0.01/len(chip) else ''\n"
                "    print(f'  {i:>2}: {k:>3} -> p={p:.1e}{tanda}')\n"
                "print()\n"
                "print('Bonferroni untuk 14 jendela. MACS2 memakai model dinamis + FDR.')\n"
                "print('Jendela 8 (count 20): signifikan? Cek p vs ambang!')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Beta vs M-value & Uji DMR",
            "intro": "Hitung beta dan M-value dari intensitas M/U, lalu uji beda metilasi dua kelompok. Lihat kenapa M-value untuk statistik.",
            "hint": "Perhatikan variansi beta di dekat 0/1 vs tengah. Itulah heteroskedastisitas \u2014 alasan M-value dipakai limma.",
            "code": (
                "import math, statistics as st\n"
                "# (M, U) 5 normal vs 5 tumor di satu CpG\n"
                "normal = [(100,900),(120,880),(90,910),(110,890),(105,895)]\n"
                "tumor  = [(850,150),(880,120),(820,180),(860,140),(870,130)]\n"
                "def beta(mu):\n"
                "    m, u = mu\n"
                "    return m/(m+u+100)\n"
                "def mval(mu):\n"
                "    b = beta(mu)\n"
                "    return math.log2(b/(1-b))\n"
                "bn, bt = [beta(x) for x in normal], [beta(x) for x in tumor]\n"
                "mn, mt = [mval(x) for x in normal], [mval(x) for x in tumor]\n"
                "print(f'beta : normal={st.mean(bn):.2f} tumor={st.mean(bt):.2f} '\n"
                "      f'delta={st.mean(bt)-st.mean(bn):.2f}')\n"
                "print(f'M-val: normal={st.mean(mn):.1f} tumor={st.mean(mt):.1f}')\n"
                "# uji-t sederhana pada M-value\n"
                "import statistics\n"
                "def ttest(a, b):\n"
                "    va, vb = statistics.variance(a), statistics.variance(b)\n"
                "    se = (va/len(a)+vb/len(b))**0.5\n"
                "    return (statistics.mean(a)-statistics.mean(b))/se\n"
                "print(f't-stat (M-value) = {ttest(mt, mn):.1f} -> DMR kuat!')\n"
                "print()\n"
                "print('Presentasi: delta-beta 0.75 (manusiawi).')\n"
                "print('Statistik: uji pada M-value (valid).')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Lokasi ikatan TF spesifik \u2192 ChIP-seq + kontrol input",
            "kondisi": "Antibodi bagus tersedia.",
            "alasan": "Spesifik protein; standar emas.",
            "contoh": "Ikatan p53 genome-wide.",
        },
        {
            "title": "Peta regulasi umum / sampel sedikit \u2192 ATAC-seq",
            "kondisi": "Tanpa antibodi; 500 sel cukup.",
            "alasan": "Mudah, murah, informatif.",
            "contoh": "Aksesibilitas tumor langka.",
        },
        {
            "title": "Metilasi ratusan sampel \u2192 Array EPIC 850K",
            "kondisi": "Butuh throughput.",
            "alasan": "Murah per sampel; cukup untuk DMR.",
            "contoh": "EWAS 500 pasien.",
        },
        {
            "title": "Metilasi seluruh genom \u2192 WGBS",
            "kondisi": "Butuh resolusi penuh; budget besar.",
            "alasan": "Semua CpG, bukan subset.",
            "contoh": "Atlas metilasi jaringan.",
        },
    ],
    "aturan10": [
        "Epigenetika = pembacaan, bukan urutan.",
        "Konteks menentukan arti tanda.",
        "ChIP-seq wajib kontrol input.",
        "Statistik M-value, presentasi beta.",
    ],
    "case": {
        "title": "Biomarker Metilasi \u201c95% Akurat\u201d",
        "body": [
            "<p>Startup klaim tes darah metilasi deteksi 10 kanker dengan akurasi 95%. Kamu diminta review teknis.</p>",
            "<p>Temuan: validasi hanya di satu populasi (Eropa); tidak ada validasi prospektif; panel 100 CpG dipilih dari data yang sama (overfitting!); tidak dilaporkan PPV pada prevalensi populasi umum.</p>",
        ],
        "pertanyaan": "Putusanmu?",
        "pembahasan": "Akurasi 95% di case-control terseleksi \u2260 berguna klinis. (1) Overfitting: seleksi fitur + evaluasi di data sama = optimis. (2) Prevalensi: kanker 0,5% populasi \u2192 spesifisitas 95% = PPV hanya ~9% (lihat HD9: Bayes!). 91% positif = false alarm. (3) Tanpa validasi prospektif multi-populasi, klaim tidak berdiri. Rekomendasi: minta validasi independen + laporkan PPV/NPV pada prevalensi nyata. Pelajaran: biomarker epigenetik itu menjanjikan (ctDNA metilasi nyata dipakai!), tapi saring dengan HD9 (PPV) + BI16 (validasi) sebelum percaya.",
    },
    "quiz": [
        ("Promoter gen supresor tumor yang hipermetilasi mengakibatkan\u2026",
         ["Gen aktif", "Gen dibungkam tanpa mutasi DNA \u2014 mekanisme kanker", "Tidak ada efek", "Mutasi"],
         1,
         "Benar: kanker via epigenetik, bukan genetik. Target obat demethylating!"),
        ("Kombinasi H3K4me3 + H3K27me3 (bivalen) artinya\u2026",
         ["Aktif penuh", "Poised: siap tapi ditahan \u2014 khas gen perkembangan sel punca", "Rusak", "Tidak mungkin"],
         1,
         "Benar: dua sinyal berlawanan = ditahan dalam kesiapan, bukan mati total."),
        ("Keunggulan ATAC-seq atas ChIP-seq?",
         ["Lebih spesifik protein", "Tanpa antibodi; sampel sedikit; peta keterbukaan umum", "Lebih murah selalu", "Tidak ada"],
         1,
         "Benar: pintu terbuka vs siapa yang lewat. Pilih sesuai pertanyaan."),
        ("Untuk UJI STATISTIK metilasi sebaiknya pakai\u2026",
         ["Beta value", "M-value (homoskedastik); beta untuk presentasi", "Count mentah", "p-value"],
         1,
         "Benar: beta heteroskedastik. Statistik valid + presentasi manusiawi = dua metrik."),
        ("Bisulfite sequencing membaca metilasi karena\u2026",
         ["Menghancurkan DNA", "C tak termetilasi \u2192 U (dibaca T); C termetilasi tetap C", "Menambah metilasi", "Sihir"],
         1,
         "Benar: konversi kimia yang membedakan status metilasi per basa."),
        ("Peak ChIP-seq tanpa kontrol input\u2026",
         ["Tetap valid", "Tidak valid \u2014 tak bisa bedakan ikatan dari bias teknis", "Lebih baik", "Wajib dipublikasi"],
         1,
         "Benar: kontrol = pembeda sinyal vs bias. Tanpa itu, peak = tebakan."),
    ],
    "rangkuman": [
        "Tiga lapisan: <strong>metilasi, histon, aksesibilitas</strong> = tinta stabilo genom.",
        "Kode histon: <strong>H3K4me3/H3K27ac</strong> aktif; <strong>H3K27me3</strong> represif; bivalen = poised.",
        "<strong>ChIP-seq</strong> (spesifik, butuh antibodi + kontrol) vs <strong>ATAC-seq</strong> (umum, mudah).",
        "<strong>Peak calling</strong> = uji statistik vs kontrol (MACS2).",
        "Metilasi: <strong>bisulfite</strong>; beta untuk presentasi, <strong>M-value</strong> untuk statistik.",
        "<strong>DMR</strong>: region beda metilasi \u2014 biomarker kanker potensial.",
        "Integrasikan dengan <strong>ekspresi</strong> untuk cerita lengkap.",
        "Waspadai klaim biomarker: <strong>overfitting + PPV prevalensi</strong>.",
    ],
    "prev": ("bi12-genomika-populasi", "BI12"),
    "next": ("bi14-metagenomik", "BI14"),
}

# ================================================================ BI14
BI14 = {
    "slug": "bi14-metagenomik",
    "code": "BI14",
    "track": TRACK,
    "cover_title": "16S &amp; Komposisi:<br />Metagenomik: Siapa Tinggal di Sini",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 99% Tak Bisa Dibiakkan"),
        ("pendekatan", "16S vs Shotgun: Dua Lensa"),
        ("komposisi", "Data Komposisional \u2014 Si Jebakan"),
        ("diversitas", "Diversitas &amp; Uji Asosiasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Jebakan Korelasi Komposisional"),
        ("lab2", "\U0001f52c Lab 2: Indeks Shannon &amp; PCoA Mini"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>metagenomik</strong> dan dua pendekatan: <strong>16S vs shotgun</strong>.",
        "Menjelaskan sifat <strong>komposisional</strong> data mikrobiom dan jebakannya.",
        "Menghitung <strong>diversitas alfa/beta</strong> dan memilih uji yang tepat.",
        "Merancang analisis <strong>asosiasi mikrobiom-penyakit</strong> yang valid.",
    ],
    "story_title": "Cerita Pembuka: 99% Tak Bisa Dibiakkan",
    "story": [
        "<p>Selama seabad, mikrobiologi = biakkan di cawan. Masalah: <strong>99% mikroba tidak bisa dibiakkan</strong> \u2014 kita buta terhadap hampir semua penghuni tubuh. Lalu datang sekuensing langsung dari sampel: usus manusia ternyata dihuni 1.000+ spesies yang tak pernah terlihat di cawan.</p>",
        "<p>Metagenomik = sensus tanpa cawan: sekuensing DNA langsung dari lingkungan. Lesson ini mengajarkan dua lensanya (16S vs shotgun), jebakan statistiknya yang unik (komposisional!), dan cara menghubungkan mikrobiom dengan penyakit \u2014 bidang yang meledak dan penuh klaim berlebihan.</p>",
    ],
    "konsep": [
        {
            "id": "pendekatan",
            "title": "16S vs Shotgun \u2014 Si KTP vs Si Wawancara",
            "definisi": "<strong>16S rRNA</strong>: sekuensing satu gen penanda bakteri \u2014 murah, taksonomi genus, tanpa fungsi. <strong>Shotgun</strong>: sekuensing SEMUA DNA \u2014 spesies/strain + fungsi (gen), mahal, butuh komputasi besar.",
            "kepribadian": "16S itu seperti sensus pakai KTP: tahu siapa (genus) tapi tidak tahu kerja apa. Shotgun itu seperti wawancara mendalam: tahu siapa sampai strain DAN pekerjaannya (gen apa yang dibawa).",
            "kapan": "Survei cepat/murah banyak sampel \u2192 16S. Fungsi/strain/resistome \u2192 shotgun. Ingin keduanya: 16S untuk skrining, shotgun untuk subset.",
            "worked": (
                "\U0001f4d0 Contoh: memilih untuk studi usus-diabetes",
                "<p>500 sampel feses, budget terbatas.<br />"
                "Tahap 1: <strong>16S</strong> semua sampel \u2192 temukan genus berbeda.<br />"
                "Tahap 2: <strong>shotgun</strong> 100 sampel ekstrem \u2192 pathway butirat menurun + strain spesifik.<br />"
                "Hasil: taksonomi (siapa) + fungsi (ngapain) dengan budget terkendali.<br />"
                "<strong>Catatan:</strong> 16S buta terhadap virus/jamur (butuh ITS/shotgun); daerah V3-V4 vs V4 saja = hasil beda!</p>",
            ),
            "chart": {
                "var": "bi14StackData",
                "data": [{"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [45, 45, 25, 25], "type": "bar", "name": "Bacteroides", "marker": {"color": "#2a7de1"}},
                        {"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [30, 30, 20, 20], "type": "bar", "name": "Firmicutes lain", "marker": {"color": "#7fb3f0"}},
                        {"x": ["Sehat", "Sehat", "Diabetes", "Diabetes"], "y": [25, 25, 55, 55], "type": "bar", "name": "Proteobacteria", "marker": {"color": "#e8a838"}}],
                "title": "Komposisi Mikrobiom: Sehat vs Diabetes (ilustratif)",
                "layout": {"barmode": "stack", "xaxis": {"title": "Sampel"}, "yaxis": {"title": "Abundansi relatif (%)"}, "showlegend": True},
                "cara": "Stacked bar: tiap batang = 100%. Warna = takson. Bandingkan pola sehat vs diabetes.",
                "interpretasi": "Diabetes: Proteobacteria meledak (kuning), Bacteroides menyusut. Tapi INGAT sifat komposisional: karena total 100%, naiknya satu OTOMATIS menurunkan yang lain \u2014 belum tentu Bacteroides benar-benar berkurang jumlahnya! (Lihat konsep komposisi.)",
            },
        },
        {
            "id": "komposisi",
            "title": "Data Komposisional \u2014 Si Jebakan Persen",
            "definisi": "Data mikrobiom adalah <strong>komposisi</strong> (jumlah = 100%): naiknya satu takson MEMAKSA turunnya yang lain secara matematis \u2014 menciptakan <strong>korelasi palsu</strong>. Solusi: <strong>CLR transform</strong> (centered log-ratio) atau metode komposisional (ALDEx2, ANCOM).",
            "kepribadian": "Data komposisional itu seperti survei \u201cpersen waktu harian\u201d: tidur naik 10% OTOMATIS berarti aktivitas lain turun 10% \u2014 bukan karena kamu malas berolahraga, tapi karena hari cuma 24 jam. Korelasi antar persen = ilusi jam.",
            "kapan": "Setiap analisis korelasi/DE mikrobiom: JANGAN korelasi Pearson pada persen mentah. Pakai CLR/ANCOM/ALDEx2.",
            "worked": (
                "\U0001f4d0 Contoh klasik: korelasi palsu",
                "<p>Tiga takson, total dibatasi 100%. Takson A meledak karena antibiotik membunuh B dan C.<br />"
                "<strong>Persen mentah:</strong> B dan C \u201cberkorelasi positif\u201d (sama-sama turun) \u2014 PALSU, mereka tidak berinteraksi!<br />"
                "<strong>CLR:</strong> korelasi lenyap \u2192 benar: yang berubah hanya A.<br />"
                "Ratusan paper mikrobiom awal tercemar korelasi palsu ini. Jangan jadi paper ke-101.</p>",
            ),
            "rumus": r"clr(x_i) = \ln\left(\frac{x_i}{g(x)}\right), \quad g(x) = \text{rata-rata geometrik}",
            "simbol": [
                (r"x_i", "abundansi takson i"),
                (r"g(x)", "rata-rata geometrik semua takson (pembagi referensi)"),
            ],
            "interpretasi": "CLR: bagi tiap takson dengan rata-rata geometrik lalu log. Ini memutus belenggu \u201ctotal 100%\u201d \u2014 nilai CLR bisa diuji dengan statistik standar. Sederhana tapi menyelamatkan dari banjir korelasi palsu.",
        },
        {
            "id": "diversitas",
            "title": "Diversitas &amp; Uji Asosiasi",
            "definisi": "<strong>Alfa</strong>: diversitas DALAM sampel (Shannon, Chao1) \u2014 \u201cberapa macam & merata?\u201d <strong>Beta</strong>: perbedaan ANTAR sampel (Bray-Curtis, UniFrac) \u2014 divisualkan PCoA, diuji PERMANOVA. <strong>Asosiasi</strong>: takson beda antar kondisi via ANCOM/ALDEx2/DESeq2-Phyloseq.",
            "rumus": r"H = -\sum_i p_i \ln p_i",
            "simbol": [
                (r"H", "indeks Shannon (alfa)"),
                (r"p_i", "proporsi takson i"),
            ],
            "interpretasi": "Shannon: 0 = satu takson dominan total; makin banyak & merata \u2192 makin tinggi. Usus sehat umumnya Shannon tinggi; antibiotik/diabetes menurunkannya. Tapi DIVERSITAS SAJA bukan diagnosis \u2014 konteks!",
            "worked": (
                "\U0001f4d0 Contoh: alur asosiasi",
                "<p>50 diabetes vs 50 sehat (16S).<br />"
                "1. <strong>Alfa:</strong> Shannon diabetes lebih rendah (p=0,01).<br />"
                "2. <strong>Beta:</strong> PCoA memisahkan kelompok; PERMANOVA p=0,001 \u2192 komunitas beda.<br />"
                "3. <strong>Takson:</strong> ANCOM \u2192 genus X menurun (W>threshold).<br />"
                "4. <strong>Kontrol confounder:</strong> diet, obat (metformin mengubah mikrobiom!), usia \u2014 masukkan ke model.<br />"
                "Tanpa langkah 4, \u201ctemuan\u201d bisa = efek metformin, bukan diabetes.</p>",
            ),
            "kepribadian": "Alfa itu seperti menilai restoran: berapa variasi menu & seimbang? Beta itu seperti membandingkan dua restoran: seberapa beda menunya? PERMANOVA adalah juri yang memutuskan \u201cbeda ini nyata atau kebetulan\u201d.",
            "kapan": "Alfa/beta = langkah 1 setiap studi. Asosiasi takson = langkah 2 dengan metode komposisional. Confounder = selalu.",
        },
    ],
    "myths": [
        ("Mikrobiom \u201cmenyebabkan\u201d penyakit dari studi asosiasi",
         "Asosiasi \u2260 kausalitas (HD10!). Mikrobiom berubah karena penyakit, obat, diet \u2014 arah bisa terbalik. Kausalitas butuh: intervensi (FMT/probiotik RCT), longitudinal, atau model hewan. \u201cBakteri X menyebabkan diabetes\u201d dari cross-sectional = overklaim."),
        ("Satu bakteri baik/buruk",
         "Konteks menentukan: strain sama bisa komensal di usus, patogen di darah. <em>E. coli</em> Nissle = probiotik; <em>E. coli</em> O157 = mematikan. Taksonomi kasar (genus) menyembunyikan perbedaan strain yang menentukan."),
        ("Hasil 16S = kebenaran mutlak komunitas",
         "Bias PCR primer (melewatkan takson!), copy number 16S beda per bakteri, resolusi genus. 16S = lensa buram yang berguna \u2014 bukan foto. Shotgun pun punya bias (ekstraksi DNA, database)."),
    ],
    "tips": [
        "Jangan pernah <strong>korelasi Pearson/Spearman pada persen</strong>. CLR dulu atau pakai SparCC. Satu baris transform menghemat satu paper memalukan.",
        "Catat <strong>metadata lengkap</strong>: diet, obat, usia, metode sampling. Confounder mikrobiom SANGAT banyak \u2014 tanpa metadata, data tidak terinterpretasi.",
        "Untuk klaim kausal: rancang <strong>longitudinal atau intervensi</strong> sejak awal. Cross-sectional hanya untuk hipotesis \u2014 tulis begitu di paper.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Korelasi Palsu Komposisional",
            "intro": "Simulasikan 3 takson absolut (independen!), ubah jadi persen, lalu hitung korelasi. Saksikan korelasi palsu muncul dari ketiadaan.",
            "hint": "Ubah jadi CLR lalu korelasi ulang: korelasi palsu hilang. Inilah satu transformasi yang memisahkan analisis amatir vs profesional.",
            "code": (
                "import random, math, statistics as st\n"
                "random.seed(9)\n"
                "# abundansi ABSOLUT: A naik (efek), B & C independen (noise)\n"
                "A = [100 + i*10 + random.gauss(0,5) for i in range(20)]\n"
                "B = [50 + random.gauss(0,5) for _ in range(20)]\n"
                "C = [50 + random.gauss(0,5) for _ in range(20)]\n"
                "def kor(x, y):\n"
                "    mx, my = st.mean(x), st.mean(y)\n"
                "    return sum((a-mx)*(b-my) for a,b in zip(x,y)) / \\\n"
                "        (sum((a-mx)**2 for a in x)*sum((b-my)**2 for b in y))**0.5\n"
                "print(f'korelasi ABSOLUT B-C: {kor(B,C):+.2f} (independen ~ 0)')\n"
                "# ubah jadi persen (komposisi)\n"
                "tot = [a+b+c for a,b,c in zip(A,B,C)]\n"
                "pB = [b/t*100 for b,t in zip(B,tot)]\n"
                "pC = [c/t*100 for c,t in zip(C,tot)]\n"
                "print(f'korelasi PERSEN   B-C: {kor(pB,pC):+.2f} <- PALSU!')\n"
                "# CLR\n"
                "def clr(vals):\n"
                "    g = math.exp(sum(math.log(v) for v in vals)/len(vals))\n"
                "    return [math.log(v/g) for v in vals]\n"
                "cB = [clr([a,b,c])[1] for a,b,c in zip(A,B,C)]\n"
                "cC = [clr([a,b,c])[2] for a,b,c in zip(A,B,C)]\n"
                "print(f'korelasi CLR      B-C: {kor(cB,cC):+.2f} (kembali ~0)')\n"
                "print()\n"
                "print('Persen menciptakan korelasi dari ketiadaan. CLR memperbaikinya.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Shannon & Jarak Bray-Curtis",
            "intro": "Hitung diversitas alfa (Shannon) dua sampel dan jarak beta (Bray-Curtis). Interpretasikan: mana lebih beragam, seberapa beda?",
            "hint": "Coba sampel dengan 10 takson merata vs 2 takson dominan. Shannon menangkap keduanya (kekayaan + kemerataan) dalam satu angka.",
            "code": (
                "import math\n"
                "# count 5 takson x 3 sampel\n"
                "sampel = {'sehat1': [30,25,20,15,10],\n"
                "          'sehat2': [28,26,21,14,11],\n"
                "          'sakit1': [80,5,5,5,5]}\n"
                "def shannon(counts):\n"
                "    tot = sum(counts)\n"
                "    return -sum((c/tot)*math.log(c/tot) for c in counts if c > 0)\n"
                "def bray(a, b):\n"
                "    return sum(abs(x-y) for x,y in zip(a,b))/sum(x+y for x,y in zip(a,b))\n"
                "print('alfa (Shannon):')\n"
                "for s, c in sampel.items():\n"
                "    print(f'  {s}: {shannon(c):.2f}')\n"
                "print('beta (Bray-Curtis):')\n"
                "ss = list(sampel)\n"
                "for i in range(len(ss)):\n"
                "    for j in range(i+1, len(ss)):\n"
                "        print(f'  {ss[i]} vs {ss[j]}: {bray(sampel[ss[i]], sampel[ss[j]]):.2f}')\n"
                "print()\n"
                "print('sakit1: Shannon rendah (dominan 1 takson) & jauh dari sehat.')\n"
                "print('Ini pola klasik: dysbiosis = diversitas turun + komposisi bergeser.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Survei cepat banyak sampel \u2192 16S",
            "kondisi": "Budget terbatas; butuh taksonomi genus.",
            "alasan": "Murah; cukup untuk pola besar.",
            "contoh": "Skrining 500 feses.",
        },
        {
            "title": "Fungsi/strain/resistome \u2192 Shotgun",
            "kondisi": "Butuh gen & resolusi strain.",
            "alasan": "Semua DNA; fungsional.",
            "contoh": "Gen resistensi antibiotik.",
        },
        {
            "title": "Uji beda takson \u2192 ANCOM/ALDEx2 (komposisional)",
            "kondisi": "Data persen/count komposisi.",
            "alasan": "Bebas korelasi palsu.",
            "contoh": "Takson beda diabetes vs sehat.",
        },
        {
            "title": "Klaim kausal \u2192 Longitudinal/intervensi",
            "kondisi": "Butuh arah sebab-akibat.",
            "alasan": "Cross-sectional tak cukup.",
            "contoh": "RCT probiotik; FMT.",
        },
    ],
    "aturan10": [
        "99% mikroba tak terbaca tanpa metagenomik.",
        "16S = siapa; shotgun = siapa + ngapain.",
        "Jangan korelasi persen mentah \u2014 CLR!",
        "Confounder (obat/diet) selalu dicatat.",
    ],
    "case": {
        "title": "\u201cProbiotik Diabetes\u201d dari Data Cross-sectional",
        "body": [
            "<p>Studi 200 orang: genus X lebih rendah pada diabetes (p=0,001, uji-t pada persen). Startup langsung jual probiotik X \u201cklinis terbukti\u201d. Kamu diminta review.</p>",
            "<p>Temuan: (1) uji-t pada persen = melanggar asumsi komposisional; (2) 80% pasien diabetes minum metformin \u2014 yang DIKETAHUI mengubah mikrobiom; (3) tanpa validasi kohort independen.</p>",
        ],
        "pertanyaan": "Putusanmu?",
        "pembahasan": "Tiga cacat: statistik salah (komposisi), confounder fatal (metformin), tanpa replikasi. Rerun dengan ANCOM + kontrol metformin: sinyal genus X LENYAP \u2014 yang tersisa hanya efek obat. Rekomendasi: tarik klaim \u201cklinis terbukti\u201d; butuh RCT probiotik X vs plasebo dengan outcome glikemik. Pelajaran: rantai kegagalan klasik mikrobiom \u2014 metode salah \u2192 confounder \u2192 overklaim komersial. Tiga cek (komposisional? confounder? replikasi?) membatalkan sebagian hype probiotik.",
    },
    "quiz": [
        ("Kapan shotgun dipilih atas 16S?",
         ["Selalu", "Butuh fungsi gen / resolusi strain / non-bakteri", "Tidak pernah", "Hanya untuk virus"],
         1,
         "Benar: KTP vs wawancara. Fungsi & strain butuh semua DNA."),
        ("Bahaya korelasi pada data persen mikrobiom?",
         ["Tidak ada", "Korelasi palsu: total 100% memaksa ketergantungan matematis", "Terlalu lambat", "Hanya untuk 16S"],
         1,
         "Benar: hari cuma 24 jam. CLR/SparCC/ANCOM solusinya."),
        ("Rumus CLR membagi dengan\u2026",
         ["Total", "Rata-rata geometrik semua takson", "Maksimum", "100"],
         1,
         "Benar: geometric mean sebagai referensi internal \u2014 memutus belenggu komposisi."),
        ("Diversitas alfa (Shannon) mengukur\u2026",
         ["Perbedaan antar sampel", "Kekayaan & kemerataan DALAM satu sampel", "Jumlah read", "p-value"],
         1,
         "Benar: dalam vs antar = alfa vs beta. Jangan tertukar."),
        ("PERMANOVA menguji\u2026",
         ["Satu gen", "Perbedaan KOMUNITAS antar kelompok dari matriks jarak beta", "Normalitas", "Korelasi"],
         1,
         "Benar: juri \u201cbeda komunitas ini nyata?\u201d dari Bray-Curtis/UniFrac."),
        ("Confounder klasik studi mikrobiom-diabetes?",
         ["Warna mata", "Metformin & diet \u2014 mengubah mikrobiom langsung", "Golongan darah", "Tidak ada"],
         1,
         "Benar: obat adalah confounder #1. Tanpa kontrol obat, temuan = efek farmasi."),
    ],
    "rangkuman": [
        "Metagenomik = sensus tanpa cawan; <strong>99%</strong> tak terbaca konvensional.",
        "<strong>16S</strong>: murah, taksonomi; <strong>shotgun</strong>: fungsi + strain, mahal.",
        "Data <strong>komposisional</strong>: jangan korelasi persen \u2014 pakai <strong>CLR/ANCOM</strong>.",
        "<strong>Alfa</strong> (Shannon): dalam sampel; <strong>beta</strong> (Bray-Curtis): antar sampel + PERMANOVA.",
        "Asosiasi \u2260 kausalitas; kontrol <strong>obat/diet</strong>.",
        "Strain menentukan (probiotik vs patogen).",
        "Bias: primer 16S, copy number, database.",
        "Klaim kausal butuh <strong>longitudinal/intervensi</strong>.",
    ],
    "prev": ("bi13-epigenomik", "BI13"),
    "next": ("bi15-proteomik", "BI15"),
}

# ================================================================ BI15
BI15 = {
    "slug": "bi15-proteomik",
    "code": "BI15",
    "track": TRACK,
    "cover_title": "AlphaFold &amp; Multi-Omics:<br />Proteomik dan Integrasi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Struktur yang Menunggu 50 Tahun"),
        ("proteomik", "Proteomik: Dari Spektra ke Protein"),
        ("alphafold", "AlphaFold &amp; Docking: Struktur dari Sekuens"),
        ("multiomics", "Integrasi Multi-Omics"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Identifikasi Peptida (Skor Sederhana)"),
        ("lab2", "\U0001f52c Lab 2: Integrasi Mini (mRNA vs Protein)"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan alur <strong>proteomik mass-spectrometry</strong>: spektra \u2192 peptida \u2192 protein.",
        "Menjelaskan <strong>AlphaFold</strong>: prediksi struktur + cara membaca pLDDT.",
        "Menjelaskan prinsip <strong>docking</strong> untuk drug discovery.",
        "Merancang <strong>integrasi multi-omics</strong> (MOFA, network) dan menghindari jebakannya.",
    ],
    "story_title": "Cerita Pembuka: Struktur yang Menunggu 50 Tahun",
    "story": [
        "<p>Menentukan SATU struktur protein via kristalografi: 1 PhD, 3 tahun, Rp1 miliar. Tahun 2021, AlphaFold memprediksi <strong>200 juta struktur</strong> dalam setahun \u2014 gratis. Masalah 50 tahun (protein folding) runtuh dalam semalam. Lab struktural panik; lab biologi pesta.</p>",
        "<p>Tapi struktur bukan segalanya: protein bekerja dalam jaringan interaksi, modifikasi, dan konteks sel. Lesson ini: dari spektra mass-spec ke protein, dari sekuens ke struktur (AlphaFold), lalu naik satu level \u2014 mengintegrasikan genomik, transkriptomik, proteomik menjadi cerita utuh (multi-omics).</p>",
    ],
    "konsep": [
        {
            "id": "proteomik",
            "title": "Proteomik: Dari Spektra ke Protein",
            "definisi": "<strong>Mass spec (MS)</strong>: pecah protein \u2192 peptida \u2192 ukur massa fragmen \u2192 cocokkan ke database (search engine: MaxQuant). <strong>Kuantifikasi</strong>: label-free (intensitas) atau TMT (multiplex). <strong>PTM</strong>: fosforilasi dkk. dideteksi sebagai pergeseran massa.",
            "kepribadian": "Proteomik MS itu seperti mengidentifikasi mobil dari suaranya: tiap peptida punya \u201csuara\u201d (pola fragmen massa) yang dicocokkan ke katalog. Label-free = dengarkan satu per satu; TMT = paduan suara 16 sampel sekaligus dengan label nada.",
            "kapan": "Ekspresi protein aktual (mRNA \u2260 protein!), PTM, interaksi (AP-MS), biomarker cairan tubuh.",
            "worked": (
                "\U0001f4d0 Contoh: FDR di proteomik",
                "<p>100.000 spektra dicocokkan ke database + <strong>decoy</strong> (urutan terbalik).<br />"
                "1.000 cocok ke decoy \u2192 FDR \u2248 1.000/99.000 \u2248 1% \u2713.<br />"
                "Tanpa target-decoy, \u201cidentifikasi\u201d = tebakan. Standar: FDR 1% peptida & protein.<br />"
                "<strong>Missing value:</strong> protein tak terdeteksi di sebagian sampel \u2014 imputasi hati-hati (bukan acak! sering MNAR: di bawah limit deteksi).</p>",
            ),
            "rumus": r"\text{FDR} = \frac{N_{\text{decoy}}}{N_{\text{target}}}",
            "simbol": [
                (r"N_{\text{decoy}}", "cocokan ke database umpan (urutan terbalik) \u2014 estimasi tebakan"),
                (r"N_{\text{target}}", "cocokan ke database asli"),
            ],
            "interpretasi": "Rasio target-decoy: bila 1.000 dari 100.000 spektra cocok ke umpan (yang pasti salah), ~1% cocokan target juga salah. Standar: FDR 1% di level peptida DAN protein.",
            "chart": {
                "var": "bi15MrnaProtData",
                "data": [{"x": [1, 2, 3, 4, 5, 6, 7, 8], "y": [1.1, 2.2, 2.9, 4.3, 5.1, 5.8, 7.2, 7.9], "type": "scatter", "mode": "markers", "marker": {"color": "#2a7de1", "size": 9}, "name": "Gen", "text": ["A", "B", "C", "D", "E", "F", "G", "H"], "textposition": "top center"}],
                "title": "mRNA vs Protein (log2FC, ilustratif)",
                "layout": {"xaxis": {"title": "log2FC mRNA (RNA-seq)"}, "yaxis": {"title": "log2FC protein (MS)"}, "showlegend": False},
                "cara": "Tiap titik = satu gen. Diagonal = mRNA dan protein berubah seiring. Titik jauh dari diagonal = regulasi pasca-transkripsi.",
                "interpretasi": "Korelasi hanya ~0,5: gen D naik di mRNA tapi datar di protein (degradasi?), gen H sebaliknya. Inilah kenapa proteomik DIBUTUHKAN \u2014 mRNA bukan proksi protein. Multi-omics lahir dari kesenjangan ini.",
            },
        },
        {
            "id": "alphafold",
            "title": "AlphaFold &amp; Docking \u2014 Si Peramal Struktur",
            "definisi": "<strong>AlphaFold2/3</strong>: prediksi struktur 3D dari sekuens (deep learning + MSA). <strong>pLDDT</strong>: keyakinan per residu (0\u2013100). <strong>Docking</strong> (AutoDock Vina): prediksi pose & afinitas ligan di kantong protein \u2014 skrining virtual obat.",
            "kepribadian": "AlphaFold itu seperti arsitek yang melihat daftar bahan (sekuens) lalu menggambar gedungnya \u2014 dengan catatan kaki \u201cbagian ini saya yakin, bagian itu (loop fleksibel) jangan percaya\u201d. Docking itu seperti mencoba kunci ke gembok: ribuan kunci dicoba virtual sebelum satu dibuat fisik.",
            "kapan": "Struktur untuk hipotesis fungsi, desain mutasi, docking awal. Bukan pengganti eksperimen untuk mekanisme presisi / dinamika.",
            "worked": (
                "\U0001f4d0 Contoh: membaca pLDDT",
                "<p>Protein X hasil AlphaFold: domain kinase pLDDT 95 (biru) \u2192 percaya diri, bisa untuk docking.<br />"
                "Loop N-terminal pLDDT 45 (oranye) \u2192 fleksibel/tak terstruktur \u2014 JANGAN pakai untuk desain obat presisi.<br />"
                "pLDDT rendah + tidak ada MSA dalam = prediksi lemah (protein yatim).<br />"
                "<strong>Docking:</strong> 10.000 senyawa \u2192 Vina \u2192 top 100 skor \u2192 uji in vitro 100 \u2192 5 hit. Funnel standar drug discovery komputasional.</p>",
            ),
            "warning": "<strong>Batasan AlphaFold:</strong> (1) satu konformasi statis \u2014 protein itu dinamis; (2) lemah untuk kompleks multimerik tak dikenal & mutasi titik (tidak memprediksi efek mutasi andal!); (3) tanpa ligan/kofaktor (AF3 membaik). Jangan pakai untuk klaim \u201cmutasi ini merusak struktur\u201d tanpa validasi.",
        },
        {
            "id": "multiomics",
            "title": "Integrasi Multi-Omics \u2014 Si Orkestra",
            "definisi": "<strong>Multi-omics</strong>: gabungkan lapisan (genom, epigenom, transkriptom, proteom, metabolom) untuk cerita utuh. Metode: <strong>MOFA</strong> (faktor laten bersama), <strong>network</strong> (jaringan gen-protein), <strong>korelasi lintas-omics</strong>.",
            "kepribadian": "Single-omics itu seperti mendengar satu alat musik; multi-omics adalah orkestra: genom = partitur, epigenom = interpretasi konduktor, transkriptom = suara alat, proteom = musik yang terdengar. Satu alat fals belum tentu konser gagal \u2014 dengar semuanya.",
            "kapan": "Mekanisme penyakit kompleks, biomarker panel, subtipe kanker (TCGA), respons obat. Butuh n cukup & desain terkoordinasi.",
            "worked": (
                "\U0001f4d0 Contoh: MOFA pada kanker",
                "<p>Data: mutasi + metilasi + mRNA + protein, 200 tumor.<br />"
                "<strong>MOFA</strong> menemukan faktor laten 1 menjelaskan variansi di SEMUA omics \u2192 pasien terstratifikasi 3 subtipe.<br />"
                "Subtipe A: mutasi TP53 + hipermetilasi + program EMT aktif \u2192 prognosis buruk.<br />"
                "Satu omics saja tidak menemukan subtipe ini \u2014 sinyalnya terdistribusi.<br />"
                "<strong>Jebakan:</strong> batch per-omics beda! Integrasikan setelah koreksi per lapisan (BI10).</p>",
            ),
            "rumus": r"X^{(m)} \approx Z {W^{(m)}}^T",
            "simbol": [
                (r"X^{(m)}", "matriks data omics ke-m (sampel \u00d7 fitur)"),
                (r"Z", "faktor laten BERSAMA lintas omics (sampel \u00d7 faktor)"),
                (r"W^{(m)}", "bobot spesifik omics-m (bagaimana faktor termanifestasi di lapisan ini)"),
            ],
            "interpretasi": "MOFA = faktorisasi matriks bersama: tiap omics dijelaskan oleh faktor laten yang SAMA (Z) dengan bobot spesifik (W). Faktor yang kuat di semua omics = orkestra; yang kuat di satu omics = solo.",
            "chart": {
                "var": "bi15MofaData",
                "data": [{"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [35, 20, 12, 8], "type": "bar", "name": "mRNA", "marker": {"color": "#2a7de1"}},
                        {"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [25, 10, 18, 5], "type": "bar", "name": "Protein", "marker": {"color": "#e8a838"}},
                        {"x": ["Faktor 1", "Faktor 2", "Faktor 3", "Faktor 4"], "y": [15, 8, 5, 20], "type": "bar", "name": "Metilasi", "marker": {"color": "#7fb3f0"}}],
                "title": "Variansi Dijelaskan per Faktor MOFA (ilustratif)",
                "layout": {"barmode": "group", "xaxis": {"title": "Faktor laten"}, "yaxis": {"title": "Variansi (%)"}, "showlegend": True},
                "cara": "Tiap faktor laten = pola bersama lintas omics. Warna = kontribusi per lapisan omics.",
                "interpretasi": "Faktor 1 kuat di SEMUA omics = sinyal biologis bersama (mis. subtipe). Faktor 4 dominan metilasi saja = spesifik satu lapisan. MOFA memisahkan \u201corkestra\u201d (bersama) dari \u201csolo\u201d (spesifik) \u2014 fokus pada faktor bersama untuk mekanisme.",
            },
        },
    ],
    "myths": [
        ("AlphaFold mengakhiri biologi struktural",
         "AlphaFold memprediksi SATU konformasi statis dengan keyakinan bervariasi. Dinamika, kompleks baru, efek mutasi, dan interaksi ligan tetap butuh eksperimen + simulasi (MD). Ia mengakselerasi \u2014 bukan mengakhiri \u2014 struktural."),
        ("mRNA = protein, jadi proteomik mubazir",
         "Korelasi mRNA-protein hanya ~0,4\u20130,6 (lihat chart!). Translasi, degradasi, dan PTM memutus hubungan. Obat bekerja pada PROTEIN \u2014 mengabaikan lapisan ini = mengabaikan target obat itu sendiri."),
        ("Makin banyak omics selalu makin baik",
         "Tiap omics = biaya + batch + kompleksitas. Tanpa hipotesis & n cukup, multi-omics = multi-noise. Integrasi butuh desain: sampel SAMA lintas omics, batch terkontrol, pertanyaan jelas."),
    ],
    "tips": [
        "Selalu cek <strong>pLDDT</strong> sebelum memakai struktur AlphaFold. Aturan praktis: >90 andal, 70\u201390 hati-hati, <70 jangan untuk desain presisi.",
        "Proteomik: pahami <strong>missing value</strong>-mu (MNAR vs MAR) sebelum imputasi. Imputasi buta = temuan palsu.",
        "Multi-omics: <strong>faktor bersama</strong> (MOFA) lebih berharga dari daftar per-omics. Cerita integratif > tumpukan daftar.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Skor Identifikasi Peptida",
            "intro": "Cocokkan spektra (massa fragmen) ke 3 kandidat peptida via skor sederhana. Lihat konsep target-decoy: tambahkan kandidat acak (decoy)!",
            "hint": "Tambahkan 3 decoy acak. Berapa yang menang? Itulah estimasi FDR versi mini \u2014 fondasi MaxQuant.",
            "code": (
                "# spektra observasi (massa fragmen)\n"
                "spektra = [100.1, 200.3, 315.2, 428.4, 541.6]\n"
                "# kandidat: nama -> massa fragmen teoritis\n"
                "kandidat = {'PEPTIDA': [100.0, 200.1, 315.0, 428.2, 541.5],\n"
                "            'PEPTIDB': [100.5, 210.0, 300.0, 400.0, 500.0],\n"
                "            'DECOY_X': [99.9, 200.4, 315.3, 428.5, 541.7]}\n"
                "def skor(obs, teor, tol=0.5):\n"
                "    cocok = sum(1 for o in obs if any(abs(o-t) < tol for t in teor))\n"
                "    return cocok/len(obs)\n"
                "hasil = sorted(((skor(spektra, t), n) for n, t in kandidat.items()), reverse=True)\n"
                "for s, n in hasil:\n"
                "    print(f'{n}: skor={s:.0%}')\n"
                "print()\n"
                "print('DECOY_X menang/tie -> curigai FDR!')\n"
                "print('MaxQuant: ribuan decoy -> FDR 1% yang terkontrol.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: mRNA vs Protein \u2014 Cari Diskrepansi",
            "intro": "Diberikan log2FC mRNA & protein 8 gen, hitung korelasi dan tandai gen dengan regulasi pasca-transkripsi (diskrepan).",
            "hint": "Gen diskrepan = kandidat regulasi translasi/degradasi. Dalam riset nyata, ini daftar untuk validasi (pulse-chase, proteasome inhibitor).",
            "code": (
                "mrna = {'A':1.0,'B':2.0,'C':3.0,'D':4.0,'E':5.0,'F':6.0,'G':7.0,'H':8.0}\n"
                "prot = {'A':1.1,'B':2.2,'C':0.2,'D':4.3,'E':5.1,'F':1.0,'G':7.2,'H':7.9}\n"
                "import statistics as st\n"
                "xm, xp = list(mrna.values()), list(prot.values())\n"
                "mx, mp = st.mean(xm), st.mean(xp)\n"
                "r = sum((a-mx)*(b-mp) for a,b in zip(xm,xp)) / \\\n"
                "    (sum((a-mx)**2 for a in xm)*sum((b-mp)**2 for b in xp))**0.5\n"
                "print(f'korelasi mRNA-protein: r={r:.2f}')\n"
                "print('gen diskrepan (|selisih|>2):')\n"
                "for g in mrna:\n"
                "    d = abs(mrna[g]-prot[g])\n"
                "    if d > 2:\n"
                "        arah = 'protein diredam' if mrna[g] > prot[g] else 'protein diperkuat'\n"
                "        print(f'  {g}: mRNA={mrna[g]}, protein={prot[g]} -> {arah}')\n"
                "print()\n"
                "print('C & F: mRNA naik, protein tidak -> degradasi/translasi.')\n"
                "print('Tanpa proteomik, keduanya terlihat \u201caktif\u201d.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh struktur cepat untuk hipotesis \u2192 AlphaFold + cek pLDDT",
            "kondisi": "Protein globular, MSA dalam.",
            "alasan": "Gratis, cepat, cukup untuk hipotesis.",
            "contoh": "Desain mutasi domain kinase.",
        },
        {
            "title": "Skrining virtual obat \u2192 Docking (Vina) + validasi in vitro",
            "kondisi": "Kantong ikatan jelas; library senyawa.",
            "alasan": "Funnel: 10.000 \u2192 100 \u2192 5 hit.",
            "contoh": "Hit untuk target kanker.",
        },
        {
            "title": "Ekspresi aktual / PTM \u2192 Proteomik MS",
            "kondisi": "mRNA tak cukup (selalu!).",
            "alasan": "Protein = lapisan aksi obat.",
            "contoh": "Fosforilasi jalur sinyal.",
        },
        {
            "title": "Mekanisme kompleks \u2192 Multi-omics (MOFA/network)",
            "kondisi": "n cukup; sampel sama lintas omics.",
            "alasan": "Sinyal terdistribusi antar lapisan.",
            "contoh": "Subtipe kanker TCGA.",
        },
    ],
    "aturan10": [
        "mRNA \u2260 protein (r~0,5).",
        "AlphaFold: cek pLDDT; statis bukan dinamis.",
        "Proteomik: FDR target-decoy 1%.",
        "Multi-omics: faktor bersama > tumpukan daftar.",
    ],
    "case": {
        "title": "\u201cObat dari Docking\u201d Tanpa Validasi",
        "body": [
            "<p>Tim komputasional melaporkan 3 kandidat obat dari docking ke struktur AlphaFold (pLDDT 55 di kantong ikatan). Manajemen ingin langsung paten + uji klinis.</p>",
        ],
        "pertanyaan": "Keberatanmu sebagai bioinformatikawan?",
        "pembahasan": "Tiga lampu merah: (1) pLDDT 55 di kantong = struktur tak terpercaya untuk docking presisi \u2014 pose bisa fiktif total; (2) docking \u2260 afinitas nyata: skor Vina berkorelasi lemah dengan Kd eksperimental; tanpa uji in vitro (binding/cell assay), kandidat = hipotesis; (3) tanpa ADMET/toksisitas, lompat ke klinik = berbahaya. Jalur benar: validasi struktur (kristal/CryoEM kantong) \u2192 docking ulang \u2192 uji in vitro 100 senyawa \u2192 optimasi lead \u2192 hewan \u2192 klinik. Pelajaran: komputasi mempercepat funnel, bukan melompati tahap. \u201cIn silico hit\u201d \u2260 obat \u2014 bedakan di setiap slide presentasi.",
    },
    "quiz": [
        ("pLDDT 45 pada suatu region AlphaFold artinya\u2026",
         ["Sangat yakin", "Tidak yakin (mungkin fleksibel/tak terstruktur) \u2014 jangan untuk desain presisi", "Error", "Harus dihapus"],
         1,
         "Benar: pLDDT = keyakinan per residu. <70 = jangan pakai untuk klaim presisi."),
        ("Korelasi mRNA-protein ~0,5 menunjukkan\u2026",
         ["RNA-seq gagal", "Regulasi pasca-transkripsi signifikan \u2014 proteomik dibutuhkan", "Protein tidak penting", "Data buruk"],
         1,
         "Benar: kesenjangan ini = alasan proteomik & multi-omics ada."),
        ("FDR 1% di proteomik diestimasi via\u2026",
         ["Feeling", "Target-decoy: cocokkan ke database + urutan terbalik", "Uji-t", "Tidak perlu"],
         1,
         "Benar: decoy mengukur tebakan. Tanpa itu, identifikasi = klaim tanpa kontrol."),
        ("Batasan utama AlphaFold untuk efek mutasi?",
         ["Tidak ada", "Tidak memprediksi efek mutasi titik secara andal + satu konformasi statis", "Terlalu lambat", "Berbayar"],
         1,
         "Benar: \u201cmutasi ini merusak struktur\u201d butuh validasi, bukan sekadar AF."),
        ("MOFA menemukan faktor laten yang menjelaskan variansi di SEMUA omics. Artinya?",
         ["Noise", "Sinyal biologis bersama \u2014 kandidat mekanisme/subtipe", "Batch effect pasti", "Error"],
         1,
         "Benar: orkestra, bukan solo. Faktor bersama = cerita integratif."),
        ("Docking virtual screening yang benar?",
         ["Langsung klinik", "Funnel: ribuan senyawa \u2192 skor \u2192 validasi in vitro \u2192 optimasi", "Skor terbaik = obat", "Tanpa struktur"],
         1,
         "Benar: komputasi mempercepat, bukan melompati. In silico \u2260 obat."),
    ],
    "rangkuman": [
        "Proteomik MS: <strong>spektra \u2192 peptida \u2192 protein</strong>; FDR target-decoy 1%.",
        "<strong>mRNA \u2260 protein</strong> (r~0,5) \u2014 proteomik mengisi kesenjangan.",
        "<strong>AlphaFold</strong>: struktur dari sekuens; baca <strong>pLDDT</strong>; statis, bukan dinamis.",
        "<strong>Docking</strong>: funnel virtual screening \u2014 validasi in vitro wajib.",
        "<strong>Multi-omics</strong> (MOFA/network): faktor bersama lintas lapisan.",
        "Desain: <strong>sampel sama</strong> lintas omics; koreksi batch per lapisan.",
        "Tiap omics = biaya + kompleksitas \u2014 hipotesis dulu.",
        "Komputasi <strong>mempercepat</strong> drug discovery, bukan melompati tahap.",
    ],
    "prev": ("bi14-metagenomik", "BI14"),
    "next": ("bi16-ml-bio", "BI16"),
}

# ================================================================ BI16
BI16 = {
    "slug": "bi16-ml-bio",
    "code": "BI16",
    "track": TRACK,
    "cover_title": "Leakage &amp; p >> n:<br />Machine Learning untuk Biologi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Model 99% yang Menipu"),
        ("ppn", "Tantangan p >> n &amp; Seleksi Fitur"),
        ("leakage", "Leakage: Homologi &amp; Batch"),
        ("cv", "Validasi yang Benar: Grouped CV"),
        ("dl", "Deep Learning Sekuens &amp; Protein LM"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Leakage Seleksi Fitur"),
        ("lab2", "\U0001f52c Lab 2: Grouped Split vs Acak"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan tantangan <strong>p >> n</strong> dan strategi seleksi fitur/regularisasi.",
        "Mengenali <strong>data leakage</strong> khas bio: homologi, batch, seleksi fitur di luar CV.",
        "Merancang <strong>validasi grouped</strong> (split by protein/pasien/studi).",
        "Menjelaskan aplikasi <strong>deep learning</strong>: CNN sekuens, protein language models.",
    ],
    "story_title": "Cerita Pembuka: Model 99% yang Menipu",
    "story": [
        "<p>Paper mengklaim model prediksi interaksi protein dengan akurasi 99%. Reproduksi oleh lab lain: <strong>62%</strong>. Investigasi: protein homolog (kerabat dekat) tersebar di train DAN test \u2014 model hanya menghafal keluarga protein, bukan belajar interaksi. 99% = hafalan, bukan kecerdasan.</p>",
        "<p>ML untuk biologi punya jebakan yang tidak ada di textbook ML umum: sekuens yang berkerabat, batch teknis, dan fitur 20.000 vs sampel 100. Lesson ini adalah panduan bertahan hidup \u2014 agar akurasimu nyata, bukan artefak leakage.</p>",
    ],
    "konsep": [
        {
            "id": "ppn",
            "title": "Tantangan p >> n \u2014 Si Kutukan Dimensi",
            "definisi": "<strong>p >> n</strong>: fitur (20.000 gen) jauh melebihi sampel (100 pasien). Model fleksibel akan <strong>menghafal noise</strong> (overfit). Senjata: <strong>regularisasi</strong> (Lasso/Ridge), <strong>seleksi fitur</strong>, reduksi dimensi, model sederhana dulu.",
            "kepribadian": "p>>n itu seperti ujian dengan 20.000 soal pilihan ganda tapi cuma 100 murid: selalu ada murid yang \u201ckebetulan\u201d benar semua \u2014 bukan karena pintar, tapi karena soalnya banyak. Regularisasi adalah pengawas yang menghukum hafalan.",
            "kapan": "Semua ML omics. Mulai dari Lasso/logistik + CV; naik ke kompleks bila data mendukung.",
            "worked": (
                "\U0001f4d0 Contoh: Lasso untuk signature gen",
                "<p>100 pasien, 20.000 gen \u2192 prediksi respons obat.<br />"
                "Random forest mentah: AUC train 1,0, CV 0,55 (hafalan!).<br />"
                "<strong>Lasso</strong> (L1): memaksa sebagian besar koefisien = 0 \u2192 15 gen terpilih, AUC CV 0,78.<br />"
                "15 gen = signature yang bisa divalidasi biologis \u2014 bukan 20.000 angka misterius.<br />"
                "Aturan: bila n<200, model linear teregularisasi sering mengalahkan deep learning.</p>",
            ),
            "rumus": r"\min_\beta \|y - X\beta\|^2 + \lambda\|\beta\|_1",
            "simbol": [
                (r"\|\beta\|_1", "penalti L1: jumlah |koefisien| \u2014 memaksa sparsitas"),
                (r"\lambda", "kekuatan regularisasi (dipilih via CV)"),
            ],
            "interpretasi": "Lasso = kuadrat terkecil + denda untuk koefisien besar. L1 mendorong TEPAT nol (seleksi fitur otomatis). Lambda via CV: terlalu kecil = overfit, terlalu besar = underfit.",
            "chart": {
                "var": "bi16LambdaData",
                "data": [{"x": [0.001, 0.01, 0.1, 1, 10], "y": [0.55, 0.72, 0.80, 0.76, 0.60], "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1", "width": 3}, "marker": {"size": 9}}],
                "title": "AUC vs Lambda (Lasso, ilustratif)",
                "layout": {"xaxis": {"title": "lambda (log)", "type": "log"}, "yaxis": {"title": "AUC (CV)"}, "showlegend": False},
                "cara": "X = kekuatan regularisasi (log), Y = performa validasi. Cari puncak kurva.",
                "interpretasi": "Lambda kecil = overfit (AUC rendah di validasi meski train sempurna). Lambda besar = underfit. Puncak = sweet spot via CV. Inilah cara memilih kompleksitas model secara prinsipil \u2014 bukan tebak-tebakan.",
            },
        },
        {
            "id": "leakage",
            "title": "Leakage: Homologi &amp; Batch \u2014 Si Bocoran",
            "definisi": "<strong>Leakage</strong>: info test bocor ke train \u2192 performa ilusi. Khas bio: <strong>homologi</strong> (kerabat di kedua set), <strong>batch</strong> (test dari batch sama), <strong>seleksi fitur</strong> sebelum split, <strong>duplikat</strong>.",
            "kepribadian": "Leakage itu seperti ujian bocor: murid (model) dapat soal sebelum ujian \u2014 nilainya 100 tapi tidak belajar apa-apa. Di biologi, soal bocor lewat kerabat (homologi): \u201csoal nomor 5 mirip soal latihan nomor 3\u201d.",
            "kapan": "Setiap ML bio. Audit wajib sebelum klaim performa.",
            "worked": (
                "\U0001f4d0 Contoh: tiga leakage klasik",
                "<p>1. <strong>Homologi:</strong> prediksi fungsi protein \u2014 split acak menaruh homolog di train+test \u2192 99% ilusi. Solusi: <strong>split by family</strong> (CD-HIT 40%) \u2192 70% jujur.<br />"
                "2. <strong>Seleksi fitur:</strong> pilih 100 gen dari SEMUA data lalu CV \u2192 bias. Solusi: seleksi <strong>di dalam</strong> tiap fold (nested).<br />"
                "3. <strong>Batch:</strong> train batch A, test batch A \u2192 model belajar batch. Solusi: test di batch/studi INDEPENDEN.</p>",
            ),
            "warning": "<strong>Checklist anti-leakage</strong> (tempel di dinding): (1) split BERDASARKAN unit independen (pasien/protein/studi), bukan baris; (2) SEMUA preprocessing/seleksi di dalam fold; (3) test set disentuh SEKALI; (4) curigai akurasi >95% di bio \u2014 verifikasi dengan split ketat.",
        },
        {
            "id": "cv",
            "title": "Validasi yang Benar: Grouped CV",
            "definisi": "<strong>Grouped CV</strong>: fold dibagi per grup (pasien, protein family, studi) \u2014 tidak ada grup yang muncul di train+test. <strong>Nested CV</strong>: loop dalam untuk tuning, luar untuk estimasi \u2014 tuning tidak mengontaminasi estimasi.",
            "kepribadian": "Grouped CV itu seperti ujian antar-sekolah: murid sekolah A tidak boleh ada di soal latihan DAN ujian \u2014 kalau tidak, nilainya mengukur hafalan teman sekelas, bukan pemahaman.",
            "kapan": "Selalu bila ada struktur grup. Standar untuk klaim performa yang jujur.",
            "worked": (
                "\U0001f4d0 Contoh: prediksi respons obat per pasien",
                "<p>Data: 1.000 sampel dari 100 pasien (10 sampel/pasien).<br />"
                "<strong>CV acak:</strong> sampel pasien sama di train+test \u2192 AUC 0,95 (model mengenali pasien, bukan penyakit!).<br />"
                "<strong>Grouped by pasien:</strong> AUC 0,72 \u2014 jujur dan generalizable.<br />"
                "0,95 adalah kebohongan yang meyakinkan; 0,72 adalah kebenaran yang berguna.</p>",
            ),
        },
        {
            "id": "dl",
            "title": "Deep Learning Sekuens &amp; Protein LM",
            "definisi": "<strong>CNN sekuens</strong>: deteksi motif (DeepBind). <strong>Protein language models</strong> (ESM, ProtT5): transformer dilatih jutaan sekuens \u2192 embedding untuk prediksi fungsi/struktur. <strong>Generatif</strong>: desain protein (RFdiffusion).",
            "kepribadian": "Protein LM itu seperti LLM untuk protein: setelah \u201cmembaca\u201d 250 juta sekuens, ia paham \u201ctata bahasa\u201d protein \u2014 mana yang \u201ckalimat\u201d wajar vs aneh. ESM embedding = representasi yang menangkap fungsi tanpa label.",
            "kapan": "Data besar (n>10rb) atau transfer learning via embedding. Untuk n kecil: embedding beku + model linear > training dari nol.",
            "worked": (
                "\U0001f4d0 Contoh: ESM untuk prediksi fungsi",
                "<p>500 protein berlabel fungsi (sedikit!).<br />"
                "Training CNN dari nol: overfit parah.<br />"
                "<strong>ESM embedding</strong> (beku) + regresi logistik: AUC 0,85 \u2713.<br />"
                "Pola: model besar pra-latih sebagai ekstraktor fitur; model kecil untuk tugas spesifik. Inilah cara DL bekerja di bio dengan n kecil.</p>",
            ),
            "callout": "<strong>Catatan lowongan:</strong> posting bioinformatika 2026 sering meminta \u201cmachine learning\u201d + \u201cPython/scikit-learn\u201d; yang membedakan kandidat adalah pemahaman validasi bio-spesifik (leakage homologi, grouped CV) \u2014 persis lesson ini \u2014 bukan sekadar bisa memanggil fit().",
        },
    ],
    "myths": [
        ("Akurasi 99% = model hebat",
         "Di bio, >95% hampir selalu patut dicurigai: leakage homologi/batch/duplikat. Model hebat = performa JUJUR di data independen, bukan angka besar di test bocor. Audit dulu, rayakan kemudian."),
        ("Deep learning selalu mengalahkan model klasik di bio",
         "Dengan n=100 dan p=20.000, Lasso/logistik sering menang \u2014 DL butuh data besar atau transfer learning. \u201cState-of-the-art\u201d tanpa mempertimbangkan n = cargo cult."),
        ("Cross-validation standar cukup untuk data biologis",
         "CV acak gagal bila ada struktur (pasien, homologi, batch). Butuh grouped/nested CV. CV yang salah = estimasi performa yang salah = keputusan yang salah."),
    ],
    "tips": [
        "Mulai dari <strong>baseline sederhana</strong> (logistik/Lasso) sebelum DL. Bila DL tidak mengalahkan baseline secara bermakna, pakai baseline \u2014 lebih interpretable, lebih cepat.",
        "Lakukan <strong>ablation leakage</strong>: bandingkan split acak vs grouped. Selisih besar = sinyal leakage \u2014 investigasi sebelum publikasi.",
        "Simpan <strong>seed + versi data + kode</strong> (BI17). Klaim ML tanpa reproduksibilitas = anekdot mahal.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Leakage Seleksi Fitur \u2014 Buktikan Sendiri",
            "intro": "Data murni noise (100 sampel, 1000 fitur acak). Seleksi 10 \u201cterbaik\u201d dari SEMUA data lalu CV \u2192 lihat akurasi ilusi. Lalu seleksi di dalam fold \u2192 jujur.",
            "hint": "Inilah dosa paling umum paper ML bio. Satu baris kode (seleksi di luar loop) = seluruh hasil tidak valid.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(5)\n"
                "n, p = 100, 1000\n"
                "X = [[random.gauss(0,1) for _ in range(p)] for _ in range(n)]\n"
                "y = [random.randint(0,1) for _ in range(n)]  # murni noise!\n"
                "def kor2(xs, ys):\n"
                "    mx, my = st.mean(xs), st.mean(ys)\n"
                "    return abs(sum((a-mx)*(b-my) for a,b in zip(xs,ys)))\n"
                "# DOSA: seleksi fitur dari SEMUA data\n"
                "skor = sorted(range(p), key=lambda j: kor2([X[i][j] for i in range(n)], y), reverse=True)[:10]\n"
                "# CV 5-fold sederhana dengan 10 fitur \u201cterbaik\u201d (bocor)\n"
                "benar = 0\n"
                "for fold in range(5):\n"
                "    test = list(range(fold*20, (fold+1)*20))\n"
                "    train = [i for i in range(n) if i not in test]\n"
                "    # classifier 1-NN centroid sederhana\n"
                "    for t in test:\n"
                "        d0 = sum((X[t][j]-st.mean(X[i][j] for i in train if y[i]==0))**2 for j in skor)\n"
                "        d1 = sum((X[t][j]-st.mean(X[i][j] for i in train if y[i]==1))**2 for j in skor)\n"
                "        if (d1 < d0) == (y[t]==1): benar += 1\n"
                "print(f'akurasi (seleksi BOCOR): {benar/n:.0%} <- dari NOISE MURNI!')\n"
                "print()\n"
                "print('Seleksi melihat test set -> 10 fitur \u201cterbaik\u201d dari noise.')\n"
                "print('Yang benar: seleksi ULANG di tiap fold (nested).')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Grouped Split vs Acak",
            "intro": "Simulasikan 10 pasien \u00d7 10 sampel dengan efek pasien kuat. Bandingkan CV acak vs grouped-by-pasien. Lihat ilusi 0,95 vs jujur 0,7.",
            "hint": "Efek pasien = \u201csidik jari\u201d teknis. Model yang mengenali pasien terlihat hebat tapi gagal di pasien baru \u2014 skenario deployment nyata.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(21)\n"
                "# 10 pasien x 10 sampel; label ~ efek pasien (sidik jari), bukan penyakit\n"
                "data = []\n"
                "for pasien in range(10):\n"
                "    sidik = random.gauss(0, 3)  # efek pasien kuat\n"
                "    label = 1 if sidik > 0 else 0\n"
                "    for _ in range(10):\n"
                "        data.append((pasien, [sidik + random.gauss(0,1) for _ in range(5)], label))\n"
                "def akurasi(train, test):\n"
                "    benar = 0\n"
                "    for _, xt, yt in test:\n"
                "        d0 = sum((a-st.mean(X[i][0] for i in range(len(train)) if train[i][2]==0))**2 for a in xt)\n"
                "        d1 = sum((a-st.mean(X[i][0] for i in range(len(train)) if train[i][2]==1))**2 for a in xt)\n"
                "        if (d1 < d0) == (yt==1): benar += 1\n"
                "    return benar/len(test)\n"
                "X = data\n"
                "# split acak\n"
                "idx = list(range(len(X))); random.shuffle(idx)\n"
                "acc_acak = akurasi([X[i] for i in idx[20:]], [X[i] for i in idx[:20]])\n"
                "# grouped by pasien\n"
                "test_p = {0, 1}\n"
                "acc_group = akurasi([d for d in X if d[0] not in test_p], [d for d in X if d[0] in test_p])\n"
                "print(f'CV acak           : {acc_acak:.0%} (model menghafal pasien!)')\n"
                "print(f'grouped by pasien : {acc_group:.0%} (jujur)')\n"
                "print()\n"
                "print('Deployment = pasien BARU. Hanya grouped yang mengukurnya.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "n kecil, p besar \u2192 Lasso/logistik + CV",
            "kondisi": "n<1000; butuh interpretasi.",
            "alasan": "Sederhana, teregularisasi, interpretable.",
            "contoh": "Signature 15 gen respons obat.",
        },
        {
            "title": "Ada struktur grup \u2192 Grouped/nested CV",
            "kondisi": "Pasien/homologi/batch/studi.",
            "alasan": "Estimasi jujur generalisasi.",
            "contoh": "Split by protein family.",
        },
        {
            "title": "n besar / sekuens \u2192 DL / protein LM",
            "kondisi": "Data cukup atau transfer learning.",
            "alasan": "Menangkap pola kompleks.",
            "contoh": "ESM embedding + logistik.",
        },
        {
            "title": "Klaim performa \u2192 Validasi independen",
            "kondisi": "Sebelum publikasi/deploy.",
            "alasan": "CV internal tak cukup untuk klaim kuat.",
            "contoh": "Test di kohort/studi lain.",
        },
    ],
    "aturan10": [
        "p>>n \u2192 regularisasi; mulai sederhana.",
        "Curigai akurasi >95%.",
        "Split by unit independen; seleksi di dalam fold.",
        "Test independen untuk klaim; simpan seed+versi.",
    ],
    "case": {
        "title": "Model Sepsis 97% Gagal di RS Lain",
        "body": [
            "<p>Model prediksi sepsis dari data EHR+genomik: AUC 0,97 di RS A. Deploy di RS B: AUC 0,61. Investigasi: fitur top = kode alat lab spesifik RS A + batch sekuensing; split acak menaruh pasien sama di train/test.</p>",
        ],
        "pertanyaan": "Diagnosis lengkap + perbaikan.",
        "pembahasan": "Triple failure: (1) leakage pasien (split acak), (2) fitur batch-spesifik (kode alat = proksi RS, bukan biologi), (3) tanpa validasi eksternal. Perbaikan: grouped split by pasien; buang fitur administratif/batch; validasi di RS B SEBELUM klaim; laporkan AUC jujur (~0,7). Pelajaran: 0,97 yang runtuh menjadi 0,61 = bukan model buruk, tapi EVALUASI buruk. Di ML klinis (HD12), evaluasi yang salah bisa membunuh \u2014 bukan sekadar memalukan.",
    },
    "quiz": [
        ("Strategi utama menghadapi p >> n?",
         ["Kumpulkan fitur lagi", "Regularisasi (Lasso), seleksi fitur, model sederhana + CV", "Deep learning selalu", "Tanpa validasi"],
         1,
         "Benar: hukum hafalan. 20.000 fitur vs 100 sampel butuh pengawas (lambda)."),
        ("Leakage homologi terjadi ketika\u2026",
         ["Data sedikit", "Protein kerabat ada di train DAN test \u2014 model menghafal keluarga", "Fitur banyak", "Tidak pernah"],
         1,
         "Benar: split by family (CD-HIT), bukan acak. 99% \u2192 70% jujur."),
        ("Seleksi fitur SEBELUM split CV menyebabkan\u2026",
         ["Lebih cepat", "Leakage: seleksi melihat test \u2014 performa ilusi bahkan dari noise", "Tidak apa", "Wajib"],
         1,
         "Benar: lab 1 membuktikan \u2014 noise murni bisa \u201cakurat\u201d. Nested!"),
        ("Grouped CV dibutuhkan ketika\u2026",
         ["Selalu acak saja", "Ada struktur grup (pasien/homologi/batch) \u2014 generalisasi = grup baru", "Data kecil", "Tidak pernah"],
         1,
         "Benar: deployment = pasien baru. Hanya grouped yang mengukur itu."),
        ("Untuk n=100, p=20.000, pilihan bijak?",
         ["Transformer dari nol", "Lasso/logistik teregularisasi + CV", "Tanpa model", "Hafalkan data"],
         1,
         "Benar: DL butuh data/transfer. Baseline sederhana sering menang di n kecil."),
        ("Cara memakai protein LM (ESM) dengan label sedikit?",
         ["Training dari nol", "Embedding beku + model linear kecil (transfer learning)", "Jangan pakai", "Hafalkan embedding"],
         1,
         "Benar: model besar sebagai ekstraktor fitur; model kecil untuk tugas. Pola standar n kecil."),
    ],
    "rangkuman": [
        "<strong>p >> n</strong>: regularisasi + seleksi + mulai sederhana.",
        "<strong>Leakage</strong> bio: homologi, batch, seleksi-di-luar-fold, duplikat.",
        "<strong>Grouped/nested CV</strong>: split by unit independen.",
        "Curigai <strong>akurasi >95%</strong> \u2014 audit dulu.",
        "Validasi <strong>independen</strong> untuk klaim performa.",
        "DL: untuk n besar; <strong>transfer via embedding</strong> untuk n kecil.",
        "Baseline sederhana dulu; kalahkan baru naik kelas.",
        "Simpan <strong>seed + versi + kode</strong> (BI17).",
    ],
    "prev": ("bi15-proteomik", "BI15"),
    "next": ("bi17-reprodusibilitas", "BI17"),
}

# ================================================================ BI17
BI17 = {
    "slug": "bi17-reprodusibilitas",
    "code": "BI17",
    "track": TRACK,
    "cover_title": "FAIR &amp; Etika Genetik:<br />Reprodusibilitas Bioinformatika",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Paper yang Tak Bisa Dijalankan"),
        ("repro", "Reprodusibilitas: Workflow + Container"),
        ("fair", "Prinsip FAIR untuk Data"),
        ("etika", "Privasi Genetik &amp; Etika"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Audit Reprodusibilitas"),
        ("lab2", "\U0001f52c Lab 2: Risiko Re-identifikasi"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>krisis reproduksibilitas</strong> dan solusinya: workflow manager + container.",
        "Menerapkan <strong>prinsip FAIR</strong> pada data dan kode.",
        "Menjelaskan risiko <strong>privasi genetik</strong> (re-identifikasi) dan mitigasinya.",
        "Menyebutkan kerangka <strong>etika riset genomik</strong> (consent, return of results).",
    ],
    "story_title": "Cerita Pembuka: Paper yang Tak Bisa Dijalankan",
    "story": [
        "<p>Paper Nature mengklaim metode baru. Tiga lab mencoba mereproduksi: <strong>tidak satu pun berhasil</strong>. Penyebab: parameter tak dilaporkan, versi tool beda, script \u201cfinal_v2_REAL.py\u201d hilang, data \u201ctersedia atas permintaan\u201d (tidak pernah dibalas). Metode brilian yang tidak bisa dipakai = tidak ada.</p>",
        "<p>Bioinformatika punya masalah reproduksibilitas akut: pipeline rapuh, dependensi neraka, data privat. Lesson ini mengajarkan cara membangun analisis yang TAHAN WAKTU \u2014 plus sisi etiknya: data genetik adalah data paling pribadi yang ada.</p>",
    ],
    "konsep": [
        {
            "id": "repro",
            "title": "Reprodusibilitas: Workflow + Container",
            "definisi": "<strong>Workflow manager</strong> (Nextflow, Snakemake): pipeline sebagai kode berversi \u2014 tiap langkah, parameter, input tercatat. <strong>Container</strong> (Docker/Singularity): lingkungan beku \u2014 tool versi X berjalan sama di mana pun. Kombinasi = analisis yang bisa dijalankan ulang 5 tahun kemudian.",
            "kepribadian": "Analisis tanpa workflow itu seperti resep masakan yang ditulis di tisu: \u201cmasak sampai matang\u201d \u2014 tidak ada yang bisa mengulanginya. Nextflow + Docker adalah buku resep standar dengan foto tiap langkah dan oven yang sama.",
            "kapan": "Setiap analisis >1 langkah atau dishare. Untuk HPC: Singularity/Apptainer (BI4).",
            "worked": (
                "\U0001f4d0 Contoh: anatomi pipeline reproduksibel",
                "<p>Analisis RNA-seq: Snakefile mendefinisikan trim \u2192 map \u2192 count; tiap rule: container (biocontainers/star:2.7.10a), parameter, input/output.<br />"
                "<strong>5 tahun kemudian:</strong> `snakemake --use-singularity` \u2192 hasil IDENTIK (atau error jelas bila data hilang).<br />"
                "Tanpa ini: \u201cSTAR versi berapa? parameter apa?\u201d \u2014 tidak terjawab, tidak terreproduksi.<br />"
                "Standar minimal: <strong>kode + versi tool + parameter + seed + data (atau akses)</strong>.</p>",
            ),
            "chart": {
                "var": "bi17ReproData",
                "data": [{"x": ["Kode saja", "+ versi tool", "+ container", "+ workflow"], "y": [15, 40, 70, 90], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["15%", "40%", "70%", "90%"], "textposition": "outside"}],
                "title": "Peluang Reproduksi vs Kelengkapan (ilustratif)",
                "layout": {"xaxis": {"title": "Tingkat dokumentasi"}, "yaxis": {"title": "Berhasil direproduksi (%)"}, "showlegend": False},
                "cara": "Batang = peluang lab lain berhasil menjalankan ulang analisismu pada tiap tingkat kelengkapan.",
                "interpretasi": "Kode saja = 15% (dependensi neraka). Tiap lapisan (versi, container, workflow) melipatgandakan peluang. Investasi 1 hari menulis workflow menghemat 1 bulan orang lain \u2014 termasuk dirimu 6 bulan lagi.",
            },
        },
        {
            "id": "fair",
            "title": "Prinsip FAIR untuk Data",
            "definisi": "<strong>FAIR</strong>: Findable (metadata + DOI/aksesi), Accessible (repositori, bukan \u201catas permintaan\u201d), Interoperable (format standar \u2014 BI3!), Reusable (lisensi + dokumentasi jelas).",
            "kepribadian": "FAIR itu seperti perpustakaan yang benar: buku berkatalog (findable), bisa dipinjam (accessible), berbahasa umum (interoperable), boleh difotokopi dengan aturan jelas (reusable). Data di harddisk pribadi = buku di gudang terkunci.",
            "kapan": "Setiap publikasi: deposit data (GEO/SRA/ENA), kode (GitHub/Zenodo+DOI), workflow. Syarat jurnal top sekarang.",
            "worked": (
                "\U0001f4d0 Contoh: FAIR checklist publikasi",
                "<p><strong>F:</strong> GEO GSE12345 + metadata MIAME lengkap.<br />"
                "<strong>A:</strong> SRA publik saat publikasi (bukan embargo abadi).<br />"
                "<strong>I:</strong> count matrix TSV + format standar (BI3).<br />"
                "<strong>R:</strong> lisensi CC-BY + README + Snakefile.<br />"
                "Reviewer 2026: tidak ada aksesi = tidak lolos review. \u201cTersedia atas permintaan\u201d = red flag (studi: 90%+ tidak dibalas).</p>",
            ),
        },
        {
            "id": "etika",
            "title": "Privasi Genetik &amp; Etika \u2014 Si Penjaga Terakhir",
            "definisi": "DNA adalah <strong>identifier pamungkas</strong>: 30\u201380 SNP acak cukup mengidentifikasi individu; kerabat bisa diidentifikasi via database genealogi (kasus Golden State Killer!). <strong>Mitigasi</strong>: controlled access (dbGaP/EGA), de-identifikasi, Data Access Committee, consent luas vs spesifik.",
            "kepribadian": "Data genetik itu seperti sidik jari yang tidak bisa diganti DAN milik seluruh keluargamu. Membagikannya = membagikan sebagian identitas orang tuamu, saudaramu, anakmu \u2014 tanpa mereka ikut tanda tangan.",
            "kapan": "Setiap riset genomik manusia: IRB/ethics approval, consent, rencana data sharing SEBELUM kumpul data.",
            "worked": (
                "\U0001f4d0 Contoh: dilema return of results",
                "<p>Sekuensing riset menemukan varian BRCA1 patogenik pada partisipan yang consent \u201cuntuk riset saja\u201d.<br />"
                "<strong>Pertanyaan etik:</strong> beri tahu? (menyelamatkan nyawa vs melanggar otonomi + consent terbatas).<br />"
                "Praktik baik: <strong>consent berlapis</strong> sejak awal (\u201cmaukah diberi tahu temuan kesehatan penting?\u201d) + jalur validasi klinis + konseling genetik.<br />"
                "<strong>Aturan:</strong> temuan riset \u2260 diagnosis klinis \u2014 butuh validasi lab tersertifikasi sebelum dikomunikasikan.</p>",
            ),
            "warning": "<strong>Untuk Indonesia:</strong> keragaman genetik = kekayaan riset TAPI juga kerentanan: eksploitasi (biopiracy) bila sampel mengalir tanpa tata kelola. Pastikan: Material Transfer Agreement, persetujuan etik nasional, dan manfaat balik ke komunitas. Data genetik Indonesia harus dikelola untuk Indonesia.",
            "rumus": r"N_{\text{profil}} = 3^k \gg N_{\text{manusia}}",
            "simbol": [
                (r"k", "jumlah SNP acak yang diketahui"),
                (r"N_{\text{profil}}", "jumlah profil genotipe yang mungkin (3 genotipe per SNP)"),
                (r"N_{\text{manusia}}", "populasi manusia (~8 miliar)"),
            ],
            "interpretasi": "3^30 \u2248 2\u00d710^14 kemungkinan profil vs 8 miliar manusia \u2192 profil 30 SNP praktis unik. Inilah matematika di balik \u201cpuluhan SNP = sidik jari\u201d \u2014 bukan opini, tapi kombinatorik.",
            "chart": {
                "var": "bi17IdentData",
                "data": [{"x": [10, 30, 50, 80, 100], "y": [5, 60, 85, 97, 99], "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1", "width": 3}, "marker": {"size": 9}}],
                "title": "SNP Acak vs Peluang Identifikasi (ilustratif)",
                "layout": {"xaxis": {"title": "Jumlah SNP acak"}, "yaxis": {"title": "Teridentifikasi unik (%)"}, "showlegend": False},
                "cara": "X = jumlah SNP acak yang diketahui, Y = peluang cocok unik ke satu individu di database.",
                "interpretasi": "Hanya 30\u201380 SNP acak \u2014 dari 10 juta! \u2014 cukup mengidentifikasi seseorang. \u201cAnonimisasi\u201d dengan menghapus nama = ilusi untuk data genetik. Inilah kenapa controlled access (dbGaP/EGA) bukan paranoia, tapi keharusan.",
            },
        },
    ],
    "myths": [
        ("Hapus nama = data genetik anonim",
         "30\u201380 SNP mengidentifikasi individu; kerabat teridentifikasi via genealogi. Anonimisasi klasik GAGAL untuk DNA. Perlakukan data genetik sebagai identifiable SELALU \u2014 controlled access + perjanjian."),
        ("Reprodusibilitas = jalankan ulang dapat angka sama persis",
         "Ada tingkat: <strong>reproducible</strong> (kode+data sama \u2192 hasil sama), <strong>replicable</strong> (data baru \u2192 kesimpulan sama). Keduanya berharga; jangan menuntut bit-identical untuk data stokastik \u2014 tuntut kesimpulan yang bertahan."),
        ("Etik = urusan komite, bukan bioinformatikawan",
         "Kamu yang menulis pipeline yang memproses data manusia. Consent, akses, dan keamanan ADA di tanganmu (enkripsi, kontrol akses, audit). \u201cSaya cuma analisis\u201d bukan pembelaan."),
    ],
    "tips": [
        "Mulai SETIAP proyek dengan <strong>repo + README + environment</strong> (conda env / container). 1 jam di awal menghemat 1 minggu di akhir.",
        "<strong>Version-kan data</strong> juga (DVC / checksum). Kode berversi + data tak berversi = setengah reproduksibel.",
        "Untuk data manusia: <strong>threat-model</strong> sebelum analisis \u2014 siapa bisa akses apa, di mana disimpan, berapa lama. Tulis dalam protokol etik.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Audit Reprodusibilitas Paper",
            "intro": "Diberikan checklist 8 item, nilai dua \u201cpaper\u201d (A: lengkap, B: tipikal). Hitung skor dan putuskan mana yang lolos standar jurnal top.",
            "hint": "Gunakan checklist ini untuk analisismu sendiri SEBELUM submit. Reviewer 2026 memeriksanya \u2014 jadilah reviewer pertamamu.",
            "code": (
                "checklist = ['kode tersedia', 'versi tool', 'parameter tercatat',\n"
                "             'seed tercatat', 'data terdeposit (aksesi)', 'workflow/container',\n"
                "             'README cara jalan', 'lisensi jelas']\n"
                "paperA = [1,1,1,1,1,1,1,1]\n"
                "paperB = [1,0,0,0,0,0,1,0]  # \u201ckode di github, data atas permintaan\u201d\n"
                "for nama, p in [('Paper A (lengkap)', paperA), ('Paper B (tipikal)', paperB)]:\n"
                "    skor = sum(p)/len(p)\n"
                "    print(f'{nama}: {skor:.0%}')\n"
                "    kurang = [c for c, v in zip(checklist, p) if not v]\n"
                "    if kurang:\n"
                "        print(f'   kurang: {kurang}')\n"
                "print()\n"
                "print('Jurnal top 2026: butuh ~100% untuk metode komputasional.')\n"
                "print('Paper B = cerita pembuka lesson ini (tak terreproduksi).')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Berapa SNP untuk Mengidentifikasi?",
            "intro": "Simulasikan database 10.000 individu \u00d7 SNP acak. Lihat berapa SNP dibutuhkan agar satu profil menjadi unik. Rasakan kenapa \u201canonim\u201d itu ilusi.",
            "hint": "Hasilnya kecil (puluhan!). Inilah argumen matematis untuk controlled access \u2014 bukan opini, tapi kombinatorik.",
            "code": (
                "import random\n"
                "random.seed(42)\n"
                "N, TOTAL_SNP = 2000, 200\n"
                "# database: tiap individu = vektor genotipe acak\n"
                "db = [[random.randint(0,2) for _ in range(TOTAL_SNP)] for _ in range(N)]\n"
                "target = db[0]\n"
                "for n_snp in [5, 10, 20, 30, 50]:\n"
                "    cocok = sum(1 for ind in db if ind[:n_snp] == target[:n_snp])\n"
                "    unik = 'UNIK -> TERIDENTIFIKASI' if cocok == 1 else f'{cocok} kandidat'\n"
                "    print(f'{n_snp:>3} SNP: {unik}')\n"
                "print()\n"
                "print('Puluhan SNP acak = sidik jari. Hapus nama tidak membantu.')\n"
                "print('Kesimpulan: data genetik = identifiable, selalu.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Analisis dishare/dipublikasi \u2192 Workflow + container + FAIR",
            "kondisi": "Setiap publikasi/kolaborasi.",
            "alasan": "Standar jurnal; tahan waktu.",
            "contoh": "Snakemake + Singularity + GEO.",
        },
        {
            "title": "Data genomik manusia \u2192 Controlled access + etik",
            "kondisi": "Selalu; tanpa kecuali.",
            "alasan": "Identifiable; consent; hukum.",
            "contoh": "EGA + Data Access Committee.",
        },
        {
            "title": "HPC cluster \u2192 Singularity/Apptainer",
            "kondisi": "Docker tidak diizinkan (root).",
            "alasan": "Aman untuk multi-user HPC.",
            "contoh": "Nextflow + Singularity di cluster.",
        },
        {
            "title": "Temuan klinis dari riset \u2192 Validasi + konseling",
            "kondisi": "Varian patogenik pada partisipan.",
            "alasan": "Riset \u2260 diagnosis; otonomi.",
            "contoh": "BRCA1: validasi lab + konselor.",
        },
    ],
    "aturan10": [
        "Kode + versi + parameter + seed + data.",
        "Workflow + container = tahan waktu.",
        "FAIR: bukan \u201catas permintaan\u201d.",
        "DNA = identifiable, selalu.",
    ],
    "case": {
        "title": "Database \u201cAnonim\u201d yang Bocor Identitas",
        "body": [
            "<p>Biobank merilis 5.000 genom \u201cteranonimkan\u201d (nama dihapus) sebagai open access. Peneliti menunjukkan 40% bisa diidentifikasi via database genealogi publik + metadata usia/wilayah.</p>",
        ],
        "pertanyaan": "Respons tata kelola yang benar?",
        "pembahasan": "Tarik rilis terbuka; migrasi ke controlled access (aplikasi + komite + perjanjian). Audit: siapa mengunduh? Notifikasi partisipan (kewajiban etik). Perbaiki SOP: (1) tidak ada genom manusia sebagai open download \u2014 summary stats boleh; (2) threat modeling SEBELUM rilis; (3) consent harus mencakup risiko re-identifikasi (jujur, bukan \u201canonim\u201d). Pelajaran: sekali rilis, tidak bisa ditarik dari internet. Keputusan akses data adalah SATU ARAH \u2014 buat dengan standar tertinggi di awal, bukan setelah insiden.",
    },
    "quiz": [
        ("Komponen minimal analisis reproduksibel?",
         ["Kode saja", "Kode + versi tool + parameter + seed + data/akses", "Paper PDF", "Tidak ada standar"],
         1,
         "Benar: lima komponen. Kurang satu = teka-teki untuk penerusmu."),
        ("Kenapa container (Docker/Singularity) penting?",
         ["Lebih cepat", "Lingkungan beku: versi tool sama di mana pun, kapan pun", "Gratis", "Wajib hukum"],
         1,
         "Benar: dependensi neraka adalah pembunuh reproduksibilitas #1."),
        ("FAIR: \u2018A\u2019 (Accessible) berarti\u2026",
         ["Gratis", "Di repositori dengan akses jelas \u2014 bukan \u2018atas permintaan\u2019", "Tanpa login", "Mudah dibaca"],
         1,
         "Benar: 90%+ \u201catas permintaan\u201d tidak dibalas. Akses = mekanisme, bukan janji."),
        ("Berapa SNP acak untuk identifikasi unik?",
         ["Jutaan", "Puluhan (30\u201380) \u2014 cukup dari 10 juta", "Semua", "Tidak mungkin"],
         1,
         "Benar: kombinatorik. Anonimisasi nama = ilusi untuk DNA."),
        ("Temuan BRCA1 patogenik di data riset. Langkah tepat?",
         ["Langsung telepon partisipan", "Ikuti protokol consent: validasi lab tersertifikasi + konseling genetik", "Abaikan", "Publikasikan nama"],
         1,
         "Benar: riset \u2260 diagnosis. Otonomi + validitas sebelum komunikasi."),
        ("Untuk HPC multi-user, container yang tepat?",
         ["Docker (butuh root)", "Singularity/Apptainer (aman tanpa root)", "Tanpa container", "VM"],
         1,
         "Benar: Docker daemon butuh root = ditolak admin HPC. Singularity dirancang untuk ini."),
    ],
    "rangkuman": [
        "Reprodusibilitas = <strong>workflow + container + versi + seed + data</strong>.",
        "<strong>Nextflow/Snakemake</strong> + <strong>Docker/Singularity</strong> = standar.",
        "<strong>FAIR</strong>: Findable, Accessible, Interoperable, Reusable.",
        "\u201cTersedia atas permintaan\u201d = tidak tersedia.",
        "DNA <strong>selalu identifiable</strong> (puluhan SNP cukup).",
        "Data manusia \u2192 <strong>controlled access + etik + consent</strong> sejak awal.",
        "Keputusan rilis data <strong>satu arah</strong> \u2014 standar tertinggi di awal.",
        "Tata kelola genetik Indonesia: <strong>untuk Indonesia</strong>.",
    ],
    "prev": ("bi16-ml-bio", "BI16"),
    "next": ("bi18-capstone-de", "BI18"),
}

# ================================================================ BI18 (capstone)
BI18 = {
    "slug": "bi18-capstone-de",
    "code": "BI18",
    "track": TRACK,
    "cover_title": "Capstone: End-to-End<br />Differential Expression Nyata",
    "meta": "60\u201390 menit \u2022 proyek mini end-to-end \u2022 integrasi BI1\u2013BI17",
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Dari Nol ke Paper"),
        ("brief", "Brief Proyek"),
        ("tahap1", "Tahap 1: QC &amp; Desain (BI8+BI10)"),
        ("tahap2", "Tahap 2: Normalisasi &amp; DE (BI9)"),
        ("tahap3", "Tahap 3: Interpretasi (BI9+BI13)"),
        ("tahap4", "Tahap 4: Laporan Reproduksibel (BI17)"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Pipeline DE Mini"),
        ("lab2", "\U0001f52c Lab 2: Seleksi Kandidat &amp; Justifikasi"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjalankan <strong>alur DE end-to-end</strong>: QC \u2192 normalisasi \u2192 uji \u2192 koreksi \u2192 interpretasi.",
        "Menerapkan <strong>semua QC</strong>: batch (BI10), komposisi (BI9), anotasi (BI2).",
        "Menulis <strong>laporan reproduksibel</strong> (BI17) dengan keterbatasan jujur.",
        "Menilai <strong>kapan berhenti</strong>: bedakan temuan vs artefak.",
    ],
    "story_title": "Cerita Pembuka: Dari Nol ke Paper",
    "story": [
        "<p>Bayangkan 8 minggu lalu kamu tidak tahu apa itu FASTQ. Hari ini: kamu mengunduh data RNA-seq publik kanker dari GEO, menjalankan QC, menemukan batch effect, mengoreksinya, menjalankan DE, dan menulis laporan dengan 12 gen kandidat + pathway \u2014 lengkap dengan keterbatasan. Itulah yang dilakukan bioinformatikawan profesional setiap hari.</p>",
        "<p>Capstone ini mensimulasikan proyek nyata end-to-end pada data simulasi realistis (pola dari GEO nyata). Tidak ada jawaban di belakang buku \u2014 ada keputusan yang harus kamu buat dan pertahankan, seperti profesional.</p>",
    ],
    "konsep": [
        {
            "id": "brief",
            "title": "Brief Proyek",
            "definisi": "<strong>Dataset:</strong> RNA-seq 12 sampel (6 tumor, 6 normal) \u00d7 500 gen \u2014 simulasi realistis: ada batch effect, 30 gen DE sejati, noise overdispersed. <strong>Misi:</strong> temukan gen DE + interpretasi biologis + laporan. <strong>Deliverable:</strong> daftar gen (padj<0,05), volcano, pathway, laporan 1 halaman.",
            "kepribadian": "Capstone ini seperti ujian SIM: bukan menghafal rambu (teori BI1\u2013BI17), tapi mengemudi di jalan nyata \u2014 dengan lubang (batch), tanjakan (multiple testing), dan rambu membingungkan (noise).",
            "kapan": "Pola kerja ini = 80% pekerjaan bioinformatikawan: terima data \u2192 QC \u2192 analisis \u2192 cerita.",
            "worked": (
                "\U0001f4d0 Contoh: rencana kerja 60 menit",
                "<p><strong>0\u201310':</strong> Eksplorasi: PCA + label batch/kondisi (BI10). Temukan batch!<br />"
                "<strong>10\u201325':</strong> Normalisasi size-factor + DE per gen dengan model NB (BI9).<br />"
                "<strong>25\u201340':</strong> FDR + volcano; pilih kandidat (efek + signifikansi).<br />"
                "<strong>40\u201355':</strong> Enrichment pathway (BI9); cek anotasi gen top (BI2).<br />"
                "<strong>55\u201360':</strong> Tulis laporan + keterbatasan (BI17).<br />"
                "Disiplin waktu = skill profesional: analisis tak pernah \u201cselesai\u201d, hanya \u201ccukup\u201d.</p>",
            ),
        },
        {
            "id": "tahap1",
            "title": "Tahap 1: QC &amp; Desain (BI8+BI10)",
            "definisi": "Sebelum SATU PUN uji: PCA berlabel, cek batch, cek outlier. Keputusan desain (formula) dibuat DI SINI \u2014 bukan setelah melihat hasil.",
            "kepribadian": "Tahap ini seperti cek pra-penerbangan: membosankan, tidak heroik, dan satu-satunya yang mencegah kecelakaan. Pilot yang melewatkannya = berita.",
            "kapan": "Selalu pertama. Tidak ada pengecualian.",
            "worked": (
                "\U0001f4d0 Contoh: temuan QC dataset capstone",
                "<p>PCA: PC1 memisahkan batch (A/B), PC2 memisahkan tumor/normal.<br />"
                "Batch seimbang antar kondisi (3+3 tiap batch) \u2713 \u2192 bisa dikoreksi.<br />"
                "Satu sampel tumor outlier ekstrem (kemungkinan gagal library) \u2192 buang dengan justifikasi tercatat.<br />"
                "<strong>Desain:</strong> ~batch + kondisi. Keputusan ini dibuat SEBELUM DE \u2014 mengubah desain setelah lihat hasil = p-hacking.</p>",
            ),
            "chart": {
                "var": "bi18PcaData",
                "data": [{"x": [-3, -2.5, -2.8, 3, 3.2, 2.9], "y": [-2, -1.5, 2, -1.8, 1.9, 2.2], "type": "scatter", "mode": "markers+text", "marker": {"color": "#2a7de1", "size": 11}, "text": ["N-A1", "N-A2", "N-B1", "T-A1", "T-A2", "T-B1"], "textposition": "top center", "name": ""}],
                "title": "PCA Sampel Capstone (ilustratif, 6 dari 12)",
                "layout": {"xaxis": {"title": "PC1 (batch)"}, "yaxis": {"title": "PC2 (kondisi)"}, "showlegend": False},
                "cara": "Titik = sampel (N=normal, T=tumor; A/B=batch). PC1 horizontal, PC2 vertikal.",
                "interpretasi": "PC1 memisahkan batch A (kiri) vs B (kanan); PC2 memisahkan N (bawah) vs T (atas). Batch nyata tapi seimbang \u2192 masukkan ke desain. Inilah 30 detik yang menentukan validitas seluruh analisis.",
            },
        },
        {
            "id": "tahap2",
            "title": "Tahap 2: Normalisasi &amp; DE (BI9)",
            "definisi": "Size factor (median-of-ratios) \u2192 model NB per gen \u2192 uji Wald \u2192 BH FDR. Jangan: RPM, uji-t, p mentah.",
            "kepribadian": "Tahap ini seperti menimbang dengan timbangan terkalibrasi: normalisasi = kalibrasi; NB = timbangan yang tepat untuk benda berisik; FDR = tidak mengklaim setiap debu sebagai emas.",
            "rumus": r"s_j = \text{median}_i \frac{K_{ij}}{(\prod_{v=1}^{m} K_{iv})^{1/m}}",
            "simbol": [
                (r"s_j", "size factor sampel j"),
                (r"K_{ij}", "count gen i di sampel j"),
                (r"(\prod_v K_{iv})^{1/m}", "rata-rata geometrik gen i lintas semua sampel"),
            ],
            "interpretasi": "Rasio tiap gen terhadap rata-rata geometriknya, lalu ambil MEDIAN \u2014 median kebal terhadap segelintir gen ekstrem (seperti MYC di BI9). Inilah jantung normalisasi DESeq2 yang kamu praktikkan di lab 1.",
            "kapan": "Inti analisis DE. Otomatisasi dengan DESeq2 bila tersedia; pahami manualnya via lab.",
            "worked": (
                "\U0001f4d0 Contoh: hasil DE dataset",
                "<p>500 gen \u2192 42 dengan padj<0,05. Dari 30 DE sejati: 27 tertangkap (power 90%), 15 false positive (FDR ~36%??).<br />"
                "Tunggu \u2014 FDR 5% kok 36% palsu? Karena n kecil + efek kecil: FDR mengontrol <em>rate</em>, bukan menjamin. Tambahkan filter |log2FC|>1 \u2192 30 gen, 25 sejati.<br />"
                "Pelajaran: threshold ganda (signifikansi + efek) = praktik standar untuk n kecil.</p>",
            ),
        },
        {
            "id": "tahap3",
            "title": "Tahap 3: Interpretasi (BI9+BI13)",
            "definisi": "Dari daftar gen ke cerita: enrichment pathway (GO/KEGG), cek literatur gen top, hubungkan dengan epigenetik bila ada. Satu gen tanpa konteks = trivia; pathway = biologi.",
            "kepribadian": "Tahap ini seperti menerjemahkan: daftar 30 gen berbahasa \u201cmesin\u201d menjadi paragraf berbahasa \u201cmanusia\u201d: \u201cprogram apoptosis aktif, siklus sel terhenti\u201d.",
            "kapan": "Setelah DE. Alokasikan waktu terbesar ke sini \u2014 interpretasi adalah nilai tambahmu.",
            "worked": (
                "\U0001f4d0 Contoh: cerita dataset capstone",
                "<p>Gen top: CDKN1A (naik, padj 1e-8), BAX (naik), MKI67 (turun).<br />"
                "Enrichment: \u201capoptosis\u201d (p=1e-6), \u201csiklus sel\u201d (p=1e-4).<br />"
                "Cerita: tumor mengaktifkan program kematian sel + menekan proliferasi \u2014 konsisten respons kemoterapi.<br />"
                "<strong>Keterbatasan:</strong> n=6/kelompok; tanpa validasi qPCR; batch dikoreksi tapi tidak dihilangkan total.</p>",
            ),
            "chart": {
                "var": "bi18EnrichData",
                "data": [{"x": [6, 4, 3.2, 2.5], "y": ["Apoptosis", "Siklus sel", "Respons DNA damage", "Angiogenesis"], "type": "bar", "orientation": "h", "marker": {"color": "#2a7de1"}, "text": ["1e-6", "1e-4", "6e-4", "3e-3"], "textposition": "outside"}],
                "title": "Enrichment Pathway (ilustratif)",
                "layout": {"xaxis": {"title": "-log10(p)"}, "yaxis": {"title": ""}, "showlegend": False},
                "cara": "Batang horizontal = signifikansi enrichment tiap pathway. Makin panjang makin kuat.",
                "interpretasi": "Apoptosis dominan \u2014 cerita utama. Tiga lainnya pendukung. Presentasikan 2\u20133 teratas dengan narasi, bukan 50 pathway mentah. Kurasi = profesionalisme.",
            },
        },
        {
            "id": "tahap4",
            "title": "Tahap 4: Laporan Reproduksibel (BI17)",
            "definisi": "Laporan 1 halaman: pertanyaan, metode (cukup untuk reproduksi), hasil utama (gambar + angka), keterbatasan JUJUR, langkah lanjut. Tanpa spin.",
            "kepribadian": "Laporan ini seperti berita, bukan iklan: fakta dulu, interpretasi jelas dibedakan, kekurangan diakui. Kepercayaan dibangun dari kejujuran tentang apa yang TIDAK kamu tahu.",
            "kapan": "Akhir setiap proyek. Template ini dipakai ulang selamanya.",
            "worked": (
                "\U0001f4d0 Contoh: kerangka laporan",
                "<p><strong>Pertanyaan:</strong> gen apa berubah tumor vs normal?<br />"
                "<strong>Metode:</strong> 12 sampel; QC PCA; desain ~batch+kondisi; NB + BH.<br />"
                "<strong>Hasil:</strong> 30 gen (padj<0,05, |log2FC|>1); apoptosis enriched.<br />"
                "<strong>Keterbatasan:</strong> n kecil; 1 outlier dibuang; tanpa validasi independen.<br />"
                "<strong>Lanjut:</strong> qPCR 5 gen top; kohort validasi.<br />"
                "Satu halaman ini lebih berharga dari 50 halaman tanpa keterbatasan.</p>",
            ),
            "callout": "<strong>Standar kelulusan capstone:</strong> (1) QC didokumentasikan + keputusan desain beralasan; (2) metode benar (NB, FDR, bukan uji-t/RPM); (3) kandidat dipilih dua dimensi (volcano); (4) interpretasi pathway, bukan daftar; (5) keterbatasan jujur; (6) kode + parameter tercatat (BI17).",
        },
    ],
    "myths": [
        ("Capstone = dapatkan jawaban \u201cbenar\u201d",
         "Tidak ada kunci jawaban \u2014 ada keputusan yang dipertahankan. Profesional dinilai dari ALASAN (kenapa desain ini? kenapa threshold ini?), bukan dari angka yang \u201ccocok\u201d. Dua analis bisa beda hasil dan keduanya benar bila alasannya kuat."),
        ("Analisis selesai saat dapat daftar gen",
         "Daftar gen = bahan mentah. Nilai = interpretasi + keputusan + komunikasi. Lesson ini sengaja memberi bobot besar pada tahap 3\u20134 \u2014 di situlah karir dibangun."),
        ("Keterbatasan melemahkan laporan",
         "Sebaliknya: keterbatasan yang diakui MEMPERKUAT kredibilitas. Reviewer/manager lebih percaya analis yang tahu batasnya daripada yang mengklaim sempurna. Kejujuran = strategi."),
    ],
    "tips": [
        "Kerjakan <strong>berurutan</strong>: jangan interpretasi sebelum QC beres. Tiap tahap mengunci keputusan tahap berikut.",
        "Catat <strong>setiap keputusan</strong> (buang outlier? threshold?) DENGAN alasan. Buku lab komputasional = jejak audit profesionalisme.",
        "Bandingkan temuanmu dengan <strong>literatur</strong> (BI2): gen top sudah dikenal di kanker ini? Konsisten = keyakinan; baru = butuh bukti ekstra.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Pipeline DE Mini End-to-End",
            "intro": "Dataset simulasi 12 sampel \u00d7 40 gen (5 DE sejati disisipkan). Jalankan: normalisasi median-rasio \u2192 uji per gen (aproksimasi) \u2192 BH \u2192 evaluasi: berapa DE sejati tertangkap?",
            "hint": "Dataset ini mensimulasikan overdispersi + batch kecil. Skor: presisi & recall vs kebenaran yang diketahui \u2014 kemewahan yang tidak ada di data nyata!",
            "code": (
                "import random, math, statistics as st\n"
                "random.seed(1234)\n"
                "GEN, N = 40, 12\n"
                "de_sejati = {5, 12, 23, 31, 37}  # kebenaran (tak terlihat analis!)\n"
                "# simulasi: 6 normal, 6 tumor; batch A/B\n"
                "data, meta = [], []\n"
                "for s in range(N):\n"
                "    tumor = s >= 6\n"
                "    batch = 'B' if s % 4 >= 2 else 'A'\n"
                "    meta.append((tumor, batch))\n"
                "    row = []\n"
                "    for g in range(GEN):\n"
                "        mu = 100\n"
                "        if g in de_sejati and tumor: mu = 400\n"
                "        if batch == 'B': mu *= 1.3\n"
                "        # overdispersed count (gamma-poisson)\n"
                "        lam = random.gammavariate(4, mu/4)\n"
                "        c = 0; p = lam/(1+lam)\n"
                "        while random.random() < p and c < 5000:\n"
                "            c += 1; p *= lam/(1+lam)\n"
                "        row.append(c)\n"
                "    data.append(row)\n"
                "# 1. size factor (median rasio vs rata-rata geometrik)\n"
                "sf = []\n"
                "for s in range(N):\n"
                "    r = []\n"
                "    for g in range(GEN):\n"
                "        gm = math.exp(sum(math.log(data[t][g]+1) for t in range(N))/N)\n"
                "        r.append((data[s][g]+1)/gm)\n"
                "    sf.append(st.median(r))\n"
                "# 2. uji per gen: bandingkan mean tumor vs normal (ternormalisasi)\n"
                "hasil = []\n"
                "for g in range(GEN):\n"
                "    tn = [data[s][g]/sf[s] for s in range(N) if meta[s][0]]\n"
                "    nn = [data[s][g]/sf[s] for s in range(N) if not meta[s][0]]\n"
                "    mt, mn = st.mean(tn), st.mean(nn)\n"
                "    lfc = math.log2((mt+1)/(mn+1))\n"
                "    # skor-t sederhana\n"
                "    se = (st.variance(tn)/len(tn) + st.variance(nn)/len(nn))**0.5\n"
                "    t = abs(mt-mn)/(se+1e-9)\n"
                "    hasil.append((t, lfc, g))\n"
                "hasil.sort(reverse=True)\n"
                "# 3. ambil top-8 sebagai \u201cDE\u201d\n"
                "pred = {g for _, _, g in hasil[:8]}\n"
                "tp = len(pred & de_sejati)\n"
                "print(f'diprediksi DE: {sorted(pred)}')\n"
                "print(f'sejati       : {sorted(de_sejati)}')\n"
                "print(f'true positive: {tp}/5, false positive: {len(pred)-tp}')\n"
                "print()\n"
                "print('Refleksi: gen mana yang lolos? Apakah batch mengecoh?')\n"
                "print('Di DESeq2 nyata: NB + shrinkage + BH -> lebih baik dari ini.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Seleksi Kandidat Dua Dimensi",
            "intro": "Diberikan 15 gen (log2FC + padj), terapkan aturan seleksi profesional (|log2FC|>1 & padj<0,05), lalu tulis justifikasi 1 kalimat per kandidat seperti di laporan.",
            "hint": "Latihan ini = 80% pekerjaan interpretasi. Bedakan \u201ckandidat validasi\u201d (kuat dua dimensi) dari \u201cmenarik tapi lemah\u201d.",
            "code": (
                "gen = [('CDKN1A',2.8,1e-8),('BAX',2.1,1e-6),('MKI67',-2.4,1e-7),\n"
                "       ('TP53',0.3,1e-9),('GAPDH',0.05,0.8),('MYC',3.5,0.06),\n"
                "       ('GEN_X',1.2,0.03),('GEN_Y',-1.5,0.02),('GEN_Z',4.0,0.2),\n"
                "       ('GEN_W',0.8,1e-4),('GEN_V',-0.9,0.04),('ACTB',0.1,0.5),\n"
                "       ('GEN_U',2.2,0.01),('GEN_T',-3.1,0.001),('GEN_S',1.0,0.049)]\n"
                "print('KANDIDAT (padj<0.05 & |log2FC|>1):')\n"
                "for g, fc, pa in gen:\n"
                "    if pa < 0.05 and abs(fc) > 1:\n"
                "        arah = 'naik' if fc > 0 else 'turun'\n"
                "        print(f'  {g}: {arah} {abs(fc):.1f}-fold (padj={pa:.0e})')\n"
                "print()\n"
                "print('DITOLAK tapi menarik:')\n"
                "for g, fc, pa in gen:\n"
                "    if not (pa < 0.05 and abs(fc) > 1) and (pa < 0.05 or abs(fc) > 1):\n"
                "        alasan = 'efek kecil' if abs(fc) <= 1 else 'tak signifikan'\n"
                "        print(f'  {g}: {alasan} -> butuh bukti tambahan, bukan kandidat utama')\n"
                "print()\n"
                "print('TP53: padj luar biasa tapi FC kecil -> bukan driver di sini.')\n"
                "print('MYC/GEN_Z: FC besar tapi tak signifikan -> JANGAN kejar.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Mulai proyek DE \u2192 Ikuti 4 tahap capstone",
            "kondisi": "Data RNA-seq baru.",
            "alasan": "QC \u2192 DE \u2192 interpretasi \u2192 laporan.",
            "contoh": "Template 60 menit lesson ini.",
        },
        {
            "title": "Batch terdeteksi \u2192 Koreksi bila seimbang; hentikan bila confounded",
            "kondisi": "PCA menunjukkan batch.",
            "alasan": "BI10: desain > analisis.",
            "contoh": "~batch + kondisi vs ulangi eksperimen.",
        },
        {
            "title": "Pilih kandidat \u2192 Dua dimensi (volcano)",
            "kondisi": "Dari tabel DE ke validasi.",
            "alasan": "Efek + keyakinan bersamaan.",
            "contoh": "|log2FC|>1 & padj<0,05.",
        },
        {
            "title": "Tulis laporan \u2192 Fakta + keterbatasan jujur",
            "kondisi": "Akhir proyek.",
            "alasan": "Kredibilitas = kejujuran.",
            "contoh": "Template 1 halaman tahap 4.",
        },
    ],
    "aturan10": [
        "QC dulu; desain dikunci sebelum hasil.",
        "NB + FDR; bukan uji-t/RPM/p mentah.",
        "Kandidat = dua dimensi volcano.",
        "Interpretasi = pathway + literatur.",
    ],
    "case": {
        "title": "Review Sejawat: Capstone-mu Dinilai",
        "body": [
            "<p>Kamu submit laporan capstone. Reviewer (teman sekelas) menemukan: kamu membuang 1 outlier TAPI tidak mencatat alasannya; threshold |log2FC|>1 dipilih SETELAH melihat hasil; pathway diambil 20 teratas tanpa kurasi.</p>",
        ],
        "pertanyaan": "Apakah kritiknya valid? Perbaiki.",
        "pembahasan": "Semuanya valid \u2014 tiga dosa klasik: (1) outlier tanpa jejak audit = tidak reproduksibel; catat alasan + tunjukkan hasil dengan/tanpa. (2) Threshold setelah lihat hasil = p-hacking ringan; tetapkan SEBELUM atau justifikasi biologis + tunjukkan sensitivitas. (3) 20 pathway tanpa kurasi = malas; pilih 2\u20133 dengan narasi. Perbaikan = revisi laporan dengan jejak keputusan lengkap. Pelajaran: standar kelulusan capstone (callout tahap 4) bukan hiasan \u2014 ia adalah definisi profesionalisme. Mampu menerima review = skill terakhir yang dipelajari lesson ini.",
    },
    "quiz": [
        ("Langkah PERTAMA proyek DE yang benar?",
         ["Jalankan DESeq2", "QC: PCA berlabel batch/kondisi + keputusan desain", "Buat volcano", "Tulis laporan"],
         1,
         "Benar: pra-penerbangan. Desain dikunci sebelum hasil \u2014 mengubah setelahnya = p-hacking."),
        ("Batch seimbang antar kondisi. Tindakan?",
         ["Abaikan", "Masukkan ke desain (~batch + kondisi)", "Buang data", "Tambah sampel"],
         1,
         "Benar: koreksi valid bila tidak confounded. Bila confounded total \u2192 ulangi."),
        ("Kandidat validasi dipilih dengan\u2026",
         ["p-value terkecil saja", "Dua dimensi: |log2FC|>1 DAN padj<0,05", "Fold change saja", "Acak"],
         1,
         "Benar: volcano dua dimensi. Satu dimensi = setengah informasi."),
        ("Outlier dibuang dengan benar ketika\u2026",
         ["Diam-diam", "Dicatat alasan + tunjukkan hasil dengan/tanpa outlier", "Tidak pernah dibuang", "Selalu dibuang"],
         1,
         "Benar: jejak audit. Keputusan tanpa catatan = tidak profesional."),
        ("Nilai terbesar analis bioinformatika ada di tahap\u2026",
         ["Running tool", "Interpretasi + komunikasi (pathway, cerita, laporan)", "Download data", "Install software"],
         1,
         "Benar: tool bisa otomatis; interpretasi + kejujuran = karir."),
        ("Keterbatasan yang diakui dalam laporan\u2026",
         ["Melemahkan", "MEMPERKUAT kredibilitas", "Dilarang", "Tidak dibaca"],
         1,
         "Benar: reviewer percaya analis yang tahu batasnya. Kejujuran = strategi."),
    ],
    "rangkuman": [
        "Alur profesional: <strong>QC \u2192 DE \u2192 interpretasi \u2192 laporan</strong>.",
        "Kunci desain <strong>sebelum</strong> lihat hasil (anti p-hacking).",
        "Metode benar: <strong>size factor, NB, FDR</strong>; kandidat dua dimensi.",
        "Interpretasi: <strong>pathway + literatur</strong>, bukan daftar gen.",
        "Catat <strong>setiap keputusan</strong> dengan alasan (jejak audit).",
        "Laporan 1 halaman: fakta + <strong>keterbatasan jujur</strong> + langkah lanjut.",
        "Terima review: standar kelulusan = definisi profesionalisme.",
        "Selamat \u2014 kamu kini berpikir seperti bioinformatikawan. Track 4 selesai!",
    ],
    "prev": ("bi17-reprodusibilitas", "BI17"),
    "next": ("/", "Daftar Materi"),
}

LESSONS = [BI13, BI14, BI15, BI16, BI17, BI18]
for L in LESSONS:
    qa_scan(L)
