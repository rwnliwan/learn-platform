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
function phi(x: number) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}
function erf(x: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
}
// inverse normal CDF (aproksimasi Acklam)
function normInv(p: number) {
  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const plow = 0.02425, phigh = 1 - 0.02425;
  let q: number, r: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

export default function A210Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: kurva power vs n untuk beberapa effect size (uji-t dua sampel, alpha=5%)
  const nVals: number[] = [];
  for (let n = 20; n <= 1000; n += 20) nVals.push(n);
  const zA = normInv(0.975); // 1.96
  const powerCurve = (d: number) =>
    nVals.map((n) => {
      const ncp = d * Math.sqrt(n / 2);
      return phi(ncp - zA) + phi(-ncp - zA);
    });
  const powerData = [
    { x: nVals, y: powerCurve(0.2), type: "scatter", mode: "lines", name: "d = 0,2 (kecil)", line: { color: "#94a3b8" } },
    { x: nVals, y: powerCurve(0.5), type: "scatter", mode: "lines", name: "d = 0,5 (sedang)", line: { color: "#2a7de1" } },
    { x: nVals, y: powerCurve(0.8), type: "scatter", mode: "lines", name: "d = 0,8 (besar)", line: { color: "#c2410c" } },
  ];

  // Chart 2: distribusi H0 vs H1 — visualisasi power sebagai luas
  const xs: number[] = [];
  for (let x = -4; x <= 7; x += 0.1) xs.push(Math.round(x * 10) / 10);
  const h0h1Data = [
    { x: xs, y: xs.map((x) => normPdf(x, 0, 1)), type: "scatter", mode: "lines", name: "H0: tidak ada efek", line: { color: "#94a3b8" } },
    { x: xs, y: xs.map((x) => normPdf(x, 2.8, 1)), type: "scatter", mode: "lines", name: "H1: efek nyata (δ)", line: { color: "#2a7de1" } },
  ];

  // Chart 3: ukuran sampel vs MDE untuk proporsi (baseline 5%)
  const mdeVals = [0.5, 1, 2, 3, 5]; // poin persentase
  const p0 = 0.05;
  const zB = normInv(0.8); // 0.84
  const nForMde = mdeVals.map((mde) => {
    const d = mde / 100;
    const v = p0 * (1 - p0);
    return Math.ceil((2 * v * Math.pow(zA + zB, 2)) / (d * d));
  });
  const mdeData = [
    {
      x: mdeVals.map((m) => `±${m} pp`),
      y: nForMde,
      type: "bar",
      marker: { color: "#2a7de1" },
      text: nForMde.map((n) => n.toLocaleString("id-ID")),
      textposition: "outside",
    },
  ];

  const lab1Code = `import random, math

random.seed(210)
# Verifikasi kurva power via simulasi: uji-t dua sampel, d=0.5, alpha=5%.
# Power teoritis bisa dihitung — tapi kita BUKTIKAN dengan simulasi.

def t_stat(a, b):
    import statistics as st
    n1, n2 = len(a), len(b)
    m1, m2 = st.mean(a), st.mean(b)
    s1, s2 = st.stdev(a), st.stdev(b)
    sp2 = ((n1-1)*s1**2 + (n2-1)*s2**2)/(n1+n2-2)
    return (m1-m2)/math.sqrt(sp2*(1/n1+1/n2))

# nilai kritis t dua sisi, df besar ~ 1.96 (aproksimasi normal)
def power_sim(n, d=0.5, trials=2000):
    det = 0
    for _ in range(trials):
        a = [random.gauss(0, 1) for _ in range(n)]
        b = [random.gauss(d, 1) for _ in range(n)]  # efek nyata d
        if abs(t_stat(a, b)) > 1.96:
            det += 1
    return det/trials

print(f"{'n per grup':>10}  {'Power simulasi':>15}")
for n in [20, 50, 100, 200]:
    print(f"{n:>10}  {power_sim(n):>14.1%}")
print()
print("Bandingkan dengan kurva teori di chart: d=0.5 mencapai 80%")
print("di sekitar n=64 per grup. Simulasi harus mendekati itu.")
print("Coba: ubah d jadi 0.2. Power anjlok — butuh n ~400 per grup!")`;

  const lab2Code = `import math

# Kalkulator ukuran sampel untuk A/B test proporsi.
# Berapa n per varian agar bisa mendeteksi kenaikan MDE dengan power 80%?

def n_per_varian(p0, mde_pp, alpha=0.05, power=0.8):
    z_a = 1.96 if alpha == 0.05 else 2.58
    z_b = {0.8: 0.84, 0.9: 1.28}[power]
    d = mde_pp/100
    v = p0*(1-p0)
    return math.ceil(2*v*(z_a+z_b)**2 / d**2)

print("A/B test konversi: baseline 5%, alpha 5%, power 80%")
print(f"{'MDE':>8}  {'n per varian':>13}  {'Total':>10}")
for mde in [0.5, 1.0, 2.0]:
    n = n_per_varian(0.05, mde)
    print(f"{mde:>6.1f}pp  {n:>13,}  {2*n:>10,}")
print()
print("MDE 0.5pp butuh ~30rb per varian! Jika trafik 2rb/hari,")
print("test berjalan 15 hari. MDE ambisius = test tak berujung.")
print("Coba: ubah baseline jadi 0.30 (30%). n berubah bagaimana?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.10 — Statistika Inferensial</span>
        <h1 className="display-title">Berapa Data yang Cukup?<br />Power &amp; Ukuran Sampel</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> <strong>Power (1−β)</strong> diperkenalkan sebagai &ldquo;ketajaman radar&rdquo;: peluang mendeteksi efek yang benar-benar ada. <strong>Effect size</strong> mengukur besarnya efek. Lesson ini mengubah keduanya menjadi <strong>kalkulator perencanaan</strong>: sebelum mengumpulkan satu data pun, hitung <em>berapa n</em> yang dibutuhkan untuk mendeteksi efek sebesar MDE dengan power 80% — karena eksperimen yang underpowered adalah pemborosan yang bisa dicegah.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Obat yang &ldquo;Gagal&rdquo; Padahal Manjur</a></li>
          <li><a href="#anatomi">Anatomi Power — Empat Tuas</a></li>
          <li><a href="#rumus">Rumus Ukuran Sampel — Dari Power ke n</a></li>
          <li><a href="#mde">MDE — Efek Terkecil yang Layak Dideteksi</a></li>
          <li><a href="#kurva">Membaca Kurva Power</a></li>
          <li><a href="#jebakan">Tiga Jebakan Power</a></li>
          <li><a href="#lab1">🔬 Lab 1: Verifikasi Kurva Power via Simulasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kalkulator n untuk A/B Test</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Perencanaan Eksperimen</a></li>
          <li><a href="#case">📋 Mini-Case: Berapa Lama A/B Test Harus Jalan?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>4 faktor penentu power</strong> dan arah pengaruh masing-masing.</li>
          <li>Menghitung <strong>ukuran sampel</strong> untuk uji beda dua mean dan dua proporsi dengan rumus baku.</li>
          <li>Menentukan <strong>MDE</strong> dari konteks bisnis — bukan dari rumus.</li>
          <li>Membaca <strong>kurva power</strong> dan menjelaskan diminishing returns-nya.</li>
          <li>Mengidentifikasi <strong>post-hoc power</strong>, <strong>peeking</strong>, dan <strong>underpower</strong> sebagai jebakan analisis.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Obat yang &ldquo;Gagal&rdquo; Padahal Manjur</h2>
      <div className="story">
        <p>Tahun 2008, sebuah perusahaan farmasi menguji obat diabetes baru pada <strong>120 pasien</strong>. Hasil: penurunan gula darah 0,4 poin lebih baik dari plasebo, p = 0,12 — <strong>tidak signifikan</strong>. Proyek dihentikan. Kerugian: 6 tahun riset + $400 juta.</p>
        <p>Dua tahun kemudian, kompetitor menguji <strong>obat sejenis dengan mekanisme sama</strong> pada <strong>800 pasien</strong>. Hasil: penurunan 0,38 poin — <em>efek yang praktis identik</em> — p &lt; 0,001. Obat disetujui, meraup $2 miliar/tahun.</p>
        <p>Obat pertama tidak &ldquo;gagal&rdquo; — <strong>studinya yang gagal</strong>. Dengan n = 120, power untuk mendeteksi efek sebesar itu hanya ~35%. Mereka melempar koin yang 65% meleset, lalu menyalahkan obatnya saat koin itu meleset.</p>
        <p><strong>Twist-nya:</strong> kegagalan termahal dalam sains dan bisnis bukan &ldquo;eksperimen yang salah&rdquo; — melainkan <strong>eksperimen yang benar tapi terlalu kecil untuk melihat jawabannya</strong>. Dan ini sepenuhnya bisa dicegah dengan 10 menit perhitungan <em>sebelum</em> eksperimen dimulai. Lesson ini adalah 10 menit itu.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="anatomi">Anatomi Power — Empat Tuas</h2>
      <p><strong>Definisi.</strong> <strong>Power</strong> = <Tex math={String.raw`P(\text{tolak } H_0 \mid H_1 \text{ benar}) = 1 - \beta`} />. Visualnya: dua kurva distribusi — di bawah H0 (pusat di 0) dan di bawah H1 (pusat di efek sebenarnya δ). Power adalah <strong>luas kurva H1 yang jatuh di daerah penolakan H0</strong>:</p>
      <PlotlyChart
        data={h0h1Data}
        title="Power = Luas Kurva H1 di Daerah Penolakan H0"
        layout={{ xaxis: { title: "Statistik uji" }, yaxis: { title: "Kepadatan" }, showlegend: true, shapes: [{ type: "line", x0: 1.96, x1: 1.96, y0: 0, y1: 0.45, line: { dash: "dash", color: "#c2410c" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva abu-abu = sebaran statistik jika tidak ada efek (H0); kurva biru = sebaran jika efek nyata sebesar δ. Garis oranye = batas penolakan (α = 5%).</p>
        <p><strong>Interpretasi:</strong> power = luas biru di <em>kanan</em> garis oranye (~80% di sini). Empat tuas menggeser/menyempitkan kurva: <strong>δ besar</strong> → kurva biru menjauh ke kanan; <strong>n besar</strong> → kedua kurva menyempit (SE kecil); <strong>α longgar</strong> → garis oranye bergeser kiri; <strong>σ kecil</strong> → kurva menyempit. Semua tuas menaikkan luas biru di kanan garis.</p>
      </div>
      <p><strong>Empat tuas, satu tabel:</strong></p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Tuas</th><th>Dinaikkan → power…</th><th>Harga</th></tr></thead>
          <tbody>
            <tr><td><strong>Effect size (δ)</strong></td><td>Naik (sinyal lebih jelas)</td><td>Tidak bisa diatur — sifat dunia</td></tr>
            <tr><td><strong>n</strong></td><td>Naik (SE menyusut)</td><td>Biaya, waktu</td></tr>
            <tr><td><strong>α</strong></td><td>Naik (lebih mudah menolak)</td><td>False positive naik</td></tr>
            <tr><td><strong>σ</strong> (turun)</td><td>Naik (noise berkurang)</td><td>Butuh desain/pengukuran lebih baik</td></tr>
          </tbody>
        </table>
      </div>
      <p>Dari empat tuas, <strong>n adalah satu-satunya yang sepenuhnya dalam kendalimu</strong> — itulah mengapa lesson ini tentang menghitung n.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> power adalah <strong>probabilitas bersyarat pada H1</strong> — ia hanya bermakna <em>untuk efek sebesar δ tertentu</em>. &ldquo;Power studi ini 80%&rdquo; adalah kalimat tidak lengkap; yang lengkap: &ldquo;power 80% <strong>untuk mendeteksi d = 0,5</strong>&rdquo;. Studi ber-power 80% untuk efek besar bisa ber-power 20% untuk efek kecil. Selalu tanyakan: &ldquo;80% untuk efek sebesar <em>apa</em>?&rdquo;</p>
      </div>

      <h2 id="rumus">Rumus Ukuran Sampel — Dari Power ke n</h2>
      <p><strong>Untuk beda dua mean</strong> (n sama per grup, uji dua sisi):</p>
      <Tex math={String.raw`n_{\text{per grup}} = \frac{2\sigma^2 (z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`n`} />: sampel per grup (total = 2n)</li>
        <li><Tex math={String.raw`\sigma^2`} />: variansi data (dari studi pilot / historis)</li>
        <li><Tex math={String.raw`z_{1-\alpha/2}`} />: 1,96 untuk α = 5%</li>
        <li><Tex math={String.raw`z_{1-\beta}`} />: 0,84 untuk power 80%; 1,28 untuk 90%</li>
        <li><Tex math={String.raw`\delta`} />: selisih mean terkecil yang ingin dideteksi (<strong>MDE</strong>)</li>
      </ul>
      <p><strong>Untuk beda dua proporsi:</strong> ganti <Tex math={String.raw`\sigma^2`} /> dengan <Tex math={String.raw`\bar{p}(1-\bar{p})`} />:</p>
      <Tex math={String.raw`n_{\text{per grup}} = \frac{2\bar{p}(1-\bar{p})(z_{1-\alpha/2} + z_{1-\beta})^2}{\delta^2}`} block />
      <p><strong>Versi super-praktis</strong> (α = 5%, power = 80%, dua sisi): <Tex math={String.raw`(z_{1-\alpha/2} + z_{1-\beta})^2 = (1{,}96+0{,}84)^2 \approx 7{,}84 \approx 8`} />:</p>
      <Tex math={String.raw`n_{\text{per grup}} \approx \frac{16\sigma^2}{\delta^2} \quad \text{(aturan "16")}`} block />

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: n untuk uji obat</summary>
        <p>Ingin mendeteksi penurunan gula darah δ = 0,4 poin; σ = 1,2 (dari studi pilot); α = 5%, power = 80%.</p>
        <p><strong>Langkah 1</strong> — pakai aturan 16: <Tex math={String.raw`n \approx 16 \times 1{,}2^2 / 0{,}4^2 = 16 \times 1{,}44/0{,}16 = 144`} /> per grup.<br />
        <strong>Langkah 2</strong> — total 288 pasien.<br />
        <strong>Langkah 3</strong> — bandingkan dengan cerita pembuka: mereka hanya memakai 120 total — <strong>kurang dari separuh</strong> yang dibutuhkan! Kegagalan itu tertulis di rumus sebelum studi dimulai.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;n = 30 selalu cukup (aturan praktis).&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;n = 30&rdquo; adalah aturan untuk <em>aproksimasi normal</em> (CLT), bukan untuk <em>power</em>. Untuk d = 0,5, n = 30 per grup hanya memberi power ~48% — lempar koin! n yang &ldquo;cukup&rdquo; tergantung δ, σ, α, dan power target — tidak ada angka ajaib universal.</p>
      </div>

      <h2 id="mde">MDE — Efek Terkecil yang Layak Dideteksi</h2>
      <p><strong>Definisi.</strong> <strong>MDE</strong> (Minimum Detectable Effect) adalah efek terkecil yang <strong>penting secara bisnis</strong> untuk dideteksi — bukan efek yang kamu <em>harapkan</em>, melainkan efek di bawah mana kamu <strong>tidak peduli</strong>.</p>
      <p><strong>Kepribadian MDE:</strong> si negosiator antara statistik dan bisnis. Statistik bertanya &ldquo;δ berapa?&rdquo;; MDE menjawab &ldquo;di bawah 1 poin konversi, biayanya tidak kembali — jadi desain untuk δ = 1 poin.&rdquo;</p>
      <p><strong>Cara menentukan MDE (dari bisnis, bukan rumus):</strong></p>
      <ol>
        <li><strong>Break-even:</strong> efek berapa yang membuat nilai harapan eksperimen = 0? (Kenaikan revenue vs biaya implementasi.)</li>
        <li><strong>Opportunity cost:</strong> tim bisa mengerjakan apa lagi selama eksperimen berjalan?</li>
        <li><strong>Risiko:</strong> efek negatif sebesar apa yang harus bisa dideteksi untuk menghentikan eksperimen?</li>
      </ol>
      <p><strong>Hubungan MDE–n:</strong> dari rumus, <Tex math={String.raw`n \propto 1/\delta^2`} /> — <strong>MDE separuhnya → n 4× lipat</strong>. MDE ambisius (terlalu kecil) = eksperimen tak berujung; MDE longgar (terlalu besar) = efek penting terlewat. Inilah negosiasi tersulit dalam perencanaan eksperimen.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> jangan tentukan MDE dari &ldquo;efek yang diharapkan&rdquo; (optimisme!), tapi dari <strong>keputusan</strong>: &ldquo;jika efek sebenarnya hanya sebesar X, apakah kami tetap bertindak?&rdquo; Jika jawabannya tidak — maka X adalah MDE yang tepat, dan eksperimen didesain untuk mendeteksi X. Eksperimen yang didesain untuk efek harapan (bukan MDE) akan underpowered tepat saat hasilnya &ldquo;mengecewakan tapi penting&rdquo;.</p>
      </div>

      <PlotlyChart
        data={mdeData}
        title="Ukuran Sampel Meledak Saat MDE Mengecil (baseline 5%, power 80%)"
        layout={{ yaxis: { title: "n per varian" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = sampel yang dibutuhkan per varian untuk mendeteksi MDE tersebut.</p>
        <p><strong>Interpretasi:</strong> MDE 5 pp butuh ~300/varian; MDE 0,5 pp butuh ~30.000/varian — <strong>100× lipat</strong> untuk 10× presisi (hukum kuadrat). <strong>Keputusan bisnis:</strong> jika trafikmu 2.000/hari, MDE 0,5 pp berarti test 15 hari — masuk akal. MDE 0,1 pp berarti 375 hari — tidak masuk akal; terima MDE lebih besar atau jangan test.</p>
      </div>

      <h2 id="kurva">Membaca Kurva Power</h2>
      <PlotlyChart
        data={powerData}
        title="Kurva Power vs n per Grup (uji-t dua sampel, α = 5%)"
        layout={{ xaxis: { title: "n per grup" }, yaxis: { title: "Power", range: [0, 1.02] }, showlegend: true, shapes: [{ type: "line", x0: 20, x1: 1000, y0: 0.8, y1: 0.8, line: { dash: "dash", color: "#16a34a" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = n per grup; vertikal = power. Tiga kurva = tiga effect size. Garis hijau = target 80%.</p>
        <p><strong>Interpretasi:</strong> untuk d = 0,8, 80% tercapai di n ≈ 26; untuk d = 0,5 di n ≈ 64; untuk d = 0,2 di n ≈ 400. <strong>Dua pelajaran:</strong> (1) efek kecil butuh n <em>jauh</em> lebih besar (kuadratik!); (2) di atas ~90%, kurva melandai — menaikkan power 80% → 95% butuh n hampir 2× lipat untuk gain 15 poin. <strong>80% adalah sweet spot</strong> konvensi — bukan hukum alam.</p>
      </div>

      <h2 id="jebakan">Tiga Jebakan Power</h2>
      <p><strong>1. Post-hoc power (&ldquo;observed power&rdquo;).</strong> Menghitung &ldquo;power&rdquo; dari efek yang <em>teramati</em> setelah eksperimen tidak signifikan — lalu menyimpulkan &ldquo;power-nya rendah, jadi belum konklusif&rdquo;. Ini <strong>sirkular dan tidak informatif</strong>: observed power adalah fungsi monoton dari p-value (p besar ⟺ observed power kecil — selalu!). Yang benar: laporkan <strong>CI efeknya</strong> — CI yang lebar sudah menceritakan &ldquo;belum konklusif&rdquo; dengan jujur.</p>
      <p><strong>2. Peeking (mengintip data).</strong> Mengecek hasil tiap hari dan berhenti saat p &lt; 0,05. Setiap intipan adalah &ldquo;kesempatan&rdquo; false positive — 5 intipan menaikkan α efektif jauh di atas 5%. Solusi: <strong>tentukan n di awal dan patuhi</strong> (atau pakai metode sekuensial formal seperti alpha-spending — di luar cakupan lesson ini, tapi ketahui namanya).</p>
      <p><strong>3. Underpower yang disengaja-tidak-sengaja.</strong> &ldquo;Kita coba dulu dengan 50 sampel, kalau menarik kita lanjutkan.&rdquo; Studi pendahuluan underpowered yang &ldquo;menarik&rdquo; (p &lt; 0,05) <strong>melebih-lebihkan efek</strong> secara sistematis (winner&rsquo;s curse) — hanya efek yang kebetulan besar yang lolos saringan. Solusi: pilot untuk <em>estimasi variansi</em>, bukan untuk <em>keputusan</em>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Studi tidak signifikan dengan observed power 30% berarti butuh sampel lebih besar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> observed power tidak memberi informasi di luar p-value itu sendiri — ia <em>dihitung dari</em> efek teramati yang sama. &ldquo;Butuh sampel lebih besar&rdquo; hanya valid jika dihitung dari <strong>MDE yang ditentukan sebelum studi</strong> (a priori), bukan dari efek yang kebetulan teramati. Jangan biarkan angka sirkular membenarkan studi lanjutan yang tidak terencana.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Power = &ldquo;peluang menangkap efek yang benar-benar ada&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Berapa n untuk deteksi beda 2%?</summary>
              <p>Baseline konversi 5%. Ingin deteksi lift ke 7% (beda 2 poin) dengan power 80%, α = 5% (dua sisi). Berapa n per grup?</p>
              <p><strong>Langkah 1</strong> — rumus: n = 2×p̄(1−p̄)×(z<sub>1−α/2</sub> + z<sub>power</sub>)²/δ². p̄ = 0,06; δ = 0,02.<br />
              <strong>Langkah 2</strong> — z<sub>0,975</sub> = 1,96; z<sub>0,8</sub> = 0,84. n = 2×0,06×0,94×(2,8)²/0,0004 = 0,1128×7,84/0,0004 ≈ <strong>2.210</strong> per grup.<br />
              <strong>Langkah 3</strong> — baca: butuh ~4.400 total. Jika traffic hanya 1.000/minggu → <em>tidak feasible</em> dalam waktu wajar → naikkan MDE atau terima power lebih rendah.</p>
              <p>Pelajaran: power analysis <em>sebelum</em> eksperimen mencegah &ldquo;A/B test 2 minggu yang tidak bisa mendeteksi apapun&rdquo; — buang waktu paling umum di industri.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Power rendah — &ldquo;tidak signifikan&rdquo; yang menipu</summary>
              <p>Studi n=30: beda mean 0,5 SD (d=0,5), p = 0,20 (&ldquo;tidak signifikan&rdquo;). Apakah &ldquo;tidak ada efek&rdquo;?</p>
              <p><strong>Langkah 1</strong> — power untuk d=0,5, n=30, α=5%: t ≈ 0,5×√15 ≈ 1,94 → power ≈ <strong>47%</strong>.<br />
              <strong>Langkah 2</strong> — artinya: bahkan jika efek <em>sedang</em> benar-benar ada, studi ini hanya 47% menangkapnya — seperti koin!<br />
              <strong>Langkah 3</strong> — &ldquo;tidak signifikan&rdquo; di sini = <strong>tidak informatif</strong>, bukan &ldquo;tidak ada efek&rdquo;. Butuh n ≈ 64 per grup untuk power 80%.</p>
              <p>Pelajaran: p &gt; 0,05 + power rendah = &ldquo;kita tidak tahu&rdquo;. Jurnal yang mempublish &ldquo;tidak ada efek&rdquo; dari studi underpowered = mempublish ketidaktahuan sebagai temuan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Verifikasi Kurva Power via Simulasi</h2>
      <p>Teori bilang d = 0,5 butuh n ≈ 64 per grup untuk power 80%. Jangan percaya — <strong>buktikan</strong> dengan simulasi ribuan eksperimen.</p>
      <PyodideLab
        title="Lab 1 — Power Simulasi vs Teori (Live Python)"
        hint="⚡ Live Python. Bandingkan hasil simulasi dengan kurva teori di chart. Coba: ubah d jadi 0,2 — saksikan power anjlok dan n yang dibutuhkan meledak."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Kalkulator n untuk A/B Test</h2>
      <p>Kalkulator ukuran sampel untuk A/B test proporsi. Masukkan baseline &amp; MDE — keluar n per varian. Lalu konversi ke hari berdasarkan trafik.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Ukuran Sampel A/B Test (Live Python)"
        hint="Coba: ubah baseline jadi 0,30. n mengecil atau membesar? (Petunjuk: variansi p(1−p) maksimal di p=0,5.) Lalu hitung: trafik 5.000/hari, berapa hari untuk MDE 1pp?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Perencanaan Eksperimen</h2>

      <div className="decision-card">
        <h3>1. Merencanakan eksperimen baru → <strong>hitung n dari MDE (a priori)</strong></h3>
        <p><strong>Kondisi:</strong> sebelum satu data pun dikumpulkan.</p>
        <p><strong>Kenapa:</strong> satu-satunya cara menghindari cerita obat $400 juta. Urutan: tentukan MDE dari bisnis → estimasi σ dari pilot/historis → hitung n → komitmen.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;butuh 144/grup → total 288 pasien → rekrut 6 bulan.&rdquo;</p>
      </div>

      <div className="decision-card">
        <h3>2. n terbatas (budget/waktu) → <strong>hitung MDE yang terjangkau, negosiasi</strong></h3>
        <p><strong>Kondisi:</strong> n maksimal sudah ditentukan duluan (misal hanya 100 pasien tersedia).</p>
        <p><strong>Kenapa:</strong> balik rumusnya: dengan n tetap, MDE berapa yang bisa dideteksi dengan power 80%? Jika MDE itu lebih besar dari yang penting secara bisnis — <strong>jangan jalankan eksperimennya</strong> (atau ubah desain: paired, kovariat, variansi lebih kecil).</p>
        <p><strong>Contoh nyata:</strong> &ldquo;dengan n=100, MDE = 0,8σ — efek di bawah itu tak terlihat; lanjut atau batal?&rdquo;</p>
      </div>

      <div className="decision-card">
        <h3>3. Ingin power lebih tanpa n lebih → <strong>turunkan variansi</strong></h3>
        <p><strong>Kondisi:</strong> n mentok, tapi power kurang.</p>
        <p><strong>Kenapa:</strong> dari rumus, n ∝ σ² — memangkas σ sama kuatnya dengan menambah n. Cara: desain berpasangan, kovariat (ANCOVA/CUPED), pengukuran lebih presisi, populasi lebih homogen.</p>
        <p><strong>Contoh nyata:</strong> A/B test dengan CUPED (pakai data pra-eksperimen sebagai kovariat) memangkas n kebutuhan hingga 50%.</p>
      </div>

      <div className="decision-card">
        <h3>4. Eksperimen berjalan, godaan mengintip → <strong>jangan (atau pakai sekuensial formal)</strong></h3>
        <p><strong>Kondisi:</strong> dashboard live menunjukkan p = 0,04 di hari ke-3.</p>
        <p><strong>Kenapa:</strong> peeking menggelembungkan α. Komitmen pada n yang dihitung; jika harus adaptif, pakai <em>group sequential design</em> dengan alpha-spending yang direncanakan.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;kita cek di 50% dan 100% dengan ambang O&rsquo;Brien-Fleming&rdquo; — bukan &ldquo;cek tiap hari&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>5. Hasil tidak signifikan → <strong>laporkan CI, bukan observed power</strong></h3>
        <p><strong>Kondisi:</strong> eksperimen selesai, p = 0,12.</p>
        <p><strong>Kenapa:</strong> observed power sirkular. CI efek menjawab jujur: &ldquo;efek antara −0,1 dan +0,9 — belum konklusif&rdquo; vs &ldquo;efek antara −0,05 dan +0,08 — praktis nol&rdquo;. Dua kesimpulan yang sangat beda dari p-value yang sama-sama &ldquo;tidak signifikan&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> laporan &ldquo;p=0,12 (95% CI: −0,1, 0,9)&rdquo; vs &ldquo;p=0,12 (95% CI: −0,02, 0,05)&rdquo;.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Hitung n SEBELUM eksperimen.</strong> Tidak ada pengecualian untuk eksperimen yang mahal.</li>
          <li><strong>MDE dari bisnis</strong> (break-even), bukan dari optimisme. n ∝ 1/MDE² — MDE separuh = n 4×.</li>
          <li><strong>Aturan 16:</strong> n/grup ≈ 16σ²/δ² (α=5%, power=80%) — untuk estimasi cepat.</li>
          <li><strong>Jangan intip.</strong> Jangan hitung observed power. Laporkan CI.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Berapa Lama A/B Test Harus Jalan?</h2>
      <div className="callout">
        <p>Fintech &ldquo;DanaKita&rdquo; mendesain ulang alur pengajuan kredit. Baseline konversi pengajuan→cair = <strong>12%</strong>. Trafik: <strong>4.000 pengunjung/hari</strong> (dibagi 2 varian). Tim produk: &ldquo;jalankan 7 hari, lihat hasilnya.&rdquo;</p>
        <p>Analisis biaya: redesign menelan Rp800 juta; break-even butuh kenaikan <strong>≥ 1,5 poin</strong> (MDE = 1,5 pp).</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung n per varian untuk MDE 1,5 pp (α=5%, power=80%). (b) Berapa hari test harus jalan? (c) Apa responsmu terhadap &ldquo;7 hari cukup&rdquo;?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <Tex math={String.raw`n = \frac{2 \times 0{,}12 \times 0{,}88 \times (1{,}96+0{,}84)^2}{0{,}015^2} = \frac{2 \times 0{,}1056 \times 7{,}84}{0{,}000225} \approx 7.358`} /> per varian → total ~14.700.</p>
          <p>(b) 14.700 / 4.000 ≈ <strong>3,7 hari</strong> — dibulatkan ke <strong>7 hari penuh</strong> (mencakup siklus mingguan!) → 1 minggu sebenarnya <em>cukup secara n</em>. Tapi…</p>
          <p>(c) <strong>&ldquo;7 hari&rdquo; benar secara kebetulan, bukan secara metode.</strong> Respons tepat: &ldquo;7 hari cukup <em>untuk MDE 1,5 pp</em> — saya sudah hitung. Tapi (1) jangan intip di hari ke-3; (2) jalankan kelipatan minggu penuh (efek day-of-week); (3) jika hasilnya tidak signifikan, itu berarti efek &lt; 1,5 pp — <em>di bawah break-even</em> — jadi keputusannya tetap jelas: jangan ship. <strong>Eksperimen yang direncanakan dengan benar memberi keputusan yang jelas bahkan saat &lsquo;gagal&rsquo;.</strong>&rdquo;</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Sebutkan 4 faktor yang menaikkan power. Mana yang paling &ldquo;murah&rdquo;?</li>
              <li>Power 80% artinya apa — dalam bahasa non-teknis untuk direksi?</li>
              <li>Mengapa &ldquo;power analysis setelah eksperimen&rdquo; (post-hoc power dari efek teramati) tidak berguna?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) <strong>n lebih besar</strong>, (b) efek lebih besar (MDE), (c) α lebih besar, (d) <strong>varians lebih kecil</strong> (desain berpasangan! kontrol kovariat!). Paling murah: <em>kurangi varians via desain</em> (blocking/pairing) — tidak butuh sampel lebih banyak.</p>
              <p><strong>2.</strong> &ldquo;Jika perbedaannya benar-benar sebesar yang kita cari, eksperimen ini 80% akan menangkapnya — 20% kita melewatkannya karena sial.&rdquo; (Jangan: &ldquo;80% hasilnya benar&rdquo;!)</p>
              <p><strong>3.</strong> Post-hoc power = fungsi deterministik dari p-value (p kecil → power &ldquo;tinggi&rdquo;) — ia tidak memberi info baru, hanya mengemas ulang p-value. Yang berguna: <em>confidence interval</em> efek (menunjukkan rentang efek yang kompatibel).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Studi obat memakai n=120 total padahal butuh 288 untuk power 80%. Hasil p=0,12. Kesimpulan tepat?"
        options={[
          "Obat tidak manjur — terbukti",
          "Studi underpowered: p=0,12 tidak membedakan 'tidak ada efek' dari 'efek ada tapi tak terlihat'. Lihat CI-nya",
          "Tambah 10 pasien pasti signifikan",
          "Ulangi analisis sampai signifikan",
        ]}
        correct={1}
        explanation="Benar. Dengan power ~35%, hasil tidak signifikan adalah outcome yang diharapkan bahkan jika obat manjur. Vonis 'obat gagal' dari studi underpowered = menyalahkan obat atas kegagalan desain."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dengan rumus n ∝ 1/δ²: MDE diperkecil dari 2 pp menjadi 1 pp. Apa yang terjadi pada n?"
        options={[
          "Tetap",
          "Naik 2×",
          "Naik 4×",
          "Turun 2×",
        ]}
        correct={2}
        explanation="Benar — hubungan kuadratik. MDE separuh → n 4× lipat. Inilah mengapa negosiasi MDE adalah negosiasi tersulit: ambisi presisi 2× lipat harganya 4× sampel."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. n mentok di 100/grup tapi butuh power 80% untuk d=0,3 (butuh ~175/grup). Opsi paling cerdas?"
        options={[
          "Jalankan saja dengan 100 — semoga beruntung",
          "Turunkan variansi: desain berpasangan / tambah kovariat (ANCOVA/CUPED) — n ∝ σ², jadi σ lebih kecil = n efektif lebih besar",
          "Naikkan α jadi 20%",
          "Laporkan p-value apa adanya nanti",
        ]}
        correct={1}
        explanation="Benar. Dari rumus, memangkas σ sekian persen setara menambah n. Desain berpasangan atau kovariat pra-eksperimen (CUPED) adalah 'n gratis' — sering memangkas kebutuhan sampel 30–50%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa 'observed power' (dihitung dari efek teramati) tidak informatif?"
        options={[
          "Karena rumusnya rumit",
          "Karena ia fungsi monoton dari p-value — p besar ⟺ observed power kecil, selalu. Tidak ada info baru; laporkan CI efeknya",
          "Karena butuh n besar",
          "Karena hanya untuk proporsi",
        ]}
        correct={1}
        explanation="Benar. Observed power = transformasi deterministik dari p-value yang sama. 'Power-nya rendah' setelah p=0,12 adalah pengulangan, bukan penjelasan. CI efek memberi informasi yang sebenarnya dibutuhkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Tim mengecek dashboard A/B test tiap hari dan berhenti saat p<0,05 (hari ke-4 dari rencana 14 hari). Masalahnya?"
        options={[
          "Tidak ada — efisien",
          "Peeking: tiap intipan adalah kesempatan false positive; α efektif jauh di atas 5%. Harus komitmen pada n awal atau pakai desain sekuensial formal",
          "Harusnya berhenti di hari ke-3",
          "p-value hari ke-4 tidak valid karena n kecil",
        ]}
        correct={1}
        explanation="Benar. Berhenti saat 'menang' adalah seleksi bias — seperti berhenti melempar koin saat sedang unggul lalu mengklaim koinnya bias. Solusi: pre-commit n, atau alpha-spending (O'Brien-Fleming) yang direncanakan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. 'Power studi ini 80%.' Apa yang kurang dari kalimat itu?"
        options={[
          "Tidak kurang apa-apa",
          "'Untuk efek sebesar APA' — power selalu bersyarat pada δ tertentu. 80% untuk d=0,8 bisa berarti 25% untuk d=0,3",
          "Harusnya 90%",
          "α-nya tidak disebut",
        ]}
        correct={1}
        explanation="Benar. Power tanpa δ = kecepatan tanpa arah. Selalu lengkapi: 'power 80% untuk mendeteksi d=0,5 pada α=5%'. Tanpa itu, angka 80% tidak bisa dinilai."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Power = 1−β</strong>: peluang mendeteksi efek nyata. Selalu sebutkan <em>untuk δ berapa</em>.</li>
          <li><strong>4 tuas:</strong> δ↑, n↑, α↑, σ↓ → power↑. n adalah satu-satunya yang sepenuhnya kamu kendalikan.</li>
          <li><strong>Rumus:</strong> <Tex math={String.raw`n = 2\sigma^2(z_{1-\alpha/2}+z_{1-\beta})^2/\delta^2`} />. <strong>Aturan 16:</strong> <Tex math={String.raw`n \approx 16\sigma^2/\delta^2`} />.</li>
          <li><strong>MDE dari bisnis</strong> (break-even), bukan optimisme. n ∝ 1/MDE².</li>
          <li><strong>80% = sweet spot</strong> konvensi; 80→95% butuh n ~2× untuk gain 15 poin.</li>
          <li><strong>3 jebakan:</strong> observed power (sirkular), peeking (α menggelembung), underpower (winner&rsquo;s curse).</li>
          <li><strong>Jangan:</strong> menjalankan eksperimen mahal tanpa hitung n; mengintip; memakai &ldquo;n=30&rdquo; sebagai jaminan power.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a29-bootstrap" className="btn btn-secondary btn-sm">← A2.9</Link>
        <Link href="/learn/a211-ab-testing" className="btn btn-primary btn-sm">Next: A2.11 →</Link>
      </div>
    </div>
  );
}
