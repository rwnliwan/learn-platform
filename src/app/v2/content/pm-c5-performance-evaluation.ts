import type { V2Lesson } from "../lib/types";

// Waterfall atribusi Brinson: alokasi + seleksi + interaksi = excess return.
const BRINSON_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Waterfall atribusi: alokasi +1,5 persen, seleksi +2,0 persen, interaksi +1,0 persen, total +4,5 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="60" x2="500" y2="60"/><line x1="60" y1="100" x2="500" y2="100"/><line x1="60" y1="140" x2="500" y2="140"/><line x1="60" y1="180" x2="500" y2="180"/></g>
<line x1="60" y1="220" x2="500" y2="220" stroke="var(--text)" stroke-width="1" opacity="0.5"/>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">5%</text><text x="54" y="64">4%</text><text x="54" y="104">3%</text><text x="54" y="144">2%</text><text x="54" y="184">1%</text><text x="54" y="224">0%</text></g>
<line x1="170" y1="160" x2="200" y2="160" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3,3"/>
<line x1="270" y1="80" x2="300" y2="80" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="3,3"/>
<rect x="100" y="160" width="70" height="60" fill="var(--c1)"/>
<rect x="200" y="80" width="70" height="80" fill="var(--c2)"/>
<rect x="300" y="40" width="70" height="40" fill="var(--c3)"/>
<rect x="400" y="40" width="70" height="180" fill="var(--c4)" opacity="0.45" stroke="var(--c4)" stroke-width="1.5"/>
<g font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="135" y="150">+1,5%</text><text x="235" y="70">+2,0%</text><text x="335" y="30">+1,0%</text><text x="435" y="30">+4,5%</text></g>
<g font-size="10.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="135" y="240">Alokasi</text><text x="235" y="240">Seleksi</text><text x="335" y="240">Interaksi</text><text x="435" y="240">Total</text></g>
</svg>`;

export const pmc5: V2Lesson = {
  slug: "pm-c5-performance-evaluation",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C5 — Performance Evaluation",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-manajer-growth",
      eyebrow: "Langkah 1 · Cerita",
      title: "Manajer \u2018hebat\u2019 yang menipu waktu",
      prose: [
        "2021: manajer growth pamer return +40%. Investor berbondong-bondong masuk di puncak. 2022: \u221230%. Investor rata-rata justru rugi \u2014 masuk besar saat mahal, keluar saat murah.",
        "Twist-nya: return dana (+40% lalu \u221230%) \u2260 return investor (rugi!). Dua angka, dua cerita \u2014 dan manajer hanya memamerkan yang bagus. TWR (time-weighted return) mengukur manajer dengan menghilangkan efek timing arus kas; MWR/IRR (money-weighted) mengukur pengalaman investor termasuk dosa FOMO-nya.",
        "Lesson ini tentang membaca return tanpa dibohongi: ukur dengan benar (TWR vs MWR), urai dengan atribusi Brinson, dan verifikasi dengan standar GIPS.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CReturn dana = return yang saya terima. Manajer +40%/\u221230% artinya saya \u22122%.\u201D Belum tentu: investor cerita ini justru IRR \u2248 \u221220% dengan MOIC 0,76x karena FOMO di puncak. TWR = skill manajer; MWR = pengalamanmu.",
      },
      reference: "Evaluasi manajer \u2192 TWR. Evaluasi pengalaman investor \u2192 MWR.",
    },
    {
      id: "twr-vs-mwr",
      eyebrow: "Langkah 2 · TWR vs MWR",
      title: "Dua kebenaran: \u22122% vs \u221220%",
      prose: [
        "Dana: 2021 +40%, 2022 \u221230%. TWR = 1,4 \u00D7 0,7 \u2212 1 = \u22122%. Perkalian komutatif: untuk TWR, urutan +40% lalu \u221230% sama saja dengan sebaliknya.",
        "Investor: setor 100 (tumbuh jadi 140), tambah 400 di puncak = 540, lalu \u00D70,7 = 378. IRR dari arus \u2212100, \u2212400, +378 adalah sekitar \u221220% (perhitungan eksak \u221221,1%). MOIC = 378/500 = 0,76x \u2014 uang menyusut seperempat. Selisih 18 poin antara TWR dan MWR adalah behavior gap: murni dari timing setoran yang buruk.",
        "Data Dalbar: 20 tahun, S&P 500 \u2248 9%/tahun tetapi investor reksadana rata-rata hanya \u2248 5\u20136% \u2014 gap 3\u20134%/tahun dari jual panik dan beli FOMO. Selama 20 tahun, selisihnya \u2248 50% kekayaan. Musuh terbesar investor adalah cermin.",
      ],
      formula: String.raw`TWR = \prod (1 + r_t) - 1 \quad;\quad 0 = \sum \frac{CF_t}{(1 + IRR)^t}`,
      formulaNote: "r_t = return sub-periode antar arus kas (TWR: potong di tiap arus kas, lalu kalikan). IRR: tingkat yang membuat NPV arus kas = 0. MOIC = total distribusi / total setoran.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menilai manajer dengan IRR/MWR. Salah metrik: MWR terkontaminasi timing investor yang di luar kendali manajer. TWR = skill; MWR = pengalaman investor.",
      },
      reference: "Angka tanpa konteks (TWR/MWR? bruto/neto? benchmark? risiko?) = pemasaran.",
    },
    {
      id: "lab-twr-mwr",
      eyebrow: "Langkah 3 · Lab TWR vs MWR",
      title: "Hitung behavior gap",
      prose: [
        "Hitung TWR dana (+40%, lalu \u221230%), IRR investor (setor 100, tambah 400 di puncak), MOIC, dan behavior gap-nya. IRR dua periode bisa diselesaikan lewat persamaan kuadrat dengan x = 1/(1+r).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `twr` dan `nilai` akhir investor" },
        { id: "t2", text: "Selesaikan `irr` dari persamaan kuadrat" },
        { id: "t3", text: "Hitung `moic`, `gap`, lalu cetak semuanya" },
      ],
      expected: "TWR (manajer) : -2%  IRR (investor): -21.1%  MOIC: 0.76x",
      hints: [
        "twr = (1+R1)*(1+R2) − 1; nilai = (SETOR1*(1+R1) + TAMBAH)*(1+R2).",
        "378x² − 400x − 100 = 0 \u2192 x = (−B + √D)/(2A), lalu irr = 1/x − 1.",
        "moic = nilai/total_setor; gap = twr − irr",
      ],
      code: {
        starter: `import math\nR1, R2 = 0.40, -0.30\nSETOR1, TAMBAH = 100, 400\n\n# TULIS KODEMU\ntwr = \nnilai = \ntotal_setor = SETOR1 + TAMBAH\nA, B, C = nilai, -TAMBAH, -SETOR1\nD = B*B - 4*A*C\nx = (-B + math.sqrt(D))/(2*A)\nirr = \nmoic = \ngap = twr - irr\n\nprint(f"TWR (manajer) : {twr:.0%}")\nprint(f"IRR (investor): {irr:.1%}")\nprint(f"MOIC          : {moic:.2f}x")\nprint(f"Behavior gap  : {gap:+.0%}")`,
        lockLines: 8,
        solution: `import math\nR1, R2 = 0.40, -0.30\nSETOR1, TAMBAH = 100, 400\n\n# TULIS KODEMU\ntwr = (1+R1)*(1+R2) - 1\nnilai = (SETOR1*(1+R1) + TAMBAH)*(1+R2)\ntotal_setor = SETOR1 + TAMBAH\nA, B, C = nilai, -TAMBAH, -SETOR1\nD = B*B - 4*A*C\nx = (-B + math.sqrt(D))/(2*A)\nirr = 1/x - 1\nmoic = nilai/total_setor\ngap = twr - irr\n\nprint(f"TWR (manajer) : {twr:.0%}")\nprint(f"IRR (investor): {irr:.1%}")\nprint(f"MOIC          : {moic:.2f}x")\nprint(f"Behavior gap  : {gap:+.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "twr", value: -0.02, tol: 1e-9, label: "`twr` = −0.02", msg: "1,4 × 0,7 − 1 = −2%. Urutan tidak penting untuk TWR." },
          { kind: "equal", task: "t2", name: "irr", value: -0.21073, tol: 0.005, label: "`irr` ≈ −0.21", msg: "Akar positif persamaan 378x² − 400x − 100 = 0, lalu r = 1/x − 1." },
          { kind: "equal", task: "t3", name: "moic", value: 0.756, tol: 0.002, label: "`moic` ≈ 0.76", msg: "378/500 = 0,756. Uang investor menyusut seperempat." },
          { kind: "stdout_matches", task: "t3", pattern: "IRR \\(investor\\): -21\\.1%", label: "`print` menampilkan IRR −21.1%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Manajer \u22122% (biasa); investor \u2248 \u221220% (FOMO). Gap \u2248 18 poin.",
    },
    {
      id: "atribusi-brinson",
      eyebrow: "Langkah 4 · Atribusi Brinson + chart",
      title: "Bedah nilai tambah: dari mana return datang?",
      prose: [
        "Excess return diurai tiga komponen. Allocation = (w_p − w_b) × R_b: bobot menyimpang dikali return benchmark sektor \u2014 \u2018pilih jurusan yang tepat\u2019. Selection = w_b × (R_p − R_b): saham mengalahkan sektornya? \u2014 \u2018ranking di jurusan\u2019. Interaction = (w_p − w_b) × (R_p − R_b): keduanya sekaligus.",
        "Contoh: sektor teknologi, w_p 30% vs w_b 20%; R_p 25% vs R_b 15%. Allocation = 10% × 15% = +1,5% (overweight sektor bagus). Selection = 20% × 10% = +2,0% (sahamnya mengalahkan). Interaction = 10% × 10% = +1,0%. Total +4,5%: manajer hebat di keduanya \u2014 layak dipertahankan dan layak fee.",
        "Kegunaan sesungguhnya adalah diagnosis. Manajer underperform 2% dengan atribusi alokasi +1% dan seleksi −3%: jangan pecat \u2014 timing alokasinya skill yang langka; yang diperbaiki adalah proses seleksi (analis? model? universe?). Tanpa atribusi, \u2018pecat saja\u2019 membuang skill yang langka. Atribusi adalah bedah, bukan eksekusi.",
        "Cara membaca: waterfall dibaca kiri ke kanan — tiga batang komponen menumpuk menjadi batang total; sumbu Y = persen.",
        "Interpretasi: +4,5% excess return = +1,5% alokasi (pilih sektor yang tepat) + +2,0% seleksi (saham mengalahkan sektornya) + +1,0% interaksi; tanpa uraian ini, klaim manajer hebat hanyalah tebakan.",
      ],
      figure: {
        svg: BRINSON_SVG,
        alt: "Waterfall atribusi Brinson: alokasi, seleksi, interaksi, dan total.",
        caption: "Waterfall atribusi Brinson: +1,5% alokasi + +2,0% seleksi + +1,0% interaksi = +4,5% excess return.",
      },
      formula: String.raw`R_p - R_b = \sum (w_p - w_b)R_b + \sum w_b(R_p - R_b) + \sum (w_p - w_b)(R_p - R_b)`,
      tasks: [
        { id: "t1", text: "Hitung `alloc`, `selec`, `inter`" },
        { id: "t2", text: "Hitung `total` dan cetak keempatnya" },
      ],
      formulaNote: "R_p − R_b = selisih return portofolio vs benchmark yang diurai menjadi tiga: (w_p − w_b)R_b = efek alokasi (bobot menyimpang × return benchmark sektor); w_b(R_p − R_b) = efek seleksi (bobot benchmark × keunggulan return di sektor itu); (w_p − w_b)(R_p − R_b) = interaksi (keduanya sekaligus). Jumlah ketiganya selalu sama dengan excess return total — pakai ini sebagai cek konsistensi. Interpretasi praktis: alokasi positif + seleksi negatif konsisten = manajer pandai menebak sektor tetapi buruk memilih saham — fee aktifnya tidak layak karena tilt sektor bisa direplikasi murah via ETF.",
      expected: "Allocation : +1.50%  Selection : +2.00%  Interaction: +1.00%  Total: +4.50%",
      hints: [
        "alloc = (W_P − W_B) × R_B; selec = W_B × (R_P − R_B).",
        "inter = (W_P − W_B) × (R_P − R_B); total = jumlah ketiganya.",
        "Cek silang: total harus = W_P×R_P − W_B×R_B.",
      ],
      code: {
        starter: `# Atribusi Brinson 1 sektor\nW_P, W_B = 0.30, 0.20\nR_P, R_B = 0.25, 0.15\n\n# TULIS KODEMU\nalloc = \nselec = \ninter = \ntotal = alloc + selec + inter\n\nprint(f"Allocation : {alloc:+.2%}")\nprint(f"Selection  : {selec:+.2%}")\nprint(f"Interaction: {inter:+.2%}")\nprint(f"Total      : {total:+.2%}")`,
        lockLines: 2,
        solution: `# Atribusi Brinson 1 sektor\nW_P, W_B = 0.30, 0.20\nR_P, R_B = 0.25, 0.15\n\n# TULIS KODEMU\nalloc = (W_P - W_B) * R_B\nselec = W_B * (R_P - R_B)\ninter = (W_P - W_B) * (R_P - R_B)\ntotal = alloc + selec + inter\n\nprint(f"Allocation : {alloc:+.2%}")\nprint(f"Selection  : {selec:+.2%}")\nprint(f"Interaction: {inter:+.2%}")\nprint(f"Total      : {total:+.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "alloc", value: 0.015, tol: 1e-9, label: "`alloc` = +1.5%", msg: "(0,30−0,20) × 0,15 = 1,5%. Overweight sektor yang bagus." },
          { kind: "equal", task: "t1", name: "selec", value: 0.02, tol: 1e-9, label: "`selec` = +2.0%", msg: "0,20 × (0,25−0,15) = 2,0%. Saham mengalahkan sektornya." },
          { kind: "equal", task: "t1", name: "inter", value: 0.01, tol: 1e-9, label: "`inter` = +1.0%", msg: "0,10 × 0,10 = 1,0%." },
          { kind: "equal", task: "t2", name: "total", value: 0.045, tol: 1e-9, label: "`total` = +4.5%", msg: "1,5 + 2,0 + 1,0 = 4,5%. Cek: 0,30×0,25 − 0,20×0,15 = 4,5%." },
          { kind: "stdout_matches", task: "t2", pattern: "Total\\s+: \\+4\\.50%", label: "`print` menampilkan total +4.50%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Allocation positif + selection negatif konsisten = tukang tebak sektor, bukan stock picker.",
    },
    {
      id: "benchmark-gips",
      eyebrow: "Langkah 5 · Benchmark & GIPS",
      title: "Standar kejujuran: benchmark dan GIPS",
      prose: [
        "Benchmark yang baik punya enam properti: ditetapkan di muka, terukur, tidak ambigu, mencerminkan pandangan manajer, dimiliki (ada yang bertanggung jawab), dan investable. Benchmark harus sesuai mandat \u2014 dana konservatif vs IHSG adalah perbandingan yang tidak adil dan tidak informatif. Salah benchmark = salah kesimpulan.",
        "GIPS (Global Investment Performance Standards) adalah aturan main iklan kinerja: composite mencakup semua portofolio discretionary se-mandat (asset-weighted), bukan satu portofolio terbaik; pengungkapan gross dan net (fee!); benchmark konsisten; dan verifikasi independen. Dosa klasik yang dicegah: survivorship bias (hanya tampilkan dana yang hidup), cherry-picking periode, dan benchmark yang diganti saat kalah.",
        "Contoh survivorship: 10 dana diluncurkan 2020; 2024 tersisa 7 dengan rata-rata +8%, 3 ditutup dengan \u221220%. Yang dilaporkan: +8%. Yang sebenarnya: (7×8 + 3×(−20))/10 = −0,4%. Selisih 8,4 poin. GIPS mewajibkan composite mencakup dana yang ditutup (hingga penutupan). Selalu tanya: yang mati di mana?",
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Return tanpa risiko adalah setengah cerita \u2014 bahkan bisa menipu. Manajer +25% dengan vol 30% (Sharpe 0,7) kalah dari +12% dengan vol 10% (Sharpe 1,0): yang pertama adalah leverage terselubung, bukan skill. Selalu minta return bersama vol, max drawdown, dan atribusi.",
      },
      tasks: [],
      reference: "Lima tanya sebelum percaya angka: TWR/MWR? bruto/neto? benchmark apa? risiko berapa? GIPS?",
    },
    {
      id: "kuis-tengah",
      eyebrow: "Kuis tengah",
      title: "Cek cepat: metrik dan bias",
      prose: ["Dua pertanyaan sebelum mini-case."],
      tasks: [],
      quiz: [
        {
          q: "Untuk menilai skill murni seorang manajer dana, metrik yang tepat?",
          options: [
            { text: "MWR/IRR", why: "Salah: MWR terkontaminasi timing setoran investor \u2014 di luar kendali manajer." },
            { text: "TWR vs benchmark yang konsisten", why: "Tepat: TWR menghilangkan efek arus kas; benchmark konsisten membuat perbandingan adil.", correct: true },
            { text: "MOIC", why: "MOIC mengukur pengalaman kas investor, bukan skill manajer." },
            { text: "Return 1 bulan terakhir", why: "Salah: terlalu pendek \u2014 noise, bukan skill." },
          ],
        },
        {
          q: "Factsheet mengklaim \u201815%/tahun\u2019 tetapi hanya menampilkan 2 dari 10 dana. Ini contoh?",
          options: [
            { text: "GIPS compliant", why: "Salah: GIPS justru mewajibkan composite semua portofolio se-mandat." },
            { text: "Survivorship bias", why: "Tepat: 8 dana gagal disembunyikan. Rata-rata yang dilaporkan jauh di atas realita.", correct: true },
            { text: "Net return yang jujur", why: "Salah: tanpa pengungkapan gross/net dan composite, klaimnya tidak bisa diverifikasi." },
            { text: "Benchmark yang baik", why: "Salah: ini soal seleksi dana yang ditampilkan, bukan benchmark." },
          ],
        },
      ],
    },
    {
      id: "minicase-growth",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Halo +40%, selamat tinggal \u221230%",
      prose: [
        "Dana: +40% (2021), \u221230% (2022). Investor setor 100 di awal, lalu FOMO setor 400 di puncak 2021. Manajer mengiklankan \u2018+40%!\u2019 (2021) tanpa konteks. Hitung yang jujur: TWR = \u22122%; IRR \u2248 \u221220%; MOIC = 0,76x; behavior gap \u2248 18 poin \u2014 murni dari FOMO. Jika investor DCA rutin, hasilnya mendekati TWR.",
        "Siapa salah? Behavior gap adalah kesalahan investor (FOMO di puncak) \u2014 tetapi manajer ikut bersalah jika marketing hanya pamer +40% tanpa konteks risiko. Sistem pencegah: IPS + rebalancing (cuan 2021 direbalance, bukan ditambah!), edukasi MWR, dan aturan kontribusi otomatis (DCA) bukan FOMO.",
        "Rancang laporan yang jujur \u2014 satu halaman, lima bagian: (1) kinerja: TWR dan MWR berdampingan plus benchmark, dengan penjelasan bedanya; (2) risiko: vol, max drawdown, Sharpe, information ratio; (3) atribusi: allocation vs selection; (4) biaya: total %/tahun; (5) verifikasi: GIPS terverifikasi? Laporan yang bertanya, bukan yang pamer.",
      ],
      note: {
        title: "Intuisi: evaluasi kinerja adalah audit, bukan pemotretan",
        body: "Lima heuristik evaluator profesional. Pertama, selalu mulai dari pertanyaan \u201Cangka ini menjawab pertanyaan siapa?\u201D \u2014 TWR menjawab \u201Cseberapa bagus manajernya?\u201D, MWR menjawab \u201Cseberapa bagus pengalaman saya?\u201D; mencampur keduanya menghasilkan jawaban untuk pertanyaan yang tidak ditanyakan siapa pun. Kedua, curigai setiap angka yang terlalu rapi: return 15% per tahun selama 10 tahun dengan vol 8% dan tidak satu pun tahun merah bukan bukti skill \u2014 itu profil return strategi jual opsi terselubung atau survivorship; strategi jujur punya tahun jelek. Ketiga, benchmark adalah cermin yang dipilih manajer \u2014 dan orang jarang memilih cermin yang membuatnya jelek: minta benchmark ditetapkan SEBELUM periode evaluasi, bukan dipilih sesudahnya. Evaluator yang baik tidak mencari angka besar; ia mencari angka yang tidak bisa dibantah. Keempat, minta atribusi dalam mata uang yang sama dengan keputusannya: jika komite memutuskan alokasi, sajikan atribusi alokasi-vs-seleksi \u2014 bukan 30 halaman chart. Kelima, bandingkan manajer dengan dirinya sendiri antar-periode (konsistensi proses) sebelum membandingkannya dengan peer \u2014 peer group yang survivorship-bias adalah cermin yang menyanjung.",
      },
      tasks: [],
      reference: "Template 1 halaman: kinerja · risiko · atribusi · biaya · verifikasi.",
    },

    {
      id: "risk-adjusted-menipu",
      eyebrow: "Langkah 7 · Ukuran risk-adjusted tingkat lanjut",
      title: "Sharpe, Sortino, Treynor, IR: kapan masing-masing menipu",
      prose: [
        "Empat ukuran risk-adjusted, empat jebakan. Sharpe = (R_p − R_f)/σ_p memakai total volatilitas \u2014 menipu saat return tidak simetris: strategi yang rutin panen premi kecil tetapi sesekali rugi besar (menjual opsi, carry trade) punya Sharpe tinggi yang palsu karena σ tidak menangkap ekor kiri. Sortino mengganti σ dengan downside deviation (hanya deviasi di bawah target) \u2014 lebih jujur untuk return asimetris, tetapi sensitif pada pilihan target return-nya. Treynor = (R_p − R_f)/β memakai risiko sistematis \u2014 menipu untuk portofolio tidak terdiversifikasi (β rendah karena idiosyncratic risk tinggi terlihat \u201Cbagus\u201D padahal risikonya tidak dibayar). Information ratio = alpha/σ(alpha) mengukur konsistensi vs benchmark \u2014 menipu bila benchmark-nya salah (IR tinggi vs benchmark yang tidak relevan = presisi menuju tempat yang salah).",
        "Contoh angka: Manajer X return 18%, σ 22%, β 1,4, downside dev 14%, tracking error 8%, alpha 2%. Sharpe = (18−4)/22 = 0,64; Sortino = 14/14 = 1,00; Treynor = 14/1,4 = 10%; IR = 2/8 = 0,25. Manajer Y return 12%, σ 10%, downside dev 7%, tracking error 3%, alpha 1,5%. Sharpe = 0,80; Sortino = 1,14; IR = 0,50. Y menang di semua ukuran yang relevan \u2014 X hanya terlihat hebat karena return nominalnya. Aturan praktis: untuk dana terdiversifikasi vs pasar, Sharpe cukup; untuk strategi asimetris (options overlay, hedge fund), Sortino + max drawdown wajib; untuk manajer aktif vs benchmark, IR adalah ukuran utama dengan ambang \u201Cbagus\u201D sekitar 0,5.",
        "Alpha Jensen (dari regresi CAPM) punya jebakan sendiri: alpha positif bisa murni artefak benchmark yang salah \u2014 regresikan dana small-cap value terhadap IHSG (yang large-cap dominated) dan \u201Calpha\u201D-nya muncul dari premi size/value yang tidak dimodelkan, bukan dari skill. Obatnya: multi-factor alpha (Fama-French: pasar, size, value, momentum) \u2014 alpha yang tersisa setelah mengontrol faktor itulah kandidat skill. Praktisi yang serius juga memakai appraisal ratio = alpha / residual σ, dan selalu menanyakan persistensi: alpha 3 tahun tanpa 5 tahun hanyalah cerita.",
        "Benchmark yang jujur untuk konteks Indonesia: dana saham domestik → IHSG atau IDX80 sesuai universe-nya (bukan MSCI World); dana campuran → custom benchmark (mis. 60% IHSG + 40% BINDO index) yang investable dan ditetapkan di muka; dana dengan batasan syariah → ISSI/JII, bukan IHSG. Uji kejujuran benchmark: (1) bisakah manajer mereplikasi benchmark dengan biaya murah? (2) apakah benchmark mencerminkan batasan mandat (syariah, ESG, pajak)? (3) siapa yang memilihnya \u2014 manajer atau pemilik dana? Benchmark yang dipilih manajer setelah periode berjalan adalah kostum, bukan cermin.",
      ],
      formula: String.raw`\text{Sharpe}=\frac{R_p-R_f}{\sigma_p}\quad \text{IR}=\frac{\alpha_p}{\sigma(\alpha_p)}`,
      formulaNote: "Sharpe: excess return per unit TOTAL risiko (σ_p). IR (information ratio): alpha vs benchmark per unit tracking error σ(α_p) \u2014 ukuran konsistensi manajer aktif; 0,5 sudah bagus, 1,0 luar biasa. Keduanya memakai R_f = risk-free rate (mis. yield SBN 1 tahun). Jebakan: Sharpe menyanjung strategi berekor gemuk; IR menyanjung benchmark yang salah.",
      tasks: [],
      reference: "Sharpe untuk diversifikasi; Sortino untuk asimetris; IR untuk manajer aktif (ambang 0,5); alpha multi-faktor untuk skill.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Enam pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "TWR mengukur manajer (bersih dari timing arus kas); MWR/IRR mengukur pengalaman investor; selisihnya = behavior gap.",
        "Atribusi Brinson mengurai excess return menjadi allocation + selection + interaction \u2014 diagnosis sebelum keputusan retain/fire.",
        "Benchmark harus ditetapkan di muka, investable, dan sesuai mandat; peer ranking tanpa konteks = kosmetik.",
        "GIPS: composite penuh, pengungkapan gross/net, verifikasi independen \u2014 anti cherry-picking dan survivorship bias.",
        "Angka return tanpa konteks (metrik, bruto/neto, benchmark, risiko) = pemasaran, bukan bukti.",
      ],
      next: { label: "C6 \u2014 Behavioral Finance", href: "/v2/learn/pm-c6-behavioral" },
      quiz: [
        {
          q: "Strategi menjual opsi rutin: Sharpe 1,8 tetapi 2 tahun dari 10 rugi besar. Ukuran yang paling jujur?",
          options: [
            { text: "Sharpe \u2014 sudah standar industri", why: "Salah: Sharpe memakai total σ yang tidak menangkap ekor kiri; strategi ini terlihat bagus justru karena risikonya tersembunyi." },
            { text: "Sortino + max drawdown", why: "Tepat: downside deviation menangkap asimetri; max drawdown menunjukkan seberapa dalam lubangnya.", correct: true },
            { text: "Treynor", why: "Salah: Treynor memakai beta \u2014 tidak relevan untuk risiko ekor strategi opsi." },
            { text: "Return nominal saja", why: "Salah: return tanpa risiko = pemasaran, bukan evaluasi." },
          ],
        },
        {
          q: "Dana small-cap value di-regresi ke IHSG menghasilkan alpha +4%. Kesimpulan yang tepat?",
          options: [
            { text: "Skill terbukti \u2014 alpha positif", why: "Salah: alpha bisa artefak benchmark yang salah (premi size/value tidak dimodelkan). Uji dengan multi-factor alpha dulu." },
            { text: "Curigai benchmark salah \u2014 uji ulang dengan faktor size/value", why: "Tepat: IHSG large-cap dominated; alpha semu dari premi faktor bukan skill.", correct: true },
            { text: "Ganti benchmark ke yang memberi alpha lebih besar", why: "Salah: itu cherry-picking benchmark \u2014 kebalikan dari evaluasi jujur." },
            { text: "Abaikan \u2014 alpha tidak pernah berguna", why: "Salah: alpha multi-faktor yang persisten adalah kandidat skill terbaik yang kita punya." },
          ],
        },
        {
          q: "Dana +40% lalu \u221230%. Berapa TWR dua tahun?",
          options: [
            { text: "+10% \u2014 rata-rata keduanya", why: "Salah: return multi-periode dikalikan (geometric linking), bukan dirata-rata." },
            { text: "\u22122%", why: "Tepat: 1,4 × 0,7 − 1 = −2%. Volatilitas adalah \u2018pajak\u2019 return.", correct: true },
            { text: "+5%", why: "Salah hitung \u2014 cek lagi perkaliannya." },
            { text: "\u221230% \u2014 yang terakhir yang penting", why: "Salah: TWR menggabungkan semua sub-periode, bukan hanya yang terakhir." },
          ],
        },
        {
          q: "Allocation positif tetapi selection negatif secara konsisten. Artinya?",
          options: [
            { text: "Stock picker hebat", why: "Salah: selection negatif berarti pilihan sahamnya kalah dari sektornya." },
            { text: "Tukang tebak sektor \u2014 fee aktif tidak layak", why: "Tepat: skill-nya di bobot sektor (yang bisa direplikasi murah), bukan di pilih saham.", correct: true },
            { text: "Manajer pasif", why: "Salah: manajer pasif tidak menghasilkan allocation positif yang konsisten." },
            { text: "Murni beruntung", why: "Salah: pola konsisten = skill (di alokasi), bukan luck." },
          ],
        },
        {
          q: "Iklan: \u2018manajer return 25%!\u2019 (satu portofolio terbaik dari 20). Sikap?",
          options: [
            { text: "Percaya \u2014 angkanya fakta", why: "Salah: fakta yang dipilih-pilih (cherry-picking) menyesatkan." },
            { text: "Tolak sampai ada composite GIPS semua portofolio", why: "Tepat: tanya composite, bruto/neto, benchmark, dan verifikasi.", correct: true },
            { text: "Percaya jika logonya meyakinkan", why: "Salah: logo bukan verifikasi independen." },
            { text: "Minta portofolio terbaik lainnya", why: "Salah: itu justru memperdalam cherry-picking." },
          ],
        },
        {
          q: "TWR \u22122%, MWR \u221220%. Apa behavior gap-nya dan tindakan untuk investor?",
          options: [
            { text: "18 poin \u2014 manajer buruk, ganti manajer", why: "Salah sasaran: manajer \u2018hanya\u2019 \u22122%; masalahnya timing setoran investor." },
            { text: "18 poin \u2014 investor FOMO; solusi: DCA otomatis + IPS + jangan sering cek", why: "Tepat: gap murni dari FOMO 400 di puncak. Musuh terbesar adalah diri sendiri.", correct: true },
            { text: "Tidak ada gap \u2014 keduanya sama", why: "Salah: \u22122% vs \u221220% jelas berbeda; itulah inti lesson ini." },
            { text: "Manajer hebat \u2014 pertahankan", why: "Salah fokus: manajernya biasa saja (\u22122%); yang perlu diperbaiki adalah perilaku investor." },
          ],
        },
      ],
    },
  ],
};
