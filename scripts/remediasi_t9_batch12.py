#!/usr/bin/env python3
"""Remediasi T9 batch 12 (final round): e7, e8, e9 — pendalaman + worked + box."""
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

# ================= E7 =================
txt = load("e7-return-risiko")
toc = '''
          <li><a href="#inforatio">🔧 Pendalaman: Information Ratio — Skill vs Keberuntungan</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menghitung Information Ratio</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="inforatio">🔧 Pendalaman: Information Ratio — Memisahkan Skill dari Keberuntungan</h2>
      <p>Sharpe mengukur return vs <em>kas</em>. Tapi manajer aktif tidak dibandingkan dengan kas — ia dibandingkan dengan <strong>benchmark</strong> (IHSG, S&amp;P 500). Metriknya: <strong>Information Ratio (IR)</strong> = <em>active return</em> ÷ <em>tracking error</em>.</p>
      <ul>
        <li><strong>Active return:</strong> return portofolio − return benchmark. &ldquo;Seberapa jauh kamu mengalahkan (atau kalah dari) indeks?&rdquo;</li>
        <li><strong>Tracking error:</strong> volatilitas dari <em>selisih</em> itu (standar deviasi active return). &ldquo;Seberapa liar selisihnya berayun?&rdquo;</li>
        <li><strong>IR = active return / tracking error:</strong> &ldquo;tiap unit <em>penyimpangan dari indeks</em>, berapa kelebihan return yang dihasilkan?&rdquo;</li>
      </ul>
      <p><strong>Skala penilaian industri:</strong> IR &lt; 0 = menghancurkan nilai (bayar fee untuk kalah dari indeks!). IR 0–0,5 = biasa. IR ~0,5 = bagus. IR &gt; 1,0 = <strong>luar biasa</strong> (sangat jarang persisten). <strong>Hukum fundamental manajemen aktif</strong> (Grinold-Kahn): IR ≈ IC × √Breadth — <em>skill per taruhan</em> (IC, information coefficient) × <em>akar jumlah taruhan independen</em>. Artinya: manajer hebat = <strong>sedikit lebih benar, dalam banyak taruhan kecil</strong> — bukan satu taruhan raksasa yang benar.</p>
      <h2 id="worked4">🔬 Worked Example: IR Manajer &ldquo;Cuan Abadi&rdquo; — Hebat atau Hoki?</h2>
      <p>Data 5 tahun: return tahunan Cuan Abadi vs IHSG (benchmark):</p>
      <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead><tr><th>Tahun</th><th>Cuan Abadi</th><th>IHSG</th><th>Active</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>18%</td><td>12%</td><td>+6%</td></tr>
          <tr><td>2</td><td>−5%</td><td>−8%</td><td>+3%</td></tr>
          <tr><td>3</td><td>22%</td><td>20%</td><td>+2%</td></tr>
          <tr><td>4</td><td>8%</td><td>10%</td><td>−2%</td></tr>
          <tr><td>5</td><td>15%</td><td>11%</td><td>+4%</td></tr>
        </tbody>
      </table>
      </div>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rata-rata active return:</strong> (6 + 3 + 2 − 2 + 4) ÷ 5 = <strong>2,6%/tahun</strong>.</p>
        <p><strong>Langkah 2 — Tracking error</strong> (std dev active): deviasi dari 2,6: (3,4; 0,4; −0,6; −4,6; 1,4). Varians = (11,56 + 0,16 + 0,36 + 21,16 + 1,96)/4 = 8,8 &rarr; TE = √8,8 ≈ <strong>2,97%</strong>.</p>
        <p><strong>Langkah 3 — IR:</strong> 2,6 ÷ 2,97 ≈ <strong>0,88</strong> — <em>sangat bagus</em> (mendekati 1,0!).</p>
        <p><strong>Tapi tunggu — uji keberuntungan:</strong> t-statistik ≈ IR × √T = 0,88 × √5 ≈ <strong>1,97</strong> — <em>di ambang</em> signifikansi 95% (≈2,0). Lima tahun data <strong>belum cukup</strong> untuk menyatakan skill dengan yakin! Inilah kenapa industri menuntut <strong>track record 7–10 tahun</strong>: dengan T kecil, IR tinggi bisa jadi hoki. <strong>Aturan: jangan bayar fee mahal untuk IR yang belum signifikan.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Manajer yang 5 tahun berturut-turut mengalahkan indeks = pasti hebat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> peluang manajer <em>tanpa skill</em> (lempar koin) mengalahkan indeks 5 tahun beruntun = (1/2)<sup>5</sup> = <strong>3,1%</strong> — kecil per manajer, tapi dari <strong>10.000 manajer</strong> akan ada ~312 yang &ldquo;hebat&rdquo; murni kebetulan! (<em>multiple testing</em> — E16 Worked 2!). Industri dana = <strong>mesin seleksi survivorship</strong>: yang hoki dipromosikan, yang sial dilikuidasi diam-diam. Selalu tanya: <em>berapa banyak manajer sejenis yang <strong>gagal</strong> dan hilang dari data?</em></p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e7-return-risiko", txt)

# ================= E8 =================
txt = load("e8-markowitz")
toc = '''
          <li><a href="#homebias">🔧 Pendalaman: Home Bias &amp; Batas Diversifikasi Global</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menambah Aset Ketiga — Berapa Manfaatnya?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="homebias">🔧 Pendalaman: Home Bias — Kenapa Portofoliomu Terlalu Indonesia?</h2>
      <p>Data global: investor Indonesia menaruh <strong>&gt;90%</strong> portofolionya di aset domestik — padahal Indonesia &lt;1% kapitalisasi pasar dunia. Fenomena ini (<em>home bias</em>) terjadi di semua negara, dan Markowitz bilang ini <strong>tidak optimal</strong>:</p>
      <ul>
        <li><strong>Argumen teori:</strong> portofolio global (saham AS + Eropa + Asia + obligasi global) punya <em>frontier efisien</em> yang <strong>lebih baik</strong> — korelasi antar negara &lt; 1 (siklus ekonomi tidak sinkron sempurna) &rarr; diversifikasi internasional = &ldquo;makan siang gratis&rdquo; jilid 2.</li>
        <li><strong>Argumen perilaku:</strong> <em>familiarity bias</em> — &ldquo;aku paham Telkom, tidak paham Apple&rdquo;; <em>currency risk</em> — return global dalam rupiah berayun oleh kurs (E12!); <em>biaya &amp; pajak</em> — dulu mahal, kini murah (ETF global via sekuritas lokal!).</li>
        <li><strong>Argumen risiko yang valid:</strong> <strong>liabilitas dalam rupiah</strong> — jika pengeluaranmu (rumah, sekolah anak) dalam rupiah, aset global menambah <em>risiko kurs</em> yang tidak ada di aset domestik. Dana pensiun Indonesia <em>wajar</em> overweight domestik — tapi 90%+ = berlebihan.</li>
      </ul>
      <p><strong>Posisi seimbang:</strong> inti domestik (sesuai liabilitas rupiah) + <strong>satelit global 20–40%</strong> via ETF indeks global berbiaya rendah. Bukan untuk &ldquo;return lebih tinggi&rdquo; — tapi untuk <strong>risiko yang lebih rendah pada return yang sama</strong> (persis logika E8!).</p>
      <h2 id="worked4">🔬 Worked Example: Menambah Aset Ketiga — Manfaat yang Menyusut</h2>
      <p>Mulai dari portofolio 50/50 PAYUNG-ESKRIM (σ = 11,8%, ρ = −0,3). Tambahkan <strong>OBLIGASI</strong>: return 6%, σ = 5%, korelasi 0 dengan keduanya. Bobot baru: 40/40/20. Berapa σ portofolio?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus 3 aset:</strong> <Tex math={String.raw`\\sigma_p^2 = \\sum w_i^2\\sigma_i^2 + 2\\sum_{i&lt;j} w_iw_j\\rho_{ij}\\sigma_i\\sigma_j`} />.</p>
        <p><strong>Hitung:</strong> (0,16×0,04) + (0,16×0,04) + (0,04×0,0025) + 2(0,16)(−0,3)(0,04) + 0 + 0 = 0,0064 + 0,0064 + 0,0001 − 0,00384 = <strong>0,00906</strong>.</p>
        <p>σp = √0,00906 ≈ <strong>9,5%</strong> — turun dari 11,8% ke 9,5% (<strong>−20%</strong>!).</p>
        <p><strong>Tapi perhatikan pola penyusutan:</strong> aset ke-2 memangkas σ dari 20% → 11,8% (−8,2 poin); aset ke-3: 11,8% → 9,5% (−2,3 poin). Aset ke-10? Mungkin −0,3 poin. <strong>Manfaat diversifikasi = logaritmik</strong> — besar di awal, lalu mendatar (E8 Myth!). Pelajaran alokasi: <strong>3–5 kelas aset yang <em>benar-benar beda</em></strong> (saham domestik, saham global, obligasi, kas/emas) menangkap ~90% manfaat — selebihnya <em>kompleksitas tanpa hasil</em>.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <em>rebalancing bands</em> — versi disiplin dari Worked 3 E8: tentukan target (misal 60/40) + <strong>batas toleransi</strong> (±5%). Hanya rebalance jika bobot <em>keluar</em> dari batas — menghemat biaya transaksi vs rebalance kalender buta. Portofolio 60/40 yang dibiarkan 10 tahun tanpa rebalance bisa menjadi 80/20 (saham naik terus) — <strong>risiko yang diam-diam berubah tanpa kamu sadari</strong>. Bands = autopilot risiko.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e8-markowitz", txt)

# ================= E9 =================
txt = load("e9-capm")
toc = '''
          <li><a href="#wacc2">🔧 Pendalaman: WACC — CAPM di Ruang Rapat Direksi</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menghitung WACC &amp; Keputusan Investasi</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="wacc2">🔧 Pendalaman: WACC — Saat CAPM Menentukan Pabrik Dibangun atau Tidak</h2>
      <p>CAPM tidak hanya untuk fund manager — ia masuk <strong>ruang rapat direksi</strong> lewat <strong>WACC</strong> (<em>weighted average cost of capital</em>):</p>
      <p style={{ textAlign: "center" }}><Tex math={String.raw`WACC = w_e \\cdot r_e + w_d \\cdot r_d(1-T)`} block /></p>
      <ul>
        <li><Tex math={String.raw`r_e`} /> = <strong>dari CAPM</strong> (SML!): <Tex math={String.raw`R_f + \\beta(R_m - R_f)`} /> — &ldquo;harga&rdquo; ekuitas perusahaan.</li>
        <li><Tex math={String.raw`r_d`} /> = yield obligasi perusahaan (SBN + credit spread — E4 + E5!).</li>
        <li><Tex math={String.raw`(1-T)`} /> = <em>tax shield</em> — bunga utang mengurangi pajak, jadi biaya utang efektif lebih murah. Inilah insentif pajak berutang!</li>
        <li><Tex math={String.raw`w_e, w_d`} /> = bobot <strong>nilai pasar</strong> (bukan nilai buku!) ekuitas &amp; utang.</li>
      </ul>
      <p><strong>Fungsinya:</strong> WACC = <strong>hurdle rate</strong> — proyek dengan return &lt; WACC <em>menghancurkan</em> nilai pemegang saham (E3: NPV negatif!). Direksi yang menyetujui proyek 8% saat WACC 12% = membakar uang — <em>walau</em> proyeknya &ldquo;untung secara akuntansi&rdquo;. <strong>Akuntansi ≠ ekonomi.</strong></p>
      <h2 id="worked4">🔬 Worked Example: WACC MajuMundur &amp; Nasib Pabrik Rp10 Miliar</h2>
      <p>Data: ekuitas pasar Rp15 T (Worked 1 E6!), utang pasar Rp5 T. β = 1,2. <Tex math={String.raw`R_f`} /> = 6%, <Tex math={String.raw`R_m`} /> = 12%. Biaya utang <Tex math={String.raw`r_d`} /> = 9%. Pajak T = 22%.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — <Tex math={String.raw`r_e`} /> via CAPM:</strong> 6% + 1,2 × (12% − 6%) = 6% + 7,2% = <strong>13,2%</strong>.</p>
        <p><strong>Langkah 2 — Bobot:</strong> total modal = 20 T. <Tex math={String.raw`w_e`} /> = 15/20 = <strong>0,75</strong>. <Tex math={String.raw`w_d`} /> = 5/20 = <strong>0,25</strong>.</p>
        <p><strong>Langkah 3 — WACC:</strong> 0,75 × 13,2% + 0,25 × 9% × (1 − 0,22) = 9,9% + 1,755% = <strong>11,655%</strong> ≈ <strong>11,7%</strong>.</p>
        <p><strong>Langkah 4 — Keputusan:</strong> proyek pabrik Rp10 M (E3 Worked 4!) punya IRR… jika return proyek 12% &gt; WACC 11,7% &rarr; <strong>bangun</strong> (NPV positif). Jika return 10% &rarr; <strong>tolak</strong> — meski &ldquo;untung&rdquo; 10%!</p>
        <p><strong>Intuisi rantai penuh:</strong> <strong>E9 (CAPM)</strong> → harga ekuitas → <strong>WACC</strong> → hurdle rate → <strong>E3 (NPV)</strong> → keputusan investasi → laba masa depan → <strong>E6/E18</strong> (dividen &amp; laporan keuangan) → harga saham → <strong>β baru</strong> → CAPM lagi. <strong>Satu lingkaran tertutup.</strong> Inilah kenapa track ini satu kesatuan — bukan 18 lesson terpisah.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Utang itu buruk — perusahaan terbaik = tanpa utang.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> utang <strong>murah</strong> (bunga <em>tax-deductible</em>!) dan bisa <strong>menurunkan WACC</strong> — sampai titik di mana risiko kebangkrutan menaikkan <Tex math={String.raw`r_e`} /> &amp; <Tex math={String.raw`r_d`} /> lebih cepat (<em>trade-off theory</em>). Struktur modal optimal = titik terendah kurva WACC berbentuk U. Perusahaan tanpa utang = <strong>membayar pajak lebih &amp; modal lebih mahal</strong> — belum tentu &ldquo;sehat&rdquo;, bisa jadi <em>tidak efisien</em>. (Tentu: ini teori; krisis 1998 menunjukkan utang valas = bom — E12!)</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e9-capm", txt)
print("OK batch12")
for s in ["e7-return-risiko", "e8-markowitz", "e9-capm"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
