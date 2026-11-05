"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A32Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const qqGoodData = [
    {
      x: [-2.2, -1.8, -1.4, -1.0, -0.7, -0.4, -0.1, 0.1, 0.4, 0.7, 1.0, 1.4, 1.8, 2.2],
      y: [-2.1, -1.75, -1.45, -1.0, -0.72, -0.38, -0.12, 0.1, 0.42, 0.68, 1.02, 1.38, 1.82, 2.18],
      mode: "markers",
      type: "scatter",
      name: "Residual terstandar",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [-2.5, 2.5],
      y: [-2.5, 2.5],
      mode: "lines",
      type: "scatter",
      name: "Garis normal ideal",
      line: { color: "#e8a838", width: 2, dash: "dash" },
    },
  ];

  const qqBadData = [
    {
      x: [-2.2, -1.8, -1.4, -1.0, -0.7, -0.4, -0.1, 0.1, 0.4, 0.7, 1.0, 1.4, 1.8, 2.2],
      y: [-1.2, -1.0, -0.9, -0.8, -0.7, -0.5, -0.3, 0.1, 0.4, 0.6, 0.9, 1.4, 2.6, 4.2],
      mode: "markers",
      type: "scatter",
      name: "Residual berekor tebal",
      marker: { color: "#ef4444", size: 9 },
    },
    {
      x: [-2.5, 2.5],
      y: [-2.5, 2.5],
      mode: "lines",
      type: "scatter",
      name: "Garis normal ideal",
      line: { color: "#64748b", width: 2, dash: "dash" },
    },
  ];

  const leverageData = [
    {
      x: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 40],
      y: [8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 31],
      mode: "markers",
      type: "scatter",
      name: "Data",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [2, 40],
      y: [7.2, 29.5],
      mode: "lines",
      type: "scatter",
      name: "OLS dengan titik jauh",
      line: { color: "#ef4444", width: 2 },
    },
    {
      x: [2, 13],
      y: [8.1, 24.6],
      mode: "lines",
      type: "scatter",
      name: "OLS tanpa titik jauh",
      line: { color: "#22c55e", width: 2, dash: "dot" },
    },
  ];

  const lab1Code = `# Diagnostik residual: uji heteroskedastisitas ala Breusch-Pagan SEDERHANA
# Ide: regresikan residual KUADRAT ke x. Kalau x bisa menjelaskan besarnya
# error -> variansi tidak konstan -> heteroskedastisitas.
import random
random.seed(42)

# Skenario A: homoskedastik (error konstan)
# Skenario B: heteroskedastik (error membesar seiring x)
def simulate(hetero=False, n=200):
    xs, res2 = [], []
    for i in range(n):
        x = random.uniform(1, 10)
        sigma = (0.5 + 0.5*x) if hetero else 1.0
        e = random.gauss(0, sigma)
        xs.append(x); res2.append(e**2)
    # regresi res2 ~ x : hitung R2-nya
    mx = sum(xs)/n; my = sum(res2)/n
    sxy = sum((a-mx)*(b-my) for a, b in zip(xs, res2))
    sxx = sum((a-mx)**2 for a in xs)
    b1 = sxy/sxx
    pred = [my + b1*(a-mx) for a in xs]
    ssr = sum((b-p)**2 for b, p in zip(res2, pred))
    sst = sum((b-my)**2 for b in res2)
    r2 = 1 - ssr/sst
    lm = n * r2  # statistik LM ~ chi-square(1); kritis 5% = 3.84
    return r2, lm

for nama, hetero in [("A (homoskedastik) ", False), ("B (heteroskedastik)", True)]:
    r2, lm = simulate(hetero)
    print(f"{nama}: R2_resid={r2:.3f}, LM={lm:6.2f} ->",
          "TOLAK homoskedastisitas!" if lm > 3.84 else "aman (gagal tolak)")
print()
print("COBA: ubah sigma skenario B jadi (0.5 + 2.0*x), jalankan lagi.")
print("Makin kuat corongnya, makin besar LM.")`;

  const lab2Code = `# Robust SE (sandwich/HC0) vs SE klasik — kapan keduanya beda jauh?
# SE klasik mengasumsikan variansi error konstan.
# Robust SE menimbang tiap observasi dengan residual kuadratnya sendiri.
import random, math
random.seed(7)

def ols_with_se(xs, ys, robust=False):
    n = len(xs)
    mx = sum(xs)/n; my = sum(ys)/n
    sxx = sum((x-mx)**2 for x in xs)
    sxy = sum((x-mx)*(y-my) for x, y in zip(xs, ys))
    b1 = sxy/sxx; b0 = my - b1*mx
    resid = [y - (b0 + b1*x) for x, y in zip(xs, ys)]
    if not robust:
        s2 = sum(r**2 for r in resid)/(n-2)
        se = math.sqrt(s2/sxx)
    else:
        # HC0 sandwich: Var(b1) = sum((x-xbar)^2 * r^2) / sxx^2
        meat = sum(((x-mx)**2)*(r**2) for x, r in zip(xs, resid))
        se = math.sqrt(meat)/sxx
    return b1, se

# Data heteroskedastik: error membesar seiring x
xs = [random.uniform(1, 10) for _ in range(300)]
ys = [2 + 1.5*x + random.gauss(0, 0.3 + 0.5*x) for x in xs]

b1c, sec = ols_with_se(xs, ys, robust=False)
b1r, ser = ols_with_se(xs, ys, robust=True)
print(f"beta1            = {b1c:.3f} (sama untuk keduanya)")
print(f"SE klasik        = {sec:.4f}  -> t = {b1c/sec:.1f}")
print(f"SE robust (HC0)  = {ser:.4f}  -> t = {b1r/ser:.1f}")
print()
print("SE klasik MEREMEHKAN ketidakpastian (t terlalu besar) ->")
print("p-value palsu optimis. Robust SE jujur: mengakui error heterogen.")
print()
print("COBA: buat error konstan (0.3 + 0.5*x -> 1.0), jalankan lagi.")
print("Kedua SE kini mirip — robust SE 'tidak merusak' kasus yang sehat.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.2 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Diagnostik Regresi:<br />Autopsi Model Sebelum Ia Membunuh Keputusanmu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Semua Bintang Signifikan, Semua Salah</a></li>
          <li><a href="#residual">Plot Residual — Rontgen Pertama Setiap Model</a></li>
          <li><a href="#uji">Uji Formal: Breusch-Pagan, White, Durbin-Watson, Jarque-Bera</a></li>
          <li><a href="#pengaruh">Titik Berpengaruh: Leverage, Cook&apos;s Distance, DFBETAS</a></li>
          <li><a href="#robust">Robust Standard Errors — Perban untuk SE yang Berdarah</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mendeteksi Heteroskedastisitas (Uji LM Sederhana)</a></li>
          <li><a href="#lab2">🔬 Lab 2: SE Klasik vs Robust — Bedanya Nyata</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Temuan Diagnostik → Tindakan</a></li>
          <li><a href="#case">📋 Mini-Case: Model PD yang &ldquo;Terlalu Bagus&rdquo;</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjalankan 4 plot diagnostik standar (residual vs fitted, Q-Q, scale-location, residual vs leverage) dan membaca apa yang ditunjukkan tiap pola.</li>
          <li>Menjelaskan logika dan interpretasi uji Breusch-Pagan, Durbin-Watson, dan Jarque-Bera — termasuk kapan uji formal tidak diperlukan.</li>
          <li>Mengidentifikasi titik berpengaruh dengan leverage dan Cook&apos;s distance, dan memutuskan: investigasi, robust, atau transformasi.</li>
          <li>Menghitung dan menginterpretasikan robust standard errors (HC), serta menjelaskan kapan SE klasik menipu.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Semua Bintang Signifikan, Semua Salah</h2>
      <div className="story">
        <p>Konsultan mempresentasikan model <em>probability of default</em> ke direksi bank. Slide penuh bintang: setiap variabel &ldquo;signifikan pada 1%&rdquo;. Direksi mengangguk puas, model disetujui, limit kredit dinaikkan untuk segmen yang &ldquo;terbukti aman&rdquo;.</p>
        <p>Tiga bulan kemudian, analis risiko junior — yang tidak diundang ke presentasi — iseng memplot residual model itu. Corong raksasa. Error untuk debitur besar 10× lebih lebar daripada debitur kecil. Artinya? <strong>Semua standard error di slide itu salah hitung.</strong> Bintang-bintang signifikansi itu dicetak oleh asumsi homoskedastisitas yang tidak pernah dicek. Setelah dihitung ulang dengan robust SE, separuh variabel jadi tidak signifikan — termasuk variabel yang dipakai menaikkan limit.</p>
        <p>Twist-nya: koefisien modelnya tidak berubah sama sekali. Yang berubah hanya <em>ketidakpastiannya</em> — dan ketidakpastian itulah yang menentukan keputusan. Lesson ini: cara mengautopsi modelmu sebelum modelmu mengautopsi kariermu.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="residual">Plot Residual — Rontgen Pertama Setiap Model</h2>
      <p><strong>Definisi.</strong> Diagnostik regresi adalah pemeriksaan sistematis apakah asumsi model terpenuhi, berbasis <strong>residual</strong> <Tex math={String.raw`e_i = y_i - \hat{y}_i`} />. Empat plot standar (dikenal dari output R):</p>
      <ol>
        <li><strong>Residual vs Fitted</strong> — <Tex math={String.raw`e_i`} /> melawan <Tex math={String.raw`\hat{y}_i`} />. Sehat: pita acak horizontal di sekitar nol. Sakit: lengkung (non-linearitas) atau corong (heteroskedastisitas).</li>
        <li><strong>Q-Q plot</strong> — kuantil residual vs kuantil normal teoritis. Sehat: titik menempel garis diagonal. Sakit: melengkung di ujung (ekor tebal/tipis) atau bentuk S (skew).</li>
        <li><strong>Scale-Location</strong> — <Tex math={String.raw`\sqrt{|e_i^{std}|}`} /> vs <Tex math={String.raw`\hat{y}_i`} />. Sehat: garis tren datar. Sakit: tren menanjak = variansi membesar (heteroskedastisitas).</li>
        <li><strong>Residual vs Leverage</strong> — titik mana yang jauh di sumbu <Tex math={String.raw`x`} /> <em>dan</em> menyeret garis (garis kontur Cook&apos;s distance).</li>
      </ol>

      <PlotlyChart
        data={qqGoodData}
        title="Q-Q Plot SEHAT: titik menempel garis normal"
        layout={{ xaxis: { title: "Kuantil normal teoritis" }, yaxis: { title: "Kuantil residual sampel" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = kuantil distribusi normal standar, vertikal = kuantil residual yang distandarkan. Garis putus-putus = posisi ideal jika residual persis normal.</p>
        <p><strong>Interpretasi:</strong> titik-titik menempel garis dari ujung ke ujung — residual (hampir) normal. Asumsi normalitas untuk uji-t dan interval prediksi terpenuhi. Ingat: normalitas hanya krusial untuk <em>inference</em> sampel kecil; untuk prediksi murni, ini prioritas buncit.</p>
      </div>

      <PlotlyChart
        data={qqBadData}
        title="Q-Q Plot SAKIT: ekor kanan melesat (heavy tail)"
        layout={{ xaxis: { title: "Kuantil normal teoritis" }, yaxis: { title: "Kuantil residual sampel" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama seperti Q-Q plot sebelumnya.</p>
        <p><strong>Interpretasi:</strong> titik-titik di ujung kanan <strong>melesat ke atas</strong> menjauhi garis — residual punya ekor kanan tebal (<em>heavy-tailed</em>): kejadian ekstrem positif jauh lebih sering dari prediksi normal. Klasik di data keuangan (rugi ekstrem). Konsekuensi: interval prediksi berbasis normal akan <strong>kekecilan</strong> — kamu meremehkan skenario buruk. Obat: transformasi, model robust, atau distribusi berekor tebal (misal t-student).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan baca diagnostik = <strong>bentuk dulu, sebaran kemudian, titik aneh terakhir</strong>. (1) Residual vs fitted: ada lengkung? → perbaiki spesifikasi model dulu. (2) Scale-location: ada corong? → urus heteroskedastisitas. (3) Q-Q: normal? → hanya penting untuk inference. (4) Leverage: ada penyergap? → investigasi. Jangan mengobati gejala nomor 4 sebelum penyakit nomor 1 sembuh.</p>
      </div>

      <h2 id="uji">Uji Formal: Breusch-Pagan, White, Durbin-Watson, Jarque-Bera</h2>
      <p><strong>Definisi.</strong> Uji formal mengubah &ldquo;kelihatannya ada corong&rdquo; menjadi angka dengan p-value. Tiga yang paling dipakai:</p>
      <ul>
        <li><strong>Breusch-Pagan (heteroskedastisitas):</strong> regresikan <Tex math={String.raw`e_i^2`} /> ke <Tex math={String.raw`x`} />. Logika: jika <Tex math={String.raw`x`} /> bisa menjelaskan <em>besarnya</em> error, variansi tidak konstan. Statistik <Tex math={String.raw`LM = n \times R^2_{aux}`} /> menyebar <Tex math={String.raw`\chi^2`} /> — tolak homoskedastisitas jika LM besar. <strong>White test</strong> adalah versi umumnya (tambah <Tex math={String.raw`x^2`} /> dan interaksi).</li>
        <li><strong>Durbin-Watson (autokorelasi):</strong> <Tex math={String.raw`DW = \frac{\sum (e_t - e_{t-1})^2}{\sum e_t^2}`} />. Nilai ≈ 2 → tidak ada autokorelasi; mendekati 0 → autokorelasi positif (error bergerombol searah); mendekati 4 → negatif. Wajib untuk data time series.</li>
        <li><strong>Jarque-Bera (normalitas):</strong> <Tex math={String.raw`JB = \frac{n}{6}\left(S^2 + \frac{(K-3)^2}{4}\right)`} /> dengan <Tex math={String.raw`S`} /> = skewness, <Tex math={String.raw`K`} /> = kurtosis residual. JB besar → tolak normalitas.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: membaca hasil Breusch-Pagan</summary>
        <p>Output: LM = 18,7, p-value = 0,0003 (derajat bebas 2).</p>
        <p><strong>Langkah 1</strong> — hipotesis nol: homoskedastisitas (variansi konstan).<br />
        <strong>Langkah 2</strong> — p = 0,0003 &lt; 0,05 → <strong>tolak H₀</strong>: ada bukti heteroskedastisitas.<br />
        <strong>Langkah 3</strong> — tindakan: koefisien tetap dipakai, tapi SE &amp; p-value regresi utama <strong>wajib</strong> dihitung ulang dengan robust SE. Jangan pernah melaporkan p-value dari SE klasik setelah uji ini menolak.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Uji formal lebih objektif dari plot, jadi plot tidak perlu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> uji formal menjawab &ldquo;apakah ada?&rdquo; tapi buta terhadap &ldquo;seperti apa?&rdquo;. Breusch-Pagan yang signifikan tidak memberi tahu apakah corongnya melebar ke kanan atau menyempit, di rentang mana, atau disebabkan 3 titik aneh. Plot memberi tahu <em>bentuk masalah</em> — dan bentuk itulah yang menentukan obatnya. Praktik terbaik: <strong>plot dulu untuk diagnosis, uji formal untuk dokumentasi</strong> (regulator/auditor suka angka).</p>
      </div>

      <h2 id="pengaruh">Titik Berpengaruh: Leverage, Cook&apos;s Distance, DFBETAS</h2>
      <p><strong>Definisi.</strong> Tidak semua outlier berbahaya. Yang berbahaya adalah titik <strong>berpengaruh</strong> (<em>influential</em>) — yang jika dibuang, kesimpulan berubah. Tiga alat ukur:</p>
      <ul>
        <li><strong>Leverage</strong> <Tex math={String.raw`h_{ii}`} /> — seberapa jauh titik ke-<Tex math={String.raw`i`} /> dari pusat data di ruang <Tex math={String.raw`x`} />. Rentang 0–1; rata-rata = <Tex math={String.raw`(k+1)/n`} />. Aturan praktis: <Tex math={String.raw`h_{ii} > 2(k+1)/n`} /> = leverage tinggi. <em>Catatan:</em> leverage tinggi saja belum tentu jahat — ia hanya punya <em>potensi</em> menyeret garis.</li>
        <li><strong>Cook&apos;s distance</strong> <Tex math={String.raw`D_i`} /> — seberapa besar seluruh vektor <Tex math={String.raw`\hat{\beta}`} /> berubah jika observasi <Tex math={String.raw`i`} /> dibuang:
          <Tex math={String.raw`D_i = \frac{e_i^2}{k \cdot s^2} \cdot \frac{h_{ii}}{(1-h_{ii})^2}`} block />
          Kombinasi residual besar <em>dan</em> leverage tinggi. Aturan praktis: <Tex math={String.raw`D_i > 4/n`} /> layak diinvestigasi; <Tex math={String.raw`D_i > 1`} /> serius.</li>
        <li><strong>DFBETAS</strong> — perubahan tiap koefisien (dalam satuan SE) jika observasi dibuang. Menjawab &ldquo;koefisien <em>mana</em> yang diseret titik ini?&rdquo;. Ambang: <Tex math={String.raw`|DFBETAS| > 2/\sqrt{n}`} />.</li>
      </ul>

      <PlotlyChart
        data={leverageData}
        title="Satu Titik Ber-leverage Tinggi Menyeret Garis OLS"
        layout={{ xaxis: { title: "x" }, yaxis: { title: "y" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik biru = data; garis merah = OLS dengan semua data; garis hijau putus-putus = OLS tanpa titik paling kanan (x=40).</p>
        <p><strong>Interpretasi:</strong> titik di x=40 jauh dari pusat data (leverage tinggi) dan menyeret garis merah turun — slope berubah drastis dibanding garis hijau. Cook&apos;s distance titik ini pasti besar. Pertanyaan kuncinya <strong>bukan</strong> &ldquo;buang atau tidak?&rdquo; melainkan &ldquo;kenapa titik ini ada?&rdquo; — salah input? segmen bisnis berbeda? sinyal fraud? Jawabannya menentukan tindakan.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Titik berpengaruh harus dibuang agar model bersih.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> membuang titik berpengaruh tanpa investigasi adalah <strong>memalsukan data</strong> — kamu menghapus informasi karena tidak cocok dengan model, bukan karena datanya salah. Urutan yang benar: (1) cek apakah salah input → perbaiki/hapus dengan dokumentasi; (2) jika valid tapi dari populasi berbeda → modelkan terpisah atau tambah variabel; (3) jika valid dan sepopulasi → pertahankan, laporkan sensitivitasnya (&ldquo;hasil berubah jika titik ini dibuang&rdquo;), atau pakai regresi robust.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan tiga spesies &ldquo;titik aneh&rdquo;: <strong>outlier</strong> = residual besar (aneh di <Tex math={String.raw`y`} />); <strong>leverage</strong> = jauh di <Tex math={String.raw`x`} />; <strong>influential</strong> = keduanya sekaligus sehingga menggerakkan <Tex math={String.raw`\hat{\beta}`} />. Outlier dengan leverage rendah hanya menggeser intersep sedikit. Leverage tinggi dengan residual kecil tidak masalah sama sekali. Yang mematikan hanyalah kombinasi keduanya — dan itulah yang diukur Cook&apos;s distance.</p>
      </div>

      <h2 id="robust">Robust Standard Errors — Perban untuk SE yang Berdarah</h2>
      <p><strong>Definisi.</strong> Robust SE (<em>heteroskedasticity-consistent</em>, HC — estimator &ldquo;sandwich&rdquo; White) menghitung ulang ketidakpastian koefisien tanpa mengasumsikan variansi konstan:</p>
      <Tex math={String.raw`\widehat{Var}(\hat{\beta}) = (X'X)^{-1} \left( \sum_{i=1}^{n} e_i^2 x_i x_i' \right) (X'X)^{-1}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`(X'X)^{-1}`} /> di kiri-kanan = &ldquo;roti&rdquo; sandwich (struktur desain data)</li>
        <li><Tex math={String.raw`\sum e_i^2 x_i x_i'`} /> = &ldquo;daging&rdquo; — tiap observasi menyumbang <em>variance aktualnya sendiri</em> (<Tex math={String.raw`e_i^2`} />), bukan satu <Tex math={String.raw`\sigma^2`} /> global</li>
        <li>Hasil: SE yang tetap valid meski variansi error berbeda-beda per observasi</li>
      </ul>
      <p>Varian: <strong>HC0</strong> (White asli), <strong>HC1</strong> (koreksi derajat bebas — default di Stata), <strong>HC2/HC3</strong> (koreksi leverage — HC3 direkomendasikan untuk sampel kecil karena tidak <em>underestimate</em> SE).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: kapan robust SE mengubah keputusan</summary>
        <p>Koefisien variabel &ldquo;limit_kartu&rdquo;: <Tex math={String.raw`\hat{\beta} = 0{,}42`} />.</p>
        <p><strong>SE klasik</strong> = 0,18 → t = 2,33 → p = 0,02 → &ldquo;signifikan!&rdquo; ⭐<br />
        <strong>SE robust (HC3)</strong> = 0,27 → t = 1,56 → p = 0,12 → tidak signifikan.</p>
        <p>Kesimpulan jujur: bukti tidak cukup kuat. Koefisiennya <strong>sama persis</strong> (0,42) — robust SE tidak mengubah estimasi, hanya mengubah <em>seberapa yakin</em> kita. Keputusan bisnis yang tadinya &ldquo;naikkan limit&rdquo; menjadi &ldquo;kumpulkan data dulu&rdquo;.</p>
      </details>

      <div className="callout callout-warning">
        <p><strong>Kapan robust SE TIDAK cukup:</strong> (1) autokorelasi (data time series) → butuh Newey-West/HAC SE; (2) data berkelompok (<em>clustered</em>, misal nasabah dalam cabang yang sama) → butuh clustered SE; (3) non-linearitas → robust SE tidak memperbaiki model yang salah spesifikasi. Robust SE adalah perban, bukan operasi.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Diagnostik = &ldquo;otopsi sebelum model membunuh keputusan&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Heteroskedastisitas — residual melebar</summary>
              <p>Model <code className="inline">pengeluaran ~ penghasilan</code>. Plot residual vs fitted: melebar seperti corong (spread naik dengan fitted). Apa masalahnya &amp; obatnya?</p>
              <p><strong>Langkah 1</strong> — diagnosis: <strong>heteroskedastisitas</strong> — varians error tidak konstan (asumsi Gauss-Markov jebol).<br />
              <strong>Langkah 2</strong> — dampak: koefisien tetap unbiased, tapi <em>standard error salah</em> → p-value &amp; IK tidak valid!<br />
              <strong>Langkah 3</strong> — obat: (a) transformasi log(y), (b) robust SE (sandwich), atau (c) WLS. Cek ulang plot — corong harus hilang.</p>
              <p>Pelajaran: residual plot = rontgen model. &ldquo;Pola&rdquo; apapun di residual = asumsi yang dilanggar = inferensi yang bohong.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Multikolinearitas — VIF 15</summary>
              <p>Prediktor <code className="inline">penghasilan</code> &amp; <code className="inline">plafon</code> berkorelasi 0,93. VIF penghasilan = 15. Koefisiennya tidak signifikan (p=0,4) padahal sendiri-sendiri signifikan. Jelaskan.</p>
              <p><strong>Langkah 1</strong> — VIF = 15 → SE koefisien membengkak √15 ≈ 3,9× — <em>power hancur</em>.<br />
              <strong>Langkah 2</strong> — model tidak bisa membedakan &ldquo;efek penghasilan&rdquo; vs &ldquo;efek plafon&rdquo; (keduanya bergerak bareng).<br />
              <strong>Langkah 3</strong> — obat: buang satu, gabung (rasio!), atau regularisasi (Ridge, A3.3). Prediksi tetap OK — yang rusak hanya <em>interpretasi</em> koefisien.</p>
              <p>Pelajaran: multikolinearitas tidak merusak prediksi — ia merusak <em>cerita</em> (&ldquo;variabel mana yang penting&rdquo;). Untuk inferensi: tangani. Untuk prediksi murni: abaikan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Mendeteksi Heteroskedastisitas (Uji LM Sederhana)</h2>
      <p>Logika Breusch-Pagan dalam 15 baris: regresikan residual kuadrat ke x, lihat apakah x menjelaskan besarnya error.</p>
      <PyodideLab
        title="Lab 1 — Uji LM Heteroskedastisitas"
        hint="Coba: naikkan kekuatan corong di skenario B (0.5+0.5*x → 0.5+2.0*x). Amati statistik LM meledak."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: SE Klasik vs Robust — Bedanya Nyata</h2>
      <p>Hitung kedua SE dari data heteroskedastik yang sama. Lihat bagaimana SE klasik meremehkan ketidakpastian.</p>
      <PyodideLab
        title="Lab 2 — Sandwich Estimator HC0 dari Nol"
        hint="Coba: buat error konstan (ganti 0.3+0.5*x jadi 1.0) — kedua SE kini mirip. Robust SE aman dipakai bahkan saat tidak dibutuhkan."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Temuan Diagnostik → Tindakan</h2>

      <div className="decision-card">
        <h3>1. Residual berpola lengkung → <strong>perbaiki spesifikasi</strong></h3>
        <p><strong>Temuan:</strong> residual vs fitted membentuk U/gelombang.</p>
        <p><strong>Tindakan:</strong> tambah suku kuadratik, transformasi log, atau interaksi. Ini prioritas #1 — model yang salah bentuk tidak bisa diselamatkan SE apapun.</p>
        <p><strong>Contoh nyata:</strong> PD vs rasio utang yang meledak di atas ambang.</p>
      </div>

      <div className="decision-card">
        <h3>2. Residual corong + uji BP menolak → <strong>robust SE (HC3)</strong></h3>
        <p><strong>Temuan:</strong> scale-location menanjak; Breusch-Pagan p &lt; 0,05.</p>
        <p><strong>Tindakan:</strong> koefisien tetap; hitung ulang SE, t, p-value, CI dengan robust. Pertimbangkan <Tex math={String.raw`\log(y)`} /> jika corong parah.</p>
        <p><strong>Contoh nyata:</strong> model LGD nominal — error debitur besar jauh lebih lebar.</p>
      </div>

      <div className="decision-card">
        <h3>3. DW jauh dari 2 (data time series) → <strong>Newey-West SE atau model dinamis</strong></h3>
        <p><strong>Temuan:</strong> Durbin-Watson ≈ 0,8; residual bergerombol searah menurut waktu.</p>
        <p><strong>Tindakan:</strong> robust SE biasa TIDAK cukup. Pakai HAC (Newey-West) atau modelkan dinamikanya langsung (lag, ARIMA — A3.9).</p>
        <p><strong>Contoh nyata:</strong> regresi return portofolio harian.</p>
      </div>

      <div className="decision-card">
        <h3>4. Cook&apos;s D &gt; 4/n → <strong>investigasi, jangan auto-hapus</strong></h3>
        <p><strong>Temuan:</strong> 1–2 titik dengan D besar di plot residual vs leverage.</p>
        <p><strong>Tindakan:</strong> cek sumber data → salah input? populasi beda? Jika valid: laporkan hasil dengan &amp; tanpa titik itu (analisis sensitivitas) atau pakai regresi robust.</p>
        <p><strong>Contoh nyata:</strong> satu debitur korporat raksasa di sampel UMKM.</p>
      </div>

      <div className="decision-card">
        <h3>5. Q-Q plot berekor tebal → <strong>waspadai interval prediksi</strong></h3>
        <p><strong>Temuan:</strong> Jarque-Bera menolak; ujung Q-Q melesat.</p>
        <p><strong>Tindakan:</strong> untuk inference sampel besar masih OK (CLT); tapi interval prediksi normal akan kekecilan → pakai kuantil empiris residual atau distribusi t.</p>
        <p><strong>Contoh nyata:</strong> residual return saham — crash lebih sering dari prediksi normal.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Bentuk → sebaran → titik aneh.</strong> Urutan diagnosis tidak boleh dibalik.</li>
          <li>Plot untuk diagnosis, uji formal untuk dokumentasi.</li>
          <li>Robust SE memperbaiki ketidakpastian, <strong>bukan</strong> model yang salah bentuk.</li>
          <li>Setiap titik berpengaruh = misteri yang harus dipecahkan, bukan sampah yang dibuang.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Model PD yang &ldquo;Terlalu Bagus&rdquo;</h2>
      <div className="callout">
        <p>Vendor menjual model PD ke bankmu. Laporan validasi: 8 variabel, <strong>semuanya signifikan pada 1%</strong>, R² = 0,68, n = 50.000. Kamu diminta me-review sebelum pembelian Rp2 miliar.</p>
        <p>Kamu minta data residual dan menemukan: (a) scale-location menanjak tajam — error debitur besar 8× lebih lebar; (b) satu observasi dengan Cook&apos;s D = 0,35 (ambang 4/n = 0,00008); (c) Q-Q plot berekor tebal di kanan.</p>
        <p><strong>Pertanyaan:</strong> (a) Apa status klaim &ldquo;semua signifikan 1%&rdquo;? (b) Apa arti Cook&apos;s D = 0,35? (c) Rekomendasimu ke direksi?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tidak bisa dipercaya.</strong> Heteroskedastisitas parah → SE klasik (yang menghasilkan bintang-bintang itu) salah hitung, kemungkinan besar <em>underestimate</em> → p-value palsu optimis. Minta hasil dengan robust/clustered SE sebelum percaya satu bintang pun.</p>
          <p>(b) Cook&apos;s D = 0,35 vs ambang 0,00008 — <strong>sangat berpengaruh</strong> (ribuan kali lipat ambang). Satu observasi menggerakkan kesimpulan model 50.000 data. Wajib investigasi: siapa debitur ini? Jika ia debitur jumbo yang valid, model mungkin hanya &ldquo;cerita tentang satu raksasa&rdquo;.</p>
          <p>(c) <strong>Tunda pembelian.</strong> Minta vendor: (1) hasil dengan robust SE, (2) analisis sensitivitas tanpa titik berpengaruh, (3) validasi out-of-sample &amp; out-of-time. Model yang sehat tidak takut diautopsi — vendor yang menolak autopsi adalah <em>red flag</em>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>QQ-plot residual melengkung di kedua ujung (S-shape). Asumsi apa yang dilanggar? Dampaknya?</li>
              <li>Cook&apos;s distance satu observasi = 0,8 (lainnya &lt; 0,05). Tindakanmu?</li>
              <li>R² tinggi (0,9) tapi residual berpola kuadratik. Apa yang salah?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Non-normalitas</strong> residual (ekor tebal dua sisi). Dampak: p-value/IK <em>eksak</em> tidak valid (tapi dengan n besar, CLT menyelamatkan inferensi koefisien). Jika n kecil → bootstrap atau transformasi.</p>
              <p><strong>2.</strong> <strong>Investigasi, bukan auto-hapus!</strong> Cek: salah input? (perbaiki) / memang anomali valid? (laporkan + uji sensitivitas: model dengan &amp; tanpa observasi itu). Menghapus diam-diam = cherry-picking.</p>
              <p><strong>3.</strong> <strong>Spesifikasi salah</strong>: hubungan sebenarnya kuadratik, model linear &ldquo;memaksa&rdquo;. R² tinggi menipu — tambahkan suku kuadratik (atau transformasi), R² naik <em>dan</em> residual jadi acak. R² tanpa cek residual = angka buta.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Setelah uji Breusch-Pagan menolak H₀, tindakan yang TEPAT?"
        options={[
          "Buang variabel yang tidak signifikan",
          "Koefisien tetap dipakai, tapi SE/t/p-value/CI dihitung ulang dengan robust SE",
          "Transformasi semua variabel jadi log",
          "Naikkan alpha ke 10% agar tetap signifikan",
        ]}
        correct={1}
        explanation="Benar: heteroskedastisitas tidak membiaskan koefisien — yang rusak hanya ukuran ketidakpastiannya. Robust SE memperbaikinya. Menaikkan alpha agar 'tetap signifikan' adalah p-hacking."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Titik dengan leverage TINGGI tapi residual KECIL. Berbahaya?"
        options={[
          "Ya, leverage tinggi selalu berbahaya",
          "Tidak — ia menempel garis, jadi tidak menyeret β. Berbahaya hanya jika residual juga besar (itulah Cook's distance)",
          "Ya, harus selalu dibuang",
          "Tidak, leverage tidak pernah penting",
        ]}
        correct={1}
        explanation="Benar: leverage = potensi, bukan vonis. Titik jauh di x yang menempel garis justru memperkuat estimasi (nambah informasi). Cook's distance menggabungkan keduanya: butuh residual besar DAN leverage tinggi untuk berpengaruh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Durbin-Watson = 0,7 pada regresi data bulanan. Artinya?"
        options={[
          "Tidak ada masalah",
          "Autokorelasi positif kuat — error bergerombol searah; robust SE biasa tidak cukup, butuh Newey-West/model dinamis",
          "Heteroskedastisitas",
          "Multikolinearitas sempurna",
        ]}
        correct={1}
        explanation="Benar: DW jauh di bawah 2 = autokorelasi positif. Ini kasus time series — 'perban' robust SE standar tidak menutup luka autokorelasi. Butuh HAC standard errors atau modelkan dinamikanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Q-Q plot residual melengkung seperti huruf S (bawah-kiri di bawah garis, atas-kanan di atas garis). Diagnosis?"
        options={[
          "Residual skewed — ekor satu sisi lebih tebal",
          "Residual berekor tebal di kedua sisi (heavy-tailed simetris)",
          "Heteroskedastisitas",
          "Autokorelasi",
        ]}
        correct={1}
        explanation="Benar: pola S simetris = kedua ujung menjauh dari garis = ekor tebal dua sisi. Konsekuensi praktis: interval prediksi normal kekecilan di kedua arah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kenapa HC3 direkomendasikan untuk sampel kecil dibanding HC0?"
        options={[
          "HC3 selalu menghasilkan SE lebih kecil",
          "HC0 cenderung underestimate SE di sampel kecil; HC3 mengoreksi efek leverage tiap observasi sehingga lebih jujur",
          "HC3 tidak butuh residual",
          "HC0 tidak valid secara teori",
        ]}
        correct={1}
        explanation="Benar: HC0 (White asli) bias ke bawah saat n kecil — SE terlihat lebih presisi dari seharusnya. HC3 membagi tiap residual kuadrat dengan (1−hᵢᵢ)² sehingga titik ber-leverage tidak 'menyembunyikan' ketidakpastian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model A: semua diagnostik sehat. Model B: R² lebih tinggi tapi residual berpola lengkung. Pilih?"
        options={[
          "Model B — R² lebih tinggi selalu menang",
          "Model A — R² tinggi dari model yang salah spesifikasi adalah ilusi; perbaiki dulu bentuknya baru bandingkan",
          "Rata-ratakan keduanya",
          "Pilih berdasarkan jumlah variabel",
        ]}
        correct={1}
        explanation="Benar: residual berpola = model belum menangkap struktur sistematis di data → koefisien bisa bias, R² menipu. Model 'sehat' dengan R² sedikit lebih rendah jauh lebih bisa dipercaya daripada model 'sakit' yang cantik di permukaan."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>4 plot wajib:</strong> residual vs fitted (bentuk), Q-Q (normalitas), scale-location (heteroskedastisitas), residual vs leverage (titik berpengaruh).</li>
          <li><strong>Uji formal:</strong> Breusch-Pagan/White (heteroskedastisitas), Durbin-Watson (autokorelasi), Jarque-Bera (normalitas) — untuk dokumentasi, bukan pengganti plot.</li>
          <li><strong>Cook&apos;s D</strong> = residual besar × leverage tinggi. Investigasi dulu, jangan auto-hapus.</li>
          <li><strong>Robust SE (HC3)</strong> memperbaiki SE/t/p-value saat heteroskedastisitas; tidak memperbaiki model yang salah bentuk, autokorelasi, atau data berkelompok.</li>
          <li><strong>Jangan</strong> laporkan bintang signifikansi dari SE klasik setelah uji heteroskedastisitas menolak — itu angka palsu.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a31-regresi-ols" className="btn btn-secondary btn-sm">← A3.1</Link>
        <Link href="/learn/a33-regularisasi" className="btn btn-primary btn-sm">Next: A3.3 →</Link>
      </div>
    </div>
  );
}
