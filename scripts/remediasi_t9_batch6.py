#!/usr/bin/env python3
"""Remediasi T9 batch 6: e9 (CAPM), e10 (derivatif), e11 (black-scholes)."""
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

# ================= E9 =================
txt = load("e9-capm")
twist = '''
        <p><strong>Twist-nya:</strong> return 15% yang &ldquo;sama&rdquo; itu ternyata <strong>tidak sama harganya</strong> — pemegang saham LIAR membayar dengan jantung berdebar (sempat −30%), pemegang TENANG membayar dengan ketenangan. CAPM mengajukan pertanyaan yang tidak pernah ditanyakan sebelumnya: <strong>jika risikonya beda, return-nya <em>seharusnya</em> beda berapa?</strong> Jawabannya — satu garis lurus sederhana — menjadi fondasi cara dunia menilai setiap manajer investasi, setiap proyek korporasi, dan setiap akuisisi. Dan seperti semua fondasi: ia kuat, ia retak di beberapa tempat, dan kamu wajib tahu keduanya.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: SML — Return yang Pantas</a></li>
          <li><a href="#worked2">🔬 Worked Example: Alpha — Nilai Tambah Manajer?</a></li>
          <li><a href="#konteks">🌍 Konteks: Fama-French — Retakan di Fondasi</a></li>
          <li><a href="#betaintuisi">🔧 Pendalaman: Beta = Seberapa Menempel ke Pasar</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: SML — Menghitung Return yang &ldquo;Pantas&rdquo;</h2>
      <p>Data pasar: risk-free <Tex math={String.raw`R_f`} /> = 6% (SBN), ekspektasi return pasar <Tex math={String.raw`R_m`} /> = 12%. Tiga saham: TENANG (β = 0,5), PASAR (β = 1,0), LIAR (β = 1,5). Berapa return tahunan yang <em>pantas</em> dituntut dari masing-masing?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus SML:</strong> <Tex math={String.raw`E[R_i] = R_f + \\beta_i (R_m - R_f)`} />. Premi risiko pasar = 12% − 6% = <strong>6%</strong>.</p>
        <p>TENANG: 6% + 0,5 × 6% = <strong>9%</strong>. PASAR: 6% + 1,0 × 6% = <strong>12%</strong>. LIAR: 6% + 1,5 × 6% = <strong>15%</strong>.</p>
        <p><strong>Baca hasilnya:</strong> setiap 0,5 beta &ldquo;bernilai&rdquo; 3% return ekspektasi. Jika LIAR hanya memberi 12% (bukan 15%), ia <strong>kemahalan</strong> — kamu menanggung risiko 1,5 beta tapi dibayar seperti beta 1,0. Sebaliknya saham β = 1,5 yang return 18% = <strong>murah</strong> (memberi lebih dari yang pantas).</p>
        <p><strong>Intuisi:</strong> SML = &ldquo;daftar harga&rdquo; risiko. Beta mengukur <em>kuantitas</em> risiko sistematis yang kamu beli; <Tex math={String.raw`(R_m - R_f)`} /> = <em>harga per unit</em>-nya. Seperti membeli beras: total = harga/kg × kg. Bedanya, &ldquo;harga&rdquo; di sini ditentukan oleh seluruh pasar, bukan penjual.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Alpha — Apakah Manajer Layak Dibayar Mahal?</h2>
      <p>Manajer dana &ldquo;Cuan Abadi&rdquo; membukukan return <strong>18%</strong> tahun lalu, dengan portofolio β = 1,5. <Tex math={String.raw`R_f`} /> = 6%, <Tex math={String.raw`R_m`} /> = 12%. Apakah ia hebat — atau hanya menunggangi beta tinggi?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Return yang pantas</strong> (dari Worked 1): β = 1,5 &rarr; <strong>15%</strong>.</p>
        <p><strong>Langkah 2 — Alpha:</strong> <Tex math={String.raw`\\alpha`} /> = aktual − pantas = 18% − 15% = <strong>+3%</strong>.</p>
        <p><strong>Langkah 3 — Tafsir:</strong> +3% alpha = manajer memberi <strong>nilai tambah 3%</strong> di luar kompensasi risikonya — <em>jika</em> angka ini persisten dan signifikan secara statistik. Satu tahun +3% bisa jadi keberuntungan; lima tahun berturut-turut = skill (atau <em>factor exposure</em> yang belum terukur — lihat Konteks!).</p>
        <p><strong>Jebakan klasik:</strong> manajer dengan return 20% dan β = 2,0: pantas = 6% + 2×6% = 18% &rarr; alpha hanya +2% — <em>lebih kecil</em> dari manajer &ldquo;Cuan Abadi&rdquo; yang return-nya 18%! <strong>Jangan pernah menilai manajer dari return mentah</strong> — normalkan dulu dengan beta. Inilah alasan industri memakai <em>risk-adjusted performance</em> (Sharpe, alpha, information ratio) untuk bonus &amp; pemecatan.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Fama-French — Ketika Satu Faktor Tidak Cukup</h2>
      <p>CAPM (1964) elegan: satu faktor (pasar) menjelaskan return. Tapi data 1990-an berkata lain — <strong>Eugene Fama &amp; Kenneth French</strong> menemukan pola yang CAPM tidak bisa jelaskan:</p>
      <ul>
        <li><strong>Efek ukuran (SMB — <em>small minus big</em>):</strong> saham kapitalisasi kecil <em>cenderung</em> memberi return lebih tinggi dari prediksi CAPM. Penjelasan: risiko likuiditas &amp; kebangkrutan yang tidak tertangkap beta.</li>
        <li><strong>Efek nilai (HML — <em>high minus low</em>):</strong> saham &ldquo;murah&rdquo; (book-to-market tinggi) mengalahkan saham &ldquo;mahal&rdquo; (growth). Penjelasan: <em>value</em> = kompensasi risiko distress — atau bias perilaku (investor terlalu optimis pada growth).</li>
        <li><strong>Implikasi praktis:</strong> alpha +3% manajermu mungkin <strong>bukan skill</strong> — mungkin ia hanya <em>tilt</em> ke saham kecil &amp; murah (faktor SMB/HML). Industri merespons dengan <strong>multi-factor alpha</strong>: ukur alpha <em>setelah</em> mengontrol size, value, momentum, quality, low-vol.</li>
      </ul>
      <p><strong>Status hari ini:</strong> CAPM tetap diajarkan karena ia <strong>intuisi yang benar</strong> (risiko sistematis dihargai; idiosinkratik tidak — jembatan dari E8!) meski <strong>model empirisnya retak</strong>. Fama sendiri meraih Nobel 2013 — bersama Robert Shiller, sang pengkritik efisiensi pasar. Ilmu keuangan = <em>model yang berguna meski salah</em>, dipakai dengan sadar keterbatasannya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> beta portofolio = <strong>rata-rata tertimbang</strong> beta anggotanya. Campur saham β=1,5 (50%) + obligasi β≈0 (50%) &rarr; β portofolio ≈ 0,75. Inilah cara manajer &ldquo;menyetel&rdquo; risiko: bukan dengan menebak saham, tapi dengan <strong>menimbang beta</strong>. Mau portofolio β=1 persis seperti pasar? Itulah <em>index fund</em> — dan alasannya murah (E16!).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Beta tinggi = return tinggi, pasti.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> beta tinggi = return <em>ekspektasi</em> tinggi — <strong>ekspektasi, bukan janji</strong>. Realisasi satu tahun bisa jauh meleset (saham β=1,5 bisa −30% saat pasar −10%). CAPM berbicara tentang <strong>rata-rata jangka panjang</strong>, bukan tahun depan. Menuntut &ldquo;kepastian&rdquo; dari model ekspektasi = salah membaca jenis klaimnya.</p>
      </div>

      <h2 id="betaintuisi">🔧 Pendalaman: Beta = Seberapa Menempel Saham ke Pasar</h2>
      <p>Rumus beta: <Tex math={String.raw`\\beta_i = \\frac{Cov(R_i, R_m)}{Var(R_m)}`} />. Dibaca sebagai kalimat:</p>
      <ul>
        <li><strong>Pembilang</strong> <Tex math={String.raw`Cov(R_i, R_m)`} />: &ldquo;seberapa sering saham ini bergerak <em>searah</em> dengan pasar?&rdquo; Kovarians tinggi = menempel.</li>
        <li><strong>Penyebut</strong> <Tex math={String.raw`Var(R_m)`} />: &ldquo;dibagi dengan seberapa liar pasar itu sendiri&rdquo; — normalisasi agar β pasar = 1.</li>
        <li><strong>Hasilnya:</strong> β = 1,5 artinya &ldquo;jika pasar bergerak 1%, saham ini <em>cenderung</em> bergerak 1,5% <em>searah</em>&rdquo; — ukuran <em>sensitivitas sistematis</em>, bukan ukuran &ldquo;kebaikan&rdquo;.</li>
      </ul>
      <p><strong>Tiga sifat beta yang jarang diajarkan:</strong> (1) <strong>Beta tidak stabil</strong> — diestimasi dari data historis (regresi 2–5 tahun), bisa berubah saat bisnis berubah (akuisisi, utang baru &rarr; <em>levered beta</em> naik). (2) <strong>Beta buta arah</strong> — β=1,5 jatuh 1,5× lebih dalam juga saat pasar turun. (3) <strong>Beta = 0 bukan berarti tanpa risiko</strong> — obligasi &ldquo;β≈0&rdquo; tetap punya risiko suku bunga &amp; inflasi (E4!). Beta hanya mengukur <em>satu jenis</em> risiko: kepekaan terhadap pasar saham.</p>
      <p><strong>Untuk valuasi (jembatan E6):</strong> <Tex math={String.raw`r`} /> dalam DDM = hasil SML! Analis ekuitas: estimasi beta &rarr; hitung required return via CAPM &rarr; diskontokan dividen/FCF. Satu rantai: <strong>E8 (risiko) → E9 (harga risiko) → E6 (nilai saham)</strong>. Inilah &ldquo;mesin&rdquo; valuasi Wall Street dalam satu kalimat.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e9-capm", txt)

# ================= E10 =================
txt = load("e10-derivatif")
twist = '''
        <p><strong>Twist-nya:</strong> perhatikan yang <em>dilepas</em> Pak Tani: ia melepas <strong>peluang</strong> harga naik — barang yang belum ada, dari panen yang belum terjadi. Derivatif memperdagangkan <strong>masa depan yang belum ada</strong> dengan harga hari ini. Dan karena yang diperdagangkan adalah <em>janji tentang masa depan</em>, derivatif bisa dipakai untuk dua hal yang berlawanan: <strong>menghapus</strong> risiko (Pak Tani) atau <strong>menciptakannya dari nol</strong> (spekulan). Instrumennya netral — niatnya yang menentukan apakah ini asuransi atau kasino.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Payoff Forward Pak Tani</a></li>
          <li><a href="#worked2">🔬 Worked Example: Call vs Put — Breakeven</a></li>
          <li><a href="#konteks">🌍 Konteks: AIG 2008 &amp; Nikel 2022 — Derivatif Menggigit</a></li>
          <li><a href="#margin">🔧 Pendalaman: Margin &amp; Leverage Futures</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Payoff Forward — Siapa Untung Saat Panen Tiba?</h2>
      <p>Forward: pedagang setuju membeli 10 ton beras 3 bulan lagi @ <strong>Rp12.000/kg</strong> (total kontrak Rp120 juta). Tiga skenario harga spot saat panen:</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Skenario A — banjir panen, spot Rp10.000/kg:</strong> Pak Tani menjual @ 12.000 (kontrak!) &rarr; <strong>untung Rp2.000/kg × 10 ton = Rp20 juta</strong> vs jual spot. Pedagang rugi Rp20 juta (membayar 12.000 untuk barang 10.000).</p>
        <p><strong>Skenario B — gagal panen, spot Rp15.000/kg:</strong> Pak Tani <em>tetap</em> menjual @ 12.000 &rarr; <strong>kehilangan peluang Rp30 juta</strong>. Pedagang untung Rp30 juta.</p>
        <p><strong>Skenario C — spot tepat Rp12.000:</strong> tidak ada yang untung/rugi — tapi Pak Tani tidur nyenyak 3 bulan. <strong>Ketenangan = produk yang ia beli</strong>, dibayar dengan peluang yang dilepas.</p>
        <p><strong>Intuisi:</strong> payoff forward = <strong>garis lurus simetris</strong> (E2!): untung satu pihak = rugi pihak lain, <em>zero-sum</em>. Tidak ada &ldquo;pemenang bersama&rdquo; — tapi ada <strong>pertukaran risiko yang saling menguntungkan</strong>: pedagang (yang bisa menyimpan/menjual) menanggung risiko yang tidak bisa ditanggung petani. Derivatif = <strong>pasar untuk risiko itu sendiri</strong>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Call vs Put — Harga Breakeven &amp; Asimetri</h2>
      <p>Saham MAJU Rp1.500. Opsi 3 bulan, strike Rp1.500: <strong>call Rp120</strong>, <strong>put Rp110</strong>. Kamu beli 1 kontrak call (100 lembar). Kapan untung?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Breakeven call:</strong> strike + premi = 1.500 + 120 = <strong>Rp1.620</strong>. Di bawah itu: rugi (sebagian/seluruh premi). Di atas itu: untung tak terbatas.</p>
        <p><strong>Langkah 2 — Tiga titik:</strong> saham 1.550 &rarr; payoff max(1.550−1.500,0)=50 − 120 = <strong>rugi 70/kontrak-lembar</strong> (saham naik tapi kamu tetap rugi!); 1.700 &rarr; 200−120 = <strong>untung 80</strong>; 1.400 &rarr; 0−120 = <strong>rugi 120</strong> (maksimum).</p>
        <p><strong>Langkah 3 — Bandingkan dengan put:</strong> beli put @110, breakeven = 1.500 − 110 = <strong>Rp1.390</strong>. Put = <strong>asuransi portofolio</strong>: jika pegang saham 1.500 + beli put, kerugian mentok di ~1.390 + premi — seperti <em>stop-loss</em> yang dijamin kontrak, bukan harapan.</p>
        <p><strong>Intuisi:</strong> pembeli opsi membayar <strong>premi untuk asimetri</strong> (rugi terbatas, untung terbuka). Matematikanya kejam: karena premi hangus jika salah, pembeli opsi harus <em>benar lebih sering / lebih besar</em> dari kelihatannya. Inilah kenapa <strong>penjual opsi</strong> (yang memungut premi) menang dalam jangka panjang <em>jika</em> terdiversifikasi — dengan risiko sesekali rugi besar (ekor kiri, E7!).</p>
      </details>

      <h2 id="konteks">🌍 Konteks: AIG 2008 &amp; Nikel 2022 — Saat Derivatif Menggigit Balik</h2>
      <ul>
        <li><strong>AIG, 2008:</strong> raksasa asuransi AS menjual <strong>CDS</strong> (E5!) senilai ratusan miliar dolar atas obligasi subprime — memungut premi kecil, menanggung risiko gagal bayar massal. Saat pasar runtuh, kewajiban CDS-nya meledak; AIG nyaris bangkrut dan diselamatkan pemerintah AS (<strong>US$182 miliar</strong>). Pelajaran: <strong>menjual asuransi atas risiko yang berkorelasi</strong> (semua default bersamaan) = bunuh diri yang dibayar premi.</li>
        <li><strong>Nikel LME, Maret 2022:</strong> harga nikel melonjak <strong>250% dalam 2 hari</strong> (dari ~US$29 ribu ke &gt;US$100 ribu/ton) karena <em>short squeeze</em>: Tsingshan (produsen raksasa) memegang short futures raksasa, dipaksa membeli kembali (<em>margin call</em>) di harga gila. LME sampai <strong>membatalkan transaksi</strong> — kontroversi raksasa. Pelajaran: <strong>short derivatif = rugi tak terbatas</strong>, dan likuiditas bisa hilang tepat saat kamu paling butuh keluar.</li>
      </ul>
      <p><strong>Benang merah:</strong> kedua bencana bukan karena &ldquo;derivatif itu jahat&rdquo; — melainkan karena <strong>leverage + korelasi + ilusi likuiditas</strong>. Derivatif = <em>pengungkit</em>: mengungkit lindung nilai Pak Tani, tapi juga mengungkit kesalahan AIG &amp; Tsingshan. Aturan mainnya (margin, kliring — lihat Pendalaman) ada justru untuk menjinakkan pengungkit ini.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>forward vs futures</strong>: forward = kontrak <em>privat</em> OTC (fleksibel, tapi ada risiko lawan wanprestasi); futures = kontrak <em>standar</em> di bursa dengan <strong>kliring terpusat + margin harian</strong> (likuid, tapi kaku). Petani &amp; pedagang beras memakai forward; spekulan &amp; hedger institusi memakai futures. Pilihannya = <em>trade-off</em> fleksibilitas vs keamanan — pola yang sama seperti bursa vs OTC di E1!</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kontrak berjangka/forex = investasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> futures/forex dengan leverage 1:100 = <strong>spekulasi jangka super-pendek</strong>, bukan investasi. &ldquo;Investasi&rdquo; = membeli <em>arus kas masa depan</em> (dividen, kupon, laba). Derivatif ber-leverage tidak punya arus kas — ia <em>taruhan arah</em> dengan jam yang terus berdetak (margin call!). Boleh dipakai untuk hedging (tujuan jelas, ukuran terukur) — tapi jangan sebut &ldquo;investasi&rdquo;.</p>
      </div>

      <h2 id="margin">🔧 Pendalaman: Margin — Kenapa Futures Bisa Melipatgandakan (dan Menghancurkan)</h2>
      <p>Futures nikel: kontrak 6 ton @ US$30.000/ton = nilai nosional <strong>US$180.000</strong>. Tapi untuk memegangnya kamu hanya setor <strong>margin awal ~US$15.000</strong> (ilustratif). Artinya:</p>
      <ul>
        <li><strong>Leverage implisit:</strong> 180.000 &divide; 15.000 = <strong>12×</strong>. Harga naik 5% &rarr; untung US$9.000 = <strong>+60%</strong> dari marginmu. Harga turun 5% &rarr; rugi 60%.</li>
        <li><strong>Margin harian (<em>mark-to-market</em>):</strong> tiap sore, untung/rugi <em>disetel tunai</em>. Rugi 2 hari beruntun = margin menipis &rarr; <strong>margin call</strong>: setor tambahan <em>atau</em> posisimu dilikuidasi paksa — persis yang menghantam Tsingshan.</li>
        <li><strong>Kenapa sistem ini ada:</strong> kliring terpusat + margin harian = <strong>risiko lawan transaksi nyaris nol</strong> (kamu bertransaksi dengan kliring, bukan dengan orangnya). Inilah keunggulan futures atas forward OTC — dengan harga: <strong>tidak ada &ldquo;tunggu sampai harga kembali&rdquo;</strong>; pasar menagihmu <em>setiap hari</em>.</li>
      </ul>
      <p><strong>Aturan bertahan:</strong> (1) jangan pernah leverage yang margin call-nya bisa melebihi seluruh modalmu; (2) ukuran posisi dari <em>berapa kamu rela rugi</em>, bukan dari <em>berapa kamu ingin untung</em>; (3) ingat: <strong>leverage = meminjam waktu</strong> — ia mempercepat hasil <em>dan</em> mempercepat kematian.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e10-derivatif", txt)

# ================= E11 =================
txt = load("e11-black-scholes")
twist = '''
        <p><strong>Twist-nya:</strong> dari lima input rumus Black-Scholes, <strong>empat bisa dilihat</strong> — harga saham, strike, waktu, bunga. Hanya <strong>satu</strong> yang tidak bisa dilihat: volatilitas masa depan. Artinya seluruh &ldquo;tebakan&rdquo; pasar tentang masa depan — ketakutan, keserakahan, rumor — terkompresi menjadi <strong>satu angka misterius</strong>. Dan karena pasar mengkuotasi harga opsi setiap detik, kita bisa <em>membalik</em> rumusnya: dari harga pasar, mengintip <strong>berapa ketakutan yang sedang dihargai pasar</strong>. Itulah <em>implied volatility</em> — &ldquo;alat ukur ketakutan&rdquo; Wall Street, lahir dari rumus 1973 ini.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Tabel Arah — Lima Input, Lima Efek</a></li>
          <li><a href="#worked2">🔬 Worked Example: Delta Hedging — Menjinakkan Opsi</a></li>
          <li><a href="#konteks">🌍 Konteks: 1987 — Lahirnya Volatility Smile</a></li>
          <li><a href="#implvol">🔧 Pendalaman: Implied Vol — Membaca Ketakutan Pasar</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Tabel Arah — Apa yang Terjadi Jika Satu Input Berubah?</h2>
      <p>Call MAJU: S = Rp1.500, K = Rp1.500 (<em>at-the-money</em>), T = 3 bulan, r = 6%, σ = 40% &rarr; harga model ≈ <strong>Rp147</strong> (ilustratif). Ubah <strong>satu</strong> input, tahan lainnya:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Input berubah</th><th>Harga call</th><th>Harga put</th><th>Greek-nya</th></tr></thead>
        <tbody>
          <tr><td>S naik → 1.600</td><td>↑ ~Rp205</td><td>↓</td><td><strong>Delta</strong> (+)</td></tr>
          <tr><td>T 3 → 6 bulan</td><td>↑ ~Rp208</td><td>↑</td><td><strong>Theta</strong> (−, waktu = uang)</td></tr>
          <tr><td>σ 40% → 60%</td><td>↑ ~Rp215</td><td>↑</td><td><strong>Vega</strong> (+)</td></tr>
          <tr><td>r 6% → 9%</td><td>↑ sedikit</td><td>↓ sedikit</td><td><strong>Rho</strong> (kecil)</td></tr>
          <tr><td>K naik (OTM)</td><td>↓</td><td>↑</td><td>—</td></tr>
        </tbody>
      </table>
      </div>
      <details className="worked">
        <summary>📐 Intuisi tiap baris (klik untuk buka)</summary>
        <p><strong>Delta:</strong> call = &ldquo;bayangan&rdquo; saham — S naik Rp100, call naik ~Rp58 (delta ~0,58). Put bergerak <em>berlawanan</em> (delta negatif).</p>
        <p><strong>Theta:</strong> waktu = peluang. Makin lama expiry, makin besar peluang saham bergerak jauh &rarr; <strong>opsi lebih mahal</strong>. Berlalunya waktu <em>menggerogoti</em> pembeli opsi (theta negatif) dan <em>memberi makan</em> penjualnya.</p>
        <p><strong>Vega:</strong> ketidakpastian = nilai. σ naik &rarr; peluang gerakan besar naik &rarr; <strong>call DAN put sama-sama naik</strong> (keduanya &ldquo;membeli ketidakpastian&rdquo;). Inilah kenapa harga opsi meledak sebelum pengumuman penting (laporan keuangan, pemilu).</p>
        <p><strong>Rho:</strong> efek bunga kecil untuk opsi pendek — jangan overthinking; fokus ke delta, theta, vega.</p>
        <p><strong>Aturan 10 detik:</strong> <em>&ldquo;S↑ call↑ put↓ &bull; T↑ keduanya↑ &bull; σ↑ keduanya↑&rdquo;</em> — hafalkan ini, kamu sudah lebih paham opsi dari 90% trader ritel.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Delta Hedging — Cara Market Maker Tidur Nyenyak</h2>
      <p>Market maker <strong>menjual</strong> 10 kontrak call MAJU (1 kontrak = 100 lembar &rarr; 1.000 lembar), delta per opsi = <strong>0,55</strong>. Ia tidak mau bertaruh arah — ia ingin <em>netral</em>. Apa yang ia lakukan?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Eksposur:</strong> short 1.000 call × delta 0,55 = eksposur setara <strong>short 550 lembar saham</strong> (jika saham naik Rp1, ia rugi ~Rp550).</p>
        <p><strong>Langkah 2 — Hedge:</strong> <strong>beli 550 lembar saham</strong> di pasar. Kini: saham naik Rp100 &rarr; rugi opsi ~55.000, untung saham +55.000 = <strong>netral</strong>. ✓</p>
        <p><strong>Langkah 3 — Masalahnya:</strong> delta <em>berubah</em> tiap harga bergerak (itulah <strong>gamma</strong>!). Saham naik ke 1.600 &rarr; delta menjadi 0,70 &rarr; hedge butuh 700 lembar &rarr; <strong>beli lagi 150 lembar</strong> (di harga yang <em>sudah naik</em> — &ldquo;membeli mahal&rdquo;).</p>
        <p><strong>Langkah 4 — Polanya:</strong> saham naik &rarr; beli; saham turun &rarr; jual (delta turun &rarr; kurangi hedge). <strong>Beli mahal, jual murah — terus-menerus!</strong> Kerugian rebalancing inilah &ldquo;harga&rdquo; yang dibayar market maker — dan ia menagihnya via <strong>spread bid-ask opsi</strong> (E1!).</p>
        <p><strong>Intuisi besar:</strong> inilah <em>jiwa</em> Black-Scholes — harga opsi = <strong>biaya replikasi</strong> via delta-hedging dinamis. Rumus 1973 itu pada dasarnya menghitung &ldquo;berapa biaya strategi beli-mahal-jual-murah ini sampai expiry&rdquo;. Paham ini = paham kenapa volatilitas (σ) adalah input kuncinya: <strong>makin liar harga, makin mahal biaya hedging-nya</strong>.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 1987 — Hari Ketika Model Bertemu Realitas</h2>
      <p><strong>19 Oktober 1987 (<em>Black Monday</em>):</strong> Dow Jones jatuh <strong>−22,6% dalam sehari</strong> — kejatuhan harian terbesar sepanjang sejarah. Model Black-Scholes mengasumsikan return <strong>terdistribusi normal</strong> (lonceng simetris, E7!) — peristiwa 22-sigma seperti ini &ldquo;seharusnya&rdquo; tidak terjadi sekali pun sejak alam semesta ada.</p>
      <ul>
        <li><strong>Lahirnya <em>volatility smile</em>:</strong> setelah 1987, pasar mulai menghargai opsi put jauh (<em>out-of-the-money</em>) <strong>lebih mahal</strong> dari prediksi model — membentuk kurva &ldquo;senyum&rdquo; saat implied vol diplot terhadap strike. Pasar <em>belajar</em>: kejatuhan ekstrem lebih mungkin dari teori. Model tidak dibuang — ia <strong>dikalibrasi dengan ketakutan</strong>.</li>
        <li><strong>LTCM 1998</strong> (disinggung di E7): memakai model canggih termasuk keturunan Black-Scholes — bangkrut karena model mengasumsikan <strong>likuiditas selalu ada untuk hedging</strong>. Delta-hedging Worked 2 <em>butuh</em> pasar yang berfungsi; saat semua menjual bersamaan, &ldquo;beli 150 lembar&rdquo; tidak bisa dieksekusi di harga wajar.</li>
      </ul>
      <p><strong>Pelajaran model-risk:</strong> Black-Scholes = <strong>peta, bukan wilayah</strong>. Peta yang sangat berguna (seluruh industri mengkuotasi dalam &ldquo;bahasa vol&rdquo;), tapi: (1) ia meremehkan ekor (fat tails); (2) ia butuh σ konstan — padahal vol <em>berubah-ubah</em>; (3) ia butuh hedging kontinu — padahal pasar tutup &amp; melompat. Gunakan untuk <strong>kuotasi &amp; perbandingan relatif</strong>, bukan sebagai kebenaran.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> praktisi tidak berkata &ldquo;opsi ini harganya Rp147&rdquo; — mereka berkata &ldquo;opsi ini diperdagangkan pada <strong>vol 42%</strong>&rdquo;. Harga (rupiah) = vol × model. Mengkuotasi dalam vol membuat perbandingan <em>antar strike &amp; expiry</em> jadi bermakna: vol 42% vs 38% langsung terbaca &ldquo;yang ini lebih mahal&rdquo; — seperti membandingkan harga beras per kg, bukan per karung yang ukurannya beda-beda.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Black-Scholes memberi harga yang <em>benar</em>.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Black-Scholes memberi harga yang <strong>konsisten</strong> — bukan benar. Ia mesin penerjemah: vol → harga. Jika input vol-nya salah (tebakan!), outputnya salah dengan presisi tinggi. Pasar tahu ini — makanya ia <em>membalik</em> mesinnya: dari harga pasar → implied vol, lalu bertanya <em>&ldquo;apakah vol ini masuk akal?&rdquo;</em> Model = alat ukur, bukan peramal.</p>
      </div>

      <h2 id="implvol">🔧 Pendalaman: Implied Vol — Satu Angka, Seribu Cerita</h2>
      <p>Mekanikanya sederhana: masukkan harga opsi <em>yang diobservasi di pasar</em> ke rumus Black-Scholes, lalu pecahkan untuk σ — itulah <strong>implied volatility</strong>: &ldquo;volatilitas yang <em>sedang dihargai</em> pasar&rdquo;.</p>
      <ul>
        <li><strong>Contoh membaca:</strong> call MAJU diperdagangkan Rp180 (bukan Rp147 model @ σ=40%) &rarr; implied vol ≈ <strong>52%</strong>. Artinya: pasar menghargai <em>ketidakpastian lebih besar</em> dari vol historis 40% — mungkin ada pengumuman laba minggu depan, atau rumor akuisisi.</li>
        <li><strong>VIX — &ldquo;indeks ketakutan&rdquo;:</strong> VIX = implied vol 30-hari opsi S&amp;P 500, dikuadratkan &amp; diannualisasi. VIX 15 = pasar tenang; VIX 40+ = panik (2008: 80; COVID Mar 2020: 85). Trader memakai VIX sebagai <strong>termometer sentimen global</strong> — termasuk untuk aset Indonesia (korelasi ketakutan itu global).</li>
        <li><strong>Strategi dari sini:</strong> <em>volatility trading</em> — jika kamu yakin vol <em>realisasi</em> nanti &lt; implied vol hari ini &rarr; <strong>jual opsi</strong> (pungut premi kemahalan). Jika sebaliknya &rarr; <strong>beli opsi</strong>. Ini taruhan <em>kedua</em> yang terpisah dari arah harga — dan justru di sinilah banyak desk opsi mencari makan.</li>
      </ul>
      <p><strong>Peringatan jujur:</strong> implied vol tinggi ≠ &ldquo;pasti akan liar&rdquo; — ia = &ldquo;pasar <em>membayar mahal</em> untuk proteksi&rdquo;. Kadang pasar benar (krisis datang), kadang overpay (pengumuman ternyata adem). Edge-nya ada bagi yang bisa membedakan <em>ketakutan beralasan</em> vs <em>ketakutan berlebihan</em> — skill yang sama dengan membedah spread di E5!</p>

'''
txt = insert_before_quiz(txt, sec)
save("e11-black-scholes", txt)
print("OK e9 e10 e11")
for s in ["e9-capm", "e10-derivatif", "e11-black-scholes"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
