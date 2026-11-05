import type { V2Lesson } from "../lib/types";

export const bi5: V2Lesson = {
  slug: "bi5-biopython-r",
  track: "Bioinformatika",
  module: "Fondasi",
  title: "BI5 · Biopython & R: Ngoding untuk Biologi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "3 jam vs 3 menit",
      prose: [
        "Magang diminta menghitung GC% dari 500 sekuens gen. Ia buka satu per satu di web tool, copy-paste ke Excel — 3 jam, 12 salah ketik. Senior menulis 10 baris Biopython: parse + GC — 3 menit, nol error, plus script-nya bisa dipakai lagi selamanya.",
        "Itulah seluruh argumen lesson ini: di bioinformatika, ngoding bukan skill tambahan — ia adalah pipet dan mikroskopmu. Biopython (Python) dan Bioconductor (R) adalah dua kotak perkakas standar yang muncul di hampir semua lowongan.",
        "Twist-nya: 3 menit vs 3 jam hanyalah awal. Empat tahun kemudian, script 10 baris si senior masih dipakai 20 orang di lab — sudah memproses 2 juta sekuens — sementara spreadsheet si magang bahkan tidak bisa dibuka ulang karena link web tool-nya mati. Kode adalah aset yang berlipat; kerja manual adalah biaya yang terulang.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa script mengalahkan kerja manual untuk 500 sekuens" },
        { id: "t2", text: "Sebutkan peran Biopython dan Bioconductor masing-masing" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Copy-paste kode dari vignette atau forum lalu menganggapnya “sudah bisa”. Bisa jalan ≠ paham. Pahami tiap baris sebelum percaya outputnya — terutama parameter statistiknya.",
      },
      reference: "Ngoding = leverage. Tugas sehari manual = sejam dengan script.",
    },
    {
      id: "lab-seq",
      eyebrow: "Langkah 2 · Lab",
      title: "Objek Seq ala Biopython",
      prose: [
        "Biopython membungkus sekuens dalam objek `Seq`: bukan string mentah, tapi objek dengan alfabet tervalidasi dan method seperti komplemen, reverse complement, dan translasi.",
        "Di lab ini kamu mensimulasikan kelas `Seq` versi mini. Perhatikan validasi alfabet di constructor: data kotor (`Seq('ATGXYZ')`) tertangkap di awal dengan error yang jelas — bukan crash misterius jam 2 pagi.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi method `komplemen()` dan `reverse_komplemen()`" },
        { id: "t2", text: "Lengkapi method `gc()` (proporsi G+C)" },
        { id: "t3", text: "Jalankan dan cocokkan outputnya" },
      ],
      expected: "komplemen: TACGC..., GC: 53%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai string mentah untuk sekuens di proyek besar. Tanpa validasi alfabet, satu huruf typo (“N” tak terduga, spasi nyasar) meracuni seluruh analisis diam-diam. Objek tervalidasi menangkapnya di baris pertama.",
      },
      hints: [
        "Komplemen: translate tiap huruf dengan tabel komplement.",
        "Reverse complement = komplemen yang dibalik ([::-1]).",
        "gc(): (count G + count C) / panjang — kembalikan proporsi 0-1.",
      ],
      code: {
        starter: `class Seq:\n    komplement = str.maketrans('ATGC', 'TACG')\n    def __init__(self, s):\n        s = s.upper()\n        assert set(s) <= set('ATGC'), 'alfabet tidak valid!'\n        self.s = s\n    def komplemen(self):\n        return  # TULIS KODEMU\n    def reverse_komplemen(self):\n        return  # TULIS KODEMU\n    def gc(self):\n        return  # TULIS KODEMU\n    def __len__(self): return len(self.s)\n    def __repr__(self): return f'Seq({self.s[:20]}...)'\n\ndna = Seq('ATGCGTTAGCCGTAA')\nprint(dna)\nprint('komplemen :', dna.komplemen().s)\nprint('rev-komp  :', dna.reverse_komplemen().s)\nprint(f'GC        : {dna.gc():.0%}')`,
        lockLines: 7,
        solution: `class Seq:\n    komplement = str.maketrans('ATGC', 'TACG')\n    def __init__(self, s):\n        s = s.upper()\n        assert set(s) <= set('ATGC'), 'alfabet tidak valid!'\n        self.s = s\n    def komplemen(self):\n        return Seq(self.s.translate(self.komplement))\n    def reverse_komplemen(self):\n        return Seq(self.s.translate(self.komplement)[::-1])\n    def gc(self):\n        return (self.s.count('G') + self.s.count('C')) / len(self.s)\n    def __len__(self): return len(self.s)\n    def __repr__(self): return f'Seq({self.s[:20]}...)'\n\ndna = Seq('ATGCGTTAGCCGTAA')\nprint(dna)\nprint('komplemen :', dna.komplemen().s)\nprint('rev-komp  :', dna.reverse_komplemen().s)\nprint(f'GC        : {dna.gc():.0%}')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "komplemen : TACGC", label: "komplemen benar", msg: "ATGCGTTAGCCGTAA → TACGC.... Pakai self.s.translate(self.komplement)." },
          { kind: "stdout_matches", task: "t1", pattern: "rev-komp  : TTACGGCTAACGCAT", label: "reverse komplemen benar", msg: "Komplemen dulu, lalu balik: [::-1]." },
          { kind: "stdout_matches", task: "t2", pattern: "GC\\s+: 47%", label: "GC = 47%", msg: "(G+C)/panjang dari ATGCGTTAGCCGTAA = 7/15 = 47%." },
        ],
      },
      reference: "Biopython: Seq + SeqRecord + SeqIO = pola ini versi profesional.",
    },
    {
      id: "lab-orf",
      eyebrow: "Langkah 3 · Lab",
      title: "Translasi 6-frame dan ORF terpanjang",
      prose: [
        "Gen bisa dibaca dari 6 frame: 3 frame maju (offset 0, 1, 2) dan 3 frame di reverse complement. ORF (open reading frame) adalah segmen dari kodon start (M) sampai stop — kandidat gen.",
        "Inilah logika dasar prediksi gen: terjemahkan semua frame, cari ORF bermakna terpanjang. Coba ubah sekuensnya dan lihat ORF-nya berpindah frame.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `translate` (kodon → asam amino)" },
        { id: "t2", text: "Jalankan 6 frame dan temukan ORF terpanjang" },
      ],
      expected: "ORF terpanjang: frame +3, 3 aa",
      hints: [
        "Potong s per 3 huruf dari indeks 0 sampai len(s)-2.",
        "Kodon tak dikenal → 'X' via kodon.get(..., 'X').",
        "ORF = bagian setelah 'M' pertama, sebelum '*' berikutnya.",
      ],
      code: {
        starter: `kodon = {'ATG':'M','TTT':'F','TTC':'F','TTA':'L','TAA':'*','TAG':'*',\n         'TGA':'*','GCT':'A','GCC':'A','GGT':'G','AAA':'K'}\n\ndef translate(s):\n    # TULIS KODEMU: terjemahkan per kodon, kembalikan string protein\n    return \n\ndef revcomp(s):\n    return s.translate(str.maketrans('ATGC','TACG'))[::-1]\n\nseq = 'AAATGTTTAAATAGGGATGTAAACC'\nprint(f'sekuens: {seq}')\nterpanjang = ('', 0)\nfor fr in range(3):\n    for label, s in [('+', seq), ('-', revcomp(seq))]:\n        prot = translate(s[fr:])\n        for bagian in prot.split('*'):\n            if 'M' in bagian:\n                orf = bagian[bagian.index('M'):]\n                if len(orf) > terpanjang[1]:\n                    terpanjang = (f'{label}{fr+1}', len(orf))\n        print(f'  frame {label}{fr+1}: {prot}')\nprint(f'ORF terpanjang: frame {terpanjang[0]}, {terpanjang[1]} aa')`,
        lockLines: 2,
        solution: `kodon = {'ATG':'M','TTT':'F','TTC':'F','TTA':'L','TAA':'*','TAG':'*',\n         'TGA':'*','GCT':'A','GCC':'A','GGT':'G','AAA':'K'}\n\ndef translate(s):\n    # TULIS KODEMU: terjemahkan per kodon, kembalikan string protein\n    return ''.join(kodon.get(s[i:i+3], 'X') for i in range(0, len(s)-2, 3))\n\ndef revcomp(s):\n    return s.translate(str.maketrans('ATGC','TACG'))[::-1]\n\nseq = 'AAATGTTTAAATAGGGATGTAAACC'\nprint(f'sekuens: {seq}')\nterpanjang = ('', 0)\nfor fr in range(3):\n    for label, s in [('+', seq), ('-', revcomp(seq))]:\n        prot = translate(s[fr:])\n        for bagian in prot.split('*'):\n            if 'M' in bagian:\n                orf = bagian[bagian.index('M'):]\n                if len(orf) > terpanjang[1]:\n                    terpanjang = (f'{label}{fr+1}', len(orf))\n        print(f'  frame {label}{fr+1}: {prot}')\nprint(f'ORF terpanjang: frame {terpanjang[0]}, {terpanjang[1]} aa')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "ORF terpanjang: frame \\+3, 3 aa", label: "ORF terpanjang ditemukan", msg: "Frame +3: MFK*XXK → ORF 'MFK' (3 aa). Cek translate tiap kodon; ORF dari M ke *." },
          { kind: "stdout_matches", task: "t1", pattern: "frame \\+1: \\S+", label: "frame +1 terjemahkan", msg: "translate harus mengembalikan string protein per frame." },
        ],
      },
      reference: "6 frame = 3 maju + 3 reverse. ORF = M sampai *. Dasar gene finding.",
    },
    {
      id: "python-r",
      eyebrow: "Langkah 4 · Dua bahasa",
      title: "Python vs R: pilih per tugas, bukan per agama",
      prose: [
        "Aturan praktis industri: Python untuk engineering — parsing, pipeline, API, ML. R/Bioconductor untuk statistik genomik dan visualisasi publikasi — DESeq2 dan edgeR adalah standar emas yang ditulis di R. Pipeline nyata bilingual.",
        "Contoh proyek RNA-seq bilingual: Python mengunduh SRA (Entrez), parsing QC, submit job cluster; R menjalankan DESeq2 dan volcano plot; Python lagi untuk ML downstream. Lem antar bahasa: file TSV atau jembatan seperti reticulate.",
        "Jebakan klasik proyek bilingual: R 1-based, Python 0-based. Tertukar = off-by-one lintas bahasa. Dan etika Entrez: unduh massal dari NCBI wajib email terdaftar dan maksimal 3 request/detik — IP yang diblokir NCBI adalah cerita memalukan.",
      ],
      tasks: [
        { id: "t1", text: "Untuk parsing FASTQ 100 GB, pilih bahasanya dan alasannya" },
        { id: "t2", text: "Untuk differential expression RNA-seq, pilih bahasanya dan alasannya" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Fanatik satu bahasa dan menolak yang lain. “Python person” yang tidak bisa baca vignette DESeq2 kesulitan di RNA-seq; “R person” yang tidak bisa parsing FASTQ 100 GB kesulitan di NGS. Fleksibilitas mengalahkan fanatisme.",
      },
      reference: "Python = engineering/pipeline/ML · R = statistik genomik/visualisasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: Python atau R untuk tugas ini?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Parsing FASTQ 100 GB di laptop 16 GB. → Python, `SeqIO.parse` streaming — jangan `list(SeqIO.parse(...))` ke RAM. Alasan: iterator memproses satu read dalam satu waktu; 100 GB tetap muat di memori kecil. Contoh nyata: QC 300 juta read tanpa server.",
        "Skenario 2 — Analisis differential expression RNA-seq standar. → R/Bioconductor, pakai DESeq2 langsung. Alasan: standar emas yang divalidasi satu dekade; menulis ulang di Python membuang waktu dan kepercayaan. Contoh nyata: paper yang reviewer-nya meminta “DESeq2 atau edgeR”.",
        "Skenario 3 — Machine learning di atas matriks ekspresi. → Python (scikit-learn); lem antar bahasa = file TSV. Alasan: ekosistem ML Python jauh lebih matang; TSV cukup sebagai jembatan tanpa jembatan eksotis. Contoh nyata: klasifier subtipe tumor dari 20 ribu gen.",
        "Skenario 4 — Pipeline multi-langkah yang jalan di cluster. → Snakemake (Python) dengan aturan input-output eksplisit. Alasan: dependensi otomatis, paralel gratis, portabel ke cloud. Contoh nyata: 400 sampel WES yang tiap sampelnya 12 langkah.",
        "Skenario 5 — Plot statistik kompleks untuk publikasi. → R/ggplot2. Alasan: gramatika grafiknya dirancang untuk statistik; satu baris `geom_` menggantikan 30 baris matplotlib. Contoh nyata: volcano plot multi-panel untuk suplemen.",
        "Aturan praktis 10 detik: engineering, parsing, pipeline, ML → Python; statistik genomik dan plot publikasi → R; pilih per tugas, bukan per agama."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menulis ulang DESeq2 di Python “agar satu bahasa” — membuang sepuluh tahun validasi statistik demi kenyamanan. Pakai tool standar di bahasa aslinya; TSV cukup sebagai lem.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "500 gen, deadline besok pagi",
      prose: [
        "Manajer meminta: GC%, panjang, dan translasi untuk 500 gen dari file GenBank — besok pagi. Magang mulai copy-paste manual. Kamu punya 1 jam.",
        "Rencana 10 baris: parse dengan SeqIO, loop tiap record — ambil sekuens, hitung panjang, GC, translate; tulis ke TSV. Estimasi: 10 menit tulis + 1 menit jalan + 10 menit validasi spot-check 5 gen manual. Total di bawah 30 menit. Sisa waktu: buat plot distribusi GC% sebagai bonus.",
        "Pelajaran: di bioinformatika, ngoding = leverage. Tugas “sehari” manual = tugas “sejam” dengan script — dan script-nya reusable selamanya. Inilah kenapa skill ini ada di semua lowongan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis rencana 10 baris kode (konseptual) untuk tugas ini" },
        { id: "t2", text: "Jelaskan kenapa spot-check 5 gen tetap wajib" },
      ],
      reference: "Fungsi untuk 1 sekuens → uji kasus tepi → loop batch. Satu bug, satu tempat perbaiki.",
    },
    {
      id: "adv-streaming",
      eyebrow: "Langkah 7 · Advanced",
      title: "Parsing efisien: streaming, indexing, dan jebakan memori",
      prose: [
        "Aturan memori nomor satu bioinformatika: jangan pernah memuat file yang lebih besar dari RAM-mu. `SeqIO.parse` adalah generator — ia menghasilkan satu record dalam satu waktu (lazy), sehingga FASTQ 100 GB bisa diproses di laptop 8 GB. Lawannya, `list(SeqIO.parse(...))` memaksa semua record ke memori sekaligus: itulah baris kode yang membuat script “tiba-tiba” dimatikan sistem (OOM killer) setelah berjalan 40 menit. Perbedaannya satu kata — `list` — dan akibatnya satu malam kerja.",
        "Untuk akses acak ke file besar, `SeqIO.index` membangun indeks (offset byte tiap record) tanpa memuat sekuensnya: kamu bisa melompat ke record ke-5.000.000 dalam milidetik, memakai memori hanya untuk tabel offset. Pola profesional: satu kali indexing, berkali-kali akses — mirip membuat indeks buku sebelum membacanya berulang-ulang.",
        "Di R, jebakan yang sama bernama `read.csv` pada tabel 10 juta baris: `data.table::fread` 10–50x lebih cepat dan hemat memori dibanding `read.csv`/`read.table` bawaan, dan operasi `data.table` (keyed, by-reference) menghindari salinan data yang diam-diam menggandakan pemakaian RAM. Untuk count matrix RNA-seq (20 ribu gen × ratusan sampel), perbedaan ini adalah antara “jalan” dan “tidak jalan”.",
        "Aturan keputusan: file < 1 GB boleh dimuat utuh; 1–50 GB wajib streaming atau indexing; > 50 GB pertimbangkan chunking + paralel atau format kolom (Parquet). Dan selalu ukur: `tracemalloc` (Python) atau `pryr::object_size` (R) sebelum berasumsi — tebakan tentang memori hampir selalu salah.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan `SeqIO.parse` vs `list(SeqIO.parse(...))` dari sisi memori" },
        { id: "t2", text: "Untuk akses acak ke FASTQ 50 GB, pilih `SeqIO.index` atau `SeqIO.parse` dan alasannya" },
      ],
      reference: "parse = streaming (lazy) · index = akses acak hemat RAM · fread > read.csv untuk tabel besar.",
    },
    {
      id: "adv-workflow-glue",
      eyebrow: "Langkah 8 · Advanced",
      title: "Kode sebagai lem workflow: dari script ke pipeline",
      prose: [
        "Script yang baik bukan yang pintar — melainkan yang bisa dipanggil pipeline. Prinsipnya: satu script, satu tugas, input-output eksplisit lewat argumen (`argparse`), tanpa path hardcode, dan exit code jujur (0 sukses, bukan-nol gagal). Script seperti ini bisa langsung dibungkus Snakemake/Nextflow sebagai satu rule — script yang membaca path hardcode dari laptop penulisnya tidak bisa.",
        "Pola “lem” bilingual yang paling awet bukanlah jembatan antar-bahasa yang eksotis (rpy2, reticulate) melainkan file perantara sederhana: TSV/Parquet. Python menulis tabel hasil QC → R membaca untuk DESeq2 → Python membaca hasilnya untuk ML. File perantara membuat tiap tahap bisa di-debug, di-cache, dan dijalankan ulang independen — keuntungan yang hilang begitu kamu menyatukan semuanya dalam satu proses raksasa.",
        "Untuk Entrez/NCBI programatik lewat Biopython: selalu set `Entrez.email`, hormati 3 request/detik (10 dengan API key), dan gunakan `epost` + `efetch` dengan WebEnv untuk unduhan ribuan ID — bukan loop `efetch` satu per satu yang lambat dan kasar. Cache hasil unduhan (GenBank record jarang berubah); mengunduh ulang 20.000 record setiap run adalah pemborosan bandwidth dan undangan untuk diblokir.",
        "Mode kegagalan klasik: script “berhasil” tapi tidak idempoten — dijalankan dua kali menghasilkan output ganda atau menimpa input. Aturan: script pipeline harus aman dijalankan ulang (tulis ke output baru, jangan append ke file yang sama), dan harus gagal cepat dengan pesan jelas bila input tidak sesuai ekspektasi (validasi header/kolom di awal, bukan di tengah).",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga syarat agar script Python bisa langsung dipakai sebagai rule Snakemake" },
        { id: "t2", text: "Jelaskan kenapa file TSV/Parquet lebih awet daripada jembatan antar-bahasa untuk pipeline" },
      ],
      reference: "Satu script satu tugas · argparse + exit code jujur · TSV/Parquet sebagai lem · cache unduhan Entrez.",
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
        title: "Intuisi: ngoding bioinformatika = plumbing data",
        body: "Tiga heuristik dari praktisi yang hidup dari pipeline. Pertama, pikirkan aliran, bukan objek: data genomik adalah sungai (GB–TB), bukan ember. Setiap kali kamu tergoda memuat “semuanya ke memori dulu”, tanya apakah sungai ini bisa dialirkan (streaming) — hampir selalu bisa. Kedua, tulis kode untuk pembaca kedua: dirimu 6 bulan lagi, atau kolega yang mewarisi pipeline-mu. Nama variabel yang jujur (`genom_ref`, bukan `x`), satu fungsi satu tugas, dan contoh input-output di docstring mengalahkan komentar puitis. Ketiga, jadikan komputer sebagai asisten yang cerewet: assert di setiap asumsi (“kolom ini pasti ada”, “file ini tidak kosong”), fail fast dengan pesan yang menyebut file dan barisnya. Script yang gagal keras di menit pertama jauh lebih murah daripada script yang “berhasil” menghasilkan angka salah setelah 8 jam. Keempat — bonus dari lapangan: simpan setiap snippet yang berhasil ke library pribadimu; bioinformatika adalah akumulasi pola, bukan penemuan ulang.",
      },
      summary: [
        "Biopython: Seq, SeqIO, Entrez — multitool Python untuk sekuens.",
        "Bioconductor: 2.300+ paket R; rumah statistik genomik (DESeq2).",
        "Python = engineering/pipeline/ML; R = statistik/visualisasi.",
        "Proyek nyata bilingual; fanatisme bahasa = tidak produktif.",
        "Waspadai 1-based (R) vs 0-based (Python).",
        "Bangun snippet library pribadi dari tiap lesson.",
      ],
      next: { label: "BI6 · Alignment & BLAST", href: "/learn/bi6-alignment" },
      quiz: [
        {
          q: "Script memproses FASTQ 100 GB dengan `records = list(SeqIO.parse('data.fq', 'fastq'))` lalu mati setelah 40 menit tanpa pesan error jelas. Diagnosis?",
          options: [
            { text: "File FASTQ-nya korup", why: "File korup biasanya gagal cepat dengan parse error, bukan mati setelah 40 menit." },
            { text: "Kehabisan memori: `list()` memaksa 100 GB ke RAM (OOM killer)", why: "`SeqIO.parse` itu lazy/generator — membungkusnya dengan `list()` menghancurkan keuntungan streaming.", correct: true },
            { text: "Biopython tidak bisa membaca FASTQ sebesar itu", why: "Bisa — asal streaming, bukan dimuat sekaligus." },
            { text: "Harus memakai R, bukan Python", why: "Bahasa bukan masalahnya; pola akses datanya yang salah." },
          ],
        },
        {
          q: "Pipeline bilingual: Python (QC) → R (DESeq2) → Python (ML). Lem antar tahap yang paling awet?",
          options: [
            { text: "Jembatan in-memory (rpy2/reticulate) agar tanpa file perantara", why: "Rapuh: satu proses raksasa sulit di-debug, di-cache, dan dijalankan ulang per tahap." },
            { text: "File perantara sederhana (TSV/Parquet) antar tahap", why: "Tiap tahap independen, bisa di-cache pipeline (Snakemake), dan diinspeksi manual.", correct: true },
            { text: "Copy-paste angka antar script manual", why: "Tidak terautomasi, tidak terekam, tidak reproduksibel." },
            { text: "Satu bahasa saja untuk semuanya", why: "Memaksa berarti kehilangan DESeq2 (R) atau engineering Python — fanatisme mengalahkan fungsi." },
          ],
        },
        {
          q: "Script pipeline di-run dua kali dan menghasilkan output ganda (baris ter-append dua kali). Perbaikan paling tepat?",
          options: [
            { text: "Jangan pernah run dua kali", why: "Pipeline produksi pasti di-run ulang (gagal, update data) — kerapuhan bukan solusi." },
            { text: "Buat idempoten: tulis ke file output baru (bukan append) + validasi input di awal", why: "Idempoten = aman di-run ulang. Validasi awal = gagal cepat dengan pesan jelas.", correct: true },
            { text: "Hapus file output manual sebelum tiap run", why: "Manual = tidak terautomasi; tetap tidak melindungi dari crash di tengah." },
            { text: "Kecilkan data input", why: "Ukuran data tidak terkait dengan logika append yang salah." },
          ],
        },
        {
          q: "Keunggulan utama Biopython?",
          options: [
            { text: "Paling cepat", why: "Komputasi berat diserahkan ke tool C; Biopython untuk orkestrasi." },
            { text: "Multitool: Seq/SeqIO/Entrez/alignment dalam satu ekosistem Python", why: "Swiss Army Knife — cukup untuk 90% tugas harian; yang spesifik pakai tool khusus.", correct: true },
            { text: "Hanya untuk pemula", why: "Profesional memakainya untuk glue code pipeline setiap hari." },
            { text: "Menggantikan semua tool", why: "Tidak menggantikan BWA/GATK/samtools — ia melengkapi." },
          ],
        },
        {
          q: "Bioconductor unggul di…",
          options: [
            { text: "Game development", why: "Tidak relevan dengan genomik." },
            { text: "Statistik genomik terkurasi (DESeq2, GenomicRanges) + vignette", why: "2.300+ paket ter-review untuk genomik. Rumahnya analisis statistik genomik.", correct: true },
            { text: "Web scraping", why: "Itu wilayah Python (requests/BeautifulSoup)." },
            { text: "Sistem operasi", why: "Tidak ada kaitan." },
          ],
        },
        {
          q: "Jebakan indexing R vs Python?",
          options: [
            { text: "Tidak ada beda", why: "Ada: R mulai dari 1, Python dari 0." },
            { text: "R 1-based, Python 0-based — tertukar = off-by-one", why: "Bug klasik proyek bilingual. Selalu sadar bahasa mana yang dipakai.", correct: true },
            { text: "R lebih cepat", why: "Kecepatan bukan soal indexing." },
            { text: "Python tidak punya index", why: "Python jelas punya index — mulai dari 0." },
          ],
        },
        {
          q: "Kapan pakai R daripada Python?",
          options: [
            { text: "Selalu", why: "Fanatisme bahasa = tidak produktif." },
            { text: "Analisis statistik genomik (DE, enrichment) + visualisasi publikasi", why: "Pilih per tugas. DESeq2 di R adalah standar emas.", correct: true },
            { text: "Tidak pernah", why: "Menolak R = menolak standar emas statistik genomik." },
            { text: "Hanya untuk CSV kecil", why: "R menangani data genomik besar via Bioconductor." },
          ],
        },
        {
          q: "Untuk 1 juta sekuens, prinsip yang benar?",
          options: [
            { text: "Loop Python murni satu per satu", why: "Lambat; tidak selesai dalam waktu wajar." },
            { text: "Operasi batch (list comprehension/numpy) — loop murni lambat", why: "Mulai dari yang benar, optimalkan bila perlu. Pola batch = pola pikir bioinformatika.", correct: true },
            { text: "Satu per satu manual", why: "Itu cerita magang 3 jam di awal lesson." },
            { text: "Tidak masalah caranya", why: "Cara menentukan apakah selesai 3 menit atau 3 hari." },
          ],
        },
      ],
    },
  ],
};
