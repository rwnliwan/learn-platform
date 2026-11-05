import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B6DistribusiDiskret2Page() {
  const chart1 = [{"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "y": [0.0183, 0.0733, 0.1465, 0.1954, 0.1954, 0.1563, 0.1042, 0.0595, 0.0298, 0.0132, 0.0053, 0.0019, 0.0006], "type": "bar", "marker": {"color": "#34a853"}, "name": "Poisson(4)"}, {"x": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "y": [0.0182, 0.073, 0.1464, 0.1956, 0.1958, 0.1566, 0.1043, 0.0595, 0.0297, 0.0131, 0.0052, 0.0019, 0.0006], "type": "scatter", "mode": "markers", "marker": {"color": "#e8a838", "size": 8}, "name": "Binomial(1000, 0.004)"}];
  const chart2 = [{"x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], "y": [0.1, 0.09, 0.081, 0.0729, 0.0656, 0.059, 0.0531, 0.0478, 0.043, 0.0387, 0.0349, 0.0314, 0.0282, 0.0254, 0.0229, 0.0206, 0.0185, 0.0167, 0.015, 0.0135], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Geometrik(0.1)"}];
  const lab1Code = String.raw`import random, math, statistics
random.seed(44)
lam = 4
N = 100000

def poisson_one(lam):
    # Knuth: cacah sampai produk uniform < e^-lam
    L, k, p = math.exp(-lam), 0, 1.0
    while p > L:
        k += 1; p *= random.random()
    return k - 1

xs = [poisson_one(lam) for _ in range(N)]
print(f"mean sampel    = {statistics.mean(xs):.3f} (teori {lam})")
print(f"varians sampel = {statistics.pvariance(xs):.3f} (teori {lam})")
print()
for k in [0, 2, 4, 6, 10]:
    emp = sum(1 for x in xs if x == k) / N
    teo = lam**k * math.exp(-lam) / math.factorial(k)
    print(f"k={k:>2}: simulasi {emp:.4f} vs teori {teo:.4f}")
print("\nCoba: lam=0.5 (kejadian sangat langka). P(0) berapa?")`;
  const lab2Code = String.raw`import random
random.seed(17)
p, N = 0.1, 200000
xs = []
for _ in range(N):
    k = 1
    while random.random() >= p:
        k += 1
    xs.append(k)

def P_gt(t):
    return sum(1 for x in xs if x > t) / N

print(f"P(X>5)          = {P_gt(5):.4f}  (teori 0.9^5 = {0.9**5:.4f})")
cond = sum(1 for x in xs if x > 15) / sum(1 for x in xs if x > 10)
print(f"P(X>15 | X>10)  = {cond:.4f}")
print("SAMA! Sudah gagal 10x tidak mengubah peluang 5 percobaan berikutnya.")
print("Coba: p=0.5. Apakah tetap berlaku? (harusnya ya - sifat umum)")`;
  const quizData = [{"question": "Poisson(λ=4): yang benar…", "options": ["E=4, Var=16", "E=4, Var=4", "E=2, Var=4", "E=16, Var=4"], "correct": 1, "explanation": "Benar: ciri Poisson — mean = varians = λ."}, {"question": "Data klaim: mean=4, varians=11. Kesimpulan?", "options": ["Poisson cocok", "Overdispersi — pertimbangkan Negatif Binomial", "Data salah", "Pakai Binomial"], "correct": 1, "explanation": "Benar: varians >> mean = overdispersi (heterogenitas). Poisson murni akan meremehkan ekor."}, {"question": "Geometrik(0,1): sudah gagal 9x. Peluang sukses di percobaan ke-10?", "options": ["Lebih dari 10%", "Tetap 10% (memoryless)", "Kurang dari 10%", "100%"], "correct": 1, "explanation": "Benar: memoryless — koin tak punya ingatan. Sunk cost fallacy adalah mengira peluang naik."}, {"question": "&ldquo;Berapa nasabah dihubungi sampai 3 setuju&rdquo; (p=20%) → distribusi?", "options": ["Binomial", "Poisson", "Negatif Binomial (r=3)", "Normal"], "correct": 2, "explanation": "Benar: &ldquo;sampai r sukses&rdquo; = Negatif Binomial. E = r/p = 15 nasabah."}, {"question": "Aproksimasi Poisson untuk Binomial butuh…", "options": ["n besar saja", "p kecil saja", "n besar DAN p kecil (np moderat)", "n = p"], "correct": 2, "explanation": "Benar: keduanya. n=1000, p=0,4 → varians beda jauh (240 vs 400) — aproksimasi gagal."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B6 (Part 2) — Probabilitas</span>
        <h1 className="display-title">Distribusi Diskret (2):<br/>Poisson, Geometrik &amp; Negatif Binomial</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Berapa Klaim Bulan Depan?</a></li>
          <li><a href="#poisson">Poisson — Menghitung Kejadian per Periode</a></li>
          <li><a href="#geo">Geometrik — Menunggu Sukses Pertama</a></li>
          <li><a href="#negbin">Negatif Binomial — Sampai Sukses ke-r</a></li>
          <li><a href="#lab1">🔬 Lab 1: Klaim Asuransi — Poisson Bekerja</a></li>
          <li><a href="#lab2">🔬 Lab 2: Memoryless — Koin Tak Punya Ingatan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Empat Distribusi Diskret</a></li>
          <li><a href="#case">📋 Mini-Case: Kapasitas Tim Investigasi Fraud</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>Poisson</strong> sebagai &ldquo;Binomial untuk n besar, p kecil&rdquo; + menghitungnya.</li><li>Membedakan <strong>Geometrik</strong> (&ldquo;sampai sukses pertama&rdquo;) vs <strong>Negatif Binomial</strong> (&ldquo;sampai sukses ke-r&rdquo;).</li><li>Memakai sifat <strong>memoryless</strong> Geometrik dengan benar.</li><li>Memilih distribusi yang tepat untuk soal &ldquo;jumlah per periode&rdquo; vs &ldquo;waktu tunggu&rdquo;.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Berapa Klaim Bulan Depan?</h2>

      <div className="story"><p>Aktuaris asuransi ditanya: <em>&ldquo;Berapa klaim mobil bulan depan?&rdquo;</em> Ia tidak bisa pakai Binomial — <strong>n-nya tidak jelas</strong> (berapa &ldquo;percobaan&rdquo; dalam sebulan?). Yang ia tahu: rata-rata <strong>4 klaim/bulan</strong>.</p><p>Distribusi Poisson menjawab dengan satu parameter: <Tex math={String.raw`\lambda`} /> = rata-rata per periode. P(0 klaim) = e^(−4) ≈ 1,8%, P(10 klaim) ≈ 0,5% — peta lengkap tanpa perlu tahu n.</p><p>Dan ketika sales bertanya <em>&ldquo;berapa nasabah harus dihubungi sampai dapat 1 yang setuju?&rdquo;</em> — itu bukan soal &ldquo;jumlah dalam n tetap&rdquo;, melainkan <strong>waktu tunggu</strong>: wilayah Geometrik.</p><p><strong>Twist-nya:</strong> Poisson memetakan seluruh distribusi hanya dari SATU angka (rata-rata) — terdengar seperti sihir, dan memang nyaris sihir: <em>jika</em> asumsinya benar (varians = mean). Jika data tidak Poisson, peta itu salah total. Satu parameter = satu asumsi yang wajib dicek. Kekuatan terbesar distribusi ini — kesederhanaannya — adalah juga sumber kebohongan terbesarnya.</p></div>

      <h2 id="poisson">Poisson — Menghitung Kejadian per Periode</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Poisson}(\lambda)`} />: jumlah kejadian dalam periode/wilayah tetap, dengan rata-rata <Tex math={String.raw`\lambda`} />.</p>

      <p><Tex math={String.raw`P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}, \quad k = 0,1,2,\ldots`} block /></p>

      <ul>
<li><Tex math={String.raw`E[X] = \lambda`} /> dan <Tex math={String.raw`\mathrm{Var}(X) = \lambda`} /> — <strong>mean = varians!</strong> (ciri khas Poisson)</li>
<li><Tex math={String.raw`e \approx 2{,}718`} />: bilangan Euler.</li>
</ul>

      <p><strong>Asal-usul:</strong> limit Binomial saat <Tex math={String.raw`n \to \infty,\ p \to 0`} /> dengan <Tex math={String.raw`np = \lambda`} /> tetap. Intuisi: periode dibagi jadi slot super-kecil, tiap slot peluang kejadian super-kecil.</p>

      <p><strong>Kapan memakai:</strong> klaim/bulan, fraud/hari, kedatangan nasabah/jam, cacat per batch — <em>kejadian per satuan waktu/ruang</em> dengan n implisit.</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Klaim <Tex math={String.raw`\lambda=4`} />/bulan. P(tepat 6 klaim)?</p><p><Tex math={String.raw`P(X=6) = \frac{4^6 \cdot e^{-4}}{6!} = \frac{4096 \times 0{,}0183}{720} \approx 0{,}104`} /> ≈ <strong>10,4%</strong>.</p><p>P(tidak ada klaim) = e^(−4) ≈ 1,8% — bulan tanpa klaim itu langka!</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Poisson = Binomial dengan n besar, jadi selalu bisa saling ganti.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika p kecil juga (np = λ moderat). Jika p=0,4 dan n=1000, Binomial(1000; 0,4) ≠ Poisson(400): varians Binomial = 240, Poisson = 400 — beda jauh! Aproksimasi butuh p kecil (aturan praktis: n ≥ 100, p ≤ 0,05).</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Mean = varians selalu berlaku.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya untuk Poisson murni! Data klaim nyata sering <strong>overdispersi</strong> (varians &gt; mean) karena heterogenitas — solusinya Negatif Binomial (campuran Poisson-Gamma, lihat bawah) — atau model campuran. Cek rasio varians/mean dulu sebelum pakai Poisson.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tes cepat Poisson: hitung mean dan varians sampel. Rasio ≈ 1 → Poisson cocok. Rasio &gt;&gt; 1 → overdispersi → Negatif Binomial. Rasio &lt;&lt; 1 → underdispersi (jarang, misal data terkontrol ketat).</p>
</div>

      <h2 id="geo">Geometrik — Menunggu Sukses Pertama</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{Geometrik}(p)`} />: banyak percobaan <strong>sampai sukses pertama</strong> (termasuk percobaannya).</p>

      <p><Tex math={String.raw`P(X=k) = (1-p)^{k-1}\,p, \quad k = 1,2,\ldots`} block /></p>

      <ul>
<li><Tex math={String.raw`E[X] = 1/p`} /> — peluang setuju 10% → ekspektasi hubungi 10 nasabah.</li>
<li><Tex math={String.raw`\mathrm{Var}(X) = (1-p)/p^2`} />.</li>
</ul>

      <p><strong>Sifat memoryless</strong> (ajaib &amp; khas):</p>

      <p><Tex math={String.raw`P(X > m+n \mid X > m) = P(X > n)`} block /></p>

      <p>&ldquo;Sudah gagal 9x tidak mengubah peluang sukses di percobaan ke-10&rdquo; — koin tidak punya ingatan. <strong>Hanya</strong> berlaku untuk Geometrik (diskret) &amp; Eksponensial (kontinu, B7.1).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Bedakan: Binomial menjawab &ldquo;berapa sukses dari n tetap&rdquo;; Geometrik menjawab &ldquo;berapa percobaan sampai 1 sukses&rdquo;. Kata kuncinya: <strong>&ldquo;sampai&rdquo;</strong> → Geometrik/NegBin; <strong>&ldquo;dari n&rdquo;</strong> → Binomial.</p>
</div>

      <h2 id="negbin">Negatif Binomial — Sampai Sukses ke-r</h2>

      <p><strong>Definisi.</strong> <Tex math={String.raw`X \sim \mathrm{NB}(r,p)`} />: banyak percobaan sampai sukses <strong>ke-r</strong>.</p>

      <p><Tex math={String.raw`P(X=k) = \binom{k-1}{r-1}\, p^r\, (1-p)^{k-r}, \quad E[X] = \frac{r}{p}`} block /></p>

      <p><strong>Dua peran penting:</strong></p>

      <ul>
<li><strong>Waktu tunggu:</strong> &ldquo;berapa nasabah dihubungi sampai 3 setuju&rdquo; (r=3).</li>
<li><strong>Poisson overdispersi:</strong> NB sebagai campuran Poisson–Gamma — model standar untuk <em>count data</em> dengan varians &gt; mean (klaim asuransi, jumlah pembelian). Ini alasan NB ada di semua software statistik.</li>
</ul>

      <p><strong>Kepribadian:</strong> Negatif Binomial adalah &ldquo;Poisson yang jujur tentang heterogenitas&rdquo; — ia mengakui bahwa tiap nasabah punya λ berbeda.</p>

      <PlotlyChart
  data={chart1}
  title="Poisson(4) vs Binomial(1000; 0,004): Hampir Identik"
  layout={{"xaxis": {"title": "k"}, "yaxis": {"title": "P(X=k)"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang hijau = Poisson(4); titik kuning = Binomial(1000; 0,004) — np = 4 sama.</p>
<p><strong>Interpretasi:</strong> Hampir tidak bisa dibedakan! Inilah aproksimasi Poisson bekerja: n besar + p kecil. <strong>Implikasi praktis:</strong> untuk kejadian langka (fraud, klaim), pakai Poisson(λ) yang sederhana — tidak perlu tahu n.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Geometrik(0,1): Peluang Menunggu k Percobaan"
  layout={{"xaxis": {"title": "k = percobaan ke-"}, "yaxis": {"title": "P(X=k)"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = sukses pertama terjadi di percobaan ke-k; tinggi batang = peluangnya.</p>
<p><strong>Interpretasi:</strong> Selalu menurun eksponensial — hasil <em>paling mungkin</em> adalah sukses langsung (k=1), tapi <strong>ekspektasi = 10</strong> (ekor panjang menarik rata-rata!). Pelajaran: &ldquo;rata-rata 10x percobaan&rdquo; bukan berarti menunggu 10x itu tipikal — mediannya cuma ~7. Distribusi waktu-tunggu selalu miring kanan.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Poisson = &ldquo;berapa kejadian per periode&rdquo;; Geometrik = &ldquo;berapa lama menunggu&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Kapasitas call center</summary>
              <p>Rata-rata 4 klaim/bulan (Poisson, λ = 4). Tim bisa menangani 7 klaim/bulan. Berapa peluang kewalahan (&gt; 7)?</p>
              <p><strong>Langkah 1</strong> — P(X &gt; 7) = 1 − P(X ≤ 7) = 1 − Σ<sub>k=0</sub><sup>7</sup> e<sup>−4</sup>4<sup>k</sup>/k!.<br />
              <strong>Langkah 2</strong> — P(X≤7): k=0: 0,0183; 1: 0,0733; 2: 0,1465; 3: 0,1954; 4: 0,1954; 5: 0,1563; 6: 0,1042; 7: 0,0595. Jumlah ≈ <strong>0,9489</strong>.<br />
              <strong>Langkah 3</strong> — P(kewalahan) = 1 − 0,9489 = <strong>5,1%</strong> — sekitar 1 bulan kewalahan per 20 bulan.</p>
              <p>Pelajaran: &ldquo;rata-rata 4, kapasitas 7&rdquo; terdengar aman — tapi 5% bulan kewalahan. Poisson mengubah &ldquo;rata-rata&rdquo; menjadi &ldquo;frekuensi kejadian buruk&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Sales — berapa telepon sampai deal pertama?</summary>
              <p>Tiap telepon deal dengan peluang 10% (independen). Berapa peluang deal pertama datang <em>setelah</em> telepon ke-10? Berapa ekspektasi jumlah telepon?</p>
              <p><strong>Langkah 1</strong> — Geometrik: P(X &gt; 10) = (1−p)<sup>10</sup> = 0,9<sup>10</sup> ≈ <strong>34,9%</strong>.<br />
              <strong>Langkah 2</strong> — E[X] = 1/p = <strong>10 telepon</strong>.<br />
              <strong>Langkah 3</strong> — baca: ekspektasi 10, tapi 35% butuh <em>lebih</em> dari 10! Distribusi miring kanan — median (7) &lt; mean (10).</p>
              <p>Pelajaran: untuk waktu tunggu, mean menipu (ditarik ekor kanan). Untuk target operasional (&ldquo;90% sales dapat deal dalam X telepon&rdquo;), pakai kuantil, bukan mean.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Memoryless — koin tak punya ingatan</summary>
              <p>Sudah 9 telepon gagal (p = 10%). Berapa peluang 3 telepon berikutnya juga gagal?</p>
              <p><strong>Langkah 1</strong> — intuisi salah: &ldquo;sudah 9 gagal, pasti segera deal&rdquo; (gambler's fallacy).<br />
              <strong>Langkah 2</strong> — Geometrik bersifat memoryless: P(gagal 3 lagi | sudah 9 gagal) = P(gagal 3) = 0,9<sup>3</sup> = <strong>72,9%</strong>.<br />
              <strong>Langkah 3</strong> — telepon ke-10 punya peluang deal <em>tetap</em> 10% — sama seperti telepon pertama.</p>
              <p>Pelajaran: &ldquo;sudah lama menunggu&rdquo; tidak menaikkan peluang sukses — kecuali p-nya sendiri berubah (learning!). Bedakan &ldquo;proses memoryless&rdquo; dari &ldquo;proses dengan learning&rdquo;.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Klaim Asuransi — Poisson Bekerja</h2>

      <p>λ=4 klaim/bulan. Simulasikan 1.000 bulan, bandingkan frekuensi vs rumus Poisson. Cek juga mean vs varians.</p>

      <PyodideLab
  title="Lab 1 — Simulasi Klaim Bulanan"
  hint="Perhatikan mean ≈ varians — sidik jari Poisson. Data dengan varians >> mean butuh Negatif Binomial."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Memoryless — Koin Tak Punya Ingatan</h2>

      <p>Geometrik(p=0,1): bandingkan P(X&gt;15 | X&gt;10) vs P(X&gt;5). Harusnya sama!</p>

      <PyodideLab
  title="Lab 2 — Buktikan Sifat Memoryless"
  hint="Memoryless = alasan &amp;ldquo;mesin slot yang sudah lama tidak jackpot&amp;rdquo; tetap peluang sama. Jangan tertipu sunk cost."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Empat Distribusi Diskret</h2>

      <div className="decision-card">
<h3>1. &ldquo;Berapa sukses dari n tetap&rdquo; → <strong>Binomial</strong></h3>
<p><strong>Kondisi data:</strong> n diketahui, p sama, independen.</p>
<p><strong>Kenapa:</strong> Jumlah n Bernoulli.</p>
<p><strong>Contoh nyata:</strong> Gagal bayar dari 1.000 nasabah.</p>
</div>

      <div className="decision-card">
<h3>2. &ldquo;Berapa kejadian per periode&rdquo; → <strong>Poisson</strong></h3>
<p><strong>Kondisi data:</strong> n implisit/tak jelas; hanya tahu rata-rata λ.</p>
<p><strong>Kenapa:</strong> Limit Binomial (n besar, p kecil). Cek mean ≈ varians.</p>
<p><strong>Contoh nyata:</strong> Klaim/bulan, fraud/hari, telepon masuk/jam.</p>
</div>

      <div className="decision-card">
<h3>3. &ldquo;Berapa percobaan sampai 1 sukses&rdquo; → <strong>Geometrik</strong></h3>
<p><strong>Kondisi data:</strong> Waktu tunggu sukses pertama.</p>
<p><strong>Kenapa:</strong> Memoryless — masa lalu tak relevan.</p>
<p><strong>Contoh nyata:</strong> Nasabah dihubungi sampai 1 setuju.</p>
</div>

      <div className="decision-card">
<h3>4. &ldquo;Sampai r sukses&rdquo; / count overdispersi → <strong>Negatif Binomial</strong></h3>
<p><strong>Kondisi data:</strong> Butuh r sukses, atau varians count &gt; mean.</p>
<p><strong>Kenapa:</strong> Generalisasi Geometrik; campuran Poisson-Gamma untuk heterogenitas.</p>
<p><strong>Contoh nyata:</strong> Sampai 3 nasabah setuju; jumlah klaim antar nasabah heterogen.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Dengar <strong>&ldquo;dari n&rdquo;</strong> → Binomial. <strong>&ldquo;per periode&rdquo;</strong> → Poisson. <strong>&ldquo;sampai&rdquo;</strong> → Geometrik/NB.</li><li>Poisson: cek mean ≈ varians. Jauh beda → Negatif Binomial.</li><li>Waktu tunggu selalu miring kanan — jangan pakai mean sebagai &ldquo;tipikal&rdquo;.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Kapasitas Tim Investigasi Fraud</h2>

      <div className="callout">
<p>Tim fraud menerima rata-rata λ = 6 alert/hari (Poisson). Tiap investigator menangani 1 alert/jam. Saat ini 8 investigator/shift.</p><p><strong>Pertanyaan:</strong> (a) P(alert &gt; 8 dalam 1 jam)? (b) Berapa investigator agar P(kewalahan) &lt; 5%?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) P(X &gt; 8) = 1 − P(X ≤ 8) ≈ 1 − 0,847 = <strong>15,3%</strong> — cukup sering kewalahan!</p><p>(b) Cari k terkecil dengan P(X &gt; k) &lt; 5%: k=10 → P ≈ 4,2%. Jadi <strong>11 investigator</strong> (10 + buffer). <strong>Pelajaran:</strong> kapasitas berbasis <em>rata-rata</em> (6) gagal 15% waktu; kapasitas berbasis <em>distribusi</em> (11) gagal &lt;5%. Inilah &ldquo;staffing by distribution, not by mean&rdquo; — dipakai di call center (Erlang), RS, dan tim fraud.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Server menerima rata-rata 6 request/detik (Poisson). Berapa peluang tepat 6 request dalam satu detik? Berapa peluang 0 request?</li>
              <li>Dadu: berapa peluang angka 6 pertama muncul pada lemparan ke-4? Berapa ekspektasi lemparan sampai 6 pertama?</li>
              <li>Butuh 3 sukses (p = 0,2 per percobaan). Berapa ekspektasi jumlah percobaan sampai sukses ke-3? (Negatif Binomial.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> P(X=6) = e<sup>−6</sup>6<sup>6</sup>/6! ≈ <strong>16,1%</strong>. P(X=0) = e<sup>−6</sup> ≈ <strong>0,25%</strong>.</p>
              <p><strong>2.</strong> P(X=4) = (5/6)<sup>3</sup>(1/6) = 125/1296 ≈ <strong>9,6%</strong>. E[X] = 1/(1/6) = <strong>6 lemparan</strong>.</p>
              <p><strong>3.</strong> E[X] = r/p = 3/0,2 = <strong>15 percobaan</strong>.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Poisson(λ):</strong> kejadian per periode; <Tex math={String.raw`P(X=k)=\lambda^k e^{-\lambda}/k!`} />; mean = varians = λ.</li><li><strong>Geometrik(p):</strong> tunggu sukses pertama; E=1/p; <strong>memoryless</strong>.</li><li><strong>Negatif Binomial:</strong> tunggu sukses ke-r; juga untuk count overdispersi.</li><li><strong>&ldquo;Dari n&rdquo; → Binomial; &ldquo;per periode&rdquo; → Poisson; &ldquo;sampai&rdquo; → Geometrik/NB.</strong></li><li><strong>Jangan</strong> pakai rata-rata untuk kapasitas — pakai distribusi (staffing by distribution).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b6-distribusi-diskret-1" className="btn btn-secondary btn-sm">← ← B6.1</Link>
        <Link href="/learn/b7-distribusi-kontinu-1" className="btn btn-primary btn-sm">Next: B7.1 →</Link>
      </div>
    </div>
  );
}
