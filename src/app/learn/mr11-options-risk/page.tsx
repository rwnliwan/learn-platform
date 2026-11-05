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

// Black-Scholes sederhana untuk chart payoff & delta hedging ilustrasi
function normCDF(x: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}
function bsCall(S: number, K: number, T: number, r: number, sig: number) {
  if (T <= 0) return Math.max(S - K, 0);
  const d1 = (Math.log(S / K) + (r + 0.5 * sig * sig) * T) / (sig * Math.sqrt(T));
  const d2 = d1 - sig * Math.sqrt(T);
  return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
}
function bsDelta(S: number, K: number, T: number, r: number, sig: number) {
  if (T <= 0) return S > K ? 1 : 0;
  const d1 = (Math.log(S / K) + (r + 0.5 * sig * sig) * T) / (sig * Math.sqrt(T));
  return normCDF(d1);
}

export default function MR11Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Payoff call vs put saat expiry
  const Ss = Array.from({ length: 41 }, (_, i) => 60 + i * 2);
  const K = 100;
  const payoffCall = Ss.map((S) => Math.max(S - K, 0));
  const payoffPut = Ss.map((S) => Math.max(K - S, 0));

  const payoffData = [
    { x: Ss, y: payoffCall, type: "scatter", mode: "lines", name: "Call payoff (K=100)", line: { color: "#2a7de1", width: 2.5 } },
    { x: Ss, y: payoffPut, type: "scatter", mode: "lines", name: "Put payoff (K=100)", line: { color: "#e8a838", width: 2.5 } },
  ];

  // Delta call ATM seiring waktu (menuju expiry)
  const Ts = Array.from({ length: 50 }, (_, i) => 0.01 + (i * 0.5) / 50);
  const deltaATM = Ts.map((T) => +bsDelta(100, 100, T, 0.05, 0.3).toFixed(3));
  const deltaITM = Ts.map((T) => +bsDelta(110, 100, T, 0.05, 0.3).toFixed(3));
  const deltaOTM = Ts.map((T) => +bsDelta(90, 100, T, 0.05, 0.3).toFixed(3));

  const deltaData = [
    { x: Ts, y: deltaATM, type: "scatter", mode: "lines", name: "ATM (S=100)", line: { color: "#2a7de1", width: 2.5 } },
    { x: Ts, y: deltaITM, type: "scatter", mode: "lines", name: "ITM (S=110)", line: { color: "#22c55e", width: 2 } },
    { x: Ts, y: deltaOTM, type: "scatter", mode: "lines", name: "OTM (S=90)", line: { color: "#e8a838", width: 2 } },
  ];

  // Vol smile: implied vol vs strike
  const strikes = [80, 85, 90, 95, 100, 105, 110, 115, 120];
  const ivSmile = [38, 34, 31, 29, 28, 29, 31, 34, 38];

  const smileData = [
    { x: strikes, y: ivSmile, type: "scatter", mode: "lines+markers", name: "Implied vol (%)", line: { color: "#ef4444", width: 2.5 } },
  ];

  // Delta-hedging simulation: hedged vs unhedged P&L paths
  const r = rng(99);
  const N = 60;
  const S0 = 100, sigma = 0.3, dt = 1 / 252;
  let S = S0;
  const Spath: number[] = [S];
  for (let i = 0; i < N; i++) {
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5;
    S = S * Math.exp((0.05 - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * u);
    Spath.push(+S.toFixed(2));
  }
  // nilai call (K=100, T awal 60 hari) dan delta hedge harian
  const T0 = 60 / 252, rr = 0.05;
  const callVals = Spath.map((s, i) => bsCall(s, K, Math.max(T0 - i * dt, 0.0001), rr, sigma));
  // P&L: short 1 call, hedge dengan delta saham (rebalance harian)
  let hedgePnl = 0, shares = 0, cash = callVals[0]; // terima premi
  const hedgePath: number[] = [0];
  for (let i = 1; i <= N; i++) {
    const T = Math.max(T0 - i * dt, 0.0001);
    const d = bsDelta(Spath[i], K, T, rr, sigma);
    const dShares = d - shares;
    cash -= dShares * Spath[i]; // beli/jual saham
    shares = d;
    cash *= Math.exp(rr * dt);
    const portVal = cash + shares * Spath[i] - callVals[i];
    hedgePnl = portVal;
    hedgePath.push(+hedgePnl.toFixed(2));
  }
  const unhedged = Spath.map((_, i) => +(callVals[0] - callVals[i]).toFixed(2));
  const days = Spath.map((_, i) => i);

  const hedgeData = [
    { x: days, y: unhedged, type: "scatter", mode: "lines", name: "Short call TANPA hedge", line: { color: "#ef4444", width: 2 } },
    { x: days, y: hedgePath, type: "scatter", mode: "lines", name: "Dengan delta-hedge harian", line: { color: "#2a7de1", width: 2 } },
  ];

  const lab1Code = String.raw`# P&L EXPLAIN opsi: dekomposisi P&L harian menjadi Greeks x pergerakan.
# dV ~ delta*dS + 0.5*gamma*(dS)^2 + vega*dVol + theta*dt
# Portofolio: LONG 100 kontrak call ATM (tiap kontrak = 1 unit di sini)

import math

def N(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))

S0, K, T, r, vol = 100.0, 100.0, 30/365, 0.05, 0.30
n_pos = 100  # long 100 call

d1 = (math.log(S0/K) + (r + 0.5*vol**2)*T) / (vol*math.sqrt(T))
d2 = d1 - vol*math.sqrt(T)
delta = N(d1)
n_d1 = math.exp(-0.5*d1*d1) / math.sqrt(2*math.pi)
gamma = n_d1 / (S0 * vol * math.sqrt(T))
vega = S0 * n_d1 * math.sqrt(T) / 100          # per 1% vol
theta = -(S0 * n_d1 * vol / (2*math.sqrt(T)) + r*K*math.exp(-r*T)*N(d2)) / 365  # per hari

print(f"Greeks per kontrak: delta={delta:.3f} gamma={gamma:.4f} vega={vega:.3f} theta={theta:.3f}")

# Skenario kemarin: S 100->103, vol 30%->32%, 1 hari berlalu
dS, dVol, dt = 3.0, 2.0, 1.0
pnl_delta = n_pos * delta * dS
pnl_gamma = n_pos * 0.5 * gamma * dS**2
pnl_vega  = n_pos * vega * dVol
pnl_theta = n_pos * theta * dt
total = pnl_delta + pnl_gamma + pnl_vega + pnl_theta
print()
print(f"Kontribusi delta : {pnl_delta:+.1f}")
print(f"Kontribusi gamma : {pnl_gamma:+.1f}")
print(f"Kontribusi vega  : {pnl_vega:+.1f}  <- vol naik menguntungkan LONG call")
print(f"Kontribusi theta : {pnl_theta:+.1f}  <- waktu selalu menggerogoti")
print(f"Total prediksi   : {total:+.1f}")
print()
print("Coba: balik posisi jadi SHORT 100 (n_pos=-100). Greeks apa yang")
print("berbalik tanda? Kombinasi short call = 'terima theta, bayar gamma+vega'.")`;

  const lab2Code = String.raw`# SIMULASI DELTA-HEDGING: short 1 call ATM, hedge dgn saham, rebalance harian.
# Jika model benar & hedge sempurna -> P&L ~ 0 (kecuali error diskritisasi).
# Jika vol AKTUAL != vol MODEL -> P&L sistematis (inilah 'vega yang terealisasi').

import random, math
random.seed(42)

def N(x): return 0.5*(1+math.erf(x/math.sqrt(2)))
def bs_price(S,K,T,r,sig):
    if T<=0: return max(S-K,0)
    d1=(math.log(S/K)+(r+0.5*sig*sig)*T)/(sig*math.sqrt(T)); d2=d1-sig*math.sqrt(T)
    return S*N(d1)-K*math.exp(-r*T)*N(d2)
def bs_delta(S,K,T,r,sig):
    if T<=0: return 1.0 if S>K else 0.0
    d1=(math.log(S/K)+(r+0.5*sig*sig)*T)/(sig*math.sqrt(T)); return N(d1)

def run_hedge(vol_model, vol_real, days=60):
    S0,K,T0,r,dt=100.0,100.0,60/365,0.05,1/365
    S=S0; cash=bs_price(S0,K,T0,r,vol_model); shares=0.0  # terima premi, short call
    for i in range(1,days+1):
        u=random.gauss(0,1)
        S=S*math.exp((r-0.5*vol_real**2)*dt+vol_real*math.sqrt(dt)*u)
        T=max(T0-i*dt,1e-6)
        target=bs_delta(S,K,T,r,vol_model)
        cash-=(target-shares)*S; shares=target; cash*=math.exp(r*dt)
    call_T=max(S-K,0)
    return cash+shares*S-call_T  # P&L akhir short call ter-hedge

for vm, vr, label in [(0.30,0.30,"model=realita (30%)"),
                      (0.30,0.40,"realita LEBIH liar (40%)"),
                      (0.30,0.20,"realita LEBIH tenang (20%)")]:
    pnls=[run_hedge(vm,vr) for _ in range(300)]
    avg=sum(pnls)/len(pnls)
    print(f"{label:28s} rata-rata P&L hedge = {avg:+.2f}")
print()
print("Short call + delta hedge = SHORT vol terealisasi:")
print("untung jika pasar tenang (terima premi > biaya hedge), rugi jika liar.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR11 — Market Risk Analytics</span>
        <h1 className="display-title">Options Risk: Greeks,<br />Vol Surface, dan Seni Delta-Hedging</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Premi Kecil, Bencana Besar</a></li>
          <li><a href="#payoff">Payoff Opsi: Fondasi 2 Menit</a></li>
          <li><a href="#greeks">Greeks: Lima Derivatif yang Mengendalikan</a></li>
          <li><a href="#smile">Vol Surface: Senyum yang Membantah Black-Scholes</a></li>
          <li><a href="#hedge">Delta-Hedging: Menjinakkan Delta</a></li>
          <li><a href="#pnl">P&amp;L Explain untuk Opsi</a></li>
          <li><a href="#lab1">🔬 Lab 1: P&amp;L Explain per Greek</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Delta-Hedging</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: 1987 — Ketika Gamma Membunuh Asuransi Portofolio</a></li>
          <li><a href="#case">📋 Mini-Case: Short Vol yang &ldquo;Aman&rdquo;</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menggambarkan payoff call/put dan menjelaskan asimetri &ldquo;rugi terbatas, untung tak terbatas&rdquo; (long) vs sebaliknya (short).</li>
          <li>Mendefinisikan lima Greeks (delta, gamma, vega, theta, rho) sebagai turunan parsial dan menafsirkan tiap angka dalam keputusan hedging.</li>
          <li>Menjelaskan vol smile/surface dan mengapa ia membantah asumsi Black-Scholes — serta implikasinya untuk risiko.</li>
          <li>Mensimulasikan delta-hedging dan menjelaskan mengapa hedge tidak pernah sempurna (biaya, diskritisasi, vol salah).</li>
          <li>Menyusun P&amp;L explain opsi per Greek dan mendiagnosis sumber P&amp;L tak terduga.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Premi Kecil, Bencana Besar</h2>
      <div className="story">
        <p>Seorang trader menjual <strong>put options</strong> atas indeks saham — menerima premi Rp2 miliar per bulan. Strateginya &ldquo;terbukti&rdquo;: 11 bulan berturut-turut untung. Ia dijuluki &ldquo;mesin premi&rdquo;. Risk manager mencatat delta portofolionya <strong>kecil</strong> (terhedge) dan VaR-nya <strong>rendah</strong>.</p>
        <p>Bulan ke-12: indeks jatuh 8% dalam seminggu. Kerugian: <strong>Rp45 miliar</strong> — 22× premi tahunan. Investigasi: delta memang kecil, tapi <strong>gamma sangat negatif</strong> (short put = short gamma) dan <strong>vega sangat negatif</strong> (saat pasar jatuh, volatilitas meledak → harga put yang ia jual melonjak). VaR delta-only tidak melihat keduanya.</p>
        <p>Twist-nya: strategi &ldquo;mesin premi&rdquo; ini secara ekonomi setara <strong>menjual asuransi gempa</strong> — untung kecil tiap bulan, bangkrut saat gempa. Dan seperti semua penjual asuransi, ia <strong>short volatilitas</strong>: diuntungkan ketenangan, dibunuh keguncangan. Lesson ini membedah anatomi risiko opsi: Greeks sebagai organ tubuhnya, vol surface sebagai cermin pasar, dan delta-hedging sebagai upaya menjinakkannya.</p>
      </div>

      <h2 id="payoff">Payoff Opsi: Fondasi 2 Menit</h2>
      <p><strong>Definisi kilat</strong> (prasyarat 2 menit — selebihnya lesson ini self-contained):</p>
      <ul>
        <li><strong>Call:</strong> hak (bukan kewajiban) membeli di harga strike K. Payoff saat expiry: <Tex math={String.raw`\max(S_T - K, 0)`} />.</li>
        <li><strong>Put:</strong> hak menjual di K. Payoff: <Tex math={String.raw`\max(K - S_T, 0)`} />.</li>
        <li><strong>Long</strong> (beli): bayar premi; rugi terbatas (premi), untung tak terbatas (call). <strong>Short</strong> (jual): terima premi; untung terbatas (premi), rugi tak terbatas.</li>
      </ul>

      <PlotlyChart
        data={payoffData}
        title="Payoff Call & Put saat Expiry (K=100, long position)"
        layout={{ xaxis: { title: "Harga saham saat expiry (S)" }, yaxis: { title: "Payoff" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = harga saham saat expiry, sumbu-y = payoff. Biru = call (menanjak setelah 100), kuning = put (menurun menuju 100).</p>
        <p><strong>Interpretasi:</strong> perhatikan <strong>tekukan (kink)</strong> di S=100 — di sinilah non-linearitas lahir. Kink inilah yang membuat delta berubah-ubah (gamma), yang membuat VaR linear gagal (MR4), dan yang membuat opsi butuh <strong>full revaluation</strong>. Semua kerumitan Greeks berakar di satu tekukan ini.</p>
      </div>

      <h2 id="greeks">Greeks: Lima Derivatif yang Mengendalikan</h2>
      <p><strong>Definisi.</strong> Greeks adalah <strong>turunan parsial</strong> nilai opsi V terhadap tiap faktor:</p>
      <Tex math={String.raw`\Delta = \frac{\partial V}{\partial S}, \quad \Gamma = \frac{\partial^2 V}{\partial S^2}, \quad \mathcal{V} = \frac{\partial V}{\partial \sigma}, \quad \Theta = \frac{\partial V}{\partial t}, \quad \rho = \frac{\partial V}{\partial r}`} block />
      <p><strong>Tiap Greek — kepribadian &amp; intuisi:</strong></p>
      <ul>
        <li><strong>Delta (Δ):</strong> &ldquo;kecepatan&rdquo; — jika saham naik Rp1, opsi naik Δ rupiah. Call: 0 s/d 1; put: −1 s/d 0. <em>Hedge ratio</em>: short 1 call Δ=0,6 → beli 0,6 saham untuk netral.</li>
        <li><strong>Gamma (Γ):</strong> &ldquo;akselerasi&rdquo; — seberapa cepat delta berubah. Terbesar saat <strong>ATM &amp; dekat expiry</strong>. Long gamma = untung dari pergerakan besar (rem otomatis); short gamma = bencana saat pasar liar (MR4).</li>
        <li><strong>Vega (ν):</strong> sensitivitas ke <strong>volatilitas implisit</strong>. Long opsi = long vega (untung saat pasar panik &amp; vol naik). Terbesar untuk opsi <strong>ATM jangka panjang</strong>.</li>
        <li><strong>Theta (Θ):</strong> &ldquo;peluruhan waktu&rdquo; — opsi kehilangan nilai tiap hari (time decay). Long opsi: theta negatif (bayar tiap hari). Short opsi: theta positif (terima premi waktu). <strong>Theta vs gamma adalah trade-off abadi:</strong> tidak ada makan siang gratis — premi waktu (theta) dibayar dengan risiko pergerakan (gamma).</li>
        <li><strong>Rho (ρ):</strong> sensitivitas ke suku bunga. Biasanya terkecil — sering diabaikan kecuali opsi jangka sangat panjang.</li>
      </ul>

      <PlotlyChart
        data={deltaData}
        title="Delta Call: Evolusi Menuju Expiry (K=100)"
        layout={{ xaxis: { title: "Waktu ke expiry (tahun)" }, yaxis: { title: "Delta" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = sisa waktu (kanan = jauh dari expiry, kiri = dekat). Tiga garis = call ITM/ATM/OTM.</p>
        <p><strong>Interpretasi:</strong> jauh dari expiry, delta berubah <strong>halus</strong> (gamma kecil). Mendekati expiry, delta ATM <strong>menukik tajam</strong> — gamma meledak. <strong>Inilah bahaya &ldquo;pin risk&rdquo;:</strong> opsi ATM yang besok expiry punya gamma raksasa; hedging-nya butuh rebalance terus-menerus dan mahal. Short gamma di sini = duduk di atas bom waktu.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan <strong>pasangan trade-off</strong>: <strong>theta vs gamma</strong> (terima premi waktu ↔ bayar risiko pergerakan) dan <strong>delta vs gamma</strong> (netral arah ↔ eksposur percepatan). Setiap strategi opsi adalah pilihan di antara trade-off ini — tidak ada posisi yang &ldquo;untung semua&rdquo;. Kalau ada yang terlihat untung semua, kamu belum menemukan Greek yang negatif.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Delta-neutral = tidak ada risiko.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> delta-neutral hanya mematikan <strong>orde-1</strong>. Masih hidup: gamma (orde-2), vega (vol), theta (waktu). Portofolio delta-neutral tapi short gamma + short vega = <strong>bom waktu yang terlihat aman</strong> — persis strategi &ldquo;mesin premi&rdquo; di cerita pembuka. Selalu tanya: &ldquo;netral terhadap apa — dan ekspos ke apa?&rdquo;</p>
      </div>

      <h2 id="smile">Vol Surface: Senyum yang Membantah Black-Scholes</h2>
      <p><strong>Definisi.</strong> <strong>Implied volatility (IV)</strong> = volatilitas yang membuat harga Black-Scholes <em>sama</em> dengan harga pasar. Jika asumsi BS benar (vol konstan), IV harus <strong>sama untuk semua strike &amp; tenor</strong>. Kenyataannya:</p>

      <PlotlyChart
        data={smileData}
        title="Volatility Smile: IV vs Strike (tenor sama)"
        layout={{ xaxis: { title: "Strike" }, yaxis: { title: "Implied vol (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = strike, sumbu-y = implied vol. Kurva membentuk <strong>senyum (smile)</strong> — IV lebih tinggi di strike jauh (OTM/ITM dalam).</p>
        <p><strong>Interpretasi:</strong> pasar <strong>membayar lebih mahal</strong> untuk proteksi jauh (put OTM) daripada prediksi BS — karena pasar tahu <strong>ekor lebih tebal</strong> dari asumsi normal (ingat kurtosis, A1.4!). Smile yang miring (skew: put OTM lebih mahal dari call OTM) = pasar takut <strong>jatuh</strong> lebih dari takut naik — cerminan crash risk. <strong>Vol surface</strong> = smile ini untuk <em>semua</em> tenor sekaligus (permukaan 3D: strike × tenor × IV).</p>
      </div>

      <p><strong>Implikasi risiko:</strong></p>
      <ul>
        <li><strong>Vega tidak cukup:</strong> vega mengukur sensitivitas ke <em>pergeseran paralel</em> IV. Tapi smile bisa <strong>berubah bentuk</strong> (skew menajam saat panik) — butuh &ldquo;vega per strike&rdquo; (bucketed vega).</li>
        <li><strong>Sticky strike vs sticky delta:</strong> saat spot bergerak, apakah smile ikut bergerak (sticky strike) atau menempel di moneyness (sticky delta)? Asumsi yang salah → hedge vega salah.</li>
        <li><strong>Model risk:</strong> memakai BS dengan satu vol untuk semua strike = <strong>salah harga</strong> opsi jauh — dan salah ukur risikonya.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas implisit = prediksi pasar tentang volatilitas masa depan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> IV = <strong>harga risiko</strong> yang dinyatakan dalam satuan volatilitas — ia mencakup ekspektasi <em>plus</em> premi risiko (ketakutan). IV yang tinggi bisa berarti pasar berekspektasi gejolak <em>atau</em> pasar sangat takut sehingga membayar mahal untuk proteksi. Jangan baca IV sebagai ramalan murni.</p>
      </div>

      <h2 id="hedge">Delta-Hedging: Menjinakkan Delta</h2>
      <p><strong>Definisi.</strong> <strong>Delta-hedging</strong>: pegang <strong>−Δ unit saham</strong> per opsi untuk membuat portofolio <strong>delta-netral</strong> — kebal (orde-1) terhadap pergerakan kecil saham. Karena delta berubah terus (gamma!), hedge harus di-<strong>rebalance berkala</strong>.</p>
      <p><strong>Kenapa tidak pernah sempurna:</strong></p>
      <ol>
        <li><strong>Diskritisasi:</strong> teori = rebalance kontinu; praktik = harian/mingguan. Di antaranya, gamma bekerja liar.</li>
        <li><strong>Biaya transaksi:</strong> rebalance terus = biaya terus. Hedge sempurna = bangkrut oleh biaya.</li>
        <li><strong>Vol salah:</strong> delta dihitung dengan <strong>vol model</strong>; jika vol aktual beda → hedge ratio salah sistematis.</li>
        <li><strong>Gap/jump:</strong> saham bisa <em>melompat</em> (bukan bergerak kontinu) — delta-hedge tidak melindungi dari jump.</li>
      </ol>
      <p><strong>Hasil fundamental:</strong> P&amp;L portofolio ter-delta-hedge ≈ <strong>theta − biaya gamma yang terealisasi</strong>. Short call ter-hedge = <strong>short volatilitas terealisasi</strong>: untung jika pasar tenang (theta &gt; biaya hedge), rugi jika liar. (Buktikan di Lab 2.)</p>

      <PlotlyChart
        data={hedgeData}
        title="Simulasi: Short Call Tanpa vs Dengan Delta-Hedge Harian"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "P&L kumulatif" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> merah = P&amp;L short call tanpa hedge (liar mengikuti saham); biru = dengan delta-hedge harian.</p>
        <p><strong>Interpretasi:</strong> hedging <strong>meredam drastis</strong> ayunan P&amp;L — tapi tidak menghilangkannya. Sisa ayunan biru = <strong>hedging error</strong> (gamma antar rebalance + vol tidak tepat). <strong>Pelajaran:</strong> delta-hedging mengubah risiko <em>arah</em> menjadi risiko <em>volatilitas</em> — bukan menghilangkannya. Pertanyaannya bergeser dari &ldquo;ke mana saham bergerak?&rdquo; menjadi &ldquo;seberapa liar pergerakannya vs ekspektasi?&rdquo;</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> delta-hedging seperti <strong>menyeimbangkan sapu di telapak tangan</strong> — bisa, tapi butuh koreksi terus-menerus, dan makin tegak (mendekati expiry, gamma besar) makin sulit. Biaya &ldquo;koreksi&rdquo; inilah yang dimakan theta. Strategi short-vol yang &ldquo;untung stabil&rdquo; sebenarnya <strong>memungut premi kecil sambil menanggung risiko koreksi raksasa sesekali</strong>.</p>
      </div>

      <h2 id="pnl">P&amp;L Explain untuk Opsi</h2>
      <p><strong>Definisi.</strong> P&amp;L harian opsi didekomposisi per Greek:</p>
      <Tex math={String.raw`\Delta V \approx \underbrace{\Delta \cdot \Delta S}_{\text{arah}} + \underbrace{\tfrac{1}{2}\Gamma(\Delta S)^2}_{\text{kelengkungan}} + \underbrace{\mathcal{V} \cdot \Delta\sigma}_{\text{vol}} + \underbrace{\Theta \cdot \Delta t}_{\text{waktu}} + \underbrace{\rho \cdot \Delta r}_{\text{rate}}`} block />
      <p><strong>Cara pakai untuk diagnosis:</strong></p>
      <ul>
        <li>P&amp;L aktual ≈ prediksi → model &amp; data sehat.</li>
        <li><strong>Unexplained besar</strong> → kandidat: smile berubah bentuk (vega bucket salah), jump (gamma tak tertangkap), data vol basi, atau biaya transaksi tak tercatat.</li>
        <li><strong>Theta positif tapi P&amp;L negatif persisten</strong> → gamma/vega sedang &ldquo;memakan&rdquo; theta — strategi short-vol yang mulai berdarah.</li>
      </ul>

      <h2 id="lab1">🔬 Lab 1: P&amp;L Explain per Greek</h2>
      <p>Ubah skenario (misal dS=−5, dVol=+5: pasar jatuh + panik). Greek mana yang mendominasi untuk LONG call? Bandingkan dengan SHORT.</p>
      <PyodideLab
        title="Lab 1 — Dekomposisi P&L Opsi per Greek"
        hint="Coba skenario 'krisis': dS=-8, dVol=+10. Untuk LONG call: delta rugi TAPI vega untung besar — siapa menang? Itulah mengapa long opsi = 'asuransi'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Delta-Hedging</h2>
      <p>Ubah vol_real (0,2 / 0,3 / 0,4). Amati P&amp;L rata-rata hedge: kapan short call ter-hedge untung vs rugi?</p>
      <PyodideLab
        title="Lab 2 — Delta-Hedging: Short Vol Terealisasi"
        hint="Coba vol_real=0.50 (krisis): P&L rata-rata negatif BESAR. Inilah mekanisme kebangkrutan 'mesin premi' — model menjual vol 30%, realita memberi 50%."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Eksposur arah (naik/turun) → <strong>Delta</strong> (hedge dengan underlying)</h3>
        <p><strong>Kondisi:</strong> pertanyaan &ldquo;bagaimana jika saham ±5%?&rdquo;</p>
        <p><strong>Alasan:</strong> orde-1, termurah di-hedge. Tapi ingat: delta berubah (gamma) — hedge butuh maintenance.</p>
      </div>

      <div className="decision-card">
        <h3>2. Eksposur pergerakan besar / dekat expiry → <strong>Gamma</strong> (limit + hedge dengan opsi lain)</h3>
        <p><strong>Kondisi:</strong> |Γ| besar, terutama short gamma.</p>
        <p><strong>Alasan:</strong> tidak bisa di-hedge dengan saham (butuh instrumen ber-gamma: opsi lain). <strong>Limit gamma wajib</strong> untuk desk derivatif — VaR delta-only tidak cukup.</p>
      </div>

      <div className="decision-card">
        <h3>3. Eksposur perubahan volatilitas → <strong>Vega</strong> (bucketed per strike/tenor)</h3>
        <p><strong>Kondisi:</strong> portofolio opsi besar; pasar stres (smile berubah bentuk).</p>
        <p><strong>Alasan:</strong> vega paralel tidak menangkap perubahan skew. Untuk eksposur besar, butuh vega per bucket strike×tenor.</p>
      </div>

      <div className="decision-card">
        <h3>4. Strategi &ldquo;terima premi&rdquo; (short vol) → <strong>Uji skenario gamma+vega, bukan cuma VaR</strong></h3>
        <p><strong>Kondisi:</strong> menjual opsi/proteksi untuk premi.</p>
        <p><strong>Alasan:</strong> VaR (terutama delta-only) sistematis meremehkan short-vol. Wajib: stress &ldquo;gap ±8% + vol +15 poin&rdquo; eksplisit + limit gamma/vega terpisah.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Delta</strong> = arah (hedge murah). <strong>Gamma</strong> = percepatan (limit wajib). <strong>Vega</strong> = vol (bucketed). <strong>Theta</strong> = harga waktu.</li>
          <li><strong>Theta vs gamma</strong> selalu trade-off — cari Greek yang negatif.</li>
          <li>Short vol yang &ldquo;aman&rdquo; menurut VaR = <strong>bendera merah</strong> — uji skenario ekstrem eksplisit.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: 1987 — Ketika Gamma Membunuh Asuransi Portofolio</h2>
      <p><strong>19 Oktober 1987 — Black Monday.</strong> Dow Jones jatuh <strong>−22,6% dalam sehari</strong>, kejatuhan harian terbesar dalam sejarah. Salah satu pemicunya: strategi <strong>portfolio insurance</strong> — yang secara matematis identik dengan <strong>short gamma dalam skala raksasa</strong>. Kisah ini adalah pelajaran gamma paling mahal yang pernah dibayar pasar.</p>

      <h3>Portfolio insurance: put sintetis untuk semua orang</h3>
      <p>Idenya elegan: replika payoff <em>protective put</em> (saham + put) dengan <strong>delta-hedging dinamis</strong> — jual saham (atau futures) saat pasar turun, beli kembali saat naik. Tanpa membeli opsi sungguhan, tanpa membayar premi. Dana pensiun dan institusi berbondong-bondong mengadopsinya; menjelang 1987, anekdot menyebut puluhan miliar dolar mengikuti strategi ini.</p>
      <p><strong>Cacat fatalnya</strong> — tiga asumsi yang runtuh bersamaan pada 19 Oktober:</p>
      <ol>
        <li><strong>Likuiditas kontinu:</strong> strategi berasumsi selalu bisa menjual futures dalam jumlah besar tanpa menggerakkan harga. Saat <em>semua</em> pengguna portfolio insurance menjual bersamaan, tidak ada pembeli — harga <strong>melompat</strong> (gap), bukan bergerak kontinu.</li>
        <li><strong>Gamma terkendali:</strong> replikasi put sintetis = <strong>short gamma</strong>: makin turun makin harus jual. Dalam kejatuhan −22,6%, kebutuhan jual meledak <strong>eksponensial</strong> — persis saat pasar paling tidak mampu menyerapnya.</li>
        <li><strong>Tidak ada umpan balik:</strong> model mengasumsikan trader adalah <em>pengamat</em> pasar. Kenyataannya mereka adalah <strong>bagian dari pasar</strong> — penjualan mereka menekan harga → memicu penjualan lebih banyak → <strong>spiral kematian</strong>.</li>
      </ol>
      <p>Hasilnya: portfolio insurance tidak melindungi — ia <strong>memperparah</strong> crash yang seharusnya ia asuransikan. Lahirlah <strong>volatility smile/skew</strong> pasca-1987: pasar tidak pernah lagi percaya distribusi lognormal Black-Scholes; put jauh OTM (proteksi crash) dihargai dengan implied vol jauh lebih tinggi — <strong>premi ketakutan permanen</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: spiral gamma dalam angka (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Dana Rp1 triliun memakai portfolio insurance (put sintetis ATM). Delta awal −0,5 → short futures Rp500 M. Gamma posisi ≈ <strong>−Rp40 M per 1%</strong> pergerakan (short gamma: delta makin negatif saat pasar turun).</p>
        <p><strong>Langkah 1 — pasar turun 5%:</strong> delta berubah: −0,5 → −0,5 − 5×0,04 = <strong>−0,70</strong>. Target short futures baru = Rp700 M → <strong>jual tambahan Rp200 M</strong> ke pasar yang sedang jatuh.</p>
        <p><strong>Langkah 2 — penjualan menekan pasar −3% lagi:</strong> delta → −0,82 → jual tambahan Rp120 M. Total tekanan jual dari strategi ini saja: Rp320 M.</p>
        <p><strong>Langkah 3 — kalikan dengan puluhan institusi</strong> yang melakukan hal sama: tekanan jual agregat mencapai <strong>triliunan rupiah ekuivalen</strong> — jauh melampaui daya serap pasar. Harga tidak &ldquo;menemukan keseimbangan&rdquo;; ia <strong>terjun bebas</strong> hingga circuit breaker / intervensi.</p>
        <p><strong>Angka ini artinya:</strong> short gamma individual terlihat terkendali (Rp40 M per 1% — kecil vs Rp1 T). Tapi gamma adalah <strong>risiko sistemik</strong>: ketika semua orang short gamma di sisi yang sama, kebutuhan hedging agregat menjadi <em>penyebab</em> pergerakan yang di-hedge. Inilah mengapa regulator dan risk manager memantau <strong>konsentrasi gamma</strong> pasar opsi (misal: dealer option positioning menjelang expiry).</p>
      </details>

      <h3>Warisan 1987: skew permanen dan pelajaran model</h3>
      <p>Tiga warisan yang masih hidup hingga kini:</p>
      <ul>
        <li><strong>Volatility skew:</strong> put OTM diperdagangkan dengan implied vol 5–15 poin <em>di atas</em> call OTM — pasar membayar premi untuk proteksi crash. Model yang mengabaikan skew (Black-Scholes polos) <strong>sistematis salah harga</strong> untuk opsi jauh dari ATM.</li>
        <li><strong>Jump-diffusion &amp; stochastic vol:</strong> model generasi berikutnya (Merton jump, Heston — MR15) lahir untuk menjelaskan fakta bahwa pasar <em>bisa melompat</em> dan vol <em>berubah-ubah</em>.</li>
        <li><strong>Circuit breaker:</strong> bursa memasang pemutus arus — jeda perdagangan saat jatuh terlalu cepat — untuk memutus spiral mekanis seperti 1987. (IHSG punya mekanisme serupa yang aktif Maret 2020.)</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi = leverage murah untuk spekulasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> dari sudut pandang <em>risiko</em>, opsi adalah <strong>paket Greeks</strong> — delta, gamma, vega, theta, rho — yang masing-masing bisa membunuhmu dengan cara berbeda. Spekulan yang &ldquo;beli call karena yakin naik&rdquo; tapi mengabaikan <strong>theta decay</strong> dan <strong>vega crush</strong> (vol turun setelah event) sering benar arahnya tapi tetap rugi. Di meja risiko, pertanyaan pertama bukan &ldquo;call atau put?&rdquo; melainkan <strong>&ldquo;eksposur Greek apa yang terbuka, dan berapa biayanya per hari?&rdquo;</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan &ldquo;neraca&rdquo; penjual opsi: <em>menerima theta (sewa waktu) setiap hari, membayar gamma setiap kali pasar bergerak liar</em>. Strategi ini untung 95% dari waktu dan rugi besar 5% sisanya — profil <strong>kebalikan</strong> dari pembeli opsi. Sebelum menjual volatilitas, tanyakan: <em>&ldquo;apakah premi yang saya terima cukup untuk satu hari seperti 19 Oktober 1987?&rdquo;</em> Jika jawabannya tidak — kamu bukan menjual asuransi, kamu <strong>memberikannya gratis</strong>.</p>
      </div>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Short 1 call ATM: delta −0,5, gamma −0,08 (per 1% move, dalam Rp jt), theta +Rp2 jt/hari. Saham naik 3% dalam sehari. Estimasi ΔV dan jelaskan komponennya. (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`\Delta V \approx \Delta \cdot \Delta S + \tfrac{1}{2}\Gamma(\Delta S)^2 + \Theta \cdot \Delta t`} />. Dalam Rp jt per 1% saham = Rp10 jt (asumsi saham Rp1.000):</p>
        <p>Delta: −0,5 × 3 × 10 = <strong>−Rp150 jt</strong>. Gamma: 0,5 × (−0,08) × 9 × 10 = <strong>−Rp36 jt</strong>. Theta: <strong>+Rp2 jt</strong>. Total ≈ <strong>−Rp184 jt</strong>.</p>
        <p><strong>Catatan:</strong> gamma <em>memperparah</em> kerugian (short gamma: rugi ke dua arah). Theta Rp2 jt tidak ada artinya vs Rp186 jt dari pergerakan — <strong>sehari liar menghapus 93 hari theta</strong>. Inilah profil short-vol: memungut receh di depan buldoser.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Mengapa portfolio insurance 1987 <em>memperparah</em> crash, bukan melindunginya? Jawab dengan 3 mekanisme. (klik untuk pembahasan)</summary>
        <p><strong>(1) Short gamma agregat:</strong> strategi = jual saat turun (makin turun makin banyak jual) — dalam crash −22,6%, kebutuhan jual meledak eksponensial. <strong>(2) Likuiditas ilusi:</strong> semua pengguna menjual <em>bersamaan</em> — tidak ada pembeli, harga gap bukan bergerak kontinu. <strong>(3) Umpan balik:</strong> penjualan menekan harga → memicu penjualan lebih banyak → spiral. Lindung nilai yang <em>menjadi penyebab</em> risiko yang dilindunginya = kegagalan desain, bukan kesialan.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Put OTM diperdagangkan pada implied vol 35%, call OTM setara pada 20%. Apa namanya? Apa yang dikatakannya tentang keyakinan pasar? (klik untuk pembahasan)</summary>
        <p><strong>Volatility skew</strong> (pasca-1987 permanen). Pasar membayar <strong>premi ketakutan</strong>: proteksi crash (put OTM) 15 poin lebih mahal dari spekulasi naik. Artinya pasar <em>tidak percaya</em> distribusi lognormal simetris — ia mengharapkan <strong>ekor kiri tebal</strong> (crash lebih mungkin/lebih dalam dari model normal). Model yang mengabaikan skew salah harga tepat di produk yang paling dibutuhkan saat krisis.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Short Vol yang &ldquo;Aman&rdquo;</h2>
      <div className="callout">
        <p>Desk menjual <strong>strangle</strong> (short call OTM + short put OTM) atas indeks, Rp50 miliar notional. Laporan risiko:</p>
        <ul>
          <li>Delta: <strong>+0,02</strong> (nyaris netral) — &ldquo;tidak ada risiko arah&rdquo;</li>
          <li>VaR 99% delta-only: <strong>Rp1,8 miliar</strong> — &ldquo;kecil&rdquo;</li>
          <li>Theta: <strong>+Rp45 juta/hari</strong> — &ldquo;mesin premi&rdquo;</li>
          <li>Data yang <em>tidak</em> di-highlight: gamma <strong>−Rp380 juta per (1%)²</strong>, vega <strong>−Rp210 juta per 1% vol</strong></li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Estimasi kerugian jika indeks gap −6% dan vol naik 12 poin dalam 2 hari. (b) Mengapa VaR menyesatkan di sini? (c) Rancang kerangka limit yang benar untuk desk ini.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Gamma:</strong> 0,5 × (−380 jt) × 36 = <strong>−Rp6,84 M</strong>. <strong>Vega:</strong> −210 jt × 12 = <strong>−Rp2,52 M</strong>. <strong>Theta 2 hari:</strong> +Rp90 jt (tidak berarti). <strong>Total ≈ −Rp9,3 M</strong> — lebih dari <strong>5× VaR</strong> yang dilaporkan. Dan ini skenario wajar, bukan kiamat.</p>
          <p>(b) VaR <strong>delta-only</strong> mengasumsikan linearitas — untuk strangle short, risiko <em>justru</em> ada di orde-2 (gamma) dan vol (vega) yang diabaikan. Delta kecil + VaR kecil = <strong>ilusi keamanan</strong> yang sistematis untuk strategi short-vol.</p>
          <p>(c) <strong>Kerangka limit:</strong> (1) limit <strong>gamma</strong> terpisah (Rp per 1%²); (2) limit <strong>vega</strong> terpisah (per 1% vol, bucketed); (3) <strong>stress limit</strong> eksplisit: &ldquo;gap ±8% + vol +15&rdquo; tidak boleh rugi &gt; RpX; (4) VaR <strong>full-revaluation</strong> (bukan delta-only); (5) <strong>stop-loss</strong> berbasis kerugian aktual. Tanpa ini, &ldquo;mesin premi&rdquo; = menunggu bencana.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Portofolio delta-neutral, short gamma besar, short vega besar. Profil risikonya?"
        options={[
          "Aman — delta sudah netral",
          "Bom waktu: rugi kuadratik saat pasar bergerak besar (gamma) + rugi saat vol naik (vega) — persis 'mesin premi' yang menunggu bencana",
          "Untung pasti dari theta",
          "Tidak ada risiko sama sekali",
        ]}
        correct={1}
        explanation="Benar. Delta-neutral hanya mematikan orde-1. Short gamma + short vega = eksposur ke dua hal yang terjadi BERSAMAAN saat krisis (pasar jatuh + vol meledak)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Long call ATM. Suku bunga naik (S & vol tetap). Efek ke nilai opsi? (Rho call positif)"
        options={[
          "Turun",
          "Naik sedikit — rho call positif tapi kecil; efeknya minor dibanding delta/gamma/vega",
          "Tidak berubah",
          "Naik besar",
        ]}
        correct={1}
        explanation="Benar. Rho ada tapi biasanya terkecil di antara Greeks — kecuali opsi jangka sangat panjang. Jangan abaikan total, tapi jangan fokus di sini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Vol smile menunjukkan put OTM jauh lebih mahal (IV tinggi) dari call OTM. Artinya?"
        options={[
          "Pasar salah harga",
          "Pasar membayar premi lebih untuk proteksi jatuh — mencerminkan crash risk / ekor tebal kiri yang tak ditangkap Black-Scholes",
          "Put selalu lebih mahal dari call",
          "Volatilitas akan turun",
        ]}
        correct={1}
        explanation="Benar. Skew = harga ketakutan. Pasar tahu distribusi return berekor-tebal kiri (crash) — BS dengan vol konstan tidak tahu, makanya smile muncul."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Short call yang di-delta-hedge sempurna menghasilkan P&L ≈ 0. Jika vol AKTUAL > vol MODEL, P&L hedge akan?"
        options={[
          "Tetap nol",
          "Negatif sistematis — biaya rebalancing (gamma) melebihi theta yang diterima; short call ter-hedge = short vol terealisasi",
          "Positif sistematis",
          "Acak",
        ]}
        correct={1}
        explanation="Benar. P&L hedge = theta − biaya gamma aktual. Vol aktual lebih tinggi → biaya gamma lebih besar → rugi. Inilah cara 'volatility trading' bekerja: untung jika vol terealisasi < vol implisit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa delta-hedging tidak pernah sempurna di praktik?"
        options={[
          "Karena rumusnya salah",
          "Rebalance diskrit (bukan kontinu) + biaya transaksi + vol model bisa salah + gap/jump harga",
          "Karena trader malas",
          "Karena tidak ada saham",
        ]}
        correct={1}
        explanation="Benar. Empat sumber hedging error. Teori Black-Scholes mengasumsikan dunia ideal (kontinu, tanpa biaya, vol konstan) — dunia nyata melanggar semuanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Desk menjual opsi untuk 'pendapatan premi stabil'. Kontrol risiko yang WAJIB ada?"
        options={[
          "Cukup VaR delta-only — delta kecil berarti aman",
          "Limit gamma & vega terpisah + stress skenario gap+vol eksplisit + VaR full-revaluation — karena VaR linear buta terhadap short-vol",
          "Tidak perlu — premi stabil berarti aman",
          "Hanya stop-loss",
        ]}
        correct={1}
        explanation="Benar. Strategi short-vol adalah kasus klasik kegagalan VaR linear. Kerangka lengkap: limit orde-2, stress eksplisit, dan full revaluation — bukan sekadar angka VaR."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Payoff opsi non-linear</strong> (kink di strike) = akar semua kerumitan: gamma, kegagalan VaR linear, butuh full revaluation.</li>
          <li><strong>Greeks:</strong> Δ arah, Γ percepatan (terbesar ATM ~expiry), ν volatilitas, Θ peluruhan waktu, ρ suku bunga (kecil).</li>
          <li><strong>Theta vs gamma</strong> = trade-off abadi; cari Greek yang negatif di setiap strategi &ldquo;menang semua&rdquo;.</li>
          <li><strong>Vol smile/surface</strong> = pasar membayar lebih untuk proteksi ekor — bantahan empiris atas BS; butuh bucketed vega.</li>
          <li><strong>Delta-hedging</strong> mengubah risiko arah → risiko vol; tidak pernah sempurna (diskrit, biaya, vol salah, jump).</li>
          <li><strong>P&amp;L explain per Greek</strong> = alat diagnosis; unexplained = smile berubah / jump / data basi.</li>
          <li>Short-vol yang &ldquo;aman&rdquo; menurut VaR = <strong>bendera merah</strong> — wajib stress eksplisit + limit gamma/vega.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr10-irrbb" className="btn btn-secondary btn-sm">← MR10</Link>
        <Link href="/learn/mr12-fx-komoditas" className="btn btn-primary btn-sm">Next: MR12 →</Link>
      </div>
    </div>
  );
}
