import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B16HeavyTailsEvtPage() {
  const chart1 = [{"x": [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 10.0], "y": [1.0, 0.7607, 0.6037, 0.4941, 0.4141, 0.3536, 0.3065, 0.269, 0.2385, 0.2134, 0.1925, 0.1747, 0.1595, 0.1464, 0.135, 0.125, 0.1162, 0.1083, 0.1014, 0.0951, 0.0894, 0.0843, 0.0797, 0.0755, 0.0716, 0.068, 0.0648, 0.0618, 0.059, 0.0564, 0.054, 0.0518, 0.0497, 0.0477, 0.0459, 0.0442, 0.0426, 0.0411, 0.0397, 0.0383, 0.037, 0.0358, 0.0347, 0.0336, 0.0326, 0.0316], "type": "scatter", "mode": "lines", "name": "Pareto (heavy)", "line": {"color": "#ef4444"}}, {"x": [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2, 9.4, 9.6, 9.8, 10.0], "y": [1.0, 0.6703, 0.4493, 0.3012, 0.2019, 0.1353, 0.0907, 0.0608, 0.0408, 0.0273, 0.0183, 0.0123, 0.0082, 0.0055, 0.0037, 0.0025, 0.0017, 0.0011, 0.0007, 0.0005, 0.0003, 0.0002, 0.0002, 0.0001, 0.0001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "type": "scatter", "mode": "lines", "name": "Eksponensial (tipis)", "line": {"color": "#2a7de1", "dash": "dash"}}];
  const lab1Code = String.raw`import random, statistics
random.seed(161)

def pareto(a):
    return 1.0/(random.random()**(1/a))

data = [pareto(1.5) for _ in range(5000)]
data.sort()
q99_emp = data[int(0.99*len(data))]
# fit Normal (MLE): mean & sd sampel
mu, sd = statistics.mean(data), statistics.pstdev(data)
# kuantil 99% Normal = mu + 2.326*sd
q99_norm = mu + 2.326*sd
print(f"Kuantil 99% empiris : {q99_emp:.1f}")
print(f"Kuantil 99% Normal  : {q99_norm:.1f}")
print(f"Normal meremehkan {(1-q99_norm/q99_emp):.0%}!")
print(f"(mean={mu:.1f}, sd={sd:.1f} — sd meledak karena 1-2 monster)")
print("\nCoba: apa yang terjadi jika 2 data terbesar dibuang? (jangan di praktik!)")`;
  const lab2Code = String.raw`import random, math, statistics
random.seed(162)

def pareto(a):
    return 1.0/(random.random()**(1/a))

data = sorted([pareto(1.5) for _ in range(20000)])
n = len(data)
u = data[int(0.95*n)]  # ambang 95%
exc = [x for x in data if x > u]
k = len(exc)
# estimator Hill untuk xi
xi = sum(math.log(x/u) for x in exc) / k
zeta = k / n
print(f"ambang u={u:.1f}, exceedance={k}, xi(Hill)={xi:.2f} (teori 1/1.5=0.67)")
for m in [100, 500, 2000]:
    xm = u * (m*zeta)**xi  # return level Pareto
    print(f"return level 1-in-{m}: {xm:.1f}")
print(f"\nmax data = {data[-1]:.1f}. Return 1-in-2000 ({u*(2000*zeta)**xi:.0f}) MELAMPAUI max!")
print("Itulah gunanya EVT: ekstrapolasi jujur ke luar data.")
print("Coba: n=2000 saja. Stabilkah xi? (data ekor butuh BANYAK)")`;
  const quizData = [{"question": "Heavy tail berarti…", "options": ["Banyak outlier kecil", "Ekor turun lebih lambat dari eksponensial — ekstrem struktural", "Data selalu Pareto", "Varians nol"], "correct": 1, "explanation": "Benar: definisi formal via limit. Konsekuensi: momen bisa tak hingga, ekstrem adalah rutin."}, {"question": "Fisher-Tippett adalah padanan CLT untuk…", "options": ["Rata-rata", "Maksimum", "Median", "Varians"], "correct": 1, "explanation": "Benar: maksimum ternormalisasi → GEV (Fréchet/Gumbel/Weibull tergantung ξ)."}, {"question": "Kelebihan POT dibanding block maxima…", "options": ["Lebih sederhana", "Memakai semua exceedance — efisien data", "Tidak butuh ambang", "Selalu akurat"], "correct": 1, "explanation": "Benar: block maxima boros (1/blok). POT memakai semua data ekstrem."}, {"question": "&ldquo;Banjir 1-in-100-tahun&rdquo;. P(terjadi dalam 30 tahun) ≈ …", "options": ["30%", "26% (1−0,99³⁰)", "100%", "3%"], "correct": 1, "explanation": "Benar: 1% per tahun, bukan jadwal. 26% dalam 30 tahun — jauh dari &ldquo;aman&rdquo;."}, {"question": "QQ-plot data vs Eksponensial melengkung ke atas. Artinya…", "options": ["Ekor tipis", "Heavy tail — butuh EVT, bukan model eksponensial", "Data normal", "Tidak ada info"], "correct": 1, "explanation": "Benar: ekor data lebih tebal dari eksponensial. Jangan ekstrapolasi dengan model tipis."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B16 — Probabilitas</span>
        <h1 className="display-title">Heavy Tails &amp; EVT:<br/>Ekor yang Memakan Model</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Banjir &ldquo;1-in-100-Tahun&rdquo; yang Datang 3x Seabad</a></li>
          <li><a href="#heavy">Heavy Tail — Definisi &amp; Deteksi</a></li>
          <li><a href="#gev">Fisher-Tippett — Teorema Limit untuk Maksimum</a></li>
          <li><a href="#pot">POT + GPD — Memakai Semua Data Ekor</a></li>
          <li><a href="#lab1">🔬 Lab 1: Normal vs Pareto — Siapa Meremehkan Ekor?</a></li>
          <li><a href="#lab2">🔬 Lab 2: Return Level &ldquo;1-in-100&rdquo; via POT (sketsa)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan EVT</a></li>
          <li><a href="#case">📋 Mini-Case: Modal Risiko Operasional (LDA)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>heavy tail</strong>: definisi, deteksi (log-log, Hill), dan mengapa Normal gagal.</li><li>Menjelaskan <strong>teorema Fisher-Tippett</strong>: maksimum ternormalisasi → GEV.</li><li>Menerapkan <strong>metode POT + GPD</strong> untuk mengestimasi kuantil ekstrem.</li><li>Menghitung <strong>return level</strong> (&ldquo;1-in-100-tahun&rdquo;) dengan benar + batasnya.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Banjir &ldquo;1-in-100-Tahun&rdquo; yang Datang 3x Seabad</h2>

      <div className="story"><p>Kota membangun tanggul untuk banjir &ldquo;1-in-100-tahun&rdquo; berdasar 50 tahun data dengan model Normal. Dalam 30 tahun berikutnya, banjir sebesar itu datang <strong>3 kali</strong>. Insinyurnya bingung: <em>&ldquo;Kemungkinan 3 kejadian 1%-per-tahun dalam 30 tahun kan kecil sekali?&rdquo;</em></p><p>Yang salah: <strong>modelnya</strong>. Tinggi banjir berekor tebal (Pareto-like) — ekstrapolasi Normal dari 50 tahun data meremehkan kuantil 1% secara sistematis. Dan &ldquo;1-in-100-tahun&rdquo; dari data 50 tahun adalah <strong>ekstrapolasi</strong>, bukan observasi.</p><p><strong>Extreme Value Theory (EVT)</strong> adalah statistika khusus untuk ekor — satu-satunya cara jujur menjawab &ldquo;seberapa besar yang 1-in-100-tahun?&rdquo;.</p><p><strong>Twist-nya:</strong> &ldquo;banjir 100-tahunan&rdquo; yang dihitung dari 50 tahun data — frasa itu sendiri kontradiksi: kamu mengklaim tahu tentang kejadian yang (menurut modelmu) belum pernah kamu amati. EVT tidak memberi kepastian; ia memberi cara <em>jujur</em> untuk berkata &ldquo;kita tidak tahu&rdquo; — beserta batas terhitung dari ketidaktahuan itu. Dalam risiko ekor, kejujuran tentang ketidaktahuan adalah satu-satunya kompetensi.</p></div>

      <h2 id="heavy">Heavy Tail — Definisi &amp; Deteksi</h2>

      <p><strong>Definisi.</strong> Distribusi berekor tebal (kanan) jika ekornya turun <strong>lebih lambat dari eksponensial</strong>:</p>

      <p><Tex math={String.raw`\lim_{x\to\infty} \frac{P(X > x)}{e^{-\lambda x}} = \infty \quad \text{untuk semua } \lambda > 0`} block /></p>

      <p>Praktisnya: Pareto, lognormal (agak), t-Student — vs Normal/Eksponensial (tipis). <strong>Konsekuensi:</strong> momen bisa tak hingga (B7.2); sampel maksimum tumbuh cepat; CLT lambat/gagal.</p>

      <p><strong>Deteksi:</strong></p>

      <ul>
<li><strong>Plot log-log</strong> P(X&gt;x) vs x: garis lurus → Pareto (kemiringan −α).</li>
<li><strong>QQ-plot vs Eksponensial:</strong> melengkung ke atas → heavy.</li>
<li><strong>Plot Hill:</strong> estimasi α vs jumlah order statistic — datar = stabil.</li>
<li><strong>Rasio max/sum:</strong> jika satu observasi mendominasi total → heavy (coba: 1% terbesar menyumbang berapa % total?).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tes 10 detik: urutkan data, lihat 1% teratas menyumbang berapa % dari total. Normal: ~3%. Pareto α=1,5: ~30%+. Jika &ldquo;secuil data menguasai total&rdquo; — kamu di wilayah heavy tail, dan mean/SD tidak bisa dipercaya.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Ekor tebal hanya soal &ldquo;outlier sesekali&rdquo;.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Bukan sesekali — ini <em>struktural</em>. Pada Pareto α=1,5, kejadian &ldquo;10x median&rdquo; terjadi ~3% waktu (vs 0% praktis pada Normal). Seluruh strategi (asuransi, modal, reasuransi) harus didesain untuk dunia di mana ekstrem adalah <em>rutin</em>, bukan anomali.</p>
</div>

      <h2 id="gev">Fisher-Tippett — Teorema Limit untuk Maksimum</h2>

      <p>CLT adalah teorema limit untuk <em>rata-rata</em>. EVT punya padanannya untuk <em>maksimum</em>:</p>

      <p><Tex math={String.raw`\frac{M_n - b_n}{a_n} \xrightarrow{d} G_\xi`} block /></p>

      <p>dengan <Tex math={String.raw`M_n = \max(X_1,\ldots,X_n)`} /> dan <Tex math={String.raw`G_\xi`} /> = <strong>Generalized Extreme Value (GEV)</strong>:</p>

      <p><Tex math={String.raw`G_\xi(x) = \exp\!\big(-(1+\xi x)^{-1/\xi}\big)`} block /></p>

      <ul>
<li><Tex math={String.raw`\xi > 0`} />: <strong>Fréchet</strong> — heavy tail (Pareto-like). Ini yang menakutkan.</li>
<li><Tex math={String.raw`\xi = 0`} />: <strong>Gumbel</strong> — ekor tipis (Normal/Eksponensial).</li>
<li><Tex math={String.raw`\xi < 0`} />: <strong>Weibull</strong> — ada batas atas hingga.</li>
</ul>

      <p><strong>Metode block maxima:</strong> ambil maksimum per blok (tahunan), fit GEV via MLE → estimasi return level.</p>

      <p><strong>Kepribadian:</strong> jika CLT bilang &ldquo;rata-rata selalu jadi lonceng&rdquo;, Fisher-Tippett bilang &ldquo;maksimum selalu jadi salah satu dari tiga bentuk&rdquo; — dan bentuknya (ξ) menentukan apakah duniamu jinak atau liar.</p>

      <h2 id="pot">POT + GPD — Memakai Semua Data Ekor</h2>

      <p>Block maxima boros (1 data per tahun!). <strong>POT (Peaks Over Threshold):</strong> ambil semua <em>exceedance</em> di atas ambang u. Teorema Pickands-Balkema-de Haan: exceedance ternormalisasi → <strong>Generalized Pareto (GPD)</strong>:</p>

      <p><Tex math={String.raw`P(X - u > y \mid X > u) \approx \left(1 + \frac{\xi y}{\beta}\right)^{-1/\xi}`} block /></p>

      <p><strong>Return level</strong> &ldquo;1-in-m observasi&rdquo&gt;:</p>

      <p><Tex math={String.raw`x_m = u + \frac{\beta}{\xi}\left((m\,\zeta_u)^{\xi} - 1\right)`} block /></p>

      <p>dengan <Tex math={String.raw`\zeta_u = P(X > u)`} /> (proporsi exceedance). <strong>Contoh:</strong> u = Rp1 M, ξ = 0,3, β = 0,5M, ζᵤ = 5%: level 1-in-100 → x ≈ 1 + (0,5/0,3)((100×0,05)^0,3 − 1) ≈ Rp3,7 M.</p>

      <p><strong>Pemilihan ambang u:</strong> trade-off bias-varians — terlalu rendah (teorema belum berlaku), terlalu tinggi (sedikit data). Praktik: <strong>mean excess plot</strong> harus linear di atas u.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan praktis: u di sekitar <strong>kuantil 90–95%</strong> data. Lalu cek stabilitas: geser u sedikit — jika ξ berubah drastis, ambangmu salah atau data tidak cukup.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;&ldquo;1-in-100-tahun&rdquo; berarti aman 99 tahun.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Artinya peluang 1% <em>tiap tahun</em> — seperti dadu 100-sisi tiap tahun. P(terjadi dalam 30 tahun) = 1−0,99³⁰ ≈ <strong>26%</strong>! Dan jika iklim berubah (non-stasioner), &ldquo;1-in-100&rdquo; historis bisa jadi &ldquo;1-in-20&rdquo; saat ini. Return level adalah <em>probabilitas tahunan</em>, bukan jadwal.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Ekor: Pareto vs Eksponensial (skala log-log)"
  layout={{"xaxis": {"title": "x (log)", "type": "log"}, "yaxis": {"title": "P(X > x) (log)", "type": "log"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Skala log-log: garis lurus = hukum pangkat (Pareto); melengkung turun = ekor tipis.</p>
<p><strong>Interpretasi:</strong> Pada x=10, peluang Pareto ~30x lipat Eksponensial. <strong>Ekstrapolasi Normal/Eksponensial ke wilayah 1-in-100 meremehkan secara sistematis</strong> — inilah dosa insinyur tanggul di cerita pembuka. Diagnosis 10 detik: plot log-log dulu.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Ekor = tempat model Normal berbohong.</p>

            <details className="worked">
              <summary>📐 Kasus 1: &ldquo;1-in-100-tahun&rdquo; dari 50 tahun data</summary>
              <p>Tinggi banjir tahunan: 50 data, max 8 m. Model Normal memberi kuantil-99% = 7,5 m → tanggul 8 m &ldquo;aman untuk 100 tahun&rdquo;. Apa masalahnya?</p>
              <p><strong>Langkah 1</strong> — kuantil-99% dari 50 data = <em>ekstrapolasi</em>: kamu belum pernah mengamati kejadian 1%-an (ekspektasi: 0,5 kejadian dalam 50 tahun!).<br />
              <strong>Langkah 2</strong> — jika data berekor tebal (Pareto-like), kuantil-99% sebenarnya bisa 12 m — Normal meremehkan <strong>4 meter</strong>.<br />
              <strong>Langkah 3</strong> — SE kuantil-99% dari n=50 sangat besar — &ldquo;7,5 m&rdquo; punya interval mungkin (6; 11) m.</p>
              <p>Pelajaran: &ldquo;return period&rdquo; dari data pendek = ekstrapolasi model, bukan fakta. EVT memberi cara ekstrapolasi yang <em>jujur</em> (dengan interval!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: GPD — ekor di atas ambang</summary>
              <p>Kerugian operasional: ambang u = Rp10 M, 40 exceedance. Fit GPD: ξ = 0,3, β = 5. Berapa VaR 99,9%?</p>
              <p><strong>Langkah 1</strong> — P(X &gt; u) = 40/n. Misal n = 1.000 hari → 4%.<br />
              <strong>Langkah 2</strong> — VaR<sub>99,9%</sub> = u + (β/ξ)[((0,04)/(0,001))<sup>ξ</sup> − 1] = 10 + (5/0,3)[40<sup>0,3</sup> − 1].<br />
              <strong>Langkah 3</strong> — 40<sup>0,3</sup> ≈ 3,03 → VaR ≈ 10 + 16,67×2,03 ≈ <strong>Rp43,8 M</strong>.</p>
              <p>Pelajaran: POT memakai <em>semua</em> data ekor (40 titik), bukan cuma max tahunan (beberapa titik) — jauh lebih efisien. ξ &gt; 0 = ekor tebal = ekstrapolasi meledak.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Hill plot — baca ξ dari data</summary>
              <p>100 kerugian terbesar diurutkan. Hill estimator dengan k = 20, 40, 60 memberi ξ̂ = 0,31; 0,29; 0,45. Berapa ξ yang dipakai? Mengapa k=60 dicurigai?</p>
              <p><strong>Langkah 1</strong> — plot ξ̂ vs k: stabil di 0,29–0,31 untuk k = 20–40, lalu melompat di 60.<br />
              <strong>Langkah 2</strong> — lompatan = k terlalu besar: ambang masuk ke <em>badan</em> distribusi (bukan ekor murni) → bias.<br />
              <strong>Langkah 3</strong> — pilih daerah stabil: ξ̂ ≈ <strong>0,30</strong> (k ≈ 30).</p>
              <p>Pelajaran: estimasi ekor = tradeoff bias-varians via pilihan ambang. &ldquo;Daerah stabil&rdquo; di Hill plot = cara praktisi memilih. Tidak ada jawaban otomatis — ada judgment.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Normal vs Pareto — Siapa Meremehkan Ekor?</h2>

      <p>Data benar Pareto(α=1,5). Fit Normal (MLE) lalu bandingkan prediksi kuantil 99% vs kuantil empiris.</p>

      <PyodideLab
  title="Lab 1 — Ekstrapolasi yang Jujur vs Menipu"
  hint="Inilah &amp;ldquo;cerita tanggul&amp;rdquo; dalam angka: model Normal dari data yang sama meremehkan kuantil ekstrem."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Return Level &ldquo;1-in-100&rdquo; via POT (sketsa)</h2>

      <p>Ambang u = kuantil 95%. Estimasi ξ via Hill, hitung return level 1-in-100 & 1-in-500.</p>

      <PyodideLab
  title="Lab 2 — Estimasi Kuantil Ekstrem"
  hint="EVT mengekstrapolasi &lt;strong>keluar&lt;/strong> data — satu-satunya metode berprinsip untuk itu. Tapi butuh banyak data ekor."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan EVT</h2>

      <div className="decision-card">
<h3>1. Butuh kuantil ekstrem / return level → <strong>EVT (POT/GPD)</strong></h3>
<p><strong>Kondisi data:</strong> Pertanyaan &ldquo;1-in-100&rdquo;, VaR 99,9%, modal bencana.</p>
<p><strong>Kenapa:</strong> Satu-satunya ekstrapolasi ekor yang berprinsip.</p>
<p><strong>Contoh nyata:</strong> Tanggul 1-in-100-tahun, modal risiko operasional.</p>
</div>

      <div className="decision-card">
<h3>2. Data cukup + maksimum per blok → <strong>block maxima + GEV</strong></h3>
<p><strong>Kondisi data:</strong> Data tahunan panjang (banjir tahunan, return tahunan).</p>
<p><strong>Kenapa:</strong> Sederhana; tapi boros data.</p>
<p><strong>Contoh nyata:</strong> Rekor banjir tahunan 80 tahun.</p>
</div>

      <div className="decision-card">
<h3>3. Data harian, butuh semua ekor → <strong>POT + GPD</strong></h3>
<p><strong>Kondisi data:</strong> Exceedance di atas ambang u.</p>
<p><strong>Kenapa:</strong> Efisien: pakai semua data ekstrem, bukan 1/blok.</p>
<p><strong>Contoh nyata:</strong> Kerugian operasional harian di atas Rp1 M.</p>
</div>

      <div className="decision-card">
<h3>4. Curiga non-stasioner (iklim berubah) → <strong>EVT non-stasioner</strong></h3>
<p><strong>Kondisi data:</strong> &ldquo;1-in-100&rdquo; masa lalu ≠ masa kini.</p>
<p><strong>Kenapa:</strong> Parameter GEV sebagai fungsi waktu/kovariat.</p>
<p><strong>Contoh nyata:</strong> Banjir dengan tren iklim; frekuensi fraud yang naik.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Curiga heavy tail → <strong>plot log-log</strong> dulu (10 detik).</li><li>Butuh di luar data → <strong>EVT</strong>; jangan ekstrapolasi Normal.</li><li>&ldquo;1-in-100&rdquo; = 1% per tahun, bukan jadwal — P(30 thn) ≈ 26%.</li><li>Ambang POT ~ kuantil 90–95%; cek stabilitas ξ.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Modal Risiko Operasional (LDA)</h2>

      <div className="callout">
<p>Bank memakai LDA (Loss Distribution Approach): frekuensi ~ Poisson(50/thn), severitas ~ Lognormal. AMA menghitung VaR 99,9% = Rp80 M. Kamu curiga severitas berekor tebal (ada 2 kerugian &gt; Rp30 M dalam 5 tahun).</p><p><strong>Pertanyaan:</strong> (a) Bagaimana menguji kecurigaan? (b) Jika benar, apa dampak ke VaR 99,9%? (c) Desain model yang lebih jujur.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Uji:</strong> log-log plot severitas; Hill estimator; QQ-plot vs Lognormal (lengkung ke atas di kanan = lebih tebal). 2/250 (0,8%) kerugian &gt; Rp30 M — bandingkan dengan prediksi Lognormal.</p><p>(b) <strong>Dampak:</strong> VaR 99,9% sangat sensitif ke ekor — ganti Lognormal → GPD/Pareto untuk ekor bisa menaikkan VaR <strong>2–5x lipat</strong>. Rp80 M bisa jadi Rp200–400 M. Inilah mengapa &ldquo;model risk&rdquo; untuk LDA sangat tinggi.</p><p>(c) <strong>Desain jujur:</strong> body (di bawah ambang) ~ Lognormal + ekor (di atas ambang) ~ GPD (spliced model, seperti mini-case B8!). Validasi: backtest exceedance (berapa kali &gt; VaR?) + stress ξ. <strong>Pelajaran:</strong> untuk risiko operasional, <em>pemilihan ekor</em> adalah keputusan modal terbesar — lebih penting dari presisi parameter body.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Data klaim: mean = 5, median = 2, max = 200 (n = 1.000). Sebutkan 2 bukti visual/numerik bahwa ekornya tebal.</li>
              <li>Mengapa block maxima (GEV) &ldquo;membuang&rdquo; data dibanding POT? Kapan GEV tetap lebih tepat?</li>
              <li>ξ = 0,4 untuk kerugian. Apa artinya untuk eksistensi mean dan varians? (Ingat: GPD punya mean jika ξ &lt; 1, varians jika ξ &lt; 0,5.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) mean (5) jauh &gt; median (2) — miring kanan ekstrem; (b) max (200) = 40× mean — di Normal, max 1000 sampel ≈ mean + 3,1 SD, tidak 40× mean. QQ-plot akan melengkung tajam ke atas di kanan.</p>
              <p><strong>2.</strong> GEV hanya memakai 1 max per blok (mis. per tahun) — membuang max kedua, ketiga, dst. GEV tepat jika datanya <em>alami</em> berbentuk blok-max (banjir tahunan, rekor suhu) atau saat dependensi dalam blok bermasalah.</p>
              <p><strong>3.</strong> ξ = 0,4 &lt; 1 → <strong>mean ada</strong>; ξ = 0,4 &lt; 0,5 → <strong>varians ada</strong> (tapi besar). Hati-hati: ξ ≥ 0,5 = varians tak berhingga → seluruh inferensi berbasis SD runtuh.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Heavy tail:</strong> ekor turun lambat; deteksi via log-log/Hill/rasio max-sum.</li><li><strong>Fisher-Tippett:</strong> maksimum → GEV; ξ&gt;0 (Fréchet) = dunia liar.</li><li><strong>POT+GPD:</strong> exceedance di atas ambang → return level; ambang ~k95, cek stabilitas.</li><li><strong>&ldquo;1-in-m&rdquo;</strong> = peluang tahunan, bukan jadwal.</li><li><strong>Jangan</strong> ekstrapolasi Normal ke ekor; <strong>jangan</strong> anggap ekstrem sebagai anomali.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b15-proses-stokastik" className="btn btn-secondary btn-sm">← ← B15</Link>
        <Link href="/learn/b17-bayesian-praktis" className="btn btn-primary btn-sm">Next: B17 →</Link>
      </div>
    </div>
  );
}
