#!/usr/bin/env python3
"""Remediasi T9 batch 14 (final round): e13, e14, e15 — pendalaman + worked + box."""
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

# ================= E13 =================
txt = load("e13-market-risk")
toc = '''
          <li><a href="#stresstest">🔧 Pendalaman: Stress Test — Skenario 1998 untuk Bankmu</a></li>
          <li><a href="#worked4">🔬 Worked Example: Kerugian Skenario vs Modal</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="stresstest">🔧 Pendalaman: Stress Test — Melampaui &ldquo;Cuaca Kemarin&rdquo;</h2>
      <p>VaR/ES menjawab &ldquo;seberapa buruk hari <em>biasa yang buruk</em>&rdquo;. <strong>Stress test</strong> menjawab &ldquo;seberapa buruk jika <strong>sejarah terburuk terulang</strong>&rdquo;. Regulator (OJK, BI, Basel) <em>mewajibkan</em> bank menjalankan keduanya:</p>
      <ul>
        <li><strong>Stress historis:</strong> terapkan kembali guncangan 1998 / 2008 / 2020 ke portofolio <em>hari ini</em>. &ldquo;Jika rupiah jatuh 80% + bunga naik 500 bps + IHSG −50% seperti 1998 — berapa modal kita yang hilang?&rdquo;</li>
        <li><strong>Stress hipotetis:</strong> skenario yang <em>belum pernah</em> terjadi: &ldquo;harga minyak US$200 + rupiah 20.000 + BI rate 12% bersamaan&rdquo;. Dirancang dari <em>kelemahan portofolio</em> (reverse stress test: &ldquo;skenario apa yang membuat kita bangkrut? lalu seberapa mungkin itu?&rdquo;).</li>
        <li><strong>Kenapa wajib:</strong> VaR 99% <em>by design</em> buta terhadap 1% terburuk — padahal <strong>1% itulah yang membunuh bank</strong> (2008!). Stress test = melihat langsung ke jurang yang VaR abaikan.</li>
      </ul>
      <p><strong>Aturan main yang benar:</strong> (1) skenario harus <strong>parah tapi masuk akal</strong> (<em>severe but plausible</em>) — bukan kiamat; (2) <strong>konsisten lintas risiko</strong> — skenario &ldquo;resesi&rdquo; harus memukul kredit (default naik — E5!), pasar (harga jatuh), <em>dan</em> likuiditas (sulit jual!) <strong>bersamaan</strong> — karena di krisis semuanya terjadi bersamaan (E8: korelasi → 1!); (3) hasilnya <strong>ditindaklanjuti</strong> — tambah modal, kurangi limit, siapkan <em>contingency funding</em>. Stress test yang hasilnya hanya jadi laporan = teater.</p>
      <h2 id="worked4">🔬 Worked Example: Bank &ldquo;Aman&rdquo; vs Skenario 1998</h2>
      <p>Bank Aman: modal inti (CET1) <strong>Rp20 T</strong>, aset tertimbang menurut risiko (ATMR) <strong>Rp200 T</strong> &rarr; rasio CET1 = <strong>10%</strong> (di atas minimum ~8,5%). Terapkan stress 1998-lite: kredit macet (NPL) naik → kerugian kredit <strong>Rp12 T</strong>; portofolio obligasi rugi mark-to-market <strong>Rp4 T</strong>.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Total kerugian stress:</strong> 12 + 4 = <strong>Rp16 T</strong>.</p>
        <p><strong>Langkah 2 — Modal tersisa:</strong> 20 − 16 = <strong>Rp4 T</strong> &rarr; rasio CET1 baru = 4/200 = <strong>2%</strong> — <em>jauh</em> di bawah minimum!</p>
        <p><strong>Langkah 3 — Tindak lanjut:</strong> bank harus <strong>menambah modal Rp13 T</strong> (untuk kembali ke 8,5%: 0,085×200 − 4) <em>sebelum</em> krisis — via laba ditahan, penerbitan saham, atau pengurangan aset berisiko. Inilah <strong>guna</strong> stress test: memaksa bank <em>siap</em> saat langit masih cerah.</p>
        <p><strong>Intuisi:</strong> rasio modal 10% terlihat &ldquo;aman&rdquo; — tapi <strong>aman terhadap apa?</strong> Tanpa skenario, angka modal = angka kosong. Stress test mengubah &ldquo;Rp20 T&rdquo; menjadi kalimat: <em>&ldquo;cukup untuk badai 1998-lite, tidak cukup untuk 1998 penuh.&rdquo;</em> <strong>Risiko selalu relatif terhadap skenario.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Bank dengan modal besar pasti aman dari krisis.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> modal besar = <strong>peredam lebih tebal</strong>, bukan jaminan. 2008: bank-bank dengan modal &ldquo;cukup&rdquo; tumbang karena <strong>likuiditas</strong> (tidak bisa menjual aset / tidak ada yang mau meminjamkan — E14!) — bukan karena modal habis duluan. <strong>Modal menyerap kerugian; likuiditas menjaga napas.</strong> Bank butuh keduanya — dan stress test modern menguji keduanya (<em>solvency</em> + <em>liquidity stress</em>).</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e13-market-risk", txt)

# ================= E14 =================
txt = load("e14-money-market")
toc = '''
          <li><a href="#opt">🔧 Pendalaman: Operasi Pasar Terbuka — Cara BI Menyetir Bunga</a></li>
          <li><a href="#worked4">🔬 Worked Example: Transmisi BI Rate ke Deposito</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="opt">🔧 Pendalaman: Operasi Pasar Terbuka — Tangan BI di Pasar Uang</h2>
      <p>BI Rate diumumkan — tapi <em>bagaimana</em> BI &ldquo;memaksa&rdquo; bunga pasar mengikutinya? Lewat <strong>Operasi Pasar Terbuka (OPT)</strong> di pasar uang:</p>
      <ul>
        <li><strong>BI ingin bunga NAIK</strong> (lawan inflasi): <strong>jual SRBI/SBN</strong> ke pasar &rarr; rupiah tersedot dari peredaran &rarr; likuiditas ketat &rarr; bunga antar bank naik mengikuti. (Seperti melepas udara dari balon likuiditas.)</li>
        <li><strong>BI ingin bunga TURUN</strong> (stimulus): <strong>beli SBN</strong> dari pasar (<em>quantitative easing</em> versi Indonesia) &rarr; rupiah membanjir &rarr; bunga turun.</li>
        <li><strong>Target operasionalnya:</strong> suku bunga antar bank overnight (<strong>INDONIA</strong>) dijaga <em>di sekitar</em> BI Rate — jika INDONIA melenceng jauh, artinya transmisi macet dan BI menambah/mengurangi OPT.</li>
      </ul>
      <p><strong>Rantai transmisi lengkap:</strong> BI Rate → OPT → INDONIA/pasar uang → <strong>bunga deposito &amp; kredit bank</strong> → konsumsi/investasi → <strong>inflasi &amp; pertumbuhan</strong> → kembali ke keputusan BI Rate berikutnya. <strong>Satu lingkaran kebijakan.</strong> Setiap mata rantai bisa &ldquo;bocor&rdquo;: bank yang tidak meneruskan penurunan bunga ke kredit (margin!), ekspektasi inflasi yang bandel, atau guncangan global (E12!).</p>
      <h2 id="worked4">🔬 Worked Example: BI Rate Turun 0,5% — Berapa yang Sampai ke Kamu?</h2>
      <p>BI memangkas rate 7,00% → <strong>6,50%</strong> (−50 bps). Deposito 1 tahun bankmu saat ini <strong>5,5%</strong>. Berapa deposito barumu — dan berapa penghematan cicilan KPR Rp500 juta?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Transmisi ke deposito:</strong> bank biasanya meneruskan <strong>60–80%</strong> (tidak penuh — margin!). Asumsi 70%: deposito baru ≈ 5,5% − (0,70 × 0,5%) = 5,5% − 0,35% = <strong>5,15%</strong>. Deposito Rp100 juta: bunga tahunan turun Rp5,5 jt → Rp5,15 jt (<strong>−Rp350 ribu</strong>).</p>
        <p><strong>Langkah 2 — Transmisi ke KPR</strong> (floating 9%): turun 0,35% → 8,65%. Cicilan tahunan baru (E3!): A = 500 × 0,0865/(1 − 1,0865<sup>−20</sup>). 1,0865<sup>20</sup> ≈ 5,24 &rarr; A ≈ 500 × 0,0865/0,809 ≈ <strong>Rp53,5 juta</strong> (dari Rp54,8 juta) — <strong>hemat Rp1,3 juta/tahun</strong>.</p>
        <p><strong>Intuisi ganda:</strong> (a) <strong>penabung &ldquo;dirugikan&rdquo;, peminjam &ldquo;diuntungkan&rdquo;</strong> — pemangkasan bunga = <em>transfer</em> dari penabung ke peminjam (inilah kenapa pensiunan protes saat bunga turun!); (b) <strong>transmisi tidak 1:1</strong> — &ldquo;BI turunkan bunga&rdquo; ≠ &ldquo;cicilanmu turun sama besar&rdquo;. Selalu cek <em>berapa yang diteruskan bankmu</em> — dan <strong>tawar</strong> (bank bersaing untuk dana &amp; debitur!).</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>INDONIA</strong> = &ldquo;denyut nadi&rdquo; pasar uang Indonesia (rata-rata bunga pinjaman antar bank overnight). Jika INDONIA <em>di atas</em> BI Rate = likuiditas ketat (bank berebut kas — waspada!). Jika <em>di bawah</em> = longgar. Analis treasury memantau selisih ini <strong>setiap pagi</strong> — ia adalah <em>tekanan darah</em> sistem keuangan: normal = sehat, abnormal = periksa segera.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e14-money-market", txt)

# ================= E15 =================
txt = load("e15-indonesia")
toc = '''
          <li><a href="#kendaraan">🔧 Pendalaman: Memilih Kendaraan — Saham vs Reksa Dana vs ETF</a></li>
          <li><a href="#worked4">🔬 Worked Example: Rp10 Juta — Tiga Kendaraan, Tiga Hasil</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="kendaraan">🔧 Pendalaman: Memilih Kendaraan Investasi yang Tepat</h2>
      <p>Investor pemula Indonesia menghadapi tiga &ldquo;kendaraan&rdquo; utama ke pasar saham. Pilih dengan matriks ini:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Aspek</th><th>Saham langsung</th><th>Reksa dana saham</th><th>ETF indeks</th></tr></thead>
        <tbody>
          <tr><td>Modal minimum</td><td>1 lot (~Rp5 rb–jutaan)</td><td>Rp10–100 rb</td><td>1 lot</td></tr>
          <tr><td>Biaya tahunan</td><td>Fee transaksi saja</td><td>1–3% (manajer + bank kustodian)</td><td>~0,1–0,5%</td></tr>
          <tr><td>Diversifikasi</td><td>Manual (butuh modal besar)</td><td>Otomatis</td><td>Otomatis (ikut indeks)</td></tr>
          <tr><td>Kontrol</td><td>Penuh</td><td>Nol (ikut manajer)</td><td>Ikut indeks</td></tr>
          <tr><td>Cocok untuk</td><td>Yang mau belajar analisis</td><td>Nabung rutin autopilot</td><td>Inti portofolio murah</td></tr>
        </tbody>
      </table>
      </div>
      <p><strong>Rekomendasi berlapis (bukan nasihat personal!):</strong> <strong>fondasi</strong> = ETF indeks berbiaya rendah (aritmetika fee E16!); <strong>satelit belajar</strong> = 1–3 saham pilihan untuk melatih analisis (E18!) dengan uang yang <em>rela hilang</em>; <strong>autopilot</strong> = reksa dana untuk nabung rutin jika tidak mau repot. Hindari: reksa dana saham berfee 3% <em>tanpa</em> alpha terbukti (E9!) — kamu membayar mahal untuk hasil indeks.</p>
      <h2 id="worked4">🔬 Worked Example: Rp10 Juta/Bulan, 10 Tahun — Biaya Menentukan Pemenang</h2>
      <p>Nabung <strong>Rp10 juta/bulan</strong> selama 10 tahun (total setor Rp1,2 M), return pasar kotor 10%/tahun. Bandingkan: (A) reksa dana aktif fee 2,5%; (B) ETF fee 0,3%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus nilai anuitas masa depan:</strong> <Tex math={String.raw`FV = PMT \\times \\frac{(1+r)^n - 1}{r}`} />, dengan PMT = 120 jt/tahun, r = return bersih, n = 10.</p>
        <p><strong>(A) fee 2,5%:</strong> r = 7,5%. (1,075)<sup>10</sup> ≈ 2,061 &rarr; FV = 120 × (1,061/0,075) = 120 × 14,147 = <strong>Rp1.698 juta</strong>.</p>
        <p><strong>(B) fee 0,3%:</strong> r = 9,7%. (1,097)<sup>10</sup> ≈ 2,522 &rarr; FV = 120 × (1,522/0,097) = 120 × 15,691 = <strong>Rp1.883 juta</strong>.</p>
        <p><strong>Selisih: Rp185 juta</strong> — dari &ldquo;hanya&rdquo; 2,2% fee! Dan ini <em>belum</em> termasuk: (a) <strong>pajak</strong> — reksa dana &amp; ETF sama-sama efisien (tidak ada dividen tunai berkala yang kena PPh 10% jika reinvestasi internal); (b) <strong>biaya transaksi</strong> beli/jual ETF (fee broker 0,15–0,25% — kecil untuk nabung rutin).</p>
        <p><strong>Intuisi penutup:</strong> Rp185 juta = <strong>1,5 tahun setoranmu</strong> — hilang menjadi fee. Sebelum memilih produk, hitung <em>total biaya 10 tahun</em> (bukan &ldquo;fee per tahun terlihat kecil&rdquo;). <strong>Biaya = satu-satunya &ldquo;return&rdquo; yang pasti negatif.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Reksa dana = pasti lebih aman dari saham langsung.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> reksa dana saham = <strong>kumpulan saham</strong> — risikonya = risiko pasar sahamnya (bisa −30% juga!). Yang &ldquo;lebih aman&rdquo; hanya <strong>diversifikasinya</strong> (tidak all-in 1 saham) — bukan <em>perlindungan nilai</em>. &ldquo;Aman&rdquo; yang sesungguhnya hanya ada di: <strong>reksa dana pasar uang</strong> (risiko rendah, return rendah) dan <strong>deposito LPS</strong>. Jangan samakan &ldquo;dikelola profesional&rdquo; dengan &ldquo;dijamin&rdquo; — manajer profesional pun rugi saat pasar jatuh (E16: 90% kalah dari indeks!).</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e15-indonesia", txt)
print("OK batch14")
for s in ["e13-market-risk", "e14-money-market", "e15-indonesia"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
