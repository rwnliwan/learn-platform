"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function PmC1IpsPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">PM-C1 — Portfolio Management</span>
        <h1 className="display-title">IPS:<br/>Wealth, Institusi & Pajak</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
<li><a href="#tujuan">Tujuan Pembelajaran</a></li>
<li><a href="#cerita">Cerita: Warisan yang Habis Dimakan Pajak</a></li>
<li><a href="#ips">Anatomi IPS</a></li>
<li><a href="#institusi">Wealth vs Institusi</a></li>
<li><a href="#pajak">Tax-Aware Investing</a></li>
<li><a href="#sintesis">Sintesis: Fondasi</a></li>
<li><a href="#miskonsepsi">Miskonsepsi Umum</a></li>
<li><a href="#tips">Tips &amp; Intuisi Kunci</a></li>
<li><a href="#lab1">Lab 1 (Live Python)</a></li>
<li><a href="#lab2">Lab 2 (Live Python)</a></li>
<li><a href="#peta">Peta Keputusan</a></li>
<li><a href="#case">Mini-Case: Pak Darma</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#latihan">Latihan Mandiri</a></li>
<li><a href="#quiz">Quiz (6 soal)</a></li>
<li><a href="#rangkum">Rangkuman</a></li>
</ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
<li>Menjelaskan komponen IPS: objectives (return/risk) + 5 constraints.</li>
<li>Membedakan kebutuhan private wealth vs 4 tipe institusi.</li>
<li>Menjelaskan tax-loss harvesting dan asset location.</li>
<li>Menyusun IPS 1 halaman dari profil klien.</li>
</ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita: Warisan yang Habis Dimakan Pajak</h2>
      <div className="story">
        <p><strong>Pak Darma</strong> mewarisi portofolio saham <strong>Rp5 miliar</strong>. Manajernya aktif trading: return bruto <strong>18%/tahun</strong> — mengagumkan! Lima tahun kemudian, Pak Darma hitung: <strong>return bersih setelah pajak cuma 11%</strong>. Rekan yang buy-and-hold indeks (12% bruto) dapat <strong>11,5% bersih</strong>.</p>
<p>Twist-nya: <strong>trading aktif = pajak tahunan</strong> atas tiap keuntungan (realisasi!), sementara buy-and-hold <strong>menunda pajak</strong> (unrealized tidak kena). Manajer 'hebat' kalah dari strategi 'malas' — <strong>setelah pajak</strong>. <strong>Return yang penting = yang bisa dibelanjakan.</strong> Lesson ini: IPS yang sadar pajak.</p>
      </div>

      {/* 5. KONSEP INTI */}
<h2 id="ips">IPS — Kontrak Sebelum Perang</h2>
<p><strong>Definisi.</strong> <strong>IPS</strong> = dokumen hidup berisi: <strong>Objectives</strong> — <em>return</em> (target terukur, real/nominal, bruto/neto) &amp; <em>risk tolerance</em> (kemampuan vs kemauan!). <strong>Constraints</strong> — <em>liquidity</em> (kebutuhan kas), <em>horizon</em>, <em>taxes</em>, <em>legal/regulatory</em>, <em>unique</em> (etika, agama, ESG).</p>
<p><strong>Kemampuan vs kemauan</strong>: muda+horizon panjang = <em>mampu</em> ambil risiko; tapi jika panik saat −20% = <em>tidak mau</em> → ikuti yang <strong>lebih rendah</strong> (edukasi dulu!).</p>
<p><strong>Kepribadian/intuisi:</strong> IPS seperti <strong>resep + alergi pasien</strong>: return objective = 'sembuhkan penyakit ini'; risk tolerance = 'dosis maksimal yang kuat'; constraints = 'alergi &amp; pantangan'. Dokter (advisor) yang meresep tanpa tanya alergi = malpraktik.</p>
<p><strong>Kapan dipakai:</strong> Awal setiap relasi; review tahunan atau saat life event.</p>
<p><strong>Pendalaman intuisi &mdash; IPS = &ldquo;konstitusi&rdquo; portofolio.</strong> Tanpa IPS, setiap keputusan = <em>reaksi emosi</em> (panik jual! euforia beli!). IPS menulis <strong>aturan main <em>sebelum</em> badai</strong>: tujuan, batas risiko, alokasi, kapan <em>rebalance</em>. <strong>Saat krisis, IPS = jangkar;</strong> tanpanya, kamu = daun tertiup angin pasar. <strong>Manajer profesional <em>wajib</em> punya IPS &mdash; dan <em>dipecat</em> jika melanggarnya.</strong></p><details className="worked">
<summary>📐 Contoh: IPS Pak Darma (klik untuk buka)</summary>
<p><strong>Return</strong>: 12% nominal bersih pajak (pendidikan anak 10 thn). <strong>Risk</strong>: kemampuan tinggi (horizon 15 thn), kemauan moderat → <strong>moderat</strong> (vol target &lt; 14%).</p>
<p><strong>Constraints</strong>: likuiditas Rp200jt/thn; horizon 15 thn; <strong>pajak: minimalkan realisasi</strong> (tax-aware!); legal: —; unique: tidak untuk trading harian.</p>
<p><strong>Implikasi</strong>: strategi <strong>buy-and-hold + tax-loss harvesting</strong>, bukan trading aktif. IPS ini <em>melarang</em> manajer lama beroperasi!</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Menyusun IPS &mdash; kerangka lengkap</summary>
<p><strong>Soal:</strong> klien 45 tahun, pensiun 60, butuh Rp200jt/tahun (riil), toleransi moderat. Susun IPS ringkas.</p>
<p><strong>Return:</strong> target 8% nominal (5% riil + 3% inflasi) &mdash; <em>neto setelah pajak &amp; biaya</em>!</p>
<p><strong>Risk:</strong> vol &lt; 12%; <em>max drawdown</em> &lt; 20%; <em>tidak</em> leverage.</p>
<p><strong>Constraints:</strong> horizon 15 tahun; likuiditas Rp200jt/tahun; <em>tax-aware</em> (tunda realisasi); <em>no-go</em>: saham gorengan, kripto &gt; 5%.</p>
<p><strong>Rebalance:</strong> tahunan atau jika alokasi menyimpang &gt; 5%. <strong>Review:</strong> tahunan + saat <em>life event</em>. <strong>IPS = 1 halaman yang <em>ditandatangani</em> &mdash; bukan 50 halaman yang <em>diarsipkan</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: IPS dilanggar &mdash; studi perilaku</summary>
<p><strong>Soal:</strong> IPS bilang &ldquo;rebalance tahunan, tidak market timing&rdquo;. Maret 2020 (COVID crash &minus;30%): klien panik minta jual semua. Apa yang dilakukan manajer?</p>
<p><strong>Salah:</strong> menuruti (melanggar IPS!) &mdash; mengunci rugi &amp; melewatkan <em>rebound</em> 60%+.</p>
<p><strong>Benar:</strong> (1) <strong>tunjukkan IPS</strong> yang ditandatangani (&ldquo;kita sudah sepakati ini saat tenang&rdquo;); (2) <strong>edukasi</strong> (<em>rebalance</em> = beli murah!); (3) <strong>tawarkan kompromi terbatas</strong> (kurangi 10%, bukan 100%) jika panik ekstrem. <strong>Nilai manajer = <em>disiplin</em> saat klien <em>emosional</em>.</strong> IPS = <em>alat</em> untuk percakapan sulit ini.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; &ldquo;Return tertinggi = terbaik&rdquo;.</strong> Manajer A 18% bruto (11% neto); manajer B 12% (11,5% neto). <strong>B menang!</strong> Soal CFA <em>suka</em> menjebak dengan return bruto &mdash; <strong>selalu hitung <em>setelah pajak &amp; biaya</em></strong>. Return yang tidak bisa dibawa pulang = <em>angka hiasan</em>.</p>
</div>

<PlotlyChart
  data={[{x: ["Return bruto", "Setelah biaya (1%)", "Setelah pajak", "Neto final"], y: [18, 17, 11, 11], type: "bar", marker: {color: ["#2a7de1", "#e8a838", "#d62728", "#d62728"]}, name: "Manajer A (%)"}, {x: ["Return bruto", "Setelah biaya (0,2%)", "Setelah pajak", "Neto final"], y: [12, 11.8, 11.5, 11.5], type: "bar", marker: {color: ["#2a7de1", "#2ca02c", "#2ca02c", "#2ca02c"]}, name: "Manajer B (%)"}]}
  title={"18% vs 12%: yang menang setelah pajak & biaya"}
  layout={{xaxis: {title: ""}, yaxis: {title: "Return (%)"}, showlegend: true, barmode: "group"}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua grup batang = Manajer A (aktif) vs B (pasif), dari bruto ke neto.</p>
<p><strong>Interpretasi:</strong> A: 18% &rarr; <strong>11%</strong> (biaya + pajak tahunan menggerogoti!). B: 12% &rarr; <strong>11,5%</strong> (ramping!). <strong>Pemenang = B</strong> &mdash; dengan <em>stres</em> &amp; <em>usaha</em> jauh lebih kecil. <strong>Return bruto = <em>pemasaran</em>; return neto = <em>uang</em>.</strong></p>
</div>
<h2 id="institusi">Private Wealth vs Institusi — Beda Spesies</h2>
<p><strong>Definisi.</strong> <strong>Private wealth</strong>: individu — pajak personal, horizon = umur, bias behavioral kuat, likuiditas personal. <strong>Institusi</strong>: (1) <strong>DB pension</strong> — bayar manfaat pasti → <strong>LDI</strong> (cocokkan aset-liabilitas!); (2) <strong>Endowment/yayasan</strong> — horizon abadi, spending rule (~5%); (3) <strong>Asuransi</strong> — liabilitas + regulasi ketat (RBC); (4) <strong>Bank/SWF</strong> — likuiditas &amp; regulasi.</p>
<p><strong>Risk objective institusi</strong> sering = <strong>funded status</strong> (aset/liabilitas), bukan volatilitas absolut!</p>
<Tex math={String.raw`\text{Funded Ratio} = \frac{\text{Aset}}{PV(\text{Liabilitas})}`} block />
<p><strong>Artinya tiap simbol:</strong></p>
<ul>
<li>DB pension: target funded ratio ≥ 100% (surplus)</li>
<li>Defisit → kontribusi naik / manfaat turun (politik!)</li>
<li>LDI: aset bergerak SEARAH liabilitas (duration match!)</li>
</ul>
<p><strong>Kepribadian/intuisi:</strong> Institusi seperti <strong>kebun binatang</strong>: tiap hewan (pension, endowment, asuransi) punya <em>makanan</em> (liabilitas) &amp; <em>kandang</em> (regulasi) berbeda. Memberi makan singa dengan rumput (strategi salah spesies) = bencana.</p>
<p><strong>Kapan dipakai:</strong> Kelola/menganalisis dana institusi: pahami liabilitasnya dulu.</p>
<p><strong>Pendalaman intuisi &mdash; pajak = &ldquo;pasangan diam-diam&rdquo; yang mengambil 20&ndash;30%.</strong> Return 18% bruto &rarr; 11% neto (pajak tahunan!) vs 12% buy-and-hold &rarr; 11,5% neto. <strong>Strategi &ldquo;aktif&rdquo; kalah dari &ldquo;pasif&rdquo; <em>setelah pajak</em>!</strong> Mekanisme: realisasi tahunan = pajak tahunan &rarr; <em>compounding</em> setelah pajak (lebih kecil!) vs <em>compounding</em> penuh lalu pajak sekali. <strong>Pajak = <em>friction</em> terbesar yang bisa dikendalikan.</strong> <em>Tax-aware investing</em> = bukan <em>penghindaran</em>, melainkan <em>penjadwalan</em> cerdas.</p><details className="worked">
<summary>📐 Contoh: Dana pensiun defisit (klik untuk buka)</summary>
<p>Dana pensiun: aset Rp800M, PV liabilitas Rp1.000M → <strong>funded 80%</strong> (defisit Rp200M).</p>
<p><strong>Godaan</strong>: kejar return dengan saham 90% ('tutup defisit'). <strong>Bahaya</strong>: jika pasar jatuh, defisit <em>melebar</em> (aset turun, liabilitas naik saat rate turun!).</p>
<p><strong>LDI</strong>: geser ke obligasi long-duration yang <strong>match liabilitas</strong> → funded ratio <em>stabil</em>, lalu tutup defisit via <strong>kontribusi</strong> bertahap. Membosankan tapi benar.</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Tax drag &mdash; angka 10 tahun</summary>
<p><strong>Soal:</strong> Rp100jt, return 12% bruto. Strategi A: realisasi tahunan (pajak 20%). Strategi B: tunda 10 tahun. Bandingkan.</p>
<p><strong>A (bayar tahunan):</strong> neto 9,6%/tahun &rarr; 100 &times; 1,096^10 = <strong>Rp249jt</strong>.</p>
<p><strong>B (tunda):</strong> 100 &times; 1,12^10 = 311jt; pajak 20% atas gain (211jt) = 42jt &rarr; <strong>Rp269jt</strong>.</p>
<p><strong>Selisih: Rp20jt (8%)!</strong> &mdash; dari <em>penjadwalan</em> saja, tanpa return lebih tinggi! <strong>Perpanjang ke 20 tahun: selisih 15%+.</strong> <strong>Pajak = <em>musuh compounding</em>; penundaan = <em>pinjaman tanpa bunga dari negara</em>.</strong></p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Tax-loss harvesting</summary>
<p><strong>Soal:</strong> portofolio: saham X untung Rp50M (<em>unrealized</em>), saham Y rugi Rp30M. Butuh jual X. Strategi pajak?</p>
<p><strong>Langkah 1:</strong> jual <strong>keduanya</strong>: gain 50 &minus; loss 30 = <strong>net gain 20M</strong> (bukan 50M!).</p>
<p><strong>Langkah 2:</strong> beli kembali Y setelah <em>wash-sale period</em> (jika masih yakin!) &mdash; <em>memanen rugi</em> tanpa mengubah eksposur.</p>
<p><strong>Hemat pajak:</strong> 30M &times; 20% = <strong>Rp6M</strong>. <strong>Aturan:</strong> <em>wash sale</em> (jual &amp; beli langsung = tidak diakui!). <strong>Tax-loss harvesting = <em>panen rutin</em> tiap akhir tahun</strong> &mdash; bukan sekali seumur hidup.</p>
</details>

<div className="callout-warning">
<p><strong>⚠️ Jebakan Ujian &mdash; IPS = &ldquo;formalitas&rdquo;.</strong> <strong>SALAH.</strong> IPS = <em>dokumen hukum</em> &amp; <em>jangkar perilaku</em>. Manajer yang melanggar IPS = <strong>pelanggaran fidusia</strong> (bisa dituntut!). Soal etika: &ldquo;manajer mengubah alokasi tanpa persetujuan karena &lsquo;yakin pasar akan naik&rsquo;&rdquo; &rarr; <strong>pelanggaran</strong>, <em>terlepas</em> dari hasil (untung pun tetap salah!).</p>
</div>
<PlotlyChart
  data={[{x: ["Private<br>wealth", "DB<br>pension", "Endowment", "Asuransi"], y: [15, 30, 99, 10], type: "bar", marker: {color: ["#2a7de1","#e8a838","#16a34a","#94a3b8"]}, text: ["15 thn","30 thn","∞","10 thn"], textposition: "outside"}]}
  title={"Horizon khas tiap investor (tahun)"}
  layout={{xaxis: {title: "Investor"}, yaxis: {title: "Horizon (tahun)"}, showlegend: false}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi batang = horizon investasi khas.</p>
<p><strong>Interpretasi:</strong> Endowment <strong>abadi</strong> → bisa illikuid (PE, infra). Asuransi <strong>pendek + regulasi</strong> → konservatif. Horizon menentukan <em>semesta aset yang boleh dimasuki</em> — private wealth 15 tahun ≠ pension 30 tahun.</p>
</div>

<PlotlyChart
  data={[{x: [0,2,4,6,8,10], y: [100,122,149,182,223,249], type: "scatter", mode: "lines+markers", marker: {color: "#d62728"}, name: "Bayar pajak tahunan"}, {x: [0,2,4,6,8,10], y: [100,125,157,197,247,269], type: "scatter", mode: "lines+markers", marker: {color: "#2ca02c"}, name: "Tunda pajak"}]}
  title={"Tax drag: penundaan = Rp20jt gratis (10 tahun)"}
  layout={{xaxis: {title: "Tahun"}, yaxis: {title: "Nilai (Rp jt)"}, showlegend: true}}
/>
<div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua kurva = Rp100jt tumbuh 12%/tahun; merah = pajak tahunan, hijau = tunda 10 tahun.</p>
<p><strong>Interpretasi:</strong> <strong>selisih Rp20jt (8%)</strong> &mdash; dari <em>penjadwalan</em> saja! Kesenjangan <strong>melebar</strong> dengan waktu (<em>compounding</em> dari pajak yang ditunda!). <strong>Pajak tahunan = <em>rem</em> pada compounding; penundaan = <em>lepas rem</em>.</strong> Inilah &ldquo;biaya aktif&rdquo; yang jarang dihitung manajer trading.</p>
</div>
<h2 id="pajak">Pajak — Return yang Bisa Dibelanjakan</h2>
<p><strong>Definisi.</strong> <strong>Tax-loss harvesting</strong>: jual posisi rugi untuk <em>mengakui</em> kerugian → offset keuntungan (kurangi pajak), lalu beli kembali aset <em>sejenis</em> (waspadai <em>wash sale</em>!). <strong>Asset location</strong>: taruh aset <em>tidak efisien pajak</em> (obligasi, REIT) di akun <strong>pensiun</strong> (tax-deferred), aset efisien (saham growth) di akun <strong>kena pajak</strong>.</p>
<p><strong>Prinsip</strong>: tunda realisasi keuntungan (unrealized tidak kena pajak); percepat realisasi kerugian.</p>
<p><strong>Kepribadian/intuisi:</strong> Tax-loss harvesting seperti <strong>panen 'rugi' untuk pupuk</strong>: tanaman yang layu (posisi rugi) dicabut — 'pupuknya' (pengurang pajak) menyuburkan kebun. Asset location seperti <strong>menaruh es di freezer, bukan di teras</strong>: aset 'bocor pajak' di akun terlindung.</p>
<p><strong>Kapan dipakai:</strong> Akun kena pajak: panen rugi tiap akhir tahun; alokasi akun saat setup.</p>
<p><strong>Pendalaman intuisi &mdash; institusi &ne; individu yang besar.</strong> Dana pensiun: <strong>kewajiban</strong> (<em>liability</em>!) &rarr; <em>liability-driven investing</em> (cocokkan aset &amp; kewajiban!). Yayasan: <strong>abadi</strong> &rarr; <em>spending rule</em> (belanja 5%/tahun selamanya!). Asuransi: <strong>regulasi</strong> ketat. <strong>Kesalahan klasik:</strong> menerapkan &ldquo;aturan individu&rdquo; ke institusi (atau sebaliknya!). <strong>IPS institusi = dimulai dari <em>kewajiban</em>, bukan dari <em>return impian</em>.</strong></p><details className="worked">
<summary>📐 Contoh: Panen Pak Darma (klik untuk buka)</summary>
<p>Portofolio: saham A untung Rp500jt (unrealized), saham B rugi Rp200jt. Tarif pajak capital gain 20%.</p>
<p><strong>Tanpa harvesting</strong>: jual A → pajak 20%×500 = <strong>Rp100jt</strong>.</p>
<p><strong>Dengan harvesting</strong>: jual B juga → net gain 300 → pajak <strong>Rp60jt</strong>. <strong>Hemat Rp40jt!</strong> Beli kembali saham sejenis B (jaga exposure).</p>
<p><strong>Wash sale</strong>: jangan beli kembali <em>identik</em> dalam 30 hari (aturan US; prinsip kehati-hatian umum).</p>
</details>

<details className="worked">
<summary>📐 Contoh 2 (gaya CFA): Dana pensiun &mdash; liability-driven</summary>
<p><strong>Soal:</strong> dana pensiun: kewajiban Rp1T (durasi 15 tahun), aset Rp900jt. Defisit Rp100jt. Strategi?</p>
<p><strong>Salah:</strong> &ldquo;kejar return&rdquo; dengan saham 80% &mdash; jika pasar jatuh, <strong>defisit meledak</strong> (kewajiban <em>tidak</em> jatuh!).</p>
<p><strong>Benar (LDI):</strong> (1) <strong>cocokkan durasi</strong> &mdash; obligasi durasi 15 tahun untuk <em>hedge</em> kewajiban; (2) <strong>pisahkan</strong>: <em>hedging portfolio</em> (tutup kewajiban) + <em>return-seeking</em> (tutup defisit); (3) <strong>kontribusi</strong> terjadwal untuk defisit. <strong>Kewajiban = <em>benchmark</em> sejati</strong> &mdash; bukan IHSG!</p>
</details>
<details className="worked">
<summary>📐 Contoh 3: Yayasan &mdash; spending rule</summary>
<p><strong>Soal:</strong> yayasan Rp10M, ingin belanja Rp500jt/tahun <em>selamanya</em> (riil). Berapa return yang dibutuhkan?</p>
<p><strong>Langkah 1:</strong> spending 5% + inflasi 3% = <strong>8% nominal</strong> (neto!).</p>
<p><strong>Tantangan:</strong> 8% neto <em>selamanya</em> = <strong>agresif</strong>! Jika return 6% &rarr; <strong>modal tergerus</strong> (<em>spending &gt; return</em>). <strong>Solusi:</strong> (1) turunkan spending ke 4%; (2) terima <em>volatilitas</em> lebih tinggi (saham lebih banyak); (3) <strong><em>smoothing rule</em></strong> (belanja = rata-rata 3 tahun &mdash; hindari potong saat krisis!). <strong>Yayasan abadi = <em>maraton tanpa garis finis</em>.</strong></p>
</details>

      {/* 5b. SINTESIS */}
      <h2 id="sintesis">🧩 Sintesis: IPS = Tujuan + Disiplin + Pajak</h2>
      <p>IPS, pajak, institusi = <strong>satu fondasi</strong>:</p>
      <ol>
        <li><strong>TUJUAN (IPS):</strong> tulis <em>sebelum</em> invest &mdash; return, risiko, batasan. <strong>Jangkar perilaku.</strong></li>
        <li><strong>NETO (pajak):</strong> yang dihitung = <em>setelah pajak &amp; biaya</em>. <strong>Penjadwalan = return gratis.</strong></li>
        <li><strong>KONTEKS (institusi):</strong> kewajiban &rarr; strategi. <strong>Mulai dari <em>kewajiban</em>, bukan <em>impian</em>.</strong></li>
      </ol>
      <p><strong>Portofolio tanpa IPS = kapal tanpa kemudi;</strong> return tanpa pajak = <em>ilusi</em>; strategi tanpa kewajiban = <em>tebakan</em>.</p>

      <h3>🎙️ Debat: &ldquo;Penasihat keuangan = penjual produk&rdquo;</h3>
      <p><strong>Sinis:</strong> &ldquo;Penasihat dibayar komisi &rarr; menjual produk <em>mahal</em>, bukan yang <em>tepat</em>. IPS = <em>formalitas</em> untuk menutupi penjualan.&rdquo;</p>
      <p><strong>Pembela:</strong> &ldquo;Penasihat <em>fidusia</em> (fee-only!) = <strong>dilarang</strong> komisi; wajib <em>utamakan klien</em>. Nilai = <em>behavioral coaching</em> (mencegah panik jual!) + <em>tax planning</em> + <em>disiplin</em> &mdash; <strong>bernilai 1&ndash;2%/tahun</strong> (Vanguard Advisor Alpha!).&rdquo;</p>
      <p><strong>Putusan:</strong> <strong>bedakan <em>penjual</em> vs <em>fidusia</em>.</strong> Tanya: &ldquo;bagaimana Bapak/Ibu dibayar?&rdquo; Komisi = <em>konflik</em>; fee-only + fidusia = <em>selaras</em>. <strong>Pilih penasihat seperti pilih dokter: yang <em>dibayar untuk kesembuhanmu</em>, bukan untuk <em>resepnya</em>.</strong></p>
      <h3>🧪 Eksperimen Pikiran</h3>
      <p><strong>(1) IPS 5 menit.</strong> Tulis IPS untuk dirimu <em>sekarang</em>: tujuan (angka + tahun), batas rugi maksimal, alokasi %. <strong>Tantangan:</strong> apakah alokasimu <em>konsisten</em> dengan batas rugimu? (Jika batas rugi 10% tapi 100% saham &rarr; <strong>tidak konsisten!</strong> &mdash; revisi.)</p>
      <p><strong>(2) Audit pajak.</strong> Hitung <em>tax drag</em> portofoliomu tahun lalu: berapa pajak dibayar vs berapa jika ditunda? (Jawab: kalikan realisasi &times; tarif. <strong>Kaget?</strong> &mdash; itulah &ldquo;biaya aktif&rdquo; yang tak terlihat.)</p>
      <p><strong>(3) Tes institusi.</strong> Kamu mengelola dana abadi Rp1M, spending 5%. Return 10 tahun terakhir 6%. Apa yang terjadi ke modal? (Jawab: 6% &minus; 5% &minus; inflasi 3% = <strong>&minus;2%/tahun riil</strong> &rarr; modal <em>tergerus</em>! <strong>Solusi:</strong> turunkan spending atau naikkan risiko &mdash; <em>matematika tidak bernegosiasi</em>.)</p>
      <h3>📰 Studi Kasus: Harvard Endowment &mdash; Raksasa yang Tersandung</h3>
      <p>Harvard ($50M+): 2008, <em>likuiditas</em> kering &mdash; <em>commitment</em> ke <em>private equity</em> tidak bisa ditarik, tapi <em>capital call</em> terus datang! Terpaksa jual obligasi <em>di dasar pasar</em> &rarr; rugi miliaran.</p>
      <p><strong>Pelajaran:</strong> (1) <strong>likuiditas &ne; solvabilitas</strong> &mdash; kaya tapi tidak bisa bayar!; (2) <strong><em>illiquid</em> + <em>commitment</em></strong> = jebakan saat krisis; (3) <strong>IPS institusi <em>wajib</em> memuat <em>liquidity budget</em></strong>. <strong>Ukuran tidak menjamin kebal &mdash; struktur yang menjamin.</strong></p>
      <h3>📊 Data Corner: Vanguard Advisor Alpha</h3>
      <p><strong>Data (Vanguard):</strong> penasihat yang baik menambah &asymp; <strong>3%/tahun</strong> (<em>Advisor Alpha</em>): <em>behavioral coaching</em> 1,5% + <em>rebalancing</em> 0,35% + <em>tax</em> 0,75% + <em>spending</em> 0,4%.</p>
      <p><strong>Cara membaca:</strong> <strong>setengah</strong> nilai penasihat = <em>mencegah kesalahan perilaku</em> (panik jual!), bukan <em>stock picking</em>! <strong>Implikasi:</strong> bayar penasihat untuk <em>disiplin</em>, bukan untuk <em>ramalan</em>. Jika penasihatmu hanya &ldquo;pilih saham&rdquo; &rarr; <strong>kamu membayar mahal untuk yang gratis</strong> (index fund!).</p>
      <h3>📋 Template IPS Satu Halaman (Salin &amp; Isi)</h3>
      <p><strong>TUJUAN:</strong> Nilai kini Rp___, target Rp___ pada tahun ___. Return dibutuhkan ___% neto.</p>
      <p><strong>RISIKO:</strong> Volatilitas maksimal ___%. <em>Drawdown</em> maksimal ___%. <em>Tidak</em> leverage / <em>tidak</em> produk yang tidak dipahami.</p>
      <p><strong>BATASAN:</strong> Horizon ___ tahun. Likuiditas Rp___/tahun. Pajak: <em>tax-aware</em> (tunda realisasi; <em>harvest</em> rugi tiap Desember). <em>No-go</em>: ___.</p>
      <p><strong>ALOKASI:</strong> Saham ___%, Obligasi ___%, Kas ___%, Lainnya ___%.</p>
      <p><strong>DISIPLIN:</strong> <em>Rebalance</em> tiap ___ / jika menyimpang &gt; ___%. Review IPS tiap ___. <em>Tidak</em> mengubah alokasi karena berita.</p>
      <p><strong>TANDA TANGAN:</strong> ___ (tanggal ___). <strong>Ditandatangani saat tenang; dipatuhi saat panik.</strong></p>
      <h3>⚖️ Fidusia vs Suitability &mdash; Standar Penasihat</h3>
      <p><strong>Dua standar:</strong> <em>Suitability</em> = &ldquo;produk <em>cocok</em>&rdquo; (boleh jual yang komisi tinggi asal &ldquo;cocok&rdquo;!). <em>Fiduciary</em> = &ldquo;<strong>terbaik untuk klien</strong>&rdquo; (wajib utamakan klien, ungkap konflik!).</p>
      <p><strong>Implikasi:</strong> penasihat <em>suitability</em> bisa menjual reksadana <em>fee</em> 2% padahal ada yang 0,2% &mdash; <strong>legal</strong>! Penasihat <em>fidusia</em> = <strong>pelanggaran</strong>. <strong>Selisih 1,8%/tahun &times; 20 tahun = 30% kekayaan!</strong></p>
      <p><strong>Tanya sebelum percaya:</strong> (1) &ldquo;Apakah Bapak/Ibu <em>fidusia</em>?&rdquo; (2) &ldquo;Bagaimana cara dibayar &mdash; <em>fee</em>, komisi, atau keduanya?&rdquo; (3) &ldquo;Apakah ada <em>konflik kepentingan</em>?&rdquo; <strong>Jawaban menghindar = <em>red flag</em>.</strong></p>
      <p><strong><em>IPS</em></strong> = <strong><em>fondasi</em></strong>.</p>
      <p><strong><em>IPS</em></strong> <strong><em>kuat</em></strong>.</p>
      {/* 6. MISKONSEPSI */}
      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Return bruto 18% selalu lebih baik dari 12%. Pilih manajer return tertinggi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Pak Darma: 18% bruto → <strong>11% neto</strong> (trading = pajak tahunan); 12% buy-and-hold → <strong>11,5% neto</strong>. <strong>Tax drag</strong> bisa 2–7% poin untuk strategi aktif! Bandingkan <strong>setelah pajak &amp; biaya</strong> — itulah yang dibelanjakan.</p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;IPS = formalitas sekali tulis, simpan di laci.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> IPS = <strong>dokumen hidup</strong>: review tahunan + saat life event (nikah, warisan, PHK). IPS Pak Darma <em>melarang</em> gaya manajer lama — tanpa IPS, manajer 'hebat' itu terus menggerogoti pajak. IPS = <strong>rem</strong> atas godaan.</p>
</div>

<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pajak = urusan akuntan, bukan investor.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> pajak = <strong>20&ndash;30% return</strong> &mdash; <em>lebih besar</em> dari <em>fee</em> manajer! Investor yang mengabaikan pajak = <strong>bekerja untuk negara</strong>. <em>Asset location</em> (taruh apa di akun pajak-tunda?) = <strong>keputusan alokasi sepenting <em>asset allocation</em>.</strong></p>
</div>
<div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;IPS sekali tulis, selesai.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> IPS = <strong>dokumen hidup</strong> &mdash; direview tahunan + saat <em>life event</em> (nikah, pensiun, warisan!). IPS 2015 untuk klien lajang &ne; IPS 2025 untuk klien berkeluarga. <strong>IPS usang = IPS mati.</strong></p>
</div>
      {/* 7. TIPS */}
      <h2 id="tips">💡 Tips &amp; Intuisi Kunci</h2>
<div className="tip">
<p><strong>💡 <strong>Selalu tanya 'setelah pajak?'</strong> Setiap pitch manajer/produk: minta return <em>setelah pajak &amp; biaya</em>. Jika tidak bisa memberi — itu jawabannya.</strong></p>
</div>
<div className="tip">
<p><strong>💡 <strong>Panen rugi tiap Desember.</strong> Jadwalkan review tax-loss harvesting akhir tahun: daftar posisi rugi → putuskan panen vs tahan (jangan panen buta — pertimbangkan prospek!).</strong></p>
</div>

<div className="tip">
<p><strong>💡 Tulis IPS-mu sendiri (30 menit):</strong> (1) <strong>Tujuan</strong> &mdash; angka &amp; tahun; (2) <strong>Batas risiko</strong> &mdash; rugi maksimal yang bisa tidur nyenyak; (3) <strong>Alokasi</strong> &mdash; % per aset; (4) <strong>Aturan</strong> &mdash; kapan rebalance, kapan jual; (5) <strong>Tanda tangan</strong> &mdash; komitmen. <strong>Tempel di dinding. Baca saat panik.</strong></p>
</div>
      {/* 8. LABS */}
<h2 id="lab1">🔬 Lab 1: Generator IPS 1 Halaman</h2>
<p>Jawab 6 pertanyaan — dapatkan draf IPS terstruktur.</p>
<PyodideLab
  title={"Lab 1 — Generator IPS"}
  hint={"Ubah HORIZON 15 → 3 (butuh dana segera). Lihat risk & alokasi berubah drastis!"}
  defaultCode={"# Generator IPS 1 halaman\nNAMA = \"Pak Darma\"\nTUJUAN = \"Pendidikan anak\"\nHORIZON = 15        # tahun (ubah!)\nKEMAMPUAN = \"tinggi\"  # tinggi/sedang/rendah\nKEMAUAN = \"moderat\"   # agresif/moderat/konservatif\nLIKUIDITAS_THN = 200  # Rp jt/tahun\nPAJAK_SADAR = True\n\nrisk = min(KEMAMPUAN, KEMAUAN, key=[\"rendah\",\"konservatif\",\"moderat\",\"sedang\",\"tinggi\",\"agresif\"].index)\nprint(f\"IPS {NAMA} - Tujuan: {TUJUAN}\")\nprint(f\"  Return objective : {12 if HORIZON>10 else 6}% nominal bersih pajak\")\nprint(f\"  Risk tolerance   : {risk} (kemampuan {KEMAMPUAN}, kemauan {KEMAUAN})\")\nprint(f\"  Horizon          : {HORIZON} tahun\")\nprint(f\"  Likuiditas       : Rp{LIKUIDITAS_THN}jt/tahun\")\nprint(f\"  Pajak            : {'tax-aware (tunda realisasi, panen rugi)' if PAJAK_SADAR else 'standar'}\")\nprint(f\"  Review           : tahunan + life event\")\nprint(\"\\nAturan: ikuti risk TERENDAH dari kemampuan vs kemauan.\")\n"}
/>
<h2 id="lab2">🔬 Lab 2: Kalkulator Tax-Loss Harvesting</h2>
<p>Hitung penghematan pajak dari memanen kerugian.</p>
<PyodideLab
  title={"Lab 2 — Kalkulator Tax Harvesting"}
  hint={"Ubah RUGI_B 200 → 500 (panen lebih besar). Pajak makin kecil — tapi jangan panen aset bagus buta!"}
  defaultCode={"# Tax-loss harvesting\nUNTUNG_A = 500   # Rp jt unrealized gain saham A\nRUGI_B = 200     # Rp jt unrealized loss saham B (ubah!)\nTARIF = 0.20\n\npajak_tanpa = UNTUNG_A * TARIF\nnet_gain = max(0, UNTUNG_A - RUGI_B)\npajak_dengan = net_gain * TARIF\nhemat = pajak_tanpa - pajak_dengan\n\nprint(f\"Jual A saja: pajak Rp{pajak_tanpa:.0f}jt\")\nprint(f\"Jual A + panen B: pajak Rp{pajak_dengan:.0f}jt\")\nprint(f\"HEMAT: Rp{hemat:.0f}jt ({hemat/pajak_tanpa:.0%} dari pajak!)\")\nprint()\nprint(\"Ingat: beli kembali eksposur sejenis (jaga alokasi),\")\nprint(\"waspadai wash sale (jangan beli identik < 30 hari).\")\n"}
/>

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan</h2>
<div className="decision-card">
<h3>1. Klien baru → <strong>IPS tertulis sebelum produk</strong></h3>
<p><strong>Kenapa:</strong> Diagnosis sebelum resep.</p>
<p><strong>Contoh nyata:</strong> Generator Lab 1.</p>
</div>
<div className="decision-card">
<h3>2. Kemampuan tinggi, kemauan rendah → <strong>Ikuti kemauan (edukasi bertahap)</strong></h3>
<p><strong>Kenapa:</strong> Risiko yang tidak bisa ditahan = risiko yang merugikan.</p>
<p><strong>Contoh nyata:</strong> Mulai moderat, naikkan pelan.</p>
</div>
<div className="decision-card">
<h3>3. Akun kena pajak + posisi rugi → <strong>Tax-loss harvesting (Desember)</strong></h3>
<p><strong>Kenapa:</strong> Ubah rugi jadi pengurang pajak.</p>
<p><strong>Contoh nyata:</strong> Panen Rp200jt → hemat Rp40jt.</p>
</div>
<div className="decision-card">
<h3>4. Alokasi antar-akun → <strong>Asset location: tidak efisien → tax-deferred</strong></h3>
<p><strong>Kenapa:</strong> Obligasi/REIT di pensiun; growth di kena pajak.</p>
<p><strong>Contoh nyata:</strong> Setup awal portofolio.</p>
</div>
<div className="decision-card">
<h3>5. Kelola portofolio → <strong>IPS tertulis + hitung neto setelah pajak</strong></h3>
<p><strong>Kenapa:</strong> IPS = jangkar perilaku; pajak = 20-30% return yang bisa dikelola.</p>
<p><strong>Contoh nyata:</strong> 18% bruto → 11% neto vs 12% → 11,5% neto — &ldquo;aktif&rdquo; kalah!</p>
</div>
<div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3>
<ol><li><strong>IPS dulu</strong>, produk kemudian.</li><li><strong>Ikuti risk terendah</strong> (mampu vs mau).</li><li><strong>Setelah pajak</strong> = yang dihitung.</li><li><strong>Panen rugi</strong>, tunda untung.</li></ol>
</div>

      {/* 10. MINI-CASE */}
<h2 id="case">📋 Mini-Case: Warisan Rp5M, Pajak Menggerogoti</h2>
<div className="callout">
<p>Pak Darma: manajer trading 18% bruto → 11% neto (pajak tahunan). Alternatif buy-and-hold 12% → 11,5% neto.</p>
<p><strong>Vignette lanjutan.</strong> Pak Darma mewarisi Rp5M. Manajer A menawarkan trading aktif (18% bruto historis); Manajer B <em>buy-and-hold</em> (12%). Setelah dihitung: A &rarr; 11% neto (pajak tahunan!), B &rarr; 11,5% neto. Pak Darma tergoda &ldquo;18% lebih besar&rdquo;.</p>
<p><strong>Pertanyaan:</strong> (a) Mekanisme <em>tax drag</em>? (b) Susun IPS 1 paragraf. (c) Tiga aksi <em>tax-aware</em> tahun 1? (d) Hitung nilai 15 tahun: A (11% neto) vs B (11,5% neto) dari Rp5M &mdash; selisihnya? (e) Bagaimana meyakinkan Pak Darma memilih B?</p>
<p><strong>Pertanyaan:</strong> (a) Mekanisme tax drag? (b) Susun IPS 1 paragraf. (c) Tiga aksi tax-aware tahun 1? (d) Hitung nilai 15 tahun: A (11% neto) vs B (11,5% neto) dari Rp5M &mdash; selisihnya? (e) Bagaimana meyakinkan Pak Darma memilih B?</p>
<details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) <strong>Realisasi tahunan</strong> = pajak tahunan atas tiap gain (20%); compounding <em>setelah</em> pajak vs buy-and-hold yang compounding <em>penuh</em> lalu pajak sekali di akhir. Selisih 7 poin = <strong>biaya 'aktif'</strong>.</p>
<p>(b) <strong>IPS</strong>: return 12% neto; risk moderat (vol &lt; 14%); horizon 15 thn; likuiditas Rp200jt/thn; <strong>tax-aware</strong> (minimalkan realisasi); review tahunan.</p>
<p>(d) <strong>A:</strong> 5M &times; 1,11^15 = 5M &times; 4,78 = <strong>Rp23,9M</strong>. <strong>B:</strong> 5M &times; 1,115^15 = 5M &times; 5,12 = <strong>Rp25,6M</strong>. <strong>Selisih: Rp1,7M (7%)!</strong> &mdash; dari 0,5 poin persen per tahun! <strong>Pelajaran: <em>kecil &amp; konsisten</em> mengalahkan <em>besar &amp; bocor</em>.</strong> 18% &ldquo;bruto&rdquo; = ilusi; 11,5% neto = uang betulan.</p>
<p>(e) <strong>Tiga argumen:</strong> (1) <strong>angka</strong> &mdash; tunjukkan Rp1,7M selisih (uang nyata!); (2) <strong>risiko</strong> &mdash; trading aktif = <em>volatilitas</em> + <em>biaya</em> + <em>waktu</em> (apakah Pak Darma mau <em>stres</em> tiap hari?); (3) <strong>IPS</strong> &mdash; &ldquo;Bapak tanda tangan ini saat tenang; mari patuhi&rdquo;. <strong>Penasihat = <em>behavioral coach</em>, bukan <em>stock picker</em>.</strong></p>
<p>(c) <strong>(1)</strong> Ganti ke strategi buy-and-hold; <strong>(2)</strong> asset location (obligasi → akun pensiun); <strong>(3)</strong> jadwal panen rugi Desember.</p>
</details>
</div>

      {/* 10c. DEEP DIVE */}
      <h2 id="deepdive">🔬 Deep Dive: Lanjutan IPS</h2>
      <h3>1. Asset location &mdash; taruh apa di mana</h3>
      <p>Punya akun <em>taxable</em> &amp; <em>tax-deferred</em>. <strong>Aturan:</strong> taruh <strong>obligasi</strong> (bunga kena pajak tahunan!) di <em>deferred</em>; <strong>saham</strong> (<em>capital gain</em> bisa ditunda!) di <em>taxable</em>. <strong>Dampak:</strong> 0,5&ndash;1%/tahun &mdash; <em>gratis</em>! <strong>Kesalahan umum:</strong> dibalik (saham di deferred = membuang keuntungan penundaan!).</p>
      <h3>2. Behavioral IPS &mdash; kenali dirimu</h3>
      <p>IPS standar = <em>rasional</em>. <strong>IPS behavioral</strong> menambah: <em>loss aversion</em> klien? <em>overconfidence</em>? <em>home bias</em>? <strong>Gunanya:</strong> merancang <em>guardrail</em> (mis. &ldquo;cek portofolio maksimal 1&times;/bulan&rdquo; untuk yang panikan!). <strong>Manajer terbaik = <em>psikolog</em> + analis.</strong></p>
      <h3>3. ESG dalam IPS &mdash; nilai &amp; nilai</h3>
      <p>Klien peduli ESG: tulis <strong>eksplisit</strong> di IPS (<em>exclusion</em>? <em>tilt</em>? <em>impact</em>?). <strong>Penting:</strong> jelaskan <em>tradeoff</em> potensial ( universe menyempit &rarr; diversifikasi berkurang!) &amp; dapatkan <strong>persetujuan tertulis</strong>. <strong>ESG tanpa IPS = <em>greenwashing</em> diri sendiri.</strong></p>

      {/* 10b. LATIHAN MANDIRI */}
      <h2 id="latihan">🏋️ Latihan Mandiri (Drill CFA-Style)</h2>
      <div className="callout"><p>Empat drill. Kerjakan dulu, <em>lalu</em> buka solusi.</p></div>
      <h3>Drill 1 &mdash; Tax drag kilat</h3>
      <p>100jt, 10% bruto, pajak 20% tahunan vs tunda 5 tahun. Selisih?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 1 (klik untuk buka)</summary>
      <p>Tahunan: 100&times;1,08^5 = <strong>147jt</strong>. Tunda: (100&times;1,1^5 &minus; 100)&times;0,8 + 100 = <strong>149jt</strong>. Selisih <strong>2jt</strong>.</p>
      </details>
      <h3>Drill 2 &mdash; IPS kilat</h3>
      <p>Sebutkan 4 komponen IPS.</p>
      <details className="worked">
      <summary>💡 Solusi Drill 2 (klik untuk buka)</summary>
      <p><strong>Return, risk, constraints</strong> (horizon/likuiditas/pajak), <strong>rebalance &amp; review</strong>.</p>
      </details>
      <h3>Drill 3 &mdash; LDI</h3>
      <p>Dana pensiun defisit. Mengapa &ldquo;kejar return saham&rdquo; berbahaya?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 3 (klik untuk buka)</summary>
      <p>Kewajiban <strong>tidak turun</strong> saat pasar jatuh &rarr; defisit <strong>meledak</strong>. Gunakan LDI: cocokkan durasi.</p>
      </details>
      <h3>Drill 4 &mdash; Vignette jebakan</h3>
      <p>&ldquo;Manajer 18% vs 12%. Pilih 18%.&rdquo; Benar?</p>
      <details className="worked">
      <summary>💡 Solusi Drill 4 (klik untuk buka)</summary>
      <p><strong>Belum tentu!</strong> Hitung <em>neto setelah pajak</em>: 18%&rarr;11% vs 12%&rarr;11,5%. <strong>Pilih 11,5%!</strong></p>
      </details>

      {/* 11. QUIZ */}
<h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}
<div className="callout"><p><strong>Target lulus:</strong> jawab benar minimal 5 dari 6. Klik jawaban — feedback langsung muncul dengan alasannya.</p></div>
<Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
  question={"1. 18% bruto aktif vs 12% buy-and-hold. Setelah pajak (20% tahunan vs akhir)?"}
  options={
    ["Aktif menang",
    "Buy-and-hold menang (11,5% vs 11% neto)",
    "Sama",
    "Tidak bisa dihitung"]
  }
  correct={1}
  explanation={"Benar: tax drag tahunan menggerogoti compounding. Bandingkan selalu setelah pajak & biaya."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
  question={"2. Kemampuan tinggi, kemauan konservatif. Risk tolerance?"}
  options={
    ["Tinggi",
    "Konservatif (ikuti yang terendah + edukasi)",
    "Moderat",
    "Agresif"]
  }
  correct={1}
  explanation={"Benar: risiko yang tidak bisa ditahan = panic selling. Ikuti kemauan, edukasi bertahap."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
  question={"3. Untung Rp500jt, rugi Rp200jt, tarif 20%. Hemat via harvesting?"}
  options={
    ["Rp0",
    "Rp40jt",
    "Rp100jt",
    "Rp200jt"]
  }
  correct={1}
  explanation={"Benar: (500−200)×20% = 60 vs 500×20% = 100 → hemat 40. Rugi jadi 'pupuk' pajak."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
  question={"4. Dana pensiun DB defisit 80% funded. Strategi?"}
  options={
    ["All-in saham kejar return",
    "LDI: match durasi + kontribusi bertahap",
    "Tarik semua",
    "Abaikan"]
  }
  correct={1}
  explanation={"Benar: kejar return saat defisit = risiko melebar (aset turun + liabilitas naik). LDI stabilkan funded ratio dulu."}
/>
<Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
  question={"5. Asset location yang benar?"}
  options={
    ["Obligasi di akun kena pajak",
    "Aset tidak efisien pajak (obligasi) di tax-deferred",
    "Acak",
    "Semua di satu akun"]
  }
  correct={1}
  explanation={"Benar: 'taruh es di freezer' — aset bocor pajak di akun terlindung; growth efisien di kena pajak."}
/>

<Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
  question={"6. Rp5M, 15 tahun. A: 11% neto vs B: 11,5% neto. Selisih nilai akhir & pelajaran?"}
  options={
    ["Rp0,5M — tidak material",
    "Rp1,7M (7%) — kecil & konsisten mengalahkan besar & bocor",
    "Sama — pajak tidak berpengaruh jangka panjang",
    "A menang — 18% bruto lebih besar"]}
  correct={1}
  explanation={"Benar: 5M×1,11^15=Rp23,9M vs 5M×1,115^15=Rp25,6M, selisih Rp1,7M. Pelajaran: hitung neto setelah pajak; 0,5%/tahun × 15 tahun = 7%."}
/>

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
<li><strong>IPS</strong>: objectives (return, risk: mampu vs mau) + constraints (likuiditas, horizon, pajak, legal, unique).</li>
<li><strong>Institusi</strong>: DB (LDI, funded ratio), endowment (abadi), asuransi (regulasi).</li>
<li><strong>Tax drag</strong>: realisasi tahunan membunuh compounding; bandingkan neto.</li>
<li><strong>Harvesting</strong>: panen rugi → offset gain; waspadai wash sale.</li>
<li><strong>Asset location</strong>: tidak efisien → tax-deferred.</li>
<li><strong>IPS hidup</strong>: review tahunan + life event.</li>

<li><strong>IPS:</strong> konstitusi portofolio; dokumen hidup; pelanggaran = fidusia.</li>
<li><strong>Pajak:</strong> hitung neto; tunda realisasi; harvest rugi; asset location.</li>
<li><strong>Institusi:</strong> mulai dari kewajiban (LDI, spending rule).</li>
<li><strong>Kapan TIDAK pakai:</strong> return bruto tanpa pajak; IPS mati; strategi tanpa kewajiban.</li></ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/pm-b9-intercorporate" className="btn btn-secondary btn-sm">← PM-B9</Link>
        <Link href="/learn/pm-c2-capital-market-expectations" className="btn btn-primary btn-sm">PM-C2 →</Link>
      </div>
    </div>
  );
}
