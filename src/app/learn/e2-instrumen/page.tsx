"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E2Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const riskReturnData = [
    {
      x: [2, 4, 6, 9, 12, 18],
      y: [5.5, 6.5, 8, 10, 14, 25],
      mode: "markers+text",
      text: ["Deposito", "SBN ritel", "Obligasi korporasi", "Reksa dana campuran", "Saham blue chip", "Kripto"],
      textposition: "top center",
      marker: { size: 12, color: "#2a7de1" },
    },
  ];

  const waterfallData = [
    {
      x: ["Kreditur bank", "Pemegang obligasi", "Pemegang saham preferen", "Pemegang saham biasa"],
      y: [100, 85, 40, 0],
      type: "bar",
      marker: { color: ["#2a7de1", "#5b9bd5", "#e8a838", "#ef4444"] },
      text: ["Rp100 jt", "Rp85 jt", "Rp40 jt", "Rp0"],
      textposition: "outside",
    },
  ];

  const feeDragData = [
    {
      x: [0, 5, 10, 15, 20, 25, 30],
      y: [100, 161, 259, 417, 673, 1085, 1749],
      mode: "lines",
      name: "Fee 0,2%/thn (ETF)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0, 5, 10, 15, 20, 25, 30],
      y: [100, 149, 222, 331, 493, 734, 1093],
      mode: "lines",
      name: "Fee 2%/thn (aktif)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Siapa dibayar duluan saat perusahaan bangkrut?
# Aset tersisa Rp250 jt. Urutan pembayaran (senioritas):
aset = 250_000_000
klaim = [
    ("Kreditur bank (senior)", 100_000_000),
    ("Pemegang obligasi", 100_000_000),
    ("Saham preferen", 100_000_000),
    ("Saham biasa", 100_000_000),
]
sisa = aset
for nama, tagihan in klaim:
    dibayar = min(sisa, tagihan)
    sisa -= dibayar
    print(f"{nama:28s} terima Rp{dibayar/1e6:6.0f} jt  (rugi Rp{(tagihan-dibayar)/1e6:.0f} jt)")
print()
print("Coba: aset = 400_000_000. Siapa yang selamat?")
print("Pelajaran: saham = klaim PALING junior. Return tinggi = kompensasi risiko ini.")`;

  const lab2Code = `# Lab 2 — Fee kecil, efek raksasa (compounding)
# Return bruto 10%/thn, 30 tahun, modal Rp100 jt
modal = 100_000_000
r_bruto = 0.10
tahun = 30

for fee in [0.002, 0.01, 0.02]:
    r_neto = r_bruto - fee
    akhir = modal * (1 + r_neto) ** tahun
    hilang = modal * (1 + r_bruto) ** tahun - akhir
    print(f"Fee {fee*100:4.1f}% -> akhir Rp{akhir/1e9:5.1f} M  (fee menggerogoti Rp{hilang/1e9:4.1f} M)")
print()
print("Coba: tahun = 10. Apakah fee masih sedramatis itu?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E2 — Financial Markets</span>
        <h1 className="display-title">Enam Senjata Pasar:<br />Kenali Instrumen Sebelum Bertarung</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Saham&rdquo; yang Ternyata Bukan Saham</a></li>
          <li><a href="#saham">Saham — Sepotong Kepemilikan</a></li>
          <li><a href="#obligasi">Obligasi — Surat Utang yang Bisa Diperdagangkan</a></li>
          <li><a href="#derivatif">Derivatif — Taruhan atas Harga Masa Depan</a></li>
          <li><a href="#fx">Valas (FX) — Uang Melawan Uang</a></li>
          <li><a href="#komoditas">Komoditas — Barang Nyata, Harga Global</a></li>
          <li><a href="#rd-etf">Reksa Dana &amp; ETF — Paket Hemat</a></li>
          <li><a href="#lab1">🔬 Lab 1: Waterfall Kebangkrutan</a></li>
          <li><a href="#lab2">🔬 Lab 2: Fee Kecil, Efek Raksasa</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Instrumen Mana untuk Siapa</a></li>
          <li><a href="#case">📋 Mini-Case: Dana Pensiun 25 Tahun</a></li>
          <li><a href="#worked1">🔬 Worked Example: Payoff Waran</a></li>
          <li><a href="#worked2">🔬 Worked Example: Siapa Dibayar Duluan Saat Bangkrut</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Membeli yang Tak Dipahami</a></li>
          <li><a href="#worked3">🔬 Worked Example: NAV Reksa Dana</a></li>
          <li><a href="#payoff">🔧 Pendalaman: Profil Payoff — Linear vs Bengkok</a></li>
          <li><a href="#cpn">🔧 Pendalaman: Membongkar Produk Terstruktur Bank</a></li>
          <li><a href="#worked4">🔬 Worked Example: Bedah Capital Protected Note</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan enam kelas instrumen (saham, obligasi, derivatif, FX, komoditas, reksa dana/ETF) — apa yang dibeli dan dari mana return-nya.</li>
          <li>Mengurutkan senioritas klaim saat kebangkrutan dan mengaitkannya dengan ekspektasi return tiap instrumen.</li>
          <li>Membedakan reksa dana aktif vs ETF/index fund, termasuk dampak fee terhadap hasil jangka panjang.</li>
          <li>Memilih instrumen yang sesuai untuk tujuan dan horizon tertentu (tanpa asal ikut-ikutan).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Saham&rdquo; yang Ternyata Bukan Saham</h2>
      <div className="story">
        <p>Dimas bangga: <em>&ldquo;Aku beli saham perusahaan tambang, katanya bakal naik 50%!&rdquo;</em> Dicek: yang dia beli ternyata <strong>waran</strong> — derivatif yang hangus tak bernilai kalau harga saham tidak melewati harga eksekusi sebelum tanggal kedaluwarsa. Harga sahamnya naik 10%… warannya? <strong>Nol.</strong> Dimas tidak rugi karena &ldquo;sahamnya jelek&rdquo;, tapi karena <strong>dia tidak tahu apa yang dia beli</strong>.</p>
        <p>Setiap instrumen punya <em>aturan main</em> berbeda: dari mana untungnya, kapan hangusnya, siapa dibayar duluan saat bangkrut. Lesson ini memastikan kamu tidak jadi Dimas berikutnya.</p>
        <p><strong>Twist-nya:</strong> saham perusahaannya bahkan <em>tidak turun</em> — analisis Dimas tentang perusahaannya bisa jadi benar. Tapi ia rugi <strong>100%</strong>. Di dunia derivatif, benar soal arah saja <strong>tidak cukup</strong>: kamu harus benar soal arah, <em>besar gerakan</em>, dan <em>batas waktu</em> — tiga taruhan dalam satu tiket. Lesson ini memetakan &ldquo;aturan main&rdquo; tiap instrumen agar kamu tidak membayar uang sekolah semahal Dimas.</p>
      </div>

      <h2 id="saham">Saham — Sepotong Kepemilikan</h2>
      <p><strong>Definisi.</strong> Saham = bukti kepemilikan sebagian atas perusahaan. Return dari dua sumber: <strong>dividen</strong> (bagi laba) dan <strong>capital gain</strong> (selisih harga jual − beli).</p>
      <p><strong>Kepribadian:</strong> saham itu <em>mitra bisnis</em> — kalau perusahaan untung besar, kamu ikut pesta; kalau bangkrut, kamu antre <strong>paling belakang</strong> saat aset dibagi (lihat Lab 1). Tidak ada janji return tetap.</p>
      <p><strong>Kapan dipakai:</strong> horizon panjang (5+ tahun), tahan volatilitas, ingin return tertinggi dalam jangka panjang.</p>

      <h2 id="obligasi">Obligasi — Surat Utang yang Bisa Diperdagangkan</h2>
      <p><strong>Definisi.</strong> Obligasi = surat utang: kamu meminjamkan uang ke penerbit (korporasi/pemerintah), menerima <strong>kupon</strong> (bunga periodik) dan pokok kembali saat jatuh tempo. Contoh Indonesia: ORI, Sukuk Ritel, obligasi korporasi.</p>
      <p><strong>Kepribadian:</strong> obligasi itu <em>kreditur yang sabar</em> — return-nya dijanjikan di awal (kupon), dan saat bangkrut ia dibayar <strong>sebelum</strong> pemegang saham. Konsekuensinya: return ekspektasi lebih rendah dari saham.</p>
      <p><strong>Kapan dipakai:</strong> butuh arus kas periodik yang predictable; profil konservatif–moderat.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi itu aman, pasti balik modal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> obligasi punya <strong>risiko gagal bayar</strong> (<em>default</em>) — penerbit bisa tidak membayar. &ldquo;Aman&rdquo; hanya relatif terhadap saham, dan hanya untuk penerbit berkualitas (pemerintah, korporasi rating tinggi). Obligasi korporasi rating rendah bisa gagal bayar total. Harga obligasi juga turun saat suku bunga naik (dibahas di E4).</p>
      </div>

      <h2 id="derivatif">Derivatif — Taruhan atas Harga Masa Depan</h2>
      <p><strong>Definisi.</strong> Derivatif = kontrak yang nilainya <em>diturunkan</em> dari aset lain (<em>underlying</em>). Contoh: kontrak berjangka (<em>futures</em>), opsi (<em>options</em>), waran. Kamu tidak memiliki asetnya — kamu memegang <em>kontrak tentang</em> asetnya.</p>
      <p><strong>Kepribadian:</strong> derivatif itu <em>pedang bermata dua yang dipertajam</em> — bisa untuk <strong>lindung nilai</strong> (<em>hedging</em>: eksportir mengunci kurs) atau <strong>spekulasi ber-leverage</strong> (modal kecil, untung/rugi raksasa). Waran Dimas di cerita pembuka = derivatif: bisa hangus total.</p>
      <p><strong>Kapan dipakai:</strong> lindung nilai eksposur yang sudah ada; <strong>bukan</strong> untuk pemula yang belum paham payoff-nya (detail di E10–E11).</p>

      <h2 id="fx">Valas (FX) — Uang Melawan Uang</h2>
      <p><strong>Definisi.</strong> Pasar valuta asing = jual-beli mata uang: USD/IDR, EUR/USD, dst. Return dari pergerakan kurs. Pasar keuangan <strong>terbesar di dunia</strong> (triliunan dolar per hari), mayoritas OTC antar bank.</p>
      <p><strong>Kepribadian:</strong> FX itu <em>cermin ekonomi dua negara</em> — kurs bergerak karena selisih suku bunga, inflasi, dan sentimen risiko global. Trading FX ritel ber-leverage = salah satu cara tercepat kehilangan uang bagi pemula.</p>

      <h2 id="komoditas">Komoditas — Barang Nyata, Harga Global</h2>
      <p><strong>Definisi.</strong> Barang mentah yang diperdagangkan: emas, minyak, batubara, CPO, nikel, kopi. Harga ditentukan global (kecuali ada intervensi), diperdagangkan via fisik, futures, atau ETF komoditas.</p>
      <p><strong>Kepribadian:</strong> komoditas itu <em>termometer dunia</em> — naik saat ekonomi panas/inflasi tinggi, anjlok saat resesi. Indonesia = negara komoditas: harga batubara/CPO/nikel langsung memengaruhi APBN dan IHSG.</p>
      <p><strong>Kapan dipakai:</strong> diversifikasi &amp; lindung nilai inflasi; pahami dulu biaya penyimpanan/roll futures.</p>

      <h2 id="rd-etf">Reksa Dana &amp; ETF — Paket Hemat</h2>
      <p><strong>Definisi.</strong> Keduanya = <strong>kumpulan dana investor</strong> yang dikelola menjadi portofolio. Bedanya:</p>
      <ul>
        <li><strong>Reksa dana (konvensional/aktif):</strong> manajer investasi memilih saham/obligasi secara aktif; diperdagangkan <strong>sekali sehari</strong> di harga NAB; fee biasanya <strong>lebih tinggi</strong> (1–2%/tahun).</li>
        <li><strong>ETF</strong> (<em>exchange-traded fund</em>): diperdagangkan <strong>di bursa sepanjang hari</strong> seperti saham; mayoritas <strong>pasif</strong> (mengikuti indeks, misal ETF LQ45); fee biasanya <strong>rendah</strong> (0,1–0,5%/tahun).</li>
      </ul>
      <p><strong>Kepribadian:</strong> reksa dana aktif itu <em>koki restoran</em> — bayar mahal, kadang enak kadang biasa. ETF indeks itu <em>prasmanan</em> — murah, porsinya mengikuti pasar apa adanya.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Reksa dana pasti lebih aman dari saham langsung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> reksa dana <strong>saham</strong> isinya saham — naik-turunnya mirip saham langsung, hanya lebih terdiversifikasi. &ldquo;Aman&rdquo; tergantung <em>isi</em> portofolionya (pasar uang vs saham), bukan bungkusnya. Selalu cek <em>fund fact sheet</em>: alokasi aset &amp; top holdings.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada hierarki <strong>risiko ↔ return ekspektasi</strong> yang hampir selalu berlaku: deposito &lt; SBN &lt; obligasi korporasi &lt; reksa dana campuran &lt; saham blue chip &lt; saham gorengan/kripto. Kalau ada yang menawarkan return kripto dengan risiko deposito — itu bukan peluang, itu <em>red flag</em>.</p>
      </div>

      <PlotlyChart
        data={riskReturnData}
        title="Peta Risiko vs Return Ekspektasi (ilustratif)"
        layout={{ xaxis: { title: "Risiko (volatilitas) →" }, yaxis: { title: "Return ekspektasi →" } }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = risiko (seberapa liar naik-turunnya), sumbu Y = return yang <em>diharapkan</em> jangka panjang. Tiap titik = satu instrumen.</p>
        <p><strong>Interpretasi:</strong> titik-titik membentuk garis miring ke kanan atas — <strong>tidak ada makan siang gratis</strong>: return lebih tinggi selalu dibayar dengan risiko lebih tinggi. Titik yang jauh <em>di atas</em> garis (return tinggi, risiko rendah) patut dicurigai; titik jauh <em>di bawah</em> garis = return tidak sepadan risikonya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Waterfall Kebangkrutan</h2>
      <p>Simulasikan siapa dibayar duluan saat perusahaan bangkrut. Ubah nilai aset dan lihat siapa yang selamat.</p>
      <PyodideLab
        title="Lab 1 — Waterfall: Urutan Pembayaran saat Bangkrut"
        hint="Coba: aset = 150_000_000 (lebih kecil dari total klaim). Lalu aset = 450_000_000. Pada titik aset berapa pemegang saham biasa mulai dapat bagian?"
        defaultCode={lab1Code}
      />

      <PlotlyChart
        data={waterfallData}
        title="Dana Kembali per Rp100 jt Klaim (aset tersisa Rp250 jt)"
        layout={{ yaxis: { title: "Dana kembali (Rp jt)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = berapa rupiah kembali untuk tiap Rp100 jt klaim, dari yang paling senior (kiri) ke paling junior (kanan).</p>
        <p><strong>Interpretasi:</strong> kreditur senior kembali 100%, pemegang obligasi 85%, saham preferen 40%, <strong>saham biasa Rp0</strong>. Inilah alasan return saham harus lebih tinggi: ia menanggung risiko <em>first-loss</em>. Senioritas = harga dari keamanan.</p>
      </div>

      <h2 id="lab2">🔬 Lab 2: Fee Kecil, Efek Raksasa</h2>
      <p>Fee 2% vs 0,2% terlihat sepele per tahun. Selama 30 tahun? Jalankan dan rasakan.</p>
      <PyodideLab
        title="Lab 2 — Dampak Fee terhadap Hasil 30 Tahun"
        hint="Coba: fee = 0.015 (reksa dana aktif tipikal Indonesia ~1,5-2%). Bandingkan dengan ETF 0,2%. Selisihnya = gaji manajer investasi dari kantongmu."
        defaultCode={lab2Code}
      />

      <PlotlyChart
        data={feeDragData}
        title="Rp100 jt Tumbuh 30 Tahun: Fee 0,2% vs 2% (return bruto 10%)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Nilai (Rp jt)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = tahun, sumbu Y = nilai investasimu. Dua garis: fee rendah (biru) vs fee tinggi (merah).</p>
        <p><strong>Interpretasi:</strong> setelah 30 tahun, fee 2% menggerogoti <strong>ratusan juta</strong> — selisihnya melebar secara eksponensial karena fee memakan <em>bunga-berbunga</em>-mu juga. Pelajaran: untuk investasi pasif jangka panjang, <strong>fee adalah prediktor return bersih terbaik</strong> yang bisa kamu kontrol.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> sebelum membeli instrumen apapun, jawab tiga pertanyaan: (1) <em>Apa yang sebenarnya kubeli?</em> (aset vs kontrak), (2) <em>Dari mana return-nya?</em> (dividen/kupon/capital gain/premi), (3) <em>Kapan bisa jadi nol?</em> (default? kedaluwarsa? bangkrut?). Kalau satu saja tidak bisa dijawab — jangan beli.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Instrumen Mana untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Dana darurat, tidak boleh minus → <strong>Deposito / Reksa dana pasar uang</strong></h3>
        <p><strong>Kondisi:</strong> butuh pokok utuh kapan saja.</p>
        <p><strong>Kenapa:</strong> nilai stabil, likuid. Return kecil = harga ketenangan.</p>
        <p><strong>Contoh nyata:</strong> dana darurat 6× pengeluaran bulanan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Tujuan 3–5 tahun, profil moderat → <strong>SBN ritel / Obligasi</strong></h3>
        <p><strong>Kondisi:</strong> ingin return di atas deposito dengan risiko terukur.</p>
        <p><strong>Kenapa:</strong> kupon periodik + pokok kembali saat jatuh tempo (jika dipegang sampai maturitas dan tidak default).</p>
        <p><strong>Contoh nyata:</strong> ORI/Sukuk Ritel untuk dana DP rumah 4 tahun lagi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Tujuan 10+ tahun, tahan gejolak → <strong>Saham / ETF indeks</strong></h3>
        <p><strong>Kondisi:</strong> horizon panjang, tidak panik saat turun 20%.</p>
        <p><strong>Kenapa:</strong> jangka panjang, ekuitas punya return ekspektasi tertinggi; diversifikasi + fee rendah via ETF.</p>
        <p><strong>Contoh nyata:</strong> dana pensiun via ETF LQ45/IDX30 rutin bulanan.</p>
      </div>

      <div className="decision-card">
        <h3>4. Lindungi bisnis dari kurs → <strong>Derivatif FX (hedging)</strong></h3>
        <p><strong>Kondisi:</strong> punya eksposur nyata (utang USD, impor bahan baku).</p>
        <p><strong>Kenapa:</strong> derivatif mengunci harga masa depan. Catatan: ini <em>asuransi</em>, bukan investasi — tujuannya menghilangkan risiko, bukan mencari untung.</p>
        <p><strong>Contoh nyata:</strong> eksportir mengunci kurs jual USD 6 bulan ke depan.</p>
      </div>

      <div className="decision-card">
        <h3>5. Takut inflasi menggerogoti → <strong>Komoditas / Saham</strong> (porsi kecil)</h3>
        <p><strong>Kondisi:</strong> ingin aset yang cenderung naik saat inflasi tinggi.</p>
        <p><strong>Kenapa:</strong> komoditas &amp; ekuitas historis menjaga daya beli lebih baik dari kas. Porsi kecil saja — volatilitasnya tinggi.</p>
        <p><strong>Contoh nyata:</strong> alokasi 5–10% emas/ETF komoditas sebagai pelengkap.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Horizon &lt; 1 thn</strong> → pasar uang. <strong>1–5 thn</strong> → obligasi/SBN. <strong>5+ thn</strong> → saham/ETF.</li>
          <li><strong>Cek bungkusnya:</strong> reksa dana &ldquo;saham&rdquo; = risiko saham. Baca fund fact sheet.</li>
          <li><strong>Derivatif tanpa eksposur yang dilindungi = spekulasi.</strong> Pastikan kamu tahu bedanya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Dana Pensiun 25 Tahun</h2>
      <div className="callout">
        <p>Rina, 30 tahun, menyisihkan Rp2 juta/bulan untuk pensiun (25 tahun). Penasihat A menawarkan reksa dana saham aktif (fee 2%/tahun, &ldquo;pernah&rdquo; return 14%/tahun). Penasihat B menawarkan ETF indeks (fee 0,2%/tahun, ekspektasi return pasar 10%/tahun).</p>
        <p><strong>Pertanyaan:</strong> (a) Dengan asumsi return bruto keduanya SAMA (10%/tahun), berapa selisih hasil akhir akibat fee? (b) Argumen apa yang bisa membenarkan pilihan reksa dana aktif?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Pakai logika Lab 2: Rp2 jt/bln × 12 bln × 25 thn. Return neto A = 8%, B = 9,8%. Nilai akhir B <strong>jauh</strong> lebih besar — selisihnya bisa ratusan juta hingga miliaran rupiah. Fee 1,8% per tahun selama 25 tahun = pajak senyap yang brutal.</p>
          <p>(b) Reksa dana aktif hanya masuk akal jika manajernya <strong>konsisten</strong> mengalahkan pasar <em>setelah fee</em> — yang secara statistik jarang dan sulit diidentifikasi di muka. Klaim &ldquo;pernah 14%&rdquo; tanpa konteks periode &amp; risiko = marketing, bukan bukti.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Anatomi Payoff Waran (Kenapa Dimas Rugi 100%)</h2>
      <p>Rekonstruksi kasus Dimas. Waran &ldquo;MAJU-W&rdquo;: harga beli <strong>Rp200</strong> per waran, <strong>strike Rp1.500</strong>, rasio 1:1, kedaluwarsa 6 bulan. Harga saham saat beli Rp1.500. Tiga skenario saat expiry:</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Skenario A — saham naik 10% ke Rp1.650</strong> (ini yang terjadi pada Dimas):</p>
        <p>Payoff waran = max(1.650 − 1.500, 0) = <strong>Rp150</strong>. Dimas membayar Rp200 untuk sesuatu yang kini bernilai Rp150 &rarr; <strong>rugi Rp50/waran (−25%)</strong>, padahal sahamnya <em>naik</em> 10%! Kenapa? Karena Rp200 yang ia bayar mengandung <em>time value</em> (harapan 6 bulan) yang menguap seiring waktu — dan kenaikan 10% tidak cukup menutupinya.</p>
        <p><strong>Skenario B — saham melonjak ke Rp1.900 (+26,7%):</strong></p>
        <p>Payoff = 1.900 − 1.500 = Rp400. Untung Rp200/waran = <strong>+100%</strong>. Inilah daya tarik waran: <em>leverage</em> — modal Rp200 mengendalikan eksposur saham Rp1.500.</p>
        <p><strong>Skenario C — saham stagnan di Rp1.500:</strong></p>
        <p>Payoff = max(0, 0) = <strong>Rp0</strong>. Waran hangus &rarr; <strong>rugi 100%</strong>. Pemegang saham biasa? Masih pegang saham Rp1.500 — rugi 0%.</p>
        <p><strong>Intuisi:</strong> waran/opsi = tiket lotre <em>berkedaluwarsa</em> dengan hadiah proporsional. Tiga musuh pembeli waran: harga tidak bergerak (<em>theta</em>/peluruhan waktu), gerakan terlalu kecil, dan salah arah. Dimas kalah oleh musuh pertama dan kedua sekaligus.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Siapa Dibayar Duluan Saat Perusahaan Bangkrut?</h2>
      <p>PT Bangkrut Jaya dilikuidasi. Aset yang berhasil dijual: <strong>Rp60 miliar</strong>. Struktur klaimnya:</p>
      <ul>
        <li>Obligasi (kreditor): <strong>Rp50 miliar</strong></li>
        <li>Saham preferen: <strong>Rp20 miliar</strong></li>
        <li>Saham biasa: sisanya (klaim residual)</li>
      </ul>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Bayar kreditor dulu (obligasi):</strong> 60 − 50 = sisa Rp10 miliar. Pemegang obligasi pulih <strong>100%</strong> (<em>recovery rate</em> penuh).</p>
        <p><strong>Langkah 2 — Saham preferen:</strong> klaim Rp20 miliar, tersisa Rp10 miliar &rarr; dapat Rp10 miliar = <strong>recovery 50%</strong>.</p>
        <p><strong>Langkah 3 — Saham biasa:</strong> sisa Rp0 &rarr; <strong>recovery 0%</strong>. Habis.</p>
        <p><strong>Intuisi:</strong> inilah makna &ldquo;saham = klaim residual&rdquo; — pemegang saham antre <em>paling belakang</em>. Sebagai kompensasi atas antrean belakang ini, saham punya <em>upside</em> tak terbatas (obligasi capped di kupon + pokok). Struktur modal = pembagian risiko <em>dan</em> pembagian hasil yang sepaket: <strong>makin depan antrean, makin pasti dibayar, makin kecil potensi untungnya.</strong></p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2008 — Ketika Pembeli Tidak Paham yang Dibeli</h2>
      <p>Krisis finansial 2008 pada dasarnya adalah <strong>krisis instrumen yang tidak dipahami pembelinya</strong>. Bank-bank mengemas ribuan KPR berisiko (<em>subprime</em>) menjadi obligasi berlapis bernama <strong>CDO</strong> (<em>collateralized debt obligation</em>) — lalu lembaga pemeringkat memberi label <strong>AAA</strong> (setara obligasi pemerintah AS!) pada lapisan teratasnya.</p>
      <p>Dana pensiun di Norwegia, bank daerah di Jerman, pemerintah kota di AS — membeli CDO karena &ldquo;AAA = aman&rdquo;. Mereka tidak paham (dan tidak membaca ribuan halaman prospektus) bahwa &ldquo;aman&rdquo; itu bersyarat pada asumsi <em>harga rumah tidak pernah turun serentak secara nasional</em> — asumsi yang runtuh tahun 2007–2008. Kerugian global: triliunan dolar.</p>
      <p><strong>Pelajaran untuk lesson ini:</strong></p>
      <ul>
        <li><strong>Aturan Dimas berlaku di semua skala</strong> — dari waran Rp200 ribu sampai CDO US$50 juta: jangan beli instrumen yang <em>aturan mainnya</em> tidak bisa kamu jelaskan dalam 3 kalimat.</li>
        <li><strong>Rating &amp; label bukan pengganti pemahaman.</strong> &ldquo;AAA&rdquo;, &ldquo;dijamin&rdquo;, &ldquo;pasti cuan&rdquo; = klaim penjual. Verifikasi: dari mana arus kasnya? siapa dibayar duluan? apa yang terjadi di skenario buruk?</li>
        <li><strong>Kompleksitas = biaya tersembunyi.</strong> Makin kompleks instrumennya, makin besar kemungkinan ada risiko yang tidak kamu lihat — dan makin besar <em>fee</em> yang dipungut perancangnya dari ketidaktahuanmu.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ETF vs reksa dana konvensional — keduanya &ldquo;keranjang&rdquo; saham, tapi aturan mainnya beda. <strong>ETF</strong> diperdagangkan di bursa seperti saham (harga berubah tiap detik, bisa dibeli 1 lot). <strong>Reksa dana</strong> dibeli/dijual pada NAV yang dihitung <em>sekali sehari</em> setelah bursa tutup. Butuh masuk/keluar <em>intraday</em>? ETF. Nabung rutin autopilot? Reksa dana. Instrumen boleh mirip — mekanisme perdagangannya menentukan perilakumu.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Derivatif itu judi, titik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> derivatif = <em>alat transfer risiko</em>; judi atau bukan tergantung <strong>niat pemakainya</strong>. Pak Tani mengunci harga beras (E10) = <em>hedging</em>, sama mulianya dengan asuransi. Spekulan menebak arah tanpa eksposur awal = judi. Pisau yang sama bisa untuk memasak atau melukai — jangan salahkan pisaunya, pahami siapa memegangnya dan untuk apa.</p>
      </div>


      <h2 id="worked3">🔬 Worked Example 3: NAV Reksa Dana — &ldquo;Harga&rdquo; yang Dihitung, Bukan Ditawar</h2>
      <p>Reksa dana &ldquo;Maju Teratur&rdquo; mengelola total aset (<em>AUM</em>) <strong>Rp500 miliar</strong> (saham + kas) dengan <strong>400 juta unit</strong> beredar. Berapa &ldquo;harga&rdquo; per unit (NAB/NAV)? Kamu invest Rp10 juta — berapa unit didapat, dan berapa nilainya jika pasar naik 2%?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — NAV per unit:</strong> 500.000.000.000 &divide; 400.000.000 = <strong>Rp1.250/unit</strong>.</p>
        <p><strong>Langkah 2 — Unit yang kamu dapat:</strong> 10.000.000 &divide; 1.250 = <strong>8.000 unit</strong>.</p>
        <p><strong>Langkah 3 — Pasar naik 2%:</strong> AUM &rarr; Rp510 miliar. NAV baru = 510 M &divide; 400 jt = <strong>Rp1.275</strong>. Nilai investasimu = 8.000 &times; 1.275 = <strong>Rp10.200.000</strong> (+2%, persis mengikuti pasar — dikurangi fee manajer investasi ~1–2%/tahun yang dipotong diam-diam dari NAV harian).</p>
        <p><strong>Intuisi:</strong> bedakan dengan saham/ETF — NAV reksa dana <strong>dihitung</strong> (akuntansi, sekali sehari setelah bursa tutup), bukan <strong>ditawar</strong> (lelang tiap detik). Konsekuensinya: kamu tidak bisa &ldquo;kabur&rdquo; <em>intraday</em> saat pasar crash jam 10 pagi — penjualanmu dieksekusi pada NAV <em>sore harinya</em>, setelah semua kerusakan terjadi. Aturan main menentukan strategi keluar.</p>
      </details>

      <h2 id="payoff">🔧 Pendalaman: Profil Payoff — Kenapa Opsi &ldquo;Bengkok&rdquo; dan Futures Lurus</h2>
      <p>Gambar mental terpenting untuk derivatif: <strong>bentuk kurva payoff</strong>-nya.</p>
      <ul>
        <li><strong>Forward/futures = garis lurus diagonal.</strong> Harga naik Rp100 &rarr; untung Rp100; turun Rp100 &rarr; rugi Rp100. Simetris: <em>untung dan rugi tak terbatas</em> (dua arah). Cocok untuk <em>hedging</em> murni (Pak Tani): ia memang ingin mengunci, bukan bertaruh.</li>
        <li><strong>Opsi beli (call) = garis bengkok (<em>kinked</em>).</strong> Di bawah strike: datar di −premi (rugi mentok = premi hangus). Di atas strike: menanjak mengikuti saham. Asimetris: <em>rugi terbatas, untung tak terbatas</em>.</li>
        <li><strong>Harga &ldquo;bengkok&rdquo; ini = harga asuransi.</strong> Premi opsi = harga yang rela dibayar untuk memotong sisi rugi. Makin bengkok perlindungannya (makin jauh dari uang), makin mahal preminya — persis seperti asuransi mobil: pertanggungan penuh lebih mahal dari <em>deductible</em> besar.</li>
      </ul>
      <p><strong>Kenapa ini penting untuk karirmu:</strong> setiap produk terstruktur bank (capital protected notes, autocallable, dll.) = <em>bundel</em> dari obligasi + beberapa opsi yang dibungkus jadi satu. Kalau kamu bisa membaca payoff bengkok, kamu bisa &ldquo;membongkar&rdquo; produk apa pun: <em>bagian mana yang obligasi, bagian mana yang opsi, dan berapa premi tersembunyi yang kamu bayar?</em> Itu skill analis produk yang digaji mahal.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga pertanyaan sebelum beli <em>instrumen apa pun</em>: (1) <strong>Dari mana untungnya?</strong> (apresiasi harga? kupon? selisih payoff?) (2) <strong>Apa skenario terburuknya?</strong> (rugi 100%? lebih dari modal — seperti short futures?) (3) <strong>Kapan ia kedaluwarsa / bisa dicairkan?</strong> (waran hangus, deposito penalti, reksa dana T+2). Tiga jawaban ini = &ldquo;aturan main&rdquo; yang melindungi dari nasib Dimas.</p>
      </div>


      <h2 id="cpn">🔧 Pendalaman: Membongkar Produk Terstruktur — &ldquo;Modal Dijamin + Ikut Untung Saham&rdquo;?</h2>
      <p>Bank menawarkan <strong>Capital Protected Note (CPN)</strong> 3 tahun: &ldquo;modal 100% dijamin kembali + dapat 70% kenaikan IHSG jika naik!&rdquo; Terdengar mustahil — dari mana bank membayar &ldquo;jaminan + upside&rdquo;? Bongkar dengan E3 + E10 + E11:</p>
      <ol>
        <li><strong>Komponen obligasi:</strong> dari Rp100 juta danamu, bank menaruh ~Rp85 juta di <strong>obligasi zero-coupon 3 tahun</strong> (yield ~5,5%) &rarr; 85 × (1,055)<sup>3</sup> ≈ <strong>Rp100 juta</strong> saat jatuh tempo. <em>Inilah &ldquo;jaminan modalnya&rdquo;</em> — bukan sihir, tapi TVM.</li>
        <li><strong>Komponen opsi:</strong> sisa ~Rp15 juta dibelikan <strong>opsi call IHSG 3 tahun</strong> (partisipasi 70% — artinya opsi yang dibeli setara 70% eksposur). Jika IHSG naik 30% &rarr; kamu dapat 21%. Jika turun &rarr; opsi hangus, kamu tetap dapat Rp100 juta.</li>
        <li><strong>Fee tersembunyi:</strong> &ldquo;harga wajar&rdquo; kedua komponen mungkin hanya Rp97 juta — <strong>Rp3 juta = margin bank</strong> (distribusi, lindung nilai, keuntungan). Kamu tidak akan pernah melihat angka ini di brosur.</li>
      </ol>
      <p><strong>Kenapa bank menjual ini (bukan kamu merakit sendiri)?</strong> Karena merakit sendiri butuh: akses obligasi zero-coupon + akses opsi IHSG OTC + modal besar + pengetahuan. Bank menjual <strong>kemudahan + kemasan</strong> — dengan harga 2–4% margin. Pertanyaan yang benar: <em>&ldquo;apakah kemudahan ini sepadan dengan marginnya?&rdquo;</em></p>
      <h2 id="worked4">🔬 Worked Example: Bedah CPN Rp100 Juta — Berapa yang Sebenarnya Kamu Beli?</h2>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai komponen obligasi:</strong> zero-coupon 3 thn, yield 5,5%: PV = 100 ÷ (1,055)<sup>3</sup> = 100 ÷ 1,174 = <strong>Rp85,2 juta</strong>.</p>
        <p><strong>Langkah 2 — Sisa untuk opsi:</strong> 100 − 85,2 = <strong>Rp14,8 juta</strong> &rarr; inilah &ldquo;anggaran&rdquo; opsi call 3 tahun partisipasi 70%.</p>
        <p><strong>Langkah 3 — Skenario:</strong> IHSG +30% &rarr; kamu terima 100 + (70% × 30%) = <strong>Rp121 juta</strong>. Bandingkan beli IHSG langsung (ETF): 100 × 1,30 = <strong>Rp130 juta</strong> — kamu &ldquo;kehilangan&rdquo; Rp9 juta = harga proteksi + margin bank. IHSG −20% &rarr; kamu terima <strong>Rp100 juta</strong> (vs Rp80 juta jika pegang ETF) — proteksinya bekerja.</p>
        <p><strong>Langkah 4 — Risiko yang disembunyikan brosur:</strong> (a) <strong>risiko kredit bank penerbit</strong> — &ldquo;jaminan modal&rdquo; = janji <em>bank</em>, bukan LPS! Jika bank bangkrut, notemu = obligasi tanpa agunan (ingat hierarki E2 Worked 2!); (b) <strong>tidak likuid</strong> — jual sebelum jatuh tempo = potongan besar; (c) <strong>risiko inflasi</strong> — &ldquo;kembali 100%&rdquo; nominal setelah 3 tahun inflasi 4%/thn = <strong>rugi daya beli ~11%</strong>.</p>
        <p><strong>Intuisi:</strong> setiap produk terstruktur = <strong>obligasi + opsi + margin</strong>. Keterampilan &ldquo;membongkar&rdquo; ini (disebut <em>reverse engineering</em> produk) = yang dikerjakan <em>structurer</em> bank dengan gaji besar — dan sekarang kamu bisa melakukannya dengan E3 + E10 + E11. <strong>Jangan beli kemasan; beli komponennya — atau tolak kemasannya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga pertanyaan E2 (dari mana untung? skenario terburuk? kapan cair?) ditambah satu untuk produk bank: <strong>(4) siapa lawan transaksiku dan berapa marginnya?</strong> Jika bank tidak bisa menjawab dengan angka — <em>kamu</em> adalah marginnya. Produk yang bagus berani transparan; yang tidak, bersembunyi di balik brosur mengkilap.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Kenali Senjatamu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perusahaan bangkrut, aset tersisa terbatas. Siapa dibayar PALING akhir?"
        options={[
          "Kreditur bank",
          "Pemegang obligasi",
          "Pemegang saham preferen",
          "Pemegang saham biasa",
        ]}
        correct={3}
        explanation="Benar: saham biasa — klaim paling junior. Inilah alasan return saham harus paling tinggi: ia menanggung risiko first-loss."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Perbedaan utama ETF vs reksa dana konvensional?"
        options={[
          "ETF dijamin tidak rugi",
          "ETF diperdagangkan di bursa sepanjang hari & umumnya berfee lebih rendah",
          "Reksa dana tidak bisa rugi",
          "ETF hanya untuk institusi",
        ]}
        correct={1}
        explanation="Benar: ETF = seperti saham (trading intraday) + umumnya pasif berfee rendah. Isi risikonya tetap mengikuti aset dasarnya — ETF saham tetap bisa turun tajam."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Waran yang dipegang Dimas di cerita pembuka termasuk…"
        options={[
          "Saham biasa",
          "Obligasi",
          "Derivatif — nilainya diturunkan dari saham & bisa hangus",
          "Reksa dana",
        ]}
        correct={2}
        explanation="Benar: derivatif. Waran = hak (bukan kewajiban) membeli saham di harga & waktu tertentu. Lewat tanggalnya tanpa kondisi terpenuhi = nilai nol."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Return obligasi terutama berasal dari…"
        options={[
          "Dividen dan capital gain",
          "Kupon periodik + pengembalian pokok saat jatuh tempo",
          "Premi opsi",
          "Selisih kurs",
        ]}
        correct={1}
        explanation="Benar: kupon + pokok. Dividen/capital gain = bahasa saham; premi = bahasa opsi; selisih kurs = bahasa FX."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa harga batubara/CPO penting bagi investor Indonesia?"
        options={[
          "Tidak penting sama sekali",
          "Indonesia negara komoditas — harga komoditas memengaruhi APBN, laba emiten, dan IHSG",
          "Karena OJK mewajibkan",
          "Hanya penting untuk petani",
        ]}
        correct={1}
        explanation="Benar: komoditas = denyut ekonomi Indonesia. Boom komoditas mengangkat penerimaan negara & laba emiten tambang/perkebunan — dan sebaliknya saat bust."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Eksportir mengunci kurs USD/IDR 6 bulan ke depan dengan kontrak forward. Ini contoh penggunaan derivatif untuk…"
        options={[
          "Spekulasi mencari untung",
          "Hedging — menghilangkan risiko yang sudah ada",
          "Arbitrase",
          "Investasi jangka panjang",
        ]}
        correct={1}
        explanation="Benar: hedging. Eksportir SUDAH punya eksposur (penerimaan USD); forward menghilangkan ketidakpastian kurs. Derivatif yang sama di tangan spekulan tanpa eksposur = taruhan ber-leverage."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Saham</strong> = kepemilikan; return dari dividen + capital gain; klaim paling junior.</li>
          <li><strong>Obligasi</strong> = surat utang; return dari kupon + pokok; senior dari saham tapi bisa default.</li>
          <li><strong>Derivatif</strong> = kontrak atas aset lain; untuk hedging atau spekulasi ber-leverage; bisa hangus.</li>
          <li><strong>FX</strong> = pasar terbesar dunia (mayoritas OTC); digerakkan suku bunga &amp; sentimen global.</li>
          <li><strong>Komoditas</strong> = barang nyata; termometer ekonomi &amp; lindung nilai inflasi; krusial bagi Indonesia.</li>
          <li><strong>Reksa dana/ETF</strong> = paket diversifikasi; cek ISI-nya (bukan bungkusnya) dan waspadai fee.</li>
          <li>Hierarki risiko-return: tidak ada return tinggi tanpa risiko tinggi. Titik di luar garis = curigai.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e1-struktur-pasar" className="btn btn-secondary btn-sm">← E1</Link>
        <Link href="/learn/e3-tvm" className="btn btn-primary btn-sm">Next: E3 →</Link>
      </div>
    </div>
  );
}
