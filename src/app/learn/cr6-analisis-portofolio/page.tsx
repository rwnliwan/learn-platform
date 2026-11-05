"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr6Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const vintageData = [
    {
      x: ["MOB 1", "MOB 3", "MOB 6", "MOB 9", "MOB 12", "MOB 18", "MOB 24"],
      y: [0.3, 0.8, 1.5, 2.1, 2.4, 2.6, 2.7],
      type: "scatter",
      mode: "lines+markers",
      name: "Vintage 2023 (standar ketat)",
      line: { color: "#3aa655", width: 3 },
    },
    {
      x: ["MOB 1", "MOB 3", "MOB 6", "MOB 9", "MOB 12", "MOB 18", "MOB 24"],
      y: [0.5, 1.4, 2.6, 3.8, 4.5, 5.0, 5.2],
      type: "scatter",
      mode: "lines+markers",
      name: "Vintage 2024 (dilonggarkan)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const rollRateData = [
    {
      x: ["Current→30", "30→60", "60→90", "90→120", "120→150"],
      y: [8.0, 35.0, 55.0, 70.0, 80.0],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef9244", "#ef4444", "#8b1a1a"] },
      text: ["8%", "35%", "55%", "70%", "80%"],
      textposition: "outside",
    },
  ];

  const flowRateData = [
    {
      x: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
      y: [1.2, 1.3, 1.1, 2.8, 3.1, 2.9],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#2a7de1", "#ef4444", "#ef4444", "#ef4444"] },
      text: ["1,2%", "1,3%", "1,1%", "2,8%", "3,1%", "2,9%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Vintage curve — sidik jari kualitas origination
# Tiga kohort pencairan, 24 bulan. Mana yang "lahir" dengan masalah?
mob = list(range(1, 25))
v2023 = [0.3,0.5,0.8,1.1,1.5,1.8,2.1,2.2,2.4,2.5,2.5,2.6,2.6,2.6,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7,2.7]
v2024 = [0.5,0.9,1.4,2.0,2.6,3.2,3.8,4.1,4.5,4.7,4.8,5.0,5.0,5.1,5.1,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2,5.2]
v2025 = [0.4,0.7,1.0,1.3,1.6,1.9,2.2,2.4,2.5,2.6,2.7,2.7]  # baru 12 bulan (censored!)

print(f"{'MOB':<4} {'2023':>6} {'2024':>6} {'2025':>6}")
for i in range(12):
    v25 = f"{v2025[i]:.1f}%" if i < len(v2025) else "-"
    print(f"{mob[i]:<4} {v2023[i]:>5.1f}% {v2024[i]:>5.1f}% {v25:>6}")
print()
print("Bacaan:")
print("- 2024 melesat di atas 2023 sejak MOB 3 -> underwriting 2024 bermasalah")
print("  (ingat CR5: masalah lahir di origination!)")
print("- 2025 baru 12 bulan -> JANGAN bandingkan ujungnya dengan 2024 MOB 24")
print("  (right-censoring! bandingkan MOB yang sama: MOB 12 vs MOB 12)")
print()
print("Coba: bandingkan 2025 MOB 6 (1.9%) vs 2024 MOB 6 (3.2%).")
print("2025 terlihat membaik — tapi waspada: apakah standar diperketat,")
print("atau collection-nya yang agresif menekan DPD? (selidiki!)")`;

  const lab2Code = `# Lab 2: SQL untuk analis risiko — roll rate dari data mentah
# Di dunia kerja, analisis ini ditulis dalam SQL. Di sini kita jalankan
# SQL beneran via sqlite3 (built-in Python) — sintaksnya sama persis!
import sqlite3

db = sqlite3.connect(":memory:")
db.execute("""CREATE TABLE snapshot (
    nasabah TEXT, bulan TEXT, dpd INTEGER, outstanding REAL)""")
# Data: snapshot bulanan 3 nasabah (Juli -> Agustus)
rows = [
    ("A","2026-07",0,100), ("A","2026-08",15,100),
    ("B","2026-07",0,200), ("B","2026-08",0,200),
    ("C","2026-07",15,150), ("C","2026-08",45,150),
    ("D","2026-07",0,300), ("D","2026-08",35,300),
    ("E","2026-07",45,120), ("E","2026-08",90,120),
]
db.executemany("INSERT INTO snapshot VALUES (?,?,?,?)", rows)

# Roll rate: dari Current (Juli) -> DPD>0 (Agustus)
q = """
SELECT
  COUNT(*) AS n_current_jul,
  SUM(CASE WHEN b.dpd > 0 THEN 1 ELSE 0 END) AS n_masuk_dpd,
  ROUND(100.0 * SUM(CASE WHEN b.dpd > 0 THEN 1 ELSE 0 END) / COUNT(*), 1)
    AS roll_rate_pct
FROM snapshot a
JOIN snapshot b ON a.nasabah = b.nasabah
WHERE a.bulan='2026-07' AND b.bulan='2026-08' AND a.dpd = 0;
"""
r = db.execute(q).fetchone()
print(f"Nasabah Current (Jul) : {r[0]}")
print(f"Jadi DPD (Agu)        : {r[1]}")
print(f"Roll rate Current->DPD: {r[2]}%")
print()
print("Coba: ubah 'a.dpd = 0' jadi 'a.dpd BETWEEN 1 AND 30' untuk")
print("roll rate bucket 1-30 -> >30. Inilah query yang dipakai analis")
print("portofolio setiap bulan — kuasai pola JOIN snapshot ini!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR6 — Credit Risk Analyst</span>
        <h1 className="display-title">Vintage &amp; Roll Rate:<br />Membaca Kesehatan Portofolio</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Panen yang Gagal — Salah Musim Tanamnya</a></li>
          <li><a href="#vintage">Vintage &amp; MOB: Sidik Jari Kualitas Origination</a></li>
          <li><a href="#roll">Roll Rate: Seberapa Licin Tangganya?</a></li>
          <li><a href="#flow">Flow Rate &amp; Static Pool: Denyut Nadi Bulanan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Membaca Vintage Curve</a></li>
          <li><a href="#lab2">🔬 Lab 2: SQL Roll Rate (Skill Wajib Analis)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Angka Bergerak — Apa Artinya?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Vintage 2024 yang "Aneh"</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membaca vintage curve (NPL by MOB) dan menyimpulkan kualitas origination per kohort pencairan.</li>
          <li>Menghitung roll rate antar bucket DPD dan menggunakannya untuk memproyeksikan NPL.</li>
          <li>Membedakan static pool vs flow rate dan menjelaskan kapan memakai masing-masing.</li>
          <li>Menulis query SQL snapshot (JOIN antar bulan) untuk menghitung roll rate — skill inti analis portofolio.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Panen yang Gagal — Salah Musim Tanamnya</h2>
      <div className="story">
        <p>Pak Tanto petani padi. Panen 2024-nya gagal total — bulirnya hampa. Tetangganya menyalahkan <strong>hama tahun 2024</strong>. Tapi penyuluh pertanian menunjuk data: <em>"Bukan hamanya, Pak. <strong>Benih yang Bapak tanam Maret 2024</strong> memang varietas rentan. Petani yang tanam benih varietas tahan — panennya normal."</em></p>
        <p>Masalahnya bukan di musim panen — melainkan di <strong>musim tanam</strong>.</p>
        <p>Kredit persis begitu. NPL yang meledak tahun 2026 biasanya bukan "salah tahun 2026" — melainkan <strong>salah kohort pencairan 2024</strong> (standar underwriting dilonggarkan, marketing kejar target). Analis portofolio tidak bertanya "NPL bulan ini berapa?" — melainkan <strong>"vintage mana yang berdarah?"</strong></p>
        <p><strong>Twist-nya:</strong> ada cara untuk melihat "musim tanam" setiap kredit — namanya <strong>vintage analysis</strong>. Dan ia bisa membuktikan bahwa NPL 2026 sebenarnya sudah "diprogram" sejak 2024. Lesson ini mengajarkan cara membacanya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="vintage">Vintage &amp; MOB: Sidik Jari Kualitas Origination</h2>
      <p><strong>Definisi.</strong> <strong>Vintage</strong> = kelompok (kohort) kredit berdasarkan <strong>waktu pencairan</strong> (misal: semua KPR yang cair Q1 2024). <strong>MOB</strong> (<em>Month on Book</em>) = umur kredit dalam bulan sejak cair. <strong>Vintage curve</strong> = grafik % macet (atau NPL) per MOB untuk tiap vintage.</p>
      <p><strong>Kepribadian:</strong> vintage curve seperti <strong>rapor angkatan sekolah</strong> — angkatan 2023 vs 2024 vs 2025, siapa yang paling banyak "tinggal kelas". Kalau angkatan 2024 buruk di semua MOB, masalahnya bukan muridnya (ekonomi), melainkan <strong>seleksi masuknya</strong> (underwriting 2024).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Vintage Q1-2024: 1.000 KPR cair Januari–Maret 2024. Lacak % dengan DPD &gt;90 per MOB:</p>
        <p><strong>Langkah 1</strong> — MOB 6 (Jul 2024): 26 macet / 1000 = <strong>2,6%</strong>.<br />
        <strong>Langkah 2</strong> — MOB 12 (Jan 2025): 45 macet / 1000 = <strong>4,5%</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan vintage Q1-2023 di MOB yang SAMA: 2,4% → vintage 2024 hampir <strong>2× lipat</strong>.<br />
        <strong>Langkah 4</strong> — kesimpulan: underwriting 2024 lebih longgar. Selidiki: cut-off score diturunkan? Target marketing dinaikkan?</p>
      </details>

      <PlotlyChart
        data={vintageData}
        title="Vintage Curve: % Macet per MOB (dua angkatan)"
        layout={{ xaxis: { title: "Month on Book (MOB)" }, yaxis: { title: "% macet (DPD >90)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = umur kredit (MOB), sumbu Y = % yang macet. Dua garis = dua angkatan pencairan. Bandingkan <strong>vertikal</strong> (MOB yang sama).</p>
        <p><strong>Interpretasi:</strong> vintage 2024 (merah) konsisten DI ATAS 2023 (hijau) di setiap MOB — sejak MOB 3 sudah terlihat. Ini <strong>sidik jari underwriting longgar 2024</strong>, bukan "ekonomi 2025 memburuk" (kalau ekonomi penyebabnya, 2023 juga ikut naik di MOB 18–24). Bentuk kurva yang <strong>mendatar</strong> setelah MOB 18 = yang mau macet sudah macet semua (<em>seasoning</em> selesai).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Bandingkan ujung kurva vintage terbaru dengan vintage lama."</strong></p>
        <p><strong>Yang benar:</strong> vintage 2025 baru MOB 12 <strong>tidak boleh</strong> dibandingkan dengan vintage 2024 di MOB 24 — itu <strong>right-censoring</strong> (CR5)! Bandingkan selalu di <strong>MOB yang sama</strong> (MOB 12 vs MOB 12). Analis yang membandingkan ujung kurva akan selalu menyimpulkan "vintage terbaru bagus" — karena yang jeleknya belum sempat muncul.</p>
      </div>

      <h2 id="roll">Roll Rate: Seberapa Licin Tangganya?</h2>
      <p><strong>Definisi.</strong> <strong>Roll rate</strong> = % saldo di bucket DPD tertentu yang <strong>memburuk ke bucket berikutnya</strong> bulan depan. Misal: dari Rp 100 M di bucket 30 hari, Rp 35 M pindah ke bucket 60 hari → roll rate 35%.</p>
      <Tex math={String.raw`\text{Roll Rate}_{A \to B} = \frac{\text{Saldo bucket A yang pindah ke B bulan depan}}{\text{Saldo bucket A bulan ini}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong> pembilang = "yang jatuh" dari bucket A; penyebut = "yang berdiri" di bucket A. Bucket: Current → 1–30 → 31–60 → 61–90 → 90+ (default).</p>
      <p><strong>Kepribadian:</strong> roll rate seperti <strong>mengukur licinnya tangga</strong> — di anak tangga mana orang paling sering terpeleset? Kalau roll 60→90 = 55%, artinya lebih dari separuh yang telat 2 bulan akan telat 3 bulan. <strong>Makin ke kanan, makin licin</strong> — peluang sembuh (<em>roll-back</em>) menyusut.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>Snapshot Juli: bucket 30 hari = Rp 50 M. Snapshot Agustus: dari Rp 50 M itu, Rp 17,5 M kini di bucket 60 hari.</p>
        <p><strong>Langkah 1</strong> — roll rate = 17,5 / 50 = <strong>35%</strong>.<br />
        <strong>Langkah 2</strong> — proyeksi: bucket 60 hari Agustus Rp 40 M × roll 60→90 (55%) = <strong>Rp 22 M</strong> akan masuk 90+ (default) di September.<br />
        <strong>Langkah 3</strong> — inilah cara analis <strong>meramal NPL 2–3 bulan ke depan</strong> — bukan dengan firasat, melainkan dengan tangga roll rate.</p>
      </details>

      <PlotlyChart
        data={rollRateData}
        title="Roll Rate antar Bucket (ilustrasi — makin kanan makin licin)"
        layout={{ xaxis: { title: "Perpindahan bucket" }, yaxis: { title: "Roll rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % yang jatuh dari bucket kiri ke bucket kanan.</p>
        <p><strong>Interpretasi:</strong> pola <strong>menanjak ke kanan</strong> adalah hukum alam collection: Current→30 cuma 8% (kebanyakan sembuh), tapi 120→150 sudah 80% (hampir pasti meluncur ke default). <strong>Implikasi bisnis:</strong> Rp 1 yang diinvestasikan di collection bucket awal <strong>jauh lebih efektif</strong> daripada di bucket akhir — mencegah lebih murah daripada mengobati (CR22).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> roll rate adalah <strong>mesin peramal NPL</strong>. Kalikan berantai: Rp 100 M di Current × 8% × 35% × 55% × 70% ≈ Rp 1,08 M akan jadi default 4 bulan lagi. Inilah <em>roll-rate projection</em> — teknik yang dipakai analis portofolio setiap bulan untuk menjawab "NPL kuartal depan berapa?"</p>
      </div>

      <h2 id="flow">Flow Rate &amp; Static Pool: Denyut Nadi Bulanan</h2>
      <p><strong>Flow rate</strong> = % portofolio yang <strong>masuk</strong> ke bucket bermasalah bulan ini (arus masuk). <strong>Static pool</strong> = vintage yang <strong>dikunci</strong> — tidak ada kredit baru masuk, hanya dilacak sampai lunas/macet (seperti "akuarium tertutup").</p>
      <p><strong>Kapan pakai apa:</strong></p>
      <ul>
        <li><strong>Vintage curve</strong> → "angkatan mana yang bermasalah?" (kualitas origination).</li>
        <li><strong>Roll rate</strong> → "seberapa cepat masalah menyebar?" (efektivitas collection + proyeksi).</li>
        <li><strong>Flow rate</strong> → "bulan ini ada gelombang baru?" (deteksi dini — lihat chart).</li>
        <li><strong>Static pool</strong> → "berapa % akhirnya macet total?" (LGD &amp; validasi model — pool tertutup = tidak ada gangguan kredit baru).</li>
      </ul>

      <PlotlyChart
        data={flowRateData}
        title="Flow Rate ke Bucket 30 Hari (% portofolio per bulan)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Flow rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % portofolio yang baru masuk bucket 30 hari bulan itu.</p>
        <p><strong>Interpretasi:</strong> Jan–Mar stabil ~1,2%, lalu <strong>April melonjak 2,8%</strong> dan bertahan. Ini <strong>gelombang</strong> — bukan noise. Analis langsung bertanya: apa yang terjadi di April? (PHK massal? Bencana? Perubahan kebijakan collection?) Flow rate adalah <strong>alarm kebakaran</strong> portofolio — ia berbunyi 2–3 bulan SEBELUM NPL naik.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NPL stabil = portofolio sehat."</strong></p>
        <p><strong>Yang benar:</strong> NPL bisa stabil sementara <strong>flow rate melonjak dan roll rate memburuk</strong> — karena ada jeda 2–4 bulan sebelum masalah mencapai bucket 90+. Analis yang hanya memantau NPL seperti sopir yang hanya melihat spion: tahu ada masalah <em>setelah</em> menabrak. Pantau flow rate (masuk) + roll rate (menyebar) + vintage (asal).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan rantai waktu: <strong>flow rate (bulan ini)</strong> → <strong>roll rate (2–3 bulan)</strong> → <strong>NPL (3–4 bulan)</strong> → <strong>CKPN &amp; laba (kuartal ini)</strong>. Analis hebat membaca dari kiri (sebab), direksi biasanya baru sadar di kanan (akibat). Selisihnya = nilaimu sebagai analis.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Portofolio Punya Ingatan</h3>
      <p>Angka NPL bulan ini adalah <strong>rata-rata dari banyak angkatan</strong> — seperti nilai rapor sekolah yang mencampur angkatan 2020 (lulus saat pandemi) dengan angkatan 2024. Vintage analysis memisahkan angkatan-angkatan itu, dan yang terungkap sering mengejutkan: NPL agregat yang "stabil" bisa menyembunyikan vintage 2024 yang busuk di balik vintage 2021 yang sudah lunas. Analis yang hanya membaca agregat seperti dokter yang hanya mengukur suhu rata-rata satu kelurahan — wabah di satu RT tidak terdeteksi.</p>
      <p>Intuisi kedua: <strong>MOB (Month on Book)</strong> adalah "umur" kredit, dan kredit punya <strong>siklus hidup risiko</strong>. Pola klasik ritel: risiko rendah di bulan-bulan awal (masih ada "euforia" + seleksi), memuncak di MOB 9–24 (masa kritis — yang lemah gugur di sini), lalu menurun (yang selamat cenderung bertahan). Vintage curve yang <strong>tidak mengikuti pola ini</strong> = sinyal ada yang berubah: entah underwriting-nya, entah ekonominya, entah fraud-nya. Hafalkan bentuk kurva normal; setiap penyimpangan adalah pertanyaan yang wajib dijawab.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga lensa, tiga pertanyaan: <strong>vintage</strong> = "angkatan mana yang bermasalah?" (menilai origination masa lalu), <strong>roll rate</strong> = "seberapa cepat masalah menyebar?" (menilai collection hari ini), <strong>flow rate</strong> = "apakah ada gelombang baru bulan ini?" (peringatan dini). Analis lengkap memakai ketiganya — seperti dokter memakai tensi, darah, dan rontgen.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Membaca Vintage Curve</h2>
      <p>Jadi detektif origination: tiga angkatan, satu yang bermasalah. Temukan!</p>
      <PyodideLab
        title="Lab 1 — Detektif Vintage"
        hint="Bandingkan SELALU di MOB yang sama. Pertanyaan: (1) Sejak MOB berapa 2024 terlihat bermasalah? (2) 2025 MOB 12 vs 2024 MOB 12 — siapa lebih baik? (3) Mengapa tidak boleh bandingkan 2025 MOB 12 vs 2024 MOB 24?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: SQL Roll Rate (Skill Wajib Analis)</h2>
      <p>Di bank, analisis ini = SQL. Kuasai pola <strong>self-JOIN snapshot antar bulan</strong> ini — 80% pekerjaan analis portofolio.</p>
      <PyodideLab
        title="Lab 2 — Roll Rate dengan SQL (sqlite3)"
        hint="Ubah kondisi bucket di WHERE (misal BETWEEN 1 AND 30) untuk roll rate bucket lain. Lalu coba hitung 'roll-back rate': dari DPD>0 (Jul) kembali ke 0 (Agu) — itulah efektivitas collection!"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Angka Bergerak — Apa Artinya?</h2>

      <div className="decision-card">
        <h3>1. Satu vintage melesat di atas lainnya sejak MOB awal → <strong>audit underwriting periode itu</strong></h3>
        <p><strong>Kondisi:</strong> vintage 2024 konsisten di atas 2023 di MOB yang sama.</p>
        <p><strong>Aksi:</strong> selidiki perubahan kebijakan 2024: cut-off diturunkan? Target akuisisi dinaikkan? Segmen baru dibuka? Perbaiki <em>sekarang</em> — vintage 2025 sedang "ditanam" hari ini.</p>
      </div>

      <div className="decision-card">
        <h3>2. Flow rate melonjak 1 bulan → <strong>waspada; melonjak 3 bulan → bertindak</strong></h3>
        <p><strong>Kondisi:</strong> arus masuk bucket 30 hari naik tajam.</p>
        <p><strong>Aksi:</strong> 1 bulan = bisa musiman/noise (cek kalender: Lebaran? tahun ajaran?). 3 bulan = struktural — tambah kapasitas collection bucket awal (di sinilah Rp 1 paling efektif).</p>
      </div>

      <div className="decision-card">
        <h3>3. Roll rate bucket awal memburuk → <strong>perkuat early collection</strong></h3>
        <p><strong>Kondisi:</strong> Current→30 naik dari 8% ke 15%.</p>
        <p><strong>Kenapa:</strong> masalahnya di <strong>kontak dini</strong> — reminder otomatis rusak? Nomor HP nasabah basi? Perbaiki di hulu, bukan tambah debt collector di hilir.</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh estimasi LGD / validasi model → <strong>pakai static pool</strong></h3>
        <p><strong>Kondisi:</strong> butuh angka "berapa % akhirnya macet total".</p>
        <p><strong>Kenapa:</strong> static pool (akuarium tertutup, tanpa kredit baru) memberi kurva maturasi yang bersih — tidak terkontaminasi pertumbuhan portofolio. Syarat: pool harus cukup tua (MOB &gt;24).</p>
      </div>

            <div className="decision-card">
        <h3>5. Vintage 2024 buruk, vintage 2023 baik, tim underwriting sama → <strong>jangan pecat orangnya, audit kebijakannya</strong></h3>
        <p><strong>Kondisi:</strong> vintage curve 2024 melesat di atas 2023 pada MOB yang sama. Tim underwriting-nya orang yang sama, SOP tertulis sama.</p>
        <p><strong>Aksi:</strong> yang berubah biasanya bukan orang, melainkan <strong>parameter</strong>: cut-off diturunkan? Target akuisisi dinaikkan? Verifikasi lapangan dilonggarkan? Insentif marketing diubah? Audit "jejak kebijakan" 2024 vs 2023: bandingkan distribusi skor aplikan yang disetujui, persetujuan exception, dan komposisi segmen. Sering ditemukan: bukan underwriter yang kendor, melainkan <strong>direksi yang menaikkan target 2× lipat</strong> sehingga seleksi terpaksa longgar. Obatnya kebijakan, bukan PHK.</p>
        <p><strong>Contoh nyata:</strong> pola klasik "kejar target akhir tahun": akuisisi Q4 selalu menghasilkan vintage lebih buruk — bukan karena underwriter Desember lebih bodoh, melainkan karena tekanan target membuat exception membengkak. Solusi: batasi exception rate per bulan, bukan sekadar per tahun.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Vintage menjawab "kapan ditanam"</strong> — bandingkan di MOB yang sama.</li>
          <li><strong>Roll rate menjawab "seberapa licin"</strong> — kalikan berantai untuk proyeksi NPL.</li>
          <li><strong>Flow rate menjawab "ada gelombang?"</strong> — alarm 2–3 bulan sebelum NPL.</li>
          <li><strong>NPL stabil ≠ aman.</strong> Cek ketiganya sebelum menyimpulkan.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Ritual Bulanan Analis Portofolio</h3>
      <p>Analisis portofolio bukan proyek tahunan — melainkan ritual bulanan. Ini checklist 60 menit setiap awal bulan.</p>
      <ol>
        <li><strong>Update vintage curve (15 menit)</strong> — Tambah 1 MOB untuk semua vintage. Tandai vintage yang menyimpang &gt;1 poin dari rata-rata — itu 'pasien' bulan ini.</li>
        <li><strong>Cek flow rate (10 menit)</strong> — Bulan ini vs 3 bulan terakhir. Lonjakan 1 bulan = waspada; 3 bulan = gelombang — eskalasi.</li>
        <li><strong>Hitung roll rate (10 menit)</strong> — Per bucket DPD. Bucket awal memburuk = perkuat early collection SEBELUM jadi NPL.</li>
        <li><strong>Rekonsiliasi NPL (10 menit)</strong> — NPL = f(vintage, roll, flow, write-off, pertumbuhan). Jika tidak cocok = ada yang salah di data — cari.</li>
        <li><strong>Laporan 1 halaman (15 menit)</strong> — Satu halaman: 3 temuan + 2 aksi + 1 proyeksi. Bukan 30 slide — 1 halaman yang dibaca direksi.</li>
        <li><strong>Arsip &amp; bandingkan (5 menit)</strong> — Simpan snapshot. Bulan depan bandingkan: apakah proyeksimu benar? Akurasi proyeksi = reputasimu.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> disiplin 60 menit/bulan ini membedakan analis portofolio dari 'pembuat laporan'. Yang pertama mencegah; yang kedua mencatat.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Vintage analysis untuk KPR (tenor 20 tahun) — relevan?</summary>
        <p>Sangat — tetapi <strong>horizonnya panjang</strong>. Vintage KPR dinilai per tahun (bukan MOB bulanan), dan 'kematangan' baru terlihat di tahun 3–5. Kuncinya: <strong>bandingkan apel vs apel</strong> — vintage 2020 di tahun ke-5 vs vintage 2015 di tahun ke-5. Jangan bandingkan vintage muda vs tua.</p>
      </details>
      <details className="worked">
        <summary>❓ Roll rate vs flow rate — kapan pakai mana?</summary>
        <p>Flow rate = <strong>deteksi dini</strong> ('ada gelombang baru bulan ini?'). Roll rate = <strong>diagnosis &amp; proyeksi</strong> ('seberapa cepat menyebar? berapa yang jadi NPL?'). Praktik bulanan: cek flow dulu (10 menit); jika aneh, bedah roll (30 menit).</p>
      </details>
      <details className="worked">
        <summary>❓ Static pool untuk LGD — berapa lama?</summary>
        <p>Sampai <strong>recovery tuntas</strong> — umumnya 3–7 tahun untuk korporasi, 2–4 tahun untuk ritel. Pool yang 'ditutup' prematur = LGD underestimate (recovery yang belum terjadi diabaikan). Kesabaran data = kejujuran LGD.</p>
      </details>
      <details className="worked">
        <summary>❓ Bisakah vintage analysis mendeteksi fraud?</summary>
        <p>Bisa — <strong>pola yang tidak wajar</strong>: satu vintage/cabang/segmen yang melesat jauh di atas lainnya tanpa penjelasan ekonomi = investigasi fraud (data fiktif, mark-up agunan, atau 'tembak' aplikasi). Vintage adalah <strong>alat audit</strong> juga, bukan sekadar analisis risiko.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Analisis vintage bukan teori akademis — ia adalah <strong>alat kerja harian</strong> divisi risiko bank-bank Indonesia, terutama pasca-Covid.</p>

      <h3>2020–2025: Membaca Luka Lewat Vintage</h3>
      <p>Stimulus restrukturisasi Covid (CR2) membuat NPL agregat terlihat jinak. Tetapi analis yang membuka <strong>vintage curve</strong> melihat cerita lain: kohort yang dicairkan 2020–2021 (saat underwriting dilonggarkan demi "mendukung pemulihan") menunjukkan <strong>kumulatif default lebih tinggi</strong> dibanding kohort 2018–2019 pada MOB yang sama. Vintage 2020 adalah "angkatan pandemi" — disalurkan di tengah ketidakpastian, dengan verifikasi lapangan yang terhambat lockdown.</p>
      <p>Saat stimulus berakhir (Maret 2024), vintage-vintage inilah yang "jatuh" duluan — terlihat sebagai <strong>lonjakan flow rate</strong> beberapa bulan sebelumnya. Bank yang memonitor vintage sudah menyiapkan CKPN sejak 2023; bank yang hanya melihat NPL agregat terkejut di 2024. Pelajaran: <strong>vintage adalah mesin waktu</strong> — ia menunjukkan hari ini apa yang akan terjadi 6–12 bulan ke depan.</p>

      <h3>Praktik Indonesia: Vintage Kartu Kredit vs KPR</h3>
      <p>Dua pola klasik yang wajib dikenali analis Indonesia:</p>
      <ul>
        <li><strong>Kartu kredit:</strong> vintage curve menanjak cepat — puncak risiko di MOB 6–12. Akuisisi agresif (telemarketing, promo) menghasilkan vintage yang "panas": default kumulatif bisa 2–3× vintage normal. Inilah mengapa bank membatasi <strong>pertumbuhan akuisisi kartu baru</strong> per bulan — bukan karena tidak laku, melainkan karena vintage panas menagih 6 bulan kemudian.</li>
        <li><strong>KPR:</strong> vintage curve landai — puncak di MOB 18–36. KPR 2021–2022 (era FTV longgar 100%, DP 0%) diawasi ketat: DP 0% = <em>skin in the game</em> nol = vintage berisiko. Analis KPR selalu memisahkan vintage "DP 0%" dari vintage normal.</li>
      </ul>

      <h3>Static Pool: Standar Emas LGD</h3>
      <p>Untuk menghitung LGD (CR12), bank butuh <strong>static pool</strong>: kohort default yang dikunci, lalu diikuti recovery-nya selama bertahun-tahun sampai tuntas. OJK dan auditor menuntut metodologi ini untuk model LGD internal — karena hanya pool tertutup yang memberi angka recovery final yang jujur. Membangun static pool butuh <strong>disiplin data bertahun-tahun</strong>: bank yang databasenya berantakan tidak bisa punya model LGD yang kredibel. Inilah alasan "data adalah aset" bukan sekadar slogan.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: membaca vintage curve (klik untuk buka)</summary>
        <p>Data kumulatif default kartu kredit per vintage (MOB 12): 2021: 4,2% · 2022: 4,5% · 2023: 6,8% · 2024: 7,1%.</p>
        <p><strong>Langkah 1</strong> — bandingkan pada MOB yang sama (apel vs apel): 2023–2024 jelas di atas 2021–2022.<br />
        <strong>Langkah 2</strong> — cari penyebab: 2023 = tahun bank melipatgandakan akuisisi via digital + melonggarkan cut-off (kejar target).<br />
        <strong>Langkah 3</strong> — proyeksi: dengan pola MOB, default kumulatif 2024 di MOB 24 bisa mencapai ~9–10%. CKPN harus mencerminkan ini <strong>sekarang</strong> (PSAK 71 forward-looking), bukan menunggu.<br />
        <strong>Langkah 4</strong> — aksi: ketatkan cut-off akuisisi baru + perkuat collection MOB awal (tempat roll rate paling licin).</p>
        <p><strong>Pelajaran:</strong> satu tabel vintage menjawab empat hal: diagnosis, penyebab, proyeksi, dan aksi. Itulah mengapa vintage adalah "sidik jari" kualitas origination.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "NPL naik = underwriting memburuk. Titik."</strong></p>
        <p><strong>Yang benar:</strong> NPL agregat bisa naik karena <strong>efek bauran</strong>: misal vintage lama yang bagus lunas (keluar dari penyebut), menyisakan vintage baru yang belum matang. Atau karena perlambatan pertumbuhan kredit (penyebut kecil). Vintage analysis memisahkan "kualitas angkatan" dari "efek bauran" — tanpa itu, kamu bisa menyalahkan tim underwriting atas sesuatu yang sebenarnya fenomena aritmetika.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Vintage 2024 yang "Aneh"</h2>
      <div className="callout">
        <p>Bank Nusantara, segmen KUR. NPL naik 2,1% → 3,8% dalam setahun. Tim bisnis berdalih: <strong>"Daya beli turun, bukan salah kami."</strong> Datamu:</p>
        <ul>
          <li>Vintage 2024 (cair saat program KUR diperluas) di MOB 12: <strong>5,1% macet</strong>. Vintage 2022 &amp; 2023 di MOB 12: <strong>2,3% dan 2,5%</strong>.</li>
          <li>Cut-off score KUR <strong>diturunkan 40 poin</strong> pada Jan 2024 (untuk kejar target penyaluran).</li>
          <li>Segmen non-KUR (KPR, KMK) dengan vintage 2024: <strong>normal</strong> (tidak melonjak).</li>
          <li>Flow rate KUR melonjak sejak <strong>6 bulan setelah</strong> pelonggaran — konsisten dengan seasoning.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apakah dalih "daya beli" valid? Susun argumen 3 poin untuk membantahnya di depan direksi.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Dalih tidak valid. Tiga argumen:</strong></p>
          <p>(1) <strong>Kontrol segmen:</strong> kalau daya beli penyebabnya, KPR &amp; KMK vintage 2024 ikut melonjak — faktanya tidak. Masalahnya spesifik KUR.<br />
          (2) <strong>Sidik jari underwriting:</strong> vintage 2024 melonjak sejak MOB awal (bukan tiba-tiba di MOB 12) + bertepatan dengan penurunan cut-off 40 poin. Ini pola "lahir bermasalah", bukan "terpukul ekonomi".<br />
          (3) <strong>Timing konsisten:</strong> flow rate melonjak 6 bulan pasca pelonggaran — sesuai masa seasoning KUR, bukan pola guncangan makro (yang biasanya serentak).</p>
          <p><strong>Kesimpulan untuk direksi:</strong> NPL 2026 adalah <strong>buah dari keputusan Jan 2024</strong>. Solusinya bukan menyalahkan ekonomi, melainkan mengembalikan cut-off + memperketat monitoring vintage 2024 yang masih berjalan.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Vintage 2024 di MOB 12 = 5,1% macet; vintage 2023 di MOB 12 = 2,5%. Kesimpulan terbaik?"
        options={[
          "2024 lebih buruk — indikasi underwriting 2024 lebih longgar (bandingkan di MOB sama)",
          "2024 lebih baik",
          "Tidak bisa dibandingkan beda tahun",
          "Ekonomi 2024 lebih buruk",
        ]}
        correct={0}
        explanation="Benar: perbandingan di MOB yang SAMA menunjukkan kualitas origination. 2× lipat = sidik jari underwriting, bukan ekonomi (ekonomi akan memukul semua vintage)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bucket 30 hari = Rp 50 M (Jul); Rp 17,5 M di antaranya jadi bucket 60 hari (Agu). Roll rate?"
        options={[
          "17,5%",
          "35%",
          "50%",
          "65%",
        ]}
        correct={1}
        explanation="Benar: 17,5/50 = 35%. Roll rate = yang jatuh / yang berdiri di awal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. NPL stabil 3 bulan, tapi flow rate ke bucket 30 naik 3 bulan berturut-turut. Artinya?"
        options={[
          "Aman — NPL stabil",
          "Waspada — gelombang masalah sedang berjalan menuju NPL (jeda 2–4 bulan); selidiki sekarang",
          "Flow rate tidak penting",
          "Segera write-off",
        ]}
        correct={1}
        explanation="Benar: flow rate adalah alarm dini. NPL = akibat yang datang belakangan. Analis membaca sebab (kiri), bukan menunggu akibat (kanan)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk menghitung roll rate Current→30 antar dua snapshot bulanan, pola SQL yang tepat?"
        options={[
          "SELECT AVG(dpd) FROM snapshot",
          "Self-JOIN snapshot bulan ini dengan bulan lalu pada nasabah yang sama, lalu hitung % yang pindah bucket",
          "COUNT(*) WHERE dpd > 0",
          "DELETE FROM snapshot",
        ]}
        correct={1}
        explanation="Benar: self-JOIN antar snapshot (a.bulan='Jul' JOIN b.bulan='Agu' ON nasabah). Roll rate = transisi INDIVIDU antar waktu — butuh data yang sama di dua titik waktu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan memakai static pool (bukan vintage biasa)?"
        options={[
          "Untuk laporan harian",
          "Saat butuh kurva maturasi bersih (estimasi LGD/validasi) — pool dikunci tanpa kredit baru agar tidak terkontaminasi pertumbuhan",
          "Tidak pernah — vintage selalu lebih baik",
          "Hanya untuk KPR",
        ]}
        correct={1}
        explanation="Benar: static pool = akuarium tertutup. Vintage biasa tercampur kredit baru tiap bulan; static pool memberi gambaran maturasi murni satu kohort."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. NPL agregat stabil 2,5%, tetapi vintage 2024 menunjukkan default kumulatif 7% di MOB 12 (vs 4% vintage 2022). Kesimpulan?"
        options={[
          "Tidak ada masalah — NPL agregat stabil",
          "Waspada: vintage 2024 bermasalah (kualitas origination memburuk); NPL agregat tertahan oleh vintage lama yang bagus — gelombang akan datang 6–12 bulan lagi",
          "Vintage 2024 pasti fraud",
          "Hentikan semua penyaluran kredit",
        ]}
        correct={1}
        explanation="Benar: agregat menyembunyikan masalah angkatan. Vintage 2024 yang busuk akan 'jatuh' menjadi NPL dalam 6–12 bulan ke depan. Analis yang membaca vintage sudah menyiapkan CKPN dari sekarang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Untuk membangun model LGD internal yang kredibel, bank wajib memakai:"
        options={[
          "Data NPL bulan berjalan saja",
          "Static pool — kohort default yang dikunci dan diikuti recovery-nya hingga tuntas bertahun-tahun",
          "Asumsi LGD 45% dari Basel",
          "Survei ke debitur",
        ]}
        correct={1}
        explanation="Benar: static pool. Hanya kohort tertutup yang memberi angka recovery final yang jujur — tanpa gangguan kredit baru. Membangunnya butuh disiplin data bertahun-tahun; bank yang databasenya berantakan tidak bisa punya model LGD kredibel."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Vintage</strong> = kohort pencairan; <strong>MOB</strong> = umur kredit. Bandingkan selalu di MOB yang sama (anti censoring).</li>
          <li><strong>Roll rate</strong> = % yang jatuh ke bucket berikutnya — makin kanan makin licin; bisa dirantai untuk proyeksi NPL.</li>
          <li><strong>Flow rate</strong> = alarm dini (2–3 bulan sebelum NPL); <strong>static pool</strong> = akuarium tertutup untuk LGD/validasi.</li>
          <li><strong>Rantai waktu:</strong> flow → roll → NPL → CKPN/laba. Baca dari kiri.</li>
          <li><strong>NPL lahir di origination</strong> — vintage curve adalah buktinya.</li>
          <li>Kapan TIDAK mengandalkan vintage: portofolio muda (MOB kecil) — kurvanya belum bercerita; pakai flow rate + benchmark eksternal.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr5-definisi-default" className="btn btn-secondary btn-sm">← CR5</Link>
        <Link href="/learn/cr7a-application-scorecard-1" className="btn btn-primary btn-sm">Next: CR7a →</Link>
      </div>
    </div>
  );
}
