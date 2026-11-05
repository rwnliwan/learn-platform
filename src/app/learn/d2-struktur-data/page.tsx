import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D2StrukturDataPage() {
  const chart1 = [{"x": ["list", "dict", "tuple", "set"], "y": [40, 35, 10, 15], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["40%", "35%", "10%", "15%"], "textposition": "outside"}];
  const lab1Code = String.raw`
data = [
    {"nama": "Andi", "kota": "Jakarta", "dpd": 0},
    {"nama": "Budi", "kota": "Bandung", "dpd": 15},
    {"nama": "Citra", "kota": "Jakarta", "dpd": 45},
    {"nama": "Dewi", "kota": "Surabaya", "dpd": 0},
    {"nama": "Eko", "kota": "Jakarta", "dpd": 90},
]

# 1. rata-rata dpd
rata = sum(d["dpd"] for d in data) / len(data)
print(f"Rata-rata dpd: {rata}")

# 2. yang bermasalah (dpd > 30)
bermasalah = [d["nama"] for d in data if d["dpd"] > 30]
print(f"Bermasalah: {bermasalah}")

# 3. kota unik
kota_unik = {d["kota"] for d in data}
print(f"Kota unik: {kota_unik}")

# Coba: dict nama -> dpd via comprehension!
`;
  const lab2Code = String.raw`
def parse_gaji(s):
    try:
        return float(str(s).replace(",", ""))
    except (ValueError, AttributeError):
        return None

kotor = ["8,500,000", "tidak tahu", None, "12000000", ""]
bersih = [parse_gaji(x) for x in kotor]
print(f"Hasil parse: {bersih}")

valid = [x for x in bersih if x is not None]
print(f"Rata-rata valid: {sum(valid)/len(valid):,.0f}")
print(f"Tingkat kotor: {(len(kotor)-len(valid))/len(kotor):.0%}")

# Coba: apa yang terjadi tanpa try/except? (hapus dan jalankan!)
`;
  const quizData = [{"question": "dict sejak Python 3.7…", "options": ["Acak", "Menjaga urutan insert", "Tersortir otomatis", "Tidak bisa diubah"], "correct": 1, "explanation": "Benar: mitos 'dict acak' sudah usang sejak 3.7."}, {"question": "[x**2 for x in range(5) if x%2==0] = …", "options": ["[0,1,4,9,16]", "[0,4,16]", "[0,2,4]", "Error"], "correct": 1, "explanation": "Benar: 0,2,4 → kuadrat = 0,4,16."}, {"question": "except: (kosong, tanpa jenis)…", "options": ["Praktik baik", "Buruk — menangkap bug juga, sebutkan jenisnya", "Lebih cepat", "Wajib"], "correct": 1, "explanation": "Benar: tangkap spesifik (ValueError, dsb)."}, {"question": "Untuk parsing data kotor, yang tepat…", "options": ["if bertingkat", "try/except → None", "biarkan crash", "hapus baris"], "correct": 1, "explanation": "Benar: toleran untuk parsing; ketat untuk validasi bisnis."}, {"question": "json.loads dipakai untuk…", "options": ["Tulis file", "Parse string JSON (respons API)", "Hitung statistik", "Buat chart"], "correct": 1, "explanation": "Benar: API → JSON string → dict."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D2 — Python</span>
        <h1 className="display-title">Struktur Data, Comprehension<br/>&amp; Menangani Error</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 10.000 Baris Tanpa pandas?</a></li>
          <li><a href="#struktur">Empat Struktur — Pilih yang Tepat</a></li>
          <li><a href="#comprehension">Comprehension — Transformasi 1 Baris</a></li>
          <li><a href="#error">try/except — Program Tahan Data Kotor</a></li>
          <li><a href="#file">File I/O — CSV &amp; JSON</a></li>
          <li><a href="#lab1">🔬 Lab 1: Analisis List of Dicts</a></li>
          <li><a href="#lab2">🔬 Lab 2: Parser Tahan Kotor</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Struktur &amp; Error</a></li>
          <li><a href="#case">📋 Mini-Case: Pembersih Data Gaji</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Memakai <strong>list, dict, tuple, set</strong> untuk data terstruktur.</li><li>Menulis <strong>list/dict comprehension</strong> yang pythonic.</li><li>Menangani error dengan <strong>try/except</strong>.</li><li>Membaca/menulis <strong>file</strong> (CSV, JSON).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 10.000 Baris Tanpa pandas?</h2>

      <div className="story"><p>Sebelum pandas (D4), analis Python memakai <strong>list of dicts</strong>: tiap baris = dict, tabel = list. Pola ini masih dipakai untuk data kecil, API response (JSON), dan memahami <em>cara berpikir</em> tentang data terstruktur.</p><p>Lesson ini juga mengajarkan dua survival skill: <strong>comprehension</strong> (transformasi 1 baris) dan <strong>error handling</strong> (program yang tidak mati saat data kotor). Data nyata = kotor; program analis = harus tahan kotor.</p><p><strong>Twist-nya:</strong> list of dicts terlihat primitif di depan pandas — tapi JSON dari API juga list of dicts! &ldquo;Struktur data dasar&rdquo; bukan pelajaran usang; ia bentuk <em>mentah</em> setiap data sebelum menjadi DataFrame. Memahaminya = bisa menangani data <em>sebelum</em> ia rapi. Yang menguasai dasar tidak panik saat pandas belum bisa dipakai.</p></div>

      <h2 id="struktur">Empat Struktur — Pilih yang Tepat</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># list: urutan, bisa diubah
kota = [&#x27;Jakarta&#x27;, &#x27;Bandung&#x27;, &#x27;Surabaya&#x27;]
kota.append(&#x27;Medan&#x27;)

# dict: pasangan kunci-nilai (seperti 1 baris data!)
nasabah = &#123;&#x27;nama&#x27;: &#x27;Andi&#x27;, &#x27;kota&#x27;: &#x27;Jakarta&#x27;, &#x27;dpd&#x27;: 0&#125;
nasabah[&#x27;dpd&#x27;]  # 0

# tuple: urutan tetap (immutable)
koordinat = (-6.2, 106.8)

# set: unik, tanpa urutan
unik = set([&#x27;Jakarta&#x27;, &#x27;Jakarta&#x27;, &#x27;Bandung&#x27;])  # &#123;&#x27;Jakarta&#x27;, &#x27;Bandung&#x27;&#125;</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Struktur</th><th>Kapan</th><th>Contoh analis</th></tr></thead>
<tbody>
<tr><td>list</td><td>Urutan data</td><td>Daftar transaksi</td></tr>
<tr><td>dict</td><td>1 baris / mapping</td><td>Record nasabah; mapping kode→label</td></tr>
<tr><td>tuple</td><td>Tetap, ringan</td><td>Koordinat; return multi-nilai</td></tr>
<tr><td>set</td><td>Keunikan/keanggotaan</td><td>Kota unik; cek duplikat cepat</td></tr>
</tbody>
</table>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola 'tabel' manual: <code className="inline">data = [&#123;'nama': 'Andi', 'dpd': 0&#125;, &#123;...&#125;]</code> — list of dicts. Akses: <code className="inline">data[0]['nama']</code>. Ini <em>mental model</em> DataFrame (D4)!</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Dict tidak berurutan.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Sejak Python 3.7, dict <strong>menjaga urutan insert</strong>! Mitos lama dari Python 2. Tapi jangan andalkan untuk <em>sorting</em> — urutkan eksplisit jika butuh.</p>
</div>

      <h2 id="comprehension">Comprehension — Transformasi 1 Baris</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># tanpa comprehension
kuadrat = []
for x in range(5):
    kuadrat.append(x**2)

# dengan comprehension (pythonic!)
kuadrat = [x**2 for x in range(5)]

# dengan filter
genap = [x for x in range(10) if x % 2 == 0]

# dict comprehension: mapping dpd -&gt; bucket
bucket = &#123;d: (&#x27;lancar&#x27; if d == 0 else &#x27;telat&#x27;) for d in [0, 15, 45]&#125;</pre>

      <ul>
<li><strong>Pola:</strong> <code className="inline">[ekspresi for x in data if kondisi]</code>.</li>
<li><strong>Kapan:</strong> transformasi/filter list — lebih cepat dibaca & ditulis dari loop.</li>
<li><strong>Jangan:</strong> comprehension bersarang 3 level — jadi tak terbaca. Keterbacaan &gt; kepintaran.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Comprehension = 'SELECT transformasi' untuk list. Jika kamu berpikir 'untuk tiap x, hitung y' — tulis comprehension, bukan loop.</p>
</div>

      <h2 id="error">try/except — Program Tahan Data Kotor</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def parse_gaji(s):
    try:
        return float(s.replace(&#x27;,&#x27;, &#x27;&#x27;))
    except (ValueError, AttributeError):
        return None  # data kotor -&gt; None, bukan crash!

print(parse_gaji(&#x27;8,500,000&#x27;))  # 8500000.0
print(parse_gaji(&#x27;tidak tahu&#x27;))  # None
print(parse_gaji(None))          # None</pre>

      <ul>
<li><strong>try:</strong> coba; <strong>except:</strong> tangani jenis error tertentu.</li>
<li><strong>Jangan</strong> <code className="inline">except:</code> kosong (menangkap semua, termasuk bug!) — sebutkan jenisnya.</li>
<li><strong>EAFP:</strong> 'lebih mudah minta maaf' — coba dulu, tangani gagal. Gaya Python.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Error harus dihindari dengan if.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Untuk data kotor, try/except <em>lebih bersih</em> dari if bertingkat: <code className="inline">try: float(x) except: None</code> vs 5 baris pengecekan. Tapi untuk <em>logika bisnis</em> (dpd negatif), if/raise lebih tepat. Pilih sesuai konteks.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola analis: bungkus <em>parsing</em> dengan try/except → None; bungkus <em>validasi bisnis</em> dengan if → raise. Parsing toleran, validasi ketat.</p>
</div>

      <h2 id="file">File I/O — CSV &amp; JSON</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import csv, json

# tulis CSV
with open(&#x27;/tmp/nasabah.csv&#x27;, &#x27;w&#x27;, newline=&#x27;&#x27;) as f:
    w = csv.DictWriter(f, fieldnames=[&#x27;nama&#x27;, &#x27;dpd&#x27;])
    w.writeheader()
    w.writerows([&#123;&#x27;nama&#x27;: &#x27;Andi&#x27;, &#x27;dpd&#x27;: 0&#125;])

# baca JSON (format API!)
respon = &#x27;&#123;&quot;nama&quot;: &quot;Budi&quot;, &quot;dpd&quot;: 15&#125;&#x27;
data = json.loads(respon)
print(data[&#x27;nama&#x27;])  # Budi</pre>

      <ul>
<li><code className="inline">with open(...)</code> = buka-tutup otomatis (wajib!).</li>
<li><code className="inline">csv.DictWriter/DictReader</code> = CSV via dict (nyaman!).</li>
<li><code className="inline">json.loads/load</code> = parse JSON (API response!).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Di Pyodide (browser), file ditulis ke <em>memori virtual</em> — untuk latihan cukup. Di kerja nyata, file = lokal/server. pandas (D4) membuat ini 1 baris: <code className="inline">pd.read_csv(...)</code>.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Frekuensi Pakai Struktur Data (ilustrasi analis)"
  layout={{"xaxis": {"title": "Struktur"}, "yaxis": {"title": "% penggunaan"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Distribusi ilustratif pemakaian di kode analis.</p>
<p><strong>Interpretasi:</strong> list & dict mendominasi — <strong>kuasai dua ini dulu</strong>. tuple/set untuk kasus khusus. (Di pandas, semuanya dibungkus DataFrame — tapi mental model-nya dari sini.)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Struktur data = &ldquo;pilih wadah yang tepat&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: List of dicts — mini tabel manual</summary>
              <p>3 nasabah sebagai list of dicts. Hitung rata-rata penghasilan yang dpd = 0.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">nasabah = [
        &#123;&#x27;nama&#x27;: &#x27;Andi&#x27;, &#x27;gaji&#x27;: 10_000_000, &#x27;dpd&#x27;: 0&#125;,
        &#123;&#x27;nama&#x27;: &#x27;Budi&#x27;, &#x27;gaji&#x27;: 8_000_000,  &#x27;dpd&#x27;: 45&#125;,
        &#123;&#x27;nama&#x27;: &#x27;Citra&#x27;, &#x27;gaji&#x27;: 12_000_000, &#x27;dpd&#x27;: 0&#125;,
      ]
      lancar = [n[&#x27;gaji&#x27;] for n in nasabah if n[&#x27;dpd&#x27;] == 0]
      print(sum(lancar) / len(lancar))  # -&gt; 11000000.0</pre>
              <p><strong>Bedah:</strong> comprehension + filter = &ldquo;SELECT gaji WHERE dpd=0&rdquo; versi Python! Pola ini = cikal bakal boolean mask pandas (D4). List of dicts = &ldquo;tabel&rdquo; sebelum ada tabel.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Dict sebagai lookup — ganti rantai if</summary>
              <p>Mapping kode kota → nama. Bandingkan dengan if/elif berantai.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">kota = &#123;&#x27;JKT&#x27;: &#x27;Jakarta&#x27;, &#x27;SBY&#x27;: &#x27;Surabaya&#x27;, &#x27;BDG&#x27;: &#x27;Bandung&#x27;&#125;
      kode = &#x27;SBY&#x27;
      print(kota.get(kode, &#x27;Tidak dikenal&#x27;))  # -&gt; Surabaya
      print(kota.get(&#x27;MKS&#x27;, &#x27;Tidak dikenal&#x27;))  # -&gt; Tidak dikenal (tidak KeyError!)</pre>
              <p><strong>Bedah:</strong> <code className="inline">.get(kunci, default)</code> = &ldquo;lookup yang tidak meledak&rdquo;. 10 kode → 10 elif vs 1 dict: dict menang telak dalam keterbacaan <em>dan</em> kecepatan (O(1) vs O(n)). Mapping = dict; pilihan = if.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: try/except — parser tahan kotor</summary>
              <p>List gaji campur: <code className="inline">[&#x27;10000000&#x27;, &#x27;rusak&#x27;, &#x27;8500000&#x27;, None]</code>. Jumlahkan yang valid, hitung yang gagal.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">data = [&#x27;10000000&#x27;, &#x27;rusak&#x27;, &#x27;8500000&#x27;, None]
      total, gagal = 0, 0
      for x in data:
          try:
              total += int(x)
          except (ValueError, TypeError):
              gagal += 1
      print(total, gagal)  # -&gt; 18500000 2</pre>
              <p><strong>Bedah:</strong> <code className="inline">int(None)</code> → TypeError; <code className="inline">int(&#x27;rusak&#x27;)</code> → ValueError — tangkap keduanya. Pola &ldquo;coba, gagal → catat &amp; lanjut&rdquo; = jantung ETL yang tahan data kotor. Jangan <code className="inline">except:</code> polos — ia menyembunyikan bug <em>asli</em> (mis. typo nama variabel).</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Analisis List of Dicts</h2>

      <p>Data: list of dicts 5 nasabah. Hitung: rata-rata dpd, yang dpd&gt;30, kota unik. Pakai comprehension!</p>

      <PyodideLab
  title="Lab 1 — Tanpa pandas!"
  hint="Buat mapping {nama: bucket} memakai fungsi bucket_dpd (D1) + dict comprehension."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Parser Tahan Kotor</h2>

      <p>Data gaji kotor: ['8,500,000', 'tidak tahu', None, '12000000']. Parse semua → float atau None. Hitung rata-rata yang valid.</p>

      <PyodideLab
  title="Lab 2 — try/except untuk Data Kotor"
  hint="Tambahkan: log nilai kotor ke list terpisah untuk dilaporkan (data quality!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Struktur &amp; Error</h2>

      <div className="decision-card">
<h3>1. Urutan data → <strong>list</strong></h3>
<p><strong>Kondisi data:</strong> Koleksi.</p>
<p><strong>Kenapa:</strong> Append, index, iterasi.</p>
<p><strong>Contoh nyata:</strong> Daftar transaksi.</p>
</div>

      <div className="decision-card">
<h3>2. Record/mapping → <strong>dict</strong></h3>
<p><strong>Kondisi data:</strong> Kunci-nilai.</p>
<p><strong>Kenapa:</strong> Akses by name; 1 baris data.</p>
<p><strong>Contoh nyata:</strong> &#123;'nama': 'Andi'&#125;.</p>
</div>

      <div className="decision-card">
<h3>3. Unik/anggota → <strong>set</strong></h3>
<p><strong>Kondisi data:</strong> Dedup.</p>
<p><strong>Kenapa:</strong> O(1) membership; unik otomatis.</p>
<p><strong>Contoh nyata:</strong> Kota unik.</p>
</div>

      <div className="decision-card">
<h3>4. Transformasi list → <strong>comprehension</strong></h3>
<p><strong>Kondisi data:</strong> Pythonic.</p>
<p><strong>Kenapa:</strong> 1 baris, terbaca.</p>
<p><strong>Contoh nyata:</strong> [x**2 for x in data].</p>
</div>

      <div className="decision-card">
<h3>5. Parsing kotor → <strong>try/except → None</strong></h3>
<p><strong>Kondisi data:</strong> Toleran.</p>
<p><strong>Kenapa:</strong> Jangan crash; tandai kotor.</p>
<p><strong>Contoh nyata:</strong> parse_gaji.</p>
</div>

      <div className="decision-card">
<h3>6. Validasi bisnis → <strong>if → raise</strong></h3>
<p><strong>Kondisi data:</strong> Ketat.</p>
<p><strong>Kenapa:</strong> Bug harus berteriak, bukan diam.</p>
<p><strong>Contoh nyata:</strong> dpd negatif.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>list/dict = 90% kebutuhan; tuple/set untuk khusus.</li><li>'Untuk tiap x hitung y' → comprehension.</li><li>Parsing: try/except → None. Validasi: if → raise.</li><li><code className="inline">with open</code> selalu untuk file.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Pembersih Data Gaji</h2>

      <div className="callout">
<p><strong>Situasi:</strong> File CSV 1.000 baris, kolom gaji berantakan: '8,500,000', '8.5jt', 'tidak tahu', kosong, '-5000'.</p><p><strong>Tugas:</strong> tulis fungsi <code className="inline">bersihkan_gaji(s)</code> yang menangani semua + kembalikan (nilai, status). Status: 'ok' / 'kotor' / 'invalid'.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">def bersihkan_gaji(s):<br/>&nbsp;&nbsp;try:<br/>&nbsp;&nbsp;&nbsp;&nbsp;v = float(str(s).replace(',','').replace('jt',''))<br/>&nbsp;&nbsp;&nbsp;&nbsp;if 'jt' in str(s): v *= 1_000_000<br/>&nbsp;&nbsp;&nbsp;&nbsp;return (v, 'ok' if v &gt;= 0 else 'invalid')<br/>&nbsp;&nbsp;except: return (None, 'kotor')</code></p><p><strong>Pelajaran:</strong> fungsi cleaning mengembalikan <strong>(nilai, status)</strong> — bukan cuma nilai! Status memungkinkan <em>laporan kualitas</em> (C15): '5% kotor, 1% invalid'. Cleaning tanpa metrik = tak terukur.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Set vs list: kapan memakai <code className="inline">set</code>? Tulis contoh dedupe 1 baris.</li>
              <li>Tulis dict comprehension: <code className="inline">&#123;nama: bucket&#125;</code> dari list of dicts kasus 1 (pakai fungsi bucket D1).</li>
              <li>JSON dari API: <code className="inline">&#123;&#x27;data&#x27;: [&#123;&#x27;id&#x27;: 1&#125;, &#123;&#x27;id&#x27;: 2&#125;]&#125;</code>. Ambil list id-nya dalam 1 baris.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1. Set: keanggotaan cepat + dedupe otomatis
      kota_kotor = [&#x27;Jakarta&#x27;, &#x27;jakarta&#x27;, &#x27;Jakarta&#x27;, &#x27;Surabaya&#x27;]
      print(list(set(kota_kotor)))  # -&gt; 3 unik (perhatikan: case-sensitive!)
      # 2.
      bucket = &#123;n[&#x27;nama&#x27;]: (&#x27;lancar&#x27; if n[&#x27;dpd&#x27;] == 0 else &#x27;telat&#x27;)
                for n in nasabah&#125;
      # 3.
      resp = &#123;&#x27;data&#x27;: [&#123;&#x27;id&#x27;: 1&#125;, &#123;&#x27;id&#x27;: 2&#125;]&#125;
      ids = [r[&#x27;id&#x27;] for r in resp[&#x27;data&#x27;]]  # -&gt; [1, 2]</pre>
              <p><strong>Catatan soal 1:</strong> <code className="inline">set</code> membedakan &#x27;Jakarta&#x27; vs &#x27;jakarta&#x27; — normalisasi case <em>dulu</em> baru dedupe (pelajaran C4/D5!).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (5 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>list/dict/tuple/set:</strong> pilih sesuai kebutuhan; list of dicts = mental model tabel.</li><li><strong>Comprehension:</strong> transformasi 1 baris yang pythonic.</li><li><strong>try/except:</strong> parsing toleran (→None); <strong>if/raise:</strong> validasi ketat.</li><li><strong>File:</strong> with open + csv/json; pandas membuatnya 1 baris (D4).</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d1-python-dasar" className="btn btn-secondary btn-sm">← ← D1</Link>
        <Link href="/learn/d3-numpy" className="btn btn-primary btn-sm">Next: D3 →</Link>
      </div>
    </div>
  );
}
