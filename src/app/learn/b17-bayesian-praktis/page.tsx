import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B17BayesianPraktisPage() {
  const chart1 = [{"x": ["n=10 (30% mentah)", "n=100", "n=1000", "n=10000"], "y": [0.0525, 0.062, 0.068, 0.0695], "type": "bar", "name": "Estimasi Bayesian", "marker": {"color": "#2a7de1"}, "text": ["5,25%", "6,2%", "6,8%", "6,95%"], "textposition": "outside"}, {"x": ["n=10 (30% mentah)", "n=100", "n=1000", "n=10000"], "y": [0.3, 0.08, 0.072, 0.0702], "type": "scatter", "mode": "lines+markers", "name": "Estimasi mentah", "line": {"color": "#e8a838"}}];
  const lab1Code = String.raw`import random
random.seed(171)
pa, pb = 50, 950  # prior
p_true = 0.07
print(f"Prior: Beta({pa},{pb}) -> mean {pa/(pa+pb):.2%}; PD benar {p_true:.0%}")
print()
for n in [10, 50, 200, 1000, 5000]:
    s = sum(random.random() < p_true for _ in range(n))
    mentah = s / n
    post_mean = (pa + s) / (pa + pb + n)
    menang = "BAYES" if abs(post_mean-p_true) < abs(mentah-p_true) else "mentah"
    print(f"n={n:>5}: mentah={mentah:6.2%}  bayes={post_mean:6.2%}  menang={menang}")
print()
print("Coba: prior Beta(1,1) (noninformatif). Kapan bayes masih menang?")
`;
  const lab2Code = String.raw`import random
random.seed(172)
# posterior setelah data: Beta(53, 957) [cerita cabang baru]
a, b = 53, 957
N = 100000
# sampel Beta via dua Gamma
samp = [random.gammavariate(a, 1) / (random.gammavariate(a, 1) + random.gammavariate(b, 1)) for _ in range(N)]
samp.sort()
print(f"Posterior mean      = {sum(samp)/N:.2%}")
print(f"Interval kredibel 95% = [{samp[int(0.025*N)]:.2%}, {samp[int(0.975*N)]:.2%}]")
print(f"P(PD > 10%)         = {sum(1 for s in samp if s > 0.10)/N:.2%}")
print(f"P(PD > 7%)          = {sum(1 for s in samp if s > 0.07)/N:.2%}")
print("\n\"P(PD > 10%) = 0.03%\" -> keputusan langsung: cabang AMAN.")
print("Frekuentis tidak bisa mengucapkan kalimat itu! (θ bukan acak bagi mereka)")`;
  const quizData = [{"question": "Posterior Beta setelah prior Beta(50,950) + 3 gagal dari 10…", "options": ["Beta(53, 957)", "Beta(3, 7)", "Beta(50, 950)", "Beta(53, 960)"], "correct": 0, "explanation": "Benar: tambah sukses ke a, gagal ke b. Mean 5,25% — shrinkage dari 30% mentah."}, {"question": "Shrinkage berarti…", "options": ["Data selalu diabaikan", "Estimasi ditarik ke prior saat data sedikit; data menang saat banyak", "Prior selalu menang", "Tidak ada estimasi"], "correct": 1, "explanation": "Benar: w = n/(n+n₀) — timbangan otomatis antara bukti baru dan pengetahuan lama."}, {"question": "Keunggulan unik Bayesian vs frekuentis…", "options": ["Selalu lebih cepat", "Bisa menyatakan P(parameter > ambang | data)", "Tidak butuh data", "Tidak butuh model"], "correct": 1, "explanation": "Benar: parameter sebagai variabel acak → probabilitas langsung tentang θ."}, {"question": "Dengan data sangat besar, Bayesian vs frekuentis…", "options": ["Selalu beda jauh", "Konvergen (prior tenggelam) — pilih yang murah", "Bayesian selalu menang", "Frekuentis tidak bisa dipakai"], "correct": 1, "explanation": "Benar: Bernstein–von Mises. Jangan bayar harga Bayesian jika data melimpah."}, {"question": "Kritik &ldquo;prior subjektif&rdquo; dijawab dengan…", "options": ["Prior disembunyikan", "Prior eksplisit, didokumentasikan, diuji sensitivitasnya", "Tidak pakai prior", "Prior selalu uniform"], "correct": 1, "explanation": "Benar: transparansi > ilusi objektivitas. Semua metode punya asumsi."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B17 — Probabilitas</span>
        <h1 className="display-title">Bayesian Praktis: Belajar dari Data,<br/>Bukan dari Nol</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Cabang Baru dengan 10 Nasabah</a></li>
          <li><a href="#aliran">Aliran Bayesian — Belajar Sekuensial</a></li>
          <li><a href="#konjugat">Pasangan Konjugat — Bayesian Tanpa Integral</a></li>
          <li><a href="#shrink">Shrinkage — Kebijaksanaan Data Kecil</a></li>
          <li><a href="#credible">Credible vs Confidence — Beda Filsafat</a></li>
          <li><a href="#lab1">🔬 Lab 1: Shrinkage Beraksi</a></li>
          <li><a href="#lab2">🔬 Lab 2: &ldquo;Peluang PD &gt; 10%?&rdquo; — Pertanyaan Bayesian</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Bayesian</a></li>
          <li><a href="#case">📋 Mini-Case: A/B Testing yang Dihentikan Terlalu Cepat</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>aliran Bayesian</strong>: prior → likelihood → posterior, dan posterior jadi prior berikutnya.</li><li>Menghitung <strong>konjugat Beta-Binomial &amp; Gamma-Poisson</strong> tanpa integral.</li><li>Menjelaskan <strong>shrinkage</strong>: mengapa estimasi Bayesian &ldquo;menahan&rdquo; data kecil.</li><li>Membedakan <strong>credible interval vs confidence interval</strong> — dan kapan Bayesian menang.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Cabang Baru dengan 10 Nasabah</h2>

      <div className="story"><p>Bank buka cabang baru. Bulan pertama: 10 nasabah, <strong>3 gagal</strong> (30%!). Manajer panik: <em>&ldquo;PD cabang ini 30% — tutup saja!&rdquo;</em></p><p>Analis Bayesian tenang: <em>&ldquo;Bank kita punya 100.000 nasabah historis dengan PD 5%. Dengan 10 data baru, estimasi terbaik bukan 30%, melainkan <strong>5,3%</strong>.&rdquo;</em> Setahun kemudian (2.000 nasabah, 140 gagal = 7%): estimasi Bayesian 6,9% — akurat. Estimasi &ldquo;30%&rdquo; si manajer sudah lama dilupakan.</p><p>Ini <strong>shrinkage</strong>: Bayesian tidak membuang pengetahuan lama (prior) hanya karena 10 data baru berisik. Di dunia data kecil — cabang baru, produk baru, segmen langka — Bayesian bukan &ldquo;alternatif&rdquo;, melainkan <strong>satu-satunya cara waras</strong>.</p><p><strong>Twist-nya:</strong> 30% dari 10 data &ldquo;kalah&rdquo; dari 5% dari 100.000 data — Bayesian terlihat mengabaikan data baru. Padahal ia melakukan hal paling rasional: 10 data berisik <em>memang seharusnya</em> hampir tidak menggerakkan keyakinan. Yang panik (manajer) bereaksi berlebihan pada noise; yang tenang (Bayesian) menunggu sinyal. Kebijaksanaan statistik = tahu kapan harus tidak terkesan oleh data.</p></div>

      <h2 id="aliran">Aliran Bayesian — Belajar Sekuensial</h2>

      <p><Tex math={String.raw`\underbrace{P(\theta \mid \text{data})}_{\text{posterior}} \propto \underbrace{P(\text{data} \mid \theta)}_{\text{likelihood}} \times \underbrace{P(\theta)}_{\text{prior}}`} block /></p>

      <ul>
<li><Tex math={String.raw`\theta`} />: parameter yang diestimasi (PD, λ, ...),</li>
<li><strong>Prior:</strong> pengetahuan sebelum data — dari historis, expert, atau &ldquo;tidak tahu&rdquo; (noninformatif),</li>
<li><strong>Likelihood:</strong> seberapa cocok data untuk tiap θ (model!)</li>
<li><strong>Posterior:</strong> pengetahuan setelah data — <strong>= prior untuk data berikutnya!</strong></li>
</ul>

      <p><strong>Kepribadian:</strong> Bayesian adalah &ldquo;pembelajar yang tidak amnesia&rdquo; — ia tidak pernah mulai dari nol. Tiap analisis mewarisi pengetahuan analisis sebelumnya. Frekuentis (A2) memulai dari nol tiap kali.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Siklusnya: <strong>posterior hari ini = prior besok</strong>. Inilah yang membuat Bayesian natural untuk sistem live (skor fraud diupdate per transaksi, PD diupdate per bulan) — tidak perlu &ldquo;refit dari nol&rdquo;.</p>
</div>

      <h2 id="konjugat">Pasangan Konjugat — Bayesian Tanpa Integral</h2>

      <p>Pasangan prior–likelihood <strong>konjugat</strong>: posterior satu keluarga dengan prior — update = aritmetika!</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Likelihood (data)</th><th>Prior konjugat</th><th>Update posterior</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>Binomial (s sukses, f gagal)</td><td>Beta(a, b)</td><td>Beta(a+s, b+f)</td><td>PD dari data default</td></tr>
<tr><td>Poisson (n kejadian)</td><td>Gamma(α, β)</td><td>Gamma(α+n, β+t)</td><td>λ klaim per bulan</td></tr>
<tr><td>Normal (σ² diketahui)</td><td>Normal(μ₀, τ₀²)</td><td>Normal(μₙ, τₙ²) presisi tertimbang</td><td>Mean return</td></tr>
<tr><td>Multinomial</td><td>Dirichlet</td><td>Dirichlet(α+c)</td><td>Pangsa kategori</td></tr>
</tbody>
</table>
</div>

      <details className="worked">
<summary>📐 Contoh: cabang baru (cerita pembuka)</summary>
<p>Prior dari historis bank: PD ≈ 5% → Beta(50, 950) (setara 1.000 observasi).</p><p>Data cabang: 3 gagal dari 10 → posterior <strong>Beta(53, 957)</strong>, mean = 53/1010 ≈ <strong>5,25%</strong>.</p><p>Bandingkan: estimasi mentah 30% vs Bayesian 5,25%. <strong>Prior &ldquo;menahan&rdquo;</strong> (shrinkage) karena 10 data terlalu sedikit untuk mengalahkan 1.000 data historis.</p><p>Setahun kemudian (+140/2000): Beta(193, 2957) → mean <strong>6,1%</strong> — data akhirnya &ldquo;menang&rdquo;.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Prior = subjektivitas = tidak ilmiah.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Prior yang <em>disembunyikan</em> memang berbahaya — tapi prior yang <em>eksplisit &amp; didokumentasikan</em> justru lebih ilmiah dari &ldquo;asumsi implisit&rdquo;. Dan ingat: metode &ldquo;objektif&rdquo; pun punya pilihan subjektif (model, α=5%, prior implisit uniform). Kejujuran Bayesian: semua asumsi tertulis di prior, bisa dikritik &amp; diuji sensitivitasnya.</p>
</div>

      <h2 id="shrink">Shrinkage — Kebijaksanaan Data Kecil</h2>

      <p>Estimasi Bayesian = <strong>rata-rata tertimbang</strong> prior dan data:</p>

      <p><Tex math={String.raw`\hat{\theta}_{\text{Bayes}} \approx w\cdot \bar{x}_{\text{data}} + (1-w)\cdot \mu_{\text{prior}}, \quad w = \frac{n}{n + n_0}`} block /></p>

      <p>dengan <Tex math={String.raw`n_0`} /> = &ldquo;kekuatan&rdquo; prior (observasi ekuivalen). <strong>n kecil → w kecil → ikut prior.</strong> Inilah James-Stein/empirical Bayes: &ldquo;pinjam kekuatan&rdquo; dari populasi.</p>

      <p><strong>Kapan kritis:</strong> segmen kecil (cabang baru, produk baru), rare event, A/B testing awal, hierarchical model (nasabah dalam cabang dalam region).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Jika ada yang melapor &ldquo;PD segmen ini 30%&rdquo; dari n=10 — tanya: <em>berapa n-nya, dan apa prior-nya?</em> Dua pertanyaan ini membunuh 90% klaim dramatis dari data kecil. Shrinkage adalah &ldquo;rem&rdquo; terhadap overreaksi.</p>
</div>

      <h2 id="credible">Credible vs Confidence — Beda Filsafat</h2>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th></th><th>Bayesian: credible interval</th><th>Frekuentis: confidence interval</th></tr></thead>
<tbody>
<tr><td>Arti 95%</td><td>P(θ di interval | data) = 95% — <strong>yang ingin diketahui!</strong></td><td>Jika diulang, 95% interval menutupi θ — <strong>bukan</strong> P(θ di interval ini)</td></tr>
<tr><td>θ</td><td>Variabel acak (punya distribusi)</td><td>Tetap (tidak acak)</td></tr>
<tr><td>Data kecil</td><td>Tetap valid (dengan prior)</td><td>Bisa degenerat/lebar tak hingga</td></tr>
<tr><td>Komputasi</td><td>Dulu mahal (MCMC); kini mudah</td><td>Rumus tertutup sering ada</td></tr>
</tbody>
</table>
</div>

      <p><strong>Kapan Bayesian menang:</strong> data kecil, butuh interpretasi probabilistik langsung (&ldquo;peluang PD &gt; 10%?&rdquo;), model hierarkis, update sekuensial, menggabung expert judgment. <strong>Kapan frekuentis cukup:</strong> data besar (keduanya konvergen!), butuh cepat &amp; standar, regulasi meminta.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Bayesian selalu lebih baik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Dengan data besar, prior &ldquo;tenggelam&rdquo; — hasil Bayesian ≈ MLE frekuentis (teorema Bernstein–von Mises). Bayesian membayar harga komputasi &amp; debat prior; jika data melimpah dan pertanyaan standar, frekuentis lebih murah. <strong>Pilih berdasarkan masalah, bukan ideologi.</strong></p>
</div>

      <PlotlyChart
  data={chart1}
  title="Shrinkage: Bayesian vs Mentah (data benar 7%)"
  layout={{"yaxis": {"title": "Estimasi PD", "tickformat": ".0%"}, "xaxis": {"title": "n (data baru)"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Biru = posterior Bayesian (prior 5%); kuning = proporsi mentah. Data benar PD=7%.</p>
<p><strong>Interpretasi:</strong> n=10: mentah 30% (panik!), Bayesian 5,25% (tenang &amp; lebih dekat ke 7%). Makin besar n, keduanya konvergen ke 7% — <strong>prior hanya menahan saat data sedikit</strong>, tidak mendikte selamanya. Inilah &ldquo;kebijaksanaan&rdquo;: skeptis saat bukti lemah, mengikuti saat bukti kuat.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Bayesian = &ldquo;belajar tanpa melupakan yang lama&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Shrinkage — 3 gagal dari 10</summary>
              <p>Cabang baru: 10 nasabah, 3 gagal (30%). Prior bank: Beta(5, 95) (mean 5%, bobot 100). Berapa posterior? Bandingkan dengan estimasi naif.</p>
              <p><strong>Langkah 1</strong> — posterior = Beta(5+3, 95+7) = <strong>Beta(8, 102)</strong>.<br />
              <strong>Langkah 2</strong> — mean = 8/110 ≈ <strong>7,27%</strong> (naif: 30%; prior murni: 5%).<br />
              <strong>Langkah 3</strong> — baca: 10 data menggeser 5% → 7,27%, bukan → 30%. Bobot prior (100) vs data (10) = 10:1.</p>
              <p>Pelajaran: shrinkage = kompromi berbobot. Makin sedikit data, makin kuat tarikan ke prior. Inilah &ldquo;kebijaksanaan&rdquo; Bayesian: skeptis pada sampel kecil.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Konjugat Normal — update mean</summary>
              <p>Prior mean μ ~ N(0, 1). Data: n = 16, x̄ = 0,5, σ diketahui = 2. Berapa posterior mean?</p>
              <p><strong>Langkah 1</strong> — presisi prior = 1; presisi data = n/σ² = 16/4 = 4.<br />
              <strong>Langkah 2</strong> — posterior mean = (1×0 + 4×0,5)/(1+4) = 2/5 = <strong>0,4</strong>. Presisi posterior = 5 → SD = 0,447.<br />
              <strong>Langkah 3</strong> — baca: data (presisi 4) menarik prior (0) ke 0,4 — 80% jalan ke data. Makin banyak n, makin Bayesian ≈ frekuentis.</p>
              <p>Pelajaran: update Normal = rata-rata <em>tertimbang presisi</em>. &ldquo;Presisi&rdquo; (1/varians) adalah mata uang Bayesian: yang lebih presisi, lebih didengar.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Credible vs confidence — dibaca beda</summary>
              <p>Posterior PD ~ Beta(8, 102). Interval credible 95%: (2,9%; 12,3%). Seorang frekuentis melaporkan CI 95%: (3,1%; 11,8%). Apa beda interpretasinya?</p>
              <p><strong>Langkah 1</strong> — Bayesian: &ldquo;P(PD di (2,9%; 12,3%) | data) = 95%&rdquo; — pernyataan langsung tentang <strong>parameter</strong>.<br />
              <strong>Langkah 2</strong> — Frekuentis: &ldquo;jika eksperimen diulang, 95% interval <em>yang dihasilkan</em> mencakup PD benar&rdquo; — pernyataan tentang <strong>prosedur</strong>, bukan parameter.<br />
              <strong>Langkah 3</strong> — untuk keputusan (&ldquo;berapa peluang PD &gt; 10%?&rdquo;), yang pertama langsung menjawab: P(PD &gt; 10% | data) dari Beta(8,102) ≈ <strong>12%</strong>. Yang kedua tidak bisa menjawab tanpa contortion.</p>
              <p>Pelajaran: credible interval menjawab pertanyaan yang <em>sebenarnya ditanya</em> pengambil keputusan. Itulah keunggulan praktis Bayesian — bukan filsafatnya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Shrinkage Beraksi</h2>

      <p>Prior Beta(50,950) [PD 5%]. Data benar PD=7%. Lihat siapa lebih akurat di n kecil.</p>

      <PyodideLab
  title="Lab 1 — Prior vs Data (Beta-Binomial)"
  hint="Bayesian menang telak di n kecil — &amp;ldquo;asuransi&amp;rdquo; terhadap data berisik."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: &ldquo;Peluang PD &gt; 10%?&rdquo; — Pertanyaan Bayesian</h2>

      <p>Dari posterior Beta, hitung P(PD &gt; 10%) via simulasi — pertanyaan yang TAK bisa dijawab frekuentis langsung.</p>

      <PyodideLab
  title="Lab 2 — Probabilitas Langsung dari Posterior"
  hint="Inilah kekuatan unik Bayesian: &lt;strong>probabilitas tentang parameter&lt;/strong> — bahasa keputusan."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Bayesian</h2>

      <div className="decision-card">
<h3>1. Data kecil + pengetahuan historis → <strong>Bayesian + konjugat</strong></h3>
<p><strong>Kondisi data:</strong> Cabang/produk/segmen baru; rare event.</p>
<p><strong>Kenapa:</strong> Shrinkage mencegah overreaksi; update = aritmetika.</p>
<p><strong>Contoh nyata:</strong> PD cabang baru (cerita pembuka).</p>
</div>

      <div className="decision-card">
<h3>2. Butuh P(parameter &gt; ambang) → <strong>Bayesian</strong></h3>
<p><strong>Kondisi data:</strong> Keputusan berbasis risiko parameter.</p>
<p><strong>Kenapa:</strong> Hanya Bayesian memberi distribusi posterior θ.</p>
<p><strong>Contoh nyata:</strong> &ldquo;P(PD &gt; 10%)&rdquo; untuk limit setting.</p>
</div>

      <div className="decision-card">
<h3>3. Update sekuensial / sistem live → <strong>Bayesian</strong></h3>
<p><strong>Kondisi data:</strong> Data datang bertahap.</p>
<p><strong>Kenapa:</strong> Posterior → prior; tidak refit dari nol.</p>
<p><strong>Contoh nyata:</strong> Skor fraud per transaksi.</p>
</div>

      <div className="decision-card">
<h3>4. Data besar + pertanyaan standar → <strong>frekuentis cukup</strong></h3>
<p><strong>Kondisi data:</strong> n besar, interval/uji rutin.</p>
<p><strong>Kenapa:</strong> Keduanya konvergen; frekuentis lebih murah &amp; standar.</p>
<p><strong>Contoh nyata:</strong> Interval PD portofolio 1 juta nasabah.</p>
</div>

      <div className="decision-card">
<h3>5. Model hierarkis (grup dalam grup) → <strong>Bayesian hierarkis</strong></h3>
<p><strong>Kondisi data:</strong> Nasabah dalam cabang dalam region.</p>
<p><strong>Kenapa:</strong> Pinjam kekuatan antar grup (partial pooling) — shrinkage bertingkat.</p>
<p><strong>Contoh nyata:</strong> PD per cabang dengan 50 cabang kecil.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Data kecil → Bayesian (shrinkage). Data besar → keduanya sama.</li><li>Prior <strong>eksplisit &amp; uji sensitivitasnya</strong> — jangan sembunyikan.</li><li>Butuh P(θ &gt; x) → Bayesian. Butuh cepat &amp; standar → frekuentis.</li><li>Posterior hari ini = prior besok.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: A/B Testing yang Dihentikan Terlalu Cepat</h2>

      <div className="callout">
<p>Tim produk menjalankan A/B test: setelah 200 pengunjung (100/varian), konversi A=8%, B=14%. <em>&ldquo;B menang! Hentikan test, rollout!&rdquo;</em></p><p><strong>Pertanyaan:</strong> (a) Apa kata analisis Bayesian (prior Beta(20,180) ≈ 10% historis)? (b) Keputusan yang benar?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Posterior A: Beta(28, 272) → mean 9,3%. Posterior B: Beta(34, 266) → mean 11,3%. P(B &gt; A | data) via simulasi ≈ <strong>78%</strong> — jauh dari &ldquo;pasti&rdquo;! Interval kredibel keduanya tumpang tindih lebar.</p><p>(b) <strong>Jangan rollout.</strong> 78% bukan keyakinan cukup untuk keputusan mahal (butuh ~95%+ atau expected loss analysis). Yang benar: lanjutkan test sampai P(B&gt;A) &gt; 95% <em>atau</em> hitung expected value of information. <strong>Pelajaran:</strong> frekuentis dengan n=200 pun akan bilang &ldquo;belum signifikan&rdquo; — tapi Bayesian memberi angka yang bisa ditindaklanjuti (78%) + bahasa yang dipahami bisnis (&ldquo;peluang B lebih baik&rdquo;). Ini <strong>Bayesian A/B testing</strong> — standar di tech company modern.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Prior Beta(2, 18) (mean 10%). Data: 50 trial, 2 sukses. Hitung posterior dan mean-nya.</li>
              <li>Produk baru: 0 gagal dari 20 (0%!). Estimasi naif PD = 0%. Apa kata Bayesian dengan prior Beta(5, 95)? Mengapa ini lebih waras?</li>
              <li>Jelaskan dalam 2 kalimat kapan prior &ldquo;terlalu kuat&rdquo; menjadi masalah (prior-data conflict).</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Posterior = Beta(4, 66). Mean = 4/70 ≈ <strong>5,7%</strong> — data (4%) menarik prior (10%) ke bawah, tapi tidak sampai 4%.</p>
              <p><strong>2.</strong> Posterior = Beta(5, 115), mean = 5/120 ≈ <strong>4,2%</strong>. Lebih waras: 0% dari 20 data <em>bukan bukti</em> risiko nol — hanya &ldquo;belum terlihat&rdquo;. Bayesian tidak pernah memberi 0%/100% dari data terbatas (Cromwell&apos;s rule).</p>
              <p><strong>3.</strong> Jika data besar &amp; konsisten berkata lain (mis. 1.000 trial, 300 gagal vs prior mean 5%), prior kuat memperlambat adaptasi — posterior butuh banyak data untuk &ldquo;mengalahkan&rdquo; prior. Solusi: prior lebih lemah (vague) atau prior predictive check.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Aliran:</strong> posterior ∝ likelihood × prior; posterior hari ini = prior besok.</li><li><strong>Konjugat:</strong> Beta-Binomial, Gamma-Poisson — update = aritmetika.</li><li><strong>Shrinkage:</strong> <Tex math={String.raw`w = n/(n+n_0)`} /> — skeptis saat bukti lemah, ikut saat bukti kuat.</li><li><strong>Credible interval:</strong> P(θ di interval | data) — bahasa keputusan.</li><li><strong>Pilih berdasarkan masalah:</strong> data kecil/hierarkis/live → Bayesian; data besar/standar → frekuentis cukup.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b16-heavy-tails-evt" className="btn btn-secondary btn-sm">← ← B16</Link>
        <Link href="/learn/c1-select-dasar" className="btn btn-primary btn-sm">Next: C1 →</Link>
      </div>
    </div>
  );
}
