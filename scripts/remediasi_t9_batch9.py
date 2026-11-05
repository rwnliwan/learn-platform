#!/usr/bin/env python3
"""Remediasi T9 batch 9: e18 (laporan keuangan) — full expansion."""
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

txt = load("e18-laporan-keuangan")
twist = '''
        <p><strong>Twist-nya:</strong> angka Rp150 miliar itu <strong>identik</strong> — bukan &ldquo;hampir sama&rdquo;, tapi sama persis. Namun satu perusahaan sehat, satu sekarat. Artinya <strong>laba bersih adalah jawaban atas pertanyaan yang salah</strong> — seperti menilai kesehatan pasien hanya dari berat badan. Yang membedakan SEHAT dan SEKARAT tertulis <em>di dokumen yang sama</em>, <em>di halaman yang sama</em>, <strong>untuk siapa pun yang tahu cara membacanya</strong>. Tidak ada informasi orang dalam. Tidak ada rumus rahasia. Hanya literasi. Lesson ini = literasi itu.</p>'''
txt = add_twist(txt, twist)
toc = '''
          <li><a href="#worked1">🔬 Worked Example: Membedah ROE dengan DuPont</a></li>
          <li><a href="#worked2">🔬 Worked Example: Laba Rp150 M, Kas Rp10 M</a></li>
          <li><a href="#konteks">🌍 Konteks: Enron &amp; Garuda — Laba yang Dimasak</a></li>
          <li><a href="#redflags">🔧 Pendalaman: 5 Red Flags dalam 10 Menit</a></li>'''
txt = add_toc(txt, toc)
sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Membedah ROE 18% — Bagus atau Palsu?</h2>
      <p>PT SEHAT: laba bersih Rp150 M, ekuitas Rp833 M &rarr; ROE = <strong>18%</strong>. Terlihat hebat. Tapi <em>dari mana</em> 18% itu berasal? Dekomposisi <strong>DuPont 3-langkah</strong>:</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`ROE = \\frac{\\text{Laba}}{\\text{Penjualan}} \\times \\frac{\\text{Penjualan}}{\\text{Aset}} \\times \\frac{\\text{Aset}}{\\text{Ekuitas}}`} block /></p>
      <p style={{ textAlign: "center" }}><em>margin laba &times; perputaran aset &times; leverage</em></p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Data SEHAT:</strong> penjualan Rp1.500 M, aset Rp2.500 M, ekuitas Rp833 M, laba Rp150 M.</p>
        <p>Margin = 150/1.500 = <strong>10%</strong>. Perputaran aset = 1.500/2.500 = <strong>0,6×</strong>. Leverage = 2.500/833 = <strong>3,0×</strong>.</p>
        <p>ROE = 10% × 0,6 × 3,0 = <strong>18%</strong>. ✓</p>
        <p><strong>Baca seperti analis:</strong> margin 10% (sehat!), perputaran 0,6× (lambat — tiap rupiah aset hanya menghasilkan Rp0,6 penjualan), leverage 3,0× (tinggi!). <strong>Sepertiga ROE-nya berasal dari utang</strong> — bukan dari keunggulan operasi.</p>
        <p><strong>Bandingkan dengan SEKARAT</strong> (laba juga Rp150 M!): penjualan Rp3.000 M, aset Rp5.000 M, ekuitas Rp500 M &rarr; margin <strong>5%</strong>, perputaran 0,6×, leverage <strong>10×</strong> (!!). ROE = 5% × 0,6 × 10 = <strong>30%</strong> — <em>lebih tinggi</em> dari SEHAT!</p>
        <p><strong>Twist akuntansi:</strong> ROE SEKARAT (30%) &gt; SEHAT (18%) — tapi SEKARAT berdiri di atas <strong>utang 9× ekuitas</strong> (aset 5.000 − ekuitas 500 = utang 4.500!). Satu guncangan bunga/penjualan = kolaps. <strong>ROE tanpa dekomposisi = angka penipu.</strong> Selalu tanya: <em>ROE ini dari operasi atau dari utang?</em></p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Laba Rp150 Miliar, Kas Operasi Rp10 Miliar?</h2>
      <p>Rekonstruksi SEKARAT. Laba bersih <strong>Rp150 M</strong>. Tapi di laporan arus kas: piutang usaha <strong>naik Rp80 M</strong>, persediaan <strong>naik Rp60 M</strong>. Berapa kas operasi sesungguhnya?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Logika:</strong> laba akrual mengakui penjualan <em>saat faktur terbit</em> — bukan saat kas diterima. Piutang naik Rp80 M = <strong>Rp80 M &ldquo;laba&rdquo; yang belum jadi kas</strong>. Persediaan naik Rp60 M = kas <em>keluar</em> untuk menimbun barang yang belum terjual.</p>
        <p><strong>Kas operasi ≈</strong> 150 − 80 − 60 = <strong>Rp10 M</strong> (disederhanakan; versi penuh memakai metode tidak langsung dengan depresiasi dll.).</p>
        <p><strong>Tafsir:</strong> dari Rp150 M &ldquo;laba&rdquo;, hanya <strong>Rp10 M yang berupa kas</strong> — 93% masih &ldquo;di jalan&rdquo; (piutang) atau &ldquo;di gudang&rdquo; (persediaan). Jika piutang itu macet &amp; persediaan usang &rarr; laba Rp150 M = <strong>ilusi akuntansi</strong>. Inilah yang terjadi pada SEKARAT: labanya &ldquo;nyangkut&rdquo;, utangnya nyata (bunga harus dibayar dengan <em>kas</em>, bukan dengan laba!).</p>
        <p><strong>Aturan praktis analis:</strong> <strong>baca arus kas operasi DULU, laba kemudian.</strong> Rasio &ldquo;kualitas laba&rdquo; = kas operasi ÷ laba bersih. SEHAT: misal 140/150 = <strong>0,93</strong> (bagus). SEKARAT: 10/150 = <strong>0,07</strong> (alarm!). Di bawah 0,5 bertahun-tahun = perusahaan &ldquo;mencetak laba kertas&rdquo;.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: Enron 2001 &amp; Garuda 2018 — Dua Cara Memasak Laba</h2>
      <ul>
        <li><strong>Enron (AS, 2001):</strong> raksasa energi yang labanya &ldquo;tumbuh&rdquo; tiap kuartal — ternyata memakai <strong>akuntansi mark-to-market agresif</strong> (mencatat <em>proyeksi</em> laba 20 tahun sebagai laba <em>hari ini</em>) + ratusan <strong>entitas SPV</strong> di luar neraca untuk menyembunyikan utang. Saat skandal pecah: bangkrut, <strong>US$74 miliar</strong> nilai pasar menguap, akuntannya (Arthur Andersen) ikut hancur. Lahirnya <strong>Sarbanes-Oxley Act</strong> — CEO/CFO kini <em>pidana</em> jika laporan keuangan terbukti manipulatif.</li>
        <li><strong>Garuda Indonesia (2018):</strong> versi lokal — Garuda membukukan <strong>laba bersih US$809 ribu</strong> setelah bertahun-tahun rugi. Komisaris (Chatib Basri &amp; Peter Gontha) menolak menandatangani: laba itu berasal dari <strong>piutang US$239 juta</strong> atas kerja sama dengan Mahata (PT Mahata Aero Teknologi) — <em>pendapatan yang belum diterima kasnya</em>, dari mitra yang kelayakan bayarnya diragukan. Kementerian BUMN &amp; OJK kemudian menyatakan ada <strong>pelanggaran standar akuntansi</strong>; laporan harus disajikan ulang (<em>restatement</em>) menjadi <strong>rugi US$175 juta</strong>. Dua direktur didenda.</li>
      </ul>
      <p><strong>Pola yang sama, dua negara:</strong> <strong>laba diakui sebelum kasnya pasti</strong> (piutang meragukan / proyeksi masa depan). Pertahananmu = Worked 2: <strong>bandingkan laba dengan arus kas</strong> — selalu. Perusahaan jujur: keduanya bergerak seiring. Perusahaan bermasalah: keduanya <em>bercerai</em> bertahun-tahun.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan baca analis profesional untuk laporan tahunan: <strong>(1)</strong> arus kas operasi vs laba bersih (kualitas laba); <strong>(2)</strong> utang berbunga vs ekuitas (leverage — Worked 1!); <strong>(3)</strong> catatan kaki (<em>notes</em> — di sinilah &ldquo;mayat disembunyikan&rdquo;: transaksi afiliasi, SPV, perubahan kebijakan akuntansi); <strong>(4)</strong> opini auditor (wajar tanpa pengecualian? atau ada penekanan?). <strong>Manajemen menulis narasi; angka menulis kebenaran; catatan kaki menulis pengakuan.</strong></p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Sudah diaudit akuntan publik = pasti benar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> audit memberi <strong>keyakinan wajar</strong> (<em>reasonable assurance</em>) — bukan jaminan — bahwa laporan <em>bebas dari salah saji material</em> sesuai standar. Auditor <strong>dibayar oleh perusahaan yang diaudit</strong> (konflik inheren!), bekerja dengan <em>sampling</em>, dan bisa dikelabui kolusi manajemen (Enron!). Audit = <em>rem</em>, bukan <em>jaminan</em>. Tetap lakukan analisismu sendiri — auditor memeriksa kewajaran, <strong>kamu</strong> menilai kesehatan.</p>
      </div>

      <h2 id="redflags">🔧 Pendalaman: 5 Red Flags yang Bisa Dicek dalam 10 Menit</h2>
      <p>Checklist cepat sebelum mengagumi laba perusahaan mana pun:</p>
      <ol>
        <li><strong>Kas operasi &lt; laba bersih bertahun-tahun</strong> (Worked 2!) — laba kertas. Minta penjelasan; tidak ada penjelasan masuk akal = tinggalkan.</li>
        <li><strong>Piutang tumbuh jauh lebih cepat dari penjualan</strong> — &ldquo;menjual&rdquo; ke pelanggan yang tidak membayar (atau ke afiliasi sendiri!). Hitung: pertumbuhan piutang ÷ pertumbuhan penjualan &gt; 1,5× = waspada.</li>
        <li><strong>Leverage meledak + ROE &ldquo;cantik&rdquo;</strong> (Worked 1!) — ROE dari utang, bukan operasi. Cek <em>debt-to-equity</em> &amp; <em>interest coverage</em> (laba operasi ÷ beban bunga &lt; 2× = sesak napas).</li>
        <li><strong>Arus kas investasi &ldquo;aneh&rdquo;</strong> — belanja modal raksasa ke entitas afiliasi, akuisisi mahal berulang (goodwill menggelembung di neraca = bom waktu <em>impairment</em>).</li>
        <li><strong>Auditor berganti / opini tidak wajar / restatement</strong> — ganti auditor 2 tahun beruntun = manajemen &ldquo;berbelanja opini&rdquo;. Restatement = pengakuan laporan lama salah. Keduanya = bendera merah berkibar.</li>
      </ol>
      <p><strong>Penutup:</strong> lima red flags ini tidak membuktikan kecurangan — mereka membuktikan <em>kamu perlu bertanya lebih dalam</em>. Analis hebat bukan yang paling jago matematika; ia yang paling <strong>curiga dengan cara yang terstruktur</strong>. Skeptisisme + checklist = alpha (E9!) yang tidak bisa diambil quant mana pun.</p>
      <p><strong>Penutup track T9:</strong> dari E1 (ke mana uang mengalir) hingga E18 (membaca yang mengalirkannya) — kamu kini memegang <strong>peta lengkap pasar keuangan</strong>: strukturnya, instrumennya, matematikanya (TVM, obligasi, opsi), risikonya (VaR, spread, drawdown), konteksnya (krisis, Indonesia), dan bahasanya (laporan keuangan). Pasar berikutnya yang perlu ditaklukkan: <strong>pasar kerja</strong> — dan ia menghargai persis skill ini.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e18-laporan-keuangan", txt)
print("OK e18")
with open(f"{BASE}/e18-laporan-keuangan/page.tsx", encoding="utf-8") as f:
    print("e18", len(f.read().split()))
