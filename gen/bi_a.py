#!/usr/bin/env python3
"""Bioinformatics lessons BI1-BI6."""
from render import qa_scan

TRACK = "Bioinformatics"
META = "45\u201360 menit \u2022 2 lab interaktif \u2022 6 quiz \u2022 1 mini-case"

# ================================================================ BI1
BI1 = {
    "slug": "bi1-biologi-molekuler",
    "code": "BI1",
    "track": TRACK,
    "cover_title": "DNA, RNA, Protein:<br />Central Dogma untuk Data Person",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 3 Miliar Huruf, 4 Huruf Saja"),
        ("dogma", "Central Dogma \u2014 Si Alur Pabrik"),
        ("varian", "Varian: SNP, Indel, Struktural"),
        ("genom", "Genom Manusia dalam Angka"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Transkripsi &amp; Translasi (Live)"),
        ("lab2", "\U0001f52c Lab 2: Hitung GC Content &amp; Komplemen"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan <strong>central dogma</strong> (DNA \u2192 RNA \u2192 protein) dan apa yang diukur tiap teknologi omics.",
        "Membedakan <strong>SNP, indel, varian struktural</strong> dan dampaknya terhadap protein.",
        "Melakukan <strong>transkripsi + translasi</strong> manual pada sekuens pendek (kodon \u2192 asam amino).",
        "Menyebutkan <strong>angka kunci genom manusia</strong> (3 miliar basa, ~20 ribu gen) dan implikasinya untuk analisis.",
    ],
    "story_title": "Cerita Pembuka: 3 Miliar Huruf, 4 Huruf Saja",
    "story": [
        "<p>Bayangkan buku 3 miliar huruf \u2014 tapi alfabetnya cuma 4: A, T, G, C. Itulah genommu. Dari 3 miliar huruf itu, hanya ~1,5% yang menjadi \u201ckalimat bermakna\u201d (gen penyandi protein). Sisanya dulu disebut \u201csampah\u201d \u2014 sampai kita sadar ia berisi saklar, pengatur volume, dan arsip evolusi.</p>",
        "<p>Bioinformatika adalah ilmu membaca buku raksasa ini dengan komputer. Lesson pertama memastikan kamu paham bahasanya dulu: apa itu gen, bagaimana ia dibaca sel, dan di mana \u201ctypo\u201d (varian) bisa mengubah cerita. Tanpa fondasi ini, semua pipeline NGS hanyalah tombol yang ditekan buta.</p>",
    ],
    "konsep": [
        {
            "id": "dogma",
            "title": "Central Dogma \u2014 Si Alur Pabrik",
            "definisi": "<strong>Central dogma</strong>: DNA (arsip) \u2192 ditranskripsi jadi RNA (fotokopi kerja) \u2192 ditranslasi jadi protein (mesin kerja). Tiap teknologi omics mengukur satu tahap: genomik = DNA, transkriptomik = RNA, proteomik = protein.",
            "kepribadian": "DNA itu arsip nasional yang tidak boleh keluar gedung; RNA itu fotokopi yang dibawa ke lapangan; protein itu pekerja yang membangun. Analis genomik membaca arsip; analis RNA-seq menghitung fotokopi yang beredar (lihat BI9) \u2014 jumlah fotokopi \u2248 seberapa giat gen itu bekerja.",
            "kapan": "Pilih teknologi sesuai pertanyaan: varian bawaan \u2192 DNA; gen aktif saat ini \u2192 RNA; fungsi aktual \u2192 protein. Jangan ukur RNA untuk pertanyaan varian bawaan.",
            "worked": (
                "\U0001f4d0 Contoh: translasi manual",
                "<p>DNA template (3'\u21925'): TAC AAA GGG ATT \u2192 mRNA (5'\u21923'): <strong>AUG UUU CCC UAA</strong>.<br />"
                "Kodon \u2192 asam amino: AUG = Met (start), UUU = Phe, CCC = Pro, UAA = <strong>stop</strong>.<br />"
                "Protein: <strong>Met-Phe-Pro</strong> (berhenti di UAA).<br />"
                "Inilah yang dilakukan ribosom jutaan kali per detik \u2014 dan yang disimulasikan di Lab 1.</p>",
            ),
            "chart": {
                "var": "bi1DogmaData",
                "data": [{"x": ["Genom (DNA)", "Transkriptom (RNA)", "Proteom (protein)"], "y": [1, 15, 100], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["1 set", "~15 rb gen aktif", ">100 rb proteoform"], "textposition": "outside"}],
                "title": "Kompleksitas Bertingkat: DNA \u2192 RNA \u2192 Protein",
                "layout": {"xaxis": {"title": "Lapisan"}, "yaxis": {"title": "Keberagaman (skala konseptual)", "type": "log"}, "showlegend": False},
                "cara": "Tiga lapisan central dogma. Sumbu Y logaritmik: tiap garis = 10x lipat. Baca kenaikannya.",
                "interpretasi": "Satu genom menghasilkan ribuan transkrip aktif, yang menghasilkan ratusan ribu varian protein (splicing + modifikasi). Kompleksitas meledak di tiap tahap \u2014 inilah kenapa proteomik jauh lebih sulit dari genomik, dan kenapa tiap omics butuh statistiknya sendiri.",
            },
            "code_display": ("text",
                "DNA (arsip)      : 5'-ATG TTT CCC TAA-3'\n"
                "   | transkripsi\n"
                "mRNA (fotokopi)  : 5'-AUG UUU CCC UAA-3'\n"
                "   | translasi (kodon -> asam amino)\n"
                "Protein (pekerja): Met-Phe-Pro  [STOP]"),
        },
        {
            "id": "varian",
            "title": "Varian: SNP, Indel, Struktural \u2014 Si Typo",
            "definisi": "<strong>SNP</strong>: 1 huruf berubah. <strong>Indel</strong>: sisipan/hapusan sedikit huruf. <strong>Varian struktural</strong>: hapusan/duplikasi/inversi besar (ribuan\u2013jutaan basa). Dampaknya tergantung <em>di mana</em>: synonymous (diam), missense (ganti asam amino), nonsense/frameshift (merusak).",
            "kepribadian": "Varian itu typo di buku 3 miliar huruf: satu huruf salah ketik di bab resep (synonymous) = tidak masalah; satu huruf di bab instruksi mesin (missense) = mesin aneh; halaman robek (frameshift) = bab hancur total.",
            "kapan": "Klasifikasi varian adalah langkah pertama setiap analisis: saring yang merusak (nonsense/frameshift di gen penting) dari yang diam.",
            "worked": (
                "\U0001f4d0 Contoh: tiga typo, tiga nasib",
                "<p>Sekuens normal: ATG TTT CCC TAA \u2192 Met-Phe-Pro-STOP.<br />"
                "<strong>Synonymous:</strong> TTT\u2192TTC (tetap Phe) \u2014 protein sama, biasanya aman.<br />"
                "<strong>Missense:</strong> TTT\u2192TGT (Phe\u2192Cys) \u2014 satu asam amino beda; bisa fatal (mis. sickle cell: Glu\u2192Val di hemoglobin).<br />"
                "<strong>Frameshift:</strong> sisipkan 1 basa setelah ATG \u2192 semua kodon bergeser \u2014 protein hancur total.</p>",
            ),
            "rumus": r"\text{Jarak genetik} \approx \frac{\text{jumlah posisi berbeda}}{\text{panjang sekuens}}",
            "simbol": [
                (r"\text{jumlah posisi berbeda}", "posisi dengan huruf berbeda antar dua sekuens"),
                (r"\text{panjang sekuens}", "total basa yang dibandingkan"),
            ],
            "interpretasi": "Dua manusia beda ~0,1% (1 per 1.000 basa) \u2192 ~3 juta perbedaan. Kecil persennya, besar jumlahnya \u2014 dan di situlah varian penyebab penyakit bersembunyi.",
        },
        {
            "id": "genom",
            "title": "Genom Manusia dalam Angka \u2014 Si Peta Skala",
            "definisi": "Angka kunci: <strong>3,2 miliar basa</strong>, <strong>~20.000 gen</strong> penyandi protein, <strong>~1,5%</strong> genom menyandi protein, <strong>~3 juta</strong> perbedaan antar dua individu.",
            "kepribadian": "Genom itu perpustakaan raksasa dengan 20 ribu buku resep di antara 3 miliar huruf arsip. Analis yang tidak paham skalanya akan meminta komputer \u201cbaca semuanya\u201d tanpa strategi \u2014 dan menunggu seminggu.",
            "kapan": "Desain analisis: WGS (semua) vs WES (hanya 1,5% coding, 50x lebih murah) vs panel gen \u2014 pilih sesuai pertanyaan dan budget (lihat BI8).",
            "worked": (
                "\U0001f4d0 Contoh: aritmetika ukuran file",
                "<p>1 basa = 1 byte (teks). Genom = 3,2 GB teks.<br />"
                "Tapi data sekuensing menyimpan <strong>kualitas per basa + bacaan ganda (coverage 30x)</strong> \u2192 ~100 GB per sampel WGS (FASTQ).<br />"
                "1.000 sampel = 100 TB. Inilah kenapa BI4 (command line, HPC, cloud) bukan opsional \u2014 laptop menyerah di sampel ke-2.</p>",
            ),
        },
    ],
    "myths": [
        ("\u201cGen untuk X\u201d berarti satu gen menentukan satu sifat",
         "Sifat kompleks (tinggi, diabetes, kecerdasan) dipengaruhi ratusan\u2013ribuan varian kecil (poligenik, lihat BI12) + lingkungan. \u201cGen untuk X\u201d adalah penyederhanaan media. Satu gen \u2192 satu penyakit hanya untuk penyakit Mendel langka."),
        ("DNA sampah (non-coding) tidak penting",
         "98,5% non-coding berisi saklar pengatur (enhancer, promoter), RNA non-coding fungsional, dan arsip evolusi. Varian GWAS terbanyak justru di daerah non-coding (lihat BI12) \u2014 mereka mengatur <em>kapan dan seberapa kuat</em> gen menyala."),
        ("Mutasi selalu buruk",
         "Kebanyakan netral; sebagian merugikan; sedikit menguntungkan (resistensi malaria pada sickle-cell carrier). Evolusi = seleksi atas varian. Dalam analisis, jangan asumsikan varian = penyakit \u2014 buktikan dengan frekuensi populasi (gnomAD, BI2) dan prediksi dampak."),
    ],
    "tips": [
        "Selalu tanya <strong>\u201clapisan omics apa?\u201d</strong> sebelum analisis: DNA (varian bawaan), RNA (aktivitas saat ini), protein (fungsi). Salah lapisan = salah interpretasi.",
        "Hafalkan <strong>3M\u201320K\u20131,5%</strong>: 3 miliar basa, 20 ribu gen, 1,5% coding. Tiga angka ini menjangkarkan semua estimasi ukuran dan biaya.",
        "Untuk varian: cek dulu <strong>frekuensi di populasi</strong> (gnomAD). Varian penyebab penyakit langka tidak mungkin umum di populasi sehat \u2014 filter termurah dan terkuat.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Transkripsi &amp; Translasi Otomatis",
            "intro": "Tulis sekuens DNA, kode melakukan transkripsi (T\u2192U) dan translasi (kodon \u2192 asam amino) dengan tabel kodon lengkap. Coba mutasi dan lihat efeknya.",
            "hint": "Ubah satu basa pada kodon kedua (missense) vs sisipkan satu basa (frameshift). Bandingkan kerusakan proteinnya \u2014 frameshift jauh lebih destruktif.",
            "code": (
                "kodon = {'AUG':'Met','UUU':'Phe','UUC':'Phe','CCC':'Pro','UAA':'STOP',\n"
                "         'UAG':'STOP','UGA':'STOP','GGG':'Gly','AAA':'Lys','CGU':'Arg'}\n"
                "dna = 'ATGTTTCCCTAA'  # ubah sesukamu (kelipatan 3!)\n"
                "mrna = dna.replace('T', 'U')\n"
                "protein = []\n"
                "for i in range(0, len(mrna), 3):\n"
                "    k = mrna[i:i+3]\n"
                "    aa = kodon.get(k, '?')\n"
                "    protein.append(aa)\n"
                "    if aa == 'STOP': break\n"
                "print(f'DNA     : {dna}')\n"
                "print(f'mRNA    : {mrna}')\n"
                "print(f'Protein : {\"-\".join(protein)}')\n"
                "print()\n"
                "print('Coba: dna = ATGTTTCCCTAA -> ganti T kedua jadi G (missense)')\n"
                "print('Coba: sisipkan A setelah ATG (frameshift) -> protein hancur')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: GC Content &amp; Komplemen",
            "intro": "Hitung GC content (stabilitas) dan komplemen reverse dari sekuens. GC tinggi = ikatan lebih kuat (3 ikatan hidrogen) = titik leleh lebih tinggi.",
            "hint": "Bandingkan sekuens AT-rich vs GC-rich. Dalam PCR, primer GC 40\u201360% ideal \u2014 terlalu tinggi menempel terlalu kuat, terlalu rendah lepas.",
            "code": (
                "seq = 'ATGCGCGCGCATATATATGCGC'  # ubah sesukamu\n"
                "seq = seq.upper()\n"
                "gc = (seq.count('G') + seq.count('C')) / len(seq) * 100\n"
                "komp = {'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G'}\n"
                "komplemen = ''.join(komp[b] for b in seq)\n"
                "rev_komp = komplemen[::-1]\n"
                "print(f'sekuens      : {seq}')\n"
                "print(f'panjang      : {len(seq)} basa')\n"
                "print(f'GC content   : {gc:.1f}%')\n"
                "print(f'komplemen    : {komplemen}')\n"
                "print(f'reverse komp : {rev_komp}  <- untai ganda DNA')\n"
                "print()\n"
                "print('Aturan: G-C = 3 ikatan H (kuat), A-T = 2 (lemah).')\n"
                "print('GC% tinggi -> DNA sulit dibuka -> PCR butuh suhu lebih tinggi.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Cari varian bawaan \u2192 Sekuensing DNA (WGS/WES/panel)",
            "kondisi": "Pertanyaan tentang perbedaan genetik antar individu.",
            "alasan": "DNA stabil, tidak berubah antar jaringan/waktu.",
            "contoh": "Skrining pembawa thalassemia; diagnosis penyakit langka.",
        },
        {
            "title": "Cari gen yang aktif \u2192 RNA-seq",
            "kondisi": "Pertanyaan tentang aktivitas gen saat ini / respons.",
            "alasan": "RNA mencerminkan ekspresi real-time per kondisi.",
            "contoh": "Gen apa yang menyala pada kanker vs normal (BI9).",
        },
        {
            "title": "Cari fungsi aktual \u2192 Proteomik",
            "kondisi": "RNA tidak selalu = protein (regulasi pasca-transkripsi).",
            "alasan": "Protein adalah pelaku akhir; modifikasinya penting.",
            "contoh": "Fosforilasi protein sinyal kanker (BI15).",
        },
        {
            "title": "Budget terbatas, fokus coding \u2192 WES/panel, bukan WGS",
            "kondisi": "85% varian penyakit Mendel ada di 1,5% coding.",
            "alasan": "50x lebih murah dengan hasil klinis sebanding untuk kasus Mendel.",
            "contoh": "Diagnosis penyakit langka anak (lihat BI8).",
        },
    ],
    "aturan10": [
        "Tanya lapisan omics dulu: DNA/RNA/protein.",
        "3M basa, 20K gen, 1,5% coding \u2014 jangkar skala.",
        "Varian umum di populasi sehat \u2260 penyebab penyakit langka.",
        "Non-coding \u2260 tidak penting.",
    ],
    "case": {
        "title": "Bayi dengan Penyakit Misterius",
        "body": [
            "<p>Bayi 8 bulan: kejang, keterlambatan perkembangan. Panel metabolik normal. Dokter meminta whole exome sequencing (WES). Ditemukan 20.000 varian.</p>",
            "<p>Tim memfilter: (1) frekuensi <1% di gnomAD \u2192 tersisa 400; (2) prediksi merusak (nonsense/missense konservatif) \u2192 12; (3) cocok pola gejala + resesif (butuh 2 kopi) \u2192 1 kandidat: mutasi nonsense di gen SCN1A-like.</p>",
        ],
        "pertanyaan": "Jelaskan logika tiap filter dan mengapa WES (bukan WGS) dipilih.",
        "pembahasan": "(1) Frekuensi: penyakit langka \u2192 varian penyebab harus langka di populasi sehat (prinsip BI1). (2) Dampak: nonsense/frameshift diutamakan karena merusak protein (vs synonymous yang diam). (3) Kesesuaian klinis + pola pewarisan: menyatukan genetik dengan fenotipe. WES dipilih karena: 85% mutasi penyakit Mendel ada di coding region, biaya 1/50 WGS, dan waktu analisis jauh lebih cepat \u2014 kritis untuk bayi yang memburuk. Pelajaran: diagnosis genomik = penyaringan bertingkat logis, bukan \u201ctemukan mutasi ajaib\u201d. Tiap filter punya alasan biologis.",
    },
    "quiz": [
        ("Urutan central dogma yang benar?",
         ["Protein \u2192 RNA \u2192 DNA", "DNA \u2192 RNA \u2192 protein", "RNA \u2192 DNA \u2192 protein", "DNA \u2192 protein \u2192 RNA"],
         1,
         "Benar: arsip (DNA) \u2192 fotokopi (RNA) \u2192 pekerja (protein). Tiap omics mengukur satu tahap."),
        ("RNA-seq mengukur\u2026",
         ["Varian bawaan", "Tingkat aktivitas gen (jumlah transkrip) saat ini", "Struktur protein", "Jumlah kromosom"],
         1,
         "Benar: menghitung fotokopi yang beredar \u2248 seberapa giat gen bekerja. Untuk varian bawaan pakai DNA."),
        ("Mutasi nonsense (kodon stop prematur) umumnya\u2026",
         ["Tidak berpengaruh", "Merusak protein (terpotong) \u2014 kandidat kuat penyebab penyakit", "Menguntungkan selalu", "Hanya di non-coding"],
         1,
         "Benar: stop prematur = protein buntung = biasanya loss-of-function. Prioritas dalam filter varian."),
        ("Dua manusia berbeda sekitar\u2026",
         ["50% genomnya", "0,1% (~3 juta basa)", "10%", "Tidak ada beda"],
         1,
         "Benar: 1 per 1.000 basa. Kecil persennya, tapi 3 juta perbedaan = tempat bersembunyi varian penyakit."),
        ("Untuk diagnosis penyakit langka anak dengan budget terbatas, pilihan terbaik?",
         ["WGS selalu", "WES/panel gen \u2014 85% mutasi Mendel di coding, 50x lebih murah", "RNA-seq saja", "Tidak perlu sekuensing"],
         1,
         "Benar: ekonomi + kecepatan. WGS bila WES negatif atau diduga varian struktural/non-coding."),
        ("Varian dengan frekuensi 30% di gnomAD (populasi sehat) diklaim penyebab penyakit langka. Tanggapan?",
         ["Masuk akal", "Mustahil \u2014 penyakit langka tidak mungkin disebabkan varian umum di populasi sehat", "Perlu WGS", "Tergantung"],
         1,
         "Benar: filter frekuensi adalah logika pertama diagnosis genomik. Umum \u2260 patogenik untuk penyakit langka."),
    ],
    "rangkuman": [
        "<strong>Central dogma</strong>: DNA \u2192 RNA \u2192 protein; tiap omics mengukur satu tahap.",
        "<strong>Varian</strong>: SNP, indel, struktural; dampak: synonymous < missense < nonsense/frameshift.",
        "<strong>3M basa, 20K gen, 1,5% coding</strong>; antar manusia beda 0,1%.",
        "Non-coding penuh saklar pengatur \u2014 bukan sampah.",
        "Filter diagnosis: <strong>frekuensi populasi \u2192 dampak \u2192 kesesuaian klinis</strong>.",
        "Pilih teknologi sesuai pertanyaan + budget (WGS/WES/panel/RNA-seq).",
        "Sifat poligenik: satu gen \u2192 satu sifat hanya untuk penyakit Mendel.",
        "Fondasi untuk seluruh track: BI2 (database) memakai istilah ini terus.",
    ],
    "prev": ("hd20-capstone-readmission", "HD20"),
    "next": ("bi2-database", "BI2"),
}

# ================================================================ BI2
BI2 = {
    "slug": "bi2-database",
    "code": "BI2",
    "track": TRACK,
    "cover_title": "NCBI, Ensembl, UniProt:<br />Perpustakaan Data Biologi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Gen yang Punya 5 Nama"),
        ("primer", "Database Primer: Arsip Mentah Dunia"),
        ("kurasi", "Database Kurasi: Pengetahuan yang Dimasak"),
        ("variasi", "Database Variasi &amp; Populasi"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi Query Entrez"),
        ("lab2", "\U0001f52c Lab 2: Anotasi Varian dengan Frekuensi Populasi"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menyebutkan peran tiap database utama: <strong>NCBI/ENA/DDBJ, Ensembl, UCSC, UniProt, PDB, GEO/SRA, TCGA, gnomAD, ClinVar</strong>.",
        "Membedakan <strong>database primer vs kurasi</strong> dan implikasinya untuk kepercayaan data.",
        "Menggunakan <strong>aksesi ID</strong> (bukan nama gen!) sebagai identifier stabil.",
        "Memilih database yang tepat untuk 5 pertanyaan riset tipikal.",
    ],
    "story_title": "Cerita Pembuka: Gen yang Punya 5 Nama",
    "story": [
        "<p>Gen p53 \u2014 penjaga genom terkenal \u2014 punya nama resmi TP53, nama lama p53, ID Ensembl ENSG00000141510, ID UniProt P04637, dan ID NCBI Gene 7157. Analis junior menggabungkan dua dataset: satu pakai \u201cp53\u201d, satu pakai \u201cTP53\u201d \u2014 hasilnya: gen terhitung dua kali, analisis berantakan.</p>",
        "<p>Database biologi lahir untuk kekacauan penamaan ini. Tapi ada belasan database besar, masing-masing dengan filosofi beda. Lesson ini adalah peta perpustakaannya: arsip mentah di lantai 1, pengetahuan kurasi di lantai 2, dan katalog variasi di lantai 3.</p>",
    ],
    "konsep": [
        {
            "id": "primer",
            "title": "Database Primer: Arsip Mentah Dunia \u2014 Lantai 1",
            "definisi": "<strong>INSDC</strong> (NCBI GenBank / ENA / DDBJ): arsip sekuens mentah yang disubmit peneliti \u2014 sinkron tiap hari. <strong>SRA</strong>: arsip bacaan mentah NGS. <strong>GEO</strong>: arsip data ekspresi fungsional.",
            "kepribadian": "Database primer itu seperti arsip nasional: menyimpan SEMUA dokumen yang masuk, tanpa menilai benar-salah. Kaya, mentah, dan kadang berantakan \u2014 tugas menilainya ada padamu.",
            "kapan": "Download data mentah untuk analisis ulang; submit datamu sendiri (kewajiban publikasi!).",
            "worked": (
                "\U0001f4d0 Contoh: menemukan data RNA-seq publik",
                "<p>Pertanyaan: ekspresi gen X pada kanker paru.<br />"
                "1. Cari di <strong>GEO</strong>: \u201clung cancer RNA-seq\u201d \u2192 seri GSE12345.<br />"
                "2. Cek metadata: platform, n sampel, desain.<br />"
                "3. Download count matrix (sudah diproses) atau SRA mentah (proses sendiri, BI8).<br />"
                "Prinsip: data publik = replikasi gratis. Selalu cek kualitas sebelum percaya (lihat BI10 batch effect!).</p>",
            ),
            "code_display": ("text",
                "Butuh sekuens gen?      -> NCBI Nucleotide / Ensembl\n"
                "Butuh bacaan mentah?     -> SRA (Sequence Read Archive)\n"
                "Butuh data ekspresi?     -> GEO (Gene Expression Omnibus)\n"
                "ID stabil selalu: aksesi (NM_000059), BUKAN nama!"),
        },
        {
            "id": "kurasi",
            "title": "Database Kurasi: Pengetahuan yang Dimasak \u2014 Lantai 2",
            "definisi": "<strong>Ensembl</strong>: anotasi genom otomatis + manual (gen, transkrip, varian). <strong>UniProt</strong>: protein terkurasi (Swiss-Prot = manual, TrEMBL = otomatis). <strong>PDB</strong>: struktur protein 3D eksperimental. <strong>Gene Ontology (GO) / KEGG</strong>: fungsi gen dan pathway.",
            "rumus": r"\text{Kepercayaan} \propto \frac{\text{kurasi manual}}{\text{volume}}",
            "simbol": [
                (r"\text{kurasi manual}", "diteliti manusia ahli (Swiss-Prot, RefSeq)"),
                (r"\text{volume}", "jumlah entri total"),
            ],
            "interpretasi": "Trade-off abadi: UniProt Swiss-Prot (kurasi manual, ~570rb entri) sangat dipercaya tapi kecil; TrEMBL (otomatis, 250jt+) lengkap tapi berisik. Pilih sesuai kebutuhan: hipotesis klinis \u2192 kurasi; screening luas \u2192 volume.",
            "worked": (
                "\U0001f4d0 Contoh: anotasi gen baru ditemukan",
                "<p>Gen kandidat dari GWAS (BI12):<br />"
                "1. <strong>Ensembl</strong>: posisi, transkrip, varian di sekitarnya.<br />"
                "2. <strong>UniProt</strong>: fungsi protein, domain, pathway.<br />"
                "3. <strong>GO/KEGG</strong>: pathway apa yang diperkaya (lihat BI9 GSEA).<br />"
                "4. <strong>PDB/AlphaFold</strong>: struktur 3D untuk tebakan fungsi (BI15).<br />"
                "Empat langkah ini = \u201canotasi fungsional\u201d standar tiap temuan.</p>",
            ),
            "kepribadian": "Database kurasi itu seperti ensiklopedia yang ditulis pustakawan ahli: tidak selengkap arsip, tapi tiap kalimat bisa dipertanggungjawabkan. Untuk klaim yang masuk paper/klinik, rujukannya ke sini.",
            "kapan": "Anotasi fungsional, interpretasi varian, enrichment pathway \u2014 semua yang butuh \u201capa arti biologisnya\u201d.",
            "chart": {
                "var": "bi2TrustData",
                "data": [{"x": ["GenBank (primer)", "TrEMBL (otomatis)", "Ensembl", "Swiss-Prot (manual)", "PDB"], "y": [2, 4, 7, 9, 9], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["2", "4", "7", "9", "9"], "textposition": "outside"}],
                "title": "Tingkat Kurasi vs Kepercayaan (skor ilustratif 1\u201310)",
                "layout": {"xaxis": {"title": "Database"}, "yaxis": {"title": "Kepercayaan per entri", "range": [0, 11]}, "showlegend": False},
                "cara": "Batang = seberapa bisa dipercaya satu entri tipikal. Kiri = arsip mentah, kanan = kurasi manual/eksperimental.",
                "interpretasi": "Trade-off jelas: makin ke kanan makin dipercaya tapi makin kecil cakupannya. Aturan praktis: eksplorasi boleh dari kiri, kesimpulan harus didukung dari kanan.",
            },
        },
        {
            "id": "variasi",
            "title": "Database Variasi &amp; Populasi \u2014 Lantai 3",
            "definisi": "<strong>gnomAD</strong>: frekuensi varian di 800rb+ orang (filter patogenik!). <strong>ClinVar</strong>: interpretasi klinis varian (patogenik vs jinak) dari lab dunia. <strong>TCGA</strong>: atlas genomik kanker multi-omics. <strong>dbSNP</strong>: katalog varian (arsip, bukan vonis).",
            "kepribadian": "gnomAD itu sensus penduduk: ia memberi tahu \u201cvarian ini umum atau langka di manusia normal\u201d. ClinVar itu pengadilan: mengumpulkan vonis \u201cpatogenik/jinak\u201d dari banyak lab \u2014 kadang vonisnya bertentangan, dan itu info penting.",
            "kapan": "Interpretasi varian klinis: frekuensi (gnomAD) + vonis (ClinVar) adalah dua pilar. Riset kanker: TCGA.",
            "worked": (
                "\U0001f4d0 Contoh: menilai varian BRCA1",
                "<p>Varian c.123A>T di BRCA1:<br />"
                "<strong>gnomAD:</strong> frekuensi 0,0001 (sangat langka) \u2713 lolos filter.<br />"
                "<strong>ClinVar:</strong> 5 lab: 3 \u201cpatogenik\u201d, 2 \u201cVUS\u201d (uncertain) \u2192 konflik! Perlu kurasi manual + data fungsional.<br />"
                "<strong>dbSNP:</strong> ada rsID \u2014 tapi rsID BUKAN vonis, hanya nomor arsip.<br />"
                "Pelajaran: tidak ada satu database yang memvonis sendirian.</p>",
            ),
            "warning": "<strong>Jebakan dbSNP:</strong> punya rsID tidak berarti varian itu penting/patogenik \u2014 dbSNP adalah katalog, bukan pengadilan. Vonis klinis = ClinVar + frekuensi + bukti fungsional + pedoman ACMG.",
        },
    ],
    "myths": [
        ("Nama gen cukup sebagai identifier",
         "Nama berubah (p53 \u2192 TP53), ambigu antar spesies, dan satu nama bisa merujuk beberapa lokus. Selalu pakai <strong>aksesi stabil</strong>: Ensembl ID (ENSG...), UniProt (P04637), RefSeq (NM_...). Nama untuk manusia, ID untuk mesin."),
        ("Data di database pasti benar",
         "Database primer = arsip tanpa kurasi (salah anotasi, kontaminasi ada). Bahkan kurasi bisa usang. Selalu cek: versi database, tanggal, bukti pendukung (experimental vs predicted). Sitasi database tanpa versi = tidak reproducible."),
        ("ClinVar bilang patogenik = pasti patogenik",
         "ClinVar agregat submisi dengan kualitas bervariasi; entri konflik (VUS vs patogenik) umum. Cek: jumlah submitter, bintang review, tanggal. Untuk keputusan klinis, ikuti pedoman ACMG dengan kurasi ahli \u2014 bukan satu baris database."),
    ],
    "tips": [
        "Bangun kebiasaan <strong>ID-first</strong>: setiap kali menyebut gen/protein/varian, sertakan ID stabilnya. Ini mencegah 90% kekacauan merge dataset.",
        "Catat <strong>versi database + tanggal akses</strong> di setiap analisis (Ensembl 110, gnomAD v4). Database berubah; hasil tanpa versi tidak bisa direplikasi.",
        "Untuk eksplorasi cepat pakai web; untuk analisis serius pakai <strong>API/download</strong> (NCBI E-utilities, Ensembl REST, UniProt API). Klik manual tidak scalable dan tidak reproducible.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Simulasi Query ID Gen",
            "intro": "Simulasikan mapping nama \u2192 ID stabil dengan kamus. Lihat bagaimana nama ambigu (\u201cp53\u201d) gagal tanpa ID, dan bagaimana versi database memengaruhi hasil.",
            "hint": "Tambahkan nama alias lain (\u2018TP53\u2019, \u2018p53\u2019, \u2018TRP53\u2019 tikus). Tanpa ID, merge dataset = tebak-tebakan.",
            "code": (
                "# simulasi mapping NCBI Gene (nama -> ID stabil)\n"
                "genedb = {\n"
                "    'TP53': {'id': 7157, 'ensembl': 'ENSG00000141510', 'uniprot': 'P04637'},\n"
                "    'BRCA1': {'id': 672, 'ensembl': 'ENSG00000012048', 'uniprot': 'P38398'},\n"
                "}\n"
                "alias = {'p53': 'TP53', 'trp53': 'TP53 (tikus!)', 'brca1': 'BRCA1'}\n"
                "query = ['p53', 'TP53', 'trp53', 'BRCA1', 'genX']\n"
                "for q in query:\n"
                "    resmi = alias.get(q, q)\n"
                "    info = genedb.get(resmi)\n"
                "    if info:\n"
                "        print(f'{q:<8} -> {resmi:<12} ID:{info[\"id\"]} {info[\"ensembl\"]}')\n"
                "    else:\n"
                "        print(f'{q:<8} -> TIDAK DITEMUKAN / AMBIGU (bahaya!)')\n"
                "print()\n"
                "print('trp53 = gen TIKUS, bukan manusia! Tanpa ID spesies, analisis')\n"
                "print('lintas-spesies tercampur. Selalu sertakan taksonomi.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Filter Varian ala gnomAD + ClinVar",
            "intro": "Diberikan 10 varian (frekuensi gnomAD + vonis ClinVar), terapkan pipeline filter diagnosis: frekuensi <1%, vonis tidak \u201cjinak\u201d, prioritaskan patogenik.",
            "hint": "Ubah threshold frekuensi 0.01 \u2192 0.001. Berapa kandidat tersisa? Inilah kenapa penyakit ultra-langka butuh threshold ketat.",
            "code": (
                "varian = [\n"
                "    ('rs1', 0.30, 'jinak'), ('rs2', 0.0001, 'patogenik'),\n"
                "    ('rs3', 0.005, 'VUS'), ('rs4', 0.00001, 'patogenik'),\n"
                "    ('rs5', 0.02, 'konflik'), ('rs6', 0.0005, 'kemungkinan patogenik'),\n"
                "    ('rs7', 0.15, 'jinak'), ('rs8', 0.0002, 'VUS'),\n"
                "    ('rs9', 0.001, 'jinak'), ('rs10', 0.00005, 'patogenik'),\n"
                "]\n"
                "THR = 0.01\n"
                "print(f\"{'varian':<8} {'freq':>8} {'clinvar':<20} status\")\n"
                "kandidat = []\n"
                "for rs, f, cv in varian:\n"
                "    if f >= THR:\n"
                "        status = 'BUANG (terlalu umum)'\n"
                "    elif cv == 'jinak':\n"
                "        status = 'BUANG (jinak)'\n"
                "    else:\n"
                "        status = 'KANDIDAT'; kandidat.append(rs)\n"
                "    print(f'{rs:<8} {f:>8.5f} {cv:<20} {status}')\n"
                "print(f'\\nKandidat: {kandidat}')\n"
                "print('VUS & konflik -> butuh kurasi manual + bukti fungsional.')\n"
                "print('Ini pipeline standar diagnosis genomik (lihat BI1 case).')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh sekuens/data mentah \u2192 NCBI/SRA/GEO",
            "kondisi": "Analisis ulang atau download skala besar.",
            "alasan": "Arsip primer terlengkap; metadata menyertai.",
            "contoh": "Download RNA-seq kanker paru publik (GSE...).",
        },
        {
            "title": "Butuh anotasi fungsi \u2192 Ensembl/UniProt/GO/KEGG",
            "kondisi": "Pertanyaan \u201capa arti biologisnya\u201d.",
            "alasan": "Kurasi; terhubung ke pathway dan struktur.",
            "contoh": "Anotasi gen kandidat GWAS.",
        },
        {
            "title": "Interpretasi varian klinis \u2192 gnomAD + ClinVar",
            "kondisi": "Vonis patogenik/jinak.",
            "alasan": "Dua pilar: frekuensi populasi + interpretasi lab.",
            "contoh": "Filter WES bayi sakit (BI1).",
        },
        {
            "title": "Riset kanker multi-omics \u2192 TCGA (+ cBioPortal)",
            "kondisi": "Butuh genomik + ekspresi + klinis kanker terintegrasi.",
            "alasan": "Atlas terkurasi dengan data klinis.",
            "contoh": "Subtipe molekuler kanker payudara.",
        },
        {
            "title": "Struktur protein \u2192 PDB / AlphaFold DB",
            "kondisi": "Butuh bentuk 3D.",
            "alasan": "PDB = eksperimental; AlphaFold = prediksi (lihat BI15).",
            "contoh": "Tebak efek mutasi pada kantong obat.",
        },
    ],
    "aturan10": [
        "ID stabil, bukan nama gen.",
        "Catat versi database + tanggal.",
        "Primer untuk eksplorasi, kurasi untuk kesimpulan.",
        "rsID \u2260 vonis patogenik.",
    ],
    "case": {
        "title": "Varian \u201cPatogenik\u201d yang Ternyata Umum di Papua",
        "body": [
            "<p>Lab melaporkan varian \u201cpatogenik\u201d (ClinVar, 2 submitter) pada pasien Indonesia timur. Dokter panik. Kamu cek gnomAD: frekuensi global 0,0001 \u2014 tapi <strong>tidak ada data Papua</strong> di gnomAD (populasi underrepresented).</p>",
            "<p>Kamu sekuensing 200 kontrol sehat lokal: frekuensi varian <strong>8%</strong> \u2014 umum dan tidak terkait penyakit di populasi ini.</p>",
        ],
        "pertanyaan": "Apa yang terjadi dan apa pelajarannya untuk Indonesia?",
        "pembahasan": "Vonis \u201cpatogenik\u201d berdasarkan populasi Eropa tidak berlaku universal \u2014 varian ini polimorfisme lokal yang jinak. Pelajaran ganda: (1) database global bias Eropa; Indonesia butuh referensi genomik sendiri (proyek genom nasional); (2) frekuensi populasi LOKAL adalah filter yang lebih relevan dari vonis impor; (3) untuk pasien Indonesia timur, \u201ctidak ada di gnomAD\u201d \u2260 \u201clangka\u201d \u2014 bisa jadi \u201ctidak disampling\u201d. Analis bioinformatika Indonesia harus paranoid terhadap bias representasi database \u2014 ini isu keadilan juga (lihat HD13).",
    },
    "quiz": [
        ("Untuk ID gen yang stabil lintas analisis, pakai\u2026",
         ["Nama umum (p53)", "Aksesi ID (ENSG00000141510 / 7157)", "Nama panggilan lab", "Nomor urut"],
         1,
         "Benar: nama berubah dan ambigu; ID stabil. Nama untuk manusia, ID untuk mesin."),
        ("Perbedaan database primer vs kurasi?",
         ["Tidak ada", "Primer = arsip mentah tanpa penilaian; kurasi = diteliti/dianotasi ahli", "Kurasi lebih besar", "Primer lebih dipercaya"],
         1,
         "Benar: GenBank/SRA = arsip; Swiss-Prot/RefSeq = kurasi. Eksplorasi dari kiri, kesimpulan dari kanan."),
        ("Varian punya rsID di dbSNP. Artinya\u2026",
         ["Pasti patogenik", "Terdaftar di katalog \u2014 BUKAN vonis klinis", "Jinak", "Tidak ada arti"],
         1,
         "Benar: dbSNP = nomor arsip. Vonis = ClinVar + frekuensi + bukti fungsional + ACMG."),
        ("Filter PERTAMA paling kuat untuk varian penyakit langka?",
         ["Warna mata pasien", "Frekuensi di gnomAD (harus langka di populasi sehat)", "Panjang gen", "Jumlah ekson"],
         1,
         "Benar: penyakit langka \u2260 varian umum. Filter frekuensi memangkas 99% kandidat seketika."),
        ("ClinVar: 3 lab patogenik, 2 lab VUS untuk satu varian. Sikap?",
         ["Ikut mayoritas", "Konflik = butuh kurasi manual + bukti tambahan, jangan vonis buta", "Abaikan", "Pilih yang terbaru"],
         1,
         "Benar: agregat \u2260 kebenaran. Cek bintang review, tanggal, dan bukti pendukung."),
        ("gnomAD minim data Indonesia timur. Implikasinya?",
         ["Tidak masalah", "\u201cTidak ada di gnomAD\u201d bisa berarti tak disampling \u2014 butuh referensi lokal; waspadai vonis impor", "Jangan pakai gnomAD", "Semua varian patogenik"],
         1,
         "Benar: bias representasi database = isu validitas DAN keadilan. Indonesia butuh data genomik sendiri."),
    ],
    "rangkuman": [
        "Primer (<strong>INSDC, SRA, GEO</strong>): arsip mentah; kurasi (<strong>Ensembl, UniProt, PDB</strong>): pengetahuan tepercaya.",
        "Selalu pakai <strong>ID stabil</strong> (aksesi), catat <strong>versi + tanggal</strong>.",
        "Interpretasi varian = <strong>gnomAD</strong> (frekuensi) + <strong>ClinVar</strong> (vonis) + bukti.",
        "rsID \u2260 patogenik. Konflik ClinVar = kurasi manual.",
        "Waspadai <strong>bias populasi</strong> database global untuk pasien Indonesia.",
        "API/download untuk analisis serius; web untuk eksplorasi.",
        "Anotasi fungsional standar: posisi \u2192 protein \u2192 pathway \u2192 struktur.",
        "Fondasi untuk BI3 (format), BI6 (alignment), BI9 (RNA-seq).",
    ],
    "prev": ("bi1-biologi-molekuler", "BI1"),
    "next": ("bi3-format-data", "BI3"),
}

# ================================================================ BI3
BI3 = {
    "slug": "bi3-format-data",
    "code": "BI3",
    "track": TRACK,
    "cover_title": "FASTA, FASTQ, VCF:<br />Format File Genomik",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: File 100 GB yang Salah Dibaca"),
        ("fasta", "FASTA &amp; FASTQ \u2014 Si Teks Polos"),
        ("sam", "SAM/BAM: Hasil Mapping"),
        ("vcf", "VCF: Katalog Varian"),
        ("gff", "GFF/GTF, BED &amp; Count Matrix"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Parse FASTA &amp; FASTQ"),
        ("lab2", "\U0001f52c Lab 2: Parse VCF &amp; Filter Varian"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membaca dan menjelaskan struktur <strong>FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF, BED</strong>.",
        "Menjelaskan <strong>skor kualitas Phred</strong> dan menghitung probabilitas error.",
        "Memfilter <strong>VCF</strong> berdasarkan QUAL, DP, dan frekuensi alel.",
        "Memilih format yang tepat untuk tiap tahap pipeline NGS.",
    ],
    "story_title": "Cerita Pembuka: File 100 GB yang Salah Dibaca",
    "story": [
        "<p>Analis menerima file sekuensing 100 GB. Ia membukanya di Excel. Excel memotong baris, mengubah \u201cMARC1\u201d menjadi tanggal, dan merusak skor kualitas. Tiga hari komputasi cluster menghasilkan varian sampah \u2014 karena satu langkah: <strong>format dibaca dengan alat yang salah</strong>.</p>",
        "<p>Format file genomik terlihat seperti teks biasa, tapi tiap format punya kontrak ketat: baris apa artinya apa, koordinat mulai dari 0 atau 1, strand mana. Lesson ini mengajarkan kontrak-kontrak itu \u2014 karena di bioinformatika, salah baca format = salah sains.</p>",
    ],
    "konsep": [
        {
            "id": "fasta",
            "title": "FASTA &amp; FASTQ \u2014 Si Teks Polos",
            "definisi": "<strong>FASTA</strong>: sekuens + header (>) \u2014 untuk referensi/gen. <strong>FASTQ</strong>: sekuens + kualitas per basa (4 baris per read) \u2014 output mentah sekuenser.",
            "rumus": r"Q = -10 \log_{10}(P_{error})",
            "simbol": [
                (r"Q", "skor Phred (karakter ASCII di baris kualitas FASTQ)"),
                (r"P_{error}", "probabilitas basa salah dibaca"),
            ],
            "interpretasi": "Q30 = 1 error per 1.000 basa; Q20 = 1 per 100. Baris kualitas FASTQ memakai ASCII: karakter 'I' = Q40. Inilah kenapa FASTQ 4x lebih besar dari FASTA.",
            "worked": (
                "\U0001f4d0 Contoh: membaca FASTQ",
                "<p>@READ1 &larr; nama read<br />"
                "ACGTACGT &larr; sekuens<br />"
                "+ &larr; pemisah<br />"
                "IIIIIIII &larr; kualitas: 'I' = ASCII 73 &minus; 33 = <strong>Q40</strong> (P_error = 0,0001)<br />"
                "Jika kualitasnya '####' (Q2): buang read ini \u2014 sampah masuk, sampah keluar (lihat BI8 QC).</p>",
            ),
            "kepribadian": "FASTA itu buku teks polos; FASTQ itu buku teks dengan catatan kaki kepercayaan per huruf. Tanpa catatan kaki, kamu tidak tahu huruf mana yang hasil terkaan mesin.",
            "kapan": "FASTA: genom referensi, database gen. FASTQ: awal semua pipeline NGS (input QC).",
            "code_display": ("text",
                ">gen_contoh (FASTA)\n"
                "ATGCGTTAGCCGTAA\n"
                "\n"
                "@READ1 (FASTQ)\n"
                "ATGCGTTA\n"
                "+\n"
                "IIIIIIII  <- Q40 per basa"),
        },
        {
            "id": "sam",
            "title": "SAM/BAM: Hasil Mapping \u2014 Si Peta Penempatan",
            "definisi": "<strong>SAM</strong> (teks) / <strong>BAM</strong> (biner, terkompresi): tiap read + di mana ia menempel di genom referensi (kromosom, posisi, CIGAR, MAPQ).",
            "kepribadian": "Kalau FASTQ adalah potongan puzzle, SAM/BAM adalah foto puzzle yang sudah tersusun: tiap potongan tercatat posisi pastinya. MAPQ = keyakinan \u201cpotongan ini memang di sini, bukan di tempat mirip lainnya\u201d.",
            "kapan": "Setelah mapping (BI8): variant calling, visualisasi di IGV, QC alignment.",
            "worked": (
                "\U0001f4d0 Contoh: membaca baris SAM",
                "<p>READ1 &nbsp; 0 &nbsp; chr1 &nbsp; 1000 &nbsp; 60 &nbsp; 8M &nbsp; ... &nbsp; ACGTACGT<br />"
                "Artinya: read menempel di <strong>chr1 posisi 1000</strong>, MAPQ <strong>60</strong> (sangat yakin), CIGAR <strong>8M</strong> (8 basa match).<br />"
                "CIGAR 4M1I3M = 4 match, 1 insersi, 3 match \u2014 bahasa kompak operasi alignment.</p>",
            ),
            "chart": {
                "var": "bi3QualData",
                "data": [{"x": ["Q10", "Q20", "Q30", "Q40"], "y": [10, 1, 0.1, 0.01], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["10%", "1%", "0,1%", "0,01%"], "textposition": "outside"}],
                "title": "Skor Phred vs Probabilitas Error",
                "layout": {"xaxis": {"title": "Skor kualitas"}, "yaxis": {"title": "P(error) %", "type": "log"}, "showlegend": False},
                "cara": "Sumbu Y logaritmik. Tiap naik 10 skor = error turun 10x lipat.",
                "interpretasi": "Q30 adalah standar industri (99,9% akurat per basa). Tapi ingat: 3 miliar basa \u00d7 0,1% = 3 juta error per genom \u2014 inilah kenapa butuh coverage ganda (BI8) dan kenapa kualitas per basa penting.",
            },
        },
        {
            "id": "vcf",
            "title": "VCF: Katalog Varian \u2014 Si Daftar Typo",
            "definisi": "<strong>VCF</strong>: daftar varian \u2014 posisi, alel referensi/alternatif, kualitas (QUAL), kedalaman (DP), genotipe per sampel (GT). Header (##) + 1 baris per varian.",
            "kepribadian": "VCF itu seperti daftar typo hasil proofreading 3 miliar huruf: tiap baris = \u201cposisi X, seharusnya A, tertulis G, keyakinan sekian, ditemukan di sampel-sampel ini\u201d.",
            "kapan": "Output variant calling (BI8); input GWAS (BI12), anotasi klinis (BI2).",
            "worked": (
                "\U0001f4d0 Contoh: membaca baris VCF",
                "<p>chr1 &nbsp; 12345 &nbsp; rs123 &nbsp; A &nbsp; G &nbsp; 99 &nbsp; PASS &nbsp; DP=30 &nbsp; GT:DP &nbsp; 0/1:30<br />"
                "Posisi 12345: ref A \u2192 alt G, QUAL 99 (bagus), filter PASS, kedalaman 30x.<br />"
                "<strong>GT 0/1</strong> = heterozigot (satu kopi ref, satu alt). 1/1 = homozigot alt; 0/0 = homozigot ref.<br />"
                "Filter praktis: QUAL>30, DP>10, dan cek strand bias \u2014 varian QUAL tinggi tapi hanya di satu strand = artefak.</p>",
            ),
            "code_display": ("text",
                "##fileformat=VCFv4.2\n"
                "#CHROM POS   ID   REF ALT QUAL FILTER INFO\n"
                "chr1   12345 rs1  A   G   99   PASS   DP=30\n"
                "chr1   67890 rs2  CT  C   45   PASS   DP=22  <- delesi 1 basa"),
        },
        {
            "id": "gff",
            "title": "GFF/GTF, BED &amp; Count Matrix",
            "definisi": "<strong>GFF/GTF</strong>: anotasi fitur genom (gen, ekson: kromosom, start, end, strand). <strong>BED</strong>: interval genomik minimalis (0-based!). <strong>Count matrix</strong>: gen \u00d7 sampel jumlah bacaan \u2014 input RNA-seq (BI9).",
            "kepribadian": "GFF itu sertifikat tanah genom: \u201cpetak ini milik gen X, dari meter sekian sampai sekian\u201d. BED itu versi singkatnya untuk tukang survei. Count matrix itu tabel panen: baris = gen, kolom = sampel, isi = berapa bacaan.",
            "kapan": "GFF: anotasi & visualisasi. BED: interval untuk intersect (bedtools). Count matrix: differential expression.",
            "worked": (
                "\U0001f4d0 Contoh: jebakan koordinat 0-based vs 1-based",
                "<p><strong>BED</strong> (0-based, half-open): chr1 999 1005 = basa ke-1000\u20131005 (1-based).<br />"
                "<strong>GFF/VCF</strong> (1-based): posisi 1000 = basa ke-1000.<br />"
                "Konversi tanpa sadar = <strong>geser 1 basa</strong> \u2014 varian jatuh di luar ekson, analisis hancur. Selalu cek konvensi format sebelum intersect!</p>",
            ),
            "warning": "<strong>Jebakan klasik:</strong> BED 0-based vs VCF/GFF 1-based. Off-by-one error adalah bug tersering di bioinformatika \u2014 dan tersulit ditemukan karena hasilnya \u201champir benar\u201d.",
        },
    ],
    "myths": [
        ("File teks genomik bisa dibuka dan diedit di Excel/Word",
         "Excel merusak: memotong baris panjang, mengubah ID gen jadi tanggal (MARC1 \u2192 1-Mar!), mengubah format tanggal. Word menambah formatting tersembunyi. Pakai: less/head untuk lihat, Python/R untuk proses, IGV untuk visual. Jangan pernah simpan ulang file genomik dari Excel."),
        ("Kualitas Q30 berarti sekuensingnya sempurna",
         "Q30 = 99,9% per basa, tapi 3 miliar basa \u00d7 0,1% = 3 juta error. Ditambah error sistematis (konteks sekuens tertentu). Inilah kenapa coverage 30x + variant caller probabilistik (BI8) wajib \u2014 satu bacaan tidak pernah cukup."),
        ("Semua format koordinat genomik sama",
         "BED 0-based half-open vs VCF/GFF 1-based closed. Beda 1 basa = varian keluar dari ekson = kesimpulan salah. Selalu verifikasi konvensi sebelum operasi interval."),
    ],
    "tips": [
        "Jangan pernah parse VCF/SAM dengan split manual untuk produksi \u2014 pakai <strong>pysam / cyvcf2</strong>. Edge case format (field hilang, multiallelic) akan menghantui parser manual.",
        "Untuk file besar: <strong>jangan load ke RAM</strong> sekaligus. Stream per baris (Python) atau pakai tabix-indexed query untuk wilayah spesifik.",
        "Biasakan <strong>head + samtools view</strong> sebelum pipeline: lihat 5 baris pertama tiap file. 10 detik ini mencegah 10 jam komputasi sia-sia.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Parse FASTA &amp; FASTQ Manual",
            "intro": "Parse string FASTA (multi-sekuens) dan FASTQ: hitung panjang, GC%, dan rata-rata kualitas. Rasakan struktur 4-baris FASTQ.",
            "hint": "Ubah kualitas read2 menjadi buruk (karakter '#'). Lihat rata-rata Q anjlok \u2014 itulah yang dideteksi tahap QC (BI8).",
            "code": (
                "fasta = '>genA\\nATGCGTTAGCCGTAA\\n>genB\\nATATATGGCC\\n'\n"
                "seqs = {}\n"
                "nama = None\n"
                "for baris in fasta.strip().split('\\n'):\n"
                "    if baris.startswith('>'):\n"
                "        nama = baris[1:]; seqs[nama] = ''\n"
                "    else:\n"
                "        seqs[nama] += baris.strip()\n"
                "for n, s in seqs.items():\n"
                "    gc = (s.count('G')+s.count('C'))/len(s)*100\n"
                "    print(f'{n}: panjang={len(s)}, GC={gc:.0f}%')\n"
                "print()\n"
                "# FASTQ: 4 baris per read\n"
                "fastq = ['@R1', 'ACGTACGT', '+', 'IIIIIIII',\n"
                "         '@R2', 'TTTTGGGG', '+', '##IIIIII']\n"
                "for i in range(0, len(fastq), 4):\n"
                "    nama, seq, quals = fastq[i], fastq[i+1], fastq[i+3]\n"
                "    qmean = sum(ord(c)-33 for c in quals)/len(quals)\n"
                "    status = 'BAGUS' if qmean >= 30 else 'BURUK -> buang di QC'\n"
                "    print(f'{nama}: Q rata-rata={qmean:.0f} {status}')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Parse &amp; Filter VCF",
            "intro": "Parse baris VCF, ekstrak QUAL/DP/GT, terapkan filter (QUAL\u226530, DP\u226510). Hitung Ts/Tv ratio sebagai QC (harapan ~2 untuk WGS manusia).",
            "hint": "Ubah satu varian jadi QUAL rendah. Lihat ia tersaring. Ts/Tv jauh dari 2 = sinyal banyak false positive \u2014 QC klasik variant calling.",
            "code": (
                "vcf = [\n"
                "    ('chr1', 12345, 'A', 'G', 99, 'DP=30', '0/1'),\n"
                "    ('chr1', 67890, 'CT', 'C', 45, 'DP=22', '1/1'),\n"
                "    ('chr2', 11111, 'G', 'T', 12, 'DP=5', '0/1'),   # kualitas jelek\n"
                "    ('chr2', 22222, 'C', 'T', 80, 'DP=40', '0/0'),\n"
                "]\n"
                "lolos = []\n"
                "for chrom, pos, ref, alt, qual, info, gt in vcf:\n"
                "    dp = int(info.split('=')[1])\n"
                "    ok = qual >= 30 and dp >= 10\n"
                "    print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} {\"LOLOS\" if ok else \"SARING\"}')\n"
                "    if ok: lolos.append((ref, alt))\n"
                "# Ts/Tv: transisi (A<->G, C<->T) vs transversi\n"
                "transisi = {('A','G'),('G','A'),('C','T'),('T','C')}\n"
                "ts = sum(1 for r,a in lolos if (r,a) in transisi and len(r)==len(a)==1)\n"
                "tv = sum(1 for r,a in lolos if (r,a) not in transisi and len(r)==len(a)==1)\n"
                "print(f'\\nTs/Tv = {ts}/{tv} (harapan ~2.0 untuk WGS; jauh = curigai artefak)')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Butuh referensi/sekuens gen \u2192 FASTA",
            "kondisi": "Genom referensi, sekuens gen/protein.",
            "alasan": "Ringan, universal.",
            "contoh": "Download hg38 dari NCBI/Ensembl.",
        },
        {
            "title": "Data mentah sekuenser \u2192 FASTQ",
            "kondisi": "Awal pipeline; butuh kualitas per basa.",
            "alasan": "Satu-satunya yang menyimpan kualitas.",
            "contoh": "Input FastQC/trimming (BI8).",
        },
        {
            "title": "Hasil mapping \u2192 BAM (+BAI index)",
            "kondisi": "Butuh posisi tiap read; visualisasi IGV.",
            "alasan": "Terkompresi, terindeks untuk query wilayah.",
            "contoh": "Cek varian manual di IGV.",
        },
        {
            "title": "Daftar varian \u2192 VCF",
            "kondisi": "Analisis varian downstream.",
            "alasan": "Standar; menyimpan genotipe per sampel.",
            "contoh": "Input GWAS, anotasi ClinVar.",
        },
        {
            "title": "Interval/anotasi \u2192 BED/GFF",
            "kondisi": "Operasi wilayah genomik.",
            "alasan": "Ringan untuk intersect; GFF kaya anotasi.",
            "contoh": "bedtools intersect varian vs ekson.",
            "chart": {
                "var": "bi3SizeData",
                "data": [{"x": ["FASTA (genom)", "FASTQ (30x)", "BAM", "VCF"], "y": [3, 100, 80, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["3 GB", "100 GB", "80 GB", "1 GB"], "textposition": "outside"}],
                "title": "Ukuran File per Sampel WGS (orde besar)",
                "layout": {"xaxis": {"title": "Format"}, "yaxis": {"title": "GB", "type": "log"}, "showlegend": False},
                "cara": "Sumbu Y logaritmik. Bandingkan orde besarnya.",
                "interpretasi": "FASTQ mentah mendominasi (100 GB); hasil akhir VCF hanya ~1 GB. Pelajaran operasional: simpan FASTQ terkompresi + hapus intermediate bila perlu; yang diarsipkan jangka panjang biasanya BAM + VCF.",
            },
        },
    ],
    "aturan10": [
        "Jangan buka file genomik di Excel.",
        "Cek 0-based vs 1-based sebelum intersect.",
        "Q30 = standar; tapi butuh coverage ganda.",
        "Parse dengan library (pysam/cyvcf2), bukan split manual.",
    ],
    "case": {
        "title": "Varian \u201cHilang\u201d karena Off-by-One",
        "body": [
            "<p>Tim mengintersect VCF varian pasien dengan BED file ekson untuk mencari mutasi coding. Hasil: NOL varian coding \u2014 padahal pasien jelas punya penyakit genetik. Panik.</p>",
            "<p>Audit: file BED dibuat dari browser genom dengan konvensi 0-based, tapi script intersect mengasumsikan 1-based. Semua interval geser 1 basa \u2014 varian di batas ekson terlempar keluar.</p>",
        ],
        "pertanyaan": "Jelaskan mekanisme bug-nya dan SOP pencegahannya.",
        "pembahasan": "BED: chr1 999 1005 = basa 1000\u20131005 (1-based). Script 1-based membaca sebagai 999\u20131004 \u2014 geser 1 basa ke kiri. Varian di posisi batas ekson (splice site! \u2014 justru yang penting) terlewat. SOP: (1) dokumentasikan konvensi tiap file di header/pipeline; (2) gunakan library teruji (bedtools/pyranges) bukan intersect manual; (3) uji dengan kasus batas yang diketahui (positive control): varian yang HARUS kena intersect; (4) visualisasi spot-check di IGV. Pelajaran: bug 1 basa = hasil nol besar. Di bioinformatika, paranoia terhadap koordinat adalah kebajikan.",
    },
    "quiz": [
        ("Q30 artinya\u2026",
         ["30% error", "P(error) = 0,001 (1 per 1.000 basa)", "30 basa", "Kualitas 30%"],
         1,
         "Benar: Q = \u221210 log10(P). Q30 = 99,9% akurat per basa \u2014 tapi tetap butuh coverage ganda untuk 3 miliar basa."),
        ("Perbedaan FASTA vs FASTQ?",
         ["Tidak ada", "FASTQ menyimpan skor kualitas per basa (4 baris/read); FASTA hanya sekuens", "FASTQ lebih kecil", "FASTA untuk varian"],
         1,
         "Benar: kualitas = alasan FASTQ 4x lebih besar dan menjadi input QC."),
        ("CIGAR \u201c4M1I3M\u201d artinya\u2026",
         ["4 mutasi", "4 match, 1 insersi, 3 match", "4 kromosom", "Error"],
         1,
         "Benar: bahasa kompak operasi alignment di SAM/BAM."),
        ("GT = 0/1 pada VCF berarti\u2026",
         ["Homozigot referensi", "Heterozigot (satu ref, satu alt)", "Homozigot alternatif", "Tidak ada data"],
         1,
         "Benar: 0=ref, 1=alt. 0/1 = heterozigot; 1/1 = homozigot alt."),
        ("BED 0-based vs VCF 1-based. Akibat tertukar?",
         ["Tidak ada", "Geser 1 basa \u2014 varian batas ekson terlewat (off-by-one)", "File corrupt", "Hanya lambat"],
         1,
         "Benar: bug tersering dan tersulit ditemukan karena hasil \u201champir benar\u201d."),
        ("Ts/Tv ratio jauh dari ~2 pada WGS manusia menandakan\u2026",
         ["Sukses", "Kemungkinan banyak false positive \u2014 cek QC variant calling", "Tidak ada arti", "Harus dihapus semua"],
         1,
         "Benar: Ts/Tv adalah QC klasik. Biologi manusia ~2; artefak menggesernya."),
    ],
    "rangkuman": [
        "<strong>FASTA</strong>: sekuens; <strong>FASTQ</strong>: sekuens + kualitas (Q=\u221210log P).",
        "<strong>SAM/BAM</strong>: hasil mapping (posisi, CIGAR, MAPQ).",
        "<strong>VCF</strong>: katalog varian (QUAL, DP, GT); filter QUAL\u226530, DP\u226510.",
        "<strong>GFF/GTF</strong>: anotasi; <strong>BED</strong>: interval 0-based; <strong>count matrix</strong>: input DE.",
        "Waspadai <strong>off-by-one</strong>: BED 0-based vs VCF 1-based.",
        "Jangan buka di Excel; parse dengan <strong>library</strong>; stream file besar.",
        "Ts/Tv ~2 sebagai QC variant calling manusia.",
        "Format = kontrak; salah baca kontrak = salah sains.",
    ],
    "prev": ("bi2-database", "BI2"),
    "next": ("bi4-command-line", "BI4"),
}

# ================================================================ BI4
BI4 = {
    "slug": "bi4-command-line",
    "code": "BI4",
    "track": TRACK,
    "cover_title": "Terminal, Git &amp; Nextflow:<br />Senjata Wajib Bioinformatikawan",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 1.000 Sampel, 1 Klik"),
        ("cli", "Command Line \u2014 Si Bahasa Ibu"),
        ("conda", "Conda/Docker: Lingkungan yang Beku"),
        ("git", "Git: Mesin Waktu Kode"),
        ("workflow", "Snakemake/Nextflow &amp; HPC"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Simulasi Perintah Unix untuk FASTQ"),
        ("lab2", "\U0001f52c Lab 2: Simulasi Pipeline DAG"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan mengapa <strong>command line</strong> wajib untuk data genomik skala besar.",
        "Menggunakan pola pikir <strong>pipe & streaming</strong> untuk file besar tanpa memuat ke RAM.",
        "Menjelaskan peran <strong>conda/Docker</strong> (reproducibility lingkungan) dan <strong>Git</strong> (versi kode).",
        "Merancang <strong>workflow DAG</strong> (Snakemake/Nextflow) dan menjelaskan eksekusi di <strong>HPC/Slurm</strong>.",
    ],
    "story_title": "Cerita Pembuka: 1.000 Sampel, 1 Klik",
    "story": [
        "<p>Dua analis mendapat tugas sama: QC 1.000 file FASTQ. Analis A membuka satu per satu di aplikasi GUI \u2014 setelah 3 hari, baru 60 file. Analis B menulis 5 baris bash loop + submit ke cluster \u2014 selesai 2 jam sambil ngopi. Promosi tahun itu jatuh ke analis B.</p>",
        "<p>Di bioinformatika, GUI adalah mainan; terminal adalah alat kerja. Bukan karena elitisme \u2014 tapi karena datanya terlalu besar untuk diklik. Lesson ini mengajarkan senjata yang muncul di SEMUA lowongan bioinformatikawan: Unix, Git, conda/Docker, workflow manager, HPC.</p>",
    ],
    "konsep": [
        {
            "id": "cli",
            "title": "Command Line \u2014 Si Bahasa Ibu",
            "definisi": "Terminal Unix: antarmuka teks untuk menjalankan program, memanipulasi file, dan merangkai alat via <strong>pipe (|)</strong>. Hampir semua tool bioinformatika (BWA, GATK, samtools) adalah program command-line.",
            "kepribadian": "Terminal itu seperti dapur profesional: tidak seindah restoran (GUI), tapi bisa memasak untuk 1.000 orang. Pipe (|) adalah ban berjalan: output satu alat langsung jadi input berikutnya tanpa file perantara.",
            "kapan": "Selalu untuk data besar; eksplorasi cepat file (head/less/grep); otomasi berulang (loop); akses server/HPC.",
            "worked": (
                "\U0001f4d0 Contoh: QC cepat tanpa buka file",
                "<p><code>zcat sample.fastq.gz | head -8</code> \u2014 lihat 2 read pertama tanpa ekstrak 100 GB.<br />"
                "<code>grep -c \"^@\" sample.fastq</code> \u2014 hitung jumlah read (baris @).<br />"
                "<code>for f in *.fastq.gz; do fastqc $f; done</code> \u2014 QC 1.000 file sekaligus.<br />"
                "Tiga baris ini = pekerjaan 3 hari analis A.</p>",
            ),
            "code_display": ("bash",
                "# streaming: tidak memuat 100GB ke RAM\n"
                "zcat huge.fastq.gz | head -8\n"
                "\n"
                "# pipe: rangkai alat tanpa file perantara\n"
                "samtools view -b aln.sam | samtools sort -o aln.bam\n"
                "\n"
                "# loop: 1000 sampel sekaligus\n"
                "for f in *.fastq.gz; do fastqc \"$f\"; done"),
            "chart": {
                "var": "bi4TimeData",
                "data": [{"x": ["GUI manual", "Script lokal", "Script + HPC"], "y": [72, 6, 0.5], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["72 jam", "6 jam", "30 mnt"], "textposition": "outside"}],
                "title": "Waktu QC 1.000 FASTQ per Pendekatan (ilustratif)",
                "layout": {"xaxis": {"title": "Pendekatan"}, "yaxis": {"title": "Jam", "type": "log"}, "showlegend": False},
                "cara": "Sumbu Y logaritmik. Bandingkan orde waktunya.",
                "interpretasi": "Lompatan 72 jam \u2192 30 menit bukan soal kepintaran \u2014 soal alat. Inilah kenapa \u201ccomfortable with Linux terminal\u201d ada di semua lowongan: ia mengubah hari menjadi menit.",
            },
        },
        {
            "id": "conda",
            "title": "Conda/Docker: Lingkungan yang Beku \u2014 Si Kulkas Waktu",
            "definisi": "<strong>Conda</strong>: manajer paket + environment terisolasi (bwa versi X hanya di env ini). <strong>Docker</strong>: kontainer \u2014 seluruh OS + tool + dependensi dibekukan dalam image yang identik di mana pun.",
            "rumus": r"\text{Reproducibility} = \text{kode} + \text{data} + \text{lingkungan (versi tool)}",
            "simbol": [
                (r"\text{versi tool}", "BWA 0.7.17 vs 0.7.18 bisa memberi hasil beda!"),
            ],
            "interpretasi": "Pipeline yang jalan di laptopmu tapi gagal di cluster = 90% masalah lingkungan. Bekukan lingkungan = bekukan salah satu sumber ketidakpastian.",
            "worked": (
                "\U0001f4d0 Contoh: environment.yml",
                "<p>name: rnaseq<br />channels: [bioconda, conda-forge]<br />dependencies: [star=2.7.10a, samtools=1.17, python=3.11]<br />"
                "<code>conda env create -f environment.yml</code> \u2192 siapa pun, di mana pun, dapat tool versi <strong>persis sama</strong>.<br />"
                "Docker selangkah lebih jauh: <code>docker run pipeline:v1.2</code> = OS + tool identik, bahkan di cloud.</p>",
            ),
            "kepribadian": "Conda itu kulkas: tiap proyek punya rak sendiri, bau ikan proyek A tidak mencemari proyek B. Docker itu kontainer kargo berpendingin: dikirim ke mana pun, isinya sama persis.",
            "kapan": "Setiap proyek: satu env per proyek; Docker untuk pipeline yang dishare/dideploy.",
        },
        {
            "id": "git",
            "title": "Git: Mesin Waktu Kode \u2014 Si Pencatat Setia",
            "definisi": "<strong>Git</strong>: version control \u2014 mencatat tiap perubahan kode (commit) dengan pesan, bisa kembali ke versi apapun, dan kolaborasi tanpa tabrakan.",
            "kepribadian": "Git itu seperti mesin waktu + notulen rapat: \u201cversi 3 Januari yang berhasil itu yang mana?\u201d \u2014 tinggal checkout. Tanpa git, analis menyimpan pipeline_final_v2_REAL.py dan menangis.",
            "kapan": "Semua kode analisis. Commit tiap langkah logis; pesan jelas (\u201ctambah filter QUAL>30\u201d bukan \u201cupdate\u201d).",
            "worked": (
                "\U0001f4d0 Contoh: alur 3 perintah inti",
                "<p><code>git init</code> \u2192 mulai lacak.<br />"
                "<code>git add pipeline.py; git commit -m \"tambah trimming\"</code> \u2192 simpan versi.<br />"
                "<code>git log --oneline</code> \u2192 riwayat: v1, v2, v3...<br />"
                "Hasil pipeline aneh? <code>git diff v2 v3</code> \u2192 tahu persis apa yang berubah. Inilah beda sains dan tebak-tebakan.</p>",
            ),
        },
        {
            "id": "workflow",
            "title": "Snakemake/Nextflow &amp; HPC \u2014 Si Orkestra",
            "definisi": "<strong>Workflow manager</strong>: mendefinisikan pipeline sebagai <strong>DAG</strong> (aturan: input \u2192 output), otomatis menjalankan yang perlu, paralel, dan resume saat gagal. <strong>HPC/Slurm</strong>: cluster komputasi \u2014 submit job antre ke ratusan core.",
            "kepribadian": "Tanpa workflow manager, pipeline = 20 script yang dijalankan manual berurutan sambil berdoa. Dengan Snakemake/Nextflow = orkestra dengan partitur: tiap pemain tahu kapan masuk, konduktor menangani yang gagal dan mengulang hanya bagiannya.",
            "kapan": "Pipeline >3 tahap atau >10 sampel: wajib workflow manager. Komputasi berat (mapping, calling): submit ke HPC/cloud, bukan laptop.",
            "worked": (
                "\U0001f4d0 Contoh: aturan Snakemake + Slurm",
                "<p>rule mapping: input fastq \u2192 output bam (via bwa). Snakemake membangun DAG, menjalankan 1.000 mapping paralel, skip yang sudah selesai.<br />"
                "<code>sbatch --cpus-per-task=8 --mem=32G run.sh</code> \u2192 antre di Slurm; 1.000 job jalan di ratusan core.<br />"
                "Lowongan menulis \u201cHPC/Slurm experience\u201d \u2014 inilah yang dimaksud: bukan teori, tapi pernah submit ribuan job tanpa menangis.</p>",
            ),
            "code_display": ("python",
                "# Snakemake: aturan = resep mini\n"
                "rule mapping:\n"
                "    input:  \"fastq/{s}.fastq.gz\"\n"
                "    output: \"bam/{s}.bam\"\n"
                "    shell:  \"bwa mem ref.fa {input} | samtools sort -o {output}\""),
        },
    ],
    "myths": [
        ("GUI lebih aman karena tidak perlu hafal perintah",
         "GUI menyembunyikan parameter (versi tool? argumen apa?) \u2192 tidak reproducible. \u201cAman\u201d semu: kamu tidak tahu apa yang terjadi. Command line + script = jejak lengkap yang bisa diaudit. Keamanan sejati = transparansi."),
        ("Docker/conda hanya untuk programmer",
         "\u201cWorks on my machine\u201d adalah mimpi buruk bioinformatika: hasil beda karena versi tool beda. Environment management adalah skill <em>analis</em>, bukan programmer \u2014 ia menentukan apakah analisismu bisa dipercaya orang lain."),
        ("HPC = komputer yang lebih cepat saja",
         "HPC = sistem antre + paralel + storage bersama. Skill-nya bukan \u201cpunya akses\u201d tapi: menulis job yang efisien, tidak membanjiri antrean, mengelola 1.000 output, dan resume yang gagal. Etika cluster adalah skill profesional."),
    ],
    "tips": [
        "Pelajari <strong>20 perintah</strong> dulu (ls, cd, head, tail, grep, awk, sort, uniq, wc, cut, sed, find, tar, ssh, scp, top, df, chmod, ln, man) \u2014 95% pekerjaan harian hanya ini.",
        "Biasakan <strong>tidak menimpa file mentah</strong>: baca saja (streaming), tulis output baru. File mentah 100 GB yang rusak = tragedi; yang read-only = aman.",
        "Untuk setiap pipeline, sediakan <strong>mode dry-run + test 1 sampel</strong>. Jangan submit 1.000 job sebelum 1 sampel lolos \u2014 cluster bukan tempat debugging.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Pola Pikir Unix di Python",
            "intro": "Simulasikan pipe Unix (grep | wc) dan streaming untuk file besar: proses FASTQ baris-per-baris tanpa load semua ke RAM.",
            "hint": "Bandingkan: load semua vs streaming untuk 1 juta read (simulasi). Streaming = memori konstan. Inilah kenapa zcat | head bekerja untuk 100 GB.",
            "code": (
                "# simulasi: hitung read dengan kualitas buruk via 'pipe' mental\n"
                "import random\n"
                "random.seed(1)\n"
                "def baca_fastq(n):\n"
                "    # generator = streaming, tidak simpan semua di RAM\n"
                "    for i in range(n):\n"
                "        q = random.gauss(35, 8)\n"
                "        yield (f'@R{i}', 'ACGT'*25, '+', 'I'*100, q)\n"
                "n = 200000\n"
                "jelek = sum(1 for _, _, _, _, q in baca_fastq(n) if q < 20)\n"
                "print(f'total read (streaming): {n}')\n"
                "print(f'kualitas buruk (Q<20): {jelek} ({jelek/n:.1%})')\n"
                "print()\n"
                "print('Memori konstan walau n=200rb. Inilah filosofi Unix pipe:')\n"
                "print('proses mengalir, bukan menumpuk.')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Simulasi DAG Pipeline",
            "intro": "Definisikan pipeline 4 tahap sebagai DAG (dependensi), lalu simulasikan eksekusi: hanya jalankan yang inputnya berubah (prinsip Snakemake).",
            "hint": "Ubah \u2018input berubah\u2019 pada tahap tengah. Lihat tahap awal di-skip (up-to-date) \u2014 itulah penghematan waktu workflow manager saat resume.",
            "code": (
                "# DAG: qc -> trim -> mapping -> calling\n"
                "tahap = {\n"
                "    'qc':      {'in': ['sample.fastq'], 'berubah': False},\n"
                "    'trim':    {'in': ['qc'], 'berubah': True},   # parameter diubah!\n"
                "    'mapping': {'in': ['trim'], 'berubah': False},\n"
                "    'calling': {'in': ['mapping'], 'berubah': False},\n"
                "}\n"
                "urutan = ['qc', 'trim', 'mapping', 'calling']\n"
                "kotor = set()\n"
                "for t in urutan:\n"
                "    dep_kotor = any(d in kotor for d in tahap[t]['in'] if d in tahap)\n"
                "    if tahap[t]['berubah'] or dep_kotor:\n"
                "        kotor.add(t)\n"
                "        print(f'JALANKAN {t} (input/parameter berubah)')\n"
                "    else:\n"
                "        print(f'skip {t} (up-to-date)')\n"
                "print()\n"
                "print('Ubah parameter trimming -> hanya trim+mapping+calling diulang.')\n"
                "print('Tanpa DAG: semua diulang manual. Dengan 1000 sampel: bencana.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Eksplorasi cepat file besar \u2192 head/grep/awk + pipe",
            "kondisi": "Lihat, hitung, filter tanpa buka penuh.",
            "alasan": "Streaming: cepat, hemat RAM.",
            "contoh": "Cek 5 read pertama FASTQ 100 GB.",
        },
        {
            "title": "Analisis berulang \u2192 Script (bash/Python)",
            "kondisi": "Dilakukan >2 kali atau >10 file.",
            "alasan": "Reproducible; sekali tulis, selamanya jalan.",
            "contoh": "Loop QC 1.000 sampel.",
        },
        {
            "title": "Pipeline multi-tahap \u2192 Snakemake/Nextflow",
            "kondisi": ">3 tahap atau butuh resume/paralel.",
            "alasan": "DAG + otomatisasi + portabel ke HPC/cloud.",
            "contoh": "Pipeline RNA-seq: qc\u2192trim\u2192map\u2192count\u2192DE.",
        },
        {
            "title": "Komputasi berat \u2192 HPC/Slurm atau cloud",
            "kondisi": "Mapping/variant calling ratusan sampel.",
            "alasan": "Ratusan core paralel; laptop menyerah.",
            "contoh": "sbatch array 1.000 mapping WGS.",
        },
        {
            "title": "Share pipeline \u2192 Conda env / Docker + Git",
            "kondisi": "Orang lain harus bisa jalan.",
            "alasan": "Lingkungan beku + kode berversi = reproducible.",
            "contoh": "Paper dengan repo + environment.yml + image.",
        },
    ],
    "aturan10": [
        "Terminal dulu, GUI kemudian (kalau sempat).",
        "Stream, jangan load, file besar.",
        "Satu env per proyek; commit tiap langkah.",
        "Test 1 sampel sebelum 1.000 job.",
    ],
    "case": {
        "title": "\u201cPipeline Berhasil di Laptopku\u201d",
        "body": [
            "<p>Analis mengirim pipeline RNA-seq ke kolaborator. Di laptopnya jalan sempurna; di server kolaborator gagal total: versi STAR beda, Python beda, path hardcode /home/analis/.</p>",
            "<p>Deadline paper 2 minggu. Kolaborator frustrasi: \u201cKiril ulang yang bisa jalan!\u201d</p>",
        ],
        "pertanyaan": "Diagnosis + resep perbaikan agar tidak terulang.",
        "pembahasan": "Tiga dosa reproducibility: (1) tool tanpa versi pin (STAR beda \u2192 hasil beda); (2) path absolut hardcode; (3) tanpa workflow manager (urutan manual tak terdokumentasi). Resep: (a) conda environment.yml / Docker image dengan versi pin; (b) path relatif + config file; (c) Snakemake/Nextflow untuk orkestrasi; (d) Git untuk kode; (e) test di mesin bersih (fresh container) sebelum kirim. Pelajaran: \u201cberhasil di laptopku\u201d bukan bukti \u2014 bukti adalah orang lain bisa menjalankannya dari nol.",
    },
    "quiz": [
        ("Kenapa command line wajib di bioinformatika?",
         ["Terlihat keren", "Data terlalu besar untuk GUI; tool bioinformatika native CLI; otomasi ribuan file", "Gratis", "Tidak ada alasan"],
         1,
         "Benar: 100 GB tidak bisa diklik. Semua lowongan bioinformatikawan mensyaratkan Unix."),
        ("Pipe (|) dalam Unix berguna untuk\u2026",
         ["Hiasan", "Merangkai output satu program jadi input berikutnya tanpa file perantara (streaming)", "Mempercepat internet", "Menghapus file"],
         1,
         "Benar: ban berjalan data. Hemat disk + waktu untuk file besar."),
        ("Fungsi utama conda environment per proyek?",
         ["Hemat disk", "Isolasi versi tool per proyek \u2014 reproducibility lingkungan", "Mempercepat", "Wajib lisensi"],
         1,
         "Benar: BWA 0.7.17 vs 0.7.18 bisa beda hasil. Bekukan lingkungan = bekukan ketidakpastian."),
        ("Keunggulan Snakemake/Nextflow atas script manual berurutan?",
         ["Lebih pendek", "DAG: otomatis skip yang up-to-date, paralel, resume yang gagal", "Lebih cantik", "Tidak ada"],
         1,
         "Benar: orkestra vs main solo. Untuk pipeline >3 tahap, ini pembeda profesional."),
        ("Sebelum submit 1.000 job ke Slurm, yang wajib?",
         ["Langsung submit", "Test 1 sampel sampai lolos + dry-run (cluster bukan tempat debugging)", "Minta izin teman", "Restart cluster"],
         1,
         "Benar: 1.000 job gagal = 1.000x malu + antrean penuh. Etika cluster = skill profesional."),
        ("Git paling berharga saat\u2026",
         ["Kode sedikit", "Hasil aneh dan perlu tahu apa yang berubah sejak versi yang berhasil (git diff/log)", "Tidak pernah", "Hanya untuk tim besar"],
         1,
         "Benar: mesin waktu + notulen. \u201cVersi 3 Januari yang jalan itu yang mana?\u201d terjawab seketika."),
    ],
    "rangkuman": [
        "<strong>Terminal</strong>: bahasa ibu bioinformatika; pipe = streaming tanpa beban RAM.",
        "Kuasai <strong>20 perintah inti</strong>; jangan timpa file mentah.",
        "<strong>Conda/Docker</strong>: bekukan lingkungan (versi tool) untuk reproducibility.",
        "<strong>Git</strong>: version control; commit tiap langkah logis.",
        "<strong>Snakemake/Nextflow</strong>: pipeline sebagai DAG \u2014 paralel, resume, portabel.",
        "<strong>HPC/Slurm</strong>: submit ribuan job; test 1 sampel dulu.",
        "Reproducibility = <strong>kode + data + lingkungan</strong>.",
        "\u201cBerhasil di laptopku\u201d bukan bukti \u2014 bukti = orang lain bisa jalan dari nol.",
    ],
    "prev": ("bi3-format-data", "BI3"),
    "next": ("bi5-biopython-r", "BI5"),
}

# ================================================================ BI5
BI5 = {
    "slug": "bi5-biopython-r",
    "code": "BI5",
    "track": TRACK,
    "cover_title": "Biopython &amp; Bioconductor:<br />Ngoding untuk Biologi",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: 3 Jam vs 3 Menit"),
        ("biopython", "Biopython \u2014 Si Multitool Python"),
        ("bioconductor", "Bioconductor \u2014 Si Perpustakaan Raksasa R"),
        ("pilih", "Python vs R: Kapan yang Mana"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Objek Seq ala Biopython"),
        ("lab2", "\U0001f52c Lab 2: Hitung Kodon &amp; Translasi Batch"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Menjelaskan peran <strong>Biopython</strong> (Seq, SeqIO, Entrez, pairwise2) dan <strong>Bioconductor</strong> (ekosistem R untuk genomik).",
        "Memparse <strong>FASTA/GenBank</strong> dan mengakses <strong>NCBI Entrez</strong> secara programatik.",
        "Melakukan operasi sekuens batch: <strong>komplemen, translasi, GC%</strong> (pola pikir vektorisasi).",
        "Memilih <strong>Python vs R</strong> sesuai tugas (dan menjelaskan kenapa lowongan minta keduanya).",
    ],
    "story_title": "Cerita Pembuka: 3 Jam vs 3 Menit",
    "story": [
        "<p>Magang diminta menghitung GC% dari 500 sekuens gen. Ia buka satu per satu di web tool, copy-paste ke Excel \u2014 3 jam, 12 salah ketik. Senior menulis 10 baris Biopython: SeqIO.parse + GC \u2014 3 menit, nol error, plus script-nya bisa dipakai lagi selamanya.</p>",
        "<p>Itulah seluruh argumen lesson ini: di bioinformatika, <strong>ngoding bukan skill tambahan \u2014 ia adalah pipet dan mikroskopmu</strong>. Biopython dan Bioconductor adalah dua kotak perkakas standar yang muncul di hampir semua lowongan. Lesson ini memastikan kamu bisa memakai keduanya, bukan sekadar menyebutnya di CV.</p>",
    ],
    "konsep": [
        {
            "id": "biopython",
            "title": "Biopython \u2014 Si Multitool Python",
            "definisi": "<strong>Biopython</strong>: library Python untuk biologi komputasional \u2014 objek Seq (sekuens + alfabet), SeqIO (parse semua format), Entrez (akses NCBI), pairwise2 (alignment), Phylo (pohon).",
            "kepribadian": "Biopython itu seperti Swiss Army Knife: bukan alat paling tajam untuk tiap tugas, tapi selalu ada di saku dan cukup untuk 90% pekerjaan harian. Untuk yang super-spesifik (variant calling), pakai tool khusus.",
            "kapan": "Parsing format, manipulasi sekuens batch, akses database, pipeline glue code (lihat BI4).",
            "worked": (
                "\U0001f4d0 Contoh: pola SeqIO",
                "<p><code>from Bio import SeqIO</code><br />"
                "<code>for rec in SeqIO.parse(\"gen.fasta\", \"fasta\"):</code><br />"
                "&nbsp;&nbsp;<code>print(rec.id, len(rec.seq), rec.seq.reverse_complement()[:20])</code><br />"
                "Tiga baris = baca semua sekuens + reverse complement. Bandingkan dengan parser manual 30 baris yang rapuh (BI3).<br />"
                "<code>Entrez.efetch(db=\"nucleotide\", id=\"NM_000059\")</code> \u2192 download sekuens BRCA2 langsung.</p>",
            ),
            "code_display": ("python",
                "from Bio import SeqIO\n"
                "from Bio.SeqUtils import gc_fraction\n"
                "\n"
                "for rec in SeqIO.parse(\"gen.fasta\", \"fasta\"):\n"
                "    print(rec.id, f\"GC={gc_fraction(rec.seq):.0%}\")\n"
                "    print(\"  protein:\", rec.seq.translate(to_stop=True))"),
            "chart": {
                "var": "bi5LibData",
                "data": [{"x": ["Parsing format", "Akses database", "Statistik/plot", "ML"], "y": [9, 8, 4, 7], "type": "bar", "name": "Python/Biopython", "marker": {"color": "#2a7de1"}},
                        {"x": ["Parsing format", "Akses database", "Statistik/plot", "ML"], "y": [5, 6, 10, 4], "type": "bar", "name": "R/Bioconductor", "marker": {"color": "#e8a838"}}],
                "title": "Kekuatan Relatif Python vs R per Tugas (ilustratif)",
                "layout": {"barmode": "group", "xaxis": {"title": "Tugas"}, "yaxis": {"title": "Kekuatan"}, "showlegend": True},
                "cara": "Biru = Python/Biopython, kuning = R/Bioconductor per kategori tugas.",
                "interpretasi": "Python unggul di parsing, database, dan ML; R unggul telak di statistik/plot genomik (Bioconductor). Inilah kenapa lowongan menulis \u201cR and/or Python\u201d \u2014 tapi yang terbaik menguasai keduanya untuk tugas masing-masing.",
            },
        },
        {
            "id": "bioconductor",
            "title": "Bioconductor \u2014 Si Perpustakaan Raksasa R",
            "definisi": "<strong>Bioconductor</strong>: 2.300+ paket R untuk genomik \u2014 DESeq2 (RNA-seq), GenomicRanges (interval), Biostrings (sekuens), minfi (metilasi), flowCore. Terkurasi dengan dokumentasi vignette yang luar biasa.",
            "kepribadian": "Bioconductor itu seperti perpustakaan universitas tua: koleksinya dalam, pustakawannya (reviewer) ketat, dan tiap buku (paket) punya panduan pakai (vignette). Tidak se-trendi Python, tapi untuk statistik genomik ia adalah rumahnya.",
            "kapan": "Analisis statistik genomik: DE (DESeq2/edgeR), interval genomik (GenomicRanges), visualisasi statistik kompleks. Lihat BI9, BI10, BI12.",
            "worked": (
                "\U0001f4d0 Contoh: alur DESeq2 (konseptual)",
                "<p><code>dds <- DESeqDataSetFromMatrix(countData, colData, design=~kondisi)</code><br />"
                "<code>dds <- DESeq(dds)</code> &nbsp;&larr; normalisasi + model NB + uji Wald<br />"
                "<code>res <- results(dds)</code> &nbsp;&larr; tabel gen: log2FC, p-value, padj<br />"
                "Tiga baris untuk analisis yang benar secara statistik (lihat BI9 kenapa tidak boleh pakai uji-t biasa).<br />"
                "GenomicRanges: <code>findOverlaps(varian, ekson)</code> = intersect ala bedtools dalam R.</p>",
            ),
            "warning": "<strong>Jebakan R:</strong> 1-based indexing (beda dari Python 0-based!) dan copy-on-modify (boros memori untuk data besar). Untuk data raksasa, proses di Python/command line dulu, analisis statistik di R.",
        },
        {
            "id": "pilih",
            "title": "Python vs R: Kapan yang Mana \u2014 Si Wasit",
            "definisi": "Aturan praktis: <strong>Python</strong> untuk engineering (parsing, pipeline, API, ML); <strong>R</strong> untuk statistik genomik dan visualisasi publikasi. Banyak profesional memakai keduanya dalam satu proyek.",
            "rumus": r"\text{Produktivitas} = \text{alat tepat} \times \text{tidak fanatik}",
            "simbol": [],
            "interpretasi": "Rumus canda tapi benar: fanatisme bahasa = memilih obeng untuk memaku. Lowongan menulis keduanya karena pipeline nyata memang bilingual.",
            "worked": (
                "\U0001f4d0 Contoh: proyek RNA-seq bilingual",
                "<p><strong>Python:</strong> download SRA (Entrez), QC parse, submit job cluster (BI4).<br />"
                "<strong>R:</strong> DESeq2 untuk differential expression, ggplot2 volcano plot.<br />"
                "<strong>Python lagi:</strong> ML downstream (BI16).<br />"
                "Lem antar bahasa: file (TSV/RDS) atau reticulate/rpy2. Pilih per tugas, bukan per agama.</p>",
            ),
            "kepribadian": "Perang Python vs R itu seperti perang sendok vs garpu: untuk sup, sendok menang; untuk steak, garpu menang. Koki profesional punya keduanya.",
            "kapan": "Belajar: kuasai satu dalam-dalam, satu lagi cukup untuk membaca dan memakai paket standarnya. Itu sudah di atas rata-rata pelamar.",
        },
    ],
    "myths": [
        ("Harus pilih SATU bahasa dan fanatik",
         "Pipeline nyata bilingual. \u201cPython person\u201d yang tidak bisa baca vignette DESeq2 akan kesulitan di RNA-seq; \u201cR person\u201d yang tidak bisa parsing FASTQ 100 GB akan kesulitan di NGS. Fleksibilitas > fanatisme."),
        ("Biopython lambat sehingga tidak dipakai profesional",
         "Biopython untuk orkestrasi dan prototyping; komputasi berat diserahkan ke tool C (BWA, samtools) atau numpy. \u201cLambat\u201d hanya masalah bila dipakai untuk hal yang salah \u2014 seperti memakai sendok untuk memotong steak."),
        ("Copy-paste kode dari vignette/forum = sudah bisa",
         "Bisa jalan \u2260 paham. Vignette DESeq2 yang dijalankan buta menghasilkan p-value yang salah tafsir (lihat BI9: desain formula, shrinkage). Pahami tiap baris sebelum percaya outputnya."),
    ],
    "tips": [
        "Bangun <strong>snippet library</strong> pribadi: parse FASTA, GC batch, Entrez download, translate. 20 snippet = 80% tugas harian. Kumpulkan dari tiap lesson.",
        "Untuk R: baca <strong>vignette</strong> sebelum Stack Overflow. Vignette Bioconductor ditulis maintainer-nya sendiri \u2014 kualitasnya di atas jawaban forum acak.",
        "Latih <strong>pola pikir vektorisasi</strong>: loop 1 juta sekuens di Python murni = lambat; list comprehension + numpy/pandas = cepat. Mulai dari yang benar, optimalkan bila perlu.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Objek Seq ala Biopython (Simulasi)",
            "intro": "Simulasikan kelas Seq: simpan sekuens + alfabet, method komplemen/transkripsi/translasi. Rasakan enaknya OOP untuk sekuens vs string mentah.",
            "hint": "Tambahkan method gc() dan validasi alfabet (tolak huruf selain ATGC). Inilah nilai objek: data + perilaku + validasi dalam satu tempat.",
            "code": (
                "class Seq:\n"
                "    komplement = str.maketrans('ATGC', 'TACG')\n"
                "    def __init__(self, s):\n"
                "        s = s.upper()\n"
                "        assert set(s) <= set('ATGC'), 'alfabet tidak valid!'\n"
                "        self.s = s\n"
                "    def komplemen(self): return Seq(self.s.translate(self.komplement))\n"
                "    def reverse_komplemen(self): return Seq(self.s.translate(self.komplement)[::-1])\n"
                "    def gc(self): return (self.s.count('G')+self.s.count('C'))/len(self.s)\n"
                "    def __len__(self): return len(self.s)\n"
                "    def __repr__(self): return f'Seq({self.s[:20]}...)'\n"
                "\n"
                "dna = Seq('ATGCGTTAGCCGTAA')\n"
                "print(dna)\n"
                "print('komplemen :', dna.komplemen().s)\n"
                "print('rev-komp  :', dna.reverse_komplemen().s)\n"
                "print(f'GC        : {dna.gc():.0%}')\n"
                "print()\n"
                "print('Biopython: Seq + SeqRecord + SeqIO = pola ini, versi profesional.')\n"
                "# coba: Seq('ATGXYZ') -> error validasi! (data kotor tertangkap awal)"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Translasi Batch 6-Frame",
            "intro": "Terjemahkan sekuens dalam 6 frame (3 maju + 3 reverse complement) dan cari ORF terpanjang \u2014 konsep dasar prediksi gen (lihat BI7).",
            "hint": "ORF = start (ATG) sampai stop. Gen bakteri biasanya ORF terpanjang. Coba sekuens acak vs sekuens gen asli \u2014 bedakan polanya.",
            "code": (
                "kodon = {'ATG':'M','TTT':'F','TTC':'F','TTA':'L','TAA':'*','TAG':'*',\n"
                "         'TGA':'*','GCT':'A','GCC':'A','GGT':'G','AAA':'K'}\n"
                "def translate(s):\n"
                "    return ''.join(kodon.get(s[i:i+3], 'X') for i in range(0, len(s)-2, 3))\n"
                "def revcomp(s):\n"
                "    return s.translate(str.maketrans('ATGC','TACG'))[::-1]\n"
                "seq = 'AAATGTTTAAATAGGGATGTAAACC'  # ubah sesukamu\n"
                "print(f'sekuens: {seq}')\n"
                "terpanjang = ('', 0)\n"
                "for fr in range(3):\n"
                "    for label, s in [('+', seq), ('-', revcomp(seq))]:\n"
                "        prot = translate(s[fr:])\n"
                "        # ORF: dari M sampai *\n"
                "        for bagian in prot.split('*'):\n"
                "            if 'M' in bagian:\n"
                "                orf = bagian[bagian.index('M'):]\n"
                "                if len(orf) > terpanjang[1]:\n"
                "                    terpanjang = (f'{label}{fr+1}', len(orf))\n"
                "        print(f'  frame {label}{fr+1}: {prot}')\n"
                "print(f'\\nORF terpanjang: frame {terpanjang[0]}, {terpanjang[1]} aa')\n"
                "print('Inilah logika dasar gene finding (BI7): cari ORF bermakna.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Parsing/manipulasi sekuens batch \u2192 Biopython",
            "kondisi": "Format I/O, operasi sekuens, akses NCBI.",
            "alasan": "API matang; glue code pipeline.",
            "contoh": "Batch reverse-complement 10.000 primer.",
        },
        {
            "title": "Statistik genomik (DE, enrichment) \u2192 Bioconductor/R",
            "kondisi": "Butuh metode statistik teruji + visualisasi.",
            "alasan": "DESeq2/edgeR adalah standar emas; vignette luar biasa.",
            "contoh": "Differential expression RNA-seq (BI9).",
        },
        {
            "title": "Pipeline & ML \u2192 Python (sklearn, pytorch)",
            "kondisi": "Otomasi, integrasi, deep learning.",
            "alasan": "Ekosistem engineering + ML terkuat.",
            "contoh": "Prediksi efek varian dengan DL (BI16).",
        },
        {
            "title": "Interval genomik cepat \u2192 bedtools / GenomicRanges",
            "kondisi": "Operasi wilayah (intersect, merge).",
            "alasan": "Dioptimasi untuk genom; jangan loop manual.",
            "contoh": "Varian dalam ekson (BI3).",
        },
    ],
    "aturan10": [
        "Parsing pakai library, bukan split manual.",
        "Python untuk engineering, R untuk statistik genomik.",
        "Baca vignette sebelum forum.",
        "Vektorisasi untuk batch besar.",
    ],
    "case": {
        "title": "500 Gen, Deadline Besok Pagi",
        "body": [
            "<p>Manajer meminta: GC%, panjang, dan translasi untuk 500 gen dari file GenBank \u2014 besok pagi. Magang mulai copy-paste manual. Kamu (yang baca lesson ini) punya 1 jam.</p>",
        ],
        "pertanyaan": "Tulis rencana 10 baris kode (konseptual) + estimasi waktu.",
        "pembahasan": "from Bio import SeqIO; for rec in SeqIO.parse('gen.gbk','genbank'): ambil rec.seq; hitung len, GC, translate(to_stop=True); tulis ke TSV. Estimasi: 10 menit tulis + 1 menit jalan + 10 menit validasi spot-check (5 gen manual). Total <30 menit. Sisa waktu: buat plot distribusi GC% sebagai bonus. Pelajaran: di bioinformatika, <strong>ngoding = leverage</strong>. Tugas \u201csehari\u201d manual = tugas \u201csejam\u201d dengan script \u2014 dan script-nya reusable selamanya. Inilah kenapa skill ini ada di semua lowongan.",
    },
    "quiz": [
        ("Keunggulan utama Biopython?",
         ["Paling cepat", "Multitool: Seq/SeqIO/Entrez/alignment dalam satu ekosistem Python", "Hanya untuk pemula", "Mengganti semua tool"],
         1,
         "Benar: Swiss Army Knife \u2014 cukup untuk 90% tugas harian; yang spesifik pakai tool khusus."),
        ("Bioconductor unggul di\u2026",
         ["Game development", "Statistik genomik terkurasi (DESeq2, GenomicRanges) + vignette", "Web scraping", "Sistem operasi"],
         1,
         "Benar: 2.300+ paket ter-review untuk genomik. Rumahnya analisis statistik genomik."),
        ("Jebakan indexing R vs Python?",
         ["Tidak ada beda", "R 1-based, Python 0-based \u2014 tertukar = off-by-one", "R lebih cepat", "Python tidak punya index"],
         1,
         "Benar: bug klasik proyek bilingual. Selalu sadar bahasa mana yang dipakai."),
        ("Untuk download 1.000 sekuens dari NCBI, cara profesional?",
         ["Klik satu per satu", "Entrez API via Biopython (efetch) dalam script", "Screenshot", "Minta teman"],
         1,
         "Benar: programatik = reproducible + cepat. Klik manual tidak scalable."),
        ("Kapan pakai R daripada Python?",
         ["Selalu", "Analisis statistik genomik (DE, enrichment) + visualisasi publikasi", "Tidak pernah", "Hanya untuk CSV kecil"],
         1,
         "Benar: pilih per tugas. DESeq2 di R adalah standar emas yang tidak ada tandingannya di Python."),
        ("Prinsip vektorisasi untuk 1 juta sekuens?",
         ["Loop Python murni", "Operasi batch (list comprehension/numpy) \u2014 loop murni lambat", "Satu per satu manual", "Tidak masalah"],
         1,
         "Benar: mulai dari yang benar, optimalkan bila perlu. Pola batch = pola pikir bioinformatika."),
    ],
    "rangkuman": [
        "<strong>Biopython</strong>: Seq, SeqIO, Entrez \u2014 multitool Python untuk sekuens.",
        "<strong>Bioconductor</strong>: 2.300+ paket R; rumah statistik genomik (DESeq2).",
        "<strong>Python</strong> = engineering/pipeline/ML; <strong>R</strong> = statistik/visualisasi.",
        "Proyek nyata <strong>bilingual</strong>; fanatisme bahasa = tidak produktif.",
        "Waspadai <strong>1-based (R) vs 0-based (Python)</strong>.",
        "Bangun <strong>snippet library</strong> pribadi dari tiap lesson.",
        "Baca <strong>vignette</strong> sebelum forum; pahami tiap baris.",
        "Ngoding = leverage: tugas sehari manual = sejam dengan script.",
    ],
    "prev": ("bi4-command-line", "BI4"),
    "next": ("bi6-alignment", "BI6"),
}

# ================================================================ BI6
BI6 = {
    "slug": "bi6-alignment",
    "code": "BI6",
    "track": TRACK,
    "cover_title": "Alignment &amp; BLAST:<br />Menyelaraskan Sekuens",
    "meta": META,
    "toc": [
        ("tujuan", "Tujuan Pembelajaran"),
        ("cerita", "Cerita Pembuka: Satu Huruf yang Menyelamatkan"),
        ("global", "Global vs Lokal: Needleman-Wunsch &amp; Smith-Waterman"),
        ("blosum", "Matriks Skor: BLOSUM &amp; Gap Penalty"),
        ("blast", "BLAST &amp; MSA"),
        ("miskonsepsi", "\U0001f6a8 Miskonsepsi Umum"),
        ("tips", "\U0001f4a1 Intuisi Kunci"),
        ("lab1", "\U0001f52c Lab 1: Needleman-Wunsch Manual"),
        ("lab2", "\U0001f52c Lab 2: Skor Alignment &amp; Efek Gap Penalty"),
        ("peta", "\U0001f5fa\ufe0f Peta Keputusan"),
        ("case", "\U0001f4cb Mini-Case"),
        ("quiz", "\u270f\ufe0f Quiz"),
        ("rangkum", "\U0001f4dd Rangkuman"),
    ],
    "tujuan": [
        "Membedakan <strong>alignment global vs lokal</strong> dan memilih yang tepat.",
        "Menjalankan <strong>Needleman-Wunsch</strong> manual pada sekuens pendek (dynamic programming).",
        "Menjelaskan peran <strong>matriks substitusi (BLOSUM)</strong> dan <strong>gap penalty</strong>.",
        "Menggunakan logika <strong>BLAST</strong> (seed-and-extend, E-value) dan membaca hasil MSA.",
    ],
    "story_title": "Cerita Pembuka: Satu Huruf yang Menyelamatkan",
    "story": [
        "<p>2019: sekuens virus misterius dari Wuhan di-upload ke database. Dalam hitungan jam, alignment menunjukkan ia 96% mirip virus kelelawar \u2014 bukan flu biasa. <strong>Satu alignment mengubah respons dunia.</strong> Tanpa algoritma penyelarasan sekuens, genom hanyalah huruf acak.</p>",
        "<p>Alignment adalah operasi paling fundamental bioinformatika: membandingkan dua sekuens huruf-per-huruf untuk menemukan kemiripan, perbedaan, dan hubungan evolusi. Lesson ini membedah mesinnya \u2014 dari dynamic programming klasik sampai BLAST yang mencari di lautan data.</p>",
    ],
    "konsep": [
        {
            "id": "global",
            "title": "Global vs Lokal \u2014 Dua Cara Menyelaraskan",
            "definisi": "<strong>Global (Needleman-Wunsch)</strong>: selaraskan SELURUH sekuens ujung-ke-ujung. <strong>Lokal (Smith-Waterman)</strong>: cari segmen PALING MIRIP, abaikan sisa. Keduanya memakai <strong>dynamic programming</strong>: isi matriks skor, lalu traceback.",
            "rumus": r"F(i,j) = \max \begin{cases} F(i-1,j-1) + s(x_i, y_j) \\ F(i-1,j) - d \\ F(i,j-1) - d \end{cases}",
            "simbol": [
                (r"F(i,j)", "skor terbaik alignment prefix x[1..i], y[1..j]"),
                (r"s(x_i, y_j)", "skor substitusi (match/mismatch, dari BLOSUM)"),
                (r"d", "gap penalty"),
            ],
            "interpretasi": "Rekurens ini berkata: untuk tiap sel, pilih yang terbaik dari (diagonal: sejajarkan dua huruf; atas/kiri: buka gap). Smith-Waterman menambah opsi ke-4: 0 (mulai baru \u2192 lokal). Traceback dari skor maksimum = alignment optimal.",
            "worked": (
                "\U0001f4d0 Contoh: NW untuk ACGT vs AGT (match +2, mismatch \u22121, gap \u22122)",
                "<p>Matriks 5\u00d74; isi baris-per-baris dengan rekurens.<br />"
                "Skor akhir F(4,3) = <strong>4</strong>.<br />"
                "Traceback \u2192 alignment:<br />"
                "A C G T<br />"
                "A - G T &nbsp; (gap di C; skor = 2+2+2\u22122 = 4)<br />"
                "Coba di Lab 1 dan verifikasi angkanya!</p>",
            ),
            "kepribadian": "Global itu seperti membandingkan dua buku halaman-per-halaman (untuk edisi yang mirip). Lokal itu seperti mencari kutipan yang diplagiat di antara dua buku (untuk fragmen mirip di tengah teks beda).",
            "kapan": "Sekuens seukuran & homolog \u2192 global. Cari domain/motif dalam sekuens panjang \u2192 lokal. Mapping NGS memakai varian lokal (semi-global).",
            "chart": {
                "var": "bi6MatData",
                "data": [{"z": [[4, 0, 1, 2, 4], [2, 6, 2, 3, 2], [0, 4, 8, 4, 5], [-1, 2, 6, 10, 6]], "x": ["-", "A", "G", "T"], "y": ["-", "A", "C", "G", "T"], "type": "heatmap", "colorscale": "Blues", "showscale": True}],
                "title": "Matriks DP Needleman-Wunsch: ACGT vs AGT",
                "layout": {"xaxis": {"title": "AGT"}, "yaxis": {"title": "ACGT"}, "showlegend": False},
                "cara": "Heatmap skor F(i,j). Baris = ACGT, kolom = AGT. Warna makin biru = skor makin tinggi. Jejak traceback = jalur biru tua dari kanan-bawah.",
                "interpretasi": "Skor mengalir dari kiri-atas ke kanan-bawah; jalur optimal (traceback) memilih diagonal saat huruf cocok (A-A, G-G, T-T) dan mengambil gap di C. Inilah dynamic programming secara visual: keputusan lokal optimal \u2192 solusi global optimal.",
            },
        },
        {
            "id": "blosum",
            "title": "Matriks Skor: BLOSUM &amp; Gap Penalty \u2014 Si Juri",
            "definisi": "<strong>BLOSUM62</strong>: skor substitusi asam amino dari alignment blok terkurasi \u2014 positif untuk substitusi yang sering terjadi di alam (konservatif), negatif untuk yang jarang. <strong>Gap penalty</strong>: affine (buka mahal, perpanjang murah) karena indel biologis biasanya sekaligus.",
            "kepribadian": "BLOSUM itu seperti juri yang tahu \u201cmengganti Leusin dengan Isoleusin (mirip) = pelanggaran ringan; mengganti dengan Prolin (pembengkok) = pelanggaran berat\u201d. Bukan semua mismatch sama!",
            "kapan": "Protein jauh (evolusi jauh) \u2192 BLOSUM45; dekat \u2192 BLOSUM80; default BLOSUM62. DNA \u2192 matriks sederhana (+2/\u22121 umum).",
            "worked": (
                "\U0001f4d0 Contoh: membaca BLOSUM62",
                "<p>W\u2194W = <strong>11</strong> (triptofan langka & unik \u2192 match sangat informatif).<br />"
                "L\u2194I = <strong>2</strong> (keduanya hidrofobik \u2192 substitusi wajar, skor positif!).<br />"
                "L\u2194P = <strong>\u22123</strong> (sifat beda jauh \u2192 dihukum.<br />"
                "Pelajaran: alignment protein memakai pengetahuan kimia, bukan sekadar \u201csama/tidak\u201d.</p>",
            ),
            "code_display": ("text",
                "BLOSUM62 (cuplikan):\n"
                "    A  R  N  D  C\n"
                "A   4 -1 -2 -2  0\n"
                "R  -1  5  0 -2 -3\n"
                "N  -2  0  6  1 -3\n"
                "W  -4 -3 -4 -4 11  <- match langka = skor tinggi"),
        },
        {
            "id": "blast",
            "title": "BLAST &amp; MSA \u2014 Si Pencari dan Si Rapat",
            "definisi": "<strong>BLAST</strong>: cari sekuens mirip di database raksasa via <em>seed-and-extend</em> (cocokkan kata pendek, perluas yang menjanjikan) \u2014 heuristik, 100x lebih cepat dari Smith-Waterman. <strong>E-value</strong>: jumlah hit sebaik ini yang diharapkan secara acak. <strong>MSA</strong>: selaraskan BANYAK sekuens sekaligus (Clustal/MUSCLE/MAFFT) untuk melihat posisi konservatif.",
            "rumus": r"E = K \cdot m \cdot n \cdot e^{-\lambda S}",
            "simbol": [
                (r"E", "E-value: hit acak sebaik skor S yang diharapkan"),
                (r"m, n", "panjang query dan database"),
                (r"S", "skor alignment"),
            ],
            "interpretasi": "E=10^-50 = mustahil kebetulan \u2192 homologi nyata. E=5 = bisa kebetulan \u2014 abaikan. E-value tergantung UKURAN database: database 10x lipat \u2192 E 10x besar untuk hit sama. Jangan bandingkan E-value lintas database!",
            "worked": (
                "\U0001f4d0 Contoh: membaca hasil BLAST",
                "<p>Query: gen resistensi antibiotik. Hit terbaik: E=1e-80, identitas 98%, coverage 100% \u2192 <strong>gen sama</strong>.<br />"
                "Hit kedua: E=1e-12, identitas 45% \u2192 homolog jauh, fungsi mungkin mirip.<br />"
                "Hit ketiga: E=2,3 \u2192 noise, abaikan.<br />"
                "<strong>MSA</strong> 10 homolog: kolom yang 100% konservatif (mis. situs aktif enzim) = posisi fungsional penting \u2192 mutasi di sana patut dicurigai (lihat BI1!).</p>",
            ),
            "kepribadian": "BLAST itu seperti Google untuk DNA: tidak membaca seluruh internet (terlalu lambat), tapi pakai indeks kata (seed) lalu periksa yang cocok. E-value itu seperti \u201cjumlah hasil kebetulan yang diharapkan\u201d \u2014 makin kecil makin bisa dipercaya.",
            "kapan": "Identifikasi sekuens tak dikenal, cari homolog, anotasi fungsi via kemiripan. MSA untuk evolusi, motif, dan prediksi situs fungsional.",
            "warning": "<strong>Kemiripan \u2260 fungsi sama</strong> (tapi strongly suggestive). Homolog jauh bisa neofungsionalisasi. Selalu validasi dengan bukti tambahan \u2014 BLAST adalah hipotesis, bukan vonis.",
        },
    ],
    "myths": [
        ("Persen identitas tinggi = pasti fungsi sama",
         "80% identitas biasanya aman; 30% (twilight zone) = tidak bisa disimpulkan fungsi. Paralog (duplikasi gen) bisa sangat mirip tapi beda fungsi. Cek: coverage penuh? domain konservatif? bukti eksperimental?"),
        ("E-value kecil selalu berarti penting secara biologis",
         "E-value mengukur signifikansi statistik, bukan biologis. Hit dengan E=1e-100 tapi hanya 20 basa = mungkin repeat/artefak. Lihat juga identitas, coverage, dan konteks."),
        ("Alignment terbaik = kebenaran evolusi",
         "Alignment optimal menurut SKOR, bukan menurut sejarah. Skor tergantung matriks + gap penalty yang kamu pilih. Untuk klaim evolusi, butuh model filogenetik (BI7), bukan sekadar alignment."),
    ],
    "tips": [
        "Untuk BLAST: perhatikan <strong>query coverage</strong> selain E-value. Hit 100% identik tapi hanya 10% query = domain kecil, bukan gen sama.",
        "Pilih algoritma sesuai ukuran: <strong>2 sekuens</strong> \u2192 NW/SW; <strong>database raksasa</strong> \u2192 BLAST; <strong>banyak sekuens</strong> \u2192 MSA (MAFFT untuk besar).",
        "Selalu <strong>mask repeat/low-complexity</strong> sebelum BLAST genomik. Tanpa itu, hit didominasi sampah repetitif.",
    ],
    "labs": [
        {
            "id": "lab1",
            "title": "\U0001f52c Lab 1: Needleman-Wunsch dari Nol",
            "intro": "Implementasi NW lengkap: isi matriks DP + traceback. Verifikasi contoh ACGT vs AGT dari lesson (skor harus 4).",
            "hint": "Ubah gap penalty -2 \u2192 -5. Apakah alignment berubah? Gap mahal = alignment lebih suka mismatch. Inilah sensitivitas parameter.",
            "code": (
                "def needleman_wunsch(x, y, match=2, mismatch=-1, gap=-2):\n"
                "    n, m = len(x), len(y)\n"
                "    F = [[0]*(m+1) for _ in range(n+1)]\n"
                "    for i in range(1, n+1): F[i][0] = i*gap\n"
                "    for j in range(1, m+1): F[0][j] = j*gap\n"
                "    for i in range(1, n+1):\n"
                "        for j in range(1, m+1):\n"
                "            s = match if x[i-1] == y[j-1] else mismatch\n"
                "            F[i][j] = max(F[i-1][j-1]+s, F[i-1][j]+gap, F[i][j-1]+gap)\n"
                "    # traceback\n"
                "    ax, ay, i, j = [], [], n, m\n"
                "    while i > 0 or j > 0:\n"
                "        s = match if (i>0 and j>0 and x[i-1]==y[j-1]) else mismatch\n"
                "        if i>0 and j>0 and F[i][j] == F[i-1][j-1]+s:\n"
                "            ax.append(x[i-1]); ay.append(y[j-1]); i-=1; j-=1\n"
                "        elif i>0 and F[i][j] == F[i-1][j]+gap:\n"
                "            ax.append(x[i-1]); ay.append('-'); i-=1\n"
                "        else:\n"
                "            ax.append('-'); ay.append(y[j-1]); j-=1\n"
                "    return F[n][m], ''.join(ax[::-1]), ''.join(ay[::-1])\n"
                "skor, a1, a2 = needleman_wunsch('ACGT', 'AGT')\n"
                "print(f'skor = {skor} (harus 4)')\n"
                "print(a1)\n"
                "print(a2)\n"
                "print()\n"
                "print('Coba: needleman_wunsch(\"GATTACA\", \"GCATGCU\")')"
            ),
        },
        {
            "id": "lab2",
            "title": "\U0001f52c Lab 2: Efek Gap Penalty &amp; Matriks Skor",
            "intro": "Bandingkan alignment dua sekuens protein pendek dengan BLOSUM sederhana vs match/mismatch seragam. Lihat substitusi konservatif dihargai.",
            "hint": "Ganti L\u2192I (konservatif) vs L\u2192P (radikal) pada sekuens. Dengan BLOSUM, yang pertama hampir tidak dihukum \u2014 dengan skema seragam, keduanya sama. Itulah nilai matriks biologis.",
            "code": (
                "# BLOSUM mini: substitusi konservatif dihargai\n"
                "blosum_mini = {('L','I'): 2, ('I','L'): 2, ('L','P'): -3, ('P','L'): -3}\n"
                "def skor(a, b, matriks=None):\n"
                "    if a == b: return 4\n"
                "    if matriks: return matriks.get((a,b), -2)\n"
                "    return -1  # seragam\n"
                "def skor_alignment(s1, s2, matriks=None):\n"
                "    return sum(skor(a, b, matriks) for a, b in zip(s1, s2))\n"
                "s1, s2 = 'MLI', 'MII'  # L->I konservatif\n"
                "s3 = 'MPI'             # L->P radikal\n"
                "print(f'MLI vs MII: seragam={skor_alignment(s1,s2)}, BLOSUM={skor_alignment(s1,s2,blosum_mini)}')\n"
                "print(f'MLI vs MPI: seragam={skor_alignment(s1,s3)}, BLOSUM={skor_alignment(s1,s3,blosum_mini)}')\n"
                "print()\n"
                "print('Skema seragam: kedua substitusi = -1 (buta kimia).')\n"
                "print('BLOSUM: L->I = +2 (wajar), L->P = -3 (radikal).')\n"
                "print('Biologi > matematika buta.')"
            ),
        },
    ],
    "decision_map": [
        {
            "title": "Dua sekuens seukuran & homolog \u2192 Needleman-Wunsch",
            "kondisi": "Bandingkan gen lengkap antar spesies dekat.",
            "alasan": "Optimal global; sederhana.",
            "contoh": "Gen insulin manusia vs tikus.",
        },
        {
            "title": "Cari motif/domain dalam sekuens panjang \u2192 Smith-Waterman / lokal",
            "kondisi": "Hanya segmen yang mirip.",
            "alasan": "Global akan memaksa alignment sampah di ujung.",
            "contoh": "Domain kinase dalam protein besar.",
        },
        {
            "title": "Cari di database raksasa \u2192 BLAST",
            "kondisi": "Query vs jutaan sekuens.",
            "alasan": "Heuristik seed-and-extend: cepat dengan sensitivitas cukup.",
            "contoh": "Identifikasi sekuens virus misterius.",
        },
        {
            "title": "Banyak sekuens, lihat konservasi \u2192 MSA (MAFFT/MUSCLE)",
            "kondisi": ">3 sekuens; butuh kolom konservatif.",
            "alasan": "Reveals posisi fungsional; input filogenetika.",
            "contoh": "MSA 50 sekuens spike protein.",
            "chart": {
                "var": "bi6SpeedData",
                "data": [{"x": ["Smith-Waterman", "BLAST"], "y": [100, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["100x", "1x"], "textposition": "outside"}],
                "title": "Waktu Relatif: SW vs BLAST (database besar)",
                "layout": {"xaxis": {"title": "Algoritma"}, "yaxis": {"title": "Waktu relatif", "type": "log"}, "showlegend": False},
                "cara": "Perbandingan waktu pencarian satu query di database besar.",
                "interpretasi": "BLAST ~100x lebih cepat karena heuristik seed \u2014 dengan mengorbankan jaminan optimalitas. Untuk database raksasa, SW eksak tidak praktis. Inilah trade-off fundamental: kecepatan vs jaminan.",
            },
        },
    ],
    "aturan10": [
        "Global untuk seukuran; lokal untuk motif.",
        "BLOSUM untuk protein; bukan semua mismatch sama.",
        "E-value kecil + coverage penuh = percaya.",
        "Kemiripan = hipotesis, bukan vonis fungsi.",
    ],
    "case": {
        "title": "Gen Resistensi yang \u201cDitemukan\u201d",
        "body": [
            "<p>RS menemukan bakteri resisten. Sekuensing satu gen \u2192 BLAST \u2192 hit 99% identitas ke gen resistensi di database, E=1e-120. Tim menyimpulkan: \u201cbakteri ini resisten via gen X\u201d dan mengganti antibiotik.</p>",
            "<p>Reviewer bertanya: (1) coverage query berapa? (2) apakah gen X memang fungsional (bukan pseudogen)? (3) apakah fenotipe resistensi diuji di lab?</p>",
        ],
        "pertanyaan": "Evaluasi kesimpulan tim dan lengkapi buktinya.",
        "pembahasan": "BLAST saja tidak cukup untuk vonis fungsional. (1) Coverage: bila hanya 30% query ter-align, itu domain umum bukan gen utuh. (2) Cek frameshift/stop prematur \u2014 pseudogen mirip tapi mati (lihat BI1!). (3) Uji fenotipe (MIC) adalah bukti emas; genotipe tanpa fenotipe = prediksi. (4) Cek konteks genomik: gen di plasmid (mobile) vs kromosom. Kesimpulan benar: \u201ckandidat gen X terdeteksi; butuh uji MIC + cek integritas ORF sebelum ganti terapi.\u201d Pelajaran: alignment memberi hipotesis tercepat di dunia \u2014 tapi hipotesis tetap harus diuji.",
    },
    "quiz": [
        ("Kapan pakai Smith-Waterman (lokal) bukan Needleman-Wunsch?",
         ["Selalu", "Mencari segmen mirip (domain/motif) dalam sekuens panjang yang berbeda", "Tidak pernah", "Hanya untuk DNA"],
         1,
         "Benar: lokal mengabaikan sisa sekuens. Global memaksa ujung-ke-ujung \u2014 buruk untuk fragmen."),
        ("Dalam rekurens DP, opsi F(i-1,j) \u2212 d artinya\u2026",
         ["Match", "Buka/perpanjang gap di sekuens y (huruf x[i] tidak punya pasangan)", "Selesai", "Mismatch"],
         1,
         "Benar: gerakan vertikal = gap. Tiga opsi = diagonal (sejajarkan), atas/bawah (gap)."),
        ("BLOSUM62 memberi L\u2194I skor +2 karena\u2026",
         ["Kebetulan", "Keduanya hidrofobik \u2014 substitusi konservatif yang sering terjadi di alam", "Hurufnya mirip", "Selalu positif"],
         1,
         "Benar: matriks dari data evolusi nyata. Tidak semua mismatch sama \u2014 kimia menentukan."),
        ("E-value = 1e-50 vs E-value = 3. Yang dipercaya?",
         ["E=3", "E=1e-50 (mustahil kebetulan)", "Sama", "Tidak ada"],
         1,
         "Benar: E = hit acak yang diharapkan. 1e-50 = praktis mustahil acak \u2192 homologi nyata."),
        ("BLAST 100x lebih cepat dari Smith-Waterman karena\u2026",
         ["Komputer lebih cepat", "Heuristik seed-and-extend: hanya periksa kandidat menjanjikan", "Database kecil", "Sihir"],
         1,
         "Benar: korbankan jaminan optimalitas demi kecepatan. Untuk DB raksasa, ini satu-satunya cara praktis."),
        ("Hit BLAST 100% identitas tapi query coverage 15%. Interpretasi?",
         ["Gen sama persis", "Hanya domain kecil yang cocok \u2014 bukan bukti gen sama; cek coverage!", "Pasti fungsional", "Abaikan E-value"],
         1,
         "Benar: coverage sama pentingnya dengan identitas. Domain umum (mis. ATP-binding) ada di ratusan protein berbeda."),
    ],
    "rangkuman": [
        "<strong>Global (NW)</strong>: ujung-ke-ujung; <strong>lokal (SW)</strong>: segmen terbaik; keduanya DP + traceback.",
        "Rekurens: max(diagonal + substitusi, atas/kiri \u2212 gap).",
        "<strong>BLOSUM</strong>: skor dari evolusi nyata; tidak semua mismatch sama.",
        "<strong>Gap affine</strong>: buka mahal, perpanjang murah.",
        "<strong>BLAST</strong>: seed-and-extend; <strong>E-value</strong> = hit acak yang diharapkan.",
        "Cek <strong>identitas + coverage + konteks</strong> sebelum vonis.",
        "<strong>MSA</strong>: kolom konservatif = posisi fungsional.",
        "Kemiripan = hipotesis tercepat; validasi = kewajiban.",
    ],
    "prev": ("bi5-biopython-r", "BI5"),
    "next": ("bi7-filogenetika", "BI7"),
}

LESSONS = [BI1, BI2, BI3, BI4, BI5, BI6]
for L in LESSONS:
    qa_scan(L)
