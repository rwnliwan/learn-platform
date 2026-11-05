#!/usr/bin/env python3
"""Bioinformatics lessons BI7-BI12."""
from render import qa_scan

TRACK = "Bioinformatics"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ BI7
BI7 = {
    "slug": "bi7-filogenetika",
    "code": "BI7",
    "track": TRACK,
    "cover_title": "Filogenetika &amp; k-mer:<br />Pohon Kehidupan dari Data",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Virus Punya Silsilah"),
        ("pohon", "Pohon Filogenetik \u2014 Si Silsilah"),
        ("metode", "Metode: Jarak, Parsimoni, Likelihood"),
        ("kmer", "k-mer &amp; HMM Pengantar"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: UPGMA dari Nol"),
        ("lab2", "\U0001f52c Lab 2: Jarak k-mer Tanpa Alignment"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membaca <strong>pohon filogenetik</strong>: klad, node, panjang cabang, outgroup, bootstrap.",
        "Membedakan metode <strong>jarak (NJ/UPGMA), parsimoni, maximum likelihood</strong>.",
        "Menghitung <strong>jarak k-mer</strong> sebagai alternatif alignment-free.",
        "Menjelaskan konsep <strong>HMM</strong> untuk pemodelan sekuens (profil HMM).",
    ],
    "story_title": "Cerita Pembuka: Virus Punya Silsilah",
    "story": [
        "<p>Di ruang sidang, jaksa menunjukkan pohon filogenetik: virus HIV terdakwa <strong>bersarang di dalam klad</strong> virus korban \u2014 bukti transmisi yang dipakai di pengadilan nyata. Di sisi lain dunia, pohon SARS-CoV-2 yang diupdate harian melacak varian baru menyebar antar benua.</p>",
        "<p>Pohon filogenetik adalah silsilah yang direkonstruksi dari mutasi: makin mirip sekuens, makin dekat kekerabatan. Lesson ini mengajarkan cara membaca dan membangun silsilah molekuler \u2014 plus dua senjata modern: k-mer (tanpa alignment!) dan HMM.</p>",
    ],
    "konsep": [
        {
            "id": "pohon",
            "title": "Pohon Filogenetik \u2014 Si Silsilah",
            "definisi": "<strong>Pohon filogenetik</strong>: graf yang merepresentasikan hubungan evolusi \u2014 daun = sekuens saat ini, node dalam = leluhur, panjang cabang = jarak evolusi (substitusi per situs). <strong>Klad</strong> = kelompok monofiletik (leluhur + semua keturunannya).",
            "kepribadian": "Pohon filogeni itu seperti silsilah keluarga yang dibuat dari kemiripan wajah (sekuens): sepupu mirip, sepupu jauh beda. Tapi ingat: ini <em>rekonstruksi hipotesis</em>, bukan foto keluarga \u2014 metode beda bisa memberi pohon beda.",
            "kapan": "Lacak asal wabah, identifikasi spesies, studi evolusi gen, forensik transmisi.",
            "worked": (
                "\U0001f4d0 Contoh: membaca pohon 4 virus",
                "<p>((A,B),(C,D)): A dan B bersaudara (klad), C dan D bersaudara; dua klad bertemu di akar.<br />"
                "<strong>Panjang cabang</strong> A=0,01 = 1 substitusi per 100 situs sejak leluhur AB.<br />"
                "<strong>Outgroup</strong> (virus jauh) menentukan arah waktu (akar).<br />"
                "<strong>Bootstrap 95</strong> pada node AB = 95% pohon resampling mendukung klad ini \u2192 percaya diri.</p>",
            ),
            "chart": {
                "var": "bi7TreeData",
                "data": [{"x": [0, 0.5, 0.5, 1.0, 0, 0.5, 1.0], "y": [0, 0, 1, 1, 2, 2, 2], "type": "scatter", "mode": "lines", "line": {"color": "#2a7de1", "width": 2}, "showlegend": False},
                        {"x": [1.0, 1.0, 1.0], "y": [0, 1, 2], "type": "scatter", "mode": "markers+text", "marker": {"color": "#e8a838", "size": 10}, "text": ["A", "B", "C"], "textposition": "right", "showlegend": False}],
                "title": "Pohon Filogenetik Sederhana (kladogram)",
                "layout": {"xaxis": {"title": "Jarak evolusi"}, "yaxis": {"title": "", "showticklabels": False}, "showlegend": False},
                "cara": "Garis horizontal = panjang cabang (jarak evolusi); vertikal hanya pemisah. Titik kuning = daun (sekuens).",
                "interpretasi": "A dan B berbagi cabang (klad) \u2014 lebih dekat satu sama lain daripada ke C. Panjang cabang A\u2192leluhur pendek = sedikit mutasi. Inilah cara membaca semua pohon: cari klad (siapa bersaudara), lalu panjang cabang (seberapa jauh).",
            },
        },
        {
            "id": "metode",
            "title": "Metode: Jarak, Parsimoni, Likelihood \u2014 Tiga Filosofi",
            "definisi": "<strong>UPGMA/NJ</strong>: dari matriks jarak \u2192 gabungkan yang terdekat (cepat). <strong>Parsimoni</strong>: pohon dengan mutasi paling sedikit (Occam). <strong>Maximum likelihood</strong>: pohon yang memaksimalkan peluang data di bawah model evolusi (paling prinsipil, paling lambat).",
            "rumus": r"d_{JC} = -\frac{3}{4}\ln\left(1 - \frac{4p}{3}\right)",
            "simbol": [
                (r"d_{JC}", "jarak Jukes-Cantor (koreksi substitusi ganda)"),
                (r"p", "proporsi situs berbeda yang teramati"),
            ],
            "interpretasi": "Jarak mentah meremehkan evolusi jauh: situs bisa bermutasi 2x (A\u2192T\u2192G) tapi terlihat 1 beda. Koreksi JC memperbaiki \u2014 makin besar p, koreksi makin penting.",
            "worked": (
                "\U0001f4d0 Contoh: kapan UPGMA gagal",
                "<p>UPGMA mengasumsikan <strong>jam molekuler</strong> (laju mutasi sama di semua cabang).<br />"
                "Virus A bermutasi 10x lebih cepat dari B \u2192 UPGMA menempatkan A salah (long-branch attraction).<br />"
                "<strong>NJ</strong> tidak mengasumsikan jam \u2192 lebih robust. <strong>ML</strong> dengan model laju-bervariasi \u2192 terbaik untuk kasus sulit.<br />"
                "Aturan: eksplorasi cepat \u2192 NJ; publikasi \u2192 ML + bootstrap.</p>",
            ),
            "kepribadian": "UPGMA itu seperti menebak silsilah dari foto: cepat tapi buta perbedaan usia. Parsimoni itu detektif hemat: \u201cpenjelasan tersederhana biasanya benar\u201d. ML itu ilmuwan teliti: menghitung peluang tiap skenario di bawah model \u2014 lambat tapi paling bisa dipertahankan.",
            "kapan": "Eksplorasi/ribuan sekuens \u2192 NJ. Klaim evolusi serius \u2192 ML + model selection + bootstrap \u226570.",
        },
        {
            "id": "kmer",
            "title": "k-mer &amp; HMM \u2014 Si Tanpa-Alignment dan Si Penjaga Pola",
            "definisi": "<strong>k-mer</strong>: potongan sekuens panjang k; profil k-mer = vektor hitungan. Jarak antar profil \u2248 jarak evolusi \u2014 <strong>tanpa alignment</strong>. <strong>HMM (Hidden Markov Model)</strong>: model probabilistik dengan state tersembunyi \u2014 untuk profil protein (Pfam), gene finding, alignment.",
            "kepribadian": "k-mer itu seperti membandingkan dua buku dari frekuensi kata-katanya, tanpa membaca berurutan \u2014 kasar tapi super cepat untuk jutaan sekuens. HMM itu seperti penjaga pola: ia tahu \u201cdomain kinase biasanya terlihat seperti ini (dengan variasi)\u201d dan mengenali versi barunya.",
            "kapan": "k-mer: clustering metagenomik (BI14), estimasi cepat kemiripan, assembly. HMM: cari domain protein (Pfam), prediksi gen, anotasi.",
            "worked": (
                "\U0001f4d0 Contoh: k-mer untuk identifikasi cepat",
                "<p>Sampel misterius: hitung semua 4-mer (256 kemungkinan). Bandingkan profilnya dengan database via jarak Euclidean.<br />"
                "Kecocokan terbaik: <em>E. coli</em> (jarak 0,02) vs <em>Salmonella</em> (0,15) \u2192 identifikasi dalam detik, tanpa alignment.<br />"
                "<strong>HMM Pfam:</strong> profil HMM domain \u201cABC transporter\u201d discan ke proteom baru \u2192 temukan 30 anggota, termasuk yang identitasnya cuma 25% (BLAST gagal, HMM berhasil \u2014 karena HMM memakai pola posisi-spesifik).</p>",
            ),
            "rumus": r"D_{kmer}(A,B) = \sqrt{\sum_{w}(f_A(w) - f_B(w))^2}",
            "simbol": [
                (r"f_A(w)", "frekuensi k-mer w di sekuens A"),
            ],
            "interpretasi": "Jarak Euclidean profil k-mer: 0 = komposisi identik. Makin besar k, makin spesifik tapi makin sensitif terhadap error. k=21\u201331 umum untuk genom bakteri.",
        },
    ],
    "myths": [
        ("Pohon filogenetik = kebenaran evolusi yang pasti",
         "Pohon adalah <em>estimasi</em> di bawah model dan data tertentu. Bootstrap <70 atau metode beda \u2192 pohon beda = jangan overklaim. Laporkan selalu: metode, model, bootstrap. Pohon tanpa ukuran ketidakpastian = opini bergambar."),
        ("Makin mirip sekuens pasti makin dekat kekerabatan",
         "Konvergensi (sifat sama evolusi independen), transfer gen horizontal (bakteri!), dan laju mutasi beda bisa menipu. Satu gen \u2260 sejarah spesies \u2014 untuk spesies, pakai banyak gen (phylogenomics)."),
        ("k-mer terlalu kasar untuk dipakai serius",
         "k-mer adalah fondasi Kraken (klasifikasi metagenomik), Mash (jarak genom), dan assembler modern. Kasar \u2260 tidak berguna \u2014 untuk skala jutaan sekuens, kasar-dan-cepat mengalahkan presisi-dan-mustahil."),
    ],
    "tips": [
        "Selalu sertakan <strong>outgroup</strong> untuk mengakar pohon. Pohon tak berakar = silsilah tanpa arah waktu \u2014 setengah informasi hilang.",
        "Jangan percaya klad dengan <strong>bootstrap <70</strong>. Runtuhkan (collapse) menjadi politomi \u2014 kejujuran lebih baik dari resolusi palsu.",
        "Untuk data besar: <strong>k-mer/ML cepat dulu untuk eksplorasi</strong>, ML penuh untuk klad yang penting. Alokasikan komputasi ke pertanyaan, bukan ke semua cabang.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: UPGMA dari Nol",
            "intro": "Implementasi UPGMA: dari matriks jarak, gabungkan pasangan terdekat berulang. Lihat pohon Newick terbentuk.",
            "hint": "Ubah jarak D-c agar laju tidak seragam (jam rusak). Lihat UPGMA salah menempatkan \u2014 itulah long-branch attraction.",
            "code": (
                "# UPGMA sederhana untuk 4 taksa\n"
                "jarak = {('A','B'):0.2, ('A','C'):0.6, ('A','D'):0.7,\n"
                "         ('B','C'):0.6, ('B','D'):0.7, ('C','D'):0.3}\n"
                "def d(x, y):\n"
                "    return jarak.get((x,y), jarak.get((y,x), 0))\n"
                "klaster = ['A','B','C','D']\n"
                "pohon = {k:k for k in klaster}\n"
                "while len(klaster) > 1:\n"
                "    # cari pasangan terdekat\n"
                "    pas = min(((d(a,b),a,b) for i,a in enumerate(klaster)\n"
                "               for b in klaster[i+1:]))\n"
                "    _, a, b = pas\n"
                "    baru = f'({pohon[a]},{pohon[b]})'\n"
                "    print(f'gabung {a}+{b} (jarak {pas[0]}) -> {baru}')\n"
                "    # jarak rata-rata ke klaster lain\n"
                "    for k in klaster:\n"
                "        if k not in (a,b):\n"
                "            jarak[(baru,k)] = (d(a,k)+d(b,k))/2\n"
                "    klaster = [k for k in klaster if k not in (a,b)] + [baru]\n"
                "    pohon[baru] = baru\n"
                "print(f'\\nPohon Newick: {baru};')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Jarak k-mer Tanpa Alignment",
            "intro": "Hitung profil 3-mer dua sekuens dan jarak Euclidean. Bandingkan dengan jarak edit sederhana \u2014 lihat korelasinya.",
            "hint": "Coba k=2 vs k=5 pada sekuens mirip-tapi-bermutasi. k kecil = robust, k besar = spesifik. Pilih k sesuai pertanyaan.",
            "code": (
                "import math, itertools\n"
                "def profil_kmer(s, k):\n"
                "    prof = {}\n"
                "    for i in range(len(s)-k+1):\n"
                "        w = s[i:i+k]\n"
                "        prof[w] = prof.get(w, 0)+1\n"
                "    return prof\n"
                "def jarak_kmer(a, b, k):\n"
                "    pa, pb = profil_kmer(a,k), profil_kmer(b,k)\n"
                "    semua = set(pa)|set(pb)\n"
                "    return math.sqrt(sum((pa.get(w,0)-pb.get(w,0))**2 for w in semua))\n"
                "A = 'ATGCGATCGATCGATCGATCG'\n"
                "B = 'ATGCGATCGATCGATCGATCG'  # identik\n"
                "C = 'ATGCGATCGTTCGATCGATCG'  # 1 mutasi\n"
                "D = 'AAAAAAAAAAAAAAAAAAAAA'  # beda total\n"
                "for k in [2, 3, 5]:\n"
                "    print(f'k={k}: d(A,B)={jarak_kmer(A,B,k):.1f} '\n"
                "          f'd(A,C)={jarak_kmer(A,C,k):.1f} d(A,D)={jarak_kmer(A,D,k):.1f}')\n"
                "print()\n"
                "print('Tanpa alignment, tanpa DP O(n^2). Untuk jutaan sekuens,')\n"
                "print('ini satu-satunya yang praktis (Kraken, Mash).')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Eksplorasi cepat / ribuan sekuens \u2192 NJ atau k-mer",
            "kondisi": "Butuh gambaran cepat kekerabatan.",
            "alasan": "Cepat; cukup untuk hipotesis awal.",
            "contoh": "Clustering 10.000 genom bakteri.",
        },
        {
            "title": "Klaim evolusi publikasi \u2192 Maximum likelihood + bootstrap",
            "kondisi": "Pohonnya adalah hasil utama.",
            "alasan": "Prinsipil; ketidakpastian terkuantifikasi.",
            "contoh": "Asal-usul varian virus baru.",
        },
        {
            "title": "Cari domain protein jauh \u2192 Profil HMM (Pfam)",
            "kondisi": "Identitas <30% tapi fungsi diduga sama.",
            "alasan": "HMM menangkap pola posisi-spesifik; BLAST gagal di twilight zone.",
            "contoh": "Anotasi domain protein novel.",
        },
        {
            "title": "Data metagenomik besar \u2192 k-mer classifier (Kraken)",
            "kondisi": "Jutaan read, butuh klasifikasi cepat.",
            "alasan": "Alignment per read mustahil; k-mer praktis.",
            "contoh": "Profil taksonomi sampel usus (BI14).",
        },
    ],
    "aturan10": [
        "Baca klad + panjang cabang + bootstrap.",
        "Outgroup untuk akar; bootstrap <70 = runtuhkan.",
        "NJ untuk cepat, ML untuk klaim.",
        "k-mer untuk skala; HMM untuk pola jauh.",
    ],
    "case": {
        "title": "Wabah di RS: Transmisi atau Kebetulan?",
        "body": [
            "<p>5 pasien ICU terinfeksi bakteri sama dalam 2 minggu. Manajemen curiga transmisi nosokomial. Sekuensing: 5 genom bakteri.</p>",
            "<p>Pohon: 4 genom membentuk klad rapat (beda 2\u20135 SNP), 1 genom jauh (beda 200 SNP, klad lain). Bootstrap klad-4 = 99.</p>",
        ],
        "pertanyaan": "Interpretasi dan tindakan.",
        "pembahasan": "4 kasus = transmisi terkait (klaster klonal; ambang tipikal <10 SNP untuk bakteri ini) \u2014 investigasi PPI: tangan petugas, alat, ruangan. 1 kasus = infeksi komunitas kebetulan, bukan bagian wabah. Tindakan: fokus pada 4 (isolasi kohort, audit kebersihan), bukan lockdown seluruh ICU. Tanpa pohon, kelimanya akan diperlakukan sama \u2014 buang sumber daya + panik. Pelajaran: filogenetika mengubah \u201c5 kasus\u201d menjadi \u201c1 wabah + 1 sporadis\u201d \u2014 presisi yang menghemat intervensi.",
    },
    "quiz": [
        ("Bootstrap 95 pada suatu node artinya\u2026",
         ["95% mutasi benar", "95% pohon resampling mendukung klad itu \u2014 keyakinan tinggi", "95 basa", "Pohon 95% benar"],
         1,
         "Benar: ukuran dukungan, bukan kebenaran mutlak. <70 = jangan percaya kladnya."),
        ("UPGMA gagal ketika\u2026",
         ["Data sedikit", "Laju mutasi tidak seragam antar cabang (jam molekuler rusak)", "Sekuens pendek", "Selalu gagal"],
         1,
         "Benar: asumsi jam molekuler. Long-branch attraction menempatkan cabang cepat secara salah. Pakai NJ/ML."),
        ("Fungsi outgroup dalam pohon?",
         ["Hiasan", "Mengakar pohon \u2014 menentukan arah waktu evolusi", "Mempercepat", "Tidak ada"],
         1,
         "Benar: tanpa akar, tidak tahu mana leluhur mana keturunan."),
        ("Keunggulan k-mer atas alignment?",
         ["Lebih akurat selalu", "Skala: jutaan sekuens tanpa DP O(n\u00b2) \u2014 kasar tapi praktis", "Tidak ada", "Hanya untuk protein"],
         1,
         "Benar: trade-off presisi vs skala. Fondasi Kraken/Mash/assembler."),
        ("Profil HMM (Pfam) mengalahkan BLAST ketika\u2026",
         ["Sekuens identik", "Homologi jauh (<30% identitas) \u2014 pola posisi-spesifik masih terdeteksi", "Tidak pernah", "Database kecil"],
         1,
         "Benar: HMM memakai konservasi per posisi, bukan identitas global. Twilight zone = habitat HMM."),
        ("Transfer gen horizontal pada bakteri menyebabkan\u2026",
         ["Tidak ada masalah", "Pohon satu gen bisa beda dari sejarah spesies \u2014 butuh banyak gen", "Pohon selalu benar", "Mutasi berhenti"],
         1,
         "Benar: gen melompat antar spesies. Phylogenomics (banyak gen) untuk klaim spesies."),
    ],
    "rangkuman": [
        "Pohon = <strong>hipotesis evolusi</strong>: baca klad, cabang, bootstrap, outgroup.",
        "<strong>NJ</strong> cepat; <strong>ML</strong> prinsipil untuk klaim; parsimoni = hemat.",
        "Koreksi jarak (<strong>Jukes-Cantor</strong>) untuk substitusi ganda.",
        "<strong>k-mer</strong>: kemiripan tanpa alignment \u2014 skala metagenomik.",
        "<strong>HMM</strong>: pola posisi-spesifik untuk homologi jauh.",
        "Bootstrap <70 = runtuhkan; satu gen \u2260 sejarah spesies.",
        "Aplikasi: lacak wabah, forensik transmisi, anotasi domain.",
        "Fondasi untuk BI14 (metagenomik) dan BI12 (struktur populasi).",
    ],
    "prev": ("bi6-alignment", "BI6"),
    "next": ("bi8-ngs-pipeline", "BI8"),
}

# ================================================================ BI8
BI8 = {
    "slug": "bi8-ngs-pipeline",
    "code": "BI8",
    "track": TRACK,
    "cover_title": "QC sampai Variant Calling:<br />Pipeline NGS End-to-End",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Varian Hantu Rp2 Miliar"),
        ("teknologi", "Teknologi Sekuensing: Short vs Long Read"),
        ("qc", "QC &amp; Trimming"),
        ("mapping", "Mapping: BWA, Bowtie2, STAR"),
        ("calling", "Variant Calling &amp; Anotasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi QC &amp; Trimming"),
        ("lab2", "\U0001f52c Lab 2: Panggil Varian dari Pileup"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan alur <strong>pipeline NGS</strong>: QC \u2192 trimming \u2192 mapping \u2192 calling \u2192 anotasi.",
        "Membedakan <strong>short-read (Illumina) vs long-read (PacBio/ONT)</strong> dan memilih sesuai kebutuhan.",
        "Menjelaskan logika <strong>mapping</strong> (BWT) dan <strong>variant calling</strong> (model probabilistik, bukan hitung suara).",
        "Merancang <strong>QC checkpoint</strong> tiap tahap dan membaca metriknya (FastQC, MAPQ, Ts/Tv, Ti).",
    ],
    "story_title": "Cerita Pembuka: Varian Hantu Rp2 Miliar",
    "story": [
        "<p>Proyek sekuensing 500 pasien menelan Rp2 miliar. Hasil variant calling: 2 juta \u201cvarian langka kandidat penyakit\u201d. Tim validasi Sanger 100 kandidat \u2014 <strong>93 adalah artefak</strong>: adaptor tak ter-trim, mapping buruk di daerah repetitif, strand bias. Rp2 miliar menghasilkan 7 varian asli.</p>",
        "<p>Pipeline NGS bukan sekadar menjalankan tool berurutan \u2014 ia adalah rantai yang setiap sambungannya bisa bocor. Lesson ini membedah tiap sambungan: apa yang dilakukan tool, apa yang bisa salah, dan bagaimana mengetahuinya SEBELUM validasi mahal.</p>",
    ],
    "konsep": [
        {
            "id": "teknologi",
            "title": "Teknologi Sekuensing: Short vs Long Read",
            "definisi": "<strong>Illumina (short-read)</strong>: 150\u2013300 bp, akurasi 99,9%, murah \u2014 standar SNP/indel kecil. <strong>PacBio HiFi / ONT (long-read)</strong>: 10kb\u20131Mb, membaca daerah repetitif & varian struktural \u2014 mahal, error profil beda.",
            "kepribadian": "Short-read itu seperti memotret mural lewat 1 juta foto close-up tajam: detail sempurna, tapi susah merakit gambar besarnya (repetitif!). Long-read itu seperti foto panorama: buram di detail, tapi struktur besarnya jelas.",
            "kapan": "SNP/indel, RNA-seq, panel klinis \u2192 Illumina. Varian struktural, assembly de novo, daerah repetitif \u2192 long-read. Kanker/kompleks \u2192 kombinasi.",
            "worked": (
                "\U0001f4d0 Contoh: memilih untuk diagnosis",
                "<p>Bayi penyakit langka, WES Illumina negatif.<br />"
                "Dugaan: varian struktural (delesi besar) yang short-read lewatkan.<br />"
                "Keputusan: <strong>long-read (ONT/PacBio)</strong> \u2192 ditemukan delesi 5kb di gen kandidat.<br />"
                "Pelajaran: negatif di satu teknologi \u2260 tidak ada varian \u2014 mungkin teknologinya buta.</p>",
            ),
            "chart": {
                "var": "bi8TechData",
                "data": [{"x": ["Illumina", "PacBio HiFi", "ONT"], "y": [0.1, 0.5, 5], "type": "bar", "name": "Error %", "marker": {"color": "#2a7de1"}},
                        {"x": ["Illumina", "PacBio HiFi", "ONT"], "y": [150, 15000, 50000], "type": "bar", "name": "Panjang read (bp)", "marker": {"color": "#e8a838"}, "yaxis": "y2"}],
                "title": "Short vs Long Read: Error vs Panjang",
                "layout": {"xaxis": {"title": "Teknologi"}, "yaxis": {"title": "Error (%)"}, "yaxis2": {"title": "Panjang (bp, log)", "overlaying": "y", "side": "right", "type": "log"}, "showlegend": True},
                "cara": "Biru (kiri) = tingkat error; kuning (kanan, log) = panjang read. Bandingkan trade-off-nya.",
                "interpretasi": "Illumina: error terkecil tapi read pendek. Long-read: 100\u2013300x lebih panjang dengan error lebih besar (HiFi sudah jauh membaik). Tidak ada yang \u201cterbaik\u201d \u2014 ada yang cocok untuk pertanyaanmu.",
            },
        },
        {
            "id": "qc",
            "title": "QC &amp; Trimming \u2014 Si Gerbang Pertama",
            "definisi": "<strong>FastQC</strong>: lapor kualitas per posisi, konten adaptor, GC, duplikasi. <strong>Trimming</strong> (Trimmomatic/fastp): potong adaptor + basa berkualitas buruk. Aturan: <strong>QC sebelum DAN sesudah trimming</strong>.",
            "kepribadian": "QC itu seperti inspeksi bahan masakan: 5 menit mencium ikan busuk menghemat 3 jam memasak sia-sia. Pipeline tanpa QC = memasak dengan mata tertutup.",
            "kapan": "Selalu tahap 1. Metrik merah = investigasi dulu, jangan lanjut.",
            "worked": (
                "\U0001f4d0 Contoh: membaca FastQC",
                "<p><strong>Per-base quality</strong> anjlok di ujung 3' (Q<20) \u2192 trim ujung.<br />"
                "<strong>Adaptor content</strong> 40% \u2192 library bermasalah / trim adaptor.<br />"
                "<strong>Duplikasi</strong> 60% \u2192 PCR berlebihan atau input DNA sedikit \u2014 waspadai bias.<br />"
                "Keputusan: trim adaptor + sliding window Q20 \u2192 QC ulang \u2192 baru mapping.</p>",
            ),
        },
        {
            "id": "mapping",
            "title": "Mapping: BWA, Bowtie2, STAR \u2014 Si Tukang Tempel",
            "definisi": "<strong>Mapping</strong>: tempelkan tiap read ke posisi terbaik di genom referensi. <strong>BWA-MEM</strong>: standar DNA (BWT index). <strong>Bowtie2</strong>: cepat, hemat memori. <strong>STAR</strong>: RNA-seq (splice-aware: read bisa melompati intron).",
            "rumus": r"\text{MAPQ} = -10\log_{10}(P_{\text{salah tempat}})",
            "simbol": [
                (r"\text{MAPQ}", "keyakinan penempatan (0\u201360)"),
            ],
            "interpretasi": "MAPQ 60 = 1:1.000.000 salah tempat. MAPQ 0 = menempel di banyak tempat sama baiknya (repetitif!) \u2014 read ini tidak informatif untuk varian unik. Filter MAPQ\u226520 adalah QC standar.",
            "worked": (
                "\U0001f4d0 Contoh: jebakan daerah repetitif",
                "<p>Read dari gen dengan pseudogen kembar: menempel di 2 tempat dengan skor sama \u2192 MAPQ 0.<br />"
                "Variant caller yang tidak filter MAPQ akan memanggil \u201cvarian\u201d dari perbedaan pseudogen \u2014 artefak klasik!<br />"
                "Solusi: filter MAPQ, waspadai gen dengan homolog (lihat BI1: cerita varian hantu).<br />"
                "<strong>RNA-seq:</strong> read melintasi exon-exon junction \u2192 butuh STAR (splice-aware); BWA akan gagal menempelkan.</p>",
            ),
            "kepribadian": "Mapper itu seperti tukang tempel puzzle 3 miliar keping: BWA teliti tapi lambat, Bowtie2 cepat, STAR paham \u201cpotongan yang melompati lubang\u201d (splicing). Pilih tukang sesuai puzzle-nya.",
            "kapan": "DNA \u2192 BWA-MEM. RNA \u2192 STAR/HISAT2. Cepat + hemat \u2192 Bowtie2. Selalu cek % mapped + MAPQ distribution.",
        },
        {
            "id": "calling",
            "title": "Variant Calling &amp; Anotasi \u2014 Si Hakim",
            "definisi": "<strong>Variant calling</strong> (GATK HaplotypeCaller, bcftools): dari tumpukan read (pileup), putuskan apakah ada varian via <strong>model probabilistik</strong> (bukan voting!). <strong>Anotasi</strong> (VEP, ANNOVAR): tambah info \u2014 gen, dampak, frekuensi gnomAD, ClinVar.",
            "kepribadian": "Caller yang baik itu hakim, bukan tukang hitung suara: ia menimbang kualitas tiap bacaan, strand bias, dan posisi \u2014 bukan sekadar \u201c20 bilang G, 10 bilang A jadi heterozigot\u201d.",
            "kapan": "Germline \u2192 GATK/bcftools. Somatik kanker \u2192 Mutect2 (tumor-normal). Selalu anotasi sebelum interpretasi.",
            "worked": (
                "\U0001f4d0 Contoh: dari pileup ke vonis",
                "<p>Posisi chr1:12345, 30 read: 18 G (Q35), 12 A (Q20).<br />"
                "Voting naif: heterozigot. Model GATK: menimbang Q (G lebih dipercaya), cek strand (semua G di + strand? \u2192 curiga!), hitung genotype likelihood.<br />"
                "Hasil: <strong>tidak dipanggil</strong> (strand bias) atau dipanggil dengan GQ rendah.<br />"
                "<strong>Anotasi VEP:</strong> missense di BRCA1, gnomAD 0,0001, ClinVar VUS \u2192 kandidat untuk kurasi (BI2).</p>",
            ),
            "rumus": r"P(G|D) \propto P(D|G) \cdot P(G)",
            "simbol": [
                (r"P(G|D)", "probabilitas genotipe given data (yang ingin tahu)"),
                (r"P(D|G)", "likelihood: peluang data bila genotipe G (dari kualitas read)"),
                (r"P(G)", "prior genotipe (dari populasi)"),
            ],
            "interpretasi": "Bayes untuk calling: bukti read (likelihood) \u00d7 pengetahuan populasi (prior). Inilah kenapa caller modern jauh lebih baik dari \u201chitungan suara\u201d \u2014 ia memakai probabilitas, bukan demokrasi.",
            "warning": "<strong>Best practice GATK</strong> (germline): HaplotypeCaller \u2192 joint genotyping \u2192 VQSR/filter \u2192 anotasi. Jangan skip: duplicate marking (Picard), BQSR (rekalibrasi kualitas), dan VQSR untuk WGS besar. Tiap langkah ada alasannya.",
        },
    ],
    "myths": [
        ("Pipeline = jalankan tool default berurutan",
         "Default untuk data umum; datamu spesifik. Parameter trimming, referensi (hg19 vs hg38!), dan filter harus disesuaikan. Lebih penting: <strong>pahami tiap tahap</strong> agar bisa mendiagnosis saat hasil aneh \u2014 \u201cdefault\u201d bukan strategi."),
        ("Makin dalam coverage makin baik, tanpa batas",
         "Di atas 30\u201350x (germline), tambahan coverage memberi hasil diminishing \u2014 kecuali kasus khusus (somatik frekuensi rendah, mosaic). Uang lebih baik untuk <strong>tambah sampel</strong> daripada coverage 100x yang mubazir."),
        ("Varian yang terpanggil = varian yang benar",
         "Caller punya false positive (lihat cerita pembuka: 93% artefak!). Validasi: metrik QC (Ts/Tv, het/hom ratio), IGV spot-check, dan validasi orthogonal (Sanger/array) untuk kandidat kunci."),
    ],
    "tips": [
        "Bangun <strong>checkpoint QC</strong> tiap tahap: FastQC \u2192 %mapped/MAPQ \u2192 Ts/Tv + het/hom \u2192 ringkasan anotasi. Pipeline tanpa checkpoint = pesawat tanpa indikator.",
        "Gunakan <strong>genom referensi yang sama</strong> di seluruh proyek (hg38!). Campur hg19/hg38 = koordinat kacau (lihat BI3). Catat versi + sumber.",
        "Untuk kandidat klinis: selalu <strong>lihat di IGV</strong>. Mata manusia masih menangkap artefak (strand bias, ujung read) yang lolos filter otomatis.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Simulasi QC &amp; Trimming Adaptor",
            "intro": "Diberikan read dengan adaptor menempel + kualitas menurun di ujung. Potong adaptor dan trim Q<20 dari ujung 3'. Lihat read \u201cbersih\u201d.",
            "hint": "Ubah threshold Q 20 \u2192 30. Berapa banyak basa terbuang? Trade-off ketat vs longgar = kualitas vs jumlah data.",
            "code": (
                "adaptor = 'AGATCGGAAGAG'\n"
                "reads = [\n"
                "    ('ACGTACGT' + adaptor, 'IIIIIIIIIIIIIIIIIIII'),\n"
                "    ('TTGGCCAA', 'IIIIII##'),   # ujung buruk\n"
                "    ('GATTACA', 'IIIIIII'),\n"
                "]\n"
                "THR = 20\n"
                "for seq, qual in reads:\n"
                "    # 1. potong adaptor\n"
                "    if adaptor in seq:\n"
                "        i = seq.index(adaptor)\n"
                "        seq, qual = seq[:i], qual[:i]\n"
                "    # 2. trim ujung 3' ber-Q rendah\n"
                "    while qual and (ord(qual[-1])-33) < THR:\n"
                "        seq, qual = seq[:-1], qual[:-1]\n"
                "    status = 'OK' if len(seq) >= 5 else 'BUANG (terlalu pendek)'\n"
                "    print(f'{seq:<12} Qmin~{min((ord(c)-33) for c in qual) if qual else 0:<3} {status}')\n"
                "print()\n"
                "print('Inilah fastp/Trimmomatic versi 1 menit.')\n"
                "print('Adaptor tak terpotong -> mapping gagal / varian hantu.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Panggil Varian dari Pileup (Bayes Sederhana)",
            "intro": "Diberikan pileup (basa + kualitas), hitung likelihood tiap genotipe (0/0, 0/1, 1/1) dan pilih yang terbaik. Rasakan bedanya dengan voting.",
            "hint": "Ubah kualitas basa minor jadi rendah (Q10). Lihat vonis berubah dari heterozigot \u2192 homozigot ref \u2014 bukti lemah tidak dipercaya. Itulah model probabilistik.",
            "code": (
                "# pileup di satu posisi: ref=A. (basa, Q)\n"
                "pileup = [('A',35),('A',37),('G',35),('A',36),('G',34),('A',35)]\n"
                "import math\n"
                "def likelihood(genotipe):\n"
                "    # genotipe: fraksi alel alt yang diharapkan\n"
                "    f = {'0/0': 0.0, '0/1': 0.5, '1/1': 1.0}[genotipe]\n"
                "    ll = 0.0\n"
                "    for basa, q in pileup:\n"
                "        e = 10**(-q/10)\n"
                "        p_alt = f*(1-e) + (1-f)*(e/3)\n"
                "        p = p_alt if basa == 'G' else (1-p_alt)\n"
                "        ll += math.log(max(p, 1e-300))\n"
                "    return ll\n"
                "for g in ['0/0', '0/1', '1/1']:\n"
                "    print(f'{g}: log-likelihood = {likelihood(g):.1f}')\n"
                "print()\n"
                "print('Vonis = genotipe dengan likelihood tertinggi.')\n"
                "print('Bukan voting! Kualitas tiap bacaan ikut menimbang.')\n"
                "print('GATK memakai prinsip ini + haplotype assembly.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "SNP/indel germline \u2192 Illumina + BWA + GATK",
            "kondisi": "Standar diagnosis/riset varian kecil.",
            "alasan": "Ekosistem matang; best practice jelas.",
            "contoh": "WES bayi sakit (BI1).",
        },
        {
            "title": "Varian struktural / repetitif \u2192 Long-read",
            "kondisi": "Short-read buta (delesi besar, repeat expansion).",
            "alasan": "Read panjang melompati daerah sulit.",
            "contoh": "Delesi 5kb terlewat WES.",
        },
        {
            "title": "RNA (ekspresi/splicing) \u2192 STAR + count",
            "kondisi": "Butuh splice-aware mapping.",
            "alasan": "BWA tidak menangani junction.",
            "contoh": "RNA-seq kanker (BI9).",
        },
        {
            "title": "Kanker somatik \u2192 Tumor-normal + Mutect2",
            "kondisi": "Bedakan somatik vs germline; frekuensi rendah.",
            "alasan": "Butuh kontrol normal + model khusus.",
            "contoh": "Mutasi driver tumor.",
        },
        {
            "title": "Pipeline produksi \u2192 Workflow manager + container",
            "kondisi": ">10 sampel atau dishare.",
            "alasan": "Reproducibility (BI4).",
            "contoh": "Nextflow + Docker untuk 500 WGS.",
        },
    ],
    "aturan10": [
        "QC sebelum dan sesudah trimming.",
        "Filter MAPQ; waspadai daerah repetitif.",
        "Caller = hakim Bayes, bukan voting.",
        "Lihat kandidat kunci di IGV.",
    ],
    "case": {
        "title": "Varian \u201cPatogenik\u201d dari Ujung Read",
        "body": [
            "<p>Pipeline memanggil varian nonsense kandidat penyakit. Validasi Sanger: <strong>negatif</strong>. Investigasi IGV: semua read pendukung varian menumpuk di <strong>ujung 3' read</strong> dengan kualitas menurun \u2014 dan hanya di satu strand.</p>",
        ],
        "pertanyaan": "Diagnosis artefak + perbaikan pipeline.",
        "pembahasan": "Artefak klasik: error sekuensing di ujung read berkualitas rendah + strand bias. Perbaikan: (1) trimming lebih agresif (sliding window Q20); (2) filter: abaikan varian yang hanya didukung ujung read / satu strand (gunakan filter strand bias: FS/SOR GATK); (3) naikkan threshold GQ untuk kandidat klinis; (4) SOP: IGV spot-check SEMUA kandidat klinis sebelum lapor. Pelajaran: satu filter yang tepat (strand bias) menghemat 93 validasi Sanger sia-sia dari cerita pembuka. QC bukan birokrasi \u2014 ia adalah penghematan.",
    },
    "quiz": [
        ("Urutan pipeline NGS yang benar?",
         ["Calling \u2192 mapping \u2192 QC", "QC \u2192 trimming \u2192 mapping \u2192 calling \u2192 anotasi", "Anotasi dulu", "Bebas"],
         1,
         "Benar: gerbang QC dulu, baru tempel, baru panggil, baru tafsir. Urutan = logika ketergantungan."),
        ("MAPQ = 0 artinya\u2026",
         ["Sempurna", "Read menempel di banyak tempat sama baiknya (repetitif) \u2014 tidak informatif", "Error", "Belum di-mapping"],
         1,
         "Benar: jangan panggil varian dari MAPQ 0 \u2014 itu sumber varian hantu."),
        ("Untuk RNA-seq, mapper yang tepat?",
         ["BWA-MEM", "STAR (splice-aware: menangani lompatan intron)", "Bowtie2 selalu", "BLAST"],
         1,
         "Benar: read RNA melintasi splice junction. Mapper DNA akan gagal/salah."),
        ("Variant caller modern memutuskan genotipe dengan\u2026",
         ["Voting mayoritas", "Model probabilistik (likelihood \u00d7 prior) yang menimbang kualitas", "Lempar koin", "Panjang read"],
         1,
         "Benar: hakim Bayes, bukan demokrasi. Kualitas, strand, dan prior ikut menimbang."),
        ("Kapan long-read dipilih atas Illumina?",
         ["Selalu", "Varian struktural, daerah repetitif, assembly \u2014 yang short-read buta", "Tidak pernah", "Hanya untuk RNA"],
         1,
         "Benar: panorama vs close-up. Pilih sesuai pertanyaan, bukan tren."),
        ("Ts/Tv jauh dari ~2 setelah calling artinya?",
         ["Sukses", "Banyak false positive kemungkinan \u2014 periksa QC/filter", "Harus tambah sampel", "Normal"],
         1,
         "Benar: QC klasik pasca-calling. Biologi manusia ~2; artefak menggesernya."),
    ],
    "rangkuman": [
        "Pipeline: <strong>QC \u2192 trim \u2192 map \u2192 call \u2192 anotasi</strong>; checkpoint QC tiap tahap.",
        "<strong>Illumina</strong> untuk SNP/indel; <strong>long-read</strong> untuk struktural/repetitif.",
        "<strong>BWA</strong> DNA, <strong>STAR</strong> RNA (splice-aware); filter <strong>MAPQ</strong>.",
        "Caller = <strong>Bayes</strong> (likelihood \u00d7 prior), bukan voting.",
        "Best practice: <strong>mark duplicates, BQSR, VQSR</strong>; anotasi dengan <strong>VEP</strong>.",
        "Validasi kandidat kunci: <strong>IGV + orthogonal</strong>.",
        "Coverage >30\u201350x diminishing return (germline).",
        "Referensi konsisten (<strong>hg38</strong>); workflow manager + container untuk produksi.",
    ],
    "prev": ("bi7-filogenetika", "BI7"),
    "next": ("bi9-rna-seq", "BI9"),
}

# ================================================================ BI9
BI9 = {
    "slug": "bi9-rna-seq",
    "code": "BI9",
    "track": TRACK,
    "cover_title": "DESeq2 &amp; Volcano Plot:<br />RNA-seq: Gen Apa yang Berubah",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 20.000 Gen, 3 Replikat"),
        ("normalisasi", "Normalisasi: Mengapa Tidak Bisa Dibagi Total"),
        ("nb", "Model Negative Binomial &amp; DESeq2"),
        ("volcano", "Volcano Plot &amp; Multiple Testing"),
        ("gsea", "GSEA: Dari Gen ke Pathway"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Mengapa Normalisasi Total Menipu"),
        ("lab2", "\U0001f52c Lab 2: Volcano Plot &amp; FDR"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan mengapa <strong>normalisasi RNA-seq</strong> tidak bisa sekadar dibagi total read.",
        "Menjelaskan model <strong>negative binomial</strong> dan alur <strong>DESeq2</strong> (size factor, dispersi, shrinkage).",
        "Membaca <strong>volcano plot & MA plot</strong> dan menerapkan <strong>FDR</strong>.",
        "Menafsirkan <strong>GSEA / enrichment GO-KEGG</strong> dari daftar gen.",
    ],
    "story_title": "Cerita Pembuka: 20.000 Gen, 3 Replikat",
    "story": [
        "<p>Peneliti punya 3 sampel kanker vs 3 normal, 20.000 gen. Ia menjalankan uji-t per gen pada data mentah \u2014 dapat 5.000 \u201cgen signifikan\u201d. Reviewer menolak dalam 1 paragraf: tanpa normalisasi yang benar, tanpa model count yang tepat, tanpa koreksi multiple testing \u2014 5.000 itu sebagian besar noise.</p>",
        "<p>RNA-seq adalah ujian statistik bioinformatika: data count yang overdispersed, 20.000 uji simultan, dan replikat sedikit. Lesson ini mengajarkan cara yang benar \u2014 dari normalisasi sampai pathway \u2014 agar \u201cgen signifikan\u201d-mu bukan sekadar daftar belanja noise.</p>",
    ],
    "konsep": [
        {
            "id": "normalisasi",
            "title": "Normalisasi: Mengapa Tidak Bisa Dibagi Total",
            "definisi": "<strong>Normalisasi</strong> membuat count antar-sampel sebanding. Masalah: <strong>komposisi</strong> \u2014 jika 10 gen super-ekspresi menyedot 50% read di sampel kanker, gen lain terlihat turun padahal tidak. <strong>DESeq2 size factor</strong> (median-of-ratios) robust terhadap ini; TPM/FPKM untuk perbandingan antar-gen.",
            "kepribadian": "Normalisasi total itu seperti membandingkan belanja dua keluarga dari total struk: keluarga A beli 1 TV mahal \u2192 terlihat \u201cboros di semua\u201d. Size factor itu seperti membandingkan harga per barang yang sama \u2014 tidak tertipu satu pembelian raksasa.",
            "kapan": "DE antar-sampel \u2192 size factor (DESeq2) / TMM (edgeR). Banding gen dalam sampel \u2192 TPM (koreksi panjang gen).",
            "worked": (
                "\U0001f4d0 Contoh: jebakan total count",
                "<p>Sampel N (normal): total 1 jt read. Sampel K (kanker): total 1 jt read, tapi gen MYC saja menyedot 400rb.<br />"
                "<strong>RPM</strong> (bagi total): semua gen lain di K terlihat turun 40% \u2014 PALSU.<br />"
                "<strong>Size factor</strong>: median rasio gen-per-gen \u2248 1 (kebanyakan gen tidak berubah) \u2192 tidak tertipu MYC.<br />"
                "Inilah kenapa DESeq2/edgeR tidak memakai RPM untuk DE.</p>",
            ),
            "chart": {
                "var": "bi9NormData",
                "data": [{"x": ["Gen A", "Gen B", "Gen C", "Gen D", "MYC"], "y": [100, 100, 100, 100, 100], "type": "bar", "name": "Normal (RPM)", "marker": {"color": "#2a7de1"}},
                        {"x": ["Gen A", "Gen B", "Gen C", "Gen D", "MYC"], "y": [60, 60, 60, 60, 4000], "type": "bar", "name": "Kanker (RPM)", "marker": {"color": "#e8a838"}}],
                "title": "Jebakan Normalisasi Total (RPM)",
                "layout": {"barmode": "group", "xaxis": {"title": "Gen"}, "yaxis": {"title": "RPM"}, "showlegend": True},
                "cara": "Biru = normal, kuning = kanker (RPM). Perhatikan gen A\u2013D yang sebenarnya TIDAK berubah.",
                "interpretasi": "Gen A\u2013D terlihat turun (100\u219260) padahal biologinya sama \u2014 hanya karena MYC menyedot read. Inilah artefak komposisi: normalisasi total menghukum semua gen lain. Size factor/TMM kebal terhadap ini.",
            },
        },
        {
            "id": "nb",
            "title": "Model Negative Binomial &amp; DESeq2 \u2014 Si Statistikawan",
            "definisi": "Count RNA-seq bersifat <strong>overdispersed</strong> (variansi > mean) \u2192 Poisson tidak cukup \u2192 <strong>Negative Binomial</strong>. <strong>DESeq2</strong>: estimasi size factor \u2192 estimasi dispersi per gen (shrinkage antar-gen!) \u2192 uji Wald/LRT \u2192 FDR.",
            "rumus": r"K_{ij} \sim NB(\mu_{ij}, \alpha_i), \quad \mu_{ij} = s_j \cdot q_{ij}",
            "simbol": [
                (r"K_{ij}", "count gen i sampel j"),
                (r"s_j", "size factor sampel j (normalisasi)"),
                (r"q_{ij}", "ekspresi sebenarnya (dinormalisasi)"),
                (r"\alpha_i", "dispersi gen i (seberapa berisik)"),
            ],
            "interpretasi": "Model memisahkan 3 hal: kedalaman sekuensing (s), biologi (q), dan noise (alpha). Shrinkage dispersi = pinjam kekuatan antar-gen: dengan 3 replikat, dispersi satu gen tak terestimasi andal \u2014 tapi pola 20.000 gen membantu.",
            "worked": (
                "\U0001f4d0 Contoh: kenapa tidak uji-t",
                "<p>Gen X: count normal [10,12,11], kanker [100,110,105].<br />"
                "<strong>Uji-t</strong> pada count mentah: mengasumsikan normal + variansi sama \u2014 dilanggar (count, overdispersed).<br />"
                "<strong>DESeq2</strong>: NB dengan dispersi terestimasi \u2192 log2FC \u2248 3,3, padj = 1e-8 \u2713.<br />"
                "Gen Y: [0,1,0] vs [2,3,2] \u2014 uji-t \u201cbisa signifikan\u201d tapi DESeq2 menshrink log2FC (count kecil = tidak dipercaya). Inilah kebijaksanaan shrinkage.</p>",
            ),
            "kepribadian": "DESeq2 itu seperti juri berpengalaman: untuk gen dengan bukti sedikit (count kecil), ia tidak langsung percaya \u2014 ia \u201cmenciutkan\u201d klaimnya menuju rata-rata. Untuk bukti kuat, ia membiarkan angka bicara.",
            "kapan": "DE standar: DESeq2 (konservatif, shrinkage) atau edgeR (mirip, TMM). n kecil \u2192 DESeq2. Selalu: desain formula benar (~kondisi + batch!).",
            "warning": "<strong>Desain formula menentukan segalanya:</strong> ~kondisi saja padahal ada batch \u2192 confounded. Tulis design = ~batch + kondisi. Dan JANGAN pre-filter gen terlalu agresif sebelum DE \u2014 biarkan DESeq2 menangani via independent filtering.",
        },
        {
            "id": "volcano",
            "title": "Volcano Plot &amp; Multiple Testing \u2014 Si Peta Harta",
            "definisi": "<strong>Volcano plot</strong>: x = log2 fold change, y = \u2212log10(padj). Gen menarik = <strong>atas-kiri/kanan</strong> (besar + signifikan). <strong>FDR (Benjamini-Hochberg)</strong>: kontrol ekspektasi proporsi false discovery \u2014 wajib untuk 20.000 uji.",
            "kepribadian": "Volcano plot itu seperti peta harta karun: sumbu X = seberapa besar harta (efek), sumbu Y = seberapa yakin peta (signifikansi). Harta sejati ada di dua puncak gunung \u2014 bukan di lembah tengah yang ramai tapi tak berarti.",
            "kapan": "Presentasi hasil DE; pilih kandidat validasi. Threshold umum: |log2FC|>1 & padj<0,05 \u2014 tapi justifikasi biologis > angka magis.",
            "worked": (
                "\U0001f4d0 Contoh: membaca volcano",
                "<p>Gen TP53: log2FC = \u22122,5, padj = 1e-12 \u2192 puncak kiri-atas: turun kuat & sangat signifikan \u2713 kandidat.<br />"
                "Gen Z: log2FC = 0,2, padj = 1e-9 \u2192 signifikan tapi efek kecil \u2014 mungkin tidak bermakna biologis.<br />"
                "Gen Y: log2FC = 4, padj = 0,2 \u2192 efek besar tapi tidak signifikan (count kecil/noise) \u2014 jangan kejar!<br />"
                "<strong>FDR:</strong> dari 20.000 uji, p<0,05 mentah \u2192 1.000 false positive ekspektasi. padj<0,05 \u2192 hanya 5% dari yang diklaim yang palsu.</p>",
            ),
            "chart": {
                "var": "bi9VolcData",
                "data": [{"x": [-3.2, -2.5, -2.1, -0.2, 0.1, 0.3, 2.2, 2.8, 3.5, 0.5, -0.4, 1.2], "y": [8, 12, 6, 9, 1, 0.5, 7, 11, 9, 2, 1.5, 3], "type": "scatter", "mode": "markers+text", "marker": {"color": "#2a7de1", "size": 9}, "text": ["", "TP53", "", "", "", "", "", "MYC", "", "", "", ""], "textposition": "top center", "showlegend": False}],
                "title": "Volcano Plot (ilustratif, 12 gen contoh)",
                "layout": {"xaxis": {"title": "log2 fold change"}, "yaxis": {"title": "-log10(padj)"}, "showlegend": False, "shapes": [{"type": "line", "x0": -4, "x1": 4, "y0": 1.3, "y1": 1.3, "line": {"dash": "dash", "color": "#e8a838"}}, {"type": "line", "x0": 1, "x1": 1, "y0": 0, "y1": 13, "line": {"dash": "dash", "color": "#94a3b8"}}, {"type": "line", "x0": -1, "x1": -1, "y0": 0, "y1": 13, "line": {"dash": "dash", "color": "#94a3b8"}}]},
                "cara": "X = besar perubahan (kanan = naik di kanker), Y = signifikansi (makin atas makin yakin). Garis putus-putus = threshold umum.",
                "interpretasi": "TP53 (kiri-atas) dan MYC (kanan-atas) = kandidat kuat: besar + signifikan. Titik tengah-atas (log2FC kecil, signifikan) = nyata tapi mungkin tak bermakna biologis. Titik kanan-bawah (efek besar, tak signifikan) = jangan kejar \u2014 noise. Baca volcano = baca dua dimensi sekaligus.",
            },
        },
        {
            "id": "gsea",
            "title": "GSEA: Dari Gen ke Pathway \u2014 Si Pelihat Hutan",
            "definisi": "<strong>Enrichment</strong>: apakah gen signifikan menumpuk di pathway tertentu (GO/KEGG) melebihi acak? <strong>GSEA</strong>: tanpa threshold \u2014 pakai SEMUA gen terurut skor, uji apakah gen satu pathway menumpuk di ujung.",
            "kepribadian": "Enrichment itu seperti bertanya \u201cdari 500 nama di daftar, kebetulan berapa yang satu marga?\u201d GSEA lebih halus: tidak memotong daftar dulu, tapi melihat apakah satu marga menumpuk di peringkat atas.",
            "kapan": "Interpretasi biologis hasil DE: dari \u201c500 gen\u201d menjadi \u201cpathway apoptosis & siklus sel aktif\u201d \u2014 bahasa yang dimengerti biolog.",
            "worked": (
                "\U0001f4d0 Contoh: over-representation",
                "<p>500 gen DE (padj<0,05). Pathway \u201capoptosis\u201d punya 200 gen; 40 di antaranya ada di 500 DE.<br />"
                "Ekspektasi acak: 500 \u00d7 (200/20000) = 5. Teramati 40 \u2192 enrichment 8x, p hipergeometrik = 1e-20.<br />"
                "Kesimpulan: program kematian sel aktif \u2014 cerita biologis, bukan sekadar daftar.<br />"
                "<strong>Waspada:</strong> pathway tumpang tindih & redundan; pilih database yang tepat (GO-BP untuk proses, KEGG untuk metabolik).</p>",
            ),
            "rumus": r"P(X \geq k) = \sum_{x=k}^{min(n,K)} \frac{\binom{K}{x}\binom{N-K}{n-x}}{\binom{N}{n}}",
            "simbol": [
                (r"N", "total gen latar (20.000)"),
                (r"K", "gen dalam pathway"),
                (r"n", "gen DE"),
                (r"k", "irisan teramati"),
            ],
            "interpretasi": "Uji hipergeometrik: peluang irisan sebesar k secara acak. Kecil = enrichment nyata. Pilih latar N dengan benar (gen yang terdeteksi, bukan semua gen genom!).",
        },
    ],
    "myths": [
        ("Normalisasi = bagi dengan total read (RPM) sudah cukup",
         "Tidak untuk DE: artefak komposisi (pelajaran chart di atas). RPM/TPM untuk visualisasi & antar-gen; DE butuh size factor/TMM. Salah normalisasi = ribuan gen DE palsu."),
        ("Uji-t per gen sudah cukup untuk RNA-seq",
         "Count itu diskret + overdispersed + n kecil. Uji-t mengasumsikan normalitas & variansi sama \u2014 ketiga asumsi dilanggar. DESeq2/edgeR dirancang untuk ini: NB + shrinkage + FDR. \u201cCukup\u201d = 5.000 temuan palsu."),
        ("Gen dengan p-value terkecil = gen terpenting",
         "p-value = keyakinan, bukan kepentingan. Gen dengan padj 1e-50 tapi log2FC 0,2 kalah penting dari padj 1e-6 dengan log2FC 4 untuk validasi. Baca volcano dua dimensi; pertimbangkan biologi."),
    ],
    "tips": [
        "Selalu sertakan <strong>batch dalam desain</strong> (~batch + kondisi) bila ada. Batch effect (BI10) adalah pembunuh DE #1 \u2014 lebih mematikan dari metode yang salah.",
        "Buat <strong>PCA sebelum DE</strong>: sampel harus mengelompok per kondisi, bukan per tanggal sekuensing. Bila tidak, perbaiki desain dulu \u2014 jangan lanjut.",
        "Simpan <strong>daftar gen lengkap</strong> (bukan cuma yang signifikan) untuk GSEA. Threshold memotong sinyal pathway yang terdistribusi di banyak gen kecil.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Artefak Komposisi &amp; Size Factor",
            "intro": "Simulasikan 5 gen: 4 stabil + 1 meledak di kondisi B. Bandingkan normalisasi total (RPM) vs median-of-ratios. Lihat RPM menipu.",
            "hint": "Inilah intuisi size factor DESeq2: median rasio kebal terhadap segelintir gen ekstrem. Coba buat 3 gen meledak \u2014 kapan median jebol?",
            "code": (
                "# count 5 gen x 2 kondisi (A normal, B kanker)\n"
                "A = [100, 200, 150, 300, 100]\n"
                "B = [100, 200, 150, 300, 5000]  # gen5 (MYC) meledak\n"
                "totA, totB = sum(A), sum(B)\n"
                "print('RPM (bagi total):')\n"
                "for i in range(5):\n"
                "    print(f'  gen{i+1}: A={A[i]/totA*1e6:.0f}  B={B[i]/totB*1e6:.0f}')\n"
                "print('  -> gen1-4 TERLIHAT turun! (palsu)')\n"
                "print()\n"
                "# median-of-ratios (ala DESeq2)\n"
                "import statistics as st\n"
                "rasio = [b/a for a, b in zip(A, B)]\n"
                "sf = st.median(rasio)\n"
                "print(f'median rasio (size factor B) = {sf:.2f}')\n"
                "print('normalisasi B/sf:')\n"
                "for i in range(5):\n"
                "    print(f'  gen{i+1}: A={A[i]}  B_adj={B[i]/sf:.0f}')\n"
                "print('  -> gen1-4 TETAP, gen5 naik. Benar!')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Volcano Plot &amp; Koreksi FDR (BH)",
            "intro": "Diberikan 12 gen (log2FC + p-value), terapkan Benjamini-Hochberg manual, lalu klasifikasikan: kandidat / signifikan-kecil / noise.",
            "hint": "Bandingkan p-value mentah vs padj: berapa gen \u201csignifikan\u201d yang gugur? Itulah 20.000 uji tanpa koreksi = banjir false positive.",
            "code": (
                "gen = [('TP53',-2.5,1e-12),('MYC',2.8,1e-11),('GAPDH',0.1,0.4),\n"
                "       ('BRCA1',-1.8,1e-6),('ACTB',0.05,0.7),('EGFR',3.2,0.02),\n"
                "       ('X1',0.3,1e-8),('X2',4.0,0.3),('X3',-0.1,0.02),\n"
                "       ('X4',1.5,1e-4),('X5',-3.0,0.1),('X6',0.8,1e-5)]\n"
                "m = len(gen)\n"
                "# Benjamini-Hochberg\n"
                "urut = sorted(gen, key=lambda x: x[2])\n"
                "padj = {}\n"
                "mn = 1.0\n"
                "for i, (g, fc, p) in reversed(list(enumerate(urut, 1))):\n"
                "    mn = min(mn, p*m/i)\n"
                "    padj[g] = mn\n"
                "print(f\"{'gen':<6} {'log2FC':>7} {'p':>10} {'padj':>10}  status\")\n"
                "for g, fc, p in gen:\n"
                "    pa = padj[g]\n"
                "    if pa < 0.05 and abs(fc) > 1: st = 'KANDIDAT'\n"
                "    elif pa < 0.05: st = 'signifikan, efek kecil'\n"
                "    elif abs(fc) > 1: st = 'efek besar, tak signifikan'\n"
                "    else: st = '-'\n"
                "    print(f'{g:<6} {fc:>7.1f} {p:>10.1e} {pa:>10.1e}  {st}')\n"
                "print()\n"
                "print('X2: efek besar tapi padj buruk -> JANGAN kejar (noise).')\n"
                "print('X1: padj bagus tapi efek kecil -> mungkin tak bermakna biologis.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "DE dua kondisi, n kecil \u2192 DESeq2",
            "kondisi": "Standar; butuh shrinkage.",
            "alasan": "Konservatif, terdokumentasi, vignette luar biasa.",
            "contoh": "Kanker vs normal, 3 vs 3.",
        },
        {
            "title": "DE kompleks / n besar \u2192 edgeR / limma-voom",
            "kondisi": "Desain faktorial, banyak sampel.",
            "alasan": "Fleksibel, cepat untuk besar.",
            "contoh": "Time-course multi-kondisi.",
        },
        {
            "title": "Interpretasi biologis \u2192 GSEA + GO/KEGG",
            "kondisi": "Dari daftar gen ke cerita.",
            "alasan": "Pathway = bahasa biolog.",
            "contoh": "Apoptosis aktif pada respons obat.",
        },
        {
            "title": "Single-cell \u2192 Bukan DESeq2 bulk!",
            "kondisi": "Data sel tunggal.",
            "alasan": "Struktur noise beda (lihat BI11).",
            "contoh": "DE antar klaster sel.",
        },
    ],
    "aturan10": [
        "Normalisasi untuk DE = size factor/TMM, bukan RPM.",
        "Count \u2192 NB + shrinkage, bukan uji-t.",
        "20.000 uji \u2192 FDR wajib.",
        "Baca volcano dua dimensi; batch di desain.",
    ],
    "case": {
        "title": "\u201c500 Gen Resistensi Obat\u201d yang Salah Desain",
        "body": [
            "<p>Tim membandingkan 3 sampel responsif vs 3 resisten terhadap kemoterapi. DESeq2 dijalankan dengan design = ~kondisi. Hasil: 500 gen DE. Validasi 20 gen via qPCR: <strong>hanya 2 terkonfirmasi</strong>.</p>",
            "<p>Audit: 3 responsif disekuensing Januari (batch 1), 3 resisten Maret (batch 2). PCA menunjukkan pemisahan sempurna per batch \u2014 bukan per kondisi.</p>",
        ],
        "pertanyaan": "Diagnosis + bagaimana seharusnya.",
        "pembahasan": "Batch effect total (kondisi = batch): DESeq2 tidak bisa memisahkan \u2014 500 gen = perbedaan batch (tanggal, reagen, teknisi), bukan biologi. Tidak ada statistik yang menyelamatkan desain confounded total. Seharusnya: (1) rancang interleaved (acak batch); (2) PCA SEBELUM DE \u2014 bila batch mendominasi, hentikan; (3) design = ~batch + kondisi hanya bila batch tidak confounded total. Pelajaran termahal RNA-seq: <strong>desain eksperimen > analisis</strong>. 2/20 validasi = uang dan waktu terbuang karena 1 jam perencanaan dilewatkan.",
    },
    "quiz": [
        ("Kenapa RPM tidak cocok untuk differential expression?",
         ["Terlalu lambat", "Artefak komposisi: segelintir gen ekstrem menggeser semua gen lain", "Tidak ada alasan", "Hanya untuk DNA"],
         1,
         "Benar: MYC menyedot read \u2192 gen lain terlihat turun palsu. Pakai size factor/TMM."),
        ("Count RNA-seq dimodelkan dengan Negative Binomial karena\u2026",
         ["Selalu normal", "Overdispersed (variansi > mean) \u2014 Poisson tidak cukup", "Lebih mudah", "Wajib regulasi"],
         1,
         "Benar: biologi itu berisik melebihi Poisson. NB + dispersi per gen = model yang tepat."),
        ("Fungsi shrinkage dispersi di DESeq2?",
         ["Mempercantik plot", "Pinjam kekuatan antar-gen: stabilkan estimasi dengan replikat sedikit", "Menghapus outlier", "Tidak ada"],
         1,
         "Benar: 3 replikat tak cukup estimasi dispersi satu gen \u2014 tapi pola 20.000 gen membantu."),
        ("Dari 20.000 uji tanpa koreksi, p<0,05 menghasilkan sekitar\u2026",
         ["0 false positive", "1.000 false positive ekspektasi", "5", "Semua benar"],
         1,
         "Benar: 20.000 \u00d7 0,05. Inilah kenapa FDR (BH) wajib \u2014 bukan opsional."),
        ("Gen: log2FC=4, padj=0,3. Sikap?",
         ["Kejar! efek besar", "Jangan \u2014 efek besar tapi tak signifikan = noise (count kecil/variansi besar)", "Publikasikan", "Abaikan FC"],
         1,
         "Benar: baca volcano dua dimensi. Efek tanpa keyakinan = harta karun palsu."),
        ("GSEA unggul atas over-representation karena\u2026",
         ["Lebih cepat", "Tanpa threshold: memakai semua gen terurut \u2014 sinyal terdistribusi tidak terpotong", "Gratis", "Tidak perlu statistik"],
         1,
         "Benar: pathway dengan banyak gen berubah kecil terlewat oleh threshold tapi tertangkap GSEA."),
    ],
    "rangkuman": [
        "Normalisasi DE = <strong>size factor/TMM</strong>; waspadai artefak komposisi.",
        "Count overdispersed \u2192 <strong>Negative Binomial + shrinkage</strong> (DESeq2/edgeR).",
        "Jangan uji-t pada count mentah.",
        "<strong>FDR (BH)</strong> wajib untuk 20.000 uji.",
        "<strong>Volcano</strong>: baca efek DAN signifikansi bersamaan.",
        "Desain: <strong>batch dalam formula</strong>; PCA sebelum DE.",
        "Interpretasi: <strong>GSEA/GO/KEGG</strong> \u2014 dari gen ke cerita.",
        "Desain eksperimen > analisis: batch confounded = tidak terselamatkan.",
    ],
    "prev": ("bi8-ngs-pipeline", "BI8"),
    "next": ("bi10-statistik-bioinfo", "BI10"),
}

# ================================================================ BI10
BI10 = {
    "slug": "bi10-statistik-bioinfo",
    "code": "BI10",
    "track": TRACK,
    "cover_title": "FDR &amp; Batch Effect:<br />Statistik yang Menyelamatkanmu",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 1.000 Penemuan Palsu"),
        ("fdr", "Multiple Testing: Bonferroni vs FDR"),
        ("batch", "Batch Effect \u2014 Si Pembunuh Diam-diam"),
        ("reduksi", "PCA/UMAP, Clustering &amp; Power"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Bonferroni vs BH"),
        ("lab2", "\U0001f52c Lab 2: Deteksi Batch Effect via PCA"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membedakan <strong>FWER (Bonferroni) vs FDR (BH)</strong> dan memilih yang tepat.",
        "Mengenali <strong>batch effect</strong> dari plot dan merancang koreksinya.",
        "Menggunakan <strong>PCA/UMAP + clustering</strong> untuk QC dan eksplorasi.",
        "Menghitung <strong>power & ukuran sampel</strong> untuk eksperimen genomik.",
    ],
    "story_title": "Cerita Pembuka: 1.000 Penemuan Palsu",
    "story": [
        "<p>Sebuah lab menguji 20.000 gen untuk asosiasi dengan penyakit, memakai p<0,05 tanpa koreksi. Hasil: 1.200 \u201cgen penemuan\u201d. Konferensi pers disiapkan. Lalu statistikawan menghitung: 20.000 \u00d7 0,05 = <strong>1.000 false positive ekspektasi</strong> \u2014 hampir semua \u201cpenemuan\u201d adalah noise. Konferensi pers dibatalkan.</p>",
        "<p>Di bioinformatika, kamu tidak melakukan SATU uji \u2014 kamu melakukan RIBUAN sekaligus. Tanpa koreksi multiple testing, p-value adalah mesin produksi penemuan palsu. Lesson ini adalah sabuk pengaman statistik seluruh track.</p>",
    ],
    "konsep": [
        {
            "id": "fdr",
            "title": "Multiple Testing: Bonferroni vs FDR",
            "definisi": "<strong>Bonferroni</strong>: ambang = alpha/m (kontrol peluang SATU pun false positive \u2014 FWER). <strong>FDR (Benjamini-Hochberg)</strong>: kontrol <em>proporsi</em> false discovery di antara yang diklaim \u2014 jauh lebih powerful untuk eksplorasi.",
            "rumus": r"p_{(k)} \leq \frac{k}{m}\alpha \quad \text{(tolak semua } H_{(1)}..H_{(k)}\text{ terbesar yang memenuhi)}",
            "simbol": [
                (r"p_{(k)}", "p-value terurut ke-k terkecil"),
                (r"m", "total uji"),
                (r"\alpha", "level FDR target (mis. 0,05)"),
            ],
            "interpretasi": "BH: urutkan p-value, cari titik potong garis (k/m)*alpha. Dari 100 klaim pada FDR 5%, ekspektasi hanya 5 yang palsu \u2014 vs Bonferroni yang hampir tidak mengklaim apa pun pada m besar.",
            "worked": (
                "\U0001f4d0 Contoh: 10.000 uji GWAS",
                "<p><strong>Bonferroni</strong>: ambang = 5e-8 (standar GWAS!). Hanya sinyal raksasa lolos \u2014 aman tapi buta untuk efek sedang.<br />"
                "<strong>BH FDR 5%</strong>: ratusan sinyal lolos dengan 5% false \u2014 cocok untuk eksplorasi hipotesis.<br />"
                "Pilih: klaim final/regulasi \u2192 Bonferroni; eksplorasi/penemuan \u2192 FDR. Jangan tertukar!</p>",
            ),
            "kepribadian": "Bonferroni itu seperti satpam super-ketat: tidak ada satu pun penyusup boleh lolos \u2014 tapi tamu sah pun sulit masuk. FDR itu seperti satpam realistis: \u201c5% yang masuk boleh jadi penyusup, asal 95% tamu asli\u201d \u2014 cocok untuk pesta besar (20.000 gen).",
            "kapan": "GWAS final, klaim diagnostik \u2192 Bonferroni. RNA-seq eksplorasi, screening \u2192 FDR.",
            "chart": {
                "var": "bi10FdrData",
                "data": [{"x": ["Tanpa koreksi", "Bonferroni", "FDR (BH)"], "y": [1000, 2, 95], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1", "#2a7de1"]}, "text": ["~1000", "2", "95 (5% palsu)"], "textposition": "outside"}],
                "title": "Klaim Signifikan dari 20.000 Uji (ilustratif)",
                "layout": {"xaxis": {"title": "Metode"}, "yaxis": {"title": "Jumlah klaim"}, "showlegend": False},
                "cara": "Tiga pendekatan pada 20.000 uji dengan 100 sinyal sejati. Kuning = tanpa koreksi (banjir).",
                "interpretasi": "Tanpa koreksi: 1.000 klaim palsu. Bonferroni: hanya 2 lolos (aman tapi buta \u2014 98 sinyal sejati hilang!). FDR: 95 klaim dengan ~5 palsu \u2014 keseimbangan untuk penemuan. Pilih sesuai misi: bukti final vs eksplorasi.",
            },
        },
        {
            "id": "batch",
            "title": "Batch Effect \u2014 Si Pembunuh Diam-diam",
            "definisi": "<strong>Batch effect</strong>: variasi teknis sistematis (tanggal, teknisi, reagen, mesin) yang mengacaukan sinyal biologis. Ia adalah confounder paling umum di genomik \u2014 dan paling sering diabaikan.",
            "kepribadian": "Batch effect itu seperti noda kopi di lensa mikroskop: kamu mengira melihat pola biologis, padahal melihat noda. Yang mengerikan: nodanya konsisten, sehingga terlihat seperti \u201ctemuan\u201d.",
            "kapan": "Setiap eksperimen multi-batch: rancang interleaved, catat metadata batch, cek PCA, koreksi (ComBat/limma) atau masukkan ke desain.",
            "worked": (
                "\U0001f4d0 Contoh: deteksi & koreksi",
                "<p><strong>Deteksi:</strong> PCA \u2014 sampel mengelompok per tanggal sekuensing, bukan per kondisi \u2192 batch effect confirmed.<br />"
                "<strong>Pencegahan (terbaik):</strong> acak sampel ke batch (interleaved); jangan sekuensing semua kontrol Januari, semua kasus Maret.<br />"
                "<strong>Koreksi:</strong> masukkan batch ke desain (~batch + kondisi) atau ComBat. <strong>Tapi:</strong> bila batch = kondisi (confounded total), TIDAK ADA koreksi yang valid \u2014 ulangi eksperimen.</p>",
            ),
            "warning": "<strong>Aturan emas:</strong> batch effect yang confounded total dengan kondisi TIDAK BISA dikoreksi secara statistik. Koreksi butuh variasi batch DI DALAM tiap kondisi. Desain > analisis, selalu.",
        },
        {
            "id": "reduksi",
            "title": "PCA/UMAP, Clustering &amp; Power",
            "definisi": "<strong>PCA</strong>: proyeksi linear variansi maksimal \u2014 untuk QC & struktur global. <strong>UMAP</strong>: non-linear, menjaga tetangga lokal \u2014 untuk visualisasi klaster (single-cell). <strong>Clustering hierarkis</strong>: dendrogram hubungan sampel. <strong>Power</strong>: peluang mendeteksi efek yang ada \u2014 tentukan n SEBELUM eksperimen.",
            "rumus": r"\text{Power} = 1 - \beta = P(\text{tolak } H_0 | H_1 \text{ benar})",
            "simbol": [
                (r"\beta", "peluang false negative (tipe II)"),
            ],
            "interpretasi": "Power 80% = dari 100 efek nyata, 80 terdeteksi. n kecil + efek kecil + m besar (multiple testing!) = power ambyar. Hitung n dengan mempertimbangkan koreksi multiple testing \u2014 bukan n untuk satu uji.",
            "worked": (
                "\U0001f4d0 Contoh: baca PCA QC",
                "<p>PCA 12 sampel RNA-seq: PC1 (40% variansi) memisahkan batch A vs B; PC2 (15%) memisahkan kondisi.<br />"
                "Bacaan: batch mendominasi kondisi \u2192 waspada! Cek: apakah batch seimbang antar kondisi? Jika ya \u2192 masukkan ke desain. Jika tidak \u2192 masalah.<br />"
                "<strong>UMAP</strong> untuk single-cell: tiap titik = sel; klaster = tipe sel (lihat BI11). Jangan overinterpretasi jarak antar-klaster UMAP \u2014 ia tidak bermakna kuantitatif!</p>",
            ),
            "kepribadian": "PCA itu seperti melihat hutan dari helikopter: pola besar terlihat (batch, kondisi), detail hilang. UMAP itu seperti peta wisata: klaster jelas, tapi jarak antar kota tidak sesuai skala. Power itu seperti menyiapkan jala: terlalu kecil = ikan besar pun lolos.",
            "kapan": "QC pertama SETIAP analisis omics: PCA + label batch/kondisi. Power: sebelum grant/eksperimen, dengan m terkoreksi.",
        },
    ],
    "myths": [
        ("p-value yang sudah dikoreksi tidak perlu FDR lagi",
         "p-value mentah dari 20.000 uji BUKAN 20.000 bukti \u2014 ia 20.000 kesempatan false positive. \u201cSudah signifikan p<0,05\u201d tanpa koreksi = tidak berarti apa-apa di skala genomik. Koreksi bukan opsional, ia adalah uji itu sendiri."),
        ("Batch effect bisa selalu dikoreksi dengan ComBat",
         "Hanya bila batch tidak confounded total dengan kondisi. Bila semua kasus di batch A dan semua kontrol di batch B, ComBat akan \u201cmengoreksi\u201d sinyal biologisnya juga \u2014 atau gagal total. Pencegahan (desain interleaved) > koreksi."),
        ("UMAP menunjukkan jarak biologis antar klaster",
         "UMAP mengorbankan jarak global demi struktur lokal. Dua klaster yang berjauhan di UMAP belum tentu berjauhan secara biologis. Jangan ukur \u201ckedekatan\u201d dari plot UMAP \u2014 gunakan jarak di ruang asli."),
    ],
    "tips": [
        "Jadikan <strong>PCA berlabel batch</strong> sebagai gambar pertama setiap analisis. 30 detik ini mencegah 30 hari analisis sia-sia.",
        "Untuk multiple testing: laporkan <strong>metode + ambang + jumlah uji</strong> (\u201cBH FDR 5%, m=20.000\u201d). \u201cSignifikan\u201d tanpa ketiganya = tidak informatif.",
        "Hitung <strong>power dengan m terkoreksi</strong>: n untuk satu uji-t \u2260 n untuk 20.000 uji dengan Bonferroni. Konsultasi statistik SEBELUM sekuensing, bukan sesudah.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Bonferroni vs BH \u2014 Hitung Sendiri",
            "intro": "Simulasikan 1.000 uji (50 sinyal sejati + 950 noise). Terapkan tanpa koreksi, Bonferroni, dan BH. Bandingkan temuan benar vs palsu.",
            "hint": "Ubah jumlah sinyal sejati 50 \u2192 10. Lihat Bonferroni makin buta sementara BH tetap menemukan sebagian. Itulah power untuk penemuan.",
            "code": (
                "import random\n"
                "random.seed(77)\n"
                "m, n_sinyal = 1000, 50\n"
                "pvals = []\n"
                "for i in range(m):\n"
                "    if i < n_sinyal:\n"
                "        pvals.append((True, random.betavariate(0.5, 8)))  # sinyal: p kecil\n"
                "    else:\n"
                "        pvals.append((False, random.random()))            # noise: uniform\n"
                "def evaluasi(lolos):\n"
                "    benar = sum(1 for i in lolos if pvals[i][0])\n"
                "    return benar, len(lolos)-benar\n"
                "# tanpa koreksi\n"
                "l1 = [i for i,(s,p) in enumerate(pvals) if p < 0.05]\n"
                "# Bonferroni\n"
                "l2 = [i for i,(s,p) in enumerate(pvals) if p < 0.05/m]\n"
                "# BH\n"
                "urut = sorted(range(m), key=lambda i: pvals[i][1])\n"
                "kmax = max([k for k,(i) in enumerate(urut,1) if pvals[i][1] <= k/m*0.05] or [0])\n"
                "l3 = urut[:kmax]\n"
                "for nama, l in [('tanpa koreksi',l1),('Bonferroni',l2),('BH-FDR',l3)]:\n"
                "    b, f = evaluasi(l)\n"
                "    print(f'{nama:<14}: {len(l):>4} klaim = {b} benar + {f} PALSU')\n"
                "print()\n"
                "print('Tanpa koreksi: banjir palsu. Bonferroni: aman tapi buta.')\n"
                "print('BH: menemukan sinyal dengan 5% palsu terkontrol.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Deteksi Batch Effect dari Matriks Jarak",
            "intro": "Simulasikan ekspresi 100 gen \u00d7 12 sampel (2 kondisi \u00d7 2 batch). Hitung korelasi antar-sampel dan lihat pengelompokan: batch atau kondisi?",
            "hint": "Ubah efek batch dari 2.0 \u2192 0.5. Pada titik berapa kondisi mengalahkan batch? Itulah ambang desainmu harus di atasnya.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(88)\n"
                "EFEK_BATCH = 2.0  # ubah: 0.5 vs 2.0\n"
                "sampel = []\n"
                "for b in ['A','B']:\n"
                "    for k in ['kontrol','kasus']:\n"
                "        for r in range(3):\n"
                "            expr = [random.gauss(0,1) + (EFEK_BATCH if b=='B' else 0)\n"
                "                    + (0.8 if k=='kasus' and i<10 else 0) for i in range(100)]\n"
                "            sampel.append((f'{b}-{k}{r}', b, k, expr))\n"
                "def kor(a, b):\n"
                "    ma, mb = st.mean(a), st.mean(b)\n"
                "    atas = sum((x-ma)*(y-mb) for x,y in zip(a,b))\n"
                "    bawah = (sum((x-ma)**2 for x in a)*sum((y-mb)**2 for y in b))**0.5\n"
                "    return atas/bawah\n"
                "# rata-rata korelasi dalam-batch vs dalam-kondisi\n"
                "kb = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[1]==b[1]]\n"
                "kk = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[2]==b[2]]\n"
                "print(f'korelasi rata2 dalam-BATCH   : {st.mean(kb):.2f}')\n"
                "print(f'korelasi rata2 dalam-KONDISI : {st.mean(kk):.2f}')\n"
                "print()\n"
                "if st.mean(kb) > st.mean(kk):\n"
                "    print('BATCH mendominasi! -> cek desain, koreksi, atau ulangi.')\n"
                "else:\n"
                "    print('Kondisi mendominasi -> aman, lanjutkan analisis.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Klaim final / regulasi \u2192 Bonferroni (FWER)",
            "kondisi": "Satu false positive pun mahal.",
            "alasan": "Kontrol peluang ada-nya false positive.",
            "contoh": "Ambang GWAS 5e-8; klaim diagnostik.",
        },
        {
            "title": "Eksplorasi / penemuan \u2192 FDR (BH)",
            "kondisi": "Boleh ada sebagian palsu; butuh power.",
            "alasan": "Kontrol proporsi, bukan eksistensi.",
            "contoh": "RNA-seq screening; proteomik.",
        },
        {
            "title": "Dugaan batch \u2192 PCA + desain/koreksi",
            "kondisi": "Multi-batch; metadata tersedia.",
            "alasan": "Deteksi visual cepat; koreksi bila tidak confounded.",
            "contoh": "ComBat atau ~batch + kondisi.",
        },
        {
            "title": "Rancang eksperimen \u2192 Power + interleaved batch",
            "kondisi": "Sebelum keluar uang sekuensing.",
            "alasan": "n yang benar + desain anti-batch.",
            "contoh": "Hitung n untuk 20k uji, acak batch.",
        },
    ],
    "aturan10": [
        "20.000 uji \u2192 koreksi wajib (BH/FWER).",
        "PCA berlabel batch = gambar pertama.",
        "Batch confounded total = tidak terselamatkan.",
        "Jangan ukur jarak dari UMAP.",
    ],
    "case": {
        "title": "\u201cSignature 50 Gen\u201d yang Ternyata Signature Mesin",
        "body": [
            "<p>Paper mengklaim signature 50 gen untuk prognosis kanker (n=200). Perusahaan ingin lisensi. Kamu diminta due diligence.</p>",
            "<p>Temuan: 100 sampel baik disekuensing di mesin NovaSeq (2023), 100 buruk di HiSeq (2021). \u201cSignature\u201d = gen-gen yang ekspresinya beda antar mesin. Tanpa koreksi multiple testing yang benar (p<0,05 mentah dari 20.000 gen).</p>",
        ],
        "pertanyaan": "Putusanmu untuk perusahaan?",
        "pembahasan": "TOLAK. Dua cacat fatal independen: (1) batch (mesin+tahun) confounded total dengan outcome \u2014 signature = artefak teknis; (2) tanpa koreksi multiple testing, 1.000 false positive ekspektasi \u2014 50 gen bisa semuanya noise. Tidak ada analisis ulang yang bisa menyelamatkan desain ini; butuh kohort baru dengan desain interleaved + validasi independen. Pelajaran: due diligence bioinformatika = cek batch + cek multiple testing SEBELUM baca hasilnya. Dua cek ini membatalkan sebagian \u201cpenemuan\u201d di literatur.",
    },
    "quiz": [
        ("Dari 20.000 uji tanpa koreksi pada alpha 0,05, ekspektasi false positive?",
         ["0", "~1.000", "5", "20.000"],
         1,
         "Benar: 20.000 \u00d7 0,05. Inilah mesin penemuan palsu tanpa koreksi."),
        ("Kapan Bonferroni dipilih atas FDR?",
         ["Selalu", "Klaim final di mana satu false positive pun mahal (GWAS, diagnostik)", "Eksplorasi", "Tidak pernah"],
         1,
         "Benar: FWER vs FDR = bukti final vs penemuan. Pilih sesuai harga kesalahan."),
        ("PCA menunjukkan sampel mengelompok per tanggal sekuensing, bukan kondisi. Artinya?",
         ["Normal", "Batch effect mendominasi \u2014 investigasi desain sebelum lanjut", "Kondisi tidak berpengaruh", "PCA salah"],
         1,
         "Benar: gambar pertama setiap analisis. Batch > kondisi = lampu merah."),
        ("Batch confounded total dengan kondisi (semua kasus batch A). Solusi?",
         ["ComBat", "Tidak ada koreksi valid \u2014 ulangi dengan desain benar", "Tambah sampel", "Ganti metode"],
         1,
         "Benar: statistik tidak bisa memisahkan yang tidak terpisahkan di desain. Pencegahan > koreksi."),
        ("Jarak antar klaster di plot UMAP\u2026",
         ["Bermakna kuantitatif", "Tidak bermakna \u2014 UMAP mengorbankan jarak global", "Sama dengan PCA", "Harus diukur"],
         1,
         "Benar: UMAP untuk struktur lokal/klaster. Jangan ukur \u201ckedekatan biologis\u201d darinya."),
        ("Power 80% artinya\u2026",
         ["80% hasil signifikan", "Peluang 80% mendeteksi efek yang benar-benar ada", "80% data benar", "Tidak ada arti"],
         1,
         "Benar: 1\u2212beta. Hitung SEBELUM eksperimen, dengan m terkoreksi."),
    ],
    "rangkuman": [
        "<strong>Multiple testing</strong>: tanpa koreksi = banjir false positive.",
        "<strong>Bonferroni</strong> (FWER) untuk klaim final; <strong>FDR/BH</strong> untuk penemuan.",
        "<strong>Batch effect</strong>: deteksi via PCA; cegah via desain interleaved.",
        "Batch confounded total = <strong>tidak terselamatkan</strong>.",
        "<strong>PCA</strong> untuk QC/struktur global; <strong>UMAP</strong> untuk klaster (jarak antar-klaster tak bermakna).",
        "<strong>Power</strong>: hitung sebelum eksperimen dengan m terkoreksi.",
        "Laporkan: metode koreksi + ambang + m.",
        "Dua cek due diligence: <strong>batch + multiple testing</strong> sebelum percaya hasil.",
    ],
    "prev": ("bi9-rna-seq", "BI9"),
    "next": ("bi11-single-cell", "BI11"),
}

# ================================================================ BI11
BI11 = {
    "slug": "bi11-single-cell",
    "code": "BI11",
    "track": TRACK,
    "cover_title": "Seurat, UMAP &amp; Trajectory:<br />Single-Cell RNA-seq",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Smoothie vs Buah Potong"),
        ("qc", "QC Single-Cell: Sel Baik vs Sampah"),
        ("reduksi", "HVG, PCA, Clustering &amp; Anotasi"),
        ("trajectory", "Trajectory &amp; Spatial (Arah Baru)"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: QC Metrics &amp; Filter Sel"),
        ("lab2", "\U0001f52c Lab 2: Clustering Sederhana (k-means)"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan perbedaan <strong>bulk vs single-cell RNA-seq</strong> dan kapan masing-masing.",
        "Menerapkan <strong>QC sel</strong>: nFeature, nCount, %MT, doublet.",
        "Menjelaskan alur <strong>HVG \u2192 PCA \u2192 neighbor \u2192 clustering \u2192 UMAP \u2192 anotasi marker</strong>.",
        "Menjelaskan konsep <strong>trajectory/pseudotime</strong> dan <strong>spatial transcriptomics</strong>.",
    ],
    "story_title": "Cerita Pembuka: Smoothie vs Buah Potong",
    "story": [
        "<p>Bulk RNA-seq seperti membuat smoothie dari sekeranjang buah lalu menebak komposisinya dari rasa: \u201cada manis apel, asam jeruk\u2026\u201d Single-cell seperti memotong tiap buah dan mencicipi satu per satu: \u201coh, ada 3 apel, 2 jeruk, dan 1 buah aneh yang belum pernah kulihat!\u201d</p>",
        "<p>Buah aneh itu = tipe sel langka yang tak terlihat di bulk \u2014 mis. sel punca kanker 0,1% yang menyebabkan kekambuhan. Single-cell RNA-seq (teknologi terpilih dekade ini!) membuka heterogenitas yang disembunyikan rata-rata. Lesson ini adalah tur alur analisisnya \u2014 skill yang muncul di hampir semua lowongan bioinformatika 2026.</p>",
    ],
    "konsep": [
        {
            "id": "qc",
            "title": "QC Single-Cell: Sel Baik vs Sampah",
            "definisi": "Tiap <strong>barcode</strong> = satu sel (harusnya). QC menyaring: <strong>droplet kosong</strong> (nCount rendah), <strong>sel mati/stres</strong> (%MT tinggi \u2014 mitokondria bocor), <strong>doublet</strong> (2 sel 1 droplet \u2014 nFeature ganda).",
            "kepribadian": "QC single-cell itu seperti sortir buah: buang yang busuk (mati), yang kembar siam (doublet), dan yang ternyata cuma kulit (droplet kosong). Smoothie dari buah busuk = bulk yang tercemar; untungnya di single-cell kita bisa membuang per buah.",
            "kapan": "Langkah 1 SELALU. Threshold tergantung jaringan (otak %MT tinggi normal!) \u2014 jangan pakai angka magis buta.",
            "worked": (
                "\U0001f4d0 Contoh: filter Seurat tipikal",
                "<p>nFeature_RNA: 200\u20132500 (buang <200 = kosong, >2500 = doublet?).<br />"
                "percent.mt < <strong>10%</strong> (jaringan umum; otak bisa 20%).<br />"
                "Doublet: prediksi via DoubletFinder/scrublet \u2014 buang skor tinggi.<br />"
                "Dari 10.000 barcode \u2192 7.000 sel bersih. 30% sampah dibuang SEBELUM analisis \u2014 normal!</p>",
            ),
            "chart": {
                "var": "bi11QcData",
                "data": [{"x": [200, 500, 800, 1200, 1800, 2500, 3500, 5000], "y": [50, 800, 2500, 3000, 1800, 600, 150, 30], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Sel", "text": ["", "", "", "", "", "", "", ""], "textposition": "outside"}],
                "title": "Distribusi nFeature per Barcode (ilustratif)",
                "layout": {"xaxis": {"title": "nFeature_RNA (gen terdeteksi)"}, "yaxis": {"title": "Jumlah barcode"}, "showlegend": False, "shapes": [{"type": "line", "x0": 200, "x1": 200, "y0": 0, "y1": 3200, "line": {"dash": "dash", "color": "#e8a838"}}, {"type": "line", "x0": 2500, "x1": 2500, "y0": 0, "y1": 3200, "line": {"dash": "dash", "color": "#e8a838"}}]},
                "title2": "",
                "cara": "Histogram gen terdeteksi per barcode. Dua garis kuning = ambang filter bawah (200) dan atas (2500).",
                "interpretasi": "Puncak kiri (<200) = droplet kosong/debris \u2014 buang. Ekor kanan (>2500) = kandidat doublet \u2014 curigai. Yang tengah = sel layak. Inilah QC visual standar sebelum satu gen pun dianalisis.",
            },
        },
        {
            "id": "reduksi",
            "title": "HVG, PCA, Clustering &amp; Anotasi \u2014 Si Jalur Pipa",
            "definisi": "<strong>HVG</strong>: pilih 2.000 gen paling bervariasi (buang noise). <strong>PCA</strong>: reduksi linear. <strong>Clustering</strong> (Louvain/Leiden): kelompokkan sel mirip. <strong>UMAP</strong>: visualisasi. <strong>Anotasi</strong>: beri nama klaster via marker gen (CD3D = T cell, dsb.).",
            "kepribadian": "Alur ini seperti sensus: HVG = pilih pertanyaan survei yang membedakan; PCA = ringkas jawaban; clustering = kelompokkan warga mirip; anotasi = beri nama kampungnya (\u201cKampung T-cell\u201d) berdasarkan penanda.",
            "kapan": "Alur standar Seurat/Scanpy untuk semua scRNA-seq. Resolusi clustering = tombol \u201cberapa kampung\u201d \u2014 tidak ada angka benar, ada yang bermakna biologis.",
            "worked": (
                "\U0001f4d0 Contoh: anotasi klaster imun",
                "<p>Klaster 0: CD3D+, CD8A+ \u2192 <strong>T CD8</strong>. Klaster 1: CD79A+, MS4A1+ \u2192 <strong>B cell</strong>. Klaster 2: CD14+, LYZ+ \u2192 <strong>monosit</strong>.<br />"
                "Validasi: cocokkan dengan referensi (Azimuth/SingleR) + cek marker di literatur.<br />"
                "<strong>Waspada:</strong> klaster kecil (0,5%) bisa jadi doublet atau tipe langka \u2014 investigasi, jangan langsung buang atau langsung klaim \u201cnovel\u201d.</p>",
            ),
            "rumus": r"\text{Resolusi} \uparrow \Rightarrow \text{jumlah klaster} \uparrow",
            "simbol": [],
            "interpretasi": "Resolusi clustering adalah parameter, bukan kebenaran. Naikkan hingga klaster punya marker biologis yang jelas; berhenti sebelum menjadi noise. Uji beberapa resolusi (0,4\u20131,2) dan pilih yang bermakna.",
        },
        {
            "id": "trajectory",
            "title": "Trajectory &amp; Spatial \u2014 Si Arah Baru",
            "definisi": "<strong>Trajectory/pseudotime</strong> (Monocle, Slingshot): urutkan sel sepanjang proses biologis (diferensiasi) dari snapshot statis. <strong>Spatial transcriptomics</strong> (Visium, Xenium): ekspresi gen + POSISI di jaringan \u2014 peta, bukan sekadar daftar.",
            "kepribadian": "Trajectory itu seperti menyusun foto-foto kerumunan menjadi film: dari sel punca \u2192 perantara \u2192 matang, ditebak dari kemiripan. Spatial itu seperti sensus ber-peta: tidak cuma \u201csiapa\u201d tapi \u201ctinggal di mana\u201d \u2014 tetangga sel kanker vs sel imun mengubah segalanya.",
            "kapan": "Trajectory: diferensiasi, respons obat sepanjang waktu, perkembangan. Spatial: interaksi sel, mikroenvironment tumor \u2014 skill terpanas di lowongan 2026.",
            "worked": (
                "\U0001f4d0 Contoh: pseudotime diferensiasi",
                "<p>Sel punca darah: klaster HSC \u2192 progenitor \u2192 monosit matang.<br />"
                "Pseudotime mengurutkan sel; gen GATA1 naik di tengah (komitmen), CD14 naik di ujung (matang).<br />"
                "<strong>Validasi:</strong> pseudotime = inferensi, bukan waktu nyata! Konfirmasi dengan time-course eksperimen atau RNA velocity (rasio spliced/unspliced \u2192 arah perubahan).<br />"
                "<strong>Spatial:</strong> di tumor, T cell TERKECUALI dari inti tumor (excluded) vs menyusup (inflamed) \u2014 memprediksi respons imunoterapi. Tanpa posisi, keduanya terlihat sama!</p>",
            ),
            "callout": "<strong>Catatan lowongan:</strong> \u201cExperience with single-cell and spatial transcriptomics\u201d kini standar di posting bioinformatika (Karolinska, Tempus, Excelra). Kuasai alur scRNA-seq dulu (lesson ini), lalu spatial sebagai ekstensi \u2014 polanya mirip (QC \u2192 reduksi \u2192 klaster \u2192 anotasi + dimensi ruang).",
        },
    ],
    "myths": [
        ("Klaster = tipe sel yang pasti",
         "Klaster adalah hasil algoritma + parameter (resolusi!). Klaster bisa = tipe sel, state sel, batch, atau doublet. Anotasi butuh marker + referensi + validasi \u2014 bukan sekadar \u201cLouvain bilang 8 klaster\u201d."),
        ("UMAP yang bagus = analisis yang benar",
         "UMAP cantik bisa menutupi QC buruk (doublet jadi \u201cklaster novel\u201d!). Urutan: QC ketat \u2192 analisis \u2192 UMAP sebagai visualisasi, bukan validasi. Jangan tune parameter demi UMAP indah."),
        ("Pseudotime = waktu nyata",
         "Pseudotime = urutan inferensi dari kemiripan, bukan jam. Ia tidak tahu arah tanpa info tambahan (root yang benar, RNA velocity). Klaim \u201cA menjadi B\u201d butuh validasi eksperimental."),
    ],
    "tips": [
        "Hafalkan <strong>marker klasik</strong> jaringanmu (imun: CD3D/CD79A/CD14; otak: NEUN/OLIG2/GFAP). Anotasi 80% lebih cepat dengan kamus marker di kepala.",
        "Untuk integrasi multi-sampel: <strong>integrasi/harmony</strong> untuk hapus batch TAPI cek tidak menghapus biologi. Over-integration = klaster palsu menyatu.",
        "Simpan <strong>Seurat/AnnData object</strong> berversi. Objek 50 GB yang tidak terdokumentasi = tidak ada gunanya 6 bulan kemudian.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: QC Metrics &amp; Filter Sel",
            "intro": "Diberikan matriks sel \u00d7 metrik (nFeature, nCount, %MT), terapkan filter QC dan lihat berapa sel lolos + distribusinya.",
            "hint": "Ubah threshold %MT 10 \u2192 20. Berapa sel \u201cmartir\u201d terselamatkan? Untuk jaringan apa ini dibenarkan? (Petunjuk: otak.)",
            "code": (
                "import random\n"
                "random.seed(2024)\n"
                "sel = []\n"
                "for i in range(3000):\n"
                "    r = random.random()\n"
                "    if r < 0.15:      # droplet kosong\n"
                "        nf, nc, mt = random.randint(20,150), random.randint(50,400), random.uniform(0,5)\n"
                "    elif r < 0.25:    # sel mati\n"
                "        nf, nc, mt = random.randint(300,800), random.randint(500,2000), random.uniform(15,40)\n"
                "    elif r < 0.30:    # doublet\n"
                "        nf, nc, mt = random.randint(3000,6000), random.randint(8000,20000), random.uniform(2,8)\n"
                "    else:             # sel baik\n"
                "        nf, nc, mt = random.randint(500,2200), random.randint(1500,7000), random.uniform(1,9)\n"
                "    sel.append((nf, nc, mt))\n"
                "lolos = [s for s in sel if 200 <= s[0] <= 2500 and s[2] < 10]\n"
                "print(f'total barcode : {len(sel)}')\n"
                "print(f'lolos QC      : {len(lolos)} ({len(lolos)/len(sel):.0%})')\n"
                "print(f'terbuang      : {len(sel)-len(lolos)} (kosong/mati/doublet)')\n"
                "print()\n"
                "print('30% sampah = NORMAL di scRNA-seq. QC bukan opsional.')\n"
                "print('Doublet sungguhan butuh DoubletFinder/scrublet (pola ekspresi),')\n"
                "print('bukan cuma nFeature tinggi.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Clustering k-means Sederhana",
            "intro": "Simulasikan 3 tipe sel (ekspresi 2 gen marker), jalankan k-means dari nol, lalu evaluasi: apakah klaster = tipe asli?",
            "hint": "Ini versi mini Louvain. Perhatikan: k-means butuh k yang benar \u2014 Louvain/Leiden menemukan k dari data (dengan resolusi). Itulah kenapa dipakai.",
            "code": (
                "import random, statistics as st\n"
                "random.seed(11)\n"
                "# 3 tipe sel: (CD3D, CD79A)\n"
                "tipe = {'T': (10, 1), 'B': (1, 10), 'Mono': (4, 4)}\n"
                "data = []\n"
                "for t, (m1, m2) in tipe.items():\n"
                "    for _ in range(100):\n"
                "        data.append((t, random.gauss(m1,1.5), random.gauss(m2,1.5)))\n"
                "# k-means k=3, sederhana\n"
                "cent = [(12,1),(1,12),(4,4)]\n"
                "for _ in range(20):\n"
                "    kl = [[] for _ in range(3)]\n"
                "    for t,x,y in data:\n"
                "        j = min(range(3), key=lambda j: (x-cent[j][0])**2+(y-cent[j][1])**2)\n"
                "        kl[j].append((t,x,y))\n"
                "    cent = [(st.mean(p[1] for p in c), st.mean(p[2] for p in c)) for c in kl]\n"
                "print('klaster -> komposisi tipe asli:')\n"
                "for j, c in enumerate(kl):\n"
                "    hit = {}\n"
                "    for t,_,_ in c: hit[t] = hit.get(t,0)+1\n"
                "    print(f'  klaster {j}: {hit}')\n"
                "print()\n"
                "print('Klaster ~ tipe asli bila marker kuat. Anotasi = beri nama')\n"
                "print('berdasarkan marker dominan (CD3D tinggi -> T cell).')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Eksplorasi heterogenitas jaringan \u2192 scRNA-seq",
            "kondisi": "Butuh resolusi sel; tipe langka penting.",
            "alasan": "Bulk meratakan sinyal langka.",
            "contoh": "Sel punca kanker 0,1%.",
        },
        {
            "title": "Perbandingan kondisi, n besar, budget terbatas \u2192 bulk RNA-seq",
            "kondisi": "Efek rata-rata cukup; butuh power statistik.",
            "alasan": "Murah, dalam, statistik matang (BI9).",
            "contoh": "DE 50 vs 50 sampel klinis.",
        },
        {
            "title": "Diferensiasi / dinamika \u2192 trajectory + RNA velocity",
            "kondisi": "Proses kontinu dari snapshot.",
            "alasan": "Urutkan + arahkan perubahan.",
            "contoh": "Diferensiasi hematopoietik.",
        },
        {
            "title": "Konteks ruang penting \u2192 spatial transcriptomics",
            "kondisi": "Posisi menentukan fungsi/interaksi.",
            "alasan": "Peta, bukan daftar.",
            "contoh": "Mikroenvironment tumor vs respons imunoterapi.",
            "chart": {
                "var": "bi11TradeData",
                "data": [{"x": ["Bulk", "Single-cell", "Spatial"], "y": [9, 6, 4], "type": "bar", "name": "Throughput/murah", "marker": {"color": "#2a7de1"}},
                        {"x": ["Bulk", "Single-cell", "Spatial"], "y": [2, 9, 10], "type": "bar", "name": "Resolusi", "marker": {"color": "#e8a838"}}],
                "title": "Bulk vs Single-cell vs Spatial (ilustratif)",
                "layout": {"barmode": "group", "xaxis": {"title": "Teknologi"}, "yaxis": {"title": "Skor"}, "showlegend": True},
                "cara": "Biru = kemudahan/throughput, kuning = resolusi informasi. Tidak ada yang menang keduanya.",
                "interpretasi": "Trade-off klasik: bulk murah tapi buta heterogenitas; spatial paling informatif tapi mahal dan kompleks. Pilih sesuai pertanyaan \u2014 bukan yang paling canggih.",
            },
        },
    ],
    "aturan10": [
        "QC dulu: nFeature, %MT, doublet.",
        "HVG \u2192 PCA \u2192 klaster \u2192 UMAP \u2192 anotasi marker.",
        "Klaster \u2260 tipe sel sampai tervalidasi.",
        "Pseudotime = inferensi, bukan jam.",
    ],
    "case": {
        "title": "\u201cTipe Sel Baru\u201d yang Ternyata Doublet",
        "body": [
            "<p>Paper mengklaim tipe sel imun BARU dari scRNA-seq: klaster kecil (1%) mengekspresikan marker T cell DAN B cell bersamaan. Media heboh. Kamu diminta replikasi.</p>",
            "<p>Cekmu: nFeature klaster itu 2x median; tidak ada validasi doublet; tidak ada konfirmasi eksperimental (FACS/RNA-FISH).</p>",
        ],
        "pertanyaan": "Putusan dan bukti yang dibutuhkan untuk klaim \u201cnovel\u201d.",
        "pembahasan": "Kemungkinan besar doublet T+B (marker ganda + nFeature tinggi = tanda klasik), bukan biologi baru. Bukti yang dibutuhkan: (1) skor doublet rendah via 2 metode independen; (2) replikasi di sampel/dataset independen; (3) validasi eksperimental (FACS sorting + qPCR, atau spatial: apakah \u201csel\u201d ini ada sebagai satu sel di jaringan?). Pelajaran: klaster kecil + marker ganda = doublet sampai terbukti bukan. Klaim \u201cnovel cell type\u201d adalah klaim luar biasa yang butuh bukti luar biasa \u2014 dan doublet adalah penjelasan paling membosankan yang paling sering benar.",
    },
    "quiz": [
        ("Keunggulan single-cell atas bulk RNA-seq?",
         ["Lebih murah", "Melihat heterogenitas & tipe sel langka yang diratakan bulk", "Lebih mudah", "Tidak ada"],
         1,
         "Benar: smoothie vs buah potong. Sel 0,1% tak terlihat di bulk."),
        ("%MT tinggi pada suatu barcode menandakan\u2026",
         ["Sel sehat", "Sel mati/stres (mitokondria bocor, RNA sitoplasma hilang) \u2014 buang", "Sel membelah", "Doublet pasti"],
         1,
         "Benar: QC klasik. Tapi threshold tergantung jaringan (otak lebih toleran)!"),
        ("Urutan alur scRNA-seq standar?",
         ["UMAP dulu", "QC \u2192 HVG \u2192 PCA \u2192 clustering \u2192 UMAP \u2192 anotasi marker", "Anotasi dulu", "Bebas"],
         1,
         "Benar: pipa Seurat/Scanpy. Tiap tahap punya alasan; jangan loncat QC."),
        ("Doublet adalah\u2026",
         ["Sel ganda DNA", "Dua sel dalam satu droplet \u2014 terlihat sebagai \u201ctipe\u201d palsu bermarker ganda", "Sel mati", "Batch effect"],
         1,
         "Benar: tanda = nFeature tinggi + marker dua tipe. Deteksi via DoubletFinder/scrublet."),
        ("Pseudotime mengukur\u2026",
         ["Waktu nyata", "Urutan inferensi sepanjang proses biologis \u2014 bukan jam; butuh validasi", "Umur sel", "Kecepatan"],
         1,
         "Benar: dari kemiripan snapshot. Arah + validasi (RNA velocity/eksperimen) wajib."),
        ("Kapan spatial transcriptomics dipilih?",
         ["Selalu", "Ketika POSISI sel menentukan fungsi (mikroenvironment tumor, otak)", "Tidak pernah", "Hanya untuk bakteri"],
         1,
         "Benar: peta, bukan daftar. T cell excluded vs inflamed = prediksi imunoterapi."),
    ],
    "rangkuman": [
        "<strong>scRNA-seq</strong> = heterogenitas per sel; bulk = rata-rata.",
        "<strong>QC</strong>: nFeature, nCount, %MT, doublet \u2014 buang 30% sampah itu normal.",
        "Alur: <strong>HVG \u2192 PCA \u2192 Louvain/Leiden \u2192 UMAP \u2192 anotasi marker</strong>.",
        "Klaster = hipotesis; <strong>anotasi butuh marker + referensi + validasi</strong>.",
        "<strong>Trajectory</strong>: urutan diferensiasi (inferensi!); <strong>RNA velocity</strong>: arah.",
        "<strong>Spatial</strong>: ekspresi + posisi \u2014 skill terpanas lowongan.",
        "Resolusi clustering = parameter; pilih yang bermakna biologis.",
        "Waspadai doublet menyamar sebagai \u201ctipe sel baru\u201d.",
    ],
    "prev": ("bi10-statistik-bioinfo", "BI10"),
    "next": ("bi12-genomika-populasi", "BI12"),
}

# ================================================================ BI12
BI12 = {
    "slug": "bi12-genomika-populasi",
    "code": "BI12",
    "track": TRACK,
    "cover_title": "GWAS &amp; Polygenic Score:<br />Genetika Populasi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 1 Juta Orang, 1 Varian"),
        ("hw", "Hardy-Weinberg &amp; LD"),
        ("gwas", "GWAS: Manhattan Plot"),
        ("stratifikasi", "Stratifikasi Populasi &amp; Koreksi"),
        ("prs", "Polygenic Score &amp; eQTL"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Uji Hardy-Weinberg (Chi-square)"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Stratifikasi Palsu"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>Hardy-Weinberg</strong> sebagai QC dan <strong>LD</strong> sebagai dasar GWAS.",
        "Membaca <strong>Manhattan plot & QQ plot</strong> dan menerapkan ambang 5e-8.",
        "Menjelaskan <strong>stratifikasi populasi</strong> dan koreksinya (PCA, mixed model).",
        "Menghitung <strong>polygenic score</strong> sederhana dan menjelaskan batasannya (+ eQTL).",
    ],
    "story_title": "Cerita Pembuka: 1 Juta Orang, 1 Varian",
    "story": [
        "<p>Studi 1 juta orang menemukan varian yang menaikkan risiko diabetes 1,15x. Media: \u201cGen diabetes ditemukan!\u201d Realita: varian itu menjelaskan <strong>0,01%</strong> variasi \u2014 dan diabetes dipengaruhi 1.000+ varian serupa. Satu varian = setetes; yang penting adalah <strong>lautan poligenik</strong>.</p>",
        "<p>Genetika populasi adalah ilmu variasi antar manusia: kenapa kita beda, bagaimana memetakan varian ke sifat, dan bagaimana memakai ribuan varian kecil untuk prediksi. Lesson ini dari ekuilibrium klasik sampai polygenic score \u2014 topik yang menghubungkan evolusi, statistik, dan klinik.</p>",
    ],
    "konsep": [
        {
            "id": "hw",
            "title": "Hardy-Weinberg &amp; LD \u2014 Si Keseimbangan dan Si Tetangga",
            "definisi": "<strong>Hardy-Weinberg</strong>: frekuensi genotipe = p\u00b2, 2pq, q\u00b2 bila populasi ideal (acak, besar, tanpa seleksi). Penyimpangan = sinyal genotyping error / seleksi / stratifikasi \u2014 dipakai untuk <strong>QC</strong>. <strong>LD (linkage disequilibrium)</strong>: alel tetangga diwariskan bersama (tidak acak) \u2014 dasar GWAS: genotyping SNP tag mewakili blok LD.",
            "rumus": r"p^2 + 2pq + q^2 = 1",
            "simbol": [
                (r"p, q", "frekuensi alel A dan a (p+q=1)"),
                (r"p^2, 2pq, q^2", "frekuensi genotipe AA, Aa, aa dalam ekuilibrium"),
            ],
            "interpretasi": "HW adalah \u201cnol\u201d-nya genetika populasi: seperti mengharapkan dadu adil. Bila dadu miring (penyimpangan HW), ada yang salah dengan dadu (genotyping) atau pemainnya (seleksi/stratifikasi).",
            "worked": (
                "\U0001f4d0 Contoh: uji HW sebagai QC",
                "<p>SNP dengan 100 orang: AA=25, Aa=50, aa=25. p = (2\u00d725+50)/200 = 0,5.<br />"
                "Ekspektasi: 25, 50, 25 \u2192 <strong>persis HW</strong> \u2713.<br />"
                "Kasus bermasalah: AA=10, Aa=80, aa=10 \u2192 heterozigot berlebih \u2192 curigai <strong>genotyping error</strong> (atau duplikasi segmen). SNP ini dibuang dari GWAS.<br />"
                "<strong>LD:</strong> dua SNP 5kb apart dengan r\u00b2=0,9 \u2014 genotyping satu mewakili keduanya \u2192 array 500rb SNP mewakili 10 juta varian!</p>",
            ),
            "kepribadian": "HW itu seperti neraca: diam saat semua beres, miring saat ada masalah. LD itu seperti tetangga gang: yang satu pindah, yang sebelah ikut-ikutan \u2014 genotyping satu, dapat info dua.",
            "kapan": "QC GWAS: buang SNP menyimpang HW (p<1e-6). Desain array: pilih tag SNP per blok LD.",
            "chart": {
                "var": "bi12LdData",
                "data": [{"z": [[1.0, 0.9, 0.7, 0.2], [0.9, 1.0, 0.8, 0.3], [0.7, 0.8, 1.0, 0.4], [0.2, 0.3, 0.4, 1.0]], "x": ["SNP1", "SNP2", "SNP3", "SNP4"], "y": ["SNP1", "SNP2", "SNP3", "SNP4"], "type": "heatmap", "colorscale": "Reds", "showscale": True}],
                "title": "Matriks LD (r\u00b2) 4 SNP",
                "layout": {"xaxis": {"title": ""}, "yaxis": {"title": ""}, "showlegend": False},
                "cara": "Heatmap korelasi antar SNP. Merah tua = LD tinggi (diwariskan bersama).",
                "interpretasi": "SNP1-3 membentuk blok LD (merah) \u2014 satu tag SNP cukup mewakili ketiganya. SNP4 independen. Inilah cara array 500rb SNP \u201cmelihat\u201d 10 juta varian: via blok-blok LD.",
            },
        },
        {
            "id": "gwas",
            "title": "GWAS: Manhattan Plot \u2014 Si Pencakar Langit",
            "definisi": "<strong>GWAS</strong>: uji asosiasi tiap SNP (jutaan!) dengan sifat. <strong>Manhattan plot</strong>: x = posisi genom, y = \u2212log10(p). Puncak = lokus terkait. Ambang: <strong>5\u00d710\u207b\u2078</strong> (Bonferroni untuk 1 juta uji independen).",
            "kepribadian": "Manhattan plot itu seperti peta kota di malam hari: gedung-gedung (kromosom) dengan beberapa pencakar langit (sinyal) yang menonjol. Tapi ingat: pencakar itu menandai <em>blok LD</em>, bukan gen pasti \u2014 gen penyebabnya bisa tetangga sebelah.",
            "kapan": "Pemetaan varian untuk sifat kompleks. Butuh n besar (10rb\u20131jt) karena efek kecil.",
            "worked": (
                "\U0001f4d0 Contoh: membaca Manhattan diabetes",
                "<p>Puncak di chr10 (TCF7L2), p=1e-40 \u2192 sinyal kuat, terreplikasi.<br />"
                "50 puncak lain p<5e-8 \u2192 masing-masing OR 1,05\u20131,2 (kecil!).<br />"
                "<strong>QQ plot</strong>: titik mengikuti garis kecuali ekor atas \u2192 tidak ada inflasi sistematis (lambda ~1,0). Bila SEMUA titik di atas garis \u2192 stratifikasi belum terkoreksi!<br />"
                "Langkah lanjut: fine-mapping (SNP kausal dalam blok LD?) + replikasi populasi lain.</p>",
            ),
            "chart": {
                "var": "bi12ManhData",
                "data": [{"x": list(range(1, 101)), "y": [1+abs((i*37)%7-3) + (12 if i in [23,67] else 0) + (6 if i in [45] else 0) for i in range(1, 101)], "type": "scatter", "mode": "markers", "marker": {"color": "#2a7de1", "size": 6}, "showlegend": False}],
                "title": "Manhattan Plot (ilustratif)",
                "layout": {"xaxis": {"title": "Posisi genom"}, "yaxis": {"title": "-log10(p)"}, "showlegend": False, "shapes": [{"type": "line", "x0": 1, "x1": 100, "y0": 7.3, "y1": 7.3, "line": {"dash": "dash", "color": "#e8a838"}}]},
                "cara": "X = posisi sepanjang genom, Y = signifikansi. Garis kuning = ambang 5e-8. Puncak di atas garis = sinyal.",
                "interpretasi": "Dua pencakar langit menembus ambang = lokus terkait. Titik-titik di bawah = noise. Ingat: puncak menandai blok LD \u2014 butuh fine-mapping untuk menemukan varian/gen kausal sebenarnya.",
            },
        },
        {
            "id": "stratifikasi",
            "title": "Stratifikasi Populasi &amp; Koreksi \u2014 Si Pengacau",
            "definisi": "<strong>Stratifikasi populasi</strong>: subpopulasi beda frekuensi alel DAN beda prevalensi penyakit \u2192 asosiasi palsu (confounding genetik!). Koreksi: <strong>PCA</strong> (masukkan PC sebagai kovariat) atau <strong>mixed model</strong> (kinship).",
            "kepribadian": "Stratifikasi itu seperti meneliti \u201cgen suka sate\u201d di Indonesia: orang Jawa lebih banyak makan sate DAN punya varian X lebih banyak \u2014 varian X \u201cterkait\u201d sate padahal cuma penanda suku. PCA adalah penerjemah yang membisikkan \u201chei, ini cuma soal suku\u201d.",
            "kapan": "Setiap GWAS: selalu cek QQ plot + PCA; koreksi standar. Untuk Indonesia: keragaman etnis TINGGI \u2192 stratifikasi parah bila diabaikan.",
            "worked": (
                "\U0001f4d0 Contoh klasik: chopstick gene",
                "<p>Studi \u201cgen kemampuan menyumpit\u201d: SNP terkait kuat! Ternyata sampel campur Asia (bisa menyumpit, alel X umum) + Eropa (tidak, alel X langka).<br />"
                "Setelah koreksi 10 PC: sinyal <strong>lenyap total</strong>.<br />"
                "Pelajaran: tanpa koreksi, GWAS menemukan \u201cgen budaya\u201d \u2014 bukan gen penyakit.</p>",
            ),
            "warning": "<strong>Untuk Indonesia:</strong> 1.300+ suku dengan sejarah migrasi kompleks = stratifikasi ekstrem. GWAS Indonesia tanpa koreksi populasi yang cermat = pabrik temuan palsu. Ini juga alasan butuh referensi genomik nasional (BI2).",
        },
        {
            "id": "prs",
            "title": "Polygenic Score &amp; eQTL \u2014 Si Peramal dan Si Penghubung",
            "definisi": "<strong>PRS</strong> = \u03a3 (efek SNP \u00d7 jumlah alel): agregat ribuan varian kecil menjadi skor risiko individu. <strong>eQTL</strong>: varian yang memengaruhi EKSPRESI gen \u2014 jembatan dari \u201clokus terkait\u201d ke \u201cgen & mekanisme\u201d.",
            "rumus": r"PRS_i = \sum_{j} \hat{\beta}_j \cdot G_{ij}",
            "simbol": [
                (r"\hat{\beta}_j", "efek SNP j dari GWAS"),
                (r"G_{ij}", "genotipe individu i di SNP j (0/1/2 kopi alel)"),
            ],
            "interpretasi": "PRS menjumlahkan tetesan efek: satu SNP menjelaskan 0,01%, tapi 1 juta SNP menjelaskan 20\u201330% variasi. Individu top 5% PRS bisa berisiko 3\u20135x rata-rata \u2014 berguna untuk stratifikasi, bukan diagnosis.",
            "worked": (
                "\U0001f4d0 Contoh: PRS penyakit jantung koroner",
                "<p>PRS dari 1 juta SNP. Distribusi normal di populasi.<br />"
                "Top desil: risiko 3x rata-rata \u2192 skrining kolesterol lebih awal.<br />"
                "<strong>Batasan:</strong> (1) transferabilitas: PRS dari Eropa berkinerja buruk di Asia/Afrika (LD & frekuensi beda!); (2) bukan diagnosis \u2014 probabilitas, bukan vonis; (3) isu etik/keadilan (HD13).<br />"
                "<strong>eQTL:</strong> SNP GWAS diabetes ternyata eQTL untuk TCF7L2 di pankreas \u2192 mekanisme: mengatur ekspresi gen itu. Dari \u201cblop LD\u201d menjadi \u201ccerita biologis\u201d.</p>",
            ),
            "kepribadian": "PRS itu seperti nilai rapor dari 1 juta ulangan kecil: satu ulangan tidak berarti, tapi rata-ratanya memprediksi. eQTL itu seperti detektif yang melacak \u201cpuncak Manhattan itu sebenarnya mengatur gen tetangga lewat saklar ekspresi\u201d.",
            "kapan": "PRS: stratifikasi risiko, riset \u2014 belum untuk diagnosis klinis rutin (validasi + etik). eQTL: interpretasi fungsional temuan GWAS.",
        },
    ],
    "myths": [
        ("GWAS menemukan \u201cgen penyebab\u201d penyakit",
         "GWAS menemukan <em>lokus terkait</em> (blok LD). Gen kausal butuh fine-mapping + eQTL + fungsional. Puncak Manhattan = alamat kelurahan, bukan nomor rumah."),
        ("PRS tinggi = pasti sakit",
         "PRS = probabilitas, bukan vonis. Top 5% PRS jantung = risiko 3x \u2014 tapi 70%+ dari mereka tetap tidak sakit muda. PRS untuk stratifikasi populasi, bukan diagnosis individu. Komunikasi yang salah = fatalisme genetik."),
        ("Satu SNP signifikan = temuan besar",
         "OR 1,1 menjelaskan nyaris nol variasi. Revolusi GWAS justru menunjukkan: sifat kompleks = ribuan varian kecil (poligenik). \u201cGen untuk X\u201d tunggal adalah mitos media \u2014 kecuali penyakit Mendel."),
    ],
    "tips": [
        "Selalu lihat <strong>QQ plot</strong> sebelum Manhattan. Inflasi genomik (lambda >>1) = ada yang salah (stratifikasi/kualitas) \u2014 jangan percaya puncak apa pun.",
        "Untuk replikasi: <strong>populasi berbeda</strong> adalah ujian emas. Sinyal yang hanya ada di satu populasi = curigai stratifikasi/kualitas.",
        "Ingat <strong>aturan 5e-8</strong> untuk GWAS Eropa; untuk populasi/struktur beda, hitung ambang sendiri (permutasi). Angka magis tanpa konteks = cargo cult.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Uji Hardy-Weinberg (Chi-square)",
            "intro": "Diberikan count genotipe, hitung frekuensi alel, ekspektasi HW, dan chi-square. Tentukan: lolos QC atau buang?",
            "hint": "Ubah count heterozigot jadi ekstrem (80). Lihat chi-square meledak \u2014 SNP seperti ini dibuang dari GWAS sebelum analisis.",
            "code": (
                "obs = {'AA': 25, 'Aa': 50, 'aa': 25}  # ubah sesukamu\n"
                "n = sum(obs.values())\n"
                "p = (2*obs['AA'] + obs['Aa']) / (2*n)\n"
                "q = 1 - p\n"
                "exp = {'AA': p**2*n, 'Aa': 2*p*q*n, 'aa': q**2*n}\n"
                "chi2 = sum((obs[g]-exp[g])**2/exp[g] for g in obs)\n"
                "print(f'p={p:.3f}, q={q:.3f}')\n"
                "for g in obs:\n"
                "    print(f'{g}: observasi={obs[g]}, ekspektasi HW={exp[g]:.1f}')\n"
                "print(f'chi-square = {chi2:.2f} (df=1; kritis 3.84 untuk alpha 5%)')\n"
                "print('LOLOS QC' if chi2 < 3.84 else 'GAGAL QC -> buang SNP ini')\n"
                "print()\n"
                "print('GWAS memakai ambang jauh lebih ketat (p<1e-6) karena')\n"
                "print('jutaan SNP diuji. Satu SNP lolos di sini belum tentu lolos di sana.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Stratifikasi \u2014 Gen Sumpit Palsu",
            "intro": "Simulasikan 2 subpopulasi (beda alel X + beda \u201ckemampuan menyumpit\u201d). Uji asosiasi mentah vs terkoreksi populasi. Saksikan sinyal palsu lenyap.",
            "hint": "Inilah confounding genetik (HD4/HD10 versi genomik). PCA pada data nyata melakukan \u201ckoreksi suku\u201d ini secara otomatis.",
            "code": (
                "import random\n"
                "random.seed(31337)\n"
                "data = []  # (populasi, alel_X, bisa_sumpit)\n"
                "for _ in range(1000):\n"
                "    asia = random.random() < 0.5\n"
                "    alel = 1 if random.random() < (0.7 if asia else 0.2) else 0\n"
                "    sumpit = 1 if random.random() < (0.9 if asia else 0.1) else 0\n"
                "    data.append((asia, alel, sumpit))\n"
                "# asosiasi mentah: P(sumpit | alel)\n"
                "a1 = [d for d in data if d[1]==1]; a0 = [d for d in data if d[1]==0]\n"
                "print(f'mentah: P(sumpit|alel)={sum(d[2] for d in a1)/len(a1):.0%} vs '\n"
                "      f'P(sumpit|non)={sum(d[2] for d in a0)/len(a0):.0%}')\n"
                "print('-> terlihat \u201cgen sumpit\u201d!')\n"
                "# terkoreksi populasi (stratifikasi)\n"
                "print('per populasi:')\n"
                "for asia, nama in [(True,'Asia'),(False,'Eropa')]:\n"
                "    sub = [d for d in data if d[0]==asia]\n"
                "    b1 = [d for d in sub if d[1]==1]; b0 = [d for d in sub if d[1]==0]\n"
                "    p1 = sum(d[2] for d in b1)/len(b1) if b1 else 0\n"
                "    p0 = sum(d[2] for d in b0)/len(b0) if b0 else 0\n"
                "    print(f'  {nama}: {p1:.0%} vs {p0:.0%} -> TIDAK ADA efek')\n"
                "print()\n"
                "print('Sinyal mentah 100% stratifikasi. Inilah kenapa GWAS wajib koreksi PCA.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "QC SNP \u2192 Uji Hardy-Weinberg",
            "kondisi": "Sebelum GWAS.",
            "alasan": "Buang genotyping error.",
            "contoh": "p HW < 1e-6 \u2192 buang.",
        },
        {
            "title": "Pemetaan sifat kompleks \u2192 GWAS + 5e-8",
            "kondisi": "n besar, efek kecil.",
            "alasan": "Standar; replikasi wajib.",
            "contoh": "Diabetes, tinggi badan.",
        },
        {
            "title": "Ada struktur populasi \u2192 PCA/mixed model",
            "kondisi": "Selalu cek QQ plot.",
            "alasan": "Cegah temuan \u201cgen budaya\u201d.",
            "contoh": "GWAS multi-etnis Indonesia.",
        },
        {
            "title": "Dari lokus ke mekanisme \u2192 Fine-mapping + eQTL",
            "kondisi": "Punya puncak GWAS.",
            "alasan": "Blok LD \u2192 gen kausal.",
            "contoh": "SNP \u2192 eQTL TCF7L2 di pankreas.",
            "chart": {
                "var": "bi12PrsData",
                "data": [{"x": ["Rata-rata", "Top 10%", "Top 5%", "Top 1%"], "y": [1.0, 2.0, 3.0, 5.0], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1x", "2x", "3x", "5x"], "textposition": "outside"}],
                "title": "Risiko Relatif per Desil PRS (ilustratif, PJK)",
                "layout": {"xaxis": {"title": "Kelompok PRS"}, "yaxis": {"title": "Risiko relatif"}, "showlegend": False},
                "cara": "Batang = risiko relatif tiap kelompok PRS dibanding rata-rata populasi.",
                "interpretasi": "Top 1% PRS = risiko 5x \u2014 setara mutasi monogenik! Tapi ingat: ini probabilitas populasi, bukan vonis individu. Dan PRS Eropa tidak otomatis berlaku untuk Indonesia (transferabilitas!).",
            },
        },
        {
            "title": "Prediksi risiko \u2192 PRS (dengan caveat)",
            "kondisi": "Stratifikasi populasi, bukan diagnosis.",
            "alasan": "Agregat ribuan efek kecil.",
            "contoh": "Skrining dini kolesterol untuk top desil.",
        },
    ],
    "aturan10": [
        "HW untuk QC; LD untuk desain tag.",
        "Manhattan + QQ plot selalu berpasangan.",
        "5e-8 untuk GWAS; koreksi populasi wajib.",
        "PRS = probabilitas, bukan vonis.",
    ],
    "case": {
        "title": "PRS Jantung \u201cSiap Klinik\u201d?",
        "body": [
            "<p>Startup menjual tes PRS jantung: \u201cTop 5% risiko 3x lipat!\u201d Dokter bertanya padamu: boleh dipakai untuk keputusan statin?</p>",
            "<p>Fakta: PRS divalidasi di Eropa (AUC +0,03 di atas faktor klinis); belum divalidasi di Indonesia; tidak ada uji RCT bahwa PRS mengubah outcome; isu privasi/asuransi.</p>",
        ],
        "pertanyaan": "Rekomendasi berbasis bukti.",
        "pembahasan": "Belum untuk keputusan klinis rutin. (1) Tambahan AUC 0,03 kecil \u2014 faktor klinis (kolesterol, tekanan, rokok) jauh lebih menentukan dan bisa diubah. (2) Transferabilitas: PRS Eropa meragukan untuk Indonesia (LD/frek beda) \u2014 butuh validasi lokal. (3) Tanpa bukti bahwa mengetahui PRS mengubah outcome (RCT), ini skrining tanpa manfaat terbukti. (4) Risiko: fatalisme genetik + diskriminasi asuransi. Rekomendasi: pakai untuk RISET stratifikasi; untuk klinik, fokus pada faktor risiko yang bisa dimodifikasi. Uang pasien lebih baik untuk cek kolesterol rutin daripada tes PRS mahal. Pelajaran: prediksi \u2260 utilitas klinis (lihat HD12 decision curve!).",
    },
    "quiz": [
        ("Fungsi utama uji Hardy-Weinberg di GWAS?",
         ["Menemukan gen", "QC: deteksi genotyping error/stratifikasi via penyimpangan", "Menghitung risiko", "Tidak ada"],
         1,
         "Benar: HW = neraca. Miring = ada masalah dengan dadu atau pemainnya."),
        ("LD memungkinkan\u2026",
         ["Tanpa sekuensing", "Array 500rb SNP mewakili 10 juta varian via blok LD", "Tanpa statistik", "Kloning"],
         1,
         "Benar: tetangga diwariskan bersama. Satu tag SNP = info satu blok."),
        ("Ambang signifikansi GWAS standar?",
         ["0,05", "5\u00d710\u207b\u2078 (Bonferroni ~1 juta uji)", "0,01", "1e-3"],
         1,
         "Benar: koreksi jutaan uji. 0,05 mentah = 50.000 false positive ekspektasi."),
        ("QQ plot menunjukkan SEMUA titik di atas garis diagonal. Artinya?",
         ["Banyak penemuan", "Inflasi sistematis \u2014 curigai stratifikasi/kualitas, jangan percaya puncak", "Normal", "Power tinggi"],
         1,
         "Benar: ekor atas saja yang boleh naik. Inflasi global = ada yang salah."),
        ("PRS top 1% risiko 5x. Interpretasi tepat?",
         ["Pasti sakit", "Probabilitas populasi 5x \u2014 untuk stratifikasi, bukan vonis individu", "Tidak berguna", "Harus diobati"],
         1,
         "Benar: 5x dari risiko kecil tetap kecil. Komunikasi yang salah = fatalisme."),
        ("eQTL menjembatani GWAS ke biologi dengan\u2026",
         ["Menambah sampel", "Menghubungkan SNP ke perubahan EKSPRESI gen (mekanisme)", "Mengganti GWAS", "Tidak ada"],
         1,
         "Benar: dari \u201cblok LD terkait\u201d ke \u201cSNP ini mengatur gen X di jaringan Y\u201d."),
    ],
    "rangkuman": [
        "<strong>HW</strong> (p\u00b2+2pq+q\u00b2=1): QC genotyping; <strong>LD</strong>: dasar tag SNP.",
        "<strong>GWAS</strong>: jutaan uji; ambang <strong>5e-8</strong>; baca Manhattan + QQ.",
        "<strong>Stratifikasi</strong> = confounding genetik; koreksi <strong>PCA/mixed model</strong>.",
        "Puncak = <strong>blok LD</strong>, bukan gen pasti \u2014 fine-mapping + eQTL.",
        "<strong>PRS</strong> = \u03a3 efek\u00d7alel: stratifikasi populasi, bukan diagnosis.",
        "Waspadai <strong>transferabilitas</strong> PRS lintas populasi.",
        "Sifat kompleks = <strong>poligenik</strong>: ribuan efek kecil.",
        "Untuk Indonesia: keragaman etnis = stratifikasi ekstrem + butuh referensi lokal.",
    ],
    "prev": ("bi11-single-cell", "BI11"),
    "next": ("bi13-epigenomik", "BI13"),
}

LESSONS = [BI7, BI8, BI9, BI10, BI11, BI12]
for L in LESSONS:
    qa_scan(L)
