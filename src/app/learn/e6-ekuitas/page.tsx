"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E6Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const orderBookData = [
    {
      y: ["Ask 1510 (200)", "Ask 1505 (500)", "Ask 1500 (800)", "Bid 1495 (600)", "Bid 1490 (900)", "Bid 1485 (400)"],
      x: [200, 500, 800, 600, 900, 400],
      type: "bar",
      orientation: "h",
      marker: { color: ["#ef4444", "#ef4444", "#ef4444", "#2a7de1", "#2a7de1", "#2a7de1"] },
      text: ["200 lbr", "500 lbr", "800 lbr", "600 lbr", "900 lbr", "400 lbr"],
      textposition: "outside",
    },
  ];

  const peGrowthData = [
    {
      x: [5, 8, 10, 12, 15, 18, 22, 28, 35],
      y: [8, 12, 14, 18, 22, 28, 35, 45, 60],
      mode: "markers+text",
      text: ["Bank A", "Tambang B", "Ritel C", "Infra D", "Konsumer E", "Bank digital F", "Tekno G", "Startup H", "Spekulatif I"],
      textposition: "top center",
      marker: { size: 12, color: "#2a7de1" },
    },
  ];

  const liquidityData = [
    {
      x: ["Blue chip LQ45", "Mid cap", "Small cap", "Saham gorengan"],
      y: [0.1, 0.4, 1.5, 4.0],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#e8a838", "#ef4444"] },
      text: ["0,1%", "0,4%", "1,5%", "4,0%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Gordon Growth Model: berapa harga wajarnya?
# Dividen tahun depan Rp500/lembar, tumbuh 5%/thn selamanya, required return 12%
D1 = 500
g = 0.05
r = 0.12

P0 = D1 / (r - g)
print(f"Harga wajar = Rp{P0:,.0f}")
print()
# Sensitivitas: apa kata pasar jika harga pasar Rp10.000?
harga_pasar = 10_000
# Balik: g tersirat = r - D1/P
g_tersirat = r - D1 / harga_pasar
print(f"Harga pasar Rp{harga_pasar:,} -> pasar mengasumsikan g = {g_tersirat*100:.1f}%")
print()
print("Coba: g = 0.10 (tumbuh 10%). Perhatikan betapa liar harganya berubah.")
print("Pelajaran: valuasi SANGAT sensitif pada asumsi g. Jangan terpaku satu angka.")`;

  const lab2Code = `# Lab 2 — Market impact: order besarmu menggerakkan harga
# Order book: (harga, lembar tersedia)
asks = [(1500, 800), (1505, 500), (1510, 200)]  # antrian jual
order_beli = 1000  # kamu beli 1.000 lembar sekaligus

sisa = order_beli
total_bayar = 0
for harga, tersedia in asks:
    ambil = min(sisa, tersedia)
    total_bayar += ambil * harga
    sisa -= ambil
    print(f"Ambil {ambil} lbr @ Rp{harga}  (sisa order: {sisa})")
    if sisa == 0: break

rata2 = total_bayar / order_beli
print(f"\\nHarga rata-rata eksekusi: Rp{rata2:,.0f}")
print(f"Slippage vs ask terbaik : Rp{rata2 - 1500:,.0f}/lembar ({(rata2-1500)/1500*100:.2f}%)")
print("\\nCoba: order_beli = 100 (kecil). Slippage hilang — itulah gunanya likuiditas.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E6 — Financial Markets</span>
        <h1 className="display-title">Saham: Sepotong Kepemilikan,<br />Seabrek Dinamika</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kenapa Harga Bergerak Tiap Detik?</a></li>
          <li><a href="#orderbook">Order Book — Dapur Harga Saham</a></li>
          <li><a href="#bidask">Bid-Ask Spread — Pajak Tak Terlihat</a></li>
          <li><a href="#likuiditas">Likuiditas — Bisa Keluar Kapan Saja?</a></li>
          <li><a href="#valuasi">Valuasi Dasar — Berapa Harga Wajarnya?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Gordon Growth Model</a></li>
          <li><a href="#lab2">🔬 Lab 2: Market Impact Order Besar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Saham Seperti Apa untuk Tujuanmu</a></li>
          <li><a href="#case">📋 Mini-Case: Saham &ldquo;Murah&rdquo; P/E 5×</a></li>
          <li><a href="#worked1">🔬 Worked Example: Market Cap &amp; Free Float</a></li>
          <li><a href="#worked2">🔬 Worked Example: Stock Split — Ilusi &ldquo;Murah&rdquo;</a></li>
          <li><a href="#worked3">🔬 Worked Example: P/E — Harga per Rupiah Laba</a></li>
          <li><a href="#konteks">🌍 Konteks: Microstructure IDX — Aturan Lelang</a></li>
          <li><a href="#ddm">🔧 Pendalaman: Dari Mana &ldquo;Nilai&rdquo; Saham? (Intuisi DDM)</a></li>
          <li><a href="#corpact">🔧 Pendalaman: Corporate Actions — Buyback, Dividen, Rights Issue</a></li>
          <li><a href="#worked4">🔬 Worked Example: Buyback Rp1 Triliun — Siapa Untung?</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan bagaimana harga terbentuk di order book (bid, ask, matching).</li>
          <li>Menghitung biaya bid-ask spread dan market impact dari order besar.</li>
          <li>Menghitung valuasi dasar dengan P/E dan Gordon Growth Model, termasuk sensitivitasnya.</li>
          <li>Menilai likuiditas saham dan mengaitkannya dengan risiko &amp; biaya transaksi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kenapa Harga Bergerak Tiap Detik?</h2>
      <div className="story">
        <p>Jam 09:01 saham &ldquo;MAJU&rdquo; di Rp1.500. Jam 09:02 jadi Rp1.487. Jam 09:05 melompat ke Rp1.520. <em>Tidak ada berita apa-apa.</em> Perusahaan yang sama, pabrik yang sama, karyawan yang sama — kok harganya lari-larian tiap detik?</p>
        <p>Karena <strong>harga saham bukan &ldquo;nilai perusahaan&rdquo;</strong> — ia adalah <strong>hasil tawar-menawar terakhir</strong> antara pembeli dan penjual di <em>order book</em>. Memahami dapur ini menjelaskan 80% perilaku harga jangka pendek — dan melindungimu dari jebakan &ldquo;saham murah&rdquo; yang sebenarnya mahal.</p>
        <p><strong>Twist-nya:</strong> pabriknya tidak berubah, karyawannya tidak berubah, labanya tidak berubah — tapi &ldquo;harganya&rdquo; berubah 4 kali dalam 5 menit. Itu karena yang kamu lihat <strong>bukan nilai perusahaan</strong>, melainkan <strong>jejak tawar-menawar terakhir</strong> di sebuah lelang raksasa yang tidak pernah tidur. Dan lelang punya psikologinya sendiri: ketakutan, keserakahan, algoritma, dan antrean. Lesson ini membedah dapur lelang itu — supaya kamu bisa membedakan <em>harga yang bergerak</em> dari <em>nilai yang berubah</em>.</p>
      </div>

      <h2 id="orderbook">Order Book — Dapur Harga Saham</h2>
      <p><strong>Definisi.</strong> <em>Order book</em> = daftar antrian <strong>bid</strong> (harga yang berani dibayar pembeli) dan <strong>ask/offer</strong> (harga yang diminta penjual) beserta jumlah lembarnya. Transaksi terjadi saat bid ≥ ask — sistem <em>matching</em> mempertemukan keduanya. <strong>Harga &ldquo;terakhir&rdquo;</strong> yang kamu lihat = harga transaksi terakhir yang match.</p>
      <p><strong>Kepribadian order book:</strong> dia <em>pasar ikan pagi hari</em> — teriakan &ldquo;saya beli segini!&rdquo; dan &ldquo;saya jual segitu!&rdquo; yang dicatat rapi. Harga bergerak bukan karena ikannya berubah, tapi karena <strong>tawar-menawarnya</strong> berubah.</p>
      <p><strong>Kapan penting:</strong> memahami kenapa harga lompat saat berita; kenapa order besarmu &ldquo;menggerakkan pasar&rdquo; (Lab 2).</p>

      <PlotlyChart
        data={orderBookData}
        title="Order Book Saham MAJU (ilustratif)"
        layout={{ xaxis: { title: "Lembar tersedia" }, yaxis: { title: "" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang merah (atas) = antrian JUAL (ask): harga &amp; lembar yang ditawarkan. Batang biru (bawah) = antrian BELI (bid). Perhatikan harga ask terendah (1500) vs bid tertinggi (1495).</p>
        <p><strong>Interpretasi:</strong> belum ada transaksi karena bid tertinggi (1495) &lt; ask terendah (1500) — selisih Rp5 inilah <strong>bid-ask spread</strong>. Kalau kamu pasang market order beli 1.000 lembar, kamu &ldquo;memakan&rdquo; ask 1500 (800 lbr) lalu 1505 (200 lbr) — harga rata-ratamu <strong>lebih mahal</strong> dari 1500. Itulah <em>market impact</em> (Lab 2).</p>
      </div>

      <h2 id="bidask">Bid-Ask Spread — Pajak Tak Terlihat</h2>
      <p><strong>Definisi.</strong> <em>Bid-ask spread</em> = ask terendah − bid tertinggi. Setiap <em>round-trip</em> (beli lalu jual) kamu membayar ≈ spread ini — <strong>pajak tak terlihat</strong> atas tiap transaksi:</p>
      <Tex math={String.raw`\text{Biaya round-trip} \approx (\text{ask} - \text{bid}) \times \text{lembar}`} block />
      <p><strong>Kepribadian spread:</strong> dia <em>upeti untuk likuiditas</em> — dibayar ke market maker yang bersedia jadi lawan transaksimu kapan saja. Saham blue chip LQ45: spread tipis (0,1–0,2%). Saham gorengan: spread bisa 2–5% — <strong>kamu rugi 5% bahkan sebelum harga bergerak</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Biaya trading cuma fee broker 0,15%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> fee broker hanya <em>satu</em> komponen. Total biaya = fee broker + <strong>spread</strong> + <strong>market impact</strong> (untuk order besar) + pajak. Di saham tidak likuid, spread + impact bisa <strong>10× lipat</strong> fee broker. Trader harian yang &ldquo;untung 0,3% per trade&rdquo; di saham berspread 0,5% sebenarnya <strong>buntung</strong>.</p>
      </div>

      <h2 id="likuiditas">Likuiditas — Bisa Keluar Kapan Saja?</h2>
      <p><strong>Definisi.</strong> <em>Likuiditas</em> = seberapa mudah menjual <strong>cepat</strong> tanpa menggerakkan harga <strong>banyak</strong>. Proksi praktis: nilai transaksi harian, spread bid-ask, dan kapitalisasi pasar (IDX: <em>big/mid/small cap</em>).</p>
      <p><strong>Kepribadian likuiditas:</strong> dia <em>pintu darurat</em> — tidak kamu hargai saat santai, <strong>sangat</strong> kamu butuhkan saat panik. Saham tidak likuid baik-baik saja saat pasar tenang; saat semua mau jual bersamaan, pintunya menyempit dan harga terjun bebas.</p>

      <PlotlyChart
        data={liquidityData}
        title="Biaya Tersembunyi: Spread Tipikal per Kategori Saham"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Spread tipikal (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = spread tipikal tiap kategori saham IDX (ilustratif).</p>
        <p><strong>Interpretasi:</strong> &ldquo;saham gorengan&rdquo; mengenakan pajak 4% per round-trip — <strong>40× lipat</strong> blue chip! Ditambah market impact (Lab 2), &ldquo;cuan 10%&rdquo; di saham gorengan sering habis untuk biaya. <strong>Aturan:</strong> makin kecil &amp; jarang ditransaksikan → makin mahal keluar-masuknya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum beli saham apapun, cek <strong>nilai transaksi hariannya</strong>. Kalau rata-rata Rp500 juta/hari dan kamu mau masuk Rp100 juta — posisimu 20% dari transaksi harian: <strong>kamu</strong> adalah pasarnya, dan keluar akan menyakitkan. Aturan praktis: posisimu &lt; 1% dari rata-rata transaksi harian.</p>
      </div>

      <h2 id="valuasi">Valuasi Dasar — Berapa Harga Wajarnya?</h2>
      <p>Dua pendekatan paling populer (detail DCF/multiples di Track 7 CFA; di sini fondasinya):</p>
      <h3>1. P/E Ratio — &ldquo;berapa tahun laba untuk balik modal?&rdquo;</h3>
      <Tex math={String.raw`P/E = \frac{\text{Harga per lembar}}{\text{Laba per lembar (EPS)}}`} block />
      <p><strong>Artinya:</strong> P/E 10× = kamu membayar 10 tahun laba tahunan untuk memiliki saham ini (jika laba stagnan). <strong>Bukan</strong> &ldquo;makin kecil makin murah&rdquo; secara otomatis — P/E rendah bisa berarti pasar meramalkan laba akan <em>anjlok</em>.</p>
      <h3>2. Gordon Growth Model — dividen selamanya</h3>
      <p>Jika dividen tumbuh konstan <Tex math={String.raw`g`} /> selamanya:</p>
      <Tex math={String.raw`P_0 = \frac{D_1}{r - g}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`P_0`} /> = harga wajar hari ini; <Tex math={String.raw`D_1`} /> = dividen tahun depan; <Tex math={String.raw`r`} /> = <em>required return</em> (imbal hasil yang kamu tuntut); <Tex math={String.raw`g`} /> = pertumbuhan dividen abadi. Syarat: <Tex math={String.raw`r > g`} />.</p>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Dividen tahun depan Rp500, tumbuh 5%/tahun, required return 12%:</p>
        <p><strong>Langkah 1</strong> — P₀ = 500 / (0,12 − 0,05) = 500 / 0,07 = <strong>Rp7.143</strong>.<br />
        <strong>Langkah 2</strong> — uji sensitivitas: jika g = 6% → P₀ = 500/0,06 = Rp8.333 (+17%!). Jika r = 14% → P₀ = 500/0,09 = Rp5.556 (−22%).</p>
        <p><strong>Kesimpulan:</strong> perubahan asumsi 1–2% mengayunkan valuasi 20%+. Valuasi = <em>rentang</em>, bukan titik. Yang jago valuasi bukan yang angkanya presisi, tapi yang <strong>asumsinya jujur</strong>.</p>
      </details>
      <p><strong>Kepribadian valuasi:</strong> dia <em>teropong berkabut</em> — memberi arah, bukan koordinat GPS. Gunanya bukan meramal harga besok, tapi menjawab: &ldquo;apakah ekspektasi yang tertanam di harga ini <em>masuk akal</em>?&rdquo;</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;P/E 5× pasti murah, P/E 30× pasti mahal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> P/E = harga dibagi <em>laba masa lalu/saat ini</em> — pasar membayar untuk <em>masa depan</em>. P/E 5× pada perusahaan yang labanya akan anjlok 80% = <strong>mahal</strong>. P/E 30× pada perusahaan yang labanya tumbuh 40%/tahun = bisa jadi <strong>murah</strong>. Selalu tanya: <em>P/E ini mengasumsikan pertumbuhan berapa?</em> (Lab 1 membalik logikanya: dari harga pasar, hitung g yang tersirat.)</p>
      </div>

      <PlotlyChart
        data={peGrowthData}
        title="P/E vs Pertumbuhan Laba: Pasar Membayar untuk Masa Depan"
        layout={{ xaxis: { title: "Pertumbuhan laba ekspektasi (%/thn)" }, yaxis: { title: "P/E (×)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = satu perusahaan (ilustratif). Sumbu X = pertumbuhan laba yang diekspektasikan, sumbu Y = P/E.</p>
        <p><strong>Interpretasi:</strong> titik-titik menanjak ke kanan atas — <strong>pasar membayar P/E tinggi untuk pertumbuhan tinggi</strong>. &ldquo;Murah/mahal&rdquo; hanya bermakna <em>relatif terhadap titik-titik lain</em>: titik jauh <strong>di atas</strong> pola (P/E tinggi, growth rendah) = mahal; jauh <strong>di bawah</strong> = murah (atau pasar tahu sesuatu yang buruk — <em>value trap</em>, wajib investigasi).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Gordon Growth Model</h2>
      <p>Hitung harga wajar dari dividen, lalu balik: dari harga pasar, tebak pertumbuhan yang diasumsikan pasar.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Gordon Growth + g Tersirat"
        hint="Coba: harga_pasar = 7_143 (sama dengan harga wajar). Berapa g tersiratnya? Lalu naikkan harga_pasar ke 12_000 — seberapa optimis pasar?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Market Impact Order Besar</h2>
      <p>Rasakan jadi &ldquo;paus&rdquo;: beli 1.000 lembar sekaligus dan lihat harga rata-ratamu vs harga yang terlihat di layar.</p>
      <PyodideLab
        title="Lab 2 — Simulator Market Impact"
        hint="Coba: order_beli = 1500 (lebih besar dari total ask!). Apa yang terjadi? Inilah kenapa institusi memecah order besar jadi kecil-kecil (algoritma TWAP/VWAP)."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> harga di layar = <strong>harga untuk 1 lot kecil</strong>. Harga untuk <em>posisimu</em> bisa beda jauh — itulah <em>slippage</em>. Investor ritel dengan order kecil hampir tidak merasakan ini; fund manager yang mengelola miliaran <strong>hidup-mati</strong> soal eksekusi (inilah pekerjaan <em>trader</em> institusi).</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Saham Seperti Apa untuk Tujuanmu</h2>

      <div className="decision-card">
        <h3>1. Dana pensiun 20 tahun, tidak mau pusing → <strong>Blue chip likuid / ETF indeks</strong></h3>
        <p><strong>Kondisi:</strong> horizon panjang, minim waktu riset.</p>
        <p><strong>Kenapa:</strong> likuid (spread tipis, gampang keluar), fundamental mapan, diversifikasi via ETF.</p>
        <p><strong>Contoh nyata:</strong> saham LQ45 / ETF IDX30 rutin bulanan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Suka riset, cari mispricing → <strong>Mid/small cap + valuasi ketat</strong></h3>
        <p><strong>Kondisi:</strong> punya waktu baca laporan keuangan, tahan volatilitas.</p>
        <p><strong>Kenapa:</strong> kurang dilirik analis → peluang mispricing lebih besar; tapi wajib hitung likuiditas &amp; posisi maksimal.</p>
        <p><strong>Contoh nyata:</strong> stock picking dengan margin of safety (harga &lt;&lt; valuasi konservatif).</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh dividen rutin → <strong>Saham dividen (dividend yield + payout ratio)</strong></h3>
        <p><strong>Kondisi:</strong> arus kas periodik, profil konservatif.</p>
        <p><strong>Kenapa:</strong> cek <em>dividend yield</em> DAN <em>payout ratio</em> — yield 10% dengan payout 95% = dividen terancam dipotong.</p>
        <p><strong>Contoh nyata:</strong> BUMN tambang/bank dengan rekam dividen stabil.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tergoda saham &ldquo;terbang&rdquo; tanpa fundamental → <strong>Jangan (atau batasi &lt;5% &ldquo;uang jajan&rdquo;)</strong></h3>
        <p><strong>Kondisi:</strong> FOMO melihat saham naik 200% tanpa laba.</p>
        <p><strong>Kenapa:</strong> spread lebar + likuiditas semu + tanpa jangkar valuasi = kasino. Kalau tetap mau, anggap <strong>hilang</strong> sejak awal.</p>
        <p><strong>Contoh nyata:</strong> saham gorengan / IPO pom-pom tanpa prospektus jelas.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Harga = hasil tawar-menawar terakhir</strong>, bukan vonis nilai perusahaan.</li>
          <li><strong>Hitung total biaya:</strong> fee + spread + market impact. Di saham sepi, spread = pembunuh.</li>
          <li><strong>P/E rendah ≠ murah.</strong> Tanya pertumbuhan tersiratnya dulu.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Saham &ldquo;Murah&rdquo; P/E 5×</h2>
      <div className="callout">
        <p>Saham &ldquo;JAYA&rdquo; diperdagangkan Rp1.000 dengan EPS Rp200 → P/E 5×. IHSG rata-rata P/E 15×. Temanmu: <em>&ldquo;Diskon 67%! Borong!&rdquo;</em> Kamu cek: laba JAYA turun 3 tahun berturut-turut (Rp400 → Rp300 → Rp200), utang naik 2×, dan nilai transaksi hariannya cuma Rp300 juta.</p>
        <p><strong>Pertanyaan:</strong> (a) Mengapa P/E 5× belum tentu murah? (b) Hitung risiko likuiditas jika temanmu mau masuk Rp50 juta. (c) Data tambahan apa yang kamu minta sebelum memutuskan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>P/E memakai laba masa lalu.</strong> Jika laba tahun depan tinggal Rp100 (tren turun + utang naik), P/E <em>forward</em> = 10× — tidak semurah kelihatannya. Pasar mendiskon karena meramalkan pemburukan. Ini kandidat <strong>value trap</strong>.</p>
          <p>(b) Rp50 jt / Rp300 jt = <strong>17% dari transaksi harian</strong> — jauh di atas batas aman 1%. Masuknya menggerakkan harga naik (beli mahal), keluarnya menekan harga jatuh (jual murah). <strong>Biaya likuiditas bisa menghapus &ldquo;diskon&rdquo; P/E.</strong></p>
          <p>(c) Laporan keuangan 3 tahun (arus kas operasi vs laba bersih — apakah labanya tunai?), struktur utang &amp; jadwal jatuh tempo, siapa pengendali &amp; rekam jejaknya, dan alasan fundamental kenapa laba turun (siklus vs struktural).</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Market Cap &amp; Free Float — Seberapa Besar Sebenarnya?</h2>
      <p>Saham &ldquo;MAJU&rdquo; Rp1.500/lembar, total saham beredar <strong>10 miliar lembar</strong>. Pendiri &amp; institusi mengunci 65% (tidak diperdagangkan). Hitung market cap dan free float.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Market cap:</strong> 10.000.000.000 &times; 1.500 = <strong>Rp15 triliun</strong>. Inilah &ldquo;harga beli seluruh perusahaan&rdquo; versi pasar.</p>
        <p><strong>Langkah 2 — Free float:</strong> (1 − 0,65) &times; 10 miliar = <strong>3,5 miliar lembar</strong> = Rp5,25 triliun yang <em>benar-benar</em> bisa diperdagangkan publik.</p>
        <p><strong>Langkah 3 — Kenapa penting:</strong> indeks seperti IDX Composite/LQ45 memakai <strong>free float</strong>, bukan total lembar — karena hanya saham yang beredar bebas yang mencerminkan harga pasar. Saham dengan free float kecil (&lt;20%) = <strong>mudah &ldquo;digoreng&rdquo;</strong>: sedikit uang bisa menggerakkan harga jauh (bandar mengunci barang, ritel berebut sisa). Cek free float <em>sebelum</em> kagum pada kenaikan 30% sehari.</p>
        <p><strong>Intuisi:</strong> market cap = harga × kuantitas (seperti E1: harga sekunder = tawar-menawar). Perusahaan &ldquo;besar&rdquo; bukan yang karyawannya banyak — melainkan yang pasarnya menilai mahal. Tesla pernah bernilai lebih dari seluruh produsen mobil Jepang digabung, dengan produksi sepersekian — <em>market cap mengukur ekspektasi, bukan ukuran pabrik</em>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Stock Split 1:5 — Kenapa &ldquo;Murah&rdquo;-nya Ilusi?</h2>
      <p>Saham MAJU Rp5.000/lembar (10 miliar lembar, market cap Rp50 T) melakukan <strong>stock split 1:5</strong>. Besoknya harga tercatat Rp1.000 — &ldquo;wah, murah 80%!&rdquo; Benarkah?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Lembar baru:</strong> 10 miliar &times; 5 = <strong>50 miliar lembar</strong>.</p>
        <p><strong>Langkah 2 — Harga teoretis:</strong> market cap tetap Rp50 T &divide; 50 miliar = <strong>Rp1.000</strong>. ✓ (Tidak ada nilai yang diciptakan — seperti menukar 1 lembar Rp100 ribu menjadi 5 lembar Rp20 ribu.)</p>
        <p><strong>Langkah 3 — Porsi kepemilikanmu:</strong> punya 2.000 lembar (Rp10 juta) &rarr; menjadi 10.000 lembar (tetap Rp10 juta). <strong>Nol perubahan ekonomi.</strong></p>
        <p><strong>Lalu kenapa perusahaan repot-repot split?</strong> Tiga alasan riil: (1) <strong>likuiditas</strong> — harga per lot turun (dari Rp500 ribu/lot ke Rp100 ribu/lot) sehingga ritel bisa ikut; (2) <strong>psikologi</strong> — angka &ldquo;murah&rdquo; menarik pembeli (bias nominal!); (3) <strong>sinyal</strong> — manajemen biasanya split setelah harga naik banyak (optimisme terselubung). Kebalikannya (<em>reverse split</em>) sering jadi sinyal distress — &ldquo;mempercantik&rdquo; harga saham sekarat agar tidak terlihat seperti saham Rp50.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: P/E — Membayar Berapa untuk Tiap Rupiah Laba?</h2>
      <p>MAJU: harga Rp1.500, laba bersih per saham (<em>EPS</em>) Rp150. Kompetitor &ldquo;MUNDUR&rdquo;: harga Rp800, EPS Rp40. Mana &ldquo;lebih murah&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — P/E MAJU:</strong> 1.500 &divide; 150 = <strong>10×</strong>. Kamu membayar Rp10 untuk tiap Rp1 laba tahunan.</p>
        <p><strong>Langkah 2 — P/E MUNDUR:</strong> 800 &divide; 40 = <strong>20×</strong>. Membayar Rp20 per Rp1 laba.</p>
        <p><strong>Langkah 3 — Putusan:</strong> MAJU &ldquo;lebih murah&rdquo; (10× &lt; 20×) <em>relatif terhadap labanya</em> — meski harga nominalnya hampir 2× lipat! Inilah kenapa harga nominal tanpa pembanding = angka kosong (ingat Worked 2).</p>
        <p><strong>Langkah 4 — Membaca lebih dalam:</strong> P/E juga = <strong>cermin ekspektasi pertumbuhan</strong>. P/E 20× berarti pasar rela membayar mahal — biasanya karena yakin labanya akan <em>tumbuh cepat</em> (atau karena labanya sedang anjlok sementara sehingga E kecil). P/E rendah bisa berarti &ldquo;murah&rdquo; — atau &ldquo;pasar yakin labanya akan menyusut&rdquo; (<em>value trap</em>). Angka tidak berbicara sendiri; ia butuh cerita (E18: laporan keuangan!).</p>
        <p><strong>Variasi cepat:</strong> <em>earnings yield</em> = 1/P&amp;E — MAJU: 10%, MUNDUR: 5%. Bandingkan dengan yield obligasi (E4): jika obligasi memberi 7%, MUNDUR (5%) terlihat mahal <em>kecuali</em> labanya tumbuh &gt;2%/tahun di atas obligasi. Inilah jembatan ekuitas–obligasi yang dipakai manajer aset global (<em>Fed model</em>).</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Microstructure IDX — Aturan Lelang yang Membentuk Harga</h2>
      <p>Harga yang &ldquo;lari tiap detik&rdquo; di cerita pembuka tidak muncul dari ruang hampa — ia dicetak oleh <strong>aturan main bursa</strong>:</p>
      <ul>
        <li><strong>Lelang kontinu + fraksi harga:</strong> seperti E1 — order dikumpulkan dalam book, dieksekusi berdasar prioritas harga lalu waktu. Fraksi (tick) IDX berjenjang: makin kecil fraksi, makin rapat spread bisa ditekan.</li>
        <li><strong>Auto Rejection (ARA/ARB):</strong> rem darurat harian. Saham yang &ldquo;ARB berjilid-jilid&rdquo; = likuiditas sisi beli <em>hilang total</em> — antrean jual mengular tanpa pembeli. Pelajaran: <strong>batas harga melindungi dari kepanikan, tapi tidak menjamin kamu bisa keluar.</strong></li>
        <li><strong>Suspensi &amp; UMA:</strong> BEI bisa menghentikan perdagangan saham (<em>suspensi</em>) atau menerbitkan peringatan <em>Unusual Market Activity</em> saat gerakannya tidak wajar. UMA ≠ vonis bersalah — tapi = &ldquo;pasar, hati-hati, ada yang aneh&rdquo;.</li>
        <li><strong>Pre-opening &amp; pre-closing:</strong> 15 menit lelang murni di awal/akhir sesi — harga pembukaan/penutupan = satu harga kliring lelang, tempat institusi besar mengeksekusi tanpa &ldquo;memakan&rdquo; book (E1 Worked 3!).</li>
      </ul>
      <p><strong>Implikasi praktis untuk ritel:</strong> (1) pakai <em>limit order</em>, bukan market order; (2) waspadai saham free-float kecil + ARB beruntun = perangkap likuiditas; (3) volume tanpa kedalaman book = kosmetik. Trader yang paham microstructure tidak &ldquo;menebak arah&rdquo; — ia <strong>membaca struktur lelangnya</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> 1 lot = 100 lembar adalah <em>satuan minimum</em>, bukan &ldquo;satuan wajar&rdquo;. Saham Rp50/lembar = Rp5.000/lot terlihat &ldquo;receh&rdquo; — tapi valuasinya bisa P/E 50× (mahal!) sementara saham Rp20.000/lembar = Rp2 juta/lot bisa P/E 8× (murah). <strong>Nominal harga ≠ valuasi.</strong> Selalu normalkan: bagi dengan laba (P/E), dengan nilai buku (P/B), atau dengan arus kas.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Saham Rp50 itu murah, saham Rp20.000 itu mahal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> harga nominal = market cap &divide; jumlah lembar — jumlah lembarnya <em>arbitrer</em> (bisa di-split kapan saja, Worked 2!). &ldquo;Murah/mahal&rdquo; hanya bermakna <strong>relatif terhadap sesuatu</strong>: laba (P/E), aset (P/B), atau prospek. Saham Rp50 dengan EPS Rp1 = P/E 50× (sangat mahal); saham Rp20.000 dengan EPS Rp2.500 = P/E 8× (murah). Jangan beli angka — beli <em>rasio</em>.</p>
      </div>

      <h2 id="ddm">🔧 Pendalaman: Dari Mana &ldquo;Nilai&rdquo; Saham? (Intuisi Dividend Discount Model)</h2>
      <p>Jika harga = jejak lelang terakhir, lalu apa itu <strong>nilai</strong>? Model tertua &amp; paling jujur: <strong>DDM</strong> — nilai saham = PV dari <em>seluruh dividen masa depan</em> (TVM-nya E3, diterapkan ke ekuitas!):</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`P_0 = \frac{D_1}{(1+r)} + \frac{D_2}{(1+r)^2} + \frac{D_3}{(1+r)^3} + \cdots`} block /></p>
      <p>dengan <Tex math={String.raw`D_t`} /> = dividen tahun ke-<Tex math={String.raw`t`} />, <Tex math={String.raw`r`} /> = return yang dituntut (<em>required return</em> — dari CAPM, E9!).</p>
      <ul>
        <li><strong>Kenapa dividen, bukan laba?</strong> Laba bisa &ldquo;dimasak&rdquo; (E18!); dividen = <strong>kas yang benar-benar sampai ke kantongmu</strong>. Perusahaan yang tidak pernah membayar dividen? Modelnya memakai versi umum: <em>free cash flow to equity</em> — kas yang <em>bisa</em> dibagikan.</li>
        <li><strong>Versi praktis (Gordon growth):</strong> jika dividen tumbuh konstan <Tex math={String.raw`g`} />: <Tex math={String.raw`P_0 = \frac{D_1}{r-g}`} />. Contoh: D1 = Rp100, r = 12%, g = 5% &rarr; P0 = 100/(0,07) ≈ <strong>Rp1.428</strong>. Perhatikan sensitivitasnya: jika <Tex math={String.raw`g`} /> direvisi 5% &rarr; 3%, nilai jatuh ke Rp1.111 (−22%!) — inilah kenapa saham growth <em>sangat</em> volatile terhadap ekspektasi.</li>
        <li><strong>Keterbatasan jujur:</strong> DDM butuh tebakan <Tex math={String.raw`r`} /> dan <Tex math={String.raw`g`} /> sampai tak berhingga — dua angka yang tidak bisa diobservasi. Makanya praktisi memakai <strong>multiples</strong> (P/E) sebagai jalan pintas — tapi jalan pintas yang sehat hanya jika kamu paham model &ldquo;aslinya&rdquo; ini.</li>
      </ul>
      <p><strong>Benang merah track:</strong> E3 (diskonto) + E4 (yield) + E6 (dividen) + E9 (required return) = <strong>satu mesin yang sama</strong>: nilai kini dari janji masa depan. Obligasi janjinya pasti (kupon), saham janjinya tidak pasti (dividen) — seluruh perbedaan valuasi kedua dunia berasal dari perbedaan <em>kepastian janji</em> ini.</p>


      <h2 id="corpact">🔧 Pendalaman: Corporate Actions — Tiga Cara Perusahaan &ldquo;Membayar&rdquo; Pemegang Saham</h2>
      <p>Perusahaan untung Rp1 triliun, tidak butuh ekspansi. Tiga pilihan mengembalikan ke pemegang saham:</p>
      <ul>
        <li><strong>Dividen tunai:</strong> Rp1 T dibagi ke semua pemegang saham. Kamu terima kas — <strong>kena PPh final 10%</strong> (E15!). Harga saham turun ~sebesar dividen per saham pada <em>ex-date</em> (uang keluar dari perusahaan!).</li>
        <li><strong>Buyback (pembelian kembali):</strong> perusahaan membeli sahamnya sendiri di pasar lalu <em>membakarnya</em> (treasury/delisting). Jumlah lembar berkurang &rarr; <strong>EPS naik</strong> meski laba sama &rarr; harga cenderung naik. <strong>Tidak kena pajak dividen</strong> — pajak hanya saat kamu jual (PPh final 0,1% atas transaksi!).</li>
        <li><strong>Rights issue (kebalikannya!):</strong> <em>meminta</em> uang dari pemegang saham (E1 Worked 1!) — untuk ekspansi atau bayar utang. Sinyal campuran: bagus jika untuk proyek NPV positif (E3!), buruk jika untuk menutup lubang.</li>
      </ul>
      <p><strong>Perdebatan klasik:</strong> dividen vs buyback — mana lebih baik? Teori (Modigliani-Miller): <strong>irrelevan</strong> di dunia tanpa pajak — Rp1 T keluar sebagai dividen vs Rp1 T menaikkan harga via buyback = sama bagi kekayaanmu. Praktik (dengan pajak Indonesia): <strong>buyback lebih efisien pajak</strong> (0,1% vs 10%!) — salah satu alasan buyback meledak global. Tapi dividen memberi <strong>kas pasti hari ini</strong> (pensiunan butuh makan!), sementara buyback = &ldquo;janji harga naik&rdquo; yang belum tentu terjadi.</p>
      <h2 id="worked4">🔬 Worked Example: Buyback Rp1 Triliun — Matematika &ldquo;Membakar&rdquo; Saham</h2>
      <p>MAJU: laba bersih Rp2 T, 10 miliar lembar beredar, harga Rp1.500 (market cap Rp15 T). Buyback <strong>Rp1 T</strong> @ Rp1.500, saham dibakar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Lembar dibeli &amp; dibakar:</strong> 1.000.000.000.000 ÷ 1.500 = <strong>666,7 juta lembar</strong>.</p>
        <p><strong>Langkah 2 — Lembar tersisa:</strong> 10.000 − 666,7 = <strong>9.333,3 juta</strong>.</p>
        <p><strong>Langkah 3 — EPS sebelum:</strong> 2 T ÷ 10 M = <strong>Rp200</strong>. EPS sesudah: 2 T ÷ 9.333,3 jt = <strong>Rp214,3</strong> (+7,1%!).</p>
        <p><strong>Langkah 4 — Harga &ldquo;wajar&rdquo; baru</strong> (P/E tetap 7,5×): 214,3 × 7,5 = <strong>Rp1.607</strong> (+7,1% — persis kenaikan EPS!).</p>
        <p><strong>Intuisi kritis:</strong> buyback <strong>hanya</strong> menciptakan nilai jika saham dibeli <strong>di bawah nilai wajarnya</strong>. Beli @ Rp1.500 saat nilai wajar Rp1.200 = <strong>menghancurkan nilai</strong> (membakar uang pemegang saham untuk memompa EPS kosmetik!). Inilah kenapa analis membedakan <em>buyback oportunistik</em> (saat murah — bagus) vs <em>buyback mekanis</em> (untuk menutupi dilusi opsi karyawan — netral/buruk). <strong>Jangan tepuk tangan untuk setiap buyback; tanya harganya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kalender corporate actions IDX yang wajib dipantau: <strong>cum-date</strong> (terakhir beli <em>dengan</em> hak dividen/rights), <strong>ex-date</strong> (harga menyesuaikan turun ~sebesar haknya — <em>bukan</em> &ldquo;anjlok&rdquo;!), <strong>recording date</strong>, <strong>payment date</strong>. &ldquo;Saham turun 5% saat ex-dividen&rdquo; = mekanis, bukan berita buruk. Yang <em>tidak</em> paham kalender ini akan panik menjual di ex-date — dan menyerahkan dividennya ke pembeli yang paham.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Dapur Harga Saham (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bid tertinggi 1495, ask terendah 1500. Kamu pasang market order BELI. Di harga berapa tereksekusi?"
        options={[
          "1495",
          "1497,5 (tengah-tengah)",
          "1500 (ask terendah) — atau lebih tinggi jika order besar",
          "Menunggu sampai ada yang jual di 1495",
        ]}
        correct={2}
        explanation="Benar: market order beli 'memakan' ask dari yang termurah. Order kecil → 1500; order besar → merembet ke ask berikutnya (market impact)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Saham X spread 4%. Kamu day-trading target untung 1% per trade. Apa masalahnya?"
        options={[
          "Tidak ada masalah",
          "Spread 4% > target 1% — kamu rugi bahkan jika 'prediksimu benar'",
          "Fee broker terlalu mahal",
          "Harus tambah modal",
        ]}
        correct={1}
        explanation="Benar: biaya round-trip ≈ spread. Target harus MELEBIHI total biaya (spread + fee + impact) — di saham berspread lebar, day trading hampir mustahil profit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Gordon: D1=Rp500, r=12%, g=5%. Harga wajar?"
        options={[
          "Rp4.167",
          "Rp7.143 (500 / 0,07)",
          "Rp10.000",
          "Rp500",
        ]}
        correct={1}
        explanation="Benar: 500/(0,12−0,05) = Rp7.143. Ingat sensitivitasnya: ubah g 1% → harga bergeser ~15%."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Saham P/E 5×, laba turun 3 tahun berturut-turut, utang naik 2×. Kesimpulan?"
        options={[
          "Murah — langsung borong",
          "Waspada value trap: P/E rendah mencerminkan ekspektasi laba makin turun",
          "P/E tidak relevan",
          "Pasti akan naik",
        ]}
        correct={1}
        explanation="Benar: value trap. P/E = harga/laba MASA LALU. Pasar mendiskon karena meramalkan masa depan yang buruk — verifikasi dengan laporan keuangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Rata-rata transaksi harian saham Rp300 jt. Batas posisi aman untukmu?"
        options={[
          "Rp150 jt — mumpung murah",
          "Maksimal ~Rp3 jt (1% dari transaksi harian)",
          "Rp300 jt — kuasai pasarnya",
          "Tidak ada batas",
        ]}
        correct={1}
        explanation="Benar: ~1% dari rata-rata transaksi harian. Posisi lebih besar = KAMU menjadi pasar: masuk mengerek harga, keluar menekan harga."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Harga saham = hasil match terakhir</strong> di order book (bid vs ask), bukan vonis nilai perusahaan.</li>
          <li><strong>Total biaya trading</strong> = fee + spread + market impact. Di saham sepi, spread = pembunuh senyap.</li>
          <li><strong>Likuiditas</strong> = pintu darurat; batasi posisi &lt; 1% transaksi harian.</li>
          <li><strong>P/E</strong> = harga/laba; murah/mahal hanya relatif terhadap <em>pertumbuhan ekspektasi</em>.</li>
          <li><strong>Gordon: P₀ = D₁/(r−g)</strong> — sangat sensitif pada asumsi; valuasi = rentang, bukan titik.</li>
          <li>Waspada <strong>value trap</strong>: P/E rendah + fundamental memburuk = jebakan, bukan diskon.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e5-credit-spread" className="btn btn-secondary btn-sm">← E5</Link>
        <Link href="/learn/e7-return-risiko" className="btn btn-primary btn-sm">Next: E7 →</Link>
      </div>
    </div>
  );
}
