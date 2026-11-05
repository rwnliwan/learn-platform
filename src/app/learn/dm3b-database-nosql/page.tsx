"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM3BPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const scaleData = [
    {
      x: ["Relasional vertikal (scale-up)", "NoSQL horizontal (scale-out)"],
      y: [1, 100],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1"] },
      text: ["server makin besar", "server makin banyak"],
      textposition: "outside",
    },
  ];

  const capData = [
    {
      x: ["CA (tanpa partition*)", "CP", "AP"],
      y: [20, 45, 35],
      type: "bar",
      marker: { color: ["#94a3b8", "#2a7de1", "#e8a838"] },
      text: ["sistem single-node", "bank, tiket", "feed, keranjang"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Document model — "model by query": simpan SESUAI cara dibaca
# Skenario: aplikasi e-commerce. Pola baca #1: "tampilkan 1 order + semua itemnya".

# Pendekatan RELASIONAL (3 tabel, butuh JOIN):
orders_r = [{"order_id": "O1", "nasabah": "N001", "tgl": "2026-10-01"}]
items_r  = [{"order_id": "O1", "produk": "Kopi", "qty": 2, "harga": 50000},
            {"order_id": "O1", "produk": "Gula", "qty": 1, "harga": 20000}]

# Pendekatan DOCUMENT (1 dokumen, 1x baca):
order_doc = {
    "order_id": "O1", "nasabah": "N001", "tgl": "2026-10-01",
    "items": [
        {"produk": "Kopi", "qty": 2, "harga": 50000},
        {"produk": "Gula", "qty": 1, "harga": 20000},
    ],
    "total": 120000,
}

print("Relasional: butuh 2 query + JOIN untuk 1 halaman order.")
print("Document  : 1x baca =", order_doc["order_id"], "-> total Rp120.000 langsung.")
print()
print("TAPI: 'total belanja Kopi bulan ini (semua order)' jadi MAHAL di document model")
print("      (harus buka SEMUA dokumen) — murah di relasional (1 agregat).")
print()
print("Pelajaran: NoSQL = model mengikuti POLA BACA dominan, bukan normalisasi.")
print("Coba: tambah field 'alamat_kirim' ke order_doc — tanpa migrasi skema!")`;

  const lab2Code = `# Lab 2: Eventual consistency — 3 replika, 1 update, "kapan semua sama?"
import random
random.seed(7)

replicas = {"Jakarta": "v1", "Singapura": "v1", "Tokyo": "v1"}  # status profil user
print("Awal :", replicas)

# User update foto profil -> tulis ke Jakarta (primary), replikasi ASYNC ke yang lain
replicas["Jakarta"] = "v2 (foto baru)"
print("T+0 dtk (tulis) :", replicas, "<- user di Tokyo masih lihat foto LAMA!")

# Replikasi menyusul dengan delay acak (eventual!)
for t in [1, 2, 3]:
    for kota in ["Singapura", "Tokyo"]:
        if replicas[kota] != "v2 (foto baru)" and random.random() < 0.6:
            replicas[kota] = "v2 (foto baru)"
    print(f"T+{t} dtk :", replicas)

print()
print("Semua replika AKHIRNYA sama (converge) — tapi ada jendela inkonsistensi.")
print("Untuk foto profil: tidak masalah. Untuk SALDO bank: BENCANA.")
print("Itulah beda AP (available, eventual) vs CP (consistent) di teorema CAP.")
print()
print("Coba: ganti 0.6 -> 0.2 (jaringan lambat). Berapa lama konvergensi?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM3B — Data Management</span>
        <h1 className="display-title">NoSQL, BASE & CAP:<br />Ketika Satu Server Tidak Lagi Cukup</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 12.12 dan Database yang Menyerah</a></li>
          <li><a href="#mengapa">Kenapa NoSQL Lahir — Batas Scale-Up</a></li>
          <li><a href="#empat">Empat Penghuni Kebun Binatang NoSQL</a></li>
          <li><a href="#base">BASE — Sumpah yang Lebih Santai dari ACID</a></li>
          <li><a href="#cap">Teorema CAP — Pilih Dua, Bayar Satu</a></li>
          <li><a href="#polyglot">Polyglot Persistence — Satu Perusahaan, Banyak Database</a></li>
          <li><a href="#lab1">🔬 Lab 1: Document Model — Model by Query</a></li>
          <li><a href="#lab2">🔬 Lab 2: Eventual Consistency dalam Aksi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Database Mana untuk Apa</a></li>
          <li><a href="#worked">🔢 Worked Example: 800 TPS → 40.000 TPS</a></li>
          <li><a href="#intuisi">🧠 Intuisi: BASE = Percaya, Verifikasi Belakangan</a></li>
          <li><a href="#lab3">🔬 Lab 3: Quorum dalam Aksi</a></li>
          <li><a href="#case">📋 Mini-Case: Feed yang Kadang "Telat"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kenapa database relasional sulit di-scale horizontal dan masalah apa yang dipecahkan NoSQL.</li>
          <li>Membedakan 4 tipe NoSQL (document, key-value, wide-column, graph) beserta contoh produk dan kasus pakainya.</li>
          <li>Menjelaskan BASE vs ACID dan kapan eventual consistency bisa diterima vs berbahaya.</li>
          <li>Menerapkan teorema CAP untuk memilih arsitektur (CP vs AP) pada 3 skenario nyata.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 12.12 dan Database yang Menyerah</h2>
      <div className="story">
        <p>Flash sale 12.12: 2 juta orang membuka aplikasi dalam 10 menit. Database relasional — satu server perkasa seharga mobil — mulai tersedak: antrian query menumpuk, timeout di mana-mana, checkout gagal massal. Tim infra buru-buru "naikkan spek server" (scale-up). Butuh 30 menit provisioning. Sale-nya sudah selesai.</p>
        <p>Twist-nya: masalahnya bukan servernya kurang besar — masalahnya <em>arsitekturnya tidak bisa nambah server</em>. Database relasional klasik scale-up (satu mesin makin besar), dan mesin terbesar pun ada batasnya. NoSQL lahir dari kebutuhan berlawanan: <strong>scale-out</strong> — tambah 100 server murah saat traffic naik, buang lagi saat sepi. Pelajaran lesson ini: tidak ada database "terbaik", yang ada adalah <em>trade-off yang dipilih sadar</em> — dan harganya dijelaskan teorema CAP.</p>
      </div>

      <h2 id="mengapa">Kenapa NoSQL Lahir — Batas Scale-Up</h2>
      <p><strong>Scale-up (vertikal):</strong> beli server makin besar. Mudah (tidak ubah kode), tapi ada plafon fisik dan harga naik eksponensial. <strong>Scale-out (horizontal):</strong> tambah banyak server kecil. Murah dan nyaris tanpa batas — <em>tapi</em> data tersebar di banyak mesin, dan mesin-mesin itu harus <em>sepakat</em> (konsensus itu mahal & lambat).</p>
      <p>NoSQL = keluarga database yang dirancang untuk scale-out sejak lahir, dengan cara <strong>mengorbankan sebagian jaminan relasional</strong> (join kompleks, ACID penuh) demi throughput dan ketersediaan. Lahir di Google/Amazon/Facebook akhir 2000-an untuk masalah yang relasional tidak bisa selesaikan: miliaran user, petabyte data.</p>

      <PlotlyChart
        data={scaleData}
        title="Scale-Up vs Scale-Out (jumlah node tipikal)"
        layout={{ xaxis: { title: "Arsitektur" }, yaxis: { title: "Node (skala log)", type: "log" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang (skala log) = jumlah server yang wajar dipakai tiap arsitektur.</p>
        <p><strong>Interpretasi:</strong> scale-up berhenti di 1 mesin (sebesar apapun); scale-out umum mencapai ratusan node. Inilah celah yang diisi NoSQL. <strong>Tapi ingat:</strong> kebanyakan perusahaan <em>tidak butuh</em> 100 node — satu Postgres yang di-tune baik menangani jutaan baris. Jangan bayar harga kompleksitas distributed sebelum butuh.</p>
      </div>

      <h2 id="empat">Empat Penghuni Kebun Binatang NoSQL</h2>

      <p><strong>1. Document (MongoDB, CouchDB)</strong> — <em>si arsiparis fleksibel</em>. Data = dokumen JSON/BSON; tiap dokumen boleh beda field. Query by key + filter. Cocok: katalog produk, profil user, CMS — data yang "dibaca utuh sekaligus". Prinsip: <strong>model by query</strong> (Lab 1), bukan normalisasi.</p>
      <p><strong>2. Key-Value (Redis, DynamoDB)</strong> — <em>si pelayan kilat</em>. Struktur paling sederhana: kunci → nilai, O(1). Tidak ada query kompleks — tapi <em>sangat</em> cepat (sub-milidetik). Cocok: cache, session, leaderboard, rate limiter. Kalau butuh "cari berdasarkan isi", ini alat yang salah.</p>
      <p><strong>3. Wide-Column (Cassandra, HBase, Bigtable)</strong> — <em>si gudang raksasa</em>. Tabel dengan jutaan kolom sparse, dioptimasi tulis masif tersebar. Cocok: time-series (data sensor per detik), event log skala raksasa. Kelemahan: query harus mengikuti primary key — salah model = full scan mahal.</p>
      <p><strong>4. Graph (Neo4j)</strong> — <em>si detektif relasi</em>. Data = node + edge; query = traversal ("teman dari teman yang beli X"). JOIN di relasional untuk relasi dalam = lambat; graph database lahir untuk ini. Cocok: fraud detection (jaringan rekening), rekomendasi, knowledge graph.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> pilih NoSQL dari <strong>pola akses</strong>, bukan dari hype. Tanya: "query tersering saya bentuknya apa?" Satu pola baca utuh → document. Butuh kilat by key → key-value. Tulis masif time-series → wide-column. Relasi dalam → graph. Salah jawab = database yang "cepat" jadi lambat.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NoSQL = anti-SQL / pengganti database relasional."</strong></p>
        <p><strong>Yang benar:</strong> NoSQL = <strong>"Not Only SQL"</strong>. Ia tidak menggantikan relasional — ia mengisi ceruk yang relasional tidak bisa (scale-out ekstrem, skema fleksibel). Perusahaan modern memakai <em>keduanya</em> (polyglot). Dan ironisnya, banyak NoSQL modern kini <em>mendukung SQL</em> (Cassandra CQL, DynamoDB PartiQL) karena SQL terlalu berguna untuk dibuang.</p>
      </div>

      <h2 id="base">BASE — Sumpah yang Lebih Santai dari ACID</h2>
      <p>Di sistem tersebar, ACID penuh terlalu mahal. Alternatifnya <strong>BASE</strong>:</p>
      <ul>
        <li><strong>Basically Available:</strong> sistem tetap merespons walau sebagian node mati (mungkin dengan data agak basi).</li>
        <li><strong>Soft state:</strong> state boleh berubah tanpa input — karena replika sedang mengejar ketinggalan.</li>
        <li><strong>Eventually consistent:</strong> jika tidak ada tulis baru, semua replika <em>akhirnya</em> sama. "Akhirnya" bisa milidetik — atau detik.</li>
      </ul>
      <p><strong>Kepribadian:</strong> kalau ACID adalah akuntan teliti (DM3A), BASE adalah <em>kurir paket</em>: "paket pasti sampai, tapi saya tidak janji jam berapa tepatnya". Untuk foto profil / like / feed: jendela basi 2 detik tidak ada yang peduli. Untuk saldo bank: bencana (Lab 2).</p>

      <h2 id="cap">Teorema CAP — Pilih Dua, Bayar Satu</h2>
      <p><strong>Definisi (Eric Brewer, 2000).</strong> Sistem tersebar hanya bisa menjamin 2 dari 3 saat terjadi <strong>partition</strong> (jaringan antar-node putus):</p>
      <ul>
        <li><strong>Consistency (C):</strong> semua node melihat data yang sama, setiap saat.</li>
        <li><strong>Availability (A):</strong> setiap request mendapat respons (tidak error/timeout).</li>
        <li><strong>Partition tolerance (P):</strong> sistem tetap jalan walau jaringan terbelah.</li>
      </ul>
      <p><strong>Nuansa penting:</strong> di dunia nyata P tidak bisa dihindari (jaringan <em>pasti</em> kadang putus) — jadi pilihan sebenarnya adalah <strong>CP vs AP saat partition terjadi</strong>:</p>
      <ul>
        <li><strong>CP</strong> (pilih konsisten): saat partition, tolak/error sebagian request. Contoh: HBase, MongoDB (default), sistem bank inti. <em>"Lebih baik tidak jawab daripada jawab salah."</em></li>
        <li><strong>AP</strong> (pilih tersedia): saat partition, tetap jawab — mungkin dengan data basi, sinkron nanti. Contoh: Cassandra, DynamoDB, DNS. <em>"Lebih baik jawab (walau basi) daripada mati total."</em></li>
      </ul>
      <p>Rumus ingatannya: <Tex math={String.raw`\text{saat partition: } C \oplus A`} block /> — pilih salah satu, tidak bisa dua-duanya.</p>

      <PlotlyChart
        data={capData}
        title="Pilihan CAP di Dunia Nyata"
        layout={{ xaxis: { title: "Kategori" }, yaxis: { title: "% sistem (ilustratif)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kategori pilihan CAP; label = contoh tipikal.</p>
        <p><strong>Interpretasi:</strong> "CA murni" praktis hanya untuk single-node (tidak ada partition karena tidak tersebar). Hampir semua sistem tersebar memilih CP atau AP — <em>per use case</em>. <strong>Pelajaran:</strong> CAP bukan label abadi sebuah produk, melainkan <strong>keputusan per fitur</strong>: modul transfer = CP, modul feed = AP, dalam perusahaan yang sama.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Database X itu AP, jadi SELALU tidak konsisten."</strong></p>
        <p><strong>Yang benar:</strong> CAP hanya berbicara <em>saat partition terjadi</em>. Saat jaringan sehat, sistem AP modern bisa dikonfigurasi mendekati konsisten kuat (tunable consistency: <code className="inline">QUORUM</code> reads/writes). Dan banyak produk membiarkanmu memilih per-query. Label "AP/CP" = perilaku default saat krisis, bukan vonis permanen.</p>
      </div>

      <h2 id="polyglot">Polyglot Persistence — Satu Perusahaan, Banyak Database</h2>
      <p><strong>Definisi.</strong> Praktik memakai <em>beberapa</em> database, masing-masing untuk kekuatannya: Postgres untuk transaksi inti (ACID), Redis untuk cache/session (kilat), Elasticsearch untuk search, S3/warehouse untuk analitik, Neo4j untuk deteksi fraud.</p>
      <p><strong>Harganya:</strong> kompleksitas operasional — backup, monitoring, skill tim × N database. <strong>Aturan:</strong> mulai dari <em>satu</em> database (biasanya Postgres — ia bisa jadi cache, search sederhana, JSON document sekaligus). Tambah database baru hanya saat ada <strong>pola akses yang terbukti tidak bisa</strong> dilayani yang lama. Tiap database tambahan harus "membayar sewa" berupa nilai yang jelas.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> lowongan data engineer Indonesia 2026 paling sering menyebut <strong>MongoDB & Redis</strong> di kubu NoSQL — MongoDB untuk data fleksibel skala menengah, Redis untuk cache/session. Kuasai pola pakainya (bukan sekadar install), karena interview menanyakan <em>kapan</em> memakainya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Document Model — Model by Query</h2>
      <p>Rasakan perbedaan: 1 baca utuh (document) vs JOIN (relasional) — dan trade-off-nya.</p>
      <PyodideLab
        title="Lab 1 — Document vs Relasional untuk Pola Baca yang Sama"
        hint="Coba: tambah field baru ke dokumen TANPA migrasi. Lalu pikirkan: query agregat lintas dokumen jadi semahal apa?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Eventual Consistency dalam Aksi</h2>
      <p>Simulasikan 3 replika dan lihat jendela inkonsistensi — kapan boleh, kapan bencana.</p>
      <PyodideLab
        title="Lab 2 — Replika Mengejar Ketinggalan"
        hint="Coba: ubah probabilitas replikasi 0.6 → 0.2. Jendela basi memanjang — untuk data apa ini masih OK?"
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Database Mana untuk Apa</h2>

      <div className="decision-card">
        <h3>1. Uang, stok, booking — butuh ACID → <strong>Relasional (Postgres/MySQL)</strong></h3>
        <p><strong>Kondisi:</strong> kebenaran &gt; kecepatan; transaksi multi-langkah.</p>
        <p><strong>Kenapa:</strong> tidak ada NoSQL yang menggantikan jaminan ACID untuk uang (DM3A). Mulai dari sini, selalu.</p>
      </div>

      <div className="decision-card">
        <h3>2. Katalog produk / profil user, skema fleksibel, baca utuh → <strong>Document (MongoDB)</strong></h3>
        <p><strong>Kondisi:</strong> field berubah-ubah; pola baca = ambil satu dokumen utuh.</p>
        <p><strong>Kenapa:</strong> tanpa migrasi skema; 1 baca = 1 dokumen. Jangan pakai untuk agregat lintas dokumen yang berat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Cache, session, leaderboard — butuh sub-milidetik by key → <strong>Key-Value (Redis)</strong></h3>
        <p><strong>Kondisi:</strong> akses selalu by key; data boleh hilang (ada sumber utama).</p>
        <p><strong>Kenapa:</strong> O(1), tercepat di kelasnya. Bukan tempat data primer satu-satunya.</p>
      </div>

      <div className="decision-card">
        <h3>4. Sensor per detik / event log raksasa → <strong>Wide-Column (Cassandra)</strong></h3>
        <p><strong>Kondisi:</strong> tulis masif tersebar; baca mengikuti key yang dirancang.</p>
        <p><strong>Kenapa:</strong> scale-out tulis tanpa batas praktis. Harga: model data harus dirancang dari query — salah desain = mahal.</p>
      </div>

      <div className="decision-card">
        <h3>5. "Siapa terhubung ke siapa" sedalam 5 hop → <strong>Graph (Neo4j)</strong></h3>
        <p><strong>Kondisi:</strong> query relasi dalam (jaringan).</p>
        <p><strong>Kenapa:</strong> traversal graph O(hop), sedangkan JOIN 5× di relasional meledak. Kasus klasik: deteksi fraud.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Default = Postgres.</strong> Tambah database baru hanya jika pola akses terbukti tidak terlayani.</li>
          <li><strong>Uang → CP/ACID.</strong> Feed/like → AP boleh.</li>
          <li><strong>Pilih NoSQL dari pola baca</strong> (by key? utuh? time-series? relasi dalam?) — bukan dari hype.</li>
          <li><strong>CAP = keputusan per fitur</strong>, bukan label abadi produk.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: 12.12 — Dari 800 TPS ke 40.000 TPS</h2>
      <p>Marketplace <strong>PT Kilat</strong> normalnya 800 transaksi/detik (TPS), tapi puncak 12.12 mencapai <strong>40.000 TPS</strong> selama 3 jam. Database relasional single-node (maks ~3.000 TPS tulis) menyerah. Ikuti matematikanya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Kenapa scale-up gagal: hukum antrean (klik untuk buka)</summary>
        <p>Scale-up = beli mesin lebih besar. Mesin terbesar yang masuk akal: 2× CPU, 2× RAM — throughput tulis naik paling ~1,8× (bukan 2×, karena lock &amp; I/O): 3.000 → <strong>5.400 TPS</strong>. Kebutuhan: 40.000 TPS.</p>
        <p><Tex math={String.raw`\text{gap} = \frac{40.000}{5.400} \approx 7{,}4\times \text{ kurang}`} block /></p>
        <p>Scale-up memberi kelipatan <em>linear kecil</em> dengan harga <em>eksponensial</em> (server 2× lipat ≈ 4–6× harga). Scale-out (tambah node) memberi kelipatan <em>linear</em> dengan harga <em>linear</em>. Inilah "batas scale-up" di judul section: bukan opini, aritmetika harga.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Sharding: bagi 40.000 TPS ke N node</summary>
        <p>Dengan sharding by <code className="inline">user_id</code> ke 16 shard, tiap shard menanggung:</p>
        <p><Tex math={String.raw`\frac{40.000}{16} = 2.500 \text{ TPS/shard}`} /></p>
        <p>2.500 &lt; 3.000 kapasitas per node ✔. Tapi ada harga: query lintas-shard ("total penjualan nasional") harus scatter-gather ke 16 node:</p>
        <p><Tex math={String.raw`\text{latency lintas-shard} \approx \max(\text{latency 16 shard}) + \text{biaya gabung}`} /></p>
        <p>Latensi ditentukan shard <em>terlambat</em>, bukan rata-rata. Dengan 16 shard, peluang ≥1 shard lambat jauh lebih besar — ekor latensi (p99) naik. Intuisi: <strong>sharding menyelesaikan throughput, tapi memindahkan masalah ke latensi ekor dan query lintas-shard.</strong> Makanya pola akses (model by query!) harus dirancang sebelum sharding, bukan sesudah.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — CAP dalam angka: berapa lama "eventual" itu?</summary>
        <p>Cluster 5 node, replikasi asinkron. Node Jakarta write, node Surabaya baca 50 ms kemudian. Jika lag replikasi rata-rata 80 ms:</p>
        <p><Tex math={String.raw`P(\text{baca data basi}) = P(\text{lag} > 50\text{ms})`} /></p>
        <p>Dengan lag eksponensial mean 80 ms: <Tex math={String.raw`P = e^{-50/80} \approx 53\%`} />. Lebih dari separuh baca lintas-region melihat data basi! Inilah kenapa cerita "feed yang kadang telat" di mini-case terjadi: <strong>eventual consistency bukan "nanti sinkron"</strong> — ia distribusi peluang yang bisa dihitung. Butuh janji lebih kuat? Pilih <em>quorum read/write</em>: <Tex math={String.raw`R + W > N`} /> (mis. N=5, W=3, R=3) → baca selalu melihat tulis terakhir, harga = 3 node harus respons tiap operasi (ketersediaan turun saat 3 node mati).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Polyglot: tagihan 4 database vs 1</summary>
        <p>PT Kilat akhirnya memakai: <strong>Postgres</strong> (transaksi/uang), <strong>MongoDB</strong> (katalog produk fleksibel), <strong>Redis</strong> (keranjang &amp; sesi), <strong>Elasticsearch</strong> (pencarian). Biaya operasional ≈ 4× (monitoring, backup, keahlian) dibanding 1 database.</p>
        <p>Kapan 4× biaya ini <em>worth it</em>? Hitung alternatif: memaksa pencarian full-text ke Postgres pada 40.000 TPS → query pencarian 300 ms × antrean = checkout ikut melambat → konversi turun 1% dari omzet Rp50 miliar/hari = <strong>Rp500 juta/hari hilang</strong>. Dibanding itu, biaya 3 database ekstra (Rp50 juta/bulan) = receh. <strong>Polyglot bukan hobi; ia arbitrase antara biaya operasional dan biaya peluang.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> teorema CAP sering disalahpahami sebagai "pilih 2 dari 3 selamanya". Kenyataannya: <strong>CAP hanya berlaku saat partisi jaringan terjadi</strong> (P). Sehari-hari (tanpa partisi), trade-off sebenarnya = <strong>konsistensi vs latensi</strong>: mau baca selalu segar (tunggu quorum → lambat) atau selalu cepat (bisa basi)? Desain dengan bertanya "operasi mana yang boleh basi 1 detik, mana yang tidak boleh sama sekali?" — jawabannya hampir selalu berbeda per fitur.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Hotspot: 1 shard menerima 40% traffic (celebrity problem)</summary>
        <p>16 shard, 40.000 TPS, sharding by <code className="inline">toko_id</code> — tapi 1 toko raksasa (flash sale) menyedot 40% traffic.</p>
        <p><Tex math={String.raw`\text{shard panas} = 40.000 \times 0{,}4 = 16.000 \text{ TPS} > 3.000 \text{ kapasitas} \;\Rightarrow\; \text{MATI}`} block /></p>
        <p>15 shard lain menganggur di 1.600 TPS. Solusi: <strong>salting</strong> — pecah key panas (<code className="inline">toko_id + random(0..9)</code>) ke 10 sub-shard → 1.600 TPS/sub-shard ✓. <strong>Sharding menyelesaikan throughput rata-rata, tapi hotspot membunuhnya</strong> — desain key harus memikirkan distribusi <em>aktual</em>, bukan asumsi merata.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: BASE = "Percaya, tapi Verifikasi Belakangan"</h2>
      <p>ACID berkata "tolak jika tidak sempurna". BASE berkata <strong>"terima dulu, rapikan belakangan"</strong> — filosofi antrean restoran cepat saji vs restoran fine dining:</p>
      <ul>
        <li><strong>Basically Available:</strong> sistem tetap menjawab walau sebagian node mati. Jawabannya <em>mungkin</em> basi — tapi "basi" lebih baik dari "mati" untuk feed media sosial; tidak untuk saldo bank.</li>
        <li><strong>Soft state:</strong> keadaan sistem boleh berubah tanpa input baru (replikasi mengejar, konflik di-merge). Mental model: bukan satu kebenaran, melainkan <strong>beberapa versi kebenaran yang sedang bernegosiasi</strong>.</li>
        <li><strong>Eventually consistent:</strong> "eventually" = tanpa batas waktu yang dijanjikan! Kontrak yang jujur: sistem konvergen <em>jika</em> tulis berhenti. Di sistem yang tulisnya tidak pernah berhenti (12.12!), "eventually" bisa berarti "tidak pernah sepenuhnya". Inilah kenapa pola <strong>idempotency + reconciliasi</strong> (DM5, DM13) wajib mendampingi BASE.</li>
      </ul>
      <p><strong>Konteks dunia nyata — empat penghuni kebun binatang, kapan masing-masing menang:</strong></p>
      <ul>
        <li><strong>Document (MongoDB):</strong> katalog produk — tiap produk punya atribut beda (sepatu punya ukuran, laptop punya RAM). Skema fleksibel = tidak perlu ALTER TABLE tiap ada atribut baru. Menang saat <em>bentuk data beragam</em>.</li>
        <li><strong>Key-Value (Redis):</strong> sesi login, keranjang, rate limiter. Akses O(1) by key, jutaan ops/detik. Menang saat <em>pola akses = "ambil by key", kecepatan ekstrem</em>.</li>
        <li><strong>Wide-column (Cassandra):</strong> time-series IoT, riwayat event. Tulis append-only masif, baca per partition key. Menang saat <em>tulis raksasa, baca berpola</em>.</li>
        <li><strong>Graph (Neo4j):</strong> deteksi fraud ring, rekomendasi "teman dari teman". Join 5 level di relasional = 5 join mahal; di graph = traversal murah. Menang saat <em>relasi adalah datanya</em>.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NoSQL = tidak butuh pemodelan data, simpan saja JSON."</strong></p>
        <p><strong>Yang benar:</strong> NoSQL justru menuntut pemodelan <em>lebih disiplin</em> — <strong>model by query</strong>. Relasional bisa "asal simpan, query belakangan" karena join fleksibel. Di Cassandra/Mongo, query yang tidak sesuai partition key = full scan cluster = bencana. Kebebasan skema ≠ kebebasan berpikir; ia memindahkan kerja pemodelan dari "saat tulis" ke "saat desain". Tim yang "simpan saja dulu" di NoSQL membangun data swamp tercepat di industri.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Quorum — Hitung Sendiri Kapan Baca "Segar"</h2>
      <p>Simulasikan replikasi 5 node dengan lag acak: kapan quorum menyelamatkanmu dari data basi?</p>
      <PyodideLab
        title="Lab 3 — R+W>N dalam Aksi"
        hint="Coba: ubah LAG_MAX dari 200 ke 2000. Kapan baca biasa (R=1) mulai sering basi? Itulah bedanya 'eventual' di satu DC vs lintas benua."
        defaultCode={`# Lab 3: simulasi baca basi vs quorum (N=5 node)
import random
random.seed(7)

N = 5
LAG_MAX = 200  # ms, lag replikasi maksimum antar node
N_COBA = 2000

def tulis():
    # tulis ke W node tercepat; node lain menerima belakangan (lag acak)
    lag = [random.randint(0, LAG_MAX) for _ in range(N)]
    lag.sort()
    return lag

basi_biasa = 0   # R=1: baca dari 1 node (bisa yang paling basi)
basi_quorum = 0  # R=3: baca 3 node, ambil versi terbaru
for _ in range(N_COBA):
    lag = tulis()
    t_baca = 50  # baca 50 ms setelah tulis
    # R=1 -> kena node paling lambat (sial), versi basi jika lag > 50
    if lag[-1] > t_baca:
        basi_biasa += 1
    # R=3 -> 3 node tercepat; basi hanya jika ketiganya belum menerima
    if lag[2] > t_baca:
        basi_quorum += 1

print(f"Node: {N}, baca {t_baca} ms setelah tulis, {N_COBA} percobaan")
print(f"Baca biasa (R=1): basi {basi_biasa/N_COBA*100:.1f}%")
print(f"Quorum     (R=3): basi {basi_quorum/N_COBA*100:.1f}%")
print()
print("R+W>N (W=3 tulis, R=3 baca): irisan quorum MENJAMIN baca melihat")
print("tulis terakhir -> konsistensi kuat, harga = 3 node harus respons.")`}
      />

      <h2 id="case">📋 Mini-Case: Feed yang Kadang "Telat"</h2>
      <div className="callout">
        <p>Aplikasi media sosial memakai Cassandra (AP) untuk feed. Keluhan: "Saya posting, teman saya baru lihat 10 detik kemudian." Tim backend panik: "Inkonsistensi! Harus ganti ke CP!" Biaya migrasi diestimasi 3 bulan.</p>
        <p><strong>Pertanyaan:</strong> (a) Apakah ini bug atau perilaku by-design? (b) Haruskah migrasi ke CP? (c) Di fitur apa dalam aplikasi yang sama kamu WAJIB memilih CP?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>By-design</strong> — eventual consistency (BASE): replika butuh waktu konvergen. 10 detik untuk feed = dapat diterima secara produk.</p>
          <p>(b) <strong>Tidak.</strong> Migrasi ke CP berarti saat partition, feed <em>error total</em> — jauh lebih buruk daripada telat 10 detik. AP adalah pilihan tepat untuk feed.</p>
          <p>(c) <strong>Fitur pembayaran/tip/transfer koin</strong> — di situ eventual consistency = bencana (saldo ganda). Satu aplikasi, dua keputusan CAP berbeda. Itulah polyglot thinking.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: sharding, peluang baca basi, dan quorum.</p>

      <details className="worked">
        <summary>Soal 1 — Sharding: butuh 25.000 TPS tulis, tiap shard sanggup 4.000 TPS. Berapa shard minimal? Berapa beban per shard?</summary>
        <p><Tex math={String.raw`\text{shard} = \lceil 25.000 / 4.000 \rceil = 7`} /></p>
        <p><Tex math={String.raw`\text{beban/shard} = 25.000 / 7 \approx 3.571 \text{ TPS} < 4.000 \checkmark`} block /></p>
        <p>7 shard memberi headroom 12%. Aturan praktis: jangan operasikan shard di &gt;80% kapasitas — butuh ruang untuk <em>rebalancing</em> dan lonjakan.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Eventual consistency: lag replikasi mean 120 ms (eksponensial), baca dilakukan 80 ms setelah tulis. Berapa peluang baca basi?</summary>
        <p><Tex math={String.raw`P(\text{basi}) = P(\text{lag} > 80) = e^{-80/120} = e^{-0{,}667} \approx 51\%`} block /></p>
        <p>Lebih dari separuh! "Eventual" lintas region dengan lag 120 ms = <strong>sering basi</strong>. Jika fitur butuh kesegaran, naikkan ke quorum read atau baca dari primary.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Quorum: cluster N=7, tulis ke W=4 node. Berapa R minimal agar baca selalu melihat tulis terakhir (strong consistency)?</summary>
        <p><Tex math={String.raw`R + W > N \;\Rightarrow\; R > 7 - 4 = 3 \;\Rightarrow\; R_{\min} = 4`} block /></p>
        <p>Dengan R=4, W=4: setiap quorum baca beririsan dengan setiap quorum tulis di ≥1 node → baca <em>pasti</em> melihat tulis terakhir. Harga: 4 node harus respons untuk tiap baca <em>dan</em> tulis.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa database relasional klasik sulit scale-out (tambah banyak server)?"
        options={[
          "Karena SQL-nya lambat",
          "Karena jaminan ACID + join lintas tabel butuh koordinasi/konsensus antar mesin — mahal dan lambat saat tersebar",
          "Karena tidak bisa menyimpan banyak data",
          "Karena lisensinya mahal",
        ]}
        correct={1}
        explanation="Benar: masalahnya koordinasi. ACID lintas node butuh protokol mahal (2PC). NoSQL menghindari ini dengan mengorbankan sebagian jaminan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Butuh simpan session login 10 juta user, akses sub-milidetik by key, data boleh hilang (ada DB utama). Pilihan tepat?"
        options={[
          "Graph database",
          "Key-value store (Redis) — O(1) by key, tercepat untuk pola ini",
          "Wide-column untuk time-series",
          "Data warehouse",
        ]}
        correct={1}
        explanation="Benar: pola akses 'by key, kilat, boleh hilang' = definisi use case Redis. Graph/wide-column salah alat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam teorema CAP, saat terjadi partition jaringan, kamu harus memilih antara…"
        options={[
          "Consistency atau Availability — tidak bisa dua-duanya",
          "SQL atau NoSQL",
          "Cepat atau murah",
          "Partition tolerance bisa dibuang agar dapat C+A",
        ]}
        correct={0}
        explanation="Benar: C ⊕ A saat partition. P tidak bisa dibuang di sistem tersebar nyata (jaringan pasti kadang putus)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. 'Eventually consistent' berarti…"
        options={[
          "Data tidak pernah konsisten",
          "Jika tidak ada tulis baru, semua replika akhirnya sama — tapi ada jendela waktu di mana bacaan bisa basi",
          "Tulis selalu gagal setengah",
          "Hanya untuk database relasional",
        ]}
        correct={1}
        explanation="Benar: konvergen itu dijamin (eventually), jendela basi itu harganya. Cocok untuk feed/foto, bencana untuk saldo."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Prinsip pemodelan utama di document database (MongoDB) adalah…"
        options={[
          "Normalisasi hingga 3NF",
          "Model by query — struktur dokumen mengikuti pola baca dominan",
          "Selalu pisah jadi banyak tabel",
          "Hindari duplikasi apapun yang terjadi",
        ]}
        correct={1}
        explanation="Benar: denormalisasi disengaja agar pola baca dominan = 1 baca. Duplikasi terkontrol adalah fitur, bukan bug."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Perusahaan memakai Postgres (transaksi) + Redis (cache) + Elasticsearch (search). Ini praktik…"
        options={[
          "Anti-pattern — harus satu database",
          "Polyglot persistence — tiap database untuk kekuatannya; harganya kompleksitas operasional",
          "CAP theorem",
          "Data mesh",
        ]}
        correct={1}
        explanation="Benar: polyglot persistence. Aturannya: mulai dari satu DB, tambah hanya jika pola akses terbukti tak terlayani."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>NoSQL lahir</strong> untuk scale-out — mengorbankan sebagian jaminan relasional demi throughput & ketersediaan.</li>
          <li><strong>4 tipe:</strong> document (baca utuh, fleksibel), key-value (kilat by key), wide-column (tulis masif), graph (relasi dalam).</li>
          <li><strong>BASE:</strong> Basically Available, Soft state, Eventually consistent — "paket pasti sampai, jamnya tidak dijamin".</li>
          <li><strong>CAP:</strong> saat partition, pilih Consistency atau Availability. Keputusan per fitur, bukan label abadi.</li>
          <li><strong>Polyglot:</strong> banyak DB untuk banyak kekuatan; tiap tambahan harus "membayar sewa".</li>
          <li><strong>Jangan:</strong> pakai NoSQL untuk uang (butuh ACID); pilih database dari hype bukan pola baca.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm3a-database-relasional" className="btn btn-secondary btn-sm">← DM3A</Link>
        <Link href="/learn/dm4-data-warehouse" className="btn btn-primary btn-sm">Next: DM4 →</Link>
      </div>
    </div>
  );
}
