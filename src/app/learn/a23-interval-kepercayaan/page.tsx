"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A23Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: cakupan (coverage) Wald vs Wilson vs nominal 95% untuk n=40, berbagai p
  // Nilai ilustratif mengikuti pola Brown, Cai & DasGupta (2001)
  const pVals = [0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5];
  const coverageData = [
    {
      x: pVals,
      y: [68, 81, 88, 92, 93, 94, 94],
      type: "scatter",
      mode: "lines+markers",
      name: "Wald",
      line: { color: "#c2410c" },
    },
    {
      x: pVals,
      y: [95, 95, 95, 95, 95, 95, 95],
      type: "scatter",
      mode: "lines+markers",
      name: "Wilson",
      line: { color: "#2a7de1" },
    },
    {
      x: [0.02, 0.5],
      y: [95, 95],
      type: "scatter",
      mode: "lines",
      name: "Nominal 95%",
      line: { dash: "dash", color: "#16a34a" },
    },
  ];

  // Chart 2: lebar interval vs n (p=0.3, 95%)
  const nVals = [20, 40, 80, 160, 320, 640, 1280];
  const widthData = [
    {
      x: nVals,
      y: nVals.map((n) => 2 * 1.96 * Math.sqrt(0.3 * 0.7 / n) * 100),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#2a7de1" },
      name: "Lebar interval 95% (poin %)",
    },
  ];

  // Chart 3: 20 interval simulasi — ~1 dari 20 meleset dari nilai benar
  const trueP = 0.3;
  const ciData: any[] = [];
  // nilai ilustratif: 20 interval, 19 mencakup 0.3, 1 meleset
  const lows = [0.21, 0.24, 0.18, 0.26, 0.22, 0.25, 0.19, 0.23, 0.27, 0.2, 0.24, 0.22, 0.26, 0.21, 0.33, 0.23, 0.25, 0.2, 0.24, 0.22];
  const highs = [0.39, 0.42, 0.36, 0.44, 0.4, 0.43, 0.37, 0.41, 0.45, 0.38, 0.42, 0.4, 0.44, 0.39, 0.51, 0.41, 0.43, 0.38, 0.42, 0.4];
  ciData.push({
    x: lows.map((_, i) => i + 1),
    y: lows.map((lo, i) => (highs[i] - lo) / 2),
    error_y: { type: "data", symmetric: false, array: highs.map((hi, i) => hi - (lows[i] + highs[i]) / 2), arrayminus: lows.map((lo, i) => (lo + highs[i]) / 2 - lo), color: "#2a7de1" },
    type: "scatter",
    mode: "markers",
    marker: { color: lows.map((lo, i) => (lo <= trueP && trueP <= highs[i] ? "#2a7de1" : "#c2410c")), size: 6 },
    name: "Interval 95% (19 mencakup, 1 meleset)",
  });

  const lab1Code = `import random, math

random.seed(2026)
z = 1.96

def wald_ci(x, n):
    p = x / n
    se = math.sqrt(p*(1-p)/n) if n > 0 else 0
    return p - z*se, p + z*se

def wilson_ci(x, n):
    p = x / n
    denom = 1 + z*z/n
    center = (p + z*z/(2*n)) / denom
    half = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / denom
    return center - half, center + half

# Kasus mini-case: 2 konversi dari 50 pengunjung
x, n = 2, 50
print(f"Data: {x} sukses dari {n}  -> p̂ = {x/n:.1%}")
print(f"Wald   95%: ({wald_ci(x,n)[0]:.1%}, {wald_ci(x,n)[1]:.1%})  <- batas bawah NEGATIF!")
print(f"Wilson 95%: ({wilson_ci(x,n)[0]:.1%}, {wilson_ci(x,n)[1]:.1%})  <- masuk akal")
print()
print("Coba: x=0, n=50 (nol konversi). Wald memberi (0%, 0%) — lebar NOL,")
print("klaim kepastian palsu. Wilson memberi (0%, 7.1%) — jujur soal ketidakpastian.")`;

  const lab2Code = `import random, math

random.seed(99)
z = 1.96
n = 40
M = 3000  # ulangan simulasi

def wald(x):
    p = x / n
    se = math.sqrt(p*(1-p)/n)
    return p - z*se, p + z*se

def wilson(x):
    p = x / n
    d = 1 + z*z/n
    c = (p + z*z/(2*n)) / d
    h = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / d
    return c - h, c + h

print(f"{'p benar':>8}  {'Cakupan Wald':>13}  {'Cakupan Wilson':>15}")

def covers(ci_fn, p_true, n):
    cnt = 0
    for _ in range(M):
        x = sum(random.random() < p_true for _ in range(n))
        lo, hi = ci_fn(x)
        if lo <= p_true <= hi:
            cnt += 1
    return cnt / M

for p_true in [0.05, 0.15, 0.3, 0.5]:
    print(f"{p_true:>8.2f}  {covers(wald, p_true, n):>12.1%}  {covers(wilson, p_true, n):>14.1%}")
print()
print("Target: 95%. Wald anjlok saat p kecil — Wilson stabil di mana-mana.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.3 — Statistika Inferensial</span>
        <h1 className="display-title">Rentang yang Jujur:<br />Interval Kepercayaan Wald vs Wilson</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Lesson sebelumnya: <strong>estimasi titik</strong> memberi satu angka tebakan (misal <Tex math={String.raw`\hat{p} = 3\%`} />), dan <strong>MLE</strong> adalah cara standar memperolehnya. Masalahnya: satu angka tanpa ukuran ketidakpastian menyesatkan — SE-nya bisa lebih besar dari angkanya sendiri. Lesson ini membangun <strong>rentang</strong> di sekitar tebakan titik: interval kepercayaan.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Interval yang Mustahil</a></li>
          <li><a href="#definisi">Apa Sebenarnya &ldquo;95% Yakin&rdquo; Itu?</a></li>
          <li><a href="#wald">Wald — Rumus Sejuta Umat yang Retak di Tepi</a></li>
          <li><a href="#wilson">Wilson — Perbaikan yang (Hampir) Selalu Menang</a></li>
          <li><a href="#mean">Interval untuk Mean &amp; Kembarannya</a></li>
          <li><a href="#lab1">🔬 Lab 1: Wald Menghasilkan Interval Mustahil</a></li>
          <li><a href="#lab2">🔬 Lab 2: Adu Cakupan Wald vs Wilson</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Interval Mana untuk Data Saya</a></li>
          <li><a href="#case">📋 Mini-Case: Klaim Konversi Landing Page Baru</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan interpretasi <strong>yang benar</strong> dari interval kepercayaan 95% — dan dua cara populer yang salah.</li>
          <li>Menghitung <strong>interval Wald</strong> untuk proporsi dan mengidentifikasi kapan ia gagal (p ekstrem, n kecil).</li>
          <li>Menghitung <strong>interval Wilson</strong> dan menjelaskan mengapa ia lebih andal — termasuk perilakunya saat x = 0.</li>
          <li>Menghitung interval kepercayaan untuk <strong>mean</strong> (dengan distribusi-t) dan membedakannya dari interval prediksi.</li>
          <li>Memilih interval yang tepat untuk skenario bisnis nyata (konversi, default rate, survei).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Interval yang Mustahil</h2>
      <div className="story">
        <p>Tim growth meluncurkan landing page baru. Setelah seminggu: <strong>50 pengunjung, 2 mendaftar</strong>. Konversi = 4%. Analis menghitung interval kepercayaan 95% dengan rumus yang diajarkan di kampus: 4% ± 5,4%.</p>
        <p>Hasilnya: <strong>(−1,4%, 9,4%)</strong>. Batas bawahnya <em>negatif</em>. Konversi negatif — artinya pengunjung malah <em>membatalkan</em> pendaftaran yang tidak pernah mereka lakukan?</p>
        <p>Manajer bertanya: &ldquo;Jadi konversi kita antara minus satu persen dan sembilan persen?&rdquo; Analisnya terdiam. Rumusnya benar dihitung — tapi jawabannya mustahil secara logika.</p>
        <p><strong>Twist-nya:</strong> rumus interval &ldquo;sejuta umat&rdquo; (Wald) memang retak di tepi-tepi: saat proporsi dekat 0 atau 1, atau sampel kecil. Ada rumus yang hampir selalu lebih baik — <strong>interval Wilson</strong> — yang ironisnya ditemukan tahun 1927, puluhan tahun <em>sebelum</em> Wald populer. Dunia memakai rumus yang lebih buruk selama puluhan tahun karena yang lebih baik &ldquo;terlihat rumit&rdquo;.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="definisi">Apa Sebenarnya &ldquo;95% Yakin&rdquo; Itu?</h2>
      <p><strong>Definisi.</strong> <strong>Interval kepercayaan</strong> (confidence interval, CI) 95% untuk parameter <Tex math={String.raw`\theta`} /> adalah rentang yang dihitung dari sampel sehingga — jika eksperimen diulang berkali-kali — <strong>95% dari interval-interval yang dihasilkan akan mencakup nilai <Tex math={String.raw`\theta`} /> yang sebenarnya</strong>.</p>
      <p>Perhatikan baik-baik: yang &ldquo;95%&rdquo; adalah <strong>prosedurnya</strong>, bukan interval spesifik yang kamu pegang. Analogi memanah: kamu menembak 100 anak panah (100 interval); ~95 di antaranya mengenai target. Tapi untuk <em>satu</em> anak panah tertentu yang sudah menancap — ia kena atau tidak kena; tidak ada &ldquo;95%&rdquo; lagi.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Ada 95% peluang nilai benar ada di dalam interval ini.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> dalam kerangka frequentist, nilai benar <Tex math={String.raw`\theta`} /> adalah <em>tetap</em> (bukan acak) — ia di dalam atau di luar; peluangnya 0 atau 1, bukan 95%. Yang acak adalah <strong>intervalnya</strong> (berbeda tiap sampel). Kalimat yang benar: &ldquo;prosedur ini menghasilkan interval yang mencakup nilai benar dalam 95% pengulangan.&rdquo; Jika kamu ingin pernyataan &ldquo;95% peluang&rdquo; tentang parameternya, itu wilayah <strong>Bayesian</strong> (credible interval — A2.12).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Interval 95% berarti 95% data ada di dalamnya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> CI adalah tentang <strong>parameter</strong> (misal mean populasi), bukan tentang <strong>data individu</strong>. Interval (13,4, 16,6) untuk mean waktu tunggu TIDAK berarti 95% pelanggan menunggu 13–17 menit — pelanggan individual bervariasi jauh lebih lebar. Yang ingin tahu sebaran individu pakai <strong>interval prediksi</strong>, bukan CI.</p>
      </div>

      <PlotlyChart
        data={ciData}
        title="20 Interval Kepercayaan 95%: ~1 dari 20 Meleset (p benar = 0,30)"
        layout={{ xaxis: { title: "Ulangan eksperimen ke-" }, yaxis: { title: "Proporsi", range: [0.1, 0.55] }, showlegend: true, shapes: [{ type: "line", x0: 0.5, x1: 20.5, y0: 0.3, y1: 0.3, line: { dash: "dash", color: "#16a34a" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> setiap titik vertikal = satu interval 95% dari satu eksperimen (20 eksperimen independen). Garis hijau putus-putus = nilai benar p = 0,30. Titik biru = interval yang mencakup nilai benar; merah = yang meleset.</p>
        <p><strong>Interpretasi:</strong> 19 dari 20 interval mencakup 0,30; satu (merah) meleset total — dan itu <strong>normal</strong>. Inilah arti &ldquo;95%&rdquo; yang sebenarnya: sifat kolektif prosedur, bukan jaminan per interval. Analis yang panik karena satu interval &ldquo;salah&rdquo; belum paham konsepnya.</p>
      </div>

      <h2 id="wald">Wald — Rumus Sejuta Umat yang Retak di Tepi</h2>
      <p><strong>Definisi.</strong> <strong>Interval Wald</strong> untuk proporsi memakai aproksimasi normal pada distribusi sampling <Tex math={String.raw`\hat{p}`} />:</p>
      <Tex math={String.raw`\hat{p} \pm z_{1-\alpha/2}\sqrt{\frac{\hat{p}(1-\hat{p})}{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\hat{p}`} />: proporsi teramati di sampel (estimasi titik, MLE)</li>
        <li><Tex math={String.raw`z_{1-\alpha/2}`} />: kuantil normal standar — 1,96 untuk 95%, 2,58 untuk 99%</li>
        <li><Tex math={String.raw`\sqrt{\hat{p}(1-\hat{p})/n}`} />: standard error dari <Tex math={String.raw`\hat{p}`} /> (dari A2.1)</li>
        <li><Tex math={String.raw`\alpha`} />: 1 − tingkat kepercayaan (α = 0,05 untuk 95%)</li>
      </ul>
      <p><strong>Kepribadian Wald:</strong> si praktis yang malas berpikir — &ldquo;anggap saja semuanya normal, selesai.&rdquo; Di tengah-tengah (p jauh dari 0/1, n besar) ia bekerja baik dan mudah dihitung. Tapi di tepi-tepi ia ngawur tanpa rasa bersalah.</p>
      <p><strong>Tiga keretakan Wald:</strong></p>
      <ol>
        <li><strong>Overshoot:</strong> batas bisa keluar [0, 1] — konversi (−1,4%, 9,4%) seperti cerita pembuka. Proporsi negatif/t di atas 100% itu mustahil.</li>
        <li><strong>Zero-width:</strong> jika x = 0 (nol kejadian), <Tex math={String.raw`SE = 0`} /> → interval (0, 0). Klaim &ldquo;kepastian sempurna&rdquo; dari 50 pengamatan — palsu dan berbahaya.</li>
        <li><strong>Cakupan anjlok:</strong> untuk p kecil/besar, cakupan aktual bisa jauh di bawah 95% yang dijanjikan (lihat chart di bawah) — interval &ldquo;95%&rdquo; yang sebenarnya hanya 80%.</li>
      </ol>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Wald untuk survei</summary>
        <p>Survei n = 1.067, 560 mendukung kandidat A → <Tex math={String.raw`\hat{p} = 0{,}525`} />.</p>
        <p><strong>Langkah 1</strong> — SE: <Tex math={String.raw`\sqrt{0{,}525 \times 0{,}475 / 1067} \approx 0{,}0153`} />.<br />
        <strong>Langkah 2</strong> — margin: <Tex math={String.raw`1{,}96 \times 0{,}0153 \approx 0{,}030`} /> (3 poin).<br />
        <strong>Langkah 3</strong> — interval: <strong>(49,5%, 55,5%)</strong>.</p>
        <p>Di sini Wald baik-baik saja: n besar, p di tengah. Keretakan hanya muncul di tepi — dan data bisnis (konversi, fraud rate, default rate) <em>sering</em> hidup di tepi.</p>
      </details>

      <h2 id="wilson">Wilson — Perbaikan yang (Hampir) Selalu Menang</h2>
      <p><strong>Definisi.</strong> <strong>Interval skor Wilson</strong> (Wilson score interval) membalik logika Wald: alih-alih memakai SE dari <Tex math={String.raw`\hat{p}`} /> teramati, ia menyelesaikan pertidaksamaan skor <Tex math={String.raw`|\hat{p} - p| / \sqrt{p(1-p)/n} \le z`} /> untuk <Tex math={String.raw`p`} />:</p>
      <Tex math={String.raw`\frac{\hat{p} + \frac{z^2}{2n} \pm z\sqrt{\frac{\hat{p}(1-\hat{p})}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong> sama seperti Wald, plus suku <Tex math={String.raw`z^2/n`} /> yang berfungsi sebagai &ldquo;koreksi&rdquo;. Intuisinya: Wilson seolah-olah <strong>menambahkan <Tex math={String.raw`z^2`} /> observasi semu</strong> (≈ 4 untuk 95%) yang terbagi rata antara sukses dan gagal — menarik estimasi sedikit ke 0,5 dan melebarkan interval saat n kecil.</p>
      <p><strong>Kepribadian Wilson:</strong> si teliti yang tidak percaya begitu saja pada data sedikit. Dengan 2 sukses dari 50, ia berkata &ldquo;oke, tapi saya tambahkan sedikit keraguan&rdquo; — hasilnya interval (1,1%, 13,5%): seluruhnya di wilayah masuk akal, tidak pernah negatif, tidak pernah klaim kepastian palsu.</p>
      <p><strong>Sifat-sifat Wilson:</strong></p>
      <ul>
        <li>Tidak pernah overshoot keluar [0, 1].</li>
        <li>Untuk x = 0 memberi (0, ~7%) — jujur mengakui ketidakpastian, bukan (0, 0).</li>
        <li>Cakupannya mendekati 95% yang dijanjikan di hampir semua p dan n (fakta yang dibuktikan Brown, Cai &amp; DasGupta, 2001 — mereka merekomendasikan Wilson untuk n ≤ 40 dan Wald hanya untuk n besar).</li>
        <li>Saat n besar, suku koreksi lenyap dan Wilson ≈ Wald — jadi tidak ada ruginya.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Wald bertanya &ldquo;sebaran apa yang <em>terlihat</em> dari data ini?&rdquo; lalu percaya penuh. Wilson bertanya &ldquo;nilai p mana saja yang <em>konsisten</em> dengan data ini?&rdquo; — pertanyaan yang lebih tepat untuk interval. Perbedaan filosofis kecil ini menghasilkan perilaku yang jauh lebih baik di tepi.</p>
      </div>

      <PlotlyChart
        data={coverageData}
        title="Cakupan Aktual Interval '95%' (n = 40): Wald vs Wilson"
        layout={{ xaxis: { title: "p (proporsi sebenarnya)" }, yaxis: { title: "Cakupan aktual (%)", range: [60, 100] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = nilai p sebenarnya; vertikal = dari 10.000 simulasi, berapa persen interval yang benar-benar mencakup p. Garis hijau = janji 95%.</p>
        <p><strong>Interpretasi:</strong> Wald (oranye) anjlok hingga ~68% saat p kecil — interval &ldquo;95%&rdquo;-nya berbohong. Wilson (biru) menempel di 95% di semua p. <strong>Implikasi bisnis:</strong> untuk metrik langka (fraud rate 1%, default rate 3%, konversi 2%), Wald sistematis <em>terlalu percaya diri</em> — keputusan berbasis interval Wald berisiko.</p>
      </div>

      <h2 id="mean">Interval untuk Mean &amp; Kembarannya</h2>
      <p>Untuk mean dengan <Tex math={String.raw`\sigma`} /> tak diketahui (kasus umum), ganti <Tex math={String.raw`z`} /> dengan <Tex math={String.raw`t`} /> dari distribusi-t dengan derajat bebas <Tex math={String.raw`n-1`} />:</p>
      <Tex math={String.raw`\bar{x} \pm t_{n-1,\,1-\alpha/2}\,\frac{s}{\sqrt{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\bar{x}`} /> mean sampel; <Tex math={String.raw`s`} /> simpangan baku sampel; <Tex math={String.raw`t_{n-1}`} /> kuantil distribusi-t — untuk n besar (≈ 30+) ia ≈ <Tex math={String.raw`z`} />, untuk n kecil ia lebih besar (ekor lebih tebal = lebih jujur soal ketidakpastian).</p>
      <p><strong>Kembaran yang sering tertukar — interval prediksi:</strong> CI menjawab &ldquo;di mana <em>mean populasi</em>?&rdquo;; <strong>interval prediksi</strong> menjawab &ldquo;di mana <em>observasi berikutnya</em> akan jatuh?&rdquo; — jauh lebih lebar karena mencakup variasi individu, bukan hanya ketidakpastian mean:</p>
      <Tex math={String.raw`\text{PI: }\bar{x} \pm t_{n-1}\cdot s\sqrt{1 + \frac{1}{n}}`} block />
      <p>Untuk n besar, PI ≈ <Tex math={String.raw`\bar{x} \pm 2s`} />. Tertukar keduanya = bencana: melaporkan CI sempit sebagai &ldquo;rentang nilai pelanggan berikutnya&rdquo; meremehkan risiko drastis.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> lebar CI menyusut dengan <Tex math={String.raw`1/\sqrt{n}`} /> (hukum akar kuadrat dari A2.1) — chart di bawah menunjukkannya. Tapi ingat: CI menyusut bukan berarti <em>datanya</em> menyempit; yang menyempit hanya <em>ketidakpastian tentang mean</em>. Variasi antar individu (s) tetap sama.</p>
      </div>

      <PlotlyChart
        data={widthData}
        title="Lebar Interval 95% Menyusut Mengikuti 1/√n (p = 0,30)"
        layout={{ xaxis: { title: "Ukuran sampel (n)" }, yaxis: { title: "Lebar interval (poin %)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = ukuran sampel; vertikal = lebar total interval (batas atas − batas bawah).</p>
        <p><strong>Interpretasi:</strong> dari n=20 (lebar ~40 poin!) ke n=160 (lebar ~14 poin) penurunannya dramatis; dari n=640 ke n=1280 hampir datar. <strong>Keputusan praktis:</strong> jika intervalmu selebar 40 poin, masalahnya bukan rumus — tapi datanya kurang. Tambah sampel dulu, debat rumus kemudian.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Interval = &ldquo;ketidakpastian yang jujur&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Wald vs Wilson — p̂ kecil, n kecil</summary>
              <p>2 gagal dari 100 (p̂ = 2%). Interval 95% Wald vs Wilson. Mana yang dipercaya?</p>
              <p><strong>Langkah 1 (Wald)</strong> — SE = √(0,02×0,98/100) = 0,014. IK: 0,02 ± 1,96×0,014 = <strong>(−0,007; 0,047)</strong> — batas bawah <em>negatif</em>! Mustahil untuk peluang.<br />
              <strong>Langkah 2 (Wilson)</strong> — rumus Wilson: (0,0055; 0,0706) — selalu di (0,1), tidak pernah negatif/melebihi 1.<br />
              <strong>Langkah 3</strong> — putusan: <strong>Wilson</strong>. Wald memakai aproksimasi Normal yang jebol di dekat 0/1 atau n kecil.</p>
              <p>Pelajaran: Wald = cepat tapi rapuh; Wilson = default aman untuk proporsi. Aturan: p̂ ekstrem atau n &lt; 100 → Wilson (atau Clopper-Pearson jika butuh jaminan konservatif).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Interpretasi yang benar — 95% bukan peluang!</summary>
              <p>IK 95% PD = (3%; 7%). Manajer: &ldquo;peluang PD benar di interval ini = 95%.&rdquo; Benar?</p>
              <p><strong>Langkah 1</strong> — <strong>salah</strong> (dalam paradigma frekuentis!). PD benar = tetap (bukan acak); interval = acak (tergantung sampel).<br />
              <strong>Langkah 2</strong> — arti benar: &ldquo;jika survei diulang 100×, ~95 interval yang dihasilkan akan mencakup PD benar.&rdquo;<br />
              <strong>Langkah 3</strong> — jika mau pernyataan &ldquo;peluang PD di interval&rdquo; → butuh <strong>credible interval Bayesian</strong> (A2.12!).</p>
              <p>Pelajaran: ini miskonsepsi #1 interval kepercayaan — bahkan di kalangan profesional. Ucapkan dengan benar: &ldquo;prosedur ini menangkap nilai benar 95% dari waktu&rdquo; — bukan &ldquo;nilai benar ada di sini dengan peluang 95%&rdquo;.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Wald Menghasilkan Interval Mustahil</h2>
      <p>Hitung langsung interval Wald vs Wilson untuk kasus cerita pembuka (2 dari 50). Saksikan Wald memberi batas negatif dan — lebih parah — klaim kepastian palsu saat x = 0.</p>
      <PyodideLab
        title="Lab 1 — Wald vs Wilson untuk Data Kecil (Live Python)"
        hint="⚡ Live Python. Coba: x=0, n=50 (nol konversi). Lalu x=1, n=20. Kapan Wald masih 'selamat'? (Petunjuk: n besar & p di tengah.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Adu Cakupan Wald vs Wilson</h2>
      <p>Simulasi 3.000 eksperimen per nilai p: berapa persen interval yang benar-benar mencakup nilai benar? Targetnya 95%.</p>
      <PyodideLab
        title="Lab 2 — Simulasi Cakupan 95% (Live Python)"
        hint="Coba: ubah n jadi 200. Perhatikan Wald membaik (asimtotik!) tapi Wilson tetap unggul di p kecil. Inilah mengapa aturan praktisnya: n kecil → Wilson, n besar → keduanya oke."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Interval Mana untuk Data Saya</h2>

      <div className="decision-card">
        <h3>1. Proporsi, n kecil (&lt; 100) atau p dekat 0/1 → <strong>Wilson</strong></h3>
        <p><strong>Kondisi:</strong> konversi landing page, fraud rate, default rate segmen kecil — nyaris semua metrik bisnis yang &ldquo;langka&rdquo;.</p>
        <p><strong>Kenapa:</strong> tidak overshoot, tidak zero-width, cakupan sesuai janji. Biaya: rumus sedikit lebih panjang — komputer yang menghitung, bukan kamu.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;konversi 2/50 → 95% CI (1,1%, 13,5%)&rdquo; — jujur dan masuk akal.</p>
      </div>

      <div className="decision-card">
        <h3>2. Proporsi, n besar (ribuan), p di tengah → <strong>Wald boleh</strong></h3>
        <p><strong>Kondisi:</strong> survei nasional 1.067 responden dengan p ~ 50%.</p>
        <p><strong>Kenapa:</strong> asimtotiknya sudah bekerja; Wald ≈ Wilson. Rumus simpel untuk laporan cepat.</p>
        <p><strong>Contoh nyata:</strong> polling &ldquo;52,5% ± 3 poin&rdquo; di berita.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh jaminan konservatif (regulator, audit) → <strong>Clopper–Pearson</strong></h3>
        <p><strong>Kondisi:</strong> laporan ke regulator yang menuntut cakupan <em>minimal</em> 95% tanpa kecuali.</p>
        <p><strong>Kenapa:</strong> interval &ldquo;exact&rdquo; — cakupannya tidak pernah di bawah 95%. Harga: sedikit lebih lebar (konservatif).</p>
        <p><strong>Contoh nyata:</strong> validasi model PD untuk Basel — batas atas PD yang konservatif.</p>
      </div>

      <div className="decision-card">
        <h3>4. Mean, σ tak diketahui → <strong>interval-t</strong></h3>
        <p><strong>Kondisi:</strong> rata-rata waktu tunggu, rata-rata transaksi — n berapapun.</p>
        <p><strong>Kenapa:</strong> distribusi-t mengoreksi ketidakpastian tambahan dari mengestimasi σ dengan s. Untuk n ≥ 30 hasilnya ≈ interval-z.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;rata-rata top-up Rp152 rb, 95% CI (Rp141 rb, Rp163 rb)&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>5. Menebak observasi berikutnya, bukan mean → <strong>interval prediksi</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;berapa range transaksi nasabah berikutnya?&rdquo; — bukan &ldquo;berapa rata-rata transaksi?&rdquo;.</p>
        <p><strong>Kenapa:</strong> mencakup variasi individu (<Tex math={String.raw`s`} /> penuh), jauh lebih lebar dari CI. Memakai CI untuk ini = meremehkan risiko.</p>
        <p><strong>Contoh nyata:</strong> SLA layanan: janji &ldquo;95% tiket selesai dalam X jam&rdquo; memakai kuantil/prediksi, bukan CI mean.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Proporsi + n kecil/ekstrem → Wilson.</strong> Jadikan default, bukan Wald.</li>
          <li>Kalau intervalmu keluar [0, 1] atau selebar 0 — <strong>rumusnya yang salah, bukan datanya</strong>.</li>
          <li>Selalu tanya: &ldquo;interval untuk <em>parameter</em> atau untuk <em>observasi berikutnya</em>?&rdquo;</li>
          <li>95% = sifat prosedur dalam pengulangan, bukan peluang untuk interval di tanganmu.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Klaim Konversi Landing Page Baru</h2>
      <div className="callout">
        <p>Tim growth mengklaim landing page baru &ldquo;menaikkan konversi dari 3% ke 4%&rdquo;. Datanya: halaman lama 15 pendaftar dari 500 pengunjung (3,0%), halaman baru 2 pendaftar dari 50 pengunjung (4,0%). Mereka mau mengumumkan kemenangan ke direksi.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung interval Wilson 95% untuk halaman baru. (b) Apakah klaim &ldquo;naik&rdquo; didukung data? (c) Berapa sampel minimal agar margin of error halaman baru ≤ 1 poin?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Wilson untuk 2/50: <strong>(1,1%, 13,5%)</strong>. Halaman lama 15/500: (1,8%, 4,9%).</p>
          <p>(b) <strong>Tidak didukung.</strong> Interval halaman baru (1,1%–13,5%) <em>mencakup</em> 3% — bahkan mencakup hampir seluruh interval halaman lama. &ldquo;4% &gt; 3%&rdquo; hanyalah noise dari n=50. Mengumumkan kemenangan sekarang = merayakan keacakan. (Uji formalnya di A2.4–A2.5.)</p>
          <p>(c) Margin ≤ 1 poin: <Tex math={String.raw`1{,}96\sqrt{0{,}04 \times 0{,}96/n} \le 0{,}01`} /> → <Tex math={String.raw`n \ge (1{,}96/0{,}01)^2 \times 0{,}0384 \approx 1.475`} />. Butuh <strong>~1.500 pengunjung</strong> — 30× dari yang ada. Pelajaran: <strong>jangan umumkan hasil sebelum menghitung berapa data yang dibutuhkan</strong> (prinsip ini menjadi lesson penuh di A2.10).</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>n = 400, p̂ = 0,5. Hitung IK Wald 95%. Mengapa di sini Wald OK?</li>
              <li>Mean sampel 8,2; s = 1,5; n = 10. Tulis IK 95% (pakai distribusi yang tepat!).</li>
              <li>IK (2%; 9%) vs (4%; 7%) — mana yang lebih <em>presisi</em>? Mana yang lebih <em>informatif</em> untuk keputusan &ldquo;PD &gt; 5%?&rdquo;?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> SE = √(0,25/400) = 0,025 → 0,5 ± 0,049 = <strong>(45,1%; 54,9%)</strong>. Wald OK: n besar &amp; p̂ jauh dari 0/1 → aproksimasi Normal valid.</p>
              <p><strong>2.</strong> n kecil → <strong>t</strong> (df=9): 8,2 ± 2,262×(1,5/√10) = 8,2 ± 1,07 = <strong>(7,13; 9,27)</strong>.</p>
              <p><strong>3.</strong> (4%;7%) lebih <em>presisi</em> (lebih sempit). Untuk &ldquo;PD &gt; 5%?&rdquo;: (2%;9%) <em>tidak informatif</em> (mencakup dua sisi 5%); (4%;7%) juga mencakup 5% — <strong>keduanya</strong> tak konklusif! Keputusan butuh uji hipotesis satu sisi (A2.4) atau batas bawah &gt; 5%.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Interval kepercayaan 95% untuk PD adalah (2,1%, 4,3%). Interpretasi yang BENAR?"
        options={[
          "Ada 95% peluang PD sebenarnya ada di antara 2,1% dan 4,3%",
          "95% nasabah punya PD di rentang itu",
          "Prosedur ini, dalam pengulangan, menghasilkan interval yang mencakup PD sebenarnya 95% dari waktu",
          "PD pasti tepat 3,2% (tengah interval)",
        ]}
        correct={2}
        explanation="Benar. 95% adalah sifat prosedurnya dalam pengulangan jangka panjang, bukan peluang untuk interval spesifik ini (nilai benar tetap — di dalam atau di luar). Opsi 1 adalah miskonsepsi paling umum, bahkan di kalangan praktisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dari 40 transaksi, 0 terindikasi fraud. Interval Wald 95% memberi (0%, 0%). Apa masalahnya?"
        options={[
          "Tidak ada masalah — memang tidak ada fraud",
          "Zero-width: mengklaim kepastian sempurna dari 40 observasi; Wilson memberi (0%, 8,8%) yang jujur",
          "Sampelnya terlalu besar",
          "Harus pakai interval 99%",
        ]}
        correct={1}
        explanation="Benar. Nol kejadian dalam 40 percobaan TIDAK berarti peluangnya nol — Wilson memberi batas atas 8,8%. Wald runtuh karena SE = 0. Ini contoh nyata mengapa 'tidak terlihat' ≠ 'tidak ada'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan interval Wald masih layak dipakai?"
        options={[
          "Selalu — ia rumus standar",
          "n besar dan p jauh dari 0/1 (misal survei 1.000+ responden, p ~ 30–70%)",
          "n kecil dan p ekstrem",
          "Tidak pernah",
        ]}
        correct={1}
        explanation="Benar. Di tengah dengan n besar, aproksimasi normal bekerja dan Wald ≈ Wilson. Masalah Wald hanya muncul di tepi — yang sayangnya justru tempat banyak metrik bisnis berada."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa interval Wilson tidak pernah memberi batas negatif?"
        options={[
          "Karena dibulatkan ke nol",
          "Karena ia menyelesaikan pertidaksamaan skor untuk p, yang solusinya selalu di dalam [0,1]",
          "Karena n selalu besar",
          "Karena memakai distribusi-t",
        ]}
        correct={1}
        explanation="Benar. Wilson tidak memakai 'estimasi ± margin' yang buta batas; ia mencari himpunan nilai p yang konsisten dengan data — dan p sebagai proporsi memang hidup di [0,1]. Struktur rumusnya yang menjamin, bukan pembulatan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Manajer minta 'rentang waktu penyelesaian tiket berikutnya'. Kamu punya mean 4 jam, s = 2 jam, n = 100. Yang tepat dilaporkan?"
        options={[
          "CI mean: 4 ± 0,39 jam",
          "Interval prediksi: 4 ± ~4 jam — karena yang ditanya observasi individual, bukan mean",
          "Median saja",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar. CI (3,6, 4,4) menjawab 'di mana rata-ratanya' — sangat sempit dan menyesatkan untuk janji SLA per tiket. Interval prediksi mencakup variasi individu (±~4 jam). Tertukar keduanya = SLA yang mustahil dipenuhi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua interval 95% dari dua segmen: A (3%, 5%) dan B (4%, 6%) — saling tumpang tindih. Kesimpulan tepat?"
        options={[
          "Pasti tidak ada perbedaan signifikan",
          "Pasti ada perbedaan signifikan",
          "Overlap CI bukan uji formal — tidak bisa disimpulkan langsung; butuh uji beda dua proporsi (A2.5)",
          "Gabungkan saja datanya",
        ]}
        correct={2}
        explanation="Benar. Aturan 'overlap = tidak signifikan' adalah heuristik kasar yang sering salah (tergantung korelasi & desain). CI untuk tiap kelompok menjawab pertanyaan estimasi, bukan pertanyaan perbandingan. Untuk perbandingan ada uji khusus — itulah A2.4/A2.5."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>95%</strong> = sifat prosedur dalam pengulangan, bukan peluang untuk interval spesifik. Bukan pula &ldquo;95% data&rdquo;.</li>
          <li><strong>Wald</strong> <Tex math={String.raw`\hat{p} \pm z\sqrt{\hat{p}(1-\hat{p})/n}`} />: simpel tapi retak di tepi — overshoot, zero-width, cakupan anjlok.</li>
          <li><strong>Wilson</strong>: hampir selalu lebih baik; tidak pernah keluar [0,1]; jujur saat x = 0; ≈ Wald saat n besar.</li>
          <li><strong>Interval-t</strong> untuk mean: <Tex math={String.raw`\bar{x} \pm t_{n-1} s/\sqrt{n}`} />.</li>
          <li><strong>Interval prediksi</strong> ≠ CI: untuk observasi berikutnya, jauh lebih lebar.</li>
          <li>Lebar CI ∝ <Tex math={String.raw`1/\sqrt{n}`} /> — interval selebar 40 poin artinya datanya kurang, bukan rumusnya salah.</li>
          <li><strong>Jangan:</strong> memakai Wald untuk metrik langka; menukar CI dengan interval prediksi; menyimpulkan perbandingan dari overlap CI.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a22-estimasi-mle" className="btn btn-secondary btn-sm">← A2.2</Link>
        <Link href="/learn/a24-uji-hipotesis" className="btn btn-primary btn-sm">Next: A2.4 →</Link>
      </div>
    </div>
  );
}
