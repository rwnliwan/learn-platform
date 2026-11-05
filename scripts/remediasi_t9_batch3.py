#!/usr/bin/env python3
"""Remediasi T9 batch 3: e3 (TVM), e4 (obligasi) — full expansion."""
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

# ================= E3 =================
txt = load("e3-tvm")

twist = '''
        <p><strong>Twist-nya:</strong> temanmu tidak salah hitung — 140 memang lebih besar dari 100. Ia salah <strong>dimensi</strong>: membandingkan dua angka yang hidup di &ldquo;zona waktu&rdquo; berbeda tanpa menyamakannya dulu, seperti membandingkan 5 kg dengan 7 liter lalu menyimpulkan 7 &ldquo;lebih besar&rdquo;. Uang punya dimensi waktu, dan <strong>bunga adalah kurs tukar antar zona waktu</strong>. Begitu kamu menguasainya, setiap harga di keuangan — obligasi, saham, proyek — berubah menjadi satu pertanyaan sederhana: <em>berapa nilainya jika dibawa ke hari ini?</em></p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Cicilan KPR Rp500 Juta</a></li>
          <li><a href="#worked2">🔬 Worked Example: 12% vs 12,5% — Jebakan Bunga Nominal</a></li>
          <li><a href="#worked3">🔬 Worked Example: Berapa Nilai Pensiunmu Hari Ini?</a></li>
          <li><a href="#konteks">🌍 Konteks: Saat Bunga 70% dan Saat Bunga Negatif</a></li>
          <li><a href="#diskonto">🔧 Pendalaman: Bunga = Harga Waktu</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: KPR Rp500 Juta — Berapa yang Benar-Benar Kamu Bayar?</h2>
      <p>Kamu meminjam <strong>Rp500 juta</strong>, bunga <strong>9% efektif per tahun</strong>, tenor <strong>20 tahun</strong>, cicilan tahunan tetap (<em>anuitas</em>). Bank bilang cicilannya &ldquo;cuma&rdquo; Rp54,8 juta/tahun. Mari verifikasi — dan hitung total bunga yang kamu bayar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus anuitas:</strong> cicilan tahunan <Tex math={String.raw`A = P \\times \\frac{r}{1-(1+r)^{-n}}`} />, dengan <Tex math={String.raw`P`} /> = pokok pinjaman, <Tex math={String.raw`r`} /> = bunga per periode, <Tex math={String.raw`n`} /> = jumlah periode.</p>
        <p><strong>Langkah 2 — Masukkan angka:</strong> <Tex math={String.raw`P=500`} /> jt, <Tex math={String.raw`r=0{,}09`} />, <Tex math={String.raw`n=20`} />. Hitung <Tex math={String.raw`(1{,}09)^{-20}`} />: <Tex math={String.raw`1{,}09^{20} \\approx 5{,}604`} /> sehingga <Tex math={String.raw`(1{,}09)^{-20} \\approx 0{,}1784`} />.</p>
        <p><strong>Langkah 3 — Cicilan:</strong> <Tex math={String.raw`A = 500 \\times \\frac{0{,}09}{1-0{,}1784} = \\frac{45}{0{,}8216} \\approx`} /> <strong>Rp54,76 juta/tahun</strong>. (Cek bank: benar.)</p>
        <p><strong>Langkah 4 — Total yang dibayar:</strong> 20 &times; 54,76 = <strong>Rp1.095 juta</strong>. Total bunga = 1.095 − 500 = <strong>Rp595 juta</strong> — <em>lebih besar dari pokok pinjamannya sendiri!</em></p>
        <p><strong>Intuisi:</strong> &ldquo;rumah Rp500 juta&rdquo; yang dibeli dengan KPR 20 tahun sebenarnya berharga <strong>Rp1,1 miliar</strong>. Inilah TVM bekerja melawanmu: karena pembayaranmu tersebar 20 tahun ke depan, bank menuntut kompensasi waktu. Keputusan cerdas = bandingkan <em>total biaya</em> (atau PV-nya), bukan cicilannya yang terlihat &ldquo;kecil&rdquo;.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: 12% vs 12,5% — Jebakan Bunga Nominal</h2>
      <p>Bank A menawarkan deposito <strong>12% nominal, bunga dibayar bulanan</strong>. Bank B menawarkan <strong>12,5% efektif per tahun</strong>. Mana lebih baik? &ldquo;12,5 &gt; 12, jelas B&rdquo; — tunggu dulu.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Pahami &ldquo;nominal&rdquo;:</strong> 12% nominal bulanan artinya tiap bulan kamu dapat 12%/12 = <strong>1% per bulan</strong> — dan bunga bulan ini ikut berbunga bulan depan (<em>compounding</em>).</p>
        <p><strong>Langkah 2 — Hitung EAR (<em>effective annual rate</em>):</strong> <Tex math={String.raw`EAR = (1+0{,}01)^{12} - 1`} />. <Tex math={String.raw`1{,}01^{12} \\approx 1{,}1268`} />, jadi EAR Bank A = <strong>12,68%</strong>.</p>
        <p><strong>Langkah 3 — Bandingkan:</strong> Bank A (12,68% efektif) <strong>mengalahkan</strong> Bank B (12,5% efektif) — meski angka brosurnya lebih kecil!</p>
        <p><strong>Intuisi:</strong> <em>frekuensi compounding</em> adalah mesin tersembunyi. Nominal 12% yang dicicil bulanan &ldquo;beranak&rdquo; lebih cepat daripada 12,5% yang dibayar setahun sekali. Aturan praktis: <strong>selalu bandingkan dalam EAR</strong> — itulah &ldquo;zona waktu&rdquo; yang sama. Bank yang jujur mencantumkan keduanya; yang tidak, sembunyikan di brosur.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Berapa Nilai Rencana Pensiunmu <em>Hari Ini</em>?</h2>
      <p>Kamu ingin menerima <strong>Rp10 juta/tahun selama 10 tahun</strong> mulai tahun depan (total Rp100 juta). Asumsi return investasi <strong>8%/tahun</strong>. Berapa yang harus kamu siapkan <em>sekarang</em> (sekali setor)?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus PV anuitas:</strong> <Tex math={String.raw`PV = A \\times \\frac{1-(1+r)^{-n}}{r}`} />.</p>
        <p><strong>Langkah 2 — Masukkan angka:</strong> <Tex math={String.raw`A=10`} /> jt, <Tex math={String.raw`r=0{,}08`} />, <Tex math={String.raw`n=10`} />. <Tex math={String.raw`(1{,}08)^{-10} \\approx 0{,}4632`} />.</p>
        <p><strong>Langkah 3 — Hasil:</strong> <Tex math={String.raw`PV = 10 \\times \\frac{1-0{,}4632}{0{,}08} = 10 \\times 6{,}7101 \\approx`} /> <strong>Rp67,1 juta</strong>.</p>
        <p><strong>Intuisi:</strong> Rp100 juta yang diterima bertahap 10 tahun hanya &ldquo;seharga&rdquo; <strong>Rp67,1 juta hari ini</strong> — Rp32,9 juta sisanya adalah &ldquo;pekerjaan&rdquo; yang dilakukan waktu + bunga untukmu. Inilah cara dana pensiun &amp; asuransi menghitung kewajibannya: mereka tidak menabung Rp100 juta, mereka menabung <strong>PV-nya</strong> dan membiarkan waktu bekerja.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Saat Bunga 70% — dan Saat Bunga <em>Negatif</em></h2>
      <p>TVM terasa abstrak sampai kamu melihat ekstremnya:</p>
      <ul>
        <li><strong>Indonesia 1998:</strong> krisis moneter — suku bunga deposito melonjak ke <strong>60–70%</strong>, inflasi menyentuh ~80%. TVM menjadi brutal: uang tunai yang dipegang <em>meleleh</em> nilainya tiap bulan; utang berbunga floating menjadi bom waktu yang menenggelamkan konglomerat. Pelajaran: <strong>bunga bukan sekadar angka — ia harga dari kepanikan kolektif</strong> (<em>risk premium</em> yang meledak).</li>
        <li><strong>Eropa &amp; Jepang 2010-an:</strong> kebalikannya — suku bunga <strong>negatif</strong> (−0,5%). Menabung di bank = <em>membayar</em> bank. TVM terbalik: Rp100 juta hari ini &ldquo;bernilai&rdquo; <em>kurang</em> dari Rp100 juta tahun depan? Tidak — melainkan investor <em>rela membayar</em> untuk keamanan (atau dipaksa regulasi memegang obligasi). Pelajaran: bunga = harga waktu <strong>+ harga ketakutan + kebijakan</strong>, bukan hukum fisika.</li>
      </ul>
      <p><strong>Benang merahnya:</strong> <Tex math={String.raw`r`} /> dalam semua rumus TVM bukanlah konstanta alam — ia adalah <strong>ringkasan dari ekspektasi inflasi, risiko, dan kebijakan moneter</strong> pada satu titik waktu. Analis yang cerdas tidak menghafal rumus; ia bertanya <em>&ldquo;bunga berapa yang pantas untuk risiko &amp; horizon ini?&rdquo;</em> — dan di situlah E4 (obligasi) dan E12 (FX &amp; suku bunga) mengambil alih.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci (Rule of 72):</strong> uang berlipat 2 dalam <strong>72 &divide; bunga%</strong> tahun. Bunga 8% &rarr; ~9 tahun. Bunga 70% (1998) &rarr; ~1 tahun — utangmu berlipat 2 tiap tahun! Aturan 10 detik untuk merasakan &ldquo;kecepatan&rdquo; bunga apa pun tanpa kalkulator.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bunga flat 8% sama dengan bunga efektif 8%.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> bunga <em>flat</em> dihitung dari <strong>pokok awal terus-menerus</strong> meski pokok sudah menyusut karena cicilan. Pinjam Rp120 juta, flat 8%/tahun, tenor 1 tahun &rarr; bunga Rp9,6 juta. Tapi rata-rata dana yang kamu pegang hanya ~Rp60 juta (menyusut tiap bulan) &rarr; bunga <em>efektif</em> ≈ <strong>14–15%</strong>! Selalu tanya: <em>flat atau efektif/AFR?</em> Selisihnya bisa 2× lipat.</p>
      </div>

      <h2 id="diskonto">🔧 Pendalaman: Bunga = Harga Waktu (dan Cara Berpikir Seperti Kreditor)</h2>
      <p>Lihat lagi rumus PV: <Tex math={String.raw`PV = \\frac{FV}{(1+r)^n}`} />. Kebanyakan orang membacanya sebagai &ldquo;rumus&rdquo;. Bacalah sebagai <strong>kalimat ekonomi</strong>:</p>
      <ul>
        <li><strong>Pembilang (<Tex math={String.raw`FV`} />):</strong> janji — &ldquo;kamu akan menerima sekian.&rdquo;</li>
        <li><strong>Penyebut (<Tex math={String.raw`(1+r)^n`} />):</strong> tiga alasan untuk meragukan janji itu: (1) <strong>waktu</strong> — kamu menunggu; (2) <strong>inflasi</strong> — daya beli tergerus; (3) <strong>risiko</strong> — janji bisa ingkar. Ketiganya diringkas dalam <Tex math={String.raw`r`} />.</li>
      </ul>
      <p><strong>Cara berpikir kreditor profesional:</strong> setiap kali ada yang menawarkan &ldquo;imbal hasil X%&rdquo;, ia tidak mendengar janji — ia mendengar <em>pertanyaan</em>: &ldquo;apakah X% cukup membayar (1) kesabaranku, (2) inflasi yang kumakan, (3) kemungkinan ia kabur?&rdquo; Jika X% &lt; jawabanmu untuk ketiganya &rarr; tolak, berapa pun manisnya brosur.</p>
      <p><strong>Jembatan ke E4:</strong> harga obligasi = PV dari seluruh janji kupon + pokok — dengan <Tex math={String.raw`r`} /> = <em>yield</em> yang ditentukan pasar. Obligasi hanyalah TVM yang diulang untuk banyak arus kas sekaligus.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e3-tvm", txt)

# ================= E4 =================
txt = load("e4-obligasi")

twist = '''
        <p><strong>Twist-nya:</strong> tidak ada yang ingkar janji — kupon 6% tetap dibayar penuh, tepat waktu. Budi rugi <strong>bukan</strong> karena obligasinya &ldquo;bermasalah&rdquo;, melainkan karena ia membeli sesuatu yang harganya ditentukan <strong>pasar</strong>, lalu pasar berubah pikiran. Inilah paradoks obligasi: instrumen yang dirancang untuk kepastian, diperdagangkan di pasar yang penuh ketidakpastian. <strong>Harga dan yield adalah dua sisi koin yang sama — dan keduanya tidak pernah diam.</strong></p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Membedah Harga ORI Budi</a></li>
          <li><a href="#worked2">🔬 Worked Example: Durasi — Meteran Sensitivitas</a></li>
          <li><a href="#worked3">🔬 Worked Example: Kupon Tinggi vs Yield Tinggi</a></li>
          <li><a href="#konteks">🌍 Konteks: 2022 — Tahun Terburuk Obligasi Sedunia</a></li>
          <li><a href="#konveks">🔧 Pendalaman: Konveksitas &amp; Dua Risiko yang Berlawanan</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Membedah Harga ORI Budi (Rp94 Juta)</h2>
      <p>Rekonstruksi dengan angka bersih. Obligasi 5 tahun, nominal Rp100 juta, kupon <strong>6%/tahun</strong> (Rp6 juta/tahun), dibeli @ par (Rp100 juta). Setahun berlalu (sisa tenor 4 tahun), BI menaikkan bunga — obligasi baru sejenis kini memberi <strong>yield 7,5%</strong>. Budi butuh uang dan menjual. Berapa harga wajarnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Prinsip:</strong> harga = PV seluruh arus kas masa depan, didiskonto pada <em>yield pasar saat ini</em> (7,5%) — <strong>bukan</strong> pada kupon 6%.</p>
        <p><strong>Langkah 2 — Arus kas tersisa:</strong> Rp6 jt (thn 1), Rp6 jt (thn 2), Rp6 jt (thn 3), Rp106 jt (thn 4, kupon + pokok).</p>
        <p><strong>Langkah 3 — Diskonto satu per satu</strong> <Tex math={String.raw`PV = \\sum \\frac{CF_t}{(1{,}075)^t}`} />:</p>
        <p>Thn 1: 6 &divide; 1,075 = 5,581 &rarr; Thn 2: 6 &divide; 1,075<sup>2</sup> = 5,192 &rarr; Thn 3: 6 &divide; 1,075<sup>3</sup> = 4,830 &rarr; Thn 4: 106 &divide; 1,075<sup>4</sup> = 79,368 (semua dalam juta rupiah).</p>
        <p><strong>Langkah 4 — Jumlahkan:</strong> 5,581 + 5,192 + 4,830 + 79,368 = <strong>Rp94,97 juta</strong> ≈ Rp95 juta. (Cerita memakai Rp94 juta — beda kecil karena pembulatan &amp; sisa tenor persisnya.)</p>
        <p><strong>Verifikasi hukum besi:</strong> yield naik 6% &rarr; 7,5% &rArr; harga turun 100 &rarr; 95. <strong>Berlawanan arah — selalu.</strong> Dan perhatikan: kupon Rp6 juta/tahun <em>tidak berubah</em> — yang berubah hanya <em>berapa pasar rela membayar</em> untuk janji Rp6 juta itu.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Durasi — Satu Angka untuk Menebak Sensitivitas</h2>
      <p>Daripada menghitung ulang PV setiap kali yield bergerak, praktisi memakai <strong>durasi</strong> (<em>modified duration</em>): perkiraan % perubahan harga untuk tiap 1% perubahan yield.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Data:</strong> obligasi di atas (kupon 6%, sisa 4 tahun, yield 7,5%, harga Rp94,97 jt). Durasi modifikasian ≈ <strong>3,4 tahun</strong> (dihitung dari rata-rata tertimbang waktu arus kas — detail rumusnya ada di Lab; intinya: makin panjang tenor &amp; makin kecil kupon, makin besar durasi).</p>
        <p><strong>Aturan praktis:</strong> <Tex math={String.raw`\\Delta P \\approx -D_{mod} \\times \\Delta y \\times P`} />.</p>
        <p><strong>Terapkan:</strong> yield naik 1% (7,5% &rarr; 8,5%): &Delta;P &asymp; −3,4 &times; 0,01 &times; 94,97 = <strong>−Rp3,23 juta</strong> &rarr; harga baru ≈ <strong>Rp91,7 juta</strong>.</p>
        <p><strong>Intuisi:</strong> durasi = &ldquo;panjang tuas&rdquo;. Obligasi 30 tahun punya durasi ~15–20 &rarr; yield naik 1% menghapus <strong>15–20%</strong> harganya! Inilah kenapa obligasi tenor panjang disebut &ldquo;aman dari gagal bayar tapi <em>kejam</em> terhadap perubahan bunga&rdquo; — profil risiko yang sama sekali berbeda dari deposito.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Kupon 9% vs Kupon 5% — Mana yang &ldquo;Lebih Untung&rdquo;?</h2>
      <p>Dua obligasi 5 tahun, nominal Rp100 juta, <strong>harga pasar sama-sama Rp100 juta</strong>. Obligasi X kupon 9%, obligasi Y kupon 5%. &ldquo;X dong, kuponnya hampir 2× lipat!&rdquo; — benarkah?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Yield X:</strong> harga = par (100) &rarr; yield = kupon = <strong>9%</strong>.</p>
        <p><strong>Langkah 2 — Yield Y:</strong> harga = par (100) &rarr; yield = kupon = <strong>5%</strong>.</p>
        <p><strong>Langkah 3 — Bandingkan apel dengan apel:</strong> keduanya di harga par, jadi yield = kupon masing-masing. X memberi 9%, Y memberi 5% — <strong>X memang lebih untung 4% per tahun</strong>. Tidak ada yang gratis di pasar: selisih 4% itu pasti mencerminkan sesuatu — misal X diterbitkan perusahaan berisiko (lihat E5: credit spread!), atau X punya fitur yang merugikan (dapat ditarik kembali/<em>callable</em> oleh penerbit saat bunga turun).</p>
        <p><strong>Intuisi:</strong> <strong>kupon = label, yield = isi.</strong> Jangan pernah membandingkan kupon antar obligasi yang harganya berbeda — bandingkan <em>yield-to-maturity</em> (dan risikonya). Kupon 9% pada harga Rp130 juta bisa jadi yield-nya <em>lebih kecil</em> dari kupon 5% pada harga Rp95 juta.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2022 — Tahun Terburuk Obligasi dalam Sejarah Modern</h2>
      <p>Selama puluhan tahun, manajer investasi menjual mantra &ldquo;60/40&rdquo;: 60% saham + 40% obligasi — obligasi sebagai <em>peredam</em> saat saham jatuh. <strong>Tahun 2022 menghancurkan mantra itu.</strong></p>
      <ul>
        <li>Inflasi global meledak pasca-COVID; The Fed menaikkan bunga dari ~0% ke ~4,5% dalam setahun — tercepat dalam 40 tahun.</li>
        <li>Obligasi pemerintah AS tenor panjang (<em>long bond</em>) <strong>rugi ~30%</strong>; indeks obligasi agregat AS rugi <strong>~13%</strong> — penurunan tahunan terburuk yang pernah tercatat.</li>
        <li>Saham juga jatuh (~−19%). Kedua kaki &ldquo;60/40&rdquo; patah bersamaan — karena <em>penyebabnya sama</em>: kenaikan yield (lihat Worked 1 &amp; 2!).</li>
        <li><strong>Indonesia tidak imun:</strong> <em>taper tantrum</em> 2013 adalah versi lokalnya — isu pengurangan stimulus AS membuat yield SBN 10 tahun melonjak &gt;200 bps dalam bulan, rupiah tertekan, IHSG koreksi. Obligasi &ldquo;aman&rdquo; tetap membawa <em>risiko suku bunga</em>.</li>
      </ul>
      <p><strong>Pelajaran:</strong> &ldquo;aset aman&rdquo; (<em>safe asset</em>) artinya <strong>risiko gagal bayar kecil</strong> — bukan &ldquo;harganya tidak bisa turun&rdquo;. Obligasi pemerintah AS tidak akan gagal bayar (dalam dolar), tapi harganya bisa rugi 30% seperti 2022. Bedakan <strong>risiko kredit</strong> (E5) dari <strong>risiko suku bunga</strong> (lesson ini) — dua hewan berbeda yang sering dikira sama.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat membeli obligasi di pasar sekunder, kamu juga membayar <strong>bunga berjalan</strong> (<em>accrued interest</em>) ke penjual — kompensasi atas kupon yang &ldquo;sudah berjalan&rdquo; sejak pembayaran terakhir. Harga kuotasi (<em>clean price</em>) + accrued = <em>dirty price</em> (yang benar-benar kamu bayar). Jangan kaget saat total debet lebih besar dari harga di layar!</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Obligasi pemerintah pasti untung kalau dipegang sampai jatuh tempo.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>nominal</em>-nya pasti kembali (pokok + kupon sesuai janji) — tapi <strong>daya belinya</strong> belum tentu. Kupon 6% saat inflasi 8% = return riil <strong>−2%</strong>: uangmu kembali utuh dalam angka, menyusut dalam nilai. &ldquo;Pasti&rdquo; hanya berlaku untuk angka nominal, bukan untuk kemakmuran.</p>
      </div>

      <h2 id="konveks">🔧 Pendalaman: Konveksitas — dan Dua Risiko yang Saling Berlawanan</h2>
      <p>Hubungan harga–yield tidak garis lurus — ia <strong>melengkung</strong> (<em>konveks</em>): saat yield turun, harga naik <em>lebih cepat</em> daripada penurunannya saat yield naik. Kelengkungan ini menguntungkan pemegang obligasi (asimetri positif) — dan menjelaskan kenapa durasi (aproksimasi garis lurus) hanya akurat untuk perubahan yield kecil.</p>
      <p>Lebih penting untuk karirmu: pemegang obligasi menghadapi <strong>dua risiko yang tarik-menarik</strong>:</p>
      <ul>
        <li><strong>Risiko harga</strong> (<em>price risk</em>): yield naik &rarr; harga obligasimu turun (Budi!). Dominan jika horizonmu <strong>pendek</strong> / mungkin jual sebelum jatuh tempo.</li>
        <li><strong>Risiko reinvestasi</strong> (<em>reinvestment risk</em>): yield turun &rarr; kupon yang kamu terima harus diinvestasikan ulang pada bunga <em>lebih rendah</em>. Dominan jika horizonmu <strong>panjang</strong> (dana pensiun!).</li>
      </ul>
      <p>Keduanya tidak bisa dihindari bersamaan — menurunkan satu menaikkan yang lain. Strategi klasik mengelolanya: <strong>immunisasi</strong> — menyamakan durasi aset obligasi dengan durasi kewajiban (misal pembayaran pensiun), sehingga kedua risiko <em>saling meniadakan</em>. Inilah pekerjaan harian manajer dana pensiun &amp; asuransi jiwa — dan alasan mereka adalah pembeli obligasi terbesar di dunia.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e4-obligasi", txt)
print("OK e3 e4")
for s in ["e3-tvm", "e4-obligasi"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
