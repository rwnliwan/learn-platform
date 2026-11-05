"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM5Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const cronData = [
    {
      x: ["Cron bebas (tanpa orkestrasi)", "Orkestrasi (Airflow/Dagster)"],
      y: [35, 92],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["35% pipeline terpantau", "92% terpantau + alert"],
      textposition: "outside",
    },
  ];

  const retryData = [
    {
      x: ["Tanpa retry", "Retry 3x + alert"],
      y: [22, 3],
      type: "bar",
      marker: { color: ["#ef4444", "#2a7de1"] },
      text: ["22% job gagal permanen/bln", "3% butuh intervensi"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Idempotency — job yang AMAN dijalankan 2x (atau 10x)
# Skenario: job harian menghitung total transaksi per hari -> tabel hasil.

hasil = {}  # tabel hasil (di dunia nyata: tabel database)

def job_tidak_idempoten(tanggal, transaksi):
    # BURUK: INSERT tanpa cek -> dijalankan 2x = data GANDA
    hasil.setdefault(tanggal, []).append(sum(transaksi))
    print(f"  [tidak-idempoten] baris untuk {tanggal}: {hasil[tanggal]}")

def job_idempoten(tanggal, transaksi):
    # BAIK: DELETE+INSERT (atau MERGE by key) -> dijalankan 10x pun hasil sama
    hasil[tanggal] = [sum(transaksi)]
    print(f"  [idempoten] baris untuk {tanggal}: {hasil[tanggal]}")

print("== Retry karena network glitch: job jalan 2x ==")
job_tidak_idempoten("2026-10-12", [100, 200, 300])
job_tidak_idempoten("2026-10-12", [100, 200, 300])  # retry!
print("   Total tercatat:", sum(hasil["2026-10-12"]), "<- SALAH! (seharusnya 600)")
print()
hasil.clear()
job_idempoten("2026-10-12", [100, 200, 300])
job_idempoten("2026-10-12", [100, 200, 300])  # retry!
job_idempoten("2026-10-12", [100, 200, 300])  # retry lagi!
print("   Total tercatat:", sum(hasil["2026-10-12"]), "<- BENAR, walau 3x jalan.")
print()
print("Rumus idempotency: f(f(x)) = f(x) — jalankan 2x = jalankan 1x.")
print("Coba: apa yang terjadi jika job_idempoten memakai += bukan = ?")`;

  const lab2Code = `# Lab 2: DAG — urutan & dependensi (mini Airflow dalam 30 baris)
# Pipeline medallion: bronze -> silver -> gold. Aturan: jangan jalan sebelum dependensi sukses.

from collections import defaultdict

class Task:
    def __init__(self, nama, dep=()):
        self.nama, self.dep, self.status = nama, dep, "pending"

tasks = {
    "bronze_transaksi": Task("bronze_transaksi"),
    "silver_bersih":   Task("silver_bersih", ("bronze_transaksi",)),
    "gold_harian":     Task("gold_harian", ("silver_bersih",)),
    "gold_risiko":     Task("gold_risiko", ("silver_bersih",)),
    "laporan_direksi": Task("laporan_direksi", ("gold_harian", "gold_risiko")),
}

def run(tasks, gagalkan=None):
    urutan, sisa = [], dict(tasks)
    while sisa:
        jalan = [t for t in sisa.values()
                 if all(tasks[d].status == "sukses" for d in t.dep)]
        if not jalan:
            print("DEADLOCK: tidak ada task bisa jalan! Dependensi:", 
                  {t.nama: t.dep for t in sisa.values()})
            break
        for t in jalan:
            t.status = "gagal" if t.nama == gagalkan else "sukses"
            urutan.append(f"{t.nama}({'GAGAL' if t.status=='gagal' else 'ok'})")
            del sisa[t.nama]
    return urutan

print("== Run normal ==")
print(" -> ".join(run(tasks)))
print()
for t in tasks.values(): t.status = "pending"
print("== silver_bersih GAGAL: apa yang terjadi ke downstream? ==")
print(" -> ".join(run(tasks, gagalkan="silver_bersih")))
print()
print("Inilah gunanya orkestrator: dependensi, retry, alert — bukan cron buta.")
print("Coba: buat 'gold_harian' bergantung juga pada 'bronze_transaksi' langsung.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">DM5 — Data Management</span>
        <h1 className="display-title">Orkestrasi & dbt:<br />Pipelinemu Butuh Konduktor</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dashboard Pagi yang Kosong</a></li>
          <li><a href="#orkestrasi">Orkestrasi — Konduktor Orkestra Data</a></li>
          <li><a href="#dag">DAG — Partitur Musiknya</a></li>
          <li><a href="#dbt">dbt — Transformasi sebagai Kode</a></li>
          <li><a href="#idempoten">Idempotency — Aman Dijalankan 10 Kali</a></li>
          <li><a href="#backfill">Backfill & Retry — Mesin Waktu Pipeline</a></li>
          <li><a href="#lab1">🔬 Lab 1: Idempotency dalam Kode</a></li>
          <li><a href="#lab2">🔬 Lab 2: DAG Mini — Dependensi & Kegagalan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Butuh Apa untuk Pipeline</a></li>
          <li><a href="#worked">🔢 Worked Example: 1 Gagal, Berapa Lama Pulih?</a></li>
          <li><a href="#intuisi">🧠 Intuisi: dbt = Transformasi Punya Git</a></li>
          <li><a href="#lab3">🔬 Lab 3: Retry Aman vs Berbahaya</a></li>
          <li><a href="#case">📋 Mini-Case: Job Ganda, Angka Ganda</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan kenapa cron tidak cukup untuk pipeline produksi dan apa yang disediakan orkestrator (Airflow/Dagster).</li>
          <li>Membaca dan merancang DAG sederhana: task, dependensi, dan perilaku saat satu task gagal.</li>
          <li>Menjelaskan filosofi dbt (transformasi = kode SQL berversi + test) dan bedanya dengan ETL tool klasik.</li>
          <li>Menerapkan idempotency pada job dan merencanakan backfill yang aman.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Dashboard Pagi yang Kosong</h2>
      <div className="story">
        <p>Jam 7 pagi, direksi membuka dashboard — kosong. Investigasi: script Python di cron server mati jam 2 pagi karena disk penuh. Tidak ada yang tahu sampai pagi. Lebih parah: cron tetap jalan jam 3, 4, 5 — menumpuk error. Dan tidak ada yang tahu <em>urutan</em> script mana yang harus di-rerun dulu.</p>
        <p>Twist-nya: semua script-nya <em>benar</em>. Yang gagal adalah <strong>orkestrasinya</strong>: tidak ada yang tahu job gagal, tidak ada retry otomatis, tidak ada urutan dependensi, tidak ada yang bisa menjawab "data tanggal berapa yang belum diproses?" Inilah beda script vs pipeline produksi — dan alasan lowongan data engineer 2026 hampir selalu menulis "Airflow" atau "orkestrasi".</p>
      </div>

      <h2 id="orkestrasi">Orkestrasi — Konduktor Orkestra Data</h2>
      <p><strong>Definisi.</strong> Orkestrator = sistem yang <strong>menjadwalkan, mengurutkan, memantau, dan memulihkan</strong> pipeline data. Pemain utama: <strong>Apache Airflow</strong> (paling umum di lowongan), <strong>Dagster</strong> (modern, data-aware), <strong>Prefect</strong> (ringan).</p>
      <p><strong>Kepribadian:</strong> kalau pipeline adalah orkestra, script-task adalah pemain musiknya, dan orkestrator adalah <em>konduktor</em>: ia tahu siapa main kapan, mendengar siapa yang fals (gagal), mengulang bagian yang salah (retry), dan membunyikan alarm jika konser batal. Cron? Itu seperti menyuruh tiap pemain main sendiri sesuai jam dinding — tanpa mendengar satu sama lain.</p>
      <p><strong>Yang diberikan orkestrator dan tidak diberikan cron:</strong></p>
      <ul>
        <li><strong>Dependensi:</strong> "jangan jalan sebelum X sukses" (cron: tidak tahu).</li>
        <li><strong>Retry + alert:</strong> gagal → coba lagi 3× → kirim Slack/email jika tetap gagal.</li>
        <li><strong>Visibilitas:</strong> dashboard "pipeline tanggal berapa statusnya apa" — jawaban atas pertanyaan paling sering: <em>"datanya sudah masuk belum?"</em></li>
        <li><strong>Backfill:</strong> "proses ulang 1–15 Oktober" dalam sekali perintah.</li>
      </ul>

      <PlotlyChart
        data={cronData}
        title="Keterpantauan Pipeline: Cron vs Orkestrator (ilustratif)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "% pipeline terpantau" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi pipeline yang statusnya terpantau + punya alert.</p>
        <p><strong>Interpretasi:</strong> cron <em>bisa</em> dipasangi monitoring manual, tapi praktiknya jarang — makanya "dashboard kosong jam 7 pagi" adalah cerita klasik. Orkestrator membuat observability <strong>default</strong>, bukan tambahan. Inilah nilai yang dibayar perusahaan.</p>
      </div>

      <h2 id="dag">DAG — Partitur Musiknya</h2>
      <p><strong>Definisi.</strong> DAG = <strong>Directed Acyclic Graph</strong>: <em>directed</em> (ada arah: A → B), <em>acyclic</em> (tidak boleh melingkar: A → B → A dilarang — kalau tidak, tidak pernah selesai).</p>
      <p>Node = task (misal <code className="inline">bronze_transaksi</code>), edge = dependensi ("jalan setelah"). Aturan main: task jalan hanya jika <strong>semua</strong> dependensinya sukses. Jika satu gagal, downstream-nya <strong>tidak jalan</strong> (atau ikut ditandai gagal) — mencegah data setengah matang naik ke Gold (rasakan di Lab 2).</p>
      <p><strong>Anatomi task Airflow:</strong> <code className="inline">PythonOperator</code> (jalan fungsi Python), <code className="inline">BashOperator</code>, sensor (tunggu file/partisi datang), dengan <code className="inline">retries=3</code>, <code className="inline">retry_delay</code>, dan <code className="inline">on_failure_callback</code> (kirim alert). Jadwal: cron expression atau <code className="inline">@daily</code>.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> desain DAG dari <strong>data</strong>, bukan dari waktu. "Jalan jam 2 pagi" itu jadwal; "jalan setelah partisi tanggal X tiba" itu dependensi data (sensor). Pipeline yang bergantung jam = rapuh saat sumber telat. Pipeline yang bergantung data = tidur sampai data datang, lalu bekerja.</p>
      </div>

      <h2 id="dbt">dbt — Transformasi sebagai Kode</h2>
      <p><strong>Definisi.</strong> dbt (data build tool) = framework untuk <strong>transformasi ELT</strong>: kamu tulis <code className="inline">SELECT</code> biasa (+ Jinja templating), dbt yang mengurus urutan eksekusi (dari <code className="inline">ref()</code> antar model), dokumentasi otomatis, dan <strong>test</strong> (<code className="inline">unique</code>, <code className="inline">not_null</code>, custom).</p>
      <p><strong>Filosofi:</strong> "analytics engineering" — transformasi diperlakukan seperti software: <strong>version control (git)</strong>, code review, CI (test jalan tiap pull request), dan dokumentasi yang lahir dari kode. Model dbt tipikal:</p>
      <ul>
        <li><code className="inline">staging/</code> — cermin 1:1 sumber (bersih ringan).</li>
        <li><code className="inline">intermediate/</code> — logika bisnis (join, agregat).</li>
        <li><code className="inline">marts/</code> — tabel final siap dashboard (Gold-nya medallion, DM4).</li>
      </ul>
      <p><strong>Bedanya dengan ETL tool klasik</strong> (Informatica, SSIS): tool klasik = GUI drag-and-drop, logika terkunci di tool; dbt = teks SQL di git, bisa di-review, di-test, di-CI. Inilah kenapa dbt muncul di lowongan Indonesia 2026 (Glints: "Data Engineer Specialist … dbt").</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "dbt menggantikan Airflow."</strong></p>
        <p><strong>Yang benar:</strong> mereka lapisan berbeda. <strong>Airflow/Dagster</strong> = orkestrasi <em>antar sistem</em> (tarik dari API → load ke lake → trigger dbt → kirim alert). <strong>dbt</strong> = transformasi <em>di dalam</em> warehouse. Praktik umum: Airflow memanggil <code className="inline">dbt run</code> sebagai salah satu task. Bukan saingan — pasangan.</p>
      </div>

      <h2 id="idempoten">Idempotency — Aman Dijalankan 10 Kali</h2>
      <p><strong>Definisi.</strong> Job idempoten: dijalankan 1× atau 10× hasilnya <strong>sama</strong>. Rumusnya:</p>
      <Tex math={String.raw`f(f(x)) = f(x)`} block />
      <p><strong>Kenapa wajib:</strong> retry adalah fitur inti orkestrator — job <em>akan</em> dijalankan ulang (network glitch, timeout). Job tidak-idempoten (INSERT buta) + retry = data ganda (Lab 1, mini-case).</p>
      <p><strong>Pola implementasi:</strong></p>
      <ul>
        <li><strong>DELETE + INSERT</strong> per partisi tanggal: hapus dulu hasil tanggal X, lalu tulis ulang.</li>
        <li><strong>MERGE/UPSERT by key:</strong> <code className="inline">MERGE INTO gold USING silver ON tanggal=... WHEN MATCHED THEN UPDATE...</code> (didukung Delta/Iceberg — DM4).</li>
        <li><strong>INSERT OVERWRITE partition:</strong> tulis ulang partisi utuh.</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> idempotency membuat <strong>retry menjadi aman</strong>, dan retry yang aman membuat <strong>backfill menjadi mungkin</strong>. Tiga konsep ini satu paket. Saat interview ditanya "bagaimana menangani kegagalan pipeline?", jawaban yang diharapkan: idempotent job + retry + alert + backfill.</p>
      </div>

      <h2 id="backfill">Backfill & Retry — Mesin Waktu Pipeline</h2>
      <p><strong>Retry:</strong> kegagalan sesaat (network, API limit) → coba lagi otomatis dengan <em>backoff</em> (jeda membesar: 1 → 5 → 15 menit). Setelah N kali tetap gagal → <strong>alert manusia</strong>, jangan retry selamanya.</p>
      <p><strong>Backfill:</strong> "proses ulang rentang tanggal X–Y" — dibutuhkan saat: bug logika ditemukan (3 bulan data salah hitung!), sumber telat kirim, atau skema berubah. Syarat backfill aman: (1) job idempoten, (2) partisi per tanggal jelas, (3) kapasitas compute cukup (jangan backfill 90 hari di jam sibuk).</p>

      <PlotlyChart
        data={retryData}
        title="Dampak Retry Otomatis (ilustratif)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "% job butuh intervensi manual/bulan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi job yang akhirnya butuh manusia turun tangan.</p>
        <p><strong>Interpretasi:</strong> sebagian besar kegagalan pipeline bersifat <em>transien</em> (network, API) — retry 3× menyelesaikannya tanpa manusia. Tanpa retry, tiap glitch = pager jam 3 pagi. <strong>Tapi:</strong> retry tanpa idempotency = data ganda. Urutan membangun: idempoten dulu, baru retry.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Idempotency dalam Kode</h2>
      <p>Simulasikan retry dan buktikan: pola tulis yang benar membuat pengulangan tidak berbahaya.</p>
      <PyodideLab
        title="Lab 1 — f(f(x)) = f(x)"
        hint="Coba: ganti '=' jadi '+=' di job_idempoten. Idempotency langsung rusak — itulah bug paling umum di produksi."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: DAG Mini — Dependensi & Kegagalan</h2>
      <p>Bangun DAG medallion mini, lalu gagalkan satu task dan lihat efek domino-nya.</p>
      <PyodideLab
        title="Lab 2 — Scheduler 30 Baris"
        hint="Coba: buat dependensi melingkar (A→B→A). Apa yang terjadi? Itulah kenapa 'Acyclic' wajib."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan: Butuh Apa untuk Pipeline</h2>

      <div className="decision-card">
        <h3>1. Pipeline produksi multi-langkah → <strong>Orkestrator (Airflow/Dagster), bukan cron</strong></h3>
        <p><strong>Kondisi:</strong> ada dependensi, butuh tahu status, butuh retry/alert.</p>
        <p><strong>Kenapa:</strong> cron tidak tahu dependensi & tidak memberi visibilitas. "Dashboard kosong jam 7 pagi" adalah pajaknya.</p>
      </div>

      <div className="decision-card">
        <h3>2. Transformasi SQL di warehouse → <strong>dbt (dengan test + git)</strong></h3>
        <p><strong>Kondisi:</strong> logika bisnis di SQL, banyak model saling bergantung.</p>
        <p><strong>Kenapa:</strong> urutan otomatis dari ref(), test bawaan, dokumentasi dari kode, reviewable di git.</p>
      </div>

      <div className="decision-card">
        <h3>3. Job akan di-retry → <strong>wajib idempoten (DELETE+INSERT / MERGE / OVERWRITE)</strong></h3>
        <p><strong>Kondisi:</strong> selalu — karena retry pasti terjadi.</p>
        <p><strong>Kenapa:</strong> retry + INSERT buta = data ganda. Idempotency adalah prasyarat, bukan optimasi.</p>
      </div>

      <div className="decision-card">
        <h3>4. Data 3 bulan salah hitung → <strong>backfill per partisi tanggal</strong></h3>
        <p><strong>Kondisi:</strong> bug logika ditemukan belakangan.</p>
        <p><strong>Kenapa:</strong> hanya mungkin jika job idempoten + partisi jelas. Jadwalkan di jam sepi, pantau biaya (DM15).</p>
      </div>

      <div className="decision-card">
        <h3>5. Sumber sering telat → <strong>sensor/dependensi data, bukan jadwal jam</strong></h3>
        <p><strong>Kondisi:</strong> file/partisi datang tidak menentu.</p>
        <p><strong>Kenapa:</strong> pipeline berbasis waktu rapuh; berbasis data menunggu dengan sabar lalu bekerja.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Produksi = orkestrator.</strong> Cron hanya untuk mainan.</li>
          <li><strong>Idempoten dulu</strong>, baru nyalakan retry.</li>
          <li><strong>dbt untuk transformasi</strong> di warehouse; Airflow untuk orkestrasi antar sistem.</li>
          <li><strong>Setiap job:</strong> retry 3× + alert. Setiap DAG: bisa backfill per tanggal.</li>
        </ol>
      </div>

      <h2 id="worked">🔢 Worked Example Mendalam: DAG 6 Task, 1 Gagal — Berapa Lama Pulihnya?</h2>
      <p>Pipeline harian <strong>PT Maju Jaya</strong>: 6 task berantai dengan durasi (menit): extract(20) → clean(15) → dedup(10) → aggregate(25) → test(5) → publish(5). SLA: dashboard siap jam <strong>07.00</strong>. Jadwal mulai 04.00. Suatu hari task <code className="inline">aggregate</code> gagal di menit ke-20 (data anomali).</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Tanpa orkestrasi: berapa lama sadar &amp; pulih? (klik untuk buka)</summary>
        <p>Tanpa orkestrator: tidak ada alert otomatis. Analis sadar dashboard kosong jam <strong>08.30</strong> (saat dibuka). Engineer cek manual, menemukan log error jam 09.00, perbaiki &amp; jalankan ulang <em>seluruh</em> pipeline dari awal (tidak idempoten → takut setengah jalan):</p>
        <p><Tex math={String.raw`\text{waktu sadar} = 08.30 - 06.15 \text{ (waktu gagal)} = 135 \text{ menit}`} /></p>
        <p><Tex math={String.raw`\text{rerun penuh} = 20+15+10+25+5+5 = 80 \text{ menit}`} /></p>
        <p><Tex math={String.raw`\text{dashboard siap} \approx 09.00 + 80 \text{ mnt} = 10.20 \text{ (telat 200 menit dari SLA)}`} block /></p>
        <p>Telat 3 jam 20 menit — direksi sudah rapat dengan angka kemarin. Inilah "dashboard pagi yang kosong" di cerita: bukan datanya hilang, <em>rantainya</em> tidak terpantau.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Dengan orkestrasi + retry + idempotency</summary>
        <p>Alert otomatis 1 menit setelah gagal (06.16). Task <code className="inline">aggregate</code> idempoten → retry <strong>hanya task itu</strong> (bukan dari awal). Retry butuh 25 menit + 5 menit test + 5 menit publish:</p>
        <p><Tex math={String.raw`\text{pulih} = 06.16 + 25 + 5 + 5 = 06.56 \text{ (4 menit SEBELUM SLA)}`} block /></p>
        <p>Selisihnya: <strong>200 menit vs −4 menit</strong>. Orkestrasi tidak mempercepat task-nya (aggregate tetap 25 menit); ia mempercepat <em>deteksi</em> (135→1 menit) dan <em>pemulihan</em> (80→35 menit, karena rerun parsial). Nilai orkestrator = <strong>mengecilkan MTTD + MTTR</strong>, bukan mempercepat komputasi.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Idempotency dalam angka: kenapa "aman 10×" itu nyata</summary>
        <p>Model agregat <code className="inline">penjualan_harian</code> tanpa idempotency: tiap rerun <em>menambah</em> (append) 50.000 baris lagi. Setelah 3 rerun karena 2× gagal:</p>
        <p><Tex math={String.raw`\text{baris} = 50.000 \times 3 = 150.000 \quad (\text{seharusnya } 50.000)`} /></p>
        <p>Total penjualan terhitung <strong>3× lipat</strong> — mini-case "Job Ganda, Angka Ganda" persis ini. Dengan pola idempoten (<code className="inline">DELETE tanggal + INSERT</code> atau <code className="inline">MERGE</code>): rerun ke-10 pun hasilnya tetap 50.000 baris. Rumus mentalnya:</p>
        <p><Tex math={String.raw`f(f(x)) = f(x)`} /></p>
        <p>di mana <Tex math={String.raw`f`} /> = task pipeline. Jika persamaan ini tidak berlaku untuk task-mu, task itu <strong>belum siap produksi</strong> — karena di produksi, retry <em>pasti</em> terjadi (jaringan, OOM, spot instance dicabut).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Backfill: harga memperbaiki 30 hari ke belakang</summary>
        <p>Bug logika ditemukan: 30 hari agregat salah (diskon dihitung ganda). Backfill 30 hari × 25 menit/task = <strong>750 menit = 12,5 jam</strong> komputasi. Dengan orkestrator: 1 klik, paralel 4 worker → <Tex math={String.raw`750/4 \approx 188 \text{ menit} \approx 3 \text{ jam}`} />, terpantau, idempoten (aman diulang). Tanpa orkestrator: 30× jalankan manual, begadang, dan berdoa tidak salah tanggal — plus risiko double-count di hari yang ke-skip. <strong>Backfill = alasan bisnis kenapa pipeline harus idempoten sejak hari pertama.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> DAG dibaca mundur saat insiden: "publish gagal → test gagal? → aggregate gagal? → ..." — itulah kenapa lineage task (bukan cuma data) penting. Dan jadwalkan dengan <strong>sensor, bukan jam buta</strong>: task aggregate jalan <em>setelah extract sukses</em>, bukan "jam 5 pagi semoga extract sudah selesai". "Semoga" bukan strategi orkestrasi.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Sensor vs jadwal buta: hemat 2 jam idle per hari</summary>
        <p>Task aggregate dijadwalkan jam 05.00 "semoga extract selesai". Nyatanya extract selesai 03.00 — cluster idle 2 jam menunggu.</p>
        <p><Tex math={String.raw`2 \text{ jam} \times 10 \text{ worker} \times \text{Rp}20.000 = \text{Rp}400.000\text{/hari} = \text{Rp}12 \text{ jt/bulan}`} block /></p>
        <p>Dengan <strong>sensor</strong> (jalan <em>setelah</em> extract sukses, bukan jam 5 buta): idle → 0. <strong>"Semoga" bukan strategi orkestrasi</strong> — dan di cloud, "semoga" punya tagihan Rp12 juta/bulan.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: dbt = "Transformasi Punya Git"</h2>
      <p>Sebelum dbt, transformasi tinggal di: notebook analis A, script cron engineer B, Stored Procedure misterius C — tidak berversi, tidak bisa code review, tidak bisa test. dbt memindahkan transformasi ke <strong>praktik software engineering</strong>:</p>
      <ul>
        <li><strong>Model = SELECT statement berversi.</strong> Tiap model punya <em>kontrak implisit</em>: "input tabel X, output tabel Y". Perubahan = pull request = bisa di-review analis lain <em>sebelum</em> merusak dashboard. Ini code review untuk SQL — profesi analis naik kelas menjadi analytics engineering (DM16).</li>
        <li><strong>Test sebagai warga kelas satu.</strong> <code className="inline">unique</code>, <code className="inline">not_null</code>, <code className="inline">accepted_values</code>, <code className="inline">relationships</code> — ditulis di YAML, jalan tiap run. Bedanya dengan test DM7: test dbt <em>melekat pada model</em>, jadi dokumentasi hidup: "kolom ini dijamin unik" bukan janji mulut, tapi assertion yang dieksekusi.</li>
        <li><strong>Ref &amp; lineage otomatis.</strong> <code className="inline">ref('stg_transaksi')</code> bukan sekadar nama tabel — ia membangun <strong>graf dependensi</strong> yang dipakai untuk: urutan eksekusi, rerun parsial ("hanya yang downstream dari model yang berubah"), dan dokumentasi lineage otomatis (DM10). Satu sintaks, tiga fungsi.</li>
      </ul>
      <p><strong>Konteks dunia nyata:</strong> tim 15 analis tanpa dbt = 15 definisi "pendapatan" yang sedikit berbeda (DM10: glossary). Dengan dbt + satu model <code className="inline">mart_pendapatan</code> yang di-test: <strong>satu definisi, dipakai semua dashboard</strong> (DM14: semantic layer). Konflik "angka dashboard A beda dengan B" turun drastis — bukan karena orangnya lebih pintar, tapi karena arsitekturnya memaksa satu sumber kebenaran.</p>
      <p><strong>Intuisi orkestrator vs dbt (sering tertukar):</strong> dbt = <em>apa</em> yang dihitung (transformasi SQL); orkestrator (Airflow/dagster) = <em>kapan &amp; bagaimana</em> (jadwal, retry, alert, dependensi antar sistem). Analogi: dbt = resep masakan; Airflow = kepala dapur yang mengatur siapa masak apa jam berapa dan apa yang dilakukan kalau kompor mati. Butuh keduanya — resep tanpa dapur = tidak termasak; dapur tanpa resep = masak ngawur.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Retry otomatis selalu aman — tinggal nyalakan saja."</strong></p>
        <p><strong>Yang benar:</strong> retry hanya aman jika task <strong>idempoten</strong>. Retry task non-idempoten (append tanpa hapus dulu, kirim email, charge kartu kredit!) = menggandakan efek samping. Aturan keras: <strong>efek samping non-idempoten (kirim notifikasi, panggil API pembayaran) tidak boleh di dalam task yang auto-retry</strong> — pisahkan ke task khusus sekali-jalan, atau buat idempotency key di API-nya. Retry buta = doa yang dikabulkan dua kali.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: Retry Aman vs Berbahaya — Buktikan dengan Kode</h2>
      <p>Rasakan bedanya: task idempoten di-retry 5× hasilnya tetap benar; yang tidak, angkanya meledak.</p>
      <PyodideLab
        title="Lab 3 — Idempotency Under Fire"
        hint="Coba: naikkan GAGAL_KE menjadi 4 (gagal 4x sebelum sukses). Mana yang tetap benar? Itulah definisi 'aman di-retry'."
        defaultCode={`# Lab 3: retry 5x — idempoten vs tidak
GAGAL_KE = 2  # task gagal 2x pertama, sukses di percobaan ke-3

tgt_bersih = []   # target idempoten (delete+insert)
tgt_kotor = []    # target non-idempoten (append saja)
DATA = [("2026-10-12", "A", 100), ("2026-10-12", "B", 200)]

def task_idempoten(percobaan):
    if percobaan <= GAGAL_KE:
        raise RuntimeError("simulasi gagal (OOM)")
    # DELETE + INSERT = f(f(x)) == f(x)
    tgt_bersih[:] = [r for r in tgt_bersih if r[0] != "2026-10-12"]
    tgt_bersih.extend(DATA)

def task_tidak_idempoten(percobaan):
    if percobaan <= GAGAL_KE:
        raise RuntimeError("simulasi gagal (OOM)")
    tgt_kotor.extend(DATA)  # append buta!

for nama, task, tgt in [("idempoten", task_idempoten, tgt_bersih),
                        ("TIDAK idempoten", task_tidak_idempoten, tgt_kotor)]:
    for p in range(1, 6):
        try:
            task(p)
            print(f"[{nama}] percobaan {p}: SUKSES")
            break
        except RuntimeError:
            print(f"[{nama}] percobaan {p}: gagal -> retry...")
    total = sum(r[2] for r in tgt)
    print(f"   -> baris: {len(tgt)}, total tercatat: Rp{total} (seharusnya Rp300)")
    print()`}
      />

      <h2 id="case">📋 Mini-Case: Job Ganda, Angka Ganda</h2>
      <div className="callout">
        <p>Job <code className="inline">gold_penjualan_harian</code> memakai INSERT buta. Suatu malam network glitch: task sukses menulis tapi gagal melapor → Airflow me-retry → INSERT kedua jalan. Hasil: <strong>penjualan tanggal itu tercatat 2×</strong>. Dashboard direksi menunjukkan rekor penjualan — yang palsu. Butuh 2 hari untuk sadar dan perbaiki.</p>
        <p><strong>Pertanyaan:</strong> (a) Akar masalahnya di pola tulis apa? (b) Perbaikan kodenya? (c) Test dbt apa yang bisa menangkap ini lebih awal?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Job tidak idempoten</strong> (INSERT tanpa cek) + retry otomatis = kombinasi beracun.</p>
          <p>(b) <strong>DELETE + INSERT per tanggal</strong> (atau MERGE by tanggal). Retry ke-2 menghapus hasil retry ke-1 dulu — hasil akhir tetap benar.</p>
          <p>(c) Test <code className="inline">unique</code> pada kolom tanggal di model gold — duplikat langsung gagal di CI/test, sebelum naik ke dashboard. Inilah nilai "transformasi sebagai kode".</p>
        </details>
      </div>

      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal: MTTR dengan/tanpa orkestrasi, idempotency, dan backfill.</p>

      <details className="worked">
        <summary>Soal 1 — Pipeline 5 task (10+20+15+5+5=55 mnt), SLA 06.00, mulai 04.30. Task ke-3 gagal di menit ke-10. Tanpa orkestrasi: sadar 30 mnt kemudian, rerun penuh. Dengan orkestrasi: alert 1 mnt, retry hanya task 3 (15 mnt). Kapan dashboard siap di tiap skenario?</summary>
        <p>Tanpa: gagal 05.05 → sadar 05.35 → rerun 55 mnt → <strong>06.30 (telat 30 mnt)</strong>.</p>
        <p>Dengan: gagal 05.05 → alert 05.06 → retry 15 mnt → task 4,5 (10 mnt) → <strong>05.31 (aman 29 mnt)</strong>.</p>
        <p><Tex math={String.raw`\text{selisih} = 06.30 - 05.31 = 59 \text{ menit}`} block /></p>
        <p>Orkestrasi tidak mempercepat komputasi — ia memangkas <strong>waktu sadar + waktu pulih</strong>.</p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Idempotency: tabel harian 30.000 baris. Job gagal 3× lalu sukses (total 4 run). Tanpa idempotency (append), berapa baris tercatat? Dengan DELETE+INSERT?</summary>
        <p>Tanpa: <Tex math={String.raw`30.000 \times 4 = 120.000`} /> baris (<strong>4× lipat</strong> — angka ganda!).</p>
        <p>Dengan: <Tex math={String.raw`30.000`} /> baris — <Tex math={String.raw`f(f(x)) = f(x)`} />. <strong>Retry adalah kepastian; idempotency adalah kesiapannya.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Backfill: 14 hari perlu dihitung ulang, tiap hari 40 menit, 3 worker paralel. Berapa lama? Bandingkan dengan manual (1 orang, 8 jam/hari).</summary>
        <p>Orkestrator: <Tex math={String.raw`14 \times 40 / 3 \approx 187 \text{ menit} \approx 3{,}1 \text{ jam}`} />.</p>
        <p>Manual: <Tex math={String.raw`14 \times 40 = 560 \text{ menit} = 9{,}3 \text{ jam} > 1 \text{ hari kerja}`} /> — plus risiko salah tanggal &amp; tidak terpantau. <strong>Backfill = alasan bisnis idempotency sejak hari pertama.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa cron TIDAK cukup untuk pipeline produksi?"
        options={[
          "Karena cron lambat",
          "Karena cron tidak memahami dependensi antar job, tidak memberi visibilitas status, dan tidak punya retry/alert terstruktur",
          "Karena cron tidak bisa jalan tiap hari",
          "Karena cron mahal",
        ]}
        correct={1}
        explanation="Benar: cron hanya penjadwal waktu buta. Pipeline butuh orkestrasi: dependensi, observability, retry, backfill."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam DAG, task C bergantung pada A dan B. A gagal. Apa yang terjadi pada C?"
        options={[
          "C tetap jalan",
          "C tidak jalan (menunggu semua dependensi sukses) — mencegah data setengah matang",
          "C jalan setengah",
          "DAG otomatis memperbaiki A",
        ]}
        correct={1}
        explanation="Benar: aturan DAG — task jalan hanya jika SEMUA dependensi sukses. Ini yang mencegah data rusak naik ke Gold."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Job idempoten berarti…"
        options={[
          "Job yang cepat",
          "f(f(x)) = f(x) — dijalankan berulang hasilnya sama; prasyarat agar retry aman",
          "Job yang tidak pernah gagal",
          "Job tanpa kode",
        ]}
        correct={1}
        explanation="Benar: idempotency membuat retry tidak berbahaya. Polanya: DELETE+INSERT / MERGE / INSERT OVERWRITE per partisi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Peran dbt vs Airflow yang TEPAT adalah…"
        options={[
          "dbt menggantikan Airflow",
          "Airflow = orkestrasi antar sistem (jadwal, dependensi, alert); dbt = transformasi SQL di dalam warehouse — sering dipakai bersama",
          "Keduanya sama persis",
          "dbt hanya untuk database kecil",
        ]}
        correct={1}
        explanation="Benar: lapisan berbeda, bukan saingan. Praktik umum: task Airflow memanggil 'dbt run'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Data 3 bulan salah hitung karena bug logika. Solusi yang benar?"
        options={[
          "Biarkan saja, nanti juga lewat",
          "Backfill: proses ulang rentang tanggal itu — hanya aman jika job idempoten + partisi tanggal jelas",
          "Hapus semua data",
          "Tulis ulang manual di Excel",
        ]}
        correct={1}
        explanation="Benar: backfill adalah 'mesin waktu' pipeline. Prasyaratnya idempotency — tanpa itu, backfill justru menggandakan data."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Pipeline menunggu file sumber yang datangnya tidak menentu. Desain terbaik?"
        options={[
          "Jadwalkan jam 2 pagi dan berharap file sudah datang",
          "Sensor / dependensi data: task jalan saat partisi/file tiba, bukan berdasarkan jam",
          "Cek manual tiap pagi",
          "Jalankan tiap 5 menit selamanya",
        ]}
        correct={1}
        explanation="Benar: desain dari data, bukan dari waktu. Pipeline berbasis jam rapuh saat sumber telat."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Orkestrator</strong> (Airflow/Dagster): jadwal + dependensi + retry + alert + visibilitas + backfill. Cron tidak cukup untuk produksi.</li>
          <li><strong>DAG:</strong> directed, acyclic; task jalan hanya jika semua dependensi sukses.</li>
          <li><strong>dbt:</strong> transformasi SQL sebagai kode — git, test, dokumentasi otomatis; dipanggil dari orkestrator.</li>
          <li><strong>Idempotency</strong> f(f(x))=f(x): prasyarat retry & backfill yang aman (DELETE+INSERT / MERGE / OVERWRITE).</li>
          <li><strong>Retry</strong> untuk gagal transien (dengan backoff + batas); <strong>backfill</strong> untuk perbaiki masa lalu.</li>
          <li><strong>Jangan:</strong> INSERT buta + retry; desain pipeline dari jam bukan dari data.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/dm4-data-warehouse" className="btn btn-secondary btn-sm">← DM4</Link>
        <Link href="/learn/dm6-batch-streaming" className="btn btn-primary btn-sm">Next: DM6 →</Link>
      </div>
    </div>
  );
}
