"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi6AlignmentPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi6MatData = [{"z": [[4, 0, 1, 2, 4], [2, 6, 2, 3, 2], [0, 4, 8, 4, 5], [-1, 2, 6, 10, 6]], "x": ["-", "A", "G", "T"], "y": ["-", "A", "C", "G", "T"], "type": "heatmap", "colorscale": "Blues", "showscale": true}];
  const bi6MatDataLayout = {"xaxis": {"title": "AGT"}, "yaxis": {"title": "ACGT"}, "showlegend": false};

  const lab1Code = "def needleman_wunsch(x, y, match=2, mismatch=-1, gap=-2):\n    n, m = len(x), len(y)\n    F = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1): F[i][0] = i*gap\n    for j in range(1, m+1): F[0][j] = j*gap\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            s = match if x[i-1] == y[j-1] else mismatch\n            F[i][j] = max(F[i-1][j-1]+s, F[i-1][j]+gap, F[i][j-1]+gap)\n    # traceback\n    ax, ay, i, j = [], [], n, m\n    while i > 0 or j > 0:\n        s = match if (i>0 and j>0 and x[i-1]==y[j-1]) else mismatch\n        if i>0 and j>0 and F[i][j] == F[i-1][j-1]+s:\n            ax.append(x[i-1]); ay.append(y[j-1]); i-=1; j-=1\n        elif i>0 and F[i][j] == F[i-1][j]+gap:\n            ax.append(x[i-1]); ay.append('-'); i-=1\n        else:\n            ax.append('-'); ay.append(y[j-1]); j-=1\n    return F[n][m], ''.join(ax[::-1]), ''.join(ay[::-1])\nskor, a1, a2 = needleman_wunsch('ACGT', 'AGT')\nprint(f'skor = {skor} (harus 4)')\nprint(a1)\nprint(a2)\nprint()\nprint('Coba: needleman_wunsch(\"GATTACA\", \"GCATGCU\")')";

  const lab2Code = "# BLOSUM mini: substitusi konservatif dihargai\nblosum_mini = {('L','I'): 2, ('I','L'): 2, ('L','P'): -3, ('P','L'): -3}\ndef skor(a, b, matriks=None):\n    if a == b: return 4\n    if matriks: return matriks.get((a,b), -2)\n    return -1  # seragam\ndef skor_alignment(s1, s2, matriks=None):\n    return sum(skor(a, b, matriks) for a, b in zip(s1, s2))\ns1, s2 = 'MLI', 'MII'  # L->I konservatif\ns3 = 'MPI'             # L->P radikal\nprint(f'MLI vs MII: seragam={skor_alignment(s1,s2)}, BLOSUM={skor_alignment(s1,s2,blosum_mini)}')\nprint(f'MLI vs MPI: seragam={skor_alignment(s1,s3)}, BLOSUM={skor_alignment(s1,s3,blosum_mini)}')\nprint()\nprint('Skema seragam: kedua substitusi = -1 (buta kimia).')\nprint('BLOSUM: L->I = +2 (wajar), L->P = -3 (radikal).')\nprint('Biologi > matematika buta.')";

  const bi6SpeedData = [{"x": ["Smith-Waterman", "BLAST"], "y": [100, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["100x", "1x"], "textposition": "outside"}];
  const bi6SpeedDataLayout = {"xaxis": {"title": "Algoritma"}, "yaxis": {"title": "Waktu relatif", "type": "log"}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI6 &mdash; Bioinformatics</span>
        <h1 className="display-title">Alignment &amp; BLAST:<br />Menyelaraskan Sekuens</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Satu Huruf yang Menyelamatkan</a></li>
          <li><a href="#global">Global vs Lokal: Needleman-Wunsch &amp; Smith-Waterman</a></li>
          <li><a href="#blosum">Matriks Skor: BLOSUM &amp; Gap Penalty</a></li>
          <li><a href="#blast">BLAST &amp; MSA</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Needleman-Wunsch Manual</a></li>
          <li><a href="#lab2">🔬 Lab 2: Skor Alignment &amp; Efek Gap Penalty</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Statistik di Balik Skor</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Mengidentifikasi Patogen Misterius</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>alignment global vs lokal</strong> dan memilih yang tepat.</li>
          <li>Menjalankan <strong>Needleman-Wunsch</strong> manual pada sekuens pendek (dynamic programming).</li>
          <li>Menjelaskan peran <strong>matriks substitusi (BLOSUM)</strong> dan <strong>gap penalty</strong>.</li>
          <li>Menggunakan logika <strong>BLAST</strong> (seed-and-extend, E-value) dan membaca hasil MSA.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Satu Huruf yang Menyelamatkan</h2>
      <div className="story">
        <p>2019: sekuens virus misterius dari Wuhan di-upload ke database. Dalam hitungan jam, alignment menunjukkan ia 96% mirip virus kelelawar — bukan flu biasa. <strong>Satu alignment mengubah respons dunia.</strong> Tanpa algoritma penyelarasan sekuens, genom hanyalah huruf acak.</p>
      <p>Alignment adalah operasi paling fundamental bioinformatika: membandingkan dua sekuens huruf-per-huruf untuk menemukan kemiripan, perbedaan, dan hubungan evolusi. Lesson ini membedah mesinnya — dari dynamic programming klasik sampai BLAST yang mencari di lautan data.</p>
      <p>Twist-nya: angka “96% mirip” itu nyaris tidak berarti apa-apa tanpa statistik di belakangnya. Dua sekuens acak sepanjang 30.000 basa pun bisa “mirip” di sana-sini — yang membedakan temuan nyata dari kebetulan adalah <strong>E-value</strong>, bukan persen identitas. Dan ada twist kedua yang lebih dalam: alignment “terbaik secara matematis” belum tentu benar secara biologi — skor BLOSUM dan gap penalty adalah <strong>asumsi evolusi yang disamarkan sebagai angka</strong>. Pilih matriks yang salah, dan algoritma dengan patuh menghasilkan jawaban yang salah secara biologi.</p>
      </div>

      <h2 id="global">Global vs Lokal — Dua Cara Menyelaraskan</h2>
      <p><strong>Definisi.</strong> <strong>Global (Needleman-Wunsch)</strong>: selaraskan SELURUH sekuens ujung-ke-ujung. <strong>Lokal (Smith-Waterman)</strong>: cari segmen PALING MIRIP, abaikan sisa. Keduanya memakai <strong>dynamic programming</strong>: isi matriks skor, lalu traceback.</p>
      <Tex math={String.raw`F(i,j) = \max \begin{cases} F(i-1,j-1) + s(x_i, y_j) \\ F(i-1,j) - d \\ F(i,j-1) - d \end{cases}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`F(i,j)`} />: skor terbaik alignment prefix x[1..i], y[1..j]</li>
          <li><Tex math={String.raw`s(x_i, y_j)`} />: skor substitusi (match/mismatch, dari BLOSUM)</li>
          <li><Tex math={String.raw`d`} />: gap penalty</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rekurens ini berkata: untuk tiap sel, pilih yang terbaik dari (diagonal: sejajarkan dua huruf; atas/kiri: buka gap). Smith-Waterman menambah opsi ke-4: 0 (mulai baru → lokal). Traceback dari skor maksimum = alignment optimal.</p>
      <details className="worked">
        <summary>📐 Contoh: NW untuk ACGT vs AGT (match +2, mismatch −1, gap −2)</summary>
        <p>Matriks 5×4; isi baris-per-baris dengan rekurens.<br />Skor akhir F(4,3) = <strong>4</strong>.<br />Traceback → alignment:<br />A C G T<br />A - G T &nbsp; (gap di C; skor = 2+2+2−2 = 4)<br />Coba di Lab 1 dan verifikasi angkanya!</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Global itu seperti membandingkan dua buku halaman-per-halaman (untuk edisi yang mirip). Lokal itu seperti mencari kutipan yang diplagiat di antara dua buku (untuk fragmen mirip di tengah teks beda).</p>
      <p><strong>Kapan memakai:</strong> Sekuens seukuran &amp; homolog → global. Cari domain/motif dalam sekuens panjang → lokal. Mapping NGS memakai varian lokal (semi-global).</p>

      <PlotlyChart
        data={bi6MatData}
        title="Matriks DP Needleman-Wunsch: ACGT vs AGT"
        layout={bi6MatDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Heatmap skor F(i,j). Baris = ACGT, kolom = AGT. Warna makin biru = skor makin tinggi. Jejak traceback = jalur biru tua dari kanan-bawah.</p>
        <p><strong>Interpretasi:</strong> Skor mengalir dari kiri-atas ke kanan-bawah; jalur optimal (traceback) memilih diagonal saat huruf cocok (A-A, G-G, T-T) dan mengambil gap di C. Inilah dynamic programming secara visual: keputusan lokal optimal → solusi global optimal.</p>
      </div>

      <h2 id="blosum">Matriks Skor: BLOSUM &amp; Gap Penalty — Si Juri</h2>
      <p><strong>Definisi.</strong> <strong>BLOSUM62</strong>: skor substitusi asam amino dari alignment blok terkurasi — positif untuk substitusi yang sering terjadi di alam (konservatif), negatif untuk yang jarang. <strong>Gap penalty</strong>: affine (buka mahal, perpanjang murah) karena indel biologis biasanya sekaligus.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca BLOSUM62</summary>
        <p>W↔W = <strong>11</strong> (triptofan langka &amp; unik → match sangat informatif).<br />L↔I = <strong>2</strong> (keduanya hidrofobik → substitusi wajar, skor positif!).<br />L↔P = <strong>−3</strong> (sifat beda jauh → dihukum.<br />Pelajaran: alignment protein memakai pengetahuan kimia, bukan sekadar “sama/tidak”.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> BLOSUM itu seperti juri yang tahu “mengganti Leusin dengan Isoleusin (mirip) = pelanggaran ringan; mengganti dengan Prolin (pembengkok) = pelanggaran berat”. Bukan semua mismatch sama!</p>
      <p><strong>Kapan memakai:</strong> Protein jauh (evolusi jauh) → BLOSUM45; dekat → BLOSUM80; default BLOSUM62. DNA → matriks sederhana (+2/−1 umum).</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">BLOSUM62 (cuplikan):
    A  R  N  D  C
A   4 -1 -2 -2  0
R  -1  5  0 -2 -3
N  -2  0  6  1 -3
W  -4 -3 -4 -4 11  &lt;- match langka = skor tinggi</pre>

      <h2 id="blast">BLAST &amp; MSA — Si Pencari dan Si Rapat</h2>
      <p><strong>Definisi.</strong> <strong>BLAST</strong>: cari sekuens mirip di database raksasa via <em>seed-and-extend</em> (cocokkan kata pendek, perluas yang menjanjikan) — heuristik, 100x lebih cepat dari Smith-Waterman. <strong>E-value</strong>: jumlah hit sebaik ini yang diharapkan secara acak. <strong>MSA</strong>: selaraskan BANYAK sekuens sekaligus (Clustal/MUSCLE/MAFFT) untuk melihat posisi konservatif.</p>
      <Tex math={String.raw`E = K \cdot m \cdot n \cdot e^{-\lambda S}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`E`} />: E-value: hit acak sebaik skor S yang diharapkan</li>
          <li><Tex math={String.raw`m, n`} />: panjang query dan database</li>
          <li><Tex math={String.raw`S`} />: skor alignment</li>
      </ul>
      <p><strong>Interpretasi:</strong> E=10^-50 = mustahil kebetulan → homologi nyata. E=5 = bisa kebetulan — abaikan. E-value tergantung UKURAN database: database 10x lipat → E 10x besar untuk hit sama. Jangan bandingkan E-value lintas database!</p>
      <details className="worked">
        <summary>📐 Contoh: membaca hasil BLAST</summary>
        <p>Query: gen resistensi antibiotik. Hit terbaik: E=1e-80, identitas 98%, coverage 100% → <strong>gen sama</strong>.<br />Hit kedua: E=1e-12, identitas 45% → homolog jauh, fungsi mungkin mirip.<br />Hit ketiga: E=2,3 → noise, abaikan.<br /><strong>MSA</strong> 10 homolog: kolom yang 100% konservatif (mis. situs aktif enzim) = posisi fungsional penting → mutasi di sana patut dicurigai (lihat BI1!).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> BLAST itu seperti Google untuk DNA: tidak membaca seluruh internet (terlalu lambat), tapi pakai indeks kata (seed) lalu periksa yang cocok. E-value itu seperti “jumlah hasil kebetulan yang diharapkan” — makin kecil makin bisa dipercaya.</p>
      <p><strong>Kapan memakai:</strong> Identifikasi sekuens tak dikenal, cari homolog, anotasi fungsi via kemiripan. MSA untuk evolusi, motif, dan prediksi situs fungsional.</p>
      <div className="callout callout-warning"><strong>Kemiripan ≠ fungsi sama</strong> (tapi strongly suggestive). Homolog jauh bisa neofungsionalisasi. Selalu validasi dengan bukti tambahan — BLAST adalah hipotesis, bukan vonis.</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Persen identitas tinggi = pasti fungsi sama&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 80% identitas biasanya aman; 30% (twilight zone) = tidak bisa disimpulkan fungsi. Paralog (duplikasi gen) bisa sangat mirip tapi beda fungsi. Cek: coverage penuh? domain konservatif? bukti eksperimental?</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;E-value kecil selalu berarti penting secara biologis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> E-value mengukur signifikansi statistik, bukan biologis. Hit dengan E=1e-100 tapi hanya 20 basa = mungkin repeat/artefak. Lihat juga identitas, coverage, dan konteks.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Alignment terbaik = kebenaran evolusi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Alignment optimal menurut SKOR, bukan menurut sejarah. Skor tergantung matriks + gap penalty yang kamu pilih. Untuk klaim evolusi, butuh model filogenetik (BI7), bukan sekadar alignment.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk BLAST: perhatikan <strong>query coverage</strong> selain E-value. Hit 100% identik tapi hanya 10% query = domain kecil, bukan gen sama.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Pilih algoritma sesuai ukuran: <strong>2 sekuens</strong> → NW/SW; <strong>database raksasa</strong> → BLAST; <strong>banyak sekuens</strong> → MSA (MAFFT untuk besar).</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu <strong>mask repeat/low-complexity</strong> sebelum BLAST genomik. Tanpa itu, hit didominasi sampah repetitif.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Needleman-Wunsch dari Nol</h2>
      <p>Implementasi NW lengkap: isi matriks DP + traceback. Verifikasi contoh ACGT vs AGT dari lesson (skor harus 4).</p>
      <PyodideLab
        title="🔬 Lab 1: Needleman-Wunsch dari Nol"
        hint="Ubah gap penalty -2 → -5. Apakah alignment berubah? Gap mahal = alignment lebih suka mismatch. Inilah sensitivitas parameter."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Efek Gap Penalty &amp; Matriks Skor</h2>
      <p>Bandingkan alignment dua sekuens protein pendek dengan BLOSUM sederhana vs match/mismatch seragam. Lihat substitusi konservatif dihargai.</p>
      <PyodideLab
        title="🔬 Lab 2: Efek Gap Penalty &amp; Matriks Skor"
        hint="Ganti L→I (konservatif) vs L→P (radikal) pada sekuens. Dengan BLOSUM, yang pertama hampir tidak dihukum — dengan skema seragam, keduanya sama. Itulah nilai matriks biologis."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Dua sekuens seukuran &amp; homolog → Needleman-Wunsch</h3>
        <p><strong>Kondisi:</strong> Bandingkan gen lengkap antar spesies dekat.</p>
        <p><strong>Kenapa:</strong> Optimal global; sederhana.</p>
        <p><strong>Contoh nyata:</strong> Gen insulin manusia vs tikus.</p>
      </div>
      <div className="decision-card">
        <h3>2. Cari motif/domain dalam sekuens panjang → Smith-Waterman / lokal</h3>
        <p><strong>Kondisi:</strong> Hanya segmen yang mirip.</p>
        <p><strong>Kenapa:</strong> Global akan memaksa alignment sampah di ujung.</p>
        <p><strong>Contoh nyata:</strong> Domain kinase dalam protein besar.</p>
      </div>
      <div className="decision-card">
        <h3>3. Cari di database raksasa → BLAST</h3>
        <p><strong>Kondisi:</strong> Query vs jutaan sekuens.</p>
        <p><strong>Kenapa:</strong> Heuristik seed-and-extend: cepat dengan sensitivitas cukup.</p>
        <p><strong>Contoh nyata:</strong> Identifikasi sekuens virus misterius.</p>
      </div>
      <div className="decision-card">
        <h3>4. Banyak sekuens, lihat konservasi → MSA (MAFFT/MUSCLE)</h3>
        <p><strong>Kondisi:</strong> &gt;3 sekuens; butuh kolom konservatif.</p>
      <PlotlyChart
        data={bi6SpeedData}
        title="Waktu Relatif: SW vs BLAST (database besar)"
        layout={bi6SpeedDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Perbandingan waktu pencarian satu query di database besar.</p>
        <p><strong>Interpretasi:</strong> BLAST ~100x lebih cepat karena heuristik seed — dengan mengorbankan jaminan optimalitas. Untuk database raksasa, SW eksak tidak praktis. Inilah trade-off fundamental: kecepatan vs jaminan.</p>
      </div>
        <p><strong>Kenapa:</strong> Reveals posisi fungsional; input filogenetika.</p>
        <p><strong>Contoh nyata:</strong> MSA 50 sekuens spike protein.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Global untuk seukuran; lokal untuk motif.</li>
          <li>BLOSUM untuk protein; bukan semua mismatch sama.</li>
          <li>E-value kecil + coverage penuh = percaya.</li>
          <li>Kemiripan = hipotesis, bukan vonis fungsi.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Gen Resistensi yang “Ditemukan”</h2>
      <div className="callout">
        <p>RS menemukan bakteri resisten. Sekuensing satu gen → BLAST → hit 99% identitas ke gen resistensi di database, E=1e-120. Tim menyimpulkan: “bakteri ini resisten via gen X” dan mengganti antibiotik.</p>
      <p>Reviewer bertanya: (1) coverage query berapa? (2) apakah gen X memang fungsional (bukan pseudogen)? (3) apakah fenotipe resistensi diuji di lab?</p>
        <p><strong>Pertanyaan:</strong> Evaluasi kesimpulan tim dan lengkapi buktinya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>BLAST saja tidak cukup untuk vonis fungsional. (1) Coverage: bila hanya 30% query ter-align, itu domain umum bukan gen utuh. (2) Cek frameshift/stop prematur — pseudogen mirip tapi mati (lihat BI1!). (3) Uji fenotipe (MIC) adalah bukti emas; genotipe tanpa fenotipe = prediksi. (4) Cek konteks genomik: gen di plasmid (mobile) vs kromosom. Kesimpulan benar: “kandidat gen X terdeteksi; butuh uji MIC + cek integritas ORF sebelum ganti terapi.” Pelajaran: alignment memberi hipotesis tercepat di dunia — tapi hipotesis tetap harus diuji.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Statistik di Balik Skor</h2>
      <p>Needleman-Wunsch memberimu skor. BLAST memberimu E-value. Tapi angka-angka ini <strong>bukan</strong> vonis biologi — mereka adalah jawaban atas pertanyaan statistik yang spesifik. Pendalaman ini memastikan kamu tahu pertanyaan apa yang sebenarnya dijawab.</p>

      <h3>1. E-value: “seberapa sering kebetulan semirip ini?”</h3>
      <p>E-value menjawab: <em>jika saya mencari di database acak sebesar ini, berapa hit dengan skor ≥ S yang saya harapkan murni karena kebetulan?</em> Rumus Karlin-Altschul:</p>
      <Tex math={String.raw`E = K \cdot m \cdot n \cdot e^{-\lambda S}`} block />
      <p><strong>Artinya tiap simbol:</strong> E = jumlah hit kebetulan yang diharapkan; m = panjang query; n = ukuran database (total huruf); S = skor alignment mentah; K dan λ (lambda) = parameter statistik yang diturunkan dari sistem skor (matriks substitusi + gap penalty) — bukan angka bebas.</p>
      <details className="worked">
        <summary>📐 Contoh: E-value vs ukuran database</summary>
        <p>Query 300 asam amino (m = 300), skor S sedemikian sehingga e<sup>−λS</sup> = 10<sup>−12</sup>, K ≈ 0,1.<br />
        Database kecil (n = 10<sup>6</sup> huruf): E = 0,1 × 300 × 10<sup>6</sup> × 10<sup>−12</sup> = <strong>3×10<sup>−5</sup></strong> → signifikan! Kebetulan semirip ini hampir mustahil.<br />
        Database 1000x lebih besar (n = 10<sup>9</sup>): E = <strong>0,03</strong> → masih OK (&lt; 1).<br />
        Database 100.000x (n = 10<sup>11</sup>, mis. metagenomik raksasa): E = <strong>3</strong> → TIDAK signifikan lagi! Skor yang <em>sama persis</em>, kesimpulan <em>berbalik</em>.<br />
        <strong>Interpretasi:</strong> E-value menghukum pencarian di lautan besar — makin besar database, makin mudah kebetulan terlihat meyakinkan. “Signifikan” selalu relatif terhadap ukuran kolam.</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: E-value bukan p-value (tapi mirip)</strong></p>
        <p>E &lt; 0,01 ≈ “kebetulan hampir mustahil” (seperti p kecil). Tapi E <strong>bisa &gt; 1</strong> (mis. E = 3 artinya “harapkan 3 hit kebetulan”) — p-value tidak bisa begitu. Jangan baca E = 2 sebagai “signifikan 2%”; ia berarti “sampah yang diharapkan”.</p>
      </div>

      <h3>2. Persen identitas menipu; coverage bicara</h3>
      <p>“99% identik” terdengar meyakinkan — sampai kamu tahu alignment-nya hanya 20 basa dari query 1.000 basa. Identitas tinggi × coverage rendah = <strong>kecocokan domain kecil</strong>, bukan homologi gen. Selalu baca tiga angka: identitas, coverage query, dan E-value — ketiganya, bukan satu.</p>
      <details className="worked">
        <summary>📐 Contoh: dua hit, satu menipu</summary>
        <p>Query: gen resistensi antibiotik, 900 basa.<br />
        Hit A: 99% identitas, alignment 45 basa, E = 0,4 → <strong>buang</strong>: hanya motif pendek yang cocok (mungkin domain umum), kebetulan diharapkan.<br />
        Hit B: 78% identitas, alignment 870 basa (97% query), E = 10<sup>−120</sup> → <strong>homolog sejati</strong>: identitas lebih rendah tapi mencakup hampir seluruh gen dengan statistik mustahil-kebetulan.<br />
        Pemula memilih A (“99% kan lebih tinggi!”). Profesional memilih B. Inilah bedanya membaca angka vs memahami angka.</p>
      </details>

      <h3>3. Matriks skor = hipotesis evolusi yang disamarkan</h3>
      <p>BLOSUM62 dibangun dari blok alignment protein berkerabat: skor W↔W = 11 (triptofan langka &amp; unik → substitusi W→W sangat informatif), sedangkan A↔S kecil (sering tertukar secara evolusi → tidak informatif). Memakai BLOSUM62 berarti berasumsi <strong>jarak evolusi sedang</strong>; untuk kerabat sangat jauh, BLOSUM45 lebih tepat; untuk sangat dekat, BLOSUM80.</p>
      <p>Gap penalty pun asumsi biologi: <em>affine gap</em> (buka mahal, perpanjang murah) mencerminkan bahwa <strong>satu delesi 10 basa (satu kejadian evolusi) lebih mungkin daripada 10 delesi 1 basa</strong>. Parameter = pengetahuan biologi yang dikodekan sebagai angka. Ganti parameter tanpa alasan = ganti hipotesis tanpa sadar.</p>

      <h3>Kasus nyata: alignment yang mengubah respons dunia</h3>
      <p>Kembali ke cerita pembuka: sekuens SARS-CoV-2 vs virus kelelawar RaTG13, ~96% identitas di 30.000 basa dengan E-value ≈ 0 (di bawah presisi komputer). Bukan “mirip” — secara statistik <strong>mustahil kebetulan</strong>. Tapi para ahli tetap hati-hati: 4% perbedaan di 30.000 basa = ~1.200 mutasi, termasuk di protein spike — cukup untuk sifat penularan yang sangat berbeda. <strong>Alignment memberi tahu “berkerabat”; ia tidak memberi tahu “sama berbahayanya”.</strong> Angka yang benar, dibaca dengan kerendahan hati yang benar.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Mengidentifikasi Patogen Misterius</h2>
      <p>RS mengirim sekuens 800 basa dari kultur darah pasien sepsis — “bakteri tidak teridentifikasi”. Tugasmu: BLAST ke database, putuskan patogennya, dan tentukan <strong>seberapa yakin</strong> kamu. Ini forensik alignment dengan taruhan nyawa.</p>

      <h3>Hasil BLAST: tiga hit, satu keputusan</h3>
      <ul>
        <li><strong>Hit 1:</strong> <em>Klebsiella pneumoniae</em> — 99,5% identitas, coverage 98%, E = 0. → Kandidat kuat.</li>
        <li><strong>Hit 2:</strong> <em>Klebsiella variicola</em> — 97% identitas, coverage 98%, E = 0. → Kerabat dekat!</li>
        <li><strong>Hit 3:</strong> <em>E. coli</em> — 92% identitas, coverage 60%, E = 10<sup>−80</sup>. → Genus beda, abaikan.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: kapan 99,5% tidak cukup</summary>
        <p><em>K. pneumoniae</em> vs <em>K. variicola</em>: keduanya patogen, tapi profil resistensi antibiotik <strong>berbeda</strong> (variicola sering lebih resisten). 99,5% vs 97% pada 800 basa = selisih ~20 basa — cukup untuk membedakan spesies pada gen 16S? <strong>Belum tentu</strong>: 16S tidak selalu memisahkan spesies Klebsiella.<br />
        Keputusan profesional: laporkan “<strong><em>Klebsiella pneumoniae</em> complex</strong> (kemungkinan <em>K. pneumoniae</em>; <em>K. variicola</em> tidak dapat disingkirkan dari 16S saja)” + rekomendasi: konfirmasi dengan <strong>rpoB</strong> atau WGS.<br />
        <strong>Interpretasi:</strong> alignment memberi <strong>batas pengetahuan</strong>, bukan sekadar jawaban. Melaporkan “99,5% = pasti pneumoniae” adalah klaim berlebihan yang bisa mengarahkan antibiotik yang salah. Kejujuran tentang resolusi = keselamatan pasien.</p>
      </details>

      <h3>Cek kontaminasi: hit yang “terlalu bagus”</h3>
      <p>Sebelum percaya Hit 1, cek: apakah sekuens query mengandung <strong>adaptor/primer</strong>? BLAST juga mengembalikan hit ke “cloning vector” dengan E = 10<sup>−50</sup> — 60 basa ujung query = sekuens vektor kloning! Trim dulu, BLAST ulang. Pelajaran: <strong>selalu curigai ujung sekuens</strong> — artefak lab suka bersembunyi di sana.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Database menentukan jawaban</strong></p>
        <p>BLAST ke <strong>nt</strong> (semua) vs <strong>RefSeq</strong> (kurasi) bisa memberi jawaban beda: nt mengandung sekuens salah anotasi (“<em>E. coli</em>” yang sebenarnya kontaminan). Untuk identifikasi klinis: pakai database kurasi (RefSeq/GTDB), dan untuk klaim spesies baru: butuh <strong>pohon filogenetik</strong> (BI7), bukan sekadar BLAST top-hit. Top-hit ≠ kebenaran taksonomi.</p>
      </div>

      <h3>Waktu respons</h3>
      <p>Dari sekuens masuk ke laporan: <strong>45 menit</strong> (BLAST 10 menit, analisis 30 menit, tulis laporan 5 menit). Pasien sepsis butuh antibiotik tepat dalam hitungan jam — alignment di sini bukan latihan akademik, melainkan <strong>bagian dari rantai perawatan</strong>. Kecepatan tanpa ketelitian membunuh; ketelitian tanpa kecepatan juga membunuh. Profesional menyeimbangkan keduanya — dan mendokumentasikan ketidakpastiannya.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kapan pakai Smith-Waterman (lokal) bukan Needleman-Wunsch?"
        options={["Selalu",
          "Mencari segmen mirip (domain/motif) dalam sekuens panjang yang berbeda",
          "Tidak pernah",
          "Hanya untuk DNA"]}
        correct={1}
        explanation="Benar: lokal mengabaikan sisa sekuens. Global memaksa ujung-ke-ujung — buruk untuk fragmen."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam rekurens DP, opsi F(i-1,j) − d artinya…"
        options={["Match",
          "Buka/perpanjang gap di sekuens y (huruf x[i] tidak punya pasangan)",
          "Selesai",
          "Mismatch"]}
        correct={1}
        explanation="Benar: gerakan vertikal = gap. Tiga opsi = diagonal (sejajarkan), atas/bawah (gap)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. BLOSUM62 memberi L↔I skor +2 karena…"
        options={["Kebetulan",
          "Keduanya hidrofobik — substitusi konservatif yang sering terjadi di alam",
          "Hurufnya mirip",
          "Selalu positif"]}
        correct={1}
        explanation="Benar: matriks dari data evolusi nyata. Tidak semua mismatch sama — kimia menentukan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. E-value = 1e-50 vs E-value = 3. Yang dipercaya?"
        options={["E=3",
          "E=1e-50 (mustahil kebetulan)",
          "Sama",
          "Tidak ada"]}
        correct={1}
        explanation="Benar: E = hit acak yang diharapkan. 1e-50 = praktis mustahil acak → homologi nyata."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. BLAST 100x lebih cepat dari Smith-Waterman karena…"
        options={["Komputer lebih cepat",
          "Heuristik seed-and-extend: hanya periksa kandidat menjanjikan",
          "Database kecil",
          "Sihir"]}
        correct={1}
        explanation="Benar: korbankan jaminan optimalitas demi kecepatan. Untuk DB raksasa, ini satu-satunya cara praktis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Hit BLAST 100% identitas tapi query coverage 15%. Interpretasi?"
        options={["Gen sama persis",
          "Hanya domain kecil yang cocok — bukan bukti gen sama; cek coverage!",
          "Pasti fungsional",
          "Abaikan E-value"]}
        correct={1}
        explanation="Benar: coverage sama pentingnya dengan identitas. Domain umum (mis. ATP-binding) ada di ratusan protein berbeda."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Global (NW)</strong>: ujung-ke-ujung; <strong>lokal (SW)</strong>: segmen terbaik; keduanya DP + traceback.</li>
          <li>Rekurens: max(diagonal + substitusi, atas/kiri − gap).</li>
          <li><strong>BLOSUM</strong>: skor dari evolusi nyata; tidak semua mismatch sama.</li>
          <li><strong>Gap affine</strong>: buka mahal, perpanjang murah.</li>
          <li><strong>BLAST</strong>: seed-and-extend; <strong>E-value</strong> = hit acak yang diharapkan.</li>
          <li>Cek <strong>identitas + coverage + konteks</strong> sebelum vonis.</li>
          <li><strong>MSA</strong>: kolom konservatif = posisi fungsional.</li>
          <li>Kemiripan = hipotesis tercepat; validasi = kewajiban.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi5-biopython-r" className="btn btn-secondary btn-sm">← BI5</Link>
        <Link href="/learn/bi7-filogenetika" className="btn btn-primary btn-sm">BI7 →</Link>
      </div>
    </div>
  );
}
