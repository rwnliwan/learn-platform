#!/usr/bin/env python3
"""Remediasi T9 batch 11 (final round): e4, e5, e6 — pendalaman + worked + box."""
import re

BASE = "/home/hatch/workspace/learn-platform/src/app/learn"

def load(slug):
    with open(f"{BASE}/{slug}/page.tsx", encoding="utf-8") as f:
        return f.read()

def save(slug, txt):
    with open(f"{BASE}/{slug}/page.tsx", "w", encoding="utf-8") as f:
        f.write(txt)

def add_toc(txt, items_html):
    pat = re.compile(r'(\n          <li><a href="#quiz">)')
    assert pat.search(txt)
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E4 =================
txt = load("e4-obligasi")
toc = '''
          <li><a href="#kurva">🔧 Pendalaman: Kurva Yield — Peta Ekspektasi Pasar</a></li>
          <li><a href="#worked4">🔬 Worked Example: Strategi Bond Ladder</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="kurva">🔧 Pendalaman: Kurva Yield — Satu Gambar, Seribu Ekspektasi</h2>
      <p>Plot yield SBN Indonesia per Oktober 2026 (ilustratif): 1 thn <strong>5,8%</strong>, 5 thn <strong>6,4%</strong>, 10 thn <strong>6,9%</strong>, 20 thn <strong>7,2%</strong>, 30 thn <strong>7,3%</strong>. Kurva <strong>menanjak lalu mendatar</strong> (<em>normal, flattening</em>). Apa yang dibacakan pasar dari bentuk ini?</p>
      <ul>
        <li><strong>Kemiringan (slope):</strong> 10Y − 2Y positif &amp; lebar = pasar yakin ekonomi tumbuh + inflasi terkendali. <strong>Mendatar</strong> = pasar ragu pertumbuhan jangka panjang. <strong>Inversi</strong> (E17!) = pasar bertaruh resesi.</li>
        <li><strong>Level:</strong> seluruh kurva naik = ekspektasi inflasi/suku bunga naik (2022!). Seluruh kurva turun = pelonggaran moneter di depan mata.</li>
        <li><strong>Teori di baliknya:</strong> <em>ekspektasi murni</em> — yield 10 thn ≈ rata-rata ekspektasi bunga 1 tahun selama 10 tahun ke depan + <em>premi jangka</em> (<em>term premium</em>: kompensasi mengunci uang lama). Kurva = <strong>agregat taruhan pasar tentang masa depan moneter</strong>.</li>
      </ul>
      <p><strong>Cara trader memakai kurva:</strong> (1) <em>riding the curve</em> — beli obligasi 5 thn, jual setahun kemudian saat jadi 4 thn (yield lebih rendah &rarr; harga naik!) — <em>roll-down return</em>; (2) <em>curve steepener/flattener</em> — bertaruh pada <em>perubahan bentuk</em>, bukan level (pakai kombinasi beli 2Y + jual 10Y); (3) <strong>kalibrasi</strong> — kurva SBN = <em>risk-free</em> domestik untuk SEMUA valuasi rupiah (E3 WACC!).</p>
      <h2 id="worked4">🔬 Worked Example: Bond Ladder — Tangga Anti-Khawatir Bunga</h2>
      <p>Bu Rina punya <strong>Rp500 juta</strong>, butuh Rp100 juta/tahun selama 5 tahun (biaya kuliah anak). Takut bunga naik (harga obligasi jatuh — E4!). Solusi: <strong>bond ladder</strong> — beli 5 obligasi @ Rp100 juta, jatuh tempo <strong>1, 2, 3, 4, 5 tahun</strong>.</p>
      <details className="worked">
        <summary>📐 Simulasi langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Tahun 1:</strong> obligasi #1 jatuh tempo &rarr; terima Rp100 juta + kupon &rarr; bayar kuliah. <strong>Tidak peduli</strong> harga pasar obligasi lain — yang jatuh tempo dibayar <em>par</em>!</p>
        <p><strong>Tahun 2:</strong> #2 jatuh tempo &rarr; Rp100 juta &rarr; kuliah. Dan seterusnya.</p>
        <p><strong>Kenapa ini menyelesaikan dilema E4?</strong> Risiko harga (Budi!) hanya masalah jika <strong>jual sebelum jatuh tempo</strong>. Ladder menyamakan <em>jatuh tempo aset</em> dengan <em>jatuh tempo kebutuhan</em> — <strong>immunisasi sederhana</strong> (E4 Pendalaman!). Bunga naik? Tidak masalah — tiap tahun ada yang jatuh tempo di par, dan dana yang belum dibutuhkan bisa diinvestasikan ulang di yield <em>lebih tinggi</em> (risiko reinvestasi justru <em>menguntungkanmu</em> di sini!).</p>
        <p><strong>Intuisi:</strong> ladder = <strong>mengubah risiko harga menjadi kepastian arus kas</strong>. Harga pasar obligasi #5 boleh jungkir-balik — kamu tidak akan menjualnya; ia akan jatuh tempo tepat saat dibutuhkan. Inilah cara dana pensiun &amp; asuransi berpikir: <em>liability-driven investing</em> — bukan &ldquo;beli obligasi murah&rdquo;, tapi &ldquo;cocokkan aset dengan kewajiban&rdquo;.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga &ldquo;yield&rdquo; jangan tertukar: <strong>coupon yield</strong> (kupon ÷ nominal — label), <strong>current yield</strong> (kupon ÷ harga pasar — snapshot), <strong>yield to maturity</strong> (IRR seluruh arus kas — yang dipakai membandingkan). Membandingkan obligasi via coupon yield = membandingkan buku dari sampulnya. <strong>YTM = satu-satunya yang comparable</strong> — dan itulah yang dikuotasikan profesional.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e4-obligasi", txt)

# ================= E5 =================
txt = load("e5-credit-spread")
toc = '''
          <li><a href="#siklus">🔧 Pendalaman: Siklus Kredit — Spread sebagai Barometer Makro</a></li>
          <li><a href="#worked4">🔬 Worked Example: Dampak Pelebaran Spread ke Portofolio</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="siklus">🔧 Pendalaman: Siklus Kredit — Membaca Nafas Ekonomi dari Spread</h2>
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

'''
txt = insert_before_quiz(txt, sec)
save("e5-credit-spread", txt)

# ================= E6 =================
txt = load("e6-ekuitas")
toc = '''
          <li><a href="#corpact">🔧 Pendalaman: Corporate Actions — Buyback, Dividen, Rights Issue</a></li>
          <li><a href="#worked4">🔬 Worked Example: Buyback Rp1 Triliun — Siapa Untung?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="corpact">🔧 Pendalaman: Corporate Actions — Tiga Cara Perusahaan &ldquo;Membayar&rdquo; Pemegang Saham</h2>
      <p>Perusahaan untung Rp1 triliun, tidak butuh ekspansi. Tiga pilihan mengembalikan ke pemegang saham:</p>
      <ul>
        <li><strong>Dividen tunai:</strong> Rp1 T dibagi ke semua pemegang saham. Kamu terima kas — <strong>kena PPh final 10%</strong> (E15!). Harga saham turun ~sebesar dividen per saham pada <em>ex-date</em> (uang keluar dari perusahaan!).</li>
        <li><strong>Buyback (pembelian kembali):</strong> perusahaan membeli sahamnya sendiri di pasar lalu <em>membakarnya</em> (treasury/delisting). Jumlah lembar berkurang &rarr; <strong>EPS naik</strong> meski laba sama &rarr; harga cenderung naik. <strong>Tidak kena pajak dividen</strong> — pajak hanya saat kamu jual (PPh final 0,1% atas transaksi!).</li>
        <li><strong>Rights issue (kebalikannya!):</strong> <em>meminta</em> uang dari pemegang saham (E1 Worked 1!) — untuk ekspansi atau bayar utang. Sinyal campuran: bagus jika untuk proyek NPV positif (E3!), buruk jika untuk menutup lubang.</li>
      </ul>
      <p><strong>Perdebatan klasik:</strong> dividen vs buyback — mana lebih baik? Teori (Modigliani-Miller): <strong>irrelevan</strong> di dunia tanpa pajak — Rp1 T keluar sebagai dividen vs Rp1 T menaikkan harga via buyback = sama bagi kekayaanmu. Praktik (dengan pajak Indonesia): <strong>buyback lebih efisien pajak</strong> (0,1% vs 10%!) — salah satu alasan buyback meledak global. Tapi dividen memberi <strong>kas pasti hari ini</strong> (pensiunan butuh makan!), sementara buyback = &ldquo;janji harga naik&rdquo; yang belum tentu terjadi.</p>
      <h2 id="worked4">🔬 Worked Example: Buyback Rp1 Triliun — Matematika &ldquo;Membakar&rdquo; Saham</h2>
      <p>MAJU: laba bersih Rp2 T, 10 miliar lembar beredar, harga Rp1.500 (market cap Rp15 T). Buyback <strong>Rp1 T</strong> @ Rp1.500, saham dibakar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Lembar dibeli &amp; dibakar:</strong> 1.000.000.000.000 ÷ 1.500 = <strong>666,7 juta lembar</strong>.</p>
        <p><strong>Langkah 2 — Lembar tersisa:</strong> 10.000 − 666,7 = <strong>9.333,3 juta</strong>.</p>
        <p><strong>Langkah 3 — EPS sebelum:</strong> 2 T ÷ 10 M = <strong>Rp200</strong>. EPS sesudah: 2 T ÷ 9.333,3 jt = <strong>Rp214,3</strong> (+7,1%!).</p>
        <p><strong>Langkah 4 — Harga &ldquo;wajar&rdquo; baru</strong> (P/E tetap 7,5×): 214,3 × 7,5 = <strong>Rp1.607</strong> (+7,1% — persis kenaikan EPS!).</p>
        <p><strong>Intuisi kritis:</strong> buyback <strong>hanya</strong> menciptakan nilai jika saham dibeli <strong>di bawah nilai wajarnya</strong>. Beli @ Rp1.500 saat nilai wajar Rp1.200 = <strong>menghancurkan nilai</strong> (membakar uang pemegang saham untuk memompa EPS kosmetik!). Inilah kenapa analis membedakan <em>buyback oportunistik</em> (saat murah — bagus) vs <em>buyback mekanis</em> (untuk menutupi dilusi opsi karyawan — netral/buruk). <strong>Jangan tepuk tangan untuk setiap buyback; tanya harganya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kalender corporate actions IDX yang wajib dipantau: <strong>cum-date</strong> (terakhir beli <em>dengan</em> hak dividen/rights), <strong>ex-date</strong> (harga menyesuaikan turun ~sebesar haknya — <em>bukan</em> &ldquo;anjlok&rdquo;!), <strong>recording date</strong>, <strong>payment date</strong>. &ldquo;Saham turun 5% saat ex-dividen&rdquo; = mekanis, bukan berita buruk. Yang <em>tidak</em> paham kalender ini akan panik menjual di ex-date — dan menyerahkan dividennya ke pembeli yang paham.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e6-ekuitas", txt)
print("OK batch11")
for s in ["e4-obligasi", "e5-credit-spread", "e6-ekuitas"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
