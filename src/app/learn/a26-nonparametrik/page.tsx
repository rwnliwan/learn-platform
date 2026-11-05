"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A26Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: data bonus sangat miring — mean vs median per divisi
  const skewCompareData = [
    {
      x: ["Divisi X", "Divisi Y"],
      y: [18.5, 15.2],
      name: "Mean",
      type: "bar",
      marker: { color: "#e8a838" },
    },
    {
      x: ["Divisi X", "Divisi Y"],
      y: [12.0, 13.5],
      name: "Median",
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  // Chart 2: tabel kontingensi — kepuasan per kanal (stacked bar)
  const contingenData = [
    {
      x: ["Aplikasi", "Kantor cabang", "Call center"],
      y: [55, 40, 30],
      name: "Puas",
      type: "bar",
      marker: { color: "#16a34a" },
    },
    {
      x: ["Aplikasi", "Kantor cabang", "Call center"],
      y: [30, 35, 40],
      name: "Netral",
      type: "bar",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Aplikasi", "Kantor cabang", "Call center"],
      y: [15, 25, 30],
      name: "Tidak puas",
      type: "bar",
      marker: { color: "#c2410c" },
    },
  ];

  // Chart 3: KS — dua CDF yang berbeda (ilustrasi jarak D)
  const cdfX: number[] = [];
  for (let x = 0; x <= 30; x += 0.5) cdfX.push(x);
  const cdf1 = cdfX.map((x) => Math.min(1, Math.max(0, (x - 5) / 15)));
  const cdf2 = cdfX.map((x) => Math.min(1, Math.max(0, (x - 8) / 15)));
  const ksData = [
    { x: cdfX, y: cdf1, type: "scatter", mode: "lines", name: "CDF Grup A", line: { color: "#2a7de1" } },
    { x: cdfX, y: cdf2, type: "scatter", mode: "lines", name: "CDF Grup B", line: { color: "#c2410c" } },
  ];

  const lab1Code = `import random, statistics as st

random.seed(61)
# Bonus tahunan (jt): sangat miring — segelintir bonus raksasa
X = [random.expovariate(1/12) for _ in range(60)]
Y = [random.expovariate(1/14) for _ in range(60)]

# --- Mann-Whitney U dari nol: gabung, beri ranking, jumlahkan ---
gabung = sorted([(v, 'X') for v in X] + [(v, 'Y') for v in Y])
R1 = sum(i+1 for i, (_, g) in enumerate(gabung) if g == 'X')  # jumlah rank X
n1, n2 = len(X), len(Y)
U1 = R1 - n1*(n1+1)/2
U = min(U1, n1*n2 - U1)
# aproksimasi normal untuk U
mu_U = n1*n2/2
sd_U = (n1*n2*(n1+n2+1)/12) ** 0.5
z = (U - mu_U) / sd_U
print(f"Mean   X={st.mean(X):.1f} jt, Y={st.mean(Y):.1f} jt  (mean X 'menang' karena outlier)")
print(f"Median X={st.median(X):.1f} jt, Y={st.median(Y):.1f} jt")
print(f"Mann-Whitney: U={U:.0f}, z={z:.2f}")
print()
print("z di sekitar 0 -> TIDAK ada bukti stokastik dominan.")
print("Mean bilang X menang; ranking bilang seri. Siapa dipercaya?")
print("Coba: tambah outlier ke Y: Y.append(500). Mean Y meledak, U nyaris tak bergerak.")`;

  const lab2Code = `import math

# Tabel 2x2: kepuasan (Puas/Tidak) vs kanal (Aplikasi/Kantor)
#            Puas   Tidak
# Aplikasi    55     45
# Kantor      40     60
obs = [[55, 45], [40, 60]]
n = sum(sum(r) for r in obs)
row = [sum(r) for r in obs]
col = [obs[0][c] + obs[1][c] for c in range(2)]

# --- Chi-square dari nol ---
chi2 = 0
print("Sel | Observed | Expected | Kontribusi")
for i in range(2):
    for j in range(2):
        exp = row[i]*col[j]/n
        chi2 += (obs[i][j]-exp)**2/exp
        print(f"({i},{j}) |    {obs[i][j]:>3}   |  {exp:>5.1f}  |   {(obs[i][j]-exp)**2/exp:.2f}")
print(f"\nChi-square = {chi2:.2f}, df = 1")
print("Nilai kritis 5% untuk df=1 adalah 3.84.")
print("Coba: ubah sel jadi [[52,48],[48,52]] (nyaris seimbang). Chi2 jatuh < 3.84.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.6 — Statistika Inferensial</span>
        <h1 className="display-title">Saat Data Tak Mau Normal:<br />Uji Nonparametrik &amp; Kategorikal</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> Lesson sebelumnya: <strong>uji-t/ANOVA</strong> membandingkan mean dengan asumsi data kurang-lebih normal (atau n besar) dan skala interval/rasio. Tapi data nyata sering menolak asumsi itu: bonus yang miring parah, skor kepuasan ordinal 1–5, tabel kategori. Lesson ini memberi <strong>senjata cadangan</strong>: uji berbasis ranking (Mann-Whitney, Wilcoxon, KS) dan uji kategorikal (chi-square, Fisher).</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Bonus &ldquo;Rata-rata&rdquo; yang Menyesatkan</a></li>
          <li><a href="#filosofi">Filosofi Nonparametrik — Urutan vs Nilai</a></li>
          <li><a href="#mw">Mann-Whitney U — Uji-t-nya Data Miring</a></li>
          <li><a href="#wilcoxon">Wilcoxon — Versi Berpasangan</a></li>
          <li><a href="#chisq">Chi-Square — Detektif Tabel Kategori</a></li>
          <li><a href="#fisher">Fisher Exact — Ketika Angka Terlalu Kecil untuk Chi-Square</a></li>
          <li><a href="#ks">Kolmogorov–Smirnov — Pembanding Bentuk Distribusi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mann-Whitney dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Chi-Square dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Uji Nonparametrik &amp; Kategorikal</a></li>
          <li><a href="#case">📋 Mini-Case: Survei Kepuasan Tiga Kanal</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan ide <strong>ranking</strong> sebagai pengganti nilai mentah — dan mengapa ia kebal outlier.</li>
          <li>Menghitung <strong>Mann-Whitney U</strong> langkah-demi-langkah dan menginterpretasikannya sebagai &ldquo;dominansi stokastik&rdquo;.</li>
          <li>Menghitung <strong>chi-square</strong> untuk tabel kontingensi (independensi &amp; goodness-of-fit) beserta syarat expected count-nya.</li>
          <li>Menjelaskan kapan <strong>Fisher exact</strong> wajib menggantikan chi-square.</li>
          <li>Menjelaskan <strong>uji KS</strong> sebagai pembanding seluruh bentuk distribusi — bukan cuma mean/median.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Bonus &ldquo;Rata-rata&rdquo; yang Menyesatkan</h2>
      <div className="story">
        <p>HRD mengumumkan: &ldquo;Rata-rata bonus Divisi X = Rp18,5 juta, Divisi Y = Rp15,2 juta. Uji-t menunjukkan perbedaan <strong>signifikan</strong> (p = 0,03). Selamat untuk Divisi X!&rdquo;</p>
        <p>Seorang analis curiga dan membuka distribusinya. Divisi X: 59 orang dapat bonus Rp8–14 juta, <strong>1 direktur dapat Rp400 juta</strong>. Divisi Y: semua 60 orang dapat Rp12–18 juta, merata. Median X = Rp12 juta — <strong>di bawah</strong> median Y = Rp13,5 juta!</p>
        <p>Uji-t membandingkan <em>mean</em> — dan mean X menang hanya karena satu direktur. Mayoritas karyawan X justru menerima <em>lebih kecil</em> dari mayoritas karyawan Y. &ldquo;Kemenangan signifikan&rdquo; itu adalah kemenangan satu orang.</p>
        <p><strong>Twist-nya:</strong> ada uji yang tidak bisa ditipu oleh direktur itu — <strong>Mann-Whitney</strong>. Ia tidak peduli <em>berapa</em> bonusnya, hanya <em>urutannya</em>: direktur Rp400 juta cuma dihitung sebagai &ldquo;peringkat 1&rdquo;, sama seperti jika bonusnya Rp20 juta. Satu angka ekstrem kehilangan seluruh kekuatannya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="filosofi">Filosofi Nonparametrik — Urutan vs Nilai</h2>
      <p><strong>Definisi.</strong> <strong>Uji nonparametrik</strong> adalah uji yang <strong>tidak mengasumsikan bentuk distribusi</strong> tertentu (misal normal) untuk populasinya. &ldquo;Nonparametrik&rdquo; bukan berarti &ldquo;tanpa parameter sama sekali&rdquo; — melainkan &ld;tanpa parameter <em>distribusi</em> seperti μ dan σ&rdquo;.</p>
      <p>Senjata utamanya: <strong>ranking</strong>. Urutkan semua data dari terkecil ke terbesar, ganti nilainya dengan peringkatnya (1, 2, 3, …). Bonus Rp400 juta dan Rp20 juta — jika keduanya terbesar — sama-sama jadi peringkat 1. Informasi <em>besarnya</em> selisih dibuang; yang dipertahankan hanya <em>urutannya</em>.</p>
      <p><strong>Kepribadian filosofi ini:</strong> si bijak yang tahu kapan harus mengabaikan detail. Membuang informasi besar-kecil terdengar merugikan — dan memang ada harganya (<strong>sedikit kurang power</strong> jika data sebenarnya normal). Tapi imbalannya: <strong>kebal total terhadap outlier</strong> dan bebas asumsi distribusi. Saat data kotor, &ldquo;sedikit kurang tajam tapi tidak pernah tertipu&rdquo; mengalahkan &ldquo;tajam tapi gampang dibodohi&rdquo;.</p>
      <p><strong>Kapan memakai:</strong> (1) data sangat miring / banyak outlier dan n kecil (CLT belum menolong), (2) data <strong>ordinal</strong> (skor 1–5, peringkat) di mana selisih angka tidak bermakna, (3) kamu tidak mau / tidak bisa memverifikasi asumsi normalitas.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> untuk data <strong>ordinal</strong> (misal kepuasan 1–5), uji-t bahkan <em>tidak valid secara konsep</em> — selisih &ldquo;4 − 3&rdquo; belum tentu sama dengan &ldquo;3 − 2&rdquo; dalam arti kepuasan. Ranking menghormati sifat ordinal: yang dipakai hanya &ldquo;lebih besar dari&rdquo;, bukan &ldquo;berapa lebih besar&rdquo;. Inilah mengapa survei kepuasan dan uji nonparametrik adalah pasangan alami.</p>
      </div>

      <h2 id="mw">Mann-Whitney U — Uji-t-nya Data Miring</h2>
      <p><strong>Definisi.</strong> <strong>Uji Mann-Whitney U</strong> (a.k.a. Wilcoxon rank-sum) menguji apakah nilai dari satu grup cenderung <strong>lebih besar</strong> dari grup lain — disebut <strong>dominansi stokastik</strong>: <Tex math={String.raw`P(X > Y) \neq 0{,}5`} />.</p>
      <p><strong>Cara kerja (3 langkah):</strong></p>
      <ol>
        <li>Gabung semua data kedua grup, <strong>urutkan</strong>, beri peringkat 1…N.</li>
        <li>Jumlahkan peringkat grup 1 → <Tex math={String.raw`R_1`} />.</li>
        <li>Hitung <Tex math={String.raw`U = R_1 - \frac{n_1(n_1+1)}{2}`} /> — di bawah H0 (tidak ada beda), U menyebar di sekitar <Tex math={String.raw`n_1 n_2 / 2`} />.</li>
      </ol>
      <Tex math={String.raw`U = R_1 - \frac{n_1(n_1+1)}{2}, \qquad E[U \mid H_0] = \frac{n_1 n_2}{2}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`R_1`} /> jumlah peringkat grup 1; <Tex math={String.raw`n_1, n_2`} /> ukuran tiap grup; suku <Tex math={String.raw`n_1(n_1+1)/2`} /> adalah jumlah peringkat <em>minimum</em> yang mungkin (jika semua data grup 1 terkecil) — jadi U mengukur &ldquo;kelebihan peringkat&rdquo; di atas minimum.</p>
      <p><strong>Kepribadian Mann-Whitney:</strong> si wasit yang adil — ia tidak mendengar <em>berapa</em> golnya, hanya <em>siapa menang</em> di tiap perbandingan. Direktur Rp400 juta hanya menyumbang satu &ldquo;kemenangan peringkat&rdquo;, bukan 400 juta kemenangan.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: Mann-Whitney mini</summary>
        <p>Grup A (bonus, jt): [8, 12, 400]. Grup B: [10, 11, 13]. Apakah A &gt; B?</p>
        <p><strong>Langkah 1</strong> — gabung &amp; urutkan: 8(A), 10(B), 11(B), 12(A), 13(B), 400(A) → peringkat 1–6.<br />
        <strong>Langkah 2</strong> — <Tex math={String.raw`R_A = 1 + 4 + 6 = 11`} />.<br />
        <strong>Langkah 3</strong> — <Tex math={String.raw`U = 11 - 3{\times}4/2 = 11 - 6 = 5`} />. Nilai maksimum U = 9, ekspektasi H0 = 4,5.</p>
        <p>U = 5 nyaris tepat di ekspektasi H0 → <strong>tidak ada bukti A dominan</strong>, meski mean A (140) menghancurkan mean B (11,3)! Inilah keadilan ranking: satu direktur tidak bisa memenangkan &ldquo;pemilu peringkat&rdquo; sendirian.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Mann-Whitney menguji perbedaan median.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ia menguji <strong>dominansi stokastik</strong> — apakah nilai acak dari satu grup cenderung lebih besar dari grup lain. Ia <em>menjadi</em> uji median hanya jika kedua distribusi punya <strong>bentuk yang sama</strong> (hanya bergeser). Jika bentuknya beda (satu miring, satu simetris), interpretasi &ldquo;beda median&rdquo; bisa menyesatkan. Untuk klaim median yang bersih, bentuk harus sebanding.</p>
      </div>

      <PlotlyChart
        data={skewCompareData}
        title="Mean vs Median Bonus Dua Divisi (satu outlier Rp400 jt di X)"
        layout={{ barmode: "group", yaxis: { title: "Juta Rp" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kelompok batang per divisi — kuning = mean, biru = median.</p>
        <p><strong>Interpretasi:</strong> mean berkata X menang (18,5 vs 15,2); median berkata Y menang (13,5 vs 12,0). Keduanya &ldquo;benar&rdquo; untuk definisinya masing-masing — tapi menjawab pertanyaan beda. <strong>Untuk &ldquo;karyawan tipikal dapat berapa?&rdquo;, median/Mann-Whitney jujur; untuk &ldquo;total biaya bonus?&rdquo;, mean yang relevan.</strong> Pilih statistik sesuai pertanyaan, bukan sesuai hasil yang diinginkan.</p>
      </div>

      <h2 id="wilcoxon">Wilcoxon — Versi Berpasangan</h2>
      <p><strong>Definisi.</strong> <strong>Uji Wilcoxon signed-rank</strong> adalah padanan berpasangan dari Mann-Whitney — pengganti uji-t berpasangan saat selisihnya tidak normal:</p>
      <ol>
        <li>Hitung selisih tiap pasangan <Tex math={String.raw`d_i`} />, buang yang nol.</li>
        <li>Peringkati <strong>nilai absolut</strong> selisih: <Tex math={String.raw`|d_i|`} /> → peringkat.</li>
        <li>Jumlahkan peringkat selisih <strong>positif</strong> → <Tex math={String.raw`W^+`} />. Di bawah H0 (median selisih = 0), <Tex math={String.raw`W^+`} /> ≈ setengah total peringkat.</li>
      </ol>
      <p><strong>Kepribadian Wilcoxon:</strong> adik Mann-Whitney yang teliti — ia memakai <em>arah</em> (tanda) dan <em>urutan besarnya</em> selisih, tapi tetap menolak diintimidasi nilai ekstrem.</p>
      <p><strong>Kapan memakai:</strong> sebelum–sesudah dengan selisih miring (misal perubahan pengeluaran yang didominasi segelintir big spender), atau n kecil di mana normalitas selisih meragukan.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci — peta pasangan:</strong> berpasangan + normal → uji-t berpasangan; berpasangan + tidak normal → <strong>Wilcoxon signed-rank</strong>. Independen + normal → uji-t Welch; independen + tidak normal → <strong>Mann-Whitney</strong>. 3+ grup independen + tidak normal → <strong>Kruskal-Wallis</strong> (ANOVA-nya ranking). Satu peta, empat kuadran.</p>
      </div>

      <h2 id="chisq">Chi-Square — Detektif Tabel Kategori</h2>
      <p><strong>Definisi.</strong> <strong>Uji chi-square</strong> (χ², dibaca &ldquo;kai-kuadrat&rdquo;) mengukur seberapa jauh <strong>frekuensi teramati (O)</strong> menyimpang dari <strong>frekuensi harapan (E)</strong> jika tidak ada hubungan:</p>
      <Tex math={String.raw`\chi^2 = \sum_{\text{sel}} \frac{(O - E)^2}{E}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`O`} /> = observed (cacah teramati di tiap sel tabel); <Tex math={String.raw`E`} /> = expected (cacah harapan di bawah H0); kuadrat membuat penyimpangan dua arah terhitung; pembagi <Tex math={String.raw`E`} /> menstandarkan (selisih 10 dari harapan 1.000 tidak sama dengan selisih 10 dari harapan 12).</p>
      <p><strong>Dua kegunaan:</strong></p>
      <ol>
        <li><strong>Uji independensi:</strong> apakah dua variabel kategorik berhubungan? (Kepuasan × kanal layanan.) Harapan: <Tex math={String.raw`E = \frac{\text{total baris} \times \text{total kolom}}{\text{total keseluruhan}}`} />.</li>
        <li><strong>Uji goodness-of-fit:</strong> apakah distribusi teramati cocok dengan yang diklaim? (Dadu: apakah tiap sisi muncul 1/6?) Harapan dari klaimnya.</li>
      </ol>
      <p><strong>Kepribadian chi-square:</strong> si akuntan yang teliti — ia memeriksa <em>setiap sel</em> tabel satu per satu: &ldquo;di sel ini seharusnya 42, tapi ada 55 — selisihnya mencurigakan?&rdquo; Lalu menjumlahkan semua kecurigaan menjadi satu angka.</p>
      <p><strong>Syarat penting:</strong> <strong>expected count tiap sel ≥ 5</strong> (aturan praktis). Jika ada sel dengan harapan kecil, aproksimasi χ² jebol → pakai <strong>Fisher exact</strong>.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: chi-square 2×2</summary>
        <p>Tabel: Aplikasi (Puas 55, Tidak 45), Kantor (Puas 40, Tidak 60). Total n = 200. H0: kepuasan independen dari kanal.</p>
        <p><strong>Langkah 1</strong> — total baris: 100, 100. Total kolom: 95, 105.<br />
        <strong>Langkah 2</strong> — E tiap sel: <Tex math={String.raw`E_{11} = 100 \times 95/200 = 47{,}5`} />, dst. (47,5; 52,5; 47,5; 52,5).<br />
        <strong>Langkah 3</strong> — <Tex math={String.raw`\chi^2 = \frac{(55-47{,}5)^2}{47{,}5} + \frac{(45-52{,}5)^2}{52{,}5} + \frac{(40-47{,}5)^2}{47{,}5} + \frac{(60-52{,}5)^2}{52{,}5} \approx 4{,}51`} />.<br />
        <strong>Langkah 4</strong> — df = (2−1)(2−1) = 1; nilai kritis 5% = 3,84. 4,51 &gt; 3,84 → <strong>tolak H0</strong>: kepuasan berhubungan dengan kanal.</p>
      </details>

      <PlotlyChart
        data={contingenData}
        title="Kepuasan per Kanal Layanan (n = 100 per kanal)"
        layout={{ barmode: "stack", xaxis: { title: "Kanal" }, yaxis: { title: "Responden" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = 100 responden satu kanal, ditumpuk per tingkat kepuasan (hijau = puas di bawah).</p>
        <p><strong>Interpretasi:</strong> proporsi &ldquo;puas&rdquo; menyusut dari aplikasi (55) ke call center (30), sementara &ldquo;tidak puas&rdquo; membesar. Chi-square menguji apakah pola ini <em>nyata</em> atau sekadar fluktuasi sampling — di sini χ² ≈ 13,2 (df = 4), p ≈ 0,01 → nyata. <strong>Langkah berikutnya:</strong> sel mana penyumbang terbesar? (lihat kontribusi per sel di Lab 2) — di sinilah insight bisnisnya.</p>
      </div>

      <h2 id="fisher">Fisher Exact — Ketika Angka Terlalu Kecil untuk Chi-Square</h2>
      <p><strong>Definisi.</strong> <strong>Uji exact Fisher</strong> menghitung p-value <strong>persis</strong> (bukan aproksimasi) untuk tabel 2×2 dengan menghitung peluang semua tabel &ldquo;seekstrem&rdquo; yang mungkin, memakai distribusi <strong>hipergeometrik</strong>:</p>
      <Tex math={String.raw`P(\text{tabel}) = \frac{\binom{a+b}{a}\binom{c+d}{c}}{\binom{n}{a+c}}`} block />
      <p><strong>Artinya:</strong> untuk tabel [[a, b], [c, d]], peluang tabel persis itu di bawah H0 (independensi, dengan total baris/kolom tetap) adalah rasio kombinasi tersebut. p-value = jumlah peluang semua tabel yang <em>sama atau lebih ekstrem</em>.</p>
      <p><strong>Kepribadian Fisher:</strong> si perfeksionis — tidak mau aproksimasi; ia menghitung peluangnya <em>persis</em> dengan kombinatorika. Harganya: komputasi berat untuk tabel besar (tapi komputer modern tidak keberatan untuk 2×2).</p>
      <p><strong>Kapan memakai:</strong> <strong>expected count &lt; 5</strong> di sel mana pun — misal tabel fraud (12 fraud vs 3.000 non-fraud). Aturan praktis: n kecil atau tabel jarang → Fisher; tabel besar &amp; padat → chi-square (hasilnya ≈ sama).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Chi-square untuk data kecil pun tidak apa-apa.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> chi-square adalah <em>aproksimasi</em> — ia mengasumsikan tiap sel cukup terisi agar fluktuasi diskrit &ldquo;halus&rdquo;. Dengan expected count 1–2, p-value-nya bisa meleset jauh (biasanya terlalu optimis → false positive). Kasus fraud/risiko <em>sering</em> berupa tabel jarang — justru di sinilah Fisher wajib.</p>
      </div>

      <h2 id="ks">Kolmogorov–Smirnov — Pembanding Bentuk Distribusi</h2>
      <p><strong>Definisi.</strong> <strong>Uji KS dua sampel</strong> membandingkan <strong>seluruh bentuk</strong> dua distribusi via jarak maksimum antara fungsi distribusi kumulatif (CDF) empirisnya:</p>
      <Tex math={String.raw`D = \sup_x |F_1(x) - F_2(x)|`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`F_1(x), F_2(x)`} /> = proporsi data ≤ x di tiap grup (CDF empiris — kurva yang naik dari 0 ke 1); <Tex math={String.raw`\sup`} /> = &ldquo;ambil yang terbesar&rdquo;; <Tex math={String.raw`D`} /> = celah vertikal <strong>terlebar</strong> antara kedua kurva.</p>
      <p><strong>Kepribadian KS:</strong> si kurator museum — ia tidak membandingkan satu patung (mean/median), ia membandingkan <em>seluruh galeri</em>. Dua grup bisa punya mean &amp; median <strong>identik</strong> tapi bentuk beda (satu bimodal, satu unimodal) — Mann-Whitney tidak melihatnya, KS melihatnya.</p>
      <p><strong>Kapan memakai:</strong> pertanyaan &ldquo;apakah <em>distribusinya</em> beda?&rdquo; — bukan cuma lokasinya. Contoh: apakah pola <em>waktu</em> transaksi berubah setelah peluncuran fitur (bentuk distribusi jam transaksi), atau uji satu sampel &ldquo;apakah data ini normal?&rdquo;.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> Mann-Whitney sensitif terhadap <strong>pergeseran lokasi</strong> (satu grup cenderung lebih besar); KS sensitif terhadap <strong>perbedaan bentuk apapun</strong> (lokasi, sebaran, kemiringan, bimodalitas). Harga keserbagunaan KS: untuk mendeteksi <em>pergeseran murni</em>, power-nya lebih rendah dari Mann-Whitney. Pilih sesuai pertanyaan: &ldquo;lebih besar?&rdquo; → MW; &ldquo;berbeda bentuk?&rdquo; → KS.</p>
      </div>

      <PlotlyChart
        data={ksData}
        title="Uji KS: Jarak Maksimum Dua CDF (D = celah vertikal terlebar)"
        layout={{ xaxis: { title: "Nilai" }, yaxis: { title: "CDF (proporsi ≤ x)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kurva naik dari 0 ke 1 = CDF empiris tiap grup. Cari titik di mana jarak vertikal keduanya paling lebar — itulah D.</p>
        <p><strong>Interpretasi:</strong> celah terlebar ≈ 0,2 di sekitar x = 8–12. KS menguji apakah celah sebesar ini wajar akibat sampling saja. <strong>Catatan penting:</strong> D tidak bilang <em>di mana</em> bedanya secara bisnis-bermakna — selalu plot CDF-nya (seperti ini) agar tahu bedanya di ekor, tengah, atau bentuk.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Nonparametrik = &ldquo;uji yang tidak butuh Normal&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Mann-Whitney — gaji dua kota yang miring</summary>
              <p>Jakarta (n=8): 8, 9, 10, 11, 12, 13, 14, 50 (jt). Surabaya (n=8): 7, 8, 9, 10, 11, 12, 13, 14. Uji-t ragu (outlier 50!). Apa kata Mann-Whitney?</p>
              <p><strong>Langkah 1</strong> — gabungkan &amp; beri peringkat 1–16. Outlier 50 → peringkat 16 (nilainya &ldquo;dijinakkan&rdquo; jadi peringkat!).<br />
              <strong>Langkah 2</strong> — jumlah peringkat Jakarta = 3+5+7+9+11+13+15+16 = 79; Surabaya = 1+2+4+6+8+10+12+14 = 57.<br />
              <strong>Langkah 3</strong> — U = 79 − 8×9/2 = 79 − 36 = 43 (maks 64). p ≈ 0,28 → <strong>tidak signifikan</strong>.<br />
              <strong>Langkah 4</strong> — bandingkan uji-t: mean Jakarta 15,9 vs 10,5 → t besar, p kecil — <em>didrive satu outlier</em>! Mann-Whitney tidak tertipu.</p>
              <p>Pelajaran: peringkat = &ldquo;potong ekor&rdquo; otomatis. Saat outlier/asimetri ekstrem + n kecil → nonparametrik lebih jujur.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Chi-square — apakah dadu curang?</summary>
              <p>Dadu dilempar 60×. Frekuensi: 8, 12, 9, 11, 7, 13. Apakah dadu adil? (α = 5%.)</p>
              <p><strong>Langkah 1</strong> — H0: adil → ekspektasi tiap sisi = 10.<br />
              <strong>Langkah 2</strong> — χ² = Σ(O−E)²/E = (4+4+1+1+9+9)/10 = 28/10 = <strong>2,8</strong>.<br />
              <strong>Langkah 3</strong> — df = 5, kritis 11,07. 2,8 &lt; 11,07 → <strong>gagal tolak</strong> — dadu &ldquo;adil&rdquo; (data tidak cukup bukti).<br />
              <strong>Langkah 4</strong> — catatan: &ldquo;gagal tolak&rdquo; ≠ &ldquo;terbukti adil&rdquo; — dengan n=60, ketidakadilan kecil tak terdeteksi (power!).</p>
              <p>Pelajaran: chi-square goodness-of-fit = &ldquo;apakah frekuensi cocok dengan teori&rdquo;. Berlaku untuk: dadu, distribusi jawaban survei, Benford (fraud!).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Mann-Whitney dari Nol</h2>
      <p>Bangun uji Mann-Whitney dari ranking mentah pada data bonus yang miring. Bandingkan vonisnya dengan vonis mean — lalu tambah outlier dan saksikan siapa yang goyah.</p>
      <PyodideLab
        title="Lab 1 — Mann-Whitney dari Ranking Mentah (Live Python)"
        hint="⚡ Live Python. Coba: tambah Y.append(500) — satu outlier raksasa di Y. Mean Y meledak, tapi z Mann-Whitney nyaris tak bergerak. Itulah kekebalan ranking."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Chi-Square dari Nol</h2>
      <p>Hitung expected count tiap sel, kontribusi tiap sel, dan statistik χ² total untuk tabel kepuasan × kanal. Lihat sel mana &ldquo;penyumbang kecurigaan&rdquo; terbesar.</p>
      <PyodideLab
        title="Lab 2 — Chi-Square Sel per Sel (Live Python)"
        hint="Coba: ubah tabel jadi [[52,48],[48,52]] (nyaris seimbang). Chi-square jatuh di bawah 3,84 — tidak signifikan. Rasakan betapa 'rapuhnya' signifikansi di n=200."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Uji Nonparametrik &amp; Kategorikal</h2>

      <div className="decision-card">
        <h3>1. Dua grup independen, data miring/ordinal → <strong>Mann-Whitney U</strong></h3>
        <p><strong>Kondisi:</strong> bonus, waktu tunggu, skor kepuasan 1–5 — mean tidak mewakili atau tidak bermakna.</p>
        <p><strong>Kenapa:</strong> berbasis ranking: kebal outlier, valid untuk ordinal. Interpretasi: dominansi stokastik (bukan otomatis &ldquo;beda median&rdquo;).</p>
        <p><strong>Contoh nyata:</strong> &ldquo;apakah nasabah kanal A cenderung lebih puas dari kanal B?&rdquo; (skor ordinal).</p>
      </div>

      <div className="decision-card">
        <h3>2. Data berpasangan, selisih tidak normal → <strong>Wilcoxon signed-rank</strong></h3>
        <p><strong>Kondisi:</strong> sebelum–sesudah dengan selisih miring atau n kecil.</p>
        <p><strong>Kenapa:</strong> padanan berpasangan dari Mann-Whitney; membuang noise antar-subjek <em>dan</em> kebal outlier.</p>
        <p><strong>Contoh nyata:</strong> perubahan limit kartu sebelum–sesudah kampanye, distribusi selisih miring.</p>
      </div>

      <div className="decision-card">
        <h3>3. Tabel kategori, sel terisi padat → <strong>Chi-square</strong></h3>
        <p><strong>Kondisi:</strong> expected count tiap sel ≥ 5. Pertanyaan independensi (&ldquo;apakah X berhubungan dengan Y?&rdquo;) atau goodness-of-fit.</p>
        <p><strong>Kenapa:</strong> memeriksa tiap sel vs harapannya; df = (baris−1)(kolom−1). Setelah signifikan, lihat kontribusi per sel untuk insight.</p>
        <p><strong>Contoh nyata:</strong> hubungan segmen nasabah × status macet; distribusi keluhan vs klaim &ldquo;merata&rdquo;.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tabel 2×2 jarang (expected &lt; 5) → <strong>Fisher exact</strong></h3>
        <p><strong>Kondisi:</strong> kejadian langka — fraud, default segmen kecil, uji klinis mini.</p>
        <p><strong>Kenapa:</strong> p-value persis via hipergeometrik; chi-square sebagai aproksimasi bisa terlalu optimis di sini.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;apakah 3 fraud dari 40 transaksi pola A vs 0 dari 35 pola B signifikan?&rdquo;</p>
      </div>

      <div className="decision-card">
        <h3>5. Pertanyaan &ldquo;apakah distribusinya beda bentuk?&rdquo; → <strong>KS</strong></h3>
        <p><strong>Kondisi:</strong> mean/median bisa sama tapi bentuk dicurigai beda — perubahan pola waktu, dua segmen dengan perilaku berbeda.</p>
        <p><strong>Kenapa:</strong> membandingkan seluruh CDF (D = celah maksimum). Selalu plot kedua CDF agar tahu <em>di mana</em> bedanya.</p>
        <p><strong>Contoh nyata:</strong> distribusi jam transaksi sebelum vs sesudah peluncuran fitur baru.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Data miring + n kecil → ranking.</strong> Jangan paksakan uji-t pada data yang menjerit.</li>
          <li><strong>Ordinal → nonparametrik.</strong> Mean dari skor 1–5 tidak bermakna secara ketat.</li>
          <li><strong>Tabel jarang → Fisher.</strong> Cek expected count sebelum percaya chi-square.</li>
          <li>Nonparametrik bukan &ldquo;versi lemah&rdquo; — ia adalah <strong>pilihan yang tepat</strong> saat asumsi parametrik salah.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Survei Kepuasan Tiga Kanal</h2>
      <div className="callout">
        <p>Bank &ldquo;MajuBank&rdquo; mensurvei 300 nasabah (100 per kanal), skor kepuasan 1–5. Hasil ringkas: median aplikasi = 4, median cabang = 4, median call center = 3. Tim produk: &ldquo;median aplikasi = cabang, jadi keduanya sama baiknya. Fokus perbaiki call center.&rdquo;</p>
        <p>Distribusi lengkap (dari chart di atas): aplikasi [15, 30, 55] (tidak/netral/puas), cabang [25, 35, 40], call center [30, 40, 30] untuk kategori Tidak/Netral/Puas.</p>
        <p><strong>Pertanyaan:</strong> (a) Uji apa untuk &ldquo;apakah kepuasan berbeda antar kanal&rdquo;? (b) Mengapa &ldquo;median sama → sama baik&rdquo; bisa menyesatkan? (c) Analisis lanjutan apa sebelum alokasi budget perbaikan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Chi-square independensi</strong> (3×3, semua expected ≥ 5) atau <strong>Kruskal-Wallis</strong> untuk skor ordinal. Chi-square: χ² ≈ 13,2, df = 4, p ≈ 0,01 → kepuasan <em>berhubungan</em> dengan kanal.</p>
          <p>(b) Median hanya satu titik potong distribusi. Aplikasi punya 55% &ldquo;puas&rdquo; vs cabang 40% — pengalaman <em>atas</em> jauh lebih baik di aplikasi, meski median sama-sama 4. <strong>Satu statistik ringkas menyembunyikan bentuk.</strong></p>
          <p>(c) <strong>Kontribusi per sel</strong> chi-square: sel mana paling menyimpang? Lalu <strong>uji post-hoc berpasangan</strong> (Mann-Whitney per pasangan kanal + koreksi Bonferroni) untuk tahu pasangan mana yang beda. Dan yang terpenting: <strong>kualitatif</strong> — apa keluhan spesifik per kanal? Angka bilang <em>di mana</em>, bukan <em>mengapa</em>.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Data berpasangan sebelum–sesudah (n=12), selisihnya miring. Uji parametrik pasangannya apa? Padanan nonparametriknya?</li>
              <li>Tabel 2×2: 30/70 vs 50/50 (n=100 per grup). Hitung χ² independensi &amp; keputusan α=5%.</li>
              <li>Kapan bootstrap (A2.9) <em>lebih baik</em> dari uji nonparametrik klasik?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Parametrik: <strong>uji-t berpasangan</strong>. Nonparametrik: <strong>Wilcoxon signed-rank</strong> (peringkat selisih!).</p>
              <p><strong>2.</strong> Ekspektasi tiap sel (H0 independen): 40/60. χ² = (100/40)+(100/60)+(100/40)+(100/60) = 2,5+1,67+2,5+1,67 = <strong>8,33</strong> (df=1, kritis 3,84) → <strong>tolak H0</strong>: ada asosiasi.</p>
              <p><strong>3.</strong> Saat statistiknya <em>tidak standar</em> (rasio, persentil, selisih median kompleks) — nonparametrik klasik hanya punya &ldquo;menu&rdquo; tetap (median, rank); bootstrap bisa untuk <em>statistik apapun</em>.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Mengapa Mann-Whitney kebal terhadap outlier Rp400 juta dalam contoh bonus?"
        options={[
          "Karena outlier dihapus otomatis",
          "Karena ia memakai peringkat — Rp400 juta hanya jadi 'peringkat 1', besarnya nilai tidak dihitung",
          "Karena n besar",
          "Karena datanya normal",
        ]}
        correct={1}
        explanation="Benar. Ranking membuang informasi 'berapa besar', menyisakan 'urutan'. Outlier ekstrem hanya mendapat satu peringkat teratas — kekuatannya dinetralkan. Inilah harga sekaligus keunggulan: sedikit kurang power jika data normal, tapi tidak pernah tertipu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Data kepuasan ordinal (1–5) dua grup. Mengapa uji-t bermasalah secara konsep?"
        options={[
          "Karena n selalu kecil",
          "Karena selisih skor (4−3 vs 3−2) belum tentu bermakna sama — mean dari ordinal tidak valid secara ketat",
          "Karena uji-t terlalu lambat",
          "Tidak bermasalah sama sekali",
        ]}
        correct={1}
        explanation="Benar. Uji-t mengasumsikan skala interval (jarak antar nilai bermakna). Pada ordinal, yang valid hanya urutan — wilayah Mann-Whitney. Praktiknya uji-t sering 'lolos' untuk n besar, tapi secara prinsip ranking lebih tepat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Tabel 2×2 dengan expected count 2,1 di satu sel. Uji yang tepat?"
        options={[
          "Chi-square — selalu valid",
          "Fisher exact — expected < 5 membuat aproksimasi chi-square tidak andal",
          "Uji-t",
          "ANOVA",
        ]}
        correct={1}
        explanation="Benar. Aturan praktis: expected ≥ 5 untuk chi-square. Di bawah itu pakai Fisher yang menghitung p-value persis via hipergeometrik. Tabel jarang (fraud, default langka) adalah kasus klasiknya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dua grup punya mean dan median IDENTIK, tapi satu bimodal dan satu unimodal. Uji mana yang paling mungkin mendeteksi perbedaan?"
        options={[
          "Uji-t",
          "Mann-Whitney",
          "Kolmogorov–Smirnov — ia membandingkan seluruh bentuk distribusi (D = celah CDF maksimum), bukan cuma lokasi",
          "Chi-square",
        ]}
        correct={2}
        explanation="Benar. Uji-t dan Mann-Whitney fokus pada lokasi (mean/dominansi) — keduanya buta terhadap perbedaan bentuk murni. KS melihat seluruh CDF sehingga menangkap bimodalitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Studi sebelum–sesudah (n=25), selisih sangat miring karena 2 pasien ekstrem. Pilihan terbaik?"
        options={[
          "Uji-t berpasangan — n=25 cukup untuk CLT",
          "Wilcoxon signed-rank — berpasangan (membuang noise antar-subjek) + ranking (kebal 2 ekstrem)",
          "Mann-Whitney",
          "Chi-square",
        ]}
        correct={1}
        explanation="Benar. Dua kebutuhan sekaligus: desain berpasangan (bukan independen → bukan Mann-Whitney) dan ketahanan terhadap kemiringan (bukan uji-t). Wilcoxon signed-rank memenuhi keduanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Chi-square signifikan untuk tabel 3×3. Apa yang TIDAK boleh disimpulkan langsung?"
        options={[
          "Ada hubungan antara kedua variabel",
          "Pasangan sel/kategori mana yang menyebabkan hubungan itu — butuh analisis kontribusi per sel / post-hoc",
          "Derajat bebasnya 4",
          "Sampelnya cukup besar",
        ]}
        correct={1}
        explanation="Benar — analog dengan ANOVA: chi-square signifikan hanya bilang 'ada hubungan', tidak bilang 'di mana'. Lihat kontribusi (O−E)²/E per sel untuk menemukan sel-sel pencuriga, lalu uji lanjutan dengan koreksi."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Filosofi:</strong> ranking membuang &ldquo;berapa besar&rdquo;, menyimpan &ldquo;urutan&rdquo; — kebal outlier, bebas asumsi distribusi.</li>
          <li><strong>Mann-Whitney U:</strong> <Tex math={String.raw`U = R_1 - n_1(n_1+1)/2`} /> — uji dominansi stokastik dua grup independen.</li>
          <li><strong>Wilcoxon signed-rank:</strong> padanan berpasangan — peringkat selisih bertanda.</li>
          <li><strong>Chi-square:</strong> <Tex math={String.raw`\chi^2 = \sum (O-E)^2/E`} /> — independensi &amp; goodness-of-fit; syarat expected ≥ 5.</li>
          <li><strong>Fisher exact:</strong> p-value persis via hipergeometrik — untuk tabel jarang.</li>
          <li><strong>KS:</strong> <Tex math={String.raw`D = \sup|F_1 - F_2|`} /> — pembanding seluruh bentuk distribusi.</li>
          <li><strong>Peta:</strong> miring/ordinal → ranking; tabel padat → chi-square; tabel jarang → Fisher; beda bentuk → KS.</li>
          <li><strong>Jangan:</strong> memaksakan uji-t pada ordinal/miring parah; percaya chi-square saat expected &lt; 5; mengklaim &ldquo;beda median&rdquo; dari Mann-Whitney tanpa cek bentuk.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a25-uji-t-anova" className="btn btn-secondary btn-sm">← A2.5</Link>
        <Link href="/learn/a27-effect-size" className="btn btn-primary btn-sm">Next: A2.7 →</Link>
      </div>
    </div>
  );
}
