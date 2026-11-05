"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E13Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const varDistData = [
    {
      x: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
      y: [1, 3, 8, 18, 35, 60, 90, 120, 140, 130, 100, 70, 40, 20],
      type: "bar",
      name: "Distribusi P&L harian (Rp jt)",
      marker: { color: "#2a7de1" },
    },
  ];

  const backtestData = [
    {
      x: Array.from({ length: 60 }, (_, i) => i + 1),
      y: [3, -2, 5, -4, 2, -6, 4, 1, -3, 6, -2, 4, -5, 3, 2, -4, 5, -3, 2, -7, 4, 3, -2, 5, -4, 3, -6, 2, 4, -3, 5, -2, 6, -4, 3, -5, 2, 4, -8, 3, -2, 5, -3, 4, -4, 2, 6, -3, 3, -5, 4, 2, -4, 7, -3, 5, -2, 4, -3, 2],
      mode: "lines+markers",
      name: "P&L harian aktual",
      line: { color: "#2a7de1", width: 2 },
      marker: { size: 4 },
    },
    {
      x: [1, 60],
      y: [-5, -5],
      mode: "lines",
      name: "VaR 95% (−Rp5 jt)",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
  ];

  const stressData = [
    {
      x: ["Normal", "VaR 99%", "ES 99%", "Krisis 2008", "COVID crash", "Rupiah −20%"],
      y: [-5, -8, -11, -35, -28, -22],
      type: "bar",
      marker: { color: ["#94a3b8", "#e8a838", "#e8a838", "#ef4444", "#ef4444", "#ef4444"] },
      text: ["−5", "−8", "−11", "−35", "−28", "−22"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — VaR 3 metode: satu portofolio, tiga jawaban
import math, random
random.seed(42)
# Simulasi 1000 hari return harian (Rp jt): mean 0,5, vol 4
rets = [random.gauss(0.5, 4.0) for _ in range(1000)]
rets_sorted = sorted(rets)

# 1) Historical: persentil 5% data historis
var_hist = -rets_sorted[int(0.05 * len(rets_sorted))]

# 2) Parametrik: asumsi normal
mean = sum(rets) / len(rets)
var = sum((x - mean) ** 2 for x in rets) / len(rets)
sd = math.sqrt(var)
var_param = -(mean - 1.645 * sd)

# 3) Monte Carlo: simulasi ulang dari distribusi fitted
mc = [random.gauss(mean, sd) for _ in range(20000)]
var_mc = -sorted(mc)[int(0.05 * len(mc))]

# Expected Shortfall (historical): rata-rata 5% terburuk
es = -sum(rets_sorted[:int(0.05*len(rets_sorted))]) / int(0.05*len(rets_sorted))

print(f"VaR 95% 1-hari (Rp jt):")
print(f"  Historical : Rp{var_hist:.1f} jt")
print(f"  Parametrik : Rp{var_param:.1f} jt")
print(f"  Monte Carlo: Rp{var_mc:.1f} jt")
print(f"ES 95%       : Rp{es:.1f} jt  (rata-rata saat VaR jebol)")
print()
print("Coba: vol jadi 8.0 (pasar liar). Metode mana yang paling 'jujur'?")`;

  const lab2Code = `# Lab 2 — Backtest: apakah VaR-mu pembohong?
# VaR 95% diklaim. Simulasikan 250 hari, hitung pelanggaran.
import random
random.seed(7)
var_limit = -5.0  # klaim: rugi > Rp5 jt hanya 5% hari
pelanggaran = 0
for _ in range(250):
    pnl = random.gauss(0.5, 3.2)  # realita: vol LEBIH BESAR dari asumsi model
    if pnl < var_limit:
        pelanggaran += 1

ekspektasi = 250 * 0.05
print(f"Hari: 250 | Pelanggaran: {pelanggaran} | Ekspektasi: {ekspektasi:.0f}")
if pelanggaran > ekspektasi * 1.5:
    print("-> ZONA MERAH: model MEREMEHKAN risiko! Kalibrasi ulang SEGERA.")
elif pelanggaran > ekspektasi:
    print("-> ZONA KUNING: waspada, pantau terus.")
else:
    print("-> ZONA HIJAU: model OK (sementara).")
print()
print("Coba: vol jadi 2.5 (model terlalu KONSERVATIF). Zona apa?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E13 — Financial Markets</span>
        <h1 className="display-title">Market Risk:<br />Mengukur Badai Sebelum Datang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Rugi Rp5 Miliar — Normal?&rdquo;</a></li>
          <li><a href="#var">VaR — &ldquo;Seburuk Apa Hari Buruk?&rdquo;</a></li>
          <li><a href="#metode">Tiga Metode VaR</a></li>
          <li><a href="#es">Expected Shortfall — Melampaui VaR</a></li>
          <li><a href="#backtest">Backtesting — Poligraf Model</a></li>
          <li><a href="#stress">Stress Test — Skenario Kiamat</a></li>
          <li><a href="#lab1">🔬 Lab 1: VaR Tiga Metode</a></li>
          <li><a href="#lab2">🔬 Lab 2: Backtest VaR</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Alat Mana untuk Situasi Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Limit Treasury Jebol</a></li>
          <li><a href="#worked1">🔬 Worked Example: VaR Parametrik — Hitung Tangan</a></li>
          <li><a href="#worked2">🔬 Worked Example: VaR Historis dari Data</a></li>
          <li><a href="#konteks">🌍 Konteks: London Whale — VaR yang Dimanipulasi</a></li>
          <li><a href="#estail">🔧 Pendalaman: Expected Shortfall — Melampaui VaR</a></li>
          <li><a href="#stresstest">🔧 Pendalaman: Stress Test — Skenario 1998 untuk Bankmu</a></li>
          <li><a href="#worked4">🔬 Worked Example: Kerugian Skenario vs Modal</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendefinisikan VaR dengan tepat (termasuk yang TIDAK dikatakannya) dan menghitungnya dengan tiga metode.</li>
          <li>Menjelaskan Expected Shortfall dan mengapa ia melengkapi VaR.</li>
          <li>Melakukan backtesting sederhana dan membaca zona traffic-light.</li>
          <li>Merancang stress test (historis &amp; hipotetis) untuk melengkapi ukuran statistik.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Rugi Rp5 Miliar — Normal?&rdquo;</h2>
      <div className="story">
        <p>Senin pagi, meja treasury bank melaporkan <strong>rugi Rp5 miliar dalam sehari</strong>. Direksi panik: <em>&ldquo;Siapa yang salah?!&rdquo;</em> Kepala risk management membuka laporan: <em>&ldquo;VaR 99% harian kita Rp6 miliar. Artinya rugi sampai Rp6 miliar <strong>diharapkan</strong> terjadi ~2–3 hari setahun. Hari ini bukan kegagalan — ini <strong>hari buruk yang normal</strong>.&rdquo;</em></p>
        <p>Ruangan hening. Tanpa VaR, setiap rugi terasa seperti kesalahan. Dengan VaR, bank tahu <strong>berapa &ldquo;cuaca buruk&rdquo; yang sudah dianggarkan</strong> — dan kapan rugi sudah <em>melewati</em> batas wajar sehingga perlu investigasi. Inilah pekerjaan analis market risk: <strong>menerjemahkan ketidakpastian menjadi angka yang bisa diawasi</strong>.</p>
        <p><strong>Twist-nya:</strong> direksi mengira VaR adalah <strong>ramalan kerugian maksimum</strong> — &ldquo;jadi kita tidak akan rugi lebih dari Rp6 miliar?&rdquo; Salah total. VaR justru <em>menjamin</em> bahwa kerugian di atas Rp6 miliar <strong>akan terjadi</strong> — sekitar 2–3 hari setiap tahun. VaR bukan sabuk pengaman; ia <strong>speedometer</strong>: ia tidak mencegah kecelakaan, ia memberitahumu <em>seberapa kencang kamu melaju</em> sehingga kamu tahu kapan harus menginjak rem. Lesson ini mengajarkan cara membaca speedometer — dan kapan ia berbohong.</p>
      </div>

      <h2 id="var">VaR — &ldquo;Seburuk Apa Hari Buruk?&rdquo;</h2>
      <p><strong>Definisi.</strong> <em>Value at Risk</em> (VaR) pada tingkat kepercayaan <Tex math={String.raw`1-\alpha`} /> dan horizon <Tex math={String.raw`T`} /> = <strong>kerugian maksimum yang tidak akan terlampaui</strong> dengan probabilitas <Tex math={String.raw`1-\alpha`} />:</p>
      <Tex math={String.raw`P(\text{Loss} > VaR_{\alpha}) = \alpha`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\alpha`} /> = toleransi pelanggaran (VaR 95% → α=5%; VaR 99% → α=1%); horizon = periode (1 hari untuk trading, 10 hari untuk regulasi Basel).</p>
      <p><strong>Contoh baca:</strong> &ldquo;VaR 99% 1-hari = Rp6 M&rdquo; artinya: <em>ada 99% peluang rugi besok ≤ Rp6 M; ada 1% peluang rugi &gt; Rp6 M</em>. <strong>Bukan</strong> &ldquo;rugi maksimal Rp6 M&rdquo;!</p>
      <p><strong>Kepribadian VaR:</strong> dia <em>prakiraan cuaca</em> — &ldquo;besok 95% tidak hujan lebat&rdquo;. Berguna untuk persiapan harian, <strong>tidak</strong> untuk menggambarkan banjir bandang.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR 99% Rp6 M = rugi maksimal Rp6 M.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR <strong>diam</strong> tentang seberapa buruk 1% hari terburuk itu — ruginya bisa Rp7 M, Rp50 M, atau bangkrut. VaR = <em>ambang</em>, bukan <em>langit-langit</em>. Inilah kritik paling terkenal VaR (yang diperbaiki ES di bawah) — dan salah satu pemicu krisis 2008: semua orang merasa aman di balik angka VaR.</p>
      </div>

      <h2 id="metode">Tiga Metode VaR</h2>
      <h3>1. Historical Simulation — &ldquo;biarkan data bicara&rdquo;</h3>
      <p>Ambil N hari return historis, urutkan, ambil persentil ke-α. <strong>Pro:</strong> tanpa asumsi distribusi (menangkap ekor tebal &amp; skew asli). <strong>Kontra:</strong> buta terhadap kejadian yang <em>belum pernah</em> terjadi; sensitif pada pemilihan window.</p>
      <h3>2. Parametrik (Variance-Covariance) — &ldquo;asumsikan normal&rdquo;</h3>
      <Tex math={String.raw`VaR_{\alpha} = -(\mu - z_{\alpha} \cdot \sigma) \times \text{nilai portofolio}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\mu`} /> = mean return; <Tex math={String.raw`\sigma`} /> = volatilitas; <Tex math={String.raw`z_{\alpha}`} /> = 1,645 (95%) atau 2,33 (99%). <strong>Pro:</strong> cepat, mudah agregasi. <strong>Kontra:</strong> asumsi normal <strong>meremehkan ekor</strong> (E7: return itu leptokurtik!).</p>
      <h3>3. Monte Carlo — &ldquo;simulasikan ribuan dunia&rdquo;</h3>
      <p>Bangkitkan ribuan skenario dari model (bisa non-normal, bisa multi-aset dengan korelasi), hitung persentil. <strong>Pro:</strong> paling fleksibel (opsi non-linear! korelasi!). <strong>Kontra:</strong> berat komputasi; <em>garbage in, garbage out</em> — sebagus modelnya.</p>
      <p><strong>Horizon scaling:</strong> VaR 1-hari → 10-hari: <Tex math={String.raw`VaR_{10} \approx VaR_1 \times \sqrt{10}`} /> (aturan akar-waktu; hanya valid jika return i.i.d. — waspadai!).</p>

      <PlotlyChart
        data={varDistData}
        title="VaR & ES pada Distribusi P&L Harian (ilustratif)"
        layout={{ xaxis: { title: "P&L harian (Rp jt)" }, yaxis: { title: "Frekuensi" }, showlegend: false, shapes: [{ type: "line", x0: -5, x1: -5, y0: 0, y1: 140, line: { color: "#ef4444", width: 3, dash: "dash" } }, { type: "line", x0: -7, x1: -7, y0: 0, y1: 140, line: { color: "#991b1b", width: 3 } }] }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> histogram P&amp;L harian. Garis merah putus-putus = VaR 95% (−5), garis merah gelap = ES 95% (−7).</p>
        <p><strong>Interpretasi:</strong> 5% batang histogram ada <strong>di kiri</strong> garis VaR — itulah hari-hari &ldquo;pelanggaran&rdquo;. VaR hanya menandai <em>ambangnya</em>; <strong>ES</strong> (−7) = rata-rata kerugian <em>di dalam</em> zona merah — menjawab &ldquo;kalau jebol, seberapa dalam rata-ratanya?&rdquo;. Perhatikan ekor kiri lebih panjang dari kanan (<em>skew negatif</em>) — alasan metode parametrik-normal meremehkan.</p>
      </div>

      <h2 id="es">Expected Shortfall — Melampaui VaR</h2>
      <p><strong>Definisi.</strong> <em>Expected Shortfall</em> (ES, alias <em>Conditional VaR</em>) = <strong>rata-rata kerugian</strong> pada kondisi VaR terlampaui:</p>
      <Tex math={String.raw`ES_{\alpha} = E[\text{Loss} \mid \text{Loss} > VaR_{\alpha}]`} block />
      <p><strong>Artinya:</strong> &ldquo;jika hari ini termasuk 1% hari terburuk, <em>rata-rata</em> ruginya berapa?&rdquo; ES selalu ≥ VaR.</p>
      <p><strong>Dua keunggulan ES:</strong> (1) menjawab pertanyaan yang VaR diamkan (kedalaman ekor); (2) <strong>koheren</strong> (<em>subadditive</em>): ES portofolio ≤ jumlah ES anggotanya — VaR bisa melanggar ini (VaR dua portofolio gabungan <em>bisa</em> &gt; jumlah VaR-nya: tidak masuk akal untuk diversifikasi!). Inilah mengapa <strong>Basel/FRTB beralih dari VaR ke ES</strong> untuk modal risiko pasar.</p>
      <p><strong>Kepribadian ES:</strong> VaR = &ldquo;di mana pagar pembatasnya&rdquo;; ES = &ldquo;rata-rata dalamnya jurang di balik pagar&rdquo;. Keduanya dibutuhkan — pagar untuk operasional harian, jurang untuk kesiapan modal.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> VaR menjawab <em>&ldquo;seberapa sering pagar jebol?&rdquo;</em> (frekuensi). ES menjawab <em>&ldquo;kalau jebol, seberapa parah?&rdquo;</em> (keparahan). <strong>Frekuensi tanpa keparahan = setengah informasi.</strong> Inilah mengapa laporan risk modern menampilkan keduanya berdampingan — dan mengapa interviewer risk menanyakan keduanya.</p>
      </div>

      <h2 id="backtest">Backtesting — Poligraf Model</h2>
      <p><strong>Definisi.</strong> <em>Backtesting</em> = bandingkan prediksi VaR dengan <strong>realisasi aktual</strong>: hitung berapa kali rugi melebihi VaR (<em>exceptions</em>) dalam N hari. VaR 99% 1-hari dalam 250 hari → ekspektasi ≈ <strong>2–3 pelanggaran</strong>.</p>
      <p><strong>Zona traffic-light Basel</strong> (250 hari, VaR 99%):</p>
      <ul>
        <li><strong>Hijau</strong> (0–4 pelanggaran): model OK.</li>
        <li><strong>Kuning</strong> (5–9): waspada — denda modal naik.</li>
        <li><strong>Merah</strong> (10+): model ditolak — kalibrasi ulang wajib.</li>
      </ul>
      <p><strong>Kepribadian backtest:</strong> dia <em>poligraf</em> — tidak membuktikan model benar, tapi <strong>menangkap model yang berbohong</strong>. Model VaR yang tidak pernah di-backtest = ramalan dukun berjas.</p>

      <PlotlyChart
        data={backtestData}
        title="Backtest 60 Hari: Pelanggaran vs Batas VaR (ilustratif)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "P&L (Rp jt)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = P&amp;L aktual harian; garis merah putus-putus = batas VaR 95% (−5). Titik di <strong>bawah</strong> garis merah = pelanggaran.</p>
        <p><strong>Interpretasi:</strong> ada 4 pelanggaran dalam 60 hari (≈6,7% vs ekspektasi 5%) — masih wajar untuk VaR 95% (zona hijau-kuning). <strong>Waspadai klaster</strong>: pelanggaran berurutan (hari 36–39) lebih berbahaya dari yang tersebar — menandakan model <em>telat</em> menangkap rezim volatilitas baru (inilah gunanya <em>filtered historical simulation</em> di level lanjut).</p>
      </div>

      <h2 id="stress">Stress Test — Skenario Kiamat</h2>
      <p><strong>Definisi.</strong> <em>Stress test</em> = hitung rugi portofolio di bawah <strong>skenario ekstrem tapi masuk akal</strong> — melengkapi VaR/ES yang &ldquo;buta&rdquo; di luar data historis:</p>
      <ul>
        <li><strong>Historis:</strong> &ldquo;bagaimana jika 2008 / COVID-crash terulang?&rdquo; — terapkan guncangan historis ke portofolio kini.</li>
        <li><strong>Hipotetis:</strong> &ldquo;bagaimana jika rupiah −20% + bunga +300bps + IHSG −30% <em>bersamaan</em>?&rdquo; — dirancang komite risiko.</li>
        <li><strong>Reverse:</strong> &ldquo;skenario apa yang membuat kami <em>bangkrut</em>?&rdquo; — mundur dari kebangkrutan ke pemicunya.</li>
      </ul>
      <p><strong>Kepribadian stress test:</strong> VaR/ES = <em>statistik cuaca harian</em>; stress test = <em>simulasi gempa</em>. Yang pertama untuk operasional, yang kedua untuk <strong>kelangsungan hidup</strong>. Direksi &amp; regulator (OJK/BI) membaca yang kedua.</p>

      <PlotlyChart
        data={stressData}
        title="Dari Normal ke Kiamat: Seberapa Dalam Lukanya? (Rp jt, ilustratif)"
        layout={{ xaxis: { title: "Skenario" }, yaxis: { title: "Rugi (Rp jt)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = estimasi rugi portofolio di satu skenario, dari normal (abu) hingga kiamat (merah).</p>
        <p><strong>Interpretasi:</strong> VaR 99% (−8) dan ES (−11) terlihat &ldquo;terkendali&rdquo; — tapi skenario krisis 2008 = <strong>−35, 4× lipat VaR!</strong> Inilah pesan stress test: <strong>ukuran statistik meremehkan krisis sistemik</strong>. Bank yang hanya patuh VaR tanpa stress test = berlayar tanpa sekoci.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau VaR hijau (lolos backtest), bank aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> backtest hijau = model <em>konsisten dengan masa lalu</em> — bukan jaminan masa depan. Krisis 2008 menghantam bank-bank dengan VaR &ldquo;hijau&rdquo;. Keamanan butuh <strong>lapisan</strong>: VaR (harian) + ES (ekor) + stress test (kiamat) + limit (rem). Satu metrik = satu sudut pandang.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: VaR Tiga Metode</h2>
      <p>Hitung VaR 95% satu portofolio dengan tiga metode + ES. Bandingkan jawabannya.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator VaR (Historical, Parametrik, Monte Carlo) + ES"
        hint="Coba: vol jadi 8.0 (ganti 4.0). Lalu tambahkan skew: rets = [random.gauss(0.5,4.0) - abs(random.gauss(0,3.0)) ...]. Metode parametrik makin meleset — kenapa?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Backtest VaR</h2>
      <p>Jadilah <em>risk validator</em>: uji apakah klaim VaR 95% sebuah desk jujur atau pembohong.</p>
      <PyodideLab
        title="Lab 2 — Simulator Backtest & Traffic Light"
        hint="Coba: vol realita = 2.5 (lebih KECIL dari asumsi). Pelanggaran < ekspektasi = zona hijau, tapi model terlalu konservatif = modal menganggur. Backtest juga menangkap 'terlalu takut'!"
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> analis market risk profesional hidup dalam <strong>tiga horizon</strong>: <em>kemarin</em> (backtest: apakah modelku jujur?), <em>besok</em> (VaR/ES: berapa batas normal?), <em>kiamat</em> (stress: apakah kami selamat?). Kuasai ketiganya dan kamu bicara bahasa meja risiko.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Alat Mana untuk Situasi Apa</h2>

      <div className="decision-card">
        <h3>1. Monitor harian meja trading → <strong>VaR 99% 1-hari + limit</strong></h3>
        <p><strong>Kondisi:</strong> operasional harian, butuh angka cepat.</p>
        <p><strong>Kenapa:</strong> VaR = bahasa umum trader &amp; risk; limit VaR = rem otomatis.</p>
        <p><strong>Contoh nyata:</strong> desk FX dengan limit VaR Rp2 M/hari.</p>
      </div>

      <div className="decision-card">
        <h3>2. Hitung modal &amp; laporkan ke regulator → <strong>ES (FRTB)</strong></h3>
        <p><strong>Kondisi:</strong> kebutuhan modal risiko pasar.</p>
        <p><strong>Kenapa:</strong> ES koheren (subadditive) &amp; menangkap ekor — standar Basel terkini.</p>
        <p><strong>Contoh nyata:</strong> laporan KPMM bank ke OJK.</p>
      </div>

      <div className="decision-card">
        <h3>3. Validasi model → <strong>Backtesting (traffic light)</strong></h3>
        <p><strong>Kondisi:</strong> triwulanan / setelah pelanggaran beruntun.</p>
        <p><strong>Kenapa:</strong> satu-satunya cara objektif menangkap model yang meremehkan risiko.</p>
        <p><strong>Contoh nyata:</strong> zona kuning 2 kuartal berturut-turut → kalibrasi ulang.</p>
      </div>

      <div className="decision-card">
        <h3>4. Rapat direksi / krisis → <strong>Stress test (bukan VaR!)</strong></h3>
        <p><strong>Kondisi:</strong> pertanyaan &ldquo;bagaimana jika krisis?&rdquo;.</p>
        <p><strong>Kenapa:</strong> VaR diam tentang kiamat; stress test dirancang untuk itu. Direksi berpikir skenario, bukan persentil.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;Rugi Rp35 M jika 2008 terulang — masih dalam selera risiko?&rdquo;</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>VaR = ambang, bukan langit-langit.</strong> Selalu pasangkan dengan ES.</li>
          <li><strong>Model tanpa backtest = dukun berjas.</strong> Traffic light tiap kuartal.</li>
          <li><strong>Untuk kiamat, pakai stress test</strong> — statistik meremehkan krisis sistemik.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Limit Treasury Jebol</h2>
      <div className="callout">
        <p>Desk treasury bank punya limit VaR 99% 1-hari Rp3 M. Senin rugi Rp2,5 M (dalam limit). Selasa rugi Rp4,2 M (<strong>pelanggaran</strong>). Rabu rugi Rp3,8 M (<strong>pelanggaran lagi</strong>). Kepala desk berdalih: <em>&ldquo;Kan 1% hari boleh jebol — ini cuma 2 hari dari 250, masih wajar!&rdquo;</em></p>
        <p><strong>Pertanyaan:</strong> (a) Apakah dalihnya benar secara statistik? (b) Apa yang <em>seharusnya</em> dilakukan risk management? (c) Metrik apa yang lebih menggambarkan bahaya situasi ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Secara hitungan kasar ya</strong> (2/250 = 0,8% ≈ 1%) — TAPI <strong>pelanggaran berurutan</strong> = red flag <em>clustering</em>: model telat menangkap lonjakan volatilitas. Backtest yang baik menguji <em>independensi</em> juga, bukan cuma frekuensi (uji Christoffersen).</p>
          <p>(b) <strong>Eskalasi + investigasi</strong>: cek apakah posisi membesar diam-diam (<em>limit breach</em> vs <em>VaR breach</em>), hitung ulang VaR dengan data terbaru (<em>filtered HS</em>), dan pertimbangkan <strong>pengurangan posisi paksa</strong> sampai model tervalidasi ulang.</p>
          <p>(c) <strong>ES</strong> (berapa rata-rata parahnya saat jebol?) + <strong>stress test</strong> intraday (&ldquo;jika besok seperti 2008, berapa ruginya dengan posisi <em>saat ini</em>?&rdquo;). VaR menjawab frekuensi — situasi ini butuh jawaban <em>keparahan</em>.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: VaR Parametrik — Dari Volatilitas ke Rupiah</h2>
      <p>Meja treasury memegang portofolio obligasi <strong>Rp100 miliar</strong>, volatilitas harian <strong>2%</strong>, return harian rata-rata ≈ 0. Hitung <strong>VaR 99% 1-hari</strong> (metode parametrik/varians-kovarians).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus:</strong> <Tex math={String.raw`VaR_{99\%} = z_{99\%} \times \sigma \times Nilai`} />, dengan <Tex math={String.raw`z_{99\%}=2{,}33`} /> (kuantil normal).</p>
        <p><strong>Langkah 2 — Hitung:</strong> 2,33 × 0,02 × 100.000.000.000 = <strong>Rp4,66 miliar</strong>.</p>
        <p><strong>Langkah 3 — Kalimat yang benar:</strong> &ldquo;Dengan keyakinan 99%, kerugian 1-hari <strong>tidak akan melebihi Rp4,66 miliar</strong> — <em>atau ekuivalennya</em> — kerugian <strong>melebihi Rp4,66 miliar diharapkan terjadi ~1% hari ≈ 2–3 hari per tahun</strong>.&rdquo;</p>
        <p><strong>Langkah 4 — Skala waktu:</strong> VaR 10-hari (aturan Basel) ≈ VaR 1-hari × √10 = 4,66 × 3,16 ≈ <strong>Rp14,7 miliar</strong> (aturan akar-waktu — valid jika return independen; saat krisis, asumsi ini jebol!).</p>
        <p><strong>Asumsi yang disembunyikan:</strong> return <strong>normal</strong> &amp; volatilitas <strong>konstan</strong>. Kedua asumsi ini <em>persis</em> yang runtuh di krisis (E7: fat tails!). VaR parametrik = speedometer yang dikalibrasi di jalan tol mulus — di jalan berlubang ia <em>underestimate</em>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: VaR Historis — Biarkan Data yang Bicara</h2>
      <p>Alternatif tanpa asumsi normal: kumpulkan <strong>250 hari</strong> return historis portofolio, urutkan dari terburuk. VaR 99% = kerugian pada <strong>persentil 1%</strong>.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Urutkan:</strong> 250 return harian, dari paling negatif. Posisi 1% = data <strong>ke-3 terburuk</strong> (1% × 250 = 2,5 → ambil ke-3).</p>
        <p><strong>Langkah 2 — Baca:</strong> misal 3 return terburuk: −5,2%, −4,8%, <strong>−4,1%</strong> &rarr; VaR 99% = <strong>4,1% × Rp100 M = Rp4,1 miliar</strong>.</p>
        <p><strong>Langkah 3 — Bandingkan:</strong> parametrik memberi 4,66 M; historis 4,1 M. Beda karena distribusi nyata <strong>tidak persis normal</strong> — ekornya bisa lebih gemuk atau lebih tipis dari lonceng.</p>
        <p><strong>Kelebihan:</strong> menangkap <em>fat tails</em> &amp; skew <em>jika</em> histori mengandungnya. <strong>Kelemahan fatal:</strong> <em>buta terhadap yang belum terjadi</em> — jika 250 hari terakhir tenang-tenang saja, VaR historis akan kecil persis sebelum badai (inilah yang terjadi 2006–2007!). Praktisi menggabungkan: historis + <strong>stress period</strong> (wajib menyertakan 2008/2020 dalam window) + <em>stressed VaR</em> ala Basel.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: London Whale 2012 — Ketika VaR &ldquo;Dipermak&rdquo;</h2>
      <p>2012: <strong>JPMorgan</strong> — bank paling dihormati pasca-2008 — mengumumkan kerugian <strong>US$6,2 miliar</strong> dari portofolio derivatif kredit di London (<em>Chief Investment Office</em>). Trader-nya dijuluki <strong>&ldquo;London Whale&rdquo;</strong> karena posisinya begitu besar hingga menggerakkan pasar.</p>
      <ul>
        <li><strong>Skandal metodenya:</strong> investigasi menemukan bank <strong>mengganti model VaR</strong> di tengah jalan — VaR yang dilaporkan turun dari US$129 juta ke US$67 juta <em>bukan</em> karena risiko turun, tapi karena <strong>rumusnya diubah</strong>. Speedometernya &ldquo;dipermak&rdquo; agar terlihat pelan.</li>
        <li><strong>Akar masalahnya:</strong> portofolio CDS yang kompleks &amp; tidak likuid — VaR harian tidak menangkap <em>risiko likuiditas</em> (tidak bisa keluar tanpa menggerakkan harga, persis E1 Worked 3!) dan <em>basis risk</em> antar indeks.</li>
        <li><strong>Dampak regulasi:</strong> kasus ini memperkuat aturan <strong>Volcker Rule</strong> (batas proprietary trading bank) &amp; menaikkan standar <em>model risk management</em> — model VaR kini wajib divalidasi independen, di-backtest, dan tidak boleh diganti diam-diam.</li>
      </ul>
      <p><strong>Pelajaran untuk analis risiko:</strong> (1) <strong>angka risiko = produk dari model + asumsi + integritas</strong> — ketiganya bisa busuk; (2) <strong>backtesting itu wajib</strong>: bandingkan VaR dengan kerugian aktual — jika pelanggaran (&ldquo;rugi &gt; VaR&rdquo;) jauh lebih sering dari 1%, modelmu salah atau pasar berubah; (3) <strong>risiko yang tidak tertangkap VaR</strong> (likuiditas, model, operasional) justru yang membunuh — VaR = satu instrumen di dashboard, bukan dashboardnya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> aturan backtest Basel memakai <strong>lampu lalu lintas</strong>: dalam 250 hari, 0–4 pelanggaran = zona hijau (model OK); 5–9 = kuning (denda modal); 10+ = merah (model ditolak). Sederhana tapi kuat: <em>model yang baik harus salah dengan frekuensi yang diprediksinya sendiri</em>. Jika VaR 99%-mu &ldquo;jebol&rdquo; 12 kali setahun — itu bukan nasib buruk, itu model buruk.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;VaR = kerugian maksimum yang mungkin terjadi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> VaR <strong>diam</strong> tentang seberapa besar kerugian <em>di luar</em> ambangnya — rugi Rp7 miliar dan Rp70 miliar sama-sama &ldquo;melebihi VaR Rp6 miliar&rdquo;. VaR = <em>ambang</em>, bukan <em>langit-langit</em>. Untuk pertanyaan &ldquo;seberapa buruk jika buruk?&rdquo; butuh <strong>Expected Shortfall</strong> (lihat Pendalaman) &amp; <em>stress test</em>. Jangan pernah menjawab &ldquo;risiko maksimum kita Rp6 miliar&rdquo; dengan VaR — itu kesalahan yang menenggelamkan karir.</p>
      </div>

      <h2 id="estail">🔧 Pendalaman: Expected Shortfall — Rata-rata di Neraka</h2>
      <p>Kelemahan VaR yang paling dikritik: ia tidak peduli <em>seberapa dalam</em> jurang di luar ambang. <strong>Expected Shortfall (ES)</strong> memperbaikinya: <em>&ldquo;jika kerugian sudah melebihi VaR, berapa <strong>rata-rata</strong> kerugiannya?&rdquo;</em></p>
      <ul>
        <li><strong>Contoh:</strong> VaR 99% = Rp4,66 M (Worked 1). ES 97,5% = rata-rata dari 2,5% hari terburuk — misal <strong>Rp6,8 M</strong>. Angka kedua ini menjawab pertanyaan direksi yang sebenarnya: &ldquo;di hari sial, <em>rata-rata</em> kita rugi berapa?&rdquo;</li>
        <li><strong>Kenapa regulator pindah:</strong> Basel III (<em>Fundamental Review of the Trading Book</em>) <strong>mengganti VaR 99% dengan ES 97,5%</strong> untuk modal risiko pasar — justru karena 2008 menunjukkan VaR buta terhadap kedalaman ekor. ES juga <em>sub-additive</em> (diversifikasi selalu mengurangi ES — sifat matematis elegan yang VaR langgar!).</li>
        <li><strong>Tetap tidak cukup:</strong> ES pun dihitung dari <em>data masa lalu</em>. Pelengkap wajibnya: <strong>stress test &amp; scenario analysis</strong> — &ldquo;bagaimana jika rupiah jatuh 30% + BI rate naik 300 bps + likuiditas kering?&rdquo; (skenario 1998/2013/2020). Angka VaR/ES = cuaca kemarin; stress test = simulasi badai.</li>
      </ul>
      <p><strong>Ringkasan karir:</strong> analis market risk junior menghitung VaR; yang senior <strong>menantang</strong> VaR — dengan backtest, ES, stress test, dan pertanyaan &ldquo;asumsi apa yang membunuh kita jika salah?&rdquo; (E7: model risk!). Speedometer penting — tapi pembalap juara juga membaca <em>cuaca, ban, dan bensin</em>.</p>


      <h2 id="stresstest">🔧 Pendalaman: Stress Test — Melampaui &ldquo;Cuaca Kemarin&rdquo;</h2>
      <p>VaR/ES menjawab &ldquo;seberapa buruk hari <em>biasa yang buruk</em>&rdquo;. <strong>Stress test</strong> menjawab &ldquo;seberapa buruk jika <strong>sejarah terburuk terulang</strong>&rdquo;. Regulator (OJK, BI, Basel) <em>mewajibkan</em> bank menjalankan keduanya:</p>
      <ul>
        <li><strong>Stress historis:</strong> terapkan kembali guncangan 1998 / 2008 / 2020 ke portofolio <em>hari ini</em>. &ldquo;Jika rupiah jatuh 80% + bunga naik 500 bps + IHSG −50% seperti 1998 — berapa modal kita yang hilang?&rdquo;</li>
        <li><strong>Stress hipotetis:</strong> skenario yang <em>belum pernah</em> terjadi: &ldquo;harga minyak US$200 + rupiah 20.000 + BI rate 12% bersamaan&rdquo;. Dirancang dari <em>kelemahan portofolio</em> (reverse stress test: &ldquo;skenario apa yang membuat kita bangkrut? lalu seberapa mungkin itu?&rdquo;).</li>
        <li><strong>Kenapa wajib:</strong> VaR 99% <em>by design</em> buta terhadap 1% terburuk — padahal <strong>1% itulah yang membunuh bank</strong> (2008!). Stress test = melihat langsung ke jurang yang VaR abaikan.</li>
      </ul>
      <p><strong>Aturan main yang benar:</strong> (1) skenario harus <strong>parah tapi masuk akal</strong> (<em>severe but plausible</em>) — bukan kiamat; (2) <strong>konsisten lintas risiko</strong> — skenario &ldquo;resesi&rdquo; harus memukul kredit (default naik — E5!), pasar (harga jatuh), <em>dan</em> likuiditas (sulit jual!) <strong>bersamaan</strong> — karena di krisis semuanya terjadi bersamaan (E8: korelasi → 1!); (3) hasilnya <strong>ditindaklanjuti</strong> — tambah modal, kurangi limit, siapkan <em>contingency funding</em>. Stress test yang hasilnya hanya jadi laporan = teater.</p>
      <h2 id="worked4">🔬 Worked Example: Bank &ldquo;Aman&rdquo; vs Skenario 1998</h2>
      <p>Bank Aman: modal inti (CET1) <strong>Rp20 T</strong>, aset tertimbang menurut risiko (ATMR) <strong>Rp200 T</strong> &rarr; rasio CET1 = <strong>10%</strong> (di atas minimum ~8,5%). Terapkan stress 1998-lite: kredit macet (NPL) naik → kerugian kredit <strong>Rp12 T</strong>; portofolio obligasi rugi mark-to-market <strong>Rp4 T</strong>.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Total kerugian stress:</strong> 12 + 4 = <strong>Rp16 T</strong>.</p>
        <p><strong>Langkah 2 — Modal tersisa:</strong> 20 − 16 = <strong>Rp4 T</strong> &rarr; rasio CET1 baru = 4/200 = <strong>2%</strong> — <em>jauh</em> di bawah minimum!</p>
        <p><strong>Langkah 3 — Tindak lanjut:</strong> bank harus <strong>menambah modal Rp13 T</strong> (untuk kembali ke 8,5%: 0,085×200 − 4) <em>sebelum</em> krisis — via laba ditahan, penerbitan saham, atau pengurangan aset berisiko. Inilah <strong>guna</strong> stress test: memaksa bank <em>siap</em> saat langit masih cerah.</p>
        <p><strong>Intuisi:</strong> rasio modal 10% terlihat &ldquo;aman&rdquo; — tapi <strong>aman terhadap apa?</strong> Tanpa skenario, angka modal = angka kosong. Stress test mengubah &ldquo;Rp20 T&rdquo; menjadi kalimat: <em>&ldquo;cukup untuk badai 1998-lite, tidak cukup untuk 1998 penuh.&rdquo;</em> <strong>Risiko selalu relatif terhadap skenario.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bank dengan modal besar pasti aman dari krisis.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> modal besar = <strong>peredam lebih tebal</strong>, bukan jaminan. 2008: bank-bank dengan modal &ldquo;cukup&rdquo; tumbang karena <strong>likuiditas</strong> (tidak bisa menjual aset / tidak ada yang mau meminjamkan — E14!) — bukan karena modal habis duluan. <strong>Modal menyerap kerugian; likuiditas menjaga napas.</strong> Bank butuh keduanya — dan stress test modern menguji keduanya (<em>solvency</em> + <em>liquidity stress</em>).</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Mengukur Badai (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'VaR 99% 1-hari = Rp6 M' artinya…"
        options={[
          "Rugi maksimal Rp6 M",
          "Ada 99% peluang rugi ≤ Rp6 M; 1% peluang rugi LEBIH dari Rp6 M (tanpa batas)",
          "Pasti rugi Rp6 M besok",
          "Untung Rp6 M",
        ]}
        correct={1}
        explanation="Benar: VaR = ambang probabilitas, bukan langit-langit. 1% hari terburuk bisa jauh lebih dalam — itulah yang diukur ES."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Keunggulan ES dibanding VaR?"
        options={[
          "Lebih mudah dihitung",
          "Menjawab kedalaman ekor (rata-rata rugi saat VaR jebol) + koheren (subadditive)",
          "Selalu lebih kecil dari VaR",
          "Tidak butuh data",
        ]}
        correct={1}
        explanation="Benar: ES = E[Loss | Loss > VaR] ≥ VaR, dan subadditive (VaR bisa melanggar). Standar modal Basel/FRTB kini memakai ES."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Backtest 250 hari (VaR 99%): 12 pelanggaran. Zona?"
        options={[
          "Hijau",
          "Kuning",
          "Merah — model ditolak, kalibrasi ulang",
          "Tidak bisa dinilai",
        ]}
        correct={2}
        explanation="Benar: merah (10+). Model meremehkan risiko secara sistematis — denda modal + wajib kalibrasi ulang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Pelanggaran VaR terjadi 3 hari BERTURUT-TURUT. Masalahnya?"
        options={[
          "Tidak masalah — frekuensi masih wajar",
          "Clustering: model telat menangkap rezim volatilitas baru — uji independensi juga penting",
          "VaR salah hitung",
          "Trader curang",
        ]}
        correct={1}
        explanation="Benar: backtest yang baik menguji frekuensi DAN independensi. Pelanggaran berklaster = model tidak adaptif (solusi: filtered historical simulation)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan stress test WAJIB dipakai (bukan VaR)?"
        options={[
          "Monitor harian",
          "Menjawab 'bagaimana jika krisis?' untuk direksi/regulator — VaR buta di luar data historis",
          "Tidak pernah",
          "Hanya untuk kredit",
        ]}
        correct={1}
        explanation="Benar: stress test = simulasi kiamat (historis/hipotetis/reverse). VaR untuk operasional harian; kiamat butuh skenario."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Aturan akar-waktu (VaR₁₀ ≈ VaR₁ × √10) valid jika…"
        options={[
          "Selalu valid",
          "Return i.i.d. (independen & identik) — waspadai autokorelasi & volatilitas berklaster",
          "Hanya untuk saham",
          "Hanya untuk 10 hari",
        ]}
        correct={1}
        explanation="Benar: asumsi i.i.d. Return nyata berklaster (volatilitas mengelompok) — scaling buta bisa meremehkan/melebihkan risiko multi-hari."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>VaR<sub>α</sub></strong>: P(Loss &gt; VaR) = α — ambang probabilitas, BUKAN rugi maksimal.</li>
          <li><strong>Tiga metode</strong>: historical (data bicara), parametrik (asumsi normal — waspadai ekor!), Monte Carlo (fleksibel, GIGO).</li>
          <li><strong>ES = E[Loss | Loss &gt; VaR]</strong> — kedalaman ekor + koheren; standar modal FRTB.</li>
          <li><strong>Backtest</strong> = poligraf model; traffic light hijau/kuning/merah; uji independensi juga.</li>
          <li><strong>Stress test</strong> (historis/hipotetis/reverse) — untuk kiamat yang tak tertangkap statistik.</li>
          <li>Profesional hidup 3 horizon: <em>kemarin</em> (backtest), <em>besok</em> (VaR/ES), <em>kiamat</em> (stress).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e12-fx-suku-bunga" className="btn btn-secondary btn-sm">← E12</Link>
        <Link href="/learn/e14-money-market" className="btn btn-primary btn-sm">Next: E14 →</Link>
      </div>
    </div>
  );
}
