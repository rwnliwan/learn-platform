import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D1PythonDasarPage() {
  const chart1 = [{"x": ["SQL", "Python"], "y": [90, 85], "type": "bar", "name": "Ambil & query data", "marker": {"color": "#2a7de1"}}, {"x": ["SQL", "Python"], "y": [30, 95], "type": "bar", "name": "Statistik & ML", "marker": {"color": "#e8a838"}}, {"x": ["SQL", "Python"], "y": [20, 90], "type": "bar", "name": "API & otomasi", "marker": {"color": "#34a853"}}];
  const lab1Code = String.raw`
def bucket_dpd(dpd):
    """Kelompokkan DPD ke bucket risiko."""
    if dpd == 0:
        return "lancar"
    elif dpd <= 30:
        return "ringan"
    elif dpd <= 90:
        return "sedang"
    return "berat"

# --- UJI ---
for d in [0, 15, 45, 120]:
    print(f"dpd={d:>3} -> {bucket_dpd(d)}")

# Coba: apa hasil bucket_dpd(-5)? Perbaiki agar valid!
`;
  const lab2Code = String.raw`
plafon = 50_000_000
bayar_per_bulan = 1_000_000

total = 0
for bulan in range(1, 13):
    total += bayar_per_bulan
    # print(f"Bulan {bulan}: total {total:,}")

sisa = plafon - total
print(f"Total bayar 12 bulan: Rp {total:,}")
print(f"Sisa plafon: Rp {sisa:,}")
print(f"Terbayar: {total/plafon:.1%}")

# Coba: ubah jadi while. Kapan while lebih tepat dari for?
`;
  const quizData = [{"question": "'5' + 3 di Python…", "options": ["8", "'53'", "Error (str + int)", "5"], "correct": 2, "explanation": "Benar: Python tidak konversi implisit. Pakai int('5') + 3."}, {"question": "range(3) menghasilkan…", "options": ["1,2,3", "0,1,2", "0,1,2,3", "3,2,1"], "correct": 1, "explanation": "Benar: mulai 0, berhenti sebelum 3."}, {"question": "None mirip dengan…", "options": ["0", "NULL di SQL — 'tidak tahu'", "String kosong", "False"], "correct": 1, "explanation": "Benar: None = tidak ada nilai, bukan 0."}, {"question": "Kapan copy-paste dijadikan fungsi?", "options": ["Tidak pernah", "Saat dipakai 2× atau lebih", "Hanya jika >100 baris", "Selalu, bahkan 1×"], "correct": 1, "explanation": "Benar: DRY — dipakai ulang = jadikan fungsi."}, {"question": "Tugas 'ambil data API lalu hitung model' → …", "options": ["SQL saja", "Python (SQL tak bisa panggil API/ML)", "Excel", "Tidak bisa"], "correct": 1, "explanation": "Benar: Python mengisi celah SQL."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D1 — Python</span>
        <h1 className="display-title">Python Dasar: Bahasa<br/>Kedua Seorang Analis</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: SQL Bertemu Batasnya</a></li>
          <li><a href="#tipe">Tipe Data Dasar — Fondasi</a></li>
          <li><a href="#kontrol">Alur Kontrol — if / for / while</a></li>
          <li><a href="#fungsi">Fungsi — Bungkus Logika Jadi Reusable</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bucket DPD dengan Fungsi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Sederhana</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Python vs SQL</a></li>
          <li><a href="#case">📋 Mini-Case: Kalkulator Denda Keterlambatan</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menjelaskan <strong>tipe data dasar</strong> Python: int, float, str, bool, None.</li><li>Menulis <strong>alur kontrol</strong>: if/else, for, while.</li><li>Mendefinisikan <strong>fungsi</strong> dengan parameter &amp; return.</li><li>Memahami <strong>mengapa Python</strong> untuk analisis (vs SQL).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: SQL Bertemu Batasnya</h2>

      <div className="story"><p>Kamu sudah kuasai SQL (track C!). Tapi suatu hari diminta: <em>&ldquo;Ambil data transaksi dari API, bersihkan, hitung model skor kredit, kirim email laporan otomatis tiap pagi.&rdquo;</em> SQL tidak bisa panggil API. SQL tidak bisa kirim email. SQL tidak bisa machine learning.</p><p><strong>Python</strong> = bahasa general-purpose yang mengisi semua celah SQL: API, cleaning kompleks, statistik, ML, otomasi. Kombinasi <strong>SQL (ambil data) + Python (olah data)</strong> = 90% pekerjaan data analyst/scientist 2026. Track D mengajarkan Python <em>untuk analisis</em> — bukan Python umum.</p><p><strong>Twist-nya:</strong> SQL mengambil data dalam 1 detik — tapi tidak bisa mengirim email. Python bisa semuanya — tapi untuk &ldquo;rata-rata per kota dari 2 juta baris&rdquo;, SQL tetap menang. Tidak ada bahasa yang &ldquo;lebih baik&rdquo; — hanya &ldquo;lebih tepat untuk pekerjaan ini&rdquo;. Analis senior bukan yang fanatik satu bahasa; ia yang <em>bilingual</em> dan tahu kapan memakai yang mana.</p></div>

      <h2 id="tipe">Tipe Data Dasar — Fondasi</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">nama = &#x27;Andi&#x27;        # str
umur = 32            # int
gaji = 8500000.0     # float
aktif = True         # bool
bonus = None         # None = &#x27;tidak ada&#x27; (mirip NULL!)</pre>

      <ul>
<li><strong>Dynamic typing:</strong> tidak deklarasi tipe — Python menebak dari nilai.</li>
<li><strong>None</strong> = padanan NULL (C2!) — &ldquo;tidak tahu&rdquo;, bukan 0.</li>
<li><strong>Penting:</strong> <code className="inline">'5' + 3</code> → ERROR (str + int)! Konversi eksplisit: <code className="inline">int('5') + 3</code>.</li>
<li><strong>F-string:</strong> <code className="inline">f&#39;Halo &#123;nama&#125;&#39;</code> — cara modern format teks.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Dua konversi yang menyelamatkan: <code className="inline">float('8.5')</code> untuk parsing, <code className="inline">str(x)</code> untuk tampil. Error 'can only concatenate str' = 99% masalah konversi tipe.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Python lambat, jadi tidak cocok untuk data besar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Python <em>murni</em> memang lambat untuk loop — tapi analis tidak loop manual! NumPy/pandas (D3/D4) menjalankan komputasi di <strong>C yang dikompilasi</strong> (vectorized). Python = &ldquo;lem&rdquo; yang mengatur; C = yang bekerja. Kombinasi ini memproses jutaan baris dengan cepat.</p>
</div>

      <h2 id="kontrol">Alur Kontrol — if / for / while</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">dpd = 45
if dpd == 0:
    status = &#x27;lancar&#x27;
elif dpd &lt;= 30:
    status = &#x27;ringan&#x27;
else:
    status = &#x27;bermasalah&#x27;

for i in range(3):
    print(f&#x27;iterasi &#123;i&#125;&#x27;)

n = 0
while n &lt; 3:
    n += 1</pre>

      <ul>
<li><strong>Indentasi = blok!</strong> Tidak ada kurung kurawal — spasi yang menentukan. Konsisten 4 spasi.</li>
<li><code className="inline">range(3)</code> = 0,1,2 (berhenti <em>sebelum</em> 3!).</li>
<li><code className="inline">elif</code> = else-if; <code className="inline">break</code>/ <code className="inline">continue</code> untuk kontrol loop.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola analis: <code className="inline">for row in data:</code> untuk iterasi — tapi ingat, di pandas kamu akan <strong>menghindari loop</strong> (vectorize, D3/D4). Loop Python = untuk logika, bukan untuk komputasi massal.</p>
</div>

      <h2 id="fungsi">Fungsi — Bungkus Logika Jadi Reusable</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def bucket_dpd(dpd):
    &quot;&quot;&quot;Kelompokkan DPD ke bucket risiko.&quot;&quot;&quot;
    if dpd == 0:
        return &#x27;lancar&#x27;
    elif dpd &lt;= 30:
        return &#x27;ringan&#x27;
    elif dpd &lt;= 90:
        return &#x27;sedang&#x27;
    return &#x27;berat&#x27;

print(bucket_dpd(45))  # &#x27;sedang&#x27;</pre>

      <ul>
<li><code className="inline">def nama(param):</code> — definisi; <code className="inline">return</code> — kembalikan nilai.</li>
<li><strong>Docstring</strong> (<code className="inline">"""..."""</code>) = dokumentasi fungsi — tulis selalu!</li>
<li><strong>Aturan:</strong> fungsi = 1 tugas, &lt; 20 baris, nama jelas (<code className="inline">bucket_dpd</code> bukan <code className="inline">f</code>).</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Fungsi hanya untuk programmer.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Analis menulis fungsi <em>setiap hari</em>: fungsi cleaning yang dipakai ulang, fungsi hitung metrik, fungsi plot. Tanpa fungsi = copy-paste = bug saat diubah di satu tempat tapi lupa di tempat lain. DRY: Don't Repeat Yourself.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Mulai biasakan: setiap kali copy-paste kode 2×, jadikan fungsi. Investasi 2 menit menghemat 20 menit debugging.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="SQL vs Python: Kekuatan Komplementer (ilustrasi)"
  layout={{"barmode": "group", "yaxis": {"title": "Kecocokan"}, "showlegend": true}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Tinggi = seberapa cocok tiap bahasa untuk tugas itu (ilustrasi).</p>
<p><strong>Interpretasi:</strong> SQL unggul di query data; Python di statistik/ML/otomasi. <strong>Bukan lawan — pasangan.</strong> Analis 2026 = SQL + Python. (D15: menggabungkan keduanya!)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Baca kode, <em>tebak outputnya</em>, baru buka pembahasan.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Bucket DPD — if/elif/else</summary>
              <p>Klasifikasikan dpd = 45 ke bucket kolektibilitas. Tebak output sebelum membuka!</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">dpd = 45
      if dpd == 0:
          bucket = &#x27;lancar&#x27;
      elif dpd &lt;= 30:
          bucket = &#x27;DPD 1-30&#x27;
      elif dpd &lt;= 90:
          bucket = &#x27;DPD 31-90&#x27;
      else:
          bucket = &#x27;DPD 90+&#x27;
      print(bucket)   # -&gt; ?</pre>
              <p><strong>Bedah:</strong> output = <code className="inline">DPD 31-90</code>. Python mengecek <em>berurutan</em> dan berhenti di kondisi pertama yang benar: 45 ≠ 0, 45 &gt; 30 (lewat), 45 ≤ 90 (kena!). <strong>Pelajaran:</strong> urutan elif = prioritas; kondisi yang tumpang tindih harus diurutkan dari paling spesifik.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Loop + akumulator — total plafon</summary>
              <p>Hitung total plafon dari list — tanpa <code className="inline">sum()</code>, agar mekanismenya terlihat.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">plafon = [50_000_000, 120_000_000, 75_000_000]
      total = 0
      for p in plafon:
          total = total + p
      print(total)          # -&gt; 245000000
      print(total / 1e6)    # -&gt; 245.0 (juta)</pre>
              <p><strong>Bedah:</strong> pola <strong>akumulator</strong>: inisialisasi → loop → tambah. <code className="inline">50_000_000</code> = underscore pemisah ribuan (Python mengabaikannya — keterbacaan!). Pola ini = fondasi <code className="inline">sum()</code>, <code className="inline">mean()</code>, dan seluruh agregasi manual.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Fungsi — NPL calculator reusable</summary>
              <p>Bungkus hitungan NPL jadi fungsi agar bisa dipakai untuk tiap kota.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def npl_pct(macet, total):
          &#x27;&#x27;&#x27;NPL % — macet dan total dalam satuan sama.&#x27;&#x27;&#x27;
          if total == 0:
              return 0.0
          return 100.0 * macet / total

      print(npl_pct(42, 1000))   # -&gt; 4.2
      print(npl_pct(0, 0))        # -&gt; 0.0 (tidak ZeroDivisionError!)</pre>
              <p><strong>Bedah:</strong> <em>guard clause</em> <code className="inline">if total == 0: return 0.0</code> mencegah crash — kebiasaan &ldquo;program tahan data kotor&rdquo; (D2!). Docstring menjelaskan kontrak fungsi. Sekali tulis, panggil untuk 34 provinsi tanpa copy-paste.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Bucket DPD dengan Fungsi</h2>

      <p>Tulis fungsi <code className="inline">bucket_dpd(dpd)</code> dan uji untuk dpd = 0, 15, 45, 120. Cetak hasilnya.</p>

      <PyodideLab
  title="Lab 1 — Fungsi Python Pertama"
  hint="Tambahkan validasi: dpd negatif → raise ValueError. (Error handling = D2!)"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Simulasi Sederhana</h2>

      <p>Simulasikan: nasabah bayar Rp 1 juta/bulan selama 12 bulan. Hitung total bayar + sisa dari plafon 50 juta. Pakai loop!</p>

      <PyodideLab
  title="Lab 2 — Loop &amp; Akumulasi"
  hint="Modifikasi: berhenti (break) jika total >= plafon. Berapa bulan?"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Python vs SQL</h2>

      <div className="decision-card">
<h3>1. Ambil/filter/agregat di database → <strong>SQL</strong></h3>
<p><strong>Kondisi data:</strong> Query data.</p>
<p><strong>Kenapa:</strong> Deklaratif, dioptimasi database, dekat data.</p>
<p><strong>Contoh nyata:</strong> NPL per kota (C3).</p>
</div>

      <div className="decision-card">
<h3>2. API, file, scraping → <strong>Python</strong></h3>
<p><strong>Kondisi data:</strong> Sumber non-DB.</p>
<p><strong>Kenapa:</strong> SQL tak bisa panggil API/baca file.</p>
<p><strong>Contoh nyata:</strong> Ambil data dari REST API (D15).</p>
</div>

      <div className="decision-card">
<h3>3. Statistik/ML → <strong>Python</strong></h3>
<p><strong>Kondisi data:</strong> Model.</p>
<p><strong>Kenapa:</strong> scipy/sklearn tidak ada di SQL.</p>
<p><strong>Contoh nyata:</strong> Regresi, clustering (D11/D12).</p>
</div>

      <div className="decision-card">
<h3>4. Otomasi terjadwal → <strong>Python</strong></h3>
<p><strong>Kondisi data:</strong> Rutin.</p>
<p><strong>Kenapa:</strong> Script + cron.</p>
<p><strong>Contoh nyata:</strong> Laporan email tiap pagi.</p>
</div>

      <div className="decision-card">
<h3>5. Keduanya bisa → <strong>SQL dulu</strong> (dekat data)</h3>
<p><strong>Kondisi data:</strong> Efisiensi.</p>
<p><strong>Kenapa:</strong> Jangan tarik 1 juta baris untuk di-filter di Python!</p>
<p><strong>Contoh nyata:</strong> Filter di SQL, analisis di Python.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>SQL = ambil data; Python = olah data. Jangan tertukar.</li><li>Filter/agregat <strong>di database</strong> — tarik hasil ringkas.</li><li>Fungsi untuk logika yang dipakai 2×+.</li><li>Indentasi 4 spasi — konsisten!</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Kalkulator Denda Keterlambatan</h2>

      <div className="callout">
<p>Bank: denda = 2% per bulan dari tunggakan, dihitung harian pro-rata. Tunggakan Rp 5 juta, telat 45 hari.</p><p><strong>Tugas:</strong> tulis fungsi <code className="inline">denda(tunggakan, hari_telat)</code> dan hitung. Lalu: apa yang terjadi jika hari_telat = 0? Negatif?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">def denda(t, h): return t * 0.02 * h / 30</code> → Rp 150.000. Hari 0 → 0 (benar). Negatif → negatif (salah! tambah validasi <code className="inline">if h &lt; 0: raise ValueError</code>).</p><p><strong>Pelajaran:</strong> fungsi bisnis <em>selalu</em> butuh validasi input — &ldquo;tidak mungkin negatif&rdquo; adalah undangan bug. Dan denda riil memakai compounding (B... track finansial!) — versi sederhana ini fondasinya.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Tulis kodenya dulu, baru cek. Target: 10–12 menit.</p>
            <ol>
              <li>Tulis fungsi <code className="inline">kategori_usia(u)</code>: &lt;17 → &#x27;anak&#x27;, &lt;60 → &#x27;dewasa&#x27;, sisanya → &#x27;lansia&#x27;. Tes dengan u = 65.</li>
              <li>List <code className="inline">gaji = [8_000_000, 12_500_000, 7_000_000]</code>: hitung rata-rata dengan loop akumulator (tanpa <code className="inline">sum()</code>/<code className="inline">len()</code> bawaan? boleh pakai len).</li>
              <li>Apa output <code className="inline">print(7 / 2)</code> vs <code className="inline">print(7 // 2)</code> vs <code className="inline">print(7 % 2)</code>? Kapan <code className="inline">//</code> berguna di analisis?</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1.
      def kategori_usia(u):
          if u &lt; 17:
              return &#x27;anak&#x27;
          elif u &lt; 60:
              return &#x27;dewasa&#x27;
          return &#x27;lansia&#x27;
      print(kategori_usia(65))  # -&gt; lansia
      # 2.
      gaji = [8_000_000, 12_500_000, 7_000_000]
      total = 0
      for g in gaji:
          total += g
      print(total / len(gaji))  # -&gt; 9166666.67</pre>
              <p><strong>3.</strong> <code className="inline">7/2 = 3.5</code> (float), <code className="inline">7//2 = 3</code> (floor), <code className="inline">7%2 = 1</code> (sisa). <code className="inline">//</code> berguna untuk &ldquo;berapa grup penuh&rdquo; (mis. 100 nasabah // 10 per batch = 10 batch) dan <code className="inline">%</code> untuk &ldquo;sisa/periodik&rdquo; (jam % 24, ganjil/genap).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Tipe:</strong> int/float/str/bool/None — konversi eksplisit!</li><li><strong>Kontrol:</strong> if/elif/else, for, while — indentasi = blok.</li><li><strong>Fungsi:</strong> def + return + docstring; DRY.</li><li><strong>SQL + Python:</strong> pasangan komplementer — SQL ambil, Python olah.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/c18-transaksi-acid" className="btn btn-secondary btn-sm">← ← C18</Link>
        <Link href="/learn/d2-struktur-data" className="btn btn-primary btn-sm">Next: D2 →</Link>
      </div>
    </div>
  );
}
