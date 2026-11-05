#!/usr/bin/env python3
"""Remediasi T9 batch 2: top-up e1, e2 (deep-dive + worked tambahan)."""
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
    assert pat.search(txt), "TOC quiz li tidak ketemu"
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E1 top-up =================
txt = load("e1-struktur-pasar")

toc = '''
          <li><a href="#worked3">🔬 Worked Example: Membaca Order Book</a></li>
          <li><a href="#mikro">🔧 Pendalaman: Fraksi Harga &amp; Auto Rejection IDX</a></li>'''
txt = add_toc(txt, toc)

sec = '''      <h2 id="worked3">🔬 Worked Example 3: Order Besarmu &ldquo;Memakan&rdquo; Order Book</h2>
      <p>Lihat papan order (<em>order book</em>) saham MAJU pagi ini:</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th></th><th>Harga (Rp)</th><th>Volume (lembar)</th></tr></thead>
        <tbody>
          <tr><td><strong>Ask 3</strong> (jual)</td><td>1.505</td><td>1.000</td></tr>
          <tr><td><strong>Ask 2</strong></td><td>1.502</td><td>400</td></tr>
          <tr><td><strong>Ask 1</strong> (termurah)</td><td>1.501</td><td>300</td></tr>
          <tr><td colSpan={3} style={{ textAlign: "center" }}><em>— spread Rp1 —</em></td></tr>
          <tr><td><strong>Bid 1</strong> (termahal)</td><td>1.500</td><td>200</td></tr>
          <tr><td><strong>Bid 2</strong></td><td>1.499</td><td>500</td></tr>
          <tr><td><strong>Bid 3</strong></td><td>1.498</td><td>800</td></tr>
        </tbody>
      </table>
      </div>
      <p>Kamu tidak sabar dan menghantam tombol <strong>beli 1.000 lembar @ harga pasar</strong> (<em>market order</em>). Berapa harga rata-rata yang kamu dapat?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — &ldquo;Makan&rdquo; dari Ask termurah ke atas:</strong> 300 lbr @ 1.501 (Ask 1 habis) &rarr; 400 lbr @ 1.502 (Ask 2 habis) &rarr; masih kurang 300 lbr &rarr; 300 lbr @ 1.505 (Ask 3).</p>
        <p><strong>Langkah 2 — Total bayar:</strong> (300 &times; 1.501) + (400 &times; 1.502) + (300 &times; 1.505) = 450.300 + 600.800 + 451.500 = <strong>Rp1.502.600</strong>.</p>
        <p><strong>Langkah 3 — Harga rata-rata:</strong> 1.502.600 &divide; 1.000 = <strong>Rp1.502,6/lembar</strong>.</p>
        <p><strong>Analisis:</strong> harga kuotasi Ask yang kamu lihat = Rp1.501, tapi kamu membayar Rp1.502,6 — <strong>slippage Rp1,6/lembar</strong> (Rp1.600 total). Di saham likuid dengan book tebal, slippage ini ~nol. Di saham sepi (book tipis), market order 1.000 lembar bisa menggerakkan harga <strong>5–10%</strong> — dan <em>kamu sendiri</em> yang menggerakkannya melawan dirimu.</p>
        <p><strong>Intuisi:</strong> <em>market impact</em> = pajak ukuran. Institusi besar memecah order raksasa jadi ratusan order kecil (algoritma <em>TWAP/VWAP</em>) justru untuk menghindari &ldquo;memakan&rdquo; book seperti ini. Sebagai ritel: <strong>selalu pakai <em>limit order</em></strong> — tentukan harga maksimum yang rela kamu bayar, jangan serahkan ke pasar.</p>
      </details>

      <h2 id="mikro">🔧 Pendalaman: Fraksi Harga &amp; Auto Rejection — Aturan Main IDX</h2>
      <p>Bursa bukan rimba bebas — ia punya &ldquo;peraturan lalu lintas&rdquo; yang membentuk perilaku harga yang kamu lihat tiap hari:</p>
      <ul>
        <li><strong>Fraksi harga (<em>tick size</em>):</strong> kenaikan harga minimum antar antrean. IDX memakai fraksi berjenjang berdasar rentang harga — misal saham di bawah Rp200 bergerak per Rp1, Rp200–500 per Rp2, Rp500–2.000 per Rp5, Rp2.000–5.000 per Rp10, di atas Rp5.000 per Rp25. <em>Kenapa penting?</em> Fraksi = &ldquo;resolusi&rdquo; tawar-menawar: makin kecil fraksi, makin ketat spread bisa ditekan, makin murah biaya trading (lihat Lab 2).</li>
        <li><strong>Auto rejection (ARA/ARB):</strong> batas persentase kenaikan/penurunan harian — order di luar batas <em>ditolak sistem</em>. Tujuannya persis pelajaran Flash Crash: memberi jeda saat pasar panik agar likuiditas sempat kembali. Konsekuensinya: saham bisa &ldquo;antre ARB&rdquo; — mau jual tapi tidak ada pembeli di batas bawah (likuiditas hilang total).</li>
        <li><strong>1 lot = 100 lembar:</strong> satuan minimum transaksi. Saham Rp50/lembar = Rp5.000 per lot — &ldquo;murah&rdquo; secara nominal, tapi itu tidak mengatakan apa-apa soal valuasi (lihat E6).</li>
        <li><strong>Sesi pre-opening:</strong> 15 menit sebelum perdagangan kontinu, order dikumpulkan lalu dieksekusi pada <em>satu harga kliring</em> (lelang). Harga pembukaan yang kamu lihat = hasil lelang ini, bukan satu transaksi.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> gabungkan semuanya: harga saham yang kamu lihat = <strong>hasil lelang kontinu yang dibatasi fraksi, dipagari auto-rejection, dan digerakkan oleh kedalaman book</strong>. &ldquo;Harga pasar&rdquo; bukan entitas mistis — ia adalah artefak dari <em>aturan main</em> ini. Trader profesional tidak &ldquo;menebak harga&rdquo;; mereka membaca struktur di baliknya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Harga terakhir di aplikasi = nilai wajar saham.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> harga terakhir (<em>last price</em>) bisa berasal dari transaksi <strong>1 lot kecil</strong> di pasar yang sepi — satu orang iseng beli 100 lembar bisa &ldquo;mencetak&rdquo; harga baru. Nilai yang lebih jujur = <strong>mid-price</strong> (tengah bid-ask) <em>plus</em> melihat kedalaman book. Saham yang &ldquo;naik 5%&rdquo; dengan volume 2 lot = ilusi; yang naik 5% dengan book tebal dua sisi = sinyal.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e1-struktur-pasar", txt)

# ================= E2 top-up =================
txt = load("e2-instrumen")

toc = '''
          <li><a href="#worked3">🔬 Worked Example: NAV Reksa Dana</a></li>
          <li><a href="#payoff">🔧 Pendalaman: Profil Payoff — Linear vs Bengkok</a></li>'''
txt = add_toc(txt, toc)

sec = '''      <h2 id="worked3">🔬 Worked Example 3: NAV Reksa Dana — &ldquo;Harga&rdquo; yang Dihitung, Bukan Ditawar</h2>
      <p>Reksa dana &ldquo;Maju Teratur&rdquo; mengelola total aset (<em>AUM</em>) <strong>Rp500 miliar</strong> (saham + kas) dengan <strong>400 juta unit</strong> beredar. Berapa &ldquo;harga&rdquo; per unit (NAB/NAV)? Kamu invest Rp10 juta — berapa unit didapat, dan berapa nilainya jika pasar naik 2%?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — NAV per unit:</strong> 500.000.000.000 &divide; 400.000.000 = <strong>Rp1.250/unit</strong>.</p>
        <p><strong>Langkah 2 — Unit yang kamu dapat:</strong> 10.000.000 &divide; 1.250 = <strong>8.000 unit</strong>.</p>
        <p><strong>Langkah 3 — Pasar naik 2%:</strong> AUM &rarr; Rp510 miliar. NAV baru = 510 M &divide; 400 jt = <strong>Rp1.275</strong>. Nilai investasimu = 8.000 &times; 1.275 = <strong>Rp10.200.000</strong> (+2%, persis mengikuti pasar — dikurangi fee manajer investasi ~1–2%/tahun yang dipotong diam-diam dari NAV harian).</p>
        <p><strong>Intuisi:</strong> bedakan dengan saham/ETF — NAV reksa dana <strong>dihitung</strong> (akuntansi, sekali sehari setelah bursa tutup), bukan <strong>ditawar</strong> (lelang tiap detik). Konsekuensinya: kamu tidak bisa &ldquo;kabur&rdquo; <em>intraday</em> saat pasar crash jam 10 pagi — penjualanmu dieksekusi pada NAV <em>sore harinya</em>, setelah semua kerusakan terjadi. Aturan main menentukan strategi keluar.</p>
      </details>

      <h2 id="payoff">🔧 Pendalaman: Profil Payoff — Kenapa Opsi &ldquo;Bengkok&rdquo; dan Futures Lurus</h2>
      <p>Gambar mental terpenting untuk derivatif: <strong>bentuk kurva payoff</strong>-nya.</p>
      <ul>
        <li><strong>Forward/futures = garis lurus diagonal.</strong> Harga naik Rp100 &rarr; untung Rp100; turun Rp100 &rarr; rugi Rp100. Simetris: <em>untung dan rugi tak terbatas</em> (dua arah). Cocok untuk <em>hedging</em> murni (Pak Tani): ia memang ingin mengunci, bukan bertaruh.</li>
        <li><strong>Opsi beli (call) = garis bengkok (<em>kinked</em>).</strong> Di bawah strike: datar di −premi (rugi mentok = premi hangus). Di atas strike: menanjak mengikuti saham. Asimetris: <em>rugi terbatas, untung tak terbatas</em>.</li>
        <li><strong>Harga &ldquo;bengkok&rdquo; ini = harga asuransi.</strong> Premi opsi = harga yang rela dibayar untuk memotong sisi rugi. Makin bengkok perlindungannya (makin jauh dari uang), makin mahal preminya — persis seperti asuransi mobil: pertanggungan penuh lebih mahal dari <em>deductible</em> besar.</li>
      </ul>
      <p><strong>Kenapa ini penting untuk karirmu:</strong> setiap produk terstruktur bank (capital protected notes, autocallable, dll.) = <em>bundel</em> dari obligasi + beberapa opsi yang dibungkus jadi satu. Kalau kamu bisa membaca payoff bengkok, kamu bisa &ldquo;membongkar&rdquo; produk apa pun: <em>bagian mana yang obligasi, bagian mana yang opsi, dan berapa premi tersembunyi yang kamu bayar?</em> Itu skill analis produk yang digaji mahal.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga pertanyaan sebelum beli <em>instrumen apa pun</em>: (1) <strong>Dari mana untungnya?</strong> (apresiasi harga? kupon? selisih payoff?) (2) <strong>Apa skenario terburuknya?</strong> (rugi 100%? lebih dari modal — seperti short futures?) (3) <strong>Kapan ia kedaluwarsa / bisa dicairkan?</strong> (waran hangus, deposito penalti, reksa dana T+2). Tiga jawaban ini = &ldquo;aturan main&rdquo; yang melindungi dari nasib Dimas.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e2-instrumen", txt)
print("OK e1 e2 topup")
for s in ["e1-struktur-pasar", "e2-instrumen"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
