"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A39Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const stationaryData = [
    {
      x: Array.from({ length: 60 }, (_, i) => i + 1),
      y: [0.5, -0.3, 0.8, -0.6, 0.2, 0.9, -0.4, 0.1, -0.8, 0.6, 0.3, -0.5, 0.7, -0.2, 0.4, -0.9, 0.5, 0.0, -0.3, 0.8, -0.6, 0.2, 0.6, -0.4, 0.1, -0.7, 0.9, -0.1, 0.3, -0.5, 0.6, 0.2, -0.8, 0.4, -0.2, 0.7, -0.5, 0.1, 0.8, -0.3, 0.5, -0.6, 0.2, -0.4, 0.9, -0.2, 0.3, -0.7, 0.6, 0.0, -0.5, 0.8, -0.4, 0.2, -0.1, 0.7, -0.6, 0.4, -0.3, 0.5],
      mode: "lines",
      type: "scatter",
      name: "Stasioner",
      line: { color: "#22c55e", width: 2 },
    },
  ];

  const nonstatData = [
    {
      x: Array.from({ length: 60 }, (_, i) => i + 1),
      y: Array.from({ length: 60 }, (_, i) => 0.15 * i + [0.5, -0.3, 0.8, -0.6, 0.2][i % 5]),
      mode: "lines",
      type: "scatter",
      name: "Non-stasioner (tren)",
      line: { color: "#ef4444", width: 2 },
    },
  ];

  const acfData = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [0.85, 0.72, 0.61, 0.52, 0.44, 0.37, 0.31, 0.26, 0.22, 0.19],
      type: "bar",
      name: "ACF (AR(1))",
      marker: { color: "#2a7de1" },
    },
  ];

  const pacfData = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [0.85, 0.02, -0.03, 0.01, -0.02, 0.03, -0.01, 0.02, -0.02, 0.01],
      type: "bar",
      name: "PACF (AR(1))",
      marker: { color: "#e8a838" },
    },
  ];

  const forecastData = [
    {
      x: Array.from({ length: 40 }, (_, i) => i + 1),
      y: [3.1, 3.4, 2.9, 3.6, 3.2, 3.8, 3.4, 4.0, 3.6, 4.2, 3.8, 4.4, 4.0, 4.6, 4.2, 3.9, 4.5, 4.1, 4.7, 4.3, 4.9, 4.5, 5.1, 4.7, 4.4, 5.0, 4.6, 5.2, 4.8, 5.4, 5.0, 4.7, 5.3, 4.9, 5.5, 5.1, 5.7, 5.3, 5.9, 5.5],
      mode: "lines",
      type: "scatter",
      name: "Aktual",
      line: { color: "#2a7de1", width: 2 },
    },
    {
      x: [41, 42, 43, 44, 45],
      y: [5.8, 6.0, 6.2, 6.4, 6.6],
      mode: "lines",
      type: "scatter",
      name: "Forecast",
      line: { color: "#e8a838", width: 3, dash: "dash" },
    },
    {
      x: [41, 42, 43, 44, 45, 45, 44, 43, 42, 41],
      y: [5.3, 5.2, 5.1, 5.0, 4.9, 8.3, 7.8, 7.3, 6.8, 6.3],
      mode: "lines",
      type: "scatter",
      name: "Interval 95%",
      fill: "toself",
      fillcolor: "rgba(232,168,56,0.2)",
      line: { color: "rgba(0,0,0,0)" },
    },
  ];

  const lab1Code = `# Stasioneritas: ADF test dari nol (versi sederhana)
# Ide Dickey-Fuller: regresikan delta_y ke y_lag.
# Jika koefisien ~ 0 -> random walk (non-stasioner, unit root).
# Jika koefisien negatif signifikan -> mean-reverting (stasioner).
import random, math
random.seed(23)

def make_ar1(n, phi, sigma=1.0):
    ys = [0.0]
    for _ in range(n-1):
        ys.append(phi*ys[-1] + random.gauss(0, sigma))
    return ys

def make_trend(n, sigma=1.0):
    return [0.1*i + random.gauss(0, sigma) for i in range(n)]

def adf_simple(y):
    # regresi: dy = a + b*y_lag ; uji b = 0
    dy = [y[i]-y[i-1] for i in range(1, len(y))]
    yl = y[:-1]
    n = len(dy)
    mx = sum(yl)/n; my = sum(dy)/n
    sxx = sum((v-mx)**2 for v in yl)
    b = sum((a-mx)*(c-my) for a, c in zip(yl, dy))/sxx
    a = my - b*mx
    resid = [c-(a+b*v) for v, c in zip(yl, dy)]
    s2 = sum(r**2 for r in resid)/(n-2)
    se_b = math.sqrt(s2/sxx)
    t = b/se_b
    return b, t

for nama, y in [("AR(1) phi=0.7 (stasioner) ", make_ar1(300, 0.7)),
                ("Random walk phi=1.0     ", make_ar1(300, 1.0)),
                ("Tren deterministik      ", make_trend(300))]:
    b, t = adf_simple(y)
    # nilai kritis kasar ADF 5% ~ -2.86
    print(f"{nama}: b={b:+.3f}, t={t:+.2f} ->",
          "STASIONER (tolak unit root)" if t < -2.86 else "NON-STASIONER (unit root?)")
print()
print("CATATAN: tren deterministik 'terlihat' non-stasioner oleh uji ini")
print("karena mean-nya bergerak. Solusi: detrending atau differencing.")
print("COBA: ubah phi 0.7 -> 0.95 (near unit root). Uji makin sulit menolak!")`;

  const lab2Code = `# ARIMA(1,1,1) dari nol: differencing + AR + MA, lalu forecast
import random, math
random.seed(41)

# Data: random walk + noise (mirip harga saham harian)
n = 120
y = [100.0]
for _ in range(n-1):
    y.append(y[-1] + random.gauss(0.15, 1.2))

# Langkah 1: differencing (d=1) -> stasionerkan
d = [y[i]-y[i-1] for i in range(1, n)]

# Langkah 2: estimasi AR(1) pada data differenced: d_t = c + phi*d_{t-1} + e
m = len(d)
mx = sum(d[:-1])/ (m-1); my = sum(d[1:])/(m-1)
phi = sum((a-mx)*(b-my) for a, b in zip(d[:-1], d[1:]))/sum((a-mx)**2 for a in d[:-1])
c = my - phi*mx
resid = [b-(c+phi*a) for a, b in zip(d[:-1], d[1:])]
# Langkah 3: MA(1) kasar: theta dari autokorelasi lag-1 residual
mr = sum(resid)/len(resid)
theta = sum((a-mr)*(b-mr) for a, b in zip(resid[:-1], resid[1:]))/sum((a-mr)**2 for a in resid)
sigma = math.sqrt(sum((r-mr)**2 for r in resid)/len(resid))

print(f"ARIMA(1,1,1): d=1 (differencing 1x)")
print(f"  phi (AR)   = {phi:+.3f}  -> momentum return harian")
print(f"  theta (MA) = {theta:+.3f}  -> koreksi shock kemarin")
print(f"  sigma      = {sigma:.3f}")
print()

# Langkah 4: forecast 5 langkah ke depan (level asli via kumulasi)
last_d = d[-1]; last_e = resid[-1]; last_y = y[-1]
print(f"{'h':>3} | {'forecast':>9} | interval 95%")
f_d, f_e = last_d, last_e
for h in range(1, 6):
    f_d = c + phi*f_d + theta*f_e
    f_e = 0.0  # ekspektasi shock masa depan = 0
    last_y = last_y + f_d
    w = sigma*math.sqrt(h)  # ketidakpastian melebar ~ sqrt(h)
    print(f"{h:>3} | {last_y:>9.2f} | [{last_y-1.96*w:.2f}, {last_y+1.96*w:.2f}]")
print()
print("Perhatikan interval MELEBAR seiring horizon - forecast jauh =")
print("hampir tidak informatif. Jangan percaya forecast 30 hari ARIMA!")
print("COBA: ganti random walk dengan tren kuat (0.15 -> 0.8).")
print("Forecast ikut-ikutan tren - ARIMA tidak tahu 'kenapa'.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.9 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Time Series:<br />Meramal Masa Depan dari Gema Masa Lalu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#prasyarat">Prasyarat 2 Menit: Dari Regresi ke Waktu</a></li>
          <li><a href="#cerita">Cerita Pembuka: Korelasi 0,99 yang Tidak Berarti Apa-Apa</a></li>
          <li><a href="#stasioner">Stasioneritas — Syarat Masuk Dunia Time Series</a></li>
          <li><a href="#arma">AR, MA, ARMA — Dua Cara Masa Lalu Menggema</a></li>
          <li><a href="#arima">ARIMA — Resep Lengkap (p, d, q)</a></li>
          <li><a href="#diagnostik">Identifikasi Orde: ACF, PACF, dan Information Criteria</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji Stasioneritas (ADF) dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: ARIMA(1,1,1) dari Nol + Forecast</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Model Time Series Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Forecast NPL Kuartalan</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan stasioneritas (lemah) dan menjelaskan mengapa ia prasyarat, termasuk jebakan regresi lancung.</li>
          <li>Menjelaskan mekanisme AR(p), MA(q), dan ARIMA(p,d,q) beserta interpretasi tiap parameter.</li>
          <li>Menggunakan pola ACF/PACF dan information criteria (AIC/BIC) untuk mengidentifikasi orde model.</li>
          <li>Melakukan differencing yang tepat dan menginterpretasikan forecast beserta intervalnya yang melebar.</li>
        </ul>
      </div>

      {/* PRASYARAT */}
      <h2 id="prasyarat">📦 Prasyarat 2 Menit: Dari Regresi ke Waktu</h2>
      <div className="callout">
        <p>Lesson ini memasuki paradigma baru: <strong>data berurutan waktu</strong>, di mana asumsi &ldquo;observasi independen&rdquo; (A3.1) <strong>runtuh total</strong> — nilai hari ini bergantung pada kemarin. Ingat tiga bekalmu: (1) <strong>autokorelasi</strong> (A3.2: uji Durbin-Watson) — korelasi deret dengan dirinya di masa lalu, kini jadi <em>bintang utama</em>, bukan pelanggaran; (2) <strong>random CV dilarang</strong> untuk data waktu (A3.8) — validasi harus walk-forward; (3) <strong>regresi butuh hubungan yang stabil</strong> — di dunia waktu, &ldquo;stabil&rdquo; punya nama khusus: <strong>stasioneritas</strong>. Itulah gerbang masuk lesson ini.</p>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Korelasi 0,99 yang Tidak Berarti Apa-Apa</h2>
      <div className="story">
        <p>Tahun 1974, Clive Granger dan Paul Newbold mempublikasikan temuan menggemparkan: mereka meregresikan dua <strong>random walk independen</strong> (deret acak yang tidak berhubungan sama sekali) satu sama lain. Hasilnya? Korelasi <strong>0,99</strong>, R² tinggi, t-statistik &ldquo;sangat signifikan&rdquo;. Menurut semua metrik A3.1–A3.2, ini hubungan yang luar biasa kuat.</p>
        <p>Padahal kedua deret dibangkitkan dari koin yang dilempar terpisah — <strong>tidak ada hubungan sama sekali</strong>. Inilah <strong>regresi lancung</strong> (<em>spurious regression</em>): dua deret non-stasioner yang sama-sama &ldquo;berjalan&rdquo; terlihat berhubungan hanya karena keduanya bergerak seiring waktu. Semua uji signifikansi yang kamu pelajari <strong>rusak</strong> di sini — distribusi t-statistiknya bahkan bukan distribusi-t lagi!</p>
        <p>Twist-nya: Granger kemudian memenangkan Nobel (2003) sebagian untuk <em>kointegrasi</em> — konsep bahwa dua deret non-stasioner <em>bisa</em> punya hubungan jangka panjang yang bermakna (misal harga saham dua perusahaan sejenis). Jadi korelasi antar deret waktu bukan selalu bohong — tapi kamu butuh <strong>peralatan khusus</strong> untuk membedakan yang asli dari yang lancung. Itulah isi lesson ini.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="stasioner">Stasioneritas — Syarat Masuk Dunia Time Series</h2>
      <p><strong>Definisi.</strong> Deret <strong>stasioner (lemah)</strong> jika tiga hal <strong>konstan sepanjang waktu</strong>:</p>
      <Tex math={String.raw`E[y_t] = \mu, \qquad Var(y_t) = \sigma^2, \qquad Cov(y_t, y_{t-k}) = \gamma_k \;\; \text{(hanya tergantung } k\text{, bukan } t\text{)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`E[y_t] = \mu`} />: rata-rata tidak hanyut ke mana-mana (tidak ada tren)</li>
        <li><Tex math={String.raw`Var(y_t) = \sigma^2`} />: sebaran tidak melebar/menyempit seiring waktu</li>
        <li><Tex math={String.raw`Cov(y_t, y_{t-k}) = \gamma_k`} />: &ldquo;ingatan&rdquo; deret terhadap <Tex math={String.raw`k`} /> periode lalu <strong>sama</strong> di 2020 maupun 2024 — dependensi stabil, bukan berubah-ubah</li>
      </ul>
      <p><strong>Mengapa wajib?</strong> Semua estimasi time series pada dasarnya memakai &ldquo;rata-rata perilaku masa lalu untuk prediksi masa depan&rdquo;. Jika perilakunya sendiri berubah-ubah (non-stasioner), masa lalu bukan panduan masa depan — dan regresi antar deret non-stasioner menghasilkan <strong>regresi lancung</strong> (cerita pembuka).</p>

      <PlotlyChart
        data={stationaryData}
        title="Stasioner: mean & variansi konstan"
        layout={{ xaxis: { title: "Waktu" }, yaxis: { title: "y" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> deret waktu; perhatikan apakah &ldquo;pusat gravitasi&rdquo; dan &ldquo;lebar goyangan&rdquo; berubah.</p>
        <p><strong>Interpretasi:</strong> berosilasi di sekitar nol dengan amplitudo stabil dari awal sampai akhir — inilah stasioner. Return harian saham biasanya seperti ini (tapi volatilitasnya bisa berubah — itu A3.10!).</p>
      </div>

      <PlotlyChart
        data={nonstatData}
        title="Non-stasioner: tren (mean hanyut)"
        layout={{ xaxis: { title: "Waktu" }, yaxis: { title: "y" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama — perhatikan pusat gravitasinya.</p>
        <p><strong>Interpretasi:</strong> mean-nya <strong>hanyut naik</strong> seiring waktu (tren deterministik). Meregresikan deret seperti ini mentah-mentah = mengundang regresi lancung. Obat: <strong>detrending</strong> (kurangi tren) atau <strong>differencing</strong> (lihat ARIMA).</p>
      </div>

      <p><strong>Uji formal: ADF</strong> (<em>Augmented Dickey-Fuller</em>). H₀: ada <strong>unit root</strong> (non-stasioner). Logika: regresikan <Tex math={String.raw`\Delta y_t`} /> ke <Tex math={String.raw`y_{t-1}`} /> — jika koefisiennya nol, deret adalah random walk (guncangan permanen, tidak kembali ke mean). Tolak H₀ (t-stat &lt; nilai kritis ≈ −2,86) → stasioner. <strong>Catatan:</strong> ADF lemah untuk &ldquo;near unit root&rdquo; (φ = 0,95) — butuh data panjang.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan dua jenis non-stasioneritas: <strong>tren deterministik</strong> (tumbuh karena waktu berlalu — PDB nominal) vs <strong>stokastik/unit root</strong> (random walk — harga saham: guncangan kemarin <em>permanen</em>, tidak kembali). Obatnya beda: tren deterministik → detrending; unit root → differencing. Salah obat = masalah tidak sembuh (differencing tren deterministik menimbulkan autokorelasi buatan!).</p>
      </div>

      <h2 id="arma">AR, MA, ARMA — Dua Cara Masa Lalu Menggema</h2>
      <p><strong>Definisi.</strong> Dua blok pembangun deret stasioner:</p>
      <ul>
        <li><strong>AR(p)</strong> (<em>autoregressive</em>): hari ini = kombinasi linear <Tex math={String.raw`p`} /> hari lalu + shock baru:
          <Tex math={String.raw`y_t = c + \phi_1 y_{t-1} + \cdots + \phi_p y_{t-p} + \varepsilon_t`} block />
          <Tex math={String.raw`\phi_1`} /> = &ldquo;momentum&rdquo;: <Tex math={String.raw`\phi_1 = 0{,}7`} /> artinya 70% nilai kemarin terbawa ke hari ini. Syarat stasioner: <Tex math={String.raw`|\phi| < 1`} /> (ingatan <em>meluruh</em>, tidak abadi).</li>
        <li><strong>MA(q)</strong> (<em>moving average</em>): hari ini = rata-rata <Tex math={String.raw`q`} /> shock lalu + shock baru:
          <Tex math={String.raw`y_t = \mu + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \cdots + \theta_q \varepsilon_{t-q}`} block />
          <Tex math={String.raw`\theta_1`} /> = &ldquo;gema shock&rdquo;: shock kemarin masih terasa <Tex math={String.raw`\theta_1`} />-nya hari ini, lalu hilang total setelah <Tex math={String.raw`q`} /> periode (ingatan <em>terpotong</em>, bukan meluruh).</li>
        <li><strong>ARMA(p,q)</strong>: gabungan keduanya — untuk deret yang punya momentum <em>dan</em> gema shock.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca AR(1)</summary>
        <p>Model NPL: <Tex math={String.raw`y_t = 0{,}5 + 0{,}8 y_{t-1} + \varepsilon_t`} />, <Tex math={String.raw`y`} /> = NPL %.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`\phi = 0{,}8 < 1`} /> → stasioner, ingatan meluruh.<br />
        <strong>Langkah 2</strong> — mean jangka panjang: μ = 0,5/(1−0,8) = <strong>2,5%</strong> (level keseimbangan).<br />
        <strong>Langkah 3</strong> — forecast 1 langkah dari y<sub>t</sub> = 4%: ŷ<sub>t+1</sub> = 0,5 + 0,8×4 = <strong>3,7%</strong> (turun menuju 2,5%).<br />
        <strong>Langkah 4</strong> — <em>half-life</em> guncangan: ln(0,5)/ln(0,8) ≈ <strong>3,1 periode</strong> — separuh guncangan hilang dalam ~3 kuartal. Inilah &ldquo;ingatan&rdquo; deret yang terkuantifikasi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Deret yang stasioner berarti acak total — tidak ada yang bisa dimodelkan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> stasioner ≠ white noise! AR(1) dengan φ = 0,8 adalah stasioner <em>dan</em> sangat bisa dimodelkan — 80% nilai kemarin terbawa ke hari ini. Stasioneritas hanya berarti <em>aturan mainnya stabil</em> (mean/variansi/kovariansi konstan), bukan berarti <em>tidak ada aturan main</em>. White noise adalah kasus khusus yang membosankan (φ = 0); deret stasioner pada umumnya justru ladang model ARMA.</p>
      </div>

      <h2 id="arima">ARIMA — Resep Lengkap (p, d, q)</h2>
      <p><strong>Definisi.</strong> ARIMA(<Tex math={String.raw`p, d, q`} />) = terapkan ARMA(<Tex math={String.raw`p, q`} />) ke deret yang sudah di-<strong>differencing</strong> <Tex math={String.raw`d`} /> kali:</p>
      <Tex math={String.raw`\Delta^d y_t = c + \phi_1 \Delta^d y_{t-1} + \cdots + \varepsilon_t + \theta_1 \varepsilon_{t-1} + \cdots`} block />
      <ul>
        <li><Tex math={String.raw`d`} />: berapa kali differencing (<Tex math={String.raw`\Delta y_t = y_t - y_{t-1}`} />) agar stasioner. Harga saham: <Tex math={String.raw`d = 1`} /> (return ≈ stasioner). Kebanyakan data ekonomi: <Tex math={String.raw`d = 0`} /> atau 1. <strong>Jangan overdifferencing</strong> — differencing deret yang sudah stasioner menciptakan autokorelasi buatan.</li>
        <li><Tex math={String.raw`p, q`} />: orde AR dan MA dari deret yang sudah stasioner.</li>
        <li>Musiman? → <strong>SARIMA</strong>: tambah (P,D,Q)<sub>s</sub> untuk pola berulang tiap <Tex math={String.raw`s`} /> periode (misal NPL naik tiap Lebaran).</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ARIMA meramal masa depan dengan akurat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ARIMA hanya mengekstrapolasi <em>pola dependensi masa lalu</em> — ia tidak tahu <em>mengapa</em> pola itu ada dan buta terhadap perubahan struktural (krisis, regulasi baru, pandemi). Forecast-nya meluruh ke mean dengan interval yang <strong>melebar</strong> seiring horizon (lihat Lab 2). Gunakan ARIMA untuk horizon pendek + pemahaman dinamika, bukan ramalan 5 tahun untuk RUPS.</p>
      </div>

      <h2 id="diagnostik">Identifikasi Orde: ACF, PACF, dan Information Criteria</h2>
      <p><strong>Definisi.</strong> <strong>ACF</strong> (<em>autocorrelation function</em>): korelasi <Tex math={String.raw`y_t`} /> dengan <Tex math={String.raw`y_{t-k}`} /> untuk tiap lag <Tex math={String.raw`k`} />. <strong>PACF</strong> (<em>partial ACF</em>): korelasi yang sama <em>setelah membuang</em> efek lag di antaranya — &ldquo;efek langsung&rdquo; lag-<Tex math={String.raw`k`} />.</p>
      <p><strong>Pola sidik jari:</strong></p>
      <ul>
        <li><strong>AR(p)</strong>: PACF <em>terpotong</em> setelah lag <Tex math={String.raw`p`} /> (= 0), ACF <em>meluruh</em> bertahap</li>
        <li><strong>MA(q)</strong>: ACF <em>terpotong</em> setelah lag <Tex math={String.raw`q`} />, PACF <em>meluruh</em> bertahap</li>
        <li><strong>ARMA</strong>: keduanya meluruh — butuh information criteria</li>
      </ul>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-4)" }}>
        <div>
          <PlotlyChart
            data={acfData}
            title="ACF AR(1): meluruh bertahap"
            layout={{ xaxis: { title: "Lag" }, yaxis: { title: "Korelasi" }, showlegend: false }}
          />
        </div>
        <div>
          <PlotlyChart
            data={pacfData}
            title="PACF AR(1): terpotong setelah lag 1"
            layout={{ xaxis: { title: "Lag" }, yaxis: { title: "Korelasi parsial" }, showlegend: false }}
          />
        </div>
      </div>
      <div className="chart-guide">
        <p><strong>Cara membaca (ACF, kiri):</strong> tiap batang = korelasi total deret dengan dirinya di lag tersebut (termasuk efek tidak langsung via lag antara).</p>
        <p><strong>Interpretasi:</strong> batang meluruh perlahan 0,85 → 0,19 tanpa terpotong — korelasi &ldquo;menular&rdquo; lewat lag antara. Pola meluruh = ciri AR, bukan MA.</p>
      </div>
      <div className="chart-guide">
        <p><strong>Cara membaca (PACF, kanan):</strong> tiap batang = korelasi <em>langsung</em> lag tersebut setelah efek lag antara dibuang.</p>
        <p><strong>Interpretasi:</strong> hanya lag 1 yang signifikan, sisanya ≈ 0 — <strong>sidik jari AR(1)</strong> yang sempurna. Aturan praktis: &ldquo;yang terpotong menunjukkan orde&rdquo; — PACF terpotong di 1 → p = 1.</p>
      </div>

      <p><strong>AIC/BIC</strong> untuk pemilihan final: <Tex math={String.raw`AIC = -2\log L + 2k`} />, <Tex math={String.raw`BIC = -2\log L + k\log n`} /> — tradeoff fit vs kompleksitas (BIC menghukum lebih keras). Pilih model dengan AIC/BIC terkecil, lalu <strong>cek residual</strong>: residual ARIMA yang sehat = white noise (ACF residual ≈ 0 semua). Jika residual masih berpola → orde kurang.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> alur Box-Jenkins dalam satu kalimat: <strong>stasionerkan (d) → identifikasi (ACF/PACF + AIC) → estimasi → cek residual (harus white noise) → forecast</strong>. Dan forecast ARIMA selalu dibaca <em>bersama intervalnya</em> — garis forecast tanpa interval adalah setengah kebohongan, karena ketidakpastian melebar ∝ √h.</p>
      </div>

      <PlotlyChart
        data={forecastData}
        title="Forecast ARIMA + Interval 95% yang Melebar"
        layout={{ xaxis: { title: "Periode" }, yaxis: { title: "NPL (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = aktual, garis kuning putus-putus = forecast 5 periode, pita kuning = interval kepercayaan 95%.</p>
        <p><strong>Interpretasi:</strong> forecast meluruh menuju mean jangka panjang, dan <strong>pitanya melebar</strong> — di h=5, intervalnya sudah selebar ±1,7 poin. Inilah visual kejujuran: model mengakui bahwa makin jauh ke depan, makin sedikit yang ia tahu. <strong>Jangan pernah presentasikan garis forecast tanpa pitanya.</strong></p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Time series = &ldquo;masa lalu menggema ke masa depan&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Stasioner atau tidak? — baca chartnya</summary>
              <p>Dua deret 100 hari. A: mean ≈ 50 konstan, varians konstan. B: mean naik 50 → 80 (tren). Mana yang bisa di-ARIMA langsung?</p>
              <p><strong>Langkah 1</strong> — A: <strong>stasioner</strong> (mean &amp; varians konstan) → ARIMA langsung bisa.<br />
              <strong>Langkah 2</strong> — B: <strong>tidak stasioner</strong> (mean hanyut) → differencing dulu (d=1): Δy<sub>t</sub> = y<sub>t</sub> − y<sub>t−1</sub> ≈ konstan + noise.<br />
              <strong>Langkah 3</strong> — tes formal: ADF — H0: unit root (tidak stasioner). p &lt; 0,05 → tolak → stasioner.</p>
              <p>Pelajaran: &ldquo;stasioner&rdquo; = &ldquo;perilaku statistik tidak berubah waktu&rdquo;. ARIMA butuh ini — jika tidak, differencing sampai dapat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Forecast + interval — baca ketidakpastiannya</summary>
              <p>ARIMA forecast penjualan: hari+1: 100 (±10); hari+7: 105 (±35); hari+30: 110 (±80). Apa yang dibaca manajer?</p>
              <p><strong>Langkah 1</strong> — titik forecast naik lembut (100 → 110) — <em>tapi</em> interval melebar ∝ √h.<br />
              <strong>Langkah 2</strong> — hari+30: (30; 190) — praktis &ldquo;tidak tahu&rdquo;! Keputusan stok 30 hari dari titik 110 = judi.<br />
              <strong>Langkah 3</strong> — aturan: <strong>forecast tanpa interval = setengah bohong</strong>. Keputusan = f(titik, interval): pesan stok untuk (titik + buffer interval).</p>
              <p>Pelajaran: nilai forecast = titik <em>dan</em> ketidakpastiannya. Manajer yang hanya baca titik akan kecewa — atau bangkrut.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Uji Stasioneritas (ADF) dari Nol</h2>
      <p>Implementasi logika Dickey-Fuller: regresikan perubahan ke level lag. Bedakan AR stasioner, random walk, dan tren.</p>
      <PyodideLab
        title="Lab 1 — ADF Test Sederhana"
        hint="Coba: phi 0.7 → 0.95. Uji makin sulit menolak unit root — butuh data lebih panjang."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: ARIMA(1,1,1) dari Nol + Forecast</h2>
      <p>Differencing → estimasi AR &amp; MA → forecast dengan interval yang melebar. Rasakan keterbatasan forecast jauh.</p>
      <PyodideLab
        title="Lab 2 — ARIMA Manual + Forecast"
        hint="Perhatikan interval 95% melebar ∝ √h. Forecast 5 langkah masih berguna; 30 langkah = tebakan."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Model Time Series Mana?</h2>

      <div className="decision-card">
        <h3>1. Deret stasioner, dependensi pendek → <strong>AR/MA/ARMA</strong></h3>
        <p><strong>Kondisi:</strong> ADF menolak unit root; ACF/PACF berpola jelas.</p>
        <p><strong>Kenapa:</strong> sederhana, interpretable (momentum &amp; gema shock terkuantifikasi).</p>
        <p><strong>Contoh nyata:</strong> spread kredit, NPL yang mean-reverting.</p>
      </div>

      <div className="decision-card">
        <h3>2. Non-stasioner (unit root) → <strong>ARIMA dengan d=1</strong></h3>
        <p><strong>Kondisi:</strong> ADF gagal menolak; deret &ldquo;berjalan&rdquo; (harga, level).</p>
        <p><strong>Kenapa:</strong> differencing mengubah random walk jadi deret stasioner yang bisa dimodelkan.</p>
        <p><strong>Contoh nyata:</strong> harga saham (model return-nya), nilai tukar.</p>
      </div>

      <div className="decision-card">
        <h3>3. Ada pola musiman → <strong>SARIMA</strong></h3>
        <p><strong>Kondisi:</strong> ACF memuncak di lag musiman (12 bulanan, 4 kuartalan).</p>
        <p><strong>Kenapa:</strong> menangkap siklus berulang yang ARIMA biasa lewatkan.</p>
        <p><strong>Contoh nyata:</strong> penyaluran kredit (Lebaran/Natal), NPL musiman.</p>
      </div>

      <div className="decision-card">
        <h3>4. Hubungan dua deret non-stasioner → <strong>uji kointegrasi dulu!</strong></h3>
        <p><strong>Kondisi:</strong> ingin regresi antar deret yang &ldquo;berjalan&rdquo;.</p>
        <p><strong>Kenapa:</strong> tanpa kointegrasi = regresi lancung (Granger-Newbold). Dengan kointegrasi → VECM untuk dinamika jangka pendek + keseimbangan jangka panjang.</p>
        <p><strong>Contoh nyata:</strong> suku bunga &amp; inflasi; harga dua saham sejenis (pairs trading).</p>
      </div>

      <div className="decision-card">
        <h3>5. Volatilitas yang berubah-ubah → <strong>bukan ARIMA — ke A3.10 (GARCH)</strong></h3>
        <p><strong>Kondisi:</strong> mean stabil tapi &ldquo;lebar goyangan&rdquo; berubah (cluster volatility).</p>
        <p><strong>Kenapa:</strong> ARIMA memodelkan <em>mean</em>; volatilitas butuh model variansi bersyarat.</p>
        <p><strong>Contoh nyata:</strong> return saham (tenang lalu tiba-tiba bergejolak).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>ADF dulu</strong> — jangan modelkan deret yang belum jelas stasioneritasnya.</li>
          <li>ACF/PACF = sidik jari: yang <em>terpotong</em> menunjukkan orde.</li>
          <li>Residual harus white noise — kalau masih berpola, orde kurang.</li>
          <li>Forecast <strong>selalu</strong> dengan interval; horizon jauh = rendah hati.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Forecast NPL Kuartalan</h2>
      <div className="callout">
        <p>Bank memintamu forecast NPL 4 kuartal ke depan untuk perencanaan modal. Data: NPL kuartalan 2016–2024 (36 observasi). Temuanmu:</p>
        <ul>
          <li>ADF: t = −1,9 (gagal menolak unit root); setelah differencing 1×: t = −4,2 (stasioner).</li>
          <li>ACF/PACF data differenced: pola AR(1). AIC terkecil: ARIMA(1,1,1).</li>
          <li>Forecast: Q1 3,2% [2,4–4,0], Q2 3,0% [1,9–4,1], Q3 2,9% [1,5–4,3], Q4 2,8% [1,1–4,5].</li>
          <li>Direksi: &ldquo;Bagus, NPL turun ke 2,8%. Kita bisa kurangi cadangan.&rdquo;</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa yang benar dari analisismu? (b) Apa yang berbahaya dari kesimpulan direksi? (c) Apa yang kamu sampaikan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Prosedur benar:</strong> uji stasioneritas → differencing tepat 1× (tidak overdifferencing) → identifikasi orde → forecast dengan interval. Ini textbook yang baik.</p>
          <p>(b) <strong>Dua bahaya:</strong> (1) direksi membaca <em>titik</em> forecast (2,8%) dan mengabaikan <em>interval</em> ([1,1–4,5]!) — di Q4, NPL 4,5% masih sangat mungkin; mengurangi cadangan dari titik tengah adalah judi. (2) ARIMA buta perubahan struktural — jika resesi datang, forecast &ldquo;meluruh ke mean&rdquo; ini tidak berguna; butuh skenario stres.</p>
          <p>(c) &ldquo;Angka 2,8% adalah <em>tengah</em> dari rentang 1,1–4,5%. Perencanaan modal yang prudent memakai <strong>batas atas interval</strong> atau skenario stres, bukan titik tengah. Dan forecast ini mengasumsikan tidak ada perubahan struktural — untuk keputusan cadangan, lengkapi dengan stress test.&rdquo;</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>ACF meluruh lambat, PACF terpotong di lag 2. Model apa? Orde berapa?</li>
              <li>Mengapa <em>tidak boleh</em> train-test split acak untuk time series? (Hubungkan ke D7.)</li>
              <li>Seasonal: penjualan naik tiap Desember. Komponen apa di ARIMA? Bagaimana menanganinya selain SARIMA?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>AR(2)</strong>: PACF terpotong → AR; lag pemotongan = p = 2. (Kebalikan: ACF terpotong → MA.)</p>
              <p><strong>2.</strong> Split acak = <strong>lookahead</strong>: model &ldquo;belajar dari masa depan&rdquo; lalu diuji di masa lalu — performa palsu. Pakai <strong>time-based split</strong> / expanding window (train masa lalu → test masa depan).</p>
              <p><strong>3.</strong> Komponen <strong>musiman</strong> (S). Selain SARIMA: (a) <strong>dekomposisi</strong> (kurangi musiman dulu, modelkan residu), (b) <strong>dummy bulan</strong> dalam regresi, (c) Fourier terms. Pilih yang residualnya jadi white noise.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dua random walk independen diregresikan: R²=0,9, t-statistik 'signifikan'. Kesimpulan?"
        options={[
          "Hubungan kuat ditemukan",
          "Regresi lancung (spurious) — dua deret non-stasioner bisa terlihat berhubungan tanpa hubungan nyata; uji kointegrasi dulu",
          "Butuh lebih banyak data",
          "Ganti ke regresi logistik",
        ]}
        correct={1}
        explanation="Benar: Granger-Newbold (1974). Deret non-stasioner yang sama-sama 'berjalan' menghasilkan statistik signifikan palsu. Solusi: differencing, atau uji kointegrasi jika diduga ada hubungan jangka panjang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. ACF meluruh bertahap, PACF terpotong setelah lag 2. Model?"
        options={[
          "MA(2)",
          "AR(2) — yang terpotong (PACF) menunjukkan orde AR",
          "ARMA(2,2)",
          "White noise",
        ]}
        correct={1}
        explanation="Benar: 'yang terpotong menunjukkan orde' — PACF terpotong di lag 2 → AR(2). (MA(q): ACF yang terpotong di lag q.)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. ADF t-stat = −1,5 (nilai kritis −2,86). Tindakan?"
        options={[
          "Langsung fit ARMA — sudah stasioner",
          "Gagal menolak unit root → deret non-stasioner; differencing (atau detrending jika tren deterministik) dulu",
          "Naikkan orde AR",
          "Buang data",
        ]}
        correct={1}
        explanation="Benar: −1,5 > −2,86 = gagal menolak H₀ (unit root). Modelkan dalam bentuk differenced. Tapi cek dulu: tren deterministik vs stokastik — obatnya beda!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Setelah fit ARIMA, ACF residual masih signifikan di lag 3. Artinya?"
        options={[
          "Model sempurna",
          "Model belum menangkap semua dinamika — orde kurang / salah; perbaiki spesifikasi sebelum forecast",
          "Normal — abaikan",
          "Naikkan d",
        ]}
        correct={1}
        explanation="Benar: residual ARIMA yang sehat = white noise. Pola tersisa = informasi yang belum ditangkap = forecast suboptimal. Kembali ke identifikasi orde."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Forecast 12 bulan ARIMA disajikan sebagai satu garis tanpa interval. Masalah?"
        options={[
          "Tidak ada — garisnya dari model",
          "Ketidakpastian melebar ∝ √h — tanpa interval, pembaca tidak tahu forecast bulan ke-12 hampir tak informatif. Wajib sertakan interval",
          "ARIMA tidak bisa forecast 12 bulan",
          "Harus pakai median",
        ]}
        correct={1}
        explanation="Benar: garis tanpa interval = setengah kebohongan. Interval yang melebar adalah bagian integral dari 'jawaban' ARIMA — ia mengkuantifikasi ketidaktahuan yang jujur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan differencing DILARANG (overdifferencing)?"
        options={[
          "Tidak pernah — differencing selalu aman",
          "Saat deret sudah stasioner — differencing menciptakan autokorelasi MA(1) buatan dan membuang informasi level",
          "Saat n kecil",
          "Saat ada musiman",
        ]}
        correct={1}
        explanation="Benar: differencing deret stasioner = 'mengobati orang sehat' — menghasilkan unit root di sisi MA dan menghilangkan informasi level jangka panjang. d dipilih minimal agar stasioner (biasanya 0 atau 1)."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Stasioneritas</strong> (mean, variansi, kovariansi konstan) = prasyarat; non-stasioner → <strong>regresi lancung</strong>. Uji ADF (H₀: unit root).</li>
          <li><strong>AR(p)</strong> = momentum (ingatan meluruh); <strong>MA(q)</strong> = gema shock (ingatan terpotong); <strong>ARIMA(p,d,q)</strong> = ARMA di data differenced.</li>
          <li><strong>Identifikasi:</strong> ACF/PACF (yang terpotong = orde) + AIC/BIC; residual harus white noise.</li>
          <li><strong>Forecast</strong> meluruh ke mean dengan interval melebar ∝ √h — selalu sertakan intervalnya.</li>
          <li><strong>Jangan</strong> regresikan deret non-stasioner tanpa uji kointegrasi; jangan overdifferencing; jangan percaya forecast jauh.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a38-validasi-model" className="btn btn-secondary btn-sm">← A3.8</Link>
        <Link href="/learn/a310-volatilitas" className="btn btn-primary btn-sm">Next: A3.10 →</Link>
      </div>
    </div>
  );
}
