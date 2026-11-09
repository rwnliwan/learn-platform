import type { V2Lesson } from "../lib/types";

export const bi9: V2Lesson = {
  slug: "bi9-rna-seq",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI9 · RNA-seq: Gen Apa yang Berubah",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "20.000 gen, 3 replikat",
      prose: [
        "Peneliti punya 3 sampel kanker vs 3 normal, 20.000 gen. Ia menjalankan uji-t per gen pada data mentah — dapat 5.000 “gen signifikan”. Reviewer menolak dalam 1 paragraf: tanpa normalisasi yang benar, tanpa model count yang tepat, tanpa koreksi multiple testing — 5.000 itu sebagian besar noise.",
        "RNA-seq adalah ujian statistik bioinformatika: data count yang overdispersed, 20.000 uji simultan, dan replikat sedikit. Twist-nya: tanpa normalisasi yang benar, ranking gen-nya pun berubah total — gen peringkat 1 di analisis mentah bisa jatuh ke peringkat 800 setelah normalisasi. Count mentah menyesatkan bahkan untuk eksplorasi paling sederhana.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga kesalahan analisis pada cerita ini" },
        { id: "t2", text: "Jelaskan kenapa ranking gen bisa berubah total setelah normalisasi" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan uji-t per gen pada count mentah. Count itu diskret + overdispersed + n kecil — ketiga asumsi uji-t dilanggar. Hasilnya ribuan temuan palsu yang terlihat meyakinkan.",
      },
      reference: "RNA-seq = normalisasi benar + model count tepat + FDR. Tanpa ketiganya = noise.",
    },
    {
      id: "lab-normalisasi",
      eyebrow: "Langkah 2 · Lab",
      title: "Artefak komposisi dan size factor",
      prose: [
        "Simulasi 5 gen: 4 stabil + 1 (MYC) meledak di kondisi B. Normalisasi total (RPM, bagi total read) membuat 4 gen stabil TERLIHAT turun — palsu. Ini artefak komposisi: satu gen ekstrem menggeser semua gen lain.",
        "Median-of-ratios (ala DESeq2): hitung rasio tiap gen terhadap pasangannya, ambil MEDIAN — median kebal terhadap segelintir gen ekstrem. Hasilnya: gen stabil tetap, hanya MYC yang naik. Benar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung RPM kedua kondisi, amati gen 1–4" },
        { id: "t2", text: "Hitung size factor = median rasio" },
        { id: "t3", text: "Normalisasi B dengan size factor, bandingkan" },
      ],
      expected: "RPM menipu (gen1-4 terlihat turun) · size factor=~6.47 · B_adj benar",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai RPM/TPM untuk differential expression. RPM/TPM untuk visualisasi dan perbandingan antar-gen; DE butuh size factor/TMM. Salah normalisasi = ribuan gen DE palsu.",
      },
      hints: [
        "RPM = count / total * 1e6 untuk tiap gen.",
        "Rasio = B[i]/A[i] per gen; size factor = median dari rasio.",
        "B_adj = B[i] / size factor.",
      ],
      code: {
        starter: `import statistics as st\nA = [100, 200, 150, 300, 100]\nB = [100, 200, 150, 300, 5000]\n\n# TULIS KODEMU: bandingkan RPM vs median-of-ratios\ntotA, totB = sum(A), sum(B)\nprint('RPM (bagi total):')\nfor i in range(5):\n    rpmA = \n    rpmB = \n    print(f'  gen{i+1}: A={rpmA:.0f}  B={rpmB:.0f}')\nprint('  -> gen1-4 TERLIHAT turun! (palsu)')\nprint()\nrasio = [b/a for a, b in zip(A, B)]\nsf = \nprint(f'median rasio (size factor B) = {sf:.2f}')\nprint('normalisasi B/sf:')\nfor i in range(5):\n    print(f'  gen{i+1}: A={A[i]}  B_adj={B[i]/sf:.0f}')`,
        lockLines: 2,
        solution: `import statistics as st\nA = [100, 200, 150, 300, 100]\nB = [100, 200, 150, 300, 5000]\n\n# TULIS KODEMU: bandingkan RPM vs median-of-ratios\ntotA, totB = sum(A), sum(B)\nprint('RPM (bagi total):')\nfor i in range(5):\n    rpmA = A[i]/totA*1e6\n    rpmB = B[i]/totB*1e6\n    print(f'  gen{i+1}: A={rpmA:.0f}  B={rpmB:.0f}')\nprint('  -> gen1-4 TERLIHAT turun! (palsu)')\nprint()\nrasio = [b/a for a, b in zip(A, B)]\nsf = st.median(rasio)\nprint(f'median rasio (size factor B) = {sf:.2f}')\nprint('normalisasi B/sf:')\nfor i in range(5):\n    print(f'  gen{i+1}: A={A[i]}  B_adj={B[i]/sf:.0f}')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "gen1: A=117647  B=17391", label: "RPM gen1 menipu", msg: "RPM gen1: A=100/850*1e6=117647, B=100/5750*1e6=17391. Terlihat turun padahal tidak." },
          { kind: "stdout_matches", task: "t2", pattern: "size factor B\\) = 1\\.00", label: "size factor = 1.00", msg: "Rasio = [1,1,1,1,50]; median = 1.00. Median kebal terhadap MYC yang meledak." },
          { kind: "stdout_matches", task: "t3", pattern: "gen5: A=100  B_adj=5000", label: "gen5 tetap naik setelah normalisasi", msg: "B_adj gen5 = 5000/1 = 5000. Hanya MYC yang naik — benar." },
        ],
      },
      reference: "DE: size factor/TMM, bukan RPM. Median kebal terhadap gen ekstrem.",
    },
    {
      id: "lab-volcano",
      eyebrow: "Langkah 3 · Lab",
      title: "Volcano plot dan koreksi FDR (Benjamini-Hochberg)",
      prose: [
        "Diberikan 12 gen (log2FC + p-value): terapkan Benjamini-Hochberg manual, lalu klasifikasikan tiap gen. Volcano plot dibaca dua dimensi: sumbu X = besar efek (log2FC), sumbu Y = keyakinan (−log10 padj).",
        "Kandidat sejati ada di dua puncak: efek besar DAN signifikan. Waspadai dua jebakan: efek besar tapi tak signifikan (noise — jangan kejar!), dan signifikan tapi efek kecil (nyata tapi mungkin tak bermakna biologis).",
      ],
      tasks: [
        { id: "t1", text: "Terapkan koreksi BH untuk dapatkan padj tiap gen" },
        { id: "t2", text: "Klasifikasikan: kandidat / signifikan-efek-kecil / efek-besar-tak-signifikan" },
      ],
      expected: "TP53, MYC, BRCA1, X4 kandidat · X2 ditolak (noise) · X1 efek kecil",
      hints: [
        "Urutkan gen by p-value menaik; untuk rank i: padj = p*m/i.",
        "Ambil running minimum dari belakang agar padj monoton.",
        "Kandidat: padj<0.05 DAN |log2FC|>1.",
      ],
      code: {
        starter: `gen = [('TP53',-2.5,1e-12),('MYC',2.8,1e-11),('GAPDH',0.1,0.4),\n       ('BRCA1',-1.8,1e-6),('ACTB',0.05,0.7),('EGFR',3.2,0.02),\n       ('X1',0.3,1e-8),('X2',4.0,0.3),('X3',-0.1,0.02),\n       ('X4',1.5,1e-4),('X5',-3.0,0.1),('X6',0.8,1e-5)]\nm = len(gen)\n\n# TULIS KODEMU: Benjamini-Hochberg\nurut = sorted(gen, key=lambda x: x[2])\npadj = {}\nmn = 1.0\nfor i, (g, fc, p) in reversed(list(enumerate(urut, 1))):\n    mn = \n    padj[g] = mn\n\nprint(f\"{'gen':<6} {'log2FC':>7} {'padj':>10}  status\")\nfor g, fc, p in gen:\n    pa = padj[g]\n    if pa < 0.05 and abs(fc) > 1: st = 'KANDIDAT'\n    elif pa < 0.05: st = 'signifikan, efek kecil'\n    elif abs(fc) > 1: st = 'efek besar, tak signifikan'\n    else: st = '-'\n    print(f'{g:<6} {fc:>7.1f} {pa:>10.1e}  {st}')`,
        lockLines: 4,
        solution: `gen = [('TP53',-2.5,1e-12),('MYC',2.8,1e-11),('GAPDH',0.1,0.4),\n       ('BRCA1',-1.8,1e-6),('ACTB',0.05,0.7),('EGFR',3.2,0.02),\n       ('X1',0.3,1e-8),('X2',4.0,0.3),('X3',-0.1,0.02),\n       ('X4',1.5,1e-4),('X5',-3.0,0.1),('X6',0.8,1e-5)]\nm = len(gen)\n\n# TULIS KODEMU: Benjamini-Hochberg\nurut = sorted(gen, key=lambda x: x[2])\npadj = {}\nmn = 1.0\nfor i, (g, fc, p) in reversed(list(enumerate(urut, 1))):\n    mn = min(mn, p*m/i)\n    padj[g] = mn\n\nprint(f\"{'gen':<6} {'log2FC':>7} {'padj':>10}  status\")\nfor g, fc, p in gen:\n    pa = padj[g]\n    if pa < 0.05 and abs(fc) > 1: st = 'KANDIDAT'\n    elif pa < 0.05: st = 'signifikan, efek kecil'\n    elif abs(fc) > 1: st = 'efek besar, tak signifikan'\n    else: st = '-'\n    print(f'{g:<6} {fc:>7.1f} {pa:>10.1e}  {st}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "TP53\\s+-2\\.5\\s+\\S+\\s+KANDIDAT", label: "TP53 = KANDIDAT", msg: "TP53: padj≈6e-12 <0.05 dan |FC|=2.5>1 → KANDIDAT." },
          { kind: "stdout_matches", task: "t2", pattern: "X2\\s+4\\.0\\s+\\S+\\s+efek besar, tak signifikan", label: "X2 = efek besar, tak signifikan", msg: "X2: FC=4 tapi padj>0.05 → jangan kejar (noise)." },
          { kind: "stdout_matches", task: "t2", pattern: "X1\\s+0\\.3\\s+\\S+\\s+signifikan, efek kecil", label: "X1 = signifikan, efek kecil", msg: "X1: padj kecil tapi |FC|=0.3 → nyata tapi mungkin tak bermakna biologis." },
        ],
      },
      reference: "BH: padj = p*m/i (running min). Kandidat = padj<0.05 DAN |log2FC|>1.",
    },
    {
      id: "model",
      eyebrow: "Langkah 4 · Model",
      title: "Negative binomial dan shrinkage DESeq2",
      prose: [
        "Count RNA-seq bersifat overdispersed (variansi > mean) — Poisson tidak cukup. Model: Negative Binomial dengan dispersi per gen. DESeq2 memisahkan 3 hal: kedalaman sekuensing (size factor), biologi (ekspresi sebenarnya), dan noise (dispersi).",
        "Shrinkage dispersi = pinjam kekuatan antar-gen: dengan 3 replikat, dispersi satu gen tak terestimasi andal — tapi pola 20.000 gen membantu. Untuk gen count-kecil, DESeq2 juga men-shrink log2FC menuju nol: klaim dari bukti sedikit tidak langsung dipercaya.",
        "Contoh: gen X [10,12,11] vs [100,110,105] → log2FC ≈ 3,3, padj = 1e-8. Gen Y [0,1,0] vs [2,3,2] — uji-t “bisa signifikan” tapi DESeq2 menshrink log2FC-nya. Inilah kebijaksanaan shrinkage.",
      ],
      formula: String.raw`K_{ij} \sim \text{NB}(\mu_{ij} = s_j q_{ij},\, \alpha_i)`,
      formulaNote: "K = count gen i sampel j; s = size factor; q = ekspresi sebenarnya; α = dispersi gen i.",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa Poisson tidak cukup untuk count RNA-seq" },
        { id: "t2", text: "Jelaskan apa yang dilakukan shrinkage dengan 3 replikat" },
      ],
      reference: "NB + dispersi per gen + shrinkage = cara DESeq2 menangani n kecil.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: normalisasi dan uji apa untuk RNA-seq?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Membandingkan ekspresi antar-sampel. → Normalisasi size factor (median rasio), bukan RPM/TPM mentah. Alasan: komposisi RNA berbeda antar-sampel menggeser total count; size factor mengoreksi itu. Contoh nyata: ranking gen terbalik total setelah normalisasi yang benar.",
        "Skenario 2 — Menguji differential expression dari count. → Count mentah + DESeq2 (negative binomial). Alasan: count bersifat overdispersed — Poisson tidak cukup; DESeq2 memodelkan dispersi per gen plus shrinkage. Contoh nyata: 3 replikat per kondisi tetap bisa diuji dengan andal.",
        "Skenario 3 — Menguji 20.000 gen sekaligus. → Koreksi Benjamini-Hochberg, bukan α mentah 0,05. Alasan: 20.000 uji pada α=0,05 = 1.000 false positive ekspektasi. Contoh nyata: 500 “gen DE” runtuh menjadi 2 setelah koreksi.",
        "Skenario 4 — Tanpa replikat biologis. → Jangan klaim DE; desain ulang eksperimennya. Alasan: tanpa replikat, variabilitas biologis tak terestimasi — semua “temuan” adalah tebakan. Contoh nyata: validasi qPCR gagal total untuk daftar tanpa replikat.",
        "Skenario 5 — Batch tercampur dengan kondisi. → Rancang ulang sebelum sekuensing; koreksi pasca-hoc terbatas. Alasan: batch yang terkonfoundasi sempurna dengan kondisi tidak bisa dipisahkan statistik. Contoh nyata: “gen DE” yang ternyata gen perbedaan tanggal sekuensing.",
        "Aturan praktis 10 detik: count mentah + DESeq2 + BH; TPM/RPKM untuk visualisasi, bukan untuk uji; batch terlihat di PCA → desainnya yang salah."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengurutkan gen berdasarkan fold-change mentah tanpa padj — gen ber-count kecil meledak secara artifisial; shrinkage DESeq2 ada justru untuk meredam ini.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“500 gen resistensi obat” yang salah desain",
      prose: [
        "Tim membandingkan 3 sampel responsif vs 3 resisten kemoterapi dengan design = ~kondisi. Hasil: 500 gen DE. Validasi 20 gen via qPCR: hanya 2 terkonfirmasi.",
        "Audit: 3 responsif disekuensing Januari (batch 1), 3 resisten Maret (batch 2). PCA menunjukkan pemisahan sempurna per batch — bukan per kondisi. Batch effect total: DESeq2 tidak bisa memisahkan — 500 gen = perbedaan batch (tanggal, reagen, teknisi), bukan biologi. Tidak ada statistik yang menyelamatkan desain confounded total.",
        "Seharusnya: rancang interleaved (acak batch); PCA SEBELUM DE — bila batch mendominasi, hentikan; design = ~batch + kondisi hanya bila batch tidak confounded total. Pelajaran termahal RNA-seq: desain eksperimen > analisis.",
      ],
      tasks: [
        { id: "t1", text: "Diagnosis: kenapa 500 gen DE runtuh menjadi 2 validasi" },
        { id: "t2", text: "Tulis tiga langkah desain yang benar" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "18 dari 20 validasi qPCR gagal = uang dan waktu terbuang karena 1 jam perencanaan dilewatkan. Di risiko proyek, batch confounded adalah risiko yang tidak bisa dimitigasi setelah data terkumpul — ia harus dicegah di desain, seperti kontrol pra-pencairan kredit.",
      },
      reference: "PCA dulu, p-value kemudian. Desain interleaved. Batch confounded = ulangi.",
    },
    {
      id: "adv-normalisasi",
      eyebrow: "Langkah 7 · Advanced",
      title: "RPKM/FPKM vs TPM vs size factors: normalisasi yang tidak berbohong",
      prose: [
        "RPKM/FPKM (reads per kilobase per million) dulu standar, tapi punya cacat fatal: ia tidak comparable antar sampel. Penyebabnya: total “transkrip” per sampel berbeda — sampel dengan sedikit gen yang sangat terekspresi akan menekan RPKM semua gen lain, meski biologi gen-gen itu tidak berubah. Ranking gen bisa jungkir balik hanya karena satu gen outlier. Inilah jebakan yang membuat banyak “temuan” lama tidak terreproduksi.",
        "TPM (transcripts per million) memperbaiki ini dengan urutan operasi yang dibalik: normalisasi panjang dulu, baru normalisasi kedalaman — sehingga jumlah TPM per sampel selalu 1 juta. TPM comparable antar sampel untuk perbandingan proporsi (“gen X menyumbang 2% transkriptom”). Tapi TPM pun bukan untuk uji statistik: ia tetap data komposisional, dan uji DE butuh count mentah + model yang tepat.",
        "DESeq2 memakai median-of-ratios (size factors): untuk tiap gen, hitung rasio count sampel terhadap rata-rata geometrik lintas sampel, lalu ambil mediannya sebagai faktor skala. Median kebal terhadap segelintir gen yang sangat berubah — asumsi intinya: MAYORITAS gen tidak berubah antar kondisi. edgeR memakai TMM (trimmed mean of M-values) dengan filosofi serupa. Keduanya bekerja pada count MENTAH, bukan pada TPM/RPKM — karena model negatif binomial butuh informasi depth asli.",
        "Aturan praktisi yang mengakhiri kebingungan: count mentah + DESeq2/edgeR untuk differential expression; TPM (atau VST/rlog dari DESeq2) untuk visualisasi, clustering, dan heatmap. Jangan pernah menjalankan uji-t pada TPM — itu memakai data yang sudah dinormalisasi dua kali dengan uji yang mengasumsikan sebaliknya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa RPKM/FPKM tidak comparable antar sampel" },
        { id: "t2", text: "Untuk volcano plot DE, pakai count mentah+DESeq2 atau TPM+uji-t? Jelaskan" },
      ],
      reference: "RPKM tidak comparable antar sampel · TPM untuk proporsi/visual · DE = count mentah + NB model.",
    },
    {
      id: "adv-batch-de",
      eyebrow: "Langkah 8 · Advanced",
      title: "Batch correction dan differential expression yang jujur",
      prose: [
        "Batch effect adalah perbedaan teknis antar kelompok pemrosesan (tanggal library prep, teknisi, flowcell) yang meniru sinyal biologi. Diagnosisnya wajib SEBELUM differential expression: PCA pada data ternormalisasi — jika sampel mengelompok per tanggal sekuensing bukan per kondisi, kamu punya masalah batch. Mengabaikan ini = “menemukan” ratusan gen DE yang sebenarnya gen “hari Senin vs hari Jumat”.",
        "Koreksi yang benar: masukkan batch ke dalam model (design ~ batch + condition di DESeq2) — bukan menghapusnya dari data lalu berlagak tidak ada. ComBat-seq dan RUV adalah alternatif untuk koreksi eksplisit, tapi semuanya punya syarat mati: batch tidak boleh CONFOUNDED penuh dengan kondisi. Jika semua kontrol diproses batch A dan semua perlakuan batch B, tidak ada matematika yang bisa memisahkan efek batch dari efek biologi — eksperimennya cacat dari desain, dan satu-satunya perbaikan adalah mengulang dengan desain berimbang.",
        "Untuk differential expression yang jujur: replikat biologis minimal 3 per kondisi (2 = tidak ada estimasi varians yang waras), laporkan log2 fold change BESERTA padj (signifikansi tanpa efek = noise; efek tanpa signifikansi = anekdot), dan waspadai p-hacking via pemotongan ambang yang digeser-geser sampai “cukup gen”. Shrinkage (apeglm/ashr) menstabilkan estimasi fold change pada count rendah — gen dengan 2 vs 0 read tidak boleh dilaporkan sebagai “fold change tak hingga”.",
        "Aturan keputusan: PCA dulu → model dengan batch → padj + |log2FC| → validasi independen (qPCR atau kohort lain) untuk kandidat teratas. Daftar 500 gen DE tanpa validasi adalah hipotesis, bukan temuan.",
      ],
      tasks: [
        { id: "t1", text: "PCA mengelompok per batch, bukan kondisi. Tulis dua langkah perbaikan yang benar" },
        { id: "t2", text: "Kenapa batch yang fully confounded dengan kondisi tidak bisa dikoreksi statistik?" },
      ],
      reference: "PCA sebelum DE · batch masuk model, bukan dihapus diam-diam · confounded penuh = desain cacat.",
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
        title: "Intuisi: RNA-seq mengukur bayangan, bukan bendanya",
        body: "Empat heuristik analis RNA-seq senior. Pertama, ingat apa yang sebenarnya diukur: jumlah fragmen cDNA yang berhasil disekuensing — bayangan dari ekspresi, terdistorsi oleh panjang transkrip, komposisi GC, depth, dan batch. Setiap angka “ekspresi” adalah estimasi dengan rantai asumsi; perlakukan ia sebagai itu. Kedua, normalisasi bukan sihir: ia hanya bisa mengoreksi perbedaan teknis yang modelnya kamu pahami (depth, komposisi). Ia tidak bisa menyelamatkan desain buruk — 2 replikat tanpa ulangan, atau batch yang confounded, tetap sampah setelah dinormalisasi. Ketiga, pisahkan tiga pertanyaan yang sering dicampur: “berapa banyak?” (kuantifikasi — TPM), “apakah berubah?” (DE — count + model NB), “apakah bermakna biologis?” (interpretasi — pathway, validasi). Kebanyakan kontroversi RNA-seq lahir dari menjawab pertanyaan kedua dengan alat pertanyaan pertama. Keempat — nasihat lapangan: sebelum percaya daftar gen DE, lihat MA plot dan PCA; pola yang aneh di sana tidak pernah “nanti saja”.",
      },
      summary: [
        "Normalisasi DE = size factor/TMM; waspadai artefak komposisi.",
        "Count overdispersed → Negative Binomial + shrinkage (DESeq2/edgeR).",
        "Jangan uji-t pada count mentah.",
        "FDR (BH) wajib untuk 20.000 uji.",
        "Volcano: baca efek DAN signifikansi bersamaan.",
        "Desain: batch dalam formula; PCA sebelum DE.",
      ],
      next: { label: "BI10 · FDR & Batch Effect", href: "/v2/learn/bi10-statistik-bioinfo" },
      quiz: [
        {
          q: "Dua sampel: gen X ber-RPKM 100 di keduanya. Sampel B punya satu gen outlier yang sangat terekspresi. Kesimpulan “ekspresi X sama”?",
          options: [
            { text: "Benar — RPKM sudah dinormalisasi depth", why: "RPKM tidak comparable antar sampel bila komposisi transkriptom berbeda; outlier menekan RPKM gen lain." },
            { text: "Belum tentu — RPKM terdistorsi komposisi; bandingkan via TPM/size factors", why: "Satu gen outlier mengubah total per juta. Normalisasi komposisi (TPM, median-of-ratios) yang benar.", correct: true },
            { text: "Benar — RPKM kebal terhadap outlier", why: "Justru sebaliknya: RPKM sensitif terhadap perubahan komposisi total." },
            { text: "Salah — harus memakai FPKM, bukan RPKM", why: "FPKM = RPKM untuk paired-end; cacat komposisinya sama." },
          ],
        },
        {
          q: "Semua kontrol diproses Senin, semua perlakuan diproses Jumat. Analisis DE menemukan 2.000 gen signifikan. Masalahnya?",
          options: [
            { text: "Tidak ada — 2.000 gen memang respons biologi", why: "Tidak bisa dibedakan dari efek batch; desainnya confounded penuh." },
            { text: "Batch fully confounded dengan kondisi — tak bisa dikoreksi statistik", why: "ComBat/model butuh variasi batch DALAM tiap kondisi. Desain ini cacat; ulangi dengan randomisasi.", correct: true },
            { text: "Cukup masukkan batch ke design formula", why: "Model tidak bisa memisahkan dua variabel yang bergerak bersama sempurna." },
            { text: "Naikkan ambang padj menjadi 0,001", why: "Ambang lebih ketat tidak memisahkan sinyal batch dari sinyal biologi." },
          ],
        },
        {
          q: "Gen dengan count 3 vs 0 dilaporkan sebagai “fold change tak hingga — kandidat utama”. Masalahnya?",
          options: [
            { text: "Tidak ada — fold change tak hingga = sinyal terkuat", why: "Pada count rendah, estimasi FC sangat tidak stabil; 3 vs 0 bisa murni noise sampling." },
            { text: "Estimasi FC tak stabil pada count rendah — butuh shrinkage + padj + replikasi", why: "Shrinkage (apeglm/ashr) menstabilkan FC; signifikansi butuh model NB dan ulangan.", correct: true },
            { text: "Harus memakai TPM bukan count", why: "TPM tidak memperbaiki ketidakstabilan count rendah untuk uji DE." },
            { text: "Cukup naikkan depth sekuensing", why: "Depth membantu tapi tidak menggantikan model statistik yang benar." },
          ],
        },
        {
          q: "Kenapa RPM tidak cocok untuk differential expression?",
          options: [
            { text: "Terlalu lambat", why: "RPM justru cepat; masalahnya kebenaran, bukan kecepatan." },
            { text: "Artefak komposisi: segelintir gen ekstrem menggeser semua gen lain", why: "MYC menyedot read → gen lain terlihat turun palsu. Pakai size factor/TMM.", correct: true },
            { text: "Tidak ada alasan", why: "Ada: artefak komposisi yang terbukti di lab." },
            { text: "Hanya untuk DNA", why: "RPM adalah metrik RNA; masalahnya bukan jenis molekul." },
          ],
        },
        {
          q: "Count RNA-seq dimodelkan dengan Negative Binomial karena…",
          options: [
            { text: "Selalu normal", why: "Count tidak normal; ia diskret dan overdispersed." },
            { text: "Overdispersed (variansi > mean) — Poisson tidak cukup", why: "Biologi itu berisik melebihi Poisson. NB + dispersi per gen = model yang tepat.", correct: true },
            { text: "Lebih mudah", why: "NB justru lebih kompleks; dipilih karena benar." },
            { text: "Wajib regulasi", why: "Tidak ada regulasi yang mewajibkan model tertentu." },
          ],
        },
        {
          q: "Fungsi shrinkage dispersi di DESeq2?",
          options: [
            { text: "Mempercantik plot", why: "Shrinkage adalah prosedur statistik, bukan kosmetik." },
            { text: "Pinjam kekuatan antar-gen: stabilkan estimasi dengan replikat sedikit", why: "3 replikat tak cukup estimasi dispersi satu gen — tapi pola 20.000 gen membantu.", correct: true },
            { text: "Menghapus outlier", why: "Outlier ditangani terpisah; shrinkage menstabilkan estimasi." },
            { text: "Tidak ada", why: "Ada: ia alasan “3 vs 3” bisa bekerja." },
          ],
        },
        {
          q: "Gen: log2FC=4, padj=0,3. Sikap?",
          options: [
            { text: "Kejar! efek besar", why: "Efek tanpa keyakinan = harta karun palsu." },
            { text: "Jangan — efek besar tapi tak signifikan = noise (count kecil/variansi besar)", why: "Baca volcano dua dimensi. Efek tanpa keyakinan = jangan kejar.", correct: true },
            { text: "Publikasikan", why: "Publikasi butuh signifikansi; padj=0,3 tidak lolos." },
            { text: "Abaikan FC", why: "FC tetap informatif bila dipasangkan dengan signifikansi." },
          ],
        },
        {
          q: "Dari 20.000 uji tanpa koreksi, p<0,05 menghasilkan sekitar…",
          options: [
            { text: "0 false positive", why: "Salah: peluang false positive per uji = 5%." },
            { text: "1.000 false positive ekspektasi", why: "20.000 × 0,05. Inilah kenapa FDR (BH) wajib — bukan opsional.", correct: true },
            { text: "5", why: "Itu untuk 100 uji, bukan 20.000." },
            { text: "Semua benar", why: "Tanpa koreksi, sebagian besar “temuan” adalah noise." },
          ],
        },
      ],
    },
  ],
};
