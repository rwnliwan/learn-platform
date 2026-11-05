"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function MR13Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Bid-ask spread melebar saat stres (ilustrasi krisis)
  const days = Array.from({ length: 60 }, (_, i) => i + 1);
  const spreadNormal = days.map(() => 0.15);
  const spreadStress = days.map((d) => (d > 35 && d < 50 ? 0.15 + (d - 35) * 0.35 : 0.15));

  const spreadData = [
    { x: days, y: spreadStress, type: "scatter", mode: "lines", name: "Bid-ask spread (%)", line: { color: "#ef4444", width: 2.5 }, fill: "tozeroy", fillcolor: "rgba(239,68,68,0.15)" },
  ];

  // LVaR vs VaR: komponen biaya likuidasi
  const lvarData = [
    {
      x: ["Saham LQ45", "Obligasi korporasi", "Surat utang BUMN", "Properti REIT", "Saham lapis 3"],
      y: [2.1, 5.8, 4.2, 8.5, 14.0],
      type: "bar", name: "VaR 99%/1-hari (%)", marker: { color: "#2a7de1" },
    },
    {
      x: ["Saham LQ45", "Obligasi korporasi", "Surat utang BUMN", "Properti REIT", "Saham lapis 3"],
      y: [0.3, 2.4, 1.1, 5.2, 9.8],
      type: "bar", name: "Biaya likuidasi tambahan (%)", marker: { color: "#e8a838" },
    },
  ];

  const lab1Code = String.raw`# LVaR: VaR + biaya likuidasi.
# LVaR = VaR + COL, dengan COL (cost of liquidation) ~ 0.5 * spread * posisi
#        + market impact jika posisi besar relatif thd volume harian.
# Aturan praktis: jika posisi > 10% ADV (average daily volume), tambah market impact.

def lvar(posisi, var_pct, spread_pct, adv=None):
    var = posisi * var_pct
    col_spread = 0.5 * spread_pct * posisi
    impact = 0.0
    if adv and posisi > 0.1 * adv:
        # market impact: butuh beberapa hari, harga bergerak melawanmu
        hari = posisi / (0.2 * adv)  # likuidasi 20% ADV per hari
        impact = posisi * 0.01 * hari  # 1% per hari tekanan harga (ilustratif)
    lvar_ = var + col_spread + impact
    return var, col_spread, impact, lvar_

portofolio = [
    ("Saham LQ45 Rp50M", 50_000_000_000, 0.021, 0.003, 500_000_000_000),
    ("Obligasi korp Rp50M", 50_000_000_000, 0.058, 0.024, 20_000_000_000),
    ("Saham lapis3 Rp50M", 50_000_000_000, 0.140, 0.098, 5_000_000_000),
]
print(f"{'Posisi':22s} {'VaR':>10s} {'SpreadCost':>11s} {'Impact':>9s} {'LVaR':>10s}  LVaR/VaR")
for nama, pos, vp, sp, adv in portofolio:
    var, col, imp, lv = lvar(pos, vp, sp, adv)
    print(f"{nama:22s} {var/1e9:>9.1f}M {col/1e9:>10.1f}M {imp/1e9:>8.1f}M {lv/1e9:>9.1f}M  {lv/var:.2f}x")
print()
print("Saham lapis 3: LVaR 1.9x VaR! VaR 'murni' meremehkan risiko aset illiquid.")
print("Coba: naikkan spread 2x lipat (simulasi krisis). Rasio LVaR/VaR jadi?")`;

  const lab2Code = String.raw`# LCR & NSFR: dua rasio likuiditas Basel III.
# LCR = HQLA / Net Cash Outflow (30 hari) >= 100%
# NSFR = ASF / RSF >= 100%  (pendanaan stabil vs kebutuhan stabil, 1 tahun)

# Neraca bank (Rp triliun)
hqla = 120          # Level 1 (kas, SBN) + Level 2 dgn haircut
outflow_30d = 95    # penarikan deposito + margin call + komitmen
inflow_30d = 20     # arus masuk kontraktual (dibatasi 75% outflow)
net_outflow = outflow_30d - min(inflow_30d, 0.75 * outflow_30d)

lcr = hqla / net_outflow
print(f"LCR = {hqla} / {net_outflow:.0f} = {lcr:.1%}  {'OK' if lcr >= 1 else 'GAGAL!'}")

# NSFR
asf = 80 + 0.9*200 + 0.5*150   # modal(100%) + deposito stabil(90%) + kurang stabil(50%)
rsf = 0.05*120 + 0.5*100 + 0.85*300  # HQLA(5%) + SBN(50%?) + kredit(85%)
nsfr = asf / rsf
print(f"NSFR = {asf:.0f} / {rsf:.0f} = {nsfr:.1%}  {'OK' if nsfr >= 1 else 'GAGAL!'}")
print()
print("STRESS: penarikan deposito 2x lipat (outflow 190T):")
outflow2 = 190
net2 = outflow2 - min(inflow_30d, 0.75*outflow2)
print(f"  LCR stres = {hqla/net2:.1%}  {'OK' if hqla/net2>=1 else 'GAGAL -> butuh HQLA tambahan atau kurangi outflow!'}")
print()
print("Coba: berapa HQLA minimal agar LCR stres tetap >= 100%?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">MR13 — Market Risk Analytics</span>
        <h1 className="display-title">Risiko Likuiditas:<br />Saat &ldquo;Harga Pasar&rdquo; Tidak Bisa Kamu Dapatkan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Miliaran yang Tidak Bisa Dijual</a></li>
          <li><a href="#jenisl">Dua Likuiditas: Pasar vs Pendanaan</a></li>
          <li><a href="#bidask">Bid-Ask Spread: Harga Ketidaksabaran</a></li>
          <li><a href="#lvar">LVaR: VaR yang Jujur Tentang Biaya Keluar</a></li>
          <li><a href="#lcr">LCR &amp; NSFR: Sabuk Pengaman Basel III</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung LVaR per Aset</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji LCR &amp; NSFR Bank</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#dalam">🔬 Pendalaman: 2008 — Ketika Likuiditas Menguap (dan Cara Mengukurnya)</a></li>
          <li><a href="#case">📋 Mini-Case: Bank yang &ldquo;Likuid&rdquo; di Kertas</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan liquidity pasar vs liquidity pendanaan — dan menjelaskan spiral kematian di antara keduanya.</li>
          <li>Menjelaskan bid-ask spread sebagai biaya likuiditas dan mengapa ia melebar saat krisis.</li>
          <li>Menghitung LVaR (VaR + biaya likuidasi + market impact) dan menafsirkan kapan ia jauh melebihi VaR biasa.</li>
          <li>Menghitung dan menafsirkan LCR dan NSFR — termasuk apa yang dihitung sebagai HQLA/ASF/RSF.</li>
          <li>Mengidentifikasi kapan risiko likuiditas mengubah keputusan (limit posisi, haircut, buffer).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Miliaran yang Tidak Bisa Dijual</h2>
      <div className="story">
        <p>Manajer dana memegang obligasi korporasi <strong>Rp500 miliar</strong>. Layar Bloomberg menunjukkan harga: 98,5. &ldquo;Nilai portofolio saya Rp492,5 miliar,&rdquo; katanya. Lalu datang penebusan besar — ia harus jual Rp100 miliar <em>hari ini</em>.</p>
        <p>Dealer pertama menawar <strong>96,0</strong>. Kedua: 95,5. &ldquo;Pasar tipis, bos.&rdquo; Ia akhirnya menjual bertahap selama seminggu di rata-rata <strong>94,2</strong> — rugi <strong>Rp21,5 miliar</strong> dari &ldquo;nilai pasar&rdquo; yang tertera di layar. Harga 98,5 itu adalah harga untuk <strong>lot kecil</strong>; untuk Rp100 miliar, harga sebenarnya jauh lebih rendah.</p>
        <p>Twist-nya: <strong>VaR portofolionya tidak menangkap ini sama sekali</strong> — VaR mengasumsikan kamu bisa keluar di harga pasar (mid price). Kenyataannya, keluar itu <strong>berbiaya</strong>: spread + market impact. Dan biaya itu <strong>membesar tepat saat kamu paling butuh keluar</strong> (krisis = semua orang jual bersamaan). Inilah risiko likuiditas: <strong>selisih antara &ldquo;harga di layar&rdquo; dan &ldquo;harga yang bisa kamu dapatkan&rdquo;</strong>.</p>
      </div>

      <h2 id="jenisl">Dua Likuiditas: Pasar vs Pendanaan</h2>
      <ul>
        <li><strong>Market liquidity:</strong> seberapa cepat &amp; murah kamu bisa <strong>menjual aset</strong> tanpa menggerakkan harga. Rendah = spread lebar, volume tipis.</li>
        <li><strong>Funding liquidity:</strong> seberapa mudah kamu <strong>mendapat kas/pinjaman</strong> saat butuh (rollover utang, margin call). Rendah = pasar pendanaan membeku.</li>
      </ul>
      <p><strong>Spiral kematian (Brunnermeier-Pedersen):</strong> market liquidity turun → harga jatuh → margin call naik → butuh funding → funding kering → <strong>forced selling</strong> → harga makin jatuh → … Inilah mekanisme 2008 dan setiap krisis likuiditas. <strong>Keduanya harus dipantau bersamaan</strong> — likuiditas pasar tanpa likuiditas pendanaan = mobil tanpa bensin.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> likuiditas itu seperti <strong>oksigen</strong> — tidak terlihat saat ada, mematikan saat hilang. Dan seperti oksigen, ia hilang <strong>tepat saat kamu paling butuh</strong> (semua orang butuh oksigen bersamaan). Jangan ukur likuiditas di masa tenang lalu merasa aman.</p>
      </div>

      <h2 id="bidask">Bid-Ask Spread: Harga Ketidaksabaran</h2>
      <p><strong>Definisi.</strong> <strong>Bid-ask spread</strong> = selisih harga jual (bid) vs harga beli (ask). Untuk keluar <em>sekarang</em>, kamu menjual di bid — <strong>di bawah</strong> mid price:</p>
      <Tex math={String.raw`\text{Biaya likuidasi} \approx \tfrac{1}{2} \times \text{spread} \times \text{posisi}`} block />
      <p><strong>Kenapa setengah?</strong> Mid price = tengah bid-ask; menjual di bid berarti &ldquo;membayar&rdquo; setengah spread dari mid. (Untuk round-trip penuh: spread penuh.)</p>
      <p><strong>Kenapa spread melebar saat krisis:</strong> market maker <strong>takut</strong> (risiko inventory naik → minta kompensasi lebih) dan <strong>modal terbatas</strong> (tidak bisa menampung arus jual). Spread yang 0,15% di masa normal bisa jadi <strong>2%+</strong> saat panik — biaya likuidasi naik <strong>10× lipat</strong> tepat saat semua orang ingin keluar.</p>

      <PlotlyChart
        data={spreadData}
        title="Bid-Ask Spread Melebar Saat Stres (simulasi)"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Spread (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = bid-ask spread (%) terhadap waktu. Hari 35–50 = episode stres.</p>
        <p><strong>Interpretasi:</strong> spread melonjak dari 0,15% ke <strong>5%+</strong> — 30× lipat. Biaya likuidasi posisi Rp100 M naik dari Rp75 juta menjadi <strong>Rp2,5 miliar</strong>. <strong>Pelajaran:</strong> spread rata-rata historis <strong>menyesatkan</strong> — yang penting adalah spread <em>saat stres</em>. Selalu ukur biaya likuidasi dengan spread stres, bukan spread normal.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Volume perdagangan tinggi = likuid.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> volume tinggi <em>saat kamu butuh jual</em> belum tentu membantumu — jika volume itu <strong>satu arah</strong> (semua jual), tidak ada pembeli di sisi lain. Likuiditas sejati = <strong>kedalaman dua arah + ketahanan</strong> (resilience: harga kembali setelah guncangan). Volume tanpa kedalaman = ilusi.</p>
      </div>

      <h2 id="lvar">LVaR: VaR yang Jujur Tentang Biaya Keluar</h2>
      <p><strong>Definisi.</strong> <strong>LVaR (Liquidity-adjusted VaR)</strong> menambahkan biaya likuidasi ke VaR biasa:</p>
      <Tex math={String.raw`\text{LVaR} = \text{VaR} + \underbrace{\tfrac{1}{2}\cdot s \cdot P}_{\text{biaya spread}} + \underbrace{\text{market impact}}_{\text{jika posisi besar}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`s`} /> = bid-ask spread (relatif); <Tex math={String.raw`P`} /> = nilai posisi; <strong>market impact</strong> = biaya tambahan jika posisi besar relatif terhadap volume harian (ADV) — karena menjual 50% ADV menggerakkan harga melawanmu.</p>
      <p><strong>Aturan praktis:</strong> jika posisi &gt; <strong>10% ADV</strong>, asumsikan butuh beberapa hari untuk keluar → tambah market impact + pertimbangkan <strong>horizon likuiditas</strong> lebih panjang (bukan 1 hari!). Inilah logika <strong>liquidity horizon</strong> di FRTB (MR16): aset illiquid dihitung dengan horizon lebih panjang.</p>

      <PlotlyChart
        data={lvarData}
        title="VaR vs Biaya Likuidasi Tambahan per Aset (%)"
        layout={{ barmode: "stack", xaxis: { title: "Aset" }, yaxis: { title: "% dari posisi" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang stacked — biru bawah = VaR 99%/1-hari (%), kuning atas = biaya likuidasi tambahan (%). Total tinggi = LVaR.</p>
        <p><strong>Interpretasi:</strong> untuk saham LQ45, biaya likuidasi <strong>kecil</strong> (0,3% vs VaR 2,1%) — VaR biasa cukup. Tapi untuk <strong>saham lapis 3</strong>, biaya likuidasi (9,8%) hampir <strong>menyamai</strong> VaR-nya (14%)! <strong>Kesimpulan:</strong> VaR biasa sistematis meremehkan risiko aset illiquid — dan selisihnya justru terbesar di aset yang paling mungkin &ldquo;terjebak&rdquo;.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>LVaR/VaR ratio</strong> adalah &ldquo;skor illiquiditas&rdquo; portofolio. Rasio &gt; 1,5 = waspada; &gt; 2 = posisi ini <strong>tidak bisa diandalkan</strong> untuk likuiditas darurat. Jangan pernah mengandalkan aset ber-LVaR-tinggi sebagai &ldquo;buffer likuiditas&rdquo; — saat dibutuhkan, ia tidak bisa dijual tanpa rugi besar.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;LVaR hanya VaR yang ditambah sedikit biaya — tidak material.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> untuk aset likuid memang kecil — tapi untuk aset illiquid, biaya likuidasi bisa <strong>mendekati atau melebihi VaR itu sendiri</strong> (lihat saham lapis 3 di chart). Dan di masa krisis, spread melebar 10–30× lipat membuat &ldquo;sedikit biaya&rdquo; menjadi komponen <strong>dominan</strong>. Materialitasnya justru muncul saat paling penting.</p>
      </div>

      <h2 id="lcr">LCR &amp; NSFR: Sabuk Pengaman Basel III</h2>
      <p>Setelah 2008, Basel III mewajibkan dua rasio likuiditas (untuk <strong>funding liquidity</strong> bank):</p>
      <p><strong>1. LCR (Liquidity Coverage Ratio) — bertahan 30 hari:</strong></p>
      <Tex math={String.raw`\text{LCR} = \frac{\text{HQLA}}{\text{Arus kas keluar bersih 30 hari}} \ge 100\%`} block />
      <p><strong>Artinya:</strong> <strong>HQLA</strong> (High-Quality Liquid Assets: kas, SBN — dengan haircut untuk level 2) harus cukup untuk menutup <strong>arus keluar bersih</strong> dalam skenario stres 30 hari (penarikan deposito, margin call, penarikan komitmen kredit).</p>
      <p><strong>2. NSFR (Net Stable Funding Ratio) — struktur 1 tahun:</strong></p>
      <Tex math={String.raw`\text{NSFR} = \frac{\text{ASF}}{\text{RSF}} \ge 100\%`} block />
      <p><strong>Artinya:</strong> <strong>ASF</strong> (Available Stable Funding: modal 100%, deposito stabil 90–95%, utang &lt; 1Y 50%) harus ≥ <strong>RSF</strong> (Required Stable Funding: kredit 85%, HQLA 5%, dst.). Intinya: <strong>jangan danai aset jangka panjang dengan utang jangka pendek</strong> — pelajaran langsung dari 2008.</p>
      <p><strong>Kepribadian keduanya:</strong> LCR = <em>tabung oksigen</em> (bertahan 30 hari saat panik); NSFR = <em>gaya hidup sehat</em> (struktur pendanaan yang tidak rapuh). Bank butuh keduanya — tabung oksigen tanpa gaya hidup sehat = menunggu krisis berikutnya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> LCR/NSFR mengukur <strong>ketahanan</strong>, bukan <strong>profitabilitas</strong> — dan keduanya sering <em>bertentangan</em> (HQLA ber-yield rendah = &ldquo;mahal&rdquo;). Manajemen yang mengeluh &ldquo;LCR membebani laba&rdquo; sedang mengeluh tentang <strong>harga asuransi</strong>. Tugas risk manager: memastikan premi asuransi itu <strong>cukup</strong>, bukan menghilangkannya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Hitung LVaR per Aset</h2>
      <p>Ubah spread (simulasi krisis: ×3) dan lihat rasio LVaR/VaR. Aset mana yang &ldquo;terjebak&rdquo; duluan?</p>
      <PyodideLab
        title="Lab 1 — LVaR: VaR + Biaya Likuidasi"
        hint="Coba spread 3x untuk obligasi korporasi (0.024 → 0.072): LVaR/VaR bisa > 2. Inilah mengapa limit posisi harus memperhitungkan likuiditas, bukan cuma VaR."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Uji LCR &amp; NSFR Bank</h2>
      <p>Ubah outflow stres dan cari HQLA minimal agar LCR tetap ≥ 100%. Berapa &ldquo;harga&rdquo; keamanan itu?</p>
      <PyodideLab
        title="Lab 2 — LCR & NSFR di Bawah Skenario Stres"
        hint="Coba outflow 3x (285T): HQLA minimal = ? Bandingkan dengan HQLA awal 120T — selisihnya adalah 'premi asuransi' yang harus dibayar."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>

      <div className="decision-card">
        <h3>1. Posisi besar / aset tidak likuid → <strong>LVaR, bukan VaR biasa</strong></h3>
        <p><strong>Kondisi:</strong> posisi &gt; 10% ADV, atau spread &gt; 1%.</p>
        <p><strong>Alasan:</strong> VaR biasa mengasumsikan keluar di mid price — fiksi untuk posisi besar. LVaR memaksa kejujuran tentang biaya keluar.</p>
      </div>

      <div className="decision-card">
        <h3>2. Penetapan limit posisi → <strong>Batasi % ADV + LVaR</strong></h3>
        <p><strong>Kondisi:</strong> limit trading per instrumen.</p>
        <p><strong>Alasan:</strong> limit notional tanpa batas likuiditas = izin terjebak. &ldquo;Maks 15% ADV&rdquo; memastikan posisi bisa keluar dalam hitungan hari.</p>
      </div>

      <div className="decision-card">
        <h3>3. Ketahanan bank 30 hari → <strong>LCR ≥ 100% (dengan skenario stres sendiri)</strong></h3>
        <p><strong>Kondisi:</strong> manajemen likuiditas bank.</p>
        <p><strong>Alasan:</strong> LCR regulator = minimum. Bank yang sehat menjalankan <strong>stres internal</strong> yang lebih parah (penarikan lebih besar, haircut lebih dalam).</p>
      </div>

      <div className="decision-card">
        <h3>4. Struktur pendanaan jangka panjang → <strong>NSFR ≥ 100%</strong></h3>
        <p><strong>Kondisi:</strong> strategi pendanaan, penerbitan obligasi.</p>
        <p><strong>Alasan:</strong> NSFR memaksa pendanaan stabil untuk aset jangka panjang — mencegah model &ldquo;pinjam pendek, tanam panjang&rdquo; yang rapuh.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Harga di layar ≠ harga yang bisa kamu dapatkan</strong> — selalu kurangi biaya likuidasi.</li>
          <li><strong>LVaR/VaR &gt; 1,5</strong> = waspada; aset itu bukan buffer likuiditas.</li>
          <li><strong>LCR</strong> = oksigen 30 hari; <strong>NSFR</strong> = gaya hidup sehat. Butuh keduanya.</li>
          <li>Likuiditas hilang <strong>saat paling dibutuhkan</strong> — ukur dengan skenario stres, bukan rata-rata.</li>
        </ol>
      </div>

      <h2 id="dalam">🔬 Pendalaman: 2008 — Ketika Likuiditas Menguap (dan Cara Mengukurnya)</h2>
      <p>2008 bukan terutama krisis <em>solvabilitas</em> pada awalnya — ia adalah krisis <strong>likuiditas</strong>. Bank-bank yang &ldquo;sehat di kertas&rdquo; mati karena tidak bisa mendanai dirinya esok hari. Bagian ini membedah mekanismenya, menghitung LVaR lengkap langkah-demi-langkah, dan menjelaskan mengapa LCR/NSFR dirancang persis seperti itu.</p>

      <h3>Anatomi pembekuan 2007–2008</h3>
      <p>Tiga pasar pendanaan membeku berurutan — seperti domino:</p>
      <ol>
        <li><strong>ABCP (Asset-Backed Commercial Paper), Agustus 2007:</strong> pasar surat berharga jangka pendek beragun aset (~US$1,2 triliun) berhenti total dalam hitungan hari. Kendaraan investasi (SIV/conduit) yang menerbitkan ABCP untuk mendanai MBS jangka panjang tiba-tiba tidak bisa <em>roll</em> utangnya — dan bank sponsor terpaksa menampungnya kembali ke neraca. <strong>Risiko likuiditas kontinjensi</strong> yang tidak terlihat di VaR.</li>
        <li><strong>Interbank / LIBOR-OIS, 2007–2008:</strong> bank berhenti saling meminjamkan — <em>tidak percaya</em> lawan punya aset beracun. Spread LIBOR-OIS (ukuran ketidakpercayaan antarbank) meledak dari ~10 bp ke <strong>~350 bp</strong>. Pendanaan wholesale jangka pendek — yang murah di masa tenang — menjadi tidak ada harganya karena <em>tidak ada yang menjual</em>.</li>
        <li><strong>Repo, September 2008:</strong> setelah Lehman jatuh, bahkan pasar repo (pinjaman beragun) membeku untuk agunan selain Treasury. <em>Haircut</em> agunan MBS naik dari 2–5% ke <strong>30–50%</strong> — artinya tiap Rp100 agunan hanya bisa meminjam Rp50–70. Penarikan likuiditas massal dan serentak.</li>
      </ol>
      <p><strong>Pola umumnya:</strong> likuiditas adalah <strong>risiko yang berkorelasi dengan dirinya sendiri</strong> — saat kamu butuh menjual, semua orang butuh menjual; saat kamu butuh meminjam, semua orang butuh meminjam. Ia menguap <em>tepat</em> saat dibutuhkan. Inilah mengapa mengukur likuiditas dari data masa tenang (spread sempit, volume tebal) sama menipunya dengan mengukur risiko pasar dari VaR masa tenang.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: LVaR lengkap — VaR + biaya likuidasi + market impact (klik untuk buka)</summary>
        <p><strong>Portofolio:</strong> 3 posisi saham mid-cap, masing-masing Rp500 M (total Rp1,5 T). VaR 99%/1-hari portofolio (dari model): <strong>Rp90 M</strong>.</p>
        <p><strong>Langkah 1 — biaya spread normal:</strong> bid-ask spread rata-rata 40 bp (0,40%). Biaya likuidasi ≈ ½ × spread × posisi = 0,5 × 0,004 × Rp1,5 T = <strong>Rp3 M</strong>. Kecil — masa tenang memang murah.</p>
        <p><strong>Langkah 2 — biaya spread saat stres:</strong> spread melebar ke <strong>300 bp</strong> (7,5× — pola 2008 untuk mid-cap). Biaya = 0,5 × 0,03 × Rp1,5 T = <strong>Rp22,5 M</strong>.</p>
        <p><strong>Langkah 3 — market impact:</strong> posisi Rp500 M per saham vs volume harian Rp200 M — butuh <strong>2,5 hari</strong> volume untuk keluar tanpa mengguncang harga (aturan praktis: ≤ 20–30% volume harian). Estimasi impact: <Tex math={String.raw`\text{impact} \approx \eta \cdot \sigma \sqrt{Q/V}`} /> dengan <Tex math={String.raw`Q/V = 2{,}5`} /> → impact ≈ <strong>Rp35 M</strong> (angka ilustratif; model Almgren-Chriss memberi kerangka formalnya).</p>
        <p><strong>Langkah 4 — LVaR total:</strong> 90 + 22,5 + 35 = <strong>Rp147,5 M</strong> — <strong>64% di atas</strong> VaR mentah Rp90 M.</p>
        <p><strong>Angka ini artinya:</strong> VaR menjawab &ldquo;berapa rugi jika bisa keluar di harga pasar&rdquo;; LVaR menjawab &ldquo;berapa rugi <em>setelah membayar</em> untuk keluar&rdquo;. Untuk posisi kecil di saham liquid, selisihnya trivial. Untuk posisi besar di pasar tipis, <strong>biaya keluar adalah risiko utama</strong> — dan ia tidak terlihat di VaR standar sama sekali.</p>
      </details>

      <h3>Mengapa LCR = 30 hari dan NSFR = 1 tahun?</h3>
      <p>Angka-angka Basel III bukan acak — mereka dikalibrasi dari <strong>berapa lama krisis likuiditas nyata berlangsung</strong>:</p>
      <ul>
        <li><strong>30 hari (LCR):</strong> fase akut 2008 — dari kejatuhan Lehman (15 Sep) hingga intervensi global terkoordinasi — berlangsung ~4–6 minggu. Bank harus bisa bertahan sendiri selama <em>jeda</em> sebelum bantuan sistemik datang. Skenario LCR (penarikan deposito ritel 3–10%, wholesale 25–100%, margin call) diambil dari <strong>pengalaman aktual</strong> bank-bank yang gagal.</li>
        <li><strong>1 tahun (NSFR):</strong> fase kronis — pasar pendanaan wholesale tetap mahal/tertutup berbulan-bulan setelah 2008. NSFR memaksa struktur pendanaan yang <strong>tidak bergantung</strong> pada pasar yang bisa tutup setahun.</li>
      </ul>
      <p><strong>Kritik yang jujur:</strong> LCR bisa menjadi <strong>procyclical</strong> — di masa stres, bank enggan memakai buffer HQLA-nya karena takut rasio turun di bawah 100% dan dihukum pasar/regulator. Buffer yang tidak berani dipakai bukan buffer. Regulator merespons dengan menegaskan HQLA <em>boleh</em> dipakai saat stres — tapi stigma pasar tetap nyata. Pelajaran desain: <strong>aturan yang sempurna di kertas bisa gagal karena perilaku manusia</strong>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Aset lancar = likuid.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> akuntansi mengklasifikasikan &ldquo;aset lancar&rdquo; (&lt; 1 tahun), tetapi <strong>likuiditas adalah soal bisa dijual <em>cepat tanpa diskon besar</em></strong>. Obligasi korporat 6-bulan bisa tidak laku sama sekali saat pasar panik; SBN 10-tahun tetap laku. Itulah mengapa HQLA didefinisikan dari <strong>kualitas &amp; kedalaman pasar</strong> (dengan haircut), bukan dari jatuh tempo akuntansi. Likuiditas adalah sifat pasar, bukan sifat neraca.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk setiap posisi, hafalkan &ldquo;waktu keluar&rdquo;-nya: <em>berapa hari volume normal untuk melikuidasi tanpa menggerakkan harga &gt; 1%?</em> Jika jawabannya &gt; horizon VaR-mu, maka VaR-mu <strong>mengasumsikan keajaiban</strong> (keluar instan di harga wajar). FRTB memformalkan ini sebagai <strong>liquidity horizon</strong> per faktor risiko (MR16) — 10 hari untuk ekuitas large-cap, hingga 120 hari untuk yang eksotik. Likuiditas bukan catatan kaki; ia adalah <strong>salah satu dimensi risiko</strong>.</p>
      </div>

      <details className="worked">
        <summary>📐 Bedah angka: struktur pendanaan ala NSFR — siapa yang rapuh? (klik untuk buka)</summary>
        <p><strong>Bank A:</strong> aset Rp100 T (kredit 80, HQLA 20). Pendanaan: deposito ritel stabil 60 (ASF 95%), wholesale &lt;1Y 25 (ASF 50%), modal 15 (ASF 100%).</p>
        <p>ASF = 60×0,95 + 25×0,5 + 15×1,0 = 57 + 12,5 + 15 = <strong>84,5</strong>. RSF = 80×0,85 + 20×0,05 = 68 + 1 = <strong>69</strong>. NSFR = 84,5/69 = <strong>122%</strong> ✔.</p>
        <p><strong>Bank B:</strong> aset sama. Pendanaan: deposito ritel 30 (ASF 95%), wholesale &lt;1Y 55 (ASF 50%), modal 15.</p>
        <p>ASF = 28,5 + 27,5 + 15 = <strong>71</strong>. NSFR = 71/69 = <strong>103%</strong> — lolos <em>tipis</em>.</p>
        <p><strong>Bedanya saat stres:</strong> wholesale 55 milik Bank B <strong>tidak roll</strong> saat pasar panik (pengalaman 2008: pasar wholesale tutup total) → Bank B butuh Rp55 T likuiditas <em>seketika</em> vs Bank A Rp25 T. Keduanya &ldquo;lolos&rdquo; NSFR — tapi Bank B hidup di <strong>tepi jurang</strong>. Pelajaran: <strong>rasio ≥100% adalah batas minimum, bukan target</strong>. Bank yang dikelola baik menargetkan buffer (115–125%) — karena di krisis, yang bertahan bukan yang &ldquo;lolos&rdquo;, melainkan yang punya <em>cadangan</em>.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Wawasan praktisi — likuiditas intraday:</strong> LCR mengukur 30 hari, tapi bank bisa mati dalam <strong>1 hari</strong> jika pembayaran keluar (kliring, margin call) tidak terpenuhi pagi hari. Itu sebabnya ada <strong>pemantauan likuiditas intraday</strong> (BCBS 2013): proyeksi arus kas per jam, buffer untuk pembayaran kritis, dan <em>escalation</em> jika buffer intraday menipis. SVB 2023 mati dalam 48 jam — bukan 30 hari. Pelajaran: <strong>horizon pengukuran harus mengikuti kecepatan kematian</strong>. Untuk trading desk: likuiditas diukur <em>per jam</em> saat krisis (bisakah kita memenuhi margin call jam 10 pagi?), bukan per hari. Aturan: setiap metrik likuiditas wajib menjawab &ldquo;untuk horizon <em>berapa lama</em> kita aman?&rdquo; — tanpa horizon, angkanya tidak bermakna.</p>
      </div>
      <p><strong>Tiga &ldquo;wajah&rdquo; likuiditas yang jangan tertukar:</strong> (1) <strong>Likuiditas pasar</strong> — bisakah <em>menjual aset</em> tanpa diskon besar? (diukur: bid-ask spread, market impact, LVaR). (2) <strong>Likuiditas pendanaan</strong> — bisakah <em>mendapatkan kas</em> saat dibutuhkan? (diukur: LCR, NSFR, akses pasar wholesale). (3) <strong>Likuiditas intraday</strong> — bisakah <em>membayar tepat waktu</em> hari ini? (diukur: buffer pembayaran, proyeksi arus per jam). Krisis 2008 = ketiganya gagal <em>bersamaan</em>: tidak bisa jual (1), tidak bisa pinjam (2), tidak bisa bayar (3). Bank yang hanya memantau satu wajah = <strong>buta dua pertiga</strong>.</p>

      <h3>✏️ Latihan Mandiri</h3>
      <details className="worked">
        <summary>Soal 1 — Posisi saham Rp800 M, VaR 99% Rp40 M, spread normal 30 bp, spread stres 250 bp. Hitung (a) biaya likuidasi normal, (b) stres, (c) LVaR stres. (klik untuk pembahasan)</summary>
        <p><strong>(a)</strong> 0,5 × 0,003 × 800 M = <strong>Rp1,2 M</strong>. <strong>(b)</strong> 0,5 × 0,025 × 800 M = <strong>Rp10 M</strong>. <strong>(c)</strong> LVaR = 40 + 10 = <strong>Rp50 M</strong> (belum termasuk market impact).</p>
        <p><strong>Catatan:</strong> di masa tenang biaya likuidasi hanya 3% dari VaR — <em>diabaikan wajar</em>. Saat stres: 25% — <strong>tidak bisa diabaikan</strong>. Likuiditas adalah risiko yang <em>nonlinear terhadap kondisi pasar</em>: murah saat tidak dibutuhkan, mahal saat dibutuhkan.</p>
      </details>
      <details className="worked">
        <summary>Soal 2 — Bank: HQLA Rp50 T, arus keluar bersih 30-hari (stres) Rp45 T. (a) LCR? (b) Jika deposan menarik Rp10 T tambahan, apa yang terjadi? (klik untuk pembahasan)</summary>
        <p><strong>(a)</strong> LCR = 50/45 = <strong>111%</strong> — lolos (≥100%). <strong>(b)</strong> Arus keluar menjadi 55 → LCR = 50/55 = <strong>91%</strong> — <strong>gagal</strong>. Bank harus: tambah HQLA (jual aset / pinjam), atau kurangi arus keluar (batasi penarikan komitmen).</p>
        <p><strong>Catatan perilaku:</strong> di stres nyata, bank <em>enggan</em> memakai HQLA karena takut rasio jatuh &lt; 100% dan dihukum pasar — <strong>stigma buffer</strong>. Buffer yang tidak berani dipakai = premi asuransi yang hangus. Inilah kritik procyclical terhadap LCR.</p>
      </details>
      <details className="worked">
        <summary>Soal 3 — Jelaskan rantai ABCP → interbank → repo pada 2007–2008 dalam 4 kalimat. (klik untuk pembahasan)</summary>
        <p>Conduit/SIV mendanai MBS jangka panjang dengan ABCP jangka pendek; saat pasar ABCP membeku (Agu 2007), bank sponsor terpaksa menampungnya — <strong>risiko kontinjensi menjadi nyata</strong>. Bank lalu berhenti saling meminjamkan (LIBOR-OIS ke 350 bp) karena <em>tidak percaya</em> lawan — <strong>kepercayaan adalah likuiditas</strong>. Setelah Lehman, bahkan repo beragun membeku (haircut MBS ke 50%) — <strong>agunan pun tidak cukup</strong> saat semua menjual. Tiga pasar, satu pola: likuiditas menguap <em>tepat saat dibutuhkan</em>.</p>
      </details>

      <h2 id="case">📋 Mini-Case: Bank yang &ldquo;Likuid&rdquo; di Kertas</h2>
      <div className="callout">
        <p>Bank PQR melaporkan LCR <strong>135%</strong> — di atas minimum 100%. Direksi santai. Lalu:</p>
        <ul>
          <li>HQLA Rp120 T terdiri dari: kas Rp20 T + <strong>SBN Rp100 T</strong></li>
          <li>Krisis kepercayaan: deposan tarik <strong>Rp80 T dalam 2 minggu</strong> (2× asumsi stres LCR!)</li>
          <li>Bank mencoba jual SBN Rp60 T — tapi <strong>pasar SBN juga stres</strong>: spread melebar, hanya laku Rp40 T dengan <strong>diskon 8%</strong> (= rugi Rp4,8 T)</li>
          <li>Sisa kebutuhan Rp40 T → pinjam darurat ke bank sentral dengan <strong>haircut 15%</strong></li>
        </ul>
        <p><strong>Pertanyaan:</strong> (a) Mengapa LCR 135% tidak menyelamatkan? (b) Apa yang salah dari komposisi HQLA? (c) Pelajaran untuk market risk?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga kegagalan:</strong> (1) <em>Skenario stres terlalu ringan</em> — penarikan aktual 2× asumsi. LCR hanya sekuat skenarionya. (2) <em>HQLA tidak benar-benar likuid saat dibutuhkan</em> — SBN pun berdiskon 8% saat pasar stres (HQLA ≠ bisa dijual tanpa rugi). (3) <em>Konsentrasi</em> — 83% HQLA dalam satu instrumen (SBN).</p>
          <p>(b) <strong>Komposisi salah:</strong> terlalu sedikit <strong>kas murni</strong> (hanya Rp20 T vs kebutuhan Rp80 T). Pelajaran: <strong>kualitas HQLA berlapis</strong> — kas &gt; SBN pendek &gt; SBN panjang, terutama saat pasar obligasi ikut stres. Diversifikasi HQLA itu sendiri penting.</p>
          <p>(c) <strong>Untuk market risk:</strong> (1) LVaR HQLA pun harus dihitung — &ldquo;aset likuid&rdquo; tetap punya biaya likuidasi saat stres. (2) Skenario stres likuiditas harus <strong>lebih parah</strong> dari minimum regulator. (3) <strong>Likuiditas pasar + pendanaan</strong> harus di-stress <em>bersamaan</em> (spiral!) — bukan sendiri-sendiri.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan market liquidity vs funding liquidity?"
        options={[
          "Sama saja",
          "Market = bisa jual aset tanpa gerakkan harga; Funding = bisa dapat kas/pinjaman saat butuh — keduanya bisa saling memperburuk (spiral)",
          "Market untuk saham, funding untuk obligasi",
          "Funding tidak penting",
        ]}
        correct={1}
        explanation="Benar. Dan keduanya terhubung via spiral: harga jatuh → margin call → butuh funding → funding kering → forced selling → harga makin jatuh. Pantau bersamaan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Posisi Rp100 M, spread 2%. Estimasi biaya likuidasi (satu arah)?"
        options={[
          "Rp2 M",
          "Rp1 M (≈ ½ × spread × posisi)",
          "Rp100 M",
          "Nol",
        ]}
        correct={1}
        explanation="Benar: 0,5 × 2% × 100M = Rp1 M. Menjual di bid = 'membayar' setengah spread dari mid. Untuk posisi besar, tambah market impact."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan LVaR jauh melebihi VaR biasa?"
        options={[
          "Tidak pernah",
          "Aset illiquid (spread lebar, posisi besar vs ADV) — biaya likuidasi bisa mendekati/m melebihi VaR, terutama saat krisis",
          "Hanya untuk FX",
          "Hanya saat pasar tenang",
        ]}
        correct={1}
        explanation="Benar. LVaR − VaR = biaya keluar. Untuk saham lapis 3 di contoh, rasionya 1,9×. VaR biasa buta terhadap ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. LCR = 120%. Artinya?"
        options={[
          "Bank pasti aman",
          "HQLA cukup untuk menutup arus keluar bersih 30-hari dalam skenario stres regulator — tapi hanya sekuat skenario & kualitas HQLA-nya",
          "Bank punya laba 20%",
          "Tidak ada risiko likuiditas",
        ]}
        correct={1}
        explanation="Benar. LCR = ketahanan terhadap SKENARIO TERTENTU. Skenario terlalu ringan atau HQLA terkonsentrasi/berdiskon = LCR menipu (lihat mini-case)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. NSFR memaksa bank untuk?"
        options={[
          "Menambah laba",
          "Mendanai aset jangka panjang dengan pendanaan stabil jangka panjang — mencegah model 'pinjam pendek, tanam panjang' yang rapuh",
          "Mengurangi modal",
          "Menjual semua obligasi",
        ]}
        correct={1}
        explanation="Benar. NSFR = disiplin struktural. Ia mahal (pendanaan panjang lebih mahal) — tapi itulah 'premi asuransi' terhadap krisis pendanaan seperti 2008."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Volume perdagangan saham X sangat tinggi hari ini. Apakah pasti likuid untuk jual Rp50 M?"
        options={[
          "Ya — volume tinggi = likuid",
          "Belum tentu — jika volume satu arah (semua jual), tidak ada pembeli; cek kedalaman dua arah & % terhadap ADV",
          "Ya selalu",
          "Tidak relevan",
        ]}
        correct={1}
        explanation="Benar. Volume tanpa kedalaman dua arah = ilusi. Selalu bandingkan ukuran posisimu dengan ADV dan lihat order book dua sisi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Market liquidity</strong> (jual aset) vs <strong>funding liquidity</strong> (dapat kas) — spiral di antara keduanya membunuh di krisis.</li>
          <li><strong>Bid-ask spread</strong> = biaya ketidaksabaran; melebar 10–30× saat krisis.</li>
          <li><strong>LVaR</strong> = VaR + ½·spread·posisi + market impact — wajib untuk aset illiquid/posisi besar.</li>
          <li><strong>LCR</strong> = HQLA / outflow 30-hari ≥ 100% (tabung oksigen); <strong>NSFR</strong> = ASF/RSF ≥ 100% (gaya hidup sehat).</li>
          <li><strong>LVaR/VaR &gt; 1,5</strong> = waspada; aset itu bukan buffer likuiditas.</li>
          <li>LCR hanya sekuat <strong>skenario &amp; kualitas HQLA</strong>-nya — stres internal harus lebih parah dari minimum.</li>
          <li>Harga di layar ≠ harga yang bisa didapat — selalu kurangi biaya likuidasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/mr12-fx-komoditas" className="btn btn-secondary btn-sm">← MR12</Link>
        <Link href="/learn/mr14-counterparty-risk" className="btn btn-primary btn-sm">Next: MR14 →</Link>
      </div>
    </div>
  );
}
