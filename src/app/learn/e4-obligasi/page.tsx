"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E4Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const priceYieldData = [
    {
      x: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      y: [138.1, 128.5, 119.7, 111.5, 104.0, 97.1, 90.6, 84.6, 79.0, 73.8, 69.0],
      mode: "lines+markers",
      name: "Harga obligasi (kupon 6%, 10 thn)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const yieldCurveData = [
    {
      x: [1, 2, 3, 5, 7, 10, 15, 20, 30],
      y: [5.8, 6.0, 6.2, 6.5, 6.7, 6.9, 7.0, 7.1, 7.15],
      mode: "lines+markers",
      name: "Normal (naik)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [1, 2, 3, 5, 7, 10, 15, 20, 30],
      y: [7.4, 7.2, 7.0, 6.7, 6.5, 6.3, 6.2, 6.1, 6.0],
      mode: "lines+markers",
      name: "Inverted (turun)",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: [1, 2, 3, 5, 7, 10, 15, 20, 30],
      y: [6.5, 6.5, 6.52, 6.5, 6.51, 6.5, 6.52, 6.5, 6.51],
      mode: "lines+markers",
      name: "Flat (datar)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const durationData = [
    {
      x: ["Obligasi A: 2 thn", "Obligasi B: 5 thn", "Obligasi C: 10 thn", "Obligasi D: 10 thn, kupon 2%"],
      y: [-1.9, -4.6, -8.2, -9.1],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["-1,9%", "-4,6%", "-8,2%", "-9,1%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Harga obligasi vs yield: hubungan terbalik
# Obligasi: nominal Rp100 jt, kupon 6%/thn, tenor 10 thn
nominal = 100_000_000
kupon = 0.06 * nominal
n = 10

def harga(y):
    pv_kupon = kupon * (1 - (1 + y) ** -n) / y
    pv_pokok = nominal / (1 + y) ** n
    return pv_kupon + pv_pokok

print("Yield  Harga (Rp jt)   Keterangan")
for y in [0.04, 0.06, 0.08, 0.10]:
    h = harga(y)
    ket = "premium (mahal)" if h > nominal else ("par" if abs(h-nominal)<1 else "diskon (murah)")
    print(f"{y*100:4.0f}%  {h/1e6:8.1f}      {ket}")
print()
print("Coba: y = 0.12. Lalu y = 0.02. Perhatikan: yield NAIK -> harga TURUN.")`;

  const lab2Code = `# Lab 2 — Duration: seberapa sensitif hargamu?
# Bandingkan 3 obligasi saat yield naik 1% (dari 6% ke 7%)
nominal = 100_000_000
n_list = [2, 5, 10]
kupon_rate = 0.06

def harga(n, kr, y):
    kupon = kr * nominal
    return kupon * (1 - (1 + y) ** -n) / y + nominal / (1 + y) ** n

y0, y1 = 0.06, 0.07
print(f"{'Tenor':6s} {'Harga awal':>12s} {'Harga baru':>12s} {'Perubahan':>10s}")
for n in n_list:
    h0, h1 = harga(n, kupon_rate, y0), harga(n, kupon_rate, y1)
    chg = (h1 - h0) / h0 * 100
    # Modified duration ~ -perubahan% / perubahan yield
    md = -chg / ((y1 - y0) * 100)
    print(f"{n} thn   Rp{h0/1e6:7.1f} jt  Rp{h1/1e6:7.1f} jt  {chg:6.1f}%  (dur~{md:.1f})")
print()
print("Coba: kupon_rate = 0.02 (kupon kecil). Duration makin PANJANG -> makin sensitif!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E4 — Financial Markets</span>
        <h1 className="display-title">Obligasi: Pinjaman yang<br />Bisa Diperdagangkan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kupon 6%, Kok Rugi?</a></li>
          <li><a href="#pricing">Pricing — Harga = PV Arus Kas</a></li>
          <li><a href="#ytm">YTM — Yield yang Sebenarnya Kamu Dapat</a></li>
          <li><a href="#duration">Duration — Speedometer Risiko Bunga</a></li>
          <li><a href="#convexity">Convexity — Koreksi Lengkungan</a></li>
          <li><a href="#curve">Yield Curve — Peta Suku Bunga</a></li>
          <li><a href="#lab1">🔬 Lab 1: Harga vs Yield</a></li>
          <li><a href="#lab2">🔬 Lab 2: Duration dalam Aksi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Obligasi Mana untuk Pandanganmu</a></li>
          <li><a href="#case">📋 Mini-Case: SBN vs Deposito</a></li>
          <li><a href="#worked1">🔬 Worked Example: Membedah Harga ORI Budi</a></li>
          <li><a href="#worked2">🔬 Worked Example: Durasi — Meteran Sensitivitas</a></li>
          <li><a href="#worked3">🔬 Worked Example: Kupon Tinggi vs Yield Tinggi</a></li>
          <li><a href="#konteks">🌍 Konteks: 2022 — Tahun Terburuk Obligasi Sedunia</a></li>
          <li><a href="#konveks">🔧 Pendalaman: Konveksitas &amp; Dua Risiko yang Berlawanan</a></li>
          <li><a href="#kurva">🔧 Pendalaman: Kurva Yield — Peta Ekspektasi Pasar</a></li>
          <li><a href="#worked4">🔬 Worked Example: Strategi Bond Ladder</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung harga obligasi sebagai present value kupon + pokok, dengan penjelasan tiap simbol.</li>
          <li>Menjelaskan hubungan terbalik harga–yield dan menghitung YTM dari harga pasar.</li>
          <li>Menghitung dan menginterpretasikan duration (Macaulay &amp; modified) sebagai ukuran sensitivitas harga.</li>
          <li>Membaca tiga bentuk yield curve dan menjelaskan apa yang disinyalkannya tentang ekonomi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kupon 6%, Kok Rugi?</h2>
      <div className="story">
        <p>Tahun 2022, Budi membeli ORI (Obligasi Negara Ritel) kupon 6% seharga Rp100 juta. <em>&ldquo;Enak, tiap tahun dapat Rp6 juta pasti,&rdquo;</em> pikirnya. Setahun kemudian BI menaikkan suku bunga — obligasi baru terbit dengan kupon 7,5%. Budi butuh uang dan menjual ORI-nya… <strong>laku cuma Rp94 juta</strong>. Padahal kuponnya tetap dibayar 6% penuh!</p>
        <p>Kok bisa rugi padahal &ldquo;dijanjikan&rdquo; 6%? Karena <strong>harga obligasi yang sudah beredar ditentukan pasar, bukan kuponnya</strong>. Saat bunga pasar naik, obligasi lama berkupon kecil jadi kurang menarik — harganya <em>harus turun</em> sampai yield-nya bersaing. Inilah hukum besi obligasi: <strong>harga dan yield bergerak berlawanan arah</strong>.</p>
        <p><strong>Twist-nya:</strong> tidak ada yang ingkar janji — kupon 6% tetap dibayar penuh, tepat waktu. Budi rugi <strong>bukan</strong> karena obligasinya &ldquo;bermasalah&rdquo;, melainkan karena ia membeli sesuatu yang harganya ditentukan <strong>pasar</strong>, lalu pasar berubah pikiran. Inilah paradoks obligasi: instrumen yang dirancang untuk kepastian, diperdagangkan di pasar yang penuh ketidakpastian. <strong>Harga dan yield adalah dua sisi koin yang sama — dan keduanya tidak pernah diam.</strong></p>
      </div>

      <h2 id="pricing">Pricing — Harga = PV Arus Kas</h2>
      <p><strong>Definisi.</strong> Harga wajar obligasi = <strong>present value</strong> seluruh arus kasnya (kupon periodik + pokok saat jatuh tempo), didiskonto dengan yield pasar:</p>
      <Tex math={String.raw`P = \sum_{t=1}^{n}\frac{C}{(1+y)^t} + \frac{F}{(1+y)^n}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`P`} />: harga wajar obligasi hari ini</li>
        <li><Tex math={String.raw`C`} />: kupon per periode (misal 6% × Rp100 jt = Rp6 jt/tahun)</li>
        <li><Tex math={String.raw`F`} />: nilai nominal/pokok (<em>face value</em>) yang kembali saat jatuh tempo</li>
        <li><Tex math={String.raw`y`} />: <strong>yield pasar</strong> per periode — bunga yang diminta pasar saat ini (bukan kupon!)</li>
        <li><Tex math={String.raw`n`} />: jumlah periode sampai jatuh tempo</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Obligasi: nominal Rp100 jt, kupon 6%/tahun, tenor 3 tahun, yield pasar 8%.</p>
        <p><strong>Langkah 1</strong> — PV kupon (anuitas, dari E3): 6 × [1 − 1,08⁻³]/0,08 = 6 × 2,5771 = Rp15,46 jt.<br />
        <strong>Langkah 2</strong> — PV pokok: 100 / 1,08³ = 100 / 1,2597 = Rp79,38 jt.<br />
        <strong>Langkah 3</strong> — jumlahkan: P = 15,46 + 79,38 = <strong>Rp94,84 jt</strong>.</p>
        <p>Harga &lt; nominal (Rp100 jt) → obligasi dijual <strong>diskon</strong>, karena kupon 6% &lt; yield pasar 8%. Kalau yield pasar 4%, harganya jadi Rp105,55 jt (<strong>premium</strong>).</p>
      </details>
      <p><strong>Kepribadian rumus ini:</strong> ia tidak peduli sentimen — hanya tiga input: <em>berapa kasnya, kapan datangnya, berapa diskontonya</em>. Kuasai rumus ini dan kamu menguasai separuh pasar fixed income dunia.</p>
      <p><strong>Kapan memakai:</strong> menilai wajar/tidaknya harga SBN/obligasi korporasi di pasar sekunder; memahami kenapa portofolio obligasimu naik-turun.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>kupon itu masa lalu, yield itu masa kini.</strong> Kupon ditetapkan saat obligasi lahir dan tak pernah berubah. Yang berubah tiap hari adalah <em>yield yang diminta pasar</em> — dan harga menyesuaikan agar keduanya konsisten. Budi rugi bukan karena kuponnya turun, tapi karena yield pasar naik.</p>
      </div>

      <h2 id="ytm">YTM — Yield yang Sebenarnya Kamu Dapat</h2>
      <p><strong>Definisi.</strong> <em>Yield to maturity</em> (YTM) = tingkat diskonto <Tex math={String.raw`y`} /> yang membuat harga pasar = PV arus kas. Dengan kata lain: <strong>balikkan rumus pricing</strong> — diketahui P, cari y. Tidak ada rumus tertutup; dicari dengan iterasi (coba-coba cerdas, seperti fungsi IRR di Lab E3).</p>
      <p><strong>Artinya:</strong> YTM = return tahunan yang <em>benar-benar</em> kamu kantongi jika (1) memegang sampai jatuh tempo, (2) tidak default, dan (3) kupon diinvestasikan lagi pada tingkat YTM.</p>
      <p><strong>Contoh:</strong> obligasi di atas (kupon 6%, 3 thn) diperdagangkan Rp94,84 jt → YTM-nya <strong>8%</strong> — persis yield pasar yang dipakai menghitungnya. Inilah lingkaran yang konsisten: harga ↔ yield adalah dua sisi koin yang sama.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kupon 6% berarti return-ku 6%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> return-mu = <strong>YTM</strong>, bukan kupon. Beli di harga diskon (Rp94,84 jt) → return 8% &gt; kupon 6% (dapat bonus apresiasi harga). Beli di harga premium → return &lt; kupon. Kupon hanya satu komponen; harga belimu menentukan sisanya.</p>
      </div>

      <PlotlyChart
        data={priceYieldData}
        title="Hukum Besi: Yield Naik → Harga Turun (kupon 6%, 10 thn)"
        layout={{ xaxis: { title: "Yield pasar (%)" }, yaxis: { title: "Harga (Rp jt)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = yield yang diminta pasar, sumbu Y = harga wajar obligasi. Satu kurva untuk obligasi yang sama.</p>
        <p><strong>Interpretasi:</strong> kurva <strong>menurun dan melengkung</strong> (konveks). Saat yield naik dari 6% ke 7%, harga jatuh Rp6,9 jt; tapi saat yield turun dari 6% ke 5%, harga naik Rp7,5 jt — <strong>tidak simetris!</strong> Kenaikan harga saat yield turun <em>lebih besar</em> dari penurunan harga saat yield naik. Asimetri menguntungkan ini disebut <strong>convexity</strong> — dan investor menyukainya.</p>
      </div>

      <h2 id="duration">Duration — Speedometer Risiko Bunga</h2>
      <p><strong>Definisi.</strong> <em>Duration</em> mengukur <strong>seberapa sensitif</strong> harga obligasi terhadap perubahan yield. Ada dua versi:</p>
      <Tex math={String.raw`D_{\text{mac}} = \frac{\sum_{t=1}^{n} t \times \frac{CF_t}{(1+y)^t}}{P}`} block />
      <Tex math={String.raw`D_{\text{mod}} = \frac{D_{\text{mac}}}{1+y} \quad \Rightarrow \quad \frac{\Delta P}{P} \approx -D_{\text{mod}} \times \Delta y`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`D_{\text{mac}}`} /> (<em>Macaulay</em>): rata-rata <strong>tertimbang waktu</strong> penerimaan kas — &ldquo;rata-rata kapan uangmu kembali&rdquo; (dalam tahun)</li>
        <li><Tex math={String.raw`CF_t`} />: arus kas tahun ke-<Tex math={String.raw`t`} />; bobotnya = PV arus kas itu dibagi harga</li>
        <li><Tex math={String.raw`D_{\text{mod}}`} /> (<em>modified</em>): versi praktis — <strong>persen perubahan harga per 1% perubahan yield</strong></li>
        <li><Tex math={String.raw`\Delta y`} />: perubahan yield (0,01 = 1%)</li>
      </ul>
      <p><strong>Contoh:</strong> obligasi <Tex math={String.raw`D_{\text{mod}}`} /> = 8 → yield naik 1% ⇒ harga turun ≈ <strong>8%</strong>. Itulah &ldquo;speedometer&rdquo;-nya.</p>
      <p><strong>Tiga aturan duration</strong> (hafalkan!):</p>
      <ol>
        <li><strong>Makin panjang tenor → makin besar duration</strong> (makin sensitif).</li>
        <li><strong>Makin kecil kupon → makin besar duration</strong> (kas menumpuk di akhir = &ldquo;rata-rata kembalinya&rdquo; lama).</li>
        <li><strong>Makin tinggi yield → makin kecil duration</strong> (diskonto berat di kas jauh).</li>
      </ol>
      <p><strong>Kapan memakai:</strong> membandingkan risiko bunga antar obligasi; membangun portofolio sesuai pandangan suku bunga (yakin bunga turun → pilih duration panjang).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Duration = tenor. Obligasi 10 tahun berarti duration 10.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> duration &lt; tenor untuk obligasi berkupon (karena kupon datang lebih awal). Hanya <strong>zero-coupon bond</strong> yang duration-nya = tenor. Obligasi 10 tahun kupon 6% @yield 6% → Macaulay ≈ 7,9 tahun, bukan 10.</p>
      </div>

      <h2 id="convexity">Convexity — Koreksi Lengkungan</h2>
      <p><strong>Definisi.</strong> Duration mengasumsikan hubungan harga–yield <strong>lurus</strong> (linear). Padahal kurvanya <strong>melengkung</strong> (lihat grafik di atas). <em>Convexity</em> mengoreksi kelengkungan itu:</p>
      <Tex math={String.raw`\frac{\Delta P}{P} \approx -D_{\text{mod}} \times \Delta y + \frac{1}{2} \times \text{Convexity} \times (\Delta y)^2`} block />
      <p><strong>Artinya:</strong> suku kedua (selalu positif karena <Tex math={String.raw`(\Delta y)^2`} />) membuat estimasi lebih akurat untuk perubahan yield <strong>besar</strong>, dan menunjukkan asimetri menguntungkan: rugi lebih kecil saat yield naik, untung lebih besar saat yield turun.</p>
      <p><strong>Kapan penting:</strong> perubahan yield besar (&gt;1%), atau membandingkan dua obligasi ber-duration sama — pilih yang <strong>convexity lebih tinggi</strong> (asimetri lebih menguntungkan).</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> duration = kecepatan, convexity = kelengkungan jalan. Untuk belokan kecil (yield ±0,5%), kecepatan cukup. Untuk tikungan tajam (krisis, yield ±3%), kamu butuh tahu kelengkungannya — kalau tidak, estimasimu meleset jauh.</p>
      </div>

      <h2 id="curve">Yield Curve — Peta Suku Bunga</h2>
      <p><strong>Definisi.</strong> <em>Yield curve</em> = grafik yield vs tenor untuk obligasi <strong>sejenis</strong> (biasanya SBN). Tiga bentuk utama:</p>
      <ul>
        <li><strong>Normal</strong> (naik): tenor panjang → yield lebih tinggi. Kondisi sehat: investor minta kompensasi mengunci uang lama.</li>
        <li><strong>Inverted</strong> (turun): tenor pendek → yield lebih tinggi. <strong>Sinyal bahaya klasik</strong>: pasar bertaruh suku bunga akan <em>turun</em> (biasanya karena resesi datang, bank sentral akan memangkas bunga).</li>
        <li><strong>Flat</strong> (datar): transisi / ketidakpastian.</li>
      </ul>
      <p><strong>Kapan dipakai:</strong> membaca ekspektasi pasar atas ekonomi &amp; kebijakan suku bunga; memilih tenor obligasi (detail + sinyal resesi di E17).</p>

      <PlotlyChart
        data={yieldCurveData}
        title="Tiga Wajah Yield Curve"
        layout={{ xaxis: { title: "Tenor (tahun)" }, yaxis: { title: "Yield (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = tenor obligasi, sumbu Y = yield. Tiga kurva = tiga kondisi pasar.</p>
        <p><strong>Interpretasi:</strong> kurva <strong>normal</strong> (biru): makin lama tenor makin tinggi yield — dunia &ldquo;sehat&rdquo;. Kurva <strong>inverted</strong> (merah): anomali — pasar berani menerima yield <em>lebih rendah</em> untuk 30 tahun daripada 1 tahun, artinya pasar yakin bunga masa depan akan turun drastis (prediktor resesi yang historisnya akurat di AS). Kurva <strong>flat</strong> (abu): pasar bingung — masa transisi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Harga vs Yield</h2>
      <p>Buktikan hukum besi obligasi dengan tanganmu sendiri: naikkan yield, lihat harga jatuh.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Harga Obligasi"
        hint="Coba: y = 0.15 (krisis!). Lalu y = 0.01 (bunga super rendah). Kapan harga di atas nominal Rp100 jt? (Jawab: saat yield < kupon.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Duration dalam Aksi</h2>
      <p>Simulasikan guncangan yield +1% pada tiga obligasi. Mana yang paling babak belur?</p>
      <PyodideLab
        title="Lab 2 — Guncangan Yield +1%: Siapa Paling Terluka?"
        hint="Coba: kupon_rate = 0.02 lalu 0.12. Perhatikan: kupon kecil = duration panjang = luka lebih dalam. Inilah mengapa obligasi kupon kecil 'terasa seperti saham'."
        defaultCode={lab2Code}
      />

      <PlotlyChart
        data={durationData}
        title="Kenaikan Yield 1% → Harga Jatuh Berapa? (kupon 6%, yield awal 6%)"
        layout={{ yaxis: { title: "Perubahan harga (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu obligasi; panjang batang ke bawah = persen kerugian saat yield naik 1%.</p>
        <p><strong>Interpretasi:</strong> pola jelas: <strong>tenor panjang + kupon kecil = luka dalam</strong>. Obligasi D (10 thn, kupon 2%) rugi 9,1% — hampir 5× lipat obligasi A (2 thn). Inilah duration yang divisualkan: memilih obligasi = memilih <em>berapa banyak risiko bunga</em> yang kamu peluk.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Obligasi Mana untuk Pandanganmu</h2>

      <div className="decision-card">
        <h3>1. Yakin suku bunga akan TURUN → <strong>Duration panjang</strong></h3>
        <p><strong>Kondisi:</strong> ekspektasi BI memangkas suku bunga.</p>
        <p><strong>Kenapa:</strong> yield turun → harga naik, dan duration panjang melipatgandakan kenaikan (lihat Lab 2, arah sebaliknya).</p>
        <p><strong>Contoh nyata:</strong> beli SBN tenor 10–15 tahun sebelum siklus pemangkasan bunga.</p>
      </div>

      <div className="decision-card">
        <h3>2. Takut suku bunga NAIK → <strong>Duration pendek / mengambang</strong></h3>
        <p><strong>Kondisi:</strong> inflasi panas, BI berpotensi menaikkan bunga.</p>
        <p><strong>Kenapa:</strong> duration pendek = harga hampir tidak bergerak saat yield naik; kupon bisa di-reinvestasi di bunga baru yang lebih tinggi.</p>
        <p><strong>Contoh nyata:</strong> SBN tenor 2–3 tahun atau reksa dana pasar uang saat siklus kenaikan bunga.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh kepastian arus kas, pegang sampai jatuh tempo → <strong>Abaikan harga pasar</strong></h3>
        <p><strong>Kondisi:</strong> tujuan dana jelas di tanggal tertentu; tidak akan jual di tengah jalan.</p>
        <p><strong>Kenapa:</strong> jika dipegang sampai maturitas (dan tidak default), kamu terima kupon + pokok penuh <strong>apapun</strong> gejolak harga di tengah jalan. Duration hanya relevan jika mungkin jual sebelum jatuh tempo.</p>
        <p><strong>Contoh nyata:</strong> ORI untuk dana kuliah anak 3 tahun lagi — beli dan lupakan.</p>
      </div>

      <div className="decision-card">
        <h3>4. Dua obligasi duration sama → <strong>Pilih convexity lebih tinggi</strong></h3>
        <p><strong>Kondisi:</strong> ekspektasi pergerakan yield <em>besar</em> (krisis/kejutan kebijakan).</p>
        <p><strong>Kenapa:</strong> convexity memberi asimetri gratis: untung lebih saat yield turun, rugi lebih kecil saat yield naik.</p>
        <p><strong>Contoh nyata:</strong> manajer dana memilih obligasi <em>bullet</em> vs <em>barbell</em> dengan duration setara.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Yield naik → harga turun.</strong> Selalu. Tanpa kecuali.</li>
          <li><strong>Duration = persen rugi per 1% kenaikan yield.</strong> Tanya angka ini sebelum beli obligasi apapun.</li>
          <li><strong>Akan pegang sampai jatuh tempo?</strong> → fokus ke YTM &amp; risiko default, abaikan gejolak harga.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: SBN vs Deposito</h2>
      <div className="callout">
        <p>Sari punya Rp100 juta untuk 3 tahun. Opsi A: deposito 5%/tahun (bunga diambil tiap tahun, pokok utuh). Opsi B: SBN 3 tahun kupon 6,2%, harga pasar Rp101,5 jt (premium!), YTM 5,6%.</p>
        <p><strong>Pertanyaan:</strong> (a) Mana return lebih tinggi jika dipegang sampai jatuh tempo? (b) Jika setahun kemudian Sari butuh uang mendadak dan yield pasar naik ke 8%, opsi mana yang lebih &ldquo;menyakiti&rdquo;? (c) Kapan deposito justru pilihan lebih baik?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>SBN (YTM 5,6% &gt; 5%).</strong> Jangan tertipu kupon 6,2% — karena beli di harga premium Rp101,5 jt, return sebenarnya 5,6%. Tetap menang dari deposito 5%.</p>
          <p>(b) <strong>SBN.</strong> Deposito bisa dicairkan (denda pinalti kecil, pokok kembali). SBN harus dijual di harga pasar yang jatuh karena yield naik — dengan duration ±2,8, kerugian ≈ 2,8% × 2,4% ≈ <strong>6,7%</strong> dari harga. Inilah harga likuiditas &amp; risiko bunga.</p>
          <p>(c) Jika <strong>mungkin butuh uang sebelum 3 tahun</strong> (risiko likuiditas pribadi tinggi) atau <strong>yakin bunga akan naik tajam</strong> — deposito (pokok dijamin LPS s.d. batas, bisa break) lebih fleksibel.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Membedah Harga ORI Budi (Rp94 Juta)</h2>
      <p>Rekonstruksi dengan angka bersih. Obligasi 5 tahun, nominal Rp100 juta, kupon <strong>6%/tahun</strong> (Rp6 juta/tahun), dibeli @ par (Rp100 juta). Setahun berlalu (sisa tenor 4 tahun), BI menaikkan bunga — obligasi baru sejenis kini memberi <strong>yield 7,5%</strong>. Budi butuh uang dan menjual. Berapa harga wajarnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Prinsip:</strong> harga = PV seluruh arus kas masa depan, didiskonto pada <em>yield pasar saat ini</em> (7,5%) — <strong>bukan</strong> pada kupon 6%.</p>
        <p><strong>Langkah 2 — Arus kas tersisa:</strong> Rp6 jt (thn 1), Rp6 jt (thn 2), Rp6 jt (thn 3), Rp106 jt (thn 4, kupon + pokok).</p>
        <p><strong>Langkah 3 — Diskonto satu per satu</strong> <Tex math={String.raw`PV = \sum \frac{CF_t}{(1{,}075)^t}`} />:</p>
        <p>Thn 1: 6 &divide; 1,075 = 5,581 &rarr; Thn 2: 6 &divide; 1,075<sup>2</sup> = 5,192 &rarr; Thn 3: 6 &divide; 1,075<sup>3</sup> = 4,830 &rarr; Thn 4: 106 &divide; 1,075<sup>4</sup> = 79,368 (semua dalam juta rupiah).</p>
        <p><strong>Langkah 4 — Jumlahkan:</strong> 5,581 + 5,192 + 4,830 + 79,368 = <strong>Rp94,97 juta</strong> ≈ Rp95 juta. (Cerita memakai Rp94 juta — beda kecil karena pembulatan &amp; sisa tenor persisnya.)</p>
        <p><strong>Verifikasi hukum besi:</strong> yield naik 6% &rarr; 7,5% &rArr; harga turun 100 &rarr; 95. <strong>Berlawanan arah — selalu.</strong> Dan perhatikan: kupon Rp6 juta/tahun <em>tidak berubah</em> — yang berubah hanya <em>berapa pasar rela membayar</em> untuk janji Rp6 juta itu.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Durasi — Satu Angka untuk Menebak Sensitivitas</h2>
      <p>Daripada menghitung ulang PV setiap kali yield bergerak, praktisi memakai <strong>durasi</strong> (<em>modified duration</em>): perkiraan % perubahan harga untuk tiap 1% perubahan yield.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Data:</strong> obligasi di atas (kupon 6%, sisa 4 tahun, yield 7,5%, harga Rp94,97 jt). Durasi modifikasian ≈ <strong>3,4 tahun</strong> (dihitung dari rata-rata tertimbang waktu arus kas — detail rumusnya ada di Lab; intinya: makin panjang tenor &amp; makin kecil kupon, makin besar durasi).</p>
        <p><strong>Aturan praktis:</strong> <Tex math={String.raw`\Delta P \approx -D_{mod} \times \Delta y \times P`} />.</p>
        <p><strong>Terapkan:</strong> yield naik 1% (7,5% &rarr; 8,5%): &Delta;P &asymp; −3,4 &times; 0,01 &times; 94,97 = <strong>−Rp3,23 juta</strong> &rarr; harga baru ≈ <strong>Rp91,7 juta</strong>.</p>
        <p><strong>Intuisi:</strong> durasi = &ldquo;panjang tuas&rdquo;. Obligasi 30 tahun punya durasi ~15–20 &rarr; yield naik 1% menghapus <strong>15–20%</strong> harganya! Inilah kenapa obligasi tenor panjang disebut &ldquo;aman dari gagal bayar tapi <em>kejam</em> terhadap perubahan bunga&rdquo; — profil risiko yang sama sekali berbeda dari deposito.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Kupon 9% vs Kupon 5% — Mana yang &ldquo;Lebih Untung&rdquo;?</h2>
      <p>Dua obligasi 5 tahun, nominal Rp100 juta, <strong>harga pasar sama-sama Rp100 juta</strong>. Obligasi X kupon 9%, obligasi Y kupon 5%. &ldquo;X dong, kuponnya hampir 2× lipat!&rdquo; — benarkah?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Yield X:</strong> harga = par (100) &rarr; yield = kupon = <strong>9%</strong>.</p>
        <p><strong>Langkah 2 — Yield Y:</strong> harga = par (100) &rarr; yield = kupon = <strong>5%</strong>.</p>
        <p><strong>Langkah 3 — Bandingkan apel dengan apel:</strong> keduanya di harga par, jadi yield = kupon masing-masing. X memberi 9%, Y memberi 5% — <strong>X memang lebih untung 4% per tahun</strong>. Tidak ada yang gratis di pasar: selisih 4% itu pasti mencerminkan sesuatu — misal X diterbitkan perusahaan berisiko (lihat E5: credit spread!), atau X punya fitur yang merugikan (dapat ditarik kembali/<em>callable</em> oleh penerbit saat bunga turun).</p>
        <p><strong>Intuisi:</strong> <strong>kupon = label, yield = isi.</strong> Jangan pernah membandingkan kupon antar obligasi yang harganya berbeda — bandingkan <em>yield-to-maturity</em> (dan risikonya). Kupon 9% pada harga Rp130 juta bisa jadi yield-nya <em>lebih kecil</em> dari kupon 5% pada harga Rp95 juta.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2022 — Tahun Terburuk Obligasi dalam Sejarah Modern</h2>
      <p>Selama puluhan tahun, manajer investasi menjual mantra &ldquo;60/40&rdquo;: 60% saham + 40% obligasi — obligasi sebagai <em>peredam</em> saat saham jatuh. <strong>Tahun 2022 menghancurkan mantra itu.</strong></p>
      <ul>
        <li>Inflasi global meledak pasca-COVID; The Fed menaikkan bunga dari ~0% ke ~4,5% dalam setahun — tercepat dalam 40 tahun.</li>
        <li>Obligasi pemerintah AS tenor panjang (<em>long bond</em>) <strong>rugi ~30%</strong>; indeks obligasi agregat AS rugi <strong>~13%</strong> — penurunan tahunan terburuk yang pernah tercatat.</li>
        <li>Saham juga jatuh (~−19%). Kedua kaki &ldquo;60/40&rdquo; patah bersamaan — karena <em>penyebabnya sama</em>: kenaikan yield (lihat Worked 1 &amp; 2!).</li>
        <li><strong>Indonesia tidak imun:</strong> <em>taper tantrum</em> 2013 adalah versi lokalnya — isu pengurangan stimulus AS membuat yield SBN 10 tahun melonjak &gt;200 bps dalam bulan, rupiah tertekan, IHSG koreksi. Obligasi &ldquo;aman&rdquo; tetap membawa <em>risiko suku bunga</em>.</li>
      </ul>
      <p><strong>Pelajaran:</strong> &ldquo;aset aman&rdquo; (<em>safe asset</em>) artinya <strong>risiko gagal bayar kecil</strong> — bukan &ldquo;harganya tidak bisa turun&rdquo;. Obligasi pemerintah AS tidak akan gagal bayar (dalam dolar), tapi harganya bisa rugi 30% seperti 2022. Bedakan <strong>risiko kredit</strong> (E5) dari <strong>risiko suku bunga</strong> (lesson ini) — dua hewan berbeda yang sering dikira sama.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat membeli obligasi di pasar sekunder, kamu juga membayar <strong>bunga berjalan</strong> (<em>accrued interest</em>) ke penjual — kompensasi atas kupon yang &ldquo;sudah berjalan&rdquo; sejak pembayaran terakhir. Harga kuotasi (<em>clean price</em>) + accrued = <em>dirty price</em> (yang benar-benar kamu bayar). Jangan kaget saat total debet lebih besar dari harga di layar!</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi pemerintah pasti untung kalau dipegang sampai jatuh tempo.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>nominal</em>-nya pasti kembali (pokok + kupon sesuai janji) — tapi <strong>daya belinya</strong> belum tentu. Kupon 6% saat inflasi 8% = return riil <strong>−2%</strong>: uangmu kembali utuh dalam angka, menyusut dalam nilai. &ldquo;Pasti&rdquo; hanya berlaku untuk angka nominal, bukan untuk kemakmuran.</p>
      </div>

      <h2 id="konveks">🔧 Pendalaman: Konveksitas — dan Dua Risiko yang Saling Berlawanan</h2>
      <p>Hubungan harga–yield tidak garis lurus — ia <strong>melengkung</strong> (<em>konveks</em>): saat yield turun, harga naik <em>lebih cepat</em> daripada penurunannya saat yield naik. Kelengkungan ini menguntungkan pemegang obligasi (asimetri positif) — dan menjelaskan kenapa durasi (aproksimasi garis lurus) hanya akurat untuk perubahan yield kecil.</p>
      <p>Lebih penting untuk karirmu: pemegang obligasi menghadapi <strong>dua risiko yang tarik-menarik</strong>:</p>
      <ul>
        <li><strong>Risiko harga</strong> (<em>price risk</em>): yield naik &rarr; harga obligasimu turun (Budi!). Dominan jika horizonmu <strong>pendek</strong> / mungkin jual sebelum jatuh tempo.</li>
        <li><strong>Risiko reinvestasi</strong> (<em>reinvestment risk</em>): yield turun &rarr; kupon yang kamu terima harus diinvestasikan ulang pada bunga <em>lebih rendah</em>. Dominan jika horizonmu <strong>panjang</strong> (dana pensiun!).</li>
      </ul>
      <p>Keduanya tidak bisa dihindari bersamaan — menurunkan satu menaikkan yang lain. Strategi klasik mengelolanya: <strong>immunisasi</strong> — menyamakan durasi aset obligasi dengan durasi kewajiban (misal pembayaran pensiun), sehingga kedua risiko <em>saling meniadakan</em>. Inilah pekerjaan harian manajer dana pensiun &amp; asuransi jiwa — dan alasan mereka adalah pembeli obligasi terbesar di dunia.</p>


      <h2 id="kurva">🔧 Pendalaman: Kurva Yield — Satu Gambar, Seribu Ekspektasi</h2>
      <p>Plot yield SBN Indonesia per Oktober 2026 (ilustratif): 1 thn <strong>5,8%</strong>, 5 thn <strong>6,4%</strong>, 10 thn <strong>6,9%</strong>, 20 thn <strong>7,2%</strong>, 30 thn <strong>7,3%</strong>. Kurva <strong>menanjak lalu mendatar</strong> (<em>normal, flattening</em>). Apa yang dibacakan pasar dari bentuk ini?</p>
      <ul>
        <li><strong>Kemiringan (slope):</strong> 10Y − 2Y positif &amp; lebar = pasar yakin ekonomi tumbuh + inflasi terkendali. <strong>Mendatar</strong> = pasar ragu pertumbuhan jangka panjang. <strong>Inversi</strong> (E17!) = pasar bertaruh resesi.</li>
        <li><strong>Level:</strong> seluruh kurva naik = ekspektasi inflasi/suku bunga naik (2022!). Seluruh kurva turun = pelonggaran moneter di depan mata.</li>
        <li><strong>Teori di baliknya:</strong> <em>ekspektasi murni</em> — yield 10 thn ≈ rata-rata ekspektasi bunga 1 tahun selama 10 tahun ke depan + <em>premi jangka</em> (<em>term premium</em>: kompensasi mengunci uang lama). Kurva = <strong>agregat taruhan pasar tentang masa depan moneter</strong>.</li>
      </ul>
      <p><strong>Cara trader memakai kurva:</strong> (1) <em>riding the curve</em> — beli obligasi 5 thn, jual setahun kemudian saat jadi 4 thn (yield lebih rendah &rarr; harga naik!) — <em>roll-down return</em>; (2) <em>curve steepener/flattener</em> — bertaruh pada <em>perubahan bentuk</em>, bukan level (pakai kombinasi beli 2Y + jual 10Y); (3) <strong>kalibrasi</strong> — kurva SBN = <em>risk-free</em> domestik untuk SEMUA valuasi rupiah (E3 WACC!).</p>
      <h2 id="worked4">🔬 Worked Example: Bond Ladder — Tangga Anti-Khawatir Bunga</h2>
      <p>Bu Rina punya <strong>Rp500 juta</strong>, butuh Rp100 juta/tahun selama 5 tahun (biaya kuliah anak). Takut bunga naik (harga obligasi jatuh — E4!). Solusi: <strong>bond ladder</strong> — beli 5 obligasi @ Rp100 juta, jatuh tempo <strong>1, 2, 3, 4, 5 tahun</strong>.</p>
      <details className="worked">
        <summary>📐 Simulasi langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Tahun 1:</strong> obligasi #1 jatuh tempo &rarr; terima Rp100 juta + kupon &rarr; bayar kuliah. <strong>Tidak peduli</strong> harga pasar obligasi lain — yang jatuh tempo dibayar <em>par</em>!</p>
        <p><strong>Tahun 2:</strong> #2 jatuh tempo &rarr; Rp100 juta &rarr; kuliah. Dan seterusnya.</p>
        <p><strong>Kenapa ini menyelesaikan dilema E4?</strong> Risiko harga (Budi!) hanya masalah jika <strong>jual sebelum jatuh tempo</strong>. Ladder menyamakan <em>jatuh tempo aset</em> dengan <em>jatuh tempo kebutuhan</em> — <strong>immunisasi sederhana</strong> (E4 Pendalaman!). Bunga naik? Tidak masalah — tiap tahun ada yang jatuh tempo di par, dan dana yang belum dibutuhkan bisa diinvestasikan ulang di yield <em>lebih tinggi</em> (risiko reinvestasi justru <em>menguntungkanmu</em> di sini!).</p>
        <p><strong>Intuisi:</strong> ladder = <strong>mengubah risiko harga menjadi kepastian arus kas</strong>. Harga pasar obligasi #5 boleh jungkir-balik — kamu tidak akan menjualnya; ia akan jatuh tempo tepat saat dibutuhkan. Inilah cara dana pensiun &amp; asuransi berpikir: <em>liability-driven investing</em> — bukan &ldquo;beli obligasi murah&rdquo;, tapi &ldquo;cocokkan aset dengan kewajiban&rdquo;.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga &ldquo;yield&rdquo; jangan tertukar: <strong>coupon yield</strong> (kupon ÷ nominal — label), <strong>current yield</strong> (kupon ÷ harga pasar — snapshot), <strong>yield to maturity</strong> (IRR seluruh arus kas — yang dipakai membandingkan). Membandingkan obligasi via coupon yield = membandingkan buku dari sampulnya. <strong>YTM = satu-satunya yang comparable</strong> — dan itulah yang dikuotasikan profesional.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Hukum Besi Obligasi (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. BI menaikkan suku bunga. Apa yang terjadi pada harga ORI yang sudah beredar?"
        options={[
          "Naik, karena kuponnya ikut naik",
          "Turun — yield pasar naik membuat kupon lama kurang menarik",
          "Tetap, karena kupon tidak berubah",
          "Naik, karena pemerintah menjamin",
        ]}
        correct={1}
        explanation="Benar: turun. Kupon tetap, tapi harga harus turun agar yield-nya bersaing dengan obligasi baru. Inilah cerita Budi di pembuka."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Obligasi kupon 6% diperdagangkan di harga DISKON (di bawah nominal). Apa artinya?"
        options={[
          "YTM < 6%",
          "YTM = 6%",
          "YTM > 6% — pasar meminta yield lebih tinggi dari kupon",
          "Obligasi pasti default",
        ]}
        correct={2}
        explanation="Benar: YTM > kupon. Harga diskon = pasar mendiskonto lebih berat = yield yang diminta lebih tinggi dari kupon yang ditawarkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Obligasi dengan modified duration 8. Yield naik 0,5%. Estimasi perubahan harga?"
        options={[
          "Naik 4%",
          "Turun ≈ 4%",
          "Turun 8%",
          "Tidak berubah",
        ]}
        correct={1}
        explanation="Benar: ΔP/P ≈ −8 × 0,005 = −4%. Duration = speedometer: persen perubahan harga per 1% perubahan yield."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mana yang PALING sensitif terhadap perubahan suku bunga?"
        options={[
          "Obligasi 3 tahun kupon 8%",
          "Obligasi 10 tahun kupon 8%",
          "Obligasi 10 tahun kupon 2%",
          "Deposito 1 tahun",
        ]}
        correct={2}
        explanation="Benar: 10 tahun kupon 2%. Dua aturan duration bekerja bersama: tenor panjang + kupon kecil = duration terpanjang = paling sensitif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Yield curve inverted (tenor pendek yield lebih tinggi) biasanya menandakan…"
        options={[
          "Ekonomi super sehat",
          "Pasar bertaruh suku bunga akan turun — sering mendahului resesi",
          "Inflasi nol",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar: sinyal bahaya klasik. Pasar menerima yield rendah untuk tenor panjang karena yakin bunga masa depan turun (bank sentral akan memangkas saat resesi)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua obligasi ber-duration sama, A convexity lebih tinggi dari B. Jika yield bergerak besar…"
        options={[
          "Pilih B — lebih stabil",
          "Pilih A — asimetri menguntungkan: untung lebih saat yield turun, rugi lebih kecil saat naik",
          "Sama saja",
          "Pilih yang kuponnya lebih besar",
        ]}
        correct={1}
        explanation="Benar: A. Convexity = bonus kelengkungan. Untuk pergerakan yield besar, obligasi convexity tinggi menang di kedua arah."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Harga obligasi = PV(kupon + pokok)</strong> dengan diskonto = yield pasar. Kupon masa lalu, yield masa kini.</li>
          <li><strong>Yield naik → harga turun.</strong> Selalu. Hubungannya melengkung (konveks), tidak lurus.</li>
          <li><strong>YTM</strong> = return sebenarnya (bukan kupon!) jika dipegang sampai jatuh tempo.</li>
          <li><strong>Duration</strong> = % perubahan harga per 1% perubahan yield. Tenor panjang + kupon kecil = sensitif.</li>
          <li><strong>Convexity</strong> = koreksi kelengkungan; asimetri yang menguntungkan saat yield bergerak besar.</li>
          <li><strong>Yield curve</strong>: normal = sehat; <strong>inverted = waspada resesi</strong>; flat = transisi.</li>
          <li>Pegang sampai jatuh tempo → fokus YTM &amp; risiko default, abaikan gejolak harga.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e3-tvm" className="btn btn-secondary btn-sm">← E3</Link>
        <Link href="/learn/e5-credit-spread" className="btn btn-primary btn-sm">Next: E5 →</Link>
      </div>
    </div>
  );
}
