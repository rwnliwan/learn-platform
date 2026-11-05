"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E11Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const callValueData = [
    {
      x: [70, 80, 90, 100, 110, 120, 130],
      y: [0.4, 1.8, 5.2, 10.5, 17.3, 24.8, 32.5],
      mode: "lines+markers",
      name: "Nilai call (K=100, T=1thn, σ=30%)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [70, 80, 90, 100, 110, 120, 130],
      y: [0, 0, 0, 0, 10, 20, 30],
      mode: "lines",
      name: "Payoff saat jatuh tempo",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const deltaData = [
    {
      x: [70, 80, 90, 100, 110, 120, 130],
      y: [0.05, 0.16, 0.35, 0.58, 0.78, 0.91, 0.97],
      mode: "lines+markers",
      name: "Delta call",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const thetaData = [
    {
      x: [365, 300, 200, 100, 50, 20, 5, 1],
      y: [10.5, 10.1, 9.4, 8.2, 7.0, 5.6, 4.0, 2.9],
      mode: "lines+markers",
      name: "Nilai call vs sisa hari",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Black-Scholes pricer (upah sang Nobel)
import math

def N(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))

def bs_call(S, K, T, r, sigma):
    d1 = (math.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*math.sqrt(T))
    d2 = d1 - sigma*math.sqrt(T)
    return S*N(d1) - K*math.exp(-r*T)*N(d2), d1, d2

S, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30
call, d1, d2 = bs_call(S, K, T, r, sigma)
print(f"d1 = {d1:.3f}, d2 = {d2:.3f}")
print(f"N(d1) = {N(d1):.3f}  <- peluang tertimbang (delta!)")
print(f"N(d2) = {N(d2):.3f}  <- peluang opsi berakhir in-the-money")
print(f"Harga wajar call = Rp{call:.2f}")
print()
print("Coba: sigma = 0.60 (pasar panik). Berapa harga wajarnya sekarang?")
print("Pelajaran: volatilitas = 'bahan bakar' harga opsi.")`;

  const lab2Code = `# Lab 2 — Greeks: bedah sensitivitas opsi
import math

def N(x):
    return 0.5 * (1 + math.erf(x / math.sqrt(2)))
def n_pdf(x):
    return math.exp(-0.5*x*x) / math.sqrt(2*math.pi)

S, K, T, r, sigma = 100, 100, 1.0, 0.06, 0.30
d1 = (math.log(S/K) + (r + 0.5*sigma**2)*T) / (sigma*math.sqrt(T))
d2 = d1 - sigma*math.sqrt(T)

delta = N(d1)
gamma = n_pdf(d1) / (S * sigma * math.sqrt(T))
theta = -(S*n_pdf(d1)*sigma)/(2*math.sqrt(T)) - r*K*math.exp(-r*T)*N(d2)
vega  = S * n_pdf(d1) * math.sqrt(T)

print(f"Delta  = {delta:.3f}  (harga opsi naik Rp{delta:.2f} per Rp1 saham naik)")
print(f"Gamma  = {gamma:.4f}  (delta berubah {gamma:.4f} per Rp1 saham naik)")
print(f"Theta  = {theta:.3f}/tahun (opsi 'bocor' Rp{-theta/365:.3f} per hari)")
print(f"Vega   = {vega:.2f}  (opsi naik Rp{vega*0.01:.2f} per 1% vol naik)")
print()
print("Coba: T = 0.05 (5 hari lagi). Lihat theta meledak & gamma melonjak!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E11 — Financial Markets</span>
        <h1 className="display-title">Black-Scholes:<br />Mesin Harga Opsi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Berapa Harga Wajarnya?</a></li>
          <li><a href="#rumus">Rumus Black-Scholes — Lima Input</a></li>
          <li><a href="#iv">Implied Volatility — Membaca Pikiran Pasar</a></li>
          <li><a href="#greeks">Greeks — Panel Instrumen Opsi</a></li>
          <li><a href="#delta">Delta &amp; Gamma — Kecepatan &amp; Akselerasi</a></li>
          <li><a href="#theta">Theta — Bocor Waktu</a></li>
          <li><a href="#vega">Vega — Harga Ketakutan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Black-Scholes Pricer</a></li>
          <li><a href="#lab2">🔬 Lab 2: Bedah Greeks</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Greek Mana yang Dijaga</a></li>
          <li><a href="#case">📋 Mini-Case: Menjual Asuransi</a></li>
          <li><a href="#worked1">🔬 Worked Example: Tabel Arah — Lima Input, Lima Efek</a></li>
          <li><a href="#worked2">🔬 Worked Example: Delta Hedging — Menjinakkan Opsi</a></li>
          <li><a href="#konteks">🌍 Konteks: 1987 — Lahirnya Volatility Smile</a></li>
          <li><a href="#implvol">🔧 Pendalaman: Implied Vol — Membaca Ketakutan Pasar</a></li>
          <li><a href="#paritas">🔧 Pendalaman: Put-Call Parity — Persamaan yang Tak Bisa Bohong</a></li>
          <li><a href="#worked4">🔬 Worked Example: Arbitrase Paritas — Uang Gratis?</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan lima input Black-Scholes dan menghitung harga wajar call Eropa.</li>
          <li>Menghitung implied volatility dari harga pasar dan menginterpretasikannya.</li>
          <li>Mendefinisikan delta, gamma, theta, vega, rho beserta satuannya dan makna praktisnya.</li>
          <li>Menjelaskan bagaimana trader memakai Greeks untuk mengelola risiko posisi opsi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Berapa Harga Wajarnya?</h2>
      <div className="story">
        <p>Tahun 1973, dua ekonom <strong>Fischer Black</strong> &amp; <strong>Myron Scholes</strong> mempublikasikan rumus yang mengubah Wall Street: cara menghitung <strong>harga wajar opsi</strong>. Sebelumnya, harga opsi = tebakan bandar. Sesudahnya = sains (mereka meraih Nobel 1997; Black wafat duluan). Rumus ini begitu fundamental hingga setiap <em>trading screen</em> opsi di dunia menampilkannya — termasuk <strong>Greeks</strong>, panel instrumen risiko yang lahir dari rumus yang sama.</p>
        <p>Kabar baik: kamu tidak perlu menurunkan rumusnya (butuh kalkulus stokastik). Kamu perlu <strong>memahami inputnya, membaca outputnya, dan mengendarai Greeks-nya</strong> — persis seperti pilot tidak perlu merancang mesin pesawat.</p>
        <p><strong>Twist-nya:</strong> dari lima input rumus Black-Scholes, <strong>empat bisa dilihat</strong> — harga saham, strike, waktu, bunga. Hanya <strong>satu</strong> yang tidak bisa dilihat: volatilitas masa depan. Artinya seluruh &ldquo;tebakan&rdquo; pasar tentang masa depan — ketakutan, keserakahan, rumor — terkompresi menjadi <strong>satu angka misterius</strong>. Dan karena pasar mengkuotasi harga opsi setiap detik, kita bisa <em>membalik</em> rumusnya: dari harga pasar, mengintip <strong>berapa ketakutan yang sedang dihargai pasar</strong>. Itulah <em>implied volatility</em> — &ldquo;alat ukur ketakutan&rdquo; Wall Street, lahir dari rumus 1973 ini.</p>
      </div>

      <h2 id="rumus">Rumus Black-Scholes — Lima Input</h2>
      <p><strong>Definisi.</strong> Harga wajar <strong>call Eropa</strong> (exercise hanya saat kedaluwarsa, tanpa dividen):</p>
      <Tex math={String.raw`C = S \cdot N(d_1) - K e^{-rT} \cdot N(d_2)`} block />
      <Tex math={String.raw`d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)T}{\sigma\sqrt{T}}, \quad d_2 = d_1 - \sigma\sqrt{T}`} block />
      <p><strong>Artinya tiap simbol (lima input):</strong></p>
      <ul>
        <li><Tex math={String.raw`S`} />: harga saham kini — <strong>diketahui</strong></li>
        <li><Tex math={String.raw`K`} />: strike — <strong>diketahui</strong></li>
        <li><Tex math={String.raw`T`} />: sisa waktu (tahun) — <strong>diketahui</strong></li>
        <li><Tex math={String.raw`r`} />: risk-free rate — <strong>diketahui</strong></li>
        <li><Tex math={String.raw`\sigma`} />: <strong>volatilitas</strong> — <strong>TIDAK diketahui!</strong> (satu-satunya tebakan)</li>
        <li><Tex math={String.raw`N(\cdot)`} />: peluang kumulatif normal — &ldquo;berapa kemungkinan&rdquo; tertimbang</li>
      </ul>
      <p><strong>Intuisi rumus:</strong> harga call = <em>(nilai saham yang &ldquo;diperoleh&rdquo; jika opsi dieksekusi)</em> − <em>(PV strike yang &ldquo;dibayar&rdquo;)</em>, masing-masing <strong>dibobot peluang</strong>. <Tex math={String.raw`N(d_2)`} /> ≈ peluang opsi berakhir <em>in-the-money</em>; <Tex math={String.raw`N(d_1)`} /> = delta (di bawah).</p>
      <p><strong>Asumsi kunci</strong> (ingat keterbatasannya!): return lognormal, volatilitas <strong>konstan</strong>, tanpa biaya transaksi, bisa <em>hedge</em> kontinu. Dunia nyata melanggar semuanya — tapi rumus tetap jadi <strong>bahasa standar</strong> pasar.</p>

      <PlotlyChart
        data={callValueData}
        title="Nilai Call vs Harga Saham: Melengkung, Bukan Lurus (K=100)"
        layout={{ xaxis: { title: "Harga saham (S)" }, yaxis: { title: "Nilai call" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = nilai call <em>sebelum</em> jatuh tempo; garis abu putus-putus = payoff <em>saat</em> jatuh tempo (hoki E10).</p>
        <p><strong>Interpretasi:</strong> sebelum kedaluwarsa, nilai call <strong>melengkung mulus</strong> dan selalu <strong>di atas</strong> payoff jatuh tempo — selisihnya = <strong>time value</strong>. Opsi <em>out-of-the-money</em> (S=80) masih bernilai Rp1,8 — murni harapan (<em>time value</em> 100%). Makin dekat strike, makin curam kurvanya — di situlah <strong>gamma</strong> terbesar.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dari lima input, <strong>volatilitas (σ) adalah raja</strong>. S, K, T, r semuanya fakta — hanya σ yang opini. Naikkan σ 30% → 60%, harga call bisa <strong>dobel</strong>. Inilah mengapa trader opsi sebenarnya <strong>tidak trading arah harga — mereka trading volatilitas</strong>.</p>
      </div>

      <h2 id="iv">Implied Volatility — Membaca Pikiran Pasar</h2>
      <p><strong>Definisi.</strong> Balikkan Black-Scholes: diketahui harga pasar opsi (C), cari σ yang membuatnya cocok. Itulah <strong>implied volatility (IV)</strong> — <strong>volatilitas yang &ldquo;ditakuti/diharapkan&rdquo; pasar</strong> untuk sisa umur opsi.</p>
      <p><strong>Cara baca:</strong> IV 20% = pasar memprediksi saham bergerak ±20% (tahunan) ke depan. IV melonjak sebelum pemilu/laporan keuangan = pasar bersiap guncangan. Setelah peristiwa lewat → IV <strong>anjlok</strong> (<em>volatility crush</em>) — pembeli opsi yang &ldquo;benar arah&rdquo; pun bisa rugi karena premi menyusut!</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Prediksiku benar (saham naik), tapi opsi call-ku rugi. Pasar curang!&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kamu benar <em>arah</em> tapi kalah oleh <strong>volatility crush + time decay</strong>. Jika IV 60% sebelum pengumuman lalu anjlok ke 25% sesudahnya, premi bisa menyusut lebih cepat dari keuntungan arah. Pelajaran: <strong>jangan beli opsi mahal (IV tinggi) menjelang peristiwa</strong> — kamu membayar ekspektasi yang sudah &ldquo;terlalu mahal&rdquo;.</p>
      </div>

      <h2 id="greeks">Greeks — Panel Instrumen Opsi</h2>
      <p><strong>Definisi.</strong> <em>Greeks</em> = turunan harga opsi terhadap tiap input — <strong>panel dashboard risiko</strong> posisi opsimu:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Greek</th><th>Mengukur sensitivitas thd</th><th>Analogi</th></tr></thead>
          <tbody>
            <tr><td><strong>Delta (Δ)</strong></td><td>Harga saham (S)</td><td>Kecepatan</td></tr>
            <tr><td><strong>Gamma (Γ)</strong></td><td>Perubahan delta</td><td>Akselerasi</td></tr>
            <tr><td><strong>Theta (Θ)</strong></td><td>Waktu berlalu</td><td>Kebocoran bensin</td></tr>
            <tr><td><strong>Vega (ν)</strong></td><td>Volatilitas (σ)</td><td>Harga ketakutan</td></tr>
            <tr><td><strong>Rho (ρ)</strong></td><td>Suku bunga (r)</td><td>Efek samping kecil</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="delta">Delta &amp; Gamma — Kecepatan &amp; Akselerasi</h2>
      <Tex math={String.raw`\Delta = \frac{\partial C}{\partial S} = N(d_1)`} block />
      <p><strong>Artinya:</strong> delta = &ldquo;opsi naik berapa jika saham naik Rp1&rdquo;. Call: 0 s.d. 1. <strong>At-the-money</strong> ≈ 0,5. Deep in-the-money → ≈ 1 (bergerak seperti saham). Jauh out-of-the-money → ≈ 0 (tidak bergeming).</p>
      <p><strong>Kegunaan praktis — delta hedging:</strong> jual 1 call (delta −0,5)? Beli 0,5 saham → posisi <strong>delta-netral</strong> (kebal gerakan kecil saham). Inilah pekerjaan harian <em>market maker</em> opsi.</p>
      <Tex math={String.raw`\Gamma = \frac{\partial \Delta}{\partial S}`} block />
      <p><strong>Artinya:</strong> gamma = seberapa cepat delta berubah — <strong>terbesar di at-the-money menjelang kedaluwarsa</strong>. Gamma tinggi = delta hedging harus sering di-rebalance (mahal!) — tapi juga = potensi untung besar dari pergerakan.</p>

      <PlotlyChart
        data={deltaData}
        title="Delta Call: 0 → 1 Mengikuti Harga Saham"
        layout={{ xaxis: { title: "Harga saham (S)" }, yaxis: { title: "Delta" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu Y = delta (0–1). Kurva naik berbentuk S.</p>
        <p><strong>Interpretasi:</strong> jauh OTM (S=70) delta ≈ 0 — opsi &ldquo;mati rasa&rdquo;. Di strike (100) delta ≈ 0,58 dan <strong>kemiringannya tercuram</strong> = gamma maksimal di sini. Deep ITM (130) delta ≈ 1 — opsi = &ldquo;saham bersubsidi&rdquo;. Trader delta-neural <strong>menghindari</strong> zona gamma tinggi kecuali dibayar mahal.</p>
      </div>

      <h2 id="theta">Theta — Bocor Waktu</h2>
      <p><strong>Definisi.</strong> Theta = penurunan nilai opsi <strong>per hari</strong> berlalunya waktu (biasanya negatif untuk pembeli opsi):</p>
      <Tex math={String.raw`\Theta = \frac{\partial C}{\partial t} < 0 \quad \text{(untuk long opsi)}`} block />
      <p><strong>Artinya:</strong> opsi = <strong>es batu dijemur</strong> — meleleh tiap hari, makin cepat saat mendekati kedaluwarsa. Pembeli opsi <strong>berlomba dengan waktu</strong>; penjual opsi <strong>dibayar</strong> oleh waktu (theta positif bagi penjual).</p>

      <PlotlyChart
        data={thetaData}
        title="Time Decay: Es Batu Meleleh Makin Cepat (K=100, S=100)"
        layout={{ xaxis: { title: "Sisa hari", type: "log" }, yaxis: { title: "Nilai call" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = sisa hari (skala log), sumbu Y = nilai call at-the-money.</p>
        <p><strong>Interpretasi:</strong> dari 365 ke 100 hari nilai turun pelan (10,5 → 8,2); dari 20 ke 1 hari <strong>terjun</strong> (5,6 → 2,9). <strong>Pelajaran:</strong> membeli opsi yang tinggal 1–2 minggu = membeli es batu di gurun — butuh pergerakan <em>segera &amp; besar</em>, atau premi menguap.</p>
      </div>

      <h2 id="vega">Vega — Harga Ketakutan</h2>
      <Tex math={String.raw`\text{Vega} = \frac{\partial C}{\partial \sigma} > 0`} block />
      <p><strong>Artinya:</strong> vega = &ldquo;opsi naik berapa jika volatilitas naik 1%&rdquo;. <strong>Selalu positif</strong> untuk pembeli opsi (long call &amp; long put sama-sama suka volatilitas — ingat diagram hoki: makin liar gerakan, makin berharga opsinya).</p>
      <p><strong>Kepribadian vega:</strong> dia <em>detektor kepanikan</em> — saat pasar takut (VIX/IV melonjak), semua opsi mahal. Penjual opsi panen saat <strong>ketakutan mereda</strong> (vega + theta bekerja untuknya); pembeli opsi butuh ketakutan <strong>bertambah</strong>.</p>
      <p><strong>Rho</strong> (sensitivitas ke suku bunga) — kecil untuk opsi saham jangka pendek; penting untuk opsi suku bunga &amp; tenor panjang. Cukup tahu namanya di level ini.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi = taruhan arah harga.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> harga opsi digerakkan <strong>empat</strong> mesin: arah (delta), kecepatan perubahan arah (gamma), waktu (theta), dan volatilitas (vega). Trader profesional bisa untung <strong>tanpa menebak arah</strong> — misal menjual volatilitas mahal (short vega + theta positif) sambil delta-hedge. Opsi = instrumen <strong>multi-dimensi</strong>; yang hanya menebak arah baru memakai 1 dari 4 mesin.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Black-Scholes Pricer</h2>
      <p>Hitung harga wajar call dengan rumus Nobel. Ubah volatilitas dan saksikan &ldquo;raja input&rdquo; beraksi.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Black-Scholes"
        hint="Coba: sigma = 0.15 (tenang) vs 0.60 (panik). Lalu T = 0.1 (36 hari). Kombinasi sigma kecil + T pendek = opsi murah — kapan itu jebakan?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Bedah Greeks</h2>
      <p>Hitung keempat Greek sekaligus. Ubah sisa waktu dan lihat theta &amp; gamma meledak.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Greeks Lengkap"
        hint="Coba: T = 0.02 (~1 minggu). Theta harian & gamma melonjak — inilah 'zona berbahaya' bagi pembeli dan 'zona panen' bagi penjual opsi."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> hafalkan &ldquo;kartu identitas&rdquo; tiap Greek dalam satu kalimat: <strong>Delta</strong> = berapa saham sintetis kupegang. <strong>Gamma</strong> = seberapa sering aku harus rebalance. <strong>Theta</strong> = berapa bocor per hari. <strong>Vega</strong> = berapa untung jika pasar panik. Trader opsi profesional <strong>berpikir dalam Greeks</strong>, bukan dalam &ldquo;naik/turun&rdquo;.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Greek Mana yang Dijaga</h2>

      <div className="decision-card">
        <h3>1. Market maker / penjual opsi → <strong>Jaga delta netral, panen theta</strong></h3>
        <p><strong>Kondisi:</strong> bisnis menjual opsi secara sistematis.</p>
        <p><strong>Kenapa:</strong> delta-hedge tiap hari (kebal arah), biarkan time decay menggerogoti opsi yang dijual = profit. Risiko: gamma — gerakan besar mendadak.</p>
        <p><strong>Contoh nyata:</strong> desk opsi bank menjual call/put lalu hedge dengan saham.</p>
      </div>

      <div className="decision-card">
        <h3>2. Yakin ada guncangan besar (arah tidak tahu) → <strong>Beli volatilitas: long straddle (call+put)</strong></h3>
        <p><strong>Kondisi:</strong> peristiwa besar segera (pemilu, keputusan BI), arah tak jelas.</p>
        <p><strong>Kenapa:</strong> vega &amp; gamma positif — untung dari gerakan besar ke <em>arah mana pun</em>. Harga: theta negatif (bayar tiap hari) + butuh gerakan <em>melebihi</em> ekspektasi IV.</p>
        <p><strong>Contoh nyata:</strong> straddle menjelang pengumuman — hanya jika IV belum terlalu mahal.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pasar tenang, IV mahal → <strong>Jual volatilitas (short strangle, tertutup!)</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada katalis, premi opsi mahal.</p>
        <p><strong>Kenapa:</strong> theta + vega bekerja untuk penjual. <strong>Peringatan keras:</strong> short opsi telanjang = rugi tak terbatas — selalu batasi dengan spread/hedge.</p>
        <p><strong>Contoh nyata:</strong> iron condor institusi — bukan untuk pemula tanpa mentor.</p>
      </div>

      <div className="decision-card">
        <h3>4. Lindungi portofolio saham → <strong>Long put (bayar theta sebagai premi asuransi)</strong></h3>
        <p><strong>Kondisi:</strong> takut koreksi, tidak mau jual saham.</p>
        <p><strong>Kenapa:</strong> delta negatif put menetralkan sebagian delta saham; theta = biaya asuransi yang disadari.</p>
        <p><strong>Contoh nyata:</strong> protective put 3 bulanan yang di-roll tiap kuartal.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Lima input BS; σ satu-satunya opini</strong> — trader opsi = trader volatilitas.</li>
          <li><strong>Pembeli opsi dibayar arah; penjual dibayar waktu.</strong> Pilih sisi sesuai keunggulanmu.</li>
          <li><strong>IV tinggi + peristiwa dekat = jangan beli.</strong> Volatility crush memakan yang benar arah sekalipun.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Menjual Asuransi</h2>
      <div className="callout">
        <p>Reksa dana <strong>AMAN</strong> rutin <strong>menjual put</strong> indeks (tenor 1 bulan, 10% out-of-the-money). 11 bulan: premi masuk tiap bulan, return mulus 1,2%/bulan, Sharpe 2,8 — brosurnya memukau. Bulan ke-12: indeks anjlok 25% dalam sebulan. Put yang dijual dieksekusi — dana wajib membeli indeks di harga <em>jauh di atas</em> pasar.</p>
        <p><strong>Pertanyaan:</strong> (a) Profil Greek penjual put ini? (b) Mengapa Sharpe 2,8-nya menipu (ingat E7)? (c) Pelajaran untuk investor yang tergiur &ldquo;return mulus&rdquo;?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Theta positif</strong> (panen time decay), <strong>vega negatif</strong> (rugi saat panik/IV melonjak), <strong>gamma negatif</strong> (delta makin negatif saat pasar jatuh — kerugian <em>berakselerasi</em>), delta positif kecil. Klasik <strong>short-volatility</strong>.</p>
          <p>(b) Sharpe memakai <strong>volatilitas historis</strong> — 11 bulan tenang = vol rendah = Sharpe tinggi. Ia <strong>buta</strong> terhadap ekor kiri yang memang <em>belum terjadi</em> di sampel. Inilah &ldquo;menjual asuransi&rdquo; dari E7: <strong>return mulus = premi risiko ekor</strong>, bukan keahlian.</p>
          <p>(c) <strong>Tanya distribusi return lengkap + skenario stres</strong>, bukan Sharpe. &ldquo;Return mulus&rdquo; tanpa penjelasan <em>dari mana</em> = curigai sebagai premi risiko tersembunyi. Minta: MaxDD historis strategi <em>sejenis</em>, bukan cuma dana ini.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Tabel Arah — Apa yang Terjadi Jika Satu Input Berubah?</h2>
      <p>Call MAJU: S = Rp1.500, K = Rp1.500 (<em>at-the-money</em>), T = 3 bulan, r = 6%, σ = 40% &rarr; harga model ≈ <strong>Rp147</strong> (ilustratif). Ubah <strong>satu</strong> input, tahan lainnya:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Input berubah</th><th>Harga call</th><th>Harga put</th><th>Greek-nya</th></tr></thead>
        <tbody>
          <tr><td>S naik → 1.600</td><td>↑ ~Rp205</td><td>↓</td><td><strong>Delta</strong> (+)</td></tr>
          <tr><td>T 3 → 6 bulan</td><td>↑ ~Rp208</td><td>↑</td><td><strong>Theta</strong> (−, waktu = uang)</td></tr>
          <tr><td>σ 40% → 60%</td><td>↑ ~Rp215</td><td>↑</td><td><strong>Vega</strong> (+)</td></tr>
          <tr><td>r 6% → 9%</td><td>↑ sedikit</td><td>↓ sedikit</td><td><strong>Rho</strong> (kecil)</td></tr>
          <tr><td>K naik (OTM)</td><td>↓</td><td>↑</td><td>—</td></tr>
        </tbody>
      </table>
      </div>
      <details className="worked">
        <summary>📐 Intuisi tiap baris (klik untuk buka)</summary>
        <p><strong>Delta:</strong> call = &ldquo;bayangan&rdquo; saham — S naik Rp100, call naik ~Rp58 (delta ~0,58). Put bergerak <em>berlawanan</em> (delta negatif).</p>
        <p><strong>Theta:</strong> waktu = peluang. Makin lama expiry, makin besar peluang saham bergerak jauh &rarr; <strong>opsi lebih mahal</strong>. Berlalunya waktu <em>menggerogoti</em> pembeli opsi (theta negatif) dan <em>memberi makan</em> penjualnya.</p>
        <p><strong>Vega:</strong> ketidakpastian = nilai. σ naik &rarr; peluang gerakan besar naik &rarr; <strong>call DAN put sama-sama naik</strong> (keduanya &ldquo;membeli ketidakpastian&rdquo;). Inilah kenapa harga opsi meledak sebelum pengumuman penting (laporan keuangan, pemilu).</p>
        <p><strong>Rho:</strong> efek bunga kecil untuk opsi pendek — jangan overthinking; fokus ke delta, theta, vega.</p>
        <p><strong>Aturan 10 detik:</strong> <em>&ldquo;S↑ call↑ put↓ &bull; T↑ keduanya↑ &bull; σ↑ keduanya↑&rdquo;</em> — hafalkan ini, kamu sudah lebih paham opsi dari 90% trader ritel.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Delta Hedging — Cara Market Maker Tidur Nyenyak</h2>
      <p>Market maker <strong>menjual</strong> 10 kontrak call MAJU (1 kontrak = 100 lembar &rarr; 1.000 lembar), delta per opsi = <strong>0,55</strong>. Ia tidak mau bertaruh arah — ia ingin <em>netral</em>. Apa yang ia lakukan?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Eksposur:</strong> short 1.000 call × delta 0,55 = eksposur setara <strong>short 550 lembar saham</strong> (jika saham naik Rp1, ia rugi ~Rp550).</p>
        <p><strong>Langkah 2 — Hedge:</strong> <strong>beli 550 lembar saham</strong> di pasar. Kini: saham naik Rp100 &rarr; rugi opsi ~55.000, untung saham +55.000 = <strong>netral</strong>. ✓</p>
        <p><strong>Langkah 3 — Masalahnya:</strong> delta <em>berubah</em> tiap harga bergerak (itulah <strong>gamma</strong>!). Saham naik ke 1.600 &rarr; delta menjadi 0,70 &rarr; hedge butuh 700 lembar &rarr; <strong>beli lagi 150 lembar</strong> (di harga yang <em>sudah naik</em> — &ldquo;membeli mahal&rdquo;).</p>
        <p><strong>Langkah 4 — Polanya:</strong> saham naik &rarr; beli; saham turun &rarr; jual (delta turun &rarr; kurangi hedge). <strong>Beli mahal, jual murah — terus-menerus!</strong> Kerugian rebalancing inilah &ldquo;harga&rdquo; yang dibayar market maker — dan ia menagihnya via <strong>spread bid-ask opsi</strong> (E1!).</p>
        <p><strong>Intuisi besar:</strong> inilah <em>jiwa</em> Black-Scholes — harga opsi = <strong>biaya replikasi</strong> via delta-hedging dinamis. Rumus 1973 itu pada dasarnya menghitung &ldquo;berapa biaya strategi beli-mahal-jual-murah ini sampai expiry&rdquo;. Paham ini = paham kenapa volatilitas (σ) adalah input kuncinya: <strong>makin liar harga, makin mahal biaya hedging-nya</strong>.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 1987 — Hari Ketika Model Bertemu Realitas</h2>
      <p><strong>19 Oktober 1987 (<em>Black Monday</em>):</strong> Dow Jones jatuh <strong>−22,6% dalam sehari</strong> — kejatuhan harian terbesar sepanjang sejarah. Model Black-Scholes mengasumsikan return <strong>terdistribusi normal</strong> (lonceng simetris, E7!) — peristiwa 22-sigma seperti ini &ldquo;seharusnya&rdquo; tidak terjadi sekali pun sejak alam semesta ada.</p>
      <ul>
        <li><strong>Lahirnya <em>volatility smile</em>:</strong> setelah 1987, pasar mulai menghargai opsi put jauh (<em>out-of-the-money</em>) <strong>lebih mahal</strong> dari prediksi model — membentuk kurva &ldquo;senyum&rdquo; saat implied vol diplot terhadap strike. Pasar <em>belajar</em>: kejatuhan ekstrem lebih mungkin dari teori. Model tidak dibuang — ia <strong>dikalibrasi dengan ketakutan</strong>.</li>
        <li><strong>LTCM 1998</strong> (disinggung di E7): memakai model canggih termasuk keturunan Black-Scholes — bangkrut karena model mengasumsikan <strong>likuiditas selalu ada untuk hedging</strong>. Delta-hedging Worked 2 <em>butuh</em> pasar yang berfungsi; saat semua menjual bersamaan, &ldquo;beli 150 lembar&rdquo; tidak bisa dieksekusi di harga wajar.</li>
      </ul>
      <p><strong>Pelajaran model-risk:</strong> Black-Scholes = <strong>peta, bukan wilayah</strong>. Peta yang sangat berguna (seluruh industri mengkuotasi dalam &ldquo;bahasa vol&rdquo;), tapi: (1) ia meremehkan ekor (fat tails); (2) ia butuh σ konstan — padahal vol <em>berubah-ubah</em>; (3) ia butuh hedging kontinu — padahal pasar tutup &amp; melompat. Gunakan untuk <strong>kuotasi &amp; perbandingan relatif</strong>, bukan sebagai kebenaran.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> praktisi tidak berkata &ldquo;opsi ini harganya Rp147&rdquo; — mereka berkata &ldquo;opsi ini diperdagangkan pada <strong>vol 42%</strong>&rdquo;. Harga (rupiah) = vol × model. Mengkuotasi dalam vol membuat perbandingan <em>antar strike &amp; expiry</em> jadi bermakna: vol 42% vs 38% langsung terbaca &ldquo;yang ini lebih mahal&rdquo; — seperti membandingkan harga beras per kg, bukan per karung yang ukurannya beda-beda.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Black-Scholes memberi harga yang <em>benar</em>.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Black-Scholes memberi harga yang <strong>konsisten</strong> — bukan benar. Ia mesin penerjemah: vol → harga. Jika input vol-nya salah (tebakan!), outputnya salah dengan presisi tinggi. Pasar tahu ini — makanya ia <em>membalik</em> mesinnya: dari harga pasar → implied vol, lalu bertanya <em>&ldquo;apakah vol ini masuk akal?&rdquo;</em> Model = alat ukur, bukan peramal.</p>
      </div>

      <h2 id="implvol">🔧 Pendalaman: Implied Vol — Satu Angka, Seribu Cerita</h2>
      <p>Mekanikanya sederhana: masukkan harga opsi <em>yang diobservasi di pasar</em> ke rumus Black-Scholes, lalu pecahkan untuk σ — itulah <strong>implied volatility</strong>: &ldquo;volatilitas yang <em>sedang dihargai</em> pasar&rdquo;.</p>
      <ul>
        <li><strong>Contoh membaca:</strong> call MAJU diperdagangkan Rp180 (bukan Rp147 model @ σ=40%) &rarr; implied vol ≈ <strong>52%</strong>. Artinya: pasar menghargai <em>ketidakpastian lebih besar</em> dari vol historis 40% — mungkin ada pengumuman laba minggu depan, atau rumor akuisisi.</li>
        <li><strong>VIX — &ldquo;indeks ketakutan&rdquo;:</strong> VIX = implied vol 30-hari opsi S&amp;P 500, dikuadratkan &amp; diannualisasi. VIX 15 = pasar tenang; VIX 40+ = panik (2008: 80; COVID Mar 2020: 85). Trader memakai VIX sebagai <strong>termometer sentimen global</strong> — termasuk untuk aset Indonesia (korelasi ketakutan itu global).</li>
        <li><strong>Strategi dari sini:</strong> <em>volatility trading</em> — jika kamu yakin vol <em>realisasi</em> nanti &lt; implied vol hari ini &rarr; <strong>jual opsi</strong> (pungut premi kemahalan). Jika sebaliknya &rarr; <strong>beli opsi</strong>. Ini taruhan <em>kedua</em> yang terpisah dari arah harga — dan justru di sinilah banyak desk opsi mencari makan.</li>
      </ul>
      <p><strong>Peringatan jujur:</strong> implied vol tinggi ≠ &ldquo;pasti akan liar&rdquo; — ia = &ldquo;pasar <em>membayar mahal</em> untuk proteksi&rdquo;. Kadang pasar benar (krisis datang), kadang overpay (pengumuman ternyata adem). Edge-nya ada bagi yang bisa membedakan <em>ketakutan beralasan</em> vs <em>ketakutan berlebihan</em> — skill yang sama dengan membedah spread di E5!</p>


      <h2 id="paritas">🔧 Pendalaman: Put-Call Parity — Satu Persamaan, Empat Instrumen</h2>
      <p>Hubungan arbitrase paling elegan di derivatif — <strong>put-call parity</strong> (untuk opsi Eropa, saham tanpa dividen):</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`C - P = S - K e^{-rT}`} block /></p>
      <p>Dibaca sebagai <strong>resep masak</strong>:</p>
      <ul>
        <li><strong>Beli call + jual put</strong> (kiri: <Tex math={String.raw`C - P`} />) = <strong>persis</strong> seperti <strong>memegang saham + meminjam PV strike</strong> (kanan). Kenapa? Saat expiry: jika S &gt; K: call untung (S−K), put hangus → net S−K. Jika S &lt; K: call hangus, put rugi −(K−S) → net S−K. <strong>Identik</strong> dengan (saham − utang K) di semua skenario!</li>
        <li><strong>Konsekuensi 1 — <em>synthetic</em>:</strong> tidak bisa beli sahamnya (misal dibatasi regulasi)? <strong>Rakit</strong> dari call − put + obligasi! Desk derivatif menciptakan eksposur &ldquo;saham&rdquo; dari opsi setiap hari.</li>
        <li><strong>Konsekuensi 2 — arbitrase:</strong> jika pasar melanggar paritas (kiri ≠ kanan) &rarr; <strong>cuan bebas risiko</strong> dengan membeli yang murah &amp; menjual yang mahal (lihat Worked!). Inilah &ldquo;polisi&rdquo; yang menjaga harga opsi tetap waras.</li>
        <li><strong>Konsekuensi 3 — intuisi:</strong> call &amp; put bukan dua hal terpisah — mereka <strong>terikat</strong> oleh paritas. Naiknya harga call (misal karena S naik) <em>menekan</em> harga put lewat arbitrase. <strong>Empat instrumen, satu harga.</strong></li>
      </ul>
      <h2 id="worked4">🔬 Worked Example: Menangkap Pelanggaran Paritas</h2>
      <p>Data pasar: S = Rp1.500, K = Rp1.500, T = 1 tahun, r = 6%. Call diperdagangkan <strong>Rp200</strong>, put <strong>Rp100</strong>. Cek paritas &amp; rancang arbitrase jika dilanggar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai wajar paritas:</strong> <Tex math={String.raw`C - P`} /> seharusnya = <Tex math={String.raw`S - Ke^{-rT}`} /> = 1.500 − 1.500×e<sup>−0,06</sup> = 1.500 − 1.500×0,9418 = 1.500 − 1.412,6 = <strong>Rp87,4</strong>.</p>
        <p><strong>Langkah 2 — Bandingkan:</strong> pasar: C − P = 200 − 100 = <strong>Rp100</strong> &gt; 87,4 &rarr; <strong>paritas dilanggar</strong> (call kemahalan relatif terhadap put, selisih Rp12,6).</p>
        <p><strong>Langkah 3 — Arbitrase:</strong> jual yang mahal (call Rp200), beli yang murah (put Rp100) + beli saham (Rp1.500) + pinjam PV(K) = Rp1.412,6. Arus kas hari ini: +200 − 100 − 1.500 + 1.412,6 = <strong>+Rp12,6</strong> (masuk kantong!). Saat expiry, semua posisi <strong>saling meniadakan persis</strong> (paritas!) &rarr; Rp12,6 = <strong>cuan bebas risiko</strong>.</p>
        <p><strong>Kenapa pelanggaran ini jarang &amp; kecil:</strong> ratusan algoritma memindai paritas <strong>setiap milidetik</strong> — pelanggaran &gt;Rp1 langsung diserbu. Yang tersisa untuk manusia: <strong>memahami</strong> paritas (untuk valuasi &amp; synthetics), bukan <strong>mengeksploitasinya</strong> (sudah diambil mesin). Pelajaran umum: <strong>semakin sederhana arbitrasenya, semakin cepat mesin mengambilnya.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi itu zero-sum, jadi tidak ada nilai ekonominya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>payoff</em>-nya zero-sum (untung A = rugi B), tapi <strong>nilainya positif</strong> — seperti asuransi (premi yang dibayar &ldquo;hilang&rdquo; jika tidak klaim, tapi ketenangannya nyata!). Opsi memindahkan risiko dari yang <strong>tidak bisa menanggungnya</strong> (petani, CFO) ke yang <strong>dibayar untuk menanggungnya</strong> (market maker, spekulan). <strong>Zero-sum dalam uang ≠ zero-sum dalam kesejahteraan.</strong> Inilah pembelaan ekonomi seluruh industri derivatif.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Mesin Harga Opsi (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Dari 5 input Black-Scholes, mana yang TIDAK bisa diobservasi langsung?"
        options={[
          "Harga saham (S)",
          "Strike (K)",
          "Volatilitas (σ) — harus diestimasi/diimplikasikan dari pasar",
          "Sisa waktu (T)",
        ]}
        correct={2}
        explanation="Benar: σ. S, K, T, r semuanya fakta pasar/kontrak. Volatilitas masa depan = satu-satunya opini — makanya trader opsi = trader volatilitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Implied volatility (IV) 60% artinya…"
        options={[
          "Saham pasti naik 60%",
          "Pasar memprediksi/menakuti pergerakan ±60% (tahunan) ke depan",
          "Opsi pasti untung",
          "Volatilitas historis 60%",
        ]}
        correct={1}
        explanation="Benar: ekspektasi pasar forward-looking, BUKAN historis dan BUKAN arah. IV tinggi = premi mahal = pembeli butuh gerakan ekstra besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kamu LONG call. Theta harian −Rp50 ribu. Artinya…"
        options={[
          "Untung Rp50 ribu per hari",
          "Rugi Rp50 ribu per hari hanya karena waktu berlalu (ceteris paribus)",
          "Delta berubah",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar: time decay. Opsi meleleh tiap hari — pembeli berlomba dengan waktu, penjual dipanen waktu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Market maker menjual call lalu membeli 0,5 saham per kontrak (delta 0,5). Tujuannya?"
        options={[
          "Spekulasi saham naik",
          "Delta hedging: netral terhadap gerakan kecil harga saham",
          "Menambah return",
          "Menghindari pajak",
        ]}
        correct={1}
        explanation="Benar: delta-netral. Market maker tidak menebak arah — ia memanen spread/theta sambil kebal guncangan kecil. Gamma menentukan seberapa sering rebalance."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Strategi 'jual put rutin' punya Sharpe 2,8 selama 11 bulan. Penilaian tepat?"
        options={[
          "Luar biasa — langsung investasi",
          "Curigai: profil short-volatility (theta+, vega−, gamma−); Sharpe buta terhadap ekor yang belum terjadi",
          "Sharpe tidak relevan",
          "Pasti penipuan",
        ]}
        correct={1}
        explanation="Benar: curigai. Return mulus = premi risiko ekor tersembunyi. Minta distribusi lengkap + skenario stres sebelum percaya angka Sharpe."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Black-Scholes</strong>: C = S·N(d₁) − K·e<sup>−rT</sup>·N(d₂); lima input, <strong>σ satu-satunya opini</strong>.</li>
          <li><strong>Implied volatility</strong> = ekspektasi pasar forward-looking; jangan beli opsi saat IV mahal menjelang peristiwa.</li>
          <li><strong>Delta</strong> = kecepatan (hedge ratio); <strong>Gamma</strong> = akselerasi (terbesar ATM dekat expiry).</li>
          <li><strong>Theta</strong> = bocor waktu (pembeli membayar, penjual memanen).</li>
          <li><strong>Vega</strong> = sensitivitas ke volatilitas; pembeli opsi <em>suka</em> kepanikan.</li>
          <li>Trader opsi profesional <strong>berpikir dalam Greeks</strong> — bukan sekadar &ldquo;naik/turun&rdquo;.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e10-derivatif" className="btn btn-secondary btn-sm">← E10</Link>
        <Link href="/learn/e12-fx-suku-bunga" className="btn btn-primary btn-sm">Next: E12 →</Link>
      </div>
    </div>
  );
}
