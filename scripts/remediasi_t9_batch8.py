#!/usr/bin/env python3
"""Remediasi T9 batch 8: e15 (Indonesia), e16 (efisiensi pasar), e17 (makro-siklus)."""
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

# ================= E15 =================
txt = load("e15-indonesia")
twist = '''
        <p><strong>Twist-nya:</strong> 17 juta investor adalah <strong>kemenangan akses</strong> — dan <strong>ujian literasi</strong>. Aplikasi semudah pesan ojek membuat <em>membuka akun</em> butuh 10 menit; memahami <em>apa yang dibeli</em> butuh 10 jam — dan penipu tahu persis kesenjangan itu. Setiap fitur pasar modal Indonesia (pajak, penjaminan, perlindungan) punya <strong>versi asli dan versi palsu</strong> yang dijual penipu: &ldquo;dijamin LPS&rdquo;, &ldquo;diawasi OJK&rdquo;, &ldquo;pasti cuan&rdquo;. Lesson ini = kemampuan membedakan keduanya — <strong>sebelum</strong> uangmu yang menjadi biaya sekolahnya.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Pajak Kupon &amp; Dividen</a></li>
          <li><a href="#worked2">🔬 Worked Example: Simulasi Klaim LPS</a></li>
          <li><a href="#konteks">🌍 Konteks: 1998, Jiwasraya &amp; Binomo — Tiga Wajah Gagal</a></li>
          <li><a href="#ceklegal">🔧 Pendalaman: Cara Cek Legalitas 2 Menit</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Pajak — Berapa yang Benar-Benar Kamu Terima?</h2>
      <p>Kamu menerima <strong>kupon ORI Rp6 juta/tahun</strong> dan <strong>dividen saham Rp4 juta</strong>. Keduanya kena <strong>PPh final 10%</strong>. Berapa bersihnya — dan apa bedanya dengan &ldquo;pajak progresif&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Kupon:</strong> 6.000.000 × 10% = Rp600.000 pajak &rarr; bersih <strong>Rp5.400.000</strong>.</p>
        <p><strong>Langkah 2 — Dividen:</strong> 4.000.000 × 10% = Rp400.000 pajak &rarr; bersih <strong>Rp3.600.000</strong>.</p>
        <p><strong>Langkah 3 — Arti &ldquo;final&rdquo;:</strong> pajak 10% ini <strong>final</strong> — dipotong di sumber, tidak perlu dilaporkan lagi di SPT sebagai penghasilan kena pajak progresif. Beda dengan gaji (PPh 21 progresif 5–35%): makin besar penghasilanmu, makin besar tarifnya.</p>
        <p><strong>Implikasi perbandingan:</strong> deposito Rp1 M @ 4% = bunga Rp40 jt − PPh final 20% (deposito!) = <strong>Rp32 jt bersih</strong>. ORI Rp1 M @ 6% = Rp60 jt − 10% = <strong>Rp54 jt bersih</strong>. Perbandingan &ldquo;4% vs 6%&rdquo; terlihat selisih 2% — setelah pajak selisihnya <strong>2,2%</strong> (3,2% vs 5,4%). <strong>Selalu bandingkan return <em>setelah pajak</em></strong> — E7 mengajarkan tiga rasa return; pajak adalah bumbu keempat khas Indonesia.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Simulasi Klaim LPS — Kapan &ldquo;Dijamin&rdquo; Berlaku?</h2>
      <p>Bu Sari menyimpan <strong>Rp5 miliar</strong> di Bank Sehat (bunga 7%), dan Rp500 juta di Bank Kecil (bunga 4%, tercatat resmi). Bank Kecil dicabut izinnya. Berapa yang dijamin LPS?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Syarat LPS (tiga serangkai):</strong> (1) simpanan <strong>tercatat</strong> di bank; (2) bunga <strong>tidak melebihi</strong> tingkat penjaminan LPS; (3) tidak terindikasi <strong>fraud</strong>/rekayasa.</p>
        <p><strong>Langkah 1 — Batas nilai:</strong> penjaminan s.d. <strong>Rp2 miliar per nasabah per bank</strong> (pokok + bunga yang layak).</p>
        <p><strong>Langkah 2 — Kasus Bank Kecil:</strong> Rp500 juta &lt; Rp2 M, bunga 4% wajar, tercatat &rarr; <strong>dijamin penuh Rp500 juta</strong>. ✓</p>
        <p><strong>Langkah 3 — Kasus Bank Sehat (ilustrasi jika dicabut):</strong> Rp5 M &gt; Rp2 M &rarr; <strong>hanya Rp2 M dijamin</strong>, sisanya Rp3 M menjadi kreditor likuidasi (antre, bisa bertahun-tahun, bisa tidak kembali penuh). Plus: bunga 7% — jika melebihi tingkat penjaminan LPS saat itu, <strong>seluruhnya gugur</strong> dari penjaminan!</p>
        <p><strong>Intuisi:</strong> &ldquo;dijamin LPS&rdquo; = <strong>bersyarat &amp; berbatas</strong> — bukan mantra. Strategi praktis: pecah dana besar ke beberapa bank (tiap bank s.d. Rp2 M), pastikan bunga di bawah ambang LPS, dan simpan bukti tercatat. Penipu menjual versi <em>tanpa syaratnya</em> — sekarang kamu tahu syaratnya.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Tiga Wajah Kegagalan — 1998, Jiwasraya, Binomo</h2>
      <ul>
        <li><strong>1998 — BLBI:</strong> krisis perbankan; pemerintah menggelontorkan <strong>Bantuan Likuiditas BI (Rp144+ triliun)</strong> ke bank-bank kolaps — sebagian diselewengkan pemiliknya. Lahirnya <strong>LPS</strong> (2004) &amp; kerangka resolusi bank justru dari trauma ini: agar krisis berikutnya tidak dibayar APBN membabi-buta.</li>
        <li><strong>Jiwasraya &amp; Asabri (2019–2020):</strong> BUMN asuransi gagal bayar polis <strong>puluhan triliun rupiah</strong> — produk &ldquo;asuransi + investasi&rdquo; (<em>bancassurance</em>) yang dijanjikan return tinggi ternyata diinvestasikan ke saham gorengan. Pelajaran: <strong>label &ldquo;BUMN&rdquo; ≠ jaminan</strong>; produk hibrida (asuransi rasa investasi) = instrumen yang <em>aturan mainnya</em> (E2!) tidak dipahami pembelinya.</li>
        <li><strong>Binomo/Quotex (2022):</strong> <em>binary option</em> berkedok &ldquo;trading&rdquo; — afiliator pamer Lamborghini, korban rugi miliaran. Bappebti menegaskan: <strong>ilegal</strong> (bukan pialang berjangka berizin). Pelajaran: <strong>ciri investasi bodong</strong> = return pasti + tinggi + &ldquo;rahasia sistem&rdquo; + afiliasi berjenjang + tekanan &ldquo;slot terbatas&rdquo;. Lima-limanya muncul = lari.</li>
      </ul>
      <p><strong>Benang merah:</strong> ketiganya mengeksploitasi <strong>asimetri informasi + kepercayaan pada label</strong> (&ldquo;bank&rdquo;, &ldquo;BUMN&rdquo;, &ldquo;trading&rdquo;). Pertahananmu = <strong>verifikasi independen</strong> (lihat Pendalaman) + pemahaman aturan main (E2) + skeptisisme pada &ldquo;pasti&rdquo; (E7).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> peta wasit Indonesia — <strong>OJK</strong>: bank, pasar modal, asuransi, dana pensiun, fintech lending (perlindungan konsumen keuangan); <strong>BI</strong>: moneter, kurs, sistem pembayaran; <strong>Bappebti</strong>: berjangka komoditi, <em>aset kripto</em>; <strong>LPS</strong>: penjamin simpanan. Ditawari &ldquo;investasi kripto dijamin OJK&rdquo;? <strong>Salah alamat wasit</strong> = sinyal penipuan (kripto = Bappebti). Penipu mengandalkan kamu tidak tahu peta ini.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sudah terdaftar di OJK = pasti aman &amp; pasti untung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> izin OJK = <strong>legal beroperasi</strong>, bukan <strong>jaminan untung</strong> — apalagi jaminan pokok kembali. Reksa dana berizin OJK <em>bisa</em> rugi (risiko pasar!). &ldquo;Terdaftar OJK&rdquo; menjawab <em>&ldquo;apakah ini legal?&rdquo;</em> — bukan <em>&ldquo;apakah ini bagus?&rdquo;</em> Dua pertanyaan berbeda; penipu menjual jawaban pertanyaan pertama seolah menjawab yang kedua.</p>
      </div>

      <h2 id="ceklegal">🔧 Pendalaman: Cara Cek Legalitas dalam 2 Menit</h2>
      <p>Sebelum transfer <em>sepuluh ribu rupiah pun</em> ke platform investasi:</p>
      <ol>
        <li><strong>Cek daftar resmi:</strong> situs OJK (daftar perusahaan berizin), Bappebti (pialang berjangka &amp; pedagang kripto berizin). <strong>Nama mirip ≠ sama</strong> — penipu memakai nama &ldquo;PT Dana Investasi Berjangka&rdquo; yang mirip perusahaan asli.</li>
        <li><strong>Cek Satgas PASTI:</strong> OJK mempublikasikan daftar <strong>entitas ilegal</strong> yang dihentikan. Cari namanya di sana.</li>
        <li><strong>Uji lima ciri bodong:</strong> return pasti + tinggi? &ldquo;Sistem rahasia&rdquo;? Bonus rekrut anggota? Tekanan waktu? Testimoni kemewahan afiliator? <strong>Dua &ldquo;ya&rdquo; = jangan.</strong></li>
        <li><strong>Uji penarikan kecil:</strong> platform bodong sering <em>memperlancar</em> penarikan kecil (umpan!) lalu mengunci penarikan besar (&ldquo;bayar pajak dulu&rdquo;, &ldquo;upgrade VIP&rdquo;). Minta penarikan kecil <strong>bukan</strong> bukti legalitas.</li>
      </ol>
      <p><strong>Kalimat pamungkas:</strong> <em>&ldquo;Jika kamu tidak bisa menjelaskan dari mana untungnya dalam 3 kalimat (E2!), jangan taruh uangmu di sana.&rdquo;</em> — aturan ini saja sudah menyelamatkan dari 90% skema bodong.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e15-indonesia", txt)

# ================= E16 =================
txt = load("e16-efisiensi-pasar")
twist = '''
        <p><strong>Twist-nya:</strong> Malkiel tidak bilang manajer investasi itu bodoh — datanya bilang mereka <strong>kalah oleh biaya mereka sendiri</strong>. Monyet tidak membayar fee 2%, tidak membayar pajak atas trading-nya, dan tidak perlu &ldquo;tampil sibuk&rdquo; agar klien tidak kabur. Pertanyaan sebenarnya bukan &ldquo;bisakah manusia mengalahkan monyet?&rdquo; melainkan <strong>&ldquo;bisakah manusia mengalahkan pasar <em>setelah</em> membayar semua biayanya?&rdquo;</strong> — dan di situlah ceritanya menjadi jauh lebih menarik, karena jawabannya: <em>kadang bisa, caranya spesifik, dan pasar belajar darimu</em>.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Matematika Fee 2% vs 0,2%</a></li>
          <li><a href="#worked2">🔬 Worked Example: 1.000 Strategi Acak — Satu &ldquo;Sempurna&rdquo;</a></li>
          <li><a href="#konteks">🌍 Konteks: Taruhan Buffett &amp; Meme Stocks</a></li>
          <li><a href="#paradoks">🔧 Pendalaman: Paradoks Grossman-Stiglitz</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Fee 2% vs 0,2% — Perang 30 Tahun</h2>
      <p>Dua investor menanam <strong>Rp100 juta</strong>, return pasar kotor <strong>8%/tahun</strong>, horizon <strong>30 tahun</strong>. A memakai reksa dana aktif (fee 2%/thn); B memakai index fund (fee 0,2%/thn).</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Return bersih:</strong> A: 8% − 2% = 6%. B: 8% − 0,2% = 7,8%.</p>
        <p><strong>Langkah 2 — Nilai akhir:</strong> A: 100 × (1,06)<sup>30</sup> = 100 × 5,743 = <strong>Rp574 juta</strong>. B: 100 × (1,078)<sup>30</sup> = 100 × 9,540 = <strong>Rp954 juta</strong>.</p>
        <p><strong>Selisih: Rp380 juta</strong> — B berakhir <strong>66% lebih kaya</strong> dari modal &ldquo;hanya&rdquo; 1,8%/tahun lebih murah!</p>
        <p><strong>Intuisi:</strong> fee = <strong>pajak majemuk</strong> (<em>compounding tax</em>). 2% terlihat &ldquo;kecil&rdquo; — tapi ia memakan <strong>25%</strong> dari return kotor 8% <em>setiap tahun</em>, selama 30 tahun. Agar manajer aktif <em>impas</em> vs index, ia harus mengalahkan pasar <strong>1,8%/tahun konsisten</strong> — data SPIVA: ~90% gagal dalam 15 tahun. <strong>Fee adalah peramal kinerja terbaik</strong>: makin murah, makin besar peluang menang.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Dari 1.000 Strategi Acak, Satu Terlihat &ldquo;Sempurna&rdquo;</h2>
      <p>Analogi <em>data mining</em>: kamu menguji <strong>1.000 strategi trading acak</strong> pada data historis 10 tahun. Secara kebetulan murni, berapa yang terlihat &ldquo;hebat&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Peluang satu strategi acak terlihat bagus:</strong> misal peluang &ldquo;untung 5 tahun beruntun&rdquo; murni kebetulan = (1/2)<sup>5</sup> = <strong>3,125%</strong>.</p>
        <p><strong>Langkah 2 — Dari 1.000 strategi:</strong> 1.000 × 3,125% ≈ <strong>31 strategi</strong> akan terlihat &ldquo;hebat&rdquo; — <em>padahal semuanya acak</em>.</p>
        <p><strong>Langkah 3 — Ilustrasi nyata:</strong> inilah cara kerja <strong>backtest palsu</strong>: uji ribuan variasi, tampilkan 1 yang terbaik, sembunyikan 999 yang gagal. Ditambah <em>survivorship bias</em> (dana yang bangkrut hilang dari database!) &rarr; &ldquo;rata-rata dana aktif&rdquo; terlihat lebih bagus dari kenyataan.</p>
        <p><strong>Pertahanan:</strong> (1) minta <strong>out-of-sample test</strong> (uji di data yang <em>tidak</em> dipakai membangun strategi); (2) tanya <strong>berapa strategi yang diuji</strong> sebelum yang ini; (3) curigai <strong>Sharpe &gt; 2</strong> tanpa penjelasan ekonomi yang masuk akal. Backtest = <em>kesaksian tersangka tentang dirinya sendiri</em> — butuh verifikasi independen.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Taruhan Sejuta Dolar Buffett &amp; Pemberontakan Meme Stocks</h2>
      <ul>
        <li><strong>Taruhan Buffett (2008–2017):</strong> Warren Buffett bertaruh <strong>US$1 juta</strong> bahwa <strong>index fund S&amp;P 500</strong> mengalahkan <em>portofolio hedge fund</em> pilihan manajer top dalam 10 tahun. Hasil: index +125,8% vs hedge fund +36,3%. Buffett menang telak — <strong>bukan</strong> karena ia meramal pasar, tapi karena aritmetika fee (Worked 1!) + satu dekade pasar naik.</li>
        <li><strong>GameStop 2021 (meme stocks):</strong> kebalikannya — ritel Reddit <strong>mengalahkan hedge fund raksasa</strong> (Melvin Capital rugi US$6,8 miliar) lewat <em>short squeeze</em> terkoordinasi. Bukti pasar <strong>tidak selalu efisien</strong> — harga bisa terlepas jauh dari fundamental oleh <em>arus &amp; koordinasi</em>.</li>
      </ul>
      <p><strong>Kedua peristiwa benar bersamaan</strong> — dan justru itu intinya: pasar <strong>cukup efisien</strong> sehingga mengalahkannya <em>setelah biaya</em> sangat sulit (Buffett), tapi <strong>cukup tidak efisien</strong> sehingga anomali &amp; gelembung terjadi (GME). Posisi cerdas: <strong>indeks sebagai inti portofolio</strong> (murah, menang aritmetika) + <strong>skeptisisme aktif</strong> pada klaim &ldquo;strategi pasti cuan&rdquo; (mahal, kalah data).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga &ldquo;rasa&rdquo; efisiensi (Fama): <strong>lemah</strong> — harga lampau tidak bisa memprediksi (analisis teknikal murni = sia-sia); <strong>setengah kuat</strong> — semua info publik sudah di harga (analisis laporan keuangan <em>telat</em> = sia-sia; <em>lebih cepat/lebih pintar mengolah</em> = mungkin bisa); <strong>kuat</strong> — bahkan info orang dalam sudah di harga (terbukti <em>salah</em>: insider trading menguntungkan — makanya ilegal!). Untuk ritel: asumsikan <strong>setengah kuat</strong> — keunggulanmu bukan info, melainkan <strong>biaya rendah + horizon panjang + disiplin</strong>.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasar efisien = harga selalu benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> efisien = <strong>tidak ada pola <em>yang bisa dieksploitasi murah</em></strong> — bukan &ldquo;harga = nilai fundamental&rdquo;. Gelembung dot-com &amp; GME terjadi <em>di dalam</em> pasar yang &ldquo;efisien&rdquo;: semua orang <em>tahu</em> harganya gila, tapi <strong>tidak ada cara murah &amp; aman</strong> untuk bertaruh melawannya (<em>limits to arbitrage</em>: short bisa rugi tak terbatas, klien kabur sebelum harga kembali normal). Efisien ≠ rasional; efisien = <em>susah dicurangi</em>.</p>
      </div>

      <h2 id="paradoks">🔧 Pendalaman: Paradoks yang Menyelamatkan Profesi Analis</h2>
      <p><strong>Paradoks Grossman-Stiglitz (1980):</strong> <em>jika</em> pasar perfectly efisien (semua info sudah di harga), <strong>tidak ada insentif</strong> untuk riset — kenapa bayar analis jika harganya sudah benar? Tapi jika <em>tidak ada</em> yang riset, harga <em>tidak akan</em> benar. Kontradiksi!</p>
      <ul>
        <li><strong>Resolusinya:</strong> pasar berada di <strong>keseimbangan</strong>: cukup efisien sehingga riset <em>rata-rata</em> tidak menghasilkan alpha setelah biaya — tapi <strong>cukup tidak efisien</strong> sehingga riset <em>terbaik</em> (informasi unik, pengolahan superior, horizon berbeda) masih dibayar. Analis tidak mati — <strong>analis rata-rata</strong> yang mati.</li>
        <li><strong>Implikasi untukmu:</strong> keunggulan yang tersisa bagi analis fundamental: (1) <strong>horizon</strong> — pasar terobsesi kuartal berikutnya; analis 5-tahun melihat yang terlewat; (2) <strong>perilaku</strong> — disiplin saat semua panik (E7!); (3) <strong>ceruk</strong> — saham kecil Indonesia yang tidak diliput analis besar = inefisiensi yang masih bisa dipanen (dengan risiko likuiditas!).</li>
        <li><strong>Dan pasar <em>adaptif</em>:</strong> anomali yang dipublikasikan <em>cenderung melemah</em> (semua orang mengejarnya) — <em>Adaptive Markets Hypothesis</em> (Lo). Edge = <strong>bergerak</strong>, bukan properti tetap. Inilah kenapa &ldquo;strategi abadi&rdquo; tidak ada — yang abadi hanya <strong>prinsip</strong>: biaya rendah, diversifikasi, disiplin.</li>
      </ul>

'''
txt = insert_before_quiz(txt, sec)
save("e16-efisiensi-pasar", txt)

# ================= E17 =================
txt = load("e17-makro-siklus")
twist = '''
        <p><strong>Twist-nya:</strong> rekor 8-dari-8 itu <strong>nyata</strong> — dan tetap tidak memberitahumu <em>kapan</em>, <em>seberapa dalam</em>, atau <em>apakah kali ini berbeda</em>. Indikator ekonomi seperti <strong>ramalan cuaca</strong>: &ldquo;80% hujan&rdquo; tidak bilang jam berapa, di mana persisnya, atau apakah kamu butuh payung atau jas hujan. Investor yang memakai sinyal makro sebagai <em>ramalan pasti</em> akan kecewa; yang memakainya sebagai <strong>manajemen probabilitas</strong> — menyiapkan payung <em>dan</em> kacamata hitam — akan bertahan. Lesson ini: cara membaca langit, tanpa jadi peramal cuaca gadungan.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Membaca Inversi Kurva</a></li>
          <li><a href="#worked2">🔬 Worked Example: Pertumbuhan Riil vs Nominal</a></li>
          <li><a href="#konteks">🌍 Konteks: 2020 — Resesi Tersingkat, Pemulihan Terliar</a></li>
          <li><a href="#indikator">🔧 Pendalaman: Tiga Jenis Indikator</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Menghitung &ldquo;Sinyal Resesi&rdquo; dari Kurva</h2>
      <p>Data obligasi pemerintah AS: yield <strong>2 tahun = 4,8%</strong>, yield <strong>10 tahun = 4,2%</strong>. Hitung spread dan tafsirkan.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Spread:</strong> 10Y − 2Y = 4,2% − 4,8% = <strong>−60 bps</strong> (negatif = <em>inversi</em>).</p>
        <p><strong>Langkah 2 — Logika ekonomi:</strong> normalnya, meminjamkan 10 tahun (risiko lebih lama) menuntut bunga <em>lebih tinggi</em>. Inversi = pasar <strong>rela dibayar lebih murah</strong> untuk 10 tahun — karena yakin <strong>bunga akan <em>turun</em> di masa depan</strong> (biasanya karena resesi memaksa bank sentral memangkas).</p>
        <p><strong>Langkah 3 — Rekor historis:</strong> sejak 1976, setiap inversi 10Y-2Y AS diikuti resesi dalam 6–24 bulan — <strong>8 dari 8</strong>. <em>Tapi</em>: jeda bervariasi (6–24 bulan!), kedalaman bervariasi, dan 2022–2023 menunjukkan inversi <em>bisa</em> berakhir tanpa resesi parah (atau &ldquo;resesi teknis&rdquo; ringan).</p>
        <p><strong>Cara pakai yang benar:</strong> inversi = <strong>naikkan kewaspadaan, bukan jual semua</strong>. Respons profesional: periksa <em>konfirmasi</em> (data tenaga kerja melemah? kredit mengetat? — lihat Pendalaman), siapkan likuiditas, <em>rebalance</em> (E8) — bukan <em>market timing</em> all-in/all-out yang datanya gagal total.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: PDB Tumbuh 8% — Benarkah Makin Makmur?</h2>
      <p>Berita: &ldquo;Ekonomi tumbuh <strong>8%</strong>!&rdquo; Inflasi tahun yang sama: <strong>3%</strong>. Berapa pertumbuhan <em>riil</em> (daya beli)?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus kasar:</strong> riil ≈ nominal − inflasi = 8% − 3% = <strong>5%</strong>.</p>
        <p><strong>Langkah 2 — Rumus tepat:</strong> (1,08 / 1,03) − 1 = <strong>4,85%</strong>. (Selisih kecil; kasar cukup untuk berita.)</p>
        <p><strong>Langkah 3 — Kenapa ini penting untuk investor:</strong> return sahammu 12% nominal saat inflasi 6% = <strong>5,7% riil</strong>. Gaji naik 10% saat inflasi 8% = <strong>naik 1,9% beneran</strong>. Semua angka ekonomi &amp; investasi <strong>wajib</strong> dibaca dalam versi riil sebelum dirayakan — E7 mengajarkan hal yang sama untuk return!</p>
        <p><strong>Jebakan lanjutan:</strong> &ldquo;pertumbuhan&rdquo; juga bisa berasal dari <strong>utang</strong> (pemerintah/bank sentral menggelontor stimulus) — PDB naik hari ini, tagihan datang kemudian (inflasi / krisis utang). Tanyakan selalu: <em>pertumbuhan ini dibiayai apa?</em></p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2020 — Resesi Tersingkat &amp; Pemulihan Terliar dalam Sejarah</h2>
      <p>Februari–Maret 2020: COVID menghantam. S&amp;P 500 jatuh <strong>−34% dalam 33 hari</strong> — tercepat dalam sejarah. Lalu yang terjadi <em>tidak pernah</em> terjadi sebelumnya:</p>
      <ul>
        <li><strong>Resesi tersingkat AS:</strong> hanya <strong>2 bulan</strong> (Feb–Apr 2020) — pemulihan pasar saham tercepat: kembali ke puncak dalam ~5 bulan, lalu reli ke rekor baru.</li>
        <li><strong>Stimulus tak preseden:</strong> The Fed memangkas ke ~0% + <em>quantitative easing</em> triliunan dolar; pemerintah AS menggelontorkan cek langsung ke warga. Uang beredar meledak &rarr; <strong>inflasi 2021–2022</strong> (9% di AS!) &rarr; kenaikan bunga tercepat 40 tahun (E4: 2022 bond crash!).</li>
        <li><strong>Pelajaran siklus:</strong> (1) <strong>siklus bisa &ldquo;dipaksa&rdquo;</strong> oleh kebijakan — resesi 2020 bukan siklus bisnis normal melainkan <em>shutdown</em> artifisial; (2) <strong>obat punya efek samping</strong> — stimulus 2020 = inflasi 2022 = krisis obligasi 2022 = satu rantai sebab-akibat; (3) <strong>pasar ≠ ekonomi</strong> — pasar saham pulih saat pengangguran masih tinggi, karena pasar menghargai <em>masa depan + likuiditas</em>, bukan koran hari ini.</li>
      </ul>
      <p><strong>Untuk Indonesia:</strong> BI &amp; pemerintah menempuh jalur serupa (bunga rendah, PEN). IHSG jatuh ke ~3.900 (Maret 2020) lalu reli. Investor yang memahami &ldquo;siklus kebijakan&rdquo; — bukan sekadar &ldquo;siklus ekonomi&rdquo; — bisa membaca <em>niat</em> bank sentral dari tiap keputusan bunga (E14: segitiga moneter!).</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan <strong>tiga rezim kebijakan</strong>: (1) <strong>Easing</strong> (bunga turun, likuiditas longgar) &rarr; angin buritan untuk saham &amp; obligasi; (2) <strong>Tightening</strong> (bunga naik) &rarr; angin depan — valuasi terkompresi (E6: DDM dengan r naik!); (3) <strong>Netral</strong> &rarr; fundamental perusahaan yang bicara. 80% &ldquo;misteri&rdquo; pergerakan IHSG tahunan = rezim ini, bukan berita harian.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Resesi = saatnya jual semua dan tunggu di kas.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data <strong>menghancurkan</strong> strategi ini: sebagian besar <em>return</em> pasar terkonsentrasi di <strong>segelintir hari terbaik</strong> — yang sering muncul <em>tepat setelah</em> hari-hari terburuk (2020: hari-hari terbaik pasar = di tengah kepanikan!). <em>Market timing</em> menuntut <strong>dua</strong> keputusan benar (keluar <em>dan</em> masuk kembali) — data menunjukkan investor yang mencoba <em>underperform</em> signifikan vs yang diam. Resesi = <strong>waktu membeli bertahap</strong> (rebalancing!), bukan kabur.</p>
      </div>

      <h2 id="indikator">🔧 Pendalaman: Tiga Jenis Indikator — Jangan Baca Speedometer sebagai GPS</h2>
      <ul>
        <li><strong>Leading</strong> (mendahului): yield curve (Worked 1!), indeks manufaktur PMI, klaim pengangguran awal, izin bangunan. <em>Gunanya:</em> peringatan dini. <em>Kelemahan:</em> <strong>false positive</strong> — &ldquo;meramal 9 dari 5 resesi terakhir&rdquo; (lelucon ekonom!).</li>
        <li><strong>Coincident</strong> (bersamaan): PDB, penjualan ritel, produksi industri, tingkat pengangguran. <em>Gunanya:</em> konfirmasi &ldquo;kita <em>sedang</em> di mana&rdquo;. <em>Kelemahan:</em> data <strong>direvisi</strong> — angka PDB &ldquo;resmi&rdquo; bisa berubah 3 kali!</li>
        <li><strong>Lagging</strong> (terlambat): pengangguran puncak (tertinggi <em>setelah</em> resesi berakhir!), inflasi inti, suku bunga kredit macet. <em>Gunanya:</em> konfirmasi tren sudah mapan. <em>Kelemahan:</em> tidak berguna untuk antisipasi — tapi bagus untuk <strong>validasi</strong> (&ldquo;apakah pemulihan ini nyata?&rdquo;).</li>
      </ul>
      <p><strong>Cara profesional membaca:</strong> <strong>triangulasi</strong> — satu leading (kurva) + satu coincident (PMI/tenaga kerja) + satu lagging (pengangguran). Ketiganya selaras melemah = probabilitas resesi tinggi. Satu sinyal sendirian = <em>noise</em>. Dan selalu ingat inversi 2022–2023: <strong>sinyal terbaik pun punya false positive</strong> — makanya responsnya <em>persiapan</em> (likuiditas, diversifikasi, rebalance), bukan <em>ramalan</em> (jual semua).</p>
      <p><strong>Penutup track T9:</strong> E1–E17 membangun satu mesin: struktur pasar → instrumen → TVM → obligasi → kredit → ekuitas → risiko → diversifikasi → harga risiko → derivatif → opsi → FX → risk management → pasar uang → Indonesia → efisiensi → siklus. <strong>Keuangan = satu bahasa</strong> dengan banyak dialek. Kamu kini bisa membacanya. E18 (laporan keuangan) = kamus untuk dialek perusahaannya.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e17-makro-siklus", txt)
print("OK e15 e16 e17")
for s in ["e15-indonesia", "e16-efisiensi-pasar", "e17-makro-siklus"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
