import type { V2Lesson } from "../lib/types";

const FIG_MAPPING = `<svg viewBox="0 0 480 300" role="img" aria-label="Pemetaan instrumen ke faktor risiko.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Mapping: instrumen → faktor risiko</text>
<rect x="20" y="60" width="140" height="40" rx="6" fill="var(--c1)" opacity="0.3"/>
<text x="90" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">Obligasi 3 tahun</text>
<rect x="20" y="120" width="140" height="40" rx="6" fill="var(--c1)" opacity="0.3"/>
<text x="90" y="145" font-size="11" fill="var(--chart-text)" text-anchor="middle">Saham bank</text>
<rect x="20" y="180" width="140" height="40" rx="6" fill="var(--c1)" opacity="0.3"/>
<text x="90" y="205" font-size="11" fill="var(--chart-text)" text-anchor="middle">Swap USD/IDR</text>
<rect x="320" y="60" width="140" height="40" rx="6" fill="var(--c3)" opacity="0.3"/>
<text x="390" y="85" font-size="11" fill="var(--chart-text)" text-anchor="middle">Suku bunga 1y, 3y</text>
<rect x="320" y="120" width="140" height="40" rx="6" fill="var(--c3)" opacity="0.3"/>
<text x="390" y="145" font-size="11" fill="var(--chart-text)" text-anchor="middle">Indeks keuangan</text>
<rect x="320" y="180" width="140" height="40" rx="6" fill="var(--c3)" opacity="0.3"/>
<text x="390" y="205" font-size="11" fill="var(--chart-text)" text-anchor="middle">USD/IDR, suku bunga</text>
<line x1="160" y1="80" x2="320" y2="80" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="160" y1="140" x2="320" y2="140" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="160" y1="200" x2="320" y2="200" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="240" y="250" font-size="10" fill="var(--chart-text)" text-anchor="middle">Ribuan instrumen → puluhan faktor. Di sinilah VaR dihitung.</text>
</g>
</svg>`;

export const mr24: V2Lesson = {
  slug: "mr24-risk-factor-mapping",
  track: "Market Risk",
  module: "Pengukuran Risiko",
  title: "MR24 — Risk Factor Mapping: Menerjemahkan Portofolio ke Bahasa VaR",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Spreadsheet warisan",
      prose: [
        "Analis baru mewarisi spreadsheet VaR dari pendahulunya. Isinya: 2.000 posisi obligasi, saham, dan derivatif — semuanya dipetakan ke SATU faktor: IHSG. VaR yang keluar: Rp15 miliar. Direksi bertanya: 'Kenapa VaR kita tidak bergerak saat suku bunga naik 100bps bulan lalu?' Jawabnya: karena spreadsheet itu buta suku bunga.",
        "Twist-nya: VaR hanya sebagus pemetaannya. Garbage mapping in, garbage VaR out. Memetakan 2.000 instrumen ke faktor risiko yang tepat — suku bunga per tenor, spread kredit, FX, ekuitas, volatilitas — adalah pekerjaan paling fundamental (dan paling diremehkan) dalam pengukuran risiko pasar. Setelah lesson ini kamu bisa: (1) mengidentifikasi faktor risiko untuk tiap kelas aset; (2) melakukan cash-flow mapping obligasi; (3) menghitung VaR parametrik dari faktor yang dipetakan; (4) menilai kapan mapping terlalu kasar.",
        "Konteks karir: mapping adalah salah satu pertanyaan wawancara paling umum untuk posisi market risk junior \u2014 \u2018jelaskan bagaimana kamu memetakan obligasi ke faktor risiko\u2019. Kandidat yang menjawab \u2018pakai durasi\u2019 terdengar seperti textbook; kandidat yang menjelaskan cash-flow mapping ke titik tenor standar terdengar seperti praktisi. Lesson ini membuatmu menjadi yang kedua.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hull (Risk Management and Financial Institutions) mendedikasikan pembahasan khusus untuk mapping — karena model VaR tercanggih pun runtuh bila pemetaannya salah. FRM menguji ini karena ini adalah keterampilan kerja nyata, bukan teori.",
      },
      reference: "VaR = f(mapping). Mapping salah = VaR salah.",
    },
    {
      id: "faktor",
      eyebrow: "Langkah 2 · Konsep",
      title: "Kamus faktor risiko",
      prose: [
        "Faktor risiko adalah 'bahasa' tempat VaR dihitung — variabel pasar yang pergerakannya menjelaskan perubahan nilai portofolio. Kamus standar: suku bunga (per tenor kunci: 1y, 3y, 5y, 10y), spread kredit (per rating/sektor), nilai tukar (per pasangan mata uang), ekuitas (indeks atau faktor gaya), komoditas (per kontrak acuan), volatilitas implisit (per tenor opsi). Portofolio 2.000 instrumen biasanya cukup dijelaskan 30-100 faktor.",
        "Prinsip pemilihan: faktor harus RELEVAN (bergerak bersama posisimu), TERAMATI (ada data historisnya), dan JUMLAHNYA TERKELOLA (terlalu banyak = noise + komputasi mahal; terlalu sedikit = buta seperti spreadsheet warisan). Seni mapping = menemukan titik manis di antaranya.",
        "Contoh kamus untuk bank Indonesia: suku bunga IDR (1y, 5y, 10y dari kurva IndoGB), USD rates (untuk posisi valuta), USD/IDR, spread kredit per sektor (properti, komoditas, keuangan), indeks LQ45 atau sektoral, harga minyak sawit (bila ada eksposur komoditas). Tujuh hingga lima belas faktor sering cukup untuk bank menengah \u2014 jangan terpancing memakai 100 faktor hanya karena datanya tersedia.",
        "Tiga miskonsepsi. Satu: 'Satu indeks cukup untuk semua saham.' Saham bank dan saham tambang bergerak berbeda — butuh faktor sektor atau faktor gaya (value/growth). Dua: 'Obligasi = satu faktor suku bunga.' Obligasi 1 tahun dan 30 tahun bereaksi sangat berbeda terhadap pergerakan kurva — butuh multi-tenor. Tiga: 'Faktor = ramalan.' Faktor bukan prediksi arah; ia adalah dimensi tempat risiko diukur.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kita pakai 500 faktor — makin detail makin akurat.” Setiap faktor butuh estimasi volatilitas dan korelasi; 500 faktor = 125.000 korelasi yang diestimasi dari data berisik. Presisi palsu: angka terlihat canggih, isinya noise. Mulai dari sedikit, tambah bila backtest membuktikan perlu.",
      },
      hints: [
        "Untuk tiap posisi besar, tanya: 'Faktor apa yang menggerakkan 80% nilainya?'",
        "Dokumentasikan pilihan faktor + alasannya — auditor akan bertanya.",
      ],
      reference: "Faktor: relevan, teramati, terkelola. 30-100 cukup.",
    },
    {
      id: "cashflow",
      eyebrow: "Langkah 3 · Konsep",
      title: "Cash-flow mapping: obligasi menjadi titik-titik",
      prose: [
        "Obligasi membayar kupon tiap tahun + pokok di akhir — puluhan arus kas. Cash-flow mapping menyederhanakan: tiap arus kas 'dipindahkan' ke titik tenor standar terdekat (1y, 3y, 5y, 10y), dijumlahkan per titik. Obligasi 3 tahun dengan kupon Rp80 M menjadi: Rp160 M di titik 1y + Rp1.080 M di titik 3y. Kini portofolio obligasi = sekumpulan 'zero-coupon sintetis' di titik standar — dan VaR tinggal menghitung volatilitas tiap titik + korelasinya.",
        "Aturan pemindahan: arus kas tahun t → titik standar terdekat; bila seri (sama jauh), pilih yang LEBIH PENDEK (konservatif untuk risiko suku bunga? — diskusikan dengan validatormu). Nilai total harus SAMA sebelum dan sesudah mapping — ini uji kewarasannya.",
        "Contoh verifikasi konkret: obligasi Rp1.240 miliar (80+80+1080) menjadi Rp160 miliar di 1y + Rp1.080 miliar di 3y = Rp1.240 miliar. Sama. Bila hasilmu Rp1.160 miliar, satu arus kas hilang \u2014 lacak sebelum lanjut. Disiplin verifikasi sepele ini membedakan analis yang bisa dipercaya dari yang tidak.",
        "Dua miskonsepsi. Satu: 'Mapping = aproksimasi kasar, tidak penting.' Untuk obligasi plain vanilla, mapping ini sangat akurat — errornya kecil dibanding error estimasi volatilitas. Dua: 'Bisa pakai durasi saja.' Durasi meringkas ke satu angka (buta bentuk kurva); mapping multi-titik menangkap twist kurva. Untuk portofolio besar, bedanya material.",
      ],
      figure: {
        svg: FIG_MAPPING,
        alt: "Pemetaan instrumen ke faktor risiko.",
        caption: "Ribuan instrumen → puluhan faktor. Di sinilah VaR dihitung.",
      },
      formula: String.raw`\text{VaR}_{99\%, 1h} = z_{0.99} \times \sigma \times \text{nilai}`,
      formulaNote: "z_0.99 = 2,33 (kuantil normal 99%); sigma = volatilitas harian; nilai = nilai posisi. Untuk 10 hari: kali akar(10) = 3,16. Untuk banyak faktor: VaR_portofolio = akar(w'\u03a3w) dengan w = vektor nilai×vol dan \u03a3 = matriks korelasi. Interpretasi: VaR tumbuh dengan keyakinan (z), gejolak (sigma), dan waktu (akar-t) \u2014 tiga tuas yang bisa ditelaah satu per satu.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Arus kas dipetakan ke tenor ASLI-nya (2,4 tahun → titik 2,4y).” Titik harus STANDAR dan SAMA untuk semua posisi — kalau tiap obligasi punya titik sendiri, tidak ada agregasi dan tidak ada VaR portofolio. Standarisasi adalah inti mapping.",
      },
      hints: [
        "Uji kewarasan: total nilai sebelum = sesudah mapping. Selalu.",
        "Untuk opsi (nonlinear), mapping linear tidak cukup — butuh delta-gamma.",
      ],
      reference: "Arus kas → titik standar terdekat. Total nilai tetap.",
    },
    {
      id: "var",
      eyebrow: "Langkah 4 · Konsep",
      title: "Dari faktor ke VaR: rumus parametrik",
      prose: [
        "Setelah mapping, VaR parametrik menjadi aritmetika: tiap titik punya nilai (dari mapping) dan volatilitas harian (dari data); VaR satu faktor = nilai × vol × z × √t. Untuk banyak faktor: VaR portofolio = √(w'Σw) — akar dari jumlah kuadrat terbobot korelasi. Korelasi < 1 memberi manfaat diversifikasi; korelasi mendekati 1 saat krisis menghapusnya.",
        "Contoh manfaat diversifikasi: dua posisi masing-masing VaR Rp100 miliar dengan korelasi 0,3 \u2014 VaR portofolio = akar(100\u00b2 + 100\u00b2 + 2\u00d70,3\u00d7100\u00d7100) = Rp161 miliar, bukan Rp200 miliar. Penghematan Rp39 miliar adalah \u2018diskon diversifikasi\u2019. Tetapi ingat: saat krisis korelasi melonjak ke 0,8-0,9 dan diskon ini menguap \u2014 VaR yang tidak stress-test korelasi adalah VaR yang menipu.",
        "Kepribadian VaR parametrik: ia adalah 'kalkulator cepat dengan asumsi berani' — asumsi distribusi normal dan korelasi stabil. Cepat (hitungan detik untuk ribuan posisi), transparan (setiap angka bisa dilacak), tetapi rapuh saat asumsi jebol (ekor gemuk, korelasi melonjak). Kenali kapan menggunakannya dan kapan beralih ke historis/Monte Carlo.",
        "Dua miskonsepsi. Satu: 'z = 2,33 selalu.' 2,33 = kuantil 99% distribusi NORMAL. Bila return tidak normal (ekor gemuk), kuantil empiris bisa 3-4. Dua: '√t scaling selalu valid.' Scaling akar-waktu mengasumsikan return independen antar hari — untuk 1-10 hari masih wajar; untuk 1 tahun, meragukan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Backtest adalah hakimnya: bandingkan VaR harian dengan kerugian aktual setahun. Terlalu banyak pelanggaran (>4 dari 250 hari untuk VaR 99%) = model atau mapping-mu bermasalah. Basel menghukum pelanggaran berlebih dengan multiplier modal — VaR yang salah = modal yang mahal.",
      },
      hints: [
        "Hafalkan: VaR 99% 1-hari = 2,33 × vol × nilai; 10-hari = × √10.",
        "Selalu laporkan asumsi bersama angka VaR — angka tanpa asumsi = menyesatkan.",
      ],
      reference: "VaR = z·σ·√t·nilai. Backtest = hakimnya.",
    },
    {
      id: "lab-mapping",
      eyebrow: "Langkah 5 · Lab",
      title: "Cash-flow mapping obligasi",
      prose: [
        "Obligasi 3 tahun: kupon Rp80 miliar tiap tahun + pokok Rp1.000 miliar di tahun ke-3. Petakan tiap arus kas ke titik standar terdekat dari [1, 3, 10] — bila seri, pilih titik yang lebih pendek. Agregasi per titik dan cetak.",
        "Uji kewarasan: total sebelum mapping = 80+80+1080 = 1240; total sesudah harus sama. Jika berbeda, ada arus kas yang hilang — mapping yang kehilangan uang adalah mapping yang salah.",
      ],
      tasks: [
        { id: "t1", text: "Petakan tiap arus kas ke titik standar terdekat (seri -> lebih pendek)" },
        { id: "t2", text: "Agregasi per titik, cetak, dan verifikasi total = 1240" },
      ],
      expected: "Tenor 1y: 160\nTenor 3y: 1080\nTotal: 1240 (cek: OK)",
      note: {
        title: "💡 Intuisi",
        body: "Tiga arus kas menjadi dua angka — dan dua angka ini yang masuk ke mesin VaR. Sihirnya bukan di kerumitan, melainkan di standarisasi: semua obligasi bank kini 'berbicara' dalam titik 1y/3y/10y yang sama.",
      },
      hints: [
        "terdekat = min(titik, key=lambda x: (abs(x-t), x)).",
        "Agregasi dengan dict; total = sum(arus kas).",
      ],
      code: {
        starter: "# (tahun, arus kas Rp miliar). JANGAN UBAH.\narus = [(1, 80), (2, 80), (3, 1080)]\ntitik = [1, 3, 10]\n\n# TULIS KODEMU: mapping + agregasi + verifikasi total\npemetaan = {}\nfor t, cf in arus:\n    terdekat = \n    pemetaan[terdekat] = pemetaan.get(terdekat, 0) + cf\nfor k in sorted(pemetaan):\n    print(f\"Tenor {k}y: {pemetaan[k]}\")\ntotal = \nprint(f\"Total: {total} (cek: {'OK' if total == 1240 else 'SALAH'})\")\n",
        lockLines: 8,
        solution: "# (tahun, arus kas Rp miliar). JANGAN UBAH.\narus = [(1, 80), (2, 80), (3, 1080)]\ntitik = [1, 3, 10]\n\n# TULIS KODEMU: mapping + agregasi + verifikasi total\npemetaan = {}\nfor t, cf in arus:\n    terdekat = min(titik, key=lambda x: (abs(x - t), x))\n    pemetaan[terdekat] = pemetaan.get(terdekat, 0) + cf\nfor k in sorted(pemetaan):\n    print(f\"Tenor {k}y: {pemetaan[k]}\")\ntotal = sum(cf for _, cf in arus)\nprint(f\"Total: {total} (cek: {'OK' if total == 1240 else 'SALAH'})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Tenor 1y = 160", msg: "80+80 (tahun 1 dan 2).", pattern: "Tenor 1y: 160" },
          { kind: "stdout_matches", task: "t1", label: "Tenor 3y = 1080", msg: "80+1000.", pattern: "Tenor 3y: 1080" },
          { kind: "stdout_matches", task: "t2", label: "Total 1240 OK", msg: "Uji kewarasan lolos.", pattern: "Total: 1240 .cek: OK." },
        ],
      },
      reference: "Titik terdekat (seri → pendek). Total harus sama.",
    },
    {
      id: "lab-var",
      eyebrow: "Langkah 6 · Lab",
      title: "VaR parametrik 99% 10-hari",
      prose: [
        "Portofolio Rp1.000 miliar, volatilitas harian 2%, kuantil normal 99% z=2,33, horizon 10 hari (standar regulasi). Hitung VaR = nilai × vol × z × √t. Bandingkan dengan VaR 1-hari — rasionya harus √10 ≈ 3,16.",
        "Perhatikan besarnya: Rp147 miliar untuk portofolio Rp1 triliun — 14,7%. Inilah 'harga' volatilitas 2% harian selama 10 hari pada keyakinan 99%. Eksperimen: ubah vol menjadi 3% — VaR naik proporsional. Linearitas ini adalah kekuatan sekaligus kelemahan VaR parametrik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung VaR 99% 1-hari dan 10-hari" },
        { id: "t2", text: "Cetak keduanya + rasio (harus ~3.16)" },
      ],
      expected: "VaR 1-hari: Rp46.6 miliar\nVaR 10-hari: Rp147.4 miliar\nRasio: 3.16",
      note: {
        title: "💡 Intuisi",
        body: "Tiga perkalian sederhana = angka yang menentukan berapa modal yang harus disiapkan bank. Kesederhanaan ini menipu: di baliknya ada asumsi normalitas dan independensi yang harus selalu dipertanyakan.",
      },
      hints: [
        "var = nilai * vol * z * sqrt(t).",
        "Gunakan math.sqrt; format 1 desimal.",
      ],
      code: {
        starter: "import math\n\n# JANGAN UBAH.\nnilai, vol, z = 1000, 0.02, 2.33\n\n# TULIS KODEMU: VaR 1-hari & 10-hari\nvar1 = \nvar10 = \nprint(f\"VaR 1-hari: Rp{var1:.1f} miliar\")\nprint(f\"VaR 10-hari: Rp{var10:.1f} miliar\")\nprint(f\"Rasio: {var10/var1:.2f}\")\n",
        lockLines: 8,
        solution: "import math\n\n# JANGAN UBAH.\nnilai, vol, z = 1000, 0.02, 2.33\n\n# TULIS KODEMU: VaR 1-hari & 10-hari\nvar1 = nilai * vol * z\nvar10 = nilai * vol * z * math.sqrt(10)\nprint(f\"VaR 1-hari: Rp{var1:.1f} miliar\")\nprint(f\"VaR 10-hari: Rp{var10:.1f} miliar\")\nprint(f\"Rasio: {var10/var1:.2f}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "VaR 1-hari 46.6", msg: "1000×0.02×2.33.", pattern: "VaR 1-hari: Rp46.6 miliar" },
          { kind: "stdout_matches", task: "t1", label: "VaR 10-hari 147.4", msg: "×√10.", pattern: "VaR 10-hari: Rp147.4 miliar" },
          { kind: "stdout_matches", task: "t2", label: "Rasio 3.16", msg: "√10.", pattern: "Rasio: 3.16" },
        ],
      },
      reference: "VaR = nilai·vol·z·√t. Rasio 10-hari/1-hari = √10.",
    },
    {
      id: "lab-var-port",
      eyebrow: "Langkah 7 · Lab",
      title: "VaR portofolio: diskon diversifikasi dan stres korelasi",
      prose: [
        "Dua posisi masing-masing VaR Rp100 miliar, korelasi 0,3. Hitung VaR portofolio = akar(va² + vb² + 2·rho·va·vb), diskon diversifikasi = jumlah VaR individual − VaR portofolio, lalu VaR stres saat korelasi melonjak ke 0,9.",
        "Perhatikan: diskon Rp38,8 miliar menguap menjadi Rp5,1 miliar saat krisis (200 − 194,9). Inilah mengapa regulator meminta stressed VaR — VaR normal menjual diskon yang tidak ada saat dibutuhkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung VaR portofolio & diskon diversifikasi (rho=0.3)" },
        { id: "t2", text: "Hitung VaR stres (rho=0.9), cetak ketiganya" },
      ],
      expected: "VaR portofolio: Rp161.2 miliar\nDiskon diversifikasi: Rp38.8 miliar\nVaR stres (rho=0.9): Rp194.9 miliar",
      note: {
        title: "💡 Intuisi",
        body: "Korelasi adalah 'lem' portofolio: saat normal ia merekatkan dengan longgar (diskon besar), saat krisis ia mengeras (diskon hilang). Stressed VaR = VaR dengan lem yang sudah mengeras.",
      },
      hints: [
        "var_port = math.sqrt(va**2 + vb**2 + 2*rho*va*vb).",
        "Format 1 desimal; rho stres = 0.9.",
      ],
      code: {
        starter: "import math\n\n# JANGAN UBAH.\nvar_a, var_b, rho = 100, 100, 0.3\n\n# TULIS KODEMU: VaR portofolio, diskon, VaR stres\nvar_port = \ndiv = var_a + var_b - var_port\nprint(f\"VaR portofolio: Rp{var_port:.1f} miliar\")\nprint(f\"Diskon diversifikasi: Rp{div:.1f} miliar\")\nrho_s = 0.9\nvar_s = \nprint(f\"VaR stres (rho=0.9): Rp{var_s:.1f} miliar\")\n",
        lockLines: 9,
        solution: "import math\n\n# JANGAN UBAH.\nvar_a, var_b, rho = 100, 100, 0.3\n\n# TULIS KODEMU: VaR portofolio, diskon, VaR stres\nvar_port = math.sqrt(var_a**2 + var_b**2 + 2*rho*var_a*var_b)\ndiv = var_a + var_b - var_port\nprint(f\"VaR portofolio: Rp{var_port:.1f} miliar\")\nprint(f\"Diskon diversifikasi: Rp{div:.1f} miliar\")\nrho_s = 0.9\nvar_s = math.sqrt(var_a**2 + var_b**2 + 2*rho_s*var_a*var_b)\nprint(f\"VaR stres (rho=0.9): Rp{var_s:.1f} miliar\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "VaR portofolio 161.2", msg: "akar(26000).", pattern: "VaR portofolio: Rp161.2 miliar" },
          { kind: "stdout_matches", task: "t1", label: "Diskon 38.8", msg: "200-161.2.", pattern: "Diskon diversifikasi: Rp38.8 miliar" },
          { kind: "stdout_matches", task: "t2", label: "VaR stres 194.9", msg: "akar(38000).", pattern: "VaR stres.*Rp194.9 miliar" },
        ],
      },
      reference: "VaR_port = akar jumlah kuadrat + korelasi. Stres rho = diskon hilang.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Memetakan portofolio baru",
      prose: [
        "Satu: inventarisasi — daftar semua posisi dan kelas asetnya. Dua: tetapkan kamus faktor — mulai dari yang standar (tenor kunci, indeks, FX) dan tambah hanya bila backtest menuntut. Tiga: pilih metode per instrumen — linear (saham, obligasi, futures) vs delta-gamma (opsi) vs full revaluation (exotic). Empat: verifikasi — total nilai mapping = nilai portofolio; backtest VaR vs aktual. Lima: dokumentasikan — kamus faktor, aturan mapping, asumsi; tinjau tiap tahun.",
        "Aturan praktis 10 detik: standar-kan titik, pisahkan linear vs nonlinear, verifikasi total, backtest selalu. Mapping yang baik itu membosankan — ia bekerja diam-diam setiap hari.",
        "Satu jebakan: 'mapping selesai sekali.' Portofolio berubah (posisi baru, produk baru) — mapping harus ikut berubah. Tetapkan review tiap ada produk baru masuk. Produk exotic tanpa aturan mapping = lubang hitam di VaR-mu.",
        "Enam: tetapkan pemilik mapping. Di bank yang rapi, tim market risk memiliki kamus faktor dan aturan mapping; front office tidak boleh memakai faktor sendiri. Satu kamus, satu kebenaran. Bila dua tim memakai kamus berbeda, VaR mereka tidak bisa dibandingkan \u2014 dan direksi menerima dua angka yang sama-sama \u2018benar\u2019 tetapi berbeda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Untuk opsi, mapping linear (delta saja) meremehkan risiko saat pasar bergerak besar — butuh penyesuaian gamma atau full revaluation. Aturan praktis: bila portofolio opsi >10% nilai, jangan pakai delta-only VaR. Ini salah satu penyebab kerugian 'tak terduga' yang sebenarnya terduga.",
      },
      reference: "Inventarisasi → kamus → metode → verifikasi → dokumentasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Perbaiki spreadsheet warisan",
      prose: [
        "Kembali ke cerita pembuka. Kamu diminta memperbaiki spreadsheet VaR warisan (semua → IHSG). Portofolio: obligasi pemerintah 5 tahun Rp600 miliar, obligasi korporasi 10 tahun Rp400 miliar, saham perbankan Rp500 miliar, saham tambang Rp300 miliar, swap suku bunga Rp200 miliar (notional).",
        "Pertanyaan: (a) Kamus faktor minimal apa? (b) Bagaimana mapping tiap posisi? Pembahasan: (a) Suku bunga: 1y, 5y, 10y (tiga titik menangkap level & slope); spread kredit korporasi; indeks keuangan; indeks tambang/komoditas. Total ~7 faktor — jauh dari 1, jauh dari 500. (b) Obligasi pemerintah → arus kas ke 1y/5y/10y; obligasi korporasi → sama + spread kredit; saham bank → indeks keuangan (beta); saham tambang → indeks tambang; swap → arus kas tetap vs mengambang ke titik tenor. Hasil: VaR kini BERGERAK saat suku bunga naik — direksi mendapat jawaban yang benar. Pelajaran: 7 faktor yang tepat > 1 faktor yang salah > 500 faktor yang berisik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan swap: ia punya DUA kaki (tetap dan mengambang) yang dipetakan ke titik berbeda — neto-nya kecil tetapi eksposur kotornya besar. Mapping yang hanya melihat neto meremehkan risiko basis. Selalu petakan kedua kaki.",
      },
      reference: "7 faktor tepat > 1 salah > 500 berisik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor \u2265 4 dari 5.",
      ],
      summary: [
        "VaR hanya sebagus pemetaannya — garbage mapping in, garbage VaR out; faktor risiko adalah 'bahasa' tempat VaR dihitung.",
        "Kriteria pemilihan faktor: RELEVAN (bergerak bersama posisimu), TERAMATI (ada data historisnya), dan JUMLAHNYA terkendali — 500 faktor membuat estimasi korelasi meledak.",
        "Satu indeks tidak cukup untuk semua saham: saham bank dan saham tambang bergerak berbeda; cash-flow mapping memetakan tiap arus kas obligasi ke tenor standar.",
        "Kamus untuk bank Indonesia: kurva IndoGB (1y, 5y, 10y), USD rates, USD/IDR; dokumentasikan pilihan faktor + alasannya — auditor akan bertanya.",
      ],
      quiz: [
        {
          q: "Mengapa spreadsheet warisan (semua → IHSG) menghasilkan VaR yang menyesatkan?",
          options: [
            { text: "Pemetaan mengabaikan faktor suku bunga — VaR buta terhadap pergerakan kurva", why: "Benar: satu faktor ekuitas buta terhadap pergerakan kurva.", correct: true },
            { text: "IHSG bukan indeks yang valid untuk VaR", why: "IHSG valid untuk saham; masalahnya ia dipakai untuk SEMUA." },
            { text: "Spreadsheet tidak bisa menghitung VaR", why: "Bisa; masalahnya pemetaan, bukan alat hitungnya." },
            { text: "VaR selalu membutuhkan 500 faktor", why: "500 = noise; 7 yang tepat lebih baik." },
          ],
        },
        {
          q: "Arus kas tahun ke-2 dipetakan ke titik [1, 3, 10]. Hasil yang benar:",
          options: [
            { text: "Titik 1y — jarak 1 vs 1 (seri) vs 8, seri → pilih lebih pendek", why: "Benar: terdekat; seri → pilih lebih pendek.", correct: true },
            { text: "Titik 3y — karena lebih dekat ke jatuh tempo", why: "Jarak ke 3y = 1, ke 1y = 1; seri → aturan pilih 1y." },
            { text: "Dibagi rata ke 1y dan 3y", why: "Tidak dibagi; satu arus kas → satu titik." },
            { text: "Tetap di titik 2y", why: "Titik harus STANDAR agar bisa diagregasi." },
          ],
        },
        {
          q: "Uji kewarasan wajib setelah cash-flow mapping:",
          options: [
            { text: "Total nilai sesudah mapping = sebelum mapping", why: "Benar: mapping memindahkan, bukan menghilangkan nilai.", correct: true },
            { text: "Jumlah titik selalu 3", why: "Jumlah titik fleksibel; yang wajib = total sama." },
            { text: "VaR turun setelah mapping", why: "Mapping tidak mengubah nilai; VaR dihitung dari faktor." },
            { text: "Semua arus kas di titik 10y", why: "Itu bukan mapping; itu kesalahan." },
          ],
        },
        {
          q: "Kapan VaR parametrik (normal) menjadi berbahaya?",
          options: [
            { text: "Return berekor gemuk / korelasi melonjak saat krisis — asumsi jebol", why: "Benar: asumsi normalitas dan korelasi stabil jebol saat krisis.", correct: true },
            { text: "Portofolio terlalu kecil", why: "Ukuran bukan masalah asumsi distribusi." },
            { text: "Horizon 1 hari", why: "1 hari justru horizon paling valid untuk parametrik." },
            { text: "Volatilitas terlalu rendah", why: "Vol rendah = VaR kecil; bukan sumber bahaya metodologi." },
          ],
        },
        {
          q: "Portofolio opsi besar (>10% nilai) sebaiknya TIDAK memakai:",
          options: [
            { text: "VaR delta-only (linear) — meremehkan risiko nonlinier", why: "Benar: opsi nonlinear; butuh gamma atau revaluasi penuh.", correct: true },
            { text: "Full revaluation Monte Carlo", why: "Itu SOLUSI yang tepat, bukan yang harus dihindari." },
            { text: "VaR historis", why: "Itu alternatif valid, bukan yang dilarang." },
            { text: "Delta-gamma approximation", why: "Itu perbaikan yang tepat, bukan yang dilarang." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Backtest bagus = mapping benar.” Backtest yang bagus bisa juga berarti periode tenang (tidak ada guncangan untuk menguji). Uji mapping dengan periode stres historis — bukan hanya setahun terakhir yang kebetulan damai.",
      },
      hints: [
        "Uji cepat: jelaskan ke teman kenapa obligasi butuh multi-tenor, bukan satu faktor.",
        "Ingat angka lab: VaR 10-hari = 3,16 × VaR 1-hari — dari mana 3,16 berasal?",
      ],
      reference: "Mapping = fondasi. Backtest di periode stres = hakimnya.",
    },
  ],
};
