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

export default function MR3Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Distribusi P&L simulasi: bandingkan VaR 95% vs 99%, tunjukkan ekor
  const r = rng(21);
  const N = 2000;
  const pnl: number[] = [];
  for (let i = 0; i < N; i++) {
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5;
    const tail = r() < 0.03 ? (r() < 0.6 ? -1 : 1) * (8 + r() * 8) : 0;
    pnl.push(+((u * 4 + tail)).toFixed(2));
  }
  const sorted = [...pnl].sort((a, b) => a - b);
  const var95 = sorted[Math.floor(0.05 * N)];
  const var99 = sorted[Math.floor(0.01 * N)];
  // histogram
  const bins = 40;
  const min = -30, max = 30;
  const counts = new Array(bins).fill(0);
  pnl.forEach((v) => {
    const b = Math.min(bins - 1, Math.max(0, Math.floor(((v - min) / (max - min)) * bins)));
    counts[b]++;
  });
  const centers = counts.map((_, i) => +((min + (i + 0.5) * (max - min)) / bins).toFixed(1));

  const distData = [
    { x: centers, y: counts, type: "bar", name: "Distribusi P&L", marker: { color: "#2a7de1" } },
  ];
  const distLayout: any = {
    xaxis: { title: "P&L harian (Rp juta)" },
    yaxis: { title: "Frekuensi" },
    showlegend: false,
    shapes: [
      { type: "line", x0: var95, x1: var95, y0: 0, y1: 130, line: { color: "#e8a838", width: 2, dash: "dash" } },
      { type: "line", x0: var99, x1: var99, y0: 0, y1: 130, line: { color: "#ef4444", width: 2, dash: "dash" } },
    ],
    annotations: [
      { x: var95, y: 120, text: `VaR 95% = ${var95}`, showarrow: false, font: { color: "#e8a838", size: 11 } },
      { x: var99, y: 105, text: `VaR 99% = ${var99}`, showarrow: false, font: { color: "#ef4444", size: 11 } },
    ],
  };

  const lab1Code = String.raw`import random, math
random.seed(7)

# Portofolio Rp10 miliar, beta 1 thd pasar. 500 hari return historis (dalam desimal).
rets = [random.gauss(0.0004, 0.012) for _ in range(480)]
rets += [random.gauss(-0.01, 0.035) for _ in range(20)]  # 20 hari krisis di ujung data
portofolio = 10_000_000_000

def percentile(xs, p):
    s = sorted(xs)
    k = (len(s) - 1) * p
    f = math.floor(k)
    return s[f] + (s[f + 1] - s[f]) * (k - f)

# 1) HISTORICAL SIMULATION: VaR = kuantil kerugian historis
pnl_hist = [portofolio * rt for rt in rets]
var_hs_99 = -percentile(pnl_hist, 0.01)
print(f"[Historical] VaR 99%/1-hari = Rp {var_hs_99:,.0f}")

# 2) PARAMETRIC (variance-covariance): VaR = z * sigma * nilai
mean = sum(rets) / len(rets)
var_ = sum((x - mean) ** 2 for x in rets) / (len(rets) - 1)
sigma = math.sqrt(var_)
var_par_99 = 2.33 * sigma * portofolio
print(f"[Parametric] VaR 99%/1-hari = Rp {var_par_99:,.0f}  (z=2.33, sigma={sigma:.4f})")

# 3) MONTE CARLO: bangkitkan 10.000 skenario dari distribusi terestimasi
sims = [random.gauss(mean, sigma) * portofolio for _ in range(10_000)]
var_mc_99 = -percentile(sims, 0.01)
print(f"[MonteCarlo] VaR 99%/1-hari = Rp {var_mc_99:,.0f}")

print()
print("Bandingkan ketiganya. Lalu UBAH: pindahkan 20 hari krisis ke TENGAH")
print("data (bukan di ujung). Apakah Historical VaR berubah? Kenapa?")`;

  const lab2Code = String.raw`import math
# Scaling horizon: VaR(T) = VaR(1d) * sqrt(T)  -- dengan ASUMSI i.i.d.
var_1d = 470_000_000  # Rp470 jt, VaR 99% 1-hari (dari Lab 1, misal)

print("Horizon      VaR (sqrt-T scaling)")
for T, label in [(1, "1 hari"), (10, "10 hari (standar Basel)"), (20, "1 bulan"), (250, "1 tahun")]:
    print(f"{label:22s} Rp {var_1d * math.sqrt(T):>15,.0f}")

print()
print("UJI ASUMSI: return tidak i.i.d. saat volatilitas berkelompok.")
print("Jika ada autokorelasi positif rho=0.1, faktor skala bukan sqrt(T)")
print("melainkan sqrt(T + 2*rho*T*(T-1)/2 ...) -> LEBIH BESAR.")
print()
T = 10
for rho in [0.0, 0.1, 0.2]:
    # variansi jumlah T return berkorelasi: T + 2*rho * T*(T-1)/2
    faktor = math.sqrt(T + 2 * rho * T * (T - 1) / 2) / math.sqrt(T)
    print(f"rho={rho}: VaR 10-hari sebenarnya = {faktor:.2f}x dari sqrt-T scaling")
print()
print("Pelajaran: sqrt-T MEREMEHKAN risiko jika return berkorelasi positif")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR3 — Market Risk Analytics</span>
        <h1 className="display-title">VaR: Tiga Cara Mengukur<br />Kerugian Terburuk yang &ldquo;Wajar&rdquo;</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Angka yang Menidurkan Direksi</a></li>
          <li><a href="#definisi">Definisi VaR: Kuantil Kerugian</a></li>
          <li><a href="#hs">Metode 1: Historical Simulation</a></li>
          <li><a href="#param">Metode 2: Parametrik (Variance-Covariance)</a></li>
          <li><a href="#mc">Metode 3: Monte Carlo</a></li>
          <li><a href="#scaling">Scaling Horizon: Aturan Akar Waktu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Tiga Metode, Satu Portofolio</a></li>
          <li><a href="#lab2">🔬 Lab 2: Menguji Aturan Akar Waktu</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metode Mana, Kapan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: VaR Bisa Menghukum Diversifikasi — Pelajaran LTCM 1998</a></li>
          <li><a href="#case">📋 Mini-Case: VaR Hijau, Bank Jebol</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan VaR sebagai kuantil distribusi kerugian dan menafsirkan &ldquo;VaR 99%/1-hari = RpX&rdquo; dengan tepat (termasuk apa yang <strong>tidak</strong> dikatakannya).</li>
          <li>Menghitung VaR dengan tiga metode (historical, parametrik, Monte Carlo) dan menjelaskan asumsi + kelemahan masing-masing.</li>
          <li>Menerapkan scaling horizon <Tex math={String.raw`\sqrt{T}`} /> dan mengidentifikasi kapan aturan ini menyesatkan.</li>
          <li>Memilih metode VaR yang tepat untuk jenis portofolio (linear vs non-linear, data cukup vs tidak).</li>
          <li>Menghindari tiga jebakan klasik: VaR sebagai &ldquo;batas rugi maksimal&rdquo;, VaR tanpa horizon, dan VaR dari model yang tidak di-backtest.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Angka yang Menidurkan Direksi</h2>
      <div className="story">
        <p>2007. Sebuah bank investasi melaporkan ke direksi: <strong>&ldquo;VaR 99% harian kami $50 juta.&rdquo;</strong> Direksi tenang — artinya, pada 99 hari dari 100, kerugian tidak melebihi $50 juta. Angka itu kecil dibanding modal $10 miliar. Rapat selesai dalam 20 menit.</p>
        <p>Setahun kemudian bank itu kolaps dengan kerugian <strong>miliaran dolar dalam hitungan minggu</strong>. Apa yang salah? Bukan hitungannya — VaR-nya benar secara matematis. Yang salah adalah <strong>cara angka itu dibaca</strong>: direksi mengira VaR = &ldquo;kerugian maksimal&rdquo;. Padahal VaR diam tentang satu pertanyaan paling penting: <em>pada 1 hari dari 100 itu — saat VaR terlampaui — seberapa dalam jurangnya?</em></p>
        <p>Twist-nya lebih pahit: VaR mereka dihitung dari <strong>data masa tenang</strong>. Model mengasumsikan masa depan akan seperti masa lalu yang manis. Ketika korelasi antar aset melonjak di tengah krisis (diversifikasi yang selama ini &ldquo;melindungi&rdquo; tiba-tiba menguap), VaR menjadi <strong>angka yang menidurkan, bukan membangunkan</strong>.</p>
        <p>Lesson ini membedah VaR sampai ke akarnya: tiga cara menghitungnya, kapan tiap cara berbohong, dan apa yang harus selalu ditanyakan setelah melihat angkanya.</p>
      </div>

      <h2 id="definisi">Definisi VaR: Kuantil Kerugian</h2>
      <p><strong>Definisi.</strong> <strong>Value at Risk (VaR)</strong> pada tingkat kepercayaan <Tex math={String.raw`\alpha`} /> dan horizon <Tex math={String.raw`T`} /> adalah <strong>ambang kerugian</strong> yang hanya terlampaui dengan probabilitas <Tex math={String.raw`1-\alpha`} />:</p>
      <Tex math={String.raw`\text{VaR}_\alpha = -\inf\{x : P(L > x) \le 1-\alpha\}`} block />
      <p>Versi yang lebih bersahabat — VaR adalah <strong>kuantil</strong> distribusi P&amp;L:</p>
      <Tex math={String.raw`\text{VaR}_{99\%} = -\text{kuantil}_{1\%}(\text{P\&L})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`L`} />: kerugian (loss) — positif berarti rugi</li>
        <li><Tex math={String.raw`\alpha`} />: tingkat kepercayaan (99%, 95%, 97,5%)</li>
        <li><Tex math={String.raw`T`} />: horizon (1 hari, 10 hari) — VaR tanpa horizon tidak bermakna</li>
        <li>Tanda negatif: VaR dilaporkan sebagai <strong>angka positif</strong> = besarnya kerugian ambang</li>
      </ul>
      <p><strong>Cara baca yang benar:</strong> &ldquo;VaR 99%/1-hari = Rp470 juta&rdquo; artinya: <em>besok, ada 99% peluang kerugian ≤ Rp470 juta — dan 1% peluang kerugian LEBIH BESAR dari itu, entah seberapa besar</em>. Frasa terakhir itulah yang paling sering dilupakan — dan paling mematikan.</p>

      <PlotlyChart
        data={distData}
        title="Distribusi P&L dan VaR (simulasi 2.000 hari)"
        layout={distLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> histogram = distribusi P&amp;L harian (Rp juta). Garis kuning putus-putus = VaR 95%, garis merah = VaR 99%. Area di <strong>kiri garis merah</strong> = 1% hari terburuk.</p>
        <p><strong>Interpretasi:</strong> VaR 99% hanya menandai <em>batas</em> 1% ekor — ia tidak memberi tahu <strong>bentuk ekornya</strong>: apakah ekornya pendek (rugi sedikit di atas VaR) atau panjang (rugi 5× VaR). Perhatikan batang-batang kecil jauh di kiri: itulah yang VaR sembunyikan. <strong>Untuk melihat ke dalam ekor, butuh Expected Shortfall (MR5).</strong></p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR = kerugian maksimal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR adalah <strong>ambang yang terlampaui 1% dari waktu</strong> — bukan batas atas. Kerugian bisa (dan pernah, berkali-kali dalam sejarah) jauh melampaui VaR. Analis yang melaporkan VaR tanpa menyebut &ldquo;dan jika terlampaui, ekspektasi kerugiannya sebesar X (ES)&rdquo; baru menyampaikan setengah cerita.</p>
      </div>

      <h2 id="hs">Metode 1: Historical Simulation — Biarkan Masa Lalu Berbicara</h2>
      <p><strong>Definisi.</strong> Ambil <Tex math={String.raw`N`} /> hari return historis, terapkan ke portofolio <em>saat ini</em> (seolah tiap skenario historis terjadi besok), lalu ambil kuantilnya:</p>
      <Tex math={String.raw`\text{VaR}^{HS}_{99\%} = -\text{kuantil}_{1\%}\{V_0 \cdot r_1, V_0 \cdot r_2, \dots, V_0 \cdot r_N\}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`V_0`} /> = nilai portofolio kini; <Tex math={String.raw`r_i`} /> = return historis hari-i. Tiap hari historis menjadi satu &ldquo;skenario besok&rdquo;.</p>
      <p><strong>Kepribadian HS:</strong> ia seperti <em>sejarawan yang jujur tapi buta masa depan</em> — tidak mengasumsikan bentuk distribusi apa pun (non-parametrik, menangkap fat tail &amp; skew asli data), tapi <strong>tidak bisa membayangkan apa yang belum pernah terjadi</strong>. Krisis yang belum ada di jendela data = tidak ada di VaR.</p>
      <p><strong>Kelebihan:</strong> sederhana, transparan, menangkap non-normalitas empiris, mudah dijelaskan ke direksi/non-kuant.</p>
      <p><strong>Kelemahan:</strong> butuh data panjang (250+ hari); sensitif ke pilihan jendela (isu MR2: &ldquo;ghost effect&rdquo; — hari krisis yang keluar dari jendela membuat VaR anjlok tiba-tiba); tidak bisa untuk instrumen baru tanpa histori.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> HS menjawab &ldquo;bagaimana jika <em>tepat</em> hari-hari kemarin terulang besok, dengan portofolioku yang sekarang?&rdquo;. Kekuatan sekaligus kelemahannya ada di kata <em>tepat</em> — ia tidak menggeneralisasi, tidak mengekstrapolasi. Untuk risiko yang belum pernah terlihat, HS diam seribu bahasa.</p>
      </div>

      <h2 id="param">Metode 2: Parametrik — Asumsi Normal, Hitungan Kilat</h2>
      <p><strong>Definisi.</strong> Asumsikan return <strong>berdistribusi normal</strong> dengan volatilitas <Tex math={String.raw`\sigma`} />, lalu VaR tinggal mengalikan:</p>
      <Tex math={String.raw`\text{VaR}_{99\%} = z_{0{,}99} \cdot \sigma \cdot V_0 = 2{,}33 \cdot \sigma \cdot V_0`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`z_{0{,}99} = 2{,}33`} /> = kuantil 1% distribusi normal standar (untuk 95%: 1,65); <Tex math={String.raw`\sigma`} /> = volatilitas harian (dari MR2: rolling/EWMA); <Tex math={String.raw`V_0`} /> = nilai portofolio.</p>
      <p>Untuk portofolio multi-aset dengan vektor sensitivitas/bobot <Tex math={String.raw`w`} /> dan matriks kovarians <Tex math={String.raw`\Sigma`} />:</p>
      <Tex math={String.raw`\text{VaR}_{99\%} = 2{,}33 \cdot \sqrt{w^T \Sigma w} \cdot V_0`} block />
      <p><strong>Kepribadian parametrik:</strong> ia seperti <em>kalkulator yang super cepat tapi memakai kacamata normal</em> — hitungan instan, agregasi portofolio elegan (cukup matriks kovarians), tapi <strong>buta terhadap fat tail</strong>. Return pasar nyata punya ekor lebih tebal dari normal (kurtosis &gt; 0, ingat A1.4) — VaR parametrik sistematis <strong>meremehkan</strong> kejadian ekstrem.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Portofolio Rp200 miliar, volatilitas harian σ = 1,2% (dari EWMA).</p>
        <p><strong>Langkah 1</strong> — ambil z: untuk 99%, z = 2,33.</p>
        <p><strong>Langkah 2</strong> — kalikan: VaR = 2,33 × 0,012 × 200 M = <strong>Rp5,592 miliar</strong>.</p>
        <p><strong>Langkah 3</strong> — tafsirkan: &ldquo;99% peluang rugi besok ≤ Rp5,6 M.&rdquo; Lalu <strong>wajib</strong> tanya: apakah return aset ini benar-benar normal? (Cek kurtosis — kalau &gt; 3, angka ini underestimate.)</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR parametrik 99% memakai z = 2,33 selalu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 2,33 hanya benar jika return <strong>normal</strong>. Untuk distribusi ber-ekor-tebal, kuantil 1% yang benar bisa 3–4σ. Praktik yang lebih jujur: pakai <strong>Cornish-Fisher VaR</strong> (koreksi skew/kurtosis) atau akui bahwa VaR parametrik adalah <em>aproksimasi cepat</em>, bukan kebenaran.</p>
      </div>

      <h2 id="mc">Metode 3: Monte Carlo — Bangkitkan Ribuan Masa Depan</h2>
      <p><strong>Definisi.</strong> Alih-alih memakai histori apa adanya (HS) atau asumsi normal (parametrik), kita <strong>membangkitkan ribuan skenario</strong> dari model stokastik, menilai ulang portofolio di tiap skenario (full revaluation), lalu ambil kuantilnya.</p>
      <p><strong>Model paling umum: GBM (Geometric Brownian Motion)</strong> — ringkasnya (dibahas penuh di MR15):</p>
      <Tex math={String.raw`S_{t+\Delta t} = S_t \cdot \exp\left[\left(\mu - \tfrac{1}{2}\sigma^2\right)\Delta t + \sigma\sqrt{\Delta t}\,Z\right], \quad Z \sim N(0,1)`} block />
      <p><strong>Artinya:</strong> harga besok = harga kini × faktor acak; <Tex math={String.raw`Z`} /> = bilangan acak normal standar (satu &ldquo;dadu&rdquo; per skenario); <Tex math={String.raw`\mu, \sigma`} /> = drift &amp; volatilitas terestimasi. Tiap skenario = satu lemparan dadu masa depan.</p>
      <p><strong>Kepribadian Monte Carlo:</strong> ia seperti <em>penulis skenario yang imajinatif tapi mahal</em> — bisa menangani <strong>instrumen non-linear</strong> (opsi!) dengan full revaluation, bisa memasukkan korelasi antar faktor via dekomposisi Cholesky, tapi <strong>butuh puluhan ribu simulasi</strong> (komputasi berat) dan kualitasnya <strong>hanya sebaik modelnya</strong> (sampah masuk → sampah keluar).</p>
      <p><strong>Kapan wajib Monte Carlo:</strong> portofolio mengandung opsi/derivatif non-linear (aproksimasi delta saja tidak cukup — lihat MR4/MR11). <strong>Kapan overkill:</strong> portofolio linear sederhana — HS/parametrik lebih cepat dan transparan.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga metode = tiga filosofi. <strong>HS:</strong> &ldquo;masa depan = masa lalu yang terpilih acak.&rdquo; <strong>Parametrik:</strong> &ldquo;masa depan = rumus.&rdquo; <strong>Monte Carlo:</strong> &ldquo;masa depan = ribuan dadu dari model.&rdquo; Analis yang dewasa tidak menikahi satu metode — ia <strong>membandingkan ketiganya</strong> dan curiga kalau hasilnya jauh berbeda (selisih besar = sinyal ada yang tidak beres dengan asumsi).</p>
      </div>

      <h2 id="scaling">Scaling Horizon: Aturan Akar Waktu</h2>
      <p><strong>Definisi.</strong> VaR 1-hari perlu diskalakan ke horizon regulasi (Basel: 10 hari). Dengan asumsi return <strong>i.i.d.</strong> (independen, identik):</p>
      <Tex math={String.raw`\text{VaR}(T) = \text{VaR}(1\text{ hari}) \times \sqrt{T}`} block />
      <p><strong>Kenapa akar?</strong> Variansi jumlah T return independen = T × variansi harian; standar deviasi = √T × σ harian. VaR ∝ σ, jadi VaR(T) = VaR(1d)·√T.</p>
      <p><strong>Kapan aturan ini berbohong:</strong></p>
      <ul>
        <li><strong>Autokorelasi positif</strong> (momentum/volatility clustering) → risiko tumbuh <em>lebih cepat</em> dari √T — scaling meremehkan.</li>
        <li><strong>Mean-reversion</strong> → risiko tumbuh <em>lebih lambat</em> — scaling melebih-lebihkan.</li>
        <li><strong>Portofolio tidak likuid</strong> → asumsi &ldquo;bisa keluar dalam T hari&rdquo; fiktif; butuh horizon likuiditas per posisi (FRTB memakai ini — MR16).</li>
      </ul>
      <div className="callout callout-warning">
        <p><strong>Jebakan √T:</strong> aturan ini mengasumsikan dunia i.i.d. — dunia yang tidak ada. Selalu sebutkan asumsi saat melaporkan VaR multi-hari, dan untuk portofolio illiquid pakai <strong>liquidity-adjusted horizon</strong>, bukan √T mentah.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Tiga Metode, Satu Portofolio</h2>
      <p>Jalankan ketiga metode pada data yang sama. Lalu uji sensitivitas: pindahkan 20 hari krisis dari ujung ke tengah data — metode mana yang berubah? Metode mana yang buta?</p>
      <PyodideLab
        title="Lab 1 — Historical vs Parametrik vs Monte Carlo"
        hint="Coba: ubah 20 hari krisis jadi 60 hari. Atau hapus krisis sama sekali (rets tanpa tail). Metode mana yang paling 'jujur' mengakui ketidakpastian? Tidak ada jawaban tunggal — catat trade-off-nya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Menguji Aturan Akar Waktu</h2>
      <p>Ubah <code className="inline">rho</code> (autokorelasi) dan lihat seberapa jauh √T meleset. Kapan regulator tetap memaksa √T meski asumsinya rapuh?</p>
      <PyodideLab
        title="Lab 2 — Kapan sqrt(T) Menyesatkan"
        hint="Coba rho negatif (−0.1, mean-reversion): VaR sebenarnya LEBIH KECIL dari sqrt-T. Jadi sqrt-T bukan selalu konservatif — ia bisa salah dua arah."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Metode Mana, Kapan</h2>

      <div className="decision-card">
        <h3>1. Portofolio linear (saham, obligasi biasa, FX spot), butuh cepat &amp; transparan → <strong>Historical Simulation</strong></h3>
        <p><strong>Kondisi:</strong> histori panjang tersedia; tidak ada instrumen non-linear material.</p>
        <p><strong>Alasan:</strong> tanpa asumsi distribusi, menangkap fat tail empiris, mudah diaudit. Waspadai ghost effect &amp; buta terhadap kejadian unprecedented.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh agregasi portofolio besar / alokasi modal per desk → <strong>Parametrik</strong></h3>
        <p><strong>Kondisi:</strong> portofolio linear; matriks kovarians tersedia (MR2).</p>
        <p><strong>Alasan:</strong> rumus tertutup <Tex math={String.raw`\sqrt{w^T\Sigma w}`} /> membuat dekomposisi per faktor/desk mudah (jembatan ke component VaR, MR4). Harga: asumsi normal — selalu cek kurtosis.</p>
      </div>

      <div className="decision-card">
        <h3>3. Ada opsi / derivatif non-linear material → <strong>Monte Carlo (full revaluation)</strong></h3>
        <p><strong>Kondisi:</strong> gamma/vega signifikan; payoff tidak linear.</p>
        <p><strong>Alasan:</strong> satu-satunya metode yang menilai ulang payoff eksak di tiap skenario. Harga: komputasi berat + risko model (model salah → VaR salah dengan percaya diri).</p>
      </div>

      <div className="decision-card">
        <h3>4. Horizon &gt; 1 hari → <strong>Scaling √T + uji asumsi</strong></h3>
        <p><strong>Kondisi:</strong> VaR 10-hari untuk modal; portofolio cukup likuid.</p>
        <p><strong>Alasan:</strong> √T adalah standar (Basel), tapi nyatakan asumsi i.i.d.-nya. Untuk posisi illiquid: pakai liquidity horizon, bukan √T.</p>
      </div>

      <div className="decision-card">
        <h3>5. Angka VaR untuk keputusan besar → <strong>Bandingkan ≥2 metode</strong></h3>
        <p><strong>Kondisi:</strong> laporan direksi, penetapan limit, alokasi modal.</p>
        <p><strong>Alasan:</strong> selisih besar antar metode = sinyal asumsi bermasalah. VaR yang tidak pernah dibandingkan = VaR yang tidak pernah diuji.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Selalu sebut <strong>tiga</strong> hal: tingkat kepercayaan, horizon, metode.</li>
          <li>VaR menjawab &ldquo;seberapa sering ambang terlampaui&rdquo; — <strong>bukan</strong> &ldquo;seberapa dalam jika terlampaui&rdquo; (itu ES, MR5).</li>
          <li>Kalau portofolio berubah (ada opsi baru), <strong>metode harus dievaluasi ulang</strong> — bukan datanya saja.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: VaR Bisa Menghukum Diversifikasi — Pelajaran LTCM 1998</h2>
      <p>VaR terlihat seperti jawaban final atas pertanyaan &ldquo;berapa risiko kita?&rdquo;. Bagian ini menunjukkan <strong>cacat struktural</strong> VaR yang paling berbahaya — ia bisa memberi angka <strong>lebih kecil</strong> untuk portofolio terkonsentrasi daripada portofolio terdiversifikasi — plus contoh nyata ketika keyakinan buta pada VaR menghancurkan sebuah institusi legendaris.</p>

      <h3>Contoh tangan: VaR historical dari 10 data</h3>
      <p>Sebelum membahas cacatnya, pastikan mekaniknya menempel. Sepuluh P&amp;L harian (Rp juta, sudah diurutkan dari terburuk):</p>
      <p><strong>−45, −30, −22, −15, −8, −2, +5, +12, +20, +28</strong></p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: VaR 90% dan 80% dari 10 observasi (klik untuk buka)</summary>
        <p><strong>Langkah 1 — pahami definisinya:</strong> VaR 90% = kerugian yang hanya dilampaui 10% dari waktu. Dari 10 observasi, 10% = <strong>1 observasi</strong> boleh lebih buruk.</p>
        <p><strong>Langkah 2 — VaR 90%:</strong> observasi terburuk ke-1 adalah −45. Maka <strong>VaR 90% = Rp45 juta</strong> — &ldquo;pada 9 dari 10 hari, kerugian tidak melebihi Rp45 juta.&rdquo;</p>
        <p><strong>Langkah 3 — VaR 80%:</strong> 20% dari 10 = 2 observasi boleh lebih buruk. Observasi terburuk ke-2 adalah −30. Maka <strong>VaR 80% = Rp30 juta</strong>.</p>
        <p><strong>Langkah 4 — perhatikan lompatannya:</strong> VaR meloncat dari 30 ke 45 juta hanya karena <strong>satu observasi ekstrem</strong> (−45). Dengan data sedikit, VaR sangat sensitif ke <em>satu titik data</em>. Inilah mengapa dalam praktik dipakai ratusan–ribuan observasi — dan mengapa <strong>backtesting</strong> (MR6) wajib: untuk memastikan kuantil yang kamu hitung bukan artefak sampel kecil.</p>
        <p><strong>Angka ini artinya:</strong> VaR bukan &ldquo;kerugian maksimum&rdquo; — ia adalah <strong>batas yang dilampaui dengan frekuensi tertentu</strong>. Pertanyaan yang tidak dijawab VaR: <em>jika batas itu terlampaui, seberapa dalam jatuhnya?</em> (Itu tugas ES di MR5.)</p>
      </details>

      <h3>Cacat struktural: VaR melanggar subadditivitas</h3>
      <p>Aksioma yang seharusnya dimiliki ukuran risiko waras: <strong>risiko gabungan ≤ jumlah risiko bagian-bagiannya</strong> (diversifikasi tidak boleh menambah risiko). Sifat ini disebut <strong>subadditivitas</strong>. VaR <strong>melanggarnya</strong> — dan ini bukan teori abstrak:</p>
      <p><strong>Contoh klasik.</strong> Dua obligasi korporasi, masing-masing: peluang default 4%, rugi Rp1 miliar jika default, independen satu sama lain.</p>
      <ul>
        <li>VaR 95% obligasi A <strong>saja</strong> = Rp0 (karena peluang rugi hanya 4% &lt; 5% — kuantil 95% jatuh di skenario &ldquo;tidak default&rdquo;).</li>
        <li>VaR 95% obligasi B <strong>saja</strong> = Rp0 (alasan sama).</li>
        <li>Portofolio A+B: peluang <strong>keduanya</strong> default = 0,04 × 0,04 = 0,16%... tapi peluang <strong>minimal satu</strong> default = 1 − 0,96² = 7,84% &gt; 5%. Maka VaR 95% portofolio = <strong>Rp1 miliar</strong> (kuantil 95% jatuh di skenario satu default).</li>
      </ul>
      <p>Hasil: VaR(A+B) = Rp1 M <strong>&gt;</strong> VaR(A) + VaR(B) = Rp0. Diversifikasi — yang secara ekonomi <strong>mengurangi</strong> risiko (peluang rugi total Rp2 M turun drastis) — justru <strong>menaikkan</strong> angka VaR. Manajer yang dievaluasi murni dari VaR mendapat insentif <strong>menolak diversifikasi</strong>. Inilah alasan regulator akhirnya beralih ke Expected Shortfall (MR5) yang koheren — subadditivitas adalah salah satu dari empat aksioma koherensi Artzner.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR lebih rendah = portofolio lebih aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR hanya mengukur <em>frekuensi</em> pelampauan ambang, bukan <em>kedalaman</em> kerugian di ekor. Dua portofolio dengan VaR 99% identik bisa punya profil bencana yang beda langit-bumi: satu rugi maksimal Rp1,1 M saat 1% terjadi, satunya rugi Rp50 M. Contoh obligasi di atas menunjukkan VaR bahkan bisa <strong>naik</strong> saat risiko ekonomi <strong>turun</strong>. Selalu pasangkan VaR dengan ES dan stress test.</p>
      </div>

      <h3>LTCM 1998: ketika model bertemu likuiditas</h3>
      <p><strong>Long-Term Capital Management</strong> — hedge fund berisi peraih Nobel (Scholes, Merton) — memakai model VaR dan arbitrase yang canggih. Model mereka berasumsi posisi bisa dilikuidasi pada harga wajar dan korelasi antar pasar stabil. Agustus 1998, Rusia default (<em>Russian default crisis</em>):</p>
      <ul>
        <li><strong>Flight to quality</strong> global: semua orang menjual aset berisiko, membeli US Treasury. Spread yang &ldquo;pasti menyempit&rdquo; menurut model justru <strong>melebar brutal</strong>.</li>
        <li><strong>Korelasi menuju 1:</strong> posisi yang dirancang saling-hedge di berbagai negara <strong>bergerak searah</strong> — diversifikasi menguap persis saat dibutuhkan (pola yang terulang di 2008).</li>
        <li><strong>Likuiditas hilang:</strong> VaR mengasumsikan kamu bisa keluar dalam 1 hari (atau 10 hari). Saat semua orang keluar lewat pintu yang sama, tidak ada harga — hanya jurang.</li>
      </ul>
      <p>LTCM rugi <strong>US$4,6 miliar</strong> dalam hitungan minggu dan harus ditalangi konsorsium bank (diorkestrasi The Fed) untuk mencegah keruntuhan sistemik. Pelajarannya untuk pengguna VaR:</p>
      <ol>
        <li><strong>VaR mengasumsikan likuiditas</strong> — risiko likuiditas (MR13) adalah &ldquo;asumsi tak tertulis&rdquo; di setiap angka VaR.</li>
        <li><strong>VaR mengasumsikan korelasi masa lalu berlaku saat krisis</strong> — padahal korelasi adalah variabel yang paling tidak stabil saat stres.</li>
        <li><strong>Leverage memperbesar segalanya:</strong> LTCM beroperasi dengan leverage ~25:1. VaR 1% pada leverage 25× = potensi kebangkrutan. Angka VaR tanpa konteks leverage = angka buta.</li>
      </ol>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> baca VaR sebagai <em>&ldquo;dalam kondisi normal, kita rugi lebih dari X hanya Y% dari waktu&rdquo;</em> — dengan penekanan pada <strong>kondisi normal</strong>. Tiga pertanyaan yang harus selalu menyertai angka VaR: <strong>(1)</strong> berapa ES-nya (seberapa dalam jika 1% terjadi)? <strong>(2)</strong> apakah posisi ini bisa dilikuidasi dalam horizon VaR? <strong>(3)</strong> apa yang terjadi pada korelasi saat stres? VaR yang dilaporkan tanpa ketiganya adalah <strong>angka yatim</strong> — terlihat rapi, tidak punya orang tua yang bertanggung jawab.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: tiga metode, tiga jawaban — mana yang dipercaya? (klik untuk buka)</summary>
        <p><strong>Portofolio Rp10 M.</strong> Data 500 hari: vol harian 1,2%, ada 12 hari krisis (−4% s/d −7%) di 3 bulan terakhir.</p>
        <p><strong>Historical (99%):</strong> kuantil 1% dari 500 hari = observasi ke-5 terburuk = <strong>Rp385 jt</strong> (12 hari krisis <em>masuk</em> jendela → angka jujur).</p>
        <p><strong>Parametrik:</strong> 2,33 × 1,2% × 10 M = <strong>Rp280 jt</strong> — <em>27% lebih rendah</em>! (Asumsi normal meremehkan 12 hari krisis.)</p>
        <p><strong>Monte Carlo (normal, 10rb):</strong> ≈ <strong>Rp285 jt</strong> — sama butanya dengan parametrik (sampah masuk = sampah keluar).</p>
        <p><strong>Monte Carlo (t-student, df=5):</strong> ≈ <strong>Rp395 jt</strong> — menangkap ekor tebal, cocok dengan historical.</p>
        <p><strong>Keputusan analis:</strong> laporkan <strong>Rp385–395 jt</strong> (historical + MC t-student saling mengonfirmasi); <strong>buang</strong> Rp280 jt dengan catatan &ldquo;asumsi normal ditolak data&rdquo;. Selisih Rp105 jt (37%!) antara metode = <strong>bukan noise — ia adalah informasi</strong>: ia berkata &ldquo;distribusi ini berekor tebal&rdquo;. Analis yang merata-ratakan ketiga angka (Rp350 jt) menghancurkan informasi itu. <strong>Jangan rata-ratakan metode yang saling bertentangan — investigasi perbedaannya.</strong></p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — 20 P&amp;L harian (Rp jt): −60, −25, −18, −12, −9, −7, −5, −3, −1, 0, 2, 4, 6, 8, 10, 12, 15, 20, 25, 30. Hitung VaR 95% dan VaR 90% (historical). (klik untuk pembahasan)</summary>
        <p><strong>VaR 95%:</strong> 5% × 20 = 1 observasi boleh lebih buruk → observasi terburuk ke-1 = −60 → <strong>VaR 95% = Rp60 jt</strong>.</p>
        <p><strong>VaR 90%:</strong> 10% × 20 = 2 observasi boleh lebih buruk → terburuk ke-2 = −25 → <strong>VaR 90% = Rp25 jt</strong>.</p>
        <p><strong>Catatan:</strong> lompatan 25 → 60 jt dari <em>satu</em> observasi (−60) menunjukkan sensitivitas VaR ke outlier pada sampel kecil — alasan memakai ratusan observasi dan melengkapi dengan ES.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Buktikan dengan contoh 2-obligasi di lesson ini bahwa VaR 95% melanggar subadditivitas, lalu hitung ES 95% keduanya dan tunjukkan ES tidak melanggar. (klik untuk pembahasan)</summary>
        <p><strong>VaR:</strong> VaR(A)=VaR(B)=0 (P(rugi&gt;0)=4% &lt; 5%), VaR(A+B)=100 &gt; 0+0 — <strong>melanggar</strong>.</p>
        <p><strong>ES 95% tiap obligasi:</strong> 5% terburuk = 4% massa di rugi 100 + 1% di rugi 0 → ES = (0,04×100 + 0,01×0)/0,05 = <strong>80</strong>.</p>
        <p><strong>ES 95% gabungan:</strong> distribusi: P(rugi 200)=0,16%, P(rugi 100)=7,68%, P(rugi 0)=92,16%. 5% terburuk = 0,16% di 200 + 4,84% di 100 → ES = (0,0016×200 + 0,0484×100)/0,05 = (0,32+4,84)/0,05 = <strong>103,2</strong> ≤ 80+80=160 — <strong>tidak melanggar</strong>. Diversifikasi diakui: 103,2 &lt; 160.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Sebutkan 3 asumsi tak tertulis di balik setiap angka VaR, dengan contoh keruntuhannya. (klik untuk pembahasan)</summary>
        <p><strong>(1) Likuiditas:</strong> bisa keluar dalam horizon — runtuh: LTCM 1998, 2008 (tidak ada pembeli). <strong>(2) Korelasi stabil:</strong> diversifikasi bertahan saat stres — runtuh: korelasi → 1 di setiap krisis. <strong>(3) Data representatif:</strong> masa depan mirip jendela data — runtuh: VaR 2006–2007 buta terhadap 2008. Tiga asumsi ini = tiga alasan VaR wajib didampingi ES + stress test + liquidity horizon.</p>
      </details>

      <h2 id="case">📋 Mini-Case: VaR Hijau, Bank Jebol</h2>
      <div className="callout">
        <p>Bank ABC, 2007. Portofolio: <strong>Rp8 triliun</strong> (obligasi + sekuritisasi kredit perumahan AS). VaR 99%/1-hari (Historical, 250 hari): <strong>Rp95 miliar</strong> — hanya 1,2% dari portofolio. Direksi: &ldquo;Aman.&rdquo;</p>
        <ul>
          <li>Data 250 hari berasal dari <strong>2006–2007: masa tenang</strong> (vol rendah, spread sempit)</li>
          <li>Korelasi antar tranche sekuritisasi dalam data: <strong>0,3</strong>; saat krisis: melonjak ke <strong>0,9</strong></li>
          <li>Kerugian aktual 2008: <strong>Rp2,1 triliun</strong> (≈ 22× VaR)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Sebutkan 3 kegagalan spesifik dalam penggunaan VaR di sini. (b) Metrik/metode apa yang bisa memberi peringatan lebih dini? (c) Apa peran backtesting (MR6)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga kegagalan:</strong> (1) <em>Jendela tenang</em> — HS buta terhadap krisis yang belum ada di data; (2) <em>Korelasi statis</em> — diversifikasi yang diandalkan menguap saat krisis (correlation breakdown); (3) <em>VaR dibaca sebagai batas rugi</em> — tidak ada yang bertanya &ldquo;bagaimana jika 1% itu terjadi?&rdquo; (ES tidak dihitung).</p>
          <p>(b) <strong>Stressed VaR</strong> (VaR dari periode krisis historis — jadi standar Basel 2.5, MR16) dan <strong>stress testing</strong> skenario &ldquo;korelasi → 0,9&rdquo; (MR7) akan menunjukkan angka ratusan miliar, bukan 95 miliar. ES (MR5) akan menangkap kedalaman ekor.</p>
          <p>(c) <strong>Backtesting</strong> membandingkan VaR dengan P&amp;L aktual harian — tapi di masa tenang pun backtest akan &ldquo;lolos&rdquo; (inilah batasnya: backtest menguji <em>kalibrasi frekuensi</em>, bukan <em>ketahanan terhadap krisis</em>). Karena itu backtest <strong>tidak cukup sendirian</strong> — harus dipasangkan dengan stress test.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'VaR 99%/10-hari = Rp5 M (Historical)'. Interpretasi TEPAT?"
        options={[
          "Kerugian maksimal 10 hari ke depan adalah Rp5 M",
          "Ada 1% peluang kerugian 10-hari melebihi Rp5 M — dan jika terlampaui, besarnya tidak diketahui dari VaR ini",
          "Rugi Rp5 M sudah pasti terjadi",
          "VaR hanya berlaku untuk 1 hari",
        ]}
        correct={1}
        explanation="Benar. VaR = ambang kuantil, bukan batas maksimal. Frasa 'jika terlampaui, seberapa dalam?' tidak dijawab VaR — itulah pekerjaan Expected Shortfall (MR5)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Portofolio Rp200 M, σ harian 1,2%. VaR parametrik 99%/1-hari?"
        options={[
          "Rp2,4 M",
          "Rp5,6 M",
          "Rp4,7 M",
          "Rp7,9 M",
        ]}
        correct={1}
        explanation="Benar: 2,33 × 0,012 × 200 M = Rp5,59 M ≈ Rp5,6 M. Ingat: ini mengasumsikan return normal — cek kurtosis sebelum percaya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan Monte Carlo WAJIB dipilih atas Historical/Parametrik?"
        options={[
          "Portofolio hanya saham blue-chip",
          "Portofolio mengandung opsi dengan gamma/vega material — payoff non-linear butuh full revaluation per skenario",
          "Data historis sangat panjang",
          "Selalu — Monte Carlo selalu terbaik",
        ]}
        correct={1}
        explanation="Benar. Aproksimasi linear (delta) gagal untuk opsi — hanya full revaluation per skenario Monte Carlo yang menangkap payoff non-linear dengan tepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. VaR 1-hari = Rp100 jt. Dengan asumsi i.i.d., VaR 10-hari?"
        options={[
          "Rp1.000 jt",
          "Rp316 jt",
          "Rp100 jt",
          "Rp32 jt",
        ]}
        correct={1}
        explanation="Benar: 100 × √10 ≈ Rp316 jt. Tapi ingat — ini mengasumsikan return i.i.d. Jika ada volatility clustering (umum!), angka sebenarnya bisa lebih besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kelemahan UTAMA Historical Simulation?"
        options={[
          "Terlalu lambat dihitung",
          "Tidak bisa membayangkan kejadian yang belum ada di jendela data + sensitif terhadap pilihan jendela (ghost effect)",
          "Membutuhkan asumsi normal",
          "Tidak bisa untuk portofolio besar",
        ]}
        correct={1}
        explanation="Benar. HS = 'masa depan adalah masa lalu yang terpilih'. Krisis unprecedented tidak akan muncul di VaR HS — inilah alasan stressed VaR dan stress testing menjadi pendamping wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Tiga metode memberi VaR sangat berbeda: HS Rp300 jt, Parametrik Rp180 jt, MC Rp420 jt. Respons analis yang tepat?"
        options={[
          "Pilih yang terkecil agar limit longgar",
          "Rata-ratakan ketiganya",
          "Selidiki penyebab selisih: cek kurtosis (gagal normal?), cek non-linearitas portofolio, cek jendela data — selisih adalah sinyal, bukan gangguan",
          "Buang dua yang ekstrem",
        ]}
        correct={2}
        explanation="Benar. Selisih besar antar metode = sinyal diagnostik. MC tertinggi + parametrik terendah mengarah ke: fat tail (parametrik underestimate) dan/atau non-linearitas. Pahami penyebabnya sebelum memilih angka untuk keputusan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>VaR</strong> = kuantil kerugian: &ldquo;1−α peluang rugi ≤ VaR&rdquo; — selalu sebut kepercayaan, horizon, metode.</li>
          <li><strong>Historical:</strong> non-parametrik, tanpa asumsi distribusi; buta terhadap yang belum terjadi; ghost effect.</li>
          <li><strong>Parametrik:</strong> <Tex math={String.raw`z_\alpha \sigma V_0`} /> (multi-aset: <Tex math={String.raw`z_\alpha\sqrt{w^T\Sigma w}`} />); cepat &amp; terdekomposisi; asumsi normal meremehkan fat tail.</li>
          <li><strong>Monte Carlo:</strong> ribuan skenario + full revaluation; wajib untuk portofolio non-linear (opsi); mahal &amp; sebagus modelnya.</li>
          <li><strong>Scaling:</strong> <Tex math={String.raw`\text{VaR}(T) = \text{VaR}(1d)\sqrt{T}`} /> hanya sah jika i.i.d. — sebutkan asumsinya.</li>
          <li>VaR <strong>bukan</strong> kerugian maksimal dan <strong>diam</strong> tentang kedalaman ekor → butuh ES (MR5) + stress test (MR7) + backtest (MR6).</li>
          <li>Kapan TIDAK pakai VaR sendirian: keputusan modal, penetapan limit besar — selalu pasangkan dengan ES/stress.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr2-volatilitas" className="btn btn-secondary btn-sm">← MR2</Link>
        <Link href="/learn/mr4-var-lanjut" className="btn btn-primary btn-sm">Next: MR4 →</Link>
      </div>
    </div>
  );
}
