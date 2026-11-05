import type { V2Lesson } from "../lib/types";

export const bi1: V2Lesson = {
  slug: "bi1-biologi-molekuler",
  track: "Bioinformatika",
  module: "Fondasi",
  title: "BI1 · DNA, RNA, Protein: Central Dogma",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "3 miliar huruf, 4 huruf saja",
      prose: [
        "Bayangkan buku 3 miliar huruf dengan alfabet yang cuma 4 huruf: A, T, G, C. Itulah genom manusia. Dari 3 miliar huruf itu, hanya sekitar 1,5% yang menjadi gen penyandi protein — sekitar 20.000 gen.",
        "Bioinformatika adalah ilmu membaca buku raksasa ini dengan komputer. Central dogma adalah alur bacanya: DNA (arsip) ditranskripsi menjadi RNA (fotokopi kerja), lalu ditranslasi menjadi protein (mesin kerja). Tiap teknologi omics mengukur satu tahap: genomik mengukur DNA, transkriptomik mengukur RNA, proteomik mengukur protein.",
        "Twist-nya: angka 1,5% itu jebakan paling terkenal di genomik. Proyek ENCODE menunjukkan sekitar 80% genom punya aktivitas biokimia — enhancer, promoter, RNA non-coding. Daerah non-coding bukan sampah; ia adalah panel kontrol yang menentukan kapan dan seberapa kuat tiap gen dibaca. Salah pilih lapisan omics untuk pertanyaanmu, dan kamu menjawab pertanyaan yang salah dengan data yang benar.",
      ],
      tasks: [
        { id: "t1", text: "Hafalkan tiga angka jangkar: 3 miliar basa, 20 ribu gen, 1,5% coding" },
        { id: "t2", text: "Untuk pertanyaan “varian bawaan apa yang menyebabkan penyakit?”, tentukan lapisan omics yang tepat" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap DNA non-coding (98,5% genom) sebagai “sampah” yang boleh diabaikan. Mayoritas temuan GWAS justru jatuh di daerah non-coding — mereka merusak saklar pengatur (enhancer), bukan gennya.",
      },
      reference: "3M basa · 20K gen · 1,5% coding · central dogma: DNA → RNA → protein.",
    },
    {
      id: "lab-translasi",
      eyebrow: "Langkah 2 · Lab",
      title: "Transkripsi dan translasi dari nol",
      prose: [
        "Sel membaca DNA dalam kelompok 3 huruf yang disebut kodon. DNA `ATGTTTCCCTAA` ditranskripsi menjadi mRNA dengan menukar T menjadi U, lalu tiap kodon diterjemahkan menjadi asam amino sampai bertemu kodon STOP.",
        "Di langkah ini kamu menulis prosesnya sendiri. Perhatikan: satu huruf yang berubah di kodon bisa mengganti asam amino (missense), dan satu huruf yang disisipkan menggeser semua kodon setelahnya (frameshift).",
      ],
      tasks: [
        { id: "t1", text: "Buat `mrna` dari `dna` (T → U)" },
        { id: "t2", text: "Translasi `mrna` menjadi list `protein`, berhenti di STOP" },
        { id: "t3", text: "Cetak protein dengan `print`" },
      ],
      expected: "Protein: Met-Phe-Pro",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa berhenti di kodon STOP sehingga protein ikut memuat asam amino setelahnya. Ribosom berhenti di STOP — kodemu harus begitu juga.",
      },
      hints: [
        "Transkripsi: ganti semua 'T' menjadi 'U' pada dna.",
        "Potong mrna per 3 huruf dengan range(0, len(mrna), 3).",
        "Ambil asam amino dari dict kodon; jika 'STOP', break dari loop.",
      ],
      code: {
        starter: `kodon = {'AUG':'Met','UUU':'Phe','UUC':'Phe','CCC':'Pro','UAA':'STOP',\n         'UAG':'STOP','UGA':'STOP','GGG':'Gly','AAA':'Lys','CGU':'Arg'}\ndna = 'ATGTTTCCCTAA'\n\n# TULIS KODEMU: transkripsi (T -> U), lalu translasi per kodon\nmrna = \nprotein = []\nfor i in range(0, len(mrna), 3):\n    k = mrna[i:i+3]\n    aa = kodon.get(k, '?')\n    protein.append(aa)\n    if aa == 'STOP':\n        break\n\nprint('DNA    :', dna)\nprint('mRNA   :', mrna)\nprint('Protein:', '-'.join(protein))`,
        lockLines: 4,
        solution: `kodon = {'AUG':'Met','UUU':'Phe','UUC':'Phe','CCC':'Pro','UAA':'STOP',\n         'UAG':'STOP','UGA':'STOP','GGG':'Gly','AAA':'Lys','CGU':'Arg'}\ndna = 'ATGTTTCCCTAA'\n\n# TULIS KODEMU: transkripsi (T -> U), lalu translasi per kodon\nmrna = dna.replace('T', 'U')\nprotein = []\nfor i in range(0, len(mrna), 3):\n    k = mrna[i:i+3]\n    aa = kodon.get(k, '?')\n    protein.append(aa)\n    if aa == 'STOP':\n        break\n\nprint('DNA    :', dna)\nprint('mRNA   :', mrna)\nprint('Protein:', '-'.join(protein))`,
        checks: [
          { kind: "defined", task: "t1", name: "mrna", label: "`mrna` terdefinisi", msg: "Buat variabel mrna dari dna dengan T diganti U." },
          { kind: "equal", task: "t2", name: "protein", value: ["Met", "Phe", "Pro"], label: "`protein` = [Met, Phe, Pro]", msg: "AUG=Met, UUU=Phe, CCC=Pro, UAA=STOP (berhenti, tidak ikut)." },
          { kind: "stdout_matches", task: "t3", pattern: "Protein: Met-Phe-Pro", label: "`print` menampilkan protein", msg: "Cetak dengan format Protein: ... memakai '-'.join(protein)." },
        ],
      },
      reference: "Transkripsi: T→U. Translasi: kodon → asam amino, berhenti di STOP.",
    },
    {
      id: "lab-gc",
      eyebrow: "Langkah 3 · Lab",
      title: "GC content dan komplemen DNA",
      prose: [
        "Pasangan G-C diikat 3 ikatan hidrogen, A-T hanya 2. Sekuens dengan GC% tinggi lebih sulit dibuka — primer PCR idealnya punya GC 40–60%.",
        "DNA juga beruntai ganda: tiap basa punya pasangan (A-T, G-C). Reverse complement adalah sekuens untai pasangannya, dibaca dari arah berlawanan — operasi paling dasar sebelum alignment atau desain primer.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `gc` (persen G+C)" },
        { id: "t2", text: "Buat `rev_komp` (reverse complement)" },
        { id: "t3", text: "Cetak panjang, GC, dan rev_komp" },
      ],
      expected: "GC      : 54.5%  rev_komp: GCGCATATATATGCGCGCGCAT",
      hints: [
        "GC% = (jumlah G + jumlah C) / panjang * 100.",
        "Komplemen: petakan A↔T dan G↔C untuk tiap huruf.",
        "Reverse complement = komplemen yang dibalik ([::-1]).",
      ],
      code: {
        starter: `seq = 'ATGCGCGCGCATATATATGCGC'\n\n# TULIS KODEMU: GC%, komplemen, reverse-komplemen\ngc = \nkomplemen = \nrev_komp = \n\nprint(f'panjang : {len(seq)}')\nprint(f'GC      : {gc:.1f}%')\nprint(f'rev_komp: {rev_komp}')`,
        lockLines: 1,
        solution: `seq = 'ATGCGCGCGCATATATATGCGC'\n\n# TULIS KODEMU: GC%, komplemen, reverse-komplemen\ngc = (seq.count('G') + seq.count('C')) / len(seq) * 100\nkomp = str.maketrans('ATGC', 'TACG')\nkomplemen = seq.translate(komp)\nrev_komp = komplemen[::-1]\n\nprint(f'panjang : {len(seq)}')\nprint(f'GC      : {gc:.1f}%')\nprint(f'rev_komp: {rev_komp}')`,
        checks: [
          { kind: "equal", task: "t1", name: "gc", value: 54.5, tol: 0.1, label: "`gc` sekitar 54.5", msg: "12 dari 22 basa adalah G/C. Cek pembaginya (len(seq), bukan angka tebakan)." },
          { kind: "equal", task: "t2", name: "rev_komp", value: "GCGCATATATATGCGCGCGCAT", label: "`rev_komp` benar", msg: "Komplemen dulu (A↔T, G↔C), lalu balik urutannya." },
          { kind: "stdout_matches", task: "t3", pattern: "GC\\s+: 54\\.5%", label: "`print` menampilkan GC", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "G-C = 3 ikatan H (kuat). Reverse complement = komplemen yang dibalik.",
    },
    {
      id: "varian",
      eyebrow: "Langkah 4 · Varian",
      title: "SNP, indel, struktural: tiga typo, tiga nasib",
      prose: [
        "Varian adalah typo di buku 3 miliar huruf. SNP: satu huruf berubah. Indel: sisipan atau hapusan sedikit huruf. Varian struktural: hapusan, duplikasi, atau inversi besar (ribuan sampai jutaan basa).",
        "Dampaknya tergantung di mana typo jatuh. Synonymous: huruf berubah tapi asam amino tetap (biasanya diam). Missense: satu asam amino berganti — contoh nyata, anemia sel sabit: satu SNP A→T di gen HBB mengubah Glu menjadi Val. Nonsense atau frameshift: protein terpotong atau hancur total — kandidat terkuat penyebab penyakit.",
        "Dua manusia berbeda sekitar 0,1% genomnya — 1 per 1.000 basa, atau sekitar 3 juta perbedaan. Kecil persennya, besar jumlahnya; di situlah varian penyebab penyakit bersembunyi.",
      ],
      formula: String.raw`\text{Jarak genetik} \approx \frac{\text{jumlah posisi berbeda}}{\text{panjang sekuens}}`,
      formulaNote: "Jarak genetik = proporsi posisi yang berbeda. Pembilang = hitungan posisi yang tidak sama; penyebut = panjang daerah yang dibandingkan. Nilai 0,001 berarti 1 beda per 1.000 basa — kira-kira perbedaan dua manusia acak.",
      tasks: [
        { id: "t1", text: "Urutkan dari paling ringan ke paling merusak: missense, synonymous, frameshift" },
        { id: "t2", text: "Jelaskan kenapa 0,1% perbedaan tetap berarti 3 juta posisi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menganggap mutasi selalu buruk. Kebanyakan varian netral; sebagian merugikan; sedikit menguntungkan. Jangan asumsikan varian = penyakit — buktikan dengan frekuensi populasi (bandingkan ke database varian populasi: penyakit langka tidak mungkin disebabkan varian yang umum di populasi sehat) dan prediksi dampak.",
      },
      reference: "SNP < indel < struktural. Dampak: synonymous < missense < nonsense/frameshift.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Bayi 8 bulan, 20.000 varian, 1 diagnosis",
      prose: [
        "Bayi 8 bulan: kejang, keterlambatan perkembangan. Panel metabolik normal. Dokter meminta whole exome sequencing (WES). Hasil: 20.000 varian.",
        "Tim memfilter berlapis. (1) Frekuensi di bawah 1% di gnomAD → tersisa 400. Logikanya: penyakit langka tidak mungkin disebabkan varian yang umum di populasi sehat. (2) Prediksi merusak (nonsense, missense konservatif) → tersisa 12. (3) Cocok pola gejala + pola pewarisan → tersisa 1 kandidat.",
        "WES dipilih bukan WGS karena 85% mutasi penyakit Mendel ada di 1,5% daerah coding — biayanya sekitar 1/50 WGS dengan hasil klinis sebanding untuk kasus seperti ini. Pelajaran: diagnosis genomik adalah penyaringan bertingkat yang logis, bukan pencarian mutasi ajaib. Tiap filter adalah asumsi biologi — dokumentasikan.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga filter berlapis beserta logika biologisnya" },
        { id: "t2", text: "Jelaskan kenapa WES (bukan WGS) dipilih untuk kasus ini" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Filter frekuensi yang salah (mis. memakai ambang terlalu longgar) meloloskan ratusan kandidat palsu — analis membuang minggu mengejar noise, dan pasien menunggu tanpa diagnosis. Di risiko klinik, filter adalah pengendalian biaya false positive.",
      },
      reference: "Filter diagnosis: frekuensi populasi → dampak protein → kesesuaian klinis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Pilih teknologi omics sesuai pertanyaan",
      prose: [
        "Cari varian bawaan (perbedaan genetik antar individu) → sekuensing DNA (WGS, WES, atau panel). DNA stabil dan tidak berubah antar jaringan.",
        "Cari gen yang aktif saat ini (respons terhadap kondisi) → RNA-seq. RNA mencerminkan ekspresi real-time.",
        "Cari fungsi aktual (RNA tidak selalu menjadi protein) → proteomik. Protein adalah pelaku akhir; modifikasinya penting.",
        "Budget terbatas dan fokus penyakit Mendel → WES atau panel gen, bukan WGS. 85% mutasi Mendel ada di daerah coding dengan biaya sekitar 1/50.",
        "Aturan 10 detik: tanya lapisan omics dulu (DNA/RNA/protein); jangkar skala 3M–20K–1,5%; varian umum di populasi sehat bukan penyebab penyakit langka; non-coding bukan sampah.",
      ],
      tasks: [
        { id: "t1", text: "Untuk pertanyaan “gen apa yang menyala pada kanker vs normal?”, pilih teknologinya" },
        { id: "t2", text: "Untuk skrining pembawa thalassemia dengan budget kecil, pilih teknologinya" },
      ],
      reference: "DNA = varian bawaan · RNA = aktivitas · protein = fungsi.",
    },
    {
      id: "adv-revisi-dogma",
      eyebrow: "Langkah 7 · Advanced",
      title: "Dogma yang direvisi: splicing, modifikasi RNA, dan tantangan anotasi",
      prose: [
        "Central dogma versi buku teks berhenti di “DNA → RNA → protein”, tapi sel menambahkan tiga lapis kerumitan yang mengubah cara analis membaca data. Pertama, alternative splicing: pre-mRNA manusia dipotong-sambung, dan sekitar 95% gen multi-ekson manusia mengalami splicing alternatif — satu gen bisa menghasilkan belasan isoform protein berbeda. RNA-seq yang hanya menghitung per gen tanpa melihat isoform bisa melewatkan biologi yang sebenarnya: gen yang total ekspresinya tetap bisa berganti isoform dominan antar kondisi.",
        "Kedua, modifikasi kimia RNA (epitranskriptomik): m6A (N6-methyladenosine) adalah modifikasi paling umum pada mRNA mamalia — ia memengaruhi stabilitas dan efisiensi translasi tanpa mengubah satu huruf pun sekuensnya. Lapisan regulasi ini tidak terlihat dari DNA saja; ia diukur dengan teknik seperti MeRIP-seq. Analis yang hanya membaca huruf akan buta terhadapnya.",
        "Ketiga, RNA non-coding panjang (lncRNA): transkrip lebih dari 200 nukleotida yang tidak menyandi protein — contohnya XIST (~17 ribu nukleotida) yang membungkam satu kromosom X utuh. GENCODE mencatat puluhan ribu lokus lncRNA manusia, tapi fungsi sebagian besar belum diketahui: inilah “materi gelap” transkriptom. Mengabaikannya karena “tidak coding” mengulangi kesalahan lama terhadap daerah non-coding DNA.",
        "Tantangan anotasi mengikat ketiganya: GENCODE v45 mencatat ~19.900 gen penyandi protein manusia, tapi batas gen — di mana UTR berakhir, isoform mana yang “kanonis” — direvisi tiap rilis. Pseudogen (~14.000 di manusia) menyerupai gen tapi tidak fungsional, dan menjadi jebakan klasik: read RNA-seq yang terpetakan ke pseudogen dikira ekspresi gen asli. Aturan praktisi: selalu catat versi anotasi (mis. GENCODE v45 / Ensembl 112) di methods — analisis yang sama dengan anotasi berbeda bisa menghasilkan daftar gen berbeda.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa agregat hitungan per gen bisa menyembunyikan sinyal alternative splicing" },
        { id: "t2", text: "Sebutkan dua alasan kenapa versi anotasi wajib dicatat di methods" },
      ],
      reference: "95% gen multi-ekson di-splicing alternatif · m6A mengatur tanpa ubah huruf · catat versi anotasi selalu.",
    },
    {
      id: "adv-dogma-bocor",
      eyebrow: "Langkah 8 · Advanced",
      title: "Ketika informasi mengalir mundur: pengecualian yang penting",
      prose: [
        "Dogma asli Crick (1958) sebenarnya hanya melarang satu arah: informasi tidak mengalir dari protein kembali ke asam nukleat. Dua pengecualian nyata justru mempertajam pemahamanmu. Reverse transcription: enzim reverse transcriptase menyalin RNA menjadi DNA — dipakai retrovirus seperti HIV, dan dipakai sel sendiri (telomerase memanjangkan ujung kromosom memakai cetakan RNA). Tanpa mekanisme ini tidak ada RT-PCR dan tidak ada RNA-seq: cDNA yang disekuensing adalah DNA hasil reverse transcription dari RNA.",
        "Prion: protein yang “menularkan” bentuk lipatannya ke protein normal tanpa perantara asam nukleat sama sekali (penyakit sapi gila/BSE, Creutzfeldt-Jakob pada manusia). Ini bukan aliran informasi sekuens — melainkan konformasi — tapi cukup untuk meruntuhkan asumsi “semua agen menular pasti membawa asam nukleat”.",
        "Epigenetik adalah pengecualian ketiga yang paling relevan untuk analis: metilasi DNA (5mC pada dinukleotida CpG — genom manusia punya ~28 juta situs CpG) dan modifikasi histon mengubah ekspresi gen tanpa mengubah satu huruf DNA pun, dan sebagian pola ini diwariskan ke sel anak saat pembelahan. Dua individu dengan DNA identik (kembar identik) mengakumulasi pola metilasi berbeda seiring usia — inilah mengapa sekuens DNA saja tidak menjelaskan seluruh perbedaan fenotipe.",
        "Aturan keputusan: untuk “varian bawaan apa penyebab penyakit ini?” → DNA cukup. Untuk “mengapa gen ini aktif di jaringan A tapi mati di jaringan B?” → butuh lapisan regulasi: RNA + data epigenetik (ChIP-seq, ATAC-seq, metilasi). Mode kegagalan klasik analis: menjelaskan perbedaan fenotipe hanya dari huruf DNA, padahal jawabannya duduk di lapisan regulasi yang tidak pernah diukur.",
      ],
      tasks: [
        { id: "t1", text: "Untuk pertanyaan “mengapa gen X aktif di hati tapi mati di otak?”, tentukan lapisan data yang dibutuhkan" },
        { id: "t2", text: "Jelaskan kenapa kembar identik bisa punya risiko penyakit berbeda meski DNA-nya sama" },
      ],
      reference: "Reverse transcription: RNA→DNA (HIV, telomerase, cDNA) · epigenetik: regulasi tanpa ubah huruf.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya, termasuk yang salah.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: baca dari pertanyaan, bukan dari data",
        body: "Tiga heuristik yang dipakai bioinformatikawan senior setiap kali menerima proyek. Pertama, mulai dari pertanyaan, bukan dari file: tulis satu kalimat — varian, mekanisme, atau fungsi apa yang ingin diketahui — sebelum membuka satu pun file. Kebanyakan analisis gagal bukan karena metodenya salah, melainkan karena lapisan omics-nya salah: DNA untuk pertanyaan yang sebenarnya tentang RNA. Kedua, jadikan angka jangkar sebagai alat kewarasan: 3 miliar basa, 20 ribu gen, 1,5% coding, 0,1% beda antar manusia. Setiap kali hasil komputasimu melanggar jangkar ini — misalnya 5.000 gen “penyebab” untuk satu penyakit Mendel — yang rusak hampir pasti pipeline-mu, bukan biologinya. Ketiga, curigai arah kausalitas: korelasi ekspresi bukan penyebab. Gen yang “menyala” pada kanker bisa jadi akibat, bukan pemicu. Sebelum mengklaim mekanisme, tanya: apakah varian ini mengubah protein (coding), mengubah saklar (regulasi), atau hanya menumpang (linkage)? Tiga pertanyaan itu memangkas sebagian besar analisis buntu sebelum ia berjalan.",
      },
      summary: [
        "Central dogma: DNA → RNA → protein; tiap omics mengukur satu tahap.",
        "Varian: SNP, indel, struktural; dampak synonymous < missense < nonsense/frameshift.",
        "3 miliar basa, 20 ribu gen, 1,5% coding; antar manusia beda 0,1% (~3 juta).",
        "Non-coding penuh saklar pengatur — bukan sampah.",
        "Filter diagnosis: frekuensi populasi → dampak protein → kesesuaian klinis.",
        "Sifat kompleks itu poligenik: satu gen → satu sifat hanya untuk penyakit Mendel langka.",
      ],
      next: { label: "BI2 · Database Biologi", href: "/learn/bi2-database" },
      quiz: [
        {
          q: "Satu gen bisa menghasilkan belasan isoform karena alternative splicing. Implikasinya untuk analisis RNA-seq?",
          options: [
            { text: "Tidak ada — agregat hitungan per gen sudah cukup", why: "Salah: ~95% gen multi-ekson mengalami splicing alternatif; agregat per gen bisa menyembunyikan isoform yang justru berubah antar kondisi." },
            { text: "Kuantifikasi level transkrip/isoform bisa menangkap sinyal yang hilang di level gen", why: "Gen yang total ekspresinya tetap bisa berganti isoform dominan — hanya terlihat bila dihitung per transkrip.", correct: true },
            { text: "Isoform hanya relevan untuk bakteri", why: "Terbalik: bakteri hampir tidak punya splicing; ini justru fenomena eukariota." },
            { text: "RNA-seq tidak mampu mengukur isoform", why: "Mampu — lewat kuantifikasi transkrip (mis. Salmon/kallisto) atau long-read sequencing." },
          ],
        },
        {
          q: "Read RNA-seq terpetakan kuat ke sebuah pseudogen. Bahaya interpretasinya?",
          options: [
            { text: "Tidak ada bahaya selama pemetaannya unik", why: "Pemetaan unik ke pseudogen tetap bukan bukti fungsi — pseudogen memang menyerupai gen asli." },
            { text: "Dikira ekspresi gen fungsional, padahal artefak kemiripan sekuens", why: "~14.000 pseudogen manusia menjebak analis: sinyal “ekspresi” bisa murni homologi, bukan transkripsi fungsional.", correct: true },
            { text: "Pseudogen tidak pernah ditranskripsi", why: "Sebagian pseudogen memang ditranskripsi; masalahnya adalah menafsirkannya sebagai gen fungsional." },
            { text: "Solusinya selalu membuang semua read multi-mapping", why: "Terlalu kasar: membuang semua multi-mapper juga menghilangkan sinyal gen keluarga multigen yang sah." },
          ],
        },
        {
          q: "Urutan central dogma yang benar?",
          options: [
            { text: "Protein → RNA → DNA", why: "Terbalik: protein adalah produk akhir, bukan arsip." },
            { text: "DNA → RNA → protein", why: "Arsip (DNA) → fotokopi (RNA) → pekerja (protein). Tiap omics mengukur satu tahap.", correct: true },
            { text: "RNA → DNA → protein", why: "RNA bukan arsip utama informasi genetik (kecuali beberapa virus)." },
            { text: "DNA → protein → RNA", why: "Protein tidak ditranskripsi menjadi RNA." },
          ],
        },
        {
          q: "RNA-seq mengukur…",
          options: [
            { text: "Varian bawaan", why: "Untuk varian bawaan pakai DNA — RNA berubah-ubah antar kondisi." },
            { text: "Tingkat aktivitas gen (jumlah transkrip) saat ini", why: "Menghitung fotokopi yang beredar ≈ seberapa giat gen bekerja.", correct: true },
            { text: "Struktur protein", why: "Struktur protein diukur dengan kristalografi atau diprediksi (AlphaFold)." },
            { text: "Jumlah kromosom", why: "Jumlah kromosom dilihat dari kariotipe, bukan RNA-seq." },
          ],
        },
        {
          q: "Mutasi nonsense (kodon stop prematur) umumnya…",
          options: [
            { text: "Tidak berpengaruh", why: "Stop prematur memotong protein — itu kerusakan, bukan netral." },
            { text: "Merusak protein (terpotong) — kandidat kuat penyebab penyakit", why: "Protein buntung biasanya loss-of-function; prioritas dalam filter varian.", correct: true },
            { text: "Menguntungkan selalu", why: "Tidak ada varian yang selalu menguntungkan; konteks yang menentukan." },
            { text: "Hanya terjadi di non-coding", why: "Nonsense justru bermakna di daerah coding tempat translasi terjadi." },
          ],
        },
        {
          q: "Dua manusia berbeda sekitar…",
          options: [
            { text: "50% genomnya", why: "Itu level beda antar spesies jauh, bukan antar manusia." },
            { text: "0,1% (~3 juta basa)", why: "1 per 1.000 basa. Kecil persennya, tapi 3 juta posisi = tempat bersembunyi varian penyakit.", correct: true },
            { text: "10%", why: "Terlalu besar 100x lipat untuk variasi antar manusia." },
            { text: "Tidak ada beda", why: "Tanpa perbedaan tidak ada variasi sifat maupun penyakit genetik." },
          ],
        },
        {
          q: "Varian dengan frekuensi 30% di populasi sehat diklaim penyebab penyakit langka. Tanggapan?",
          options: [
            { text: "Masuk akal", why: "Tidak: penyakit langka tidak mungkin disebabkan varian yang umum." },
            { text: "Mustahil — penyakit langka tidak disebabkan varian umum di populasi sehat", why: "Filter frekuensi adalah logika pertama diagnosis genomik. Umum ≠ patogenik untuk penyakit langka.", correct: true },
            { text: "Perlu WGS ulang", why: "Teknologi bukan masalahnya; logika frekuensinya yang runtuh." },
            { text: "Tergantung gennya", why: "Tidak ada gen yang membuat varian umum menjadi penyebab penyakit langka." },
          ],
        },
      ],
    },
  ],
};
