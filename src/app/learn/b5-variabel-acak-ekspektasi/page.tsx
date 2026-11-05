import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B5VariabelAcakEkspektasiPage() {
  const chart1 = [{"x": ["0", "100"], "y": [0.5, 0.5], "type": "bar", "name": "pmf", "marker": {"color": "#2a7de1"}, "text": ["50%", "50%"], "textposition": "outside"}, {"x": [50], "y": [0.55], "type": "scatter", "mode": "markers", "name": "E[X]=50", "marker": {"color": "#e8a838", "size": 14, "symbol": "diamond"}}];
  const chart2 = [{"x": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], "y": [0, 100, 400, 900, 1600, 2500, 3600, 4900, 6400, 8100, 10000], "type": "scatter", "mode": "lines", "name": "f(x) = x² (cembung)", "line": {"color": "#e8a838"}}, {"x": [0, 100], "y": [0, 10000], "type": "scatter", "mode": "lines", "name": "garis lurus (linear)", "line": {"color": "#94a3b8", "dash": "dash"}}];
  const lab1Code = String.raw`import random
random.seed(2026)
N_POLIS, PREMI, KLAIM, P = 1000, 1_000_000, 100_000_000, 0.005
E_untung = N_POLIS * (PREMI - P * KLAIM)
print(f"Ekspektasi untung/tahun = Rp{E_untung/1e6:.0f} juta")
print()
rugi = 0
for th in range(1, 31):
    n_klaim = sum(random.random() < P for _ in range(N_POLIS))
    untung = N_POLIS * PREMI - n_klaim * KLAIM
    flag = "  <-- RUGI" if untung < 0 else ""
    if untung < 0: rugi += 1
    print(f"Tahun {th:>2}: {n_klaim:>2} klaim, untung Rp{untung/1e6:+7.0f} jt{flag}")
print(f"\nTahun rugi: {rugi}/30 meski ekspektasi untung tiap tahun!")
print("Coba: P=0.008. Berapa tahun rugi? (ekspektasi masih untung?)")`;
  const lab2Code = String.raw`import random, statistics
random.seed(8)
N = 200000
# X: 0 (50%) atau 100 (50%)
xs = [0 if random.random() < 0.5 else 100 for _ in range(N)]
mean = statistics.mean(xs)
E_x2 = statistics.mean([x**2 for x in xs])
print(f"E[X]     = {mean:.1f}")
print(f"(E[X])^2  = {mean**2:.0f}")
print(f"E[X^2]   = {E_x2:.0f}")
print(f"Selisih   = {E_x2 - mean**2:.0f}  (= Var(X)! cek: {statistics.pvariance(xs):.0f})")
print()
print("Selisih E[X^2]-(E[X])^2 PERSIS = Var(X). Itulah rumus varians cepat.")
print("Coba: ganti distribusi jadi dadu 1-6. Masih berlaku?")`;
  const quizData = [{"question": "E[X] = 3,5 untuk dadu. Artinya…", "options": ["Lemparan berikutnya 3,5", "Rata-rata dari sangat banyak lemparan → 3,5", "3,5 paling sering muncul", "Setengah lemparan di atas 3,5"], "correct": 1, "explanation": "Benar: ekspektasi = rata-rata jangka panjang (LLN, B11). 3,5 bahkan tidak pernah muncul sebagai hasil."}, {"question": "Linearitas E[X+Y] = E[X]+E[Y] berlaku…", "options": ["Hanya jika independen", "Hanya jika identik", "Selalu, bahkan jika berkorelasi", "Tidak pernah"], "correct": 2, "explanation": "Benar: selalu. Ini sifat terkuat ekspektasi — dan alasan EL portofolio bisa dijumlah."}, {"question": "Var(X+Y) = Var(X)+Var(Y) + 2Cov(X,Y). Jika Cov positif besar…", "options": ["Varians total lebih kecil", "Varians total lebih besar — diversifikasi gagal", "Tidak ada efek", "Ekspektasi berubah"], "correct": 1, "explanation": "Benar: korelasi positif menggembungkan varians — matematika di balik &ldquo;semua jatuh bareng saat krisis&rdquo;."}, {"question": "X = 0/100 masing-masing 50%. E[X²] vs (E[X])²:", "options": ["Sama = 2500", "E[X²]=5000 > 2500 — Jensen", "E[X²]=2500 < 5000", "Tidak terdefinisi"], "correct": 1, "explanation": "Benar: 5000 > 2500. Fungsi x² cembung → E[f(X)] > f(E[X]). Selisihnya = Var(X)."}, {"question": "Mengapa model &ldquo;skenario rata-rata&rdquo; meremehkan risiko jika loss cembung?", "options": ["Karena rata-rata selalu salah", "Jensen: E[loss] > loss(E[kejadian])", "Karena varians nol", "Tidak meremehkan"], "correct": 1, "explanation": "Benar: Jensen — ekspektasi dari fungsi cembung lebih besar dari fungsi di titik rata-rata. Harus pakai distribusi penuh/Monte Carlo."}, {"question": "Huruf kapital X vs kecil x: yang benar…", "options": ["Sama saja", "X = variabel acak, x = nilai teramati", "X = konstanta", "x = ekspektasi"], "correct": 1, "explanation": "Benar: P(X=x) = peluang variabel acak X bernilai x. Notasi ini mencegah kebingungan di rumus-rumus."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B5 — Probabilitas</span>
        <h1 className="display-title">Variabel Acak &amp; Ekspektasi:<br/>Rata-rata yang Menipu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Asuransi yang &ldquo;Pasti Untung&rdquo;?</a></li>
          <li><a href="#rv">Variabel Acak — Angka yang Belum Pasti</a></li>
          <li><a href="#ekspek">Ekspektasi — Rata-rata Tertimbang Peluang</a></li>
          <li><a href="#var">Varians — Seberapa Liar di Sekitar Ekspektasi</a></li>
          <li><a href="#jensen">Ketaksamaan Jensen — Rata-rata dari Fungsi ≠ Fungsi dari Rata-rata</a></li>
          <li><a href="#lab1">🔬 Lab 1: Ekspektasi Asuransi — Jangka Panjang vs Satu Tahun</a></li>
          <li><a href="#lab2">🔬 Lab 2: Buktikan Jensen dengan Simulasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Ekspektasi, Varians, atau Distribusi Penuh?</a></li>
          <li><a href="#case">📋 Mini-Case: Pricing Premi yang Adil (dan Selamat)</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Mendefinisikan <strong>variabel acak</strong> dan membedakan diskret vs kontinu.</li><li>Menghitung <strong>ekspektasi</strong> <Tex math={String.raw`E[X]`} /> dan menjelaskan mengapa ia &ldquo;rata-rata jangka panjang&rdquo;, bukan &ldquo;nilai yang akan terjadi&rdquo;.</li><li>Menghitung <strong>varians</strong> <Tex math={String.raw`Var(X)`} /> dan memakai sifat linearitas ekspektasi.</li><li>Menjelaskan <strong>ketaksamaan Jensen</strong> — mengapa rata-rata dari fungsi ≠ fungsi dari rata-rata (penting untuk risiko!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Asuransi yang &ldquo;Pasti Untung&rdquo;?</h2>

      <div className="story"><p>Perusahaan asuransi menjual 1.000 polis. Tiap polis: premi Rp1 juta, klaim Rp100 juta dengan peluang 0,5%. Ekspektasi klaim per polis = 0,005 × 100 jt = <strong>Rp500 ribu</strong>. Premi 1 jt &gt; 500 rb — <em>&ldquo;pasti untung Rp500 ribu per polis!&rdquo;</em> kata direksi.</p><p>Tapi tahun itu klaim datang 12x (bukan 5x) — perusahaan rugi. Tahun lain cuma 1x — untung besar. <strong>Ekspektasi bukan janji tahunan; ia rata-rata dari banyak tahun.</strong> Dan ada yang lebih dalam: <em>varians</em> menentukan apakah perusahaan selamat sampai &ldquo;jangka panjang&rdquo; itu tiba.</p><p>Variabel acak + ekspektasi + varians = bahasa untuk semua model risiko (EL = PD × LGD × EAD tidak lain adalah ekspektasi!).</p><p><strong>Twist-nya:</strong> premi Rp1 juta &gt; ekspektasi klaim Rp500 ribu — aritmetikanya sempurna, perusahaannya bisa bangkrut. Ekspektasi menjawab &ldquo;rata-rata dari 1.000 tahun&rdquo;, tapi perusahaan hanya butuh <em>satu</em> tahun buruk untuk mati sebelum &ldquo;jangka panjang&rdquo; itu tiba. Yang menyelamatkan bukan ekspektasi — melainkan <strong>modal</strong>, yang besarnya ditentukan <em>varians</em>.</p></div>

      <h2 id="rv">Variabel Acak — Angka yang Belum Pasti</h2>

      <p><strong>Definisi.</strong> Variabel acak (<Tex math={String.raw`X`} />) adalah <strong>fungsi</strong> yang memetakan tiap hasil ruang sampel ke bilangan real. Bukan &ldquo;variabel yang acak&rdquo; — melainkan <em>nilai numerik dari kejadian acak</em>.</p>

      <p><strong>Contoh.</strong> <Tex math={String.raw`X`} /> = jumlah &ldquo;angka&rdquo; dari 2 lemparan koin: <Tex math={String.raw`X(AA)=2,\ X(AG)=X(GA)=1,\ X(GG)=0`} />.</p>

      <ul>
<li><strong>Diskret:</strong> nilai terhitung (0,1,2,…) — jumlah gagal bayar, jumlah klaim. Punya <strong>pmf</strong> <Tex math={String.raw`p(x) = P(X=x)`} />.</li>
<li><strong>Kontinu:</strong> nilai di interval — waktu tunggu, return saham. Punya <strong>pdf</strong> <Tex math={String.raw`f(x)`} /> (peluang = luas di bawah kurva; P(X=tepat 5,0) = 0!).</li>
</ul>

      <p><strong>Kepribadian:</strong> variabel acak adalah &ldquo;pelempar dadu yang sudah diberi label angka&rdquo; — ia mengubah kejadian kualitatif menjadi angka sehingga bisa dihitung rata-ratanya.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Notasi: huruf kapital <Tex math={String.raw`X`} /> = variabel acak (belum diketahui), huruf kecil <Tex math={String.raw`x`} /> = nilai konkret yang teramati. <Tex math={String.raw`P(X=x)`} /> dibaca &ldquo;peluang X bernilai x&rdquo;. Konsisten dengan notasi ini = separuh kebingungan hilang.</p>
</div>

      <h2 id="ekspek">Ekspektasi — Rata-rata Tertimbang Peluang</h2>

      <p><Tex math={String.raw`E[X] = \sum_x x \cdot P(X=x)`} block /></p>

      <ul>
<li><Tex math={String.raw`x`} />: tiap nilai yang mungkin</li>
<li><Tex math={String.raw`P(X=x)`} />: bobot peluangnya</li>
</ul>

      <p><strong>Interpretasi:</strong> persis <strong>weighted mean</strong> (A1.2) dengan peluang sebagai bobot! Dan secara operasional = <strong>rata-rata dari sangat banyak pengulangan</strong> (ini dibuktikan B11/LLN).</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Dadu adil, <Tex math={String.raw`X`} /> = mata dadu:</p><p><Tex math={String.raw`E[X] = 1\cdot\tfrac16 + 2\cdot\tfrac16 + \cdots + 6\cdot\tfrac16 = \tfrac{21}{6} = 3{,}5`} />.</p><p>Perhatikan: <strong>3,5 tidak pernah muncul</strong> di dadu! Ekspektasi bukan &ldquo;nilai yang akan terjadi&rdquo; — ia pusat gravitasi distribusi. Inilah &ldquo;rata-rata yang menipu&rdquo; jika disalahartikan sebagai prediksi.</p>
</details>

      <h3>Sifat super: linearitas ekspektasi</h3>

      <p><Tex math={String.raw`E[aX + bY + c] = a\,E[X] + b\,E[Y] + c`} block /></p>

      <p><strong>Berlaku SELALU</strong> — bahkan jika <Tex math={String.raw`X,Y`} /> tidak independen, bahkan jika berkorelasi! Inilah mengapa EL portofolio = Σ EL tiap kredit (B13 memakai ini). <strong>Tidak ada sifat sekuat ini untuk varians</strong> (lihat bawah).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Ekspektasi = nilai yang paling mungkin terjadi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Ekspektasi 3,5 dadu tidak pernah muncul; ekspektasi klaim Rp500 ribu tidak berarti klaim &ldquo;tipikal&rdquo; Rp500 ribu (klaim aktual: 0 atau 100 jt!). Yang &ldquo;paling mungkin&rdquo; adalah <strong>modus</strong> distribusi. Ekspektasi = pusat gravitasi, bukan prediksi kejadian tunggal.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Untuk keputusan bisnis, pasangkan ekspektasi dengan varians (atau distribusi penuh). &ldquo;Ekspektasi untung 500 rb&rdquo; tanpa varians = setengah cerita — seperti mean tanpa SD (A1.3).</p>
</div>

      <h2 id="var">Varians — Seberapa Liar di Sekitar Ekspektasi</h2>

      <p><Tex math={String.raw`\mathrm{Var}(X) = E\big[(X - E[X])^2\big] = E[X^2] - (E[X])^2`} block /></p>

      <ul>
<li><Tex math={String.raw`E[X^2] - (E[X])^2`} />: rumus hitung cepat (bukti satu baris dari linearitas).</li>
<li><Tex math={String.raw`\sigma = \sqrt{\mathrm{Var}(X)}`} />: standar deviasi — kembali ke satuan asli.</li>
</ul>

      <p><strong>Contoh.</strong> Dadu: <Tex math={String.raw`E[X^2] = (1+4+9+16+25+36)/6 = 91/6`} />, <Tex math={String.raw`\mathrm{Var}(X) = \tfrac{91}{6} - 3{,}5^2 = \tfrac{35}{12} \approx 2{,}92`} />, σ ≈ 1,71.</p>

      <p><strong>Sifat varians</strong> (tidak selinier ekspektasi!):</p>

      <p><Tex math={String.raw`\mathrm{Var}(aX + b) = a^2\,\mathrm{Var}(X)`} block /></p>

      <p><Tex math={String.raw`\mathrm{Var}(X+Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2\,\mathrm{Cov}(X,Y)`} block /></p>

      <p>Independen → kovarians 0 → varians jumlah = jumlah varians. <strong>Tapi</strong> jika berkorelasi positif, varians meledak — inilah matematika di balik &ldquo;diversifikasi gagal saat krisis&rdquo; (B9/B10).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Varians jumlah selalu = jumlah varians.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika tidak berkorelasi! Rumus lengkap punya suku <Tex math={String.raw`2\,\mathrm{Cov}(X,Y)`} />. Mengabaikannya = mengabaikan risiko korelasi — dosa klasik pra-2008. Diversifikasi bekerja <em>karena</em> kovarians rendah/negatif.</p>
</div>

      <h2 id="jensen">Ketaksamaan Jensen — Rata-rata dari Fungsi ≠ Fungsi dari Rata-rata</h2>

      <p>Untuk fungsi <strong>cembung</strong> (<Tex math={String.raw`f`} /> melengkung ke atas, misal <Tex math={String.raw`x^2,\ e^x`} />):</p>

      <p><Tex math={String.raw`E[f(X)] \geq f(E[X])`} block /></p>

      <p>(Untuk cekung/∩, tanda berbalik.) <strong>Contoh konkret:</strong> <Tex math={String.raw`X`} /> = &#123;0 dengan p=1/2, 100 dengan p=1/2&#125;. <Tex math={String.raw`E[X]=50`} />. Tapi <Tex math={String.raw`E[X^2] = 5000`} /> sedangkan <Tex math={String.raw`(E[X])^2 = 2500`} /> — <strong>2x lipat!</strong></p>

      <p><strong>Mengapa penting untuk risiko?</strong> Kerugian (loss) adalah fungsi <strong>cembung</strong> dari kejadian buruk — Jensen bilang <em>ekspektasi kerugian ≥ kerugian dari ekspektasi kejadian</em>. Model yang hanya memakai &ldquo;skenario rata-rata&rdquo; <strong>sistematis meremehkan</strong> risiko. Inilah argumen matematis untuk stress testing &amp; distribusi penuh, bukan point forecast.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tes cepat Jensen: jika fungsinya melengkung (cembung/cekung), jangan pernah &ldquo;masukkan rata-rata ke fungsi&rdquo;. Hitung ekspektasi dari <em>distribusinya</em>. Aturan ini menjelaskan mengapa opsi (payoff cembung) berharga mahal saat volatilitas tinggi.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Ekspektasi 50 yang Tidak Pernah Terjadi"
  layout={{"xaxis": {"title": "X (klaim, juta Rp)"}, "yaxis": {"title": "Peluang"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang = distribusi X (klaim 0 atau 100 jt, masing-masing 50%); berlian kuning = ekspektasi 50.</p>
<p><strong>Interpretasi:</strong> Ekspektasi (50) jatuh di <strong>lembah kosong</strong> — tidak ada hasil yang bernilai 50. Visual ini = inti &ldquo;rata-rata yang menipu&rdquo;: ekspektasi adalah pusat gravitasi, bukan prediksi. Untuk keputusan (premi, cadangan), yang relevan adalah seluruh distribusi + varians.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Jensen: Fungsi Cembung di Atas Garis Lurus"
  layout={{"xaxis": {"title": "x"}, "yaxis": {"title": "f(x)"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kurva kuning = x² (cembung); garis putus-putus = fungsi linear. Pada x=50, kurva di atas garis.</p>
<p><strong>Interpretasi:</strong> Karena melengkung ke atas, rata-rata dari f(X) (titik-titik di kurva) selalu ≥ f(rata-rata X) (garis). <strong>Implikasi risiko:</strong> jika kerugian cembung terhadap guncangan, memakai &ldquo;guncangan rata-rata&rdquo; meremehkan ekspektasi kerugian — harus integrasikan seluruh distribusi (atau Monte Carlo, B12).</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Siapkan kalkulator — ekspektasi dikuasai lewat angka, bukan definisi.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Lotre — ekspektasi vs harga tiket</summary>
              <p>Tiket Rp10.000. Hadiah: Rp5 juta (peluang 1/100.000), Rp100 ribu (peluang 1/1.000), sisanya nol. Layak dibeli?</p>
              <p><strong>Langkah 1</strong> — E[hadiah] = 5.000.000×(1/100.000) + 100.000×(1/1.000) + 0 = 50 + 100 = <strong>Rp150</strong>.<br />
              <strong>Langkah 2</strong> — bandingkan: harga Rp10.000 vs ekspektasi Rp150 — tiket &ldquo;bernilai&rdquo; 1,5% dari harganya.<br />
              <strong>Langkah 3</strong> — E[untung] = 150 − 10.000 = <strong>−Rp9.850</strong> per tiket.</p>
              <p>Pelajaran: lotre = pajak atas orang yang tidak menghitung ekspektasi. (Variansnya astronomis — itulah yang dijual: mimpi, bukan nilai.)</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Dua dadu — E[jumlah] via linearitas</summary>
              <p>X, Y = dua dadu independen. Hitung E[X+Y] dan Var(X+Y) — dua cara: langsung dan via sifat.</p>
              <p><strong>Langkah 1</strong> — E[X] = E[Y] = 3,5 (dadu). Linearitas: E[X+Y] = 3,5 + 3,5 = <strong>7</strong>. (Tanpa linearitas: 36 outcome dijumlah satu per satu!)<br />
              <strong>Langkah 2</strong> — Var(X) = 35/12 ≈ 2,917 (dihitung di lesson). Independen → Cov = 0.<br />
              <strong>Langkah 3</strong> — Var(X+Y) = 35/12 + 35/12 = 35/6 ≈ <strong>5,833</strong>; SD ≈ 2,415.<br />
              <strong>Langkah 4</strong> — cek: jika X=Y (dadu yang sama dipakai dua kali — korelasi sempurna!), Var(2X) = 4×35/12 = 35/3 ≈ 11,67 — <strong>dua kali lipat</strong>! Inilah harga korelasi.</p>
              <p>Pelajaran: linearitas ekspektasi menghemat 36 perhitungan; rumus varians mengingatkan bahwa &ldquo;dua dadu&rdquo; ≠ &ldquo;satu dadu dihitung dua kali&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Jensen di asuransi — mengapa &ldquo;rata-rata klaim&rdquo; menipu</summary>
              <p>Klaim per polis: Rp0 (99%) atau Rp100 juta (1%). Fungsi biaya perusahaan cembung: jika total klaim &gt; Rp2 miliar, ada denda Rp500 juta (likuiditas). Sederhanakan: 100 polis. Bandingkan &ldquo;biaya dari ekspektasi&rdquo; vs &ldquo;ekspektasi biaya&rdquo;.</p>
              <p><strong>Langkah 1</strong> — E[klaim per polis] = 1 juta. Total ekspektasi = Rp100 juta &lt; 2 miliar → &ldquo;biaya dari ekspektasi&rdquo; = 0 denda.<br />
              <strong>Langkah 2</strong> — tapi P(total &gt; 2 miliar) = P(≥21 klaim dari 100, p=1%) ≈ kecil tapi &gt; 0 (Binomial, B6.1!).<br />
              <strong>Langkah 3</strong> — E[biaya] = P(≥21)×500 jt &gt; 0 = &ldquo;biaya dari ekspektasi&rdquo;. Jensen: E[f(X)] &gt; f(E[X]).</p>
              <p>Pelajaran: model &ldquo;skenario rata-rata&rdquo; memberi jawaban NOL untuk risiko yang nyata. Inilah dosa yang diulang tiap krisis: mengganti distribusi dengan rata-ratanya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Ekspektasi Asuransi — Jangka Panjang vs Satu Tahun</h2>

      <p>Simulasi 1.000 polis/tahun selama 30 tahun. Premi 1 jt, klaim 100 jt (p=0,5%). Lihat tahun-tahun rugi meski ekspektasi untung.</p>

      <PyodideLab
  title="Lab 1 — Kapan &amp;ldquo;Pasti Untung&amp;rdquo; Gagal"
  hint="Naikkan P sampai ekspektasi mendekati nol. Rasakan: &lt;strong>varians&lt;/strong> yang menentukan selamat/tidaknya perusahaan, bukan cuma ekspektasi."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Buktikan Jensen dengan Simulasi</h2>

      <p>Simulasi membuktikan ketaksamaan Jensen: E[X²] &gt; (E[X])² untuk X acak non-degenerat.</p>

      <PyodideLab
  title="Lab 2 — E[X²] vs (E[X])²"
  hint="Identitas E[X²]−(E[X])² = Var(X) adalah jembatan hitung cepat varians — hafalkan."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Ekspektasi, Varians, atau Distribusi Penuh?</h2>

      <div className="decision-card">
<h3>1. Butuh &ldquo;rata-rata jangka panjang&rdquo; → <strong>ekspektasi</strong></h3>
<p><strong>Kondisi data:</strong> Banyak pengulangan independen: premi asuransi, EL portofolio besar.</p>
<p><strong>Kenapa:</strong> Linearitas: E[total] = Σ E[bagian] — selalu benar, bahkan jika berkorelasi.</p>
<p><strong>Contoh nyata:</strong> EL = Σ PD×LGD×EAD per fasilitas (B13).</p>
</div>

      <div className="decision-card">
<h3>2. Butuh &ldquo;seberapa liar&rdquo; → <strong>varians/SD</strong></h3>
<p><strong>Kondisi data:</strong> Satu periode bisa jauh dari ekspektasi; ada batas toleransi rugi.</p>
<p><strong>Kenapa:</strong> Varians mengukur risiko di sekitar ekspektasi — tanpa ini, &ldquo;untung 500 rb&rdquo; tak bermakna.</p>
<p><strong>Contoh nyata:</strong> Modal asuransi disiapkan dari varians klaim, bukan dari ekspektasi.</p>
</div>

      <div className="decision-card">
<h3>3. Fungsi cembung/cekung (opsi, utilitas, loss) → <strong>Jensen: jangan colok rata-rata</strong></h3>
<p><strong>Kondisi data:</strong> Payoff non-linear terhadap variabel acak.</p>
<p><strong>Kenapa:</strong> E[f(X)] ≠ f(E[X]) — selisihnya bisa 2x lipat atau lebih.</p>
<p><strong>Contoh nyata:</strong> Harga opsi naik dengan volatilitas (bukan cuma harga rata-rata).</p>
</div>

      <div className="decision-card">
<h3>4. Keputusan satu kejadian / ekor ekstrem → <strong>distribusi penuh</strong></h3>
<p><strong>Kondisi data:</strong> Yang penting bukan rata-rata melainkan P(rugi &gt; X) — VaR, stress test.</p>
<p><strong>Kenapa:</strong> Ekspektasi + varians tidak menangkap bentuk ekor (butuh B7/B16).</p>
<p><strong>Contoh nyata:</strong> &ldquo;Berapa peluang rugi &gt; Rp10 M tahun ini?&rdquo; — butuh distribusi, bukan mean.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Ekspektasi menjawab &ldquo;rata-rata jika diulang banyak&rdquo; — bukan &ldquo;yang akan terjadi&rdquo;.</li><li>Varians jumlah = jumlah varians <strong>+ 2×kovarians</strong> — jangan lupakan suku terakhir.</li><li>Fungsi melengkung → Jensen: hitung dari distribusi, jangan colok rata-rata.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Pricing Premi yang Adil (dan Selamat)</h2>

      <div className="callout">
<p>Asuransi mikro: 5.000 nasabah, klaim Rp20 juta dengan peluang 1%/tahun. Biaya operasional Rp50 ribu/polis.</p><p><strong>Pertanyaan:</strong> (a) Premi minimum agar ekspektasi impas? (b) Mengapa premi aktual harus lebih tinggi? (c) Apa peran varians di sini?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) E[klaim] = 0,01 × 20 jt = <strong>Rp200 ribu</strong>. Impas ekspektasi: premi = 200 rb + 50 rb = <strong>Rp250 ribu</strong>.</p><p>(b) Karena <strong>satu tahun buruk bisa membunuh perusahaan</strong> sebelum &ldquo;jangka panjang&rdquo; tiba. Premi aktual = 250 rb + <em>risk loading</em> (buffer modal) + margin. Risk loading dihitung dari varians/ekor distribusi klaim — bukan dari ekspektasi.</p><p>(c) SD klaim per polis = √(0,01×0,99)×20 jt ≈ Rp1,99 jt — <strong>10x ekspektasinya!</strong> Untuk 5.000 polis independen, SD total = √5000 × 1,99 jt ≈ Rp141 jt vs ekspektasi total Rp1 M. Rasio inilah yang menentukan buffer modal. (Diversifikasi: makin banyak polis, rasio SD/mean makin kecil — akar dari hukum bilangan besar, B11.)</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Investasi: 60% peluang untung Rp10 juta, 40% peluang rugi Rp5 juta. Berapa ekspektasi untung? Jika ada biaya masuk Rp2 juta, layak diambil?</li>
              <li>X: P(X=1)=0,5; P(X=2)=0,3; P(X=3)=0,2. Hitung E[X], E[X²], dan Var(X) via rumus cepat.</li>
              <li>Fungsi f(x) = √x (cekung). X = 0 atau 100 masing-masing 50%. Bandingkan E[f(X)] vs f(E[X]). Sesuai Jensen untuk fungsi cekung?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> E = 0,6×10 + 0,4×(−5) = 6 − 2 = <strong>Rp4 juta</strong>. Setelah biaya: 4 − 2 = <strong>Rp2 juta &gt; 0 → layak</strong> (secara ekspektasi; varians tetap perlu dicek untuk ukuran posisi!).</p>
              <p><strong>2.</strong> E[X] = 1×0,5+2×0,3+3×0,2 = 0,5+0,6+0,6 = <strong>1,7</strong>. E[X²] = 1×0,5+4×0,3+9×0,2 = 0,5+1,2+1,8 = <strong>3,5</strong>. Var = 3,5 − 1,7² = 3,5 − 2,89 = <strong>0,61</strong>.</p>
              <p><strong>3.</strong> E[f(X)] = 0,5×0 + 0,5×10 = <strong>5</strong>. f(E[X]) = √50 ≈ <strong>7,07</strong>. E[f(X)] &lt; f(E[X]) — <strong>sesuai Jensen untuk fungsi cekung</strong> (tanda berbalik dari cembung). Contoh: utilitas kekayaan yang cekung → risk aversion.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Variabel acak:</strong> angka dari kejadian acak; diskret (pmf) vs kontinu (pdf).</li><li><strong>Ekspektasi</strong> = rata-rata tertimbang peluang = rata-rata jangka panjang; linearitas selalu berlaku.</li><li><strong>Varians</strong> = E[(X−E[X])²]; varians jumlah memuat kovarians — jangan lupakan.</li><li><strong>Jensen:</strong> fungsi cembung → E[f(X)] ≥ f(E[X]) — jangan colok rata-rata ke fungsi melengkung.</li><li><strong>Jangan</strong> tafsirkan ekspektasi sebagai prediksi kejadian tunggal.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b4-bayes" className="btn btn-secondary btn-sm">← ← B4</Link>
        <Link href="/learn/b6-distribusi-diskret-1" className="btn btn-primary btn-sm">Next: B6.1 →</Link>
      </div>
    </div>
  );
}
