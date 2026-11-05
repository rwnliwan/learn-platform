"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi3FormatDataPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi3QualData = [{"x": ["Q10", "Q20", "Q30", "Q40"], "y": [10, 1, 0.1, 0.01], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["10%", "1%", "0,1%", "0,01%"], "textposition": "outside"}];
  const bi3QualDataLayout = {"xaxis": {"title": "Skor kualitas"}, "yaxis": {"title": "P(error) %", "type": "log"}, "showlegend": false};

  const lab1Code = "fasta = '>genA\\nATGCGTTAGCCGTAA\\n>genB\\nATATATGGCC\\n'\nseqs = {}\nnama = None\nfor baris in fasta.strip().split('\\n'):\n    if baris.startswith('>'):\n        nama = baris[1:]; seqs[nama] = ''\n    else:\n        seqs[nama] += baris.strip()\nfor n, s in seqs.items():\n    gc = (s.count('G')+s.count('C'))/len(s)*100\n    print(f'{n}: panjang={len(s)}, GC={gc:.0f}%')\nprint()\n# FASTQ: 4 baris per read\nfastq = ['@R1', 'ACGTACGT', '+', 'IIIIIIII',\n         '@R2', 'TTTTGGGG', '+', '##IIIIII']\nfor i in range(0, len(fastq), 4):\n    nama, seq, quals = fastq[i], fastq[i+1], fastq[i+3]\n    qmean = sum(ord(c)-33 for c in quals)/len(quals)\n    status = 'BAGUS' if qmean >= 30 else 'BURUK -> buang di QC'\n    print(f'{nama}: Q rata-rata={qmean:.0f} {status}')";

  const lab2Code = "vcf = [\n    ('chr1', 12345, 'A', 'G', 99, 'DP=30', '0/1'),\n    ('chr1', 67890, 'CT', 'C', 45, 'DP=22', '1/1'),\n    ('chr2', 11111, 'G', 'T', 12, 'DP=5', '0/1'),   # kualitas jelek\n    ('chr2', 22222, 'C', 'T', 80, 'DP=40', '0/0'),\n]\nlolos = []\nfor chrom, pos, ref, alt, qual, info, gt in vcf:\n    dp = int(info.split('=')[1])\n    ok = qual >= 30 and dp >= 10\n    print(f'{chrom}:{pos} {ref}->{alt} Q={qual} {info} GT={gt} {\"LOLOS\" if ok else \"SARING\"}')\n    if ok: lolos.append((ref, alt))\n# Ts/Tv: transisi (A<->G, C<->T) vs transversi\ntransisi = {('A','G'),('G','A'),('C','T'),('T','C')}\nts = sum(1 for r,a in lolos if (r,a) in transisi and len(r)==len(a)==1)\ntv = sum(1 for r,a in lolos if (r,a) not in transisi and len(r)==len(a)==1)\nprint(f'\\nTs/Tv = {ts}/{tv} (harapan ~2.0 untuk WGS; jauh = curigai artefak)')";

  const bi3SizeData = [{"x": ["FASTA (genom)", "FASTQ (30x)", "BAM", "VCF"], "y": [3, 100, 80, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["3 GB", "100 GB", "80 GB", "1 GB"], "textposition": "outside"}];
  const bi3SizeDataLayout = {"xaxis": {"title": "Format"}, "yaxis": {"title": "GB", "type": "log"}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI3 &mdash; Bioinformatics</span>
        <h1 className="display-title">FASTA, FASTQ, VCF:<br />Format File Genomik</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: File 100 GB yang Salah Dibaca</a></li>
          <li><a href="#fasta">FASTA &amp; FASTQ — Si Teks Polos</a></li>
          <li><a href="#sam">SAM/BAM: Hasil Mapping</a></li>
          <li><a href="#vcf">VCF: Katalog Varian</a></li>
          <li><a href="#gff">GFF/GTF, BED &amp; Count Matrix</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Parse FASTA &amp; FASTQ</a></li>
          <li><a href="#lab2">🔬 Lab 2: Parse VCF &amp; Filter Varian</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Kontrak yang Membunuh Diam-diam</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Forensik File Kolaborator</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membaca dan menjelaskan struktur <strong>FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF, BED</strong>.</li>
          <li>Menjelaskan <strong>skor kualitas Phred</strong> dan menghitung probabilitas error.</li>
          <li>Memfilter <strong>VCF</strong> berdasarkan QUAL, DP, dan frekuensi alel.</li>
          <li>Memilih format yang tepat untuk tiap tahap pipeline NGS.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: File 100 GB yang Salah Dibaca</h2>
      <div className="story">
        <p>Analis menerima file sekuensing 100 GB. Ia membukanya di Excel. Excel memotong baris, mengubah “MARC1” menjadi tanggal, dan merusak skor kualitas. Tiga hari komputasi cluster menghasilkan varian sampah — karena satu langkah: <strong>format dibaca dengan alat yang salah</strong>.</p>
      <p>Format file genomik terlihat seperti teks biasa, tapi tiap format punya kontrak ketat: baris apa artinya apa, koordinat mulai dari 0 atau 1, strand mana. Lesson ini mengajarkan kontrak-kontrak itu — karena di bioinformatika, salah baca format = salah sains.</p>
      <p>Twist-nya: kesalahan format paling mahal justru yang <strong>tidak error</strong>. Program tetap jalan, angka tetap keluar — tapi koordinat 0-based dibaca sebagai 1-based, dan varian penyebab penyakit “hilang” satu basa dari laporan. Tidak ada pesan error, tidak ada warning; hanya diagnosis yang meleset diam-diam. Di bioinformatika, format file adalah <strong>kontrak hukum</strong>: tiap baris, tiap kolom, tiap offset punya arti yang disepakati — dan kontrak yang salah baca menghasilkan sains yang salah tanpa pernah protes.</p>
      </div>

      <h2 id="fasta">FASTA &amp; FASTQ — Si Teks Polos</h2>
      <p><strong>Definisi.</strong> <strong>FASTA</strong>: sekuens + header (&gt;) — untuk referensi/gen. <strong>FASTQ</strong>: sekuens + kualitas per basa (4 baris per read) — output mentah sekuenser.</p>
      <Tex math={String.raw`Q = -10 \log_{10}(P_{error})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`Q`} />: skor Phred (karakter ASCII di baris kualitas FASTQ)</li>
          <li><Tex math={String.raw`P_{error}`} />: probabilitas basa salah dibaca</li>
      </ul>
      <p><strong>Interpretasi:</strong> Q30 = 1 error per 1.000 basa; Q20 = 1 per 100. Baris kualitas FASTQ memakai ASCII: karakter 'I' = Q40. Inilah kenapa FASTQ 4x lebih besar dari FASTA.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca FASTQ</summary>
        <p>@READ1 &amp;larr; nama read<br />ACGTACGT &amp;larr; sekuens<br />+ &amp;larr; pemisah<br />IIIIIIII &amp;larr; kualitas: 'I' = ASCII 73 &amp;minus; 33 = <strong>Q40</strong> (P_error = 0,0001)<br />Jika kualitasnya '####' (Q2): buang read ini — sampah masuk, sampah keluar (lihat BI8 QC).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> FASTA itu buku teks polos; FASTQ itu buku teks dengan catatan kaki kepercayaan per huruf. Tanpa catatan kaki, kamu tidak tahu huruf mana yang hasil terkaan mesin.</p>
      <p><strong>Kapan memakai:</strong> FASTA: genom referensi, database gen. FASTQ: awal semua pipeline NGS (input QC).</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">&gt;gen_contoh (FASTA)
ATGCGTTAGCCGTAA

@READ1 (FASTQ)
ATGCGTTA
+
IIIIIIII  &lt;- Q40 per basa</pre>

      <h2 id="sam">SAM/BAM: Hasil Mapping — Si Peta Penempatan</h2>
      <p><strong>Definisi.</strong> <strong>SAM</strong> (teks) / <strong>BAM</strong> (biner, terkompresi): tiap read + di mana ia menempel di genom referensi (kromosom, posisi, CIGAR, MAPQ).</p>
      <details className="worked">
        <summary>📐 Contoh: membaca baris SAM</summary>
        <p>READ1 &nbsp; 0 &nbsp; chr1 &nbsp; 1000 &nbsp; 60 &nbsp; 8M &nbsp; ... &nbsp; ACGTACGT<br />Artinya: read menempel di <strong>chr1 posisi 1000</strong>, MAPQ <strong>60</strong> (sangat yakin), CIGAR <strong>8M</strong> (8 basa match).<br />CIGAR 4M1I3M = 4 match, 1 insersi, 3 match — bahasa kompak operasi alignment.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Kalau FASTQ adalah potongan puzzle, SAM/BAM adalah foto puzzle yang sudah tersusun: tiap potongan tercatat posisi pastinya. MAPQ = keyakinan “potongan ini memang di sini, bukan di tempat mirip lainnya”.</p>
      <p><strong>Kapan memakai:</strong> Setelah mapping (BI8): variant calling, visualisasi di IGV, QC alignment.</p>

      <PlotlyChart
        data={bi3QualData}
        title="Skor Phred vs Probabilitas Error"
        layout={bi3QualDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu Y logaritmik. Tiap naik 10 skor = error turun 10x lipat.</p>
        <p><strong>Interpretasi:</strong> Q30 adalah standar industri (99,9% akurat per basa). Tapi ingat: 3 miliar basa × 0,1% = 3 juta error per genom — inilah kenapa butuh coverage ganda (BI8) dan kenapa kualitas per basa penting.</p>
      </div>

      <h2 id="vcf">VCF: Katalog Varian — Si Daftar Typo</h2>
      <p><strong>Definisi.</strong> <strong>VCF</strong>: daftar varian — posisi, alel referensi/alternatif, kualitas (QUAL), kedalaman (DP), genotipe per sampel (GT). Header (##) + 1 baris per varian.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca baris VCF</summary>
        <p>chr1 &nbsp; 12345 &nbsp; rs123 &nbsp; A &nbsp; G &nbsp; 99 &nbsp; PASS &nbsp; DP=30 &nbsp; GT:DP &nbsp; 0/1:30<br />Posisi 12345: ref A → alt G, QUAL 99 (bagus), filter PASS, kedalaman 30x.<br /><strong>GT 0/1</strong> = heterozigot (satu kopi ref, satu alt). 1/1 = homozigot alt; 0/0 = homozigot ref.<br />Filter praktis: QUAL&gt;30, DP&gt;10, dan cek strand bias — varian QUAL tinggi tapi hanya di satu strand = artefak.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> VCF itu seperti daftar typo hasil proofreading 3 miliar huruf: tiap baris = “posisi X, seharusnya A, tertulis G, keyakinan sekian, ditemukan di sampel-sampel ini”.</p>
      <p><strong>Kapan memakai:</strong> Output variant calling (BI8); input GWAS (BI12), anotasi klinis (BI2).</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">##fileformat=VCFv4.2
#CHROM POS   ID   REF ALT QUAL FILTER INFO
chr1   12345 rs1  A   G   99   PASS   DP=30
chr1   67890 rs2  CT  C   45   PASS   DP=22  &lt;- delesi 1 basa</pre>

      <h2 id="gff">GFF/GTF, BED &amp; Count Matrix</h2>
      <p><strong>Definisi.</strong> <strong>GFF/GTF</strong>: anotasi fitur genom (gen, ekson: kromosom, start, end, strand). <strong>BED</strong>: interval genomik minimalis (0-based!). <strong>Count matrix</strong>: gen × sampel jumlah bacaan — input RNA-seq (BI9).</p>
      <details className="worked">
        <summary>📐 Contoh: jebakan koordinat 0-based vs 1-based</summary>
        <p><strong>BED</strong> (0-based, half-open): chr1 999 1005 = basa ke-1000–1005 (1-based).<br /><strong>GFF/VCF</strong> (1-based): posisi 1000 = basa ke-1000.<br />Konversi tanpa sadar = <strong>geser 1 basa</strong> — varian jatuh di luar ekson, analisis hancur. Selalu cek konvensi format sebelum intersect!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> GFF itu sertifikat tanah genom: “petak ini milik gen X, dari meter sekian sampai sekian”. BED itu versi singkatnya untuk tukang survei. Count matrix itu tabel panen: baris = gen, kolom = sampel, isi = berapa bacaan.</p>
      <p><strong>Kapan memakai:</strong> GFF: anotasi &amp; visualisasi. BED: interval untuk intersect (bedtools). Count matrix: differential expression.</p>
      <div className="callout callout-warning"><strong>Jebakan klasik:</strong> BED 0-based vs VCF/GFF 1-based. Off-by-one error adalah bug tersering di bioinformatika — dan tersulit ditemukan karena hasilnya “hampir benar”.</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;File teks genomik bisa dibuka dan diedit di Excel/Word&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Excel merusak: memotong baris panjang, mengubah ID gen jadi tanggal (MARC1 → 1-Mar!), mengubah format tanggal. Word menambah formatting tersembunyi. Pakai: less/head untuk lihat, Python/R untuk proses, IGV untuk visual. Jangan pernah simpan ulang file genomik dari Excel.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kualitas Q30 berarti sekuensingnya sempurna&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Q30 = 99,9% per basa, tapi 3 miliar basa × 0,1% = 3 juta error. Ditambah error sistematis (konteks sekuens tertentu). Inilah kenapa coverage 30x + variant caller probabilistik (BI8) wajib — satu bacaan tidak pernah cukup.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Semua format koordinat genomik sama&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> BED 0-based half-open vs VCF/GFF 1-based closed. Beda 1 basa = varian keluar dari ekson = kesimpulan salah. Selalu verifikasi konvensi sebelum operasi interval.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Jangan pernah parse VCF/SAM dengan split manual untuk produksi — pakai <strong>pysam / cyvcf2</strong>. Edge case format (field hilang, multiallelic) akan menghantui parser manual.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk file besar: <strong>jangan load ke RAM</strong> sekaligus. Stream per baris (Python) atau pakai tabix-indexed query untuk wilayah spesifik.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Biasakan <strong>head + samtools view</strong> sebelum pipeline: lihat 5 baris pertama tiap file. 10 detik ini mencegah 10 jam komputasi sia-sia.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Parse FASTA &amp; FASTQ Manual</h2>
      <p>Parse string FASTA (multi-sekuens) dan FASTQ: hitung panjang, GC%, dan rata-rata kualitas. Rasakan struktur 4-baris FASTQ.</p>
      <PyodideLab
        title="🔬 Lab 1: Parse FASTA &amp; FASTQ Manual"
        hint="Ubah kualitas read2 menjadi buruk (karakter '#'). Lihat rata-rata Q anjlok — itulah yang dideteksi tahap QC (BI8)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Parse &amp; Filter VCF</h2>
      <p>Parse baris VCF, ekstrak QUAL/DP/GT, terapkan filter (QUAL≥30, DP≥10). Hitung Ts/Tv ratio sebagai QC (harapan ~2 untuk WGS manusia).</p>
      <PyodideLab
        title="🔬 Lab 2: Parse &amp; Filter VCF"
        hint="Ubah satu varian jadi QUAL rendah. Lihat ia tersaring. Ts/Tv jauh dari 2 = sinyal banyak false positive — QC klasik variant calling."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh referensi/sekuens gen → FASTA</h3>
        <p><strong>Kondisi:</strong> Genom referensi, sekuens gen/protein.</p>
        <p><strong>Kenapa:</strong> Ringan, universal.</p>
        <p><strong>Contoh nyata:</strong> Download hg38 dari NCBI/Ensembl.</p>
      </div>
      <div className="decision-card">
        <h3>2. Data mentah sekuenser → FASTQ</h3>
        <p><strong>Kondisi:</strong> Awal pipeline; butuh kualitas per basa.</p>
        <p><strong>Kenapa:</strong> Satu-satunya yang menyimpan kualitas.</p>
        <p><strong>Contoh nyata:</strong> Input FastQC/trimming (BI8).</p>
      </div>
      <div className="decision-card">
        <h3>3. Hasil mapping → BAM (+BAI index)</h3>
        <p><strong>Kondisi:</strong> Butuh posisi tiap read; visualisasi IGV.</p>
        <p><strong>Kenapa:</strong> Terkompresi, terindeks untuk query wilayah.</p>
        <p><strong>Contoh nyata:</strong> Cek varian manual di IGV.</p>
      </div>
      <div className="decision-card">
        <h3>4. Daftar varian → VCF</h3>
        <p><strong>Kondisi:</strong> Analisis varian downstream.</p>
        <p><strong>Kenapa:</strong> Standar; menyimpan genotipe per sampel.</p>
        <p><strong>Contoh nyata:</strong> Input GWAS, anotasi ClinVar.</p>
      </div>
      <div className="decision-card">
        <h3>5. Interval/anotasi → BED/GFF</h3>
        <p><strong>Kondisi:</strong> Operasi wilayah genomik.</p>
      <PlotlyChart
        data={bi3SizeData}
        title="Ukuran File per Sampel WGS (orde besar)"
        layout={bi3SizeDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu Y logaritmik. Bandingkan orde besarnya.</p>
        <p><strong>Interpretasi:</strong> FASTQ mentah mendominasi (100 GB); hasil akhir VCF hanya ~1 GB. Pelajaran operasional: simpan FASTQ terkompresi + hapus intermediate bila perlu; yang diarsipkan jangka panjang biasanya BAM + VCF.</p>
      </div>
        <p><strong>Kenapa:</strong> Ringan untuk intersect; GFF kaya anotasi.</p>
        <p><strong>Contoh nyata:</strong> bedtools intersect varian vs ekson.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Jangan buka file genomik di Excel.</li>
          <li>Cek 0-based vs 1-based sebelum intersect.</li>
          <li>Q30 = standar; tapi butuh coverage ganda.</li>
          <li>Parse dengan library (pysam/cyvcf2), bukan split manual.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Varian “Hilang” karena Off-by-One</h2>
      <div className="callout">
        <p>Tim mengintersect VCF varian pasien dengan BED file ekson untuk mencari mutasi coding. Hasil: NOL varian coding — padahal pasien jelas punya penyakit genetik. Panik.</p>
      <p>Audit: file BED dibuat dari browser genom dengan konvensi 0-based, tapi script intersect mengasumsikan 1-based. Semua interval geser 1 basa — varian di batas ekson terlempar keluar.</p>
        <p><strong>Pertanyaan:</strong> Jelaskan mekanisme bug-nya dan SOP pencegahannya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>BED: chr1 999 1005 = basa 1000–1005 (1-based). Script 1-based membaca sebagai 999–1004 — geser 1 basa ke kiri. Varian di posisi batas ekson (splice site! — justru yang penting) terlewat. SOP: (1) dokumentasikan konvensi tiap file di header/pipeline; (2) gunakan library teruji (bedtools/pyranges) bukan intersect manual; (3) uji dengan kasus batas yang diketahui (positive control): varian yang HARUS kena intersect; (4) visualisasi spot-check di IGV. Pelajaran: bug 1 basa = hasil nol besar. Di bioinformatika, paranoia terhadap koordinat adalah kebajikan.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Kontrak yang Membunuh Diam-diam</h2>
      <p>Setiap format genomik adalah kontrak: “baris ini artinya X, kolom ini dihitung dari Y”. Kontrak yang paling banyak memakan korban bukan yang rumit — melainkan yang <strong>hampir sama tapi beda satu</strong>. Pendalaman ini melatih mata membaca kontrak.</p>

      <h3>1. Off-by-one: bug satu basa yang mengubah diagnosis</h3>
      <p>Dua konvensi koordinat hidup berdampingan dan tidak saling bicara:</p>
      <ul>
        <li><strong>1-based, fully-closed</strong> (VCF, GFF, SAM tampilan manusia): posisi pertama = 1, interval [5, 8] mencakup basa 5, 6, 7, 8.</li>
        <li><strong>0-based, half-open</strong> (BED, BAM internal): posisi pertama = 0, interval [4, 8) mencakup basa 5, 6, 7, 8 — posisi yang <em>sama</em>, angka yang <em>beda</em>.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: varian “hilang” karena off-by-one</summary>
        <p>Varian patogenik dilaporkan di VCF sebagai <strong>chr7:117.559.593</strong> (1-based). Kamu menulis filter BED untuk mengambil daerah ±10 basa:<br />
        Salah: <code>chr7  117559583  117559603</code> (mengira 1-based → mengambil posisi 117.559.584–117.559.603, <strong>meleset 1 basa ke kanan</strong>).<br />
        Benar: <code>chr7  117559582  117559603</code> (0-based: start = 117.559.593 − 10 − 1).<br />
        Jika varian tepat di tepi interval, versi salah <strong>tidak mengambilnya</strong> — dan tidak ada error. Filter “berhasil”, varian hilang, pasien negatif palsu.<br />
        Aturan: tiap kali menulis/membaca interval, tulis di komentar: “0-based half-open” atau “1-based closed”. Tiga kata yang menyelamatkan diagnosis.</p>
      </details>

      <h3>2. Skor kualitas Phred: logaritma yang menentukan kepercayaan</h3>
      <p>Baris kualitas FASTQ memakai skor Phred:</p>
      <Tex math={String.raw`Q = -10 \log_{10}(P) \quad \text{di mana } P = \text{peluang basa salah dibaca}`} block />
      <p><strong>Artinya tiap simbol:</strong> Q = skor kualitas (angka di file), P = probabilitas error per basa, log basis 10 karena skala error-nya orde magnitude.</p>
      <details className="worked">
        <summary>📐 Contoh: dari Q ke jumlah error ekspektasi</summary>
        <p>Q30 → P = 10<sup>−30/10</sup> = 10<sup>−3</sup> = <strong>0,001</strong> (1 salah per 1.000 basa).<br />
        Q20 → P = 0,01 (1 per 100). Q40 → P = 0,0001.<br />
        Read 150 basa semua Q30: error ekspektasi = 150 × 0,001 = <strong>0,15 basa salah per read</strong>.<br />
        Sampel 30x coverage, 3 miliar basa: total basa dibaca = 90 miliar → error ekspektasi pada Q30 = 90 miliar × 0,001 = <strong>90 juta basa salah</strong>! Inilah kenapa variant calling butuh model statistik (BI8): dari 90 juta kesalahan mentah, hanya segelintir yang lolos sebagai varian — dan salah setting filter, artefak membanjiri hasil.<br />
        <strong>Interpretasi:</strong> Q30 bukan “sempurna” — ia berarti 99,9% benar, dan 0,1% dari 90 miliar tetap raksasa. Kualitas adalah soal skala.</p>
      </details>

      <h3>3. Strand: dua arah, satu kebenaran</h3>
      <p>DNA beruntai ganda; gen bisa dibaca dari strand + atau −. Varian A→G di strand + adalah T→C di strand − — <strong>varian yang sama, ditulis terbalik</strong>. Database kadang melaporkan satu strand, paper lain melaporkan strand berlawanan. Menggabungkan tanpa harmonisasi = varian terhitung dua kali atau “tidak cocok”.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Daftar periksa sebelum percaya file</strong></p>
        <p>Setiap file genomik baru: (1) format &amp; versi? (2) 0-based atau 1-based? (3) strand mana? (4) assembly/genom referensi apa? (5) diurutkan (sorted) atau belum? Lima pertanyaan, 2 menit — menghemat 3 hari debugging hantu.</p>
      </div>
      <details className="worked">
        <summary>📐 Contoh: membaca FLAG SAM (bitwise)</summary>
        <p>Kolom FLAG di SAM adalah bitmask. FLAG = 99 artinya: 64 (first in pair) + 32 (mate reverse strand) + 2 (proper pair) + 1 (paired) = 99.<br />
        Cara baca 10 detik: 99 = read berpasangan, pasangannya ter-mapping baik, ini read pertama, mate-nya di strand berlawanan — pola normal paired-end.<br />
        FLAG = 77? 64 + 8 (mate unmapped) + 4 (read unmapped) + 1 → <strong>keduanya tidak ter-mapping</strong>. Read seperti ini memenuhi file tapi tak berguna untuk variant calling — filter sebelum analisis.</p>
      </details>

      <h2 id="kasus2">🏥 Kasus Lapangan: Forensik File Kolaborator</h2>
      <p>Kolaborator mengirim dua file: <code>kandidat.vcf</code> (1.200 varian) dan <code>target.bed</code> (daerah gen panel). Tugasmu: hitung berapa varian jatuh di daerah target. Kamu menjalankan intersect — hasil: <strong>0 varian</strong>. Kolaborator bersikeras “harusnya ~800”. Tidak ada error. Ini forensik format — ikuti jejaknya.</p>

      <h3>Jejak 1: baca kepala file</h3>
      <p><code>head kandidat.vcf</code>: baris pertama <code>##fileformat=VCFv4.2</code>, lalu <code>#CHROM POS ID REF ALT...</code> dengan POS seperti <strong>117559593</strong>. VCF = 1-based. ✓</p>
      <p><code>head target.bed</code>: <code>chr7  117559590  117559600</code> — BED = 0-based half-open → mencakup posisi 1-based <strong>117.559.591–117.559.600</strong>. Varian di 117.559.593 <strong>seharusnya</strong> masuk. Hmm, bukan off-by-one biasa.</p>

      <h3>Jejak 2: nama kromosom</h3>
      <p>VCF: <code>7</code> (tanpa prefix!). BED: <code>chr7</code> (dengan prefix!). Intersect mencocokkan string persis: <strong>“7” ≠ “chr7”</strong> → 0 hasil. Tidak ada error — hanya keheningan.</p>
      <details className="worked">
        <summary>📐 Contoh: audit 5 menit yang menyelamatkan 3 hari</summary>
        <p>Sebelum intersect apa pun, jalankan:<br />
        <code>cut -f1 kandidat.vcf | grep -v "^#" | sort -u | head</code> → “7, 8, 9…”<br />
        <code>cut -f1 target.bed | sort -u | head</code> → “chr7, chr8…”<br />
        Ketidakcocokan terlihat dalam 10 detik. Perbaikan: <code>sed 's/^/chr/'</code> pada kolom 1 VCF (atau sebaliknya) — lalu intersect: <strong>812 varian</strong>. ✓<br />
        <strong>Interpretasi:</strong> “chr” vs tanpa-“chr” adalah <strong>penyebab #1</strong> intersect kosong di dunia nyata (Ensembl pakai “1”, UCSC pakai “chr1”). Selalu samakan konvensi dulu — ini 30 detik yang menghemat 3 hari debugging hantu.</p>
      </details>

      <h3>Jejak 3: assembly (jebakan kedua)</h3>
      <p>Setelah prefix diperbaiki, 812 cocok — tapi 400 varian “penting” kolaborator tetap hilang. Cek header VCF: <code>##reference=GRCh37</code>. BED dibuat dari <strong>GRCh38</strong>! Koordinat bergeser ratusan ribu basa (lihat pendalaman liftover). Solusi: liftover VCF ke GRCh38 (atau sebaliknya) <strong>sebelum</strong> intersect — lalu 1.187 cocok.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Protokol “file asing”</strong></p>
        <p>Setiap file dari pihak lain wajib melewati 4 cek sebelum dipakai: (1) format + versi (baca header!), (2) konvensi kromosom (chr vs tanpa), (3) assembly referensi, (4) 0-based vs 1-based. Tulis hasilnya di log. File yang “terlihat benar” adalah yang paling berbahaya — ia tidak memprotes saat disalahbaca.</p>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Q30 artinya…"
        options={["30% error",
          "P(error) = 0,001 (1 per 1.000 basa)",
          "30 basa",
          "Kualitas 30%"]}
        correct={1}
        explanation="Benar: Q = −10 log10(P). Q30 = 99,9% akurat per basa — tapi tetap butuh coverage ganda untuk 3 miliar basa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Perbedaan FASTA vs FASTQ?"
        options={["Tidak ada",
          "FASTQ menyimpan skor kualitas per basa (4 baris/read); FASTA hanya sekuens",
          "FASTQ lebih kecil",
          "FASTA untuk varian"]}
        correct={1}
        explanation="Benar: kualitas = alasan FASTQ 4x lebih besar dan menjadi input QC."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. CIGAR “4M1I3M” artinya…"
        options={["4 mutasi",
          "4 match, 1 insersi, 3 match",
          "4 kromosom",
          "Error"]}
        correct={1}
        explanation="Benar: bahasa kompak operasi alignment di SAM/BAM."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. GT = 0/1 pada VCF berarti…"
        options={["Homozigot referensi",
          "Heterozigot (satu ref, satu alt)",
          "Homozigot alternatif",
          "Tidak ada data"]}
        correct={1}
        explanation="Benar: 0=ref, 1=alt. 0/1 = heterozigot; 1/1 = homozigot alt."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. BED 0-based vs VCF 1-based. Akibat tertukar?"
        options={["Tidak ada",
          "Geser 1 basa — varian batas ekson terlewat (off-by-one)",
          "File corrupt",
          "Hanya lambat"]}
        correct={1}
        explanation="Benar: bug tersering dan tersulit ditemukan karena hasil “hampir benar”."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Ts/Tv ratio jauh dari ~2 pada WGS manusia menandakan…"
        options={["Sukses",
          "Kemungkinan banyak false positive — cek QC variant calling",
          "Tidak ada arti",
          "Harus dihapus semua"]}
        correct={1}
        explanation="Benar: Ts/Tv adalah QC klasik. Biologi manusia ~2; artefak menggesernya."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>FASTA</strong>: sekuens; <strong>FASTQ</strong>: sekuens + kualitas (Q=−10log P).</li>
          <li><strong>SAM/BAM</strong>: hasil mapping (posisi, CIGAR, MAPQ).</li>
          <li><strong>VCF</strong>: katalog varian (QUAL, DP, GT); filter QUAL≥30, DP≥10.</li>
          <li><strong>GFF/GTF</strong>: anotasi; <strong>BED</strong>: interval 0-based; <strong>count matrix</strong>: input DE.</li>
          <li>Waspadai <strong>off-by-one</strong>: BED 0-based vs VCF 1-based.</li>
          <li>Jangan buka di Excel; parse dengan <strong>library</strong>; stream file besar.</li>
          <li>Ts/Tv ~2 sebagai QC variant calling manusia.</li>
          <li>Format = kontrak; salah baca kontrak = salah sains.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi2-database" className="btn btn-secondary btn-sm">← BI2</Link>
        <Link href="/learn/bi4-command-line" className="btn btn-primary btn-sm">BI4 →</Link>
      </div>
    </div>
  );
}
