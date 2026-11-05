"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr10Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const ttcPitData = [
    {
      x: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      y: [2.0, 2.1, 2.0, 2.2, 2.1, 2.0, 2.1],
      type: "scatter",
      mode: "lines+markers",
      name: "PD TTC (stabil)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      y: [1.8, 4.5, 2.5, 1.6, 1.5, 1.7, 2.0],
      type: "scatter",
      mode: "lines+markers",
      name: "PD PIT (mengikuti siklus)",
      line: { color: "#ef4444", width: 3 },
    },
  ];

  const masterScaleData = [
    {
      x: ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"],
      y: [0.05, 0.12, 0.25, 0.6, 1.8, 5.5, 18.0],
      type: "bar",
      marker: { color: ["#3aa655", "#3aa655", "#2a7de1", "#2a7de1", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["0,05%", "0,12%", "0,25%", "0,6%", "1,8%", "5,5%", "18%"],
      textposition: "outside",
    },
  ];

  const calibrationData = [
    {
      x: [1, 2, 4, 8, 15],
      y: [1.1, 2.3, 5.5, 11.0, 19.0],
      type: "scatter",
      mode: "lines+markers",
      name: "Aktual vs Prediksi (miskalibrasi)",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: [1, 2, 4, 8, 15],
      y: [1, 2, 4, 8, 15],
      type: "scatter",
      mode: "lines",
      name: "Ideal (aktual = prediksi)",
      line: { color: "#3aa655", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Lab 1: TTC vs PIT — dua cara membaca cuaca risiko
# TTC = iklim (rata-rata jangka panjang); PIT = cuaca hari ini.
import math

# PD PIT mengikuti siklus ekonomi (z): resesi -> naik, boom -> turun
def pd_pit(ttc, z):
    # z: -2 (resesi berat) s/d +2 (boom)
    return ttc * math.exp(-0.5 * z)

ttc = 0.02
print(f"PD TTC (iklim) = {ttc*100:.1f}% (tetap)")
print(f"{'Kondisi':<16} {'z':>5} {'PD PIT':>8}")
for nama, z in [("Resesi berat",-2),("Resesi",-1),("Normal",0),("Boom",1.5)]:
    print(f"{nama:<16} {z:>5} {pd_pit(ttc,z)*100:>7.2f}%")
print()
print("Coba: ubah ttc jadi 0.05 (portofolio berisiko).")
print("PIT berayun di sekitar TTC — TTC = jangkar, PIT = ayunan.")
print()
print("Kapan pakai apa? TTC -> modal (Basel, stabil). PIT -> ECL (PSAK 71, responsif).")`;

  const lab2Code = `# Lab 2: Lifetime PD — merangkai PD 1-tahun jadi PD tenor
# ECL butuh PD kumulatif selama sisa tenor (bukan cuma 12 bulan).
# Rumus: PD_lifetime = 1 - (1-p1)(1-p2)...(1-pn)  [peluang selamat tiap tahun]
import math

pd_tahunan = [0.020, 0.018, 0.015, 0.012, 0.010]  # PD marginal per tahun

survive = 1.0
print(f"{'Thn':<4} {'PD thn':>8} {'P(survive)':>10} {'PD kumulatif':>13}")
for i, p in enumerate(pd_tahunan, 1):
    survive *= (1 - p)
    kum = 1 - survive
    print(f"{i:<4} {p*100:>7.2f}% {survive:>9.4f} {kum*100:>12.2f}%")
print()
print(f"PD 12-bulan (Stage 1): {pd_tahunan[0]*100:.1f}%")
print(f"PD lifetime 5 thn     : {kum*100:.1f}%  ({kum/pd_tahunan[0]:.1f}x lipat!)")
print()
print("Coba: buat PD tahun 1-2 tinggi (0.05, 0.04) lalu menurun.")
print("Itulah pola umum: risiko terbesar di awal (belum 'teruji'),")
print("lalu menurun — kurva 'maturing'. Inilah seasoning (CR6)!")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR10 — Credit Risk Analyst</span>
        <h1 className="display-title">PD Modeling:<br />TTC vs PIT, Kalibrasi &amp; Lifetime PD</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Ramalan Cuaca yang Bertengkar</a></li>
          <li><a href="#ttcpit">TTC vs PIT: Iklim vs Cuaca</a></li>
          <li><a href="#master">Master Scale: Raport Kelas untuk Semua</a></li>
          <li><a href="#kalibrasi">Kalibrasi: Ranking Benar, Angka Harus Benar</a></li>
          <li><a href="#lifetime">Lifetime PD: Merangkai Tahun demi Tahun</a></li>
          <li><a href="#lab1">🔬 Lab 1: TTC vs PIT</a></li>
          <li><a href="#lab2">🔬 Lab 2: Lifetime PD</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: PD Mana untuk Apa?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Modal Jebol karena Salah PD</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan PD TTC vs PIT: definisi, kapan memakai masing-masing, dan konsekuensinya.</li>
          <li>Menjelaskan master scale (rating internal) dan memetakan skor ke grade.</li>
          <li>Menghitung lifetime PD dari PD marginal tahunan dan menggunakannya untuk ECL.</li>
          <li>Mendiagnosis miskalibrasi model dan menjelaskan perbedaannya dengan diskriminasi.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Ramalan Cuaca yang Bertengkar</h2>
      <div className="story">
        <p>Dua analis Bank Nusantara bertengkar di rapat. Andi (tim modal): <em>"PD portofolio kita 2% — stabil 5 tahun. Modal cukup."</em> Rina (tim ECL): <em>"PD kuartal ini 4,5%! Cadangan harus naik!"</em></p>
        <p>Direktur bingung: <em>"Jadi PD-nya 2% atau 4,5%? Kalian pakai data yang sama?!"</em></p>
        <p>Keduanya benar. Andi memakai <strong>PD TTC</strong> (<em>Through-the-Cycle</em>): rata-rata jangka panjang "iklim" risiko — stabil, untuk modal. Rina memakai <strong>PD PIT</strong> (<em>Point-in-Time</em>): "cuaca" saat ini — naik saat resesi, untuk ECL.</p>
        <p><strong>Twist-nya:</strong> bank modern menjalankan <strong>dua PD sekaligus</strong> untuk tujuan berbeda — dan kekacauan terjadi saat orang mencampuradukkan. Lesson ini memastikan kamu tidak pernah tertukar.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="ttcpit">TTC vs PIT: Iklim vs Cuaca</h2>
      <ul>
        <li><strong>PD TTC</strong> (<em>Through-the-Cycle</em>): rata-rata peluang default <strong>sepanjang siklus ekonomi</strong> (boom + resesi). Stabil, tidak reaktif. Dipakai untuk <strong>modal (Basel/IRB)</strong> — regulator tidak mau modal naik-turun tiap kuartal.</li>
        <li><strong>PD PIT</strong> (<em>Point-in-Time</em>): peluang default <strong>kondisi saat ini</strong> (12 bulan ke depan dari hari ini). Reaktif terhadap siklus. Dipakai untuk <strong>ECL/PSAK 71 &amp; pricing</strong> — cadangan harus mencerminkan realita kini.</li>
      </ul>
      <p><strong>Kepribadian:</strong> TTC seperti <strong>iklim Jakarta</strong> — "rata-rata 28°C, hujan 150 hari/tahun" (stabil, untuk perencanaan jangka panjang). PIT seperti <strong>ramalan besok</strong> — "besok hujan badai" (reaktif, untuk keputusan harian). Keduanya benar; salah kamar = bencana.</p>

      <PlotlyChart
        data={ttcPitData}
        title="TTC (Stabil) vs PIT (Mengikuti Siklus) — Ilustrasi"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "PD (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = TTC (datar ~2%); garis merah = PIT (berayun).</p>
        <p><strong>Interpretasi:</strong> 2020 (resesi): PIT melonjak 4,5% — ECL ikut melonjak (ingat cerita CR4b!). TTC tetap 2% — modal tidak panik. 2022 (boom): PIT turun 1,6% — ECL ringan. <strong>Pelajaran:</strong> ECL itu <em>procyclical</em> (memperparah siklus: cadangan naik tepat saat ekonomi sulit) — kritik utama PSAK 71 yang harus dipahami analis.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "PD ya PD — satu angka untuk semua keperluan."</strong></p>
        <p><strong>Yang benar:</strong> PD TTC untuk modal, PD PIT untuk ECL — <strong>dua angka berbeda dari filosofi berbeda</strong>. Memakai PIT untuk modal = modal gonjang-ganjing tiap kuartal (regulator marah). Memakai TTC untuk ECL = cadangan tidak responsif (auditor marah). Bank besar memelihara <strong>keduanya</strong> dengan penyesuaian siklus yang terdokumentasi.</p>
      </div>

      <h2 id="master">Master Scale: Raport Kelas untuk Semua</h2>
      <p><strong>Definisi.</strong> <strong>Master scale</strong> = tangga rating internal bank (mirip AAA–D ala Pefindo/S&amp;P) yang memetakan <strong>setiap skor/PD ke grade</strong>. Syarat: tiap grade punya <strong>rentang PD</strong> yang monotonik (grade lebih baik = PD lebih kecil) dan <strong>terkalibrasi</strong> (PD grade = default rate aktual historis).</p>
      <p><strong>Mengapa perlu?</strong> Tiga alasan: (1) <strong>komunikasi</strong> — "rating BB" dimengerti direksi, "PD 1,83%" tidak; (2) <strong>konsistensi</strong> — segmen retail &amp; korporasi bicara bahasa yang sama; (3) <strong>regulasi</strong> — IRB mewajibkan rating scale dengan PD per grade.</p>

      <PlotlyChart
        data={masterScaleData}
        title="Contoh Master Scale: PD per Grade (skala log!)"
        layout={{ xaxis: { title: "Grade" }, yaxis: { title: "PD (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = PD rata-rata grade tersebut. Perhatikan: naik <strong>eksponensial</strong>, bukan linear.</p>
        <p><strong>Interpretasi:</strong> AAA→AA bedanya 0,07 poin; B→CCC bedanya 12,5 poin! <strong>Pelajaran:</strong> satu notch downgrade di ujung bawah (B→CCC) jauh lebih "mahal" dari di ujung atas. Inilah mengapa analis korporasi (CR17) sangat serius soal <em>rating migration</em> — dan mengapa <em>cliff</em> antara investment grade (BBB) vs speculative (BB) begitu politis.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> master scale yang baik punya <strong>jumlah grade yang pas</strong> (biasanya 7–10 untuk performing): terlalu sedikit = tidak diferensiasi; terlalu banyak = grade kosong/tidak stabil. Aturan: tiap grade harus punya <strong>cukup observasi</strong> untuk validasi (ratusan–ribuan rekening).</p>
      </div>

      <h2 id="kalibrasi">Kalibrasi: Ranking Benar, Angka Harus Benar</h2>
      <p><strong>Definisi.</strong> <strong>Kalibrasi</strong> = apakah PD prediksi <strong>cocok dengan realisasi</strong>? Model memprediksi PD 4% untuk 1.000 nasabah → harusnya ~40 yang default. Kalau aktualnya 80 → <strong>miskalibrasi</strong> (underestimate 2×).</p>
      <p><strong>Bedanya dengan diskriminasi</strong> (CR7b): diskriminasi = <em>ranking</em> benar (yang diprediksi berisiko memang lebih banyak default). Kalibrasi = <em>angka</em> benar. Model bisa ranking sempurna tapi angka meleset 2× — <strong>untuk ECL/modal, angka yang menentukan rupiah</strong>.</p>

      <PlotlyChart
        data={calibrationData}
        title="Plot Kalibrasi: Prediksi vs Aktual (miskalibrasi!)"
        layout={{ xaxis: { title: "PD prediksi (%)" }, yaxis: { title: "Default aktual (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis hijau putus-putus = ideal (aktual = prediksi). Titik merah = model ini.</p>
        <p><strong>Interpretasi:</strong> model <strong>konsisten underestimate</strong> — prediksi 4%, aktual 5,5%; prediksi 15%, aktual 19%. Ranking-nya mungkin benar (monotonik naik), tapi <strong>setiap rupiah ECL yang dihitung dari PD ini kekecilan ~35%</strong>. Solusi: <strong>rekalibrasi</strong> (sesuaikan PD per grade dengan faktor koreksi) — tidak perlu rebuild total.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Gini tinggi = model siap pakai untuk ECL."</strong></p>
        <p><strong>Yang benar:</strong> Gini mengukur <em>ranking</em>, bukan <em>angka</em>. Model dengan Gini 0,6 tapi kalibrasi meleset 2× akan menghasilkan CKPN yang salah 2× — dan auditor akan menolaknya. <strong>Urutan validasi: diskriminasi dulu (apakah ranking benar?), kalibrasi kemudian (apakah angka benar?)</strong> — keduanya wajib lolos.</p>
      </div>

      <h2 id="lifetime">Lifetime PD: Merangkai Tahun demi Tahun</h2>
      <p><strong>Definisi.</strong> <strong>Lifetime PD</strong> = peluang default <strong>kumulatif selama sisa tenor</strong> (bukan 12 bulan). Dibutuhkan untuk ECL Stage 2/3 (PSAK 71). Dihitung dari <strong>PD marginal</strong> (peluang default di tahun ke-t <em>dengan syarat</em> selamat sampai tahun t−1):</p>
      <Tex math={String.raw`\text{PD}_{\text{lifetime}} = 1 - \prod_{t=1}^{T}(1 - \text{PD}_t)`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\text{PD}_t`} /> = PD marginal tahun ke-<Tex math={String.raw`t`} />; <Tex math={String.raw`T`} /> = sisa tenor (tahun); <Tex math={String.raw`\prod`} /> = "kalikan semua". Logikanya: peluang <em>selamat</em> T tahun = kalikan peluang selamat tiap tahun; lifetime PD = 1 − itu.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>PD marginal: thn1 2%, thn2 1,8%, thn3 1,5%.</p>
        <p><strong>Langkah 1</strong> — peluang selamat: 0,98 × 0,982 × 0,985 = 0,948.<br />
        <strong>Langkah 2</strong> — lifetime PD = 1 − 0,948 = <strong>5,2%</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan PD 12-bulan (2%): lifetime <strong>2,6× lipat</strong> — inilah "bahan bakar" cliff effect Stage 1→2.</p>
        <p>Catatan: PD marginal biasanya <strong>menurun</strong> seiring waktu (<em>seasoning</em> — yang lemah gugur duluan, CR6). Asumsi PD konstan = menyederhanakan berlebihan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> lifetime PD <strong>bukan</strong> PD 12-bulan × tenor (itu double counting). Rumus perkalian peluang selamat adalah satu-satunya cara yang benar. Dan ingat: lifetime PD untuk ECL memakai <strong>PIT</strong> (forward-looking + skenario makro — CR11), bukan TTC.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Dua Jam untuk Dua Keperluan</h3>
      <p>TTC vs PIT sering dihafal sebagai definisi. Analis senior memahaminya sebagai <strong>jawaban atas dua pertanyaan berbeda</strong>: "berapa modal yang harus kusiapkan untuk siklus penuh?" (TTC — stabil, untuk bertahan hidup) vs "berapa cadangan yang harus kubentuk kuartal ini?" (PIT — reaktif, untuk kejujuran laporan). Memakai PIT untuk modal = modal ikut panik tiap resesi (procyclical, berbahaya); memakai TTC untuk ECL = cadangan terlambat merespons (melanggar PSAK 71). <strong>Setiap angka PD harus ditanya: untuk keperluan apa?</strong> — seperti obat: dosisnya tergantung penyakitnya.</p>
      <p>Intuisi kedua tentang kalibrasi: diskriminasi (Gini) menjawab "apakah ranking-nya benar?", kalibrasi menjawab "apakah angkanya benar?". Analogi: peramal cuaca yang selalu bilang "besok 70% hujan saat memang hujan dan 30% saat cerah" = diskriminasi sempurna. Tetapi kalau dari 100 hari "70% hujan" ternyata hujan 90 kali = kalibrasi rusak (seharusnya ~70). Untuk ECL dan modal, <strong>kalibrasi lebih penting dari diskriminasi</strong> — karena CKPN dihitung dari angkanya, bukan rankingnya. Model dengan Gini 0,65 tapi kalibrasi meleset 2× lebih berbahaya dari model Gini 0,5 yang terkalibrasi — yang pertama salah dengan percaya diri.</p>
      <p>Intuisi ketiga: <strong>master scale adalah bahasa diplomatik</strong>. "PD 1,83%" tidak bisa didiskusikan direksi; "rating BB, outlook negatif" bisa. Grade memampatkan spektrum kontinu menjadi kategori yang bisa diberi kebijakan ("grade CCC ke bawah = wajib agunan tambahan"). Tetapi kompresi selalu menghilangkan informasi — analis harus tahu kapan memakai grade (komunikasi, kebijakan) dan kapan memakai PD mentah (perhitungan ECL, pricing). Jangan menghitung ECL dari grade — hitung dari PD, lalu tampilkan grade.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: TTC vs PIT</h2>
      <p>Satu portofolio, dua PD. Rasakan ayunannya mengikuti siklus.</p>
      <PyodideLab
        title="Lab 1 — Simulator TTC vs PIT"
        hint="Coba ubah ttc (0.01, 0.02, 0.05). Perhatikan: ayunan PIT selalu proporsional terhadap TTC. Pertanyaan: mengapa regulator melarang PIT untuk modal? (Petunjuk: bayangkan modal naik-turun tiap kuartal.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Lifetime PD</h2>
      <p>Rangkai PD tahunan menjadi PD lifetime — bahan bakar ECL Stage 2.</p>
      <PyodideLab
        title="Lab 2 — Kalkulator Lifetime PD"
        hint="Coba pola 'front-loaded': [0.05, 0.04, 0.02, 0.01, 0.01] vs pola flat [0.026]*5. Lifetime mirip, tapi distribusinya beda — mana yang lebih 'mahal' setelah didiskonto? (Petunjuk: kerugian awal lebih mahal karena diskonto kecil.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: PD Mana untuk Apa?</h2>

      <div className="decision-card">
        <h3>1. Hitung modal (Basel/IRB) → <strong>PD TTC</strong></h3>
        <p><strong>Kondisi:</strong> kebutuhan modal, RWA, KPMM.</p>
        <p><strong>Kenapa:</strong> modal harus stabil sepanjang siklus — regulator tidak mau bank menambah modal tiap resesi (justru saat modal sulit dicari).</p>
      </div>

      <div className="decision-card">
        <h3>2. Hitung ECL/CKPN (PSAK 71) → <strong>PD PIT + forward-looking</strong></h3>
        <p><strong>Kondisi:</strong> cadangan, staging, laporan keuangan.</p>
        <p><strong>Kenapa:</strong> cadangan harus mencerminkan ekspektasi <em>saat ini</em> termasuk proyeksi ekonomi (CR11).</p>
      </div>

      <div className="decision-card">
        <h3>3. Pricing kredit baru → <strong>PD PIT</strong></h3>
        <p><strong>Kondisi:</strong> menetapkan bunga.</p>
        <p><strong>Kenapa:</strong> harga harus mencerminkan risiko <em>saat ini</em> — memakai TTC saat resesi = bunga kemurahan (rugi).</p>
      </div>

      <div className="decision-card">
        <h3>4. Komunikasi ke direksi/auditor → <strong>master scale (grade)</strong></h3>
        <p><strong>Kondisi:</strong> laporan, komite kredit.</p>
        <p><strong>Kenapa:</strong> "rating BB, outlook negatif" dimengerti semua orang; "PD 1,83%" hanya dimengerti analis.</p>
      </div>

      <div className="decision-card">
        <h3>5. Model ranking bagus tapi ECL meleset → <strong>cek kalibrasi, rekalibrasi</strong></h3>
        <p><strong>Kondisi:</strong> Gini OK, tapi aktual vs prediksi menyimpang.</p>
        <p><strong>Aksi:</strong> plot kalibrasi per grade; sesuaikan PD dengan faktor koreksi (rekalibrasi) — lebih murah dari rebuild.</p>
      </div>

            <div className="decision-card">
        <h3>6. Validator menemukan kalibrasi meleset 30% di grade B → <strong>rekalibrasi, jangan rebuild total</strong></h3>
        <p><strong>Kondisi:</strong> validasi tahunan: grade B diprediksi PD 2%, realisasi 2,6% (meleset 30%). Diskriminasi (Gini) masih bagus — ranking benar, angka meleset.</p>
        <p><strong>Aksi:</strong> ini masalah kalibrasi, bukan diskriminasi — <strong>jangan buang modelnya</strong>. Lakukan rekalibrasi: petakan ulang PD per grade dari data terbaru (dengan mempertimbangkan siklus), dokumentasikan, dan dapatkan persetujuan komite. Rebuild total (variabel baru, struktur baru) hanya jika diskriminasi juga rusak. Analogi: jam yang terlambat 10 menit tidak perlu diganti — cukup putar jarumnya. Tetapi catat <em>mengapa</em> meleset: apakah siklus? populasi bergeser? Jawabannya menentukan apakah rekalibrasi cukup.</p>
        <p><strong>Contoh nyata:</strong> bank-bank Indonesia pasca-Covid merekalibrasi grade korporasi karena realisasi default sektor tertentu menyimpang dari PD pra-pandemi — tanpa membuang struktur rating yang sudah disetujui OJK. Recalibration = operasi kecil; rebuild = operasi besar dengan izin baru.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>TTC = iklim (modal); PIT = cuaca (ECL/pricing).</strong> Jangan tertukar.</li>
          <li><strong>Master scale</strong> = bahasa manusia untuk PD.</li>
          <li><strong>Kalibrasi ≠ diskriminasi.</strong> Keduanya wajib lolos.</li>
          <li><strong>Lifetime PD</strong> = 1 − Π(1−PD_t). Bukan PD × tenor.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Dua PD, Dua Buku: Panduan Praktis TTC vs PIT</h3>
      <p>Kebingungan TTC vs PIT adalah sumber kesalahan paling umum. Panduan satu halaman ini menyelesaikannya.</p>
      <ol>
        <li><strong>Untuk ECL (PSAK 71) → PIT</strong> — Cadangan kuartal ini harus mencerminkan kondisi kini + prakiraan. Memakai TTC = terlambat = melanggar standar.</li>
        <li><strong>Untuk modal (Basel/ICAAP) → TTC</strong> — Modal adalah penyangga siklus penuh. Memakai PIT = modal panik tiap resesi = procyclical = berbahaya.</li>
        <li><strong>Untuk pricing → PIT (biasanya)</strong> — Harga kredit hari ini harus mencerminkan risiko hari ini. Pengecualian: produk jangka sangat panjang bisa memakai campuran.</li>
        <li><strong>Untuk stress test → PIT yang di-stress</strong> — Mulai dari PIT kini, lalu terapkan skenario adverse (CR16). Bukan TTC — stres menguji masa depan, bukan rata-rata.</li>
        <li><strong>Dokumentasikan perbedaannya</strong> — Satu model, dua output, dua keperluan — tuliskan di dokumentasi model: 'PD_TTC untuk X, PD_PIT untuk Y, selisih karena Z'. Auditor WILL ask.</li>
        <li><strong>Jangan pernah satu angka untuk semua</strong> — Model yang mengeluarkan 'PD' tunggal tanpa label TTC/PIT = model yang belum selesai. Label adalah bagian dari angka.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tempel di dinding: 'ECL=PIT, Modal=TTC, Pricing=PIT, Stres=PIT-stres.' Empat kata, nol kebingungan.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Master scale berapa grade yang ideal?</summary>
        <p>Praktik: <strong>7–10 grade performing</strong> + 1 default. Terlalu sedikit (3) = tidak membedakan; terlalu banyak (20) = grade sepi data (tidak bisa dikalibrasi). Setiap grade harus punya <strong>cukup default historis</strong> untuk kalibrasi — grade tanpa data = dekorasi.</p>
      </details>
      <details className="worked">
        <summary>❓ PD TTC dari data 3 tahun — boleh?</summary>
        <p>Tidak ideal — 3 tahun <strong>bukan satu siklus</strong>. TTC butuh data sepanjang siklus (7+ tahun) atau <strong>penyesuaian siklus</strong> (menganchor ke rata-rata jangka panjang). PD dari 3 tahun boom = TTC yang optimis = modal kurang. Tambahkan <em>margin of conservatism</em> jika data pendek.</p>
      </details>
      <details className="worked">
        <summary>❓ Lifetime PD untuk KPR 20 tahun — PD marginal tahun ke-15 dari mana?</summary>
        <p>Dari <strong>ekstrapolasi + asumsi</strong>: data historis jarang mencapai 20 tahun. Praktik: pakai PD marginal tahun-tahun akhir yang teramati (dengan seasoning), lalu <strong>flat atau mean-reverting</strong> untuk sisanya — dengan <strong>margin konservatif</strong> dan dokumentasi asumsi. Ketidakpastian diakui, bukan disembunyikan.</p>
      </details>
      <details className="worked">
        <summary>❓ Kalibrasi meleset 20% — rekalibrasi atau rebuild?</summary>
        <p><strong>Rekalibrasi dulu</strong> (putar jarum jam, bukan ganti jam) — jika diskriminasi masih bagus. Rebuild hanya jika: diskriminasi rusak, populasi bergeser struktural, atau variabel kunci tidak tersedia lagi. Rekalibrasi = operasi kecil; rebuild = operasi besar + persetujuan baru.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia mewajibkan bank-bank besar membangun <strong>rating internal</strong> — dan kisah kalibrasinya penuh pelajaran.</p>

      <h3>Rating Internal di Bank Indonesia</h3>
      <p>OJK mendorong bank (terutama yang berminat IRB) memiliki <strong>internal rating system</strong>: setiap debitur korporasi/komersial diberi grade (mirip AAA–D) yang dipetakan ke PD. Praktiknya: bank-bank BUMN dan swasta besar Indonesia memakai 8–12 grade untuk performing + 1 grade default. Setiap grade punya <strong>PD rata-rata historis</strong> yang direview tahunan.</p>
      <p>Tantangan khas Indonesia: <strong>data default korporasi yang tipis</strong>. Tidak seperti AS/Eropa dengan ribuan default tercatat, Indonesia punya sedikit kasus default korporasi besar per tahun — sehingga kalibrasi grade bawah (CCC–D) sering mengandalkan <strong>data eksternal</strong> (Pefindo, data regional) atau <em>expert judgment</em>. Analis model di Indonesia harus jago "menambal" data tipis dengan metodologi yang bisa dipertahankan ke validator dan OJK.</p>

      <h3>PIT vs TTC dalam Praktik Indonesia</h3>
      <p>Ketegangan TTC/PIT meledak saat Covid: PD PIT melonjak (ECL naik, laba anjlok — CR4b), sementara PD TTC untuk modal relatif stabil. Bank-bank Indonesia yang memakai <strong>PD TTC untuk ICAAP</strong> (Pilar 2) tidak perlu menambah modal panik — keputusan yang tepat. Pelajaran: <strong>dua PD, dua governance</strong> — tim akuntansi (PIT, ECL) dan tim permodalan (TTC, ICAAP) bisa memakai angka berbeda dari model yang sama, asal perbedaannya terdokumentasi.</p>

      <h3>Jebakan Kalibrasi: Data Pendek</h3>
      <p>Bank muda/fintech Indonesia sering mengkalibrasi PD dari <strong>2–3 tahun data</strong> — yang kebetulan tahun-tahun bagus. Hasilnya: PD underestimate sistematis. Saat siklus berbalik, realisasi 2–3× prediksi. Praktik sehat (dan dituntut validator): kalibrasi memakai <strong>data sepanjang siklus</strong> (minimal 5–7 tahun, mencakup setidaknya satu periode stres), atau tambahkan <em>margin of conservatism</em> jika data pendek. "Modelku akurat di 3 tahun terakhir" bukan klaim kalibrasi — melainkan klaim keberuntungan.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: lifetime PD KPR (klik untuk buka)</summary>
        <p>KPR 15 tahun, PD marginal tahunan (setelah seasoning): thn1 1,2%, thn2 1,0%, thn3 0,9%, thn4+ stabil 0,8%/tahun.</p>
        <p><strong>Langkah 1</strong> — peluang selamat 3 tahun pertama: 0,988 × 0,990 × 0,991 ≈ 0,969.<br />
        <strong>Langkah 2</strong> — peluang selamat thn4–15 (12 tahun × 0,8%): 0,992<sup>12</sup> ≈ 0,908.<br />
        <strong>Langkah 3</strong> — peluang selamat total ≈ 0,969 × 0,908 ≈ 0,880.<br />
        <strong>Langkah 4</strong> — lifetime PD = 1 − 0,880 = <strong>12%</strong>.</p>
        <p><strong>Interpretasi:</strong> PD 12-bulan cuma 1,2% — terlihat kecil. Tetapi lifetime 12% inilah yang dipakai ECL Stage 2. Inilah "bahan bakar" cliff effect: kredit yang pindah Stage 2 cadangannya dihitung dari 12%, bukan 1,2%.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Model dengan Gini tertinggi pasti yang terbaik untuk semua keperluan."</strong></p>
        <p><strong>Yang benar:</strong> Gini mengukur ranking — penting untuk seleksi (cut-off). Tetapi untuk ECL, pricing, dan modal, yang menentukan adalah <strong>kalibrasi</strong>: apakah PD 4% benar-benar default 4%? Model Gini 0,6 yang miscalibrated 2× menghasilkan CKPN yang salah 2× — lebih berbahaya dari model Gini 0,5 yang terkalibrasi. Pilih metrik sesuai keperluan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Modal Jebol karena Salah PD</h2>
      <div className="callout">
        <p>Bank Nusantara memakai <strong>PD PIT untuk perhitungan modal IRB</strong> (kesalahan konseptual). 2020: PIT melonjak 2% → 4,5%.</p>
        <ul>
          <li>RWA melonjak 30% → KPMM jatuh 14% → <strong>10,5%</strong>.</li>
          <li>OJK mempertanyakan metodologi; bank terpaksa <strong>menahan ekspansi + memotong dividen</strong> di tengah krisis — tepat saat ekonomi butuh kredit.</li>
          <li>Padahal jika memakai TTC (tetap ~2%), KPMM hanya turun ke 13,2% (akibat rugi), masih lega.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> jelaskan mengapa ini procyclical dan berbahaya secara sistemik. Apa perbaikan 2 poinmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Procyclical:</strong> saat resesi, PIT naik → modal terkunci lebih banyak → bank <em>mengurangi</em> kredit → ekonomi makin sulit → PIT naik lagi. <strong>Lingkaran setan</strong> yang memperparah krisis — persis yang ingin dicegah Basel dengan TTC.</p>
          <p><strong>Perbaikan:</strong> (1) <strong>Pisahkan dua PD</strong>: TTC untuk modal (dengan dokumentasi penyesuaian siklus), PIT untuk ECL. (2) <strong>Bangun buffer di masa boom</strong> (capital conservation buffer Basel III) agar saat resesi bank tidak perlu memotong kredit. Pelajaran: <strong>memakai PD yang benar di tempat yang salah = sebahaya memakai PD yang salah</strong>.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Dua PD, Satu Debitur, Dua Keputusan</h2>
      <div className="callout">
        <p>PT Maju Bersama (manufaktur): rating internal <strong>BB</strong>, PD TTC 1,5%, PD PIT saat ini <strong>4%</strong> (sektornya terpukul kenaikan biaya energi).</p>
        <ul>
          <li>Tim akuntansi memakai PD PIT 4% → ECL Stage 1 melonjak, laba kuartal tergerus Rp 800 jt untuk debitur ini saja.</li>
          <li>Tim permodalan memakai PD TTC 1,5% → kebutuhan modal stabil, tidak ada tambahan.</li>
          <li>Direktur bisnis protes: "Kok angkanya beda? Mana yang benar? Jangan-jangan yang satu ngaco!"</li>
        </ul>
        <p><strong>Pertanyaan:</strong> jelaskan ke direktur mengapa dua angka berbeda itu <strong>keduanya benar</strong> — dan kapan masing-masing dipakai. Apa bahayanya jika disamakan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Keduanya benar karena menjawab pertanyaan berbeda.</strong> PD PIT 4% menjawab "berapa cadangan wajar KUARTAL INI mengingat kondisi sektor yang buruk?" (kejujuran laporan keuangan — PSAK 71). PD TTC 1,5% menjawab "berapa modal penyangga untuk SIKLUS PENUH termasuk masa sulit seperti ini?" (ketahanan — Basel).</p>
          <p><strong>Bahaya menyamakan:</strong> (1) Pakai PIT untuk modal → modal ikut panik tiap guncangan siklikal, bank dipaksa deleverage di saat ekonomi butuh kredit (procyclical, memperparah resesi). (2) Pakai TTC untuk ECL → cadangan terlambat, laporan keuangan menipu, melanggar PSAK 71.</p>
          <p>Kalimat untuk direktur: <em>"ECL memakai kacamata hari ini agar laporan jujur; modal memakai kacamata siklus agar bank selamat. Keduanya dari model yang sama — beda lensa, beda keperluan."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. PD TTC vs PIT — pasangan yang benar?"
        options={[
          "TTC untuk ECL, PIT untuk modal",
          "TTC (iklim, stabil) untuk modal; PIT (cuaca, reaktif) untuk ECL/pricing",
          "Keduanya sama, hanya beda nama",
          "TTC untuk retail, PIT untuk korporasi",
        ]}
        correct={1}
        explanation="Benar: iklim vs cuaca. Modal butuh stabilitas (TTC); ECL butuh responsivitas (PIT). Tertukar = modal gonjang-ganjing atau cadangan tidak responsif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. PD marginal tahunan: 2%, 1,8%, 1,5%. Lifetime PD 3 tahun?"
        options={[
          "5,3% (2+1,8+1,5 — dijumlah)",
          "≈5,2% (1 − 0,98×0,982×0,985) — via peluang selamat",
          "2% (pakai tahun pertama saja)",
          "6% (2% × 3)",
        ]}
        correct={1}
        explanation="Benar: 1 − Π(1−PD_t) = 5,2%. Menjumlah langsung = double counting (menghitung yang sudah default dua kali)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model Gini 0,6 tapi untuk PD prediksi 4%, aktualnya 8%. Masalahnya?"
        options={[
          "Diskriminasi buruk",
          "Miskalibrasi — ranking mungkin benar tapi angkanya underestimate 2×; ECL dari PD ini kekecilan",
          "Tidak ada masalah — Gini tinggi cukup",
          "Data kurang",
        ]}
        correct={1}
        explanation="Benar: kalibrasi ≠ diskriminasi. Untuk ECL/modal yang menentukan rupiah adalah ANGKA PD, bukan ranking. Solusi: rekalibrasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Mengapa master scale (grade AAA–CCC) tetap dipakai padahal bank punya PD presisi?"
        options={[
          "Tradisi semata",
          "Komunikasi (dimengerti direksi), konsistensi antar segmen, dan kewajiban regulasi IRB — 'bahasa manusia untuk PD'",
          "PD tidak bisa dihitung",
          "Agar terlihat seperti rating agency",
        ]}
        correct={1}
        explanation="Benar: tiga fungsi itu. 'Rating BB outlook negatif' menggerakkan keputusan komite; 'PD 1,83%' tidak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bank memakai PD PIT untuk modal. Saat resesi, apa yang terjadi?"
        options={[
          "Tidak ada — PD hanya angka",
          "Procyclical: modal terkunci naik → kredit dipotong → ekonomi memburuk → spiral; inilah yang dicegah Basel dengan TTC",
          "Modal justru turun",
          "OJK memberi penghargaan",
        ]}
        correct={1}
        explanation="Benar: lingkaran setan procyclical. Modal harus menjadi peredam guncangan (stabil via TTC), bukan penambah guncangan."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model A: Gini 0,62, kalibrasi meleset 2× (prediksi 4%, aktual 8%). Model B: Gini 0,50, kalibrasi akurat. Untuk perhitungan ECL, mana yang lebih baik?"
        options={[
          "Model A — Gini lebih tinggi selalu menang",
          "Model B — ECL dihitung dari angkanya, bukan rankingnya; miscalibrated 2× = CKPN salah 2×",
          "Sama saja",
          "Keduanya tidak bisa dipakai",
        ]}
        correct={1}
        explanation="Benar: Model B. ECL = PD × LGD × EAD memakai angka PD — kalibrasi menentukan kebenaran CKPN. Gini tinggi dengan kalibrasi rusak = salah dengan percaya diri. Pilih metrik sesuai keperluan: Gini untuk seleksi, kalibrasi untuk ECL/modal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Lifetime PD KPR 15 tahun adalah 12%, PD 12-bulan 1,2%. Mengapa lifetime jauh lebih besar dan kapan dipakai?"
        options={[
          "Karena PD 12-bulan × 15 = 18% — tinggal kalikan",
          "Lifetime = 1 − (peluang selamat tiap tahun dikalikan); dipakai untuk ECL Stage 2/3 (PSAK 71) — inilah bahan bakar cliff effect",
          "Lifetime selalu = 10× PD 12-bulan",
          "Tidak dipakai di mana-mana",
        ]}
        correct={1}
        explanation="Benar: lifetime PD dirangkai dari PD marginal tahunan (bukan perkalian sederhana — itu double counting). Dipakai untuk ECL Stage 2/3. Lompatan 1,2% → 12% inilah yang membuat perpindahan stage menghantam laba."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>TTC</strong> = iklim (stabil, untuk modal); <strong>PIT</strong> = cuaca (reaktif, untuk ECL/pricing).</li>
          <li><strong>Master scale</strong> = tangga grade AAA–CCC; PD naik eksponensial ke bawah.</li>
          <li><strong>Kalibrasi</strong> (angka benar) ≠ <strong>diskriminasi</strong> (ranking benar) — keduanya wajib.</li>
          <li><strong>Lifetime PD</strong> = 1 − Π(1 − PD_t); bahan bakar ECL Stage 2.</li>
          <li><strong>ECL itu procyclical</strong> — pahami dan kelola, jangan kaget.</li>
          <li>Kapan TIDAK pakai TTC: saat menghitung cadangan/harga — di sana dunia nyata (PIT) yang berlaku.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr9-behavioral-scorecard" className="btn btn-secondary btn-sm">← CR9</Link>
        <Link href="/learn/cr11-forward-looking" className="btn btn-primary btn-sm">Next: CR11 →</Link>
      </div>
    </div>
  );
}
