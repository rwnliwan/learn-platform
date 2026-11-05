import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B13VasicekPage() {
  const chart1 = [{"x": [1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0, 5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8, 9.0], "y": [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.002, 0.004, 0.01, 0.021, 0.042, 0.077, 0.131, 0.205, 0.297, 0.395, 0.484, 0.547, 0.57, 0.547, 0.484, 0.395, 0.297, 0.205, 0.131, 0.077, 0.042, 0.021, 0.01, 0.004, 0.002, 0.001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "type": "scatter", "mode": "lines", "name": "ρ=0 (sempit)", "line": {"color": "#2a7de1"}}, {"x": [0.0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 4.8, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2, 7.6, 8.0, 8.4, 8.8, 9.2, 9.6, 10.0, 10.4, 10.8, 11.2, 11.6, 12.0, 12.4, 12.8, 13.2, 13.6, 14.0, 14.4, 14.8, 15.2, 15.6, 16.0, 16.4, 16.8, 17.2, 17.6, 18.0, 18.4, 18.8, 19.2, 19.6, 20.0], "y": [0.024, 0.032, 0.042, 0.053, 0.065, 0.079, 0.093, 0.107, 0.121, 0.133, 0.142, 0.149, 0.153, 0.153, 0.149, 0.142, 0.133, 0.121, 0.107, 0.093, 0.079, 0.065, 0.053, 0.042, 0.032, 0.024, 0.018, 0.013, 0.009, 0.006, 0.004, 0.003, 0.002, 0.001, 0.001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], "type": "scatter", "mode": "lines", "name": "ρ=0,3 (melebar)", "line": {"color": "#ef4444"}}];
  const lab1Code = String.raw`import random, math, statistics
random.seed(131)

def sim_vasicek(n, pd, rho, trials=2000):
    ambang = statistics.NormalDist().inv_cdf(pd)
    sr, s1r = math.sqrt(rho), math.sqrt(1-rho)
    hasil = []
    for _ in range(trials):
        Y = random.gauss(0, 1)  # faktor sistemik: SATU per trial
        gagal = sum(1 for _ in range(n)
                    if sr*Y + s1r*random.gauss(0, 1) < ambang)
        hasil.append(gagal)
    return hasil

n, pd = 200, 0.05
for rho in [0.0, 0.15, 0.3]:
    h = sim_vasicek(n, pd, rho)
    h.sort()
    print(f"ρ={rho}: mean={statistics.mean(h):.0f}, VaR99%={h[int(0.99*len(h))]}, VaR99.9%={h[int(0.999*len(h))]}")
print("\nMean sama (~50), tapi VaR meledak dengan ρ!")
print("Coba: rho=0.5. Berapa VaR99.9%?")`;
  const lab2Code = String.raw`import math, statistics
ND = statistics.NormalDist()
pd, rho, alpha = 0.02, 0.15, 0.999
q = ND.cdf((ND.inv_cdf(pd) + math.sqrt(rho)*ND.inv_cdf(alpha)) / math.sqrt(1-rho))
print(f"Rumus: q_99.9% = {q:.2%}")
print(f"Contoh: {q:.2%} dari 10.000 debitur = {q*10000:.0f} gagal (ekspektasi cuma 200!)")
print()
# sensitivitas terhadap rho
for r in [0.05, 0.12, 0.15, 0.24, 0.4]:
    qq = ND.cdf((ND.inv_cdf(pd) + math.sqrt(r)*ND.inv_cdf(alpha)) / math.sqrt(1-r))
    print(f"  ρ={r:.2f} -> VaR99.9% = {qq:.2%}  (modal ∝ ini!)")
print("\nKesimpulan: modal SANGAT sensitif terhadap ρ.")
print("Salah estimasi ρ sedikit -> modal salah besar. Itulah mengapa ρ di-stress.")`;
  const quizData = [{"question": "Dalam Vasicek, Y (faktor sistemik) berperan sebagai…", "options": ["Nasib individual tiap debitur", "Ekonomi bersama yang menggerakkan semua debitur", "Tingkat bunga", "Jumlah debitur"], "correct": 1, "explanation": "Benar: Y sama untuk semua — sumber korelasi. εᵢ individual independen."}, {"question": "Vasicek mengubah ekspektasi kerugian portofolio?", "options": ["Ya, menaikkan", "Tidak — hanya distribusinya (ekor menggemuk)", "Ya, menurunkan", "Menghapusnya"], "correct": 1, "explanation": "Benar: linearitas B5 — E[loss] tetap. Yang naik: VaR/modal (unexpected loss)."}, {"question": "PD=2%, ρ=0,15: VaR 99,9% ≈ 17,9% vs ekspektasi 2%. Artinya…", "options": ["Model salah", "Ekor 9x mean — modal melindungi dari korelasi, bukan dari rata-rata", "PD sebenarnya 17,9%", "Tidak mungkin"], "correct": 1, "explanation": "Benar: inilah inti modal kredit — unexpected loss dari korelasi."}, {"question": "Kelemahan struktural Vasicek terkait B10…", "options": ["Terlalu rumit", "Struktur Gaussian tanpa tail dependence", "Tidak ada rumus", "Butuh data besar"], "correct": 1, "explanation": "Benar: seperti copula Gaussian — krisis ekstrem bisa lebih bergerombol."}, {"question": "ρ naik. Yang terjadi pada modal (VaR−ekspektasi)?", "options": ["Turun", "Naik — ekor menggemuk", "Tetap", "Nol"], "correct": 1, "explanation": "Benar: modal ∝ ekor ∝ ρ. Salah estimasi ρ = salah modal besar."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B13 — Probabilitas</span>
        <h1 className="display-title">Vasicek: Satu Faktor yang<br/>Menggerakkan Ribuan Kredit</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Mengapa 5% × 1.000 ≠ 50 Gagal?</a></li>
          <li><a href="#model">Model Satu Faktor — Anatomi</a></li>
          <li><a href="#distribusi">Distribusi Kerugian Portofolio</a></li>
          <li><a href="#batas">Batas-batas yang Jujur</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Vasicek — Lihat Ekor Menggemuk</a></li>
          <li><a href="#lab2">🔬 Lab 2: Verifikasi Rumus Kuantil Vasicek</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Vasicek</a></li>
          <li><a href="#case">📋 Mini-Case: Kalibrasi ρ dari Data</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>model satu faktor Vasicek</strong>: faktor sistemik + idiosinkratik.</li><li>Menurunkan <strong>distribusi kerugian portofolio</strong> dan rumus kuantilnya (VaR kredit).</li><li>Menghubungkan Vasicek ke <strong>korelasi aset</strong> <Tex math={String.raw`\rho`} /> dan copula Gaussian (B10).</li><li>Menjelaskan peran Vasicek di <strong>Basel IRB</strong> (rumus modal) + batas-batasnya.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Mengapa 5% × 1.000 ≠ 50 Gagal?</h2>

      <div className="story"><p>B1 mengajarkan: 1.000 nasabah × PD 5% (independen) → ekspektasi 50 gagal, SD 6,9. Kenyataannya saat krisis 2008: <strong>200 gagal</strong> — 22 SD di atas mean! Model Binomial bilang &ldquo;mustahil&rdquo;.</p><p>Yang salah: <strong>asumsi independen</strong>. Saat ekonomi runtuh, nasabah gagal <em>bareng</em> — ada <strong>faktor bersama</strong> (ekonomi makro) yang menggerakkan semua. Model Vasicek (1987) menangkap ini dengan satu faktor sistemik: tiap debitur punya &ldquo;kesehatan&rdquo; = campuran faktor ekonomi umum + nasib individual.</p><p>Model ini begitu fundamental hingga menjadi <strong>basis rumus modal Basel II/III</strong> — setiap bank di dunia memakainya (atau variannya).</p><p><strong>Twist-nya:</strong> Binomial bilang 200 gagal &ldquo;mustahil&rdquo; (22 standar deviasi!) — tapi ia terjadi. Yang mustahil bukan kejadiannya, melainkan <em>modelnya</em>. Vasicek tidak &ldquo;lebih pintar&rdquo; — ia hanya berhenti berpura-pura bahwa nasabah gagal independen saat ekonomi runtuh. Satu asumsi yang dibuang (independensi) mengubah &ldquo;mustahil&rdquo; menjadi &ldquo;wajar&rdquo;.</p></div>

      <h2 id="model">Model Satu Faktor — Anatomi</h2>

      <p>Nilai aset (laten) debitur <Tex math={String.raw`i`} />:</p>

      <p><Tex math={String.raw`X_i = \sqrt{\rho}\,Y + \sqrt{1-\rho}\,\varepsilon_i`} block /></p>

      <ul>
<li><Tex math={String.raw`Y \sim N(0,1)`} />: <strong>faktor sistemik</strong> — ekonomi, sama untuk semua debitur.</li>
<li><Tex math={String.raw`\varepsilon_i \sim N(0,1)`} />: <strong>idiosinkratik</strong> — nasib individual, independen antar debitur.</li>
<li><Tex math={String.raw`\rho`} />: <strong>korelasi aset</strong> — seberapa besar ekonomi menentukan nasib (0 = murni individual, 1 = semua bareng).</li>
</ul>

      <p>Default jika <Tex math={String.raw`X_i`} /> jatuh di bawah ambang:</p>

      <p><Tex math={String.raw`\text{default} \iff X_i < \Phi^{-1}(PD)`} block /></p>

      <p>dengan <Tex math={String.raw`\Phi^{-1}`} /> = inverse cdf Normal. <strong>Mengapa ambang ini?</strong> Karena <Tex math={String.raw`P(X_i < \Phi^{-1}(PD)) = PD`} /> — konsisten dengan PD individual!</p>

      <p><strong>Kepribadian:</strong> Vasicek adalah &ldquo;orkestra satu dirigen&rdquo; — Y adalah dirigen (ekonomi), tiap debitur main notnya sendiri (<Tex math={String.raw`\varepsilon_i`} />) tapi mengikuti tempo dirigen sebesar √ρ.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Perhatikan: <Tex math={String.raw`\sqrt{\rho}`} /> dan <Tex math={String.raw`\sqrt{1-\rho}`} /> memastikan Var(Xᵢ) = ρ + (1−ρ) = 1 — Xᵢ tetap Normal(0,1) marginal. Model ini <em>tidak mengubah</em> risiko individual (PD tetap!), hanya menambahkan <strong>korelasi</strong>. Elegan: satu parameter ρ mengubah segalanya.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Vasicek menaikkan ekspektasi kerugian.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak! E[loss] = PD × LGD × EAD tetap — sama seperti independen (linearitas B5). Yang berubah: <strong>distribusi</strong> kerugian — ekor kanan menggemuk. Modal (yang melindungi dari ekor) naik, ekspektasi tidak. Inilah beda &ldquo;expected loss&rdquo; vs &ldquo;unexpected loss&rdquo; (CR3).</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Korelasi aset (ρ) = korelasi default.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Beda! ρ di Vasicek adalah korelasi <strong>nilai aset laten</strong> <Tex math={String.raw`(X_i)`} /> — variabel kontinu yang selalu teramati dalam model. <strong>Korelasi default</strong> (korelasi indikator biner gagal/tidak) jauh lebih kecil dan tergantung PD: untuk PD=2%, ρ_aset=0,15 setara korelasi default hanya ~0,02! Mencampuradukkan keduanya = salah mengira &ldquo;default hampir independen&rdquo; padahal ρ_aset signifikan. Selalu tanyakan: korelasi <em>apa</em>?</p>
</div>

      <h2 id="distribusi">Distribusi Kerugian Portofolio</h2>

      <p>Bersyarat pada Y (ekonomi diketahui), default antar debitur <strong>independen</strong> dengan:</p>

      <p><Tex math={String.raw`p(Y) = P(\text{default} \mid Y) = \Phi\!\left(\frac{\Phi^{-1}(PD) - \sqrt{\rho}\,Y}{\sqrt{1-\rho}}\right)`} block /></p>

      <p>Untuk portofolio besar homogen (LLN!), fraksi default → <Tex math={String.raw`p(Y)`} />. Karena <Tex math={String.raw`Y`} /> acak, fraksi default punya <strong>distribusi</strong> — dan kuantilnya ada rumus tertutup:</p>

      <p><Tex math={String.raw`q_\alpha = \Phi\!\left(\frac{\Phi^{-1}(PD) + \sqrt{\rho}\,\Phi^{-1}(\alpha)}{\sqrt{1-\rho}}\right)`} block /></p>

      <p>Ini <strong>VaR kredit</strong>: &ldquo;dengan keyakinan α, fraksi default ≤ q_α&rdquo;. <strong>Contoh:</strong> PD=2%, ρ=0,15, α=99,9%: <Tex math={String.raw`\Phi^{-1}(0{,}02) = -2{,}05`} />, <Tex math={String.raw`\Phi^{-1}(0{,}999) = 3{,}09`} />:</p>

      <p><Tex math={String.raw`q_{99{,}9\%} = \Phi\!\left(\frac{-2{,}05 + \sqrt{0{,}15}\times 3{,}09}{\sqrt{0{,}85}}\right) = \Phi(-0{,}92) \approx 17{,}9\%`} block /></p>

      <p>Bandingkan: ekspektasi cuma 2%, tapi VaR 99,9% = <strong>17,9%</strong> — 9x lipat! Inilah mengapa modal bank besar: melindungi dari ekor korelasi.</p>

      <details className="worked">
<summary>📐 Intuisi rumus kuantil</summary>
<p>Ambil skenario ekonomi buruk: Y = −3,09 (kuantil 0,1% terburuk — ingat: Y negatif = ekonomi buruk).</p><p><Tex math={String.raw`p(Y) = \Phi\left(\frac{-2{,}05 - \sqrt{0{,}15}\times(-3{,}09)}{\sqrt{0{,}85}}\right) = \Phi\left(\frac{-2{,}05+1{,}197}{0{,}922}\right) = \Phi(-0{,}925) \approx 17{,}7\%`} />.</p><p>Di ekonomi sangat buruk, <strong>PD kondisional</strong> melonjak 2% → 17,7%. Rumus kuantil hanyalah &ldquo;balikkan&rdquo;: VaR pada keyakinan α = PD kondisional pada ekonomi seburuk kuantil 1−α. <strong>Satu faktor menghubungkan ekonomi makro ke kerugian portofolio.</strong></p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Basel IRB memakai rumus ini (dengan penyesuaian maturity & LGD) untuk menghitung <strong>modal minimum</strong>. ρ ditetapkan regulator per segmen (misal 0,12–0,24 untuk korporasi). Pahami rumus ini = pahami jantung regulasi modal kredit.</p>
</div>

      <h2 id="batas">Batas-batas yang Jujur</h2>

      <ul>
<li><strong>Struktur Gaussian</strong> (B10!): tanpa tail dependence — krisis ekstrem bisa lebih bergerombol dari prediksi.</li>
<li><strong>ρ konstan:</strong> korelasi aset berubah sepanjang siklus (correlation breakdown, B9).</li>
<li><strong>Portofolio homogen:</strong> dunia nyata heterogen (PD/LGD/EAD beda) — butuh Monte Carlo (B12) untuk yang heterogen.</li>
<li><strong>Satu faktor:</strong> ekonomi multi-dimensi (sektor, region) butuh multi-faktor.</li>
</ul>

      <p><strong>Kepribadian jujur:</strong> Vasicek adalah &ldquo;model pertama yang benar arahnya&rdquo; — ia menangkap esensi (korelasi via faktor bersama) dengan elegan, tapi jangan jadikan kitab suci. Stress ρ, uji copula alternatif, dan Monte Carlo untuk portofolio heterogen.</p>

      <PlotlyChart
  data={chart1}
  title="Distribusi Fraksi Default: ρ=0 vs ρ=0,3 (PD=5%, sketsa)"
  layout={{"xaxis": {"title": "Fraksi default (%)"}, "yaxis": {"title": "Densitas"}, "showlegend": true, "annotations": [{"x": 5, "y": 0.45, "text": "Ekspektasi TETAP 5% keduanya", "showarrow": false}]}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sketsa konseptual: dua kurva distribusi fraksi default untuk 1.000 debitur, PD=5%. Biru sempit (ρ=0), merah melebar (ρ=0,3).</p>
<p><strong>Interpretasi:</strong> Korelasi tidak menggeser pusat (ekspektasi tetap 5%!) — ia <strong>melebarkan</strong> distribusi dan <strong>menggemukkan ekor kanan</strong>. Dengan ρ=0,3, skenario &ldquo;15% gagal&rdquo; yang mustahil di model independen menjadi lumayan mungkin. <strong>Modal melindungi dari ekor — dan ekor ditentukan ρ.</strong></p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Vasicek = &ldquo;Binomial yang sadar ekonomi&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Dari independen ke korelasi — SD meledak</summary>
              <p>1.000 debitur, PD 5%. (a) Independen: SD jumlah gagal? (b) Vasicek dengan korelasi aset ρ = 0,2: berapa SD-nya? (c) P(≥ 100 gagal) di kedua model?</p>
              <p><strong>Langkah 1 (a)</strong> — Binomial: SD = √(1000×0,05×0,95) ≈ <strong>6,89</strong>.<br />
              <strong>Langkah 2 (b)</strong> — Vasicek: Var = np(1−p) + n(n−1)p(1−p)ρ ≈ 47,5 + 1000×999×0,0475×0,2 ≈ 9.538 → SD ≈ <strong>97,7</strong> — 14× lipat!<br />
              <strong>Langkah 3 (c)</strong> — Binomial: z = (100−50)/6,89 ≈ 7,3 → P ≈ 0. Vasicek: z = (100−50)/97,7 ≈ 0,51 → P ≈ <strong>30%</strong>!</p>
              <p>Pelajaran: korelasi 0,2 mengubah &ldquo;mustahil&rdquo; menjadi &ldquo;1 dari 3 tahun&rdquo;. Inilah 2008 dalam satu perhitungan.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Faktor sistemik — skenario resesi</summary>
              <p>Model Vasicek: Yᵢ = √ρ·Z + √(1−ρ)·εᵢ, default jika Yᵢ &lt; Φ⁻¹(0,05) = −1,645. ρ = 0,2. Jika Z = −2 (resesi berat), berapa PD kondisional?</p>
              <p><strong>Langkah 1</strong> — PD(Z) = Φ((−1,645 − √0,2·Z)/√0,8).<br />
              <strong>Langkah 2</strong> — Z = −2: (−1,645 + 0,894)/0,894 = −0,840 → Φ(−0,840) ≈ <strong>20%</strong>.<br />
              <strong>Langkah 3</strong> — baca: PD 5% → 20% saat resesi. Inilah &ldquo;conditional PD&rdquo; yang dipakai stress testing Basel.</p>
              <p>Pelajaran: Vasicek mengubah &ldquo;satu PD&rdquo; menjadi &ldquo;PD sebagai fungsi ekonomi&rdquo;. Stress test = tancapkan Z buruk, baca PD-nya.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Granularitas — kapan korelasi tidak penting?</summary>
              <p>Dua portofolio: (a) 10 debitur besar @Rp10 M; (b) 10.000 debitur kecil @Rp10 juta. PD 5%, ρ = 0,2. Mana yang risikonya didominasi korelasi, mana oleh idiosinkratik?</p>
              <p><strong>Langkah 1</strong> — risiko idiosinkratik ∝ 1/√n: (a) besar (n=10), (b) kecil (n=10.000).<br />
              <strong>Langkah 2</strong> — risiko sistemik (korelasi) <em>tidak</em> hilang dengan n — ia proporsional terhadap total eksposur.<br />
              <strong>Langkah 3</strong> — (a): idiosinkratik dominan (satu debitur gagal = 10% portofolio!). (b): sistemik dominan — diversifikasi sempurna pun tidak menghapus Z.</p>
              <p>Pelajaran: &ldquo;diversifikasi&rdquo; hanya membunuh risiko idiosinkratik. Risiko sistemik = harga yang tidak bisa ditawar — hanya bisa dimodali (inilah logika capital charge Basel).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Simulasi Vasicek — Lihat Ekor Menggemuk</h2>

      <p>Simulasikan 1.000 debitur, PD=5%. Bandingkan distribusi jumlah default untuk ρ=0 vs ρ=0,3.</p>

      <PyodideLab
  title="Lab 1 — Satu Faktor Beraksi"
  hint="Inilah inti modal Basel: &lt;strong>unexpected loss&lt;/strong> (VaR − ekspektasi) tumbuh dengan ρ."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Verifikasi Rumus Kuantil Vasicek</h2>

      <p>Hitung q_99,9% dari rumus tertutup, bandingkan dengan simulasi Lab 1.</p>

      <PyodideLab
  title="Lab 2 — Rumus vs Simulasi"
  hint="Sensitivitas inilah alasan regulator menetapkan ρ (bukan bank) — dan mengapa validasi ρ krusial."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Vasicek</h2>

      <div className="decision-card">
<h3>1. Risiko kredit portofolio homogen besar → <strong>Vasicek analitik</strong></h3>
<p><strong>Kondisi data:</strong> Ribuan debitur serupa; butuh VaR cepat &amp; rumus modal.</p>
<p><strong>Kenapa:</strong> Rumus kuantil tertutup — instan, transparan, basis Basel.</p>
<p><strong>Contoh nyata:</strong> Modal IRB bank untuk portofolio korporasi.</p>
</div>

      <div className="decision-card">
<h3>2. Portofolio heterogen / multi-faktor → <strong>Monte Carlo multi-faktor</strong></h3>
<p><strong>Kondisi data:</strong> PD/LGD/EAD bervariasi; sektor/region berbeda.</p>
<p><strong>Kenapa:</strong> Vasicek homogen terlalu menyederhanakan — simulasi lebih fleksibel.</p>
<p><strong>Contoh nyata:</strong> ECL/stress test internal bank (B12).</p>
</div>

      <div className="decision-card">
<h3>3. Curiga tail dependence → <strong>copula non-Gaussian</strong></h3>
<p><strong>Kondisi data:</strong> Krisis menunjukkan default lebih bergerombol dari prediksi Gaussian.</p>
<p><strong>Kenapa:</strong> Vasicek = struktur Gaussian (B10) — tanpa tail dependence.</p>
<p><strong>Contoh nyata:</strong> Ganti ke copula t/Clayton untuk skenario krisis.</p>
</div>

      <div className="decision-card">
<h3>4. Butuh angka cepat untuk diskusi → <strong>ingat orde besarnya</strong></h3>
<p><strong>Kondisi data:</strong> PD 2%, ρ 0,15 → VaR 99,9% ≈ 9x ekspektasi.</p>
<p><strong>Kenapa:</strong> Intuisi &ldquo;ekor ≈ 5–10x mean&rdquo; mencegah estimasi ngawur.</p>
<p><strong>Contoh nyata:</strong> Sanity check hasil model internal.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Vasicek mengubah <strong>distribusi</strong>, bukan ekspektasi — modal melindungi ekor.</li><li>ρ adalah parameter terpenting &amp; tersulit — selalu stress.</li><li>Ingat struktur Gaussian-nya (B10): untuk krisis ekstrem, pertimbangkan tail dependence.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Kalibrasi ρ dari Data</h2>

      <div className="callout">
<p>Bank punya 10 tahun data default tahunan portofolio UKM: rata-rata 3%, tapi tahun terburuk 11%. Model independen (Binomial) bilang P(≥11%) ≈ 0.</p><p><strong>Pertanyaan:</strong> (a) Perkirakan ρ yang konsisten dengan data. (b) Apa bahaya mengkalibrasi ρ dari 10 tahun &ldquo;tenang&rdquo;?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Cari ρ sehingga q_90% ≈ 11% (tahun terburuk dari 10 ≈ kuantil 90%): coba ρ=0,2 → q_90% = Φ((Φ⁻¹(0,03)+√0,2×1,28)/√0,8) = Φ((−1,88+0,57)/0,89) = Φ(−1,47) ≈ 7%. Kurang. ρ=0,35 → (−1,88+0,76)/0,81 = −1,39 → 8,2%. ρ=0,5 → (−1,88+0,91)/0,71 = −1,37 → 8,5%... Hmm, butuh ρ sangat tinggi atau model multi-faktor — <strong>data 10 titik tidak cukup untuk kalibrasi presisi!</strong> Inilah pesan sebenarnya: kalibrasi ρ dari deret pendek sangat tidak pasti.</p><p>(b) <strong>10 tahun tenang tidak mengandung krisis</strong> — ρ terkalibrasi akan terlalu rendah (survivorship/period bias). Praktik benar: pakai ρ regulator (konservatif) + stress + data lintas siklus + benchmark antar bank. <strong>Pelajaran:</strong> parameter yang paling menentukan modal adalah yang paling sulit diestimasi — di sinilah konservatisme regulator berasal.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>n = 500, PD = 2%, ρ = 0,15. Hitung SD jumlah gagal model Vasicek (aproksimasi) vs Binomial. Berapa kali lipat?</li>
              <li>Jika Z = +1 (ekonomi bagus), PD kondisional untuk kasus 2 di atas (ρ=0,2, PD=5%) menjadi berapa? (Φ⁻¹(0,05) = −1,645.)</li>
              <li>Jelaskan mengapa rumus modal Basel memakai PD <em>kondisional</em> (Z buruk), bukan PD rata-rata (through-the-cycle).</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Binomial: √(500×0,02×0,98) ≈ 3,13. Vasicek: Var ≈ 9,8 + 500×499×0,0196×0,15 ≈ 743 → SD ≈ <strong>27,3</strong> — <strong>8,7× lipat</strong> Binomial!</p>
              <p><strong>2.</strong> (−1,645 − 0,447)/0,894 = −2,34 → Φ ≈ <strong>0,96%</strong>. Ekonomi bagus menekan PD 5% → 1%.</p>
              <p><strong>3.</strong> Modal = buffer untuk <em>kondisi buruk</em>, bukan rata-rata. PD rata-rata memberi ekspektasi kerugian (di-cover provisi/EL); modal (unexpected loss) harus menahan PD saat Z buruk — itulah yang dihitung Vasicek kondisional pada kuantil 99,9%.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Model:</strong> <Tex math={String.raw`X_i = \sqrt{\rho}\,Y + \sqrt{1-\rho}\,\varepsilon_i`} /> — satu faktor sistemik + idiosinkratik.</li><li><strong>Default</strong> jika <Tex math={String.raw`X_i < \Phi^{-1}(PD)`} /> — PD individual tetap!</li><li><strong>VaR kredit:</strong> <Tex math={String.raw`q_\alpha = \Phi\left(\frac{\Phi^{-1}(PD)+\sqrt{\rho}\,\Phi^{-1}(\alpha)}{\sqrt{1-\rho}}\right)`} /> — basis modal Basel.</li><li><strong>Ekspektasi tetap, ekor menggemuk</strong> dengan ρ — modal melindungi unexpected loss.</li><li><strong>Batas:</strong> Gaussian (tanpa tail dependence), ρ konstan, homogen — stress &amp; validasi selalu.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b12-monte-carlo" className="btn btn-secondary btn-sm">← ← B12</Link>
        <Link href="/learn/b14-markov-chain" className="btn btn-primary btn-sm">Next: B14 →</Link>
      </div>
    </div>
  );
}
