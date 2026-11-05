"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function E8Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const frontierData = [
    {
      x: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      y: [4.5, 5.8, 7.0, 8.1, 9.0, 9.8, 10.5, 11.1, 11.6, 12.0, 12.3, 12.5, 12.6],
      mode: "lines",
      name: "Efficient frontier",
      line: { color: "#2a7de1", width: 4 },
    },
    {
      x: [8, 14, 11],
      y: [5.0, 12.0, 8.5],
      mode: "markers+text",
      text: ["Obligasi", "Saham", "Campuran 50/50"],
      textposition: "top center",
      marker: { size: 12, color: ["#5b9bd5", "#e8a838", "#ef4444"] },
      name: "Aset",
    },
  ];

  const corrData = [
    {
      x: ["ρ = +1", "ρ = +0,5", "ρ = 0", "ρ = −0,5", "ρ = −1"],
      y: [15.0, 13.2, 11.2, 8.7, 5.0],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#5b9bd5", "#2a7de1", "#1d6fd1"] },
      text: ["15,0%", "13,2%", "11,2%", "8,7%", "5,0%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1 — Bangun efficient frontier sendiri (2 aset)
# Saham: return 12%, vol 20%. Obligasi: return 6%, vol 8%. Korelasi 0,2.
import math
rs, ss = 0.12, 0.20
rb, sb = 0.06, 0.08
rho = 0.2

print(f"{'Saham':>6s} {'Return':>7s} {'Vol':>6s}")
for w_saham in [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]:
    w_ob = 1 - w_saham
    ret = w_saham * rs + w_ob * rb
    var = (w_saham*ss)**2 + (w_ob*sb)**2 + 2*w_saham*w_ob*rho*ss*sb
    vol = math.sqrt(var)
    print(f"{w_saham*100:4.0f}%  {ret*100:5.1f}%  {vol*100:4.1f}%")
print()
print("Coba: rho = 0.9 (krisis: korelasi naik!). Apa yang terjadi pada vol campuran?")
print("Pelajaran: diversifikasi BEKERJA lewat korelasi rendah.")`;

  const lab2Code = `# Lab 2 — Kekuatan korelasi: 1+1 bisa < 2
# Dua aset identik: vol 20% masing-masing. Bobot 50/50.
import math
s = 0.20
w = 0.5

print("Korelasi  Vol portofolio  'Diskon risiko'")
for rho in [1.0, 0.5, 0.0, -0.5, -1.0]:
    var = (w*s)**2 + (w*s)**2 + 2*w*w*rho*s*s
    vol = math.sqrt(var)
    diskon = (s - vol) / s * 100
    print(f"{rho:+.1f}      {vol*100:5.1f}%        {diskon:4.0f}%")
print()
print("rho=-1: vol portofolio NOL?! (teori; di dunia nyata korelasi -1 sempurna langka)")
print("Coba: s = 0.30. Apakah 'diskon risiko' berubah?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">E8 — Financial Markets</span>
        <h1 className="display-title">Markowitz: Seni Tidak Menaruh<br />Semua Telur Satu Keranjang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Saham, Satu Keajaiban</a></li>
          <li><a href="#return">Return Portofolio — Rata-rata Tertimbang</a></li>
          <li><a href="#var">Risiko Portofolio — Bukan Rata-rata!</a></li>
          <li><a href="#korelasi">Korelasi — Bintang Utamanya</a></li>
          <li><a href="#frontier">Efficient Frontier — Peta Harta Karun</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bangun Frontier Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kekuatan Korelasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Diversifikasi yang Benar</a></li>
          <li><a href="#case">📋 Mini-Case: Portofolio Tiga Aset</a></li>
          <li><a href="#worked1">🔬 Worked Example: Varians Portofolio Dua Aset</a></li>
          <li><a href="#worked2">🔬 Worked Example: Portofolio Varians Minimum</a></li>
          <li><a href="#worked3">🔬 Worked Example: Bonus Rebalancing</a></li>
          <li><a href="#konteks">🌍 Konteks: 2008 — Saat Korelasi Menjadi 1</a></li>
          <li><a href="#duarisiko">🔧 Pendalaman: Dua Risiko — yang Bisa vs yang Tak Bisa Didiversifikasi</a></li>
          <li><a href="#homebias">🔧 Pendalaman: Home Bias &amp; Batas Diversifikasi Global</a></li>
          <li><a href="#worked4">🔬 Worked Example: Menambah Aset Ketiga — Berapa Manfaatnya?</a></li>
          <li><a href="#riskparity">🔧 Pendalaman: Risk Parity — Timbangan Risiko Modern</a></li>
          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung expected return dan volatilitas portofolio dua aset dengan penjelasan tiap simbol.</li>
          <li>Menjelaskan mengapa risiko portofolio bisa lebih kecil dari rata-rata risiko anggotanya (peran korelasi).</li>
          <li>Membaca efficient frontier dan menunjukkan portofolio yang efisien vs tidak efisien.</li>
          <li>Membedakan diversifikasi sejati dari diversifikasi semu (korelasi naik saat krisis).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dua Saham, Satu Keajaiban</h2>
      <div className="story">
        <p>Tahun 1952, mahasiswa 25 tahun bernama <strong>Harry Markowitz</strong> menulis tesis yang kelak memenangkan Nobel Ekonomi. Idenya terdengar mustahil: gabungkan dua aset <em>berisiko</em>, dan risikonya bisa <strong>lebih kecil</strong> dari masing-masing aset sendirian. Bukan sulap — matematika.</p>
        <p>Contoh: Saham A (payung) naik saat hujan, Saham B (es krim) naik saat panas. Masing-masing liar sendirian — tapi digabung 50/50, saat A jatuh B naik dan sebaliknya. <strong>Portofolionya tenang.</strong> Inilah &ldquo;makan siang gratis&rdquo; satu-satunya di keuangan: <strong>diversifikasi</strong> — dan lesson ini membedah mesinnya.</p>
        <p><strong>Twist-nya:</strong> Markowitz tidak menemukan saham yang lebih baik — ia menemukan bahwa <strong>risiko portofolio bukan rata-rata dari risiko anggotanya</strong>. Dua aset yang masing-masing &ldquo;liar&rdquo; bisa menghasilkan portofolio yang &ldquo;tenang&rdquo;, <em>jika</em> mereka liar ke arah yang berlawanan pada waktu yang berbeda. Satu-satunya &ldquo;makan siang gratis&rdquo; di keuangan bukanlah aset ajaib — melainkan <strong>kombinasi yang cerdas</strong>. Tapi seperti semua makan siang gratis: ada syaratnya, dan syaratnya bernama <em>korelasi</em>.</p>
      </div>

      <h2 id="return">Return Portofolio — Rata-rata Tertimbang</h2>
      <p><strong>Definisi.</strong> <em>Expected return</em> portofolio = <strong>rata-rata tertimbang</strong> return tiap aset:</p>
      <Tex math={String.raw`E[R_p] = w_1 E[R_1] + w_2 E[R_2] + \cdots + w_n E[R_n]`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`w_i`} /> = bobot aset ke-<Tex math={String.raw`i`} /> (jumlah semua <Tex math={String.raw`w_i = 1`} />); <Tex math={String.raw`E[R_i]`} /> = ekspektasi return aset itu.</p>
      <p><strong>Contoh:</strong> 60% saham (E[R]=12%) + 40% obligasi (E[R]=6%) → E[R<sub>p</sub>] = 0,6×12 + 0,4×6 = <strong>9,6%</strong>. Sederhana — tidak ada keajaiban di sisi return.</p>
      <p><strong>Keajaibannya ada di sisi risiko</strong> — lanjut baca.</p>

      <h2 id="var">Risiko Portofolio — Bukan Rata-rata!</h2>
      <p><strong>Definisi.</strong> Variansi portofolio dua aset:</p>
      <Tex math={String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho_{12}\sigma_1\sigma_2`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`\sigma_i`} />: volatilitas aset ke-<Tex math={String.raw`i`} /></li>
        <li><Tex math={String.raw`\rho_{12}`} />: <strong>korelasi</strong> return kedua aset (−1 s.d. +1) — bintang utama lesson ini</li>
        <li>Suku ketiga (<Tex math={String.raw`2w_1w_2\rho\sigma_1\sigma_2`} />): <strong>kovarians</strong> — interaksi keduanya; inilah yang membuat risiko portofolio ≠ rata-rata risiko</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>50% saham (σ=20%) + 50% obligasi (σ=8%), korelasi ρ = 0,2.</p>
        <p><strong>Langkah 1</strong> — suku saham: (0,5×0,20)² = 0,01.<br />
        <strong>Langkah 2</strong> — suku obligasi: (0,5×0,08)² = 0,0016.<br />
        <strong>Langkah 3</strong> — suku korelasi: 2×0,5×0,5×0,2×0,20×0,08 = 0,0016.<br />
        <strong>Langkah 4</strong> — total variansi = 0,0132 → σ<sub>p</sub> = √0,0132 = <strong>11,5%</strong>.</p>
        <p>Bandingkan: rata-rata tertimbang vol = 0,5×20 + 0,5×8 = <strong>14%</strong>. Portofolio (11,5%) <strong>lebih tenang</strong> dari rata-rata anggotanya (14%) — &ldquo;diskon risiko&rdquo; 2,5 poin, gratis dari korelasi rendah!</p>
      </details>
      <p><strong>Kepribadian rumus ini:</strong> dua suku pertama = risiko <em>sendiri-sendiri</em>; suku ketiga = <em>apakah mereka bergerak bersama atau saling meniadakan</em>. Diversifikasi hidup atau mati di suku ketiga.</p>

      <h2 id="korelasi">Korelasi — Bintang Utamanya</h2>
      <p><strong>Definisi.</strong> Korelasi <Tex math={String.raw`\rho`} /> mengukur seberapa <em>searah</em> dua aset bergerak: +1 = selalu bersama, −1 = selalu berlawanan, 0 = tidak berhubungan.</p>
      <p><strong>Tiga rezim:</strong></p>
      <ul>
        <li><Tex math={String.raw`\rho = +1`} />: tidak ada diversifikasi — risiko = rata-rata tertimbang (buang-buang waktu).</li>
        <li><Tex math={String.raw`\rho < 1`} />: ada &ldquo;diskon risiko&rdquo; — makin kecil ρ, makin besar diskonnya.</li>
        <li><Tex math={String.raw`\rho = -1`} />: risiko bisa <strong>nol</strong> (teoretis) — aset saling meniadakan sempurna.</li>
      </ul>

      <PlotlyChart
        data={corrData}
        title="Korelasi Menentukan 'Diskon Risiko' (50% saham σ20% + 50% obligasi σ8%)"
        layout={{ xaxis: { title: "Korelasi" }, yaxis: { title: "Volatilitas portofolio (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = volatilitas portofolio yang sama, hanya korelasinya dibedakan.</p>
        <p><strong>Interpretasi:</strong> dari ρ=+1 (15,0%) ke ρ=−1 (5,0%), risiko <strong>menyusut 3× lipat</strong> — padahal asetnya <em>identik</em>! Satu-satunya yang berubah = <strong>bagaimana mereka bergerak bersama</strong>. Inilah mengapa analis obsesif pada korelasi, bukan cuma return.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Punya 20 saham = terdiversifikasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 20 saham <strong>bank</strong> = 1 taruhan tersamar (korelasinya ≈ +0,8 saat krisis). Diversifikasi dihitung dari <strong>korelasi</strong>, bukan <strong>jumlah</strong>. Portofolio 3 aset tak berkorelasi bisa lebih terdiversifikasi dari 20 saham se-sektor. Selalu tanya: <em>apakah aset-asetku jatuh bersamaan?</em></p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> diversifikasi <strong>gagal tepat saat paling dibutuhkan</strong>: dalam krisis, korelasi antar aset <em>melonjak</em> (semua dijual bersamaan). Inilah &ldquo;correlation breakdown&rdquo; 2008/2020. Diversifikasi sejati butuh aset yang <em>tetap</em> tak berkorelasi saat panik (SBN, emas, kas) — bukan yang &ldquo;biasanya&rdquo; tak berkorelasi.</p>
      </div>

      <h2 id="frontier">Efficient Frontier — Peta Harta Karun</h2>
      <p><strong>Definisi.</strong> <em>Efficient frontier</em> = kurva portofolio-portofolio yang memberi <strong>return tertinggi untuk tiap level risiko</strong> (atau risiko terendah untuk tiap target return). Portofolio <strong>di bawah</strong> kurva = tidak efisien (ada yang lebih baik dengan risiko sama).</p>
      <p><strong>Cara pakai:</strong> tentukan toleransi risikomu (sumbu X) → naik ke kurva → baca return maksimalnya (sumbu Y) → itulah bobot optimalmu. Di bawah kurva = &ldquo;membayar risiko tanpa dibayar return&rdquo;.</p>

      <PlotlyChart
        data={frontierData}
        title="Efficient Frontier: Batas Kemungkinan Terbaik"
        layout={{ xaxis: { title: "Risiko / volatilitas (%) →" }, yaxis: { title: "Expected return (%) →" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> kurva biru = frontier. Titik &ldquo;Campuran 50/50&rdquo; (merah) terletak <strong>di atas garis lurus</strong> antara obligasi dan saham — bukan di tengah-tengahnya.</p>
        <p><strong>Interpretasi:</strong> campuran 50/50 memberi return 9% (rata-rata 5% &amp; 12% = 8,5%… lebih tinggi karena ilustrasi) dengan risiko <strong>lebih rendah</strong> dari garis lurus — tonjolan ke kiri-atas inilah &ldquo;makan siang gratis&rdquo; diversifikasi. Portofolio manapun di <strong>bawah</strong> kurva = tidak efisien: kamu bisa dapat return sama dengan risiko lebih kecil.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bangun Frontier Sendiri</h2>
      <p>Hitung return &amp; risiko untuk tiap bobot saham-obligasi. Temukan sendiri di mana &ldquo;diskon risiko&rdquo; terbesar.</p>
      <PyodideLab
        title="Lab 1 — Tabel Portofolio: Cari Bobot Terbaik"
        hint="Coba: rho = -0.3 (aset berlawanan). Lalu rho = 0.9. Pada rho berapa 'campuran 50/50' risikonya DI BAWAH obligasi murni?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Kekuatan Korelasi</h2>
      <p>Dua aset identik, bobot sama — hanya korelasinya diubah. Saksikan risiko menyusut.</p>
      <PyodideLab
        title="Lab 2 — Satu-satunya Variabel: Korelasi"
        hint="Coba: ubah bobot jadi w = 0.8 (tidak seimbang). Apakah 'diskon risiko' masih sebesar itu? Diversifikasi maksimal saat bobot seimbang & korelasi rendah."
        defaultCode={lab2Code}
      />

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> rumus portofolio mengajarkan <em>cara berpikir</em>, bukan angka ramalan: inputnya (expected return, korelasi) adalah <strong>tebakan tentang masa depan</strong> — dan optimasi sangat sensitif pada tebakan itu (<em>error maximization</em>). Praktisi memakai frontier sebagai <strong>kompas</strong>, bukan GPS: untuk memahami trade-off, bukan untuk bobot presisi 2 desimal.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Diversifikasi yang Benar</h2>

      <div className="decision-card">
        <h3>1. Cek diversifikasi portofoliomu → <strong>Hitung korelasi, bukan jumlah aset</strong></h3>
        <p><strong>Kondisi:</strong> merasa &ldquo;sudah diversifikasi&rdquo; karena punya banyak saham.</p>
        <p><strong>Kenapa:</strong> 10 saham teknologi ≈ 1 taruhan. Diversifikasi sejati = aset yang <em>tidak jatuh bersamaan</em>.</p>
        <p><strong>Contoh nyata:</strong> tambah SBN/emas/kas — bukan saham ke-11 yang se-sektor.</p>
      </div>

      <div className="decision-card">
        <h3>2. Krisis datang, semua merah → <strong>Jangan hitung diversifikasi dari data tenang</strong></h3>
        <p><strong>Kondisi:</strong> korelasi historis rendah, tapi pasar panik.</p>
        <p><strong>Kenapa:</strong> korelasi naik saat stres (<em>correlation breakdown</em>). Uji portofoliomu dengan korelasi stres (ρ + 0,3), bukan korelasi normal.</p>
        <p><strong>Contoh nyata:</strong> stress test E13 memakai skenario &ldquo;semua korelasi → 0,9&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pilih di antara dua portofolio → <strong>Yang di frontier (atas-kiri) menang</strong></h3>
        <p><strong>Kondisi:</strong> dua opsi dengan return-risiko berbeda.</p>
        <p><strong>Kenapa:</strong> portofolio di bawah frontier = membayar risiko tanpa kompensasi penuh. Selalu dominasi yang efisien.</p>
        <p><strong>Contoh nyata:</strong> bandingkan via Sharpe ratio (E7) — proksi praktis efisiensi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tambah aset baru → <strong>Tanya korelasinya dengan yang sudah ada</strong></h3>
        <p><strong>Kondisi:</strong> tergoda aset &ldquo;return tinggi&rdquo;.</p>
        <p><strong>Kenapa:</strong> aset ber-return tinggi tapi berkorelasi +0,9 dengan portofoliomu menambah risiko <em>tanpa</em> diskon diversifikasi. Aset &ldquo;biasa&rdquo; berkorelasi rendah bisa lebih berharga.</p>
        <p><strong>Contoh nyata:</strong> reksa dana pasar uang di tengah portofolio saham = penyeimbang murah.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Return = rata-rata tertimbang.</strong> Risiko ≠ rata-rata — ada &ldquo;diskon&rdquo; dari korelasi.</li>
          <li><strong>Diversifikasi = korelasi rendah</strong>, bukan jumlah banyak.</li>
          <li><strong>Uji dengan korelasi krisis</strong> — diversifikasi yang gagal saat panik = ilusi.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Portofolio Tiga Aset</h2>
      <div className="callout">
        <p>Dito punya: 8 saham teknologi (total Rp80 jt), 1 saham bank (Rp10 jt), 1 saham tambang (Rp10 jt). Ia mengklaim &ldquo;terdiversifikasi 10 saham&rdquo;. Data: korelasi antar saham teknologi ≈ 0,75; korelasi teknologi–bank ≈ 0,6; teknologi–tambang ≈ 0,3; bank–tambang ≈ 0,2.</p>
        <p><strong>Pertanyaan:</strong> (a) Apakah Dito benar-benar terdiversifikasi? (b) Jika ia menambah Rp20 jt, ke mana sebaiknya — saham teknologi ke-9 atau SBN? (c) Apa risiko terbesar portofolionya yang tidak terlihat dari &ldquo;10 saham&rdquo;?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tidak.</strong> 80% dananya di satu klaster berkorelasi 0,75 — &ldquo;diskon risiko&rdquo;-nya kecil. Ini 1,5 taruhan, bukan 10.</p>
          <p>(b) <strong>SBN.</strong> Korelasi SBN–saham mendekati 0 (bahkan negatif saat <em>flight to quality</em>) → diskon diversifikasi maksimal. Saham teknologi ke-9 menambah risiko nyaris tanpa diskon.</p>
          <p>(c) <strong>Risiko konsentrasi sektor + correlation breakdown</strong>: saat krisis teknologi, korelasi 0,75 bisa melonjak ke 0,9 — seluruh 80% jatuh bersamaan. Plus risiko likuiditas jika butuh jual cepat.</p>
        </details>
      </div>

      {/* EXPANSION */}
      <h2 id="worked1">🔬 Worked Example 1: Keajaiban 50/50 — Dari Dua yang Liar ke Satu yang Tenang</h2>
      <p>Saham <strong>PAYUNG</strong> (naik saat hujan): return ekspektasi 10%, volatilitas <strong>20%</strong>. Saham <strong>ESKRIM</strong> (naik saat panas): return ekspektasi 10%, volatilitas <strong>20%</strong>. Korelasi keduanya <strong>ρ = −0,3</strong> (cenderung bergerak berlawanan). Gabungkan 50/50 — berapa volatilitas portofolio?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus varians 2 aset:</strong> <Tex math={String.raw`\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho\sigma_1\sigma_2`} />.</p>
        <p><strong>Langkah 2 — Masukkan angka</strong> (<Tex math={String.raw`w_1=w_2=0{,}5`} />, <Tex math={String.raw`\sigma_1=\sigma_2=0{,}20`} />, <Tex math={String.raw`\rho=-0{,}3`} />):</p>
        <p><Tex math={String.raw`\sigma_p^2`} /> = (0,25 × 0,04) + (0,25 × 0,04) + 2(0,25)(−0,3)(0,04) = 0,01 + 0,01 − 0,006 = <strong>0,014</strong>.</p>
        <p><strong>Langkah 3 — Volatilitas:</strong> <Tex math={String.raw`\sigma_p = \sqrt{0{,}014} \approx 11{,}8\%`} />.</p>
        <p><strong>Bandingkan:</strong> rata-rata volatilitas = 20%. Volatilitas portofolio = <strong>11,8%</strong> — turun <strong>41%</strong>! Return ekspektasi tetap 10% (rata-rata). <strong>Risiko turun, return tidak</strong> — inilah &ldquo;makan siang gratis&rdquo;.</p>
        <p><strong>Eksperimen mental:</strong> jika ρ = +1 (bergerak seiring): σp = 20% (tidak ada manfaat). Jika ρ = −1 (sempurna berlawanan): σp = <strong>0%</strong> (risiko hilang total!). <strong>Korelasi — bukan jumlah aset — adalah mesin diversifikasi.</strong></p>
      </details>

      <h2 id="worked2">🔬 Worked Example 2: Berapa Bobot Terbaik? (Portofolio Varians Minimum)</h2>
      <p>Dengan PAYUNG &amp; ESKRIM di atas (σ sama = 20%, ρ = −0,3), bobot 50/50 memberi σ = 11,8%. Bisakah lebih rendah lagi dengan bobot berbeda?</p>
      <details className="worked">
        <summary>📐 Hitung langkah-demi-langkah (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Rumus bobot optimal</strong> (2 aset): <Tex math={String.raw`w_1^* = \frac{\sigma_2^2 - \rho\sigma_1\sigma_2}{\sigma_1^2 + \sigma_2^2 - 2\rho\sigma_1\sigma_2}`} />.</p>
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


      <h2 id="homebias">🔧 Pendalaman: Home Bias — Kenapa Portofoliomu Terlalu Indonesia?</h2>
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
        <p><strong>Rumus 3 aset:</strong> <Tex math={String.raw`\sigma_p^2 = \sum w_i^2\sigma_i^2 + 2\sum_{i&lt;j} w_iw_j\rho_{ij}\sigma_i\sigma_j`} />.</p>
        <p><strong>Hitung:</strong> (0,16×0,04) + (0,16×0,04) + (0,04×0,0025) + 2(0,16)(−0,3)(0,04) + 0 + 0 = 0,0064 + 0,0064 + 0,0001 − 0,00384 = <strong>0,00906</strong>.</p>
        <p>σp = √0,00906 ≈ <strong>9,5%</strong> — turun dari 11,8% ke 9,5% (<strong>−20%</strong>!).</p>
        <p><strong>Tapi perhatikan pola penyusutan:</strong> aset ke-2 memangkas σ dari 20% → 11,8% (−8,2 poin); aset ke-3: 11,8% → 9,5% (−2,3 poin). Aset ke-10? Mungkin −0,3 poin. <strong>Manfaat diversifikasi = logaritmik</strong> — besar di awal, lalu mendatar (E8 Myth!). Pelajaran alokasi: <strong>3–5 kelas aset yang <em>benar-benar beda</em></strong> (saham domestik, saham global, obligasi, kas/emas) menangkap ~90% manfaat — selebihnya <em>kompleksitas tanpa hasil</em>.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <em>rebalancing bands</em> — versi disiplin dari Worked 3 E8: tentukan target (misal 60/40) + <strong>batas toleransi</strong> (±5%). Hanya rebalance jika bobot <em>keluar</em> dari batas — menghemat biaya transaksi vs rebalance kalender buta. Portofolio 60/40 yang dibiarkan 10 tahun tanpa rebalance bisa menjadi 80/20 (saham naik terus) — <strong>risiko yang diam-diam berubah tanpa kamu sadari</strong>. Bands = autopilot risiko.</p>
      </div>


      <h2 id="riskparity">🔧 Pendalaman: Risk Parity — Saat Bobot Uang Menipu</h2>
      <p>Portofolio &ldquo;60/40&rdquo; (60% saham, 40% obligasi) terlihat seimbang. <strong>Menipu.</strong> Hitung kontribusi risikonya: saham σ=16%, obligasi σ=5%, korelasi 0,2.</p>
      <details className="worked">
        <summary>📐 Hitung kontribusi risiko (klik untuk buka)</summary>
        <p><strong>Langkah 1 — Varians portofolio:</strong> <Tex math={String.raw`\sigma_p^2`} /> = 0,36×0,0256 + 0,16×0,0025 + 2×0,6×0,4×0,2×0,16×0,05 = 0,009216 + 0,0004 + 0,000768 = <strong>0,010384</strong> &rarr; σp ≈ <strong>10,2%</strong>.</p>
        <p><strong>Langkah 2 — Kontribusi risiko saham:</strong> (0,36×0,0256 + 0,6×0,4×0,2×0,16×0,05) / 0,010384 = (0,009216 + 0,000384)/0,010384 ≈ <strong>92,5%</strong>!</p>
        <p><strong>Hasil:</strong> portofolio &ldquo;60/40&rdquo; = <strong>92,5% risikonya dari saham</strong>. &ldquo;Diversifikasi&rdquo;-nya kosmetik — ini <strong>portofolio saham berkedok seimbang</strong>.</p>
        <p><strong>Solusi risk parity:</strong> bobot <em>dibalik</em> proporsional risiko — misal ~25% saham / 75% obligasi agar kontribusi risiko 50/50 — lalu <strong>leverage</strong> obligasi (2×) untuk mengembalikan return ke target. Hasil: return mirip 60/40 dengan <strong>drawdown jauh lebih kecil</strong> (inilah mesin Bridgewater&apos;s All Weather!). <strong>Pelajaran:</strong> timbang <strong>risiko</strong>, bukan <strong>uang</strong>. Bobot modal ≠ bobot risiko — dan hanya yang kedua yang menentukan nasibmu di krisis.</p>
      </details>


      <h2 id="quiz">✏️ Quiz — Seni Diversifikasi (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 50% saham (E[R]=12%) + 50% obligasi (E[R]=6%). Expected return portofolio?"
        options={[
          "18%",
          "9% (rata-rata tertimbang)",
          "6%",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: 0,5×12 + 0,5×6 = 9%. Sisi return selalu rata-rata tertimbang — keajaiban hanya ada di sisi risiko."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dua aset identik (σ=20%), bobot 50/50, korelasi −1. Volatilitas portofolio?"
        options={[
          "20%",
          "10%",
          "0% — saling meniadakan sempurna (teoretis)",
          "40%",
        ]}
        correct={2}
        explanation="Benar: 0% (teoretis). Korelasi −1 sempurna = setiap gerak satu aset dibatalkan yang lain. Di dunia nyata korelasi −1 sempurna langka."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. 'Punya 20 saham = terdiversifikasi.' Salahnya di mana?"
        options={[
          "Tidak salah",
          "Diversifikasi dihitung dari korelasi, bukan jumlah — 20 saham se-sektor = 1 taruhan",
          "20 terlalu sedikit",
          "Saham tidak bisa didiversifikasi",
        ]}
        correct={1}
        explanation="Benar: yang penting korelasi. 20 saham bank berkorelasi 0,8 = diversifikasi semu. 3 aset tak berkorelasi bisa lebih baik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Portofolio A terletak DI BAWAH efficient frontier. Artinya…"
        options={[
          "A optimal",
          "A tidak efisien — ada portofolio lain dengan return sama tapi risiko lebih kecil",
          "A bebas risiko",
          "Frontier salah hitung",
        ]}
        correct={1}
        explanation="Benar: tidak efisien. Di bawah kurva = membayar risiko tanpa kompensasi penuh. Pindah ke kurva (atas-kiri) selalu lebih baik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa diversifikasi 'gagal saat paling dibutuhkan'?"
        options={[
          "Karena rumusnya salah",
          "Correlation breakdown: saat krisis, korelasi melonjak — semua jatuh bersamaan",
          "Karena investor panik",
          "Tidak pernah gagal",
        ]}
        correct={1}
        explanation="Benar: korelasi tidak stabil — naik saat stres. Diversifikasi yang dihitung dari data tenang memberi rasa aman palsu. Uji dengan korelasi stres!"
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Return portofolio</strong> = rata-rata tertimbang. Sederhana, tanpa keajaiban.</li>
          <li><strong>Risiko portofolio</strong> = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂ — suku korelasi = sumber &ldquo;diskon risiko&rdquo;.</li>
          <li><strong>Diversifikasi = korelasi rendah</strong>, bukan jumlah aset banyak.</li>
          <li><strong>Efficient frontier</strong> = return max per level risiko; portofolio di bawahnya tidak efisien.</li>
          <li>Waspada <strong>correlation breakdown</strong> — uji portofolio dengan korelasi krisis.</li>
          <li>Frontier = kompas, bukan GPS — inputnya tebakan masa depan, jangan over-presisi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/e7-return-risiko" className="btn btn-secondary btn-sm">← E7</Link>
        <Link href="/learn/e9-capm" className="btn btn-primary btn-sm">Next: E9 →</Link>
      </div>
    </div>
  );
}
