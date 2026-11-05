import type { V2Lesson } from "../lib/types";

// Sketsa stilasi premia kumulatif faktor value (HML): naik jangka panjang,
// tetapi datar/negatif selama 2007-2020. BUKAN data aktual — ilustrasi konsep.
const HML_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Sketsa premia kumulatif faktor value: naik 2000-2006, datar turun 2007-2020, naik lagi 2021-2023.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">tinggi</text><text x="54" y="124">0</text><text x="54" y="224">rendah</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="90" y="240">2000</text><text x="180" y="240">2006</text><text x="300" y="240">2013</text><text x="420" y="240">2020</text><text x="490" y="240">2023</text></g>
<polyline points="70,200 110,170 150,140 190,110 230,120 270,135 310,150 350,160 390,150 430,165 470,140 495,120" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<rect x="225" y="20" width="215" height="200" fill="var(--c4)" opacity="0.12"/>
<text x="330" y="40" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">2007-2020: value kalah 13 tahun</text>
<text x="120" y="150" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">premia kumulatif HML (sketsa)</text>
<text x="470" y="105" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2021+: rebound</text>
</svg>`;

export const pmd7: V2Lesson = {
  slug: "pm-d7-factor-investing",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D7 — Factor Investing: dari Premia ke Portofolio Nyata",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-manajer-2009",
      eyebrow: "Langkah 1 · Cerita",
      title: "Manajer yang benar secara akademis, nyaris dipecat",
      prose: [
        "2009. Seorang manajer dana quant di London menatap layar dengan tangan gemetar. Dua tahun sebelumnya ia membangun portofolio persis seperti kata jurnal akademik: tilt ke saham value (murah) dan momentum (tren naik) — dua faktor dengan premia positif yang terdokumentasi puluhan tahun data. Backtest-nya indah. Teorinya kokoh. Komite investasinya mengangguk-angguk.",
        "Lalu 2008 datang. Value — saham-saham bank yang “murah” — ternyata murah karena memang sekarat. Momentum — yang tadinya long bank, short komoditas — berbalik arah tepat saat pasar berbalik. Dalam 18 bulan, portofolio “berbasis sains” itu kehilangan hampir sepertiga nilainya, lebih buruk dari pasar. Klien menelepon: “Bukankah ini strategi yang terbukti?”",
        "Twist-nya: tidak ada yang salah dengan matematikanya. Premia faktor memang positif — RATA-RATA, dalam jangka SANGAT panjang. Masalahnya: faktor adalah kompensasi atas risiko, dan risiko artinya ia gagal tepat di saat kamu paling butuh uang. Value crash saat krisis perbankan (2008). Momentum crash saat pasar berbalik arah (2009). Faktor yang tidak pernah mengecewakan mungkin bukan faktor — melainkan hasil data mining.",
        "Pelajaran pahit manajer itu menjadi fondasi lesson ini: factor investing bukan mesin cuan otomatis, melainkan kontrak dengan rasa sakit. Kamu dibayar premia KARENA menanggung periode-periode buruk yang membuat orang lain menyerah. Pertanyaannya bukan “faktor mana yang cuan?”, melainkan “rasa sakit mana yang sanggup kamu tanggung — dan bagaimana membangun portofolio yang selamat melewatinya?”",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan apa itu faktor dan premia faktor dengan contoh value, size, momentum, quality; (2) membaca model Fama-French dan mengartikan setiap simbolnya; (3) mengukur eksposur faktor sebuah portofolio lewat regresi; (4) menghitung premia long-short dari data dan menguji signifikansinya; (5) memutuskan kapan memakai multifactor, long-only, atau long-short — dengan sadar akan biaya dan rasa sakitnya.",
        "Daftar isi: 1) Cerita manajer 2009 · 2) Modal dasar: CAPM & regresi (ringkas) · 3) Apa itu faktor & premia · 4) Lab: hitung premia HML · 5) Rasa sakit faktor: timing, crowding, crash · 6) Lab: simulasi momentum crash · 7) Peta keputusan · 8) Mini-case: dana Rp100M · 9) Checkpoint.",
        "Metadata: ±55 menit · 2 lab Python · 1 chart · 5 kuis · 1 mini-case. Prasyarat: tidak ada — semua modal diringkas di Langkah 2.",
      ],
      tasks: [],
      reference: "Premia faktor = upah menanggung risiko. Tidak ada upah tanpa rasa sakit.",
    },
    {
      id: "modal-dasar",
      eyebrow: "Langkah 2 · Modal dasar (ringkas, self-contained)",
      title: "Dua fondasi yang dibawa masuk — tanpa perlu buka lesson lain",
      prose: [
        "Fondasi 1 — CAPM satu faktor. Model harga aset klasik berkata: return harapan sebuah saham = return bebas risiko + beta × (premia pasar). Beta mengukur kepekaan terhadap SATU faktor: pasar. Selisih return aktual dengan prediksi CAPM disebut alpha — “keterampilan” manajer setelah dikoreksi risiko pasar. Intinya: CAPM mengajarkan bahwa return bisa diurai menjadi kompensasi risiko (beta) dan sisanya (alpha). Factor investing lahir dari pertanyaan: bagaimana kalau faktornya bukan cuma pasar?",
        "Fondasi 2 — regresi berganda sebagai mesin pengurai. Regresi memecah return portofolio menjadi kontribusi tiap variabel penjelas: koefisien (slope) = eksposur terhadap variabel itu, R² = seberapa besar variasi return yang dijelaskan model. Dua peringatan yang dibawa ke lesson ini: (a) variabel yang hilang (omitted) membuat koefisien “mencuri” efek variabel lain — jadi kontrol dulu sebelum klaim; (b) R² tinggi bukan bukti kausalitas dan bukan jaminan masa depan. Di lesson ini regresi dipakai untuk menjawab: “portofolioku sebenarnya bertaruh pada faktor apa?”",
        "Dengan dua fondasi ini kamu tidak butuh apa-apa lagi: CAPM memberi logika “return = kompensasi risiko + alpha”, regresi memberi alat “ukur eksposur tiap faktor”. Factor investing = CAPM yang faktornya diperbanyak, diukur dengan regresi, lalu dibangun menjadi portofolio nyata.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: alpha menyusut saat faktor bertambah",
        body: "Banyak “alpha” manajer saham ternyata cuma eksposur value/size/momentum yang tidak diakui. Begitu kamu mengontrol faktor-faktor itu lewat regresi, alpha yang tersisa — keterampilan murni — biasanya jauh lebih kecil. Factor investing memaksa kejujuran: bayar mahal hanya untuk alpha sejati, bukan untuk beta yang dikemas ulang.",
      },
      reference: "CAPM: 1 faktor (pasar). Factor investing: N faktor. Regresi: alat ukurnya.",
    },
    {
      id: "konsep-faktor-premia",
      eyebrow: "Langkah 3 · Konsep inti",
      title: "Faktor: karakteristik yang dibayar risiko",
      prose: [
        "Definisi kerja: faktor adalah karakteristik aset (atau strategi) yang secara historis memberi premia — return berlebih di atas pasar — sebagai kompensasi atas suatu risiko. Lima faktor “klasik” yang paling sering dipakai: size (saham kecil mengalahkan besar), value (saham murah mengalahkan mahal), momentum (pemenang terus menang beberapa bulan), quality/profitability (perusahaan menguntungkan), dan low volatility (saham kalem mengalahkan yang liar — anomali!).",
        "Kepribadiannya: faktor itu seperti lima karyawan dengan gaya kerja berbeda. Value si pemburu diskon — sabar, sering terlihat bodoh bertahun-tahun, lalu panen saat pasar sadar. Momentum si peselancar — lincah menunggangi tren, tapi hancur saat ombak berbalik. Quality si akuntan teliti — tidak spektakuler, jarang mengecewakan. Low-vol si penjaga malam — membosankan sampai krisis datang. Size si anak magang — potensial, tapi datanya paling diperdebatkan.",
        "Rumusnya — Fama-French tiga faktor, fondasi akademiknya:",
      ],
      formula: String.raw`R_i - R_f = \alpha + \beta_{mkt}(R_m - R_f) + s \cdot SMB + h \cdot HML + \epsilon`,
      formulaNote:
        "R_i − R_f = excess return aset; α = alpha (return tak dijelaskan faktor); β_mkt = eksposur ke pasar; R_m − R_f = premia pasar; s = eksposur ke faktor size; SMB = Small Minus Big (premia size: return saham kecil minus besar); h = eksposur ke faktor value; HML = High Minus Low (premia value: saham book-to-market tinggi minus rendah); ε = noise. Angka s, h positif artinya portofolio “bertaruh” pada faktor itu.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Faktor = alpha yang pasti”",
        type: "pitfall",
        body: "Yang benar: premia adalah RATA-RATA jangka panjang, bukan garansi tahunan. HML (value) negatif selama 2007–2020 — 13 tahun! Investor yang masuk 2007 dan menyerah 2019 “membuktikan” value tidak bekerja, padahal ia hanya tidak sanggup membayar harga premiannya. Premia tanpa periode buruk = bukan kompensasi risiko = kemungkinan besar ilusi data mining.",
      },
      reference: "Contoh angka: s = 0,4 dan SMB = 3% → kontribusi size = 1,2% ke return.",
    },
    {
      id: "lab-premia-hml",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung premia faktor dari data mentah",
      prose: [
        "Bangun sendiri premia HML versi mainan: return bulanan portofolio value dikurangi portofolio growth, lalu rata-ratakan dan uji apakah signifikan secara statistik (t-stat > 2). Coba ubah angka-angkanya: pada titik berapa premia berubah tanda? Itulah kerapuhan faktor dalam 12 observasi — bayangkan dengan data nyata yang penuh noise.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `premia` bulanan HML" },
        { id: "t2", text: "Hitung `t_stat` dan simpulkan signifikansinya" },
      ],
      expected: "Premia HML bulanan rata-rata: 0.38%  Annualized: 4.5%  t-stat: 0.55 (belum signifikan)",
      hints: [
        "hml = [v - g for v, g in zip(ret_value, ret_growth)]; premia = sum(hml)/len(hml).",
        "t_stat = premia / (stdev(hml) / sqrt(n)) — butuh import statistics dan math.",
        "Signifikan bila |t_stat| > 2. Dengan 12 bulan, noise mendominasi — itulah kenapa faktor butuh puluhan tahun data.",
      ],
      code: {
        starter: `# Premia faktor HML (value minus growth) — data mainan 12 bulan
import statistics, math
ret_value  = [0.02, 0.02, 0.03, 0.015, 0.01, 0.025, 0.01, -0.015, 0.02, 0.005, 0.03, -0.01]
ret_growth = [0.01, 0.02, -0.01, 0.01, 0.03, -0.005, 0.02, 0.01, -0.01, 0.015, 0.005, 0.02]

# TULIS KODEMU
hml =
premia =
sd =
t_stat =

print(f"Premia HML bulanan rata-rata: {premia:.2%}")
print(f"Annualized: {premia*12:.1%}")
print(f"t-stat: {t_stat:.2f} {'(signifikan)' if abs(t_stat) > 2 else '(belum signifikan)'}")
print("Coba: ubah 2 angka ret_value jadi negatif besar — premia ikut ambruk.")`,
        lockLines: 4,
        solution: `# Premia faktor HML (value minus growth) — data mainan 12 bulan
import statistics, math
ret_value  = [0.02, 0.02, 0.03, 0.015, 0.01, 0.025, 0.01, -0.015, 0.02, 0.005, 0.03, -0.01]
ret_growth = [0.01, 0.02, -0.01, 0.01, 0.03, -0.005, 0.02, 0.01, -0.01, 0.015, 0.005, 0.02]

# TULIS KODEMU
hml = [v - g for v, g in zip(ret_value, ret_growth)]
premia = sum(hml) / len(hml)
sd = statistics.stdev(hml)
t_stat = premia / (sd / math.sqrt(len(hml)))

print(f"Premia HML bulanan rata-rata: {premia:.2%}")
print(f"Annualized: {premia*12:.1%}")
print(f"t-stat: {t_stat:.2f} {'(signifikan)' if abs(t_stat) > 2 else '(belum signifikan)'}")
print("Coba: ubah 2 angka ret_value jadi negatif besar — premia ikut ambruk.")`,
        checks: [
          { kind: "equal", task: "t1", name: "premia", value: 0.00375, tol: 0.0005, label: "`premia` ≈ 0,38%/bulan", msg: "Rata-rata selisih value minus growth dari 12 bulan data." },
          { kind: "equal", task: "t2", name: "t_stat", value: 0.55, tol: 0.1, label: "`t_stat` ≈ 0,55", msg: "premia / (stdev / sqrt(12)). Di bawah 2 = belum signifikan." },
          { kind: "stdout_matches", task: "t2", pattern: "belum signifikan", label: "`print` menyimpulkan belum signifikan", msg: "12 bulan tidak cukup — faktor butuh puluhan tahun data." },
        ],
      },
      reference: "Premia 4% annualized TERDENGAR bagus — sampai kamu lihat t-statnya.",
    },
    {
      id: "rasa-sakit-faktor",
      eyebrow: "Langkah 5 · Konsep + chart",
      title: "Rasa sakitnya: timing, crowding, dan crash",
      prose: [
        "Tiga sumber penderitaan factor investor. Pertama, factor timing nyaris mustahil: premia datang bergerombol dan tak terduga — melewatkan 10 bulan terbaik dalam 20 tahun bisa menghapus separuh premia. Mencoba “masuk saat value murah” = market timing berbaju akademik. Kedua, crowding: setelah faktor dipublikasikan, uang membanjir masuk, valuasi spread menyempit, premia masa depan turun (ini salah satu penjelasan value 2007–2020). Ketiga, crash: momentum hancur saat pasar berbalik tajam (2009), value hancur saat sektor murahnya memang sekarat (bank 2008).",
        "Cara membaca chart: sumbu X = tahun 2000–2023, sumbu Y = nilai kumulatif premia value (HML) — naik artinya value mengalahkan growth. Area arsir = 2007–2020.",
        "Interpretasi: kurva naik 2000–2006 (value berjaya), lalu DATAR bahkan menurun selama 13 tahun — investor value 2007 harus menunggu hingga 2021 untuk “terbukti benar”. Inilah harga premia: 13 tahun terlihat bodoh. Pelajaran praktisnya: sizing posisi faktor harus sekecil toleransi sabarmu; diversifikasi antar faktor (value + momentum + quality) memperhalus — tetapi tidak menghilangkan — rasa sakitnya.",
      ],
      figure: {
        svg: HML_SVG,
        alt: "Sketsa premia kumulatif faktor value: naik 2000-2006, datar-menurun 2007-2020, rebound 2021-2023.",
        caption: "Sketsa stilasi (bukan data aktual): premia value positif jangka panjang, tetapi 13 tahun datar. Rasa sakit = harga premia.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: diversifikasi antar faktor ≠ antar aset",
        body: "Value dan momentum berkorelasi NEGATIF (saat value menderita, momentum sering berjaya, dan sebaliknya). Menggabungkan keduanya bukan sekadar “lebih banyak faktor” — melainkan membangun portofolio yang rasa sakitnya saling mengimbangi. Inilah alasan produk multifactor hampir selalu mengombinasikan value + momentum + quality, bukan tiga faktor yang akur.",
      },
      reference: "“Zoo of factors”: 300+ faktor diklaim (Harvey, Liu & Zhu, 2016) — sebagian besar tidak selamat dari biaya & out-of-sample.",
    },
    {
      id: "lab-momentum-crash",
      eyebrow: "Langkah 6 · Lab",
      title: "Rasakan momentum crash 2009 di kulitmu",
      prose: [
        "Simulasikan strategi momentum 10 bulan gaya 2008–2009: 4 bulan cuan, lalu 3 bulan crash beruntun, lalu pemulihan. Hitung kekayaan kumulatif dan maximum drawdown. Coba ubah: apa jadinya bila kamu “cut loss” di bulan crash kedua? (Petunjuk: seringkali justru mengunci kerugian tepat sebelum rebound — itulah dilema factor timing.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung `wealth` kumulatif tiap bulan" },
        { id: "t2", text: "Hitung `max_dd` (maximum drawdown)" },
      ],
      expected: "Kekayaan akhir: Rp68,1jt dari Rp100jt  Max drawdown: -47.7%",
      hints: [
        "wealth: mulai 100, tiap bulan kalikan (1 + r).",
        "max_dd: lacak peak tertinggi, dd = (w - peak)/peak, ambil minimum.",
        "Format: Rp{wealth[-1]:,.1f}jt dan {max_dd:.1%}.",
      ],
      code: {
        starter: `# Momentum 2009-style: 4 bulan cuan, 3 bulan crash, 3 bulan pulih
rets = [0.05, 0.04, 0.06, 0.03, -0.15, -0.25, -0.18, 0.02, 0.03, 0.04]

# TULIS KODEMU
wealth =
max_dd =

print(f"Kekayaan akhir: Rp{wealth[-1]:,.1f}jt dari Rp100jt")
print(f"Max drawdown: {max_dd:.1%}")
print("Tanya: sanggupkah kamu hold saat -48%? Itulah 'harga' premia momentum.")`,
        lockLines: 2,
        solution: `# Momentum 2009-style: 4 bulan cuan, 3 bulan crash, 3 bulan pulih
rets = [0.05, 0.04, 0.06, 0.03, -0.15, -0.25, -0.18, 0.02, 0.03, 0.04]

# TULIS KODEMU
wealth = [100.0]
for r in rets:
    wealth.append(wealth[-1] * (1 + r))
peak = wealth[0]
max_dd = 0.0
for w in wealth:
    peak = max(peak, w)
    max_dd = min(max_dd, (w - peak) / peak)

print(f"Kekayaan akhir: Rp{wealth[-1]:,.1f}jt dari Rp100jt")
print(f"Max drawdown: {max_dd:.1%}")
print("Tanya: sanggupkah kamu hold saat -48%? Itulah 'harga' premia momentum.")`,
        checks: [
          { kind: "equal", task: "t1", name: "wealth", value: 68.10, tol: 0.5, label: "`wealth` akhir ≈ Rp68,1jt", msg: "100 × Π(1+r) untuk 10 bulan." },
          { kind: "equal", task: "t2", name: "max_dd", value: -0.4772, tol: 0.01, label: "`max_dd` ≈ −47,7%", msg: "Drawdown terdalam dari peak Rp119,2jt ke Rp62,3jt." },
          { kind: "stdout_matches", task: "t2", pattern: "Max drawdown: -47", label: "`print` menampilkan drawdown −45%", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Crash 2009 nyata: strategi momentum AS kehilangan sekitar 40% dalam hitungan bulan.",
    },
    {
      id: "peta-keputusan-faktor",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Faktor mana, kemasan apa?",
      prose: [
        "Skenario 1 — Dana pensiun, horizon 20 tahun, biaya harus murah. → Multifactor long-only murah (ETF value+quality+low-vol), rebalance tahunan. Alasan: horizon panjang sanggup membayar “harga” 13 tahun; long-only menghindari biaya short; diversifikasi antar faktor menghaluskan rasa sakit.",
        "Skenario 2 — Hedge fund, boleh short, tim quant kuat. → Long-short faktor murni + kontrol crowding (pantau valuasi spread & arus dana). Alasan: short memberi eksposur faktor bersih; tetapi biaya pinjam saham dan crowding bisa memakan premia — ukur net-of-cost, bukan gross.",
        "Skenario 3 — Investor ritel Indonesia, data lokal terbatas. → Jangan klaim “faktor Indonesia” dari backtest 5 tahun (noise!). Pakai faktor global yang tereplikasi via reksa dana/ETF murah; waspadai risiko kurs. Alasan: faktor butuh puluhan tahun data lintas rezim; faktor lokal sempit = zoo of factors versi domestik.",
        "Skenario 4 — Manajer aktif yang “punya view” soal timing. → Factor timing HANYA dengan sinyal valuasi spread ekstrem + aturan tertulis + batas ukuran (mis. tilt ±10%). Alasan: timing diskresioner = market timing; tanpa disiplin ia menjadi alasan untuk overtrade.",
        "Aturan praktis 10 detik: (1) premia tanpa teori ekonomi + out-of-sample = tolak; (2) hitung SELALU net-of-cost (turnover momentum tinggi!); (3) sizing = toleransi rasa sakitmu, bukan keyakinanmu; (4) diversifikasi antar faktor yang berkorelasi negatif; (5) tulis kapan kamu akan menyerah SEBELUM mulai — jika tidak, pasar yang menentukannya untukmu.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Backtest bagus = faktor valid”",
        type: "pitfall",
        body: "Yang benar: dengan 300+ faktor yang diuji, sebagian PASTI terlihat bagus karena keberuntungan (data mining). Syarat faktor layak pakai: (a) logika ekonomi yang masuk akal (kompensasi risiko atau bias perilaku persisten), (b) bekerja out-of-sample dan lintas negara, (c) selamat setelah biaya transaksi & pajak. Gagal satu = perlakukan sebagai noise, bukan premia.",
      },
      reference: "Biaya membunuh faktor lemah: momentum turnover >100%/tahun — spread & komisi bukan detail kecil.",
    },
    {
      id: "minicase-dana-100m",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Dana Rp100M di ambang 2008",
      prose: [
        "Akhir 2007. Sebuah dana pensiun kecil Rp100M menyetujui tilt faktor: 60% pasar + 20% value + 20% momentum (long-only, via reksa dana faktor). Ekspektasi konsultan: premia gabungan +2%/tahun di atas pasar. Lalu skenario stres 2008–2009 tiba: pasar −20%, value −30% (bank-bank murah ternyata sekarat), momentum −45% (crash pembalikan).",
        "Pertanyaan: (a) Hitung kerugian portofolio. (b) Apakah tilt faktor “gagal”? (c) Keputusan apa yang seharusnya diambil komite di titik drawdown terdalam — cut, hold, atau tambah?",
        "Pembahasan. (a) Kerugian = 0,6×(−20%) + 0,2×(−30%) + 0,2×(−45%) = −12% −6% −9% = −27% → Rp27M, dana tersisa Rp73M. Lebih buruk dari pasar (−20%) — tilt justru memperparah! (b) Tidak “gagal” secara logika faktor: inilah risiko yang dibayar premia. Yang gagal = ekspektasi & sizing: komite tidak diberi tahu bahwa skenario ini ADA dalam distribusi. (c) Jawaban dewasa: HOLD sesuai IPS — karena menjual di dasar mengunci kerugian dan menghancurkan seluruh logika premia jangka panjang; TETAPI hanya valid jika (i) tilt size memang sesuai toleransi, dan (ii) aturan “kapan menyerah” sudah ditulis sebelum mulai. Pelajaran umum: factor investing gagal bukan di spreadsheet, melainkan di ruang rapat — saat rasa sakit melebihi kontrak yang disepakati.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: tulis kontrak rasa sakit di awal",
        body: "Sebelum memakai faktor apa pun, tulis satu paragraf: “Saya memakai value karena ___. Saya akan bertahan selama ___. Saya menyerah jika ___.” Tanpa kontrak ini, setiap drawdown terasa seperti bukti faktornya rusak — padahal itu harga yang sudah disepakati.",
      },
      reference: "Sizing = fungsi toleransi, bukan keyakinan. Keyakinan itu murah; toleransi yang diuji.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Lima pertanyaan campuran dari semua langkah — dari premia hingga keputusan portofolio nyata."],
      tasks: [],
      summary: [
        "Faktor = karakteristik yang dibayar premia sebagai kompensasi risiko (size, value, momentum, quality, low-vol).",
        "Model Fama-French: R_i − R_f = α + β_mkt(R_m − R_f) + s·SMB + h·HML + ε — s, h = eksposur faktormu.",
        "Premia = rata-rata jangka panjang, bukan garansi: value negatif 2007–2020 (13 tahun); momentum crash 2009.",
        "Ukur eksposur via regresi; tolak faktor tanpa teori ekonomi, out-of-sample, dan ketahanan biaya (zoo of factors).",
        "Bangun portofolio nyata: diversifikasi antar faktor berkorelasi negatif, hitung net-of-cost, sizing = toleransi rasa sakit, tulis kontrak kapan menyerah.",
      ],
      next: { label: "D8 — Risk Parity & Risk Budgeting", href: "/learn/pm-d8-risk-parity-budgeting" },
      quiz: [
        {
          q: "Pada model Fama-French, h = 0,5 dan HML tahun itu = 4%. Kontribusi faktor value ke return?",
          options: [
            { text: "2%", why: "Tepat: h × HML = 0,5 × 4% = 2%. h adalah eksposur, HML adalah premianya.", correct: true },
            { text: "4%", why: "Salah: 4% adalah premia faktornya, bukan kontribusinya — harus dikali eksposur h." },
            { text: "0,5%", why: "Salah: h = 0,5 adalah eksposur (tanpa satuan %), bukan kontribusi return." },
            { text: "Tidak bisa dihitung tanpa alpha", why: "Salah: kontribusi satu faktor = eksposur × premia; alpha tidak diperlukan." },
          ],
        },
        {
          q: "Value (HML) negatif selama 2007–2020. Kesimpulan yang TEPAT?",
          options: [
            { text: "Value terbukti tidak bekerja — tinggalkan", why: "Salah: 13 tahun negatif KONSISTEN dengan premia sebagai kompensasi risiko; menyerah di dasar = membayar harga tanpa memanen upah." },
            { text: "Itulah harga premia; yang penting sizing & kontrak bertahan sudah disiapkan", why: "Tepat: premia = upah menanggung periode buruk. Keputusan rasional = ukur toleransi, bukan ganti keyakinan tiap drawdown.", correct: true },
            { text: "Ganti ke growth karena sedang tren", why: "Salah: itu performance chasing — membeli mahal setelah 13 tahun value murah." },
            { text: "Naikkan leverage untuk kejar ketertinggalan", why: "Salah: leverage memperbesar rasa sakit yang sama; bukan solusi untuk periode premia negatif." },
          ],
        },
        {
          q: "Manajer mengklaim alpha 3%. Setelah regresi multifactor, alpha tersisa 0,5%. Artinya?",
          options: [
            { text: "Regresinya salah hitung", why: "Salah: justru ini fungsi regresi — memisahkan beta faktor dari keterampilan murni." },
            { text: "2,5% adalah eksposur faktor (beta tersamarkan), bukan keterampilan", why: "Tepat: sebagian besar “alpha” adalah tilt value/size/momentum yang tidak diakui. Bayar mahal hanya untuk 0,5% yang sejati.", correct: true },
            { text: "Manajer harus dipecat", why: "Salah: 0,5% alpha murni setelah kontrol faktor tetap berharga — yang dikoreksi adalah harganya, bukan orangnya." },
            { text: "Faktor tidak relevan untuk dana ini", why: "Salah: justru faktor menjelaskan 2,5% return — sangat relevan untuk menilai dengan jujur." },
          ],
        },
        {
          q: "Kenapa premia momentum dari backtest harus dihitung net-of-cost?",
          options: [
            { text: "Karena momentum turnover-nya tinggi (>100%/tahun) — spread & komisi menggerus premia", why: "Tepat: strategi yang sering trading terlihat bagus gross tetapi bisa negatif net. Biaya bukan detail kecil untuk faktor high-turnover.", correct: true },
            { text: "Karena pajak tidak berlaku untuk momentum", why: "Salah: pajak justru memperberat — short-term gain biasanya tarif lebih tinggi." },
            { text: "Karena momentum tidak punya teori", why: "Salah: ada penjelasan perilaku (underreaction, herding) — masalahnya biaya, bukan teori." },
            { text: "Tidak perlu — backtest sudah cukup", why: "Salah: backtest gross = ilusi; keputusan investasi memakai angka net." },
          ],
        },
        {
          q: "Dana ritel Indonesia ingin “factor investing”. Langkah paling bijak?",
          options: [
            { text: "Bangun faktor sendiri dari backtest IHSG 5 tahun", why: "Salah: 5 tahun = noise; faktor butuh puluhan tahun lintas rezim. Ini zoo of factors domestik." },
            { text: "Pakai faktor global tereplikasi via produk murah, sadar risiko kurs & biaya", why: "Tepat: faktor tervalidasi + implementasi murah + jujur soal risiko tambahan (kurs).", correct: true },
            { text: "Pilih faktor dengan backtest paling bagus", why: "Salah: memilih dari 300+ faktor berdasar backtest = data mining murni." },
            { text: "Tunggu sampai ada yang “terbukti” tahun ini", why: "Salah: faktor yang “terbukti” tahun ini biasanya sudah mahal (crowding) — membeli di puncak premia." },
          ],
        },
      ],
    },
  ],
};
