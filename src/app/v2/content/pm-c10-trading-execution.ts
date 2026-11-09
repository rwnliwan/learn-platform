import type { V2Lesson } from "../lib/types";

// Efficient frontier eksekusi (Almgren-Chriss): tradeoff expected cost
// (market impact) vs timing risk. Tiga titik dari contoh lesson:
// A (1 hari): impact 0,8%, risk 0,4%; B (5 hari): 0,35% / 0,9%;
// C (10 hari): 0,25% / 1,3%.
const FRONTIER_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Frontier eksekusi Almgren-Chriss: titik A 1 hari, B 5 hari, C 10 hari; makin lama eksekusi, impact turun tetapi timing risk naik.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<polyline points="110,75 140,66 177,60 240,100 324,150 380,162 441,170 490,178" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="177" cy="60" r="5" fill="var(--c1)"/><text x="190" y="64" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">A</text>
<circle cx="324" cy="150" r="5" fill="var(--c1)"/><text x="337" y="154" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">B</text>
<circle cx="441" cy="170" r="5" fill="var(--c1)"/><text x="454" y="174" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="700">C</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="64">0,8%</text><text x="54" y="144">0,4%</text><text x="54" y="224">0</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="207" y="240">0,5%</text><text x="353" y="240">1,0%</text><text x="500" y="240">1,5%</text></g>
<text x="280" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">frontier Almgren-Chriss</text>
<text x="62" y="36" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">expected cost</text>
<text x="498" y="232" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">timing risk</text>
<g fill="var(--text)" font-size="10" font-family="var(--font-ui)"><text x="70" y="192">A: 1 hari · impact 0,8% · risk 0,4%</text><text x="70" y="206">B: 5 hari · impact 0,35% · risk 0,9%</text><text x="330" y="206">C: 10 hari · impact 0,25% · risk 1,3%</text></g>
</svg>`;

export const pmc10: V2Lesson = {
  slug: "pm-c10-trading-execution",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C10 — Trading & Execution",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-meja-trading",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp420 juta yang menguap di meja trading",
      prose: [
        "Manajer putuskan beli saham Rp10 miliar di Rp1.000. Trader eksekusi seminggu (takut \u2018menggerakkan pasar\u2019). Harga rata-rata dapat: Rp1.040. Komisi tercatat: Rp20 juta (0,2%). Bos puas: \u2018biaya kecil!\u2019",
        "Twist-nya: biaya sebenarnya = Rp420 juta (4,2%) \u2014 Rp400jt dari harga yang bergerak selama seminggu (delay + market impact), hanya Rp20jt komisi. Biaya yang terlihat = 5% dari biaya total.",
        "Lesson ini tentang mengukur yang tak terlihat: biaya implisit, implementation shortfall, dan strategi eksekusi.",
      ],
      note: {
        title: "Intuisi: meja trading adalah tempat alpha bocor atau terselamatkan",
        body: "Lima heuristik praktisi eksekusi. Pertama, setiap keputusan investasi punya dua harga: harga ide (saat diputuskan) dan harga realisasi (saat tereksekusi) — selisihnya adalah pajak yang kamu bayar ke pasar; manajer yang tidak mengukur selisih ini sedang berdonasi tanpa sadar. Kedua, urgensi adalah variabel keputusan yang paling diremehkan: ide yang sama bisa layak dieksekusi agresif (alpha memudar dalam jam) atau wajib sabar (rebalancing rutin) — instruksi tanpa urgensi yang dinyatakan memaksa trader menebak, dan tebakannya hampir selalu salah arah. Ketiga, likuiditas adalah barang musiman: 30 menit pertama dan terakhir perdagangan menampung >50% volume harian — order besar yang dieksekusi di jam sepi membayar premi ketidaksabaran; jadwalkan eksekusi mengikuti jam-jam likuid, bukan jam-jam nyaman. Keempat, trader terbaik bukan yang tercepat melainkan yang paling jujur melaporkan slippage-nya \u2014 budaya angka cantik di meja trading menyembunyikan biaya yang justru perlu diperbaiki. Kelima, untuk setiap strategi baru, jalankan paper trading eksekusi selama sebulan: ukur IS vs estimasi pre-trade; jika realisasi dua kali estimasi, model biayamu yang salah \u2014 perbaiki sebelum naik skala.",
      },
      tasks: [],
      reference: "Alpha tanpa eksekusi = ilusi.",
    },
    {
      id: "biaya-gunung-es",
      eyebrow: "Langkah 2 · Biaya eksplisit vs implisit",
      title: "Gunung es biaya trading",
      prose: [
        "Biaya eksplisit: komisi, pajak, fee \u2014 terlihat. Biaya implisit: bid-ask spread, market impact (order sendiri menggerakkan harga), delay (harga bergerak sebelum eksekusi), missed trade (gagal eksekusi = opportunity cost). Aturannya: biaya implisit sering 5\u201320× biaya eksplisit untuk order besar.",
        "Bedah Rp420jt: delay (Rp1.000 → 1.020 sebelum mulai: Rp200jt) + market impact (1.020 → 1.040: Rp200jt) + komisi (Rp20jt) = Rp420jt (4,2%) \u2014 21× komisi! Keputusan \u2018hati-hati\u2019 (seminggu) justru termahal; eksekusi cepat 1 hari mungkin hanya Rp150jt total.",
        "Market impact ≈ σ × √(partisipasi) \u2014 akar kuadrat: gandakan ukuran → impact ×1,4, bukan ×2. Implikasinya: pecah order besar, batasi partisipasi (< 15% volume harian). Dan waspadai opportunity cost: limit beli @1.000 untuk 10.000 saham, tereksekusi 6.000, harga naik ke 1.100 → OC = 4.000 × 100 = Rp400 ribu. Limit = murah tapi mungkin gagal.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Biaya trading = komisi. Pilih broker termurah.\u2019 Salah. Komisi = 5% dari total (Rp20jt dari Rp420jt). Broker \u2018murah\u2019 dengan eksekusi lambat bisa 21× lebih mahal. Ukur implementation shortfall \u2014 itulah harga sebenarnya.",
      },
      reference: "Biaya trading seperti gunung es: karam oleh yang di bawah, bukan puncaknya.",
    },
    {
      id: "implementation-shortfall",
      eyebrow: "Langkah 3 · Implementation shortfall",
      title: "Selisih mimpi dan nyata",
      prose: [
        "Implementation shortfall = return paper portfolio (keputusan) − return real portfolio (eksekusi). Komponen: delay + market impact + komisi + opportunity cost dari order yang tak tereksekusi (dikurangi penghematan jika harga bergerak menguntungkan). Gunanya: KPI kualitas eksekusi trader & broker \u2014 bahan TCA (transaction cost analysis).",
        "Contoh gaya CFA: keputusan beli 10.000 saham @1.000 (Rp10M). Eksekusi: 5.000 @1.020 (hari 1), 5.000 @1.060 (hari 3). Komisi Rp20jt. Harga penutupan hari keputusan: 1.010. Total biaya = (5.000×20 + 5.000×60) + 20jt = Rp420jt. Dekomposisi: delay (1.010−1.000)×10.000 = Rp100jt; impact = Rp300jt (71%!); komisi = Rp20jt. IS = 4,2% \u2014 lebih besar dari alpha kebanyakan manajer.",
        "Evaluasi yang benar: manajer dinilai vs harga keputusan (paper), trader dinilai vs IS. Campur = tidak ada yang bertanggung jawab. Dan benchmark-nya = arrival price (harga keputusan), bukan VWAP \u2014 VWAP bisa dimanipulasi trader karena ia sendiri memengaruhi VWAP.",
      ],
      formula: String.raw`IS = (P_{exec} - P_{dec}) \times Q + \text{komisi} + OC_{missed}`,
      formulaNote: "P_dec = harga saat keputusan, P_exec = harga eksekusi rata-rata. IS > 0 untuk beli = biaya.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018VWAP = bagus.\u2019 Salah. VWAP = rata-rata, bukan optimal: untuk alpha yang memudar ia terlalu lambat. Benchmark evaluasi trader = arrival price, bukan VWAP.",
      },
      reference: "TCA: pre-trade estimasi, real-time monitor, post-trade evaluasi vs arrival.",
    },
    {
      id: "lab-is",
      eyebrow: "Langkah 4 · Lab implementation shortfall",
      title: "Kalkulator shortfall",
      prose: [
        "Hitung IS dari data eksekusi: biaya harga (delay + impact), komisi, IS total, dan porsi komisi. Coba ubah P_EXEC dari 1040 menjadi 1010 (eksekusi cepat): IS anjlok \u2014 kecepatan menghemat.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya_harga` dan `IS`" },
        { id: "t2", text: "Cetak keempat baris dengan `print`" },
      ],
      expected: "IS total: Rp0.42 M (4.2%)  Porsi komisi: 5%",
      hints: [
        "biaya_harga = (P_EXEC − P_DEC) × Q; IS = biaya_harga + KOMISI.",
        "IS/(P_DEC×Q) memberi persen; KOMISI/IS memberi porsi komisi.",
        "Porsi komisi kecil = TCA harus ukur biaya implisit.",
      ],
      code: {
        starter: `# Implementation shortfall\nP_DEC = 1000      # harga saat keputusan\nP_EXEC = 1040     # harga eksekusi rata2 (ubah jadi 1010!)\nQ = 10_000_000    # lembar\nKOMISI = 20_000_000\n\n# TULIS KODEMU\nbiaya_harga = \nIS = \n\nprint(f"Biaya harga (delay+impact): Rp{biaya_harga/1e9:.2f} M")\nprint(f"Komisi                    : Rp{KOMISI/1e9:.2f} M")\nprint(f"IS total                  : Rp{IS/1e9:.2f} M ({IS/(P_DEC*Q):.1%})")\nprint(f"Porsi komisi              : {KOMISI/IS:.0%}")\nprint()\nprint("Porsi komisi kecil = TCA harus ukur implisit!")`,
        lockLines: 4,
        solution: `# Implementation shortfall\nP_DEC = 1000      # harga saat keputusan\nP_EXEC = 1040     # harga eksekusi rata2 (ubah jadi 1010!)\nQ = 10_000_000    # lembar\nKOMISI = 20_000_000\n\n# TULIS KODEMU\nbiaya_harga = (P_EXEC - P_DEC) * Q\nIS = biaya_harga + KOMISI\n\nprint(f"Biaya harga (delay+impact): Rp{biaya_harga/1e9:.2f} M")\nprint(f"Komisi                    : Rp{KOMISI/1e9:.2f} M")\nprint(f"IS total                  : Rp{IS/1e9:.2f} M ({IS/(P_DEC*Q):.1%})")\nprint(f"Porsi komisi              : {KOMISI/IS:.0%}")\nprint()\nprint("Porsi komisi kecil = TCA harus ukur implisit!")`,
        checks: [
          { kind: "equal", task: "t1", name: "biaya_harga", value: 400000000, tol: 1, label: "`biaya_harga` = 400.000.000", msg: "(1040 − 1000) × 10.000.000 = Rp400 juta." },
          { kind: "equal", task: "t1", name: "IS", value: 420000000, tol: 1, label: "`IS` = 420.000.000", msg: "400jt + 20jt = Rp420 juta = 4,2% dari Rp10 miliar." },
          { kind: "stdout_matches", task: "t2", pattern: "IS total                  : Rp0\\.42 M \\(4\\.2%\\)", label: "`print` menampilkan IS total 0.42 M (4.2%)", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
          { kind: "stdout_matches", task: "t2", pattern: "Porsi komisi              : 5%", label: "`print` menampilkan porsi komisi 5%", msg: "20/420 ≈ 4,8% → tampil 5%." },
        ],
      },
      reference: "KPI trader = IS, bukan komisi.",
    },
    {
      id: "lab-vwap",
      eyebrow: "Langkah 5 · Lab simulator eksekusi",
      title: "VWAP vs agresif: pilih racunmu",
      prose: [
        "Simulasikan eksekusi selama HARI hari: tiap hari beli porsi merata, bayar market impact (∝ partisipasi) dan drift pasar acak. Coba ubah HARI dari 3 menjadi 1 (agresif): impact naik, delay/drift turun \u2014 cari titik optimal. Tidak ada yang gratis: pilih sesuai urgensi.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `eksekusi` (impact, drift, biaya)" },
        { id: "t2", text: "Jalankan dan cetak hasil" },
      ],
      expected: "Eksekusi 3 hari: biaya implisit Rp38jt (0.38%)",
      hints: [
        "q = sisa/(hari−h); partisipasi = q/VOL_HARIAN; impact = 20 × partisipasi.",
        "drift = random.uniform(−5, 15); harga += drift; biaya += q×impact + q×drift; sisa −= q.",
        "Return biaya dari fungsi, lalu cetak seperti contoh.",
      ],
      code: {
        starter: `# VWAP vs agresif: impact vs delay\nimport random\nrandom.seed(7)\nQ_TOTAL = 10_000_000\nP0 = 1000\nHARI = 3          # lama eksekusi (ubah jadi 1!)\nVOL_HARIAN = 50_000_000\n\ndef eksekusi(hari):\n    sisa, biaya, harga = Q_TOTAL, 0, P0\n    for h in range(hari):\n        # TULIS KODEMU\n        q = \n        partisipasi = \n        impact = \n        drift = \n        harga += \n        biaya += \n        sisa -= \n    return biaya\n\nb = eksekusi(HARI)\nprint(f"Eksekusi {HARI} hari: biaya implisit Rp{b/1e6:.0f}jt ({b/(P0*Q_TOTAL):.2%})")\nprint()\nprint("Lambat: delay/drift besar. Cepat: impact besar.")\nprint("VWAP = titik seimbang. Ukur, jangan kira-kira!")`,
        lockLines: 7,
        solution: `# VWAP vs agresif: impact vs delay\nimport random\nrandom.seed(7)\nQ_TOTAL = 10_000_000\nP0 = 1000\nHARI = 3          # lama eksekusi (ubah jadi 1!)\nVOL_HARIAN = 50_000_000\n\ndef eksekusi(hari):\n    sisa, biaya, harga = Q_TOTAL, 0, P0\n    for h in range(hari):\n        # TULIS KODEMU\n        q = sisa/(hari-h)\n        partisipasi = q/VOL_HARIAN\n        impact = 20*partisipasi\n        drift = random.uniform(-5, 15)\n        harga += drift\n        biaya += q*impact + q*drift\n        sisa -= q\n    return biaya\n\nb = eksekusi(HARI)\nprint(f"Eksekusi {HARI} hari: biaya implisit Rp{b/1e6:.0f}jt ({b/(P0*Q_TOTAL):.2%})")\nprint()\nprint("Lambat: delay/drift besar. Cepat: impact besar.")\nprint("VWAP = titik seimbang. Ukur, jangan kira-kira!")`,
        checks: [
          { kind: "equal", task: "t1", name: "b", value: 38374427.5, tol: 1, label: "`b` ≈ 38.374.427 (3 hari)", msg: "Biaya implisit simulasi dengan seed 7: impact + drift acak selama 3 hari." },
          { kind: "stdout_matches", task: "t2", pattern: "Eksekusi 3 hari: biaya implisit Rp38jt \\(0\\.38%\\)", label: "`print` menampilkan Rp38jt (0.38%)", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Almgren-Chriss: optimal = seimbang impact vs timing risk.",
    },
    {
      id: "strategi-eksekusi",
      eyebrow: "Langkah 6 · Strategi eksekusi",
      title: "Seimbang cepat vs murah",
      prose: [
        "Empat strategi. Arrival price: eksekusi cepat (minim delay, impact besar). VWAP: ikuti volume pasar (seimbang). TWAP: bagi rata waktu (sederhana). Implementation shortfall algo: front-loaded, agresif di awal \u2014 kejar harga keputusan. Aturannya: urgensi tinggi / info cepat basi → agresif; order besar / likuiditas tipis → pasif (VWAP multi-hari + limit partisipasi).",
        "Instruksi yang benar vs buruk: buruk = \u2018Beli Rp10M saham X\u2019 → trader bingung → seminggu → IS Rp420jt. Benar = \u2018Beli Rp10M via VWAP 2 hari, partisipasi maks 15% volume, limit Rp1.030\u2019 → IS terukur. Manajer bertanggung jawab atas instruksi; trader atas eksekusi vs benchmark.",
        "Untuk order besar di saham illiquid: dark pool dulu (tersembunyi, impact kecil \u2014 tetapi tidak pasti tereksekusi + adverse selection), lit market untuk sisa. Smart order router mengombinasikannya. Dan evaluasi broker/trader dengan TCA kuartalan: pre-trade estimasi, real-time monitor, post-trade evaluasi vs arrival price.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u2018Eksekusi pelan = hati-hati = murah.\u2019 Salah. Pelan = delay risk: harga bergerak selama kamu menunggu. Cepat = impact; lambat = delay. Optimal = seimbang (Almgren-Chriss), bukan selambat mungkin. Urgensi yang menentukan.",
      },
      reference: "Alpha memudar cepat → IS algo agresif; tidak urgent → VWAP.",
    },
    {
      id: "minicase-seminggu",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Seminggu yang mahal",
      prose: [
        "Manajer: \u2018beli Rp10M\u2019 (vague!). Trader eksekusi seminggu @1.040 (keputusan @1.000). Komisi Rp20jt. IS = Rp420jt (4,2%) \u2014 menghapus alpha setahun.",
        "(a) Dekomposisi: delay Rp200jt + impact Rp200jt + komisi Rp20jt. (b) Kesalahan: instruksi vague + asumsi \u2018pelan = murah\u2019 + KPI komisi (bukan IS). (c) Instruksi benar: \u2018VWAP 2 hari, partisipasi ≤15%, limit Rp1.030\u2019 + evaluasi trader vs IS, manajer vs harga keputusan.",
        "(d) Jika alpha manajer 5%: net = 5% − 4,2% = 0,8% \u2014 nyaris nol! Manajer \u2018hebat\u2019 = biasa setelah eksekusi. Net alpha = yang penting; eksekusi = pajak atas alpha. (e) Kebijakan eksekusi: instruksi standar (strategi, partisipasi, limit, urgensi) + pre-trade estimasi + TCA vs arrival + review kuartalan + insentif trader = IS. Sistem, bukan harapan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Knight Capital 2012: algo error saat deploy \u2014 beli tinggi, jual rendah selama 45 menit → rugi USD 440jt, perusahaan bangkrut (diakusisi). Teknologi eksekusi = pedang bermata dua: testing, kill switch, dan monitor wajib.",
      },
      reference: "Rantai eksekusi: keputusan → instruksi → eksekusi → evaluasi → perbaikan.",
    },

    {
      id: "almgren-chriss-frontier",
      eyebrow: "Langkah 8 · Teori eksekusi tingkat lanjut + chart",
      title: "Almgren-Chriss: frontier antara impact dan timing risk",
      prose: [
        "Pilihan eksekusi bukan \u201Ccepat vs lambat\u201D melainkan tradeoff dua biaya: market impact (naik bila agresif) vs timing risk (naik bila lambat \u2014 harga bergerak selama menunggu). Almgren-Chriss (2001) memformalkannya sebagai efficient frontier: untuk setiap tingkat timing risk yang ditoleransi, ada jadwal eksekusi dengan expected cost minimum. Trader memilih titik di frontier sesuai urgensi \u2014 persis seperti memilih portofolio di efficient frontier sesuai risk aversion.",
        "Contoh angka: jual Rp20 miliar saham, ADV Rp100 miliar/hari, volatilitas harian 2%. Opsi A (1 hari, 20% volume): expected impact ≈ 0,8% (Rp160 juta), timing risk (std dev biaya) ≈ 0,4%. Opsi B (5 hari, 4% volume/hari): expected impact ≈ 0,35% (Rp70 juta), timing risk ≈ 0,9% (harga bisa lari selama 5 hari). Opsi C (10 hari): impact ≈ 0,25% (Rp50 juta), timing risk ≈ 1,3%. Tidak ada yang \u201Cbenar\u201D \u2014 manajer dengan alpha yang memudar dalam 2 hari harus pilih A (bayar impact untuk kepastian); rebalancing rutin tanpa urgensi pilih B/C (hemat impact, terima timing risk).",
        "Aturan praktis meja trading institusi: (1) nyatakan urgensi setiap order dalam skala 1\u20135 \u2014 tanpa ini, trader default ke VWAP seharian yang salah untuk kedua ujung; (2) partisipasi maksimum 15\u201320% volume per hari untuk saham likuid, 5\u201310% untuk lapis dua \u2014 di atas itu impact naik super-linear; (3) untuk news-driven trade (earnings surprise), front-load 60\u201370% di 30 menit pertama \u2014 kecepatan lebih berharga dari harga rata-rata; (4) ukur realisasi vs frontier: jika biaya aktual konsisten di atas kurva efficient, algo atau broker-nya yang salah \u2014 ganti, jangan salahkan pasar. Eksekusi adalah portofolio mini: diversifikasi waktu vs konsentrasi, dipilih dengan sadar.",
        "Cara membaca: sumbu X = timing risk (simpangan baku biaya — seberapa besar harga bisa “lari” selama menunggu); sumbu Y = expected cost (market impact). Kurva = frontier: untuk tiap tingkat timing risk, inilah biaya minimum yang bisa dicapai. Tiga titik = tiga jadwal eksekusi dari contoh di atas.",
        "Interpretasi: tidak ada titik yang “benar” — hanya titik yang cocok dengan urgensi. A (1 hari) membayar impact 0,8% demi kepastian — wajib untuk alpha yang memudar dalam 2 hari. C (10 hari) hemat impact (0,25%) tetapi menanggung timing risk 1,3% — hanya layak untuk rebalancing rutin tanpa urgensi. Trader yang default ke VWAP seharian untuk semua order sedang memilih titik B untuk masalah yang butuh A atau C.",
      ],
      figure: {
        svg: FRONTIER_SVG,
        alt: "Frontier eksekusi Almgren-Chriss: titik A 1 hari, B 5 hari, C 10 hari; makin lama eksekusi, impact turun tetapi timing risk naik.",
        caption: "Frontier Almgren-Chriss: kecepatan menurunkan timing risk tetapi menaikkan impact — urgensi menentukan titik mana yang dipilih.",
      },
      formula: String.raw`E[C] = \text{impact}(v) \quad;\quad \text{Var}[C] \propto \sigma^2 \cdot T`,
      formulaNote: "E[C] = ekspektasi biaya eksekusi, naik dengan kecepatan trading v (partisipasi volume). Var[C] = varians biaya (timing risk), naik dengan volatilitas σ dan durasi eksekusi T. Tradeoff-nya: v besar → impact besar, Var kecil; v kecil → impact kecil, Var besar (harga bergerak selama T). Frontier Almgren-Chriss = himpunan (Var, E[C]) minimum untuk tiap kecepatan.",
      tasks: [],
      reference: "Urgensi menentukan titik di frontier; tanpa urgensi tertulis, trader menebak.",
    },
    {
      id: "likuiditas-idx",
      eyebrow: "Langkah 9 · Konteks IDX",
      title: "Eksekusi di IDX: lot, tick, dan jam-jam likuid",
      prose: [
        "Mikrostruktur IDX menentukan taktik. Lot 100 lembar: order Rp10 miliar di saham Rp1.000 = 100.000 lot \u2014 mustahil sekaligus tanpa menggerakkan pasar; pecah menjadi ratusan child order. Tick size bertingkat (Rp1 untuk <Rp200, Rp2 untuk Rp200\u2013500, dst.): untuk saham Rp150, spread minimum Rp1 = 0,67% \u2014 biaya spread yang \u201Ctak terlihat\u201D ini 3× komisi broker; jangan pakai market order di saham tick-kecil, selalu limit di dalam spread.",
        "Distribusi volume harian IDX: ~35% di 30 menit pertama, ~25% di 30 menit terakhir (termasuk pre-closing), sisanya tersebar tipis di tengah hari. Order Rp5 miliar yang dieksekusi pukul 11.00\u201313.00 (jam sepi) membayar impact 2\u20133× dibanding dieksekusi di pembukaan/penutupan. Aturan: jadwalkan ≥60% eksekusi di 30 menit pertama/terakhir; hindari jam 11.30\u201314.00 kecuali terpaksa. Pre-opening (08.45\u201308.55) berguna untuk price discovery \u2014 tetapi jangan taruh order besar di sana tanpa limit ketat; volatilitas pembukaan bisa 1\u20132%.",
        "Saham lapis dua/tiga IDX: ADV di bawah Rp5 miliar/hari, spread 1\u20133%, kedalaman order book tipis (5 level teratas < Rp200 juta). Untuk order >10% ADV: (1) eksekusi multi-hari dengan partisipasi ≤10%; (2) pakai iceberg order (tampilkan sebagian) agar tidak menakuti pasar; (3) pertimbangkan negotiated crossing via broker untuk blok besar \u2014 lebih murah dari menggerogoti order book. Dan waspadai auto-rejection: IDX membatasi pergerakan harian (ARB 8\u201335% bertingkat); order jual besar di saham yang ARB terkunci tidak akan tereksekusi \u2014 rencanakan exit SEBELUM saham masuk ARB, bukan sesudahnya.",
      ],
      tasks: [],
      reference: "Lot 100 + tick bertingkat + volume terkonsentrasi di buka/tutup: jadwalkan eksekusi ikut likuiditas.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Tujuh pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Biaya trading = gunung es: implisit (spread, impact, delay, missed) sering 5\u201320× eksplisit.",
        "Implementation shortfall = paper − real; dekomposisi delay + impact + komisi + OC; KPI meja trading.",
        "Strategi sesuai urgensi: arrival (agresif), VWAP (seimbang), TWAP (rata), IS-algo (front-loaded).",
        "Instruksi spesifik (algo + horizon + limit + urgensi) + evaluasi vs arrival price, bukan VWAP.",
        "Net alpha = alpha bruto − IS; eksekusi buruk menghapus alpha manajer hebat.",
      ],
      next: { label: "C11 \u2014 Ethics & ESG", href: "/v2/learn/pm-c11-ethics-esg" },
      quiz: [
        {
          q: "Saham lapis tiga IDX, ADV Rp3 miliar. Order jual Rp600 juta. Taktik yang tepat?",
          options: [
            { text: "Market order sekaligus di jam 12.00", why: "Salah: 20% ADV sekaligus di jam sepi = impact meledak + spread 1\u20133%." },
            { text: "Multi-hari, partisipasi \u226410%, iceberg order, mayoritas di buka/tutup", why: "Tepat: pecah order, sembunyikan ukuran, ikuti jam likuid. Order book tipis tidak bisa dipaksa.", correct: true },
            { text: "Taruh semua di pre-opening tanpa limit", why: "Salah: volatilitas pembukaan 1\u20132% tanpa limit = harga tak terkendali." },
            { text: "Tunggu sampai ARB baru jual", why: "Salah: ARB terkunci = tidak tereksekusi. Rencanakan exit SEBELUM ARB." },
          ],
        },
        {
          q: "Jual Rp20M, ADV Rp100M/hari. Manajer: alpha memudar dalam 2 hari. Pilihan eksekusi?",
          options: [
            { text: "10 hari, partisipasi 2%/hari \u2014 impact minimum", why: "Salah: timing risk 10 hari (σ × √10) menghancurkan alpha yang memudar dalam 2 hari." },
            { text: "1\u20132 hari agresif \u2014 bayar impact untuk kepastian", why: "Tepat: urgensi tinggi → titik agresif di frontier Almgren-Chriss; impact 0,8% < alpha yang hilang.", correct: true },
            { text: "Tunda sampai likuiditas sempurna", why: "Salah: menunggu = timing risk tak terbatas; alpha memudar tidak menunggu." },
            { text: "Market order sekaligus", why: "Salah: 20% volume sekaligus = impact super-linear; agresif ≠ sembrono \u2014 tetap batasi partisipasi." },
          ],
        },
        {
          q: "IS = Rp420jt, komisi Rp20jt. Porsi komisi?",
          options: [
            { text: "100%", why: "Salah: komisi hanya Rp20jt dari Rp420jt \u2014 jauh dari 100%." },
            { text: "≈ 5% \u2014 gunung es", why: "Tepat: 20/420 ≈ 5%. 95% = delay + impact (tak terlihat). TCA wajib ukur implisit.", correct: true },
            { text: "50%", why: "Salah: 50% dari 420jt = 210jt, sedangkan komisi hanya 20jt." },
            { text: "21%", why: "Salah: 21× adalah rasio total terhadap komisi (420/20), bukan porsi komisi." },
          ],
        },
        {
          q: "Order besar di saham tidak likuid. Strategi?",
          options: [
            { text: "Arrival price agresif", why: "Salah: agresif di pasar tipis = impact meledak." },
            { text: "VWAP multi-hari + limit partisipasi", why: "Tepat: pasif & terkendali untuk likuiditas tipis; partisipasi < 15% volume.", correct: true },
            { text: "Market order langsung", why: "Salah: market order sekaligus = membayar spread penuh + impact maksimal." },
            { text: "Tunda tanpa rencana", why: "Salah: menunda tanpa rencana = delay risk tak terkendali." },
          ],
        },
        {
          q: "Manajer dinilai vs apa?",
          options: [
            { text: "Harga eksekusi", why: "Salah: harga eksekusi = wilayah trader (IS), bukan skill pemilihan saham manajer." },
            { text: "Harga keputusan (paper portfolio)", why: "Tepat: pisahkan skill manajer (vs paper) dari skill trader (IS). Campur = kabur tanggung jawab.", correct: true },
            { text: "Komisi", why: "Salah: komisi = biaya, bukan ukuran skill investasi." },
            { text: "IHSG", why: "Salah: benchmark relevan = harga keputusan untuk alpha spesifik, bukan indeks umum." },
          ],
        },
        {
          q: "Manajer alpha 5%, tapi IS 4,2%. Net alpha & pelajaran?",
          options: [
            { text: "5% \u2014 alpha tetap", why: "Salah: alpha bruto tanpa biaya eksekusi = ilusi." },
            { text: "0,8% \u2014 eksekusi menghapus hampir semua alpha; ukur net!", why: "Tepat: 5% − 4,2% = 0,8%. Eksekusi adalah bagian dari alpha, bukan afterthought.", correct: true },
            { text: "9,2% \u2014 ditambahkan", why: "Salah: biaya mengurangi, bukan menambah return." },
            { text: "Tidak berhubungan", why: "Salah: IS langsung mengurangi return yang diterima investor." },
          ],
        },
        {
          q: "Keputusan beli @Rp1.000, eksekusi @Rp1.040, 10 juta lembar. IS?",
          options: [
            { text: "Rp420jt (4,2%)", why: "Salah: itu contoh dengan komisi Rp20jt \u2014 di sini komisi tidak diberikan, hitung komponen harga saja." },
            { text: "Rp400jt (4%)", why: "Tepat: (1.040 − 1.000) × 10.000.000 = Rp400 juta = 4% dari Rp10 miliar.", correct: true },
            { text: "Rp40jt (0,4%)", why: "Salah: 40 × 10 juta lembar = 400 juta, bukan 40 juta \u2014 cek nolnya." },
            { text: "Rp20jt (0,2%)", why: "Salah: itu komisi pada contoh lain \u2014 bukan IS komponen harga." },
          ],
        },
      ],
    },
  ],
};
