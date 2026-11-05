"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi5BiopythonRPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi5LibData = [{"x": ["Parsing format", "Akses database", "Statistik/plot", "ML"], "y": [9, 8, 4, 7], "type": "bar", "name": "Python/Biopython", "marker": {"color": "#2a7de1"}}, {"x": ["Parsing format", "Akses database", "Statistik/plot", "ML"], "y": [5, 6, 10, 4], "type": "bar", "name": "R/Bioconductor", "marker": {"color": "#e8a838"}}];
  const bi5LibDataLayout = {"barmode": "group", "xaxis": {"title": "Tugas"}, "yaxis": {"title": "Kekuatan"}, "showlegend": true};

  const lab1Code = "class Seq:\n    komplement = str.maketrans('ATGC', 'TACG')\n    def __init__(self, s):\n        s = s.upper()\n        assert set(s) <= set('ATGC'), 'alfabet tidak valid!'\n        self.s = s\n    def komplemen(self): return Seq(self.s.translate(self.komplement))\n    def reverse_komplemen(self): return Seq(self.s.translate(self.komplement)[::-1])\n    def gc(self): return (self.s.count('G')+self.s.count('C'))/len(self.s)\n    def __len__(self): return len(self.s)\n    def __repr__(self): return f'Seq({self.s[:20]}...)'\n\ndna = Seq('ATGCGTTAGCCGTAA')\nprint(dna)\nprint('komplemen :', dna.komplemen().s)\nprint('rev-komp  :', dna.reverse_komplemen().s)\nprint(f'GC        : {dna.gc():.0%}')\nprint()\nprint('Biopython: Seq + SeqRecord + SeqIO = pola ini, versi profesional.')\n# coba: Seq('ATGXYZ') -> error validasi! (data kotor tertangkap awal)";

  const lab2Code = "kodon = {'ATG':'M','TTT':'F','TTC':'F','TTA':'L','TAA':'*','TAG':'*',\n         'TGA':'*','GCT':'A','GCC':'A','GGT':'G','AAA':'K'}\ndef translate(s):\n    return ''.join(kodon.get(s[i:i+3], 'X') for i in range(0, len(s)-2, 3))\ndef revcomp(s):\n    return s.translate(str.maketrans('ATGC','TACG'))[::-1]\nseq = 'AAATGTTTAAATAGGGATGTAAACC'  # ubah sesukamu\nprint(f'sekuens: {seq}')\nterpanjang = ('', 0)\nfor fr in range(3):\n    for label, s in [('+', seq), ('-', revcomp(seq))]:\n        prot = translate(s[fr:])\n        # ORF: dari M sampai *\n        for bagian in prot.split('*'):\n            if 'M' in bagian:\n                orf = bagian[bagian.index('M'):]\n                if len(orf) > terpanjang[1]:\n                    terpanjang = (f'{label}{fr+1}', len(orf))\n        print(f'  frame {label}{fr+1}: {prot}')\nprint(f'\\nORF terpanjang: frame {terpanjang[0]}, {terpanjang[1]} aa')\nprint('Inilah logika dasar gene finding (BI7): cari ORF bermakna.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI5 &mdash; Bioinformatics</span>
        <h1 className="display-title">Biopython &amp; Bioconductor:<br />Ngoding untuk Biologi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 3 Jam vs 3 Menit</a></li>
          <li><a href="#biopython">Biopython — Si Multitool Python</a></li>
          <li><a href="#bioconductor">Bioconductor — Si Perpustakaan Raksasa R</a></li>
          <li><a href="#pilih">Python vs R: Kapan yang Mana</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Objek Seq ala Biopython</a></li>
          <li><a href="#lab2">🔬 Lab 2: Hitung Kodon &amp; Translasi Batch</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Pola Profesional Dua Bahasa</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: 10.000 Sekuens 16S dalam Sehari</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan peran <strong>Biopython</strong> (Seq, SeqIO, Entrez, pairwise2) dan <strong>Bioconductor</strong> (ekosistem R untuk genomik).</li>
          <li>Memparse <strong>FASTA/GenBank</strong> dan mengakses <strong>NCBI Entrez</strong> secara programatik.</li>
          <li>Melakukan operasi sekuens batch: <strong>komplemen, translasi, GC%</strong> (pola pikir vektorisasi).</li>
          <li>Memilih <strong>Python vs R</strong> sesuai tugas (dan menjelaskan kenapa lowongan minta keduanya).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 3 Jam vs 3 Menit</h2>
      <div className="story">
        <p>Magang diminta menghitung GC% dari 500 sekuens gen. Ia buka satu per satu di web tool, copy-paste ke Excel — 3 jam, 12 salah ketik. Senior menulis 10 baris Biopython: SeqIO.parse + GC — 3 menit, nol error, plus script-nya bisa dipakai lagi selamanya.</p>
      <p>Itulah seluruh argumen lesson ini: di bioinformatika, <strong>ngoding bukan skill tambahan — ia adalah pipet dan mikroskopmu</strong>. Biopython dan Bioconductor adalah dua kotak perkakas standar yang muncul di hampir semua lowongan. Lesson ini memastikan kamu bisa memakai keduanya, bukan sekadar menyebutnya di CV.</p>
      <p>Twist-nya: 3 menit vs 3 jam hanyalah awal cerita. Empat tahun kemudian, script 10 baris si senior masih dipakai 20 orang di lab — sudah memproses 2 juta sekuens — sementara spreadsheet si magang bahkan tidak bisa dibuka ulang karena link web tool-nya mati. Kode adalah <strong>aset yang berlipat</strong>; kerja manual adalah biaya yang terulang. Dan di wawancara kerja bioinformatika, “bisa Biopython/Bioconductor” bukan nilai tambah — ia adalah tiket masuk yang ditanyakan di 5 menit pertama.</p>
      </div>

      <h2 id="biopython">Biopython — Si Multitool Python</h2>
      <p><strong>Definisi.</strong> <strong>Biopython</strong>: library Python untuk biologi komputasional — objek Seq (sekuens + alfabet), SeqIO (parse semua format), Entrez (akses NCBI), pairwise2 (alignment), Phylo (pohon).</p>
      <details className="worked">
        <summary>📐 Contoh: pola SeqIO</summary>
        <p>&lt;code&gt;from Bio import SeqIO&lt;/code&gt;<br />&lt;code&gt;for rec in SeqIO.parse("gen.fasta", "fasta"):&lt;/code&gt;<br />&nbsp;&nbsp;&lt;code&gt;print(rec.id, len(rec.seq), rec.seq.reverse_complement()[:20])&lt;/code&gt;<br />Tiga baris = baca semua sekuens + reverse complement. Bandingkan dengan parser manual 30 baris yang rapuh (BI3).<br />&lt;code&gt;Entrez.efetch(db="nucleotide", id="NM_000059")&lt;/code&gt; → download sekuens BRCA2 langsung.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Biopython itu seperti Swiss Army Knife: bukan alat paling tajam untuk tiap tugas, tapi selalu ada di saku dan cukup untuk 90% pekerjaan harian. Untuk yang super-spesifik (variant calling), pakai tool khusus.</p>
      <p><strong>Kapan memakai:</strong> Parsing format, manipulasi sekuens batch, akses database, pipeline glue code (lihat BI4).</p>
      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from Bio import SeqIO
from Bio.SeqUtils import gc_fraction

for rec in SeqIO.parse("gen.fasta", "fasta"):
    print(rec.id, f"GC=&#123;gc_fraction(rec.seq):.0%&#125;")
    print("  protein:", rec.seq.translate(to_stop=True))</pre>

      <PlotlyChart
        data={bi5LibData}
        title="Kekuatan Relatif Python vs R per Tugas (ilustratif)"
        layout={bi5LibDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru = Python/Biopython, kuning = R/Bioconductor per kategori tugas.</p>
        <p><strong>Interpretasi:</strong> Python unggul di parsing, database, dan ML; R unggul telak di statistik/plot genomik (Bioconductor). Inilah kenapa lowongan menulis “R and/or Python” — tapi yang terbaik menguasai keduanya untuk tugas masing-masing.</p>
      </div>

      <h2 id="bioconductor">Bioconductor — Si Perpustakaan Raksasa R</h2>
      <p><strong>Definisi.</strong> <strong>Bioconductor</strong>: 2.300+ paket R untuk genomik — DESeq2 (RNA-seq), GenomicRanges (interval), Biostrings (sekuens), minfi (metilasi), flowCore. Terkurasi dengan dokumentasi vignette yang luar biasa.</p>
      <details className="worked">
        <summary>📐 Contoh: alur DESeq2 (konseptual)</summary>
        <p>&lt;code&gt;dds &lt;- DESeqDataSetFromMatrix(countData, colData, design=~kondisi)&lt;/code&gt;<br />&lt;code&gt;dds &lt;- DESeq(dds)&lt;/code&gt; &nbsp;&amp;larr; normalisasi + model NB + uji Wald<br />&lt;code&gt;res &lt;- results(dds)&lt;/code&gt; &nbsp;&amp;larr; tabel gen: log2FC, p-value, padj<br />Tiga baris untuk analisis yang benar secara statistik (lihat BI9 kenapa tidak boleh pakai uji-t biasa).<br />GenomicRanges: &lt;code&gt;findOverlaps(varian, ekson)&lt;/code&gt; = intersect ala bedtools dalam R.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bioconductor itu seperti perpustakaan universitas tua: koleksinya dalam, pustakawannya (reviewer) ketat, dan tiap buku (paket) punya panduan pakai (vignette). Tidak se-trendi Python, tapi untuk statistik genomik ia adalah rumahnya.</p>
      <p><strong>Kapan memakai:</strong> Analisis statistik genomik: DE (DESeq2/edgeR), interval genomik (GenomicRanges), visualisasi statistik kompleks. Lihat BI9, BI10, BI12.</p>
      <div className="callout callout-warning"><strong>Jebakan R:</strong> 1-based indexing (beda dari Python 0-based!) dan copy-on-modify (boros memori untuk data besar). Untuk data raksasa, proses di Python/command line dulu, analisis statistik di R.</div>

      <h2 id="pilih">Python vs R: Kapan yang Mana — Si Wasit</h2>
      <p><strong>Definisi.</strong> Aturan praktis: <strong>Python</strong> untuk engineering (parsing, pipeline, API, ML); <strong>R</strong> untuk statistik genomik dan visualisasi publikasi. Banyak profesional memakai keduanya dalam satu proyek.</p>
      <Tex math={String.raw`\text{Produktivitas} = \text{alat tepat} \times \text{tidak fanatik}`} block />
      <p><strong>Interpretasi:</strong> Rumus canda tapi benar: fanatisme bahasa = memilih obeng untuk memaku. Lowongan menulis keduanya karena pipeline nyata memang bilingual.</p>
      <details className="worked">
        <summary>📐 Contoh: proyek RNA-seq bilingual</summary>
        <p><strong>Python:</strong> download SRA (Entrez), QC parse, submit job cluster (BI4).<br /><strong>R:</strong> DESeq2 untuk differential expression, ggplot2 volcano plot.<br /><strong>Python lagi:</strong> ML downstream (BI16).<br />Lem antar bahasa: file (TSV/RDS) atau reticulate/rpy2. Pilih per tugas, bukan per agama.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Perang Python vs R itu seperti perang sendok vs garpu: untuk sup, sendok menang; untuk steak, garpu menang. Koki profesional punya keduanya.</p>
      <p><strong>Kapan memakai:</strong> Belajar: kuasai satu dalam-dalam, satu lagi cukup untuk membaca dan memakai paket standarnya. Itu sudah di atas rata-rata pelamar.</p>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Harus pilih SATU bahasa dan fanatik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Pipeline nyata bilingual. “Python person” yang tidak bisa baca vignette DESeq2 akan kesulitan di RNA-seq; “R person” yang tidak bisa parsing FASTQ 100 GB akan kesulitan di NGS. Fleksibilitas &gt; fanatisme.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Biopython lambat sehingga tidak dipakai profesional&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Biopython untuk orkestrasi dan prototyping; komputasi berat diserahkan ke tool C (BWA, samtools) atau numpy. “Lambat” hanya masalah bila dipakai untuk hal yang salah — seperti memakai sendok untuk memotong steak.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Copy-paste kode dari vignette/forum = sudah bisa&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Bisa jalan ≠ paham. Vignette DESeq2 yang dijalankan buta menghasilkan p-value yang salah tafsir (lihat BI9: desain formula, shrinkage). Pahami tiap baris sebelum percaya outputnya.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bangun <strong>snippet library</strong> pribadi: parse FASTA, GC batch, Entrez download, translate. 20 snippet = 80% tugas harian. Kumpulkan dari tiap lesson.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk R: baca <strong>vignette</strong> sebelum Stack Overflow. Vignette Bioconductor ditulis maintainer-nya sendiri — kualitasnya di atas jawaban forum acak.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Latih <strong>pola pikir vektorisasi</strong>: loop 1 juta sekuens di Python murni = lambat; list comprehension + numpy/pandas = cepat. Mulai dari yang benar, optimalkan bila perlu.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Objek Seq ala Biopython (Simulasi)</h2>
      <p>Simulasikan kelas Seq: simpan sekuens + alfabet, method komplemen/transkripsi/translasi. Rasakan enaknya OOP untuk sekuens vs string mentah.</p>
      <PyodideLab
        title="🔬 Lab 1: Objek Seq ala Biopython (Simulasi)"
        hint="Tambahkan method gc() dan validasi alfabet (tolak huruf selain ATGC). Inilah nilai objek: data + perilaku + validasi dalam satu tempat."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Translasi Batch 6-Frame</h2>
      <p>Terjemahkan sekuens dalam 6 frame (3 maju + 3 reverse complement) dan cari ORF terpanjang — konsep dasar prediksi gen (lihat BI7).</p>
      <PyodideLab
        title="🔬 Lab 2: Translasi Batch 6-Frame"
        hint="ORF = start (ATG) sampai stop. Gen bakteri biasanya ORF terpanjang. Coba sekuens acak vs sekuens gen asli — bedakan polanya."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Parsing/manipulasi sekuens batch → Biopython</h3>
        <p><strong>Kondisi:</strong> Format I/O, operasi sekuens, akses NCBI.</p>
        <p><strong>Kenapa:</strong> API matang; glue code pipeline.</p>
        <p><strong>Contoh nyata:</strong> Batch reverse-complement 10.000 primer.</p>
      </div>
      <div className="decision-card">
        <h3>2. Statistik genomik (DE, enrichment) → Bioconductor/R</h3>
        <p><strong>Kondisi:</strong> Butuh metode statistik teruji + visualisasi.</p>
        <p><strong>Kenapa:</strong> DESeq2/edgeR adalah standar emas; vignette luar biasa.</p>
        <p><strong>Contoh nyata:</strong> Differential expression RNA-seq (BI9).</p>
      </div>
      <div className="decision-card">
        <h3>3. Pipeline &amp; ML → Python (sklearn, pytorch)</h3>
        <p><strong>Kondisi:</strong> Otomasi, integrasi, deep learning.</p>
        <p><strong>Kenapa:</strong> Ekosistem engineering + ML terkuat.</p>
        <p><strong>Contoh nyata:</strong> Prediksi efek varian dengan DL (BI16).</p>
      </div>
      <div className="decision-card">
        <h3>4. Interval genomik cepat → bedtools / GenomicRanges</h3>
        <p><strong>Kondisi:</strong> Operasi wilayah (intersect, merge).</p>
        <p><strong>Kenapa:</strong> Dioptimasi untuk genom; jangan loop manual.</p>
        <p><strong>Contoh nyata:</strong> Varian dalam ekson (BI3).</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Parsing pakai library, bukan split manual.</li>
          <li>Python untuk engineering, R untuk statistik genomik.</li>
          <li>Baca vignette sebelum forum.</li>
          <li>Vektorisasi untuk batch besar.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: 500 Gen, Deadline Besok Pagi</h2>
      <div className="callout">
        <p>Manajer meminta: GC%, panjang, dan translasi untuk 500 gen dari file GenBank — besok pagi. Magang mulai copy-paste manual. Kamu (yang baca lesson ini) punya 1 jam.</p>
        <p><strong>Pertanyaan:</strong> Tulis rencana 10 baris kode (konseptual) + estimasi waktu.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>from Bio import SeqIO; for rec in SeqIO.parse('gen.gbk','genbank'): ambil rec.seq; hitung len, GC, translate(to_stop=True); tulis ke TSV. Estimasi: 10 menit tulis + 1 menit jalan + 10 menit validasi spot-check (5 gen manual). Total &lt;30 menit. Sisa waktu: buat plot distribusi GC% sebagai bonus. Pelajaran: di bioinformatika, <strong>ngoding = leverage</strong>. Tugas “sehari” manual = tugas “sejam” dengan script — dan script-nya reusable selamanya. Inilah kenapa skill ini ada di semua lowongan.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Pola Profesional Dua Bahasa</h2>
      <p>Bisa import Biopython itu 5 menit. Menulis kode yang <strong>dipercaya lab</strong> butuh pola pikir berbeda: kode bioinformatika memproses data yang mahal (Rp2 miliar per batch sekuensing!) — bug di sini bukan sekadar error, tapi uang dan sampel yang hangus. Tiga pola profesional:</p>

      <h3>1. Jangan pernah parse file genomik dengan split() manual</h3>
      <p>Godaan terbesar pemula: <code>line.split()</code> untuk VCF/SAM/GenBank. Tiga bulan kemudian format punya kolom opsional baru → parser pecah diam-diam → hasil salah tanpa error. <strong>Biopython.SeqIO / BCBio-GFF / cyvcf2 ada agar kamu tidak menulis parser sendiri.</strong></p>
      <details className="worked">
        <summary>📐 Contoh: biaya satu split() yang salah</summary>
        <p>VCF kolom INFO: <code>DP=30;AF=0,5;DB</code> — flag DB tanpa nilai! Parser <code>split(";")</code> lalu <code>split("=")</code> pada “DB” → error atau, lebih buruk, kode yang diam-diam melewatkannya.<br />
        cyvcf2: <code>variant.INFO.get("DB")</code> → menangani flag dengan benar (True/None).<br />
        Aturan: <strong>parser yang ditulis maintainer 50 orang &gt; parser yang kamu tulis jam 2 pagi</strong>. Selalu pakai library format-spesifik.</p>
      </details>

      <h3>2. Pola batch: fungsi murni + loop, bukan copy-paste</h3>
      <p>Magang di cerita pembuka gagal bukan karena bodoh — karena polanya salah: ulangi aksi manual 500x. Pola profesional: tulis <strong>satu fungsi yang benar untuk 1 sekuens</strong>, uji dengan kasus tepi, lalu aplikasikan ke 500 (atau 5 juta) via loop.</p>
      <details className="worked">
        <summary>📐 Contoh: fungsi translasi yang tahan uji</summary>
        <p>Fungsi <code>translate(dna)</code>: validasi dulu — panjang kelipatan 3? hanya huruf ATCG? Lalu translasi per kodon, berhenti di STOP.<br />
        Uji kasus tepi: <code>""</code> (kosong) → error jelas, bukan crash misterius; <code>"ATGN"</code> (huruf ambigu N) → tangani eksplisit (asam amino “X”), bukan KeyError jam 2 pagi.<br />
        Setelah 4 kasus tepi lolos, loop 500 sekuens: <code>[translate(s) for s in SeqIO.parse("gen.fasta","fasta")]</code> — satu baris, nol copy-paste, dan bug (jika ada) diperbaiki di <strong>satu tempat</strong>.</p>
      </details>

      <h3>3. Bilingual: Python untuk rekayasa, R untuk statistik</h3>
      <p>Pembagian kerja industri yang mapan: <strong>Python</strong> (Biopython, pandas, scikit-learn) untuk parsing, pipeline, ML; <strong>R/Bioconductor</strong> (DESeq2, limma, SingleCellExperiment) untuk statistik genomik yang metode gold-standard-nya ditulis di R. Bertengkar “mana lebih baik” = melewatkan lowongan yang meminta keduanya.</p>
      <ul>
        <li>Alur tipikal: unduh SRA dengan Python (Entrez) → QC &amp; count → analisis diferensial di R (DESeq2) → visualisasi publikasi di R (ggplot2) → model ML di Python.</li>
        <li>Jembatan: file perantara (count matrix TSV) + Reticulate (R↔Python). Jangan paksa satu bahasa mengerjakan yang bukan keahliannya.</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Etika Entrez (NCBI)</strong></p>
        <p>Unduh massal dari NCBI wajib: email terdaftar, ≤3 request/detik (10 dengan API key), dan jam non-sibuk untuk batch besar. Melanggar = IP diblokir — dan “diblokir NCBI” adalah cerita memalukan yang menyebar cepat di komunitas kecil bioinformatika.</p>
      </div>

      <h3>Kasus nyata: script 10 baris yang menjadi infrastruktur lab</h3>
      <p>Script GC% si senior tidak berhenti di 500 sekuens. Ia dibungkus jadi fungsi, ditambah argumen command-line (argparse), ditambah test 4 kasus tepi, di-commit ke Git lab. Empat tahun, 20 pengguna, 2 juta sekuens — total waktu manusia yang dihemat: ~12.000 jam. <strong>Kode yang baik adalah karyawan yang tidak digaji tapi terus bekerja.</strong> Itulah kenapa lowongan bioinformatika menanyakan Git dan testing, bukan cuma “bisa Python”.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: 10.000 Sekuens 16S dalam Sehari</h2>
      <p>Proyek mikrobiom mengirim 10.000 sekuens 16S (FASTA, ~1,5 kb tiap). Tugas: QC, dereplikasi (buang duplikat), hitung statistik dasar, siapkan untuk clustering OTU. Estimasi manual: mustahil. Ini pipeline Biopython 30 baris yang mengerjakannya:</p>

      <h3>Desain pipeline (pola profesional BI5)</h3>
      <ul>
        <li><strong>Fungsi 1 — <code>qc_filter(rec)</code>:</strong> buang sekuens &lt; 1.000 bp, &gt; 5% huruf N (ambigu), atau mengandung homopolimer &gt; 8 (artefak sekuensing 16S klasik).</li>
        <li><strong>Fungsi 2 — <code>dereplicate(recs)</code>:</strong> dict sekuens → ID representatif; 10.000 sekuens → ~3.200 unik (mikrobiom memang didominasi sedikit takson berlimpah!).</li>
        <li><strong>Loop utama:</strong> <code>SeqIO.parse</code> → filter → dereplikasi → tulis FASTA bersih + laporan TSV.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: membaca laporan QC</summary>
        <p>Input: 10.000 sekuens.<br />
        Dibuang: 340 (&lt; 1.000 bp), 180 (&gt; 5% N), 95 (homopolimer) → <strong>9.385 lolos (93,8%)</strong>.<br />
        Unik setelah dereplikasi: <strong>3.214</strong> (34%) — sekuens teratas muncul 1.240x (dominansi takson umum, normal untuk 16S).<br />
        <strong>Interpretasi:</strong> jika yang dibuang &gt; 20%, curigai masalah library (bukan “data jelek” — tapi <em>protokol</em> yang perlu diperbaiki). Jika sekuens unik &lt; 10%, curigai kontaminasi (satu takson mendominasi = mungkin reagen terkontaminasi). <strong>Statistik QC adalah diagnostik lab</strong>, bukan sekadar filter.</p>
      </details>

      <h3>Jembatan ke R: dari sekuens ke ekologi</h3>
      <p>Output pipeline (tabel OTU: sampel × takson) dibaca di R: <code>phyloseq</code> untuk diversitas alfa/beta, <code>DESeq2</code>/<code>ANCOM-BC</code> untuk takson diferensial (ingat jebakan komposisional BI14!). Python membersihkan; R menganalisis secara statistik — <strong>pembagian kerja bilingual</strong> yang sebenarnya.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Streaming, bukan loading</strong></p>
        <p><code>SeqIO.parse</code> adalah <strong>generator</strong> — membaca satu per satu tanpa memuat semua ke RAM. 10.000 sekuens 16S (~15 MB) tidak masalah, tapi 50 juta read FASTQ (~15 GB) akan membunuh laptop jika di-load sekaligus. Pola profesional: proses <strong>streaming</strong> (satu record → proses → buang), simpan hanya ringkasannya. RAM adalah sumber daya; hematlah seperti uang.</p>
      </div>

      <h3>Dari script ke aset lab</h3>
      <p>Pipeline ini di-commit ke Git lab dengan 3 test kasus tepi (FASTA kosong, sekuens 100% N, ID duplikat). Setahun kemudian dipakai 4 proyek lain tanpa perubahan — hanya parameter beda via argparse. <strong>30 baris yang ditulis sekali, bekerja 4 tahun.</strong> Itulah definisi “ngoding sebagai pipet dan mikroskop” dari cerita pembuka.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Keunggulan utama Biopython?"
        options={["Paling cepat",
          "Multitool: Seq/SeqIO/Entrez/alignment dalam satu ekosistem Python",
          "Hanya untuk pemula",
          "Mengganti semua tool"]}
        correct={1}
        explanation="Benar: Swiss Army Knife — cukup untuk 90% tugas harian; yang spesifik pakai tool khusus."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bioconductor unggul di…"
        options={["Game development",
          "Statistik genomik terkurasi (DESeq2, GenomicRanges) + vignette",
          "Web scraping",
          "Sistem operasi"]}
        correct={1}
        explanation="Benar: 2.300+ paket ter-review untuk genomik. Rumahnya analisis statistik genomik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Jebakan indexing R vs Python?"
        options={["Tidak ada beda",
          "R 1-based, Python 0-based — tertukar = off-by-one",
          "R lebih cepat",
          "Python tidak punya index"]}
        correct={1}
        explanation="Benar: bug klasik proyek bilingual. Selalu sadar bahasa mana yang dipakai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk download 1.000 sekuens dari NCBI, cara profesional?"
        options={["Klik satu per satu",
          "Entrez API via Biopython (efetch) dalam script",
          "Screenshot",
          "Minta teman"]}
        correct={1}
        explanation="Benar: programatik = reproducible + cepat. Klik manual tidak scalable."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan pakai R daripada Python?"
        options={["Selalu",
          "Analisis statistik genomik (DE, enrichment) + visualisasi publikasi",
          "Tidak pernah",
          "Hanya untuk CSV kecil"]}
        correct={1}
        explanation="Benar: pilih per tugas. DESeq2 di R adalah standar emas yang tidak ada tandingannya di Python."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Prinsip vektorisasi untuk 1 juta sekuens?"
        options={["Loop Python murni",
          "Operasi batch (list comprehension/numpy) — loop murni lambat",
          "Satu per satu manual",
          "Tidak masalah"]}
        correct={1}
        explanation="Benar: mulai dari yang benar, optimalkan bila perlu. Pola batch = pola pikir bioinformatika."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Biopython</strong>: Seq, SeqIO, Entrez — multitool Python untuk sekuens.</li>
          <li><strong>Bioconductor</strong>: 2.300+ paket R; rumah statistik genomik (DESeq2).</li>
          <li><strong>Python</strong> = engineering/pipeline/ML; <strong>R</strong> = statistik/visualisasi.</li>
          <li>Proyek nyata <strong>bilingual</strong>; fanatisme bahasa = tidak produktif.</li>
          <li>Waspadai <strong>1-based (R) vs 0-based (Python)</strong>.</li>
          <li>Bangun <strong>snippet library</strong> pribadi dari tiap lesson.</li>
          <li>Baca <strong>vignette</strong> sebelum forum; pahami tiap baris.</li>
          <li>Ngoding = leverage: tugas sehari manual = sejam dengan script.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi4-command-line" className="btn btn-secondary btn-sm">← BI4</Link>
        <Link href="/learn/bi6-alignment" className="btn btn-primary btn-sm">BI6 →</Link>
      </div>
    </div>
  );
}
