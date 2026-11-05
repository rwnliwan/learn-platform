"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E3Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const compoundData = [
    {
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [100, 108, 116.6, 126, 136, 146.9, 158.7, 171.4, 185.1, 199.9, 215.9],
      mode: "lines+markers",
      name: "Bunga majemuk 8%",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      y: [100, 108, 116, 124, 132, 140, 148, 156, 164, 172, 180],
      mode: "lines+markers",
      name: "Bunga sederhana 8%",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const npvProfileData = [
    {
      x: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      y: [150, 117, 89, 64, 42, 23, 6, -9, -22, -34, -44],
      mode: "lines+markers",
      name: "NPV (Rp jt)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Mesin waktu uang: PV & FV
# Pilih: Rp100 jt SEKARANG atau Rp140 jt 5 tahun lagi? Suku bunga 8%.
pv_now = 100_000_000
fv_future = 140_000_000
n = 5
r = 0.08

# Cara 1: majukan Rp100 jt ke masa depan
fv_dari_now = pv_now * (1 + r) ** n
# Cara 2: mundurkan Rp140 jt ke masa kini
pv_dari_future = fv_future / (1 + r) ** n

print(f"Rp100 jt sekarang -> 5 thn lagi = Rp{fv_dari_now/1e6:.1f} jt")
print(f"Rp140 jt (5 thn lagi) nilainya kini = Rp{pv_dari_future/1e6:.1f} jt")
print()
print("Keputusan:", "AMBIL SEKARANG" if pv_now > pv_dari_future else "TUNGGU 5 TAHUN")
print()
print("Coba: r = 0.05 (bunga turun). Apakah keputusan berubah?")`;

  const lab2Code = `# Lab 2 — Duel NPV vs IRR: proyek mana yang menang?
# Proyek A: kecil, cepat. Proyek B: besar, lambat. Hanya boleh pilih SATU.
cf_a = [-100, 60, 60, 60]          # investasi 100, terima 60/thn x3
cf_b = [-500, 150, 150, 150, 150, 150]  # investasi 500, terima 150/thn x5

def npv(cf, r):
    return sum(c / (1 + r) ** t for t, c in enumerate(cf))

def irr(cf):
    lo, hi = -0.9, 5.0
    for _ in range(100):
        mid = (lo + hi) / 2
        if npv(cf, mid) > 0: lo = mid
        else: hi = mid
    return (lo + hi) / 2

r = 0.10
print(f"Diskonto {r*100:.0f}%:")
print(f"  Proyek A: NPV = Rp{npv(cf_a, r):.1f} jt | IRR = {irr(cf_a)*100:.1f}%")
print(f"  Proyek B: NPV = Rp{npv(cf_b, r):.1f} jt | IRR = {irr(cf_b)*100:.1f}%")
print()
print("IRR A > IRR B, tapi NPV B > NPV A. Pilih mana?")
print("Jawaban: NPV — karena yang masuk kantong adalah RUPIAH, bukan persen.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E3 — Financial Markets</span>
        <h1 className="display-title">Time Value of Money:<br />Rp1 Juta Hari Ini ≠ Rp1 Juta Tahun Depan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp100 Juta atau Rp140 Juta?</a></li>
          <li><a href="#fv">Future Value — Si Pengganda Sabar</a></li>
          <li><a href="#pv">Present Value — Mesin Waktu Mundur</a></li>
          <li><a href="#anuitas">Anuitas — Cicilan &amp; Pensiun</a></li>
          <li><a href="#ear">EAR — Bunga yang Jujur</a></li>
          <li><a href="#npv">NPV — Apakah Proyek Ini Untung?</a></li>
          <li><a href="#irr">IRR — Persen yang Menipu</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mesin Waktu Uang</a></li>
          <li><a href="#lab2">🔬 Lab 2: Duel NPV vs IRR</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Rumus Mana untuk Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Warung Kopi Rina</a></li>
          <li><a href="#worked1">🔬 Worked Example: Cicilan KPR Rp500 Juta</a></li>
          <li><a href="#worked2">🔬 Worked Example: 12% vs 12,5% — Jebakan Bunga Nominal</a></li>
          <li><a href="#worked3">🔬 Worked Example: Berapa Nilai Pensiunmu Hari Ini?</a></li>
          <li><a href="#konteks">🌍 Konteks: Saat Bunga 70% dan Saat Bunga Negatif</a></li>
          <li><a href="#diskonto">🔧 Pendalaman: Bunga = Harga Waktu</a></li>
          <li><a href="#wacc">🔧 Pendalaman: Memilih Discount Rate — Dari SBN ke WACC</a></li>
          <li><a href="#worked4">🔬 Worked Example: NPV Proyek — Layak atau Tidak?</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung future value dan present value untuk arus kas tunggal maupun anuitas, dengan penjelasan tiap simbol.</li>
          <li>Membedakan bunga nominal dan EAR — dan menghitung biaya pinjaman yang sebenarnya.</li>
          <li>Menghitung NPV dan IRR sebuah proyek serta menjelaskan kapan IRR menyesatkan.</li>
          <li>Memutuskan &ldquo;ambil sekarang atau nanti&rdquo; secara kuantitatif, bukan berdasarkan firasat.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp100 Juta atau Rp140 Juta?</h2>
      <div className="story">
        <p>Pak Haji menawarkan: <em>&ldquo;Pilih — Rp100 juta cash sekarang, atau Rp140 juta lima tahun lagi.&rdquo;</em> Temanmu langsung teriak: <em>&ldquo;140 juta dong, lebih besar 40 juta!&rdquo;</em> Tapi kamu ingat deposito memberi 8% per tahun. Kamu hitung: Rp100 juta × (1,08)<sup>5</sup> = <strong>Rp146,9 juta</strong>. Ternyata Rp100 juta sekarang <em>lebih berharga</em> dari Rp140 juta lima tahun lagi!</p>
        <p>Temanmu tidak salah hitung — dia salah <strong>konsep</strong>: membandingkan dua angka dari <em>waktu berbeda</em> tanpa menyamakan &ldquo;zona waktunya&rdquo; dulu. Itulah <em>time value of money</em>: fondasi seluruh keuangan modern, dari harga obligasi (E4) sampai valuasi saham (E6).</p>
        <p><strong>Twist-nya:</strong> temanmu tidak salah hitung — 140 memang lebih besar dari 100. Ia salah <strong>dimensi</strong>: membandingkan dua angka yang hidup di &ldquo;zona waktu&rdquo; berbeda tanpa menyamakannya dulu, seperti membandingkan 5 kg dengan 7 liter lalu menyimpulkan 7 &ldquo;lebih besar&rdquo;. Uang punya dimensi waktu, dan <strong>bunga adalah kurs tukar antar zona waktu</strong>. Begitu kamu menguasainya, setiap harga di keuangan — obligasi, saham, proyek — berubah menjadi satu pertanyaan sederhana: <em>berapa nilainya jika dibawa ke hari ini?</em></p>
      </div>

      <h2 id="fv">Future Value — Si Pengganda Sabar</h2>
      <p><strong>Definisi.</strong> <em>Future value</em> (FV) = nilai uangmu di masa depan setelah berbunga selama <Tex math={String.raw`n`} /> periode:</p>
      <Tex math={String.raw`FV = PV \times (1+r)^n`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`PV`} /> (<em>present value</em>): uang yang kamu tanam hari ini</li>
        <li><Tex math={String.raw`r`} />: suku bunga per periode (dalam desimal: 8% = 0,08)</li>
        <li><Tex math={String.raw`n`} />: jumlah periode (harus <strong>satu satuan</strong> dengan <Tex math={String.raw`r`} /> — bunga tahunan → n dalam tahun!)</li>
        <li><Tex math={String.raw`(1+r)^n`} />: <strong>faktor pengganda</strong> — &ldquo;bunga-berbunga&rdquo; (<em>compounding</em>)</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Rp10 juta, bunga 10%/tahun, 3 tahun:</p>
        <p><strong>Langkah 1</strong> — tulis rumusnya: <Tex math={String.raw`FV = 10 \times (1{,}10)^3`} /> juta.<br />
        <strong>Langkah 2</strong> — hitung pangkat: 1,10³ = 1,331.<br />
        <strong>Langkah 3</strong> — kalikan: 10 × 1,331 = <strong>Rp13,31 juta</strong>.</p>
        <p>Bunga sederhana hanya memberi Rp13 juta (10 + 3×1). Selisih Rp0,31 juta = &ldquo;bunga dari bunga&rdquo; — kecil di 3 tahun, <strong>raksasa</strong> di 30 tahun (lihat grafik).</p>
      </details>
      <p><strong>Kepribadian FV:</strong> dia seperti <em>bola salju</em> — awalnya lambat, tapi makin besar makin cepat menggelinding. Tahun-tahun awal terasa membosankan; keajaiban terjadi di tahun-tahun akhir.</p>
      <p><strong>Kapan memakai:</strong> &ldquo;tabunganku jadi berapa N tahun lagi?&rdquo;, proyeksi dana pensiun, membandingkan imbal hasil investasi.</p>

      <PlotlyChart
        data={compoundData}
        title="Bola Salju: Bunga Majemuk vs Bunga Sederhana (Rp100 jt, 8%)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Nilai (Rp jt)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = tahun, sumbu Y = nilai uang. Garis biru = bunga majemuk, garis abu putus-putus = bunga sederhana.</p>
        <p><strong>Interpretasi:</strong> 5 tahun pertama keduanya mirip. Setelah itu garis biru <strong>melengkung ke atas</strong> (eksponensial) dan meninggalkan garis lurus. Di tahun ke-10 selisihnya Rp35,9 juta — dari modal yang sama dan bunga &ldquo;sama&rdquo; 8%! <strong>Pelajaran:</strong> waktu adalah sekutu terbesar investor; menunda 10 tahun tidak bisa dikejar dengan &ldquo;bunga lebih tinggi sedikit&rdquo;.</p>
      </div>

      <h2 id="pv">Present Value — Mesin Waktu Mundur</h2>
      <p><strong>Definisi.</strong> <em>Present value</em> (PV) = nilai <em>hari ini</em> dari uang yang diterima di masa depan. Kebalikan dari FV — tinggal dibalik:</p>
      <Tex math={String.raw`PV = \frac{FV}{(1+r)^n}`} block />
      <p><strong>Artinya tiap simbol:</strong> sama seperti FV, hanya arahnya mundur. Penyebut <Tex math={String.raw`(1+r)^n`} /> kini disebut <strong>faktor diskonto</strong> — &ldquo;berapa rupiah hari ini yang setara dengan Rp1 di masa depan&rdquo;.</p>
      <p><strong>Contoh:</strong> Rp140 juta 5 tahun lagi, diskonto 8%: PV = 140 / 1,08⁵ = 140 / 1,4693 = <strong>Rp95,3 juta</strong> &lt; Rp100 juta → ambil yang sekarang (persis hitungan cerita pembuka).</p>
      <p><strong>Kepribadian PV:</strong> dia <em>kacamata realitas</em> — menelanjangi angka masa depan yang terlihat besar. Rp1 miliar 20 tahun lagi @8% = cuma Rp214,5 juta hari ini. Inilah kenapa &ldquo;hadiah 1 miliar, dicicil 20 tahun&rdquo; jauh kurang menarik dari kedengarannya.</p>
      <p><strong>Kapan memakai:</strong> menilai &ldquo;apakah tawaran masa depan ini worth it?&rdquo;, fondasi harga obligasi (E4) dan NPV (di bawah).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> PV dan FV adalah <strong>mesin waktu yang sama</strong>, hanya arahnya beda. Aturan emasnya: <strong>jangan pernah membandingkan/menjumlahkan uang dari waktu berbeda</strong> — pindahkan dulu semuanya ke <em>satu titik waktu</em> (biasanya &ldquo;sekarang&rdquo; via PV), baru bandingkan.</p>
      </div>

      <h2 id="anuitas">Anuitas — Cicilan &amp; Pensiun</h2>
      <p><strong>Definisi.</strong> Anuitas = rangkaian pembayaran <strong>tetap</strong> tiap periode (cicilan KPR, gaji pensiun, premi asuransi). Dua rumus penting:</p>
      <Tex math={String.raw`PV_{\text{anuitas}} = PMT \times \frac{1-(1+r)^{-n}}{r}`} block />
      <Tex math={String.raw`FV_{\text{anuitas}} = PMT \times \frac{(1+r)^{n}-1}{r}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`PMT`} />: pembayaran per periode (misal cicilan Rp5 juta/bulan)</li>
        <li><Tex math={String.raw`r`} />: bunga <strong>per periode pembayaran</strong> (cicilan bulanan → bunga bulanan!)</li>
        <li><Tex math={String.raw`n`} />: jumlah pembayaran</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: cicilan KPR (klik untuk buka)</summary>
        <p>Pinjaman Rp500 juta, bunga 9%/tahun, tenor 15 tahun, cicilan bulanan.</p>
        <p><strong>Langkah 1</strong> — samakan periode: r = 9%/12 = 0,75%/bulan; n = 15×12 = 180.<br />
        <strong>Langkah 2</strong> — balik rumus PV anuitas untuk cari PMT:<br />
        <Tex math={String.raw`PMT = 500 \times \frac{0{,}0075}{1-(1{,}0075)^{-180}}`} /> juta<br />
        <strong>Langkah 3</strong> — hitung: (1,0075)<sup>−180</sup> = 0,2597 → PMT = 500 × 0,0075/0,7403 = <strong>Rp5,065 juta/bulan</strong>.</p>
        <p>Total dibayar: 180 × 5,065 = Rp911,7 juta — bunganya Rp411,7 juta, hampir sebesar pokoknya! Itulah harga tenor panjang.</p>
      </details>
      <p><strong>Kapan memakai:</strong> menghitung cicilan (KPR, kendaraan), menabung rutin untuk pensiun (FV anuitas), menilai kontrak sewa.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cicilan 0% berarti gratis, tidak ada biaya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;0%&rdquo; biasanya berarti <strong>harga cash sudah di-markup</strong> atau ada biaya admin/asuransi tersembunyi. Hitung PV dari seluruh cicilan dengan diskonto = bunga deposito/opportunity cost-mu — sering ketahuan harga cash-nya sebenarnya lebih murah. Tidak ada makan siang gratis di dunia kredit.</p>
      </div>

      <h2 id="ear">EAR — Bunga yang Jujur</h2>
      <p><strong>Definisi.</strong> Bank mengiklankan bunga <strong>nominal</strong> 12% &ldquo;per tahun&rdquo; yang dibungakan <strong>bulanan</strong>. Biaya sebenarnya per tahun (<em>effective annual rate</em>):</p>
      <Tex math={String.raw`EAR = \left(1+\frac{r_{\text{nom}}}{m}\right)^{m} - 1`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`r_{\text{nom}}`} /> = bunga nominal tahunan; <Tex math={String.raw`m`} /> = frekuensi pembungaan per tahun (bulanan → 12).</p>
      <p><strong>Contoh:</strong> nominal 12% dibungakan bulanan → EAR = (1 + 0,12/12)¹² − 1 = (1,01)¹² − 1 = <strong>12,68%</strong>. Kamu membayar 0,68% lebih mahal dari yang diiklankan!</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bunga 12% per tahun yang dicicil bulanan = 1% per bulan, total tetap 12%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 1% per bulan yang <em>berbunga-berbunga</em> = 12,68% per tahun (EAR). Makin sering frekuensi pembungaan (harian!), makin besar selisihnya. <strong>Selalu bandingkan pinjaman dengan EAR, bukan bunga nominal</strong> — itulah &ldquo;bunga yang jujur&rdquo;.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> jebakan klasik kartu kredit &amp; paylater: &ldquo;cuma 2% per bulan&rdquo; terdengar kecil → EAR = (1,02)¹² − 1 = <strong>26,8% per tahun</strong>! Biasakan menerjemahkan semua bunga ke EAR sebelum memutuskan.</p>
      </div>

      <h2 id="npv">NPV — Apakah Proyek Ini Untung?</h2>
      <p><strong>Definisi.</strong> <em>Net present value</em> = jumlah PV seluruh arus kas masa depan <strong>dikurangi</strong> investasi awal:</p>
      <Tex math={String.raw`NPV = \sum_{t=1}^{n}\frac{CF_t}{(1+r)^t} - C_0`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`CF_t`} />: arus kas bersih tahun ke-<Tex math={String.raw`t`} /> (masuk positif, keluar negatif)</li>
        <li><Tex math={String.raw`r`} />: <strong>tingkat diskonto</strong> — biasanya <em>opportunity cost</em> modal / <em>required return</em></li>
        <li><Tex math={String.raw`C_0`} />: investasi awal (arus kas tahun 0)</li>
      </ul>
      <p><strong>Aturan keputusan:</strong> <Tex math={String.raw`NPV > 0`} /> → terima (proyek menambah kekayaan); <Tex math={String.raw`NPV < 0`} /> → tolak.</p>
      <p><strong>Kepribadian NPV:</strong> dia <em>hakim yang adil</em> — menimbang setiap rupiah sesuai <em>kapan</em> ia datang. Rp100 juta tahun depan &ldquo;nilainya&rdquo; beda dari Rp100 juta 5 tahun lagi, dan NPV menghormati itu.</p>
      <p><strong>Contoh:</strong> investasi Rp200 jt, menerima Rp60 jt/tahun selama 5 tahun, diskonto 10%: PV = 60×[1−1,1⁻⁵]/0,1 = 60×3,7908 = Rp227,4 jt → NPV = 227,4 − 200 = <strong>+Rp27,4 jt → terima</strong>.</p>

      <h2 id="irr">IRR — Persen yang Menipu</h2>
      <p><strong>Definisi.</strong> <em>Internal rate of return</em> = tingkat diskonto yang membuat <strong>NPV = 0</strong>:</p>
      <Tex math={String.raw`\sum_{t=1}^{n}\frac{CF_t}{(1+IRR)^t} - C_0 = 0`} block />
      <p><strong>Artinya:</strong> IRR adalah &ldquo;bunga impas&rdquo; proyek — di atas IRR, proyek merugi; di bawahnya, untung. Aturan: terima jika <Tex math={String.raw`IRR > r`} /> (melebihi required return).</p>
      <p><strong>Kepribadian IRR:</strong> dia <em>politikus karismatik</em> — angka persennya enak didengar (&ldquo;IRR 35%!&rdquo;), tapi sering menyesatkan:</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IRR tertinggi = proyek terbaik. Selalu pilih IRR terbesar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> IRR punya tiga cacat: (1) <strong>masalah skala</strong> — proyek Rp100 jt ber-IRR 40% (untung Rp40 jt) kalah nilai dari proyek Rp10 M ber-IRR 15% (untung Rp1,5 M); (2) <strong>asumsi reinvestasi</strong> — IRR mengasumsikan kas yang diterima diinvestasikan lagi <em>sebesar IRR itu sendiri</em> (tidak realistis untuk IRR 40%); (3) <strong>IRR ganda</strong> — arus kas yang berubah tanda &gt;1× bisa menghasilkan beberapa IRR. Untuk proyek saling meniadakan (<em>mutually exclusive</em>), <strong>NPV adalah wasit utama</strong> — lihat Lab 2.</p>
      </div>

      <PlotlyChart
        data={npvProfileData}
        title="Profil NPV: Makin Tinggi Diskonto, Makin Kecil NPV"
        layout={{ xaxis: { title: "Tingkat diskonto (%)" }, yaxis: { title: "NPV (Rp jt)" }, showlegend: false, shapes: [{ type: "line", x0: 0, x1: 20, y0: 0, y1: 0, line: { color: "#ef4444", dash: "dash" } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = tingkat diskonto yang kamu pakai, sumbu Y = NPV proyek. Garis merah putus-putus = NPV nol.</p>
        <p><strong>Interpretasi:</strong> kurva menurun — makin tinggi diskonto (makin mahal modalmu), makin kecil NPV. Titik potong dengan garis nol (≈12,6%) = <strong>IRR</strong> proyek ini. Di kiri titik itu proyek untung (NPV+), di kanan rugi (NPV−). Grafik ini menjelaskan <em>mengapa</em> aturan &ldquo;terima jika IRR &gt; required return&rdquo; bekerja.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Mesin Waktu Uang</h2>
      <p>Selesaikan dilema cerita pembuka secara kuantitatif. Ubah suku bunga dan lihat keputusannya berbalik.</p>
      <PyodideLab
        title="Lab 1 — Rp100 Jt Sekarang vs Rp140 Jt Nanti"
        hint="Coba: r = 0.05, lalu r = 0.12. Pada bunga berapa keputusan berbalik? Itulah 'titik impas' pilihanmu."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Duel NPV vs IRR</h2>
      <p>Dua proyek, hanya boleh pilih satu. IRR dan NPV menunjuk pemenang berbeda — siapa yang benar?</p>
      <PyodideLab
        title="Lab 2 — Konflik NPV vs IRR (Proyek Saling Meniadakan)"
        hint="Coba: r = 0.20 (modal mahal). Apakah pemenangnya berubah? Pikirkan: saat modal mahal, proyek cepat (A) jadi relatif lebih menarik."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> NPV menjawab <em>&ldquo;berapa rupiah kekayaanku bertambah?&rdquo;</em>, IRR menjawab <em>&ldquo;berapa persen imbal hasilnya?&rdquo;</em>. Kekayaanmu diukur dalam rupiah, bukan persen — makanya NPV menang saat keduanya konflik.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Rumus Mana untuk Apa</h2>

      <div className="decision-card">
        <h3>1. &ldquo;Tabunganku jadi berapa?&rdquo; → <strong>FV</strong></h3>
        <p><strong>Kondisi:</strong> satu setoran (atau rutin via FV anuitas), ingin tahu hasil di masa depan.</p>
        <p><strong>Kenapa:</strong> FV memajukan uang ke depan dengan compounding.</p>
        <p><strong>Contoh nyata:</strong> nabung Rp1 jt/bulan 20 tahun @8% → FV anuitas ≈ Rp589 jt.</p>
      </div>

      <div className="decision-card">
        <h3>2. &ldquo;Tawaran masa depan ini worth it?&rdquo; → <strong>PV</strong></h3>
        <p><strong>Kondisi:</strong> membandingkan uang dari waktu berbeda.</p>
        <p><strong>Kenapa:</strong> PV menyamakan &ldquo;zona waktu&rdquo; ke hari ini. Jangan bandingkan apel 2026 dengan jeruk 2031.</p>
        <p><strong>Contoh nyata:</strong> pilih pesangon cash vs dicicil; menilai harga wajar obligasi (E4).</p>
      </div>

      <div className="decision-card">
        <h3>3. &ldquo;Pinjaman mana lebih murah?&rdquo; → <strong>EAR</strong></h3>
        <p><strong>Kondisi:</strong> membandingkan bunga dengan frekuensi pembungaan beda.</p>
        <p><strong>Kenapa:</strong> bunga nominal menipu; EAR menyamakan ke basis tahunan yang jujur.</p>
        <p><strong>Contoh nyata:</strong> KTA 1,2%/bln (EAR 15,4%) vs kartu kredit 2%/bln (EAR 26,8%).</p>
      </div>

      <div className="decision-card">
        <h3>4. &ldquo;Proyek ini diambil atau tidak?&rdquo; → <strong>NPV</strong> (utama), IRR (pendamping)</h3>
        <p><strong>Kondisi:</strong> keputusan investasi dengan arus kas multi-tahun.</p>
        <p><strong>Kenapa:</strong> NPV mengukur pertambahan kekayaan dalam rupiah; IRR enak untuk komunikasi tapi cacat saat proyek saling meniadakan.</p>
        <p><strong>Contoh nyata:</strong> buka cabang baru, beli mesin, akuisisi (lihat mini-case).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Samakan periode dulu:</strong> bunga bulanan ↔ arus kas bulanan. Ini sumber error #1.</li>
          <li><strong>Uang beda waktu → PV-kan dulu</strong>, baru jumlahkan/bandingkan.</li>
          <li><strong>Pinjaman → bandingkan EAR.</strong> Proyek → putuskan dengan NPV.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Warung Kopi Rina</h2>
      <div className="callout">
        <p>Rina mau buka warung kopi: investasi awal Rp200 juta (renovasi + mesin). Proyeksi laba bersih: Rp55 jt (thn 1), Rp65 jt (thn 2), Rp75 jt (thn 3), Rp70 jt (thn 4), Rp60 jt (thn 5). <em>Required return</em> Rina 12% (kalau tidak buka warung, uangnya masuk reksa dana campuran).</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung NPV — buka atau tidak? (b) Jika konsultan bilang &ldquo;IRR-nya 19%, bagus!&rdquo;, apakah itu mengubah keputusanmu? (c) Risiko apa yang <strong>tidak</strong> ditangkap NPV?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) PV arus kas @12%: 55/1,12 + 65/1,12² + 75/1,12³ + 70/1,12⁴ + 60/1,12⁵ = 49,1 + 51,8 + 53,4 + 44,5 + 34,0 = Rp232,8 jt. NPV = 232,8 − 200 = <strong>+Rp32,8 jt → buka</strong> (secara finansial).</p>
          <p>(b) <strong>Tidak mengubah.</strong> IRR 19% &gt; 12% konsisten dengan NPV positif — keduanya setuju di sini. IRR hanya jadi masalah saat <em>memilih di antara</em> proyek yang saling meniadakan.</p>
          <p>(c) NPV tidak menangkap: <strong>risiko proyeksi meleset</strong> (angka laba itu tebakan!), <strong>risiko likuiditas</strong> (uang terkunci 5 tahun), dan <strong>nilai opsi</strong> (bisa tutup warung di tahun 2 kalau rugi — fleksibilitas ini bernilai tapi tak terhitung di NPV standar).</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: KPR Rp500 Juta — Berapa yang Benar-Benar Kamu Bayar?</h2>
      <p>Kamu meminjam <strong>Rp500 juta</strong>, bunga <strong>9% efektif per tahun</strong>, tenor <strong>20 tahun</strong>, cicilan tahunan tetap (<em>anuitas</em>). Bank bilang cicilannya &ldquo;cuma&rdquo; Rp54,8 juta/tahun. Mari verifikasi — dan hitung total bunga yang kamu bayar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus anuitas:</strong> cicilan tahunan <Tex math={String.raw`A = P \times \frac{r}{1-(1+r)^{-n}}`} />, dengan <Tex math={String.raw`P`} /> = pokok pinjaman, <Tex math={String.raw`r`} /> = bunga per periode, <Tex math={String.raw`n`} /> = jumlah periode.</p>
        <p><strong>Langkah 2 — Masukkan angka:</strong> <Tex math={String.raw`P=500`} /> jt, <Tex math={String.raw`r=0{,}09`} />, <Tex math={String.raw`n=20`} />. Hitung <Tex math={String.raw`(1{,}09)^{-20}`} />: <Tex math={String.raw`1{,}09^{20} \approx 5{,}604`} /> sehingga <Tex math={String.raw`(1{,}09)^{-20} \approx 0{,}1784`} />.</p>
        <p><strong>Langkah 3 — Cicilan:</strong> <Tex math={String.raw`A = 500 \times \frac{0{,}09}{1-0{,}1784} = \frac{45}{0{,}8216} \approx`} /> <strong>Rp54,76 juta/tahun</strong>. (Cek bank: benar.)</p>
        <p><strong>Langkah 4 — Total yang dibayar:</strong> 20 &times; 54,76 = <strong>Rp1.095 juta</strong>. Total bunga = 1.095 − 500 = <strong>Rp595 juta</strong> — <em>lebih besar dari pokok pinjamannya sendiri!</em></p>
        <p><strong>Intuisi:</strong> &ldquo;rumah Rp500 juta&rdquo; yang dibeli dengan KPR 20 tahun sebenarnya berharga <strong>Rp1,1 miliar</strong>. Inilah TVM bekerja melawanmu: karena pembayaranmu tersebar 20 tahun ke depan, bank menuntut kompensasi waktu. Keputusan cerdas = bandingkan <em>total biaya</em> (atau PV-nya), bukan cicilannya yang terlihat &ldquo;kecil&rdquo;.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: 12% vs 12,5% — Jebakan Bunga Nominal</h2>
      <p>Bank A menawarkan deposito <strong>12% nominal, bunga dibayar bulanan</strong>. Bank B menawarkan <strong>12,5% efektif per tahun</strong>. Mana lebih baik? &ldquo;12,5 &gt; 12, jelas B&rdquo; — tunggu dulu.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Pahami &ldquo;nominal&rdquo;:</strong> 12% nominal bulanan artinya tiap bulan kamu dapat 12%/12 = <strong>1% per bulan</strong> — dan bunga bulan ini ikut berbunga bulan depan (<em>compounding</em>).</p>
        <p><strong>Langkah 2 — Hitung EAR (<em>effective annual rate</em>):</strong> <Tex math={String.raw`EAR = (1+0{,}01)^{12} - 1`} />. <Tex math={String.raw`1{,}01^{12} \approx 1{,}1268`} />, jadi EAR Bank A = <strong>12,68%</strong>.</p>
        <p><strong>Langkah 3 — Bandingkan:</strong> Bank A (12,68% efektif) <strong>mengalahkan</strong> Bank B (12,5% efektif) — meski angka brosurnya lebih kecil!</p>
        <p><strong>Intuisi:</strong> <em>frekuensi compounding</em> adalah mesin tersembunyi. Nominal 12% yang dicicil bulanan &ldquo;beranak&rdquo; lebih cepat daripada 12,5% yang dibayar setahun sekali. Aturan praktis: <strong>selalu bandingkan dalam EAR</strong> — itulah &ldquo;zona waktu&rdquo; yang sama. Bank yang jujur mencantumkan keduanya; yang tidak, sembunyikan di brosur.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Berapa Nilai Rencana Pensiunmu <em>Hari Ini</em>?</h2>
      <p>Kamu ingin menerima <strong>Rp10 juta/tahun selama 10 tahun</strong> mulai tahun depan (total Rp100 juta). Asumsi return investasi <strong>8%/tahun</strong>. Berapa yang harus kamu siapkan <em>sekarang</em> (sekali setor)?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus PV anuitas:</strong> <Tex math={String.raw`PV = A \times \frac{1-(1+r)^{-n}}{r}`} />.</p>
        <p><strong>Langkah 2 — Masukkan angka:</strong> <Tex math={String.raw`A=10`} /> jt, <Tex math={String.raw`r=0{,}08`} />, <Tex math={String.raw`n=10`} />. <Tex math={String.raw`(1{,}08)^{-10} \approx 0{,}4632`} />.</p>
        <p><strong>Langkah 3 — Hasil:</strong> <Tex math={String.raw`PV = 10 \times \frac{1-0{,}4632}{0{,}08} = 10 \times 6{,}7101 \approx`} /> <strong>Rp67,1 juta</strong>.</p>
        <p><strong>Intuisi:</strong> Rp100 juta yang diterima bertahap 10 tahun hanya &ldquo;seharga&rdquo; <strong>Rp67,1 juta hari ini</strong> — Rp32,9 juta sisanya adalah &ldquo;pekerjaan&rdquo; yang dilakukan waktu + bunga untukmu. Inilah cara dana pensiun &amp; asuransi menghitung kewajibannya: mereka tidak menabung Rp100 juta, mereka menabung <strong>PV-nya</strong> dan membiarkan waktu bekerja.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Saat Bunga 70% — dan Saat Bunga <em>Negatif</em></h2>
      <p>TVM terasa abstrak sampai kamu melihat ekstremnya:</p>
      <ul>
        <li><strong>Indonesia 1998:</strong> krisis moneter — suku bunga deposito melonjak ke <strong>60–70%</strong>, inflasi menyentuh ~80%. TVM menjadi brutal: uang tunai yang dipegang <em>meleleh</em> nilainya tiap bulan; utang berbunga floating menjadi bom waktu yang menenggelamkan konglomerat. Pelajaran: <strong>bunga bukan sekadar angka — ia harga dari kepanikan kolektif</strong> (<em>risk premium</em> yang meledak).</li>
        <li><strong>Eropa &amp; Jepang 2010-an:</strong> kebalikannya — suku bunga <strong>negatif</strong> (−0,5%). Menabung di bank = <em>membayar</em> bank. TVM terbalik: Rp100 juta hari ini &ldquo;bernilai&rdquo; <em>kurang</em> dari Rp100 juta tahun depan? Tidak — melainkan investor <em>rela membayar</em> untuk keamanan (atau dipaksa regulasi memegang obligasi). Pelajaran: bunga = harga waktu <strong>+ harga ketakutan + kebijakan</strong>, bukan hukum fisika.</li>
      </ul>
      <p><strong>Benang merahnya:</strong> <Tex math={String.raw`r`} /> dalam semua rumus TVM bukanlah konstanta alam — ia adalah <strong>ringkasan dari ekspektasi inflasi, risiko, dan kebijakan moneter</strong> pada satu titik waktu. Analis yang cerdas tidak menghafal rumus; ia bertanya <em>&ldquo;bunga berapa yang pantas untuk risiko &amp; horizon ini?&rdquo;</em> — dan di situlah E4 (obligasi) dan E12 (FX &amp; suku bunga) mengambil alih.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci (Rule of 72):</strong> uang berlipat 2 dalam <strong>72 &divide; bunga%</strong> tahun. Bunga 8% &rarr; ~9 tahun. Bunga 70% (1998) &rarr; ~1 tahun — utangmu berlipat 2 tiap tahun! Aturan 10 detik untuk merasakan &ldquo;kecepatan&rdquo; bunga apa pun tanpa kalkulator.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bunga flat 8% sama dengan bunga efektif 8%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> bunga <em>flat</em> dihitung dari <strong>pokok awal terus-menerus</strong> meski pokok sudah menyusut karena cicilan. Pinjam Rp120 juta, flat 8%/tahun, tenor 1 tahun &rarr; bunga Rp9,6 juta. Tapi rata-rata dana yang kamu pegang hanya ~Rp60 juta (menyusut tiap bulan) &rarr; bunga <em>efektif</em> ≈ <strong>14–15%</strong>! Selalu tanya: <em>flat atau efektif/AFR?</em> Selisihnya bisa 2× lipat.</p>
      </div>

      <h2 id="diskonto">🔧 Pendalaman: Bunga = Harga Waktu (dan Cara Berpikir Seperti Kreditor)</h2>
      <p>Lihat lagi rumus PV: <Tex math={String.raw`PV = \frac{FV}{(1+r)^n}`} />. Kebanyakan orang membacanya sebagai &ldquo;rumus&rdquo;. Bacalah sebagai <strong>kalimat ekonomi</strong>:</p>
      <ul>
        <li><strong>Pembilang (<Tex math={String.raw`FV`} />):</strong> janji — &ldquo;kamu akan menerima sekian.&rdquo;</li>
        <li><strong>Penyebut (<Tex math={String.raw`(1+r)^n`} />):</strong> tiga alasan untuk meragukan janji itu: (1) <strong>waktu</strong> — kamu menunggu; (2) <strong>inflasi</strong> — daya beli tergerus; (3) <strong>risiko</strong> — janji bisa ingkar. Ketiganya diringkas dalam <Tex math={String.raw`r`} />.</li>
      </ul>
      <p><strong>Cara berpikir kreditor profesional:</strong> setiap kali ada yang menawarkan &ldquo;imbal hasil X%&rdquo;, ia tidak mendengar janji — ia mendengar <em>pertanyaan</em>: &ldquo;apakah X% cukup membayar (1) kesabaranku, (2) inflasi yang kumakan, (3) kemungkinan ia kabur?&rdquo; Jika X% &lt; jawabanmu untuk ketiganya &rarr; tolak, berapa pun manisnya brosur.</p>
      <p><strong>Jembatan ke E4:</strong> harga obligasi = PV dari seluruh janji kupon + pokok — dengan <Tex math={String.raw`r`} /> = <em>yield</em> yang ditentukan pasar. Obligasi hanyalah TVM yang diulang untuk banyak arus kas sekaligus.</p>


      <h2 id="wacc">🔧 Pendalaman: Discount Rate Berapa yang &ldquo;Benar&rdquo;? (Menuju WACC)</h2>
      <p>Semua rumus TVM butuh <Tex math={String.raw`r`} /> — tapi <em>r berapa</em>? Jawabannya berlapis:</p>
      <ul>
        <li><strong>Lapis 1 — Risk-free:</strong> yield SBN tenor setara (E4). Ini &ldquo;lantai&rdquo;: tidak ada investasi berisiko yang boleh didiskonto di bawah ini.</li>
        <li><strong>Lapis 2 — Risk-free + premi risiko aset:</strong> obligasi korporasi = SBN + credit spread (E5!); saham = SBN + premi ekuitas via CAPM (E9!). <strong>Diskonto = cerminan risiko arus kasnya.</strong></li>
        <li><strong>Lapis 3 — WACC (<em>weighted average cost of capital</em>):</strong> untuk menilai <em>proyek perusahaan</em>, pakai rata-rata tertimbang biaya modalnya: <Tex math={String.raw`WACC = w_e \cdot r_e + w_d \cdot r_d(1-T)`} />, dengan <Tex math={String.raw`w_e, w_d`} /> = bobot ekuitas/utang, <Tex math={String.raw`r_e`} /> = required return saham (CAPM!), <Tex math={String.raw`r_d`} /> = biaya utang, <Tex math={String.raw`T`} /> = pajak (bunga utang <em>tax-deductible</em>!).</li>
      </ul>
      <p><strong>Kenapa berlapis:</strong> memakai <em>r</em> yang salah = jawaban yang salah dengan presisi tinggi. Mendiskonto proyek berisiko dengan bunga deposito = <strong>melebih-lebihkan nilainya</strong> (proyek buruk terlihat bagus). Aturan: <strong>samakan risiko arus kas dengan risiko diskontonya</strong> — <em>matching principle</em> valuasi.</p>
      <h2 id="worked4">🔬 Worked Example: NPV Proyek — Investasi Rp10 Miliar, Layak?</h2>
      <p>PT MajuMundur mempertimbangkan pabrik baru: investasi <strong>Rp10 M</strong> hari ini, arus kas bersih <strong>Rp3 M/tahun selama 5 tahun</strong>. WACC perusahaan <strong>12%</strong>. Layak?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — PV arus kas</strong> (anuitas, E3 Worked 3!): PV = 3 × [1 − (1,12)<sup>−5</sup>]/0,12. (1,12)<sup>5</sup> ≈ 1,762 &rarr; (1,12)<sup>−5</sup> ≈ 0,5674. PV = 3 × (0,4326/0,12) = 3 × 3,6048 = <strong>Rp10,81 M</strong>.</p>
        <p><strong>Langkah 2 — NPV:</strong> 10,81 − 10 = <strong>+Rp0,81 M</strong>. NPV &gt; 0 &rarr; <strong>layak</strong> (menciptakan nilai Rp810 juta di atas biaya modalnya).</p>
        <p><strong>Langkah 3 — Uji sensitivitas:</strong> jika WACC 15% (risiko ternyata lebih tinggi): PV = 3 × [1 − (1,15)<sup>−5</sup>]/0,15 = 3 × 3,3522 = Rp10,06 M &rarr; NPV = <strong>+Rp0,06 M</strong> — nyaris impas! Jika arus kas meleset 10% (Rp2,7 M/thn) @12%: PV = 9,73 M &rarr; NPV <strong>negatif</strong>.</p>
        <p><strong>Intuisi:</strong> NPV positif <strong>tipis</strong> + sensitif = proyek <em>rapuh</em>. Analis profesional tidak berhenti di &ldquo;NPV positif&rdquo; — ia bertanya <em>&ldquo;seberapa salah asumsiku boleh sebelum NPV negatif?&rdquo;</em> (<em>margin of safety</em>). Inilah jembatan TVM → keputusan korporasi nyata: <strong>matematika memberi angka, sensitivitas memberi kebijaksanaan.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IRR lebih tinggi = proyek lebih baik, selalu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> IRR (<em>internal rate of return</em> — diskonto yang membuat NPV = 0) punya dua cacat: (1) <strong>asumsi reinvestasi</strong> — IRR mengasumsikan arus kas diinvestasikan ulang <em>pada IRR itu sendiri</em> (tidak realistis jika IRR 40%!); (2) <strong>proyek mutually exclusive</strong> — proyek kecil IRR 50% (NPV Rp1 M) vs proyek besar IRR 20% (NPV Rp10 M): IRR memilih yang kecil, padahal yang besar menciptakan nilai 10× lipat! <strong>NPV = kriteria utama</strong>; IRR = pelengkap. Jangan biarkan persentase menipu — nilai absolut (rupiah!) yang dibelanjakan.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Mesin Waktu Uang (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Rp100 jt sekarang vs Rp140 jt 5 tahun lagi, bunga 8%. Mana lebih berharga?"
        options={[
          "Rp140 jt — nominalnya lebih besar",
          "Rp100 jt sekarang — PV dari Rp140 jt hanya ~Rp95,3 jt",
          "Sama saja",
          "Tidak bisa dibandingkan",
        ]}
        correct={1}
        explanation="Benar: PV = 140/1,08⁵ = Rp95,3 jt < Rp100 jt. Jangan bandingkan uang beda waktu tanpa menyamakan zona waktunya dulu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Pinjaman A: bunga 1% per bulan. Pinjaman B: 12% per tahun dibayar tahunan. Mana lebih murah?"
        options={[
          "Sama saja, 1% × 12 = 12%",
          "A lebih murah",
          "B lebih murah — EAR A = 12,68% > 12%",
          "Tidak bisa dibandingkan",
        ]}
        correct={2}
        explanation="Benar: B. EAR A = (1,01)¹²−1 = 12,68%. Bunga nominal menipu — selalu bandingkan dalam EAR."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam rumus anuitas KPR, kesalahan paling umum adalah…"
        options={[
          "Salah memasukkan pokok pinjaman",
          "Tidak menyamakan periode: bunga tahunan dipakai dengan cicilan bulanan",
          "Lupa mengalikan 12",
          "Menggunakan kalkulator",
        ]}
        correct={1}
        explanation="Benar: periode harus konsisten — bunga tahunan 9% dengan cicilan bulanan wajib dikonversi ke 0,75%/bulan dan n = 180."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. NPV = +Rp27 jt artinya…"
        options={[
          "Proyek untung Rp27 jt secara akuntansi",
          "Proyek menambah kekayaan sebesar Rp27 jt di atas required return — terima",
          "Proyek impas",
          "Tolak proyek",
        ]}
        correct={1}
        explanation="Benar: NPV positif = kekayaan bertambah Rp27 jt SETELAH memperhitungkan opportunity cost modal (diskonto). Terima."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua proyek saling meniadakan: A (IRR 40%, NPV Rp40 jt), B (IRR 15%, NPV Rp1,5 M). Pilih?"
        options={[
          "A — IRR lebih tinggi",
          "B — NPV lebih besar; kekayaan diukur dalam rupiah",
          "Tolak keduanya",
          "Pilih berdasarkan firasat",
        ]}
        correct={1}
        explanation="Benar: B. Ini masalah skala IRR — persen tinggi dari basis kecil kalah dari persen moderat dari basis raksasa. NPV = wasit utama."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. &ldquo;Cicilan 0%&rdquo; untuk elektronik — respons analis yang tepat?"
        options={[
          "Langsung ambil, gratis!",
          "Hitung PV total cicilan vs harga cash — '0%' sering berarti harga sudah di-markup",
          "Tolak selalu",
          "Minta bunga 0% yang benar-benar 0%",
        ]}
        correct={1}
        explanation="Benar: verifikasi dengan PV. Seringkali harga cash (atau di toko sebelah) lebih murah dari total cicilan '0%'. Tidak ada makan siang gratis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>FV</strong> = memajukan uang (compounding); <strong>PV</strong> = memundurkan uang (diskonto). Satu mesin waktu, dua arah.</li>
          <li><strong>Anuitas</strong> untuk arus kas tetap periodik (cicilan, pensiun) — samakan periode bunga &amp; pembayaran!</li>
          <li><strong>EAR</strong> = bunga yang jujur; selalu bandingkan pinjaman dalam EAR.</li>
          <li><strong>NPV &gt; 0 → terima.</strong> NPV mengukur pertambahan kekayaan dalam rupiah.</li>
          <li><strong>IRR</strong> = diskonto saat NPV=0; enak didengar tapi cacat (skala, reinvestasi, IRR ganda). Saat konflik dengan NPV, <strong>NPV menang</strong>.</li>
          <li>Jangan pernah menjumlahkan/membandingkan uang dari waktu berbeda tanpa PV-kan dulu.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e2-instrumen" className="btn btn-secondary btn-sm">← E2</Link>
        <Link href="/learn/e4-obligasi" className="btn btn-primary btn-sm">Next: E4 →</Link>
      </div>
    </div>
  );
}
