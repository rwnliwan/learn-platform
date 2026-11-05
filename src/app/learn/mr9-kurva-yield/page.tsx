"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR9Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Kurva yield: normal vs inverted vs flat vs humped
  const tenors = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
  const curveNormal = [4.5, 4.7, 5.0, 5.4, 5.7, 6.1, 6.3, 6.5, 6.9, 7.0];
  const curveInverted = [7.2, 7.0, 6.8, 6.4, 6.1, 5.7, 5.5, 5.3, 5.1, 5.0];
  const curveFlat = [5.8, 5.8, 5.85, 5.9, 5.9, 5.95, 5.95, 6.0, 6.0, 6.0];

  const curveData = [
    { x: tenors, y: curveNormal, type: "scatter", mode: "lines+markers", name: "Normal (upward)", line: { color: "#2a7de1", width: 2.5 } },
    { x: tenors, y: curveInverted, type: "scatter", mode: "lines+markers", name: "Inverted", line: { color: "#ef4444", width: 2.5 } },
    { x: tenors, y: curveFlat, type: "scatter", mode: "lines+markers", name: "Flat", line: { color: "#e8a838", width: 2.5 } },
  ];

  // Nelson-Siegel fit vs data
  const nsTenors = [1, 2, 3, 5, 7, 10, 15, 20, 30];
  const nsData = [5.0, 5.4, 5.7, 6.1, 6.3, 6.5, 6.75, 6.9, 7.0];
  const b0 = 7.2, b1 = -2.8, b2 = 1.5, lam = 1.8;
  const nsFit = nsTenors.map((t) => {
    const f1 = (1 - Math.exp(-lam * t)) / (lam * t);
    const f2 = f1 - Math.exp(-lam * t);
    return +(b0 + b1 * f1 + b2 * f2).toFixed(3);
  });

  const nsChartData = [
    { x: nsTenors, y: nsData, type: "scatter", mode: "markers", name: "Zero rate pasar", marker: { color: "#2a7de1", size: 9 } },
    { x: nsTenors, y: nsFit, type: "scatter", mode: "lines", name: "Nelson-Siegel fit", line: { color: "#e8a838", width: 2.5 } },
  ];

  // PCA: level, slope, curvature shapes
  const pcaX = [1, 2, 3, 5, 7, 10, 15, 20, 30];
  const pcaData = [
    { x: pcaX, y: pcaX.map(() => 1), type: "scatter", mode: "lines", name: "PC1 — Level (paralel)", line: { color: "#2a7de1", width: 2.5 } },
    { x: pcaX, y: [1.2, 1.0, 0.8, 0.4, 0.1, -0.2, -0.5, -0.7, -0.9], type: "scatter", mode: "lines", name: "PC2 — Slope (twist)", line: { color: "#e8a838", width: 2.5 } },
    { x: pcaX, y: [-0.8, -0.4, 0.0, 0.5, 0.7, 0.5, 0.0, -0.4, -0.8], type: "scatter", mode: "lines", name: "PC3 — Curvature (bengkok)", line: { color: "#ef4444", width: 2.5 } },
  ];

  const lab1Code = String.raw`# BOOTSTRAPPING: dari par yield (kupon) -> zero rate.
# Obligasi par membayar kupon = yield, harga = 100.
# Zero rate t: 100 = sum_{i<=t} C/(1+z_i)^i + 100/(1+z_t)^t  -> selesaikan z_t rekursif.

par_yields = {1: 0.050, 2: 0.054, 3: 0.057, 5: 0.061, 10: 0.065}  # par yield per tenor

def bootstrap(par):
    tenors = sorted(par)
    z = {}
    for t in tenors:
        cpn = par[t] * 100
        # PV kupon dgn zero rate yg sudah diketahui (interpolasi linear utk tenor antaranya)
        pv_known = 0.0
        for i in range(1, t):
            # cari zero rate tenor i (interpolasi dari yg diketahui)
            zi = None
            for tt in tenors:
                if tt >= i:
                    zi = z.get(tt, None)
                    break
            if zi is None:
                zi = z[tenors[-1]]
            pv_known += cpn / (1 + zi) ** i
        # sisa utk principal + kupon terakhir di t:
        # 100 = pv_known + 100*(1+par)/(1+z_t)^t
        z[t] = ((100 * (1 + par[t])) / (100 - pv_known)) ** (1 / t) - 1
    return z

zeros = bootstrap(par_yields)
print(f"{'Tenor':>6s} {'Par yield':>10s} {'Zero rate':>10s}")
for t in sorted(zeros):
    print(f"{t:>6d} {par_yields[t]:>10.2%} {zeros[t]:>10.2%}")
print()
print("Perhatikan: zero rate > par yield utk kurva menanjak.")
print("Kenapa? Kupon diterima LEBIH AWAL (didiskon dgn rate pendek yg rendah),")
print("jadi rate tenor panjang harus LEBIH TINGGI agar harga tetap 100.")`;

  const lab2Code = String.raw`# NELSON-SIEGEL: y(tau) = b0 + b1*(1-e^-lt)/(lt) + b2*((1-e^-lt)/(lt) - e^-lt)
# b0 = level (jangka panjang), b1 = slope (negatif = menanjak), b2 = curvature, l = decay
import math

def nelson_siegel(tau, b0, b1, b2, l):
    f1 = (1 - math.exp(-l * tau)) / (l * tau)
    f2 = f1 - math.exp(-l * tau)
    return b0 + b1 * f1 + b2 * f2

market = {1: 5.0, 2: 5.4, 3: 5.7, 5: 6.1, 7: 6.3, 10: 6.5, 20: 6.9, 30: 7.0}

# Grid search kasar utk (b0,b1,b2,l)
best = None
for b0 in [6.8, 7.0, 7.2, 7.4]:
    for b1 in [-3.5, -2.8, -2.0, -1.0]:
        for b2 in [0.0, 1.0, 1.5, 2.0]:
            for l in [1.0, 1.8, 3.0]:
                err = sum((nelson_siegel(t, b0, b1, b2, l) - y) ** 2 for t, y in market.items())
                if best is None or err < best[0]:
                    best = (err, b0, b1, b2, l)
err, b0, b1, b2, l = best
print(f"Fit terbaik: b0={b0} b1={b1} b2={b2} lambda={l}  (SSE={err:.4f})")
print()
print(f"{'Tenor':>6s} {'Pasar':>7s} {'NS fit':>7s} {'Error':>7s}")
for t, y in market.items():
    f = nelson_siegel(t, b0, b1, b2, l)
    print(f"{t:>6d} {y:>7.2f} {f:>7.2f} {f-y:>+7.3f}")
print()
print("Interpretasi: b0=level jangka panjang, b1 negatif = kurva menanjak,")
print("b2 = punuk di tenor menengah. 4 parameter menjelaskan SELURUH kurva!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR9 — Market Risk Analytics</span>
        <h1 className="display-title">Kurva Yield:<br />Membaca Bahasa Suku Bunga Antar Waktu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kurva yang Memprediksi Resesi</a></li>
          <li><a href="#bentuk">Bentuk Kurva dan Maknanya</a></li>
          <li><a href="#bootstrap">Bootstrapping: Dari Par Yield ke Zero Rate</a></li>
          <li><a href="#ns">Nelson-Siegel: 4 Parameter untuk Seluruh Kurva</a></li>
          <li><a href="#pca">PCA: Tiga Gerakan Kurva</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bootstrapping Zero Rate</a></li>
          <li><a href="#lab2">🔬 Lab 2: Fitting Nelson-Siegel</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Inversi 2022–2024 — Ramalan Resesi yang (Hampir) Gagal</a></li>
          <li><a href="#case">📋 Mini-Case: Kurva Inverted dan Portofolio Bank</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tiga bentuk kurva yield (normal, inverted, flat) dan makna ekonominya — termasuk mengapa inversi menjadi prediktor resesi.</li>
          <li>Membedakan par yield, zero rate, dan forward rate — serta kapan memakai masing-masing.</li>
          <li>Melakukan bootstrapping: menurunkan zero rate dari par yield secara rekursif.</li>
          <li>Menjelaskan dan menafsirkan parameter Nelson-Siegel (β₀ level, β₁ slope, β₂ curvature, λ decay).</li>
          <li>Menjelaskan hasil PCA kurva yield (level/slope/curvature) dan kaitannya dengan key-rate duration (MR8).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kurva yang Memprediksi Resesi</h2>
      <div className="story">
        <p>2006. Kurva yield AS <strong>inverted</strong> — yield 2 tahun (5,1%) lebih tinggi dari yield 10 tahun (4,7%). Para ekonom resah: setiap inversi sejak 1970-an <strong>didahului resesi</strong> dalam 12–18 bulan. Para trader obligasi bersorak: mereka membeli long bond dan untung besar saat The Fed akhirnya memangkas suku bunga.</p>
        <p>Di sisi lain, risk manager sebuah bank mengabaikannya: <em>&ldquo;Itu cuma bentuk kurva — portofolio kami duration-netral.&rdquo;</em> 2008: resesi datang, kurva <em>re-steepen</em> brutal, dan posisi &ldquo;duration-netral&rdquo; mereka — yang ternyata bertaruh pada bentuk kurva (ingat MR8!) — berdarah.</p>
        <p>Twist-nya: kurva yield bukan sekadar grafik — ia adalah <strong>agregat ekspektasi pasar tentang masa depan</strong>: ekspektasi suku bunga, inflasi, dan premi risiko, untuk setiap titik waktu. Membaca kurva = membaca pikiran kolektif pasar. Dan bagi risk manager, kurva adalah <strong>bahan mentah</strong> semua perhitungan: zero rate untuk valuasi, forward rate untuk skenario, dan pergerakannya (level/slope/curvature) untuk risiko.</p>
      </div>

      <h2 id="bentuk">Bentuk Kurva dan Maknanya</h2>
      <p><strong>Definisi.</strong> <strong>Kurva yield</strong> memetakan yield terhadap tenor (jatuh tempo). Tiga bentuk utama:</p>
      <ul>
        <li><strong>Normal (upward sloping):</strong> yield naik dengan tenor. Makna: kompensasi risiko waktu + ekspektasi pertumbuhan. Kondisi sehat biasa.</li>
        <li><strong>Inverted:</strong> yield pendek &gt; yield panjang. Makna: pasar berekspektasi <strong>suku bunga akan turun</strong> (biasanya karena resesi → bank sentral memangkas). <strong>Prediktor resesi</strong> yang terkenal akurat.</li>
        <li><strong>Flat / humped:</strong> transisi — pasar tidak yakin arah, atau ada tekanan beli/jual di segmen tertentu.</li>
      </ul>

      <PlotlyChart
        data={curveData}
        title="Tiga Bentuk Kurva Yield"
        layout={{ xaxis: { title: "Tenor (tahun)", type: "log" }, yaxis: { title: "Yield (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = tenor (skala log agar titik pendek terbaca), sumbu-y = yield. Biru = normal (menanjak), merah = inverted (menurun), kuning = flat.</p>
        <p><strong>Interpretasi:</strong> pada kurva <strong>inverted</strong> (merah), investor &ldquo;dibayar lebih&rdquo; untuk meminjamkan 3 bulan daripada 30 tahun — anomali yang hanya masuk akal jika pasar yakin suku bunga <em>akan turun tajam</em>. <strong>Bagi risk manager:</strong> bentuk kurva menentukan <strong>di mana</strong> risiko suku bunga berada (ingat key-rate MR8) — kurva yang berubah bentuk = risiko yang berpindah tempat.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> jangan hafal bentuk — <strong>baca ceritanya</strong>. Kurva menanjak curam = &ldquo;pasar optimis tapi minta premi&rdquo;. Inverted = &ldquo;pasar mencium resesi&rdquo;. Flat setelah inverted = &ldquo;resesi mungkin sudah dekat&rdquo;. Tiga kata: <em>ekspektasi + premi risiko = bentuk</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Yield 10 tahun = ekspektasi suku bunga rata-rata 10 tahun.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> yield = <strong>ekspektasi + premi risiko (term premium)</strong>. Investor meminta kompensasi ekstra untuk mengunci uang 10 tahun (risiko inflasi, likuiditas). Mengabaikan term premium membuatmu salah membaca ekspektasi pasar — misal mengira pasar optimis padahal cuma premi yang tinggi.</p>
      </div>

      <h2 id="bootstrap">Bootstrapping: Dari Par Yield ke Zero Rate</h2>
      <p><strong>Definisi.</strong> Pasar mengkuotasi <strong>par yield</strong> (yield obligasi berkupon yang harganya par = 100). Tapi untuk valuasi yang benar kita butuh <strong>zero rate</strong> <Tex math={String.raw`z_t`} /> — rate untuk <em>satu</em> arus kas di waktu-t (tanpa kupon antara). <strong>Bootstrapping</strong> menurunkannya secara rekursif:</p>
      <Tex math={String.raw`100 = \sum_{i=1}^{t}\frac{C}{(1+z_i)^i} + \frac{100}{(1+z_t)^t}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`C`} /> = kupon tahunan (= par yield × 100); <Tex math={String.raw`z_i`} /> = zero rate tenor-i (untuk i &lt; t sudah diketahui dari langkah sebelumnya); <Tex math={String.raw`z_t`} /> = yang dicari.</p>
      <p><strong>Cara kerja:</strong> mulai dari tenor terpendek (z₁ = par yield 1Y — tidak ada kupon antara), lalu untuk t=2: kupon tahun-1 didiskon dengan z₁ yang <em>sudah diketahui</em>, sisa persamaan diselesaikan untuk z₂. Begitu seterusnya — &ldquo;menarik diri dengan tali sepatu sendiri&rdquo; (bootstrap!).</p>
      <p><strong>Kenapa repot-repot?</strong> Karena mendiskon <em>semua</em> arus kas dengan satu yield (YTM) <strong>salah secara teori</strong> — tiap arus kas terjadi di waktu berbeda dan harus didiskon dengan rate tenornya masing-masing. Untuk obligasi biasa selisihnya kecil; untuk <strong>derivatif suku bunga &amp; valuasi presisi</strong>, zero curve adalah fondasi yang tidak bisa ditawar.</p>

      <details className="worked">
        <summary>📐 Contoh 2 langkah (klik untuk buka)</summary>
        <p>Par yield: 1Y = 5%, 2Y = 5,4%.</p>
        <p><strong>Langkah 1</strong> — z₁ = 5% (langsung, tidak ada kupon antara).</p>
        <p><strong>Langkah 2</strong> — obligasi 2Y par: kupon 5,4. Persamaan: 100 = 5,4/1,05 + 105,4/(1+z₂)².</p>
        <p>5,4/1,05 = 5,143 → 105,4/(1+z₂)² = 94,857 → (1+z₂)² = 1,1111 → z₂ = <strong>5,41%</strong>.</p>
        <p>Zero 2Y (5,41%) sedikit <em>di atas</em> par 2Y (5,40%) — pola umum untuk kurva menanjak.</p>
      </details>

      <h2 id="ns">Nelson-Siegel: 4 Parameter untuk Seluruh Kurva</h2>
      <p><strong>Definisi.</strong> Alih-alih menyimpan puluhan titik, <strong>model Nelson-Siegel</strong> (1987) memadatkan seluruh kurva menjadi <strong>4 parameter</strong>:</p>
      <Tex math={String.raw`y(\tau) = \beta_0 + \beta_1\left(\frac{1-e^{-\lambda\tau}}{\lambda\tau}\right) + \beta_2\left(\frac{1-e^{-\lambda\tau}}{\lambda\tau} - e^{-\lambda\tau}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\beta_0`} />: <strong>level</strong> — yield jangka sangat panjang (asymptote). &ldquo;Di mana kurva bermuara.&rdquo;</li>
        <li><Tex math={String.raw`\beta_1`} />: <strong>slope</strong> — kemiringan. β₁ negatif → kurva menanjak (normal); positif → inverted.</li>
        <li><Tex math={String.raw`\beta_2`} />: <strong>curvature</strong> — punuk/cekungan di tenor menengah.</li>
        <li><Tex math={String.raw`\lambda`} />: <strong>decay</strong> — seberapa cepat efek slope/curvature memudar; menentukan <em>di mana</em> punuknya.</li>
        <li><Tex math={String.raw`\tau`} />: tenor.</li>
      </ul>
      <p><strong>Kenapa 4 parameter cukup?</strong> Karena kurva yield di dunia nyata <strong>halus dan berdimensi rendah</strong> — ia tidak bergerigi acak. Empat parameter menangkap semua bentuk ekonomis yang relevan (level, slope, hump). Ini juga <strong>anti-noise</strong>: titik pasar yang anomali tidak merusak seluruh kurva.</p>

      <PlotlyChart
        data={nsChartData}
        title="Nelson-Siegel Fit vs Zero Rate Pasar"
        layout={{ xaxis: { title: "Tenor (tahun)" }, yaxis: { title: "Zero rate (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik biru = zero rate pasar per tenor; garis kuning = kurva Nelson-Siegel hasil fitting 4 parameter.</p>
        <p><strong>Interpretasi:</strong> 4 parameter mereproduksi 9 titik pasar dengan error kecil (&lt; 0,05%). <strong>Kegunaan praktis:</strong> (1) <strong>interpolasi</strong> — butuh rate 4,5Y? Baca dari kurva, bukan interpolasi linear kasar; (2) <strong>ekstrapolasi</strong> hati-hati ke tenor panjang; (3) <strong>skenario</strong> — shock β₀/β₁/β₂ = skenario level/slope/curvature yang konsisten (jembatan ke stress test MR7!).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Nelson-Siegel adalah <strong>kompresi</strong> — seperti JPEG untuk kurva yield. Dan seperti JPEG, ia brilian untuk pola halus tapi <strong>gagal untuk pola aneh</strong> (misal kink tajam karena regulasi di tenor tertentu). Kalau fit error besar di satu titik, jangan paksa — selidiki: mungkin ada informasi pasar di anomali itu.</p>
      </div>

      <h2 id="pca">PCA: Tiga Gerakan Kurva</h2>
      <p><strong>Definisi.</strong> <strong>PCA (Principal Component Analysis)</strong> pada perubahan yield historis menemukan bahwa <strong>~95%+ pergerakan kurva</strong> dijelaskan oleh hanya <strong>3 komponen</strong>:</p>
      <ol>
        <li><strong>PC1 — Level:</strong> seluruh kurva naik/turun bersama (parallel shift). Menjelaskan ~80-90% variasi.</li>
        <li><strong>PC2 — Slope:</strong> short-end vs long-end bergerak berlawanan (twist/steepening/flattening). ~5-10%.</li>
        <li><strong>PC3 — Curvature:</strong> tenor menengah vs ujung-ujung (butterfly). ~2-3%.</li>
      </ol>
      <p><strong>Kenapa ini penting untuk risiko:</strong> alih-alih mensimulasikan 10 titik kurva yang berkorelasi rumit, cukup simulasikan <strong>3 faktor independen</strong> (skor PCA) lalu petakan kembali ke kurva. Ini fondasi <strong>VaR Monte Carlo untuk risiko suku bunga</strong> yang efisien — dan penjelasan teoritis mengapa <strong>key-rate duration (MR8)</strong> bisa diringkas menjadi 3 angka.</p>

      <PlotlyChart
        data={pcaData}
        title="Tiga Komponen Utama Pergerakan Kurva (bentuk eigenvektor)"
        layout={{ xaxis: { title: "Tenor (tahun)", type: "log" }, yaxis: { title: "Loading" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap garis = &ldquo;bentuk&rdquo; satu komponen: biru (PC1) datar = semua tenor bergerak sama; kuning (PC2) miring = short vs long berlawanan; merah (PC3) melengkung = tengah vs ujung berlawanan.</p>
        <p><strong>Interpretasi:</strong> inilah <strong>bahasa alami</strong> pergerakan kurva — bukan 10 angka acak, melainkan 3 gerakan. <strong>Kaitan praktis:</strong> stress test &ldquo;twist&rdquo; = shock PC2; &ldquo;butterfly&rdquo; = shock PC3. Dan perhatikan: PC1 ≈ parallel shift menjelaskan mengapa <strong>duration (MR8)</strong> — yang mengasumsikan parallel shift — bekerja cukup baik <em>sebagian besar waktu</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Untuk risiko suku bunga cukup simulasikan yield 10Y.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> mensimulasikan satu titik = mengasumsikan <strong>korelasi sempurna</strong> antar tenor (semuanya bergerak sama). PCA menunjukkan 10-15% pergerakan adalah slope/curvature — dan justru di situlah <strong>hedge duration-netral jebol</strong> (cerita MR8). Simulasi yang benar memakai minimal 3 faktor PCA.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bootstrapping Zero Rate</h2>
      <p>Ubah par yield (misal buat kurva inverted: 1Y=7%, 10Y=5%). Bagaimana hubungan zero vs par berubah?</p>
      <PyodideLab
        title="Lab 1 — Bootstrapping: Par Yield → Zero Rate"
        hint="Coba kurva inverted (1Y: 7%, 2Y: 6.5%, 3Y: 6%...): zero rate kini DI BAWAH par yield. Kenapa polanya terbalik dari kurva normal?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Fitting Nelson-Siegel</h2>
      <p>Ubah data pasar (misal tambah punuk: 5Y=6,8%) dan lihat parameter β₂ bereaksi. Atau buat kurva inverted dan lihat β₁ berubah tanda.</p>
      <PyodideLab
        title="Lab 2 — 4 Parameter Menjelaskan Seluruh Kurva"
        hint="Coba market inverted: {1:7.0, 2:6.6, 3:6.3, 5:5.9, 7:5.6, 10:5.4, 20:5.2, 30:5.1}. Perhatikan b1 berubah positif — itulah 'tanda tangan' inversi."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Valuasi presisi / derivatif suku bunga → <strong>Zero curve (bootstrapping)</strong></h3>
        <p><strong>Kondisi:</strong> pricing swap, opsi suku bunga, valuasi akurat.</p>
        <p><strong>Alasan:</strong> tiap arus kas didiskon dengan rate tenornya — satu-satunya cara yang benar secara teori. YTM tunggal = aproksimasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Interpolasi / skenario / reporting → <strong>Nelson-Siegel</strong></h3>
        <p><strong>Kondisi:</strong> butuh rate tenor antara, skenario konsisten, kurva halus untuk laporan.</p>
        <p><strong>Alasan:</strong> 4 parameter anti-noise; shock β₀/β₁/β₂ = skenario level/slope/curvature yang ekonomis. Standar bank sentral (ECB, Fed).</p>
      </div>

      <div className="decision-card">
        <h3>3. Simulasi risiko / VaR suku bunga → <strong>PCA (3 faktor)</strong></h3>
        <p><strong>Kondisi:</strong> Monte Carlo multi-tenor, agregasi risiko.</p>
        <p><strong>Alasan:</strong> 3 faktor independen menangkap 95%+ pergerakan — jauh lebih efisien dan stabil daripada 10 titik berkorelasi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Baca arah ekonomi → <strong>Bentuk kurva (slope 10Y-2Y)</strong></h3>
        <p><strong>Kondisi:</strong> overlay makro untuk risk appetite.</p>
        <p><strong>Alasan:</strong> inversi = sinyal resesi terkuat; steepening tajam = ekspektasi pemangkasan/pelonggaran. Bukan untuk trading buta, tapi untuk <strong>kewaspadaan rezim</strong>.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Valuasi</strong> → zero (bootstrap). <strong>Kurva halus/skenario</strong> → Nelson-Siegel. <strong>Simulasi</strong> → PCA 3 faktor.</li>
          <li><strong>Inverted</strong> = waspada resesi; <strong>twist</strong> = waspada hedge jebol.</li>
          <li>Anomali fit NS di satu titik = <strong>informasi</strong>, bukan sampah — selidiki.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Inversi 2022–2024 — Ramalan Resesi yang (Hampir) Gagal</h2>
      <p>Kurva yield AS <strong>inverted</strong> (2Y di atas 10Y) pada Juli 2022 dan bertahan inverted hingga <strong>September 2024</strong> — inversi <strong>terpanjang dalam sejarah</strong> (~26 bulan). Model-model klasik meramal resesi dengan keyakinan ~65%. Resesi tidak kunjung datang (setidaknya tidak seperti yang diramalkan). Apa yang terjadi — dan apa pelajarannya tentang membaca kurva?</p>

      <h3>Mengapa inversi biasanya meramal resesi — mekanismenya</h3>
      <p>Inversi bukan sihir; ia bekerja lewat <strong>tiga kanal ekonomi</strong>:</p>
      <ol>
        <li><strong>Ekspektasi suku bunga:</strong> yield panjang = rata-rata ekspektasi suku bunga pendek masa depan + premi. Jika pasar yakin The Fed akan <em>memangkas</em> suku bunga (karena resesi datang), yield panjang jatuh di bawah yield pendek. Inversi = pasar <strong>bertaruh resesi akan memaksa pemangkasan</strong>.</li>
        <li><strong>Kredit macet:</strong> bank meminjam pendek (deposito) dan meminjamkan panjang (kredit). Kurva inverted → <strong>margin bank negatif</strong> → bank mengerem penyaluran kredit → ekonomi melambat → resesi yang diramalkan menjadi <em>terpenuhi sendiri</em> (self-fulfilling).</li>
        <li><strong>Flight to quality:</strong> investor khawatir → memborong obligasi panjang (aman) → harganya naik → yield-nya turun → inversi makin dalam. Inversi adalah <strong>cermin ketakutan kolektif</strong>.</li>
      </ol>
      <p><strong>Rekam jejak:</strong> setiap resesi AS sejak 1970-an didahului inversi 2Y–10Y (rata-rata ~14 bulan sebelumnya). <em>Tidak ada</em> false positive yang bertahan lama — hingga 2022.</p>

      <h3>Mengapa 2022–2024 berbeda?</h3>
      <p>Empat penjelasan yang diperdebatkan ekonom:</p>
      <ul>
        <li><strong>(1) Inversi karena inflasi, bukan karena takut resesi:</strong> yield pendek didorong The Fed yang menaikkan suku bunga agresif melawan inflasi — bukan oleh ekspektasi pemangkasan karena resesi. Sinyalnya &ldquo;terkontaminasi&rdquo; kebijakan.</li>
        <li><strong>(2) Term premium negatif:</strong> permintaan struktural obligasi panjang (dana pensiun, bank sentral asing) menekan yield panjang secara artifisial — inversi &ldquo;teknis&rdquo;, bukan &ldquo;ekonomis&rdquo;.</li>
        <li><strong>(3) Lag yang lebih panjang:</strong> sebagian ekonom berargumen resesi hanya <em>tertunda</em> — stimulus fiskal COVID yang masif (tabungan rumah tangga berlebih) menunda dampaknya hingga 2024–2025.</li>
        <li><strong>(4) Soft landing berhasil:</strong> The Fed menaikkan suku bunga <em>tanpa</em> memicu resesi — skenario yang hampir tak pernah terjadi sebelumnya.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: membaca ekspektasi dari kurva (klik untuk buka)</summary>
        <p><strong>Data (ilustrasi, %):</strong> yield 1Y = 5,0%; yield 2Y = 4,6% (inverted di segmen pendek).</p>
        <p><strong>Langkah 1 — cari forward rate 1Y-ke-1Y</strong> (ekspektasi suku bunga 1-tahun, setahun dari sekarang): <Tex math={String.raw`(1+0{,}046)^2 = (1+0{,}05)(1+f) \;\Rightarrow\; f = \frac{1{,}046^2}{1{,}05} - 1 \approx 4{,}20\%`} />.</p>
        <p><strong>Langkah 2 — interpretasi:</strong> pasar mengharapkan suku bunga 1-tahun <strong>turun</strong> dari 5,0% ke ~4,2% dalam setahun — alias <strong>ekspektasi pemangkasan ~80 bp</strong>. Inilah &ldquo;ramalan&rdquo; yang dikandung inversi: pasar bertaruh bank sentral akan melonggarkan.</p>
        <p><strong>Langkah 3 — uji terhadap realita 2023:</strong> The Fed justru <em>menaikkan</em> suku bunga hingga 5,25–5,50% dan menahannya. Pasar salah — atau lebih tepatnya, pasar meramalkan <em>skenario yang plausible</em> (resesi → pemangkasan) yang tidak terwujud karena inflasi bertahan. <strong>Kurva mencerminkan ekspektasi berbobot probabilitas, bukan ramalan deterministik.</strong></p>
        <p><strong>Angka ini artinya:</strong> jangan membaca kurva sebagai &ldquo;resesi pasti datang&rdquo;. Bacalah sebagai: &ldquo;pasar memberi probabilitas X pada skenario pemangkasan&rdquo;. Analis yang baik menerjemahkan bentuk kurva menjadi <strong>distribusi skenario</strong>, bukan satu ramalan.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Inversi = jual semua saham, resesi pasti.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> inversi adalah <strong>sinyal probabilistik dengan lag 6–24 bulan</strong> — bukan tombol panik. Sejak 2022 kita belajar ia bisa memberi false positive berkepanjangan. Respons profesional: <strong>perketat skenario stres</strong> (MR7), <strong>cek duration gap</strong> (MR8/MR10), <strong>kurangi leverage</strong> — bukan likuidasi buta. Sinyal yang dipakai untuk kalibrasi kehati-hatian ≠ sinyal untuk ramalan biner.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan tiga &ldquo;wujud&rdquo; kurva dan artinya: <strong>steep (menanjak curam)</strong> = ekspektasi pertumbuhan/inflasi naik atau premi risiko tinggi; <strong>flat</strong> = transisi/ketidakpastian; <strong>inverted</strong> = pasar bertaruh pada pelonggaran di masa depan (biasanya karena takut resesi). Dan selalu tanyakan: <em>inversi ini didorong oleh yield pendek yang naik (kebijakan) atau yield panjang yang jatuh (ketakutan)?</em> — keduanya inverted, tapi maknanya berbeda.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: membaca parameter Nelson-Siegel seperti dokter membaca lab (klik untuk buka)</summary>
        <p><strong>Model Nelson-Siegel:</strong> <Tex math={String.raw`y(\tau) = \beta_0 + \beta_1\frac{1-e^{-\tau/\lambda}}{\tau/\lambda} + \beta_2\left(\frac{1-e^{-\tau/\lambda}}{\tau/\lambda} - e^{-\tau/\lambda}\right)`} />. Empat parameter, tiga punya makna ekonomi:</p>
        <p><strong>Estimasi (ilustrasi, data SBN):</strong> β₀=6,5% (level jangka panjang), β₁=−2,0% (slope: negatif = kurva menanjak), β₂=−1,5% (curvature: negatif = punuk ke bawah), λ=2,5 tahun (di mana punuknya).</p>
        <p><strong>Diagnosis:</strong> (1) β₀ 6,5% = ekspektasi suku bunga jangka panjang + premi — <strong>jangkar</strong> valuasi; (2) β₁ −2,0% = pasar mengharapkan suku bunga <em>naik</em> dari level pendek kini (4,5%) menuju 6,5%; (3) β₂ −1,5% di λ=2,5Y = pasar melihat <strong>cekungan</strong> di tenor menengah — mungkin ekspektasi pemangkasan sementara lalu naik lagi.</p>
        <p><strong>Gunanya:</strong> 4 angka merangkum <em>seluruh</em> kurva → bisa dibandingkan antar waktu (&ldquo;slope menajam 50 bp minggu ini — kenapa?&rdquo;) dan dipakai untuk <strong>skenario PCA</strong> (MR7: shock level/slope/curvature terpisah, bukan paralel mentah). Kurva bukan gambar — ia adalah <strong>4 angka yang bercerita</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Zero rate: 1Y = 4%, 2Y = 4,5%. Hitung forward rate 1Y-ke-1Y (ekspektasi suku bunga 1-tahun, setahun dari sekarang). (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`(1{,}045)^2 = (1{,}04)(1+f) \Rightarrow f = 1{,}045^2/1{,}04 - 1 \approx 5{,}00\%`} />.</p>
        <p><strong>Interpretasi:</strong> pasar mengharapkan suku bunga 1-tahun <em>naik</em> dari 4% ke 5% — kurva menanjak = ekspektasi pengetatan/pertumbuhan. Kebalikan dari contoh inverted di lesson (yang menyiratkan ekspektasi <em>pemangkasan</em>).</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Kurva inverted karena (a) yield 2Y naik ke 5% (10Y tetap 4%), vs (b) yield 10Y jatuh ke 3% (2Y tetap 4%). Mana yang lebih &ldquo;menakutkan&rdquo; secara ekonomi? Mengapa? (klik untuk pembahasan)</summary>
        <p><strong>(b) lebih menakutkan.</strong> (a) = <em>bear flattening/inversion</em> didorong kebijakan (bank sentral menaikkan suku bunga pendek melawan inflasi) — <em>penyebabnya</em> diketahui dan terkendali. (b) = <em>bull inversion</em> didorong <strong>flight to quality</strong> — investor memborong obligasi panjang karena takut — <em>ketakutan pasar itu sendiri</em> yang mendorong inversi. Inversi karena ketakutan = sinyal resesi yang lebih murni daripada inversi karena kebijakan.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Bank meminjam 3-bulan (4%) dan meminjamkan KPR 10Y fixed (6%). Kurva inverted: 3-bulan 5,5%, 10Y 4,5%. Hitung perubahan margin dan jelaskan risiko lanjutannya. (klik untuk pembahasan)</summary>
        <p><strong>Margin awal:</strong> 6% − 4% = <strong>+2%</strong>. <strong>Setelah inversi:</strong> aset fixed tetap 6%, biaya dana repricing ke 5,5% → margin = <strong>+0,5%</strong> — terkompresi 75%!</p>
        <p><strong>Risiko lanjutan:</strong> (1) jika suku bunga pendek naik lagi ke 6,5% → margin <strong>negatif</strong> (membayar deposan lebih mahal dari pendapatan kredit — S&amp;L 1980-an); (2) bank tergoda &ldquo;mengejar yield&rdquo; dengan kredit lebih berisiko (moral hazard); (3) EVE tergerus (MR10). Inversi = <strong>pajak terhadap model bisnis bank tradisional</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Kurva Inverted dan Portofolio Bank</h2>
      <div className="callout">
        <p>Bank JKL: aset = KPR fixed 15Y (Rp5 T), liabilitas = deposito 1Y (Rp4,5 T). Kurva: 1Y = 7,2%, 10Y = 5,3% (<strong>inverted</strong>).</p>
        <ul>
          <li>Net interest margin kini: <strong>tertekan</strong> (bayar 7,2% untuk dana, terima ~6% dari KPR lama)</li>
          <li>Risk manager mengusulkan: &ldquo;swap fixed-to-floating untuk KPR — terima floating, lindungi dari…&rdquo; (dari apa, tepatnya?)</li>
          <li>Ekonom bank: &ldquo;inversi memprediksi resesi 12 bulan lagi — saat itu The Fed memangkas, kurva normal kembali&rdquo;</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa risiko utama bank ini dari bentuk kurva kini? (b) Apakah swap fixed-to-floating tepat? (c) Bagaimana PCA/NS membantu merancang skenario?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Risiko ganda:</strong> (1) <em>Margin tertekan kini</em> — negative carry (bayar pendek mahal, terima panjang murah); (2) <em>Jika resesi datang</em>: kredit macet naik (risiko kredit!) + prepayment KPR berubah. Ini contoh <strong>risiko yang berkorelasi antar jenis</strong> — market + credit menyerang bersamaan.</p>
          <p>(b) <strong>Swap fixed-to-floating justru memperparah:</strong> bank sudah &ldquo;kependekan&rdquo; di short-end (bayar floating via deposito). Menambah terima-floating = <strong>menggandakan</strong> eksposur ke suku bunga pendek yang sedang tinggi. Yang benar: <strong>perpanjang liabilitas</strong> (terbitkan obligasi 5Y selagi… — tapi 5Y juga mahal saat inverted!) atau <strong>terima ketidaknyamanan sementara</strong> dengan limit NII yang disesuaikan (MR10).</p>
          <p>(c) <strong>NS:</strong> modelkan kurva kini (β₁ positif = inverted), lalu skenario &ldquo;normalisasi&rdquo; = β₁ kembali negatif — shock yang <strong>konsisten</strong>, bukan angka asal. <strong>PCA:</strong> skenario re-steepening = shock PC2 (slope) — tepat menguji risiko bentuk yang dimiliki bank ini.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kurva inverted (2Y > 10Y) secara ekonomi berarti?"
        options={[
          "Pasar optimis pertumbuhan",
          "Pasar berekspektasi suku bunga TURUN (biasanya karena resesi di depan) — prediktor resesi klasik",
          "Tidak ada artinya",
          "Bank sentral pasti menaikkan suku bunga",
        ]}
        correct={1}
        explanation="Benar. Inversi = pasar bersedia menerima yield panjang lebih rendah karena yakin suku bunga pendek akan turun (pemangkasan saat resesi). Rekam jejak prediksinya kuat sejak 1970-an."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa perlu bootstrapping dari par yield ke zero rate?"
        options={[
          "Agar angkanya lebih besar",
          "Tiap arus kas terjadi di waktu berbeda → harus didiskon dengan rate tenornya masing-masing; YTM tunggal salah secara teori",
          "Regulator memaksa",
          "Supaya terlihat canggih",
        ]}
        correct={1}
        explanation="Benar. Zero rate = fondasi valuasi yang benar. Untuk obligasi biasa selisihnya kecil, tapi untuk derivatif suku bunga dan valuasi presisi, kurva zero tidak bisa ditawar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam Nelson-Siegel, β₁ positif berarti?"
        options={[
          "Kurva menanjak (normal)",
          "Kurva inverted — komponen slope positif menaikkan yield pendek di atas level jangka panjang",
          "Ada punuk besar",
          "Kurva flat",
        ]}
        correct={1}
        explanation="Benar. β₁ negatif = normal (menanjak), positif = inverted. Tanda β₁ adalah 'tanda tangan' bentuk kurva — cara cepat membaca hasil fitting."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. PCA kurva yield: 3 komponen menjelaskan 95%+ pergerakan. Implikasinya untuk simulasi VaR?"
        options={[
          "Tetap simulasikan 30 titik kurva",
          "Cukup simulasikan 3 faktor independen (level/slope/curvature) lalu petakan kembali — efisien dan stabil",
          "PCA tidak berguna untuk risiko",
          "Hanya pakai PC1",
        ]}
        correct={1}
        explanation="Benar. 3 faktor independen menangkap hampir semua pergerakan — Monte Carlo menjadi jauh lebih efisien dan terhindar dari masalah korelasi antar 30 titik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk kurva menanjak, hubungan zero rate vs par yield di tenor yang sama?"
        options={[
          "Zero < par",
          "Zero > par — kupon awal didiskon dengan rate pendek yang rendah, jadi rate panjang harus lebih tinggi agar harga tetap par",
          "Sama persis",
          "Acak",
        ]}
        correct={1}
        explanation="Benar. Ini hasil bootstrapping: pada kurva menanjak, zero rate di atas par yield (dan sebaliknya untuk inverted). Konsekuensi matematis dari struktur arus kas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bank dengan aset 15Y fixed dan liabilitas 1Y saat kurva inverted. Risiko utamanya?"
        options={[
          "Tidak ada — duration bisa di-hedge",
          "Negative carry (bayar pendek mahal) + risiko bentuk kurva + korelasi dengan risiko kredit saat resesi datang",
          "Hanya risiko likuiditas",
          "Hanya risiko operasional",
        ]}
        correct={1}
        explanation="Benar. Inversi menekan margin SEKAARANG dan memprediksi resesi (kredit macet) NANTI — risiko market dan credit menyerang berurutan. Inilah alasan analisis kurva tidak bisa dipisahkan dari konteks bisnis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kurva yield</strong> = ekspektasi pasar + premi risiko per tenor. <strong>Inverted</strong> = sinyal resesi.</li>
          <li><strong>Bootstrapping:</strong> par yield → zero rate secara rekursif; fondasi valuasi yang benar.</li>
          <li><strong>Nelson-Siegel:</strong> <Tex math={String.raw`y(\tau)=\beta_0+\beta_1(\cdot)+\beta_2(\cdot)`} /> — β₀ level, β₁ slope (tanda = bentuk!), β₂ curvature, λ decay.</li>
          <li><strong>PCA:</strong> 3 gerakan (level/slope/curvature) menjelaskan 95%+ — bahasa alami simulasi risiko suku bunga.</li>
          <li>Yield = ekspektasi + <strong>term premium</strong> — jangan baca ekspektasi mentah-mentah.</li>
          <li>Anomali fit = informasi; skenario NS/PCA = konsisten; satu titik ≠ seluruh kurva.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr8-risiko-suku-bunga" className="btn btn-secondary btn-sm">← MR8</Link>
        <Link href="/learn/mr10-irrbb" className="btn btn-primary btn-sm">Next: MR10 →</Link>
      </div>
    </div>
  );
}
