"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM2Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const normData = [
    {
      x: ["1NF", "2NF", "3NF", "BCNF"],
      y: [40, 25, 25, 10],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["anomali hapus/sisip", "redundansi parsial", "redundansi transitif", "kasus langka"],
      textposition: "outside",
    },
  ];

  const queryData = [
    {
      x: ["Skema ternormalisasi (5 join)", "Star schema (2 join)"],
      y: [8.4, 0.6],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["8,4 dtk", "0,6 dtk"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: RASAKAN anomali normalisasi — data denormalisasi vs ternormalisasi
# Skenario: tabel PENJUALAN denormalisasi (nama cabang ditulis manual tiap baris)

penjualan_bad = [
    ("T001", "JKT-01", "Jakarta Pusat", 500000),
    ("T002", "JKT-01", "Jakarta Pusat", 750000),
    ("T003", "SBY-02", "Surabaya", 300000),
]
print("=== TABEL DENORMALISASI ===")
for t in penjualan_bad: print(t)

print()
print("ANOMALI UPDATE: cabang JKT-01 pindah nama jadi 'Jakarta Selatan'.")
print("Harus update", sum(1 for t in penjualan_bad if t[1]=="JKT-01"), "baris — kalau 1 baris terlewat, data jadi INKONSISTEN.")
print("ANOMALI HAPUS : hapus semua transaksi SBY-02 -> info 'Surabaya' HILANG selamanya.")
print("ANOMALI SISIP : cabang baru MDN-03 belum ada transaksi -> tidak bisa dicatat!")

print()
print("=== SOLUSI: pisah jadi 2 tabel (3NF) ===")
cabang = {"JKT-01": "Jakarta Pusat", "SBY-02": "Surabaya", "MDN-03": "Medan"}
penjualan_ok = [("T001","JKT-01",500000), ("T002","JKT-01",750000), ("T003","SBY-02",300000)]
print("cabang:", cabang)
print("Update nama cukup 1 baris di tabel cabang. Cabang baru bisa dicatat tanpa transaksi.")
print()
print("Coba: tambah cabang 'BALI-04' ke dict cabang, lalu cetak ulang.")`;

  const lab2Code = `# Lab 2: SCD Type 2 — lacak PERUBAHAN alamat nasabah (histori tidak hilang!)
# Fakta: N001 pindah dari Bandung ke Jakarta pada 2026-06-01.

dim_nasabah = [
    # sk, nasabah_id, nama, alamat,        tgl_mulai,   tgl_selesai,  aktif
    (1, "N001", "Budi", "Bandung", "2024-01-01", "2026-05-31", 0),
    (2, "N001", "Budi", "Jakarta", "2026-06-01", "9999-12-31", 1),
]

print("DIM_NASABAH (SCD Type 2 — tiap perubahan = baris BARU):")
for r in dim_nasabah: print(r)

print()
print("Query 'alamat N001 per 2026-03-01' ->", [r[3] for r in dim_nasabah if r[4] <= "2026-03-01" <= r[5]][0])
print("Query 'alamat N001 SEKARANG'      ->", [r[3] for r in dim_nasabah if r[6] == 1][0])
print()
print("Kenapa penting? Laporan risiko per wilayah 2025 harus pakai alamat LAMA,")
print("bukan alamat sekarang — SCD2 membuat 'time travel' query jadi mungkin.")
print()
print("Coba: N001 pindah lagi ke Surabaya 2026-10-01 — tambah baris ke-3 (nonaktifkan baris 2),")
print("lalu query alamat per 2026-08-01.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM2 — Data Management</span>
        <h1 className="display-title">Pemodelan Data:<br />Dari Coretan ER ke Star Schema</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kolom "alamat2_final_FINAL"</a></li>
          <li><a href="#er">ER Model — Peta Sebelum Membangun</a></li>
          <li><a href="#normal">Normalisasi — Si Tukang Beres-Beres</a></li>
          <li><a href="#dim">Dimensional Modeling — Star Schema si Bintang Analisis</a></li>
          <li><a href="#scd">SCD — Mesin Waktu Dimensi</a></li>
          <li><a href="#vault">Data Vault — Sekilas untuk Data Raksasa</a></li>
          <li><a href="#lab1">🔬 Lab 1: Rasakan Anomali Denormalisasi</a></li>
          <li><a href="#lab2">🔬 Lab 2: SCD Type 2 — Time Travel Query</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Model Mana untuk Apa</a></li>
          <li><a href="#worked">🔢 Worked Example: Flat → Star Schema</a></li>
          <li><a href="#intuisi">🧠 Intuisi: Lindungi Tulis vs Percepat Baca</a></li>
          <li><a href="#lab3">🔬 Lab 3: SCD Type 2 — Time Travel</a></li>
          <li><a href="#case">📋 Mini-Case: Dashboard Cabang yang Angkanya "Ngaco"</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membaca dan membuat diagram ER sederhana (entity, atribut, relasi 1-N / N-M).</li>
          <li>Menjelaskan 1NF–3NF dan mengidentifikasi anomali update/sisip/hapus pada tabel denormalisasi.</li>
          <li>Merancang star schema (tabel fakta + dimensi) untuk kebutuhan analitik, dan menjelaskan kenapa query-nya jauh lebih cepat.</li>
          <li>Memilih strategi SCD yang tepat (Type 1/2/3) untuk atribut dimensi yang berubah.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kolom "alamat2_final_FINAL"</h2>
      <div className="story">
        <p>Seorang analis mewarisi tabel <code className="inline">nasabah</code> dengan kolom: <code className="inline">alamat</code>, <code className="inline">alamat2</code>, <code className="inline">alamat_baru</code>, <code className="inline">alamat_final</code>, <code className="inline">alamat_final_FINAL</code>. Lima kolom alamat, tidak ada yang tahu mana yang benar. Setiap migrasi, developer "tidak berani hapus yang lama" lalu menambah kolom baru. Tabel itu berumur 6 tahun.</p>
        <p>Twist-nya: masalahnya <strong>bukan</strong> developer yang malas — masalahnya tidak ada <em>model</em> sejak awal. Tidak ada yang pernah menggambar: "satu nasabah punya berapa alamat? alamat yang mana yang dipakai laporan?" Pemodelan data adalah pekerjaan menggambar peta <em>sebelum</em> membangun kota. Tanpa peta, setiap orang membangun jalan sendiri — dan 6 tahun kemudian kamu dapat labirin kolom.</p>
      </div>

      <h2 id="er">ER Model — Peta Sebelum Membangun</h2>
      <p><strong>Definisi.</strong> Entity-Relationship (ER) model menggambarkan <strong>entity</strong> (benda: Nasabah, Transaksi, Cabang), <strong>atribut</strong> (ciri: nama, nominal), dan <strong>relasi</strong> (hubungan: "nasabah <em>melakukan</em> transaksi").</p>
      <p><strong>Kepribadian:</strong> ER adalah <em>denah rumah</em> sebelum tukang datang. Murah diubah di kertas, mahal diubah setelah tembok berdiri. Analogi kolom alamat di atas = membangun kamar tanpa denah.</p>
      <p><strong>Kardinalitas</strong> — aturan main relasi:</p>
      <ul>
        <li><strong>1 ke N (one-to-many):</strong> 1 cabang punya N nasabah; 1 nasabah punya N transaksi. Paling umum.</li>
        <li><strong>N ke M (many-to-many):</strong> N mahasiswa ambil N mata kuliah. <em>Tidak bisa</em> dimodel langsung di tabel relasional — butuh <strong>tabel jembatan</strong> (misal <code className="inline">pengajuan_produk</code> antara nasabah dan produk).</li>
        <li><strong>1 ke 1:</strong> 1 nasabah punya 1 KTP. Jarang dipakai terpisah — biasanya digabung, kecuali alasan keamanan (data sensitif dipisah).</li>
      </ul>
      <p><strong>Alur conceptual → physical:</strong> model konseptual (bahasa bisnis: "nasabah punya rekening") → model logis (ER + tipe data, tanpa mikir vendor) → model fisik (tabel nyata di Postgres: nama kolom snake_case, index, partisi). Tiap tahap makin konkret; jangan loncat langsung ke fisik.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> kalau kamu tidak bisa menggambar relasi antar entity dalam 5 menit di papan tulis, kamu belum paham domain-nya — dan skema yang kamu tulis akan salah. ER memaksa kejelasan berpikir <em>sebelum</em> satu baris DDL ditulis.</p>
      </div>

      <h2 id="normal">Normalisasi — Si Tukang Beres-Beres</h2>
      <p><strong>Definisi.</strong> Normalisasi = memecah tabel agar tiap fakta disimpan <strong>tepat sekali</strong>, menghilangkan redundansi. Bentuk normal (NF) adalah "level kerapian".</p>
      <ul>
        <li><strong>1NF:</strong> tiap sel berisi <em>satu</em> nilai atomik (tidak ada "Jakarta, Bandung" dalam satu sel; tidak ada kolom berulang <code className="inline">telp1, telp2, telp3</code>).</li>
        <li><strong>2NF:</strong> 1NF + tidak ada atribut yang bergantung <em>sebagian</em> pada primary key (relevan untuk composite key: misal key (order_id, product_id), tapi nama_produk hanya bergantung pada product_id → pindahkan).</li>
        <li><strong>3NF:</strong> 2NF + tidak ada ketergantungan <em>transitif</em> (cabang_id → nama_cabang, tapi nama_kota bergantung pada cabang_id <em>via</em> nama_cabang? pecah tabel cabang).</li>
        <li><strong>BCNF:</strong> versi 3NF yang lebih ketat — setiap determinan adalah candidate key. Untuk kasus langka.</li>
      </ul>
      <p><strong>Tiga anomali</strong> yang dibunuh normalisasi (rasakan di Lab 1): <strong>update</strong> (ubah nama cabang di 10.000 baris, 1 terlewat → inkonsisten), <strong>sisip</strong> (cabang baru tanpa transaksi tidak bisa dicatat), <strong>hapus</strong> (hapus transaksi terakhir = info cabang hilang).</p>

      <PlotlyChart
        data={normData}
        title="Apa yang Diperbaiki Tiap Level Normalisasi"
        layout={{ xaxis: { title: "Bentuk normal" }, yaxis: { title: "Masalah yang umum hilang" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = level normalisasi; label di atas batang = jenis masalah yang hilang di level itu.</p>
        <p><strong>Interpretasi:</strong> sebagian besar masalah dunia nyata (anomali hapus/sisip) hilang di 1NF; redundansi parsial & transitif hilang di 2NF/3NF. <strong>Praktiknya: targetkan 3NF untuk sistem operasional (OLTP)</strong> — BCNF jarang memberi nilai tambah sepadan usahanya. Normalisasi = untuk <em>menulis</em> data dengan aman.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Normalisasi selalu lebih baik — semakin tinggi NF semakin bagus."</strong></p>
        <p><strong>Yang benar:</strong> normalisasi mengoptimasi <em>penulisan</em> (aman dari anomali) tapi <em>menghukum pembacaan</em>: query analitik butuh banyak JOIN. Untuk <em>membaca</em> (OLAP/dashboard), industri justru melakukan <strong>denormalisasi terkontrol</strong> via dimensional modeling. Aturan: normalisasi untuk OLTP, denormalisasi (star schema) untuk OLAP.</p>
      </div>

      <h2 id="dim">Dimensional Modeling — Star Schema si Bintang Analisis</h2>
      <p><strong>Definisi (Kimball).</strong> Model dimensional memisah data jadi dua peran:</p>
      <ul>
        <li><strong>Tabel fakta:</strong> <em>kejadian yang diukur</em> — angka-angka (measures) + foreign key. Contoh: <code className="inline">fakta_transaksi</code> (nominal, jumlah) + (nasabah_key, waktu_key, cabang_key). Grain = satu baris = satu transaksi. <em>Tipis tapi panjang</em> (jutaan baris).</li>
        <li><strong>Tabel dimensi:</strong> <em>konteks "siapa/di mana/kapan"</em> — atribut deskriptif. Contoh: <code className="inline">dim_nasabah</code> (nama, segmen, kota), <code className="inline">dim_waktu</code> (tanggal, bulan, kuartal, hari_libur). <em>Pendek tapi lebar</em> (ribuan baris, banyak kolom).</li>
      </ul>
      <p><strong>Star schema:</strong> 1 fakta di tengah, dimensi mengelilingi seperti bintang. <strong>Snowflake:</strong> dimensi di-normalisasi lagi (dim_produk → dim_kategori) — lebih rapi, tapi lebih banyak join.</p>
      <p><strong>Kepribadian:</strong> kalau normalisasi adalah "tukang beres-beres", star schema adalah <em>pramusaji restoran</em>: semua yang kamu butuhkan sudah disiapkan di meja (dimensi denormalisasi), jadi query analis tinggal ambil — cepat dan gampang. Harganya: butuh ETL untuk menyiapkan "meja" itu (DM5).</p>

      <PlotlyChart
        data={queryData}
        title="Kecepatan Query: Skema Ternormalisasi vs Star Schema (ilustratif)"
        layout={{ xaxis: { title: "Desain" }, yaxis: { title: "Waktu query (detik)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = waktu eksekusi query agregat yang sama ("total transaksi per kota per bulan").</p>
        <p><strong>Interpretasi:</strong> star schema ~14× lebih cepat karena hanya 2 join sederhana vs 5 join berantai, plus dimensi sudah denormalisasi (tidak perlu join kota→provinsi→negara). Inilah alasan dashboard direksi dibangun di atas mart dimensional, bukan query langsung ke database operasional.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> langkah pertama dimensional modeling bukan menggambar bintang — tapi menetapkan <strong>grain</strong> ("satu baris fakta = satu ___"). Salah grain = metrik ganda/salah selamanya. Tulis satu kalimat sebelum apapun: <em>"Satu baris fakta_transaksi = satu transaksi yang berhasil."</em></p>
      </div>

      <h2 id="scd">SCD — Mesin Waktu Dimensi</h2>
      <p><strong>Definisi.</strong> Slowly Changing Dimensions (SCD): strategi menangani atribut dimensi yang berubah <em>pelan</em> (nasabah pindah kota, produk ganti kategori). Tiga tipe klasik:</p>
      <ul>
        <li><strong>Type 1 (overwrite):</strong> timpa nilai lama. Histori hilang. Cocok untuk koreksi salah ketik ("Jakrta" → "Jakarta").</li>
        <li><strong>Type 2 (baris baru):</strong> tiap perubahan = baris baru + tanggal berlaku + flag aktif. Histori <em>utuh</em> — bisa "time travel". Cocok untuk atribut analitik (alamat, segmen).</li>
        <li><strong>Type 3 (kolom baru):</strong> simpan nilai lama & baru berdampingan (<code className="inline">kota_sekarang</code>, <code className="inline">kota_sebelumnya</code>). Hanya untuk 1 langkah histori.</li>
      </ul>
      <p><strong>Kenapa analis risiko peduli?</strong> Laporan NPL per wilayah tahun 2025 harus memakai alamat nasabah <em>saat itu</em>, bukan alamat sekarang. Tanpa SCD Type 2, histori tertimpa dan laporan historis jadi salah diam-diam.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Dimensi itu statis — cukup update saja."</strong></p>
        <p><strong>Yang benar:</strong> overwrite (Type 1) <em>menulis ulang sejarah</em>. Setiap laporan historis yang pernah memakai atribut itu ikut berubah artinya. Pilih Type 2 untuk atribut yang dipakai sebagai <em>sumbu analisis</em> (wilayah, segmen, status) — biaya tambahannya hanya beberapa baris.</p>
      </div>

      <h2 id="vault">Data Vault — Sekilas untuk Data Raksasa</h2>
      <p><strong>Definisi singkat.</strong> Data Vault adalah pola pemodelan untuk data warehouse <em>sangat besar & berubah cepat</em>: tiga jenis tabel — <strong>Hub</strong> (daftar business key unik: daftar nasabah), <strong>Link</strong> (relasi antar hub: nasabah–rekening), <strong>Satellite</strong> (atribut deskriptif + histori: alamat nasabah per tanggal).</p>
      <p><strong>Kapan dipakai:</strong> puluhan sumber, skema berubah tiap minggu, butuh audit penuh ("siapa mengubah apa, kapan"). <strong>Kapan JANGAN:</strong> tim kecil / warehouse &lt; 1 TB — overhead-nya tidak sepadan; star schema cukup. Anggap ini "level lanjut", cukup kenal istilahnya.</p>

      <h2 id="lab1">🔬 Lab 1: Rasakan Anomali Denormalisasi</h2>
      <p>Jalankan, baca tiga anomalinya, lalu perbaiki sendiri dengan menambah cabang baru.</p>
      <PyodideLab
        title="Lab 1 — Tiga Anomali Tabel Denormalisasi"
        hint="Coba: tambah cabang baru TANPA transaksi ke struktur denormalisasi — bisa? Itulah anomali sisip."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: SCD Type 2 — Time Travel Query</h2>
      <p>Query alamat nasabah "per tanggal tertentu" — mustahil tanpa histori baris.</p>
      <PyodideLab
        title="Lab 2 — SCD Type 2 dalam Kode"
        hint="Coba: N001 pindah ke Surabaya 2026-10-01 (tambah baris, nonaktifkan baris 2). Query alamat per 2026-08-01 harus tetap Jakarta."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Model Mana untuk Apa</h2>

      <div className="decision-card">
        <h3>1. Database aplikasi transaksional (core banking, order) → <strong>3NF ternormalisasi</strong></h3>
        <p><strong>Kondisi:</strong> banyak tulis (INSERT/UPDATE), integritas kritis, satu fakta satu tempat.</p>
        <p><strong>Kenapa:</strong> mencegah anomali update/sisip/hapus. Harga: query analitik lambat — solusinya pipeline ke warehouse, bukan denormalisasi OLTP.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dashboard & laporan direksi → <strong>Star schema (Kimball)</strong></h3>
        <p><strong>Kondisi:</strong> query agregasi berulang, user non-teknis (drag-and-drop BI), butuh cepat.</p>
        <p><strong>Kenapa:</strong> join sedikit, dimensi denormalisasi, mudah dipahami ("fakta = angka, dimensi = filter").</p>
        <p><strong>Contoh nyata:</strong> mart risiko kredit: fakta_pembayaran + dim_nasabah + dim_waktu + dim_produk.</p>
      </div>

      <div className="decision-card">
        <h3>3. Atribut analisis berubah (pindah kota, ganti segmen) → <strong>SCD Type 2</strong></h3>
        <p><strong>Kondisi:</strong> laporan historis harus konsisten dengan kondisi saat itu.</p>
        <p><strong>Kenapa:</strong> overwrite menghancurkan histori; Type 2 menyimpan keduanya dengan tanggal berlaku.</p>
      </div>

      <div className="decision-card">
        <h3>4. Relasi N-ke-M (nasabah–produk) → <strong>tabel jembatan / Link</strong></h3>
        <p><strong>Kondisi:</strong> satu nasabah banyak produk, satu produk banyak nasabah.</p>
        <p><strong>Kenapa:</strong> N-M tidak bisa dimodel langsung — butuh tabel perantara dengan composite key.</p>
      </div>

      <div className="decision-card">
        <h3>5. Warehouse raksasa, sumber berubah tiap minggu, butuh audit penuh → <strong>Data Vault</strong></h3>
        <p><strong>Kondisi:</strong> enterprise scale, regulasi ketat, banyak sumber.</p>
        <p><strong>Kenapa:</strong> Hub/Link/Satellite memisahkan identitas, relasi, dan histori — perubahan skema tidak merusak yang sudah ada. Jangan dipakai untuk tim kecil.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Menulis data?</strong> → normalisasi (3NF). <strong>Membaca/analisis?</strong> → star schema.</li>
          <li><strong>Tetapkan grain dulu</strong> — satu kalimat sebelum menggambar apapun.</li>
          <li><strong>Atribut berubah + dipakai analisis?</strong> → SCD Type 2, bukan overwrite.</li>
          <li><strong>N-M?</strong> → tabel jembatan. Selalu.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Dari Tabel "alamat2_final_FINAL" ke Star Schema</h2>
      <p>Sebuah tabel penjualan denormalisasi, <code className="inline">penjualan_flat</code>, punya <strong>50.000 baris</strong> dengan kolom berulang: <code className="inline">nama_pelanggan, kota_pelanggan, nama_produk, kategori_produk, harga</code>. Rata-rata tiap pelanggan muncul <strong>8 kali</strong> (8 transaksi). Ikuti transformasinya dengan angka.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Ukur redundansinya dulu (klik untuk buka)</summary>
        <p>Pelanggan unik = <Tex math={String.raw`\frac{50.000}{8} = 6.250`} /> pelanggan. Setiap nama pelanggan (rata-rata 20 byte) disimpan 8× padahal cukup 1×.</p>
        <p><Tex math={String.raw`\text{byte terbuang (nama)} = 6.250 \times (8-1) \times 20 = 875.000 \text{ byte} \approx 0{,}83 \text{ MB}`} block /></p>
        <p>0,83 MB terdengar kecil — tapi ini baru <em>satu</em> kolom dari <em>satu</em> tabel kecil. Pada 500 juta baris dengan 15 kolom berulang, redundansi = <strong>~8 GB</strong> yang dibayar tiap bulan di storage <em>dan</em> di-scan tiap query. Normalisasi bukan soal kerapian; ia soal tagihan.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Anomali update: biaya satu perubahan alamat</summary>
        <p>Pelanggan "Budi Santoso" pindah dari "JKT" ke "BDG". Di tabel flat, harus update <strong>8 baris</strong>. Jika 1 dari 8 baris terlewat (query gagal di tengah, tanpa transaksi):</p>
        <p><Tex math={String.raw`P(\text{minimal 1 baris terlewat}) = 1 - (1-p)^8`} /></p>
        <p>dengan <Tex math={String.raw`p`} /> = peluang 1 update gagal. Jika <Tex math={String.raw`p = 0{,}01`} /> (1%): <Tex math={String.raw`1 - 0{,}99^8 \approx 7{,}7\%`} />. Artinya tiap ada pindah alamat, <strong>peluang 7,7% datanya inkonsisten</strong> — inilah cerita "Tiga Budi Santoso" di DM11 dalam bentuk matematika. Setelah normalisasi (alamat tinggal di <code className="inline">dim_pelanggan</code>): 1 baris di-update, peluang inkonsisten = <Tex math={String.raw`p = 1\%`} /> saja — turun 7,7×.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Star schema: hitung kecepatan query-nya</summary>
        <p>Setelah dimodelkan: <code className="inline">fact_penjualan</code> (50.000 baris, hanya foreign key + angka) dan <code className="inline">dim_pelanggan</code> (6.250 baris), <code className="inline">dim_produk</code> (400 baris).</p>
        <p>Query "total penjualan per kategori bulan ini": di tabel flat, engine memindai <strong>50.000 × 120 byte = 6 MB</strong> (termasuk kolom teks panjang yang tidak dibutuhkan). Di star schema, hanya <code className="inline">fact_penjualan</code> selebar <strong>50.000 × 32 byte = 1,6 MB</strong> + join ke 400 baris dimensi. Data yang dipindai turun <strong>~4×</strong> — dan pada format kolom (DM4: Parquet) hanya kolom yang dipakai yang dibaca, turun bisa <strong>10–20×</strong>. Inilah kenapa analis "merasa" warehouse cepat: bukan servernya mahal, modelnya ramping.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — SCD Type 2: berapa baris riwayat yang wajar?</summary>
        <p>Dari 6.250 pelanggan, tiap tahun <strong>12%</strong> ganti alamat/kota (750 pelanggan). SCD Type 2 menambah 1 baris baru per perubahan:</p>
        <p><Tex math={String.raw`\text{baris dim\_pelanggan thn-1} = 6.250 + 750 = 7.000`} /></p>
        <p>Pertumbuhan <strong>12%/tahun</strong> — dimensi tetap mungil dibanding fact yang tumbuh 50.000 baris <em>per bulan</em>. Intuisi: <strong>jangan takut SCD Type 2 "membengkak"</strong>; dimensi tumbuh linear-pelan, fact tumbuh linear-cepat. Yang membengkak justru tabel flat tanpa SCD: riwayat tercampur tanpa versi = tidak bisa time-travel sama sekali.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> pilih model dengan bertanya "query terseringnya apa?". <strong>OLTP</strong> (banyak tulis, sedikit baca per baris) → normalisasi (3NF): tulis 1 baris, aman. <strong>OLAP</strong> (banyak baca agregat, tulis batch) → star schema: baca sedikit kolom, cepat. Model yang "benar" = model yang cocok dengan <em>pola aksesnya</em>, bukan yang paling teori.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Harga 1 join yang dihindari: denormalisasi vs storage</summary>
        <p>Query "penjualan per kategori" jalan <strong>1 juta kali/hari</strong>. Versi normalized butuh 1 join tambahan (50 ms); versi star schema tidak.</p>
        <p><Tex math={String.raw`\text{hemat/hari} = 10^6 \times 0{,}05 \text{ dtk} = 50.000 \text{ dtk} \approx 13{,}9 \text{ jam komputasi}`} block /></p>
        <p>13,9 jam/hari × Rp20.000 = <strong>Rp278.000/hari</strong> dihemat — dengan harga 8 GB storage ekstra (Rp2.400/bulan). <strong>Denormalisasi terkendali = arbitrase brilian:</strong> bayar Rp2.400/bulan untuk menghemat Rp8,3 juta/bulan. Inilah kalkulus di balik setiap keputusan "join atau duplikat".</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Normalisasi Melindungi Tulis, Denormalisasi Mempercepat Baca</h2>
      <p>Ada tegangan abadi yang tidak pernah selesai — dan memang tidak harus selesai:</p>
      <ul>
        <li><strong>Setiap join yang kamu hindari dengan denormalisasi = satu anomali update yang kamu undang.</strong> Tidak ada makan siang gratis. Star schema adalah kompromi cerdas: fact tetap ramping (tidak menyimpan teks berulang), dimensi didenormalisasi <em>secukupnya</em> (1 level, bukan 5) agar analis tidak join 7 tabel untuk 1 chart.</li>
        <li><strong>SCD Type 1 vs 2 vs 3 = pilihan tentang "apakah masa lalu boleh dilupakan".</strong> Type 1 (timpa): "alamat lama tidak penting" — cocok untuk koreksi typo. Type 2 (baris baru): "sejarah itu aset" — wajib untuk atribut yang memengaruhi analisis (kota → segmentasi regional; salah kota = salah bonus salesman). Type 3 (kolom prev): hanya untuk "nilai sebelumnya" yang <em>dijamin</em> cuma 1 versi ke belakang. Aturan praktis: kalau ragu, Type 2 — storage murah, penyesalan mahal.</li>
        <li><strong>Data Vault bukan "lebih bagus dari star schema"</strong> — ia jawaban untuk masalah berbeda: ratusan sumber yang berubah-ubah, auditability penuh, load paralel tanpa refactor. Untuk 3 sumber stabil milik startup? Overkill yang memperlambat semua orang. Pilih vault saat <em>skala perubahan skema</em>-nya besar, bukan saat datanya besar.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> bank dengan 40 sistem sumber (core banking, kartu kredit, mobile app) tidak bisa memaksa semua sumber punya skema rapi. Pola yang bekerja: <strong>staging mentah</strong> (apa adanya) → <strong>vault/hub</strong> (integrasi, tahan perubahan) → <strong>star schema mart</strong> (enak dibaca analis). Tiga lapis, tiga model, tiga tujuan — persis seperti medallion di DM4. Pemodelan = memilih <em>di lapis mana</em> kerapian diterapkan.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Tabel yang bagus = tidak ada redundansi sama sekali (selalu 3NF)."</strong></p>
        <p><strong>Yang benar:</strong> 3NF mengorbankan kecepatan baca demi keamanan tulis. Di warehouse yang <em>ditulis sekali sehari via batch</em> tapi <em>dibaca ribuan kali</em>, trade-off-nya terbalik: denormalisasi terkendali (star schema) menang telak. Redundansi yang <strong>disengaja, terdokumentasi, dan di-refresh batch</strong> = optimasi. Redundansi yang <strong>tidak disengaja</strong> (kolom alamat2_final_FINAL) = utang.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: SCD Type 2 — Time Travel Query</h2>
      <p>Buktikan kenapa Type 2 penting: jawab "berapa penjualan Bandung <em>pada Januari</em>?" dengan benar walau pelanggan sudah pindah.</p>
      <PyodideLab
        title="Lab 3 — Mesin Waktu Dimensi"
        hint="Coba: jalankan query 'penjualan per kota saat ini' vs 'per kota per Januari'. Kenapa angkanya beda? Itulah gunanya valid_from/valid_to."
        defaultCode={`# Lab 3: SCD Type 2 mini — pelanggan pindah kota, sejarah tetap utuh
dim_pelanggan = [
    # id, nama,  kota,      valid_from,  valid_to
    ("P1", "Budi", "Jakarta", "2026-01-01", "2026-03-14"),  # versi lama
    ("P1", "Budi", "Bandung", "2026-03-15", "9999-12-31"),  # versi baru (pindah!)
    ("P2", "Ani",  "Jakarta", "2026-01-01", "9999-12-31"),
]
fact_jual = [
    # (tgl, pelanggan_id, nominal)
    ("2026-01-20", "P1", 500000),   # Budi masih di Jakarta
    ("2026-02-10", "P2", 300000),
    ("2026-04-05", "P1", 700000),   # Budi sudah di Bandung
]

def kota_saat_ini(pid):
    return [r[2] for r in dim_pelanggan if r[0]==pid and r[4]=="9999-12-31"][0]

def kota_pada(tgl, pid):
    return [r[2] for r in dim_pelanggan if r[0]==pid and r[3] <= tgl <= r[4]][0]

from collections import defaultdict
salah, benar = defaultdict(int), defaultdict(int)
for tgl, pid, nom in fact_jual:
    salah[kota_saat_ini(pid)] += nom      # Type 1: timpa -> sejarah hilang
    benar[kota_pada(tgl, pid)] += nom     # Type 2: versi sesuai tanggal transaksi

print("Tanpa SCD (kota saat ini):", dict(salah))
print("Dengan SCD Type 2        :", dict(benar))
print()
print("Lihat: Rp500rb transaksi Januari 'pindah' ke Bandung tanpa Type 2.")
print("Laporan Januari yang dicetak ulang bulan April jadi BEDA -> audit gagal.")`}
      />

      <h2 id="case">📋 Mini-Case: Dashboard Cabang yang Angkanya "Ngaco"</h2>
      <div className="callout">
        <p>Dashboard "Top 10 Cabang" menampilkan cabang SBY-02 dua kali: "Surabaya" (transaksi lama) dan "Surabaya Timur" (transaksi baru, setelah rename). Totalnya terpecah, ranking salah. Root cause: tabel transaksi menyimpan <code className="inline">nama_cabang</code> sebagai teks bebas (denormalisasi), dan rename cabang hanya mengubah data baru.</p>
        <p><strong>Pertanyaan:</strong> (a) Anomali normalisasi apa ini? (b) Desain yang benar seperti apa? (c) Bagaimana menangani histori rename agar laporan 2024 tetap benar?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Anomali update</strong> — satu fakta (nama cabang) disimpan di ribuan baris; update tidak tuntas → inkonsisten.</p>
          <p>(b) <strong>3NF di OLTP:</strong> tabel cabang terpisah (cabang_id → nama); transaksi hanya simpan cabang_id. <strong>Star schema di mart:</strong> dim_cabang + fakta_transaksi.</p>
          <p>(c) <strong>SCD Type 2</strong> pada dim_cabang: baris "Surabaya" (berlaku s.d. rename) + baris "Surabaya Timur" (berlaku sejak rename) — laporan 2024 pakai nama lama, laporan kini pakai nama baru, keduanya benar.</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal hitungan tentang redundansi, anomali, dan SCD. Kerjakan dulu, baru buka.</p>

      <details className="worked">
        <summary>Soal 1 — Redundansi: tabel 200.000 baris, tiap pelanggan muncul 5×, kolom nama 25 byte. Berapa byte terbuang untuk kolom nama saja?</summary>
        <p>Pelanggan unik = <Tex math={String.raw`200.000 / 5 = 40.000`} />.</p>
        <p><Tex math={String.raw`\text{terbuang} = 40.000 \times (5-1) \times 25 = 4.000.000 \text{ byte} \approx 3{,}8 \text{ MB}`} block /></p>
        <p>Untuk 1 kolom. Dengan 10 kolom berulang serupa ≈ <strong>38 MB</strong> — dibayar tiap bulan di storage <em>dan</em> di-scan tiap query. Normalisasi = penghematan berulang.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Anomali update: peluang 1 update baris gagal p = 2%. Tiap pelanggan punya 5 baris di tabel flat. Berapa peluang minimal 1 baris terlewat saat update alamat?</summary>
        <p><Tex math={String.raw`P = 1 - (1-0{,}02)^5 = 1 - 0{,}98^5 \approx 1 - 0{,}904 = 9{,}6\%`} block /></p>
        <p>Hampir <strong>1 dari 10</strong> update alamat menghasilkan data inkonsisten! Setelah normalisasi (1 baris di dimensi): peluang = 2%. <strong>Normalisasi memangkas risiko inkonsisten ~5×</strong> di kasus ini.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — SCD Type 2: 10.000 pelanggan, 15% ganti alamat per tahun. Berapa baris dim_pelanggan setelah 3 tahun?</summary>
        <p><Tex math={String.raw`10.000 \times 1{,}15^3 = 10.000 \times 1{,}5209 \approx 15.209 \text{ baris}`} block /></p>
        <p>Tumbuh 52% dalam 3 tahun — dimensi tetap mungil. Bandingkan dengan fact yang tumbuh 600.000 baris/tahun: <strong>jangan takut SCD Type 2 "membengkak"</strong>; yang membengkak adalah fact, dan itu wajar.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Satu nasabah bisa punya banyak rekening, satu rekening bisa dimiliki banyak nasabah (joint account). Bagaimana memodelkannya?"
        options={[
          "Tambah kolom rekening_id di tabel nasabah",
          "Tabel jembatan nasabah_rekening (N-M) dengan composite key",
          "Simpan daftar rekening sebagai teks koma di satu kolom",
          "Buat satu tabel raksasa gabungan",
        ]}
        correct={1}
        explanation="Benar: relasi N-M butuh tabel jembatan. Opsi teks koma melanggar 1NF dan tidak bisa di-join/di-query dengan benar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Menghapus satu-satunya transaksi sebuah cabang membuat info kota cabang itu hilang. Ini anomali…"
        options={[
          "Update",
          "Sisip (insert)",
          "Hapus (delete)",
          "Tidak ada anomali, normal",
        ]}
        correct={2}
        explanation="Benar: anomali hapus — fakta independen (info cabang) ikut hilang karena disimpan menempel pada fakta lain (transaksi). Solusi: tabel cabang terpisah (3NF)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kenapa star schema jauh lebih cepat untuk query dashboard dibanding skema ternormalisasi?"
        options={[
          "Karena datanya lebih sedikit",
          "Karena join sedikit & sederhana, dimensi sudah denormalisasi — mesin tidak perlu merangkai 5+ tabel",
          "Karena memakai bahasa query berbeda",
          "Karena tidak butuh index",
        ]}
        correct={1}
        explanation="Benar: denormalisasi dimensi memangkas join berantai. Datanya bisa sama banyak — yang berubah adalah bentuknya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Nasabah pindah kota. Laporan NPL per kota tahun lalu HARUS tetap memakai kota lama. Strategi SCD yang tepat?"
        options={[
          "Type 1 — timpa saja, yang penting data kini benar",
          "Type 2 — baris baru dengan tanggal berlaku, histori utuh",
          "Type 3 — tambah kolom kota_sebelumnya saja",
          "Hapus baris lama",
        ]}
        correct={1}
        explanation="Benar: Type 2. Type 1 menulis ulang sejarah (laporan lama ikut berubah artinya). Type 3 hanya menyimpan 1 langkah histori."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dalam star schema, tabel fakta_transaksi berisi nominal + foreign key. Grain yang benar dinyatakan sebagai…"
        options={[
          "'Tabel ini besar'",
          "'Satu baris = satu transaksi yang berhasil' — ditulis sebelum merancang apapun",
          "'Kolomnya banyak'",
          "Tidak perlu dinyatakan",
        ]}
        correct={1}
        explanation="Benar: grain = satu kalimat definisi satu baris. Salah grain (misal baris = item vs transaksi) membuat semua metrik turunannya salah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Kapan Data Vault LEBIH tepat daripada star schema biasa?"
        options={[
          "Startup dengan 3 tabel",
          "Enterprise: puluhan sumber, skema berubah tiap minggu, butuh audit penuh atas setiap perubahan",
          "Dashboard sederhana 1 tim",
          "Tidak pernah — selalu lebih buruk",
        ]}
        correct={1}
        explanation="Benar: Data Vault untuk skala & volatilitas ekstrem (Hub/Link/Satellite memisahkan identitas, relasi, histori). Untuk tim kecil, overhead-nya tidak sepadan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ER:</strong> gambar peta (entity, relasi, kardinalitas) sebelum menulis DDL; alur konseptual → logis → fisik.</li>
          <li><strong>Normalisasi (3NF):</strong> untuk OLTP — bunuh anomali update/sisip/hapus; tiap fakta disimpan sekali.</li>
          <li><strong>Star schema (Kimball):</strong> untuk OLAP — fakta (angka) + dimensi (konteks); denormalisasi terkontrol = query cepat.</li>
          <li><strong>SCD:</strong> Type 1 timpa (koreksi), Type 2 baris baru (histori analitik), Type 3 kolom berdampingan.</li>
          <li><strong>Data Vault:</strong> Hub/Link/Satellite untuk warehouse raksasa yang skemanya labil — bukan untuk tim kecil.</li>
          <li><strong>Jangan:</strong> denormalisasi database operasional; overwrite atribut yang dipakai analisis historis.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm1-data-lifecycle" className="btn btn-secondary btn-sm">← DM1</Link>
        <Link href="/learn/dm3-database" className="btn btn-primary btn-sm">Next: DM3 →</Link>
      </div>
    </div>
  );
}
