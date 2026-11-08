import type { V2Lesson } from "../lib/types";

// Tiga bentuk kurva yield: normal (naik), inverted (turun), flat.
const YIELD_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Tiga bentuk kurva yield: normal menanjak, inverted menurun, flat mendatar.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">8%</text><text x="54" y="74">6%</text><text x="54" y="124">4%</text><text x="54" y="174">2%</text><text x="54" y="224">0%</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">1</text><text x="157.8" y="240">3</text><text x="255.6" y="240">5</text><text x="353.3" y="240">7</text><text x="500" y="240">10</text></g>
<polyline points="60,170 108.9,158 157.8,146 206.7,134 255.6,122 304.4,110 353.3,98 402.2,86 451.1,74 500,57.5" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="60,57.5 108.9,70 157.8,82.5 206.7,95 255.6,107.5 304.4,120 353.3,132.5 402.2,145 451.1,157.5 500,170" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<line x1="60" y1="107.5" x2="500" y2="107.5" stroke="var(--c3)" stroke-width="2.5"/>
<g font-size="10" font-family="var(--font-ui)"><line x1="300" y1="190" x2="324" y2="190" stroke="var(--c1)" stroke-width="2.5"/><text x="330" y="194" fill="var(--chart-text)">normal (naik)</text><line x1="300" y1="203" x2="324" y2="203" stroke="var(--c2)" stroke-width="2.5"/><text x="330" y="207" fill="var(--chart-text)">inverted (turun)</text><line x1="300" y1="216" x2="324" y2="216" stroke="var(--c3)" stroke-width="2.5"/><text x="330" y="220" fill="var(--chart-text)">flat</text></g>
<text x="420" y="100" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle">inverted = sinyal resesi</text>
</svg>`;

export const pmb5: V2Lesson = {
  slug: "pm-b5-fixed-income-lanjut",
  track: "Portfolio Management",
  module: "Kuantitatif",
  title: "PM-B5 Fixed Income Lanjut: Kurva, Kredit & MBS",
  estMinutes: 55,
  steps: [
    {
      id: "term-structure",
      eyebrow: "Langkah 1 · Term Structure + chart",
      title: "\u2018Aman\u2019 AAA yang gagal bayar",
      prose: [
        "2007: obligasi AAA berbasis KPR AS dianggap \u2018seaman Treasury\u2019. Dana pensiun memborong. 2008: sebagian gagal bayar. Rating AAA ternyata salah memodelkan korelasi default. Twist-nya: bukan probabilitas default tiap KPR yang salah — melainkan korelasinya (saat harga rumah jatuh nasional, default bergerombol). Risiko kredit = risiko korelasi.",
        "Spot rate: yield untuk satu arus kas di tenor t. Forward rate: rate masa depan yang tersirat dari spot kini. Bootstrapping: turunkan spot dari harga obligasi par secara berurutan. Kurva: normal (naik), inverted (turun \u2192 prediktor resesi), flat, humped.",
        "Teori: expectations (forward = ekspektasi spot), liquidity preference (premi untuk tenor panjang \u2192 kurva normal naik). Forward = ekspektasi pasar, bukan janji.",
        "Cara membaca: sumbu X = tenor, sumbu Y = yield; tiga garis = tiga bentuk kurva yield yang mungkin.",
        "Interpretasi: normal (naik) = kondisi biasa dengan premi tenor; inverted (turun) = pasar bertaruh suku bunga akan dipotong — prediktor resesi 6–24 bulan; flat = masa transisi. Bentuk kurva adalah ekspektasi pasar yang terbaca, bukan ramalan.",
      ],
      figure: {
        svg: YIELD_SVG,
        alt: "Tiga bentuk kurva yield: normal menanjak, inverted menurun, flat mendatar.",
        caption: "Tiga bentuk kurva yield: normal (naik), inverted (turun — sinyal resesi), flat. Bentuknya adalah ekspektasi pasar yang terbaca.",
      },
      formula: String.raw`(1+S_n)^n = (1+S_1)(1+F_{1,2})\cdots(1+F_{n-1,n})`,
      formulaNote: "S_n = spot rate n-tahun; F = forward rate antar-periode. Makna: investasi n-tahun langsung = gulung obligasi 1-tahun berulang — ekuivalen via no-arbitrage. Contoh: S1=5%, S2=6% → forward tahun ke-2 tersirat 7,01%. Forward = ekspektasi pasar, bukan janji.",
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kurva inverted = prediktor resesi (6\u201324 bulan). Respons: defensif, siapkan likuiditas, kurangi durasi kredit. Pasar bertaruh suku bunga akan dipotong.",
      },
      reference: "Forward = ekspektasi (bukan janji). Inverted = sinyal resesi.",
    },
    {
      id: "forward-rate",
      eyebrow: "Langkah 2 · Forward Tersirat",
      title: "Apa kata pasar tentang tahun depan",
      prose: [
        "Spot 1 tahun = 5%, spot 2 tahun = 6%. Forward 1y1y tersirat: (1,06\u00b2/1,05) \u2212 1 = 7,01%. Pasar \u2018berkata\u2019 rate tahun depan 7,01% — ekspektasi, bukan janji.",
        "Bootstrapping = mengupas kurva lapis demi lapis: dari harga obligasi par, turunkan spot 1 tahun, lalu 2 tahun, dan seterusnya. Kurva memberi harga pasar untuk FRA/swap — butuh lindung nilai rate? Kunci dari forward tersirat.",
      ],
      formula: String.raw`F_{1,2} = \frac{(1+S_2)^2}{1+S_1} - 1`,
      formulaNote: "F_{1,2} = forward 1-tahun yang mulai tahun ke-1; S1, S2 = spot 1 & 2 tahun. Contoh: (1,06²/1,05)−1 = 7,01% — bukan rata-rata spot (5,5%), melainkan rate marginal tahun ke-2. Dipakai untuk pricing FRA/swap dan kunci lindung nilai rate.",
      tasks: [
        { id: "t1", text: "Hitung forward 1y1y `f`: S1=5%, S2=6% (desimal)" },
        { id: "t2", text: "Cetak sebagai persen 2 desimal" },
      ],
      expected: "f=7.01%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menjawab 5,5% (rata-rata) atau 6%. Forward bukan rata-rata spot — ia rate marginal tahun ke-2 yang membuat dua strategi ekuivalen.",
      },
      hints: [
        "F = (1+S2)\u00b2/(1+S1) \u2212 1.",
        "S dalam desimal: 0,05 dan 0,06.",
        "f = (1+s2)**2/(1+s1) - 1",
      ],
      code: {
        starter: `s1, s2 = 0.05, 0.06\n\n# TULIS KODEMU\nf = \n\nprint(f"f={f*100:.2f}%")`,
        lockLines: 1,
        solution: `s1, s2 = 0.05, 0.06\n\n# TULIS KODEMU\nf = (1+s2)**2/(1+s1) - 1\n\nprint(f"f={f*100:.2f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "f", value: 0.0701, tol: 0.001, label: "`f` sekitar 0.0701", msg: "(1,06\u00b2/1,05)\u22121 = 7,01%. Bukan rata-rata spot." },
          { kind: "stdout_matches", task: "t2", pattern: "f=7\\.01%", label: "`print` menampilkan persen", msg: "Format persen: f=7.01%." },
        ],
      },
      reference: "Forward tersirat = ekspektasi pasar antar-tenor (no-arbitrage).",
    },
    {
      id: "merton",
      eyebrow: "Langkah 3 · Model Merton",
      title: "Distance-to-default: jarak ke jurang",
      prose: [
        "Model struktural (Merton): ekuitas = call option atas aset perusahaan (strike = nilai utang); default jika aset < utang saat jatuh tempo. Distance-to-default = berapa \u03c3 aset di atas titik default.",
        "Contoh: V = Rp10T, D = Rp6T, \u03c3 = 25%, T = 1, \u03bc = 8%. DD = [ln(10/6) + (0,08\u22120,03125)]/0,25 = (0,5108+0,0488)/0,25 = 2,24\u03c3. Probabilitas default \u2248 N(\u22122,24) \u2248 1,25%.",
        "Monitor: jika V turun ke 7T \u2192 DD \u2248 0,9\u03c3 \u2192 PD \u2248 18% \u2192 jual. DD pasar > rating untuk timing. Model reduced-form alternatif: default = kejadian acak dengan hazard rate \u03bb; CDS = harga pasar risiko kredit murni.",
      ],
      formula: String.raw`DD = \frac{\ln(V/D) + (\mu - \sigma^2/2)T}{\sigma\sqrt{T}}`,
      formulaNote: "DD = distance-to-default (dalam satuan σ): V = nilai aset, D = nilai utang, μ = drift, σ = vol aset, T = horizon. Contoh: V=10T, D=6T, σ=25%, T=1, μ=8% → DD = 2,24σ → PD ≈ 1,25%. Aturan praktisi: DD 3 = aman; DD < 1,5 = kurangi/jual.",
      tasks: [
        { id: "t1", text: "Hitung `dd`: V=10, D=6, \u03c3=25%, T=1, \u03bc=8%" },
        { id: "t2", text: "Cetak 2 desimal" },
      ],
      expected: "dd=2.24",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aturan: DD 3 = aman; DD < 1,5 = kurangi/jual eksposur kredit. PD tersirat dari spread: spread 200bps, recovery 40% \u2192 PD = 0,02/0,60 = 3,33% (risk-neutral).",
      },
      hints: [
        "ln(V/D) dulu, lalu tambah (\u03bc \u2212 \u03c3\u00b2/2)\u00d7T.",
        "Bagi dengan \u03c3\u00d7\u221aT.",
        "import math\ndd = (math.log(v/d) + (mu - sig**2/2)*t) / (sig*t**0.5)",
      ],
      code: {
        starter: `import math\nv, d, sig, t, mu = 10, 6, 0.25, 1, 0.08\n\n# TULIS KODEMU\ndd = \n\nprint(f"dd={dd:.2f}")`,
        lockLines: 2,
        solution: `import math\nv, d, sig, t, mu = 10, 6, 0.25, 1, 0.08\n\n# TULIS KODEMU\ndd = (math.log(v/d) + (mu - sig**2/2)*t) / (sig*t**0.5)\n\nprint(f"dd={dd:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dd", value: 2.24, tol: 0.01, label: "`dd` sekitar 2.24", msg: "[ln(10/6)+(0,08\u22120,03125)]/0,25 = 2,24\u03c3. PD \u2248 1,25%." },
          { kind: "stdout_matches", task: "t2", pattern: "dd=2\\.24", label: "`print` menampilkan dd", msg: "Format 2 desimal: dd=2.24." },
        ],
      },
      reference: "DD = jarak ke default (\u03c3). Ekuitas = call atas aset. DD < 1,5 = waspada.",
    },
    {
      id: "mbs",
      eyebrow: "Langkah 4 · MBS",
      title: "Risiko pelunasan dipercepat",
      prose: [
        "MBS: prepayment risk. Suku bunga turun 2% \u2192 PSA 100 \u2192 400 \u2192 investor MBS sedih (relatif): prepayment melonjak \u2192 uang kembali saat reinvestasi murah \u2192 negative convexity. Harga naik lebih sedikit dari obligasi biasa — heads kalah, tails kalah.",
        "Bandingkan MBS vs Treasury via OAS (option-adjusted spread), bukan yield: keluarkan nilai opsi prepayment dulu. Yield 8% vs 5% \u2192 selisih 3% = kompensasi prepayment/kredit/likuiditas. OAS membandingkan apel-dengan-apel.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan yield MBS langsung dengan Treasury. 3% selisihnya bukan \u201cgratis\u201d — ia harga opsi prepayment yang dipegang peminjam. Pakai OAS.",
      },
      quiz: [
        {
          q: "Rate turun 2%, MBS PSA 100\u2192400. Efek ke investor MBS?",
          options: [
            { text: "Untung besar seperti obligasi biasa", why: "Salah: prepayment membatasi upside MBS." },
            { text: "Harga naik terbatas (negative convexity); reinvestasi rendah", why: "Benar: prepayment massal \u2192 kas datang cepat \u2192 durasi memendek \u2192 upside terbatas.", correct: true },
            { text: "Tidak ada efek", why: "Salah: prepayment adalah risiko utama MBS." },
            { text: "Rugi pasti", why: "Salah: harga tetap naik — hanya terbatas." },
          ],
        },
      ],
      reference: "MBS: negative convexity. Bandingkan via OAS, bukan yield.",
    },
    {
      id: "korelasi-2008",
      eyebrow: "Langkah 5 · Korelasi",
      title: "Bukan PD yang membunuh — korelasinya",
      prose: [
        "Model bank 2007 memakai korelasi default dari data 2000\u20132006 (masa tenang). 2008: harga rumah jatuh nasional \u2014 default bergerombol, tranche AAA tersapu. Bukan PD individual yang salah — dependensinya.",
        "Matematikanya: 100 KPR, PD 5% tiap kredit. Korelasi 0: ekspektasi = 5 gagal (tersebar, senior aman). Korelasi \u2192 1: skenario biner — 95% \u201csemua baik\u201d vs 5% \u201csemua gagal\u201d (100 gagal) — tranche senior hancur di skenario buruk. PD sama (5%), hasil SANGAT beda.",
        "Pelajaran abadi: model adalah peta, bukan wilayah. Stress-test asumsi korelasi; diversifikasi yang bergantung pada korelasi rendah = diversifikasi semu. Copula Gauss (Li, 2000) elegan tetapi mengasumsikan korelasi konstan dari data tenang & ekor tipis — krisis = korelasi \u2192 1 + ekor tebal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Stress test portofolio sekuritisasi: (1) korelasi \u2192 1; (2) harga agunan \u221230%; (3) likuiditas kering; (4) rating lag 3 notch. Tidak selamat dari (1)\u2013(3) \u2192 jangan sebut \u201caman\u201d.",
      },
      quiz: [
        {
          q: "100 KPR, PD 5% tiap kredit. Jika korelasi default \u2192 1 (sempurna), apa risikonya bagi tranche senior?",
          options: [
            { text: "Aman — ekspektasi gagal tetap 5", why: "Salah: ekspektasi sama, tetapi distribusinya biner — skenario buruk menyapu senior." },
            { text: "Bencana — skenario \u2018semua gagal bersamaan\u2019 bisa menyapu senior", why: "Benar: korelasi \u2192 1 membuat default bergerombol. Inilah pelajaran 2008.", correct: true },
            { text: "Tidak berubah — tranching melindungi selalu", why: "Salah: tranching melindungi dari loss tersebar, bukan loss bergerombol." },
            { text: "Membaik — korelasi tinggi = diversifikasi", why: "Salah: kebalikannya — korelasi tinggi menghancurkan diversifikasi." },
          ],
        },
      ],
      reference: "Risiko kredit = risiko korelasi. Stress-test asumsi, bukan cuma output.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: membaca kurva dan risiko kredit",
      prose: [
        "Skenario 1 — Butuh suku bunga masa depan tersirat. → Bootstrap dari kurva spot: forward = ekspektasi pasar, bukan janji. Butuh lindung nilai rate? Kunci dari forward tersirat.",
        "Skenario 2 — Menilai risiko default emiten. → Model Merton: distance-to-default = berapa σ aset di atas titik default. Tetapi ingat: ia memakai korelasi masa tenang.",
        "Skenario 3 — Spread melebar 100bps. → Bedah penyebabnya dulu: likuiditas kering (seperti 2020) = peluang beli; expected loss naik (downgrade massal) = jauhi. Angka yang sama, arti berlawanan.",
        "Skenario 4 — Tranche AAA berbasis pool pinjaman. → Tanya korelasi default-nya, bukan cuma PD individual. PD 5% dengan korelasi 0 = 5 gagal tersebar; korelasi → 1 = skenario biner yang menghancurkan senior.",
        "Skenario 5 — Punya view non-paralel atas kurva. → Pakai key rate duration per tenor. Effective duration mengasumsikan parallel shift — bisa meleset 3x saat kurva flattening.",
        "Aturan praktis 10 detik: forward → bootstrap; default → DD Merton; spread melebar → cari penyebabnya; AAA pool → cek korelasi; view kurva → KRD.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Menganggap tranching menghilangkan risiko. Ia mengonsentrasikan risiko: 2008 membuktikan tranche AAA bisa tersapu saat default bergerombol — bukan PD individual yang salah, dependensinya.",
      },
    },
    {
      id: "minicase-aaa",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Autopsi AAA 2008",
      prose: [
        "2007: MBS ber-rating AAA diborong dana pensiun global (\u201caman seperti Treasury, yield lebih tinggi\u201d). 2008: harga rumah jatuh nasional — default bergerombol, tranche AAA tersapu. Kerugian triliunan dolar.",
        "Tiga kegagalan: (1) model — korelasi diasumsikan rendah & stabil dari masa tenang; (2) rating — issuer-pay conflict + asumsi usang + lag (rating = opini, bukan jaminan); (3) kepercayaan — tranching dianggap eliminasi risiko, padahal ia konsentrasi risiko.",
        "Bahkan government bond punya risiko (inflasi, downgrade, restructuring — tanya Yunani 2012). Tidak ada aset benar-benar risk-free — hanya risiko berbeda. Risk-free rate = konvensi kerja, bukan kebenaran.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Obligasi \u201caman\u201d yield tinggi \u2192 tanya: risiko apa yang dibayar? Stres korelasi? Yield = cermin risiko; diversifikasi semu = korelasi krisis.",
      },
      reference: "Rating = opini. Model = peta. Tidak ada aset benar-benar risk-free.",
    },
    {
      id: "krd-spread-ytw",
      eyebrow: "Langkah 8 · Key rate duration & spread",
      title: "Kurva tidak pernah bergeser paralel",
      prose: [
        "Key rate duration: effective duration mengasumsikan parallel shift — tetapi kurva jarang bergeser paralel. KRD = sensitivitas harga ke titik tenor spesifik. Contoh obligasi 10y: KRD 2y = 0,4, KRD 5y = 2,1, KRD 10y = 4,3 (total 6,8 ≈ effective duration). Skenario flattening: 5y +100bps, lainnya flat → ΔP ≈ −(2,1 × 0,01) = −2,1%. Yang memakai effective duration menjawab −6,8% — meleset 3×. Keputusan: untuk view non-paralel (flattening/steepening), hedge dengan KRD per titik, bukan satu duration.",
        "Credit spread decomposition: spread 250bps = expected loss 60 + risk premium 120 + likuiditas 50 + pajak 20 (ilustrasi tipikal IG). Spread melebar 100bps karena likuiditas kering (2020) → peluang beli; karena expected loss naik (downgrade massal) → jauhi. Keputusan: bedakan “mengapa spread melebar” sebelum bereaksi ke “berapa spread-nya” — angka yang sama, arti berlawanan.",
        "Jebakan yield-to-worst: obligasi callable, YTM 8% (tenor 10y) vs YTW 5,2% (call dalam 2 tahun saat rate turun). Quote YTM = umpan — emiten rasional akan call saat rate turun. Beli di “8%” → terealisasi 5,2%. Selalu bandingkan callable dengan YTW; YTM hanya untuk bullet. Aturan 10 detik: ada opsi tertanam → yield yang dikutip pedagang biasanya yang tertinggi, bukan yang akan kamu terima.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dpct_krd` (KRD: 5y +100bps, 10y flat) dan `dpct_salah` (pakai effective duration 6,8)" },
        { id: "t2", text: "Cetak keduanya sebagai persen 1 desimal" },
      ],
      expected: "dpct_krd=-2.1%  dpct_salah=-6.8%",
      note: {
        title: "Intuisi: obligasi itu kontrak, bukan angka yield",
        body: "Empat kebiasaan analis kredit senior. Pertama: selalu tanya “yield APA?” — YTM, YTC, YTW, OAS adalah empat angka berbeda untuk satu obligasi; yang dikutip pedagang biasanya yang tertinggi, bukan yang akan kamu terima. Kedua: duration menjawab “berapa persen” hanya bila kamu tahu “di mana” kurva bergerak — untuk view flattening/steepening, KRD per titik jauh lebih jujur dari satu duration. Ketiga: spread adalah harga risiko — uraikan komponennya sebelum bereaksi; spread melebar karena likuiditas adalah undangan, karena expected loss adalah peringatan. Keempat: opsi tersembunyi (call, put, prepayment) selalu dipegang pihak lain — kamulah yang membayar preminya lewat yield yang lebih rendah dari kelihatannya. Yang rajin membaca prospektus covenant & opsi mengalahkan yang rajin menghitung YTM. Kelima: baca covenant sebelum menghitung yield — change-of-control put atau coupon step-up mengubah payoff lebih dari 50bps pergerakan spread; yield tanpa covenant = harga tanpa syarat. Keenam: untuk obligasi IDR, pantau BI rate dan cadangan devisa — dua variabel ini menggerakkan kurva SBN lebih dari model kurva mana pun.",
      },
      hints: [
        "ΔP ≈ −Σ(KRD_i × Δy_i). Hanya 5y yang bergerak (+0,01).",
        "Versi salah: −(effective duration × 0,01).",
        "dpct_krd = -(krd_5y*d5 + krd_10y*d10)*100",
      ],
      code: {
        starter: `# Key rate duration: sensitivitas harga ke titik kurva (tahun)
krd_5y, krd_10y = 2.1, 4.3
d5, d10 = 0.01, 0.0        # 5y +100bps, 10y tidak bergerak

# TULIS KODEMU
dpct_krd = 
dpct_salah = 

print(f"dpct_krd={dpct_krd:.1f}%  dpct_salah={dpct_salah:.1f}%")`,
        lockLines: 5,
        solution: `# Key rate duration: sensitivitas harga ke titik kurva (tahun)
krd_5y, krd_10y = 2.1, 4.3
d5, d10 = 0.01, 0.0        # 5y +100bps, 10y tidak bergerak

# TULIS KODEMU
dpct_krd = -(krd_5y*d5 + krd_10y*d10)*100
dpct_salah = -6.8*0.01*100

print(f"dpct_krd={dpct_krd:.1f}%  dpct_salah={dpct_salah:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "dpct_krd", value: -2.1, tol: 0.05, label: "`dpct_krd` sekitar −2.1", msg: "−(2,1×0,01)×100 = −2,1%. Hanya titik 5y yang bergerak." },
          { kind: "equal", task: "t1", name: "dpct_salah", value: -6.8, tol: 0.05, label: "`dpct_salah` sekitar −6.8", msg: "−6,8×0,01×100 = −6,8% — meleset 3× karena mengasumsikan parallel shift." },
          { kind: "stdout_matches", task: "t2", pattern: "dpct_krd=-2\.1%\s+dpct_salah=-6\.8%", label: "`print` menampilkan keduanya", msg: "Format persen: dpct_krd=...%  dpct_salah=...% ." },
        ],
      },
      reference: "KRD untuk shift non-paralel. Urai spread sebelum bereaksi. Callable → YTW.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: forward, kurva, Merton, dan OAS.",
      ],
      tasks: [],
      quiz: [
        {
          q: "S1=5%, S2=6%. Forward 1y1y?",
          options: [
            { text: "6%", why: "Salah: itu spot 2 tahun — forward = rate marginal tahun ke-2." },
            { text: "7,01%", why: "Benar: (1,06\u00b2/1,05)\u22121 = 7,01%. Pasar \u2018berkata\u2019 rate tahun depan 7,01%.", correct: true },
            { text: "5,5%", why: "Salah: itu rata-rata spot — forward bukan rata-rata." },
            { text: "11%", why: "Salah: itu jumlah — bukan cara menghitung forward." },
          ],
        },
        {
          q: "Kurva inverted artinya?",
          options: [
            { text: "Ekonomi kuat", why: "Salah: kebalikannya — pasar bertaruh rate akan dipotong." },
            { text: "Pasar ekspektasi rate turun (risiko resesi)", why: "Benar: investor menerima yield rendah di tenor panjang karena yakin rate akan dipotong. Prediktor andal, timing 6\u201324 bulan.", correct: true },
            { text: "Inflasi tinggi", why: "Salah: inflasi tinggi biasanya menaikkan yield tenor panjang." },
            { text: "Tidak ada artinya", why: "Salah: inverted adalah sinyal resesi yang terdokumentasi." },
          ],
        },
        {
          q: "V=10T, D=6T, \u03c3=25%, T=1, \u03bc=8%. DD?",
          options: [
            { text: "1,0\u03c3", why: "Salah: hitung [ln(10/6)+(0,08\u22120,03125)]/0,25." },
            { text: "2,24\u03c3 (PD \u2248 1,25%)", why: "Benar: (0,5108+0,0488)/0,25 = 2,24. Monitor: V turun \u2192 DD anjlok \u2192 PD meledak.", correct: true },
            { text: "3,0\u03c3", why: "Salah: cek komponen drift (\u03bc \u2212 \u03c3\u00b2/2)." },
            { text: "0,5\u03c3", why: "Salah: terlalu rendah — cek ln(10/6) = 0,5108." },
          ],
        },
        {
          q: "Banding MBS (yield 8%) vs Treasury (5%). Metrik adil?",
          options: [
            { text: "Selisih yield 3%", why: "Salah: 3% = kompensasi prepayment/kredit/likuiditas — bukan \u201cgratis\u201d." },
            { text: "OAS (keluarkan nilai opsi prepayment)", why: "Benar: OAS membandingkan apel-dengan-apel setelah mengeluarkan opsi.", correct: true },
            { text: "Kupon", why: "Salah: kupon bukan ukuran return yang comparable." },
            { text: "Rating", why: "Salah: rating = opini, bukan metrik perbandingan return." },
          ],
        },
      ],
      summary: [
        "Spot/forward: hubungan no-arbitrage antar-tenor; bootstrapping mengupas kurva.",
        "Teori kurva: expectations vs liquidity preference; inverted = sinyal resesi.",
        "Merton: ekuitas = call atas aset; DD = jarak ke default (\u03c3).",
        "MBS: prepayment risk, negative convexity; bandingkan via OAS.",
        "Pelajaran 2008: risiko kredit = risiko korelasi; model \u2260 wilayah.",
      ],
      next: { label: "PM-B6 — Valuasi Derivatif: Binomial & Black-Scholes", href: "/v2/learn/pm-b6-valuasi-derivatif" },
    },
  ],
};
