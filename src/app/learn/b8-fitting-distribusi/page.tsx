import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B8FittingDistribusiPage() {
  const chart1 = [{"x": [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5], "y": [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2.6, 3.4], "type": "scatter", "mode": "markers", "name": "kuantil data vs Normal", "marker": {"color": "#e8a838", "size": 9}}, {"x": [-2.5, 2.5], "y": [-2.5, 2.5], "type": "scatter", "mode": "lines", "name": "garis cocok sempurna", "line": {"color": "#2a7de1", "dash": "dash"}}];
  const chart2 = [{"x": ["Normal", "t (ν=5)", "Pareto"], "y": [120.5, 112.3, 118.9], "type": "bar", "marker": {"color": ["#94a3b8", "#34a853", "#e8a838"]}, "text": ["120,5", "112,3", "118,9"], "textposition": "outside"}];
  const lab1Code = String.raw`import math
n, sukses = 100, 63
print(f"Data: {sukses} angka dari {n} lemparan")
print()
terbaik, ll_terbaik = 0, -1e18
for p100 in range(5, 96, 5):
    p = p100 / 100
    ll = sukses*math.log(p) + (n-sukses)*math.log(1-p)  # log-likelihood Binomial
    bar = "#" * int(50 * (ll + 400) / 130)
    print(f"p={p:.2f}  logL={ll:8.1f} {bar}")
    if ll > ll_terbaik:
        terbaik, ll_terbaik = p, ll
print(f"\nMLE: p^ = {terbaik:.2f} (= {sukses}/{n} = proporsi sampel)")
print("Coba: sukses=50. Di mana puncaknya? (harusnya 0.50)")`;
  const lab2Code = String.raw`import random, math, statistics
random.seed(82)
# data: 95% N(0,1) + 5% ekstrem (tanda acak * uniform 3..6)
data = [random.gauss(0,1) if random.random() < 0.95 else random.choice([-1,1])*random.uniform(3,6) for _ in range(2000)]
data.sort()
n = len(data)
# kuantil teoretis Normal via aproksimasi Acklam (inverse cdf)
def norm_ppf(p):
    a = [-39.696830286, 220.683265068, -275.928510446, 138.357751867, -30.664798066, 2.506628277]
    b = [-54.476098798, 161.585836858, -155.698979859, 66.801311887, -13.280681552]
    c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783]
    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416]
    pl, pu = 0.02425, 1 - 0.02425
    if pl < p < pu:
        q = p - 0.5; r = q*q
        return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)
    q = math.sqrt(-2*math.log(min(p, 1-p)))
    x = (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    return -x if p < 0.5 else x

print("QQ-plot (teoretis vs data), 10 titik teratas:")
print("  teoritis | data")
for i in range(n-10, n):
    t = norm_ppf((i+0.5)/n)
    flag = "  <-- MELENGKUNG!" if abs(data[i]) > abs(t)+0.8 else ""
    print(f"  {t:+.2f}   | {data[i]:+.2f}{flag}")
print("\nCoba: hapus komponen ekstrem (if random.random() < 1.0). Lengkungan hilang?")`;
  const quizData = [{"question": "MLE untuk Binomial(n=100, 63 sukses) menghasilkan p̂ = …", "options": ["0,5", "0,63", "0,37", "Tidak bisa tanpa prior"], "correct": 1, "explanation": "Benar: 63/100 — parameter yang membuat data paling tidak mengejutkan."}, {"question": "QQ-plot titik-titik melengkung ke atas di ujung kanan. Artinya…", "options": ["Data cocok sempurna", "Ekor kanan data lebih tebal dari model", "Ekor kanan lebih tipis", "Data simetris"], "correct": 1, "explanation": "Benar: data punya ekstrem lebih besar dari prediksi model — bahaya untuk risiko."}, {"question": "Untuk risiko (fokus ekor), uji goodness-of-fit yang lebih tepat…", "options": ["Kolmogorov-Smirnov", "Anderson-Darling", "Chi-square selalu", "Uji-t"], "correct": 1, "explanation": "Benar: AD memberi bobot lebih ke ekor. KS didominasi badan distribusi."}, {"question": "AIC = 2k − 2log L̂. Suku 2k berfungsi sebagai…", "options": ["Bonus akurasi", "Penalti kompleksitas (Occam's razor)", "Koreksi sampel kecil", "Normalisasi"], "correct": 1, "explanation": "Benar: menghukum parameter tambahan — model sederhana yang hampir sama baik akan menang."}, {"question": "p-value uji KS = 0,4. Interpretasi tepat?", "options": ["Distribusi terbukti benar", "Gagal menolak — belum tentu benar; cek power & QQ-plot", "Model salah", "Butuh lebih banyak parameter"], "correct": 1, "explanation": "Benar: &ldquo;gagal menolak&rdquo; ≠ &ldquo;benar&rdquo;. n kecil → power rendah → model salah pun lolos."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B8 — Probabilitas</span>
        <h1 className="display-title">Fitting Distribusi:<br/>Distribusi Mana yang Jujur?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model &ldquo;Sempurna&rdquo; yang Gagal di Ekor</a></li>
          <li><a href="#mle">MLE — Parameter yang Membuat Data Paling Masuk Akal</a></li>
          <li><a href="#qq">QQ-Plot — Diagnosis Visual 10 Detik</a></li>
          <li><a href="#uji">Uji Formal &amp; Pemilihan Model</a></li>
          <li><a href="#lab1">🔬 Lab 1: MLE Koin — Cari p yang Memaksimalkan Likelihood</a></li>
          <li><a href="#lab2">🔬 Lab 2: QQ-Plot Manual — Deteksi Ekor Tebal</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Alur Fitting yang Benar</a></li>
          <li><a href="#case">📋 Mini-Case: Memilih Model Kerugian Operasional</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>MLE</strong> (maximum likelihood) sebagai &ldquo;parameter yang membuat data paling masuk akal&rdquo;.</li><li>Memakai <strong>QQ-plot</strong> untuk diagnosis visual kecocokan distribusi.</li><li>Menerapkan <strong>uji goodness-of-fit</strong> (KS, chi-square, Anderson-Darling) + AIC/BIC untuk memilih model.</li><li>Menghindari jebakan: fitting distribusi yang salah untuk ekor (risiko!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Model &ldquo;Sempurna&rdquo; yang Gagal di Ekor</h2>

      <div className="story"><p>Tim risiko mem-fit distribusi Normal ke data kerugian operasional. QQ-plot tengahnya <strong>sempurna</strong> — titik-titik menempel garis. Uji chi-square: <em>p-value 0,4, &ldquo;lolos&rdquo;</em>. Model disetujui.</p><p>Setahun kemudian, kerugian Rp50 miliar datang — model Normal bilang peluangnya 1 banding 10 juta tahun. <strong>Modelnya &ldquo;lolos uji&rdquo; tapi buta di ekor</strong> — karena uji goodness-of-fit standar didominasi <em>badan</em> distribusi (tempat data terbanyak), bukan ekor (tempat risiko terbesar).</p><p>Lesson ini: cara fit yang benar + cara tahu kapan fit-mu menipu — terutama di ekor.</p><p><strong>Twist-nya:</strong> model &ldquo;lolos uji&rdquo; (p-value 0,4!) lalu gagal Rp50 miliar. Ujinya tidak salah — ia hanya menjawab &ldquo;apakah <em>badan</em> distribusi cocok&rdquo;, padahal yang membunuh adalah <em>ekor</em>. Seperti memeriksa kesehatan jantung dengan menimbang berat badan: angkanya akurat, organnya salah. Lesson ini mengajarkan memeriksa organ yang benar.</p></div>

      <h2 id="mle">MLE — Parameter yang Membuat Data Paling Masuk Akal</h2>

      <p><strong>Definisi.</strong> <strong>Likelihood</strong> <Tex math={String.raw`L(\theta)`} /> = peluang (densitas) data teramati <em>jika</em> parameter = <Tex math={String.raw`\theta`} />. <strong>MLE</strong> = <Tex math={String.raw`\theta`} /> yang memaksimalkan likelihood:</p>

      <p><Tex math={String.raw`\hat{\theta}_{MLE} = \arg\max_{\theta}\; L(\theta) = \arg\max_{\theta}\; \sum_{i=1}^{n} \log f(x_i;\theta)`} block /></p>

      <ul>
<li><Tex math={String.raw`\log`} />: dipakai karena jumlah lebih mudah dari kali (log-likelihood); maksimumnya sama.</li>
<li>Intuisi: &ldquo;parameter apa yang membuat data yang kita lihat menjadi <em>paling tidak mengejutkan</em>?&rdquo;</li>
</ul>

      <p><strong>Contoh.</strong> Koin 100x, 60 angka. Likelihood <Tex math={String.raw`L(p) = p^{60}(1-p)^{40}`} /> — dimaksimalkan di <Tex math={String.raw`\hat{p} = 60/100 = 0{,}6`} />. (Untuk Binomial, MLE = proporsi sampel — masuk akal!)</p>

      <p><strong>Contoh Normal:</strong> MLE <Tex math={String.raw`\hat{\mu} = \bar{x}`} /> (mean sampel), <Tex math={String.raw`\hat{\sigma}^2 = \frac{1}{n}\sum(x_i-\bar{x})^2`} /> (catatan: versi MLE pakai n, bukan n−1 — sedikit bias, lihat A2.2).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> MLE menjawab &ldquo;parameter terbaik untuk <em>distribusi yang sudah kupilih</em>&rdquo; — ia TIDAK menjawab &ldquo;distribusi mana yang benar&rdquo;. Mem-fit Normal dengan MLE ke data Pareto menghasilkan parameter Normal yang &ldquo;optimal&rdquo; tapi model yang salah. Pilih keluarga dulu (diagnosis!), baru estimasi parameter.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;MLE selalu memberikan jawaban terbaik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> MLE optimal secara asimtotik (n → ∞) <em>jika</em> keluarga distribusi benar. Untuk n kecil atau keluarga salah, MLE bisa buruk: ia sensitif terhadap outlier (satu titik ekstrem menggeser μ̂ dan menggelembungkan σ̂). Alternatif robust: M-estimator, atau Bayesian dengan prior (B17).</p>
</div>

      <h2 id="qq">QQ-Plot — Diagnosis Visual 10 Detik</h2>

      <p><strong>Ide:</strong> plot kuantil data vs kuantil teoretis distribusi kandidat. Cocok → titik-titik di <strong>garis lurus diagonal</strong>.</p>

      <ul>
<li><strong>Lengkung ke atas di kanan</strong> → ekor kanan data lebih tebal dari model (bahaya! model meremehkan ekstrem).</li>
<li><strong>Lengkung ke bawah di kanan</strong> → ekor lebih tipis (model terlalu konservatif).</li>
<li><strong>Bentuk S</strong> → miring (skew) tidak tertangkap model.</li>
</ul>

      <p><strong>Kepribadian:</strong> QQ-plot adalah &ldquo;tes kejujuran&rdquo; distribusi — ia memaksa model menunjukkan di mana ia berbohong, terutama di ekor (titik-titik ujung).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Baca QQ-plot dari <strong>ujung-ujungnya</strong>, bukan tengahnya. Tengah hampir selalu cocok — risiko tinggal di ujung. Aturan: jika 5 titik teratas melengkung menjauh garis, modelmu buta ekor.</p>
</div>

      <h2 id="uji">Uji Formal &amp; Pemilihan Model</h2>

      <h3>Uji goodness-of-fit</h3>

      <ul>
<li><strong>Kolmogorov-Smirnov (KS):</strong> jarak maksimum cdf empiris vs teoretis. Umum, tapi kurang peka di ekor.</li>
<li><strong>Anderson-Darling:</strong> seperti KS tapi <strong>memberi bobot lebih ke ekor</strong> — pilihan tepat untuk risiko!</li>
<li><strong>Chi-square:</strong> bandingkan frekuensi per bin. Butuh bin cukup; sensitif pada pilihan bin.</li>
</ul>

      <h3>Banding model: AIC/BIC</h3>

      <p><Tex math={String.raw`AIC = 2k - 2\log\hat{L}, \qquad BIC = k\log n - 2\log\hat{L}`} block /></p>

      <ul>
<li><Tex math={String.raw`k`} />: jumlah parameter — penalti kompleksitas (Occam's razor terkuantifikasi).</li>
<li><strong>Pilih yang terkecil.</strong> BIC menghukum lebih keras untuk n besar.</li>
</ul>

      <p><strong>Alur kerja yang benar:</strong> (1) plot histogram + QQ-plot beberapa kandidat → (2) MLE tiap kandidat → (3) bandingkan AIC/BIC + uji AD → (4) <strong>cek ekor secara khusus</strong> (QQ-plot ujung, exceedance) → (5) validasi out-of-sample.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;p-value &gt; 0,05 berarti distribusi benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak! &ldquo;Gagal menolak&rdquo; ≠ &ldquo;terbukti benar&rdquo;. Dengan n kecil, uji tidak punya power — distribusi salah pun lolos. Dengan n besar, perbedaan trivial pun &ldquo;signifikan&rdquo;. Uji adalah <em>saringan</em>, bukan sertifikat. Selalu pasangkan dengan QQ-plot + pertimbangan ekor.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Untuk risiko, urutan prioritas diagnosis: <strong>1. ekor (QQ ujung, AD)</strong>, 2. badan (KS, AIC), 3. tengah. Kebanyakan tutorial mengajarkan urutan terbalik — karena mereka tidak menanggung kerugian Rp50 miliar.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="QQ-Plot: Data vs Normal — Ekor Kanan Melengkung"
  layout={{"xaxis": {"title": "Kuantil teoretis Normal"}, "yaxis": {"title": "Kuantil data"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Titik = kuantil data vs kuantil Normal; garis putus-putus = cocok sempurna. Baca dari ujung kanan.</p>
<p><strong>Interpretasi:</strong> Tengah menempel garis (terlihat &ldquo;cocok&rdquo;!), tapi 2 titik teratas <strong>melengkung ke atas</strong> — ekor kanan data lebih tebal dari Normal. Inilah pola cerita pembuka: model &ldquo;lolos&rdquo; tapi buta ekor. <strong>Keputusan:</strong> tolak Normal untuk risiko; coba t/Pareto.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Banding Model via AIC (lebih kecil = lebih baik)"
  layout={{"xaxis": {"title": "Model"}, "yaxis": {"title": "AIC"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga kandidat di-fit via MLE ke data yang sama; batang = AIC (sudah termasuk penalti parameter).</p>
<p><strong>Interpretasi:</strong> t(ν=5) menang (112,3) — ekor tebalnya menjelaskan data lebih baik daripada Normal maupun Pareto murni. <strong>Tapi</strong> AIC adalah rata-rata terbobot seluruh data — untuk keputusan risiko, tetap cek QQ-plot ekor t(ν=5) sebelum percaya.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Fitting = memilih cerita yang paling jujur tentang datamu.</p>

            <details className="worked">
              <summary>📐 Kasus 1: MLE koin — dari hitungan ke rumus</summary>
              <p>10 lemparan: 7 angka. Berapa estimasi MLE p? Buktikan dengan likelihood.</p>
              <p><strong>Langkah 1</strong> — L(p) = C(10,7) p<sup>7</sup>(1−p)<sup>3</sup>. Log: ℓ = 7 ln p + 3 ln(1−p) + konst.<br />
              <strong>Langkah 2</strong> — turunan: 7/p − 3/(1−p) = 0 → 7(1−p) = 3p → 7 = 10p → <strong>p̂ = 0,7</strong>.<br />
              <strong>Langkah 3</strong> — baca: MLE Binomial = proporsi sampel. Sederhana — tapi <em>diturunkan</em>, bukan ditebak.</p>
              <p>Pelajaran: MLE mengubah &ldquo;kira-kira 0,7&rdquo; menjadi &ldquo;nilai p yang membuat data teramati paling mungkin&rdquo;. Prinsip yang sama (maksimalkan ℓ) dipakai untuk semua distribusi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: QQ-plot — baca ekor dalam 10 detik</summary>
              <p>Data kerugian (Rp M): 1, 2, 2, 3, 5, 8, 13, 25, 60. QQ-plot vs Normal: titik-titik tengah menempel garis, 2 titik kanan <em>melengkung ke atas</em> menjauhi garis. Apa artinya?</p>
              <p><strong>Langkah 1</strong> — titik di atas garis di ujung kanan = kuantil data &gt; kuantil Normal → <strong>ekor kanan lebih tebal</strong> dari Normal.<br />
              <strong>Langkah 2</strong> — implikasi: model Normal <em>meremehkan</em> peluang kerugian besar.<br />
              <strong>Langkah 3</strong> — tindakan: coba lognormal/Pareto; bandingkan AIC; cek khusus ekor (POT/GPD, B16).</p>
              <p>Pelajaran: &ldquo;melengkung ke atas di kanan&rdquo; = satu frasa yang menyelamatkan Rp50 miliar (cerita pembuka). QQ-plot dibaca dari <em>ujungnya</em>, bukan tengahnya.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: AIC — Normal vs Lognormal</summary>
              <p>Data kerugian n = 200. Log-likelihood Normal = −520 (k=2 parameter); Lognormal = −490 (k=2). Mana yang dipilih? Berapa kuat buktinya?</p>
              <p><strong>Langkah 1</strong> — AIC = −2ℓ + 2k. Normal: 1040 + 4 = 1044. Lognormal: 980 + 4 = <strong>984</strong>.<br />
              <strong>Langkah 2</strong> — selisih Δ = 60 — <em>sangat besar</em> (aturan: Δ &gt; 10 = bukti decisive). Pilih <strong>lognormal</strong>.<br />
              <strong>Langkah 3</strong> — catatan: k sama di sini, jadi penalti kompleksitas netral — murni adu likelihood. Jika k beda, AIC menghukum parameter tambahan.</p>
              <p>Pelajaran: AIC = &ldquo;seberapa baik fit, didiskon kompleksitas&rdquo;. Jangan pilih model dengan mata (R²) — pilih dengan kriteria yang menghukum overfitting.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: MLE Koin — Cari p yang Memaksimalkan Likelihood</h2>

      <p>Data: 100 lemparan, 63 angka. Hitung log-likelihood untuk p=0,1..0,9 — buktikan maksimum di 0,63.</p>

      <PyodideLab
  title="Lab 1 — Maximum Likelihood dari Nol"
  hint="Untuk Binomial, MLE = proporsi — tapi untuk distribusi lain (Gamma, Beta) butuh optimasi numerik (scipy, D11)."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: QQ-Plot Manual — Deteksi Ekor Tebal</h2>

      <p>Buat data campuran (95% Normal + 5% ekstrem), lalu QQ-plot vs Normal manual. Lihat ekor melengkung!</p>

      <PyodideLab
  title="Lab 2 — QQ-Plot dari Nol (tanpa scipy)"
  hint="Inilah yang dilihat tim risiko di cerita pembuka — bedanya mereka &lt;strong>mengabaikan&lt;/strong> lengkungannya."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Alur Fitting yang Benar</h2>

      <div className="decision-card">
<h3>1. Belum tahu keluarga → <strong>diagnosis dulu (histogram + QQ-plot)</strong></h3>
<p><strong>Kondisi data:</strong> Asal pilih Normal adalah default yang berbahaya.</p>
<p><strong>Kenapa:</strong> Bentuk data (miring? ekor tebal? bimodal?) menentukan keluarga — bukan sebaliknya.</p>
<p><strong>Contoh nyata:</strong> Ekor melengkung di QQ Normal → coba t / Pareto.</p>
</div>

      <div className="decision-card">
<h3>2. Keluarga dipilih → <strong>MLE untuk parameter</strong></h3>
<p><strong>Kondisi data:</strong> Butuh parameter terbaik dalam keluarga itu.</p>
<p><strong>Kenapa:</strong> Prinsip &ldquo;data paling tidak mengejutkan&rdquo;; optimal asimtotik jika keluarga benar.</p>
<p><strong>Contoh nyata:</strong> μ̂ = x̄, σ̂ dari data untuk Normal.</p>
</div>

      <div className="decision-card">
<h3>3. Banding beberapa kandidat → <strong>AIC/BIC + uji Anderson-Darling</strong></h3>
<p><strong>Kondisi data:</strong> Lebih dari satu keluarga masuk akal.</p>
<p><strong>Kenapa:</strong> AIC/BIC menghukum kompleksitas; AD peka ekor (penting untuk risiko).</p>
<p><strong>Contoh nyata:</strong> Normal vs t(ν=5) vs Pareto untuk data kerugian.</p>
</div>

      <div className="decision-card">
<h3>4. Keputusan melibatkan ekor → <strong>cek ekor khusus</strong></h3>
<p><strong>Kondisi data:</strong> VaR, modal, worst-case — semua tentang ekor.</p>
<p><strong>Kenapa:</strong> Uji global didominasi badan data; ekor butuh perhatian khusus (QQ ujung, exceedance count).</p>
<p><strong>Contoh nyata:</strong> Hitung P(X &gt; 50M) dari tiap kandidat — bandingkan langsung.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li><strong>Keluarga dulu, parameter kemudian.</strong> MLE tidak memilihkan keluarga.</li><li>QQ-plot dibaca dari <strong>ujung</strong>, bukan tengah.</li><li>Untuk risiko: Anderson-Darling &gt; KS; dan selalu cek ekor secara eksplisit.</li><li>&ldquo;Gagal menolak&rdquo; ≠ &ldquo;terbukti benar&rdquo;.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Memilih Model Kerugian Operasional</h2>

      <div className="callout">
<p>Data 500 kerugian operasional (Rp juta): mean 120, median 45, maks 8.500. Tiga kandidat ter-fit:</p><ul><li>Lognormal: AIC 5.210, AD p-value 0,08</li><li>Pareto: AIC 5.195, AD p-value 0,15</li><li>Campuran (body Lognormal + ekor Pareto): AIC 5.180, AD p-value 0,35</li></ul><p><strong>Pertanyaan:</strong> model mana untuk perhitungan modal (ekor 99,9%)? Mengapa bukan sekadar &ldquo;AIC terkecil&rdquo;?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Campuran.</strong> AIC memang terkecil, tapi alasan utamanya struktural: <strong>mekanisme badan ≠ mekanisme ekor</strong>. Kerugian rutin (proses) vs kerugian bencana (fraud besar/sistem) adalah dua fenomena — satu distribusi dipaksa menjelaskan keduanya akan kompromi di tempat yang salah.</p><p>Mengapa bukan &ldquo;AIC terkecil, selesai&rdquo;? Karena AIC rata-rata seluruh data — untuk kuantil 99,9%, yang relevan adalah <em>fit di ekor</em> (AD + QQ ujung + exceedance backtest). Praktik industri (LDA untuk risiko operasional): body + ekor terpisah (B16/EVT). <strong>Pelajaran:</strong> kriteria statistik + pengetahuan mekanisme &gt; satu angka.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Data Poisson: observasi 2, 3, 1, 4, 0 (n=5). Turunkan dan hitung estimasi MLE λ.</li>
              <li>QQ-plot vs Eksponensial: titik-titik ujung kanan <em>di bawah</em> garis. Ekor data lebih tebal atau lebih tipis dari Eksponensial?</li>
              <li>Model A: ℓ = −300, k = 3. Model B: ℓ = −298, k = 5. n = 500. Hitung AIC keduanya — mana yang dipilih?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> ℓ = −nλ + (Σx)ln λ + konst → dℓ/dλ = −n + Σx/λ = 0 → λ̂ = x̄ = (2+3+1+4+0)/5 = <strong>2,0</strong>. (MLE Poisson = mean sampel.)</p>
              <p><strong>2.</strong> Di bawah garis di kanan = kuantil data &lt; kuantil model → ekor data <strong>lebih tipis</strong> dari Eksponensial. Model melebih-lebihkan risiko ekor (konservatif — masih lebih aman daripada sebaliknya).</p>
              <p><strong>3.</strong> AIC_A = 600+6 = 606; AIC_B = 596+10 = 606. <strong>Seri!</strong> — pilih A (lebih sederhana, prinsip parsimoni). Tambahan 2 parameter tidak membeli apa-apa.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>MLE:</strong> parameter yang membuat data paling tidak mengejutkan — tapi tidak memilih keluarga distribusi.</li><li><strong>QQ-plot:</strong> baca dari ujung; lengkung = model buta ekor/bentuk.</li><li><strong>AD &gt; KS</strong> untuk risiko; <strong>AIC/BIC</strong> untuk banding model (terkecil menang).</li><li><strong>Alur:</strong> diagnosis → MLE → banding → cek ekor khusus → validasi out-of-sample.</li><li><strong>Jangan</strong> anggap &ldquo;lolos uji&rdquo; = &ldquo;benar&rdquo; — terutama untuk ekor.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b7-distribusi-kontinu-2" className="btn btn-secondary btn-sm">← ← B7.2</Link>
        <Link href="/learn/b9-joint-kovarians" className="btn btn-primary btn-sm">Next: B9 →</Link>
      </div>
    </div>
  );
}
