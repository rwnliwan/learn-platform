"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function DM1Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const volumeData = [
    {
      x: ["2015", "2017", "2019", "2021", "2023", "2025"],
      y: [15, 26, 41, 64, 97, 181],
      type: "bar",
      marker: { color: "#2a7de1" },
      text: ["15 ZB", "26 ZB", "41 ZB", "64 ZB", "97 ZB", "181 ZB"],
      textposition: "outside",
    },
  ];

  const typeData = [
    {
      x: ["Terstruktur", "Semi-terstruktur", "Tidak terstruktur"],
      y: [10, 20, 70],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#ef4444"] },
      text: ["10%", "20%", "70%"],
      textposition: "outside",
    },
  ];

  const costData = [
    {
      x: ["Generate", "Store", "Process", "Analyze", "Archive/Delete"],
      y: [5, 35, 25, 15, 20],
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Simulasi: data mentah -> informasi (langkah DIKW)
import json
from collections import Counter

# DATA: log transaksi mentah (JSON semi-terstruktur) — seperti keluar dari aplikasi
raw_logs = [
    '{"ts":"2026-10-01 09:01","nasabah":"N001","tipe":"debit","nominal":500000}',
    '{"ts":"2026-10-01 09:02","nasabah":"N002","tipe":"kredit","nominal":1200000}',
    '{"ts":"2026-10-01 09:03","nasabah":"N001","tipe":"debit","nominal":250000}',
    '{"ts":"2026-10-01 09:04","nasabah":"N003","tipe":"kredit","nominal":3000000}',
    '{"ts":"2026-10-01 09:05","nasabah":"N002","tipe":"debit","nominal":100000}',
]

# INFORMATION: parse -> agregat per nasabah
tx = [json.loads(r) for r in raw_logs]
saldo = Counter()
for t in tx:
    saldo[t["nasabah"]] += t["nominal"] if t["tipe"] == "kredit" else -t["nominal"]

print("DATA      : 5 baris log JSON mentah")
print("INFORMATION: saldo bersih per nasabah")
for n, s in saldo.items():
    print(f"  {n}: Rp{s:,}".replace(",", "."))

# KNOWLEDGE: aturan bisnis -> siapa yang perlu dihubungi?
print()
print("KNOWLEDGE: nasabah bersaldo negatif perlu follow-up")
for n, s in saldo.items():
    if s < 0:
        print(f"  -> Hubungi {n} (saldo Rp{s:,})".replace(",", "."))

print()
print("WISDOM    : ubah 'hubungi manual' jadi kebijakan limit otomatis.")
print("Coba: tambah satu log debit 5jt untuk N002, lalu jalankan ulang.")`;

  const lab2Code = `# Kalkulator: biaya simpan vs retensi (langkah lifecycle Store/Archive)
# Harga ilustratif object storage: $0.023/GB/bulan (hot), $0.004/GB/bulan (archive)

def biaya(volume_tb, retensi_bulan, harga_gb=0.023):
    gb = volume_tb * 1024
    return gb * harga_gb * retensi_bulan

volume = 50        # TB data transaksi
print(f"Volume data        : {volume} TB")
print(f"Retensi 12 bulan (hot)   : \${biaya(volume, 12):,.0f}")
print(f"Retensi 60 bulan (hot)   : \${biaya(volume, 60):,.0f}")
print(f"Retensi 60 bulan (archive): \${biaya(volume, 60, 0.004):,.0f}")
print()
print("Selisih strategi retensi 5 tahun: "
      f"\${biaya(volume,60)-biaya(volume,60,0.004):,.0f} — itulah harga 'simpan semua selamanya'.")
print()
print("Coba: ubah volume ke 200 TB dan bandingkan lagi.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">DM1 — Data Management</span>
        <h1 className="display-title">Siklus Hidup Data:<br />Dari Log Mentah ke Keputusan Direksi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 181 Zettabyte, 0 Keputusan</a></li>
          <li><a href="#lifecycle">Siklus Hidup Data — Si Petualang 5 Tahap</a></li>
          <li><a href="#dikw">DIKW — Piramida yang Sering Dibaca Terbalik</a></li>
          <li><a href="#jenis">Tiga Jenis Data: Rapi, Setengah Rapi, Kacau</a></li>
          <li><a href="#oltp">OLTP vs OLAP — Si Kasir dan Si Analis</a></li>
          <li><a href="#peran">Peran di Sekitar Data</a></li>
          <li><a href="#lab1">🔬 Lab 1: Dari Log Mentah ke Knowledge</a></li>
          <li><a href="#lab2">🔬 Lab 2: Harga "Simpan Semua Selamanya"</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Sistem Seperti Apa yang Kamu Butuhkan?</a></li>
          <li><a href="#worked">🔢 Worked Example: 2,4 Juta Event → 1 Keputusan</a></li>
          <li><a href="#intuisi">🧠 Intuisi Mendalam: Lifecycle Itu Loop</a></li>
          <li><a href="#lab3">🔬 Lab 3: DIKW dalam 30 Baris</a></li>
          <li><a href="#case">📋 Mini-Case: Laporan Direksi yang Salah Tanggal</a></li>
          <li><a href="#latihan">✍️ Latihan Terpandu</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 5 tahap siklus hidup data dan keputusan apa yang diambil di tiap tahap (simpan berapa lama? arsipkan kapan? hapus kapan?).</li>
          <li>Membedakan Data → Information → Knowledge → Wisdom dengan contoh konkret dari dunia perbankan.</li>
          <li>Mengklasifikasikan data ke terstruktur / semi-terstruktur / tidak terstruktur beserta cara menyimpannya.</li>
          <li>Memutuskan kapan memakai sistem OLTP vs OLAP — dan menjelaskan kenapa mencampurnya berisiko.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 181 Zettabyte, 0 Keputusan</h2>
      <div className="story">
        <p>Estimasi global: pada 2025 dunia menghasilkan <strong>181 zettabyte</strong> data per tahun — naik 12× lipat dari 2015. Sebuah bank menengah menyimpan <em>semuanya</em>: setiap klik aplikasi, setiap log server, setiap scan KTP, sejak 2012. Tagihan storage: ratusan ribu dolar per tahun.</p>
        <p>Lalu direksi bertanya satu hal sederhana: <em>"Berapa nasabah aktif kita bulan lalu?"</em> Tim data butuh <strong>3 minggu</strong> menjawab — karena tidak ada yang tahu tabel mana yang benar, definisi "aktif" berbeda di tiap tim, dan data 2012–2018 ternyata tidak bisa dibuka lagi (formatnya sudah mati).</p>
        <p>Twist-nya: masalah bank itu <strong>bukan kekurangan data</strong>. Mereka tenggelam dalam data yang tidak dikelola. Data management adalah disiplin yang menjawab: data apa yang disimpan, di mana, berapa lama, oleh siapa, dan untuk keputusan apa. Tanpa itu, 181 zettabyte = 0 keputusan.</p>
      </div>

      <PlotlyChart
        data={volumeData}
        title="Ledakan Volume Data Global (zettabyte/tahun)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Zettabyte" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = tahun, tinggi batang = volume data yang dihasilkan dunia per tahun (zettabyte; 1 ZB ≈ 1 triliun gigabyte).</p>
        <p><strong>Interpretasi:</strong> volume tumbuh eksponensial — 12× dalam 10 tahun. Artinya biaya penyimpanan dan kompleksitas pengelolaan ikut meledak. Organisasi yang tidak punya strategi lifecycle akan membayar mahal untuk menyimpan data yang tidak pernah dipakai. <strong>Pelajaran:</strong> data management bukan soal "simpan semua", tapi "kelola dengan sadar".</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="lifecycle">Siklus Hidup Data — Si Petualang 5 Tahap</h2>
      <p><strong>Definisi.</strong> Siklus hidup data (data lifecycle) adalah perjalanan data dari lahir sampai pensiun: <strong>Generate → Store → Process → Analyze → Archive/Delete</strong>.</p>
      <p><strong>Kepribadian tiap tahap:</strong> data itu seperti karyawan — lahir di operasional (generate), disimpan di gudang (store), dilatih (process), bekerja menghasilkan keputusan (analyze), lalu pensiun (archive) atau dipecat (delete). Perusahaan yang baik punya "HR" untuk data: itulah data management.</p>
      <ul>
        <li><strong>Generate (lahir):</strong> data tercipta — transaksi nasabah, klik aplikasi, sensor. Pertanyaan: data apa yang <em>perlu</em> ditangkap? Menangkap semua = mahal.</li>
        <li><strong>Store (disimpan):</strong> pilih tempat: database operasional, data lake, arsip. Pertanyaan: di mana, dengan keamanan apa?</li>
        <li><strong>Process (diolah):</strong> dibersihkan, digabung, ditransformasi (ETL/ELT — detail di DM4/DM5). Pertanyaan: siapa yang bertanggung jawab atas kualitasnya?</li>
        <li><strong>Analyze (bekerja):</strong> dipakai analis, dashboard, model ML. Inilah tahap data "menghasilkan uang".</li>
        <li><strong>Archive/Delete (pensiun):</strong> data tua dipindah ke storage murah atau dihapus sesuai regulasi. Pertanyaan: retensi berapa tahun? Kapan wajib hapus (misal UU PDP)?</li>
      </ul>

      <PlotlyChart
        data={costData}
        title="Distribusi Biaya per Tahap Lifecycle (ilustratif)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "% dari total biaya data" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi biaya pengelolaan data di tiap tahap lifecycle.</p>
        <p><strong>Interpretasi:</strong> kejutan bagi pemula — tahap <strong>Store</strong> (35%) dan <strong>Process</strong> (25%) memakan biaya terbesar, bukan Analyze. Artinya: keputusan arsitektur (di mana simpan, bagaimana olah) menentukan 60% tagihan. Inilah kenapa DM4 (warehouse/lakehouse) dan DM15 (biaya cloud) penting: salah pilih arsitektur = bayar mahal tiap bulan selamanya.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data yang disimpan = aset. Makin banyak disimpan, makin kaya."</strong></p>
        <p><strong>Yang benar:</strong> data yang disimpan tapi tidak bisa ditemukan, tidak dipercaya, atau tidak boleh dipakai (masalah privasi) adalah <strong>liabilitas</strong> — ia memakan biaya storage, menambah risiko kebocoran, dan memperlambat pencarian. Aset hanya data yang <em>terkelola</em>: diketahui keberadaannya, jelas pemiliknya, terjaga kualitasnya.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> setiap keputusan lifecycle adalah keputusan <strong>biaya vs nilai</strong>. "Simpan 10 tahun" bukan jawaban default — tanyakan: regulasi mewajibkan berapa tahun? (UU PDP, OJK), dan siapa yang akan memakai data umur 9 tahun? Kalau jawabannya "tidak ada", arsipkan atau hapus.</p>
      </div>

      <h2 id="dikw">DIKW — Piramida yang Sering Dibaca Terbalik</h2>
      <p><strong>Definisi.</strong> DIKW = <strong>Data → Information → Knowledge → Wisdom</strong>. Hierarki nilai: data mentah di bawah, kebijaksanaan di puncak.</p>
      <ul>
        <li><strong>Data:</strong> fakta mentah tanpa konteks. <em>"N001, debit, 500000"</em> — belum berarti apa-apa.</li>
        <li><strong>Information:</strong> data + konteks/struktur. <em>"Saldo N001 bulan ini turun Rp750 ribu"</em> — sekarang ada artinya.</li>
        <li><strong>Knowledge:</strong> informasi + pola/aturan. <em>"Nasabah yang saldonya turun 3 bulan berturut-turut 4× lebih mungkin menunggak"</em> — bisa ditindaklanjuti.</li>
        <li><strong>Wisdom:</strong> pengetahuan + pengalaman/penilaian. <em>"Jangan kejar nasabah turun-saldo dengan denda; tawarkan restrukturisasi — retensinya lebih tinggi"</em> — keputusan bijak.</li>
      </ul>
      <p><strong>Kepribadian:</strong> DIKW itu seperti mengolah kakao: biji mentah (data) → bubuk (information) → resep (knowledge) → kue yang enak dan tahu kapan menyajikannya (wisdom). Nilai naik di tiap tahap — tapi begitu juga <em>usaha manusianya</em>. Inilah kenapa "punya data" ≠ "punya insight".</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Semakin ke atas piramida, semakin otomatis bisa dibuat mesin."</strong></p>
        <p><strong>Yang benar:</strong> justru sebaliknya untuk tahap puncak. Data → Information mudah diotomasi (query, dashboard). Information → Knowledge butuh analisis. Knowledge → Wisdom <strong>tidak bisa diotomasi penuh</strong> — butuh judgment manusia, konteks bisnis, dan pengalaman. AI membantu, tapi keputusan akhirnya tetap manusia (apalagi di risiko & regulasi).</p>
      </div>

      <h2 id="jenis">Tiga Jenis Data: Rapi, Setengah Rapi, Kacau</h2>
      <p><strong>Terstruktur</strong> — punya skema kaku: baris & kolom. Contoh: tabel transaksi (nasabah_id, nominal, tanggal). Disimpan di database relasional. Mudah di-query dengan SQL. <em>Kepribadian: si kutu buku — rapi, bisa ditebak, paling gampang diajak kerja sama.</em></p>
      <p><strong>Semi-terstruktur</strong> — punya struktur tapi fleksibel: JSON, XML, log. Contoh: respons API, event tracking aplikasi. Field bisa beda-beda antar record. <em>Kepribadian: si seniman — punya pola, tapi suka improvisasi; butuh parsing sebelum bisa dianalisis.</em></p>
      <p><strong>Tidak terstruktur</strong> — tidak punya skema: teks bebas, gambar, video, audio. Contoh: scan KTP, rekaman call center, email keluhan. Butuh ML/NLP untuk diekstrak maknanya. <em>Kepribadian: si liar — paling banyak jumlahnya, paling susah dijinakkan, tapi menyimpan insight terdalam.</em></p>

      <PlotlyChart
        data={typeData}
        title="Komposisi Data Perusahaan (estimasi industri)"
        layout={{ xaxis: { title: "Jenis data" }, yaxis: { title: "% volume" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = porsi volume data perusahaan per jenis.</p>
        <p><strong>Interpretasi:</strong> hanya ~10% data perusahaan yang terstruktur rapi — 90% sisanya semi/tidak terstruktur. Padahal kebanyakan analis hanya nyaman dengan yang 10%. <strong>Pelajaran karir:</strong> kemampuan mengolah JSON log dan teks tidak terstruktur (DM4, DM6) adalah pembeda besar di pasar kerja.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> "semi-terstruktur" bukan versi gagal dari terstruktur — ia <em>desain yang disengaja</em> untuk data yang skemanya berubah cepat (event aplikasi, API). Jangan paksa semua data jadi tabel kaku; pilih penyimpanan sesuai sifat datanya (DM3).</p>
      </div>

      <h2 id="oltp">OLTP vs OLAP — Si Kasir dan Si Analis</h2>
      <p><strong>Definisi.</strong> Dua pola beban kerja database yang <em>bertolak belakang</em>:</p>
      <ul>
        <li><strong>OLTP (Online Transaction Processing):</strong> banyak transaksi kecil, cepat, real-time. <em>Si kasir</em> — melayani satu pelanggan dalam milidetik: "transfer Rp500 ribu sekarang". Contoh: core banking, aplikasi e-commerce. Pola: banyak INSERT/UPDATE, sedikit baris per query, butuh konsistensi kuat.</li>
        <li><strong>OLAP (Online Analytical Processing):</strong> sedikit query besar yang memindai jutaan baris. <em>Si analis</em> — "berapa total transaksi per cabang bulan ini?". Contoh: data warehouse, dashboard direksi. Pola: query agregasi berat, baca historis, toleran jeda (data kemarin pun oke).</li>
      </ul>
      <p><strong>Kenapa tidak bisa dicampur?</strong> Query OLAP yang memindai 100 juta baris akan <em>mengunci</em> tabel dan membuat transaksi OLTP (transfer nasabah!) melambat atau gagal. Itu sebabnya arsitekturnya dipisah: OLTP di database operasional → data direplikasi ke OLAP (warehouse) untuk analisis.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Satu database kuat bisa melayani aplikasi sekaligus dashboard direksi."</strong></p>
        <p><strong>Yang benar:</strong> secara teknis bisa, secara operasional berbahaya. Pola aksesnya berlawanan (cepat-kecil vs lambat-besar). Praktik industri: <strong>pisahkan</strong> — database operasional untuk transaksi, warehouse terpisah untuk analitik, dihubungkan pipeline (DM4/DM5). Pengecualian modern: HTAP (hybrid), tapi itu topik lanjutan.</p>
      </div>

      <h2 id="peran">Peran di Sekitar Data</h2>
      <p>Data tidak mengelola dirinya sendiri. Peran kuncinya:</p>
      <ul>
        <li><strong>Data Engineer:</strong> membangun pipa & penyimpanan (generate → store → process).</li>
        <li><strong>Data Analyst / Scientist:</strong> mengubah jadi insight & model (analyze).</li>
        <li><strong>Data Owner:</strong> pemilik bisnis yang bertanggung jawab atas satu domain data (misal Head of Retail Banking = owner data nasabah). Punya wewenang <em>keputusan</em>.</li>
        <li><strong>Data Steward:</strong> tangan kanan owner — menjaga definisi, kualitas, dan dokumentasi sehari-hari. Tidak punya wewenang akhir, tapi tahu detailnya.</li>
        <li><strong>Data Consumer:</strong> semua yang memakai data — analis, direksi, regulator, bahkan nasabah.</li>
      </ul>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> owner vs steward sering tertukar. Ingat: <strong>owner = akuntabilitas</strong> (disalahkan kalau data berantakan), <strong>steward = tanggung jawab operasional</strong> (yang mengerjakan). Setiap dataset butuh keduanya tertulis — data tanpa owner = data yatim piatu yang tidak ada yang merawat.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Dari Log Mentah ke Knowledge</h2>
      <p>Rasakan sendiri tangga DIKW: log JSON mentah → agregat (information) → aturan bisnis (knowledge). Ubah datanya, jalankan ulang.</p>
      <PyodideLab
        title="Lab 1 — Tangga DIKW dalam Kode"
        hint="Coba: tambah satu log debit besar untuk N002. Pada titik berapa 'knowledge' berubah? Itulah bedanya data vs insight."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Harga "Simpan Semua Selamanya"</h2>
      <p>Hitung sendiri biaya retensi — argumen paling ampuh saat ada yang bilang "simpan saja semua".</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Biaya Retensi"
        hint="Coba: 50 TB → 200 TB, retensi 12 → 60 bulan, hot vs archive. Angka inilah yang dibayar tiap bulan."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Sistem Seperti Apa yang Kamu Butuhkan?</h2>

      <div className="decision-card">
        <h3>1. Aplikasi butuh catat transaksi real-time (transfer, checkout) → <strong>OLTP</strong></h3>
        <p><strong>Kondisi:</strong> ribuan transaksi kecil per detik, harus konsisten & cepat, data = kondisi <em>saat ini</em>.</p>
        <p><strong>Kenapa:</strong> OLTP dioptimasi untuk tulis cepat + integritas transaksi (ACID — detail DM3). Query analitik berat dilarang masuk ke sini.</p>
        <p><strong>Contoh nyata:</strong> core banking bank, database order e-commerce.</p>
      </div>

      <div className="decision-card">
        <h3>2. Direksi butuh tren 5 tahun per cabang → <strong>OLAP (warehouse)</strong></h3>
        <p><strong>Kondisi:</strong> query memindai jutaan baris historis, boleh pakai data kemarin (tidak harus real-time).</p>
        <p><strong>Kenapa:</strong> OLAP dioptimasi untuk baca agregasi masif; tidak mengganggu transaksi operasional.</p>
        <p><strong>Contoh nyata:</strong> dashboard KPI direksi, laporan regulasi OJK.</p>
      </div>

      <div className="decision-card">
        <h3>3. Data berupa event aplikasi yang skemanya sering berubah → <strong>format semi-terstruktur (JSON) + lake</strong></h3>
        <p><strong>Kondisi:</strong> field baru muncul tiap sprint; tidak realistis alter tabel tiap minggu.</p>
        <p><strong>Kenapa:</strong> JSON menampung variasi tanpa migrasi skema; lake menyimpan mentahnya murah (detail DM4).</p>
        <p><strong>Contoh nyata:</strong> event tracking aplikasi mobile banking.</p>
      </div>

      <div className="decision-card">
        <h3>4. Dokumen scan KTP & rekaman call center → <strong>object storage + ekstraksi ML</strong></h3>
        <p><strong>Kondisi:</strong> data tidak terstruktur, volume besar, butuh OCR/NLP untuk jadi insight.</p>
        <p><strong>Kenapa:</strong> jangan paksa masuk database relasional — simpan file-nya murah, ekstrak metadata terstruktur-nya terpisah.</p>
        <p><strong>Contoh nyata:</strong> e-KYC, analisis sentimen keluhan.</p>
      </div>

      <div className="decision-card">
        <h3>5. Regulasi mewajibkan data dihapus setelah X tahun → <strong>kebijakan retensi + archive/delete otomatis</strong></h3>
        <p><strong>Kondisi:</strong> UU PDP / OJK mengatur masa simpan; menyimpan lebih lama = risiko hukum.</p>
        <p><strong>Kenapa:</strong> lifecycle bukan sekadar teknis — tahap Archive/Delete adalah kewajiban compliance (detail DM9, DM12).</p>
        <p><strong>Contoh nyata:</strong> data nasabah yang menutup rekening wajib dihapus setelah masa retensi.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Transaksi real-time?</strong> → OLTP. <strong>Analisis historis?</strong> → OLAP. Jangan campur.</li>
          <li><strong>Skema kaku?</strong> → tabel. <strong>Skema berubah-ubah?</strong> → JSON/lake. <strong>File?</strong> → object storage.</li>
          <li><strong>Setiap dataset wajib punya:</strong> owner + masa retensi. Tidak ada = liabilitas.</li>
          <li><strong>Data ≠ insight.</strong> Tanyakan selalu: "ini sudah di tahap DIKW yang mana?"</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="worked">🔢 Worked Example Mendalam: 2,4 Juta Event → 1 Keputusan Direksi</h2>
      <p>Ikuti satu hari data sebuah e-commerce fiktif, <strong>PT Maju Jaya</strong>, dari lahir sampai menjadi keputusan. Semua angka di bawah konsisten satu sama lain — cek hitungannya.</p>

      <details className="worked">
        <summary>📐 Langkah 1 — Generate: berapa data lahir dalam sehari? (klik untuk buka)</summary>
        <p>Asumsi: 120.000 pengunjung harian, tiap pengunjung memicu rata-rata <strong>20 event</strong> (page view, klik, add-to-cart, dsb.). Ukuran rata-rata 1 event JSON = <strong>0,9 KB</strong>.</p>
        <p><Tex math={String.raw`\text{event/hari} = 120.000 \times 20 = 2.400.000`} block /></p>
        <p><Tex math={String.raw`\text{volume/hari} = 2.400.000 \times 0{,}9 \text{ KB} \approx 2{,}16 \text{ GB}`} block /></p>
        <p>Di mana <Tex math={String.raw`0{,}9`} /> = KB per event (rata-rata terukur dari sampel 10.000 event), dan <Tex math={String.raw`2{,}16 \text{ GB`} /> = data mentah <em>sebelum</em> kompresi. Dengan kompresi Snappy (±60% lebih kecil), yang benar-benar ditulis ke storage ≈ <strong>0,86 GB/hari</strong>. Pelajaran: angka "mentah" dan "tersimpan" beda — arsitek yang lupa faktor kompresi salah hitung biaya 2,5×.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 2 — Ingest &amp; Store: sanggupkah pipa menampungnya?</summary>
        <p>Event tersebar di jam sibuk: 40% event terjadi dalam 4 jam puncak (19.00–23.00).</p>
        <p><Tex math={String.raw`\text{throughput puncak} = \frac{2.400.000 \times 0{,}4}{4 \times 3.600} \approx 67 \text{ event/detik}`} block /></p>
        <p>67 event/detik = beban <em>ringan</em> untuk Kafka (satu broker sanggup puluhan ribu/detik). Kesimpulan ingest: <strong>tidak perlu cluster raksasa</strong> — satu topik, 3 partisi, cukup. Ini intuisi penting: ukur dulu, baru belanja infrastruktur.</p>
        <p>Retensi 90 hari di object storage: <Tex math={String.raw`90 \times 0{,}86 \text{ GB} \approx 77 \text{ GB}`} />. Dengan tarif ±Rp300/GB/bulan, biaya simpan mentah ≈ <strong>Rp23.100/bulan</strong> — receh. <em>Tapi</em> ini baru 1 sumber; 40 sumber × replikasi × backup = ratusan GB yang di Lab 2 kamu hitung sendiri biayanya.</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 3 — Process: 2,4 juta baris menjadi 24 baris</summary>
        <p>Job agregasi malam hari mereduksi event menjadi <strong>ringkasan per jam per kategori</strong> (24 jam × 30 kategori = 720 baris), lalu diringkas lagi menjadi <strong>24 baris KPI harian</strong> untuk dashboard direksi.</p>
        <p><Tex math={String.raw`\text{rasio reduksi} = \frac{2.400.000 \text{ event}}{24 \text{ baris KPI}} = 100.000 : 1`} block /></p>
        <p>Artinya: <strong>99,999% data mentah "hilang"</strong> dari pandangan direksi — dan itu <em>benar</em>. Nilai data bukan di volumenya, tapi di ringkasan yang bisa diaksi. Inilah jantung DIKW: Data (2,4 jt event) → Information (720 baris agregat) → Knowledge ("kategori elektronik turun 18% tiap Selasa") → Wisdom (keputusan).</p>
      </details>

      <details className="worked">
        <summary>📐 Langkah 4 — Consume: kapan data membayar dirinya sendiri?</summary>
        <p>Knowledge "kategori elektronik turun 18% tiap Selasa" memicu investigasi: ternyata kompetitor pasang diskon tiap Selasa. Keputusan: geser promo sendiri ke Senin malam. Hasil 30 hari: pendapatan kategori naik <strong>Rp180 juta/bulan</strong>.</p>
        <p><Tex math={String.raw`\text{ROI 1 keputusan} = \frac{\text{Rp}180 \text{ jt} - \text{Rp}23{,}1 \text{ rb (biaya data)}}{\text{Rp}23{,}1 \text{ rb}} \approx 7.792\times`} block /></p>
        <p>Angka 7.792× terlihat absurd — memang, karena biaya <em>infrastruktur</em> data receh dibanding nilai <em>satu</em> keputusan bagus. Inilah kenapa cerita pembuka lesson ini "181 zettabyte, 0 keputusan" begitu tragis: biaya sudah dibayar (storage, pipeline, gaji), tapi tahap Consume tidak pernah terjadi. <strong>Lifecycle yang berhenti di Store = uang dibakar.</strong></p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> baca lifecycle dari <em>kanan ke kiri</em>. Tanyakan dulu "keputusan apa yang harus diambil?", baru rancang agregatnya, baru tentukan event apa yang dikumpulkan. Tim yang merancang dari kiri ke kanan (kumpulkan semua, pikir nanti) berakhir dengan data swamp — danau data yang tidak ada yang berani minum.</p>
      </div>

      <details className="worked">
        <summary>📐 Langkah 5 — Dark data: berapa yang tidak pernah dipakai?</summary>
        <p>Perusahaan menyimpan <strong>10 PB</strong>; audit pemakaian (query log 90 hari) menunjukkan hanya <strong>500 TB</strong> pernah dibaca.</p>
        <p><Tex math={String.raw`\text{terpakai} = \frac{0{,}5}{10} = 5\% \;\Rightarrow\; 95\% \text{ dark data}`} block /></p>
        <p>9,5 PB × Rp300/GB/bulan = <strong>Rp2,85 miliar/bulan</strong> untuk data yang tidak dibaca siapa pun — plus risiko bocor (DM12) atas data tak dikenal. <strong>Aturan:</strong> tiap dataset tanpa akses 180 hari → otomatis turun tier + notifikasi pemilik; tanpa pemilik → kandidat hapus. Lifecycle yang sehat <em>mengecilkan</em>, bukan hanya menumbuhkan.</p>
      </details>

      <h2 id="intuisi">🧠 Intuisi Mendalam: Lifecycle Itu Loop, Bukan Garis Lurus</h2>
      <p>Diagram lifecycle biasanya digambar sebagai panah lurus: Generate → Ingest → Store → Process → Consume. Gambar itu <strong>bohong dengan sopan</strong>. Kenyataannya ada tiga panah balik yang justru menentukan hidup-matinya sistem:</p>
      <ul>
        <li><strong>Consume → Generate (umpan balik keputusan):</strong> keputusan "geser promo ke Senin" menciptakan <em>event baru</em> yang harus di-track (apakah promo Senin berhasil?). Setiap keputusan yang baik melahirkan kebutuhan data baru. Siklus yang sehat berputar makin cepat; siklus yang mati berhenti di dashboard yang tidak dibuka siapa pun.</li>
        <li><strong>Process → Ingest (koreksi kualitas):</strong> job agregasi menemukan 12% event tanpa <code className="inline">user_id</code> (DM7: kelengkapan 88%). Panah baliknya: perbaiki SDK di aplikasi (hulu!), bukan tambal di pipeline. Tanpa panah balik ini, tim data membersihkan sampah yang sama setiap hari selamanya.</li>
        <li><strong>Store → Generate (retensi &amp; hak hapus):</strong> UU PDP (DM12) mewajibkan data pribadi dihapus setelah tujuannya selesai. Panah balik ini = kebijakan retensi: data tidak hanya mengalir maju, ia juga harus <em>mati</em> tepat waktu. Perusahaan yang lupa panah ini menumpuk liabilitas hukum di storage-nya.</li>
      </ul>
      <p><strong>Intuisi OLTP vs OLAP yang jarang dijelaskan:</strong> kenapa "satu database untuk semua" gagal? Hitung kasarnya: 1 query analitik ("total penjualan per kategori tahun ini") memindai <strong>10 juta baris</strong> dan menahannya ~8 detik. Di saat yang sama 200 kasir menunggu lock tabel yang sama — tiap transaksi kasir telat 8 detik × 200 kasir = <strong>1.600 detik-waktu kasir hilang per query</strong>. Itulah kenapa OLAP dipisah: bukan soal gengsi arsitektur, tapi aritmetika antrean. Analis dan kasir berebut kunci yang sama = keduanya kalah.</p>
      <p><strong>Intuisi peran:</strong> data engineer membangun <em>pipa</em>, analis membaca <em>airnya</em>, data steward menjaga <em>kualitas airnya</em>, pemilik data memutuskan <em>siapa boleh minum</em>. Kegagalan klasik: menyuruh analis membangun pipa (pipeline rapuh), atau menyuruh engineer menafsir air (insight tanpa konteks bisnis). Organisasi data yang sehat = setiap peran tahu di tahap lifecycle mana ia tinggal.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Makin banyak data disimpan, makin besar nilainya."</strong></p>
        <p><strong>Yang benar:</strong> nilai = <em>keputusan yang berubah</em>, bukan byte yang tersimpan. 77 GB event mentah yang tidak pernah diagregasi = Rp23 ribu/bulan untuk menimbun sampah digital — plus biaya tersembunyi: waktu engineer mencari di tumpukan itu, risiko bocor (DM12), dan kebingungan analis ("tabel mana yang benar?"). Aturan praktis: setiap dataset wajib punya <strong>konsumen bernama</strong>. Tidak ada konsumen = kandidat hapus.</p>
      </div>

      <h2 id="lab3">🔬 Lab 3: DIKW dalam 30 Baris — Dari Event ke Keputusan</h2>
      <p>Rasakan reduksi 100.000:1 dalam skala kecil: 2.400 event → agregat → knowledge → rekomendasi keputusan, semua dalam satu skrip.</p>
      <PyodideLab
        title="Lab 3 — Mesin DIKW Mini"
        hint="Coba: ubah DROP_HARI='Selasa' menjadi hari lain, atau naikkan DISKON_KOMPETITOR. Keputusan apa yang berubah? Itulah tahap Wisdom: angka yang sama, aksi yang berbeda."
        defaultCode={`# Lab 3: DIKW mini — Data -> Information -> Knowledge -> Wisdom
import random
random.seed(42)

# ===== DATA: 2400 event pembelian (mentah) =====
HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"]
KATEGORI = ["Elektronik","Fashion","Makanan"]
events = []
for i in range(2400):
    hari = HARI[i % 7]
    kat = random.choice(KATEGORI)
    # kompetitor diskon tiap Selasa -> penjualan Elektronik anjlok
    nominal = random.randint(100000, 2000000)
    if hari == "Selasa" and kat == "Elektronik" and random.random() < 0.5:
        continue  # batal beli -> tidak jadi event
    events.append((hari, kat, nominal))
print(f"DATA: {len(events)} event mentah (tidak bercerita apa-apa)")

# ===== INFORMATION: agregat per hari x kategori =====
from collections import defaultdict
agregat = defaultdict(int)
for hari, kat, nominal in events:
    agregat[(hari, kat)] += nominal
print(f"INFORMATION: {len(agregat)} baris agregat (reduksi {len(events)//len(agregat)}:1)")

# ===== KNOWLEDGE: pola yang bisa dibaca manusia =====
el_selasa = agregat[("Selasa","Elektronik")]
el_rata = sum(agregat[(h,"Elektronik")] for h in HARI if h != "Selasa") / 6
drop = (el_rata - el_selasa) / el_rata * 100
print(f"KNOWLEDGE: Elektronik hari Selasa turun {drop:.1f}% vs rata-rata hari lain")

# ===== WISDOM: keputusan =====
if drop > 10:
    print("WISDOM/KEPUTUSAN: Geser promo Elektronik ke Senin malam,")
    print("  pantau 30 hari. Estimasi dampak: Rp180 jt/bln (lihat Worked Example).")
else:
    print("WISDOM/KEPUTUSAN: Tidak ada aksi — fluktuasi normal.")
print()
print("Refleksi: di tahap mana 'nilai' muncul? (Petunjuk: bukan di DATA.)")`}
      />

      <h2 id="case">📋 Mini-Case: Laporan Direksi yang Salah Tanggal</h2>
      <div className="callout">
        <p>Bank "MajuJaya" punya 3 definisi "nasabah aktif": tim Digital (login 30 hari), tim Cabang (transaksi 90 hari), tim Risiko (punya produk aktif). Masing-masing menarik dari sistem berbeda: aplikasi mobile (OLTP), core banking (OLTP), dan warehouse yang di-refresh <em>mingguan</em>.</p>
        <p>Presentasi direksi: angka "nasabah aktif" di 3 slide berbeda = <strong>1,2 juta vs 890 ribu vs 1,05 juta</strong>. Direksi bingung, rapat 2 jam habis debat definisi.</p>
        <p><strong>Pertanyaan:</strong> (a) di tahap lifecycle mana masalah ini berakar? (b) Peran apa yang seharusnya mencegahnya? (c) Solusi strukturalnya apa?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Process + Analyze</strong>: tidak ada lapisan transformasi terstandar (tidak ada definisi tunggal sebelum analisis) dan tidak ada metadata/glossary yang disepakati.</p>
          <p>(b) <strong>Data steward + owner</strong>: seharusnya ada satu definisi "nasabah aktif" yang disahkan owner domain dan didokumentasikan steward.</p>
          <p>(c) <strong>Semantic/metrics layer</strong> (DM14): satu definisi metrik yang dipakai semua dashboard — bukan tiap tim hitung sendiri. Plus warehouse sebagai <em>satu</em> sumber OLAP, bukan 3 tarikan dari 3 sistem.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="latihan">✍️ Latihan Terpandu — Hitung Sendiri, Cek Jawabannya</h2>
      <p>Tiga soal hitungan. Kerjakan dulu (kalkulator boleh!), baru buka pembahasannya. Target: 3/3 benar.</p>

      <details className="worked">
        <summary>Soal 1 — Tagihan storage: 500.000 event/hari × 1,2 KB, retensi 180 hari, tarif Rp300/GB/bulan. Berapa tagihan per bulan?</summary>
        <p><Tex math={String.raw`\text{per hari} = 500.000 \times 1{,}2 \text{ KB} = 600.000 \text{ KB} \approx 0{,}6 \text{ GB}`} block /></p>
        <p><Tex math={String.raw`\text{total} = 0{,}6 \times 180 = 108 \text{ GB} \quad \Rightarrow \quad 108 \times 300 = \text{Rp}32.400\text{/bulan}`} block /></p>
        <p>Receh untuk 1 sumber — tapi kalikan 40 sumber + replikasi 3× + backup: <Tex math={String.raw`32.400 \times 40 \times 3 \approx \text{Rp}3{,}9 \text{ jt/bulan}`} />. Tiba-tiba bukan receh. <strong>Biaya data = perkalian, bukan penjumlahan.</strong></p>
      </details>

      <details className="worked">
        <summary>Soal 2 — Rasio reduksi DIKW: 1.000.000 event/hari direduksi menjadi 50 baris KPI. Berapa rasionya? Apa artinya?</summary>
        <p><Tex math={String.raw`\frac{1.000.000}{50} = 20.000 : 1`} block /></p>
        <p>Artinya 99,995% data "hilang" dari pandangan pengambil keputusan — dan itu <em>sehat</em>. Jika rasionya kecil (mis. 10:1), curigai: agregatnya belum cukup ringkas, atau keputusan yang diambil terlalu operasional untuk level direksi.</p>
      </details>

      <details className="worked">
        <summary>Soal 3 — Antrean lock: 1 query analitik mengunci tabel 5 detik; 100 kasir menunggu. Berapa "detik-kasir" hilang? Pelajarannya?</summary>
        <p><Tex math={String.raw`100 \times 5 = 500 \text{ detik-kasir} \approx 8{,}3 \text{ menit kerja hilang}`} block /></p>
        <p>Untuk <em>1 query</em>. Analis yang menjalankan 20 query sehari di database produksi = <strong>2,7 jam kerja kasir hilang per hari</strong>. Pelajaran: inilah aritmetika di balik pemisahan OLTP vs OLAP (bukan sekadar "best practice").</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kenapa query analitik berat (scan 100 juta baris) TIDAK boleh dijalankan di database OLTP operasional?"
        options={[
          "Karena SQL-nya beda sintaks",
          "Karena akan mengunci tabel / menghabiskan resource sehingga transaksi nasabah (transfer, checkout) melambat atau gagal",
          "Karena datanya tidak cukup",
          "Karena OLTP tidak bisa membaca data historis sama sekali",
        ]}
        correct={1}
        explanation="Benar: pola beban berlawanan. Query OLAP masif bersaing resource dengan transaksi real-time — transfer nasabah bisa timeout. Itu sebabnya arsitekturnya dipisah (OLTP → warehouse)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. 'Rata-rata saldo turun 3 bulan berturut-turut memprediksi tunggakan' — ini tahap DIKW yang mana?"
        options={[
          "Data",
          "Information",
          "Knowledge",
          "Wisdom",
        ]}
        correct={2}
        explanation="Benar: Knowledge — informasi (tren saldo) + pola/aturan yang bisa ditindaklanjuti. Wisdom adalah langkah berikutnya: keputusan bijak apa yang diambil dari pengetahuan itu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Log event aplikasi mobile dalam format JSON yang field-nya berubah tiap rilis. Klasifikasi & penyimpanan yang tepat?"
        options={[
          "Terstruktur → tabel relasional kaku, alter tiap rilis",
          "Semi-terstruktur → simpan mentah di lake / JSON, parse saat dibutuhkan",
          "Tidak terstruktur → simpan sebagai gambar",
          "Hapus saja karena tidak rapi",
        ]}
        correct={1}
        explanation="Benar: semi-terstruktur memang dirancang untuk skema yang berubah cepat. Memaksanya jadi tabel kaku = migrasi tiap sprint."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Perusahaan menyimpan SEMUA data 10 tahun 'buat jaga-jaga' tanpa kebijakan retensi. Apa risiko terbesarnya?"
        options={[
          "Tidak ada risiko, storage murah",
          "Data jadi liabilitas: biaya storage, risiko kebocoran/privasi, dan melanggar kewajiban hapus (misal UU PDP)",
          "Data otomatis jadi insight",
          "Query jadi lebih cepat",
        ]}
        correct={1}
        explanation="Benar: data tak terkelola = liabilitas. Ada biaya nyata (Lab 2), risiko kebocoran, dan kewajiban hukum untuk menghapus (retensi & privasi dibahas DM9/DM12)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Siapa yang seharusnya 'disalahkan' jika definisi 'nasabah aktif' berbeda-beda di tiap tim?"
        options={[
          "Data engineer (salah bikin pipeline)",
          "Data owner domain yang tidak menetapkan definisi tunggal + steward yang tidak mendokumentasikannya",
          "Nasabahnya",
          "Vendor database",
        ]}
        correct={1}
        explanation="Benar: ini masalah akuntabilitas, bukan teknis. Owner menetapkan definisi, steward menjaga dokumentasinya. Tanpa keduanya tertulis, tiap tim bikin definisi sendiri."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dashboard direksi butuh tren 5 tahun, boleh pakai data kemarin. Sistem yang tepat?"
        options={[
          "Query langsung ke database OLTP core banking",
          "OLAP / data warehouse yang diisi via pipeline dari OLTP",
          "File Excel di email",
          "Hapus data lama agar query cepat",
        ]}
        correct={1}
        explanation="Benar: OLAP/warehouse — dioptimasi untuk agregasi historis masif tanpa mengganggu transaksi. Data 'kemarin' sudah cukup untuk tren 5 tahun."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Lifecycle:</strong> Generate → Store → Process → Analyze → Archive/Delete; tiap tahap punya keputusan biaya & tanggung jawab.</li>
          <li><strong>DIKW:</strong> Data (mentah) → Information (konteks) → Knowledge (pola) → Wisdom (keputusan bijak). Nilai naik, usaha manusia ikut naik.</li>
          <li><strong>Jenis data:</strong> terstruktur (tabel/SQL), semi-terstruktur (JSON/lake), tidak terstruktur (file + ML) — ~90% data perusahaan bukan tabel rapi.</li>
          <li><strong>OLTP vs OLAP:</strong> kasir (transaksi real-time) vs analis (agregasi historis) — pisahkan, jangan campur.</li>
          <li><strong>Peran:</strong> owner (akuntabilitas) vs steward (operasional) — setiap dataset butuh keduanya tertulis.</li>
          <li><strong>Jangan:</strong> menyimpan semua selamanya tanpa retensi; menjalankan OLAP di OLTP; menganggap data mentah = insight.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/dm2-pemodelan-data" className="btn btn-primary btn-sm">Next: DM2 →</Link>
      </div>
    </div>
  );
}
