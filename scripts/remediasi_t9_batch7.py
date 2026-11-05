#!/usr/bin/env python3
"""Remediasi T9 batch 7: e12 (FX), e13 (market risk), e14 (money market)."""
import re

BASE = "/home/hatch/workspace/learn-platform/src/app/learn"

def load(slug):
    with open(f"{BASE}/{slug}/page.tsx", encoding="utf-8") as f:
        return f.read()

def save(slug, txt):
    with open(f"{BASE}/{slug}/page.tsx", "w", encoding="utf-8") as f:
        f.write(txt)

def add_twist(txt, twist_html):
    pat = re.compile(r'(<div className="story">.*?)(\n      </div>)', re.DOTALL)
    assert pat.search(txt)
    return pat.sub(lambda mm: mm.group(1) + twist_html + mm.group(2), txt, count=1)

def add_toc(txt, items_html):
    pat = re.compile(r'(\n          <li><a href="#quiz">)')
    assert pat.search(txt)
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E12 =================
txt = load("e12-fx-suku-bunga")
twist = '''
        <p><strong>Twist-nya:</strong> &ldquo;Rupiah melemah 3%&rdquo; terdengar seperti vonis atas Indonesia — sampai kamu tahu yen melemah 8% di periode yang sama. Tiba-tiba ceritanya berubah: ini <strong>bukan cerita tentang rupiah yang buruk</strong>, melainkan tentang <strong>dolar yang kuat</strong>. Nilai tukar selalu punya <em>dua sisi</em> — dan 90% kepanikan berita kurs berasal dari membaca satu sisi saja. Lesson ini memberimu kacamata dua sisi: setiap pergerakan kurs = <em>cerita tentang dua ekonomi sekaligus</em>.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Cross Rate EUR/IDR</a></li>
          <li><a href="#worked2">🔬 Worked Example: Forward Rate dari Selisih Bunga</a></li>
          <li><a href="#konteks">🌍 Konteks: 1998 — Rupiah 2.500 ke 16.000</a></li>
          <li><a href="#carrytrade">🔧 Pendalaman: Carry Trade — Uang Gratis yang Tidak Gratis</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Cross Rate — Harga Euro dalam Rupiah</h2>
      <p>Pasar mengkuotasi: <strong>USD/IDR = 16.500</strong> (1 dolar = Rp16.500) dan <strong>EUR/USD = 1,08</strong> (1 euro = US$1,08). Tidak ada kuotasi langsung EUR/IDR. Berapa &ldquo;harga wajar&rdquo; 1 euro dalam rupiah?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Logika:</strong> 1 EUR = 1,08 USD; 1 USD = Rp16.500. Maka 1 EUR = 1,08 × 16.500.</p>
        <p><strong>Langkah 2 — Hitung:</strong> 1,08 × 16.500 = <strong>Rp17.820</strong>.</p>
        <p><strong>Langkah 3 — Kenapa ini penting:</strong> jika bank mengkuotasimu EUR/IDR = Rp18.200 (beli euro), selisih 380 rupiah/euro = <strong>spread ~2,1%</strong> — biaya tersembunyi (E1!). Cross rate = &ldquo;harga acuan&rdquo; untuk menilai apakah kuotasi money changer menipumu.</p>
        <p><strong>Intuisi:</strong> mayoritas mata uang dunia tidak diperdagangkan langsung satu sama lain — mereka &ldquo;transit&rdquo; lewat USD (atau EUR). Inilah alasan USD disebut <strong>mata uang kendaraan</strong> (<em>vehicle currency</em>): ~90% transaksi valas global melibatkan dolar di satu sisinya. Rupiah &ldquo;melemah terhadap dolar&rdquo; = rupiah melemah terhadap <em>sistem itu sendiri</em>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Berapa Forward USD/IDR Setahun Lagi?</h2>
      <p>Spot USD/IDR = 16.500. Bunga IDR (<em>risk-free</em>) = 6%, bunga USD = 4,5%. Berapa <strong>forward rate 1 tahun</strong> yang &ldquo;wajar&rdquo; menurut <em>covered interest parity</em>?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus:</strong> <Tex math={String.raw`F = S \\times \\frac{1+r_{IDR}}{1+r_{USD}}`} />.</p>
        <p><strong>Hitung:</strong> F = 16.500 × (1,06 / 1,045) = 16.500 × 1,01435 ≈ <strong>Rp16.737</strong>.</p>
        <p><strong>Artinya:</strong> forward &ldquo;wajar&rdquo; = rupiah <strong>melemah ~1,4%</strong> dalam setahun — <em>bukan</em> ramalan, melainkan <strong>konsekuensi aritmetika</strong> selisih bunga. Kenapa? Jika forward-nya 16.500 (sama dengan spot), arbitraser akan: pinjam USD @4,5% → tukar ke IDR → deposito @6% → kunci forward — <strong>cuan bebas risiko 1,5%</strong>. Arbitrase inilah yang &ldquo;menyeret&rdquo; forward ke 16.737.</p>
        <p><strong>Jebakan interpretasi:</strong> forward 16.737 <strong>BUKAN</strong> prediksi &ldquo;rupiah akan ke 16.737&rdquo;. Ia = harga <em>asuransi</em> (E10!). Eksportir yang mengunci forward 16.737 membeli <em>kepastian</em> — jika spot tahun depan 17.500 ia &ldquo;rugi peluang&rdquo;, jika 16.000 ia &ldquo;untung&rdquo;. Seperti Pak Tani: yang dibeli = ketenangan.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 1997–1998 — Ketika Rupiah Kehilangan 80%</h2>
      <p>Juli 1997: baht Thailand jatuh. Indonesia — dengan utang swasta berdenominasi dolar yang masif &amp; cadangan devisa terbatas — menjadi sasaran berikutnya. Rupiah dari ~Rp2.500/USD (pra-krisis) merosot ke <strong>Rp16.000+</strong> (Januari 1998): <strong>kehilangan ~85% nilainya</strong> dalam hitungan bulan.</p>
      <ul>
        <li><strong>Mekanisme pembunuhnya:</strong> perusahaan Indonesia berutang <strong>dolar</strong> tapi berpenghasilan <strong>rupiah</strong> (<em>currency mismatch</em>). Rupiah jatuh 4× &rarr; utang dalam rupiah <em>otomatis</em> membengkak 4× — tanpa meminjam sepeser pun lagi. Inilah kenapa krisis kurs = krisis korporasi = krisis perbankan = krisis ekonomi. Satu domino.</li>
        <li><strong>Respons kebijakan:</strong> BI awalnya <em>melebarkan pita intervensi</em> lalu melepas rupiah ke <strong>mengambang bebas</strong> (Agustus 1997); suku bunga ditarik ke 60–70% (E3!) untuk mempertahankan rupiah — obat yang membunuh pasien (kredit macet massal).</li>
        <li><strong>Pelajaran abadi:</strong> (1) <strong>utang valas tanpa lindung nilai = bom waktu</strong> — aturan yang kini diawasi ketat (perusahaan BUMN/swasta wajib <em>hedging ratio</em> minimum); (2) <strong>cadangan devisa = amunisi intervensi</strong> — BI kini memegang &gt;US$130 miliar justru untuk tidak mengulang 1998; (3) <strong>rezim kurs menentukan segalanya</strong> — kurs tetap (<em>peg</em>) terlihat stabil sampai ia runtuh sekaligus (Thailand 1997, SNB 2015 melepas peg franc: EUR/CHF jatuh 15% dalam menit!).</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan tiga &ldquo;kurs&rdquo; yang kamu temui: <strong>JISDOR</strong> (kurs referensi BI — rata-rata transaksi pasar, bukan kurs jual-beli), <strong>kurs TT bank</strong> (yang dipakai transfer — ada spread beli/jual ~1–2%), dan <strong>kurs money changer</strong> (spread bisa 3–5% untuk valas eksotis). &ldquo;Rupiah 16.500&rdquo; di berita = JISDOR; yang kamu bayar di bank selalu lebih mahal (beli valas) / lebih murah (jual valas). Spread = biaya (E1, lagi!).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;BI bisa menguatkan rupiah kapan saja kalau mau.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> intervensi = <strong>menjual dolar dari cadangan devisa &amp; membeli rupiah</strong> — amunisinya <em>terbatas</em> (cadangan devisa) dan melawan <em>arus pasar global</em> yang triliunan dolar per hari. BI <em>bisa</em> memperhalus volatilitas (<em>smoothing</em>), tapi tidak bisa melawan tren fundamental (selisih bunga, sentimen risiko global) selamanya — 1997 membuktikannya. Bank sentral = pemecah ombak, bukan penahan tsunami.</p>
      </div>

      <h2 id="carrytrade">🔧 Pendalaman: Carry Trade — &ldquo;Uang Gratis&rdquo; yang Memakan Tuannya</h2>
      <p>Strategi legendaris: <strong>pinjam di mata uang berbunga rendah, investasikan di berbunga tinggi</strong>. Contoh klasik: pinjam yen @ 0,5% (Jepang), beli obligasi IDR @ 6%. Selisih 5,5% = &ldquo;cuan&rdquo; — <em>selama kurs tidak bergerak melawanmu</em>.</p>
      <ul>
        <li><strong>Kenapa terlihat gratis:</strong> teori paritas (Worked 2) bilang forward <em>seharusnya</em> menghapus selisih ini — tapi <strong>tanpa hedging</strong> (<em>uncovered</em>), kamu bertaruh kurs spot tidak bergerak. Bertahun-tahun yen tenang &rarr; carry trader panen 5%+ per tahun. &ldquo;Memungut receh&rdquo; (E7!).</li>
        <li><strong>Buldosernya:</strong> saat krisis/panik global, semua carry trader <strong>kabur bersamaan</strong> — menjual IDR, membeli kembali yen &rarr; yen melonjak, rupiah jatuh <em>lebih dalam</em> dari fundamental. Agustus 2024: unwind carry trade yen mengguncang pasar global dalam hitungan hari.</li>
        <li><strong>Pelajaran:</strong> carry trade = <strong>menjual asuransi terhadap krisis</strong> — premi kecil tiap tahun, klaim raksasa sesekali. Bank &amp; hedge fund yang menjalaninya memakai <em>stop-loss</em> &amp; batas ukuran ketat. Ritel yang ikut-ikutan tanpa itu = calon korban unwind berikutnya.</li>
      </ul>
      <p><strong>Untuk analis:</strong> arus carry trade menjelaskan <em>mengapa</em> rupiah bisa menguat saat fundamental domestik biasa-biasa saja (uang asing masuk mengejar yield) — dan mengapa ia bisa jatuh <em>tanpa</em> berita domestik buruk (uang asing kabur karena panik global). Membaca kurs = membaca <strong>arus modal global</strong>, bukan cuma neraca perdagangan.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e12-fx-suku-bunga", txt)

# ================= E13 =================
txt = load("e13-market-risk")
twist = '''
        <p><strong>Twist-nya:</strong> direksi mengira VaR adalah <strong>ramalan kerugian maksimum</strong> — &ldquo;jadi kita tidak akan rugi lebih dari Rp6 miliar?&rdquo; Salah total. VaR justru <em>menjamin</em> bahwa kerugian di atas Rp6 miliar <strong>akan terjadi</strong> — sekitar 2–3 hari setiap tahun. VaR bukan sabuk pengaman; ia <strong>speedometer</strong>: ia tidak mencegah kecelakaan, ia memberitahumu <em>seberapa kencang kamu melaju</em> sehingga kamu tahu kapan harus menginjak rem. Lesson ini mengajarkan cara membaca speedometer — dan kapan ia berbohong.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: VaR Parametrik — Hitung Tangan</a></li>
          <li><a href="#worked2">🔬 Worked Example: VaR Historis dari Data</a></li>
          <li><a href="#konteks">🌍 Konteks: London Whale — VaR yang Dimanipulasi</a></li>
          <li><a href="#estail">🔧 Pendalaman: Expected Shortfall — Melampaui VaR</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: VaR Parametrik — Dari Volatilitas ke Rupiah</h2>
      <p>Meja treasury memegang portofolio obligasi <strong>Rp100 miliar</strong>, volatilitas harian <strong>2%</strong>, return harian rata-rata ≈ 0. Hitung <strong>VaR 99% 1-hari</strong> (metode parametrik/varians-kovarians).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus:</strong> <Tex math={String.raw`VaR_{99\\%} = z_{99\\%} \\times \\sigma \\times Nilai`} />, dengan <Tex math={String.raw`z_{99\\%}=2{,}33`} /> (kuantil normal).</p>
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

'''
txt = insert_before_quiz(txt, sec)
save("e13-market-risk", txt)

# ================= E14 =================
txt = load("e14-money-market")
twist = '''
        <p><strong>Twist-nya:</strong> tidak ada nasabah yang antre, tidak ada berita, tidak ada gembar-gembor — tapi <strong>triliunan rupiah berpindah tangan dalam 10 menit</strong> lewat telepon, dengan jaminan &ldquo;digadaikan&rdquo; semalam. Ekonomi modern berjalan di atas <strong>lapisan tak terlihat</strong>: pasar uang. Ia seperti <em>plumbing</em> gedung — tidak pernah dipikirkan sampai mampet, dan saat mampet <strong>seluruh gedung lumpuh</strong>. Tahun 2008, plumbing inilah yang mampet — dan dunia hampir berhenti.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Bunga Repo Semalam</a></li>
          <li><a href="#worked2">🔬 Worked Example: Membeli SBN Diskonto</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Plumbing yang Mampet</a></li>
          <li><a href="#srbi">🔧 Pendalaman: SRBI — Senjata Baru BI</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Repo Rp100 Miliar Semalam — Berapa Bunganya?</h2>
      <p>Bank X repo SBN Rp100 miliar, <strong>overnight</strong> (1 hari), rate <strong>5,5%/tahun</strong>. Berapa bunga yang dibayar besok pagi? (Konvensi pasar uang: tahun = 360 hari.)</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus:</strong> bunga = pokok × rate × (hari/360).</p>
        <p><strong>Hitung:</strong> 100.000.000.000 × 0,055 × (1/360) = <strong>Rp15.277.778</strong> (≈ Rp15,3 juta).</p>
        <p><strong>Artinya:</strong> Bank X &ldquo;menyewa&rdquo; Rp100 miliar semalam seharga Rp15,3 juta — <strong>0,015%</strong> dari pokoknya. Murah? Tentu — karena <strong>ada jaminan</strong> (SBN digadaikan) dan <strong>hanya semalam</strong> (risiko nyaris nol).</p>
        <p><strong>Intuisi:</strong> repo = <strong>gadai modern antar bank</strong>. Bedanya dengan pinjam tanpa jaminan (<em>unsecured interbank</em>): repo rate <em>lebih rendah</em> karena ada kolateral. Selisih keduanya = <strong>harga dari kepercayaan</strong> — dan saat krisis, selisih ini meledak (lihat Konteks!).</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Membeli SBN dengan Diskonto — Harga di Bawah Nominal</h2>
      <p>SPN (<em>Surat Perbendaharaan Negara</em>) 90 hari, nominal Rp1 miliar, didiskonto pada <strong>6%/tahun</strong>. Berapa harga belinya hari ini, dan berapa yield efektifnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Diskonto:</strong> 1.000.000.000 × 0,06 × (90/360) = <strong>Rp15.000.000</strong>.</p>
        <p><strong>Langkah 2 — Harga beli:</strong> 1.000.000.000 − 15.000.000 = <strong>Rp985.000.000</strong>.</p>
        <p><strong>Langkah 3 — Yield efektif (atas dana yang <em>ditanam</em>):</strong> 15.000.000 &divide; 985.000.000 × (360/90) = <strong>6,09%</strong> — sedikit di atas 6% kuotasi, karena basisnya dana riil (985 jt), bukan nominal.</p>
        <p><strong>Intuisi:</strong> instrumen pasar uang <strong>tidak punya kupon</strong> — untungnya = <em>selisih diskonto</em> (beli murah, terima nominal). Mekaniknya identik dengan TVM E3: harga = PV nominal yang didiskonto. Pasar uang = TVM dengan tenor &lt; 1 tahun + dijamin super-aman + super-likuid.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: September 2008 — Saat Plumbing Mampet Total</h2>
      <p>Lehman Brothers bangkrut 15 September 2008. Yang terjadi berikutnya bukan di bursa saham — melainkan di <strong>pasar uang</strong>:</p>
      <ul>
        <li><strong>Pembekuan total:</strong> bank-bank <strong>berhenti saling meminjamkan</strong> semalam — tidak ada yang tahu bank mana yang menyimpan &ldquo;racun&rdquo; subprime. Suku bunga antar bank (LIBOR-OIS spread) meledak dari ~10 bps ke <strong>&gt;350 bps</strong>: harga <em>ketidakpercayaan</em>.</li>
        <li><strong>Run on money market funds:</strong> Reserve Primary Fund — reksa dana pasar uang raksasa AS — &ldquo;<em>broke the buck</em>&rdquo; (NAV jatuh di bawah US$1) karena memegang surat utang Lehman. Nasabah menarik <strong>US$300 miliar</strong> dari money market funds dalam hitungan hari — <em>bank run</em> versi modern, tanpa antrean fisik.</li>
        <li><strong>Respons:</strong> The Fed &amp; bank sentral dunia membuka <strong>fasilitas likuiditas darurat</strong> (pinjaman dengan jaminan longgar) — pada dasarnya menjadi <strong>&ldquo;tukang ledeng terakhir&rdquo;</strong> (<em>lender of last resort</em>) untuk pasar uang. Tanpa itu, sistem pembayaran global berhenti.</li>
      </ul>
      <p><strong>Pelajaran:</strong> (1) <strong>pasar uang = sistem saraf</strong> — ia kecil dibanding pasar modal, tapi kegagalannya <em>sistemik</em>; (2) <strong>kepercayaan = likuiditas</strong> — pasar uang berjalan di atas keyakinan bahwa lawan bayar besok pagi; saat keyakinan hilang, tidak ada harga yang bisa memperbaikinya (bunga berapa pun, tidak ada yang mau meminjamkan!); (3) <strong>&ldquo;aman &amp; likuid&rdquo; ≠ &ldquo;bebas risiko&rdquo;</strong> — Reserve Primary Fund dianggap setara kas, sampai ia tidak.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>repo vs reverse repo</strong> — keduanya transaksi <em>yang sama</em> dilihat dari dua sisi! Bank X butuh kas &rarr; <em>repo</em> (jual SBN + janji beli kembali). Bank Y punya kas nganggur &rarr; <em>reverse repo</em> (beli SBN + janji jual kembali). Satu akad, dua nama — seperti &ldquo;pinjam&rdquo; vs &ldquo;meminjamkan&rdquo;. Jangan tertukar saat membaca laporan treasury.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar uang = tanpa risiko, seperti kas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> risikonya <em>kecil</em>, bukan <em>nol</em> — dan jenisnya spesifik: <strong>risiko likuiditas</strong> (2008: tidak ada yang mau meminjamkan!) dan <strong>risiko kredit jangka pendek</strong> (<em>commercial paper</em> perusahaan bisa gagal — Lehman!). Reksa dana pasar uang &ldquo;hampir kas&rdquo; — tapi <em>hampir</em> ≠ <em>sama</em>. Untuk dana yang <strong>harus</strong> tersedia besok pagi (gaji karyawan, kliring), bahkan &ldquo;hampir&rdquo; pun terlalu berisiko — pakai deposito/LPS atau kas murni.</p>
      </div>

      <h2 id="srbi">🔧 Pendalaman: SRBI — Senjata Baru Bank Indonesia</h2>
      <p>Sejak 2023, BI menerbitkan <strong>SRBI</strong> (<em>Sekuritas Rupiah Bank Indonesia</em>) — instrumen pasar uang bertenor 6/9/12 bulan yang bisa dibeli investor (termasuk asing). Kenapa ini penting?</p>
      <ul>
        <li><strong>Fungsi ganda:</strong> (1) <strong>operasi moneter</strong> — BI menyerap likuiditas rupiah (menjual SRBI = menarik rupiah dari peredaran &rarr; mendukung rupiah &amp; mengendalikan inflasi); (2) <strong>pendalaman pasar uang</strong> — memberi <em>benchmark</em> yield jangka pendek yang transparan.</li>
        <li><strong>Daya tarik investor:</strong> yield SRBI kompetitif + tenor pendek + diterbitkan bank sentral (= risiko kredit ~nol) &rarr; menjadi <strong>parkir favorit dana asing</strong> — yang juga berarti <em>arus modal jangka pendek</em> yang bisa keluar-masuk cepat (pedang bermata dua untuk stabilitas rupiah — E12!).</li>
        <li><strong>Untuk ritel:</strong> SRBI tidak dibeli langsung (lelang via bank), tapi yield-nya <strong>menjadi acuan</strong> bunga deposito &amp; reksa dana pasar uang. Saat yield SRBI naik, bunga deposits <em>seharusnya</em> ikut naik — jika bankmu tidak menaikkan, ia menikmati margin lebih tebal dari danamu. <strong>Pengetahuan = daya tawar.</strong></li>
      </ul>
      <p><strong>Benang merah track:</strong> E14 (pasar uang) ↔ E12 (kurs) ↔ E4 (obligasi) = <strong>segitiga kebijakan moneter</strong>. BI rate → SRBI/deposito → kredit &amp; rupiah → inflasi. Analis yang paham segitiga ini bisa membaca <em>niat</em> BI dari tiap lelang SRBI — skill yang membedakan komentator dari analis.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e14-money-market", txt)
print("OK e12 e13 e14")
for s in ["e12-fx-suku-bunga", "e13-market-risk", "e14-money-market"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
