"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A312Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const kmData = [
    {
      x: [0, 3, 6, 9, 12, 15, 18, 21, 24],
      y: [1.0, 0.94, 0.88, 0.81, 0.73, 0.68, 0.62, 0.58, 0.55],
      mode: "lines+markers",
      type: "scatter",
      name: "Skor A (baik)",
      line: { color: "#22c55e", width: 3, shape: "hv" },
      marker: { size: 8 },
    },
    {
      x: [0, 3, 6, 9, 12, 15, 18, 21, 24],
      y: [1.0, 0.85, 0.72, 0.6, 0.5, 0.43, 0.38, 0.34, 0.31],
      mode: "lines+markers",
      type: "scatter",
      name: "Skor D (buruk)",
      line: { color: "#ef4444", width: 3, shape: "hv" },
      marker: { size: 8 },
    },
  ];

  const hazardData = [
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      y: [0.02, 0.025, 0.03, 0.028, 0.026, 0.024, 0.023, 0.022, 0.021, 0.02, 0.02, 0.019],
      mode: "lines+markers",
      type: "scatter",
      name: "Hazard KPR",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 8 },
    },
    {
      x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      y: [0.06, 0.075, 0.07, 0.06, 0.05, 0.045, 0.04, 0.038, 0.036, 0.035, 0.034, 0.033],
      mode: "lines+markers",
      type: "scatter",
      name: "Hazard KTA",
      line: { color: "#e8a838", width: 3 },
      marker: { size: 8 },
    },
  ];

  const censorData = [
    {
      x: [0, 5, 5, 0, 12, 12, 0, 8],
      y: [1, 1, 2, 2, 2, 3, 3, 3],
      mode: "markers",
      type: "scatter",
      name: "",
      marker: { color: "#2a7de1", size: 10 },
      text: ["start", "default ✓", "censored ○", "start", "lunas (censored) ○", "start", "censored ○", "start"],
      textposition: "top center",
    },
  ];

  const lab1Code = `# Kaplan-Meier dari nol: kurva survival dengan sensor kanan
# Data: (waktu_bulan, event: 1=default, 0=censored)
import math
data = [(3,1),(5,1),(5,0),(6,1),(8,1),(8,0),(9,1),(12,1),(12,0),
        (15,1),(18,0),(18,1),(21,0),(24,1),(24,0),(30,0)]
data.sort()

# KM: S(t) = prod (1 - d_i/n_i) pada tiap waktu kejadian
times = sorted(set(t for t, e in data if e == 1))
n_total = len(data)
S = 1.0
print(f"{'bulan':>6} | {'at risk':>7} | {'default':>7} | S(t)")
print("-"*40)
print(f"{0:>6} | {n_total:>7} | {'-':>7} | {S:.3f}")
for t in times:
    at_risk = sum(1 for tt, _ in data if tt >= t)
    d = sum(1 for tt, e in data if tt == t and e == 1)
    S *= (1 - d/at_risk)
    print(f"{t:>6} | {at_risk:>7} | {d:>7} | {S:.3f}")
print()
print("BACA: S(12) artinya peluang 'selamat' (belum default) sampai")
print("bulan ke-12. Yang censored (0) mengurangi 'at risk' TANPA")
print("mengurangi S - mereka keluar dari pengamatan, bukan gagal.")
print()
print("Median survival: waktu saat S(t) <= 0.5. Dari tabel di atas,")
print("median =", next((t for t in times if True), None), "(hitung manual dari S!)")
print()
print("COBA: ubah semua event jadi 1 (tanpa sensor). S(24) jauh lebih")
print("rendah - sensor yang diabaikan = bias!")`;

  const lab2Code = `# Cox PH dari nol: hazard ratio via partial likelihood (1 kovariat)
# Model: h(t|x) = h0(t) * exp(beta*x). Estimasi beta TANPA perlu h0!
import random, math
random.seed(99)

# Bangkitkan: x=skor (0=buruk,1=baik); hazard baseline eksponensial
n = 400
xs = [random.randint(0, 1) for _ in range(n)]
true_beta = -0.9  # skor baik -> hazard 0.41x
times, events = [], []
for x in xs:
    haz = 0.08*math.exp(true_beta*x)
    t = random.expovariate(haz)
    c = random.expovariate(0.03)          # sensor acak
    times.append(min(t, c)); events.append(1 if t <= c else 0)
print(f"n={n}, event rate={sum(events)/n:.1%}, censored={1-sum(events)/n:.1%}")

# Partial likelihood: hanya pakai URUTAN kejadian
order = sorted(range(n), key=lambda i: times[i])
def negloglik(beta):
    ll = 0.0
    for idx, i in enumerate(order):
        if events[i] == 0: continue
        risk = [j for j in order[idx:] ]  # risk set: masih at risk
        denom = sum(math.exp(beta*xs[j]) for j in risk)
        ll += beta*xs[i] - math.log(denom)
    return -ll

# grid search beta
best = min((b/100 for b in range(-200, 50)), key=negloglik)
print(f"\nbeta estimasi = {best:.3f} (benar: {true_beta})")
print(f"Hazard ratio  = exp({best:.3f}) = {math.exp(best):.3f}")
print(f"-> nasabah skor BAIK punya laju default {math.exp(best):.0%} dari skor buruk,")
print("   pada setiap titik waktu (asumsi proportional hazards).")
print()
print("CATATAN: partial likelihood TIDAK mengestimasi h0(t) - hanya beta.")
print("h0 diestimasi terpisah (Breslow) jika butuh kurva survival absolut.")
print("COBA: naikkan sensor (0.03 -> 0.15). Estimasi makin goyang -")
print("informasi datang dari EVENT, bukan dari yang tersensor.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.12 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Survival Analysis:<br />Memprediksi Kapan — Bukan Sekadar Apakah</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#prasyarat">Prasyarat 2 Menit: Masalahnya Bernama Sensor</a></li>
          <li><a href="#cerita">Cerita Pembuka: 70% Data Dibuang, Kesimpulan Terbalik</a></li>
          <li><a href="#sensor">Sensor — Mengapa Data Survival Istimewa</a></li>
          <li><a href="#km">Kaplan-Meier — Kurva Survival Non-Parametrik</a></li>
          <li><a href="#hazard">Hazard Function — Laju Kejadian Saat Ini</a></li>
          <li><a href="#cox">Cox Proportional Hazards — Regresi untuk Waktu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kaplan-Meier dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Cox PH dari Nol (Partial Likelihood)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Survival Analysis?</a></li>
          <li><a href="#case">📋 Mini-Case: Vintage Analysis Portofolio KPR</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan sensor kanan dan mengapa mengabaikannya menimbulkan bias sistematis.</li>
          <li>Menghitung estimator Kaplan-Meier langkah-demi-langkah dan membaca kurva survival (termasuk median survival).</li>
          <li>Membedakan survival function S(t) vs hazard function h(t) dan menginterpretasikan hazard ratio.</li>
          <li>Menuliskan model Cox PH, menjelaskan asumsi proportional hazards, dan cara mengujinya.</li>
        </ul>
      </div>

      {/* PRASYARAT */}
      <h2 id="prasyarat">📦 Prasyarat 2 Menit: Masalahnya Bernama Sensor</h2>
      <div className="callout">
        <p>Semua lesson klasifikasi sejauh ini menjawab <strong>&ldquo;apakah&rdquo;</strong> (default/tidak dalam 12 bulan). Lesson ini menjawab <strong>&ldquo;kapan&rdquo;</strong>: berapa lama hingga default? Masalahnya: untuk banyak nasabah, jawabannya <strong>belum diketahui</strong> — mereka belum default <em>sampai data terakhir diamati</em> (mungkin default tahun depan, mungkin tidak pernah). Data yang &ldquo;terpotong&rdquo; ini disebut <strong>sensor</strong> (<em>censoring</em>) — dan ia bukan missing data biasa (A1.7): kita <em>tahu</em> nasabah itu selamat <em>setidaknya</em> sampai waktu sensor. Membuang mereka = membuang informasi &ldquo;selamat sekian lama&rdquo; = bias. Survival analysis adalah seluruh perangkat untuk memakai informasi parsial ini dengan benar.</p>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 70% Data Dibuang, Kesimpulan Terbalik</h2>
      <div className="story">
        <p>Tim risiko ingin tahu: &ldquo;berapa lama rata-rata nasabah bertahan sebelum default?&rdquo; Analis mengambil data 5 tahun, lalu — agar &ldquo;bersih&rdquo; — <strong>membuang 70% nasabah</strong>: mereka yang belum default (masih aktif) dan yang lunas lebih awal. Dari 30% yang tersisa (yang <em>benar-benar</em> default), rata-rata waktu default = <strong>14 bulan</strong>. Laporan: &ldquo;rata-rata nasabah default dalam 14 bulan!&rdquo; Direksi panik.</p>
        <p>Kesalahan fatal: 70% yang dibuang <strong>bukan sampah</strong> — mereka adalah kabar baik! Nasabah yang masih aktif 5 tahun tanpa default adalah bukti &ldquo;bertahan lama&rdquo;, bukan data rusak. Dengan membuang mereka, analis hanya mengukur <em>yang gagal</em> — seperti mengukur &ldquo;rata-rata umur manusia&rdquo; hanya dari data kuburan.</p>
        <p>Twist-nya: jawaban yang benar memakai <em>semua</em> data termasuk yang tersensor — dan median waktu default-nya ternyata <strong>di atas 60 bulan</strong> (bahkan tidak teramati dalam window!). Metode yang bisa melakukan ini bernama <strong>Kaplan-Meier</strong> — dan lesson ini menjelaskannya dari nol.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="sensor">Sensor — Mengapa Data Survival Istimewa</h2>
      <p><strong>Definisi.</strong> Tiga jenis sensor (yang umum di kredit: <strong>sensor kanan</strong>):</p>
      <ul>
        <li><strong>Sensor kanan</strong> (<em>right censoring</em>): kejadian <strong>belum</strong> terjadi saat pengamatan berakhir. Nasabah masih aktif di bulan ke-36 → kita tahu T &gt; 36, tidak tahu tepatnya. <strong>Ini 90% kasus di kredit.</strong></li>
        <li><strong>Sensor kiri:</strong> kejadian sudah terjadi <em>sebelum</em> pengamatan mulai (T &lt; t₀). Jarang di kredit.</li>
        <li><strong>Sensor interval:</strong> kejadian diketahui terjadi <em>di antara</em> dua pengamatan (t₁ &lt; T &lt; t₂). Misal cek tahunan.</li>
      </ul>
      <p>Setiap observasi = pasangan <Tex math={String.raw`(t_i, \delta_i)`} />: <Tex math={String.raw`t_i`} /> = waktu teramati, <Tex math={String.raw`\delta_i = 1`} /> jika kejadian terjadi, <Tex math={String.raw`0`} /> jika tersensor. <strong>Asumsi kritis:</strong> sensor <em>non-informatif</em> — alasan tersensor tidak berkaitan dengan risiko kejadian (misal nasabah lunas awal karena <em>kaya</em> → sensor informatif → bias!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> data tersensor = &ldquo;setidaknya&rdquo;. Nasabah aktif 36 bulan = &ldquo;T &gt; 36&rdquo; — ini <strong>informasi</strong>, bukan kekosongan. Metode survival memakai ketidaksamaan ini secara eksplisit. Analogi: menebak tinggi badan dari &ldquo;lebih dari 170 cm&rdquo; — kamu tidak tahu tepatnya, tapi kamu tahu ia bukan 150 cm. Membuangnya = membuang bukti.</p>
      </div>

      <h2 id="km">Kaplan-Meier — Kurva Survival Non-Parametrik</h2>
      <p><strong>Definisi.</strong> Fungsi survival <Tex math={String.raw`S(t) = P(T > t)`} /> = probabilitas &ldquo;bertahan&rdquo; melewati waktu <Tex math={String.raw`t`} />. Estimator <strong>Kaplan-Meier</strong> menghitungnya sebagai produk peluang bersyarat di tiap waktu kejadian:</p>
      <Tex math={String.raw`\hat{S}(t) = \prod_{t_i \leq t} \left(1 - \frac{d_i}{n_i}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`d_i`} />: jumlah kejadian (default) <em>tepat</em> di waktu <Tex math={String.raw`t_i`} /></li>
        <li><Tex math={String.raw`n_i`} />: jumlah <strong>at risk</strong> sesaat sebelum <Tex math={String.raw`t_i`} /> — yang masih diamati &amp; belum kejadian (yang tersensor sudah keluar dari sini!)</li>
        <li><Tex math={String.raw`1 - d_i/n_i`} />: peluang selamat <em>melewati</em> titik <Tex math={String.raw`t_i`} /> <em>dengan syarat</em> sudah selamat sampai sana — lalu dikalikan berantai</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: KM manual</summary>
        <p>Data (bulan, event): (3,1), (5,1), (5,0), (6,1), (8,0), (9,1). n = 6.</p>
        <p><strong>t=3:</strong> at risk 6, d=1 → S = 1×(1−1/6) = <strong>0,833</strong><br />
        <strong>t=5:</strong> at risk 5 (satu sudah default), d=1 → S = 0,833×(1−1/5) = <strong>0,667</strong>. Yang tersensor di t=5 <em>tidak</em> mengurangi S — ia hanya keluar dari at-risk berikutnya.<br />
        <strong>t=6:</strong> at risk 3 (6−1−1−1 tersensor), d=1 → S = 0,667×(1−1/3) = <strong>0,444</strong><br />
        <strong>t=9:</strong> at risk 1, d=1 → S = 0,444×0 = <strong>0</strong>.</p>
        <p>Median survival = waktu saat S ≤ 0,5 → antara bulan 6 dan 9 (≈ 6 bulan). Perhatikan: yang tersensor <em>tidak pernah</em> mengurangi S langsung — mereka hanya memperkecil penyebut di masa depan.</p>
      </details>

      <PlotlyChart
        data={kmData}
        title="Kurva Kaplan-Meier: Skor A vs Skor D"
        layout={{ xaxis: { title: "Bulan sejak origination" }, yaxis: { title: "S(t): peluang belum default", range: [0, 1.05] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = waktu (bulan), vertikal = peluang &ldquo;selamat&rdquo; (belum default). Kurva turun tangga (<em>step function</em>) — turun hanya saat ada kejadian.</p>
        <p><strong>Interpretasi:</strong> di bulan 24, S(t) skor A = 55% vs skor D = 31% — separuh lebih kelompok buruk sudah default, kelompok baik mayoritas selamat. <strong>Cara baca median:</strong> tarik garis horizontal di 0,5 → skor D mencapai median (~bulan 12), skor A <em>belum</em> mencapai median dalam 24 bulan. <strong>Uji log-rank</strong> menguji formal apakah dua kurva berbeda signifikan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kurva KM yang datar di akhir berarti tidak ada risiko lagi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ekor kanan kurva KM didukung <strong>sedikit</strong> observasi (banyak yang sudah kejadian/tersensor) — sangat tidak presisi! Interval kepercayaannya melebar drastis di ujung. Jangan membuat klaim &ldquo;setelah 5 tahun aman&rdquo; dari 20 sisa observasi. Aturan praktis: jangan interpretasikan kurva di luar titik di mana at-risk &lt; 10–20.</p>
      </div>

      <h2 id="hazard">Hazard Function — Laju Kejadian Saat Ini</h2>
      <p><strong>Definisi.</strong> Fungsi hazard <Tex math={String.raw`h(t)`} /> = laju kejadian <em>sesaat</em> dengan syarat sudah selamat sampai <Tex math={String.raw`t`} />:</p>
      <Tex math={String.raw`h(t) = \lim_{\Delta t \to 0} \frac{P(t \leq T < t+\Delta t \mid T \geq t)}{\Delta t}, \qquad S(t) = \exp\left(-\int_0^t h(u)\,du\right)`} block />
      <p><strong>Artinya:</strong> jika S(t) = &ldquo;peluang masih hidup sampai t&rdquo;, maka h(t) = &ldquo;seberapa deras yang berguguran <em>tepat</em> di t, di antara yang masih hidup&rdquo;. Keduanya ekuivalen (satu menentukan yang lain), tapi hazard lebih natural untuk <em>pemodelan</em> — karena kovariat (skor, LTV) paling mudah dimodelkan sebagai pengali laju.</p>

      <PlotlyChart
        data={hazardData}
        title="Hazard Rate: KTA vs KPR (12 bulan pertama)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Hazard (laju default sesaat)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = estimasi laju default di bulan itu, di antara yang masih aktif.</p>
        <p><strong>Interpretasi:</strong> hazard KTA (kuning) jauh lebih tinggi di bulan-bulan awal lalu menurun — pola &ldquo;seleksi alam&rdquo;: yang lemah gugur duluan. Hazard KPR (biru) rendah dan datar. <strong>Implikasi vintage:</strong> portofolio KTA muda = risiko tinggi; jangan bandingkan default rate KTA umur 3 bulan vs KPR umur 3 tahun tanpa penyesuaian waktu!</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> S(t) menjawab &ldquo;berapa % yang masih selamat?&rdquo; (kumulatif, untuk laporan), h(t) menjawab &ldquo;seberapa bahaya <em>sekarang</em>?&rdquo; (sesaat, untuk modeling &amp; pricing). Analogi asuransi: S(t) = peluang mobilmu belum kecelakaan tahun ini; h(t) = laju kecelakaan <em>per km saat ini</em> (naik saat hujan!). Premi dihitung dari hazard, bukan dari survival.</p>
      </div>

      <h2 id="cox">Cox Proportional Hazards — Regresi untuk Waktu</h2>
      <p><strong>Definisi.</strong> Model Cox memodelkan hazard sebagai baseline × pengali kovariat:</p>
      <Tex math={String.raw`h(t \mid x) = h_0(t) \cdot \exp(\beta_1 x_1 + \cdots + \beta_k x_k)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`h_0(t)`} />: <strong>baseline hazard</strong> — laju untuk profil referensi (x=0); bentuknya <em>bebas</em> (tidak diasumsikan!) — inilah &ldquo;semi-parametrik&rdquo;</li>
        <li><Tex math={String.raw`e^{\beta_j}`} />: <strong>hazard ratio</strong> — pengali laju per 1 satuan <Tex math={String.raw`x_j`} />. HR = 2 → laju default 2× lipat <em>di setiap titik waktu</em></li>
        <li><strong>Asumsi proportional hazards (PH):</strong> rasio hazard antar dua profil <strong>konstan sepanjang waktu</strong> — kurva hazard boleh naik-turun, tapi <em>rasionya</em> tetap</li>
      </ul>
      <p><strong>Estimasi via partial likelihood:</strong> Cox brilian — <Tex math={String.raw`\beta`} /> bisa diestimasi <em>tanpa</em> mengestimasi <Tex math={String.raw`h_0(t)`} />! Idenya: pada tiap waktu kejadian, &ldquo;dari semua yang at risk saat itu, seberapa mungkin yang kejadian adalah dia (dengan kovariatnya)?&rdquo; — hanya <strong>urutan</strong> kejadian yang dipakai, bukan waktu persisnya.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca hazard ratio</summary>
        <p>Model Cox: <Tex math={String.raw`\beta_{LTV} = 0{,}02`} /> (per 1 poin LTV), <Tex math={String.raw`\beta_{skor\_baik} = -0{,}9`} />.</p>
        <p><strong>Langkah 1</strong> — HR LTV = e<sup>0,02</sup> ≈ 1,02 per poin; per 10 poin = e<sup>0,2</sup> ≈ <strong>1,22</strong> (laju default 22% lebih tinggi).<br />
        <strong>Langkah 2</strong> — HR skor baik = e<sup>−0,9</sup> ≈ <strong>0,41</strong>: laju default 59% lebih rendah, <em>kapan pun</em> dalam periode.<br />
        <strong>Langkah 3</strong> — &ldquo;kapan pun&rdquo; adalah asumsi PH — wajib diuji! Jika kurva KM dua kelompok <strong>bersilangan</strong>, asumsi rusak (efek berubah seiring waktu) → butuh interaksi dengan waktu atau model stratifikasi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Hazard ratio 2 berarti peluang default 2× lipat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> HR = rasio <em>laju sesaat</em>, bukan rasio <em>probabilitas kumulatif</em>. HR 2 tidak berarti &ldquo;PD 12-bulan 2× lipat&rdquo; — hubungan HR ke probabilitas tergantung baseline hazard dan horizon (via rumus S(t) = exp(−∫h)). Untuk pernyataan probabilitas, hitung kurva survival prediksi dari model Cox, jangan kalikan HR mentah-mentah.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Uji asumsi PH — wajib!</strong> (1) Plot log(−log(S(t))) vs log(t) per kelompok — harus <strong>sejajar</strong> (tidak bersilangan). (2) Uji Schoenfeld residuals — korelasi residual dengan waktu harus ≈ 0. Jika dilanggar: tambahkan interaksi kovariat×waktu, atau stratifikasi Cox per kelompok. Cox dengan PH rusak = koefisien rata-rata yang menyesatkan.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Survival = &ldquo;kapan&rdquo;, bukan &ldquo;apakah&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Kaplan-Meier — 10 kredit, 3 sensor</summary>
              <p>10 kredit diamati 12 bulan. Macet di bulan 3, 7, 9. Lunas (sensor!) di bulan 5, 10, 12. Berapa S(6) = peluang &ldquo;selamat&rdquo; sampai bulan 6?</p>
              <p><strong>Langkah 1</strong> — KM: S(t) = Π (1 − d<sub>i</sub>/n<sub>i</sub>). Bulan 3: 1 − 1/10 = 0,9.<br />
              <strong>Langkah 2</strong> — bulan 5: 1 lunas (sensor) → n berkurang (9) tapi S <em>tidak</em> turun (sensor ≠ kejadian!).<br />
              <strong>Langkah 3</strong> — S(6) = 0,9 × (1 − 0/9) = <strong>0,9</strong>. (Bulan 7: 0,9 × (1 − 1/8) = 0,7875.)</p>
              <p>Pelajaran: sensor = &ldquo;keluar observasi tanpa kejadian&rdquo; — mengurangi <em>penyebut</em> (n), bukan menambah <em>pembilang</em> (d). Salah perlakukan sensor sebagai &ldquo;selamat&rdquo; = bias!</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Hazard ratio — Cox model</summary>
              <p>Model Cox: <code className="inline">macet ~ dpd30 + penghasilan</code>. HR dpd30 = 2,5; HR penghasilan (per 1jt) = 0,97. Interpretasikan.</p>
              <p><strong>Langkah 1</strong> — HR 2,5: yang pernah telat 30 hari punya <em>laju</em> macet 2,5× lipat <em>setiap saat</em> (proporsional!).<br />
              <strong>Langkah 2</strong> — HR 0,97: tiap +Rp1jt penghasilan → hazard turun 3%.<br />
              <strong>Langkah 3</strong> — cek asumsi: <em>proportional hazards</em> — rasio hazard konstan waktu. Jika kurva KM bersilangan → asumsi jebol → stratifikasi!</p>
              <p>Pelajaran: HR = &ldquo;risiko relatif per satuan waktu&rdquo;. Beda dengan odds ratio (logistik): HR untuk <em>kapan</em>, OR untuk <em>apakah</em>.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Kaplan-Meier dari Nol</h2>
      <p>Hitung produk-limit estimator langkah-demi-langkah. Rasakan peran &ldquo;at risk&rdquo; dan sensor.</p>
      <PyodideLab
        title="Lab 1 — Estimator Kaplan-Meier Manual"
        hint="Coba: ubah semua event jadi 1 (tanpa sensor). S(24) anjlok — sensor yang diabaikan = bias."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Cox PH dari Nol (Partial Likelihood)</h2>
      <p>Estimasi hazard ratio tanpa mengestimasi baseline hazard — keajaiban partial likelihood.</p>
      <PyodideLab
        title="Lab 2 — Cox Partial Likelihood (1 Kovariat)"
        hint="Coba: naikkan laju sensor 0.03 → 0.15. Estimasi goyang — informasi datang dari EVENT."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Survival Analysis?</h2>

      <div className="decision-card">
        <h3>1. Pertanyaan &ldquo;kapan&rdquo; + banyak sensor → <strong>survival analysis (KM/Cox)</strong></h3>
        <p><strong>Kondisi:</strong> target = waktu hingga kejadian; sebagian observasi belum kejadian.</p>
        <p><strong>Kenapa:</strong> satu-satunya kerangka yang memakai informasi &ldquo;setidaknya&rdquo; dengan benar.</p>
        <p><strong>Contoh nyata:</strong> time-to-default KPR, churn pelanggan, time-to-recovery.</p>
      </div>

      <div className="decision-card">
        <h3>2. Hanya butuh bandingkan dua kelompok → <strong>KM + uji log-rank</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada kovariat kontinu; pertanyaan deskriptif.</p>
        <p><strong>Kenapa:</strong> non-parametrik — tanpa asumsi distribusi waktu.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;apakah vintage 2023 lebih buruk dari 2022?&rdquo;</p>
      </div>

      <div className="decision-card">
        <h3>3. Banyak kovariat, efek proporsional → <strong>Cox PH</strong></h3>
        <p><strong>Kondisi:</strong> ingin hazard ratio per variabel; asumsi PH terpenuhi.</p>
        <p><strong>Kenapa:</strong> semi-parametrik — tidak perlu asumsi bentuk baseline hazard.</p>
        <p><strong>Contoh nyata:</strong> model PD berbasis waktu dengan 20 variabel.</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh kurva survival absolut parametrik → <strong>Weibull/exponential AFT</strong></h3>
        <p><strong>Kondisi:</strong> butuh ekstrapolasi di luar window observasi; asumsi distribusi masuk akal.</p>
        <p><strong>Kenapa:</strong> parametrik memberi formula S(t) tertutup — bisa ekstrapolasi (dengan risiko!).</p>
        <p><strong>Contoh nyata:</strong> proyeksi lifetime ECL IFRS 9.</p>
      </div>

      <div className="decision-card">
        <h3>5. Ada &ldquo;kejadian kompeting&rdquo; (lunas vs default) → <strong>competing risks</strong></h3>
        <p><strong>Kondisi:</strong> nasabah bisa &ldquo;keluar&rdquo; via beberapa cara yang saling meniadakan.</p>
        <p><strong>Kenapa:</strong> KM biasa overestimate jika competing event dianggap sensor biasa. Pakai cumulative incidence function.</p>
        <p><strong>Contoh nyata:</strong> KPR: default vs pelunasan dipercepat.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Jangan buang yang tersensor</strong> — mereka adalah informasi &ldquo;setidaknya&rdquo;.</li>
          <li>S(t) untuk laporan, h(t) untuk modeling. HR = rasio laju, bukan rasio probabilitas.</li>
          <li>Cox wajib uji PH (Schoenfeld). Kurva bersilangan = asumsi rusak.</li>
          <li>Jangan baca ekor KM yang at-risk-nya tinggal sedikit.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Vintage Analysis Portofolio KPR</h2>
      <div className="callout">
        <p>Direksi khawatir: &ldquo;default rate vintage 2024 (2,1%) lebih tinggi dari vintage 2022 (1,8%) — kualitas underwriting memburuk?&rdquo; Kamu curiga ada <strong>bias waktu</strong>: vintage 2024 umurnya baru 18 bulan (periode rawan!), vintage 2022 sudah 42 bulan.</p>
        <p>Kamu buat kurva KM per vintage + model Cox dengan kovariat (LTV, skor, tenor) + dummy vintage. Hasil: kurva KM 2024 vs 2022 <strong>hampir berhimpit</strong> setelah penyesuaian umur; uji log-rank p = 0,34; HR vintage2024 = 1,08 (p = 0,28).</p>
        <p><strong>Pertanyaan:</strong> (a) Jelaskan ke direksi mengapa perbandingan &ldquo;default rate mentah&rdquo; menyesatkan. (b) Apa kesimpulan yang benar? (c) Kapan vintage analysis butuh competing risks?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Perbandingan apel vs jeruk temporal:</strong> default rate mentah mencampur <em>umur</em> portofolio dengan <em>kualitas</em>. Vintage muda selalu terlihat lebih buruk karena hazard tinggi di awal (lihat chart hazard!) — seperti membandingkan &ldquo;angka kematian&rdquo; panti jompo vs TK tanpa penyesuaian umur. KM membandingkan pada <em>umur yang sama</em> — apel vs apel.</p>
          <p>(b) <strong>Tidak ada bukti penurunan kualitas</strong> — perbedaan 2,1% vs 1,8% dijelaskan sepenuhnya oleh perbedaan umur. Keputusan: jangan ketatkan underwriting berdasarkan angka mentah; lanjutkan monitoring KM per vintage kuartalan.</p>
          <p>(c) Jika banyak nasabah <strong>lunas dipercepat</strong> (refinancing), &ldquo;lunas&rdquo; adalah competing risk terhadap &ldquo;default&rdquo; — KM biasa yang menganggapnya sensor biasa akan <strong>overestimate</strong> probabilitas default. Pakai cumulative incidence function.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Mengapa regresi biasa (OLS) <em>salah</em> untuk &ldquo;waktu sampai macet&rdquo;? (2 alasan.)</li>
              <li>Log-rank test: kapan dipakai? (1 kalimat.)</li>
              <li>Competing risk: nasabah bisa &ldquo;macet&rdquo; atau &ldquo;lunas dipercepat&rdquo;. Mengapa KM standar bias di sini?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) <strong>Sensor</strong>: OLS tidak tahu cara menangani &ldquo;belum macet saat observasi berakhir&rdquo; (buang = bias; anggap selamat selamanya = bias). (b) <strong>Distribusi miring</strong>: waktu ≥ 0 &amp; miring kanan — asumsi Normal jebol.</p>
              <p><strong>2.</strong> Untuk <strong>membandingkan dua kurva survival</strong> (&ldquo;apakah KM grup A ≠ grup B?&rdquo;) — padanan nonparametrik uji-t untuk data tersensor.</p>
              <p><strong>3.</strong> KM mengasumsikan sensor <em>non-informatif</em>; tapi &ldquo;lunas dipercepat&rdquo; <em>mencegah</em> macet (bukan sekadar &ldquo;keluar observasi&rdquo;) → KM over-estimasi P(macet). Solusi: <strong>competing risks</strong> (cumulative incidence function).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 70% nasabah belum default/lunas di akhir window. Analis membuang mereka dan menghitung rata-rata waktu default dari sisanya. Masalah?"
        options={[
          "Tidak ada — data bersih",
          "Bias seleksi parah: yang dibuang adalah kabar baik ('bertahan lama'). Rata-rata dari yang gagal saja = seperti mengukur umur dari data kuburan",
          "Sample terlalu kecil",
          "Harus pakai median",
        ]}
        correct={1}
        explanation="Benar: ini bias seleksi klasik. Data tersensor mengandung informasi 'setidaknya selama ini selamat'. Kaplan-Meier memakai semuanya dengan benar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam perhitungan KM, apa peran observasi tersensor?"
        options={[
          "Mengurangi S(t) langsung",
          "Tidak dipakai sama sekali",
          "Keluar dari 'at risk' untuk waktu berikutnya TANPA mengurangi S(t) — mereka berkontribusi informasi 'selamat sampai sini'",
          "Dianggap kejadian",
        ]}
        correct={2}
        explanation="Benar: tersensor ≠ gagal. Mereka mengurangi penyebut (at risk) di masa depan tapi tidak mengurangi pembilang. Inilah cara KM memakai informasi parsial secara tepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. HR = 0,41 untuk 'skor baik vs buruk'. Interpretasi TEPAT?"
        options={[
          "Peluang default 59% lebih rendah",
          "Laju (hazard) default 59% lebih rendah pada setiap titik waktu — dengan asumsi proportional hazards",
          "PD 12-bulan = 41% dari kelompok buruk",
          "Tidak ada efek",
        ]}
        correct={1}
        explanation="Benar: HR = rasio laju sesaat, bukan rasio probabilitas. 'Pada setiap titik waktu' = asumsi PH yang wajib diuji. Untuk probabilitas kumulatif, hitung dari kurva survival prediksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kurva KM dua kelompok BERSILANGAN di bulan 18. Implikasi untuk model Cox?"
        options={[
          "Tidak ada — Cox selalu valid",
          "Asumsi proportional hazards RUSAK (efek berubah seiring waktu) — butuh interaksi dengan waktu atau stratifikasi",
          "Naikkan sampel",
          "Ganti ke logistik",
        ]}
        correct={1}
        explanation="Benar: PH = rasio hazard konstan. Kurva bersilangan = rasio berubah tanda = pelanggaran nyata. Solusi: interaksi kovariat×waktu, atau Cox stratifikasi per kelompok."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan S(t) = P(T>t) dan h(t) masing-masing lebih berguna?"
        options={[
          "Sama saja",
          "S(t) untuk laporan/deskripsi ('berapa % selamat sampai 2 tahun'); h(t) untuk modeling/pricing ('seberapa bahaya sekarang')",
          "h(t) untuk laporan",
          "S(t) tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: S = kumulatif (komunikasi), h = sesaat (mesin modeling — kovariat paling natural sebagai pengali laju). Premi asuransi dihitung dari hazard."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Banyak nasabah KPR lunas dipercepat (refinancing). KM biasa untuk probabilitas default akan?"
        options={[
          "Tepat — lunas = sensor biasa",
          "Overestimate — 'lunas' adalah competing risk, bukan sensor non-informatif. Butuh cumulative incidence function",
          "Underestimate",
          "Tidak terpengaruh",
        ]}
        correct={1}
        explanation="Benar: yang lunas dipercepat tidak lagi 'berisiko default' — mereka keluar via jalur lain. Menganggapnya sensor biasa (masih berisiko) melebih-lebihkan probabilitas default. Competing risks memodelkan tiap jalur keluar secara eksplisit."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Sensor kanan:</strong> <Tex math={String.raw`(t_i, \delta_i)`} /> — &ldquo;setidaknya&rdquo; adalah informasi. Jangan buang; asumsi non-informatif wajib dicek.</li>
          <li><strong>Kaplan-Meier:</strong> <Tex math={String.raw`\hat{S}(t)=\prod(1-d_i/n_i)`} /> — produk peluang bersyarat; tersensor keluar dari at-risk tanpa mengurangi S.</li>
          <li><strong>Hazard</strong> = laju sesaat (<em>given</em> selamat sampai t); <strong>Cox PH</strong> = <Tex math={String.raw`h_0(t)e^{x'\beta}`} />; HR = pengali laju.</li>
          <li><strong>Uji PH</strong> (Schoenfeld); kurva bersilangan = asumsi rusak. Waspadai ekor KM yang sepi.</li>
          <li><strong>Jangan</strong> bandingkan default rate mentah antar vintage beda umur; jangan samakan HR dengan rasio probabilitas.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a311-pca-clustering" className="btn btn-secondary btn-sm">← A3.11</Link>
        <Link href="/learn/a313-kausal" className="btn btn-primary btn-sm">Next: A3.13 →</Link>
      </div>
    </div>
  );
}
