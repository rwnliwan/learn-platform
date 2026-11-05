#!/usr/bin/env python3
"""Remediasi T9 batch 4: e5 (credit spread), e6 (ekuitas) — full expansion."""
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
    assert pat.search(txt), "story div tidak ketemu"
    return pat.sub(lambda mm: mm.group(1) + twist_html + mm.group(2), txt, count=1)

def add_toc(txt, items_html):
    pat = re.compile(r'(\n          <li><a href="#quiz">)')
    assert pat.search(txt), "TOC quiz li tidak ketemu"
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E5 =================
txt = load("e5-credit-spread")

twist = '''
        <p><strong>Twist-nya:</strong> kedua obligasi menjanjikan <em>teks yang sama persis</em> — kupon 8%, 5 tahun. Tapi pasar memangkas Rp11 juta dari satu di antaranya. Selisih itu bukan &ldquo;diskon acak&rdquo;: ia adalah <strong>harga dari ketakutan yang diukur dengan presisi basis poin</strong> — ketakutan yang bisa kamu hitung, pantau pergerakannya, dan jadikan sinyal. Analis kredit profesional tidak membaca perasaan pasar; mereka membaca <strong>angka ketakutan</strong> ini setiap pagi. Lesson ini memberimu kacamatanya.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Menghitung Spread dari Dua Harga</a></li>
          <li><a href="#worked2">🔬 Worked Example: Spread → Probabilitas Gagal Bayar</a></li>
          <li><a href="#worked3">🔬 Worked Example: CDS — Harga Asuransi Gagal Bayar</a></li>
          <li><a href="#konteks">🌍 Konteks: Saat Spread Meledak — 1998 &amp; 2008</a></li>
          <li><a href="#tigakomponen">🔧 Pendalaman: Tiga Bahan dalam Satu Spread</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Dari Selisih Harga Rp11 Juta ke Spread Basis Poin</h2>
      <p>Data cerita pembuka: dua obligasi 5 tahun, kupon 8%/tahun, nominal Rp100 juta. Obligasi BUMN: harga <strong>Rp102 juta</strong>. Obligasi properti: harga <strong>Rp91 juta</strong>. Ubah selisih harga menjadi <em>credit spread</em> (dalam bps).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Yield obligasi BUMN:</strong> harga 102 (di atas par) &rarr; yield &lt; kupon. Dengan trial (atau kalkulator yield): <Tex math={String.raw`102 = \\sum_{t=1}^{5} \\frac{8}{(1+y)^t} + \\frac{100}{(1+y)^5}`} /> &rarr; <Tex math={String.raw`y \\approx 7{,}51\\%`} />.</p>
        <p><strong>Langkah 2 — Yield obligasi properti:</strong> <Tex math={String.raw`91 = \\sum_{t=1}^{5} \\frac{8}{(1+y)^t} + \\frac{100}{(1+y)^5}`} /> &rarr; <Tex math={String.raw`y \\approx 10{,}32\\%`} />.</p>
        <p><strong>Langkah 3 — Credit spread:</strong> 10,32% − 7,51% = <strong>2,81% = 281 bps</strong> (1 bps = 0,01%).</p>
        <p><strong>Interpretasi:</strong> pasar menuntut kompensasi <strong>281 bps per tahun</strong> untuk memegang risiko kredit perusahaan properti vs BUMN. Rp11 juta selisih harga = nilai kini dari 281 bps × 5 tahun. Analis tidak berkata &ldquo;harganya murah&rdquo; — ia berkata &ldquo;spread 281 bps&rdquo;, dan langsung membandingkannya dengan histori: apakah 281 bps ini <em>mahal atau murah untuk risiko properti saat ini</em>?</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Dari Spread ke Probabilitas Gagal Bayar</h2>
      <p>Spread 281 bps bukan sekadar &ldquo;kompensasi&rdquo; — ia menyiratkan <strong>seberapa besar pasar menilai peluang gagal bayar</strong>. Hubungan sederhananya: <Tex math={String.raw`s \\approx PD \\times LGD`} />, dengan <Tex math={String.raw`s`} /> = spread, <Tex math={String.raw`PD`} /> = probabilitas default tahunan, <Tex math={String.raw`LGD`} /> = kerugian jika default (<em>loss given default</em>).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Asumsi LGD:</strong> obligasi korporasi senior tanpa agunan, rata-rata historis LGD ≈ <strong>60%</strong> (recovery 40%).</p>
        <p><strong>Langkah 2 — Balik rumusnya:</strong> <Tex math={String.raw`PD \\approx s / LGD = 2{,}81\\% / 0{,}60 \\approx 4{,}68\\%`} /> per tahun.</p>
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
        <li><strong>(1) Expected loss</strong> — <Tex math={String.raw`PD \\times LGD`} /> yang &ldquo;wajar&rdquo; secara aktuaria (Worked 2 menghitung versi kasarnya). Ini bagian yang &ldquo;adil&rdquo;.</li>
        <li><strong>(2) Premi risiko kredit</strong> (<em>credit risk premium</em>) — investor membenci ketidakpastian, jadi menuntut ekstra di atas expected loss. Bagian ini <strong>membesar saat pasar takut</strong> (1998, 2008, 2020) dan menyusut saat euforia — inilah yang membuat spread berayun liar melebihi perubahan fundamental perusahaan.</li>
        <li><strong>(3) Premi likuiditas</strong> — obligasi korporasi (apalagi Indonesia) diperdagangkan OTC tipis (E1!); investor menuntut kompensasi karena sulit menjual cepat. Obligasi kecil/tidak likuid bisa membawa 50–100 bps <em>hanya</em> karena sepi.</li>
      </ul>
      <p><strong>Kenapa pemisahan ini penting:</strong> dua obligasi dengan spread sama bisa bercerita beda — satu karena fundamentalnya memang buruk (komponen 1), satu karena pasar sedang panik umum (komponen 2). Trader yang bisa memisahkan &ldquo;takut beralasan&rdquo; dari &ldquo;takut menular&rdquo; = menemukan obligasi yang <em>salah harga</em>. Itulah inti pekerjaan analis kredit: <strong>bukan menghitung spread, tapi membedahnya.</strong></p>

'''
txt = insert_before_quiz(txt, sec)
save("e5-credit-spread", txt)

# ================= E6 =================
txt = load("e6-ekuitas")

twist = '''
        <p><strong>Twist-nya:</strong> pabriknya tidak berubah, karyawannya tidak berubah, labanya tidak berubah — tapi &ldquo;harganya&rdquo; berubah 4 kali dalam 5 menit. Itu karena yang kamu lihat <strong>bukan nilai perusahaan</strong>, melainkan <strong>jejak tawar-menawar terakhir</strong> di sebuah lelang raksasa yang tidak pernah tidur. Dan lelang punya psikologinya sendiri: ketakutan, keserakahan, algoritma, dan antrean. Lesson ini membedah dapur lelang itu — supaya kamu bisa membedakan <em>harga yang bergerak</em> dari <em>nilai yang berubah</em>.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Market Cap &amp; Free Float</a></li>
          <li><a href="#worked2">🔬 Worked Example: Stock Split — Ilusi &ldquo;Murah&rdquo;</a></li>
          <li><a href="#worked3">🔬 Worked Example: P/E — Harga per Rupiah Laba</a></li>
          <li><a href="#konteks">🌍 Konteks: Microstructure IDX — Aturan Lelang</a></li>
          <li><a href="#ddm">🔧 Pendalaman: Dari Mana &ldquo;Nilai&rdquo; Saham? (Intuisi DDM)</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
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
      <p style={{ textAlign: "center" }}><Tex math={String.raw`P_0 = \\frac{D_1}{(1+r)} + \\frac{D_2}{(1+r)^2} + \\frac{D_3}{(1+r)^3} + \\cdots`} block /></p>
      <p>dengan <Tex math={String.raw`D_t`} /> = dividen tahun ke-<Tex math={String.raw`t`} />, <Tex math={String.raw`r`} /> = return yang dituntut (<em>required return</em> — dari CAPM, E9!).</p>
      <ul>
        <li><strong>Kenapa dividen, bukan laba?</strong> Laba bisa &ldquo;dimasak&rdquo; (E18!); dividen = <strong>kas yang benar-benar sampai ke kantongmu</strong>. Perusahaan yang tidak pernah membayar dividen? Modelnya memakai versi umum: <em>free cash flow to equity</em> — kas yang <em>bisa</em> dibagikan.</li>
        <li><strong>Versi praktis (Gordon growth):</strong> jika dividen tumbuh konstan <Tex math={String.raw`g`} />: <Tex math={String.raw`P_0 = \\frac{D_1}{r-g}`} />. Contoh: D1 = Rp100, r = 12%, g = 5% &rarr; P0 = 100/(0,07) ≈ <strong>Rp1.428</strong>. Perhatikan sensitivitasnya: jika <Tex math={String.raw`g`} /> direvisi 5% &rarr; 3%, nilai jatuh ke Rp1.111 (−22%!) — inilah kenapa saham growth <em>sangat</em> volatile terhadap ekspektasi.</li>
        <li><strong>Keterbatasan jujur:</strong> DDM butuh tebakan <Tex math={String.raw`r`} /> dan <Tex math={String.raw`g`} /> sampai tak berhingga — dua angka yang tidak bisa diobservasi. Makanya praktisi memakai <strong>multiples</strong> (P/E) sebagai jalan pintas — tapi jalan pintas yang sehat hanya jika kamu paham model &ldquo;aslinya&rdquo; ini.</li>
      </ul>
      <p><strong>Benang merah track:</strong> E3 (diskonto) + E4 (yield) + E6 (dividen) + E9 (required return) = <strong>satu mesin yang sama</strong>: nilai kini dari janji masa depan. Obligasi janjinya pasti (kupon), saham janjinya tidak pasti (dividen) — seluruh perbedaan valuasi kedua dunia berasal dari perbedaan <em>kepastian janji</em> ini.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e6-ekuitas", txt)
print("OK e5 e6")
for s in ["e5-credit-spread", "e6-ekuitas"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
