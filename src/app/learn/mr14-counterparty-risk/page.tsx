"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

export default function MR14Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Exposure profile: EE dan PFE swap suku bunga sepanjang tenor
  const r = rng(14);
  const T = 20; // tahun
  const times = Array.from({ length: T * 4 + 1 }, (_, i) => +(i / 4).toFixed(2));
  // EE: ekspektasi nilai positif (hump-shaped untuk swap)
  const EE = times.map((t) => +(8 * Math.sqrt(t) * Math.exp(-t / 12)).toFixed(2));
  // PFE 95%: EE + 1.65*sd
  const PFE = times.map((t, i) => +(EE[i] + 1.65 * 4 * Math.sqrt(t) * Math.exp(-t / 20)).toFixed(2));

  const expData = [
    { x: times, y: EE, type: "scatter", mode: "lines", name: "Expected Exposure (EE)", line: { color: "#2a7de1", width: 2.5 }, fill: "tozeroy", fillcolor: "rgba(42,125,225,0.15)" },
    { x: times, y: PFE, type: "scatter", mode: "lines", name: "PFE 95%", line: { color: "#ef4444", width: 2, dash: "dash" } },
  ];

  // Netting benefit: gross vs net exposure
  const netData = [
    {
      x: ["Tanpa netting (gross)", "Dengan netting", "Netting + collateral"],
      y: [100, 45, 12],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#2a7de1"] },
    },
  ];

  const lab1Code = String.raw`# EXPOSURE PROFILE: simulasi nilai swap & hitung EE/PFE.
# Swap: terima fixed 5%, bayar floating, notional 100, tenor 5 tahun.
# Nilai swap berubah dgn suku bunga -> exposure = max(nilai, 0).

import random, math
random.seed(14)

notional = 100.0
years, steps = 5, 20
dt = years / steps
sims, paths = 2000, []

for _ in range(sims):
    r_rate, vals = 0.05, []
    for i in range(steps + 1):
        # suku bunga acak (random walk sederhana)
        r_rate += random.gauss(0, 0.008) * math.sqrt(dt)
        # nilai swap ~ (fixed - floating) * duration sisa (aproksimasi)
        dur_sisa = years - i * dt
        val = notional * (0.05 - r_rate) * dur_sisa * 0.9
        vals.append(max(val, 0))  # exposure: hanya nilai positif!
    paths.append(vals)

EE = [sum(p[i] for p in paths) / sims for i in range(steps + 1)]
def pct(xs, p):
    s = sorted(xs); k = (len(s)-1)*p; f = math.floor(k)
    return s[f] + (s[f+1]-s[f])*(k-f)
PFE = [pct([p[i] for p in paths], 0.95) for i in range(steps + 1)]

print(f"{'Tahun':>5s} {'EE':>7s} {'PFE95':>7s}")
for i in range(0, steps + 1, 4):
    print(f"{i*dt:>5.1f} {EE[i]:>7.2f} {PFE[i]:>7.2f}")
print()
print("Bentuk 'punuk' (hump): exposure naik dulu (ketidakpastian menumpuk),")
print("lalu turun (tenor tersisa menipis). Puncak = titik risiko maksimum.")`;

  const lab2Code = String.raw`# CVA: CVA = LGD * sum(EE_t * PD_t)
# Contoh: EE dari Lab 1 (disederhanakan), PD dari credit spread counterparty.
# PD implisit ~ spread / LGD (aproksimasi hazard rate).

EE_profile = [0, 2.1, 3.8, 4.9, 5.2, 4.8, 4.0, 3.1, 2.2, 1.4, 0.7]  # tahun 0..10
spread_bps = 200   # credit spread counterparty
LGD = 0.6          # loss given default 60%
hazard = (spread_bps / 10000) / LGD  # hazard rate tahunan ~ PD

import math
cva, surv = 0.0, 1.0
print(f"{'Thn':>3s} {'EE':>6s} {'PD_marginal':>11s} {'Kontribusi':>10s}")
for t in range(1, len(EE_profile)):
    pd_marg = surv * (1 - math.exp(-hazard))  # prob default di tahun t
    contrib = LGD * EE_profile[t] * pd_marg
    cva += contrib
    surv *= math.exp(-hazard)
    if t % 2 == 1 or t == len(EE_profile) - 1:
        print(f"{t:>3d} {EE_profile[t]:>6.1f} {pd_marg:>11.4f} {contrib:>10.3f}")
print(f"\nCVA = {cva:.2f} (per 100 notional) -> {cva:.2%} dari notional")
print()
print("Coba: spread 200 -> 800 bps (counterparty sekarat). CVA jadi?")
print("CVA naik -> nilai derivatif TURUN -> P&L negatif hari ini juga,")
print("walau counterparty BELUM default! (CVA risk)")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR14 — Market Risk Analytics</span>
        <h1 className="display-title">Counterparty Risk:<br />Saat Lawan Transaksimu yang Gagal Bayar</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Keuntungan yang Menguap</a></li>
          <li><a href="#exposure">Exposure: EE dan PFE</a></li>
          <li><a href="#cva">CVA: Harga Risiko Counterparty</a></li>
          <li><a href="#netting">Netting &amp; Collateral: Perisai Ganda</a></li>
          <li><a href="#www">Wrong-Way Risk: Korelasi yang Mematikan</a></li>
          <li><a href="#saccr">SA-CCR: Cara Standar Basel</a></li>
          <li><a href="#lab1">🔬 Lab 1: Profil EE/PFE Swap</a></li>
          <li><a href="#lab2">🔬 Lab 2: Hitung CVA</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: AIG — Ketika Penjual Proteksi Butuh Ditalangi</a></li>
          <li><a href="#case">📋 Mini-Case: CVA yang Memakan Laba</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa derivatif OTC punya risiko counterparty yang tidak dimiliki obligasi — dan mengapa exposure-nya berubah terhadap waktu.</li>
          <li>Menghitung dan menafsirkan Expected Exposure (EE) dan Potential Future Exposure (PFE) dari profil nilai derivatif.</li>
          <li>Menghitung CVA dari rumus <Tex math={String.raw`\text{CVA} = LGD \sum EE_t \cdot PD_t`} /> dan menjelaskan mengapa CVA bergerak sebelum default terjadi.</li>
          <li>Menjelaskan mekanisme netting dan collateral (CSA) dalam menekan exposure — dengan angka.</li>
          <li>Mengidentifikasi wrong-way risk (umum &amp; spesifik) dan menjelaskan mengapa ia dilipatgandakan risikonya.</li>
          <li>Menjelaskan kerangka SA-CCR (replacement cost + PFE add-on) sebagai pendekatan standar Basel.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Keuntungan yang Menguap</h2>
      <div className="story">
        <p>Bank memiliki portofolio swap suku bunga dengan sebuah perusahaan energi — nilai mark-to-market <strong>menguntungkan bank Rp80 miliar</strong>. Di laporan, itu keuntungan. Di sistem, itu piutang.</p>
        <p>Perusahaan energi itu gagal bayar. Bank tidak menerima Rp80 miliar — malah harus <strong>mengganti posisi swap itu di pasar</strong> dengan biaya Rp80 miliar (replacement cost). Keuntungan berubah menjadi kerugian <strong>dalam semalam</strong>, tanpa ada pergerakan pasar sama sekali.</p>
        <p>Twist-nya: risiko ini <strong>tidak terlihat di VaR pasar</strong> — VaR mengukur pergerakan harga, bukan kebangkrutan lawan transaksi. Dan lebih licik lagi: <strong>exposure-nya berubah setiap hari</strong> mengikuti harga pasar. Hari ini Rp80 miliar, bulan depan bisa Rp20 miliar atau Rp150 miliar — tergantung pasar. Inilah <strong>counterparty credit risk (CCR)</strong>: risiko kredit yang <em>menari mengikuti pasar</em>.</p>
      </div>

      <h2 id="exposure">Exposure: EE dan PFE</h2>
      <p><strong>Definisi.</strong> Jika counterparty default <em>hari ini</em>, kerugian bank = <strong>nilai positif</strong> derivatif saat ini (yang negatif = bank yang berutang → tidak rugi). Karena nilai berubah, exposure masa depan adalah <strong>distribusi</strong>:</p>
      <ul>
        <li><strong>EE_t (Expected Exposure):</strong> rata-rata nilai positif di waktu-t: <Tex math={String.raw`EE_t = E[\max(V_t, 0)]`} />.</li>
        <li><strong>PFE_t (Potential Future Exposure):</strong> kuantil tinggi (misal 95%) nilai positif di waktu-t — &ldquo;skenario buruk&rdquo; exposure.</li>
        <li><strong>EPE:</strong> rata-rata EE sepanjang hidup transaksi (untuk modal).</li>
      </ul>
      <p><strong>Bentuk khas profil swap:</strong> <strong>punuk (hump)</strong> — naik dulu (ketidakpastian menumpuk seiring waktu), lalu turun (tenor tersisa menipis → nilai konvergen ke nol). Puncak punuk = titik risiko maksimum.</p>

      <PlotlyChart
        data={expData}
        title="Profil Exposure Swap 5 Tahun: EE vs PFE 95%"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Exposure" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu-x = waktu (tahun), sumbu-y = exposure. Biru = EE (rata-rata), merah putus-putus = PFE 95% (skenario buruk).</p>
        <p><strong>Interpretasi:</strong> keduanya membentuk <strong>punuk</strong> dengan puncak sekitar tahun ke-2–3 — di sinilah bank paling rentan jika counterparty default. <strong>EE</strong> dipakai untuk <strong>CVA/pricing</strong> (ekspektasi kerugian); <strong>PFE</strong> untuk <strong>limit</strong> (batas eksposur maksimum yang ditoleransi). Jangan tertukar: limit pakai PFE (konservatif), harga pakai EE (ekspektasi).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> exposure derivatif ≠ exposure kredit biasa. Kredit Rp100 M = exposure Rp100 M (tetap, menurun saat diangsur). Swap Rp100 M notional = exposure <strong>berubah-ubah</strong>, bisa 0, bisa Rp15 M — tergantung pasar. Inilah mengapa CCR butuh <strong>simulasi Monte Carlo</strong> (seperti Lab 1), bukan sekadar baca baki debet.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif dengan nilai nol tidak punya risiko counterparty.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> nilai <em>kini</em> nol ≠ exposure <em>masa depan</em> nol. Swap yang ATM hari ini bisa bernilai +Rp50 M bulan depan jika suku bunga bergerak. <strong>PFE selalu positif</strong> untuk derivatif — risiko counterparty ada sejak hari pertama, bahkan saat mark-to-market nol.</p>
      </div>

      <h2 id="cva">CVA: Harga Risiko Counterparty</h2>
      <p><strong>Definisi.</strong> <strong>CVA (Credit Valuation Adjustment)</strong> = penyesuaian <em>negatif</em> ke nilai derivatif untuk mencerminkan kemungkinan counterparty default:</p>
      <Tex math={String.raw`\text{CVA} = LGD \sum_{t} EE_t \cdot PD_t`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`LGD`} />: loss given default (misal 60% — tidak semua hilang saat default)</li>
        <li><Tex math={String.raw`EE_t`} />: expected exposure di waktu-t</li>
        <li><Tex math={String.raw`PD_t`} />: probabilitas default <em>marginal</em> di periode-t (dari credit spread / CDS)</li>
      </ul>
      <p><strong>Nilai wajar derivatif</strong> = nilai bebas-risiko − CVA. Dan ada keluarganya (<strong>XVA</strong>):</p>
      <ul>
        <li><strong>DVA:</strong> penyesuaian untuk risiko default <em>bank sendiri</em> (kontroversial — &ldquo;untung saat sekarat&rdquo;).</li>
        <li><strong>FVA:</strong> biaya pendanaan (funding) untuk posisi derivatif.</li>
        <li><strong>MVA/KVA:</strong> biaya margin / modal.</li>
      </ul>
      <p><strong>Poin kritis — CVA risk:</strong> CVA berubah <strong>setiap hari</strong> mengikuti (1) EE (pasar bergerak) dan (2) <strong>credit spread counterparty</strong>. Spread melebar → PD naik → CVA naik → <strong>nilai derivatif turun → P&amp;L negatif hari ini</strong>, <em>padahal counterparty belum default!</em> Inilah yang memakan laba di mini-case bawah — dan mengapa Basel mengenakan <strong>capital charge khusus untuk CVA risk</strong>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> CVA membuat risiko kredit <strong>masuk ke P&amp;L harian</strong> — jembatan antara credit risk dan market risk. Desk XVA modern me-<em>manage</em> CVA seperti portofolio pasar: hedge dengan CDS, hitung VaR-nya. Jika kamu hanya memikirkan CVA sebagai &ldquo;cadangan akuntansi&rdquo;, kamu ketinggalan satu dekade.</p>
      </div>

      <h2 id="netting">Netting &amp; Collateral: Perisai Ganda</h2>
      <p><strong>Netting:</strong> jika ada 3 transaksi dengan counterparty yang sama (nilai +100, −60, +30), tanpa netting exposure = 100 + 30 = <strong>130</strong>. Dengan <strong>master agreement</strong> (ISDA) yang enforceable: exposure = max(100 − 60 + 30, 0) = <strong>70</strong>. Penghematan 46% — <em>gratis</em>, hanya butuh dokumen hukum yang benar.</p>
      <p><strong>Collateral (CSA):</strong> margin harian — pihak yang &ldquo;kalah&rdquo; menyetor jaminan (kas/obligasi). Dengan threshold nol + margin harian, exposure tersisa ≈ <strong>pergerakan 1 hari</strong> (margin period of risk), bukan seluruh nilai.</p>

      <PlotlyChart
        data={netData}
        title="Dampak Netting & Collateral ke Exposure (indeks: gross=100)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Exposure" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = exposure dalam tiga kondisi mitigasi.</p>
        <p><strong>Interpretasi:</strong> netting memangkas exposure <strong>55%</strong> (100 → 45); collateral memangkas lagi ke <strong>12</strong> — total reduksi <strong>88%</strong>. <strong>Pelajaran:</strong> mitigasi CCR <em>paling murah</em> adalah <strong>hukum + operasional</strong> (ISDA + CSA yang rapi), bukan modal. Bank dengan CSA berantakan membayar risiko yang sebenarnya bisa dihindari dengan dokumen.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Ada collateral = tidak ada risiko counterparty.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> collateral mengurangi, tidak menghilangkan. Sisa risiko: <strong>gap risk</strong> (nilai melompat di antara margin call — misal default di akhir pekan), <strong>collateral tak likuid</strong> (jaminan obligasi yang ikut jatuh), dan <strong>sengketa valuasi</strong> (margin call yang diperebutkan). Jangan nol-kan CVA hanya karena ada CSA.</p>
      </div>

      <h2 id="www">Wrong-Way Risk: Korelasi yang Mematikan</h2>
      <p><strong>Definisi.</strong> <strong>Wrong-way risk (WWR)</strong> = exposure <strong>naik</strong> tepat ketika probabilitas default counterparty <strong>naik</strong> — korelasi yang melipatgandakan kerugian:</p>
      <ul>
        <li><strong>Specific WWR:</strong> hubungan langsung &amp; jelas. Contoh: bank menjual CDS proteksi ke perusahaan — lalu <strong>menjual proteksi atas perusahaan itu sendiri</strong> ke counterparty yang sama? Contoh klasik: swap dengan perusahaan minyak di mana bank <em>menerima fixed</em> — saat harga minyak jatuh, nilai swap menguntungkan bank (exposure naik) <strong>dan</strong> perusahaan minyak sekarat (PD naik). <strong>Dilarang keras</strong> oleh regulator untuk modal internal.</li>
        <li><strong>General WWR:</strong> hubungan makro. Contoh: krisis negara → mata uang jatuh (exposure FX naik) <em>dan</em> semua perusahaan negara itu sekarat (PD naik bersamaan).</li>
      </ul>
      <p><strong>Kenapa mematikan:</strong> rumus CVA <Tex math={String.raw`LGD \sum EE_t \cdot PD_t`} /> mengasumsikan EE dan PD <strong>independen</strong>. Dengan WWR, keduanya naik bersamaan → kerugian aktual = <strong>perkalian dua kenaikan</strong>, bukan penjumlahan. CVA standar <em>underestimate sistematis</em>.</p>
      <p><strong>Penanganan:</strong> identifikasi eksplisit (daftar transaksi WWR), <strong>stress test</strong> khusus (skenario &ldquo;exposure &amp; PD naik bersamaan&rdquo;), limit terpisah, dan untuk specific WWR: <strong>tolak transaksinya</strong>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> WWR adalah <strong>korelasi antara &ldquo;berapa banyak mereka berutang padamu&rdquo; dan &ldquo;seberapa mungkin mereka kabur&rdquo;</strong>. Tanya untuk setiap counterparty besar: &ldquo;skenario apa yang membuat mereka berutang besar padaku <em>dan</em> sekarat bersamaan?&rdquo; Jika jawabannya mudah ditemukan — kamu punya WWR.</p>
      </div>

      <h2 id="saccr">SA-CCR: Cara Standar Basel</h2>
      <p><strong>Definisi.</strong> <strong>SA-CCR (Standardised Approach for Counterparty Credit Risk)</strong> = cara standar Basel menghitung <strong>EAD</strong> (exposure at default) untuk modal:</p>
      <Tex math={String.raw`\text{EAD} = 1{,}4 \times (\text{RC} + \text{PFE})`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`RC`} /> (Replacement Cost): max(nilai kini − collateral, 0) — &ldquo;berapa biaya mengganti posisi <em>hari ini</em>&rdquo;.</li>
        <li><Tex math={String.raw`PFE`} />: add-on = <strong>multiplier × notional × faktor supervisory</strong> — &ldquo;cadangan untuk pergerakan masa depan&rdquo;. Faktor supervisory beda per kelas aset (FX 4%, suku bunga 0,5%, ekuitas 32%...).</li>
        <li><Tex math={String.raw`1{,}4`} />: faktor alpha — &ldquo;margin of conservatism&rdquo; regulator.</li>
      </ul>
      <p><strong>Kapan dipakai:</strong> bank tanpa izin model internal (IMM) <em>wajib</em> pakai SA-CCR untuk modal. Bahkan bank ber-IMM pun memakai SA-CCR sebagai <strong>floor</strong> (output floor Basel III).</p>
      <p><strong>Intuisi:</strong> SA-CCR = &ldquo;EE/PFE versi sederhana&rdquo; — tidak perlu simulasi Monte Carlo, cukup nilai kini + add-on berbasis notional. Kasar tapi transparan dan bisa diaudit — itulah yang diinginkan regulator untuk bank kecil/menengah.</p>

      <h2 id="lab1">🔬 Lab 1: Profil EE/PFE Swap</h2>
      <p>Ubah volatilitas suku bunga (0,008 → 0,02). Bagaimana punuk EE/PFE berubah? Di tahun berapa puncak risikonya?</p>
      <PyodideLab
        title="Lab 1 — Simulasi Exposure Profile"
        hint="Coba vol 0.02 (pasar liar): punuk LEBIH TINGGI dan puncaknya LEBIH AWAL. Kenapa? Ketidakpastian menumpuk lebih cepat."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Hitung CVA</h2>
      <p>Ubah spread (200 → 800 bps). Amati: CVA naik berapa kali lipat? Dan ingat — ini mengurangi nilai derivatif <em>hari ini</em>.</p>
      <PyodideLab
        title="Lab 2 — CVA = LGD × Σ EE × PD"
        hint="Coba spread 1500bps (distressed): CVA bisa > 5% notional. Bandingkan dengan margin keuntungan tipis derivatif — CVA bisa menghapus seluruh P&L bisnis!"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Limit eksposur counterparty → <strong>PFE (bukan nilai kini!)</strong></h3>
        <p><strong>Kondisi:</strong> penetapan batas per counterparty.</p>
        <p><strong>Alasan:</strong> nilai kini bisa nol sementara PFE positif besar. Limit berbasis mark-to-market = pintu terbuka untuk risiko masa depan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Pricing derivatif OTC → <strong>Kurangkan CVA (+ FVA/MVA/KVA sesuai kebijakan)</strong></h3>
        <p><strong>Kondisi:</strong> kuotasi harga ke nasabah.</p>
        <p><strong>Alasan:</strong> harga tanpa XVA = memberi diskon risiko ke nasabah. Desk yang tidak charge CVA mensubsidi risiko bank.</p>
      </div>

      <div className="decision-card">
        <h3>3. Mitigasi termurah → <strong>Netting (ISDA) + Collateral (CSA) yang rapi</strong></h3>
        <p><strong>Kondisi:</strong> selalu — sebelum bicara modal.</p>
        <p><strong>Alasan:</strong> reduksi 88% di contoh bukan dari model canggih, melainkan dokumen + operasional. Audit CSA-mu sebelum menambah modal.</p>
      </div>

      <div className="decision-card">
        <h3>4. Deteksi WWR → <strong>Daftar + stress khusus + tolak specific WWR</strong></h3>
        <p><strong>Kondisi:</strong> review portofolio counterparty berkala.</p>
        <p><strong>Alasan:</strong> CVA standar buta terhadap WWR. Satu transaksi specific-WWR bisa lebih berbahaya dari 100 transaksi biasa.</p>
      </div>

      <div className="decision-card">
        <h3>5. Modal regulasi (tanpa IMM) → <strong>SA-CCR: 1,4 × (RC + PFE add-on)</strong></h3>
        <p><strong>Kondisi:</strong> perhitungan ATMR untuk CCR.</p>
        <p><strong>Alasan:</strong> standar, transparan, diaudit. Pahami komponennya — RC dari nilai kini, PFE dari notional × faktor supervisory.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Limit</strong> pakai PFE; <strong>harga</strong> pakai EE (CVA).</li>
          <li><strong>Dokumen dulu</strong> (ISDA/CSA) sebelum model canggih.</li>
          <li><strong>Cari WWR</strong> di setiap counterparty besar — korelasi yang melipatgandakan.</li>
          <li>CVA bergerak <strong>sebelum</strong> default — kelola seperti risiko pasar.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: AIG — Ketika Penjual Proteksi Butuh Ditalangi</h2>
      <p>Kasus counterparty risk terbesar dalam sejarah: <strong>AIG</strong>. Perusahaan asuransi raksasa yang unit derivatifnya (AIG Financial Products) menjual <strong>CDS proteksi senilai ~US$440 miliar</strong> — lalu hampir menyeret seluruh sistem keuangan dunia saat harus membayar. Ditambah contoh hitung CVA lengkap dan pelajaran wrong-way risk.</p>

      <h3>Apa yang dilakukan AIG FP</h3>
      <p>AIG FP menjual <strong>credit default swaps</strong> — asuransi terhadap gagal bayar — atas tranche super-senior CDO. Logikanya: tranche super-senior &ldquo;tidak mungkin&rdquo; rugi (terlindungi 15–20% tranche di bawahnya), jadi preminya adalah &ldquo;uang gratis&rdquo;. Masalahnya berlapis:</p>
      <ol>
        <li><strong>Korelasi salah:</strong> model mengasumsikan default antar hipotek <strong>tidak berkorelasi tinggi</strong>. Saat harga rumah jatuh <em>nasional</em>, default berkorelasi → kerugian menembus ke tranche super-senior.</li>
        <li><strong>Collateral trigger:</strong> kontrak CDS mewajibkan AIG menyetor <strong>kolateral</strong> jika peringkat kreditnya turun <em>atau</em> nilai pasar CDS bergerak melawannya. September 2008: peringkat AIG dipangkas → <strong>margin call US$ puluhan miliar dalam hitungan hari</strong> — krisis likuiditas, bukan (semula) solvabilitas.</li>
        <li><strong>Too interconnected to fail:</strong> lawan AIG adalah <em>semua</em> bank besar dunia. Jika AIG default, lindung nilai (hedge) mereka hilang → kerugian CDS mereka terealisasi → keruntuhan berantai. Inilah <strong>risiko sistemik counterparty</strong>: bukan satu bank yang gagal, melainkan <em>jaring pengaman</em> seluruh sistem yang robek.</li>
      </ol>
      <p>Talangan: <strong>US$182 miliar</strong> dari pemerintah AS — terbesar dalam sejarah saat itu. Ironisnya, sebagian besar uang talangan <strong>diteruskan ke counterparty AIG</strong> (Goldman Sachs dkk. dibayar penuh atas kontrak CDS-nya) — memicu perdebatan publik yang masih hidup hingga kini.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: CVA kontrak swap 3 tahun (klik untuk buka)</summary>
        <p><strong>Skenario.</strong> Bank punya interest rate swap dengan korporasi X (notional Rp1 T). Profil eksposur (EE) dan PD marginal tahunan X:</p>
        <p>Tahun 1: EE = Rp20 M, PD = 1,0% &nbsp;|&nbsp; Tahun 2: EE = Rp35 M, PD = 1,5% &nbsp;|&nbsp; Tahun 3: EE = Rp25 M, PD = 2,0%. LGD = 60%.</p>
        <p><strong>Langkah 1 — CVA:</strong> <Tex math={String.raw`\text{CVA} = 0{,}6 \times (20 \times 0{,}01 + 35 \times 0{,}015 + 25 \times 0{,}02)\text{ M}`} /></p>
        <p><strong>Langkah 2 — hitung:</strong> <Tex math={String.raw`= 0{,}6 \times (0{,}2 + 0{,}525 + 0{,}5)\text{ M} = 0{,}6 \times 1{,}225\text{ M} = \text{Rp}735\text{ juta}`} />.</p>
        <p><strong>Langkah 3 — bandingkan dengan nilai swap:</strong> jika nilai bebas-risiko swap = Rp15 M (positif bagi bank), nilai wajar = 15 − 0,735 = <strong>Rp14,265 M</strong>. CVA &ldquo;memakan&rdquo; ~5% nilai.</p>
        <p><strong>Langkah 4 — CVA risk:</strong> misal spread kredit X melebar 2× (krisis sektoral) → PD ≈ 2× → CVA ≈ <strong>Rp1,47 M</strong> — nilai swap turun Rp735 jt <strong>hari ini</strong>, tanpa ada default, tanpa ada perubahan suku bunga! Inilah P&amp;L CVA yang &ldquo;memakan laba&rdquo; di mini-case.</p>
        <p><strong>Angka ini artinya:</strong> CVA mengubah <strong>risiko kredit menjadi P&amp;L pasar harian</strong>. Desk XVA yang baik me-hedge ini — misal membeli proteksi CDS atas X. Biaya hedge ≈ CVA itu sendiri (tidak ada makan siang gratis); keputusannya adalah <em>apakah mau membayar premi untuk tidur nyenyak</em>.</p>
      </details>

      <h3>Wrong-way risk: musuh dalam selimut</h3>
      <p><strong>Definisi.</strong> <strong>Wrong-way risk (WWR)</strong> = eksposur ke counterparty <strong>membesar tepat saat</strong> probabilitas default-nya naik. Korelasi yang mematikan:</p>
      <ul>
        <li><strong>Contoh klasik:</strong> bank menjual CDS proteksi ke <em>bank lain di negara yang sama</em> atas obligasi pemerintah negara itu. Saat krisis sovereign: nilai CDS melonjak (eksposur besar) <em>dan</em> counterparty (bank domestik) ikut sekarat. Proteksi yang dibeli justru gagal saat dibutuhkan — seperti membeli asuransi kebakaran dari tetangga yang rumahnya ikut terbakar.</li>
        <li><strong>AIG sebagai WWR sistemik:</strong> bank-bank membeli proteksi CDS dari AIG atas aset yang <em>berkorelasi dengan kesehatan AIG sendiri</em> (pasar kredit AS). Saat pasar kredit runtuh, tagihan ke AIG membesar bersamaan dengan kemampuan AIG membayar yang runtuh.</li>
      </ul>
      <p><strong>Respons regulasi:</strong> Basel mengenakan <strong>multiplier 1,25×</strong> untuk eksposur dengan WWR yang teridentifikasi, dan FRTB/SA-CCR mewajibkan bank mengidentifikasi dan melaporkan WWR spesifik. Aturan praktis analis: setiap kali melihat eksposur besar ke satu counterparty, tanyakan <em>&ldquo;apakah saya untung besar tepat saat dia sekarat?&rdquo;</em> — jika ya, itu bukan aset, itu <strong>ilusi</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sudah ada kolateral, jadi aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> kolateral mengurangi <em>besar</em> eksposur, bukan menghilangkannya. Ada <strong>margin period of risk</strong> (10–20 hari: antara margin call terakhir dan likuidasi agunan saat default — di mana pasar bisa bergerak liar), <strong>risiko agunan</strong> (nilai kolateral ikut jatuh — <em>collateral wrong-way</em>), dan <strong>risiko operasional</strong> (sengketa valuasi menunda margin call — persis yang terjadi antara bank-bank dan AIG/Lehman). Kolateral adalah sabuk pengaman, bukan dinding beton.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pikirkan risiko counterparty sebagai <strong>opsi jual (put) yang kamu berikan gratis ke lawanmu</strong> — ia hanya &ldquo;dieksekusi&rdquo; (default) saat keadaannya buruk, yang biasanya berkorelasi dengan keadaan burukmu juga. CVA adalah <em>harga</em> opsi gratis itu. Bank yang tidak menghitung CVA sedang <strong>memberikan asuransi gratis</strong> — dan seperti AIG, suatu hari tagihannya datang sekaligus.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: kekuatan netting — mengapa ISDA master agreement menyelamatkan miliaran (klik untuk buka)</summary>
        <p><strong>Tanpa netting:</strong> Bank vs Counterparty X punya 3 swap: nilai +Rp80 M, −Rp50 M, +Rp30 M. Eksposur (hanya yang positif dihitung!) = 80 + 30 = <strong>Rp110 M</strong>.</p>
        <p><strong>Dengan netting (ISDA):</strong> eksposur = max(80 − 50 + 30, 0) = <strong>Rp60 M</strong> — <strong>hemat 45%</strong>.</p>
        <p><strong>Saat default (pelajaran Lehman 2008):</strong> tanpa netting, likuidator mengklaim <em>penuh</em> atas swap yang menguntungkan mereka (+110 M) tapi hanya membayar <em>pro-rata</em> (misal 20%) atas yang merugikan (−50 M × 20% = −10 M) → bank terima 110 − 10 = Rp100 M dari klaim bersih seharusnya 60 M... <strong>terbalik</strong>: bank justru <em>dirugikan</em> Rp40 M oleh ketiadaan netting (<em>cherry-picking</em> oleh likuidator).</p>
        <p><strong>Pelajaran:</strong> netting bukan &ldquo;optimasi&rdquo; — ia adalah <strong>pertahanan hukum</strong> terhadap cherry-picking saat counterparty default. Inilah mengapa enforceabilitas netting diuji oleh tim hukum di <em>setiap</em> yurisdiksi (opini hukum ISDA) — karena di hari-H, yang menyelamatkanmu bukan model, melainkan <strong>kontrak</strong>.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Swap 2 tahun: EE₁=Rp30 M (PD 2%), EE₂=Rp20 M (PD 3%), LGD 60%. Hitung CVA. Jika spread counterparty melebar 3×, berapa CVA baru? (klik untuk pembahasan)</summary>
        <p><strong>CVA</strong> = 0,6 × (30×0,02 + 20×0,03) jt = 0,6 × (0,6 + 0,6) jt = <strong>Rp720 jt</strong>.</p>
        <p><strong>Spread 3×</strong> → PD ≈ 3× → CVA ≈ <strong>Rp2,16 M</strong>. Nilai derivatif turun Rp1,44 M <strong>tanpa default, tanpa pergerakan pasar</strong> — murni repricing risiko kredit. Inilah <strong>CVA risk</strong> yang dikenai capital charge Basel.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Bank membeli proteksi CDS dari bank domestik atas obligasi pemerintah domestik. Identifikasi wrong-way risk-nya dan usulkan 2 mitigasi. (klik untuk pembahasan)</summary>
        <p><strong>WWR:</strong> saat krisis sovereign → nilai proteksi (eksposur) melonjak <em>bersamaan</em> dengan peluang default penjual proteksi (bank domestik ikut terpukul krisis yang sama). Proteksi gagal tepat saat dibutuhkan.</p>
        <p><strong>Mitigasi:</strong> (1) beli proteksi dari <strong>counterparty yang tidak berkorelasi</strong> (bank asing / diversifikasi); (2) minta <strong>kolateral dinamis</strong> (margin harian + haircut) — mengurangi eksposur bersih; (3) kenakan <strong>add-on modal WWR</strong> (multiplier 1,25×) agar biayanya terlihat. Prinsip: <em>jangan beli asuransi kebakaran dari tetangga yang rumahnya menempel rumahmu</em>.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Mengapa AIG butuh talangan US$182 M padahal &ldquo;hanya&rdquo; menjual asuransi (CDS)? Jawab dengan rantai 3 langkah. (klik untuk pembahasan)</summary>
        <p><strong>(1) Model salah:</strong> korelasi default diasumsikan rendah (Gaussian copula — MR18) → premi terlalu murah untuk risiko sebenarnya. <strong>(2) Collateral trigger:</strong> kontrak mewajibkan setor kolateral saat peringkat turun / MTM negatif → downgrade Sep 2008 memicu <strong>margin call puluhan miliar USD dalam hitungan hari</strong> — krisis <em>likuiditas</em>. <strong>(3) Too interconnected:</strong> lawan = semua bank besar → default AIG = keruntuhan sistemik → pemerintah <em>terpaksa</em> menalangi. Pelajaran: <strong>risiko counterparty terbesar bukan yang paling berisiko — melainkan yang paling terhubung</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: CVA yang Memakan Laba</h2>
      <div className="callout">
        <p>Desk derivatif melaporkan laba tahunan <strong>Rp120 miliar</strong> dari bisnis swap korporasi. Lalu tim XVA menghitung:</p>
        <ul>
          <li>CVA portofolio awal tahun: <strong>Rp40 miliar</strong>; akhir tahun: <strong>Rp95 miliar</strong> (spread counterparty melebar dari 150bp ke 400bp)</li>
          <li>Kenaikan CVA <strong>Rp55 miliar</strong> = <strong>kerugian P&amp;L</strong> (CVA naik → nilai derivatif turun)</li>
          <li>Laba &ldquo;ekonomis&rdquo; sebenarnya: 120 − 55 = <strong>Rp65 miliar</strong> — hampir separuhnya hilang!</li>
          <li>Bonus trader sudah dibayar berdasarkan Rp120 miliar…</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apakah Rp120 miliar &ldquo;salah&rdquo;? (b) Bagaimana seharusnya insentif dirancang? (c) Apa yang bisa dilakukan desk untuk mengelola CVA?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Rp120 M bukan salah — tapi tidak lengkap.</strong> Itu laba <em>sebelum</em> biaya risiko counterparty. Seperti melaporkan laba dagang tanpa mengurangi biaya sewa. CVA adalah <strong>biaya ekonomi nyata</strong> (pasar menagihnya via spread), bukan cadangan akuntansi fiktif.</p>
          <p>(b) <strong>Insentif benar:</strong> bonus berbasis <strong>P&amp;L setelah XVA</strong> (net of CVA/FVA). Jika trader tahu CVA memakan bonusnya, ia akan: memilih counterparty berkualitas, meminta collateral lebih, atau me-hedge CVA dengan CDS. <strong>Insentif membentuk perilaku</strong> — ukur yang benar, dapatkan perilaku yang benar.</p>
          <p>(c) <strong>Kelola CVA aktif:</strong> (1) <strong>hedge</strong> dengan CDS / contingent CDS; (2) <strong>renegosiasi CSA</strong> (threshold lebih rendah, margin lebih sering); (3) <strong>novasi</strong> ke CCP (central clearing — netting multilateral!); (4) <strong>kurangi tenor</strong> eksposur ke counterparty lemah. Desk XVA modern melakukan semuanya — CVA bukan takdir, melainkan portofolio yang dikelola.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Swap bernilai NOL hari ini. Apakah ada risiko counterparty?"
        options={[
          "Tidak — nilainya nol",
          "Ya — PFE selalu positif: nilai bisa menjadi positif di masa depan; risiko ada sejak hari pertama",
          "Hanya jika tenor > 10 tahun",
          "Hanya untuk FX",
        ]}
        correct={1}
        explanation="Benar. Nilai kini = snapshot; PFE = distribusi masa depan. Swap ATM hari ini punya PFE positif — inilah mengapa limit memakai PFE, bukan mark-to-market."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Untuk LIMIT counterparty, metrik yang tepat?"
        options={[
          "Nilai mark-to-market kini",
          "PFE (skenario buruk masa depan) — limit harus menahan exposure maksimum yang ditoleransi",
          "EE",
          "Notional",
        ]}
        correct={1}
        explanation="Benar. Limit = batas toleransi skenario buruk → PFE. EE untuk pricing (ekspektasi). Notional untuk swap tidak menggambarkan exposure sama sekali."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. CVA naik Rp55 M dalam setahun padahal tidak ada default. Dampak ke P&L?"
        options={[
          "Tidak ada — belum ada default",
          "Rugi Rp55 M — CVA naik = nilai derivatif turun; CVA risk terealisasi via spread, bukan via default",
          "Untung Rp55 M",
          "Ditunda sampai default",
        ]}
        correct={1}
        explanation="Benar. CVA adalah harga pasar risiko counterparty — ia bergerak dengan spread. Inilah 'CVA risk' yang dikenai capital charge Basel."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Bank menerima fixed dari perusahaan minyak saat harga minyak jatuh. Ini adalah?"
        options={[
          "Right-way risk",
          "Specific wrong-way risk — exposure naik (swap makin untung) tepat saat PD counterparty naik (minyak jatuh)",
          "Tidak ada risiko",
          "Basis risk",
        ]}
        correct={1}
        explanation="Benar. Korelasi langsung antara exposure dan PD — melipatgandakan kerugian. Specific WWR dilarang untuk modal internal; transaksi seperti ini harus ditolak/direstrukturisasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dengan ISDA netting + CSA yang rapi, exposure bisa turun?"
        options={[
          "Tidak berubah",
          "Drastis (contoh: 88%) — mitigasi termurah adalah hukum + operasional, bukan model canggih",
          "Naik",
          "Hanya 1%",
        ]}
        correct={1}
        explanation="Benar. Netting ~55% + collateral sisanya. Sebelum investasi model mahal, audit dulu: apakah semua counterparty punya ISDA/CSA yang enforceable dan operasional margin berjalan?"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. SA-CCR: EAD = 1,4 × (RC + PFE). Komponen 1,4 adalah?"
        options={[
          "Suku bunga",
          "Faktor alpha — margin of conservatism regulator atas ketidakpastian model",
          "Jumlah counterparty",
          "Probabilitas default",
        ]}
        correct={1}
        explanation="Benar. Alpha 1,4 adalah 'bantalan' regulator — pengakuan bahwa pendekatan standar pun punya ketidakpastian. RC = biaya ganti hari ini, PFE = add-on masa depan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>CCR</strong> = risiko kredit yang menari mengikuti pasar; tak terlihat di VaR pasar.</li>
          <li><strong>EE</strong> (rata-rata, untuk pricing/CVA) vs <strong>PFE</strong> (kuantil buruk, untuk limit). Profil swap = punuk.</li>
          <li><strong>CVA</strong> = <Tex math={String.raw`LGD\sum EE_t \cdot PD_t`} /> — bergerak dengan spread <em>sebelum</em> default; kelola seperti risiko pasar.</li>
          <li><strong>XVA</strong>: DVA, FVA, MVA, KVA — biaya ekonomi nyata, masukkan ke pricing &amp; insentif.</li>
          <li><strong>Netting + collateral</strong> = mitigasi termurah (reduksi bisa 88%).</li>
          <li><strong>Wrong-way risk</strong> = korelasi exposure–PD yang melipatgandakan; specific WWR = tolak.</li>
          <li><strong>SA-CCR</strong>: EAD = 1,4 × (RC + PFE add-on) — standar Basel untuk modal.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr13-risiko-likuiditas" className="btn btn-secondary btn-sm">← MR13</Link>
        <Link href="/learn/mr15-model-stokastik" className="btn btn-primary btn-sm">Next: MR15 →</Link>
      </div>
    </div>
  );
}
