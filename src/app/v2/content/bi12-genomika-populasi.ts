import type { V2Lesson } from "../lib/types";

export const bi12: V2Lesson = {
  slug: "bi12-genomika-populasi",
  track: "Bioinformatika",
  module: "Genetika Populasi",
  title: "BI12 · GWAS & Polygenic Score: Genetika Populasi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "1 juta orang, 1 varian",
      prose: [
        "Studi 1 juta orang menemukan varian yang menaikkan risiko diabetes 1,15x. Media: “Gen diabetes ditemukan!” Realita: varian itu menjelaskan 0,01% variasi — dan diabetes dipengaruhi 1.000+ varian serupa. Satu varian = setetes; yang penting adalah lautan poligenik.",
        "Twist-nya berlapis. Pertama: 1.000 varian × efek 1,15x = polygenic score yang — pada populasi tempat ia dilatih — dapat menandingi faktor klinis untuk STRATIFIKASI risiko (bukan diagnosis); seberapa baik ia menandingi faktor klinis bergantung pada penyakit dan populasi, dan lesson ini tidak menyajikan angka perbandingan langsung untuk diabetes. Kedua, dan ini yang pahit: skor yang dilatih pada 1 juta orang Eropa berkinerja JAUH LEBIH BURUK di populasi Asia atau Afrika (bukan “gagal total” — penurunannya besar tetapi tidak nol, dan besarnya bergantung pada populasi dan penyakit). Skor “personal” yang tidak personal untuk 80% manusia.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa OR 1,15 dengan n=1 juta tetap “kecil” secara individu" },
        { id: "t2", text: "Jelaskan masalah portabilitas polygenic score lintas populasi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira GWAS menemukan “gen penyebab” penyakit. GWAS menemukan lokus terkait (blok LD) — puncak Manhattan = alamat kelurahan, bukan nomor rumah. Gen kausal butuh fine-mapping + eQTL + bukti fungsional.",
      },
      reference: "Sifat kompleks = poligenik: ribuan varian kecil. Satu varian = setetes.",
    },
    {
      id: "lab-hw",
      eyebrow: "Langkah 2 · Lab",
      title: "Uji Hardy-Weinberg sebagai QC",
      prose: [
        "Hardy-Weinberg: frekuensi genotipe = p², 2pq, q² bila populasi ideal. Penyimpangan = sinyal genotyping error, seleksi, atau stratifikasi — dipakai untuk QC SNP sebelum GWAS.",
        "Diberikan count genotipe: hitung frekuensi alel, ekspektasi HW, dan chi-square (df=1; kritis 3,84 untuk α=5%). CATATAN: α=5% di lab ini adalah ambang LATIHAN yang jauh lebih longgar dari praktik GWAS — di kontrol sehat, ambang yang dipakai biasanya p<1e-6 untuk “menyimpang jauh”; dan deviasi HW di KASUS penyakit justru bisa menjadi sinyal asosiasi, bukan alasan buang otomatis. Lolos QC atau buang — dan atas dasar apa?",
      ],
      formula: String.raw`p^2 + 2pq + q^2 = 1`,
      formulaNote: "Kesetimbangan Hardy-Weinberg: p = frekuensi alel A, q = frekuensi alel a (p+q=1). p² = proporsi AA, 2pq = Aa, q² = aa — ekspektasi genotipe bila tidak ada seleksi, migrasi, atau inbreeding. Penyimpangan signifikan = sinyal QC gagal atau struktur populasi.",
      tasks: [
        { id: "t1", text: "Hitung frekuensi alel p dan q" },
        { id: "t2", text: "Hitung chi-square vs ekspektasi HW" },
        { id: "t3", text: "Putuskan: LOLOS QC atau GAGAL" },
      ],
      expected: "p=0.5, q=0.5 · chi-square=0.00 → LOLOS QC",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira penyimpangan HW selalu berarti biologi menarik. Di kontrol sehat, SNP yang menyimpang jauh (p<1e-6) biasanya error genotyping — buang. Pengecualian: di kasus penyakit, deviasi HW justru bisa menjadi sinyal asosiasi. Konteks menentukan.",
      },
      hints: [
        "p = (2*AA + Aa) / (2*n).",
        "Ekspektasi: AA=p²n, Aa=2pqn, aa=q²n.",
        "chi2 = jumlah (obs-exp)²/exp; bandingkan dengan 3.84.",
      ],
      code: {
        starter: `obs = {'AA': 25, 'Aa': 50, 'aa': 25}\nn = sum(obs.values())\n\n# TULIS KODEMU: frekuensi alel, ekspektasi HW, chi-square\np = \nq = 1 - p\nexp = {'AA': p**2*n, 'Aa': 2*p*q*n, 'aa': q**2*n}\nchi2 = \nprint(f'p={p:.3f}, q={q:.3f}')\nfor g in obs:\n    print(f'{g}: observasi={obs[g]}, ekspektasi HW={exp[g]:.1f}')\nprint(f'chi-square = {chi2:.2f} (df=1; kritis 3.84 untuk alpha 5%)')\nprint('LOLOS QC' if chi2 < 3.84 else 'GAGAL QC (ambang latihan alpha 5%) -> periksa dulu: kontrol vs kasus, p<1e-6? Jangan buang otomatis')`,
        lockLines: 1,
        solution: `obs = {'AA': 25, 'Aa': 50, 'aa': 25}\nn = sum(obs.values())\n\n# TULIS KODEMU: frekuensi alel, ekspektasi HW, chi-square\np = (2*obs['AA'] + obs['Aa']) / (2*n)\nq = 1 - p\nexp = {'AA': p**2*n, 'Aa': 2*p*q*n, 'aa': q**2*n}\nchi2 = sum((obs[g]-exp[g])**2/exp[g] for g in obs)\nprint(f'p={p:.3f}, q={q:.3f}')\nfor g in obs:\n    print(f'{g}: observasi={obs[g]}, ekspektasi HW={exp[g]:.1f}')\nprint(f'chi-square = {chi2:.2f} (df=1; kritis 3.84 untuk alpha 5%)')\nprint('LOLOS QC' if chi2 < 3.84 else 'GAGAL QC (ambang latihan alpha 5%) -> periksa dulu: kontrol vs kasus, p<1e-6? Jangan buang otomatis')`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.5, tol: 1e-9, label: "`p` = 0.5", msg: "p = (2×25+50)/200 = 0.5. Cek rumus frekuensi alel." },
          { kind: "equal", task: "t2", name: "chi2", value: 0.0, tol: 1e-9, label: "`chi2` = 0.0", msg: "Observasi persis sama dengan ekspektasi → chi-square 0." },
          { kind: "stdout_matches", task: "t3", pattern: "LOLOS QC", label: "keputusan LOLOS QC", msg: "chi2=0 < 3.84 → LOLOS QC." },
        ],
      },
      reference: "HW = neraca QC. Miring = ada masalah genotyping/stratifikasi.",
    },
    {
      id: "lab-stratifikasi",
      eyebrow: "Langkah 3 · Lab",
      title: "Gen sumpit palsu: stratifikasi populasi",
      prose: [
        "Studi “gen kemampuan menyumpit”: SNP terkait kuat! Ternyata sampel campur Asia (bisa menyumpit, alel X umum) + Eropa (tidak, alel X langka). Setelah koreksi populasi: sinyal lenyap total.",
        "Simulasi ini: 2 subpopulasi dengan frekuensi alel dan “kemampuan menyumpit” yang beda. Uji asosiasi mentah vs terkoreksi populasi — saksikan sinyal palsu lenyap. Inilah kenapa GWAS wajib koreksi PCA.",
      ],
      tasks: [
        { id: "t1", text: "Hitung asosiasi mentah P(sumpit|alel)" },
        { id: "t2", text: "Hitung asosiasi per populasi" },
        { id: "t3", text: "Simpulkan: sinyal nyata atau stratifikasi" },
      ],
      expected: "mentah: 71% vs 30% (terlihat!) · per populasi: tidak ada efek",
      hints: [
        "P(sumpit|alel) = rata-rata sumpit pada yang beralel.",
        "Filter dulu per populasi, lalu hitung di tiap subset.",
        "Bandingkan pola mentah vs terkoreksi.",
      ],
      code: {
        starter: `import random\nrandom.seed(31337)\ndata = []\nfor _ in range(1000):\n    asia = random.random() < 0.5\n    alel = 1 if random.random() < (0.7 if asia else 0.2) else 0\n    sumpit = 1 if random.random() < (0.9 if asia else 0.1) else 0\n    data.append((asia, alel, sumpit))\n\n# TULIS KODEMU: asosiasi mentah vs per populasi\na1 = [d for d in data if d[1]==1]; a0 = [d for d in data if d[1]==0]\nmentah1 = \nmentah0 = \nprint(f'mentah: P(sumpit|alel)={mentah1:.0%} vs P(sumpit|non)={mentah0:.0%}')\nprint('per populasi:')\nfor asia, nama in [(True,'Asia'),(False,'Eropa')]:\n    sub = [d for d in data if d[0]==asia]\n    b1 = [d for d in sub if d[1]==1]; b0 = [d for d in sub if d[1]==0]\n    p1 = sum(d[2] for d in b1)/len(b1) if b1 else 0\n    p0 = sum(d[2] for d in b0)/len(b0) if b0 else 0\n    print(f'  {nama}: {p1:.0%} vs {p0:.0%} -> TIDAK ADA efek')`,
        lockLines: 8,
        solution: `import random\nrandom.seed(31337)\ndata = []\nfor _ in range(1000):\n    asia = random.random() < 0.5\n    alel = 1 if random.random() < (0.7 if asia else 0.2) else 0\n    sumpit = 1 if random.random() < (0.9 if asia else 0.1) else 0\n    data.append((asia, alel, sumpit))\n\n# TULIS KODEMU: asosiasi mentah vs per populasi\na1 = [d for d in data if d[1]==1]; a0 = [d for d in data if d[1]==0]\nmentah1 = sum(d[2] for d in a1)/len(a1)\nmentah0 = sum(d[2] for d in a0)/len(a0)\nprint(f'mentah: P(sumpit|alel)={mentah1:.0%} vs P(sumpit|non)={mentah0:.0%}')\nprint('per populasi:')\nfor asia, nama in [(True,'Asia'),(False,'Eropa')]:\n    sub = [d for d in data if d[0]==asia]\n    b1 = [d for d in sub if d[1]==1]; b0 = [d for d in sub if d[1]==0]\n    p1 = sum(d[2] for d in b1)/len(b1) if b1 else 0\n    p0 = sum(d[2] for d in b0)/len(b0) if b0 else 0\n    print(f'  {nama}: {p1:.0%} vs {p0:.0%} -> TIDAK ADA efek')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "mentah: P\\(sumpit\\|alel\\)=\\d+% vs P\\(sumpit\\|non\\)=\\d+%", label: "asosiasi mentah tercetak", msg: "Hitung rata-rata sumpit pada kelompok beralel vs tidak." },
          { kind: "stdout_matches", task: "t2", pattern: "Asia: \\d+% vs \\d+% -> TIDAK ADA efek", label: "asosiasi Asia tercetak", msg: "Filter sub populasi Asia dulu, lalu hitung per alel." },
        ],
      },
      reference: "Stratifikasi = confounding genetik. Koreksi: PCA sebagai kovariat.",
    },
    {
      id: "prs",
      eyebrow: "Langkah 4 · Polygenic score",
      title: "Menjumlahkan setetes menjadi lautan",
      prose: [
        "PRS = Σ (efek SNP × jumlah alel): agregat ribuan varian kecil menjadi skor risiko individu. Satu SNP menjelaskan 0,01%, tapi 1 juta SNP menjelaskan 20–30% variasi. Individu top 5% PRS jantung bisa berisiko 3–5x rata-rata — berguna untuk stratifikasi, bukan diagnosis.",
        "Batasan: transferabilitas — PRS dari Eropa berkinerja buruk di Asia/Afrika (LD & frekuensi beda); bukan vonis — probabilitas, bukan takdir; isu etik (diskriminasi asuransi). eQTL menjembatani GWAS ke mekanisme: SNP GWAS diabetes ternyata eQTL untuk TCF7L2 di pankreas — dari “blok LD” menjadi “cerita biologis”. Catatan: eQTL menunjukkan SNP itu BERASOSIASI dengan ekspresi TCF7L2, bukan membuktikan SNP itu MENGATUR TCF7L2; “cerita biologis” di sini = hipotesis mekanisme, bukan vonis kausal — kausalitas butuh bukti fungsional.",
        "Angka kunci GWAS: ambang signifikansi 5×10⁻⁸ (Bonferroni ~1 juta uji). Selalu baca QQ plot sebelum Manhattan: inflasi genomik (λ >> 1) = curigai ada yang salah — tetapi λ > 1 JUGA bisa berasal dari poligenisitas sejati (ribuan varian kecil yang benar-benar berasosiasi), bukan hanya stratifikasi atau error. Bedakan dengan LD score regression (intercept) dan periksa QQ plot: inflasi di SELURUH garis curigai sistematis; ekor atas yang naik sendirian lebih konsisten dengan sinyal sejati.",
      ],
      formula: String.raw`PRS_i = \sum_{j=1}^{m} \hat{\beta}_j \cdot G_{ij}`,
      formulaNote: "β = efek SNP j dari GWAS; G = genotipe individu i (0/1/2 kopi alel); m = ribuan–jutaan SNP.",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa PRS berguna untuk stratifikasi tapi bukan diagnosis" },
        { id: "t2", text: "Sebutkan dua batasan PRS sebelum dipakai klinik" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "PRS yang dikomunikasikan sebagai “vonis” memicu fatalisme genetik dan diskriminasi asuransi — risiko reputasi dan hukum bagi penyedia tes. Di risiko model, kalibrasi lintas populasi adalah validasi wajib; model yang tidak terkalibrasi untuk pembelinya = produk cacat.",
      },
      reference: "PRS = probabilitas populasi, bukan vonis individu. Waspadai transferabilitas.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: QC dan interpretasi apa di GWAS?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — QC varian sebelum asosiasi. → Uji Hardy-Weinberg; varian yang gagal pada ambang KETAT (di kontrol, p<1e-6) → buang. Alasan: penyimpangan HW yang jauh di kontrol menandakan genotyping error atau seleksi kuat. Tetapi jangan buang otomatis pada α=5% (ambang lab ini) dan jangan buang deviasi di KASUS tanpa memeriksa — deviasi di kasus bisa menjadi sinyal asosiasi. Contoh nyata: “sinyal kuat” yang hilang setelah varian gagal-HW dibuang.",
        "Skenario 2 — Populasi sampel beragam. → PCA struktur populasi + koreksi sebelum klaim asosiasi. Alasan: tanpa koreksi, perbedaan frekuensi alel antar-populasi meniru asosiasi (stratifikasi). Contoh nyata: gen “penyuka sumpit” yang sebenarnya gen perbedaan populasi.",
        "Skenario 3 — Menjalankan PCA untuk struktur. → LD pruning dulu. Alasan: tanpa pruning, blok LD besar mendominasi komponen utama dan PCA membaca LD, bukan struktur. Contoh nyata: PC1 yang ternyata cuma inversi kromosom 8.",
        "Skenario 4 — Memakai polygenic score. → Untuk stratifikasi risiko populasi, bukan diagnosis individu. Alasan: PRS = probabilitas agregat, bukan takdir; satu individu top-5% belum tentu sakit. Contoh nyata: skrining intensif untuk kuintil teratas, bukan vonis.",
        "Skenario 5 — PRS dari studi Eropa dipakai di populasi Asia. → Waspada portabilitas; kalibrasi ulang di populasi target. Alasan: LD dan frekuensi alel berbeda antar-populasi — skornya bisa meleset jauh. Contoh nyata: PRS jantung yang underperform di kohort Asia Timur.",
        "Aturan praktis 10 detik: asosiasi tanpa koreksi struktur = paradox Simpson versi genomik; PRS = probabilitas, bukan takdir."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Merayakan OR 1,15 dengan n=1 juta sebagai “gen penyakit X” — efek satu SNP pada individu kecil; yang bermakna klinis adalah agregat PRS plus faktor non-genetik, bukan satu varian.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "PRS jantung “siap klinik”?",
      prose: [
        "Startup menjual tes PRS jantung: “Top 5% risiko 3x lipat!” Dokter bertanya: boleh dipakai untuk keputusan statin? Fakta: PRS divalidasi di Eropa (AUC +0,03 di atas faktor klinis); belum divalidasi di Indonesia; tidak ada uji RCT bahwa PRS mengubah outcome; isu privasi/asuransi.",
        "Rekomendasi: belum untuk keputusan klinis rutin. Tambahan AUC 0,03 kecil — faktor klinis (kolesterol, tekanan, rokok) jauh lebih menentukan dan bisa diubah. Transferabilitas ke Indonesia meragukan. Tanpa bukti bahwa mengetahui PRS mengubah outcome, ini skrining tanpa manfaat terbukti.",
        "Uang pasien lebih baik untuk cek kolesterol rutin daripada tes PRS mahal. Pelajaran: prediksi ≠ utilitas klinis.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga alasan kenapa belum siap klinik" },
        { id: "t2", text: "Tulis rekomendasi berbasis bukti untuk dokter" },
      ],
      reference: "Prediksi ≠ utilitas klinis. Butuh validasi lokal + bukti outcome.",
    },
    {
      id: "adv-ld-struktur",
      eyebrow: "Langkah 7 · Advanced",
      title: "LD, haplotype block, dan PCA yang jujur",
      prose: [
        "Linkage disequilibrium (LD) mengukur korelasi antar varian: r² = 1 berarti dua SNP selalu diwariskan bersama (satu memberi tahu yang lain), r² = 0 berarti independen. LD meluruh dengan jarak dan waktu — populasi Afrika yang lebih tua punya blok haplotipe lebih pendek (LD meluruh cepat), populasi non-Afrika yang melewati bottleneck out-of-Africa punya blok lebih panjang. Inilah alasan resolusi fine-mapping lebih baik pada ancestri Afrika.",
        "Implikasi praktis pertama: LD pruning sebelum PCA/ADMIXTURE. SNP dalam LD kuat adalah “suara ganda” — 10 SNP yang berkorelasi sempurna memberi bobot 10x pada satu sinyal evolusi, mendistorsi komponen utama. Standar: prune dengan ambang r² > 0,2 (window 50 SNP, geser 5) sebelum analisis struktur. PCA tanpa pruning bisa menampilkan “struktur” yang sebenarnya hanya satu daerah genomik bervariasi tinggi (mis. inversi besar).",
        "Implikasi kedua: tag SNP. Karena LD, kita tidak perlu genotipe semua 10 juta SNP — array 500 ribu tag SNP + imputasi memakai panel referensi (1000 Genomes, HRC, TOPMed) bisa merekonstruksi jutaan varian dengan akurasi > 95% pada ancestri yang terwakili. Tapi akurasi imputasi anjlok pada populasi yang tidak ada di panel — alasan lain Indonesia butuh panel referensi sendiri.",
        "Aturan keputusan: untuk PCA struktur populasi — prune LD dulu, pakai SNP independen; untuk fine-mapping kausal — justru manfaatkan LD (kandidatkan semua SNP dalam blok LD tinggi dengan sinyal); untuk imputasi — cek kecocokan ancestri panel vs sampelmu sebelum percaya skor kualitas imputasi (INFO > 0,8).",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa LD pruning wajib sebelum PCA struktur populasi" },
        { id: "t2", text: "Kenapa akurasi imputasi bisa anjlok untuk populasi yang tak terwakili di panel referensi?" },
      ],
      reference: "r² = korelasi SNP · prune r²>0,2 sebelum PCA · tag SNP + imputasi butuh panel ancestri cocok.",
    },
    {
      id: "adv-indonesia-etika",
      eyebrow: "Langkah 8 · Advanced",
      title: "Genomik Indonesia dan etika data genom",
      prose: [
        "Indonesia adalah salah satu populasi paling kurang terwakili di database genomik global: gnomAD v4 (~800 ribu individu) nyaris tanpa sampel Indonesia. Akibatnya ganda: (1) filter frekuensi “penyakit langka” tidak bisa diandalkan — varian yang “tidak ada di gnomAD” mungkin polimorfisme umum lokal; (2) polygenic score dari GWAS Eropa portabilitasnya buruk — studi menunjukkan penurunan akurasi 2–5x pada ancestri non-Eropa. Untuk pasien Indonesia, memakai ambang dan skor impor tanpa kalibrasi lokal adalah malpraktik statistik.",
        "Keragaman Indonesia sendiri luar biasa: dari ancestri Austronesia di barat hingga komponen Papuan di timur — stratifikasi internal yang nyata. Studi asosiasi “satu Indonesia” tanpa koreksi struktur akan menemukan “sinyal” yang sebenarnya peta migrasi. Inisiatif seperti GenomeAsia 100K mulai mengisi kekosongan, tapi jalan masih panjang: analis Indonesia harus menjadi pengisi — bukan sekadar konsumen — referensi genomik.",
        "Etika data genom tidak bisa ditempel belakangan. Tiga prinsip: (1) informed consent yang spesifik — partisipan harus tahu datanya bisa dipakai ulang untuk riset lain (broad consent) atau tidak; (2) data sovereignty — komunitas adat punya hak atas data genetiknya (contoh preseden: suku Havasupai vs Arizona State, 2010); (3) re-identifikasi itu nyata — Gymrek et al. (2013) menunjukkan nama keluarga bisa ditebak dari Y-STR + database genealogi publik. “De-identifikasi” bukan “anonim”: data genom adalah identifier intrinsik.",
        "Aturan praktisi: untuk riset Indonesia — libatkan komunitas sejak desain, simpan data di repositori dengan akses terkontrol (bukan open download), dan jangan pernah menjanjikan “100% anonim” karena itu janji yang tidak bisa ditepati. Kepercayaan komunitas lebih mahal daripada satu publikasi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan dua akibat underrepresentasi Indonesia di gnomAD untuk diagnosis klinis" },
        { id: "t2", text: "Sebutkan tiga prinsip etika data genom dan contoh pelanggarannya" },
      ],
      reference: "gnomAD minim Indonesia → filter & PRS impor tak andal · de-identifikasi ≠ anonim · libatkan komunitas.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: populasi adalah konteks, bukan koreksi tempelan",
        body: "Tiga heuristik genetika populasi dari praktisi. Pertama, selalu tanya “siapa denominatornya?”: frekuensi alel, ambang signifikansi, dan skor poligenik hanya bermakna relatif terhadap populasi referensi. Angka tanpa populasi = angka tanpa makna. Varian “langka” di gnomAD bisa jadi “umum” di desamu — dan vonis klinis mengikuti denominator, bukan sebaliknya. Kedua, struktur populasi ada di mana-mana sampai terbukti tidak ada: asumsikan stratifikasi, lalu buktikan ia terkoreksi (QQ plot + λ + PC), bukan sebaliknya. “Sinyal” yang hilang setelah koreksi PC bukanlah temuan yang “dibunuh statistik” — ia tidak pernah hidup. Ketiga, hormati LD sebagai peta, bukan gangguan: blok haplotipe memberitahumu resolusi apa yang bisa dicapai datamu. Fine-mapping yang mengklaim “varian kausal pasti” di tengah blok r² > 0,9 adalah klaim melebihi resolusi data. Keempat — khusus untuk Indonesia: setiap analisis yang kamu lakukan di atas referensi Eropa adalah analisis pinjaman. Investasi terbaik kariermu adalah ikut membangun referensi lokal — datanya, metodenya, etikanya.",
      },
      summary: [
        "HW (p²+2pq+q²=1): QC genotyping; LD: dasar tag SNP.",
        "GWAS: jutaan uji; ambang 5e-8; baca Manhattan + QQ.",
        "Stratifikasi = confounding genetik; koreksi PCA/mixed model.",
        "Puncak = blok LD, bukan gen pasti — fine-mapping + eQTL.",
        "PRS = Σ efek×alel: stratifikasi populasi, bukan diagnosis.",
        "Waspadai transferabilitas PRS lintas populasi.",
      ],
      next: { label: "BI13 · Epigenomik", href: "/v2/learn/bi13-epigenomik" },
      quiz: [
        {
          q: "PCA struktur populasi dilakukan tanpa LD pruning pada data dengan inversi besar 8 Mb. Risikonya?",
          options: [
            { text: "Tidak ada — PCA kebal terhadap LD", why: "Salah: SNP dalam LD kuat menjadi suara ganda yang mendistorsi komponen utama." },
            { text: "PC1 justru menangkap inversi, bukan struktur ancestri", why: "Ratusan SNP berkorelasi di satu daerah mendominasi varians — “struktur” palsu.", correct: true },
            { text: "PCA gagal berjalan (error)", why: "PCA tetap berjalan; yang rusak adalah interpretasinya, bukan komputasinya." },
            { text: "Hasilnya identik dengan pruning", why: "Hanya bila tidak ada LD kuat — justru kasus yang sedang diuji." },
          ],
        },
        {
          q: "RS ingin memakai polygenic score diabetes dari GWAS Eropa untuk skrining pasien Indonesia. Responsmu?",
          options: [
            { text: "Setuju — genetika manusia universal", why: "Portabilitas PRS lintas ancestri turun 2–5x; skor impor tanpa kalibrasi = malpraktik statistik." },
            { text: "Tunda untuk klinik; butuh validasi/kalibrasi pada kohort Indonesia dulu", why: "Perbedaan LD, frekuensi alel, dan lingkungan merusak transfer. Validasi lokal dulu.", correct: true },
            { text: "Setuju dengan ambang lebih ketat", why: "Ambang lebih ketat tidak memperbaiki mis-kalibrasi skor lintas populasi." },
            { text: "Tolak — PRS tidak pernah berguna", why: "Terlalu jauh: PRS berguna untuk stratifikasi risiko PADA populasi tempat ia divalidasi." },
          ],
        },
        {
          q: "Fungsi utama uji Hardy-Weinberg di GWAS?",
          options: [
            { text: "Menemukan gen", why: "HW untuk QC, bukan penemuan." },
            { text: "QC: deteksi genotyping error/stratifikasi via penyimpangan", why: "HW = neraca. Miring = ada masalah dengan dadu atau pemainnya.", correct: true },
            { text: "Menghitung risiko individu", why: "Risiko individu dihitung dari PRS, bukan HW." },
            { text: "Tidak ada", why: "Ada: filter QC standar GWAS." },
          ],
        },
        {
          q: "LD memungkinkan…",
          options: [
            { text: "Tanpa sekuensing", why: "Array SNP tetap butuh genotyping." },
            { text: "Array 500rb SNP mewakili 10 juta varian via blok LD", why: "Tetangga diwariskan bersama. Satu tag SNP = info satu blok.", correct: true },
            { text: "Tanpa statistik", why: "GWAS tetap butuh uji asosiasi per SNP." },
            { text: "Kloning", why: "Tidak ada kaitan." },
          ],
        },
        {
          q: "QQ plot menunjukkan SEMUA titik di atas garis diagonal. Artinya?",
          options: [
            { text: "Banyak penemuan", why: "Inflasi global bukan penemuan; ia masalah sistematis." },
            { text: "Inflasi sistematis — curigai stratifikasi/kualitas, jangan percaya puncak", why: "Ekor atas saja yang boleh naik. Inflasi global = curigai masalah sistematis (stratifikasi/kualitas) — tetapi λ > 1 juga bisa dari poligenisitas sejati; jangan vonis dari λ saja, periksa intercept LD score regression.", correct: true },
            { text: "Normal", why: "Normal = mengikuti garis diagonal kecuali ekor." },
            { text: "Power tinggi", why: "Power tinggi menaikkan ekor, bukan seluruh garis." },
          ],
        },
        {
          q: "PRS top 1% risiko 5x. Interpretasi tepat?",
          options: [
            { text: "Pasti sakit", why: "5x dari risiko kecil tetap kecil; bukan vonis." },
            { text: "Probabilitas populasi 5x — untuk stratifikasi, bukan vonis individu", why: "Komunikasi yang salah = fatalisme genetik.", correct: true },
            { text: "Tidak berguna", why: "Berguna untuk stratifikasi risiko populasi." },
            { text: "Harus diobati", why: "Keputusan terapi butuh faktor klinis + bukti manfaat." },
          ],
        },
        {
          q: "eQTL menjembatani GWAS ke biologi dengan…",
          options: [
            { text: "Menambah sampel", why: "eQTL bukan soal ukuran sampel." },
            { text: "Menghubungkan SNP ke perubahan EKSPRESI gen (mekanisme)", why: "Dari “blok LD terkait” ke “SNP ini BERASOSIASI dengan ekspresi gen X di jaringan Y” — eQTL = asosiasi ekspresi, BUKAN bukti kausal bahwa SNP “mengatur” gen itu; kausalitas butuh bukti fungsional (fine-mapping, eksperimen).", correct: true },
            { text: "Mengganti GWAS", why: "eQTL melengkapi, bukan mengganti GWAS." },
            { text: "Tidak ada", why: "Ada: ia jembatan ke mekanisme." },
          ],
        },
      ],
    },
  ],
};
