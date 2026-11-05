"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR18Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Model lifecycle: tahapan validasi
  const lifeData = [
    {
      x: ["Pengembangan", "Validasi awal", "Implementasi", "Monitoring\nberkala", "Re-validasi"],
      y: [20, 35, 25, 60, 40],
      type: "bar",
      marker: { color: ["#94a3b8", "#e8a838", "#94a3b8", "#2a7de1", "#e8a838"] },
    },
  ];

  // Data lineage: skor kualitas per tahap (ilustrasi degradasi)
  const linData = [
    {
      x: ["Vendor (mentah)", "Pembersihan", "Mapping", "Agregasi", "VaR engine", "Laporan"],
      y: [98, 95, 92, 88, 85, 83],
      type: "scatter", mode: "lines+markers",
      name: "Skor kualitas data (%)",
      line: { color: "#2a7de1", width: 2.5 },
    },
  ];

  const lab1Code = String.raw`# VALIDASI MODEL: uji sensitivitas parameter (bukan cuma backtest!).
# Model: VaR parametrik. Tanya: jika input berubah 10%, berapa VaR berubah?
# Model yang 'sehat' = perubahan proporsional. Yang 'sakit' = meledak/tidak responsif.

import math

def var_param(V0, sigma, z=2.33):
    return z * sigma * V0

V0, sigma = 10_000_000_000, 0.012
base = var_param(V0, sigma)

print("Uji sensitivitas VaR parametrik (base = Rp {:.0f} jt):".format(base/1e6))
print(f"{'Parameter':22s} {'-10%':>10s} {'+10%':>10s}  Elastisitas")
for label, fn in [("Volatilitas (sigma)", lambda d: var_param(V0, sigma*(1+d))),
                  ("Nilai portofolio", lambda d: var_param(V0*(1+d), sigma)),
                  ("Tingkat kepercayaan*", lambda d: var_param(V0, sigma))]:
    lo, hi = fn(-0.10), fn(0.10)
    elas = (hi - lo) / base / 0.20
    print(f"{label:22s} {lo/1e6:>9.0f}M {hi/1e6:>9.0f}M  {elas:.2f}")
print()
print("* z tidak punya '10%' yg bermakna -- contoh mengapa uji sensitivitas")
print("  harus dirancang per parameter, bukan template buta.")
print()
print("Coba: model dgn sigma dari EWMA vs rolling. Mana yg elastisitasnya")
print("lebih 'sehat' (responsif tapi tidak liar)? Itulah pertanyaan validasi.")`;

  const lab2Code = String.raw`# DATA LINEAGE: lacak degradasi kualitas & deteksi 'titik bocor'.
# Setiap tahap transformasi bisa menambah error. Skor komposit = produk kualitas.
# Aturan: jika skor akhir < 90%, investigasi tahap dengan drop TERBESAR.

tahapan = [
    ("Vendor (mentah)", 0.98, "harga real-time, kadang stale"),
    ("Pembersihan", 0.97, "outlier dihapus, 2% diinterpolasi"),
    ("Mapping", 0.96, "5% instrumen map manual"),
    ("Agregasi", 0.97, "FX rate jam 16:00, bukan real-time"),
    ("VaR engine", 0.99, "model tervalidasi"),
    ("Laporan", 0.995, "pembulatan"),
]

skor, drops = 1.0, []
print(f"{'Tahap':20s} {'Kualitas':>8s} {'Kumulatif':>9s}  Catatan")
for nama, q, note in tahapan:
    prev = skor
    skor *= q
    drops.append((nama, prev - skor, note))
    print(f"{nama:20s} {q:>8.1%} {skor:>9.1%}  {note}")

drops.sort(key=lambda x: -x[1])
print()
print(f"Skor akhir: {skor:.1%} {'OK' if skor >= 0.90 else 'DI BAWAH 90% - investigasi!'}")
print(f"Titik bocor terbesar: {drops[0][0]} (drop {drops[0][1]:.1%}) -- {drops[0][2]}")
print()
print("Coba: turunkan kualitas Mapping jadi 0.85 (banyak map manual).")
print("Skor akhir jadi? Inilah mengapa data lineage BUKAN dokumentasi mati")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR18 — Market Risk Analytics</span>
        <h1 className="display-title">Validasi Model &amp; Data Lineage:<br />Mempercayai Angka dengan Alasan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model Sempurna dengan Data Busuk</a></li>
          <li><a href="#tiga">Tiga Pilar Validasi Model</a></li>
          <li><a href="#konseptual">1. Conceptual Soundness</a></li>
          <li><a href="#monitoring">2. Ongoing Monitoring</a></li>
          <li><a href="#outcome">3. Outcomes Analysis</a></li>
          <li><a href="#lineage">Data Lineage: Silsilah Angka</a></li>
          <li><a href="#lab1">🔬 Lab 1: Uji Sensitivitas Parameter Model</a></li>
          <li><a href="#lab2">🔬 Lab 2: Lacak Degradasi Kualitas Data</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: Formula Li — Model US$1 Miliar yang Membakar Dunia</a></li>
          <li><a href="#case">📋 Mini-Case: Validasi yang Menemukan Bom</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kerangka validasi model (tiga pilar SR 11-7/OJK) dan peran validator independen.</li>
          <li>Mengevaluasi conceptual soundness: apakah teori, asumsi, dan keterbatasan model masuk akal.</li>
          <li>Merancang ongoing monitoring: metrik apa yang dipantau, ambang apa yang memicu tindakan.</li>
          <li>Membedakan outcomes analysis (backtesting) dari validasi penuh — dan menjelaskan mengapa backtest saja tidak cukup.</li>
          <li>Memetakan data lineage untuk data pasar dan mengidentifikasi titik degradasi kualitas terbesar.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model Sempurna dengan Data Busuk</h2>
      <div className="story">
        <p>Bank menghabiskan 2 tahun membangun <strong>model VaR Monte Carlo</strong> tercanggih — 100.000 skenario, full revaluation, Greeks lengkap. Validasi awal: lolos. Backtest: hijau. Semua orang bangga.</p>
        <p>Setahun kemudian, kerugian tak terduga Rp200 miliar dari portofolio obligasi korporasi. Investigasi: modelnya <strong>benar</strong> — tapi <strong>data harga</strong> obligasi illiquid yang masuk ke model <strong>basi 3 minggu</strong> (tidak ada transaksi, harga tidak di-update, tidak ada yang sadar). Model canggih itu menghitung risiko dengan presisi tinggi <strong>dari harga yang salah</strong>.</p>
        <p>Twist-nya: validasi model memeriksa <em>modelnya</em> — tapi tidak memeriksa <strong>silsilah datanya</strong> (data lineage). Seperti membangun istana di atas fondasi yang tidak diperiksa. Lesson ini tentang dua disiplin yang tak terpisahkan: <strong>validasi model</strong> (apakah mesinnya benar?) dan <strong>data lineage</strong> (apakah bahan bakarnya bersih?).</p>
      </div>

      <h2 id="tiga">Tiga Pilar Validasi Model</h2>
      <p><strong>Definisi.</strong> Standar validasi model (Fed SR 11-7, diadopsi OJK/Basel secara prinsip) bertumpu pada <strong>tiga pilar</strong>:</p>
      <ol>
        <li><strong>Conceptual soundness:</strong> apakah teori, asumsi, dan desain model <em>masuk akal</em>? (Review kualitatif.)</li>
        <li><strong>Ongoing monitoring:</strong> apakah model <em>tetap</em> bekerja? (Pemantauan berkala.)</li>
        <li><strong>Outcomes analysis:</strong> apakah prediksi model <em>cocok</em> dengan kenyataan? (Backtesting &amp; benchmarking.)</li>
      </ol>
      <p><strong>Prinsip kunci — independensi:</strong> validator <strong>tidak boleh</strong> orang yang membangun/menggunakan model (tidak boleh menilai karya sendiri). Dan validasi <strong>bukan sekali</strong> — model yang lolos tahun lalu bisa gagal tahun ini (data berubah, pasar berubah, portofolio berubah).</p>

      <PlotlyChart
        data={lifeData}
        title="Upaya Validasi per Tahap Siklus Hidup Model (ilustratif)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "Upaya relatif" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = upaya validasi relatif di tiap tahap hidup model.</p>
        <p><strong>Interpretasi:</strong> <strong>monitoring berkala</strong> (biru, tertinggi) memakan upaya <em>terbesar</em> sepanjang hidup model — validasi bukan &ldquo;proyek sekali&rdquo; melainkan <strong>aktivitas rutin</strong>. Bank yang hanya berinvestasi di validasi awal (kuning) lalu lalai monitoring = membeli asuransi lalu tidak membayar preminya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> validasi menjawab <strong>tiga pertanyaan berlapis</strong>: (1) &ldquo;apakah idenya benar?&rdquo; (konseptual), (2) &ldquo;apakah ia masih benar?&rdquo; (monitoring), (3) &ldquo;apakah prediksinya terbukti?&rdquo; (outcome). Model bisa lolos (3) tapi gagal (1) — misal backtest hijau karena <em>beruntung</em>, padahal teorinya cacat. Tiga lapis = tiga jaring pengaman.</p>
      </div>

      <h2 id="konseptual">1. Conceptual Soundness</h2>
      <p><strong>Definisi.</strong> Review <strong>kualitatif</strong> atas fondasi model — dilakukan <em>sebelum</em> angka dipercaya:</p>
      <ul>
        <li><strong>Teori:</strong> apakah modelnya tepat untuk <em>tujuan</em> ini? (VaR delta-only untuk desk opsi = salah teori — MR4.)</li>
        <li><strong>Asumsi:</strong> daftarkan <em>semua</em> asumsi + uji sensitivitasnya. (Normal? i.i.d.? Likuiditas?)</li>
        <li><strong>Data:</strong> apakah data input <strong>representatif &amp; berkualitas</strong>? (Sampai ke lineage — bawah.)</li>
        <li><strong>Keterbatasan:</strong> dokumentasikan <em>kapan model gagal</em> — model tanpa &ldquo;label peringatan&rdquo; = produk cacat.</li>
        <li><strong>Benchmarking:</strong> bandingkan dengan model alternatif/sederhana — jika model kompleks tidak lebih baik dari model naif, <strong>pakai yang naif</strong>.</li>
      </ul>
      <p><strong>Contoh temuan konseptual:</strong> &ldquo;Model memakai korelasi historis 0,3 untuk sekuritisasi — <em>asumsi ini runtuh saat krisis</em> (lihat 2008). Model <strong>tidak boleh</strong> dipakai untuk limit tanpa overlay korelasi-stres.&rdquo; — temuan seperti ini <strong>menyelamatkan lebih banyak uang</strong> daripada backtest hijau mana pun.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Validasi = backtesting.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> backtesting hanya <strong>satu dari tiga pilar</strong> (outcomes analysis). Model bisa lolos backtest tapi gagal konseptual (teori salah, beruntung saja) atau gagal monitoring (sudah basi). &ldquo;Backtest hijau&rdquo; ≠ &ldquo;tervalidasi&rdquo; — klaim seperti itu adalah <strong>pelanggaran disiplin validasi</strong>.</p>
      </div>

      <h2 id="monitoring">2. Ongoing Monitoring</h2>
      <p><strong>Definisi.</strong> Pemantauan <strong>berkala</strong> bahwa model tetap fit — karena dunia berubah:</p>
      <ul>
        <li><strong>Stabilitas parameter:</strong> apakah parameter kalibrasi <em>melompat-lompat</em>? (Parameter tidak stabil = model tidak robust.)</li>
        <li><strong>Kualitas input:</strong> apakah data masih representatif? (Regime change = kalibrasi basi.)</li>
        <li><strong>Penggunaan:</strong> apakah model dipakai <em>sesuai</em> tujuannya? (Model VaR harian dipakai untuk modal 10-hari tanpa scaling yang benar = misuse.)</li>
        <li><strong>Override:</strong> berapa sering hasil model di-<em>override</em> manual? (Override sering = model tidak dipercaya = selidiki!)</li>
      </ul>
      <p><strong>Trigger tindakan:</strong> tetapkan <strong>ambang kuantitatif</strong> sebelumnya — misal &ldquo;jika unexplained P&amp;L &gt; X tiga hari berurutan → review&rdquo;. Monitoring tanpa trigger = menonton tanpa wasit.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>override log</strong> adalah dokumen paling jujur di bank. Setiap kali seseorang mengabaikan model, ada alasan — dan alasan yang berulang adalah <strong>spesifikasi perbaikan model</strong> yang ditulis oleh penggunanya sendiri. Validator yang cerdas membaca override log <em>sebelum</em> membaca kode model.</p>
      </div>

      <h2 id="outcome">3. Outcomes Analysis</h2>
      <p><strong>Definisi.</strong> Bandingkan <strong>prediksi vs realita</strong> — backtesting (MR6) adalah contohnya, tapi tidak satu-satunya:</p>
      <ul>
        <li><strong>Backtesting:</strong> pelanggaran VaR vs ekspektasi (Kupiec + Christoffersen).</li>
        <li><strong>Benchmarking:</strong> model kompleks vs model sederhana — apakah kompleksitasnya <em>terbayar</em>?</li>
        <li><strong>Analisis error:</strong> <em>pola</em> kesalahan — apakah model sistematis salah di kondisi tertentu? (Misal: selalu underestimate saat vol tinggi = bias struktural.)</li>
      </ul>
      <p><strong>Batasan yang harus diakui:</strong> outcomes analysis menguji <strong>masa lalu</strong> — tidak bisa membuktikan ketahanan terhadap masa depan yang unprecedented (lagi-lagi: butuh stress test, MR7). Validator yang baik menulis batasan ini <em>eksplisit</em> di laporan.</p>

      <h2 id="lineage">Data Lineage: Silsilah Angka</h2>
      <p><strong>Definisi.</strong> <strong>Data lineage</strong> = peta <strong>asal-usul &amp; perjalanan</strong> setiap data: dari vendor → pembersihan → mapping → agregasi → model → laporan. Untuk tiap tahap: <em>apa yang terjadi, siapa yang bertanggung jawab, berapa kualitasnya</em>.</p>
      <p><strong>Kenapa kritis untuk data pasar:</strong></p>
      <ul>
        <li><strong>Stale price:</strong> harga yang tidak di-update (obligasi illiquid!) — model menghitung dari &ldquo;mayat&rdquo; harga.</li>
        <li><strong>Mapping salah:</strong> instrumen terpetakan ke kurva/faktor yang salah → sensitivitas salah → VaR salah.</li>
        <li><strong>Timestamp mismatch:</strong> harga saham jam 15:00 dicampur FX jam 16:00 → korelasi artifisial.</li>
        <li><strong>Interpolasi diam-diam:</strong> data kosong diisi interpolasi tanpa penanda → model &ldquo;yakin&rdquo; pada data fiktif.</li>
      </ul>

      <PlotlyChart
        data={linData}
        title="Degradasi Kualitas Data Sepanjang Lineage (ilustratif)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "Skor kualitas (%)", range: [75, 100] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = skor kualitas data setelah melewati tahap itu (kumulatif menurun).</p>
        <p><strong>Interpretasi:</strong> dari 98% (vendor) menjadi <strong>83%</strong> (laporan) — <strong>15 poin hilang</strong> di perjalanan! Penurunan terbesar di <strong>mapping &amp; agregasi</strong> — di sinilah &ldquo;titik bocor&rdquo; berada. <strong>Pelajaran:</strong> kualitas data = <em>perkalian</em>, bukan rata-rata — satu tahap buruk (misal mapping 85%) merusak seluruh rantai. Lineage yang baik mengidentifikasi <em>di mana tepatnya</em> berinvestasi perbaikan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk setiap angka di laporan risiko, kamu harus bisa menjawab: <strong>&ldquo;dari mana angka ini berasal, siapa yang menyentuhnya, dan kapan terakhir diverifikasi?&rdquo;</strong> Jika tidak bisa — angka itu <strong>tidak bisa dipercaya</strong>, seberapa pun canggih modelnya. Lineage = rantai kepercayaan angka.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data lineage = dokumentasi IT yang membosankan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> lineage adalah <strong>alat investigasi risiko</strong>. Saat model &ldquo;aneh&rdquo;, lineage menjawab dalam hitungan jam (bukan minggu): data mana yang basi? mapping mana yang salah? Tanpa lineage, setiap anomali = proyek forensik. Dengan lineage = query 5 menit. Ini <strong>infrastruktur</strong>, bukan birokrasi.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Uji Sensitivitas Parameter Model</h2>
      <p>Tambahkan parameter baru (misal korelasi untuk portofolio 2-aset) dan uji elastisitasnya. Parameter mana yang &ldquo;berbahaya&rdquo; (elastisitas tinggi)?</p>
      <PyodideLab
        title="Lab 1 — Uji Sensitivitas: Seberapa Rapuh Modelmu?"
        hint="Coba model VaR 2-aset dengan korelasi rho: elastisitas terhadap rho bisa SANGAT tinggi saat rho→1. Inilah mengapa asumsi korelasi adalah 'parameter paling berbahaya'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Lacak Degradasi Kualitas Data</h2>
      <p>Ubah kualitas tiap tahap dan temukan &ldquo;titik bocor&rdquo;. Berapa investasi perbaikan yang paling efektif (tahap mana)?</p>
      <PyodideLab
        title="Lab 2 — Data Lineage: Temukan Titik Bocor"
        hint="Coba perbaiki SATU tahap dari 0.96→0.99 vs semua tahap +0.01: mana yang lebih menaikkan skor akhir? Fokus pada titik bocor, bukan perbaikan merata."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Model baru / perubahan besar → <strong>Validasi penuh 3 pilar SEBELUM produksi</strong></h3>
        <p><strong>Kondisi:</strong> go-live model baru.</p>
        <p><strong>Alasan:</strong> conceptual + data + benchmarking + backtest awal. Tidak ada &ldquo;pakai dulu, validasi nanti&rdquo; — itu seperti terbang dulu, cek mesin nanti.</p>
      </div>

      <div className="decision-card">
        <h3>2. Model sudah produksi → <strong>Ongoing monitoring dengan trigger kuantitatif</strong></h3>
        <p><strong>Kondisi:</strong> berkala (kuartalan/tahunan sesuai materialitas).</p>
        <p><strong>Alasan:</strong> dunia berubah; model yang benar tahun lalu bisa salah tahun ini. Trigger: unexplained P&amp;L, override sering, parameter tak stabil.</p>
      </div>

      <div className="decision-card">
        <h3>3. Anomali model → <strong>Lacak via data lineage DULU</strong></h3>
        <p><strong>Kondisi:</strong> angka &ldquo;aneh&rdquo;, backtest gagal tiba-tiba.</p>
        <p><strong>Alasan:</strong> 80% anomali berasal dari <strong>data</strong>, bukan model. Cek lineage sebelum menyalahkan model — menghemat minggu investigasi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Membangun infrastruktur → <strong>Investasi di titik bocor lineage</strong></h3>
        <p><strong>Kondisi:</strong> roadmap data &amp; teknologi.</p>
        <p><strong>Alasan:</strong> kualitas = perkalian — perbaiki tahap terburuk dulu (biasanya mapping &amp; validasi input), bukan yang sudah bagus.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>3 pilar</strong>: konseptual + monitoring + outcome. Backtest saja ≠ validasi.</li>
          <li><strong>Validator independen</strong> — tidak menilai karya sendiri.</li>
          <li><strong>Lineage dulu</strong> saat anomali — 80% masalah = data.</li>
          <li><strong>Override log</strong> = spesifikasi perbaikan yang ditulis pengguna.</li>
          <li>Dokumentasikan <strong>kapan model gagal</strong> — label peringatan wajib.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: Formula Li — Model US$1 Miliar yang Membakar Dunia</h2>
      <p>Tahun 2000, David X. Li menerbitkan <strong>&ldquo;On Default Correlation: A Copula Function Approach&rdquo;</strong> — formula elegan untuk korelasi default memakai <strong>Gaussian copula</strong>. Industri sekuritisasi mengadopsinya massal: CDO <em>tidak bisa</em> diberi peringkat tanpa formula ini. Delapan tahun kemudian, formula yang sama dituding sebagai &ldquo;penyebab&rdquo; krisis. Kisah ini adalah <strong>studi kasus validasi model paling terkenal dalam sejarah keuangan</strong>.</p>

      <h3>Apa yang dilakukan formula Li</h3>
      <p>Masalah: menilai tranche CDO butuh <strong>korelasi default antar ratusan hipotek</strong> — mustahil diestimasi langsung (data default bersama nyaris tidak ada). Solusi Li: pisahkan <strong>probabilitas default individual</strong> (dari CDS spread — bisa diobservasi) dari <strong>struktur ketergantungan</strong> (copula) — lalu <em>asumsikan</em> ketergantungan Gaussian dengan satu parameter korelasi <Tex math={String.raw`\rho`} />:</p>
      <Tex math={String.raw`C(u_1, \dots, u_n) = \Phi_{\rho}\left(\Phi^{-1}(u_1), \dots, \Phi^{-1}(u_n)\right)`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`u_i`} /> = probabilitas default hipotek-i; <Tex math={String.raw`\Phi`} /> = distribusi normal; copula Gaussian &ldquo;menempelkan&rdquo; marginal individual menjadi distribusi bersama dengan korelasi <Tex math={String.raw`\rho`} />.</p>
      <p><strong>Yang brilian:</strong> <Tex math={String.raw`\rho`} /> bisa di-<em>imply</em> dari harga pasar tranche (seperti implied vol — MR11) — tidak perlu data historis default bersama. Industri mendapat <strong>bahasa harga standar</strong>: &ldquo;tranche ini diperdagangkan pada korelasi 25%&rdquo;.</p>

      <h3>Tiga kegagalan validasi yang mematikan</h3>
      <ol>
        <li><strong>Asumsi tidak pernah diuji (gagal konseptual):</strong> copula Gaussian punya <strong>tail dependence ≈ 0</strong> — ia mengasumsikan default ekstrem <em>hampir tidak pernah</em> terjadi bersamaan. Padahal krisis perumahan = <em>tepat</em> skenario default-bersamaan. Model mengasumsikan pergi justru hal yang perlu dimodelkan. Validator yang bertanya &ldquo;apa tail dependence copula ini?&rdquo; akan menemukan jawabannya: <strong>nol</strong> — dan itu seharusnya menjadi temuan <em>blocking</em>.</li>
        <li><strong>Parameter dari pasar yang buta (gagal data):</strong> <Tex math={String.raw`\rho`} /> di-imply dari harga tranche — yang <em>sendiri</em> dihitung dengan model yang sama. <strong>Sirkularitas</strong>: model mengkalibrasi dirinya dari output-nya sendiri. Ketika sentimen berubah, <Tex math={String.raw`\rho`} /> implisit melonjak — tapi itu <em>harga ketakutan</em>, bukan <em>estimasi statistik</em>.</li>
        <li><strong>Model dipakai di luar batasnya (gagal governance):</strong> formula Li dirancang untuk <strong>kuotasi harga</strong> (seperti Black-Scholes untuk opsi — MR11), bukan untuk <strong>manajemen risiko</strong>. Industri memakainya untuk keduanya: memberi peringkat AAA, menghitung modal, menetapkan limit — fungsi yang butuh model <em>fisik</em> (probabilitas aktual), bukan model <em>kuotasi</em>. <strong>Kesalahan kategori</strong> yang paling mahal dalam sejarah.</li>
      </ol>
      <p><strong>Pembelaan yang jujur:</strong> Li sendiri memperingatkan keterbatasan modelnya; Gaussian copula <em>bukan</em> &ldquo;salah&rdquo; secara matematis — ia salah <strong>pakai</strong>. Seperti palu yang dipakai untuk operasi jantung: yang salah bukan palunya. Inilah mengapa validasi modern (SR 11-7) menekankan <strong>kesesuaian tujuan (use test)</strong>: model yang valid untuk <em>pricing</em> belum tentu valid untuk <em>risk measurement</em>.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: uji tail dependence — yang seharusnya dilakukan 2005 (klik untuk buka)</summary>
        <p><strong>Pertanyaan validator:</strong> &ldquo;Di bawah copula Gaussian dengan <Tex math={String.raw`\rho = 0{,}3`} />, berapa probabilitas <strong>dua hipotek default bersamaan</strong> jika masing-masing punya PD 5%?&rdquo;</p>
        <p><strong>Langkah 1 — jika independen:</strong> 0,05 × 0,05 = <strong>0,25%</strong>.</p>
        <p><strong>Langkah 2 — copula Gaussian ρ=0,3:</strong> <Tex math={String.raw`P = \Phi_{0{,}3}(\Phi^{-1}(0{,}05), \Phi^{-1}(0{,}05))`} /> ≈ <strong>0,9%</strong> (perhitungan numerik bivariat normal).</p>
        <p><strong>Langkah 3 — data krisis aktual:</strong> pada 2008–2009, default bersama hipotek subprime di pool yang sama mencapai <strong>5–15%</strong> — <strong>10–60×</strong> prediksi model!</p>
        <p><strong>Langkah 4 — kesimpulan validator:</strong> model <em>underestimate</em> risiko bersama sebesar <strong>satu-dua orde besaran</strong> tepat di skenario yang penting. <strong>Rekomendasi: tolak untuk risk measurement; batasi untuk kuotasi harga dengan disclosure.</strong></p>
        <p><strong>Angka ini artinya:</strong> uji sederhana ini — bisa dilakukan 2005 dengan kalkulator — akan mengekspos lubang terbesar model. Validasi yang baik bukan tentang matematika tercanggih; ia tentang <strong>pertanyaan yang tepat</strong>: <em>&ldquo;apa yang terjadi di ekor?&rdquo;</em></p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model yang dipakai semua orang pasti sudah tervalidasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> adopsi massal justru <strong>menurunkan</strong> insentif validasi — &ldquo;kalau semua pakai, pasti benar&rdquo; (<em>appeal to common practice</em>). Gaussian copula dipakai seluruh Wall Street <em>tanpa</em> validasi independen yang memadai, karena tidak ada yang mau menjadi <em>satu-satunya</em> yang mempertanyakan standar industri. Validator yang baik <strong>kebal terhadap argumen popularitas</strong>: &ldquo;dipakai semua orang&rdquo; bukan bukti validitas — kadang justru bukti <em>risiko sistemik</em> (semua orang salah dengan cara yang sama).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk setiap model, tulis <strong>&ldquo;surat wasiat&rdquo;</strong>-nya — tiga baris: <em>(1) Asumsi yang jika salah akan membunuh kita: ... (2) Tanda-tanda asumsi mulai salah: ... (3) Yang harus dilakukan saat tanda muncul: ...</em> Untuk copula Gaussian 2005: (1) tail dependence nol; (2) harga rumah turun nasional; (3) hentikan pemakaian untuk risk, naikkan haircut. Model dengan surat wasiat = model yang bisa diwariskan; model tanpa = bom dengan label &ldquo;canggih&rdquo;.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: keputusan validasi — kapan &ldquo;bersyarat&rdquo; vs &ldquo;tolak&rdquo; (klik untuk buka)</summary>
        <p><strong>Kasus:</strong> model VaR delta-gamma untuk desk opsi. Backtest: 5 pelanggaran/250 hari (kuning). PLA: korelasi Spearman RTPL-HPL 0,72 (lolos ambang 0,7 — <em>tipis</em>). Uji KS: gagal di 5% (distribusi beda signifikan).</p>
        <p><strong>Analisis per pilar:</strong> (1) <strong>Konseptual:</strong> teori tepat (delta-gamma untuk opsi — MR4) ✔. (2) <strong>Outcome:</strong> backtest kuning = <em>peringatan</em>, bukan vonis; KS gagal = model <strong>salah bentuk distribusi</strong> (mungkin vol smile tidak tertangkap) ✘. (3) <strong>Monitoring:</strong> korelasi PLA 0,72 dan <em>menurun</em> 3 kuartal berturut-turut (0,85 → 0,78 → 0,72) — tren buruk ✘.</p>
        <p><strong>Keputusan: SETUJUI BERSYARAT</strong> (bukan tolak, bukan lolos penuh): boleh dipakai untuk limit dengan <strong>add-on konservatisme 20%</strong> + <strong>monitoring bulanan</strong> (bukan kuartalan) + <strong>batas waktu 6 bulan</strong> untuk perbaiki distribusi (masukkan skew). Jika tren PLA terus turun → tolak.</p>
        <p><strong>Pelajaran:</strong> validasi jarang hitam-putih. <strong>&ldquo;Setuju bersyarat + batas waktu + pemantauan ketat&rdquo;</strong> adalah keputusan paling umum di dunia nyata — dan yang paling sulit: ia butuh validator yang berani <em>tidak populer</em> (tidak menolak mentah-mentah, tidak menyetujui membabi-buta).</p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — challenger model:</strong> bank besar tidak mengandalkan <em>satu</em> model — mereka menjalankan <strong>challenger model</strong> (model pembanding independen, biasanya lebih sederhana) secara paralel. Contoh: VaR utama = Monte Carlo t-copula; challenger = Historical Simulation. Aturan: jika selisih keduanya &gt; threshold (misal 25%) selama 2 minggu → <strong>investigasi wajib</strong>. Challenger adalah <strong>validasi berkelanjutan yang otomatis</strong> — ia menangkap degradasi model <em>sebelum</em> backtest kuartalan. Biaya: 2× komputasi. Manfaat: tidak pernah lagi terkejut &ldquo;kok modelnya tiba-tiba salah?&rdquo;. Untuk capstone-mu: jadikan metode yang <em>tidak terpilih</em> sebagai challenger permanen — itulah praktik industri yang sesungguhnya.</p>
      </div>
      <p><strong>Empat kalimat yang harus bisa diucapkan setiap validator:</strong> (1) &ldquo;Model ini <em>valid untuk tujuan X</em>, bukan valid secara umum.&rdquo; (2) &ldquo;Asumsi paling berbahayanya adalah ___ dan ia sedang ___ (aman/retak/jebol).&rdquo; (3) &ldquo;Jika asumsi itu jebol, kerugiannya sekitar Rp ___.&rdquo; (4) &ldquo;Saya merekomendasikan ___ (setuju/bersyarat/tolak) karena ___.&rdquo; Validator yang tidak bisa mengucapkan keempatnya dengan angka konkret <strong>belum selesai bekerja</strong> — ia baru selesai membaca.</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Model VaR backtest hijau 3 tahun berturut-turut. Validator menemukan: korelasi sekuritisasi diasumsikan 0,3 (konstan), data 2019–2021 (tenang). Tulis temuan validasi + rekomendasi. (klik untuk pembahasan)</summary>
        <p><strong>Temuan (konseptual, blocking):</strong> &ldquo;Asumsi korelasi konstan 0,3 tidak valid untuk sekuritisasi — bukti historis (2008) menunjukkan korelasi → 0,9 saat stres. Backtest hijau <em>hanya</em> mencerminkan periode tenang dalam data; ia tidak menguji asumsi yang paling berbahaya. Model <strong>lolos outcome tapi gagal konseptual</strong>.&rdquo;</p>
        <p><strong>Rekomendasi:</strong> (1) larang pemakaian untuk limit tanpa <strong>overlay korelasi-stres</strong>; (2) wajibkan uji sensitivitas korelasi 0,3→0,9 di setiap laporan; (3) jadwalkan review ulang saat volatilitas pasar naik (pemicu monitoring). <strong>Backtest hijau ≠ tervalidasi</strong> — inilah bedanya validator dari tukang stempel.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Bedakan &ldquo;model untuk pricing&rdquo; vs &ldquo;model untuk risk measurement&rdquo; dengan contoh Black-Scholes dan copula Li. (klik untuk pembahasan)</summary>
        <p><strong>Pricing model:</strong> alat <em>kuotasi/interpolasi</em> — Black-Scholes mengubah harga opsi jadi &ldquo;implied vol&rdquo; (bahasa pasar); copula Li mengubah harga tranche jadi &ldquo;implied correlation&rdquo;. Keduanya <em>tidak mengklaim</em> probabilitas fisik yang benar.</p>
        <p><strong>Risk model:</strong> butuh <strong>probabilitas aktual</strong> — seberapa mungkin rugi RpX? Memakai model pricing untuk risiko = memakai kamus sebagai peta: <strong>kesalahan kategori</strong>. Inilah dosa copula Li: formula kuotasi dipakai untuk peringkat AAA, modal, dan limit. <strong>Use test</strong> (SR 11-7): validasi harus menilai model <em>untuk tujuan pemakaiannya</em> — bukan validitas abstraknya.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Tulis &ldquo;surat wasiat&rdquo; 3-baris untuk model EWMA λ=0,94 yang dipakai VaR harian. (klik untuk pembahasan)</summary>
        <p><strong>(1) Asumsi yang jika salah membunuh kita:</strong> volatilitas masa depan ≈ volatilitas tertimbang masa lalu; tidak ada jump; λ=0,94 cukup cepat menangkap regime change. <strong>(2) Tanda-tanda asumsi mulai salah:</strong> pelanggaran VaR bergerombol (Christoffersen menolak), VIX &gt;&gt; realized vol, event geopolitik terjadwal. <strong>(3) Yang dilakukan saat tanda muncul:</strong> turunkan λ sementara / overlay skenario stres / naikkan multiplier modal; eskalasi ke komite risiko. Model dengan surat wasiat = <strong>alat</strong>; tanpa = <strong>bom</strong>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Validasi yang Menemukan Bom</h2>
      <div className="callout">
        <p>Validator independen me-review model <strong>pricing obligasi callable</strong> yang dipakai desk:</p>
        <ul>
          <li><strong>Konseptual:</strong> model memakai <strong>volatilitas konstan</strong> untuk opsi call embedded — padahal callable = short opsi suku bunga dengan vol yang <em>berubah</em> (MR11: smile!)</li>
          <li><strong>Benchmarking:</strong> model sederhana (binomial tree dengan vol smile) memberi harga <strong>3% lebih rendah</strong> — konsisten di semua sampel</li>
          <li><strong>Lineage:</strong> kurva volatilitas di-input <strong>manual via spreadsheet</strong> — tanpa kontrol versi, tanpa jejak siapa mengubah</li>
          <li>Dampak: portofolio Rp2 T → potensi <strong>overvaluasi Rp60 M</strong> + risiko suku bunga salah ukur</li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Pilar mana yang menemukan apa? (b) Mengapa backtest tidak menangkap ini? (c) Rekomendasi validator?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Konseptual</strong> menemukan cacat teori (vol konstan untuk opsi = salah); <strong>benchmarking</strong> mengkuantifikasi dampak (3% = Rp60 M); <strong>lineage</strong> menemukan risiko operasional (spreadsheet tanpa kontrol). Tiga pilar, tiga temuan berbeda — <strong>tidak ada yang redundan</strong>.</p>
          <p>(b) <strong>Backtest tidak menangkap</strong> karena: obligasi callable jarang diperdagangkan (sedikit observasi), dan mispricing 3% <strong>konsisten</strong> (bias sistematis, bukan pelanggaran acak). Backtest menguji <em>frekuensi</em> — buta terhadap <em>bias level</em>. Inilah mengapa pilar konseptual + benchmarking <strong>tidak tergantikan</strong>.</p>
          <p>(c) <strong>Rekomendasi:</strong> (1) <em>Tolak</em> model untuk produksi sampai vol smile dimasukkan; (2) <em>wajibkan</em> input kurva vol via sistem terkontrol (bukan spreadsheet); (3) <em>adjustment valuasi</em> Rp60 M sementara (cadangan); (4) <em>tenggat</em> perbaikan 3 bulan dengan re-validasi. <strong>Validasi tanpa rekomendasi tegas = saran yang diabaikan.</strong></p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Tiga pilar validasi model (SR 11-7)?"
        options={[
          "Backtest, backtest, backtest",
          "Conceptual soundness + ongoing monitoring + outcomes analysis — backtest hanya satu bagian dari pilar ketiga",
          "Data, data, data",
          "Profit, profit, profit",
        ]}
        correct={1}
        explanation="Benar. Tiga pilar saling melengkapi: ide benar? masih benar? terbukti benar? Mengklaim 'tervalidasi' hanya dari backtest = pelanggaran disiplin."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa validator harus independen dari pembuat/pengguna model?"
        options={[
          "Agar terlihat formal",
          "Tidak bisa menilai karya sendiri secara objektif — bias konfirmasi membuat cacat konseptual tak terlihat oleh pembuatnya",
          "Agar mahal",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar. Pembuat model 'jatuh cinta' pada kreasinya — buta terhadap asumsi lemah yang ia buat sendiri. Independensi = syarat, bukan formalitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model VaR tiba-tiba aneh. Langkah investigasi PERTAMA?"
        options={[
          "Ganti modelnya",
          "Lacak data lineage — 80% anomali berasal dari data (stale price, mapping salah, timestamp), bukan model",
          "Naikkan VaR manual",
          "Abaikan",
        ]}
        correct={1}
        explanation="Benar. Lineage dulu, model kemudian. Cerita pembuka membuktikan: model sempurna + data basi 3 minggu = bencana Rp200 M."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Override model sering terjadi oleh trader. Artinya?"
        options={[
          "Trader nakal",
          "Sinyal model tidak dipercaya/tidak fit — override log adalah 'spesifikasi perbaikan' yang ditulis pengguna; selidiki polanya",
          "Normal saja",
          "Model terlalu bagus",
        ]}
        correct={1}
        explanation="Benar. Override berulang = pengguna memberi tahu (dengan tindakan) bahwa model salah di situasi tertentu. Validator cerdas membaca ini sebagai peta perbaikan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kualitas data: vendor 98%, pembersihan 97%, mapping 85%, sisanya 99%. Masalah utama?"
        options={[
          "Vendor",
          "Mapping — kualitas = PERKALIAN, satu tahap 85% merusak seluruh rantai; perbaiki titik bocor dulu",
          "Semua sama",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar. 0,98×0,97×0,85×0,99² ≈ 79% — mapping sendirian menghilangkan 15 poin. Investasi paling efektif = perbaiki yang terburuk, bukan yang sudah bagus."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model lolos backtest tapi validator menemukan teori cacat (asumsi yang runtuh saat krisis). Keputusan?"
        options={[
          "Lolos — backtest hijau berarti aman",
          "Tolak/batasi — conceptual soundness adalah pilar tersendiri; backtest hijau bisa karena beruntung; model dengan teori cacat = bom waktu",
          "Abaikan teori",
          "Pakai dengan hati-hati tanpa batasan",
        ]}
        correct={1}
        explanation="Benar. Tiga pilar = tiga veto. Gagal satu pilar = tidak lolos. Backtest menguji masa lalu; teori cacat = gagal di masa depan yang belum terjadi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Validasi = 3 pilar:</strong> conceptual soundness (ide benar?) + ongoing monitoring (masih benar?) + outcomes analysis (terbukti?).</li>
          <li><strong>Backtest ≠ validasi</strong> — hanya satu bagian dari satu pilar.</li>
          <li><strong>Validator independen;</strong> validasi berkelanjutan (bukan sekali).</li>
          <li><strong>Override log</strong> = peta perbaikan; dokumentasikan <strong>kapan model gagal</strong>.</li>
          <li><strong>Data lineage</strong> = silsilah angka; kualitas = perkalian — perbaiki <strong>titik bocor</strong>.</li>
          <li>Anomali → <strong>lineage dulu</strong> (80% = data).</li>
          <li>Validasi tanpa rekomendasi tegas = saran yang diabaikan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr17-limit-laporan" className="btn btn-secondary btn-sm">← MR17</Link>
        <Link href="/learn/mr19-capstone-var-es" className="btn btn-primary btn-sm">Next: MR19 (Capstone) →</Link>
      </div>
    </div>
  );
}
