"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM4Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const etlData = [
    {
      x: ["ETL klasik", "ELT modern"],
      y: [30, 70],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1"] },
      text: ["transform dulu, lalu muat", "muat dulu, transform belakangan"],
      textposition: "outside",
    },
  ];

  const parquetData = [
    {
      x: ["CSV (row-based)", "Parquet (columnar)"],
      y: [100, 12],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["baca 100% kolom", "baca 12% kolom"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: ETL vs ELT — rasakan bedanya "transform di mana?"
import json

# SUMBER: 3 sistem dengan format beda-beda (realita integrasi!)
sumber = [
    '{"nasabah":"N001","nominal":"500000","tgl":"01/10/2026"}',   # format A: nominal string, tgl DD/MM
    '{"nasabah":"N002","nominal":1200000,"tgl":"2026-10-01"}',    # format B: sudah rapi
    '{"nasabah":"N003","nominal":"300.000","tgl":"01-10-2026"}',  # format C: titik ribuan!
]

# --- ETL: transform DULU (di pipeline), baru load yang bersih ---
def etl(rows):
    bersih = []
    for r in rows:
        d = json.loads(r)
        nom = int(str(d["nominal"]).replace(".", ""))  # "300.000" -> 300000
        tgl = d["tgl"].replace("/", "-")
        if len(tgl) == 10 and tgl[2] == "-":  # DD-MM-YYYY -> YYYY-MM-DD
            p = tgl.split("-"); tgl = f"{p[2]}-{p[1]}-{p[0]}"
        bersih.append((d["nasabah"], nom, tgl))
    return bersih  # yang di-load hanya versi bersih

# --- ELT: load MENTAH dulu, transform BELAKANGAN (saat query) ---
def elt(rows):
    return [json.loads(r) for r in rows]  # mentah apa adanya

print("ETL -> warehouse hanya terima yang bersih:", etl(sumber))
print()
print("ELT -> lake terima mentah:", elt(sumber))
print("     transform dilakukan saat query (contoh: hanya N001):")
mentah = elt(sumber)
print("    ", [(d["nasabah"], d["nominal"]) for d in mentah if d["nasabah"] == "N001"])
print()
print("Trade-off: ETL = data mentah HILANG (tidak bisa re-transform),")
print("           ELT = mentah tersimpan (bisa re-transform kapan saja).")
print("Coba: tambah sumber format D yang rusak total — mana yang lebih aman?")`;

  const lab2Code = `# Lab 2: Columnar vs Row-based — kenapa Parquet 10x lebih hemat untuk analitik
# Simulasi: tabel 1 juta baris x 50 kolom; query hanya butuh 3 kolom.

baris, kolom = 1_000_000, 50
butuh = 3
ukuran_sel = 8  # byte per sel (angka)

row_based = baris * kolom * ukuran_sel          # CSV: baca SEMUA kolom
columnar  = baris * butuh * ukuran_sel * 0.5    # Parquet: hanya kolom dipakai + kompresi ~2x

print(f"Tabel: {baris:,} baris x {kolom} kolom")
print(f"Query: agregat {butuh} kolom")
print(f"  Row-based (CSV) dibaca : {row_based/1e9:.1f} GB")
print(f"  Columnar (Parquet) dibaca: {columnar/1e9:.1f} GB")
print(f"  Penghematan: {row_based/columnar:.0f}x lipat")
print()
print("Di cloud, kamu bayar PER BYTE yang di-scan (BigQuery/S3).")
print("Format columnar = tagihan analitik turun drastis.")
print()
print("Coba: ubah 'butuh' jadi 40 kolom — kapan columnar tidak lagi hemat?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM4 — Data Management</span>
        <h1 className="display-title">Warehouse & Lakehouse:<br />Rumah Kedua untuk Data Analitik</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Data Mentah yang Terbuang</a></li>
          <li><a href="#etl">ETL vs ELT — Masak Dulu atau Simpan Dulu?</a></li>
          <li><a href="#arsitektur">Warehouse, Lake, Lakehouse — Tiga Generasi Rumah Data</a></li>
          <li><a href="#medallion">Medallion — Bronze, Silver, Gold</a></li>
          <li><a href="#parquet">Parquet & Format Kolom — Kenapa Analitik Butuh Format Khusus</a></li>
          <li><a href="#terbuka">Delta & Iceberg — ACID Kembali ke Danau</a></li>
          <li><a href="#lab1">🔬 Lab 1: ETL vs ELT dalam Kode</a></li>
          <li><a href="#lab2">🔬 Lab 2: Columnar vs Row-Based (Hitung Tagihannya)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Arsitektur Mana untuk Siapa</a></li>
          <li><a href="#worked">🔢 Worked Example: Tagihan Rp4,2 Jt vs Rp38 Rb</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Lakehouse = Danau yang Dipercaya</a></li>
          <li><a href="#lab3">🔬 Lab 3: Kalkulator Tagihan Format</a></li>
          <li><a href="#case">📋 Mini-Case: Migrasi Warehouse yang "Bengkak"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan ETL vs ELT dan konsekuensi masing-masing terhadap data mentah, biaya, dan fleksibilitas.</li>
          <li>Membedakan warehouse, lake, dan lakehouse — termasuk kapan masing-masing tepat.</li>
          <li>Merancang alur medallion (bronze → silver → gold) untuk satu kasus bisnis.</li>
          <li>Menjelaskan kenapa format columnar (Parquet) menghemat biaya analitik dan apa yang ditambahkan Delta/Iceberg.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Data Mentah yang Terbuang</h2>
      <div className="story">
        <p>Tahun 2019, sebuah e-commerce membangun ETL klasik: data dibersihkan <em>di pipeline</em>, yang masuk warehouse hanya versi bersih. Rapi. Dua tahun kemudian tim fraud butuh pola yang "dulu dianggap noise dan dibuang saat ETL" — jejak klik mentah sebelum dibersihkan. Data itu <strong>sudah tidak ada</strong>. ETL telah membuangnya permanen. Tim harus menunggu 6 bulan mengumpulkan data baru.</p>
        <p>Twist-nya: ETL tidak salah — ia hanya <em>keputusan satu arah</em>. Begitu transformasi dilakukan sebelum penyimpanan, kamu tidak bisa "un-cook" data. Revolusi <strong>ELT + data lake</strong> lahir dari pelajaran pahit ini: <em>simpan mentahnya dulu, masak belakangan</em> — karena kamu tidak tahu masakan apa yang akan diminta 2 tahun lagi. (Jembatan dari DM1: inilah tahap Store & Process yang dirancang sadar.)</p>
      </div>

      <h2 id="etl">ETL vs ELT — Masak Dulu atau Simpan Dulu?</h2>
      <ul>
        <li><strong>ETL (Extract-Transform-Load):</strong> <em>masak dulu, baru simpan</em>. Data dibersihkan/digabung di server ETL, warehouse hanya terima yang bersih. <em>Kepribadian: si koki perfeksionis — hidangan yang keluar rapi, tapi bahan mentah sisa dibuang.</em> Cocok: era storage mahal, skema stabil, compliance ketat (data mentah sensitif tidak boleh disimpan).</li>
        <li><strong>ELT (Extract-Load-Transform):</strong> <em>simpan dulu, masak belakangan</em>. Data mentah dimuat ke lake/warehouse, transformasi dijalankan di dalam platform (dbt, Spark SQL) saat dibutuhkan. <em>Kepribadian: si penimbun cerdas — gudang penuh bahan mentah, masak sesuai pesanan.</em> Cocok: storage murah (cloud), kebutuhan analisis berubah-ubah, ingin re-transform histori.</li>
      </ul>
      <p><strong>Kenapa industri bergeser ke ELT?</strong> Tiga alasan: (1) storage cloud murah (DM15), (2) compute terpisah dari storage — transformasi bisa pakai engine sekuat apapun, (3) kebutuhan tak terduga (seperti tim fraud di cerita) butuh data mentah.</p>

      <PlotlyChart
        data={etlData}
        title="Pergeseran Industri: ETL → ELT (ilustratif)"
        layout={{ xaxis: { title: "Pola" }, yaxis: { title: "% pipeline baru" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi pipeline <em>baru</em> yang dibangun dengan tiap pola.</p>
        <p><strong>Interpretasi:</strong> mayoritas pipeline baru memakai ELT — tapi ETL tidak mati. <strong>Jangan dogmatis:</strong> ETL tetap tepat saat data mentah <em>tidak boleh</em> disimpan (misal data kesehatan mentah sebelum pseudonymisasi — DM12) atau skema sangat stabil. Pilih dari kebutuhan, bukan tren.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "ELT berarti tidak perlu transformasi — data mentah langsung dipakai analis."</strong></p>
        <p><strong>Yang benar:</strong> ELT hanya <em>memindahkan</em> transformasi (dari server ETL ke dalam warehouse, via dbt). Transformasi tetap wajib — bedanya ia terjadi <em>setelah</em> data mentah tersimpan aman. Analis yang query tabel mentah langsung = kekacauan definisi (ingat mini-case DM1).</p>
      </div>

      <h2 id="arsitektur">Warehouse, Lake, Lakehouse — Tiga Generasi Rumah Data</h2>
      <ul>
        <li><strong>Data Warehouse:</strong> <em>apartemen mewah dengan aturan ketat</em> — skema didefinisikan dulu (schema-on-write), data terstruktur, SQL, mahal tapi rapi & cepat. Contoh: Snowflake, BigQuery, Redshift. Cocok: BI & laporan resmi.</li>
        <li><strong>Data Lake:</strong> <em>gudang raksasa tanpa sekat</em> — simpan semua format mentah (schema-on-read), murah (object storage). Contoh: S3 + Spark. Cocok: data science, data mentah tak terduga. Risiko: menjadi <strong>data swamp</strong> (rawa) jika tanpa katalog & tata kelola (DM10).</li>
        <li><strong>Lakehouse:</strong> <em>gudang dengan sistem apartemen</em> — murah & fleksibel seperti lake, tapi dengan transaksi, skema, dan kualitas seperti warehouse (via Delta/Iceberg). Contoh: Databricks, Snowflake (kini juga baca Iceberg). Arah industri 2026.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> "data swamp" adalah lake tanpa governance — DM10 (katalog) dan DM9 (governance) adalah <em>pencegahnya</em>, bukan hiasan. Setiap arsitektur di atas gagal tanpa keduanya. Teknologi tidak menggantikan tata kelola.</p>
      </div>

      <h2 id="medallion">Medallion — Bronze, Silver, Gold</h2>
      <p><strong>Definisi.</strong> Pola organisasi lakehouse dalam 3 lapis kematangan:</p>
      <ul>
        <li><strong>🥉 Bronze (mentah):</strong> data apa adanya dari sumber — JSON berantakan, duplikat, semua disimpan. <em>Tidak di-query analis.</em> Gunanya: re-processing & audit ("data aslinya seperti apa?").</li>
        <li><strong>🥈 Silver (bersih):</strong> sudah dibersihkan, deduplikasi, skema konsisten, tipe data benar. <em>Lapisan "satu versi kebenaran" teknis.</em> Analis mahir & data scientist boleh masuk.</li>
        <li><strong>🥇 Gold (siap bisnis):</strong> agregat & model dimensional (star schema DM2!) siap dashboard — <code className="inline">gold_penjualan_harian</code>, <code className="inline">gold_risiko_nasabah</code>. <em>Satu-satunya lapisan yang boleh dipakai laporan resmi.</em></li>
      </ul>
      <p><strong>Aturan aliran:</strong> data hanya mengalir Bronze → Silver → Gold, tidak loncat. Setiap lapis punya <strong>test kualitas</strong> (DM7) di pintunya — data gagal test tidak naik kelas.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Medallion = wajib 3 lapis selalu."</strong></p>
        <p><strong>Yang benar:</strong> medallion adalah <em>pola pikir</em> (mentah → bersih → siap bisnis), bukan hukum. Dataset kecil & sederhana boleh Bronze → Gold langsung. Yang tidak boleh: analis query Bronze langsung untuk laporan resmi — itu mengundang kekacauan definisi.</p>
      </div>

      <h2 id="parquet">Parquet & Format Kolom — Kenapa Analitik Butuh Format Khusus</h2>
      <p><strong>Masalah:</strong> CSV menyimpan per <em>baris</em> — query "rata-rata 1 kolom dari 50 kolom" tetap membaca 100% file. <strong>Parquet</strong> menyimpan per <em>kolom</em> (columnar): hanya kolom yang dibutuhkan yang dibaca, plus kompresi per-kolom yang efisien (nilai berulang terkompres hebat) dan <em>predicate pushdown</em> (lewati blok yang tidak memenuhi filter tanpa membacanya).</p>
      <p>Matematika tagihannya: jika query memakai <Tex math={String.raw`k`} /> dari <Tex math={String.raw`n`} /> kolom,</p>
      <Tex math={String.raw`\text{data dibaca} \approx \frac{k}{n} \times \text{kompresi}`} block />
      <p>dengan <Tex math={String.raw`k=3, n=50`} /> dan kompresi 2×: ~3% dari ukuran CSV. Di BigQuery/S3 kamu bayar per byte di-scan — format = uang (Lab 2).</p>

      <PlotlyChart
        data={parquetData}
        title="Data yang Dibaca: CSV vs Parquet (query 3 dari 50 kolom)"
        layout={{ xaxis: { title: "Format" }, yaxis: { title: "% data dibaca" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi file yang harus dibaca untuk query yang sama.</p>
        <p><strong>Interpretasi:</strong> Parquet membaca ~12% vs CSV 100% — penghematan ~8× pada kasus ini, sebelum predicate pushdown. <strong>Tapi</strong> (lihat Lab 2): jika query butuh 40 dari 50 kolom, keunggulannya menyusut. Columnar = untuk analitik (sedikit kolom, banyak baris); row-based (CSV/JSON) tetap tepat untuk operasional (satu baris utuh).</p>
      </div>

      <h2 id="terbuka">Delta & Iceberg — ACID Kembali ke Danau</h2>
      <p><strong>Masalah lake klasik:</strong> file Parquet di S3 tidak punya transaksi — tulis paruh jalan = file korup; tidak ada "update baris"; tidak ada time travel. <strong>Delta Lake & Apache Iceberg</strong> ("tabel terbuka"/open table formats) menambahkan <em>lapisan metadata transaksional</em> di atas file Parquet:</p>
      <ul>
        <li><strong>ACID</strong> untuk lake (ingat DM3A — ia kembali!): tulis atomik, isolasi antar job.</li>
        <li><strong>Time travel:</strong> query "tabel seperti 7 hari lalu" — penyelamat saat pipeline salah tulis.</li>
        <li><strong>Schema evolution:</strong> tambah kolom tanpa rewrite total.</li>
        <li><strong>Upsert/merge:</strong> update baris (CDC — DM6) tanpa rewrite partisi raksasa.</li>
      </ul>
      <p><strong>Kenapa "terbuka" penting:</strong> format terbuka (bukan proprietary) = tidak dikunci satu vendor — Spark, Trino, Snowflake, BigQuery bisa baca Iceberg yang sama. Ini alasan lowongan 2026 menyebut "Iceberg/Delta" sebagai preferred skill.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> lakehouse = lake (murah, fleksibel) + "otak" transaksional (Delta/Iceberg). Tanpa lapisan itu, lake = sekumpulan file; dengan lapisan itu, lake = database. Bedanya satu lapisan metadata — tapi mengubah segalanya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: ETL vs ELT dalam Kode</h2>
      <p>Integrasikan 3 sumber berformat beda — rasakan konsekuensi "masak dulu" vs "simpan dulu".</p>
      <PyodideLab
        title="Lab 1 — ETL vs ELT: Siapa Menyimpan Mentahnya?"
        hint="Coba: tambah sumber format D yang rusak. Mana yang masih bisa diperbaiki belakangan? Itulah nilai ELT."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Columnar vs Row-Based (Hitung Tagihannya)</h2>
      <p>Hitung sendiri berapa byte dibaca — dan kapan keunggulan columnar hilang.</p>
      <PyodideLab
        title="Lab 2 — Matematika Tagihan Cloud"
        hint="Coba: ubah 'butuh' 3 → 40 kolom. Pada titik berapa Parquet tidak lagi hemat? Itulah batasnya."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Arsitektur Mana untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Laporan resmi & dashboard direksi → <strong>Warehouse (atau lapis Gold lakehouse)</strong></h3>
        <p><strong>Kondisi:</strong> butuh SQL cepat, skema terkontrol, angka konsisten.</p>
        <p><strong>Kenapa:</strong> hanya data Gold yang boleh jadi "satu versi kebenaran" laporan.</p>
        <p><strong>Contoh nyata:</strong> Snowflake/BigQuery untuk KPI & regulatory reporting.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data mentah tak terduga + data science → <strong>Lake (Bronze) + format terbuka</strong></h3>
        <p><strong>Kondisi:</strong> volume besar, format campur, kebutuhan masa depan belum jelas.</p>
        <p><strong>Kenapa:</strong> simpan murah dulu (ELT); jangan buang yang belum dimengerti.</p>
      </div>

      <div className="decision-card">
        <h3>3. Butuh keduanya tanpa dua sistem → <strong>Lakehouse (Delta/Iceberg)</strong></h3>
        <p><strong>Kondisi:</strong> ingin murah+flesibel TAPI butuh ACID, time travel, upsert.</p>
        <p><strong>Kenapa:</strong> arah industri 2026; hindari vendor lock-in via format terbuka.</p>
      </div>

      <div className="decision-card">
        <h3>4. Query analitik mahal di cloud → <strong>format columnar (Parquet) + partisi</strong></h3>
        <p><strong>Kondisi:</strong> tagihan scan membengkak.</p>
        <p><strong>Kenapa:</strong> baca hanya kolom & partisi yang perlu = bayar hanya yang dipakai.</p>
      </div>

      <div className="decision-card">
        <h3>5. Data mentah sensitif / regulasi melarang simpan mentah → <strong>ETL klasik (transform dulu)</strong></h3>
        <p><strong>Kondisi:</strong> compliance (misal data kesehatan mentah).</p>
        <p><strong>Kenapa:</strong> ELT bukan dogma — jika mentahnya tidak boleh disimpan, masak dulu.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Simpan mentah</strong> (ELT) kecuali regulasi melarang.</li>
          <li><strong>Aliran satu arah:</strong> Bronze → Silver → Gold, dengan test di tiap pintu.</li>
          <li><strong>Laporan resmi = Gold saja.</strong> Analis dilarang query Bronze untuk angka resmi.</li>
          <li><strong>Format = uang:</strong> Parquet untuk analitik; Delta/Iceberg untuk transaksi di lake.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Tagihan Query Rp4,2 Juta vs Rp38 Ribu</h2>
      <p>Tabel <code className="inline">transaksi</code>: <strong>500 juta baris</strong>, 40 kolom, 250 byte/baris (row-based, mis. CSV di lake). Analis menjalankan query agregat harian yang hanya butuh <strong>4 kolom</strong>. Bandingkan 3 format — dengan angka tagihan cloud.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Row-based (CSV): bayar semua yang dibaca (klik untuk buka)</summary>
        <p>Ukuran total = <Tex math={String.raw`500 \times 10^6 \times 250 \text{ B} = 125 \text{ GB}`} />. Query memindai <strong>seluruh 125 GB</strong> walau cuma butuh 4 kolom.</p>
        <p>Tarif scan (gaya BigQuery on-demand): Rp6.700/GB → <Tex math={String.raw`125 \times 6.700 = \text{Rp}837.500`} /> <strong>per query</strong>. Analis menjalankan 5 query sejenis sehari:</p>
        <p><Tex math={String.raw`5 \times 837.500 = \text{Rp}4.187.500\text{/hari} \approx \text{Rp}125 \text{ jt/bulan}`} block /></p>
        <p>Satu analis, satu pola query, Rp125 juta/bulan. Inilah "migrasi warehouse yang bengkak" di mini-case — bukan karena datanya besar, tapi karena <em>formatnya</em> memaksa bayar 10× lipat.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Columnar (Parquet): baca hanya yang dipakai</summary>
        <p>Parquet menyimpan per kolom + kompresi (Snappy ~70% untuk data transaksional): ukuran ≈ <Tex math={String.raw`125 \times 0{,}3 = 37{,}5 \text{ GB}`} />. Query 4 dari 40 kolom ≈ baca <Tex math={String.raw`37{,}5 \times \frac{4}{40} = 3{,}75 \text{ GB}`} /> (plus sedikit metadata).</p>
        <p><Tex math={String.raw`\text{biaya/query} = 3{,}75 \times 6.700 = \text{Rp}25.125`} /></p>
        <p><Tex math={String.raw`\text{5 query/hari} \to \text{Rp}125.625\text{/hari} \approx \text{Rp}3{,}8 \text{ jt/bulan}`} block /></p>
        <p><strong>Rp125 jt → Rp3,8 jt/bulan (33× lebih murah)</strong> — tanpa mengubah 1 baris logika query. Pelajaran paling mahal-murah di track ini: <em>format file adalah keputusan finansial</em>.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Partition pruning: potong 30× lagi</summary>
        <p>Tabel dipartisi per <code className="inline">tanggal</code>. Query "7 hari terakhir" hanya menyentuh 7 dari 365 partisi:</p>
        <p><Tex math={String.raw`3{,}75 \text{ GB} \times \frac{7}{365} \approx 0{,}072 \text{ GB} = 72 \text{ MB}`} /></p>
        <p>Biaya/query → <strong>Rp482</strong>; 5 query/hari → <strong>Rp72 ribu/bulan</strong>. Dari Rp125 juta ke Rp72 ribu = <strong>1.700×</strong>. Tiga keputusan (columnar + kompresi + partisi) — semuanya di lapis <em>penyimpanan</em>, bukan kode.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Medallion: di mana angka ini "dimasak"?</summary>
        <p><strong>Bronze:</strong> 125 GB mentah (apa adanya, murah disimpan). <strong>Silver:</strong> 37,5 GB Parquet bersih + partisi (tempat 3 optimasi di atas diterapkan). <strong>Gold:</strong> agregat siap konsumsi — mis. <code className="inline">penjualan_harian</code> hanya <strong>365 baris × 30 kolom ≈ 50 KB</strong>; dashboard direksi query 50 KB, bukan 125 GB.</p>
        <p>Rasio dari Bronze ke Gold: <Tex math={String.raw`\frac{125 \text{ GB}}{50 \text{ KB}} = 2.500.000 : 1`} />. Setiap lapis medallion = <strong>kontrak biaya</strong>: makin ke kanan, makin kecil, makin mahal per byte (karena sudah dibersihkan), tapi makin murah per query. Inilah kenapa "langsung query Bronze" dilarang di organisasi dewasa.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> ETL vs ELT = "masak dulu atau simpan dulu?". <strong>ETL</strong> (transform sebelum load): hemat storage, tapi skema kaku — butuh kolom baru = ubah pipeline (lambat berminggu-minggu). <strong>ELT</strong> (load dulu ke lake, transform belakangan): fleksibel, tapi butuh disiplin (dbt + test, DM5/DM7) agar lake tidak jadi swamp. Aturan: data <em>terstruktur &amp; stabil</em> → ETL boleh; data <em>beragam &amp; eksploratif</em> → ELT + governance ketat.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Time travel: berapa harga 1 tahun riwayat?</summary>
        <p>Delta Lake snapshot harian: metadata per snapshot ≈ 10 KB (bukan data penuh — data file di-share antar snapshot!).</p>
        <p><Tex math={String.raw`365 \times 10 \text{ KB} = 3{,}65 \text{ MB/tahun}`} block /></p>
        <p><strong>Rp1.100/tahun</strong> untuk kemampuan "kembalikan tabel ke tanggal berapa pun". Bandingkan dengan backup harian full 240 GB × 365 = 87,6 PB (mustahil!). <strong>Table format modern = riwayat hampir gratis</strong> — tidak ada alasan lagi "tidak bisa mengulang laporan bulan lalu".</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Lakehouse = Danau yang Dapat Dipercaya</h2>
      <p>Sejarah tiga generasi dalam satu kalimat: <strong>warehouse</strong> (mahal, rapi, kaku) → <strong>lake</strong> (murah, fleksibel, kacau) → <strong>lakehouse</strong> (murah + rapi). Yang membuat lakehouse mungkin = <strong>table format terbuka</strong> (Delta, Iceberg, Hudi):</p>
      <ul>
        <li><strong>ACID kembali ke danau:</strong> tanpa table format, 2 job tulis bersamaan ke 1 partisi = file setengah tertulis (DM3a tanpa transaksi!). Dengan Delta/Iceberg: commit atomik via transaction log — pembaca tidak pernah melihat keadaan setengah.</li>
        <li><strong>Time travel gratis:</strong> tiap commit = snapshot berversi. "Kembalikan tabel ke kemarin jam 14.00" = 1 perintah, bukan restore backup 6 jam. Ini SCD Type 2 (DM2) di level <em>storage engine</em>.</li>
        <li><strong>Schema evolution:</strong> tambah kolom tanpa rewrite 125 GB (hanya metadata berubah). Di Parquet polos, tambah kolom = tulis ulang seluruh file.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> bank dengan 40 sumber (DM2) memakai pola <strong>lakehouse + medallion</strong>: Bronze = Delta mentah per sumber (tahan perubahan skema), Silver = bersih + SCD2, Gold = star schema mart (DM2) untuk analis. Satu storage (object storage murah, DM15), tiga lapis kepercayaan. Arsitektur modern (DM14) pada dasarnya = pola ini + desentralisasi kepemilikan.</p>
      <p><strong>Intuisi yang jarang dibahas — "small files problem":</strong> streaming (DM6) menulis 1 file per menit → 1.440 file/hari/partisi. Query 7 hari = buka 10.080 file; tiap open ≈ 10 ms → <strong>100 detik hanya untuk buka file</strong>, sebelum baca 1 byte! Solusi: <strong>compaction</strong> berkala (gabung file kecil jadi 128–512 MB). Lakehouse tanpa compaction = danau yang tenggelam oleh kerikilnya sendiri.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data lake = simpan semua mentah, nanti juga berguna (schema-on-read)."</strong></p>
        <p><strong>Yang benar:</strong> schema-on-read tanpa katalog (DM10), tanpa test (DM7), tanpa pemilik = <strong>data swamp</strong>: danau beracun yang tidak ada yang berani sentuh. Studi industri: 60–73% data perusahaan tidak pernah dipakai <em>sama sekali</em> — tapi tetap dibayar storage-nya dan tetap dihitung risikonya saat bocor (DM12). Lake yang sehat = schema-on-read <em>+ kontrak tulis</em> (DM8): fleksibel di hilir, disiplin di hulu.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Columnar vs Row — Hitung Sendiri Tagihannya</h2>
      <p>Model biaya scan: masukkan ukuran tabel &amp; kolom yang dipakai, lihat tagihan 3 format.</p>
      <PyodideLab
        title="Lab 3 — Kalkulator Tagihan Format"
        hint="Coba: naikkan KOLOM_TOTAL ke 200 (tabel makin lebar). Format mana yang tagihannya 'kebal' terhadap tabel lebar?"
        defaultCode={`# Lab 3: kalkulator biaya scan per format file
BARIS = 500_000_000
BYTE_PER_BARIS = 250
KOLOM_TOTAL = 40
KOLOM_DIPAKAI = 4
TARIF_RP_PER_GB = 6700
QUERY_PER_HARI = 5
HARI = 30

ukuran_gb = BARIS * BYTE_PER_BARIS / 1e9

def tagihan(gb_per_query):
    return gb_per_query * TARIF_RP_PER_GB * QUERY_PER_HARI * HARI

# 1) Row-based (CSV): scan semua
csv = tagihan(ukuran_gb)
# 2) Parquet: kompresi 70% + hanya kolom dipakai
parquet = tagihan(ukuran_gb * 0.3 * (KOLOM_DIPAKAI / KOLOM_TOTAL))
# 3) Parquet + partisi tanggal, query 7 hari terakhir
parquet_part = tagihan(ukuran_gb * 0.3 * (KOLOM_DIPAKAI / KOLOM_TOTAL) * (7/365))

print(f"Ukuran tabel mentah : {ukuran_gb:.0f} GB")
print(f"CSV                 : Rp{csv:,.0f}/bulan")
print(f"Parquet             : Rp{parquet:,.0f}/bulan")
print(f"Parquet + partisi   : Rp{parquet_part:,.0f}/bulan")
print()
print(f"Penghematan CSV -> Parquet+partisi: {csv/parquet_part:,.0f}x")
print("Moral: analis yang 'cuma query' bisa membakar Rp125 jt/bulan")
print("atau Rp72 rb/bulan — bedanya 3 keputusan format file.")`}
      />

      <h2 id="case">📋 Mini-Case: Migrasi Warehouse yang "Bengkak"</h2>
      <div className="callout">
        <p>Perusahaan migrasi warehouse on-premise ke Snowflake. Tagihan bulan pertama: <strong>$48.000</strong> — 6× estimasi! Investigasi: (1) tabel disimpan sebagai CSV di stage lalu di-load (bukan Parquet), (2) dashboard me-refresh tiap 5 menit dengan <code className="inline">SELECT *</code>, (3) tidak ada partisi tanggal — tiap query scan 3 tahun data.</p>
        <p><strong>Pertanyaan:</strong> (a) Tiga pemborosan itu melanggar prinsip apa dari lesson ini? (b) Perbaikan konkret tiap poin? (c) Kebijakan apa agar tidak terulang?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) (1) Format row-based untuk analitik; (2) query boros tanpa kebutuhan bisnis (refresh 5 menit untuk KPI harian?); (3) tanpa pruning partisi.</p>
          <p>(b) (1) Konversi ke Parquet/Iceberg; (2) refresh per jam + pilih kolom eksplisit; (3) partisi per tanggal + filter tanggal wajib.</p>
          <p>(c) <strong>FinOps data</strong> (DM15): budget per tim, alert anomali tagihan, review query termahal mingguan. Teknologi tanpa governance biaya = cek kosong.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: tagihan format file, rasio medallion, dan small files problem.</p>

      <details className="worked">
        <summary>Soal 1 — Tagihan: tabel 800 juta baris × 300 byte, query memakai 6 dari 50 kolom, tarif Rp6.700/GB, 3 query/hari, 30 hari. Bandingkan CSV vs Parquet+partisi (query 30 hari dari 365).</summary>
        <p>Ukuran = <Tex math={String.raw`8 \times 10^8 \times 300 \text{ B} = 240 \text{ GB}`} />.</p>
        <p>CSV: <Tex math={String.raw`240 \times 6.700 \times 3 \times 30 = \text{Rp}144{,}7 \text{ jt/bulan}`} />.</p>
        <p>Parquet: <Tex math={String.raw`240 \times 0{,}3 \times \frac{6}{50} = 8{,}64 \text{ GB}`} /> per query → <Tex math={String.raw`8{,}64 \times 6.700 \times 3 \times 30 = \text{Rp}5{,}2 \text{ jt}`} />.</p>
        <p>+Partisi: <Tex math={String.raw`5{,}2 \text{ jt} \times \frac{30}{365} \approx \text{Rp}427 \text{ rb/bulan}`} block /></p>
        <p><strong>Rp144,7 juta → Rp427 ribu (339×)</strong>. Tiga keputusan format — tanpa mengubah logika query.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Medallion: Bronze 240 GB, Gold 100 KB. Berapa rasio reduksinya?</summary>
        <p><Tex math={String.raw`\frac{240 \text{ GB}}{100 \text{ KB}} = \frac{240 \times 10^6 \text{ KB}}{100 \text{ KB}} = 2.400.000 : 1`} block /></p>
        <p>Setiap lapis medallion = kontrak: makin ke kanan makin kecil &amp; makin tepercaya. Dashboard direksi query 100 KB, bukan 240 GB.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Small files: streaming menulis 2.000 file/hari/partisi. Query 30 hari, tiap open file 10 ms. Berapa waktu hanya untuk <em>membuka</em> file?</summary>
        <p><Tex math={String.raw`2.000 \times 30 \times 10 \text{ ms} = 600.000 \text{ ms} = 600 \text{ detik} = 10 \text{ menit}`} block /></p>
        <p>10 menit <em>sebelum baca 1 byte</em>! Solusi: compaction berkala ke file 128–512 MB. Lakehouse tanpa compaction = tenggelam oleh kerikilnya sendiri.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan fundamental ETL vs ELT adalah…"
        options={[
          "Bahasa pemrogramannya",
          "ETL transform sebelum load (mentah hilang); ELT load mentah dulu, transform belakangan (mentah tersimpan, bisa re-transform)",
          "ELT tidak butuh transformasi",
          "ETL hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: ini soal URUTAN, bukan soal ada/tidaknya transformasi. Konsekuensinya: ELT menyimpan opsi masa depan (cerita pembuka)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kenapa Parquet jauh lebih hemat untuk query analitik dibanding CSV?"
        options={[
          "Karena namanya lebih keren",
          "Columnar: hanya kolom yang dibutuhkan dibaca + kompresi per-kolom + predicate pushdown — bayar per byte yang di-scan",
          "Karena terkompresi jadi ZIP",
          "Karena hanya bisa dibaca Spark",
        ]}
        correct={1}
        explanation="Benar: tiga mekanisme (baca kolom selektif, kompresi, skip blok) memangkas byte yang di-scan — dan di cloud, byte = uang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Apa yang ditambahkan Delta Lake / Iceberg di atas file Parquet biasa?"
        options={[
          "Hanya kompresi lebih baik",
          "Lapisan metadata transaksional: ACID, time travel, schema evolution, upsert — lake menjadi seperti database",
          "Hanya enkripsi",
          "Tidak ada, cuma rebranding",
        ]}
        correct={1}
        explanation="Benar: 'tabel terbuka' = Parquet + otak transaksional. Inilah fondasi lakehouse modern."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam medallion, analis boleh query langsung Bronze untuk laporan direksi?"
        options={[
          "Boleh, kan datanya lengkap",
          "TIDAK — Bronze itu mentah (kotor, duplikat). Laporan resmi hanya dari Gold; Silver untuk eksplorasi mahir",
          "Boleh jika pakai filter",
          "Hanya hari Jumat",
        ]}
        correct={1}
        explanation="Benar: tiap lapis punya kontrak kualitas. Query Bronze untuk angka resmi = mengundang kekacauan definisi (DM1)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Lake tanpa katalog & governance berisiko menjadi…"
        options={[
          "Data warehouse",
          "Data swamp — rawa data yang tidak bisa ditemukan/dipercaya",
          "Lakehouse otomatis",
          "Tidak ada risiko",
        ]}
        correct={1}
        explanation="Benar: data swamp. Teknologi lake + tanpa tata kelola (DM9/DM10) = tempat pembuangan, bukan aset."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan ETL klasik (bukan ELT) masih pilihan tepat?"
        options={[
          "Tidak pernah — sudah kuno",
          "Saat regulasi melarang menyimpan data mentah (misal data sensitif sebelum pseudonymisasi) atau skema sangat stabil",
          "Saat storage mahal saja",
          "Saat tim kecil",
        ]}
        correct={1}
        explanation="Benar: ELT bukan dogma. Jika mentahnya tidak boleh disimpan (compliance/privasi — DM12), transformasi harus terjadi SEBELUM penyimpanan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ETL vs ELT:</strong> urutan transformasi; ELT menyimpan opsi masa depan (mentah), ETL tepat saat mentah tak boleh disimpan.</li>
          <li><strong>Warehouse/Lake/Lakehouse:</strong> apartemen rapi / gudang murah / gudang berotak — pilih sesuai kebutuhan, bukan tren.</li>
          <li><strong>Medallion:</strong> Bronze (mentah) → Silver (bersih) → Gold (siap bisnis); test kualitas di tiap pintu; laporan resmi = Gold.</li>
          <li><strong>Parquet:</strong> columnar = baca sedikit kolom, bayar sedikit (di cloud).</li>
          <li><strong>Delta/Iceberg:</strong> ACID + time travel + upsert di atas file terbuka — fondasi lakehouse, skill yang dicari 2026.</li>
          <li><strong>Jangan:</strong> biarkan lake tanpa governance (swamp); query Bronze untuk angka resmi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm3b-database-nosql" className="btn btn-secondary btn-sm">← DM3B</Link>
        <Link href="/learn/dm5-orkestrasi-dbt" className="btn btn-primary btn-sm">Next: DM5 →</Link>
      </div>
    </div>
  );
}
