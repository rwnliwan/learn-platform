"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E1Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const ipoVsSecondaryData = [
    {
      x: ["Dana IPO setahun (primer)", "Transaksi harian IDX (sekunder)"],
      y: [15, 12],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838"] },
      text: ["~Rp15 T/thn", "~Rp12 T/hari"],
      textposition: "outside",
    },
  ];

  const marketSplitData = [
    {
      labels: ["Pasar Modal (saham, obligasi)", "Pasar Uang (deposito, SBI/SRBI, repo)"],
      values: [62, 38],
      type: "pie",
      marker: { colors: ["#2a7de1", "#94a3b8"] },
      textinfo: "label+percent",
    },
  ];

  const tenorData = [
    {
      x: ["Pasar Uang", "Pasar Modal"],
      y: [0.5, 10],
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1"] },
      text: ["< 1 tahun", "> 1 tahun"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Ke mana uang IPO mengalir?
# PT MajuMundur IPO: 100 juta lembar @ Rp1.000
lembar = 100_000_000
harga_ipo = 1_000
fee_underwriter_pct = 0.03  # 3%

dana_bruto = lembar * harga_ipo
fee = dana_bruto * fee_underwriter_pct
dana_bersih_perusahaan = dana_bruto - fee

print(f"Dana bruto dari investor : Rp{dana_bruto/1e9:,.0f} miliar")
print(f"Fee underwriter (3%)      : Rp{fee/1e9:,.1f} miliar")
print(f"Dana bersih ke perusahaan : Rp{dana_bersih_perusahaan/1e9:,.1f} miliar")
print()
# Sebulan kemudian Budi jual ke Ani di bursa @ Rp1.500
harga_sekunder = 1_500
print(f"Budi jual 1.000 lembar ke Ani @ Rp{harga_sekunder:,}")
print(f"Uang yang diterima PERUSAHAAN dari transaksi ini: Rp0")
print("-> Pasar sekunder = uang berpindah antar investor, bukan ke emiten.")`;

  const lab2Code = `# Lab 2 — Biaya tersembunyi: bid-ask spread
# Kamu beli di harga ASK, jual di harga BID. Selisihnya = biaya.
bid = 1490   # harga jual (yang berani dibayar pembeli)
ask = 1510   # harga beli (yang diminta penjual)
lembar = 1000

mid = (bid + ask) / 2
spread = ask - bid
spread_pct = spread / mid * 100
biaya_roundtrip = spread * lembar  # beli lalu langsung jual

print(f"Harga wajar (mid)   : Rp{mid:,.0f}")
print(f"Spread              : Rp{spread} ({spread_pct:.2f}%)")
print(f"Biaya beli+jual {lembar:,} lbr: Rp{biaya_roundtrip:,}")
print()
print("Coba: ubah bid=1499, ask=1501 (saham likuid).")
print("Spread menyusut -> biaya turun. Itulah gunanya likuiditas.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">E1 — Financial Markets</span>
        <h1 className="display-title">Peta Pasar Keuangan:<br />Ke Mana Uang Mengalir?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: IPO Rp100 Miliar, Lalu…?</a></li>
          <li><a href="#primer">Pasar Primer vs Sekunder</a></li>
          <li><a href="#uang-modal">Pasar Uang vs Pasar Modal</a></li>
          <li><a href="#bursa-otc">Bursa vs OTC</a></li>
          <li><a href="#pelaku">Para Pelaku: Siapa Bertemu Siapa</a></li>
          <li><a href="#regulator">Regulator Indonesia: Wasitnya Siapa?</a></li>
          <li><a href="#lab1">🔬 Lab 1: Ke Mana Uang IPO Mengalir</a></li>
          <li><a href="#lab2">🔬 Lab 2: Biaya Tersembunyi Bid-Ask Spread</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Uangmu Mau ke Mana?</a></li>
          <li><a href="#case">📋 Mini-Case: Startup Mau IPO</a></li>
          <li><a href="#worked1">🔬 Worked Example: Rights Issue</a></li>
          <li><a href="#worked2">🔬 Worked Example: Biaya Total Sekali Trading</a></li>
          <li><a href="#konteks">🌍 Konteks: Flash Crash &amp; Dapur Bursa</a></li>
          <li><a href="#worked3">🔬 Worked Example: Membaca Order Book</a></li>
          <li><a href="#mikro">🔧 Pendalaman: Fraksi Harga &amp; Auto Rejection IDX</a></li>
          <li><a href="#bookbuilding">🔧 Pendalaman: Bookbuilding — Dari Mana Harga IPO Muncul?</a></li>
          <li><a href="#worked4">🔬 Worked Example: Alokasi IPO &amp; Underpricing</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan pasar primer dan sekunder — dan menjelaskan siapa yang menerima uang di tiap transaksi.</li>
          <li>Membedakan pasar uang dan pasar modal berdasarkan tenor dan instrumennya, dengan contoh Indonesia (SBN, deposito, SRBI).</li>
          <li>Membedakan perdagangan di bursa dan OTC beserta konsekuensi praktisnya (transparansi harga, likuiditas).</li>
          <li>Menyebutkan pelaku utama pasar dan peran regulator Indonesia (OJK, BI, Bappebti, LPS).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: IPO Rp100 Miliar, Lalu…?</h2>
      <div className="story">
        <p>PT MajuMundur IPO: menjual 100 juta lembar saham @ Rp1.000 — total Rp100 miliar masuk ke kas perusahaan. Budi ikut IPO. Sebulan kemudian harga naik ke Rp1.500, Budi menjual 1.000 lembarnya ke Ani. Ani bangga: <em>&ldquo;Aku sudah kasih modal Rp1,5 juta ke MajuMundur!&rdquo;</em></p>
        <p>Salah. <strong>Perusahaan menerima Rp0 dari transaksi Budi–Ani.</strong> Uang Rp1,5 juta berpindah dari Ani ke Budi — MajuMundur tidak kebagian sepeser pun. Inilah perbedaan paling fundamental di pasar keuangan: <strong>pasar primer</strong> (uang ke perusahaan) vs <strong>pasar sekunder</strong> (uang antar investor).</p>
        <p><strong>Twist-nya:</strong> Ani <em>yakin</em> ia memodali perusahaan — dan secara intuitif itu masuk akal. Tapi di pasar keuangan, intuisi &ldquo;uangku sampai ke perusahaan&rdquo; hanya benar di <strong>satu dari dua pasar</strong>. Mayoritas transaksi yang kamu lihat di aplikasi sekuritas — grafik hijau-merah yang bergerak tiap detik — terjadi di pasar yang <strong>tidak memberi sepeser pun</strong> ke perusahaan. Memahami dua pasar ini = memahami ke mana sebenarnya uangmu pergi setiap kali menekan tombol beli.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="primer">Pasar Primer vs Sekunder</h2>
      <p><strong>Definisi.</strong> <strong>Pasar primer</strong> adalah tempat sekuritas <em>diterbitkan pertama kali</em> — uang mengalir dari investor ke penerbit (emiten). <strong>Pasar sekunder</strong> adalah tempat sekuritas yang sudah beredar <em>diperdagangkan antar investor</em> — emiten tidak terlibat dan tidak menerima uang.</p>
      <p><strong>Contoh Indonesia:</strong></p>
      <ul>
        <li><strong>Primer:</strong> IPO saham di IDX, <em>rights issue</em>, lelang Surat Berharga Negara (SBN) oleh pemerintah — misal kamu beli ORI/Sukuk Ritel saat masa penawaran.</li>
        <li><strong>Sekunder:</strong> jual-beli saham harian di IDX, jual-beli obligasi antar investor di pasar sekunder.</li>
      </ul>
      <p><strong>Kepribadian:</strong> pasar primer itu <em>pabrik</em> — di sinilah modal segar dicetak untuk perusahaan/negara. Pasar sekunder itu <em>pasar loak raksasa</em> — barangnya sudah ada, yang berpindah hanya kepemilikan. Tanpa pasar loak yang ramai, tak ada yang mau beli dari pabrik (karena tidak bisa jual kembali) — jadi sekunder yang likuid justru membuat primer bisa hidup.</p>
      <p><strong>Kapan konsep ini penting:</strong> saat menilai &ldquo;apakah investasiku membantu perusahaan?&rdquo; (hanya di primer), dan saat memahami kenapa harga saham naik tidak menambah kas perusahaan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Beli saham berarti memberi modal ke perusahaan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> hanya benar di <strong>pasar primer</strong> (IPO, rights issue). Beli saham di bursa dari investor lain = uangmu ke penjual, bukan ke perusahaan. Harga saham naik ≠ kas perusahaan bertambah — yang bertambah adalah <em>kekayaan pemegang saham</em> dan kemampuan perusahaan menerbitkan saham baru dengan harga bagus.</p>
      </div>

      <PlotlyChart
        data={ipoVsSecondaryData}
        title="Primer vs Sekunder: Skala Dana (ilustratif, Indonesia)"
        layout={{ yaxis: { title: "Rp triliun" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang — dana yang dihimpun lewat IPO dalam setahun vs nilai transaksi harian di bursa. Satu batang mewakili setahun, satu batang mewakili <em>satu hari</em>.</p>
        <p><strong>Interpretasi:</strong> pasar sekunder (perdagangan harian) skalanya <em>jauh</em> lebih besar dari pasar primer. Inilah kenapa likuiditas sekunder sangat penting: investor berani masuk IPO karena tahu besok bisa menjualnya kembali di pasar yang ramai.</p>
      </div>

      <h2 id="uang-modal">Pasar Uang vs Pasar Modal</h2>
      <p><strong>Definisi.</strong> Pembedanya adalah <strong>tenor</strong> (jangka waktu):</p>
      <ul>
        <li><strong>Pasar uang</strong> (<em>money market</em>): instrumen utang berjangka <strong>pendek</strong> — jatuh tempo ≤ 1 tahun. Contoh: deposito, Sertifikat Bank Indonesia, Sertifikat Rupiah Bank Indonesia (SRBI), <em>commercial paper</em>, repo.</li>
        <li><strong>Pasar modal</strong> (<em>capital market</em>): instrumen berjangka <strong>panjang</strong> — &gt; 1 tahun. Contoh: saham, obligasi/SBN bertenor panjang, reksa dana, ETF.</li>
      </ul>
      <p><strong>Kepribadian:</strong> pasar uang itu <em>parkiran</em> — tempat dana singgah sementara, aman, gampang keluar-masuk. Pasar modal itu <em>perkebunan</em> — ditanam lama, hasilnya lebih besar tapi harus tahan cuaca (volatilitas).</p>
      <p><strong>Kapan dipakai:</strong> dana darurat &amp; kas operasional perusahaan → pasar uang. Dana pensiun &amp; tujuan 5–10 tahun → pasar modal.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar uang = tempat jual-beli mata uang (valas).&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> pasar <strong>uang</strong> (<em>money market</em>) = instrumen utang jangka pendek (deposito, SBI/SRBI). Jual-beli mata uang asing itu <strong>pasar valuta asing</strong> (<em>foreign exchange market</em>) — pasar yang berbeda. Jangan tertukar: &ldquo;uang&rdquo; di sini artinya likuiditas jangka pendek, bukan mata uang.</p>
      </div>

      <PlotlyChart
        data={tenorData}
        title="Tenor Khas: Pasar Uang vs Pasar Modal"
        layout={{ yaxis: { title: "Tenor khas (tahun, skala log)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = lamanya dana &ldquo;terkunci&rdquo; secara khas di tiap pasar.</p>
        <p><strong>Interpretasi:</strong> pasar uang = hitungan bulan (likuid, return rendah); pasar modal = hitungan tahun (return ekspektasi lebih tinggi sebagai kompensasi karena danamu terkunci lebih lama dan berisiko). Inilah inti <em>trade-off</em> likuiditas vs return.</p>
      </div>

      <h2 id="bursa-otc">Bursa (Exchange) vs OTC</h2>
      <p><strong>Definisi.</strong> <strong>Bursa</strong> (<em>exchange</em>) = pasar terorganisir dengan aturan baku, harga transparan, dan kliring terpusat. Contoh: IDX untuk saham. <strong>OTC</strong> (<em>over-the-counter</em>) = transaksi bilateral langsung antar pihak (biasanya via dealer/bank), tanpa bursa terpusat. Contoh: sebagian besar perdagangan obligasi korporasi dan valas antar bank.</p>
      <p><strong>Kepribadian:</strong> bursa itu <em>supermarket</em> — harga terpampang, semua orang lihat harga sama. OTC itu <em>pasar negosiasi</em> — harga tergantung siapa lawan bicaramu dan seberapa besar transaksimu.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;OTC itu pasar gelap/ilegal.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> OTC = <em>over-the-counter</em>, artinya di luar bursa — <strong>bukan</strong> ilegal. Pasar obligasi dan valas antar bank di seluruh dunia mayoritas OTC dan sepenuhnya legal. Risikonya bukan legalitas, melainkan <strong>transparansi harga lebih rendah</strong> dan <strong>risiko lawan transaksi</strong> (<em>counterparty risk</em>) karena tidak ada kliring terpusat.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kalau kamu investor ritel beli saham/ETF/reksa dana, kamu hampir selalu lewat <strong>bursa</strong> (via sekuritas). Kalau dengar &ldquo;harga obligasi&rdquo; tanpa bursa — itu harga indikatif dealer OTC, bisa beda antar bank. Selalu tanya: <em>harga ini dari bursa atau kuotasi dealer?</em></p>
      </div>

      <h2 id="pelaku">Para Pelaku: Siapa Bertemu Siapa</h2>
      <p>Pasar adalah pertemuan lima peran:</p>
      <ul>
        <li><strong>Emiten</strong> — perusahaan/pemerintah yang menerbitkan sekuritas untuk menghimpun dana (di pasar primer).</li>
        <li><strong>Investor</strong> — ritel (perorangan sepertimu) dan institusi (dana pensiun, asuransi, reksa dana, bank). Institusi mendominasi volume.</li>
        <li><strong>Broker / perusahaan sekuritas</strong> — perantara yang mengeksekusi pesananmu di bursa (misal aplikasi sekuritas di HP-mu).</li>
        <li><strong>Dealer / market maker</strong> — pihak yang selalu siap beli dan jual (pasang harga bid &amp; ask) agar pasar tetap likuid.</li>
        <li><strong>Underwriter</strong> — (di primer) penjamin emisi yang membantu emiten IPO/rights issue.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> sebagai investor ritel, kamu hampir tidak pernah bertemu emiten langsung. Kamu bertemu <strong>broker</strong> (aplikasimu) dan <strong>market maker</strong> (yang diam-diam memastikan pesananmu selalu ada lawan). Pahami siapa mengambil untung dari tiap langkah — fee broker, spread market maker — karena itu <em>biaya</em> yang menggerogoti return-mu (lihat Lab 2).</p>
      </div>

      <h2 id="regulator">Regulator Indonesia: Wasitnya Siapa?</h2>
      <p>Pasar butuh wasit agar tidak jadi rimba. Di Indonesia:</p>
      <ul>
        <li><strong>OJK</strong> (Otoritas Jasa Keuangan) — mengawasi pasar modal, perbankan, dan IKNB; melindungi konsumen keuangan.</li>
        <li><strong>BI</strong> (Bank Indonesia) — otoritas moneter; mengatur pasar uang, nilai tukar, dan sistem pembayaran.</li>
        <li><strong>Bappebti</strong> — mengawasi perdagangan berjangka komoditi dan aset kripto.</li>
        <li><strong>LPS</strong> (Lembaga Penjamin Simpanan) — menjamin simpanan nasabah bank sampai batas tertentu.</li>
        <li><strong>KSEI / KPEI</strong> — kustodian sentral &amp; kliring penjaminan: memastikan settlement transaksimu beres (uang vs efek tertukar dengan benar).</li>
      </ul>
      <p>Detail tiap lembaga dibahas mendalam di <strong>E15 (Konteks Indonesia)</strong> — lesson ini cukup ingat: <em>OJK = pasar modal &amp; perlindungan investor, BI = moneter &amp; pasar uang</em>.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Ke Mana Uang IPO Mengalir</h2>
      <p>Ubah angka-angkanya: naikkan fee underwriter, atau ubah harga sekunder. Perhatikan baris terakhir — jawaban atas cerita pembuka.</p>
      <PyodideLab
        title="Lab 1 — Aliran Dana IPO vs Transaksi Sekunder"
        hint="Coba: fee_underwriter_pct = 0.07 (IPO kecil fee-nya lebih mahal). Lalu ubah harga_sekunder — apakah dana ke perusahaan ikut berubah?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Biaya Tersembunyi Bid-Ask Spread</h2>
      <p>Setiap kali kamu beli lalu jual, spread bid-ask memakan return-mu. Lab ini mengukurnya.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Biaya Bid-Ask Spread"
        hint="Coba saham tidak likuid: bid=1400, ask=1600. Bandingkan biaya round-trip-nya dengan saham likuid. Spread = pajak likuiditas."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Uangmu Mau ke Mana?</h2>

      <div className="decision-card">
        <h3>1. Perusahaan butuh modal ekspansi → <strong>Pasar Primer</strong></h3>
        <p><strong>Kondisi:</strong> butuh dana segar masuk ke kas perusahaan.</p>
        <p><strong>Kenapa:</strong> hanya pasar primer (IPO, rights issue, penerbitan obligasi) yang menyalurkan uang investor ke emiten. Beli saham di bursa tidak menambah kas perusahaan.</p>
        <p><strong>Contoh nyata:</strong> startup unicorn IPO di IDX; pemerintah lelang SBN untuk APBN.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dana nganggur 3 bulan, tidak boleh berkurang → <strong>Pasar Uang</strong></h3>
        <p><strong>Kondisi:</strong> horizon pendek, toleransi rugi nol.</p>
        <p><strong>Kenapa:</strong> deposito/SRBI jatuh tempo &le; 1 tahun, nilai pokok stabil. Pasar modal terlalu bergejolak untuk horizon 3 bulan.</p>
        <p><strong>Contoh nyata:</strong> kas perusahaan diparkir di deposito; dana darurat di reksa dana pasar uang.</p>
      </div>

      <div className="decision-card">
        <h3>3. Ingin bisa jual kapan saja dengan harga transparan → <strong>Bursa (Exchange)</strong></h3>
        <p><strong>Kondisi:</strong> butuh likuiditas dan kepastian harga.</p>
        <p><strong>Kenapa:</strong> bursa punya harga kuotasi publik + kliring terpusat. OTC cocok untuk institusi besar dengan kebutuhan khusus, bukan ritel.</p>
        <p><strong>Contoh nyata:</strong> beli saham/ETF blue chip di IDX via sekuritas.</p>
      </div>

      <div className="decision-card">
        <h3>4. Dana pensiun 20 tahun lagi → <strong>Pasar Modal</strong></h3>
        <p><strong>Kondisi:</strong> horizon panjang, bisa tahan volatilitas.</p>
        <p><strong>Kenapa:</strong> horizon panjang memberi waktu memulihkan penurunan sementara; ekspektasi return pasar modal lebih tinggi sebagai kompensasi risiko.</p>
        <p><strong>Contoh nyata:</strong> dana pensiun (DPLK) mayoritas di saham &amp; obligasi tenor panjang.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Uang ke siapa?</strong> Ke emiten = primer. Antar investor = sekunder.</li>
          <li><strong>Kapan butuh uangnya?</strong> &lt; 1 tahun = pasar uang. &gt; 5 tahun = pasar modal.</li>
          <li><strong>Butuh jual cepat &amp; harga jelas?</strong> Pilih instrumen bursa yang likuid; waspadai spread di OTC.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Startup Mau IPO</h2>
      <div className="callout">
        <p>Startup logistik &ldquo;KilatKilat&rdquo; butuh Rp500 miliar untuk ekspansi gudang. Opsi A: IPO di IDX (fee underwriter 5%, proses 6–9 bulan, laporan keuangan harus diaudit &amp; transparan). Opsi B: pinjam ke 3 bank via negosiasi bilateral (bunga 9%/tahun, proses 2 bulan, tanpa keterbukaan publik).</p>
        <p><strong>Pertanyaan:</strong> (a) Opsi mana yang termasuk pasar primer, dan opsi mana yang mirip mekanisme OTC? (b) Jika KilatKilat memilih IPO lalu 2 tahun kemudian harga sahamnya naik 3× lipat, berapa tambahan kas yang diterima perusahaan dari kenaikan itu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>IPO = pasar primer</strong> (sekuritas diterbitkan pertama kali, dana ke emiten). Pinjaman bank bilateral = <strong>mirip OTC</strong> — negosiasi langsung antar dua pihak tanpa bursa terpusat (bedanya ini pasar kredit, bukan pasar sekuritas).</p>
          <p>(b) <strong>Rp0.</strong> Kenaikan harga di pasar sekunder tidak menambah kas perusahaan. Manfaatnya tidak langsung: valuasi tinggi memudahkan <em>rights issue</em> berikutnya dan menurunkan biaya modal.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Rights Issue — Uang ke Perusahaan, Harga ke Pasar</h2>
      <p>PT MajuMundur butuh <strong>Rp200 miliar</strong> untuk pabrik baru. Saat ini ada <strong>1 miliar lembar</strong> beredar @ Rp1.000 (market cap Rp1 triliun). Direksi memilih <em>rights issue</em>: menerbitkan <strong>250 juta lembar baru @ Rp800</strong> (diskon 20% dari harga pasar) yang ditawarkan dulu ke pemegang saham lama.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Dana yang masuk ke perusahaan (pasar primer):</strong></p>
        <p>250.000.000 lembar &times; Rp800 = <strong>Rp200 miliar</strong>. Inilah uang segar yang benar-benar masuk kas MajuMundur — persis seperti IPO di cerita pembuka.</p>
        <p><strong>Langkah 2 — Harga teoretis setelah rights issue (TERP):</strong></p>
        <p>Nilai total perusahaan = (1.000.000.000 &times; 1.000) + (250.000.000 &times; 800) = Rp1.000 M + Rp200 M = <strong>Rp1.200 miliar</strong>.</p>
        <p>Total lembar baru = 1.250.000.000. Harga wajar per lembar = 1.200 M &divide; 1.250 jt = <strong>Rp960</strong>.</p>
        <p><strong>Langkah 3 — Nasib pemegang lama yang TIDAK ikut menebus:</strong></p>
        <p>Harga pasar akan menyesuaikan ke ~Rp960. Lembar yang kemarin Rp1.000 kini bernilai Rp960 — <strong>turun 4%</strong>. Inilah <em>dilusi</em>: &ldquo;diskon&rdquo; rights issue bukan hadiah gratis; ia dibayar oleh pemegang lama yang tidak ikut.</p>
        <p><strong>Kesimpulan:</strong> rights issue = pasar primer (uang ke emiten Rp200 M), tapi konsekuensinya dirasakan di pasar sekunder (harga menyesuaikan ke Rp960). Dua pasar, satu peristiwa — saling terhubung.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Biaya Total Sekali &ldquo;Beli Lalu Jual&rdquo;</h2>
      <p>Kamu beli <strong>10 lot</strong> (1.000 lembar) saham MAJU @ Rp1.500, lalu menjualnya seminggu kemudian @ Rp1.560. Untung kotor = (1.560 − 1.500) &times; 1.000 = <strong>Rp60.000</strong> (+4%). Tapi berapa yang benar-benar masuk kantong?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai transaksi:</strong> beli = 1.000 &times; 1.500 = Rp1.500.000. Jual = 1.000 &times; 1.560 = Rp1.560.000.</p>
        <p><strong>Langkah 2 — Fee broker</strong> (asumsi sekuritas ritel: 0,15% beli, 0,25% jual): beli = 0,0015 &times; 1.500.000 = <strong>Rp2.250</strong>; jual = 0,0025 &times; 1.560.000 = <strong>Rp3.900</strong>.</p>
        <p><strong>Langkah 3 — Biaya spread</strong> (dari Lab 2): misal spread Rp20/lembar &rarr; 20 &times; 1.000 = <strong>Rp20.000</strong> &ldquo;pajak likuiditas&rdquo; yang tak terlihat.</p>
        <p><strong>Langkah 4 — Untung bersih:</strong> 60.000 − 2.250 − 3.900 − 20.000 = <strong>Rp33.850</strong> (+2,26%, bukan +4%).</p>
        <p><strong>Intuisi:</strong> hampir <strong>separuh</strong> keuntungan kotor habis untuk biaya! Inilah kenapa <em>trading</em> sering-sering (apalagi saham tidak likuid dengan spread lebar) seperti berlari di <em>treadmill</em> yang miring melawanmu — broker dan market maker selalu dapat bagian duluan.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Flash Crash — Saat Pasar Sekunder &ldquo;Rusak&rdquo; 36 Menit</h2>
      <p><strong>6 Mei 2010, 14:42 waktu New York.</strong> Indeks Dow Jones yang pagi itu tenang tiba-tiba terjun <strong>hampir 9% dalam hitungan menit</strong> — sekitar US$1 triliun nilai pasar menguap — lalu pulih kembali sebelum penutupan. Tidak ada perang, tidak ada berita ekonomi. Perusahaan-perusahaan yang &ldquo;jatuh&rdquo; itu pabriknya tetap berdiri, karyawannya tetap bekerja.</p>
      <p>Investigasi kemudian menunjukkan penyebabnya ada di <strong>dapur pasar sekunder</strong>: kombinasi order jual algoritmik raksasa dan <em>high-frequency traders</em> yang serentak menarik kuotasi beli mereka. <em>Order book</em> — daftar antrean pembeli-penjual — mendadak kosong. Tanpa pembeli, harga <em>print</em> berikutnya bisa jatuh ke level absurd (saham Accenture sempat tercatat US$0,01!).</p>
      <p><strong>Pelajaran untuk lesson ini:</strong></p>
      <ul>
        <li><strong>Harga sekunder = fungsi likuiditas, bukan cuma fundamental.</strong> Nilai &ldquo;wajar&rdquo; perusahaan tidak berubah 9% dalam 10 menit — yang berubah adalah ketersediaan lawan transaksi.</li>
        <li><strong>Regulator merespons dengan <em>circuit breaker</em>.</strong> IDX punya versi lokalnya: <strong>auto rejection</strong> — batas ARA (naik) / ARB (turun) per hari — plus penghentian sementara (<em>trading halt</em>) saat IHSG anjlok tajam. Tujuannya: memberi waktu bagi likuiditas untuk kembali.</li>
        <li><strong>Implikasi praktis:</strong> jangan pasang order pasar (<em>market order</em>) buta saat volatilitas ekstrem; gunakan <em>limit order</em> agar kamu tidak &ldquo;dibeli&rdquo; di harga absurd oleh pasar yang sedang panik.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bursa modern punya dua &ldquo;mode&rdquo;: <em>lelang pembukaan/penutupan</em> (semua order dikumpulkan, satu harga kliring — dipakai IDX sesi pre-opening) dan <em>perdagangan kontinu</em> (tawar-menawar tiap detik). Harga pembukaan saham favoritmu tiap pagi = hasil lelang, bukan hasil satu transaksi iseng.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volume transaksi besar = sahamnya bagus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> volume besar hanya berarti <em>banyak yang pindah tangan</em> — bisa karena kabar baik, bisa karena <em>distribusi</em> (pemegang besar diam-diam menjual ke ritel yang euforia), bahkan bisa <em>wash trading</em> (transaksi semu). Selalu tanya: <em>siapa yang menjual ke siapa, dan kenapa?</em> Volume tanpa konteks arah &amp; pelaku = angka kosong.</p>
      </div>


      <h2 id="worked3">🔬 Worked Example 3: Order Besarmu &ldquo;Memakan&rdquo; Order Book</h2>
      <p>Lihat papan order (<em>order book</em>) saham MAJU pagi ini:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th></th><th>Harga (Rp)</th><th>Volume (lembar)</th></tr></thead>
        <tbody>
          <tr><td><strong>Ask 3</strong> (jual)</td><td>1.505</td><td>1.000</td></tr>
          <tr><td><strong>Ask 2</strong></td><td>1.502</td><td>400</td></tr>
          <tr><td><strong>Ask 1</strong> (termurah)</td><td>1.501</td><td>300</td></tr>
          <tr><td colSpan={3} style={{ textAlign: "center" }}><em>— spread Rp1 —</em></td></tr>
          <tr><td><strong>Bid 1</strong> (termahal)</td><td>1.500</td><td>200</td></tr>
          <tr><td><strong>Bid 2</strong></td><td>1.499</td><td>500</td></tr>
          <tr><td><strong>Bid 3</strong></td><td>1.498</td><td>800</td></tr>
        </tbody>
      </table>
      </div>
      <p>Kamu tidak sabar dan menghantam tombol <strong>beli 1.000 lembar @ harga pasar</strong> (<em>market order</em>). Berapa harga rata-rata yang kamu dapat?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — &ldquo;Makan&rdquo; dari Ask termurah ke atas:</strong> 300 lbr @ 1.501 (Ask 1 habis) &rarr; 400 lbr @ 1.502 (Ask 2 habis) &rarr; masih kurang 300 lbr &rarr; 300 lbr @ 1.505 (Ask 3).</p>
        <p><strong>Langkah 2 — Total bayar:</strong> (300 &times; 1.501) + (400 &times; 1.502) + (300 &times; 1.505) = 450.300 + 600.800 + 451.500 = <strong>Rp1.502.600</strong>.</p>
        <p><strong>Langkah 3 — Harga rata-rata:</strong> 1.502.600 &divide; 1.000 = <strong>Rp1.502,6/lembar</strong>.</p>
        <p><strong>Analisis:</strong> harga kuotasi Ask yang kamu lihat = Rp1.501, tapi kamu membayar Rp1.502,6 — <strong>slippage Rp1,6/lembar</strong> (Rp1.600 total). Di saham likuid dengan book tebal, slippage ini ~nol. Di saham sepi (book tipis), market order 1.000 lembar bisa menggerakkan harga <strong>5–10%</strong> — dan <em>kamu sendiri</em> yang menggerakkannya melawan dirimu.</p>
        <p><strong>Intuisi:</strong> <em>market impact</em> = pajak ukuran. Institusi besar memecah order raksasa jadi ratusan order kecil (algoritma <em>TWAP/VWAP</em>) justru untuk menghindari &ldquo;memakan&rdquo; book seperti ini. Sebagai ritel: <strong>selalu pakai <em>limit order</em></strong> — tentukan harga maksimum yang rela kamu bayar, jangan serahkan ke pasar.</p>
      </details>

      <h2 id="mikro">🔧 Pendalaman: Fraksi Harga &amp; Auto Rejection — Aturan Main IDX</h2>
      <p>Bursa bukan rimba bebas — ia punya &ldquo;peraturan lalu lintas&rdquo; yang membentuk perilaku harga yang kamu lihat tiap hari:</p>
      <ul>
        <li><strong>Fraksi harga (<em>tick size</em>):</strong> kenaikan harga minimum antar antrean. IDX memakai fraksi berjenjang berdasar rentang harga — misal saham di bawah Rp200 bergerak per Rp1, Rp200–500 per Rp2, Rp500–2.000 per Rp5, Rp2.000–5.000 per Rp10, di atas Rp5.000 per Rp25. <em>Kenapa penting?</em> Fraksi = &ldquo;resolusi&rdquo; tawar-menawar: makin kecil fraksi, makin ketat spread bisa ditekan, makin murah biaya trading (lihat Lab 2).</li>
        <li><strong>Auto rejection (ARA/ARB):</strong> batas persentase kenaikan/penurunan harian — order di luar batas <em>ditolak sistem</em>. Tujuannya persis pelajaran Flash Crash: memberi jeda saat pasar panik agar likuiditas sempat kembali. Konsekuensinya: saham bisa &ldquo;antre ARB&rdquo; — mau jual tapi tidak ada pembeli di batas bawah (likuiditas hilang total).</li>
        <li><strong>1 lot = 100 lembar:</strong> satuan minimum transaksi. Saham Rp50/lembar = Rp5.000 per lot — &ldquo;murah&rdquo; secara nominal, tapi itu tidak mengatakan apa-apa soal valuasi (lihat E6).</li>
        <li><strong>Sesi pre-opening:</strong> 15 menit sebelum perdagangan kontinu, order dikumpulkan lalu dieksekusi pada <em>satu harga kliring</em> (lelang). Harga pembukaan yang kamu lihat = hasil lelang ini, bukan satu transaksi.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> gabungkan semuanya: harga saham yang kamu lihat = <strong>hasil lelang kontinu yang dibatasi fraksi, dipagari auto-rejection, dan digerakkan oleh kedalaman book</strong>. &ldquo;Harga pasar&rdquo; bukan entitas mistis — ia adalah artefak dari <em>aturan main</em> ini. Trader profesional tidak &ldquo;menebak harga&rdquo;; mereka membaca struktur di baliknya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Harga terakhir di aplikasi = nilai wajar saham.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> harga terakhir (<em>last price</em>) bisa berasal dari transaksi <strong>1 lot kecil</strong> di pasar yang sepi — satu orang iseng beli 100 lembar bisa &ldquo;mencetak&rdquo; harga baru. Nilai yang lebih jujur = <strong>mid-price</strong> (tengah bid-ask) <em>plus</em> melihat kedalaman book. Saham yang &ldquo;naik 5%&rdquo; dengan volume 2 lot = ilusi; yang naik 5% dengan book tebal dua sisi = sinyal.</p>
      </div>


      <h2 id="bookbuilding">🔧 Pendalaman: Bookbuilding — Dari Mana Harga IPO Rp1.000 Itu Muncul?</h2>
      <p>Cerita pembuka menyebut &ldquo;IPO @ Rp1.000&rdquo; seolah harga itu jatuh dari langit. Tidak — ia <strong>dilelang</strong> lewat <em>bookbuilding</em>:</p>
      <ol>
        <li><strong>Rentang awal:</strong> underwriter + emiten menetapkan kisaran indikatif, misal Rp900–1.100, berdasar valuasi pembanding (<em>comparables</em> — P/E emiten sejenis, E6!) dan permintaan pasar.</li>
        <li><strong>Masa penawaran:</strong> investor institusi memasukkan <em>bid</em>: &ldquo;kami mau 5 juta lembar @ Rp1.050&rdquo;. Semua bid dikumpulkan dalam &ldquo;buku&rdquo; (<em>book</em>).</li>
        <li><strong>Penetapan harga:</strong> underwriter memilih harga yang <strong>membersihkan pasar</strong> — permintaan ≈ penawaran. Jika book <em>oversubscribed</em> 10× di Rp1.000, harga final bisa dinaikkan; jika sepi, diturunkan atau IPO ditunda.</li>
        <li><strong>Alokasi:</strong> saat oversubscribed, tidak semua bid terpenuhi — institusi besar &amp; &ldquo;teman&rdquo; underwriter biasanya dapat jatah lebih (sumber konflik kepentingan klasik!).</li>
      </ol>
      <p><strong>Fenomena underpricing:</strong> rata-rata global, saham IPO <strong>naik ~15–20% di hari pertama</strong> — artinya harga IPO &ldquo;kemurahan&rdquo;. Kenapa underwriter tidak mematok lebih tinggi saja?</p>
      <ul>
        <li><strong>Asimetri informasi:</strong> investor takut &ldquo;barang busuk&rdquo; (<em>winner&apos;s curse</em>) — hanya mau ikut jika ada &ldquo;diskon&rdquo; sebagai kompensasi ketidaktahuan.</li>
        <li><strong>Insentif underwriter:</strong> IPO yang &ldquo;sukses&rdquo; (naik hari pertama) = reputasi underwriter bagus = klien berikutnya antre. Underwriter <strong>diberi insentif</strong> untuk underprice — dengan uang <em>emiten</em> (yang &ldquo;kehilangan&rdquo; dana yang bisa dihimpun)!</li>
        <li><strong>Stabilisasi:</strong> underwriter boleh menopang harga pasca-IPO (<em>greenshoe option</em>) — &ldquo;jangkar&rdquo; artifisial 30 hari pertama.</li>
      </ul>
      <h2 id="worked4">🔬 Worked Example: Alokasi IPO — Kenapa Ritel Dapat Remah-Remah?</h2>
      <p>IPO MajuMundur: 100 juta lembar @ Rp1.000. Bookbuilding: institusi memesan <strong>800 juta lembar</strong>, ritel memesan <strong>50 juta lembar</strong>. Jatah ritel (<em>pooling</em>): <strong>10 juta lembar</strong>.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Oversubscription institusi:</strong> 800 ÷ 90 (jatah institusi 90 jt) = <strong>8,9×</strong>. Ritel: 50 ÷ 10 = <strong>5×</strong>.</p>
        <p><strong>Alokasi:</strong> tiap pemesan institusi rata-rata dapat 1/8,9 = <strong>11%</strong> pesanannya; ritel dapat 1/5 = <strong>20%</strong> — terlihat ritel &ldquo;menang&rdquo;, tapi…</p>
        <p><strong>Hari pertama: harga melonjak ke Rp1.300 (+30%).</strong> Ritel yang memesan Rp10 juta (10.000 lembar) hanya dapat 2.000 lembar &rarr; untung Rp600 ribu — bukan Rp3 juta yang dibayangkan. <strong>Oversubscription = jatahmu disunat proporsional.</strong></p>
        <p><strong>Intuisi:</strong> &ldquo;IPO pasti cuan&rdquo; mengabaikan <strong>alokasi</strong>: makin ramai peminat, makin kecil jatahmu, makin kecil cuan absolutmu — sementara <em>risiko</em> (uang mengendap saat penjatahan, harga bisa juga <em>turun</em> di bawah IPO!) tetap penuh. Hitung <em>expected value</em> dengan jatah realistis, bukan dengan fantasi &ldquo;dapat full lalu naik 30%&rdquo;.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IPO = pasti untung karena underpricing.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>rata-rata</em> underpricing ≠ <em>setiap</em> IPO untung. Banyak IPO <strong>jatuh di bawah harga IPO</strong> dalam setahun (terutama yang valuasinya dipompa <em>hype</em>). Ditambah: ritel dapat jatah kecil saat IPO bagus (oversubscribed) dan jatah <em>penuh</em> saat IPO sepi (yang sepi = yang kurang diminati = yang berisiko!). Seleksi adverse ini = <strong>ritel sistematis dapat bagian terburuk dari kedua dunia</strong>. Ikut IPO karena analisis emitennya — bukan karena &ldquo;IPO = cuan&rdquo;.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Peta Pasar (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Ani membeli saham di bursa dari Budi (bukan saat IPO). Siapa yang menerima uang Ani?"
        options={[
          "Perusahaan penerbit saham",
          "Budi, penjual sahamnya",
          "Bursa Efek Indonesia",
          "OJK sebagai regulator",
        ]}
        correct={1}
        explanation="Benar: Budi. Ini transaksi pasar SEKUNDER — uang berpindah antar investor. Perusahaan hanya menerima dana di pasar primer (IPO/rights issue)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Deposito 6 bulan termasuk…"
        options={[
          "Pasar modal, karena lewat bank",
          "Pasar uang, karena tenor ≤ 1 tahun",
          "Pasar valuta asing",
          "Pasar primer saham",
        ]}
        correct={1}
        explanation="Benar: pasar uang. Pembedanya tenor, bukan institusinya: ≤ 1 tahun = pasar uang. Jangan tertukar dengan pasar valas (jual-beli mata uang asing)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Perdagangan obligasi korporasi antar bank yang dinegosiasikan langsung tanpa bursa disebut…"
        options={[
          "Perdagangan ilegal",
          "OTC (over-the-counter)",
          "IPO",
          "Rights issue",
        ]}
        correct={1}
        explanation="Benar: OTC. Sepenuhnya legal — hanya berarti di luar bursa terpusat. Konsekuensinya: harga kurang transparan dan ada risiko counterparty."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Di Indonesia, lembaga yang mengawasi pasar modal dan melindungi investor adalah…"
        options={[
          "Bank Indonesia",
          "Bappebti",
          "OJK",
          "LPS",
        ]}
        correct={2}
        explanation="Benar: OJK. BI = moneter & pasar uang; Bappebti = berjangka komoditi & kripto; LPS = penjamin simpanan bank."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa pasar sekunder yang likuid penting bagi pasar primer?"
        options={[
          "Karena emiten dapat uang dari tiap transaksi sekunder",
          "Karena investor berani beli di IPO hanya jika yakin bisa menjual kembali dengan mudah",
          "Karena OJK mewajibkannya",
          "Tidak penting — keduanya tidak berhubungan",
        ]}
        correct={1}
        explanation="Benar: likuiditas sekunder = jaminan exit. Tanpa pasar loak yang ramai, tidak ada yang mau beli dari pabrik. Emiten tidak dapat uang dari sekunder, tapi sekunder yang hidup membuat primer bisa menghimpun dana."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Primer</strong> = uang ke emiten (IPO, rights issue, lelang SBN). <strong>Sekunder</strong> = uang antar investor (bursa harian).</li>
          <li><strong>Pasar uang</strong> = tenor ≤ 1 tahun (deposito, SRBI). <strong>Pasar modal</strong> = tenor &gt; 1 tahun (saham, obligasi).</li>
          <li><strong>Bursa</strong> = harga transparan + kliring terpusat. <strong>OTC</strong> = negosiasi bilateral, legal tapi kurang transparan.</li>
          <li>Pelaku: emiten, investor (ritel/institusi), broker, market maker, underwriter.</li>
          <li>Wasit Indonesia: <strong>OJK</strong> (pasar modal), <strong>BI</strong> (moneter/pasar uang), Bappebti, LPS, KSEI/KPEI.</li>
          <li>Beli saham di bursa ≠ memberi modal ke perusahaan — kecuali saat IPO/rights issue.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/e2-instrumen" className="btn btn-primary btn-sm">Next: E2 →</Link>
      </div>
    </div>
  );
}
