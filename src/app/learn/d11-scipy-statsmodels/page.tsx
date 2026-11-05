import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D11ScipyStatsmodelsPage() {
  const chart1 = [{"x": [50, 55, 60, 65, 70, 75, 80], "y": [0.02, 0.05, 0.08, 0.06, 0.03, 0.01, 0.005], "type": "bar", "name": "Distribusi H0", "marker": {"color": "#94a3b8"}}, {"x": [72], "y": [0.02], "type": "scatter", "mode": "markers", "name": "Observasi", "marker": {"color": "#ef4444", "size": 14}}];
  const lab1Code = String.raw`import micropip
await micropip.install('scipy')

import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
jakarta = rng.normal(9_500_000, 2_000_000, 60)
bandung = rng.normal(8_800_000, 2_000_000, 60)

# uji normalitas dulu (asumsi!)
print("Shapiro Jakarta p:", round(float(stats.shapiro(jakarta).pvalue), 3))

# t-test
t, p = stats.ttest_ind(jakarta, bandung)
print(f"t={t:.2f}, p={p:.4f}")
print(f"Selisih rata-rata: Rp {(jakarta.mean()-bandung.mean()):,.0f}")

# effect size: Cohen's d
d = (jakarta.mean() - bandung.mean()) / np.sqrt((jakarta.var() + bandung.var()) / 2)
print(f"Cohen's d: {d:.2f} (0.2 kecil, 0.5 sedang, 0.8 besar)")

# Coba: kecilkan n jadi 10 per grup. p-value berubah? (power!)
`;
  const lab2Code = String.raw`import micropip
await micropip.install('scipy')

import pandas as pd, numpy as np
from scipy import stats

# chi-square: kota x bermasalah
tabel = [[70, 10],   # Jakarta: ok, bermasalah
         [45, 15],   # Bandung
         [30, 10]]   # Surabaya
chi2, p, dof, exp = stats.chi2_contingency(tabel)
print(f"chi2={chi2:.1f}, p={p:.4f}, dof={dof}")
print("Expected >= 5?", (exp >= 5).all())

# OLS manual via numpy (tanpa statsmodels di lab ini — konsepnya!)
rng = np.random.default_rng(7)
gaji = rng.normal(9e6, 2e6, 100)
dpd = 30 - 2e-6 * gaji + rng.normal(0, 8, 100)  # gaji naik -> dpd turun
dpd = np.clip(dpd, 0, None)

# slope via least squares
A = np.vstack([gaji, np.ones(len(gaji))]).T
slope, intercept = np.linalg.lstsq(A, dpd, rcond=None)[0]
pred = slope * gaji + intercept
r2 = 1 - ((dpd - pred) ** 2).sum() / ((dpd - dpd.mean()) ** 2).sum()
print(f"\nSlope: {slope:.2e} (dpd per rupiah)")
print(f"R2: {r2:.2f}")

# Coba: interpretasikan slope dalam bahasa bisnis!
`;
  const quizData = [{"question": "p = 0,03 artinya…", "options": ["H0 97% salah", "Data seekstrem ini 3% mungkin jika H0 benar", "Efek besar", "Terbukti"], "correct": 1, "explanation": "Benar: definisi p-value (B8!). Bukan probabilitas H0 salah."}, {"question": "n raksasa + p < 0,05…", "options": ["Pasti penting", "Bisa signifikan tapi efek trivial — cek effect size!", "Error", "Abaikan"], "correct": 1, "explanation": "Benar: signifikansi ≠ pentingnya."}, {"question": "Sebelum A/B test, wajib…", "options": ["Langsung jalan", "Power analysis: hitung n dulu", "Pilih metrik belakangan", "Intip tiap jam"], "correct": 1, "explanation": "Benar: n cukup + durasi tetap + no peeking."}, {"question": "Chi-square butuh…", "options": ["Data normal", "Expected frequency ≥ 5", "n > 10000", "Korelasi"], "correct": 1, "explanation": "Benar: asumsi tabel kontingensi."}, {"question": "statsmodels vs sklearn…", "options": ["Sama", "statsmodels=inferensi (mengapa); sklearn=prediksi (berapa)", "sklearn lebih akurat", "statsmodels untuk big data"], "correct": 1, "explanation": "Benar: pilih sesuai tujuan."}, {"question": "Peeking (intip + berhenti saat signifikan)…", "options": ["Praktik baik", "Merusak p-value — tentukan durasi di awal", "Mempercepat", "Wajib"], "correct": 1, "explanation": "Benar: optional stopping = p-hacking."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D11 — Python</span>
        <h1 className="display-title">SciPy &amp; statsmodels:<br/>Uji Hipotesis di Python</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 'Kampanye Berhasil?'</a></li>
          <li><a href="#scipy">scipy.stats — Kotak Alat Uji</a></li>
          <li><a href="#ols">statsmodels — Regresi yang Bisa Dibaca</a></li>
          <li><a href="#ab">A/B Testing — Uji di Dunia Nyata</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji Beda Dua Kota</a></li>
          <li><a href="#lab2">🔬 Lab 2: Chi-Square + Regresi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Uji</a></li>
          <li><a href="#case">📋 Mini-Case: 'Kampanye Berhasil?' (45+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjalankan <strong>uji hipotesis</strong> dengan scipy (t-test, chi-square, dll).</li><li>Menghubungkan ke <strong>track B</strong> (B8/B9: p-value, CI).</li><li>Membuat <strong>regresi OLS</strong> dengan statsmodels + membaca summary.</li><li>Menjelaskan <strong>asumsi</strong> tiap uji.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 'Kampanye Berhasil?'</h2>

      <div className="story"><p>Marketing: <em>&ldquo;Kampanye baru menaikkan konversi dari 5% ke 6,5%!&rdquo;</em> Kamu: <em>&ldquo;Sampelnya berapa? Signifikan tidak?&rdquo;</em> — 200 vs 200 orang. Uji proporsi: p = 0,52. <strong>Tidak signifikan.</strong> Kenaikan = noise.</p><p>Track B mengajarkan <em>teori</em> uji hipotesis; lesson ini = <em>praktik</em> di Python. Setiap klaim 'naik/turun/berbeda' harus melewati uji — atau ia opini, bukan temuan.</p><p><strong>Twist-nya:</strong> 5% → 6,5% &ldquo;kenaikan&rdquo; yang ternyata noise (p = 0,52). Marketing tidak berbohong — mereka hanya tidak menguji. Setiap angka &ldquo;naik/turun&rdquo; tanpa uji signifikansi = opini berpakaian data. Track B memberi teorinya; D11 memberi senjatanya: 5 baris scipy untuk membedakan temuan dari perasaan.</p></div>

      <h2 id="scipy">scipy.stats — Kotak Alat Uji</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from scipy import stats
import numpy as np

# t-test: rata-rata 2 grup beda?
a = np.array([8.5, 9.0, 8.7, 9.2, 8.8])  # juta, kota A
b = np.array([9.5, 9.8, 9.6, 10.0, 9.7]) # juta, kota B
t, p = stats.ttest_ind(a, b)
print(f&#x27;t=&#123;t:.2f&#125;, p=&#123;p:.4f&#125;&#x27;)

# chi-square: kategori berhubungan?
# tabel: [[lancar_bayar, lancar_macet], [telat_bayar, telat_macet]]
chi2, p, dof, exp = stats.chi2_contingency([[80, 20], [50, 50]])
print(f&#x27;chi2=&#123;chi2:.1f&#125;, p=&#123;p:.4f&#125;&#x27;)</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Uji</th><th>Fungsi</th><th>Kapan</th><th>Asumsi kunci</th></tr></thead>
<tbody>
<tr><td>t-test 2 sampel</td><td>ttest_ind</td><td>Rata-rata 2 grup</td><td>Normalitas (n besar OK)</td></tr>
<tr><td>t-test berpasangan</td><td>ttest_rel</td><td>Sebelum-sesudah</td><td>Selisih normal</td></tr>
<tr><td>Chi-square</td><td>chi2_contingency</td><td>Kategori × kategori</td><td>Expected ≥ 5</td></tr>
<tr><td>Shapiro</td><td>shapiro</td><td>Uji normalitas</td><td>n &lt; 5000</td></tr>
<tr><td>Pearson r</td><td>pearsonr</td><td>Korelasi + p-value</td><td>Linear</td></tr>
</tbody>
</table>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Alur: <strong>ajukan hipotesis → cek asumsi → pilih uji → baca p-value + effect size</strong>. p &lt; 0,05 tanpa effect size = tidak lengkap! (B8/B9: teori lengkapnya.)</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;p &lt; 0,05 = terbukti.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> p-value = <em>probabilitas data seekstrem ini jika H0 benar</em> — bukan 'probabilitas H0 salah'! (B8). Dan dengan n raksasa, beda <em>trivial</em> jadi 'signifikan'. Selalu lapor <strong>effect size</strong> (beda rata-rata, Cohen's d) + <strong>CI</strong>.</p>
</div>

      <h2 id="ols">statsmodels — Regresi yang Bisa Dibaca</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import statsmodels.formula.api as smf

# OLS dengan formula (mirip R!)
model = smf.ols(&#x27;dpd ~ penghasilan + tenor&#x27;, data=df).fit()
print(model.summary())
# baca: coef, P&gt;|t| (signifikan?), R-squared</pre>

      <ul>
<li><strong>Formula:</strong> <code className="inline">'y ~ x1 + x2'</code> — intuitif!</li>
<li><strong>summary():</strong> koefisien, p-value per variabel, R², diagnostik.</li>
<li><strong>Keunggulan vs sklearn:</strong> inferensi (p-value, CI) — untuk <em>penjelasan</em>, bukan prediksi.</li>
<li><strong>Asumsi OLS:</strong> linearitas, homoskedastisitas, normalitas residual, no multikolinearitas (VIF!).</li>
</ul>

      <details className="worked">
<summary>📐 Membaca summary</summary>
<p><code className="inline">coef penghasilan = -0.000003, P&gt;|t| = 0.001</code> → tiap Rp 1jt gaji naik, DPD turun 0.003 hari — <strong>signifikan</strong> tapi <strong>kecil</strong> (effect size!).</p><p><code className="inline">R-squared = 0.12</code> → model menjelaskan 12% variasi DPD — 88% faktor lain! Jangan oversell.</p><p><strong>Aturan:</strong> signifikan ≠ penting. Lapor koefisien + p-value + R² + interpretasi bisnis.</p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Kapan statsmodels vs sklearn? <strong>statsmodels</strong> = 'mengapa' (inferensi, p-value, untuk laporan/riset). <strong>sklearn</strong> = 'berapa' (prediksi, untuk produksi). Analis butuh keduanya!</p>
</div>

      <h2 id="ab">A/B Testing — Uji di Dunia Nyata</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># A/B: konversi 5% (1000) vs 6.5% (1000) — signifikan?
from statsmodels.stats.proportion import proportions_ztest
count = [50, 65]   # konversi
nobs = [1000, 1000]
stat, p = proportions_ztest(count, nobs)
print(f&#x27;p=&#123;p:.3f&#125;&#x27;)  # p=0.15 -&gt; TIDAK signifikan!
# butuh n berapa? -&gt; power analysis
from statsmodels.stats.power import zt_ind_solve_power
n = zt_ind_solve_power(effect_size=0.05, alpha=0.05, power=0.8)
print(f&#x27;butuh n ~ &#123;n:.0f&#125; per grup&#x27;)</pre>

      <ul>
<li><strong>proportions_ztest:</strong> untuk rate/konversi (kasus paling umum!).</li>
<li><strong>Power analysis:</strong> hitung n <em>sebelum</em> eksperimen — jangan 'coba 200 dulu'.</li>
<li><strong>Peeking:</strong> intip hasil tiap hari + berhenti saat signifikan = p-value rusak! Tentukan n & durasi di awal.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;'Naik 1,5pp' = berhasil.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tanpa uji = opini. A/B butuh: <strong>hipotesis awal</strong>, <strong>n cukup</strong> (power), <strong>durasi tetap</strong> (no peeking), <strong>metrik primer 1</strong> (bukan 20 metrik lalu pilih yang signifikan = p-hacking!).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="p-value: Seberapa Ekstrem Observasi? (ilustrasi)"
  layout={{"xaxis": {"title": "Statistik uji"}, "yaxis": {"title": "Probabilitas"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu-abu = distribusi jika H0 benar; merah = yang teramati.</p>
<p><strong>Interpretasi:</strong> p-value = luas area <em>di luar</em> titik merah. Jauh di ekor = jarang terjadi jika H0 benar → tolak H0. <strong>Ingat B8:</strong> ini bukan 'probabilitas H0 salah'!</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Setiap klaim &ldquo;naik/turun&rdquo; wajib lewat uji.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Uji proporsi — kampanye 5% vs 6,5%</summary>
              <p>Kontrol: 10/200 konversi (5%). Kampanye: 13/200 (6,5%). Signifikan? Hitung p-value-nya.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from scipy import stats
      # Uji proporsi 2 sampel (aproksimasi normal)
      n1, x1 = 200, 10
      n2, x2 = 200, 13
      p_pool = (x1 + x2) / (n1 + n2)
      se = (p_pool*(1-p_pool)*(1/n1 + 1/n2)) ** 0.5
      z = (x2/n2 - x1/n1) / se
      p = 2 * (1 - stats.norm.cdf(abs(z)))
      print(f&#x27;z=&#123;z:.2f&#125;, p=&#123;p:.3f&#125;&#x27;)  # -&gt; z=0.64, p=0.522</pre>
              <p><strong>Bedah:</strong> p = 0,52 — <em>jauh</em> dari signifikan. Selisih 3 konversi dari 400 = noise (SE ≈ 2,3%). &ldquo;Naik 30% relatif&rdquo; (5→6,5) terdengar besar; dalam unit <em>standar error</em> ia kecil. Selalu bagi selisih dengan SE-nya (B11!).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Uji t — gaji dua kota</summary>
              <p>Jakarta: n=50, mean 12jt, sd 3jt. Surabaya: n=60, mean 10,5jt, sd 2,5jt. Beda signifikan?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from scipy import stats
      t, p = stats.ttest_ind_from_stats(
          mean1=12e6, std1=3e6, nobs1=50,
          mean2=10.5e6, std2=2.5e6, nobs2=60,
          equal_var=False)  # Welch: tanpa asumsi varians sama
      print(f&#x27;t=&#123;t:.2f&#125;, p=&#123;p:.4f&#125;&#x27;)  # -&gt; t=2.79, p=0.0064 -&gt; SIGNIFIKAN</pre>
              <p><strong>Bedah:</strong> <code className="inline">ttest_ind_from_stats</code> = uji t dari statistik ringkas (tanpa data mentah!). Welch (<code className="inline">equal_var=False</code>) = default aman. p = 0,006 &lt; 0,05 → beda nyata. Bandingkan dengan kasus 1: selisih 1,5jt &ldquo;kecil&rdquo; tapi SE-nya jauh lebih kecil → signifikan.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Regresi OLS — baca output statsmodels</summary>
              <p><code className="inline">dpd ~ penghasilan + kota</code>. Output: koef penghasilan = −0,0000021 (p &lt; 0,001); R² = 0,18. Interpretasikan.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import statsmodels.formula.api as smf
      model = smf.ols(&#x27;dpd ~ penghasilan + C(kota)&#x27;, data=df).fit()
      print(model.summary())
      # koef -0.0000021: tiap +Rp1jt penghasilan -&gt; dpd turun 2,1 hari
      #   (ceteris paribus! -0.0000021 * 1e6 = -2.1)
      # p &lt; 0.001: signifikan. R² = 0.18: model menjelaskan 18% variasi dpd.</pre>
              <p><strong>Bedah:</strong> baca koef dalam <em>satuan bermakna</em> (per Rp1jt, bukan per Rp1!). R² 0,18 = &ldquo;kecil&rdquo; tapi normal untuk data perilaku manusia — signifikansi ≠ R² besar. <code className="inline">C(kota)</code> = kategorikal sebagai dummy otomatis.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Uji Beda Dua Kota</h2>

      <p>Gaji Jakarta vs Bandung (data inline). Uji: apakah beda signifikan? Hitung juga selisih rata-rata (effect size!).</p>

      <PyodideLab
  title="Lab 1 — t-test + Effect Size"
  hint="Eksperimen: n=10 vs n=60 — kapan 'tidak signifikan' berarti 'tidak ada efek' vs 'data kurang'?"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Chi-Square + Regresi</h2>

      <p>Uji: apakah status (lancar/telat) berhubungan dengan kota? (chi-square). Lalu OLS: dpd ~ penghasilan.</p>

      <PyodideLab
  title="Lab 2 — Kategori &amp; OLS"
  hint="Di Colab: ulangi dengan statsmodels smf.ols('dpd ~ gaji') — bandingkan summary!"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Uji</h2>

      <div className="decision-card">
<h3>1. Banding rata-rata 2 grup → <strong>t-test</strong></h3>
<p><strong>Kondisi data:</strong> Numerik.</p>
<p><strong>Kenapa:</strong> Cek normalitas; lapor effect size.</p>
<p><strong>Contoh nyata:</strong> Gaji 2 kota.</p>
</div>

      <div className="decision-card">
<h3>2. Kategori × kategori → <strong>chi-square</strong></h3>
<p><strong>Kondisi data:</strong> Kategorikal.</p>
<p><strong>Kenapa:</strong> Expected ≥ 5.</p>
<p><strong>Contoh nyata:</strong> Kota × bermasalah.</p>
</div>

      <div className="decision-card">
<h3>3. Rate/konversi A/B → <strong>proportions_ztest</strong></h3>
<p><strong>Kondisi data:</strong> Proporsi.</p>
<p><strong>Kenapa:</strong> + power analysis sebelum!</p>
<p><strong>Contoh nyata:</strong> Kampanye A vs B.</p>
</div>

      <div className="decision-card">
<h3>4. Jelaskan hubungan → <strong>OLS statsmodels</strong></h3>
<p><strong>Kondisi data:</strong> Inferensi.</p>
<p><strong>Kenapa:</strong> Koef + p-value + R².</p>
<p><strong>Contoh nyata:</strong> dpd ~ gaji.</p>
</div>

      <div className="decision-card">
<h3>5. Prediksi → <strong>sklearn</strong> (D12)</h3>
<p><strong>Kondisi data:</strong> Prediksi.</p>
<p><strong>Kenapa:</strong> Bukan p-value, tapi akurasi.</p>
<p><strong>Contoh nyata:</strong> Skor kredit.</p>
</div>

      <div className="decision-card">
<h3>6. Selalu → <strong>asumsi + effect size</strong></h3>
<p><strong>Kondisi data:</strong> Lengkap.</p>
<p><strong>Kenapa:</strong> p-value saja = tidak cukup.</p>
<p><strong>Contoh nyata:</strong> Cohen's d, CI.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Hipotesis → asumsi → uji → p-value + effect size.</li><li>p &lt; 0,05 ≠ terbukti; lapor CI + effect size.</li><li>A/B: n dihitung dulu, no peeking.</li><li>statsmodels = mengapa; sklearn = berapa.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: 'Kampanye Berhasil?' (45+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Kampanye: konversi 5,0% (n=1000) → 6,5% (n=1000). Marketing klaim berhasil, minta budget 10×.</p><p><strong>Tugas:</strong> (1) Uji signifikansi. (2) Hitung n yang dibutuhkan (power 80%). (3) Tulis <strong>rekomendasi</strong> ke CMO: lanjutkan/tidak + syarat.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> proportions_ztest: p ≈ 0,15 → <strong>tidak signifikan</strong>. Kenaikan 1,5pp = noise pada n ini.</p><p><strong>(2)</strong> Power analysis: butuh ~3.000+ per grup untuk deteksi 1,5pp (power 80%).</p><p><strong>(3)</strong> 'Kenaikan belum signifikan (p=0,15). Jangan scale 10× dulu — lanjutkan eksperimen hingga n=3.000/grup dengan metrik primer tetap konversi. Jika signifikan + effect size bermakna bisnis, baru scale.'</p><p><strong>Pelajaran:</strong> statistik = <strong>rem</strong> terhadap euforia. Analis yang bisa bilang 'belum terbukti' = penjaga uang perusahaan.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>p-value = 0,06 pada α = 5%. Keputusan? Apa arti &ldquo;tidak signifikan&rdquo; yang <em>benar</em>?</li>
              <li>Kapan memakai uji non-parametrik (Mann-Whitney) alih-alih uji t? Beri contoh.</li>
              <li>Model A/B: konversi naik signifikan (p = 0,01) tapi lift hanya 0,2%. Keputusan bisnis?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Gagal tolak H0</strong> (0,06 &gt; 0,05). Arti benar: &ldquo;data tidak cukup bukti&rdquo; — <strong>bukan</strong> &ldquo;tidak ada efek&rdquo;! (Absence of evidence ≠ evidence of absence.) Dengan n lebih besar, bisa jadi signifikan.</p>
              <p><strong>2.</strong> Saat asumsi normalitas jebol parah (miring ekstrem, outlier banyak) &amp; n kecil — mis. waktu tunggu layanan (eksponensial!). Mann-Whitney membandingkan <em>peringkat</em>, kebal terhadap outlier. Dengan n besar, uji t robust via CLT (A2.6!).</p>
              <p><strong>3.</strong> <strong>Signifikan statistik ≠ signifikan bisnis</strong> (A2.7 effect size!). Lift 0,2% dengan biaya implementasi &gt; manfaatnya → jangan luncurkan. Laporkan <em>keduanya</em>: p-value (apakah nyata) + effect size (apakah penting).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>scipy:</strong> ttest, chi2, shapiro, pearsonr — cek asumsi!</li><li><strong>p-value</strong> + effect size + CI — tidak pernah p-value saja.</li><li><strong>statsmodels OLS:</strong> formula + summary untuk inferensi.</li><li><strong>A/B:</strong> power analysis dulu; no peeking; 1 metrik primer.</li><li>Statistik = rem terhadap euforia.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d10-feature-engineering" className="btn btn-secondary btn-sm">← ← D10</Link>
        <Link href="/learn/d12-sklearn" className="btn btn-primary btn-sm">Next: D12 →</Link>
      </div>
    </div>
  );
}
