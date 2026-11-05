"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR13Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const latencyData = [
    {
      x: ["Rule sederhana", "Rule + agregat", "+ ML scoring", "+ feature store", "+ verifikasi eksternal"],
      y: [8, 35, 90, 140, 1200],
      type: "bar",
      marker: { color: ["#7bc96f", "#7bc96f", "#e8a838", "#e8a838", "#e05252"] },
      text: ["8 ms", "35 ms", "90 ms", "140 ms", "1200 ms"],
      textposition: "outside",
    },
  ];

  const budgetData = [
    {
      x: ["Network", "Feature lookup", "Agregat window", "Model scoring", "Rule eval", "Logging"],
      y: [25, 40, 45, 30, 10, 5],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["25", "40", "45", "30", "10", "5"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Simulasi latency: dari mana 155 ms itu berasal?
# Anggaran: total 200 ms. Tiap komponen 'makan' waktu.
import random
random.seed(37)

komponen = [
    ("Network (API gateway)",      25,  5),
    ("Feature lookup (cache)",     40, 15),
    ("Agregat window (hitung)",    45, 20),
    ("Model scoring (XGBoost)",    30, 10),
    ("Rule evaluation",            10,  3),
    ("Logging/audit",               5,  2),
]

total = 0
print(f"{'Komponen':28s} {'Waktu':>7s}")
for nama, mean, sd in komponen:
    w = max(1, random.gauss(mean, sd))
    total += w
    bar = "█" * int(w / 5)
    print(f"{nama:28s} {w:6.1f} ms {bar}")
print(f"{'TOTAL':28s} {total:6.1f} ms")
print(f"Anggaran: 200 ms -> {'✅ LOLOS' if total <= 200 else '❌ JEBOL'}")
print()
print("COBA UBAH: 'Feature lookup' mean 40 -> 150 (cache miss, hit DB).")
print("Total jebol! Pelajaran: SATU komponen lambat membunuh seluruh anggaran.")
print("Inilah kenapa feature store + cache = nyawa real-time.")`;

  const lab2Code = `# Point-in-time correctness: fitur 'saat itu', bukan 'saat ini'
# Kesalahan klasik: hitung fitur dari data SEKARANG untuk transaksi MASA LALU.
transaksi = [
    # (id, waktu, user)
    ("T1", 10.0, "U1"),
    ("T2", 10.5, "U1"),
    ("T3", 11.0, "U1"),
]
# Event 'sekarang' (waktu 12.0): U1 ternyata sudah 50 transaksi (data diperbarui!)
count_sekarang = {"U1": 50}
# Event per waktu (yang benar): hitung mundur dari tiap transaksi
count_saat_itu = {"T1": 5, "T2": 6, "T3": 7}  # dari log historis

print("Fitur 'jumlah transaksi 24 jam terakhir':")
for tid, w, u in transaksi:
    salah = count_sekarang[u]   # ❌ pakai data sekarang
    benar = count_saat_itu[tid] # ✅ point-in-time
    print(f"  {tid} (jam {w}): SALAH={salah:3d}  BENAR={benar:2d}  {'<- BOCOR!' if salah!=benar else ''}")
print()
print("COBA RENUNGKAN: model dilatih dengan fitur SALAH (50,50,50).")
print("Di produksi, fitur BENAR (5,6,7) tidak pernah terlihat saat training.")
print("Hasil: train-serving SKEW — model bingung di produksi.")
print("Pelajaran: feature store MENJAMIN point-in-time correctness.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR13 — Fraud / ML Analytics</span>
        <h1 className="display-title">Real-Time: Berpacu dengan Penipu<br />dalam 200 Milidetik</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 14 Transfer dalam 20 Menit</a></li>
          <li><a href="#anggaran">Anggaran Latency: 200 ms untuk Semuanya</a></li>
          <li><a href="#arsitektur">Arsitektur: Streaming Pipeline</a></li>
          <li><a href="#featurestore">Feature Store: Point-in-Time Correctness</a></li>
          <li><a href="#decision">Decision Engine: Otak yang Memutuskan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Bedah Anggaran Latency</a></li>
          <li><a href="#lab2">🔬 Lab 2: Point-in-Time Correctness</a></li>
          <li><a href="#worked">📐 Worked Example: Anggaran Latensi &amp; Throughput</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Waktu adalah Fitur Produk</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Real-Time vs Near-Real-Time vs Batch</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Arsitektur Keputusan</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: QRIS &amp; Keputusan &lt; 1 Detik</a></li>

          <li><a href="#case">📋 Mini-Case: Rancang Sistem 200 ms untuk PayKu</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Realtime</a></li>

          <li><a href="#latihan">Latihan Mandiri: Merancang 50ms</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyusun <strong>anggaran latency</strong> 200 ms dan mengidentifikasi komponen paling mahal.</li>
          <li>Menggambarkan <strong>arsitektur streaming pipeline</strong> (event → fitur → skor → keputusan).</li>
          <li>Menjelaskan <strong>point-in-time correctness</strong> dan peran feature store.</li>
          <li>Memilih antara <strong>real-time, near-real-time, dan batch</strong> untuk tiap kasus.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 14 Transfer dalam 20 Menit</h2>
      <div className="story">
        <p>Ingat kasus NusaBank (FR2)? 14 transfer dalam 20 menit, Rp800 juta hilang. Yang tidak diceritakan: <strong>model fraud mereka sebenarnya menangkap transfer ke-3</strong> — skor 0,91, &ldquo;sangat mencurigakan&rdquo;. Tapi skor itu <strong>baru keluar 47 detik kemudian</strong> — pipeline batch mereka jalan tiap 1 menit. Transfer ke-4 sampai ke-14 sudah lewat.</p>
        <p>Model yang benar + terlambat = model yang salah. Dalam fraud, <strong>kecepatan adalah fitur</strong>: keputusan yang datang setelah uang bergerak adalah arsip, bukan pertahanan.</p>
        <p>Twist-nya: setelah mereka membangun pipeline real-time 200 ms, serangan yang sama <strong>berhenti di transfer ke-2</strong> — model yang <em>sama persis</em>, hanya lebih cepat. Tidak ada peningkatan AUC. Tidak ada fitur baru. Hanya <strong>waktu</strong>. Lesson ini: <strong>infrastruktur real-time bukan &ldquo;optimasi&rdquo; — ia adalah bagian dari model</strong>.</p>
      </div>

      <h2 id="anggaran">Anggaran Latency: 200 ms untuk Semuanya</h2>
      <p><strong>Kenapa 200 ms?</strong> Di atas ~500 ms, nasabah <em>merasakan</em> aplikasi &ldquo;lemot&rdquo; (checkout ditinggal). Di bawah 200 ms, nyaris tak terasa. Maka 200 ms adalah <strong>anggaran total</strong> untuk: terima event → hitung fitur → skor model → evaluasi rule → putuskan → respons.</p>

      <PlotlyChart
        data={budgetData}
        title="Bedah Anggaran Latency 200 ms (ilustrasi)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "ms" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = waktu yang dimakan satu komponen; total = 155 ms dari 200 ms.</p>
        <p><strong>Interpretasi:</strong> <strong>feature lookup (40 ms) + agregat window (45 ms) = 55% anggaran</strong> — bukan model scoring (30 ms)! <strong>Pelajaran:</strong> optimasi real-time = optimasi <em>data</em>, bukan optimasi <em>model</em>. Model 5 ms tidak menyelamatkanmu jika fitur butuh 2 detik dihitung.</p>
      </div>

      <PlotlyChart
        data={latencyData}
        title="Biaya Latency per Lapisan Pertahanan (ms, skala log-ish)"
        layout={{ xaxis: { title: "Konfigurasi" }, yaxis: { title: "Latency (ms)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = latency total satu konfigurasi pertahanan.</p>
        <p><strong>Interpretasi:</strong> rule + agregat + ML + feature store = 140 ms (muat!). Tambah <strong>verifikasi eksternal</strong> (API dukcapil/biro kredit) = 1.200 ms (jebol 6×). <strong>Pelajaran:</strong> panggilan eksternal sinkron = pembunuh real-time. Solusinya: <em>async</em> (putuskan dulu dengan data lokal, verifikasi menyusul) atau <em>cache</em> agresif.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> latency adalah <strong>anggaran yang dibagi</strong>, bukan masalah tiap komponen sendiri-sendiri. &ldquo;Modelku cuma 30 ms&rdquo; tidak berarti apa-apa jika fitur butuh 2 detik. Desain real-time = <strong>desain anggaran</strong>: tetapkan 200 ms, bagi-bagi, dan tolak komponen yang jebol bagiannya.</p>
      </div>

      <h2 id="arsitektur">Arsitektur: Streaming Pipeline</h2>
      <p>Alur standar sistem fraud real-time:</p>
      <ol>
        <li><strong>Event ingestion:</strong> transaksi masuk sebagai event (Kafka/Redpanda) — bukan query database.</li>
        <li><strong>Stream processing:</strong> hitung window agregat <em>saat event mengalir</em> (Flink/Spark Streaming): <code className="inline">count_1h</code> selalu siap, tidak dihitung dadakan.</li>
        <li><strong>Feature serving:</strong> ambil fitur dari <strong>feature store</strong> (online store: Redis/DynamoDB — milidetik).</li>
        <li><strong>Scoring:</strong> model (ONNX/PMML agar cepat) + rule evaluation.</li>
        <li><strong>Decision engine:</strong> gabungkan → putuskan (approve/hold/step-up/block).</li>
        <li><strong>Feedback:</strong> keputusan + hasil investigasi kembali ke store (loop FR14).</li>
      </ol>
      <p><strong>Prinsip emas:</strong> <em>&ldquo;hitung saat mengalir, bukan saat ditanya.&rdquo;</em> Window agregat yang dihitung dadakan saat scoring = latency bunuh diri. Stream processor memeliharanya <strong>kontinu</strong> sehingga saat scoring tinggal <em>ambil</em>.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Real-time = model yang cepat.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> model scoring hanya 30 dari 155 ms. Real-time = <strong>sistem yang cepat</strong>: ingestion + fitur + skor + keputusan. Model 5 ms di atas pipeline 5 detik = sistem 5 detik. Optimasi model tanpa optimasi pipeline = mengecat mobil yang mogok.</p>
      </div>

      <h2 id="featurestore">Feature Store: Point-in-Time Correctness</h2>
      <p><strong>Definisi.</strong> Feature store = gudang fitur terpusat dengan dua wajah: <strong>offline store</strong> (untuk training — data historis lengkap) dan <strong>online store</strong> (untuk serving — nilai terbaru, akses milidetik).</p>
      <p><strong>Masalah yang dipecahkan: train-serving skew.</strong> Tanpa feature store, training menghitung fitur dari <em>database saat ini</em> untuk transaksi <em>masa lalu</em> — <strong>bocor</strong> (lihat Lab 2). Feature store menjamin <strong>point-in-time correctness</strong>: &ldquo;fitur untuk transaksi jam 10:00 = nilai yang <em>diketahui</em> pada jam 10:00, bukan yang diketahui sekarang.&rdquo;</p>
      <p><strong>Manfaat kedua: konsistensi definisi.</strong> <code className="inline">count_24h</code> yang dipakai training <strong>persis sama</strong> dengan yang dipakai produksi — satu definisi, dua kegunaan. Tanpa ini, &ldquo;count_24h&rdquo; versi data scientist ≠ versi engineer = model bingung di produksi.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> feature store adalah <strong>kontrak</strong> antara training dan serving: &ldquo;kita sepakat <code className="inline">count_24h</code> artinya ini, dihitung begini, pada titik waktu ini.&rdquo; Sebagian besar &ldquo;model bagus di training, hancur di produksi&rdquo; = pelanggaran kontrak ini.</p>
      </div>

      <h2 id="decision">Decision Engine: Otak yang Memutuskan</h2>
      <p>Decision engine menggabungkan semua sinyal menjadi <strong>satu keputusan</strong> dalam milidetik:</p>
      <ul>
        <li><strong>Input:</strong> skor ML + rule yang terpicu + daftar hitam/putih + konteks (nasabah prioritas? promo?).</li>
        <li><strong>Logika:</strong> mis. <em>block</em> jika skor &gt;0,9 ATAU rule kritis; <em>step-up</em> jika 0,6–0,9; <em>approve</em> jika &lt;0,6 dan tidak ada rule.</li>
        <li><strong>Output:</strong> keputusan + <strong>reason code</strong> (&ldquo;ditahan: velocity 12× + device baru&rdquo; — untuk investigator &amp; nasabah, lihat FR17).</li>
        <li><strong>Audit trail:</strong> tiap keputusan dicatat (input, versi model, versi rule) — untuk regulator &amp; debugging.</li>
      </ul>
      <p><strong>Yang sering dilupakan:</strong> decision engine butuh <strong>fallback</strong>. Jika feature store down / model timeout (&gt;200 ms) → <strong>keputusan default</strong> apa? (Umumnya: <em>approve dengan monitor ketat</em> untuk UX, atau <em>step-up</em> untuk keamanan — tergantung risk appetite.) Sistem tanpa fallback = sistem yang lumpuh total saat satu komponen batuk.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau model down, ya transaksi gagal saja — aman.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;gagal aman&rdquo; (fail-closed: tolak semua) = <strong>bunuh bisnis</strong> — 50.000 nasabah tidak bisa transaksi karena satu service down. &ldquo;Gagal terbuka&rdquo; (fail-open: loloskan + monitor) = risiko fraud sementara. Pilihannya adalah <strong>keputusan bisnis</strong>, bukan teknis — dan harus diputuskan <em>sebelum</em> insiden, bukan saat insiden.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Bedah Anggaran Latency</h2>
      <p>Rasakan bagaimana satu komponen lambat membunuh anggaran.</p>
      <PyodideLab
        title="Lab 1 — Anggaran Latency 200 ms"
        hint="Ubah 'Feature lookup' 40 → 150 (cache miss). Lihat total jebol — lalu pikirkan: apa yang harus di-cache?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Point-in-Time Correctness</h2>
      <PyodideLab
        title="Lab 2 — Train-Serving Skew"
        hint="Renungkan: jika training pakai fitur 'salah', apa yang dipelajari model? Itulah kenapa feature store bukan kemewahan."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Merancang Sistem 50ms</h2>
      <p>Realtime bukan &ldquo;secepat mungkin&rdquo; — ia <strong>anggaran</strong> yang dibagi habis ke komponen. Dua contoh perhitungannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membagi anggaran 50ms</summary>
        <p>Kebutuhan: keputusan blokir/approve dalam 50ms (p95) agar checkout tidak terasa lambat. Komponen pipeline:</p>
        <p><strong>Langkah 1 — alokasikan.</strong> Network in/out: 8ms. Feature fetch (Redis/feature store): 12ms. Model inference (GBM, 30 fitur): 6ms. Rule engine: 4ms. Buffer/overhead: 5ms. <strong>Total: 35ms</strong> — sisa 15ms sebagai cadangan.</p>
        <p><strong>Langkah 2 — uji komponen termahal.</strong> Ternyata feature fetch butuh 28ms karena 3 query sequential ke database berbeda. Solusi: <strong>paralelisasi</strong> (3 query jalan bersamaan → 12ms, mengikuti yang terlambat) + <strong>precompute</strong> fitur 24h+ ke Redis tiap 5 menit (FR6).</p>
        <p><strong>Langkah 3 — aturan darurat.</strong> Jika total &gt; 50ms (misal Redis lambat), sistem <strong>fail-open dengan mode degradasi</strong>: putuskan dengan fitur yang sudah ada + rule sederhana, catat untuk review asinkron. Alternatif fail-closed (tolak semua saat lambat) = bunuh bisnis tiap ada gangguan infra. Keputusan fail-open vs fail-closed adalah <strong>keputusan bisnis</strong>, bukan teknis — dan harus dibuat <em>sebelum</em> insiden, bukan saat insiden.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: menghitung kapasitas — dari QPS ke jumlah server</summary>
        <p>E-wallet memproses rata-rata 800 transaksi/detik (QPS), puncak 3.500 QPS (gajian + Harbolnas). Tiap keputusan butuh 35ms waktu komputasi.</p>
        <p><strong>Langkah 1 — kebutuhan konkurensi.</strong> Konkurensi = QPS × latensi = 3.500 × 0,035 = <strong>122,5 → 123 worker konkuren</strong> minimum di puncak.</p>
        <p><strong>Langkah 2 — ke jumlah server.</strong> Satu server menangani 32 worker → 123/32 = 3,8 → <strong>4 server</strong> untuk puncak, +1 cadangan (N+1) = <strong>5 server</strong>. Untuk rata-rata 800 QPS: 800 × 0,035/32 ≈ 1 server — artinya <strong>autoscaling 1→5</strong> menghemat 80% biaya di jam sepi.</p>
        <p><strong>Langkah 3 — jebakan antrean.</strong> Jika QPS sesaat melonjak ke 6.000 (2× puncak yang direncanakan), antrean tumbuh 2.500/detik — dalam 60 detik = 150.000 tertunda, latensi meledak ke hitungan detik. Solusi: <strong>load shedding</strong> — transaksi berisiko rendah (<em>low score historical</em>, nominal kecil, merchant tepercaya) dilewati dari scoring penuh saat overload. Prinsip: <strong>saat tenggelam, selamatkan yang paling berharga dulu</strong> — bukan semua sama rata.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Waktu adalah Fitur Produk</h2>
      <p>Di fraud, <strong>latensi bukan masalah teknis — ia fitur produk</strong>. Checkout yang melambat 500ms = konversi turun = nasabah kabur ke kompetitor. Setiap milidetik yang kamu &ldquo;belanjakan&rdquo; untuk scoring harus <strong>dibayar kembali</strong> dengan fraud yang dicegah. Anggaran 50ms bukan angka magis — ia <em>hasil negosiasi</em> antara risk (ingin teliti) dan produk (ingin cepat). Analis yang paham ini merancang sistem yang <em>menang di kedua sisi</em>.</p>
      <p>Intuisi kedua: <strong>tidak semua keputusan butuh kecepatan yang sama</strong>. Blokir drain akun = milidetik. Review pola mencurigakan = menit. Bongkar jaringan = hari. Arsitektur yang memaksakan <em>semua</em> keputusan dalam 50ms = membakar uang untuk ketelitian yang tidak dibutuhkan; yang membiarkan <em>semua</em> lambat = kebocoran. <strong>Desain berdasarkan urgensi keputusan, bukan berdasarkan ambisi teknis.</strong></p>
      <p><strong>Kapan real-time TIDAK dibutuhkan:</strong> (1) <strong>keputusan yang bisa ditunda tanpa kerugian</strong> — review manual 15 menit kemudian cukup untuk pola non-drain; (2) <strong>saat biaya infra &gt; nilai yang dilindungi</strong> — transaksi Rp10rb tidak butuh scoring Rp500; (3) <strong>analisis forensik &amp; jaringan</strong> — butuh kelengkapan, bukan kecepatan. <strong>Real-time adalah kemewahan yang dibayar per milidetik</strong> — belanjakan hanya di mana ia menghasilkan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rancang dengan <strong>graceful degradation</strong>: saat sistem lambat/overload, ia <em>menurun dengan anggun</em> (fitur dikurangi, bukan mati total). Sistem yang hanya punya dua mode — sempurna atau mati — akan memilih mati di saat paling dibutuhkan.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Real-Time vs Near-Real-Time vs Batch</h2>

      <div className="decision-card">
        <h3>1. Uang bergerak dalam detik (transfer, tarik tunai) → <strong>real-time (&lt;200 ms)</strong></h3>
        <p><strong>Kenapa:</strong> keputusan harus sebelum dana pindah. Batch = arsip.</p>
        <p><strong>Contoh nyata:</strong> transfer BI-FAST, tarik tunai ATM.</p>
      </div>

      <div className="decision-card">
        <h3>2. Butuh verifikasi eksternal / analisis dalam → <strong>near-real-time (detik–menit) + hold</strong></h3>
        <p><strong>Kenapa:</strong> tahan dana sementara (hold 30 menit), putuskan dengan data lengkap.</p>
        <p><strong>Contoh nyata:</strong> transaksi kartu lintas negara pertama kali — hold + notifikasi.</p>
      </div>

      <div className="decision-card">
        <h3>3. Pola jaringan / AML / pelaporan → <strong>batch (jam–harian)</strong></h3>
        <p><strong>Kenapa:</strong> graph analytics &amp; investigasi AML tidak butuh milidetik; butuh kelengkapan.</p>
        <p><strong>Contoh nyata:</strong> deteksi mule ring (FR12), STR ke PPATK (FR15).</p>
      </div>

      <div className="decision-card">
        <h3>4. Komponen down → <strong>fallback yang sudah diputuskan</strong></h3>
        <p><strong>Kenapa:</strong> tanpa fallback, satu service down = seluruh pembayaran lumpuh.</p>
        <p><strong>Pilihan:</strong> fail-open (loloskan + monitor) vs fail-closed (tahan) — keputusan bisnis, bukan teknis.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Anggaran 200 ms = <strong>dibagi</strong>, bukan per komponen.</li>
          <li>Optimasi <strong>fitur</strong> dulu (55% anggaran), model kemudian.</li>
          <li><strong>Hitung saat mengalir</strong> (stream), bukan saat ditanya.</li>
          <li>Feature store = kontrak training-serving. Tanpa itu = skew.</li>
          <li>Tentukan <strong>fallback</strong> sebelum insiden.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Sinkron vs Asinkron</h2>
      <p>Tidak semua keputusan harus real-time. Tiga skenario arsitektur:</p>
      <p><strong>Skenario A — block-then-review (sinkron penuh).</strong> Untuk: skor sangat tinggi (≥ 0,70), pola serangan aktif. Transaksi ditahan <em>saat itu juga</em>. Harga: latensi + risiko false positive mengganggu nasabah. Cocok untuk pola yang <strong>biaya kelolosannya katastrofal</strong> (drain akun).</p>
      <p><strong>Skenario B — approve-then-review (asinkron).</strong> Untuk: skor menengah, transaksi harus cepat (QRIS, tap kartu). Transaksi <em>dilewatkan</em>, lalu scoring penuh + review dalam 5–15 menit. Jika terbukti fraud: blokir akun &amp; cegah transaksi <em>berikutnya</em> (kerugian satu transaksi diterima sebagai biaya kecepatan). Cocok untuk: <strong>pembayaran tatap muka</strong> di mana menolak di kasir = mempermalukan nasabah.</p>
      <p><strong>Skenario C — fitur mahal secara asinkron.</strong> Fitur graph 2-hop (80ms) tidak muat di budget 50ms. Solusi: keputusan awal dari fitur cepat (35ms), lalu <strong>enrichment asinkron</strong> — jika fitur mahal menyala 200ms kemudian, picu review/blokir susulan + tandai akun untuk 24 jam. Prinsip: <strong>jangan biarkan fitur terbaikmu tidak dipakai hanya karena ia lambat</strong> — pakai ia di jalur kedua.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> di realtime, <strong>fitur yang 90% akurat dalam 5ms lebih berharga daripada yang 99% akurat dalam 500ms</strong> — karena yang kedua tidak pernah sempat dipakai. Latensi adalah <em>fitur produk</em> sama seperti akurasi: keduanya dibayar dengan uang (infra) dan keduanya dirasakan nasabah.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Menahan QRIS Tanpa Membunuh UX</h2>
      <p>QRIS memproses ratusan juta transaksi/bulan di Indonesia — dan ekspektasi penggunanya: <strong>scan → bayar → selesai dalam 2 detik</strong>. Tidak ada ruang untuk &ldquo;transaksi Anda sedang ditinjau&rdquo;.</p>
      <p><strong>Tantangannya (pola umum):</strong> modus &ldquo;QRIS palsu&rdquo; — stiker QR merchant diganti dengan QR milik penjahat; dana mengalir ke rekening penjahat. Juga ATO: akun e-wallet dibajak lalu dipakai QRIS berkali-kali nominal kecil (di bawah radar rule nominal).</p>
      <p><strong>Arsitektur yang bekerja:</strong> (1) <strong>pre-screening 5ms</strong>: blacklist device/merchant + velocity 1 menit dari Redis — menangkap 70% pola kasar; (2) <strong>scoring 30ms</strong>: GBM ringan (15 fitur) untuk sisanya; (3) <strong>post-auth monitoring</strong>: pola &ldquo;10 QRIS Rp95rb dalam 20 menit&rdquo; memicu pembekuan akun <em>setelah</em> transaksi ke-11 — menerima kerugian 10 transaksi demi UX 99,99% transaksi normal.</p>
      <p><strong>Angka ilustratif trade-off-nya:</strong> menaikkan ambang blokir menghemat Rp120jt/bulan fraud tapi menambah 0,3% transaksi tertahan = 900.000 transaksi/bulan × risiko churn. Keputusan final: <strong>lebih longgar di titik pembayaran, lebih ketat di pola pasca-bayar</strong> — karena di QRIS, <em>kepercayaan UX adalah aset yang lebih mahal daripada fraud yang dicegah</em>.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Sistem realtime harus memblokir semua fraud sebelum terjadi.&rdquo;<br /><strong>Yang benar:</strong> tidak ada sistem realtime yang menangkap 100% — target realistis: <strong>tangkap yang katastrofal secara sinkron, kejar sisanya secara asinkron</strong>. Mengejar 100% sinkron = latensi meledak = nasabah kabur = bisnis mati. Keamanan sempurna yang membunuh bisnis bukan keamanan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Rancang Sistem 200 ms untuk PayKu</h2>
      <div className="callout">
        <p>PayKu (1 juta trx/hari ≈ 12 trx/detik rata-rata, puncak 100/detik). Kebutuhan: tahan transfer mencurigakan <strong>sebelum dana pindah</strong>. Fitur: 15 agregat window + skor XGBoost + 20 rule. Kendala: database utama tidak boleh di-query saat scoring (terlalu lambat).</p>
        <p><strong>Pertanyaan:</strong> rancang arsitektur (komponen + aliran data + anggaran ms per komponen). Di mana feature store? Apa fallback jika model timeout?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Arsitektur:</strong> (1) <em>Ingestion:</em> API gateway → Kafka (25 ms). (2) <em>Stream:</em> Flink memelihara 15 agregat kontinu dari event stream (bukan query DB!). (3) <em>Feature store:</em> online (Redis) menyimpan agregat terbaru + profil user; offline (data lake) untuk training. (4) <em>Scoring:</em> XGBoost ONNX (30 ms) + rule engine (10 ms) paralel. (5) <em>Decision engine:</em> gabungkan → approve/hold/step-up/block + reason code (10 ms). <strong>Total ≈ 155 ms</strong> — sisa 45 ms buffer.</p>
          <p><strong>Fallback:</strong> jika scoring &gt;200 ms → <em>step-up authentication</em> (minta biometrik/OTP) — kompromi: tidak memblokir total (UX), tidak meloloskan buta (risiko). Keputusan bisnis yang didokumentasikan.</p>
          <p><strong>Yang TIDAK dilakukan:</strong> query DB utama saat scoring; panggil API eksternal sinkron; hitung agregat dadakan. <strong>Pelajaran:</strong> kecepatan = arsitektur, bukan algoritma.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Realtime</h2>
      <details className="worked">
        <summary>Q1: Berapa latensi yang &ldquo;wajar&rdquo; untuk scoring fraud?</summary>
        <p><strong>Benchmark umum:</strong> &lt; 50ms p95 untuk pembayaran instan (QRIS, kartu); &lt; 200ms untuk checkout e-commerce; &lt; 1 detik untuk transfer bank (nasabah mentolerir &ldquo;memproses&rdquo;). Tapi angka yang benar = <strong>hasil negosiasi risk × produk × data</strong>: ukur dampak konversi vs fraud yang dicegah, bukan ikut-ikutan angka orang. <em>Latensi adalah keputusan bisnis berbiaya teknis.</em></p>
      </details>
      <details className="worked">
        <summary>Q2: Fail-open vs fail-closed — mana yang benar?</summary>
        <p><strong>Tergantung apa yang dipertaruhkan:</strong> fail-open (lewatkan saat sistem down) untuk <em>transaksi nilai kecil + UX kritis</em> — menerima kebocoran sementara demi bisnis tetap jalan. Fail-closed (tahan saat down) untuk <em>drain akun / nilai besar</em> — keamanan di atas segalanya. <strong>Keputusan ini dibuat SEBELUM insiden</strong>, didokumentasikan, dan disetujui bisnis — bukan diputuskan engineer jam 3 pagi.</p>
      </details>
      <details className="worked">
        <summary>Q3: Feature store — kapan butuh, kapan overkill?</summary>
        <p><strong>Butuh saat:</strong> &gt; 3 model memakai fitur yang sama, ada kebutuhan <em>konsistensi training-serving</em> (mencegah skew), atau fitur mahal yang harus di-precompute. <strong>Overkill saat:</strong> 1 model, fitur sedikit &amp; murah — Redis + cron cukup. <em>Jangan bangun feature store untuk 1 model</em> — itu seperti membangun gudang untuk 1 kardus.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bagaimana handle traffic 10× (Harbolnas) tanpa 10× server?</summary>
        <p><strong>Empat jurus:</strong> (1) <em>autoscaling</em> (bayar hanya saat puncak); (2) <em>model mode hemat</em> — versi ringan otomatis aktif saat load tinggi; (3) <em>load shedding</em> — lewati scoring penuh untuk transaksi risiko historis rendah; (4) <em>freeze deploy</em> H-14 event besar. Kombinasi keempatnya &gt; sekadar &ldquo;tambah server&rdquo; — karena <strong>puncak 10× bukan 10× lebih lama, hanya 10× lebih tinggi</strong>.</p>
      </details>

      <details className="worked">
        <summary>Q5: Bagaimana menguji sistem realtime sebelum event besar (Harbolnas)?</summary>
        <p><strong>Tiga uji wajib:</strong> (1) <em>load test 10x</em> — replay traffic historis dengan pengali; ukur p95/p99, bukan rata-rata; (2) <em>chaos test</em> — matikan Redis/feature store, pastikan graceful degradation (bukan mati total); (3) <em>game day</em> — simulasi insiden dengan tim lengkap + ukur waktu rollback. <strong>Lulus ketiganya = boleh tidur tenang saat Harbolnas.</strong></p>
      </details>
      <details className="worked">
        <summary>Q6: Kapan memakai edge computing untuk deteksi fraud?</summary>
        <p>Saat <strong>latensi ke server tidak bisa ditolerir</strong> (pembayaran offline/daerah 3T) atau <strong>aturan sederhana yang stabil</strong> (blacklist device, velocity kasar). Edge = cepat tapi <em>bodoh</em> (model kecil, update jarang); server = pintar tapi butuh koneksi. <strong>Arsitektur hibrida</strong>: edge untuk saringan kasar, server untuk keputusan cerdas saat online.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Merancang 50ms</h2>
      <p><strong>1.</strong> Anggaran 80ms: network 10ms, feature fetch 35ms (3 query sequential @ ~12ms), inference 8ms, rule 5ms, overhead 5ms. Total? Apa optimasi pertamamu?</p>
      <p><strong>2.</strong> QPS puncak 2.000, latensi komputasi 40ms, 1 server = 24 worker. Berapa server untuk puncak + N+1?</p>
      <p><strong>3.</strong> Tiga skenario — pilih fail-open atau fail-closed + 1 kalimat alasan: (a) QRIS Rp20rb saat Redis down; (b) transfer Rp200jt saat model down; (c) top-up e-wallet Rp100rb saat overload 5x.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Total = <strong>63ms</strong> — masih di bawah 80ms, tapi tanpa cadangan. Optimasi pertama: <strong>paralelkan 3 query</strong> (35→12ms) → total 40ms, cadangan 40ms. <em>Selalu sisakan buffer untuk degradasi.</em></p>
        <p><strong>2.</strong> Konkurensi = 2.000 x 0,04 = <strong>80</strong> → 80/24 = 3,34 → <strong>4 server + 1 cadangan = 5</strong>.</p>
        <p><strong>3.</strong> (a) <strong>fail-open</strong> — nilai kecil, UX kritis; (b) <strong>fail-closed</strong> — nilai besar, risiko drain; (c) <strong>fail-open dengan load shedding</strong> — lewati scoring penuh untuk risiko historis rendah. <em>Keputusan bisnis, bukan teknis.</em></p>
      </details>

      <p><strong>4.</strong> Flash sale: load 5x normal, latensi meledak. Rancang <em>mode hemat</em>: fitur/komponen apa yang dipotong PERTAMA saat overload — dan kenapa itu yang paling aman dipotong?</p>
      <details className="worked">
        <summary>Jawaban</summary>
        <p>Potong <strong>fitur mahal ber-accuracy-marjinal</strong> dulu (graph 2-hop, embedding) — pertahankan <strong>blacklist + velocity + model ringan</strong>. Alasan: saat overload, <em>ketersediaan</em> mengalahkan <em>ketelitian</em>; saringan kasar menangkap 70% pola dengan 20% biaya. <em>Degradasi yang dirancang &gt; kegagalan yang acak.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model menangkap transfer ke-3 (skor 0,91) tapi skor keluar 47 detik kemudian; 14 transfer lolos. Pelajaran?"
        options={[
          "Modelnya kurang akurat",
          "Kecepatan adalah fitur — model benar + terlambat = model salah. Keputusan harus sebelum dana bergerak",
          "Butuh lebih banyak fitur",
          "Tidak ada pelajaran",
        ]}
        correct={1}
        explanation="Benar: dalam fraud, waktu = bagian dari kebenaran. Pipeline batch 1 menit membuat model sehebat apa pun jadi arsip."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam anggaran 200 ms, komponen termahal biasanya?"
        options={[
          "Model scoring",
          "Feature lookup + agregat window (55%) — optimasi data > optimasi model",
          "Logging",
          "Rule evaluation",
        ]}
        correct={1}
        explanation="Benar: fitur, bukan model. 'Modelku cuma 30 ms' tidak berarti apa-apa jika fitur butuh 2 detik. Hitung saat mengalir (stream), bukan saat ditanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Training menghitung 'count_24h' dari database SEKARANG untuk transaksi 3 bulan lalu. Masalahnya?"
        options={[
          "Tidak ada",
          "Train-serving skew — fitur bocor (pakai info masa depan); model bingung di produksi. Solusi: feature store + point-in-time correctness",
          "Training lebih cepat",
          "Data lebih akurat",
        ]}
        correct={1}
        explanation="Benar: kebocoran temporal. 'Jumlah transaksi 24 jam terakhir' untuk T1 harus = yang diketahui SAAT T1, bukan sekarang. Feature store menjamin ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Feature store down saat puncak transaksi. Kebijakan terbaik?"
        options={[
          "Tolak semua transaksi (fail-closed) — paling aman",
          "Fallback yang SUDAH diputuskan bisnis sebelumnya (mis. step-up auth) — fail-closed buta membunuh bisnis, keputusan harus dibuat sebelum insiden",
          "Tunggu sampai pulih",
          "Restart acak",
        ]}
        correct={1}
        explanation="Benar: fallback yang diputuskan sebelumnya. Fail-closed = 50.000 nasabah tak bisa transaksi; fail-open buta = risiko. Kompromi (step-up) + dokumentasi = dewasa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan BATCH (bukan real-time) justru tepat?"
        options={[
          "Tidak pernah",
          "Deteksi mule ring / analisis AML / pelaporan — butuh kelengkapan & komputasi berat, tidak butuh milidetik",
          "Selalu",
          "Hanya untuk laporan keuangan",
        ]}
        correct={1}
        explanation="Benar: graph analytics & investigasi AML = batch. Real-time untuk 'uang bergerak detik ini'; batch untuk 'pola berminggu-minggu'. Arsitektur dewasa = keduanya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>200 ms</strong> = anggaran total real-time; dibagi antar komponen, bukan per komponen.</li>
          <li><strong>Fitur (55%) &gt; model (20%)</strong> dalam anggaran — optimasi data dulu.</li>
          <li><strong>Hitung saat mengalir</strong> (stream processing); scoring tinggal ambil.</li>
          <li><strong>Feature store</strong> = point-in-time correctness + konsistensi definisi training-serving.</li>
          <li><strong>Decision engine</strong>: gabungkan skor + rule → keputusan + reason code + audit trail.</li>
          <li><strong>Fallback</strong> ditentukan bisnis sebelum insiden — bukan saat insiden.</li>
          <li>Kapan TIDAK real-time: analisis jaringan/AML (batch) — kecepatan tanpa kelengkapan = buta.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr12-graph-analytics" className="btn btn-secondary btn-sm">← FR12</Link>
        <Link href="/learn/fr14-case-management" className="btn btn-primary btn-sm">Next: FR14 →</Link>
      </div>
    </div>
  );
}
