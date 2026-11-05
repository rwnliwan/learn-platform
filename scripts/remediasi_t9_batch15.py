#!/usr/bin/env python3
"""Remediasi T9 batch 15 (final round): e16, e17, e18 — pendalaman + worked + box."""
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

# ================= E16 =================
txt = load("e16-efisiensi-pasar")
toc = '''
          <li><a href="#behavioral">🔧 Pendalaman: Behavioral Finance — Musuh di Dalam Kepala</a></li>
          <li><a href="#worked4">🔬 Worked Example: Harga Loss Aversion</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="behavioral">🔧 Pendalaman: Behavioral Finance — Jika Pasar (Hampir) Efisien, Kenapa Kita Kalah?</h2>
      <p>Jawaban E16: <strong>biaya</strong>. Jawaban pelengkap: <strong>otakmu</strong>. <em>Behavioral finance</em> (Kahneman-Tversky, Thaler — Nobel!) memetakan bias yang membuat investor <em>sistematis</em> merugi:</p>
      <ul>
        <li><strong>Loss aversion:</strong> rasa sakit rugi Rp1 juta ≈ <strong>2×</strong> senangnya untung Rp1 juta. Akibat: <em>menahan saham rugi</em> (&ldquo;nanti balik&rdquo;) + <em>menjual saham untung terlalu cepat</em> (<em>disposition effect</em>) — portofolio penuh &ldquo;mayat&rdquo; yang dipertahankan &amp; &ldquo;bintang&rdquo; yang dijual prematur.</li>
        <li><strong>Overconfidence:</strong> 80%+ investor merasa &ldquo;di atas rata-rata&rdquo; (mustahil secara statistik!). Akibat: <strong>overtrading</strong> — studi Odean: investor yang paling sering trading <em>underperform</em> ~6%/tahun vs yang diam (biaya + keputusan buruk!).</li>
        <li><strong>Recency bias:</strong> &ldquo;saham naik 3 tahun &rarr; akan naik terus&rdquo;. Akibat: <strong>beli di puncak</strong> (FOMO 2021!) &amp; <strong>jual di dasar</strong> (panik 2020!) — kebalikan dari rebalancing E8.</li>
        <li><strong>Anchoring:</strong> &ldquo;beli @ Rp2.000, kini Rp1.200 — tunggu balik ke 2.000&rdquo;. Harga belimu = <strong>jangkar arbitrer</strong> yang tidak ada hubungannya dengan nilai wajar (E6!). Keputusan sehat: <em>&ldquo;apakah aku beli hari ini di Rp1.200?&rdquo;</em> — jika tidak, jual.</li>
        <li><strong>Herding:</strong> &ldquo;semua beli, masa aku tidak?&rdquo; — bahan bakar gelembung &amp; crash (GME 2021 kedua sisinya!).</li>
      </ul>
      <p><strong>Pertahanan sistematis (bukan tekad!):</strong> (1) <strong>aturan tertulis</strong> — kriteria beli/jual <em>sebelum</em> emosi datang (E8: rebalancing bands!); (2) <strong>otomatisasi</strong> — nabung rutin ETF (E15) memotong FOMO &amp; panik sekaligus; (3) <strong>jurnal keputusan</strong> — tulis <em>alasan</em> tiap transaksi; review tiap 6 bulan untuk melihat biasmu sendiri beraksi; (4) <strong>pre-mortem</strong> — sebelum beli, tulis: &ldquo;setahun lagi investasi ini gagal — apa penyebabnya?&rdquo; (memaksa otak mencari bukti <em>kontra</em>).</p>
      <h2 id="worked4">🔬 Worked Example: Harga Loss Aversion — Rp2 Juta yang Hilang Diam-Diam</h2>
      <p>Portofolio Rp50 juta: Saham A (beli Rp20 jt → kini <strong>Rp14 jt</strong>, −30%), Saham B (beli Rp20 jt → kini <strong>Rp28 jt</strong>, +40%), Kas Rp10 jt. Kamu butuh <strong>Rp8 juta</strong> tunai. Mana yang dijual?</p>
      <details className="worked">
        <summary>📐 Analisis langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Pilihan naluriah (disposition effect):</strong> jual B (untung!) — &ldquo;kunci keuntungan&rdquo;, pertahankan A — &ldquo;nanti balik ke 20 jt&rdquo;. Jual Rp8 jt dari B (tersisa Rp20 jt B).</p>
        <p><strong>Pertanyaan rasional:</strong> lupakan harga beli (sunk cost!). Tanya: <em>&ldquo;dengan Rp34 jt (A+B kini), bagaimana alokasi terbaik ke depan?&rdquo;</em> Jika analisis fundamental (E18!) bilang prospek A <em>memburuk</em> &amp; B <em>membaik</em> — menjual B = <strong>menjual pemenang &amp; memelihara pecundang</strong>!</p>
        <p><strong>Hitung biaya biasnya:</strong> misal setahun kemudian A → Rp10 jt (−29% lagi), B → Rp36 jt (+29%). Skenario naluriah: A 14→10 (rugi 4) + B 20→25,7 (untung 5,7, setelah jual 8) = <strong>Rp35,7 jt</strong>. Skenario rasional (jual A Rp8 jt, pegang B penuh): A 6→4,3 + B 28→36 = <strong>Rp40,3 jt</strong>. <strong>Selisih: Rp4,6 juta</strong> — harga satu keputusan bias.</p>
        <p><strong>Intuisi:</strong> <em>&ldquo;harga belimu adalah sejarah, bukan strategi.&rdquo;</em> Setiap hari portofoliomu = <strong>keputusan baru</strong>: &ldquo;apakah aku <em>membeli</em> komposisi ini hari ini?&rdquo; Jika tidak — ubah. Pajak 0,1% atas penjualan (E15) jauh lebih murah dari Rp4,6 juta bias.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> gabungkan E16 + behavioral: pasar <em>cukup efisien</em> sehingga edge informasimu kecil, <strong>dan</strong> otakmu bias sehingga ekseksimu buruk — <em>kombinasi mematikan</em> bagi stock-picker aktif. Solusi yang didukung data: <strong>ETF indeks murah (netralisir efisiensi) + aturan otomatis (netralisir bias)</strong>. &ldquo;Kecerdasan&rdquo; investasimu bukan di memilih saham — melainkan di <strong>merancang sistem yang kebal terhadap dirimu sendiri</strong>.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e16-efisiensi-pasar", txt)

# ================= E17 =================
txt = load("e17-makro-siklus")
toc = '''
          <li><a href="#dalio">🔧 Pendalaman: Siklus Utang Besar Ray Dalio</a></li>
          <li><a href="#worked4">🔬 Worked Example: Rasio Utang/PDB — Kapan Berbahaya?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="dalio">🔧 Pendalaman: Siklus Utang Besar (<em>Big Debt Cycle</em>) — Pola 75 Tahunan</h2>
      <p>Ray Dalio (Bridgewater) berargumen: di balik siklus bisnis pendek (5–10 tahun, E17!), ada <strong>siklus utang besar 50–75 tahun</strong> yang berakhir dengan <em>deleveraging</em> menyakitkan atau krisis. Mekaniknya:</p>
      <ol>
        <li><strong>Fase ekspansi utang:</strong> bunga rendah + optimisme &rarr; utang tumbuh <em>lebih cepat</em> dari pendapatan. Terlihat makmur (PDB naik!) — tapi <strong>pertumbuhan dibeli dengan utang</strong> (E17 Worked 2: &ldquo;dibiayai apa?&rdquo;).</li>
        <li><strong>Titik jenuh:</strong> beban bunga ≈ batas kemampuan bayar. Bank sentral <em>tidak bisa</em> menurunkan bunga lagi (sudah ~0% — 2010-an!) &rarr; <strong>jebakan likuiditas</strong>.</li>
        <li><strong>Deleveraging:</strong> utang harus turun — lewat <strong>(a)</strong> penghematan menyakitkan (depresi), <strong>(b)</strong> restrukturisasi/default massal, <strong>(c)</strong> cetak uang (inflasi — &ldquo;pajak tersembunyi&rdquo; atas penabung!), atau <strong>(d)</strong> redistribusi. 2008 = (a)+(b); 2020–2022 = (c).</li>
      </ol>
      <p><strong>Indikator fase:</strong> <strong>rasio utang/PDB</strong> total (pemerintah + swasta) yang terus menanjak tiap siklus; <strong>suku bunga riil mendekati nol/negatif</strong> (E3!); <strong>ketimpangan</strong> melebar (utang menguntungkan pemilik aset). Dalio kontroversial — tapi kerangkanya memaksa pertanyaan yang benar: <em>&ldquo;pertumbuhan ini organik atau berutang?&rdquo;</em></p>
      <h2 id="worked4">🔬 Worked Example: Membaca Rasio Utang — Tiga Negara</h2>
      <details className="worked">
        <summary>📐 Tiga studi kasus (klik untuk buka)</summary>
        <p><strong>Kasus A — Jepang:</strong> utang pemerintah ~260% PDB (tertinggi dunia maju!). Tapi: 90%+ dipegang <strong>domestik</strong>, bank sentral memegang ~50%, suku bunga ~0%. <strong>Kesimpulan:</strong> rasio mengerikan, risiko krisis <em>rendah</em> (tidak bergantung kreditur asing; bisa cetak yen). Pelajaran: <strong>struktur utang &gt; angka utang.</strong></p>
        <p><strong>Kasus B — Indonesia 1998:</strong> utang pemerintah &ldquo;hanya&rdquo; ~60% PDB — tapi <strong>utang swasta berdenominasi dolar</strong> masif + cadangan devisa tipis. <strong>Kesimpulan:</strong> angka &ldquo;kecil&rdquo;, risiko <em>ekstrem</em> (currency mismatch — E12!). Pelajaran: <strong>denominasi &amp; jatuh tempo &gt; angka.</strong></p>
        <p><strong>Kasus C — AS kini:</strong> utang federal &gt;120% PDB + defisit persisten + bunga tinggi (2022+). Beban bunga &gt; anggaran pertahanan! <strong>Kesimpulan:</strong> &ldquo;istimewa&rdquo; karena dolar = cadangan dunia (masih ada pembeli!), tapi lintasannya <strong>tidak sustain</strong> — pasar obligasi suatu hari bisa menuntut premi (E4: yield naik &rarr; harga jatuh &rarr; 2022 terulang?).</p>
        <p><strong>Aturan baca:</strong> jangan tanya &ldquo;utangnya besar?&rdquo; — tanya <strong>(1)</strong> siapa krediturnya? <strong>(2)</strong> denominasi apa? <strong>(3)</strong> untuk apa utangnya (produktif vs konsumtif)? <strong>(4)</strong> bagaimana lintasan bunga vs pertumbuhannya (<em>r vs g</em>: jika bunga &gt; pertumbuhan, rasio <em>otomatis</em> memburuk!). Empat jawaban = diagnosis; satu angka = tebakan.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang pemerintah seperti utang rumah tangga — harus dilunasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> pemerintah (berdaulat, bermata uang sendiri) <strong>tidak pernah &ldquo;melunasi&rdquo;</strong> — ia <em>me-rollover</em> (terbitkan baru untuk bayar yang jatuh tempo) <em>selamanya</em>. Yang penting bukan &ldquo;lunas&rdquo;, melainkan <strong>lintasan rasio utang/PDB</strong>: jika PDB tumbuh &gt; bunga, rasio turun <em>sendiri</em> tanpa pelunasan. Analogi rumah tangga = <strong>menyesatkan total</strong> — rumah tangga tidak bisa mencetak rupiah, menaikkan pajak, atau hidup selamanya. (Pengecualian: utang <em>valas</em> — di situlah 1998 terjadi!)</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e17-makro-siklus", txt)

# ================= E18 =================
txt = load("e18-laporan-keuangan")
toc = '''
          <li><a href="#eveh">🔧 Pendalaman: EV/EBITDA — Valuasi yang Netral Utang</a></li>
          <li><a href="#worked4">🔬 Worked Example: P/E Menipu, EV/EBITDA Jujur</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="eveh">🔧 Pendalaman: EV/EBITDA — Saat P/E Dibutakan Utang</h2>
      <p>P/E (E6) membandingkan harga <em>ekuitas</em> dengan laba <em>ekuitas</em> — tapi dua perusahaan identik operasinya bisa punya P/E beda jauh <strong>hanya karena struktur utangnya beda</strong> (E18 Worked 1: leverage!). Solusi analis: <strong>EV/EBITDA</strong>.</p>
      <ul>
        <li><strong>EV (<em>enterprise value</em>)</strong> = market cap + utang berbunga − kas = <strong>&ldquo;harga beli seluruh perusahaan&rdquo;</strong> (bayar pemegang saham <em>dan</em> lunasi kreditor, dikurangi kas yang ikut dibeli).</li>
        <li><strong>EBITDA</strong> = laba sebelum bunga, pajak, depresiasi, amortisasi ≈ <strong>proksi arus kas operasi</strong> (kasar tapi sebanding antar perusahaan).</li>
        <li><strong>EV/EBITDA</strong> = &ldquo;berapa tahun arus kas operasi untuk membayar seluruh perusahaan?&rdquo; — <strong>netral terhadap struktur modal</strong> (utang vs ekuitas tidak memengaruhi pembilang <em>dan</em> penyebut secara bias).</li>
      </ul>
      <p><strong>Kapan memakai apa:</strong> P/E — cepat, populer, tapi buta utang (cocok untuk bank? <em>tidak</em> — bank = utang adalah bahan bakunya! pakai P/B). EV/EBITDA — standar <em>investment banking</em> untuk akuisisi &amp; pembanding lintas struktur modal. EV/Sales — untuk startup <em>pre-profit</em> (dengan hati-hati!). <strong>Tidak ada rasio yang universal</strong> — ada rasio yang <em>tepat untuk pertanyaannya</em>.</p>
      <h2 id="worked4">🔬 Worked Example: Dua Perusahaan Kembar — P/E Berbohong</h2>
      <p>SEHAT vs SEKARAT versi sederhana. Keduanya: nilai operasi (EV) <strong>Rp3.000 M</strong>, EBITDA <strong>Rp300 M</strong> &rarr; EV/EBITDA = <strong>10×</strong> (identik!). Struktur modal:</p>
      <ul>
        <li>SEHAT: utang Rp500 M, kas Rp200 M &rarr; market cap = 3.000 − 500 + 200 = <strong>Rp2.700 M</strong>. Laba bersih Rp150 M &rarr; P/E = 2.700/150 = <strong>18×</strong>.</li>
        <li>SEKARAT: utang Rp2.000 M, kas Rp100 M &rarr; market cap = 3.000 − 2.000 + 100 = <strong>Rp1.100 M</strong>. Laba bersih (setelah bunga besar!) Rp60 M &rarr; P/E = 1.100/60 = <strong>18,3×</strong>.</li>
      </ul>
      <details className="worked">
        <summary>📐 Analisis (klik untuk buka)</summary>
        <p><strong>P/E berkata:</strong> &ldquo;keduanya ~18× — valuasi sama.&rdquo; <strong>EV/EBITDA berkata:</strong> &ldquo;keduanya 10× — operasi sama.&rdquo; <strong>Keduanya benar — dan keduanya menyembunyikan yang penting:</strong> SEKARAT menanggung <strong>utang 4× lipat</strong> (risiko kebangkrutan jauh lebih tinggi — E5!).</p>
        <p><strong>Yang harus ditanya analis:</strong> <em>kenapa</em> SEKARAT berutang Rp2.000 M? Jika untuk ekspansi produktif (E3: NPV positif!) = wajar. Jika untuk menutup kerugian operasi = <strong>bendera merah</strong> (E18 red flags!). <strong>Rasio memberi angka; struktur modal memberi konteks; arus kas memberi kebenaran.</strong> Tiga lapis — jangan pernah berhenti di lapis pertama.</p>
        <p><strong>Latihan mandiri (2 menit):</strong> ambil satu emiten IDX favoritmu. Hitung: (1) P/E, (2) EV/EBITDA (EV = market cap + utang berbunga − kas; dari laporan kuartalan), (3) Debt/Equity, (4) kas operasi ÷ laba bersih. Jika (4) &lt; 0,5 dua tahun beruntun — <strong>selidiki sebelum kagum</strong>. Inilah <em>workflow</em> analis ekuitas junior dalam 4 angka.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci penutup:</strong> seluruh T9 dalam satu kalimat per lesson — E1: <em>uang ke emiten vs antar investor</em> • E2: <em>pahami aturan main instrumen</em> • E3: <em>samakan zona waktu uang</em> • E4: <em>harga vs yield berlawanan</em> • E5: <em>spread = harga ketakutan</em> • E6: <em>harga ≠ nilai</em> • E7: <em>risiko = medan, bukan destinasi</em> • E8: <em>korelasi = mesin diversifikasi</em> • E9: <em>risiko sistematis yang dihargai</em> • E10: <em>derivatif = transfer risiko</em> • E11: <em>vol = satu-satunya tebakan</em> • E12: <em>kurs = dua sisi</em> • E13: <em>VaR = speedometer</em> • E14: <em>pasar uang = plumbing</em> • E15: <em>verifikasi sebelum transfer</em> • E16: <em>kalahkan biaya &amp; biasmu</em> • E17: <em>sinyal = probabilitas</em> • E18: <em>laba = opini, kas = fakta</em>. <strong>Hafalkan 18 kalimat ini — kamu membawa T9 ke mana pun.</strong></p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e18-laporan-keuangan", txt)
print("OK batch15")
for s in ["e16-efisiensi-pasar", "e17-makro-siklus", "e18-laporan-keuangan"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
