import type { V2Lesson } from "../lib/types";

// Pohon binomial dua periode: S0=50, u=1,1, d=0,9, r=5%, K=50, pi=0,75.
const BINOM_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Pohon binomial dua periode: S0 50, naik ke 55 atau turun ke 45, nilai opsi call dihitung mundur menjadi 5,36.">
<g stroke="var(--chart-grid)" stroke-width="1.5"><line x1="85" y1="132.7" x2="255" y2="94.1"/><line x1="85" y1="132.7" x2="255" y2="171.4"/><line x1="285" y1="94.1" x2="455" y2="51.6"/><line x1="285" y1="94.1" x2="455" y2="136.6"/><line x1="285" y1="171.4" x2="455" y2="136.6"/><line x1="285" y1="171.4" x2="455" y2="206.1"/></g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="70" y="242">t=0</text><text x="270" y="242">t=1</text><text x="470" y="242">t=2</text></g>
<g fill="var(--c1)" opacity="0.18" stroke="var(--c1)" stroke-width="1.5"><circle cx="70" cy="132.7" r="16"/><circle cx="270" cy="94.1" r="16"/><circle cx="270" cy="171.4" r="16"/><circle cx="470" cy="51.6" r="16"/><circle cx="470" cy="136.6" r="16"/><circle cx="470" cy="206.1" r="16"/></g>
<g font-size="12" font-weight="600" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle"><text x="70" y="137">50</text><text x="270" y="98.1">55</text><text x="270" y="175.4">45</text><text x="470" y="55.6">60,5</text><text x="470" y="140.6">49,5</text><text x="470" y="210.1">40,5</text></g>
<g font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="70" y="162">C=5,36</text><text x="270" y="118">C=7,5</text><text x="270" y="195">C=0</text><text x="470" y="75">C=10,5</text><text x="470" y="160">C=0</text><text x="470" y="230">C=0</text></g>
<text x="170" y="40" font-size="10" fill="var(--text)" font-family="var(--font-ui)">π=0,75 (alat hitung, bukan ramalan)</text>
</svg>`;

export const pmb6: V2Lesson = {
  slug: "pm-b6-valuasi-derivatif",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B6 Valuasi Derivatif: Binomial & Black-Scholes",
  estMinutes: 55,
  steps: [
    {
      id: "binomial",
      eyebrow: "Langkah 1 · Binomial + chart",
      title: "Formula Rp nobelis — dan yang kolaps karenanya",
      prose: [
        "1973: Black, Scholes & Merton menerbitkan formula harga opsi. 1997: Nobel Ekonomi. Di antaranya: LTCM (didirikan Scholes & Merton) kolaps 1998 — rugi USD 4,6 miliar. Twist-nya: formula benar secara matematis — tetapi asumsinya (volatilitas konstan, likuiditas selalu ada, return normal) salah di dunia nyata. LTCM bertaruh dengan leverage 25:1 pada asumsi itu. Model hebat + asumsi rapuh + leverage = bencana.",
        "Binomial 1-periode: saham naik ke S_u atau turun ke S_d. Replikasi: \u0394 saham + pinjaman = payoff opsi di kedua state \u2192 harga opsi = biaya replikasi. Risk-neutral probability: \u03c0 = [(1+r) \u2212 d]/(u \u2212 d); harga = [\u03c0\u00d7C_u + (1\u2212\u03c0)\u00d7C_d]/(1+r). Hedge ratio \u0394 = (C_u \u2212 C_d)/(S_u \u2212 S_d) — inilah delta.",
        "\u03c0 risk-neutral \u2260 probabilitas aktual. Ia alat hitung replikasi, bukan ramalan — \u201cprobabilitas risk-neutral 70% \u2192 saham 70% akan naik\u201d adalah SALAH.",
        "Cara membaca: pohon dibaca kiri ke kanan — tiap node menunjukkan harga saham (S) dan nilai opsi call (C) di titik itu, dengan probabilitas risk-neutral π = 0,75.",
        "Interpretasi: nilai opsi dihitung mundur dari payoff terminal — Cuu=10,5 didiskon menjadi 7,5 di node atas, lalu menjadi C0=5,36; dan π hanyalah alat hitung replikasi, bukan ramalan arah harga.",
      ],
      figure: {
        svg: BINOM_SVG,
        alt: "Pohon binomial dua periode dengan nilai opsi di tiap node, dihitung mundur menjadi 5,36.",
        caption: "Pohon binomial dua periode (S0=50, u=1,1, d=0,9, r=5%, π=0,75): nilai opsi dihitung mundur dari payoff terminal menjadi C0=5,36.",
      },
      formula: String.raw`C = \frac{\pi C_u + (1-\pi) C_d}{1+r} \quad;\quad \pi = \frac{(1+r)-d}{u-d}`,
      formulaNote: "C = harga call; π = probabilitas risk-neutral — alat hitung replikasi, BUKAN ramalan (probabilitas aktual tidak dipakai); u/d = faktor naik/turun; r = risk-free. Contoh: π=0,75, C=(0,75×5)/1,05 = 3,57. Jangan lupa diskonto (1+r) — harga = PV ekspektasi.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira \u03c0 risk-neutral = probabilitas sebenarnya harga naik. Probabilitas aktual tidak dipakai sama sekali dalam pricing — hanya replikasi.",
      },
      reference: "Harga opsi = biaya replikasi. \u03c0 \u2260 ramalan. \u0394 = hedge ratio.",
    },
    {
      id: "binomial-code",
      eyebrow: "Langkah 2 · Hitung Binomial",
      title: "Replikasi 1-periode",
      prose: [
        "S0 = 50, u = 1,1, d = 0,9, r = 5%, K = 50 (call). \u03c0 = (1,05\u22120,9)/(1,1\u22120,9) = 0,75. Su = 55 \u2192 Cu = 5; Sd = 45 \u2192 Cd = 0. C = (0,75\u00d75)/1,05 = 3,57.",
        "Delta = (5\u22120)/(55\u221245) = 0,5: replikasi = beli 0,5 saham + pinjam kas. Jual 200 call \u2192 hedge = beli 100 saham (200 \u00d7 0,5), rebalance saat delta berubah (gamma).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p` risk-neutral dan payoff `cu`, `cd`" },
        { id: "t2", text: "Hitung harga call `c`, cetak p dan c 2 desimal" },
      ],
      expected: "p=0.75  c=3.57",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa mendiskon ekspektasi risk-neutral dengan (1+r). Harga = PV ekspektasi — bukan ekspektasi mentah.",
      },
      hints: [
        "p = ((1+r) \u2212 d)/(u \u2212 d).",
        "cu = max(u\u00d7s0 \u2212 k, 0); cd = max(d\u00d7s0 \u2212 k, 0).",
        "c = (p\u00d7cu + (1\u2212p)\u00d7cd)/(1+r).",
      ],
      code: {
        starter: `s0, u, d, r, k = 50, 1.1, 0.9, 0.05, 50\n\n# TULIS KODEMU\np = \ncu = \ncd = \nc = \n\nprint(f"p={p:.2f}  c={c:.2f}")`,
        lockLines: 1,
        solution: `s0, u, d, r, k = 50, 1.1, 0.9, 0.05, 50\n\n# TULIS KODEMU\np = ((1+r) - d)/(u - d)\ncu = max(u*s0 - k, 0)\ncd = max(d*s0 - k, 0)\nc = (p*cu + (1-p)*cd)/(1+r)\n\nprint(f"p={p:.2f}  c={c:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p", value: 0.75, tol: 1e-9, label: "`p` seharusnya 0.75", msg: "(1,05\u22120,9)/(1,1\u22120,9) = 0,75." },
          { kind: "equal", task: "t2", name: "c", value: 3.57, tol: 0.01, label: "`c` sekitar 3.57", msg: "(0,75\u00d75)/1,05 = 3,57. Jangan lupa diskonto (1+r)." },
          { kind: "stdout_matches", task: "t2", pattern: "p=0\\.75\\s+c=3\\.57", label: "`print` menampilkan keduanya", msg: "Format: p=...  c=... ." },
        ],
      },
      reference: "Binomial: harga = PV ekspektasi risk-neutral. Opsi Amerika \u2192 binomial.",
    },
    {
      id: "black-scholes",
      eyebrow: "Langkah 3 · Black-Scholes",
      title: "Lima input, satu misteri",
      prose: [
        "Black-Scholes (Eropa, non-dividen): C = S\u00d7N(d1) \u2212 PV(X)\u00d7N(d2). N(d2) \u2248 probabilitas risk-neutral opsi in-the-money saat expiry. N(d1) = delta (hedge ratio).",
        "Contoh: S=100, X=105, r=5%, \u03c3=30%, T=1. d1 = [ln(100/105)+(0,05+0,045)]/0,30 = 0,154. d2 = 0,154\u22120,30 = \u22120,146. N(d1) = 0,5612, N(d2) = 0,4420. C = 100\u00d70,5612 \u2212 99,88\u00d70,4420 = 11,98.",
        "Lima input, satu misteri: S, K, r, T teramati; hanya \u03c3 (volatilitas) yang harus diestimasi. Seluruh \u201cseni\u201d option pricing = menebak \u03c3 dengan benar. Implied vol = \u03c3 yang membuat harga model = harga pasar.",
      ],
      formula: String.raw`C = S \cdot N(d_1) - PV(X) \cdot N(d_2)`,
      formulaNote: "C = harga call; N(d1) = delta (hedge ratio); N(d2) ≈ probabilitas risk-neutral opsi ITM saat expiry; PV(X) = strike didiskon. Contoh: 100×0,5612 − 99,88×0,4420 = 11,98. σ = satu-satunya input tak teramati — seluruh 'seni' option pricing = menebak σ.",
      tasks: [
        { id: "t1", text: "Hitung `d1`, `d2` (S=100, X=105, r=5%, \u03c3=30%, T=1)" },
        { id: "t2", text: "Hitung harga `call` via N() yang disediakan, cetak ketiganya" },
      ],
      expected: "d1=0.154  d2=-0.146  call=11.98",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai \u03c3 dalam persen (30) bukan desimal (0,30) di d1. Atau lupa d2 = d1 \u2212 \u03c3\u221aT.",
      },
      hints: [
        "d1 = [ln(S/X) + (r + \u03c3\u00b2/2)T] / (\u03c3\u221aT).",
        "d2 = d1 \u2212 \u03c3\u221aT.",
        "call = S\u00d7N(d1) \u2212 X\u00d7e^(­rT)\u00d7N(d2).",
      ],
      code: {
        starter: `import math\ns, x, r, sig, t = 100, 105, 0.05, 0.30, 1\nN = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))\n# TULIS KODEMU\nd1 = \nd2 = \ncall = \n\nprint(f"d1={d1:.3f}  d2={d2:.3f}  call={call:.2f}")`,
        lockLines: 3,
        solution: `import math\ns, x, r, sig, t = 100, 105, 0.05, 0.30, 1\nN = lambda z: 0.5*(1+math.erf(z/math.sqrt(2)))\n# TULIS KODEMU\nd1 = (math.log(s/x) + (r + sig**2/2)*t) / (sig*t**0.5)\nd2 = d1 - sig*t**0.5\ncall = s*N(d1) - x*math.exp(-r*t)*N(d2)\n\nprint(f"d1={d1:.3f}  d2={d2:.3f}  call={call:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "d1", value: 0.154, tol: 0.002, label: "`d1` sekitar 0.154", msg: "[ln(100/105)+0,095]/0,30 = 0,154. \u03c3 dalam desimal." },
          { kind: "equal", task: "t2", name: "call", value: 11.98, tol: 0.05, label: "`call` sekitar 11.98", msg: "100\u00d70,5612 \u2212 99,88\u00d70,4420 = 11,98." },
          { kind: "stdout_matches", task: "t2", pattern: "d1=0\\.154\\s+d2=-0\\.146\\s+call=11\\.98", label: "`print` menampilkan ketiganya", msg: "Format: d1=...  d2=...  call=... ." },
        ],
      },
      reference: "BS = binomial dengan langkah tak hingga. \u03c3 = satu-satunya input tak terlihat.",
    },
    {
      id: "asumsi-bs",
      eyebrow: "Langkah 4 · Batas Model",
      title: "Hormati asumsi — atau jadi LTCM",
      prose: [
        "Asumsi BS: volatilitas konstan, trading kontinu, tanpa biaya, return lognormal. Realita: vol smile (pasar tidak percaya vol konstan — put OTM diberi implied vol lebih tinggi = pasar membayar mahal untuk proteksi crash), crash, likuiditas kering.",
        "Naik \u03c3 \u2192 naik harga opsi (call & put): ketidakpastian = mahal (vega positif). Mendekati expiry \u2192 time value habis (theta: waktu = musuh pembeli, teman penjual). Greeks = panel instrumen trader: delta (arah), gamma (perubahan delta), theta (waktu), vega (vol).",
        "Opsi Amerika bisa dieksekusi kapan saja = lebih berharga (atau sama). Binomial menangani early exercise alami (max di tiap node); BS standar tidak.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model risk = kerugian karena model salah (asumsi, implementasi, data). Untuk posisi besar: dua model independen, backtest harga model vs pasar, cadangan model risk di modal.",
      },
      quiz: [
        {
          q: "N(d2) dalam Black-Scholes \u2248 ?",
          options: [
            { text: "Delta", why: "Salah: delta = N(d1)." },
            { text: "Probabilitas risk-neutral opsi ITM saat expiry", why: "Benar: N(d2) = P(S_T > X) risk-neutral. N(d1) = delta (hedge ratio).", correct: true },
            { text: "Volatilitas", why: "Salah: volatilitas = \u03c3, input model." },
            { text: "Bunga", why: "Salah: bunga = r, input teramati." },
          ],
        },
        {
          q: "\u03c3 naik 30%\u219250%. Harga call?",
          options: [
            { text: "Turun", why: "Salah: vega positif — ketidakpastian = mahal." },
            { text: "Naik (vega positif)", why: "Benar: call & put naik saat \u03c3 naik. Inilah kenapa krisis = opsi mahal.", correct: true },
            { text: "Tetap", why: "Salah: \u03c3 adalah input harga yang sensitif." },
            { text: "Nol", why: "Salah: harga tidak menjadi nol." },
          ],
        },
      ],
      reference: "BS = bahasa pasar (implied vol); asumsi selalu dilanggar. Greeks = panel instrumen.",
    },
    {
      id: "swap-valuasi",
      eyebrow: "Langkah 5 · Valuasi Swap",
      title: "Swap = selisih dua obligasi",
      prose: [
        "Swap terima-tetap 6%, notional Rp10M, sisa 1 tahun. PV kaki tetap = 600rb/1,025 + 10,6M/1,055 = Rp10.632.759. Kaki mengambang \u2248 Rp10.000.000 (kaki floating selalu \u2248 par saat reset).",
        "Nilai swap (terima tetap) = 10.632.759 \u2212 10.000.000 = +Rp632.759. Positif = menguntungkan penerima tetap — karena suku bunga turun sejak swap dibuat (kaki tetap makin berharga).",
        "Aturan arah: bayar-fixed + rate pasar turun \u2192 MTM negatif (terkunci bayar mahal) = liabilitas + collateral.",
      ],
      formula: String.raw`V_{\text{swap}} = PV(\text{floating}) - PV(\text{fixed})`,
      formulaNote: "V_swap = nilai swap bagi penerima tetap; trik praktisi: kaki floating ≈ par (notional) pada tanggal reset — tidak perlu hitung detail. Contoh: 10.632.759 − 10.000.000 = +Rp632.759 (positif = menguntungkan penerima tetap karena rate turun). Bayar-fixed + rate turun → MTM negatif = liabilitas.",
      tasks: [
        { id: "t1", text: "Hitung `v` = PV floating \u2212 PV fixed (PV fixed sudah dihitung)" },
        { id: "t2", text: "Cetak dalam ribuan rupiah 2 desimal" },
      ],
      expected: "v_rb=632.76",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung PV kaki floating dari nol dengan detail. Trik: kaki floating selalu \u2248 par (notional) pada tanggal reset — hemat waktu, ini yang dipakai praktisi.",
      },
      hints: [
        "v = pv_float \u2212 pv_fixed.",
        "Cetak ribuan: bagi 1000.",
        "v = pv_float - pv_fixed",
      ],
      code: {
        starter: `pv_fixed = 600000/1.025 + 10600000/1.055\npv_float = 10000000\n\n# TULIS KODEMU\nv = \n\nprint(f"v_rb={v/1000:.2f}")`,
        lockLines: 2,
        solution: `pv_fixed = 600000/1.025 + 10600000/1.055\npv_float = 10000000\n\n# TULIS KODEMU\nv = pv_float - pv_fixed\n\nprint(f"v_rb={v/1000:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "v", value: 632759, tol: 50, label: "`v` sekitar 632759", msg: "10.632.759 \u2212 10.000.000 = 632.759. Tanda = untuk penerima tetap." },
          { kind: "stdout_matches", task: "t2", pattern: "v_rb=632\\.76", label: "`print` menampilkan ribuan", msg: "Format: v_rb=632.76 (ribuan rupiah)." },
        ],
      },
      reference: "Swap = obligasi tetap \u2212 obligasi mengambang. Floating \u2248 par.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: memakai model opsi tanpa jadi LTCM",
      prose: [
        "Skenario 1 — Butuh harga opsi yang cepat dan intuitif. → Binomial 1-periode: replikasi Δ saham + pinjaman; π = [(1+r)−d]/(u−d). Delta = (C_u−C_d)/(S_u−S_d) = hedge ratio.",
        "Skenario 2 — Butuh harga standar pasar. → Black-Scholes. N(d2) ≈ probabilitas risk-neutral ITM; N(d1) = delta. Ingat: ini benchmark bahasa pasar, bukan kebenaran.",
        "Skenario 3 — Volatilitas naik / expiry mendekat. → Vol naik = harga opsi (call & put) naik — ketidakpastian itu mahal (vega+). Expiry dekat = time value meleleh — waktu adalah musuh pembeli, teman penjual (theta).",
        "Skenario 4 — Pasar quote put OTM lebih mahal. → Itu vol smile: pasar tidak percaya vol konstan. Untuk hedging, pakai vol surface per strike & tenor — bukan σ tunggal.",
        "Skenario 5 — Melihat peluang arbitrase opsi. → Cek put-call parity: C + PV(X) = P + S. Pelanggaran = mispricing, atau ekspektasi dividen / biaya pinjam saham yang salah.",
        "Aturan praktis 10 detik: cepat → binomial; standar → BS; vol naik → opsi mahal; expiry dekat → theta; quote aneh → parity.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Model hebat + leverage besar + tanpa ruang salah. LTCM membuktikan: formula yang benar secara matematis, asumsi yang rapuh (vol konstan, likuiditas selalu ada), dan leverage 25:1 = bencana USD 4,6 miliar.",
      },
    },
    {
      id: "minicase-ltcm",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Nobelis yang kolaps: framework risiko",
      prose: [
        "LTCM: didirikan peraih Nobel (Scholes & Merton), model arbitrase tercanggih, return 40%+/tahun 1994\u201397. Leverage 25:1. Agustus 1998 (krisis Rusia): likuiditas kering, korelasi \u2192 1, vol meledak — asumsi BS jebol serentak. Rugi USD 4,6 miliar; The Fed memediasi bailout.",
        "Yang salah = pemakaian, bukan model. Tiga asumsi yang jebol: vol konstan (meledak), likuiditas selalu ada (pasar bekU), return normal (ekor tebal). Plus leverage 25:1 = tidak ada ruang salah.",
        "Framework desk derivatif: (1) leverage cap (\u2264 5x untuk strategi konvergensi); (2) stress test asumsi (vol 3x, likuiditas NOL, korelasi \u2192 1); (3) stop-loss modal (drawdown 20% = potong posisi); (4) buffer likuiditas untuk margin call; (5) komite risiko independen. LTCM gagal di kelimanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ergodicity problem: ekspektasi \u201cpositif\u201d tidak relevan jika satu skenario = mati. Dengan leverage 25x, skenario \u201csalah 1%\u201d = kebangkrutan total. Yang penting bukan rata-rata, melainkan kelangsungan hidup.",
      },
      reference: "Leverage \u2264 toleransi error model. Stress-test asumsi, bukan cuma output.",
    },
    {
      id: "paritas-basis-risk",
      eyebrow: "Langkah 8 · Paritas & basis risk",
      title: "Arbitrase tercepat dan hedge yang bocor",
      prose: [
        "Put-call parity (Eropa, non-dividen): C + PV(X) = P + S — call + kas = put + saham (payoff identik). Contoh: S = 100, X = 100, r = 5%, T = 1, C = 12 → P wajar = 12 + 95,12 − 100 = 7,12. Pasar quote P = 9 → put kemahalan: jual put, beli synthetic put murah (beli call + jual saham + pinjam PV(X)) → kantongi selisih. Praktik: pelanggaran parity = sinyal mispricing, ekspektasi dividen yang salah, atau biaya pinjam saham (hard-to-borrow). Untuk opsi Amerika, parity melemah jadi pertidaksamaan — jangan arbitrase buta.",
        "Vol smile — recap: pasar memberi implied vol lebih tinggi untuk put OTM (proteksi crash mahal) — smile membuktikan asumsi vol konstan BS salah di dunia nyata. Praktisi tidak memakai satu σ melainkan vol surface per strike & tenor. Konsekuensi: harga BS dengan σ tunggal = benchmark bahasa pasar, bukan kebenaran — untuk hedging, pakai vol surface.",
        "Basis risk saat hedging: hedge pakai futures ≠ hedge spot — basis = spot − futures bisa bergerak. Contoh: lindungi Rp10M saham LQ45 dengan futures indeks; saat krisis basis melebar 2% → hedge bocor Rp200jt. Cross-hedge (obligasi IDR di-hedge futures USD) = basis risk maksimal. Aturan: hedge ratio optimal = ρ × (σ_spot / σ_futures) — bukan 1; makin lemah korelasi, makin kecil hedge yang jujur. Hedge yang tidak bisa dieksekusi saat dibutuhkan = tidak ada hedge.",
      ],
      tasks: [],
      formula: String.raw`C + PV(X) = P + S \quad;\quad P = C + PV(X) - S`,
      formulaNote: "C = harga call; P = harga put; PV(X) = strike didiskon; S = harga saham. Makna: call + kas mereplikasi put + saham — payoff identik di semua skenario. Contoh: 12 + 95,12 = 7,12 + 100. Pelanggaran parity = mispricing, ekspektasi dividen salah, atau hard-to-borrow.",
      note: {
        title: "Intuisi: harga = biaya replikasi; sisanya cerita",
        body: "Tiga prinsip trader derivatif yang survive. Pertama: setiap harga derivatif = biaya replikasinya — bila kamu tidak bisa menjelaskan replikasinya (delta + kas), jangan percaya harganya, apalagi menjualnya. Kedua: parity adalah kalkulator arbitrase tercepat di meja — sebelum bereaksi ke quote put yang “murah”, hitung P wajar dari C; separuh “peluang” ternyata biaya pinjam saham yang tidak tertulis. Ketiga: yang membunuh bukan modelnya melainkan basis & likuiditas — delta hedge yang tidak bisa di-rebalance saat pasar beku = teori; LTCM mati bukan karena BS salah melainkan karena asumsi likuiditas salah + leverage 25×. Keempat: hormati smile — pasar membayar mahal untuk proteksi crash karena crash benar-benar terjadi; menjual put OTM “mahal” tanpa cadangan = menjual asuransi gempa di zona sesar. Kelima: untuk opsi yang kurang likuid, bid-ask spread bisa 10–20% dari harga teoritis — harga “wajar” parity tidak bisa dieksekusi; selalu kurangi setengah spread dari estimasi profit arbitrase sebelum menyebutnya peluang.",
      },
      reference: "Parity = cek arbitrase tercepat. Hedge ratio = ρ·σ_spot/σ_futures. Hormati smile.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: binomial, swap, dan pelajaran LTCM.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Binomial: S=100, u=1,2, d=0,9, r=5%, X=105. Harga call?",
          options: [
            { text: "15", why: "Salah: itu Cu (payoff up) — belum di-risk-neutral-kan dan didiskon." },
            { text: "7,14", why: "Benar: \u03c0=0,5, C=(0,5\u00d715)/1,05=7,14. Probabilitas aktual tidak dipakai — hanya replikasi.", correct: true },
            { text: "10", why: "Salah: cek \u03c0 = (1,05\u22120,9)/(1,2\u22120,9) = 0,5." },
            { text: "5", why: "Salah: terlalu rendah — hitung ulang." },
          ],
        },
        {
          q: "Swap bayar-fixed, rate pasar turun. MTM?",
          options: [
            { text: "Untung", why: "Salah: terkunci bayar mahal saat pasar murah = rugi." },
            { text: "Rugi (terkunci bayar mahal) — MTM negatif", why: "Benar: V = PV(floating) \u2212 PV(fixed); fixed leg makin mahal relatif \u2192 MTM negatif = liabilitas + collateral.", correct: true },
            { text: "Nol", why: "Salah: MTM nol hanya saat inisiasi fair." },
            { text: "Tidak terpengaruh", why: "Salah: valuasi swap sensitif terhadap kurva." },
          ],
        },
        {
          q: "Pelajaran utama LTCM?",
          options: [
            { text: "Model tidak berguna", why: "Salah: modelnya valid dalam asumsinya — masalahnya pemakaian." },
            { text: "Model benar + asumsi rapuh + leverage = bencana", why: "Benar: hormati batas model; stress-test asumsi; leverage \u2264 toleransi error model.", correct: true },
            { text: "Hindari derivatif", why: "Salah: derivatif = teknologi transfer risiko; yang berbahaya = leverage buta." },
            { text: "Nobel tidak penting", why: "Salah: tidak relevan dengan pelajarannya." },
          ],
        },
        {
          q: "LTCM: model \u2018benar\u2019 tetapi kolaps 1998. Aturan leverage yang tepat?",
          options: [
            { text: "Model Black-Scholes salah secara matematis", why: "Salah: matematikanya valid dalam asumsinya." },
            { text: "Leverage harus \u2264 toleransi error model; stress-test asumsi, bukan cuma output", why: "Benar: leverage 25:1 + asumsi jebol serentak (likuiditas, korelasi, fat tails) = mati. Hormati ekor.", correct: true },
            { text: "Derivatif harus dilarang sepenuhnya", why: "Salah: larangan total bukan pelajaran yang tepat." },
            { text: "Nobelis tidak boleh mengelola dana", why: "Salah: ad hominem — masalahnya leverage dan asumsi." },
          ],
        },
      ],
      summary: [
        "Binomial: harga = PV ekspektasi risk-neutral; \u03c0 \u2260 ramalan.",
        "BS: C = S\u00d7N(d1) \u2212 PV(X)\u00d7N(d2); \u03c3 = input tak terlihat (implied vol).",
        "Greeks: delta/gamma/vega/theta = panel instrumen trader.",
        "Swap: V = PV(floating) \u2212 PV(fixed); floating \u2248 par.",
        "LTCM: hormati asumsi; leverage \u2264 error model; stress-test asumsi.",
      ],
      next: { label: "PM-B7 — Currency: Paritas & Carry Trade", href: "/learn/pm-b7-currency" },
    },
  ],
};
