import type { V2Lesson } from "../lib/types";

// Style box 3x3 (Morningstar): kolom value/blend/growth, baris small/mid/large.
// Contoh di lesson: manajer bermandat large-value terdeteksi 55% large-growth
// (style drift!) + 30% large-value + 15% small-cap via returns-based analysis.
const STYLEBOX_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Style box 3x3: manajer bermandat large-value terdeteksi 55 persen large-growth, drift terkonfirmasi.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle" font-weight="600"><text x="180" y="24">Value</text><text x="280" y="24">Blend</text><text x="380" y="24">Growth</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="124" y="66">Small</text><text x="124" y="126">Mid</text><text x="124" y="186">Large</text></g>
<g stroke="var(--chart-text)" stroke-width="1.5" fill="none"><rect x="130" y="36" width="300" height="180"/><line x1="230" y1="36" x2="230" y2="216"/><line x1="330" y1="36" x2="330" y2="216"/><line x1="130" y1="96" x2="430" y2="96"/><line x1="130" y1="156" x2="430" y2="156"/></g>
<rect x="130" y="156" width="100" height="60" fill="var(--c1)" opacity="0.20" stroke="var(--c1)" stroke-width="3"/>
<rect x="330" y="156" width="100" height="60" fill="var(--c3)" opacity="0.25" stroke="var(--c3)" stroke-width="3"/>
<text x="180" y="182" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">30%</text>
<text x="180" y="198" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">mandat</text>
<text x="380" y="182" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">55%</text>
<text x="380" y="198" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">DRIFT!</text>
<text x="280" y="66" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">+ 15% small-cap</text>
<text x="280" y="240" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">deteksi via returns-based style analysis (R2 = 0,92)</text>
</svg>`;

export const pmc8: V2Lesson = {
  slug: "pm-c8-equity-portfolio",
  track: "Portfolio Management",
  module: "Portfolio Construction",
  title: "C8 — Equity Portfolio",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-buffett",
      eyebrow: "Langkah 1 · Cerita",
      title: "Taruhan Warren Buffett",
      prose: [
        "2008: Warren Buffett bertaruh USD 1 juta \u2014 indeks S&P 500 akan mengalahkan 5 fund-of-hedge-funds dalam 10 tahun. Wall Street tertawa. 2017: indeks +125%, hedge funds +36%. Buffett menang telak \u2014 untuk amal.",
        "Twist-nya: yang dikalahkan bukan \u2018orang bodoh\u2019 \u2014 melainkan manajer terbaik dengan fee 2-and-20. Biaya = kepastian, alpha = harapan. Tetapi cerita tidak berhenti di \u2018pasif selalu menang\u2019 \u2014 ada jalan ketiga: smart beta.",
        "Lesson ini tentang memilih senjata dengan sadar: aktif vs pasif yang diukur dengan information ratio, smart beta sebagai jalan ketiga, dan core-satellite sebagai struktur default.",
      ],
      note: {
        title: "Intuisi: di ekuitas, keputusan struktur mengalahkan keputusan pilihan",
        body: "Lima heuristik manajer ekuitas institusi. Pertama, tanyakan “siapa yang saya bayar untuk apa?” sebelum “manajer mana yang bagus?” — membayar fee aktif 1,5% untuk beta pasar (closet indexer) adalah kesalahan struktur, bukan kesalahan pilihan manajer; audit active share dulu, kagumi IR kemudian. Kedua, style adalah risiko yang menyamar sebagai preferensi: portofolio “value” yang dikelola manajer growth yang sedang style-drift bukan diversifikasi — ukur eksposur faktor portofolio gabungan tiap kuartal, bukan label fund factsheet. Ketiga, pajak adalah return yang tertinggal di meja: di akun kena pajak, turnover 120% vs 15% bisa berarti selisih 1% per tahun yang tidak pernah muncul di factsheet mana pun — hitung tax drag sebelum membandingkan dua manajer “setara”. Keempat, rotasi manajer lebih mahal dari yang terlihat: biaya transaksi + pajak + jeda tanpa eksposur + risiko manajer baru \u2014 manajer yang underperform tiga tahun sering lebih murah dipertahankan dengan monitoring ketat daripada diganti. Kelima, untuk setiap satelit aktif, tulis tesis kematiannya: kondisi apa yang membuktikan tesismu salah \u2014 tanpa itu, kamu akan memegang pecundang selamanya.",
      },
      tasks: [],
      reference: "Biaya = kepastian; alpha = harapan.",
    },
    {
      id: "aktif-vs-pasif",
      eyebrow: "Langkah 2 · Aktif vs pasif",
      title: "Information ratio: alpha per unit gaduh",
      prose: [
        "Pasif mereplikasi indeks (tracking error ≈ 0, fee 0,05\u20130,2%). Aktif menyimpang untuk mencari alpha (TE > 0, fee 0,5\u20132%). Information ratio = active return / tracking error: alpha per unit risiko aktif. IR > 0,5 baik; > 1,0 luar biasa (sangat jarang). Fundamental law: IR ≈ IC × √Breadth \u2014 skill per taruhan dikali akar jumlah taruhan independen: banyak taruhan kecil mengalahkan sedikit taruhan besar.",
        "Matematika fee 2-and-20: return bruto 10% \u2192 neto = 10% − 2% − 20%×(10%−2%) = 6,4%. ETF: 10% − 0,05% = 9,95%. Selisih 3,55%/tahun, setiap tahun; 20 tahun: (1,0355)^20 = 2,01× \u2014 ETF bernilai dua kali lipat. Fee adalah pajak atas ketidaktahuan yang berbunga majemuk; fund-of-funds (fee ganda) lebih parah.",
        "Audit manajer sebelum kagum: active return +2%/tahun, TE 8% \u2192 IR = 0,25 (lemah); net setelah fee 1,5% = +0,5% \u2192 IR net = 0,06. Verdict: pecat atau nego fee. Waspadai closet indexer: 80% mirip indeks, fee 1,2% \u2192 active share 20% \u2192 fee efektif = 1,2%/0,2 = 6%! Aturan: active share < 60% → tolak (atau bayar fee pasif); > 80% → truly active, layak dievaluasi. Bayar untuk perbedaan, bukan kemiripan.",
      ],
      formula: String.raw`IR = \frac{R_p - R_b}{TE} \quad;\quad TE = \sigma(R_p - R_b)`,
      formulaNote: "TE = volatilitas active return. Aturan: aktif hanya jika IR ekspektasi × keyakinan > fee.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Manajer return 15% = hebat, layak fee 2%.\u2019 Tanya dulu: benchmark return berapa? TE? IR? Net setelah fee? Return 15% saat indeks 16% = gagal (active −1%, net −3%!). Kagumi IR net, bukan return mentah.",
      },
      reference: "Tuntut IR 3\u20135 tahun, bukan return mentah.",
    },
    {
      id: "lab-ir",
      eyebrow: "Langkah 3 · Lab information ratio",
      title: "Audit manajer dengan IR",
      prose: [
        "Audit manajer dari data active return 8 tahun: hitung rata-rata active return, tracking error (simpangan baku sampel), IR gross, dan IR net setelah fee 1,5%. Coba ubah FEE menjadi 0,005 (hasil nego!) dan lihat IR net membaik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `mean_a` dan `te`" },
        { id: "t2", text: "Hitung `ir_gross` dan `ir_net`" },
        { id: "t3", text: "Cetak keempatnya dengan `print`" },
      ],
      expected: "IR gross: 0.78  IR net (fee 1.5%): 0.16",
      hints: [
        "mean_a = sum(ACTIVE)/n; te = akar dari jumlah kuadrat deviasi dibagi (n−1).",
        "ir_gross = mean_a/te; ir_net = (mean_a − FEE)/te.",
        "IR net < 0,3 konsisten = pertimbangkan pecat/nego.",
      ],
      code: {
        starter: `import math\nACTIVE = [0.03, -0.01, 0.04, 0.02, -0.02, 0.05, 0.01, 0.03]\nFEE = 0.015  # coba ubah ke 0.005!\n\n# TULIS KODEMU\nn = len(ACTIVE)\nmean_a = \nte = \nir_gross = \nir_net = \n\nprint(f"Active return rata2: {mean_a:.2%}")\nprint(f"Tracking error     : {te:.2%}")\nprint(f"IR gross           : {ir_gross:.2f}")\nprint(f"IR net (fee {FEE:.1%}): {ir_net:.2f}")`,
        lockLines: 3,
        solution: `import math\nACTIVE = [0.03, -0.01, 0.04, 0.02, -0.02, 0.05, 0.01, 0.03]\nFEE = 0.015  # coba ubah ke 0.005!\n\n# TULIS KODEMU\nn = len(ACTIVE)\nmean_a = sum(ACTIVE)/n\nte = math.sqrt(sum((a-mean_a)**2 for a in ACTIVE)/(n-1))\nir_gross = mean_a/te\nir_net = (mean_a - FEE)/te\n\nprint(f"Active return rata2: {mean_a:.2%}")\nprint(f"Tracking error     : {te:.2%}")\nprint(f"IR gross           : {ir_gross:.2f}")\nprint(f"IR net (fee {FEE:.1%}): {ir_net:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "te", value: 0.024165, tol: 0.0005, label: "`te` ≈ 0.0242", msg: "Simpangan baku sampel dari 8 active return tahunan." },
          { kind: "equal", task: "t2", name: "ir_gross", value: 0.7759, tol: 0.01, label: "`ir_gross` ≈ 0.78", msg: "0,01875/0,024165 ≈ 0,78 \u2014 terlihat baik sebelum fee." },
          { kind: "equal", task: "t2", name: "ir_net", value: 0.1552, tol: 0.01, label: "`ir_net` ≈ 0.16", msg: "(0,01875−0,015)/0,024165 ≈ 0,16 \u2014 fee memakan sebagian besar. Nego atau pecat." },
          { kind: "stdout_matches", task: "t3", pattern: "IR net \\(fee 1\\.5%\\): 0\\.16", label: "`print` menampilkan IR net 0.16", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "IR > 0,5 baik; IR net < 0,3 konsisten = pecat/nego.",
    },
    {
      id: "lab-core-satellite",
      eyebrow: "Langkah 4 · Lab core-satellite",
      title: "Berapa fee struktur 80/20?",
      prose: [
        "Hitung fee total struktur core-satellite vs all-aktif, penghematannya, dan alpha net ekspektasian. Satelit harus menghasilkan alpha di atas fee-nya sendiri \u2014 jika tidak, perbesar core (atau full pasif).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `fee_total` core-satellite" },
        { id: "t2", text: "Hitung `alpha_net` ekspektasian" },
        { id: "t3", text: "Cetak hasil dengan `print`" },
      ],
      expected: "Fee core-satellite: 0.36%  Hemat: 0.64%/tahun  Alpha net: 0.04%",
      hints: [
        "fee_total = (1−SATELIT)×FEE_CORE + SATELIT×FEE_SAT.",
        "alpha_net = SATELIT×(ALPHA_SAT − FEE_SAT) − (1−SATELIT)×FEE_CORE.",
        "hemat = fee all-aktif − fee_total.",
      ],
      code: {
        starter: `SATELIT = 0.2  # bobot satelit (coba ubah ke 0.5!)\nFEE_CORE, FEE_SAT = 0.002, 0.01\nALPHA_SAT = 0.02  # ekspektasi alpha satelit (sebelum fee)\nFEE_ALLAKTIF = 0.01\n\n# TULIS KODEMU\nfee_total = \nalpha_net = \nhemat = FEE_ALLAKTIF - fee_total\n\nprint(f"Fee core-satellite: {fee_total:.2%}")\nprint(f"Fee all-aktif     : {FEE_ALLAKTIF:.2%}")\nprint(f"Hemat             : {hemat:.2%}/tahun")\nprint(f"Alpha net ekspektasi: {alpha_net:.2%}")`,
        lockLines: 4,
        solution: `SATELIT = 0.2  # bobot satelit (coba ubah ke 0.5!)\nFEE_CORE, FEE_SAT = 0.002, 0.01\nALPHA_SAT = 0.02  # ekspektasi alpha satelit (sebelum fee)\nFEE_ALLAKTIF = 0.01\n\n# TULIS KODEMU\nfee_total = (1-SATELIT)*FEE_CORE + SATELIT*FEE_SAT\nalpha_net = SATELIT*(ALPHA_SAT - FEE_SAT) - (1-SATELIT)*FEE_CORE\nhemat = FEE_ALLAKTIF - fee_total\n\nprint(f"Fee core-satellite: {fee_total:.2%}")\nprint(f"Fee all-aktif     : {FEE_ALLAKTIF:.2%}")\nprint(f"Hemat             : {hemat:.2%}/tahun")\nprint(f"Alpha net ekspektasi: {alpha_net:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fee_total", value: 0.0036, tol: 1e-9, label: "`fee_total` = 0.0036", msg: "0,8×0,002 + 0,2×0,01 = 0,36% (vs 1% all-aktif)." },
          { kind: "equal", task: "t2", name: "alpha_net", value: 0.0004, tol: 1e-9, label: "`alpha_net` = 0.0004", msg: "0,2×(0,02−0,01) − 0,8×0,002 = 0,04%. Tipis \u2014 satelit harus benar-benar ber-alpha." },
          { kind: "stdout_matches", task: "t3", pattern: "Fee core-satellite: 0\\.36%", label: "`print` menampilkan fee 0.36%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Core 80% (index + smart beta) + satelit 20% (aktif selektif) + aturan pecat tertulis.",
    },
    {
      id: "smart-beta",
      eyebrow: "Langkah 5 · Smart beta",
      title: "Jalan ketiga: premi faktor, bukan alpha",
      prose: [
        "Smart beta adalah indeks berbobot faktor (bukan kapitalisasi) \u2014 value, momentum, quality, low-vol, size \u2014 dengan aturan transparan dan fee murah (0,2\u20130,4%). Ini jalan ketiga: sistematis dan murah seperti pasif, tetapi dengan tilt disengaja seperti aktif.",
        "Peringatan keras: smart beta = premi faktor (risiko!), bukan alpha (skill!). Value = risiko distress; momentum = risiko reversal. Premi adalah kompensasi rasa sakit: faktor value underperform selama 13 tahun (2007\u20132020); investor yang menyerah di 2019 tepat melewatkan rebound +30% (2021\u20132022). Tanpa keyakinan dan horizon dekade, jangan ambil preminya. Ada 400+ \u2018faktor\u2019 yang kebanyakan data mining \u2014 hanya yang berlogika ekonomi dan lolos out-of-sample yang layak.",
        "Faktor = siklus, bukan jaminan. Smart beta = komitmen jangka panjang, bukan taktik tahunan. Dan jangan lakukan factor timing (\u2018value murah → overweight!\u2019) \u2014 datanya gagal; pilih faktor lalu pegang selamanya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Smart beta = alpha murah.\u2019 Salah: itu premi faktor = kompensasi risiko, bukan skill. Bayar fee aktif untuk faktor = tertipu; ambil faktor tanpa horizon dekade = menyerah di titik terburuk.",
      },
      reference: "Premi faktor butuh horizon & keyakinan \u2014 bukan backtest cantik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Lima keputusan ekuitas",
      prose: [
        "Peta keputusan lesson ini. (1) Pilih manajer aktif \u2192 tuntut IR net 3\u20135 tahun > 0,3: bukti, bukan cerita. (2) Tidak ada keyakinan alpha \u2192 pasif penuh (fee 0,1%): biaya pasti, alpha harapan. (3) Mau tilt sistematis murah \u2192 smart beta dengan faktor berlogika ekonomi. (4) Struktur default \u2192 core-satellite + aturan pecat tertulis (underperform 5 tahun → review; 7 tahun → potong). (5) Hierarki: pasif = fondasi, smart beta = tilt, aktif = satelit kecil yang terbukti. Jangan terbalik.",
        "Aturan 10 detik: IR net, bukan return mentah. Fee = alpha pasti (untuk manajer). Faktor butuh horizon dekade. Aturan pecat tertulis. Aturan 3-pertanyaan sebelum bayar aktif: active share > 60%? Alpha neto konsisten? Fee < alpha? Tidak ketiganya = pasif.",
      ],
      tasks: [],
      reference: "Core-satellite tanpa rebalance = bom waktu: satelit yang menang tumbuh dominan.",
    },
    {
      id: "minicase-buffett",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Rp1 miliar untuk amal \u2014 anatomi kemenangan",
      prose: [
        "Buffett (2008): S&P 500 vs 5 fund-of-hedge-funds, 10 tahun. Hasil: +125% vs +36%. Mengapa hedge funds kalah telak? Fee 2-and-20 = alpha negatif yang pasti, fund-of-funds = fee ganda, IR net hancur. Biaya = kepastian.",
        "Apakah ini bukti \u2018pasif selalu menang\u2019? Tidak \u2014 ini bukti \u2018biaya tinggi + diversifikasi berlebihan = kalah\u2019. Manajer terkonsentrasi ber-IR tinggi tetap ada \u2014 jarang. Dampak fee 20 tahun dengan selisih 3,55%/tahun: (1,0355)^20 = 2,01× \u2014 ETF bernilai dua kali lipat; dari Rp1 miliar, selisihnya Rp1 miliar lebih banyak.",
        "Aktif masih masuk akal jika: pasar kurang efisien (small-cap, EM); active share > 60% (truly active); alpha neto terbukti 3+ tahun; fee wajar (< alpha). Default = pasif; aktif = pengecualian terbukti. Struktur yang menggabungkan pelajarannya: core-satellite \u2014 core pasif murah (pelajaran Buffett) + satelit aktif selektif ber-IR terbukti + aturan pecat.",
      ],
      tasks: [],
      reference: "SPIVA: 87% large-cap aktif kalah 10 tahun; 94% kalah 20 tahun. Waktu = musuh aktif mahal.",
    },

    {
      id: "style-management",
      eyebrow: "Langkah 8 · Style tingkat lanjut + chart",
      title: "Style management: drift, completeness fund, dan analisis returns-based",
      prose: [
        "Mandat \u201Cvalue\u201D yang dipegang manajer growth saat growth sedang panas adalah style drift \u2014 dan ia merusak arsitektur portofolio: alokasi 50% value / 50% growth yang dirancang untuk diversifikasi tiba-tiba menjadi 80% growth tanpa sepengetahuan pemilik dana. Deteksinya: returns-based style analysis (Sharpe 1992) \u2014 regresikan return manajer ke indeks style (value, growth, small, large) dengan bobot non-negatif yang dijumlahkan 1. Contoh: manajer \u201Cvalue\u201D dengan R² 0,92 terhadap kombinasi 30% value + 55% growth + 15% small \u2014 verdict: drift terkonfirmasi, panggil manajernya atau ganti.",
        "Completeness fund adalah obat portofolio: jika gabungan manajermu menghasilkan eksposur 70% large-growth / 30% large-value sementara policy-mu 50/50, tambahkan completeness fund (mis. ETF small-value) yang mengisi selisihnya \u2014 bukan mengganti manajer yang drift (mahal, memakan waktu), melainkan menetralkan biasnya di level portofolio. Hitungannya: selisih 20 poin pada large-cap → alokasikan ~15% portofolio ke small-value untuk menyeimbangkan eksposur faktor total. Completeness fund membuat arsitektur tahan terhadap ketidaksempurnaan manajer.",
        "Kapan style rotation (tilt value vs growth taktis) layak \u2014 dan kapan tidak. Datanya brutal: value-minus-growth spread punya Sharpe jangka panjang ~0,3\u20130,4 tetapi drawdown-nya bisa 13 tahun (2007\u20132020). Aturan praktisi: (1) tilt maksimal ±10% dari policy \u2014 spread yang tidak pasti tidak layak dipertaruhkan besar; (2) sinyal harus valuasi relatif ekstrem (spread P/E value vs growth di persentil 90+ historis), bukan narasi; (3) horizon minimum 5 tahun tertulis di IPS \u2014 jika komite tidak sanggup menahan 3 tahun underperform, jangan tilt sama sekali. Kebanyakan \u201Cstyle rotation\u201D institusi gagal bukan karena sinyalnya salah, melainkan karena horizonnya lebih pendek dari siklus faktornya.",
        "Cara membaca: kolom = gaya valuasi (value/blend/growth), baris = ukuran kapitalisasi (small/mid/large). Kotak biru = mandat resmi manajer (large-value); kotak merah = hasil regresi style — di mana return manajer sebenarnya “duduk”.",
        "Interpretasi: manajer ini hanya 30% value sesuai mandat, tetapi 55% berperilaku seperti large-growth — style drift terkonfirmasi (R² 0,92). Artinya alokasi 50/50 value/growth yang dirancang untuk diversifikasi diam-diam menjadi condong growth. Obatnya bukan langsung pecat: netralkan biasnya di level portofolio dengan completeness fund.",
      ],
      figure: {
        svg: STYLEBOX_SVG,
        alt: "Style box 3x3: manajer bermandat large-value terdeteksi 55 persen large-growth — style drift terkonfirmasi.",
        caption: "Style box manajer “value”: regresi style menunjukkan 55% eksposur large-growth — drift terkonfirmasi, diversifikasi portofolio gabungan rusak diam-diam.",
      },
      tasks: [],
      reference: "Drift dideteksi via regresi style; completeness fund menetralkan di level portofolio; tilt style ≤10% + horizon 5 thn.",
    },
    {
      id: "tax-aware-equity",
      eyebrow: "Langkah 9 · Pajak portofolio saham",
      title: "Tax-aware management: pajak sebagai alpha",
      prose: [
        "Di akun kena pajak, tax drag adalah \u201Cfee tersembunyi\u201D yang tidak muncul di factsheet. Mekanismenya: tiap penjualan merealisasikan gain yang kena pajak tahun itu juga, memotong modal yang berbunga majemuk. Contoh: portofolio Rp1 miliar, gain Rp120 juta setahun, tarif pajak gain 10%. Manajer A turnover 120% (merealisasikan ~Rp120 juta) → pajak Rp12 juta/tahun. Manajer B turnover 15% (merealisasikan ~Rp18 juta) → pajak Rp1,8 juta/tahun. Selisih Rp10,2 juta ≈ 1% per tahun \u2014 setiap tahun, berbunga majemuk 20 tahun ≈ 22% kekayaan. Dua manajer dengan \u201Creturn bruto sama\u201D bisa berbeda 1% neto hanya dari turnover.",
        "Teknik tax-aware di level portofolio: (1) prioritaskan penjualan posisi RUGI (tax-loss harvesting) untuk meng-offset gain yang harus direalisasikan saat rebalance \u2014 jadwalkan Desember; (2) tunda realisasi gain: jika dua kandidat jual setara, jual yang holding period-nya sudah melewati ambang tarif lebih rendah (di yurisdiksi bertingkat); (3) sumbangkan saham yang sangat untung (bukan kas) untuk filantropi \u2014 menghindari realisasi gain sepenuhnya; (4) untuk rebalancing, pakai arus kas baru dan dividen dulu sebelum menjual. Di Indonesia, PPh final saham 0,1% dari nilai transaksi terlihat kecil \u2014 tetapi ia kena di SETIAP transaksi (beli maupun jual), sehingga turnover 200% menghabiskan 0,4% per tahun hanya dari PPh, di luar spread dan komisi.",
        "Aturan keputusan: untuk akun kena pajak, evaluasi manajer dengan after-tax return dan after-tax tracking error \u2014 bukan bruto. Manajer \u201Cagresif\u201D dengan turnover 150% harus mengalahkan manajer buy-and-hold sebesar tax drag-nya (1\u20132%) SEBELUM fee \u2014 hampir tidak pernah terjadi. Default akun kena pajak: strategi low-turnover + harvesting tahunan; aktif high-turnover hanya di akun tax-deferred (dana pensiun). Lokasi menentukan strategi: agresif di akun pensiun, sabar di akun kena pajak.",
      ],
      tasks: [],
      reference: "Tax drag ≈ 1%/thn per 100% turnover; ukur manajer dari after-tax return; agresif di tax-deferred.",
    },

    {
      id: "lab-tax-drag",
      eyebrow: "Langkah 10 · Lab tax drag",
      title: "Turnover adalah pajak tersembunyi",
      prose: [
        "Kuantifikasi tax drag dua manajer dengan return bruto SAMA (gain Rp120 juta dari Rp1 miliar) tetapi turnover beda: A 120%, B 15%. Tarif pajak gain 10%. Hitung pajak tahunan masing-masing dan penghematan B \u2014 itulah \u201Calpha pajak\u201D.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pajak_a` dan `pajak_b` (Rp juta)" },
        { id: "t2", text: "Hitung `hemat` dan `drag_pct` (persen modal)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "pajak_a=12.0  pajak_b=1.8  hemat=10.2  (Rp juta, ~1.02%/tahun)",
      hints: [
        "realisasi = GAIN * min(1, turnover).",
        "pajak = realisasi * TARIF.",
        "hemat = pajak_a - pajak_b; drag_pct = hemat / MODAL * 100.",
      ],
      code: {
        starter: `# Tax drag turnover (Rp juta)\nMODAL, GAIN, TARIF = 1000, 120, 0.10\nTURN_A, TURN_B = 1.20, 0.15\n\n# TULIS KODEMU\npajak_a = \npajak_b = \nhemat = \ndrag_pct = \n\nprint(f"pajak_a={pajak_a:.1f}  pajak_b={pajak_b:.1f}  hemat={hemat:.1f}  drag~{drag_pct:.2f}%/thn")`,
        lockLines: 2,
        solution: `# Tax drag turnover (Rp juta)\nMODAL, GAIN, TARIF = 1000, 120, 0.10\nTURN_A, TURN_B = 1.20, 0.15\n\n# TULIS KODEMU\npajak_a = GAIN * min(1, TURN_A) * TARIF\npajak_b = GAIN * min(1, TURN_B) * TARIF\nhemat = pajak_a - pajak_b\ndrag_pct = hemat / MODAL * 100\n\nprint(f"pajak_a={pajak_a:.1f}  pajak_b={pajak_b:.1f}  hemat={hemat:.1f}  drag~{drag_pct:.2f}%/thn")`,
        checks: [
          { kind: "equal", task: "t1", name: "pajak_a", value: 12.0, tol: 1e-9, label: "`pajak_a` = 12.0", msg: "120 × 1,0 × 10% = 12. Turnover tinggi merealisasikan semua gain." },
          { kind: "equal", task: "t1", name: "pajak_b", value: 1.8, tol: 1e-9, label: "`pajak_b` = 1.8", msg: "120 × 0,15 × 10% = 1,8. Buy-and-hold menunda pajak." },
          { kind: "equal", task: "t2", name: "hemat", value: 10.2, tol: 1e-9, label: "`hemat` = 10.2", msg: "12 − 1,8 = 10,2 ≈ 1,02% modal per tahun \u2014 alpha pajak." },
          { kind: "stdout_matches", task: "t3", pattern: "pajak_a=12\\.0\\s+pajak_b=1\\.8\\s+hemat=10\\.2", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Return bruto sama ≠ return neto sama: turnover 120% vs 15% = selisih 1%/tahun.",
    },

    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "IR = active return / TE; nilai manajer dari IR net 3\u20135 tahun (> 0,5 baik), bukan return mentah.",
        "Fee 2-and-20 mengubah 10% bruto menjadi 6,4% neto; selisih 3,55%/tahun = 2× lipat dalam 20 tahun.",
        "Smart beta = premi faktor (risiko) yang sistematis dan murah \u2014 bukan alpha; butuh horizon dekade.",
        "Core-satellite (80/20): beta murah + tembakan alpha terkendali + aturan pecat tertulis + rebalance.",
        "Aktif hanya jika terbukti: pasar kurang efisien, active share > 60%, alpha neto konsisten, fee < alpha.",
      ],
      next: { label: "C9 \u2014 Derivatives Overlay", href: "/v2/learn/pm-c9-derivatives-overlay" },
      quiz: [
        {
          q: "Manajer mandat \u201Cvalue\u201D, tetapi regresi style menunjukkan 55% eksposur growth. Tindakan tepat?",
          options: [
            { text: "Biarkan \u2014 return-nya bagus", why: "Salah: return bagus dari drift menghancurkan arsitektur diversifikasi portofolio gabungan." },
            { text: "Konfirmasi style drift \u2014 panggil manajer atau netralkan via completeness fund", why: "Tepat: drift terdeteksi via returns-based style analysis; completeness fund mengisi selisih di level portofolio.", correct: true },
            { text: "Langsung pecat tanpa diskusi", why: "Terburu-buru: drift bisa disengaja dan dikomunikasikan; pecat adalah opsi terakhir setelah dialog." },
            { text: "Ubah policy jadi 100% growth", why: "Salah: mengubah policy karena satu manajer drift = menyerahkan arsitektur ke manajer." },
          ],
        },
        {
          q: "Active return +2%, TE 8%. Berapa IR?",
          options: [
            { text: "0,16", why: "Itu IR net setelah fee 1,5% ((2−1,5)/8) \u2014 bukan IR gross yang ditanya." },
            { text: "0,25 (lemah)", why: "Tepat: 2/8 = 0,25. Net setelah fee 1,5% → 0,06. Pecat atau nego!", correct: true },
            { text: "0,5", why: "Itu ambang \u2018baik\u2019 \u2014 manajer ini jauh di bawahnya." },
            { text: "1,0", why: "Itu level luar biasa yang sangat jarang \u2014 bukan 0,25." },
          ],
        },
        {
          q: "Fundamental law of active management: IR ≈ ?",
          options: [
            { text: "IC + Breadth", why: "Salah: bukan penjumlahan \u2014 breadth masuk sebagai akar." },
            { text: "IC × √Breadth", why: "Tepat: skill per taruhan × akar jumlah taruhan independen.", correct: true },
            { text: "TE × fee", why: "Salah: itu bukan fundamental law \u2014 TE dan fee tidak menentukan IR." },
            { text: "Return − risiko", why: "Salah: itu bukan rumus IR maupun fundamental law." },
          ],
        },
        {
          q: "Faktor value underperform 13 tahun (2007\u20132020). Pelajaran?",
          options: [
            { text: "Faktor value mati", why: "Salah: ia rebound +30% pada 2021\u20132022 \u2014 yang \u2018mati\u2019 adalah kesabaran investor." },
            { text: "Premi = kompensasi rasa sakit; butuh horizon dekade", why: "Tepat: yang menyerah di 2019 melewatkan rebound. Tanpa komitmen, jangan ambil premi.", correct: true },
            { text: "Ganti faktor tiap tahun", why: "Salah: factor timing terbukti gagal \u2014 itu justru membeli mahal, menjual murah." },
            { text: "Faktor adalah scam", why: "Salah: premi berlogika ekonomi dan lolos out-of-sample itu nyata \u2014 tetapi tidak gratis." },
          ],
        },
        {
          q: "Buffett bet: S&P +125% vs hedge fund +36% (10 tahun). Pelajaran UTAMA?",
          options: [
            { text: "Pasif selalu menang \u2014 jangan pernah aktif", why: "Terlalu jauh: manajer terkonsentrasi ber-IR tinggi tetap ada, meski jarang." },
            { text: "Biaya = kepastian; fee 2-and-20 + fee ganda menghancurkan alpha", why: "Tepat: pelajarannya tentang biaya, bukan tentang pasif vs aktif secara mutlak.", correct: true },
            { text: "Hedge fund bodoh", why: "Salah: mereka manajer terbaik \u2014 yang mengalahkan mereka adalah aritmetika fee." },
            { text: "Saham selalu naik", why: "Salah: 2008 keduanya jatuh \u2014 pelajarannya bukan tentang arah pasar." },
          ],
        },
      ],
    },
  ],
};
