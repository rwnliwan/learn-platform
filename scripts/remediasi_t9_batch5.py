#!/usr/bin/env python3
"""Remediasi T9 batch 5: e7 (return-risiko), e8 (markowitz) — full expansion."""
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
    assert pat.search(txt), "story div tidak ketemu"
    return pat.sub(lambda mm: mm.group(1) + twist_html + mm.group(2), txt, count=1)

def add_toc(txt, items_html):
    pat = re.compile(r'(\n          <li><a href="#quiz">)')
    assert pat.search(txt), "TOC quiz li tidak ketemu"
    return pat.sub(items_html + r'\1', txt, count=1)

def insert_before_quiz(txt, section_html):
    anchor = '      <h2 id="quiz">'
    assert anchor in txt
    return txt.replace(anchor, section_html + "\n" + anchor, 1)

# ================= E7 =================
txt = load("e7-return-risiko")

twist = '''
        <p><strong>Twist-nya:</strong> fund manager itu tidak berbohong — 20% memang angka yang benar. Tapi &ldquo;benar&rdquo; dan &ldquo;jujur&rdquo; adalah dua hal berbeda: angka 20% menyembunyikan <em>jalan</em> menuju ke sana — jalan yang membuat sebagian investornya menyerah di tengah dan tidak pernah sampai. <strong>Return adalah destinasi; risiko adalah medannya.</strong> Menilai investasi hanya dari return = menilai penerbangan hanya dari kota tujuannya, tanpa peduli apakah pesawatnya melewati badai. Lesson ini memberimu instrumen navigasi untuk medannya.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Rata-rata Aritmetik vs Geometrik</a></li>
          <li><a href="#worked2">🔬 Worked Example: Sharpe &amp; Sortino Head-to-Head</a></li>
          <li><a href="#worked3">🔬 Worked Example: Matematika Drawdown — Lubang yang Dalam</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 &amp; Volatility Drag</a></li>
          <li><a href="#distribusi">🔧 Pendalaman: Risiko = Bentuk Distribusi, Bukan Satu Angka</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Dua &ldquo;Rata-rata&rdquo; yang Bercerita Berbeda</h2>
      <p>Reksa dana &ldquo;Roller Coaster&rdquo;: Tahun 1 <strong>+60%</strong>, Tahun 2 <strong>−25%</strong>. Iklannya menulis &ldquo;rata-rata return 17,5%/tahun&rdquo;. Benarkah investor mendapat 17,5% per tahun?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rata-rata aritmetik:</strong> (60 + (−25)) &divide; 2 = <strong>17,5%</strong>. ✓ (Iklan tidak berbohong.)</p>
        <p><strong>Langkah 2 — Yang benar-benar terjadi pada Rp100 juta:</strong> 100 &times; 1,60 = 160 &rarr; 160 &times; 0,75 = <strong>Rp120 juta</strong>.</p>
        <p><strong>Langkah 3 — Rata-rata geometrik (CAGR):</strong> <Tex math={String.raw`(120/100)^{1/2} - 1 = \\sqrt{1{,}20} - 1 \\approx 9{,}54\\%`} /> per tahun.</p>
        <p><strong>Selisihnya:</strong> 17,5% vs 9,54% — <strong>hampir 8 poin persentase!</strong> Inilah <em>volatility drag</em>: volatilitas &ldquo;memakan&rdquo; return majemuk. Rumus kasarnya: <Tex math={String.raw`r_{geo} \\approx r_{arit} - \\sigma^2/2`} /> — makin liar ayunannya, makin besar yang dimakan.</p>
        <p><strong>Intuisi:</strong> rata-rata aritmetik menjawab &ldquo;berapa return <em>rata-rata per tahun</em>?&rdquo;; geometrik menjawab &ldquo;berapa <em>kekayaanku</em> tumbuh per tahun?&rdquo; — dan hanya yang kedua yang bisa dibelanjakan. Iklan produk investasi <em>selalu</em> memakai yang pertama jika terlihat lebih bagus. Sekarang kamu tahu kenapa.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Sharpe vs Sortino — Adu Dua Fund Manager</h2>
      <p>Manager A: return 14%/thn, volatilitas 16%/thn. Manager B: return 12%/thn, volatilitas 10%/thn. Risk-free 4%. Siapa lebih baik <em>per unit risiko</em>? Dan bagaimana jika volatilitas B sebagian besar adalah &ldquo;kejutan naik&rdquo;?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Sharpe ratio</strong> = (return − risk-free) &divide; volatilitas.</p>
        <p>A: (14 − 4) &divide; 16 = <strong>0,625</strong>. B: (12 − 4) &divide; 10 = <strong>0,80</strong>.</p>
        <p><strong>Langkah 2 — Putusan Sharpe:</strong> B menang (0,80 &gt; 0,625) — tiap unit &ldquo;guncangan&rdquo; dibayar lebih mahal.</p>
        <p><strong>Langkah 3 — Sortino ratio</strong> = (return − target) &divide; <em>downside deviation</em> (hanya volatilitas ke <em>bawah</em>). Misal downside-dev A = 14%, B = 5% (B jarang turun tajam):</p>
        <p>A: (14 − 4) &divide; 14 ≈ <strong>0,71</strong>. B: (12 − 4) &divide; 5 = <strong>1,60</strong>.</p>
        <p><strong>Intuisi:</strong> Sharpe menghukum <em>semua</em> guncangan — termasuk lonjakan naik yang kamu suka! Sortino hanya menghukum guncangan ke bawah. Dana yang sering &ldquo;melompat naik&rdquo; terlihat buruk di Sharpe tapi bersinar di Sortino. Gunakan <strong>keduanya</strong>: Sharpe untuk perbandingan standar industri, Sortino untuk menilai &ldquo;risiko yang benar-benar menyakitkan&rdquo;.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Matematika Drawdown — Kenapa −50% Butuh +100%</h2>
      <p>Portofolio Rp200 juta jatuh <strong>−50%</strong> (krisis). Berapa return yang dibutuhkan untuk kembali ke Rp200 juta?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai setelah jatuh:</strong> 200 &times; 0,50 = <strong>Rp100 juta</strong>.</p>
        <p><strong>Langkah 2 — Kebutuhan pemulihan:</strong> (200 − 100) &divide; 100 = <strong>+100%</strong>. Bukan +50%!</p>
        <p><strong>Tabel pemulihan:</strong> −10% &rarr; butuh +11,1% &rarr; −20% &rarr; +25% &rarr; −30% &rarr; +42,9% &rarr; −50% &rarr; +100% &rarr; −80% &rarr; <strong>+400%</strong>.</p>
        <p><strong>Intuisi:</strong> drawdown bersifat <strong>asimetris dan non-linear</strong> — lubang makin dalam, tangga keluarnya makin curam <em>eksponensial</em>. Inilah alasan matematis di balik nasihat &ldquo;utamakan jangan rugi&rdquo; (Buffett): menghindari −30% <em>jauh</em> lebih berharga daripada mengejar +30%. Manajemen risiko = manajemen <em>asimetri</em> ini.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2008 — Ketika &ldquo;Risiko Terukur&rdquo; Menjadi Lelucon</h2>
      <p>Sebelum 2008, bank-bank global memakai model risiko canggih (VaR — lihat E13) yang &ldquo;membuktikan&rdquo; portofolio mereka aman. Lalu:</p>
      <ul>
        <li>Indeks S&amp;P 500 jatuh <strong>−57%</strong> dari puncak 2007 ke dasar Maret 2009. Pemulihan ke level semula butuh <strong>~5,5 tahun</strong> (matematika Worked 3 bekerja brutal di skala triliunan dolar).</li>
        <li>Volatilitas (VIX) melonjak dari ~20 ke <strong>80</strong> — model yang memakai data 3 tahun terakhir &ldquo;tidak pernah melihat&rdquo; angka setinggi ini, sehingga <em>meremehkan</em> risiko justru saat risiko terbesar.</li>
        <li><strong>LTCM 1998</strong> adalah prekuelnya: hedge fund berisi peraih Nobel, modelnya &ldquo;sempurna&rdquo; secara matematis — bangkrut karena model mengasumsikan likuiditas selalu ada. Saat semua orang menjual bersamaan, <strong>korelasi antar aset melonjak ke 1</strong> (lihat E8!) dan diversifikasi menguap.</li>
      </ul>
      <p><strong>Pelajaran abadi:</strong> (1) <strong>risiko yang bisa diukur dengan rapi ≠ risiko yang sebenarnya</strong> — model mengukur masa lalu, bukan masa depan; (2) <strong>risiko terbesar = yang membuatmu terpaksa menjual di dasar</strong> (<em>forced selling</em>: margin call, penarikan dana) — bukan angka volatilitasnya; (3) <strong>likuiditas adalah bagian dari risiko</strong> — aset &ldquo;aman&rdquo; yang tidak bisa dijual saat dibutuhkan = tidak aman.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada tiga &ldquo;rasa&rdquo; return yang wajib dibedakan: <strong>return kotor</strong> (sebelum biaya), <strong>return bersih</strong> (setelah fee &amp; pajak — yang benar-benar kamu terima), dan <strong>return riil</strong> (bersih − inflasi = daya beli). Dana yang &ldquo;return 12%&rdquo; dengan fee 2% + pajak 10% + inflasi 4% = return riil ≈ <strong>4,8%</strong>. Selalu tanya: <em>return yang mana yang sedang dibicarakan?</em></p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volatilitas tinggi = risiko tinggi, selalu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> volatilitas = <em>simpangan dua arah</em>. Saham yang 5 tahun naik 15%/tahun dengan ayunan ±20% &ldquo;berisiko&rdquo; menurut volatilitas — tapi investor jangka panjangnya makmur. Sebaliknya deposito &ldquo;tanpa volatilitas&rdquo; punya <strong>risiko inflasi yang pasti</strong>: daya beli tergerus 3–4%/tahun, dijamin, tanpa guncangan. Risiko sejati = <strong>probabilitas tidak mencapai tujuan keuanganmu</strong> — bukan besarnya guncangan harian.</p>
      </div>

      <h2 id="distribusi">🔧 Pendalaman: Risiko = Bentuk Distribusi, Bukan Satu Angka</h2>
      <p>Volatilitas (standar deviasi) mengasumsikan return terdistribusi <strong>normal/simetris</strong> — naik-turun seimbang seperti lonceng. Dunia nyata <strong>tidak sopan</strong> seperti itu:</p>
      <ul>
        <li><strong>Skewness negatif</strong> (ekor kiri panjang): strategi &ldquo;memungut receh di depan buldoser&rdquo; — untung kecil tiap bulan, lalu sekali-sekali rugi besar (menjual opsi, <em>carry trade</em>). Volatilitasnya <em>kecil</em> — terlihat &ldquo;aman&rdquo; — sampai ekornya datang. 2008 = ekor kiri bagi seluruh sistem.</li>
        <li><strong>Kurtosis tinggi</strong> (<em>fat tails</em>): kejadian ekstrem lebih sering dari prediksi lonceng normal. &ldquo;Peristiwa 5-sigma&rdquo; yang menurut model terjadi sekali per 7.000 tahun, di pasar terjadi <strong>tiap beberapa tahun</strong> (1987, 1998, 2008, 2020).</li>
        <li><strong>Implikasi:</strong> dua investasi dengan return &amp; volatilitas <em>identik</em> bisa punya profil bahaya yang <em>sangat beda</em> — satu lonceng simetris, satu bom waktu berekor. Inilah kenapa analis risiko profesional melihat <strong>seluruh distribusi</strong> (histogram, VaR, expected shortfall — E13), bukan satu angka sigma.</li>
      </ul>
      <p><strong>Aturan praktis:</strong> jika sebuah strategi menawarkan &ldquo;return stabil di atas pasar dengan volatilitas rendah&rdquo; — curigai <strong>ekor kirinya</strong>. Tanyakan: <em>kapan terakhir strategi ini rugi besar, dan apa pemicunya?</em> Jika jawabannya &ldquo;tidak pernah&rdquo; — itu bukan jawaban yang menenangkan. Itu <em>alarm</em>.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e7-return-risiko", txt)

# ================= E8 =================
txt = load("e8-markowitz")

twist = '''
        <p><strong>Twist-nya:</strong> Markowitz tidak menemukan saham yang lebih baik — ia menemukan bahwa <strong>risiko portofolio bukan rata-rata dari risiko anggotanya</strong>. Dua aset yang masing-masing &ldquo;liar&rdquo; bisa menghasilkan portofolio yang &ldquo;tenang&rdquo;, <em>jika</em> mereka liar ke arah yang berlawanan pada waktu yang berbeda. Satu-satunya &ldquo;makan siang gratis&rdquo; di keuangan bukanlah aset ajaib — melainkan <strong>kombinasi yang cerdas</strong>. Tapi seperti semua makan siang gratis: ada syaratnya, dan syaratnya bernama <em>korelasi</em>.</p>'''
txt = add_twist(txt, twist)

toc = '''
          <li><a href="#worked1">🔬 Worked Example: Varians Portofolio Dua Aset</a></li>
          <li><a href="#worked2">🔬 Worked Example: Portofolio Varians Minimum</a></li>
          <li><a href="#worked3">🔬 Worked Example: Bonus Rebalancing</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Saat Korelasi Menjadi 1</a></li>
          <li><a href="#duarisiko">🔧 Pendalaman: Dua Risiko — yang Bisa vs yang Tak Bisa Didiversifikasi</a></li>'''
txt = add_toc(txt, toc)

sec = '''      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Keajaiban 50/50 — Dari Dua yang Liar ke Satu yang Tenang</h2>
      <p>Saham <strong>PAYUNG</strong> (naik saat hujan): return ekspektasi 10%, volatilitas <strong>20%</strong>. Saham <strong>ESKRIM</strong> (naik saat panas): return ekspektasi 10%, volatilitas <strong>20%</strong>. Korelasi keduanya <strong>ρ = −0,3</strong> (cenderung bergerak berlawanan). Gabungkan 50/50 — berapa volatilitas portofolio?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus varians 2 aset:</strong> <Tex math={String.raw`\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\rho\\sigma_1\\sigma_2`} />.</p>
        <p><strong>Langkah 2 — Masukkan angka</strong> (<Tex math={String.raw`w_1=w_2=0{,}5`} />, <Tex math={String.raw`\\sigma_1=\\sigma_2=0{,}20`} />, <Tex math={String.raw`\\rho=-0{,}3`} />):</p>
        <p><Tex math={String.raw`\\sigma_p^2`} /> = (0,25 × 0,04) + (0,25 × 0,04) + 2(0,25)(−0,3)(0,04) = 0,01 + 0,01 − 0,006 = <strong>0,014</strong>.</p>
        <p><strong>Langkah 3 — Volatilitas:</strong> <Tex math={String.raw`\\sigma_p = \\sqrt{0{,}014} \\approx 11{,}8\\%`} />.</p>
        <p><strong>Bandingkan:</strong> rata-rata volatilitas = 20%. Volatilitas portofolio = <strong>11,8%</strong> — turun <strong>41%</strong>! Return ekspektasi tetap 10% (rata-rata). <strong>Risiko turun, return tidak</strong> — inilah &ldquo;makan siang gratis&rdquo;.</p>
        <p><strong>Eksperimen mental:</strong> jika ρ = +1 (bergerak seiring): σp = 20% (tidak ada manfaat). Jika ρ = −1 (sempurna berlawanan): σp = <strong>0%</strong> (risiko hilang total!). <strong>Korelasi — bukan jumlah aset — adalah mesin diversifikasi.</strong></p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Berapa Bobot Terbaik? (Portofolio Varians Minimum)</h2>
      <p>Dengan PAYUNG &amp; ESKRIM di atas (σ sama = 20%, ρ = −0,3), bobot 50/50 memberi σ = 11,8%. Bisakah lebih rendah lagi dengan bobot berbeda?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus bobot optimal</strong> (2 aset): <Tex math={String.raw`w_1^* = \\frac{\\sigma_2^2 - \\rho\\sigma_1\\sigma_2}{\\sigma_1^2 + \\sigma_2^2 - 2\\rho\\sigma_1\\sigma_2}`} />.</p>
        <p><strong>Langkah 2 — Masukkan angka:</strong> pembilang = 0,04 − (−0,3)(0,04) = 0,04 + 0,012 = 0,052. Penyebut = 0,04 + 0,04 − 2(−0,3)(0,04) = 0,08 + 0,024 = 0,104.</p>
        <p><Tex math={String.raw`w_1^*`} /> = 0,052 &divide; 0,104 = <strong>0,50</strong> &rarr; 50/50 memang optimal di sini (simetris karena σ sama).</p>
        <p><strong>Langkah 3 — Varian menarik:</strong> jika σPAYUNG = 30%, σESKRIM = 10%, ρ = 0: <Tex math={String.raw`w_P^*`} /> = (0,01 − 0)/(0,09 + 0,01 − 0) = <strong>0,10</strong> — hanya 10% di aset liar! Bobot optimal <strong>condong ke aset yang tenang</strong>, proporsional terhadap <em>kebalikan varians</em>.</p>
        <p><strong>Intuisi:</strong> optimasi Markowitz = &ldquo;timbangan risiko&rdquo;: tiap aset ditimbang bukan berdasar return-nya, tapi berdasar <strong>kontribusi risikonya</strong> (<em>risk contribution</em>). Dana pensiun modern memakai versi canggihnya: <em>risk parity</em> — tiap aset menyumbang risiko yang sama ke portofolio.</p>
      </details>

      <h2 id="worked3">🔬 Worked Example 3: Bonus Rebalancing — Untung dari Disiplin</h2>
      <p>Awal tahun: Rp100 juta, 50/50 PAYUNG &amp; ESKRIM (Rp50 jt tiap aset). Setahun kemudian PAYUNG +40% (→ Rp70 jt), ESKRIM −20% (→ Rp40 jt). Total Rp110 jt. Tanpa rebalancing, bobot kini 63,6/36,4. Kamu <strong>rebalance</strong> ke 50/50: jual Rp15 jt PAYUNG, beli Rp15 jt ESKRIM. Tahun berikutnya PAYUNG −20%, ESKRIM +40%. Bandingkan dengan tanpa rebalance.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Dengan rebalance</strong> (mulai tahun 2 dari 55/55): PAYUNG: 55 × 0,80 = 44 &rarr; ESKRIM: 55 × 1,40 = 77 &rarr; <strong>total Rp121 jt</strong>.</p>
        <p><strong>Tanpa rebalance</strong> (mulai 70/40): PAYUNG: 70 × 0,80 = 56 &rarr; ESKRIM: 40 × 1,40 = 56 &rarr; <strong>total Rp112 jt</strong>.</p>
        <p><strong>Selisih: Rp9 juta</strong> — &ldquo;bonus&rdquo; dari disiplin menjual yang mahal &amp; membeli yang murah secara mekanis. Rebalancing = <strong>strategi contrarian otomatis</strong>: memaksamu &ldquo;beli saat takut, jual saat serakah&rdquo; tanpa perlu keberanian — cukup kalender (misal tiap 6–12 bulan).</p>
        <p><strong>Catatan jujur:</strong> bonus ini muncul karena asumsi <em>mean-reversion</em> (yang naik akan turun, yang turun akan naik). Di pasar yang <em>trending</em> kuat (saham teknologi 2010–2021), rebalancing justru &ldquo;memotong bunga sebelum mekar&rdquo;. Tidak ada strategi yang menang di semua cuaca — yang ada hanya strategi yang <em>risikonya kamu pahami</em>.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 2008 — Saat Semua Korelasi Menjadi 1</h2>
      <p>Kelemahan fatal teori Markowitz terungkap di krisis:</p>
      <ul>
        <li>Model memakai <strong>korelasi historis</strong> (masa tenang). Saat krisis 2008, investor panik menjual <em>semuanya</em> — saham, obligasi korporasi, komoditas, properti — <strong>korelasi melonjak mendekati +1</strong>. Payung &amp; es krim tiba-tiba bergerak <em>searah</em>: keduanya jatuh.</li>
        <li>Portofolio &ldquo;terdiversifikasi sempurna&rdquo; di atas kertas jatuh hampir seperti satu aset tunggal. <strong>Diversifikasi gagal tepat saat paling dibutuhkan</strong> — seperti sabuk pengaman yang lepas saat tabrakan.</li>
        <li>Yang selamat? Aset dengan korelasi <em>struktural</em> negatif: <strong>obligasi pemerintah AS &amp; Jerman</strong> (arus <em>flight-to-safety</em>), <strong>kas</strong>, dan emas (sebagian). Pelajaran: diversifikasi antar <strong>kelas aset yang perilakunya beda di krisis</strong> &gt; diversifikasi antar 50 saham yang semuanya tenggelam bersama.</li>
      </ul>
      <p><strong>Respons industri:</strong> lahir <em>risk parity</em>, <em>tail-risk hedging</em> (membeli opsi put jauh sebagai &ldquo;asuransi portofolio&rdquo;), dan <em>stress testing</em> — menguji portofolio bukan pada korelasi normal, tapi pada <strong>korelasi krisis</strong>. Markowitz tidak salah — ia hanya butuh dilengkapi dengan pertanyaan: <em>&ldquo;bagaimana jika korelasinya berubah?&rdquo;</em></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>diversifikasi semu</strong> vs <strong>nyata</strong>. 20 saham teknologi AS = satu taruhan (sektor &amp; faktor sama). 20 aset lintas kelas (saham domestik, obligasi pemerintah, emas, kas, properti) = diversifikasi nyata. Uji cepat: <em>saat krisis 2020/2008, apakah aset-aset ini jatuh bersamaan?</em> Jika ya — kamu tidak terdiversifikasi, kamu hanya <em>terfragmentasi</em>.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin banyak saham, makin terdiversifikasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> manfaat diversifikasi <strong>melandai cepat</strong> — riset klasik menunjukkan ~20–30 saham acak sudah menangkap sebagian besar manfaat; setelah itu yang bertambah hanya biaya &amp; kerumitan. Dan &ldquo;acak&rdquo; itu penting: 30 saham dari <em>satu sektor</em> = tidak terdiversifikasi sama sekali. <strong>Kualitas korelasi &gt; kuantitas aset.</strong></p>
      </div>

      <h2 id="duarisiko">🔧 Pendalaman: Dua Risiko — yang Bisa vs yang Tak Bisa Didiversifikasi</h2>
      <p>Total risiko saham = <strong>risiko sistematis</strong> + <strong>risiko idiosinkratik</strong>:</p>
      <ul>
        <li><strong>Risiko idiosinkratik</strong> (<em>unsystematic</em>): kebakaran pabrik MAJU, CEO tersandung kasus, produk gagal. <strong>Bisa</strong> didiversifikasi — kebakaran pabrik A tidak membakar pabrik B. Inilah yang &ldquo;dimakan&rdquo; diversifikasi Markowitz.</li>
        <li><strong>Risiko sistematis</strong>: resesi, kenaikan BI rate, pandemi. <strong>Tidak bisa</strong> didiversifikasi — menimpa semua aset berisiko sekaligus. Inilah &ldquo;sisa&rdquo; yang tetap ada bahkan di portofolio 500 saham.</li>
      </ul>
      <p><strong>Konsekuensi untuk harga (jembatan ke E9/CAPM):</strong> karena risiko idiosinkratik bisa dihilangkan <em>gratis</em> (cukup diversifikasi), pasar <strong>tidak membayar</strong> kamu untuk menanggungnya. Satu-satunya risiko yang &ldquo;dihargai&rdquo; pasar = risiko sistematis. Implikasi brutal: memegang 1 saham terkonsentrasi = menanggung risiko yang <strong>tidak dikompensasi</strong> — seperti membayar asuransi yang tidak pernah bisa diklaim.</p>
      <p><strong>Untuk karirmu:</strong> setiap kali melihat portofolio terkonsentrasi (klien private banking &ldquo;all-in&rdquo; 2 saham), diagnosisnya satu kalimat: <em>&ldquo;Bapak menanggung risiko idiosinkratik yang pasar tidak bayar — mari pindahkan ke risiko sistematis yang dikompensasi, dengan return ekspektasi yang sama.&rdquo;</em> Itu nasihat senilai fee advisory.</p>

'''
txt = insert_before_quiz(txt, sec)
save("e8-markowitz", txt)
print("OK e7 e8")
for s in ["e7-return-risiko", "e8-markowitz"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
