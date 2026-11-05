"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E7Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const distData = [
    {
      x: [-8, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 10],
      y: [1, 2, 4, 8, 14, 20, 26, 30, 26, 20, 14, 8, 4, 2, 1],
      type: "bar",
      name: "Reksa dana A (tenang)",
      marker: { color: "#2a7de1" },
    },
    {
      x: [-8, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 10],
      y: [3, 5, 6, 8, 10, 12, 13, 14, 13, 12, 10, 8, 6, 5, 3],
      type: "bar",
      name: "Reksa dana B (liar)",
      marker: { color: "#e8a838", opacity: 0.7 },
    },
  ];

  const underwaterData = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
      y: [0, -3, -8, -15, -22, -18, -12, -16, -10, -5, -2, 0],
      mode: "lines",
      fill: "tozeroy",
      name: "Drawdown (%)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const sharpeData = [
    {
      x: ["Deposito", "Reksa dana A", "Reksa dana B", "Saham gorengan C"],
      y: [0.0, 1.1, 0.9, 0.4],
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1", "#5b9bd5", "#ef4444"] },
      text: ["0,0", "1,1", "0,9", "0,4"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Simple vs log return: kapan bedanya penting?
# Harga: 100 -> 110 -> 100 (naik 10%, lalu turun 10%)
p = [100, 110, 100]

simple = [(p[i]/p[i-1] - 1) for i in range(1, len(p))]
logret = [__import__('math').log(p[i]/p[i-1]) for i in range(1, len(p))]

print("Simple return:", [f"{r*100:+.1f}%" for r in simple], "-> total:", f"{sum(simple)*100:+.1f}%")
print("Log return   :", [f"{r*100:+.2f}%" for r in logret], "-> total:", f"{sum(logret)*100:+.2f}%")
print("Harga akhir  :", p[-1], "(kembali ke awal = 0% sesungguhnya)")
print()
print("Simple return MENYESATKAN jika dijumlah (+10-10=0% padahal rugi 1%).")
print("Log return JUJUR saat dijumlah (+9.53-10.54 = -1.00% -> e^-0.01 = 0.99).")
print()
print("Coba: p = [100, 150, 100] (naik 50%, turun 33%). Makin besar gerakan, makin besar sesatnya.")`;

  const lab2Code = `# Lab 2 — Sharpe, Sortino & max drawdown dari data return
import math
# Return bulanan (%) 12 bulan: strategi "jinak" vs "liar"
jinak = [1.2, 0.8, 1.5, -0.5, 1.0, 0.9, 1.1, -0.3, 1.3, 1.0, 0.7, 1.2]
liar  = [4.0, -3.0, 5.0, -4.0, 3.5, -2.5, 4.5, -5.0, 3.0, -1.0, 2.0, 6.0]
rf_bulanan = 0.4  # risk-free ~5%/12

def metrik(rs):
    n = len(rs)
    mean = sum(rs) / n
    var = sum((x - mean) ** 2 for x in rs) / n
    sd = math.sqrt(var)
    downside = [min(0, x - rf_bulanan) for x in rs]
    dd_var = sum(d ** 2 for d in downside) / n
    dd = math.sqrt(dd_var)
    sharpe = (mean - rf_bulanan) / sd * math.sqrt(12) if sd else 0
    sortino = (mean - rf_bulanan) / dd * math.sqrt(12) if dd else 0
    # max drawdown dari kurva ekuitas
    ekuitas, puncak, mdd = 100, 100, 0
    for r in rs:
        ekuitas *= (1 + r / 100)
        puncak = max(puncak, ekuitas)
        mdd = max(mdd, (puncak - ekuitas) / puncak)
    return sharpe, sortino, mdd

for nama, rs in [("Jinak", jinak), ("Liar", liar)]:
    s, so, mdd = metrik(rs)
    print(f"{nama}: Sharpe={s:.2f}  Sortino={so:.2f}  MaxDD={mdd*100:.1f}%")
print()
print("Perhatikan: 'Liar' return totalnya lebih besar, tapi Sharpe-nya?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E7 — Financial Markets</span>
        <h1 className="display-title">Return &amp; Risiko:<br />Dua Sisi Koin yang Sama</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Untung 20%&rdquo; yang Menipu</a></li>
          <li><a href="#simplelog">Simple vs Log Return</a></li>
          <li><a href="#vol">Volatilitas — Harga Ketidakpastian</a></li>
          <li><a href="#sharpe">Sharpe Ratio — Return per Satuan Risiko</a></li>
          <li><a href="#sortino">Sortino — Hanya Takut yang Jatuh</a></li>
          <li><a href="#drawdown">Drawdown — Luka Terdalam</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simple vs Log Return</a></li>
          <li><a href="#lab2">🔬 Lab 2: Sharpe, Sortino &amp; Max Drawdown</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Metrik Mana untuk Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Dua Reksa Dana</a></li>
          <li><a href="#worked1">🔬 Worked Example: Rata-rata Aritmetik vs Geometrik</a></li>
          <li><a href="#worked2">🔬 Worked Example: Sharpe &amp; Sortino Head-to-Head</a></li>
          <li><a href="#worked3">🔬 Worked Example: Matematika Drawdown — Lubang yang Dalam</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 &amp; Volatility Drag</a></li>
          <li><a href="#distribusi">🔧 Pendalaman: Risiko = Bentuk Distribusi, Bukan Satu Angka</a></li>
          <li><a href="#inforatio">🔧 Pendalaman: Information Ratio — Skill vs Keberuntungan</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menghitung Information Ratio</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan simple return dan log return serta menjelaskan kapan masing-masing dipakai.</li>
          <li>Menghitung volatilitas (standar deviasi return) dan menginterpretasikan angkanya.</li>
          <li>Menghitung dan menginterpretasikan Sharpe ratio, Sortino ratio, dan maximum drawdown.</li>
          <li>Memilih metrik risiko yang tepat untuk membandingkan dua investasi secara adil.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Untung 20%&rdquo; yang Menipu</h2>
      <div className="story">
        <p>Seorang <em>fund manager</em> pamer: <em>&ldquo;Portofolioku naik 20% tahun ini!&rdquo;</em> Kamu cek datanya: Januari–Juni naik 60%, Juli–Desember <strong>turun 25%</strong>. 1,60 × 0,75 = 1,20 — benar 20%. Tapi sepanjang Juli–Desember investornya <strong>stres berat</strong>: dari puncak Rp160 juta, portofolio anjlok ke Rp120 juta. Banyak yang <em>cut loss</em> di tengah jalan dan <strong>tidak pernah merasakan</strong> &ldquo;untung 20%&rdquo; itu.</p>
        <p>Return tanpa risiko = <strong>setengah cerita</strong>. Lesson ini memberimu kosakata lengkap untuk membaca sisi gelapnya: volatilitas, Sharpe, Sortino, dan drawdown — metrik yang dipakai setiap analis risiko profesional.</p>
        <p><strong>Twist-nya:</strong> fund manager itu tidak berbohong — 20% memang angka yang benar. Tapi &ldquo;benar&rdquo; dan &ldquo;jujur&rdquo; adalah dua hal berbeda: angka 20% menyembunyikan <em>jalan</em> menuju ke sana — jalan yang membuat sebagian investornya menyerah di tengah dan tidak pernah sampai. <strong>Return adalah destinasi; risiko adalah medannya.</strong> Menilai investasi hanya dari return = menilai penerbangan hanya dari kota tujuannya, tanpa peduli apakah pesawatnya melewati badai. Lesson ini memberimu instrumen navigasi untuk medannya.</p>
      </div>

      <h2 id="simplelog">Simple vs Log Return</h2>
      <p><strong>Definisi.</strong></p>
      <Tex math={String.raw`R_{\text{simple}} = \frac{P_t - P_{t-1}}{P_{t-1}}`} block />
      <Tex math={String.raw`r_{\text{log}} = \ln\left(\frac{P_t}{P_{t-1}}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`P_t`} /> = harga periode ini; <Tex math={String.raw`P_{t-1}`} /> = harga periode lalu. Simple = &ldquo;naik berapa persen&rdquo;; log = versi logaritma natural-nya.</p>
      <p><strong>Kenapa dua-duanya ada?</strong> Simple return intuitif tapi <strong>tidak bisa dijumlah</strong> antar periode (+10% lalu −10% ≠ 0%, melainkan −1%!). Log return <strong>bisa dijumlah</strong> — jumlah log return = log return total. Untuk pergerakan kecil keduanya hampir sama; untuk pergerakan besar bedanya signifikan.</p>
      <p><strong>Kepribadian:</strong> simple return = <em>bahasa manusia</em> (laporan ke investor); log return = <em>bahasa mesin</em> (riset, pemodelan, penjumlahan multi-periode).</p>
      <p><strong>Kapan memakai:</strong> laporan kinerja &amp; komunikasi → simple. Analisis kuantitatif, agregasi return, pemodelan (E11, E13) → log.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Naik 10% lalu turun 10% = impas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Rp100 → naik 10% = Rp110 → turun 10% = <strong>Rp99</strong> (rugi 1%!). Asimetri ini fundamental: <strong>untuk pulih dari rugi 50%, kamu butuh untung 100%</strong>. Makin dalam lukanya, makin curam pendakiannya — inilah mengapa menghindari kerugian besar lebih penting daripada mengejar untung besar.</p>
      </div>

      <h2 id="vol">Volatilitas — Harga Ketidakpastian</h2>
      <p><strong>Definisi.</strong> Volatilitas = <strong>standar deviasi return</strong> (biasanya ditahunkan):</p>
      <Tex math={String.raw`\sigma = \sqrt{\frac{1}{n}\sum_{t=1}^{n}(r_t - \bar{r})^2}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`r_t`} /> = return periode ke-<Tex math={String.raw`t`} />; <Tex math={String.raw`\bar{r}`} /> = rata-rata return; <Tex math={String.raw`n`} /> = jumlah periode. Satuannya <strong>% per periode</strong> — &ldquo;return tipikal menyimpang ±σ dari rata-ratanya&rdquo;.</p>
      <p><strong>Annualisasi:</strong> vol harian → tahunan: <Tex math={String.raw`\sigma_{\text{tahunan}} = \sigma_{\text{harian}} \times \sqrt{252}`} /> (252 hari bursa); vol bulanan × <Tex math={String.raw`\sqrt{12}`} />.</p>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Return bulanan: +2%, −1%, +3%, −2%, +1%.</p>
        <p><strong>Langkah 1</strong> — rata-rata: (2−1+3−2+1)/5 = 0,6%.<br />
        <strong>Langkah 2</strong> — simpangan kuadrat: (1,4)² + (−1,6)² + (2,4)² + (−2,6)² + (0,4)² = 1,96+2,56+5,76+6,76+0,16 = 17,2.<br />
        <strong>Langkah 3</strong> — variansi = 17,2/5 = 3,44 → σ bulanan = √3,44 = <strong>1,85%</strong>.<br />
        <strong>Langkah 4</strong> — tahunkan: 1,85% × √12 = <strong>6,4%/tahun</strong>.</p>
      </details>
      <p><strong>Kepribadian volatilitas:</strong> dia <em>pengukur guncangan</em> — bukan pengukur &ldquo;bahaya&rdquo; murni. Volatilitas tinggi ke <em>atas</em> (sering untung besar) tetap tercatat sebagai &ldquo;risiko&rdquo; di sini — kelemahan yang diperbaiki Sortino.</p>

      <PlotlyChart
        data={distData}
        title="Return Sama, Risiko Beda: Dua Reksa Dana (ilustratif)"
        layout={{ barmode: "overlay", xaxis: { title: "Return bulanan (%)" }, yaxis: { title: "Frekuensi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua histogram return bulanan yang ditumpuk. Keduanya punya rata-rata sama (+1%/bulan).</p>
        <p><strong>Interpretasi:</strong> A (biru) <strong>ramping &amp; tinggi</strong> — return menumpuk di tengah (vol rendah). B (kuning) <strong>lebar &amp; pendek</strong> — sering dapat ±5% (vol tinggi). Rata-rata sama, pengalaman beda jauh: B membuatmu begadang. <strong>Pelajaran:</strong> jangan pernah menilai investasi dari return rata-rata saja — selalu tanya sebarannya.</p>
      </div>

      <h2 id="sharpe">Sharpe Ratio — Return per Satuan Risiko</h2>
      <p><strong>Definisi.</strong> Berapa <em>kelebihan return</em> di atas aset bebas risiko yang kamu dapat <strong>per satu satuan volatilitas</strong>:</p>
      <Tex math={String.raw`S = \frac{\bar{r}_p - r_f}{\sigma_p}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\bar{r}_p`} /> = rata-rata return portofolio; <Tex math={String.raw`r_f`} /> = <em>risk-free rate</em> (misal SBN/deposito); <Tex math={String.raw`\sigma_p`} /> = volatilitas portofolio. Satuannya &ldquo;per tahun&rdquo; jika input tahunan.</p>
      <p><strong>Cara baca angka:</strong> S &lt; 0 = lebih buruk dari deposito; 0–1 = lumayan; 1–2 = bagus; &gt; 2 = luar biasa (atau strateginya belum ketemu masa sulitnya).</p>
      <p><strong>Contoh:</strong> portofolio return 12%, vol 10%, risk-free 5% → S = (12−5)/10 = <strong>0,7</strong>.</p>
      <p><strong>Kepribadian Sharpe:</strong> dia <em>wasit adil</em> — tidak terkesan oleh return besar jika dibayar dengan guncangan besar. Fund manager yang pamer &ldquo;return 30%&rdquo; dengan vol 40% (S = 0,6) kalah dari yang &ldquo;return 12%&rdquo; dengan vol 8% (S = 0,9).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sharpe tinggi = pasti aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Sharpe memakai <strong>volatilitas historis</strong> — ia buta terhadap risiko yang <em>belum pernah terjadi</em> di data (<em>tail risk</em>). Strategi &ldquo;menjual asuransi&rdquo; (untung kecil tiap bulan, lalu bangkrut sekali) punya Sharpe <strong>tinggi</strong> sampai hari kiamatnya tiba. Selalu pasangkan Sharpe dengan <strong>drawdown</strong> &amp; stress test (E13).</p>
      </div>

      <h2 id="sortino">Sortino — Hanya Takut yang Jatuh</h2>
      <p><strong>Definisi.</strong> Seperti Sharpe, tapi penyebutnya hanya <strong>volatilitas downside</strong> (return di bawah target):</p>
      <Tex math={String.raw`So = \frac{\bar{r}_p - r_f}{\sigma_{\text{downside}}}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\sigma_{\text{downside}}`} /> dihitung hanya dari return yang <em>mengecewakan</em> (di bawah risk-free/target). Volatilitas ke atas (untung besar) <strong>tidak dihukum</strong>.</p>
      <p><strong>Kapan memakai:</strong> return asimetris (misal strategi options, portofolio terproteksi) — di mana &ldquo;guncangan ke atas&rdquo; memang tujuannya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Sharpe = &ldquo;apakah guncangannya sepadan?&rdquo;, Sortino = &ldquo;apakah <em>jatuhnya</em> sepadan?&rdquo;. Investor normal lebih peduli yang kedua — tidak ada yang komplain karena untungnya <em>terlalu stabil ke atas</em>.</p>
      </div>

      <h2 id="drawdown">Drawdown — Luka Terdalam</h2>
      <p><strong>Definisi.</strong> <em>Drawdown</em> = penurunan dari <strong>puncak terakhir</strong> ke titik terendah, sebelum kembali ke puncak baru:</p>
      <Tex math={String.raw`DD_t = \frac{\text{Puncak}_t - \text{Nilai}_t}{\text{Puncak}_t}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\text{Puncak}_t`} /> = nilai tertinggi yang pernah dicapai sampai waktu t. <em>Maximum drawdown</em> (MaxDD) = drawdown terbesar sepanjang sejarah — &ldquo;luka terdalam yang pernah dialami strategi ini&rdquo;.</p>
      <p><strong>Kenapa penting:</strong> drawdown mengukur <strong>pengalaman</strong> investor, bukan statistik abstrak. MaxDD 30% artinya pernah ada masa di mana Rp100 juta menjadi Rp70 juta — dan banyak investor <strong>menyerah</strong> tepat di dasarnya.</p>

      <PlotlyChart
        data={underwaterData}
        title="Underwater Chart: Berapa Lama 'Tenggelam' (ilustratif)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Drawdown (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu Y = seberapa jauh di bawah puncak terakhir (0% = di puncak/all-time high). Area merah = sedang &ldquo;tenggelam&rdquo;.</p>
        <p><strong>Interpretasi:</strong> strategi ini tenggelam hingga <strong>−22%</strong> (Mei) dan butuh <strong>7 bulan</strong> untuk kembali ke permukaan (Des). Dua info kritis: <em>kedalaman</em> luka (bisakah kamu tidur dengan −22%?) dan <em>durasi</em> pemulihan (sanggupkah menunggu 7 bulan?). Return akhir tahun = 0% — tapi perjalanannya brutal.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga pertanyaan sebelum percaya strategi apapun: (1) <strong>Sharpe</strong>-nya berapa? (return per guncangan), (2) <strong>MaxDD</strong>-nya berapa? (luka terdalam), (3) <strong>berapa lama</strong> pemulihannya? Kalau penjualnya tidak bisa menjawab ketiganya — dia menjual mimpi, bukan strategi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simple vs Log Return</h2>
      <p>Buktikan dengan tanganmu: kenapa +10% lalu −10% tidak impas, dan kenapa analis kuantitatif memakai log return.</p>
      <PyodideLab
        title="Lab 1 — Jebakan Penjumlahan Simple Return"
        hint="Coba: p = [100, 200, 100] (naik 100% lalu turun 50%). Simple return total = +50%?! Padahal harga kembali ke 100. Log return tetap jujur."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Sharpe, Sortino &amp; Max Drawdown</h2>
      <p>Hitung metrik lengkap dua strategi. Mana yang return totalnya lebih besar — dan mana yang Sharpe-nya lebih baik?</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Metrik Risiko Lengkap"
        hint="Ubah angka liar: jadikan bulan-bulan negatifnya lebih dalam (-8.0). Perhatikan Sharpe jatuh, tapi Sortino jatuh LEBIH dalam — karena ia fokus ke downside."
        defaultCode={lab2Code}
      />

      <PlotlyChart
        data={sharpeData}
        title="Sharpe Ratio: Siapa Paling Efisien? (ilustratif)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Sharpe ratio" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = Sharpe ratio tiap produk. Garis mental di 1,0 = batas &ldquo;bagus&rdquo;.</p>
        <p><strong>Interpretasi:</strong> &ldquo;saham gorengan C&rdquo; mungkin return-nya paling heboh, tapi Sharpe-nya <strong>paling rendah</strong> (0,4) — guncangannya tidak sepadan. Reksa dana A (1,1) mengalahkan B (0,9) meski return-nya lebih &ldquo;sepi&rdquo;. <strong>Pelajaran:</strong> kehebatan return tanpa normalisasi risiko = ilusi.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Metrik Mana untuk Apa</h2>

      <div className="decision-card">
        <h3>1. Bandingkan dua reksa dana sejenis → <strong>Sharpe ratio</strong></h3>
        <p><strong>Kondisi:</strong> kategori sama, ingin tahu mana paling efisien.</p>
        <p><strong>Kenapa:</strong> Sharpe menormalkan return terhadap guncangan — apel vs apel yang adil.</p>
        <p><strong>Contoh nyata:</strong> pilih reksa dana saham A (return 14%, vol 12%) vs B (return 16%, vol 18%).</p>
      </div>

      <div className="decision-card">
        <h3>2. Strategi return asimetris (proteksi downside) → <strong>Sortino</strong></h3>
        <p><strong>Kondisi:</strong> volatilitas ke atas adalah fitur, bukan bug.</p>
        <p><strong>Kenapa:</strong> Sharpe menghukum upside; Sortino hanya menghukum downside.</p>
        <p><strong>Contoh nyata:</strong> strategi terproteksi put options, structured product.</p>
      </div>

      <div className="decision-card">
        <h3>3. &ldquo;Sanggupkah aku menahannya?&rdquo; → <strong>Max drawdown + durasi pemulihan</strong></h3>
        <p><strong>Kondisi:</strong> menilai ketahanan mental &amp; likuiditas pribadi.</p>
        <p><strong>Kenapa:</strong> statistik tidak begadang — manusia yang begadang. MaxDD = skenario terburuk historis yang harus kamu <em>bayangkan</em> terjadi padamu.</p>
        <p><strong>Contoh nyata:</strong> pensiun 5 tahun lagi → hindari strategi ber-MaxDD 40%.</p>
      </div>

      <div className="decision-card">
        <h3>4. Agregasi return multi-periode / riset → <strong>Log return</strong></h3>
        <p><strong>Kondisi:</strong> menjumlahkan return harian/bulanan, pemodelan statistik.</p>
        <p><strong>Kenapa:</strong> log return aditif &amp; simetris — simple return menyesatkan saat dijumlah.</p>
        <p><strong>Contoh nyata:</strong> menghitung vol tahunan dari data harian (E13 memakai ini).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Return tanpa risiko = dongeng.</strong> Selalu tanya: vol-nya? Sharpe-nya? MaxDD-nya?</li>
          <li><strong>Rugi 50% butuh untung 100% untuk pulih.</strong> Lindungi downside dulu.</li>
          <li><strong>Sharpe tinggi + MaxDD tidak diketahui = curigai.</strong> Minta underwater chart-nya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Dua Reksa Dana</h2>
      <div className="callout">
        <p>Reksa dana <strong>GEBYAR</strong>: return 3 tahun 45% (rata-rata 13%/thn), vol 22%/thn, MaxDD −28% (2022, pulih 14 bulan). Reksa dana <strong>TENANG</strong>: return 3 tahun 33% (rata-rata 10%/thn), vol 8%/thn, MaxDD −9% (pulih 4 bulan). Risk-free 5%.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung Sharpe keduanya. Mana lebih efisien? (b) Budi (35 thn, horizon 20 thn, tahan gejolak) vs Pak Anwar (58 thn, pensiun 2 thn lagi) — rekomendasikan masing-masing. (c) Apa yang <strong>tidak</strong> ditangkap Sharpe di sini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) GEBYAR: (13−5)/22 = <strong>0,36</strong>. TENANG: (10−5)/8 = <strong>0,63</strong>. TENANG lebih efisien — tiap persen guncangan dibayar return lebih baik.</p>
          <p>(b) <strong>Budi → GEBYAR boleh</strong> (horizon 20 thn, sanggup menunggu 14 bulan pemulihan; return ekspektasi lebih tinggi). <strong>Pak Anwar → TENANG</strong> (butuh uang 2 tahun lagi; MaxDD −28% bisa memaksanya jual di dasar untuk biaya hidup).</p>
          <p>(c) <strong>Durasi drawdown</strong> (14 vs 4 bulan), <strong>tail risk</strong> (apakah −28% itu &ldquo;puncak&rdquo; atau baru pemanasan?), dan <strong>apakah return masa lalu terulang</strong> (manajer &amp; strategi bisa berubah).</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Dua &ldquo;Rata-rata&rdquo; yang Bercerita Berbeda</h2>
      <p>Reksa dana &ldquo;Roller Coaster&rdquo;: Tahun 1 <strong>+60%</strong>, Tahun 2 <strong>−25%</strong>. Iklannya menulis &ldquo;rata-rata return 17,5%/tahun&rdquo;. Benarkah investor mendapat 17,5% per tahun?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rata-rata aritmetik:</strong> (60 + (−25)) &divide; 2 = <strong>17,5%</strong>. ✓ (Iklan tidak berbohong.)</p>
        <p><strong>Langkah 2 — Yang benar-benar terjadi pada Rp100 juta:</strong> 100 &times; 1,60 = 160 &rarr; 160 &times; 0,75 = <strong>Rp120 juta</strong>.</p>
        <p><strong>Langkah 3 — Rata-rata geometrik (CAGR):</strong> <Tex math={String.raw`(120/100)^{1/2} - 1 = \sqrt{1{,}20} - 1 \approx 9{,}54\%`} /> per tahun.</p>
        <p><strong>Selisihnya:</strong> 17,5% vs 9,54% — <strong>hampir 8 poin persentase!</strong> Inilah <em>volatility drag</em>: volatilitas &ldquo;memakan&rdquo; return majemuk. Rumus kasarnya: <Tex math={String.raw`r_{geo} \approx r_{arit} - \sigma^2/2`} /> — makin liar ayunannya, makin besar yang dimakan.</p>
        <p><strong>Intuisi:</strong> rata-rata aritmetik menjawab &ldquo;berapa return <em>rata-rata per tahun</em>?&rdquo;; geometrik menjawab &ldquo;berapa <em>kekayaanku</em> tumbuh per tahun?&rdquo; — dan hanya yang kedua yang bisa dibelanjakan. Iklan produk investasi <em>selalu</em> memakai yang pertama jika terlihat lebih bagus. Sekarang kamu tahu kenapa.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Sharpe vs Sortino — Adu Dua Fund Manager</h2>
      <p>Manager A: return 14%/thn, volatilitas 16%/thn. Manager B: return 12%/thn, volatilitas 10%/thn. Risk-free 4%. Siapa lebih baik <em>per unit risiko</em>? Dan bagaimana jika volatilitas B sebagian besar adalah &ldquo;kejutan naik&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Sharpe ratio</strong> = (return − risk-free) &divide; volatilitas.</p>
        <p>A: (14 − 4) &divide; 16 = <strong>0,625</strong>. B: (12 − 4) &divide; 10 = <strong>0,80</strong>.</p>
        <p><strong>Langkah 2 — Putusan Sharpe:</strong> B menang (0,80 &gt; 0,625) — tiap unit &ldquo;guncangan&rdquo; dibayar lebih mahal.</p>
        <p><strong>Langkah 3 — Sortino ratio</strong> = (return − target) &divide; <em>downside deviation</em> (hanya volatilitas ke <em>bawah</em>). Misal downside-dev A = 14%, B = 5% (B jarang turun tajam):</p>
        <p>A: (14 − 4) &divide; 14 ≈ <strong>0,71</strong>. B: (12 − 4) &divide; 5 = <strong>1,60</strong>.</p>
        <p><strong>Intuisi:</strong> Sharpe menghukum <em>semua</em> guncangan — termasuk lonjakan naik yang kamu suka! Sortino hanya menghukum guncangan ke bawah. Dana yang sering &ldquo;melompat naik&rdquo; terlihat buruk di Sharpe tapi bersinar di Sortino. Gunakan <strong>keduanya</strong>: Sharpe untuk perbandingan standar industri, Sortino untuk menilai &ldquo;risiko yang benar-benar menyakitkan&rdquo;.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Matematika Drawdown — Kenapa −50% Butuh +100%</h2>
      <p>Portofolio Rp200 juta jatuh <strong>−50%</strong> (krisis). Berapa return yang dibutuhkan untuk kembali ke Rp200 juta?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai setelah jatuh:</strong> 200 &times; 0,50 = <strong>Rp100 juta</strong>.</p>
        <p><strong>Langkah 2 — Kebutuhan pemulihan:</strong> (200 − 100) &divide; 100 = <strong>+100%</strong>. Bukan +50%!</p>
        <p><strong>Tabel pemulihan:</strong> −10% &rarr; butuh +11,1% &rarr; −20% &rarr; +25% &rarr; −30% &rarr; +42,9% &rarr; −50% &rarr; +100% &rarr; −80% &rarr; <strong>+400%</strong>.</p>
        <p><strong>Intuisi:</strong> drawdown bersifat <strong>asimetris dan non-linear</strong> — lubang makin dalam, tangga keluarnya makin curam <em>eksponensial</em>. Inilah alasan matematis di balik nasihat &ldquo;utamakan jangan rugi&rdquo; (Buffett): menghindari −30% <em>jauh</em> lebih berharga daripada mengejar +30%. Manajemen risiko = manajemen <em>asimetri</em> ini.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2008 — Ketika &ldquo;Risiko Terukur&rdquo; Menjadi Lelucon</h2>
      <p>Sebelum 2008, bank-bank global memakai model risiko canggih (VaR — lihat E13) yang &ldquo;membuktikan&rdquo; portofolio mereka aman. Lalu:</p>
      <ul>
        <li>Indeks S&amp;P 500 jatuh <strong>−57%</strong> dari puncak 2007 ke dasar Maret 2009. Pemulihan ke level semula butuh <strong>~5,5 tahun</strong> (matematika Worked 3 bekerja brutal di skala triliunan dolar).</li>
        <li>Volatilitas (VIX) melonjak dari ~20 ke <strong>80</strong> — model yang memakai data 3 tahun terakhir &ldquo;tidak pernah melihat&rdquo; angka setinggi ini, sehingga <em>meremehkan</em> risiko justru saat risiko terbesar.</li>
        <li><strong>LTCM 1998</strong> adalah prekuelnya: hedge fund berisi peraih Nobel, modelnya &ldquo;sempurna&rdquo; secara matematis — bangkrut karena model mengasumsikan likuiditas selalu ada. Saat semua orang menjual bersamaan, <strong>korelasi antar aset melonjak ke 1</strong> (lihat E8!) dan diversifikasi menguap.</li>
      </ul>
      <p><strong>Pelajaran abadi:</strong> (1) <strong>risiko yang bisa diukur dengan rapi ≠ risiko yang sebenarnya</strong> — model mengukur masa lalu, bukan masa depan; (2) <strong>risiko terbesar = yang membuatmu terpaksa menjual di dasar</strong> (<em>forced selling</em>: margin call, penarikan dana) — bukan angka volatilitasnya; (3) <strong>likuiditas adalah bagian dari risiko</strong> — aset &ldquo;aman&rdquo; yang tidak bisa dijual saat dibutuhkan = tidak aman.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada tiga &ldquo;rasa&rdquo; return yang wajib dibedakan: <strong>return kotor</strong> (sebelum biaya), <strong>return bersih</strong> (setelah fee &amp; pajak — yang benar-benar kamu terima), dan <strong>return riil</strong> (bersih − inflasi = daya beli). Dana yang &ldquo;return 12%&rdquo; dengan fee 2% + pajak 10% + inflasi 4% = return riil ≈ <strong>4,8%</strong>. Selalu tanya: <em>return yang mana yang sedang dibicarakan?</em></p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas tinggi = risiko tinggi, selalu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> volatilitas = <em>simpangan dua arah</em>. Saham yang 5 tahun naik 15%/tahun dengan ayunan ±20% &ldquo;berisiko&rdquo; menurut volatilitas — tapi investor jangka panjangnya makmur. Sebaliknya deposito &ldquo;tanpa volatilitas&rdquo; punya <strong>risiko inflasi yang pasti</strong>: daya beli tergerus 3–4%/tahun, dijamin, tanpa guncangan. Risiko sejati = <strong>probabilitas tidak mencapai tujuan keuanganmu</strong> — bukan besarnya guncangan harian.</p>
      </div>

      <h2 id="distribusi">🔧 Pendalaman: Risiko = Bentuk Distribusi, Bukan Satu Angka</h2>
      <p>Volatilitas (standar deviasi) mengasumsikan return terdistribusi <strong>normal/simetris</strong> — naik-turun seimbang seperti lonceng. Dunia nyata <strong>tidak sopan</strong> seperti itu:</p>
      <ul>
        <li><strong>Skewness negatif</strong> (ekor kiri panjang): strategi &ldquo;memungut receh di depan buldoser&rdquo; — untung kecil tiap bulan, lalu sekali-sekali rugi besar (menjual opsi, <em>carry trade</em>). Volatilitasnya <em>kecil</em> — terlihat &ldquo;aman&rdquo; — sampai ekornya datang. 2008 = ekor kiri bagi seluruh sistem.</li>
        <li><strong>Kurtosis tinggi</strong> (<em>fat tails</em>): kejadian ekstrem lebih sering dari prediksi lonceng normal. &ldquo;Peristiwa 5-sigma&rdquo; yang menurut model terjadi sekali per 7.000 tahun, di pasar terjadi <strong>tiap beberapa tahun</strong> (1987, 1998, 2008, 2020).</li>
        <li><strong>Implikasi:</strong> dua investasi dengan return &amp; volatilitas <em>identik</em> bisa punya profil bahaya yang <em>sangat beda</em> — satu lonceng simetris, satu bom waktu berekor. Inilah kenapa analis risiko profesional melihat <strong>seluruh distribusi</strong> (histogram, VaR, expected shortfall — E13), bukan satu angka sigma.</li>
      </ul>
      <p><strong>Aturan praktis:</strong> jika sebuah strategi menawarkan &ldquo;return stabil di atas pasar dengan volatilitas rendah&rdquo; — curigai <strong>ekor kirinya</strong>. Tanyakan: <em>kapan terakhir strategi ini rugi besar, dan apa pemicunya?</em> Jika jawabannya &ldquo;tidak pernah&rdquo; — itu bukan jawaban yang menenangkan. Itu <em>alarm</em>.</p>


      <h2 id="inforatio">🔧 Pendalaman: Information Ratio — Memisahkan Skill dari Keberuntungan</h2>
      <p>Sharpe mengukur return vs <em>kas</em>. Tapi manajer aktif tidak dibandingkan dengan kas — ia dibandingkan dengan <strong>benchmark</strong> (IHSG, S&amp;P 500). Metriknya: <strong>Information Ratio (IR)</strong> = <em>active return</em> ÷ <em>tracking error</em>.</p>
      <ul>
        <li><strong>Active return:</strong> return portofolio − return benchmark. &ldquo;Seberapa jauh kamu mengalahkan (atau kalah dari) indeks?&rdquo;</li>
        <li><strong>Tracking error:</strong> volatilitas dari <em>selisih</em> itu (standar deviasi active return). &ldquo;Seberapa liar selisihnya berayun?&rdquo;</li>
        <li><strong>IR = active return / tracking error:</strong> &ldquo;tiap unit <em>penyimpangan dari indeks</em>, berapa kelebihan return yang dihasilkan?&rdquo;</li>
      </ul>
      <p><strong>Skala penilaian industri:</strong> IR &lt; 0 = menghancurkan nilai (bayar fee untuk kalah dari indeks!). IR 0–0,5 = biasa. IR ~0,5 = bagus. IR &gt; 1,0 = <strong>luar biasa</strong> (sangat jarang persisten). <strong>Hukum fundamental manajemen aktif</strong> (Grinold-Kahn): IR ≈ IC × √Breadth — <em>skill per taruhan</em> (IC, information coefficient) × <em>akar jumlah taruhan independen</em>. Artinya: manajer hebat = <strong>sedikit lebih benar, dalam banyak taruhan kecil</strong> — bukan satu taruhan raksasa yang benar.</p>
      <h2 id="worked4">🔬 Worked Example: IR Manajer &ldquo;Cuan Abadi&rdquo; — Hebat atau Hoki?</h2>
      <p>Data 5 tahun: return tahunan Cuan Abadi vs IHSG (benchmark):</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Tahun</th><th>Cuan Abadi</th><th>IHSG</th><th>Active</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>18%</td><td>12%</td><td>+6%</td></tr>
          <tr><td>2</td><td>−5%</td><td>−8%</td><td>+3%</td></tr>
          <tr><td>3</td><td>22%</td><td>20%</td><td>+2%</td></tr>
          <tr><td>4</td><td>8%</td><td>10%</td><td>−2%</td></tr>
          <tr><td>5</td><td>15%</td><td>11%</td><td>+4%</td></tr>
        </tbody>
      </table>
      </div>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rata-rata active return:</strong> (6 + 3 + 2 − 2 + 4) ÷ 5 = <strong>2,6%/tahun</strong>.</p>
        <p><strong>Langkah 2 — Tracking error</strong> (std dev active): deviasi dari 2,6: (3,4; 0,4; −0,6; −4,6; 1,4). Varians = (11,56 + 0,16 + 0,36 + 21,16 + 1,96)/4 = 8,8 &rarr; TE = √8,8 ≈ <strong>2,97%</strong>.</p>
        <p><strong>Langkah 3 — IR:</strong> 2,6 ÷ 2,97 ≈ <strong>0,88</strong> — <em>sangat bagus</em> (mendekati 1,0!).</p>
        <p><strong>Tapi tunggu — uji keberuntungan:</strong> t-statistik ≈ IR × √T = 0,88 × √5 ≈ <strong>1,97</strong> — <em>di ambang</em> signifikansi 95% (≈2,0). Lima tahun data <strong>belum cukup</strong> untuk menyatakan skill dengan yakin! Inilah kenapa industri menuntut <strong>track record 7–10 tahun</strong>: dengan T kecil, IR tinggi bisa jadi hoki. <strong>Aturan: jangan bayar fee mahal untuk IR yang belum signifikan.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Manajer yang 5 tahun berturut-turut mengalahkan indeks = pasti hebat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> peluang manajer <em>tanpa skill</em> (lempar koin) mengalahkan indeks 5 tahun beruntun = (1/2)<sup>5</sup> = <strong>3,1%</strong> — kecil per manajer, tapi dari <strong>10.000 manajer</strong> akan ada ~312 yang &ldquo;hebat&rdquo; murni kebetulan! (<em>multiple testing</em> — E16 Worked 2!). Industri dana = <strong>mesin seleksi survivorship</strong>: yang hoki dipromosikan, yang sial dilikuidasi diam-diam. Selalu tanya: <em>berapa banyak manajer sejenis yang <strong>gagal</strong> dan hilang dari data?</em></p>
      </div>


      <h2 id="quiz">✏️ Quiz — Dua Sisi Koin (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Rp100 jt naik 50% lalu turun 50%. Nilai akhir?"
        options={[
          "Rp100 jt (impas)",
          "Rp75 jt — asimetri rugi!",
          "Rp125 jt",
          "Rp50 jt",
        ]}
        correct={1}
        explanation="Benar: 100 × 1,5 = 150; 150 × 0,5 = 75. Rugi 50% butuh untung 100% untuk pulih — bukan 50%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kenapa analis kuantitatif memakai log return untuk agregasi?"
        options={[
          "Karena lebih besar angkanya",
          "Karena log return bisa dijumlah antar periode dengan benar",
          "Karena wajib oleh OJK",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: aditif. Jumlah log return = log return total. Simple return menyesatkan jika dijumlah (+10% −10% ≠ 0%)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Portofolio return 12%, vol 10%, risk-free 5%. Sharpe?"
        options={[
          "1,2",
          "0,7 ((12−5)/10)",
          "1,7",
          "0,5",
        ]}
        correct={1}
        explanation="Benar: 0,7. Kelebihan return 7% dibagi vol 10% = 0,7 satuan return per satuan guncangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Strategi punya Sharpe 2,5 tapi MaxDD tidak diketahui. Respons tepat?"
        options={[
          "Langsung investasi — Sharpe luar biasa",
          "Curigai: minta underwater chart & MaxDD — Sharpe buta terhadap tail risk",
          "Sharpe tidak penting",
          "Minta return-nya saja",
        ]}
        correct={1}
        explanation="Benar: curigai. Strategi 'jual asuransi' (untung kecil rutin, bangkrut sesekali) punya Sharpe tinggi sampai kiamatnya tiba."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan Sortino lebih tepat dari Sharpe?"
        options={[
          "Selalu",
          "Tidak pernah",
          "Saat return asimetris — volatilitas ke atas adalah tujuan, hanya downside yang ditakuti",
          "Saat risk-free nol",
        ]}
        correct={2}
        explanation="Benar: Sortino hanya menghukum downside volatility. Cocok untuk strategi terproteksi di mana upside volatility memang diinginkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Underwater chart menunjukkan MaxDD −22% dengan pemulihan 7 bulan. Artinya…"
        options={[
          "Strategi rugi 22% per tahun",
          "Pernah ada periode jatuh 22% dari puncak dan butuh 7 bulan kembali ke puncak",
          "Strategi bangkrut",
          "Volatilitas 22%",
        ]}
        correct={1}
        explanation="Benar: drawdown = jarak dari puncak terakhir. −22% terdalam + 7 bulan tenggelam = ukuran 'pengalaman' investor, bukan sekadar statistik."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Simple return</strong> untuk komunikasi; <strong>log return</strong> untuk agregasi/riset (aditif &amp; jujur).</li>
          <li><strong>Volatilitas</strong> = SD return (tahunan: ×√252 harian / ×√12 bulanan) — pengukur guncangan.</li>
          <li><strong>Sharpe = (r̄ − r<sub>f</sub>)/σ</strong> — return per satuan guncangan; &gt;1 bagus, tapi buta tail risk.</li>
          <li><strong>Sortino</strong> — seperti Sharpe tapi hanya menghukum downside.</li>
          <li><strong>Max drawdown</strong> — luka terdalam dari puncak; ukur juga <em>durasi</em> pemulihannya.</li>
          <li>Rugi 50% butuh untung 100% untuk pulih — <strong>lindungi downside dulu</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e6-ekuitas" className="btn btn-secondary btn-sm">← E6</Link>
        <Link href="/learn/e8-markowitz" className="btn btn-primary btn-sm">Next: E8 →</Link>
      </div>
    </div>
  );
}
