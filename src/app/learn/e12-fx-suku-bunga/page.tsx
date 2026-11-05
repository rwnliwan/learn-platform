"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E12Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const usdidrData = [
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [14100, 14300, 15600, 15400, 16100, 16500],
      mode: "lines+markers",
      name: "USD/IDR akhir tahun (ilustratif)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const birateData = [
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [3.75, 3.5, 5.5, 6.0, 6.0, 5.75],
      mode: "lines+markers",
      name: "BI-Rate (ilustratif)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: ["2020", "2021", "2022", "2023", "2024", "2025"],
      y: [1.7, 1.9, 5.5, 2.6, 1.6, 2.4],
      mode: "lines+markers",
      name: "Inflasi (ilustratif)",
      line: { color: "#e8a838", width: 3 },
    },
  ];

  const lab1Code = `# Lab 1 — Covered Interest Parity: kurs forward yang 'wajar'
# Spot USD/IDR 16.500; bunga IDR 6%, USD 4,5%; tenor 1 tahun
S = 16500
r_idr, r_usd, T = 0.06, 0.045, 1.0

F_wajar = S * (1 + r_idr * T) / (1 + r_usd * T)
print(f"Spot USD/IDR       : Rp{S:,}")
print(f"Forward wajar 1thn : Rp{F_wajar:,.0f}")
print(f"Forward premium    : {(F_wajar/S - 1)*100:.2f}%")
print()
print("Artinya: rupiah 'seharusnya' melemah ~1,44%/thn thd dolar,")
print("TANPA melihat berita apa pun — murni selisih bunga (arbitrase).")
print()
print("Coba: r_idr = 0.09 (BI naikkan bunga). Forward jadi berapa?")
print("(Petunjuk: forward melemah LEBIH — bedakan spot vs forward!)")`;

  const lab2Code = `# Lab 2 — Suku bunga RIIL: yang benar-benar kamu dapat
# Bunga riil = daya belimu setelah inflasi
data = [
    ("Deposito 2023", 0.045, 0.026),
    ("Deposito 2022", 0.040, 0.055),
    ("SBN ritel 2024", 0.064, 0.016),
]
print(f"{'Produk':18s} {'Nominal':>8s} {'Inflasi':>8s} {'RIIL':>8s}")
for nama, nom, inf in data:
    riil = (1 + nom) / (1 + inf) - 1
    ket = "daya beli NAIK" if riil > 0 else "daya beli TURUN!"
    print(f"{nama:18s} {nom*100:6.1f}%  {inf*100:6.1f}%  {riil*100:+6.1f}%  {ket}")
print()
print("2022: deposito 'untung' 4% tapi daya beli -1,4%!")
print("Pelajaran: bandingkan SELALU dalam bunga riil, bukan nominal.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E12 — Financial Markets</span>
        <h1 className="display-title">FX &amp; Suku Bunga:<br />Dua Sisi Rupiah</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rupiah Melemah — Salah Siapa?</a></li>
          <li><a href="#kurs">Kurs Spot &amp; Forward — Harga Uang</a></li>
          <li><a href="#paritas">Paritas Suku Bunga — Jembatan Dua Negara</a></li>
          <li><a href="#ppp">Daya Beli (PPP) — Kurs &ldquo;Seharusnya&rdquo;</a></li>
          <li><a href="#bi">Bank Indonesia — Sang Pengatur Suku Bunga</a></li>
          <li><a href="#riil">Bunga Riil vs Nominal — Yang Benar-Benar Kamu Dapat</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kurs Forward yang Wajar</a></li>
          <li><a href="#lab2">🔬 Lab 2: Bunga Riil</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Membaca Sinyal BI &amp; Kurs</a></li>
          <li><a href="#case">📋 Mini-Case: Importir Bahan Baku</a></li>
          <li><a href="#worked1">🔬 Worked Example: Cross Rate EUR/IDR</a></li>
          <li><a href="#worked2">🔬 Worked Example: Forward Rate dari Selisih Bunga</a></li>
          <li><a href="#konteks">🌍 Konteks: 1998 — Rupiah 2.500 ke 16.000</a></li>
          <li><a href="#carrytrade">🔧 Pendalaman: Carry Trade — Uang Gratis yang Tidak Gratis</a></li>
          <li><a href="#trinitas">🔧 Pendalaman: Trinitas Mustahil — Pilih Dua, Korbankan Satu</a></li>
          <li><a href="#worked4">🔬 Worked Example: Skor Kebijakan Tiga Negara</a></li>
          <li><a href="#bedahberita">🔧 Pendalaman: Bedah Berita Kurs — Checklist Analis</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan kurs spot dan forward serta menghitung forward wajar via covered interest parity.</li>
          <li>Menjelaskan hubungan suku bunga–inflasi–nilai tukar (paritas &amp; PPP) dengan contoh IDR.</li>
          <li>Menjelaskan mekanisme kebijakan moneter BI (BI-Rate) dan transmisinya ke ekonomi.</li>
          <li>Menghitung suku bunga riil dan menggunakannya untuk membandingkan produk keuangan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rupiah Melemah — Salah Siapa?</h2>
      <div className="story">
        <p>USD/IDR menembus Rp16.500. Media ribut: <em>&ldquo;Rupiah terpuruk!&rdquo;</em> Netizen menunjuk BI. Tapi di saat yang sama, bank sentral AS menaikkan suku bunga — dolar menguat terhadap <strong>semua</strong> mata uang dunia, dari yen sampai euro. Rupiah &ldquo;melemah&rdquo; 3%, yen melemah 8%.</p>
        <p>Pertanyaan yang benar bukan <em>&ldquo;kenapa rupiah melemah?&rdquo;</em> melainkan <strong>&ldquo;melemah terhadap apa, dan karena apa?&rdquo;</strong> Nilai tukar = harga relatif dua ekonomi — digerakkan selisih suku bunga, inflasi, dan sentimen risiko global. Lesson ini memberimu kerangka untuk membaca berita kurs seperti analis, bukan seperti penonton panik.</p>
        <p><strong>Twist-nya:</strong> &ldquo;Rupiah melemah 3%&rdquo; terdengar seperti vonis atas Indonesia — sampai kamu tahu yen melemah 8% di periode yang sama. Tiba-tiba ceritanya berubah: ini <strong>bukan cerita tentang rupiah yang buruk</strong>, melainkan tentang <strong>dolar yang kuat</strong>. Nilai tukar selalu punya <em>dua sisi</em> — dan 90% kepanikan berita kurs berasal dari membaca satu sisi saja. Lesson ini memberimu kacamata dua sisi: setiap pergerakan kurs = <em>cerita tentang dua ekonomi sekaligus</em>.</p>
      </div>

      <h2 id="kurs">Kurs Spot &amp; Forward — Harga Uang</h2>
      <p><strong>Definisi.</strong> <strong>Kurs spot</strong> = harga tukar <em>hari ini</em> untuk penyerahan segera (misal USD/IDR 16.500 = Rp16.500 per 1 dolar). <strong>Kurs forward</strong> = harga yang <em>disepakati hari ini</em> untuk penyerahan di <em>tanggal masa depan</em> (E10!). Acuan resmi Indonesia: <strong>JISDOR</strong> (Jakarta Interbank Spot Dollar Rate) yang dipublikasikan BI.</p>
      <p><strong>Konvensi baca:</strong> USD/IDR <strong>naik</strong> = rupiah <strong>melemah</strong> (butuh lebih banyak rupiah per dolar). IDR/USD naik = rupiah menguat. Jangan terbalik — ini sumber salah baca #1 di media sosial.</p>
      <p><strong>Kepribadian kurs:</strong> dia <em>papan skor dua tim</em> — IDR vs USD. Skor berubah bisa karena tim IDR melemah <em>atau</em> tim USD menguat. Selalu cek keduanya (lihat DXY/indeks dolar) sebelum menyimpulkan.</p>

      <PlotlyChart
        data={usdidrData}
        title="USD/IDR 2020–2025: Tren Melemah Bertahap (ilustratif)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Rp per USD" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu Y = rupiah per 1 dolar AS. Garis naik = rupiah melemah.</p>
        <p><strong>Interpretasi:</strong> tren naik bertahap 14.100 → 16.500 (bukan anjlok vertikal). Pola <em>depresiasi moderat &amp; terkendali</em> — wajar untuk negara berkembang dengan inflasi sedikit di atas AS (lihat PPP di bawah). <strong>Kepanikan</strong> biasanya dipicu <em>kecepatan</em> pelemahan mendadak, bukan levelnya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan <strong>level</strong> vs <strong>perubahan</strong>. &ldquo;Rp16.500&rdquo; (level) tidak berarti apa-apa tanpa konteks — yang penting: melemah <em>berapa persen</em>, <em>seberapa cepat</em>, dan <em>dibanding mata uang lain</em> (apakah cuma rupiah atau semua EM?). Analis selalu bertanya ketiganya.</p>
      </div>

      <h2 id="paritas">Paritas Suku Bunga — Jembatan Dua Negara</h2>
      <p><strong>Definisi.</strong> <em>Covered interest parity</em> (CIP): kurs forward &ldquo;wajar&rdquo; ditentukan <strong>selisih suku bunga</strong> dua negara — kalau tidak, ada arbitrase bebas risiko:</p>
      <Tex math={String.raw`F = S \times \frac{1 + r_d \cdot T}{1 + r_f \cdot T}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`F`} /> = kurs forward wajar; <Tex math={String.raw`S`} /> = kurs spot; <Tex math={String.raw`r_d`} /> = bunga domestik (IDR); <Tex math={String.raw`r_f`} /> = bunga asing (USD); <Tex math={String.raw`T`} /> = tenor (tahun).</p>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>Spot 16.500, bunga IDR 6%, USD 4,5%, T = 1 tahun.</p>
        <p><strong>Langkah 1</strong> — F = 16.500 × (1,06/1,045) = 16.500 × 1,01435 = <strong>Rp16.737</strong>.<br />
        <strong>Langkah 2</strong> — forward premium = (16.737/16.500) − 1 = <strong>1,44%</strong>.</p>
        <p>Artinya pasar &ldquo;wajar&rdquo; mematok rupiah melemah 1,44%/tahun — <strong>murni karena selisih bunga</strong>, tanpa perlu ramalan ekonomi. Logikanya: pinjam USD 4,5% → tukar ke IDR → deposito 6% → kunci forward — keuntungannya harus nol (kalau tidak, bank-bank menyerbu sampai forward terkoreksi).</p>
      </details>
      <p><strong>Kapan dipakai:</strong> menilai wajar/tidaknya kuotasi forward bank; memahami kenapa forward selalu &ldquo;melemah&rdquo; saat bunga IDR &gt; bunga USD.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Forward Rp16.737 berarti pasar meramalkan rupiah akan melemah ke situ.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> forward dari CIP = <strong>hasil arbitrase bunga</strong>, bukan ramalan! Ia menjawab &ldquo;berapa harga yang mencegah arbitrase&rdquo;, bukan &ldquo;berapa kurs nanti&rdquo;. <em>Uncovered</em> parity (yang memakai ekspektasi) justru terkenal <strong>gagal</strong> memprediksi — dikenal sebagai <em>forward premium puzzle</em>. Jangan pakai forward sebagai ramalan.</p>
      </div>

      <h2 id="ppp">Daya Beli (PPP) — Kurs &ldquo;Seharusnya&rdquo;</h2>
      <p><strong>Definisi.</strong> <em>Purchasing power parity</em>: dalam jangka <strong>panjang</strong>, kurs bergerak mengikuti <strong>selisih inflasi</strong> — mata uang negara berinflasi tinggi cenderung melemah:</p>
      <Tex math={String.raw`\frac{\Delta S}{S} \approx \pi_d - \pi_f`} block />
      <p><strong>Artinya:</strong> depresiasi tahunan ≈ inflasi domestik − inflasi asing. Indonesia inflasi 3%, AS 2% → rupiah &ldquo;wajar&rdquo; melemah ≈ <strong>1%/tahun</strong> — persis tren bertahap di grafik!</p>
      <p><strong>Versi populer:</strong> <strong>Indeks Big Mac</strong> — bandingkan harga Big Mac antar negara. Jika Big Mac Jakarta Rp45.000 dan New York $5,99 (Rp98.800), rupiah terlihat <em>undervalued</em> ~54% — tapi ini <strong>indikator kasar jangka panjang</strong>, bukan sinyal trading.</p>
      <p><strong>Kapan dipakai:</strong> menilai wajar/tidaknya <em>level</em> kurs dalam horizon tahunan; menjelaskan tren depresiasi moderat negara berkembang.</p>

      <h2 id="bi">Bank Indonesia — Sang Pengatur Suku Bunga</h2>
      <p><strong>Definisi.</strong> BI menjalankan <strong>kebijakan moneter</strong> dengan instrumen utama <strong>BI-Rate</strong> (suku bunga acuan). Misi: <strong>stabilitas nilai rupiah</strong> (inflasi rendah &amp; nilai tukar stabil).</p>
      <p><strong>Rantai transmisi</strong> (hafalkan!):</p>
      <ol>
        <li>BI <strong>naikkan</strong> BI-Rate →</li>
        <li>bunga pasar uang &amp; deposito <strong>naik</strong> →</li>
        <li>bunga kredit <strong>naik</strong> → orang malas pinjam, rajin nabung →</li>
        <li>belanja &amp; investasi <strong>turun</strong> →</li>
        <li><strong>inflasi turun</strong> ✓, tapi <strong>pertumbuhan melambat</strong> ✗</li>
      </ol>
      <p>Dan ke nilai tukar: bunga IDR naik → aset IDR lebih menarik → <strong>modal masuk</strong> → rupiah <strong>cenderung menguat</strong> (jangka pendek). Inilah dilema BI: menaikkan bunga untuk jaga rupiah &amp; inflasi, tapi mengorbankan pertumbuhan.</p>
      <p><strong>Kepribadian BI-Rate:</strong> dia <em>rem dan gas</em> ekonomi. Terlalu kencang (bunga tinggi lama) = ekonomi ngadat; terlalu longgar = inflasi &amp; rupiah jebol. Pasar membaca <strong>setiap</strong> RDG (Rapat Dewan Gubernur) seperti peramal cuaca.</p>

      <PlotlyChart
        data={birateData}
        title="BI-Rate vs Inflasi: Rem Ditekan Saat Inflasi Panas (ilustratif)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = BI-Rate, garis kuning = inflasi.</p>
        <p><strong>Interpretasi:</strong> 2022: inflasi melonjak ke 5,5% → BI <strong>menginjak rem</strong> (3,5% → 5,5%). 2024: inflasi jinak 1,6% tapi BI-Rate bertahan 6% — karena <strong>tugas ganda</strong>: jaga rupiah dari tekanan dolar AS yang kuat. <strong>Pelajaran:</strong> BI tidak hanya melihat inflasi domestik — nilai tukar &amp; suku bunga global ikut menentukan.</p>
      </div>

      <h2 id="riil">Bunga Riil vs Nominal — Yang Benar-Benar Kamu Dapat</h2>
      <p><strong>Definisi.</strong> Bunga <strong>nominal</strong> = angka di brosur. Bunga <strong>riil</strong> = daya beli sebenarmu setelah inflasi:</p>
      <Tex math={String.raw`1 + r_{\text{riil}} = \frac{1 + r_{\text{nom}}}{1 + \pi}`} block />
      <p><strong>Artinya:</strong> <Tex math={String.raw`\pi`} /> = inflasi. Aproksimasi cepat: <Tex math={String.raw`r_{\text{riil}} \approx r_{\text{nom}} - \pi`} /> (cukup akurat untuk angka kecil).</p>
      <p><strong>Contoh:</strong> deposito 4%, inflasi 5,5% (2022) → riil ≈ <strong>−1,5%</strong>: uangmu &ldquo;bertambah&rdquo; tapi daya belinya <strong>menyusut</strong>!</p>
      <p><strong>Kepribadian bunga riil:</strong> dia <em>kebenaran pahit</em> — menguliti brosur mengkilap. Negara dengan bunga nominal 15% tapi inflasi 14% = sama saja dengan negara berbunga 3% &amp; inflasi 2%.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga kebiasaan analis FX: (1) bandingkan produk dalam <strong>bunga riil</strong>, bukan nominal; (2) bedakan <strong>level vs perubahan vs kecepatan</strong> kurs; (3) tanya <strong>mata uang pembandingnya</strong> — rupiah melemah vs dolar saat dolar menguat global ≠ rupiah bermasalah.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Kurs Forward yang Wajar</h2>
      <p>Hitung forward &ldquo;wajar&rdquo; dari selisih bunga. Ubah BI-Rate dan lihat paradoks spot vs forward.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Covered Interest Parity"
        hint="Coba: r_usd = 0.06 (The Fed agresif, selisih menyempit). Forward premium menyusut! Lalu r_idr = 0.04 (di bawah USD) — forward jadi DISKON (rupiah 'menguat' di forward)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Bunga Riil</h2>
      <p>Kuliti brosur: berapa daya beli sebenarmu dari tiap produk?</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Bunga Riil"
        hint="Tambahkan: ('Paylater 2024', 0.268, 0.024) — bunga riilnya ~24%! Inilah 'kebenaran pahit' yang tidak ada di iklan."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Membaca Sinyal BI &amp; Kurs</h2>

      <div className="decision-card">
        <h3>1. BI menaikkan BI-Rate → <strong>Siap-siap: bunga kredit &amp; deposito ikut naik</strong></h3>
        <p><strong>Kondisi:</strong> pengumuman RDG hawkish.</p>
        <p><strong>Kenapa:</strong> transmisi moneter — KPR/kredit modal kerja lebih mahal; deposito/SBN baru lebih menarik.</p>
        <p><strong>Contoh nyata:</strong> tunda KPR berbunga floating? Kunci deposito tenor panjang <em>sebelum</em> bank menurunkan bunga.</p>
      </div>

      <div className="decision-card">
        <h3>2. Rupiah melemah tajam &amp; cepat → <strong>Cek: dolar global menguat atau rupiah bermasalah?</strong></h3>
        <p><strong>Kondisi:</strong> USD/IDR melonjak dalam hitungan minggu.</p>
        <p><strong>Kenapa:</strong> jika semua mata uang EM melemah = sentimen global (risk-off); jika <em>hanya</em> rupiah = masalah domestik (defisit, politik).</p>
        <p><strong>Contoh nyata:</strong> bandingkan dengan THB, MYR, PHP di periode sama.</p>
      </div>

      <div className="decision-card">
        <h3>3. Punya utang/kewajiban USD → <strong>Hedge dengan forward (E10)</strong></h3>
        <p><strong>Kondisi:</strong> importir, atau cicilan utang USD.</p>
        <p><strong>Kenapa:</strong> forward mengunci kurs; biayanya = forward premium (selisih bunga) — hitung via Lab 1 apakah &ldquo;sepadan&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> importir kunci kurs untuk pembayaran 6 bulan lagi (lihat mini-case).</p>
      </div>

      <div className="decision-card">
        <h3>4. Membandingkan produk investasi → <strong>Pakai bunga riil, bukan nominal</strong></h3>
        <p><strong>Kondisi:</strong> deposito 5% vs SBN 6,4% vs &ldquo;investasi&rdquo; 12%.</p>
        <p><strong>Kenapa:</strong> nominal menipu saat inflasi tinggi; riil = daya beli sebenarmu. (Lalu sesuaikan dengan risiko — E7.)</p>
        <p><strong>Contoh nyata:</strong> 2022: deposito nominal 4% = riil −1,5%. &ldquo;Aman&rdquo; tapi daya beli bocor.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>USD/IDR naik = rupiah melemah.</strong> Jangan terbalik.</li>
          <li><strong>Forward = arbitrase bunga</strong>, bukan ramalan. <strong>PPP = kompas jangka panjang.</strong></li>
          <li><strong>BI-Rate naik</strong> → jaga inflasi &amp; rupiah, korbankan pertumbuhan. Baca RDG seperti prakiraan cuaca.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Importir Bahan Baku</h2>
      <div className="callout">
        <p>PT Maju Plastik harus bayar pemasok <strong>USD 500 ribu</strong> dalam 6 bulan. Spot Rp16.500, bunga IDR 6%, USD 4,5%. Bank menawarkan forward 6 bulan. Di sisi lain, direksi &ldquo;yakin rupiah akan menguat ke Rp16.000&rdquo; (firasat!).</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung forward wajar 6 bulan. (b) Jika ikut firasat dan tidak hedge, berapa risiko rupiahnya jika kurs jadi Rp17.500? (c) Keputusan profesionalnya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) F = 16.500 × (1+0,06×0,5)/(1+0,045×0,5) = 16.500 × 1,03/1,0225 = <strong>Rp16.621</strong>. Biaya kepastian ≈ Rp121/USD × 500 ribu = <strong>Rp60,5 juta</strong> di atas spot kini.</p>
          <p>(b) Tanpa hedge @17.500: bayar Rp8,75 M vs Rp8,31 M (forward) → <strong>rugi tambahan Rp440 juta</strong> — 7× lipat &ldquo;biaya&rdquo; hedging. Firasat direksi = spekulasi dengan uang perusahaan.</p>
          <p>(c) <strong>Hedge.</strong> Tugas direktur keuangan = <em>menghilangkan</em> risiko kurs (E10), bukan menebaknya. Firasat bukan strategi treasury.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Cross Rate — Harga Euro dalam Rupiah</h2>
      <p>Pasar mengkuotasi: <strong>USD/IDR = 16.500</strong> (1 dolar = Rp16.500) dan <strong>EUR/USD = 1,08</strong> (1 euro = US$1,08). Tidak ada kuotasi langsung EUR/IDR. Berapa &ldquo;harga wajar&rdquo; 1 euro dalam rupiah?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Logika:</strong> 1 EUR = 1,08 USD; 1 USD = Rp16.500. Maka 1 EUR = 1,08 × 16.500.</p>
        <p><strong>Langkah 2 — Hitung:</strong> 1,08 × 16.500 = <strong>Rp17.820</strong>.</p>
        <p><strong>Langkah 3 — Kenapa ini penting:</strong> jika bank mengkuotasimu EUR/IDR = Rp18.200 (beli euro), selisih 380 rupiah/euro = <strong>spread ~2,1%</strong> — biaya tersembunyi (E1!). Cross rate = &ldquo;harga acuan&rdquo; untuk menilai apakah kuotasi money changer menipumu.</p>
        <p><strong>Intuisi:</strong> mayoritas mata uang dunia tidak diperdagangkan langsung satu sama lain — mereka &ldquo;transit&rdquo; lewat USD (atau EUR). Inilah alasan USD disebut <strong>mata uang kendaraan</strong> (<em>vehicle currency</em>): ~90% transaksi valas global melibatkan dolar di satu sisinya. Rupiah &ldquo;melemah terhadap dolar&rdquo; = rupiah melemah terhadap <em>sistem itu sendiri</em>.</p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Berapa Forward USD/IDR Setahun Lagi?</h2>
      <p>Spot USD/IDR = 16.500. Bunga IDR (<em>risk-free</em>) = 6%, bunga USD = 4,5%. Berapa <strong>forward rate 1 tahun</strong> yang &ldquo;wajar&rdquo; menurut <em>covered interest parity</em>?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Rumus:</strong> <Tex math={String.raw`F = S \times \frac{1+r_{IDR}}{1+r_{USD}}`} />.</p>
        <p><strong>Hitung:</strong> F = 16.500 × (1,06 / 1,045) = 16.500 × 1,01435 ≈ <strong>Rp16.737</strong>.</p>
        <p><strong>Artinya:</strong> forward &ldquo;wajar&rdquo; = rupiah <strong>melemah ~1,4%</strong> dalam setahun — <em>bukan</em> ramalan, melainkan <strong>konsekuensi aritmetika</strong> selisih bunga. Kenapa? Jika forward-nya 16.500 (sama dengan spot), arbitraser akan: pinjam USD @4,5% → tukar ke IDR → deposito @6% → kunci forward — <strong>cuan bebas risiko 1,5%</strong>. Arbitrase inilah yang &ldquo;menyeret&rdquo; forward ke 16.737.</p>
        <p><strong>Jebakan interpretasi:</strong> forward 16.737 <strong>BUKAN</strong> prediksi &ldquo;rupiah akan ke 16.737&rdquo;. Ia = harga <em>asuransi</em> (E10!). Eksportir yang mengunci forward 16.737 membeli <em>kepastian</em> — jika spot tahun depan 17.500 ia &ldquo;rugi peluang&rdquo;, jika 16.000 ia &ldquo;untung&rdquo;. Seperti Pak Tani: yang dibeli = ketenangan.</p>
      </details>

      <h2 id="konteks">🌍 Konteks: 1997–1998 — Ketika Rupiah Kehilangan 80%</h2>
      <p>Juli 1997: baht Thailand jatuh. Indonesia — dengan utang swasta berdenominasi dolar yang masif &amp; cadangan devisa terbatas — menjadi sasaran berikutnya. Rupiah dari ~Rp2.500/USD (pra-krisis) merosot ke <strong>Rp16.000+</strong> (Januari 1998): <strong>kehilangan ~85% nilainya</strong> dalam hitungan bulan.</p>
      <ul>
        <li><strong>Mekanisme pembunuhnya:</strong> perusahaan Indonesia berutang <strong>dolar</strong> tapi berpenghasilan <strong>rupiah</strong> (<em>currency mismatch</em>). Rupiah jatuh 4× &rarr; utang dalam rupiah <em>otomatis</em> membengkak 4× — tanpa meminjam sepeser pun lagi. Inilah kenapa krisis kurs = krisis korporasi = krisis perbankan = krisis ekonomi. Satu domino.</li>
        <li><strong>Respons kebijakan:</strong> BI awalnya <em>melebarkan pita intervensi</em> lalu melepas rupiah ke <strong>mengambang bebas</strong> (Agustus 1997); suku bunga ditarik ke 60–70% (E3!) untuk mempertahankan rupiah — obat yang membunuh pasien (kredit macet massal).</li>
        <li><strong>Pelajaran abadi:</strong> (1) <strong>utang valas tanpa lindung nilai = bom waktu</strong> — aturan yang kini diawasi ketat (perusahaan BUMN/swasta wajib <em>hedging ratio</em> minimum); (2) <strong>cadangan devisa = amunisi intervensi</strong> — BI kini memegang &gt;US$130 miliar justru untuk tidak mengulang 1998; (3) <strong>rezim kurs menentukan segalanya</strong> — kurs tetap (<em>peg</em>) terlihat stabil sampai ia runtuh sekaligus (Thailand 1997, SNB 2015 melepas peg franc: EUR/CHF jatuh 15% dalam menit!).</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bedakan tiga &ldquo;kurs&rdquo; yang kamu temui: <strong>JISDOR</strong> (kurs referensi BI — rata-rata transaksi pasar, bukan kurs jual-beli), <strong>kurs TT bank</strong> (yang dipakai transfer — ada spread beli/jual ~1–2%), dan <strong>kurs money changer</strong> (spread bisa 3–5% untuk valas eksotis). &ldquo;Rupiah 16.500&rdquo; di berita = JISDOR; yang kamu bayar di bank selalu lebih mahal (beli valas) / lebih murah (jual valas). Spread = biaya (E1, lagi!).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;BI bisa menguatkan rupiah kapan saja kalau mau.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> intervensi = <strong>menjual dolar dari cadangan devisa &amp; membeli rupiah</strong> — amunisinya <em>terbatas</em> (cadangan devisa) dan melawan <em>arus pasar global</em> yang triliunan dolar per hari. BI <em>bisa</em> memperhalus volatilitas (<em>smoothing</em>), tapi tidak bisa melawan tren fundamental (selisih bunga, sentimen risiko global) selamanya — 1997 membuktikannya. Bank sentral = pemecah ombak, bukan penahan tsunami.</p>
      </div>

      <h2 id="carrytrade">🔧 Pendalaman: Carry Trade — &ldquo;Uang Gratis&rdquo; yang Memakan Tuannya</h2>
      <p>Strategi legendaris: <strong>pinjam di mata uang berbunga rendah, investasikan di berbunga tinggi</strong>. Contoh klasik: pinjam yen @ 0,5% (Jepang), beli obligasi IDR @ 6%. Selisih 5,5% = &ldquo;cuan&rdquo; — <em>selama kurs tidak bergerak melawanmu</em>.</p>
      <ul>
        <li><strong>Kenapa terlihat gratis:</strong> teori paritas (Worked 2) bilang forward <em>seharusnya</em> menghapus selisih ini — tapi <strong>tanpa hedging</strong> (<em>uncovered</em>), kamu bertaruh kurs spot tidak bergerak. Bertahun-tahun yen tenang &rarr; carry trader panen 5%+ per tahun. &ldquo;Memungut receh&rdquo; (E7!).</li>
        <li><strong>Buldosernya:</strong> saat krisis/panik global, semua carry trader <strong>kabur bersamaan</strong> — menjual IDR, membeli kembali yen &rarr; yen melonjak, rupiah jatuh <em>lebih dalam</em> dari fundamental. Agustus 2024: unwind carry trade yen mengguncang pasar global dalam hitungan hari.</li>
        <li><strong>Pelajaran:</strong> carry trade = <strong>menjual asuransi terhadap krisis</strong> — premi kecil tiap tahun, klaim raksasa sesekali. Bank &amp; hedge fund yang menjalaninya memakai <em>stop-loss</em> &amp; batas ukuran ketat. Ritel yang ikut-ikutan tanpa itu = calon korban unwind berikutnya.</li>
      </ul>
      <p><strong>Untuk analis:</strong> arus carry trade menjelaskan <em>mengapa</em> rupiah bisa menguat saat fundamental domestik biasa-biasa saja (uang asing masuk mengejar yield) — dan mengapa ia bisa jatuh <em>tanpa</em> berita domestik buruk (uang asing kabur karena panik global). Membaca kurs = membaca <strong>arus modal global</strong>, bukan cuma neraca perdagangan.</p>


      <h2 id="trinitas">🔧 Pendalaman: Trinitas Mustahil (<em>Impossible Trinity</em>)</h2>
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


      <h2 id="bedahberita">🔧 Pendalaman: Bedah Berita Kurs Seperti Analis — Checklist 5 Langkah</h2>
      <p>Berita: <em>&ldquo;Rupiah melemah ke Rp16.500, tertekan!&rdquo;</em> Sebelum panik, jalankan checklist ini:</p>
      <ol>
        <li><strong>Terhadap apa?</strong> Cek DXY (indeks dolar): jika DXY naik 2% &amp; rupiah melemah 1,5% &rarr; <strong>dolar menguat global</strong>, rupiah <em>relatif</em> bertahan. Jika DXY datar &amp; rupiah melemah 1,5% &rarr; <strong>masalah domestik</strong> (arus keluar, sentimen).</li>
        <li><strong>Berapa lama?</strong> Satu hari ±1% = <em>noise</em> (likuiditas tipis, fix order). Tren 3 bulan −8% = <em>sinyal</em> (selisih bunga, neraca pembayaran).</li>
        <li><strong>Apa kata bunga?</strong> Selisih yield 10Y ID vs US melebar? &rarr; tekanan pada rupiah <em>wajar</em> (E5: spread!). Sempit tapi rupiah melemah? &rarr; cari faktor lain (politik, komoditas).</li>
        <li><strong>Apa kata BI?</strong> Cek pernyataan &amp; cadangan devisa: intervensi verbal (&ldquo;BI selalu di pasar&rdquo;) vs aktual. Cadangan turun US$5 M/bulan = <strong>intervensi berat</strong> = BI menilai pelemahan <em>berlebihan</em>.</li>
        <li><strong>Siapa yang terdampak?</strong> Importir &amp; berutang dolar (E12: mismatch!) terpukul; eksportir komoditas <em>diuntungkan</em> (terima dolar, biaya rupiah). &ldquo;Rupiah melemah&rdquo; bukan kabar buruk untuk <em>semua orang</em> — petakan <em>eksposur</em>-mu (E13!).</li>
      </ol>
      <p><strong>Hasil checklist = kalimat analis:</strong> <em>&ldquo;Rupiah melemah 1,5% sepekan — didorong penguatan dolar global (DXY +2%), bukan faktor domestik; spread yield stabil; BI intervensi ringan. Dampak: netral-negatif untuk importir, positif untuk eksportir. Level waspada: penembusan 16.800 dengan DXY datar.&rdquo;</em> — bandingkan dengan &ldquo;rupiah terpuruk!&rdquo; Paham bedanya? <strong>Itulah nilai lesson ini.</strong></p>


      <h2 id="quiz">✏️ Quiz — Dua Sisi Rupiah (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. USD/IDR naik dari 16.000 ke 16.500. Artinya…"
        options={[
          "Rupiah menguat",
          "Rupiah melemah — butuh lebih banyak rupiah per dolar",
          "Dolar melemah",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar: rupiah melemah. Konvensi USD/IDR naik = IDR melemah. Jangan terbalik — ini salah baca paling umum."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Spot 16.500, bunga IDR 6%, USD 4,5%, 1 tahun. Forward wajar?"
        options={[
          "Rp16.500 (sama dengan spot)",
          "Rp16.737 — forward premium dari selisih bunga (arbitrase)",
          "Rp15.000 (ramalan penguatan)",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: 16.500 × 1,06/1,045 = Rp16.737. Ini HASIL ARBITRASE bunga, bukan ramalan kurs masa depan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. BI menaikkan BI-Rate. Efek berantainya…"
        options={[
          "Bunga kredit turun, ekonomi memanas",
          "Bunga naik → belanja/investasi turun → inflasi turun, tapi pertumbuhan melambat; rupiah cenderung didukung",
          "Tidak ada efek",
          "Hanya memengaruhi bank",
        ]}
        correct={1}
        explanation="Benar: rantai transmisi moneter. BI menukar pertumbuhan dengan stabilitas (inflasi + rupiah) — dilema klasik bank sentral."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Deposito 4%, inflasi 5,5%. Bunga riil?"
        options={[
          "4%",
          "9,5%",
          "≈ −1,5% — daya beli MENYUSUT meski nominal bertambah",
          "0%",
        ]}
        correct={2}
        explanation="Benar: (1,04/1,055)−1 ≈ −1,4%. Uang 'bertambah' tapi daya beli bocor. Selalu bandingkan dalam riil."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Rupiah melemah 5% dalam sebulan BERSAMAAN dengan THB, MYR, PHP melemah serupa. Kesimpulan?"
        options={[
          "Rupiah bermasalah spesifik",
          "Sentimen global (dolar menguat / risk-off) — bukan masalah Indonesia saja",
          "BI gagal total",
          "Harus borong dolar sekarang",
        ]}
        correct={1}
        explanation="Benar: pelemahan merata = faktor global (misal The Fed hawkish). Jangan salahkan domestik untuk fenomena global — bandingkan dengan tetangga dulu."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>USD/IDR naik = rupiah melemah.</strong> Bedakan level, perubahan, kecepatan — dan pembandingnya.</li>
          <li><strong>Forward wajar = S × (1+r<sub>d</sub>T)/(1+r<sub>f</sub>T)</strong> — hasil arbitrase bunga, BUKAN ramalan.</li>
          <li><strong>PPP</strong>: depresiasi ≈ selisih inflasi — kompas jangka panjang level kurs.</li>
          <li><strong>BI-Rate</strong> = rem/gas ekonomi: naik → inflasi &amp; rupiah dijaga, pertumbuhan dikorbankan.</li>
          <li><strong>Bunga riil = (1+r<sub>nom</sub>)/(1+π) − 1</strong> — kebenaran pahit di balik brosur.</li>
          <li>Punya kewajiban valas → <strong>hedge</strong>; firasat direksi bukan strategi treasury.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e11-black-scholes" className="btn btn-secondary btn-sm">← E11</Link>
        <Link href="/learn/e13-market-risk" className="btn btn-primary btn-sm">Next: E13 →</Link>
      </div>
    </div>
  );
}
