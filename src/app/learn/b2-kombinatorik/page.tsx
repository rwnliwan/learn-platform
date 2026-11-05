import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B2KombinatorikPage() {
  const chart1 = [{"x": [5, 10, 15, 20, 23, 30, 40, 50], "y": [0.027, 0.117, 0.253, 0.411, 0.507, 0.706, 0.891, 0.97], "type": "scatter", "mode": "lines+markers", "line": {"color": "#e8a838"}, "name": "P(tabrakan ultah)"}, {"x": [5, 50], "y": [0.5, 0.5], "type": "scatter", "mode": "lines", "line": {"color": "#94a3b8", "dash": "dash"}, "name": "50%"}];
  const chart2 = [{"x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "y": [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000], "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1"}, "name": "10^k (PIN k digit)"}];
  const lab1Code = String.raw`import random
random.seed(11)

def peluang_tabrakan(n, trials=20000):
    tabrak = 0
    for _ in range(trials):
        ultah = [random.randrange(365) for _ in range(n)]
        if len(set(ultah)) < n:  # ada yang sama
            tabrak += 1
    return tabrak / trials

for n in [5, 10, 15, 20, 23, 30, 40, 50]:
    print(f"{n:>3} orang -> P(tabrakan) = {peluang_tabrakan(n):.3f}")
print()
print("Coba: n=23. Sesuaikah dengan 0.507 di grafik?")
print("Coba: ganti 365 -> 1000 hari. Berapa n agar >50%?")`;
  const lab2Code = String.raw`import random, math
random.seed(3)

def C(n, k):
    return math.comb(n, k)  # Python 3.8+: kombinasi eksak

N, F, n = 200, 10, 15
# komplemen: sampel tanpa fraud sama sekali
p_tanpa = C(N - F, n) / C(N, n)
print(f"P(tanpa fraud)      = {p_tanpa:.4f}")
print(f"P(minimal 1 fraud)  = {1 - p_tanpa:.4f}")

# simulasi
trials = 50000
ketemu = 0
pop = [1]*F + [0]*(N-F)  # 1 = fraud
for _ in range(trials):
    if sum(random.sample(pop, n)) >= 1:
        ketemu += 1
print(f"Simulasi            = {ketemu/trials:.4f}")
print()
print("Coba: n=15 -> 30. Berapa n agar P > 95%? (coba-coba!)")`;
  const quizData = [{"question": "PIN 4 digit (boleh ulang). Banyak kemungkinan?", "options": ["4^10", "10^4 = 10.000", "P(10,4) = 5.040", "C(10,4) = 210"], "correct": 1, "explanation": "Benar: tiap digit 10 pilihan independen → 10^4. P(10,4) salah karena digit boleh berulang."}, {"question": "Pilih 3 orang dari 10 untuk tim (urutan tidak penting). Rumus?", "options": ["10^3", "10!/7!", "C(10,3) = 120", "10!/3!"], "correct": 2, "explanation": "Benar: tim {A,B,C} = {C,B,A} → kombinasi. 10!/7! adalah permutasi (untuk podium)."}, {"question": "Peluang minimal satu angka dari 4 lemparan koin paling cepat via…", "options": ["Menjumlah P(1)+P(2)+P(3)+P(4)", "1 − (1/2)^4 = 15/16", "4 × 1/2 = 2", "(1/2)^4"], "correct": 1, "explanation": "Benar: komplemen — 1 − P(semua gambar). Satu langkah vs empat suku."}, {"question": "23 orang, peluang ada pasang berulang tahun sama >50%. Intuisi yang benar:", "options": ["365 hari terlalu sedikit", "Yang penting banyaknya pasangan C(23,2)=253", "Orang lahir musiman", "Ulang tahun tidak acak"], "correct": 1, "explanation": "Benar: 253 pasangan = 253 kesempatan tabrakan. Pertumbuhan kuadratik pasangan mengalahkan 365 hari."}, {"question": "Kombinasi C(n,k) bisa dipakai untuk peluang hanya jika…", "options": ["n besar", "Setiap subset equally likely", "k kecil", "Selalu bisa"], "correct": 1, "explanation": "Benar: kombinasi menghitung <em>cara</em>. Jadi peluang hanya valid jika tiap cara equally likely — asumsi yang harus dicek, bukan default."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B2 — Probabilitas</span>
        <h1 className="display-title">Kombinatorik: Menghitung<br/>Tanpa Menghitung Satu per Satu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Ulang Tahun yang Sama?</a></li>
          <li><a href="#kaidah">Kaidah Pencacahan — Fondasi Semuanya</a></li>
          <li><a href="#perm">Permutasi — Urutan Penting, Tanpa Pengulangan</a></li>
          <li><a href="#komb">Kombinasi — Urutan Tidak Penting</a></li>
          <li><a href="#ulang">Dengan Pengulangan &amp; Strategi Komplemen</a></li>
          <li><a href="#lab1">🔬 Lab 1: Birthday Paradox — Buktikan Sendiri</a></li>
          <li><a href="#lab2">🔬 Lab 2: Kombinasi vs Simulasi — Audit Menemukan Fraud</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Permutasi, Kombinasi, atau Apa?</a></li>
          <li><a href="#case">📋 Mini-Case: Berapa Sampel Agar Yakin 95%?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menerapkan kaidah pencacahan (aturan perkalian) untuk ruang sampel berurutan.</li><li>Membedakan kapan pakai <strong>permutasi</strong> vs <strong>kombinasi</strong> vs <strong>dengan pengulangan</strong>.</li><li>Menghitung peluang via rasio &ldquo;favorable/total&rdquo; pada ruang sampel kombinatorial.</li><li>Menggunakan <strong>strategi komplemen</strong> untuk soal &ldquo;minimal satu&rdquo;.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Ulang Tahun yang Sama?</h2>

      <div className="story"><p>Di ruangan berisi <strong>23 orang</strong>, berapa peluang dua orang berulang tahun di tanggal yang sama? Kebanyakan menebak kecil — &ldquo;kan ada 365 hari!&rdquo; Jawabannya: <strong>lebih dari 50%</strong>.</p><p>Ini <em>birthday paradox</em>: intuisi manusia payah menghitung pasangan. Dengan 23 orang ada <Tex math={String.raw`\binom{23}{2} = 253`} /> pasangan — 253 kesempatan &ldquo;tabrakan&rdquo;. Kombinatorik adalah alat untuk menghitung kesempatan-kesempatan itu tanpa mendaftar satu per satu.</p><p>Di dunia nyata: tim fraud menghitung pola transaksi mencurigakan, auditor menghitung sampel, tim risiko menghitung skenario — semuanya kombinatorik.</p><p><strong>Twist-nya:</strong> 23 orang terdengar sedikit lawan 365 hari — tapi yang relevan bukan 23 vs 365, melainkan <strong>253 pasangan</strong> vs 365. Intuisi salah bukan karena bodoh, melainkan karena otak berpikir linear (n) padahal pasangan tumbuh kuadratik (n²). Dalam kombinatorik, yang meledak hampir selalu bukan n — melainkan <em>kombinasi</em> dari n.</p></div>

      <h2 id="kaidah">Kaidah Pencacahan — Fondasi Semuanya</h2>

      <p><strong>Aturan perkalian:</strong> jika ada <Tex math={String.raw`m`} /> cara melakukan A dan <Tex math={String.raw`n`} /> cara melakukan B, total cara berurutan = <Tex math={String.raw`m \times n`} />.</p>

      <p><strong>Contoh.</strong> PIN 4 digit: 10×10×10×10 = <Tex math={String.raw`10^4 = 10.000`} /> kemungkinan. Plat nomor 1 huruf + 3 angka: 26 × 10³ = 26.000.</p>

      <p><strong>Kepribadian:</strong> kaidah pencacahan itu &ldquo;mesin fotokopi&rdquo; — tiap tahap menggandakan kemungkinan tahap sebelumnya. Inilah mengapa ruang sampel meledak eksponensial (dan mengapa brute force cepat mustahil).</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Soal &ldquo;berurutan&rdquo; (PIN, password, antrean) hampir selalu mulai dari kaidah perkalian. Tulis banyaknya pilihan <em>per posisi</em>, lalu kalikan.</p>
</div>

      <h2 id="perm">Permutasi — Urutan Penting, Tanpa Pengulangan</h2>

      <p><Tex math={String.raw`P(n,k) = \frac{n!}{k!}`} block /></p>

      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`n`} /> = banyak objek tersedia, <Tex math={String.raw`k`} /> = banyak posisi yang diisi, <Tex math={String.raw`n!`} /> = n×(n−1)×...×1.</p>

      <p><strong>Contoh langkah-demi-langkah.</strong> 5 finalis, juara 1-2-3: posisi 1 ada 5 pilihan, posisi 2 sisa 4, posisi 3 sisa 3 → 5×4×3 = 60 = <Tex math={String.raw`5!/2!`} />.</p>

      <p><strong>Kapan memakai:</strong> susunan/podium/jabatan — &ldquo;siapa jadi apa&rdquo; penting.</p>

      <h2 id="komb">Kombinasi — Urutan Tidak Penting</h2>

      <p><Tex math={String.raw`C(n,k) = \binom{n}{k} = \frac{n!}{k!(n-k)!}`} block /></p>

      <p><strong>Artinya:</strong> sama seperti permutasi, tapi susunan yang sama dianggap satu (dibagi <Tex math={String.raw`k!`} /> susunan internal).</p>

      <p><strong>Contoh.</strong> Pilih 3 auditor dari 10: <Tex math={String.raw`\binom{10}{3} = \frac{10\times9\times8}{3\times2\times1} = 120`} />. Tim &#123;A,B,C&#125; sama dengan &#123;C,B,A&#125; — urutan tidak penting.</p>

      <details className="worked">
<summary>📐 Contoh: peluang &ldquo;full house&rdquo; vs intuisi</summary>
<p>Peluang 5 kartu mengandung tepat sepasang As (dan bukan three of a kind)?</p><p><strong>Langkah 1</strong> — total: <Tex math={String.raw`\binom{52}{5} = 2.598.960`} />.</p><p><strong>Langkah 2</strong> — favorable: pilih 2 As dari 4 (<Tex math={String.raw`\binom{4}{2}=6`} />) × pilih 3 non-As dari 48 (<Tex math={String.raw`\binom{48}{3}=17.296`} />) = 103.776.</p><p><strong>Langkah 3</strong> — peluang = 103.776 / 2.598.960 ≈ <strong>4%</strong>. Pola pikirnya selalu: <em>favorable/total</em>, masing-masing dihitung dengan kombinasi.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Urutan tidak penting = selalu kombinasi.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika tiap subset <em>equally likely</em>. Contoh jebakan: &ldquo;pilih 2 nasabah&rdquo; dari populasi yang tiap nasabahnya tidak equally likely terpilih (sampling berbobot) — kombinasi menghitung susunan, bukan peluang. Kombinasi menjawab &ldquo;ada berapa cara&rdquo;, bukan &ldquo;berapa peluang&rdquo; — peluang butuh asumsi equally likely.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;P(n,k) dan C(n,k) bisa dipakai bergantian, bedanya kecil.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Bedanya faktor <Tex math={String.raw`k!`} /> — untuk k=10 itu 3,6 juta kali lipat! Salah pilih = salah total. Tes cepat: <em>tukar dua objek, apakah hasilnya dianggap beda?</em> Ya → permutasi. Tidak → kombinasi.</p>
</div>

      <h2 id="ulang">Dengan Pengulangan &amp; Strategi Komplemen</h2>

      <p><strong>Dengan pengulangan</strong> (tiap posisi boleh pakai ulang): <Tex math={String.raw`n^k`} /> (PIN: <Tex math={String.raw`10^4`} />). <strong>Kombinasi dengan pengulangan</strong> (stars and bars): <Tex math={String.raw`\binom{n+k-1}{k}`} /> — misal membagi 10 identik ke 3 kelompok.</p>

      <p><strong>Strategi komplemen</strong> (superpower kombinatorik): soal &ldquo;minimal satu&rdquo; hampir selalu lebih mudah via komplemen.</p>

      <p><strong>Contoh.</strong> Peluang minimal satu &ldquo;angka&rdquo; dari 3 lemparan koin: 1 − P(semua gambar) = 1 − (1/2)³ = <strong>7/8</strong>. Bandingkan dengan menghitung 1-angka + 2-angka + 3-angka = 3/8+3/8+1/8 — komplemen satu langkah.</p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Refleks komplemen: begitu melihat kata &ldquo;minimal satu&rdquo;/&ldquo;paling tidak satu&rdquo;, langsung tulis &ldquo;1 − P(tidak ada)&rdquo;. Ini menghemat 80% kerja.</p>
</div>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Situasi</th><th>Rumus</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td>Urutan penting, tanpa ulang</td><td>P(n,k) = n!/(n−k)!</td><td>Podium juara 1-2-3</td></tr>
<tr><td>Urutan tak penting, tanpa ulang</td><td>C(n,k) = n!/(k!(n−k)!)</td><td>Tim audit 3 dari 10</td></tr>
<tr><td>Tiap posisi boleh ulang</td><td>n^k</td><td>PIN 4 digit</td></tr>
<tr><td>Bagi identik ke kelompok</td><td>C(n+k−1,k)</td><td>10 bola ke 3 kotak</td></tr>
</tbody>
</table>
</div>

      <PlotlyChart
  data={chart1}
  title="Birthday Paradox: 23 Orang → >50%"
  layout={{"xaxis": {"title": "Jumlah orang"}, "yaxis": {"title": "P(minimal satu pasang ultah sama)", "tickformat": ".0%"}}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu X = jumlah orang di ruangan, sumbu Y = peluang ada minimal dua orang berulang tahun sama.</p>
<p><strong>Interpretasi:</strong> Kurva naik curam: 23 orang sudah &gt;50%, 50 orang 97%. Intuisi &ldquo;365 hari kan banyak&rdquo; salah karena yang relevan adalah <strong>banyaknya pasangan</strong> <Tex math={String.raw`\binom{n}{2}`} /> yang tumbuh kuadratik, bukan harinya.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Ledakan Kombinatorial: Tiap Digit ×10"
  layout={{"xaxis": {"title": "Panjang PIN (digit)"}, "yaxis": {"title": "Kemungkinan", "type": "log"}}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Sumbu Y skala log: tiap naik 1 digit, kemungkinan ×10.</p>
<p><strong>Interpretasi:</strong> PIN 4 digit = 10 ribu (brute force gampang), 10 digit = 10 miliar. Inilah mengapa &ldquo;tambah 1 digit&rdquo; jauh lebih kuat dari &ldquo;aturan password rumit&rdquo; — dan mengapa enumerasi skenario risiko harus dipangkas dengan cerdas, bukan brute force.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Ikuti tiap langkah — kombinatorik dikuasai lewat jari, bukan mata.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Birthday paradox, dihitung</summary>
              <p>23 orang. Berapa peluang minimal dua berulang tahun sama? (Asumsi: 365 hari, peluang seragam, independen.)</p>
              <p><strong>Langkah 1</strong> — pakai komplemen: 1 − P(semua beda).<br />
              <strong>Langkah 2</strong> — P(semua beda) = (365/365) × (364/365) × (363/365) × … × (343/365). Orang ke-2 punya 364 &ldquo;hari aman&rdquo;, ke-3 punya 363, dst.<br />
              <strong>Langkah 3</strong> — hasil kali 23 suku ≈ <strong>0,4927</strong>.<br />
              <strong>Langkah 4</strong> — jawaban: 1 − 0,4927 = <strong>0,5073 ≈ 50,7%</strong>.</p>
              <p>Pelajaran: 253 pasangan &ldquo;kesempatan tabrakan&rdquo; mengalahkan 365 hari. Dan trik komplemen (B1!) muncul lagi — &ldquo;minimal satu tabrakan&rdquo; = 1 − &ldquo;nol tabrakan&rdquo;.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Tim audit dari 10 analis</summary>
              <p>Dari 10 analis, dibentuk tim 3 orang untuk audit mendadak. Berapa banyak tim berbeda yang mungkin?</p>
              <p><strong>Langkah 1</strong> — urutan penting? Tidak (tim &lbrace;A,B,C&rbrace; = &lbrace;C,B,A&rbrace;) → <strong>kombinasi</strong>.<br />
              <strong>Langkah 2</strong> — C(10,3) = 10!/(3!·7!) = (10×9×8)/(3×2×1) = 720/6 = <strong>120</strong>.<br />
              <strong>Langkah 3</strong> — cek silang: jika urutan penting (ketua/wakil/sekretaris), P(10,3) = 10×9×8 = 720 = 6 × 120. Faktor 6 = 3! (susunan dalam tim).</p>
              <p>Pelajaran: &ldquo;apakah urutan penting&rdquo; adalah satu-satunya pertanyaan yang memisahkan permutasi dari kombinasi. Salah jawab = meleset faktor 3! = 6×.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: PIN 4 digit — dengan vs tanpa pengulangan</summary>
              <p>Berapa banyak PIN 4 digit (a) boleh berulang, (b) tidak boleh berulang?</p>
              <p><strong>Langkah 1 (a)</strong> — tiap posisi 10 pilihan, independen: 10×10×10×10 = <strong>10.000</strong>.<br />
              <strong>Langkah 2 (b)</strong> — tanpa pengulangan: 10×9×8×7 = <strong>5.040</strong> (= P(10,4)).<br />
              <strong>Langkah 3</strong> — implikasi keamanan: melarang pengulangan memangkas ruang PIN jadi ~setengah — <em>melemahkan</em>, bukan menguatkan! (Aturan &ldquo;tidak boleh berulang&rdquo; yang dimaksudkan untuk keamanan justru mempermudah brute force.)</p>
              <p>Pelajaran: intuisi keamanan sering terbalik — hitung dulu, baru buat aturan.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Birthday Paradox — Buktikan Sendiri</h2>

      <p>Simulasi ruangan berisi n orang, ulang tahun acak 365 hari. Jalankan dan lihat kapan peluang melewati 50%.</p>

      <PyodideLab
  title="Lab 1 — Simulasi Ulang Tahun"
  hint="Ubah trials 20.000 → 2.000: hasilnya goyang. Itulah noise simulasi — makin banyak trial makin stabil."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Kombinasi vs Simulasi — Audit Menemukan Fraud</h2>

      <p>Populasi 200 transaksi, 10 di antaranya fraud. Auditor ambil 15 acak. Berapa peluang <strong>minimal satu</strong> fraud ketemu? Hitung via kombinasi + cek via simulasi.</p>

      <PyodideLab
  title="Lab 2 — Peluang Menemukan Fraud dalam Sampel"
  hint="Naikkan n sampai peluang > 0,95. Itulah cara menentukan &lt;strong>ukuran sampel audit&lt;/strong>."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Permutasi, Kombinasi, atau Apa?</h2>

      <div className="decision-card">
<h3>1. Soal susunan/jabatan/podium → <strong>Permutasi</strong></h3>
<p><strong>Kondisi data:</strong> Objek dibedakan oleh posisinya: juara 1 vs juara 2 itu beda.</p>
<p><strong>Kenapa:</strong> Tukar dua objek mengubah hasil → urutan penting → P(n,k).</p>
<p><strong>Contoh nyata:</strong> Nomor antrean layanan: siapa di posisi 1 penting.</p>
</div>

      <div className="decision-card">
<h3>2. Soal tim/sampel/komite → <strong>Kombinasi</strong></h3>
<p><strong>Kondisi data:</strong> Yang penting siapa anggotanya, bukan urutannya.</p>
<p><strong>Kenapa:</strong> Tukar dua anggota tidak mengubah tim → C(n,k).</p>
<p><strong>Contoh nyata:</strong> Sampel audit 15 dari 200 transaksi (Lab 2).</p>
</div>

      <div className="decision-card">
<h3>3. Tiap pilihan boleh dipakai ulang → <strong>pangkat (n^k)</strong></h3>
<p><strong>Kondisi data:</strong> Posisi independen dan boleh mengulang: PIN, password, lemparan berurutan.</p>
<p><strong>Kenapa:</strong> Tiap posisi punya n pilihan penuh → kalikan n sebanyak k kali.</p>
<p><strong>Contoh nyata:</strong> Password 8 karakter dari 62 simbol: 62^8.</p>
</div>

      <div className="decision-card">
<h3>4. Ada kata &ldquo;minimal satu&rdquo; → <strong>komplemen dulu</strong></h3>
<p><strong>Kondisi data:</strong> Menghitung langsung butuh menjumlah banyak kasus.</p>
<p><strong>Kenapa:</strong> 1 − P(tidak ada) selalu satu suku. Hemat dan anti-salah.</p>
<p><strong>Contoh nyata:</strong> P(minimal satu fraud) = 1 − C(190,15)/C(200,15).</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Tanya: <strong>tukar dua objek, beda hasil?</strong> Ya → permutasi, tidak → kombinasi.</li><li>Boleh pakai ulang? → n^k.</li><li>&ldquo;Minimal satu&rdquo; → 1 − P(tidak ada). Selalu.</li><li>Peluang = favorable/total — pastikan keduanya dihitung dengan <em>aturan yang sama</em>.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Berapa Sampel Agar Yakin 95%?</h2>

      <div className="callout">
<p>Tim audit menemukan pola: ~5% transaksi di satu cabang terindikasi fraud (10 dari 200). Kepala audit bertanya: <em>&ldquo;Berapa transaksi harus kami sampel acak agar peluang menemukan <strong>minimal satu</strong> fraud ≥ 95%?&rdquo;</em></p><p>Dari Lab 2: n=15 → P ≈ 55%. Terlalu kecil.</p><p><strong>Pertanyaan:</strong> (a) Perkirakan n yang dibutuhkan (coba dengan lab). (b) Mengapa jawaban ini memakai komplemen, bukan menghitung langsung?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) Dengan mencoba n di Lab 2: n=40 → P ≈ 88%, n=50 → P ≈ 94%, <strong>n≈52–55 → P ≥ 95%</strong>. (Tanpa pengembalian, jadi sedikit di bawah aproksimasi binomial.)</p><p>(b) Menghitung langsung butuh menjumlah P(1 fraud) + P(2) + ... + P(10) — 10 suku hipergeometrik. Komplemen: 1 − C(190,n)/C(200,n) — satu suku. Inilah strategi komplemen di dunia nyata: <strong>ukuran sampel audit ditentukan oleh komplemen</strong>.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Dari 52 kartu diambil 5 (poker). Berapa banyak kombinasi 5 kartu? Berapa peluang mendapat &ldquo;four of a kind&rdquo; (4 kartu sama + 1 bebas)?</li>
              <li>Password 6 karakter dari 26 huruf kecil, boleh berulang. Berapa banyak password? Jika aturan &ldquo;tidak boleh ada huruf berulang&rdquo; ditambahkan, berapa?</li>
              <li>50 nasabah, 5 terpilih untuk verifikasi mendalam. Urutan tidak penting. Berapa cara memilih? (Tulis rumusnya + hasil akhirnya.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> C(52,5) = 2.598.960. Four of a kind: 13 pilihan nilai × 48 kartu sisa = 624. Peluang = 624/2.598.960 ≈ <strong>0,024%</strong> (1 banding ~4.165).</p>
              <p><strong>2.</strong> Boleh berulang: 26<sup>6</sup> = <strong>308.915.776</strong>. Tanpa pengulangan: 26×25×24×23×22×21 = <strong>165.765.600</strong> — lagi-lagi aturan &ldquo;keamanan&rdquo; memangkas ruang hampir setengah.</p>
              <p><strong>3.</strong> C(50,5) = 50!/(5!·45!) = (50×49×48×47×46)/120 = <strong>2.118.760</strong> cara.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Kaidah perkalian:</strong> cara berurutan dikalikan — fondasi semua pencacahan.</li><li><strong>Tukar beda hasil → permutasi;</strong> tukar sama saja → kombinasi; boleh ulang → n^k.</li><li><strong>&ldquo;Minimal satu&rdquo; → komplemen.</strong> Selalu lebih mudah.</li><li>Peluang = favorable/total — hitung keduanya dengan aturan yang sama + asumsi equally likely.</li><li><strong>Jangan</strong> pakai untuk risiko: brute force skenario meledak eksponensial — butuh sampling cerdas (Monte Carlo, B12).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b1-aksioma-peluang" className="btn btn-secondary btn-sm">← ← B1</Link>
        <Link href="/learn/b3-peluang-bersyarat" className="btn btn-primary btn-sm">Next: B3 →</Link>
      </div>
    </div>
  );
}
