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

export default function MR4Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Filtered HS: return historis mentah vs return yang disesuaikan volatilitas kini
  const r = rng(33);
  const N = 250;
  const sigTrue: number[] = [];
  const rets: number[] = [];
  for (let i = 0; i < N; i++) {
    const sig = i < 200 ? 1 : 2.5;
    sigTrue.push(sig);
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5;
    rets.push(+(u * sig).toFixed(2));
  }
  // volatilitas historis rolling 30d (proxy sigma_t), sigma_T = vol kini
  const sigHist: number[] = rets.map((_, i) => {
    const w = rets.slice(Math.max(0, i - 29), i + 1);
    const m = w.reduce((a, b) => a + b, 0) / w.length;
    return Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, w.length - 1)) || 1;
  });
  const sigT = sigHist[N - 1];
  const filtered = rets.map((rt, i) => +((sigT / sigHist[i]) * rt).toFixed(2));
  const days = rets.map((_, i) => i + 1);

  const fhsData = [
    { x: days, y: rets, type: "scatter", mode: "lines", name: "Return mentah", line: { color: "#94a3b8", width: 1.5 } },
    { x: days, y: filtered, type: "scatter", mode: "lines", name: "Return ter-filter (diskala ke vol kini)", line: { color: "#e8a838", width: 1.5 } },
  ];

  // Component VaR: kontribusi tiap desk ke VaR total (contoh)
  const compData = [
    {
      x: ["Rates", "FX", "Ekuitas", "Kredit", "Komoditas"],
      y: [42, 28, 35, 18, 8],
      type: "bar",
      name: "Standalone VaR",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Rates", "FX", "Ekuitas", "Kredit", "Komoditas"],
      y: [30, 15, 22, 10, 3],
      type: "bar",
      name: "Component VaR",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = String.raw`import random, math
random.seed(11)

# FILTERED HISTORICAL SIMULATION
# Ide: return historis diskalakan ke volatilitas KINI sebelum jadi skenario.
# r*_t = (sigma_T / sigma_t) * r_t
# Masa tenang (vol kecil) -> diperbesar; masa krisis lampau (vol besar) -> diperkecil.

# 200 hari tenang (sd=1), 50 hari terakhir krisis (sd=2.5)
rets = [random.gauss(0, 1) for _ in range(200)] + [random.gauss(0, 2.5) for _ in range(50)]
V0 = 5_000_000_000

def roll_vol(x, w, i):
    win = x[max(0, i - w + 1):i + 1]
    m = sum(win) / len(win)
    return math.sqrt(sum((v - m) ** 2 for v in win) / max(1, len(win) - 1))

sig_hist = [roll_vol(rets, 30, i) for i in range(len(rets))]
sig_T = sig_hist[-1]
filtered = [(sig_T / s) * rt for rt, s in zip(rets, sig_hist)]

def percentile(xs, p):
    s = sorted(xs); k = (len(s) - 1) * p; f = math.floor(k)
    return s[f] + (s[f + 1] - s[f]) * (k - f)

var_hs  = -percentile([V0 * rt for rt in rets], 0.01)
var_fhs = -percentile([V0 * rt for rt in filtered], 0.01)
print(f"Volatilitas kini (sigma_T) : {sig_T:.2f}  (rezim krisis)")
print(f"VaR HS biasa  99%/1-hari   : Rp {var_hs:,.0f}")
print(f"VaR Filtered HS 99%/1-hari : Rp {var_fhs:,.0f}")
print()
print("HS biasa 'mencampur' 200 hari tenang + 50 hari krisis -> VaR di tengah-tengah.")
print("Filtered HS menaikkan return masa tenang ke level vol kini -> VaR LEBIH BESAR,")
print("lebih jujur tentang risiko BESOK dalam rezim krisis.")`;

  const lab2Code = String.raw`import math
# DELTA-GAMMA VaR: aproksimasi orde-2 untuk portofolio ber-opsi
# dV ~ delta*dS + 0.5*gamma*(dS)^2
# Untuk opsi, dS ~ N(0, sigma^2*S^2). Suku gamma membuat distribusi TIDAK normal.

S0 = 100.0        # harga saham kini
sigma = 0.30      # vol tahunan 30%
T = 10 / 252      # horizon 10 hari
# Portofolio: short 1000 kontrak call ATM -> delta negatif kecil, gamma negatif BESAR
delta = -200.0    # dV/dS per Rp1 pergerakan
gamma = -150.0    # d2V/dS2 (negatif = short gamma: rugi saat pasar bergerak BESAR dua arah!)

import random
random.seed(5)
n = 50_000
sd_S = S0 * sigma * math.sqrt(T)
pnls = []
for _ in range(n):
    dS = random.gauss(0, sd_S)
    dV = delta * dS + 0.5 * gamma * dS * dS
    pnls.append(dV)

pnls.sort()
var_dg = -pnls[int(0.01 * n)]
# Bandingkan: VaR delta-only (aproksimasi linear, normal)
var_delta_only = 2.33 * abs(delta) * sd_S
print(f"VaR delta-only (linear) 99%/10h : Rp {var_delta_only:,.0f}")
print(f"VaR delta-gamma 99%/10h         : Rp {var_dg:,.0f}")
print()
print("Selisih = kontribusi gamma. Untuk SHORT gamma, VaR linear MEREMEHKAN")
print("risiko karena mengabaikan kerugian kuadratik saat pasar bergerak besar.")
print()
print("Coba: ubah gamma jadi +150 (LONG gamma). Apa yang terjadi pada VaR?")
print("Kenapa long gamma 'menyenangkan' untuk risiko?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR4 — Market Risk Analytics</span>
        <h1 className="display-title">VaR Lanjut: Filtered HS,<br />Delta-Gamma, dan Bedah Kontribusi Risiko</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: VaR yang Benar Tapi Menyesatkan</a></li>
          <li><a href="#fhs">Filtered Historical Simulation</a></li>
          <li><a href="#dg">Delta-Gamma VaR: Orde-2 untuk Dunia Non-Linear</a></li>
          <li><a href="#component">Component &amp; Marginal VaR: Siapa Menyumbang Risiko?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Filtered HS vs HS Biasa</a></li>
          <li><a href="#lab2">🔬 Lab 2: Delta-Gamma VaR Portofolio Opsi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Stressed VaR dan Anatomi Component VaR</a></li>
          <li><a href="#case">📋 Mini-Case: Desk Opsi yang &ldquo;Aman&rdquo; Menurut VaR Linear</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kelemahan HS biasa (mencampur rezim volatilitas) dan cara kerja Filtered HS sebagai perbaikannya.</li>
          <li>Menghitung penyesuaian volatilitas <Tex math={String.raw`r^*_t = (\sigma_T/\sigma_t) r_t`} /> dan menafsirkan efeknya ke VaR.</li>
          <li>Menerapkan aproksimasi delta-gamma untuk VaR portofolio ber-opsi dan menjelaskan kapan orde-1 tidak cukup.</li>
          <li>Menghitung component VaR dan marginal VaR, serta menggunakannya untuk alokasi limit dan deteksi konsentrasi.</li>
          <li>Memilih teknik VaR lanjutan yang tepat sesuai karakteristik portofolio (rezim berubah vs non-linear vs multi-desk).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: VaR yang Benar Tapi Menyesatkan</h2>
      <div className="story">
        <p>Desk derivatif sebuah bank melaporkan VaR 99% harian <strong>Rp12 miliar</strong> — dihitung dengan Historical Simulation 250 hari, sesuai prosedur. Angka itu lolos backtest, disetujui validator, dan dipakai untuk limit. Semua lampu hijau.</p>
        <p>Lalu datang hari di mana indeks jatuh 4%. Kerugian desk: <strong>Rp47 miliar</strong> — hampir 4× VaR. Investigasi menemukan dua hal sekaligus. <strong>Pertama</strong>, 250 hari data mereka 80%-nya berasal dari masa tenang — VaR &ldquo;mengencerkan&rdquo; krisis dengan ketenangan. <strong>Kedua</strong>, desk itu memegang <strong>opsi jual (short put)</strong> dalam jumlah besar: saat pasar jatuh, kerugian membesar <em>kuadratik</em>, bukan linear — sesuatu yang HS biasa tangkap hanya samar-samar, dan VaR delta-only tidak tangkap sama sekali.</p>
        <p>Twist-nya: tidak ada yang &ldquo;salah hitung&rdquo;. Metodenya benar untuk portofolio linear di rezim stabil — tapi <strong>portofolio ini tidak linear dan rezimnya sudah berubah</strong>. Lesson ini tentang tiga senjata untuk dua masalah itu: <strong>Filtered HS</strong> (perbaiki rezim), <strong>delta-gamma</strong> (perbaiki non-linearitas), dan <strong>component VaR</strong> (bedah siapa menyumbang apa).</p>
      </div>

      <h2 id="fhs">Filtered Historical Simulation — HS yang Sadar Rezim</h2>
      <p><strong>Definisi.</strong> HS biasa memakai return historis mentah — mencampur masa tenang dan masa krisis seenaknya. <strong>Filtered HS</strong> (Barone-Adesi dkk.) menyesuaikan tiap return historis ke <strong>volatilitas kini</strong> sebelum dijadikan skenario:</p>
      <Tex math={String.raw`r^*_t = \frac{\sigma_T}{\sigma_t} \cdot r_t`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`r_t`} />: return historis hari-t (mentah)</li>
        <li><Tex math={String.raw`\sigma_t`} />: volatilitas yang berlaku <em>saat itu</em> (diestimasi, misal via GARCH/EWMA — MR2)</li>
        <li><Tex math={String.raw`\sigma_T`} />: volatilitas <strong>kini</strong> (hari-T, hari perhitungan VaR)</li>
        <li><Tex math={String.raw`r^*_t`} />: return yang &ldquo;ter-filter&rdquo; — seolah hari-t terjadi <em>dalam kondisi volatilitas hari ini</em></li>
      </ul>
      <p><strong>Intuisi:</strong> return +5% di masa tenang (σ=1%) sebenarnya adalah <strong>kejutan 5-sigma</strong> — luar biasa ekstrem. Di masa krisis (σ=2,5%), return +5% hanyalah kejutan 2-sigma — biasa saja. Filtered HS menyamakan &ldquo;level kejutan&rdquo; semua hari historis ke rezim kini: return masa tenang <strong>diperbesar</strong>, return masa krisis lampau <strong>diperkecil</strong>.</p>

      <PlotlyChart
        data={fhsData}
        title="Return Mentah vs Return Ter-Filter (krisis mulai hari 200, σ kini = 2,5%)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Return (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis abu-abu = return historis mentah; garis kuning = return setelah diskalakan ke volatilitas kini (2,5%). Krisis dimulai hari ke-200.</p>
        <p><strong>Interpretasi:</strong> sebelum hari 200 (masa tenang), garis kuning <strong>lebih liar</strong> dari abu-abu — return masa tenang &ldquo;ditiup&rdquo; ke skala krisis kini. Setelah hari 200, keduanya mirip (rezim sudah sama). <strong>Hasilnya:</strong> VaR Filtered HS lebih besar dan lebih jujur tentang risiko <em>besok</em> — karena ia bertanya &ldquo;bagaimana jika pola historis terjadi <em>dalam kondisi pasar hari ini</em>?&rdquo;</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Filtered HS memisahkan dua hal yang HS biasa campur aduk: <strong>bentuk distribusi</strong> (diambil dari histori — tetap non-parametrik, tetap menangkap fat tail) dan <strong>level volatilitas</strong> (diambil dari kini — via EWMA/GARCH). Ini kompromi elegan: kejujuran empiris HS + kewaspadaan rezim EWMA.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Filtered HS selalu memberi VaR lebih besar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> arah penyesuaian tergantung <strong>rezim kini vs rata-rata historis</strong>. Jika kini sedang <em>tenang</em> setelah masa krisis (σ_T kecil), Filtered HS justru <strong>memperkecil</strong> VaR dibanding HS biasa. Ia bukan &ldquo;versi konservatif&rdquo; — ia &ldquo;versi sadar-rezim&rdquo;, bisa lebih besar <em>atau</em> lebih kecil.</p>
      </div>

      <h2 id="dg">Delta-Gamma VaR: Orde-2 untuk Dunia Non-Linear</h2>
      <p><strong>Definisi.</strong> Untuk portofolio ber-opsi, hubungan nilai vs faktor <strong>melengkung</strong>. Aproksimasi Taylor orde-2 (disebut <strong>delta-gamma</strong>):</p>
      <Tex math={String.raw`\Delta V \approx \delta \cdot \Delta S + \tfrac{1}{2}\,\Gamma \cdot (\Delta S)^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\delta`} /> (delta): sensitivitas orde-1 — kemiringan kurva nilai (MR1)</li>
        <li><Tex math={String.raw`\Gamma`} /> (gamma): sensitivitas orde-2 — <strong>kelengkungan</strong>; seberapa cepat delta berubah saat harga bergerak</li>
        <li><Tex math={String.raw`\Delta S`} />: pergerakan harga underlying</li>
      </ul>
      <p><strong>Kenapa orde-1 gagal:</strong> suku <Tex math={String.raw`\tfrac{1}{2}\Gamma(\Delta S)^2`} /> tumbuh <strong>kuadratik</strong> — untuk pergerakan kecil ia diabaikan, tapi untuk pergerakan besar ia <em>mendominasi</em>. Portofolio <strong>short gamma</strong> (jual opsi) rugi besar saat pasar bergerak liar <em>ke arah mana pun</em> — VaR linear tidak melihat ini sama sekali.</p>
      <p><strong>Cara hitung VaR-nya:</strong> karena suku kuadratik membuat distribusi tidak normal, tidak ada rumus tertutup sederhana — praktiknya: <strong>simulasikan</strong> <Tex math={String.raw`\Delta S`} /> (misal normal), hitung <Tex math={String.raw`\Delta V`} /> via rumus delta-gamma untuk tiap skenario, ambil kuantilnya. (Itulah yang dilakukan Lab 2.)</p>

      <details className="worked">
        <summary>📐 Contoh angka: short gamma itu menakutkan (klik untuk buka)</summary>
        <p>Portofolio: δ = −200, Γ = −150 (short call), S₀ = 100, σ = 30% tahunan, horizon 10 hari → sd(ΔS) ≈ 100 × 0,30 × √(10/252) ≈ <strong>5,97</strong>.</p>
        <p><strong>VaR delta-only:</strong> 2,33 × 200 × 5,97 ≈ <strong>Rp2.782</strong> (satuan).</p>
        <p><strong>Dengan gamma:</strong> skenario ΔS = −12 (jatuh 2-sigma): ΔV ≈ −200×(−12) + 0,5×(−150)×144 = 2.400 − 10.800 = <strong>−8.400</strong>. Suku gamma (−10.800) <em>empat kali</em> suku delta! Inilah yang disembunyikan aproksimasi linear.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Delta kecil berarti risiko kecil.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> portofolio <strong>delta-neutral tapi short gamma</strong> (strategi umum: jual straddle) terlihat &ldquo;aman&rdquo; untuk pergerakan kecil — delta ≈ 0. Tapi ia adalah <strong>jebakan volatilitas</strong>: rugi kuadratik saat pasar bergerak besar. Banyak bencana derivatif berasal dari posisi &ldquo;delta kecil&rdquo; yang gamma-nya mematikan. Selalu cek orde-2.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> delta = <em>kecepatan</em>, gamma = <em>akselerasi</em>. Mengukur risiko opsi hanya dengan delta seperti mengukur bahaya mobil hanya dari kecepatannya — tanpa melihat apakah ia sedang menginjak rem atau gas. <strong>Long gamma</strong> = rem otomatis (untung dari pergerakan besar); <strong>short gamma</strong> = gas pol tanpa rem.</p>
      </div>

      <h2 id="component">Component &amp; Marginal VaR: Siapa Menyumbang Risiko?</h2>
      <p><strong>Definisi.</strong> VaR total portofolio bisa <strong>dibedah</strong> menjadi kontribusi tiap komponen (desk/aset/faktor) yang <strong>jumlahnya pas</strong> sama dengan VaR total:</p>
      <Tex math={String.raw`\text{ComponentVaR}_i = w_i \cdot \frac{\partial \text{VaR}}{\partial w_i}, \qquad \sum_i \text{ComponentVaR}_i = \text{VaR}`} block />
      <p>Untuk VaR parametrik, ada rumus elegan:</p>
      <Tex math={String.raw`\text{ComponentVaR}_i = \text{VaR} \cdot \frac{w_i (\Sigma w)_i}{w^T \Sigma w}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`w_i`} />: bobot/eksposur komponen-i</li>
        <li><Tex math={String.raw`\partial\text{VaR}/\partial w_i`} />: <strong>marginal VaR</strong> — &ldquo;jika tambah Rp1 eksposur ke-i, VaR naik berapa?&rdquo;</li>
        <li><Tex math={String.raw`(\Sigma w)_i`} />: kovarians komponen-i dengan <em>portofolio total</em> — menangkap efek diversifikasi</li>
      </ul>
      <p><strong>Bedanya:</strong> <strong>marginal VaR</strong> = turunan (untuk keputusan &ldquo;tambah/kurangi sedikit&rdquo;); <strong>component VaR</strong> = marginal × posisi (untuk alokasi &ldquo;siapa makan risiko berapa&rdquo;). <strong>Incremental VaR</strong> = perubahan VaR jika <em>menghapus total</em> satu posisi (untuk keputusan jual-beli besar, tidak infinitesimal).</p>
      <p><strong>Kenapa ini penting:</strong> component VaR <strong>lebih kecil</strong> dari standalone VaR tiap komponen (karena diversifikasi) — dan jumlahnya pas. Ini alat untuk: alokasi limit per desk yang adil, deteksi <strong>konsentrasi risiko</strong> (desk dengan component VaR dominan), dan pricing internal (berapa &ldquo;biaya risiko&rdquo; tiap unit bisnis).</p>

      <PlotlyChart
        data={compData}
        title="Standalone VaR vs Component VaR per Desk (Rp miliar)"
        layout={{ barmode: "group", xaxis: { title: "Desk" }, yaxis: { title: "VaR (Rp miliar)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap desk punya dua batang — abu-abu = standalone VaR (risikonya jika berdiri sendiri), biru = component VaR (kontribusi ke VaR total setelah diversifikasi).</p>
        <p><strong>Interpretasi:</strong> jumlah standalone = Rp131 M, tapi VaR total hanya <strong>Rp80 M</strong> — selisih Rp51 M adalah <strong>manfaat diversifikasi</strong>. Desk Rates menyumbang component VaR terbesar (Rp30 M) → jika harus memotong risiko, potong di sini paling efektif (marginal VaR tertinggi). <strong>Jebakan:</strong> diversifikasi ini dihitung dari korelasi <em>masa tenang</em> — saat krisis, korelasi naik dan manfaat ini menguap (ingat cerita MR3).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> component VaR menjawab pertanyaan politik paling sensitif di bank: <em>&ldquo;desk siapa yang paling banyak makan modal risiko?&rdquo;</em> Desk dengan standalone VaR besar tapi component VaR kecil adalah <strong>diversifier</strong> yang berharga (lindungi dia!). Desk dengan component VaR ≈ standalone VaR-nya adalah <strong>konsentrasi</strong> yang tidak memberi manfaat diversifikasi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Filtered HS vs HS Biasa</h2>
      <p>Ubah komposisi rezim (misal 100 hari tenang + 150 hari krisis) dan lihat kapan Filtered HS memberi VaR <strong>lebih kecil</strong> dari HS biasa. Kapan itu terjadi?</p>
      <PyodideLab
        title="Lab 1 — Filtered Historical Simulation"
        hint="Coba balik rezim: 50 hari tenang di awal, 200 hari krisis, lalu 50 hari tenang di AKHIR (sigma_T kecil). Bandingkan kedua VaR — Filtered HS kini lebih kecil. Apakah itu 'benar'?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Delta-Gamma VaR Portofolio Opsi</h2>
      <p>Ubah gamma −150 → +150 (long gamma) dan delta −200 → 0 (delta-neutral). Bagaimana VaR berubah? Posisi mana yang &ldquo;tidur lebih nyenyak&rdquo;?</p>
      <PyodideLab
        title="Lab 2 — VaR Orde-2 untuk Portofolio Ber-Opsi"
        hint="Coba gamma=+150 (long gamma): VaR delta-gamma bisa LEBIH KECIL dari VaR delta-only! Kenapa? Karena long gamma untung dari pergerakan besar — ekor kerugian menyusut."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Rezim volatilitas berubah tajam, portofolio linear → <strong>Filtered HS</strong></h3>
        <p><strong>Kondisi:</strong> ada regime change jelas (tenang → krisis atau sebaliknya); ingin tetap non-parametrik.</p>
        <p><strong>Alasan:</strong> menyesuaikan level volatilitas ke kini tanpa mengasumsikan bentuk distribusi. Butuh estimator volatilitas historis yang layak (EWMA/GARCH).</p>
      </div>

      <div className="decision-card">
        <h3>2. Portofolio mengandung opsi dengan gamma material → <strong>Delta-gamma (atau full Monte Carlo)</strong></h3>
        <p><strong>Kondisi:</strong> |Γ| besar relatif terhadap δ; horizon &gt; 1 hari.</p>
        <p><strong>Alasan:</strong> aproksimasi linear sistematis salah untuk pergerakan besar. Delta-gamma = kompromi murah; full revaluation MC = gold standard.</p>
      </div>

      <div className="decision-card">
        <h3>3. Alokasi limit / modal antar desk → <strong>Component VaR</strong></h3>
        <p><strong>Kondisi:</strong> multi-desk, butuh pembagian yang jumlahnya pas dengan VaR total.</p>
        <p><strong>Alasan:</strong> satu-satunya dekomposisi yang aditif sempurna + menangkap diversifikasi. Jangan alokasikan pakai standalone VaR (double-counting manfaat diversifikasi).</p>
      </div>

      <div className="decision-card">
        <h3>4. Keputusan tambah/kurangi posisi kecil → <strong>Marginal VaR</strong></h3>
        <p><strong>Kondisi:</strong> trader bertanya &ldquo;kalau saya tambah Rp10 M di posisi ini, VaR naik berapa?&rdquo;</p>
        <p><strong>Alasan:</strong> turunan VaR terhadap bobot memberi jawaban marginal yang tepat untuk perubahan kecil. Untuk perubahan besar pakai incremental VaR (hitung ulang penuh).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Rezim berubah?</strong> → filter (FHS). <strong>Non-linear?</strong> → orde-2 (delta-gamma). <strong>Multi-desk?</strong> → bedah (component VaR).</li>
          <li>Delta kecil ≠ aman — <strong>cek gamma</strong>.</li>
          <li>Component VaR yang dominan = <strong>konsentrasi</strong> — calon pertama untuk dipotong saat de-risking.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Stressed VaR dan Anatomi Component VaR</h2>
      <p>Dua alat lanjutan yang memisahkan analis VaR junior dari senior: <strong>Stressed VaR</strong> (jawaban regulasi atas &ldquo;data masa tenang&rdquo;) dan <strong>Component VaR</strong> (jawaban atas &ldquo;risiko ini datangnya dari mana?&rdquo;). Keduanya dibedah dengan angka konkret.</p>

      <h3>Stressed VaR: memaksa model mengingat krisis</h3>
      <p><strong>Definisi.</strong> <strong>Stressed VaR (sVaR)</strong> dihitung dengan metodologi sama seperti VaR biasa, tetapi memakai <strong>jendela data 12 bulan yang mencakup periode stres signifikan</strong> — bukan 12 bulan terakhir. Diperkenalkan Basel 2.5 (2009) sebagai respons langsung atas krisis 2008, ketika VaR dari data 2006–2007 yang tenang memberi rasa aman palsu.</p>
      <p><strong>Intuisi:</strong> VaR biasa bertanya &ldquo;seberapa buruk hari buruk di <em>lingkungan saat ini</em>?&rdquo;. Stressed VaR bertanya &ldquo;seberapa buruk hari buruk <em>jika 2008 terulang dengan portofolio hari ini</em>?&rdquo;. Portofolio saat ini &ldquo;dilempar&rdquo; ke masa lalu yang brutal — kombinasi yang tidak pernah benar-benar terjadi, tapi justru itulah gunanya: ia menguji ketahanan, bukan meramal.</p>
      <p><strong>Aturan modal Basel 2.5:</strong> kebutuhan modal = VaR biasa + Stressed VaR (masing-masing dikali multiplier ≥ 3). Efeknya dramatis: bank yang VaR tenangnya Rp100 miliar bisa punya sVaR Rp350 miliar — modalnya melonjak <strong>4,5×</strong>. Inilah cara regulator memaksa bank &ldquo;menabung&rdquo; di masa tenang.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: VaR biasa vs Stressed VaR (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Portofolio obligasi korporat Rp5 triliun. Volatilitas harian masa tenang (2023–2024): <Tex math={String.raw`\sigma_{tenang} = 0{,}4\%`} />. Volatilitas periode stres (2008): <Tex math={String.raw`\sigma_{stres} = 1{,}6\%`} /> (4× lipat). Metode parametrik, 99%, 10-hari.</p>
        <p><strong>Langkah 1 — VaR biasa:</strong> <Tex math={String.raw`\text{VaR} = 2{,}33 \times 0{,}004 \times \sqrt{10} \times 5\text{ T} \approx \text{Rp}147\text{ miliar}`} />.</p>
        <p><strong>Langkah 2 — Stressed VaR:</strong> <Tex math={String.raw`\text{sVaR} = 2{,}33 \times 0{,}016 \times \sqrt{10} \times 5\text{ T} \approx \text{Rp}589\text{ miliar}`} /> — <strong>4×</strong> VaR biasa.</p>
        <p><strong>Langkah 3 — modal:</strong> (147 + 589) × 3 ≈ <strong>Rp2,2 triliun</strong>. Tanpa sVaR, modalnya hanya 147 × 3 = Rp441 miliar — <strong>seperlima</strong> dari yang seharusnya.</p>
        <p><strong>Angka ini artinya:</strong> di masa tenang, VaR biasa membuat bank terlihat aman dengan modal kecil. Stressed VaR adalah &ldquo;rem tangan&rdquo; yang memastikan bank tetap membawa payung besar meski langit cerah. Kritiknya memang ada: sVaR bersifat <strong>procyclical terbalik</strong> — ia tidak turun saat krisis berlalu (jendela stres tetap dipakai), sehingga modal tetap tinggi. Tapi regulator memilih <em>konservatif dan stabil</em> daripada <em>akurat tapi berbahaya</em>.</p>
      </details>

      <h3>Component VaR: membedah &ldquo;siapa penyumbang risiko&rdquo;</h3>
      <p>VaR portofolio memberi <strong>satu angka</strong>. Tapi trader bertanya: &ldquo;Dari Rp500 miliar VaR ini, berapa yang berasal dari posisi saya?&rdquo;. Jawabannya <strong>Component VaR</strong> — alokasi VaR ke tiap posisi yang <strong>menjumlah tepat</strong> ke VaR total (berkat teorema Euler untuk fungsi homogen).</p>
      <Tex math={String.raw`\text{ComponentVaR}_i = w_i \cdot \frac{\partial \text{VaR}}{\partial w_i}`} block />
      <p><strong>Intuisi turunannya:</strong> <Tex math={String.raw`\partial \text{VaR} / \partial w_i`} /> adalah <strong>risiko marjinal</strong> — &ldquo;jika saya tambah Rp1 ke posisi-i, VaR total naik berapa?&rdquo;. Kalikan dengan ukuran posisi <Tex math={String.raw`w_i`} /> → kontribusi total posisi itu. Jumlah semua component = VaR portofolio <strong>persis</strong> (bukan aproksimasi).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: Component VaR portofolio 2 aset (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Portofolio Rp10 triliun: 60% obligasi (vol 5%), 40% saham (vol 20%), korelasi 0,2. VaR 99% 1-hari, metode parametrik.</p>
        <p><strong>Langkah 1 — vol portofolio:</strong> <Tex math={String.raw`\sigma_p = \sqrt{0{,}6^2(0{,}05^2) + 0{,}4^2(0{,}2^2) + 2(0{,}6)(0{,}4)(0{,}2)(0{,}05)(0{,}2)} = \sqrt{0{,}0009 + 0{,}0064 + 0{,}00096} \approx 9{,}06\%`} />.</p>
        <p><strong>Langkah 2 — VaR total:</strong> <Tex math={String.raw`2{,}33 \times 9{,}06\% \times 10\text{ T} \approx \text{Rp}2{,}11\text{ triliun}`} />.</p>
        <p><strong>Langkah 3 — Component VaR</strong> (rumus <Tex math={String.raw`\text{VaR} \cdot w_i(\Sigma w)_i / (w^T\Sigma w)`} />):</p>
        <ul>
          <li>Obligasi: <strong>Rp0,52 triliun</strong> (25% dari VaR total — padahal bobotnya 60%!)</li>
          <li>Saham: <strong>Rp1,59 triliun</strong> (75% dari VaR total — padahal bobotnya 40%!)</li>
        </ul>
        <p><strong>Angka ini artinya:</strong> 40% alokasi saham menyumbang <strong>75%</strong> risiko. Inilah wawasan yang tidak terlihat dari bobot portofolio mentah — dan dasar dari <strong>risk budgeting</strong>: alokasikan <em>risiko</em>, bukan alokasikan <em>modal</em>. Manajer yang hanya melihat bobot 60/40 mengira portofolionya &ldquo;seimbang&rdquo;; component VaR membuktikan ia 75% bertaruh pada saham.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Component VaR = VaR standalone tiap posisi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR standalone obligasi di contoh atas jauh lebih besar dari Rp0,52 T — karena standalone mengabaikan diversifikasi. Component VaR justru <strong>sudah memperhitungkan</strong> efek diversifikasi/korelasi: ia mengukur kontribusi <em>marjinal</em> di dalam portofolio. Karena itu jumlahnya pas ke VaR total, sedangkan jumlah VaR standalone selalu <strong>lebih besar</strong> (kecuali korelasi sempurna = 1). Kalau component VaR posisimu kecil padahal standalone-nya besar — selamat, posisimu terdiversifikasi dengan baik.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada tiga &ldquo;VaR per posisi&rdquo; yang berbeda dan jangan tertukar: <strong>(1) Standalone VaR</strong> — risiko posisi seolah sendirian (untuk limit kasar); <strong>(2) Incremental VaR</strong> — selisih VaR portofolio dengan/tanpa posisi itu (untuk keputusan tambah/kurang posisi); <strong>(3) Component VaR</strong> — alokasi Euler yang menjumlah ke total (untuk risk budgeting &amp; alokasi modal internal). Untuk pertanyaan &ldquo;tambah Rp100 M ke posisi ini, VaR naik berapa?&rdquo; → incremental. Untuk &ldquo;bagi bonus/charge modal per desk secara adil&rdquo; → component.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: delta-gamma VaR — ketika linear tidak cukup (klik untuk buka)</summary>
        <p><strong>Portofolio opsi:</strong> delta (ekuivalen saham) Rp500 M, gamma −Rp8 M per 1%² (short gamma). Vol harian saham 2%.</p>
        <p><strong>VaR delta-only (99%):</strong> 2,33 × 2% × 500 M = <strong>Rp23,3 M</strong>.</p>
        <p><strong>Koreksi gamma:</strong> untuk pergerakan 2σ (4,66%): 0,5 × (−8 M) × (4,66)² = <strong>−Rp86,9 M</strong>!</p>
        <p><strong>Delta-gamma VaR</strong> ≈ 23,3 + 86,9 = <strong>Rp110 M</strong> — <strong>4,7×</strong> VaR linear!</p>
        <p><strong>Pelajaran:</strong> untuk portofolio short-gamma, VaR linear bukan &ldquo;sedikit salah&rdquo; — ia <strong>salah kategori</strong> (underestimate ~80%). Inilah yang terjadi di mini-case &ldquo;Desk Opsi yang Aman Menurut VaR Linear&rdquo;: angka hijau, risiko merah. <strong>Aturan:</strong> gamma material → delta-gamma VaR (atau full Monte Carlo) <em>wajib</em> — tidak opsional.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — VaR biasa Rp147 M, Stressed VaR Rp589 M, multiplier 3. Hitung kebutuhan modal (a) tanpa sVaR (aturan lama), (b) dengan sVaR (Basel 2.5). Berapa &ldquo;harga&rdquo; dari pelajaran 2008? (klik untuk pembahasan)</summary>
        <p><strong>(a)</strong> 3 × 147 = <strong>Rp441 M</strong>. <strong>(b)</strong> 3 × (147 + 589) = <strong>Rp2.208 M</strong>.</p>
        <p>&ldquo;Harga&rdquo; pelajaran 2008 = <strong>Rp1.767 M modal tambahan</strong> (5× lipat). Inilah biaya <em>asuransi sistemik</em> — mahal di masa tenang, murah dibanding talangan krisis (triliunan). Regulator memilih membebani bank di masa cerah daripada membebani pembayar pajak di masa badai.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Portofolio 2 aset di lesson ini: obligasi 60% menyumbang 25% VaR, saham 40% menyumbang 75%. Jika manajer ingin risiko 50/50, ke arah mana ia harus menggeser bobot? Mengapa bobot 50/50 TIDAK memberi risiko 50/50? (klik untuk pembahasan)</summary>
        <p><strong>Geser:</strong> <em>kurangi</em> saham (atau tambah obligasi) — saham mendominasi risiko 3× bobotnya karena vol 4× lipat (20% vs 5%).</p>
        <p><strong>Mengapa 50/50 ≠ risiko 50/50:</strong> kontribusi risiko = fungsi <em>volatilitas, korelasi, dan bobot</em> — bukan bobot saja. Aset bervol tinggi &ldquo;mendominasi&rdquo; risiko melebihi porsi modalnya. Inilah inti <strong>risk parity</strong>: samakan <em>kontribusi risiko</em>, bukan alokasi modal. Bobot 50/50 di sini masih didominasi saham (~65% risiko).</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Kapan Filtered Historical Simulation lebih baik dari HS biasa? Beri contoh konkret. (klik untuk pembahasan)</summary>
        <p><strong>Ketika volatilitas saat ini jauh berbeda dari rata-rata jendela data.</strong> Contoh: setelah 3 bulan krisis, vol saat ini 3× rata-rata 250-hari. HS biasa mencampur return masa tenang (terlalu kecil) dengan masa krisis — <em>underestimate</em> risiko kini. FHS menstandarkan return historis dengan vol saat itu (<Tex math={String.raw`r^*_t = (\sigma_T/\sigma_t) r_t`} />), lalu menskalakan ulang dengan vol <em>kini</em> — &ldquo;bagaimana jika pola return masa lalu terjadi dengan kegilaan hari ini?&rdquo;. Ideal setelah regime change; kurang berguna jika vol stabil.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Desk Opsi yang &ldquo;Aman&rdquo; Menurut VaR Linear</h2>
      <div className="callout">
        <p>Desk derivatif menjual <strong>straddle</strong> (short call + short put) atas indeks — menerima premi, delta ≈ 0 (netral). Sistem VaR bank memakai <strong>aproksimasi delta-only</strong>:</p>
        <ul>
          <li>VaR delta-only 99%/1-hari: <strong>Rp1,2 miliar</strong> (kecil — &ldquo;aman&rdquo;)</li>
          <li>Gamma portofolio: <strong>−Rp850 juta per (1%)²</strong> (short gamma besar)</li>
          <li>Suatu hari indeks bergerak <strong>±3%</strong> (bukan hal mustahil)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Estimasi kerugian orde-2 hari itu. (b) Mengapa VaR delta-only gagal total? (c) Perbaikan apa yang tepat untuk desk seperti ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Suku gamma: 0,5 × (−850 jt) × 3² = <strong>−Rp3,825 miliar</strong>. Suku delta ≈ 0. Total ≈ <strong>−Rp3,8 M</strong> — lebih dari <strong>3× VaR</strong> yang dilaporkan. Dan ini untuk pergerakan 3% yang wajar, bukan black swan.</p>
          <p>(b) VaR delta-only mengasumsikan <strong>linearitas</strong>: ΔV ≈ δ·ΔS dengan δ ≈ 0 → risiko ≈ 0. Padahal payoff straddle short adalah <strong>parabola terbalik</strong> — rugi kuadratik ke dua arah. Aproksimasi orde-1 pada fungsi kuadratik = buta total.</p>
          <p>(c) <strong>Wajib:</strong> VaR delta-gamma atau full-revaluation Monte Carlo untuk desk ini (bukan opsional). <strong>Limit:</strong> tambah limit gamma tersendiri (bukan cuma limit VaR). <strong>Stress:</strong> skenario &ldquo;gap ±5%&rdquo; eksplisit. Pelajaran umum: <strong>metode VaR harus mengikuti non-linearitas portofolio</strong> — bukan sebaliknya.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dalam Filtered HS, r*_t = (σ_T/σ_t)·r_t. Jika σ_T > σ_t, apa yang terjadi pada return historis hari-t?"
        options={[
          "Diperkecil — karena masa lalu lebih tenang",
          "Diperbesar — disesuaikan ke level volatilitas kini yang lebih tinggi",
          "Tidak berubah",
          "Dibuang dari sampel",
        ]}
        correct={1}
        explanation="Benar. σ_T/σ_t > 1 → return 'ditiup' ke skala kini. Inilah cara FHS menjawab: 'bagaimana jika pola hari itu terjadi dalam kondisi pasar SEKARANG?'"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Portofolio delta-neutral (δ≈0) tapi short gamma besar. VaR delta-only akan…"
        options={[
          "Akurat — delta nol berarti tidak ada risiko",
          "Meremehkan risiko secara sistematis — mengabaikan kerugian kuadratik saat pasar bergerak besar",
          "Melebih-lebihkan risiko",
          "Sama dengan VaR delta-gamma",
        ]}
        correct={1}
        explanation="Benar. Delta ≈ 0 membuat VaR linear ≈ 0, padahal suku ½Γ(ΔS)² bisa sangat negatif. Ini jebakan klasik strategi short-vol yang 'terlihat aman'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Component VaR lima desk berjumlah Rp80 M = VaR total. Desk Rates = Rp30 M. Artinya?"
        options={[
          "Desk Rates rugi Rp30 M kemarin",
          "Kontribusi Desk Rates ke VaR total adalah Rp30 M setelah memperhitungkan diversifikasi — kandidat pertama untuk dipotong saat de-risking",
          "Limit Desk Rates adalah Rp30 M",
          "Desk Rates harus ditutup",
        ]}
        correct={1}
        explanation="Benar. Component VaR = kontribusi risiko yang aditif. Desk dengan component terbesar memberi 'penghematan risiko per rupiah yang dipotong' terbesar (marginal VaR tertinggi)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan Filtered HS memberi VaR LEBIH KECIL dari HS biasa?"
        options={[
          "Tidak pernah — FHS selalu konservatif",
          "Saat volatilitas kini (σ_T) lebih RENDAH dari rata-rata historis — misal tenang setelah krisis",
          "Saat data historis pendek",
          "Saat portofolio linear",
        ]}
        correct={1}
        explanation="Benar. FHS bukan 'versi konservatif' melainkan 'versi sadar-rezim'. σ_T kecil → return historis diperkecil → VaR turun. Ia mengikuti kini, bukan selalu menaikkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Trader bertanya: 'Kalau saya tambah Rp10 M di posisi X, VaR naik berapa?' Metrik yang tepat?"
        options={[
          "Standalone VaR posisi X",
          "Marginal VaR (turunan VaR terhadap bobot) × Rp10 M",
          "VaR total portofolio",
          "Component VaR desk lain",
        ]}
        correct={1}
        explanation="Benar. Marginal VaR = ∂VaR/∂w_i menjawab pertanyaan perubahan kecil. Standalone VaR mengabaikan korelasi dengan portofolio dan akan salah besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Jumlah standalone VaR 5 desk = Rp131 M, VaR total = Rp80 M. Selisih Rp51 M adalah…"
        options={[
          "Kesalahan hitung",
          "Manfaat diversifikasi — yang akan MENYUSUT saat korelasi melonjak di tengah krisis",
          "Cadangan modal",
          "Keuntungan yang belum direalisasi",
        ]}
        correct={1}
        explanation="Benar. Diversifikasi = selisih agregasi naif vs agregasi berkorelasi. Peringatan: manfaat ini dihitung dari korelasi masa tenang — saat krisis korelasi → 1 dan manfaat menguap. Jangan pernah mengandalkan Rp51 M itu penuh."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Filtered HS:</strong> <Tex math={String.raw`r^*_t = (\sigma_T/\sigma_t)\,r_t`} /> — HS yang sadar rezim; pisahkan bentuk distribusi (histori) dari level volatilitas (kini).</li>
          <li><strong>Delta-gamma VaR:</strong> <Tex math={String.raw`\Delta V \approx \delta\Delta S + \tfrac{1}{2}\Gamma(\Delta S)^2`} /> — wajib untuk portofolio ber-opsi; delta kecil ≠ aman.</li>
          <li><strong>Short gamma</strong> = jebakan volatilitas (rugi kuadratik dua arah); <strong>long gamma</strong> = rem otomatis.</li>
          <li><strong>Component VaR</strong> = kontribusi aditif per komponen (untuk alokasi limit/modal); <strong>marginal VaR</strong> = turunan (untuk keputusan tambah/kurangi); <strong>incremental</strong> = untuk perubahan besar.</li>
          <li>Manfaat diversifikasi dari component VaR <strong>tidak permanen</strong> — korelasi naik saat krisis.</li>
          <li>Kapan TIDAK perlu teknik ini: portofolio linear + rezim stabil + single desk — VaR dasar (MR3) sudah cukup.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr3-var" className="btn btn-secondary btn-sm">← MR3</Link>
        <Link href="/learn/mr5-expected-shortfall" className="btn btn-primary btn-sm">Next: MR5 →</Link>
      </div>
    </div>
  );
}
