#!/usr/bin/env python3
"""Remediasi T9 batch 13 (final round): e10, e11, e12 — pendalaman + worked + box."""
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

# ================= E10 =================
txt = load("e10-derivatif")
toc = '''
          <li><a href="#swap">🔧 Pendalaman: Swap — Pertukaran Arus Kas</a></li>
          <li><a href="#worked4">🔬 Worked Example: Interest Rate Swap — Siapa Bayar ke Siapa?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="swap">🔧 Pendalaman: Swap — Derivatif Terbesar yang Tak Pernah Kamu Dengar</h2>
      <p>Pasar derivatif terbesar di dunia bukan opsi, bukan futures — melainkan <strong>interest rate swap (IRS)</strong>: nosional ratusan <em>triliun</em> dolar. Mekaniknya sederhana — <strong>dua pihak saling bertukar arus kas bunga</strong>:</p>
      <ul>
        <li><strong>Struktur tipikal:</strong> Pihak A membayar <strong>bunga tetap</strong> (misal 6%), menerima <strong>bunga mengambang</strong> (misal JIBOR/SOFR + spread). Pihak B sebaliknya. <strong>Pokok tidak dipertukarkan</strong> — hanya <em>selisih bunganya</em> (netting!).</li>
        <li><strong>Kenapa ada yang mau?</strong> Perusahaan X berutang <em>floating</em> (takut bunga naik) &rarr; swap menjadi <em>fixed</em> (kepastian — jiwanya Pak Tani!). Perusahaan Y berutang <em>fixed</em> tapi yakin bunga turun &rarr; swap menjadi <em>floating</em>. <strong>Keduanya mendapat yang diinginkan tanpa melunasi &amp; menerbitkan ulang utang</strong> (yang mahal &amp; lama).</li>
        <li><strong>Keunggulan komparatif:</strong> X bisa pinjam fixed murah tapi <em>ingin</em> floating; Y bisa pinjam floating murah tapi <em>ingin</em> fixed &rarr; pinjam di pasar masing-masing yang termurah, lalu <strong>swap</strong> — keduanya lebih hemat! (Teori yang sama dengan perdagangan internasional — Ricardo di pasar modal.)</li>
      </ul>
      <p><strong>Risiko yang sering dilupakan:</strong> swap = kontrak <strong>jangka panjang bilateral</strong> (5–10 tahun!) &rarr; <strong>risiko counterparty</strong> (E1!) — jika lawan bangkrut, lindung nilaimu hilang <em>tepat saat kamu paling butuh</em> (2008!). Makanya pasca-2008 swap standar <strong>wajib kliring terpusat</strong> (<em>central clearing</em>).</p>
      <h2 id="worked4">🔬 Worked Example: IRS Rp100 Miliar — Simulasi 2 Tahun</h2>
      <p>PT Maju berutang Rp100 M <em>floating</em> (JIBOR + 1%). Takut bunga naik, ia swap: <strong>bayar fixed 7%</strong>, terima JIBOR + 1%. Tahun 1 JIBOR = 5%; Tahun 2 JIBOR = 8%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Tahun 1 (JIBOR 5%):</strong> bayar fixed: 7% × 100 M = Rp7 M. Terima: (5%+1%) × 100 M = Rp6 M. <strong>Net: bayar Rp1 M</strong> ke lawan swap. Total biaya utang: floating (6 M) + net swap (1 M) = <strong>Rp7 M = 7% fixed</strong>. ✓ (Tanpa swap: 6 M — swap &ldquo;merugikan&rdquo; Rp1 M tahun ini!)</p>
        <p><strong>Tahun 2 (JIBOR 8%):</strong> bayar fixed Rp7 M. Terima: 9% × 100 M = Rp9 M. <strong>Net: terima Rp2 M</strong>. Total biaya: 9 M − 2 M = <strong>Rp7 M = 7% fixed</strong>. ✓ (Tanpa swap: Rp9 M — swap <em>menghemat</em> Rp2 M!)</p>
        <p><strong>Intuisi:</strong> swap <strong>bukan</strong> alat mencari untung — ia alat membeli <strong>kepastian</strong> (7% pasti, 2 tahun). Tahun 1 &ldquo;rugi&rdquo; Rp1 M = <strong>premi kepastian</strong> (seperti premi asuransi — E10!). CFO yang paham tidak menyesali tahun 1 — ia <em>membayar untuk tidur nyenyak</em>. Yang tidak paham akan memaki swap-nya setiap kali JIBOR turun. <strong>Hedging yang disesali saat berhasil = hedging yang tidak dipahami tujuannya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> semua derivatif menjawab <strong>satu</strong> dari tiga kebutuhan: <strong>(1) lindung nilai</strong> (<em>hedge</em> — Pak Tani, PT Maju: <em>mengurangi</em> risiko yang sudah ada); <strong>(2) spekulasi</strong> (<em>menambah</em> risiko untuk return — harus sadar &amp; terukur); <strong>(3) arbitrase</strong> (<em>mengunci</em> selisih harga bebas risiko — Worked 2 E12!). Sebelum menyentuh derivatif apa pun, tulis satu kalimat: <em>&ldquo;saya memakai ini untuk nomor berapa?&rdquo;</em> — jika jawabannya kabur, jangan sentuh.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e10-derivatif", txt)

# ================= E11 =================
txt = load("e11-black-scholes")
toc = '''
          <li><a href="#paritas">🔧 Pendalaman: Put-Call Parity — Persamaan yang Tak Bisa Bohong</a></li>
          <li><a href="#worked4">🔬 Worked Example: Arbitrase Paritas — Uang Gratis?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="paritas">🔧 Pendalaman: Put-Call Parity — Satu Persamaan, Empat Instrumen</h2>
      <p>Hubungan arbitrase paling elegan di derivatif — <strong>put-call parity</strong> (untuk opsi Eropa, saham tanpa dividen):</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`C - P = S - K e^{-rT}`} block /></p>
      <p>Dibaca sebagai <strong>resep masak</strong>:</p>
      <ul>
        <li><strong>Beli call + jual put</strong> (kiri: <Tex math={String.raw`C - P`} />) = <strong>persis</strong> seperti <strong>memegang saham + meminjam PV strike</strong> (kanan). Kenapa? Saat expiry: jika S &gt; K: call untung (S−K), put hangus → net S−K. Jika S &lt; K: call hangus, put rugi −(K−S) → net S−K. <strong>Identik</strong> dengan (saham − utang K) di semua skenario!</li>
        <li><strong>Konsekuensi 1 — <em>synthetic</em>:</strong> tidak bisa beli sahamnya (misal dibatasi regulasi)? <strong>Rakit</strong> dari call − put + obligasi! Desk derivatif menciptakan eksposur &ldquo;saham&rdquo; dari opsi setiap hari.</li>
        <li><strong>Konsekuensi 2 — arbitrase:</strong> jika pasar melanggar paritas (kiri ≠ kanan) &rarr; <strong>cuan bebas risiko</strong> dengan membeli yang murah &amp; menjual yang mahal (lihat Worked!). Inilah &ldquo;polisi&rdquo; yang menjaga harga opsi tetap waras.</li>
        <li><strong>Konsekuensi 3 — intuisi:</strong> call &amp; put bukan dua hal terpisah — mereka <strong>terikat</strong> oleh paritas. Naiknya harga call (misal karena S naik) <em>menekan</em> harga put lewat arbitrase. <strong>Empat instrumen, satu harga.</strong></li>
      </ul>
      <h2 id="worked4">🔬 Worked Example: Menangkap Pelanggaran Paritas</h2>
      <p>Data pasar: S = Rp1.500, K = Rp1.500, T = 1 tahun, r = 6%. Call diperdagangkan <strong>Rp200</strong>, put <strong>Rp100</strong>. Cek paritas &amp; rancang arbitrase jika dilanggar.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai wajar paritas:</strong> <Tex math={String.raw`C - P`} /> seharusnya = <Tex math={String.raw`S - Ke^{-rT}`} /> = 1.500 − 1.500×e<sup>−0,06</sup> = 1.500 − 1.500×0,9418 = 1.500 − 1.412,6 = <strong>Rp87,4</strong>.</p>
        <p><strong>Langkah 2 — Bandingkan:</strong> pasar: C − P = 200 − 100 = <strong>Rp100</strong> &gt; 87,4 &rarr; <strong>paritas dilanggar</strong> (call kemahalan relatif terhadap put, selisih Rp12,6).</p>
        <p><strong>Langkah 3 — Arbitrase:</strong> jual yang mahal (call Rp200), beli yang murah (put Rp100) + beli saham (Rp1.500) + pinjam PV(K) = Rp1.412,6. Arus kas hari ini: +200 − 100 − 1.500 + 1.412,6 = <strong>+Rp12,6</strong> (masuk kantong!). Saat expiry, semua posisi <strong>saling meniadakan persis</strong> (paritas!) &rarr; Rp12,6 = <strong>cuan bebas risiko</strong>.</p>
        <p><strong>Kenapa pelanggaran ini jarang &amp; kecil:</strong> ratusan algoritma memindai paritas <strong>setiap milidetik</strong> — pelanggaran &gt;Rp1 langsung diserbu. Yang tersisa untuk manusia: <strong>memahami</strong> paritas (untuk valuasi &amp; synthetics), bukan <strong>mengeksploitasinya</strong> (sudah diambil mesin). Pelajaran umum: <strong>semakin sederhana arbitrasenya, semakin cepat mesin mengambilnya.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Opsi itu zero-sum, jadi tidak ada nilai ekonominya.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>payoff</em>-nya zero-sum (untung A = rugi B), tapi <strong>nilainya positif</strong> — seperti asuransi (premi yang dibayar &ldquo;hilang&rdquo; jika tidak klaim, tapi ketenangannya nyata!). Opsi memindahkan risiko dari yang <strong>tidak bisa menanggungnya</strong> (petani, CFO) ke yang <strong>dibayar untuk menanggungnya</strong> (market maker, spekulan). <strong>Zero-sum dalam uang ≠ zero-sum dalam kesejahteraan.</strong> Inilah pembelaan ekonomi seluruh industri derivatif.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e11-black-scholes", txt)

# ================= E12 =================
txt = load("e12-fx-suku-bunga")
toc = '''
          <li><a href="#trinitas">🔧 Pendalaman: Trinitas Mustahil — Pilih Dua, Korbankan Satu</a></li>
          <li><a href="#worked4">🔬 Worked Example: Skor Kebijakan Tiga Negara</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="trinitas">🔧 Pendalaman: Trinitas Mustahil (<em>Impossible Trinity</em>)</h2>
      <p>Teori paling elegan dalam ekonomi internasional — setiap negara hanya bisa memilih <strong>DUA</strong> dari tiga:</p>
      <ol>
        <li><strong>Kurs tetap/stabil</strong> (<em>fixed exchange rate</em>)</li>
        <li><strong>Arus modal bebas</strong> (<em>free capital flow</em>)</li>
        <li><strong>Kebijakan moneter independen</strong> (bunga sesuai kebutuhan domestik)</li>
      </ol>
      <p><strong>Kenapa mustahil ketiganya?</strong> Misal kurs dipatok + modal bebas + BI ingin bunga rendah (stimulus): investor akan <strong>meminjam rupiah murah → tukar ke dolar → invest di luar</strong> (<em>carry</em> terbalik!) &rarr; tekanan jual rupiah raksasa &rarr; untuk <em>menahan patok</em>, BI harus <strong>menaikkan bunga</strong> (= kehilangan independensi!) atau <strong>menghabiskan cadangan devisa</strong>. Salah satu harus dikorbankan.</p>
      <h2 id="worked4">🔬 Worked Example: Skor Kebijakan — Siapa Memilih Apa?</h2>
      <details className="worked">
        <summary>📐 Tiga studi kasus (klik untuk buka)</summary>
        <p><strong>Indonesia (kini):</strong> kurs <strong>mengambang</strong> (dikelola) + modal <strong>bebas</strong> + moneter <strong>independen</strong> (inflation targeting BI). <strong>Dikorbankan: stabilitas kurs</strong> — rupiah berayun (E12 cerita pembuka!), tapi BI bebas menaikkan/menurunkan bunga sesuai inflasi domestik. Pilihan mayoritas dunia modern.</p>
        <p><strong>Tiongkok:</strong> kurs <strong>dikelola ketat</strong> + moneter <strong>independen</strong> + modal <strong>dikontrol</strong> (kuota, persetujuan). <strong>Dikorbankan: arus modal bebas</strong> — yuan stabil &amp; PBOC bebas, tapi investor asing tidak bisa keluar-masuk seenaknya.</p>
        <p><strong>Hong Kong:</strong> kurs <strong>dipatok ke USD</strong> (<em>currency board</em>) + modal <strong>bebas</strong> + moneter <strong>mengikuti The Fed</strong>. <strong>Dikorbankan: independensi</strong> — saat The Fed menaikkan bunga, Hong Kong <em>wajib</em> ikut (atau patok jebol!).</p>
        <p><strong>Ujian pemahaman:</strong> Thailand pra-1997 memilih (1)+(2) = patok + modal bebas &rarr; <em>seharusnya</em> mengorbankan (3) — tapi ia <strong>ingin ketiganya</strong> (bunga rendah untuk boom properti!) &rarr; <strong>spekulan menyerang patok</strong> &rarr; cadangan devisa habis &rarr; <strong>krisis</strong>. Trinitas mustahil = <strong>hukum yang menghukum siapa pun yang mengabaikannya</strong>.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap kali membaca berita &ldquo;BI menahan bunga padahal inflasi naik&rdquo; atau &ldquo;BI menaikkan bunga padahal ekonomi lesu&rdquo; — tanyakan: <em>manakah dari trinitas yang sedang dipertahankan?</em> Sering jawabannya: <strong>stabilitas rupiah</strong> (mengorbankan stimulus domestik sementara). Kebijakan moneter = <strong>seni memilih pengorbanan</strong>, bukan mencari solusi sempurna.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e12-fx-suku-bunga", txt)
print("OK batch13")
for s in ["e10-derivatif", "e11-black-scholes", "e12-fx-suku-bunga"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
