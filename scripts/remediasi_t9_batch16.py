#!/usr/bin/env python3
"""Remediasi T9 batch 16 (final top-up): e12, e8, e14, e9 — ~600 kata tiap lesson."""
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

# ================= E12 =================
txt = load("e12-fx-suku-bunga")
toc = '''
          <li><a href="#bedahberita">🔧 Pendalaman: Bedah Berita Kurs — Checklist Analis</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="bedahberita">🔧 Pendalaman: Bedah Berita Kurs Seperti Analis — Checklist 5 Langkah</h2>
      <p>Berita: <em>&ldquo;Rupiah melemah ke Rp16.500, tertekan!&rdquo;</em> Sebelum panik, jalankan checklist ini:</p>
      <ol>
        <li><strong>Terhadap apa?</strong> Cek DXY (indeks dolar): jika DXY naik 2% &amp; rupiah melemah 1,5% &rarr; <strong>dolar menguat global</strong>, rupiah <em>relatif</em> bertahan. Jika DXY datar &amp; rupiah melemah 1,5% &rarr; <strong>masalah domestik</strong> (arus keluar, sentimen).</li>
        <li><strong>Berapa lama?</strong> Satu hari ±1% = <em>noise</em> (likuiditas tipis, fix order). Tren 3 bulan −8% = <em>sinyal</em> (selisih bunga, neraca pembayaran).</li>
        <li><strong>Apa kata bunga?</strong> Selisih yield 10Y ID vs US melebar? &rarr; tekanan pada rupiah <em>wajar</em> (E5: spread!). Sempit tapi rupiah melemah? &rarr; cari faktor lain (politik, komoditas).</li>
        <li><strong>Apa kata BI?</strong> Cek pernyataan &amp; cadangan devisa: intervensi verbal (&ldquo;BI selalu di pasar&rdquo;) vs aktual. Cadangan turun US$5 M/bulan = <strong>intervensi berat</strong> = BI menilai pelemahan <em>berlebihan</em>.</li>
        <li><strong>Siapa yang terdampak?</strong> Importir &amp; berutang dolar (E12: mismatch!) terpukul; eksportir komoditas <em>diuntungkan</em> (terima dolar, biaya rupiah). &ldquo;Rupiah melemah&rdquo; bukan kabar buruk untuk <em>semua orang</em> — petakan <em>eksposur</em>-mu (E13!).</li>
      </ol>
      <p><strong>Hasil checklist = kalimat analis:</strong> <em>&ldquo;Rupiah melemah 1,5% sepekan — didorong penguatan dolar global (DXY +2%), bukan faktor domestik; spread yield stabil; BI intervensi ringan. Dampak: netral-negatif untuk importir, positif untuk eksportir. Level waspada: penembusan 16.800 dengan DXY datar.&rdquo;</em> — bandingkan dengan &ldquo;rupiah terpuruk!&rdquo; Paham bedanya? <strong>Itulah nilai lesson ini.</strong></p>

'''
txt = insert_before_quiz(txt, sec)
save("e12-fx-suku-bunga", txt)

# ================= E8 =================
txt = load("e8-markowitz")
toc = '''
          <li><a href="#riskparity">🔧 Pendalaman: Risk Parity — Timbangan Risiko Modern</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="riskparity">🔧 Pendalaman: Risk Parity — Saat Bobot Uang Menipu</h2>
      <p>Portofolio &ldquo;60/40&rdquo; (60% saham, 40% obligasi) terlihat seimbang. <strong>Menipu.</strong> Hitung kontribusi risikonya: saham σ=16%, obligasi σ=5%, korelasi 0,2.</p>
      <details className="worked">
        <summary>📐 Hitung kontribusi risiko (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Varians portofolio:</strong> <Tex math={String.raw`\\sigma_p^2`} /> = 0,36×0,0256 + 0,16×0,0025 + 2×0,6×0,4×0,2×0,16×0,05 = 0,009216 + 0,0004 + 0,000768 = <strong>0,010384</strong> &rarr; σp ≈ <strong>10,2%</strong>.</p>
        <p><strong>Langkah 2 — Kontribusi risiko saham:</strong> (0,36×0,0256 + 0,6×0,4×0,2×0,16×0,05) / 0,010384 = (0,009216 + 0,000384)/0,010384 ≈ <strong>92,5%</strong>!</p>
        <p><strong>Hasil:</strong> portofolio &ldquo;60/40&rdquo; = <strong>92,5% risikonya dari saham</strong>. &ldquo;Diversifikasi&rdquo;-nya kosmetik — ini <strong>portofolio saham berkedok seimbang</strong>.</p>
        <p><strong>Solusi risk parity:</strong> bobot <em>dibalik</em> proporsional risiko — misal ~25% saham / 75% obligasi agar kontribusi risiko 50/50 — lalu <strong>leverage</strong> obligasi (2×) untuk mengembalikan return ke target. Hasil: return mirip 60/40 dengan <strong>drawdown jauh lebih kecil</strong> (inilah mesin Bridgewater&apos;s All Weather!). <strong>Pelajaran:</strong> timbang <strong>risiko</strong>, bukan <strong>uang</strong>. Bobot modal ≠ bobot risiko — dan hanya yang kedua yang menentukan nasibmu di krisis.</p>
      </details>

'''
txt = insert_before_quiz(txt, sec)
save("e8-markowitz", txt)

# ================= E14 =================
txt = load("e14-money-market")
toc = '''
          <li><a href="#worked5">🔬 Worked Example: Commercial Paper vs Deposito</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="worked5">🔬 Worked Example: Commercial Paper 7% vs Deposito 5,15% — Mana?</h2>
      <p>Perusahaan AAA menerbitkan <em>commercial paper</em> (CP) 90 hari, yield <strong>7%</strong>. Deposito bankmu <strong>5,15%</strong> (E14 Worked 4!). Dana Rp500 juta, horizon 90 hari. Mana dipilih bendahara perusahaan?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Hasil deposito:</strong> 500 jt × 5,15% × (90/360) = <strong>Rp6.437.500</strong>. Dijamin LPS (≤ Rp2 M &amp; bunga wajar — E15!).</p>
        <p><strong>Langkah 2 — Hasil CP:</strong> 500 jt × 7% × (90/360) = <strong>Rp8.750.000</strong>. Selisih: <strong>+Rp2.312.500</strong>.</p>
        <p><strong>Langkah 3 — Harga selisihnya:</strong> (a) <strong>risiko kredit</strong> — CP = utang perusahaan <em>tanpa agunan &amp; tanpa LPS</em>; jika penerbit gagal (Lehman 2008!), Rp500 juta melayang; (b) <strong>likuiditas</strong> — CP tidak bisa dicairkan sebelum jatuh tempo semudah deposito (penalti/bahkan tidak ada pasar sekunder!); (c) <strong>pajak</strong> — diskonto CP kena PPh final (E15!).</p>
        <p><strong>Keputusan profesional:</strong> untuk <strong>kas operasional</strong> (gaji bulan depan!) &rarr; deposito/LPS — <em>kebutuhan likuiditas mutlak</em> (E14 Myth!). Untuk <strong>kas strategis</strong> menganggur 90 hari + penerbit AAA + diversifikasi beberapa penerbit &rarr; CP layak <em>sebagian</em>. <strong>Aturan bendahara:</strong> <em>&ldquo;jangan kejar 1,85% ekstra dengan uang yang harus ada besok pagi.&rdquo;</em></p>
      </details>

'''
txt = insert_before_quiz(txt, sec)
save("e14-money-market", txt)

# ================= E9 =================
txt = load("e9-capm")
toc = '''
          <li><a href="#levered">🔧 Pendalaman: Levered vs Unlevered Beta</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="levered">🔧 Pendalaman: Levered Beta — Memisahkan Risiko Bisnis dari Risiko Utang</h2>
      <p>Beta observasi (dari regresi — E9 Pendalaman!) = <strong>levered beta</strong>: mengandung <em>dua</em> risiko — bisnis <em>dan</em> utang. Untuk membandingkan dua perusahaan berutang beda, <strong>lepaskan dulu utangnya</strong>:</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`\\beta_{unlevered} = \\frac{\\beta_{levered}}{1 + (1-T)\\frac{D}{E}}`} block /></p>
      <details className="worked">
        <summary>📐 Contoh: dua ritel, siapa lebih berisiko bisnisnya? (klik untuk buka)</summary>
        <p><strong>Ritel A:</strong> β levered 1,4, D/E = 1,0 (utang = ekuitas), T = 22%. β<sub>u</sub> = 1,4 / (1 + 0,78×1,0) = 1,4 / 1,78 ≈ <strong>0,79</strong>.</p>
        <p><strong>Ritel B:</strong> β levered 1,1, D/E = 0,2. β<sub>u</sub> = 1,1 / (1 + 0,78×0,2) = 1,1 / 1,156 ≈ <strong>0,95</strong>.</p>
        <p><strong>Twist:</strong> beta <em>observasi</em> A (1,4) &gt; B (1,1) — tapi risiko <em>bisnis murni</em> B (0,95) &gt; A (0,79)! A terlihat &ldquo;liar&rdquo; <strong>hanya karena utangnya besar</strong> — bisnis dasarnya justru lebih stabil. <strong>Menilai manajemen A dari beta 1,4 = menghukumnya atas keputusan pendanaan, bukan operasi.</strong></p>
        <p><strong>Gunanya:</strong> analis mem-<em>unlever</em> beta pembanding se-industri → rata-ratakan → <em>relever</em> ke struktur modal target perusahaan yang dinilai → CAPM yang <strong>bersih</strong>. Inilah &ldquo;beta bottom-up&rdquo; — standar valuasi investment banking, jauh lebih stabil dari regresi mentah 2 tahun.</p>
      </details>

'''
txt = insert_before_quiz(txt, sec)
save("e9-capm", txt)
print("OK batch16")
for s in ["e12-fx-suku-bunga", "e8-markowitz", "e14-money-market", "e9-capm"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
