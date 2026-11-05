import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D10FeatureEngineeringPage() {
  const chart1 = [{"x": ["Fitur mentah\n(5 fitur)", "+ Agregat", "+ Rasio & waktu", "+ Encoding\nbenar"], "y": [60, 72, 81, 85], "type": "bar", "marker": {"color": ["#94a3b8", "#e8a838", "#2a7de1", "#34a853"]}, "text": ["60%", "72%", "81%", "85%"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, numpy as np, io

trx = pd.read_csv(io.StringIO("""nasabah_id,tanggal,jumlah,kategori
1,2026-09-01,500000,belanja
1,2026-09-03,250000,makan
1,2026-09-15,1200000,travel
2,2026-09-01,1000000,belanja
2,2026-09-10,2000000,travel
2,2026-09-25,400000,makan"""), parse_dates=["tanggal"])
nasabah = pd.DataFrame({"id": [1, 2], "plafon": [50_000_000, 100_000_000]})

# AGREGAT per nasabah
agg = trx.groupby("nasabah_id").agg(
    trx_n=("jumlah", "count"),
    trx_sum=("jumlah", "sum"),
    trx_max=("jumlah", "max"),
    trx_mean=("jumlah", "mean"),
)
print(agg)

# RASIO: total trx / plafon
fitur = agg.merge(nasabah, left_index=True, right_on="id")
fitur["utilisasi_trx"] = fitur["trx_sum"] / fitur["plafon"]
# WAKTU: hari sejak trx terakhir (vs 2026-10-01)
terakhir = trx.groupby("nasabah_id")["tanggal"].max()
fitur = fitur.merge((pd.Timestamp("2026-10-01") - terakhir).dt.days.rename("hari_sejak_trx"),
                    left_on="id", right_index=True)
print("\nFITUR:"); print(fitur[["trx_n", "trx_sum", "utilisasi_trx", "hari_sejak_trx"]])

# Coba: fitur fraud apa yang bisa ditambah? (velocity? jam aneh?)
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')
import micropip
await micropip.install('scikit-learn')

import pandas as pd, numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

df = pd.DataFrame({
    "kota": ["Jakarta", "Bandung", "Jakarta", "Surabaya", "Bandung", "Jakarta"],
    "plafon": [50e6, 100e6, 30e6, 200e6, 40e6, 90e6],
    "macet": [0, 0, 1, 0, 0, 1],
})

# 1. SPLIT DULU!
train, test = train_test_split(df, test_size=0.33, random_state=42)

# 2. One-hot (kolom sama di train & test!)
X_train = pd.get_dummies(train[["kota", "plafon"]], columns=["kota"])
X_test = pd.get_dummies(test[["kota", "plafon"]], columns=["kota"])
X_test = X_test.reindex(columns=X_train.columns, fill_value=0)
print("Kolom:", list(X_train.columns))

# 3. Scaling: FIT di train SAJA
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)  # pakai mean/std TRAIN
print("\nMean train setelah scaling:", X_train_s.mean(axis=0).round(2))

# Coba: apa yang terjadi jika fit di full data? (leakage! mean/std bocor)
`;
  const quizData = [{"question": "Feature engineering penting karena…", "options": ["Menggantikan model", "Fitur bagus + model sederhana > model canggih + fitur mentah", "Wajib 1000 fitur", "Tidak penting"], "correct": 1, "explanation": "Benar: kualitas fitur = bahan bakar model."}, {"question": "Data leakage = …", "options": ["Data hilang", "Fitur mengandung info masa depan/target — model menipu", "Data duplikat", "Fitur terlalu banyak"], "correct": 1, "explanation": "Benar: dosa terbesar. Curigai akurasi 99%+."}, {"question": "Scaler harus di-fit…", "options": ["Di full data", "Hanya di train, lalu transform test", "Hanya di test", "Tidak perlu"], "correct": 1, "explanation": "Benar: statistik test bocor = leakage."}, {"question": "Scaling wajib untuk…", "options": ["Random forest", "SVM/KNN/neural net (jarak/gradien)", "Semua model", "Tidak ada"], "correct": 1, "explanation": "Benar: tree tak peduli skala."}, {"question": "'DPD 90 hari' sebagai fitur prediksi <em>saat pencairan</em>…", "options": ["Aman", "Leakage (belum terjadi!)", "Bagus", "Tidak masalah"], "correct": 1, "explanation": "Benar: point-in-time — hanya info saat observasi."}, {"question": "Kota dengan 200 nilai unik sebaiknya…", "options": ["One-hot 200 kolom", "Target/frequency encoding", "Dihapus", "Label encoding ordinal"], "correct": 1, "explanation": "Benar: one-hot meledak; encoding alternatif."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D10 — Python</span>
        <h1 className="display-title">Feature Engineering:<br/>Bahan Bakar Model</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 60% → 85% Tanpa Ganti Algoritma</a></li>
          <li><a href="#pola">Pola Fitur — 4 Keluarga</a></li>
          <li><a href="#encoding">Encoding &amp; Scaling</a></li>
          <li><a href="#leakage">Leakage — Dosa Terbesar ⚠️</a></li>
          <li><a href="#lab1">🔬 Lab 1: Fitur Kredit</a></li>
          <li><a href="#lab2">🔬 Lab 2: Encoding + Scaling Aman</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Fitur</a></li>
          <li><a href="#case">📋 Mini-Case: Fitur Skor Kredit (45+ mnt)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>mengapa feature engineering</strong> &gt; tuning model.</li><li>Membuat fitur <strong>agregat, rasio, waktu, kategorikal</strong> (credit &amp; fraud).</li><li>Menerapkan <strong>encoding</strong> (one-hot, target) &amp; <strong>scaling</strong>.</li><li>Menghindari <strong>leakage</strong> (dosa terbesar!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Model 60% → 85% Tanpa Ganti Algoritma</h2>

      <div className="story"><p>Kompetisi: model A akurasi 60% dengan 5 fitur mentah. Model B <strong>85%</strong> — algoritma <em>sama</em> (logistic regression!), tapi 40 fitur hasil engineering: rasio, agregat 30-hari, tren.</p><p>Pepatah ML: <em>'garbage in, garbage out — fitur bagus, model sederhana menang.'</em> Feature engineering = menerjemahkan <strong>pengetahuan domain</strong> (risk! fraud!) menjadi angka. Lesson ini: pola fitur untuk credit & fraud — domainmu.</p><p><strong>Twist-nya:</strong> model A vs B — algoritma <em>sama persis</em> (logistic regression), akurasi 60% vs 85%. Yang membedakan bukan modelnya — melainkan fiturnya. Industri terobsesi tuning algoritma (pekerjaan 5%), padahal 95% kemenangan ada di feature engineering. &ldquo;Garbage in, garbage out&rdquo; bukan slogan motivasi — ia hasil kompetisi yang diukur.</p></div>

      <h2 id="pola">Pola Fitur — 4 Keluarga</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1. AGREGAT: ringkasan perilaku
fitur[&#x27;trx_30d_n&#x27;] = ...    # count 30 hari
fitur[&#x27;trx_30d_sum&#x27;] = ...  # total 30 hari
fitur[&#x27;trx_30d_max&#x27;] = ...  # terbesar

# 2. RASIO: normalisasi
fitur[&#x27;utilisasi&#x27;] = plafon_terpakai / plafon
fitur[&#x27;dpd_per_tenor&#x27;] = dpd / tenor

# 3. WAKTU: tren &amp; keterkinian
fitur[&#x27;hari_sejak_trx&#x27;] = (kini - trx_terakhir).days
fitur[&#x27;tren_7d&#x27;] = ma7 / ma30 - 1

# 4. KATEGORIKAL: encoding
# one-hot: kota_Jakarta, kota_Bandung, ...
# target encoding: rata-rata default per kota</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Keluarga</th><th>Contoh credit</th><th>Contoh fraud</th></tr></thead>
<tbody>
<tr><td>Agregat</td><td>Rata-rata DPD 6 bulan</td><td>Count trx 1 jam (velocity!)</td></tr>
<tr><td>Rasio</td><td>Utilisasi limit</td><td>Amount / rata-rata user</td></tr>
<tr><td>Waktu</td><td>MOB (umur kredit)</td><td>Jam transaksi (0–23)</td></tr>
<tr><td>Kategorikal</td><td>Tujuan kredit</td><td>Channel (one-hot)</td></tr>
</tbody>
</table>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Mulai dari <strong>hipotesis domain</strong>: 'fraud = cepat + besar + jam aneh' → velocity, amount ratio, hour. Fitur dari <em>pemahaman</em>, bukan dari coba-coba buta.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak fitur makin baik.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Fitur sampah = noise + overfitting + lambat. <strong>Kualitas &gt; kuantitas</strong>: 20 fitur bermakna &gt; 200 fitur acak. Dan tiap fitur harus <em>dijelaskan</em> ('mengapa ini prediktif?').</p>
</div>

      <h2 id="encoding">Encoding &amp; Scaling</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># one-hot: kategori -&gt; kolom biner
pd.get_dummies(df[&#x27;kota&#x27;], prefix=&#x27;kota&#x27;, dtype=int)

# scaling: samakan skala (untuk model jarak/gradien!)
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)  # fit di TRAIN saja!

# log: untuk skew
import numpy as np
df[&#x27;log_plafon&#x27;] = np.log1p(df[&#x27;plafon&#x27;])</pre>

      <ul>
<li><strong>One-hot:</strong> untuk nominal, kardinalitas kecil. Kardinalitas besar? → target/frequency encoding.</li>
<li><strong>Scaling:</strong> wajib untuk SVM, KNN, neural net, regresi ber-regularisasi. Tree? <em>Tidak butuh</em>.</li>
<li><strong>Log:</strong> untuk skew kanan (plafon, gaji) — B4!</li>
<li><strong>Aturan emas:</strong> fit (scaler/encoder) <strong>hanya di train</strong>, transform ke test (anti-leakage!).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Scaling selalu dibutuhkan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya untuk model berbasis <em>jarak/gradien</em>. Tree-based (random forest, XGBoost) = <em>tidak butuh</em> (split tak peduli skala). Scaling buta = buang waktu; pahami modelmu (D12!).</p>
</div>

      <h2 id="leakage">Leakage — Dosa Terbesar ⚠️</h2>

      <p><strong>Definisi.</strong> <strong>Data leakage</strong> = fitur mengandung info <em>masa depan</em> / <em>target itu sendiri</em> — model 'sempurna' di train, hancur di live.</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Contoh leakage</th><th>Kenapa bocor</th><th>Obat</th></tr></thead>
<tbody>
<tr><td>'DPD 90 hari' untuk prediksi saat pencairan</td><td>Belum terjadi saat prediksi</td><td>Point-in-time: hanya info saat observasi</td></tr>
<tr><td>Imputasi pakai mean full data</td><td>Info test bocor ke train</td><td>Fit imputasi di train saja</td></tr>
<tr><td>'Status macet' sebagai fitur prediksi macet</td><td>Itu targetnya!</td><td>Audit: fitur vs target</td></tr>
<tr><td>Future trx dalam agregat</td><td>Lookahead (D7!)</td><td>Jendela hanya masa lalu</td></tr>
</tbody>
</table>
</div>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># POLA AMAN: semua transform fit di train
from sklearn.preprocessing import StandardScaler
scaler.fit(X_train)              # hanya train!
X_train_s = scaler.transform(X_train)
X_test_s = scaler.transform(X_test)  # pakai parameter train</pre>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Uji leakage: 'apakah fitur ini <em>sudah diketahui</em> saat prediksi dibuat?' + 'apakah ada info test di train?' Jika ragu → bocor. Model terlalu bagus (99%+) = curigai leakage <em>dulu</em>, rayakan <em>kemudian</em>.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Leakage hanya masalah pemula.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Kaggle grandmaster pun pernah! Leakage = musuh abadi karena sering <em>halus</em> (ID berkorelasi waktu, duplikat train-test). <strong>Audit leakage</strong> = checklist wajib sebelum deploy (D14!).</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Akurasi vs Tahap Feature Engineering (ilustrasi)"
  layout={{"xaxis": {"title": "Tahap"}, "yaxis": {"title": "Akurasi %"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Model sama (logistic regression), fitur bertambah.</p>
<p><strong>Interpretasi:</strong> Fitur &gt; algoritma: dari 60% ke 85% <strong>tanpa ganti model</strong>. Inilah mengapa waktu untuk feature engineering &gt; waktu tuning hyperparameter. (Angka ilustrasi.)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Fitur = pengetahuan domain yang dijadikan angka.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Rasio — lebih baik dari angka mentah</summary>
              <p>Prediksi gagal bayar. Fitur mentah: <code className="inline">plafon</code>, <code className="inline">penghasilan</code>. Buat fitur yang lebih baik.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      df[&#x27;dsr&#x27;] = df[&#x27;angsuran&#x27;] / df[&#x27;penghasilan&#x27;]  # debt-service ratio
      df[&#x27;ltv&#x27;] = df[&#x27;plafon&#x27;] / df[&#x27;nilai_agunan&#x27;]    # loan-to-value
      # DSR 0,8 (Andi, gaji 10jt) vs DSR 0,8 (Budi, gaji 50jt)?
      # -&gt; tambah sisa_hidup = penghasilan - angsuran (absolut penting juga!)</pre>
              <p><strong>Bedah:</strong> rasio menormalisasi skala (plafon 100jt artinya beda untuk gaji 10jt vs 100jt). Tapi rasio <em>membuang</em> informasi absolut — DSR sama, sisa hidup beda jauh. Aturan: beri model <em>keduanya</em> (rasio + absolut), biar model yang memilih.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Agregat waktu — perilaku 30 hari</summary>
              <p>Dari log transaksi, buat fitur &ldquo;velocity 30 hari&rdquo; per nasabah untuk model fraud.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">trx = trx[trx.tanggal &gt;= &#x27;2026-09-01&#x27;]  # jendela 30 hari
      fitur = trx.groupby(&#x27;nasabah_id&#x27;).agg(
          n_trx_30d=(&#x27;nominal&#x27;, &#x27;size&#x27;),
          total_30d=(&#x27;nominal&#x27;, &#x27;sum&#x27;),
          max_30d=(&#x27;nominal&#x27;, &#x27;max&#x27;),
          kota_unik_30d=(&#x27;kota&#x27;, &#x27;nunique&#x27;))
      fitur[&#x27;avg_30d&#x27;] = fitur[&#x27;total_30d&#x27;] / fitur[&#x27;n_trx_30d&#x27;]</pre>
              <p><strong>Bedah:</strong> pola &ldquo;agregat per entitas per jendela&rdquo; = 80% feature engineering fraud/credit. <code className="inline">nunique</code> kota = fitur impossible travel (C14!) sebagai angka. <strong>Awas lookahead</strong> (D7!): jendela harus <em>berakhir sebelum</em> tanggal observasi target!</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Leakage — fitur yang &ldquo;terlalu bagus&rdquo;</summary>
              <p>Fitur <code className="inline">status_kolektibilitas_saat_ini</code> memberi akurasi 99%. Mengapa harus dibuang?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># Target: apakah akan macet 3 bulan lagi?
      # Fitur: status kolektibilitas HARI INI (termasuk info 3 bulan ke depan?)
      # -&gt; Jika &quot;macet hari ini&quot; hampir pasti &quot;macet 3 bulan lagi&quot;:
      #     model &quot;belajar&quot; identitas, bukan pola. Akurasi 99% PALSU.
      # Tes leakage: bisakah fitur ini diketahui PADA SAAT prediksi dibuat?
      # -&gt; Tidak (butuh info masa depan) -&gt; BUANG.</pre>
              <p><strong>Bedah:</strong> tes leakage = &ldquo;apakah nilai fitur tersedia <em>saat model dipakai</em>?&rdquo;. Fitur turunan dari target/proses pasca-observasi = bocor. Gejala: akurasi tidak wajar (99%!) + fitur importance didominasi 1 fitur. Obat: pipeline + time-based split (D12!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Fitur Kredit</h2>

      <p>Dari data transaksi + nasabah: buat fitur agregat (total, count, max 30 hari), rasio, dan waktu. Semua vectorized!</p>

      <PyodideLab
  title="Lab 1 — Bangun Fitur dari Data Mentah"
  hint="Tantangan: buat fitur 'kategori dominan' (modus kategori per nasabah)."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Encoding + Scaling Aman</h2>

      <p>One-hot kota + scaling plafon. Bagi train/test DULU, fit scaler HANYA di train!</p>

      <PyodideLab
  title="Lab 2 — One-Hot &amp; Scaler Anti-Leakage"
  hint="Eksperimen: kota baru di test ('Medan') — bagaimana get_dummies menanganinya? (reindex!)"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Fitur</h2>

      <div className="decision-card">
<h3>1. Mulai dari → <strong>hipotesis domain</strong></h3>
<p><strong>Kondisi data:</strong> Bermakna.</p>
<p><strong>Kenapa:</strong> Fitur dari pemahaman, bukan coba-coba.</p>
<p><strong>Contoh nyata:</strong> 'Fraud = cepat' → velocity.</p>
</div>

      <div className="decision-card">
<h3>2. Perilaku → <strong>agregat jendela</strong></h3>
<p><strong>Kondisi data:</strong> Ringkasan.</p>
<p><strong>Kenapa:</strong> count/sum/max/mean per periode.</p>
<p><strong>Contoh nyata:</strong> trx 30 hari.</p>
</div>

      <div className="decision-card">
<h3>3. Normalisasi → <strong>rasio</strong></h3>
<p><strong>Kondisi data:</strong> Skala.</p>
<p><strong>Kenapa:</strong> Bagi dengan basis yang tepat.</p>
<p><strong>Contoh nyata:</strong> Utilisasi = pakai/plafon.</p>
</div>

      <div className="decision-card">
<h3>4. Kategori kecil → <strong>one-hot</strong></h3>
<p><strong>Kondisi data:</strong> Nominal.</p>
<p><strong>Kenapa:</strong> Kolom biner; besar → target encoding.</p>
<p><strong>Contoh nyata:</strong> Kota.</p>
</div>

      <div className="decision-card">
<h3>5. Skew/model jarak → <strong>log/scaling</strong></h3>
<p><strong>Kondisi data:</strong> Transform.</p>
<p><strong>Kenapa:</strong> log1p untuk skew; scaler untuk jarak/gradien.</p>
<p><strong>Contoh nyata:</strong> log plafon.</p>
</div>

      <div className="decision-card">
<h3>6. Selalu → <strong>cek leakage</strong></h3>
<p><strong>Kondisi data:</strong> Jujur.</p>
<p><strong>Kenapa:</strong> Point-in-time; fit hanya di train.</p>
<p><strong>Contoh nyata:</strong> Audit fitur.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Fitur dari <strong>hipotesis domain</strong>.</li><li>Kualitas &gt; kuantitas; tiap fitur bisa dijelaskan.</li><li>Scaling untuk jarak/gradien; tree tak butuh.</li><li>Fit hanya di train. Curigai akurasi 99%+.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Fitur Skor Kredit (45+ mnt)</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Bangun fitur untuk prediksi 'macet dalam 12 bulan' dari data transaksi + nasabah. Prediksi dibuat <strong>saat pencairan</strong>.</p><p><strong>Tugas:</strong> (1) Daftar 10 fitur (4 keluarga). (2) Untuk tiap fitur: tandai <strong>aman/bocor</strong> + alasan. (3) Pilih 5 terbaik + jelaskan.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>Contoh fitur:</strong> ① trx_n_90d (aman: histori) ② rata-rata DPD histori (aman) ③ utilisasi (aman) ④ umur rekening (aman) ⑤ <strong>DPD saat ini</strong> (AMAN jika &gt;0 saat cair? <strong>BOCOR</strong> jika nasabah baru!) ⑥ <strong>total denda dibayar</strong> (bocor: masa depan!) ⑦ jam trx rata-rata (aman) ⑧ kota (aman, one-hot) ⑨ <strong>'pernah macet'</strong> (bocor: itu target!) ⑩ tren trx (aman).</p><p><strong>Pelajaran:</strong> audit leakage = <strong>simulasi waktu</strong>: 'apa yang diketahui <em>saat pencairan</em>?' Tulis tanggal observasi untuk tiap fitur. Inilah disiplin yang membedakan model kertas vs model produksi.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Encoding: kota (10 kategori) untuk logistic regression. One-hot vs ordinal — mana? Mengapa?</li>
              <li>Scaling: kapan <code className="inline">StandardScaler</code> <em>wajib</em>? Kapan tidak perlu?</li>
              <li>Fitur <code className="inline">rata_rata_dpd_12_bulan</code> untuk prediksi bulan depan. Termasuk leakage? Jelaskan.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>One-hot</strong>: kota = nominal (tidak ada urutan!) — ordinal encoding menciptakan urutan palsu (Surabaya &gt; Jakarta?) yang model linear akan &ldquo;percaya&rdquo;. Kecuali tree-based yang lebih toleran, one-hot untuk nominal.</p>
              <p><strong>2.</strong> Wajib untuk model berbasis <em>jarak/gradien</em> (kNN, SVM, neural net, regresi terregularisasi): fitur 0–1 vs 0–1jt mendominasi. Tidak perlu untuk <strong>tree-based</strong> (split tidak peduli skala).</p>
              <p><strong>3.</strong> <strong>Tidak leakage</strong> — <em>asal</em> 12 bulannya berakhir <em>sebelum</em> bulan prediksi (pakai shift!). Jika mencakup bulan prediksi/target → leakage. Aturan: fitur = fungsi dari masa lalu saja (D7!).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>4 keluarga:</strong> agregat, rasio, waktu, kategorikal — dari hipotesis domain.</li><li><strong>Encoding:</strong> one-hot (kecil); <strong>scaling:</strong> untuk jarak/gradien.</li><li><strong>Leakage:</strong> point-in-time; fit hanya di train; curigai 99%+.</li><li>Kualitas &gt; kuantitas; tiap fitur bisa dijelaskan.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d9-eda" className="btn btn-secondary btn-sm">← ← D9</Link>
        <Link href="/learn/d11-scipy-statsmodels" className="btn btn-primary btn-sm">Next: D11 →</Link>
      </div>
    </div>
  );
}
