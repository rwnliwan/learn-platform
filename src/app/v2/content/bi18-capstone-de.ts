import type { V2Lesson } from "../lib/types";

export const bi18: V2Lesson = {
  slug: "bi18-capstone-de",
  track: "Bioinformatika",
  module: "Capstone",
  title: "BI18 · Capstone: Mini-Proyek Differential Expression",
  estMinutes: 75,
  steps: [
    {
      id: "misi",
      eyebrow: "Langkah 1 · Misi",
      title: "Dari counts ke kandidat obat dalam 75 menit",
      prose: [
        "Misi: 6 sampel RNA-seq (3 kontrol, 3 perlakuan), 12 gen. Tugasmu: normalisasi (RPM), uji differential expression (uji-t + BH), visualisasi awal (PCA mini), interpretasi biologi, dan tulis kesimpulan 3 kalimat untuk “PI”-mu.",
        "Ini ujian komprehensif: normalisasi + DE, uji statistik + koreksi multiple testing, dan pola pikir pipeline. Tidak ada kode baru — hanya merangkai yang sudah kamu kuasai. Kerjakan berurutan; tiap lab mengunci sebelum lanjut.",
      ],
      tasks: [
        { id: "t1", text: "Baca peta misi dan siapkan mental pipeline" },
        { id: "t2", text: "Ingat kembali: RPM = counts dibagi total read (per juta); uji-t = bandingkan rata-rata dua kelompok; BH = koreksi p-value untuk banyak uji serentak" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Capstone melatih pola “analisis berurutan dengan checkpoint”: tiap tahap punya kriteria lolos sebelum lanjut. Di risiko operasional, pola yang sama mencegah kesalahan tahap awal meracuni seluruh keputusan.",
      },
      reference: "Capstone = rangkai normalisasi → uji + koreksi → QC → komunikasi. Checkpoint tiap tahap.",
    },
    {
      id: "lab-rpm",
      eyebrow: "Langkah 2 · Lab 1/4",
      title: "Normalisasi RPM",
      prose: [
        "Langkah 1 pipeline: normalisasi. Total read per sampel berbeda (kedalaman sekuensing) — tanpa normalisasi, sampel yang disekuensing lebih dalam terlihat “lebih aktif” di semua gen.",
        "RPM = count / total kolom × 1e6 — normalisasi PER SAMPEL (kolom), bukan per gen. Lengkapi fungsi `rpm` lalu terapkan ke tiap kolom.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `rpm(kolom)`" },
        { id: "t2", text: "Verifikasi total tiap sampel = 1e6" },
      ],
      expected: "total tiap sampel = 1.000.000 ✓",
      hints: [
        "RPM = count / jumlah(counts) * 1e6.",
        "Jumlahkan tiap kolom sampel.",
        "Gunakan statistics atau sum bawaan.",
      ],
      code: {
        starter: `counts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\nsampel = ['K1','K2','K3','P1','P2','P3']\ngen = list(counts)\n\ndef rpm(kolom):\n    # TULIS KODEMU: normalisasi satu kolom sampel ke sejuta\n    tot = sum(kolom)\n    return \n\n# terapkan per kolom sampel\nmat = {g: [] for g in gen}\nfor j in range(6):\n    kolom = [counts[g][j] for g in gen]\n    nkolom = rpm(kolom)\n    for i, g in enumerate(gen):\n        mat[g].append(nkolom[i])\n\nprint('total RPM per sampel:')\nfor j, s in enumerate(sampel):\n    t = sum(mat[g][j] for g in gen)\n    print(f'  {s}: {t:,.0f}')`,
        lockLines: 7,
        solution: `counts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\nsampel = ['K1','K2','K3','P1','P2','P3']\ngen = list(counts)\n\ndef rpm(kolom):\n    # TULIS KODEMU: normalisasi satu kolom sampel ke sejuta\n    tot = sum(kolom)\n    return [c/tot*1e6 for c in kolom]\n\n# terapkan per kolom sampel\nmat = {g: [] for g in gen}\nfor j in range(6):\n    kolom = [counts[g][j] for g in gen]\n    nkolom = rpm(kolom)\n    for i, g in enumerate(gen):\n        mat[g].append(nkolom[i])\n\nprint('total RPM per sampel:')\nfor j, s in enumerate(sampel):\n    t = sum(mat[g][j] for g in gen)\n    print(f'  {s}: {t:,.0f}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "K1: 1,000,000", label: "total K1 = 1.000.000", msg: "RPM: tiap kolom SAMPEL dinormalisasi ke sejuta — bukan per gen!" },
          { kind: "stdout_matches", task: "t2", pattern: "P3: 1,000,000", label: "total P3 = 1.000.000", msg: "Semua 6 kolom sampel harus tepat 1.000.000." },
        ],
      },
      reference: "RPM: samakan kedalaman dulu, bandingkan kemudian.",
    },
    {
      id: "lab-de",
      eyebrow: "Langkah 3 · Lab 2/4",
      title: "Uji DE + koreksi BH",
      prose: [
        "Langkah 2: differential expression. Untuk tiap gen: log2FC (rata-rata perlakuan vs kontrol, skala log2) + uji-t dua sampel + koreksi Benjamini-Hochberg untuk 12 gen.",
        "Kriteria DE: |log2FC| > 1 DAN q < 0,05. Lengkapi `ttest`, `log2fc`, dan `bh`.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `log2fc` dan `ttest` (Welch sederhana)" },
        { id: "t2", text: "Lengkapi koreksi `bh` dan saring gen DE" },
      ],
      expected: "G01, G03, G06, G09, G10 = DE (q<0.05, |log2FC|>1)",
      hints: [
        "log2FC = log2(mean(P)/mean(K)).",
        "Uji-t Welch: t = selisih / sqrt(v1/n1+v2/n2).",
        "p dari |t| via pendekatan normal: gunakan erf.",
      ],
      code: {
        starter: `import math\ncounts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\n\ndef mean(x): return sum(x)/len(x)\ndef var(x):\n    m = mean(x); return sum((a-m)**2 for a in x)/(len(x)-1)\n\ndef log2fc(k, p):\n    return  # TULIS KODEMU\n\ndef ttest(k, p):\n    # TULIS KODEMU: kembalikan p-value (pendekatan normal)\n    t = \n    return 2*(1-0.5*(1+math.erf(abs(t)/math.sqrt(2))))\n\ndef bh(ps):\n    # TULIS KODEMU: kembalikan q-values BH\n    m = len(ps)\n    ur = sorted(range(m), key=lambda i: ps[i])\n    q = [0]*m\n    for r, i in enumerate(ur):\n        q[i] = \n    for r in range(m-2, -1, -1):\n        q[ur[r]] = min(q[ur[r]], q[ur[r+1]])\n    return q\n\ngen = list(counts)\nps = []\nfor g in gen:\n    k, p = counts[g][:3], counts[g][3:]\n    ps.append(ttest(k, p))\nqs = bh(ps)\nprint('gen DE (|log2FC|>1 & q<0.05):')\nfor g, q in zip(gen, qs):\n    k, p = counts[g][:3], counts[g][3:]\n    fc = log2fc(k, p)\n    if abs(fc) > 1 and q < 0.05:\n        print(f'  {g}: log2FC={fc:+.2f} q={q:.2e}')`,
        lockLines: 10,
        solution: `import math\ncounts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\n\ndef mean(x): return sum(x)/len(x)\ndef var(x):\n    m = mean(x); return sum((a-m)**2 for a in x)/(len(x)-1)\n\ndef log2fc(k, p):\n    return math.log2(mean(p)/mean(k))\n\ndef ttest(k, p):\n    # TULIS KODEMU: kembalikan p-value (pendekatan normal)\n    t = (mean(p)-mean(k))/math.sqrt(var(p)/len(p)+var(k)/len(k))\n    return 2*(1-0.5*(1+math.erf(abs(t)/math.sqrt(2))))\n\ndef bh(ps):\n    # TULIS KODEMU: kembalikan q-values BH\n    m = len(ps)\n    ur = sorted(range(m), key=lambda i: ps[i])\n    q = [0]*m\n    for r, i in enumerate(ur):\n        q[i] = ps[i]*m/(r+1)\n    for r in range(m-2, -1, -1):\n        q[ur[r]] = min(q[ur[r]], q[ur[r+1]])\n    return q\n\ngen = list(counts)\nps = []\nfor g in gen:\n    k, p = counts[g][:3], counts[g][3:]\n    ps.append(ttest(k, p))\nqs = bh(ps)\nprint('gen DE (|log2FC|>1 & q<0.05):')\nfor g, q in zip(gen, qs):\n    k, p = counts[g][:3], counts[g][3:]\n    fc = log2fc(k, p)\n    if abs(fc) > 1 and q < 0.05:\n        print(f'  {g}: log2FC={fc:+.2f} q={q:.2e}')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "G01: log2FC=\\+1\\.\\d+ q=", label: "G01 DE (naik)", msg: "G01: 120-an → 400-an. Cek log2fc dan BH." },
          { kind: "stdout_matches", task: "t2", pattern: "G10: log2FC=-1\\.\\d+ q=", label: "G10 DE (turun)", msg: "G10: 90-an → 30-an (turun). Cek tanda log2FC." },
        ],
      },
      note: {
        title: "Intuisi: uji DE menjawab “apakah beda”, bukan “apakah penting”",
        body: "Praktisi differential expression menyimpan lima heuristik yang tidak tertulis di vignette tool. Satu: |log2FC| > 1 dan q < 0,05 adalah konvensi komunitas, bukan hukum alam — selalu laporkan BESARAN efek dan signifikansi bersamaan; gen dengan log2FC 0,9 dan q = 10^-10 bisa jauh lebih penting daripada gen dengan log2FC 3 dan q = 0,04. Dua: n = 3 per kelompok berarti power rendah — hanya efek raksasa yang terdeteksi; ketiadaan DE bukan bukti ketiadaan efek, melainkan bukti ketiadaan daya. Tiga: PCA dulu SEBELUM uji DE — bila sampel tidak mengelompok sesuai kondisi di PC1/PC2, jangan lanjut ke interpretasi; audit QC dulu, karena DE di atas data ber-noise = daftar gen acak yang terlihat meyakinkan. Empat: batch yang terkorelasi sempurna dengan kondisi adalah eksperimen yang mati — tidak ada metode statistik yang bisa memisahkan “tumor vs normal” dari “Senin vs Jumat”; randomisasi batch adalah keputusan DESAIN, bukan analisis. Lima: validasi ortogonal (qPCR) untuk kandidat kunci sebelum klaim — RNA-seq mengukur relatif terhadap library, qPCR mengukur absolut terhadap housekeeping; bila keduanya setuju, temuanmu kokoh. Heuristik gabungannya: daftar gen DE yang baik selalu datang dengan tiga pendamping — plot PCA yang bersih, desain tanpa confounder, dan rencana validasi.",
      },
      reference: "DE = efek besar (|log2FC|>1) + signifikan (q<0.05).",
    },
    {
      id: "lab-pca",
      eyebrow: "Langkah 4 · Lab 3/4",
      title: "PCA mini: cek pemisahan kelompok",
      prose: [
        "Langkah 3: quality control tingkat lanjut. PCA via power iteration pada data log-RPM terpusat: kalau K dan P terpisah di PC1, sinyal biologimu lebih kuat dari noise teknis.",
        "Lengkpai `power_pc` (1 komponen, 50 iterasi) pada matriks residual, lalu cetak skor PC1 per sampel.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi power iteration untuk PC1" },
        { id: "t2", text: "Interpretasikan pemisahan K vs P" },
      ],
      expected: "K negatif, P positif (atau sebaliknya) → kelompok terpisah",
      hints: [
        "Iterasi: v = X^T (X v), normalisasi tiap langkah.",
        "v = [sum(X[i][j]*Xv[i] untuk tiap gen i) untuk tiap sampel j].",
        "v hasil akhir langsung = skor PC1 per sampel.",
      ],
      code: {
        starter: `import math, random\nrandom.seed(11)\ncounts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\nsampel = ['K1','K2','K3','P1','P2','P3']\n# matriks gen x sampel: log-RPM terpusat per gen\nX = []\nfor g in counts:\n    tot = [sum(counts[h][j] for h in counts) for j in range(6)]\n    lr = [math.log2(counts[g][j]/tot[j]*1e6+1) for j in range(6)]\n    m = sum(lr)/6\n    X.append([a-m for a in lr])\n\ndef power_pc(X, iters=60):\n    # TULIS KODEMU: v = X^T (X v) + normalisasi tiap iterasi\n    # v akhir (panjang 6) = skor PC1 per sampel (skala bebas)\n    n = len(X[0])\n    v = [random.gauss(0,1) for _ in range(n)]\n    for _ in range(iters):\n        Xv = [sum(row[j]*v[j] for j in range(n)) for row in X]\n        v = \n        nv = math.sqrt(sum(a*a for a in v))\n        v = [a/nv for a in v]\n    return v\n\nskor = power_pc(X)\nprint('skor PC1 per sampel:')\nfor s, sc in zip(sampel, skor):\n    print(f'  {s}: {sc:+.2f}')\nprint('K vs P terpisah tanda -> sinyal > noise')`,
        lockLines: 11,
        solution: `import math, random\nrandom.seed(11)\ncounts = {'G01':[120,130,110,400,420,390],'G02':[50,55,48,52,50,53],\n          'G03':[300,310,290,90,95,85],'G04':[10,12,9,11,10,12],\n          'G05':[200,195,190,210,205,195],'G06':[80,85,75,300,310,290],\n          'G07':[15,14,16,15,16,14],'G08':[500,520,480,510,505,515],\n          'G09':[60,62,58,180,185,175],'G10':[90,95,85,30,32,28],\n          'G11':[40,42,38,41,39,40],'G12':[25,26,24,26,25,24]}\nsampel = ['K1','K2','K3','P1','P2','P3']\n# matriks gen x sampel: log-RPM terpusat per gen\nX = []\nfor g in counts:\n    tot = [sum(counts[h][j] for h in counts) for j in range(6)]\n    lr = [math.log2(counts[g][j]/tot[j]*1e6+1) for j in range(6)]\n    m = sum(lr)/6\n    X.append([a-m for a in lr])\n\ndef power_pc(X, iters=60):\n    # v = X^T (X v) + normalisasi tiap iterasi\n    # v akhir (panjang 6) = skor PC1 per sampel (skala bebas)\n    n = len(X[0])\n    v = [random.gauss(0,1) for _ in range(n)]\n    for _ in range(iters):\n        Xv = [sum(row[j]*v[j] for j in range(n)) for row in X]\n        v = [sum(X[i][j]*Xv[i] for i in range(len(X))) for j in range(n)]\n        nv = math.sqrt(sum(a*a for a in v))\n        v = [a/nv for a in v]\n    return v\n\nskor = power_pc(X)\nprint('skor PC1 per sampel:')\nfor s, sc in zip(sampel, skor):\n    print(f'  {s}: {sc:+.2f}')\nprint('K vs P terpisah tanda -> sinyal > noise')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "K1: \\+0\\.4\\d", label: "K1 skor positif ~+0.41", msg: "PC1 harus memisahkan K vs P. Cek v = X^T(Xv) + normalisasi." },
          { kind: "stdout_matches", task: "t2", pattern: "P1: -0\\.4\\d", label: "P1 skor negatif ~-0.40", msg: "Tanda boleh terbalik — yang penting K dan P terpisah." },
        ],
      },
      reference: "PCA = QC: kelompok terpisah → sinyal dominan.",
    },
    {
      id: "lab-laporan",
      eyebrow: "Langkah 5 · Lab 4/4",
      title: "Tulis kesimpulan 3 kalimat",
      prose: [
        "Langkah 4: komunikasi. Analisis terbaik pun gagal kalau tidak bisa dijelaskan. Tugas: rangkai temuan (gen DE, arah, QC) menjadi ringkasan 3 kalimat untuk PI — tanpa jargon berlebih, dengan angka.",
        "Di lab ini kamu mengisi template laporan; checker memvalidasi strukturnya (3 kalimat, menyebut jumlah gen DE, menyebut arah dominan, menyebut hasil QC).",
      ],
      tasks: [
        { id: "t1", text: "Isi LIST_DE dengan 5 gen DE dari Lab 2" },
        { id: "t2", text: "Tulis 3 kalimat kesimpulan" },
      ],
      expected: "laporan 3 kalimat valid: N gen, arah, QC",
      hints: [
        "Kalimat 1: berapa gen DE + kriteria.",
        "Kalimat 2: arah dominan (naik/turun) + contoh gen.",
        "Kalimat 3: hasil QC PCA + arti.",
      ],
      code: {
        starter: `LIST_DE = []  # TULIS: 5 gen DE dari Lab 2, mis. ['G01', ...]\nnaik = ['G01','G06','G09']\nturun = ['G03','G10']\n\nkalimat = [\n    '',  # TULIS KODEMU: kalimat 1 (jumlah + kriteria)\n    '',  # TULIS KODEMU: kalimat 2 (arah dominan)\n    '',  # TULIS KODEMU: kalimat 3 (QC PCA)\n]\nprint('LAPORAN UNTUK PI:')\nfor i, k in enumerate(kalimat, 1):\n    print(f'{i}. {k}')\nprint()\nok = (len(LIST_DE) == 5 and len(kalimat) == 3\n      and all(len(k.split()) >= 8 for k in kalimat)\n      and '5' in kalimat[0] and 'PC1' in kalimat[2])\nprint('laporan valid!' if ok else 'laporan BELUM valid: cek 3 kalimat & isi')`,
        lockLines: 2,
        solution: `LIST_DE = ['G01','G03','G06','G09','G10']\nnaik = ['G01','G06','G09']\nturun = ['G03','G10']\n\nkalimat = [\n    'Dari 12 gen, 5 gen diferensial ekspresi (|log2FC|>1, q<0.05 BH).',\n    'Tiga gen naik (G01, G06, G09) dan dua gen turun (G03, G10) pada perlakuan.',\n    'QC PCA: PC1 memisahkan kontrol vs perlakuan, sinyal biologis dominan.',\n]\nprint('LAPORAN UNTUK PI:')\nfor i, k in enumerate(kalimat, 1):\n    print(f'{i}. {k}')\nprint()\nok = (len(LIST_DE) == 5 and len(kalimat) == 3\n      and all(len(k.split()) >= 8 for k in kalimat)\n      and '5' in kalimat[0] and 'PC1' in kalimat[2])\nprint('laporan valid!' if ok else 'laporan BELUM valid: cek 3 kalimat & isi')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "laporan valid!", label: "laporan valid", msg: "Butuh: 5 gen di LIST_DE, 3 kalimat ≥8 kata, '5' di kalimat 1, 'PC1' di kalimat 3." },
        ],
      },
      reference: "Komunikasi = bagian analisis. Angka + arah + QC.",
    },
    {
      id: "refleksi",
      eyebrow: "Langkah 6 · Refleksi",
      title: "Yang tidak ditangkap pipeline mini ini",
      prose: [
        "Pipeline mini ini menyederhanakan: RPM bukan size factor (yang lebih robust terhadap komposisi), uji-t bukan NB (DESeq2), PCA 1 komponen bukan QC penuh, n=3 per kelompok (kecil!). Di dunia nyata: replikasi lebih banyak, batch effect, validasi qPCR.",
        "Tapi polanya sama: normalisasi → uji + koreksi → QC → interpretasi → komunikasi. Kuasai pola ini, dan kamu bisa membaca (dan mengkritik) paper RNA-seq mana pun.",
        "Selamat — kamu menyelesaikan track Bioinformatika: dari dogma sentral hingga capstone DE. Berikutnya: terapkan pada data nyata ( recount3, GEO ) dengan pendampingan.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga penyederhanaan pipeline mini ini" },
        { id: "t2", text: "Tulis satu hal yang ingin kamu dalami berikutnya" },
      ],
      reference: "Pola > kode: normalisasi → uji → QC → interpretasi → komunikasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: bagaimana menjalankan mini-proyek DE yang jujur?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — Memilih normalisasi untuk laporan. → Sebutkan RPM vs size factor dan kenapa berbeda. Alasan: RPM cukup untuk latihan, size factor lebih robust terhadap komposisi; pembaca harus tahu yang dipakai. Contoh nyata: gen yang “DE” di RPM tapi tidak di DESeq2.",
        "Skenario 2 — Memilih uji statistik. → Uji-t untuk latihan; DESeq2 (negative binomial) untuk klaim nyata. Alasan: pipeline mini menyederhanakan — klaim publikasi butuh model yang benar. Contoh nyata: n=3 dengan uji-t vs NB memberi daftar berbeda.",
        "Skenario 3 — Sampel hanya 3 per kelompok. → Akui power terbatas; jangan overklaim satu gen. Alasan: n kecil = variansi tak terestimasi baik; daftar panjang = banyak false positive. Contoh nyata: validasi qPCR yang gagal untuk 9 dari 10 gen.",
        "Skenario 4 — Sebelum menafsirkan daftar gen. → QC dulu: PCA, cek batch, cek outlier. Alasan: satu sampel outlier bisa menciptakan ratusan “gen DE” palsu. Contoh nyata: “temuan” yang hilang setelah satu sampel dibuang.",
        "Skenario 5 — Mengomunikasikan hasil. → Volcano + daftar gen + batasan metode — bukan cuma angka “500 gen signifikan”. Alasan: angka tanpa konteks menyesatkan pengambil keputusan. Contoh nyata: laporan yang jujur menulis “n=3, uji-t, tanpa koreksi batch”.",
        "Aturan praktis 10 detik: pola yang sama — normalisasi → uji + koreksi → QC → interpretasi → komunikasi — berlaku untuk paper RNA-seq mana pun."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Melaporkan “500 gen DE signifikan” dari uji-t tanpa koreksi pada n=3 — sebagian besar false positive; setelah BH yang tersisa mungkin 5, dan itulah hasil yang jujur meski kurang mengesankan.",
      },
    },
    {
      id: "minicase-desain",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Rp24 juta untuk data yang tak bisa menjawab",
      prose: [
        "Sebuah lab RS membandingkan ekspresi tumor vs jaringan normal: 3 tumor, 3 normal. Biaya sekuensing Rp4 juta per sampel → total Rp24 juta. Hasil: 12 gen “DE” — tetapi sebelum merayakan, audit desain menemukan tiga cacat. Pertama, n = 3 per kelompok sangat underpowered: dengan dispersi tipikal RNA-seq, power 80% untuk mendeteksi |log2FC| = 1 butuh sekitar 8–12 sampel per kelompok. Dengan n = 3, hanya efek raksasa (|log2FC| > 2) yang lolos — efek sedang yang biologis penting (log2FC 1,2 = 2,3x lipat!) tenggelam dalam noise. Kedua, dan fatal: semua tumor diproses batch Senin, semua normal batch Jumat — efek batch terkorelasi SEMPURNA dengan kondisi. Tidak ada statistik yang bisa memisahkan “tumor vs normal” dari “Senin vs Jumat”; koreksi batch butuh variasi batch DALAM tiap kondisi. Ketiga: tidak ada replikat teknis untuk QC dan tidak ada rencana validasi qPCR — 12 gen “DE” itu mungkin 12 artefak Senin-vs-Jumat.",
        "Contoh angka power-nya: gen dengan log2FC 1,2 pada n = 3 → q ≈ 0,4 (tidak signifikan, terbuang); gen yang SAMA pada n = 10 → q ≈ 0,01 (signifikan). Biologi yang sama, kesimpulan berlawanan — hanya karena n. Aturan desain yang benar: (1) power analysis SEBELUM sekuensing (tool RNASeqPower: masukkan dispersi, efek minimum yang ingin dideteksi, power 80% → keluar n); (2) randomisasi atau blok: campur tumor dan normal di setiap batch, jangan pernah satu kondisi = satu batch; (3) replikat BIOLOGIS (pasien berbeda) jauh lebih berharga daripada replikat teknis — variasi antar-pasien adalah noise yang harus diukur, bukan disembunyikan; (4) sisakan budget validasi qPCR untuk 5–10 kandidat teratas.",
        "Hitungan biayanya: n = 10 per kelompok × Rp4 juta = Rp80 juta — terlihat 3x lebih mahal dari Rp24 juta. Tetapi Rp24 juta yang underpowered dan confounded = Rp24 juta terbuang total (datanya tidak bisa menjawab pertanyaan, tidak bisa dipublikasikan, tidak bisa diulang tanpa sekuensing ulang). Rp80 juta yang dirancang benar = jawaban yang bisa dipercaya. Eksperimen termahal bukanlah yang sampelnya banyak — melainkan yang harus diulang karena desainnya cacat. Pelajaran capstone: pipeline terbaik pun tidak bisa menyelamatkan desain yang buruk; kekuatan analisis ditentukan SEBELUM sampel pertama disekuensing, bukan sesudahnya.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa batch yang terkorelasi sempurna dengan kondisi tidak bisa dikoreksi secara statistik" },
        { id: "t2", text: "Rancang ulang eksperimen ini: n, pembagian batch, dan alokasi budget validasi" },
      ],
      quiz: [
        {
          q: "Semua tumor diproses Senin, semua normal diproses Jumat. Apa status eksperimen ini?",
          options: [
            { text: "Sah — batch effect bisa dikoreksi belakangan", why: "Koreksi batch butuh variasi batch dalam tiap kondisi; korelasi sempurna = tidak teridentifikasi." },
            { text: "Mati secara desain — efek kondisi tak terpisahkan dari efek batch", why: "Confounding sempurna tidak bisa diurai statistik apa pun; satu-satunya obat adalah desain ulang.", correct: true },
            { text: "Sah bila n diperbesar", why: "n besar tidak memisahkan dua variabel yang bergerak bersamaan sempurna." },
            { text: "Sah bila pakai DESeq2, bukan uji-t", why: "Tidak ada tool yang bisa memisahkan confounder sempurna — ini masalah desain, bukan tool." },
          ],
        },
      ],
      reference: "Power dulu, baru sekuensing · randomisasi batch · replikat biologis > teknis.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan penutup seluruh track. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Pipeline DE: normalisasi → uji + BH → QC → interpretasi → komunikasi.",
        "RPM samakan kedalaman; size factor lebih robust terhadap komposisi.",
        "DE = |log2FC|>1 & q<0.05; BH untuk banyak gen.",
        "PCA QC: kelompok terpisah = sinyal dominan.",
        "Laporan: angka + arah + QC, tanpa jargon berlebih.",
      ],
      next: { label: "Indeks Kurikulum", href: "/learn" },
      quiz: [
        {
          q: "Kenapa normalisasi sebelum DE?",
          options: [
            { text: "Agar terlihat rapi", why: "Bukan soal kerapian." },
            { text: "Kedalaman sekuensing beda → tanpa normalisasi, sampel dalam terlihat aktif semua", why: "Perbandingan apel-apel dulu, baru uji.", correct: true },
            { text: "Syarat software", why: "Ini alasan statistik, bukan software." },
            { text: "Tidak perlu", why: "Perlu — tanpanya semua hasil bias." },
          ],
        },
        {
          q: "Gen dengan p=0,001 dari 12.000 gen tanpa koreksi…",
          options: [
            { text: "Pasti temuan", why: "12.000 × 0,001 = ~12 false positive ekspektasi." },
            { text: "Belum tentu — butuh koreksi (BH); ekspektasi false ≈ 12", why: "Inilah gunanya FDR: mengendalikan ekspektasi temuan palsu saat ribuan gen diuji serentak.", correct: true },
            { text: "Pasti false", why: "Tidak pasti; tapi tidak bisa diklaim tanpa koreksi." },
            { text: "Abaikan", why: "Jangan abaikan; koreksi dulu." },
          ],
        },
        {
          q: "PCA menunjukkan K dan P tercampur acak. Artinya?",
          options: [
            { text: "Sukses", why: "Tercampur = tidak ada sinyal dominan." },
            { text: "Waspada: sinyal < noise/batch — audit QC sebelum percaya DE", why: "QC gagal = jangan lanjut ke interpretasi.", correct: true },
            { text: "Lanjut saja", why: "Lanjut tanpa QC = membangun di atas pasir." },
            { text: "Ulangi PCA", why: "PCA-nya benar; datanyalah yang bermasalah." },
          ],
        },
        {
          q: "Laporan PI yang baik berisi…",
          options: [
            { text: "Semua p-value", why: "PI butuh ringkasan, bukan dump." },
            { text: "Angka + arah + QC dalam bahasa non-teknis", why: "Komunikasi = bagian analisis.", correct: true },
            { text: "Kode mentah", why: "Kode di lampiran, bukan laporan." },
            { text: "Jargon maksimal", why: "Jargon mengaburkan, bukan mengesankan." },
          ],
        },
        {
          q: "Pola universal analisis omics?",
          options: [
            { text: "Langsung interpretasi", why: "Tanpa QC dan uji, interpretasi = spekulasi." },
            { text: "Normalisasi → uji + koreksi → QC → interpretasi → komunikasi", why: "Pola 18 lesson dalam satu kalimat.", correct: true },
            { text: "Plot dulu, pikir belakangan", why: "Plot tanpa normalisasi = menyesatkan." },
            { text: "Tanya AI saja", why: "AI membantu; validasi tetap tanggung jawabmu." },
          ],
        },
      ],
    },
  ],
};
