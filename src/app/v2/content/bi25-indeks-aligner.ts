import type { V2Lesson } from "../lib/types";

export const bi25: V2Lesson = {
  slug: "bi25-indeks-aligner",
  track: "Bioinformatika",
  module: "Sekuens & Evolusi",
  title: "BI25 · Indeks dan Aligner: BWT, FM-Index, dan Cara Kerja BWA/Bowtie",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "100 juta read, 3 miliar huruf, dan jawaban dalam milidetik",
      prose: [
        "Sebuah run sekuensing menghasilkan 100 juta read, masing-masing 150 huruf. Tugasmu: untuk setiap read, temukan di mana ia berasal di genom referensi sepanjang 3 miliar huruf. Cara naif — geser read sepanjang genom dan bandingkan huruf per huruf — butuh sekitar 450 triliun perbandingan untuk satu read saja. Tidak ada komputer yang sanggup. Namun BWA memetakan satu read dalam sepersekian detik. Bagaimana mungkin?",
        "Jawabannya bukan komputer yang lebih cepat, melainkan pertanyaan yang dirumuskan ulang. Lesson ini membedah mesin di dalam aligner: Burrows-Wheeler Transform (BWT) yang menyusun ulang genom agar mudah dicari, FM-index yang menghitung kemunculan pola tanpa memindai teks, dan cara BWA dan Bowtie merangkainya dengan seed-and-extend. BI6 sudah mengajarkan dynamic programming (Needleman-Wunsch dan Smith-Waterman) dan BLAST; BI19 sudah mengajarkan graf de Bruijn untuk assembly. Yang belum pernah dibedah adalah lapisan indeks — cara kerja aligner modern dari dalam. Setelah lesson ini kamu bisa: (1) menghitung BWT dan suffix array sebuah string pendek dengan tangan; (2) menjelaskan cara FM-index menghitung kemunculan pola lewat backward search; (3) menjelaskan alur kerja BWA-MEM dan Bowtie2 serta kapan memilih masing-masing.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada di track ini",
        body: "Alignment eksak dengan dynamic programming ada di BI6; graf de Bruijn dan assembly ada di BI19; pemakaian BWA dan Bowtie sebagai tool (perintah dan pilihan) ada di BI8. Lesson ini mengisi yang kosong di antaranya: struktur data indeks yang membuat pemetaan read menjadi cepat.",
      },
      reference: "BWT = susun ulang agar mudah dicari. FM-index = hitung kemunculan tanpa memindai. Aligner = indeks + seed + DP di ujung.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa membaca manual BWA atau Bowtie dan memahami setiap parameternya sebagai konsekuensi desain indeks, bukan sebagai mantra.",
        "(1) Menghitung Burrows-Wheeler Transform dan suffix array dari string pendek (contoh: BANANA) dengan tangan;",
        "(2) Menjelaskan backward search pada FM-index dan menghitung kemunculan pola, termasuk pola yang tumpang tindih;",
        "(3) Menjelaskan alur BWA-MEM dan Bowtie2 — seed, extend, dan penilaian MAPQ — serta kapan memakai STAR untuk RNA (rujuk BI8);",
        "(4) Mendiagnosis read yang tidak terpetakan: membedakan kontaminasi, splice junction, dan kualitas ujung yang buruk.",
      ],
      tasks: [],
    },
    {
      id: "bwt",
      eyebrow: "Langkah 3 · Teori",
      title: "Burrows-Wheeler Transform: mengacak agar mudah dicari",
      prose: [
        "BWT adalah trik penyusunan ulang. Ambil string BANANA dan tambahkan penanda akhir $ yang dianggap lebih kecil dari semua huruf. Buat semua rotasinya (7 rotasi), urutkan secara alfabetis, lalu ambil kolom terakhir: ANNB$AA. Hasilnya terlihat acak — tetapi ia menyimpan dua hadiah. Pertama, huruf yang sama berkelompok: semua A berkumpul, semua N berkumpul. Itulah kenapa BWT dipakai untuk kompresi (bzip2 memakai ini). Kedua, dan jauh lebih penting, transformasi ini REVERSIBEL: dari ANNB$AA saja, string aslinya BANANA bisa dipulihkan penuh — tidak ada informasi yang hilang.",
        "Kenapa huruf berkelompok itu penting untuk pencarian? Karena di dalam BWT, semua kemunculan satu pola berkumpul di satu interval baris yang berurutan. Mencari pola tidak lagi berarti memindai 3 miliar huruf; ia berarti mempersempit interval baris, lapis demi lapis, dari huruf terakhir pola ke huruf pertama. Setiap langkah mempersempit interval dengan tabel hitungan sederhana — dan itu adalah backward search, inti FM-index.",
        "Suffix array adalah sepupu BWT yang lebih mudah dibayangkan: daftar posisi awal semua sufiks, diurutkan secara alfabetis. Untuk BANANA$, sufiks terurut adalah: $ (posisi 6), A$ (5), ANA$ (3), ANANA$ (1), BANANA$ (0), NA$ (4), NANA$ (2) — jadi suffix array-nya [6, 5, 3, 1, 0, 4, 2]. BWT sebenarnya adalah kolom terakhir dari matriks rotasi yang sama — dua representasi dari satu ide: susun semua sufiks, lalu baca.",
      ],
      tasks: [],
      formula: String.raw`\text{BWT}(x) = \text{kolom terakhir dari rotasi terurut } x`,
      formulaNote: "Contoh: rotasi BANANA$ yang terurut memberi kolom terakhir ANNB$AA. Transformasi ini reversibel — ANNB$AA saja cukup untuk memulihkan BANANA$.",
      note: {
        title: "Sering salah",
        body: "Mengira BWT membuang informasi karena hasilnya terlihat acak. BWT adalah permutasi — tidak satu huruf pun hilang, hanya urutannya berubah. Justru karena reversibel, BWT bisa dipakai sebagai indeks: genom yang sudah di-BWT tetap genom yang sama, hanya disusun agar mudah dicari.",
      },
      reference: "BWT(BANANA$) = ANNB$AA. Suffix array BANANA$ = [6, 5, 3, 1, 0, 4, 2].",
    },
    {
      id: "fm-index",
      eyebrow: "Langkah 4 · Teori",
      title: "FM-index: menghitung kemunculan tanpa memindai teks",
      prose: [
        "FM-index menyimpan BWT ditambah dua tabel kecil: berapa kali tiap huruf muncul sebelum posisi tertentu, dan di mana tiap huruf pertama kali muncul di kolom pertama. Dengan dua tabel itu, backward search bekerja mundur dari huruf terakhir pola: mulai dari interval seluruh baris, tiap huruf mempersempit interval ke baris yang diawali huruf itu. Bila interval menjadi kosong, pola tidak ada. Bila tersisa baris, jumlah baris yang tersisa ADALAH jumlah kemunculan pola — tanpa pernah menyentuh teks aslinya.",
        "Contoh dari lab: pola ANA muncul 2 kali di BANANA (posisi 1 dan 3 — keduanya tumpang tindih), dan NAN muncul 1 kali (posisi 2). Perhatikan jebakan klasik di sini: fungsi hitung bawaan yang tidak tumpang tindih (misal str.count di Python) hanya melaporkan ANA 1 kali, karena setelah cocok di posisi 1 ia melompat ke posisi 4 dan melewatkan kemunculan di posisi 3. Dalam genomik, kehilangan kemunculan yang tumpang tindih berarti kehilangan bukti — aligner menghitung dengan benar, dan analis harus tahu kenapa.",
        "Biaya pencariannya yang membuat segalanya berubah: backward search butuh waktu sebanding dengan PANJANG POLA, bukan panjang genom. Pola 150 huruf dicari dalam sekitar 150 langkah, entah genomnya 5 juta huruf (bakteri) atau 3 miliar huruf (manusia). Itulah kenapa BWA bisa memetakan 100 juta read: setiap read dicari dalam waktu yang hampir tidak tergantung pada ukuran genom.",
      ],
      tasks: [],
      formula: String.raw`\text{waktu cari} \propto |pola|`,
      formulaNote: "Backward search: waktu sebanding dengan panjang pola (sekitar 150 langkah untuk read 150 huruf), bukan dengan panjang genom (3 miliar huruf). Inilah sumber kecepatan aligner.",
      note: {
        title: "Sering salah",
        body: "Menghitung kemunculan pola dengan fungsi hitung yang tidak tumpang tindih. ANA muncul 2 kali di BANANA (posisi 1 dan 3), bukan 1 kali. Selalu hitung dengan pemindaian yang menggeser satu huruf demi satu huruf, atau dengan FM-index yang menghitung interval dengan benar.",
      },
      reference: "ANA di BANANA = 2 (tumpang tindih), NAN = 1. Waktu cari sebanding panjang pola, bukan panjang genom.",
    },
    {
      id: "bwa-bowtie",
      eyebrow: "Langkah 5 · Teori",
      title: "Cara kerja BWA dan Bowtie: seed, extend, dan MAPQ",
      prose: [
        "BWA-MEM dan Bowtie2 memakai resep yang sama dengan bumbu berbeda. Langkah pertama: seed — ambil potongan pendek read (misal 19 huruf) dan cari kemunculannya di FM-index. Seed yang cocok memberi posisi kandidat di genom. Langkah kedua: extend — dari posisi kandidat, perpanjang alignment ke kiri dan kanan dengan dynamic programming ala Smith-Waterman (BI6) untuk menangani mismatch dan indel kecil. Langkah ketiga: nilai — beri skor pemetaan MAPQ yang menyatakan seberapa yakin aligner bahwa posisi ini benar, bukan posisi lain yang mirip.",
        "Perbedaan keduanya penting saat memilih. BWA-MEM memakai seed yang panjang dan adaptif (super-maximal exact match) sehingga kuat untuk read yang mengandung varian dan indel; ia adalah standar untuk DNA (whole genome, exome). Bowtie2 memakai seed pendek dengan backtracking, sangat cepat untuk read yang hampir sama persis dengan referensi; ia unggul untuk tugas seperti pemetaan ChIP-seq atau penyaringan cepat. Keduanya BUKAN splice-aware: read RNA yang melompati intron akan gagal atau terpotong — untuk RNA, pakai STAR (BI8), yang dirancang memahami lompatan intron.",
        "MAPQ adalah angka yang paling sering disalahbaca. MAPQ 60 berarti aligner sangat yakin posisi ini unik; MAPQ 0 berarti read cocok sama baiknya di banyak tempat (misal daerah repetitif) sehingga posisinya pada dasarnya tebakan. Menyaring MAPQ rendah bukan 'membuang data' — ia membuang jawaban yang tidak bisa dipercaya. Sebaliknya, MAPQ tinggi pada read yang sebenarnya berasal dari daerah repetitif adalah tanda bahaya: cek apakah referensimu lengkap, karena read dari daerah yang hilang di referensi akan dipaksa ke 'saudara' terdekatnya dengan MAPQ yang menyesatkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Varian yang dilaporkan dari read MAPQ 0 di daerah repetitif adalah temuan yang lahir dari tebakan posisi, bukan dari biologi. Pipeline yang baik (BI8, BI20) menyaring MAPQ rendah SEBELUM variant calling — varian dari posisi yang tidak yakin adalah varian yang tidak ada.",
      },
      reference: "Seed (FM-index) lalu extend (DP) lalu nilai (MAPQ). BWA-MEM untuk DNA bervarian; Bowtie2 untuk cepat dan hampir-persis; STAR untuk RNA.",
    },
    {
      id: "lab-indeks",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: BWT, suffix array, dan hitung kemunculan",
      prose: [
        "Sekarang bangun sendiri mesin pencarinya dalam skala mainan. Referensi: BANANA$ (tanda $ menandai akhir). Hitung BWT-nya: ANNB$AA. Hitung suffix array-nya: [6, 5, 3, 1, 0, 4, 2]. Lalu hitung kemunculan dua pola: ANA muncul 2 kali (posisi 1 dan 3, tumpang tindih) dan NAN muncul 1 kali (posisi 2).",
        "Perhatikan fungsi hitung di lab: ia menggeser jendela SATU huruf demi satu huruf, sehingga kemunculan yang tumpang tindih ikut terhitung. Bandingkan dengan str.count bawaan Python yang melompat sepanjang pola setelah cocok — untuk ANA ia hanya melaporkan 1. Selisih 1 dan 2 ini bukan soal gaya: dalam genomik, satu kemunculan yang terlewat bisa berarti satu lokus yang hilang dari analisis.",
        "Setelah lolos, coba eksperimen: ganti referensi menjadi MISSISSIPPI$ dan hitung BWT-nya dengan kode yang sama, lalu hitung kemunculan ISSI (2 kali, tumpang tindih) dan SSI (2 kali). Pola yang sama, string yang berbeda — mesinnya tidak berubah.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `bwt(teks)`: urutkan semua rotasi, gabungkan huruf terakhir tiap rotasi, lalu isi `bwt_hasil`" },
        { id: "t2", text: "Tulis `suffix_array(teks)`: posisi awal sufiks dalam urutan alfabetis, lalu isi `sa_hasil`" },
        { id: "t3", text: "Tulis `hitung(teks, pola)`: hitung kemunculan dengan geser satu huruf (tumpang tindih ikut terhitung), lalu isi `ana` dan `nan`" },
        { id: "t4", text: "Cetak bwt_hasil, sa_hasil, ana, dan nan untuk referensi BANANA$" },
      ],
      expected: "bwt=ANNB$AA\nsa=[6, 5, 3, 1, 0, 4, 2]\nANA=2\nNAN=1",
      hints: [
        "Rotasi: teks[i:] + teks[:i] untuk tiap i; urutkan, lalu ambil huruf terakhir tiap rotasi.",
        "Suffix array: sorted(range(len(teks)), key=lambda i: teks[i:]) — tanda $ (kode 36) lebih kecil dari huruf, jadi urutannya benar.",
        "Hitung: for i in range(len(teks) - len(pola) + 1) — geser satu, bukan sepanjang pola.",
        "Jangan pakai str.count: ia tidak menghitung kemunculan yang tumpang tindih.",
      ],
      code: {
        starter: `def bwt(teks):\n    return ""  # TULIS KODEMU: rotasi terurut, ambil huruf terakhir\n\ndef suffix_array(teks):\n    return []  # TULIS KODEMU: posisi awal sufiks terurut\n\ndef hitung(teks, pola):\n    return 0  # TULIS KODEMU: geser satu huruf demi satu huruf\n\nref = "BANANA$"\nbwt_hasil = ""  # TULIS KODEMU: bwt(ref)\nsa_hasil = []  # TULIS KODEMU: suffix_array(ref)\nana = 0  # TULIS KODEMU: hitung(ref, "ANA")\nnan = 0  # TULIS KODEMU: hitung(ref, "NAN")\nprint(f"bwt={bwt_hasil}")\nprint(f"sa={sa_hasil}")\nprint(f"ANA={ana}")\nprint(f"NAN={nan}")`,
        lockLines: 0,
        solution: `def bwt(teks):\n    rotasi = sorted(teks[i:] + teks[:i] for i in range(len(teks)))\n    return "".join(r[-1] for r in rotasi)\n\ndef suffix_array(teks):\n    return sorted(range(len(teks)), key=lambda i: teks[i:])\n\ndef hitung(teks, pola):\n    n = 0\n    for i in range(len(teks) - len(pola) + 1):\n        if teks[i:i+len(pola)] == pola:\n            n += 1\n    return n\n\nref = "BANANA$"\nbwt_hasil = bwt(ref)\nsa_hasil = suffix_array(ref)\nana = hitung(ref, "ANA")\nnan = hitung(ref, "NAN")\nprint(f"bwt={bwt_hasil}")\nprint(f"sa={sa_hasil}")\nprint(f"ANA={ana}")\nprint(f"NAN={nan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bwt_hasil", value: "ANNB$AA", label: "BWT(BANANA$) = ANNB$AA", msg: "Urutkan semua 7 rotasi, ambil huruf terakhir tiap rotasi: ANNB$AA." },
          { kind: "equal", task: "t2", name: "sa_hasil", value: [6, 5, 3, 1, 0, 4, 2], label: "Suffix array = [6, 5, 3, 1, 0, 4, 2]", msg: "Sufiks terurut: $ (6), A$ (5), ANA$ (3), ANANA$ (1), BANANA$ (0), NA$ (4), NANA$ (2)." },
          { kind: "equal", task: "t3", name: "ana", value: 2, label: "ANA muncul 2 kali (tumpang tindih)", msg: "ANA ada di posisi 1 dan 3. str.count hanya memberi 1 karena melompat sepanjang pola — geser satu huruf demi satu huruf." },
          { kind: "equal", task: "t3", name: "nan", value: 1, label: "NAN muncul 1 kali", msg: "NAN hanya ada di posisi 2." },
        ],
      },
      reference: "BWT = ANNB$AA. Suffix array = [6, 5, 3, 1, 0, 4, 2]. ANA = 2, NAN = 1.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: aligner apa untuk data apa",
      prose: [
        "Skenario 1 — Whole genome / exome DNA, read 150 huruf, ada varian dan indel kecil. → BWA-MEM. Alasan: seed adaptif panjang tahan terhadap varian; standar pipeline GATK (BI20). Contoh nyata: variant calling germline manusia.",
        "Skenario 2 — Pemetaan cepat read yang hampir sama persis dengan referensi (ChIP-seq, penyaringan kontaminasi). → Bowtie2. Alasan: seed pendek dengan backtracking sangat cepat bila mismatch sedikit. Contoh nyata: memetakan jutaan read ChIP ke genom dalam hitungan menit.",
        "Skenario 3 — RNA-seq, read melompati intron. → STAR (bukan BWA, bukan Bowtie2). Alasan: hanya aligner splice-aware yang memahami lompatan intron; BWA akan memotong atau membuang read itu (BI8). Contoh nyata: kuantifikasi RNA-seq untuk DESeq2 (BI9, BI26).",
        "Skenario 4 — Mencari kemiripan di database raksasa tanpa referensi tunggal (misal identifikasi spesies dari metagenom). → BLAST / k-mer (BI6, BI14). Alasan: tidak ada satu genom referensi untuk diindeks; yang dicari adalah kecocokan di banyak sekuens. Contoh nyata: klasifikasi taksonomi read metagenom.",
        "Aturan praktis 10 detik: ada referensi tunggal dan read pendek? → indeks (BWA/Bowtie2/STAR). Tidak ada referensi? → assembly de Bruijn (BI19) atau BLAST. Read RNA? → STAR, selalu.",
      ],
      tasks: [],
      reference: "DNA bervarian → BWA-MEM. Cepat dan hampir-persis → Bowtie2. RNA → STAR. Tanpa referensi → BLAST atau assembly.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: 40 persen read tidak terpetakan",
      prose: [
        "Sebuah sampel RNA-seq: 40 persen read tidak terpetakan ke genom referensi manusia. Tiga hipotesis diajukan. Pertama, kontaminasi: read berasal dari bakteri atau adapter — cek dengan memetakan sebagian read ke database kontaminan dan memeriksa kandungan adapter di ujung read. Kedua, splice junction: read melompati intron dan aligner yang dipakai adalah BWA (bukan splice-aware) — solusinya ganti ke STAR, bukan membuang read. Ketiga, kualitas ujung buruk: 20 huruf terakhir read penuh error sehingga seed gagal — solusinya trim ujung sebelum pemetaan.",
        "Diagnosis yang benar butuh satu angka dari masing-masing hipotesis sebelum memutuskan: persentase read yang cocok ke database kontaminan, persentase read yang terpetakan setelah ganti ke STAR, dan skor kualitas rata-rata 20 huruf terakhir. Tanpa ketiganya, 'buang saja read yang tidak terpetakan' adalah keputusan buta — 40 persen data hilang tanpa diketahui kenapa.",
        "Pembahasan: urutan diagnosis yang hemat: (1) cek kualitas ujung (paling murah, satu perintah QC); (2) coba STAR pada subset 1 juta read (membuktikan atau membantah hipotesis splice dalam hitungan menit); (3) baru cek kontaminasi. Dalam kasus nyata seperti ini, penyebab paling umum adalah nomor dua — aligner yang salah untuk jenis data — dan paling mahal bila dibiarkan: seluruh analisis downstream (DESeq2 di BI9) kehilangan daya statistik.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Cek kualitas ujung dulu (termurah), lalu STAR pada subset (membuktikan hipotesis splice), lalu kontaminasi. Penyebab paling umum: aligner bukan splice-aware untuk data RNA. Membuang 40 persen read tanpa diagnosis adalah kehilangan daya statistik tanpa alasan.",
      },
      reference: "Read tidak terpetakan: cek kualitas ujung, coba STAR pada subset, lalu cek kontaminasi — dalam urutan itu.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "BWT menyusun ulang teks (BANANA$ menjadi ANNB$AA) secara reversibel; huruf yang sama berkelompok sehingga pola mudah dicari.",
        "FM-index menghitung kemunculan lewat backward search dalam waktu sebanding panjang pola, bukan panjang genom.",
        "ANA muncul 2 kali di BANANA (tumpang tindih) — fungsi hitung yang melompat sepanjang pola hanya melaporkan 1.",
        "BWA-MEM untuk DNA bervarian, Bowtie2 untuk cepat dan hampir-persis, STAR untuk RNA (splice-aware).",
        "MAPQ 0 berarti posisi tebakan; varian dari read MAPQ 0 adalah varian yang tidak ada.",
      ],
      next: { label: "BI26 · Ekosistem Bioconductor: GenomicRanges, SummarizedExperiment dan DESeq2", href: "/v2/learn/bi26-bioconductor" },
      quiz: [
        {
          q: "Kenapa BWT membuat pencarian read menjadi cepat?",
          options: [
            { text: "Karena BWT memperpendek genom dengan membuang huruf yang berulang", why: "Salah: BWT tidak membuang apa pun — ia permutasi yang reversibel. Genomnya tetap utuh, hanya disusun ulang." },
            { text: "Karena BWT mengelompokkan huruf yang sama sehingga kemunculan pola bisa dihitung lewat interval, dalam waktu sebanding panjang pola", why: "Tepat: backward search mempersempit interval baris per huruf pola — tanpa memindai genom.", correct: true },
            { text: "Karena BWT mengubah genom menjadi angka yang lebih kecil", why: "Salah: BWT bekerja pada huruf, bukan mengubah ukuran. Kecepatannya datang dari struktur interval, bukan dari angka." },
            { text: "Karena BWT hanya menyimpan huruf pertama tiap gen", why: "Salah: BWT menyimpan seluruh teks. Menghilangkan huruf berarti kehilangan informasi — BWT justru menjamin tidak ada yang hilang." },
          ],
        },
        {
          q: "Berapa kali ANA muncul di BANANA, dan kenapa angka ini menjebak?",
          options: [
            { text: "1 kali — str.count di Python melaporkan 1", why: "Salah: str.count melompat sepanjang pola setelah cocok, sehingga melewatkan kemunculan di posisi 3 yang tumpang tindih dengan posisi 1." },
            { text: "2 kali (posisi 1 dan 3) — fungsi hitung harus menggeser satu huruf demi satu huruf agar yang tumpang tindih ikut terhitung", why: "Tepat: dua kemunculan itu tumpang tindih. Aligner menghitung dengan benar; analis yang memakai str.count kehilangan satu lokus.", correct: true },
            { text: "3 kali — A muncul 3 kali di BANANA", why: "Salah: yang dihitung adalah pola ANA, bukan huruf A. Huruf A muncul 3 kali, pola ANA hanya 2 kali." },
            { text: "0 kali — ANA bukan kata dalam bahasa Indonesia", why: "Salah: ini soal string, bukan soal kata. ANA sebagai pola huruf muncul 2 kali di BANANA." },
          ],
        },
        {
          q: "Read RNA-seq dipetakan dengan BWA-MEM dan 40 persen tidak terpetakan. Dugaan pertama yang paling masuk akal?",
          options: [
            { text: "Sampel terkontaminasi bakteri — langsung buang semua read yang tidak terpetakan", why: "Salah: kontaminasi mungkin, tetapi bukan dugaan pertama untuk RNA. Membuang 40 persen data tanpa diagnosis adalah keputusan buta." },
            { text: "BWA bukan splice-aware: read yang melompati intron gagal terpetakan — coba STAR pada subset dulu", why: "Tepat: ini penyebab paling umum. STAR dirancang untuk lompatan intron; BWA tidak. Uji pada subset membuktikan atau membantahnya dalam hitungan menit.", correct: true },
            { text: "Genom referensinya salah spesies", why: "Salah: bila referensi salah spesies, hampir SEMUA read gagal, bukan 40 persen. Pola 40 persen justru khas read yang melompati intron." },
            { text: "Read-nya terlalu pendek untuk dipetakan", why: "Salah: read 150 huruf bukan pendek. Read pendek bermasalah di bawah 30 huruf; 150 huruf sangat cukup untuk seed." },
          ],
        },
        {
          q: "Sebuah read punya MAPQ 0. Apa artinya, dan apa yang harus dilakukan?",
          options: [
            { text: "Read itu berkualitas buruk — buang dari analisis kualitas (QC)", why: "Salah: MAPQ bukan skor kualitas basa. MAPQ 0 berarti posisi pemetaan tidak yakin — read cocok sama baiknya di banyak tempat." },
            { text: "Posisi read itu pada dasarnya tebakan (cocok di banyak lokus, misal repetitif) — saring sebelum variant calling", why: "Tepat: MAPQ mengukur keyakinan posisi, bukan kualitas. Varian dari posisi tebakan adalah varian yang tidak ada.", correct: true },
            { text: "Read itu tidak mengandung varian apa pun", why: "Salah: MAPQ tidak berkata apa-apa tentang ada tidaknya varian. Ia hanya berkata posisi read ini tidak bisa dipercaya." },
            { text: "Read itu harus dipetakan ulang dengan Bowtie2 agar MAPQ-nya naik", why: "Salah: ganti aligner tidak mengubah fakta bahwa sekuensnya cocok di banyak tempat. Masalahnya ada di datanya (repetitif), bukan di tool-nya." },
          ],
        },
        {
          q: "Kapan memakai BLAST, bukan BWA?",
          options: [
            { text: "Saat read-nya panjang (di atas 1.000 huruf)", why: "Salah: panjang read bukan penentunya. BWA-MEM menangani read panjang; yang menentukan adalah ada tidaknya satu referensi tunggal." },
            { text: "Saat tidak ada satu genom referensi untuk diindeks — yang dicari adalah kecocokan di database banyak sekuens", why: "Tepat: BWA butuh satu referensi terindeks. BLAST mencari di database raksasa tanpa referensi tunggal — misal identifikasi spesies metagenom.", correct: true },
            { text: "Saat ingin hasil yang lebih cepat dari BWA", why: "Salah: BLAST jauh lebih lambat dari BWA untuk pemetaan ke satu referensi — ia seed-and-extend tanpa FM-index." },
            { text: "Saat datanya adalah RNA-seq", why: "Salah: untuk RNA-seq jawabannya STAR, bukan BLAST. BLAST tidak memahami splice junction sebagai aligner RNA." },
          ],
        },
      ],
    },
  ],
};
