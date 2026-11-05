"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function MR15Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // GBM paths vs Vasicek paths
  const r = rng(15);
  const N = 252;
  const days = Array.from({ length: N + 1 }, (_, i) => i);
  const gbmPaths: number[][] = [];
  for (let p = 0; p < 5; p++) {
    let S = 100;
    const path = [S];
    for (let i = 0; i < N; i++) {
      const u = (r() + r() + r() - 1.5) * 1.633;
      S = S * Math.exp((0.08 - 0.5 * 0.04) / 252 + 0.2 * Math.sqrt(1 / 252) * u);
      path.push(+S.toFixed(1));
    }
    gbmPaths.push(path);
  }
  const gbmData = gbmPaths.map((p, i) => ({
    x: days, y: p, type: "scatter", mode: "lines",
    name: i === 0 ? "GBM (5 skenario)" : undefined,
    line: { color: "#2a7de1", width: 1.5 }, opacity: 0.7, showlegend: i === 0,
  }));

  // Vasicek vs CIR: suku bunga mean-reverting
  const vasPaths: number[][] = [];
  const cirPaths: number[][] = [];
  for (let p = 0; p < 3; p++) {
    let rv = 0.05, rc = 0.05;
    const pv = [rv], pc = [rc];
    const kappa = 0.5, theta = 0.05, sig = 0.02, dt = 1 / 252;
    for (let i = 0; i < N; i++) {
      const u = (r() + r() + r() - 1.5) * 1.633;
      rv = rv + kappa * (theta - rv) * dt + sig * Math.sqrt(dt) * u;
      rc = Math.max(rc + kappa * (theta - rc) * dt + sig * Math.sqrt(Math.max(rc, 0)) * Math.sqrt(dt) * u, 0);
      pv.push(+rv.toFixed(4));
      pc.push(+rc.toFixed(4));
    }
    vasPaths.push(pv);
    cirPaths.push(pc);
  }
  const rateData = [
    ...vasPaths.map((p, i) => ({
      x: days, y: p, type: "scatter", mode: "lines",
      name: i === 0 ? "Vasicek (bisa negatif)" : undefined,
      line: { color: "#e8a838", width: 1.5 }, opacity: 0.8, showlegend: i === 0,
    })),
    ...cirPaths.map((p, i) => ({
      x: days, y: p, type: "scatter", mode: "lines",
      name: i === 0 ? "CIR (non-negatif)" : undefined,
      line: { color: "#22c55e", width: 1.5 }, opacity: 0.8, showlegend: i === 0,
    })),
  ];

  // GARCH: volatility clustering simulation
  const garchVol: number[] = [];
  {
    const omega = 0.000002, alpha = 0.08, beta = 0.90;
    let v = 0.0001;
    for (let i = 0; i < N; i++) {
      const u = (r() + r() + r() - 1.5) * 1.633;
      const ret = Math.sqrt(v) * u;
      v = omega + alpha * ret * ret + beta * v;
      garchVol.push(+Math.sqrt(v * 252).toFixed(3));
    }
  }
  const garchData = [
    { x: days.slice(1), y: garchVol, type: "scatter", mode: "lines", name: "Vol tahunan GARCH(1,1)", line: { color: "#ef4444", width: 2 } },
  ];

  const lab1Code = String.raw`# GBM vs MEAN-REVERSION: simulasikan & bandingkan distribusi terminal.
# GBM: dS = mu*S*dt + sigma*S*dW  (harga saham: tidak mean-reverting)
# Vasicek: dr = kappa*(theta - r)*dt + sigma*dW  (suku bunga: mean-reverting)

import random, math
random.seed(15)

def sim_gbm(S0, mu, sig, T, steps):
    dt = T / steps
    S = S0
    for _ in range(steps):
        S *= math.exp((mu - 0.5*sig*sig)*dt + sig*math.sqrt(dt)*random.gauss(0,1))
    return S

def sim_vasicek(r0, kappa, theta, sig, T, steps):
    dt = T / steps
    r = r0
    for _ in range(steps):
        r += kappa*(theta - r)*dt + sig*math.sqrt(dt)*random.gauss(0,1)
    return r

gbm_T = [sim_gbm(100, 0.08, 0.30, 5, 250) for _ in range(3000)]
vas_T = [sim_vasicek(0.05, 0.5, 0.05, 0.02, 5, 250) for _ in range(3000)]

def stats(xs):
    m = sum(xs)/len(xs)
    v = sum((x-m)**2 for x in xs)/len(xs)
    s = sorted(xs)
    return m, math.sqrt(v), s[int(0.05*len(s))], s[int(0.95*len(s))]

mg, sg, p5g, p95g = stats(gbm_T)
mv, sv, p5v, p95v = stats(vas_T)
print(f"GBM saham 5 thn : mean={mg:.0f} sd={sg:.0f} P5={p5g:.0f} P95={p95g:.0f}")
print(f"Vasicek rate 5 thn: mean={mv:.2%} sd={sv:.2%} P5={p5v:.2%} P95={p95v:.2%}")
print()
print("GBM: sebaran terminal MELEBAR dgn T (sd ~ sqrt(T)) -- tidak kembali.")
print("Vasicek: sebaran terminal TERBATAS (mean-reversion) -- 'karet gelang'.")
print()
print("Coba: kappa 0.5 -> 0.1 (lemah). Apa yg terjadi pd sebaran Vasicek?")`;

  const lab2Code = String.raw`# GARCH(1,1): sigma2_t = omega + alpha*r2_{t-1} + beta*sigma2_{t-1}
# Estimasi sederhana via grid search + simulasi clustering.

import random, math
random.seed(99)

# Bangkitkan data dgn parameter SEJATI, lalu coba tebak kembali via grid search
true = (0.000002, 0.10, 0.85)  # omega, alpha, beta
omega0, alpha0, beta0 = true
rets, v = [], 0.0001
for _ in range(1500):
    u = random.gauss(0, 1)
    rt = math.sqrt(v) * u
    rets.append(rt)
    v = omega0 + alpha0 * rt * rt + beta0 * v

def loglik(rets, omega, alpha, beta):
    if alpha + beta >= 1 or omega <= 0 or alpha < 0 or beta < 0:
        return float('-inf')
    ll, v = 0.0, sum(x*x for x in rets[:50]) / 50
    for rt in rets:
        v = omega + alpha * rt * rt + beta * v
        if v <= 0: return float('-inf')
        ll += -0.5 * (math.log(2*math.pi*v) + rt*rt/v)
    return ll

best = None
for a in [0.05, 0.10, 0.15]:
    for b in [0.80, 0.85, 0.90]:
        ll = loglik(rets, 0.000002, a, b)
        if best is None or ll > best[0]:
            best = (ll, a, b)
print(f"Sejati: alpha={alpha0}, beta={beta0}")
print(f"Tebakan grid: alpha={best[1]}, beta={best[2]} (loglik={best[0]:.0f})")
print()
# Vol jangka panjang (unconditional)
a_hat, b_hat = best[1], best[2]
ulv = math.sqrt(0.000002 / (1 - a_hat - b_hat) * 252)
print(f"Vol unconditional ~ {ulv:.1%} tahunan")
print("alpha+beta ~ 0.95: 'ingatan' volatilitas SANGAT panjang (persistence).")
print("Inilah volatility clustering: guncangan hari ini bergema berminggu-minggu.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR15 — Market Risk Analytics</span>
        <h1 className="display-title">Model Stokastik:<br />Mesin Penghasil Masa Depan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Terlalu Sempurna</a></li>
          <li><a href="#gbm">GBM: Model Standar Harga Saham</a></li>
          <li><a href="#rates">Vasicek, CIR, Hull-White: Model Suku Bunga</a></li>
          <li><a href="#garch">GARCH: Volatilitas yang Hidup</a></li>
          <li><a href="#lab1">🔬 Lab 1: GBM vs Mean-Reversion</a></li>
          <li><a href="#lab2">🔬 Lab 2: Estimasi GARCH(1,1)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Lemma Itô — Mengapa Ada Suku −σ²/2</a></li>
          <li><a href="#case">📋 Mini-Case: Model Suku Bunga yang Salah</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan GBM sebagai model harga saham dan menafsirkan tiap parameter (μ drift, σ volatilitas).</li>
          <li>Membedakan model suku bunga Vasicek, CIR, dan Hull-White — termasuk kapan tiap model tepat.</li>
          <li>Menjelaskan mean-reversion dan mengapa suku bunga butuh sifat ini sementara harga saham tidak.</li>
          <li>Menghitung dan menafsirkan GARCH(1,1): ω, α, β — serta volatilitas unconditional.</li>
          <li>Memilih model stokastik yang tepat untuk aplikasi (Monte Carlo VaR, pricing, skenario) dan menyadari keterbatasannya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model yang Terlalu Sempurna</h2>
      <div className="story">
        <p>Sebuah bank memakai model suku bunga <strong>Vasicek</strong> untuk mensimulasikan skenario 10 tahun ke depan. Model itu elegan: punya rumus tertutup untuk harga obligasi, mudah dikalibrasi. Hasil simulasi: suku bunga jangka panjang stabil di sekitar 5%, skenario terburuk −1%.</p>
        <p>Masalahnya: model itu <strong>dikalibrasi di era suku bunga positif</strong> — dan Vasicek <strong>mengizinkan suku bunga negatif</strong> tanpa batas. Di simulasi, 15% skenario menghasilkan suku bunga <strong>−3% atau lebih rendah</strong> — mustahil secara ekonomi di negara itu (ada batas bawah efektif). Seluruh perhitungan modal berbasis skenario itu <strong>cacat dari fondasinya</strong>.</p>
        <p>Twist-nya: bukan modelnya yang &ldquo;salah&rdquo; — Vasicek benar-benar dipakai luas. Yang salah adalah <strong>pemilihan model tanpa memahami propertinya</strong>: untuk rezim itu, <strong>CIR</strong> (yang menjamin non-negatif) adalah pilihan tepat. Lesson ini tentang memilih mesin penghasil masa depan yang <strong>benar</strong> — karena Monte Carlo (MR3), CVA (MR14), dan stress test (MR7) semuanya hanya sebagus model stokastiknya.</p>
      </div>

      <h2 id="gbm">GBM: Model Standar Harga Saham</h2>
      <p><strong>Definisi.</strong> <strong>Geometric Brownian Motion</strong> — model paling terkenal di keuangan (fondasi Black-Scholes):</p>
      <Tex math={String.raw`dS_t = \mu S_t\,dt + \sigma S_t\,dW_t`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`S_t`} />: harga saham waktu-t</li>
        <li><Tex math={String.raw`\mu`} />: <strong>drift</strong> — return ekspektasi tahunan</li>
        <li><Tex math={String.raw`\sigma`} />: <strong>volatilitas</strong> tahunan</li>
        <li><Tex math={String.raw`dW_t`} />: <strong>gerak Brown</strong> — guncangan acak (inkremen ~ N(0, dt))</li>
      </ul>
      <p><strong>Solusi eksak</strong> (untuk simulasi — sudah dipakai di MR3):</p>
      <Tex math={String.raw`S_{t+\Delta t} = S_t \exp\left[\left(\mu - \tfrac{1}{2}\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z\right], \quad Z \sim N(0,1)`} block />
      <p><strong>Sifat kunci:</strong> harga <strong>selalu positif</strong> (eksponensial), return <strong>log-normal</strong>, dan <strong>tidak mean-reverting</strong> — sebaran melebar dengan √T. Cocok untuk saham (harga bisa terbang ke mana saja), <strong>tidak cocok</strong> untuk suku bunga (yang &ldquo;ditarik&rdquo; bank sentral).</p>

      <PlotlyChart
        data={gbmData}
        title="5 Skenario GBM: Harga Saham 1 Tahun (S0=100, μ=8%, σ=20%)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Harga" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> lima garis = lima &ldquo;masa depan&rdquo; yang dibangkitkan dari model yang sama.</p>
        <p><strong>Interpretasi:</strong> skenario <strong>menyebar</strong> — makin jauh ke depan, makin lebar kisarannya (ketidakpastian tumbuh dengan √T). Ada yang naik ke 140, ada yang turun ke 80 — <strong>semua dari model yang sama</strong>. Inilah gunanya Monte Carlo: bukan meramal satu masa depan, melainkan <strong>memetakan sebaran</strong> masa depan yang mungkin.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> suku <Tex math={String.raw`-\tfrac{1}{2}\sigma^2`} /> dalam eksponen sering membingungkan — itu <strong>koreksi Jensen</strong>: return ekspektasi <em>aritmatika</em> (μ) vs return <em>median/geometrik</em> (μ − σ²/2). Volatilitas &ldquo;memakan&rdquo; pertumbuhan median — inilah <strong>volatility drag</strong>: dua aset dengan return rata-rata sama, yang lebih volatil tumbuh lebih lambat dalam jangka panjang.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;GBM bisa dipakai untuk semua harga.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> GBM mengasumsikan <strong>volatilitas konstan</strong> dan <strong>return normal</strong> — dua asumsi yang dilanggar data nyata (volatility smile MR11, clustering MR2). GBM adalah <strong>titik awal</strong>, bukan kebenaran. Untuk aplikasi serius: vol stokastik (Heston) atau setidaknya GARCH untuk volatilitasnya.</p>
      </div>

      <h2 id="rates">Vasicek, CIR, Hull-White: Model Suku Bunga</h2>
      <p><strong>Kenapa butuh model khusus:</strong> suku bunga <strong>mean-reverting</strong> (ditarik ke level &ldquo;normal&rdquo; oleh bank sentral &amp; ekonomi) dan <strong>tidak boleh negatif</strong> (di sebagian besar rezim). GBM gagal di keduanya.</p>
      <p><strong>1. Vasicek (1977):</strong></p>
      <Tex math={String.raw`dr_t = \kappa(\theta - r_t)\,dt + \sigma\,dW_t`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\kappa`} /> = kecepatan mean-reversion (&ldquo;kekuatan karet gelang&rdquo;); <Tex math={String.raw`\theta`} /> = level jangka panjang; <Tex math={String.raw`\sigma`} /> = volatilitas. <strong>Kelebihan:</strong> rumus tertutup untuk harga obligasi (analitis!). <strong>Kelemahan:</strong> <strong>bisa negatif</strong> tanpa batas — masalah di cerita pembuka.</p>
      <p><strong>2. CIR (Cox-Ingersoll-Ross, 1985):</strong></p>
      <Tex math={String.raw`dr_t = \kappa(\theta - r_t)\,dt + \sigma\sqrt{r_t}\,dW_t`} block />
      <p><strong>Bedanya:</strong> volatilitas ∝ <Tex math={String.raw`\sqrt{r_t}`} /> — saat rate mendekati nol, guncangan mengecil → <strong>tidak bisa negatif</strong> (dengan syarat tertentu). <strong>Harga:</strong> tidak ada rumus se-sederhana Vasicek, tapi tetap tractable.</p>
      <p><strong>3. Hull-White (1990):</strong> Vasicek dengan <Tex math={String.raw`\theta`} /> <strong>bergantung waktu</strong> <Tex math={String.raw`\theta(t)`} /> — dikalibrasi agar <strong>pas persis</strong> dengan kurva yield kini. <strong>Kegunaan:</strong> pricing derivatif suku bunga yang konsisten dengan pasar hari ini (standar industri untuk swaption, callable bond).</p>

      <PlotlyChart
        data={rateData}
        title="Vasicek vs CIR: Simulasi Suku Bunga 1 Tahun (r0=5%)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Suku bunga", tickformat: ".1%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kuning = Vasicek, hijau = CIR. Keduanya mean-reverting ke 5%.</p>
        <p><strong>Interpretasi:</strong> keduanya &ldquo;ditarik&rdquo; ke 5% (bandingkan dengan GBM yang menyebar bebas!). Perhatikan: saat rate rendah, jalur <strong>CIR (hijau) lebih &ldquo;jinak&rdquo;</strong> — guncangannya mengecil mendekati nol. Vasicek (kuning) berayun sama lebar di semua level — dan dalam simulasi panjang, <strong>bisa menembus nol</strong>. Pilih CIR/Hull-White jika negativitas tidak diizinkan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> mean-reversion = <strong>karet gelang</strong>. κ besar = karet kuat (cepat kembali, cocok untuk rate jangka pendek yang dikontrol bank sentral). κ kecil = karet longgar (cocok untuk rate jangka panjang yang &ldquo;melayang&rdquo;). Salah pilih κ = salah estimasi seberapa lama guncangan bertahan — fatal untuk skenario multi-tahun.</p>
      </div>

      <h2 id="garch">GARCH: Volatilitas yang Hidup</h2>
      <p><strong>Definisi.</strong> <strong>GARCH(1,1)</strong> memodelkan volatilitas sebagai proses yang <strong>mengikuti dirinya sendiri</strong>:</p>
      <Tex math={String.raw`\sigma_t^2 = \omega + \alpha r_{t-1}^2 + \beta \sigma_{t-1}^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\omega`} />: level dasar (konstanta kecil)</li>
        <li><Tex math={String.raw`\alpha`} />: reaksi ke <strong>guncangan kemarin</strong> (ARCH effect — &ldquo;kaget&rdquo;)</li>
        <li><Tex math={String.raw`\beta`} />: persistensi <strong>volatilitas kemarin</strong> (GARCH effect — &ldquo;ingatan&rdquo;)</li>
      </ul>
      <p><strong>Volatilitas jangka panjang (unconditional):</strong></p>
      <Tex math={String.raw`\sigma^2_{LR} = \frac{\omega}{1-\alpha-\beta} \quad \text{(syarat: } \alpha+\beta < 1\text{)}`} block />
      <p><strong>Hubungan dengan EWMA (MR2):</strong> EWMA adalah GARCH(1,1) dengan <strong>ω=0, α=1−λ, β=λ</strong> — tanpa level jangka panjang (α+β=1, &ldquo;integrated&rdquo;). GARCH lebih umum: punya <strong>mean-reversion volatilitas</strong> ke level jangka panjang.</p>
      <p><strong>Kenapa penting:</strong> α+β tipikal ≈ <strong>0,95–0,99</strong> — &ldquo;ingatan&rdquo; volatilitas sangat panjang. Guncangan hari ini masih terasa <strong>berminggu-minggu</strong>. Inilah <strong>volatility clustering</strong> dalam bentuk formal — dan alasan VaR harus adaptif (MR2/MR4).</p>

      <PlotlyChart
        data={garchData}
        title="Simulasi GARCH(1,1): Volatilitas Berkelompok"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Vol tahunan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = volatilitas tahunan hasil simulasi GARCH dari guncangan acak.</p>
        <p><strong>Interpretasi:</strong> volatilitas <strong>bergerombol</strong> — periode tenang (vol ~15%) diselingi periode liar (vol melonjak ke 40%+) — <strong>padahal guncangannya acak murni</strong>. Clustering <em>muncul</em> dari struktur GARCH, bukan dari inputnya. Inilah mengapa model vol konstan (seperti GBM murni) gagal menangkap realitas pasar.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;GARCH meramal volatilitas masa depan dengan akurat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> GARCH hebat menjelaskan <strong>dinamika</strong> volatilitas (clustering, mean-reversion) — tapi ramalan titiknya tetap <strong>tidak presisi</strong> (R² ramalan vol biasanya rendah). Gunanya: <strong>skenario &amp; VaR adaptif</strong> (Filtered HS memakai ini!), bukan &ldquo;vol besok = 23,4%&rdquo;. Jangan oversell presisinya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: GBM vs Mean-Reversion</h2>
      <p>Ubah κ (0,5 → 0,1 → 2,0). Bagaimana sebaran terminal Vasicek berubah? Kapan ia mirip GBM?</p>
      <PyodideLab
        title="Lab 1 — GBM (Menyebar) vs Vasicek (Karet Gelang)"
        hint="Coba kappa=0.01 (hampir nol): Vasicek menjadi mirip random walk tanpa mean-reversion — sebarannya melebar seperti GBM. Kappa adalah 'kekuatan karet'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Estimasi GARCH(1,1)</h2>
      <p>Ubah parameter sejati (misal α=0,20, β=0,70: kaget besar, ingatan pendek). Bisakah grid search menemukannya kembali?</p>
      <PyodideLab
        title="Lab 2 — Estimasi GARCH via Maximum Likelihood"
        hint="Coba data lebih pendek (500 observasi): estimasi makin noisy. Inilah mengapa GARCH butuh data PANJANG — parameternya sulit diestimasi dari sampel kecil."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Simulasi harga saham / ekuitas → <strong>GBM</strong> (atau dengan vol stokastik jika serius)</h3>
        <p><strong>Kondisi:</strong> Monte Carlo VaR ekuitas, skenario harga.</p>
        <p><strong>Alasan:</strong> positif, sederhana, standar. Untuk pricing opsi eksotis: tambah stochastic vol (Heston).</p>
      </div>

      <div className="decision-card">
        <h3>2. Simulasi suku bunga, rezim non-negatif → <strong>CIR</strong></h3>
        <p><strong>Kondisi:</strong> skenario ALM, IRRBB (MR10), proyeksi NII.</p>
        <p><strong>Alasan:</strong> mean-reverting + non-negatif. Jangan pakai Vasicek jika rate negatif mustahil di rezimmu.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pricing derivatif suku bunga konsisten pasar → <strong>Hull-White</strong></h3>
        <p><strong>Kondisi:</strong> swaption, callable bond, XVA.</p>
        <p><strong>Alasan:</strong> kalibrasi pas ke kurva kini (θ(t)) — harga konsisten dengan pasar hari ini. Standar industri.</p>
      </div>

      <div className="decision-card">
        <h3>4. Volatilitas dinamis / VaR adaptif → <strong>GARCH(1,1)</strong></h3>
        <p><strong>Kondisi:</strong> Filtered HS (MR4), peramalan vol jangka pendek-menengah.</p>
        <p><strong>Alasan:</strong> menangkap clustering + mean-reversion vol. Butuh data panjang untuk estimasi stabil.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Saham</strong> → GBM. <strong>Suku bunga</strong> → mean-reverting (CIR/HW). <strong>Volatilitas</strong> → GARCH.</li>
          <li>Selalu tanya: <strong>properti apa</strong> yang saya butuhkan (positif? mean-reverting? pas ke kurva?) — lalu pilih model yang <em>punya</em> properti itu.</li>
          <li>Model hanya sebagus <strong>kalibrasinya</strong> — dan kalibrasi hanya sebagus <strong>datanya</strong>.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Lemma Itô — Mengapa Ada Suku −σ²/2</h2>
      <p>Suku <Tex math={String.raw`-\tfrac{1}{2}\sigma^2`} /> di solusi GBM adalah sumber kebingungan abadi. Ia bukan &ldquo;koreksi asal&rdquo; — ia adalah konsekuensi <strong>lemma Itô</strong>, aturan rantai untuk dunia stokastik. Bagian ini membangun intuisinya tanpa kalkulus stokastik penuh, plus contoh simulasi 3-langkah dengan tangan.</p>

      <h3>Intuisi lemma Itô: keacakan punya &ldquo;turunan kedua&rdquo;</h3>
      <p>Dalam kalkulus biasa, aturan rantai: jika <Tex math={String.raw`Y = \ln S`} /> maka <Tex math={String.raw`dY = (1/S)\,dS`} />. Selesai. Dalam dunia stokastik, <Tex math={String.raw`dW_t`} /> punya sifat aneh: <Tex math={String.raw`(dW_t)^2 = dt`} /> — kuadrat guncangan acak <strong>bukan nol</strong> (seperti <Tex math={String.raw`(dt)^2`} />), melainkan orde-<Tex math={String.raw`dt`} /> sendiri! Akibatnya ekspansi Taylor harus menyertakan <strong>suku orde-2</strong>:</p>
      <Tex math={String.raw`d\ln S_t = \frac{1}{S_t}\,dS_t - \frac{1}{2}\frac{1}{S_t^2}\,(dS_t)^2`} block />
      <p>Substitusi <Tex math={String.raw`dS_t = \mu S_t\,dt + \sigma S_t\,dW_t`} /> dan <Tex math={String.raw`(dS_t)^2 = \sigma^2 S_t^2\,dt`} />:</p>
      <Tex math={String.raw`d\ln S_t = \left(\mu - \tfrac{1}{2}\sigma^2\right)dt + \sigma\,dW_t`} block />
      <p><strong>Di sinilah</strong> <Tex math={String.raw`-\tfrac{1}{2}\sigma^2`} /> lahir — dari suku kedua Taylor yang tidak bisa diabaikan karena keacakan. <strong>Intuisi fisiknya:</strong> fungsi logaritma <strong>cekung</strong> — guncangan simetris ±x pada <Tex math={String.raw`S`} /> menghasilkan perubahan log yang <em>asimetris</em>: <Tex math={String.raw`\ln(1+x) + \ln(1-x) < 0`} />. Keacakan murni &ldquo;menarik turun&rdquo; rata-rata geometrik — inilah <strong>volatility drag</strong> yang sama, kini terlihat asal-usulnya.</p>
      <p><strong>Konsekuensi praktis:</strong> ekspektasi harga <Tex math={String.raw`\mathbb{E}[S_T] = S_0 e^{\mu T}`} /> (tumbuh dengan μ), tetapi <strong>median</strong> <Tex math={String.raw`= S_0 e^{(\mu - \sigma^2/2)T}`} /> (tumbuh lebih lambat). Untuk σ = 30%, μ = 8%: ekspektasi tumbuh 8%/tahun, median hanya <strong>3,5%/tahun</strong>. Investor jangka panjang &ldquo;mengalami&rdquo; median, bukan ekspektasi — angka 8% adalah rata-rata yang didongkrak segelintir skenario jackpot.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: 3 langkah GBM dengan tangan (klik untuk buka)</summary>
        <p><strong>Parameter:</strong> <Tex math={String.raw`S_0 = 100`} />, <Tex math={String.raw`\mu = 10\%`} />/tahun, <Tex math={String.raw`\sigma = 20\%`} />/tahun, <Tex math={String.raw`\Delta t = 1/12`} /> (bulanan). Guncangan &ldquo;acak&rdquo; yang ditetapkan: <Tex math={String.raw`Z_1 = +0{,}8`} />, <Tex math={String.raw`Z_2 = -1{,}2`} />, <Tex math={String.raw`Z_3 = +0{,}3`} />.</p>
        <p><strong>Rumus per langkah:</strong> <Tex math={String.raw`S_{baru} = S_{lama} \times \exp\left[(0{,}10 - 0{,}5 \times 0{,}04)/12 + 0{,}20\sqrt{1/12}\,Z\right]`} /> = <Tex math={String.raw`S_{lama} \times \exp\left[0{,}00667 + 0{,}0577\,Z\right]`} />.</p>
        <p><strong>Bulan 1</strong> (Z=+0,8): faktor = exp(0,00667 + 0,0462) = exp(0,0529) = 1,0543 → <strong>S₁ = 105,43</strong>.</p>
        <p><strong>Bulan 2</strong> (Z=−1,2): faktor = exp(0,00667 − 0,0693) = exp(−0,0626) = 0,9393 → <strong>S₂ = 99,03</strong>.</p>
        <p><strong>Bulan 3</strong> (Z=+0,3): faktor = exp(0,00667 + 0,0173) = exp(0,0240) = 1,0243 → <strong>S₃ = 101,44</strong>.</p>
        <p><strong>Perhatikan:</strong> rata-rata Z ≈ −0,03 (≈ nol), tapi harga naik 1,44% dalam 3 bulan — <em>di atas</em> drift 2,5%/3bln? Tidak: 1,44% &lt; 2,5% (0,10×3/12). Selisihnya = volatility drag beraksi. <strong>Dan inilah tepatnya yang dilakukan kode Monte Carlo-mu</strong> — hanya dengan 10.000 Z acak, bukan 3 yang ditetapkan. Setiap path simulasi = perhitungan tangan seperti ini, diulang ribuan kali.</p>
      </details>

      <h3>Kapan GBM berbohong — dan model apa gantinya</h3>
      <p>Tiga pelanggaran asumsi GBM yang paling mahal:</p>
      <ul>
        <li><strong>Vol tidak konstan (→ Heston):</strong> volatilitas sendiri bergerak acak (MR2: clustering). Model <strong>Heston</strong> memberi SDE kedua untuk <Tex math={String.raw`\sigma_t`} /> — menghasilkan volatility smile <em>dari dalam model</em>, bukan ditempel. Harga: kalibrasi jauh lebih sulit (parameter tidak stabil).</li>
        <li><strong>Lompatan (→ Merton jump-diffusion):</strong> harga bisa <em>gap</em> (1987: −22,6% sehari; 2015 CHF: +30% dalam menit). Jump-diffusion menambah komponen Poisson — menjelaskan <strong>skew</strong> (proteksi crash mahal). Harga: butuh data jump yang jarang.</li>
        <li><strong>Mean-reversion (→ Vasicek/CIR):</strong> untuk suku bunga &amp; komoditas, harga &ldquo;ditarik&rdquo; ke level wajar — GBM yang menyebar dengan √T selamanya memberi harga minyak US$10.000 atau US$0,01 dalam 30 tahun, keduanya absurd.</li>
      </ul>
      <p><strong>Aturan memilih model (model risk — MR18):</strong> (1) mulai dari yang paling sederhana yang <em>tidak</em> dilanggar datanya; (2) setiap asumsi tambahan harus <strong>dibayar</strong> dengan bukti (misal: skew signifikan → Heston; jump terlihat → jump-diffusion); (3) <strong>kalibrasi ≠ validasi</strong> — model yang fit sempurna ke data kemarin bisa hancur esok hari jika strukturnya salah. Model adalah peta: peta sederhana yang jujur tentang batasnya lebih berguna daripada peta detail yang menyesatkan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model yang lebih kompleks = lebih akurat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kompleksitas menambah <strong>parameter</strong> — dan setiap parameter adalah sumber <strong>estimation error</strong> (MR2: shrinkage!). Model Heston dengan 5 parameter yang dikalibrasi dari data berisik bisa berkinerja <em>lebih buruk</em> di luar sampel daripada Black-Scholes 1-parameter. Prinsipnya: <strong>kompleksitas harus dibayar dengan data</strong>. Jika datamu tidak cukup untuk mengestimasi parameter tambahan dengan stabil, model sederhana yang &ldquo;salah&rdquo; tapi stabil mengalahkan model canggih yang &ldquo;benar&rdquo; tapi liar.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap kali memakai model stokastik, tulis <strong>tiga asumsi yang paling mungkin salah</strong> di samping hasilnya. Untuk GBM saham: (1) vol konstan — salah saat krisis; (2) tanpa jump — salah saat event; (3) drift konstan — salah saat rezim berubah. Daftar ini adalah <strong>cheat sheet stress test</strong>-mu (MR7): uji model tepat di asumsi-asumsi itu. Model yang diuji di titik lemahnya = model yang bisa dipercaya; model yang tidak pernah diuji = bom waktu berlabel &ldquo;canggih&rdquo;.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: mengapa skew butuh model vol stokastik (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Saham Rp100.000, opsi put 1-tahun: strike 100.000 (ATM) vs 70.000 (OTM, proteksi crash). Vol historis 25%.</p>
        <p><strong>Black-Scholes (vol konstan 25%):</strong> put ATM ≈ Rp9.800; put OTM 70 ≈ <strong>Rp1.900</strong>.</p>
        <p><strong>Harga pasar aktual (tipikal skew):</strong> put ATM ≈ Rp10.200 (implisit 26%); put OTM 70 ≈ <strong>Rp3.400</strong> (implisit 35%!).</p>
        <p><strong>Selisih:</strong> BS meremehkan put OTM sebesar <strong>44%</strong> (1.900 vs 3.400). Untuk desk yang <em>menjual</em> proteksi crash, BS berarti <strong>menjual 44% terlalu murah</strong> — kerugian sistematis yang hanya terlihat saat crash datang.</p>
        <p><strong>Model Heston</strong> (vol mean-reverting + korelasi negatif harga-vol) menghasilkan skew <em>dari dalam</em>: put OTM 70 ≈ Rp3.300 — error hanya 3%. <strong>Harga akurasi:</strong> 5 parameter vs 1 — kalibrasi harian, validasi ketat (MR18). Keputusan: untuk <strong>market-making opsi</strong> Heston sepadan; untuk <strong>VaR cepat</strong>, BS + skew adjustment cukup. <strong>Model mengikuti tujuan — selalu.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — kalibrasi vs overfitting:</strong> model Heston punya 5 parameter (kecepatan mean-reversion κ, vol-dari-vol σᵥ, korelasi ρ, vol jangka panjang θ, vol awal v₀). Dengan 5 parameter, kamu bisa fit <em>sempurna</em> ke 5 titik implied vol hari ini — dan <strong>salah total</strong> besok, karena parameternya tidak stabil (κ dan σᵥ berkorelasi kuat dalam kalibrasi: banyak kombinasi memberi fit sama baiknya = <em>parameter tidak teridentifikasi</em>). Praktik desk: <strong>kunci</strong> 2–3 parameter ke nilai historis yang stabil, kalibrasi hanya sisanya. Model dengan 5 parameter bebas = <strong>mesin overfitting</strong>, bukan mesin prediksi. Aturan: <em>jumlah parameter yang dikalibrasi ≤ jumlah observasi independen / 10</em>.</p>
      </div>
      <p><strong>Checklist memilih model stokastik</strong> (tempel di dinding): (1) Apakah harga <em>bisa</em> negatif? Ya → bukan GBM. (2) Apakah ada <em>pull</em> ke level wajar? Ya → mean-reverting. (3) Apakah vol <em>berubah-ubah</em>? Ya → stokastik vol / GARCH. (4) Apakah ada <em>lompatan</em>? Ya → jump-diffusion. (5) Apakah data <em>cukup</em> untuk parameter tambahannya? Tidak → tetap di model sederhana. Lima pertanyaan, nol mistifikasi.</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — GBM: S₀=50, μ=12%/tahun, σ=30%/tahun, Δt=1 bulan. Z=+1,0. Hitung S₁. Lalu jelaskan mengapa median &lt; ekspektasi di sini. (klik untuk pembahasan)</summary>
        <p>Faktor = exp[(0,12 − 0,5×0,09)/12 + 0,30×√(1/12)×1,0] = exp[0,00625 + 0,0866] = exp(0,0929) = 1,0973 → <strong>S₁ = 54,87</strong>.</p>
        <p><strong>Median &lt; ekspektasi:</strong> ekspektasi tumbuh dengan μ=12%, median dengan μ−σ²/2 = 12% − 4,5% = <strong>7,5%</strong>. Dengan σ=30%, volatility drag 4,5 poin — investor &ldquo;rata-rata&rdquo; mengalami 7,5%, bukan 12%. Makin liar asetnya, makin besar selisih janji (ekspektasi) vs pengalaman (median).</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Turunkan dari mana suku −σ²/2 berasal, dalam 3 kalimat. (klik untuk pembahasan)</summary>
        <p>Dari <strong>lemma Itô</strong>: aturan rantai stokastik harus menyertakan suku orde-2 karena <Tex math={String.raw`(dW_t)^2 = dt \neq 0`} />. Ekspansi Taylor <Tex math={String.raw`\ln S`} /> memberi suku <Tex math={String.raw`-\tfrac{1}{2}(dS/S)^2 = -\tfrac{1}{2}\sigma^2 dt`} />. Secara intuitif: logaritma <strong>cekung</strong>, sehingga guncangan simetris menarik rata-rata geometrik <em>turun</em> — itulah volatility drag.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Kamu memodelkan harga minyak mentah 10 tahun dengan GBM. Sebutkan 2 alasan ini buruk + model alternatif untuk masing-masing. (klik untuk pembahasan)</summary>
        <p><strong>(1) Tanpa mean-reversion:</strong> GBM menyebar dengan √T selamanya → harga US$10.000 atau US$0,01 dalam 10 tahun, keduanya absurd untuk komoditas dengan biaya produksi. <strong>Alternatif:</strong> model mean-reverting (Schwartz / Vasicek untuk log-harga).</p>
        <p><strong>(2) Vol konstan + tanpa jump:</strong> minyak punya spike geopolitik (jump) dan clustering vol. <strong>Alternatif:</strong> jump-diffusion atau GARCH untuk vol. Prinsip: <strong>pilih model dari sifat data, bukan dari kemudahan rumus</strong> — dan tulis &ldquo;surat wasiat&rdquo; asumsinya (MR18).</p>
      </details>

      <h2 id="case">📋 Mini-Case: Model Suku Bunga yang Salah</h2>
      <div className="callout">
        <p>Bank STU memakai <strong>Vasicek</strong> (κ=0,3, θ=4%, σ=1,5%) untuk skenario ALM 10 tahun. Hasil: modal dialokasikan berdasarkan skenario terburuk. Audit model menemukan:</p>
        <ul>
          <li>18% skenario menghasilkan suku bunga <strong>negatif</strong> (&lt; −1%) — mustahil di rezim negara ini</li>
          <li>Skenario negatif itu justru yang <strong>paling menguntungkan</strong> bank (liability-sensitive!) → modal <strong>kekurangan</strong> dialokasikan</li>
          <li>Kalibrasi κ dari data 2015–2019 (era stabil) — tidak mencerminkan dinamika 2022–2023</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Mengapa skenario negatif &ldquo;menguntungkan&rdquo; bank ini? (b) Apa perbaikan model yang tepat? (c) Pelajaran validasi apa yang bisa diambil (lihat MR18)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Bank <strong>liability-sensitive jangka pendek</strong> (ingat MR10): suku bunga turun → biaya dana turun lebih cepat dari pendapatan → NII naik. Skenario negatif fiktif membuat model &ldquo;melihat&rdquo; masa depan yang indah — <strong>bias optimis</strong> dari properti model yang salah, bukan dari data.</p>
          <p>(b) <strong>Perbaikan:</strong> (1) Ganti ke <strong>CIR</strong> (non-negatif) atau Vasicek dengan <strong>floor</strong>; (2) kalibrasi ulang dengan data yang mencakup <strong>rezim stres</strong> (2022–2023); (3) uji sensitivitas κ — hasil tidak boleh bergantung kritis pada satu parameter.</p>
          <p>(c) <strong>Validasi:</strong> (1) <em>Uji properti</em> — apakah output model masuk akal secara ekonomi? (negatif 18% = gagal); (2) <em>Uji stabilitas kalibrasi</em> — parameter dari periode berbeda harus masuk akal; (3) <em>Backtest skenario</em> — apakah sebaran historis tercakup? Model yang lolos uji statistik tapi gagal uji akal sehat = model yang berbahaya.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dalam GBM, suku −½σ² dalam solusi eksak adalah?"
        options={[
          "Kesalahan pembulatan",
          "Koreksi Jensen (volatility drag): return median/geometrik lebih rendah dari return ekspektasi aritmatika sebesar ½σ²",
          "Biaya transaksi",
          "Pajak",
        ]}
        correct={1}
        explanation="Benar. Volatilitas 'memakan' pertumbuhan median — dua aset dengan μ sama, yang lebih volatil tumbuh lebih lambat (geometric). Inilah volatility drag."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Untuk simulasi suku bunga di negara yang tidak mungkin negatif, model TEPAT?"
        options={[
          "Vasicek",
          "CIR — volatilitas proporsional √r mencegah penembusan nol; atau Hull-White dengan floor",
          "GBM",
          "Random walk biasa",
        ]}
        correct={1}
        explanation="Benar. Pilih model berdasarkan PROPERTI yang dibutuhkan. Vasicek mengizinkan negatif — jika itu mustahil secara ekonomi, hasilnya bias (seperti mini-case)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam GARCH(1,1), α + β = 0,97 berarti?"
        options={[
          "Model salah",
          "Persistensi volatilitas sangat tinggi — guncangan hari ini bergema berminggu-minggu (volatility clustering kuat)",
          "Volatilitas konstan",
          "Tidak ada clustering",
        ]}
        correct={1}
        explanation="Benar. α+β dekat 1 = ingatan panjang. Inilah formalisasi volatility clustering — dan alasan EWMA (kasus khusus GARCH) bekerja baik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Hubungan EWMA (MR2) dengan GARCH(1,1)?"
        options={[
          "Tidak ada hubungan",
          "EWMA = GARCH(1,1) dengan ω=0, α=1−λ, β=λ — kasus khusus tanpa mean-reversion volatilitas",
          "EWMA lebih umum",
          "GARCH tidak bisa dipakai untuk VaR",
        ]}
        correct={1}
        explanation="Benar. EWMA adalah IGARCH (integrated, α+β=1) — volatilitas tidak kembali ke level jangka panjang. GARCH umum punya level jangka panjang ω/(1−α−β)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan Hull-White dipilih atas Vasicek/CIR?"
        options={[
          "Selalu — lebih modern",
          "Untuk pricing derivatif suku bunga yang harus KONSISTEN dengan kurva pasar kini (θ(t) dikalibrasi pas ke kurva)",
          "Tidak pernah",
          "Hanya untuk saham",
        ]}
        correct={1}
        explanation="Benar. Hull-White = Vasicek + θ(t) yang fit kurva kini persis. Untuk skenario ALM murni, CIR/Vasicek cukup; untuk pricing, konsistensi pasar wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kelemahan FUNDAMENTAL memakai GBM dengan vol konstan untuk VaR ekuitas?"
        options={[
          "Terlalu lambat",
          "Mengabaikan volatility clustering & fat tail — VaR tidak adaptif terhadap rezim dan meremehkan ekor (butuh GARCH/vol stokastik)",
          "Tidak bisa untuk saham",
          "Terlalu akurat",
        ]}
        correct={1}
        explanation="Benar. GBM murni = vol konstan = buta rezim. Praktik yang benar: GBM dengan σ dari GARCH/EWMA (seperti Filtered HS), atau model vol stokastik penuh."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>GBM:</strong> <Tex math={String.raw`dS=\mu S\,dt+\sigma S\,dW`} /> — saham; positif; tidak mean-reverting; ada volatility drag ½σ².</li>
          <li><strong>Vasicek:</strong> mean-reverting tapi bisa negatif. <strong>CIR:</strong> + non-negatif. <strong>Hull-White:</strong> + pas kurva kini (untuk pricing).</li>
          <li><strong>GARCH(1,1):</strong> <Tex math={String.raw`\sigma_t^2=\omega+\alpha r_{t-1}^2+\beta\sigma_{t-1}^2`} /> — formalisasi volatility clustering; α+β ≈ 0,95–0,99.</li>
          <li><strong>EWMA</strong> = GARCH khusus (ω=0, α+β=1).</li>
          <li>Pilih model dari <strong>properti yang dibutuhkan</strong> — bukan dari popularitas.</li>
          <li>Validasi: uji properti ekonomi (boleh negatif?), stabilitas kalibrasi, cakupan historis.</li>
          <li>Semua model hanya sebagus <strong>kalibrasi + datanya</strong> — dan semua punya batas (GARCH tidak meramal presisi).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr14-counterparty-risk" className="btn btn-secondary btn-sm">← MR14</Link>
        <Link href="/learn/mr16-regulasi-frtb" className="btn btn-primary btn-sm">Next: MR16 →</Link>
      </div>
    </div>
  );
}
