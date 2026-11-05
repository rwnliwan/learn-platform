import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B14MarkovChainPage() {
  const chart1 = [{"x": [0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20], "y": [0, 0.1, 0.106, 0.115, 0.121, 0.126, 0.13, 0.136, 0.14, 0.145, 0.147], "type": "scatter", "mode": "lines+markers", "name": "P(Telat → Macet dalam n bulan)", "line": {"color": "#2a7de1"}}];
  const chart2 = [{"x": ["Lancar", "Telat", "Macet"], "y": [0.86, 0.08, 0.06], "type": "bar", "name": "Stasioner", "marker": {"color": "#2a7de1"}}, {"x": ["Lancar", "Telat", "Macet"], "y": [0.5, 0.3, 0.2], "type": "bar", "name": "Awal (krisis)", "marker": {"color": "#e8a838"}}];
  const lab1Code = String.raw`P = [[0.95, 0.04, 0.01],
     [0.60, 0.30, 0.10],
     [0.10, 0.20, 0.70]]
status = ["Lancar", "Telat", "Macet"]

def matmul(A, B):
    n = len(A)
    return [[sum(A[i][k]*B[k][j] for k in range(n)) for j in range(n)] for i in range(n)]

def matpow(M, n):
    # identitas
    R = [[1.0 if i==j else 0.0 for j in range(len(M))] for i in range(len(M))]
    for _ in range(n):
        R = matmul(R, M)
    return R

P2 = matpow(P, 2)
print(f"P(Telat->Macet, 2 bln) = {P2[1][2]:.3f}")
P50 = matpow(P, 50)
print("Baris P^50 (harus SAMA semua -> stasioner):")
for i, row in enumerate(P50):
    print(f"  dari {status[i]:>6}: " + " ".join(f"{v:.3f}" for v in row))
print("\nCoba: ubah P[1] (baris Telat) jadi [0.4,0.3,0.3] (resesi).")
print("Bagaimana stasioner berubah? (sensitivitas!)")`;
  const lab2Code = String.raw`P = [[0.95, 0.04, 0.01],
     [0.60, 0.30, 0.10],
     [0.10, 0.20, 0.70]]

def vec_mul(v, M):
    return [sum(v[i]*M[i][j] for i in range(len(v))) for j in range(len(M))]

pi = [0.0, 1000.0, 0.0]  # mulai: 1000 Telat
print(f"Bulan  0: Lancar={pi[0]:6.0f} Telat={pi[1]:6.0f} Macet={pi[2]:6.0f}")
for b in range(1, 13):
    pi = vec_mul(pi, P)
    print(f"Bulan {b:>2}: Lancar={pi[0]:6.0f} Telat={pi[1]:6.0f} Macet={pi[2]:6.0f}")
print("\nCoba: skenario stress — P Macet->Macet 0.7->0.9 (susah sembuh).")
print("Bandingkan Macet bulan 12. Itulah nilai stress test!")`;
  const quizData = [{"question": "Sifat Markov artinya…", "options": ["Masa depan tergantung seluruh sejarah", "Masa depan hanya tergantung status kini", "Tidak ada keacakan", "Matriks harus simetris"], "correct": 1, "explanation": "Benar: P(X_{n+1}|X_n, sejarah) = P(X_{n+1}|X_n). Pelupa tapi powerful."}, {"question": "(P²)ᵢⱼ dihitung dengan…", "options": ["Kuadrat tiap elemen", "Perkalian matriks: Σₖ PᵢₖPₖⱼ (semua jalur 2-langkah)", "Pᵢⱼ × 2", "Akar matriks"], "correct": 1, "explanation": "Benar: Chapman-Kolmogorov — jumlahkan semua jalan via status antara."}, {"question": "Distribusi stasioner π memenuhi…", "options": ["π = Pπ", "π = πP dan Σπᵢ=1", "π = P²", "π = 0"], "correct": 1, "explanation": "Benar: eigenvector kiri eigenvalue 1 — &ldquo;takdir jangka panjang&rdquo;."}, {"question": "Status Default sebagai absorbing state artinya…", "options": ["Bisa keluar lagi", "Sekali masuk tak keluar (baris = [0,…,1])", "Tidak pernah dimasuki", "Transisinya acak"], "correct": 1, "explanation": "Benar: menyerap. Analisis fokus ke waktu/peluang absorbsi."}, {"question": "Kelemahan memakai matriks historis mentah…", "options": ["Tidak ada", "Transisi tidak stasioner — krisis mengubahnya; butuh skenario stress", "Matriks terlalu kecil", "Terlalu akurat"], "correct": 1, "explanation": "Benar: matriks 2019 ≠ matriks 2020. Butuh baseline + stress / bersyarat rezim."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B14 — Probabilitas</span>
        <h1 className="display-title">Markov Chain: Masa Depan<br/>Hanya Peduli Hari Ini</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Nasabah Ini Bulan Depan di Mana?&rdquo;</a></li>
          <li><a href="#sifat">Sifat Markov &amp; Matriks Transisi</a></li>
          <li><a href="#nlangkah">n Langkah — Pangkat Matriks</a></li>
          <li><a href="#stasioner">Distribusi Stasioner — Takdir Jangka Panjang</a></li>
          <li><a href="#rating">Aplikasi: Migrasi Rating &amp; Roll Rate</a></li>
          <li><a href="#lab1">🔬 Lab 1: Pangkat Matriks & Stasioner dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Roll Rate 12 Bulan — Prediksi Collection</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Markov Chain</a></li>
          <li><a href="#case">📋 Mini-Case: Vintage 2024 — Kapan Macetnya Puncak?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>sifat Markov</strong> dan matriks transisi.</li><li>Menghitung distribusi <strong>n-langkah</strong> dengan pangkat matriks.</li><li>Menemukan <strong>distribusi stasioner</strong> dan menafsirkannya.</li><li>Menerapkan pada <strong>migrasi rating &amp; roll rate</strong> kredit.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: &ldquo;Nasabah Ini Bulan Depan di Mana?&rdquo;</h2>

      <div className="story"><p>Bank memantau status tiap kredit tiap bulan: <strong>Lancar → Telat → Macet → Lunas/Gagal</strong>. Data historis: dari 1.000 yang &ldquo;Telat 30 hari&rdquo; bulan ini, 600 kembali lancar, 300 tetap telat, 100 jadi macet bulan depan.</p><p>Pertanyaan ajaib: <em>&ldquo;Dari 1.000 telat hari ini, berapa yang macet 6 bulan lagi?&rdquo;</em> Jawabannya tidak butuh simulasi rumit — cukup <strong>matriks transisi</strong> dipangkatkan 6. Dan lebih ajaib lagi: apapun kondisi awal, setelah lama, proporsi tiap status menuju <strong>distribusi stasioner</strong> — &ldquo;takdir jangka panjang&rdquo; portofolio.</p><p>Markov chain = mesin untuk semua sistem &ldquo;status berpindah&rdquo;: rating kredit, cuaca, antrean, PageRank Google.</p><p><strong>Twist-nya:</strong> &ldquo;takdir jangka panjang&rdquo; portofolio bisa dihitung <em>tanpa tahu kondisi awal</em> — matriks yang sama membawa 1.000 yang telat maupun 1.000 yang lancar menuju distribusi stasioner yang sama. Masa lalu menentukan <em>kecepatan</em> sampai, bukan <em>tempat</em> sampainya. Sistem yang &ldquo;lupa&rdquo; masa lalunya (memoryless) justru paling mudah diramal jangka panjangnya.</p></div>

      <h2 id="sifat">Sifat Markov &amp; Matriks Transisi</h2>

      <p><strong>Sifat Markov</strong> (memoryless untuk rantai):</p>

      <p><Tex math={String.raw`P(X_{n+1} = j \mid X_n = i, X_{n-1}, \ldots) = P(X_{n+1} = j \mid X_n = i) = P_{ij}`} block /></p>

      <p>&ldquo;Masa depan hanya peduli <strong>hari ini</strong>, bukan sejarah.&rdquo; <strong>Matriks transisi</strong> <Tex math={String.raw`P`} /> berisi semua <Tex math={String.raw`P_{ij}`} /> (baris = dari, kolom = ke; tiap baris jumlah = 1).</p>

      <p><strong>Contoh</strong> (status: Lancar, Telat, Macet):</p>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Dari \ Ke</th><th>Lancar</th><th>Telat</th><th>Macet</th></tr></thead>
<tbody>
<tr><td>Lancar</td><td>0,95</td><td>0,04</td><td>0,01</td></tr>
<tr><td>Telat</td><td>0,60</td><td>0,30</td><td>0,10</td></tr>
<tr><td>Macet</td><td>0,10</td><td>0,20</td><td>0,70</td></tr>
</tbody>
</table>
</div>

      <p><strong>Kepribadian:</strong> Markov chain adalah &ldquo;penumpang yang pelupa&rdquo; — ia hanya ingat stasiun saat ini untuk memutuskan stasiun berikutnya. Sederhana, tapi cukup untuk memodelkan sistem kompleks.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Cek kewarasan matriks: <strong>tiap baris jumlah = 1</strong> (dari satu status, pasti ke suatu status). Jika tidak = ada yang salah. Ini tes 5 detik yang menangkap banyak error.</p>
</div>

      <h2 id="nlangkah">n Langkah — Pangkat Matriks</h2>

      <p><Tex math={String.raw`P(X_{n} = j \mid X_0 = i) = (P^n)_{ij}`} block /></p>

      <p><strong>Contoh.</strong> Dari &ldquo;Telat&rdquo;, 2 bulan lagi di &ldquo;Macet&rdquo;? Hitung baris Telat × kolom Macet dari <Tex math={String.raw`P^2`} />:</p>

      <p><Tex math={String.raw`(P^2)_{\text{Telat}\to\text{Macet}} = 0{,}6\times0{,}01 + 0{,}3\times0{,}10 + 0{,}1\times0{,}70 = 0{,}106`} block /></p>

      <p>Tiga jalur: Telat→Lancar→Macet (0,006), Telat→Telat→Macet (0,03), Telat→Macet→Macet (0,07). <strong>Distribusi vektor:</strong> <Tex math={String.raw`\pi^{(n)} = \pi^{(0)} P^n`} />.</p>

      <details className="worked">
<summary>📐 Contoh: 6 bulan lagi</summary>
<p>Awal: 1.000 Telat → <Tex math={String.raw`\pi^{(0)} = (0, 1, 0)`} />.</p><p><Tex math={String.raw`P^6`} /> (hitung via lab): baris Telat ≈ (0,72; 0,13; 0,15).</p><p>Prediksi: <strong>720 lancar, 130 telat, 150 macet</strong>. Satu perkalian matriks menjawab &ldquo;6 bulan lagi&rdquo;!</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Pangkat matriks = pangkatkan tiap elemen.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> SALAH! <Tex math={String.raw`P^2`} /> adalah <strong>perkalian matriks</strong> (jumlahkan semua jalur 2-langkah), bukan kuadrat per elemen. (P²)ᵢⱼ = Σₖ PᵢₖPₖⱼ — &ldquo;semua jalan dari i ke j via k&rdquo;. Ini inti Chapman-Kolmogorov.</p>
</div>

      <h2 id="stasioner">Distribusi Stasioner — Takdir Jangka Panjang</h2>

      <p><Tex math={String.raw`\pi = \pi P, \qquad \sum_i \pi_i = 1`} block /></p>

      <p>&ldquo;Distribusi yang jika dicapai, tetap selamanya.&rdquo; Untuk rantai <strong>irreducible &amp; aperiodik</strong>, apapun awalnya → konvergen ke π (unik!).</p>

      <p><strong>Contoh.</strong> Selesaikan π = πP untuk matriks di atas: π ≈ <strong>(0,86; 0,08; 0,06)</strong>. Artinya: dalam jangka panjang, portofolio stabil di 86% lancar, 8% telat, 6% macet — <em>apapun</em> kondisi awal! (Cek via lab: P^50.)</p>

      <p><strong>Interpretasi bisnis:</strong> π adalah &ldquo;komposisi keseimbangan&rdquo; portofolio. Jika komposisi saat ini jauh dari π, ia akan &ldquo;melayang&rdquo; ke sana — prediksi struktural tanpa perlu forecast ekonomi!</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Distribusi stasioner = <strong>eigenvector kiri</strong> dengan eigenvalue 1. Tapi jangan takut aljabar linear: untuk 3–5 status, selesaikan sistem linear biasa (atau iterasikan P^n sampai stabil — lab!).</p>
</div>

      <h2 id="rating">Aplikasi: Migrasi Rating &amp; Roll Rate</h2>

      <ul>
<li><strong>Migrasi rating</strong> (AAA, AA, …, Default): matriks transisi tahunan dari data historis — fondasi <strong>CreditMetrics</strong> &amp; stress testing (MR7/CR16). Default = <strong>absorbing state</strong> (sekali masuk, tak keluar: baris = [0,…,1]).</li>
<li><strong>Roll rate</strong> (collection): status DPD per bulan — dipakai untuk prediksi &amp; strategi (ingat Lab B3!).</li>
<li><strong>Catatan jujur:</strong> transisi <strong>tidak stasioner</strong> — saat resesi, P(telat→macet) naik! Praktik benar: matriks <em>bersyarat rezim</em> (normal vs stress) atau time-varying.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Matriks transisi historis bisa dipakai mentah untuk forecast.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika dunia stasioner — padahal tidak. Matriks 2019 (tenang) meremehkan transisi buruk saat 2020. Solusi: <strong>dua matriks</strong> (baseline + stress), atau model transisi sebagai fungsi variabel makro. Markov memberi kerangka; isinya harus forward-looking.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Dari Telat ke Macet: Konvergensi ke Stasioner"
  layout={{"xaxis": {"title": "n (bulan)"}, "yaxis": {"title": "Peluang", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = horizon bulan; sumbu Y = peluang berada di status Macet setelah n bulan, mulai dari Telat.</p>
<p><strong>Interpretasi:</strong> Naik cepat di awal (jalur langsung), lalu melandai menuju ~15% (komponen stasioner untuk yang mulai dari Telat). <strong>Pelajaran:</strong> risiko kumulatif tumbuh dengan horizon tapi <em>melambat</em> — dan batasnya diketahui (stasioner). Untuk pricing/CKPN multi-periode, inilah mesinnya.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Awal Krisis vs Takdir Jangka Panjang (Stasioner)"
  layout={{"barmode": "group", "yaxis": {"title": "Proporsi", "tickformat": ".0%"}, "xaxis": {"title": "Status"}}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Kuning = komposisi saat krisis (banyak telat/macet); biru = distribusi stasioner (keseimbangan).</p>
<p><strong>Interpretasi:</strong> Meski mulai dari krisis (50% lancar), rantai &ldquo;menarik&rdquo; kembali ke 86% lancar — <strong>jika</strong> matriks transisi tetap (asumsi besar!). Inilah dua sisi stasioner: ia memberi jangkar prediksi, tapi jangkarnya hanya sekuat asumsi stasioneritas matriks.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Markov = &ldquo;besok hanya peduli hari ini&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Pangkat matriks — 2 langkah</summary>
              <p>Status: L (lancar), T (telat), M (macet). Matriks transisi per bulan (baris = dari): L → (0,9; 0,08; 0,02); T → (0,6; 0,3; 0,1); M → (0; 0; 1) [absorbing]. Dari 1.000 T hari ini, berapa yang M dalam 2 bulan?</p>
              <p><strong>Langkah 1</strong> — vektor awal: (0, 1000, 0).<br />
              <strong>Langkah 2</strong> — bulan 1: (0×… ) → L: 600; T: 300; M: 100.<br />
              <strong>Langkah 3</strong> — bulan 2: M = 100 (tetap) + 300×0,1 (dari T) + 600×0,02 (dari L) = 100 + 30 + 12 = <strong>142</strong>.</p>
              <p>Pelajaran: P² memberi jawaban 2-langkah langsung — tapi perkalian manual per langkah melatih intuisi &ldquo;aliran&rdquo; antar status.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Distribusi stasioner — takdir jangka panjang</summary>
              <p>Dengan matriks di atas (M absorbing), berapa distribusi stasioner? Apa artinya untuk portofolio?</p>
              <p><strong>Langkah 1</strong> — M absorbing (baris 0,0,1): sekali masuk, tidak keluar.<br />
              <strong>Langkah 2</strong> — stasioner π: π = πP → satu-satunya solusi: π = <strong>(0, 0, 1)</strong> — semua akhirnya macet!<br />
              <strong>Langkah 3</strong> — baca: model ini <em>tanpa</em> &ldquo;sembuh dari macet&rdquo; dan tanpa nasabah baru — dalam jangka <em>sangat</em> panjang, semuanya macet. Tak realistis — tapi ia memberi <em>batas atas</em> yang jujur.</p>
              <p>Pelajaran: stasioner = &ldquo;takdir&rdquo; modelmu. Jika takdirnya absurd, modelnya kurang (tambahkan recovery + nasabah baru). Stasioner adalah alat <em>diagnosis model</em>, bukan ramalan.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Roll rate — dari T30 ke macet 3 bulan</summary>
              <p>Roll rate: T30 → T60: 40%; T60 → T90: 50%; T90 → Macet: 60%. Dari Rp1 M di T30, berapa ekspektasi yang jadi macet 3 bulan lagi? (Asumsi: yang tidak roll kembali lancar.)</p>
              <p><strong>Langkah 1</strong> — P(T30 → Macet dalam 3 langkah) = 0,4 × 0,5 × 0,6 = <strong>0,12</strong>.<br />
              <strong>Langkah 2</strong> — ekspektasi macet = Rp1 M × 0,12 = <strong>Rp120 juta</strong>.<br />
              <strong>Langkah 3</strong> — bandingkan dengan &ldquo;asumsi roll 100%&rdquo;: Rp1 M — estimasi naif 8× lipat terlalu besar. Roll rate = realisme.</p>
              <p>Pelajaran: rantai perkalian roll rate = inti provisioning IFRS 9 staging. Tiga angka kecil (0,4; 0,5; 0,6) mengalahkan satu asumsi besar.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Pangkat Matriks & Stasioner dari Nol</h2>

      <p>Definisikan matriks transisi, hitung P^n dan distribusi stasioner via iterasi. Tanpa numpy!</p>

      <PyodideLab
  title="Lab 1 — Markov Chain Murni Python"
  hint="Semua baris P^50 sama = bukti konvergensi ke π. Ubah satu baris, lihat π bergeser — itulah &lt;strong>stress testing matriks&lt;/strong>."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Roll Rate 12 Bulan — Prediksi Collection</h2>

      <p>1.000 akun Telat hari ini. Proyeksikan komposisi tiap bulan selama 12 bulan.</p>

      <PyodideLab
  title="Lab 2 — Proyeksi Portofolio Telat"
  hint="Dua skenario (baseline vs stress) = inti &lt;strong>IFRS 9 multi-skenario&lt;/strong> untuk transisi status."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Markov Chain</h2>

      <div className="decision-card">
<h3>1. Sistem berpindah status diskret → <strong>Markov chain</strong></h3>
<p><strong>Kondisi data:</strong> Status jelas (rating, DPD bucket); transisi hanya peduli status kini.</p>
<p><strong>Kenapa:</strong> Sifat Markov menyederhanakan drastis: cukup matriks P.</p>
<p><strong>Contoh nyata:</strong> Migrasi rating, roll rate collection.</p>
</div>

      <div className="decision-card">
<h3>2. Butuh horizon n → <strong>pangkatkan matriks</strong></h3>
<p><strong>Kondisi data:</strong> Pertanyaan &ldquo;n periode lagi&rdquo;.</p>
<p><strong>Kenapa:</strong> (P^n)ᵢⱼ = semua jalur n-langkah. Chapman-Kolmogorov.</p>
<p><strong>Contoh nyata:</strong> &ldquo;6 bulan lagi berapa yang macet?&rdquo;</p>
</div>

      <div className="decision-card">
<h3>3. Butuh &ldquo;takdir jangka panjang&rdquo; → <strong>stasioner π</strong></h3>
<p><strong>Kondisi data:</strong> Keseimbangan struktural portofolio.</p>
<p><strong>Kenapa:</strong> π = πP; jangkar prediksi tanpa forecast makro.</p>
<p><strong>Contoh nyata:</strong> Komposisi keseimbangan portofolio kredit.</p>
</div>

      <div className="decision-card">
<h3>4. Ada absorbing state (Default/Lunas) → <strong>analisis absorbsi</strong></h3>
<p><strong>Kondisi data:</strong> Status yang tak bisa keluar.</p>
<p><strong>Kenapa:</strong> Fokus ke <em>waktu sampai absorbsi</em> &amp; peluang absorbsi — bukan stasioner.</p>
<p><strong>Contoh nyata:</strong> P(default sebelum lunas) untuk vintage.</p>
</div>

      <div className="decision-card">
<h3>5. Dunia tidak stasioner → <strong>matriks bersyarat rezim</strong></h3>
<p><strong>Kondisi data:</strong> Transisi berubah saat krisis.</p>
<p><strong>Kenapa:</strong> Satu matriks historis = satu rezim. Butuh baseline + stress.</p>
<p><strong>Contoh nyata:</strong> Matriks 2019 vs 2020 untuk stress test.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Cek baris jumlah = 1. Selalu.</li><li>&ldquo;n lagi&rdquo; → P^n. &ldquo;Jangka panjang&rdquo; → π.</li><li>Absorbing state → analisis waktu absorbsi, bukan stasioner.</li><li>Stress matriksnya, bukan cuma pakai historis.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Vintage 2024 — Kapan Macetnya Puncak?</h2>

      <div className="callout">
<p>Vintage kredit 2024: 5.000 akun, semua &ldquo;Lancar&rdquo; di bulan 0. Matriks baseline seperti di atas. Direksi tanya: <em>&ldquo;Kapan jumlah Macet mencapai puncak, dan berapa? Kami siapkan tim collection.&rdquo;</em></p><p><strong>Pertanyaan:</strong> (a) Dengan Lab 2 (mulai dari Lancar), bulan berapa Macet maksimum? (b) Mengapa tidak monoton naik?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Jalankan Lab 2 dengan pi awal [5000,0,0]: Macet naik terus awalnya, mencapai puncak sekitar <strong>bulan 18–24</strong> (~600–700 akun), lalu melandai menuju stasioner (6% × 5000 = 300... tapi ingat Macet bisa &ldquo;sembuh&rdquo; 10% di matriks ini — jika Macet absorbing, ia naik monoton ke 100%!).</p><p>(b) <strong>Tidak monoton</strong> karena Macet bukan absorbing di matriks ini (10% kembali lancar/bulan) — ada arus masuk (dari Telat) dan arus keluar (sembuh). Puncak = saat arus masuk = arus keluar. <strong>Pelajaran modeling:</strong> definisi status menentukan dinamika! Jika &ldquo;Macet&rdquo; didefinisikan absorbing (write-off), kurvanya monoton naik — keputusan definisi = keputusan hasil. Selalu tanyakan definisi status sebelum percaya proyeksi.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Cuaca: Cerah → Cerah 0,7 / Hujan 0,3; Hujan → Cerah 0,4 / Hujan 0,6. Hari ini cerah. Berapa peluang lusa hujan?</li>
              <li>Jika rantai di atas dijalankan sangat lama, berapa proporsi hari hujan? (Cari stasioner π = πP.)</li>
              <li>Mengapa asumsi Markov (&ldquo;besok hanya peduli hari ini&rdquo;) bisa gagal untuk perilaku nasabah? Beri satu contoh konkret.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> P²: Cerah→Hujan 2 langkah = 0,7×0,3 + 0,3×0,6 = 0,21+0,18 = <strong>0,39</strong>.</p>
              <p><strong>2.</strong> π<sub>H</sub> = 0,3π<sub>C</sub> + 0,6π<sub>H</sub>; π<sub>C</sub>+π<sub>H</sub>=1 → 0,4π<sub>H</sub> = 0,3(1−π<sub>H</sub>) → π<sub>H</sub> = <strong>3/7 ≈ 42,9%</strong>.</p>
              <p><strong>3.</strong> Contoh: nasabah yang telat 3 bulan <em>berturut-turut</em> jauh lebih berisiko daripada yang &ldquo;telat bulan ini&rdquo; tapi lancar 2 tahun sebelumnya — Markov orde-1 menyamakan keduanya (hanya status <em>hari ini</em> yang diingat). Solusi: state yang lebih kaya (tambahkan &ldquo;riwayat&rdquo;) atau orde lebih tinggi.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Sifat Markov:</strong> masa depan | kini — cukup matriks transisi P (baris jumlah 1).</li><li><strong>n langkah:</strong> <Tex math={String.raw`(P^n)_{ij}`} /> via perkalian matriks (semua jalur).</li><li><strong>Stasioner:</strong> <Tex math={String.raw`\pi = \pi P`} /> — takdir jangka panjang, jangkar prediksi.</li><li><strong>Aplikasi:</strong> migrasi rating, roll rate; absorbing state untuk default.</li><li><strong>Jangan</strong> pakai matriks historis mentah — stress per rezim; <strong>jangan</strong> kuadratkan elemen (kalikan matriks!).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b13-vasicek" className="btn btn-secondary btn-sm">← ← B13</Link>
        <Link href="/learn/b15-proses-stokastik" className="btn btn-primary btn-sm">Next: B15 →</Link>
      </div>
    </div>
  );
}
