import type { V2Lesson } from "../lib/types";

export const bi10: V2Lesson = {
  slug: "bi10-statistik-bioinfo",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI10 · FDR & Batch Effect: Statistik yang Menyelamatkanmu",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "1.000 penemuan palsu",
      prose: [
        "Sebuah lab menguji 20.000 gen untuk asosiasi dengan penyakit, memakai p<0,05 tanpa koreksi. Hasil: 1.200 “gen penemuan”. Konferensi pers disiapkan. Lalu statistikawan menghitung: 20.000 × 0,05 = 1.000 false positive ekspektasi — hampir semua “penemuan” adalah noise. Konferensi pers dibatalkan.",
        "Di bioinformatika, kamu tidak melakukan SATU uji — kamu melakukan RIBUAN sekaligus. Tanpa koreksi multiple testing, p-value adalah mesin produksi penemuan palsu. Twist-nya: koreksi yang terlalu ketat sama berbahayanya. Bonferroni pada 20.000 gen menuntut p < 2,5×10⁻⁶ — penemuan nyata dengan efek sedang ikut mati. FDR adalah kompromi yang jujur: dari 100 klaimku, ~5 boleh salah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ekspektasi false positive dari 20.000 uji pada α=0,05" },
        { id: "t2", text: "Jelaskan trade-off Bonferroni vs FDR" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira p-value mentah yang “sudah signifikan p<0,05” cukup. p-value mentah dari 20.000 uji BUKAN 20.000 bukti — ia 20.000 kesempatan false positive. Koreksi bukan opsional; ia adalah uji itu sendiri.",
      },
      reference: "20.000 uji → koreksi wajib. Bonferroni = bukti final · FDR = penemuan.",
    },
    {
      id: "lab-koreksi",
      eyebrow: "Langkah 2 · Lab",
      title: "Bonferroni vs BH: hitung sendiri",
      prose: [
        "Simulasi 1.000 uji: 50 sinyal sejati + 950 noise. Terapkan tiga pendekatan — tanpa koreksi, Bonferroni, BH-FDR — dan bandingkan temuan benar vs palsu.",
        "Rasakan sendiri: tanpa koreksi banjir palsu; Bonferroni aman tapi buta; BH menemukan sinyal dengan 5% palsu terkontrol.",
      ],
      tasks: [
        { id: "t1", text: "Terapkan tiga ambang: mentah, Bonferroni, BH" },
        { id: "t2", text: "Bandingkan benar vs PALSU tiap metode" },
      ],
      expected: "tanpa koreksi: banjir palsu · Bonferroni: aman tapi buta · BH: seimbang",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Melakukan p-hacking: coba 10 normalisasi × 5 uji × 3 cutoff lalu laporkan yang signifikan. Peluang ≥1 false positive dari 150 analisis ≈ 99,95%. Pradaftarkan analisismu sebelum menyentuh data.",
      },
      hints: [
        "Bonferroni: p < 0.05/m.",
        "BH: urutkan p; cari k terbesar dengan p_k <= k/m*0.05; ambil k teratas.",
        "Tanpa koreksi: p < 0.05 mentah.",
      ],
      code: {
        starter: `import random\nrandom.seed(77)\nm, n_sinyal = 1000, 50\npvals = []\nfor i in range(m):\n    if i < n_sinyal:\n        pvals.append((True, random.betavariate(0.5, 8)))\n    else:\n        pvals.append((False, random.random()))\n\ndef evaluasi(lolos):\n    benar = sum(1 for i in lolos if pvals[i][0])\n    return benar, len(lolos)-benar\n\n# TULIS KODEMU: tiga pendekatan\nl1 = [i for i,(s,p) in enumerate(pvals) if p < 0.05]\nl2 = [i for i,(s,p) in enumerate(pvals) if p < ]\nurut = sorted(range(m), key=lambda i: pvals[i][1])\nkmax = max([k for k,(i) in enumerate(urut,1) if pvals[i][1] <= ] or [0])\nl3 = urut[:kmax]\n\nfor nama, l in [('tanpa koreksi',l1),('Bonferroni',l2),('BH-FDR',l3)]:\n    b, f = evaluasi(l)\n    print(f'{nama:<14}: {len(l):>4} klaim = {b} benar + {f} PALSU')`,
        lockLines: 10,
        solution: `import random\nrandom.seed(77)\nm, n_sinyal = 1000, 50\npvals = []\nfor i in range(m):\n    if i < n_sinyal:\n        pvals.append((True, random.betavariate(0.5, 8)))\n    else:\n        pvals.append((False, random.random()))\n\ndef evaluasi(lolos):\n    benar = sum(1 for i in lolos if pvals[i][0])\n    return benar, len(lolos)-benar\n\n# TULIS KODEMU: tiga pendekatan\nl1 = [i for i,(s,p) in enumerate(pvals) if p < 0.05]\nl2 = [i for i,(s,p) in enumerate(pvals) if p < 0.05/m]\nurut = sorted(range(m), key=lambda i: pvals[i][1])\nkmax = max([k for k,(i) in enumerate(urut,1) if pvals[i][1] <= k/m*0.05] or [0])\nl3 = urut[:kmax]\n\nfor nama, l in [('tanpa koreksi',l1),('Bonferroni',l2),('BH-FDR',l3)]:\n    b, f = evaluasi(l)\n    print(f'{nama:<14}: {len(l):>4} klaim = {b} benar + {f} PALSU')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "tanpa koreksi\\s*:\\s+\\d+ klaim = \\d+ benar \\+ \\d+ PALSU", label: "tanpa koreksi tercetak", msg: "Cek format print: nama, jumlah klaim, benar, PALSU." },
          { kind: "stdout_matches", task: "t1", pattern: "Bonferroni\\s+:\\s+\\d+ klaim", label: "Bonferroni tercetak", msg: "Ambang Bonferroni = 0.05/m dengan m=1000." },
          { kind: "stdout_matches", task: "t1", pattern: "BH-FDR\\s+:\\s+\\d+ klaim", label: "BH-FDR tercetak", msg: "BH: k terbesar dengan p_k <= k/m*0.05." },
        ],
      },
      reference: "Bonferroni: α/m · BH: garis (k/m)·α · tanpa koreksi = banjir.",
    },
    {
      id: "lab-batch",
      eyebrow: "Langkah 3 · Lab",
      title: "Deteksi batch effect dari matriks korelasi",
      prose: [
        "Simulasi ekspresi 100 gen × 12 sampel (2 kondisi × 2 batch). Batch B menggeser subset gen (pola khas batch: tiap gen ke-3 naik +3.0). Hitung korelasi antar-sampel: apakah sampel lebih mirip sesama batch atau sesama kondisi?",
        "Bila korelasi dalam-batch mengalahkan dalam-kondisi, batch mendominasi — cek desain sebelum lanjut. PCA berlabel batch adalah gambar pertama setiap analisis.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi korelasi Pearson" },
        { id: "t2", text: "Bandingkan korelasi dalam-batch vs dalam-kondisi" },
        { id: "t3", text: "Tarik kesimpulan: aman atau waspada" },
      ],
      expected: "dalam-BATCH ~0.33 > dalam-KONDISI ~0.14 → BATCH mendominasi!",
      hints: [
        "Pearson = kovarians / (sd_x * sd_y).",
        "Dalam-batch: pasangan dengan batch sama (a[1]==b[1]).",
        "Dalam-kondisi: pasangan dengan kondisi sama (a[2]==b[2]).",
      ],
      code: {
        starter: `import random, statistics as st\nrandom.seed(88)\npola_batch = [3.0 if i % 3 == 0 else 0.0 for i in range(100)]\nsampel = []\nfor b in ['A','B']:\n    for k in ['kontrol','kasus']:\n        for r in range(3):\n            expr = [random.gauss(0,1) + (pola_batch[i] if b=='B' else 0)\n                    + (0.8 if k=='kasus' and i<10 else 0) for i in range(100)]\n            sampel.append((f'{b}-{k}{r}', b, k, expr))\n\ndef kor(a, b):\n    # TULIS KODEMU: korelasi Pearson\n    ma, mb = st.mean(a), st.mean(b)\n    atas = \n    bawah = \n    return atas/bawah\n\nkb = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[1]==b[1]]\nkk = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[2]==b[2]]\nprint(f'korelasi rata2 dalam-BATCH   : {st.mean(kb):.2f}')\nprint(f'korelasi rata2 dalam-KONDISI : {st.mean(kk):.2f}')\nif st.mean(kb) > st.mean(kk):\n    print('BATCH mendominasi! -> cek desain, koreksi, atau ulangi.')\nelse:\n    print('Kondisi mendominasi -> aman, lanjutkan analisis.')`,
        lockLines: 10,
        solution: `import random, statistics as st\nrandom.seed(88)\npola_batch = [3.0 if i % 3 == 0 else 0.0 for i in range(100)]\nsampel = []\nfor b in ['A','B']:\n    for k in ['kontrol','kasus']:\n        for r in range(3):\n            expr = [random.gauss(0,1) + (pola_batch[i] if b=='B' else 0)\n                    + (0.8 if k=='kasus' and i<10 else 0) for i in range(100)]\n            sampel.append((f'{b}-{k}{r}', b, k, expr))\n\ndef kor(a, b):\n    # TULIS KODEMU: korelasi Pearson\n    ma, mb = st.mean(a), st.mean(b)\n    atas = sum((x-ma)*(y-mb) for x,y in zip(a,b))\n    bawah = (sum((x-ma)**2 for x in a)*sum((y-mb)**2 for y in b))**0.5\n    return atas/bawah\n\nkb = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[1]==b[1]]\nkk = [kor(a[3],b[3]) for i,a in enumerate(sampel) for b in sampel[i+1:] if a[2]==b[2]]\nprint(f'korelasi rata2 dalam-BATCH   : {st.mean(kb):.2f}')\nprint(f'korelasi rata2 dalam-KONDISI : {st.mean(kk):.2f}')\nif st.mean(kb) > st.mean(kk):\n    print('BATCH mendominasi! -> cek desain, koreksi, atau ulangi.')\nelse:\n    print('Kondisi mendominasi -> aman, lanjutkan analisis.')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "dalam-BATCH\\s+: 0\\.\\d+", label: "korelasi batch tercetak", msg: "Cek rumus Pearson: atas = jumlah (x-mean)(y-mean)." },
          { kind: "stdout_matches", task: "t3", pattern: "BATCH mendominasi", label: "kesimpulan: batch mendominasi", msg: "Dengan pola batch gene-spesifik, korelasi batch harus mengalahkan kondisi." },
        ],
      },
      reference: "PCA berlabel batch = gambar pertama. Batch > kondisi = lampu merah.",
    },
    {
      id: "pca-power",
      eyebrow: "Langkah 4 · PCA, UMAP, power",
      title: "Baca struktur sebelum percaya sinyal",
      prose: [
        "PCA: proyeksi linear variansi maksimal — untuk QC dan struktur global. Plot PCA berlabel batch/kondisi: bila titik mengelompok per batch, bukan per kondisi → berhenti, jangan lanjut ke uji. UMAP: non-linear, menjaga tetangga lokal — untuk visualisasi klaster single-cell. Jangan ukur jarak antar-klaster dari UMAP: ia mengorbankan jarak global.",
        "Power = peluang mendeteksi efek yang ada (1 − β). Dengan 3 vs 3 sampel, power mendeteksi fold-change 1,5x bisa di bawah 30% — “tidak signifikan” pada studi kecil bukan bukti “tidak ada efek”, melainkan “tidak cukup melihat”. Hitung n SEBELUM eksperimen, dengan m terkoreksi: n untuk satu uji-t ≠ n untuk 20.000 uji.",
      ],
      formula: String.raw`\text{Power} = 1 - \beta`,
      formulaNote: "Power = peluang mendeteksi efek yang memang ada. β (beta) = peluang false negative (galat tipe II): efek nyata tapi tidak terdeteksi. Power 0,8 berarti 80% efek nyata tertangkap; sisanya 20% lolos sebagai false negative.",
      tasks: [
        { id: "t1", text: "PCA mengelompok per tanggal sekuensing, bukan kondisi. Artinya?" },
        { id: "t2", text: "Jelaskan kenapa jarak antar-klaster UMAP tidak boleh diukur" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira batch effect selalu bisa dikoreksi dengan ComBat. Hanya bila batch tidak confounded total dengan kondisi. Bila semua kasus di batch A dan semua kontrol di batch B, tidak ada koreksi yang valid — ulangi eksperimen dengan desain interleaved.",
      },
      reference: "PCA untuk QC · UMAP untuk klaster (jarak tak bermakna) · power sebelum eksperimen.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: koreksi dan QC statistik apa?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Ribuan uji hipotesis (RNA-seq, GWAS skrining). → Benjamini-Hochberg (FDR). Alasan: mengontrol proporsi temuan palsu, bukan peluang satu pun salah — cocok untuk eksplorasi. Contoh nyata: daftar 200 kandidat validasi dari 20.000 gen.",
        "Skenario 2 — Mengklaim satu varian kausal. → Bonferroni / ambang 5×10⁻⁸. Alasan: klaim tunggal butuh standar jauh lebih ketat; FDR terlalu longgar untuk vonis. Contoh nyata: ambang genome-wide significance di GWAS.",
        "Skenario 3 — Plot PCA mengelompok per batch, bukan per kondisi. → Berhenti; jangan lanjut ke uji. Alasan: sinyal batch mendominasi — semua “temuan” berikutnya patut dicurigai. Contoh nyata: “subtipe tumor baru” yang ternyata batch library prep.",
        "Skenario 4 — Studi 3 vs 3 tidak signifikan. → Artikan sebagai “tidak cukup melihat” (power <30% untuk FC 1,5x), bukan “tidak ada efek”. Alasan: tidak signifikan pada n kecil adalah cermin power, bukan cermin biologi. Contoh nyata: efek nyata yang baru terlihat setelah n=20.",
        "Skenario 5 — Visualisasi struktur data. → PCA untuk QC global; UMAP untuk eksplorasi visual — tapi jarak antar-klaster UMAP tidak diukur. Alasan: UMAP non-linear dan distorsif terhadap jarak global. Contoh nyata: dua klaster “berdekatan” di UMAP yang sebenarnya jauh.",
        "Aturan praktis 10 detik: banyak uji → BH; PCA mengelompok per batch → desain ulang; n kecil + tidak signifikan = power kurang, bukan bukti negatif."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjalankan ComBat lalu mengklaim batch “hilang” — koreksi statistik tidak menggantikan desain seimbang; batch yang terkonfoundasi sempurna dengan kondisi tidak bisa diselamatkan oleh algoritma apa pun.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "“Signature 50 gen” yang ternyata signature mesin",
      prose: [
        "Paper mengklaim signature 50 gen untuk prognosis kanker (n=200). Perusahaan ingin lisensi. Kamu diminta due diligence. Temuan: 100 sampel baik disekuensing di mesin NovaSeq (2023), 100 buruk di HiSeq (2021). “Signature” = gen-gen yang ekspresinya beda antar mesin. Tanpa koreksi multiple testing yang benar (p<0,05 mentah dari 20.000 gen).",
        "Putusan: TOLAK. Dua cacat fatal independen: batch (mesin+tahun) confounded total dengan outcome — signature = artefak teknis; tanpa koreksi multiple testing, 1.000 false positive ekspektasi — 50 gen bisa semuanya noise. Tidak ada analisis ulang yang bisa menyelamatkan desain ini; butuh kohort baru dengan desain interleaved + validasi independen.",
        "Pelajaran: due diligence bioinformatika = cek batch + cek multiple testing SEBELUM baca hasilnya. Dua cek ini membatalkan sebagian “penemuan” di literatur.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan dua cacat fatal dan kenapa masing-masing fatal" },
        { id: "t2", text: "Tulis rekomendasi untuk perusahaan" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Lisensi signature palsu = investasi hangus + keputusan klinis berbasis noise. Di risiko model, due diligence statistik (batch + multiple testing) adalah kontrol pra-investasi — sama seperti verifikasi agunan sebelum pencairan.",
      },
      reference: "Due diligence: batch dulu, multiple testing dulu, baru baca hasil.",
    },
    {
      id: "adv-gwas-threshold",
      eyebrow: "Langkah 7 · Advanced",
      title: "Ambang GWAS 5e-8 dan anatomi multiple testing skala genom",
      prose: [
        "Angka 5×10⁻⁸ bukan mistis: ia adalah koreksi Bonferroni untuk ~1 juta SNP independen (0,05 / 1.000.000). Karena linkage disequilibrium, 10 juta SNP ter-genotipe hanya mewakili ~1 juta blok independen pada populasi Eropa — dari sanalah ambangnya lahir. Pada populasi Afrika dengan LD lebih pendek, jumlah tes independen lebih besar dan ambang “setara” sedikit lebih ketat; memakai 5e-8 secara buta lintas populasi adalah penyederhanaan yang perlu disadari.",
        "Bonferroni mengontrol family-wise error rate (peluang ≥1 false positive) — sangat ketat, cocok untuk klaim final. Benjamini-Hochberg mengontrol false discovery rate (proporsi false positive di antara yang diklaim) — lebih longgar, cocok untuk eksplorasi dan skrining. Prosedur BH: urutkan p-value menaik p(1) ≤ … ≤ p(m), temukan k terbesar dengan p(k) ≤ (k/m)×α, tolak H0 untuk 1..k. q-value (Storey) adalah versi yang mengestimasi proporsi H0 yang benar — sedikit lebih powerful saat banyak sinyal nyata.",
        "Trade-off yang harus diinternalisasi: Bonferroni meminimalkan klaim palsu tapi mengubur temuan nyata (power rendah) — tepat untuk “varian ini pasti terkait”. FDR menerima sebagian kecil klaim palsu demi menemukan lebih banyak sinyal — tepat untuk “kandidat untuk validasi lanjut”. Memakai FDR untuk klaim kausal final, atau Bonferroni untuk skrining eksplorasi, adalah kesalahan memilih alat.",
        "Mode kegagalan paling mahal: p-hacking terselubung — mencoba Bonferroni, BH, lalu “ambang suggestif 1e-5” sampai daftar gen “cukup banyak”, lalu hanya melaporkan yang terakhir. Praktisi jujur: tetapkan metode koreksi SEBELUM melihat hasil (pre-registrasi analisis), laporkan SEMUA ambang yang dicoba, dan bedakan tegas “signifikan genome-wide” dari “suggestif”.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan asal-usul angka 5×10⁻⁸ dan kenapa ia terkait LD" },
        { id: "t2", text: "Untuk skrining 500 kandidat validasi lanjut vs klaim kausal satu varian: pilih metodenya masing-masing" },
      ],
      reference: "5e-8 = 0,05/1 juta tes independen · Bonferroni untuk klaim · FDR untuk skrining · tetapkan metode dulu.",
    },
    {
      id: "adv-stratifikasi",
      eyebrow: "Langkah 8 · Advanced",
      title: "Stratifikasi populasi: musuh dalam selimut GWAS",
      prose: [
        "Stratifikasi populasi adalah confounder paling licik dalam genetika: jika kasus dan kontrol punya komposisi ancestri berbeda, SNP yang hanya menandai ancestri akan tampak “terkait penyakit”. Contoh klasik: SNP terkait kemampuan memakai sumpit akan “signifikan” bila kasus diambil dari populasi Asia dan kontrol dari Eropa — bukan karena gen sumpit menyebabkan penyakit, melainkan karena ancestri berkorelasi dengan status kasus.",
        "Senjata diagnostiknya dua: QQ plot dan genomic inflation factor (λ). Pada QQ plot, p-value observasi vs ekspektasi di bawah H0: inflasi sistematis (kurva melengkung naik sejak awal) = stratifikasi atau bias; sedikit titik di ujung kanan atas = sinyal sejati. λ adalah median statistik uji observasi dibagi median ekspektasi: λ ≈ 1,00–1,05 sehat; λ > 1,10 patut dicurigai (pada sampel sangat besar, λ naik sedikit secara alami — maka ada λ1000 yang diskalakan ke n=1.000).",
        "Koreksinya standar: masukkan 10 komponen utama (PC) genotipe sebagai kovariat dalam model asosiasi — PC menangkap struktur ancestri dan “menyerap” efeknya. Alternatif modern: linear mixed model (BOLT-LMM, SAIGE) dengan matriks kekerabatan (GRM) yang mengoreksi stratifikasi DAN kekerabatan sekaligus — wajib untuk biobank dengan individu berkerabat.",
        "Aturan praktisi: tidak ada QQ plot + λ = tidak ada GWAS yang bisa dipercaya. Dan waspadai “sinyal” yang p-value-nya justru membaik setelah koreksi PC dihilangkan — itu sinyal yang hidup dari stratifikasi, bukan dari biologi.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan mekanisme stratifikasi populasi menciptakan asosiasi palsu (contoh sumpit)" },
        { id: "t2", text: "QQ plot melengkung naik sejak awal dengan λ = 1,25. Diagnosis dan perbaikannya?" },
      ],
      reference: "Stratifikasi = ancestri meniru sinyal · QQ plot + λ wajib · koreksi: 10 PC atau LMM.",
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
        title: "Intuisi: statistik genomik = manajemen keraguan",
        body: "Tiga heuristik statistisi bioinformatika. Pertama, selalu tanya “berapa banyak tebakan yang kulakukan?” sebelum percaya satu p-value: 20.000 gen × α 0,05 = 1.000 false positive ekspektasi. Angka signifikansi tanpa koreksi multiple testing di era genomik bukan bukti — ia undian. Kedua, bedakan tiga pertanyaan: “apakah ada sinyal?” (p-value + koreksi), “seberapa besar?” (effect size + interval), “apakah nyata secara teknis?” (replikasi, validasi). P-value kecil dengan efek 1% dan tanpa replikasi adalah bisikan, bukan temuan. Ketiga, curigai kerapian yang berlebihan: daftar gen DE yang “terlalu bersih” (semua searah, semua di satu pathway) lebih sering menandakan batch effect atau filter yang terlalu agresif daripada biologi yang elegan. Biologi itu berisik; hasil yang tidak berisik sama sekali patut dipertanyakan. Keempat — untuk kerja Indonesia: koreksi populasi bukan opsional. Tanpa PC/LMM, “temuan” GWAS-mu mungkin hanya peta migrasi nenek moyang yang menyamar sebagai sains.",
      },
      summary: [
        "Multiple testing: tanpa koreksi = banjir false positive.",
        "Bonferroni (FWER) untuk klaim final; FDR/BH untuk penemuan.",
        "Batch effect: deteksi via PCA; cegah via desain interleaved.",
        "Batch confounded total = tidak terselamatkan.",
        "PCA untuk QC/struktur global; UMAP untuk klaster (jarak antar-klaster tak bermakna).",
        "Power: hitung sebelum eksperimen dengan m terkoreksi.",
      ],
      next: { label: "BI11 · Single-Cell RNA-seq", href: "/learn/bi11-single-cell" },
      quiz: [
        {
          q: "GWAS 8 juta SNP pada populasi Afrika memakai ambang 5×10⁻⁸ dan menemukan nol sinyal. Evaluasi ambangnya?",
          options: [
            { text: "Tepat — 5e-8 adalah standar universal", why: "5e-8 diturunkan dari ~1 juta tes independen pada LD Eropa; LD Afrika lebih pendek → tes independen lebih banyak." },
            { text: "Berpotensi terlalu longgar — ambang setara bisa sedikit lebih ketat untuk LD Afrika", why: "Jumlah blok independen lebih besar → koreksi Bonferroni lebih ketat. Ambang buta = asumsi buta.", correct: true },
            { text: "Harus dilonggarkan ke 1e-5 agar ada temuan", why: "Mengganti ambang agar “ada temuan” adalah p-hacking, bukan sains." },
            { text: "Ambang tidak relevan untuk GWAS", why: "Ambang genome-wide justru fondasi kredibilitas GWAS." },
          ],
        },
        {
          q: "QQ plot GWAS melengkung naik sejak awal dengan λ = 1,25. Tindakan benar?",
          options: [
            { text: "Rayakan — banyak sinyal biologis kuat", why: "Inflasi sejak awal = bias sistematis, bukan tumpukan sinyal sejati (sinyal sejati hanya di ujung). " },
            { text: "Curigai stratifikasi/bias; koreksi dengan PC kovariat atau LMM lalu evaluasi ulang", why: "λ > 1,10 menandakan inflasi. Masukkan 10 PC atau pakai BOLT-LMM/SAIGE.", correct: true },
            { text: "Buang semua SNP dengan p > 5e-8", why: "Membuang tidak memperbaiki inflasi; yang dikoreksi adalah modelnya." },
            { text: "Naikkan ukuran sampel", why: "Sampel lebih besar dengan stratifikasi yang sama = inflasi yang sama, lebih signifikan." },
          ],
        },
        {
          q: "20.000 p-value diuji dengan BH pada α=0,05. Setelah diurutkan, gen ke-500 memenuhi p(500) ≤ (500/20000)×0,05 tapi gen ke-501 tidak. Keputusan?",
          options: [
            { text: "Tolak H0 untuk 500 gen pertama", why: "Prosedur BH: temukan k TERBESAR yang memenuhi, tolak 1..k.", correct: true },
            { text: "Hanya gen ke-500 yang signifikan", why: "BH menolak rentang 1..k, bukan satu gen." },
            { text: "Semua 20.000 signifikan", why: "Salah total — hanya yang di bawah ambang adaptif." },
            { text: "Tidak ada yang signifikan — ulangi dengan Bonferroni", why: "Mengganti metode setelah melihat hasil = p-hacking." },
          ],
        },
        {
          q: "Dari 20.000 uji tanpa koreksi pada α=0,05, ekspektasi false positive?",
          options: [
            { text: "0", why: "Salah: tiap uji punya peluang 5% false positive." },
            { text: "~1.000", why: "20.000 × 0,05. Inilah mesin penemuan palsu tanpa koreksi.", correct: true },
            { text: "5", why: "Itu untuk 100 uji, bukan 20.000." },
            { text: "20.000", why: "Tidak semua uji menghasilkan false positive; ekspektasinya 5%." },
          ],
        },
        {
          q: "Kapan Bonferroni dipilih atas FDR?",
          options: [
            { text: "Selalu", why: "Bonferroni terlalu ketat untuk eksplorasi; ia membunuh penemuan." },
            { text: "Klaim final di mana satu false positive pun mahal (GWAS, diagnostik)", why: "FWER vs FDR = bukti final vs penemuan. Pilih sesuai harga kesalahan.", correct: true },
            { text: "Eksplorasi", why: "Eksplorasi butuh power — itu wilayah FDR." },
            { text: "Tidak pernah", why: "Untuk klaim regulasi/diagnostik, Bonferroni adalah standar." },
          ],
        },
        {
          q: "Batch confounded total dengan kondisi (semua kasus batch A). Solusi?",
          options: [
            { text: "ComBat", why: "ComBat akan “mengoreksi” sinyal biologisnya juga — atau gagal total." },
            { text: "Tidak ada koreksi valid — ulangi dengan desain benar", why: "Statistik tidak bisa memisahkan yang tidak terpisahkan di desain. Pencegahan > koreksi.", correct: true },
            { text: "Tambah sampel", why: "Sampel baru di batch yang sama tidak memutus confounding." },
            { text: "Ganti metode uji", why: "Metode apa pun gagal bila informasi sudah hilang di desain." },
          ],
        },
        {
          q: "Jarak antar klaster di plot UMAP…",
          options: [
            { text: "Bermakna kuantitatif", why: "UMAP mengorbankan jarak global demi struktur lokal." },
            { text: "Tidak bermakna — UMAP mengorbankan jarak global", why: "UMAP untuk struktur lokal/klaster. Jangan ukur “kedekatan biologis” darinya.", correct: true },
            { text: "Sama dengan PCA", why: "PCA justru menjaga struktur global; UMAP tidak." },
            { text: "Harus diukur", why: "Mengukurnya = menarik kesimpulan dari artefak visual." },
          ],
        },
        {
          q: "Power 80% artinya…",
          options: [
            { text: "80% hasil signifikan", why: "Power bukan tentang hasil; ia tentang kemampuan deteksi." },
            { text: "Peluang 80% mendeteksi efek yang benar-benar ada", why: "1−β. Hitung SEBELUM eksperimen, dengan m terkoreksi.", correct: true },
            { text: "80% data benar", why: "Tidak ada kaitan dengan “kebenaran data”." },
            { text: "Tidak ada arti", why: "Ada: ia menentukan ukuran sampel yang dibutuhkan." },
          ],
        },
      ],
    },
  ],
};
