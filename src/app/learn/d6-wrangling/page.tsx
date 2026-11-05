import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function D6WranglingPage() {
  const chart1 = [{"x": ["merge", "concat", "groupby", "pivot/melt"], "y": [35, 15, 35, 15], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["35%", "15%", "35%", "15%"], "textposition": "outside"}];
  const lab1Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, io

nasabah = pd.read_csv(io.StringIO("""id,nama,kota
1,Andi,Jakarta
2,Budi,Bandung
3,Citra,Jakarta"""))
kredit = pd.read_csv(io.StringIO("""id,nasabah_id,plafon,kolektibilitas
1,1,50000000,1
2,2,100000000,2
3,2,30000000,3
4,3,30000000,1"""))

# cek duplikat key dulu!
print("duplikat id nasabah:", nasabah.duplicated("id").sum())

g = pd.merge(nasabah, kredit, left_on="id", right_on="nasabah_id",
             how="left", validate="1:m")
print(g[["nama", "kota", "plafon", "kolektibilitas"]])

# total plafon per kota (plafon granularitas kredit = AMAN)
print("\nTotal plafon per kota:")
print(g.groupby("kota")["plafon"].sum())

# Coba: hapus validate, duplikatkan 1 nasabah — apa yang terjadi?
`;
  const lab2Code = String.raw`import micropip
await micropip.install('pandas')

import pandas as pd, io

trx = pd.read_csv(io.StringIO("""nasabah_id,kategori,channel,jumlah
1,belanja,mobile,500000
1,makan,mobile,250000
2,belanja,web,1000000
2,travel,web,2000000
3,belanja,mobile,500000
1,travel,web,1200000"""))

# groupby 2 level
g = trx.groupby(["kategori", "channel"])["jumlah"].sum()
print(g)

# pivot: kategori x channel
p = trx.pivot_table(index="kategori", columns="channel",
                    values="jumlah", aggfunc="sum", fill_value=0)
print("\nPIVOT:"); print(p)

# melt kembali ke long
long = p.reset_index().melt(id_vars="kategori",
    var_name="channel", value_name="total")
print("\nMELT:"); print(long)

# Coba: pivot per nasabah_id juga (index 2 level). Kapan berguna?
`;
  const quizData = [{"question": "validate='1:m' pada merge nasabah->kredit…", "options": ["Mempercepat", "Error jika relasi bukan 1-ke-banyak — penjaga fan-out", "Mengubah hasil", "Tidak ada efek"], "correct": 1, "explanation": "Benar: 1 nasabah -> banyak kredit. Validasi relasi = tangkap masalah sebelum angka salah."}, {"question": "Duplikat key di kedua sisi merge…", "options": ["Aman", "Ledakan baris m:m — cek duplicated sebelum merge", "Otomatis dedup", "Error langsung"], "correct": 1, "explanation": "Benar: cek kedua sisi!"}, {"question": "transform vs agg…", "options": ["Sama", "transform: hasil ke tiap baris (tanpa melipat); agg: 1 baris per grup", "transform lebih lambat", "agg untuk kolom baru"], "correct": 1, "explanation": "Benar: transform = window function pandas."}, {"question": "pivot untuk ___ ; melt untuk ___ …", "options": ["analisis; tampil", "tampil (laporan); analisis (tidy/long)", "hapus; tambah", "cepat; lambat"], "correct": 1, "explanation": "Benar: wide dibaca manusia; long dianalisis mesin."}, {"question": "pd.concat 12 file bulanan…", "options": ["Loop append", "pd.concat([...], ignore_index=True)", "merge", "Tidak bisa"], "correct": 1, "explanation": "Benar: 1 baris untuk 12 file."}, {"question": "Filter eksistensi ('punya kredit macet') aman via…", "options": ["merge langsung", "Dedup key dulu baru merge (semi-join)", "concat", "pivot"], "correct": 1, "explanation": "Benar: tanpa dedup = fan-out."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">D6 — Python</span>
        <h1 className="display-title">Wrangling: Merge, GroupBy,<br/>Pivot &amp; Reshape</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tiga File, Satu Jawaban</a></li>
          <li><a href="#merge">merge — JOIN-nya pandas</a></li>
          <li><a href="#concat">concat — UNION-nya pandas</a></li>
          <li><a href="#groupby">GroupBy — Split-Apply-Combine</a></li>
          <li><a href="#reshape">pivot_table &amp; melt — Reshape</a></li>
          <li><a href="#lab1">🔬 Lab 1: Merge Aman</a></li>
          <li><a href="#lab2">🔬 Lab 2: GroupBy + Pivot</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Wrangling</a></li>
          <li><a href="#case">📋 Mini-Case: Tiga File, Satu Jawaban</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menggabungkan DataFrame dengan <strong>merge</strong> (how: inner/left) &amp; <strong>concat</strong>.</li><li>Melakukan <strong>groupby + agregasi</strong> (split-apply-combine).</li><li>Me-<strong>reshape</strong>: pivot_table &amp; melt.</li><li>Menghindari <strong>fan-out</strong> versi pandas (C5!).</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Tiga File, Satu Jawaban</h2>

      <div className="story"><p>Data tersebar: <em>nasabah.csv</em>, <em>transaksi.csv</em>, <em>kredit.csv</em>. Pertanyaan: <em>&ldquo;rata-rata transaksi per kota untuk nasabah yang punya kredit macet&rdquo;</em> — butuh ketiganya!</p><p><strong>Wrangling</strong> = seni menggabung &amp; membentuk data: merge (JOIN-nya pandas), groupby (GROUP BY-nya), pivot (reshape). Jika kamu kuasai SQL C5/C3, ini terasa familiar — <em>konsep sama, sintaks beda</em>. Lesson ini = kamus SQL→pandas.</p><p><strong>Twist-nya:</strong> merge/groupby/pivot = JOIN/GROUP BY-nya pandas — konsep yang sudah kamu kuasai di SQL! Yang berubah hanya sintaks. Kabar baiknya: belajar D6 terasa seperti &ldquo;terjemahan&rdquo;. Kabar buruknya: fan-out C5 juga ikut diterjemahkan — merge yang salah menggandakan baris sama diam-diamnya. Pengetahuan SQL-mu adalah bekal <em>dan</em> jebakan di sini.</p></div>

      <h2 id="merge">merge — JOIN-nya pandas</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># analogi SQL: SELECT * FROM nasabah n JOIN kredit k ON ...
gabung = pd.merge(nasabah, kredit,
                  left_on=&#x27;id&#x27;, right_on=&#x27;nasabah_id&#x27;,
                  how=&#x27;left&#x27;)  # inner/left/right/outer

# validasi relasi!
gabung = pd.merge(nasabah, kredit, left_on=&#x27;id&#x27;, right_on=&#x27;nasabah_id&#x27;,
                  how=&#x27;left&#x27;, validate=&#x27;1:m&#x27;)  # one-to-many: 1 nasabah -&gt; banyak kredit</pre>

      <div style={{ overflowX: "auto" }}>
<table className="data-table">
<thead><tr><th>how</th><th>SQL</th><th>Kapan</th></tr></thead>
<tbody>
<tr><td>inner</td><td>INNER JOIN</td><td>Default; hanya cocok</td></tr>
<tr><td>left</td><td>LEFT JOIN</td><td>Pertahankan kiri</td></tr>
<tr><td>outer</td><td>FULL OUTER</td><td>Semua; rekonsiliasi</td></tr>
<tr><td>cross</td><td>CROSS JOIN</td><td>Jarang; hati-hati!</td></tr>
</tbody>
</table>
</div>

      <ul>
<li><strong>validate:</strong> '1:1', '1:m', 'm:1', 'm:m' — <strong>error jika relasi tak sesuai!</strong> Penjaga fan-out.</li>
<li><strong>Fan-out (C5!):</strong> merge 1-ke-banyak menggandakan baris kiri — agregat setelahnya salah!</li>
<li><strong>Obat:</strong> agregat dulu baru merge (seperti derived table C6!).</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Selalu pakai <code className="inline">validate=</code> saat relasi diketahui! <code className="inline">validate='1:m'</code> melempar error jika ternyata bukan 1-ke-banyak — menangkap fan-out <em>sebelum</em> angka salah.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;merge selalu aman jika key-nya benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Key benar ≠ relasi benar! Duplikat di <em>kedua</em> sisi (m:m tak disengaja) = ledakan baris. Cek: <code className="inline">df.duplicated(key).sum()</code> di kedua sisi <em>sebelum</em> merge.</p>
</div>

      <h2 id="concat">concat — UNION-nya pandas</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># tumpuk baris (UNION ALL)
gabung = pd.concat([df_jan, df_feb], ignore_index=True)

# tumpuk kolom (sejajarkan index!)
lebar = pd.concat([df_a, df_b], axis=1)</pre>

      <ul>
<li><strong>axis=0</strong> (default) = tumpuk baris; <strong>axis=1</strong> = tumpuk kolom.</li>
<li><code className="inline">ignore_index=True</code> = reset index (hindari duplikat index!).</li>
<li><strong>Kapan:</strong> gabung file bulanan, tambah kolom hasil hitung.</li>
</ul>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Pola 'baca banyak file': <code className="inline">pd.concat([pd.read_csv(f) for f in files], ignore_index=True)</code> — 1 baris untuk 12 file bulanan!</p>
</div>

      <h2 id="groupby">GroupBy — Split-Apply-Combine</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># analogi SQL: SELECT kota, AVG(...) FROM ... GROUP BY kota
print(df.groupby(&#x27;kota&#x27;)[&#x27;penghasilan&#x27;].mean())

# multi-agregat
agg = df.groupby(&#x27;kota&#x27;).agg(
    n=(&#x27;nama&#x27;, &#x27;count&#x27;),
    rata_gaji=(&#x27;penghasilan&#x27;, &#x27;mean&#x27;),
    max_dpd=(&#x27;dpd&#x27;, &#x27;max&#x27;),
)

# transform: agregat kembali ke baris (tanpa melipat!)
df[&#x27;rata_kota&#x27;] = df.groupby(&#x27;kota&#x27;)[&#x27;penghasilan&#x27;].transform(&#x27;mean&#x27;)</pre>

      <ul>
<li><strong>agg:</strong> banyak agregat sekaligus dengan nama kolom baru.</li>
<li><strong>transform:</strong> hasil agregat <em>broadcast</em> ke tiap baris — seperti window function (C9!) tanpa melipat.</li>
<li><strong>apply:</strong> fungsi custom per grup (fleksibel, lambat) — hindari jika bisa vectorized.</li>
</ul>

      <details className="worked">
<summary>📐 Contoh: NPL per kota (pandas!)</summary>
<p><code className="inline">kredit['npl_flag'] = kredit['kolektibilitas'] &gt;= 3</code><br/><code className="inline">npl = kredit.groupby('kota').agg(total=('plafon','sum'), npl_plafon=('plafon', lambda s: s[kredit.loc[s.index,'npl_flag']].sum()))</code></p><p>Lebih mudah: <code className="inline">kredit.assign(npl_p=kredit.plafon.where(kredit.npl_flag, 0)).groupby('kota').agg(...)</code>. Bandingkan dengan SQL C3 — <em>konsep identik</em>!</p>
</details>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> groupby().transform() = window function pandas. 'Rata-rata kotanya di tiap baris' = transform, bukan merge hasil agregat (lebih cepat & aman).</p>
</div>

      <h2 id="reshape">pivot_table &amp; melt — Reshape</h2>

      <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># pivot: baris -&gt; kolom (seperti pivot SQL C10!)
pivot = df.pivot_table(index=&#x27;kota&#x27;, columns=&#x27;kategori&#x27;,
                        values=&#x27;jumlah&#x27;, aggfunc=&#x27;sum&#x27;, fill_value=0)

# melt: kolom -&gt; baris (unpivot!)
long = pivot.reset_index().melt(id_vars=&#x27;kota&#x27;,
    var_name=&#x27;kategori&#x27;, value_name=&#x27;total&#x27;)</pre>

      <ul>
<li><strong>pivot_table:</strong> index × columns → values (dengan agregat!).</li>
<li><strong>melt:</strong> wide → long (untuk plotting/analisis!).</li>
<li><strong>Aturan:</strong> tidy data = 1 baris per observasi (long). Pivot untuk <em>tampil</em>, melt untuk <em>analisis</em>.</li>
</ul>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Wide format lebih baik untuk analisis.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Sebaliknya! Kebanyakan operasi pandas/plot (groupby, seaborn) ingin <strong>long/tidy</strong>. Wide = untuk dibaca manusia (laporan). Melt dulu, analisis kemudian.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Frekuensi Operasi Wrangling (ilustrasi)"
  layout={{"xaxis": {"title": "Operasi"}, "yaxis": {"title": "%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Distribusi ilustratif.</p>
<p><strong>Interpretasi:</strong> merge + groupby = 70% wrangling. <strong>Kuasai dua ini dalam-dalam</strong> — sisanya menyusul. (Dan keduanya = JOIN & GROUP BY yang sudah kamu kuasai di SQL!)</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Wrangling = SQL yang kamu kenal, berbaju pandas.</p>

            <details className="worked">
              <summary>📐 Kasus 1: merge — validasi dengan indicator</summary>
              <p>Gabungkan nasabah &amp; kredit. Pastikan tidak ada nasabah hilang dan tidak ada kredit yatim.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">import pandas as pd
      gab = nasabah.merge(kredit, left_on=&#x27;id&#x27;, right_on=&#x27;nasabah_id&#x27;,
                          how=&#x27;left&#x27;, indicator=True)
      print(gab[&#x27;_merge&#x27;].value_counts())
      # both: 950, left_only: 50 (nasabah tanpa kredit -&gt; wajar),
      # right_only: 0 -&gt; jika &gt; 0: ADA KREDIT YATIM, investigasi!</pre>
              <p><strong>Bedah:</strong> <code className="inline">indicator=True</code> = audit merge bawaan: <code className="inline">_merge</code> menunjukkan asal tiap baris. <code className="inline">right_only &gt; 0</code> pada left merge = data integrity issue (kredit tanpa nasabah!). Jadikan ini kebiasaan: setiap merge penting → cek <code className="inline">_merge</code>.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: groupby — NPL per kota (vs SQL C3)</summary>
              <p>Terjemahkan query NPL per kota C3 ke pandas. Bandingkan keterbacaannya.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">npl = (kredit.assign(is_macet=(kredit[&#x27;status&#x27;] == &#x27;macet&#x27;).astype(int))
               .groupby(&#x27;kota&#x27;)
               .agg(total=(&#x27;is_macet&#x27;, &#x27;size&#x27;), macet=(&#x27;is_macet&#x27;, &#x27;sum&#x27;)))
      npl[&#x27;npl_pct&#x27;] = 100 * npl[&#x27;macet&#x27;] / npl[&#x27;total&#x27;]
      print(npl.sort_values(&#x27;npl_pct&#x27;, ascending=False))</pre>
              <p><strong>Bedah:</strong> <code className="inline">assign</code> = tambah kolom sementara; named aggregation <code className="inline">agg(total=(kolom, fungsi))</code> = SELECT dengan alias. Sama persis dengan SQL — hanya &ldquo;bahasa&rdquo; berbeda. Pilih yang tim-mu baca lebih cepat.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: melt — dari lebar ke panjang</summary>
              <p>Data lebar: kolom <code className="inline">jan, feb, mar</code> berisi total transaksi. Ubah ke format panjang (bulan, total) untuk plotting.</p>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox">lebar = pd.DataFrame(&#123;&#x27;kota&#x27;: [&#x27;JKT&#x27;, &#x27;SBY&#x27;],
                              &#x27;jan&#x27;: [100, 80], &#x27;feb&#x27;: [120, 90],
                              &#x27;mar&#x27;: [110, 95]&#125;)
      panjang = lebar.melt(id_vars=&#x27;kota&#x27;, var_name=&#x27;bulan&#x27;,
                           value_name=&#x27;total&#x27;)
      print(panjang.head(3))
      #   kota bulan  total
      # 0  JKT   jan    100 ... (6 baris: 2 kota x 3 bulan)</pre>
              <p><strong>Bedah:</strong> <code className="inline">melt</code> = unpivot: kolom jadi baris. Format panjang = format &ldquo;tidy&rdquo;: tiap baris 1 observasi — syarat untuk groupby, plot, dan model. Data lebar enak dibaca manusia; data panjang enak diolah mesin.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Merge Aman</h2>

      <p>Merge nasabah + kredit (left). Pakai validate='1:m' (1 nasabah -&gt; banyak kredit). Lalu hitung total plafon per kota — waspadai fan-out!</p>

      <PyodideLab
  title="Lab 1 — Merge + Validate"
  hint="Jebakan: hitung rata-rata plafon per nasabah setelah merge — benar atau fan-out?"
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: GroupBy + Pivot</h2>

      <p>Dari data transaksi: total per kategori per channel (groupby 2 level), lalu pivot jadi tabel, lalu melt kembali!</p>

      <PyodideLab
  title="Lab 2 — Agregat &amp; Reshape"
  hint="Transform: tambahkan kolom 'pangsa' = jumlah / total per kategori (window function!)."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Wrangling</h2>

      <div className="decision-card">
<h3>1. Gabung berdasar key → <strong>merge</strong></h3>
<p><strong>Kondisi data:</strong> JOIN.</p>
<p><strong>Kenapa:</strong> how=inner/left; validate relasi!</p>
<p><strong>Contoh nyata:</strong> Nasabah + kredit.</p>
</div>

      <div className="decision-card">
<h3>2. Tumpuk data sejenis → <strong>concat</strong></h3>
<p><strong>Kondisi data:</strong> UNION.</p>
<p><strong>Kenapa:</strong> axis=0 baris; ignore_index.</p>
<p><strong>Contoh nyata:</strong> File bulanan.</p>
</div>

      <div className="decision-card">
<h3>3. Agregat per grup → <strong>groupby.agg</strong></h3>
<p><strong>Kondisi data:</strong> GROUP BY.</p>
<p><strong>Kenapa:</strong> Multi-agregat bernama.</p>
<p><strong>Contoh nyata:</strong> NPL per kota.</p>
</div>

      <div className="decision-card">
<h3>4. Agregat ke tiap baris → <strong>transform</strong></h3>
<p><strong>Kondisi data:</strong> Window.</p>
<p><strong>Kenapa:</strong> Tanpa melipat baris.</p>
<p><strong>Contoh nyata:</strong> Rata-rata kota per baris.</p>
</div>

      <div className="decision-card">
<h3>5. Baris→kolom (tampil) → <strong>pivot_table</strong></h3>
<p><strong>Kondisi data:</strong> Laporan.</p>
<p><strong>Kenapa:</strong> Dengan agregat + fill_value.</p>
<p><strong>Contoh nyata:</strong> Kategori × channel.</p>
</div>

      <div className="decision-card">
<h3>6. Kolom→baris (analisis) → <strong>melt</strong></h3>
<p><strong>Kondisi data:</strong> Tidy.</p>
<p><strong>Kenapa:</strong> Long untuk groupby/plot.</p>
<p><strong>Contoh nyata:</strong> Wide → long.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>merge: cek duplikat key + validate!</li><li>Agregat dulu, merge kemudian (anti fan-out).</li><li>transform = window function (tanpa melipat).</li><li>Pivot untuk tampil; melt untuk analisis.</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Tiga File, Satu Jawaban</h2>

      <div className="callout">
<p><strong>Pertanyaan:</strong> rata-rata transaksi per kota untuk nasabah yang punya kredit macet (kolektibilitas 5).</p><p><strong>Tugas:</strong> tulis pipeline pandas lengkap: merge → filter → groupby. Identifikasi di mana fan-out bisa terjadi!</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p><code className="inline">k = kredit[kredit.kolektibilitas==5][['nasabah_id']].drop_duplicates()</code>  ← dedup dulu!<br/><code className="inline">n = nasabah.merge(k, left_on='id', right_on='nasabah_id')</code><br/><code className="inline">t = transaksi.merge(n[['id','kota']], left_on='nasabah_id', right_on='id')</code><br/><code className="inline">hasil = t.groupby('kota')['jumlah'].mean()</code></p><p><strong>Fan-out:</strong> jika tidak dedup k (nasabah 2 kredit macet), nasabah terganda → rata-rata salah! <strong>Pelajaran:</strong> dedup <em>sebelum</em> merge untuk filter eksistensi. Pola 'semi-join' = merge dengan tabel key unik.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Apa padanan pandas untuk <code className="inline">UNION ALL</code>? Tulis contohnya + kapan pakai <code className="inline">ignore_index=True</code>.</li>
              <li><code className="inline">pd.merge(a, b, on=&#x27;id&#x27;)</code> menghasilkan baris <em>lebih banyak</em> dari <code className="inline">len(a)</code>. Apa yang terjadi? Bagaimana mendiagnosis?</li>
              <li>Tulis 1 baris: pivot_table rata-rata gaji per kota (baris) per segmen (kolom).</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <div className="code-header"><span className="code-lang">python</span></div><pre className="codebox"># 1. UNION ALL = pd.concat:
      pd.concat([df_lama, df_baru], ignore_index=True)
      # ignore_index=True: reset index 0..n (tanpa ini: index ganda 0,1,2,0,1,2!)
      # 3.
      df.pivot_table(index=&#x27;kota&#x27;, columns=&#x27;segmen&#x27;,
                     values=&#x27;gaji&#x27;, aggfunc=&#x27;mean&#x27;)</pre>
              <p><strong>2.</strong> Fan-out! (C5 juga berlaku di pandas.) Diagnosis: <code className="inline">b[&#x27;id&#x27;].duplicated().sum()</code> — jika &gt; 0, sisi kanan tidak unik. Solusi: agregasi dulu di sisi banyak, baru merge (pola &ldquo;agregasi dulu&rdquo; universal!).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>merge</strong> = JOIN (validate!); <strong>concat</strong> = UNION.</li><li><strong>groupby.agg</strong> = GROUP BY; <strong>transform</strong> = window.</li><li><strong>pivot_table</strong> (tampil) / <strong>melt</strong> (analisis).</li><li><strong>Fan-out:</strong> cek duplikat key; agregat/dedup dulu baru merge.</li><li>SQL→pandas: konsep sama, sintaks beda.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/d5-data-cleaning" className="btn btn-secondary btn-sm">← ← D5</Link>
        <Link href="/learn/d7-datetime-timeseries" className="btn btn-primary btn-sm">Next: D7 →</Link>
      </div>
    </div>
  );
}
