"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi4CommandLinePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi4TimeData = [{"x": ["GUI manual", "Script lokal", "Script + HPC"], "y": [72, 6, 0.5], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["72 jam", "6 jam", "30 mnt"], "textposition": "outside"}];
  const bi4TimeDataLayout = {"xaxis": {"title": "Pendekatan"}, "yaxis": {"title": "Jam", "type": "log"}, "showlegend": false};

  const lab1Code = "# simulasi: hitung read dengan kualitas buruk via 'pipe' mental\nimport random\nrandom.seed(1)\ndef baca_fastq(n):\n    # generator = streaming, tidak simpan semua di RAM\n    for i in range(n):\n        q = random.gauss(35, 8)\n        yield (f'@R{i}', 'ACGT'*25, '+', 'I'*100, q)\nn = 200000\njelek = sum(1 for _, _, _, _, q in baca_fastq(n) if q < 20)\nprint(f'total read (streaming): {n}')\nprint(f'kualitas buruk (Q<20): {jelek} ({jelek/n:.1%})')\nprint()\nprint('Memori konstan walau n=200rb. Inilah filosofi Unix pipe:')\nprint('proses mengalir, bukan menumpuk.')";

  const lab2Code = "# DAG: qc -> trim -> mapping -> calling\ntahap = {\n    'qc':      {'in': ['sample.fastq'], 'berubah': False},\n    'trim':    {'in': ['qc'], 'berubah': True},   # parameter diubah!\n    'mapping': {'in': ['trim'], 'berubah': False},\n    'calling': {'in': ['mapping'], 'berubah': False},\n}\nurutan = ['qc', 'trim', 'mapping', 'calling']\nkotor = set()\nfor t in urutan:\n    dep_kotor = any(d in kotor for d in tahap[t]['in'] if d in tahap)\n    if tahap[t]['berubah'] or dep_kotor:\n        kotor.add(t)\n        print(f'JALANKAN {t} (input/parameter berubah)')\n    else:\n        print(f'skip {t} (up-to-date)')\nprint()\nprint('Ubah parameter trimming -> hanya trim+mapping+calling diulang.')\nprint('Tanpa DAG: semua diulang manual. Dengan 1000 sampel: bencana.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI4 &mdash; Bioinformatics</span>
        <h1 className="display-title">Terminal, Git &amp; Nextflow:<br />Senjata Wajib Bioinformatikawan</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1.000 Sampel, 1 Klik</a></li>
          <li><a href="#cli">Command Line — Si Bahasa Ibu</a></li>
          <li><a href="#conda">Conda/Docker: Lingkungan yang Beku</a></li>
          <li><a href="#git">Git: Mesin Waktu Kode</a></li>
          <li><a href="#workflow">Snakemake/Nextflow &amp; HPC</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Perintah Unix untuk FASTQ</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Pipeline DAG</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Dari 5 Baris ke Pipeline Produksi</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Migrasi Lab ke Cluster Baru</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa <strong>command line</strong> wajib untuk data genomik skala besar.</li>
          <li>Menggunakan pola pikir <strong>pipe &amp; streaming</strong> untuk file besar tanpa memuat ke RAM.</li>
          <li>Menjelaskan peran <strong>conda/Docker</strong> (reproducibility lingkungan) dan <strong>Git</strong> (versi kode).</li>
          <li>Merancang <strong>workflow DAG</strong> (Snakemake/Nextflow) dan menjelaskan eksekusi di <strong>HPC/Slurm</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 1.000 Sampel, 1 Klik</h2>
      <div className="story">
        <p>Dua analis mendapat tugas sama: QC 1.000 file FASTQ. Analis A membuka satu per satu di aplikasi GUI — setelah 3 hari, baru 60 file. Analis B menulis 5 baris bash loop + submit ke cluster — selesai 2 jam sambil ngopi. Promosi tahun itu jatuh ke analis B.</p>
      <p>Di bioinformatika, GUI adalah mainan; terminal adalah alat kerja. Bukan karena elitisme — tapi karena datanya terlalu besar untuk diklik. Lesson ini mengajarkan senjata yang muncul di SEMUA lowongan bioinformatikawan: Unix, Git, conda/Docker, workflow manager, HPC.</p>
      <p>Twist-nya: keunggulan analis B bukan kecepatan — itu bonus. Keunggulan sebenarnya: pekerjaannya <strong>bisa diulang</strong>. Setahun kemudian, regulator bertanya “bagaimana tepatnya kamu memproses 1.000 sampel ini?” — analis B menunjukkan script 5 baris dengan timestamp; analis A menunjukkan ingatan tentang klik apa yang ia lakukan. Di sains, kecepatan tanpa reproduksibilitas = tidak terjadi. Terminal bukan soal gaya; ia adalah <strong>bukti kerja yang bisa diaudit</strong>.</p>
      </div>

      <h2 id="cli">Command Line — Si Bahasa Ibu</h2>
      <p><strong>Definisi.</strong> Terminal Unix: antarmuka teks untuk menjalankan program, memanipulasi file, dan merangkai alat via <strong>pipe (|)</strong>. Hampir semua tool bioinformatika (BWA, GATK, samtools) adalah program command-line.</p>
      <details className="worked">
        <summary>📐 Contoh: QC cepat tanpa buka file</summary>
        <p>&lt;code&gt;zcat sample.fastq.gz | head -8&lt;/code&gt; — lihat 2 read pertama tanpa ekstrak 100 GB.<br />&lt;code&gt;grep -c "^@" sample.fastq&lt;/code&gt; — hitung jumlah read (baris @).<br />&lt;code&gt;for f in *.fastq.gz; do fastqc $f; done&lt;/code&gt; — QC 1.000 file sekaligus.<br />Tiga baris ini = pekerjaan 3 hari analis A.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Terminal itu seperti dapur profesional: tidak seindah restoran (GUI), tapi bisa memasak untuk 1.000 orang. Pipe (|) adalah ban berjalan: output satu alat langsung jadi input berikutnya tanpa file perantara.</p>
      <p><strong>Kapan memakai:</strong> Selalu untuk data besar; eksplorasi cepat file (head/less/grep); otomasi berulang (loop); akses server/HPC.</p>
      <div className="code-header"><span className="code-lang">bash</span></div><pre className="codebox"># streaming: tidak memuat 100GB ke RAM
zcat huge.fastq.gz | head -8

# pipe: rangkai alat tanpa file perantara
samtools view -b aln.sam | samtools sort -o aln.bam

# loop: 1000 sampel sekaligus
for f in *.fastq.gz; do fastqc "$f"; done</pre>

      <PlotlyChart
        data={bi4TimeData}
        title="Waktu QC 1.000 FASTQ per Pendekatan (ilustratif)"
        layout={bi4TimeDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu Y logaritmik. Bandingkan orde waktunya.</p>
        <p><strong>Interpretasi:</strong> Lompatan 72 jam → 30 menit bukan soal kepintaran — soal alat. Inilah kenapa “comfortable with Linux terminal” ada di semua lowongan: ia mengubah hari menjadi menit.</p>
      </div>

      <h2 id="conda">Conda/Docker: Lingkungan yang Beku — Si Kulkas Waktu</h2>
      <p><strong>Definisi.</strong> <strong>Conda</strong>: manajer paket + environment terisolasi (bwa versi X hanya di env ini). <strong>Docker</strong>: kontainer — seluruh OS + tool + dependensi dibekukan dalam image yang identik di mana pun.</p>
      <Tex math={String.raw`\text{Reproducibility} = \text{kode} + \text{data} + \text{lingkungan (versi tool)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{versi tool}`} />: BWA 0.7.17 vs 0.7.18 bisa memberi hasil beda!</li>
      </ul>
      <p><strong>Interpretasi:</strong> Pipeline yang jalan di laptopmu tapi gagal di cluster = 90% masalah lingkungan. Bekukan lingkungan = bekukan salah satu sumber ketidakpastian.</p>
      <details className="worked">
        <summary>📐 Contoh: environment.yml</summary>
        <p>name: rnaseq<br />channels: [bioconda, conda-forge]<br />dependencies: [star=2.7.10a, samtools=1.17, python=3.11]<br />&lt;code&gt;conda env create -f environment.yml&lt;/code&gt; → siapa pun, di mana pun, dapat tool versi <strong>persis sama</strong>.<br />Docker selangkah lebih jauh: &lt;code&gt;docker run pipeline:v1.2&lt;/code&gt; = OS + tool identik, bahkan di cloud.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Conda itu kulkas: tiap proyek punya rak sendiri, bau ikan proyek A tidak mencemari proyek B. Docker itu kontainer kargo berpendingin: dikirim ke mana pun, isinya sama persis.</p>
      <p><strong>Kapan memakai:</strong> Setiap proyek: satu env per proyek; Docker untuk pipeline yang dishare/dideploy.</p>

      <h2 id="git">Git: Mesin Waktu Kode — Si Pencatat Setia</h2>
      <p><strong>Definisi.</strong> <strong>Git</strong>: version control — mencatat tiap perubahan kode (commit) dengan pesan, bisa kembali ke versi apapun, dan kolaborasi tanpa tabrakan.</p>
      <details className="worked">
        <summary>📐 Contoh: alur 3 perintah inti</summary>
        <p>&lt;code&gt;git init&lt;/code&gt; → mulai lacak.<br />&lt;code&gt;git add pipeline.py; git commit -m "tambah trimming"&lt;/code&gt; → simpan versi.<br />&lt;code&gt;git log --oneline&lt;/code&gt; → riwayat: v1, v2, v3...<br />Hasil pipeline aneh? &lt;code&gt;git diff v2 v3&lt;/code&gt; → tahu persis apa yang berubah. Inilah beda sains dan tebak-tebakan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Git itu seperti mesin waktu + notulen rapat: “versi 3 Januari yang berhasil itu yang mana?” — tinggal checkout. Tanpa git, analis menyimpan pipeline_final_v2_REAL.py dan menangis.</p>
      <p><strong>Kapan memakai:</strong> Semua kode analisis. Commit tiap langkah logis; pesan jelas (“tambah filter QUAL&gt;30” bukan “update”).</p>

      <h2 id="workflow">Snakemake/Nextflow &amp; HPC — Si Orkestra</h2>
      <p><strong>Definisi.</strong> <strong>Workflow manager</strong>: mendefinisikan pipeline sebagai <strong>DAG</strong> (aturan: input → output), otomatis menjalankan yang perlu, paralel, dan resume saat gagal. <strong>HPC/Slurm</strong>: cluster komputasi — submit job antre ke ratusan core.</p>
      <details className="worked">
        <summary>📐 Contoh: aturan Snakemake + Slurm</summary>
        <p>rule mapping: input fastq → output bam (via bwa). Snakemake membangun DAG, menjalankan 1.000 mapping paralel, skip yang sudah selesai.<br />&lt;code&gt;sbatch --cpus-per-task=8 --mem=32G run.sh&lt;/code&gt; → antre di Slurm; 1.000 job jalan di ratusan core.<br />Lowongan menulis “HPC/Slurm experience” — inilah yang dimaksud: bukan teori, tapi pernah submit ribuan job tanpa menangis.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Tanpa workflow manager, pipeline = 20 script yang dijalankan manual berurutan sambil berdoa. Dengan Snakemake/Nextflow = orkestra dengan partitur: tiap pemain tahu kapan masuk, konduktor menangani yang gagal dan mengulang hanya bagiannya.</p>
      <p><strong>Kapan memakai:</strong> Pipeline &gt;3 tahap atau &gt;10 sampel: wajib workflow manager. Komputasi berat (mapping, calling): submit ke HPC/cloud, bukan laptop.</p>
      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># Snakemake: aturan = resep mini
rule mapping:
    input:  "fastq/&#123;s&#125;.fastq.gz"
    output: "bam/&#123;s&#125;.bam"
    shell:  "bwa mem ref.fa &#123;input&#125; | samtools sort -o &#123;output&#125;"</pre>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;GUI lebih aman karena tidak perlu hafal perintah&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> GUI menyembunyikan parameter (versi tool? argumen apa?) → tidak reproducible. “Aman” semu: kamu tidak tahu apa yang terjadi. Command line + script = jejak lengkap yang bisa diaudit. Keamanan sejati = transparansi.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Docker/conda hanya untuk programmer&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> “Works on my machine” adalah mimpi buruk bioinformatika: hasil beda karena versi tool beda. Environment management adalah skill <em>analis</em>, bukan programmer — ia menentukan apakah analisismu bisa dipercaya orang lain.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;HPC = komputer yang lebih cepat saja&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> HPC = sistem antre + paralel + storage bersama. Skill-nya bukan “punya akses” tapi: menulis job yang efisien, tidak membanjiri antrean, mengelola 1.000 output, dan resume yang gagal. Etika cluster adalah skill profesional.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Pelajari <strong>20 perintah</strong> dulu (ls, cd, head, tail, grep, awk, sort, uniq, wc, cut, sed, find, tar, ssh, scp, top, df, chmod, ln, man) — 95% pekerjaan harian hanya ini.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Biasakan <strong>tidak menimpa file mentah</strong>: baca saja (streaming), tulis output baru. File mentah 100 GB yang rusak = tragedi; yang read-only = aman.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk setiap pipeline, sediakan <strong>mode dry-run + test 1 sampel</strong>. Jangan submit 1.000 job sebelum 1 sampel lolos — cluster bukan tempat debugging.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Pola Pikir Unix di Python</h2>
      <p>Simulasikan pipe Unix (grep | wc) dan streaming untuk file besar: proses FASTQ baris-per-baris tanpa load semua ke RAM.</p>
      <PyodideLab
        title="🔬 Lab 1: Pola Pikir Unix di Python"
        hint="Bandingkan: load semua vs streaming untuk 1 juta read (simulasi). Streaming = memori konstan. Inilah kenapa zcat | head bekerja untuk 100 GB."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi DAG Pipeline</h2>
      <p>Definisikan pipeline 4 tahap sebagai DAG (dependensi), lalu simulasikan eksekusi: hanya jalankan yang inputnya berubah (prinsip Snakemake).</p>
      <PyodideLab
        title="🔬 Lab 2: Simulasi DAG Pipeline"
        hint="Ubah ‘input berubah’ pada tahap tengah. Lihat tahap awal di-skip (up-to-date) — itulah penghematan waktu workflow manager saat resume."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Eksplorasi cepat file besar → head/grep/awk + pipe</h3>
        <p><strong>Kondisi:</strong> Lihat, hitung, filter tanpa buka penuh.</p>
        <p><strong>Kenapa:</strong> Streaming: cepat, hemat RAM.</p>
        <p><strong>Contoh nyata:</strong> Cek 5 read pertama FASTQ 100 GB.</p>
      </div>
      <div className="decision-card">
        <h3>2. Analisis berulang → Script (bash/Python)</h3>
        <p><strong>Kondisi:</strong> Dilakukan &gt;2 kali atau &gt;10 file.</p>
        <p><strong>Kenapa:</strong> Reproducible; sekali tulis, selamanya jalan.</p>
        <p><strong>Contoh nyata:</strong> Loop QC 1.000 sampel.</p>
      </div>
      <div className="decision-card">
        <h3>3. Pipeline multi-tahap → Snakemake/Nextflow</h3>
        <p><strong>Kondisi:</strong> &gt;3 tahap atau butuh resume/paralel.</p>
        <p><strong>Kenapa:</strong> DAG + otomatisasi + portabel ke HPC/cloud.</p>
        <p><strong>Contoh nyata:</strong> Pipeline RNA-seq: qc→trim→map→count→DE.</p>
      </div>
      <div className="decision-card">
        <h3>4. Komputasi berat → HPC/Slurm atau cloud</h3>
        <p><strong>Kondisi:</strong> Mapping/variant calling ratusan sampel.</p>
        <p><strong>Kenapa:</strong> Ratusan core paralel; laptop menyerah.</p>
        <p><strong>Contoh nyata:</strong> sbatch array 1.000 mapping WGS.</p>
      </div>
      <div className="decision-card">
        <h3>5. Share pipeline → Conda env / Docker + Git</h3>
        <p><strong>Kondisi:</strong> Orang lain harus bisa jalan.</p>
        <p><strong>Kenapa:</strong> Lingkungan beku + kode berversi = reproducible.</p>
        <p><strong>Contoh nyata:</strong> Paper dengan repo + environment.yml + image.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Terminal dulu, GUI kemudian (kalau sempat).</li>
          <li>Stream, jangan load, file besar.</li>
          <li>Satu env per proyek; commit tiap langkah.</li>
          <li>Test 1 sampel sebelum 1.000 job.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Pipeline Berhasil di Laptopku”</h2>
      <div className="callout">
        <p>Analis mengirim pipeline RNA-seq ke kolaborator. Di laptopnya jalan sempurna; di server kolaborator gagal total: versi STAR beda, Python beda, path hardcode /home/analis/.</p>
      <p>Deadline paper 2 minggu. Kolaborator frustrasi: “Kiril ulang yang bisa jalan!”</p>
        <p><strong>Pertanyaan:</strong> Diagnosis + resep perbaikan agar tidak terulang.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tiga dosa reproducibility: (1) tool tanpa versi pin (STAR beda → hasil beda); (2) path absolut hardcode; (3) tanpa workflow manager (urutan manual tak terdokumentasi). Resep: (a) conda environment.yml / Docker image dengan versi pin; (b) path relatif + config file; (c) Snakemake/Nextflow untuk orkestrasi; (d) Git untuk kode; (e) test di mesin bersih (fresh container) sebelum kirim. Pelajaran: “berhasil di laptopku” bukan bukti — bukti adalah orang lain bisa menjalankannya dari nol.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Dari 5 Baris ke Pipeline Produksi</h2>
      <p>Loop bash 5 baris memenangkan cerita pembuka. Tapi produksi nyata menuntut lebih: 1.000 sampel menjadi 10.000, laptop menjadi cluster, “jalan di mesinku” menjadi “jalan di mesin siapa pun”. Pendalaman ini tentang naik kelas.</p>

      <h3>1. Aritmetika skala: kenapa GUI mustahil</h3>
      <details className="worked">
        <summary>📐 Contoh: menghitung waktu seperti manajer</summary>
        <p>QC 1.000 file FASTQ, tiap file 2 GB:<br />
        GUI: buka + klik + tunggu + catat = ~4 menit/file → 1.000 × 4 = <strong>4.000 menit ≈ 67 jam ≈ 8,5 hari kerja</strong> nonstop tanpa istirahat.<br />
        Bash loop: <code>for f in *.fastq.gz; do fastqc "$f" -o qc/; done</code> di 32 core → ~2 jam.<br />
        <strong>Rasio: ~33x lebih cepat</strong> — dan analis bebas mengerjakan hal lain. Ini bukan soal “lebih rajin”; ini soal fisika waktu. Pada 10.000 sampel, GUI butuh 85 hari kerja. Tidak ada analis yang punya itu.</p>
      </details>

      <h3>2. Tiga lapis reproduksibilitas: conda, Git, workflow manager</h3>
      <p>Script yang jalan di laptopmu bisa gagal di cluster karena versi tool beda. Tiga lapis pertahanan:</p>
      <ul>
        <li><strong>conda (environment):</strong> <code>conda env export &gt; environment.yml</code> mengunci versi tiap tool. “bwa 0.7.17, samtools 1.15” — bukan “bwa versi entah”.</li>
        <li><strong>Git (kode):</strong> tiap perubahan tercatat siapa-kapan-kenapa. <code>git log</code> menjawab “sejak kapan hasil berubah?” — pertanyaan yang muncul di setiap audit.</li>
        <li><strong>Snakemake/Nextflow (alur):</strong> mendefinisikan <em>aturan</em> (input → output), bukan urutan klik. Jika satu sampel gagal, hanya ia yang diulang — bukan 999 lainnya.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: aturan Snakemake yang menyelamatkan 999 sampel</summary>
        <p>Aturan: <em>mapping</em>: input <code>&#123;"sample"&#125;.fastq.gz</code> → output <code>&#123;"sample"&#125;.bam</code>.<br />
        Sampel ke-500 gagal (disk penuh sesaat). Tanpa workflow manager: kamu tidak tahu mana yang selesai mana yang belum → ulangi semua (2 hari hangus).<br />
        Dengan Snakemake: ia memeriksa timestamp output vs input → <strong>hanya sampel 500 yang dijalankan ulang</strong> (3 menit).<br />
        Prinsipnya: <strong>jangan ingat status di kepalamu; biarkan sistem melacaknya</strong>. Kepala untuk berpikir, bukan untuk bookkeeping 1.000 file.</p>
      </details>

      <h3>3. HPC: antrean, bukan komputer pribadi</h3>
      <p>Cluster (SLURM/PBS) bukan “komputer besar” — ia adalah <strong>sistem antrean</strong>. Kamu tidak menjalankan; kamu <em>meminta</em> (sbatch), lalu menunggu giliran. Mental model yang salah (“kok belum jalan?!”) adalah sumber frustrasi pemula nomor satu.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Aturan praktis cluster</strong></p>
        <p>Minta sumber daya secukupnya (CPU/RAM/waktu) — minta berlebihan = antre lebih lama; minta kurang = job dibunuh. Selalu uji pipeline pada <strong>2 sampel dulu</strong> sebelum submit 1.000 (fail fast, BI8). Dan <em>array job</em> (sbatch --array=1-1000) adalah cara benar memproses ribuan sampel — bukan 1.000 submit manual.</p>
      </div>

      <h3>Kasus nyata: 3 hari → 2 jam, plus bonus audit</h3>
      <p>Lab sekuensing menerima 1.000 sampel eksom. Analis lama: GUI + spreadsheet pelacakan, 3 hari, 4 sampel tertukar nama (ketahuan setelah laporan terkirim — ditarik ulang, malu). Analis baru: bash + Snakemake + Git. 2 jam komputasi, nol tertukar (nama file tidak pernah diketik manual), dan saat reviewer bertanya “buktikan sampel 342 diproses dengan parameter sama”, ia menunjukkan <code>git log</code> + environment.yml. <strong>Kecepatan memenangkan promosi; keterlacakan memenangkan kepercayaan.</strong></p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Migrasi Lab ke Cluster Baru</h2>
      <p>Lab pindah ke cluster baru. Pipeline RNA-seq lama (“jalan di laptop Pak Dosen”) harus berjalan untuk <strong>240 sampel</strong> dan bisa diulang mahasiswa baru tahun depan. Kamu ditugasi migrasi. Ini rencana 4 langkah profesional:</p>

      <h3>Langkah 1: kunci environment (sebelum apa pun)</h3>
      <p>Di mesin lama: <code>conda env export &gt; environment.yml</code>. Isinya mengunci: STAR 2.7.10a, samtools 1.16, R 4.3, DESeq2 1.40. Di cluster baru: <code>conda env create -f environment.yml</code>. Tanpa ini, cluster menginstal STAR terbaru — yang mengubah 2% hasil mapping (pernah terjadi!) — dan kamu tidak akan pernah tahu kenapa hasil beda.</p>

      <h3>Langkah 2: ubah script menjadi workflow</h3>
      <p>Script lama: <code>run_all.sh</code> 200 baris dengan path hardcode <code>/home/dosen/data/...</code>. Kamu pecah menjadi aturan Snakemake: <code>qc → trim → map → count → deseq2</code>, tiap aturan mendeklarasikan input/output. Path menjadi parameter config (<code>config.yaml</code>), bukan hardcode.</p>
      <details className="worked">
        <summary>📐 Contoh: aritmetika array job</summary>
        <p>240 sampel, mapping STAR ~25 menit/sampel di 8 core.<br />
        Serial: 240 × 25 = 6.000 menit = <strong>100 jam ≈ 4,2 hari</strong>.<br />
        Array job SLURM (<code>--array=1-240</code>, 30 job paralel × 8 core): 240/30 × 25 = <strong>200 menit ≈ 3,3 jam</strong>.<br />
        <strong>Interpretasi:</strong> 30x lebih cepat — tapi perhatikan: 30 × 8 = 240 core diminta sekaligus. Jika antrean cluster penuh, minta 240 core = menunggu 2 hari; minta 80 core (10 paralel) = mulai dalam 1 jam, selesai 10 jam. <strong>Throughput vs waktu tunggu</strong> adalah trade-off nyata — analis yang meminta “semaksimal mungkin” sering selesai <em>lebih lambat</em> karena antre.</p>
      </details>

      <h3>Langkah 3: uji 2 sampel dulu (fail fast)</h3>
      <p>Sebelum submit 240: jalankan workflow pada 2 sampel. Ketahuan: path referensi salah di config, dan versi R di cluster tidak punya paket <code>tximport</code>. Dua bug tertangkap dalam 20 menit — bukan setelah 240 job gagal 3 jam kemudian (membuang 720 core-jam + reputasi di mata admin cluster).</p>

      <h3>Langkah 4: Git + dokumentasi serah terima</h3>
      <p>Semua di-commit: Snakefile, config.yaml, environment.yml, README (“cara menjalankan ulang”). Mahasiswa baru 2027 menjalankan <code>snakemake --profile cluster</code> dan mendapat hasil identik. <strong>Pipeline yang hanya jalan di tangan pembuatnya = belum selesai dimigrasi.</strong></p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Etika cluster</strong></p>
        <p>Cluster adalah sumber daya bersama. Selalu: minta RAM/CPU secukupnya (job 200 GB RAM untuk tugas 8 GB = antre lama + dimusuhi), bersihkan file sementara raksasa, dan jangan pernah menjalankan komputasi berat di <strong>login node</strong> (itu untuk submit, bukan komputasi — admin akan kill tanpa peringatan).</p>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa command line wajib di bioinformatika?"
        options={["Terlihat keren",
          "Data terlalu besar untuk GUI; tool bioinformatika native CLI; otomasi ribuan file",
          "Gratis",
          "Tidak ada alasan"]}
        correct={1}
        explanation="Benar: 100 GB tidak bisa diklik. Semua lowongan bioinformatikawan mensyaratkan Unix."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Pipe (|) dalam Unix berguna untuk…"
        options={["Hiasan",
          "Merangkai output satu program jadi input berikutnya tanpa file perantara (streaming)",
          "Mempercepat internet",
          "Menghapus file"]}
        correct={1}
        explanation="Benar: ban berjalan data. Hemat disk + waktu untuk file besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Fungsi utama conda environment per proyek?"
        options={["Hemat disk",
          "Isolasi versi tool per proyek — reproducibility lingkungan",
          "Mempercepat",
          "Wajib lisensi"]}
        correct={1}
        explanation="Benar: BWA 0.7.17 vs 0.7.18 bisa beda hasil. Bekukan lingkungan = bekukan ketidakpastian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Keunggulan Snakemake/Nextflow atas script manual berurutan?"
        options={["Lebih pendek",
          "DAG: otomatis skip yang up-to-date, paralel, resume yang gagal",
          "Lebih cantik",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: orkestra vs main solo. Untuk pipeline >3 tahap, ini pembeda profesional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Sebelum submit 1.000 job ke Slurm, yang wajib?"
        options={["Langsung submit",
          "Test 1 sampel sampai lolos + dry-run (cluster bukan tempat debugging)",
          "Minta izin teman",
          "Restart cluster"]}
        correct={1}
        explanation="Benar: 1.000 job gagal = 1.000x malu + antrean penuh. Etika cluster = skill profesional."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Git paling berharga saat…"
        options={["Kode sedikit",
          "Hasil aneh dan perlu tahu apa yang berubah sejak versi yang berhasil (git diff/log)",
          "Tidak pernah",
          "Hanya untuk tim besar"]}
        correct={1}
        explanation="Benar: mesin waktu + notulen. “Versi 3 Januari yang jalan itu yang mana?” terjawab seketika."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Terminal</strong>: bahasa ibu bioinformatika; pipe = streaming tanpa beban RAM.</li>
          <li>Kuasai <strong>20 perintah inti</strong>; jangan timpa file mentah.</li>
          <li><strong>Conda/Docker</strong>: bekukan lingkungan (versi tool) untuk reproducibility.</li>
          <li><strong>Git</strong>: version control; commit tiap langkah logis.</li>
          <li><strong>Snakemake/Nextflow</strong>: pipeline sebagai DAG — paralel, resume, portabel.</li>
          <li><strong>HPC/Slurm</strong>: submit ribuan job; test 1 sampel dulu.</li>
          <li>Reproducibility = <strong>kode + data + lingkungan</strong>.</li>
          <li>“Berhasil di laptopku” bukan bukti — bukti = orang lain bisa jalan dari nol.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi3-format-data" className="btn btn-secondary btn-sm">← BI3</Link>
        <Link href="/learn/bi5-biopython-r" className="btn btn-primary btn-sm">BI5 →</Link>
      </div>
    </div>
  );
}
