import type { V2Lesson } from "../lib/types";

// ── Figure: korelasi tenang vs krisis (ilustrasi pola) ───────────────────
const CORR_SVG = `<svg viewBox="0 0 620 260" role="img" aria-label="Korelasi BTC-altcoin: 0,35 di masa tenang vs 0,90 di masa krisis (ilustrasi)">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="220" x2="590" y2="220"/>
<line x1="48" y1="177.5" x2="590" y2="177.5"/>
<line x1="48" y1="135" x2="590" y2="135"/>
<line x1="48" y1="92.5" x2="590" y2="92.5"/>
<line x1="48" y1="50" x2="590" y2="50"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="224">0</text>
<text x="42" y="181.5">0,25</text>
<text x="42" y="139">0,50</text>
<text x="42" y="96.5">0,75</text>
<text x="42" y="54">1,00</text>
</g>
<rect x="150" y="160.5" width="120" height="59.5" fill="var(--c1)"/>
<rect x="350" y="67" width="120" height="153" fill="var(--c2)"/>
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)" text-anchor="middle">
<text x="210" y="240">tenang: 0,35</text>
<text x="410" y="240">krisis: 0,90</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">korelasi BTC–altcoin per rezim — ilustrasi pola, bukan data bursa</text></g></svg>`;

export const bcd22: V2Lesson = {
  slug: "bcd22-kuantitatif-kripto",
  track: "Blockchain Data Scientist",
  module: "Analisis Lanjutan",
  title: "BCD22 — Analisis Kuantitatif Kripto: Volatilitas, Korelasi, Rezim",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menghitung log return dan volatilitas terealisasi dari seri harga, lalu menafsirkan angkanya; (2) menjelaskan kenapa korelasi kripto melonjak saat krisis dan menghitungnya per sub-periode; (3) mengklasifikasikan rezim pasar (bull/bear/sideways) dengan aturan berbasis data — sebagai deskripsi, bukan ramalan; (4) menghitung max drawdown, volatilitas portofolio, dan konsentrasi posisi; (5) mengenali tiga jebakan data kripto: survivorship bias, data bursa tak teregulasi, dan wash trading.",
        "Rutenya: cerita dana 12 koin → lima konsep inti (return & volatilitas, korelasi, rezim, metrik portofolio, jebakan data) → lab Pyodide (ukur semuanya di atas data sintetis) → chart korelasi per rezim dengan panduan baca → peta keputusan → mini-case audit portofolio → kuis → rangkuman. Estimasi 65 menit; lab-nya ±15 menit.",
        "Satu batas yang perlu ditegaskan di awal: lesson ini mengajarkan MENGUKUR risiko — bukan meramal harga, bukan memberi sinyal beli/jual. Setiap angka di sini menjawab “seberapa berisiko”, tidak pernah menjawab “kapan beli”. Analis kuantitatif yang jujur tahu bedanya — dan klien yang cerdas membayar untuk kejujuran itu.",
      ],
      tasks: [],
      note: {
        title: "Batas lesson ini — baca dulu",
        type: "risk",
        body: "Lesson ini murni tentang PENGUKURAN kuantitatif (volatilitas, korelasi, drawdown, kualitas data) — bukan strategi trading, bukan rekomendasi investasi. Tidak ada satu pun angka di sini yang boleh dibaca sebagai “sinyal beli/jual”. Kalau pertanyaanmu “koin apa yang naik minggu depan?”, itu bukan pertanyaan lesson ini — dan analis yang menjawabnya dengan data 24 hari sedang menipumu.",
      },
      reference: "Mengukur ≠ meramal. Lima konsep: return-vol, korelasi, rezim, metrik portofolio, jebakan data.",
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita",
      title: "Portofolio 12 koin yang tidak terdiversifikasi",
      prose: [
        "Awal 2024, sebuah dana komunitas bernama “Nusa Digital Fund” mengumpulkan Rp2 miliar dari 40 anggota. Manajernya — sebut saja Rian — bangga dengan strateginya: 12 koin dipilih hati-hati dari sektor berbeda (layer-1, DeFi, gaming, AI-token), masing-masing ±8% portofolio. Ia menunjukkan angka andalannya: korelasi rata-rata antar-koin selama 6 bulan terakhir hanya 0,35. “Terdiversifikasi secara kuantitatif,” katanya. Para anggota mengangguk puas.",
        "Lalu datang koreksi Mei. Dalam 3 minggu, portofolio itu jatuh −47%. Bukan satu-dua koin yang sial — SEMUANYA jatuh bersama, seolah 12 koin itu satu koin raksasa. Rian menghitung ulang korelasinya selama periode krisis: 0,90. Angka 0,35 yang ia banggakan ternyata diukur di masa tenang — dan menguap tepat saat dibutuhkan.",
        "Twist-nya: diversifikasi yang diukur di masa tenang adalah diversifikasi PALSU — ia bekerja tepat saat kamu tidak membutuhkannya (pasar naik atau datar), dan menghilang tepat saat kamu paling membutuhkannya (krisis). Seperti asuransi kebakaran yang hangus bersama rumah yang terbakar. Di lesson ini kamu belajar mengukur risiko dengan cara yang tidak menipumu: volatilitas yang jujur, korelasi PER REZIM, drawdown sebagai skenario terburuk, dan data yang tidak berbohong.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: korelasi masa tenang menjawab “seberapa mirip mereka saat santai”; korelasi masa krisis menjawab “seberapa mirip mereka saat panik”. Portofolio hanya butuh jawaban kedua — tetapi kebanyakan orang hanya menghitung yang pertama.",
      ],
      reference: "Pelajaran cerita: ukur korelasi per rezim. Satu angka korelasi = satu kebohongan yang rapi.",
    },
    {
      id: "return-vol",
      eyebrow: "Langkah 3 · Konsep",
      title: "Return & Volatilitas — Si Kembar yang Beda Sifat",
      prose: [
        "Definisi: return mengukur PERUBAHAN harga; volatilitas mengukur KEGOYANGANNYA. Keduanya “kembar” karena selalu disebut berpasangan (“return 200%, vol 150%”), tetapi sifatnya beda: return adalah harapan (bisa positif/negatif, bisa menipu), volatilitas adalah kepastian tentang ketidakpastian (ia tidak berbohong tentang seberapa liar pergerakannya). Analis yang hanya melihat return seperti menilai sopir dari kecepatan rata-ratanya — tanpa bertanya berapa kali ia hampir menabrak.",
        "Kenapa LOG return, bukan persen biasa? Dua alasan. Pertama, aditif: return log 2 hari = r_1 + r_2 — persen biasa tidak bisa dijumlahkan begitu saja. Kedua, simetris: +10% lalu −10% dalam persen = −1% (bukan 0!), sedangkan dalam log return angkanya jujur tentang asimetri itu. Untuk deret waktu dan statistik, log return adalah bahasa yang benar.",
        "Volatilitas terealisasi dihitung dari data: volatilitas tahunan = simpangan baku return harian × √365. Angka 365 — bukan 252 seperti saham — karena kripto diperdagangkan 24/7 tanpa tutup. Contoh: simpangan baku harian 3% → vol tahunan ≈ 0,03 × 19,1 ≈ 57%. Interpretasi: vol 57% artinya pergerakan ±1σ setahun ≈ ±57% — dan kripto rutin bergerak 2–3σ.",
        "Lalu ekor gemuk (fat tails): distribusi return kripto punya ekor lebih tebal dari distribusi normal — kejadian “6 sigma” yang menurut kurva normal mustahil (sekali per jutaan tahun) terjadi tiap beberapa tahun di kripto. Momen lebih tinggi menggambarkannya: skewness (kemiringan — crash lebih sering dari rally setara) dan kurtosis (ketebalan ekor). Praktisnya: model berbasis normal MEREMEHKAN risiko ekstrem — dan yang diremehkan itulah yang membunuh portofolio.",
      ],
      formula: String.raw`r_t = \ln\!\left(\frac{P_t}{P_{t-1}}\right)`,
      formulaNote: "r_t = return log hari t; P_t = harga hari t; P_{t-1} = harga sehari sebelumnya; ln = logaritma natural. Contoh: harga 100 → 105, maka r = ln(1,05) ≈ 0,0488 (4,88%). Interpretasi: r_t menjawab “berapa persen (dalam bahasa log) harga bergerak hari ini” — dan karena aditif, return seminggu = jumlah r harian, tanpa rumus bunga-berbunga yang rumit.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Return rata-rata tinggi = investasi yang bagus”",
        type: "pitfall",
        body: "Yang benar: return tanpa volatilitas adalah cerita setengah. Koin A return 200%/tahun dengan vol 150% bisa memberi pengalaman lebih buruk dari koin B return 30% dengan vol 15% — karena di tengah jalan, A sempat jatuh −70% dan sebagian besar pemiliknya sudah panik-jual di dasar. Aturan praktis: selalu baca return BERPASANGAN dengan volatilitasnya (return per unit risiko), tidak pernah sendirian.",
      },
      hints: [
        "💡 Intuisi: return = kecepatan mobil; volatilitas = seberapa sering ia oleng ke bahu jalan. Mobil tercepat yang oleng setiap 100 meter tidak akan sampai tujuan — penumpangnya turun duluan.",
      ],
      reference: "Log return: aditif + simetris. Vol tahunan kripto pakai √365. Ekor gemuk: normal meremehkan ekstrem.",
    },
    {
      id: "korelasi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Korelasi — Si Teman Cuaca Cerah",
      prose: [
        "Definisi: korelasi Pearson (ρ, −1 s.d. 1) mengukur seberapa SINKRON dua aset bergerak — bukan seberapa mirip harganya. ρ = 1: naik-turun beriringan sempurna; ρ = 0: bergerak sendiri-sendiri; ρ negatif: berlawanan arah. Diversifikasi bekerja HANYA bila ρ rendah — karena risiko portofolio tumbuh dari volatilitas tiap aset DAN korelasinya (σ_p² = ΣΣ w_i w_j σ_i σ_j ρ_ij): saat ρ melonjak ke 0,9, suku silang membesar dan “perlindungan” diversifikasi menguap.",
        "Kenapa korelasi BTC–altcoin NAIK saat krisis? Tiga mesin yang sama: (1) flight to safety — semua orang menjual yang berisiko bersamaan; (2) likuidasi berantai — margin call memaksa jual apa pun yang likuid, bukan yang “salah”; (3) faktor pasar dominan — di masa panik, satu faktor (ketakutan makro) menenggelamkan semua cerita idiosinkratik tiap koin. Dalam bahasa statistik: risiko sistematik menelan risiko spesifik.",
        "Kepribadiannya: korelasi adalah teman cuaca cerah — ia menenangkanmu dengan angka 0,35 di masa tenang, lalu menghilang saat badai. Itu sebabnya korelasi antarperiode TIDAK STABIL: mengukurnya sekali untuk “selamanya” seperti mengukur suhu sekali untuk setahun. Praktik yang benar: hitung korelasi PER SUB-PERIODE (tenang vs stres) atau rolling window — dan pakai angka KRISIS untuk perencanaan risiko, karena risiko hanya peduli pada skenario buruk.",
        "Cara membaca chart di bawah: sumbu X = dua rezim (tenang vs krisis); sumbu Y = korelasi BTC–altcoin; tinggi batang = nilai korelasi pada rezim itu. Interpretasi: pola umumnya — batang kiri pendek (0,35: bergerak cukup mandiri), batang kanan menjulang (0,90: jatuh bersama). Inilah visual dari tragedi Nusa Digital Fund: diversifikasi yang tampak di kiri, lenyap di kanan. Di lab, kamu mengukurnya sendiri: 0,13 → 0,78 pada data sintetis.",
      ],
      formula: String.raw`\rho_{xy} = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i-\bar{x})^2 \; \sum_{i=1}^{n}(y_i-\bar{y})^2}}`,
      formulaNote: "ρ = korelasi (−1 s.d. 1); x_i, y_i = return harian dua aset; x̄, ȳ = rata-ratanya; n = jumlah hari. Contoh dari lab lesson ini: 12 hari tenang → ρ ≈ 0,13 (bergerak sendiri-sendiri); 12 hari krisis → ρ ≈ 0,78 (jatuh bersama). Interpretasi: ρ mengukur SINKRONITAS pergerakan — dan nilainya milik PERIODE yang diukur, bukan milik asetnya.",
      figure: {
        svg: CORR_SVG,
        alt: "Diagram batang: korelasi 0,35 di masa tenang vs 0,90 di masa krisis.",
        caption: "Korelasi BTC–altcoin per rezim (ilustrasi pola). Diversifikasi tampak di kiri, lenyap di kanan.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: “Korelasi historis rendah = diversifikasi aman”",
        type: "pitfall",
        body: "Yang benar: korelasi adalah SIFAT REZIM, bukan sifat aset. Angka 0,35 dari 6 bulan tenang tidak menjanjikan apa pun untuk 3 minggu krisis — justru saat krisis, korelasilah yang berubah paling dulu. Uji diversifikasi selalu dengan korelasi masa STRES, bukan masa tenang. Portofolio yang “terdiversifikasi” menurut angka tenang adalah portofolio yang belum diuji.",
      },
      hints: [
        "💡 Intuisi: korelasi seperti payung yang menutup sendiri saat hujan — ia melindungimu dari gerimis (fluktuasi harian biasa) tetapi menolak melindungimu dari badai (krisis). Jangan rencanakan perjalanan jauh hanya karena payungmu bagus saat cerah.",
      ],
      reference: "Korelasi naik saat krisis (flight to safety, likuidasi, faktor dominan). Ukur per rezim; pakai angka krisis untuk perencanaan.",
    },
    {
      id: "lab-volkor",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Ukur volatilitas, korelasi, dan drawdown sendiri",
      prose: [
        "Waktunya jadi analis kuantitatif-nya. Di bawah ada 25 harga harian SINTETIS (bukan data bursa asli) untuk BTC dan ALT — 24 hari yang terbagi dua: 12 hari tenang, 12 hari krisis. Tugasmu: tulis empat fungsi — `log_returns(prices)` (list ln(p[i+1]/p[i])), `realized_vol(rets, periods=365)` (stdev sampel × √periods), `corr(x, y)` (Pearson manual), dan `max_drawdown(prices)` (drawdown terburuk sebagai fraksi negatif) — lalu baca tiga baris ringkasannya.",
        "Coba: setelah lolos, ganti `periods=365` menjadi `12` pada pemanggilan `realized_vol` (volatilitas “bulanan”). Bagaimana angkanya berubah — dan kenapa annualisasi memakai 365 untuk kripto? Lalu ganti pembagian sub-periode `rb[:12]` menjadi `rb[:6]` vs `rb[6:12]` (sama-sama masa tenang): apakah korelasinya stabil bahkan di dalam masa tenang?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `log_returns(prices)`: list `math.log(prices[i+1] / prices[i])`" },
        { id: "t2", text: "Lengkapi `realized_vol(rets, periods=365)`: stdev sampel × `math.sqrt(periods)`" },
        { id: "t3", text: "Lengkapi `corr(x, y)`: Pearson manual (rata-rata, kovarians, akar hasil kali varians)" },
        { id: "t4", text: "Lengkapi `max_drawdown(prices)`: lacak puncak berjalan, kembalikan drawdown terburuk (negatif)" },
        { id: "t5", text: "Jalankan dan pastikan tiga baris ringkasan tercetak dengan angka yang masuk akal" },
      ],
      expected: "vol BTC=43.32% vol ALT=68.73% / korelasi tenang=0.13 korelasi krisis=0.78 / max drawdown BTC=-29.8% ALT=-35.3%",
      hints: [
        "Stdev sampel: bagi dengan (n − 1), bukan n. `math.sqrt` sudah tersedia.",
        "Pearson: pembilang = Σ(x−x̄)(y−ȳ); penyebut = √(Σ(x−x̄)² × Σ(y−ȳ)²). Jaga-jaga penyebut nol.",
        "Max drawdown: `peak` dimulai dari harga pertama; untuk tiap harga, `peak = max(peak, p)` lalu `worst = min(worst, (p − peak) / peak)`.",
        "Angka yang diharapkan: vol ALT > vol BTC (altcoin lebih liar); korelasi krisis JAUH lebih tinggi dari tenang; drawdown ALT lebih dalam dari BTC.",
      ],
      code: {
        starter: `import math

# Harga SINTETIS harian (bukan data bursa asli): 25 harga = 24 hari
# 12 hari pertama = masa tenang, 12 hari terakhir = masa krisis
btc = [100.0, 100.23, 100.49, 100.74, 101.55, 101.69, 102.39, 103.61, 103.11, 103.83, 104.29, 105.38, 105.41, 104.35, 102.54, 99.72, 94.62, 92.45, 87.44, 85.66, 84.29, 80.07, 78.52, 74.0, 74.71]
alt = [10.0, 10.01, 10.27, 9.91, 9.89, 9.99, 10.38, 10.47, 10.24, 10.69, 10.72, 10.36, 10.56, 10.51, 9.97, 9.3, 8.87, 8.84, 8.14, 7.93, 7.76, 7.22, 7.35, 6.94, 7.1]

# TULIS KODEMU: empat fungsi di bawah ini
def log_returns(prices):
    return

def realized_vol(rets, periods=365):
    return

def corr(x, y):
    return

def max_drawdown(prices):
    return

rb, ra = log_returns(btc), log_returns(alt)
vol_btc = realized_vol(rb)
vol_alt = realized_vol(ra)
corr_calm = corr(rb[:12], ra[:12])
corr_stress = corr(rb[12:], ra[12:])
dd_btc = max_drawdown(btc)
dd_alt = max_drawdown(alt)
print(f"vol BTC={vol_btc:.2%} vol ALT={vol_alt:.2%}")
print(f"korelasi tenang={corr_calm:.2f} korelasi krisis={corr_stress:.2f}")
print(f"max drawdown BTC={dd_btc:.1%} ALT={dd_alt:.1%}")`,
        lockLines: 7,
        solution: `import math

# Harga SINTETIS harian (bukan data bursa asli): 25 harga = 24 hari
# 12 hari pertama = masa tenang, 12 hari terakhir = masa krisis
btc = [100.0, 100.23, 100.49, 100.74, 101.55, 101.69, 102.39, 103.61, 103.11, 103.83, 104.29, 105.38, 105.41, 104.35, 102.54, 99.72, 94.62, 92.45, 87.44, 85.66, 84.29, 80.07, 78.52, 74.0, 74.71]
alt = [10.0, 10.01, 10.27, 9.91, 9.89, 9.99, 10.38, 10.47, 10.24, 10.69, 10.72, 10.36, 10.56, 10.51, 9.97, 9.3, 8.87, 8.84, 8.14, 7.93, 7.76, 7.22, 7.35, 6.94, 7.1]

# TULIS KODEMU: empat fungsi di bawah ini
def log_returns(prices):
    return [math.log(prices[i + 1] / prices[i]) for i in range(len(prices) - 1)]

def realized_vol(rets, periods=365):
    m = sum(rets) / len(rets)
    var = sum((r - m) ** 2 for r in rets) / (len(rets) - 1)
    return math.sqrt(var) * math.sqrt(periods)

def corr(x, y):
    mx, my = sum(x) / len(x), sum(y) / len(y)
    num = sum((a - mx) * (b - my) for a, b in zip(x, y))
    den = math.sqrt(sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y))
    return num / den if den > 0 else 0.0

def max_drawdown(prices):
    peak = prices[0]
    worst = 0.0
    for p in prices:
        peak = max(peak, p)
        worst = min(worst, (p - peak) / peak)
    return worst

rb, ra = log_returns(btc), log_returns(alt)
vol_btc = realized_vol(rb)
vol_alt = realized_vol(ra)
corr_calm = corr(rb[:12], ra[:12])
corr_stress = corr(rb[12:], ra[12:])
dd_btc = max_drawdown(btc)
dd_alt = max_drawdown(alt)
print(f"vol BTC={vol_btc:.2%} vol ALT={vol_alt:.2%}")
print(f"korelasi tenang={corr_calm:.2f} korelasi krisis={corr_stress:.2f}")
print(f"max drawdown BTC={dd_btc:.1%} ALT={dd_alt:.1%}")`,
        checks: [
          { kind: "equal", task: "t2", name: "vol_btc", value: 0.4332, tol: 0.01, label: "Volatilitas BTC ≈ 43%", msg: "Stdev 24 return harian × √365. Harusnya ≈ 0,43." },
          { kind: "equal", task: "t2", name: "vol_alt", value: 0.6873, tol: 0.01, label: "Volatilitas ALT ≈ 69%", msg: "ALT lebih liar dari BTC — harusnya ≈ 0,69." },
          { kind: "equal", task: "t3", name: "corr_calm", value: 0.1314, tol: 0.01, label: "Korelasi tenang ≈ 0,13", msg: "12 return pertama: kedua aset bergerak sendiri-sendiri." },
          { kind: "equal", task: "t3", name: "corr_stress", value: 0.7794, tol: 0.01, label: "Korelasi krisis ≈ 0,78", msg: "12 return terakhir: jatuh bersama — jauh lebih tinggi dari masa tenang." },
          { kind: "equal", task: "t4", name: "dd_btc", value: -0.298, tol: 0.01, label: "Max drawdown BTC ≈ −30%", msg: "Dari puncak 105,41 ke lembah 74,0." },
          { kind: "equal", task: "t4", name: "dd_alt", value: -0.3526, tol: 0.01, label: "Max drawdown ALT ≈ −35%", msg: "ALT jatuh lebih dalam dari BTC." },
          { kind: "stdout_matches", task: "t5", pattern: "korelasi krisis=0\\.78", label: "Baris korelasi tercetak", msg: "Format: korelasi tenang=0.13 korelasi krisis=0.78" },
        ],
      },
      reference: "Tiga baris ringkasan = tiga kebenaran: ALT lebih liar, korelasi milik rezim, drawdown ALT lebih dalam.",
    },
    {
      id: "rezim",
      eyebrow: "Langkah 6 · Konsep",
      title: "Rezim Pasar — Si Cuaca yang Suka Berubah",
      prose: [
        "Definisi: rezim pasar adalah “cuaca” dominan suatu periode — bull (tren naik + vol moderat), bear (tren turun tajam, vol tinggi), sideways (datar, vol rendah). Kuncinya: rezim adalah KLASIFIKASI MASA LALU dari data, bukan ramalan masa depan. Aturan sederhananya bisa ditulis eksplisit — mis. return 30 hari > +20% dan vol di bawah median → label “bull”; return 30 hari < −20% → “bear”; sisanya “sideways”. Aturan seperti ini tidak memprediksi apa pun; ia hanya memberi nama pada apa yang sudah terjadi — dan nama itu berguna.",
        "Untuk apa label masa lalu itu? Dua hal. Pertama, parameter risiko PER REZIM: volatilitas, korelasi, dan drawdown dihitung terpisah untuk tiap rezim — karena satu angka rata-rata mencampur badai dan cerah menjadi “mendung tipis” yang tidak pernah ada. Kedua, stress test yang jujur: uji portofolio terhadap data REZIM BEAR historis, bukan terhadap rata-rata. Dana yang lolos “rata-rata” bisa mati di “badai” — dan badai adalah satu-satunya ujian yang penting.",
        "Kepribadiannya: rezim adalah cuaca — semua orang membicarakannya, tidak ada yang bisa mengubahnya, dan ramalannya sering salah. Bedanya dengan cuaca beneran: di pasar, “prakiraan” rezim besok tidak ada yang andal. Maka disiplinnya: gunakan rezim untuk MEMAHAMI (kenapa korelasiku berubah? oh, rezimnya bear) dan untuk BERSIAP (berapa drawdown-ku bila bear datang lagi?), tidak pernah untuk MENEBAK (besok bull, all-in!).",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Rezim terlihat jelas secara real-time, jadi bisa dipakai untuk timing pasar”",
        type: "pitfall",
        body: "Yang benar: rezim hanya jelas dalam HINDSIGHT — setelah 30 hari data terkumpul, barulah aturanmu berani melabelinya “bear”. Secara real-time, labelnya selalu terlambat dan bisa berbalik (bull yang ternyata koreksi dalam bear). Trading berdasarkan label rezim = mengemudi sambil melihat kaca spion. Gunakan rezim untuk kalibrasi risiko, bukan untuk timing.",
      },
      hints: [
        "💡 Intuisi: label rezim = prakiraan cuaca KEMARIN — berguna untuk memilih baju hari ini (kalibrasi risiko), tidak berguna untuk menghentikan hujan besok (timing pasar).",
      ],
      reference: "Rezim = deskripsi masa lalu, bukan ramalan. Parameter risiko per rezim; stress test pada data bear.",
    },
    {
      id: "metrik-portofolio",
      eyebrow: "Langkah 7 · Konsep",
      title: "Tiga Angka yang Menjaga Dompet",
      prose: [
        "Max drawdown: penurunan terburuk dari puncak ke lembah — “skenario terburuk yang pernah terjadi”. Kenapa ia lebih penting dari volatilitas untuk manusia? Karena volatilitas mengukur guncangan naik-turun (abstrak), sedangkan drawdown mengukur LUKA (konkret): −50% berarti separuh uangmu hilang dan butuh +100% hanya untuk kembali impas — bukan +50%. Psikologi dan margin call bekerja pada drawdown, bukan pada sigma.",
        "Volatilitas portofolio: σ_p² = Σ_i Σ_j w_i w_j σ_i σ_j ρ_ij — bobot (w), volatilitas tiap aset (σ), dan korelasi (ρ) semuanya masuk. Pelajarannya: menambah aset TIDAK otomatis menurunkan risiko — bila aset baru berkorelasi 0,9 dengan yang lama saat krisis, ia hanya menambah bobot pada risiko yang sama. Inilah matematika di balik tragedi 12 koin.",
        "Konsentrasi: bobot terbesar dan indeks Herfindahl H = Σ w_i². Tiga aset equal-weight → H = 3×(1/3)² ≈ 0,33; satu aset 100% → H = 1. H di atas 0,5 artinya portofolio “rasa satu aset” — apapun klaim diversifikasinya. Aturan praktis: bila satu posisi bisa membunuh portofolio, itu bukan diversifikasi — itu taruhan dengan figuran.",
        "Kapan memakai ketiganya: sebelum menambah posisi, tanyakan tiga hal — (1) berapa max drawdown historisnya (bisakah aku bertahan?), (2) berapa volatilitas portofolioku SETELAH korelasi krisis dimasukkan (bukan korelasi tenang!), (3) berapa H portofolioku (apakah aku benar-benar terdiversifikasi, atau hanya punya banyak nama untuk satu risiko?).",
      ],
      formula: String.raw`\text{MaxDD} = \min_t \frac{P_t - \max_{s \le t} P_s}{\max_{s \le t} P_s}`,
      formulaNote: "P_t = harga saat t; max_{s≤t} P_s = puncak tertinggi SEBELUM t (running peak); pecahannya = drawdown saat t (negatif atau nol); MaxDD = yang terburuk. Contoh: beli di puncak 105, jatuh ke 74 → (74−105)/105 ≈ −29,5%. Interpretasi: MaxDD menjawab “skenario terburuk historisnya sedalam apa?” — dan ingat asimetrinya: pulih dari −50% butuh +100%.",
      tasks: [],
      hints: [
        "💡 Intuisi: drawdown = luka, volatilitas = guncangan, konsentrasi = semua telur satu keranjang. Luka yang dalam butuh waktu lama sembuh — dan sebagian portofolio tidak pernah sembuh karena pemiliknya menyerah di tengah jalan.",
      ],
      reference: "Drawdown = luka (asimetris). Vol portofolio memuat korelasi — pakai ρ krisis. H > 0,5 = rasa satu aset.",
    },
    {
      id: "jebakan-data",
      eyebrow: "Langkah 8 · Konsep",
      title: "Tiga Jebakan Data Kripto",
      prose: [
        "Jebakan 1 — survivorship bias: dataset-mu hanya berisi koin yang MASIH ADA. Dari 100 koin top 2021, misalkan 40 mati/delist — backtest strategimu atas 60 yang selamat terlihat cemerlang, karena yang gagal sudah dihapus dari sejarah. Return “rata-rata koin” yang kamu hitung bukan return berinvestasi di 2021 — melainkan return berinvestasi HANYA pada para pemenang yang kamu ketahui belakangan. Koreksinya: tanyakan selalu “apakah dataset ini mencakup yang mati?” — bila tidak, anggap hasilnya terlalu bagus.",
        "Jebakan 2 — data bursa tak teregulasi: tidak semua “harga BTC” sama. Bursa kecil tak teregulasi bisa punya harga menyimpang, jeda update, bahkan angka yang dimanipulasi. Praktik yang benar: agregat dari BEBERAPA bursa bereputasi dan pakai median — bukan satu bursa, bukan rata-rata yang bisa ditarik outlier. Satu sumber = satu titik kegagalan.",
        "Jebakan 3 — wash trading: volume digelembungkan oleh transaksi semu (beli-jual ke diri sendiri) agar koin terlihat likuid. Volume Rp50 triliun/hari dengan spread 2% adalah kontradiksi yang berteriak: bila benar-benar likuid, spread-nya sempit. Likuiditas sejati dibaca dari spread bid-ask dan KEDALAMAN order book — bukan dari volume. Volume menjawab “berapa banyak yang katanya diperdagangkan”; spread menjawab “berapa biaya sebenarnya untuk keluar SEKARANG”.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Volume tinggi = likuiditas bagus = aman untuk masuk besar”",
        type: "pitfall",
        body: "Yang benar: volume adalah angka yang paling mudah dipalsukan di kripto (wash trading tidak butuh izin siapa pun). Likuiditas yang sesungguhnya = spread sempit + book yang dalam — keduanya bisa dicek langsung dari order book, tidak dari headline volume. Posisi besar yang masuk atas dasar “volumenya gede” bisa terjebak: saat benar-benar butuh keluar, book-nya tipis dan harga longsor.",
      },
      hints: [
        "💡 Intuisi: volume seperti jumlah pengunjung mal — bisa dipalsukan dengan bagi-bagi voucher. Spread dan kedalaman book seperti kasir yang beneran buka: di sanalah transaksi nyata terjadi.",
      ],
      reference: "Survivorship: tanya “yang mati ikut dihitung?”. Bursa: agregat multi-sumber + median. Volume: cek spread & book, bukan headline.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Kapan angka ini dipakai?",
      prose: [
        "Lima skenario analis kuantitatif kripto:",
        "Skenario 1 — “Portofolioku sudah terdiversifikasi?” → Hitung korelasi PER REZIM (tenang vs stres), bukan satu angka. Bila korelasi stres > 0,7, diversifikasimu adalah dekorasi. Alasan: satu-satunya korelasi yang penting adalah yang berlaku saat kamu rugi.",
        "Skenario 2 — “Koin A vs koin B, mana lebih baik?” → Bandingkan return PER UNIT RISIKO (return/volatilitas), bukan return mentah. A return 200%/vol 150% vs B 40%/vol 25%: B memberi 1,6 per unit risiko, A hanya 1,3 — dan perjalanan A jauh lebih menyakitkan. Alasan: return tanpa penyebut risiko = iklan.",
        "Skenario 3 — “Berapa besar posisi yang aman?” → Pakai max drawdown historis × faktor pengaman: bila DD −50% membuatmu gagal memenuhi kewajiban (atau panik-jual), posisinya terlalu besar — KECILKAN sampai DD terburuk masih bisa kamu tidur nyenyak. Alasan: ukuran posisi ditentukan oleh luka yang bisa ditahan, bukan oleh optimisme.",
        "Skenario 4 — “Backtest strategiku bagus, siap jalan?” → Audit survivorship bias DULU: apakah dataset mencakup koin yang mati/delist pada periode itu? Bila tidak, hasil backtest = dongeng para pemenang. Alasan: strategi yang hanya diuji pada yang selamat belum diuji sama sekali.",
        "Skenario 5 — “Data harga/volume dari mana?” → Agregat multi-bursa + median untuk harga; untuk likuiditas baca spread & kedalaman book, bukan volume headline. Alasan: satu bursa = satu titik kegagalan; volume = angka termudah dipalsukan.",
        "Aturan praktis 10 detik: return selalu berpasangan dengan vol → korelasi selalu per rezim → posisi selalu diuji drawdown → backtest selalu ditanya yang mati → data selalu multi-sumber.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai angka masa tenang untuk keputusan masa krisis — vol rata-rata untuk sizing, korelasi tenang untuk diversifikasi, backtest survivor untuk ekspektasi. Polanya selalu sama: angka yang nyaman dipakai untuk keputusan yang tidak nyaman. Disiplinnya satu kalimat: rencanakan dengan angka terburuk, harapkan yang terbaik.",
      },
      reference: "Lima skenario: korelasi per rezim, return/vol, sizing via drawdown, audit survivor, multi-sumber data.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Audit portofolio “aman” milik Koperasi Nusa",
      prose: [
        "Skenario (sintetis, untuk latihan): Koperasi Nusa menyimpan dana cadangan Rp5 miliar — uang yang harus cair dalam 30 hari bila anggota menarik simpanan massal. Bendaharanya menaruh masing-masing 33% di tiga aset kripto “blue chip” (sebut saja K1, K2, K3), dengan alasan “sudah diversifikasi tiga aset”. Data 90 hari: volatilitas tahunan 55–90% per aset; korelasi tenang antar-aset 0,30; korelasi krisis 0,85; max drawdown portofolio −52%.",
        "Pertanyaan analisis: (1) Kenapa pembagian rata tiga aset tidak melindungi saat krisis? (2) Dengan korelasi krisis 0,85, apa arti “diversifikasi” portofolio ini — hitung intuisi HHI-nya? (3) Berapa persen maksimal dana cadangan yang layak di aset seperti ini, dan kenapa?",
        "Pembahasan: (1) Karena perlindungannya dihitung dari korelasi TENANG (0,30), sedangkan yang berlaku saat rugi adalah korelasi KRISIS (0,85) — tiga aset berperilaku seperti satu aset raksasa tepat saat koperasi butuh uangnya. Diversifikasi yang diukur di cuaca cerah tidak berlaku saat badai. (2) H = 3×(1/3)² ≈ 0,33 terlihat “cukup tersebar” — tetapi H mengabaikan korelasi! Dengan ρ krisis 0,85, risiko efektifnya mendekati satu posisi tunggal: HHI bilang “tiga nama”, korelasi bilang “satu nasib”. Pelajaran: HHI tanpa korelasi = setengah kebenaran. (3) Dana cadangan punya horizon 30 hari dan kewajiban pasti — ia tidak boleh menanggung drawdown −52% yang butuh bertahun-tahun untuk pulih. Aturan praktis: dana yang HARUS cair dalam waktu dekat maksimal menanggung drawdown yang masih bisa dipenuhi tanpa menjual rugi — untuk aset sevolatil ini, artinya porsi kecil (satu digit persen) atau nol. Uang tidur boleh berisiko; uang jaga malam tidak boleh.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko terbesar di sini bukan volatilitasnya — melainkan KETIDAKCOCOKAN horizon: dana 30-hari di aset yang butuh 3 tahun untuk pulih dari drawdown. Inilah risk management yang sesungguhnya: bukan “aset ini berisiko atau tidak”, melainkan “apakah risiko ini cocok dengan KEWAJIBANKU”. Aset yang sama bisa tepat untuk dana pensiun 20 tahun dan bunuh diri untuk dana cadangan 30 hari.",
      },
      reference: "Horizon × drawdown = keputusan. HHI tanpa korelasi menipu. Dana cadangan ≠ dana spekulasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Log return (aditif, simetris) adalah bahasa yang benar untuk deret harga; volatilitas tahunan kripto = stdev harian × √365.",
        "Return kripto berekor gemuk: model normal meremehkan kejadian ekstrem — yang diremehkan itulah yang membunuh portofolio.",
        "Korelasi adalah sifat rezim, bukan sifat aset: ukur per sub-periode; rencanakan risiko dengan angka krisis.",
        "Rezim (bull/bear/sideways) = klasifikasi masa lalu untuk kalibrasi risiko — bukan ramalan untuk timing.",
        "Tiga metrik portofolio: max drawdown (luka, asimetris), volatilitas portofolio (memuat korelasi), konsentrasi/HHI.",
        "Tiga jebakan data: survivorship bias (tanya yang mati), bursa tak teregulasi (agregat + median), wash trading (baca spread & book, bukan volume).",
        "Kapan TIDAK pakai: jangan pakai angka masa tenang untuk keputusan masa krisis; jangan pakai HHI tanpa korelasi; jangan ukur likuiditas dari volume headline.",
      ],
      quiz: [
        {
          q: "Kenapa analis kuantitatif memakai log return, bukan return persen biasa?",
          options: [
            { text: "Log return aditif antar waktu dan simetris — +10% lalu −10% tercatat jujur sebagai −1%, bukan 0%", why: "Benar: r_total = r_1 + r_2 bisa dijumlahkan langsung, dan asimetri persen biasa (+10%/−10% = −1%) tertangkap dengan jujur.", correct: true },
            { text: "Log return selalu lebih besar dari return persen", why: "Salah: untuk pergerakan kecil keduanya hampir sama (ln(1+x) ≈ x); keunggulannya struktural (aditif), bukan besar-kecilnya angka." },
            { text: "Return persen tidak bisa dihitung untuk kripto", why: "Salah: return persen bisa dihitung untuk aset apa pun — masalahnya ia tidak aditif dan tidak simetris untuk analisis deret waktu." },
            { text: "Karena rumusnya terlihat lebih canggih", why: "Salah: alasan kosmetik bukan alasan metodologis. Log return dipilih karena sifat matematisnya, bukan penampilannya." },
          ],
        },
        {
          q: "Lab menunjukkan korelasi tenang 0,13 dan korelasi krisis 0,78. Implikasi untuk diversifikasi?",
          options: [
            { text: "Diversifikasi yang diukur di masa tenang tidak melindungi saat krisis — ukur dan rencanakan dengan korelasi masa stres", why: "Benar: inilah pelajaran inti lesson — korelasi adalah sifat rezim. Portofolio harus diuji pada angka krisis, karena risiko hanya peduli skenario buruk.", correct: true },
            { text: "Korelasi 0,13 berarti kedua aset tidak berhubungan sama sekali", why: "Salah: 0,13 adalah korelasi pada PERIODE itu — pada periode lain (krisis) ia 0,78. “Tidak berhubungan” bukan sifat permanen aset." },
            { text: "Cukup pakai rata-rata keduanya (0,45) untuk perencanaan", why: "Salah: rata-rata mencampur badai dan cerah menjadi “mendung tipis” yang tidak pernah ada — perencanaan butuh angka skenario buruk, bukan rata-rata." },
            { text: "Korelasi tidak penting selama return-nya positif", why: "Salah: return positif masa lalu tidak menjamin apa pun saat krisis; korelasilah yang menentukan apakah diversifikasi bekerja saat dibutuhkan." },
          ],
        },
        {
          q: "Volatilitas tahunan kripto dihitung dengan × √365, bukan √252 seperti saham. Kenapa?",
          options: [
            { text: "Kripto diperdagangkan 24/7 tanpa hari libur — annualisasi harus mencakup 365 hari", why: "Benar: √252 berasal dari ±252 hari bursa saham per tahun. Kripto tidak pernah tutup, jadi faktornya √365.", correct: true },
            { text: "Karena volatilitas kripto selalu lebih tinggi dari saham", why: "Salah: faktor annualisasi soal JUMLAH periode trading, bukan soal besar-kecilnya volatilitas. Vol tinggi tidak mengubah 252 menjadi 365." },
            { text: "365 hanya konvensi — 252 juga boleh dipakai", why: "Salah: memakai 252 untuk kripto meremehkan volatilitas tahunan (±13% lebih rendah) — konvensi yang salah = angka yang salah." },
            { text: "Agar angkanya terlihat lebih besar dan mengesankan", why: "Salah: lagi-lagi alasan kosmetik. Annualisasi yang benar soal konsistensi periode, bukan kesan." },
          ],
        },
        {
          q: "Portofoliomu max drawdown −30%. Untuk kembali ke puncak semula, return yang dibutuhkan adalah?",
          options: [
            { text: "+43% — karena basisnya menyusut: 1/0,70 − 1 ≈ 0,43. Drawdown itu asimetris", why: "Benar: dari 70 kembali ke 100 butuh +42,9%. Inilah kenapa drawdown dalam sangat mahal — dan kenapa mencegah lebih murah daripada memulihkan.", correct: true },
            { text: "+30% — simetris dengan penurunannya", why: "Salah: inilah jebakan intuisi persen biasa. +30% dari 70 hanya sampai 91 — masih −9% dari puncak." },
            { text: "+60% — dua kali lipat drawdown", why: "Salah: tidak ada aturan “dua kali lipat”; angka pastinya 1/(1−DD) − 1. Untuk −30% = +42,9%." },
            { text: "Tidak bisa kembali — drawdown bersifat permanen", why: "Salah: drawdown bisa pulih (harga bisa naik lagi) — hanya saja butuh return LEBIH BESAR dari besar drawdown-nya." },
          ],
        },
        {
          q: "Backtest strategimu atas 60 koin yang masih hidup dari 100 koin top 2021 menunjukkan return fantastis. Masalah terbesarnya?",
          options: [
            { text: "Survivorship bias — 40 koin yang mati/delist hilang dari dataset, sehingga hasilnya hanya milik para pemenang", why: "Benar: backtest atas survivor mengukur “return bila kamu ajaibnya hanya memilih yang selamat” — bukan return strategi yang sebenarnya.", correct: true },
            { text: "Sampel 60 koin terlalu kecil untuk disimpulkan", why: "Salah: 60 bukan masalah jumlahnya — masalahnya SELEKSINYA. 60 koin acak 2021 akan valid; 60 survivor tidak." },
            { text: "Data 2021 sudah terlalu lama dan tidak relevan", why: "Salah: usia data bukan masalah utamanya — bias seleksinya. Data lama yang lengkap (termasuk yang mati) tetap berguna." },
            { text: "Tidak ada masalah — yang mati memang tidak perlu dihitung", why: "Salah: justru yang mati WAJIB dihitung — strategi nyata di 2021 akan memegang sebagian dari 40 koin itu dan menanggung kerugiannya." },
          ],
        },
        {
          q: "Koin X: volume harian Rp50 triliun, spread bid-ask 2%. Bagaimana menilai likuiditasnya?",
          options: [
            { text: "Buruk — volume bisa hasil wash trading; spread 2% yang lebar menunjukkan biaya keluar sebenarnya mahal", why: "Benar: volume adalah angka termudah dipalsukan; spread 2% berarti tiap putaran jual-beli “pajak” 2%. Likuiditas sejati dibaca dari spread + kedalaman book.", correct: true },
            { text: "Bagus — volume Rp50 triliun berarti sangat likuid", why: "Salah: inilah mitos yang dibantah lesson ini — volume headline tanpa verifikasi spread/book bisa murni wash trading." },
            { text: "Cukup — spread 2% masih wajar untuk kripto", why: "Salah: 2% untuk SATU putaran adalah mahal (bandingkan BTC di bursa besar: ~0,01–0,05%). Itu bukan “wajar”, itu illikuid." },
            { text: "Tidak bisa dinilai tanpa tahu harganya", why: "Salah: spread PERSEN (2%) sudah menormalisasi harga — justru itulah gunanya mengukur spread dalam persen." },
          ],
        },
      ],
      next: { label: "BCD23 — Python untuk Analisis On-Chain", href: "/learn/bcd23-python-onchain" },
    },
  ],
};
