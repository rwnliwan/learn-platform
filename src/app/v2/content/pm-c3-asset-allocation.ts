import type { V2Lesson } from "../lib/types";

// Efficient frontier: SAA di kurva, tilt TAA, LDI di sumbu berbeda.
const FRONTIER_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Efficient frontier dengan titik A tidak efisien di bawah kurva, titik C dan B di kurva, tilt TAA, dan catatan LDI.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/><line x1="60" y1="20" x2="60" y2="220"/><line x1="148" y1="20" x2="148" y2="220"/><line x1="236" y1="20" x2="236" y2="220"/><line x1="324" y1="20" x2="324" y2="220"/><line x1="412" y1="20" x2="412" y2="220"/><line x1="500" y1="20" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">8%</text><text x="54" y="74">7%</text><text x="54" y="124">6%</text><text x="54" y="174">5%</text><text x="54" y="224">4%</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">6%</text><text x="148" y="240">8%</text><text x="236" y="240">10%</text><text x="324" y="240">12%</text><text x="412" y="240">14%</text><text x="500" y="240">16%</text></g>
<polyline points="100,190 160,140 236,95 300,80 368,70 430,60 500,52" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="236" cy="120" r="4.5" fill="var(--c2)"/>
<circle cx="236" cy="95" r="4.5" fill="var(--c1)"/>
<circle cx="368" cy="70" r="4.5" fill="var(--c1)"/>
<g font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="236" y="142" fill="var(--chart-text)">A (6%, 10%) tidak efisien</text><text x="236" y="80" fill="var(--chart-text)">C (6,5%, 10%)</text></g>
<text x="368" y="52" font-size="10" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">B: kandidat SAA (7%, 13%)</text>
<line x1="392" y1="78" x2="408" y2="64" stroke="var(--text)" stroke-width="1.5"/>
<polygon points="408,64 401,66 405,71" fill="var(--text)"/>
<text x="414" y="58" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">tilt TAA ±5–10%</text>
<rect x="340" y="190" width="165" height="44" rx="6" fill="var(--c3)" opacity="0.12" stroke="var(--c3)" stroke-width="1.5"/>
<text x="422" y="208" font-size="10" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">LDI: sumbu berbeda</text>
<text x="422" y="222" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">optimasi surplus, bukan E(R)/vol</text>
<text x="150" y="205" font-size="9.5" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">area bawah = tidak efisien</text>
<text x="14" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 14 120)">expected return</text>
</svg>`;

export const pmc3: V2Lesson = {
  slug: "pm-c3-asset-allocation",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C3 — Asset Allocation: SAA, TAA & LDI",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-brinson",
      eyebrow: "Langkah 1 · Cerita",
      title: "90% return dari satu keputusan",
      prose: [
        "Brinson, Hood & Beebower (1986): studi legendaris yang menemukan lebih dari 90% variasi return dana pensiun dijelaskan oleh alokasi aset \u2014 bukan stock picking, bukan market timing.",
        "Twist-nya: industri reksadana menghabiskan miliaran untuk stock picking (yang menjelaskan kurang dari 10%), sementara keputusan alokasi \u2014 saham vs obligasi vs kas \u2014 sering dibuat asal-asalan. Delapan puluh persen energi untuk sepuluh persen hasil.",
        "Lesson ini memfokuskan energimu ke yang paling menentukan: strategic asset allocation (SAA) sebagai fondasi, tactical asset allocation (TAA) sebagai penyesuaian disiplin, dan rebalancing sebagai contrarian otomatis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CStock picking menentukan hasil.\u201D Brinson: alokasi > 90%. Stock picker hebat dengan alokasi buruk kalah dari alokasi benar dengan stock picker biasa-biasa saja. Alokasi dulu, seleksi kemudian.",
      },
      reference: "Urutan energi: SAA >> rebalancing > TAA >> stock picking.",
    },
    {
      id: "saa",
      eyebrow: "Langkah 2 · SAA + chart",
      title: "SAA: keputusan 90%",
      prose: [
        "SAA (strategic asset allocation) adalah policy portfolio jangka panjang, dibangun dari optimisasi mean-variance plus constraints IPS. Rantai yang tidak boleh putus: IPS (tujuan, toleransi risiko, batasan) \u2192 ekspektasi pasar modal (return, risiko, korelasi per kelas aset) \u2192 optimisasi \u2192 SAA. Putus satu, hasilnya asal-asalan.",
        "Efficient frontier adalah himpunan portofolio dengan return maksimal per tingkat risiko. Contoh: A (6%, 10%), B (7%, 13%), C (6,5%, 10%). C mendominasi A (return lebih tinggi, risiko sama) \u2014 A tidak efisien dan harus dibuang. B vs C adalah tradeoff murni. Aturannya: pilih hanya dari frontier, jangan pernah pilih portofolio di dalamnya.",
        "TAA (tactical asset allocation) adalah tilt taktis jangka pendek dari SAA \u2014 misalnya overweight saham 5% saat valuasi murah \u2014 dengan disiplin untuk kembali. Rebalancing mengembalikan portofolio ke SAA (lewat kalender atau tolerance band): jual yang naik (mahal), beli yang turun (murah), otomatis dan tanpa emosi.",
        "Cara membaca: sumbu X = volatilitas, sumbu Y = expected return; kurva = efficient frontier; titik A di bawah kurva = tidak efisien.",
        "Interpretasi: SAA wajib dipilih di atas kurva sesuai IPS (contoh titik B: 7%, 13%) — tidak pernah di dalamnya seperti A (6%, 10%) yang didominasi C; TAA hanyalah tilt kecil ±5–10% di sekitar SAA; sedangkan LDI bermain di sumbu berbeda (surplus), bukan di kurva ini.",
      ],
      figure: {
        svg: FRONTIER_SVG,
        alt: "Efficient frontier dengan titik SAA, tilt TAA, dan catatan LDI.",
        caption: "Efficient frontier: SAA dipilih di kurva sesuai IPS, TAA tilt kecil di sekitarnya, LDI di sumbu surplus.",
      },
      formula: String.raw`\max_w \ w^T\mu - \frac{\lambda}{2}w^T\Sigma w`,
      formulaNote: "w = bobot aset; μ, Σ = expected return & kovarians (dari CME); λ = risk aversion (dari IPS).",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira TAA = bebas menggeser alokasi. TAA terbatas (±5\u201310%), sementara, dan terdokumentasi. Menggeser 60/40 ke 20/80 karena \u201Cfeeling\u201D bukan TAA \u2014 itu market timing emosional dan pelanggaran disiplin.",
      },
      reference: "SAA = kompas (jarang berubah). TAA = kemudi (koreksi kecil).",
    },
    {
      id: "lab-frontier",
      eyebrow: "Langkah 3 · Lab frontier",
      title: "Temukan SAA yang memenuhi IPS",
      prose: [
        "IPS: volatilitas maksimal 12%. CME: saham E(R) 10,5% σ 18%; obligasi 7% σ 6%; korelasi 0,2. Hitung expected return dan volatilitas portofolio 60/40, lalu tentukan apakah ia memenuhi batas IPS.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `er` portofolio 60/40" },
        { id: "t2", text: "Hitung `vol` portofolio 60/40" },
        { id: "t3", text: "Cetak hasil dan verdict IPS" },
      ],
      expected: "er=9.1%  vol=11.5%  IPS_OK=True",
      hints: [
        "er = w*ER_S + (1-w)*ER_B.",
        "var = w²·σs² + (1−w)²·σb² + 2·w·(1−w)·ρ·σs·σb, lalu akarkan.",
        "IPS_OK = vol <= 0.12",
      ],
      code: {
        starter: `import math\nER_S, SIG_S = 0.105, 0.18\nER_B, SIG_B = 0.07, 0.06\nRHO = 0.2\nw = 0.6  # bobot saham\n\n# TULIS KODEMU\ner = \nvar = \nvol = math.sqrt(var)\nips_ok = \n\nprint(f"er={er:.1%}  vol={vol:.1%}  IPS_OK={ips_ok}")`,
        lockLines: 4,
        solution: `import math\nER_S, SIG_S = 0.105, 0.18\nER_B, SIG_B = 0.07, 0.06\nRHO = 0.2\nw = 0.6  # bobot saham\n\n# TULIS KODEMU\ner = w*ER_S + (1-w)*ER_B\nvar = w**2*SIG_S**2 + (1-w)**2*SIG_B**2 + 2*w*(1-w)*RHO*SIG_S*SIG_B\nvol = math.sqrt(var)\nips_ok = vol <= 0.12\n\nprint(f"er={er:.1%}  vol={vol:.1%}  IPS_OK={ips_ok}")`,
        checks: [
          { kind: "equal", task: "t1", name: "er", value: 0.091, tol: 1e-9, label: "`er` = 0.091", msg: "0,6\u00D70,105 + 0,4\u00D70,07 = 0,091." },
          { kind: "equal", task: "t2", name: "vol", value: 0.11523, tol: 0.002, label: "`vol` ≈ 0.115", msg: "Akar dari 0,0117 + 0,0006 + 0,0010 ≈ 11,5%." },
          { kind: "equal", task: "t3", name: "ips_ok", value: true, label: "`ips_ok` = True", msg: "11,5% < 12% \u2192 memenuhi batas IPS." },
          { kind: "stdout_matches", task: "t3", pattern: "er=9\\.1%\\s+vol=11\\.5%\\s+IPS_OK=True", label: "`print` menampilkan hasil + verdict", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "60/40: E(R) 9,1%, vol 11,5% \u2014 lolos batas vol 12%.",
    },
    {
      id: "ldi",
      eyebrow: "Langkah 4 · LDI",
      title: "Investasi untuk membayar janji",
      prose: [
        "LDI (liability-driven investing): tujuannya funded ratio yang stabil dan naik, bukan return absolut. Caranya surplus optimization \u2014 mengoptimasi surplus (aset − liabilitas) \u2014 dengan dua portfolio: hedge portfolio (obligasi long-duration yang cocok dengan durasi liabilitas) dan growth portfolio (untuk menutup defisit). Glide path: makin funded, makin besar porsi hedge (de-risking otomatis).",
        "Contoh: dana defisit 80% (aset Rp800 miliar, liabilitas Rp1 triliun, durasi liabilitas 15). Hedge 50% (durasi 15) + growth 50% (durasi ~2) \u2192 durasi aset = 8,5. Suku bunga turun 1%: liabilitas +15%, aset +8,5% \u2192 funded menjadi 75%. Tanpa hedge sama sekali, funded jatuh ke 71%. Hedge penuh (durasi aset = 15) \u2192 funded tetap 80%.",
        "Trade-off-nya: makin besar hedge, makin stabil funded ratio \u2014 tetapi makin kecil growth untuk menutup defisit. LDI adalah asuransi funded ratio, bukan mesin return.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `funded_tanpa` (tanpa hedge, w=0)" },
        { id: "t2", text: "Hitung `funded_dengan` (dengan hedge, w=0,5)" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "funded_tanpa=71.0%  funded_dengan=75.5%",
      hints: [
        "aset2 = ASET*(1 − d_aset*D_RATE); liab2 = LIAB*(1 − D_LIAB*D_RATE).",
        "d_aset = w*D_HEDGE + (1−w)*2.",
        "funded = aset2 / liab2",
      ],
      code: {
        starter: `# LDI: funded ratio dengan vs tanpa hedge (Rp M)\nASET, LIAB = 800, 1000\nD_LIAB = 15\nD_HEDGE = 15\nD_RATE = -0.01  # yield turun 1%\n\ndef funded(w):\n    d_aset = w*D_HEDGE + (1-w)*2  # growth durasi ~2\n    aset2 = ASET*(1 - d_aset*D_RATE)\n    liab2 = LIAB*(1 - D_LIAB*D_RATE)\n    return aset2/liab2\n\n# TULIS KODEMU\nfunded_tanpa = \nfunded_dengan = \n\nprint(f"funded_tanpa={funded_tanpa:.1%}  funded_dengan={funded_dengan:.1%}")`,
        lockLines: 11,
        solution: `# LDI: funded ratio dengan vs tanpa hedge (Rp M)\nASET, LIAB = 800, 1000\nD_LIAB = 15\nD_HEDGE = 15\nD_RATE = -0.01  # yield turun 1%\n\ndef funded(w):\n    d_aset = w*D_HEDGE + (1-w)*2  # growth durasi ~2\n    aset2 = ASET*(1 - d_aset*D_RATE)\n    liab2 = LIAB*(1 - D_LIAB*D_RATE)\n    return aset2/liab2\n\n# TULIS KODEMU\nfunded_tanpa = funded(0)\nfunded_dengan = funded(0.5)\n\nprint(f"funded_tanpa={funded_tanpa:.1%}  funded_dengan={funded_dengan:.1%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "funded_tanpa", value: 0.7096, tol: 0.002, label: "`funded_tanpa` ≈ 0.71", msg: "Aset durasi 2: +2% vs liabilitas +15% \u2192 816/1150 ≈ 71%." },
          { kind: "equal", task: "t2", name: "funded_dengan", value: 0.7548, tol: 0.002, label: "`funded_dengan` ≈ 0.755", msg: "Aset durasi 8,5: +8,5% vs liabilitas +15% \u2192 868/1150 ≈ 75,5%." },
          { kind: "stdout_matches", task: "t3", pattern: "funded_tanpa=71\\.0%\\s+funded_dengan=75\\.5%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mismatch durasi adalah risiko funded ratio: saat suku bunga turun, liabilitas (durasi 15) meledak +15% sementara aset pendek tidak ikut. Tanpa hedge, funded 80% jatuh ke ~71% hanya karena pergerakan rate.",
      },
      reference: "Hedge = stabilkan funded ratio; growth = tutup defisit.",
    },
    {
      id: "faktor",
      eyebrow: "Langkah 5 · Alokasi faktor",
      title: "Diversifikasi label vs diversifikasi risiko",
      prose: [
        "Alokasi faktor melihat premi risiko (equity, duration, credit, commodity), bukan label aset. Masalahnya: 60/40 saham/obligasi terlihat seimbang, tetapi sekitar 88% risikonya berasal dari saham \u2014 karena saham jauh lebih volatile. Itu taruhan ekuitas berkedok diversifikasi; 2008 membuktikannya dengan return \u221222%.",
        "Risk parity menyamakan kontribusi risiko tiap aset (bobot berbanding terbalik dengan volatilitas, mis. ~25/75) \u2014 2008: sekitar \u22128%. Bukan return lebih tinggi, melainkan risiko yang lebih jujur. Catatan: versi penuhnya butuh leverage dan menjadi bond-heavy saat suku bunga naik \u2014 bukan untuk semua orang, tetapi konsepnya wajib dipahami.",
        "Uji diversifikasimu: saat krisis, apakah semua aset jatuh bersamaan? Jika ya, itu diversifikasi semu. Lima puluh saham teknologi bukan diversifikasi \u2014 itu konsentrasi.",
      ],
      note: {
        title: "Intuisi: alokasi adalah soal komitmen, bukan soal pintar",
        body: "Tiga heuristik praktisi yang jarang tertulis di textbook. Pertama, alokasi terbaik adalah yang bisa dipertahankan klien saat krisis — portofolio “optimal” 80/20 yang dijual panik di dasar jauh lebih buruk dari 60/40 yang dipegang sampai akhir. Uji kejujurannya: tunjukkan skenario −30% ke klien SEBELUM ia tanda tangan; kalau ia pucat, turunkan ekuitasnya. Kedua, bedakan keputusan struktural dari keputusan siklikal: SAA diubah karena hidup klien berubah (pensiun, warisan), bukan karena berita berubah — siapa pun yang mengubah SAA tiap ada headline sebenarnya tidak punya SAA. Ketiga, biaya alokasi yang paling mahal bukan fee manajer, melainkan pajak dan perilaku: rebalancing yang memicu realisasi gain tiap kuartal di akun kena pajak bisa menghabiskan 1–2% per tahun — lebih besar dari fee reksa dana. Rebalance dengan arus kas baru dulu; jual hanya bila band terlampaui jauh. Keempat, waspadai portofolio model yang diganti tiap ada produk baru \u2014 SAA yang sehat itu membosankan: ia tidak berubah karena ada ETF tematik baru. Kelima, untuk dana keluarga, tulis pernyataan alokasi satu halaman yang ditandatangani semua pengambil keputusan; konflik tersembunyi antar ahli waris lebih merusak daripada pilihan aset yang salah.",
      },
      tasks: [],
      quiz: [
        {
          q: "Studi Brinson: berapa persen variasi return yang dijelaskan alokasi aset?",
          options: [
            { text: "Kurang dari 10%", why: "Itu porsi stock picking + market timing, bukan alokasi." },
            { text: "Lebih dari 90%", why: "Tepat. Implikasinya: fokuskan energi ke SAA, IPS, CME, dan rebalancing.", correct: true },
            { text: "Sekitar 50%", why: "Terlalu rendah \u2014 temuannya justru di atas 90%." },
            { text: "Tidak ada", why: "Salah: alokasi adalah penjelas dominan variasi return." },
          ],
        },
        {
          q: "Portofolio 60/40 saham/obligasi. Berapa kontribusi risiko dari saham?",
          options: [
            { text: "60% \u2014 sesuai bobotnya", why: "Salah: risiko tidak mengikuti bobot nominal karena volatilitasnya beda jauh." },
            { text: "\u224888% \u2014 taruhan ekuitas berkedok diversifikasi", why: "Tepat: saham (σ 18%) mendominasi risiko vs obligasi (σ 6%). Ukur kontribusi risiko, bukan bobot.", correct: true },
            { text: "40%", why: "Salah arah: itu bobot obligasi, bukan kontribusi risiko saham." },
            { text: "50% \u2014 seimbang", why: "Salah: \u2018seimbang\u2019 hanya di label. Risk parity-lah yang menyamakan kontribusi risiko." },
          ],
        },
      ],
      reference: "Alokasi tradisional = diet by warna makanan; alokasi faktor = diet by nutrisi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Lima keputusan alokasi",
      prose: [
        "Peta keputusan lesson ini. (1) Menetapkan kebijakan investasi \u2192 SAA via optimisasi + constraints IPS: 90% penentu hasil, bukan ikut-ikutan. (2) Valuasi ekstrem (mis. P/E ±1σ dari rata-rata) \u2192 TAA tilt ±5% dengan disiplin kembali ke SAA. (3) Ada liabilitas pasti (pensiun, asuransi) \u2192 LDI: hedge portfolio + growth portfolio, funded ratio sebagai objective. (4) \u2018Diversifikasi\u2019 tetapi hancur saat krisis \u2192 cek kontribusi risiko, pertimbangkan alokasi berbasis faktor. (5) Setiap portofolio \u2192 SAA dari IPS, TAA terbatas, rebalance disiplin.",
        "Aturan 10 detik: alokasi = 90% penentu. SAA + TAA disiplin. Rebalancing mekanis. Ukur risiko, bukan bobot.",
      ],
      tasks: [],
      reference: "SAA direview tiap 3\u20135 tahun \u2014 bukan karena berita.",
    },
    {
      id: "minicase-drift",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Drift: risiko diam-diam +30%",
      prose: [
        "Dana pensiun return 8% per tahun. Atribusi Brinson: alokasi menjelaskan 92% variasi return. Tetapi tim menghabiskan 80% waktunya untuk stock picking \u2014 dan tidak pernah me-rebalance, sehingga portofolio drift dari 60/40 ke 75/25.",
        "Hitung risikonya: volatilitas naik dari sekitar 11,5% ke sekitar 14,8% \u2014 naik ~30% \u2014 tanpa keputusan sadar, tanpa persetujuan komite, dan tanpa kompensasi return yang sepadan. Drift adalah risiko diam-diam. Inilah mengapa rebalancing adalah manajemen risiko, bukan optimasi.",
        "Rancang policy rebalancing: (1) band ±5%, cek kuartalan; (2) rebalance dulu dengan arus kas baru \u2014 top-up ke aset yang kurang, tanpa jual, tanpa pajak; (3) laporkan drift ke komite tiap kuartal; (4) review SAA tiap 3 tahun atau saat life event/perubahan CME material. Tertulis, terukur, terjadwal. Dan realokasi energi tim: 60% ke SAA/IPS/CME + rebalancing, 30% ke manajer dan biaya, 10% ke stock picking.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u201CRebalancing = market timing.\u201D Kebalikannya: rebalancing kembali ke target (anti-timing); market timing meninggalkan target karena ramalan. Rebalancing = disiplin; timing = spekulasi.",
      },
      reference: "Contoh rebalance: 60/40 Rp100jt \u2192 saham +30%, obligasi +5% \u2192 jadi 65/35 \u2192 jual Rp6jt saham, beli Rp6jt obligasi.",
    },

    {
      id: "dynamic-allocation",
      eyebrow: "Langkah 8 · Alokasi dinamis tingkat lanjut",
      title: "SAA vs TAA vs dinamis: siapa memutuskan apa",
      prose: [
        "Tiga lapisan keputusan sering dicampuradukkan. SAA adalah policy jangka panjang dari IPS \u2014 diubah hanya bila hidup klien atau CME struktural berubah (tinjau tiap 3\u20135 tahun). TAA adalah tilt disiplin ±5\u201310% dari SAA berdasarkan sinyal valuasi terukur, dengan tanggal kembali yang ditulis di muka. Dynamic asset allocation melangkah lebih jauh: bobot berubah otomatis mengikuti aturan \u2014 misalnya target-volatility (turunkan ekuitas saat volatilitas realized melonjak) atau CPPI (lantai proteksi modal). Bedanya dengan market timing: aturannya mekanis, tertulis sebelum krisis, dan tidak butuh ramalan.",
        "Contoh target-volatility: target vol portofolio 10%. Saat vol realized pasar 15%, bobot ekuitas diskalakan ke 10/15 ≈ 67% dari normal; saat vol 25% (krisis), ke 40%. Hasilnya: drawdown lebih dangkal dengan mengorbankan sebagian upside saat rebound tajam \u2014 cocok untuk klien yang kemauannya moderat tetapi kemampuannya agresif. CPPI lebih ekstrem: tetapkan lantai Rp900 juta dari Rp1 miliar; cushion = 100 juta; dengan multiplier 4, eksposur ekuitas = Rp400 juta. Jika pasar jatuh dan cushion menyusut, eksposur dipangkas otomatis \u2014 proteksi yang mahal saat pasar whipsaw (jual di bawah, beli di atas berulang kali).",
        "Aturan rebalancing yang konkret untuk akun kena pajak Indonesia: (1) pakai arus kas baru dulu \u2014 top-up gaji/bonus ke kelas aset yang defisit, tanpa menjual, tanpa pajak; (2) tolerance band ±5 poin persen, dicek kuartalan \u2014 band mencegah over-trading dibanding kalender bulanan; (3) jual hanya bila band terlampaui DAN sudah lewat 1 tahun holding bila memungkinkan, untuk menunda realisasi; (4) Desember: gabungkan rebalance dengan tax-loss harvesting \u2014 jual posisi rugi untuk meng-offset gain dari rebalancing. Rebalancing yang cerdas menambah 0,2\u20130,4% per tahun dari bonus rebalancing (volatility harvesting); rebalancing yang ceroboh menghabiskannya untuk pajak.",
      ],
      tasks: [],
      reference: "SAA = hidup klien; TAA = sinyal + tanggal kembali; dinamis = aturan mekanis; rebalance = arus kas dulu, pajak kemudian.",
    },
    {
      id: "home-bias-indonesia",
      eyebrow: "Langkah 9 · Konteks Indonesia",
      title: "Home bias: kapan nasionalisme merugikan portofolio",
      prose: [
        "Investor Indonesia rata-rata menaruh >85% ekuitasnya di saham domestik, padahal Indonesia <2% kapitalisasi pasar global. Inilah home bias \u2014 nyaman secara psikologis (kenal emitennya, baca beritanya), mahal secara finansial: konsentrasi pada satu negara = konsentrasi pada satu siklus komoditas, satu mata uang, satu risiko politik. Periode 2013\u20132015 (taper tantrum + anjloknya komoditas) menghukum bias ini: IHSG dalam USD jatuh jauh lebih dalam daripada indeks global.",
        "SAA yang jujur untuk investor IDR membedakan tiga hal. Pertama, matching mata uang: kebutuhan rupiah jangka pendek (kuliah 3 tahun, DP rumah) WAJIB di aset IDR \u2014 risiko FX untuk horizon pendek adalah risiko yang tidak dibayar. Kedua, untuk horizon 15+ tahun, alokasi ekuitas global 30\u201350% justru menurunkan risiko: korelasi IHSG dengan MSCI World sekitar 0,5\u20130,6, dan depresiasi rupiah jangka panjang menambah return aset USD bila diukur dalam rupiah. Ketiga, hedging FX: lindung nilai mata uang untuk obligasi global (yield 4% bisa habis oleh biaya hedge) tetapi biarkan ekuitas global tidak di-hedge \u2014 volatilitas FX kecil dibanding volatilitas ekuitas, dan depresiasi rupiah cenderung terjadi saat krisis (hedge alami).",
        "Contoh SAA dana pensiun individu Indonesia, 40 tahun, moderat: 35% saham Indonesia (IDX), 25% saham global (USD, unhedged), 25% SBN/ORI (IDR, matching liabilitas rupiah), 10% obligasi global hedged, 5% kas. Alasan tiap baris tertulis: domestik untuk familiaritas dan pajak, global untuk diversifikasi siklus, SBN untuk kepastian rupiah, kas untuk likuiditas. Home bias yang disadari (35%, bukan 85%) adalah pilihan; home bias yang tidak disadari adalah kecelakaan.",
      ],
      tasks: [],
      reference: "IDR jangka pendek = aset IDR; horizon panjang = global 30\u201350% diversifikasi; hedge obligasi, biarkan ekuitas.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Empat pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "SAA adalah policy portfolio jangka panjang dari IPS + CME + optimisasi; ia menjelaskan >90% variasi return.",
        "TAA = tilt taktis ±5\u201310%, sementara, terdokumentasi; tanpa disiplin kembali ia menjadi market timing emosional.",
        "LDI: funded ratio sebagai objective; hedge portfolio menstabilkan, growth portfolio menutup defisit.",
        "60/40 \u2248 88% risiko dari saham \u2014 ukur kontribusi risiko, bukan bobot nominal.",
        "Rebalancing = contrarian otomatis (jual mahal, beli murah); drift yang dibiarkan adalah risiko diam-diam.",
      ],
      next: { label: "C4 \u2014 Portfolio Construction", href: "/v2/learn/pm-c4-portfolio-construction" },
      quiz: [
        {
          q: "Portofolio target-vol 10%. Vol realized melonjak ke 25%. Aturan dinamis yang benar?",
          options: [
            { text: "Naikkan ekuitas \u2014 beli saat murah", why: "Salah: itu discretionary timing, bukan aturan target-vol. Aturan mekanis justru memangkas eksposur." },
            { text: "Skalakan ekuitas ke 10/25 = 40% dari normal", why: "Tepat: target-vol memangkas otomatis saat vol melonjak \u2014 dangkalkan drawdown, tertulis sebelum krisis.", correct: true },
            { text: "Pertahankan \u2014 jangan pernah ubah", why: "Salah: itu SAA murni. Target-vol adalah lapisan dinamis yang memang dirancang merespons vol." },
            { text: "Jual semua ke kas", why: "Salah: itu panik, bukan aturan. Target-vol memangkas proporsional, bukan biner." },
          ],
        },
        {
          q: "Investor IDR, 40 thn, horizon 20 thn, menaruh 90% ekuitas di saham domestik. Masalah utamanya?",
          options: [
            { text: "Tidak ada \u2014 kenal emitennya lebih aman", why: "Salah: familiaritas bukan diversifikasi. 90% domestik = taruhan satu siklus komoditas + satu mata uang." },
            { text: "Home bias: konsentrasi negara dengan korelasi global hanya ~0,5", why: "Tepat: alokasi global 30\u201350% menurunkan risiko justru karena korelasinya tidak sempurna.", correct: true },
            { text: "Pajak lebih tinggi", why: "Bukan masalah utama: PPh final saham domestik justru 0,1% \u2014 masalahnya konsentrasi risiko." },
            { text: "Saham domestik selalu underperform", why: "Salah klaim absolut: masalahnya bukan return rata-rata, melainkan risiko konsentrasi yang tidak dibayar." },
          ],
        },
        {
          q: "Suku bunga turun 1%. Liabilitas berdurasi 15, dana tanpa hedge. Funded 80% menjadi sekitar?",
          options: [
            { text: "Tetap 80%", why: "Salah: itu hanya terjadi jika durasi aset = durasi liabilitas (hedge penuh)." },
            { text: "\u224872% \u2014 liabilitas +15%, aset jauh lebih kecil", why: "Tepat: mismatch durasi membuat funded ratio ambruk saat rate turun. Inilah yang dicegah LDI.", correct: true },
            { text: "90%", why: "Salah arah: rate turun menaikkan PV liabilitas \u2014 funded memburuk, bukan membaik." },
            { text: "100%", why: "Tidak ada mekanisme yang membuat defisit hilang hanya karena rate turun." },
          ],
        },
        {
          q: "Manajer menggeser 60/40 ke 20/80 karena \u201Cfeeling pasar akan jatuh\u201D. Apakah ini TAA valid?",
          options: [
            { text: "Ya \u2014 itu taktis", why: "Salah: feeling bukan sinyal terukur, dan 40 poin bukan deviasi terbatas." },
            { text: "Tidak \u2014 TAA harus terbatas (±5%), sementara, terdokumentasi", why: "Tepat: ini market timing emosional, bukan TAA. TAA butuh sinyal terukur + keyakinan + ekspektasi return di atas biaya.", correct: true },
            { text: "Ya \u2014 asal kembali nanti", why: "Salah: tanpa batas dan dokumentasi, \u2018nanti\u2019 tidak pernah datang." },
            { text: "Tidak \u2014 TAA dilarang total", why: "Salah: TAA boleh, asal disiplin. Yang dilarang adalah tilt liar tanpa aturan." },
          ],
        },
        {
          q: "SAA 60/40 drift ke 75/25 tanpa rebalance. Masalah utamanya?",
          options: [
            { text: "Return lebih tinggi \u2014 bagus", why: "Salah: return ekspektasian naik sedikit, tetapi risiko naik ~30% tanpa kompensasi sepadan." },
            { text: "Risiko naik ~30% diam-diam tanpa keputusan sadar", why: "Tepat: vol 11,5% \u2192 ~14,8% tanpa persetujuan. Rebalancing = manajemen risiko.", correct: true },
            { text: "Pajak lebih rendah", why: "Tidak relevan: drift tidak menurunkan pajak; rebalance yang cerobohlah yang memicu pajak." },
            { text: "Tidak ada masalah \u2014 pasar yang memutuskan", why: "Salah: \u2018pasar yang memutuskan\u2019 = kamu menyerahkan keputusan risiko ke pasar." },
          ],
        },
        {
          q: "Tiga portofolio: A (6%, 10%), B (7%, 13%), C (6,5%, 10%) dalam (return, vol). Mana yang tidak efisien?",
          options: [
            { text: "A \u2014 didominasi C", why: "Tepat: C memberi return lebih tinggi dengan risiko yang sama. Jangan pernah pilih portofolio di dalam frontier.", correct: true },
            { text: "B \u2014 risikonya tertinggi", why: "Salah: B vs C adalah tradeoff yang valid \u2014 B memberi return lebih tinggi dengan risiko lebih tinggi." },
            { text: "C \u2014 return di bawah B", why: "Salah: C efisien \u2014 ia mendominasi A dan menjadi alternatif valid terhadap B." },
            { text: "Semuanya efisien", why: "Salah: A jelas tidak efisien karena didominasi C." },
          ],
        },
      ],
    },
  ],
};
