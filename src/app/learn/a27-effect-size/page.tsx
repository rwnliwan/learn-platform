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

export default function A27Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: dua distribusi dengan d=0.2 (overlap besar) vs d=0.8 (overlap kecil)
  const xs: number[] = [];
  for (let x = -4; x <= 8; x += 0.1) xs.push(Math.round(x * 10) / 10);
  const overlapSmall = [
    { x: xs, y: xs.map((x) => normPdf(x, 0, 1)), type: "scatter", mode: "lines", name: "Kontrol", line: { color: "#94a3b8" } },
    { x: xs, y: xs.map((x) => normPdf(x, 0.2, 1)), type: "scatter", mode: "lines", name: "Perlakuan (d = 0,2)", line: { color: "#2a7de1" } },
  ];
  const overlapLarge = [
    { x: xs, y: xs.map((x) => normPdf(x, 0, 1)), type: "scatter", mode: "lines", name: "Kontrol", line: { color: "#94a3b8" } },
    { x: xs, y: xs.map((x) => normPdf(x, 0.8, 1)), type: "scatter", mode: "lines", name: "Perlakuan (d = 0,8)", line: { color: "#c2410c" } },
  ];

  // Chart 2: p-value vs n pada effect size TETAP (d=0.2) — signifikansi tanpa pentingnya
  const nVals = [50, 100, 200, 400, 800, 1600, 3200];
  // p-value dua sisi aproksimasi untuk d=0.2, dua sampel sama besar
  const pVsNData = [
    {
      x: nVals,
      y: nVals.map((n) => {
        const t = 0.2 * Math.sqrt(n / 2);
        // aproksimasi p dua sisi via normal
        const Phi = 0.5 * (1 + erf(t / Math.sqrt(2)));
        return 2 * (1 - Phi);
      }),
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "#c2410c" },
      name: "p-value (d tetap = 0,2)",
    },
  ];
  function erf(x: number) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  }

  // Chart 3: Cohen's d beberapa skenario bisnis
  const dExamplesData = [
    {
      x: ["Aspirin vs<br>serangan jantung", "Iklan: +0,1pp<br>konversi", "Pelatihan:<br>+8 poin skor", "Obat vs<br>plasebo (kuat)"],
      y: [0.06, 0.02, 0.8, 1.2],
      type: "bar",
      marker: { color: ["#e8a838", "#94a3b8", "#2a7de1", "#16a34a"] },
      text: ["d=0,06", "d=0,02", "d=0,8", "d=1,2"],
      textposition: "outside",
    },
  ];

  const lab1Code = `import math, statistics as st

# Cohen's d: selisih mean dalam satuan "simpangan baku"
def cohens_d(a, b):
    n1, n2 = len(a), len(b)
    m1, m2 = st.mean(a), st.mean(b)
    s1, s2 = st.stdev(a), st.stdev(b)
    sp = math.sqrt(((n1-1)*s1**2 + (n2-1)*s2**2) / (n1+n2-2))
    return (m1 - m2) / sp

# Data: skor literasi keuangan (0-100), kontrol vs ikut pelatihan
kontrol   = [58, 62, 55, 70, 64, 59, 66, 61, 57, 68, 63, 60]
perlakuan = [66, 70, 63, 78, 72, 67, 74, 69, 65, 76, 71, 68]

d = cohens_d(perlakuan, kontrol)
print(f"mean kontrol   = {st.mean(kontrol):.1f}")
print(f"mean perlakuan = {st.mean(perlakuan):.1f}")
print(f"Cohen's d = {d:.2f}")
print()
print("Patokan Cohen: 0.2 kecil | 0.5 sedang | 0.8 besar")
print("Coba: ubah perlakuan jadi +2 poin saja dari kontrol.")
print("d jatuh ke ~0.2 — 'kecil'. Apakah pelatihan masih layak biayanya?")`;

  const lab2Code = `import math

# p-value MENYUSUT dengan n, padahal effect size TETAP.
# d = 0.2 (kecil), dua grup sama besar. Hitung p-value vs n.
def p_for_n(n, d=0.2):
    t = d * math.sqrt(n/2)
    Phi = 0.5*(1 + math.erf(t/math.sqrt(2)))
    return 2*(1 - Phi)

print(f"{'n per grup':>10}  {'p-value':>8}  {'Signifikan?':>12}  (d tetap = 0.2)")
for n in [50, 200, 800, 3200]:
    p = p_for_n(n)
    print(f"{n:>10}  {p:>8.4f}  {'YA *' if p < 0.05 else 'tidak':>12}")

print()
print("* 'Signifikan' pada n=3200 untuk d=0.2 — efek yang SAMA yang")
print("  'tidak signifikan' pada n=50. Signifikansi mengukur BUKTI,")
print("  bukan PENTINGNYA. Itulah mengapa effect size wajib dilaporkan.")
print("Coba: ubah d jadi 0.05. Pada n berapa ia jadi 'signifikan'?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.7 — Statistika Inferensial</span>
        <h1 className="display-title">Signifikan Belum Tentu Penting:<br />Effect Size</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> <strong>Uji hipotesis</strong> menjawab &ldquo;apakah efeknya nyata?&rdquo; via p-value — tapi p-value mencampuradukkan <em>besarnya efek</em> dengan <em>besarnya sampel</em>. Dengan n raksasa, efek yang trivial pun jadi &ldquo;signifikan&rdquo;. Lesson ini memisahkan keduanya: <strong>effect size</strong> mengukur <em>seberapa besar</em> efeknya dalam satuan yang bisa diinterpretasi — jawaban atas &ldquo;oke signifikan, lalu seberapa penting?&rdquo;</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kemenangan Rp17 Miliar yang Hampa</a></li>
          <li><a href="#konsep">Effect Size — Mengukur &ldquo;Seberapa&rdquo;</a></li>
          <li><a href="#cohen">Cohen&rsquo;s d — Selisih dalam Satuan Standar</a></li>
          <li><a href="#proporsi">Effect Size untuk Proporsi — OR, RR, V</a></li>
          <li><a href="#penting">Signifikan vs Penting — Dua Pertanyaan Berbeda</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Cohen&rsquo;s d Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: p-value Menyusut, Efek Tetap</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Effect Size Mana</a></li>
          <li><a href="#case">📋 Mini-Case: A/B Test yang &ldquo;Menang&rdquo; 0,1 Poin</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan <strong>signifikansi statistik</strong> vs <strong>signifikansi praktis</strong> dengan contoh konkret.</li>
          <li>Menghitung <strong>Cohen&rsquo;s d</strong> dan menginterpretasikannya via patokan 0,2 / 0,5 / 0,8 serta bahasa overlap.</li>
          <li>Menghitung <strong>odds ratio</strong>, <strong>risk ratio</strong>, dan <strong>Cramér&rsquo;s V</strong> untuk data kategorikal.</li>
          <li>Menjelaskan mengapa p-value bisa signifikan untuk efek trivial — dan cara melaporkannya dengan jujur.</li>
          <li>Memilih effect size yang tepat untuk tiap desain (beda mean, proporsi, ANOVA, korelasi).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Kemenangan Rp17 Miliar yang Hampa</h2>
      <div className="story">
        <p>E-commerce &ldquo;BelanjaYuk&rdquo; menjalankan A/B test tombol checkout selama sebulan: <strong>2 juta pengunjung per varian</strong>. Hasil: varian B menang — konversi naik dari 3,00% ke 3,10%. p-value &lt; 0,001, &ldquo;sangat signifikan&rdquo;. Tim merayakan: proyeksi kenaikan revenue <strong>Rp17 miliar/tahun</strong>!</p>
        <p>Namun CFO mengernyit: &ldquo;Implementasi penuh butuh migrasi 3 bulan, biaya Rp4 miliar, dan risiko bug. Kenaikan 0,1 poin — seberapa yakin kita angkanya <em>sebesar itu</em>, bukan sekadar <em>ada</em>?&rdquo;</p>
        <p>Analis menghitung ulang: interval kepercayaan kenaikannya adalah <strong>(0,02 pp, 0,18 pp)</strong>. Skenario pesimis: kenaikan cuma 0,02 poin → tambahan revenue Rp3,4 miliar — <em>di bawah</em> biaya implementasi. &ldquo;Kemenangan signifikan&rdquo; itu ternyata taruhan yang belum tentu untung.</p>
        <p><strong>Twist-nya:</strong> p &lt; 0,001 hanya menjawab &ldquo;apakah efeknya <em>ada</em>?&rdquo; — dan dengan 4 juta pengunjung, bahkan efek debu pun terdeteksi. Pertanyaan yang seharusnya diajukan: &ldquo;<em>seberapa besar</em> efeknya, dan apakah cukup besar untuk membenarkan biayanya?&rdquo; Itulah wilayah <strong>effect size</strong> — dan tanpanya, signifikansi adalah selebrasi prematur.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="konsep">Effect Size — Mengukur &ldquo;Seberapa&rdquo;</h2>
      <p><strong>Definisi.</strong> <strong>Effect size</strong> (ukuran efek) adalah ukuran <strong>besarnya</strong> perbedaan/hubungan, dalam satuan yang <strong>tidak tergantung ukuran sampel</strong>. Jika p-value menjawab &ldquo;apakah?&rdquo;, effect size menjawab &ldquo;seberapa?&rdquo;.</p>
      <p><strong>Kepribadian konsep ini:</strong> si penasihat bijak yang menenangkan euforia. Saat semua orang bersorak &ldquo;p &lt; 0,001!&rdquo;, ia bertanya pelan: &ldquo;ya, tapi <em>seberapa</em>?&rdquo; — dan sering jawabannya membuat ruangan hening.</p>
      <p><strong>Keluarga besar effect size:</strong></p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Desain</th><th>Effect size</th><th>Arti</th></tr></thead>
          <tbody>
            <tr><td>Beda dua mean</td><td><strong>Cohen&rsquo;s d</strong></td><td>Selisih dalam satuan SD</td></tr>
            <tr><td>Beda dua proporsi</td><td><strong>Cohen&rsquo;s h</strong></td><td>Selisih proporsi terstandarisasi</td></tr>
            <tr><td>Tabel 2×2</td><td><strong>Odds ratio (OR)</strong></td><td>Rasio odds dua kelompok</td></tr>
            <tr><td>Risiko/kejadian</td><td><strong>Risk ratio (RR)</strong></td><td>Rasio peluang kejadian</td></tr>
            <tr><td>Tabel r×c</td><td><strong>Cramér&rsquo;s V</strong></td><td>Kekuatan asosiasi 0–1</td></tr>
            <tr><td>ANOVA</td><td><strong>Eta-squared (η²)</strong></td><td>Proporsi variansi dijelaskan</td></tr>
            <tr><td>Korelasi</td><td><strong>r</strong> itu sendiri</td><td>Kekuatan hubungan linear</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Kapan memakai:</strong> <strong>selalu, berdampingan dengan p-value</strong>. Laporan yang hanya punya p-value tanpa effect size = klaim tanpa besaran. Standar pelaporan modern (APA, Nature): effect size + interval kepercayaannya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> effect size yang baik bersifat <strong>scale-free</strong> (tidak tergantung satuan) dan <strong>bebas n</strong>. &ldquo;Selisih Rp50 ribu&rdquo; tidak bisa dibandingkan antar konteks; &ldquo;d = 0,5&rdquo; bisa — artinya sama di Jakarta maupun di Tokyo, di n=50 maupun n=50.000. Inilah yang membuatnya menjadi &ldquo;bahasa universal&rdquo; untuk membandingkan temuan antar studi.</p>
      </div>

      <h2 id="cohen">Cohen&rsquo;s d — Selisih dalam Satuan Standar</h2>
      <p><strong>Definisi.</strong> <strong>Cohen&rsquo;s d</strong> = selisih dua mean dibagi simpangan baku gabungan:</p>
      <Tex math={String.raw`d = \frac{\bar{x}_1 - \bar{x}_2}{s_p}, \qquad s_p = \sqrt{\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}}`} block />
      <p><strong>Artinya tiap simbol:</strong> pembilang = selisih mentah (misal 8 poin); penyebut <Tex math={String.raw`s_p`} /> = simpangan baku gabungan (pooled) — &ldquo;penggaris&rdquo; yang mengukur seberapa besar 8 poin itu <em>relatif terhadap variasi alami data</em>. d = 0,8 berarti &ldquo;selisihnya 80% dari satu simpangan baku&rdquo;.</p>
      <p><strong>Patokan Cohen (1988)</strong> — kasar tapi berguna sebagai bahasa awal:</p>
      <ul>
        <li><strong>d ≈ 0,2</strong> — kecil: distribusi hampir tumpang tindih total (lihat chart kiri).</li>
        <li><strong>d ≈ 0,5</strong> — sedang: pergeseran mulai terlihat mata telanjang.</li>
        <li><strong>d ≈ 0,8</strong> — besar: dua distribusi jelas terpisah (chart kanan).</li>
      </ul>
      <p><strong>Bahasa yang lebih hidup — overlap:</strong> d = 0,2 → ~85% overlap (hampir tak terbedakan); d = 0,8 → ~53% overlap; d = 1,2 → ~38%. Atau bahasa probabilitas: <strong>P(X₁ &gt; X₂)</strong> = 56% untuk d=0,2 vs 80% untuk d=0,8 — &ldquo;ambil satu orang acak dari tiap grup, seberapa sering yang perlakuan menang?&rdquo;</p>
      <p><strong>Kepribadian Cohen&rsquo;s d:</strong> si penerjemah — mengubah &ldquo;selisih 8 poin&rdquo; (tidak bermakna tanpa konteks) menjadi &ldquo;0,8 simpangan baku&rdquo; (langsung terasa: besar!).</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Cohen&rsquo;s d</summary>
        <p>Skor pelatihan: kontrol (n=12, mean 61,7, s=4,5), perlakuan (n=12, mean 69,7, s=4,5).</p>
        <p><strong>Langkah 1</strong> — pooled SD: <Tex math={String.raw`s_p = \sqrt{\frac{11 \times 4{,}5^2 + 11 \times 4{,}5^2}{22}} = 4{,}5`} />.<br />
        <strong>Langkah 2</strong> — <Tex math={String.raw`d = (69{,}7 - 61{,}7)/4{,}5 = 8/4{,}5 \approx 1{,}78`} />.<br />
        <strong>Langkah 3</strong> — interpretasi: d ≈ 1,8 = <strong>sangat besar</strong>. Pelatihan menggeser skor hampir 2 simpangan baku — efek yang terlihat jelas bahkan tanpa statistik.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;d = 0,8 selalu berarti penting; d = 0,2 selalu berarti tidak penting.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> patokan Cohen adalah <em>titik awal</em>, bukan vonis. d = 0,06 untuk aspirin mencegah serangan jantung menyelamatkan <strong>ribuan nyawa</strong> (efek kecil × populasi raksasa = dampak raksasa). Sebaliknya d = 0,8 pada metrik vanity yang tidak terkait revenue = tidak penting. <strong>Penting tidaknya = effect size × konteks bisnis</strong>, bukan effect size saja.</p>
      </div>

      <PlotlyChart
        data={overlapSmall}
        title="d = 0,2 (Kecil): Distribusi Hampir Tumpang Tindih Total"
        layout={{ xaxis: { title: "Skor (satuan SD)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kurva normal; biru digeser 0,2 SD ke kanan dari abu-abu.</p>
        <p><strong>Interpretasi:</strong> overlap ~85% — jika kamu mengambil satu individu acak, hampir mustahil menebak ia dari grup mana. Inilah arti visual &ldquo;efek kecil&rdquo;: <strong>nyata secara statistik (dengan n cukup), tapi tak terasa secara individu</strong>.</p>
      </div>

      <PlotlyChart
        data={overlapLarge}
        title="d = 0,8 (Besar): Pergeseran Terlihat Jelas"
        layout={{ xaxis: { title: "Skor (satuan SD)" }, yaxis: { title: "Kepadatan" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sama, tapi pergeseran 0,8 SD.</p>
        <p><strong>Interpretasi:</strong> overlap ~53% — individu acak dari grup perlakuan mengalahkan 79% individu kontrol. <strong>Inilah &ldquo;efek besar&rdquo;: terlihat bahkan tanpa uji statistik.</strong> Bandingkan dengan chart sebelumnya dan rasakan perbedaannya — itulah yang diukur d.</p>
      </div>

      <h2 id="proporsi">Effect Size untuk Proporsi — OR, RR, V</h2>
      <p>Untuk data kategorikal (konversi, default, fraud), &ldquo;selisih dalam SD&rdquo; tidak berlaku. Tiga ukuran standar:</p>
      <p><strong>1. Risk Ratio (RR)</strong> — rasio peluang kejadian:</p>
      <Tex math={String.raw`RR = \frac{p_1}{p_2}`} block />
      <p>Contoh: default 6% vs 3% → RR = 2,0 (&ldquo;risiko 2× lipat&rdquo;). Intuitif dan mudah dijelaskan ke direksi.</p>
      <p><strong>2. Odds Ratio (OR)</strong> — rasio odds:</p>
      <Tex math={String.raw`OR = \frac{p_1/(1-p_1)}{p_2/(1-p_2)} = \frac{ad}{bc}`} block />
      <p>Untuk tabel 2×2 [[a,b],[c,d]]. OR ≈ RR saat kejadian langka (p kecil) — itulah mengapa studi kasus-kontrol (kedokteran) melaporkan OR. <strong>Untuk kejadian umum, OR melebih-lebihkan</strong> dibanding RR — sumber kebingungan media &ldquo;risiko naik 300%!&rdquo;.</p>
      <p><strong>3. Cramér&rsquo;s V</strong> — kekuatan asosiasi tabel r×c, skala 0–1:</p>
      <Tex math={String.raw`V = \sqrt{\frac{\chi^2}{n \cdot \min(r-1, c-1)}}`} block />
      <p>V = 0 tidak ada hubungan; V = 1 hubungan sempurna. Patokan kasar: 0,1 kecil, 0,3 sedang, 0,5 besar (untuk df kecil).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Odds ratio 3 berarti risikonya 3× lipat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> hanya jika kejadiannya langka. Contoh: p₁ = 40%, p₂ = 20% → RR = 2,0 tapi OR = (0,4/0,6)/(0,2/0,8) = <strong>2,67</strong>. Media yang menulis &ldquo;risiko naik 167%!&rdquo; dari OR = 2,67 padahal risiko sebenarnya naik 100% (RR = 2,0) sedang melebih-lebihkan. <strong>Untuk komunikasi ke non-teknis, RR hampir selalu lebih jujur.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk tabel 2×2, selalu hitung <strong>keduanya</strong> (RR untuk komunikasi, OR untuk pemodelan — karena regresi logistik bekerja dalam odds). Jika keduanya bercerita sangat beda, kejadiannya tidak langka — dan saat itulah kamu harus ekstra hati-hati dengan headline.</p>
      </div>

      <h2 id="penting">Signifikan vs Penting — Dua Pertanyaan Berbeda</h2>
      <p>Hubungan matematisnya eksplisit. Untuk uji-t dua sampel:</p>
      <Tex math={String.raw`t = d \times \sqrt{\frac{n_1 n_2}{n_1+n_2}} \;\; \xrightarrow[n \to \infty]{}\;\; \infty \text{ untuk } d > 0 \text{ sekecil apapun}`} block />
      <p><strong>Artinya:</strong> statistik uji = effect size × faktor ukuran sampel. <strong>Untuk d &gt; 0 sekecil apapun, n yang cukup besar <em>pasti</em> menghasilkan &ldquo;signifikan&rdquo;.</strong> Signifikansi mengukur <em>kekuatan bukti</em> (apakah efeknya ada?), yang tumbuh dengan n. Effect size mengukur <em>besarnya efek</em> (seberapa?), yang tidak tergantung n.</p>
      <p>Matriks keputusannya:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th></th><th>Effect size besar</th><th>Effect size kecil</th></tr></thead>
          <tbody>
            <tr><td><strong>Signifikan</strong></td><td>✅ Temuan kuat — rayakan (dengan CI)</td><td>⚠️ Nyata tapi trivial — hitung ROI sebelum bertindak</td></tr>
            <tr><td><strong>Tidak signifikan</strong></td><td>⚠️ Mungkin underpowered — cek power, jangan simpulkan &ldquo;tidak ada efek&rdquo;</td><td>✅ Konsisten: tidak ada yang menarik</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={pVsNData}
        title="p-value Menyusut dengan n, Padahal Effect Size Tetap (d = 0,2)"
        layout={{ xaxis: { title: "n per grup" }, yaxis: { title: "p-value", type: "log" }, showlegend: false, shapes: [{ type: "line", x0: 50, x1: 3200, y0: 0.05, y1: 0.05, line: { dash: "dash", color: "#16a34a" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = ukuran sampel per grup; vertikal = p-value (skala log). Efeknya <em>tetap</em> d = 0,2. Garis hijau = α = 5%.</p>
        <p><strong>Interpretasi:</strong> efek yang <em>identik</em> menjadi &ldquo;signifikan&rdquo; hanya karena n membesar — p-value melintasi garis hijau di sekitar n ≈ 400. <strong>Ini bukan efeknya yang membesar; ini buktinya yang menguat.</strong> Analis yang hanya membaca bintang signifikansi akan &ldquo;menemukan&rdquo; efek penting di n=3.200 yang &ldquo;tidak ada&rdquo; di n=50 — padahal efeknya sama persis.</p>
      </div>

      <PlotlyChart
        data={dExamplesData}
        title="Cohen's d dalam Konteks Nyata: Kecil Bisa Menyelamatkan Nyawa"
        layout={{ yaxis: { title: "Cohen's d" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = effect size empat temuan nyata yang terkenal.</p>
        <p><strong>Interpretasi:</strong> aspirin (d = 0,06, &ldquo;sangat kecil&rdquo;) mencegah ribuan serangan jantung per tahun — karena dikalikan jutaan pasien. Sebaliknya kenaikan konversi 0,1 pp (d = 0,02) mungkin tidak menutup biaya implementasi. <strong>Penting = d × skala dampak × biaya.</strong> Tidak ada angka d yang &ldquo;penting&rdquo; dalam vakum.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Signifikan = &ldquo;nyata&rdquo;; effect size = &ldquo;penting&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Cohen&apos;s d — beda gaji dua kota</summary>
              <p>Jakarta: mean 12jt (s=3jt, n=50). Surabaya: mean 10,5jt (s=2,5jt, n=60). p = 0,006 (signifikan!). Berapa <em>besar</em> efeknya?</p>
              <p><strong>Langkah 1</strong> — s pooled = √[(49×9 + 59×6,25)/108] = √(808,75/108) = √7,49 ≈ 2,74.<br />
              <strong>Langkah 2</strong> — d = (12 − 10,5)/2,74 = <strong>0,55</strong> → efek <em>sedang</em> (Cohen: 0,2 kecil; 0,5 sedang; 0,8 besar).<br />
              <strong>Langkah 3</strong> — baca bisnis: beda 1,5jt = 0,55 SD — cukup besar untuk kebijakan (mis. UMR), bukan sekadar &ldquo;nyata statistik&rdquo;.</p>
              <p>Pelajaran: p-value menjawab &ldquo;apakah beda&rdquo;; d menjawab &ldquo;seberapa beda&rdquo;. Laporkan keduanya — selalu.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: n raksasa — efek mungil yang &ldquo;signifikan&rdquo;</summary>
              <p>A/B test: n = 2 juta per grup. Konversi: 5,00% vs 5,05%. p &lt; 0,001! Luncurkan?</p>
              <p><strong>Langkah 1</strong> — SE ≈ √(0,05×0,95×2/2jt) ≈ 0,00022. z = 0,0005/0,00022 ≈ 2,3 → p ≈ 0,02. (Dengan n raksasa, bahkan 0,05% signifikan!)<br />
              <strong>Langkah 2</strong> — effect size: h Cohen ≈ 2×arcsin(√0,0505) − 2×arcsin(√0,05) ≈ <strong>0,002</strong> — super mungil.<br />
              <strong>Langkah 3</strong> — lift absolut 0,05% × 2 juta = 1.000 konversi — <em>mungkin</em> berarti bisnisnya, tapi &ldquo;signifikan&rdquo; tidak membuktikannya.</p>
              <p>Pelajaran: n besar → SE kecil → <em>apapun</em> signifikan. Inilah mengapa tech company memakai <em>minimum detectable effect</em> &amp; pertimbangan biaya — bukan p-value buta.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Hitung Cohen&rsquo;s d Sendiri</h2>
      <p>Hitung d dari data skor pelatihan (kontrol vs perlakuan) dengan pooled SD. Rasakan bagaimana &ldquo;selisih 8 poin&rdquo; menjadi &ldquo;d = 1,78&rdquo; yang langsung terasa besarnya.</p>
      <PyodideLab
        title="Lab 1 — Cohen's d dari Nol (Live Python)"
        hint="⚡ Live Python. Coba: ubah perlakuan jadi hanya +2 poin dari kontrol. d jatuh ke ~0,4. Lalu naikkan variansi (sebar data) — d menyusut meski selisih mean tetap!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: p-value Menyusut, Efek Tetap</h2>
      <p>Buktikan secara numerik: effect size <strong>tetap</strong> d = 0,2, tapi p-value melintasi 0,05 hanya karena n membesar.</p>
      <PyodideLab
        title="Lab 2 — Signifikansi Tanpa Pentingnya (Live Python)"
        hint="Coba: ubah d jadi 0,05 (sangat kecil). Pada n berapa ia jadi 'signifikan'? Renungkan: dengan data cukup, APAPUN jadi signifikan."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Effect Size Mana</h2>

      <div className="decision-card">
        <h3>1. Beda dua mean (skala interval) → <strong>Cohen&rsquo;s d</strong></h3>
        <p><strong>Kondisi:</strong> skor, waktu, nominal rupiah — selisih mean bermakna.</p>
        <p><strong>Kenapa:</strong> scale-free, bebas n, punya bahasa overlap yang intuitif. Untuk n kecil pertimbangkan koreksi <strong>Hedges&rsquo; g</strong> (d yang dikoreksi bias).</p>
        <p><strong>Contoh nyata:</strong> &ldquo;pelatihan menaikkan skor d = 0,8 (95% CI: 0,5–1,1)&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. Beda dua proporsi / risiko → <strong>Risk Ratio</strong> (komunikasi), <strong>Odds Ratio</strong> (model)</h3>
        <p><strong>Kondisi:</strong> konversi, default rate, fraud rate.</p>
        <p><strong>Kenapa:</strong> RR intuitif (&ldquo;2× lipat&rdquo;); OR untuk regresi logistik. Jangan tukar keduanya saat kejadian umum.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;segmen A default 2× segmen B (RR = 2,0)&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>3. Tabel r×c → <strong>Cramér&rsquo;s V</strong></h3>
        <p><strong>Kondisi:</strong> asosiasi dua variabel kategorik (hasil chi-square signifikan — seberapa kuat?).</p>
        <p><strong>Kenapa:</strong> skala 0–1 yang comparable antar tabel. Chi-square tanpa V = &ldquo;ada hubungan&rdquo; tanpa &ldquo;seberapa kuat&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> V = 0,12 untuk kanal × kepuasan — signifikan tapi lemah.</p>
      </div>

      <div className="decision-card">
        <h3>4. ANOVA / regresi → <strong>η² / R²</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;berapa proporsi variansi yang dijelaskan?&rdquo;</p>
        <p><strong>Kenapa:</strong> bahasa &ldquo;% variansi&rdquo; paling mudah dicerna non-teknis. Untuk perbandingan model pakai versi adjusted.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;model menjelaskan 34% variasi default (R² = 0,34)&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>5. Korelasi → <strong>r itu sendiri</strong></h3>
        <p><strong>Kondisi:</strong> hubungan dua variabel kontinu.</p>
        <p><strong>Kenapa:</strong> r sudah merupakan effect size (0,1 kecil, 0,3 sedang, 0,5 besar). r² = proporsi variansi bersama.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;korelasi skor kredit–default r = −0,4 (sedang-kuat)&rdquo;.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Selalu laporkan effect size + CI-nya</strong> berdampingan dengan p-value. Tanpa d/OR/V, &ldquo;signifikan&rdquo; tidak bisa dinilai.</li>
          <li><strong>Patokan Cohen = titik awal</strong>, bukan vonis. Kalikan dengan konteks: skala × biaya × reversibilitas.</li>
          <li><strong>Untuk direksi: terjemahkan.</strong> &ldquo;d = 0,8&rdquo; → &ldquo;79% peserta pelatihan mengalahkan median kontrol&rdquo; atau → rupiah.</li>
          <li>Curigai &ldquo;signifikan&rdquo; dari n raksasa — cek d-nya dulu sebelum merayakan.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: A/B Test yang &ldquo;Menang&rdquo; 0,1 Poin</h2>
      <div className="callout">
        <p>Kembali ke cerita pembuka. Data final BelanjaYuk: kontrol 3,00% (60.000/2.000.000), varian B 3,10% (62.000/2.000.000). p &lt; 0,001. Biaya implementasi penuh: Rp4 miliar + 3 bulan migrasi berisiko.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung Cohen&rsquo;s h dan RR untuk kenaikan ini. (b) Dengan 95% CI kenaikan (0,02 pp, 0,18 pp), buat argumen <em>melawan</em> implementasi. (c) Kapan 0,1 pp layak diperjuangkan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <Tex math={String.raw`h = 2\arcsin\sqrt{0{,}031} - 2\arcsin\sqrt{0{,}030} \approx 0{,}006`} /> — praktis nol. RR = 3,10/3,00 ≈ 1,033 (naik 3,3% relatif — terdengar lumayan, tapi dari basis kecil).</p>
          <p>(b) <strong>Argumen melawan:</strong> batas bawah CI (0,02 pp) → tambahan revenue ~Rp3,4 M &lt; biaya Rp4 M. <strong>Nilai harapan keputusan</strong> = (estimasi tengah Rp17 M − Rp4 M) tapi dengan risiko bawah yang negatif — dan itu <em>sebelum</em> menghitung biaya opportunity 3 bulan tim engineering. &ldquo;Signifikan&rdquo; menjawab pertanyaan yang salah; pertanyaan yang benar adalah <strong>apakah nilai harapan bersih &gt; 0 dengan margin aman</strong>.</p>
          <p>(c) <strong>Layak jika:</strong> implementasi murah &amp; reversibel (ganti warna tombol — ship saja!), atau efeknya terakumulasi di banyak eksperimen sejenis (program CRO dengan 50 test × 0,1 pp = 5 pp), atau basis revenue raksasa sehingga 0,02 pp pun &gt; biaya. <strong>Keputusan = effect size × skala − biaya</strong>, bukan p-value.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>d = 0,15 dengan n = 30 per grup. Perkiraan p-value? (Petunjuk: t ≈ d×√(n/2).)</li>
              <li>Odds ratio = 2,5 untuk &ldquo;telat → macet&rdquo;. Interpretasikan dalam bahasa bisnis.</li>
              <li>Mengapa interval kepercayaan untuk effect size <em>lebih informatif</em> dari p-value saja?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> t ≈ 0,15×√15 ≈ 0,58 → p ≈ <strong>0,56</strong> — tidak signifikan. Efek kecil + n kecil = tidak terdeteksi. (Bukan &ldquo;tidak ada efek&rdquo;!)</p>
              <p><strong>2.</strong> &ldquo;Odds macet untuk yang telat 2,5× odds yang lancar.&rdquo; Jika baseline odds 1:9 (10%), maka yang telat ≈ 22%. Bahasa bisnis: &ldquo;nasabah telat berisiko 2,5× lipat&rdquo;.</p>
              <p><strong>3.</strong> IK effect size menunjukkan <em>rentang</em> besar efek yang kompatibel dengan data — mis. d ∈ (0,1; 0,9) = &ldquo;efek positif, tapi bisa kecil bisa besar&rdquo;. p-value hanya memberi &ldquo;ya/tidak&rdquo; pada titik nol.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Studi n=100.000 menemukan efek 'sangat signifikan' (p < 0,001) dengan d = 0,02. Reaksi tepat?"
        options={[
          "Rayakan — p sangat kecil berarti temuan kuat",
          "Skeptis: d = 0,02 praktis nol; signifikansi hanyalah akibat n raksasa — cek pentingnya di konteks",
          "Minta n lebih besar lagi",
          "Ulangi dengan α = 1%",
        ]}
        correct={1}
        explanation="Benar. t = d·√(n/2): n raksasa membuat d mungil pun 'signifikan'. d = 0,02 berarti overlap ~99% — tidak terasa di dunia nyata kecuali dikali skala raksasa dengan biaya nol."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. d = 0,8. Interpretasi dalam bahasa probabilitas?"
        options={[
          "80% data perlakuan di atas rata-rata kontrol",
          "Individu acak dari grup perlakuan mengalahkan ~79% individu kontrol — pergeseran yang jelas terasa",
          "Efeknya 80% signifikan",
          "80% variansi dijelaskan",
        ]}
        correct={1}
        explanation="Benar. Bahasa 'P(X₁ > X₂)' / persentil membuat d hidup: d=0,8 → mean perlakuan setara persentil ke-79 kontrol. Jauh lebih komunikatif daripada '0,8 simpangan baku'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. OR = 2,67 untuk kejadian dengan p₁=40%, p₂=20%. Headline jujur?"
        options={[
          "'Risiko naik 167%!'",
          "'Risiko naik 2× lipat (dari 20% ke 40%)' — pakai RR=2,0; OR melebih-lebihkan saat kejadian umum",
          "'Risiko naik 267%'",
          "Tidak bisa dilaporkan",
        ]}
        correct={1}
        explanation="Benar. OR ≈ RR hanya untuk kejadian langka. Di sini OR=2,67 vs RR=2,0 — headline dari OR melebih-lebihkan 67 poin persentase. Untuk komunikasi, RR lebih jujur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Chi-square signifikan untuk tabel 4×3 (n=2.000). Laporan lengkap butuh apa?"
        options={[
          "Cukup — sudah signifikan",
          "Cramér's V (+ interpretasi) — 'ada hubungan' tanpa 'seberapa kuat' tidak bisa dinilai; dengan n=2.000, V kecil pun signifikan",
          "Uji-t",
          "n lebih besar",
        ]}
        correct={1}
        explanation="Benar. χ² tumbuh dengan n — n=2.000 membuat asosiasi lemah pun signifikan. V menstandarkan ke 0–1 sehingga 'kuat/lemah' bisa dinilai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua obat: A (d=0,9, n=40, p=0,02) vs B (d=0,15, n=20.000, p<0,001). Mana lebih menjanjikan secara klinis?"
        options={[
          "B — p-value jauh lebih kecil",
          "A — effect size 6× lipat; p-value B kecil hanya karena n raksasa. (Dengan catatan: n=40 butuh replikasi!)",
          "Sama saja",
          "Tidak bisa dibandingkan",
        ]}
        correct={1}
        explanation="Benar. d mengukur janji klinis; p mengukur kekuatan bukti. A menjanjikan efek besar dengan bukti awal — langkah tepat: replikasi A dengan n lebih besar, bukan memilih B karena bintangnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Manajer: 'p = 0,04, jadi kita implementasikan?' Data: d = 0,1, CI kenaikan (0,01 pp, 0,19 pp), biaya implementasi tinggi. Jawabanmu?"
        options={[
          "'Ya, signifikan = implementasi'",
          "'Belum tentu — batas bawah CI nyaris nol; hitung nilai harapan bersih vs biaya dulu. Signifikan menjawab ada/tidak, bukan layak/tidak'",
          "'Naikkan α jadi 10% dulu'",
          "'Kumpulkan data lagi sampai p < 0,01'",
        ]}
        correct={1}
        explanation="Benar. Keputusan bisnis = (effect size × skala − biaya), bukan p-value. CI yang menyentuh nol + biaya tinggi = taruhan buruk meski 'signifikan'. Opsi 4 adalah p-hacking."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>p-value</strong> = kekuatan bukti (tumbuh dengan n). <strong>Effect size</strong> = besarnya efek (bebas n). Dua pertanyaan berbeda.</li>
          <li><strong>Cohen&rsquo;s d</strong> <Tex math={String.raw`= (\bar{x}_1-\bar{x}_2)/s_p`} />: 0,2 kecil / 0,5 sedang / 0,8 besar — patokan awal, bukan vonis.</li>
          <li><strong>Bahasa hidup:</strong> d=0,8 → &ldquo;mengalahkan 79% kontrol&rdquo;; overlap 85% (d=0,2) vs 53% (d=0,8).</li>
          <li><strong>RR</strong> untuk komunikasi risiko; <strong>OR</strong> untuk model (waspada saat kejadian umum); <strong>Cramér&rsquo;s V</strong> untuk tabel r×c.</li>
          <li><strong>Penting = effect size × konteks</strong> (skala, biaya, reversibilitas). Aspirin d=0,06 menyelamatkan nyawa.</li>
          <li><strong>Standar laporan:</strong> p-value + effect size + CI. Tanpa ketiganya, klaim tidak bisa dinilai.</li>
          <li><strong>Jangan:</strong> merayakan signifikansi dari n raksasa tanpa cek d; menukar OR dengan RR; memakai patokan Cohen sebagai vonis penting/tidak.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a26-nonparametrik" className="btn btn-secondary btn-sm">← A2.6</Link>
        <Link href="/learn/a28-multiple-testing" className="btn btn-primary btn-sm">Next: A2.8 →</Link>
      </div>
    </div>
  );
}
