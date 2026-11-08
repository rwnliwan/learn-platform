import type { V2Lesson } from "../lib/types";

const PHILLIPS_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Kurva Phillips menurun: inflasi versus pengangguran, dengan titik kondisi kini inflasi 6 persen dan anotasi r Taylor 11 persen.">
<text x="260" y="18" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Kurva Phillips jangka pendek + jangkar Taylor rule</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="86.7" x2="500" y2="86.7"/><line x1="60" y1="153.3" x2="500" y2="153.3"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">9</text><text x="54" y="90">6</text><text x="54" y="157">3</text><text x="54" y="224">0</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">inflasi π (%)</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">4</text><text x="148" y="240">5</text><text x="236" y="240">6</text><text x="324" y="240">7</text><text x="412" y="240">8</text><text x="500" y="240">9%</text></g>
<polyline points="60,42 148,76 236,98 324,120 412,131 500,138" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="236" y1="20" x2="236" y2="220" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="242" y="32" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">u* = 6% (NAIRU, ilustrasi)</text>
<line x1="60" y1="176" x2="500" y2="176" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="494" y="170" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">target BI π* = 2%</text>
<circle cx="148" cy="87" r="5.5" fill="var(--c2)"/>
<text x="160" y="70" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">kini: π=6%, u=5%</text>
<text x="160" y="84" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">→ r Taylor = 11%</text>
<text x="470" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">pengangguran (%) →</text>
</svg>`;

export const pma3: V2Lesson = {
  slug: "pm-a3-economics",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A3 Economics: Mikro, Makro & FX",
  estMinutes: 65,
  steps: [
    {
      id: "mikro",
      eyebrow: "Langkah 1 · Mikro",
      title: "Kenapa kopi naik saat rupiah melemah",
      prose: [
        "Bu Ratna punya warung kopi. Harga biji naik 20% — padahal panen bagus. Penjelasannya: kopi diperdagangkan dalam USD; rupiah melemah 15% terhadap USD. Harga global tetap — yang berubah adalah nilai tukar. Lalu pertanyaannya merambat: suku bunga AS naik \u2192 modal keluar \u2192 rupiah tertekan \u2192 BI menaikkan suku bunga \u2192 kredit warungnya ikut mahal. Satu keputusan The Fed mengguncang warung kopi.",
        "Di sisi mikro, harga keseimbangan terjadi saat demand = supply. Struktur pasar menentukan pricing power: perfect competition (beras — banyak penjual, produk homogen, margin tipis selamanya), monopolistic competition (warung kopi — diferensiasi), oligopoli (semen, telekomunikasi), monopoli (PLN — price maker). Implikasi investasi: pricing power = margin defensif = valuasi premium.",
        "Rumus Lerner mengukur pricing power: (P\u2212MC)/P = \u22121/E — semakin inelastic demand (E kecil), semakin besar markup yang bisa dipasang. Saham \u201cmahal\u201d (P/E tinggi) sering kali hanya mencerminkan moat yang memang layak dibayar mahal.",
      ],
      formula: String.raw`\frac{P - MC}{P} = -\frac{1}{E}`,
      formulaNote: "P = harga jual; MC = biaya marginal (Rp50.000 — biaya menambah satu unit); E = elastisitas harga demand (negatif, mis. −4: harga naik 1% → kuantitas turun 4%). Interpretasi: ruas kiri adalah margin (markup); semakin inelastis demand (|E| kecil), semakin besar markup yang bisa dipasang — ukuran kuantitatif moat perusahaan. Contoh angka: (P − 50.000)/P = −1/(−4) = 0,25 → P = 50.000/0,75 = Rp66.667, markup 25%.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Tertukar tanda elastisitas silang. Substitusi = searah (positif): teh mahal \u2192 kopi naik. Komplemen = berlawanan (negatif): gula mahal \u2192 kopi turun.",
      },
      reference: "Struktur pasar \u2192 pricing power \u2192 margin. Lerner: markup = \u22121/E.",
    },
    {
      id: "lerner",
      eyebrow: "Langkah 2 · Pricing Power",
      title: "Hitung harga optimal dari elastisitas",
      prose: [
        "Dari (P\u2212MC)/P = \u22121/E diperoleh P = MC/(1 + 1/E). Dengan MC = Rp50.000 dan elastisitas demand E = \u22124: P = 50.000/(1\u22120,25) = Rp66.667, markup = 25% (= \u22121/E — cocok).",
        "Bandingkan dengan komoditas (E = \u22128): P = Rp57.143, markup = 12,5% (= −1/E). Diferensiasi mengubah E dari \u22128 ke \u22122 dan menaikkan harga +75% (1,75×) — inilah matematika moat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `harga` optimal dengan MC = 50000, E = \u22124" },
        { id: "t2", text: "Hitung `markup` = (harga \u2212 MC)/harga, cetak keduanya" },
      ],
      expected: "harga=66667  markup=0.25",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa tanda negatif E. 1/E dengan E = \u22124 adalah \u22120,25 — penyebutnya (1 \u2212 0,25) = 0,75, bukan 1,25.",
      },
      hints: [
        "Rumus: P = MC / (1 + 1/E). Perhatikan E negatif.",
        "markup = (harga - mc) / harga.",
        "harga = mc / (1 + 1/e)\nmarkup = (harga - mc) / harga",
      ],
      code: {
        starter: `mc, e = 50000, -4\n\n# TULIS KODEMU\nharga = \nmarkup = \n\nprint(f"harga={harga:.0f}  markup={markup:.2f}")`,
        lockLines: 1,
        solution: `mc, e = 50000, -4\n\n# TULIS KODEMU\nharga = mc / (1 + 1/e)\nmarkup = (harga - mc) / harga\n\nprint(f"harga={harga:.0f}  markup={markup:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "harga", value: 66666.67, tol: 1, label: "`harga` sekitar 66667", msg: "50.000/(1 + 1/(\u22124)) = 50.000/0,75 = 66.667. Cek tanda E." },
          { kind: "equal", task: "t2", name: "markup", value: 0.25, tol: 1e-9, label: "`markup` seharusnya 0.25", msg: "(66.667\u221250.000)/66.667 = 0,25 = \u22121/E." },
          { kind: "stdout_matches", task: "t2", pattern: "harga=66667\\s+markup=0\\.25", label: "`print` menampilkan keduanya", msg: "Format: harga=...  markup=... ." },
        ],
      },
      reference: "P = MC/(1 + 1/E). Markup = \u22121/E.",
    },
    {
      id: "makro",
      eyebrow: "Langkah 3 · Makro",
      title: "GDP, inflasi, dan keran suku bunga",
      prose: [
        "GDP = C + I + G + (X \u2212 M). Konsumsi rumah tangga adalah komponen terbesar di Indonesia (~55%). Inflasi dari CPI: \u03c0 = (CPI_t \u2212 CPI_{t\u22121})/CPI_{t\u22121}. Selalu pakai angka riil untuk keputusan investasi: GDP nominal +9% dengan inflasi 4,35% \u2192 GDP riil = 1,09/1,0435 \u2212 1 \u2248 4,46%.",
        "Kebijakan moneter (bank sentral): naikkan suku bunga \u2192 kredit mahal \u2192 demand turun \u2192 inflasi turun, tetapi growth ikut turun — seperti memutar keran air. Kebijakan fiskal (pemerintah): belanja naik/pajak turun \u2192 stimulus langsung, tetapi defisit dan utang naik.",
        "Pasar bereaksi terhadap ekspektasi, bukan realisasi. Fed menaikkan 0,25% sesuai ekspektasi \u2192 pasar tenang. Yang menggerakkan pasar adalah kejutan. Jangan tanya \u201cBI akan naikkan bunga?\u201d — tanya \u201capakah sudah priced-in?\u201d",
      ],
      formula: String.raw`GDP = C + I + G + (X-M) \quad;\quad \pi = \frac{CPI_t - CPI_{t-1}}{CPI_{t-1}}`,
      formulaNote: "C = konsumsi rumah tangga; I = investasi; G = belanja pemerintah; X−M = ekspor neto; CPI_t = indeks harga konsumen periode t. Interpretasi: GDP mengukur ukuran ekonomi, π mengukur laju kenaikan harga — keputusan investasi selalu memakai angka riil (nominal dikurangi inflasi). Contoh angka: CPI 115 → 120 → π = (120−115)/115 = 4,35%; GDP nominal +9% dengan inflasi 4,35% → GDP riil = 1,09/1,0435 − 1 ≈ 4,46%.",
      tasks: [
        { id: "t1", text: "Hitung `gdp` dari C=9500, I=3200, G=1400, NX=\u221250 (Rp triliun)" },
        { id: "t2", text: "Hitung `inflasi` dari CPI 115 \u2192 120, cetak keduanya" },
      ],
      expected: "gdp=14050  inflasi=4.35",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cPDB naik, saham pasti naik\u201d — salah. Pasar bereaksi terhadap ekspektasi vs realisasi: PDB 5% vs konsensus 5,5% \u2192 pasar kecewa. Kata kunci soal CFA: \u201cbetter-than-expected\u201d.",
      },
      hints: [
        "GDP = jumlahkan keempat komponen; NX bisa negatif.",
        "Inflasi = (CPI baru \u2212 CPI lama) / CPI lama.",
        "gdp = c + i + g + nx\ninflasi = (cpi1 - cpi0) / cpi0",
      ],
      code: {
        starter: `c, i, g, nx = 9500, 3200, 1400, -50\ncpi0, cpi1 = 115, 120\n\n# TULIS KODEMU\ngdp = \ninflasi = \n\nprint(f"gdp={gdp}  inflasi={inflasi*100:.2f}")`,
        lockLines: 2,
        solution: `c, i, g, nx = 9500, 3200, 1400, -50\ncpi0, cpi1 = 115, 120\n\n# TULIS KODEMU\ngdp = c + i + g + nx\ninflasi = (cpi1 - cpi0) / cpi0\n\nprint(f"gdp={gdp}  inflasi={inflasi*100:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "gdp", value: 14050, tol: 1e-9, label: "`gdp` seharusnya 14050", msg: "9500+3200+1400\u221250 = 14.050. NX negatif mengurangi GDP." },
          { kind: "equal", task: "t2", name: "inflasi", value: 0.043478, tol: 0.001, label: "`inflasi` sekitar 0.0435", msg: "(120\u2212115)/115 = 4,35%. Bagi dengan CPI lama, bukan yang baru." },
          { kind: "stdout_matches", task: "t2", pattern: "gdp=14050\\s+inflasi=4\\.35", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "GDP = C+I+G+NX. Inflasi = \u0394CPI/CPI. Selalu pakai angka riil.",
    },
    {
      id: "taylor",
      eyebrow: "Langkah 4 · Taylor Rule + chart",
      title: "Jangkar kewajaran suku bunga",
      prose: [
        "Taylor rule: r = r* + \u03c0 + 0,5(\u03c0\u2212\u03c0*) + 0,5(output gap). Dengan r* = 2%, inflasi aktual 6%, target 2%, output gap +2%: r = 2 + 6 + 0,5\u00d74 + 0,5\u00d72 = 11%.",
        "Jika BI rate aktual jauh di bawah angka Taylor, kebijakan relatif longgar — atau pasar MUNGKIN menuntut kenaikan (Taylor rule adalah acuan/jangkar, bukan ramalan). Taylor rule bukan ramalan sempurna, tetapi jangkar: ia memberi tahu apakah kebijakan saat ini hawkish atau dovish relatif terhadap kondisi. Analis obligasi memakai ini tiap RDG BI.",
        "Cara membaca: sumbu X = tingkat pengangguran (%), sumbu Y = inflasi π (%); kurva menurun = trade-off jangka pendek; garis putus-putus horizontal = target inflasi BI 2%, vertikal = NAIRU.",
        "Interpretasi: titik kondisi kini (π=6%, u=5%) berada jauh di atas target — Taylor rule di teks memberi r = 11%, artinya jika BI rate aktual jauh di bawah itu, pasar MUNGKIN menuntut kenaikan (Taylor rule adalah acuan/jangkar, bukan ramalan). Kurva mengingatkan: menekan inflasi lewat rate hike biasanya dibayar dengan pengangguran lebih tinggi.",
      ],
      figure: {
        svg: PHILLIPS_SVG,
        alt: "Kurva Phillips menurun: inflasi versus pengangguran, dengan titik kondisi kini inflasi 6 persen dan anotasi r Taylor 11 persen.",
        caption: "Angka π=6%, π*=2%, dan r=11% sama persis dengan contoh Taylor rule di teks (r*=2, gap +2). Garis target dan NAIRU adalah ilustrasi — intinya: Taylor rule adalah jangkar kewajaran suku bunga, bukan ramalan.",
      },
      formula: String.raw`r = r^* + \pi + 0{,}5(\pi - \pi^*) + 0{,}5 \times \text{output gap}`,
      formulaNote: "r* = suku bunga riil natural (~2% — rate saat ekonomi seimbang); π = inflasi aktual (6%); π* = target inflasi bank sentral (2%); output gap = selisih output aktual vs potensial (+2% = ekonomi overheating). Interpretasi: r Taylor adalah suku bunga “wajar” menurut kondisi ekonomi — acuan menilai apakah kebijakan bank sentral sedang longgar atau ketat. Contoh angka: 2 + 6 + 0,5×(6−2) + 0,5×2 = 11%; jika BI rate aktual jauh di bawah angka Taylor-nya, pasar MUNGKIN menuntut kenaikan (Taylor rule adalah acuan/jangkar, bukan ramalan).",
      tasks: [
        { id: "t1", text: "Hitung `r` Taylor rule: r* = 2, inflasi 6, target 2, gap +2" },
        { id: "t2", text: "Cetak hasilnya" },
      ],
      expected: "r=11",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Suku bunga naik \u2192 harga obligasi turun seketika (yield naik), tetapi efek ke inflasi butuh 12\u201318 bulan lag. Investor obligasi long-duration yang tidak paham lag ini memegang bom waktu.",
      },
      hints: [
        "Empat suku: r* + inflasi + 0,5\u00d7selisih inflasi + 0,5\u00d7gap.",
        "Selisih inflasi = inflasi aktual \u2212 target.",
        "r = r_star + pi + 0.5*(pi - pi_t) + 0.5*gap",
      ],
      code: {
        starter: `r_star, pi, pi_t, gap = 2, 6, 2, 2\n\n# TULIS KODEMU\nr = \n\nprint(f"r={r}")`,
        lockLines: 1,
        solution: `r_star, pi, pi_t, gap = 2, 6, 2, 2\n\n# TULIS KODEMU\nr = r_star + pi + 0.5*(pi - pi_t) + 0.5*gap\n\nprint(f"r={r}")`,
        checks: [
          { kind: "equal", task: "t1", name: "r", value: 11, tol: 1e-9, label: "`r` seharusnya 11", msg: "2 + 6 + 0,5\u00d74 + 0,5\u00d72 = 11. Cek koefisien 0,5 di dua suku terakhir." },
          { kind: "stdout_matches", task: "t2", pattern: "r=11", label: "`print` menampilkan r", msg: "Format: r=... ." },
        ],
      },
      quiz: [
        {
          q: "Bank sentral menaikkan suku bunga. Efek pertama ke pasar?",
          options: [
            { text: "Saham properti naik", why: "Salah: properti justru sensitif negatif — kredit mahal menekan demand." },
            { text: "Harga obligasi turun (yield naik)", why: "Benar: harga obligasi berbanding terbalik dengan yield. Efek ke inflasi butuh 12\u201318 bulan lag transmisi.", correct: true },
            { text: "Rupiah pasti menguat", why: "Salah: arah kurs tergantung banyak faktor — tidak ada kepastian." },
            { text: "Inflasi langsung turun", why: "Salah: transmisi moneter ke inflasi butuh lag 12\u201318 bulan." },
          ],
        },
        {
          q: "Deflasi 2% vs inflasi 4%. Mana lebih ditakuti investor?",
          options: [
            { text: "Inflasi 4%", why: "Salah: inflasi moderat masih bisa dikelola kebijakan." },
            { text: "Deflasi 2% — memicu penundaan belanja dan spiral", why: "Benar: konsumen menunggu (\u201cbesok lebih murah\u201d) \u2192 demand collapse. Jepang 1990-an = trauma deflasi.", correct: true },
            { text: "Sama saja", why: "Salah: deflasi memicu spiral penundaan yang sulit diputus." },
            { text: "Tidak ada yang ditakuti", why: "Salah: bank sentral menargetkan ~2\u20134% justru karena takut dua ekstrem." },
          ],
        },
      ],
      reference: "Taylor: r = r* + \u03c0 + 0,5(\u03c0\u2212\u03c0*) + 0,5\u00d7gap. Inverted curve = sinyal resesi.",
    },
    {
      id: "fx",
      eyebrow: "Langkah 5 · FX",
      title: "Cross-rate dan forward yang wajar",
      prose: [
        "Cross-rate: jika USD/IDR = 16.000 dan USD/JPY = 150, maka JPY/IDR = 16.000/150 = 106,67. Jika pasar meng-quote 110, ada mispricing — arbitrase segitiga (sebelum spread membunuhnya).",
        "Covered interest rate parity memberi forward yang wajar: F* = S \u00d7 (1+r_d)/(1+r_f). Dengan S = 15.800, r_IDR = 5,5%, r_USD = 4,5%: F* = 15.800 \u00d7 (1,055/1,045) = 15.951. Jika pasar 16.100 > F* \u2192 forward USD kemahalan \u2192 jual USD forward.",
      ],
      formula: String.raw`F^* = S \times \frac{1+r_d}{1+r_f} \qquad;\qquad S_{JPY/IDR} = \frac{S_{USD/IDR}}{S_{USD/JPY}}`,
      formulaNote: "F* = kurs forward wajar; S = kurs spot (Rp15.800/USD); r_d = suku bunga domestik (5,5%); r_f = suku bunga asing (4,5%). Interpretasi: forward wajar dikendalikan selisih suku bunga (covered interest parity) — deviasi quote pasar dari F* berarti mispricing atau premi risiko yang bisa dieksploitasi. Contoh angka: 15.800 × (1,055/1,045) = Rp15.951; cross-rate JPY/IDR = 16.000/150 = 106,67.",
      tasks: [
        { id: "t1", text: "Hitung `cross` JPY/IDR dari USD/IDR 16000 dan USD/JPY 150" },
        { id: "t2", text: "Hitung `fwd` 1 tahun: S=15800, r_IDR=5,5%, r_USD=4,5%, cetak keduanya" },
      ],
      expected: "cross=106.67  fwd=15951",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menggeneralisasi efek kurs per negara. Dampak depresiasi beda tanda untuk importir vs eksportir — petakan eksposur FX per emiten (natural hedge?), bukan per negara.",
      },
      hints: [
        "Cross-rate = pembagian dua rate terhadap mata uang bersama (USD).",
        "Forward = S \u00d7 (1+r_domestik)/(1+r_asing).",
        "cross = usd_idr / usd_jpy\nfwd = s * (1 + r_idr) / (1 + r_usd)",
      ],
      code: {
        starter: `usd_idr, usd_jpy = 16000, 150\ns, r_idr, r_usd = 15800, 0.055, 0.045\n\n# TULIS KODEMU\ncross = \nfwd = \n\nprint(f"cross={cross:.2f}  fwd={fwd:.0f}")`,
        lockLines: 2,
        solution: `usd_idr, usd_jpy = 16000, 150\ns, r_idr, r_usd = 15800, 0.055, 0.045\n\n# TULIS KODEMU\ncross = usd_idr / usd_jpy\nfwd = s * (1 + r_idr) / (1 + r_usd)\n\nprint(f"cross={cross:.2f}  fwd={fwd:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "cross", value: 106.6667, tol: 0.01, label: "`cross` sekitar 106.67", msg: "16.000/150 = 106,67. Bagi, jangan kali." },
          { kind: "equal", task: "t2", name: "fwd", value: 15951.2, tol: 1, label: "`fwd` sekitar 15951", msg: "15.800 \u00d7 (1,055/1,045) = 15.951. r domestik di pembilang." },
          { kind: "stdout_matches", task: "t2", pattern: "cross=106\\.67\\s+fwd=15951", label: "`print` menampilkan keduanya", msg: "Format: cross=...  fwd=... ." },
        ],
      },
      reference: "Cross-rate via mata uang bersama. Forward wajar = covered IRP. Indonesia: managed float.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: lensa ekonomi untuk keputusan analis",
      prose: [
        "Skenario 1 — Menilai apakah perusahaan punya pricing power. → Lihat struktur pasarnya: oligopoli atau diferensiasi kuat = margin defensif = valuasi premium. Indeks Lerner (P−MC)/P = −1/E mengukurnya.",
        "Skenario 2 — Menentukan harga jual optimal. → P = MC/(1+1/E) dari elastisitas demand. Diferensiasi yang mengubah E dari −8 ke −2 menaikkan harga +75% (1,75×) — inilah matematika moat.",
        "Skenario 3 — Menilai arah suku bunga acuan. → Taylor rule sebagai jangkar: r = r* + π + 0,5(π−π*) + 0,5(output gap). Aktual jauh di bawah angka Taylor = kebijakan relatif longgar. Analis obligasi memakai ini setiap RDG.",
        "Skenario 4 — Mengecek kewajaran forward FX. → Covered IRP: F* = S × (1+r_d)/(1+r_f). Pasar jauh di atas F* = forward USD kemahalan = peluang jual forward.",
        "Skenario 5 — Berita makro baru rilis (Fed hawkish, BI naik). → Jangan bereaksi ke angkanya — pasar bergerak oleh kejutan vs ekspektasi. Petakan rantainya: Fed → arus modal → IDR → biaya impor → demand, seperti warung Bu Ratna.",
        "Aturan praktis 10 detik: pricing power → Lerner; suku bunga wajar → Taylor; forward wajar → IRP; berita makro → tanya 'kejutan vs ekspektasi apa?'.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memperlakukan data makro sebagai berita yang bisa di-trade setelah rilis. Saat GDP/inflasi diumumkan, pasar sudah bergerak berhari-hari sebelumnya — yang menggerakkan harga adalah selisih realisasi vs konsensus, bukan angkanya.",
      },
    },
    {
      id: "minicase-ratna",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Warung Bu Ratna vs The Fed",
      prose: [
        "Rupiah melemah 15% (biji kopi impor USD), BI menaikkan suku bunga, harga biji naik 20%. Bu Ratna (monopolistic competition — warung kopi dengan diferensiasi rasa) ragu menaikkan harga. Ia juga punya utang USD untuk mesin espresso: cicilan $500/bulan.",
        "Rantainya: Fed hawkish \u2192 modal keluar \u2192 IDR melemah \u2192 biaya impor naik; BI ikut hawkish \u2192 kredit mahal \u2192 demand lemah. Bu Ratna dijepit tiga sisi: biaya biji naik, cicilan utang naik 15% (dari Rp8jt ke Rp9,2jt/bulan), daya beli pelanggan turun.",
        "Responsnya: naikkan harga 10\u201312% (tidak full 20%) — diferensiasi rasa = pricing power parsial, pelanggan setia menoleransi. KopiCurah di seberang jalan (perfect competition) tidak punya opsi ini: naikkan Rp500 saja pelanggan pindah; ia harus menelan kenaikan biaya atau tutup. Pelajaran investor: saat guncangan makro, yang bertahan bukan yang paling efisien, melainkan yang punya pricing power.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Makro = mikro yang diagregat. Setiap emiten punya \u201cBu Ratna\u201d-nya: petakan eksposur FX + sensitivitas suku bunga tiap emiten sebelum membeli sahamnya.",
      },
      reference: "Rantai kebijakan \u2192 sektor. FX per emiten, bukan per negara. Pricing power = moat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran: GDP, FX, kebijakan moneter, dan Taylor rule.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pasar bergerak oleh kejutan, bukan berita",
        body: "Heuristik makro paling hemat waktu: jangan tanya “apa yang terjadi”, tanya “apa yang belum priced-in”. Data PDB 5% tidak berarti apa-apa sampai kamu tahu konsensusnya 5,5% (pasar kecewa) atau 4,5% (pasar pesta). Praktisi membaca kalender ekonomi sebagai jadwal kejutan, bukan jadwal fakta — yang menggerakkan harga adalah selisih ekspektasi vs realisasi. Kedua: petakan rantai transmisi sebelum bereaksi. Fed hawkish → dolar menguat → rupiah tertekan → BI ikut hawkish → kredit mahal → emiten padat modal terpukul. Satu berita, lima langkah; yang tidak memetakan rantai akan membeli di langkah yang salah. Ketiga, untuk konteks emerging market seperti Indonesia: suku bunga AS adalah “cuaca”, BI rate adalah “payung” — kamu tidak mengendalikan cuaca, jadi posisikan payungmu (duration obligasi, eksposur FX, porsi saham defensif) sebelum hujan, bukan saat sudah basah. Keempat: bedakan level dan perubahan — pasar obligasi bereaksi terhadap arah perubahan suku bunga relatif terhadap ekspektasi (dovish/hawkish), bukan terhadap levelnya. BI rate 6% yang diekspektasi turun menenangkan pasar; BI rate 5% yang diekspektasi naik justru menakutkan pasar.",
      },
      quiz: [
        {
          q: "GDP = C 9500 + I 3200 + G 1400 + NX (\u221250). GDP?",
          options: [
            { text: "Rp14.050 T", why: "Benar: 9500+3200+1400\u221250 = 14.050. NX negatif (defisit dagang) mengurangi GDP.", correct: true },
            { text: "Rp14.150 T", why: "Salah: NX \u221250 mengurangi, bukan menambah." },
            { text: "Rp13.100 T", why: "Salah: cek penjumlahan keempat komponen." },
            { text: "Rp14.100 T", why: "Salah: 9500+3200+1400 = 14.100, lalu kurangi 50." },
          ],
        },
        {
          q: "USD/IDR 16.000, USD/JPY 150. Cross-rate JPY/IDR?",
          options: [
            { text: "106,67", why: "Benar: 16.000/150 = 106,67. Jika pasar quote 110 \u2192 mispricing (arbitrase sebelum spread).", correct: true },
            { text: "110", why: "Salah: itu contoh quote pasar yang mispriced, bukan hasil hitungan." },
            { text: "2.400.000", why: "Salah: itu hasil perkalian — cross-rate = pembagian via mata uang bersama." },
            { text: "0,0094", why: "Salah: itu kebalikan (IDR/JPY), bukan JPY/IDR." },
          ],
        },
        {
          q: "Rupiah melemah 15%. Emiten paling diuntungkan?",
          options: [
            { text: "Maskapai (impor avtur)", why: "Salah: biaya impor naik dalam rupiah \u2192 margin tertekan." },
            { text: "Eksportir batubara (pendapatan USD, biaya IDR)", why: "Benar: pendapatan USD naik dalam rupiah, biaya tetap rupiah \u2192 margin mekar. Analisis FX harus per emiten.", correct: true },
            { text: "Ritel impor", why: "Salah: harga pokok impor naik." },
            { text: "Emiten berutang USD", why: "Salah: cicilan utang naik dalam rupiah tanpa kenaikan pendapatan." },
          ],
        },
        {
          q: "r* = 2%, inflasi 6%, target 2%, output gap +2%. Suku bunga \u201cwajar\u201d Taylor rule?",
          options: [
            { text: "8%", why: "Salah: itu r* + inflasi saja, tanpa dua suku koreksi." },
            { text: "10%", why: "Salah: cek koefisien 0,5 di kedua suku koreksi." },
            { text: "11%", why: "Benar: 2 + 6 + 0,5\u00d74 + 0,5\u00d72 = 11. Jika BI rate aktual jauh di bawah ini, kebijakan relatif longgar.", correct: true },
            { text: "6%", why: "Salah: itu cuma inflasi aktual — Taylor memakai r* + inflasi + koreksi." },
          ],
        },
      ],
      summary: [
        "Mikro: keseimbangan demand-supply; struktur pasar \u2192 pricing power \u2192 margin.",
        "Makro: GDP = C+I+G+NX; inflasi via CPI; moneter vs fiskal beda alat dan lag.",
        "Taylor rule: jangkar kewajaran suku bunga; pasar bergerak oleh kejutan vs ekspektasi.",
        "FX: cross-rate via mata uang bersama; forward wajar = covered IRP; petakan eksposur per emiten.",
        "Selalu riil: kurangi inflasi sebelum memutuskan.",
      ],
      next: { label: "PM-A3B — Economics: Kebijakan Moneter, Siklus & Paritas FX", href: "/v2/learn/pm-a3b-kebijakan-siklus" },
    },
  ],
};
