"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A310Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const clusterData = [
    {
      x: Array.from({ length: 100 }, (_, i) => i + 1),
      y: [0.5, -0.4, 0.6, -0.3, 0.4, -0.5, 0.3, -0.2, 0.4, -0.3, 2.8, -3.2, 2.5, -2.9, 3.1, -2.4, 2.7, -3.0, 0.4, -0.5, 0.3, -0.4, 0.5, -0.3, 0.2, -0.4, 0.6, -0.5, 0.3, -0.2, 0.4, -0.6, 0.5, -0.3, 0.2, -2.6, 3.0, -2.8, 2.4, -3.3, 2.9, -2.5, 3.2, -2.7, 0.3, -0.4, 0.5, -0.2, 0.4, -0.5, 0.3, -0.4, 0.2, -0.3, 0.5, -0.4, 0.3, -0.5, 0.4, -0.2, 0.3, -2.9, 2.6, -3.1, 2.8, -2.3, 3.0, -2.6, 2.5, -3.2, 0.4, -0.3, 0.5, -0.4, 0.2, -0.5, 0.3, -0.4, 0.6, -0.3, 0.4, -0.2, 0.5, -0.4, 0.3, -0.5, 0.2, -0.3, 0.4, -0.6, 0.5, -0.3, 0.4, -0.2, 0.3, -0.4, 0.5, -0.3, 0.2, -0.4],
      mode: "lines",
      type: "scatter",
      name: "Return harian (%)",
      line: { color: "#2a7de1", width: 1.5 },
    },
  ];

  const ewmaData = [
    {
      x: Array.from({ length: 60 }, (_, i) => i + 1),
      y: [1.0, 1.02, 0.98, 1.05, 1.1, 1.08, 1.15, 1.3, 1.6, 2.1, 2.6, 2.4, 2.0, 1.7, 1.5, 1.35, 1.25, 1.18, 1.12, 1.08, 1.05, 1.03, 1.01, 1.0, 0.99, 1.0, 1.01, 1.0, 0.98, 1.0, 1.02, 1.0, 0.99, 1.0, 1.01, 1.0, 1.0, 0.99, 1.01, 1.0, 1.0, 0.98, 1.0, 1.02, 1.05, 1.1, 1.25, 1.5, 1.9, 2.3, 2.1, 1.8, 1.55, 1.4, 1.3, 1.22, 1.15, 1.1, 1.06, 1.03],
      mode: "lines",
      type: "scatter",
      name: "EWMA λ=0,94",
      line: { color: "#2a7de1", width: 2.5 },
    },
    {
      x: Array.from({ length: 60 }, (_, i) => i + 1),
      y: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.35, 1.5, 1.55, 1.5, 1.42, 1.35, 1.3, 1.25, 1.22, 1.2, 1.18, 1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.1, 1.1, 1.09, 1.08, 1.08, 1.07, 1.07, 1.06, 1.06, 1.05, 1.05, 1.05, 1.04, 1.04, 1.04, 1.03, 1.03, 1.05, 1.1, 1.2, 1.35, 1.55, 1.6, 1.58, 1.52, 1.47, 1.43, 1.4, 1.37, 1.35, 1.33, 1.31],
      mode: "lines",
      type: "scatter",
      name: "EWMA λ=0,97 (lebih lambat)",
      line: { color: "#e8a838", width: 2.5, dash: "dash" },
    },
  ];

  const garchForecastData = [
    {
      x: Array.from({ length: 30 }, (_, i) => i + 1),
      y: [2.5, 2.3, 2.1, 1.95, 1.85, 1.78, 1.72, 1.68, 1.65, 1.63, 1.61, 1.6, 1.59, 1.58, 1.57, 1.56, 1.56, 1.55, 1.55, 1.54, 1.54, 1.54, 1.53, 1.53, 1.53, 1.53, 1.52, 1.52, 1.52, 1.52],
      mode: "lines",
      type: "scatter",
      name: "Forecast variansi GARCH",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: [1, 30],
      y: [1.5, 1.5],
      mode: "lines",
      type: "scatter",
      name: "Variansi jangka panjang",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# EWMA dari nol: volatilitas yang "ingat" tapi bisa lupa
# Bandingkan: SD 60-hari (semua bobot sama) vs EWMA (bobot meluruh).
import random, math
random.seed(55)

# return dengan regime: tenang -> krisis -> tenang
rets = ([random.gauss(0, 0.8) for _ in range(40)] +
        [random.gauss(0, 3.0) for _ in range(20)] +
        [random.gauss(0, 0.8) for _ in range(40)])

def rolling_sd(rs, w=20):
    out = []
    for i in range(len(rs)):
        win = rs[max(0, i-w+1):i+1]
        m = sum(win)/len(win)
        out.append(math.sqrt(sum((v-m)**2 for v in win)/len(win)))
    return out

def ewma_vol(rs, lam=0.94):
    s2 = sum(v**2 for v in rs[:10])/10
    out = []
    for r in rs:
        s2 = lam*s2 + (1-lam)*r**2
        out.append(math.sqrt(s2))
    return out

rsd = rolling_sd(rets); ew = ewma_vol(rets)
print(" hari | return | SD-20hari | EWMA(0.94)")
print("-"*42)
for i in [38, 39, 40, 41, 45, 55, 59, 60, 61, 70, 99]:
    print(f" {i+1:>4} | {rets[i]:>+6.2f} | {rsd[i]:>9.2f} | {ew[i]:>10.2f}")
print()
print("BACA: saat krisis masuk (hari 41), EWMA MELONJAK duluan (responsif).")
print("Saat krisis keluar (hari 61), SD-20hari 'jatuh dari tebing' 20 hari")
print("kemudian (efek jendela), sementara EWMA meluruh MULUS.")
print()
print("COBA: lam 0.94 -> 0.99. EWMA jadi lambat (mirip SD).")
print("COBA: lam 0.94 -> 0.80. EWMA jadi gelisah (mengikuti noise).")`;

  const lab2Code = `# GARCH(1,1) dari nol: estimasi + forecast mean-reversion volatilitas
import random, math
random.seed(66)

# Bangkitkan GARCH(1,1): sigma2 = 0.1 + 0.12*r2_lag + 0.80*sigma2_lag
n = 1500
omega, alpha, beta = 0.1, 0.12, 0.80
s2 = omega/(1-alpha-beta)
rets, s2s = [], []
for _ in range(n):
    r = random.gauss(0, math.sqrt(s2))
    rets.append(r); s2s.append(s2)
    s2 = omega + alpha*r**2 + beta*s2

# Estimasi via grid search likelihood (sederhana, tanpa optimizer)
def loglik(rets, o, a, b):
    if a+b >= 1 or o <= 0 or a < 0 or b < 0: return float('-inf')
    s2 = o/(1-a-b); ll = 0.0
    for r in rets:
        ll += -0.5*(math.log(2*math.pi*s2) + r**2/s2)
        s2 = o + a*r**2 + b*s2
    return ll

best = None
for o in [0.05, 0.1, 0.2]:
    for a in [0.05, 0.12, 0.2]:
        for b in [0.7, 0.8, 0.88]:
            ll = loglik(rets, o, a, b)
            if best is None or ll > best[0]: best = (ll, o, a, b)
ll, o, a, b = best
print(f"Benar    : omega=0.100, alpha=0.120, beta=0.800")
print(f"Estimasi : omega={o:.3f}, alpha={a:.3f}, beta={b:.3f}")
print(f"Unconditional var: {o/(1-a-b):.3f} (benar: {omega/(1-alpha-beta):.3f})")
print(f"Persistence (a+b) = {a+b:.3f} -> half-life = {math.log(0.5)/math.log(a+b):.1f} hari")
print()
print("Forecast variansi (mean-reversion ke unconditional):")
s2f = o + a*rets[-1]**2 + b*s2s[-1]
for h in range(1, 6):
    if h > 1: s2f = o + (a+b)*s2f
    print(f"  h={h}: sigma = {math.sqrt(s2f):.3f}")
print()
print("COBA: ubah beta 0.80 -> 0.95 saat bangkitkan. Persistence ~1:")
print("guncangan 'diingat' sangat lama (IGARCH-like).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.10 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Volatilitas:<br />Mengukur Badai Saat Laut Tenang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: VaR yang Lolos 250 Hari, Lalu Gagal 12 Kali Sebulan</a></li>
          <li><a href="#fakta">Tiga Fakta Volatilitas: Clustering, Mean-Reversion, Asimetri</a></li>
          <li><a href="#ewma">EWMA — Volatilitas yang Bisa Lupa (RiskMetrics)</a></li>
          <li><a href="#garch">GARCH — Model Volatilitas Standar Industri</a></li>
          <li><a href="#var">Dari Volatilitas ke VaR &amp; Expected Shortfall</a></li>
          <li><a href="#lab1">🔬 Lab 1: EWMA vs Rolling SD — Responsivitas</a></li>
          <li><a href="#lab2">🔬 Lab 2: GARCH(1,1) dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Estimator Volatilitas Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Limit Trading Berbasis GARCH</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tiga fakta stilisasi volatilitas (clustering, mean-reversion, leverage effect) dan implikasinya.</li>
          <li>Menghitung volatilitas EWMA dan menjelaskan peran λ dalam tradeoff responsivitas vs stabilitas.</li>
          <li>Menuliskan persamaan GARCH(1,1), menginterpretasikan ω/α/β, dan menghitung unconditional variance serta half-life.</li>
          <li>Mengubah forecast volatilitas menjadi VaR dan Expected Shortfall, termasuk penyesuaian distribusi berekor tebal.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: VaR yang Lolos 250 Hari, Lalu Gagal 12 Kali Sebulan</h2>
      <div className="story">
        <p>Desk trading bank memakai VaR 99% berbasis volatilitas historis 1 tahun (bobot sama). Selama 250 hari perdagangan, VaR &ldquo;jebol&rdquo; 3 kali — sesuai teori (1% × 250 ≈ 2,5). Model dinyatakan valid. Semua tenang.</p>
        <p>Lalu krisis mini datang. Dalam <strong>satu bulan</strong>, VaR jebol <strong>12 kali</strong>. Bukan karena modelnya &ldquo;rusak&rdquo; kemarin — tapi karena volatilitas historis 1-tahun <strong>lambat merespons</strong>: ia masih &ldquo;ingat&rdquo; 11 bulan pasar tenang, sehingga VaR-nya kekecilan saat badai datang. Breach ke-12 memicu margin call berantai; desk rugi dua kuartal profit dalam 3 minggu.</p>
        <p>Twist-nya: data untuk VaR yang benar <em>sudah ada</em> — return-return besar minggu itu berteriak &ldquo;volatilitas naik!&rdquo;. Tapi estimator bobot-sama <strong>tuli terhadap kabar terbaru</strong>: ia memberi bobot yang sama ke return kemarin dan return 11 bulan lalu. Lesson ini tentang estimator volatilitas yang <em>mendengar</em> — EWMA dan GARCH.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="fakta">Tiga Fakta Volatilitas: Clustering, Mean-Reversion, Asimetri</h2>
      <ol>
        <li><strong>Volatility clustering:</strong> &ldquo;perubahan besar diikuti perubahan besar&rdquo; (Mandelbrot). Pasar tenang bergerombol, badai bergerombol. Return sendiri hampir tak terkorelasi, tapi <strong>return kuadrat/absolute berkorelasi kuat</strong> — inilah yang dimodelkan GARCH.</li>
        <li><strong>Mean-reversion volatilitas:</strong> volatilitas melonjak saat krisis tapi <strong>kembali</strong> ke level normal — tidak tinggal di puncak selamanya. Forecast volatilitas jangka panjang meluruh ke rata-rata historis.</li>
        <li><strong>Asimetri / leverage effect:</strong> kabar buruk menaikkan volatilitas <strong>lebih</strong> daripada kabar baik berukuran sama (penurunan 5% lebih &ldquo;berisik&rdquo; daripada kenaikan 5%). GARCH standar simetris — buta terhadap ini; butuh GJR-GARCH/EGARCH.</li>
      </ol>

      <PlotlyChart
        data={clusterData}
        title="Volatility Clustering: badai bergerombol"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Return (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> deret return harian; perhatikan <em>lebar goyangan</em>, bukan arahnya.</p>
        <p><strong>Interpretasi:</strong> tiga &ldquo;badai&rdquo; jelas (sekitar hari 12, 38, 63) — periode goyangan besar bergerombol, diselingi laut tenang. Inilah yang <strong>gagal</strong> ditangkap SD biasa (satu angka untuk semua periode!) dan yang <strong>berhasil</strong> ditangkap EWMA/GARCH (volatilitas yang berubah tiap hari). Untuk market risk, &ldquo;kapan badainya&rdquo; sama pentingnya dengan &ldquo;seberapa besar rata-ratanya&rdquo;.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> volatilitas bukan sifat aset — ia <strong>sifat waktu</strong>. &ldquo;Volatilitas saham X = 20%&rdquo; adalah kalimat yang tidak lengkap; yang benar: &ldquo;volatilitas X <em>saat ini</em> 35%, <em>rata-rata jangka panjang</em> 20%&rdquo;. Model risiko yang memakai satu angka statis sedang berbohong dengan satu angka — persis seperti mean tanpa SD (A1.3).</p>
      </div>

      <h2 id="ewma">EWMA — Volatilitas yang Bisa Lupa (RiskMetrics)</h2>
      <p><strong>Definisi.</strong> EWMA (<em>exponentially weighted moving average</em>) memberi bobot <strong>meluruh eksponensial</strong> ke masa lalu:</p>
      <Tex math={String.raw`\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\sigma_t^2`} />: estimasi variansi (kuadrat volatilitas) untuk hari <Tex math={String.raw`t`} /></li>
        <li><Tex math={String.raw`r_{t-1}^2`} />: return kuadrat kemarin — &ldquo;kabar terbaru&rdquo; tentang gejolak</li>
        <li><Tex math={String.raw`\lambda`} /> (0–1): <strong>decay factor</strong> — &ldquo;daya ingat&rdquo;. RiskMetrics memakai <Tex math={String.raw`\lambda = 0{,}94`} /> (harian). <Tex math={String.raw`\lambda`} /> besar = ingatan panjang = lambat merespons; kecil = responsif tapi gelisah</li>
      </ul>
      <p>Bobot observasi <Tex math={String.raw`k`} /> hari lalu = <Tex math={String.raw`(1-\lambda)\lambda^k`} /> — meluruh eksponensial. Dengan λ = 0,94, bobot data 1 bulan lalu tinggal ~16%; data 3 bulan lalu ~0,4%. <strong>Tidak ada &ldquo;efek tebing&rdquo;</strong> seperti rolling window (di mana observasi keluar jendela tiba-tiba).</p>

      <PlotlyChart
        data={ewmaData}
        title="EWMA λ=0,94 vs λ=0,97: responsivitas vs stabilitas"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Volatilitas (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua estimasi EWMA dari return yang sama; biru λ=0,94 (standar RiskMetrics), kuning putus-putus λ=0,97 (ingatan lebih panjang).</p>
        <p><strong>Interpretasi:</strong> saat guncangan datang (hari ~8 dan ~47), λ=0,94 <strong>melonjak lebih dulu dan lebih tinggi</strong> — responsif. λ=0,97 lebih lambat naik tapi juga lebih lambat turun (stabil). <strong>Tradeoff abadi:</strong> responsif = VaR cepat menyesuaikan tapi berisik (limit trading goyang tiap hari); stabil = tenang tapi telat saat krisis. Tidak ada λ yang &ldquo;benar&rdquo; — hanya yang cocok dengan horizon keputusanmu.</p>
      </div>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: update EWMA harian</summary>
        <p>λ = 0,94. Estimasi kemarin σ²<sub>t−1</sub> = 4,0 (vol 2%). Return hari ini r = −3%.</p>
        <p><strong>Langkah 1</strong> — kabar terbaru: r² = 9.<br />
        <strong>Langkah 2</strong> — update: σ²<sub>t</sub> = 0,94×4,0 + 0,06×9 = 3,76 + 0,54 = <strong>4,30</strong>.<br />
        <strong>Langkah 3</strong> — vol baru = √4,30 ≈ <strong>2,07%</strong> (naik dari 2,00%).<br />
        Satu hari buruk mengangkat estimasi 3,5% — besok, jika pasar tenang, ia meluruh kembali 6% menuju level lama. Inilah &ldquo;ingatan yang bisa lupa&rdquo;.</p>
      </details>

      <h2 id="garch">GARCH — Model Volatilitas Standar Industri</h2>
      <p><strong>Definisi.</strong> GARCH(1,1) (<em>generalized autoregressive conditional heteroskedasticity</em> — heteroskedastisitas bersyarat autoregresif yang digeneralisasi):</p>
      <Tex math={String.raw`\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\omega`} /> (omega): konstanta — &ldquo;lantai&rdquo; variansi; menentukan level jangka panjang</li>
        <li><Tex math={String.raw`\alpha`} /> (alpha): reaksi terhadap <strong>shock kemarin</strong> (<Tex math={String.raw`r_{t-1}^2`} />) — &ldquo;keterkejutan&rdquo;. α besar = volatilitas melompat saat ada kabar besar</li>
        <li><Tex math={String.raw`\beta`} /> (beta): <strong>persistence</strong> — seberapa lama guncangan diingat. β besar = badai berlangsung lama</li>
        <li>EWMA adalah kasus khusus GARCH(1,1) dengan <Tex math={String.raw`\omega = 0, \alpha = 1-\lambda, \beta = \lambda`} />!</li>
      </ul>
      <p>Tiga turunan penting:</p>
      <ul>
        <li><strong>Unconditional variance</strong> (level jangka panjang): <Tex math={String.raw`\bar{\sigma}^2 = \frac{\omega}{1-\alpha-\beta}`} /> — tempat forecast meluruh. Syarat: <Tex math={String.raw`\alpha+\beta < 1`} /> (jika tidak, variansi meledak tak hingga).</li>
        <li><strong>Half-life guncangan:</strong> <Tex math={String.raw`h_{1/2} = \frac{\ln(0{,}5)}{\ln(\alpha+\beta)}`} /> — berapa hari hingga separuh efek shock hilang. α+β = 0,97 → ~23 hari.</li>
        <li><strong>Forecast:</strong> <Tex math={String.raw`E[\sigma_{t+h}^2] = \bar{\sigma}^2 + (\alpha+\beta)^{h-1}(\sigma_{t+1}^2 - \bar{\sigma}^2)`} /> — meluruh eksponensial ke level jangka panjang (mean-reversion!).</li>
      </ul>

      <PlotlyChart
        data={garchForecastData}
        title="Forecast Variansi GARCH: mean-reversion"
        layout={{ xaxis: { title: "Horizon (hari)" }, yaxis: { title: "Variansi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = forecast variansi dari kondisi stres saat ini; garis putus-putus = level jangka panjang.</p>
        <p><strong>Interpretasi:</strong> variansi saat ini (2,5) <strong>meluruh</strong> menuju level jangka panjang (1,5) — inilah mean-reversion volatilitas yang terkuantifikasi. Kecepatan peluruhan ditentukan α+β (persistence). <strong>Implikasi:</strong> VaR 1-hari dihitung dari 2,5 (kondisi kini!), bukan dari 1,5 (rata-rata) — memakai rata-rata saat badai = VaR kekecilan, persis cerita pembuka.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;GARCH memprediksi return.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> GARCH memprediksi <strong>variansi bersyarat</strong> (seberapa lebar goyangan besok), <strong>bukan arah</strong> return. Ia menjawab &ldquo;besok pasar akan bergejolak&rdquo;, bukan &ldquo;besok naik/turun&rdquo;. Return sendiri tetap (hampir) tak terprediksi — dan justru itulah asumsi yang membuat GARCH bekerja: mean ≈ 0, yang dimodelkan hanya lebarnya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> baca parameter GARCH seperti membaca kepribadian pasar: <strong>α tinggi</strong> = pasar &ldquo;kagetan&rdquo; (reaktif ke kabar); <strong>β tinggi</strong> = pasar &ldquo;pendendam&rdquo; (guncangan diingat lama); <strong>α+β ≈ 1</strong> = pasar &ldquo;trauma permanen&rdquo; (hampir IGARCH — guncangan nyaris tak hilang, umum di krisis). Estimasi tipikal saham: α ≈ 0,05–0,15, β ≈ 0,80–0,90.</p>
      </div>

      <h2 id="var">Dari Volatilitas ke VaR &amp; Expected Shortfall</h2>
      <p><strong>Definisi.</strong> Dengan forecast volatilitas <Tex math={String.raw`\sigma_{t+1}`} />:</p>
      <ul>
        <li><strong>VaR</strong> (<em>value at risk</em>): kerugian maksimum yang tidak terlampaui dengan probabilitas <Tex math={String.raw`1-\alpha`} />:
          <Tex math={String.raw`VaR_{\alpha} = z_{\alpha} \cdot \sigma_{t+1} \cdot \text{posisi}`} block />
          VaR 99% 1-hari = <Tex math={String.raw`2{,}33 \times \sigma \times \text{posisi}`} /> (asumsi normal). Artinya: &ldquo;99% yakin rugi besok ≤ RpX&rdquo; — atau dibalik: 1% peluang rugi &gt; RpX.</li>
        <li><strong>Expected Shortfall (ES)</strong>: <em>rata-rata</em> kerugian <strong>jika</strong> VaR terlampaui:
          <Tex math={String.raw`ES_{\alpha} = E[L \mid L > VaR_{\alpha}]`} block />
          ES menjawab &ldquo;seberapa buruk <em>saat</em> buruk?&rdquo; — VaR tidak tahu (VaR hanya tahu ambangnya).</li>
      </ul>
      <p><strong>Koreksi ekor tebal:</strong> return keuangan berekor tebal (A3.2) — kuantil normal 2,33 <em>meremehkan</em> risiko. Praktik: pakai kuantil <strong>t-student</strong> atau kuantil <strong>empiris</strong> dari residual terstandar GARCH (<em>filtered historical simulation</em>). Basel kini mewajibkan ES (bukan VaR) untuk market risk — karena VaR buta terhadap &ldquo;seberapa dalam jurangnya&rdquo;.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR 99% = Rp1 M artinya rugi maksimal Rp1 M.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR <strong>bukan</strong> kerugian maksimum — ia ambang yang dilampaui 1% waktu. &ldquo;Rugi maksimal&rdquo; tidak ada (ekor tak terbatas). Dan 1% dari 250 hari trading = 2–3 breach per tahun adalah <em>normal</em>, bukan kegagalan model. Yang jadi masalah adalah breach yang <strong>bergerombol</strong> (12 dalam sebulan) — tanda volatilitas tidak tertangkap, seperti cerita pembuka.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Volatilitas = &ldquo;seberapa liar harga bergerak&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Realized vol — dari return harian</summary>
              <p>Return harian 5 hari: +1%, −2%, +1,5%, −0,5%, +2%. Hitung vol tahunan (annualized).</p>
              <p><strong>Langkah 1</strong> — SD harian = std([0,01; −0,02; 0,015; −0,005; 0,02]) ≈ 0,0157 (1,57%).<br />
              <strong>Langkah 2</strong> — annualize: × √252 ≈ 0,0157 × 15,87 ≈ <strong>24,9%</strong>.<br />
              <strong>Langkah 3</strong> — baca: &ldquo;vol 25%&rdquo; = harga bergerak ±25%/tahun (1 SD). Untuk opsi: input Black-Scholes!</p>
              <p>Pelajaran: √T = &ldquo;aturan akar waktu&rdquo; (B15!) — vol skala dengan akar waktu, <em>bukan</em> linear. Salah skala = salah harga opsi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Vol clustering — tenang lalu badai</summary>
              <p>Return: 60 hari tenang (±0,5%), lalu 5 hari ±5%. GARCH(1,1) vs SD biasa — apa bedanya?</p>
              <p><strong>Langkah 1</strong> — SD biasa: satu angka (~1,5%) — <em>buta</em> terhadap &ldquo;kapan&rdquo; badai.<br />
              <strong>Langkah 2</strong> — GARCH: vol <em>hari ini</em> = f(vol kemarin, shock kemarin) → vol rendah di masa tenang, <em>melonjak</em> setelah shock.<br />
              <strong>Langkah 3</strong> — untuk risk: VaR besok harus pakai vol <em>kondisional</em> (GARCH), bukan rata-rata historis — setelah shock, risiko besok jauh lebih tinggi!</p>
              <p>Pelajaran: &ldquo;volatilitas tinggi mengikuti volatilitas tinggi&rdquo; (clustering) = fakta paling robust di keuangan. Model statis meremehkan risiko tepat setelah guncangan — saat paling penting.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: EWMA vs Rolling SD — Responsivitas</h2>
      <p>Lewati data return dengan regime krisis. Bandingkan siapa yang lebih dulu &ldquo;sadar&rdquo; badai datang dan pergi.</p>
      <PyodideLab
        title="Lab 1 — EWMA Responsif, Rolling SD Tuli"
        hint="Coba: λ 0.94 → 0.99 (lambat, mirip SD) → 0.80 (responsif tapi gelisah). Pilih sesuai horizon."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: GARCH(1,1) dari Nol</h2>
      <p>Bangkitkan data GARCH, estimasi parameter via grid likelihood, lalu forecast dengan mean-reversion.</p>
      <PyodideLab
        title="Lab 2 — Estimasi & Forecast GARCH(1,1)"
        hint="Coba: beta 0.80 → 0.95. Persistence ≈ 1: guncangan 'diingat' sangat lama."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Estimator Volatilitas Mana?</h2>

      <div className="decision-card">
        <h3>1. Butuh cepat, standar industri, tanpa estimasi → <strong>EWMA λ=0,94</strong></h3>
        <p><strong>Kondisi:</strong> VaR harian operasional; tidak ada waktu/resources estimasi.</p>
        <p><strong>Kenapa:</strong> tanpa parameter yang diestimasi (λ fixed), responsif, standar RiskMetrics yang dikenal regulator.</p>
        <p><strong>Contoh nyata:</strong> VaR harian desk trading.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh forecast multi-hari + level jangka panjang → <strong>GARCH(1,1)</strong></h3>
        <p><strong>Kondisi:</strong> horizon &gt; 1 hari; butuh mean-reversion ke level normal.</p>
        <p><strong>Kenapa:</strong> punya unconditional variance &amp; half-life — EWMA tidak (ω=0 → forecast meluruh ke nol, tidak realistis untuk horizon jauh!).</p>
        <p><strong>Contoh nyata:</strong> proyeksi VaR 10-hari (Basel), stress testing.</p>
      </div>

      <div className="decision-card">
        <h3>3. Asimetri kuat (kabar buruk &gt; kabar baik) → <strong>GJR-GARCH / EGARCH</strong></h3>
        <p><strong>Kondisi:</strong> leverage effect signifikan (umum di ekuitas).</p>
        <p><strong>Kenapa:</strong> GARCH standar simetris — meremehkan volatilitas setelah crash.</p>
        <p><strong>Contoh nyata:</strong> VaR portofolio saham saat market stress.</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh ES yang jujur di ekor tebal → <strong>GARCH + kuantil t/empiris</strong></h3>
        <p><strong>Kondisi:</strong> perhitungan modal (Basel FRTB memakai ES 97,5%).</p>
        <p><strong>Kenapa:</strong> kuantil normal meremehkan ekor. Filtered historical simulation: GARCH untuk dinamika + empiris untuk bentuk ekor.</p>
        <p><strong>Contoh nyata:</strong> modal market risk bank.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Volatilitas = sifat waktu</strong>, bukan sifat aset. Satu angka statis = bohong.</li>
          <li>Operasional harian → EWMA. Horizon jauh → GARCH (butuh mean-reversion).</li>
          <li>VaR = ambang (bukan maksimum!). ES = &ldquo;seberapa buruk saat buruk&rdquo;.</li>
          <li>Ekor tebal → tinggalkan kuantil normal. Backtest breach-mu: bergerombol = model tuli.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Limit Trading Berbasis GARCH</h2>
      <div className="callout">
        <p>Desk forex bank punya limit VaR 99% 1-hari = Rp5 M. Model saat ini: volatilitas = SD 1 tahun (bobot sama) = 0,8%/hari. Posisi: Rp270 M.</p>
        <p>Perhitungan: VaR = 2,33 × 0,8% × 270M = Rp5,03 M — <em>pas</em> di limit. Trader protes: &ldquo;pasar lagi tenang-tenangnya, limit kekecilan, kita kehilangan peluang!&rdquo; Seminggu kemudian pasar bergejolak; return −2,5%, −3,1%, +2,8% dalam 3 hari. Model GARCH (yang kamu usulkan) mengestimasi vol saat ini = 1,9%/hari.</p>
        <p><strong>Pertanyaan:</strong> (a) Berapa VaR menurut GARCH saat ini? (b) Apa keputusan limit yang tepat di kedua kondisi (tenang &amp; bergejolak)? (c) Pelajaran tentang limit statis?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) VaR_GARCH = 2,33 × 1,9% × 270M = <strong>Rp11,95 M</strong> — sudah <strong>2,4× lipat limit</strong>! Model SD-tahunan masih bilang &ldquo;aman&rdquo; (Rp5,03 M) karena tuli terhadap 3 hari terakhir.</p>
          <p>(b) <strong>Saat tenang:</strong> trader ada benarnya — vol rendah = risiko rendah = limit bisa <em>lebih longgar</em> (atau posisi diperbesar dalam limit). <strong>Saat bergejolak:</strong> posisi harus <em>dipotong</em> hingga VaR kembali ke Rp5 M: posisi maks = 5M/(2,33×1,9%) ≈ Rp113 M. <strong>Limit dinamis</strong> berbasis volatilitas saat ini — bukan limit statis.</p>
          <p>(c) Limit statis + volatilitas statis = <strong>procyclical</strong>: longgar saat seharusnya ketat (badai) dan ketat saat seharusnya longgar (tenang). Inilah mekanisme yang memperparah krisis 2008. GARCH membuat limit <em>countercyclical</em>: mengencang otomatis saat badai.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Vol harian 2%. Berapa vol 10-harian? (Asumsi iid.)</li>
              <li>Implied vol 30% vs realized 20%. Apa artinya? Strategi apa yang &ldquo;menjual&rdquo; selisih ini?</li>
              <li>Mengapa vol <em>tidak</em> bisa negatif, dan mengapa itu penting untuk modeling?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> 2% × √10 ≈ <strong>6,32%</strong>. (Bukan 20%! Aturan akar waktu.)</p>
              <p><strong>2.</strong> Pasar <em>mengharapkan</em> gejolak lebih besar dari yang terjadi → opsi <em>mahal</em>. Strategi: <strong>jual opsi</strong> (short vol) — untung jika realized tetap &lt; implied. Risiko: jika badai datang, rugi besar (ekor! B16).</p>
              <p><strong>3.</strong> Vol = SD ≥ 0 <em>by definition</em>. Penting: model vol (GARCH) harus menjamin non-negatif (parameter &gt; 0!) — jika tidak, forecast bisa absurd. Untuk log-vol: model AR biasa bisa dipakai (log mengubah (0,∞) → (−∞,∞)).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. VaR 99% jebol 12 kali dalam sebulan (dari ekspektasi ~2x). Diagnosis?"
        options={[
          "Normal — 1% dari 250 hari",
          "Breach bergerombol = volatilitas tidak tertangkap (estimator lambat/tuli); ganti ke EWMA/GARCH yang responsif",
          "Naikkan confidence ke 99,9%",
          "Kurangi posisi secara acak",
        ]}
        correct={1}
        explanation="Benar: 12 breach sebulan bukan 'sial' — itu pola. Estimator bobot-sama lambat merespons regime shift. EWMA/GARCH menaikkan VaR otomatis saat volatilitas naik, memutus rantai breach."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam GARCH(1,1), α+β = 0,98. Artinya?"
        options={[
          "Model salah",
          "Persistence sangat tinggi — guncangan diingat lama (half-life ~34 hari); forecast meluruh lambat ke level jangka panjang",
          "Volatilitas konstan",
          "α tidak penting",
        ]}
        correct={1}
        explanation="Benar: half-life = ln(0,5)/ln(0,98) ≈ 34 hari. Pasar 'pendendam'. Waspada: α+β mendekati 1 = hampir IGARCH — shock nyaris permanen, umum saat/pasca krisis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kenapa EWMA (ω=0) TIDAK cocok untuk forecast volatilitas 30 hari?"
        options={[
          "Terlalu lambat",
          "Tanpa ω, forecast meluruh ke NOL — tidak realistis. GARCH punya unconditional variance sebagai jangkar jangka panjang",
          "EWMA hanya untuk return",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: EWMA = GARCH dengan ω=0 → tidak ada mean-reversion ke level wajar. Untuk horizon jauh, forecast EWMA ambruk ke nol. GARCH berjangkar di ω/(1−α−β)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. VaR 99% = Rp1 M. Pernyataan TEPAT?"
        options={[
          "Rugi maksimal Rp1 M",
          "Ada 1% peluang rugi melebihi Rp1 M; VaR tidak mengatakan seberapa besar kelebihannya — itu tugas Expected Shortfall",
          "Rugi pasti Rp1 M",
          "Model 99% akurat",
        ]}
        correct={1}
        explanation="Benar: VaR = kuantil, bukan maksimum. 'Seberapa buruk saat jebol' = ES. Inilah alasan Basel beralih ke ES untuk market risk."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. λ EWMA dinaikkan 0,94 → 0,98. Efek?"
        options={[
          "Lebih responsif terhadap guncangan",
          "Lebih lambat/stabil — ingatan lebih panjang, VaR kurang berisik tapi telat saat krisis",
          "Tidak ada efek",
          "Volatilitas jadi nol",
        ]}
        correct={1}
        explanation="Benar: λ lebih besar = bobot masa lalu lebih awet = adaptasi lebih lambat. Tradeoff responsivitas vs stabilitas — pilih sesuai horizon keputusan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Return berekor tebal, VaR dihitung dengan kuantil normal 2,33. Risiko?"
        options={[
          "Tidak ada — normal selalu cukup",
          "Meremehkan risiko ekor: breach akan lebih sering dari 1%. Pakai kuantil t-student atau empiris (filtered historical simulation)",
          "Melebihkan risiko",
          "VaR jadi negatif",
        ]}
        correct={1}
        explanation="Benar: ekor tebal = kejadian ekstrem lebih sering dari prediksi normal. Kuantil normal 2,33 terlalu 'pendek'. Praktik industri: GARCH untuk dinamika + distribusi empiris/t untuk bentuk ekor."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>3 fakta:</strong> clustering (badai bergerombol), mean-reversion (kembali ke normal), asimetri (kabar buruk lebih berisik).</li>
          <li><strong>EWMA:</strong> <Tex math={String.raw`\sigma_t^2=\lambda\sigma_{t-1}^2+(1-\lambda)r_{t-1}^2`} /> — responsif, tanpa estimasi; λ = tradeoff ingatan.</li>
          <li><strong>GARCH(1,1):</strong> <Tex math={String.raw`\sigma_t^2=\omega+\alpha r_{t-1}^2+\beta\sigma_{t-1}^2`} /> — α = keterkejutan, β = persistence; jangkar <Tex math={String.raw`\omega/(1-\alpha-\beta)`} />; forecast mean-reverting.</li>
          <li><strong>VaR</strong> = ambang kuantil (bukan maksimum!); <strong>ES</strong> = rata-rata saat jebol. Ekor tebal → tinggalkan normal.</li>
          <li><strong>Jangan</strong> pakai volatilitas statis untuk limit; jangan baca VaR tanpa backtest breach.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a39-time-series" className="btn btn-secondary btn-sm">← A3.9</Link>
        <Link href="/learn/a311-pca-clustering" className="btn btn-primary btn-sm">Next: A3.11 →</Link>
      </div>
    </div>
  );
}
