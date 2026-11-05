import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B3PeluangBersyaratPage() {
  const chart1 = [{"x": ["Lancar (80%)", "Telat 1–30 (15%)", "Telat >30 (5%)", "Portofolio (total)"], "y": [0.02, 0.1, 0.35, 0.0485], "type": "bar", "marker": {"color": ["#34a853", "#e8a838", "#ef4444", "#2a7de1"]}, "text": ["2%", "10%", "35%", "4,85%"], "textposition": "outside"}];
  const chart2 = [{"x": ["P(Gagal)", "P(Gagal|Telat 30h)", "P(Telat 30h|Gagal)"], "y": [0.05, 0.35, 0.7], "type": "bar", "marker": {"color": ["#94a3b8", "#e8a838", "#2a7de1"]}, "text": ["5%", "35%", "70%"], "textposition": "outside"}];
  const lab1Code = String.raw`import random
random.seed(21)
N = 200000
cnt12 = cnt_gt8 = cnt12_gt8 = 0
for _ in range(N):
    d = random.randint(1,6) + random.randint(1,6)
    if d == 12: cnt12 += 1
    if d > 8:
        cnt_gt8 += 1
        if d == 12: cnt12_gt8 += 1
print(f"P(jumlah=12)          = {cnt12/N:.4f}  (teori 1/36 = 0.0278)")
print(f"P(jumlah=12 | jum>8)  = {cnt12_gt8/cnt_gt8:.4f}  (teori 1/10 = 0.1000)")
print()
print("Syarat memangkas dunia dari 36 hasil -> 10 hasil (9,10,11,12).")
print("Di dunia baru, peluang 12 naik 3.6x lipat!")
print("Coba: ganti syarat jadi jumlah > 10. Berapa dunia barunya?")`;
  const lab2Code = String.raw`# Pohon: mulai dari "telat 1-30"
# Cabang 1: kembali lancar (0.60) -> P(gagal)=0
# Cabang 2: roll ke 31-60 (0.30) -> P(gagal|31-60)=0.50
# Cabang 3: langsung gagal (0.10) -> P(gagal)=1
p_gagal = 0.60*0 + 0.30*0.50 + 0.10*1
print(f"P(gagal | telat 1-30) = {p_gagal:.2%}")
print()
print("Ini hukum peluang total: jumlahkan (bobot cabang x peluang bersyarat).")
print("Coba: jika P(gagal|31-60) naik jadi 0.70, berapa P(gagal|telat 1-30)?")
print("Coba: tambah cabang baru di bawah 31-60 (roll ke 61-90).")`;
  const quizData = [{"question": "P(gagal | telat 30 hari) = 35% artinya…", "options": ["35% nasabah telat 30 hari", "Di antara nasabah telat 30 hari, 35% gagal", "35% nasabah gagal", "Telat 30 hari menyebabkan 65% gagal"], "correct": 1, "explanation": "Benar: &ldquo;di antara yang telat&rdquo; — dunia menyusut ke bucket telat. Bukan 35% dari semua nasabah."}, {"question": "P(A|B) = 35% dan P(B|A) = 70%. Mana untuk memprediksi risiko nasabah yang telat?", "options": ["P(B|A) = 70%", "P(A|B) = 35%", "Keduanya sama", "Tidak ada yang benar"], "correct": 1, "explanation": "Benar: given-nya adalah &ldquo;telat&rdquo; (informasi yang kita punya) → P(gagal|telat). 70% adalah arah diagnostik."}, {"question": "Hukum peluang total P(A) = Σ P(Bi)P(A|Bi) pada dasarnya adalah…", "options": ["Rata-rata tertimbang", "Aturan komplemen", "Permutasi", "Independensi"], "correct": 0, "explanation": "Benar: bobot P(Bi) × peluang bersyarat — sama seperti weighted mean di A1.2."}, {"question": "Dua kartu As berurutan tanpa pengembalian: 4/52 × 3/51. Suku 3/51 adalah…", "options": ["P(As pertama)", "P(As kedua | As pertama)", "P(As pertama | As kedua)", "P(keduanya As)"], "correct": 1, "explanation": "Benar: setelah satu As keluar, tersisa 3 As dari 51 kartu — peluang bersyarat."}, {"question": "Kapan P(A|B) > P(A)?", "options": ["Tidak pernah", "Selalu", "Jika B berkorelasi positif dengan A", "Jika A dan B independen"], "correct": 2, "explanation": "Benar: syarat yang &ldquo;kabar baik/buruk&rdquo; menggeser peluang. Jika independen, P(A|B) = P(A) — informasi tidak mengubah apa-apa."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B3 — Probabilitas</span>
        <h1 className="display-title">Peluang Bersyarat:<br/>Informasi Mengubah Peluang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Telat 30 Hari&rdquo; Mengubah Segalanya</a></li>
          <li><a href="#definisi">Definisi — Dunia yang Menyusut</a></li>
          <li><a href="#kali">Aturan Perkalian Umum — &ldquo;Dan&rdquo; Tanpa Asumsi Independen</a></li>
          <li><a href="#total">Hukum Peluang Total — Pecah via Partisi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Dua Dadu, Given Jumlah &gt; 8</a></li>
          <li><a href="#lab2">🔬 Lab 2: Pohon Roll-Rate Kredit</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Pakai Rumus Mana</a></li>
          <li><a href="#case">📋 Mini-Case: Prioritas Collection</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menghitung <Tex math={String.raw`P(A|B)`} /> dari definisi dan menginterpretasikannya sebagai &ldquo;dunia yang menyusut&rdquo;.</li><li>Menerapkan aturan perkalian umum <Tex math={String.raw`P(A \cap B) = P(A)P(B|A)`} /> untuk kejadian berurutan yang tidak independen.</li><li>Menggunakan <strong>hukum peluang total</strong> untuk memecah masalah via partisi.</li><li>Membedakan <Tex math={String.raw`P(A|B)`} /> vs <Tex math={String.raw`P(B|A)`} /> — kesalahan paling mahal di analitik.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Telat 30 Hari&rdquo; Mengubah Segalanya</h2>

      <div className="story"><p>Bank punya 10.000 nasabah. Secara umum, peluang gagal bayar 5% — terdengar kecil. Tapi pagi ini sistem menandai satu nasabah: <strong>telat bayar 30 hari</strong>. Tiba-tiba peluang gagal bayarnya bukan 5% lagi, melainkan <strong>35%</strong>.</p><p>Apa yang berubah? Bukan nasabahnya — <em>informasi kita</em> yang bertambah. Peluang bersyarat <Tex math={String.raw`P(\text{gagal} \mid \text{telat 30 hari})`} /> menjawab: <em>di dunia di mana kita tahu dia telat 30 hari</em>, berapa peluang dia gagal? Dunia (ruang sampel) menyusut dari &ldquo;semua nasabah&rdquo; menjadi &ldquo;nasabah yang telat 30 hari&rdquo; — dan di dunia yang lebih kecil itu, proporsi gagal jauh lebih besar.</p><p>Inilah jantung collection analytics, roll rate, dan seluruh B4 (Bayes).</p><p><strong>Twist-nya:</strong> 5% menjadi 35% — padahal nasabahnya tidak berubah sama sekali. Yang berubah hanya <em>pengetahuan kita</em>. Peluang bukan sifat benda, melainkan sifat pengetahuan tentang benda itu: dua analis dengan informasi berbeda boleh memegang dua angka berbeda untuk nasabah yang sama — dan keduanya benar. Inilah mengapa &ldquo;update saat info datang&rdquo; adalah separuh ilmu risiko.</p></div>

      <h2 id="definisi">Definisi — Dunia yang Menyusut</h2>

      <p><Tex math={String.raw`P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0`} block /></p>

      <ul>
<li><Tex math={String.raw`P(A|B)`} />: peluang A terjadi <em>dengan syarat</em> B sudah terjadi/dianggap terjadi</li>
<li><Tex math={String.raw`P(A \cap B)`} />: peluang keduanya terjadi</li>
<li><Tex math={String.raw`P(B)`} />: peluang syaratnya — sekaligus &ldquo;ukuran dunia baru&rdquo;</li>
</ul>

      <p><strong>Intuisi:</strong> syarat <Tex math={String.raw`B`} /> memangkas ruang sampel menjadi hanya hasil-hasil di <Tex math={String.raw`B`} />. Di dunia baru itu, peluang <Tex math={String.raw`A`} /> = proporsi <Tex math={String.raw`A`} /> di dalam <Tex math={String.raw`B`} />.</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>100 nasabah: 20 telat 30 hari (T), dan 7 di antaranya akhirnya gagal (G ∩ T).</p><p><strong>Langkah 1</strong> — identifikasi: yang ditanya <Tex math={String.raw`P(G|T)`} /> (&ldquo;given telat&rdquo;).</p><p><strong>Langkah 2</strong> — <Tex math={String.raw`P(G \cap T) = 7/100`} />, <Tex math={String.raw`P(T) = 20/100`} />.</p><p><strong>Langkah 3</strong> — <Tex math={String.raw`P(G|T) = \frac{7/100}{20/100} = \frac{7}{20} = 35\%`} />.</p><p>Bandingkan: P(G) umum = 5%, tapi P(G|T) = 35%. <strong>Informasi mengubah peluang 7x lipat.</strong></p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Baca <Tex math={String.raw`P(A|B)`} /> sebagai &ldquo;di antara kejadian B, berapa proporsi yang juga A?&rdquo;. Kata &ldquo;given&rdquo;/&ldquo;jika diketahui&rdquo;/&ldquo;di antara yang&rdquo; adalah sinyal soal bersyarat.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;<Tex math={String.raw`P(A|B)`} /> selalu sama dengan <Tex math={String.raw`P(B|A)`} />.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> P(gagal | telat 30 hari) = 35%, tapi P(telat 30 hari | gagal) bisa 70% — beda total! Yang pertama untuk <em>prediksi</em> (given sinyal, berapa risiko?), yang kedua untuk <em>diagnosis</em> (given gagal, seberapa umum sinyalnya?). Tertukar = keputusan terbalik. Analis risiko hidup dari bedanya.</p>
</div>

      <h2 id="kali">Aturan Perkalian Umum — &ldquo;Dan&rdquo; Tanpa Asumsi Independen</h2>

      <p><Tex math={String.raw`P(A \cap B) = P(A) \times P(B|A)`} block /></p>

      <p>Ini versi jujur dari aturan perkalian B1: tidak butuh asumsi independen. <strong>Contoh:</strong> P(2 kartu As berurutan tanpa pengembalian) = <Tex math={String.raw`\frac{4}{52} \times \frac{3}{51}`} /> — suku kedua adalah <Tex math={String.raw`P(\text{As}_2 \mid \text{As}_1)`} />.</p>

      <p><strong>Kepribadian:</strong> aturan ini adalah &ldquo;rantai sebab-akibat&rdquo; — peluang gabungan = peluang langkah pertama × peluang langkah kedua <em>given</em> langkah pertama terjadi. Pohon peluang (di bawah) adalah visualnya.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Gambar <strong>pohon peluang</strong>: tiap cabang = syarat, tiap ranting = peluang bersyarat. Peluang satu jalur = kali sepanjang jalur. Pohon mengubah soal berurutan yang membingungkan menjadi perkalian mekanis.</p>
</div>

      <h2 id="total">Hukum Peluang Total — Pecah via Partisi</h2>

      <p><Tex math={String.raw`P(A) = \sum_{i} P(B_i)\,P(A|B_i)`} block /></p>

      <ul>
<li><Tex math={String.raw`B_i`} />: partisi — kejadian-kejadian yang saling lepas dan mencakup semua kemungkinan (misal DPD bucket: lancar / 1–30 / 31–60 / &gt;60)</li>
<li><Tex math={String.raw`P(B_i)`} />: bobot tiap kelompok</li>
<li><Tex math={String.raw`P(A|B_i)`} />: peluang A di dalam tiap kelompok</li>
</ul>

      <p><strong>Contoh.</strong> Portofolio: 80% lancar (PD 2%), 15% telat 1–30 (PD 10%), 5% telat &gt;30 (PD 35%). PD portofolio = 0,8×0,02 + 0,15×0,10 + 0,05×0,35 = 0,016+0,015+0,0175 = <strong>4,85%</strong>.</p>

      <p><strong>Interpretasi:</strong> ini <strong>rata-rata tertimbang</strong> dari peluang bersyarat — menghubungkan B3 ke weighted mean (A1.2)! Setiap bucket menyumbang sesuai bobotnya.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Peluang bersyarat selalu lebih kecil dari peluang umum.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Bisa lebih besar (35% &gt; 5% di cerita pembuka) atau lebih kecil. Syarat bisa <em>menaikkan</em> maupun <em>menurunkan</em> peluang — tergantung apakah syaratnya berkorelasi positif atau negatif dengan kejadian. &ldquo;Diberi info&rdquo; ≠ &ldquo;peluang menyusut&rdquo;.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="PD per Bucket vs PD Portofolio (Hukum Peluang Total)"
  layout={{"yaxis": {"title": "Peluang gagal bayar", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tiga batang pertama = PD bersyarat tiap bucket DPD; batang biru = PD portofolio (rata-rata tertimbang).</p>
<p><strong>Interpretasi:</strong> PD portofolio 4,85% <strong>tidak sama</strong> dengan PD bucket manapun — ia rata-rata tertimbang. Bucket kecil (5%) tapi PD 35% menyumbang 1,75 poin, hampir sama dengan bucket lancar 80% (1,6 poin). <strong>Pelajaran:</strong> jangan kelola portofolio dengan satu angka rata-rata; kelola per bucket.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="P(A|B) ≠ P(B|A): Tiga Angka, Tiga Makna"
  layout={{"yaxis": {"title": "Peluang", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang 1 = peluang umum gagal; batang 2 = given telat, berapa yang gagal (prediksi); batang 3 = given gagal, berapa yang dulu telat (diagnosis).</p>
<p><strong>Interpretasi:</strong> Tiga angka beda jauh dari data yang sama. Tertukar = bencana: memakai 70% (diagnostik) sebagai &ldquo;peluang gagal&rdquo; untuk nasabah telat akan membuatmu overestimasi 2x lipat. <strong>Selalu tanya: given-nya apa?</strong></p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Perhatikan bagaimana &ldquo;dunia menyusut&rdquo; di tiap langkah.</p>

            <details className="worked">
              <summary>📐 Kasus 1: P(gagal | telat 30 hari), dari tabel</summary>
              <p>10.000 nasabah: 500 gagal bayar. Dari yang gagal, 280 pernah telat 30+ hari. Dari yang tidak gagal (9.500), 520 pernah telat 30+ hari. Seorang nasabah telat 30 hari — berapa peluang ia gagal?</p>
              <p><strong>Langkah 1</strong> — duniamu sekarang: hanya nasabah yang telat 30+ hari = 280 + 520 = <strong>800</strong> orang.<br />
              <strong>Langkah 2</strong> — di dunia itu, yang gagal = <strong>280</strong>.<br />
              <strong>Langkah 3</strong> — P(gagal|telat) = 280/800 = <strong>0,35 = 35%</strong>.<br />
              <strong>Langkah 4</strong> — bandingkan: P(gagal) umum = 500/10.000 = 5%. Informasi &ldquo;telat 30 hari&rdquo; menaikkan peluang 7× lipat.</p>
              <p>Pelajaran: peluang bersyarat = &ldquo;proporsi di dunia yang menyusut&rdquo;. Rumus P(A|B) = P(A∩B)/P(B) hanyalah versi formal dari &ldquo;280 dari 800&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Aturan perkalian — kartu merah lalu king</summary>
              <p>Dari 52 kartu diambil 2 <em>tanpa pengembalian</em>. Berapa peluang kartu pertama merah DAN kedua king?</p>
              <p><strong>Langkah 1</strong> — P(merah pertama) = 26/52 = 1/2.<br />
              <strong>Langkah 2</strong> — <em>diberi</em> pertama merah, sisa 51 kartu dengan 2 king merah? Hati-hati: king yang tersisa = 4 king − (1 jika king merah terambil). Lebih aman: P(king kedua | merah pertama) = 4/51? Bukan — karena &ldquo;merah pertama&rdquo; tidak memberi tahu king/tidaknya. Gunakan partisi: P = P(merah∩king) = P(pertama king merah)×1 + … — cara termudah: simetri! Peluang &ldquo;pertama merah, kedua king&rdquo; = (26 × 4)/(52 × 51) = 104/2652 = <strong>26/663 ≈ 3,92%</strong>.<br />
              <strong>Langkah 3</strong> — cek via aturan perkalian: P(merah₁) × P(king₂|merah₁) = (1/2) × (4/51) = 4/102 = 2/51 ≈ 3,92%. Sama. (P(king₂|merah₁) = 4/51 karena dari 51 sisa kartu, 4 king — info &ldquo;merah&rdquo; tidak mengubah jumlah king tersisa.)</p>
              <p>Pelajaran: &ldquo;tanpa pengembalian&rdquo; = dunia menyusut tiap pengambilan. Aturan perkalian umum menangani dependensi ini secara eksak.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Hukum peluang total — P(gagal) dari dua segmen</summary>
              <p>Portofolio: 70% nasabah &ldquo;lancar&rdquo; (P(gagal|lancar) = 2%), 30% &ldquo;pernah telat&rdquo; (P(gagal|telat) = 12%). Berapa P(gagal) keseluruhan?</p>
              <p><strong>Langkah 1</strong> — partisi: &lbrace;lancar, telat&rbrace; saling lepas &amp; mencakup semua.<br />
              <strong>Langkah 2</strong> — P(gagal) = P(gagal|lancar)P(lancar) + P(gagal|telat)P(telat) = 0,02×0,7 + 0,12×0,3 = 0,014 + 0,036 = <strong>0,05 = 5%</strong>.<br />
              <strong>Langkah 3</strong> — baca hasilnya: segmen kecil (30%) menyumbang 0,036/0,05 = <strong>72%</strong> dari seluruh gagal bayar! Inilah mengapa collection memprioritaskan segmen telat.</p>
              <p>Pelajaran: hukum peluang total = &ldquo;rata-rata tertimbang peluang per segmen&rdquo;. Ia juga jembatan menuju Bayes (B4): pembilang 0,036 vs penyebut 0,05 akan muncul lagi.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Dua Dadu, Given Jumlah &gt; 8</h2>

      <p>Simulasi: lempar dua dadu. Hitung P(jumlah=12) vs P(jumlah=12 | jumlah &gt; 8). Lihat bagaimana syarat mengubah peluang.</p>

      <PyodideLab
  title="Lab 1 — Dunia Menyusut"
  hint="Ubah syaratnya (misal jumlah genap). Kapan syarat &lt;em>menurunkan&lt;/em> peluang?"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Pohon Roll-Rate Kredit</h2>

      <p>Nasabah telat 1–30 hari: 60% kembali lancar, 30% roll ke 31–60, 10% langsung gagal. Dari yang roll ke 31–60: 50% gagal. Hitung P(gagal | mulai telat 1–30) via pohon.</p>

      <PyodideLab
  title="Lab 2 — Roll Rate via Hukum Peluang Total"
  hint="Ubah angka-angka pohon sesuai data cabangmu. Pohon ini = inti &lt;strong>roll-rate analysis&lt;/strong> di collection."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Pakai Rumus Mana</h2>

      <div className="decision-card">
<h3>1. Soal menyebut &ldquo;jika diketahui / given / di antara&rdquo; → <strong>definisi bersyarat</strong></h3>
<p><strong>Kondisi data:</strong> Ada informasi baru yang memangkas ruang sampel.</p>
<p><strong>Kenapa:</strong> P(A|B) = P(A∩B)/P(B): bagi dengan &ldquo;ukuran dunia baru&rdquo;.</p>
<p><strong>Contoh nyata:</strong> P(gagal | telat 30 hari) = 7/20 = 35%.</p>
</div>

      <div className="decision-card">
<h3>2. Kejadian berurutan &amp; tidak independen → <strong>perkalian umum</strong></h3>
<p><strong>Kondisi data:</strong> Langkah kedua bergantung pada langkah pertama (tanpa pengembalian, rantai).</p>
<p><strong>Kenapa:</strong> P(A∩B) = P(A)×P(B|A) — rantai pohon peluang.</p>
<p><strong>Contoh nyata:</strong> Dua kartu As berurutan: 4/52 × 3/51.</p>
</div>

      <div className="decision-card">
<h3>3. Banyak kelompok/jalur → <strong>hukum peluang total</strong></h3>
<p><strong>Kondisi data:</strong> Populasi terbagi ke bucket (DPD, segmen, region) dengan peluang beda.</p>
<p><strong>Kenapa:</strong> P(A) = Σ bobot × P(A|bucket) — rata-rata tertimbang peluang bersyarat.</p>
<p><strong>Contoh nyata:</strong> PD portofolio dari PD per bucket DPD.</p>
</div>

      <div className="decision-card">
<h3>4. Mau &ldquo;membalik&rdquo; arah: dari P(B|A) ke P(A|B) → <strong>Bayes (B4)</strong></h3>
<p><strong>Kondisi data:</strong> Punya data diagnostik tapi butuh prediksi (atau sebaliknya).</p>
<p><strong>Kenapa:</strong> Butuh base rate P(A) — tidak bisa dibalik tanpa itu.</p>
<p><strong>Contoh nyata:</strong> Dari &ldquo;70% yang gagal dulu telat&rdquo; ke &ldquo;nasabah telat, berapa peluang gagal?&rdquo;.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Temukan kata <strong>given</strong>-nya dulu — itulah penyebutmu.</li><li><Tex math={String.raw`P(A|B)`} /> vs <Tex math={String.raw`P(B|A)`} />: tulis dengan kata-kata (&ldquo;given telat, berapa gagal&rdquo;) sebelum angka.</li><li>Banyak jalur → gambar pohon, kali sepanjang jalur, jumlahkan jalur yang relevan.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Prioritas Collection</h2>

      <div className="callout">
<p>Tim collection punya 1.000 akun telat. Kapasitas hanya 200 akun untuk ditelepon intensif minggu ini. Data historis:</p><ul><li>Telat 1–30: 700 akun, P(gagal|bucket) = 8%</li><li>Telat 31–60: 200 akun, P(gagal|bucket) = 25%</li><li>Telat 61–90: 100 akun, P(gagal|bucket) = 55%</li></ul><p><strong>Pertanyaan:</strong> (a) Berapa ekspektasi gagal bayar total (gunakan hukum peluang total)? (b) Jika hanya bisa telepon 200 akun, bucket mana yang diprioritaskan dan mengapa?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Ekspektasi = 700×0,08 + 200×0,25 + 100×0,55 = 56 + 50 + 55 = <strong>161 akun</strong>. (Ekspektasi = jumlah × peluang — detail di B5.)</p><p>(b) <strong>Telat 61–90 dulu (100 akun), lalu 100 dari bucket 31–60.</strong> Alasan: P(gagal|bucket) tertinggi = &ldquo;risiko per telepon&rdquo; tertinggi. Ini <em>risk-based prioritization</em>: alokasikan kapasitas ke peluang bersyarat terbesar, bukan ke bucket terbesar. Menelpon 200 akun acak hanya menyelamatkan ~32 (16%), strategi bucket menyelamatkan ~68.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Dua dadu adil. Diketahui jumlahnya &gt; 8. Berapa peluang jumlahnya tepat 11?</li>
              <li>Kotak berisi 3 bola merah, 2 biru. Diambil 2 tanpa pengembalian. Berapa peluang keduanya merah?</li>
              <li>60% transaksi via mobile (P(fraud|mobile) = 0,8%), 40% via web (P(fraud|web) = 0,3%). Berapa P(fraud) keseluruhan? Segmen mana penyumbang fraud terbesar?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Dunia menyusut: jumlah &gt; 8 = &lbrace;9,10,11,12&rbrace; dengan 4+3+2+1 = 10 outcome. Yang berjumlah 11: 2 outcome (5+6, 6+5). Jawaban: <strong>2/10 = 20%</strong>. (Bukan 2/36 — penyebutnya dunia yang menyusut!)</p>
              <p><strong>2.</strong> P(merah₁) × P(merah₂|merah₁) = (3/5) × (2/4) = 6/20 = <strong>30%</strong>.</p>
              <p><strong>3.</strong> P(fraud) = 0,008×0,6 + 0,003×0,4 = 0,0048 + 0,0012 = <strong>0,6%</strong>. Mobile menyumbang 0,0048/0,006 = <strong>80%</strong> fraud — fokuskan kontrol ke mobile.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong><Tex math={String.raw`P(A|B)`} /> = proporsi A di dalam dunia B</strong> — informasi memangkas ruang sampel.</li><li><strong>Jangan tertukar</strong> <Tex math={String.raw`P(A|B)`} /> vs <Tex math={String.raw`P(B|A)`} /> — prediksi vs diagnosis.</li><li><strong>Perkalian umum:</strong> <Tex math={String.raw`P(A\cap B) = P(A)P(B|A)`} /> — rantai pohon, tanpa asumsi independen.</li><li><strong>Hukum peluang total:</strong> pecah per bucket, lalu rata-rata tertimbang.</li><li><strong>Jangan</strong> pakai peluang umum untuk keputusan individual — selalu cari peluang bersyarat yang relevan.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b2-kombinatorik" className="btn btn-secondary btn-sm">← ← B2</Link>
        <Link href="/learn/b4-bayes" className="btn btn-primary btn-sm">Next: B4 →</Link>
      </div>
    </div>
  );
}
