import type { V2Lesson } from "../lib/types";

export const bi4: V2Lesson = {
  slug: "bi4-command-line",
  track: "Bioinformatika",
  module: "Fondasi",
  title: "BI4 · Terminal, Git & Nextflow: Senjata Wajib",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "1.000 sampel, 1 klik",
      prose: [
        "Dua analis mendapat tugas sama: QC 1.000 file FASTQ. Analis A membuka satu per satu di aplikasi GUI — setelah 3 hari, baru 60 file. Analis B menulis 5 baris bash loop dan submit ke cluster — selesai 2 jam sambil ngopi.",
        "Di bioinformatika, GUI adalah mainan; terminal adalah alat kerja. Bukan elitisme — datanya terlalu besar untuk diklik. Tiga baris seperti `zcat sample.fastq.gz | head -8`, `grep -c \"^@\" sample.fastq`, dan `for f in *.fastq.gz; do fastqc $f; done` menggantikan 3 hari kerja analis A.",
        "Twist-nya: keunggulan analis B bukan kecepatan — itu bonus. Setahun kemudian regulator bertanya “bagaimana tepatnya kamu memproses 1.000 sampel ini?” — analis B menunjukkan script 5 baris bertimestamp; analis A menunjukkan ingatan tentang klik apa yang ia lakukan. Kecepatan tanpa reproduksibilitas = tidak terjadi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa GUI tidak cocok untuk 1.000 file FASTQ" },
        { id: "t2", text: "Sebutkan tiga perintah Unix inti untuk eksplorasi file besar" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira GUI lebih aman karena tidak perlu hafal perintah. GUI menyembunyikan parameter (versi tool? argumen apa?) sehingga tidak reproducible. Keamanan sejati = transparansi command line + script.",
      },
      reference: "Terminal = bahasa ibu bioinformatika. Pipe (|) = streaming tanpa beban RAM.",
    },
    {
      id: "lab-pipe",
      eyebrow: "Langkah 2 · Lab",
      title: "Pola pikir Unix: streaming, bukan menumpuk",
      prose: [
        "Filosofi pipe Unix: data mengalir dari satu alat ke alat berikutnya tanpa file perantara dan tanpa menumpuk di RAM. Di Python, padanannya adalah generator — memproses satu item, lalu membuangnya.",
        "Simulasi ini: 200.000 read “mengalir” lewat generator; kamu menghitung yang berkualitas buruk (Q<20) dengan memori konstan. Inilah cara `grep | wc` menangani file 100 GB di laptop biasa.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi generator `baca_fastq` (yield satu read)" },
        { id: "t2", text: "Hitung `jelek` = read dengan kualitas < 20" },
        { id: "t3", text: "Cetak total dan persentasenya" },
      ],
      expected: "total read (streaming): 200000 · kualitas buruk (Q<20): ~3.1%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memuat seluruh file ke list “karena lebih gampang”. Untuk 50 juta read FASTQ (~15 GB), itu membunuh laptop. Biasakan pola streaming sejak data kecil — kebiasaan ini yang menyelamatkanmu di data besar.",
      },
      hints: [
        "Generator memakai yield di dalam loop, bukan return list.",
        "Hitung jelek dengan sum(1 for ... if q < 20).",
        "Persentase = jelek / n, format :.1% untuk persen.",
      ],
      code: {
        starter: `import random\nrandom.seed(1)\n\ndef baca_fastq(n):\n    # TULIS KODEMU: generator = streaming, tidak simpan semua di RAM\n    for i in range(n):\n        q = random.gauss(35, 8)\n        yield \n\nn = 200000\njelek = \nprint(f'total read (streaming): {n}')\nprint(f'kualitas buruk (Q<20): {jelek} ({jelek/n:.1%})')\nprint()\nprint('Memori konstan walau n=200rb. Inilah filosofi Unix pipe:')\nprint('proses mengalir, bukan menumpuk.')`,
        lockLines: 2,
        solution: `import random\nrandom.seed(1)\n\ndef baca_fastq(n):\n    # TULIS KODEMU: generator = streaming, tidak simpan semua di RAM\n    for i in range(n):\n        q = random.gauss(35, 8)\n        yield (f'@R{i}', 'ACGT'*25, '+', 'I'*100, q)\n\nn = 200000\njelek = sum(1 for _, _, _, _, q in baca_fastq(n) if q < 20)\nprint(f'total read (streaming): {n}')\nprint(f'kualitas buruk (Q<20): {jelek} ({jelek/n:.1%})')\nprint()\nprint('Memori konstan walau n=200rb. Inilah filosofi Unix pipe:')\nprint('proses mengalir, bukan menumpuk.')`,
        checks: [
          { kind: "defined", task: "t1", name: "baca_fastq", label: "`baca_fastq` terdefinisi", msg: "Definisikan fungsi generator baca_fastq(n) dengan yield di dalamnya." },
          { kind: "equal", task: "t2", name: "jelek", value: 6164, tol: 500, label: "`jelek` sekitar 6.164", msg: "Dengan seed 1, sekitar 3,1% dari 200.000 read ber-Q di bawah 20. Cek kondisi q < 20." },
          { kind: "stdout_matches", task: "t3", pattern: "total read \\(streaming\\): 200000", label: "`print` menampilkan total", msg: "Cetak total read dengan format seperti contoh." },
        ],
      },
      reference: "yield = streaming. sum(1 for ... if ...) = pola hitung Unix.",
    },
    {
      id: "lab-dag",
      eyebrow: "Langkah 3 · Lab",
      title: "Simulasi DAG pipeline",
      prose: [
        "Snakemake/Nextflow mendefinisikan pipeline sebagai DAG: tiap tahap mendeklarasikan input dan output. Sistem hanya menjalankan ulang tahap yang input atau parameternya berubah — sisanya di-skip.",
        "Simulasi ini: pipeline qc → trim → mapping → calling. Parameter trimming diubah — tahap mana saja yang harus jalan ulang?",
      ],
      tasks: [
        { id: "t1", text: "Tandai tahap yang kotor (berubah atau dependennya kotor)" },
        { id: "t2", text: "Cetak JALANKAN/skip untuk tiap tahap berurutan" },
      ],
      expected: "JALANKAN trim, mapping, calling · skip qc",
      hints: [
        "Tahap kotor jika tahap[t]['berubah'] True.",
        "Atau jika salah satu dependensinya ada di himpunan kotor.",
        "Dependensi 'qc' adalah file, bukan tahap — cek d in tahap.",
      ],
      code: {
        starter: `tahap = {\n    'qc':      {'in': ['sample.fastq'], 'berubah': False},\n    'trim':    {'in': ['qc'], 'berubah': True},\n    'mapping': {'in': ['trim'], 'berubah': False},\n    'calling': {'in': ['mapping'], 'berubah': False},\n}\nurutan = ['qc', 'trim', 'mapping', 'calling']\n\n# TULIS KODEMU: tandai tahap kotor, cetak keputusan\nkotor = set()\nfor t in urutan:\n    dep_kotor = \n    if :\n        kotor.add(t)\n        print(f'JALANKAN {t} (input/parameter berubah)')\n    else:\n        print(f'skip {t} (up-to-date)')\nprint()\nprint('Ubah parameter trimming -> hanya trim+mapping+calling diulang.')`,
        lockLines: 6,
        solution: `tahap = {\n    'qc':      {'in': ['sample.fastq'], 'berubah': False},\n    'trim':    {'in': ['qc'], 'berubah': True},\n    'mapping': {'in': ['trim'], 'berubah': False},\n    'calling': {'in': ['mapping'], 'berubah': False},\n}\nurutan = ['qc', 'trim', 'mapping', 'calling']\n\n# TULIS KODEMU: tandai tahap kotor, cetak keputusan\nkotor = set()\nfor t in urutan:\n    dep_kotor = any(d in kotor for d in tahap[t]['in'] if d in tahap)\n    if tahap[t]['berubah'] or dep_kotor:\n        kotor.add(t)\n        print(f'JALANKAN {t} (input/parameter berubah)')\n    else:\n        print(f'skip {t} (up-to-date)')\nprint()\nprint('Ubah parameter trimming -> hanya trim+mapping+calling diulang.')`,
        checks: [
          { kind: "contains", task: "t1", name: "kotor", value: "trim", label: "`kotor` memuat trim", msg: "trim berubah (berubah=True) → harus ditandai kotor." },
          { kind: "contains", task: "t1", name: "kotor", value: "mapping", label: "`kotor` memuat mapping", msg: "mapping dependen pada trim yang kotor → ikut kotor." },
          { kind: "contains", task: "t1", name: "kotor", value: "calling", label: "`kotor` memuat calling", msg: "calling dependen pada mapping yang kotor → ikut kotor. qc tidak berubah → tidak kotor." },
          { kind: "stdout_matches", task: "t2", pattern: "skip qc \\(up-to-date\\)", label: "qc di-skip", msg: "Cetak 'skip qc (up-to-date)' untuk tahap yang tidak berubah." },
          { kind: "stdout_matches", task: "t2", pattern: "JALANKAN calling", label: "calling dijalankan ulang", msg: "calling dependen pada mapping yang kotor → harus JALANKAN." },
        ],
      },
      reference: "DAG: hanya yang kotor yang jalan ulang. Snakemake/Nextflow memakai prinsip ini.",
    },
    {
      id: "reprodusibilitas",
      eyebrow: "Langkah 4 · Reproduksibilitas",
      title: "Conda, Docker, Git: tiga lapis pertahanan",
      prose: [
        "Pipeline yang jalan di laptopmu tapi gagal di cluster = 90% masalah lingkungan. Conda mengunci versi tool per proyek (environment.yml); Docker membekukan seluruh OS + tool dalam image yang identik di mana pun. BWA 0.7.17 vs 0.7.18 bisa memberi hasil beda — bekukan versinya.",
        "Git adalah mesin waktu kode: tiap perubahan tercatat dengan pesan. Hasil pipeline aneh? `git diff v2 v3` menunjukkan persis apa yang berubah. Tanpa git, analis menyimpan pipeline_final_v2_REAL.py dan menangis.",
        "Untuk HPC (Slurm): cluster bukan komputer pribadi — ia sistem antrean. Kamu meminta sumber daya (sbatch), bukan menjalankan langsung. Aturan: uji 2 sampel dulu sebelum submit 1.000 job; array job untuk ribuan sampel; jangan komputasi berat di login node.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan peran masing-masing: conda, Docker, Git, Snakemake" },
        { id: "t2", text: "Sebutkan dua aturan etika cluster" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "“Berhasil di laptopku” tanpa environment terkunci = hasil yang tidak bisa diaudit. Di risiko operasional, pipeline tanpa versi tool dan tanpa Git adalah temuan audit: tidak ada yang bisa membuktikan angka laporan berasal dari proses yang diklaim.",
      },
      reference: "Satu env per proyek · commit tiap langkah · test 1 sampel dulu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "“Pipeline berhasil di laptopku”",
      prose: [
        "Analis mengirim pipeline RNA-seq ke kolaborator. Di laptopnya jalan sempurna; di server kolaborator gagal total: versi STAR beda, Python beda, path hardcode /home/analis/. Deadline paper 2 minggu.",
        "Tiga dosa reproduksibilitas: tool tanpa versi pin, path absolut hardcode, dan tanpa workflow manager (urutan manual tak terdokumentasi). Resepnya: conda environment.yml atau Docker image dengan versi pin; path relatif + config file; Snakemake/Nextflow untuk orkestrasi; Git untuk kode; test di mesin bersih (fresh container) sebelum kirim.",
        "Pelajaran: “berhasil di laptopku” bukan bukti — bukti adalah orang lain bisa menjalankannya dari nol.",
      ],
      tasks: [
        { id: "t1", text: "Diagnosis: sebutkan tiga dosa reproduksibilitas pada kasus ini" },
        { id: "t2", text: "Tulis resep perbaikan agar tidak terulang" },
      ],
      reference: "Bukti = orang lain bisa jalan dari nol, bukan “di laptopku bisa”.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Alat apa untuk skala apa",
      prose: [
        "Eksplorasi cepat file besar → head/grep/awk + pipe. Streaming: cepat, hemat RAM.",
        "Analisis berulang (>2 kali atau >10 file) → script bash/Python. Reproducible; sekali tulis, selamanya jalan.",
        "Pipeline multi-tahap (>3 tahap, butuh resume/paralel) → Snakemake/Nextflow. DAG + otomatisasi + portabel ke HPC/cloud.",
        "Komputasi berat (mapping ratusan sampel) → HPC/Slurm atau cloud. Laptop menyerah; ratusan core paralel.",
        "Share pipeline → conda env / Docker + Git. Lingkungan beku + kode berversi = reproducible.",
        "Aritmetika skala: QC 1.000 file via GUI ≈ 67 jam; bash loop di 32 core ≈ 2 jam. Pada 10.000 sampel, GUI butuh 85 hari kerja.",
      ],
      tasks: [
        { id: "t1", text: "Untuk pipeline RNA-seq 240 sampel yang dishare ke lab lain, pilih tumpukannya" },
        { id: "t2", text: "Untuk cek 5 read pertama FASTQ 100 GB, pilih alatnya" },
      ],
      reference: "Terminal dulu, GUI kemudian. Stream, jangan load. Satu env per proyek.",
    },
    {
      id: "adv-robust-script",
      eyebrow: "Langkah 7 · Advanced",
      title: "Scripting robust: pipefail, error handling, dan paralelisasi",
      prose: [
        "Pipeline shell yang “berhasil” diam-diam adalah mimpi buruk bioinformatika. Penyebab nomor satu: pipe menyembunyikan error. Di `bwa mem ref.fa r1.fq r2.fq | samtools sort -o out.bam`, exit status yang dicek shell hanyalah perintah TERAKHIR (samtools sort). Jika bwa crash di tengah, pipe tetap “sukses” dan kamu mendapat BAM setengah jadi tanpa peringatan. Solusinya satu baris di awal setiap script: `set -euo pipefail` — `-e` berhenti saat perintah gagal, `-u` menolak variabel tak terdefinisi, `-o pipefail` membuat pipe gagal bila ada anggotanya yang gagal.",
        "Aturan kedua: jangan percaya file output yang tidak kamu validasi. Pola profesional adalah menulis ke file sementara lalu me-rename hanya bila sukses: `bwa mem ... > tmp.bam && mv tmp.bam final.bam`. Dengan begitu, file `final.bam` yang ada selalu utuh — tidak pernah setengah tulis. Tambahkan `set -x` (atau log dengan timestamp) saat debugging agar setiap perintah tercatat; log adalah satu-satunya saksi saat pipeline 6 jam gagal di menit ke-355.",
        "Paralelisasi adalah pengganda kecepatan yang paling murah. `xargs -P 8` atau GNU parallel menjalankan 8 pekerjaan sekaligus — untuk 240 sampel RNA-seq di workstation 16-core, waktu turun dari ~20 jam menjadi ~3 jam. Tapi ada trade-off: tool yang rakus memori (mis. STAR butuh ~30 GB RAM per proses) akan OOM bila diparalel buta. Aturan: paralel = min(jumlah core, total RAM / RAM per proses). Selalu ukur dulu satu sampel sebelum melepas 240.",
        "Mode kegagalan yang paling mahal: script tanpa `set -euo pipefail` yang “selesai” dalam 10 menit untuk pekerjaan 10 jam — ia gagal cepat di langkah pertama dan semua langkah berikutnya memproses file kosong. Kebiasaan senior: setelah tiap tahap mahal, ada assert eksplisit (`[ -s out.bam ] || exit 1`). Murah, membosankan, dan menyelamatkan minggu kerjamu.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa pipe tanpa `pipefail` bisa menghasilkan BAM setengah jadi tanpa error" },
        { id: "t2", text: "Hitung batas paralel aman untuk tool 30 GB RAM di mesin 128 GB / 16 core" },
      ],
      reference: "set -euo pipefail di tiap script · tulis-tmp-lalu-rename · paralel = min(core, RAM/RAM-proses).",
    },
    {
      id: "adv-tmux-cluster",
      eyebrow: "Langkah 8 · Advanced",
      title: "tmux, sesi jauh, dan reproduksibilitas yang bisa diwariskan",
      prose: [
        "Pekerjaan bioinformatika berjalan berjam-jam di server jauh — dan koneksi SSH pasti putus di saat terburuk. tmux adalah jawabannya: `tmux new -s rnaseq` membuka sesi persisten, `Ctrl-b d` melepaskannya, `tmux attach -t rnaseq` kembali kapan pun, bahkan dari laptop berbeda. Job yang jalan di dalam tmux selamat dari putusnya SSH, matinya laptop, dan bergantinya WiFi. Aturan: tidak ada job > 30 menit yang dijalankan di luar tmux (atau di luar job scheduler).",
        "Di cluster, tmux digantikan scheduler (SLURM/SGE): `sbatch` mengantrekan pekerjaan dengan permintaan sumber daya eksplisit (`--cpus-per-task=8 --mem=64G --time=12:00:00`). Mode kegagalan pemula: menjalankan assembly genom di login node — admin akan mematikan prosesmu dan reputasimu ikut mati. Etika cluster: login node untuk edit dan submit saja; komputasi selalu lewat sbatch.",
        "Reproduksibilitas yang bisa diwariskan punya tiga komponen: kode (Git — commit + tag per analisis final), environment (`conda env export > env.yml` atau Docker image dengan tag versi, bukan `latest`), dan seed untuk langkah stokastik. “Berhasil di laptop saya” bukan reproduksibilitas; “orang lain bisa menjalankan ulang dari repo dan mendapat angka sama” barulah.",
        "Trade-off terakhir: kecepatan vs keterlacakan. Script cepat-and-kotor wajar untuk eksplorasi satu sore — tapi saat hasilnya masuk ke laporan atau publikasi, ia harus naik kelas: di-Git, ber-environment pin, ber-log. Aturan 10 detik: eksplorasi boleh kotor, kesimpulan tidak boleh.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa job panjang wajib di dalam tmux atau sbatch, bukan shell SSH langsung" },
        { id: "t2", text: "Sebutkan tiga komponen reproduksibilitas yang bisa diwariskan ke orang lain" },
      ],
      reference: "tmux untuk sesi jauh · sbatch untuk cluster · Git + env pin + seed = reproduksibel.",
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
        title: "Intuisi: terminal adalah laboratorium, perlakukan seperti itu",
        body: "Empat heuristik praktisi command-line bioinformatika. Pertama, terminal bukan kalkulator — ia laboratorium: setiap perintah eksperimen harus bisa diulang. Simpan perintah penting ke script sejak percobaan kedua; history shell adalah memori yang bocor. Kedua, curigai kesuksesan yang terlalu cepat: pipeline 10 jam yang selesai 10 menit hampir pasti gagal diam-diam di tengah (pipe tanpa pipefail adalah tersangka utama). Selalu cek ukuran dan isi file output, bukan hanya exit code. Ketiga, untuk file raksasa, jangan pernah `cat` atau memuat semuanya ke memori: eksplorasi dengan `head`, `less`, `wc -l`, dan `awk` — alat yang streaming. Aturannya: data mengalir, bukan menumpuk. Keempat, sebelum menjalankan apa pun yang destruktif (`rm -rf`, overwrite), jalankan versi keringnya dulu (echo, --dry-run, atau ke direktori sampah). Satu `rm` yang salah mengetik bisa menghapus bulan kerja; tidak ada “undo” di terminal.",
      },
      summary: [
        "Terminal: bahasa ibu bioinformatika; pipe = streaming tanpa beban RAM.",
        "Kuasai 20 perintah inti; jangan timpa file mentah.",
        "Conda/Docker: bekukan lingkungan (versi tool) untuk reproducibility.",
        "Git: version control; commit tiap langkah logis.",
        "Snakemake/Nextflow: pipeline sebagai DAG — paralel, resume, portabel.",
        "HPC/Slurm: submit ribuan job; test 1 sampel dulu.",
      ],
      next: { label: "BI5 · Biopython & Bioconductor", href: "/v2/learn/bi5-biopython-r" },
      quiz: [
        {
          q: "`bwa mem ref.fa r1.fq r2.fq | samtools sort -o out.bam` selesai tanpa error, tapi out.bam hanya 2 MB untuk sampel 50 GB. Kemungkinan terbesar?",
          options: [
            { text: "Kompresi BAM sangat efisien", why: "BAM tidak bisa mengompres 50 GB menjadi 2 MB — ini bukan kompresi, ini kegagalan." },
            { text: "bwa gagal di tengah tapi pipe menyembunyikan error-nya", why: "Exit status pipe = perintah terakhir. Tanpa `set -o pipefail`, kegagalan bwa tidak terdeteksi.", correct: true },
            { text: "Sampel memang sekecil itu", why: "Sampel 50 GB tidak menghasilkan BAM 2 MB dalam keadaan normal." },
            { text: "samtools sort menghapus read duplikat", why: "Sort tidak menghapus read; dan tidak akan menyusutkan 25.000x lipat." },
          ],
        },
        {
          q: "Di cluster SLURM, kamu menjalankan assembly genom 200 GB langsung di login node. Masalahnya?",
          options: [
            { text: "Tidak ada — login node memang untuk komputasi", why: "Salah: login node untuk edit dan submit; komputasi berat lewat sbatch." },
            { text: "Bisa dimatikan admin dan mengganggu pengguna lain", why: "Login node adalah sumber daya bersama. Pekerjaan berat wajib lewat scheduler dengan alokasi eksplisit.", correct: true },
            { text: "Assembly tidak bisa jalan di login node secara teknis", why: "Bisa jalan — masalahnya etika dan kebijakan, bukan teknis." },
            { text: "Hasilnya pasti salah", why: "Hasilnya bisa benar; yang dilanggar adalah aturan main cluster." },
          ],
        },
        {
          q: "Script menulis output langsung ke `final.bam` dan crash di tengah jalan. Lalu di-run ulang. Masalahnya?",
          options: [
            { text: "Tidak ada — run ulang menimpa dengan sempurna", why: "File setengah jadi tidak bertanda; run ulang bisa append atau campur data lama-baru." },
            { text: "File setengah-tulis tanpa penanda — pola benar: tulis ke tmp, rename hanya bila sukses", why: "`tulis tmp && mv tmp final` menjamin file final yang ada selalu utuh.", correct: true },
            { text: "Solusinya menghapus `set -e`", why: "Menghapus `set -e` justru menyembunyikan kegagalan lebih dalam." },
            { text: "BAM tidak bisa ditulis bertahap", why: "Bisa — masalahnya bukan format, melainkan tidak ada penanda kegagalan." },
          ],
        },
        {
          q: "Kenapa command line wajib di bioinformatika?",
          options: [
            { text: "Terlihat keren", why: "Alasan kosmetik; bukan alasan profesional." },
            { text: "Data terlalu besar untuk GUI; tool bioinformatika native CLI; otomasi ribuan file", why: "100 GB tidak bisa diklik. Semua lowongan bioinformatikawan mensyaratkan Unix.", correct: true },
            { text: "Gratis", why: "Banyak GUI juga gratis; bukan itu masalahnya." },
            { text: "Tidak ada alasan", why: "Ada: skala, otomasi, dan reproduksibilitas." },
          ],
        },
        {
          q: "Fungsi utama conda environment per proyek?",
          options: [
            { text: "Hemat disk", why: "Environment justru memakai disk ekstra; bukan tujuannya." },
            { text: "Isolasi versi tool per proyek — reproducibility lingkungan", why: "BWA 0.7.17 vs 0.7.18 bisa beda hasil. Bekukan lingkungan = bekukan ketidakpastian.", correct: true },
            { text: "Mempercepat komputasi", why: "Conda tidak mempercepat; ia menstabilkan." },
            { text: "Wajib lisensi", why: "Tidak ada kaitan dengan lisensi." },
          ],
        },
        {
          q: "Keunggulan Snakemake/Nextflow atas script manual berurutan?",
          options: [
            { text: "Lebih pendek", why: "Bisa lebih panjang; bukan itu nilainya." },
            { text: "DAG: otomatis skip yang up-to-date, paralel, resume yang gagal", why: "Orkestra vs main solo. Untuk pipeline >3 tahap, ini pembeda profesional.", correct: true },
            { text: "Lebih cantik", why: "Estetika bukan alasan teknis." },
            { text: "Tidak ada", why: "Ada: resume parsial menghemat hari komputasi." },
          ],
        },
        {
          q: "Sebelum submit 1.000 job ke Slurm, yang wajib?",
          options: [
            { text: "Langsung submit", why: "1.000 job gagal = 1.000x malu + antrean penuh." },
            { text: "Test 1 sampel sampai lolos + dry-run (cluster bukan tempat debugging)", why: "Fail fast menghemat core-jam dan reputasi di mata admin cluster.", correct: true },
            { text: "Minta izin teman", why: "Izin yang dibutuhkan adalah kuota/akun cluster, bukan teman." },
            { text: "Restart cluster", why: "Kamu tidak punya wewenang me-restart cluster bersama." },
          ],
        },
        {
          q: "Git paling berharga saat…",
          options: [
            { text: "Kode masih sedikit", why: "Justru saat riwayat panjang, git bersinar." },
            { text: "Hasil aneh dan perlu tahu apa yang berubah sejak versi yang berhasil", why: "Mesin waktu + notulen. git diff/log menjawab “sejak kapan hasil berubah?”.", correct: true },
            { text: "Tidak pernah", why: "Tanpa git, “versi 3 Januari yang jalan” tidak bisa ditemukan." },
            { text: "Hanya untuk tim besar", why: "Analis solo pun butuh mesin waktu untuk dirinya sendiri." },
          ],
        },
      ],
    },
  ],
};
