import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D12SklearnPage() {
  const chart1 = [{"x": ["Underfit", "Pas", "Overfit"], "y": [70, 85, 99], "type": "bar", "name": "Train", "marker": {"color": "#94a3b8"}}, {"x": ["Underfit", "Pas", "Overfit"], "y": [68, 83, 70], "type": "bar", "name": "CV/Test", "marker": {"color": "#2a7de1"}}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')
import micropip
await micropip.install('scikit-learn')

import pandas as pd, numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

rng = np.random.default_rng(42)
n = 300
df = pd.DataFrame({
    "penghasilan": rng.normal(9e6, 2.5e6, n),
    "dpd": rng.poisson(15, n),
    "tenor": rng.choice([12, 24, 36], n),
})
# target: macet jika dpd tinggi + gaji rendah (dengan noise)
prob = 1 / (1 + np.exp(-(df["dpd"] / 10 - df["penghasilan"] / 5e6)))
df["macet"] = (rng.random(n) < prob).astype(int)
df.loc[rng.choice(n, 15), "penghasilan"] = np.nan  # missing!
print("Proporsi macet:", df["macet"].mean().round(3))

X, y = df[["penghasilan", "dpd", "tenor"]], df["macet"]
pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    ("model", LogisticRegression(max_iter=500)),
])
cv = StratifiedKFold(5, shuffle=True, random_state=42)
skor = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
print(f"AUC: {skor.mean():.3f} +/- {skor.std():.3f}")

# Coba: ganti scoring='accuracy'. Kenapa menipu di sini? (imbalance!)
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')
import micropip
await micropip.install('scikit-learn')

import pandas as pd, numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(7)
n = 200
X = pd.DataFrame({"x1": rng.normal(0, 1, n), "x2": rng.normal(0, 1, n)})
y = ((X["x1"] + X["x2"] + rng.normal(0, 0.5, n)) > 0).astype(int)

print("depth | train | CV")
for depth in [1, 2, 3, 5, 10, None]:
    m = DecisionTreeClassifier(max_depth=depth, random_state=42)
    train_skor = m.fit(X, y).score(X, y)
    cv_skor = cross_val_score(m, X, y, cv=5).mean()
    flag = " <-- OVERFIT!" if train_skor - cv_skor > 0.15 else ""
    print(f"{str(depth):>5} | {train_skor:.3f} | {cv_skor:.3f}{flag}")

# Coba: depth berapa yang terbaik? (CV tertinggi, bukan train!)
`;
  const quizData = [{"question": "Akurasi 95% pada data 95% negatif…", "options": ["Bagus", "Menipu — model 'tebak semua negatif' pun 95%. Pakai AUC/precision/recall", "Sempurna", "Error"], "correct": 1, "explanation": "Benar: akurasi = metrik terburuk untuk imbalance."}, {"question": "Pipeline penting karena…", "options": ["Rapi", "Preprocessing fit hanya di train — anti-leakage by design", "Cepat", "Wajib sklearn"], "correct": 1, "explanation": "Benar: kebenaran metodologis, bukan sekadar gaya."}, {"question": "CV melaporkan…", "options": ["1 angka", "Mean ± std dari k lipatan", "Train score", "Waktu"], "correct": 1, "explanation": "Benar: distribusi performa, bukan undian 1 split."}, {"question": "StratifiedKFold untuk…", "options": ["Kecepatan", "Jaga proporsi target tiap lipatan (imbalance)", "Shuffle", "Regresi"], "correct": 1, "explanation": "Benar: wajib untuk target tak seimbang."}, {"question": "Train 99%, CV 70% = …", "options": ["Bagus", "Overfit — menghafal", "Underfit", "Normal"], "correct": 1, "explanation": "Benar: gap besar = menghafal noise."}, {"question": "Holdout dipakai…", "options": ["Berkali-kali", "Sekali, di akhir, tak tersentuh sebelumnya", "Untuk training", "Tidak perlu"], "correct": 1, "explanation": "Benar: sekali pakai = sekali dipercaya."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D12 — Python</span>
        <h1 className="display-title">scikit-learn: Pipeline &amp;<br/>Cross-Validation</h1>
        <div className="meta">60 menit+ &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 99% yang Hancur di Produksi</a></li>
          <li><a href="#dasar">fit/predict — Dua Kata Kunci</a></li>
          <li><a href="#pipeline">Pipeline — Anti-Leakage by Design</a></li>
          <li><a href="#cv">Cross-Validation — Jangan Percaya 1 Split</a></li>
          <li><a href="#overfit">Overfitting — Menghafal vs Belajar</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pipeline Lengkap</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi Overfitting</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: ML</a></li>
          <li><a href="#case">📋 Mini-Case: Model 99% yang Hancur (60+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan alur <strong>fit/predict</strong> sklearn.</li><li>Membuat <strong>Pipeline</strong> (preprocessing + model) yang anti-leakage.</li><li>Menjalankan <strong>cross-validation</strong> &amp; membaca metrik (AUC, dll).</li><li>Menjelaskan <strong>overfitting</strong> &amp; cara mendeteksinya.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Model 99% yang Hancur di Produksi</h2>

      <div className="story"><p>Model skor kredit: akurasi <strong>99%</strong> di laptop. Deploy 1 bulan: prediksi ngawur, kerugian Rp 500 juta. Investigasi: <strong>leakage</strong> (fitur "status kolektibilitas saat ini" = target!) + <strong>tanpa validasi</strong> yang benar.</p><p>sklearn membuat ML <em>mudah</em> — terlalu mudah hingga orang lupa validasi. Lesson case-heavy ini (60+ menit): cara yang <strong>benar</strong> — pipeline + CV + metrik yang tepat. ML tanpa validasi = ramalan, bukan sains.</p><p><strong>Twist-nya:</strong> akurasi 99% — angka paling berbahaya di machine learning. Model &ldquo;sempurna&rdquo; di laptop ternyata menghafal target lewat leakage (fitur = target yang menyamar!). Tanpa validasi yang benar, 99% bukan prestasi — melainkan <em>gejala</em>. sklearn memudahkan training; lesson ini menyulitkan self-deception. Curigai setiap angka yang terlalu bagus.</p></div>

      <h2 id="dasar">fit/predict — Dua Kata Kunci</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)      # belajar dari train
pred = model.predict(X_test)     # prediksi test
proba = model.predict_proba(X_test)[:, 1]  # probabilitas!</pre>

      <ul>
<li><strong>fit(X, y):</strong> belajar; <strong>predict(X):</strong> prediksi kelas; <strong>predict_proba:</strong> probabilitas.</li>
<li><strong>X</strong> = fitur (2D); <strong>y</strong> = target (1D).</li>
<li><strong>train_test_split:</strong> <code className="inline">random_state</code> untuk reproduksibel; <code className="inline">stratify=y</code> untuk target tak seimbang!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Untuk fraud/kredit macet (target 1–5%): <strong>stratify=y</strong> wajib! Tanpa itu, test set bisa 0% positif — metrik menipu.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Akurasi 95% = model bagus.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jika 95% tidak macet, model 'tebak semua lancar' = 95% akurasi tapi <strong>tak menangkap 1 pun</strong> yang macet! Untuk imbalance: <strong>AUC, precision, recall, F1</strong> — bukan akurasi. (B... : metrik klasifikasi!)</p>
</div>

      <h2 id="pipeline">Pipeline — Anti-Leakage by Design</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

pipe = Pipeline([
    (&#x27;imputer&#x27;, SimpleImputer(strategy=&#x27;median&#x27;)),
    (&#x27;scaler&#x27;, StandardScaler()),
    (&#x27;model&#x27;, LogisticRegression()),
])
pipe.fit(X_train, y_train)  # semua step fit HANYA di train!</pre>

      <ul>
<li><strong>Mengapa:</strong> preprocessing di dalam pipeline = otomatis fit-di-train-saja (D10!).</li>
<li><strong>ColumnTransformer:</strong> beda treatment per kolom (numerik: impute+scale; kategorikal: one-hot).</li>
<li><strong>Aturan:</strong> <em>jangan</em> preprocessing manual di luar pipeline lalu CV — itu leakage!</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pipeline hanya untuk kerapian.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pipeline = <strong>kebenaran metodologis</strong>! Preprocessing di luar CV = statistik test bocor ke train (D10). Pipeline memaksa urutan benar. Kerapian = bonus.</p>
</div>

      <h2 id="cv">Cross-Validation — Jangan Percaya 1 Split</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.model_selection import cross_val_score, StratifiedKFold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
skor = cross_val_score(pipe, X, y, cv=cv, scoring=&#x27;roc_auc&#x27;)
print(f&#x27;AUC: &#123;skor.mean():.3f&#125; (+/- &#123;skor.std():.3f&#125;)&#x27;)</pre>

      <ul>
<li><strong>K-fold:</strong> data dibagi 5; tiap lipatan jadi test 1× — 5 skor, bukan 1!</li>
<li><strong>Stratified:</strong> jaga proporsi target per lipatan (untuk imbalance).</li>
<li><strong>scoring:</strong> 'roc_auc', 'f1', 'precision', 'recall' — pilih sesuai <em>biaya kesalahan</em>.</li>
<li><strong>Lapor:</strong> mean ± std — bukan 1 angka!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pilih metrik dari <em>bisnis</em>: fraud = recall penting (jangan lewatkan!); kredit = precision vs recall trade-off (tolak yang sehat = rugi). Metrik = keputusan bisnis, bukan default.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;CV 5-fold = 5× lebih lambat, tidak worth it.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> 1 split = 1 undian! Beda seed → beda hasil ±5%. CV memberi <strong>distribusi</strong> performa — 'AUC 0.82 ± 0.03' jauh lebih jujur dari 'AUC 0.85' (yang mungkin hoki). Untuk keputusan deploy, kejujuran &gt; kecepatan.</p>
</div>

      <h2 id="overfit">Overfitting — Menghafal vs Belajar</h2>

      <p><strong>Tanda:</strong> train 99%, test/CV 70% = <strong>menghafal</strong> (overfit). Model bagus: train ≈ CV (keduanya wajar).</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># diagnosis: learning curve sederhana
for depth in [2, 5, 10, None]:
    m = DecisionTreeClassifier(max_depth=depth)
    s = cross_val_score(m, X, y, cv=3)
    print(f&#x27;depth=&#123;depth&#125;: train~? CV=&#123;s.mean():.3f&#125;&#x27;)
# pola: CV naik lalu TURUN = overfit mulai!</pre>

      <ul>
<li><strong>Obat:</strong> lebih banyak data, regularisasi (C, max_depth), fitur lebih sedikit, CV.</li>
<li><strong>Underfit:</strong> train & CV sama-sama jelek = model terlalu sederhana.</li>
<li><strong>Validasi:</strong> simpan <strong>holdout</strong> yang <em>tak pernah</em> disentuh hingga akhir!</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Aturan data: <strong>train</strong> (latih) → <strong>CV</strong> (pilih model) → <strong>holdout</strong> (1× verifikasi akhir). Holdout yang dipakai 2× = bukan holdout lagi!</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Diagnosis: Train vs Test (ilustrasi)"
  layout={{"barmode": "group", "yaxis": {"title": "Skor"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Abu-abu = train; biru = test/CV.</p>
<p><strong>Interpretasi:</strong> <strong>Overfit:</strong> train 99% tapi test 70% — menghafal! <strong>Pas:</strong> keduanya ~84% — belajar pola umum. <strong>Selalu bandingkan keduanya</strong> — train saja = menipu diri.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. sklearn mudah — validasi yang sulit.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Leakage — akurasi 99% yang palsu</summary>
              <p>Fitur <code className="inline">kolektibilitas_saat_ini</code> (1=lancar…5=macet). Target: macet 3 bulan lagi. Model: akurasi 99%.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.linear_model import LogisticRegression
      # X_masalah = df[[&#x27;kolektibilitas_saat_ini&#x27;, ...]]  # BOCOR!
      # y = df[&#x27;macet_3bln_lagi&#x27;]
      # Model &quot;belajar&quot;: kolektibilitas 5 -&gt; pasti macet. Bukan pola, tapi identitas.
      # Tes: drop fitur itu -&gt; akurasi 99% -&gt; 72%. ITULAH angka jujurnya.
      model = LogisticRegression(max_iter=1000)
      # Aturan: fitur harus tersedia SAAT prediksi dibuat (D10!).</pre>
              <p><strong>Bedah:</strong> kolektibilitas hari ini <em>mengandung</em> informasi target (yang macet hari ini hampir pasti macet 3 bulan lagi). Model tidak memprediksi — ia membaca. Gejala: 1 fitur mendominasi importance + akurasi tidak wajar. Obat: audit fitur dengan &ldquo;tes ketersediaan waktu&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Pipeline — scaling tanpa bocor</summary>
              <p>StandardScaler di-fit ke <em>seluruh</em> data sebelum split = leakage halus. Tulis yang benar.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.pipeline import Pipeline
      from sklearn.preprocessing import StandardScaler
      from sklearn.linear_model import LogisticRegression
      from sklearn.model_selection import cross_val_score
      # SALAH: scaler.fit(X); X_s = scaler.transform(X); lalu split -&gt; bocor!
      # BENAR: scaler di DALAM pipeline -&gt; di-fit ulang per fold
      pipe = Pipeline([
          (&#x27;scaler&#x27;, StandardScaler()),
          (&#x27;model&#x27;, LogisticRegression(max_iter=1000))])
      skor = cross_val_score(pipe, X, y, cv=5, scoring=&#x27;roc_auc&#x27;)
      print(skor.mean(), skor.std())  # -&gt; mis. 0.78 0.03</pre>
              <p><strong>Bedah:</strong> Pipeline menjamin transformasi di-fit <em>hanya</em> pada train tiap fold — tidak ada informasi test yang merembes. <code className="inline">cross_val_score</code> mengembalikan 5 skor: mean = performa, std = stabilitas. Tanpa pipeline, CV-mu mengukur kebocoran, bukan kemampuan.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Metrik — akurasi vs AUC pada data imbalance</summary>
              <p>1.000 nasabah, 50 macet (5%). Model A: akurasi 95%. Model B: akurasi 90%, AUC 0,85. Mana lebih baik?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from sklearn.metrics import roc_auc_score, confusion_matrix
      # Model A: prediksi &quot;lancar&quot; semua -&gt; akurasi 950/1000 = 95%!
      #   confusion: [[950, 0], [50, 0]] -&gt; recall macet = 0%. TIDAK BERGUNA.
      # Model B: akurasi 90% tapi AUC 0.85 -&gt; bisa ranking risiko.
      # -&gt; Pilih B. Akurasi pada data imbalance = menipu (A3.5!).
      print(&quot;Aturan: imbalance -&gt; AUC / PR-AUC / F1, bukan akurasi.&quot;)</pre>
              <p><strong>Bedah:</strong> akurasi 95% &lt; akurasi model &ldquo;bodoh&rdquo; yang selalu menebak mayoritas. Untuk risiko kredit/fraud: yang penting = <em>ranking</em> (siapa paling berisiko?) → AUC; atau tradeoff presisi-recall → PR-AUC. Pilih metrik sesuai keputusan bisnis (A3.5!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Pipeline Lengkap</h2>

      <p>Dataset kredit inline. Bangun pipeline: impute + scale + logistic. Evaluasi dengan CV (AUC).</p>

      <PyodideLab
  title="Lab 1 — Klasifikasi Macet (End-to-End)"
  hint="Eksperimen: hapus SimpleImputer — apa yang terjadi? (NaN = error!)"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Deteksi Overfitting</h2>

      <p>Decision tree dengan max_depth bervariasi. Plot train vs CV — temukan titik overfit!</p>

      <PyodideLab
  title="Lab 2 — Depth vs CV"
  hint="Renungkan: kenapa train terus naik tapi CV turun? (menghafal noise!)"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: ML</h2>

      <div className="decision-card">
<h3>1. Preprocessing → <strong>dalam Pipeline</strong></h3>
<p><strong>Kondisi data:</strong> Anti-leakage.</p>
<p><strong>Kenapa:</strong> Fit hanya di train, otomatis.</p>
<p><strong>Contoh nyata:</strong> impute+scale+model.</p>
</div>

      <div className="decision-card">
<h3>2. Evaluasi → <strong>CV stratified</strong></h3>
<p><strong>Kondisi data:</strong> Jujur.</p>
<p><strong>Kenapa:</strong> Mean ± std, bukan 1 angka.</p>
<p><strong>Contoh nyata:</strong> 5-fold AUC.</p>
</div>

      <div className="decision-card">
<h3>3. Metrik → <strong>dari bisnis</strong></h3>
<p><strong>Kondisi data:</strong> Relevan.</p>
<p><strong>Kenapa:</strong> Bukan default akurasi.</p>
<p><strong>Contoh nyata:</strong> Recall untuk fraud.</p>
</div>

      <div className="decision-card">
<h3>4. Imbalance → <strong>stratify</strong></h3>
<p><strong>Kondisi data:</strong> Wajib.</p>
<p><strong>Kenapa:</strong> Jaga proporsi target.</p>
<p><strong>Contoh nyata:</strong> stratify=y.</p>
</div>

      <div className="decision-card">
<h3>5. Train &gt;&gt; CV → <strong>overfit</strong></h3>
<p><strong>Kondisi data:</strong> Diagnosis.</p>
<p><strong>Kenapa:</strong> Regularisasi / data / fitur.</p>
<p><strong>Contoh nyata:</strong> Batasi depth.</p>
</div>

      <div className="decision-card">
<h3>6. Deploy → <strong>holdout 1×</strong></h3>
<p><strong>Kondisi data:</strong> Final.</p>
<p><strong>Kenapa:</strong> Tak tersentuh hingga akhir.</p>
<p><strong>Contoh nyata:</strong> Verifikasi terakhir.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Pipeline untuk semua preprocessing.</li><li>CV stratified; lapor mean ± std.</li><li>Metrik dari biaya kesalahan bisnis.</li><li>Train vs CV selalu dibandingkan.</li><li>Holdout = sekali, di akhir.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Model 99% yang Hancur (60+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Model akurasi 99% di laptop, hancur di produksi (rugi Rp 500jt). Fitur termasuk 'kolektibilitas_saat_ini'. Evaluasi: 1 split train-test tanpa stratify.</p><p><strong>Tugas:</strong> (1) Identifikasi <strong>2 kesalahan fatal</strong>. (2) Rancang ulang: pipeline + CV + metrik yang benar. (3) Tulis <strong>post-mortem 5 kalimat</strong> untuk direksi.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> ① <strong>Leakage:</strong> 'kolektibilitas_saat_ini' = target itu sendiri (saat prediksi, belum diketahui!). ② <strong>Validasi salah:</strong> 1 split tanpa stratify + metrik akurasi pada data imbalance = menipu.</p><p><strong>(2)</strong> Hapus fitur bocor → fitur point-in-time (D10) → Pipeline(impute+scale+model) → StratifiedKFold CV → metrik AUC + precision/recall.</p><p><strong>(3)</strong> 'Model 99% mengandung kebocoran data: ia 'mengintip' jawaban saat latihan. Di produksi tanpa jawaban, ia gagal. Kami membangun ulang dengan validasi benar (AUC 0.78, jujur) + checklist anti-leakage sebelum deploy berikutnya.'</p><p><strong>Pelajaran:</strong> ML = <strong>validasi</strong>. Model tanpa validasi benar = bukan model, tapi <em>ilusi</em>. Checklist D14 mencegah ini.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Mengapa <code className="inline">train_test_split</code> tanpa <code className="inline">stratify</code> berbahaya untuk target 5% macet?</li>
              <li>Tulis 3 baris: pipeline (imputer median + scaler + logistic) + CV 5-fold.</li>
              <li>Overfitting: train AUC 0,99, CV AUC 0,71. Diagnosis + 2 obat.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 2.
      from sklearn.pipeline import Pipeline
      from sklearn.impute import SimpleImputer
      from sklearn.preprocessing import StandardScaler
      from sklearn.linear_model import LogisticRegression
      pipe = Pipeline([(&#x27;imp&#x27;, SimpleImputer(strategy=&#x27;median&#x27;)),
                       (&#x27;scl&#x27;, StandardScaler()),
                       (&#x27;lr&#x27;, LogisticRegression(max_iter=1000))])</pre>
              <p><strong>1.</strong> Tanpa stratify, split acak bisa memberi test dengan 2% (atau 8%) macet — evaluasi tidak representatif &amp; tidak stabil. <code className="inline">stratify=y</code> menjaga proporsi 5% di train &amp; test.</p>
              <p><strong>3.</strong> <strong>Overfitting</strong> (menghafal train). Obat: (a) regularisasi lebih kuat (<code className="inline">C</code> lebih kecil), (b) kurangi fitur / tambah data, (c) validasi dengan time-split jika ada drift waktu.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>fit/predict:</strong> belajar di train, prediksi di test; stratify untuk imbalance.</li><li><strong>Pipeline:</strong> preprocessing di dalam = anti-leakage by design.</li><li><strong>CV:</strong> stratified k-fold; lapor mean ± std; metrik dari bisnis.</li><li><strong>Overfit:</strong> train &gt;&gt; CV; obat = data/regularisasi/fitur.</li><li><strong>Holdout:</strong> sekali di akhir. ML tanpa validasi = ilusi.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d11-scipy-statsmodels" className="btn btn-secondary btn-sm">← ← D11</Link>
        <Link href="/learn/d13-performa" className="btn btn-primary btn-sm">Next: D13 →</Link>
      </div>
    </div>
  );
}
