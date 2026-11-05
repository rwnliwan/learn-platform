"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function normPdf(x: number, mu: number, sd: number) {
  return Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
}
// aproksimasi pdf t dengan df kecil vs normal (untuk visual)
function tPdf(x: number, df: number) {
  // pendekatan numerik sederhana via normal mixture — cukup untuk ilustrasi
  const c = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  const tail = 1 + (x * x) / (2 * df);
  return c * Math.pow(tail, -(df + 1) / 2) * 1.15;
}

export default function A25Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const xs: number[] = [];
  for (let x = -4; x <= 4; x += 0.1) xs.push(Math.round(x * 10) / 10);
  const tVsZData = [
    {
      x: xs,
      y: xs.map((x) => normPdf(x, 0, 1)),
      type: "scatter",
      mode: "lines",
      name: "Normal standar (z)",
      line: { color: "#16a34a" },
    },
    {
      x: xs,
      y: xs.map((x) => tPdf(x, 3)),
      type: "scatter",
      mode: "lines",
      name: "t dengan df = 3 (ekor tebal)",
      line: { color: "#c2410c" },
    },
    {
      x: xs,
      y: xs.map((x) => tPdf(x, 30)),
      type: "scatter",
      mode: "lines",
      name: "t dengan df = 30 (≈ normal)",
      line: { color: "#2a7de1", dash: "dash" },
    },
  ];

  // Chart 2: ANOVA — tiga grup cabang (boxplot konseptual via bar mean + error)
  const anovaData = [
    {
      x: ["Cabang A<br>(n=40)", "Cabang B<br>(n=40)", "Cabang C<br>(n=40)"],
      y: [12.5, 14.8, 13.1],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#16a34a"] },
      error_y: { type: "data", array: [3.2, 3.0, 3.4], visible: true },
      text: ["12,5 hari", "14,8 hari", "13,1 hari"],
      textposition: "outside",
    },
  ];

  // Chart 3: Welch vs Student — ilustrasi kapan beda (variansi tak sama)
  const welchData = [
    {
      x: ["Student (asumsi<br>varian sama)", "Welch (varian<br>boleh beda)"],
      y: [0.041, 0.083],
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1"] },
      text: ["p = 0,041", "p = 0,083"],
      textposition: "outside",
    },
  ];

  const lab1Code = `import random, math, statistics as st

random.seed(31)
# Data: waktu penyelesaian KPR (hari) dua cabang
A = [random.gauss(12, 3) for _ in range(35)]
B = [random.gauss(14, 3) for _ in range(35)]

# --- t-test dua sampel (Student, asumsi varian sama) ---
n1, n2 = len(A), len(B)
m1, m2 = st.mean(A), st.mean(B)
s1, s2 = st.stdev(A), st.stdev(B)
sp2 = ((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-2)  # pooled variance
t_student = (m1 - m2) / math.sqrt(sp2*(1/n1 + 1/n2))

# --- Welch (tanpa asumsi varian sama) ---
t_welch = (m1 - m2) / math.sqrt(s1**2/n1 + s2**2/n2)
df_num = (s1**2/n1 + s2**2/n2)**2
df_den = (s1**2/n1)**2/(n1-1) + (s2**2/n2)**2/(n2-1)
df_welch = df_num / df_den

print(f"mean A = {m1:.2f} hari (s={s1:.2f}), mean B = {m2:.2f} hari (s={s2:.2f})")
print(f"Student t = {t_student:.3f}  (df = {n1+n2-2})")
print(f"Welch   t = {t_welch:.3f}  (df ≈ {df_welch:.1f})")
print()
print("Coba: ubah B jadi random.gauss(14, 8) (varian B jauh lebih besar).")
print("Perhatikan t Student vs Welch mulai berbeda — di situlah Welch penting.")`;

  const lab2Code = `import random, math, statistics as st

random.seed(44)
# ANOVA satu arah dari nol: 3 cabang, apakah mean-nya beda?
groups = {
    "A": [random.gauss(12.5, 3) for _ in range(40)],
    "B": [random.gauss(14.8, 3) for _ in range(40)],
    "C": [random.gauss(13.1, 3) for _ in range(40)],
}
allx = [x for g in groups.values() for x in g]
grand = st.mean(allx)
k = len(groups); N = len(allx)

# SSB: variasi ANTAR grup  |  SSW: variasi DALAM grup
ssb = sum(len(g)*(st.mean(g)-grand)**2 for g in groups.values())
ssw = sum(sum((x-st.mean(g))**2 for x in g) for g in groups.values())
msb, msw = ssb/(k-1), ssw/(N-k)
F = msb/msw
print(f"SSB (antar grup) = {ssb:.1f},  SSW (dalam grup) = {ssw:.1f}")
print(f"MSB = {msb:.2f},  MSW = {msw:.2f}")
print(f"F = MSB/MSW = {F:.2f}")
print()
print("Logika: F besar = perbedaan ANTAR cabang jauh lebih besar")
print("dari keragaman DI DALAM tiap cabang -> mean tidak semuanya sama.")
print()
print("Coba: ubah semua mean jadi 13 (tidak ada beda). F jatuh ke ~1.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.5 — Statistika Inferensial</span>
        <h1 className="display-title">Memilih Senjata yang Tepat:<br />Uji-z, Uji-t, Welch &amp; ANOVA</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Lesson sebelumnya memberi <strong>kerangka uji hipotesis</strong>: susun H0/H1, hitung statistik uji, bandingkan p-value dengan α, dan waspadai error Tipe I/II. Lesson ini mengisi kerangka itu dengan <strong>mesin-mesin konkret</strong> untuk pertanyaan paling umum di dunia kerja: &ldquo;apakah rata-rata dua kelompok berbeda?&rdquo; — dari uji-z klasik hingga ANOVA untuk banyak kelompok.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Cabang, Satu Pertanyaan</a></li>
          <li><a href="#z">Uji-z — Sang Veteran (σ Diketahui)</a></li>
          <li><a href="#t">Uji-t Student — Sang Pekerja Harian (σ Tak Diketahui)</a></li>
          <li><a href="#welch">Welch — Ketika Variansi Tak Mau Sama</a></li>
          <li><a href="#paired">Uji-t Berpasangan — Setiap Subjek Jadi Kontrolnya Sendiri</a></li>
          <li><a href="#anova">ANOVA — Satu Uji untuk Banyak Kelompok</a></li>
          <li><a href="#lab1">🔬 Lab 1: Student vs Welch dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: ANOVA dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Uji Mana untuk Data Saya</a></li>
          <li><a href="#case">📋 Mini-Case: Tiga Cabang, Klaim &ldquo;B Lebih Lambat&rdquo;</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kapan memakai <strong>uji-z</strong> vs <strong>uji-t</strong> — dan mengapa uji-z jarang dipakai dalam praktik.</li>
          <li>Menghitung <strong>uji-t satu &amp; dua sampel</strong> (Student) langkah-demi-langkah, termasuk derajat bebasnya.</li>
          <li>Menjelaskan mengapa <strong>Welch</strong> lebih aman dari Student saat variansi tak sama — dan kapan perbedaannya penting.</li>
          <li>Membedakan desain <strong>berpasangan vs independen</strong> dan menjelaskan mengapa pasangan menaikkan power.</li>
          <li>Menjelaskan logika <strong>ANOVA</strong> (F = variansi antar / variansi dalam) dan mengapa tidak boleh menggantinya dengan banyak uji-t.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Cabang, Satu Pertanyaan</h2>
      <div className="story">
        <p>Kepala operasional bank menatap dashboard: rata-rata waktu persetujuan KPR <strong>Cabang A = 12,5 hari</strong>, <strong>Cabang B = 14,8 hari</strong>. &ldquo;B 2,3 hari lebih lambat. Tegur kepala cabangnya,&rdquo; katanya.</p>
        <p>Analis muda mengangkat tangan: &ldquo;Tunggu. Selisih 2,3 hari dari berapa sampel? Seberapa bervariasi datanya? Kalau tiap cabang cuma 10 data dan variasinya ±5 hari, selisih 2,3 hari itu <em>noise</em>. Kalau 500 data dengan variasi ±1 hari, itu <em>sinyal</em>.&rdquo;</p>
        <p>Ruangan hening. Kepala operasional membatalkan tegurannya — untuk sementara.</p>
        <p><strong>Twist-nya:</strong> pertanyaan &ldquo;apakah dua rata-rata <em>benar-benar</em> beda?&rdquo; tidak bisa dijawab dari selisihnya saja. Butuh tiga bahan: <strong>selisih</strong>, <strong>variasi</strong>, dan <strong>ukuran sampel</strong> — yang diramu menjadi satu angka: <strong>statistik-t</strong>. Dan memilih <em>jenis</em> uji-t yang tepat (Student? Welch? Berpasangan?) sama pentingnya dengan menghitungnya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="z">Uji-z — Sang Veteran (σ Diketahui)</h2>
      <p><strong>Definisi.</strong> <strong>Uji-z</strong> menguji mean saat <strong>simpangan baku populasi (<Tex math={String.raw`\sigma`} />) diketahui</strong>:</p>
      <Tex math={String.raw`z = \frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\bar{x}`} /> mean sampel; <Tex math={String.raw`\mu_0`} /> nilai yang diklaim H0; <Tex math={String.raw`\sigma/\sqrt{n}`} /> standard error (σ diketahui, bukan diestimasi). Di bawah H0, <Tex math={String.raw`z`} /> berdistribusi <strong>normal standar</strong>.</p>
      <p><strong>Kepribadian uji-z:</strong> sang veteran yang hidup di dunia ideal — ia mengasumsikan kamu <em>tahu persis</em> variasi populasi. Di dunia nyata nyaris tidak pernah terjadi (kalau σ diketahui, biasanya μ juga diketahui). Peran sebenarnya: <strong>fondasi konseptual</strong> — semua uji lain adalah &ldquo;uji-z yang disesuaikan karena σ tak diketahui&rdquo;.</p>
      <p><strong>Kapan memakai:</strong> praktis jarang; secara teori saat σ diketahui atau n sangat besar (di mana s ≈ σ dan t ≈ z).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: uji-z</summary>
        <p>Klaim: rata-rata saldo tabungan = Rp5 jt. Diketahui σ = Rp2 jt. Sampel n = 100, x̄ = Rp5,4 jt. α = 5%.</p>
        <p><strong>Langkah 1</strong> — H0: μ = 5 vs H1: μ ≠ 5.<br />
        <strong>Langkah 2</strong> — <Tex math={String.raw`z = (5{,}4 - 5)/(2/\sqrt{100}) = 0{,}4/0{,}2 = 2{,}0`} />.<br />
        <strong>Langkah 3</strong> — p-value dua sisi = <Tex math={String.raw`P(|Z|>2) \approx 0{,}046`} />.<br />
        <strong>Langkah 4</strong> — 0,046 &lt; 0,05 → tolak H0. Rata-rata saldo berbeda signifikan dari Rp5 jt.</p>
      </details>

      <h2 id="t">Uji-t Student — Sang Pekerja Harian (σ Tak Diketahui)</h2>
      <p><strong>Definisi.</strong> <strong>Uji-t Student</strong> mengganti σ yang tak diketahui dengan <Tex math={String.raw`s`} /> (simpangan baku sampel):</p>
      <Tex math={String.raw`t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}, \qquad df = n - 1`} block />
      <p><strong>Artinya tiap simbol:</strong> sama seperti uji-z, kecuali penyebut memakai <Tex math={String.raw`s`} /> (estimasi dari data) dan statistiknya mengikuti <strong>distribusi-t</strong> dengan derajat bebas <Tex math={String.raw`df = n-1`} /> — bukan normal.</p>
      <p><strong>Mengapa distribusi-t?</strong> Karena <Tex math={String.raw`s`} /> sendiri berfluktuasi antar sampel — ada <em>ketidakpastian ganda</em> (tentang mean DAN tentang sebaran). Distribusi-t mengompensasi dengan <strong>ekor lebih tebal</strong>: nilai kritisnya lebih besar dari z, sehingga lebih sulit menolak H0 — &ldquo;kejujuran&rdquo; atas ketidaktahuan kita tentang σ. Saat n membesar, s → σ dan t → z (lihat chart).</p>
      <p>Untuk <strong>dua sampel independen</strong> (Cabang A vs B), versi Student memakai <strong>variansi gabungan (pooled)</strong>:</p>
      <Tex math={String.raw`t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_p^2(1/n_1 + 1/n_2)}}, \quad s_p^2 = \frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`s_p^2`} /> adalah rata-rata tertimbang dua variansi sampel — asumsi implisitnya: <strong>kedua populasi punya variansi SAMA</strong>. Asumsi inilah yang dipertanyakan Welch.</p>
      <p><strong>Kepribadian uji-t:</strong> sang pekerja harian yang jujur — &ldquo;saya tidak tahu σ, jadi saya menghukum diri sendiri dengan ekor tebal.&rdquo; Inilah uji yang paling sering kamu pakai: membandingkan dua rata-rata dari data nyata.</p>
      <p><strong>Asumsi (cek sebelum pakai):</strong> (1) data kurang-lebih normal <em>atau</em> n cukup besar (CLT menolong mean), (2) observasi independen, (3) untuk versi Student: variansi kedua grup sama.</p>

      <PlotlyChart
        data={tVsZData}
        title="Distribusi-t vs Normal: Ekor Tebal yang Menyusut"
        layout={{ xaxis: { title: "Nilai statistik" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga kurva kepadatan. Oranye = t dengan df=3 (sampel kecil); biru putus-putus = t df=30; hijau = normal standar.</p>
        <p><strong>Interpretasi:</strong> pada df kecil, kurva-t lebih <strong>pendek di tengah dan tebal di ekor</strong> — mencerminkan ketidakpastian ganda. Pada df=30 ia hampir menempel normal. <strong>Pesan praktis:</strong> untuk n ≥ 30, beda t vs z bisa diabaikan; untuk n kecil, memakai z (bukan t) membuatmu <em>terlalu gampang</em> mengklaim signifikan.</p>
      </div>

      <h2 id="welch">Welch — Ketika Variansi Tak Mau Sama</h2>
      <p><strong>Definisi.</strong> <strong>Uji-t Welch</strong> membandingkan dua mean <strong>tanpa</strong> mengasumsikan variansi sama:</p>
      <Tex math={String.raw`t_W = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{s_1^2/n_1 + s_2^2/n_2}}`} block />
      <p>Derajat bebasnya memakai <strong>aproksimasi Welch–Satterthwaite</strong> (rumus panjang yang dihitung komputer — idenya: df efektif diturunkan dari seberapa &ldquo;tidak seimbang&rdquo; kedua variansi).</p>
      <p><strong>Kepribadian Welch:</strong> si realistis — &ldquo;kenapa harus berasumsi variansi sama kalau bisa tidak?&rdquo; Ia tidak memaksa dua grup yang jelas beda karakternya (misal gaji startup vs BUMN) ke dalam satu asumsi.</p>
      <p><strong>Kapan memakai:</strong> <strong>jadikan default untuk dua sampel independen.</strong> Jika variansi memang sama, hasil Welch ≈ Student (tidak ada ruginya); jika beda, Welch tetap valid sementara Student bisa meleset — terutama saat <strong>ukuran sampel tak seimbang</strong> (n1 ≠ n2). Inilah rekomendasi banyak statistisi modern: &ldquo;selalu Welch&rdquo;.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Uji kesamaan variansi dulu (Levene); kalau lolos baru pakai Student.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> prosedur dua tahap ini justru merusak sifat uji (tingkat α aktual meleset). Karena Welch tidak kalah apa-apa saat variansi sama, jalan pintasnya: <strong>langsung pakai Welch</strong> — tanpa pre-test. Sederhana dan lebih jujur.</p>
      </div>

      <PlotlyChart
        data={welchData}
        title="Student vs Welch: Saat Variansi Tak Sama, Kesimpulan Bisa Berbalik"
        layout={{ yaxis: { title: "p-value", range: [0, 0.12] }, showlegend: false, shapes: [{ type: "line", x0: -0.5, x1: 1.5, y0: 0.05, y1: 0.05, line: { dash: "dash", color: "#c2410c" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = p-value dari uji yang sama pada data yang sama (satu grup variasinya 3× lipat, n tak seimbang). Garis merah = α = 5%.</p>
        <p><strong>Interpretasi:</strong> Student memberi p = 0,041 (&ldquo;signifikan!&rdquo;) sementara Welch memberi p = 0,083 (tidak signifikan). Asumsi variansi sama yang dilanggar membuat Student <strong>terlalu percaya diri</strong>. Inilah harga asumsi yang salah — dan alasan Welch jadi default yang aman.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> &ldquo;uji-t&rdquo; yang dilaporkan software selalu menyertakan <strong>derajat bebas</strong> — t(58) = 2,1, p = 0,04. df memberitahumu <em>berapa banyak informasi independen</em> yang dipakai; df kecil = ekor tebal = ambang lebih tinggi. Saat membaca paper/laporan, lirik df-nya: t = 2,1 dengan df = 8 jauh lebih meyakinkan daripada t = 2,1 dengan df = 200? <em>Sebaliknya</em> — df besar berarti estimasi stabil. Jangan baca t tanpa df.</p>
      </div>

      <h2 id="paired">Uji-t Berpasangan — Setiap Subjek Jadi Kontrolnya Sendiri</h2>
      <p><strong>Definisi.</strong> Jika dua pengukuran <strong>berpasangan</strong> (sebelum–sesudah pada orang yang sama, atau dua perlakuan pada pasangan yang dicocokkan), jangan uji dua grup independen — uji <strong>selisihnya</strong>:</p>
      <Tex math={String.raw`t = \frac{\bar{d}}{s_d/\sqrt{n}}, \qquad d_i = x_{i,\text{sesudah}} - x_{i,\text{sebelum}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`d_i`} /> selisih pasangan ke-<Tex math={String.raw`i`} />; <Tex math={String.raw`\bar{d}`} /> rata-rata selisih; <Tex math={String.raw`s_d`} /> simpangan baku selisih-selisih itu. Ini tak lain adalah <strong>uji-t satu sampel pada data selisih</strong> dengan H0: mean selisih = 0.</p>
      <p><strong>Kepribadian uji berpasangan:</strong> si cerdik yang membuang noise antar-individu. Variasi antar orang (ada yang memang boros, ada yang hemat) hilang karena tiap orang dibandingkan dengan <em>dirinya sendiri</em> — yang tersisa hanya efek perlakuan. Hasilnya: <strong>power jauh lebih tinggi</strong> untuk n yang sama.</p>
      <p><strong>Kapan memakai:</strong> sebelum–sesudah (pelatihan, obat, kampanye), atau desain pasangan cocok (kembar, cabang dengan karakteristik mirip). <strong>Syarat:</strong> pasangannya bermakna — memasangkan data yang sebenarnya independen lalu memakai uji berpasangan adalah kesalahan.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: uji berpasangan</summary>
        <p>8 nasabah, saldo (jt) sebelum &amp; sesudah program menabung: selisih d = [2, 3, 1, 4, 2, 5, 3, 4].</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`\bar{d} = 24/8 = 3{,}0`} />, <Tex math={String.raw`s_d \approx 1{,}31`} />.<br />
        <strong>Langkah 2</strong> — <Tex math={String.raw`t = 3{,}0/(1{,}31/\sqrt{8}) \approx 6{,}48`} />, df = 7.<br />
        <strong>Langkah 3</strong> — p &lt; 0,001 → tolak H0. Program menaikkan saldo signifikan.</p>
        <p>Jika data yang sama diperlakukan sebagai dua grup independen, variasi antar-nasabah akan menenggelamkan efeknya — mungkin tidak signifikan. Itulah kekuatan pasangan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji berpasangan vs independen adalah pilihan <strong>desain</strong>, bukan pilihan rumus. Jika kamu bisa merancang eksperimen berpasangan (ukur sebelum–sesudah), lakukan — ia &ldquo;gratis&rdquo; menaikkan power tanpa menambah sampel. Inilah mengapa uji klinis crossover dan A/B test berpasangan begitu populer.</p>
      </div>

      <h2 id="anova">ANOVA — Satu Uji untuk Banyak Kelompok</h2>
      <p><strong>Definisi.</strong> <strong>ANOVA satu arah</strong> (Analysis of Variance) menguji apakah <strong>semua</strong> mean dari <Tex math={String.raw`k \ge 3`} /> kelompok sama: H0: μ1 = μ2 = … = μk. Statistiknya membandingkan dua sumber variasi:</p>
      <Tex math={String.raw`F = \frac{\text{MSB}}{\text{MSW}} = \frac{\text{variansi ANTAR kelompok}}{\text{variansi DALAM kelompok}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\text{MSB}`} /> (Mean Square Between): seberapa jauh mean tiap kelompok dari mean keseluruhan — besar jika kelompok-kelompoknya <em>beda</em>.</li>
        <li><Tex math={String.raw`\text{MSW}`} /> (Mean Square Within): rata-rata variasi <em>di dalam</em> tiap kelompok — &ldquo;noise latar&rdquo;.</li>
        <li><Tex math={String.raw`F`} />: rasio keduanya. Jika semua mean sama, F ≈ 1. Jika kelompok beda jauh relatif terhadap noise, F besar → tolak H0.</li>
      </ul>
      <p><strong>Kepribadian ANOVA:</strong> si hakim yang adil — alih-alih mengadili tiap pasangan satu per satu (dan menumpuk risiko false positive), ia bertanya satu pertanyaan global: &ldquo;apakah <em>ada</em> perbedaan di antara mereka?&rdquo; Jika ya, barulah uji lanjutan (post-hoc, misal Tukey) mencari <em>pasangan mana</em> yang beda — dengan koreksi multiple testing.</p>
      <p><strong>Mengapa tidak 3× uji-t?</strong> Setiap uji-t pada α=5% punya 5% false positive. Tiga uji (A–B, A–C, B–C) → peluang ≥1 false positive = <Tex math={String.raw`1 - 0{,}95^3 \approx 14\%`} />. Sepuluh kelompok (45 pasangan) → <strong>90%</strong>! ANOVA menjaga error keseluruhan tetap 5%.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ANOVA signifikan berarti semua kelompok beda.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ANOVA hanya bilang &ldquo;<em>minimal satu</em> pasangan beda&rdquo; — tidak bilang pasangan mana, apalagi semuanya. Untuk &ldquo;mana&rdquo;-nya butuh uji post-hoc (Tukey HSD) yang mengoreksi multiple comparison. Melompat dari &ldquo;ANOVA signifikan&rdquo; ke &ldquo;A &gt; B &gt; C&rdquo; adalah lompatan logika.</p>
      </div>

      <PlotlyChart
        data={anovaData}
        title="Rata-rata Waktu Persetujuan KPR Tiga Cabang (±1 SD)"
        layout={{ yaxis: { title: "Hari" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = rata-rata tiap cabang; garis error = ±1 simpangan baku (sebaran di dalam cabang).</p>
        <p><strong>Interpretasi:</strong> mean B (14,8) terlihat lebih tinggi — tapi error bar-nya tumpang tindih lebar dengan A dan C. ANOVA bertanya: apakah jarak <em>antar</em> batang cukup besar dibanding <em>panjang</em> error bar? Di sini F ≈ 4,2 (p ≈ 0,017) → ya, ada perbedaan nyata. Tanpa ANOVA, mata mudah tertipu batang tertinggi.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Pilih senjata sesuai medan: z, t, Welch, atau ANOVA.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Welch — dua kota, varians beda</summary>
              <p>Jakarta: n=50, x̄=12jt, s=3jt. Surabaya: n=60, x̄=10,5jt, s=2,5jt. Uji beda mean (α=5%).</p>
              <p><strong>Langkah 1</strong> — varians sampel beda (9 vs 6,25) &amp; n beda → <strong>Welch</strong> (tanpa asumsi varians sama).<br />
              <strong>Langkah 2</strong> — SE = √(9/50 + 6,25/60) = √(0,18+0,104) = 0,533 (jt). t = 1,5/0,533 = <strong>2,81</strong>.<br />
              <strong>Langkah 3</strong> — df Welch ≈ 96 → p ≈ <strong>0,006</strong> &lt; 0,05 → beda signifikan.</p>
              <p>Pelajaran: Welch = default aman untuk 2 sampel (Student-t klasik butuh asumsi varians sama yang jarang dicek!). Jika ragu → Welch.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: ANOVA — tiga kota, satu uji</summary>
              <p>Jakarta/Surabaya/Bandung: mean 12 / 10,5 / 11 (jt), n=40 tiap kota, s≈2,8. Apakah <em>ada</em> beda? (Bukan &ldquo;mana yang beda&rdquo;!)</p>
              <p><strong>Langkah 1</strong> — tiga uji-t berpasangan = multiple testing (A2.8!) — pakai <strong>ANOVA satu arah</strong>.<br />
              <strong>Langkah 2</strong> — F = (varians antar grup)/(varians dalam grup). Antar: n×Var(mean) = 40×0,583 = 23,3; dalam: 2,8² = 7,84. F ≈ 23,3/7,84 ≈ <strong>2,97</strong> (df 2, 117).<br />
              <strong>Langkah 3</strong> — p ≈ 0,055 — <em>tipis</em> tidak signifikan pada 5%! (n=40 kurang untuk beda 1,5jt dengan s=2,8.)</p>
              <p>Pelajaran: ANOVA menjawab &ldquo;apakah <em>ada</em> beda&rdquo; (omnibus). Jika signifikan → lanjut <em>post-hoc</em> (Tukey) untuk &ldquo;mana&rdquo;. Jangan uji-t berpasangan tanpa koreksi!</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Student vs Welch dari Nol</h2>
      <p>Hitung kedua versi uji-t dengan tangan (via Python) pada data dua cabang. Lalu rusak asumsinya — buat variansi grup B jauh lebih besar — dan saksikan kapan keduanya berpisah.</p>
      <PyodideLab
        title="Lab 1 — Uji-t Student vs Welch (Live Python)"
        hint="⚡ Live Python. Coba: ubah B jadi random.gauss(14, 8). Perhatikan t Student vs Welch mulai berbeda. Lalu samakan n (misal 100 vs 20) — kapan perbedaannya paling parah?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: ANOVA dari Nol</h2>
      <p>Bangun statistik F dari komponennya: variasi antar-grup vs dalam-grup. Lalu hilangkan perbedaannya dan saksikan F jatuh ke ~1.</p>
      <PyodideLab
        title="Lab 2 — ANOVA Satu Arah dari Nol (Live Python)"
        hint="Coba: ubah semua mean jadi 13 (tidak ada beda nyata). F jatuh ke ~1 — nilai 'normal' saat H0 benar. Coba juga n=10 per grup: F yang sama jadi kurang meyakinkan."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Uji Mana untuk Data Saya</h2>

      <div className="decision-card">
        <h3>1. Satu sampel vs nilai klaim, σ tak diketahui → <strong>uji-t satu sampel</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;apakah rata-rata saldo nasabah kami = Rp5 jt?&rdquo; — satu kelompok vs satu angka.</p>
        <p><strong>Kenapa:</strong> <Tex math={String.raw`t = (\bar{x} - \mu_0)/(s/\sqrt{n})`} />, df = n−1. Sederhana dan tepat.</p>
        <p><strong>Contoh nyata:</strong> audit klaim &ldquo;rata-rata waktu tunggu &lt; 10 menit&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dua kelompok independen → <strong>uji-t Welch</strong> (default)</h3>
        <p><strong>Kondisi:</strong> Cabang A vs B, kontrol vs perlakuan, pria vs wanita — tidak ada pasangan antar observasi.</p>
        <p><strong>Kenapa:</strong> tanpa asumsi variansi sama; ≈ Student jika variansi memang sama. Langsung Welch, tanpa pre-test Levene.</p>
        <p><strong>Contoh nyata:</strong> perbandingan waktu proses dua kantor cabang.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data berpasangan (sebelum–sesudah) → <strong>uji-t berpasangan</strong></h3>
        <p><strong>Kondisi:</strong> pengukuran yang sama pada subjek yang sama (atau pasangan cocok).</p>
        <p><strong>Kenapa:</strong> membuang variasi antar-subjek → power jauh lebih tinggi. Ini uji-t satu sampel pada selisih.</p>
        <p><strong>Contoh nyata:</strong> skor literasi keuangan sebelum vs sesudah pelatihan, nasabah yang sama.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tiga kelompok atau lebih → <strong>ANOVA</strong>, lalu post-hoc</h3>
        <p><strong>Kondisi:</strong> membandingkan mean 3+ grup sekaligus.</p>
        <p><strong>Kenapa:</strong> satu uji global menjaga error Tipe I tetap 5% — tidak seperti rentetan uji-t berpasangan. Jika signifikan, lanjut Tukey HSD untuk pasangan mana yang beda.</p>
        <p><strong>Contoh nyata:</strong> waktu persetujuan 5 kantor wilayah; efektivitas 4 kurikulum pelatihan.</p>
      </div>

      <div className="decision-card">
        <h3>5. Asumsi normalitas jebol / data ordinal → <strong>nonparametrik</strong></h3>
        <p><strong>Kondisi:</strong> data sangat miring, banyak outlier, atau skala ordinal (skor kepuasan 1–5).</p>
        <p><strong>Kenapa:</strong> uji-t mengasumsikan mean bermakna dan (untuk n kecil) data ~normal. Jika tidak, pakai Mann-Whitney / Wilcoxon / Kruskal-Wallis — itulah lesson berikutnya (A2.6).</p>
        <p><strong>Contoh nyata:</strong> perbandingan bonus (sangat miring) dua divisi.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Berpasangan atau independen?</strong> — tentukan dulu dari desain, bukan dari data.</li>
          <li><strong>Dua grup independen → Welch.</strong> Selalu. Tanpa pre-test variansi.</li>
          <li><strong>3+ grup → ANOVA dulu</strong>, baru post-hoc. Jangan rentetan uji-t.</li>
          <li><strong>Laporkan selalu:</strong> statistik uji + df + p-value + <strong>effect size &amp; CI selisih</strong> (besarnya beda, bukan cuma signifikansinya).</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Tiga Cabang, Klaim &ldquo;B Lebih Lambat&rdquo;</h2>
      <div className="callout">
        <p>Data waktu persetujuan KPR (hari), masing-masing 40 aplikasi:</p>
        <ul>
          <li>Cabang A: mean 12,5, s = 3,2</li>
          <li>Cabang B: mean 14,8, s = 3,0</li>
          <li>Cabang C: mean 13,1, s = 3,4</li>
        </ul>
        <p>Kepala operasional: &ldquo;Jelas B paling lambat. Tegur!&rdquo;</p>
        <p><strong>Pertanyaan:</strong> (a) Uji apa yang tepat dan mengapa bukan 3× uji-t? (b) ANOVA memberi F = 4,2, p = 0,017 — apa kesimpulan yang <em>tepat</em>? (c) Langkah analisis berikutnya apa sebelum menegur siapa pun?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>ANOVA satu arah.</strong> Tiga uji-t berpasangan menaikkan peluang false positive gabungan ke ~14%. ANOVA menjaga 5% dengan satu pertanyaan global.</p>
          <p>(b) <strong>&ldquo;Minimal satu pasangan cabang berbeda signifikan&rdquo;</strong> — bukan &ldquo;B paling lambat&rdquo;. ANOVA tidak bilang pasangan mana. Bisa jadi A vs B yang beda, bisa B vs C, bisa keduanya.</p>
          <p>(c) <strong>Tukey HSD post-hoc</strong> untuk pasangan mana yang beda + <strong>effect size</strong> (selisih 2,3 hari dengan CI-nya — apakah 2,3 hari penting secara bisnis?). Dan cek <strong>confounder</strong>: apakah B menangani aplikasi yang memang lebih kompleks (plafon besar, dokumen kurang)? Beda mean tanpa konteks = vonis tanpa investigasi.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Sampel berpasangan (sebelum–sesudah training, n=30 orang). Uji apa? Mengapa bukan uji-t 2 sampel independen?</li>
              <li>Kapan uji-z (bukan t) boleh dipakai? (2 syarat.)</li>
              <li>ANOVA signifikan (p=0,01). Apakah berarti <em>semua</em> grup beda? Langkah berikutnya apa?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Uji-t berpasangan</strong> (pada selisih!). Uji 2-sampel independen mengabaikan korelasi dalam orang yang sama → SE lebih besar → power lebih kecil. Berpasangan = tiap orang jadi kontrol dirinya sendiri.</p>
              <p><strong>2.</strong> (a) <strong>σ populasi diketahui</strong> (jarang!), atau (b) <strong>n besar</strong> (s ≈ σ, t ≈ z). Praktisnya: n &gt; 30–50 → z ≈ t; di bawah itu → t.</p>
              <p><strong>3.</strong> <strong>Tidak!</strong> ANOVA hanya bilang &ldquo;minimal satu beda&rdquo;. Lanjut: <strong>post-hoc</strong> (Tukey HSD) untuk pasangan mana yang beda — dengan koreksi multiple testing.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kapan uji-z (bukan uji-t) yang tepat dipakai?"
        options={[
          "Selalu — lebih sederhana",
          "Ketika σ populasi diketahui (atau n sangat besar sehingga s ≈ σ)",
          "Ketika n < 30",
          "Ketika data tidak normal",
        ]}
        correct={1}
        explanation="Benar. Uji-z butuh σ diketahui — nyaris tak pernah terjadi di praktik. Untuk n besar, t ≈ z sehingga uji-z jadi aproksimasi yang valid. Untuk n kecil dengan σ tak diketahui, wajib t."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dua grup independen, n1=15, n2=60, variansi terlihat beda jauh. Uji terbaik?"
        options={[
          "Uji-t Student (pooled)",
          "Uji-t Welch — tanpa asumsi variansi sama; justru di n tak seimbang + variansi beda, Student paling meleset",
          "Uji-t berpasangan",
          "ANOVA",
        ]}
        correct={1}
        explanation="Benar. Kombinasi n tak seimbang + variansi beda adalah skenario di mana Student paling berbahaya. Welch menangani keduanya tanpa asumsi tambahan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa distribusi-t berekor lebih tebal dari normal pada df kecil?"
        options={[
          "Karena rumusnya salah",
          "Karena s diestimasi dari data (ketidakpastian ganda) — t mengompensasi dengan lebih sulit menolak H0",
          "Karena data selalu miring",
          "Karena n selalu kurang",
        ]}
        correct={1}
        explanation="Benar. Mengestimasi σ dengan s menambah sumber fluktuasi; ekor tebal = 'kejujuran' atas ketidaktahuan itu. Saat n besar, s ≈ σ dan t menyatu dengan normal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Studi sebelum–sesudah pada 30 pasien dianalisis sebagai dua grup independen. Apa akibatnya?"
        options={[
          "Tidak ada — hasilnya sama",
          "Power turun: variasi antar-pasien yang sebenarnya bisa dibuang (via selisih berpasangan) malah mencemari uji",
          "p-value jadi terlalu kecil",
          "Wajib pakai ANOVA",
        ]}
        correct={1}
        explanation="Benar. Uji independen mencampur variasi antar-individu ke dalam error — padahal desain berpasangan bisa menghilangkannya via selisih. Memilih uji yang salah untuk desain yang benar = membuang power gratis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Membandingkan 5 varian iklan dengan 10 uji-t berpasangan (α=5% tiap uji). Masalahnya?"
        options={[
          "Tidak ada — tiap uji valid",
          "Peluang ≥1 false positive = 1 − 0,95¹⁰ ≈ 40%. Seharusnya ANOVA dulu, baru post-hoc terkoreksi",
          "Sampel kurang",
          "Harus pakai uji-z",
        ]}
        correct={1}
        explanation="Benar. Error Tipe I menumpuk secara multiplikatif. ANOVA menjaga family-wise error 5% dengan satu uji global; Tukey HSD kemudian mengidentifikasi pasangan yang beda dengan koreksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. ANOVA menghasilkan F = 1,1, p = 0,35 untuk 4 kelompok. Kesimpulan tepat?"
        options={[
          "Keempat mean terbukti sama",
          "Gagal menolak H0 — tidak cukup bukti ada perbedaan; bisa karena memang sama atau power kurang",
          "Minimal satu pasangan beda",
          "Ulangi dengan uji-t",
        ]}
        correct={1}
        explanation="Benar. F ≈ 1 artinya variasi antar-grup ≈ noise dalam-grup — tidak ada sinyal. Tapi 'gagal menolak' ≠ 'terbukti sama': bisa juga n kurang. Jangan 'mengulang dengan uji-t' — itu p-hacking."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Uji-z:</strong> <Tex math={String.raw`z = (\bar{x}-\mu_0)/(\sigma/\sqrt{n})`} /> — butuh σ diketahui; fondasi konseptual, jarang dipakai.</li>
          <li><strong>Uji-t Student:</strong> <Tex math={String.raw`t = (\bar{x}-\mu_0)/(s/\sqrt{n})`} />, df = n−1 — ekor tebal mengompensasi σ yang diestimasi.</li>
          <li><strong>Welch:</strong> dua sampel tanpa asumsi variansi sama — <strong>jadikan default</strong>; tanpa pre-test Levene.</li>
          <li><strong>Berpasangan:</strong> uji-t satu sampel pada selisih — membuang noise antar-subjek, power lebih tinggi.</li>
          <li><strong>ANOVA:</strong> <Tex math={String.raw`F = MSB/MSW`} /> — satu uji global untuk 3+ grup; signifikan = &ldquo;minimal satu pasangan beda&rdquo;, lanjut post-hoc.</li>
          <li><strong>Jangan:</strong> rentetan uji-t untuk banyak grup; pre-test variansi sebelum Welch; menyimpulkan &ldquo;terbukti sama&rdquo; dari p besar.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a24-uji-hipotesis" className="btn btn-secondary btn-sm">← A2.4</Link>
        <Link href="/learn/a26-nonparametrik" className="btn btn-primary btn-sm">Next: A2.6 →</Link>
      </div>
    </div>
  );
}
