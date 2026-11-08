import type { V2Lesson } from "../lib/types";

export const bi3: V2Lesson = {
  slug: "bi3-format-data",
  track: "Bioinformatika",
  module: "Fondasi",
  title: "BI3 · FASTA, FASTQ, VCF: Format File Genomik",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "File 100 GB yang salah dibaca",
      prose: [
        "Analis menerima file sekuensing 100 GB. Ia membukanya di Excel. Excel memotong baris, mengubah “MARC1” menjadi tanggal, dan merusak skor kualitas. Tiga hari komputasi cluster menghasilkan varian sampah — karena satu langkah: format dibaca dengan alat yang salah.",
        "Format file genomik terlihat seperti teks biasa, tapi tiap format punya kontrak ketat: baris apa artinya apa, koordinat mulai dari 0 atau 1, strand mana. Twist-nya: kesalahan format paling mahal justru yang tidak error. Program tetap jalan, angka tetap keluar — tapi koordinat 0-based dibaca sebagai 1-based, dan varian penyebab penyakit hilang satu basa dari laporan. Tidak ada pesan error; hanya diagnosis yang meleset diam-diam.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan dua kerusakan yang dilakukan Excel pada file genomik" },
        { id: "t2", text: "Jelaskan kenapa “tidak error” justru lebih berbahaya" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membuka atau mengedit file genomik di Excel/Word. Excel mengubah ID gen menjadi tanggal (MARC1 → 1-Mar) dan memotong baris panjang; Word menambah formatting tersembunyi. Pakai head/less untuk melihat, Python untuk memproses.",
      },
      reference: "Format = kontrak. Salah baca kontrak = salah sains tanpa protes.",
    },
    {
      id: "lab-fasta-fastq",
      eyebrow: "Langkah 2 · Lab",
      title: "Parse FASTA dan FASTQ manual",
      prose: [
        "FASTA: sekuens + header (`>`). FASTQ: sekuens + kualitas per basa — 4 baris per read. Baris kualitas memakai skor Phred dalam ASCII: `Q = -10 log10(P)`, sehingga Q30 berarti peluang error 0,001 (1 per 1.000 basa).",
        "Karakter 'I' = ASCII 73 − 33 = Q40. Inilah kenapa FASTQ sekitar 4x lebih besar dari FASTA: tiap huruf membawa catatan kaki kepercayaannya.",
      ],
      formula: String.raw`Q = -10 \log_{10}(P)`,
      formulaNote: "Skor Phred: Q = −10 × log10(P), dengan P = peluang basa salah. Tiap +10 Q = 10x lebih akurat: Q20 → 1% error, Q30 → 0,1%, Q40 → 0,01%. Q30 adalah ambang standar “basa terpercaya”.",
      tasks: [
        { id: "t1", text: "Parse `fasta` menjadi dict `seqs`, hitung panjang dan GC%" },
        { id: "t2", text: "Untuk tiap read FASTQ, hitung rata-rata kualitas" },
        { id: "t3", text: "Tandai read dengan Q rata-rata < 30 sebagai BURUK" },
      ],
      expected: "genA: panjang=15, GC=47% · R1 BAGUS · R2 BURUK",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira Q30 berarti sekuensing sempurna. Q30 = 99,9% per basa, tapi 3 miliar basa × 0,1% = 3 juta error. Inilah kenapa butuh coverage 30x dan variant caller probabilistik — satu bacaan tidak pernah cukup.",
      },
      hints: [
        "Baris diawali '>' = header baru; baris lain = sambungan sekuens.",
        "Kualitas per basa = ord(huruf) - 33; rata-rata = jumlah / panjang.",
        "FASTQ: 4 baris per read — nama, sekuens, '+', kualitas.",
      ],
      code: {
        starter: `fasta = '>genA\\nATGCGTTAGCCGTAA\\n>genB\\nATATATGGCC\\n'\nfastq = ['@R1', 'ACGTACGT', '+', 'IIIIIIII',\n         '@R2', 'TTTTGGGG', '+', '######II']\n\n# TULIS KODEMU: parse FASTA -> seqs {nama: sekuens}\nseqs = {}\nnama = None\nfor baris in fasta.strip().split('\\n'):\n    pass  # ganti dengan logikamu\n\nfor n, s in seqs.items():\n    gc = (s.count('G') + s.count('C')) / len(s) * 100\n    print(f'{n}: panjang={len(s)}, GC={gc:.0f}%')\n\n# TULIS KODEMU: nilai kualitas tiap read FASTQ\nfor i in range(0, len(fastq), 4):\n    read, quals = fastq[i], fastq[i+3]\n    qmean = \n    status = \n    print(f'{read}: Q rata-rata={qmean:.0f} {status}')`,
        lockLines: 3,
        solution: `fasta = '>genA\\nATGCGTTAGCCGTAA\\n>genB\\nATATATGGCC\\n'\nfastq = ['@R1', 'ACGTACGT', '+', 'IIIIIIII',\n         '@R2', 'TTTTGGGG', '+', '######II']\n\n# TULIS KODEMU: parse FASTA -> seqs {nama: sekuens}\nseqs = {}\nnama = None\nfor baris in fasta.strip().split('\\n'):\n    if baris.startswith('>'):\n        nama = baris[1:]\n        seqs[nama] = ''\n    else:\n        seqs[nama] += baris.strip()\n\nfor n, s in seqs.items():\n    gc = (s.count('G') + s.count('C')) / len(s) * 100\n    print(f'{n}: panjang={len(s)}, GC={gc:.0f}%')\n\n# TULIS KODEMU: nilai kualitas tiap read FASTQ\nfor i in range(0, len(fastq), 4):\n    read, quals = fastq[i], fastq[i+3]\n    qmean = sum(ord(c) - 33 for c in quals) / len(quals)\n    status = 'BAGUS' if qmean >= 30 else 'BURUK -> buang di QC'\n    print(f'{read}: Q rata-rata={qmean:.0f} {status}')`,
        checks: [
          { kind: "equal", task: "t1", name: "seqs", value: { genA: "ATGCGTTAGCCGTAA", genB: "ATATATGGCC" }, label: "`seqs` terparse benar", msg: "Header diawali '>'; sekuens bisa multi-baris — sambung, jangan timpa." },
          { kind: "stdout_matches", task: "t1", pattern: "genA: panjang=15, GC=47%", label: "`print` genA benar", msg: "genA = ATGCGTTAGCCGTAA (15 basa, 7 G/C = 47%)." },
          { kind: "stdout_matches", task: "t3", pattern: "@R2: Q rata-rata=\\d+ BURUK", label: "R2 ditandai BURUK", msg: "'######II' → rata-rata 11.5, di bawah 30. Cek rumus ord(c)-33 dan ambang status." },
        ],
      },
      reference: "FASTA = sekuens; FASTQ = sekuens + kualitas (4 baris/read). Q = -10 log10(P).",
    },
    {
      id: "lab-vcf",
      eyebrow: "Langkah 3 · Lab",
      title: "Parse dan filter VCF",
      prose: [
        "VCF adalah katalog varian: tiap baris = posisi, alel referensi/alternatif, kualitas (QUAL), kedalaman (DP), genotipe per sampel (GT). GT 0/1 = heterozigot, 1/1 = homozigot alternatif, 0/0 = homozigot referensi.",
        "Filter praktis: QUAL ≥ 30 dan DP ≥ 10. Lalu hitung rasio Ts/Tv (transisi vs transversi) sebagai QC — untuk WGS manusia harapannya sekitar 2; jauh dari itu, curigai artefak.",
      ],
      tasks: [
        { id: "t1", text: "Parse tiap baris VCF, ekstrak QUAL, DP, GT" },
        { id: "t2", text: "Terapkan filter QUAL≥30 dan DP≥10" },
        { id: "t3", text: "Hitung rasio Ts/Tv dari varian yang lolos" },
      ],
      expected: "3 varian lolos · Ts/Tv = 2/0",
      hints: [
        "DP ada di dalam string info: int(info.split('=')[1]).",
        "Transisi = {(A,G),(G,A),(C,T),(T,C)}; hanya untuk SNP 1-basa.",
        "Indel (len != 1) jangan masuk hitungan Ts/Tv.",
      ],
      code: {
        starter: `vcf = [\n    ('chr1', 12345, 'A', 'G', 99, 'DP=30', '0/1'),\n    ('chr1', 67890, 'CT', 'C', 45, 'DP=22', '1/1'),\n    ('chr2', 11111, 'G', 'T', 12, 'DP=5', '0/1'),\n    ('chr2', 22222, 'C', 'T', 80, 'DP=40', '0/0'),\n]\ntransisi = {('A','G'),('G','A'),('C','T'),('T','C')}\n\n# TULIS KODEMU: filter + Ts/Tv\nlolos = []\nfor chrom, pos, ref, alt, qual, info, gt in vcf:\n    dp = \n    if qual >= 30 and dp >= 10:\n        lolos.append((ref, alt))\n        print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} LOLOS')\n    else:\n        print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} SARING')\n\nts = sum(1 for r, a in lolos if (r, a) in transisi and len(r) == len(a) == 1)\ntv = \nprint(f'Ts/Tv = {ts}/{tv} (harapan ~2.0 untuk WGS)')`,
        lockLines: 6,
        solution: `vcf = [\n    ('chr1', 12345, 'A', 'G', 99, 'DP=30', '0/1'),\n    ('chr1', 67890, 'CT', 'C', 45, 'DP=22', '1/1'),\n    ('chr2', 11111, 'G', 'T', 12, 'DP=5', '0/1'),\n    ('chr2', 22222, 'C', 'T', 80, 'DP=40', '0/0'),\n]\ntransisi = {('A','G'),('G','A'),('C','T'),('T','C')}\n\n# TULIS KODEMU: filter + Ts/Tv\nlolos = []\nfor chrom, pos, ref, alt, qual, info, gt in vcf:\n    dp = int(info.split('=')[1])\n    if qual >= 30 and dp >= 10:\n        lolos.append((ref, alt))\n        print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} LOLOS')\n    else:\n        print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} SARING')\n\nts = sum(1 for r, a in lolos if (r, a) in transisi and len(r) == len(a) == 1)\ntv = sum(1 for r, a in lolos if (r, a) not in transisi and len(r) == len(a) == 1)\nprint(f'Ts/Tv = {ts}/{tv} (harapan ~2.0 untuk WGS)')`,
        checks: [
          { kind: "equal", task: "t2", name: "lolos", value: [["A", "G"], ["CT", "C"], ["C", "T"]], label: "3 varian lolos filter", msg: "QUAL≥30 dan DP≥10: baris 1 (99/30), 2 (45/22), 4 (80/40) lolos; baris 3 (12/5) tersaring." },
          { kind: "stdout_matches", task: "t3", pattern: "Ts/Tv = 2/0", label: "`print` Ts/Tv benar", msg: "A→G dan C→T = transisi; indel CT→C tidak dihitung." },
        ],
      },
      reference: "VCF: QUAL, DP, GT. Filter QUAL≥30, DP≥10. Ts/Tv ~2 = QC manusia.",
    },
    {
      id: "jebakan-koordinat",
      eyebrow: "Langkah 4 · Jebakan",
      title: "0-based vs 1-based: bug satu basa",
      prose: [
        "Dua konvensi koordinat hidup berdampingan. 1-based fully-closed (VCF, GFF): posisi pertama = 1, interval [5,8] mencakup basa 5–8. 0-based half-open (BED): posisi pertama = 0, interval [4,8) mencakup basa 5–8 — posisi yang sama, angka yang beda.",
        "Konversi tanpa sadar = geser 1 basa. Varian di batas ekson (splice site — justru yang penting!) terlempar keluar intersect, dan tidak ada error yang muncul. Jebakan kedua: nama kromosom. Ensembl pakai “1”, UCSC pakai “chr1” — intersect mencocokkan string persis, “1” ≠ “chr1”, hasil nol diam-diam.",
        "Aturan kerja: tiap kali menulis atau membaca interval, tulis di komentar konvensinya — “0-based half-open” atau “1-based closed”. Tiga kata yang menyelamatkan diagnosis.",
      ],
      tasks: [
        { id: "t1", text: "Konversi posisi VCF 117.559.593 (1-based) menjadi interval BED ±10 basa" },
        { id: "t2", text: "Sebutkan dua penyebab intersect mengembalikan 0 hasil tanpa error" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap semua format koordinat genomik sama. BED 0-based vs VCF/GFF 1-based: beda 1 basa = varian keluar dari ekson = kesimpulan salah. Selalu verifikasi konvensi sebelum operasi interval.",
      },
      reference: "BED: 0-based half-open · VCF/GFF: 1-based closed · samakan prefix chr.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Varian “hilang” karena off-by-one",
      prose: [
        "Tim mengintersect VCF varian pasien dengan file BED ekson untuk mencari mutasi coding. Hasil: NOL varian coding — padahal pasien jelas punya penyakit genetik.",
        "Audit: file BED memakai konvensi 0-based, tapi script intersect mengasumsikan 1-based. Semua interval geser 1 basa — varian di batas ekson terlewat. Forensik lanjut menemukan dua jebakan lagi: nama kromosom “7” vs “chr7”, dan assembly GRCh37 vs GRCh38 yang menggeser koordinat ratusan ribu basa.",
        "SOP pencegahannya: dokumentasikan konvensi tiap file; pakai library teruji (bedtools) bukan intersect manual; uji dengan positive control — varian yang HARUS kena intersect; spot-check di IGV. Bug 1 basa = hasil nol besar. Di bioinformatika, paranoia terhadap koordinat adalah kebajikan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan mekanisme bug off-by-one pada kasus ini" },
        { id: "t2", text: "Sebutkan 4 cek wajib “protokol file asing” sebelum memakai file kolaborator" },
      ],
      reference: "Protokol file asing: format+versi, konvensi chr, assembly, 0/1-based.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Format apa untuk tahap apa",
      prose: [
        "Butuh referensi atau sekuens gen → FASTA. Ringan, universal.",
        "Data mentah sekuenser (butuh kualitas per basa) → FASTQ. Satu-satunya yang menyimpan kualitas; input QC.",
        "Hasil mapping (posisi tiap read, visualisasi IGV) → BAM (+ index BAI). Terkompresi dan terindeks.",
        "Daftar varian untuk analisis downstream → VCF. Standar; menyimpan genotipe per sampel.",
        "Interval genomik dan anotasi → BED (ringan, 0-based!) atau GFF (kaya anotasi). Untuk intersect pakai bedtools.",
        "Skala operasional: FASTQ mentah mendominasi (~100 GB per WGS); VCF akhir hanya ~1 GB. Simpan FASTQ terkompresi; yang diarsip jangka panjang biasanya BAM + VCF.",
      ],
      tasks: [
        { id: "t1", text: "Untuk input FastQC/trimming, pilih formatnya" },
        { id: "t2", text: "Untuk intersect varian vs ekson, pilih format + alatnya" },
      ],
      reference: "FASTA ref · FASTQ mentah · BAM mapping · VCF varian · BED/GFF interval.",
    },
    {
      id: "adv-sam-flags",
      eyebrow: "Langkah 7 · Advanced",
      title: "Membaca SAM/BAM: flag bitwise dan jebakan MAPQ",
      prose: [
        "Kolom FLAG di SAM adalah bilangan bulat yang mengodekan belasan properti sekaligus dalam bit — 99 berarti read terpetakan sebagai pasangan yang proper (1 + 2 + 32 + 64), 147 adalah pasangannya di reverse strand, 4 berarti unmapped, 256 secondary alignment, 1024 PCR/optical duplicate. Analis senior membaca flag seperti membaca plat nomor: `samtools view -f 2` (hanya proper pair) vs `-F 1024` (buang duplikat) adalah dua filter paling sering dipakai sebelum variant calling. Salah membaca flag = menganalisis sampah dengan percaya diri.",
        "MAPQ (mapping quality) memakai skala Phred yang sama seperti skor basa: MAPQ 60 berarti peluang salah petakan 1 per sejuta, MAPQ 0 berarti “tidak tahu” — biasanya read yang terpetakan ke banyak tempat (multimapper, mis. daerah repetitif atau gen keluarga). Mode kegagalan klasik: variant caller yang diberi read MAPQ 0 memanggil varian palsu di daerah repetitif. Aturan praktis: filter MAPQ ≥ 20–30 untuk variant calling germline; untuk RNA-seq, biarkan quantifier (Salmon/kallisto) yang menangani multimapper secara probabilistik.",
        "Kolom CIGAR menceritakan bentuk alignment: 100M (100 basa match), 50M2D50M (delesi 2 basa di tengah), 10S90M (10 basa soft-clip di awal — adaptor atau splice junction). Soft-clip yang menumpuk di posisi yang sama pada banyak read adalah tanda splice junction (RNA-seq) atau breakpoint struktural — bukan noise untuk dibuang.",
        "Aturan keputusan: sebelum analisis apa pun, jalankan `samtools flagstat` (berapa % terpetakan, proper pair, duplikat) dan `samtools stats`. Angka-angka ini adalah “tanda vital” BAM-mu: proper-pair < 80% atau duplikasi > 20% pada WGS adalah alasan untuk berhenti dan menyelidiki, bukan untuk lanjut dengan harapan.",
      ],
      tasks: [
        { id: "t1", text: "Decode flag 83 menjadi komponen bitnya dan jelaskan artinya" },
        { id: "t2", text: "Jelaskan kenapa read MAPQ 0 berbahaya untuk variant calling" },
      ],
      reference: "FLAG bitwise: 99/147 proper pair · MAPQ 0 = multimapper · CIGAR S = soft-clip (splice/breakpoint).",
    },
    {
      id: "adv-vcf-dalam",
      eyebrow: "Langkah 8 · Advanced",
      title: "VCF dalam: INFO, FORMAT, dan validasi sebelum percaya",
      prose: [
        "Kolom INFO milik varian (satu baris), kolom FORMAT milik tiap sampel. INFO yang wajib dipahami: AF (frekuensi alel), DP (kedalaman total), MQ (kualitas pemetaan rata-rata), QD (kualitas per kedalaman — < 2 curiga). FORMAT yang wajib dipahami: GT (genotipe: 0/1 heterozigot, 1/1 homozigot alt), AD (kedalaman per alel, mis. 15,12), DP, GQ (kualitas genotipe), PL (phred likelihood tiga genotipe). Varian dengan GQ < 20 atau alel balance jauh dari 50:50 pada heterozigot (mis. 45:2) adalah kandidat artefak.",
        "Edge case yang menjebak: genotipe `./.` berarti missing (tidak ada data), bukan referensi — analis yang menghitungnya sebagai homozigot ref mengecilkan frekuensi alel secara sistematis. Genotipe phased memakai `|` (0|1) vs unphased `/` (0/1): hanya `|` yang boleh dipakai untuk analisis haplotipe. Varian multialelik (ALT = A,G) memecah AD menjadi tiga angka — parser yang mengasumsikan selalu dua alel akan crash atau, lebih buruk, salah hitung diam-diam.",
        "Protokol validasi sebelum analisis: `bcftools stats` memberi ringkasan yang dibaca dalam 30 detik — rasio transisi/transversi (Ts/Tv) ~2,0–2,1 untuk WGS manusia dan ~2,8–3,0 untuk exome; Ts/Tv yang jauh menyimpang (mis. 1,2) adalah sirene artefak atau kontaminasi. Cek juga jumlah varian per sampel dan distribusi QUAL. File VCF yang “lolos tanpa error” tapi Ts/Tv-nya aneh adalah bom waktu.",
        "Aturan keputusan: filter keras standar GATK untuk SNP — QD < 2, MQ < 40, FS > 60, SOR > 3 — adalah titik awal yang wajar, bukan kitab suci. Untuk exome dengan target kecil, sesuaikan; untuk data tumor-normal, pakai filter yang berbeda lagi. Dan selalu: validasi dulu (`bcftools stats`, cek header contig cocok dengan referensi), analisis kemudian.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan `./.` dengan `0/0` dan bahaya mencampurnya" },
        { id: "t2", text: "VCF dengan Ts/Tv = 1,3. Apa kesimpulan dan tindak lanjutmu?" },
      ],
      reference: "INFO = milik varian · FORMAT = milik sampel · Ts/Tv WGS ~2,0 · validasi dulu, analisis kemudian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: format file adalah kontrak, bukan sekadar wadah",
        body: "Tiga heuristik praktisi untuk selamat dari rimba format genomik. Pertama, setiap format adalah kontrak dengan asumsi tersembunyi: VCF 1-based closed, BED 0-based half-open, GFF 1-based; SAM mensyaratkan header SQ cocok dengan referensi. Sebelum memakai file asing, verifikasi kontraknya (bcftools stats, samtools quickcheck) — jangan percaya ekstensi filenya. Kedua, “tidak error” adalah kondisi paling berbahaya: parser yang diam-diam salah (koordinat bergeser 1, missing dihitung sebagai referensi, strand terbalik) menghasilkan jawaban yang rapi dan salah. Selalu punyai satu angka kewarasan yang independen — Ts/Tv, jumlah varian ekspektasi, atau spot-check manual 5 baris. Ketiga, untuk format biner (BAM/CRAM), jangan pernah edit manual: pakai perkakas yang menghormati indeks dan header (samtools, picard). Satu BAM yang headernya tidak sinkron dengan isinya akan memberi hasil yang terlihat benar di semua tool — sampai reviewer menemukan duplikat yang tidak terdeteksi.",
      },
      summary: [
        "FASTA: sekuens; FASTQ: sekuens + kualitas (Q = −10 log P).",
        "SAM/BAM: hasil mapping (posisi, CIGAR, MAPQ).",
        "VCF: katalog varian (QUAL, DP, GT); filter QUAL≥30, DP≥10.",
        "BED 0-based half-open vs VCF/GFF 1-based — waspadai off-by-one.",
        "Jangan buka di Excel; parse dengan library; stream file besar.",
        "Ts/Tv ~2 sebagai QC variant calling manusia.",
      ],
      next: { label: "BI4 · Terminal, Git & Nextflow", href: "/v2/learn/bi4-command-line" },
      quiz: [
        {
          q: "Read dengan flag 4 dan MAPQ 255 muncul di BAM-mu. Artinya?",
          options: [
            { text: "Read terpetakan sempurna dengan kualitas tertinggi", why: "Salah: flag 4 = UNMAPPED. MAPQ 255 pada read unmapped tidak berarti apa-apa." },
            { text: "Read tidak terpetakan — keluarkan dari analisis variant calling", why: "Flag 4 = segmen tidak terpetakan. Read ini tidak membawa informasi posisi.", correct: true },
            { text: "Read duplikat PCR", why: "Duplikat ditandai flag 1024, bukan 4." },
            { text: "Read secondary alignment", why: "Secondary = flag 256. Flag 4 spesifik berarti unmapped." },
          ],
        },
        {
          q: "Di kolom FORMAT, sampel bergenotipe `./.` untuk sebuah SNP. Perlakuan yang benar?",
          options: [
            { text: "Hitung sebagai homozigot referensi (0/0)", why: "Salah dan berbahaya: missing ≠ referensi. Ini mengecilkan frekuensi alel secara sistematis." },
            { text: "Perlakukan sebagai data hilang — keluarkan dari perhitungan frekuensi", why: "./.  berarti tidak ada data genotipe. Hanya individu dengan genotipe terpanggil yang masuk hitungan.", correct: true },
            { text: "Isi dengan genotipe paling umum di populasi", why: "Imputasi butuh model dan panel referensi — tidak boleh asal mengisi." },
            { text: "Buang seluruh variannya dari VCF", why: "Terlalu kasar: satu sampel missing bukan alasan membuang varian untuk semua sampel." },
          ],
        },
        {
          q: "Banyak read RNA-seq menunjukkan CIGAR 10S90M (10 basa soft-clip di awal) menumpuk di posisi genom yang sama. Interpretasi?",
          options: [
            { text: "Adaptor — trim semua soft-clip tanpa pandang bulu", why: "Soft-clip menumpuk di posisi sama = sinyal biologi, bukan kontaminasi acak." },
            { text: "Kemungkinan splice junction — verifikasi ke anotasi sebelum membuang", why: "Soft-clip konsisten di satu lokus adalah tanda klasik sambungan ekson pada RNA-seq.", correct: true },
            { text: "Read rusak — buang semuanya", why: "Membuang berarti menghilangkan justru read yang paling informatif (junction-spanning)." },
            { text: "Duplikat PCR — tandai dengan Picard", why: "Duplikat ditandai via koordinat + UMI/flag, bukan via pola CIGAR." },
          ],
        },
        {
          q: "Q30 artinya…",
          options: [
            { text: "30% error", why: "Q bukan persen; Q30 justru berarti error sangat kecil." },
            { text: "P(error) = 0,001 (1 per 1.000 basa)", why: "Q = −10 log10(P). Q30 = 99,9% akurat per basa — tapi tetap butuh coverage ganda.", correct: true },
            { text: "30 basa berkualitas", why: "Q tidak menghitung jumlah basa." },
            { text: "Kualitas 30%", why: "Skalanya logaritmik, bukan persen linear." },
          ],
        },
        {
          q: "Perbedaan FASTA vs FASTQ?",
          options: [
            { text: "Tidak ada", why: "Ada: baris kualitas per basa hanya di FASTQ." },
            { text: "FASTQ menyimpan skor kualitas per basa (4 baris/read); FASTA hanya sekuens", why: "Kualitas = alasan FASTQ 4x lebih besar dan menjadi input QC.", correct: true },
            { text: "FASTQ lebih kecil", why: "Sebaliknya: FASTQ jauh lebih besar karena baris kualitas." },
            { text: "FASTA untuk varian", why: "Varian disimpan di VCF, bukan FASTA." },
          ],
        },
        {
          q: "GT = 0/1 pada VCF berarti…",
          options: [
            { text: "Homozigot referensi", why: "Itu 0/0." },
            { text: "Heterozigot (satu ref, satu alt)", why: "0=ref, 1=alt. 0/1 = heterozigot; 1/1 = homozigot alt.", correct: true },
            { text: "Homozigot alternatif", why: "Itu 1/1." },
            { text: "Tidak ada data", why: "Itu ./." },
          ],
        },
        {
          q: "BED 0-based vs VCF 1-based tertukar. Akibatnya?",
          options: [
            { text: "Tidak ada", why: "Ada: geser 1 basa di semua interval." },
            { text: "Geser 1 basa — varian batas ekson terlewat (off-by-one)", why: "Bug tersering dan tersulit ditemukan karena hasil “hampir benar”.", correct: true },
            { text: "File corrupt", why: "File tetap valid; isinya yang salah tafsir." },
            { text: "Hanya lebih lambat", why: "Kecepatan tidak terpengaruh; kebenaran yang terpengaruh." },
          ],
        },
        {
          q: "Ts/Tv ratio jauh dari ~2 pada WGS manusia menandakan…",
          options: [
            { text: "Sukses", why: "Biologi manusia ~2; jauh dari itu = ada yang salah." },
            { text: "Kemungkinan banyak false positive — cek QC variant calling", why: "Ts/Tv adalah QC klasik. Artefak menggeser rasionya.", correct: true },
            { text: "Tidak ada arti", why: "Ada: ia QC standar pasca-calling." },
            { text: "Harus hapus semua varian", why: "Jangan hapus; investigasi dulu sumber artefaknya." },
          ],
        },
      ],
    },
  ],
};
