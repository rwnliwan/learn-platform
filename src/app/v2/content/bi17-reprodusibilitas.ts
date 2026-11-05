import type { V2Lesson } from "../lib/types";

export const bi17: V2Lesson = {
  slug: "bi17-reprodusibilitas",
  track: "Bioinformatika",
  module: "Reprodusibilitas & Etika",
  title: "BI17 · Reprodusibilitas & Etika: Workflow dan Tanggung Jawab",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "“Jalan di laptopku”",
      prose: [
        "2016: sebuah paper genomik bergengsi ditarik — analisisnya tidak bisa direproduksi karena skrip memakai file lokal yang tidak pernah dibagikan dan versi library yang sudah usang. Tiga tahun kerja, nol warisan. “Works on my machine” adalah epidemi sains komputasional.",
        "Twist-nya: reproduksibilitas bukan soal kejujuran — peneliti ini tidak curang. Ia soal kerapuhan: hasil yang benar tapi tak bisa diulang sama berharganya dengan hasil yang salah. Dan di era data genomik manusia, kerapuhan bertemu tanggung jawab: data yang bocor tidak bisa “di-unduh ulang” dari pasien.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan beda “benar” dan “reprodusibel”" },
        { id: "t2", text: "Sebutkan dua penyebab analisis tak bisa direproduksi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira menyimpan skrip = reprodusibel. Skrip tanpa data versi, seed, versi library, dan urutan langkah = resep tanpa takaran. Reproduksibilitas = skrip + data + environment + dokumentasi.",
      },
      reference: "Reprodusibel = orang lain, mesin lain, hasil sama.",
    },
    {
      id: "workflow",
      eyebrow: "Langkah 2 · Workflow manager",
      title: "Snakemake/Nextflow: anti “jalan manual”",
      prose: [
        "Analisis manual (klik-klik, copy-paste antar file) = tidak terlacak, tidak terulang. Workflow manager (Snakemake, Nextflow) mendefinisikan langkah sebagai ATURAN dengan input-output eksplisit — seperti Makefile untuk sains.",
        "Keuntungannya: dependensi otomatis (ubah input → hanya langkah terdampak yang jalan ulang), paralelisme gratis, dan portabel ke cluster/cloud. Aturan emas: JANGAN PERNAH edit file perantara manual — semua lewat workflow.",
        "Ditambah environment management (Conda/Docker): versi tool dikunci. “Jalan di laptopku” mati — karena environment-nya ikut dibagikan.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa edit file perantara manual merusak reproduksibilitas" },
        { id: "t2", text: "Sebutkan tiga keuntungan workflow manager" },
      ],
      note: {
        title: "Intuisi: reproduksibilitas adalah infrastruktur, bukan niat baik",
        body: "Praktisi yang pernah mengulang analisis dua tahun kemudian menyimpan lima heuristik pahit. Satu: bila sebuah langkah hanya ada di kepalamu (“lalu saya hapus baris itu manual di Excel”), ia tidak ada — tulis SEMUA transformasi sebagai kode atau aturan workflow, tanpa kecuali. Dua: kunci versi dengan digest image container, bukan tag “latest” — latest hari ini bukan latest dua tahun lalu, dan itulah tepatnya kenapa analisismu tidak bisa jalan ulang. Tiga: catat seed DAN versi library — seed yang sama pada numpy versi berbeda bisa memberi hasil berbeda; determinisme penuh butuh keduanya plus catatan hardware (GPU nondeterminism itu nyata). Empat: data besar butuh versioning seperti kode — DVC atau checksum manifest untuk dataset; “final_v2_REAL.csv” di folder bersama bukan versioning. Lima: untuk data manusia, reproduksibilitas tidak berarti publikasi terbuka — ia berarti akses terkontrol yang terdokumentasi (dbGaP/EGA + Data Access Committee); “tidak bisa dibagikan karena privasi” tanpa upaya akses terkontrol adalah kemalasan, bukan etika. Heuristik gabungannya: uji reproduksibilitasmu dengan “tes mesin baru” — bisakah orang asing menjalankan ulang analisismu di komputer yang belum pernah kamu sentuh, hanya dari repositori? Bila jawabannya ragu-ragu, analisismu belum selesai.",
      },
      reference: "Workflow = aturan input-output eksplisit. Environment dikunci.",
    },
    {
      id: "lab-manifest",
      eyebrow: "Langkah 3 · Lab",
      title: "Manifest reproduksibilitas + cek seed",
      prose: [
        "Di lab ini kamu menulis manifest reproduksibilitas (JSON): versi data, versi tool, seed, dan checksum input. Lalu mendemonstrasikan kenapa seed penting: simulasi yang sama tanpa seed → hasil berbeda tiap jalan.",
        "Manifest adalah “KTP” sebuah analisis: siapa pun bisa memverifikasi bahan-bahannya identik.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `checksum` (jumlah karakter mod)" },
        { id: "t2", text: "Tulis manifest JSON dan verifikasi isinya" },
        { id: "t3", text: "Bandingkan hasil simulasi tanpa seed vs dengan seed" },
      ],
      expected: "manifest valid · tanpa seed: beda tiap jalan · dengan seed: identik",
      hints: [
        "Checksum sederhana = sum(ord(c) for c in teks) % 100000.",
        "json.dumps(manifest, indent=2) untuk tampilkan.",
        "random.seed() sebelum simulasi = hasil identik.",
      ],
      code: {
        starter: `import json, random\n\ndef checksum(teks):\n    # TULIS KODEMU\n    return \n\ndata_input = 'sampel_RNAseq_batch3.fastq'\nmanifest = {\n    'analisis': 'DESeq2-style DE v1.2',\n    'data': data_input,\n    'checksum_input': checksum(data_input),\n    'tool': {'python': '3.11', 'numpy': '1.26'},\n    'seed': 42,\n}\nprint(json.dumps(manifest, indent=2))\nassert manifest['checksum_input'] == checksum(data_input)\nprint('manifest OK: checksum cocok')\nprint()\n\ndef simulasi():\n    return [random.gauss(0, 1) for _ in range(3)]\n\ntanpa_seed = (simulasi(), simulasi())\nprint(f'tanpa seed: {tanpa_seed[0][0]:.3f} vs {tanpa_seed[1][0]:.3f} -> beda!')\nrandom.seed(42); a = simulasi()\nrandom.seed(42); b = simulasi()\nprint(f'dengan seed 42: {a[0]:.3f} vs {b[0]:.3f} -> identik')`,
        lockLines: 3,
        solution: `import json, random\n\ndef checksum(teks):\n    # TULIS KODEMU\n    return sum(ord(c) for c in teks) % 100000\n\ndata_input = 'sampel_RNAseq_batch3.fastq'\nmanifest = {\n    'analisis': 'DESeq2-style DE v1.2',\n    'data': data_input,\n    'checksum_input': checksum(data_input),\n    'tool': {'python': '3.11', 'numpy': '1.26'},\n    'seed': 42,\n}\nprint(json.dumps(manifest, indent=2))\nassert manifest['checksum_input'] == checksum(data_input)\nprint('manifest OK: checksum cocok')\nprint()\n\ndef simulasi():\n    return [random.gauss(0, 1) for _ in range(3)]\n\ntanpa_seed = (simulasi(), simulasi())\nprint(f'tanpa seed: {tanpa_seed[0][0]:.3f} vs {tanpa_seed[1][0]:.3f} -> beda!')\nrandom.seed(42); a = simulasi()\nrandom.seed(42); b = simulasi()\nprint(f'dengan seed 42: {a[0]:.3f} vs {b[0]:.3f} -> identik')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "manifest OK: checksum cocok", label: "manifest valid", msg: "Checksum di manifest harus sama dengan checksum data input." },
          { kind: "stdout_matches", task: "t3", pattern: "tanpa seed: -?\\d\\.\\d{3} vs -?\\d\\.\\d{3} -> beda!", label: "tanpa seed hasil beda", msg: "Dua simulasi tanpa seed memakai state acak berbeda." },
          { kind: "stdout_matches", task: "t3", pattern: "dengan seed 42: (-?\\d\\.\\d{3}) vs \\1 -> identik", label: "dengan seed identik", msg: "Seed yang sama → deret acak yang sama. Itu gunanya seed." },
        ],
      },
      reference: "Manifest = KTP analisis. Seed = hasil acak yang terulang.",
    },
    {
      id: "lab-etika",
      eyebrow: "Langkah 4 · Lab",
      title: "Audit etika: re-identifikasi & consent",
      prose: [
        "data genomik = identifier pamungkas: DNA tidak bisa dianonimkan sempurna — 30-80 SNP cukup mengidentifikasi seseorang. Kasus nyata: partisipan 1000 Genomes teridentifikasi ulang dari data “anonim” via genealogi.",
        "Di lab ini kamu menjalankan checklist audit etika: consent, akses terkontrol (dbGaP/EGA, bukan GitHub publik!), dan uji re-identifikasi sederhana — 50 SNP acak cukup untuk mencocokkan “anonim” ke referensi.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `cocok` (fraksi SNP sama)" },
        { id: "t2", text: "Jalankan audit: consent + akses + re-identifikasi" },
        { id: "t3", text: "Simpulkan rekomendasi akses data" },
      ],
      expected: "cocok 100% ke P07 → data “anonim” teridentifikasi → akses terkontrol",
      hints: [
        "Fraksi cocok = jumlah posisi sama / total.",
        "Cari individu referensi dengan kecocokan tertinggi.",
        "Consent “penelitian umum” ≠ boleh publik penuh.",
      ],
      code: {
        starter: `import random\nrandom.seed(3)\n\ndef acak_snp(n):\n    return [random.choice('ACGT') for _ in range(n)]\n\nreferensi = {f'P{i:02d}': acak_snp(50) for i in range(10)}\nanonim = referensi['P07'][:]  # sampel 'anonim' = P07 tanpa label\n\ndef cocok(a, b):\n    # TULIS KODEMU: fraksi posisi sama\n    return \n\nprint('audit etika:')\nprint('  [1] consent: penelitian umum, NON-komersial -> OK terbatas')\nprint('  [2] akses: JANGAN publik penuh -> dbGaP/EGA (akses terkontrol)')\nterbaik = max(referensi, key=lambda k: cocok(anonim, referensi[k]))\nskor = cocok(anonim, referensi[terbaik])\nprint(f'  [3] re-identifikasi: anonim cocok {skor:.0%} ke {terbaik}')\nprint('  -> 50 SNP cukup mengidentifikasi: data genomik BUKAN anonim')\nprint('  rekomendasi: akses terkontrol + perjanjian penggunaan data')`,
        lockLines: 6,
        solution: `import random\nrandom.seed(3)\n\ndef acak_snp(n):\n    return [random.choice('ACGT') for _ in range(n)]\n\nreferensi = {f'P{i:02d}': acak_snp(50) for i in range(10)}\nanonim = referensi['P07'][:]  # sampel 'anonim' = P07 tanpa label\n\ndef cocok(a, b):\n    # TULIS KODEMU: fraksi posisi sama\n    return sum(1 for x, y in zip(a, b) if x == y)/len(a)\n\nprint('audit etika:')\nprint('  [1] consent: penelitian umum, NON-komersial -> OK terbatas')\nprint('  [2] akses: JANGAN publik penuh -> dbGaP/EGA (akses terkontrol)')\nterbaik = max(referensi, key=lambda k: cocok(anonim, referensi[k]))\nskor = cocok(anonim, referensi[terbaik])\nprint(f'  [3] re-identifikasi: anonim cocok {skor:.0%} ke {terbaik}')\nprint('  -> 50 SNP cukup mengidentifikasi: data genomik BUKAN anonim')\nprint('  rekomendasi: akses terkontrol + perjanjian penggunaan data')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "re-identifikasi: anonim cocok 100% ke P07", label: "teridentifikasi sebagai P07", msg: "Sampel anonim = salinan P07 → kecocokan 100%." },
          { kind: "stdout_matches", task: "t3", pattern: "rekomendasi: akses terkontrol", label: "rekomendasi akses terkontrol", msg: "Data yang bisa di-re-identifikasi tidak boleh publik penuh." },
        ],
      },
      reference: "Genomik = identifier pamungkas. Consent + akses terkontrol wajib.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: bagaimana membuat analisis terulang?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Analisis lebih dari satu langkah. → Workflow manager (Snakemake/Nextflow), bukan klik manual. Alasan: aturan input-output eksplisit = terlacak, terulang, paralel gratis. Contoh nyata: 400 sampel yang tiap sampelnya 12 langkah.",
        "Skenario 2 — Berbagi analisis ke orang lain atau cluster. → Container: Docker untuk dev, Singularity/Apptainer di HPC. Alasan: membekukan OS + library + versi tool; Docker butuh root sehingga dilarang di cluster bersama. Contoh nyata: pipeline yang jalan identik di laptop dan cluster.",
        "Skenario 3 — Menyatakan “reprodusibel”. → Paket lengkap: skrip + data berversi + environment + seed + dokumentasi. Alasan: skrip tanpa versi data dan seed = resep tanpa takaran. Contoh nyata: hasil bergeser karena versi library diam-diam update.",
        "Skenario 4 — Riset dengan potensi dual-use (gain-of-function, patogen). → Telaah etik SEBELUM publikasi. Alasan: informasi yang sudah terbit tidak bisa ditarik; risikonya melekat pada resepnya. Contoh nyata: eksperimen H5N1 2012 yang memicu moratorium.",
        "Skenario 5 — Publikasi data. → Prinsip FAIR: metadata lengkap, format terbuka, akses jelas. Alasan: data tanpa metadata = arsip mati yang tak bisa dipakai ulang. Contoh nyata: dataset “terbuang” karena tak ada yang tahu kolomnya artinya apa.",
        "Aturan praktis 10 detik: “bisakah orang lain menjalankan ulang dari nol dan dapat hasil sama?” — kalau jawabannya “mungkin”, belum reprodusibel."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Tapi di laptop saya jalan” — environment laptop bukan environment reviewer; container membekukan OS, library, dan versi tool, dan itulah artefak yang dibagikan, bukan sekadar skrip.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Paper ditarik: anatomi kegagalan",
      prose: [
        "Kasus: paper asosiasi gen-penyakit ditarik setelah 2 tahun. Akar masalah: (1) skrip final tidak diarsip — yang ada versi “hampir final”; (2) preprocessing manual di Excel tanpa catatan; (3) versi reference genome tidak dicatat (hg19 vs hg38 menggeser koordinat!); (4) data tidak dibagikan (“privasi” tanpa upaya akses terkontrol).",
        "Perbaikan sistemik: workflow manager + environment terkunci + manifest + arsip data di repositori akses-terkontrol + preregistrasi analisis. Satu paper yang ditarik = pelajaran untuk seluruh lab: reproduksibilitas adalah infrastruktur, bukan niat baik.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan empat akar masalah penarikan paper" },
        { id: "t2", text: "Tulis tiga perbaikan sistemik untuk lab" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Keputusan berbasis analisis tak reprodusibel = risiko keputusan buta: obat, kebijakan, investasi yang dibangun di atas angka yang tak bisa diverifikasi. Di risiko operasional, reproduksibilitas adalah kontrol atas “key person risk” analisis.",
      },
      reference: "Reproduksibilitas = infrastruktur: workflow + environment + arsip.",
    },
    {
      id: "container-fair",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Container, versioning data, dan FAIR",
      prose: [
        "Workflow manager bekerja karena ia berpikir dalam DAG (directed acyclic graph): tiap aturan mendeklarasikan input dan output, dan manager membangun graf dependensi lengkap sebelum menjalankan apa pun. Konsekuensinya kuat: ubah satu file input → hanya langkah downstream yang terdampak yang jalan ulang (bukan seluruh pipeline 6 jam); satu langkah gagal di tengah malam → resume dari titik kegagalan, bukan dari nol. Paralelisme datang gratis: langkah-langkah independen di cabang DAG yang berbeda otomatis jalan bersamaan. Portabilitas: workflow yang sama jalan di laptop (profil lokal), cluster kampus (SLURM), dan cloud (AWS Batch) hanya dengan ganti profil eksekusi — tanpa menyentuh logika analisis. Inilah bedanya dengan skrip bash berurutan: skrip tahu URUTAN, workflow tahu KETERGANTUNGAN.",
        "Container membekukan environment menjadi image yang bisa dibagikan: OS, library sistem, versi tool, semuanya. Docker adalah standarnya untuk pengembangan; tetapi di cluster HPC bersama, Docker butuh hak root — dilarang di kebanyakan klaster. Di situlah Singularity/Apptainer masuk: menjalankan container sebagai user biasa, kompatibel dengan scheduler HPC. Jebakan yang merenggut banyak reproduksibilitas: memakai tag image seperti “python:latest” — tag BISA BERUBAH isinya (latest hari ini bukan latest tahun depan). Praktik benar: kunci dengan digest (image@sha256:9f3e…) — sidik jari konten yang abadi — dan simpan Dockerfile/definition file di repositori agar image bisa dibangun ulang dari resep, bukan hanya dari artefak. Pasangannya yang sering dilupakan: lockfile (conda-lock / pip freeze) yang membekukan SELURUH pohon dependensi termasuk dependensi transitif — tanpa lockfile, install ulang enam bulan kemudian bisa menarik versi minor berbeda yang menggeser hasil.",
        "Kode di-versioning dengan git; data dan model butuh perlakuan setara. DVC (Data Version Control) mem-versioning dataset besar seperti git mem-versioning kode: file besar disimpan di remote storage, repositori hanya menyimpan pointer + checksum — checkout mengembalikan dataset versi tepat eksperimen itu. Tanpa ini, “dataset training” adalah folder yang isinya berubah diam-diam. Seed: catat SEMUA seed (Python random, numpy, torch) di manifest — tetapi pahami batasnya: seed yang sama pada versi library berbeda, atau di GPU vs CPU, bisa memberi hasil berbeda (nondeterminisme operasi paralel itu nyata). Determinisme penuh = seed + versi library terkunci + catatan hardware. Bila hasilmu “kadang beda sedikit”, itu bukan mistik — itu seed atau versi yang tidak terkontrol.",
        "FAIR adalah kontrak sosial data. Findable: data dan metadata punya identifier persisten (DOI via Zenodo), bisa ditemukan mesin pencari. Accessible: bisa diakses lewat protokol standar — untuk data manusia berarti akses TERKONTROL via dbGaP/EGA dengan Data Access Committee, bukan “minta via email ke penulis”. Interoperable: format standar komunitas (VCF, BAM — bukan spreadsheet kustom dengan kolom misterius) + ontologi baku. Reusable: lisensi jelas (CC-BY, bukan “hubungi kami”). Contoh bedanya: studi yang mendepositkan BAM + VCF + metadata terstandar di EGA dengan accession number = FAIR; studi yang menulis “data tersedia atas permintaan” = dalam praktik, tidak tersedia (studi menunjukkan mayoritas permintaan semacam itu tidak pernah direspons). Preregistrasi melengkapi: daftarkan rencana analisis SEBELUM melihat data — memisahkan analisis konfirmatori dari eksploratori, obat untuk p-hacking.",
        "Pengujian workflow sama pentingnya dengan workflow-nya: jalankan dry-run untuk memverifikasi DAG tanpa mengeksekusi — menangkap salah ketik path sebelum 6 jam komputasi terbuang; pakai lint untuk aturan yang tidak terpakai; dan simpan satu dataset uji KECIL (subset 1%) dengan output ekspektasi di repositori — CI bisa menjalankan ulang pipeline mini ini tiap ada perubahan. Aturan: setiap perubahan workflow harus lolos dry-run + dataset uji kecil sebelum di-merge, sama seperti code review. Workflow tanpa tes = kode tanpa tes: rusak diam-diam.",
        "Contoh kerja: lab merilis pipeline variant calling yang FAIR dan reproducible. Repositori berisi: workflow Snakemake (aturan input-output eksplisit), environment per-aturan (conda lock), container Singularity terpin digest untuk langkah berat, DVC pointer ke dataset uji 10 GB di S3, manifest JSON (checksum input, seed, versi tool), dan DOI Zenodo untuk snapshot rilis. Reviewer menjalankan ulang di klaster yang belum pernah dipakai — hasil identik bit-per-bit dengan yang dilaporkan. Waktu setup ulang: 30 menit, bukan 3 minggu email bolak-balik. Itulah reproduksibilitas sebagai infrastruktur: mahal dibangun sekali, murah dipakai selamanya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa DAG membuat resume dan paralelisme otomatis" },
        { id: "t2", text: "Sebutkan empat huruf FAIR beserta artinya" },
      ],
      quiz: [
        {
          q: "Pipeline memakai image bertag “latest”. Risiko utamanya?",
          options: [
            { text: "Tidak ada — latest selalu yang terbaik", why: "Terbaik hari ini belum tentu identik dengan yang dipakai saat analisis berjalan." },
            { text: "Isi image bisa berubah → analisis tidak bisa diulang identik; kunci dengan digest", why: "Reproduksibilitas butuh sidik jari konten, bukan label yang bisa ditempel ulang.", correct: true },
            { text: "Hanya masalah kecepatan unduh", why: "Kecepatan bukan masalah; ketidakpastian isi adalah masalahnya." },
            { text: "Docker tidak cocok untuk sains", why: "Docker cocok — yang salah adalah cara memin versi, bukan tool-nya." },
          ],
        },
        {
          q: "Hasil beda antar-run padahal seed sudah dicatat. Kemungkinan penyebab?",
          options: [
            { text: "Seed pasti salah catat", why: "Bisa jadi benar tercatat — seed bukan satu-satunya sumber nondeterminisme." },
            { text: "Versi library atau nondeterminisme GPU — seed saja tidak cukup; kunci versi + catat hardware", why: "Determinisme penuh = seed + versi terkunci + environment tercatat.", correct: true },
            { text: "Data pasti corrupt", why: "Corrupt memberi error, bukan perbedaan kecil antar-run." },
            { text: "Itu normal, abaikan saja", why: "Tidak normal untuk analisis yang diklaim reproducible — selidiki, jangan abaikan." },
          ],
        },
        {
          q: "Dataset training di-update diam-diam (tambah 2.000 sampel) tanpa versioning. Dampaknya?",
          options: [
            { text: "Tidak ada — data lebih banyak selalu lebih baik", why: "Salah: “lebih baik” tidak bisa diverifikasi bila versinya tidak tercatat — hasil lama tidak bisa direproduksi." },
            { text: "Eksperimen tidak bisa direproduksi/diaudit — pakai DVC + checksum manifest", why: "Benar: tanpa versioning, tidak ada yang tahu data versi apa yang menghasilkan model versi apa.", correct: true },
            { text: "Model pasti membaik", why: "Salah: data baru bisa bias/shift; tanpa versioning kamu bahkan tidak bisa membandingkan." },
            { text: "Hanya masalah dokumentasi ringan", why: "Salah: ini masalah integritas ilmiah, bukan administrasi." },
          ],
        },
      ],
      reference: "DAG = dependensi, bukan urutan · digest, bukan tag · FAIR = kontrak sosial data.",
      note: {
        title: "🚨 Mitos: Dockerfile yang rapi = analisis reprodusibel",
        type: "pitfall",
        body: "Yang benar: container membekukan environment, bukan data dan bukan keputusan manusia. Tanpa versi data yang dipin, seed yang dicatat, dan larangan mengedit file perantara secara manual, image yang sama bisa menghasilkan kesimpulan berbeda — container memastikan softwarenya sama, bukan sainsnya.",
      },
    },
    {
      id: "dual-use",
      eyebrow: "Langkah 8 · Dual-use",
      title: "Dual-use: riset yang menyembuhkan dan membunuh sekaligus",
      prose: [
        "2012: dua laboratorium menerbitkan cara membuat virus flu H5N1 menular lewat udara antar musang — riset gain-of-function. Tujuannya sah: memahami pandemi sebelum ia datang. Risikonya: resep yang sama bisa dipakai untuk senjata biologi. Inilah dual-use research of concern (DURC): riset dengan manfaat nyata yang bisa disalahgunakan untuk bahaya besar. “Niat baik peneliti” tidak menetralkan risikonya.",
        "Gain-of-function (GoF) adalah eksperimen yang MENAMBAH kemampuan patogen: lebih menular, lebih virulen, lolos imunitas. GoF dilakukan untuk memprediksi evolusi virus dan menguji vaksin — tetapi setiap hasilnya adalah informasi yang berguna juga bagi penyerang. Karena itu GoF pada patogen berbahaya kini melewati pengawasan khusus, dan publikasi detail metodenya sering dibatasi. Pertanyaannya bukan “apakah risetnya menarik”, melainkan “apakah manfaatnya sebanding dengan risiko bocornya informasi”.",
        "Kenapa ini urusan bioinformatikawan? Karena rantai ancaman modern dimulai di komputer: memprediksi struktur protein patogen, mensimulasikan mutasi yang meningkatkan penularan, bahkan merancang protein baru secara de novo. Tools yang kamu pakai untuk mendesain vaksin — prediksi struktur, docking, desain komputasional — adalah tools yang sama untuk mendesain ancaman. “Saya cuma analisis data” bukan tameng: analisis komputasional adalah mata rantai nyata dalam rantai dual-use, bukan penonton.",
        "Biosecurity adalah praktik mencegah penyalahgunaan: komite review untuk riset berisiko sebelum dimulai, screening pesanan sintesis DNA (penyedia besar tergabung dalam konsorsium internasional — pesanan sekuens patogen berbahaya ditolak), dan daftar select agents yang penggunaannya diawasi negara. Untuk bioinformatika, terjemahannya konkret: pikirkan SEBELUM mempublikasikan metode prediksi fungsi patogen — siapa lagi yang bisa memakai metode ini, dan untuk apa?",
        "Prinsip praktisnya ada tiga. Satu: tidak semua yang BISA dilakukan HARUS dilakukan — dan tidak semua yang dilakukan harus dipublikasikan penuh; versi publikasi bisa menahan detail yang memampukan penyalahgunaan. Dua: bila analisismu menyentuh patogen berbahaya, konsultasikan ke komite etik/biosafety SEBELUM jalan, bukan setelah paper ditolak. Tiga: dokumentasikan penilaian risikonya seperti kamu mendokumentasikan analisis — suatu hari seseorang akan bertanya “siapa yang memutuskan ini aman”, dan jawabannya harus nama dan tanggal, bukan “kayaknya aman”.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan beda dual-use research of concern dengan riset berbahaya biasa" },
        { id: "t2", text: "Sebutkan dua mekanisme biosecurity yang relevan untuk kerja bioinformatika" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira bioinformatika “hanya main data” sehingga bebas tanggung jawab dual-use. Prediksi struktur, simulasi mutasi, dan desain protein komputasional adalah langkah nyata dalam rantai pengembangan ancaman — tanggung jawab etikanya sama dengan yang di lab basah.",
      },
      reference: "Dual-use: manfaat sah + potensi salah guna. GoF = menambah kemampuan patogen.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Reprodusibel = orang lain, mesin lain, hasil sama.",
        "Workflow manager: aturan input-output, tanpa edit manual.",
        "Kunci environment (Conda/Docker) + catat seed + manifest.",
        "FAIR: Findable, Accessible, Interoperable, Reusable.",
        "Genomik = identifier; akses terkontrol + consent.",
        "Dual-use: sekuens patogen = risiko biosecurity.",
      ],
      next: { label: "BI18 · Capstone: Mini-Proyek DE", href: "/learn/bi18-capstone-de" },
      quiz: [
        {
          q: "Yang TIDAK termasuk syarat reproduksibilitas komputasional?",
          options: [
            { text: "Skrip + data berversi", why: "Ini syarat utama." },
            { text: "Environment terkunci", why: "Versi library memengaruhi hasil." },
            { text: "Seed tercatat", why: "Tanpa seed, hasil acak tak terulang." },
            { text: "Laptop yang sama", why: "Reprodusibilitas justru menuntut hasil sama di MESIN LAIN.", correct: true },
          ],
        },
        {
          q: "Kenapa data genomik manusia tidak boleh di GitHub publik?",
          options: [
            { text: "Terlalu besar saja", why: "Ukuran bukan alasan etisnya." },
            { text: "Bisa di-re-identifikasi — genomik adalah identifier pamungkas", why: "30-80 SNP cukup. Consent + akses terkontrol (dbGaP/EGA).", correct: true },
            { text: "Tidak ada yang peduli", why: "Justru sangat sensitif." },
            { text: "Dilarang GitHub", why: "GitHub tidak melarang; etikalah yang melarang." },
          ],
        },
        {
          q: "Fungsi workflow manager (Snakemake/Nextflow)?",
          options: [
            { text: "Mempercantik plot", why: "Bukan tugasnya." },
            { text: "Aturan input-output eksplisit: terlacak, terulang, paralel otomatis", why: "Anti “klik manual”. Ubah input → hanya langkah terdampak jalan ulang.", correct: true },
            { text: "Menggantikan statistik", why: "Ia mengatur alur, bukan menggantikan analisis." },
            { text: "Wajib untuk semua", why: "Analisis kecil bisa tanpa; tapi prinsipnya tetap berlaku." },
          ],
        },
        {
          q: "FAIR untuk data artinya…",
          options: [
            { text: "Gratis selalu", why: "Accessible ≠ gratis; bisa akses terkontrol." },
            { text: "Findable, Accessible, Interoperable, Reusable", why: "Standar arsip data modern.", correct: true },
            { text: "Adil bagi semua", why: "FAIR adalah akronim teknis, bukan slogan." },
            { text: "Hanya untuk data besar", why: "Berlaku untuk semua data penelitian." },
          ],
        },
        {
          q: "Riset gain-of-function patogen menimbulkan isu…",
          options: [
            { text: "Tidak ada", why: "Ada: dual-use research of concern." },
            { text: "Dual-use / biosecurity — manfaat vs risiko penyalahgunaan", why: "Etika biologi modern: tidak semua yang bisa dilakukan harus dilakukan.", correct: true },
            { text: "Hanya teknis", why: "Ini isu etika dan keamanan, bukan sekadar teknis." },
            { text: "Privasi", why: "Isu utamanya biosecurity, bukan privasi." },
          ],
        },
      ],
    },
  ],
};
