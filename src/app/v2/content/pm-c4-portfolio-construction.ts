import type { V2Lesson } from "../lib/types";

// Error maximization: optimisasi klasik 95/5 vs resampling 55/45.
const MICHAUD_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Batang bobot saham A dan B: optimisasi klasik 95 banding 5, resampling 55 banding 45.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">100%</text><text x="54" y="74">75%</text><text x="54" y="124">50%</text><text x="54" y="174">25%</text><text x="54" y="224">0%</text></g>
<rect x="110" y="30" width="60" height="190" fill="var(--c1)"/>
<rect x="180" y="210" width="60" height="10" fill="var(--c2)"/>
<rect x="340" y="110" width="60" height="110" fill="var(--c1)"/>
<rect x="410" y="130" width="60" height="90" fill="var(--c2)"/>
<g font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="140" y="22">A: 95%</text><text x="370" y="102">A: 55%</text></g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="210" y="202">B: 5%</text><text x="440" y="122">B: 45%</text></g>
<g font-size="10.5" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="160" y="240">Optimisasi klasik</text><text x="390" y="240">Michaud resampling</text></g>
<text x="275" y="115" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">selisih E(R) hanya 0,1%</text>
<text x="275" y="129" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">95/5 = presisi palsu</text>
</svg>`;

export const pmc4: V2Lesson = {
  slug: "pm-c4-portfolio-construction",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C4 — Portfolio Construction",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-yayasan",
      eyebrow: "Langkah 1 · Cerita",
      title: "Portofolio yang berjalan sendiri",
      prose: [
        "Sebuah yayasan menetapkan SAA 60/40 pada 2020. Tidak pernah rebalance. Tahun 2024: setelah bull run saham, portofolio menjadi 78/22. Lalu koreksi \u221215% datang \u2014 kerugiannya Rp2,7 miliar lebih besar dibanding jika portofolio tetap 60/40.",
        "Twist-nya: tidak ada yang \u2018salah beli\u2019. Portofolio berjalan sendiri (drift) keluar dari IPS. Drift adalah keputusan pasif untuk mengambil risiko lebih besar \u2014 tanpa persetujuan, tanpa kompensasi return yang sepadan.",
        "Rebalancing bukan \u2018trading\u2019 \u2014 melainkan kembali ke janji. Lesson ini tentang disiplin konstruksi: optimisasi yang rendah hati, risk budgeting, dan rebalancing yang terjadwal.",
      ],
      note: {
        title: "Intuisi: konstruksi portofolio adalah rekayasa toleransi kesalahan",
        body: "Tiga heuristik dari praktisi konstruksi. Pertama, tanyakan bukan “apakah inputku benar?” melainkan “seberapa salah inputku boleh sebelum portofolio ini hancur?” — portofolio yang hanya bekerja bila CME tepat sampai desimal kedua bukanlah portofolio, melainkan taruhan berkedok matematika. Kedua, kompleksitas adalah musuh implementasi: strategi 12 faktor dengan turnover 300% yang tidak pernah dijalankan kalah dari 60/40 dengan rebalancing disiplin yang dijalankan 20 tahun. Ketiga, catat setiap penyimpangan dari model beserta alasannya — dalam 3 tahun, log itu menjadi peta biasmu sendiri: apakah kamu selalu menambah ekuitas saat bullish (overconfidence?) atau selalu memangkas risiko setelah berita buruk (recency?). Model yang bagus membuatmu jujur; log membuatmu sadar. Keempat, uji portofolio dengan tes tidur malam: jika ada satu posisi yang membuatmu mengecek harga di tengah malam, ukurannya terlalu besar \u2014 berapa pun kata optimizer. Kelima, catat juga keputusan yang TIDAK diambil (misalnya menolak menambah ekuitas di puncak euforia) \u2014 dalam lima tahun, daftar penolakan yang benar sama berharganya dengan daftar pembelian.",
      },
      tasks: [],
      reference: "Drift = keputusan pasif. Rebalancing = kembali ke janji IPS.",
    },
    {
      id: "optimisasi",
      eyebrow: "Langkah 2 · Optimisasi",
      title: "Optimisasi: error maximizer yang butuh penjinak",
      prose: [
        "Optimisasi mean-variance adalah mesin pengubah asumsi menjadi alokasi \u2014 tetapi ia memperbesar kesalahan estimasi. Contoh: saham A E(R) 10,1%, B 10,0% (estimasi ±2%!). Optimisasi unconstrained memberi 95% ke A demi mengejar selisih 0,1% \u2014 padahal 0,1% itu noise. Fenomena ini disebut error maximization: optimizer memberi bobot terbesar ke aset yang return-nya paling overestimate.",
        "Penjinaknya tiga: constraints praktis (long-only, bobot maks mis. 10\u201330%, turnover, tracking error), shrinkage (tarik estimasi ekstrem ke rata-rata), dan Black-Litterman \u2014 mencampur equilibrium pasar (prior) dengan view analis proporsional keyakinan. Contoh BL: pasar bilang 6%, kamu yakin 8% dengan keyakinan 70% \u2192 input optimisasi \u2248 6% + 0,7\u00D72% = 7,4%, bukan 8% penuh. BL adalah kerendahan hati yang diformalkan.",
        "Aturan praktis: jangan percaya bobot dua desimal \u2014 bulatkan ke 5%. Optimisasi tanpa kerendahan hati adalah presisi palsu; data DeMiguel dkk. menunjukkan 14 model optimisasi tidak ada yang konsisten mengalahkan naive 1/N secara out-of-sample.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201COptimisasi memberi bobot \u2018optimal\u2019 \u2014 ikuti persis.\u201D Hasil \u2018optimal\u2019 dari input mentah justru terkonsentrasi di kesalahan estimasi. Optimisasi adalah alat berpikir, bukan mesin jawaban: pakai constraints, shrinkage, dan common sense.",
      },
      reference: "Constraints praktis: long-only · bobot maks · turnover · tracking error · sektor · ESG.",
    },
    {
      id: "lab-risk-contribution",
      eyebrow: "Langkah 3 · Lab risk contribution",
      title: "Yang kamu alokasikan \u2260 yang kamu dapatkan",
      prose: [
        "Kontribusi risiko aset i: RC_i = w_i \u00D7 (turunan σ_p terhadap w_i); jumlah semua RC = σ_p. Hitung untuk 60/40: saham σ 18%, obligasi σ 6%, korelasi 0,2. Bandingkan kontribusi risiko saham dengan bobot nominalnya 60%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rc_s` dan `rc_b` (kontribusi absolut)" },
        { id: "t2", text: "Hitung `share_s` (porsi risiko dari saham)" },
        { id: "t3", text: "Cetak hasilnya dengan `print`" },
      ],
      expected: "RC saham: 92% (bobot 60%)  RC obligasi: 8% (bobot 40%)",
      hints: [
        "mrc_s = (W_S·σs² + w_b·ρ·σs·σb) / σp; rc_s = W_S × mrc_s.",
        "share_s = rc_s / sig_p.",
        "Jumlah rc_s + rc_b harus = sig_p (cek konsistensi).",
      ],
      code: {
        starter: `import math\nW_S = 0.6  # bobot saham\nSIG_S, SIG_B, RHO = 0.18, 0.06, 0.2\nw_b = 1 - W_S\n\nvar_p = W_S**2*SIG_S**2 + w_b**2*SIG_B**2 + 2*W_S*w_b*RHO*SIG_S*SIG_B\nsig_p = math.sqrt(var_p)\n\n# TULIS KODEMU\nmrc_s = \nmrc_b = \nrc_s = W_S * mrc_s\nrc_b = w_b * mrc_b\nshare_s = \n\nprint(f"RC saham   : {share_s:.0%} (bobot {W_S:.0%})")\nprint(f"RC obligasi: {1-share_s:.0%} (bobot {w_b:.0%})")`,
        lockLines: 6,
        solution: `import math\nW_S = 0.6  # bobot saham\nSIG_S, SIG_B, RHO = 0.18, 0.06, 0.2\nw_b = 1 - W_S\n\nvar_p = W_S**2*SIG_S**2 + w_b**2*SIG_B**2 + 2*W_S*w_b*RHO*SIG_S*SIG_B\nsig_p = math.sqrt(var_p)\n\n# TULIS KODEMU\nmrc_s = (W_S*SIG_S**2 + w_b*RHO*SIG_S*SIG_B) / sig_p\nmrc_b = (w_b*SIG_B**2 + W_S*RHO*SIG_S*SIG_B) / sig_p\nrc_s = W_S * mrc_s\nrc_b = w_b * mrc_b\nshare_s = rc_s / sig_p\n\nprint(f"RC saham   : {share_s:.0%} (bobot {W_S:.0%})")\nprint(f"RC obligasi: {1-share_s:.0%} (bobot {w_b:.0%})")`,
        checks: [
          { kind: "equal", task: "t1", name: "rc_s", value: 0.10573, tol: 0.002, label: "`rc_s` ≈ 0.1057", msg: "0,6 × 0,020304 / 0,1152 ≈ 0,1057. Itu kontribusi absolut saham ke vol 11,5%." },
          { kind: "equal", task: "t2", name: "share_s", value: 0.9176, tol: 0.005, label: "`share_s` ≈ 0.92", msg: "0,1057 / 0,1152 ≈ 92%. Ya \u2014 92% risiko dari saham yang \u2018hanya\u2019 60% modal." },
          { kind: "stdout_matches", task: "t3", pattern: "RC saham\\s+: 92%", label: "`print` menampilkan 92%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risk budgeting mengalokasikan risiko, bukan modal. Risk parity (kasus khusus: RC sama untuk semua aset) memberi bobot ∝ 1/σ \u2014 untuk σ 18/6 berarti ~25/75. Kamu menukar return dengan ketahanan; implementasi penuh butuh leverage dan menjadi bond-heavy saat suku bunga naik.",
      },
      reference: "Uji 30 detik: hitung kontribusi risiko tiap aset \u2014 kaget? Rebalance risikonya.",
    },
    {
      id: "rebalancing",
      eyebrow: "Langkah 4 · Rebalancing",
      title: "Calendar vs tolerance band",
      prose: [
        "Dua metode rebalancing. Calendar: rebalance periodik (kuartalan/tahunan) \u2014 sederhana tetapi bisa terlambat di pasar trending. Tolerance band: rebalance jika |w − target| > band (mis. ±5%) \u2014 responsif tetapi trading lebih sering. Praktik terbaik: kombinasi \u2014 cek kuartalan, rebalance jika breach band.",
        "Trade-off-nya adalah disiplin versus biaya (komisi, spread, pajak). Solusi berlapis: rebalance dulu dengan arus kas baru (kontribusi ke aset underweight, penarikan dari overweight) \u2014 tanpa jual, tanpa pajak; lalu gunakan dividen/kupon; lalu rebalance di akun tax-deferred; terakhir barulah jual kena pajak.",
        "Contoh drift yayasan: 60/40, saham +40%, obligasi +5% dalam setahun. Bobot saham baru = 60\u00D71,4 / (60\u00D71,4 + 40\u00D71,05) = 84/126 = 66,7% \u2014 breach band ±5% (di atas 65%) \u2192 rebalance: jual saham, beli obligasi. Tanpa aturan ini, empat tahun kemudian portofolio mencapai 78/22.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `w_baru` (bobot saham setelah 1 tahun)" },
        { id: "t2", text: "Tentukan `breach` (True jika menyimpang > BAND)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "w_baru=66.7%  breach=True",
      hints: [
        "Nilai saham = W_S*(1+R_S); obligasi = (1−W_S)*(1+R_B); w_baru = saham/total.",
        "breach = (w_baru − W_S) > BAND.",
        "w_baru = 84 / 126",
      ],
      code: {
        starter: `W_S = 0.60\nR_S, R_B = 0.40, 0.05  # return 1 tahun\nBAND = 0.05\n\n# TULIS KODEMU\nw_baru = \nbreach = \n\nprint(f"w_baru={w_baru:.1%}  breach={breach}")`,
        lockLines: 3,
        solution: `W_S = 0.60\nR_S, R_B = 0.40, 0.05  # return 1 tahun\nBAND = 0.05\n\n# TULIS KODEMU\nw_baru = W_S*(1+R_S) / (W_S*(1+R_S) + (1-W_S)*(1+R_B))\nbreach = (w_baru - W_S) > BAND\n\nprint(f"w_baru={w_baru:.1%}  breach={breach}")`,
        checks: [
          { kind: "equal", task: "t1", name: "w_baru", value: 0.66667, tol: 0.001, label: "`w_baru` ≈ 0.667", msg: "84/126 = 66,7%. Portofolio berjalan sendiri keluar dari target." },
          { kind: "equal", task: "t2", name: "breach", value: true, label: "`breach` = True", msg: "66,7% > 65% (60% + band 5%) \u2192 breach \u2192 rebalance." },
          { kind: "stdout_matches", task: "t3", pattern: "w_baru=66\\.7%\\s+breach=True", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Sering salah",
        body: "\u201CRebalancing = market timing yang merugikan (biaya + pajak).\u201D Kebalikannya: tidak rebalance adalah keputusan pasif untuk drift \u2014 risikonya naik diam-diam (yayasan: Rp2,7 miliar!). Optimalkan frekuensinya (band + pajak-aware), bukan meniadakannya.",
      },
      reference: "Rebalancing = spooring mobil: calendar = tiap 10.000 km; band = saat setir menarik.",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Kuis tengah",
      title: "Cek cepat: optimisasi dan parity",
      prose: ["Dua pertanyaan sebelum peta keputusan."],
      tasks: [],
      quiz: [
        {
          q: "Optimizer memberi 95% ke saham A (selisih E(R) vs B hanya 0,1%). Sikap yang tepat?",
          options: [
            { text: "Ikuti persis \u2014 itu hasil optimal", why: "Salah: 0,1% = noise; mengikuti persis berarti memaksimalkan error estimasi." },
            { text: "Curigai error maximization \u2014 tambah constraints, bulatkan bobot", why: "Tepat: selisih sekecil itu tidak bisa dipercaya. Constraints + round ke 5%.", correct: true },
            { text: "Tambah lagi ke 100%", why: "Salah: itu memperparah konsentrasi pada kesalahan estimasi." },
            { text: "Abaikan optimisasi selamanya", why: "Terlalu jauh: optimisasi berguna dengan kerendahan hati (shrinkage, BL, constraints)." },
          ],
        },
        {
          q: "Risk parity untuk 2 aset tak berkorelasi. Bagaimana bobotnya?",
          options: [
            { text: "50/50 selalu", why: "Salah: 50/50 hanya benar jika volatilitasnya sama." },
            { text: "Berbanding terbalik dengan volatilitas (∝ 1/σ)", why: "Tepat: untuk σ 18/6 \u2192 25/75, sehingga kontribusi risiko 50/50.", correct: true },
            { text: "Berbanding lurus dengan volatilitas", why: "Salah arah: itu justru memusatkan risiko ke aset paling volatile." },
            { text: "100% ke aset return tertinggi", why: "Salah: risk parity mengalokasikan risiko, bukan mengejar return." },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Lima keputusan konstruksi",
      prose: [
        "Peta keputusan lesson ini. (1) Bobot optimisasi ekstrem (95/5) \u2192 tambah constraints atau curigai input: error maximization. (2) Return forecast tidak dipercaya \u2192 risk parity / risk budgeting: risiko lebih persisten dari return. (3) Drift melebihi band \u2192 rebalance: kembali ke IPS. (4) Ada arus kas masuk/keluar \u2192 rebalance via arus kas: tanpa biaya transaksi. (5) Membangun portofolio \u2192 input jujur + risiko seimbang + disiplin rebalance.",
        "Aturan 10 detik: constraints selalu di optimisasi. Bulatkan bobot (jangan dua desimal). Monitor drift bulanan. Rebalance by band + arus kas.",
      ],
      tasks: [],
      reference: "Checklist 10 menit: input jujur? constraint? risiko seimbang? biaya total < 1%? rebalance rule tertulis?",
    },
    {
      id: "minicase-yayasan",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rp2,7 miliar harga sebuah drift",
      prose: [
        "Yayasan: SAA 60/40 (2020), tanpa rebalance \u2192 78/22 (2024) \u2192 koreksi \u221215%. Hitung rugi ekstra: dengan drift, rugi = 78% \u00D7 15% = 11,7%. Tanpa drift (tetap 60/40), rugi = 60% \u00D7 15% = 9%. Selisih: 2,7 poin = Rp2,7 miliar dari Rp100 miliar. Drift adalah risiko gratis yang tidak dibayar \u2014 dan tidak ada yang \u2018bersalah\u2019 secara individu; yang bersalah adalah governance yang tidak ada monitoring drift dan tidak ada aturan rebalance.",
        "Sistem agar tidak terulang: dashboard drift bulanan dengan flag breach otomatis; tolerance band ±5% tertulis di IPS; rebalance via arus kas baru; analis portofolio sebagai penjaga disiplin. Governance konstruksi: IPS memuat band dan aturan rebalance; komite investasi review kuartalan; pre-trade check (apakah masih dalam SAA?); audit tahunan atas biaya, pajak, dan tracking error.",
        "Pelajaran implementasi: ETF vs aktif \u2014 reksadana aktif dengan alpha historis 0,5% dan fee 1,2% memberi neto \u22120,7% vs ETF \u22120,03%: ETF menang 0,67%/tahun. Default = pasif murah; aktif hanya jika alpha neto terbukti konsisten. Dan total cost: fee 1% + turnover 100% \u00D7 spread 0,2% + pajak 0,3% = 1,5%/tahun \u2192 (1,015)^20 = 1,35× \u2014 26% kekayaan hilang untuk biaya dalam 20 tahun.",
      ],
      tasks: [],
      reference: "78% × 15% = 11,7% vs 60% × 15% = 9% \u2192 selisih 2,7 poin.",
    },

    {
      id: "michaud-resampling",
      eyebrow: "Langkah 7 · Optimisasi tingkat lanjut + chart",
      title: "Michaud resampling: optimisasi yang mengaku tidak tahu",
      prose: [
        "Mean-variance klasik memperlakukan estimasi sebagai fakta: μ = 10,1% dimasukkan sebagai 10,1000%. Michaud resampled efficiency (1998) memperlakukannya sebagai sampel dari distribusi: ia mengambil ratusan sampel return dari distribusi yang diestimasi (dengan mean dan kovarians dari data), menjalankan optimisasi untuk tiap sampel, lalu merata-ratakan bobot optimalnya. Hasilnya: bobot yang \u201Csering optimal di banyak dunia kemungkinan\u201D, bukan bobot yang \u201Csempurna di satu dunia khayalan\u201D.",
        "Contoh konkret: dua saham, A E(R) 10,1% σ 20%, B 10,0% σ 20%, korelasi 0,3. Optimisasi klasik: karena selisih 0,1% dianggap pasti, bobotnya 95/5 (atau 100/0 dengan long-only longgar). Resampling: di sebagian sampel A memang lebih baik, di sebagian lain B yang menang \u2014 rata-rata bobotnya keluar sekitar 55/45. Mana yang lebih jujur? Data tidak bisa membedakan 10,1% dari 10,0% (standard error estimasi rata-rata = volatilitas dibagi akar jumlah tahun data — dengan data 30 tahun dan vol 20%, SE-nya 3,7%), jadi 95/5 adalah presisi palsu; 55/45 mencerminkan ketidaktahuan yang sebenarnya.",
        "Kapan resampling membantu dan kapan tidak. Membantu: saat estimasi return berisik tetapi kovarians cukup stabil \u2014 ia menghasilkan portofolio yang lebih terdiversifikasi dan lebih stabil antar-periode (turnover lebih rendah). Tidak membantu: saat inputnya sendiri bias sistematis (misalnya semua return overestimate karena survivorship bias) \u2014 resampling tidak memperbaiki bias, hanya mengakui variansnya. Dan ia bukan pengganti constraints: praktisi serius memakai keduanya \u2014 resampling untuk kerendahan hati statistik, constraints untuk kerendahan hati bisnis (likuiditas, mandat, pajak).",
        "Aturan keputusan: jika bobot hasil optimisasi klasik berubah >15 poin persen hanya karena kamu mengubah satu input sebesar setengah standard error-nya, input itu terlalu berisik untuk dipercaya \u2014 pakai resampling atau sederhanakan (risk parity / 1/N dengan tilt). Optimisasi yang baik menjawab \u201Cbobot berapa yang robust?\u201D, bukan \u201Cbobot berapa yang optimal di atas kertas?\u201D",
        "Cara membaca: dua kelompok batang = bobot saham A vs B hasil dua metode optimisasi dengan input yang sama.",
        "Interpretasi: selisih E(R) A–B hanya 0,1% — noise estimasi — tetapi optimisasi klasik membaca angka itu sebagai kepastian dan menghukum B ke 5%; resampling mengakui ketidaktahuan dan memberi 55/45; presisi palsu selalu terlihat meyakinkan di atas kertas.",
      ],
      figure: {
        svg: MICHAUD_SVG,
        alt: "Batang bobot saham A dan B: optimisasi klasik 95 banding 5 vs resampling 55 banding 45.",
        caption: "Error maximization: optimisasi klasik 95/5 dari selisih 0,1% vs resampling 55/45 yang mengakui noise.",
      },
      tasks: [],
      reference: "Resampling = rata-ratakan bobot optimal dari ratusan \u2018dunia kemungkinan\u2019; bukan obat bias, hanya obat varians.",
    },
    {
      id: "black-litterman-praktis",
      eyebrow: "Langkah 8 · Black-Litterman & kendala nyata",
      title: "Black-Litterman: kapan dipakai, dan kendala yang sering dilupakan",
      prose: [
        "Black-Litterman (BL) menjawab masalah paling memalukan dari optimisasi klasik: input return mentah menghasilkan bobot ekstrem yang tidak masuk akal. BL mulai dari equilibrium \u2014 bobot pasar global (market-cap) di-reverse-engineer menjadi implied return: \u201Cjika pasar seimbang di bobot ini, berapa return yang tersirat?\u201D Lalu view analis dicampur proporsional keyakinan. Contoh: implied return saham EM 6%; tim riset yakin EM akan 8% dengan keyakinan 60% dan ketidakpastian view ±3% \u2014 BL menghasilkan sekitar 7,2%, dan bobot EM naik moderat, bukan melonjak ke 40%. Tanpa view sama sekali, BL = bobot pasar: titik awal yang netral dan sulit dikritik.",
        "Kapan BL dipakai di praktik Indonesia: (1) manajer dengan komite investasi yang punya view kuat tetapi tidak ingin view itu mendominasi \u2014 BL memaksa view ditulis dengan keyakinan eksplisit; (2) dana besar yang benchmark-nya indeks pasar \u2014 deviasi dari benchmark menjadi keputusan sadar, bukan kecelakaan estimasi; (3) saat menggabungkan banyak view yang bertentangan \u2014 BL menimbangnya secara konsisten lewat matriks kovarians, bukan lewat debat kusir. Kapan TIDAK dipakai: portofolio kecil tanpa view (pakai saja risk parity), atau saat tim tidak jujur soal keyakinan \u2014 keyakinan 95% untuk semua view membuat BL sama ekstremnya dengan optimisasi klasik.",
        "Kendala praktis yang sering dilupakan textbook. Turnover: tiap 100% turnover di IDX menghabiskan ~0,3\u20130,5% untuk spread + komisi \u2014 optimizer yang tidak kenal turnover akan churn portofolio tiap ada update CME kecil; solusinya turnover budget (mis. maks 30% per rebalance) atau penalti turnover di fungsi objektif. Lot size & likuiditas: saham lapis tiga IDX dengan ADV Rp500 juta tidak bisa menampung order Rp5 miliar tanpa menggerakkan harga \u2014 batasi bobot per emiten relatif terhadap ADV (mis. posisi ≤ 5% ADV harian). Pajak: realisasi gain kena PPh final 0,1% untuk saham (kecil) tetapi obligasi/keuntungan lain punya perlakuan beda \u2014 optimizer pajak-aware menunda realisasi dan memprioritaskan penjualan posisi rugi (lihat tax-loss harvesting).",
        "Checklist konstruksi final sebelum live: input sudah di-shrink dan diuji sensitivitasnya; constraints mencakup long-only, bobot maks, turnover, likuiditas/ADV, dan pajak; bobot dibulatkan ke 5%; backtest mencakup biaya transaksi realistis (bukan nol); dan ada kill-switch \u2014 kondisi apa yang membuat strategi ini dihentikan (mis. tracking error > 8% dua kuartal berturut-turut). Portofolio yang tidak punya kriteria berhenti adalah eksperimen tanpa akhir.",
      ],
      formula: String.raw`E[R] = [(1-\tau)\Sigma^{-1} + P^T\Omega^{-1}P]^{-1}[(1-\tau)\Sigma^{-1}\Pi + P^T\Omega^{-1}Q]`,
      formulaNote: "Π = implied equilibrium return (dari bobot pasar); Q = vektor view analis (mis. \u201CEM outperform 2%\u201D); P = matriks pemetaan view ke aset; Ω = ketidakpastian tiap view (makin besar = view makin diabaikan); τ = skala ketidakpastian prior (kecil, mis. 0,025\u20130,05). Intuisinya: rata-rata tertimbang antara \u201Ckata pasar\u201D (Π) dan \u201Ckata analis\u201D (Q), dengan bobot = keyakinan masing-masing. Tidak perlu menghafal \u2014 pahami bahwa keyakinan rendah = view nyaris tidak mengubah bobot.",
      tasks: [],
      reference: "BL = pasar sebagai prior + view proporsional keyakinan; kendala nyata: turnover, ADV, pajak, kill-switch.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Empat pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Optimisasi = error maximizer: butuh constraints, shrinkage, dan Black-Litterman; jangan percaya bobot dua desimal.",
        "Risk budgeting mengalokasikan risiko (RC_i), bukan modal; 60/40 ≈ 92% risiko dari saham.",
        "Rebalancing: calendar vs tolerance band; via arus kas = gratis; drift yang dibiarkan = risiko diam-diam.",
        "Implementasi: default pasif murah; hitung total cost (fee + turnover×spread + pajak), bukan cuma fee.",
        "Konstruksi terbaik = yang dijalankan dengan disiplin, bukan yang teorinya paling canggih.",
      ],
      next: { label: "C5 \u2014 Performance Evaluation", href: "/v2/learn/pm-c5-performance-evaluation" },
      quiz: [
        {
          q: "Kapan Michaud resampling PALING membantu?",
          options: [
            { text: "Saat semua input return bias sistematis ke atas", why: "Salah: resampling mengakui varians estimasi, bukan memperbaiki bias sistematis." },
            { text: "Saat estimasi return berisik tetapi kovarians cukup stabil", why: "Tepat: ia merata-ratakan bobot optimal lintas \u2018dunia kemungkinan\u2019 \u2192 portofolio lebih terdiversifikasi dan stabil.", correct: true },
            { text: "Saat ingin bobot dua desimal yang presisi", why: "Salah arah: resampling justru menghasilkan bobot yang lebih \u2018bulat\u2019 dan rendah hati." },
            { text: "Sebagai pengganti constraints bisnis", why: "Salah: resampling = kerendahan hati statistik; constraints = kerendahan hati bisnis. Butuh keduanya." },
          ],
        },
        {
          q: "Tim yakin EM return 8% vs implied pasar 6%, keyakinan 60%. Input Black-Litterman yang benar?",
          options: [
            { text: "8% penuh \u2014 ikuti keyakinan tim", why: "Salah: itu mengabaikan prior pasar; BL mencampur proporsional keyakinan." },
            { text: "\u22487,2% \u2014 campuran pasar dan view", why: "Tepat: 6% + 0,6×2% ≈ 7,2%. Tanpa view, BL kembali ke bobot pasar.", correct: true },
            { text: "6% \u2014 abaikan view analis", why: "Salah: view dengan keyakinan 60% layak menggeser input, hanya tidak penuh." },
            { text: "10% \u2014 view harus dilebihkan agar terasa", why: "Salah: melebihkan view = error maximization berkedok keyakinan." },
          ],
        },
        {
          q: "Drift ke 66,7% dari target 60%, band ±5%. Tindakan?",
          options: [
            { text: "Biarkan \u2014 masih dekat", why: "Salah: 66,7% > 65% = breach band. \u2018Dekat\u2019 bukan aturan; band adalah aturan." },
            { text: "Rebalance ke 60% (breach band)", why: "Tepat: kembali ke janji IPS \u2014 jual saham yang naik, beli obligasi.", correct: true },
            { text: "Tunggu sampai 70%", why: "Salah: menunggu = membiarkan drift membesar; band ±5% sudah memberi toleransi." },
            { text: "Jual semua saham", why: "Salah: rebalancing mengembalikan ke target, bukan melikuidasi." },
          ],
        },
        {
          q: "Cara rebalance tanpa biaya transaksi?",
          options: [
            { text: "Tidak ada caranya", why: "Salah: ada \u2014 manfaatkan arus kas yang memang terjadi." },
            { text: "Via arus kas: kontribusi ke underweight, penarikan dari overweight", why: "Tepat: rebalance gratis memakai kas masuk/keluar.", correct: true },
            { text: "Pinjam dana untuk top-up", why: "Salah: menambah leverage bukan rebalancing." },
            { text: "Tunggu pasar koreksi sendiri", why: "Salah: itu berharap, bukan disiplin." },
          ],
        },
        {
          q: "Yayasan 60/40 drift ke 78/22, lalu koreksi \u221215%. Rugi ekstra vs tetap 60/40?",
          options: [
            { text: "Tidak ada \u2014 pasar yang menentukan", why: "Salah: bobot yang drift adalah keputusan (pasif) yayasan, bukan pasar." },
            { text: "2,7 poin (Rp2,7M dari Rp100M) \u2014 drift = risiko diam-diam tanpa kompensasi", why: "Tepat: 11,7% vs 9%. Risiko ekstra tanpa keputusan sadar.", correct: true },
            { text: "Justru untung \u2014 drift meningkatkan return", why: "Salah: dalam koreksi ini drift memperbesar rugi; return ekspektasian naik sedikit, risiko naik banyak." },
            { text: "Tidak bisa dihitung", why: "Bisa: selisih bobot × besar koreksi = 18% × 15% = 2,7 poin." },
          ],
        },
        {
          q: "Manajer aktif: alpha historis 0,5%, fee 1,2%. ETF: fee 0,03%, alpha 0. Pilih?",
          options: [
            { text: "Aktif \u2014 ada alpha", why: "Salah: alpha bruto 0,5% − fee 1,2% = neto \u22120,7%. Kamu membayar untuk penghancur nilai." },
            { text: "ETF \u2014 menang 0,67%/tahun secara neto", why: "Tepat: −0,03% vs −0,7%. Biaya = kepastian; alpha = harapan.", correct: true },
            { text: "Aktif \u2014 fee tinggi berarti kualitas", why: "Salah: fee tinggi tidak berkorelasi dengan alpha neto positif." },
            { text: "Sama saja", why: "Salah: selisih 0,67%/tahun × 20 tahun sangat material." },
          ],
        },
      ],
    },
  ],
};
