"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E5Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const spreadByRatingData = [
    {
      x: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"],
      y: [0.5, 0.8, 1.2, 1.8, 3.5, 6.0, 10.5],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#2a7de1", "#5b9bd5", "#e8a838", "#ef4444", "#991b1b"] },
      text: ["0,5%", "0,8%", "1,2%", "1,8%", "3,5%", "6,0%", "10,5%"],
      textposition: "outside",
    },
  ];

  const spreadWideningData = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      y: [1.8, 1.9, 2.1, 3.4, 5.2, 4.1],
      mode: "lines+markers",
      name: "Spread obligasi BBB (pp)",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      y: [72, 74, 71, 58, 44, 52],
      mode: "lines+markers",
      name: "Harga obligasi (Rp jt)",
      line: { color: "#2a7de1", width: 3 },
      yaxis: "y2",
    },
  ];

  const lab1Code = `# Lab 1 — Expected Loss: harga ketakutan dalam rupiah
# Obligasi korporasi Rp1 miliar. Rating BBB: PD 1 thn = 0,4%.
exposure = 1_000_000_000  # EAD
pd = 0.004                # 0,4% peluang default setahun
lgd = 0.45                # kalau default, 45% tidak kembali (recovery 55%)

el = pd * lgd * exposure
print(f"PD  = {pd*100:.1f}%   (peluang gagal bayar setahun)")
print(f"LGD = {lgd*100:.0f}%    (porsi yang hilang jika default)")
print(f"EAD = Rp{exposure/1e9:.0f} M")
print(f"EL  = Rp{el:,.0f} per tahun")
print()
print("Artinya: secara statistik kamu 'membayar' Rp1,8 jt/tahun untuk risiko ini.")
print("Spread obligasi HARUS lebih besar dari ini — sisanya = premi risiko.")
print()
print("Coba: pd = 0.05 (rating B). Berapa EL-nya sekarang?")`;

  const lab2Code = `# Lab 2 — Spread vs PD: kapan spread 'kemahalan'?
# Spread pasar 3,5% untuk obligasi BB. Apakah itu wajar?
spread_pasar = 0.035
lgd = 0.45

# Spread aproksimasi = PD x LGD  ->  PD tersirat = spread / LGD
pd_tersirat = spread_pasar / lgd
print(f"Spread pasar : {spread_pasar*100:.1f}%")
print(f"PD tersirat  : {pd_tersirat*100:.1f}% per tahun")
print()
pd_analis = 0.04  # analis kamu: PD sebenarnya cuma 4%
if pd_analis < pd_tersirat:
    print(f"Analis bilang PD cuma {pd_analis*100:.0f}% < {pd_tersirat*100:.1f}% tersirat.")
    print("-> Spread 'kemahalan' = peluang BELI (kompensasi > risiko).")
else:
    print("-> Spread kemurahan = JUAL/hindari.")
print()
print("Coba: spread_pasar = 0.06. Bagaimana kesimpulannya?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E5 — Financial Markets</span>
        <h1 className="display-title">Credit Spread:<br />Harga Sebuah Ketakutan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kupon Sama, Harga Beda</a></li>
          <li><a href="#spread">Credit Spread — Premi Ketakutan</a></li>
          <li><a href="#rating">Rating — Rapor Kredit</a></li>
          <li><a href="#eld">PD, LGD, EAD — Tiga Huruf Penentu Rugi</a></li>
          <li><a href="#el">Expected Loss — Rumus Satu Baris</a></li>
          <li><a href="#lab1">🔬 Lab 1: Menghitung Expected Loss</a></li>
          <li><a href="#lab2">🔬 Lab 2: Membaca PD dari Spread Pasar</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Spread Mahal atau Murah?</a></li>
          <li><a href="#case">📋 Mini-Case: Obligasi Properti vs BUMN</a></li>
          <li><a href="#worked1">🔬 Worked Example: Menghitung Spread dari Dua Harga</a></li>
          <li><a href="#worked2">🔬 Worked Example: Spread → Probabilitas Gagal Bayar</a></li>
          <li><a href="#worked3">🔬 Worked Example: CDS — Harga Asuransi Gagal Bayar</a></li>
          <li><a href="#konteks">🌍 Konteks: Saat Spread Meledak — 1998 &amp; 2008</a></li>
          <li><a href="#tigakomponen">🔧 Pendalaman: Tiga Bahan dalam Satu Spread</a></li>
          <li><a href="#siklus">🔧 Pendalaman: Siklus Kredit — Spread sebagai Barometer Makro</a></li>
          <li><a href="#worked4">🔬 Worked Example: Dampak Pelebaran Spread ke Portofolio</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan credit spread sebagai kompensasi risiko gagal bayar di atas yield bebas risiko.</li>
          <li>Membaca skala rating (termasuk Pefindo di Indonesia) dan batas investment grade vs junk.</li>
          <li>Mendefinisikan PD, LGD, EAD beserta satuannya dan menghitung Expected Loss.</li>
          <li>Menilai apakah spread pasar &ldquo;kemahalan&rdquo; atau &ldquo;kemurahan&rdquo; relatif terhadap risiko.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kupon Sama, Harga Beda</h2>
      <div className="story">
        <p>Dua obligasi 5 tahun, kupon sama-sama 8%, nominal Rp100 juta. Obligasi <strong>BUMN</strong> laku Rp102 juta. Obligasi <strong>perusahaan properti</strong> laku cuma Rp91 juta. Kuponnya identik — kenapa pasar menghargai yang satu Rp11 juta lebih murah?</p>
        <p>Jawabannya satu kata: <strong>ketakutan</strong>. Pasar takut perusahaan properti <em>gagal bayar</em>, jadi menuntut <strong>yield lebih tinggi</strong> sebagai kompensasi — yang artinya harga lebih rendah. Selisih yield itu punya nama: <strong>credit spread</strong>. Lesson ini mengajari cara mengukur ketakutan itu dalam angka — persis seperti yang dilakukan analis risiko kredit di bank (dan ini fondasi Track 1: Credit Risk).</p>
        <p><strong>Twist-nya:</strong> kedua obligasi menjanjikan <em>teks yang sama persis</em> — kupon 8%, 5 tahun. Tapi pasar memangkas Rp11 juta dari satu di antaranya. Selisih itu bukan &ldquo;diskon acak&rdquo;: ia adalah <strong>harga dari ketakutan yang diukur dengan presisi basis poin</strong> — ketakutan yang bisa kamu hitung, pantau pergerakannya, dan jadikan sinyal. Analis kredit profesional tidak membaca perasaan pasar; mereka membaca <strong>angka ketakutan</strong> ini setiap pagi. Lesson ini memberimu kacamatanya.</p>
      </div>

      <h2 id="spread">Credit Spread — Premi Ketakutan</h2>
      <p><strong>Definisi.</strong> <em>Credit spread</em> = selisih yield obligasi berisiko dengan yield obligasi <strong>bebas risiko</strong> (<em>risk-free</em>, biasanya SBN) bertenor sama:</p>
      <Tex math={String.raw`s = y_{\text{korporasi}} - y_{\text{SBN}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`s`} /> = spread (dalam persen atau <em>basis points</em>; 1% = 100 bps); <Tex math={String.raw`y_{\text{korporasi}}`} /> = YTM obligasi perusahaan; <Tex math={String.raw`y_{\text{SBN}}`} /> = YTM SBN tenor setara.</p>
      <p><strong>Contoh:</strong> obligasi properti YTM 11%, SBN 5 thn YTM 6,5% → spread = <strong>450 bps</strong> (4,5%). Angka 4,5% inilah &ldquo;harga ketakutan&rdquo; pasar per tahun.</p>
      <p><strong>Kepribadian spread:</strong> dia <em>termometer panik pasar</em>. Ekonomi tenang → spread menyempit (semua berani ambil risiko). Krisis datang → spread <strong>melebar</strong> (semua lari ke SBN). Manajer risiko memelototi spread setiap pagi — pelebaran mendadak = sirene.</p>
      <p><strong>Kapan dipakai:</strong> menilai mahal/murahnya obligasi korporasi; sinyal awal stres pasar kredit.</p>

      <PlotlyChart
        data={spreadWideningData}
        title="Saat Panik: Spread Melebar, Harga Jatuh (ilustratif)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Spread (pp)" }, yaxis2: { title: "Harga (Rp jt)", overlaying: "y", side: "right" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = spread (sumbu kiri), garis biru = harga obligasi (sumbu kanan). Maret–Mei: ada kabar buruk.</p>
        <p><strong>Interpretasi:</strong> saat ketakutan naik (Maret–Mei), spread <strong>melebar</strong> dari 2,1 ke 5,2 pp dan harga <strong>jatuh</strong> dari 71 ke 44 — lalu pulih sebagian saat panik reda. Inilah mengapa obligasi korporasi bisa rugi besar <em>tanpa</em> ada default: <strong>risiko spread</strong> (<em>mark-to-market</em>) menghantam duluan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> spread punya dua komponen: <strong>expected loss</strong> (kompensasi statistik, bisa dihitung — lihat di bawah) + <strong>premi risiko</strong> (kompensasi ketakutan/ketidakpastian, tidak bisa dihitung pasti). Spread 4,5% dengan expected loss 1,8% → premi risiko 2,7%. Investor dibayar untuk <em>menahan ketakutan</em> — bukan cuma menanggung statistik.</p>
      </div>

      <h2 id="rating">Rating — Rapor Kredit</h2>
      <p><strong>Definisi.</strong> <em>Rating</em> = opini lembaga pemeringkat tentang kemampuan membayar penerbit. Skala global (S&amp;P/Moody&rsquo;s/Fitch): <strong>AAA → AA → A → BBB → BB → B → CCC → D</strong> (default). Di Indonesia ada <strong>Pefindo</strong> dengan skala nasional <Tex math={String.raw`idAAA`} /> s.d. <Tex math={String.raw`idD`} />.</p>
      <p><strong>Garis demarkasi terpenting:</strong> <strong>BBB− / idBBB− ke atas</strong> = <em>investment grade</em> (layak investasi); <strong>di bawahnya</strong> = <em>junk / high yield</em> (spekulatif). Banyak dana pensiun &amp; asuransi <strong>dilarang</strong> memegang junk — sehingga penurunan rating menembus batas ini (<em>fallen angel</em>) memicu aksi jual paksa dan harga anjlok.</p>
      <p><strong>Kepribadian rating:</strong> dia <em>rapor yang telat</em> — berguna sebagai ringkasan, tapi sering <strong>terlambat</strong> menangkap pemburukan (kasus klasik: rating masih bagus sesaat sebelum krisis). Analis profesional memakai rating sebagai <em>titik awal</em>, bukan vonis akhir.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Rating AAA = tidak mungkin default.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AAA = peluang default <em>sangat kecil</em>, bukan nol. Sejarah mencatat emiten ber-rating tinggi yang akhirnya default. Rating = <strong>probabilitas</strong>, bukan jaminan. Selalu baca <em>outlook</em> (positif/stabil/negatif) — arah pergerakannya sama pentingnya dengan levelnya.</p>
      </div>

      <PlotlyChart
        data={spreadByRatingData}
        title="Makin Jelek Rating, Makin Mahal Ketakutannya (spread ilustratif)"
        layout={{ xaxis: { title: "Rating" }, yaxis: { title: "Spread (pp)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = rata-rata spread untuk rating tersebut. Warna biru = investment grade, kuning–merah = junk.</p>
        <p><strong>Interpretasi:</strong> hubungannya <strong>tidak linear</strong> — dari BBB ke BB spread hampir <em>dobel</em> (1,8 → 3,5), dari B ke CCC hampir dobel lagi. Inilah &ldquo;tebing&rdquo; (<em>cliff</em>) di batas investment grade: sekali jatuh ke junk, biaya pendanaan melonjak. Perusahaan berjuang mati-matian mempertahankan BBB− bukan tanpa alasan.</p>
      </div>

      <h2 id="eld">PD, LGD, EAD — Tiga Huruf Penentu Rugi</h2>
      <p>Tiga komponen untuk mengkuantifikasi risiko kredit — fondasi analisis risiko kredit (dan Track 1):</p>
      <ul>
        <li><strong>PD</strong> (<em>probability of default</em>): peluang penerbit gagal bayar dalam setahun. Satuan: persen. AAA ≈ 0,01%; CCC ≈ 5%+.</li>
        <li><strong>LGD</strong> (<em>loss given default</em>): <em>jika</em> default, berapa persen yang hilang (1 − <em>recovery rate</em>). Obligasi senior ≈ 40–60%; tergantung agunan &amp; senioritas (ingat waterfall E2!).</li>
        <li><strong>EAD</strong> (<em>exposure at default</em>): berapa rupiah yang berisiko saat default terjadi (untuk obligasi ≈ nilai nominal + kupon terutang).</li>
      </ul>
      <p><strong>Kepribadian ketiganya:</strong> PD = <em>&ldquo;seberapa sering petir menyambar&rdquo;</em>, LGD = <em>&ldquo;seberapa parah kalau tersambar&rdquo;</em>, EAD = <em>&ldquo;seberapa besar tubuhmu yang di lapangan&rdquo;</em>. Ketiganya harus dikalikan — salah satu nol, ruginya nol.</p>

      <h2 id="el">Expected Loss — Rumus Satu Baris</h2>
      <p><strong>Definisi.</strong> Kerugian yang <em>secara statistik diharapkan</em> per tahun:</p>
      <Tex math={String.raw`EL = PD \times LGD \times EAD`} block />
      <p><strong>Artinya tiap simbol:</strong> seperti di atas — peluang × keparahan × eksposur. Hasilnya dalam <strong>rupiah per tahun</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Obligasi Rp1 M, rating BBB (PD = 0,4%/tahun), LGD 45%:</p>
        <p><strong>Langkah 1</strong> — ubah ke desimal: PD = 0,004; LGD = 0,45.<br />
        <strong>Langkah 2</strong> — kalikan: EL = 0,004 × 0,45 × 1.000.000.000 = <strong>Rp1.800.000/tahun</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan spread: spread 1,8% × Rp1 M = Rp18 jt/tahun. Spread (Rp18 jt) &gt;&gt; EL (Rp1,8 jt) → selisih Rp16,2 jt = premi risiko + biaya lain. Wajar: pasar tidak memberi kompensasi <em>hanya</em> sebesar statistik.</p>
      </details>
      <p><strong>Kapan memakai:</strong> bank menghitung <strong>cadangan kerugian</strong> (CKPN/ECL di PSAK 71 memakai logika ini!); investor menilai apakah spread &ldquo;sepadan&rdquo;.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;EL kecil berarti obligasi ini aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> EL = <em>rata-rata</em> statistik — realisasinya <strong>biner</strong>: 0 (tidak default) atau LGD×EAD (default, rugi besar sekaligus). Seperti asuransi kebakaran: premi kecil, tapi kalau rumah terbakar ruginya total. EL untuk <em>pricing &amp; cadangan</em>; untuk <em>ketahanan</em> lihat skenario stres (E13).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Menghitung Expected Loss</h2>
      <p>Hitung &ldquo;harga ketakutan statistik&rdquo; untuk obligasi Rp1 miliar. Ubah rating (PD) dan rasakan bedanya.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Expected Loss"
        hint="Coba: pd = 0.002 (rating A) vs pd = 0.05 (rating B). Lalu ubah lgd = 0.7 (tanpa agunan). Mana yang lebih sensitif: PD atau LGD?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Membaca PD dari Spread Pasar</h2>
      <p>Balik logikanya: dari spread yang terlihat di pasar, tebak berapa PD yang &ldquo;ditakuti&rdquo; pasar — lalu bandingkan dengan analisismu.</p>
      <PyodideLab
        title="Lab 2 — PD Tersirat: Apa Kata Pasar?"
        hint="Coba: spread_pasar = 0.02 (pasar tenang). Lalu spread_pasar = 0.10 (pasar panik). Kapan pasar 'terlalu takut' = peluang bagi yang berani?"
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> rumus kasar yang dipakai trader: <strong>spread ≈ PD × LGD</strong>. Dari sini kamu bisa &ldquo;membaca pikiran pasar&rdquo;: spread 6% dengan LGD 50% → pasar menakuti PD 12%/tahun. Kalau analisismu bilang PD sebenarnya 4% → pasar <em>terlalu takut</em> → obligasi <em>murah</em>. Inilah inti kerja analis kredit: <strong>berbeda pendapat dengan pasar, dan benar</strong>.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Spread Mahal atau Murah?</h2>

      <div className="decision-card">
        <h3>1. Spread melebar tajam di semua emiten → <strong>Jangan panik jual; cek apakah sistemik</strong></h3>
        <p><strong>Kondisi:</strong> spread BBB, A, bahkan SBN ikut bergerak.</p>
        <p><strong>Kenapa:</strong> pelebaran merata = ketakutan <em>sistemik</em> (risiko pasar), bukan emitenmu memburuk. Menjual di puncak panik mengunci rugi.</p>
        <p><strong>Contoh nyata:</strong> Maret 2020 — spread global meledak, lalu pulih dalam bulanan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Spread SATU emiten melebar sendirian → <strong>Investigasi fundamental</strong></h3>
        <p><strong>Kondisi:</strong> hanya obligasi perusahaan X yang spread-nya melonjak.</p>
        <p><strong>Kenapa:</strong> pasar mencium sesuatu (laporan keuangan memburuk, rumor gagal bayar). Baca laporan keuangan &amp; cek rating outlook.</p>
        <p><strong>Contoh nyata:</strong> emiten properti dengan utang jatuh tempo besar &amp; penjualan lesu.</p>
      </div>

      <div className="decision-card">
        <h3>3. PD tersirat &lt; PD analisismu → <strong>Hindari / jual</strong></h3>
        <p><strong>Kondisi:</strong> pasar &ldquo;terlalu berani&rdquo; (spread tipis) padahal fundamental memburuk.</p>
        <p><strong>Kenapa:</strong> kompensasi tidak sepadan risiko. Pasar bisa salah — biasanya menjelang akhir siklus kredit.</p>
        <p><strong>Contoh nyata:</strong> obligasi high-yield dengan spread seperti investment grade di puncak bullish.</p>
      </div>

      <div className="decision-card">
        <h3>4. PD tersirat &gt; PD analisismu → <strong>Peluang beli (dengan ukuran posisi disiplin)</strong></h3>
        <p><strong>Kondisi:</strong> pasar &ldquo;terlalu takut&rdquo;; fundamental emiten sebenarnya solid.</p>
        <p><strong>Kenapa:</strong> kamu dibayar premi ketakutan berlebih. Tapi batasi posisi — analis bisa salah, dan <em>value trap</em> itu nyata.</p>
        <p><strong>Contoh nyata:</strong> obligasi BUMN yang ikut terdiskon saat panik pasar (flight-to-quality berlebihan).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Spread = harga ketakutan per tahun.</strong> Melebar = pasar takut.</li>
          <li><strong>EL = PD × LGD × EAD.</strong> Spread harus &gt; EL — sisanya premi risiko.</li>
          <li><strong>Spread ≈ PD × LGD</strong> → baca &ldquo;pikiran pasar&rdquo;, lalu tantang dengan analisismu.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Obligasi Properti vs BUMN</h2>
      <div className="callout">
        <p>Dana Rp500 juta, horizon 3 tahun. Opsi A: obligasi BUMN, YTM 7% (SBN 3 thn 6% → spread 100 bps), rating idAAA. Opsi B: obligasi properti, YTM 12% (spread 600 bps), rating idBBB dengan outlook negatif. Analis memperkirakan PD properti 3%/tahun, LGD 50%.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung EL tahunan obligasi properti. Apakah spread 600 bps &ldquo;sepadan&rdquo;? (b) Risiko apa yang belum tercakup dalam perbandingan YTM ini? (c) Untuk investor konservatif yang butuh kepastian, mana yang dipilih — dan kenapa?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) EL = 3% × 50% × Rp500 jt = <strong>Rp7,5 jt/tahun</strong> (1,5% dari pokok). Spread 6% = Rp30 jt/tahun &gt;&gt; EL Rp7,5 jt → secara statistik &ldquo;sepadan&rdquo;, bahkan murah. Tapi ingat: EL = rata-rata; realisasinya bisa Rp250 jt melayang sekaligus.</p>
          <p>(b) <strong>Risiko spread</strong> (harga bisa jatuh sebelum jatuh tempo jika outlook makin negatif), <strong>risiko likuiditas</strong> (obligasi BBB sulit dijual saat panik), dan <strong>ketidakpastian estimasi</strong> (PD 3% itu tebakan analis — bisa 8%!).</p>
          <p>(c) <strong>Obligasi BUMN.</strong> Bukan karena return-nya tertinggi, tapi karena <em>varians hasilnya</em> kecil dan tidurnya nyenyak. Prinsip: pilih instrumen sesuai <strong>toleransi risiko</strong>, bukan yang YTM-nya paling besar.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Dari Selisih Harga Rp11 Juta ke Spread Basis Poin</h2>
      <p>Data cerita pembuka: dua obligasi 5 tahun, kupon 8%/tahun, nominal Rp100 juta. Obligasi BUMN: harga <strong>Rp102 juta</strong>. Obligasi properti: harga <strong>Rp91 juta</strong>. Ubah selisih harga menjadi <em>credit spread</em> (dalam bps).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Yield obligasi BUMN:</strong> harga 102 (di atas par) &rarr; yield &lt; kupon. Dengan trial (atau kalkulator yield): <Tex math={String.raw`102 = \sum_{t=1}^{5} \frac{8}{(1+y)^t} + \frac{100}{(1+y)^5}`} /> &rarr; <Tex math={String.raw`y \approx 7{,}51\%`} />.</p>
        <p><strong>Langkah 2 — Yield obligasi properti:</strong> <Tex math={String.raw`91 = \sum_{t=1}^{5} \frac{8}{(1+y)^t} + \frac{100}{(1+y)^5}`} /> &rarr; <Tex math={String.raw`y \approx 10{,}32\%`} />.</p>
        <p><strong>Langkah 3 — Credit spread:</strong> 10,32% − 7,51% = <strong>2,81% = 281 bps</strong> (1 bps = 0,01%).</p>
        <p><strong>Interpretasi:</strong> pasar menuntut kompensasi <strong>281 bps per tahun</strong> untuk memegang risiko kredit perusahaan properti vs BUMN. Rp11 juta selisih harga = nilai kini dari 281 bps × 5 tahun. Analis tidak berkata &ldquo;harganya murah&rdquo; — ia berkata &ldquo;spread 281 bps&rdquo;, dan langsung membandingkannya dengan histori: apakah 281 bps ini <em>mahal atau murah untuk risiko properti saat ini</em>?</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Dari Spread ke Probabilitas Gagal Bayar</h2>
      <p>Spread 281 bps bukan sekadar &ldquo;kompensasi&rdquo; — ia menyiratkan <strong>seberapa besar pasar menilai peluang gagal bayar</strong>. Hubungan sederhananya: <Tex math={String.raw`s \approx PD \times LGD`} />, dengan <Tex math={String.raw`s`} /> = spread, <Tex math={String.raw`PD`} /> = probabilitas default tahunan, <Tex math={String.raw`LGD`} /> = kerugian jika default (<em>loss given default</em>).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Asumsi LGD:</strong> obligasi korporasi senior tanpa agunan, rata-rata historis LGD ≈ <strong>60%</strong> (recovery 40%).</p>
        <p><strong>Langkah 2 — Balik rumusnya:</strong> <Tex math={String.raw`PD \approx s / LGD = 2{,}81\% / 0{,}60 \approx 4{,}68\%`} /> per tahun.</p>
        <p><strong>Langkah 3 — Artikan:</strong> pasar &ldquo;berkata&rdquo;: perusahaan properti ini punya peluang gagal bayar <strong>~4,7% per tahun</strong> — kira-kira <strong>1 dari 21</strong> perusahaan sejenis gagal bayar tiap tahun. Untuk obligasi BUMN (spread ~0 vs pemerintah): PD implisit ≈ 0%.</p>
        <p><strong>Catatan jujur:</strong> ini <em>risk-neutral PD</em> — mengandung premi risiko, jadi lebih tinggi dari PD &ldquo;nyata&rdquo; historis. Tapi justru itu gunanya: spread = <strong>termometer ketakutan pasar real-time</strong>, diperbarui tiap detik oleh harga — jauh lebih cepat dari laporan rating yang direvisi tiap kuartal. (Jembatan ke Track 1 Credit Risk: di sana kamu membangun model PD &ldquo;nyata&rdquo;-nya.)</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: CDS — Membeli Asuransi atas Gagal Bayar</h2>
      <p>Kamu memegang obligasi properti Rp1 miliar (spread 281 bps) dan tidak bisa tidur. Solusi pasar: <strong>CDS</strong> (<em>credit default swap</em>) — kontrak asuransi: kamu bayar premi tahunan, jika emiten default, penjual CDS menggantimu.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Premi CDS:</strong> pasar mengkuotasi CDS 5 tahun perusahaan ini di <strong>300 bps/tahun</strong> (sedikit di atas spread obligasinya — wajar, ada basis).</p>
        <p><strong>Langkah 2 — Biaya tahunan:</strong> 3,00% &times; Rp1 miliar = <strong>Rp30 juta/tahun</strong>.</p>
        <p><strong>Langkah 3 — Posisi bersihmu:</strong> kupon obligasi 8% (≈Rp80 jt/thn) − premi CDS Rp30 jt = <strong>Rp50 jt/tahun (5%)</strong> — nyaris setara yield obligasi BUMN yang aman (7,51%... hmm, lebih rendah!).</p>
        <p><strong>Intuisi:</strong> perhitungan ini <em>membuktikan</em> tidak ada makan siang gratis: setelah diasuransikan, return obligasi berisiko ≈ return obligasi aman. Selisih 281 bps <strong>memang</strong> harga risiko — bukan &ldquo;cuan ekstra&rdquo;. Jika setelah dikurangi premi CDS return-nya masih jauh lebih tinggi dari obligasi aman, <em>barulah</em> ada peluang (atau ada risiko yang belum kamu lihat!). Inilah cara <em>relative value trader</em> berburu kesalahan harga.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Saat Spread Meledak — 1998 dan 2008</h2>
      <p>Spread normal terlihat membosankan — sampai ia meledak. Dua ledakan yang wajib diketahui:</p>
      <ul>
        <li><strong>Indonesia 1997–1998:</strong> sebelum krisis, spread obligasi korporasi Indonesia hanya ratusan bps. Saat rupiah runtuh (Rp2.500 &rarr; Rp16.000/USD) dan puluhan bank dilikuidasi, spread obligasi Indonesia melejit ke <strong>ribuan bps</strong> — pasar menilai default <em>massal</em> sebagai skenario dasar. Perusahaan yang sehat pun tidak bisa menerbitkan utang baru: <strong>bukan karena mereka buruk, tapi karena pasar menutup pintunya untuk semua orang.</strong> Pelajaran: <em>credit crunch</em> — risiko sistemik menular lewat spread.</li>
        <li><strong>Global 2008:</strong> spread obligasi korporasi AS (indeks CDX) melonjak dari ~50 bps ke <strong>&gt;250 bps</strong> untuk investment grade, dan obligasi <em>high yield</em> ke <strong>&gt;2.000 bps</strong>. Lehman Brothers — berperingkat A — bangkrut dalam hitungan hari. Pelajaran: <strong>spread bergerak lebih cepat dari rating</strong>; analis yang menunggu penurunan rating sudah terlambat 6 bulan.</li>
      </ul>
      <p><strong>Pola yang berulang:</strong> spread melebar <em>sebelum</em> default terjadi — ia adalah <strong>indikator awal</strong> (<em>leading</em>), bukan vonis. Manajer risiko memantau <em>perubahan</em> spread harian sebagai alarm: pelebaran 50 bps dalam seminggu pada satu nama = telepon emitennya, <em>sekarang</em>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> praktisi membedakan <strong>G-spread</strong> (yield obligasi − yield obligasi pemerintah bertenor sama) dan <strong>Z-spread</strong> (spread konstan yang ditambahkan ke <em>seluruh</em> kurva spot agar PV = harga pasar). Untuk obligasi berkupon biasa keduanya mirip; untuk obligasi berfitur aneh (<em>callable</em>), Z-spread lebih jujur. Kalau laporan riset menulis &ldquo;spread&rdquo; tanpa keterangan — asumsikan G-spread/Z-spread sederhana, dan tanyakan tenor pembandingnya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Peringkat AAA = aman selamanya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> rating = <strong>opini pada satu titik waktu</strong>, dibayar oleh <em>penerbit</em> obligasi (konflik kepentingan!), direvisi lambat. Lehman berperingkat A beberapa hari sebelum bangkrut; CDO subprime berlabel AAA (E2!). Gunakan rating sebagai <em>titik awal</em>, bukan kesimpulan — dan selalu silangkan dengan spread pasar yang real-time.</p>
      </div>

      <h2 id="tigakomponen">🔧 Pendalaman: Tiga Bahan dalam Satu Spread</h2>
      <p>Spread 281 bps itu bukan satu hal — ia <strong>campuran tiga kompensasi</strong>:</p>
      <ul>
        <li><strong>(1) Expected loss</strong> — <Tex math={String.raw`PD \times LGD`} /> yang &ldquo;wajar&rdquo; secara aktuaria (Worked 2 menghitung versi kasarnya). Ini bagian yang &ldquo;adil&rdquo;.</li>
        <li><strong>(2) Premi risiko kredit</strong> (<em>credit risk premium</em>) — investor membenci ketidakpastian, jadi menuntut ekstra di atas expected loss. Bagian ini <strong>membesar saat pasar takut</strong> (1998, 2008, 2020) dan menyusut saat euforia — inilah yang membuat spread berayun liar melebihi perubahan fundamental perusahaan.</li>
        <li><strong>(3) Premi likuiditas</strong> — obligasi korporasi (apalagi Indonesia) diperdagangkan OTC tipis (E1!); investor menuntut kompensasi karena sulit menjual cepat. Obligasi kecil/tidak likuid bisa membawa 50–100 bps <em>hanya</em> karena sepi.</li>
      </ul>
      <p><strong>Kenapa pemisahan ini penting:</strong> dua obligasi dengan spread sama bisa bercerita beda — satu karena fundamentalnya memang buruk (komponen 1), satu karena pasar sedang panik umum (komponen 2). Trader yang bisa memisahkan &ldquo;takut beralasan&rdquo; dari &ldquo;takut menular&rdquo; = menemukan obligasi yang <em>salah harga</em>. Itulah inti pekerjaan analis kredit: <strong>bukan menghitung spread, tapi membedahnya.</strong></p>


      <h2 id="siklus">🔧 Pendalaman: Siklus Kredit — Membaca Nafas Ekonomi dari Spread</h2>
      <p>Spread bukan cuma angka per obligasi — <strong>rata-rata spread seluruh pasar</strong> adalah <em>barometer</em> siklus ekonomi:</p>
      <ol>
        <li><strong>Ekspansi:</strong> ekonomi tumbuh, default rendah &rarr; spread <strong>sempit</strong> (investor &ldquo;rakus&rdquo;, berebut yield). Perusahaan <em>berlomba</em> menerbitkan utang murah — termasuk yang kualitasnya meragukan (<em>covenant-lite</em>!).</li>
        <li><strong>Puncak/euforia:</strong> spread <strong>super-sempit</strong> — pasar &ldquo;lupa&rdquo; risiko. Inilah saat <em>terburuk</em> membeli obligasi korporasi (dibayar murah untuk risiko yang diam-diam menumpuk).</li>
        <li><strong>Kontraksi:</strong> default mulai naik &rarr; spread <strong>melebar</strong>. Penerbitan baru macet (<em>credit crunch</em> — 1998!). Perusahaan lemah tidak bisa <em>refinancing</em> &rarr; default beneran &rarr; spread makin lebar. <strong>Spiral.</strong></li>
        <li><strong>Dasar/kapitulasi:</strong> spread <strong>super-lebar</strong> (2008: high-yield &gt;2.000 bps!) — pasar &ldquo;takut&rdquo; berlebihan. Inilah saat <em>terbaik</em> membeli bagi yang berani &amp; punya likuiditas (Buffett membeli obligasi Goldman Sachs di tengah 2008!).</li>
      </ol>
      <p><strong>Aturan kontrarian:</strong> <em>&ldquo;Beli saat spread lebar (ketakutan), hati-hati saat spread sempit (keserakahan).&rdquo;</em> — versi kredit dari &ldquo;beli saat darah di jalanan&rdquo;. Manajer dana obligasi profesional memutar <em>durasi &amp; kualitas kredit</em> mengikuti siklus ini: tambah high-yield saat spread lebar, geser ke pemerintah saat spread sempit.</p>
      <h2 id="worked4">🔬 Worked Example: Portofoliomu Saat Spread Melebar 200 bps</h2>
      <p>Kamu memegang obligasi korporasi 5 tahun Rp200 juta, kupon 8%, durasi modifikasi <strong>4,2</strong>. Kabar buruk sektor properti: spread obligasi sejenis <strong>melebar 200 bps</strong> (yield naik 2%). Berapa kerugian <em>mark-to-market</em>-mu?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus durasi</strong> (E4!): &Delta;P &asymp; −D<sub>mod</sub> × &Delta;y × P.</p>
        <p><strong>Langkah 2 — Hitung:</strong> −4,2 × 0,02 × 200.000.000 = <strong>−Rp16.800.000</strong> (−8,4%).</p>
        <p><strong>Langkah 3 — Tafsir:</strong> emiten <strong>tidak gagal bayar</strong> — kupon tetap dibayar! Tapi nilai portofoliomu turun 8,4% <em>di atas kertas</em>. Jika kamu <strong>pegang sampai jatuh tempo</strong> dan emiten selamat &rarr; kerugian ini <strong>tidak pernah terealisasi</strong> (pulih ke par saat jatuh tempo).</p>
        <p><strong>Intuisi ganda:</strong> (a) <strong>risiko spread ≠ risiko default</strong> — kamu bisa rugi mark-to-market tanpa satu pun gagal bayar (inilah yang menghantam bank-bank 2008: akuntansi <em>mark-to-market</em> memaksa mengakui kerugian kertas!); (b) <strong>likuiditas menentukan nasib</strong> — investor yang <em>terpaksa jual</em> (margin call, penarikan dana) mengubah rugi kertas jadi rugi beneran. <strong>Risiko = volatilitas × kebutuhan likuiditasmu.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi high-yield (bunga besar) = return besar, pasti.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>yield</em> tinggi = <strong>kompensasi risiko</strong>, bukan janji return. Studi jangka panjang: sebagian besar kelebihan yield high-yield <strong>termakan oleh default</strong> yang terjadi. Return <em>realisasi</em> high-yield ≈ return obligasi investment-grade + sedikit — dengan <strong>volatilitas jauh lebih besar</strong> (dan korelasi ke saham saat krisis!). Beli high-yield = membeli <em>risiko ekuitas dengan bungkus obligasi</em> — pastikan harganya (spread-nya) sepadan, terutama di fase siklus yang tepat.</p>
      </div>


      <h2 id="quiz">✏️ Quiz — Harga Ketakutan (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Obligasi korporasi YTM 9%, SBN setenor YTM 6%. Credit spread-nya?"
        options={[
          "3% (300 bps)",
          "15%",
          "9%",
          "6%",
        ]}
        correct={0}
        explanation="Benar: 9% − 6% = 3% = 300 basis points. Spread selalu diukur relatif terhadap risk-free setenor."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. EL = Rp1,8 jt/tahun untuk obligasi Rp1 M. Artinya…"
        options={[
          "Pasti rugi Rp1,8 jt tiap tahun",
          "Secara statistik ekspektasi kerugian Rp1,8 jt/thn; realisasinya 0 atau besar sekaligus",
          "Obligasi pasti default",
          "Spread pasti 0,18%",
        ]}
        correct={1}
        explanation="Benar: EL = rata-rata. Realisasi biner: tidak default (rugi 0) atau default (rugi LGD×EAD sekaligus). EL untuk pricing & cadangan, bukan ramalan tahunan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Batas investment grade vs junk berada di…"
        options={[
          "AAA",
          "BBB− (di bawahnya = spekulatif/junk)",
          "CCC",
          "Tidak ada batas resmi",
        ]}
        correct={1}
        explanation="Benar: BBB−. Di bawah ini = high yield/junk. Banyak institusi dilarang memegangnya — 'fallen angel' memicu jual paksa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Spread obligasi X melebar sendirian (emiten lain stabil). Respons analis yang tepat?"
        options={[
          "Langsung beli — pasti murah",
          "Langsung jual — pasti bangkrut",
          "Investigasi fundamental emiten: pasar mungkin mencium pemburukan",
          "Abaikan — spread tidak penting",
        ]}
        correct={2}
        explanation="Benar: investigasi. Pelebaran idiosinkratik (satu emiten) = sinyal pasar tentang emiten itu. Bisa peluang, bisa jebakan — baca laporan keuangannya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Spread pasar 6%, LGD 50%. Berapa PD yang 'ditakuti' pasar (tersirat)?"
        options={[
          "3%",
          "6%",
          "12% (spread ÷ LGD)",
          "50%",
        ]}
        correct={2}
        explanation="Benar: 12%. Rumus kasar spread ≈ PD × LGD → PD tersirat = 6%/0,5 = 12%. Bandingkan dengan PD versimu: jika versimu 4%, pasar terlalu takut = peluang."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Credit spread</strong> = YTM korporasi − YTM SBN setenor = harga ketakutan per tahun (termometer panik pasar).</li>
          <li><strong>Rating</strong>: AAA→D (Pefindo: idAAA→idD); batas BBB− = investment grade vs junk; rating bisa telat.</li>
          <li><strong>PD</strong> = peluang default; <strong>LGD</strong> = porsi hilang jika default; <strong>EAD</strong> = eksposur.</li>
          <li><strong>EL = PD × LGD × EAD</strong> — untuk pricing &amp; cadangan (PSAK 71), bukan ramalan.</li>
          <li><strong>Spread ≈ PD × LGD</strong> → baca pikiran pasar, tantang dengan analisismu. Berbeda &amp; benar = alpha.</li>
          <li>Risiko kredit tidak hanya default: ada <strong>risiko spread</strong> (harga jatuh saat panik) &amp; <strong>risiko likuiditas</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e4-obligasi" className="btn btn-secondary btn-sm">← E4</Link>
        <Link href="/learn/e6-ekuitas" className="btn btn-primary btn-sm">Next: E6 →</Link>
      </div>
    </div>
  );
}
