"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM18Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const scaleData = [
    {
      x: ["Pandas<br>(1 mesin)", "Spark<br>(100 mesin)"],
      y: [10, 1000],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1"] },
      text: ["~10 GB", "~1.000 GB"],
      textposition: "outside",
    },
  ];

  const lazyData = [
    {
      x: ["Eager<br>(pandas)", "Lazy<br>(Spark)"],
      y: [5, 1],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1"] },
      text: ["5 tahap dibaca", "1x baca optimal"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Lazy evaluation — "rencana dulu, kerja nanti"
# Spark menunda eksekusi sampai ADA AKSI. Simulasi mental modelnya:

class MalasDF:
    """Tiru DataFrame Spark: transformasi hanya catat rencana."""
    def __init__(self, nama, rencana=()):
        self.nama, self.rencana = nama, rencana
    def filter(self, kondisi):
        return MalasDF(self.nama, self.rencana + (f"filter({kondisi})",))
    def pilih(self, *kolom):
        return MalasDF(self.nama, self.rencana + (f"pilih{kolom}",))
    def grup(self, kolom):
        return MalasDF(self.nama, self.rencana + (f"grup({kolom})",))
    def aksi_hitung(self):
        print(f"  EKSEKUSI '{self.nama}':")
        for i, r in enumerate(self.rencana, 1):
            print(f"    tahap {i}: {r}")
        print(f"  -> Catalyst mengoptimasi: filter DORONG ke sumber (predicate pushdown),")
        print(f"     hanya kolom dipakai yang dibaca (column pruning).")
        return 42  # hasil

print("== Transformasi (TANPA eksekusi!) ==")
df = MalasDF("transaksi")
q = df.filter("nominal > 1000000").pilih("nasabah_id", "nominal").grup("nasabah_id")
print("  (tidak ada yang berjalan... hanya rencana tercatat)")
print()
print("== Aksi memicu eksekusi ==")
q.aksi_hitung()
print()
print("Pelajaran: .filter/.select = TRANSFORMASI (malas).")
print(".count/.show/.collect = AKSI (bayar compute).")
print("Jebakan: .collect() di data raksasa = tarik semua ke driver = MATI.")
print("Coba: tambah .filter lagi sebelum aksi — rencana bertambah, eksekusi tetap 1x.")`;

  const lab2Code = `# Lab 2: Partisi & shuffle — kenapa "groupBy" bisa lambat
# Data 1 juta baris tersebar di 4 partisi. Hitung biaya perpindahan data.

import random
random.seed(3)

# Simulasi: 12 baris, kunci = kota. Partisi awal ACAK (bukan by kota).
baris = [(f"T{i}", random.choice(["JKT", "SBY", "BDG", "MDN"])) for i in range(12)]
partisi = {0: [], 1: [], 2: [], 3: []}
for i, b in enumerate(baris):
    partisi[i % 4].append(b)

print("Partisi AWAL (acak):")
for p, isi in partisi.items():
    print(f"  P{p}: {[b[1] for b in isi]}")

# groupBy kota -> data kota SAMA harus kumpul di 1 partisi = SHUFFLE (pindah jaringan!)
from collections import defaultdict
tujuan = defaultdict(list)
for p, isi in partisi.items():
    for b in isi:
        tujuan[b[1]].append((b, p))

pindah = sum(1 for kota, lst in tujuan.items() for b, asal in lst)
print()
print(f"SHUFFLE: {pindah} baris PINDAH via jaringan agar kota sama sekumpul.")
print("Inilah operasi TERMAL di Spark: groupBy, join, sort, distinct.")
print()
print("Aturan praktis:")
print("  1. Filter SEBELUM groupBy/join (kecilkan dulu, baru shuffle).")
print("  2. Broadcast JOIN untuk tabel kecil (kirim salinan, tanpa shuffle).")
print("  3. Hindari skew: 1 kunci raksasa = 1 partisi kepayahan.")
print()
print("Coba: semua baris jadi 'JKT' — apa yang terjadi ke 1 partisi? (skew!)")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM18 — Data Management</span>
        <h1 className="display-title">Spark & PySpark:<br />Mesin Data Raksasa yang Wajib Dikuasai</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laptop yang Menyerah di 50 GB</a></li>
          <li><a href="#mengapa">Kenapa Spark — Batas Satu Mesin</a></li>
          <li><a href="#arsitektur">Arsitektur: Driver, Executor, Partisi</a></li>
          <li><a href="#lazy">Lazy Evaluation — Rencana Dulu, Kerja Nanti</a></li>
          <li><a href="#shuffle">Shuffle — Operasi Termahal</a></li>
          <li><a href="#streaming">Structured Streaming — Jembatan ke DM6</a></li>
          <li><a href="#lab1">🔬 Lab 1: Lazy Evaluation dalam Kode</a></li>
          <li><a href="#lab2">🔬 Lab 2: Partisi & Shuffle</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Spark atau Bukan?</a></li>
          <li><a href="#worked">🔢 Worked Example: 50 GB Laptop vs Cluster</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Partisi = Unit Kebenaran</a></li>
          <li><a href="#lab3">🔬 Lab 3: Kalkulator Hukum Amdahl</a></li>
          <li><a href="#case">📋 Mini-Case: collect() yang Membunuh Cluster</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kapan Spark dibutuhkan (dan kapan pandas cukup) dengan argumen skala.</li>
          <li>Menjelaskan arsitektur Spark (driver, executor, partisi) dan bedanya transformasi vs aksi.</li>
          <li>Memprediksi operasi mahal (shuffle) dan menerapkan 3 aturan optimasi praktis.</li>
          <li>Menghubungkan Spark ke ekosistem: lakehouse (DM4), streaming (DM6), orkestrasi (DM5).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Laptop yang Menyerah di 50 GB</h2>
      <div className="story">
        <p>Analis menerima file 50 GB: "hitung total per kota, ya". Ia buka pandas — laptop 16 GB RAM langsung <em>freeze</em>. Ia coba baca per-chunk — kode jadi labirin, 6 jam berjalan, hasilnya meragukan. Senior lewat dan bertanya: <em>"kenapa tidak Spark?"</em> 20 menit kemudian, cluster 10 mesin selesai — dengan kode yang <strong>lebih pendek</strong> dari chunking manualnya.</p>
        <p>Twist-nya: Spark bukan "pandas yang lebih cepat" — ia <strong>cara berpikir berbeda</strong>: data terdistribusi, eksekusi malas, dan operasi termahal bukan CPU melainkan <strong>perpindahan data antar mesin</strong>. Lesson ini — diminta riset lowongan 2026 (Spark muncul di hampir semua posting data engineer!) — tentang mesin yang menjadi standar industri pemrosesan data besar, dan jebakan yang menanti pemakainya.</p>
      </div>

      <h2 id="mengapa">Kenapa Spark — Batas Satu Mesin</h2>
      <p><strong>Aturan praktis:</strong> data &lt; ~10 GB dan muat di RAM → <strong>pandas/DuckDB</strong> (lebih sederhana, lebih cepat untuk kecil!). Data &gt; puluhan GB, atau butuh paralelisme/cluster → <strong>Spark</strong>.</p>
      <p><strong>Kenapa bukan "server lebih besar"?</strong> (jembatan DM3B): scale-up ada plafon & mahal; Spark scale-out di atas puluhan/ratusan mesin komoditas. Plus: <strong>unified engine</strong> — batch, streaming (Structured Streaming), ML (MLlib), SQL — satu API, bukan 4 sistem.</p>

      <PlotlyChart
        data={scaleData}
        title="Batas Wajar: Pandas vs Spark"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Data (GB, ilustratif)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = ukuran data yang wajar ditangani tiap engine.</p>
        <p><strong>Interpretasi:</strong> jurang 100×. <strong>Tapi</strong> — jangan pakai Spark untuk 500 MB "biar keren": overhead cluster (detik–menit startup) mengalahkan pandas untuk data kecil. <strong>Pelajaran:</strong> pilih engine dari ukuran data, bukan gengsi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> lowongan 2026 hampir selalu menulis <strong>"PySpark"</strong> (bukan Scala) untuk level mid — Python + Spark API sudah cukup untuk 90% pekerjaan. Kuasai <strong>Spark SQL</strong> dulu (paling dipakai), baru DataFrame API; RDD hanya untuk sejarah.</p>
      </div>

      <h2 id="arsitektur">Arsitektur: Driver, Executor, Partisi</h2>
      <ul>
        <li><strong>Driver:</strong> otak — menjalankan kode <em>kamu</em>, menyusun rencana (DAG!), membagi tugas. <em>Bukan</em> tempat data besar diproses.</li>
        <li><strong>Executor:</strong> otot — proses di tiap mesin worker, menyimpan <strong>partisi</strong> data di memori/disk.</li>
        <li><strong>Partisi:</strong> potongan data tersebar. Paralelisme Spark = jumlah partisi (terlalu sedikit = mesin menganggur; terlalu banyak = overhead).</li>
        <li><strong>Cluster manager:</strong> YARN/Kubernetes/standalone — yang membagi resource.</li>
      </ul>
      <p><strong>Aturan emas:</strong> <strong>data tinggal di executor; driver hanya untuk rencana & hasil kecil.</strong> Melanggar ini = bencana (mini-case!).</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Spark = pandas yang otomatis paralel."</strong></p>
        <p><strong>Yang benar:</strong> API mirip, <strong>semantik beda</strong>: eksekusi malas (bukan langsung), data terdistribusi (bukan di satu memori), dan <code className="inline">collect()</code> memindahkan <em>semua</em> ke driver. Kode pandas yang "diterjemahkan" mentah-mentah ke Spark = lambat + berbahaya. Pelajari mental modelnya (lesson ini!), bukan sekadar API-nya.</p>
      </div>

      <h2 id="lazy">Lazy Evaluation — Rencana Dulu, Kerja Nanti</h2>
      <p><strong>Definisi.</strong> Transformasi (<code className="inline">filter</code>, <code className="inline">select</code>, <code className="inline">groupBy</code>, <code className="inline">join</code>) hanya <strong>mencatat rencana</strong>; <strong>aksi</strong> (<code className="inline">count</code>, <code className="inline">show</code>, <code className="inline">write</code>, <code className="inline">collect</code>) yang mengeksekusi.</p>
      <p><strong>Kenapa brilian:</strong> optimizer <strong>Catalyst</strong> melihat <em>seluruh</em> rencana sebelum kerja → <strong>predicate pushdown</strong> (filter didorong ke sumber — baca Parquet hanya blok relevan, DM4!), <strong>column pruning</strong> (hanya kolom dipakai yang dibaca), penggabungan tahap. Eager (pandas) mengeksekusi tiap baris = 5× baca.</p>
      <p>Rumus mentalnya:</p>
      <Tex math={String.raw`\text{transformasi} = \text{rencana (murah)} \quad;\quad \text{aksi} = \text{eksekusi (mahal)}`} block />

      <PlotlyChart
        data={lazyData}
        title="Eager vs Lazy: Berapa Kali Data Dibaca (5 tahap)"
        layout={{ xaxis: { title: "Model" }, yaxis: { title: "Kali baca sumber" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = berapa kali sumber dibaca untuk pipeline 5 tahap.</p>
        <p><strong>Interpretasi:</strong> lazy = 1× baca dengan rencana optimal vs eager = 5× baca buta. <strong>Tapi</strong> ada harga: error baru muncul saat <em>aksi</em> (debugging "kok gagal di .count() padahal salahnya di .filter() 20 baris atas?"). Biasakan <code className="inline">.show(5)</code> dini untuk validasi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> debugging Spark = <strong>picu aksi kecil lebih awal</strong> (<code className="inline">df.show(5)</code>, <code className="inline">df.count()</code> di sample). Jangan susun 50 transformasi lalu aksi — saat gagal, kamu tidak tahu di tahap mana.</p>
      </div>

      <h2 id="shuffle">Shuffle — Operasi Termahal</h2>
      <p><strong>Definisi.</strong> Shuffle = <strong>memindahkan data antar executor via jaringan</strong> agar data "sejenis" sekumpul — dibutuhkan oleh <code className="inline">groupBy</code>, <code className="inline">join</code>, <code className="inline">sort</code>, <code className="inline">distinct</code>. Jaringan = 100–1000× lebih lambat dari memori lokal.</p>
      <p><strong>Tiga aturan optimasi praktis</strong> (hafal untuk interview!):</p>
      <ol>
        <li><strong>Filter dulu, shuffle kemudian:</strong> kecilkan data <em>sebelum</em> operasi mahal.</li>
        <li><strong>Broadcast join untuk tabel kecil:</strong> kirim salinan tabel kecil ke semua executor — tanpa shuffle (<code className="inline">broadcast(df_kecil)</code>).</li>
        <li><strong>Waspadai skew:</strong> 1 kunci raksasa (misal kota "JKT" 80% data) = 1 partisi kepayahan sementara 99 menganggur. Obat: salting / pecah kunci.</li>
      </ol>
      <p><strong>Baca Spark UI:</strong> stage dengan "shuffle read/write" raksasa = tersangka utama job lambat. 80% tuning Spark = mengurangi shuffle.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Tambah executor = pasti lebih cepat."</strong></p>
        <p><strong>Yang benar:</strong> jika bottleneck = <strong>shuffle/skew</strong>, tambah mesin hanya menambah <em>penonton</em> — 1 partisi skew tetap dikerjakan 1 executor. Diagnosis dulu (Spark UI: apakah ada task jauh lebih lama?), baru scale. "Scale out" bukan obat untuk "salah desain".</p>
      </div>

      <h2 id="streaming">Structured Streaming — Jembatan ke DM6</h2>
      <p><strong>Definisi.</strong> API streaming Spark: perlakukan <strong>stream sebagai tabel tak terbatas</strong> — query batch yang sama jalan di streaming! Sumber: Kafka (DM6!); sink: Delta Lake / Kafka / console.</p>
      <p><strong>Konsep kunci:</strong> <strong>watermark</strong> (toleransi data telat — DM6), <strong>output mode</strong> (append/update/complete), <strong>checkpoint</strong> (wajib! untuk fault-tolerance & exactly-once), <strong>trigger</strong> (micro-batch interval).</p>
      <p><strong>Posisi di ekosistem:</strong> Kafka (transport, DM6) → <strong>Spark Structured Streaming</strong> (otak) → Delta Lake (sink transaksional, DM4) → Airflow orkestrasi (DM5). Inilah <strong>stack yang diminta lowongan 2026</strong> — dan kamu kini paham tiap lapisnya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> kekuatan Structured Streaming = <strong>kode batch = kode streaming</strong>. Belajar sekali, pakai dua kali. Tapi ingat DM6: streaming = mahal & kompleks — micro-batch 1–5 menit cukup untuk 90% "real-time".</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Lazy Evaluation dalam Kode</h2>
      <p>Simulasikan mental model Spark: transformasi malas, aksi mengeksekusi, Catalyst mengoptimasi.</p>
      <PyodideLab
        title="Lab 1 — Rencana Dulu, Kerja Nanti"
        hint="Coba: tambah .filter lagi sebelum aksi. Rencana bertambah, eksekusi tetap 1x — itulah lazy."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Partisi & Shuffle</h2>
      <p>Simulasikan kenapa groupBy memindahkan data via jaringan — dan 3 aturan menghindarinya.</p>
      <PyodideLab
        title="Lab 2 — Operasi Termahal"
        hint="Coba: buat semua baris 'JKT'. Partisi mana yang kepayahan? Itulah skew."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Spark atau Bukan?</h2>

      <div className="decision-card">
        <h3>1. Data &lt; 10 GB, muat RAM → <strong>pandas / DuckDB — JANGAN Spark</strong></h3>
        <p><strong>Kondisi:</strong> data kecil.</p>
        <p><strong>Kenapa:</strong> overhead cluster &gt; manfaat. Sederhana = cepat.</p>
      </div>

      <div className="decision-card">
        <h3>2. Data puluhan GB+, batch ETL → <strong>Spark (batch)</strong></h3>
        <p><strong>Kondisi:</strong> melebihi 1 mesin.</p>
        <p><strong>Kenapa:</strong> scale-out + lazy optimization + ekosistem (Delta, dbt via Spark SQL).</p>
      </div>

      <div className="decision-card">
        <h3>3. Stream dari Kafka, latensi menit → <strong>Structured Streaming (micro-batch)</strong></h3>
        <p><strong>Kondisi:</strong> butuh "nyaris real-time".</p>
        <p><strong>Kenapa:</strong> kode batch = kode streaming; checkpoint untuk fault-tolerance.</p>
      </div>

      <div className="decision-card">
        <h3>4. Job lambat → <strong>cek shuffle dulu di Spark UI, baru scale</strong></h3>
        <p><strong>Kondisi:</strong> tuning.</p>
        <p><strong>Kenapa:</strong> 80% masalah = shuffle/skew. Filter→broadcast→atasi skew.</p>
      </div>

      <div className="decision-card">
        <h3>5. Join tabel raksasa × tabel kecil → <strong>broadcast join</strong></h3>
        <p><strong>Kondisi:</strong> dimensi kecil (MB) vs fakta besar (GB).</p>
        <p><strong>Kenapa:</strong> tanpa shuffle — pola paling umum di ETL dimensional (DM2!).</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Transformasi = rencana; aksi = bayar.</strong> Validasi dengan aksi kecil lebih awal.</li>
          <li><strong>Jangan pernah collect() data besar</strong> ke driver.</li>
          <li><strong>Shuffle = musuh.</strong> Filter dulu, broadcast yang kecil, waspadai skew.</li>
          <li><strong>Ukuran data menentukan engine</strong> — bukan gengsi.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: 50 GB di Laptop vs di Cluster</h2>
      <p>Dataset transaksi <strong>50 GB</strong> (500 juta baris). Laptop: 16 GB RAM. Cluster: 10 worker × 16 GB. Ikuti kenapa laptop menyerah — dan kenapa cluster belum tentu 10× lebih cepat.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Kenapa laptop menyerah: aritmetika memori (klik untuk buka)</summary>
        <p>Pandas memuat 50 GB → butuh ~50 GB RAM (bahkan 2–3× dengan overhead object Python = <strong>100–150 GB</strong>!). RAM 16 GB → <strong>OOM kill</strong> atau swap ke disk (100× lebih lambat → "selesai besok pagi").</p>
        <p>Spark di laptop yang <em>sama</em>: partisi 50 GB menjadi 400 partisi × 128 MB → proses <strong>streaming per partisi</strong>, memori puncak ≈ <Tex math={String.raw`128 \text{ MB} \times \text{jumlah core} \approx 1 \text{ GB}`} />. <strong>Spark tidak butuh RAM raksasa — ia butuh partisi.</strong> Inilah intuisi inti: <em>bagi masalah sampai muat, kerjakan bergantian</em> (divide &amp; conquer dengan spill ke disk sebagai jaring pengaman).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Speedup cluster: hukum Amdahl dalam angka</summary>
        <p>Asumsi: 90% pekerjaan paralel (scan, filter), 10% serial (driver, koordinasi, 1 agregat final). 10 worker:</p>
        <p><Tex math={String.raw`\text{speedup} = \frac{1}{0{,}1 + \frac{0{,}9}{10}} = \frac{1}{0{,}19} \approx 5{,}3\times`} block /></p>
        <p><strong>Bukan 10×, tapi 5,3×</strong> — 10% serial membatasi. Dan ini <em>sebelum</em> shuffle. Pelajaran: menambah worker ke-11..20 memberi tambahan kecil (Amdahl!), sementara biaya naik linear. <strong>Cluster optimal = titik di mana 1 worker tambahan &lt; 5% speedup.</strong> Kebanyakan tim over-provision 2–3× karena tidak menghitung ini.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Shuffle: operasi termahal, dalam byte</summary>
        <p>Query <code className="inline">GROUP BY kota</code> pada 500 juta baris (50 GB): tiap worker harus mengirim datanya ke worker pemilik kota → <strong>50 GB melintasi jaringan</strong>. Pada 1 Gbps (≈ 100 MB/s efektif):</p>
        <p><Tex math={String.raw`\text{waktu shuffle} = \frac{50.000 \text{ MB}}{100 \text{ MB/s}} = 500 \text{ detik} \approx 8{,}3 \text{ menit}`} block /></p>
        <p>8,3 menit <em>hanya untuk pindah data</em> — belum hitung. Tiga obat: (1) <strong>kurangi sebelum shuffle</strong> (filter/agregat parsial dulu: 50 GB → 5 GB), (2) <strong>salting</strong> untuk skew (1 kota = 40% data → pecah key), (3) <strong>broadcast join</strong> untuk tabel kecil (&lt;10 MB dikirim ke semua worker, tanpa shuffle!). Aturan: <strong>lihat query plan — jika ada Exchange (shuffle), tanya "bisakah dihindari?"</strong> sebelum tanya "bisakah dipercepat?"</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — collect() yang membunuh cluster (mini-case!)</summary>
        <p><code className="inline">df.collect()</code> menarik <strong>semua 500 juta baris (50 GB)</strong> ke <em>driver</em> (1 node, 16 GB) → OOM → driver mati → <strong>seluruh job mati</strong> (driver = otak cluster!). Kerugian: 2 jam komputasi 10 worker × Rp20.000/jam = <strong>Rp400.000</strong> hangus + waktu.</p>
        <p>Aturan keras: <strong>driver hanya untuk <em>kecil</em></strong> — <code className="inline">take(10)</code>, <code className="inline">count()</code>, agregat. Data besar <em>tetap</em> di executor (tulis ke storage, DM4). Jika butuh sampel: <code className="inline">df.sample(0.001).collect()</code> (50 MB, aman). <strong>collect() tanpa limit = bom bunuh diri berjangka.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> lazy evaluation = <strong>Spark menunggumu selesai berpikir sebelum bekerja</strong>. <code className="inline">df.filter().select().groupBy()</code> = 0 byte diproses sampai ada <em>action</em> (<code className="inline">count/show/write</code>). Keuntungan: optimizer (Catalyst) melihat <em>seluruh rencana</em> → dorong filter ke paling awal (predicate pushdown: baca 5 GB bukan 50 GB!), gabung operasi. <strong>Tulis transformasi dengan berani — yang mahal hanya action.</strong> Dan <code className="inline">df.explain()</code> = X-ray: baca rencananya sebelum bayar eksekusinya.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Broadcast join: 8 MB vs 50 GB</summary>
        <p>Join fact 500 juta baris (50 GB) dengan dim_kota (8 MB, 500 baris). Shuffle join: 50 GB melintasi jaringan (~8 menit). Broadcast join: 8 MB dikirim ke 10 worker.</p>
        <p><Tex math={String.raw`\text{broadcast} = 8 \text{ MB} \times 10 = 80 \text{ MB} \ll 50 \text{ GB}`} block /></p>
        <p><strong>625× lebih sedikit data pindah.</strong> Aturan: tabel &lt; 10 MB (Spark default) → broadcast otomatis; tapi <em>cek explain()</em> — jika optimizer salah taksir ukuran, hint manual. <strong>Join termurah = join yang tidak shuffle.</strong></p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Partisi = Unit Kebenaran Spark</h2>
      <p>Semua perilaku Spark bisa diturunkan dari satu konsep: <strong>partisi</strong>.</p>
      <ul>
        <li><strong>Paralelisme = jumlah partisi</strong> (bukan jumlah worker!). 10 worker × 4 partisi = 40 tugas paralel. 4 partisi di 10 worker = 6 worker <strong>nganggur</strong>. Aturan: <strong>partisi ≈ 2–4× total core</strong>. Terlalu sedikit = nganggur; terlalu banyak (100.000 partisi mungil) = overhead scheduling membunuh (tiap task ~100 ms overhead → 10.000 detik!).</li>
        <li><strong>Skew = 1 partisi raksasa.</strong> 1 kota = 40% data → 1 task 8 menit, 39 task 30 detik → job selesai dalam <strong>8 menit</strong> (ditentukan yang terlambat!). Solusi <strong>salting</strong>: <code className="inline">kota + random(0..9)</code> → sebar ke 10 partisi → agregat 2 tahap. <strong>Straggler 1 task = seluruh job lambat.</strong> Monitor distribusi ukuran partisi seperti monitor kesehatan.</li>
        <li><strong>Narrow vs wide transformation.</strong> <em>Narrow</em> (filter, map): tiap partisi mandiri → murah, bisa pipeline. <em>Wide</em> (groupBy, join): butuh shuffle → mahal. <strong>Desain job = minimalkan wide transformation.</strong> 3 groupBy berantai = 3 shuffle = 25 menit jaringan; gabungkan logikanya jika bisa.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> kapan <strong>TIDAK</strong> butuh Spark (peta keputusan lesson ini!): data &lt; 10 GB → <strong>DuckDB/pandas</strong> (10–100× lebih cepat untuk kecil — tanpa overhead cluster!); query ad-hoc → <strong>warehouse</strong> (DM4); streaming &lt; detik → <strong>Flink</strong> (DM6). Spark menang di: <strong>10 GB – 10 TB, batch/kompleks, ETL berat</strong>. Memakai Spark untuk 500 MB = mengendarai truk tronton untuk beli gorengan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Spark = otomatis cepat untuk data besar."</strong></p>
        <p><strong>Yang benar:</strong> Spark = otomatis <em>terdistribusi</em>; cepat atau tidak tergantung <strong>partisi, shuffle, dan skew</strong>. Job Spark yang buruk (1 partisi, 5 shuffle, skew parah) bisa <strong>lebih lambat</strong> dari pandas di laptop! Kecepatan Spark = kecepatan <em>desain partisinya</em>. Tiga pertanyaan sebelum mengeluh "Spark lambat": (1) berapa partisi? (2) ada skew? (3) berapa shuffle di explain()? 90% "Spark lambat" terjawab di sini.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Hukum Amdahl — Kapan Nambah Worker Sia-sia?</h2>
      <p>Hitung speedup vs jumlah worker untuk job-mu. Temukan titik "cukup".</p>
      <PyodideLab
        title="Lab 3 — Kalkulator Amdahl"
        hint="Coba: ubah PARALEL dari 0.9 ke 0.99 (job sangat paralel). Berapa worker yang kini 'worth it'? Bandingkan dengan 0.7 (banyak serial)."
        defaultCode={`# Lab 3: hukum Amdahl — speedup vs jumlah worker
PARALEL = 0.9   # fraksi pekerjaan yang bisa diparalelkan
BIAYA_WORKER_JAM = 20_000  # Rp20 rb/jam/worker
WAKTU_SERIAL_JAM = 2       # waktu jika 1 worker

def speedup(n):
    return 1 / ((1 - PARALEL) + PARALEL / n)

print(f"Fraksi paralel: {PARALEL:.0%}\\n")
print(f"{'Worker':>6s} {'Speedup':>8s} {'Waktu':>8s} {'Biaya':>14s} {'+Speedup':>9s}")
prev = 1.0
for n in [1, 2, 4, 8, 10, 16, 32, 64]:
    s = speedup(n)
    waktu = WAKTU_SERIAL_JAM / s
    biaya = n * waktu * BIAYA_WORKER_JAM
    print(f"{n:>6d} {s:>7.2f}x {waktu:>7.2f}j Rp{biaya:>11,.0f} {s-prev:>+8.2f}")
    prev = s
print()
print("Lihat kolom +Speedup: worker ke-32 hanya menambah +0.3x")
print("tapi biaya NAIK. Titik 'cukup' = saat +speedup < 5%.")
print("Itulah kenapa cluster 64 node untuk job ini = buang uang.")`}
      />

      <h2 id="case">📋 Mini-Case: collect() yang Membunuh Cluster</h2>
      <div className="callout">
        <p>Engineer menulis: <code className="inline">df.filter(...).collect()</code> untuk "cek 5 baris" — di tabel <strong>2 miliar baris</strong>. Driver (16 GB) mencoba menampung semuanya → <strong>OutOfMemory → driver mati → seluruh job gagal</strong> setelah 40 menit berjalan. Diulang 3× ("mungkin glitch") — 2 jam cluster terbuang.</p>
        <p><strong>Pertanyaan:</strong> (a) Kesalahan mental model apa? (b) Perintah yang benar untuk "cek 5 baris"? (c) Kapan collect() boleh dipakai?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Driver ≠ tempat data.</strong> <code className="inline">collect()</code> menarik <em>semua</em> hasil ke driver — melanggar aturan emas arsitektur.</p>
          <p>(b) <code className="inline">df.show(5)</code> atau <code className="inline">df.limit(5).collect()</code> — aksi kecil, data kecil.</p>
          <p>(c) <strong>Hanya untuk hasil kecil yang pasti kecil</strong> (agregat final, list 100 item) — dan <em>setelah</em> yakin ukurannya. Aturan: jika tidak tahu ukurannya, jangan collect.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: Hukum Amdahl, biaya shuffle, dan jumlah partisi ideal.</p>

      <details className="worked">
        <summary>Soal 1 — Amdahl: 80% pekerjaan paralel, 8 worker. Berapa speedup? Berapa jika 64 worker?</summary>
        <p>8 worker: <Tex math={String.raw`\frac{1}{0{,}2 + 0{,}8/8} = \frac{1}{0{,}3} \approx 3{,}33\times`} />.</p>
        <p>64 worker: <Tex math={String.raw`\frac{1}{0{,}2 + 0{,}8/64} = \frac{1}{0{,}2125} \approx 4{,}71\times`} block /></p>
        <p>8× worker tambahan hanya +1,38× speedup. <strong>20% serial = langit-langit yang tidak bisa dibeli.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Shuffle: GROUP BY memindahkan 30 GB melintasi jaringan 120 MB/s. Berapa lama hanya untuk pindah data?</summary>
        <p><Tex math={String.raw`\frac{30.000 \text{ MB}}{120 \text{ MB/s}} = 250 \text{ detik} \approx 4{,}2 \text{ menit}`} block /></p>
        <p>4,2 menit <em>sebelum hitung</em>. Obat: agregat parsial dulu, salting untuk skew, broadcast join untuk tabel kecil.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Partisi: cluster 48 core. Berapa partisi ideal? Apa risiko 10 partisi? 100.000 partisi?</summary>
        <p>Ideal: <Tex math={String.raw`2 \times 48 \text{ s.d. } 4 \times 48 = 96 \text{–} 192 \text{ partisi}`} />.</p>
        <p>10 partisi → 38 core <strong>nganggur</strong>. 100.000 partisi → overhead scheduling (~100 ms/task) = <strong>10.000 detik sia-sia</strong>. <strong>Paralelisme = jumlah partisi, bukan jumlah worker.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bedanya transformasi vs aksi di Spark?"
        options={[
          "Tidak ada beda",
          "Transformasi (filter/select/groupBy) = catat rencana (lazy, murah); aksi (count/show/collect/write) = eksekusi (mahal). Optimizer bekerja di antara keduanya",
          "Aksi lebih murah",
          "Transformasi langsung jalan",
        ]}
        correct={1}
        explanation="Benar: lazy evaluation + Catalyst = 1× baca optimal. Harga: error muncul saat aksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Operasi Spark paling mahal dan kenapa?"
        options={[
          "filter — karena baca disk",
          "Shuffle (groupBy/join/sort) — memindahkan data antar executor via jaringan, 100–1000× lebih lambat dari memori lokal",
          "show(5)",
          "count",
        ]}
        correct={1}
        explanation="Benar: jaringan = bottleneck. 80% tuning = kurangi shuffle (filter dulu, broadcast, atasi skew)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. df.collect() di tabel 2 miliar baris. Apa yang terjadi?"
        options={[
          "Berhasil cepat",
          "Driver OOM & mati — collect menarik SEMUA ke driver. Untuk cek: show(5)/limit(5).collect()",
          "Data terduplikat",
          "Tidak ada efek",
        ]}
        correct={1}
        explanation="Benar: aturan emas — data tinggal di executor. collect hanya untuk hasil kecil yang pasti kecil."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Job lambat padahal executor banyak. Langkah diagnosis PERTAMA?"
        options={[
          "Tambah executor lagi",
          "Cek Spark UI: stage dengan shuffle read/write raksasa atau 1 task jauh lebih lama (skew) — scale tidak menyembuhkan desain salah",
          "Restart cluster",
          "Ganti bahasa",
        ]}
        correct={1}
        explanation="Benar: diagnosis sebelum scale. Skew = 1 partisi kepayahan; tambah mesin = tambah penonton."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Join tabel fakta 500 GB × tabel cabang 5 MB. Optimasi tepat?"
        options={[
          "Shuffle join biasa",
          "Broadcast join — kirim salinan tabel kecil ke semua executor, tanpa shuffle",
          "Jangan di-join",
          "Collect dulu",
        ]}
        correct={1}
        explanation="Benar: pola klasik ETL dimensional (DM2). Broadcast = pola wajib hafal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kenapa lowongan 2026 meminta 'Kafka + Spark Streaming' sebagai paket?"
        options={[
          "Karena namanya keren",
          "Kafka = transport event (DM6), Spark Structured Streaming = otak pemroses — ditambah Delta (sink) & Airflow (orkestrasi) = stack end-to-end standar industri",
          "Karena wajib dibeli bersama",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: tiap lapis punya peran. Memahami paket ini = memahami arsitektur streaming modern seutuhnya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kapan Spark:</strong> data &gt; puluhan GB / butuh cluster. Kecil = pandas/DuckDB.</li>
          <li><strong>Arsitektur:</strong> driver (rencana) + executor (data, partisi). Data tidak ke driver!</li>
          <li><strong>Lazy:</strong> transformasi = rencana, aksi = eksekusi; Catalyst mengoptimasi (pushdown, pruning).</li>
          <li><strong>Shuffle:</strong> operasi termahal — filter dulu, broadcast yang kecil, waspadai skew.</li>
          <li><strong>Structured Streaming:</strong> stream = tabel tak terbatas; Kafka → Spark → Delta.</li>
          <li><strong>Jangan:</strong> collect() buta; tambah mesin tanpa diagnosis; Spark untuk 500 MB.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm17-strategi-data" className="btn btn-secondary btn-sm">← DM17</Link>
        <Link href="/learn/dm19-capstone-dwh" className="btn btn-primary btn-sm">Next: DM19 Capstone →</Link>
      </div>
    </div>
  );
}
