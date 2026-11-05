"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi8NgsPipelinePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi8TechData = [{"x": ["Illumina", "PacBio HiFi", "ONT"], "y": [0.1, 0.5, 5], "type": "bar", "name": "Error %", "marker": {"color": "#2a7de1"}}, {"x": ["Illumina", "PacBio HiFi", "ONT"], "y": [150, 15000, 50000], "type": "bar", "name": "Panjang read (bp)", "marker": {"color": "#e8a838"}, "yaxis": "y2"}];
  const bi8TechDataLayout = {"xaxis": {"title": "Teknologi"}, "yaxis": {"title": "Error (%)"}, "yaxis2": {"title": "Panjang (bp, log)", "overlaying": "y", "side": "right", "type": "log"}, "showlegend": true};

  const lab1Code = "adaptor = 'AGATCGGAAGAG'\nreads = [\n    ('ACGTACGT' + adaptor, 'IIIIIIIIIIIIIIIIIIII'),\n    ('TTGGCCAA', 'IIIIII##'),   # ujung buruk\n    ('GATTACA', 'IIIIIII'),\n]\nTHR = 20\nfor seq, qual in reads:\n    # 1. potong adaptor\n    if adaptor in seq:\n        i = seq.index(adaptor)\n        seq, qual = seq[:i], qual[:i]\n    # 2. trim ujung 3' ber-Q rendah\n    while qual and (ord(qual[-1])-33) < THR:\n        seq, qual = seq[:-1], qual[:-1]\n    status = 'OK' if len(seq) >= 5 else 'BUANG (terlalu pendek)'\n    print(f'{seq:<12} Qmin~{min((ord(c)-33) for c in qual) if qual else 0:<3} {status}')\nprint()\nprint('Inilah fastp/Trimmomatic versi 1 menit.')\nprint('Adaptor tak terpotong -> mapping gagal / varian hantu.')";

  const lab2Code = "# pileup di satu posisi: ref=A. (basa, Q)\npileup = [('A',35),('A',37),('G',35),('A',36),('G',34),('A',35)]\nimport math\ndef likelihood(genotipe):\n    # genotipe: fraksi alel alt yang diharapkan\n    f = {'0/0': 0.0, '0/1': 0.5, '1/1': 1.0}[genotipe]\n    ll = 0.0\n    for basa, q in pileup:\n        e = 10**(-q/10)\n        p_alt = f*(1-e) + (1-f)*(e/3)\n        p = p_alt if basa == 'G' else (1-p_alt)\n        ll += math.log(max(p, 1e-300))\n    return ll\nfor g in ['0/0', '0/1', '1/1']:\n    print(f'{g}: log-likelihood = {likelihood(g):.1f}')\nprint()\nprint('Vonis = genotipe dengan likelihood tertinggi.')\nprint('Bukan voting! Kualitas tiap bacaan ikut menimbang.')\nprint('GATK memakai prinsip ini + haplotype assembly.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI8 &mdash; Bioinformatics</span>
        <h1 className="display-title">QC sampai Variant Calling:<br />Pipeline NGS End-to-End</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Varian Hantu Rp2 Miliar</a></li>
          <li><a href="#teknologi">Teknologi Sekuensing: Short vs Long Read</a></li>
          <li><a href="#qc">QC &amp; Trimming</a></li>
          <li><a href="#mapping">Mapping: BWA, Bowtie2, STAR</a></li>
          <li><a href="#calling">Variant Calling &amp; Anotasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi QC &amp; Trimming</a></li>
          <li><a href="#lab2">🔬 Lab 2: Panggil Varian dari Pileup</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Anatomi Kebocoran Tiap Sambungan</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Go / No-Go Sekuensing Ulang</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan alur <strong>pipeline NGS</strong>: QC → trimming → mapping → calling → anotasi.</li>
          <li>Membedakan <strong>short-read (Illumina) vs long-read (PacBio/ONT)</strong> dan memilih sesuai kebutuhan.</li>
          <li>Menjelaskan logika <strong>mapping</strong> (BWT) dan <strong>variant calling</strong> (model probabilistik, bukan hitung suara).</li>
          <li>Merancang <strong>QC checkpoint</strong> tiap tahap dan membaca metriknya (FastQC, MAPQ, Ts/Tv, Ti).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Varian Hantu Rp2 Miliar</h2>
      <div className="story">
        <p>Proyek sekuensing 500 pasien menelan Rp2 miliar. Hasil variant calling: 2 juta “varian langka kandidat penyakit”. Tim validasi Sanger 100 kandidat — <strong>93 adalah artefak</strong>: adaptor tak ter-trim, mapping buruk di daerah repetitif, strand bias. Rp2 miliar menghasilkan 7 varian asli.</p>
      <p>Pipeline NGS bukan sekadar menjalankan tool berurutan — ia adalah rantai yang setiap sambungannya bisa bocor. Lesson ini membedah tiap sambungan: apa yang dilakukan tool, apa yang bisa salah, dan bagaimana mengetahuinya SEBELUM validasi mahal.</p>
      <p>Twist-nya: 93 artefak dari 100 itu sebenarnya kabar baik — karena hampir semuanya <strong>bisa ditangkap QC murah sebelum validasi mahal</strong>. FastQC 10 menit, cek strand bias, cek daerah repetitif: total biaya mendekati nol dibanding Rp2 miliar yang terbakar. Pipeline yang baik bukan yang paling canggih; ia yang <strong>gagal dengan keras dan cepat</strong> (<em>fail fast</em>). Setiap sambungan rantai yang bocor diam-diam adalah utang yang dibayar dengan bunga validasi Sanger.</p>
      </div>

      <h2 id="teknologi">Teknologi Sekuensing: Short vs Long Read</h2>
      <p><strong>Definisi.</strong> <strong>Illumina (short-read)</strong>: 150–300 bp, akurasi 99,9%, murah — standar SNP/indel kecil. <strong>PacBio HiFi / ONT (long-read)</strong>: 10kb–1Mb, membaca daerah repetitif &amp; varian struktural — mahal, error profil beda.</p>
      <details className="worked">
        <summary>📐 Contoh: memilih untuk diagnosis</summary>
        <p>Bayi penyakit langka, WES Illumina negatif.<br />Dugaan: varian struktural (delesi besar) yang short-read lewatkan.<br />Keputusan: <strong>long-read (ONT/PacBio)</strong> → ditemukan delesi 5kb di gen kandidat.<br />Pelajaran: negatif di satu teknologi ≠ tidak ada varian — mungkin teknologinya buta.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Short-read itu seperti memotret mural lewat 1 juta foto close-up tajam: detail sempurna, tapi susah merakit gambar besarnya (repetitif!). Long-read itu seperti foto panorama: buram di detail, tapi struktur besarnya jelas.</p>
      <p><strong>Kapan memakai:</strong> SNP/indel, RNA-seq, panel klinis → Illumina. Varian struktural, assembly de novo, daerah repetitif → long-read. Kanker/kompleks → kombinasi.</p>

      <PlotlyChart
        data={bi8TechData}
        title="Short vs Long Read: Error vs Panjang"
        layout={bi8TechDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru (kiri) = tingkat error; kuning (kanan, log) = panjang read. Bandingkan trade-off-nya.</p>
        <p><strong>Interpretasi:</strong> Illumina: error terkecil tapi read pendek. Long-read: 100–300x lebih panjang dengan error lebih besar (HiFi sudah jauh membaik). Tidak ada yang “terbaik” — ada yang cocok untuk pertanyaanmu.</p>
      </div>

      <h2 id="qc">QC &amp; Trimming — Si Gerbang Pertama</h2>
      <p><strong>Definisi.</strong> <strong>FastQC</strong>: lapor kualitas per posisi, konten adaptor, GC, duplikasi. <strong>Trimming</strong> (Trimmomatic/fastp): potong adaptor + basa berkualitas buruk. Aturan: <strong>QC sebelum DAN sesudah trimming</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca FastQC</summary>
        <p><strong>Per-base quality</strong> anjlok di ujung 3' (Q&lt;20) → trim ujung.<br /><strong>Adaptor content</strong> 40% → library bermasalah / trim adaptor.<br /><strong>Duplikasi</strong> 60% → PCR berlebihan atau input DNA sedikit — waspadai bias.<br />Keputusan: trim adaptor + sliding window Q20 → QC ulang → baru mapping.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> QC itu seperti inspeksi bahan masakan: 5 menit mencium ikan busuk menghemat 3 jam memasak sia-sia. Pipeline tanpa QC = memasak dengan mata tertutup.</p>
      <p><strong>Kapan memakai:</strong> Selalu tahap 1. Metrik merah = investigasi dulu, jangan lanjut.</p>

      <h2 id="mapping">Mapping: BWA, Bowtie2, STAR — Si Tukang Tempel</h2>
      <p><strong>Definisi.</strong> <strong>Mapping</strong>: tempelkan tiap read ke posisi terbaik di genom referensi. <strong>BWA-MEM</strong>: standar DNA (BWT index). <strong>Bowtie2</strong>: cepat, hemat memori. <strong>STAR</strong>: RNA-seq (splice-aware: read bisa melompati intron).</p>
      <Tex math={String.raw`\text{MAPQ} = -10\log_{10}(P_{\text{salah tempat}})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{MAPQ}`} />: keyakinan penempatan (0–60)</li>
      </ul>
      <p><strong>Interpretasi:</strong> MAPQ 60 = 1:1.000.000 salah tempat. MAPQ 0 = menempel di banyak tempat sama baiknya (repetitif!) — read ini tidak informatif untuk varian unik. Filter MAPQ≥20 adalah QC standar.</p>
      <details className="worked">
        <summary>📐 Contoh: jebakan daerah repetitif</summary>
        <p>Read dari gen dengan pseudogen kembar: menempel di 2 tempat dengan skor sama → MAPQ 0.<br />Variant caller yang tidak filter MAPQ akan memanggil “varian” dari perbedaan pseudogen — artefak klasik!<br />Solusi: filter MAPQ, waspadai gen dengan homolog (lihat BI1: cerita varian hantu).<br /><strong>RNA-seq:</strong> read melintasi exon-exon junction → butuh STAR (splice-aware); BWA akan gagal menempelkan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Mapper itu seperti tukang tempel puzzle 3 miliar keping: BWA teliti tapi lambat, Bowtie2 cepat, STAR paham “potongan yang melompati lubang” (splicing). Pilih tukang sesuai puzzle-nya.</p>
      <p><strong>Kapan memakai:</strong> DNA → BWA-MEM. RNA → STAR/HISAT2. Cepat + hemat → Bowtie2. Selalu cek % mapped + MAPQ distribution.</p>

      <h2 id="calling">Variant Calling &amp; Anotasi — Si Hakim</h2>
      <p><strong>Definisi.</strong> <strong>Variant calling</strong> (GATK HaplotypeCaller, bcftools): dari tumpukan read (pileup), putuskan apakah ada varian via <strong>model probabilistik</strong> (bukan voting!). <strong>Anotasi</strong> (VEP, ANNOVAR): tambah info — gen, dampak, frekuensi gnomAD, ClinVar.</p>
      <Tex math={String.raw`P(G|D) \propto P(D|G) \cdot P(G)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`P(G|D)`} />: probabilitas genotipe given data (yang ingin tahu)</li>
          <li><Tex math={String.raw`P(D|G)`} />: likelihood: peluang data bila genotipe G (dari kualitas read)</li>
          <li><Tex math={String.raw`P(G)`} />: prior genotipe (dari populasi)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Bayes untuk calling: bukti read (likelihood) × pengetahuan populasi (prior). Inilah kenapa caller modern jauh lebih baik dari “hitungan suara” — ia memakai probabilitas, bukan demokrasi.</p>
      <details className="worked">
        <summary>📐 Contoh: dari pileup ke vonis</summary>
        <p>Posisi chr1:12345, 30 read: 18 G (Q35), 12 A (Q20).<br />Voting naif: heterozigot. Model GATK: menimbang Q (G lebih dipercaya), cek strand (semua G di + strand? → curiga!), hitung genotype likelihood.<br />Hasil: <strong>tidak dipanggil</strong> (strand bias) atau dipanggil dengan GQ rendah.<br /><strong>Anotasi VEP:</strong> missense di BRCA1, gnomAD 0,0001, ClinVar VUS → kandidat untuk kurasi (BI2).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Caller yang baik itu hakim, bukan tukang hitung suara: ia menimbang kualitas tiap bacaan, strand bias, dan posisi — bukan sekadar “20 bilang G, 10 bilang A jadi heterozigot”.</p>
      <p><strong>Kapan memakai:</strong> Germline → GATK/bcftools. Somatik kanker → Mutect2 (tumor-normal). Selalu anotasi sebelum interpretasi.</p>
      <div className="callout callout-warning"><strong>Best practice GATK</strong> (germline): HaplotypeCaller → joint genotyping → VQSR/filter → anotasi. Jangan skip: duplicate marking (Picard), BQSR (rekalibrasi kualitas), dan VQSR untuk WGS besar. Tiap langkah ada alasannya.</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pipeline = jalankan tool default berurutan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Default untuk data umum; datamu spesifik. Parameter trimming, referensi (hg19 vs hg38!), dan filter harus disesuaikan. Lebih penting: <strong>pahami tiap tahap</strong> agar bisa mendiagnosis saat hasil aneh — “default” bukan strategi.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin dalam coverage makin baik, tanpa batas&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Di atas 30–50x (germline), tambahan coverage memberi hasil diminishing — kecuali kasus khusus (somatik frekuensi rendah, mosaic). Uang lebih baik untuk <strong>tambah sampel</strong> daripada coverage 100x yang mubazir.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Varian yang terpanggil = varian yang benar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Caller punya false positive (lihat cerita pembuka: 93% artefak!). Validasi: metrik QC (Ts/Tv, het/hom ratio), IGV spot-check, dan validasi orthogonal (Sanger/array) untuk kandidat kunci.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bangun <strong>checkpoint QC</strong> tiap tahap: FastQC → %mapped/MAPQ → Ts/Tv + het/hom → ringkasan anotasi. Pipeline tanpa checkpoint = pesawat tanpa indikator.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Gunakan <strong>genom referensi yang sama</strong> di seluruh proyek (hg38!). Campur hg19/hg38 = koordinat kacau (lihat BI3). Catat versi + sumber.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk kandidat klinis: selalu <strong>lihat di IGV</strong>. Mata manusia masih menangkap artefak (strand bias, ujung read) yang lolos filter otomatis.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi QC &amp; Trimming Adaptor</h2>
      <p>Diberikan read dengan adaptor menempel + kualitas menurun di ujung. Potong adaptor dan trim Q&lt;20 dari ujung 3'. Lihat read “bersih”.</p>
      <PyodideLab
        title="🔬 Lab 1: Simulasi QC &amp; Trimming Adaptor"
        hint="Ubah threshold Q 20 → 30. Berapa banyak basa terbuang? Trade-off ketat vs longgar = kualitas vs jumlah data."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Panggil Varian dari Pileup (Bayes Sederhana)</h2>
      <p>Diberikan pileup (basa + kualitas), hitung likelihood tiap genotipe (0/0, 0/1, 1/1) dan pilih yang terbaik. Rasakan bedanya dengan voting.</p>
      <PyodideLab
        title="🔬 Lab 2: Panggil Varian dari Pileup (Bayes Sederhana)"
        hint="Ubah kualitas basa minor jadi rendah (Q10). Lihat vonis berubah dari heterozigot → homozigot ref — bukti lemah tidak dipercaya. Itulah model probabilistik."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. SNP/indel germline → Illumina + BWA + GATK</h3>
        <p><strong>Kondisi:</strong> Standar diagnosis/riset varian kecil.</p>
        <p><strong>Kenapa:</strong> Ekosistem matang; best practice jelas.</p>
        <p><strong>Contoh nyata:</strong> WES bayi sakit (BI1).</p>
      </div>
      <div className="decision-card">
        <h3>2. Varian struktural / repetitif → Long-read</h3>
        <p><strong>Kondisi:</strong> Short-read buta (delesi besar, repeat expansion).</p>
        <p><strong>Kenapa:</strong> Read panjang melompati daerah sulit.</p>
        <p><strong>Contoh nyata:</strong> Delesi 5kb terlewat WES.</p>
      </div>
      <div className="decision-card">
        <h3>3. RNA (ekspresi/splicing) → STAR + count</h3>
        <p><strong>Kondisi:</strong> Butuh splice-aware mapping.</p>
        <p><strong>Kenapa:</strong> BWA tidak menangani junction.</p>
        <p><strong>Contoh nyata:</strong> RNA-seq kanker (BI9).</p>
      </div>
      <div className="decision-card">
        <h3>4. Kanker somatik → Tumor-normal + Mutect2</h3>
        <p><strong>Kondisi:</strong> Bedakan somatik vs germline; frekuensi rendah.</p>
        <p><strong>Kenapa:</strong> Butuh kontrol normal + model khusus.</p>
        <p><strong>Contoh nyata:</strong> Mutasi driver tumor.</p>
      </div>
      <div className="decision-card">
        <h3>5. Pipeline produksi → Workflow manager + container</h3>
        <p><strong>Kondisi:</strong> &gt;10 sampel atau dishare.</p>
        <p><strong>Kenapa:</strong> Reproducibility (BI4).</p>
        <p><strong>Contoh nyata:</strong> Nextflow + Docker untuk 500 WGS.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>QC sebelum dan sesudah trimming.</li>
          <li>Filter MAPQ; waspadai daerah repetitif.</li>
          <li>Caller = hakim Bayes, bukan voting.</li>
          <li>Lihat kandidat kunci di IGV.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Varian “Patogenik” dari Ujung Read</h2>
      <div className="callout">
        <p>Pipeline memanggil varian nonsense kandidat penyakit. Validasi Sanger: <strong>negatif</strong>. Investigasi IGV: semua read pendukung varian menumpuk di <strong>ujung 3' read</strong> dengan kualitas menurun — dan hanya di satu strand.</p>
        <p><strong>Pertanyaan:</strong> Diagnosis artefak + perbaikan pipeline.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Artefak klasik: error sekuensing di ujung read berkualitas rendah + strand bias. Perbaikan: (1) trimming lebih agresif (sliding window Q20); (2) filter: abaikan varian yang hanya didukung ujung read / satu strand (gunakan filter strand bias: FS/SOR GATK); (3) naikkan threshold GQ untuk kandidat klinis; (4) SOP: IGV spot-check SEMUA kandidat klinis sebelum lapor. Pelajaran: satu filter yang tepat (strand bias) menghemat 93 validasi Sanger sia-sia dari cerita pembuka. QC bukan birokrasi — ia adalah penghematan.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Anatomi Kebocoran Tiap Sambungan</h2>
      <p>Pipeline NGS adalah rantai: QC → trimming → mapping → deduplikasi → recalibration → variant calling → anotasi → filter. Tiap sambungan punya <strong>mode gagal khas</strong> dan <strong>tes murah</strong> untuk menangkapnya. Pendalaman ini adalah buku saku troubleshooting.</p>

      <h3>1. Coverage: aritmetika yang menentukan segalanya</h3>
      <Tex math={String.raw`\text{Coverage} = \frac{N \times L}{G}`} block />
      <p><strong>Artinya tiap simbol:</strong> N = jumlah read, L = panjang tiap read (basa), G = ukuran genom target (basa). Coverage 30x artinya tiap basa rata-rata dibaca 30 kali.</p>
      <details className="worked">
        <summary>📐 Contoh: merancang sekuensing seperti insinyur</summary>
        <p>Eksom manusia: G ≈ 30 juta basa (1% genom). Target coverage 100x, read 150 basa paired-end.<br />
        N = (100 × 30×10<sup>6</sup>) / 150 = <strong>20 juta read</strong> (10 juta pasang).<br />
        WGS manusia: G = 3 miliar, target 30x → N = (30 × 3×10<sup>9</sup>) / 150 = <strong>600 juta read</strong> (300 juta pasang) ≈ 90 miliar basa ≈ <strong>~100 GB FASTQ</strong>.<br />
        <strong>Interpretasi:</strong> coverage bukan “makin tinggi makin baik” tanpa batas — di atas ~30x (WGS), tambahan coverage menaikkan biaya linear tapi akurasi hanya logaritmik. 30x adalah titik manis industri untuk variant calling germline; somatik kanker butuh 100–500x karena varian langka di campuran sel.</p>
      </details>

      <h3>2. Tiga artefak paling mahal (dan tes murahnya)</h3>
      <ul>
        <li><strong>Adaptor tak ter-trim:</strong> read mengandung sekuens adaptor → mapping ngaco di ujung. Tes: FastQC “Adapter Content” &gt; 5% = trim dulu (cutadapt/Trimmomatic). Biaya tes: 10 menit.</li>
        <li><strong>Duplikat PCR:</strong> salinan PCR dari molekul yang sama terhitung sebagai “bukti independen” → keyakinan varian palsu naik. Tes: tingkat duplikasi (Picard MarkDuplicates); WGS normal 5–15%. Di atas itu: library buruk. Solusi: tandai duplikat, jangan dihitung ganda.</li>
        <li><strong>Strand bias:</strong> varian asli muncul di kedua strand (±50/50); artefak sekuensing sering hanya di satu strand. Tes: Fisher strand bias (FS &gt; 60 di GATK = curiga). Ini menangkap sebagian besar 93 artefak di cerita pembuka.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: membaca metrik mapping seperti dokter baca lab</summary>
        <p>Laporan samtools flagstat sampel WGS:<br />
        Mapped: 98% → baik (&lt;90% = kontaminasi atau referensi salah).<br />
        Properly paired: 95% → baik (&lt;85% = masalah library/insert size).<br />
        Duplikat: 8% → normal. Singleton: 0,5% → normal.<br />
        Mean coverage: 32x, tapi 5% target &lt; 10x → <strong>waspada</strong>: daerah coverage rendah = varian terlewat (false negative) — laporkan sebagai keterbatasan, jangan klaim “tidak ada varian” di sana.<br />
        Aturan: <strong>tidak ada laporan varian tanpa laporan QC</strong>. Varian tanpa QC = rumor.</p>
      </details>

      <h3>3. GATK Best Practices: kenapa urutannya begitu</h3>
      <p>Urutan “mapping → MarkDuplicates → BQSR → HaplotypeCaller” bukan ritual — tiap langkah memperbaiki asumsi langkah berikut:</p>
      <ul>
        <li><strong>MarkDuplicates dulu:</strong> agar duplikat PCR tidak menggelembungkan keyakinan.</li>
        <li><strong>BQSR (recalibration):</strong> skor kualitas mesin sekuensing bias sistematis (mis. Q40 yang sebenarnya Q30 di konteks tertentu) → dikalibrasi ulang dari data. Tanpa ini, model probabilistik caller memakai “kepercayaan” yang salah.</li>
        <li><strong>HaplotypeCaller (bukan caller posisi-tunggal):</strong> melakukan <em>local re-assembly</em> di daerah aktif — menyusun ulang haplotipe kandidat lalu menghitung likelihood tiap genotipe. Inilah kenapa ia akurat untuk indel (yang membunuh caller naif).</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: VQSR butuh data besar</strong></p>
        <p>Variant Quality Score Recalibration melatih model pada <strong>jutaan varian</strong> (membutuhkan kohort besar atau WGS). Untuk eksom tunggal/penelitian kecil, pakai <em>hard filtering</em> (QD &lt; 2, FS &gt; 60, MQ &lt; 40) — VQSR pada data kecil = model yang dilatih pada sedikit contoh, tidak stabil.</p>
      </div>

      <h3>Kasus nyata: Rp2 miliar yang bisa diselamatkan Rp0</h3>
      <p>Kembali ke cerita pembuka: 93/100 artefak. Audit forensik menemukan ketiganya: adaptor 12% (FastQC merah — diabaikan), daerah repetitif (mapping quality 0 — tidak difilter), strand bias ekstrem (FS &gt; 200 — tidak dicek). Total waktu untuk ketiga tes: <strong>~30 menit komputasi + 1 jam manusia</strong>. Pelajaran termahal bioinformatika: <strong>QC bukan langkah pertama pipeline — QC adalah mindset yang mendahului semua langkah</strong>. Pipeline yang tidak bisa berkata “data ini jelek, berhenti” bukanlah pipeline — ia adalah mesin pembuat artefak.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Go / No-Go Sekuensing Ulang</h2>
      <p>Klinik menerima hasil WGS pasien kanker (tumor + normal). Sebelum variant calling somatik yang mahal, kamu harus memutuskan: <strong>data cukup baik untuk lanjut, atau sekuensing ulang?</strong> Keputusan Rp5 juta (ulang) vs risiko diagnosis salah. Ini laporan QC-mu:</p>

      <h3>Laporan QC: baca seperti dokter</h3>
      <ul>
        <li><strong>Tumor:</strong> coverage 85x (target 100x), mapped 97%, duplikat 22%, % target &gt; 20x = 91%.</li>
        <li><strong>Normal:</strong> coverage 32x, mapped 98%, duplikat 8%.</li>
        <li><strong>Kontaminasi</strong> (VerifyBamID): tumor 0,5%, normal 0,2% → OK.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: keputusan duplikat 22%</summary>
        <p>Duplikat 22% pada tumor: dari 85x coverage mentah, coverage <strong>efektif</strong> ≈ 85 × (1 − 0,22) = <strong>~66x</strong>.<br />
        Untuk varian somatik dengan VAF 10% (heterogenitas tumor): read pendukung ekspektasi = 66 × 0,10 = <strong>6,6 read</strong> — di batas deteksi (minimal ~5 read untuk caller percaya).<br />
        <strong>Interpretasi:</strong> varian klonal (VAF 40%+) terdeteksi baik; varian subklonal langka (VAF &lt; 10%) berisiko terlewat. Keputusan: <strong>GO dengan catatan</strong> — laporkan batas deteksi VAF ~10% di laporan; jangan klaim “tidak ada mutasi subklonal”. Jika pertanyaan klinisnya <em>minimal residual disease</em> (butuh VAF 1%) → <strong>NO-GO, sekuensing ulang lebih dalam</strong>.</p>
      </details>

      <h3>Aturan go/no-go profesional</h3>
      <ul>
        <li><strong>NO-GO mutlak:</strong> kontaminasi &gt; 3%, tertukar sampel (fingerprint genotype tidak cocok!), coverage &lt; 50% target.</li>
        <li><strong>GO bersyarat:</strong> seperti kasus ini — lanjut tapi <strong>dokumentasikan batas deteksi</strong> di laporan.</li>
        <li><strong>GO penuh:</strong> semua metrik dalam spesifikasi.</li>
      </ul>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: QC adalah keputusan, bukan ritual</strong></p>
        <p>Laporan QC tanpa keputusan go/no-go = dekorasi. Setiap metrik harus dihubungkan ke <strong>pertanyaan klinis</strong>: “untuk mendeteksi X, butuh Y — kita punya Z, jadi…” Analis yang hanya melampirkan PDF FastQC tanpa interpretasi belum melakukan pekerjaannya.</p>
      </div>

      <h3>Kasus nyata: sampel tertukar</h3>
      <p>Di sebuah studi 500 pasien, QC fingerprint menemukan <strong>7 pasangan tumor-normal tidak cocok</strong> (genotype berbeda = sampel tertukar di lab!). Tanpa cek ini, 7 pasien mendapat laporan mutasi <strong>orang lain</strong> — terapi salah sasaran. Cek 10 menit, 7 nyawa. <strong>Pipeline terbaik pun tidak berguna jika sampelnya salah orang.</strong></p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Urutan pipeline NGS yang benar?"
        options={["Calling → mapping → QC",
          "QC → trimming → mapping → calling → anotasi",
          "Anotasi dulu",
          "Bebas"]}
        correct={1}
        explanation="Benar: gerbang QC dulu, baru tempel, baru panggil, baru tafsir. Urutan = logika ketergantungan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. MAPQ = 0 artinya…"
        options={["Sempurna",
          "Read menempel di banyak tempat sama baiknya (repetitif) — tidak informatif",
          "Error",
          "Belum di-mapping"]}
        correct={1}
        explanation="Benar: jangan panggil varian dari MAPQ 0 — itu sumber varian hantu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Untuk RNA-seq, mapper yang tepat?"
        options={["BWA-MEM",
          "STAR (splice-aware: menangani lompatan intron)",
          "Bowtie2 selalu",
          "BLAST"]}
        correct={1}
        explanation="Benar: read RNA melintasi splice junction. Mapper DNA akan gagal/salah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Variant caller modern memutuskan genotipe dengan…"
        options={["Voting mayoritas",
          "Model probabilistik (likelihood × prior) yang menimbang kualitas",
          "Lempar koin",
          "Panjang read"]}
        correct={1}
        explanation="Benar: hakim Bayes, bukan demokrasi. Kualitas, strand, dan prior ikut menimbang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan long-read dipilih atas Illumina?"
        options={["Selalu",
          "Varian struktural, daerah repetitif, assembly — yang short-read buta",
          "Tidak pernah",
          "Hanya untuk RNA"]}
        correct={1}
        explanation="Benar: panorama vs close-up. Pilih sesuai pertanyaan, bukan tren."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Ts/Tv jauh dari ~2 setelah calling artinya?"
        options={["Sukses",
          "Banyak false positive kemungkinan — periksa QC/filter",
          "Harus tambah sampel",
          "Normal"]}
        correct={1}
        explanation="Benar: QC klasik pasca-calling. Biologi manusia ~2; artefak menggesernya."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Pipeline: <strong>QC → trim → map → call → anotasi</strong>; checkpoint QC tiap tahap.</li>
          <li><strong>Illumina</strong> untuk SNP/indel; <strong>long-read</strong> untuk struktural/repetitif.</li>
          <li><strong>BWA</strong> DNA, <strong>STAR</strong> RNA (splice-aware); filter <strong>MAPQ</strong>.</li>
          <li>Caller = <strong>Bayes</strong> (likelihood × prior), bukan voting.</li>
          <li>Best practice: <strong>mark duplicates, BQSR, VQSR</strong>; anotasi dengan <strong>VEP</strong>.</li>
          <li>Validasi kandidat kunci: <strong>IGV + orthogonal</strong>.</li>
          <li>Coverage &gt;30–50x diminishing return (germline).</li>
          <li>Referensi konsisten (<strong>hg38</strong>); workflow manager + container untuk produksi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi7-filogenetika" className="btn btn-secondary btn-sm">← BI7</Link>
        <Link href="/learn/bi9-rna-seq" className="btn btn-primary btn-sm">BI9 →</Link>
      </div>
    </div>
  );
}
