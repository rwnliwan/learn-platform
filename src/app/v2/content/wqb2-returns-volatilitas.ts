import type { V2Lesson } from "../lib/types";

const FIG_JALUR = `<svg viewBox="0 0 520 280" role="img" aria-label="Dua jalur harga lima hari yang berakhir di titik sama: satu mulus, satu bergejolak.">
<g font-family="var(--font-ui)">
<line x1="50" y1="20" x2="50" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="50" y1="240" x2="500" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="30" y="60" font-size="11" fill="var(--chart-text)">1.100</text>
<text x="30" y="240" font-size="11" fill="var(--chart-text)">1.000</text>
<polyline points="50,240 140,222 230,204 320,186 410,168 500,150" fill="none" stroke="var(--c1)" stroke-width="3"/>
<circle cx="500" cy="150" r="5" fill="var(--c1)"/>
<text x="410" y="130" font-size="12" fill="var(--c1)" font-weight="bold">XYZ: +2% tiap hari</text>
<polyline points="50,240 140,180 230,222 320,160 410,200 500,150" fill="none" stroke="var(--c4)" stroke-width="3" stroke-dasharray="7 4"/>
<circle cx="500" cy="150" r="5" fill="var(--c4)"/>
<text x="330" y="255" font-size="12" fill="var(--c4)" font-weight="bold">ABC: roller coaster</text>
<text x="50" y="270" font-size="11" fill="var(--chart-text)">Hari 0</text>
<text x="480" y="270" font-size="11" fill="var(--chart-text)">Hari 5</text>
<text x="60" y="40" font-size="11" fill="var(--chart-text)">Keduanya: 1.000 -&gt; 1.100 (+10%). Risikonya beda langit-bumi.</text>
</g>
</svg>`;

const FIG_VOL = `<svg viewBox="0 0 520 280" role="img" aria-label="Batang return harian dua saham: XYZ sempit di sekitar nol, ABC menyebar lebar.">
<g font-family="var(--font-ui)">
<text x="20" y="24" font-size="12" fill="var(--chart-text)" font-weight="bold">Return harian (%)</text>
<line x1="40" y1="140" x2="500" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="20" y="60" font-size="11" fill="var(--chart-text)">+4</text>
<text x="20" y="220" font-size="11" fill="var(--chart-text)">-4</text>
<rect x="80" y="120" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="116" y="120" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="152" y="120" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="188" y="120" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="224" y="120" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<text x="140" y="165" font-size="11" fill="var(--chart-text)">XYZ: vol 0% (contoh ideal)</text>
<rect x="320" y="60" width="26" height="80" fill="var(--c4)" opacity="0.9"/>
<rect x="356" y="180" width="26" height="60" fill="var(--c4)" opacity="0.9"/>
<rect x="392" y="80" width="26" height="60" fill="var(--c4)" opacity="0.9"/>
<rect x="428" y="170" width="26" height="50" fill="var(--c4)" opacity="0.9"/>
<rect x="464" y="100" width="26" height="40" fill="var(--c4)" opacity="0.9"/>
<text x="380" y="260" font-size="11" fill="var(--chart-text)">ABC: vol 2,7%/hari</text>
<text x="40" y="280" font-size="11" fill="var(--chart-text)">Volatilitas = seberapa lebar batang menyebar dari garis nol.</text>
</g>
</svg>`;

export const wqb2: V2Lesson = {
  slug: "wqb2-returns-volatilitas",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB2 — Returns & Volatilitas: Bahasa Dasar Pasar",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua saham +10% yang tidak sama",
      prose: [
        "Seorang analis junior menyodorkan dua kandidat ke manajernya: saham XYZ dan saham ABC. Keduanya naik dari Rp1.000 ke Rp1.100 dalam lima hari — return +10% yang identik. 'Pilih yang mana pun, Pak, hasilnya sama,' katanya. Manajer itu membuka data hariannya — dan menolak keduanya masuk daftar yang sama.",
        "XYZ bergerak: +2%, +2%, +2%, +2%, +2%. Mulus seperti jalan tol. ABC bergerak: +25%, −18%, +22%, −15%, +8%. Roller coaster. Di tengah minggu, ABC sempat anjlok 18% dalam sehari — cukup untuk memicu margin call dan menendang keluar siapa pun yang memakai leverage. Kedua saham finis di angka yang sama, tetapi perjalanan ABC bisa membunuhmu sebelum finis.",
        "Twist-nya: angka +10% keduanya BENAR. Yang salah adalah kesimpulan 'sama saja'. Return tanpa volatilitas = cerita tanpa konteks: ia memberitahu ke mana, tetapi menyembunyikan seberapa mengerikan perjalanannya. Seluruh metrik WQB — Sharpe, fitness, drawdown — dibangun di atas dua kata ini: return (ke mana) dan volatilitas (seberapa liar). Lesson ini membangun keduanya dari nol, dengan hitungan manual langkah demi langkah.",
        "Setelah lesson ini kamu bisa: (1) menghitung return harian dari deret harga dengan rumus yang benar; (2) menghitung volatilitas sebagai simpangan baku return (dengan pembagi n−1); (3) menjelaskan mengapa return identik bisa berarti risiko yang berbeda total; (4) mengannualisasi volatilitas harian ke tahunan dengan √252.",
      ],
      tasks: [],
      note: {
        title: "Fondasi seluruh busur",
        body: "Sharpe ratio = return dibagi volatilitas. Fitness memakai volatilitas lewat Sharpe. Drawdown adalah volatilitas yang realized dalam bentuk kerugian. Kuasai dua kata ini sampai di luar kepala — 9 lesson berikutnya mengasumsikannya.",
      },
      reference: "Return = ke mana. Volatilitas = seberapa liar perjalanannya.",
    },
    {
      id: "return",
      eyebrow: "Langkah 2 · Konsep",
      title: "Return: persentase, bukan rupiah",
      prose: [
        "Return harian mengukur perubahan harga sebagai PERSENTASE, bukan rupiah — karena Rp100 berarti beda untuk saham Rp1.000 vs Rp100.000. Rumusnya: r_t = (P_t − P_{t−1}) / P_{t−1}, dengan P_t harga hari ini dan P_{t−1} harga kemarin. Kalikan 100 untuk persen. Return positif = naik, negatif = turun, nol = diam.",
        "Contoh terperinci — harga penutupan 5 hari: Rp100, Rp102, Rp101, Rp105, Rp103. Hari 1: (102−100)/100 = 2/100 = +2,00%. Hari 2: (101−102)/102 = −1/102 = −0,98%. Hari 3: (105−101)/101 = 4/101 = +3,96%. Hari 4: (103−105)/105 = −2/105 = −1,90%. Deret return: [+2,00%, −0,98%, +3,96%, −1,90%]. Perhatikan: return selalu dihitung terhadap harga SEBELUMNYA, bukan harga awal — kesalahan klasik pemula adalah membagi semua selisih dengan harga hari pertama.",
        "Kepribadian konsep ini: return adalah speedometer pasar — ia memberitahu kecepatan dan arah, tetapi tidak memberitahu seberapa mulus jalannya. Untuk itu ada volatilitas.",
      ],
      formula: String.raw`r_t = \frac{P_t - P_{t-1}}{P_{t-1}} \times 100\%`,
      formulaNote: "r_t = return hari ke-t (persen). P_t = harga penutupan hari ke-t. P_{t−1} = harga penutupan hari sebelumnya. Contoh: P naik 100 → 102 berarti r = 2/100 × 100% = 2%.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Return 5 hari = (P_5 − P_0)/P_0, jadi return harian = itu dibagi 5.' Salah — itu rata-rata aritmetika yang mengabaikan compounding. Return multi-hari yang benar = (1+r_1)×(1+r_2)×...−1. Untuk 5 hari di contoh: 1,02×0,9902×1,0396×0,9810 − 1 = +3,00%, SAMA dengan (103−100)/100. Bukan kebetulan — itulah definisinya.",
      },
      hints: [
        "Selalu bagi dengan harga SEBELUMNYA (P_{t−1}), bukan harga pertama.",
        "Return dalam desimal (0,02) untuk perhitungan, persen (2%) untuk presentasi.",
      ],
      reference: "r_t = (P_t − P_{t−1})/P_{t−1}. Persentase terhadap kemarin, bukan terhadap awal.",
    },
    {
      id: "volatilitas",
      eyebrow: "Langkah 3 · Konsep",
      title: "Volatilitas: penggaris kegilaan",
      prose: [
        "Volatilitas = simpangan baku (standard deviation) dari deret return harian. Ia mengukur seberapa jauh return harian biasanya menyimpang dari rata-ratanya — 'penggaris kegilaan' pasar. Volatilitas 0% = setiap hari return-nya identik (jalan tol). Volatilitas 3% per hari = return harian biasanya melompat ±3% dari rata-rata (roller coaster).",
        "Contoh terperinci — pakai deret return tadi: [+2,00%, −0,98%, +3,96%, −1,90%]. Langkah 1, rata-rata: (2,00 − 0,98 + 3,96 − 1,90)/4 = 3,08/4 = 0,77%. Langkah 2, selisih dari rata-rata: 2,00−0,77 = 1,23; −0,98−0,77 = −1,75; 3,96−0,77 = 3,19; −1,90−0,77 = −2,67. Langkah 3, kuadratkan: 1,5129; 3,0625; 10,1761; 7,1289. Langkah 4, jumlahkan: 21,8804 — lalu BAGI DENGAN n−1 = 3 (bukan 4!): 7,2935. Langkah 5, akarkan: √7,2935 = 2,70% per hari. Inilah volatilitasnya.",
        "Dua detail yang sering ditanyakan. Pertama, mengapa dibagi n−1 bukan n? Karena kita mengestimasi dari sampel — pembagi n−1 (koreksi Bessel) membuat estimasi tidak bias; platform dan Python (statistics.stdev) memakai ini. Kedua, annualisasi: volatilitas harian × √252 = volatilitas tahunan. Contoh: 2,70% × 15,87 = 42,9% per tahun — SANGAT liar (saham normal 20–40%). Angka 252 = jumlah hari bursa dalam setahun.",
        "Cara membaca figur pertama: dua garis dari kiri bawah ke kanan atas, finis di titik yang sama (Rp1.100). Garis lurus = XYZ (+2% tiap hari). Garis zig-zag = ABC (roller coaster). Interpretasi: titik finis identik, tetapi garis zig-zag melewati lembah-lembah dalam — di dunia nyata, lembah = margin call, stop-loss tersentuh, atau jantung berdebar. Figur kedua: batang-batang return harian. XYZ = batang-batang mungil menempel di garis nol (volatilitas ≈ 0). ABC = batang-batang tinggi ke atas-bawah (volatilitas 2,7%/hari). Interpretasi: lebar sebaran batang = volatilitas.",
      ],
      formula: String.raw`\sigma = \sqrt{\frac{\sum_{i=1}^{n}(r_i - \bar{r})^2}{n-1}} \quad ; \quad \sigma_{\text{tahunan}} = \sigma_{\text{harian}} \times \sqrt{252}`,
      formulaNote: "σ (sigma) = volatilitas. r_i = return harian ke-i. r̄ = rata-rata return. n = jumlah return. Pembagi n−1 = koreksi Bessel (estimasi tak bias). 252 = hari bursa per tahun.",
      figure: {
        svg: FIG_JALUR,
        alt: "Dua jalur harga lima hari berakhir sama: XYZ lurus mulus, ABC zig-zag tajam.",
        caption: "Finis sama (+10%), perjalanan beda. Volatilitas mengukur 'kegilaan' perjalanannya.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Volatilitas tinggi = return tinggi.' Volatilitas mengukur SEBARAN, bukan ARAH. Saham bisa bergejolak ±5% tiap hari selama setahun dan finis di tempat (return 0%, vol 80%). Volatilitas tinggi dengan return nol = roller coaster yang kembali ke titik awal — seru, tidak menghasilkan.",
      },
      hints: [
        "💡 Jangan pernah mengambil simpangan baku dari HARGA mentah — selalu dari RETURN. Harga yang tren naik punya 'volatilitas' semu yang besar.",
        "💡 Hapalan cepat: vol harian 1% ≈ vol tahunan 16%; vol harian 2% ≈ 32%.",
      ],
      reference: "Volatilitas = simpangan baku return (pembagi n−1); tahunan = harian × √252.",
    },
    {
      id: "lab-vol",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung return & volatilitas dari harga",
      prose: [
        "Praktik langsung: dari 6 harga penutupan, hitung 5 return harian lalu volatilitasnya (simpangan baku sampel, pembagi n−1). Terakhir, annualisasi ke tahunan. Target: volatilitas harian ≈ 2,72% dan tahunan ≈ 43,2% — setara saham yang sangat liar.",
        "Eksperimen setelah selesai: ganti harga terakhir 107 → 100 (saham kembali ke awal). Return total menjadi 0% — tetapi volatilitas TETAP tinggi. Rasakan sendiri pelajaran pitfall di atas: sebaran tidak peduli arah.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rets`: list 5 return harian (desimal)" },
        { id: "t2", text: "Hitung `vol_harian` (stdev sampel) dan `vol_tahunan`" },
      ],
      expected: "Return harian: [2.00%, -0.98%, 3.96%, -1.90%, 3.88%]\nVolatilitas harian: 2.72%\nVolatilitas tahunan: 43.23%",
      note: {
        title: "Jebakan implementasi",
        type: "pitfall",
        body: "'Pakai statistics.pstdev saja, bedanya kecil.' Untuk 5 data, pstdev (pembagi n) vs stdev (pembagi n−1) beda ~12% — cukup untuk menggeser Sharpe melewati ambang 1,25 secara semu. Konsisten pakai pembagi n−1 seperti platform.",
      },
      hints: [
        "rets[i] = (harga[i+1]-harga[i])/harga[i].",
        "Varians sampel = sum((r-mean)^2)/(n-1); vol = sqrt(varians).",
        "vol_tahunan = vol_harian * sqrt(252).",
      ],
      code: {
        starter: "import math  # (JANGAN UBAH)\nharga = [100, 102, 101, 105, 103, 107]  # JANGAN UBAH\n\n# TULIS KODEMU\nrets = []\nfor i in range(len(harga) - 1):\n    rets.append()\nmean = sum(rets) / len(rets)\nvar = sum((r - mean) ** 2 for r in rets) / \nvol_harian = math.sqrt(var)\nvol_tahunan = \nprint(\"Return harian:\", [f\"{r:.2%}\" for r in rets])\nprint(f\"Volatilitas harian: {vol_harian:.2%}\")\nprint(f\"Volatilitas tahunan: {vol_tahunan:.2%}\")\n",
        lockLines: 2,
        solution: "import math  # (JANGAN UBAH)\nharga = [100, 102, 101, 105, 103, 107]  # JANGAN UBAH\n\n# TULIS KODEMU\nrets = []\nfor i in range(len(harga) - 1):\n    rets.append((harga[i + 1] - harga[i]) / harga[i])\nmean = sum(rets) / len(rets)\nvar = sum((r - mean) ** 2 for r in rets) / (len(rets) - 1)\nvol_harian = math.sqrt(var)\nvol_tahunan = vol_harian * math.sqrt(252)\nprint(\"Return harian:\", [f\"{r:.2%}\" for r in rets])\nprint(f\"Volatilitas harian: {vol_harian:.2%}\")\nprint(f\"Volatilitas tahunan: {vol_tahunan:.2%}\")\n",
        checks: [
          { kind: "equal", task: "t2", label: "`vol_harian` ≈ 0,0272", msg: "Simpangan baku sampel dari 5 return.", name: "vol_harian", value: 0.0272349, tol: 0.0001 },
          { kind: "equal", task: "t2", label: "`vol_tahunan` ≈ 0,4323", msg: "Harian × √252.", name: "vol_tahunan", value: 0.4323, tol: 0.001 },
          { kind: "stdout_matches", task: "t2", label: "Cetak volatilitas tahunan", msg: "Format persen 2 desimal.", pattern: "Volatilitas tahunan: 43\\.23%" }
        ],
      },
      reference: "Hitung return dulu, baru statistiknya — dan selalu dari return, bukan harga.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan volatilitas mengubah keputusan",
      prose: [
        "Satu: dua strategi return 15%, vol 8% vs 25% → pilih vol 8% (Sharpe 1,88 vs 0,60). Dua: vol tahunan di atas 50% → curigai leverage tersembunyi atau universe tidak likuid; cek sebelum kagum. Tiga: membandingkan Sharpe dua alpha → pastikan volatilitasnya dihitung dari periode dan frekuensi yang sama (harian vs harian). Empat: vol mendadak 2x lipat dari biasanya → rezim pasar berubah; jangan tuning parameter di tengah badai.",
        "Aturan praktis 10 detik: return tanpa volatilitas = cerita tanpa konteks. Setiap kali melihat return, tanyakan vol-nya sebelum bereaksi.",
      ],
      tasks: [],
      note: {
        title: "💡 Kebiasaan reviewer",
        body: "Reviewer alpha profesional membaca kolom volatilitas DULU, return KEDUA. Return bisa dibesar-besarkan dengan leverage; volatilitas membongkarnya. Jadikan ini refleks: return → 'vol-nya berapa?'",
      },
      reference: "Vol dulu, return kemudian. Vol 2x lipat = rezim berubah.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Alpha A vs Alpha B: 18% lawan 22%",
      prose: [
        "Data: Alpha A — return 18% per tahun, volatilitas 8% per tahun. Alpha B — return 22% per tahun, volatilitas 25% per tahun. Risk-free 0%. Seorang manajer dana tergoda B ('return lebih tinggi 4 poin!').",
        "Pertanyaan: mana yang dipilih tim riset? Pembahasan: hitung Sharpe kasar = return/vol. A: 18/8 = 2,25. B: 22/25 = 0,88. A menang telak — setiap unit risiko di A dibayar 2,25 unit return, di B hanya 0,88. Lebih dalam: volatilitas B 25% berarti dalam setahun, fluktuasi ±25% adalah hal biasa — drawdown 20%+ hampir pasti terjadi dan bisa memicu penarikan dana investor sebelum alpha sempat bekerja. Keputusan: pilih A. Pelajaran: 4 poin return tambahan tidak sebanding dengan 17 poin volatilitas tambahan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Di dunia nyata, volatilitas tinggi = risiko penarikan dana (redemption risk). Alpha B bisa 'benar secara teori' tetapi mati secara bisnis karena investor kabur di drawdown pertama. Volatilitas bukan sekadar statistik — ia menentukan apakah strategi bisa bertahan hidup.",
      },
      reference: "Sharpe A 2,25 vs B 0,88: pilih A. Volatilitas menentukan kelangsungan hidup strategi.",
    },
    {
      id: "lab-sampel",
      eyebrow: "Langkah 7 · Lab",
      title: "Ilusi Sharpe dari sampel kecil",
      prose: [
        "Return 5 hari yang sama seperti Lab 1 menghasilkan Sharpe tahunan 8,12 — angka yang akan membuat manajer mana pun ternganga. Sekarang hitung Sharpe tahunan dari 60 hari data yang sama strateginya. Tugasmu: tulis fungsi sharpe_ann, hitung keduanya, dan putuskan verdict-nya.",
        "Eksperimen setelah selesai: potong r60 menjadi 10 hari pertama saja — berapa Sharpe-nya? Rasakan bagaimana angka 'ajaib' muncul dan hilang hanya karena panjang jendela.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `sharpe_ann(rets)` = mean/stdev × √252" },
        { id: "t2", text: "Jalankan dan baca verdict" },
      ],
      expected: "Sharpe 5 hari (tahunan): 8.12\nSharpe 60 hari (tahunan): 0.27\nVerdict: SAMPEL KECIL MENIPU",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Sharpe 8 dari seminggu data = strategi hebat.” Lima hari data = lima lemparan koin. Annualisasi mengalikan ilusi dengan √252. Aturan praktis: jangan percaya Sharpe dari < 1 tahun data — dan platform menguji 10 tahun bukan tanpa alasan.",
      },
      hints: [
        "statistics.mean dan statistics.stdev sudah diimpor.",
        "Annualisasi: kalikan Sharpe harian dengan 252**0.5.",
      ],
      code: {
        starter: "import statistics\n# Return 5 hari vs 60 hari (strategi sama). JANGAN UBAH.\nr5 = [0.02, -0.0098, 0.0396, -0.019, 0.0388]\nr60 = [-0.0025, 0.0067, -0.0021, -0.0032, -0.0106, -0.002, 0.0139, 0.0057,\n       0.013, 0.0036, 0.0053, 0.0028, -0.0194, 0.0109, 0.0067, 0.0066,\n       -0.0197, -0.0203, -0.0101, -0.005, 0.0043, 0.0, 0.0069, -0.0071,\n       0.0043, 0.0053, -0.0073, 0.0212, 0.0073, 0.015, -0.0068, -0.0083,\n       -0.0035, -0.0007, 0.0082, 0.0036, -0.0048, -0.0109, -0.0056, 0.0153,\n       -0.0091, 0.0035, 0.0057, -0.0173, 0.0012, 0.0163, -0.0236, -0.0033,\n       -0.0007, -0.0092, 0.0066, -0.0001, -0.017, 0.0105, 0.0086, 0.012,\n       0.0179, 0.0049, 0.002, -0.015]\n\n# TULIS KODEMU\ndef sharpe_ann(rets):\n    return  # statistics.mean/stdev * sqrt(252)\n\ns5 = sharpe_ann(r5)\ns60 = sharpe_ann(r60)\nprint(f\"Sharpe 5 hari (tahunan): {s5:.2f}\")\nprint(f\"Sharpe 60 hari (tahunan): {s60:.2f}\")\nprint(\"Verdict: SAMPEL KECIL MENIPU\" if s5 > 3 * s60 else \"Verdict: stabil\")\n",
        lockLines: 13,
        solution: "import statistics\n# Return 5 hari vs 60 hari (strategi sama). JANGAN UBAH.\nr5 = [0.02, -0.0098, 0.0396, -0.019, 0.0388]\nr60 = [-0.0025, 0.0067, -0.0021, -0.0032, -0.0106, -0.002, 0.0139, 0.0057,\n       0.013, 0.0036, 0.0053, 0.0028, -0.0194, 0.0109, 0.0067, 0.0066,\n       -0.0197, -0.0203, -0.0101, -0.005, 0.0043, 0.0, 0.0069, -0.0071,\n       0.0043, 0.0053, -0.0073, 0.0212, 0.0073, 0.015, -0.0068, -0.0083,\n       -0.0035, -0.0007, 0.0082, 0.0036, -0.0048, -0.0109, -0.0056, 0.0153,\n       -0.0091, 0.0035, 0.0057, -0.0173, 0.0012, 0.0163, -0.0236, -0.0033,\n       -0.0007, -0.0092, 0.0066, -0.0001, -0.017, 0.0105, 0.0086, 0.012,\n       0.0179, 0.0049, 0.002, -0.015]\n\n# TULIS KODEMU\ndef sharpe_ann(rets):\n    return statistics.mean(rets) / statistics.stdev(rets) * (252 ** 0.5)\n\ns5 = sharpe_ann(r5)\ns60 = sharpe_ann(r60)\nprint(f\"Sharpe 5 hari (tahunan): {s5:.2f}\")\nprint(f\"Sharpe 60 hari (tahunan): {s60:.2f}\")\nprint(\"Verdict: SAMPEL KECIL MENIPU\" if s5 > 3 * s60 else \"Verdict: stabil\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `sharpe_ann` ada", msg: "Definisikan def sharpe_ann(rets).", name: "sharpe_ann" },
          { kind: "stdout_matches", task: "t2", label: "Sharpe 5 hari = 8,12", msg: "Ilusi sampel kecil.", pattern: "Sharpe 5 hari \\(tahunan\\): 8\\.12" },
          { kind: "stdout_matches", task: "t2", label: "Sharpe 60 hari = 0,27", msg: "Angka yang jujur.", pattern: "Sharpe 60 hari \\(tahunan\\): 0\\.27" },
          { kind: "stdout_matches", task: "t2", label: "Verdict tercetak", msg: "8,12 > 3 × 0,27.", pattern: "Verdict: SAMPEL KECIL MENIPU" }
        ],
      },
      reference: "Lima hari = lima lemparan koin. Annualisasi mengalikan ilusi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang dua kata fondasi ini. Pastikan hitungan manualnya melekat.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: return tanpa volatilitas seperti kecepatan tanpa rem",
        body: "Dua saham sama-sama naik 10% bisa menjadi cerita yang sama sekali berbeda: yang satu naik mulus 1% per bulan, yang satu naik-turun 15% untuk sampai ke tempat yang sama. Return menjawab seberapa jauh; volatilitas menjawab seberapa liar perjalanannya — dan yang kedua menentukan apakah kamu sanggup bertahan sampai tujuan. Praktisi tidak pernah membandingkan return mentah: 18% dengan volatilitas 10% jauh lebih baik daripada 22% dengan volatilitas 30%, karena yang dibandingkan adalah return per unit risiko. Aturan keputusannya: annualisasi dengan benar — volatilitas harian dikali √252, bukan dikali 252 — dan untuk multi-periode pakailah log-return yang bisa dijumlah, karena simple return tidak bisa. Jebakan yang paling sering memakan korban: ilusi Sharpe dari sampel kecil. Sharpe 2,0 dari 3 bulan data bukanlah kehebatan; itu noise yang belum sempat menunjukkan wajah aslinya — standard error Sharpe menyusut dengan akar jumlah observasi. Setiap kali sebuah angka return membuatmu bersemangat, tanyakan pasangannya: dengan volatilitas berapa? Tanpa pasangannya, return hanyalah setengah kalimat.",
      },
      summary: [
        "Return harian: r_t = (P_t − P_{t−1})/P_{t−1} — persentase terhadap harga sebelumnya.",
        "Volatilitas = simpangan baku return dengan pembagi n−1 (bukan n).",
        "Return identik bisa berarti risiko berbeda total — volatilitas yang membedakannya.",
        "Annualisasi: volatilitas tahunan = harian × √252.",
        "Jangan pernah hitung volatilitas dari harga mentah — selalu dari return.",
      ],
      quiz: [
        {
          q: "Harga: 100 → 102 → 101. Return hari ke-2?",
          options: [
            { text: "−0,98%  ((101−102)/102)", why: "Benar — dibagi harga SEBELUMNYA (102), bukan harga awal (100).", correct: true },
            { text: "−1,00%  ((101−102)/100)", why: "Salah pembagi: harus P_{t−1} = 102, bukan P_0 = 100." },
            { text: "+1,00%  ((101−100)/100)", why: "Itu return 2 hari dari awal, bukan return harian ke-2." }
          ],
        },
        {
          q: "Mengapa volatilitas memakai pembagi n−1, bukan n?",
          options: [
            { text: "Koreksi Bessel: estimasi dari sampel agar tidak bias", why: "Tepat — dan platform memakai konvensi ini.", correct: true },
            { text: "Agar angkanya selalu lebih kecil", why: "Terbalik — pembagi lebih kecil (n−1) membuat hasil LEBIH besar." },
            { text: "Tidak ada alasan, sekadar kebiasaan", why: "Ada alasan statistik: pembagi n meremehkan varians populasi sebenarnya." }
          ],
        },
        {
          q: "Volatilitas harian 2%. Volatilitas tahunan ≈ ?",
          options: [
            { text: "≈ 31,7%  (2% × √252)", why: "Benar: 2% × 15,87 = 31,75%.", correct: true },
            { text: "≈ 504%  (2% × 252)", why: "Volatilitas tumbuh dengan AKAR waktu, bukan linear — itu return yang diakumulasi linear." },
            { text: "≈ 6,9%  (2% × √12)", why: "√12 untuk data BULANAN; untuk harian pakai √252." }
          ],
        },
        {
          q: "Saham X dan Y sama-sama +10% dalam 5 hari. X: +2% tiap hari. Y: +25%,−18%,+22%,−15%,+8%. Mana benar?",
          options: [
            { text: "Risiko Y jauh lebih besar — return sama, volatilitas beda", why: "Tepat — inti lesson ini.", correct: true },
            { text: "Keduanya identik, pilih yang mana pun", why: "Jebakan cerita pembuka: finis sama, perjalanan (dan risiko margin call) beda jauh." },
            { text: "Y lebih baik karena pernah naik 25% sehari", why: "Satu hari +25% tidak menebus −18% dan −15%; volatilitas Y justru berbahaya." }
          ],
        },
        {
          q: "Seorang analis menghitung 'volatilitas' sebagai simpangan baku HARGA (bukan return) saham yang tren naik. Masalahnya?",
          options: [
            { text: "Tren naik menciptakan sebaran semu — angkanya melebih-lebihkan risiko", why: "Benar — harga 100→200 punya stdev harga besar walau return-nya mulus +2% tiap hari.", correct: true },
            { text: "Tidak masalah, hasilnya sama saja", why: "Berbeda jauh: stdev harga mencampur tren + noise; stdev return hanya noise." },
            { text: "Hasilnya selalu nol", why: "Tidak nol — justru membengkak karena tren." }
          ],
        }
      ],
      reference: "Return = (P_t−P_{t−1})/P_{t−1}; volatilitas = stdev return (n−1), tahunan ×√252.",
    },
  ],
};
