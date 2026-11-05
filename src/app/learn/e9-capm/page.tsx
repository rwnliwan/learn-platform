"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E9Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const smlData = [
    {
      x: [0, 0.5, 1.0, 1.5, 2.0],
      y: [5, 8.5, 12, 15.5, 19],
      mode: "lines",
      name: "SML (E[R] = 5% + β×7%)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0.7, 1.3, 1.0],
      y: [11, 13, 9],
      mode: "markers+text",
      text: ["Saham A (α+)", "Saham B (α−)", "Pasar (β=1)"],
      textposition: "top center",
      marker: { size: 12, color: ["#2a7de1", "#ef4444", "#e8a838"] },
      name: "Saham",
    },
  ];

  const betaData = [
    {
      x: ["Saham defensif (β 0,6)", "Pasar (β 1,0)", "Saham agresif (β 1,5)"],
      y: [-6, -10, -15],
      type: "bar",
      name: "Pasar −10%",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Saham defensif (β 0,6)", "Pasar (β 1,0)", "Saham agresif (β 1,5)"],
      y: [6, 10, 15],
      type: "bar",
      name: "Pasar +10%",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Lab 1 — Hitung beta dari data (regresi sederhana)
# Return bulanan (%): pasar (IHSG) vs saham bank
pasar = [2.0, -1.5, 3.0, 1.0, -2.0, 2.5, 0.5, -1.0, 1.5, 2.0, -0.5, 1.0]
saham = [3.2, -2.6, 4.8, 1.5, -3.1, 3.9, 0.8, -1.7, 2.4, 3.1, -0.9, 1.6]

n = len(pasar)
mp = sum(pasar) / n; ms = sum(saham) / n
cov = sum((pasar[i]-mp)*(saham[i]-ms) for i in range(n)) / n
var_pasar = sum((x-mp)**2 for x in pasar) / n
beta = cov / var_pasar

print(f"Covarians    : {cov:.2f}")
print(f"Variansi pasar: {var_pasar:.2f}")
print(f"BETA         : {beta:.2f}")
print()
print("Beta > 1: saham bergerak MELEBIHI pasar (agresif).")
print("Coba: ubah semua 'saham' jadi 0.6x 'pasar'. Beta jadi ~0.6 (defensif).")`;

  const lab2Code = `# Lab 2 — CAPM: berapa return yang PANTAS?
# E[R] = Rf + beta x (Rm - Rf)
Rf = 0.06   # SBN 6%
Rm = 0.12   # ekspektasi pasar 12%
premi = Rm - Rf

print(f"Risk-free: {Rf*100:.0f}%, Premi pasar: {premi*100:.0f}%")
print()
for nama, beta in [("Saham defensif", 0.6), ("Pasar", 1.0), ("Saham agresif", 1.5)]:
    er = Rf + beta * premi
    print(f"{nama:15s} (beta {beta}): E[R] pantas = {er*100:.1f}%")
print()
# Alpha: return aktual vs pantas
aktual = 0.16
beta_saham = 1.5
alpha = aktual - (Rf + beta_saham * premi)
print(f"Saham agresif return aktual 16% -> alpha = {alpha*100:+.1f}%")
print("Alpha + = manajer 'menang' di atas kompensasi risikonya.")
print()
print("Coba: Rf = 0.08. Bagaimana E[R] pantas berubah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E9 — Financial Markets</span>
        <h1 className="display-title">CAPM: Berapa Return<br />yang Pantas?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Saham, Satu Return</a></li>
          <li><a href="#beta">Beta — Ukuran Kegoyangan Relatif</a></li>
          <li><a href="#capm">CAPM — Rumus Harga Risiko</a></li>
          <li><a href="#sml">SML &amp; Alpha — Di Atas atau Di Bawah Garis?</a></li>
          <li><a href="#faktor">Melampaui CAPM — Model Faktor</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Beta dari Data</a></li>
          <li><a href="#lab2">🔬 Lab 2: Return Pantas &amp; Alpha</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Memakai Beta dengan Benar</a></li>
          <li><a href="#case">📋 Mini-Case: Manajer &ldquo;Hebat&rdquo;?</a></li>
          <li><a href="#worked1">🔬 Worked Example: SML — Return yang Pantas</a></li>
          <li><a href="#worked2">🔬 Worked Example: Alpha — Nilai Tambah Manajer?</a></li>
          <li><a href="#konteks">🌍 Konteks: Fama-French — Retakan di Fondasi</a></li>
          <li><a href="#betaintuisi">🔧 Pendalaman: Beta = Seberapa Menempel ke Pasar</a></li>
          <li><a href="#wacc2">🔧 Pendalaman: WACC — CAPM di Ruang Rapat Direksi</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menghitung WACC &amp; Keputusan Investasi</a></li>
          <li><a href="#levered">🔧 Pendalaman: Levered vs Unlevered Beta</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung beta saham dari data return dan menginterpretasikan nilainya.</li>
          <li>Menghitung expected return pantas dengan CAPM, dengan penjelasan tiap simbol.</li>
          <li>Membaca Security Market Line dan menghitung alpha sebagai ukuran &ldquo;kemenangan&rdquo; di atas risiko.</li>
          <li>Menjelaskan keterbatasan CAPM dan ide dasar model multi-faktor (Fama-French).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dua Saham, Satu Return</h2>
      <div className="story">
        <p>Dua saham sama-sama return 15% tahun ini. Saham <strong>TENANG</strong> bergerak pelan mengikuti pasar. Saham <strong>LIAR</strong> naik-turun 3× lipat pasar — investornya sempat minus 30% di tengah tahun. <em>Return sama — apakah keduanya &ldquo;sama bagusnya&rdquo;?</em></p>
        <p>Tidak. Pemegang LIAR menanggung <strong>risiko sistematis</strong> jauh lebih besar — dan seharusnya <em>dituntut</em> return lebih tinggi sebagai kompensasi. Pertanyaan CAPM: <strong>berapa return yang PANTAS untuk tiap tingkat risiko?</strong> Jawabannya menjadi fondasi penilaian kinerja manajer investasi di seluruh dunia.</p>
        <p><strong>Twist-nya:</strong> return 15% yang &ldquo;sama&rdquo; itu ternyata <strong>tidak sama harganya</strong> — pemegang saham LIAR membayar dengan jantung berdebar (sempat −30%), pemegang TENANG membayar dengan ketenangan. CAPM mengajukan pertanyaan yang tidak pernah ditanyakan sebelumnya: <strong>jika risikonya beda, return-nya <em>seharusnya</em> beda berapa?</strong> Jawabannya — satu garis lurus sederhana — menjadi fondasi cara dunia menilai setiap manajer investasi, setiap proyek korporasi, dan setiap akuisisi. Dan seperti semua fondasi: ia kuat, ia retak di beberapa tempat, dan kamu wajib tahu keduanya.</p>
      </div>

      <h2 id="beta">Beta — Ukuran Kegoyangan Relatif</h2>
      <p><strong>Definisi.</strong> <em>Beta</em> mengukur sensitivitas return saham terhadap return <strong>pasar</strong>:</p>
      <Tex math={String.raw`\beta_i = \frac{\text{Cov}(R_i, R_m)}{\text{Var}(R_m)}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`R_i`} /> = return saham; <Tex math={String.raw`R_m`} /> = return pasar (misal IHSG); <Tex math={String.raw`\text{Cov}`} /> = kovarians (seberapa searah bergerak); <Tex math={String.raw`\text{Var}`} /> = variansi pasar. Praktisnya: beta = <strong>kemiringan garis regresi</strong> return saham vs return pasar.</p>
      <p><strong>Cara baca:</strong></p>
      <ul>
        <li><Tex math={String.raw`\beta = 1`} />: bergerak <strong>seperti pasar</strong>.</li>
        <li><Tex math={String.raw`\beta > 1`} />: <strong>agresif</strong> — pasar +10% → saham ≈ +15% (β=1,5). Dan sebaliknya saat pasar jatuh!</li>
        <li><Tex math={String.raw`0 < \beta < 1`} />: <strong>defensif</strong> — goyangannya lebih pelan dari pasar.</li>
        <li><Tex math={String.raw`\beta < 0`} />: bergerak <strong>berlawanan</strong> pasar (langka; misal emas saat krisis).</li>
      </ul>
      <p><strong>Kepribadian beta:</strong> dia <em>pengukur mabuk perjalanan</em> — bukan seberapa jauh mobil melaju (return), tapi seberapa keras kamu terguncang <em>relatif terhadap</em> mobil pasar. Beta hanya menangkap risiko <strong>sistematis</strong> (risiko pasar yang tak terdiversifikasi) — risiko spesifik perusahaan <em>dianggap</em> sudah hilang via diversifikasi (E8).</p>

      <PlotlyChart
        data={betaData}
        title="Beta Beraksi: Pasar ±10%, Saham Ikut Berapa? (ilustratif)"
        layout={{ barmode: "group", yaxis: { title: "Return saham (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua skenario pasar (turun 10% abu-abu, naik 10% biru); tiap kelompok = satu saham dengan beta berbeda.</p>
        <p><strong>Interpretasi:</strong> beta bekerja <strong>dua arah</strong>: saham agresif (β=1,5) untung paling besar saat pasar naik (+15%) TAPI rugi paling dalam saat pasar turun (−15%). <strong>Tidak ada beta yang &ldquo;lebih baik&rdquo;</strong> — beta tinggi = pedang bermata dua. Pilih sesuai keyakinanmu tentang arah pasar <em>dan</em> kekuatan mentalmu.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Beta tinggi = saham bagus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> beta tinggi = <strong>goyangan</strong> tinggi, bukan kualitas. Beta mengukur <em>risiko sistematis</em>, bukan prospek perusahaan. Saham &ldquo;bagus&rdquo; (fundamental kuat) bisa ber-beta rendah — dan justru itu yang dicari investor konservatif.</p>
      </div>

      <h2 id="capm">CAPM — Rumus Harga Risiko</h2>
      <p><strong>Definisi.</strong> <em>Capital Asset Pricing Model</em>: expected return yang <strong>pantas</strong> untuk risiko sistematis sebesar β:</p>
      <Tex math={String.raw`E[R_i] = R_f + \beta_i \times (E[R_m] - R_f)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`R_f`} />: <em>risk-free rate</em> — return tanpa risiko (SBN). &ldquo;Gaji pokok&rdquo; semua investasi.</li>
        <li><Tex math={String.raw`\beta_i`} />: beta saham (dari atas).</li>
        <li><Tex math={String.raw`E[R_m] - R_f`} />: <strong>premi risiko pasar</strong> (<em>market risk premium</em>) — kompensasi per &ldquo;satu beta&rdquo; menanggung risiko pasar.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>SBN 6%, ekspektasi IHSG 12%, beta saham 1,5.</p>
        <p><strong>Langkah 1</strong> — premi pasar = 12% − 6% = 6%.<br />
        <strong>Langkah 2</strong> — E[R] = 6% + 1,5 × 6% = 6% + 9% = <strong>15%</strong>.</p>
        <p>Artinya: dengan goyangan 1,5× pasar, wajar menuntut return 15%. Kalau saham ini return ekspektasinya cuma 10% → <strong>kemahalan</strong> (risiko tidak dibayar cukup).</p>
      </details>
      <p><strong>Kepribadian CAPM:</strong> dia <em>daftar harga risiko</em> — seperti menu restoran: &ldquo;beta 1 harganya 12%, beta 1,5 harganya 15%&rdquo;. Sederhana, elegan, dan — seperti semua model — <strong>salah tapi berguna</strong> (keterbatasannya di bawah).</p>
      <p><strong>Kapan memakai:</strong> menetapkan <em>required return</em> untuk valuasi (r di Gordon, E6!); menilai kinerja manajer (apakah return-nya sepadan beta-nya?).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> CAPM menghubungkan E3, E6, E7, E8: <strong>r</strong> di rumus Gordon (E6) dan <strong>diskonto</strong> di NPV (E3) untuk proyek berisiko <em>seharusnya</em> dihitung via CAPM — bukan asal 10%. Inilah cara profesional menjawab &ldquo;diskonto berapa?&rdquo; dengan argumen, bukan firasat.</p>
      </div>

      <h2 id="sml">SML &amp; Alpha — Di Atas atau Di Bawah Garis?</h2>
      <p><strong>Definisi.</strong> Gambarkan CAPM sebagai garis (<em>Security Market Line</em>): sumbu X = beta, sumbu Y = expected return. Saham yang <strong>tepat di garis</strong> = harganya wajar. Di <strong>atas</strong> garis = <em>undervalued</em> (return ekspektasi melebihi kompensasi risikonya). Selisihnya disebut <strong>alpha</strong>:</p>
      <Tex math={String.raw`\alpha_i = R_{i,\text{aktual}} - \left[R_f + \beta_i(E[R_m]-R_f)\right]`} block />
      <p><strong>Artinya:</strong> alpha = &ldquo;kemenangan murni&rdquo; setelah dikoreksi risiko. <Tex math={String.raw`\alpha > 0`} /> = manajer/saham mengalahkan kompensasi risikonya; <Tex math={String.raw`\alpha < 0`} /> = kalah.</p>

      <PlotlyChart
        data={smlData}
        title="Security Market Line: Siapa Di Atas Garis?"
        layout={{ xaxis: { title: "Beta →" }, yaxis: { title: "Expected return (%) →" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = SML (return pantas untuk tiap beta). Titik-titik = saham aktual.</p>
        <p><strong>Interpretasi:</strong> Saham <strong>A</strong> (β=0,7) return 11% vs pantas 9,9% → <strong>alpha positif</strong> (di atas garis = murah/berkinerja baik). Saham <strong>B</strong> (β=1,3) return 13% vs pantas 14,1% → <strong>alpha negatif</strong> (di bawah garis = mahal/kinerja buruk <em>meski return nominalnya lebih tinggi dari A!</em>). <strong>Pelajaran:</strong> return tanpa koreksi beta = menyanjung yang berisiko.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Manajer dengan return tertinggi = manajer terbaik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> bandingkan <strong>alpha</strong>, bukan return mentah. Manajer return 20% dengan beta 2 (pantas 18%) kalah dari manajer return 14% dengan beta 0,8 (pantas 10,8%): alpha −? vs +3,2%. Industri fund management menilai dengan <em>risk-adjusted return</em> — return mentah untuk brosur marketing.</p>
      </div>

      <h2 id="faktor">Melampaui CAPM — Model Faktor</h2>
      <p><strong>Masalah CAPM:</strong> di dunia nyata, beta <em>saja</em> tidak cukup menjelaskan return. Ditemukan pola (<em>anomali</em>) yang konsisten: saham <strong>kecil</strong> (<em>size</em>) dan <strong>murah</strong> (<em>value</em>, book-to-market tinggi) cenderung memberi return lebih tinggi dari prediksi CAPM.</p>
      <p><strong>Solusi: Fama-French 3-faktor</strong> — tambah dua &ldquo;harga risiko&rdquo;:</p>
      <Tex math={String.raw`E[R_i] = R_f + \beta_m(R_m-R_f) + \beta_s \cdot SMB + \beta_v \cdot HML`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`SMB`} /> (<em>small minus big</em>) = premi saham kecil vs besar; <Tex math={String.raw`HML`} /> (<em>high minus low</em>) = premi saham murah vs mahal. <Tex math={String.raw`\beta_s, \beta_v`} /> = eksposur saham terhadap faktor itu.</p>
      <p><strong>Kepribadian model faktor:</strong> CAPM = &ldquo;satu rasa&rdquo; (risiko pasar). Fama-French = &ldquo;menu 3 rasa&rdquo; — mengakui investor juga dibayar untuk menanggung risiko ukuran &amp; valuasi. Versi 5-faktor tambah profitabilitas &amp; investasi. Intinya sama: <strong>return = kompensasi atas risiko-risiko yang ditanggung</strong>.</p>
      <p><strong>Keterbatasan jujur CAPM:</strong> beta tidak stabil (berubah tiap periode), &ldquo;pasar&rdquo; tak terobservasi sempurna (proksi IHSG ≠ portofolio pasar sejati), dan asumsi investor rasional sering dilanggar (E16: behavioral).</p>

      <h2 id="lab1">🔬 Lab 1: Hitung Beta dari Data</h2>
      <p>Hitung beta saham bank dari 12 bulan data — persis cara analis melakukannya (regresi).</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Beta (Kovarians/Varians)"
        hint="Coba: buat 'saham' = [x*1.8 for x in pasar] (amplify). Beta jadi ~1.8. Lalu tambahkan noise acak ke tiap bulan — beta tetap ~sama tapi R² turun (beta makin tidak bisa diandalkan)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Return Pantas &amp; Alpha</h2>
      <p>Terapkan CAPM: berapa return pantas tiap beta, dan berapa alpha seorang manajer?</p>
      <PyodideLab
        title="Lab 2 — Kalkulator CAPM + Alpha"
        hint="Coba: aktual = 0.10 (manajer 'hanya' 10% dengan beta 1.5). Alpha-nya negatif! Return 10% terdengar lumayan — tapi tidak sepadan risikonya."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> alpha positif yang <strong>konsisten</strong> sangat langka — itulah mengapa mayoritas manajer aktif kalah dari indeks setelah fee (E2!). Kalau seseorang pamer alpha besar, tanya: <em>berapa lama track record-nya? Sudah dikoreksi faktor size &amp; value? Atau cuma beta tersamar?</em> Banyak &ldquo;alpha&rdquo; ternyata cuma <strong>beta yang tidak diakui</strong>.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Memakai Beta dengan Benar</h2>

      <div className="decision-card">
        <h3>1. Yakin pasar akan naik → <strong>Beta &gt; 1 (agresif)</strong></h3>
        <p><strong>Kondisi:</strong> view bullish kuat + mental siap.</p>
        <p><strong>Kenapa:</strong> beta mengamplifikasi — naik 10% pasar → ~15% portofolio.</p>
        <p><strong>Contoh nyata:</strong> tambah saham siklikal/high-beta menjelang pemulihan ekonomi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Takut pasar jatuh tapi harus tetap invest → <strong>Beta &lt; 1 (defensif)</strong></h3>
        <p><strong>Kondisi:</strong> waspada, tapi tidak mau ke kas 100%.</p>
        <p><strong>Kenapa:</strong> goyangan diredam — pasar −10% → portofolio ≈ −6%.</p>
        <p><strong>Contoh nyata:</strong> saham konsumer defensif, utilitas; atau turunkan beta via kas/SBN.</p>
      </div>

      <div className="decision-card">
        <h3>3. Menilai manajer investasi → <strong>Bandingkan alpha, bukan return</strong></h3>
        <p><strong>Kondisi:</strong> memilih reksa dana / fund manager.</p>
        <p><strong>Kenapa:</strong> return tinggi dengan beta 2 = bukan keahlian, melainkan risiko. Alpha = keahlian setelah dikoreksi risiko.</p>
        <p><strong>Contoh nyata:</strong> cek <em>fund fact sheet</em>: alpha &amp; beta vs benchmark, bukan cuma return 1 tahun.</p>
      </div>

      <div className="decision-card">
        <h3>4. Menetapkan required return untuk valuasi → <strong>CAPM, bukan angka asal</strong></h3>
        <p><strong>Kondisi:</strong> menghitung valuasi (Gordon/DCF) atau NPV proyek berisiko.</p>
        <p><strong>Kenapa:</strong> r = Rf + β×premi pasar memberi argumen terstruktur; &ldquo;pakai 12% saja&rdquo; = firasat.</p>
        <p><strong>Contoh nyata:</strong> valuasi saham bank β=1,2: r = 6% + 1,2×6% = 13,2%.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Beta = pengali guncangan pasar.</strong> &gt;1 agresif, &lt;1 defensif — dua arah!</li>
          <li><strong>Return pantas = Rf + β × premi pasar.</strong> Di bawah ini = kemahalan.</li>
          <li><strong>Nilai manajer dari alpha</strong> — return mentah = brosur marketing.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Manajer &ldquo;Hebat&rdquo;?</h2>
      <div className="callout">
        <p>Manajer <strong>X</strong>: return 24% tahun ini, beta portofolionya 1,8. Manajer <strong>Y</strong>: return 15%, beta 0,9. Risk-free 6%, return pasar 14%. X beriklan: <em>&ldquo;Return kami 60% lebih tinggi dari Y!&rdquo;</em></p>
        <p><strong>Pertanyaan:</strong> (a) Hitung return pantas &amp; alpha keduanya. Siapa sebenarnya lebih baik? (b) Jika tahun depan pasar turun 10%, perkirakan return keduanya. (c) Pelajaran apa untuk memilih reksa dana?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Premi pasar = 8%. Pantas X = 6% + 1,8×8% = <strong>20,4%</strong> → alpha X = 24 − 20,4 = <strong>+3,6%</strong>. Pantas Y = 6% + 0,9×8% = <strong>13,2%</strong> → alpha Y = 15 − 13,2 = <strong>+1,8%</strong>. <strong>X tetap menang</strong> (alpha lebih besar) — tapi keunggulannya jauh lebih kecil dari klaim iklan (3,6 vs 1,8 poin, bukan 9 poin).</p>
          <p>(b) Pasar −10%: X ≈ 6% + 1,8×(−16%) = <strong>−22,8%</strong>; Y ≈ 6% + 0,9×(−16%) = <strong>−8,4%</strong>. Inilah harga beta X yang harus dibayar di tahun buruk.</p>
          <p>(c) <strong>Jangan beli return mentah — beli alpha per unit beta yang sanggup kamu tahan.</strong> Cek beta &amp; alpha di fund fact sheet; sesuaikan dengan toleransi drawdown-mu (E7).</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: SML — Menghitung Return yang &ldquo;Pantas&rdquo;</h2>
      <p>Data pasar: risk-free <Tex math={String.raw`R_f`} /> = 6% (SBN), ekspektasi return pasar <Tex math={String.raw`R_m`} /> = 12%. Tiga saham: TENANG (β = 0,5), PASAR (β = 1,0), LIAR (β = 1,5). Berapa return tahunan yang <em>pantas</em> dituntut dari masing-masing?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus SML:</strong> <Tex math={String.raw`E[R_i] = R_f + \beta_i (R_m - R_f)`} />. Premi risiko pasar = 12% − 6% = <strong>6%</strong>.</p>
        <p>TENANG: 6% + 0,5 × 6% = <strong>9%</strong>. PASAR: 6% + 1,0 × 6% = <strong>12%</strong>. LIAR: 6% + 1,5 × 6% = <strong>15%</strong>.</p>
        <p><strong>Baca hasilnya:</strong> setiap 0,5 beta &ldquo;bernilai&rdquo; 3% return ekspektasi. Jika LIAR hanya memberi 12% (bukan 15%), ia <strong>kemahalan</strong> — kamu menanggung risiko 1,5 beta tapi dibayar seperti beta 1,0. Sebaliknya saham β = 1,5 yang return 18% = <strong>murah</strong> (memberi lebih dari yang pantas).</p>
        <p><strong>Intuisi:</strong> SML = &ldquo;daftar harga&rdquo; risiko. Beta mengukur <em>kuantitas</em> risiko sistematis yang kamu beli; <Tex math={String.raw`(R_m - R_f)`} /> = <em>harga per unit</em>-nya. Seperti membeli beras: total = harga/kg × kg. Bedanya, &ldquo;harga&rdquo; di sini ditentukan oleh seluruh pasar, bukan penjual.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Alpha — Apakah Manajer Layak Dibayar Mahal?</h2>
      <p>Manajer dana &ldquo;Cuan Abadi&rdquo; membukukan return <strong>18%</strong> tahun lalu, dengan portofolio β = 1,5. <Tex math={String.raw`R_f`} /> = 6%, <Tex math={String.raw`R_m`} /> = 12%. Apakah ia hebat — atau hanya menunggangi beta tinggi?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Return yang pantas</strong> (dari Worked 1): β = 1,5 &rarr; <strong>15%</strong>.</p>
        <p><strong>Langkah 2 — Alpha:</strong> <Tex math={String.raw`\alpha`} /> = aktual − pantas = 18% − 15% = <strong>+3%</strong>.</p>
        <p><strong>Langkah 3 — Tafsir:</strong> +3% alpha = manajer memberi <strong>nilai tambah 3%</strong> di luar kompensasi risikonya — <em>jika</em> angka ini persisten dan signifikan secara statistik. Satu tahun +3% bisa jadi keberuntungan; lima tahun berturut-turut = skill (atau <em>factor exposure</em> yang belum terukur — lihat Konteks!).</p>
        <p><strong>Jebakan klasik:</strong> manajer dengan return 20% dan β = 2,0: pantas = 6% + 2×6% = 18% &rarr; alpha hanya +2% — <em>lebih kecil</em> dari manajer &ldquo;Cuan Abadi&rdquo; yang return-nya 18%! <strong>Jangan pernah menilai manajer dari return mentah</strong> — normalkan dulu dengan beta. Inilah alasan industri memakai <em>risk-adjusted performance</em> (Sharpe, alpha, information ratio) untuk bonus &amp; pemecatan.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Fama-French — Ketika Satu Faktor Tidak Cukup</h2>
      <p>CAPM (1964) elegan: satu faktor (pasar) menjelaskan return. Tapi data 1990-an berkata lain — <strong>Eugene Fama &amp; Kenneth French</strong> menemukan pola yang CAPM tidak bisa jelaskan:</p>
      <ul>
        <li><strong>Efek ukuran (SMB — <em>small minus big</em>):</strong> saham kapitalisasi kecil <em>cenderung</em> memberi return lebih tinggi dari prediksi CAPM. Penjelasan: risiko likuiditas &amp; kebangkrutan yang tidak tertangkap beta.</li>
        <li><strong>Efek nilai (HML — <em>high minus low</em>):</strong> saham &ldquo;murah&rdquo; (book-to-market tinggi) mengalahkan saham &ldquo;mahal&rdquo; (growth). Penjelasan: <em>value</em> = kompensasi risiko distress — atau bias perilaku (investor terlalu optimis pada growth).</li>
        <li><strong>Implikasi praktis:</strong> alpha +3% manajermu mungkin <strong>bukan skill</strong> — mungkin ia hanya <em>tilt</em> ke saham kecil &amp; murah (faktor SMB/HML). Industri merespons dengan <strong>multi-factor alpha</strong>: ukur alpha <em>setelah</em> mengontrol size, value, momentum, quality, low-vol.</li>
      </ul>
      <p><strong>Status hari ini:</strong> CAPM tetap diajarkan karena ia <strong>intuisi yang benar</strong> (risiko sistematis dihargai; idiosinkratik tidak — jembatan dari E8!) meski <strong>model empirisnya retak</strong>. Fama sendiri meraih Nobel 2013 — bersama Robert Shiller, sang pengkritik efisiensi pasar. Ilmu keuangan = <em>model yang berguna meski salah</em>, dipakai dengan sadar keterbatasannya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> beta portofolio = <strong>rata-rata tertimbang</strong> beta anggotanya. Campur saham β=1,5 (50%) + obligasi β≈0 (50%) &rarr; β portofolio ≈ 0,75. Inilah cara manajer &ldquo;menyetel&rdquo; risiko: bukan dengan menebak saham, tapi dengan <strong>menimbang beta</strong>. Mau portofolio β=1 persis seperti pasar? Itulah <em>index fund</em> — dan alasannya murah (E16!).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Beta tinggi = return tinggi, pasti.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> beta tinggi = return <em>ekspektasi</em> tinggi — <strong>ekspektasi, bukan janji</strong>. Realisasi satu tahun bisa jauh meleset (saham β=1,5 bisa −30% saat pasar −10%). CAPM berbicara tentang <strong>rata-rata jangka panjang</strong>, bukan tahun depan. Menuntut &ldquo;kepastian&rdquo; dari model ekspektasi = salah membaca jenis klaimnya.</p>
      </div>

      <h2 id="betaintuisi">🔧 Pendalaman: Beta = Seberapa Menempel Saham ke Pasar</h2>
      <p>Rumus beta: <Tex math={String.raw`\beta_i = \frac{Cov(R_i, R_m)}{Var(R_m)}`} />. Dibaca sebagai kalimat:</p>
      <ul>
        <li><strong>Pembilang</strong> <Tex math={String.raw`Cov(R_i, R_m)`} />: &ldquo;seberapa sering saham ini bergerak <em>searah</em> dengan pasar?&rdquo; Kovarians tinggi = menempel.</li>
        <li><strong>Penyebut</strong> <Tex math={String.raw`Var(R_m)`} />: &ldquo;dibagi dengan seberapa liar pasar itu sendiri&rdquo; — normalisasi agar β pasar = 1.</li>
        <li><strong>Hasilnya:</strong> β = 1,5 artinya &ldquo;jika pasar bergerak 1%, saham ini <em>cenderung</em> bergerak 1,5% <em>searah</em>&rdquo; — ukuran <em>sensitivitas sistematis</em>, bukan ukuran &ldquo;kebaikan&rdquo;.</li>
      </ul>
      <p><strong>Tiga sifat beta yang jarang diajarkan:</strong> (1) <strong>Beta tidak stabil</strong> — diestimasi dari data historis (regresi 2–5 tahun), bisa berubah saat bisnis berubah (akuisisi, utang baru &rarr; <em>levered beta</em> naik). (2) <strong>Beta buta arah</strong> — β=1,5 jatuh 1,5× lebih dalam juga saat pasar turun. (3) <strong>Beta = 0 bukan berarti tanpa risiko</strong> — obligasi &ldquo;β≈0&rdquo; tetap punya risiko suku bunga &amp; inflasi (E4!). Beta hanya mengukur <em>satu jenis</em> risiko: kepekaan terhadap pasar saham.</p>
      <p><strong>Untuk valuasi (jembatan E6):</strong> <Tex math={String.raw`r`} /> dalam DDM = hasil SML! Analis ekuitas: estimasi beta &rarr; hitung required return via CAPM &rarr; diskontokan dividen/FCF. Satu rantai: <strong>E8 (risiko) → E9 (harga risiko) → E6 (nilai saham)</strong>. Inilah &ldquo;mesin&rdquo; valuasi Wall Street dalam satu kalimat.</p>


      <h2 id="wacc2">🔧 Pendalaman: WACC — Saat CAPM Menentukan Pabrik Dibangun atau Tidak</h2>
      <p>CAPM tidak hanya untuk fund manager — ia masuk <strong>ruang rapat direksi</strong> lewat <strong>WACC</strong> (<em>weighted average cost of capital</em>):</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`WACC = w_e \cdot r_e + w_d \cdot r_d(1-T)`} block /></p>
      <ul>
        <li><Tex math={String.raw`r_e`} /> = <strong>dari CAPM</strong> (SML!): <Tex math={String.raw`R_f + \beta(R_m - R_f)`} /> — &ldquo;harga&rdquo; ekuitas perusahaan.</li>
        <li><Tex math={String.raw`r_d`} /> = yield obligasi perusahaan (SBN + credit spread — E4 + E5!).</li>
        <li><Tex math={String.raw`(1-T)`} /> = <em>tax shield</em> — bunga utang mengurangi pajak, jadi biaya utang efektif lebih murah. Inilah insentif pajak berutang!</li>
        <li><Tex math={String.raw`w_e, w_d`} /> = bobot <strong>nilai pasar</strong> (bukan nilai buku!) ekuitas &amp; utang.</li>
      </ul>
      <p><strong>Fungsinya:</strong> WACC = <strong>hurdle rate</strong> — proyek dengan return &lt; WACC <em>menghancurkan</em> nilai pemegang saham (E3: NPV negatif!). Direksi yang menyetujui proyek 8% saat WACC 12% = membakar uang — <em>walau</em> proyeknya &ldquo;untung secara akuntansi&rdquo;. <strong>Akuntansi ≠ ekonomi.</strong></p>
      <h2 id="worked4">🔬 Worked Example: WACC MajuMundur &amp; Nasib Pabrik Rp10 Miliar</h2>
      <p>Data: ekuitas pasar Rp15 T (Worked 1 E6!), utang pasar Rp5 T. β = 1,2. <Tex math={String.raw`R_f`} /> = 6%, <Tex math={String.raw`R_m`} /> = 12%. Biaya utang <Tex math={String.raw`r_d`} /> = 9%. Pajak T = 22%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — <Tex math={String.raw`r_e`} /> via CAPM:</strong> 6% + 1,2 × (12% − 6%) = 6% + 7,2% = <strong>13,2%</strong>.</p>
        <p><strong>Langkah 2 — Bobot:</strong> total modal = 20 T. <Tex math={String.raw`w_e`} /> = 15/20 = <strong>0,75</strong>. <Tex math={String.raw`w_d`} /> = 5/20 = <strong>0,25</strong>.</p>
        <p><strong>Langkah 3 — WACC:</strong> 0,75 × 13,2% + 0,25 × 9% × (1 − 0,22) = 9,9% + 1,755% = <strong>11,655%</strong> ≈ <strong>11,7%</strong>.</p>
        <p><strong>Langkah 4 — Keputusan:</strong> proyek pabrik Rp10 M (E3 Worked 4!) punya IRR… jika return proyek 12% &gt; WACC 11,7% &rarr; <strong>bangun</strong> (NPV positif). Jika return 10% &rarr; <strong>tolak</strong> — meski &ldquo;untung&rdquo; 10%!</p>
        <p><strong>Intuisi rantai penuh:</strong> <strong>E9 (CAPM)</strong> → harga ekuitas → <strong>WACC</strong> → hurdle rate → <strong>E3 (NPV)</strong> → keputusan investasi → laba masa depan → <strong>E6/E18</strong> (dividen &amp; laporan keuangan) → harga saham → <strong>β baru</strong> → CAPM lagi. <strong>Satu lingkaran tertutup.</strong> Inilah kenapa track ini satu kesatuan — bukan 18 lesson terpisah.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang itu buruk — perusahaan terbaik = tanpa utang.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> utang <strong>murah</strong> (bunga <em>tax-deductible</em>!) dan bisa <strong>menurunkan WACC</strong> — sampai titik di mana risiko kebangkrutan menaikkan <Tex math={String.raw`r_e`} /> &amp; <Tex math={String.raw`r_d`} /> lebih cepat (<em>trade-off theory</em>). Struktur modal optimal = titik terendah kurva WACC berbentuk U. Perusahaan tanpa utang = <strong>membayar pajak lebih &amp; modal lebih mahal</strong> — belum tentu &ldquo;sehat&rdquo;, bisa jadi <em>tidak efisien</em>. (Tentu: ini teori; krisis 1998 menunjukkan utang valas = bom — E12!)</p>
      </div>


      <h2 id="levered">🔧 Pendalaman: Levered Beta — Memisahkan Risiko Bisnis dari Risiko Utang</h2>
      <p>Beta observasi (dari regresi — E9 Pendalaman!) = <strong>levered beta</strong>: mengandung <em>dua</em> risiko — bisnis <em>dan</em> utang. Untuk membandingkan dua perusahaan berutang beda, <strong>lepaskan dulu utangnya</strong>:</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`\beta_{unlevered} = \frac{\beta_{levered}}{1 + (1-T)\frac{D}{E}}`} block /></p>
      <details className="worked">
        <summary>📐 Contoh: dua ritel, siapa lebih berisiko bisnisnya? (klik untuk buka)</summary>
        <p><strong>Ritel A:</strong> β levered 1,4, D/E = 1,0 (utang = ekuitas), T = 22%. β<sub>u</sub> = 1,4 / (1 + 0,78×1,0) = 1,4 / 1,78 ≈ <strong>0,79</strong>.</p>
        <p><strong>Ritel B:</strong> β levered 1,1, D/E = 0,2. β<sub>u</sub> = 1,1 / (1 + 0,78×0,2) = 1,1 / 1,156 ≈ <strong>0,95</strong>.</p>
        <p><strong>Twist:</strong> beta <em>observasi</em> A (1,4) &gt; B (1,1) — tapi risiko <em>bisnis murni</em> B (0,95) &gt; A (0,79)! A terlihat &ldquo;liar&rdquo; <strong>hanya karena utangnya besar</strong> — bisnis dasarnya justru lebih stabil. <strong>Menilai manajemen A dari beta 1,4 = menghukumnya atas keputusan pendanaan, bukan operasi.</strong></p>
        <p><strong>Gunanya:</strong> analis mem-<em>unlever</em> beta pembanding se-industri → rata-ratakan → <em>relever</em> ke struktur modal target perusahaan yang dinilai → CAPM yang <strong>bersih</strong>. Inilah &ldquo;beta bottom-up&rdquo; — standar valuasi investment banking, jauh lebih stabil dari regresi mentah 2 tahun.</p>
      </details>


      <h2 id="quiz">✏️ Quiz — Harga Risiko (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Beta saham = 1,5. Pasar naik 10%. Perkiraan return saham?"
        options={[
          "10%",
          "15% (1,5 × 10%)",
          "6,7%",
          "Tidak berhubungan",
        ]}
        correct={1}
        explanation="Benar: ≈15%. Beta = pengali guncangan pasar. Ingat: berlaku dua arah — pasar −10% → saham ≈ −15%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Rf=6%, E[Rm]=12%, β=1,5. Expected return pantas?"
        options={[
          "12%",
          "18%",
          "15% (6% + 1,5×6%)",
          "9%",
        ]}
        correct={2}
        explanation="Benar: 15%. Premi pasar = 6%; 1,5 beta × 6% = 9% kompensasi risiko + 6% pokok = 15%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Manajer return 24% (β=1,8), manajer lain 15% (β=0,9). Rf=6%, Rm=14%. Mana alpha lebih besar?"
        options={[
          "Yang 24% — jelas",
          "Yang 15% — beta kecil",
          "Yang 24%: alpha +3,6% vs +1,8% — tapi selisihnya jauh lebih kecil dari selisih return mentah",
          "Sama saja",
        ]}
        correct={2}
        explanation="Benar: X menang tapi tipis (+3,6 vs +1,8). Return mentah melebih-lebihkan keunggulan karena tidak mengoreksi beta."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Saham ber-beta negatif (misal −0,3) berguna untuk…"
        options={[
          "Spekulasi",
          "Diversifikasi — cenderung naik saat pasar jatuh (hedge alami)",
          "Tidak ada gunanya",
          "Menjamin untung",
        ]}
        correct={1}
        explanation="Benar: hedge alami. Beta negatif = bergerak berlawanan pasar — peredam portofolio saat krisis (misal emas)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Keterbatasan CAPM yang paling praktis?"
        options={[
          "Rumusnya terlalu sulit",
          "Beta tidak stabil & 'pasar' tak terobservasi sempurna — pakai sebagai kompas, bukan GPS",
          "Tidak ada yang memakai CAPM",
          "CAPM selalu tepat",
        ]}
        correct={1}
        explanation="Benar: beta berubah tiap periode dan proksi pasar (IHSG) ≠ pasar sejati. CAPM = kerangka berpikir hebat, bukan mesin ramal presisi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Beta = Cov(R<sub>i</sub>,R<sub>m</sub>)/Var(R<sub>m</sub>)</strong> — pengali guncangan pasar; &gt;1 agresif, &lt;1 defensif, dua arah.</li>
          <li><strong>CAPM: E[R] = R<sub>f</sub> + β(E[R<sub>m</sub>]−R<sub>f</sub>)</strong> — daftar harga risiko; beta hanya menghargai risiko sistematis.</li>
          <li><strong>Alpha</strong> = return aktual − return pantas — kemenangan murni setelah koreksi risiko.</li>
          <li>Nilai manajer dari <strong>alpha</strong>, bukan return mentah. Waspada &ldquo;alpha&rdquo; yang ternyata beta tersamar.</li>
          <li><strong>Fama-French</strong> menambah faktor size (SMB) &amp; value (HML) — return = kompensasi multi-risiko.</li>
          <li>CAPM = kompas, bukan GPS: beta tak stabil, pasar tak terobservasi sempurna.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e8-markowitz" className="btn btn-secondary btn-sm">← E8</Link>
        <Link href="/learn/e10-derivatif" className="btn btn-primary btn-sm">Next: E10 →</Link>
      </div>
    </div>
  );
}
