import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D3NumpyPage() {
  const chart1 = [{"x": ["Loop Python", "NumPy"], "y": [8, 0.05], "type": "bar", "marker": {"color": ["#ef4444", "#34a853"]}, "text": ["8 dtk", "0,05 dtk"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('numpy')

import numpy as np

plafon = np.array([50, 100, 30, 200, 75, 40, 60, 90, 25, 55], dtype=float)  # juta
macet = np.array([False, True, True, False, True, False, False, False, True, False])

# NPL ratio (vectorized!)
npl = plafon[macet].sum() / plafon.sum()
print(f"NPL ratio: {npl:.2%}")

# rata-rata plafon macet vs tidak
print(f"Rata-rata macet: {plafon[macet].mean():.1f} jt")
print(f"Rata-rata lancar: {plafon[~macet].mean():.1f} jt")

# Coba: plafon semua naik 10% (broadcasting) — NPL berubah?
`;
  const lab2Code = String.raw`import micropip
await micropip.install('numpy')

import numpy as np

rng = np.random.default_rng(42)
ret = rng.normal(0.001, 0.02, 100_000)

p_rugi = (ret < -0.05).mean()
print(f"P(rugi > 5%): {p_rugi:.2%}")
print(f"Return terburuk: {ret.min():.2%}")
print(f"Return terbaik: {ret.max():.2%}")

# Coba: ganti seed 42 -> 123. Berapa P-nya? (beda tipis = Monte Carlo error!)
# Coba: naikkan n ke 1 juta — P lebih stabil?
`;
  const quizData = [{"question": "Vectorization cepat karena…", "options": ["Python lebih cepat", "Operasi di C terkompilasi sekaligus, bukan loop Python", "Array lebih kecil", "Sihir"], "correct": 1, "explanation": "Benar: loop di C, bukan di Python — beda orde kecepatan."}, {"question": "(2,3) + (2,) → …", "options": ["OK", "Error — broadcast cocok dari kanan", "OK jadi (2,3)", "Jadi (2,2)"], "correct": 1, "explanation": "Benar: (3,) vs (2,) tak cocok. Cek shape!"}, {"question": "dpd[dpd > 30] = …", "options": ["Error", "Boolean indexing — elemen yang memenuhi", "Semua elemen", "Indeks ke-30"], "correct": 1, "explanation": "Benar: WHERE-nya NumPy."}, {"question": "Untuk AND di boolean indexing…", "options": ["and", "& dengan kurung", "&&", "+"], "correct": 1, "explanation": "Benar: & (bitwise) dengan kurung — 'and' Python tak bisa untuk array."}, {"question": "Seed dalam simulasi untuk…", "options": ["Kecepatan", "Reproduksibilitas — hasil sama tiap run", "Keamanan", "Tidak penting"], "correct": 1, "explanation": "Benar: tanpa seed, hasil tak bisa direplikasi = tak bisa dipercaya."}, {"question": "a[a < 0] = 0 artinya…", "options": ["Error", "Semua negatif jadi 0 (assign bersyarat)", "Hapus negatif", "Tidak ada efek"], "correct": 1, "explanation": "Benar: 1 baris untuk floor — pola cleaning."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D3 — Python</span>
        <h1 className="display-title">NumPy: Vectorization &amp;<br/>Berpikir Array</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Loop 8 Detik vs 0,05 Detik</a></li>
          <li><a href="#vector">Vectorization — Berhenti Loop</a></li>
          <li><a href="#broadcast">Broadcasting — Shape Beda, Tetap Jalan</a></li>
          <li><a href="#indexing">Boolean &amp; Fancy Indexing</a></li>
          <li><a href="#random">Random — Simulasi dengan Seed</a></li>
          <li><a href="#lab1">🔬 Lab 1: Vectorized NPL</a></li>
          <li><a href="#lab2">🔬 Lab 2: Monte Carlo Sederhana</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: NumPy</a></li>
          <li><a href="#case">📋 Mini-Case: Stress Test Portofolio</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>vectorization</strong>: mengapa operasi array 100× lebih cepat dari loop.</li><li>Memakai <strong>broadcasting</strong> untuk operasi antar-shape.</li><li>Menerapkan <strong>indexing boolean &amp; fancy</strong>.</li><li>Memakai <strong>random</strong> NumPy dengan seed untuk simulasi.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Loop 8 Detik vs 0,05 Detik</h2>

      <div className="story"><p>Analis menghitung rata-rata 10 juta transaksi dengan loop Python: <strong>8 detik</strong>. Rekannya memakai NumPy: <strong>0,05 detik</strong> — 160× lebih cepat, kode lebih pendek.</p><p>Rahasianya: <strong>vectorization</strong> — operasi diterapkan ke <em>seluruh array sekaligus</em> di C yang dikompilasi, bukan per elemen di Python. Ini <em>cara berpikir</em> baru: berhenti loop, mulai operasikan array. Lesson ini mengubah cara kamu menulis kode numerik selamanya.</p><p><strong>Twist-nya:</strong> 160× lebih cepat dengan kode yang <em>lebih pendek</em> — biasanya kecepatan dibayar dengan keterbacaan, tapi vectorization memberi keduanya. Harganya bukan sintaks — melainkan cara berpikir: berhenti memerintah &ldquo;untuk tiap elemen, lakukan X&rdquo;, mulai memerintah &ldquo;untuk seluruh array, lakukan X&rdquo;. Satu pergeseran mental, seluruh kode numerikmu berubah selamanya.</p></div>

      <h2 id="vector">Vectorization — Berhenti Loop</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

print(a + b)       # [11 22 33 44]  (element-wise!)
print(a * 2)       # [2 4 6 8]
print(a ** 2)      # [1 4 9 16]
print(np.sqrt(a))  # [1.  1.41  1.73  2. ]</pre>

      <ul>
<li><strong>Element-wise:</strong> operasi diterapkan per elemen — tanpa loop!</li>
<li><strong>Ufunc:</strong> <code className="inline">np.sqrt, np.exp, np.log</code> = fungsi vectorized.</li>
<li><strong>Agregat:</strong> <code className="inline">a.sum(), a.mean(), a.std(), a.max()</code>.</li>
</ul>

      <details className="worked">
<summary>📐 Contoh: hitung NPL</summary>
<p><code className="inline">plafon = np.array([50, 100, 30, 200])  # juta</code><br/><code className="inline">macet = np.array([False, True, True, False])</code></p><p><code className="inline">npl = plafon[macet].sum() / plafon.sum()</code> → 0,342. Tiga operasi, nol loop — bandingkan dengan loop + if manual!</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;NumPy hanya untuk matematikawan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Analis memakai NumPy <em>setiap hari</em> tanpa sadar — di dalam pandas! Tiap <code className="inline">df['x'] * 2</code> = operasi NumPy. Memahami vectorization menjelaskan <em>mengapa</em> pandas cepat dan <em>kapan</em> loop manual menjadi masalah.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Refleks: saat jarimu mengetik <code className="inline">for</code> untuk angka — berhenti! Tanyakan: 'bisakah ini operasi array?' 95% bisa.</p>
</div>

      <h2 id="broadcast">Broadcasting — Shape Beda, Tetap Jalan</h2>

      <p><strong>Aturan:</strong> array kecil 'direntangkan' mengikuti yang besar (dari dimensi terakhir):</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">m = np.array([[1, 2, 3],
              [4, 5, 6]])  # shape (2, 3)

print(m + 10)           # skalar -&gt; semua elemen
print(m + np.array([1, 0, 1]))  # (3,) -&gt; tiap baris
# m + np.array([1, 2])  # ERROR: (2,) vs (3,) tak cocok!</pre>

      <ul>
<li><strong>Kapan:</strong> normalisasi (kurangi mean tiap kolom), skenario (+10% ke semua), bobot.</li>
<li><strong>Jebakan:</strong> shape (3,) vs (3,1) beda! Pakai <code className="inline">.reshape(-1, 1)</code> untuk kolom.</li>
<li><strong>Debug:</strong> <code className="inline">print(a.shape)</code> — selalu cek shape saat error!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Hafalkan: broadcasting cocok dari <strong>kanan ke kiri</strong>. (2,3) + (3,) OK; (2,3) + (2,) ERROR. Cek shape = debug 80% error NumPy.</p>
</div>

      <h2 id="indexing">Boolean &amp; Fancy Indexing</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">dpd = np.array([0, 15, 45, 0, 90, 5])

mask = dpd &gt; 30                    # [False False  True False  True False]
print(dpd[mask])                  # [45 90]  (boolean indexing!)

print(dpd[[0, 2, 4]])             # [0 45 90]  (fancy: indeks list)
dpd[dpd &gt; 30] = 999               # assign bersyarat!
print(dpd)  # [0 15 999 0 999 5]</pre>

      <ul>
<li><strong>Boolean indexing</strong> = WHERE-nya NumPy! (C1: filter baris.)</li>
<li><strong>Assign bersyarat:</strong> <code className="inline">a[a &lt; 0] = 0</code> — floor di 0, 1 baris!</li>
<li><strong>Operator:</strong> <code className="inline">&amp;</code> (and), <code className="inline">|</code> (or), <code className="inline">~</code> (not) — dengan <strong>kurung</strong>!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Boolean indexing membuat kopi yang boros.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Boolean indexing memang return <em>kopi</em> — tapi untuk analisis itu justru aman (tak ubah asli). Untuk view hemat memori: <em>slicing</em> (<code className="inline">a[1:3]</code>) = view. Beda kebutuhan, beda alat.</p>
</div>

      <h2 id="random">Random — Simulasi dengan Seed</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">rng = np.random.default_rng(42)  # seed = reproduksibel!

acak = rng.normal(0, 1, 10000)      # 10rb sampel N(0,1)
print(acak.mean(), acd := acak.std())

# Monte Carlo: P(portofolio rugi &gt; 10%)
ret = rng.normal(0.001, 0.02, 100000)
print(f&quot;P(rugi&gt;10%): &#123;(ret &lt; -0.10).mean():.2%&#125;&quot;)</pre>

      <ul>
<li><code className="inline">default_rng(seed)</code> = generator modern (bukan <code className="inline">np.random.seed</code> global!).</li>
<li><strong>Seed = reproduksibel:</strong> seed sama → angka sama → hasil bisa direplikasi orang lain.</li>
<li><strong>Distribusi:</strong> <code className="inline">normal, uniform, binomial, poisson, choice</code>.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan simulasi: <strong>selalu set seed</strong> dan catat di kode. 'Hasil tidak bisa direplikasi' = hasil tidak bisa dipercaya (D14!).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Loop vs Vectorized: 10 Juta Elemen (ilustrasi)"
  layout={{"yaxis": {"title": "Detik", "type": "log"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Skala log — beda 160×.</p>
<p><strong>Interpretasi:</strong> Vectorization bukan optimasi kecil — ia <strong>beda orde</strong>. Dan kode NumPy <em>lebih pendek</em>. Cepat + ringkas = tidak ada alasan loop untuk numerik.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Berhenti loop, mulai operasikan array.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Loop vs vectorized — buktikan 160×</summary>
              <p>10 juta transaksi. Hitung rata-rata: loop Python vs NumPy.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import numpy as np, time
      x = np.random.default_rng(42).uniform(1e6, 50e6, 10_000_000)
      # Cara loop (JANGAN di data besar):
      #   total = 0
      #   for v in x: total += v   # ~8 detik
      t0 = time.time(); m = x.mean(); t1 = time.time()
      print(m, f&#x27;&#123;t1-t0:.3f&#x27; detik&#125;)  # ~0.05 detik</pre>
              <p><strong>Bedah:</strong> <code className="inline">x.mean()</code> = loop di C yang dikompilasi, bukan di Python. 8 dtk → 0,05 dtk. Aturan praktis: jika kamu menulis <code className="inline">for</code> di atas array NumPy, berhenti — cari padanan vectorized-nya (<code className="inline">mean/sum/max/where/...</code>).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Broadcasting — standarisasi tanpa loop</summary>
              <p>Standarisasi 3 kolom gaji (z-score) sekaligus.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import numpy as np
      X = np.array([[10., 5.], [20., 15.], [30., 10.]])  # 3 baris, 2 kolom
      mu = X.mean(axis=0)      # -&gt; [20., 10.]  (per kolom!)
      sd = X.std(axis=0)       # -&gt; [8.165, 4.082]
      Z = (X - mu) / sd        # broadcasting: (3,2) - (2,) -&gt; OK!
      print(Z[:, 0])           # -&gt; [-1.225, 0., 1.225]</pre>
              <p><strong>Bedah:</strong> <code className="inline">axis=0</code> = &ldquo;hitung per kolom&rdquo;. Broadcasting: shape (3,2) − (2,) → (2,) &ldquo;diregangkan&rdquo; ke tiap baris. Syarat: dimensi cocok dari <em>belakang</em>. Salah shape = error — baca shape dulu (<code className="inline">X.shape</code>) sebelum operasi.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Boolean indexing — filter tanpa loop</summary>
              <p>Dari 1 juta gaji, ambil yang &gt; 15 juta, hitung rata-ratanya.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import numpy as np
      gaji = np.random.default_rng(7).lognormal(16, 0.5, 1_000_000)
      mask = gaji &gt; 15_000_000          # array boolean 1 juta!
      kaya = gaji[mask]                  # fancy indexing
      print(mask.sum(), len(kaya))       # -&gt; mis. 52341 52341
      print(kaya.mean())</pre>
              <p><strong>Bedah:</strong> <code className="inline">gaji &gt; 15_000_000</code> menghasilkan <em>array boolean</em> — dipakai sebagai &ldquo;kacamata&rdquo; untuk memfilter. <code className="inline">mask.sum()</code> = jumlah True (boolean = 0/1!). Ini = WHERE-nya NumPy, dan = cikal bakal boolean mask pandas (D4).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Vectorized NPL</h2>

      <p>Data: plafon & status macet (array). Hitung NPL ratio + rata-rata plafon macet — <strong>dilarang loop!</strong></p>

      <PyodideLab
  title="Lab 1 — Tanpa Loop!"
  hint="Bandingkan kecepatan: tulis versi loop manual dengan %%time (di Colab) — rasakan bedanya!"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Monte Carlo Sederhana</h2>

      <p>Simulasikan 100.000 return harian N(0,1%, 2%). Estimasi P(rugi &gt; 5%) dalam sehari. Ulangi 2× — sama?</p>

      <PyodideLab
  title="Lab 2 — Simulasi dengan Seed"
  hint="Hitung juga P(untung > 5%). Simetris? Kenapa? (mean 0,1%!)"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: NumPy</h2>

      <div className="decision-card">
<h3>1. Operasi per elemen → <strong>vectorized</strong></h3>
<p><strong>Kondisi data:</strong> Tanpa loop.</p>
<p><strong>Kenapa:</strong> 100× cepat; kode pendek.</p>
<p><strong>Contoh nyata:</strong> a * 2, np.sqrt(a).</p>
</div>

      <div className="decision-card">
<h3>2. Filter → <strong>boolean indexing</strong></h3>
<p><strong>Kondisi data:</strong> WHERE-nya NumPy.</p>
<p><strong>Kenapa:</strong> mask = kondisi; a[mask].</p>
<p><strong>Contoh nyata:</strong> dpd[dpd &gt; 30].</p>
</div>

      <div className="decision-card">
<h3>3. Shape beda → <strong>broadcasting</strong></h3>
<p><strong>Kondisi data:</strong> Rentangkan.</p>
<p><strong>Kenapa:</strong> Cek shape dari kanan.</p>
<p><strong>Contoh nyata:</strong> matriks + vektor.</p>
</div>

      <div className="decision-card">
<h3>4. Simulasi → <strong>rng + seed</strong></h3>
<p><strong>Kondisi data:</strong> Reproduksibel.</p>
<p><strong>Kenapa:</strong> default_rng(seed); catat seed.</p>
<p><strong>Contoh nyata:</strong> Monte Carlo.</p>
</div>

      <div className="decision-card">
<h3>5. Error shape → <strong>print shape</strong></h3>
<p><strong>Kondisi data:</strong> Debug.</p>
<p><strong>Kenapa:</strong> 80% error = shape mismatch.</p>
<p><strong>Contoh nyata:</strong> a.shape, b.shape.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Jari mengetik <code className="inline">for</code> untuk angka → berhenti, vectorize!</li><li>Broadcasting: cocokkan dari kanan; cek shape.</li><li>Boolean: <code className="inline">&amp; | ~</code> dengan kurung.</li><li>Simulasi: seed selalu, catat selalu.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Stress Test Portofolio</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Portofolio Rp 1M. Asumsi return harian N(0,05%, 1,5%). Estimasi: (a) P(rugi &gt; Rp 50jt sehari), (b) VaR 95% 1-hari.</p><p><strong>Tugas:</strong> tulis simulasi Monte Carlo (100rb skenario). Bandingkan VaR simulasi vs rumus normal (B7!).</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">r = rng.normal(0.0005, 0.015, 100_000); pnl = 1e9 * r</code><br/>(a) <code className="inline">(pnl &lt; -50e6).mean()</code> (b) <code className="inline">VaR = -np.percentile(pnl, 5)</code></p><p>Rumus: VaR 95% = 1e9 × (1.645×0.015 − 0.0005) ≈ Rp 24,2jt. Simulasi ≈ sama (beda = Monte Carlo error). <strong>Pelajaran:</strong> simulasi memverifikasi rumus; rumus memverifikasi simulasi. Dua alat, satu kebenaran. (B15: VaR/ES mendalam!)</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Array <code className="inline">a = np.array([1, 2, 3, 4])</code>. Apa hasil <code className="inline">a * 2</code>, <code className="inline">a ** 2</code>, <code className="inline">a &gt; 2</code>?</li>
              <li>Broadcasting: <code className="inline">X.shape = (5, 3)</code>, <code className="inline">v.shape = (3,)</code>. Bisa <code className="inline">X + v</code>? Bagaimana dengan <code className="inline">w.shape = (5,)</code>?</li>
              <li>Tulis 1 baris: dari array <code className="inline">dpd</code>, hitung % yang &gt; 30.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1.
      # a*2  -&gt; [2 4 6 8]   (element-wise, bukan [1 2 3 4 1 2 3 4]!)
      # a**2 -&gt; [1 4 9 16]
      # a&gt;2  -&gt; [False False True True]
      # 3.
      pct = (dpd &gt; 30).mean() * 100  # boolean.mean() = proporsi True!</pre>
              <p><strong>2.</strong> <code className="inline">X + v</code>: (5,3)+(3,) → <strong>bisa</strong> (v diregang ke 5 baris). <code className="inline">X + w</code>: (5,3)+(5,) → <strong>error</strong> (5 ≠ 3 dari belakang!). Solusi: <code className="inline">X + w[:, None]</code> → (5,1) broadcast ke (5,3).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Vectorization:</strong> operasi array sekaligus di C — berhenti loop!</li><li><strong>Broadcasting:</strong> cocokkan shape dari kanan; cek .shape.</li><li><strong>Boolean indexing:</strong> filter + assign bersyarat (<code className="inline">&amp; | ~</code>).</li><li><strong>Random:</strong> default_rng(seed) — reproduksibel selalu.</li><li>NumPy = mesin di dalam pandas.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d2-struktur-data" className="btn btn-secondary btn-sm">← ← D2</Link>
        <Link href="/learn/d4-pandas-dasar" className="btn btn-primary btn-sm">Next: D4 →</Link>
      </div>
    </div>
  );
}
