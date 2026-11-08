import type { V2Lesson } from "../lib/types";

// Distribusi return dengan ambang VaR 99% dan area ekor ES (ilustrasi).
const VAR_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Distribusi return harian dengan garis vertikal VaR 99 persen dan area ekor 1 persen yang dirata-ratakan menjadi ES.">
<polygon points="60,220 80,220 100,219.9 120,219.6 132,219.2 132,220" fill="var(--c2)" opacity="0.45"/>
<polyline points="60,220 80,220 100,219.9 120,219.6 140,218.8 160,216.8 180,212.2 200,203.1 220,187.2 240,162.9 260,131.2 280,96.2 300,65.5 320,47.4 330,45 340,47.4 360,65.5 380,96.2 400,131.2 420,162.9 440,187.2 460,203.1 480,212.2 500,216.8" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="132" y1="20" x2="132" y2="220" stroke="var(--text)" stroke-width="1.5" stroke-dasharray="5,4"/>
<text x="132" y="14" font-size="10" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">VaR 99%</text>
<line x1="160" y1="192" x2="110" y2="212" stroke="var(--chart-text)" stroke-width="1"/>
<text x="200" y="185" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ekor 1% terburuk</text>
<text x="200" y="198" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ES = rata-rata kedalamannya</text>
<text x="290" y="240" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">return harian (rugi → kiri)</text>
</svg>`;

export const pmb8: V2Lesson = {
  slug: "pm-b8-faktor-risiko",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B8 Faktor & Risiko: VaR, ES & Greeks",
  estMinutes: 55,
  steps: [
    {
      id: "faktor",
      eyebrow: "Langkah 1 · Model Faktor",
      title: "VaR yang \u2018aman\u2019 saat tsunami",
      prose: [
        "2008: bank-bank melaporkan VaR harian \u2018hanya\u2019 USD 100jt — \u201crisiko terkendali.\u201d Lalu Lehman jatuh: kerugian USD 600jt sehari — 6x VaR, berhari-hari berturut-turut. Twist-nya: VaR 99% memang berkata \u20181 hari dari 100, rugi bisa lebih dari ini\u2019 — bank lupa membaca kalimat keduanya: VaR tidak berkata berapa lebihnya. Ditambah VaR dihitung dari data tenang (2004\u20132006) untuk badai (2008).",
        "Model faktor: R_i = \u03b1 + \u03b21\u00d7F1 + \u03b22\u00d7F2 + \u2026 + \u03b5. Jenis: makroekonomi (GDP, inflasi, suku bunga), fundamental (Fama-French: MKT, SMB/size, HML/value; + momentum, quality), statistik (PCA — faktor tanpa nama).",
        "Active return = \u03a3 (exposure aktif \u00d7 return faktor) + alpha murni (stock selection). Tanpa lensa faktor, return 9,7% terlihat \u201calpha\u201d — dengan FF3 ternyata mostly beta.",
      ],
      formula: String.raw`R_i = \alpha + \beta_1 F_1 + \beta_2 F_2 + \cdots + \varepsilon`,
      formulaNote: "R_i = return saham; α = alpha (skill murni setelah faktor); β = exposure ke tiap faktor F (MKT/SMB/HML/momentum); ε = idiosinkratik. Contoh: 9,7% = 9,2% faktor + 0,5% alpha — mostly beta. Active return = Σ(exposure aktif × return faktor) + alpha.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Klaim alpha manajer \u2192 regresi multi-faktor dulu. Fee 2% untuk alpha 0,5% = mahal; 9,2% sisanya = beta yang bisa dibeli via ETF murah.",
      },
      reference: "Model faktor = DNA return. Alpha = residu setelah faktor.",
    },
    {
      id: "ff3",
      eyebrow: "Langkah 2 · Atribusi FF3",
      title: "Pisahkan beta dari skill",
      prose: [
        "Manajer return 9,7%. Dekomposisi Fama-French 3 faktor: 9,2% dijelaskan faktor (MKT/SMB/HML) + 0,5% alpha. Kesimpulan: mostly beta — beli via ETF murah; alpha kecil.",
        "Tanpa FF3, return 9,7% terlihat \u2018hebat\u2019. Dengan FF3: yang kamu bayar mahal (fee 2%) ternyata cuma 0,5% skill. Factor lens = kacamata jujur sebelum bayar fee.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `alpha` = return manajer \u2212 return faktor (%, desimal persen)" },
        { id: "t2", text: "Cetak 1 desimal" },
      ],
      expected: "alpha=0.5%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengagumi return mentah 9,7% tanpa dekomposisi. 9,2% = exposure (murah), 0,5% = skill. Bayar fee mahal hanya untuk alpha — bukan untuk beta.",
      },
      hints: [
        "Alpha = return manajer \u2212 return faktor.",
        "Satuan: persen (9,7 berarti 9,7%).",
        "alpha = ret_manajer - ret_faktor",
      ],
      code: {
        starter: `ret_manajer, ret_faktor = 9.7, 9.2\n\n# TULIS KODEMU\nalpha = \n\nprint(f"alpha={alpha:.1f}%")`,
        lockLines: 1,
        solution: `ret_manajer, ret_faktor = 9.7, 9.2\n\n# TULIS KODEMU\nalpha = ret_manajer - ret_faktor\n\nprint(f"alpha={alpha:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "alpha", value: 0.5, tol: 1e-9, label: "`alpha` seharusnya 0.5", msg: "9,7 \u2212 9,2 = 0,5%. Mostly beta — bukan skill." },
          { kind: "stdout_matches", task: "t2", pattern: "alpha=0\\.5%", label: "`print` menampilkan persen", msg: "Format persen: alpha=0.5%." },
        ],
      },
      reference: "FF3 sebelum kagum alpha. Alpha = return \u2212 exposure faktor.",
    },
    {
      id: "var",
      eyebrow: "Langkah 3 · VaR",
      title: "Speedometer risiko — bukan ramalan jurang",
      prose: [
        "VaR 99% harian RpX: \u201999% hari, rugi \u2264 RpX\u2019 — ekuivalen: \u20181% hari, rugi bisa > RpX\u2019. Metode: parametrik (\u03c3\u00d7z: cepat, asumsi normal), historis (persentil data lalu: tanpa asumsi distribusi, tetapi masa lalu \u2260 masa depan), Monte Carlo (simulasi ribuan skenario).",
        "Contoh parametrik: portofolio Rp10.000.000, \u03c3 harian = 2%. VaR 99% = 2,33 \u00d7 2% \u00d7 10.000.000 = 466.000. Artinya: 1 hari dari 100, rugi bisa lebih dari 466 ribu — tanpa batas. VaR bukan kerugian maksimum — itu miskonsepsi paling berbahaya.",
      ],
      formula: String.raw`VaR_{99\%} = z_{0.99} \times \sigma \times \text{nilai} \quad;\quad z_{0.99} = 2{,}33`,
      formulaNote: "VaR_99% = ambang kuantil: 99% hari rugi ≤ angka ini (1% hari bisa melebihi — tanpa batas); z=2,33 = kuantil normal 99%; σ = vol harian; nilai = ukuran posisi. Contoh: 2,33×0,02×10jt = Rp466rb — AMBANG, bukan maksimum. 2008: 6× VaR berhari-hari.",
      tasks: [
        { id: "t1", text: "Hitung `var99` parametrik: nilai=10jt, \u03c3=2%/hari, z=2,33" },
        { id: "t2", text: "Cetak angkanya (bulatkan)" },
      ],
      expected: "var99=466000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cVaR 99% Rp466rb \u2192 maksimum rugi Rp466rb.\u201d SALAH. VaR = ambang, bukan maksimum. 1% kasus melebihi — gunakan ES/stress untuk \u201cseberapa parah\u201d.",
      },
      hints: [
        "VaR = z \u00d7 sigma \u00d7 nilai.",
        "sigma dalam desimal: 0,02.",
        "var99 = z * sigma * nilai",
      ],
      code: {
        starter: `nilai, sigma = 10000000, 0.02\nz = 2.33\n\n# TULIS KODEMU\nvar99 = \n\nprint(f"var99={var99:.0f}")`,
        lockLines: 2,
        solution: `nilai, sigma = 10000000, 0.02\nz = 2.33\n\n# TULIS KODEMU\nvar99 = z * sigma * nilai\n\nprint(f"var99={var99:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var99", value: 466000, tol: 1, label: "`var99` seharusnya 466000", msg: "2,33 \u00d7 0,02 \u00d7 10.000.000 = 466.000." },
          { kind: "stdout_matches", task: "t2", pattern: "var99=466000", label: "`print` menampilkan var99", msg: "Format: var99=... ." },
        ],
      },
      quiz: [
        {
          q: "VaR 99% harian Rp466rb. Artinya?",
          options: [
            { text: "Rugi maks Rp466rb", why: "Salah: VaR = ambang kuantil, bukan maksimum. 2008: 6x VaR." },
            { text: "1% hari rugi bisa melebihi Rp466rb (tanpa batas)", why: "Benar: VaR = ambang, bukan maksimum. Untuk \u201cseberapa parah\u201d lihat ES.", correct: true },
            { text: "Rugi pasti Rp466rb", why: "Salah: VaR bukan prediksi rugi pasti." },
            { text: "Aman 100%", why: "Salah: 1% hari melebihi — tidak ada yang 100% aman." },
          ],
        },
      ],
      reference: "VaR = ambang kuantil (99%), bukan maksimum. 3 metode: parametrik/historis/MC.",
    },
    {
      id: "es",
      eyebrow: "Langkah 4 · Expected Shortfall + chart",
      title: "ES: rata-rata saat jatuh",
      prose: [
        "Expected Shortfall = rata-rata kerugian di 1% terburuk. Jika VaR = \u201cpagar\u201d, ES = \u201crata-rata kedalaman jurang\u201d. Keunggulan matematis: ES subadditive (diversifikasi selalu mengurangi) — VaR tidak (portofolio bisa \u201clebih berisiko\u201d dari jumlah bagian). Basel III beralih ke ES justru karena ini.",
        "Contoh: VaR(A) = 50, VaR(B) = 50, VaR(A+B) = 110 \u2192 VaR menghukum diversifikasi! Gunakan ES. Dan ES menjawab \u201cseberapa parah?\u201d — VaR hanya \u201cseberapa sering?\u201d.",
        "Aturan: VaR + ES + stress test. Stressed VaR = kalibrasi periode krisis (bukan data tenang). Kalibrasi tenang untuk badai = bunuh diri — pelajaran 2008.",
        "Cara membaca: sumbu X = return harian (rugi ke kiri); garis vertikal putus-putus = VaR 99%; area arsir = 1% hari terburuk.",
        "Interpretasi: VaR hanyalah pagar — ia tidak berkata apa-apa tentang seberapa dalam jurang di baliknya; ES = rata-rata kedalaman area arsir itu, dan justru itulah angka yang menentukan modal bertahan saat krisis.",
      ],
      figure: {
        svg: VAR_SVG,
        alt: "Distribusi return dengan ambang VaR 99 persen dan area ekor 1 persen untuk ES.",
        caption: "Distribusi return dengan ambang VaR 99% dan area ekor 1%: VaR = pagar, ES = rata-rata kedalaman jurang.",
      },
      formula: String.raw`ES_{99\%} = E[\text{loss} \mid \text{loss} > VaR_{99\%}]`,
      formulaNote: "ES = rata-rata kerugian di 1% hari terburuk — 'rata-rata kedalaman jurang'. Keunggulan matematis: subadditive (diversifikasi selalu mengurangi risiko) — VaR tidak. Contoh: VaR(A)=VaR(B)=50 tetapi VaR(A+B)=110 → VaR menghukum diversifikasi; pakai ES. Basel III beralih ke ES.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Bank: VaR 99% Rp100M, ES 99% Rp250M \u2192 ES 2,5x VaR = ekor tebal terdeteksi. Tindakan: tambah modal, kurangi konsentrasi, jalankan stress test. Angka ES adalah perintah, bukan hiasan.",
      },
      reference: "ES = rata-rata rugi saat VaR jebol. Subadditive. Standar Basel III.",
    },
    {
      id: "greeks",
      eyebrow: "Langkah 5 · Greeks",
      title: "Panel instrumen opsi",
      prose: [
        "Delta (arah): jual 100 call \u0394=0,5 \u2192 butuh +50 delta \u2192 beli 50 saham. Tetapi gamma \u2192 delta bergerak \u2192 rebalance dinamis. Theta: time value meleleh — waktu = musuh pembeli, teman penjual opsi. Vega: sensitivitas ke volatilitas.",
        "Hedging buku opsi = delta-neutral + monitor gamma/theta. Rebalance berkala — dengan biaya. Opsi dibiarkan mendekati expiry tanpa pergerakan \u2192 theta menggerogoti (penjual untung).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `saham` untuk delta-neutral: jual 100 call, delta 0,5" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "saham=50",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Hedge sekali lalu lupa. Gamma membuat delta bergerak — delta-neutral hari ini belum tentu netral minggu depan. Monitor dan rebalance.",
      },
      hints: [
        "Jual call = delta negatif: \u2212100 \u00d7 0,5 = \u221250.",
        "Butuh +50 delta dari saham (delta saham = 1).",
        "saham = kontrak * delta",
      ],
      code: {
        starter: `kontrak, delta = 100, 0.5\n\n# TULIS KODEMU: saham dibeli untuk netral (jual call = delta negatif)\nsaham = \n\nprint(f"saham={saham:.0f}")`,
        lockLines: 1,
        solution: `kontrak, delta = 100, 0.5\n\n# TULIS KODEMU: saham dibeli untuk netral (jual call = delta negatif)\nsaham = kontrak * delta\n\nprint(f"saham={saham:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "saham", value: 50, tol: 1e-9, label: "`saham` seharusnya 50", msg: "100 \u00d7 0,5 = 50. Tapi gamma \u2192 rebalance dinamis." },
          { kind: "stdout_matches", task: "t2", pattern: "saham=50", label: "`print` menampilkan saham", msg: "Format: saham=... ." },
        ],
      },
      reference: "Delta-neutral = imbangi delta. Gamma \u2192 rebalance. Theta = time decay.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: mengukur risiko yang benar",
      prose: [
        "Skenario 1 — Menilai manajer investasi. → Dekomposisi Fama-French 3 faktor: pisahkan beta dari alpha. Jangan bayar fee 2% untuk 0,5% skill — sisanya beli via ETF murah.",
        "Skenario 2 — Melaporkan risiko harian. → VaR 99% = '1 hari dari 100, rugi bisa LEBIH dari angka ini.' Bukan kerugian maksimum — itu miskonsepsi paling berbahaya.",
        "Skenario 3 — Butuh tahu 'seberapa parah saat jatuh'. → Expected Shortfall = rata-rata kerugian di 1% terburuk. ES subadditive (diversifikasi selalu mengurangi) — VaR tidak.",
        "Skenario 4 — Krisis datang. → VaR dari data tenang (2004–2006) tidak berlaku untuk badai. Pakai stressed VaR + stress test skenario + limit governance.",
        "Skenario 5 — Mengelola buku opsi. → Delta-neutral + monitor gamma/theta; rebalance berkala dengan biaya. Opsi dibiarkan mendekati expiry tanpa pergerakan = theta menggerogoti.",
        "Aturan praktis 10 detik: manajer → FF3; risiko harian → VaR (baca kalimat keduanya); ekor → ES; krisis → stressed VaR; buku opsi → Greeks.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Membaca VaR sebagai batas kerugian maksimum. VaR tidak berkata berapa lebihnya — dan bank-bank 2008 yang melaporkan VaR 'hanya' USD 100jt lalu rugi USD 600jt sehari membayar mahal untuk lupa ini.",
      },
    },
    {
      id: "minicase-var",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dashboard risiko yang benar",
      prose: [
        "Bank melaporkan VaR 99% USD 100jt (\u201crisiko terkendali\u201d). Krisis: rugi USD 600jt/hari berhari-hari (6x VaR). Investigasi: VaR dikalibrasi dari data 2004\u201306 (tenang), dibaca sebagai \u201cmaksimum\u201d, tidak ada ES/stress test.",
        "Tiga perbaikan: (1) ES + stress test; (2) stressed VaR (kalibrasi periode krisis); (3) limit + governance (bukan cuma angka). Jika ES 99% = USD 250jt: tambah modal (buffer untuk ekor), kurangi konsentrasi (posisi penyumbang ekor), stress test skenario 2008.",
        "Dashboard: (1) VaR harian + tren; (2) ES (kedalaman ekor); (3) Stressed VaR; (4) Konsentrasi (top-5 posisi %); (5) Likuiditas (hari untuk keluar); (6) Limit usage. Enam angka, satu layar — tren lebih penting dari level.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model risk: VaR = model — dan model bisa salah (asumsi normal, data basi, bug implementasi). Backtest VaR (berapa kali jebol vs ekspektasi 1%?), validasi independen, multiple measures. Pengukur yang tidak dikalibrasi = speedometer rusak.",
      },
      reference: "VaR + ES + stres. Kalibrasi krisis untuk badai. Tren > level.",
    },
    {
      id: "crowding-kematian-faktor",
      eyebrow: "Langkah 8 · Crowding & kematian faktor",
      title: "Faktor populer = faktor berbahaya",
      prose: [
        "Multi-factor: FF3 (MKT, SMB, HML) + momentum (UMD) + quality — atribusi lima faktor. Contoh: manajer 9,7% → MKT 6,0 + SMB 1,2 + HML 0,8 + UMD 1,0 + quality 0,2 = 9,2 → alpha 0,5%. Makin banyak faktor, makin kecil ruang “skill” — tetapi juga makin besar risiko salah atribusi bila faktor-faktornya sendiri berkorelasi (crowding antar-faktor saat semua quant pegang value + momentum yang sama).",
        "Factor crowding: faktor populer = trade ramai = unwind bergerombol. Quant meltdown Agustus 2007: faktor long/short populer rontok bersamaan. Momentum crash 2009: −83% dalam 3 bulan. Value drawdown 2018–2020: HML −30%. Deteksi crowding: valuasi spread faktor ekstrem, korelasi antar-manajer faktor naik, data positioning. Aturan: faktor yang semua orang pegang = faktor yang tidak memberi diversifikasi — ia memberi ilusi diversifikasi.",
        "Kapan faktor mati: (1) data mining — dari 100 faktor yang diuji, yang “signifikan” bisa noise murni (Harvey-Liu-Zhu: butuh t > 3,0, bukan 2,0); (2) arbitrage away — pasca-publikasi, return faktor turun ~50% (McLean-Pontiff); (3) perubahan struktur ekonomi. Kill rule: alokasi faktor hanya bila t > 3 + logika ekonomi + bukti out-of-sample; review tahunan — 5 tahun underperform vs ekspektasi → potong setengah. Faktor tanpa tanggal kedaluwarsa = keyakinan, bukan investasi.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: bayar fee hanya untuk alpha yang tersisa",
        body: "Empat disiplin allocator faktor. Pertama: bayar fee mahal hanya untuk alpha setelah SEMUA faktor — bukan setelah satu; manajer yang “mengalahkan pasar” dengan beta value + momentum menjual beta murah dengan harga alpha. Kedua: faktor yang dijelaskan semua orang di konferensi = faktor yang sudah ramai — popularitas adalah indikator kontrarian untuk crowding. Ketiga: diversifikasi antar-faktor gagal tepat saat dibutuhkan — 2007 dan 2009 membuktikan korelasi faktor → 1 di krisis; jangan andalkan diversifikasi faktor sebagai peredam krisis. Keempat: tulis kill rule SEBELUM alokasi — “5 tahun underperform → potong setengah” — karena emosi tidak boleh menulis aturan saat drawdown sedang berjalan. Faktor adalah alat, bukan agama; alat yang tidak dievaluasi menjadi jimat. Kelima: waspadai faktor yang “ditemukan” di satu negara lalu dijual global — sebagian besar faktor AS gagal replikasi di pasar berkembang (struktur dan likuiditas berbeda); uji di data Indonesia sebelum alokasi, bukan setelah. Keenam: catat biaya implementasi — turnover momentum 300%/tahun memakan 1–2% return di pasar dengan spread lebar.",
      },
      reference: "Atribusi 5 faktor. Crowding = unwind bergerombol. Kill rule sebelum alokasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: atribusi faktor, Greeks, theta, ekor tebal, dan tindakan ES.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Manajer return 9,7%: dekomposisi FF3 menunjukkan 9,2% faktor + 0,5% alpha. Kesimpulan?",
          options: [
            { text: "Hebat — bayar fee mahal", why: "Salah: yang \u201chebat\u201d cuma 0,5%; sisanya beta murahan." },
            { text: "Mostly beta — beli via ETF murah; alpha kecil", why: "Benar: 9,2% = exposure (murah), 0,5% = skill. Fee 2% untuk 0,5% = mahal.", correct: true },
            { text: "Alpha 9,7%", why: "Salah: alpha = residu setelah faktor = 0,5%." },
            { text: "Tidak bisa dinilai", why: "Salah: FF3 justru memberi alat menilainya." },
          ],
        },
        {
          q: "Jual 100 call \u0394=0,5. Hedge delta-neutral?",
          options: [
            { text: "Beli 100 saham", why: "Salah: itu 2x kebutuhan — cek 100 \u00d7 0,5." },
            { text: "Beli 50 saham", why: "Benar: butuh +50 delta (100\u00d70,5). Tetapi gamma \u2192 delta bergerak \u2192 rebalance dinamis.", correct: true },
            { text: "Jual 50 saham", why: "Salah: arah salah — jual call butuh beli saham." },
            { text: "Tidak perlu hedge", why: "Salah: posisi -50 delta terbuka = taruhan arah." },
          ],
        },
        {
          q: "Opsi dibiarkan mendekati expiry tanpa pergerakan. Yang terjadi?",
          options: [
            { text: "Tidak ada", why: "Salah: time value meleleh setiap hari." },
            { text: "Theta: time value meleleh (penjual untung)", why: "Benar: theta = time decay. Waktu = musuh pembeli, teman penjual opsi.", correct: true },
            { text: "Delta naik", why: "Salah: delta soal arah harga, bukan waktu." },
            { text: "Vega naik", why: "Salah: vega soal volatilitas, bukan waktu." },
          ],
        },
        {
          q: "Ekor tebal (krisis). Metode VaR terbaik?",
          options: [
            { text: "Parametrik normal", why: "Salah: normal meremehkan ekor." },
            { text: "Historis/MC yang menangkap ekor + stress test", why: "Benar: pasangkan dengan stress test. Jangan percaya normal.", correct: true },
            { text: "Abaikan", why: "Salah: mengabaikan risiko \u2260 mengelola risiko." },
            { text: "VaR tidak berguna", why: "Salah: VaR berguna sebagai pagar — asal didampingi ES dan stres." },
          ],
        },
        {
          q: "Bank: VaR 99% Rp100M, ES 99% Rp250M. Tindakan yang TEPAT?",
          options: [
            { text: "Aman — VaR kecil, tidak perlu tindakan", why: "Salah: ES 2,5x VaR = ekor tebal — VaR menyembunyikan risiko." },
            { text: "Tambah modal & kurangi konsentrasi — ES 2,5\u00d7 VaR = ekor tebal terdeteksi", why: "Benar: tambah buffer modal, kurangi posisi penyumbang ekor, jalankan stress test. Angka ES adalah perintah.", correct: true },
            { text: "Ganti VaR dengan volatilitas historis", why: "Salah: itu mundur — bukan solusi ekor tebal." },
            { text: "Naikkan limit trading karena VaR rendah", why: "Salah: justru berbahaya — VaR rendah menyembunyikan ekor." },
          ],
        },
      ],
      summary: [
        "Model faktor: makro, fundamental (FF3), statistik; alpha = residu.",
        "VaR: parametrik/historis/MC — ambang kuantil, bukan maksimum.",
        "ES: rata-rata rugi saat VaR jebol; koheren (subadditive); standar Basel III.",
        "Greeks: delta (arah), gamma (perubahan delta), theta (waktu), vega (vol).",
        "Aturan: VaR + ES + stress; FF3 sebelum kagum alpha; kalibrasi krisis untuk badai.",
      ],
      next: { label: "PM-B9 — Intercorporate", href: "/v2/learn/pm-b9-intercorporate" },
    },
  ],
};
