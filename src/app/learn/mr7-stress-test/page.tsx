"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR7Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Waterfall: dekomposisi kerugian skenario stres per faktor
  const waterfallX = ["P&L awal", "Suku bunga +200bp", "Spread +400bp", "Ekuitas −30%", "FX −15%", "Komoditas −20%", "P&L stres"];
  const waterfallY = [0, -42, -68, -55, -18, -12, 0];
  // hitung kumulatif untuk waterfall manual
  const cum = [0];
  waterfallY.slice(1, -1).forEach((v) => cum.push(cum[cum.length - 1] + v));
  const total = cum[cum.length - 1];

  const wfData = [
    {
      x: waterfallX,
      y: [0, ...waterfallY.slice(1, -1), total],
      type: "waterfall",
      base: 0,
      connector: { line: { color: "#94a3b8" } },
      increasing: { marker: { color: "#2a7de1" } },
      decreasing: { marker: { color: "#ef4444" } },
      totals: { marker: { color: "#e8a838" } },
      measure: ["absolute", "relative", "relative", "relative", "relative", "relative", "total"],
    },
  ];

  // Reverse stress: probabilitas vs severity (konseptual)
  const revData = [
    {
      x: ["Gagal bayar\n1 obligor", "Spread +200bp", "Spread +400bp\n+ likuiditas kering", "Krisis 2008\nterulang", "Skenario\nkiamat"],
      y: [35, 22, 12, 6, 2],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#ef4444"] },
    },
  ];

  const lab1Code = String.raw`# STRESS TEST: terapkan skenario ke portofolio via sensitivitas orde-1 + orde-2
# Portofolio: obligasi korporasi Rp800 M

# Sensitivitas (diestimasi desk)
DV01 = -2_400_000_000 / 100   # Rp -2,4 M per +100bp -> per bp:
DV01_per_bp = DV01 / 100
convexity_adj = 180_000       # Rp per bp^2 (orde-2, dari MR8)
delta_fx = 50_000_000         # Rp +50 jt per Rp100 pelemahan IDR
cs01 = -900_000_000 / 100     # sensitivitas credit spread per bp

def stress(skenario, d_yield_bp, d_spread_bp, d_fx_rp):
    # orde-1 + orde-2 utk yield; orde-1 utk spread & FX
    pnl = (DV01_per_bp * d_yield_bp
           + 0.5 * convexity_adj * d_yield_bp ** 2
           + cs01 * d_spread_bp
           + delta_fx * (d_fx_rp / 100))
    print(f"{skenario:32s} P&L = Rp {pnl:>14,.0f}")
    return pnl

print("Skenario stres portofolio obligasi Rp800 M:")
print("-" * 58)
stress("2008 terulang (y+150bp, s+400bp)", 150, 400, 0)
stress("Taper tantrum (y+200bp, s+150bp)", 200, 150, 500)
stress("Hipotetis: stagflasi (y+300bp, s+300bp, IDR -1000)", 300, 300, 1000)
stress("Hipotetis ringan (y+50bp, s+50bp)", 50, 50, 0)
print("-" * 58)
print()
print("Coba: buat skenario 'reverse' -- cari kombinasi yang menghasilkan")
print("P&L = -Rp500 M (batas toleransi). Kombinasi apa yang paling PLAUSIBLE?")`;

  const lab2Code = String.raw`# REVERSE STRESS TEST (sederhana): dari batas toleransi -> cari skenario pemicu.
# Bank menetapkan: kerugian > Rp400 M = "tidak dapat diterima".
# Kita cari kombinasi (shock_yield_bp, shock_spread_bp) di grid yang menembus batas,
# lalu nilai PLAUSIBILITAS tiap kombinasi dari data historis.

import math
DV01_per_bp = -24_000_000   # Rp per bp
cs01_per_bp = -9_000_000    # Rp per bp

batas = 400_000_000
print(f"Batas toleransi: Rp {batas:,.0f}")
print()
print("Kombinasi (yield_bp, spread_bp) yang MENEMBUS batas:")
print(f"{'yield':>6s} {'spread':>7s} {'P&L (Rp M)':>11s}  Plausibilitas")
# plausibilitas: prob historis shock >= nilai ini (asumsi normal, sd harian yield 8bp, spread 12bp)
sd_y, sd_s = 8, 12
def prob_exceed(x, sd):
    # P(|Z| > x/sd) dua arah, pakai aproksimasi
    z = x / sd
    return 2 * (1 - 0.5 * (1 + math.erf(z / math.sqrt(2))))

batas_tembus = []
for dy in range(0, 301, 50):
    for ds in range(0, 401, 50):
        pnl = DV01_per_bp * dy + cs01_per_bp * ds
        if -pnl >= batas:
            p = prob_exceed(dy, sd_y) * prob_exceed(ds, sd_s)
            batas_tembus.append((dy, ds, -pnl, p))
batas_tembus.sort(key=lambda r: -r[3])  # paling plausible dulu
for dy, ds, loss, p in batas_tembus[:8]:
    print(f"{dy:>6d} {ds:>7d} {loss/1e6:>10.0f}   {p:.2e}")
print()
print("Reverse stress = mulai dari 'apa yang membunuh kami' lalu mundur")
print("mencari 'bagaimana itu bisa terjadi' -- dan seberapa plausible.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR7 — Market Risk Analytics</span>
        <h1 className="display-title">Stress Testing:<br />Berlatih Mati Sebelum Benar-Benar Mati</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Latihan yang Menyelamatkan</a></li>
          <li><a href="#jenis">Tiga Jenis Skenario: Historis, Hipotetis, Reverse</a></li>
          <li><a href="#desain">Merancang Skenario yang Baik</a></li>
          <li><a href="#reverse">Reverse Stress Test: Mulai dari Kematian</a></li>
          <li><a href="#lab1">🔬 Lab 1: Terapkan Skenario ke Portofolio</a></li>
          <li><a href="#lab2">🔬 Lab 2: Reverse Stress — Cari Pemicu Batas Toleransi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Membedah Skenario 2008 — Angka Aktual dan Kalibrasi</a></li>
          <li><a href="#case">📋 Mini-Case: Skenario yang Terlalu Sopan</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan stress test vs VaR — mengapa keduanya saling melengkapi, bukan saling menggantikan.</li>
          <li>Membedakan skenario historis, hipotetis, dan reverse stress — serta kapan memakai masing-masing.</li>
          <li>Merancang skenario stres yang memenuhi kriteria: parah tapi plausible, konsisten antar faktor, dan relevan dengan portofolio.</li>
          <li>Menghitung dampak skenario ke portofolio via sensitivitas (orde-1 + orde-2) dan menafsirkan hasilnya.</li>
          <li>Melakukan reverse stress test sederhana: dari batas toleransi mundur ke kombinasi pemicu yang paling plausible.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Latihan yang Menyelamatkan</h2>
      <div className="story">
        <p>2006. Sebuah bank Eropa menjalankan stress test tahunan dengan skenario <strong>&ldquo;parah&rdquo;</strong>: harga properti turun 20%, spread kredit melebar 200 bp. Hasilnya: kerugian Rp3 triliun — masih dalam toleransi. Laporan selesai, semua lega.</p>
        <p>2008. Krisis subprime: harga properti AS turun <strong>30%+</strong>, spread melebar <strong>800+ bp</strong>, dan — yang tidak ada di skenario mana pun — <strong>pasar pendanaan membeku total</strong> (bank tidak bisa memutar utang jangka pendeknya). Kerugian aktual: <strong>Rp15 triliun</strong>, 5× hasil stress test.</p>
        <p>Twist-nya: bukan cuma skenarionya yang &ldquo;kurang parah&rdquo;. Masalahnya lebih dalam: skenario mereka mengasumsikan <strong>korelasi normal</strong> (properti jatuh tapi pendanaan lancar) — padahal di krisis, <strong>semuanya berkorelasi menjadi satu</strong>: aset jatuh <em>dan</em> pendanaan kering <em>dan</em> likuiditas hilang, bersamaan. Stress test yang menguji risiko satu-satu <strong>tidak pernah bisa menangkap krisis yang menyerang bergerombol</strong>.</p>
        <p>Lesson ini tentang merancang latihan kematian yang jujur: skenario yang parah tapi plausible, konsisten antar faktor — dan teknik <strong>reverse stress</strong> yang membalik pertanyaannya.</p>
      </div>

      <h2 id="jenis">Tiga Jenis Skenario: Historis, Hipotetis, Reverse</h2>

      <h3>1. Skenario historis — &ldquo;bagaimana jika 2008 terulang?&rdquo;</h3>
      <p><strong>Definisi.</strong> Terapkan <strong>pergerakan faktor aktual</strong> dari episode krisis masa lalu (2008 GFC, 2020 COVID crash, 2013 taper tantrum, 1998 Asia) ke portofolio <em>saat ini</em>.</p>
      <p><strong>Kelebihan:</strong> plausible by construction (benar-benar terjadi!), konsisten antar faktor otomatis (korelasi krisis tertangkap apa adanya), mudah dikomunikasikan (&ldquo;skenario 2008&rdquo;).</p>
      <p><strong>Kelemahan:</strong> <strong>fighting the last war</strong> — krisis berikutnya tidak akan sama persis dengan yang lalu. Portofolio kini mungkin rentan ke faktor yang <em>tidak bergerak</em> di 2008.</p>

      <h3>2. Skenario hipotetis — &ldquo;bagaimana jika yang belum pernah terjadi, terjadi?&rdquo;</h3>
      <p><strong>Definisi.</strong> Skenario <strong>rancangan analis</strong>: kombinasi shock yang belum pernah terjadi bersamaan, tapi plausible (misal: stagflasi + krisis geopolitik + gagal bayar sovereign).</p>
      <p><strong>Kelebihan:</strong> bisa menargetkan <strong>kelemahan spesifik</strong> portofolio kini; tidak terjebak masa lalu.</p>
      <p><strong>Kelemahan:</strong> butuh <strong>konsistensi</strong> — shock yang asal comot bisa mustahil secara ekonomi (misal: suku bunga +500 bp tapi ekuitas +20% tanpa narasi). Skenario inkonsisten = hasil sampah.</p>

      <h3>3. Reverse stress test — &ldquo;apa yang bisa membunuh kami?&rdquo;</h3>
      <p><strong>Definisi.</strong> Mulai dari <strong>hasil yang tidak dapat diterima</strong> (rugi &gt; toleransi, modal jebol, gagal bayar), lalu <strong>mundur</strong> mencari kombinasi peristiwa yang menyebabkannya — dan nilai plausibilitasnya. (Dibahas penuh di bawah.)</p>

      <PlotlyChart
        data={wfData}
        title="Waterfall Kerugian Skenario '2008 Terulang' (Rp miliar)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Kontribusi P&L (Rp miliar)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> waterfall dari kiri ke kanan — tiap batang merah = kontribusi kerugian dari satu faktor; batang kuning terakhir = total kerugian skenario.</p>
        <p><strong>Interpretasi:</strong> total kerugian <strong>Rp195 miliar</strong>, didominasi <strong>melebarnya credit spread</strong> (Rp68 M) dan <strong>jatuhnya ekuitas</strong> (Rp55 M) — bukan suku bunga. Inilah nilai stress test: ia menunjukkan <strong>di mana tepatnya</strong> portofolio berdarah dalam tiap skenario, sehingga hedging bisa ditargetkan (bukan asal &ldquo;kurangi risiko&rdquo;).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> VaR menjawab &ldquo;bagaimana hari <em>normal yang buruk</em>?&rdquo; (1% ekor dari distribusi biasa). Stress test menjawab &ldquo;bagaimana hari <em>tidak normal</em>?&rdquo; (di luar distribusi — regime break). Keduanya <strong>wajib ada</strong>: VaR untuk sehari-hari, stress untuk eksistensi. Bank yang hanya punya VaR seperti pilot yang hanya latihan cuaca cerah.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Stress test = VaR dengan confidence level lebih tinggi (misal 99,9%).&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR 99,9% masih mengasumsikan <strong>distribusi yang sama</strong> — hanya ekor yang lebih jauh. Stress test mengasumsikan <strong>distribusinya sendiri berubah</strong> (korelasi melonjak, likuiditas hilang, hubungan yang stabil jadi tidak stabil). Ini perbedaan <em>kualitatif</em>, bukan sekadar &ldquo;lebih parah&rdquo;.</p>
      </div>

      <h2 id="desain">Merancang Skenario yang Baik</h2>
      <p>Skenario yang baik memenuhi <strong>4 kriteria</strong>:</p>
      <ol>
        <li><strong>Parah tapi plausible</strong> — cukup parah untuk menguji batas, cukup plausible untuk ditanggapi serius. &ldquo;Semua aset -100%&rdquo; parah tapi tidak plausible → diabaikan direksi.</li>
        <li><strong>Konsisten antar faktor</strong> — punya <strong>narasi makro</strong> yang mengikat: &ldquo;resesi global → ekuitas −30%, spread +400bp, flight-to-quality → yield −100bp, USD menguat&rdquo;. Tanpa narasi, shock acak bisa saling meniadakan atau mustahil bersamaan.</li>
        <li><strong>Relevan dengan portofolio</strong> — skenario harus &ldquo;menggigit&rdquo; eksposur terbesar bank. Bank dengan portofolio KPR butuh skenario properti; bank dagang butuh skenario FX/komoditas.</li>
        <li><strong>Menangkap interaksi</strong> — krisis menyerang bergerombol: sertakan <strong>korelasi stres</strong> (korelasi → 1), <strong>likuiditas kering</strong> (tidak bisa keluar tanpa slippage besar), dan <strong>umpan balik</strong> (margin call → forced selling → harga makin jatuh).</li>
      </ol>
      <p><strong>Rumus dampak</strong> (orde-1 + orde-2, dari MR1/MR4):</p>
      <Tex math={String.raw`\Delta V_{\text{skenario}} \approx \sum_i S_i \cdot \Delta f_i^{\text{skenario}} + \tfrac{1}{2}\sum_i \Gamma_i \cdot (\Delta f_i^{\text{skenario}})^2`} block />
      <p><strong>Artinya:</strong> jumlahkan kontribusi tiap faktor (sensitivitas × shock skenario) + koreksi orde-2 untuk posisi non-linear. Untuk shock besar, orde-2 <strong>tidak boleh</strong> diabaikan (ingat MR4: suku kuadratik mendominasi).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Skenario terparah = skenario terbaik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> skenario yang terlalu ekstrem dan tidak plausible akan <strong>diabaikan</strong> pengambil keputusan (&ldquo;itu tidak akan terjadi&rdquo;). Seni stress test: cukup parah untuk memaksa tindakan, cukup plausible untuk dipercaya. Skenario &ldquo;kiamat&rdquo; tanpa narasi = latihan yang tidak mengubah apa-apa.</p>
      </div>

      <h2 id="reverse">Reverse Stress Test: Mulai dari Kematian</h2>
      <p><strong>Definisi.</strong> Alih-alih &ldquo;skenario → dampak&rdquo;, reverse stress membalik: <strong>&ldquo;dampak yang tak tertahankan → skenario apa yang menyebabkannya?&rdquo;</strong></p>
      <p><strong>Langkah-langkah:</strong></p>
      <ol>
        <li><strong>Tetapkan ambang kematian:</strong> misal kerugian &gt; Rp500 M, atau CET1 &lt; 8%, atau gagal memenuhi kewajiban.</li>
        <li><strong>Cari kombinasi pemicu:</strong> kombinasi shock faktor apa yang menembus ambang itu? (Grid search seperti Lab 2.)</li>
        <li><strong>Nilai plausibilitas:</strong> dari kombinasi-kombinasi itu, mana yang <strong>paling plausible</strong>? Kombinasi &ldquo;yield +50bp &amp; spread +800bp&rdquo; mungkin menembus batas tapi mustahil bersamaan — abaikan. Kombinasi &ldquo;yield +200bp &amp; spread +300bp&rdquo; yang plausible = <strong>temuan utama</strong>.</li>
        <li><strong>Tindak lanjuti:</strong> untuk tiap pemicu plausible → rancang mitigasi (hedge, kurangi eksposur, siapkan likuiditas darurat).</li>
      </ol>
      <p><strong>Kenapa powerful:</strong> stress test biasa bisa <strong>melewatkan</strong> kombinasi mematikan yang tidak terpikirkan analis (&ldquo;unknown unknowns&rdquo;). Reverse stress <strong>menemukannya secara sistematis</strong> — ia bertanya ke seluruh ruang skenario, bukan cuma yang terpikirkan.</p>

      <PlotlyChart
        data={revData}
        title="Reverse Stress: Plausibilitas Skenario Pemicu 'Kerugian > Rp500 M'"
        layout={{ xaxis: { title: "Skenario pemicu" }, yaxis: { title: "Skor plausibilitas (0-100)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu kombinasi peristiwa yang cukup untuk menembus batas toleransi (rugi &gt; Rp500 M). Tinggi batang = plausibilitas (dari data historis + penilaian analis).</p>
        <p><strong>Interpretasi:</strong> skenario &ldquo;kiamat&rdquo; memang menembus batas tapi plausibilitasnya <strong>rendah</strong> (2) — bukan prioritas. <strong>Temuan utama:</strong> &ldquo;spread +400bp + likuiditas kering&rdquo; (plausibilitas 12) dan &ldquo;spread +200bp&rdquo; (22) — kombinasi yang <em>cukup plausible</em> untuk ditindaklanjuti. <strong>Reverse stress memaksa prioritas pada yang plausible, bukan yang paling dramatis.</strong></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> stress test biasa = &ldquo;dokter memeriksa pasien dengan daftar penyakit yang diketahui&rdquo;. Reverse stress = &ldquo;dokter bertanya: gejala apa yang akan membunuh pasien ini, dan penyakit apa yang menyebabkannya?&rdquo; Yang kedua menemukan penyakit yang tidak ada di daftar.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Terapkan Skenario ke Portofolio</h2>
      <p>Ubah shock tiap skenario di fungsi <code className="inline">stress()</code>. Skenario mana yang paling menyakitkan — dan faktor apa penyebabnya? (Petunjuk: lihat waterfall di atas.)</p>
      <PyodideLab
        title="Lab 1 — Dampak Skenario via Sensitivitas"
        hint="Coba skenario 'stagflasi ekstrem': y+500bp, s+500bp, IDR-2000. Perhatikan kontribusi orde-2 (convexity) — untuk shock besar ia tidak lagi bisa diabaikan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Reverse Stress — Cari Pemicu Batas Toleransi</h2>
      <p>Ubah <code className="inline">batas</code> toleransi dan grid shock. Kombinasi apa yang paling plausible untuk menembus batas barumu?</p>
      <PyodideLab
        title="Lab 2 — Dari Batas Toleransi ke Skenario Pemicu"
        hint="Coba batas Rp200 M (lebih ketat): kombinasi pemicu yang plausible makin BANYAK — artinya toleransi ketat = lebih banyak skenario yang harus dimitigasi. Itulah harga keamanan."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Butuh skenario yang kredibel &amp; mudah dijelaskan → <strong>Historis</strong></h3>
        <p><strong>Kondisi:</strong> presentasi ke direksi/regulator; butuh &ldquo;bukti pernah terjadi&rdquo;.</p>
        <p><strong>Alasan:</strong> plausible by construction, korelasi krisis otomatis konsisten. Lengkapi dengan minimal 2 episode berbeda (2008 + 2020) agar tidak fighting the last war.</p>
      </div>

      <div className="decision-card">
        <h3>2. Portofolio punya eksposur baru yang tak ada di krisis lalu → <strong>Hipotetis</strong></h3>
        <p><strong>Kondisi:</strong> eksposur ke faktor/aset yang tidak bergerak di episode historis.</p>
        <p><strong>Alasan:</strong> hanya skenario rancangan yang bisa menargetkan kelemahan kini. Wajib punya narasi makro yang konsisten.</p>
      </div>

      <div className="decision-card">
        <h3>3. Cari blind spot / kombinasi tak terpikirkan → <strong>Reverse stress</strong></h3>
        <p><strong>Kondisi:</strong> review tahunan risiko eksistensial; setelah perubahan besar portofolio.</p>
        <p><strong>Alasan:</strong> satu-satunya metode yang mencari secara sistematis di seluruh ruang skenario. Fokus tindak lanjut pada pemicu <em>paling plausible</em>, bukan paling dramatis.</p>
      </div>

      <div className="decision-card">
        <h3>4. Keputusan modal &amp; risk appetite → <strong>Ketiganya + VaR/ES</strong></h3>
        <p><strong>Kondisi:</strong> penetapan batas toleransi, alokasi modal.</p>
        <p><strong>Alasan:</strong> VaR/ES untuk &ldquo;hari buruk yang normal&rdquo;, stress test untuk &ldquo;hari tidak normal&rdquo;. Tidak ada satu metrik yang cukup sendirian.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Narasi dulu, angka kemudian</strong> — skenario tanpa cerita makro = shock acak.</li>
          <li><strong>Parah tapi plausible</strong> — yang terlalu ekstrem akan diabaikan.</li>
          <li><strong>Reverse setahun sekali</strong> — untuk menemukan yang tak terpikirkan.</li>
          <li>Stress test yang tidak mengubah <strong>keputusan</strong> = latihan yang gagal.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Membedah Skenario 2008 — Angka Aktual dan Kalibrasi</h2>
      <p>&ldquo;Skenario 2008&rdquo; sering disebut-sebut tapi jarang dibedah angkanya. Bagian ini menyajikan <strong>pergerakan faktor aktual</strong> 2007–2009, contoh hitung dampak multi-faktor orde-1 + orde-2 langkah-demi-langkah, dan bagaimana skenario stres dipakai regulator (CCAR/EBA) — supaya &ldquo;stress test&rdquo; bagimu menjadi angka, bukan jargon.</p>

      <h3>Angka-angka 2008 yang perlu dihafal</h3>
      <p>Berikut pergerakan faktor kunci dari puncak (2007) ke lembah (awal 2009) — jangkar untuk mengkalibrasi skenario &ldquo;parah tapi plausible&rdquo;:</p>
      <ul>
        <li><strong>Ekuitas AS (S&amp;P 500):</strong> −57% (1.565 → 676). IHSG: −55%+.</li>
        <li><strong>Credit spread IG:</strong> dari ~100 bp ke <strong>~600 bp</strong> (6×). High-yield: ke <strong>~2.000 bp</strong>.</li>
        <li><strong>VIX:</strong> 10–20 → <strong>80,9</strong>.</li>
        <li><strong>Harga rumah AS (Case-Shiller):</strong> −27% nasional; MBS/ CDO mezzanine: −60% hingga −90%.</li>
        <li><strong>Yield Treasury 10Y:</strong> <em>turun</em> 5% → 2% (flight to quality) — obligasi pemerintah <em>untung</em> saat semua rugi.</li>
        <li><strong>Korelasi ekuitas global:</strong> menuju <strong>0,9</strong> — diversifikasi geografis menguap.</li>
        <li><strong>FX:</strong> USD <em>menguat</em> terhadap hampir semua mata uang (safe haven) — posisi short USD terpukul dua kali.</li>
      </ul>
      <p>Perhatikan <strong>asimetrinya</strong>: tidak semua faktor bergerak &ldquo;buruk&rdquo; ke arah yang sama. Treasury menguat (yield turun) — portofolio yang long duration justru terbantu. Skenario yang hanya mengasumsikan &ldquo;semua buruk&rdquo; tanpa arah yang benar akan <strong>salah menghitung hedge alami</strong>. Inilah mengapa skenario historis unggul dalam konsistensi: arah-arah ini tertangkap otomatis.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: dampak skenario 2008 ke portofolio campuran (klik untuk buka)</summary>
        <p><strong>Portofolio</strong> Rp2 triliun: obligasi korporat Rp1 T (durasi 5, DV01 = −Rp500 jt/bp... disederhanakan: sensitivitas spread <Tex math={String.raw`S_{spread} = -\text{Rp }400\text{ jt/bp}`} />, sensitivitas yield <Tex math={String.raw`S_{yield} = -\text{Rp }450\text{ jt/bp}`} />); saham Rp600 M (delta ekuitas <Tex math={String.raw`S_{eq} = \text{Rp}6\text{ M per }1\%`} />); kas Rp400 M.</p>
        <p><strong>Skenario &ldquo;2008 terulang&rdquo;:</strong> spread +400 bp; yield Treasury −150 bp (flight to quality, tapi yield korporat = Treasury + spread → net +250 bp); ekuitas −40%.</p>
        <p><strong>Langkah 1 — komponen spread (orde-1):</strong> <Tex math={String.raw`\Delta V_{spread} = (-400\text{ jt/bp}) \times (+400\text{ bp}) = -\text{Rp}160\text{ M}`} />.</p>
        <p><strong>Langkah 2 — komponen yield Treasury (orde-1):</strong> <Tex math={String.raw`\Delta V_{yield} = (-450\text{ jt/bp}) \times (-150\text{ bp}) = +\text{Rp}67{,}5\text{ M}`} /> (obligasi terbantu penurunan yield acuan).</p>
        <p><strong>Langkah 3 — komponen ekuitas (orde-1):</strong> <Tex math={String.raw`\Delta V_{eq} = (6\text{ M}/\%) \times (-40\%) = -\text{Rp}240\text{ M}`} />.</p>
        <p><strong>Langkah 4 — koreksi orde-2 (convexity obligasi):</strong> dengan convexity <Tex math={String.raw`C`} /> dan <Tex math={String.raw`\Delta y_{net} = +250`} /> bp: <Tex math={String.raw`\tfrac{1}{2} C (\Delta y)^2 \approx +\text{Rp }18\text{ M}`} /> (convexity selalu <em>menguntungkan</em> pemegang obligasi polos — <em>long convexity</em>).</p>
        <p><strong>Langkah 5 — total:</strong> −160 + 67,5 − 240 + 18 = <strong>−Rp314,5 M</strong> (≈ 15,7% dari portofolio). Kontributor terbesar: <strong>ekuitas</strong>, lalu spread.</p>
        <p><strong>Angka ini artinya:</strong> (a) hedge alami bekerja — penurunan yield Treasury menahan sebagian luka spread; skenario yang mengabaikan arah Treasury akan <em>overestimate</em> kerugian obligasi; (b) orde-2 (+Rp18 M) kecil di sini tapi <strong>menentukan</strong> untuk portofolio opsi (MR11) di mana gamma mendominasi; (c) total 15,7% adalah <strong>kerugian skenario</strong>, bukan prediksi — ia menjawab &ldquo;berapa besar jika&rdquo;, dan dibandingkan dengan buffer modal untuk menilai kecukupan.</p>
      </details>

      <h3>Stress test regulator: CCAR dan EBA</h3>
      <p>Stress test bukan hanya alat internal — ia adalah <strong>ujian kelulusan tahunan</strong> bank besar:</p>
      <ul>
        <li><strong>CCAR (AS, The Fed):</strong> skenario makro disediakan regulator (severely adverse: GDP −, pengangguran ke 10%, pasar saham −50%+). Bank memproyeksikan kerugian, pendapatan, dan modal 9 kuartal ke depan. Gagal → <strong>rencana distribusi modal (dividen/buyback) ditolak</strong> — hukuman yang sangat nyata bagi pemegang saham.</li>
        <li><strong>EBA (Eropa):</strong> pola serupa; hasil dipublikasikan — menjadi <strong>disiplin pasar</strong> (bank dengan hasil buruk dihukum harga sahamnya).</li>
        <li><strong>Indonesia (OJK):</strong> bank wajib melakukan stress test berkala sebagai bagian manajemen risiko; skenario mencakup makro domestik (Rupiah, SBN yield, pertumbuhan kredit).</li>
      </ul>
      <p>Implikasi untuk analis: angka stress test-mu bisa berakhir di <strong>dokumen publik</strong> yang dibaca investor. Asumsi yang asal-asalan bukan hanya kesalahan teknis — ia adalah <strong>risiko reputasi</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Skenario terburuk = skenario paling berguna.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> skenario yang terlalu ekstrem (&ldquo;asteroid menabrak Jakarta&rdquo;) akan <strong>diabaikan direksi</strong> — tidak ada aksi yang diambil karena dianggap mustahil. Skenario terbaik adalah <strong>parah tapi plausible</strong>: cukup buruk untuk memaksa keputusan (tambah modal? kurangi eksposur? siapkan likuiditas?), cukup realistis untuk dipercaya. Ukuran kualitas skenario bukan &ldquo;seberapa besar angkanya&rdquo;, melainkan <strong>&ldquo;seberapa banyak keputusan yang berubah karenanya&rdquo;</strong>.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan tiga angka yang sering tertukar di rapat: <strong>(1) VaR</strong> = &ldquo;hari buruk yang normal&rdquo; (probabilistik, harian); <strong>(2) Kerugian skenario</strong> = &ldquo;jika 2008 terulang, kita rugi X&rdquo; (deterministik, kondisional); <strong>(3) Buffer modal vs skenario</strong> = &ldquo;apakah X masih di bawah modal kita?&rdquo; (keputusan). Stress test yang berhenti di angka (2) tanpa sampai ke (3) adalah <strong>pekerjaan setengah jadi</strong> — seperti diagnosis tanpa resep.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: proyeksi modal 9 kuartal ala CCAR (versi sederhana) (klik untuk buka)</summary>
        <p><strong>Bank:</strong> CET1 13%, ATMR Rp500 T → modal CET1 = Rp65 T. Skenario <em>severely adverse</em>: GDP −3%, pengangguran 10%, saham −50%.</p>
        <p><strong>Kuartal 1–4 (tahun 1):</strong> kerugian kredit Rp18 T + kerugian pasar Rp7 T + pendapatan operasional Rp12 T → laba bersih −Rp13 T → CET1 = (65−13)/500 = <strong>10,4%</strong>.</p>
        <p><strong>Kuartal 5–9:</strong> kerugian melambat (Rp8 T), pendapatan pulih (Rp15 T) → +Rp7 T → CET1 = (52+7)/500 = <strong>11,8%</strong>.</p>
        <p><strong>Minimum: 10,4%</strong> — di atas batas 4,5% + buffer 2,5% = 7% → <strong>LOLOS</strong>, boleh bagi dividen.</p>
        <p><strong>Yang diperiksa regulator:</strong> bukan cuma angka akhir — melainkan <strong>asumsi</strong>: apakah kerugian kredit 18 T konsisten dengan pengangguran 10%? Apakah pendapatan 12 T realistis saat krisis (atau <em>overoptimis</em>)? Bank yang &ldquo;lolos&rdquo; dengan asumsi ajaib akan <strong>ditolak rencana modalnya</strong> — karena CCAR menguji <strong>kejujuran</strong>, bukan cuma aritmatika.</p>
      </details>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Portofolio obligasi Rp1 T: sensitivitas spread −Rp200 jt/bp, sensitivitas yield −Rp250 jt/bp. Skenario: spread +300 bp, yield −100 bp. Hitung ΔV orde-1. Mengapa hasilnya &ldquo;menipu&rdquo; jika berhenti di sini? (klik untuk pembahasan)</summary>
        <p><Tex math={String.raw`\Delta V = (-200)(+300) + (-250)(-100) = -60.000 + 25.000 = -\text{Rp}35\text{ M}`} />.</p>
        <p><strong>Menipu karena:</strong> (1) tanpa <strong>orde-2</strong> (convexity) — untuk shock 300 bp, koreksi convexity material; (2) tanpa <strong>korelasi stres</strong> — skenario mengasumsikan spread dan yield bergerak independen, padahal saat krisis keduanya berkorelasi (flight to quality menekan yield <em>bersamaan</em> spread melebar — arahnya justru konsisten di sini, tapi besarnya tidak); (3) tanpa <strong>likuiditas</strong> — bisakah Rp1 T obligasi dijual di harga ini saat stres? (4) Ini <em>satu</em> skenario — belum menjawab &ldquo;skenario apa yang membunuh kita?&rdquo; (reverse stress).</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Rancang reverse stress test untuk bank dengan toleransi &ldquo;CET1 tidak boleh &lt; 10%&rdquo;. Tuliskan 4 langkahnya. (klik untuk pembahasan)</summary>
        <p><strong>(1) Ambang kematian:</strong> CET1 &lt; 10% (misal dari 14% → butuh kerugian RpX T; hitung X dari ATMR). <strong>(2) Cari pemicu:</strong> grid search kombinasi (ekuitas −a%, spread +b bp, yield ±c bp, FX −d%) yang menghasilkan kerugian ≥ X. <strong>(3) Nilai plausibilitas:</strong> bandingkan tiap kombinasi dengan histori (2008/2020) + penilaian makro — buang yang mustahil, prioritaskan yang plausible. <strong>(4) Tindak lanjuti:</strong> untuk tiap pemicu plausible → mitigasi spesifik (hedge, jual, tambah modal, siapkan likuiditas) + pemilik + tenggat.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Direksi meminta &ldquo;skenario terburuk yang mungkin&rdquo;. Mengapa permintaan ini berbahaya, dan apa respons profesionalmu? (klik untuk pembahasan)</summary>
        <p><strong>Berbahaya karena:</strong> &ldquo;terburuk yang mungkin&rdquo; = tak terbatas (asteroid, perang nuklir) → hasilnya diabaikan sebagai fantasi → <em>tidak ada keputusan yang berubah</em> → stress test gagal mencapai tujuannya.</p>
        <p><strong>Respons:</strong> tawarkan <strong>spektrum</strong>: (a) skenario historis (2008, 2020 — &ldquo;ini <em>pernah</em> terjadi&rdquo;), (b) hipotetis parah-tapi-plausible (&ldquo;ini <em>bisa</em> terjadi&rdquo;), (c) reverse stress (&ldquo;ini yang <em>membunuh</em> kita&rdquo;). Tekankan: kualitas skenario diukur dari <strong>keputusan yang berubah</strong>, bukan besar angkanya.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Skenario yang Terlalu Sopan</h2>
      <div className="callout">
        <p>Bank GHI menjalankan stress test tahunan dengan skenario &ldquo;parah&rdquo;: ekuitas −20%, spread +150bp, yield +100bp — masing-masing diambil dari <strong>persentil 99% historis sendiri-sendiri</strong>. Hasil: rugi Rp180 M, dalam toleransi Rp300 M. Direksi lega.</p>
        <ul>
          <li>Analis junior mencatat: ketiga shock diambil <strong>independen</strong> — tidak ada skenario di mana ketiganya terjadi <em>bersamaan</em></li>
          <li>Data 2008 menunjukkan ketiganya <strong>memang terjadi bersamaan</strong> (korelasi → 1)</li>
          <li>Tidak ada skenario likuiditas (asumsi: semua posisi bisa dijual dalam 10 hari tanpa slippage)</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Apa cacat metodologis skenario ini? (b) Rancang skenario pengganti yang memenuhi 4 kriteria. (c) Apa peran reverse stress di sini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga cacat:</strong> (1) <em>Shock independen</em> — persentil 99% tiap faktor sendiri-sendiri ≠ skenario 99% gabungan; krisis = korelasi → 1. (2) <em>Tanpa narasi</em> — tidak jelas peristiwa makro apa yang menyebabkan ketiganya. (3) <em>Tanpa likuiditas</em> — asumsi bisa keluar 10 hari tanpa biaya adalah fiksi saat krisis (lihat LVaR, MR13).</p>
          <p>(b) <strong>Skenario pengganti:</strong> narasi &ldquo;resesi global + krisis pendanaan&rdquo; → ekuitas −35%, spread +400bp, yield −50bp (flight to quality — perhatikan <em>tanda</em> berubah!), USD/IDR +20%, <strong>likuiditas: slippage 5%</strong> untuk posisi besar. Parah tapi plausible (mirip 2008/2020), konsisten (satu narasi), relevan, menangkap interaksi.</p>
          <p>(c) <strong>Reverse stress</strong> akan bertanya: &ldquo;kombinasi apa yang menembus Rp300 M?&rdquo; — dan kemungkinan menemukan bahwa <strong>kombinasi moderat + likuiditas kering</strong> sudah cukup menembus batas, tanpa perlu shock ekstrem. Temuan seperti ini mengubah fokus mitigasi: dari &ldquo;siap hadapi shock besar&rdquo; menjadi &ldquo;siap hadapi pasar yang tidak bisa dijual&rdquo;.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan FUNDAMENTAL stress test vs VaR 99,9%?"
        options={[
          "Tidak ada — sama saja",
          "VaR 99,9% masih mengasumsikan distribusi yang sama (ekor lebih jauh); stress test mengasumsikan distribusinya BERUBAH (korelasi, likuiditas, hubungan rusak)",
          "Stress test lebih cepat dihitung",
          "VaR tidak bisa 99,9%",
        ]}
        correct={1}
        explanation="Benar. Ini perbedaan kualitatif: stress = regime break. Menaikkan confidence VaR tidak akan menangkap korelasi yang melonjak atau likuiditas yang hilang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kelemahan utama skenario historis?"
        options={[
          "Terlalu sulit dihitung",
          "Fighting the last war — krisis berikutnya berbeda; eksposur baru yang tak bergerak di krisis lalu tidak teruji",
          "Tidak plausible",
          "Tidak bisa dijelaskan ke direksi",
        ]}
        correct={1}
        explanation="Benar. Skenario historis kredibel tapi buta terhadap yang belum terjadi. Selalu pasangkan dengan skenario hipotetis yang menargetkan portofolio KINI."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Skenario hipotetis: ekuitas +20% BERSAMAAN dengan yield +500bp, tanpa narasi. Masalahnya?"
        options={[
          "Tidak ada — skenario bebas",
          "Inkonsisten secara ekonomi — tanpa narasi makro yang menjelaskan kombinasi mustahil, hasilnya sampah",
          "Terlalu parah",
          "Terlalu ringan",
        ]}
        correct={1}
        explanation="Benar. Skenario hipotetis wajib punya narasi yang mengikat shock-shocknya. Kombinasi tanpa logika ekonomi menghasilkan angka yang tidak bisa ditindaklanjuti."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Reverse stress test dimulai dari?"
        options={[
          "Skenario makro",
          "Hasil yang tidak dapat diterima (ambang kematian) — lalu mundur mencari kombinasi pemicu yang paling plausible",
          "Data historis",
          "VaR harian",
        ]}
        correct={1}
        explanation="Benar. Reverse = 'dampak → penyebab'. Kekuatannya: menemukan blind spot yang tidak terpikirkan analis, lalu memprioritaskan pemicu yang PALING PLAUSIBLE."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dalam reverse stress, ditemukan 2 pemicu batas toleransi: (A) 'kiamat' plausibilitas 2/100, (B) 'spread+400bp & likuiditas kering' plausibilitas 12/100. Prioritas?"
        options={[
          "A — lebih dramatis",
          "B — lebih plausible, jadi lebih mungkin benar-benar terjadi dan harus dimitigasi dulu",
          "Keduanya sama",
          "Abaikan keduanya",
        ]}
        correct={1}
        explanation="Benar. Reverse stress memaksa prioritas pada plausibilitas, bukan drama. Skenario kiamat yang tak plausible hanya membuang perhatian mitigasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Stress test tahunan selesai, hasilnya 'dalam toleransi', tidak ada keputusan berubah. Penilaian?"
        options={[
          "Sukses — berarti bank aman",
          "Gagal sebagai latihan — stress test yang tidak mengubah keputusan (limit, hedge, kontinjensi) = ritual kepatuhan, bukan manajemen risiko",
          "Berarti skenarionya sempurna",
          "Tidak perlu diulang tahun depan",
        ]}
        correct={1}
        explanation="Benar. Tujuan stress test BUKAN menghasilkan laporan — melainkan mengubah keputusan. Jika tidak ada tindak lanjut, ia hanya ritual. Selalu tutup dengan: 'jadi apa yang kita ubah?'"
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Stress test</strong> = uji &ldquo;hari tidak normal&rdquo; (regime break); <strong>VaR/ES</strong> = uji &ldquo;hari buruk yang normal&rdquo;. Keduanya wajib.</li>
          <li><strong>Historis:</strong> kredibel &amp; konsisten otomatis; buta terhadap krisis baru. <strong>Hipotetis:</strong> menargetkan kelemahan kini; wajib bernarasi konsisten.</li>
          <li><strong>Reverse stress:</strong> dari ambang kematian mundur ke pemicu → temukan blind spot → prioritaskan yang paling plausible.</li>
          <li>Skenario baik: <strong>parah tapi plausible, konsisten (satu narasi), relevan, menangkap interaksi</strong> (korelasi → 1, likuiditas kering).</li>
          <li>Dampak: <Tex math={String.raw`\Delta V \approx \sum S_i\Delta f_i + \tfrac{1}{2}\sum\Gamma_i(\Delta f_i)^2`} /> — orde-2 wajib untuk shock besar.</li>
          <li>Stress test yang tidak mengubah <strong>keputusan</strong> = ritual, bukan manajemen risiko.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr6-backtesting" className="btn btn-secondary btn-sm">← MR6</Link>
        <Link href="/learn/mr8-risiko-suku-bunga" className="btn btn-primary btn-sm">Next: MR8 →</Link>
      </div>
    </div>
  );
}
