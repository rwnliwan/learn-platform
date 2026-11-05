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

export default function MR19Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Arsitektur engine: alur data (diagram konseptual via bar)
  const archData = [
    {
      x: ["1. Data harga", "2. Return & vol", "3. VaR 3 metode", "4. ES", "5. Backtest", "6. Stress", "7. Laporan"],
      y: [1, 2, 3, 4, 5, 6, 7],
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#ef4444", "#22c55e"] },
    },
  ];

  // Contoh output engine: VaR 3 metode vs ES (simulasi)
  const r = rng(19);
  const methods = ["Historical", "Parametrik", "Monte Carlo"];
  const varVals = [42, 35, 44];
  const esVals = [58, 41, 63];

  const outData = [
    { x: methods, y: varVals, type: "bar", name: "VaR 99% (Rp M)", marker: { color: "#2a7de1" } },
    { x: methods, y: esVals, type: "bar", name: "ES 99% (Rp M)", marker: { color: "#e8a838" } },
  ];

  const lab1Code = String.raw`# CAPSTONE - MILESTONE 1: VaR Engine (3 metode) + ES
# Portofolio: Rp10 M, 60% saham (proxy IHSG) + 40% obligasi (proxy SBN 10Y).
# Data: bangkitkan 500 hari return dua faktor berkorelasi.

import random, math
random.seed(2026)

N, V0 = 500, 10_000_000_000
rho = 0.25  # korelasi saham-obligasi
sigs, sigo = 0.015, 0.004  # vol harian

rets_s, rets_o = [], []
for _ in range(N):
    z1, z2 = random.gauss(0,1), random.gauss(0,1)
    rs = sigs * z1
    ro = sigo * (rho*z1 + math.sqrt(1-rho*rho)*z2)
    rets_s.append(rs); rets_o.append(ro)
rets_p = [0.6*rs + 0.4*ro for rs, ro in zip(rets_s, rets_o)]

def percentile(xs, p):
    s = sorted(xs); k = (len(s)-1)*p; f = math.floor(k)
    return s[f] + (s[f+1]-s[f])*(k-f)

# 1) HISTORICAL
var_hs = -percentile([V0*r for r in rets_p], 0.01)
# 2) PARAMETRIK
m = sum(rets_p)/N
sig = math.sqrt(sum((x-m)**2 for x in rets_p)/(N-1))
var_par = 2.33 * sig * V0
# 3) MONTE CARLO (GBM 1-hari, 20000 skenario)
sims = sorted([V0*random.gauss(m, sig) for _ in range(20000)])
var_mc = -sims[int(0.01*20000)]
# ES dari HS
es_hs = -sum(sorted([V0*r for r in rets_p])[:int(0.01*N)])/int(0.01*N)

print("=== MILESTONE 1: VaR ENGINE ===")
print(f"VaR 99% Historical : Rp {var_hs:>12,.0f}")
print(f"VaR 99% Parametrik : Rp {var_par:>12,.0f}")
print(f"VaR 99% Monte Carlo: Rp {var_mc:>12,.0f}")
print(f"ES  99% Historical : Rp {es_hs:>12,.0f}")
print(f"Rasio ES/VaR       : {es_hs/var_hs:.2f}")
print()
print("TUGAS: simpan hasil ini. Di Milestone 2, backtest ketiganya.")
print("Pertanyaan: metode mana paling 'jujur' utk data ini? Buktikan dgn backtest.")`;

  const lab2Code = String.raw`# CAPSTONE - MILESTONE 2&3: Backtest + Stress Test
# Lanjutan Milestone 1: uji ketiga metode VaR + skenario stres.

import random, math
random.seed(77)

N, V0 = 500, 10_000_000_000
# Data 'masa depan' (out-of-sample): 250 hari dgn 15 hari krisis di tengah
rets = [random.gauss(0.0003, 0.011) for _ in range(250)]
for i in range(120, 135):
    rets[i] = random.gauss(-0.02, 0.03)  # krisis mini

# VaR dari Milestone 1 (contoh angka -- GANTI dgn hasilmu!)
var_hs, var_par, var_mc = 380_000_000, 330_000_000, 390_000_000

def kupiec(T, x, p=0.01):
    if x in (0, T): return float('inf'), 0.0
    ph = x/T
    lr = (-2*math.log((1-p)**(T-x)*p**x)
          + 2*math.log((1-ph)**(T-x)*ph**x))
    return lr, 1-math.erf(math.sqrt(lr/2)) if lr>0 else 1.0

print("=== MILESTONE 2: BACKTEST (250 hari, ekspektasi 2.5 pelanggaran) ===")
for nama, var in [("Historical", var_hs), ("Parametrik", var_par), ("Monte Carlo", var_mc)]:
    x = sum(1 for rt in rets if -V0*rt > var)
    lr, pv = kupiec(N//2, x)
    print(f"{nama:12s}: {x} pelanggaran, LR={lr:.2f}, p={pv:.3f} -> {'LOLOS' if pv>0.05 else 'GAGAL'}")

print()
print("=== MILESTONE 3: STRESS TEST ===")
# Skenario: korelasi melonjak 0.25->0.8, vol 2x lipat (krisis)
stress_rets = [r*2.0 for r in rets[:250]]
# aproksimasi: kerugian skenario = kuantil 1% dari return stres
stress_loss = -percentile_sorted(sorted([V0*r for r in stress_rets]), 0.01)
print(f"Kerugian skenario 'krisis' (1% terburuk): Rp {stress_loss:,.0f}")
print(f"vs VaR HS: {stress_loss/var_hs:.1f}x lipat!")
print()
print("TUGAS: tulis LAPORAN 1 halaman: metode mana dipakai utk limit,")
print("berapa angkanya, apa stress-nya, dan apa rekomendasi aksimu.")

def percentile_sorted(s, p):
    k = (len(s)-1)*p; f = math.floor(k)
    return s[f] + (s[f+1]-s[f])*(k-f)`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR19 — Market Risk Analytics • CAPSTONE</span>
        <h1 className="display-title">Capstone: Bangun VaR/ES Engine<br />+ Backtest + Stress Report</h1>
        <div className="meta">Proyek akhir track &bull; 4 milestone &bull; estimasi 3–4 jam &bull; 1 laporan</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Proyek</a></li>
          <li><a href="#cerita">Cerita Pembuka: Wawancara yang Menentukan</a></li>
          <li><a href="#arsitektur">Arsitektur Engine</a></li>
          <li><a href="#m1">Milestone 1: VaR Engine (3 Metode) + ES</a></li>
          <li><a href="#m2">Milestone 2: Backtesting Ketiganya</a></li>
          <li><a href="#m3">Milestone 3: Stress Test</a></li>
          <li><a href="#m4">Milestone 4: Laporan Risiko 1 Halaman</a></li>
          <li><a href="#lab1">🔬 Lab 1: Milestone 1 (Starter Code)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Milestone 2 &amp; 3 (Starter Code)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Desain Engine</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Walkthrough Angka End-to-End + Panduan Wawancara</a></li>
          <li><a href="#case">📋 Mini-Case: Engine yang &ldquo;Berhasil&rdquo; Tapi Menyesatkan</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman Track</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Proyek</h2>
      <div className="callout">
        <ul>
          <li>Membangun <strong>VaR engine</strong> yang menghitung VaR 99% dengan <strong>3 metode</strong> (historical, parametrik, Monte Carlo) + <strong>ES</strong> untuk satu portofolio.</li>
          <li>Mem-<strong>backtest</strong> ketiga metode (Kupiec) dan memilih metode untuk limit dengan <strong>alasan</strong>.</li>
          <li>Merancang dan menjalankan <strong>stress test</strong> (1 historis + 1 hipotetis + 1 reverse sederhana).</li>
          <li>Menulis <strong>laporan risiko 1 halaman</strong> yang bisa dibaca direksi — dengan angka, keputusan, dan aksi.</li>
          <li>Mendemonstrasikan seluruh rantai MR1–MR18 dalam satu artefak kerja.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Wawancara yang Menentukan</h2>
      <div className="story">
        <p>Bayangkan 6 bulan dari sekarang. Kamu duduk di wawancara <strong>Market Risk Analyst</strong> di sebuah bank. Pewawancara bertanya: <em>&ldquo;Ceritakan pengalamanmu membangun model risiko.&rdquo;</em></p>
        <p>Kandidat A menjawab: &ldquo;Saya pernah belajar VaR — rumusnya z × σ.&rdquo; Kandidat B membuka laptop: <em>&ldquo;Ini VaR engine yang saya bangun — 3 metode, backtest Kupiec untuk ketiganya, stress test dengan skenario 2008 dan skenario hipotetis, plus laporan 1 halaman dengan rekomendasi limit. Metode historical saya tolak karena gagal backtest saat krisis mini — saya pilih Monte Carlo dengan alasan ini…&rdquo;</em></p>
        <p>Twist-nya: pewawancara tidak menguji hafalan rumus — ia menguji <strong>judgment</strong>. &ldquo;Kenapa pilih metode ini? Apa kelemahannya? Kapan ia gagal?&rdquo; — semua pertanyaan yang <strong>hanya bisa dijawab</strong> oleh orang yang benar-benar <em>membangun</em>, bukan menghafal. Capstone ini mengubahmu dari Kandidat A menjadi Kandidat B.</p>
      </div>

      <h2 id="arsitektur">Arsitektur Engine</h2>
      <p>Engine yang kamu bangun punya <strong>7 tahap</strong> — cerminan seluruh track:</p>

      <PlotlyChart
        data={archData}
        title="Arsitektur VaR/ES Engine (7 tahap)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "", showticklabels: false }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = 7 tahap pipeline, warna = kelompok (abu = input, biru = perhitungan, kuning = validasi, merah = stres, hijau = output).</p>
        <p><strong>Interpretasi:</strong> perhatikan <strong>urutan yang disengaja</strong>: validasi (backtest) datang <em>sebelum</em> laporan — angka yang belum diuji tidak boleh dilaporkan. Dan stress test <strong>sejajar</strong> dengan VaR, bukan sesudahnya — keduanya adalah <em>pilar kembar</em>, bukan urutan. Arsitektur ini = ringkasan visual seluruh track MR1–MR18.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> engine yang baik <strong>memisahkan</strong> perhitungan, validasi, dan pelaporan menjadi modul independen — sehingga tiap bagian bisa diganti/diuji sendiri (ganti metode VaR tanpa menyentuh backtest). Ini bukan cuma &ldquo;clean code&rdquo; — ini <strong>disiplin validasi</strong> (MR18): modul terpisah = bisa divalidasi terpisah.</p>
      </div>

      <h2 id="m1">Milestone 1: VaR Engine (3 Metode) + ES</h2>
      <p><strong>Spesifikasi:</strong></p>
      <ul>
        <li><strong>Input:</strong> 500 hari return 2 faktor (saham + obligasi, berkorelasi) untuk portofolio Rp10 M (60/40).</li>
        <li><strong>Output:</strong> VaR 99%/1-hari dengan <strong>3 metode</strong> (MR3) + ES 99% (MR5) + rasio ES/VaR.</li>
        <li><strong>Deliverable:</strong> tabel perbandingan + 1 paragraf: &ldquo;metode mana yang paling meyakinkan untuk data ini, dan mengapa?&rdquo;</li>
      </ul>
      <p><strong>Kriteria lolos:</strong> ketiga angka terhitung; rasio ES/VaR ditafsirkan (detektor ekor!); ada hipotesis awal &ldquo;metode mana yang akan menang di backtest&rdquo; <em>sebelum</em> melihat Milestone 2 — <strong>tulis hipotesismu dulu</strong> (melatih judgment, bukan curve-fitting).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone = coding exercise.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> coding hanya 30% — 70% adalah <strong>judgment</strong>: memilih metode, menafsirkan selisih, memutuskan limit, menulis rekomendasi. Pewawancara tidak bertanya &ldquo;apakah kodemu jalan?&rdquo; — ia bertanya &ldquo;kenapa kamu percaya angka ini?&rdquo;. Dokumentasikan <em>alasan</em>, bukan cuma hasil.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak skenario Monte Carlo, makin akurat VaR-nya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> menambah skenario hanya mengurangi <strong>Monte Carlo error</strong> (noise simulasi) — ia <strong>tidak mengurangi model error</strong> (salah asumsi distribusi, parameter basi). 1 juta skenario dari model yang salah = jawaban yang sangat presisi untuk pertanyaan yang salah. Bedakan <em>presisi komputasi</em> dari <em>kebenaran model</em>.</p>
      </div>

      <h2 id="m2">Milestone 2: Backtesting Ketiganya</h2>
      <p><strong>Spesifikasi:</strong></p>
      <ul>
        <li><strong>Data:</strong> 250 hari <em>out-of-sample</em> (berbeda dari data kalibrasi!) dengan <strong>krisis mini</strong> di tengah (15 hari).</li>
        <li><strong>Uji:</strong> Kupiec POF untuk tiap metode (MR6) + hitung <em>kapan</em> pelanggaran terjadi (tersebar vs berkelompok — Christoffersen intuitif).</li>
        <li><strong>Keputusan:</strong> pilih <strong>1 metode</strong> untuk limit operasional + tulis <strong>alasan 3 kalimat</strong>.</li>
      </ul>
      <p><strong>Jebakan yang disengaja:</strong> data out-of-sample mengandung krisis mini — metode yang &ldquo;menang&rdquo; di Milestone 1 (in-sample) <strong>belum tentu</strong> menang di sini. Inilah pelajaran <strong>overfitting</strong> versi risiko: model yang pas dengan masa lalu bisa gagal di masa depan.</p>

      <h2 id="m3">Milestone 3: Stress Test</h2>
      <p><strong>Spesifikasi — 3 skenario (MR7):</strong></p>
      <ol>
        <li><strong>Historis:</strong> &ldquo;2008 terulang&rdquo; — vol 2× lipat, korelasi 0,25 → 0,8.</li>
        <li><strong>Hipotetis:</strong> rancanganmu sendiri — harus punya <strong>narasi</strong> + konsisten antar faktor.</li>
        <li><strong>Reverse sederhana:</strong> &ldquo;kombinasi apa yang membuat kerugian &gt; Rp1 M (10% portofolio)?&rdquo; — cari batasnya.</li>
      </ol>
      <p><strong>Deliverable:</strong> tabel hasil 3 skenario + 1 paragraf: &ldquo;skenario mana yang paling mengkhawatirkan, dan apa mitigasinya?&rdquo;</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> stress test capstone harus <strong>mengubah keputusanmu</strong> — jika semua skenario &ldquo;aman&rdquo;, skenariomu terlalu sopan (ingat MR7: stress yang tidak mengubah keputusan = gagal). Paksa satu skenario hingga menembus batas — lalu rancang mitigasinya. Itulah latihan yang jujur.</p>
      </div>

      <h2 id="m4">Milestone 4: Laporan Risiko 1 Halaman</h2>
      <p><strong>Spesifikasi</strong> (MR17 — laporan yang dibaca, bukan diarsip):</p>
      <ul>
        <li><strong>5 angka:</strong> VaR (metode terpilih), ES, hasil backtest (lolos/gagal), kerugian skenario terburuk, utilisasi limit.</li>
        <li><strong>3 warna:</strong> hijau/kuning/merah per metrik.</li>
        <li><strong>1 paragraf aksi:</strong> &ldquo;berdasarkan ini, saya merekomendasikan ___ karena ___.&rdquo;</li>
        <li><strong>1 paragraf keterbatasan:</strong> &ldquo;angka ini tidak menangkap ___; untuk itu butuh ___.&rdquo; — <strong>kejujuran adalah nilai tertinggi</strong>.</li>
      </ul>
      <p><strong>Kriteria kelulusan capstone:</strong> keempat milestone selesai + laporan 1 halaman + <strong>paragraf keterbatasan yang jujur</strong>. Tanpa paragraf keterbatasan = belum lulus (analis yang tidak tahu batas modelnya = berbahaya).</p>

      <PlotlyChart
        data={outData}
        title="Contoh Output Engine: VaR vs ES per Metode (Rp juta)"
        layout={{ barmode: "group", xaxis: { title: "Metode" }, yaxis: { title: "Rp juta" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap metode punya dua batang — biru = VaR 99%, kuning = ES 99%.</p>
        <p><strong>Interpretasi:</strong> <strong>parametrik</strong> memberi angka terendah untuk keduanya — <em>curigai</em>: apakah karena datanya memang normal, atau karena asumsi normal <strong>meremehkan ekor</strong>? (Bandingkan rasio ES/VaR: parametrik 1,17 ≈ normal-teoritis 1,15 — <em>terlalu rapi</em> untuk data ber-krisis-mini!) <strong>Selisih antar metode = bahan bakar analisismu</strong> di Milestone 2.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Milestone 1 (Starter Code)</h2>
      <p>Jalankan, catat hasilnya, tulis hipotesismu <em>sebelum</em> lanjut ke Lab 2. Lalu modifikasi: tambah <strong>skew</strong> ke data (lompatan negatif 2%) — bagaimana peringkat metode berubah?</p>
      <PyodideLab
        title="Lab 1 — Capstone Milestone 1: VaR Engine"
        hint="Tantangan: tambah Filtered HS (MR4) sebagai metode ke-4! Bandingkan dengan 3 metode dasar — apakah ia 'menang' saat ada krisis mini?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Milestone 2 &amp; 3 (Starter Code)</h2>
      <p>Ganti angka VaR contoh dengan <strong>hasil Milestone 1 milikmu</strong>. Lalu rancang skenario hipotetis versimu di Milestone 3.</p>
      <PyodideLab
        title="Lab 2 — Capstone Milestone 2&3: Backtest + Stress"
        hint="Tantangan: implementasikan uji Christoffersen sederhana (MR6) — hitung P(langgar|kemarin langgar) vs P(langgar|kemarin tidak). Metode mana yang pelanggarannya berkelompok?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Desain Engine</h2>

      <div className="decision-card">
        <h3>1. Struktur kode → <strong>Modul terpisah: data → hitung → validasi → lapor</strong></h3>
        <p><strong>Alasan:</strong> tiap modul bisa diganti/diuji independen (disiplin validasi MR18). Jangan campur perhitungan dan pelaporan dalam satu fungsi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Pilih data → <strong>Kalibrasi vs uji HARUS terpisah (out-of-sample)</strong></h3>
        <p><strong>Alasan:</strong> backtest dengan data yang sama dengan kalibrasi = mencontek. Sertakan krisis mini di data uji — dunia nyata tidak sopan.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pilih metode untuk limit → <strong>Backtest + judgment, bukan angka terkecil</strong></h3>
        <p><strong>Alasan:</strong> metode dengan VaR terkecil = limit paling longgar = godaan. Pilih yang <strong>lolos backtest + robust</strong> — dan tulis alasannya.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tulis laporan → <strong>Angka + keputusan + keterbatasan</strong></h3>
        <p><strong>Alasan:</strong> laporan tanpa rekomendasi = data mentah; tanpa keterbatasan = tidak jujur. Keduanya wajib.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Hipotesis dulu</strong>, baru uji — jangan curve-fit.</li>
          <li><strong>Out-of-sample</strong> selalu — jangan mencontek.</li>
          <li><strong>Selisih antar metode</strong> = bahan analisis, bukan gangguan.</li>
          <li><strong>Keterbatasan yang jujur</strong> = syarat kelulusan.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Walkthrough Angka End-to-End + Panduan Wawancara</h2>
      <p>Sebelum kamu membangun engine sendiri, lihat dulu <strong>seperti apa output yang benar</strong> — walkthrough angka lengkap dari input hingga rekomendasi, plus cara mempresentasikan proyek ini dalam wawancara kerja. Ini adalah &ldquo;kunci jawaban&rdquo; pola pikir, bukan kunci jawaban angka (angkamu akan berbeda — dan itu tidak apa-apa).</p>

      <h3>Walkthrough: dari return mentah ke rekomendasi</h3>
      <p><strong>Setup:</strong> portofolio Rp10 M (60% saham, 40% obligasi), 500 hari return. Statistik: vol harian saham 1,8%, obligasi 0,5%, korelasi 0,25, ada 8 hari &ldquo;krisis mini&rdquo; (−4% hingga −6%).</p>

      <details className="worked">
        <summary>📐 Walkthrough angka 4 milestone (klik untuk buka)</summary>
        <p><strong>M1 — VaR 99%/1-hari + ES (tiga metode):</strong></p>
        <ul>
          <li>Historical: VaR = <strong>Rp428 jt</strong>; ES 99% = <strong>Rp512 jt</strong> (rasio 1,20).</li>
          <li>Parametrik: VaR = <strong>Rp402 jt</strong>; ES = <strong>Rp468 jt</strong> (rasio 1,16).</li>
          <li>Monte Carlo (10rb skenario, t-copula): VaR = <strong>Rp435 jt</strong>; ES = <strong>Rp548 jt</strong> (rasio 1,26).</li>
        </ul>
        <p><strong>Interpretasi M1:</strong> parametrik terendah di keduanya + rasio 1,16 ≈ normal-teoritis (1,15) — <em>mencurigakan</em> untuk data ber-krisis-mini. MC tertinggi untuk ES (menangkap ekor via t-copula). <strong>Hipotesis sebelum M2:</strong> &ldquo;Historical akan backtest terbaik (tanpa asumsi distribusi); parametrik akan <em>underperform</em> di periode berekor.&rdquo; — tulis ini <em>sebelum</em> melihat hasil!</p>
        <p><strong>M2 — Backtest (250 hari out-of-sample):</strong> pelanggaran: Historical 3 (hijau), Parametrik 6 (kuning!), MC 2 (hijau). Uji Kupiec: parametrik LR ≈ 3,56 &lt; 3,84 → <strong>gagal tolak</strong> (zona kuning — dekat batas!). <strong>Keputusan:</strong> metode resmi = <strong>Historical</strong> (LR terkecil + tanpa asumsi), MC sebagai <em>challenger</em> untuk ES. Parametrik diturunkan jadi &ldquo;indikator cepat&rdquo; saja — LR 3,56 yang mepet batas belum cukup meyakinkan untuk limit resmi.</p>
        <p><strong>M3 — Stress:</strong> skenario &ldquo;2008 terulang&rdquo; (saham −40%, spread +400bp, korelasi → 0,8): kerugian ≈ <strong>Rp2,1 M</strong> (21% portofolio) — <strong>5× VaR harian</strong>. Reverse stress: ambang &ldquo;rugi &gt; Rp1,5 M&rdquo; tercapai pada kombinasi (saham −28% + korelasi 0,7) dengan plausibilitas sedang → <strong>rekomendasi: batasi ekuitas di 50% atau tambah hedge</strong>.</p>
        <p><strong>M4 — Laporan 1 halaman:</strong> VaR Rp428 jt 🟢 | ES Rp512 jt 🟢 | Backtest 3 pelanggaran 🟢 | Skenario 2008: −Rp2,1 M 🔴 | Utilisasi limit 71% 🟢. <strong>Aksi:</strong> &ldquo;Risiko harian terkendali; risiko skenario <em>tidak</em> — usulkan limit skenario Rp1,5 M dan review alokasi ekuitas.&rdquo; <strong>Keterbatasan:</strong> &ldquo;Data 500 hari tidak mengandung krisis likuiditas; korelasi stres diasumsikan, bukan diobservasi; model tidak menangkap <em>gap risk</em> intraday.&rdquo;</p>
        <p><strong>Yang dinilai pewawancara dari walkthrough ini:</strong> bukan angkanya — melainkan <strong>rantai alasannya</strong>: hipotesis → uji → keputusan → keterbatasan. Analis junior melaporkan angka; analis senior melaporkan <em>keputusan yang didukung angka + batas kepercayaan angka itu</em>.</p>
      </details>

      <h3>Panduan wawancara: 7 pertanyaan yang pasti muncul</h3>
      <p>Capstone ini dirancang agar kamu bisa menjawab pertanyaan wawancara risiko pasar. Tujuh yang paling sering — dan kerangka jawabannya:</p>
      <ol>
        <li><strong>&ldquo;Jelaskan VaR.&rdquo;</strong> → &ldquo;Kuantil kerugian: dengan keyakinan 99%, kerugian 1-hari tidak melebihi X. Tiga metode: historical (tanpa asumsi, butuh data), parametrik (cepat, asumsi normal), Monte Carlo (fleksibel, mahal). Saya implementasikan ketiganya dan memilih historical setelah backtest.&rdquo; (MR3)</li>
        <li><strong>&ldquo;Apa kelemahan VaR?&rdquo;</strong> → &ldquo;Buta ekor (tidak tahu sedalam apa jika jebol), melanggar subadditivitas (bisa menghukum diversifikasi), procyclical. Makanya saya lengkapi dengan ES dan stress test.&rdquo; (MR3/MR5/MR7)</li>
        <li><strong>&ldquo;Kenapa ES, bukan VaR saja?&rdquo;</strong> → &ldquo;ES koheren (subadditif), menangkap kedalaman ekor, dan merupakan standar FRTB 97,5%. VaR tetap saya pakai untuk backtesting karena elicitable.&rdquo; (MR5/MR6/MR16)</li>
        <li><strong>&ldquo;Bagaimana kamu tahu modelmu benar?&rdquo;</strong> → &ldquo;Tiga lapis: backtest Kupiec + Christoffersen (frekuensi &amp; independensi), benchmarking antar metode, dan stress test di luar data. Plus paragraf keterbatasan yang jujur.&rdquo; (MR6/MR18)</li>
        <li><strong>&ldquo;Apa yang terjadi pada 2008 dengan model seperti ini?&rdquo;</strong> → &ldquo;VaR dari data tenang akan hijau lalu gagal massal — seperti yang historis terjadi. Pertahanan saya: stressed VaR/ES, skenario 2008, dan liquidity horizon. Tidak ada yang meramal krisis; yang ada hanya persiapan.&rdquo; (MR4/MR7)</li>
        <li><strong>&ldquo;Jelaskan Greeks.&rdquo;</strong> → &ldquo;Delta (arah), gamma (kelengkungan — butuh delta-gamma VaR), vega (vol), theta (waktu). Portofolio opsi tidak bisa di-VaR linear.&rdquo; (MR11/MR4)</li>
        <li><strong>&ldquo;Ceritakan saat analisismu mengubah keputusan.&rdquo;</strong> → &ldquo;Di capstone: backtest menolak metode parametrik yang awalnya terlihat &lsquo;rapi&rsquo;; stress test menunjukkan kerugian 5× VaR sehingga saya merekomendasikan limit skenario. Angka mengubah keputusan — bukan sekadar laporan.&rdquo;</li>
      </ol>
      <p><strong>Aturan emas wawancara:</strong> setiap jawaban teknis tutup dengan <strong>implikasi keputusan</strong> (&ldquo;...makanya saya merekomendasikan X&rdquo;). Pewawancara merekrut <em>pengambil keputusan</em>, bukan kalkulator.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Capstone selesai = siap kerja.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> capstone ini memberimu <strong>repertoar</strong> — tapi pasar nyata menambah lapisan: data kotor, sistem legacy, politik organisasi, tenggat kemarin. Nilai sebenarnya capstone: <strong>kamu pernah merasakan</strong> seluruh rantai (data → model → validasi → keputusan → komunikasi) sehingga di pekerjaan pertama kamu mengenali polanya. Pengalaman &gt; sertifikat; repertoar &gt; hafalan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci penutup track:</strong> 19 lesson ini mengajarkan satu kalimat: <em>&ldquo;Risiko pasar = mengukur ketidakpastian hari ini untuk keputusan hari ini, sambil tetap rendah hati terhadap hari esok.&rdquo;</em> VaR/ES untuk sehari-hari, stress test untuk eksistensi, limit untuk disiplin, validasi untuk kejujuran, regulasi untuk memori kolektif. Kuasai rantainya — dan setiap krisis berikutnya akan terasa seperti <strong>varian dari pola yang sudah kamu kenal</strong>, bukan kejutan total.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: dashboard limit — membaca &ldquo;kesehatan&rdquo; desk dalam 30 detik (klik untuk buka)</summary>
        <p><strong>Dashboard desk ekuitas derivatif, pagi ini:</strong></p>
        <p>VaR 99%/1-hari: Rp21 M / limit Rp25 M (84% 🟡) | ES 99%: Rp29 M | Backtest: 2 pelanggaran 🟢 | Skenario 2008: −Rp380 M / limit Rp400 M (95% 🔴) | Gross notional: Rp3,2 T / limit Rp4 T (80% 🟡) | Vega: Rp14 M/% / limit Rp15 M (93% 🔴)</p>
        <p><strong>Baca 30 detik:</strong> VaR &ldquo;aman&rdquo; (84%) tapi <strong>dua limit merah</strong>: skenario (95%) dan vega (93%). Desk ini <strong>menumpuk risiko vol</strong> — VaR harian tidak melihatnya karena vol <em>saat ini</em> rendah (vega = sensitivitas ke <em>perubahan</em> vol).</p>
        <p><strong>Keputusan:</strong> (1) <strong>jangan tambah</strong> posisi short-vol; (2) beli proteksi vega parsial (atau kurangi 20% posisi); (3) eskalasi ke CRO: utilisasi skenario 95% = <strong>satu guncangan dari pelanggaran</strong>. Analis yang hanya melihat VaR 84% akan bilang &ldquo;aman&rdquo; — analis yang membaca <em>seluruh dashboard</em> bilang &ldquo;rapatkan sabuk&rdquo;. <strong>Itulah bedanya.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — dokumentasi yang menyelamatkan karir:</strong> setiap angka di laporan capstone-mu harus bisa menjawab <em>&ldquo;dari mana angka ini?&rdquo;</em> dalam 30 detik. Praktik industri: <strong>model inventory</strong> — tiap model punya kartu: tujuan, pemilik, data input + lineage (MR18), asumsi, keterbatasan, tanggal validasi terakhir, hasil backtest terakhir. Saat regulator/auditor datang (atau saat krisis!), yang ditanya pertama bukan &ldquo;berapa VaR-mu?&rdquo; melainkan <strong>&ldquo;tunjukkan dokumentasinya&rdquo;</strong>. Capstone tanpa dokumentasi = proyek kuliah; capstone dengan model inventory mini = <strong>simulasi kerja nyata</strong>. Mulai kebiasaan ini sekarang: untuk setiap milestone, tulis 1 paragraf &ldquo;asumsi &amp; keterbatasan&rdquo; — paragraf inilah yang paling dibaca pewawancara senior.</p>
      </div>
      <p><strong>Rencana 30-60-90 hari untuk portofolio karir:</strong> <strong>30 hari:</strong> selesaikan 4 milestone + laporan 1 halaman (fondasi). <strong>60 hari:</strong> tambah <em>satu</em> ekstensi yang membedakanmu — misal EVT untuk ekor (MR5), atau dashboard Streamlit untuk laporan harian (visual!). <strong>90 hari:</strong> tulis 1 artikel teknis (&ldquo;Membangun VaR Engine: Pelajaran dari Backtesting&rdquo;) — publikasi menunjukkan kamu bisa <em>berkomunikasi</em>, bukan cuma menghitung. Perekrut risiko pasar memindai: <strong>kode (bisa?) → dokumentasi (rapi?) → komunikasi (jelas?)</strong>. Tiga lapis, tiga bulan.</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Engine-mu: VaR HS Rp428 jt, parametrik Rp402 jt, MC Rp435 jt; backtest: HS 3, parametrik 6, MC 2 pelanggaran. Metode mana yang kamu pilih sebagai resmi? Tulis alasan 3 kalimat. (klik untuk pembahasan)</summary>
        <p><strong>Pilih Historical.</strong> Ia lolos backtest (3 = hijau) tanpa asumsi distribusi — <em>kejujuran</em> mengalahkan <em>kecanggihan</em>. Parametrik <em>nyaris gagal</em> uji Kupiec (6 pelanggaran, LR 3,56 &lt; 3,84 — zona kuning) — &ldquo;rapi&rdquo; tapi tidak meyakinkan. MC jadi challenger untuk ES (menangkap ekor via t-copula) — <strong>kombinasi HS + MC</strong> lebih kuat dari satu metode sendirian.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Skenario 2008 memberi kerugian Rp2,1 M (5× VaR harian Rp428 jt). Direksi bertanya: &ldquo;VaR kita Rp428 jt, kok skenario Rp2,1 M? Mana yang benar?&rdquo; Jawab. (klik untuk pembahasan)</summary>
        <p><strong>Keduanya benar — menjawab pertanyaan berbeda.</strong> VaR = &ldquo;hari buruk yang <em>normal</em>&rdquo; (probabilistik, 1% ekor distribusi biasa). Skenario = &ldquo;jika <em>2008 terulang</em>&rdquo; (deterministik, di luar distribusi). Analogi: VaR = &ldquo;banjir tahunan setinggi 1 meter&rdquo;; skenario = &ldquo;jika bendungan jebol&rdquo;. <strong>Keputusan:</strong> VaR untuk limit harian; skenario untuk kecukupan modal. Bank yang hanya menyiapkan 1 meter akan tenggelam saat bendungan jebol — dan bendungan <em>pernah</em> jebol (2008).</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Tulis paragraf keterbatasan untuk laporan 1-halamanmu (syarat kelulusan capstone). (klik untuk pembahasan)</summary>
        <p><strong>Contoh:</strong> &ldquo;Angka ini tidak menangkap: (1) <strong>risiko likuiditas</strong> — VaR mengasumsikan likuidasi 1-hari di harga wajar (MR13); (2) <strong>korelasi stres</strong> — 0,25 dari data tenang, bisa → 0,9 saat krisis (MR4); (3) <strong>gap risk intraday</strong> — data harian buta terhadap lompatan menit (MR12: CHF 2015); (4) <strong>model risk</strong> — t-copula tetap asumsi (MR18). Untuk (1)–(2): lengkapi dengan liquidity horizon + skenario korelasi-stres. <strong>Angka tanpa batas = klaim tanpa tanggung jawab.</strong>&rdquo;</p>
      </details>

      <h2 id="case">📋 Mini-Case: Engine yang &ldquo;Berhasil&rdquo; Tapi Menyesatkan</h2>
      <div className="callout">
        <p>Dua peserta capstone mengumpulkan engine:</p>
        <ul>
          <li><strong>Peserta A:</strong> kode rapi, 3 metode jalan, backtest semua <strong>lolos</strong>, laporan cantik. Tapi: data uji = <strong>data kalibrasi yang sama</strong> (in-sample!).</li>
          <li><strong>Peserta B:</strong> kode berantakan, 1 metode <strong>gagal</strong> backtest, laporan 1 halaman dengan coretan. Tapi: data uji <strong>out-of-sample + krisis mini</strong>, dan ia menulis: &ldquo;metode X gagal karena ___; saya pilih Y karena ___; keterbatasan: ___&rdquo;.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> siapa yang lulus capstone — dan siapa yang akan dipilih pewawancara?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Peserta B lulus. Peserta A tidak.</strong> Alasannya:</p>
          <p>(a) <strong>Backtest in-sample = mencontek.</strong> Semua metode &ldquo;lolos&rdquo; karena diuji dengan data yang dipakai untuk kalibrasi — hasilnya <strong>tidak informatif</strong>. Engine A terlihat sempurna dan <em>tidak berguna</em>.</p>
          <p>(b) <strong>Kegagalan B adalah informasi.</strong> Metode yang gagal backtest <em>mengajarkan</em> sesuatu (metode ini rapuh terhadap krisis mini karena ___). Analis yang bisa menjelaskan <em>mengapa</em> metodenya gagal <strong>lebih berharga</strong> daripada analis yang tidak pernah melihat kegagalan.</p>
          <p>(c) <strong>Pewawancara memilih B</strong> — karena B menunjukkan <strong>judgment</strong>: hipotesis, pengujian jujur, keputusan beralasan, keterbatasan diakui. A menunjukkan <strong>kepatuhan buta</strong>: mengikuti instruksi tanpa memahami <em>mengapa</em> out-of-sample penting.</p>
          <p><strong>Pelajaran capstone:</strong> nilai bukan di &ldquo;semua hijau&rdquo; — nilai ada di <strong>kejujuran metodologis</strong>. Engine yang jujur tentang kegagalannya lebih baik dari engine sempurna yang menipu.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Mengapa backtest capstone WAJIB out-of-sample?"
        options={[
          "Agar lebih sulit",
          "Backtest in-sample = mencontek: model diuji dengan data kalibrasinya sendiri → hasil tidak informatif, memberi rasa aman palsu",
          "Regulator memaksa",
          "Supaya kode lebih panjang",
        ]}
        correct={1}
        explanation="Benar. In-sample = ujian dengan kunci jawaban yang sudah dihafal. Hanya out-of-sample (apalagi dengan krisis mini) yang menguji generalisasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Tiga metode memberi VaR berbeda jauh. Untuk limit operasional, pilih?"
        options={[
          "Yang terkecil — limit longgar, bisnis senang",
          "Yang lolos backtest + paling robust, dengan alasan tertulis — bukan yang terkecil",
          "Rata-rata ketiganya",
          "Yang terbesar — selalu konservatif",
        ]}
        correct={1}
        explanation="Benar. 'Terkecil' = godaan bisnis; 'terbesar' = kemalasan berpikir. Pilihan benar = bukti (backtest) + judgment (robustness) + alasan tertulis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Paragraf 'keterbatasan' dalam laporan 1 halaman berfungsi untuk?"
        options={[
          "Formalitas",
          "Kejujuran metodologis: memberi tahu pengambil keputusan apa yang TIDAK ditangkap angka — mencegah overconfidence; syarat kelulusan capstone",
          "Mengisi halaman",
          "Menyalahkan model",
        ]}
        correct={1}
        explanation="Benar. Analis yang tidak tahu batas modelnya = berbahaya. Paragraf ini memaksa humility — kualitas terpenting risk manager."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam capstone, kapan hipotesis 'metode mana akan menang' harus ditulis?"
        options={[
          "Setelah melihat hasil backtest",
          "SEBELUM melihat hasil — melatih judgment dan mencegah curve-fitting/rasionalisasi pasca-fakta",
          "Tidak perlu",
          "Setelah laporan jadi",
        ]}
        correct={1}
        explanation="Benar. Hipotesis dulu = pre-registration. Menulis 'saya sudah tahu' setelah melihat hasil = hindsight bias — musuh analis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Stress test capstone yang semua hasilnya 'aman'. Penilaian?"
        options={[
          "Bagus — berarti portofolio aman",
          "Gagal sebagai latihan — skenario terlalu sopan; paksa satu skenario hingga menembus batas, lalu rancang mitigasi (MR7)",
          "Cukup",
          "Tidak perlu stress test",
        ]}
        correct={1}
        explanation="Benar. Stress yang tidak mengubah keputusan = ritual. Nilai stress test = menemukan batas + merancang mitigasi, bukan konfirmasi kenyamanan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Setelah capstone ini, apa SATU hal yang membedakanmu dari 'Kandidat A' di wawancara?"
        options={[
          "Hafal rumus VaR",
          "Punya artefak kerja + judgment: bisa menjelaskan KENAPA memilih metode, KAPAN ia gagal, dan APA keterbatasannya — bukan sekadar angka",
          "Nilai quiz tinggi",
          "Sertifikat",
        ]}
        correct={1}
        explanation="Benar. Pewawancara membeli judgment, bukan hafalan. Artefak (engine + laporan) = bukti; penjelasan why/when/limitation = pembeda."
      />

      <h2 id="rangkum">📝 Rangkuman Track — Market Risk Analytics</h2>
      <div className="callout">
        <ul>
          <li><strong>MR1:</strong> Trading vs banking book; faktor risiko; sensitivitas = bahasa umum.</li>
          <li><strong>MR2:</strong> Volatilitas hidup (EWMA vs window); shrinkage untuk kovarians.</li>
          <li><strong>MR3–MR4:</strong> VaR 3 metode + scaling; Filtered HS, delta-gamma, component VaR.</li>
          <li><strong>MR5:</strong> ES — melihat ke dalam ekor; koheren; fondasi modal FRTB.</li>
          <li><strong>MR6:</strong> Backtest (Kupiec + Christoffersen) + PLA — mengadili model.</li>
          <li><strong>MR7:</strong> Stress test (historis/hipotetis/reverse) — latihan kematian yang jujur.</li>
          <li><strong>MR8–MR10:</strong> Duration/DV01/convexity/key-rate; kurva yield (NS/PCA); IRRBB (EVE/NII).</li>
          <li><strong>MR11–MR13:</strong> Greeks &amp; vol surface; FX/komoditas &amp; basis risk; likuiditas (LVaR, LCR/NSFR).</li>
          <li><strong>MR14:</strong> CCR — EE/PFE, CVA/XVA, netting, WWR, SA-CCR.</li>
          <li><strong>MR15:</strong> GBM, Vasicek/CIR/Hull-White, GARCH — mesin masa depan.</li>
          <li><strong>MR16:</strong> Basel 2.5 → FRTB (SBM/IMA/ES/NMRF/PLA) — arsitektur insentif.</li>
          <li><strong>MR17–MR18:</strong> Limit &amp; appetite &amp; laporan harian (+IPV); validasi 3 pilar + data lineage.</li>
          <li><strong>Prinsip abadi:</strong> tidak ada metrik tunggal yang cukup; data benar &gt; model canggih; kejujuran tentang keterbatasan = kualitas tertinggi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr18-validasi-model" className="btn btn-secondary btn-sm">← MR18</Link>
        <Link href="/" className="btn btn-primary btn-sm">Selesai — Daftar Materi</Link>
      </div>
    </div>
  );
}
