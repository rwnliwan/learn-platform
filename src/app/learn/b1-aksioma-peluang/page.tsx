import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B1AksiomaPeluangPage() {
  const chart1 = [{"x": ["atau (tambah)", "dan (kali, independen)", "komplemen"], "y": [0.42, 0.0025, 0.95], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#34a853"]}, "text": ["0,42", "0,0025", "0,95"], "textposition": "outside"}];
  const chart2 = [{"x": [10, 50, 100, 500, 1000, 5000, 10000], "y": [0.6, 0.54, 0.47, 0.512, 0.498, 0.501, 0.5003], "type": "scatter", "mode": "lines+markers", "name": "Frekuensi relatif angka", "line": {"color": "#2a7de1"}}, {"x": [10, 10000], "y": [0.5, 0.5], "type": "scatter", "mode": "lines", "name": "Peluang teoretis 0,5", "line": {"color": "#e8a838", "dash": "dash"}}];
  const dchart3 = [{"x": ["P(A)", "P(B)", "irisan"], "y": [0.3, 0.2, 0.08], "type": "bar", "marker": {"color": "#2a7de1"}}];
  const lab1Code = String.raw`import random
random.seed(42)

def frek(n):
    angka = sum(random.random() < 0.5 for _ in range(n))
    return angka / n

for n in [10, 100, 1000, 10000, 100000]:
    print(f"n={n:>7}  frekuensi angka = {frek(n):.4f}")

print()
print("Coba: ganti 0.5 jadi 0.7 (koin tidak adil).")
print("Coba: seed(42) dihapus — hasil berubah tiap run, tapi tetap -> 0.5.")`;
  const lab2Code = String.raw`import random
random.seed(7)
N = 200000
# kartu: (warna, angka); warna 0=hitam,1=merah; angka 1..13 (13=king)
deck = [(w, a) for w in [0,1] for a in range(1,14)]

merah_atau_king = sum(1 for _ in range(N) if (lambda c: c[0]==1 or c[1]==13)(random.choice(deck)))
print(f"Simulasi P(merah atau king) = {merah_atau_king/N:.4f}")
print(f"Rumus benar  = {28/52:.4f}  (26/52 + 4/52 - 2/52)")
print(f"Asal tambah = {30/52:.4f}  (26/52 + 4/52) <- SALAH, irisan dihitung 2x")
print()
print("Selisihnya kecil di sini, tapi di portofolio 10.000 nasabah,")
print("kesalahan seperti ini = ratusan nasabah salah klasifikasi.")`;
  const quizData = [{"question": "Ruang sampel lempar dua koin yang benar adalah…", "options": ["{AA, AG, GA, GG}", "{0 angka, 1 angka, 2 angka}", "{AA, GG}", "{angka, gambar}"], "correct": 0, "explanation": "Benar: 4 hasil equally likely. {0,1,2} angka salah karena tidak equally likely — P(1 angka)=1/2, bukan 1/3."}, {"question": "P(merah atau king) dari 52 kartu = 28/52. Kesalahan &ldquo;asal tambah&rdquo; (30/52) terjadi karena…", "options": ["King merah dihitung dua kali", "Kartu merah terlalu banyak", "King bukan kartu", "52 bukan ruang sampel"], "correct": 0, "explanation": "Benar: 2 king merah ada di kedua kejadian — irisan harus dikurangi sekali (aturan penjumlahan umum)."}, {"question": "Mana pasangan yang SALING LEPAS tapi TIDAK independen?", "options": ["Koin pertama angka & koin kedua angka", "Dadu 1 & dadu 6", "Hujan hari ini & hujan besok", "Lulus & tidak lulus ujian"], "correct": 3, "explanation": "Benar: tidak bisa lulus dan tidak lulus sekaligus (saling lepas), dan terjadinya satu membuat yang lain mustahil — sangat tidak independen."}, {"question": "Peluang 10 nasabah independen (PD 5%) tidak ada yang gagal adalah 0,95^10 ≈ 60%. Maka P(minimal satu gagal) = …", "options": ["5% × 10 = 50%", "1 − 0,60 = 40%", "0,05^10", "Tidak bisa dihitung"], "correct": 1, "explanation": "Benar: aturan komplemen — 1 − P(tidak ada). Jauh lebih mudah dari menjumlah 10 suku."}, {"question": "Setelah 5x gagal beruntun, peluang berhasil berikutnya (independen, p=10%) adalah…", "options": ["Lebih dari 10% — sudah jatuh tempo", "Tetap 10%", "Kurang dari 10%", "50%"], "correct": 1, "explanation": "Benar: independen = sejarah tidak mengubah peluang. Yang berubah hanya jika ada mekanisme penghubung."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B1 — Probabilitas</span>
        <h1 className="display-title">Peluang: Tiga Aturan<br/>yang Mengatur Ketidakpastian</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;5% Gagal Bayar&rdquo; Itu Artinya Apa?</a></li>
          <li><a href="#ruang">Ruang Sampel &amp; Kejadian — Panggungnya Dulu</a></li>
          <li><a href="#aksioma">Tiga Aksioma Kolmogorov — Konstitusi Peluang</a></li>
          <li><a href="#aturan">Tiga Aturan Turunan yang Dipakai Tiap Hari</a></li>
          <li><a href="#indep">&ldquo;Independen&rdquo; vs &ldquo;Saling Lepas&rdquo; — Jangan Tertukar!</a></li>
          <li><a href="#lab1">🔬 Lab 1: Koin 10.000x — Melihat Peluang Bekerja</a></li>
          <li><a href="#lab2">🔬 Lab 2: Aturan &ldquo;Atau&rdquo; vs Asal Tambah</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Tambah, Kali, atau Komplemen?</a></li>
          <li><a href="#case">📋 Mini-Case: &ldquo;99,4%&rdquo; yang Mengejutkan Direksi</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Mendefinisikan ruang sampel dan kejadian, lalu menghitung peluang klasik <Tex math={String.raw`P(A) = n(A)/n(S)`} />.</li><li>Menerapkan tiga aksioma peluang dan aturan komplemen, penjumlahan, dan perkalian.</li><li>Membedakan <strong>independen</strong> vs <strong>saling lepas</strong> — dua konsep yang paling sering tertukar.</li><li>Menghitung peluang gabungan dengan benar (tidak asal tambah atau asal kali).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;5% Gagal Bayar&rdquo; Itu Artinya Apa?</h2>

      <div className="story"><p>Risk manager bank mengumumkan: <em>&ldquo;Peluang gagal bayar portofolio kita 5%.&rdquo;</em> Direksi mengangguk tenang. Tapi analis junior bertanya: <em>&ldquo;Artinya dari 100 nasabah, pasti 5 yang gagal bayar?&rdquo;</em></p><p>Jawabannya <strong>tidak</strong>. Peluang 5% bukan janji bahwa tepat 5 dari 100 akan gagal. Artinya: jika pola yang sama diulang berkali-kali dalam kondisi sama, <strong>dalam jangka panjang</strong> sekitar 5% yang gagal — tapi 100 nasabah konkret berikutnya bisa 2, bisa 9, bisa 0. Peluang mengatur <em>ketidakpastian</em>, bukan meramal satu kejadian.</p><p>Lesson ini membangun fondasinya: tiga aturan sederhana yang mengatur seluruh teori peluang — dari dadu sampai model risiko kredit.</p><p><strong>Twist-nya:</strong> angka 5% itu benar secara matematis — tapi &ldquo;5%&rdquo; tanpa menyebut <em>dari populasi apa, dalam kondisi apa</em> adalah angka yatim. Peluang selalu &ldquo;peluang DARI sesuatu&rdquo; (ruang sampel). Direksi yang tenang karena &ldquo;cuma 5%&rdquo; sebenarnya tenang karena angka yang tidak ia pahami — dan tiga aksioma di lesson ini adalah cara memastikan angka itu punya arti.</p></div>

      <h2 id="ruang">Ruang Sampel &amp; Kejadian — Panggungnya Dulu</h2>

      <p><strong>Definisi.</strong> <strong>Ruang sampel</strong> (<Tex math={String.raw`S`} />) adalah himpunan semua hasil yang mungkin. <strong>Kejadian</strong> (<Tex math={String.raw`A`} />) adalah himpunan bagian dari <Tex math={String.raw`S`} /> yang kita minati.</p>

      <p><strong>Contoh.</strong> Lempar satu dadu: <Tex math={String.raw`S = \{1,2,3,4,5,6\}`} />. Kejadian &ldquo;muncul genap&rdquo;: <Tex math={String.raw`A = \{2,4,6\}`} />.</p>

      <p><strong>Peluang klasik</strong> (semua hasil equally likely):</p>

      <p><Tex math={String.raw`P(A) = \frac{n(A)}{n(S)}`} block /></p>

      <ul>
<li><Tex math={String.raw`n(A)`} />: banyak hasil yang termasuk kejadian <Tex math={String.raw`A`} /></li>
<li><Tex math={String.raw`n(S)`} />: banyak seluruh hasil yang mungkin</li>
</ul>

      <p><strong>Contoh langkah-demi-langkah.</strong> Peluang dadu muncul &gt; 4: <Tex math={String.raw`A=\{5,6\}`} /> → <Tex math={String.raw`n(A)=2`} />, <Tex math={String.raw`n(S)=6`} /> → <Tex math={String.raw`P(A) = \frac{2}{6} = \frac{1}{3}`} />.</p>

      <p><strong>Kepribadian:</strong> ruang sampel adalah &ldquo;panggung&rdquo; — sebelum menghitung peluang apapun, tanyakan dulu: <em>apa semua hasil yang mungkin?</em> Separuh kesalahan peluang berasal dari salah mendefinisikan <Tex math={String.raw`S`} />.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Tulis <Tex math={String.raw`S`} /> dulu sebelum menghitung. Untuk dua koin: <Tex math={String.raw`S=\{AA, AG, GA, GG\}`} /> — bukan <Tex math={String.raw`\{0,1,2\}`} /> angka! &ldquo;Satu angka&rdquo; dan &ldquo;dua angka&rdquo; tidak equally likely.</p>
</div>

      <h2 id="aksioma">Tiga Aksioma Kolmogorov — Konstitusi Peluang</h2>

      <p>Tahun 1933, matematikawan Andrey Kolmogorov merumuskan tiga aksioma. Semua aturan peluang — serumit apapun — adalah konsekuensi dari tiga ini:</p>

      <p><Tex math={String.raw`1.\quad P(S) = 1 \qquad 2.\quad P(A) \geq 0 \text{ untuk setiap } A \qquad 3.\quad A \cap B = \emptyset \Rightarrow P(A \cup B) = P(A) + P(B)`} block /></p>

      <ul>
<li><strong>Aksioma 1:</strong> sesuatu pasti terjadi — total peluang seluruh hasil = 1 (atau 100%).</li>
<li><strong>Aksioma 2:</strong> peluang tidak pernah negatif.</li>
<li><strong>Aksioma 3:</strong> untuk kejadian yang <strong>saling lepas</strong> (tidak bisa terjadi bersama), peluang &ldquo;salah satu terjadi&rdquo; = jumlah peluangnya.</li>
</ul>

      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\cup`} /> = &ldquo;atau&rdquo; (gabungan), <Tex math={String.raw`\cap`} /> = &ldquo;dan&rdquo; (irisan), <Tex math={String.raw`\emptyset`} /> = himpunan kosong (tidak ada hasil bersama).</p>

      <p><strong>Interpretasi:</strong> aksioma 3 adalah &ldquo;aturan tambah&rdquo; versi murni — hanya berlaku jika kejadiannya tidak tumpang tindih. Dadu muncul 1 atau 2: <Tex math={String.raw`P = 1/6 + 1/6 = 1/3`} /> karena &ldquo;muncul 1&rdquo; dan &ldquo;muncul 2&rdquo; tidak bisa bareng.</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Peluang bisa lebih dari 1 atau negatif.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tidak pernah. Aksioma 1+2 memaksa <Tex math={String.raw`0 \leq P(A) \leq 1`} />. Kalau hitunganmu menghasilkan 1,4 atau −0,2 — hitungannya yang salah, bukan teorinya. Cek ulang <Tex math={String.raw`S`} />.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Angka peluang selalu bisa dibaca sebagai &ldquo;dalam jangka panjang, terjadi sekian persen dari pengulangan&rdquo;. <Tex math={String.raw`P=0{,}05`} /> = sekitar 5 dari 100 pengulangan — bukan janji untuk 100 berikutnya.</p>
</div>

      <h2 id="aturan">Tiga Aturan Turunan yang Dipakai Tiap Hari</h2>

      <h3>1. Aturan komplemen — &ldquo;kebalikannya&rdquo;</h3>

      <p><Tex math={String.raw`P(A^c) = 1 - P(A)`} block /></p>

      <p><Tex math={String.raw`A^c`} /> = &ldquo;<Tex math={String.raw`A`} /> tidak terjadi&rdquo;. <strong>Kapan dipakai:</strong> saat menghitung langsung susah tapi kebalikannya gampang. Peluang <em>minimal satu</em> gagal dari 10 nasabah jauh lebih mudah via komplemen: 1 − P(tidak ada yang gagal).</p>

      <h3>2. Aturan penjumlahan umum — &ldquo;atau&rdquo; yang benar</h3>

      <p><Tex math={String.raw`P(A \cup B) = P(A) + P(B) - P(A \cap B)`} block /></p>

      <p><strong>Artinya:</strong> kalau asal tambah, irisan dihitung dua kali — harus dikurangi sekali. <strong>Contoh:</strong> peluang kartu merah atau king: <Tex math={String.raw`26/52 + 4/52 - 2/52 = 28/52`} /> (2 king merah dihitung ganda).</p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah</summary>
<p>Dari 100 nasabah: 30 pernah telat bayar (T), 20 punya kartu kredit lain macet (M), 8 keduanya.</p><p><strong>Langkah 1</strong> — tulis yang diketahui: <Tex math={String.raw`P(T)=0{,}30,\ P(M)=0{,}20,\ P(T\cap M)=0{,}08`} />.</p><p><strong>Langkah 2</strong> — aturan penjumlahan: <Tex math={String.raw`P(T \cup M) = 0{,}30+0{,}20-0{,}08 = 0{,}42`} />.</p><p>Jadi 42% nasabah punya minimal satu sinyal risiko — bukan 50% (asal tambah)!</p>
</details>

      <h3>3. Aturan perkalian — &ldquo;dan&rdquo; yang benar</h3>

      <p><Tex math={String.raw`P(A \cap B) = P(A) \times P(B|A)`} block /></p>

      <p>Versi sederhananya hanya berlaku jika <Tex math={String.raw`A`} /> dan <Tex math={String.raw`B`} /> <strong>independen</strong> (lihat bawah): <Tex math={String.raw`P(A \cap B) = P(A)\times P(B)`} />.</p>

      <p><strong>Contoh:</strong> peluang dua nasabah <em>berturut-turut</em> gagal (independen, PD 5%): <Tex math={String.raw`0{,}05 \times 0{,}05 = 0{,}0025`} /> = 0,25%.</p>

      <h2 id="indep">&ldquo;Independen&rdquo; vs &ldquo;Saling Lepas&rdquo; — Jangan Tertukar!</h2>

      <p><strong>Definisi.</strong> Dua kejadian <strong>independen</strong> jika terjadinya satu <em>tidak mengubah</em> peluang yang lain: <Tex math={String.raw`P(B|A) = P(B)`} />. Dua kejadian <strong>saling lepas</strong> (mutually exclusive) jika <em>tidak bisa terjadi bersama</em>: <Tex math={String.raw`P(A \cap B) = 0`} />.</p>

      <p><strong>Kepribadian:</strong> independen = &ldquo;tidak peduli&rdquo; (koin kedua tidak peduli hasil koin pertama). Saling lepas = &ldquo;tidak bisa bareng&rdquo; (dadu tidak bisa 1 dan 6 sekaligus).</p>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Independen sama dengan saling lepas.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Justru <strong>kebalikannya</strong>! Jika <Tex math={String.raw`A`} /> dan <Tex math={String.raw`B`} /> saling lepas (dengan peluang positif), maka terjadinya <Tex math={String.raw`A`} /> membuat <Tex math={String.raw`B`} /> mustahil — sangat <em>tidak</em> independen. Contoh: &ldquo;nasabah lancar&rdquo; vs &ldquo;nasabah gagal&rdquo; saling lepas, dan jelas tidak independen.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;&ldquo;Sudah 5x gagal, pasti berikutnya berhasil&rdquo; (gambler's fallacy).&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Jika tiap percobaan independen, sejarah tidak mengubah peluang. Koin yang 5x muncul angka tetap 50% untuk lemparan ke-6. Yang &ldquo;jatuh tempo&rdquo; hanya berlaku jika ada mekanisme yang menghubungkan (misal tanpa pengembalian — itu tidak independen!).</p>
</div>

      <p><strong>Kapan memakai:</strong> pakai perkalian sederhana <Tex math={String.raw`P(A)P(B)`} /> <em>hanya</em> jika yakin independen (atau diminta mengasumsikan). Di risiko kredit, default antar nasabah <strong>tidak</strong> independen saat krisis (korelasi!) — asumsi independen meremehkan risiko (ini dibahas di B13 Vasicek).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> &ldquo;Atau&rdquo; → pikir tambah (kurangi irisan). &ldquo;Dan&rdquo; → pikir kali (cek independen dulu). &ldquo;Minimal satu&rdquo; → pikir komplemen. Tiga refleks ini menyelesaikan 80% soal peluang dasar.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Tiga Aturan, Tiga Orde Besarnya"
  layout={{"yaxis": {"title": "Peluang"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = aturan yang dipakai, tinggi batang = peluang hasil. Perhatikan skala sumbu Y.</p>
<p><strong>Interpretasi:</strong> Aturan &ldquo;atau&rdquo; menghasilkan peluang besar (0,42), &ldquo;dan&rdquo; menghasilkan peluang kecil (0,0025) — mengalikan peluang selalu mengecilkan. Komplemen membalik: P(minimal satu gagal) = 0,95 jauh lebih besar dari P(dua-duanya gagal). Intuisi ini penting: <strong>risiko gabungan &ldquo;salah satu&rdquo; jauh lebih besar dari &ldquo;semuanya&rdquo;</strong>.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Frekuensi Relatif → Peluang (Hukum Bilangan Besar, teaser B11)"
  layout={{"xaxis": {"title": "Banyak lemparan (skala log)", "type": "log"}, "yaxis": {"title": "Frekuensi relatif"}}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = banyak lemparan koin (skala log), sumbu Y = proporsi &ldquo;angka&rdquo;. Garis putus-putus = 0,5.</p>
<p><strong>Interpretasi:</strong> Sedikit lemparan: frekuensi liar (0,6 di n=10). Makin banyak, makin menempel ke 0,5. Inilah makna operasional peluang: <strong>frekuensi jangka panjang</strong>. Bukan ramalan satu kejadian.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Ikuti tiap langkah dengan kalkulator — lalu tutup dan coba ulangi dari ingatan.</p>

            <details className="worked">
              <summary>📐 Kasus 1: &ldquo;Atau&rdquo; yang tidak saling lepas</summary>
              <p>P(terlambat) = 0,3; P(punya tunggakan kartu) = 0,2; P(keduanya) = 0,08. Berapa P(terlambat ATAU punya tunggakan)?</p>
              <p><strong>Langkah 1</strong> — cek: saling lepas? Tidak (irisan 0,08 &gt; 0).<br />
              <strong>Langkah 2</strong> — inklusi-eksklusi: P(A∪B) = P(A) + P(B) − P(A∩B) = 0,3 + 0,2 − 0,08 = <strong>0,42</strong>.<br />
              <strong>Langkah 3</strong> — sanity check: &ldquo;asal tambah&rdquo; memberi 0,5 — kelebihan 0,08, tepat sebesar irisan yang dihitung dua kali.</p>
              <p>Pelajaran: tiap kali mendengar &ldquo;atau&rdquo;, tanyakan dulu &ldquo;irisannya berapa?&rdquo; — sebelum menjumlah.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: &ldquo;Minimal satu&rdquo; via komplemen</summary>
              <p>100 nasabah, masing-masing P(gagal) = 5% independen. Berapa peluang <em>minimal satu</em> gagal?</p>
              <p><strong>Langkah 1</strong> — hitung langsung mustahil praktis (P(1 gagal) + P(2 gagal) + … + P(100 gagal) = 100 suku).<br />
              <strong>Langkah 2</strong> — pakai komplemen: P(min 1) = 1 − P(tidak ada yang gagal).<br />
              <strong>Langkah 3</strong> — P(tidak ada) = 0,95<sup>100</sup> ≈ 0,0059.<br />
              <strong>Langkah 4</strong> — jawaban: 1 − 0,0059 = <strong>0,9941 ≈ 99,4%</strong>.</p>
              <p>Pelajaran: &ldquo;minimal satu&rdquo; hampir selalu = 1 − P(nol). Satu suku mengalahkan seratus suku. (Dan: portofolio 100 nasabah &ldquo;5%&rdquo; hampir <em>pasti</em> menelan minimal satu gagal — 5% ≠ aman.)</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Independen ≠ saling lepas (dadu)</summary>
              <p>Dadu adil. A = &ldquo;genap&rdquo; (2,4,6), B = &ldquo;&gt; 3&rdquo; (4,5,6). Apakah A dan B independen? Apakah saling lepas?</p>
              <p><strong>Langkah 1</strong> — saling lepas? A∩B = &lbrace;4,6&rbrace; ≠ ∅ → <strong>tidak</strong> saling lepas.<br />
              <strong>Langkah 2</strong> — P(A) = 3/6 = 0,5; P(B) = 3/6 = 0,5; P(A)P(B) = 0,25.<br />
              <strong>Langkah 3</strong> — P(A∩B) = 2/6 ≈ 0,333 ≠ 0,25 → <strong>tidak independen</strong>.<br />
              <strong>Langkah 4</strong> — cek silang: P(A|B) = (2/6)/(3/6) = 2/3 ≠ P(A) = 1/2. Mengetahui B mengubah peluang A.</p>
              <p>Pelajaran: dua kejadian bisa <em>tidak</em> saling lepas sekaligus <em>tidak</em> independen — empat kombinasi (independen/lepasan × ya/tidak) semuanya mungkin. Jangan samakan keduanya.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Koin 10.000x — Melihat Peluang Bekerja</h2>

      <p>Jalankan simulasi lempar koin. Perhatikan bagaimana frekuensi &ldquo;angka&rdquo; menstabil di 0,5.</p>

      <PyodideLab
  title="Lab 1 — Frekuensi Relatif Koin"
  hint="Coba n lebih besar. Kapan frekuensi &amp;ldquo;terkunci&amp;rdquo; di dekat 0,5? Itulah aksioma 1 yang hidup."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Aturan &ldquo;Atau&rdquo; vs Asal Tambah</h2>

      <p>Hitung P(merah atau king) dari 52 kartu dengan simulasi, lalu bandingkan dengan &ldquo;asal tambah&rdquo.</p>

      <PyodideLab
  title="Lab 2 — Jangan Asal Tambah"
  hint="Coba ubah jadi P(hitam atau As). Berapa irisannya? Cek dengan rumus."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Tambah, Kali, atau Komplemen?</h2>

      <div className="decision-card">
<h3>1. Ada kata &ldquo;atau&rdquo; → <strong>aturan penjumlahan</strong></h3>
<p><strong>Kondisi data:</strong> Dua kejadian bisa tumpang tindih (tidak saling lepas).</p>
<PlotlyChart data={dchart3} title="P(A ∪ B) = 0,3 + 0,2 − 0,08" layout={{}} />
<p className="text-small"><strong>Cara membaca:</strong> tiga batang = P(A), P(B), dan irisannya P(A∩B). <strong>Interpretasi:</strong> &ldquo;asal tambah&rdquo; 0,3 + 0,2 = 0,5 menghitung irisan dua kali — kurangi 0,08 sekali → jawaban benar 0,42.</p>
<p><strong>Kenapa:</strong> Irisan dihitung dua kali kalau asal tambah — kurangi sekali.</p>
<p><strong>Contoh nyata:</strong> P(telat atau punya kartu macet) di contoh worked di atas.</p>
</div>

      <div className="decision-card">
<h3>2. Ada kata &ldquo;dan&rdquo;/&ldquo;berturut-turut&rdquo; → <strong>aturan perkalian</strong></h3>
<p><strong>Kondisi data:</strong> Dua kejadian berurutan atau bersamaan.</p>
<p><strong>Kenapa:</strong> P(A dan B) = P(A) × P(B) hanya jika independen. Jika tidak, butuh P(B|A) — itu topik B3.</p>
<p><strong>Contoh nyata:</strong> P(2 nasabah gagal berurutan) = 0,05 × 0,05 (asumsi independen).</p>
</div>

      <div className="decision-card">
<h3>3. Ada kata &ldquo;minimal satu&rdquo; → <strong>komplemen</strong></h3>
<p><strong>Kondisi data:</strong> Menghitung langsung butuh banyak suku (1 terjadi + 2 terjadi + ...).</p>
<p><strong>Kenapa:</strong> 1 − P(tidak ada yang terjadi) selalu satu suku. Jauh lebih mudah.</p>
<p><strong>Contoh nyata:</strong> P(minimal 1 gagal dari 100 nasabah) = 1 − 0,95^100 ≈ 99,4%!</p>
</div>

      <div className="decision-card">
<h3>4. Ragu independen atau tidak → <strong>jangan asal kali</strong></h3>
<p><strong>Kondisi data:</strong> Ada mekanisme yang menghubungkan kejadian (krisis, musim, tanpa pengembalian).</p>
<p><strong>Kenapa:</strong> Asumsi independen yang salah = meremehkan risiko gabungan. Di krisis 2008, default yang &ldquo;independen&rdquo; ternyata bergerak bareng.</p>
<p><strong>Contoh nyata:</strong> Tanpa pengembalian: P(2 kartu As berurutan) = 4/52 × 3/51, bukan (4/52)².</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Dengar katanya: <strong>atau → tambah</strong>, <strong>dan → kali</strong>, <strong>minimal satu → komplemen</strong>.</li><li>Sebelum tambah: tanya &ldquo;ada irisan?&rdquo; Sebelum kali: tanya &ldquo;independen?&rdquo;</li><li>Hasil di luar [0,1] = pasti salah hitung.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: &ldquo;99,4%&rdquo; yang Mengejutkan Direksi</h2>

      <div className="callout">
<p>Portofolio 100 nasabah, masing-masing PD = 5%, <strong>asumsikan independen</strong>.</p><p>Direksi: &ldquo;Risiko kita kecil, cuma 5%.&rdquo; Kamu menghitung:</p><ul><li>P(tidak ada yang gagal) = 0,95<sup>100</sup> ≈ 0,6%</li><li><strong>P(minimal satu gagal) = 1 − 0,006 = 99,4%</strong></li></ul><p><strong>Pertanyaan:</strong> (a) Mengapa 99,4% bukan kontradiksi dengan &ldquo;PD 5%&rdquo;? (b) Apa yang salah dari asumsi independen di sini?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Tidak kontradiksi: 5% adalah peluang <em>per nasabah</em>, 99,4% adalah peluang <em>minimal satu dari 100</em>. Dengan 100 percobaan, hampir pasti ada yang gagal — itu konsekuensi aturan komplemen, bukan kenaikan risiko per nasabah. Ekspektasi jumlah gagal tetap 5 (ini B5).</p><p>(b) Asumsi independen rapuh: dalam resesi, PHK massal membuat gagal bayar <strong>berkorelasi</strong> — peluang gabungannya lebih besar dari perkalian sederhana. Inilah mengapa B13 (Vasicek) ada: memodelkan korelasi default.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit. Jika 2+ benar tanpa bantuan, lanjut ke quiz dengan percaya diri.</p>
            <ol>
              <li>P(hujan) = 0,4; P(macet) = 0,3; P(hujan dan macet) = 0,18. Berapa P(hujan atau macet)? Apakah hujan dan macet independen?</li>
              <li>Sebuah dadu dilempar 3 kali. Berapa peluang <em>minimal satu</em> angka 6 muncul?</li>
              <li>Di kelas 40 orang, 25 suka kopi (K), 20 suka teh (T), 12 suka keduanya. Berapa peluang siswa acak suka kopi atau teh? Berapa yang tidak suka keduanya?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> P(H∪M) = 0,4 + 0,3 − 0,18 = <strong>0,52</strong>. Independen? P(H)P(M) = 0,12 ≠ 0,18 → <strong>tidak independen</strong> (hujan menaikkan peluang macet — masuk akal).</p>
              <p><strong>2.</strong> 1 − P(tidak ada 6) = 1 − (5/6)<sup>3</sup> = 1 − 125/216 = <strong>91/216 ≈ 42,1%</strong>. Bukan 3 × 1/6 = 50% — &ldquo;asal tambah&rdquo; salah karena kejadiannya tidak saling lepas.</p>
              <p><strong>3.</strong> P(K∪T) = 25/40 + 20/40 − 12/40 = 33/40 = <strong>82,5%</strong>. Tidak suka keduanya = komplemen = 1 − 33/40 = <strong>7/40 = 17,5%</strong> (7 orang).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Ruang sampel dulu</strong> sebelum hitung — separuh error berasal dari <Tex math={String.raw`S`} /> yang salah.</li><li><strong>Tiga aksioma:</strong> total = 1, tak negatif, saling lepas boleh dijumlah.</li><li><strong>Atau → tambah</strong> (kurangi irisan); <strong>dan → kali</strong> (cek independen); <strong>minimal satu → komplemen</strong>.</li><li><strong>Independen ≠ saling lepas</strong> — justru saling lepas (nontrivial) pasti tidak independen.</li><li>Peluang = frekuensi jangka panjang, bukan janji untuk kejadian berikutnya.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/b2-kombinatorik" className="btn btn-primary btn-sm">Next: B2 →</Link>
      </div>
    </div>
  );
}
