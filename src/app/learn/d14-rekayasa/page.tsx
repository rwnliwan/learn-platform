import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D14RekayasaPage() {
  const chart1 = [{"x": ["Tanpa test", "Dengan test"], "y": [120, 20], "type": "bar", "name": "Waktu debug (mnt)", "marker": {"color": ["#ef4444", "#34a853"]}}];
  const lab1Code = String.raw`
# --- modul mini (cleaning.py pola) ---
def bucket_dpd(dpd):
    if dpd < 0:
        raise ValueError("dpd negatif!")
    if dpd == 0: return "lancar"
    if dpd <= 30: return "ringan"
    if dpd <= 90: return "sedang"
    return "berat"

def npl_ratio(plafon_npl, plafon_total):
    if plafon_total == 0: return 0.0
    return plafon_npl / plafon_total

# --- test (test_cleaning.py pola) ---
def test_bucket_batas():
    assert bucket_dpd(0) == "lancar"
    assert bucket_dpd(30) == "ringan"   # batas!
    assert bucket_dpd(31) == "sedang"   # batas!
    assert bucket_dpd(91) == "berat"
    print("test_bucket_batas LOLOS")

def test_bucket_negatif():
    try:
        bucket_dpd(-5)
        raise AssertionError("harusnya ValueError!")
    except ValueError:
        print("test_bucket_negatif LOLOS")

def test_npl_range():
    for a, b in [(0, 100), (50, 100), (100, 100), (0, 0)]:
        r = npl_ratio(a, b)
        assert 0 <= r <= 1, f"gagal untuk {a}/{b}"
    print("test_npl_range LOLOS")

test_bucket_batas(); test_bucket_negatif(); test_npl_range()
print("\nSemua test lolos! (di lokal: pytest test_cleaning.py)")

# Coba: tambahkan test untuk bucket_dpd(30.5) — float! Apa yang terjadi?
`;
  const lab2Code = String.raw`
import pandas as pd

ATURAN = {
    "kolom_wajib": ["id", "kota", "penghasilan", "dpd"],
    "kota_boleh": ["Jakarta", "Bandung", "Surabaya", "Medan"],
    "dpd_min": 0, "dpd_max": 3650,
}

def validasi(df):
    masalah = []
    for k in ATURAN["kolom_wajib"]:
        if k not in df.columns: masalah.append(f"kolom hilang: {k}")
    if (df["dpd"] < ATURAN["dpd_min"]).any() or (df["dpd"] > ATURAN["dpd_max"]).any():
        masalah.append("dpd di luar range!")
    asing = df[~df["kota"].isin(ATURAN["kota_boleh"])]["kota"].unique()
    if len(asing): masalah.append(f"kota tak dikenal: {list(asing)}")
    if df["id"].duplicated().any(): masalah.append("id duplikat!")
    if masalah: raise ValueError("VALIDASI GAGAL: " + "; ".join(masalah))
    return True

bersih = pd.DataFrame({"id": [1, 2], "kota": ["Jakarta", "Bandung"],
                        "penghasilan": [8e6, 9e6], "dpd": [0, 15]})
kotor = pd.DataFrame({"id": [1, 1], "kota": ["Jakarta", "Mars"],
                       "penghasilan": [8e6, 9e6], "dpd": [-5, 15]})

print("Data bersih:", end=" ")
try: validasi(bersih); print("LOLOS")
except ValueError as e: print(e)

print("Data kotor:", end=" ")
try: validasi(kotor); print("LOLOS")
except ValueError as e: print(e)

# Coba: tambahkan aturan 'penghasilan > 0'. Di mana menaruhnya? (pintu masuk!)
`;
  const quizData = [{"question": "Notebook vs modul .py…", "options": ["Sama", "Notebook=eksplorasi; .py=produksi/berbagi", "Notebook untuk produksi", ".py usang"], "correct": 1, "explanation": "Benar: pilih sesuai fase."}, {"question": "Test paling penting untuk…", "options": ["Semua baris", "Fungsi logika penting, terutama nilai batas", "Import", "Print"], "correct": 1, "explanation": "Benar: bug bersembunyi di batas (0, 30, 31)."}, {"question": "Validasi vs cleaning…", "options": ["Sama", "Validasi=menolak/menandai yang melanggar; cleaning=memperbaiki", "Cleaning lebih penting", "Validasi tidak perlu"], "correct": 1, "explanation": "Benar: beda peran, keduanya perlu."}, {"question": "Lima validasi universal…", "options": ["Plot 5 chart", "Skema, range, nilai diizinkan, not null, unik", "5 model ML", "Tidak ada"], "correct": 1, "explanation": "Benar: mulai dari sini."}, {"question": "Reproducibility butuh…", "options": ["Seed saja", "Seed + env + versi data + versi kode", "Git saja", "Tidak perlu"], "correct": 1, "explanation": "Benar: 4 pilar."}, {"question": "Angka/path sebaiknya di…", "options": ["Tersebar di kode", "config.py — satu tempat", "Di kepala", "Hardcode"], "correct": 1, "explanation": "Benar: ubah tanpa sentuh logika."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D14 — Python</span>
        <h1 className="display-title">Rekayasa: Modul, Test &amp;<br/>Reproducibility</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 'Di Laptop Saya Bisa'</a></li>
          <li><a href="#modul">Modul — Pecah Notebook Raksasa</a></li>
          <li><a href="#pytest">pytest — Test untuk Analis</a></li>
          <li><a href="#validasi">Validasi Data — Test untuk Data ⭐</a></li>
          <li><a href="#repro">Reproducibility — Hasil yang Bisa Diulang</a></li>
          <li><a href="#lab1">🔬 Lab 1: Tulis Test Pertama</a></li>
          <li><a href="#lab2">🔬 Lab 2: Validasi Data</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Rekayasa</a></li>
          <li><a href="#case">📋 Mini-Case: 'Di Laptop Saya Bisa'</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menyusun kode sebagai <strong>modul</strong> (bukan notebook raksasa).</li><li>Menulis <strong>test</strong> dengan pytest untuk fungsi analisis.</li><li>Menerapkan <strong>validasi data</strong> (pandera/great expectations konsep).</li><li>Menjamin <strong>reproducibility</strong> (seed, env, versi).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: 'Di Laptop Saya Bisa'</h2>

      <div className="story"><p>Analisis brilian — tapi hanya jalan di laptop pembuatnya. Di laptopmu: error library, hasil beda, path hardcode <code className="inline">C:\Users\Budi\...</code>. 3 hari untuk reproduksi.</p><p><strong>Rekayasa</strong> (software engineering untuk analis) = kode yang <em>jalan di mana saja</em>, <em>teruji</em>, <em>terreproduksi</em>. Ini pembeda analis senior — dan yang dicari di lowongan 2026 ('reproducible analysis', 'testing').</p><p><strong>Twist-nya:</strong> analisis brilian yang hanya jalan di satu laptop = analisis yang <em>tidak ada</em>. &ldquo;Works on my machine&rdquo; adalah versi analis dari &ldquo;tadi pagi masih jalan&rdquo;. Testing, environment, dan path relatif terdengar &ldquo;bukan kerjaan analis&rdquo; — sampai 3 hari hilang untuk reproduksi. Profesionalisme = orang lain bisa menjalankan kodemu tanpa meneleponmu.</p></div>

      <h2 id="modul">Modul — Pecah Notebook Raksasa</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># proyek_analisis/
#   config.py        &lt;- parameter (bukan hardcode!)
#   cleaning.py      &lt;- fungsi cleaning (D5)
#   features.py      &lt;- fungsi fitur (D10)
#   analisis.py      &lt;- alur utama

# config.py
AMBANG_DPD = 30
PATH_DATA = &#x27;data/kredit.parquet&#x27;
SEED = 42

# analisis.py
from cleaning import bersihkan
from config import PATH_DATA, SEED</pre>

      <ul>
<li><strong>Aturan:</strong> 1 file = 1 tanggung jawab; fungsi murni (input → output, tanpa efek samping).</li>
<li><strong>config.py:</strong> semua angka/path di satu tempat — ubah tanpa sentuh logika.</li>
<li><strong>if __name__ == '__main__':</strong> — file bisa di-import <em>dan</em> dijalankan.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Bau kode: angka ajaib ('30' tersebar), path hardcode, fungsi 100 baris, copy-paste. Obat: config, parameter, pecah fungsi.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Notebook cukup untuk analis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Notebook = eksplorasi (bagus!). Produksi/berbagi = modul + script. Aturan: <strong>eksplorasi di notebook, produksi di .py</strong>. Notebook yang di-run ulang hasilnya beda = bukan analisis, tapi <em>pertunjukan</em>.</p>
</div>

      <h2 id="pytest">pytest — Test untuk Analis</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># test_cleaning.py
from cleaning import bucket_dpd

def test_bucket_batas():
    assert bucket_dpd(0) == &#x27;lancar&#x27;
    assert bucket_dpd(30) == &#x27;ringan&#x27;
    assert bucket_dpd(31) == &#x27;sedang&#x27;

def test_bucket_negatif():
    try:
        bucket_dpd(-5)
        assert False, &#x27;harus error!&#x27;
    except ValueError:
        pass
# jalankan: pytest test_cleaning.py</pre>

      <ul>
<li><strong>Apa yang di-test:</strong> fungsi cleaning, fitur, metrik — <em>logika</em>, bukan data.</li>
<li><strong>Batas:</strong> test nilai tepi (0, 30, 31) — di situlah bug bersembunyi!</li>
<li><strong>Property test:</strong> 'NPL ratio selalu 0–1', 'tidak ada NaN setelah cleaning'.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Mulai kecil: test 3 fungsi terpentingmu. Test yang jalan tiap perubahan = <strong>jaring pengaman</strong> saat refactor.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Test memperlambat analis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Test 10 menit menghemat <em>debugging 2 jam</em> saat ubah kode 3 bulan kemudian. Dan test = <strong>dokumentasi hidup</strong> ('fungsi ini seharusnya...').</p>
</div>

      <h2 id="validasi">Validasi Data — Test untuk Data ⭐</h2>

      <p><strong>Konsep</strong> (pandera / great expectations): skema + aturan sebagai <em>kode</em>, dicek otomatis tiap data masuk:</p>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># konsep pandera (pola - tanpa install di lab)
aturan = &#123;
    &#x27;penghasilan&#x27;: &#123;&#x27;min&#x27;: 0, &#x27;tidak_null&#x27;: True&#125;,
    &#x27;dpd&#x27;: &#123;&#x27;min&#x27;: 0, &#x27;max&#x27;: 3650&#125;,
    &#x27;kota&#x27;: &#123;&#x27;nilai_boleh&#x27;: [&#x27;Jakarta&#x27;, &#x27;Bandung&#x27;, &#x27;Surabaya&#x27;, &#x27;Medan&#x27;]&#125;,
&#125;

def validasi(df, aturan):
    masalah = []
    if (df[&#x27;penghasilan&#x27;] &lt; 0).any():
        masalah.append(&#x27;penghasilan negatif!&#x27;)
    if not df[&#x27;kota&#x27;].isin(aturan[&#x27;kota&#x27;][&#x27;nilai_boleh&#x27;]).all():
        masalah.append(&#x27;kota tak dikenal!&#x27;)
    assert not masalah, masalah
    return True</pre>

      <ul>
<li><strong>Validasi ≠ cleaning:</strong> cleaning <em>memperbaiki</em>; validasi <em>menolak/menandai</em> yang melanggar.</li>
<li><strong>Di pipeline:</strong> validasi di <em>pintu masuk</em> — data busuk ditolak sebelum meracuni.</li>
<li><strong>Job relevance:</strong> 'data validation' = skill yang dicari 2026 (dbt test = versi SQL-nya, C15!).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Lima validasi universal: (1) skema (kolom+tipe), (2) range, (3) nilai diizinkan, (4) tidak null (kolom kunci), (5) unik (id). Mulai dari sini!</p>
</div>

      <h2 id="repro">Reproducibility — Hasil yang Bisa Diulang</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1. seed di satu tempat (config.py)
import random, numpy as np
SEED = 42
random.seed(SEED); np.random.seed(SEED)

# 2. catat environment
# pip freeze &gt; requirements.txt

# 3. catat versi data + kode
# git commit + hash dataset di laporan</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>Pilar</th><th>Cara</th><th>Tanpa ini</th></tr></thead>
<tbody>
<tr><td>Seed</td><td>config.SEED; rng(seed)</td><td>Hasil beda tiap run</td></tr>
<tr><td>Environment</td><td>requirements.txt</td><td>'Di laptop saya bisa'</td></tr>
<tr><td>Versi data</td><td>Hash/tanggal dataset</td><td>Data berubah diam-diam</td></tr>
<tr><td>Versi kode</td><td>git</td><td>Tidak tahu yang mana dipakai</td></tr>
</tbody>
</table>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;'Hasilnya sama kok kemarin.'&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Tanpa seed+env+versi, 'sama' = kebetulan. Sains = <strong>reproduksibel</strong>. Laporan tanpa info reproduksibilitas = anekdot, bukan analisis.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Checklist sebelum kirim analisis: ☐ seed tercatat ☐ requirements ☐ versi data ☐ kode di git ☐ hasil bisa di-run ulang dari nol. 5 centang = profesional.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Waktu Debug Perubahan Kode (ilustrasi)"
  layout={{"yaxis": {"title": "Menit"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Waktu menemukan bug setelah ubah kode 3 bulan kemudian.</p>
<p><strong>Interpretasi:</strong> Test = <strong>asuransi</strong>: bayar 10 menit sekarang, hemat 100 menit nanti. Bug yang ditangkap test = bug yang <em>tidak</em> sampai ke direksi.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Kode analis ≠ skrip sekali pakai.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Path hardcode — 3 hari reproduksi</summary>
              <p><code className="inline">pd.read_csv(&#x27;C:\Users\Budi\data\x.csv&#x27;)</code> — mati di laptopmu. Tulis yang portable.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">from pathlib import Path
      # SALAH: &#x27;C:\Users\Budi\data\x.csv&#x27; (Windows, user spesifik!)
      # BENAR: relatif terhadap file kode ini
      BASE = Path(__file__).parent
      df = pd.read_csv(BASE / &#x27;data&#x27; / &#x27;x.csv&#x27;)
      # -&gt; jalan di Windows/Mac/Linux, user siapapun, selama struktur folder sama.</pre>
              <p><strong>Bedah:</strong> <code className="inline">Path(__file__).parent</code> = &ldquo;folder tempat kode ini berada&rdquo; — jangkar portabel. Aturan: tidak ada path absolut di kode yang di-share; data di dalam repo (kecil) atau di path yang dikonfigurasi (besar).</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: pytest — test untuk fungsi NPL</summary>
              <p>Fungsi <code className="inline">npl_pct</code> (D1) diubah rekanmu. Bagaimana tahu ia tidak merusaknya?</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># test_analisis.py
      from analisis import npl_pct
      def test_npl_normal():
          assert npl_pct(42, 1000) == 4.2
      def test_npl_nol_bagi_nol():
          assert npl_pct(0, 0) == 0.0   # guard clause!
      def test_npl_100_persen():
          assert npl_pct(5, 5) == 100.0
      # $ pytest -&gt; 3 passed. Ubah fungsi -&gt; test menjerit SEBELUM ke produksi.</pre>
              <p><strong>Bedah:</strong> test = &ldquo;contoh yang dieksekusi&rdquo;. Tiga test 5 menit menulisnya; menyelamatkan dari &ldquo;refactor yang merusak diam-diam&rdquo;. Untuk analis: test fungsi hitung inti (NPL, DPD bucket, agregat) — bukan seluruh notebook.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Validasi data — test untuk data</summary>
              <p>Pipeline harian: pastikan tidak ada duplikat id &amp; tidak ada tanggal masa depan (ala C15, tapi di Python).</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">def validasi(df):
          assert not df[&#x27;id&#x27;].duplicated().any(), &#x27;duplikat id!&#x27;
          assert (df[&#x27;tanggal&#x27;] &lt;= pd.Timestamp.today()).all(), &#x27;tanggal masa depan!&#x27;
          assert df[&#x27;nominal&#x27;].ge(0).all(), &#x27;nominal negatif!&#x27;
          return True
      # Di pipeline: validasi(df_masuk); validasi(df_keluar)
      # Gagal -&gt; AssertionError -&gt; pipeline berhenti SEBELUM laporan salah terkirim.</pre>
              <p><strong>Bedah:</strong> <code className="inline">assert</code> = kontrak yang dieksekusi. Validasi input <em>dan</em> output (bug bisa lahir di tengah pipeline!). Ini &ldquo;test untuk data&rdquo; — melengkapi &ldquo;test untuk kode&rdquo; (pytest). Keduanya = analis yang tidur nyenyak.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Tulis Test Pertama</h2>

      <p>Fungsi bucket_dpd + npl_ratio. Tulis test: batas, negatif, NPL selalu 0–1. Jalankan pola assert!</p>

      <PyodideLab
  title="Lab 1 — pytest Pola"
  hint="Tantangan: test untuk fungsi parse_gaji (D2) — kasus '8,500,000', 'abc', None."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Validasi Data</h2>

      <p>Buat fungsi validasi: skema + range + nilai diizinkan. Uji dengan data BERSIH vs KOTOR — yang kotor harus DITOLAK!</p>

      <PyodideLab
  title="Lab 2 — Gate Validasi"
  hint="Refleksi: validasi ini = dbt test versi Python (C15). Di mana di pipeline menaruhnya?"
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Rekayasa</h2>

      <div className="decision-card">
<h3>1. Eksplorasi → <strong>notebook</strong></h3>
<p><strong>Kondisi data:</strong> Coba-coba.</p>
<p><strong>Kenapa:</strong> Cepat, visual.</p>
<p><strong>Contoh nyata:</strong> EDA awal.</p>
</div>

      <div className="decision-card">
<h3>2. Produksi/berbagi → <strong>modul .py</strong></h3>
<p><strong>Kondisi data:</strong> Serius.</p>
<p><strong>Kenapa:</strong> Terstruktur, teruji.</p>
<p><strong>Contoh nyata:</strong> Pipeline.</p>
</div>

      <div className="decision-card">
<h3>3. Logika penting → <strong>pytest</strong></h3>
<p><strong>Kondisi data:</strong> Aman.</p>
<p><strong>Kenapa:</strong> Jaring pengaman refactor.</p>
<p><strong>Contoh nyata:</strong> Fungsi cleaning.</p>
</div>

      <div className="decision-card">
<h3>4. Data masuk → <strong>validasi</strong></h3>
<p><strong>Kondisi data:</strong> Gate.</p>
<p><strong>Kenapa:</strong> Tolak busuk di pintu.</p>
<p><strong>Contoh nyata:</strong> Skema + range.</p>
</div>

      <div className="decision-card">
<h3>5. Kirim hasil → <strong>checklist repro</strong></h3>
<p><strong>Kondisi data:</strong> Profesional.</p>
<p><strong>Kenapa:</strong> seed+env+data+kode.</p>
<p><strong>Contoh nyata:</strong> 5 centang.</p>
</div>

      <div className="decision-card">
<h3>6. Angka config → <strong>config.py</strong></h3>
<p><strong>Kondisi data:</strong> Fleksibel.</p>
<p><strong>Kenapa:</strong> Ubah tanpa sentuh logika.</p>
<p><strong>Contoh nyata:</strong> Ambang, path, seed.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Notebook untuk eksplorasi; .py untuk produksi.</li><li>Test fungsi penting (batas!); validasi data masuk.</li><li>config.py untuk semua angka/path.</li><li>5 centang repro sebelum kirim.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: 'Di Laptop Saya Bisa'</h2>

      <div className="callout">
<p><strong>Situasi:</strong> Analisis hanya jalan di laptop Budi. Error di tempatmu: library beda versi, path <code className="inline">C:\Users\Budi</code>, hasil beda tiap run.</p><p><strong>Tugas:</strong> (1) Diagnosis 4 masalah. (2) Rencana perbaikan (struktur + file). (3) Tulis <strong>checklist repro</strong> untuk tim.</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><strong>(1)</strong> ① env tak tercatat ② path hardcode ③ seed tak ada ④ kode+data tak versi.</p><p><strong>(2)</strong> <code className="inline">proyek/&#123;config.py, cleaning.py, analisis.py, requirements.txt, README&#125;</code> + path relatif + SEED di config + git.</p><p><strong>(3)</strong> ☐ requirements.txt ☐ path relatif ☐ seed ☐ git commit ☐ versi data di README ☐ run dari nol berhasil.</p><p><strong>Pelajaran:</strong> 'bisa di laptop saya' = <strong>kegagalan profesional</strong>. Rekayasa = empati ke <em>pengguna kode berikutnya</em> (termasuk dirimu 3 bulan lagi).</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Notebook 500 cell &ldquo;final_v2_beneran.ipynb&rdquo;. Langkah pertama memecahnya jadi modul? (Sebutkan 2.)</li>
              <li><code className="inline">requirements.txt</code> vs <code className="inline">environment.yml</code> — apa bedanya? Kapan masing-masing?</li>
              <li>Tulis assert: &ldquo;kolom <code className="inline">kota</code> tidak boleh NULL dan hanya berisi 10 kota valid&rdquo;.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> (a) Ekstrak fungsi murni (hitung, bersih, plot) ke <code className="inline">.py</code> — notebook hanya orkestrasi + narasi. (b) Beri nama yang jujur (<code className="inline">hitung_npl.py</code>, bukan <code className="inline">utils_final2.py</code>). Prinsip: notebook = cerita, modul = mesin.</p>
              <p><strong>2.</strong> <code className="inline">requirements.txt</code> = pip (ringan, standar). <code className="inline">environment.yml</code> = conda (bisa paket non-Python: GDAL, dsb.). Untuk analis Python murni: requirements.txt + versi di-pin (<code className="inline">pandas==2.2.0</code>) cukup.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 3.
      KOTA_VALID = &#123;&#x27;Jakarta&#x27;, &#x27;Surabaya&#x27;, &#x27;Bandung&#x27;, &#x27;Medan&#x27;, &#x27;Semarang&#x27;,
                    &#x27;Makassar&#x27;, &#x27;Denpasar&#x27;, &#x27;Yogyakarta&#x27;, &#x27;Palembang&#x27;, &#x27;Balikpapan&#x27;&#125;
      assert df[&#x27;kota&#x27;].notna().all(), &#x27;kota NULL!&#x27;
      assert set(df[&#x27;kota&#x27;].unique()) &lt;= KOTA_VALID, &#x27;kota tak dikenal!&#x27;</pre>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Modul:</strong> 1 file 1 tugas; config.py untuk angka/path.</li><li><strong>pytest:</strong> test logika penting (batas!) = jaring pengaman.</li><li><strong>Validasi data:</strong> gate di pintu masuk (5 universal).</li><li><strong>Repro:</strong> seed + env + data + kode (5 centang).</li><li>Notebook eksplorasi; .py produksi.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d13-performa" className="btn btn-secondary btn-sm">← ← D13</Link>
        <Link href="/learn/d15-sql-python-api" className="btn btn-primary btn-sm">Next: D15 →</Link>
      </div>
    </div>
  );
}
