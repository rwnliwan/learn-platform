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

export default function MR2Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Simulasi: volatilitas tenang lalu meledak (regime change) — bandingkan equal-weight vs EWMA
  const r = rng(7);
  const n = 120;
  const rets: number[] = [];
  for (let i = 0; i < n; i++) {
    const sig = i < 80 ? 1 : 3.2; // regime tenang -> krisis di hari 80
    const u = (r() + r() + r() + r() + r() + r() - 3) / 1.5; // ~N(0,1)
    rets.push(+(u * sig).toFixed(2));
  }
  const days = rets.map((_, i) => i + 1);
  // rolling SD 60 hari (equal weight)
  const roll60: (number | null)[] = rets.map((_, i) => {
    if (i < 59) return null;
    const w = rets.slice(i - 59, i + 1);
    const m = w.reduce((a, b) => a + b, 0) / w.length;
    return +Math.sqrt(w.reduce((a, b) => a + (b - m) ** 2, 0) / (w.length - 1)).toFixed(2);
  });
  // EWMA lambda=0.94
  const lam = 0.94;
  const ewma: number[] = [];
  let v = 1;
  rets.forEach((rt) => { v = lam * v + (1 - lam) * rt * rt; ewma.push(+Math.sqrt(v).toFixed(2)); });

  const volData = [
    { x: days, y: rets.map((x) => Math.abs(x)), type: "bar", name: "|return| harian", marker: { color: "#cbd5e1" }, opacity: 0.6 },
    { x: days, y: roll60, type: "scatter", mode: "lines", name: "Rolling SD 60d", line: { color: "#2a7de1", width: 2 } },
    { x: days, y: ewma, type: "scatter", mode: "lines", name: "EWMA λ=0.94", line: { color: "#e8a838", width: 2 } },
  ];

  const lab1Code = String.raw`import random, math
random.seed(123)

# Bangkitkan return: 80 hari tenang (sd=1), lalu 40 hari krisis (sd=3)
rets = [random.gauss(0, 1) for _ in range(80)] + [random.gauss(0, 3) for _ in range(40)]

def rolling_sd(x, w):
    out = []
    for i in range(len(x)):
        win = x[max(0, i - w + 1):i + 1]
        m = sum(win) / len(win)
        out.append(math.sqrt(sum((v - m) ** 2 for v in win) / (len(win) - 1)))
    return out

def ewma_vol(x, lam):
    vols, v = [], sum(v * v for v in x[:10]) / 10  # inisialisasi variansi
    for rt in x:
        v = lam * v + (1 - lam) * rt * rt
        vols.append(math.sqrt(v))
    return vols

r60 = rolling_sd(rets, 60)
e94 = ewma_vol(rets, 0.94)
e97 = ewma_vol(rets, 0.97)

print("Hari  Vol-true  Roll60d  EWMA.94  EWMA.97")
for i in [79, 85, 95, 110, 119]:
    true = 1.0 if i < 80 else 3.0
    print(f"{i+1:>4}  {true:>8.1f}  {r60[i]:>7.2f}  {e94[i]:>7.2f}  {e97[i]:>7.2f}")
print()
print("Amati: setelah krisis mulai (hari 81), mana yang PALING CEPAT")
print("menyadari volatilitas naik? Mana yang paling lambat (masih 'teringat' masa tenang)?")
print("Coba: ganti window 60 -> 20, atau lam 0.94 -> 0.90. Apa trade-off-nya?")`;

  const lab2Code = String.raw`import random, math
random.seed(99)

# 5 aset, 60 observasi: korelasi sejati moderat. Estimasi kovarians sampel = noisy.
n_obs, n_aset = 60, 5
# bangkitkan return dengan korelasi sejati 0.3 antar aset
common = [random.gauss(0, 1) for _ in range(n_obs)]
R = [[0.7 * random.gauss(0, 1) + 0.7 * common[t] for t in range(n_obs)] for _ in range(n_aset)]

def cov_mat(X):
    p, T = len(X), len(X[0])
    means = [sum(row) / T for row in X]
    C = [[0.0] * p for _ in range(p)]
    for i in range(p):
        for j in range(p):
            C[i][j] = sum((X[i][t] - means[i]) * (X[j][t] - means[j]) for t in range(T)) / (T - 1)
    return C

S = cov_mat(R)
# Target shrinkage: variansi rata-rata di diagonal, kovarians rata-rata di luar diagonal
p = n_aset
v_bar = sum(S[i][i] for i in range(p)) / p
c_bar = sum(S[i][j] for i in range(p) for j in range(p) if i != j) / (p * (p - 1))
F = [[v_bar if i == j else c_bar for j in range(p)] for i in range(p)]

print("Kovarians sampel S[0][1] (noisy)      :", round(S[0][1], 3))
print("Target terstruktur F[0][1] (stabil)   :", round(F[0][1], 3))
for delta in [0.0, 0.2, 0.5, 0.8]:
    shrunk = delta * F[0][1] + (1 - delta) * S[0][1]
    print(f"delta={delta}: S* = {shrunk:.3f}")
print()
print("delta=0 -> murni sampel (noisy, bisa tidak invertible jika aset > observasi).")
print("delta=1 -> murni target (bias, tapi stabil & selalu invertible).")
print("Ledoit-Wolf memilih delta optimal otomatis: kompromi bias vs estimation error.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR2 — Market Risk Analytics</span>
        <h1 className="display-title">Volatilitas &amp; Kovarians:<br />EWMA, Shrinkage, dan Jendela Data</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Tertular Amnesia</a></li>
          <li><a href="#vol">Volatilitas: Standar Deviasi yang Hidup</a></li>
          <li><a href="#ewma">EWMA — Si Pelupa yang Bijak</a></li>
          <li><a href="#shrink">Shrinkage: Kovarians Sampel Itu Berisik</a></li>
          <li><a href="#lab1">🔬 Lab 1: Balapan Rolling SD vs EWMA Saat Krisis Datang</a></li>
          <li><a href="#lab2">🔬 Lab 2: Shrinkage Kovarians (Ledoit-Wolf Intuisi)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Estimator Mana, Kapan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Half-Life Ingatan, VIX, dan Efek Leverage</a></li>
          <li><a href="#case">📋 Mini-Case: VaR yang Terlambat Bangun</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa volatilitas harus diestimasi sebagai besaran yang <strong>berubah terhadap waktu</strong>, bukan angka statis.</li>
          <li>Menghitung volatilitas EWMA dari rumus rekursif dan menafsirkan arti <Tex math={String.raw`\lambda`} /> (decay factor) terhadap &ldquo;daya ingat&rdquo; model.</li>
          <li>Membandingkan equal-weighted rolling window vs EWMA dalam hal kecepatan adaptasi vs stabilitas.</li>
          <li>Menjelaskan masalah estimation error pada matriks kovarians sampel dan cara kerja shrinkage (Ledoit-Wolf).</li>
          <li>Memilih jendela data / parameter estimasi yang tepat untuk konteks (VaR harian vs stress test) dan menjelaskan trade-off-nya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model yang Tertular Amnesia</h2>
      <div className="story">
        <p>Maret 2020. Pasar bergejolak — IHSG anjlok 5% dalam sehari, lalu 6% lagi. Di ruang risiko sebuah bank, layar VaR masih berwarna <strong>hijau tenang</strong>. Model VaR mereka memakai volatilitas dari <strong>250 hari terakhir dengan bobot sama</strong>. Artinya: 249 hari tenang &ldquo;menenggelamkan&rdquo; 1 hari krisis. Model itu butuh berminggu-minggu untuk &ldquo;sadar&rdquo; bahwa dunia sudah berubah.</p>
        <p>Twist-nya: bank sebelah memakai <strong>EWMA</strong> — model yang memberi bobot lebih besar ke data terbaru. VaR mereka melonjak <strong>dalam 3 hari</strong>, limit diketatkan, posisi dikurangi. Bank pertama? Baru sadar setelah kerugian menumpuk — dan VaR-nya <em>meledak justru saat pasar mulai tenang</em> (karena hari-hari krisis akhirnya masuk jendela 250 hari dan tidak mau keluar).</p>
        <p>Inilah pelajaran MR2: <strong>cara kamu menimbang masa lalu menentukan seberapa cepat kamu membaca masa kini</strong>. Volatilitas bukan angka mati — ia bernapas, dan estimator yang salah membuatnya sesak napas di saat paling kritis.</p>
      </div>

      <h2 id="vol">Volatilitas: Standar Deviasi yang Hidup</h2>
      <p><strong>Definisi.</strong> <strong>Volatilitas</strong> (<Tex math={String.raw`\sigma`} />) adalah standar deviasi return — ukuran seberapa liar harga bergerak. Dalam risiko pasar, volatilitas adalah <strong>bahan bakar</strong> hampir semua model: VaR parametrik (MR3), harga opsi (MR11), hingga simulasi Monte Carlo.</p>
      <p><strong>Masalahnya:</strong> volatilitas tidak konstan. Ia <strong>berkelompok (volatility clustering)</strong> — hari liar diikuti hari liar, hari tenang diikuti hari tenang. Estimator yang mengasumsikan volatilitas tetap akan <em>terlambat</em> saat rezim berubah — persis seperti cerita di atas.</p>
      <p><strong>Return</strong> yang dipakai biasanya <strong>log-return</strong>:</p>
      <Tex math={String.raw`r_t = \ln\left(\frac{P_t}{P_{t-1}}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`r_t`} /> = return hari-t; <Tex math={String.raw`P_t`} /> = harga hari-t; <Tex math={String.raw`\ln`} /> = logaritma natural. Log-return dipilih karena <strong>aditif terhadap waktu</strong> (return 2 hari = jumlah return harian) — memudahkan scaling horizon di MR3.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas = risiko.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> volatilitas mengukur <strong>ketidakpastian dua arah</strong> (naik dan turun). Investor long-only memang menderita saat harga jatuh, tapi volatilitas ke atas justru menguntungkan. Ukuran risiko yang &ldquo;benar&rdquo; tergantung pertanyaan: VaR/ES (MR3/MR5) fokus ke <strong>ekor kerugian</strong>, sementara volatilitas adalah <em>input</em> untuk menghitungnya — bukan jawabannya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> selalu plot <strong>return kuadrat atau |return|</strong> terhadap waktu sebelum memilih estimator. Kalau kamu melihat gerombolan (cluster) — periode tenang diselingi periode liar — maka equal-weighted window sedang berbohong padamu, dan kamu butuh estimator yang adaptif (EWMA/GARCH).</p>
      </div>

      <h2 id="ewma">EWMA — Si Pelupa yang Bijak</h2>
      <p><strong>Definisi.</strong> <strong>EWMA (Exponentially Weighted Moving Average)</strong> mengestimasi variansi dengan memberi bobot yang <strong>meluruh eksponensial</strong> ke masa lalu — data kemarin jauh lebih penting daripada data 100 hari lalu:</p>
      <Tex math={String.raw`\sigma_t^2 = \lambda \sigma_{t-1}^2 + (1-\lambda) r_{t-1}^2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\sigma_t^2`} />: estimasi variansi untuk hari-t</li>
        <li><Tex math={String.raw`\lambda`} /> (lambda): <strong>decay factor</strong>, 0 &lt; λ &lt; 1 — &ldquo;daya ingat&rdquo; model. Standar RiskMetrics: <strong>0,94</strong> (harian).</li>
        <li><Tex math={String.raw`r_{t-1}^2`} />: return kuadrat kemarin — &ldquo;kejutan&rdquo; terbaru</li>
      </ul>
      <p><strong>Intuisi λ:</strong> bobot data <Tex math={String.raw`k`} /> hari lalu adalah <Tex math={String.raw`(1-\lambda)\lambda^k`} />. Dengan λ=0,94, data 70 hari lalu bobotnya tinggal ~1% — praktis dilupakan. λ dekat 1 = ingatan panjang (lambat adaptasi, stabil); λ kecil = ingatan pendek (cepat adaptasi, berisik).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Estimasi variansi kemarin <Tex math={String.raw`\sigma_{t-1}^2 = 4`} /> (vol 2%), return kemarin <Tex math={String.raw`r_{t-1} = +5\%`} /> (hari liar), λ = 0,94.</p>
        <p><strong>Langkah 1</strong> — kejutan kuadrat: <Tex math={String.raw`r_{t-1}^2 = 25`} />.</p>
        <p><strong>Langkah 2</strong> — rekursi: <Tex math={String.raw`\sigma_t^2 = 0{,}94 \times 4 + 0{,}06 \times 25 = 3{,}76 + 1{,}5 = 5{,}26`} />.</p>
        <p><strong>Langkah 3</strong> — volatilitas baru: <Tex math={String.raw`\sigma_t = \sqrt{5{,}26} \approx 2{,}29\%`} /> — naik dari 2% ke 2,29% <strong>dalam sehari</strong>. Bandingkan dengan rolling 250-hari yang bergerak nyaris nol. Inilah kecepatan adaptasi EWMA.</p>
      </details>

      <PlotlyChart
        data={volData}
        title="Respons Estimator Volatilitas terhadap Perubahan Rezim (krisis mulai hari 80)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Volatilitas / |return|" }, showlegend: true, barmode: "overlay" }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang abu-abu = |return| harian (data mentah). Garis biru = rolling SD 60 hari (bobot sama). Garis kuning = EWMA λ=0,94. Krisis (volatilitas 3× lipat) dimulai hari ke-80.</p>
        <p><strong>Interpretasi:</strong> EWMA (kuning) <strong>langsung menanjak</strong> begitu hari-hari liar muncul — ia &ldquo;sadar&rdquo; dalam hitungan hari. Rolling 60-hari (biru) butuh ~30 hari untuk mencapai level yang sama — ia masih &ldquo;teringat&rdquo; masa tenang. <strong>Tapi</strong> perhatikan juga: EWMA lebih bergerigi (noisy) di masa tenang. Itulah trade-off abadi: <strong>kecepatan vs stabilitas</strong>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> λ = 0,94 bukan angka suci — ia pilihan RiskMetrics untuk data harian. Untuk data intraday pakai λ lebih kecil (0,97 untuk bulanan). Aturan praktis: <strong>semakin pendek horizon keputusanmu, semakin kecil λ yang kamu butuhkan</strong> — karena kamu butuh model yang &ldquo;gugup&rdquo; secepat kamu harus bertindak.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;EWMA selalu lebih baik dari rolling window.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> EWMA unggul saat <strong>rezim berubah cepat</strong>, tapi di masa tenang ia justru lebih berisik (over-reactive) daripada rolling window panjang. Untuk <strong>stress testing / modal</strong> yang butuh stabilitas, window panjang equal-weighted sering dipilih regulator. Pilih estimator sesuai <em>tujuan</em>, bukan karena &ldquo;lebih canggih&rdquo;.</p>
      </div>

      <h2 id="shrink">Shrinkage: Kovarians Sampel Itu Berisik</h2>
      <p><strong>Definisi.</strong> Untuk portofolio multi-aset kita butuh <strong>matriks kovarians</strong> <Tex math={String.raw`\Sigma`} /> — bukan cuma volatilitas tiap aset, tapi juga <strong>korelasinya</strong>. Masalah: kovarians sampel dari data terbatas penuh <strong>estimation error</strong> — korelasi yang terlihat besar sering hanya noise.</p>
      <p><strong>Solusi Ledoit-Wolf (2004):</strong> &ldquo;tarik&rdquo; (shrink) matriks sampel ke arah target yang terstruktur dan stabil:</p>
      <Tex math={String.raw`\Sigma^* = \delta F + (1-\delta) S`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`S`} />: matriks kovarians <strong>sampel</strong> (apa kata data — noisy tapi unbiased)</li>
        <li><Tex math={String.raw`F`} />: <strong>target</strong> terstruktur (misal: variansi = rata-rata semua variansi, kovarians = rata-rata semua kovarians — stabil tapi bias)</li>
        <li><Tex math={String.raw`\delta`} />: <strong>intensitas shrinkage</strong> 0–1 — Ledoit-Wolf menghitung δ optimal otomatis dari data (makin noisy data, makin besar δ)</li>
      </ul>
      <p><strong>Kenapa penting?</strong> Matriks kovarians sampel bisa <strong>tidak invertible</strong> (singular) kalau jumlah aset melebihi jumlah observasi — padahal invers matriks dibutuhkan untuk optimasi portofolio dan beberapa rumus VaR. Shrinkage menjamin matriks selalu invertible dan lebih stabil.</p>
      <p><strong>Kepribadian shrinkage:</strong> ia seperti <em>editor yang bijak</em> — tidak menghapus kesaksian data (S), tapi menarik klaim yang terlalu ekstrem ke arah akal sehat (F). Makin sedikit bukti (data), makin kuat tarikannya.</p>
      <p><strong>Kapan memakai:</strong> portofolio banyak aset dengan histori pendek; input optimasi mean-variance; VaR parametrik multi-faktor (MR3). <strong>Kapan tidak perlu:</strong> sedikit aset + data panjang — sampel sudah cukup stabil.</p>

      <h2 id="lab1">🔬 Lab 1: Balapan Rolling SD vs EWMA Saat Krisis Datang</h2>
      <p>Jalankan, lalu ubah parameter: window 60 → 20, λ 0,94 → 0,90. Kapan kecepatan adaptasi berubah menjadi sekadar kegugupan (noise)?</p>
      <PyodideLab
        title="Lab 1 — Respons Estimator terhadap Regime Change"
        hint="Coba: window=20 (responsif tapi berisik?) dan λ=0.99 (stabil tapi telat?). Tidak ada jawaban sempurna — hanya trade-off yang harus kamu pilih sadar."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Shrinkage Kovarians (Intuisi Ledoit-Wolf)</h2>
      <p>Ubah <code className="inline">n_obs</code> dari 60 menjadi 500, lalu 30. Perhatikan bagaimana kebutuhan shrinkage (δ) berubah mengikuti banyaknya data.</p>
      <PyodideLab
        title="Lab 2 — Shrinkage: Kompromi Bias vs Estimation Error"
        hint="Coba n_obs=30 (data sedikit → kovarians sampel makin liar, δ optimal makin besar) vs n_obs=1000 (data banyak → δ kecil, percaya sampel)."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Estimator Mana, Kapan</h2>

      <div className="decision-card">
        <h3>1. Butuh respons cepat ke perubahan pasar (trading harian, limit intraday) → <strong>EWMA (λ kecil–sedang)</strong></h3>
        <p><strong>Kondisi:</strong> keputusan diambil harian; keterlambatan adaptasi = kerugian nyata.</p>
        <p><strong>Alasan:</strong> bobot eksponensial membuat estimator &ldquo;bangun&rdquo; dalam hitungan hari. Terima konsekuensinya: lebih berisik di masa tenang.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh stabilitas untuk modal / regulasi → <strong>Rolling window panjang, equal-weighted</strong></h3>
        <p><strong>Kondisi:</strong> perhitungan capital charge, stress test regulator.</p>
        <p><strong>Alasan:</strong> regulator menghargai stabilitas &amp; transparansi; window 250-hari–1 tahun adalah standar. Keterlambatan adaptasi adalah harga yang disadari.</p>
      </div>

      <div className="decision-card">
        <h3>3. Banyak aset, histori pendek → <strong>Kovarians + shrinkage (Ledoit-Wolf)</strong></h3>
        <p><strong>Kondisi:</strong> jumlah aset mendekati/melebihi jumlah observasi; butuh matriks invertible untuk optimasi.</p>
        <p><strong>Alasan:</strong> sampel murni terlalu noisy dan bisa singular; shrinkage memberi stabilitas dengan δ optimal dari data.</p>
        </div>

      <div className="decision-card">
        <h3>4. Volatilitas berkelompok jelas + butuh forecasting → <strong>GARCH</strong></h3>
        <p><strong>Kondisi:</strong> kamu butuh model formal dengan mean-reversion volatilitas (dibahas penuh di MR15).</p>
        <p><strong>Alasan:</strong> EWMA sebenarnya adalah GARCH(1,1) dengan batasan tertentu — GARCH memberi fleksibilitas lebih (level jangka panjang eksplisit).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Cepat &amp; adaptif</strong> → EWMA. <strong>Stabil &amp; regulator-friendly</strong> → window panjang.</li>
          <li><strong>Banyak aset, data sedikit</strong> → shrinkage, jangan percaya kovarians sampel mentah.</li>
          <li>Selalu tanya: &ldquo;estimator ini ingatannya seberapa panjang — dan apakah itu cocok dengan horizon keputusanku?&rdquo;</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Half-Life Ingatan, VIX, dan Efek Leverage</h2>
      <p>Kamu sudah tahu EWMA &ldquo;melupakan&rdquo; masa lalu secara eksponensial. Sekarang kita ukur <strong>seberapa cepat ia lupa</strong>, melihat apa yang terjadi pada volatilitas <strong>dunia nyata</strong> saat krisis (VIX 2020), dan memahami <strong>mengapa</strong> volatilitas berkelompok — bukan sekadar menerima faktanya.</p>

      <h3>Half-life: mengukur daya ingat λ</h3>
      <p>Bobot data <Tex math={String.raw`k`} /> hari lalu adalah <Tex math={String.raw`(1-\lambda)\lambda^k`} />. Pertanyaan natural: setelah berapa hari bobotnya tinggal <strong>separuh</strong> dari bobot data kemarin? Itulah <strong>half-life</strong>:</p>
      <Tex math={String.raw`k_{1/2} = \frac{\ln(1/2)}{\ln(\lambda)}`} block />
      <p><strong>Artinya:</strong> untuk λ = 0,94, <Tex math={String.raw`k_{1/2} = \ln(0{,}5)/\ln(0{,}94) \approx 11{,}2`} /> hari. Data 11 hari lalu pengaruhnya tinggal separuh dari kemarin; data 34 hari lalu tinggal seperdelapannya. Bandingkan dengan rolling window 250-hari: data 249 hari lalu bobotnya <strong>sama persis</strong> dengan kemarin — ingatan yang &ldquo;demokratis&rdquo; tapi tuli terhadap perubahan.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: EWMA 5 hari berturut-turut saat krisis (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Volatilitas awal <Tex math={String.raw`\sigma_0 = 1{,}5\%`} /> (variansi 2,25). Lalu datang 5 hari krisis dengan return: −4%, +3%, −5%, +2%, −3%. λ = 0,94. Hitung <Tex math={String.raw`\sigma_t`} /> tiap hari.</p>
        <p><strong>Rumus yang dipakai tiap langkah:</strong> <Tex math={String.raw`\sigma_t^2 = 0{,}94\,\sigma_{t-1}^2 + 0{,}06\, r_{t-1}^2`} /> dengan <Tex math={String.raw`r^2`} /> dalam satuan persen-kuadrat.</p>
        <p><strong>Hari 1</strong> (r = −4): <Tex math={String.raw`\sigma_1^2 = 0{,}94(2{,}25) + 0{,}06(16) = 2{,}115 + 0{,}96 = 3{,}075`} /> → <Tex math={String.raw`\sigma_1 = 1{,}75\%`} />.</p>
        <p><strong>Hari 2</strong> (r = +3): <Tex math={String.raw`\sigma_2^2 = 0{,}94(3{,}075) + 0{,}06(9) = 2{,}89 + 0{,}54 = 3{,}43`} /> → <Tex math={String.raw`\sigma_2 = 1{,}85\%`} />.</p>
        <p><strong>Hari 3</strong> (r = −5): <Tex math={String.raw`\sigma_3^2 = 0{,}94(3{,}43) + 0{,}06(25) = 3{,}22 + 1{,}5 = 4{,}72`} /> → <Tex math={String.raw`\sigma_3 = 2{,}17\%`} />.</p>
        <p><strong>Hari 4</strong> (r = +2): <Tex math={String.raw`\sigma_4^2 = 0{,}94(4{,}72) + 0{,}06(4) = 4{,}44 + 0{,}24 = 4{,}68`} /> → <Tex math={String.raw`\sigma_4 = 2{,}16\%`} />.</p>
        <p><strong>Hari 5</strong> (r = −3): <Tex math={String.raw`\sigma_5^2 = 0{,}94(4{,}68) + 0{,}06(9) = 4{,}40 + 0{,}54 = 4{,}94`} /> → <Tex math={String.raw`\sigma_5 = 2{,}22\%`} />.</p>
        <p><strong>Angka ini artinya:</strong> dalam 5 hari, estimasi vol naik dari 1,5% ke 2,22% (+48%). Rolling 250-hari pada periode yang sama bergerak kurang dari +2% — karena 5 hari krisis &ldquo;tenggelam&rdquo; di 245 hari tenang. <strong>Tapi</strong> perhatikan hari 4: return kecil (+2%) nyaris tidak menurunkan estimasi (2,17% → 2,16%). EWMA naik cepat saat ada kejutan, tapi <strong>turun perlahan</strong> — perilakunya asimetris, dan itu justru realistis: kepanikan pasar memang reda perlahan.</p>
      </details>

      <h3>VIX: ketika pasar ikut menebak volatilitas</h3>
      <p>Sejauh ini kita membahas <strong>realized volatility</strong> (dihitung dari return masa lalu). Ada saudaranya: <strong>implied volatility</strong> — volatilitas yang <em>tersirat</em> dari harga opsi, alias tebakan kolektif pasar tentang kegilaan masa depan. Indeksnya yang terkenal: <strong>VIX</strong> (S&amp;P 500).</p>
      <p>Angka-angka yang perlu kamu hafal sebagai jangkar intuisi:</p>
      <ul>
        <li><strong>Masa tenang:</strong> VIX 12–18 (2017–2019, 2024). Pasar &ldquo;tidur&rdquo;.</li>
        <li><strong>Krisis 2008:</strong> VIX menyentuh <strong>80,9</strong> (Nov 2008).</li>
        <li><strong>COVID crash:</strong> VIX menyentuh <strong>82,7</strong> (16 Mar 2020) — IHSG jatuh 5%+ dua hari beruntun, circuit breaker Jakarta aktif.</li>
        <li><strong>Pola umum:</strong> VIX melonjak <strong>cepat</strong> (hitungan hari) dan reda <strong>perlahan</strong> (hitungan bulan) — cerminan persis perilaku EWMA di contoh 5-hari tadi.</li>
      </ul>
      <p>Hubungan VIX dengan estimator kita: VIX adalah <strong>forward-looking</strong> (ekspektasi 30 hari ke depan), sedangkan EWMA/rolling adalah <strong>backward-looking</strong> (ringkasan masa lalu). Keduanya tidak harus sama — selisihnya disebut <strong>variance risk premium</strong>: pasar biasanya membayar lebih untuk proteksi (implied &gt; realized) karena investor membenci kejutan. Kalau kamu melihat implied jauh di atas realized, pasar sedang &ldquo;cemas duluan&rdquo; — dan itu sendiri adalah sinyal.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VIX tinggi = saat yang tepat untuk beli.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VIX tinggi berarti pasar <em>mengharapkan</em> kegilaan berlanjut — bukan berarti kegilaan sudah selesai. VIX bisa bertahan di atas 30 selama berbulan-bulan (2008–2009, 2020). Membeli hanya karena &ldquo;VIX sudah tinggi&rdquo; sama dengan menangkap pisau jatuh dengan alasan pisau itu sudah jatuh jauh. VIX adalah <strong>termometer ketakutan</strong>, bukan sinyal beli.</p>
      </div>

      <h3>Mengapa volatilitas berkelompok? Efek leverage</h3>
      <p>Volatility clustering bukan kebetulan statistik — ada mekanisme ekonominya. Yang paling terkenal: <strong>leverage effect</strong> (Black, 1976). Ketika harga saham jatuh, nilai ekuitas perusahaan menyusut sementara utangnya tetap → <strong>rasio leverage (utang/ekuitas) naik</strong> → perusahaan menjadi lebih berisiko → volatilitas naik. Lingkaran ini menjelaskan <strong>asimetri</strong> penting: <em>penurunan harga menaikkan vol lebih besar daripada kenaikan harga dengan besaran sama</em>.</p>
      <p>Mekanisme kedua: <strong>umpan balik perilaku</strong>. Harga jatuh memicu margin call → forced selling → harga jatuh lagi → volatilitas meledak. Inilah yang membuat cluster volatilitas hampir selalu dimulai dari sisi <em>negatif</em> — crash, bukan rally. Rally liar (misal short squeeze) memang ada, tapi jarang membentuk cluster sepanjang crash.</p>
      <p>Implikasinya untuk estimasi: model simetris murni (EWMA standar, GARCH standar) memperlakukan return +5% dan −5% <strong>sama</strong> — padahal −5% seharusnya menaikkan estimasi vol lebih besar. Varian asimetris (GJR-GARCH, EGARCH — disinggung di MR15) memperbaiki ini. Untuk VaR harian biasa perbedaannya kecil; untuk <strong>stress testing dan harga opsi</strong>, mengabaikan asimetri berarti meremehkan tepat sisi yang paling menyakitkan.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan urutan kausalnya — <em>harga jatuh → leverage naik → vol naik → VaR naik → limit mengetat → forced selling → harga jatuh lagi</em>. Inilah <strong>spiral procyclical</strong> yang membuat krisis 2008 dan Maret 2020 begitu brutal. Estimator volatilitas yang baik bukan yang paling akurat di masa tenang, melainkan yang <strong>paling cepat mengenali awal spiral</strong> — karena di sanalah keputusan (cut posisi, tambah lindung nilai) masih murah.</p>
      </div>

      <p><strong>Kaitan antar-lesson:</strong> volatilitas yang kamu estimasi di sini menjadi <strong>input</strong> VaR parametrik (MR3), penentu harga opsi (MR11), dan bahan bakar simulasi Monte Carlo (MR15). Kesalahan estimasi di sini <strong>menjalar</strong> ke semua lesson berikutnya — itulah mengapa &ldquo;sekadar standar deviasi&rdquo; layak dapat satu lesson penuh.</p>

      <details className="worked">
        <summary>📐 Bedah angka: EWMA vs GARCH — kapan bedanya penting? (klik untuk buka)</summary>
        <p><strong>Data:</strong> 500 hari return. Estimasi: EWMA λ=0,94 → σ̂ = 1,8%. GARCH(1,1) terkalibrasi: ω=0,02, α=0,08, β=0,90 → <Tex math={String.raw`\sigma^2_{LR} = 0{,}02/(1-0{,}98) = 1{,}0`} /> → vol jangka panjang = 1,0%.</p>
        <p><strong>Ramalan 30-hari:</strong> EWMA (tanpa mean-reversion) → tetap <strong>1,8%</strong> sepanjang 30 hari. GARCH → meluruh menuju <strong>1,0%</strong>: hari-1: 1,72%, hari-10: 1,45%, hari-30: 1,18%.</p>
        <p><strong>Dampak ke VaR 10-hari:</strong> EWMA: 2,33×1,8%×√10 = 13,3%×V. GARCH (rata-rata vol ramalan ≈1,5%): ≈ 11,0%×V — <strong>selisih 17%</strong>.</p>
        <p><strong>Kapan penting:</strong> (1) <strong>opsi jangka panjang</strong> — harga opsi 1-tahun dengan vol konstan 1,8% vs meluruh ke 1,0% beda jauh; (2) <strong>stress testing multi-periode</strong>; (3) <strong>rezim transisi</strong> — setelah krisis, GARCH &ldquo;tahu&rdquo; vol akan reda, EWMA &ldquo;mengira&rdquo; panik permanen. Untuk VaR 1-hari: bedanya kecil — <strong>kompleksitas mengikuti horizon</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Hitung half-life untuk λ = 0,97 dan λ = 0,90. Estimator mana yang &ldquo;ingat&rdquo; lebih lama? (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`k_{1/2} = \ln(0{,}5)/\ln(\lambda)`} />. Untuk λ=0,97: ln(0,5)/ln(0,97) ≈ 22,8 hari. Untuk λ=0,90: ≈ 6,6 hari.</p>
        <p><strong>λ=0,97 ingat ~3,5× lebih lama.</strong> Standar RiskMetrics: 0,94 harian, 0,97 bulanan — konsisten: horizon keputusan lebih panjang → butuh ingatan lebih panjang. Aturan praktis: pilih λ sehingga half-life ≈ ¼–½ dari horizon keputusanmu.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — VIX 35, realized vol S&amp;P 500 (30-hari) 18%. Apa interpretasi variance risk premium-nya? Tindakan apa yang masuk akal untuk risk manager? (klik untuk pembahasan)</summary>
        <p><strong>Interpretasi:</strong> pasar membayar premi besar untuk proteksi — implied (35) hampir 2× realized (18). Pasar &ldquo;cemas duluan&rdquo;: mengharapkan kegilaan berlanjut atau takut event yang belum terjadi.</p>
        <p><strong>Tindakan:</strong> (1) jangan averaging down agresif — pasar memberi sinyal ketakutan; (2) cek biaya lindung nilai — proteksi sedang <em>mahal</em>, jadi lindung nilai penuh mungkin tidak ekonomis; pertimbangkan lindung nilai parsial atau kurangi eksposur langsung; (3) siapkan skenario stres (MR7) — bukan karena VIX &ldquo;meramal&rdquo;, tapi karena pasar itu sendiri bisa menjadi pemicu (spiral ketakutan).</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Data: return −6% menaikkan estimasi vol lebih besar daripada return +6%. Model apa yang menjelaskan ini, dan mengapa penting untuk stress testing? (klik untuk pembahasan)</summary>
        <p><strong>Efek leverage</strong> (Black, 1976): harga jatuh → leverage perusahaan naik → risiko naik. Model asimetris: <strong>GJR-GARCH / EGARCH</strong> (memberi bobot lebih ke return negatif).</p>
        <p><strong>Penting untuk stress testing</strong> karena skenario stres <em>selalu</em> sisi negatif — model simetris meremehkan tepat sisi yang diuji. Untuk VaR harian biasa bedanya kecil; untuk skenario krisis, mengabaikan asimetri = meremehkan kerugian skenario secara sistematis.</p>
      </details>

      <h2 id="case">📋 Mini-Case: VaR yang Terlambat Bangun</h2>
      <div className="callout">
        <p>Desk ekuitas memakai <strong>VaR parametrik 99%/1-hari</strong> dengan volatilitas <strong>rolling 250-hari equal-weighted</strong>. Posisi: Rp200 miliar (beta 1 terhadap IHSG). Vol tahunan masa tenang: 16%.</p>
        <ul>
          <li>VaR harian masa tenang = 2,33 × (16%/√250) × Rp200 M ≈ <strong>Rp4,7 miliar</strong></li>
          <li>Krisis datang: volatilitas aktual melonjak ke 48% tahunan dalam 2 minggu, tapi estimator 250-hari baru naik ke ~20%</li>
          <li>Hari ke-10 krisis: rugi Rp18 miliar dalam sehari — <strong>hampir 4× VaR</strong></li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Mengapa VaR &ldquo;hijau&rdquo; padahal pasar sudah merah? (b) Apa perbaikan minimal yang bisa dilakukan tanpa mengganti seluruh sistem? (c) Apa risiko dari perbaikan itu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Amnesia jendela panjang:</strong> 250 hari equal-weighted berarti tiap hari bobotnya 0,4% — 10 hari krisis hanya 4% dari estimasi. Model &ldquo;teringat&rdquo; 240 hari tenang. VaR mengukur masa lalu yang sudah tidak relevan.</p>
          <p>(b) Perbaikan minimal: <strong>ganti ke EWMA λ=0,94</strong> (atau tambahkan sebagai overlay/early-warning). Dalam ~10 hari, EWMA sudah merefleksikan sebagian besar volatilitas baru. Alternatif: pakai <strong>stressed VaR</strong> (skenario volatilitas krisis) sebagai pendamping — pendekatan Basel 2.5 (MR16).</p>
          <p>(c) Risikonya: <strong>procyclicality</strong> — EWMA membuat VaR melonjak tepat saat krisis (memaksa deleveraging di saat terburuk) dan anjlok saat tenang (memberi rasa aman palsu). Inilah alasan regulator tetap meminta komponen yang stabil. Jawaban dewasa: <strong>pakai keduanya</strong> — EWMA untuk peringatan dini, window panjang untuk stabilitas modal.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. EWMA dengan λ=0,94 vs λ=0,99. Mana yang LEBIH CEPAT menyadari krisis?"
        options={[
          "λ=0,99 — ingatan lebih panjang",
          "λ=0,94 — bobot data terbaru lebih besar, jadi lebih cepat adaptasi",
          "Sama saja",
          "Tergantung hari",
        ]}
        correct={1}
        explanation="Benar. λ lebih kecil = daya ingat lebih pendek = bobot lebih besar untuk data terbaru = lebih cepat merespons perubahan rezim. Harganya: lebih berisik di masa tenang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. σ²(t-1)=9, r(t-1)=−6%, λ=0,94. Estimasi variansi baru?"
        options={[
          "9,00",
          "10,62",
          "6,00",
          "15,00",
        ]}
        correct={1}
        explanation="Benar: σ² = 0,94×9 + 0,06×36 = 8,46 + 2,16 = 10,62. Volatilitas naik dari 3% ke ~3,26% dalam sehari — respons cepat EWMA terhadap kejutan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Portofolio 100 saham dengan histori 60 hari. Masalah utama kovarians sampel?"
        options={[
          "Terlalu stabil",
          "Estimation error besar + matriks bisa singular (aset > observasi) → butuh shrinkage",
          "Tidak bisa dihitung",
          "Selalu akurat",
        ]}
        correct={1}
        explanation="Benar. Dengan 100 aset dan 60 observasi, kovarians sampel sangat noisy dan tidak invertible. Shrinkage (Ledoit-Wolf) menariknya ke target stabil dengan δ optimal dari data."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan rolling window panjang equal-weighted LEBIH TEPAT daripada EWMA?"
        options={[
          "Untuk trading intraday",
          "Untuk perhitungan modal/regulator yang butuh stabilitas dan transparansi",
          "Tidak pernah",
          "Saat pasar krisis",
        ]}
        correct={1}
        explanation="Benar. Regulator menghargai stabilitas — VaR modal tidak boleh berayun liar setiap hari. Keterlambatan adaptasi adalah trade-off yang disadari, biasanya dipasangkan dengan stressed VaR."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dalam rumus shrinkage Σ* = δF + (1−δ)S, apa arti δ=1?"
        options={[
          "Percaya penuh pada data sampel",
          "Abaikan data sampel sepenuhnya, pakai target terstruktur (maksimal bias, maksimal stabil)",
          "Matriks menjadi singular",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar. δ=1 berarti 100% target F — mengabaikan sampel. Ekstrem ini stabil tapi bias; Ledoit-Wolf memilih δ di antaranya secara optimal, bukan di ujung."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Mengapa dipakai log-return, bukan simple return, untuk estimasi volatilitas multi-hari?"
        options={[
          "Supaya angkanya lebih kecil",
          "Log-return aditif terhadap waktu — return 10 hari = jumlah return harian, memudahkan scaling horizon",
          "Simple return tidak bisa negatif",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar. Aditivitas log-return membuat agregasi waktu bersih (penting untuk scaling VaR di MR3). Simple return harus dikalikan (compounding), lebih rumit untuk agregasi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Volatilitas berkelompok</strong> (clustering) — estimator statis terlambat membaca perubahan rezim.</li>
          <li><strong>EWMA:</strong> <Tex math={String.raw`\sigma_t^2 = \lambda\sigma_{t-1}^2 + (1-\lambda)r_{t-1}^2`} /> — λ kecil = cepat &amp; berisik; λ besar = lambat &amp; stabil. Standar harian: 0,94.</li>
          <li><strong>Trade-off abadi:</strong> kecepatan adaptasi vs stabilitas — tidak ada estimator sempurna, pilih sesuai tujuan (peringatan dini vs modal).</li>
          <li><strong>Shrinkage (Ledoit-Wolf):</strong> <Tex math={String.raw`\Sigma^* = \delta F + (1-\delta)S`} /> — kompromi bias vs estimation error; wajib untuk banyak-aset + data-pendek.</li>
          <li><strong>Jendela data</strong> adalah pilihan kebijakan: pendek = responsif, panjang = stabil. Untuk modal, regulator memilih panjang + stressed VaR sebagai pendamping.</li>
          <li>Kapan TIDAK pakai EWMA murni: saat stabilitas angka lebih penting daripada kecepatan (laporan modal, stress test regulator).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr1-trading-book" className="btn btn-secondary btn-sm">← MR1</Link>
        <Link href="/learn/mr3-var" className="btn btn-primary btn-sm">Next: MR3 →</Link>
      </div>
    </div>
  );
}
