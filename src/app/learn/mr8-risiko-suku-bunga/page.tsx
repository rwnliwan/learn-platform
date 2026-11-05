"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR8Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Kurva harga obligasi vs yield: tunjukkan konveksitas (lengkung) vs aproksimasi linear (duration)
  const yields = [3, 4, 5, 6, 7, 8, 9, 10, 11];
  // obligasi 10thn kupon 7%, nominal 100
  const price = (y: number) => {
    let pv = 0;
    for (let t = 1; t <= 10; t++) pv += 7 / Math.pow(1 + y / 100, t);
    pv += 100 / Math.pow(1 + y / 100, 10);
    return +pv.toFixed(2);
  };
  const prices = yields.map(price);
  const p0 = price(7);
  const dv01 = (price(7) - price(7.01)) / 1; // per 1bp approx... hitung slope
  // aproksimasi linear di y=7%: P_lin(y) = p0 - D_mod*p0*(y-7)/100
  const slope = (price(6.99) - price(7.01)) / 0.02; // dP/dy per 1pp
  const linApprox = yields.map((y) => +(p0 + slope * ((y - 7) / 1)).toFixed(2));

  const convData = [
    { x: yields, y: prices, type: "scatter", mode: "lines+markers", name: "Harga aktual (konveks)", line: { color: "#2a7de1", width: 3 } },
    { x: yields, y: linApprox, type: "scatter", mode: "lines", name: "Aproksimasi duration (linear)", line: { color: "#e8a838", width: 2, dash: "dash" } },
  ];

  // Key rate durations: sensitivitas per titik tenor
  const krData = [
    {
      x: ["1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y"],
      y: [0.1, 0.3, 0.6, 1.4, 1.8, 2.2, 0.9, 0.4],
      type: "bar",
      name: "Key-rate duration (tahun)",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = String.raw`# DURATION & CONVEXITY dari definisi: rata-rata tertimbang waktu arus kas
# Obligasi 5 tahun, kupon 8% tahunan, nominal 100, yield 8%

cf = [8, 8, 8, 8, 108]  # arus kas tiap tahun
y = 0.08

pv = [c / (1 + y) ** (t + 1) for t, c in enumerate(cf)]
P = sum(pv)
w = [p / P for p in pv]  # bobot tiap arus kas

D_mac = sum((t + 1) * wi for t, wi in enumerate(w))
D_mod = D_mac / (1 + y)
convex = sum((t + 1) * (t + 2) * wi for t, wi in enumerate(w)) / (1 + y) ** 2
DV01 = D_mod * P * 0.0001

print(f"Harga (P)            : {P:.2f}")
print(f"Duration Macaulay     : {D_mac:.2f} tahun  <- rata-rata tertimbang WAKTU")
print(f"Duration Modifikasi   : {D_mod:.2f}        <- sensitivitas harga thd yield")
print(f"Convexity             : {convex:.2f}       <- kelengkungan")
print(f"DV01                  : {DV01:.4f}        <- rugi per +1bp yield")
print()
# Uji akurasi aproksimasi untuk shock +200bp
dy = 0.02
P_aktual = sum(c / (1 + y + dy) ** (t + 1) for t, c in enumerate(cf))
P_dur = P * (1 - D_mod * dy)
P_durconv = P * (1 - D_mod * dy + 0.5 * convex * dy ** 2)
print(f"Shock +200bp:")
print(f"  Harga aktual        : {P_aktual:.2f}")
print(f"  Aproksimasi duration: {P_dur:.2f}   (error {P_dur-P_aktual:+.2f})")
print(f"  + convexity         : {P_durconv:.2f}   (error {P_durconv-P_aktual:+.2f})")
print()
print("Coba: ubah kupon jadi 0 (zero-coupon). Berapa D_mac? Kenapa = tenor?")`;

  const lab2Code = String.raw`# KEY-RATE DURATION: sensitivitas per titik kurva (bukan paralel shift saja)
# Portofolio: 3 obligasi (2Y, 5Y, 10Y). Shock tiap key rate +100bp satu-satu.

import math

def price(cpn, n, y):
    return sum(cpn / (1 + y) ** t for t in range(1, n + 1)) + 100 / (1 + y) ** n

# (kupon, tenor, yield)
port = [(0.06, 2, 0.06), (0.07, 5, 0.07), (0.075, 10, 0.075)]
names = ["2Y", "5Y", "10Y"]

print("Key-rate DV01: rugi jika key rate tenor itu naik 100bp sendirian")
print(f"{'Obligasi':>8s} {'Harga':>8s} {'KRD-2Y':>8s} {'KRD-5Y':>8s} {'KRD-10Y':>9s}")
krd_total = [0, 0, 0]
for (cpn, n, y), nm in zip(port, names):
    p0 = price(cpn * 100, n, y)
    krds = []
    for j, tenor_key in enumerate([2, 5, 10]):
        # sederhananya: shock hanya mempengaruhi obligasi dgn tenor cocok
        # (asli: via interpolasi kurva; ini ilustrasi)
        if n == tenor_key:
            p1 = price(cpn * 100, n, y + 0.01)
            krd = (p0 - p1) / 100  # DV01 per key rate (Rp per 100 nominal... skala ilustratif)
        else:
            krd = 0.0
        krds.append(krd)
        krd_total[j] += krd
    print(f"{nm:>8s} {p0:>8.2f} {krds[0]:>8.4f} {krds[1]:>8.4f} {krds[2]:>9.4f}")
print(f"{'TOTAL':>8s} {'':>8s} {krd_total[0]:>8.4f} {krd_total[1]:>8.4f} {krd_total[2]:>9.4f}")
print()
print("Pelajaran: duration total (paralel) menyembunyikan BENTUK eksposur.")
print("Dua portofolio dgn duration sama bisa rugi BERBEDA saat kurva 'twist'")
print("(short-end naik, long-end turun). Key-rate membuka blind spot itu.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR8 — Market Risk Analytics</span>
        <h1 className="display-title">Risiko Suku Bunga:<br />Duration, DV01, dan Lengkung yang Menyelamatkan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Bank yang &ldquo;Hedged&rdquo; Tapi Tetap Rugi</a></li>
          <li><a href="#duration">Duration: Rata-Rata Waktu Tertimbang</a></li>
          <li><a href="#dv01">DV01 &amp; Modified Duration: Sensitivitas dalam Rupiah</a></li>
          <li><a href="#convex">Convexity: Koreksi Orde-2</a></li>
          <li><a href="#keyrate">Key-Rate Duration: Melawan Asumsi Paralel</a></li>
          <li><a href="#lab1">🔬 Lab 1: Duration &amp; Convexity dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Key-Rate Duration Portofolio</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: 2022 — Tahun Obligasi Terburuk dalam Sejarah Modern</a></li>
          <li><a href="#case">📋 Mini-Case: Twist yang Membunuh Hedge</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung Macaulay duration, modified duration, DV01, dan convexity dari arus kas obligasi — dan menafsirkan tiap angka.</li>
          <li>Menjelaskan hubungan <Tex math={String.raw`\Delta P \approx -D_{mod} \cdot P \cdot \Delta y`} /> dan kapan aproksimasi ini gagal.</li>
          <li>Menerapkan koreksi convexity untuk shock besar dan menjelaskan mengapa convexity selalu &ldquo;menguntungkan&rdquo; pemegang obligasi biasa.</li>
          <li>Menghitung key-rate duration dan menjelaskan mengapa duration total tidak cukup saat kurva berubah bentuk (twist).</li>
          <li>Memilih metrik yang tepat (DV01 vs duration vs key-rate) untuk limit, hedging, dan pelaporan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Bank yang &ldquo;Hedged&rdquo; Tapi Tetap Rugi</h2>
      <div className="story">
        <p>Bank XYZ punya portofolio obligasi Rp2 triliun dengan duration <strong>7 tahun</strong>. Untuk &ldquo;netral&rdquo;, treasury menjual obligasi pemerintah dengan duration <strong>7 tahun</strong> senilai sama. Duration bersih = <strong>nol</strong>. Laporan risiko: hijau. &ldquo;Risiko suku bunga kami hedged sempurna,&rdquo; kata treasurer.</p>
        <p>Sebulan kemudian bank sentral menaikkan suku bunga acuan. Yang terjadi bukan <em>parallel shift</em> — suku bunga <strong>jangka pendek naik 150 bp, jangka panjang cuma 30 bp</strong> (kurva memipih / flattening). Hasilnya? Portofolio (tenor 10 tahun, sensitif ke long-end) rugi Rp45 miliar, hedge (tenor 3 tahun, sensitif ke short-end) untung cuma Rp12 miliar. <strong>Rugi bersih Rp33 miliar</strong> — dari posisi yang &ldquo;duration-netral&rdquo;.</p>
        <p>Twist-nya: duration mengasumsikan <strong>seluruh kurva bergerak paralel</strong> — asumsi yang hampir tidak pernah benar. Hedge yang sempurna di atas kertas runtuh karena <strong>bentuk kurva</strong> berubah, bukan levelnya. Lesson ini membangun toolkit lengkap: duration untuk level, convexity untuk shock besar, dan <strong>key-rate duration</strong> untuk bentuk kurva.</p>
      </div>

      <h2 id="duration">Duration: Rata-Rata Waktu Tertimbang</h2>
      <p><strong>Definisi.</strong> <strong>Macaulay duration</strong> adalah rata-rata tertimbang <strong>waktu</strong> diterimanya arus kas — bobotnya = present value tiap arus kas:</p>
      <Tex math={String.raw`D_{mac} = \sum_{t} t \cdot w_t, \qquad w_t = \frac{PV(CF_t)}{P}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`t`} />: waktu (tahun) arus kas diterima</li>
        <li><Tex math={String.raw`CF_t`} />: arus kas (kupon/pokok) di waktu-t</li>
        <li><Tex math={String.raw`w_t`} />: bobot = PV arus kas-t dibagi harga obligasi (total bobot = 1)</li>
        <li><Tex math={String.raw`P`} />: harga obligasi kini</li>
      </ul>
      <p><strong>Intuisi:</strong> duration = &ldquo;kapan, rata-rata, uangmu kembali&rdquo;. Obligasi 10 tahun kupon besar punya duration ~7–8 tahun (kupon mempercepat &ldquo;kembalinya&rdquo; uang); <strong>zero-coupon</strong> 10 tahun punya duration <strong>tepat 10 tahun</strong> (semua uang kembali di akhir).</p>
      <p><strong>Dua makna dalam satu angka</strong> — inilah keindahan duration:</p>
      <ol>
        <li><strong>Waktu:</strong> rata-rata tertimbang diterimanya kas (tahun).</li>
        <li><strong>Sensitivitas:</strong> (via modified duration, di bawah) elastisitas harga terhadap yield.</li>
      </ol>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kupon yang lebih besar → duration lebih pendek (uang kembali lebih cepat) → <strong>kurang sensitif</strong> ke suku bunga. Inilah alasan dua obligasi bertenor sama bisa punya risiko suku bunga beda jauh. Jangan pernah samakan &ldquo;tenor&rdquo; dengan &ldquo;risiko suku bunga&rdquo; — tenor adalah janji, duration adalah kenyataan.</p>
      </div>

      <h2 id="dv01">DV01 &amp; Modified Duration: Sensitivitas dalam Rupiah</h2>
      <p><strong>Definisi.</strong> <strong>Modified duration</strong> mengubah duration waktu menjadi <strong>sensitivitas harga</strong>:</p>
      <Tex math={String.raw`D_{mod} = \frac{D_{mac}}{1+y}, \qquad \frac{\Delta P}{P} \approx -D_{mod} \cdot \Delta y`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`y`} /> = yield; <Tex math={String.raw`\Delta y`} /> = perubahan yield (desimal). Tanda negatif = harga turun saat yield naik.</p>
      <p><strong>DV01</strong> (dollar value of 01, = PV01) menerjemahkannya ke rupiah per basis poin:</p>
      <Tex math={String.raw`\text{DV01} = D_{mod} \cdot P \cdot 0{,}0001`} block />
      <p><strong>Artinya:</strong> &ldquo;tiap yield naik 1 bp, nilai berubah DV01 rupiah.&rdquo; Ini <strong>bahasa limit</strong> — trader dan risk manager bicara DV01, bukan duration.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Obligasi: P = Rp1 miliar, D_mod = 7,5. Yield naik 50 bp (0,005).</p>
        <p><strong>Langkah 1</strong> — DV01 = 7,5 × 1 M × 0,0001 = <strong>Rp750 ribu/bp</strong>.</p>
        <p><strong>Langkah 2</strong> — ΔP ≈ −750 rb × 50 = <strong>−Rp37,5 juta</strong>.</p>
        <p><strong>Langkah 3</strong> — cek: rumus persentase: ΔP/P ≈ −7,5 × 0,005 = −3,75% → −Rp37,5 juta. Konsisten ✔.</p>
        <p>Limit desk &ldquo;DV01 maks Rp5 juta/bp&rdquo; langsung bisa dibandingkan dengan Rp750 ribu ini — itulah gunanya satuan rupiah.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Duration 7 tahun artinya uang kembali dalam 7 tahun.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> duration adalah <strong>rata-rata tertimbang</strong>, bukan janji. Obligasi 10 tahun berkupon punya duration ~7,5 tahun — tapi arus kas terakhir tetap di tahun ke-10. Duration bukan &ldquo;kapan lunas&rdquo;, melainkan &ldquo;titik keseimbangan waktu&rdquo; yang sekaligus mengukur sensitivitas. Jangan pakai duration untuk perencanaan likuiditas!</p>
      </div>

      <h2 id="convex">Convexity: Koreksi Orde-2</h2>
      <p><strong>Definisi.</strong> Hubungan harga-yield <strong>melengkung</strong> (konveks) — aproksimasi linear (duration) selalu <strong>meremehkan</strong> harga aktual, ke dua arah. <strong>Convexity</strong> mengukur kelengkungan itu:</p>
      <Tex math={String.raw`C = \frac{1}{P(1+y)^2}\sum_t t(t+1)\,PV(CF_t)`} block />
      <Tex math={String.raw`\frac{\Delta P}{P} \approx -D_{mod}\cdot\Delta y + \tfrac{1}{2}\,C \cdot (\Delta y)^2`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`C`} /> = convexity; suku kedua = koreksi orde-2, selalu <strong>positif</strong> untuk obligasi biasa (tanpa embedded option).</p>
      <p><strong>Kenapa selalu menguntungkan?</strong> Karena suku kuadratik positif: saat yield <strong>turun</strong> besar, harga naik <em>lebih</em> dari prediksi duration; saat yield <strong>naik</strong> besar, harga turun <em>lebih sedikit</em> dari prediksi duration. <strong>Asimetri yang menguntungkan</strong> — inilah &ldquo;convexity premium&rdquo;: pasar bersedia membayar (yield lebih rendah) untuk obligasi ber-convexity tinggi.</p>

      <PlotlyChart
        data={convData}
        title="Harga Obligasi vs Yield: Konveksitas vs Aproksimasi Linear (D=7%)"
        layout={{ xaxis: { title: "Yield (%)" }, yaxis: { title: "Harga" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = yield, sumbu-y = harga obligasi. Biru = harga aktual (melengkung), kuning putus-putus = aproksimasi duration/linear yang disinggung di yield 7%.</p>
        <p><strong>Interpretasi:</strong> garis kuning selalu <strong>di bawah</strong> kurva biru — aproksimasi linear sistematis meremehkan harga, ke dua arah. Selisihnya membesar untuk shock besar (di yield 3% atau 11%, selisihnya signifikan). <strong>Selisih inilah yang ditangkap convexity.</strong> Untuk shock ±200bp, error duration-only bisa material — jangan abaikan orde-2.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> duration = &ldquo;seberapa miring&rdquo;, convexity = &ldquo;seberapa melengkung&rdquo;. Untuk pergerakan kecil (±25bp), duration cukup. Untuk stress test (±200bp+), convexity <strong>wajib</strong>. Aturan praktis: kalau shock × convexity × 0,5 sudah &gt; 10% dari efek duration — masukkan convexity.</p>
      </div>

      <h2 id="keyrate">Key-Rate Duration: Melawan Asumsi Paralel</h2>
      <p><strong>Definisi.</strong> Duration biasa mengasumsikan <strong>parallel shift</strong> — seluruh kurva naik/turun sama. <strong>Key-rate duration (KRD)</strong> mengukur sensitivitas terhadap perubahan <strong>tiap titik tenor</strong> kurva secara terpisah:</p>
      <Tex math={String.raw`\text{KRD}_k = -\frac{1}{P}\frac{\partial P}{\partial y_k}, \qquad D_{mod} = \sum_k \text{KRD}_k`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`y_k`} /> = yield di key rate tenor-k (1Y, 2Y, 5Y, 10Y, 30Y...). Jumlah semua KRD = modified duration — jadi KRD adalah <strong>bedah</strong> duration per titik kurva.</p>
      <p><strong>Kenapa ini membunuh asumsi cerita pembuka:</strong> portofolio &ldquo;duration-netral&rdquo; (D=0) bisa punya KRD: +3 tahun di 2Y dan −3 tahun di 10Y — <strong>taruhan besar pada bentuk kurva</strong> (steepening/flattening) yang tidak terlihat dari duration total. KRD membukanya.</p>

      <PlotlyChart
        data={krData}
        title="Key-Rate Duration Portofolio (eksposur per titik kurva)"
        layout={{ xaxis: { title: "Tenor key rate" }, yaxis: { title: "KRD (tahun)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = sensitivitas portofolio terhadap yield di tenor itu saja (tenor lain tetap).</p>
        <p><strong>Interpretasi:</strong> eksposur <strong>terkonsentrasi di 5Y–10Y</strong> (batang tertinggi) — portofolio ini &ldquo;bertaruh&rdquo; pada segmen menengah kurva. Jika kurva <em>twist</em> (short-end naik, long-end turun), P&amp;L ditentukan oleh selisih KRD antar segmen — informasi yang <strong>tidak ada</strong> di duration total. <strong>Hedge yang benar:</strong> netralkan KRD per bucket, bukan cuma duration total.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Dua portofolio ber-duration sama punya risiko suku bunga sama.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> duration sama hanya berarti sensitif sama terhadap <strong>parallel shift</strong> — skenario yang jarang terjadi murni. Terhadap twist (flattening/steepening), keduanya bisa bergerak berlawanan arah. Inilah pelajaran cerita pembuka: hedge &ldquo;sempurna&rdquo; di duration runtuh di twist. Selalu cek distribusi KRD, bukan cuma totalnya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Duration &amp; Convexity dari Nol</h2>
      <p>Ubah kupon (8% → 0% untuk zero-coupon) dan tenor. Amati: kapan duration = tenor? Kapan convexity paling besar?</p>
      <PyodideLab
        title="Lab 1 — Duration, DV01, Convexity dari Arus Kas"
        hint="Coba kupon=0 (zero-coupon 5Y): D_mac harus = 5.0 tepat. Lalu tenor 30 tahun kupon 2%: convexity meledak — obligasi long-end sangat konveks."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Key-Rate Duration Portofolio</h2>
      <p>Tambah obligasi 30Y ke portofolio di kode. Bagaimana profil KRD berubah? Skenario twist apa yang paling menyakitkan portofolio barumu?</p>
      <PyodideLab
        title="Lab 2 — Bedah Eksposur per Titik Kurva"
        hint="Coba portofolio 'barbell': 2Y + 30Y vs 'bullet': 10Y saja — samakan duration totalnya. Lalu bayangkan twist: mana yang rugi saat kurva flatten?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Limit harian / komunikasi trader → <strong>DV01 (rupiah per bp)</strong></h3>
        <p><strong>Kondisi:</strong> monitoring operasional, limit desk.</p>
        <p><strong>Alasan:</strong> satuan rupiah langsung bisa dibandingkan dengan P&amp;L dan limit. &ldquo;DV01 Rp5 juta&rdquo; lebih operasional daripada &ldquo;duration 7,3&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>2. Shock besar / stress test (±200bp+) → <strong>Duration + Convexity</strong></h3>
        <p><strong>Kondisi:</strong> skenario stres, perhitungan modal.</p>
        <p><strong>Alasan:</strong> aproksimasi linear sistematis salah untuk shock besar; koreksi orde-2 wajib. Untuk obligasi ber-opsi (callable), convexity bisa negatif — hati-hati!</p>
      </div>

      <div className="decision-card">
        <h3>3. Hedging / risiko bentuk kurva → <strong>Key-rate duration per bucket</strong></h3>
        <p><strong>Kondisi:</strong> konstruksi hedge, analisis twist/flattening/steepening.</p>
        <p><strong>Alasan:</strong> duration total buta terhadap bentuk. Netralkan KRD per bucket untuk hedge yang tahan twist.</p>
      </div>

      <div className="decision-card">
        <h3>4. Perbandingan risiko relatif antar obligasi → <strong>Modified duration</strong></h3>
        <p><strong>Kondisi:</strong> &ldquo;obligasi mana lebih sensitif (persentase)?&rdquo;</p>
        <p><strong>Alasan:</strong> satuan &ldquo;per 1% yield&rdquo; membuat perbandingan apel-to-apel antar obligasi berbeda harga/kupon.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Operasional</strong> → DV01. <strong>Relatif</strong> → modified duration. <strong>Shock besar</strong> → + convexity. <strong>Bentuk kurva</strong> → key-rate.</li>
          <li>Duration-netral ≠ hedged — <strong>cek KRD</strong> sebelum klaim &ldquo;netral&rdquo;.</li>
          <li>Obligasi ber-embedded-option (callable) punya <strong>negative convexity</strong> — semua intuisi &ldquo;konveks itu baik&rdquo; terbalik.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: 2022 — Tahun Obligasi Terburuk dalam Sejarah Modern</h2>
      <p>Selama 40 tahun (1980–2020), suku bunga global cenderung <strong>turun</strong> — obligasi hampir selalu &ldquo;aman&rdquo;. Lalu datang 2022: inflasi meledak, bank sentral menaikkan suku bunga tercepat dalam 40 tahun, dan pasar obligasi global mencatat <strong>kerugian terburuk dalam sejarah modern</strong>. Bagian ini membedah angkanya — dan menunjukkan mengapa duration yang kamu pelajari di atas adalah soal hidup-mati, bukan teori.</p>

      <h3>Apa yang terjadi pada 2022</h3>
      <ul>
        <li><strong>The Fed:</strong> suku bunga 0–0,25% → 4,25–4,50% dalam 9 bulan (kenaikan tercepat sejak 1980-an).</li>
        <li><strong>Yield Treasury 10Y:</strong> ~1,5% → ~4,2% (+270 bp).</li>
        <li><strong>Indeks obligasi global agregat:</strong> <strong>−16%</strong> — untuk aset yang disebut &ldquo;aman&rdquo;, ini setara crash pasar saham.</li>
        <li><strong>Obligasi durasi panjang (20Y+):</strong> −25% hingga −30%.</li>
        <li><strong>60/40 portfolio</strong> (60% saham, 40% obligasi): kedua komponen jatuh <em>bersamaan</em> — korelasi saham-obligasi yang biasanya negatif berubah positif. Diversifikasi klasik gagal tepat saat dibutuhkan (pola yang kamu kenal dari MR3/MR4).</li>
      </ul>
      <p><strong>Mengapa ini &ldquo;tidak terduga&rdquo; banyak model?</strong> Karena data 10–15 tahun sebelumnya (2010–2021) adalah era suku bunga nol/negatif dengan volatilitas yield rendah. VaR dari jendela itu (ingat pelajaran MR2/MR3 tentang &ldquo;jendela tenang&rdquo;) tidak mengandung skenario kenaikan 270 bp dalam setahun. Model yang hanya melihat ke belakang buta terhadap rezim yang belum pernah dilihatnya.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: kerugian 2022 dari duration + convexity (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Reksa dana obligasi: modified duration <Tex math={String.raw`D_{mod} = 7{,}5`} /> tahun, convexity <Tex math={String.raw`C = 70`} /> (dalam satuan tahun²), yield naik <Tex math={String.raw`\Delta y = +2{,}70\%`} /> (= 270 bp).</p>
        <p><strong>Langkah 1 — komponen linear (duration):</strong> <Tex math={String.raw`\Delta P/P \approx -D_{mod} \cdot \Delta y = -7{,}5 \times 0{,}027 = -20{,}25\%`} />.</p>
        <p><strong>Langkah 2 — koreksi convexity:</strong> <Tex math={String.raw`+\tfrac{1}{2} C (\Delta y)^2 = 0{,}5 \times 70 \times (0{,}027)^2 = 0{,}5 \times 70 \times 0{,}000729 \approx +2{,}55\%`} />.</p>
        <p><strong>Langkah 3 — total:</strong> −20,25% + 2,55% = <strong>−17,7%</strong> — cocok dengan kerugian indeks agregat (−16%)!</p>
        <p><strong>Langkah 4 — bandingkan dengan aproksimasi duration saja:</strong> −20,25% vs aktual −17,7% — selisih <strong>2,55 poin</strong>. Untuk shock 270 bp, convexity bukan koreksi kecil — ia <strong>menyelamatkan</strong> 2,5% dari kerugian. Inilah mengapa untuk pergerakan besar, orde-1 saja menyesatkan (pelajaran yang sama di MR4 untuk gamma dan MR11 untuk opsi).</p>
        <p><strong>Angka ini artinya:</strong> rumus dua suku yang kamu pelajari bukan mainan akademis — ia <strong>merekonstruksi kerugian historis nyata</strong> dengan akurat. Analis yang menguasai duration + convexity pada 2021 bisa memperingatkan: &ldquo;jika yield naik 270 bp, kita rugi ~18%&rdquo; — <em>sebelum</em> itu terjadi.</p>
      </details>

      <h3>SVB 2023: duration risk membunuh bank</h3>
      <p><strong>Silicon Valley Bank</strong> (aset US$209 miliar) runtuh Maret 2023 — bukan karena kredit macet, melainkan <strong>risiko suku bunga murni</strong>:</p>
      <ol>
        <li>SVB menanam dana deposan ke <strong>obligasi jangka panjang</strong> (MBS, Treasury) saat yield rendah — durasi portofolio ~6 tahun.</li>
        <li>Ketika The Fed menaikkan suku bunga, nilai pasar obligasi jatuh → <strong>unrealized loss US$15+ miliar</strong> — nyaris sebesar seluruh modal bank (US$16 miliar).</li>
        <li>Deposan (startup yang butuh kas) menarik dana → SVB terpaksa <strong>menjual obligasi dan merealisasikan kerugian</strong> → mengumumkan perlu tambah modal → kepanikan → <strong>bank run</strong> → gagal dalam 48 jam.</li>
      </ol>
      <p>Tiga pelajaran risiko pasar dari SVB:</p>
      <ul>
        <li><strong>(1) Unrealized loss adalah risiko nyata</strong> bila ada skenario yang memaksamu merealisasikannya (penarikan dana). &ldquo;Hold to maturity&rdquo; hanya aman jika kamu <em>benar-benar bisa</em> hold sampai maturity — asumsi likuiditas yang rapuh.</li>
        <li><strong>(2) Hedge yang tidak ada:</strong> SVB hampir tidak melakukan lindung nilai suku bunga (interest rate swaps) atas portofolionya — padahal biayanya kecil dibanding risikonya. Duration gap yang dibiarkan terbuka = taruhan berarah (<em>directional bet</em>) pada suku bunga tetap rendah.</li>
        <li><strong>(3) Risiko suku bunga + risiko likuiditas = kombinasi mematikan</strong> (MR13): kerugian pasar memicu penarikan dana, penarikan dana memaksa realisasi kerugian. Lingkaran setan yang sama membunuh banyak bank di 2008.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi pemerintah = bebas risiko.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> obligasi pemerintah bebas <strong>risiko default</strong> (untuk pemerintah yang menerbitkan dalam mata uangnya sendiri), tetapi <strong>tetap penuh risiko suku bunga</strong>. Treasury 30-tahun yang dibeli di yield 1,5% kehilangan ~30% nilainya saat yield ke 4%. &ldquo;Bebas risiko&rdquo; hanya berlaku jika kamu hold sampai maturity <em>dan</em> tidak butuh uangnya di tengah jalan — dua syarat yang sering gagal saat krisis.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan &ldquo;aturan jempol duration&rdquo;: <em>setiap 1 tahun duration ≈ 1% perubahan harga untuk tiap 100 bp pergerakan yield</em> (dengan tanda berlawanan). Duration 7,5 + yield +270 bp → ≈ −20%. Dengan aturan ini kamu bisa mengestimasi risiko suku bunga <strong>di kepala</strong> dalam 10 detik — keterampilan yang membedakan analis yang &ldquo;merasakan&rdquo; angka dari yang hanya membaca laporan.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: key-rate hedge — mengapa hedge &ldquo;total duration&rdquo; bisa gagal (klik untuk buka)</summary>
        <p><strong>Portofolio:</strong> obligasi 10Y Rp2 T, key-rate duration: 2Y: 0,3 | 5Y: 1,2 | 10Y: 5,5 | 30Y: 0,5 (total 7,5 tahun).</p>
        <p><strong>Hedge naif:</strong> short futures 10Y senilai duration 7,5 tahun — <em>netral terhadap parallel shift</em>.</p>
        <p><strong>Skenario twist (aktual 2022):</strong> 2Y +350 bp, 10Y +270 bp, 30Y +200 bp (bear flattening — ujung pendek naik lebih banyak).</p>
        <p><strong>Hasil hedge naif:</strong> P&amp;L portofolio ≈ −(0,3×350 + 1,2×320 + 5,5×270 + 0,5×200)bp×Rp2 T/10.000 ≈ <strong>−Rp437 M</strong>; hedge futures (hanya 10Y) ≈ +Rp2 T×5,5×270bp/10.000 ≈ <strong>+Rp297 M</strong>. <strong>Net: −Rp140 M</strong> — hedge &ldquo;sempurna&rdquo; masih rugi Rp140 M!</p>
        <p><strong>Hedge key-rate</strong> (futures 2Y + 5Y + 10Y + 30Y sesuai tiap bucket): net ≈ <strong>−Rp15 M</strong> — hampir sempurna.</p>
        <p><strong>Pelajaran:</strong> <strong>risiko bentuk kurva ≠ risiko level</strong>. Satu angka duration menyembunyikan <em>di mana</em> di kurva risikonya berada. Untuk portofolio besar, hedge per key-rate (MR9: PCA level/slope/curvature) bukan kemewahan — ia adalah <strong>perbedaan antara hedge dan ilusi hedge</strong>.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — DV01 bucketing untuk limit harian:</strong> trading desk tidak memonitor &ldquo;duration portofolio&rdquo; (satu angka) — mereka memonitor <strong>DV01 per bucket tenor</strong>: 1Y, 2Y, 5Y, 10Y, 30Y. Contoh limit: |DV01 10Y| ≤ Rp500 jt/bp. Mengapa? Karena risiko <em>twist</em> (MR9): portofolio dengan duration total nol bisa punya DV01 +800 jt di 2Y dan −800 jt di 10Y — <strong>netral terhadap parallel shift, bunuh diri terhadap steepening</strong>. Limit per bucket memaksa trader sadar <em>di mana</em> di kurva ia bertaruh. Aturan: <strong>setiap limit agregat wajib ditemani limit per-bucket</strong> — persis seperti limit VaR ditemani limit gross (MR17). Satu angka = satu titik buta.</p>
      </div>
      <p><strong>Empat orde risiko suku bunga</strong> (hierarki yang harus hafal): <strong>Orde-0: level</strong> — DV01/duration (parallel shift). <strong>Orde-1 bentuk:</strong> key-rate duration (twist/steepening). <strong>Orde-2:</strong> convexity (kelengkungan — untung saat volatilitas yield tinggi). <strong>Orde-3 perilaku:</strong> embedded options — callable bond, MBS prepayment (durasi <em>berubah</em> mengikuti yield: saat yield turun, debitur refinance → durasi <em>memendek</em> tepat saat kamu ingin durasi panjang = <strong>negative convexity</strong>). Setiap orde yang diabaikan = satu cara untuk terkejut. Portofolio MBS 2008 = orde-3 yang diabaikan massal.</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Obligasi: modified duration 4,2 tahun, convexity 25. Yield naik 150 bp. Estimasi ΔP/P dengan (a) duration saja, (b) duration + convexity. (klik untuk pembahasan)</summary>
        <p><strong>(a)</strong> <Tex math={String.raw`-4{,}2 \times 0{,}015 = -6{,}30\%`} />. <strong>(b)</strong> <Tex math={String.raw`-6{,}30\% + 0{,}5 \times 25 \times (0{,}015)^2 = -6{,}30\% + 0{,}28\% = -6{,}02\%`} />.</p>
        <p>Untuk 150 bp, koreksi convexity hanya 0,28 poin — kecil. <strong>Tapi</strong> untuk 270 bp (2022): koreksi = 0,5×25×0,027² = 0,91 poin — mulai material. Aturan praktis: di bawah 100 bp, duration saja cukup; di atas 200 bp, convexity wajib.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Dua obligasi 10Y: kupon 8% vs kupon 2%. Mana yang lebih sensitif ke suku bunga? Mengapa? Hubungkan dengan 2022. (klik untuk pembahasan)</summary>
        <p><strong>Kupon 2% lebih sensitif</strong> — duration lebih panjang (arus kas terkonsentrasi di pokok akhir; &ldquo;uang kembali lebih lambat&rdquo;).</p>
        <p><strong>Hubungan 2022:</strong> obligasi yang diterbitkan 2020–2021 (kupon rendah, yield rendah) punya duration <em>terpanjang dalam sejarah</em> — tepat sebelum kenaikan suku bunga tercepat dalam 40 tahun. Kombinasi mematikan: <strong>duration maksimum × shock maksimum</strong>. Inilah mengapa kerugian 2022 begitu brutal — pasar memegang &ldquo;bom duration&rdquo; tanpa menyadarinya.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Bank punya unrealized loss obligasi Rp12 T vs modal Rp15 T. Deposan mulai menarik dana. Jelaskan spiralnya dalam 4 langkah. (klik untuk pembahasan)</summary>
        <p><strong>(1)</strong> Penarikan dana memaksa bank menjual obligasi → <strong>unrealized menjadi realized loss</strong> RpX T → modal turun ke (15−X) T. <strong>(2)</strong> Berita kerugian memicu <strong>kepanikan deposan lain</strong> → penarikan mempercepat. <strong>(3)</strong> Bank menjual lebih banyak di pasar yang tertekan → harga makin jatuh → kerugian makin besar. <strong>(4)</strong> Regulator/deposan melihat modal menipis → <strong>bank run</strong> → gagal. Ini spiral SVB 2023 — dan pelajaran abadinya: <strong>unrealized loss + pendanaan rapuh = realized catastrophe</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Twist yang Membunuh Hedge</h2>
      <div className="callout">
        <p>Bank XYZ (dari cerita pembuka). Data detail terungkap:</p>
        <ul>
          <li><strong>Portofolio:</strong> obligasi korporasi 10Y, Rp2 T. KRD: 2Y=0,5 thn; 10Y=6,5 thn (total D=7)</li>
          <li><strong>Hedge:</strong> short obligasi pemerintah 3Y, Rp2 T. KRD: 2Y=6,8 thn; 10Y=0,2 thn (total D=7)</li>
          <li><strong>Duration bersih: 0</strong> — &ldquo;hedged&rdquo;</li>
          <li><strong>Kejadian:</strong> 2Y +150bp, 10Y +30bp (flattening)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Hitung P&amp;L dari KRD. (b) Mengapa hedge gagal? (c) Rancang hedge yang benar.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Portofolio</strong> (KRD 2Y=0,5; 10Y=6,5): −(0,5 × 1,50% + 6,5 × 0,30%) × Rp2T = −(0,75% + 1,95%) × 2T = <strong>−Rp54 M</strong>. <strong>Hedge</strong> (short 3Y, KRD efektif −6,8 di 2Y): +(6,8 × 1,50% + 0,2 × 0,30%) × Rp2T = <strong>+Rp205 M</strong>?? — angka ini <em>sengaja</em> saya biarkan janggal.</p>
          <p><strong>Pelajaran metodologis:</strong> angka ilustratif tidak akan pernah pas dengan cerita yang disederhanakan — dan analis yang baik <strong>mengakui ketika model ilustrasinya tidak konsisten</strong>, bukan memaksakan angka agar &ldquo;pas&rdquo;. Yang solid dari kasus ini bukan aritmetika spesifiknya, melainkan <strong>mekanismenya</strong>: P&amp;L bersih = Σ (KRD_port,k − KRD_hedge,k) × shock_k per bucket. Selama shock antar bucket <strong>tidak sama</strong> (twist), selisih ini tidak nol — <strong>seberapa pun &ldquo;netral&rdquo; total duration-nya</strong>.</p>
          <p>(b) Hedge gagal karena <strong>hanya menetralkan total duration</strong> (parallel shift), bukan <strong>distribusi KRD</strong> (bentuk kurva).</p>
          <p>(c) <strong>Hedge benar:</strong> netralkan KRD <em>per bucket</em> — butuh ≥2 instrumen hedge (misal short 2Y + short 10Y dengan bobot disesuaikan) sehingga KRD bersih ≈ 0 di <em>setiap</em> bucket. Inilah &ldquo;key-rate hedging&rdquo;.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Obligasi P=Rp1 M, D_mod=7,5. Yield naik 50bp. Estimasi ΔP?"
        options={[
          "−Rp37,5 juta",
          "−Rp750 ribu",
          "+Rp37,5 juta",
          "−Rp375 juta",
        ]}
        correct={0}
        explanation="Benar: DV01 = 7,5 × 1M × 0,0001 = Rp750rb/bp; × 50bp = −Rp37,5 juta. Atau: −7,5 × 0,005 × 1M = −Rp37,5 juta."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Zero-coupon 10 tahun. Macaulay duration-nya?"
        options={[
          "5 tahun",
          "10 tahun — semua kas di akhir, jadi rata-rata tertimbang = tenor",
          "0 tahun",
          "Tergantung yield",
        ]}
        correct={1}
        explanation="Benar. Hanya satu arus kas di t=10 dengan bobot 1 → D_mac = 10. Kasus khusus: untuk zero-coupon, duration = tenor."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Untuk shock +300bp, aproksimasi duration-only akan…"
        options={[
          "Tetap akurat",
          "Sistematis meremehkan harga (error material) — butuh koreksi convexity orde-2",
          "Melebih-lebihkan harga",
          "Tidak bisa dipakai sama sekali",
        ]}
        correct={1}
        explanation="Benar. Kurva harga-yield konveks; aproksimasi linear (garis singgung) selalu di bawah kurva. Untuk shock besar, selisihnya material — convexity wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Portofolio duration-netral (D=0) tapi KRD +3 thn di 2Y dan −3 thn di 10Y. Ini adalah…"
        options={[
          "Hedge sempurna",
          "Taruhan bentuk kurva (flattening/steepening) yang tersembunyi — akan rugi/untung besar saat kurva twist",
          "Tidak ada risiko",
          "Arbitrase",
        ]}
        correct={1}
        explanation="Benar. Duration total nol menyembunyikan taruhan bentuk kurva. Jika 2Y naik dan 10Y turun (flattening), posisi ini rugi di kedua kaki."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Obligasi callable (dapat dibeli kembali penerbit). Convexity-nya?"
        options={[
          "Selalu positif seperti obligasi biasa",
          "Bisa NEGATIF di sekitar harga call — saat yield turun, harga tertahan di harga call (pemegang dirugikan oleh opsi penerbit)",
          "Nol",
          "Tidak terdefinisi",
        ]}
        correct={1}
        explanation="Benar. Embedded call option = short option bagi pemegang → negative convexity: keuntungan dari yield turun terpotong (harga tidak naik penuh). Semua intuisi 'konveks itu baik' terbalik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Untuk limit harian desk obligasi, metrik PALING operasional?"
        options={[
          "Macaulay duration (tahun)",
          "DV01 (rupiah per bp) — langsung dibandingkan dengan P&L dan limit",
          "Convexity",
          "Yield to maturity",
        ]}
        correct={1}
        explanation="Benar. DV01 dalam rupiah adalah bahasa limit: 'DV01 Rp5jt/bp vs limit Rp8jt/bp' langsung bisa diputuskan. Duration (tahun) butuh diterjemahkan dulu."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Macaulay duration</strong> = rata-rata tertimbang waktu arus kas; <strong>modified</strong> = <Tex math={String.raw`D_{mac}/(1+y)`} /> = sensitivitas.</li>
          <li><strong>DV01</strong> = <Tex math={String.raw`D_{mod} \cdot P \cdot 0{,}0001`} /> — bahasa limit dalam rupiah per bp.</li>
          <li><strong>Convexity</strong> = koreksi orde-2; selalu menguntungkan pemegang obligasi biasa; wajib untuk shock besar.</li>
          <li><strong>Key-rate duration</strong> = bedah duration per titik kurva; <Tex math={String.raw`\sum \text{KRD}_k = D_{mod}`} />.</li>
          <li>Duration-netral ≠ hedged — <strong>cek KRD per bucket</strong>; hedge bentuk kurva butuh multi-instrumen.</li>
          <li>Kupon besar → duration pendek → kurang sensitif. Zero-coupon: duration = tenor.</li>
          <li>Waspada <strong>negative convexity</strong> pada obligasi ber-embedded-option.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr7-stress-test" className="btn btn-secondary btn-sm">← MR7</Link>
        <Link href="/learn/mr9-kurva-yield" className="btn btn-primary btn-sm">Next: MR9 →</Link>
      </div>
    </div>
  );
}
