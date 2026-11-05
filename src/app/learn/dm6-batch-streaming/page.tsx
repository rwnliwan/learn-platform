"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM6Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const latencyData = [
    {
      x: ["Batch harian", "Micro-batch (5 mnt)", "Streaming (detik)"],
      y: [24, 0.083, 0.001],
      type: "bar",
      marker: { color: ["#e8a838", "#2a7de1", "#2a7de1"] },
      text: ["24 jam", "5 menit", "~detik"],
      textposition: "outside",
    },
  ];

  const costData = [
    {
      x: ["Batch", "Streaming"],
      y: [20, 80],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838"] },
      name: "Biaya",
    },
    {
      x: ["Batch", "Streaming"],
      y: [90, 30],
      type: "bar",
      marker: { color: ["#94a3b8", "#64748b"] },
      name: "Kesederhanaan",
    },
  ];

  const lab1Code = `# Lab 1: Batch vs Streaming — kapan "telat 24 jam" jadi masalah?
# Skenario: deteksi fraud. Aturan: >3 transaksi dalam 10 menit = curiga.

transaksi = [
    ("09:00", "N001", 50000), ("09:02", "N001", 75000), ("09:05", "N001", 100000),
    ("09:08", "N001", 200000), ("09:09", "N001", 300000),  # <- pola fraud!
    ("09:01", "N002", 50000),
]

print("== BATCH (proses jam 00:00 besok) ==")
by_nasabah = {}
for jam, n, nom in transaksi:
    by_nasabah.setdefault(n, []).append((jam, nom))
for n, txs in by_nasabah.items():
    print(f"  {n}: {len(txs)} transaksi -> {'CURIGA, tapi ketahuan BESOK' if len(txs) > 3 else 'aman'}")
print("  Kerugian: fraud sudah kabur 15 jam sebelum ketahuan.")
print()
print("== STREAMING (proses per event, window 10 menit) ==")
from collections import deque
window = deque()
for jam, n, nom in transaksi:
    window.append((jam, n))
    # sederhananya: hitung event N001 dalam 10 menit terakhir
    recent = [w for w in window if w[1] == n]
    if len(recent) > 3:
        print(f"  ALERT {jam}: {n} sudah {len(recent)}x dalam 10 menit -> BLOKIR SEKARANG")
        break
print()
print("Pelajaran: batch = murah & sederhana, tapi buta antar-jadwal.")
print("Streaming = mahal & kompleks, tapi bereaksi dalam detik.")
print("Coba: ubah ambang >3 menjadi >5. Berapa lama fraud lolos?")`;

  const lab2Code = `# Lab 2: CDC — tiru cara Debezium membaca "buku harian" database
# Alih-alih SELECT * tiap jam (berat), CDC membaca LOG perubahan (WAL - ingat DM3A!).

# "WAL" database operasional (yang sebenarnya ditulis DB untuk durability):
wal = [
    ("INSERT", "nasabah", {"id": "N001", "nama": "Budi", "saldo": 5000000}),
    ("UPDATE", "nasabah", {"id": "N001", "saldo": 4500000}),   # tarik tunai
    ("INSERT", "nasabah", {"id": "N002", "nama": "Ani", "saldo": 2000000}),
    ("DELETE", "nasabah", {"id": "N002"}),                      # tutup rekening
]

print("== Tanpa CDC: SELECT * tiap jam = scan SEMUA baris, tidak tahu yang berubah ==")
print("   (di tabel 100 juta baris: mahal & telat)")
print()
print("== Dengan CDC: baca WAL, teruskan HANYA perubahan ==")
warehouse = {}
for op, tabel, data in wal:
    nid = data["id"]
    if op == "DELETE":
        warehouse.pop(nid, None); print(f"  {op} {nid} -> hapus dari warehouse")
    else:
        warehouse[nid] = data; print(f"  {op} {nid} -> upsert ke warehouse")
print()
print("Warehouse kini:", warehouse)
print()
print("Inilah pola standar OLTP -> OLAP modern (DM1): CDC, bukan dump berkala.")
print("Coba: tambah UPDATE saldo N001 lagi — warehouse ikut tanpa scan ulang.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM6 — Data Management</span>
        <h1 className="display-title">Batch vs Streaming:<br />Korannya Pagi Ini atau Kabar Burung Detik Ini?</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp2 Miliar yang Lolos Semalam</a></li>
          <li><a href="#batch">Batch — Si Pekerja Shift Malam</a></li>
          <li><a href="#streaming">Streaming — Si Penjaga Real-Time</a></li>
          <li><a href="#kafka">Kafka — Sistem Saraf Pusat Data</a></li>
          <li><a href="#cdc">CDC — Mata-mata di Buku Harian Database</a></li>
          <li><a href="#semantik">Exactly-Once — Janji yang Mahal</a></li>
          <li><a href="#lab1">🔬 Lab 1: Fraud — Batch Telat vs Streaming Sigap</a></li>
          <li><a href="#lab2">🔬 Lab 2: CDC dari WAL (Tanpa Scan Ulang)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Batch, Micro-batch, atau Streaming</a></li>
          <li><a href="#worked">🔢 Worked Example: Rp2 Miliar yang (Tidak) Lolos</a></li>
          <li><a href="#intuisi">🧠 Intuisi: CDC = Bisikan Database</a></li>
          <li><a href="#lab3">🔬 Lab 3: Event Time vs Processing Time</a></li>
          <li><a href="#case">📋 Mini-Case: Notifikasi "Saldo Berubah" yang Ngaco</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan trade-off batch vs streaming (latensi, biaya, kompleksitas) dan memilih yang tepat per kasus.</li>
          <li>Menjelaskan anatomi Kafka (topic, partition, consumer group, offset) dengan analogi yang melekat.</li>
          <li>Menjelaskan cara kerja CDC dan kenapa ia pola standar replikasi OLTP → warehouse.</li>
          <li>Membedakan semantik at-least-once / at-most-once / exactly-once beserta harganya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rp2 Miliar yang Lolos Semalam</h2>
      <div className="story">
        <p>Bank "AmanSentosa" punya sistem deteksi fraud batch: tiap jam 1 pagi, job memindai transaksi kemarin. Suatu malam, sindikat menguras 40 rekening — masing-masing Rp50 juta — antara jam 2–4 pagi. Jam 1 pagi berikutnya sistem berteriak "FRAUD!". Tapi uangnya sudah ditarik tunai jam 6 pagi dan hilang.</p>
        <p>Twist-nya: sistemnya <em>bekerja sempurna</em> — ia menemukan semua fraud. Masalahnya bukan akurasi, melainkan <strong>waktu</strong>. Batch menjawab "apa yang terjadi kemarin"; fraud butuh jawaban "apa yang terjadi <em>10 detik lalu</em>". Lesson ini tentang memilih <em>kapan</em> data diproses — karena untuk sebagian masalah, jawaban yang telat = jawaban yang salah.</p>
      </div>

      <h2 id="batch">Batch — Si Pekerja Shift Malam</h2>
      <p><strong>Definisi.</strong> Batch = kumpulkan data selama periode, proses sekaligus. <em>Kepribadian: pekerja shift malam yang teliti</em> — datang saat semua sudah tenang, kerjakan tumpukan besar sekaligus, efisien, tapi tidak ada di siang hari saat masalah terjadi.</p>
      <p><strong>Kelebihan:</strong> sederhana (kode biasa, gampang debug), murah (compute bisa dimatikan antar jadwal), throughput raksasa, exactly-once lebih mudah (baca file utuh, tulis ulang partisi — idempoten alami, DM5).</p>
      <p><strong>Kelemahan:</strong> latensi = interval jadwal. Buta total antar-jadwal. <strong>Cocok:</strong> laporan harian, agregat KPI, training model ML, backfill historis — semua yang "telat 24 jam tidak masalah".</p>

      <h2 id="streaming">Streaming — Si Penjaga Real-Time</h2>
      <p><strong>Definisi.</strong> Streaming = proses <em>tiap event saat tiba</em>, latensi detik/sub-detik. <em>Kepribadian: penjaga malam yang tidak tidur</em> — selalu waspada, bereaksi instan, tapi gajinya mahal dan butuh kopi terus (infrastruktur kompleks).</p>
      <p><strong>Konsep kunci:</strong></p>
      <ul>
        <li><strong>Event time vs processing time:</strong> kapan kejadian <em>terjadi</em> vs kapan <em>diproses</em>. Data telat (jam HP mati 2 jam) = event time lama, processing time kini. Sistem streaming harus menangani keduanya.</li>
        <li><strong>Window:</strong> "hitung X per 10 menit terakhir" — tumbling (tidak overlap), sliding (overlap), session (berdasarkan aktivitas).</li>
        <li><strong>Watermark:</strong> "saya tunggu data telat sampai batas ini, selebihnya dianggap hilang" — trade-off kelengkapan vs ketepatan waktu.</li>
        <li><strong>Micro-batch</strong> (Spark): kompromi — proses tiap beberapa detik/menit. Lebih sederhana dari streaming murni, latensi menit.</li>
      </ul>
      <p><strong>Harga streaming:</strong> state management (ingat agregat 10 menit terakhir = simpan state!), late data, exactly-once yang sulit, operasional 24/7, dan <strong>jauh lebih sulit di-debug</strong> ("kenapa angka jam 3 beda?" — selamat menelusuri event).</p>

      <PlotlyChart
        data={latencyData}
        title="Latensi: Batch vs Micro-batch vs Streaming (skala log)"
        layout={{ xaxis: { title: "Pola" }, yaxis: { title: "Latensi (jam, skala log)", type: "log" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang (skala log) = waktu dari kejadian sampai hasil tersedia.</p>
        <p><strong>Interpretasi:</strong> jurang latensi 4–5 orde magnitudo. <strong>Tapi</strong> lihat chart biaya di bawah: streaming membayar mahal untuk kecepatan itu. Pertanyaan desain selalu: <em>"berapa nilai 1 jam lebih cepat untuk kasus ini?"</em> Untuk fraud: miliaran. Untuk laporan KPI: nol.</p>
      </div>

      <PlotlyChart
        data={costData}
        title="Trade-off: Biaya vs Kesederhanaan"
        layout={{ barmode: "group", xaxis: { title: "" }, yaxis: { title: "Skor relatif" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kelompok batang; biru = biaya (makin tinggi makin mahal), abu = kesederhanaan (makin tinggi makin gampang).</p>
        <p><strong>Interpretasi:</strong> trade-off-nya simetris dan jujur: streaming mahal + rumit, batch murah + sederhana. <strong>Kesalahan paling mahal:</strong> membangun streaming untuk kebutuhan yang sebenarnya cukup batch — membayar kompleksitas tanpa nilai bisnis.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Perusahaan modern harus real-time semua."</strong></p>
        <p><strong>Yang benar:</strong> <em>real-time</em> adalah kebutuhan bisnis, bukan gengsi arsitektur. Kebanyakan dashboard "real-time" sebenarnya hanya butuh refresh 15 menit (micro-batch cukup). Tanyakan: "keputusan apa yang berubah jika datanya 1 jam lebih segar?" Jika jawabannya "tidak ada", pakai batch dan hemat 80% kompleksitas.</p>
      </div>

      <h2 id="kafka">Kafka — Sistem Saraf Pusat Data</h2>
      <p><strong>Definisi.</strong> Apache Kafka = <strong>distributed event log</strong>: tempat semua event mengalir, disimpan berurutan, bisa dibaca banyak consumer independen. <em>Kepribadian: sistem saraf pusat</em> — semua organ (aplikasi, warehouse, ML) terhubung ke satu tulang punggung, bukan kabel point-to-point yang kusut.</p>
      <p><strong>Anatomi (wajib hafal untuk interview):</strong></p>
      <ul>
        <li><strong>Topic:</strong> kanal bernama ("transaksi", "klik"). Analogi: <em>folder</em>.</li>
        <li><strong>Partition:</strong> topic dibagi N partisi untuk paralelisme. <strong>Urutan hanya dijamin <em>dalam</em> satu partisi</strong> — bukan antar-partisi! (Jebakan interview klasik.)</li>
        <li><strong>Producer:</strong> pengirim event. <strong>Consumer:</strong> pembaca.</li>
        <li><strong>Consumer group:</strong> sekumpulan consumer berbagi baca satu topic — tiap partisi dibaca tepat 1 consumer dalam grup. Tambah consumer = tambah throughput (maks = jumlah partisi).</li>
        <li><strong>Offset:</strong> penanda "sudah baca sampai sini" — memungkinkan <em>replay</em>: baca ulang event lama kapan saja (tidak seperti queue yang menghapus setelah dibaca).</li>
        <li><strong>Retention:</strong> event disimpan X hari walau sudah dibaca — Kafka = log, bukan queue.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> beda Kafka vs queue biasa (RabbitMQ): queue = pesan dihapus setelah dibaca (1 consumer); Kafka = log permanen, <strong>banyak consumer independen baca dengan kecepatan sendiri-sendiri</strong> (warehouse baca batch semalam, fraud baca real-time, audit replay 3 bulan lalu — dari <em>topic yang sama</em>). Inilah kekuatannya sebagai tulang punggung.</p>
      </div>

      <h2 id="cdc">CDC — Mata-mata di Buku Harian Database</h2>
      <p><strong>Definisi.</strong> Change Data Capture = menangkap <em>perubahan</em> database sumber dengan membaca <strong>log transaksinya (WAL)</strong> — bukan dengan query <code className="inline">SELECT *</code> berkala. Tools: <strong>Debezium</strong> (open source, baca WAL Postgres/MySQL → kirim ke Kafka).</p>
      <p><strong>Kenapa ini pola standar OLTP → warehouse</strong> (jembatan DM1): (1) <strong>ringan</strong> — tidak membebani database operasional dengan scan raksasa; (2) <strong>real-time</strong> — perubahan mengalir detik setelah commit; (3) <strong>lengkap</strong> — INSERT/UPDATE/DELETE semua tertangkap, termasuk <em>urutan</em> dan nilai sebelum/sesudah.</p>
      <p><strong>Ingat DM3A?</strong> WAL dibuat untuk durability — CDC "menumpang" infrastruktur yang sama untuk replikasi. Elegan: satu mekanisme, dua manfaat.</p>

      <h2 id="semantik">Exactly-Once — Janji yang Mahal</h2>
      <p>Tiga semantik pengiriman di sistem tersebar:</p>
      <ul>
        <li><strong>At-most-once:</strong> kirim sekali, hilang ya sudah. Murah. Cocok: metrik/lokasi yang boleh bolong.</li>
        <li><strong>At-least-once:</strong> kirim sampai dapat ack — <em>bisa duplikat</em>. Default kebanyakan sistem. Syarat: consumer <strong>idempoten</strong> (DM5!) agar duplikat tidak berbahaya.</li>
        <li><strong>Exactly-once:</strong> tepat sekali, tanpa duplikat tanpa hilang. <strong>Mahal</strong>: butuh transaksi terkoordinasi (Kafka transactions + idempotent producer). Hanya untuk yang kritis (uang).</li>
      </ul>
      <p>Rumus praktis industri: <Tex math={String.raw`\text{at-least-once} + \text{idempotent consumer} \approx \text{exactly-once effect}`} block /> — efek sama, biaya jauh lebih murah. Inilah kenapa DM5 (idempotency) adalah prasyarat arsitektur streaming.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kafka menjamin urutan event global."</strong></p>
        <p><strong>Yang benar:</strong> urutan hanya dijamin <strong>per partisi</strong>. Event di partisi 1 vs partisi 2 bisa tiba tak berurutan. Jika urutan global kritis (riwayat saldo satu rekening), paksa semua event rekening itu ke <strong>partisi yang sama</strong> (partition key = rekening_id) — dengan harga paralelisme berkurang.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> lowongan 2026 menulis "Kafka" hampir selalu berpasangan dengan <strong>"Flink/Spark Streaming"</strong> (engine prosesnya) dan <strong>"exactly-once"</strong> (tantangannya). Pahami ketiganya sebagai satu paket: Kafka = transport, Flink/Spark = otak, exactly-once = ujiannya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Fraud — Batch Telat vs Streaming Sigap</h2>
      <p>Rasakan kenapa latensi adalah fitur: pola fraud yang sama, nasib berbeda.</p>
      <PyodideLab
        title="Lab 1 — Jendela Waktu Menentukan Segalanya"
        hint="Coba: ubah ambang >3 menjadi >5. Trade-off apa yang muncul? (Petunjuk: false negative vs false positive.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: CDC dari WAL (Tanpa Scan Ulang)</h2>
      <p>Tiru cara Debezium bekerja: baca log, teruskan hanya yang berubah.</p>
      <PyodideLab
        title="Lab 2 — WAL: Dari Durability ke Replikasi"
        hint="Coba: tambah UPDATE lagi untuk N001. Warehouse ikut update tanpa scan ulang — itulah efisiensi CDC."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Batch, Micro-batch, atau Streaming</h2>

      <div className="decision-card">
        <h3>1. Laporan harian / KPI / training ML → <strong>Batch</strong></h3>
        <p><strong>Kondisi:</strong> telat 24 jam tidak mengubah keputusan.</p>
        <p><strong>Kenapa:</strong> termurah, tersederhana, termudah di-debug & di-backfill. Default yang benar untuk 80% kasus.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dashboard "nyaris real-time" (refresh 5–15 mnt) → <strong>Micro-batch</strong></h3>
        <p><strong>Kondisi:</strong> butuh segar, tapi tidak butuh detik.</p>
        <p><strong>Kenapa:</strong> 90% manfaat streaming dengan 20% kompleksitasnya. Spark micro-batch cukup.</p>
      </div>

      <div className="decision-card">
        <h3>3. Fraud / alert / notifikasi instan → <strong>Streaming (Kafka + Flink/Spark)</strong></h3>
        <p><strong>Kondisi:</strong> nilai 1 jam lebih cepat = besar (miliaran / keselamatan).</p>
        <p><strong>Kenapa:</strong> satu-satunya yang bereaksi dalam detik. Bayar mahal karena nilainya mahal.</p>
      </div>

      <div className="decision-card">
        <h3>4. Replikasi OLTP → warehouse → <strong>CDC (Debezium → Kafka), bukan dump berkala</strong></h3>
        <p><strong>Kondisi:</strong> butuh data operasional segar tanpa membebani DB transaksi.</p>
        <p><strong>Kenapa:</strong> baca WAL = ringan + real-time + lengkap (urutan & before/after).</p>
      </div>

      <div className="decision-card">
        <h3>5. Butuh urutan ketat per entitas → <strong>partition key = ID entitas</strong></h3>
        <p><strong>Kondisi:</strong> riwayat per rekening/pengguna harus berurutan.</p>
        <p><strong>Kenapa:</strong> Kafka hanya jamin urutan per partisi — desain key dengan sadar.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Default = batch.</strong> Naik ke streaming hanya jika ada nilai bisnis per jam-nya.</li>
          <li><strong>"Real-time" palsu?</strong> → micro-batch 5–15 menit dulu.</li>
          <li><strong>Duplikat pasti terjadi</strong> → consumer wajib idempoten (DM5).</li>
          <li><strong>Urutan?</strong> → pikirkan partition key sejak hari pertama.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: Rp2 Miliar yang (Tidak) Lolos</h2>
      <p>Serangan fraud kartu kredit: 400 transaksi mencurigakan @Rp5 juta = <strong>Rp2 miliar</strong>, dieksekusi dalam 25 menit jam 02.00–02.25. Bandingkan deteksi batch vs streaming — dalam rupiah dan menit.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Batch harian: hitung kerugiannya (klik untuk buka)</summary>
        <p>Batch jalan jam 06.00 (butuh 45 menit). Timeline: serangan selesai 02.25 → terdeteksi <strong>06.45</strong> → tim fraud bereaksi 07.30.</p>
        <p><Tex math={String.raw`\text{jendela buta} = 06.45 - 02.00 = 4 \text{ jam } 45 \text{ menit}`} block /></p>
        <p>Dalam 4 jam 45 menit, penyerang sudah: tarik tunai, pindah dana, tutup jejak. Recovery rate dana fraud yang terdeteksi &gt;4 jam: <strong>~15%</strong> (data industri).</p>
        <p><Tex math={String.raw`\text{kerugian batch} = 2.000.000.000 \times (1 - 0{,}15) = \text{Rp}1{,}7 \text{ miliar}`} block /></p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Streaming: blokir di transaksi ke-7</summary>
        <p>Streaming (Flink, latensi p99 = 3 detik): pola "5 transaksi &gt;Rp1 juta dalam 10 menit dari 1 kartu" terpicu di transaksi ke-7 (menit ke-2 serangan). Kartu dibekukan otomatis menit ke-3.</p>
        <p><Tex math={String.raw`\text{transaksi lolos} = 6 \times 5.000.000 = \text{Rp}30 \text{ juta}`} /></p>
        <p>Recovery rate deteksi &lt;5 menit: <strong>~90%</strong> (dana belum sempat dipindah).</p>
        <p><Tex math={String.raw`\text{kerugian streaming} = 30.000.000 \times (1 - 0{,}90) = \text{Rp}3 \text{ juta}`} block /></p>
        <p><strong>Rp1,7 miliar vs Rp3 juta = 567× selisih.</strong> Inilah "kenapa streaming" dalam satu angka: bukan soal teknologi keren, tapi <em>fungsi kerugian terhadap waktu deteksi</em> yang eksponensial untuk fraud.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Tapi streaming tidak gratis: hitung harganya</summary>
        <p>Cluster streaming 24/7 untuk 5.000 event/detik: ~8 worker × Rp1,2 juta/bulan = <strong>Rp9,6 juta/bulan</strong> + tim yang bisa operasi stateful streaming (skill langka, gaji premium ~30%). Batch setara: 1 job 45 menit/hari ≈ <strong>Rp800 ribu/bulan</strong>.</p>
        <p><Tex math={String.raw`\frac{\text{Rp}1{,}7 \text{ M (satu insiden)}}{\text{Rp}9{,}6 \text{ jt/bln} - \text{Rp}0{,}8 \text{ jt/bln}} \approx 193 \text{ bulan}`} block /></p>
        <p>Satu insiden fraud membayar <strong>193 bulan</strong> selisih biaya streaming. Tapi untuk use case "laporan penjualan harian" (kerugian telat = Rp0), streaming = buang Rp8,8 juta/bulan. <strong>Keputusan batch vs streaming = perbandingan fungsi kerugian × frekuensi insiden vs selisih biaya operasional.</strong> Tidak ada jawaban universal — hanya aritmetika per use case.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Exactly-once: kenapa "janji mahal"?</summary>
        <p>At-least-once (retry, DM5): 0,1% event duplikat pada 5.000 event/detik = <strong>5 duplikat/detik = 432.000/hari</strong>. Untuk agregat "total penjualan": 432.000 × Rp500.000 (rata-rata) = <strong>Rp216 miliar/hari double-count potensial</strong> — angka kacau total. Exactly-once (idempotent sink + transactional Kafka, DM5): duplikat = 0, harga = throughput turun 15–30% + kompleksitas operasi naik. Untuk <em>notifikasi saldo</em> (mini-case), at-least-once + dedup di consumer cukup; untuk <em>ledger uang</em>, exactly-once wajib. Sekali lagi: bayar sesuai risikonya.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> tiga semantik pengiriman = tiga janji: <strong>at-most-once</strong> ("mungkin hilang, tidak pernah ganda" — untuk metrik yang boleh hilang), <strong>at-least-once</strong> ("tidak hilang, mungkin ganda" — default Kafka, butuh consumer idempoten), <strong>exactly-once</strong> ("tidak hilang tidak ganda" — end-to-end, mahal). Kebanyakan bug streaming = mengira memakai exactly-once padahal cuma at-least-once tanpa dedup.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Watermark: berapa yang rela dikorbankan?</summary>
        <p>Distribusi keterlambatan event: 99% tiba &lt; 5 menit, 1% tiba 5–60 menit (HP offline lama).</p>
        <p>Watermark 5 menit → window jam 02.00 ditutup 02.05: <strong>99% benar, 1% masuk side output</strong> (diproses susulan, agregat dikoreksi).</p>
        <p><Tex math={String.raw`\text{trade-off} = \text{latensi } 5 \text{ mnt} \leftrightarrow \text{akurasi } 99\%`} block /></p>
        <p>Naikkan watermark ke 60 menit → 100% akurat tapi <strong>deteksi fraud telat 1 jam</strong> (Rp1,7 M → lihat Langkah 1!). <strong>Watermark = tuas antara kecepatan dan kelengkapan</strong> — tidak ada posisi benar, hanya posisi yang risikonya kamu pahami.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: CDC = Mendengar Bisikan Database</h2>
      <p>CDC (Change Data Capture) membaca <strong>write-ahead log</strong> database — buku harian yang ditulis <em>sebelum</em> data commit (DM3a: durability). Tiga intuisi yang jarang dijelaskan:</p>
      <ul>
        <li><strong>Kenapa CDC, bukan "SELECT tiap menit"?</strong> Polling <code className="inline">SELECT * WHERE updated_at &gt; ?</code> pada tabel 500 juta baris = full scan tiap menit (DM4: Rp837 ribu/query!). CDC = baca <em>hanya baris yang berubah</em> dari log: 1.000 update/detik → 1.000 record/detik, bukan 500 juta. Plus: polling <strong>kehilangan delete</strong> (baris yang dihapus tidak muncul di SELECT berikutnya!) dan <strong>kehilangan update ganda</strong> (2 update dalam 1 menit terlihat 1). CDC menangkap semuanya — log tidak berbohong.</li>
        <li><strong>Kafka bukan antrean, ia log terdistribusi.</strong> Antrean (RabbitMQ): pesan dihapus setelah dibaca — 1 konsumen. Log Kafka: pesan <em>tetap</em> (retensi hari/minggu), banyak konsumen baca independen dengan offset masing-masing. Konsekuensinya: consumer baru bisa <strong>replay dari awal</strong> (backfill streaming!), dan 5 tim bisa konsumsi 1 topik tanpa berebut. Mental model "kaset yang bisa diputar ulang banyak orang", bukan "kotak surat".</li>
        <li><strong>Event time vs processing time = sumber 80% bug streaming.</strong> Event jam 02.00 tiba jam 02.05 (HP mati, sinyal hilang). Window "per jam" pakai <em>processing time</em> → event masuk ember jam 02.05 (salah!). Pakai <em>event time</em> + <strong>watermark</strong> ("tunggu sampai yakin 99% event jam 02.00 sudah tiba") → benar, harga = latensi +5 menit. Aturan: analitik uang → event time; monitoring kasar → processing time boleh.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> bank memakai <strong>lambda/kappa hybrid</strong>: streaming untuk deteksi &amp; alert (cepat, perkiraan), batch malam untuk angka resmi (lambat, pasti). Keduanya membaca <em>topik Kafka yang sama</em> — streaming = konsumen real-time, batch = konsumen yang replay 1× sehari. Tidak ada duplikasi sumber, hanya dua kecepatan baca. Inilah jawaban elegan untuk "batch atau streaming?": <strong>keduanya, dari satu log.</strong></p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Real-time = lebih akurat dari batch."</strong></p>
        <p><strong>Yang benar:</strong> real-time = lebih <em>cepat</em>, sering <em>kurang</em> akurat (data terlambat, duplikat, partial window). Batch = lambat tapi lengkap &amp; terkoreksi. Angka "resmi" bank selalu dari batch (rekonsiliasi, DM13); streaming untuk <em>aksi</em> (blokir, alert), bukan untuk <em>kebenaran</em>. Tim yang menjadikan angka streaming sebagai "laporan resmi" akan menjelaskan selisih ke auditor setiap bulan.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Event Time vs Processing Time — Lihat Bug-nya</h2>
      <p>Simulasikan event telat: window per jam dengan processing time salah menaruh event, event time benar.</p>
      <PyodideLab
        title="Lab 3 — Jebakan Waktu Streaming"
        hint="Coba: naikkan TELAT_MENIT ke 90. Kapan processing-time window 'kehilangan' event? Itulah kenapa watermark ada."
        defaultCode={`# Lab 3: event time vs processing time (window per jam)
from collections import defaultdict

TELAT_MENIT = 40  # event jam 02.x tiba 40 menit kemudian
events = []
# 60 event normal jam 02:00-02:59, tiba tepat waktu
for m in range(60):
    events.append({"event": f"02:{m:02d}", "tiba": f"02:{m:02d}", "nominal": 100000})
# 10 event jam 02:50-02:59, tiba TELAT (HP offline)
for m in range(50, 60):
    tiba_m = m + TELAT_MENIT
    tiba = f"03:{tiba_m-60:02d}" if tiba_m >= 60 else f"02:{tiba_m:02d}"
    events.append({"event": f"02:{m:02d}", "tiba": tiba, "nominal": 100000})

def window(waktu_str):
    return waktu_str[:2]  # ember per jam

salah = defaultdict(int)  # processing time
benar = defaultdict(int)  # event time
for e in events:
    salah[window(e["tiba"])] += e["nominal"]
    benar[window(e["event"])] += e["nominal"]

print("Processing time (SALAH):", dict(salah))
print("Event time      (BENAR):", dict(benar))
print()
print("Rp1 juta 'pindah' dari jam 02 ke jam 03 hanya karena telat tiba.")
print("Agregat fraud per jam jadi salah -> pola serangan tidak terdeteksi.")`}
      />

      <h2 id="case">📋 Mini-Case: Notifikasi "Saldo Berubah" yang Ngaco</h2>
      <div className="callout">
        <p>Bank meluncurkan notifikasi real-time "saldo berubah" via Kafka (at-least-once). Keluhan: (1) nasabah dapat notifikasi <strong>ganda</strong> untuk 1 transaksi; (2) kadang notifikasi <strong>saldo lama datang setelah saldo baru</strong> (urutan terbalik!).</p>
        <p><strong>Pertanyaan:</strong> (a) Penyebab masing-masing gejala? (b) Perbaikan untuk keduanya? (c) Kenapa tidak sekalian pakai exactly-once?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) (1) <strong>At-least-once</strong> → duplikat saat retry; (2) <strong>event satu nasabah tersebar di banyak partisi</strong> → urutan antar-partisi tidak dijamin.</p>
          <p>(b) (1) <strong>Idempotent consumer</strong>: dedup by event_id sebelum kirim notifikasi; (2) <strong>partition key = nasabah_id</strong> agar semua event satu nasabah berurutan.</p>
          <p>(c) Exactly-once <strong>mahal & kompleks</strong> (transaksi terkoordinasi) — untuk notifikasi, "at-least-once + idempoten" memberi efek sama dengan biaya jauh lebih murah (rumus lesson ini).</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: kerugian fraud batch vs streaming, jebakan event time, dan duplikat at-least-once.</p>

      <details className="worked">
        <summary>Soal 1 — Fraud: 300 transaksi × Rp4 juta = Rp1,2 M dalam 20 menit. Batch: terdeteksi 5 jam kemudian, recovery 20%. Streaming: blokir di menit ke-4 (12 transaksi lolos), recovery 85%. Bandingkan kerugiannya.</summary>
        <p>Batch: <Tex math={String.raw`1{,}2 \text{ M} \times (1-0{,}20) = \text{Rp}960 \text{ jt}`} />.</p>
        <p>Streaming: lolos <Tex math={String.raw`12 \times 4 \text{ jt} = \text{Rp}48 \text{ jt}`} /> → rugi <Tex math={String.raw`48 \text{ jt} \times (1-0{,}85) = \text{Rp}7{,}2 \text{ jt}`} block /></p>
        <p><strong>Rp960 jt vs Rp7,2 jt (133×)</strong>. Fungsi kerugian fraud terhadap waktu deteksi = eksponensial — inilah matematika "kenapa streaming".</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Event time: 50 event jam 05.00 (nominal Rp200 rb) tiba 70 menit kemudian. Berapa rupiah yang "pindah jam" jika memakai processing-time window?</summary>
        <p><Tex math={String.raw`50 \times 200.000 = \text{Rp}10 \text{ jt}`} block /></p>
        <p>Rp10 juta tercatat di jam 06 padahal terjadi jam 05. Agregat per jam salah → pola serangan tidak terlihat. <strong>Watermark = harga kebenaran.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 3 — At-least-once: 8.000 event/detik, 0,2% duplikat karena retry. Berapa duplikat per hari? Apa artinya untuk agregat tanpa dedup?</summary>
        <p><Tex math={String.raw`8.000 \times 0{,}002 = 16 \text{/detik} \;\Rightarrow\; 16 \times 86.400 = 1.382.400\text{/hari}`} block /></p>
        <p>1,38 juta duplikat/hari. Tanpa idempotent consumer, agregat "total penjualan" membengkak — <strong>at-least-once tanpa dedup = at-most-correct</strong>.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kapan streaming WAJIB dipilih dibanding batch?"
        options={[
          "Saat datanya besar",
          "Saat nilai '1 jam lebih cepat' besar — misal fraud: jawaban telat = jawaban salah",
          "Saat tim ingin teknologi keren",
          "Selalu — batch sudah kuno",
        ]}
        correct={1}
        explanation="Benar: streaming adalah keputusan bisnis (nilai waktu), bukan gengsi. Batch tetap default benar untuk 80% kasus."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Di Kafka, jaminan urutan event berlaku…"
        options={[
          "Global, semua partisi",
          "Hanya dalam satu partisi — antar-partisi bisa tak berurutan",
          "Tidak ada jaminan sama sekali",
          "Hanya untuk consumer group",
        ]}
        correct={1}
        explanation="Benar: per-partisi. Butuh urutan per entitas? Partition key = ID entitas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kenapa CDC (baca WAL) lebih baik dari SELECT * berkala untuk replikasi OLTP → warehouse?"
        options={[
          "Karena lebih modern",
          "Ringan (tidak scan tabel raksasa), real-time, dan lengkap (INSERT/UPDATE/DELETE + urutan + before/after)",
          "Karena tidak butuh Kafka",
          "Karena menghapus data lama",
        ]}
        correct={1}
        explanation="Benar: tiga keunggulan CDC. Bonus: ia menumpang WAL yang memang sudah ada untuk durability (DM3A)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Sistem at-least-once + consumer idempoten menghasilkan…"
        options={[
          "Kekacauan duplikat",
          "Efek setara exactly-once dengan biaya jauh lebih murah — pola standar industri",
          "Data hilang",
          "Tidak ada bedanya",
        ]}
        correct={1}
        explanation="Benar: rumus praktis lesson ini. Exactly-once sejati hanya untuk yang paling kritis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dashboard butuh data 'segar' tapi keputusan memakai data 15 menit lalu pun sama. Pilihan paling bijak?"
        options={[
          "Streaming Flink full — biar keren",
          "Micro-batch 5–15 menit — 90% manfaat dengan 20% kompleksitas",
          "Batch mingguan",
          "Tidak usah ada dashboard",
        ]}
        correct={1}
        explanation="Benar: jangan bayar harga streaming untuk kebutuhan micro-batch. Tanya selalu: keputusan apa yang berubah?"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Watermark dalam stream processing berfungsi untuk…"
        options={[
          "Memberi tanda air pada chart",
          "Batas toleransi data telat: 'saya tunggu sampai sini, selebihnya dianggap hilang' — trade-off kelengkapan vs ketepatan",
          "Mengenkripsi event",
          "Menghapus duplikat",
        ]}
        correct={1}
        explanation="Benar: watermark = keputusan eksplisit tentang data telat. Tanpa itu, window tidak pernah bisa ditutup."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Batch:</strong> murah, sederhana, telat = interval jadwal. Default untuk 80% kasus.</li>
          <li><strong>Streaming:</strong> detik, mahal, kompleks — hanya jika nilai waktu membenarkannya.</li>
          <li><strong>Kafka:</strong> distributed event log — topic/partition/consumer group/offset/retention; urutan per partisi.</li>
          <li><strong>CDC:</strong> baca WAL → replikasi ringan, real-time, lengkap. Pola standar OLTP → warehouse.</li>
          <li><strong>Semantik:</strong> at-least-once + idempoten ≈ exactly-once (murah). Exactly-once sejati = mahal.</li>
          <li><strong>Jangan:</strong> streaming untuk kebutuhan batch; lupa partition key saat butuh urutan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm5-orkestrasi-dbt" className="btn btn-secondary btn-sm">← DM5</Link>
        <Link href="/learn/dm7-kualitas-data" className="btn btn-primary btn-sm">Next: DM7 →</Link>
      </div>
    </div>
  );
}
