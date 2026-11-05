#!/usr/bin/env python3
"""Remediasi T9 batch 1: e1, e2 — story twist + ekspansi durasi."""
import re, sys

BASE = "/home/hatch/workspace/learn-platform/src/app/learn"

def load(slug):
    p = f"{BASE}/{slug}/page.tsx"
    with open(p, encoding="utf-8") as f:
        return f.read()

def save(slug, txt):
    p = f"{BASE}/{slug}/page.tsx"
    with open(p, "w", encoding="utf-8") as f:
        f.write(txt)

def add_twist(txt, twist_html):
    pat = re.compile(r'(<div className="story">.*?)(\n      </div>)', re.DOTALL)
    m = pat.search(txt)
    assert m, "story div tidak ketemu"
    return pat.sub(lambda mm: mm.group(1) + twist_html + mm.group(2), txt, count=1)

def add_toc(txt, items_html):
    # sisipkan sebelum <li> quiz agar urutan TOC mengikuti alur baca
    pat = re.compile(r'(\n          <li><a href="#quiz">)')
    assert pat.search(txt), "TOC quiz li tidak ketemu"
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt, "anchor quiz tidak ketemu"
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E1 =================
txt = load("e1-struktur-pasar")

twist = '''
        <p><strong>Twist-nya:</strong> Ani <em>yakin</em> ia memodali perusahaan — dan secara intuitif itu masuk akal. Tapi di pasar keuangan, intuisi &ldquo;uangku sampai ke perusahaan&rdquo; hanya benar di <strong>satu dari dua pasar</strong>. Mayoritas transaksi yang kamu lihat di aplikasi sekuritas — grafik hijau-merah yang bergerak tiap detik — terjadi di pasar yang <strong>tidak memberi sepeser pun</strong> ke perusahaan. Memahami dua pasar ini = memahami ke mana sebenarnya uangmu pergi setiap kali menekan tombol beli.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Rights Issue</a></li>
          <li><a href="#worked2">🔬 Worked Example: Biaya Total Sekali Trading</a></li>
          <li><a href="#konteks">🌍 Konteks: Flash Crash &amp; Dapur Bursa</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
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

'''
txt = insert_before_quiz(txt, sec)
save("e1-struktur-pasar", txt)

# ================= E2 =================
txt = load("e2-instrumen")

twist = '''
        <p><strong>Twist-nya:</strong> saham perusahaannya bahkan <em>tidak turun</em> — analisis Dimas tentang perusahaannya bisa jadi benar. Tapi ia rugi <strong>100%</strong>. Di dunia derivatif, benar soal arah saja <strong>tidak cukup</strong>: kamu harus benar soal arah, <em>besar gerakan</em>, dan <em>batas waktu</em> — tiga taruhan dalam satu tiket. Lesson ini memetakan &ldquo;aturan main&rdquo; tiap instrumen agar kamu tidak membayar uang sekolah semahal Dimas.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Payoff Waran</a></li>
          <li><a href="#worked2">🔬 Worked Example: Siapa Dibayar Duluan Saat Bangkrut</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Membeli yang Tak Dipahami</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
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

'''
txt = insert_before_quiz(txt, sec)
save("e2-instrumen", txt)
print("OK e1 e2")
