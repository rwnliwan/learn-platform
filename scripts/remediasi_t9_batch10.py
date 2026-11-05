#!/usr/bin/env python3
"""Remediasi T9 batch 10 (final round): e1, e2, e3 — pendalaman + worked + box."""
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

# ================= E1 =================
txt = load("e1-struktur-pasar")
toc = '''
          <li><a href="#bookbuilding">🔧 Pendalaman: Bookbuilding — Dari Mana Harga IPO Muncul?</a></li>
          <li><a href="#worked4">🔬 Worked Example: Alokasi IPO &amp; Underpricing</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="bookbuilding">🔧 Pendalaman: Bookbuilding — Dari Mana Harga IPO Rp1.000 Itu Muncul?</h2>
      <p>Cerita pembuka menyebut &ldquo;IPO @ Rp1.000&rdquo; seolah harga itu jatuh dari langit. Tidak — ia <strong>dilelang</strong> lewat <em>bookbuilding</em>:</p>
      <ol>
        <li><strong>Rentang awal:</strong> underwriter + emiten menetapkan kisaran indikatif, misal Rp900–1.100, berdasar valuasi pembanding (<em>comparables</em> — P/E emiten sejenis, E6!) dan permintaan pasar.</li>
        <li><strong>Masa penawaran:</strong> investor institusi memasukkan <em>bid</em>: &ldquo;kami mau 5 juta lembar @ Rp1.050&rdquo;. Semua bid dikumpulkan dalam &ldquo;buku&rdquo; (<em>book</em>).</li>
        <li><strong>Penetapan harga:</strong> underwriter memilih harga yang <strong>membersihkan pasar</strong> — permintaan ≈ penawaran. Jika book <em>oversubscribed</em> 10× di Rp1.000, harga final bisa dinaikkan; jika sepi, diturunkan atau IPO ditunda.</li>
        <li><strong>Alokasi:</strong> saat oversubscribed, tidak semua bid terpenuhi — institusi besar &amp; &ldquo;teman&rdquo; underwriter biasanya dapat jatah lebih (sumber konflik kepentingan klasik!).</li>
      </ol>
      <p><strong>Fenomena underpricing:</strong> rata-rata global, saham IPO <strong>naik ~15–20% di hari pertama</strong> — artinya harga IPO &ldquo;kemurahan&rdquo;. Kenapa underwriter tidak mematok lebih tinggi saja?</p>
      <ul>
        <li><strong>Asimetri informasi:</strong> investor takut &ldquo;barang busuk&rdquo; (<em>winner&apos;s curse</em>) — hanya mau ikut jika ada &ldquo;diskon&rdquo; sebagai kompensasi ketidaktahuan.</li>
        <li><strong>Insentif underwriter:</strong> IPO yang &ldquo;sukses&rdquo; (naik hari pertama) = reputasi underwriter bagus = klien berikutnya antre. Underwriter <strong>diberi insentif</strong> untuk underprice — dengan uang <em>emiten</em> (yang &ldquo;kehilangan&rdquo; dana yang bisa dihimpun)!</li>
        <li><strong>Stabilisasi:</strong> underwriter boleh menopang harga pasca-IPO (<em>greenshoe option</em>) — &ldquo;jangkar&rdquo; artifisial 30 hari pertama.</li>
      </ul>
      <h2 id="worked4">🔬 Worked Example: Alokasi IPO — Kenapa Ritel Dapat Remah-Remah?</h2>
      <p>IPO MajuMundur: 100 juta lembar @ Rp1.000. Bookbuilding: institusi memesan <strong>800 juta lembar</strong>, ritel memesan <strong>50 juta lembar</strong>. Jatah ritel (<em>pooling</em>): <strong>10 juta lembar</strong>.</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Oversubscription institusi:</strong> 800 ÷ 90 (jatah institusi 90 jt) = <strong>8,9×</strong>. Ritel: 50 ÷ 10 = <strong>5×</strong>.</p>
        <p><strong>Alokasi:</strong> tiap pemesan institusi rata-rata dapat 1/8,9 = <strong>11%</strong> pesanannya; ritel dapat 1/5 = <strong>20%</strong> — terlihat ritel &ldquo;menang&rdquo;, tapi…</p>
        <p><strong>Hari pertama: harga melonjak ke Rp1.300 (+30%).</strong> Ritel yang memesan Rp10 juta (10.000 lembar) hanya dapat 2.000 lembar &rarr; untung Rp600 ribu — bukan Rp3 juta yang dibayangkan. <strong>Oversubscription = jatahmu disunat proporsional.</strong></p>
        <p><strong>Intuisi:</strong> &ldquo;IPO pasti cuan&rdquo; mengabaikan <strong>alokasi</strong>: makin ramai peminat, makin kecil jatahmu, makin kecil cuan absolutmu — sementara <em>risiko</em> (uang mengendap saat penjatahan, harga bisa juga <em>turun</em> di bawah IPO!) tetap penuh. Hitung <em>expected value</em> dengan jatah realistis, bukan dengan fantasi &ldquo;dapat full lalu naik 30%&rdquo;.</p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IPO = pasti untung karena underpricing.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> <em>rata-rata</em> underpricing ≠ <em>setiap</em> IPO untung. Banyak IPO <strong>jatuh di bawah harga IPO</strong> dalam setahun (terutama yang valuasinya dipompa <em>hype</em>). Ditambah: ritel dapat jatah kecil saat IPO bagus (oversubscribed) dan jatah <em>penuh</em> saat IPO sepi (yang sepi = yang kurang diminati = yang berisiko!). Seleksi adverse ini = <strong>ritel sistematis dapat bagian terburuk dari kedua dunia</strong>. Ikut IPO karena analisis emitennya — bukan karena &ldquo;IPO = cuan&rdquo;.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e1-struktur-pasar", txt)

# ================= E2 =================
txt = load("e2-instrumen")
toc = '''
          <li><a href="#cpn">🔧 Pendalaman: Membongkar Produk Terstruktur Bank</a></li>
          <li><a href="#worked4">🔬 Worked Example: Bedah Capital Protected Note</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="cpn">🔧 Pendalaman: Membongkar Produk Terstruktur — &ldquo;Modal Dijamin + Ikut Untung Saham&rdquo;?</h2>
      <p>Bank menawarkan <strong>Capital Protected Note (CPN)</strong> 3 tahun: &ldquo;modal 100% dijamin kembali + dapat 70% kenaikan IHSG jika naik!&rdquo; Terdengar mustahil — dari mana bank membayar &ldquo;jaminan + upside&rdquo;? Bongkar dengan E3 + E10 + E11:</p>
      <ol>
        <li><strong>Komponen obligasi:</strong> dari Rp100 juta danamu, bank menaruh ~Rp85 juta di <strong>obligasi zero-coupon 3 tahun</strong> (yield ~5,5%) &rarr; 85 × (1,055)<sup>3</sup> ≈ <strong>Rp100 juta</strong> saat jatuh tempo. <em>Inilah &ldquo;jaminan modalnya&rdquo;</em> — bukan sihir, tapi TVM.</li>
        <li><strong>Komponen opsi:</strong> sisa ~Rp15 juta dibelikan <strong>opsi call IHSG 3 tahun</strong> (partisipasi 70% — artinya opsi yang dibeli setara 70% eksposur). Jika IHSG naik 30% &rarr; kamu dapat 21%. Jika turun &rarr; opsi hangus, kamu tetap dapat Rp100 juta.</li>
        <li><strong>Fee tersembunyi:</strong> &ldquo;harga wajar&rdquo; kedua komponen mungkin hanya Rp97 juta — <strong>Rp3 juta = margin bank</strong> (distribusi, lindung nilai, keuntungan). Kamu tidak akan pernah melihat angka ini di brosur.</li>
      </ol>
      <p><strong>Kenapa bank menjual ini (bukan kamu merakit sendiri)?</strong> Karena merakit sendiri butuh: akses obligasi zero-coupon + akses opsi IHSG OTC + modal besar + pengetahuan. Bank menjual <strong>kemudahan + kemasan</strong> — dengan harga 2–4% margin. Pertanyaan yang benar: <em>&ldquo;apakah kemudahan ini sepadan dengan marginnya?&rdquo;</em></p>
      <h2 id="worked4">🔬 Worked Example: Bedah CPN Rp100 Juta — Berapa yang Sebenarnya Kamu Beli?</h2>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Nilai komponen obligasi:</strong> zero-coupon 3 thn, yield 5,5%: PV = 100 ÷ (1,055)<sup>3</sup> = 100 ÷ 1,174 = <strong>Rp85,2 juta</strong>.</p>
        <p><strong>Langkah 2 — Sisa untuk opsi:</strong> 100 − 85,2 = <strong>Rp14,8 juta</strong> &rarr; inilah &ldquo;anggaran&rdquo; opsi call 3 tahun partisipasi 70%.</p>
        <p><strong>Langkah 3 — Skenario:</strong> IHSG +30% &rarr; kamu terima 100 + (70% × 30%) = <strong>Rp121 juta</strong>. Bandingkan beli IHSG langsung (ETF): 100 × 1,30 = <strong>Rp130 juta</strong> — kamu &ldquo;kehilangan&rdquo; Rp9 juta = harga proteksi + margin bank. IHSG −20% &rarr; kamu terima <strong>Rp100 juta</strong> (vs Rp80 juta jika pegang ETF) — proteksinya bekerja.</p>
        <p><strong>Langkah 4 — Risiko yang disembunyikan brosur:</strong> (a) <strong>risiko kredit bank penerbit</strong> — &ldquo;jaminan modal&rdquo; = janji <em>bank</em>, bukan LPS! Jika bank bangkrut, notemu = obligasi tanpa agunan (ingat hierarki E2 Worked 2!); (b) <strong>tidak likuid</strong> — jual sebelum jatuh tempo = potongan besar; (c) <strong>risiko inflasi</strong> — &ldquo;kembali 100%&rdquo; nominal setelah 3 tahun inflasi 4%/thn = <strong>rugi daya beli ~11%</strong>.</p>
        <p><strong>Intuisi:</strong> setiap produk terstruktur = <strong>obligasi + opsi + margin</strong>. Keterampilan &ldquo;membongkar&rdquo; ini (disebut <em>reverse engineering</em> produk) = yang dikerjakan <em>structurer</em> bank dengan gaji besar — dan sekarang kamu bisa melakukannya dengan E3 + E10 + E11. <strong>Jangan beli kemasan; beli komponennya — atau tolak kemasannya.</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga pertanyaan E2 (dari mana untung? skenario terburuk? kapan cair?) ditambah satu untuk produk bank: <strong>(4) siapa lawan transaksiku dan berapa marginnya?</strong> Jika bank tidak bisa menjawab dengan angka — <em>kamu</em> adalah marginnya. Produk yang bagus berani transparan; yang tidak, bersembunyi di balik brosur mengkilap.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e2-instrumen", txt)

# ================= E3 =================
txt = load("e3-tvm")
toc = '''
          <li><a href="#wacc">🔧 Pendalaman: Memilih Discount Rate — Dari SBN ke WACC</a></li>
          <li><a href="#worked4">🔬 Worked Example: NPV Proyek — Layak atau Tidak?</a></li>'''
txt = add_toc(txt, toc)
sec = '''      <h2 id="wacc">🔧 Pendalaman: Discount Rate Berapa yang &ldquo;Benar&rdquo;? (Menuju WACC)</h2>
      <p>Semua rumus TVM butuh <Tex math={String.raw`r`} /> — tapi <em>r berapa</em>? Jawabannya berlapis:</p>
      <ul>
        <li><strong>Lapis 1 — Risk-free:</strong> yield SBN tenor setara (E4). Ini &ldquo;lantai&rdquo;: tidak ada investasi berisiko yang boleh didiskonto di bawah ini.</li>
        <li><strong>Lapis 2 — Risk-free + premi risiko aset:</strong> obligasi korporasi = SBN + credit spread (E5!); saham = SBN + premi ekuitas via CAPM (E9!). <strong>Diskonto = cerminan risiko arus kasnya.</strong></li>
        <li><strong>Lapis 3 — WACC (<em>weighted average cost of capital</em>):</strong> untuk menilai <em>proyek perusahaan</em>, pakai rata-rata tertimbang biaya modalnya: <Tex math={String.raw`WACC = w_e \\cdot r_e + w_d \\cdot r_d(1-T)`} />, dengan <Tex math={String.raw`w_e, w_d`} /> = bobot ekuitas/utang, <Tex math={String.raw`r_e`} /> = required return saham (CAPM!), <Tex math={String.raw`r_d`} /> = biaya utang, <Tex math={String.raw`T`} /> = pajak (bunga utang <em>tax-deductible</em>!).</li>
      </ul>
      <p><strong>Kenapa berlapis:</strong> memakai <em>r</em> yang salah = jawaban yang salah dengan presisi tinggi. Mendiskonto proyek berisiko dengan bunga deposito = <strong>melebih-lebihkan nilainya</strong> (proyek buruk terlihat bagus). Aturan: <strong>samakan risiko arus kas dengan risiko diskontonya</strong> — <em>matching principle</em> valuasi.</p>
      <h2 id="worked4">🔬 Worked Example: NPV Proyek — Investasi Rp10 Miliar, Layak?</h2>
      <p>PT MajuMundur mempertimbangkan pabrik baru: investasi <strong>Rp10 M</strong> hari ini, arus kas bersih <strong>Rp3 M/tahun selama 5 tahun</strong>. WACC perusahaan <strong>12%</strong>. Layak?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — PV arus kas</strong> (anuitas, E3 Worked 3!): PV = 3 × [1 − (1,12)<sup>−5</sup>]/0,12. (1,12)<sup>5</sup> ≈ 1,762 &rarr; (1,12)<sup>−5</sup> ≈ 0,5674. PV = 3 × (0,4326/0,12) = 3 × 3,6048 = <strong>Rp10,81 M</strong>.</p>
        <p><strong>Langkah 2 — NPV:</strong> 10,81 − 10 = <strong>+Rp0,81 M</strong>. NPV &gt; 0 &rarr; <strong>layak</strong> (menciptakan nilai Rp810 juta di atas biaya modalnya).</p>
        <p><strong>Langkah 3 — Uji sensitivitas:</strong> jika WACC 15% (risiko ternyata lebih tinggi): PV = 3 × [1 − (1,15)<sup>−5</sup>]/0,15 = 3 × 3,3522 = Rp10,06 M &rarr; NPV = <strong>+Rp0,06 M</strong> — nyaris impas! Jika arus kas meleset 10% (Rp2,7 M/thn) @12%: PV = 9,73 M &rarr; NPV <strong>negatif</strong>.</p>
        <p><strong>Intuisi:</strong> NPV positif <strong>tipis</strong> + sensitif = proyek <em>rapuh</em>. Analis profesional tidak berhenti di &ldquo;NPV positif&rdquo; — ia bertanya <em>&ldquo;seberapa salah asumsiku boleh sebelum NPV negatif?&rdquo;</em> (<em>margin of safety</em>). Inilah jembatan TVM → keputusan korporasi nyata: <strong>matematika memberi angka, sensitivitas memberi kebijaksanaan.</strong></p>
      </details>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;IRR lebih tinggi = proyek lebih baik, selalu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> IRR (<em>internal rate of return</em> — diskonto yang membuat NPV = 0) punya dua cacat: (1) <strong>asumsi reinvestasi</strong> — IRR mengasumsikan arus kas diinvestasikan ulang <em>pada IRR itu sendiri</em> (tidak realistis jika IRR 40%!); (2) <strong>proyek mutually exclusive</strong> — proyek kecil IRR 50% (NPV Rp1 M) vs proyek besar IRR 20% (NPV Rp10 M): IRR memilih yang kecil, padahal yang besar menciptakan nilai 10× lipat! <strong>NPV = kriteria utama</strong>; IRR = pelengkap. Jangan biarkan persentase menipu — nilai absolut (rupiah!) yang dibelanjakan.</p>
      </div>

'''
txt = insert_before_quiz(txt, sec)
save("e3-tvm", txt)
print("OK batch10")
for s in ["e1-struktur-pasar", "e2-instrumen", "e3-tvm"]:
    with open(f"{BASE}/{s}/page.tsx", encoding="utf-8") as f:
        print(s, len(f.read().split()))
