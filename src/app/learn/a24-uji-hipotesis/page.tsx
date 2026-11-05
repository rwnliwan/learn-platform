"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function normPdf(x: number, mu: number, sd: number) {
  return Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
}

export default function A24Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: distribusi null dengan daerah penolakan (uji dua sisi, alpha=5%)
  const xs: number[] = [];
  for (let x = -4; x <= 4; x += 0.05) xs.push(Math.round(x * 100) / 100);
  const nullCurve = {
    x: xs,
    y: xs.map((x) => normPdf(x, 0, 1)),
    type: "scatter",
    mode: "lines",
    name: "Distribusi di bawah H0",
    line: { color: "#2a7de1" },
  };
  const leftTail = {
    x: xs.filter((x) => x <= -1.96),
    y: xs.filter((x) => x <= -1.96).map((x) => normPdf(x, 0, 1)),
    type: "scatter",
    mode: "lines",
    fill: "tozeroy",
    name: "Daerah tolak (α/2)",
    line: { color: "#c2410c" },
  };
  const rightTail = {
    x: xs.filter((x) => x >= 1.96),
    y: xs.filter((x) => x >= 1.96).map((x) => normPdf(x, 0, 1)),
    type: "scatter",
    mode: "lines",
    fill: "tozeroy",
    name: "Daerah tolak (α/2)",
    line: { color: "#c2410c" },
    showlegend: false,
  };

  // Chart 2: distribusi p-value di bawah H0 (uniform) vs di bawah H1 (miring ke 0)
  const pBins = ["0–0.1", "0.1–0.2", "0.2–0.3", "0.3–0.4", "0.4–0.5", "0.5–0.6", "0.6–0.7", "0.7–0.8", "0.8–0.9", "0.9–1.0"];
  const pvalueData = [
    {
      x: pBins,
      y: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      type: "bar",
      name: "Di bawah H0 (tidak ada efek)",
      marker: { color: "#94a3b8" },
    },
    {
      x: pBins,
      y: [52, 14, 9, 6, 5, 4, 3, 3, 2, 2],
      type: "bar",
      name: "Di bawah H1 (ada efek nyata)",
      marker: { color: "#2a7de1" },
    },
  ];

  // Chart 3: tabel error tipe I/II sebagai heatmap konseptual (bar)
  const errorData = [
    {
      x: ["H0 benar,<br>tolak H0", "H0 benar,<br>gagal tolak", "H1 benar,<br>tolak H0", "H1 benar,<br>gagal tolak"],
      y: [5, 95, 80, 20],
      type: "bar",
      marker: { color: ["#c2410c", "#94a3b8", "#16a34a", "#e8a838"] },
      text: ["Error Tipe I (α)", "Benar", "Power (1−β)", "Error Tipe II (β)"],
      textposition: "outside",
    },
  ];

  const lab1Code = `import random, math

random.seed(24)
# Situasi: koin ADIL (H0 benar: p = 0.5). Uji "apakah koin bias?"
# Kita hitung p-value dua sisi via aproksimasi normal, ulangi 2000x.

def p_value(x, n, p0=0.5):
    phat = x / n
    se = math.sqrt(p0*(1-p0)/n)
    z = abs(phat - p0) / se
    # P(|Z| > z) dua sisi
    Phi = 0.5*(1 + math.erf(z/math.sqrt(2)))
    return 2*(1 - Phi)

n = 100
pvals = []
for _ in range(2000):
    x = sum(random.random() < 0.5 for _ in range(n))  # koin adil!
    pvals.append(p_value(x, n))

# Histogram kasar p-value
bins = [0]*10
for p in pvals:
    bins[min(int(p*10), 9)] += 1
print("Distribusi p-value saat H0 BENAR (koin adil):")
for i, b in enumerate(bins):
    print(f"  p di [{i/10:.1f},{(i+1)/10:.1f}): {'#'*(b//40)} {b/2000:.1%}")

sig = sum(1 for p in pvals if p < 0.05) / 2000
print(f"\nProporsi 'signifikan' (p<0.05): {sig:.1%}  <- inilah α = 5%!")
print("Pesan: p-value dari H0 yang benar tersebar UNIFORM —")
print("5% di antaranya akan 'signifikan' murni karena kebetulan.")
print("\nCoba: ubah n jadi 1000. Apa yang berubah? (Petunjuk: tidak banyak!)")`;

  const lab2Code = `import random, math

random.seed(77)
# Power: peluang mendeteksi efek yang BENAR-BENAR ADA.
# Koin sebenarnya bias: p = 0.6. Berapa sering uji kita "menangkapnya"?

def p_value(x, n, p0=0.5):
    phat = x / n
    se = math.sqrt(p0*(1-p0)/n)
    z = abs(phat - p0) / se
    Phi = 0.5*(1 + math.erf(z/math.sqrt(2)))
    return 2*(1 - Phi)

p_true = 0.6
print(f"Koin sebenarnya bias (p={p_true}). Uji H0: p=0.5, α=5%.")
print(f"{'n':>6}  {'Power (terdeteksi)':>20}  {'Error Tipe II':>13}")
for n in [25, 100, 400, 1600]:
    det = sum(1 for _ in range(2000)
              if p_value(sum(random.random() < p_true for _ in range(n)), n) < 0.05) / 2000
    print(f"{n:>6}  {det:>19.1%}  {1-det:>12.1%}")

print()
print("n=25: efek nyata 60% vs 50% hanya terdeteksi ~30% —")
print("kebanyakan 'gagal tolak' BUKAN bukti koin adil, tapi power kurang!")
print("Coba: ubah p_true jadi 0.55 (efek lebih kecil). Perhatikan power anjlok.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.4 — Statistika Inferensial</span>
        <h1 className="display-title">Pengadilan untuk Angka:<br />Uji Hipotesis, p-value &amp; Power</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> <strong>Interval kepercayaan</strong> menjawab &ldquo;di mana parameter berada&rdquo; dengan rentang. <strong>Uji hipotesis</strong> menjawab pertanyaan kembarannya: &ldquo;apakah klaim tentang parameter ini bisa dipercaya?&rdquo; Keduanya memakai mesin yang sama — <strong>distribusi sampling</strong> — dan keduanya dua sisi dari satu koin (secara matematis, interval 95% dual dengan uji pada α = 5%).</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Obat yang &ldquo;Terbukti&rdquo; Manjur</a></li>
          <li><a href="#kerangka">Kerangka Pengadilan: H0, H1 &amp; Statistik Uji</a></li>
          <li><a href="#pvalue">p-value — Angka Paling Disalahpahami dalam Sains</a></li>
          <li><a href="#error">Error Tipe I &amp; II — Dua Cara Pengadilan Salah</a></li>
          <li><a href="#power">Power — Kemampuan Menangkap Efek Nyata</a></li>
          <li><a href="#lab1">🔬 Lab 1: p-value di Bawah H0 Tersebar Uniform</a></li>
          <li><a href="#lab2">🔬 Lab 2: Power — Menangkap Koin yang Bias</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Membaca Hasil Uji</a></li>
          <li><a href="#case">📋 Mini-Case: Alert Fraud yang Terlalu Rajin</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyusun <strong>H0/H1</strong> dan menjelaskan logika &ldquo;pengadilan&rdquo; uji hipotesis dengan bahasa sendiri.</li>
          <li>Mendefinisikan <strong>p-value</strong> secara tepat — dan mengidentifikasi 3 interpretasi populer yang salah.</li>
          <li>Membedakan <strong>error Tipe I (α)</strong> dan <strong>Tipe II (β)</strong> serta menghitung konsekuensi bisnis masing-masing.</li>
          <li>Menjelaskan <strong>power (1−β)</strong> dan 4 faktor yang memengaruhinya (effect size, n, α, variansi).</li>
          <li>Menghindari <strong>p-hacking</strong> dan menjelaskan mengapa &ldquo;signifikan&rdquo; ≠ &ldquo;penting&rdquo;.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Obat yang &ldquo;Terbukti&rdquo; Manjur</h2>
      <div className="story">
        <p>Tahun 2011, sebuah studi mengklaim menemukan &ldquo;ESP&rdquo; — kemampuan melihat masa depan — dengan hasil <strong>signifikan secara statistik (p &lt; 0,05)</strong>, diterbitkan di jurnal bereputasi. Media heboh. Para psikolog mencoba mereplikasi: gagal, gagal, gagal. ESP-nya lenyap.</p>
        <p>Bagaimana studi yang &ldquo;signifikan&rdquo; bisa salah total? Penelusuran menemukan: peneliti menguji <strong>banyak sekali</strong> analisis dan hanya melaporkan yang &ldquo;berhasil&rdquo;. Dengan cukup banyak percobaan, <em>sesuatu</em> pasti terlihat signifikan — murni karena kebetulan.</p>
        <p><strong>Twist-nya:</strong> p &lt; 0,05 <strong>tidak</strong> berarti &ldquo;95% peluang klaim ini benar&rdquo;. Ia berarti sesuatu yang jauh lebih sempit — dan memahami perbedaannya adalah garis antara analis yang tajam dan analis yang tertipu oleh angkanya sendiri. Krisis replikasi yang mengguncang psikologi dan kedokteran satu dekade terakhir berakar pada kesalahpahaman ini.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="kerangka">Kerangka Pengadilan: H0, H1 &amp; Statistik Uji</h2>
      <p><strong>Definisi.</strong> <strong>Uji hipotesis</strong> adalah prosedur pengambilan keputusan berbasis data, dengan logika seperti pengadilan:</p>
      <ul>
        <li><strong>H0 (hipotesis nol):</strong> &ldquo;terdakwa tidak bersalah&rdquo; — status quo, <em>tidak ada efek</em>. Contoh: &ldquo;koin adil (p = 0,5)&rdquo;, &ldquo;obat = plasebo&rdquo;.</li>
        <li><strong>H1 (hipotesis alternatif):</strong> &ldquo;ada bukti kesalahan&rdquo; — klaim yang ingin dibuktikan. Contoh: &ldquo;koin bias&rdquo;, &ldquo;obat lebih manjur&rdquo;.</li>
        <li><strong>Statistik uji:</strong> &ldquo;barang bukti&rdquo; — satu angka ringkasan dari data (misal z = (x̄ − μ0)/SE).</li>
        <li><strong>Keputusan:</strong> tolak H0 jika bukti cukup kuat (p &lt; α); jika tidak, <strong>gagal menolak H0</strong>.</li>
      </ul>
      <p><strong>Kepribadian kerangka ini:</strong> pengadilan yang sangat protektif terhadap terdakwa (H0). Beban pembuktian ada pada jaksa (data): &ldquo;tidak terbukti bersalah&rdquo; <strong>bukan</strong> &ldquo;terbukti tidak bersalah&rdquo;. Gagal menolak H0 bukan berarti H0 benar — hanya berarti buktinya kurang.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: uji koin</summary>
        <p>Lempar 100 kali, dapat 61 head. Apakah koin bias? α = 5%.</p>
        <p><strong>Langkah 1</strong> — hipotesis: H0: p = 0,5 vs H1: p ≠ 0,5.<br />
        <strong>Langkah 2</strong> — statistik uji: <Tex math={String.raw`z = \frac{0{,}61 - 0{,}50}{\sqrt{0{,}5 \times 0{,}5/100}} = \frac{0{,}11}{0{,}05} = 2{,}2`} />.<br />
        <strong>Langkah 3</strong> — p-value dua sisi: <Tex math={String.raw`P(|Z| > 2{,}2) \approx 0{,}028`} />.<br />
        <strong>Langkah 4</strong> — keputusan: 0,028 &lt; 0,05 → <strong>tolak H0</strong>. Bukti cukup untuk menyatakan koin bias (pada α = 5%).</p>
        <p>Catatan: &ldquo;tolak H0&rdquo; bukan &ldquo;H1 terbukti 100%&rdquo; — masih ada 5% risiko kesalahan Tipe I yang kita terima di awal.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> H0 harus <strong>spesifik dan bisa salah</strong> (&ldquo;p = 0,5&rdquo;, bukan &ldquo;koinnya aneh&rdquo;). Uji hipotesis tidak pernah <em>membuktikan</em> H1 — ia hanya mengukur apakah data <em>tidak konsisten</em> dengan H0. Asimetri ini disengaja: sains (dan pengadilan) lebih takut menghukum yang tak bersalah daripada membebaskan yang bersalah — kecuali kamu mengubah α-nya.</p>
      </div>

      <PlotlyChart
        data={[nullCurve, leftTail, rightTail]}
        title="Distribusi di Bawah H0 & Daerah Penolakan (α = 5%, dua sisi)"
        layout={{ xaxis: { title: "Statistik uji (z)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva biru = sebaran statistik uji <em>jika H0 benar</em>. Daerah oranye di kedua ekor = nilai-nilai yang &ldquo;terlalu ekstrem untuk H0&rdquo; — total luasnya 5%.</p>
        <p><strong>Interpretasi:</strong> statistik uji yang jatuh di daerah oranye (|z| &gt; 1,96) → tolak H0. Perhatikan: bahkan jika H0 benar, 5% statistik uji <em>akan</em> jatuh di sana — itulah harga α yang kita bayar. Uji hipotesis adalah mesin keputusan dengan tingkat kesalahan yang <em>diketahui dan dikendalikan</em>, bukan mesin kebenaran.</p>
      </div>

      <h2 id="pvalue">p-value — Angka Paling Disalahpahami dalam Sains</h2>
      <p><strong>Definisi (tepat).</strong> <strong>p-value</strong> adalah peluang — <em>dengan asumsi H0 benar</em> — memperoleh statistik uji <strong>sama ekstrem atau lebih ekstrem</strong> dari yang teramati:</p>
      <Tex math={String.raw`p = P(\text{data seekstrem ini} \mid H_0 \text{ benar})`} block />
      <p>Untuk contoh koin di atas: p = 0,028 berarti &ldquo;<strong>jika</strong> koin adil, peluang melihat hasil seekstrem 61 head dari 100 hanya 2,8%&rdquo;. Karena itu jarang, kita curiga H0 salah.</p>
      <p><strong>Kepribadian p-value:</strong> ia adalah <em>saksi ahli yang hanya menjawab satu pertanyaan</em>: &ldquo;seberapa aneh data ini <strong>andaikan</strong> H0 benar?&rdquo; Ia tidak menjawab &ldquo;apakah H0 benar?&rdquo;, tidak menjawab &ldquo;seberapa besar efeknya?&rdquo;, dan tidak menjawab &ldquo;seberapa penting temuan ini?&rdquo;.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;p = 0,03 berarti 97% peluang H1 benar / klaim ini benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> p-value adalah <Tex math={String.raw`P(\text{data} \mid H_0)`} />, bukan <Tex math={String.raw`P(H_0 \mid \text{data})`} /> — arah kondisinya terbalik! Untuk mendapatkan &ldquo;peluang hipotesis benar&rdquo; kamu butuh <strong>teorema Bayes</strong> + prior (A2.12). Kesalahan ini begitu merajalela hingga American Statistical Association (2015) mengeluarkan pernyataan resmi berisi 6 prinsip — intinya: p-value <strong>bukan</strong> ukuran kebenaran hipotesis.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;p = 0,06 berarti tidak ada efek; p = 0,04 berarti ada efek.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> tidak ada perbedaan ilmiah antara 0,049 dan 0,051 — batas 0,05 adalah konvensi arbitrer (warisan R.A. Fisher, 1925). Memperlakukan p-value sebagai garis hidup-mati menciptakan <strong>p-hacking</strong>: mengutak-atik analisis sampai p &ldquo;lolos&rdquo; 0,05. Praktik yang benar: laporkan p-value <em>beserta</em> effect size dan intervalnya; perlakukan 0,05 sebagai sinyal, bukan vonis.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> p-value kecil = &ldquo;data ini aneh jika H0 benar&rdquo; — ada <em>dua</em> penjelasan: (1) H0 memang salah, atau (2) kamu baru saja melihat kejadian langka (inilah error Tipe I). Uji hipotesis memilih penjelasan (1) dengan risiko (2) yang dikendalikan sebesar α. Setiap kali kamu membaca &ldquo;signifikan&rdquo;, ingatlah opsi (2) selalu mengintai.</p>
      </div>

      <h2 id="error">Error Tipe I &amp; II — Dua Cara Pengadilan Salah</h2>
      <p>Pengadilan bisa salah dua arah — dan kedua kesalahan punya &ldquo;harga&rdquo; berbeda:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr><th></th><th>H0 benar (tak bersalah)</th><th>H1 benar (bersalah)</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Tolak H0</strong> (vonis bersalah)</td><td>❌ <strong>Error Tipe I</strong> (false positive), peluang = <strong>α</strong></td><td>✅ Benar (true positive), peluang = <strong>power = 1 − β</strong></td></tr>
            <tr><td><strong>Gagal tolak H0</strong> (bebaskan)</td><td>✅ Benar (true negative), peluang = 1 − α</td><td>❌ <strong>Error Tipe II</strong> (false negative), peluang = <strong>β</strong></td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\alpha`} />: <strong>tingkat signifikansi</strong> — peluang error Tipe I yang <em>kamu tetapkan di awal</em> (umumnya 5%). Satu-satunya error yang kamu kendalikan langsung.</li>
        <li><Tex math={String.raw`\beta`} />: peluang error Tipe II — gagal mendeteksi efek yang sebenarnya ada. Tidak ditetapkan langsung; ia <em>akibat</em> dari desain (n, effect size, α).</li>
      </ul>
      <p><strong>Kepribadian kedua error:</strong> Tipe I adalah &ldquo;memfitnah orang tak bersalah&rdquo; — false alarm. Tipe II adalah &ldquo;membebaskan penjahat&rdquo; — missed detection. Mana yang lebih mahal <strong>tergantung domain</strong>: di pengadilan, Tipe I dianggap jauh lebih buruk (blackstone: lebih baik 10 bersalah bebas daripada 1 tak bersalah dihukum). Di skrining kanker, Tipe II (kanker terlewat) jauh lebih mematikan.</p>

      <details className="worked">
        <summary>📐 Contoh: α dan β dalam angka</summary>
        <p>Uji obat: H0 = &ldquo;obat = plasebo&rdquo;. α = 5%, dan dari perhitungan power (lihat bawah) β = 20%.</p>
        <p><strong>Jika obat sebenarnya TAK manjur</strong> (H0 benar): dari 100 studi semacam ini, ~5 akan &ldquo;signifikan&rdquo; palsu (Tipe I) → 5 obat tak berguna lolos.<br />
        <strong>Jika obat sebenarnya manjur</strong> (H1 benar): dari 100 studi, ~20 gagal mendeteksi (Tipe II) → 20 obat berguna terbuang.</p>
        <p>Tidak ada uji yang gratis dari kesalahan — yang ada hanya <em>memilih</em> kesalahan mana yang lebih murah, lalu mendesain (n, α) sesuai itu.</p>
      </details>

      <PlotlyChart
        data={errorData}
        title="Empat Kemungkinan Hasil Uji (α = 5%, power = 80%)"
        layout={{ yaxis: { title: "Peluang (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> empat batang = empat sel tabel keputusan. Warna merah/kuning = dua kesalahan; hijau/abu = dua keputusan benar.</p>
        <p><strong>Interpretasi:</strong> bahkan uji yang &ldquo;bagus&rdquo; (power 80%) masih salah 5% saat H0 benar dan 20% saat H1 benar. <strong>Pesan untuk analis:</strong> setiap keputusan berbasis uji membawa residu kesalahan yang <em>diketahui besarnya</em> — tugasmu bukan menghilangkannya (mustahil), tapi memastikan harganya bisa ditanggung bisnismu.</p>
      </div>

      <h2 id="power">Power — Kemampuan Menangkap Efek Nyata</h2>
      <p><strong>Definisi.</strong> <strong>Power</strong> (daya/kekuatan uji) = <Tex math={String.raw`1 - \beta`} /> = peluang menolak H0 <strong>ketika H1 memang benar</strong> (efeknya nyata). Standar industri: <strong>80%</strong>.</p>
      <p><strong>Empat faktor yang menentukan power:</strong></p>
      <ol>
        <li><strong>Effect size</strong> (seberapa besar efek sebenarnya): efek besar → mudah ditangkap → power tinggi. Efek mungil butuh n raksasa.</li>
        <li><strong>Ukuran sampel n</strong>: n besar → SE kecil → sinyal lebih jelas → power tinggi.</li>
        <li><strong>α</strong>: α besar (10%) → lebih gampang menolak H0 → power naik, tapi error Tipe I ikut naik. Tidak ada makan siang gratis.</li>
        <li><strong>Variansi data</strong>: data berisik (σ besar) menenggelamkan sinyal → power turun.</li>
      </ol>
      <p><strong>Kepribadian power:</strong> ia adalah &ldquo;ketajaman radar&rdquo;. Radar tumpul (power 30%) tidak melihat kapal yang lewat — lalu operator menyimpulkan &ldquo;laut kosong&rdquo;. <strong>Hasil tidak signifikan dari studi underpowered bukan bukti tidak ada efek</strong> — itu bukti radarmu tumpul. &ldquo;Absence of evidence is not evidence of absence.&rdquo;</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Uji tidak signifikan → H0 benar / tidak ada efek.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;gagal menolak H0&rdquo; bisa berarti (a) memang tidak ada efek, ATAU (b) efek ada tapi power kurang untuk melihatnya. Tanpa analisis power, kamu tidak bisa membedakan keduanya. Inilah mengapa uji klinis yang &ldquo;gagal&rdquo; sering diulang dengan n lebih besar — bukan karena datanya salah, tapi karena radarnya kurang tajam.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci — p-hacking:</strong> jika kamu menguji 20 hipotesis yang semuanya salah (H0 benar semua) pada α = 5%, peluang <em>minimal satu</em> &ldquo;signifikan&rdquo; palsu adalah <Tex math={String.raw`1 - 0{,}95^{20} \approx 64\%`} />. Inilah yang terjadi pada studi ESP di cerita pembuka — dan pada analis yang mencoba 20 segmentasi sampai satu &ldquo;menarik&rdquo;. Obatnya: tetapkan hipotesis &amp; analisis <strong>sebelum</strong> melihat data (preregistrasi), dan koreksi multiple testing (A2.8).</p>
      </div>

      <PlotlyChart
        data={pvalueData}
        title="Distribusi p-value: di Bawah H0 vs di Bawah H1"
        layout={{ barmode: "group", xaxis: { title: "p-value" }, yaxis: { title: "% dari 1.000 simulasi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua histogram dari 1.000 uji simulasi. Abu-abu = H0 benar (tidak ada efek); biru = H1 benar (ada efek sedang).</p>
        <p><strong>Interpretasi:</strong> di bawah H0, p-value tersebar <strong>merata</strong> (uniform) — setiap rentang ~10%, termasuk 10% di bawah 0,1. Di bawah H1, p-value <strong>menumpuk di dekat 0</strong> (52% di bawah 0,1). <strong>Dua pelajaran:</strong> (1) p kecil memang lebih mungkin saat efek nyata — itulah gunanya uji; (2) tapi di bawah H0 pun p kecil <em>pasti muncul</em> 5% dari waktu — itulah α, dan itulah mengapa satu p &lt; 0,05 bukan bukti mutlak.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Uji hipotesis = &ldquo;pengadilan&rdquo;: H0 tidak bersalah sampai terbukti.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Uji z penuh — dari H0 sampai keputusan</summary>
              <p>Klaim: &ldquo;PD produk baru &lt; 5%.&rdquo; Data: 8 gagal dari 200 (p̂ = 4%). Uji pada α = 5% (satu sisi).</p>
              <p><strong>Langkah 1</strong> — H0: p ≥ 0,05; H1: p &lt; 0,05 (satu sisi kiri!).<br />
              <strong>Langkah 2</strong> — statistik uji (di bawah H0, p₀ = 0,05): z = (0,04 − 0,05)/√(0,05×0,95/200) = −0,01/0,0154 = <strong>−0,649</strong>.<br />
              <strong>Langkah 3</strong> — p-value = P(Z &lt; −0,649) = <strong>0,258</strong>.<br />
              <strong>Langkah 4</strong> — 0,258 &gt; 0,05 → <strong>gagal tolak H0</strong>. Data <em>konsisten</em> dengan PD ≥ 5% — klaim tidak terbukti.</p>
              <p>Pelajaran: p̂ = 4% &lt; 5% tapi <strong>tidak signifikan</strong> — SE-nya 1,54%, selisih 1% = noise. &ldquo;Angka di bawah target&rdquo; ≠ &ldquo;terbukti di bawah target&rdquo;. Inilah mengapa uji ada.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: p-value bukan &ldquo;peluang H0 benar&rdquo;</summary>
              <p>p = 0,04. Tiga pernyataan — mana yang benar? (a) &ldquo;Peluang H0 benar = 4%.&rdquo; (b) &ldquo;Jika H0 benar, peluang data seekstrem ini = 4%.&rdquo; (c) &ldquo;Efeknya besar.&rdquo;</p>
              <p><strong>Langkah 1</strong> — (a) <strong>salah</strong>: p-value tidak memberi peluang H0 (butuh prior Bayesian!).<br />
              <strong>Langkah 2</strong> — (b) <strong>benar</strong>: definisi p-value = P(data seekstrem | H0).<br />
              <strong>Langkah 3</strong> — (c) <strong>salah</strong>: p-value tidak mengukur <em>besar</em> efek — n raksasa membuat efek mungil signifikan (A2.7!).</p>
              <p>Pelajaran: hafalkan definisi (b) kata per kata. Dua kesalahan paling mahal: membaca p sebagai &ldquo;peluang H0&rdquo; dan sebagai &ldquo;ukuran efek&rdquo;.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: p-value di Bawah H0 Tersebar Uniform</h2>
      <p>Simulasi 2.000 uji pada koin yang <strong>adil</strong> (H0 benar). Saksikan: p-value tersebar merata — dan ~5% di antaranya &ldquo;signifikan&rdquo; murni karena kebetulan.</p>
      <PyodideLab
        title="Lab 1 — p-value Saat Tidak Ada Efek (Live Python)"
        hint="⚡ Live Python. Coba: ubah n jadi 1000. Distribusinya tetap uniform! n besar tidak mengubah sifat ini — ia hanya membuat uji lebih tajam saat efek ADA (lihat Lab 2)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Power — Menangkap Koin yang Bias</h2>
      <p>Sekarang koinnya <strong>benar-benar bias</strong> (p = 0,6). Berapa sering uji kita berhasil mendeteksinya? Variasikan n dan saksikan power tumbuh.</p>
      <PyodideLab
        title="Lab 2 — Power vs Ukuran Sampel (Live Python)"
        hint="Coba: ubah p_true jadi 0.55 (efek lebih kecil). Power anjlok — efek kecil butuh n jauh lebih besar. Inilah alasan 'hitung power DULU, kumpulkan data KEMUDIAN' (A2.10)."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Membaca Hasil Uji</h2>

      <div className="decision-card">
        <h3>1. p &lt; α → <strong>Tolak H0</strong> (dengan catatan)</h3>
        <p><strong>Kondisi:</strong> p-value di bawah ambang yang ditetapkan <em>sebelum</em> eksperimen.</p>
        <p><strong>Kenapa (dengan catatan):</strong> bukti cukup kuat menurut standar yang disepakati. Catatan wajib: laporkan <strong>effect size + interval</strong> — &ldquo;signifikan&rdquo; tanpa besaran efek tidak bisa diambil keputusan. Dan ingat risiko α: 1 dari 20 keputusan semacam ini salah.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;konversi naik 1,2 poin (95% CI: 0,4–2,0; p = 0,003)&rdquo; — bukan sekadar &ldquo;p &lt; 0,05 🎉&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. p ≥ α → <strong>Gagal menolak H0</strong> (bukan &ldquo;H0 terbukti&rdquo;)</h3>
        <p><strong>Kondisi:</strong> p-value di atas ambang.</p>
        <p><strong>Kenapa:</strong> bukti kurang — bisa karena memang tidak ada efek, bisa karena power kurang. Bedakan keduanya dengan <strong>cek power</strong>: jika power ≥ 80% untuk efek yang penting, &ldquo;tidak ada efek (yang penting)&rdquo; adalah kesimpulan wajar. Jika power 30%, kesimpulannya hanya &ldquo;belum tahu&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> uji obat &ldquo;gagal&rdquo; dengan n=30 → jangan simpulkan obat tak manjur; simpulkan studi underpowered.</p>
      </div>

      <div className="decision-card">
        <h3>3. Error Tipe I sangat mahal → <strong>turunkan α</strong></h3>
        <p><strong>Kondisi:</strong> false positive berakibat fatal/mahal — vonis obat berbahaya, blokir nasabah sah, recall produk.</p>
        <p><strong>Kenapa:</strong> α = 1% atau 0,1% menekan false alarm. Harga: butuh n lebih besar untuk power yang sama, dan lebih banyak efek nyata terlewat (β naik).</p>
        <p><strong>Contoh nyata:</strong> sistem blokir transaksi fraud: false positive = nasabah marah tidak bisa bayar → α ketat + review manual.</p>
      </div>

      <div className="decision-card">
        <h3>4. Error Tipe II sangat mahal → <strong>naikkan power (n besar)</strong></h3>
        <p><strong>Kondisi:</strong> missed detection fatal — skrining kanker, deteksi kebocoran, uji keamanan.</p>
        <p><strong>Kenapa:</strong> target power 90–95% dengan n yang dihitung dulu (A2.10). Jangan mulai eksperimen tanpa tahu n yang dibutuhkan.</p>
        <p><strong>Contoh nyata:</strong> uji klinis fase 3 dihitung untuk power 90% — gagal mendeteksi obat manjur merugikan miliaran + nyawa.</p>
      </div>

      <div className="decision-card">
        <h3>5. Banyak hipotesis diuji sekaligus → <strong>koreksi multiple testing</strong></h3>
        <p><strong>Kondisi:</strong> menguji 20 segmen, 50 fitur, 100 strategi — peluang false positive meledak (64% untuk 20 uji pada α=5%).</p>
        <p><strong>Kenapa:</strong> tanpa koreksi, &ldquo;temuan signifikan&rdquo; hampir pasti ada yang palsu. Solusinya di A2.8 (Bonferroni, Holm, BH).</p>
        <p><strong>Contoh nyata:</strong> backtest 100 varian strategi trading — yang &ldquo;terbaik&rdquo; sering hanya yang paling beruntung.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tetapkan H0, H1, α SEBELUM lihat data.</strong> Mengubah aturan setelah melihat hasil = p-hacking.</li>
          <li><strong>&ldquo;Gagal menolak&rdquo; ≠ &ldquo;menerima&rdquo;.</strong> Cek power sebelum menyimpulkan &ldquo;tidak ada efek&rdquo;.</li>
          <li><strong>Selalu laporkan trio:</strong> p-value + effect size + interval kepercayaan. Satu angka tidak cukup.</li>
          <li>Tanya: &ldquo;kesalahan mana yang lebih mahal di sini — false alarm atau missed detection?&rdquo; → atur α &amp; n dari jawabannya.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Alert Fraud yang Terlalu Rajin</h2>
      <div className="callout">
        <p>Bank &ldquo;AmanSentosa&rdquo; memasang sistem deteksi fraud baru. Uji coba 30 hari pada 10.000 transaksi: sistem menandai <strong>120 transaksi</strong> sebagai fraud. Investigasi manual menemukan <strong>30 fraud beneran</strong> di antaranya; 90 adalah transaksi sah yang terganggu (nasabah komplain).</p>
        <p>Data tambahan: total fraud aktual di periode itu (dari audit) = <strong>50 kasus</strong>. Jadi sistem menangkap 30 dari 50 fraud, dan mengganggu 90 nasabah sah.</p>
        <p><strong>Pertanyaan:</strong> (a) Petakan ke tabel error: berapa α (false positive rate) dan power sistem ini? (b) Tim produk bangga &ldquo;akurasi 99%&rdquo; — benarkah klaim itu? (c) Jika komplain nasabah (Tipe I) dianggap 5× lebih mahal dari fraud lolos (Tipe II), apa rekomendasi threshold-mu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) H0 = &ldquo;transaksi sah&rdquo;. <strong>Error Tipe I:</strong> 90 dari 9.950 transaksi sah ditandai → α ≈ 0,9%. <strong>Power:</strong> 30 dari 50 fraud tertangkap → 60%; <strong>Tipe II</strong> = 40% fraud lolos (20 kasus).</p>
          <p>(b) <strong>Klaim &ldquo;akurasi 99%&rdquo; menyesatkan</strong> — akurasi = (9.860 + 30)/10.000 = 98,9%, tapi didominasi 9.950 transaksi sah yang memang gampang. Metrik yang relevan: <strong>presisi</strong> = 30/120 = 25% (hanya 1 dari 4 alert yang benar!) dan <strong>recall/power</strong> = 60%. Akurasi pada data imbalance adalah jebakan klasik.</p>
          <p>(c) Dengan biaya Tipe I 5× Tipe II: <strong>ketatkan threshold</strong> (naikkan α implisit ke bawah) — terima power turun sedikit demi memangkas 90 komplain. Atau lebih baik: <strong>two-tier</strong> — skor tinggi → blokir otomatis; skor sedang → step-up authentication (bukan blokir). Pelajaran: <strong>threshold optimal berasal dari rasio biaya, bukan dari α = 5% default</strong>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Rata-rata klaim: H0: μ = 10jt. Sampel n=64: x̄ = 11jt, s = 4jt. Hitung z &amp; p-value (dua sisi). Keputusan α=5%?</li>
              <li>Error Tipe I vs Tipe II dalam konteks <em>fraud detection</em>: mana yang lebih mahal? (Tidak ada jawaban universal — argumentasikan!)</li>
              <li>p = 0,049 vs p = 0,051 — beda keputusan, beda bukti? Jelaskan.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> SE = 4/8 = 0,5jt. z = (11−10)/0,5 = <strong>2,0</strong>. p dua sisi = <strong>0,0455</strong> &lt; 0,05 → <strong>tolak H0</strong> (tipis!).</p>
              <p><strong>2.</strong> Tipe I (false alarm): blokir transaksi sah → nasabah marah + biaya investigasi. Tipe II (fraud lolos): kerugian langsung Rp. Mana lebih mahal tergantung <em>nominal &amp; volume</em> — untuk fraud besar, Tipe II; untuk UX massal, Tipe I. Inilah mengapa α dipilih dari <em>biaya</em>, bukan dogma 5%.</p>
              <p><strong>3.</strong> Keputusan beda (tolak vs gagal tolak) tapi <strong>bukti hampir identik</strong>! Ambang 0,05 itu arbitrer — p = 0,049 vs 0,051 sama-sama &ldquo;bukti lemah&rdquo;. Laporkan p-value <em>eksak</em> + effect size; jangan perlakukan 0,05 sebagai garis magis.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. p-value = 0,03. Pernyataan yang TEPAT?"
        options={[
          "Ada 97% peluang hipotesis alternatif benar",
          "Jika H0 benar, peluang melihat data seekstrem ini hanya 3%",
          "Ada 3% peluang H0 benar",
          "Efeknya pasti besar dan penting",
        ]}
        correct={1}
        explanation="Benar. p-value = P(data seekstrem | H0), bukan P(H0 | data) — arah kondisinya sering terbalik di kepala orang. Ia tidak bilang seberapa besar efeknya, apalagi seberapa penting."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Uji obat dengan α = 5% menghasilkan p = 0,08. Kesimpulan tepat?"
        options={[
          "Obat terbukti tidak manjur",
          "Gagal menolak H0 — bukti kurang; bisa karena memang tak manjur ATAU power kurang",
          "Obat manjur tapi uji salah",
          "Ulangi uji sampai p < 0,05",
        ]}
        correct={1}
        explanation="Benar. 'Gagal menolak' ≠ 'menerima H0'. Tanpa cek power, p = 0,08 tidak membedakan 'tidak ada efek' dari 'efek ada tapi radar tumpul'. Opsi 4 adalah p-hacking."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Sistem skrining kanker melewatkan 15% kasus kanker sebenarnya. Ini error tipe apa, dan apa implikasinya?"
        options={[
          "Tipe I — terlalu banyak false alarm",
          "Tipe II (β = 15%) — power 85%; di skrining, missed detection bisa fatal sehingga biasanya target power ≥ 90–95%",
          "Bukan error — 85% sudah bagus",
          "Error sampling",
        ]}
        correct={1}
        explanation="Benar. Melewatkan yang sakit = false negative = Tipe II. Di domain nyawa, β = 15% umumnya dianggap terlalu besar — desainnya harus menarget power lebih tinggi (dengan n lebih besar atau α lebih longgar)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Analis menguji 20 segmen pelanggan dan menemukan 1 segmen 'signifikan' (p = 0,04). Reaksi tepat?"
        options={[
          "Langsung umumkan temuan ke direksi",
          "Curiga: dengan 20 uji pada α=5%, peluang ≥1 false positive ≈ 64% — butuh koreksi multiple testing (A2.8) atau replikasi",
          "Naikkan α jadi 10% agar lebih banyak temuan",
          "Buang 19 segmen lain dari laporan",
        ]}
        correct={1}
        explanation="Benar. 1 − 0,95²⁰ ≈ 64% — temuan 'signifikan' tunggal dari 20 uji sangat mungkin palsu. Inilah mekanisme di balik studi ESP di cerita pembuka. Jangan rayakan sebelum koreksi/replikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua studi menguji efek yang sama. Studi A: n=50, p=0,06. Studi B: n=5.000, p=0,04 dengan efek sangat kecil. Mana yang lebih 'penting'?"
        options={[
          "B — p-value-nya signifikan",
          "A — p-value-nya hampir signifikan",
          "Tidak bisa dinilai dari p-value saja — butuh effect size; B mungkin signifikan tapi trivial (n raksasa membuat efek mungil 'signifikan')",
          "Keduanya sama pentingnya",
        ]}
        correct={2}
        explanation="Benar. Dengan n=5.000, efek yang sangat kecil pun jadi 'signifikan' — p-value mencampuradukkan ukuran efek dengan ukuran sampel. 'Penting' dinilai dari effect size + konteks bisnis (A2.7), bukan dari bintang signifikansi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Manakah yang MENAIKKAN power (semua else equal)?"
        options={[
          "Memperkecil α dari 5% ke 1%",
          "Memperbesar n",
          "Menambah variansi data",
          "Menguji lebih banyak hipotesis sekaligus",
        ]}
        correct={1}
        explanation="Benar. n besar → SE kecil → sinyal lebih jelas → power naik. Memperkecil α justru menurunkan power (lebih sulit menolak H0). Variansi besar menenggelamkan sinyal. Banyak hipotesis butuh koreksi yang menurunkan power per uji."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Logika pengadilan:</strong> H0 = tidak bersalah sampai terbukti; &ldquo;gagal menolak&rdquo; ≠ &ldquo;terbukti tidak bersalah&rdquo;.</li>
          <li><strong>p-value</strong> = <Tex math={String.raw`P(\text{data seekstrem} \mid H_0)`} /> — bukan peluang hipotesis benar, bukan ukuran besar/pentingnya efek.</li>
          <li><strong>Error Tipe I (α)</strong> = false positive, ditetapkan di awal. <strong>Tipe II (β)</strong> = false negative. <strong>Power = 1 − β</strong>.</li>
          <li><strong>Power</strong> naik dengan: effect size besar, n besar, α longgar, variansi kecil. Standar: 80%.</li>
          <li><strong>p-hacking:</strong> 20 uji pada α=5% → 64% peluang ≥1 false positive. Tetapkan analisis sebelum lihat data.</li>
          <li><strong>Signifikan ≠ penting.</strong> Selalu laporkan trio: p-value + effect size + interval.</li>
          <li><strong>Jangan:</strong> menyimpulkan &ldquo;tidak ada efek&rdquo; dari studi underpowered; memakai α=5% membabi buta tanpa timbang biaya error.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a23-interval-kepercayaan" className="btn btn-secondary btn-sm">← A2.3</Link>
        <Link href="/learn/a25-uji-t-anova" className="btn btn-primary btn-sm">Next: A2.5 →</Link>
      </div>
    </div>
  );
}
