"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr11Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const satelliteData = [
    {
      x: [4.5, 5.0, 5.5, 6.0, 7.0, 8.5, 11.0],
      y: [1.2, 1.5, 1.8, 2.2, 2.8, 3.8, 5.5],
      type: "scatter",
      mode: "markers",
      name: "Observasi (pengangguran vs default rate)",
      marker: { color: "#2a7de1", size: 9 },
    },
    {
      x: [4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0],
      y: [1.0, 1.5, 2.0, 2.7, 3.4, 4.1, 4.8, 5.5, 6.2],
      type: "scatter",
      mode: "lines",
      name: "Model satelit",
      line: { color: "#ef4444", width: 2, dash: "dash" },
    },
  ];

  const scenarioData = [
    {
      x: ["Optimis (20%)", "Baseline (50%)", "Pesimis (30%)"],
      y: [8, 14, 28],
      type: "bar",
      marker: { color: ["#3aa655", "#2a7de1", "#ef4444"] },
      text: ["Rp 8 M", "Rp 14 M", "Rp 28 M"],
      textposition: "outside",
    },
  ];

  const overlayData = [
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [12, 13, 12.5, 14],
      type: "bar",
      name: "ECL model",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [2, 2, 5, 5],
      type: "bar",
      name: "Overlay manajemen",
      marker: { color: "#e8a838" },
    },
  ];

  const lab1Code = `# Lab 1: Model satelit — dari pengangguran ke PD
# Hubungan (ilustrasi): default_rate = a + b * pengangguran
a, b = -1.5, 0.65  # hasil regresi historis (dalam %)

def pd_dari_pengangguran(u):
    return a + b * u

print(f"{'Skenario':<12} {'Pengangguran':>13} {'Default rate':>13}")
for nama, u in [("Optimis", 5.0), ("Baseline", 6.5), ("Pesimis", 9.0)]:
    print(f"{nama:<12} {u:>12.1f}% {pd_dari_pengangguran(u):>12.2f}%")
print()
print("Coba: ubah b jadi 1.2 (ekonomi lebih sensitif).")
print("Skenario pesimis meledak — inilah 'beta makro' portofolio.")
print("Portofolio dengan b besar = rapuh terhadap resesi.")`;

  const lab2Code = `# Lab 2: Probability-weighted ECL — rata-rata berbobot skenario
# ECL final = jumlah (probabilitas skenario x ECL skenario)
skenario = {
    "Optimis":  {"prob": 0.20, "ecl": 8},
    "Baseline": {"prob": 0.50, "ecl": 14},
    "Pesimis":  {"prob": 0.30, "ecl": 28},
}
ecl_final = sum(s["prob"] * s["ecl"] for s in skenario.values())
print(f"{'Skenario':<10} {'Prob':>6} {'ECL':>6} {'Kontribusi':>11}")
for nama, s in skenario.items():
    print(f"{nama:<10} {s['prob']*100:>5.0f}% {s['ecl']:>5.0f}M {s['prob']*s['ecl']:>10.2f}M")
print(f"\nECL final (weighted) = Rp {ecl_final:.2f} M")
print(f"ECL baseline saja    = Rp 14.00 M")
print(f"Selisih              = Rp {ecl_final-14:+.2f} M  (dampak skenario ekstrem)")
print()
print("Coba: ubah prob Pesimis jadi 0.5 (resesi makin mungkin).")
print("ECL final naik — dan inilah yang terjadi di Q1 2020: bobot")
print("skenario pesimis direvisi naik -> CKPN melonjak -> laba anjlok.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR11 — Credit Risk Analyst</span>
        <h1 className="display-title">Forward-Looking:<br />Ekonomi Masa Depan Masuk ke Cadangan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Ramalan yang Menggerakkan Triliunan</a></li>
          <li><a href="#satelit">Model Satelit: Jembatan Makro → PD</a></li>
          <li><a href="#skenario">Skenario &amp; Probability-Weighting</a></li>
          <li><a href="#overlay">Overlay Manajemen: Penilaian Manusia di Atas Model</a></li>
          <li><a href="#lab1">🔬 Lab 1: Model Satelit</a></li>
          <li><a href="#lab2">🔬 Lab 2: Probability-Weighted ECL</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Overlay? Kapan Model?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Overlay Rp 500 M yang Diperdebatkan</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan cara kerja model satelit: menghubungkan variabel makro ke PD/LGD.</li>
          <li>Menghitung ECL probability-weighted dari 3 skenario ekonomi.</li>
          <li>Membedakan overlay yang sah vs manipulasi laba, dan syarat governance-nya.</li>
          <li>Menganalisis sensitivitas ECL terhadap perubahan bobot skenario.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Ramalan yang Menggerakkan Triliunan</h2>
      <div className="story">
        <p>Maret 2020. Tim ekonomi Bank Nusantara merevisi proyeksi: pengangguran dari 5% → <strong>9%</strong>, GDP dari +5% → <strong>−2%</strong>. Angka-angka itu dimasukkan ke "model satelit" — dan keluar: PD portofolio naik 2× lipat.</p>
        <p>Efek dominonya: ECL naik <strong>Rp 1,4 triliun</strong>. Laba kuartal anjlok. Direksi menatap tim risiko: <em>"Kalian yakin ramalannya? Satu revisi Excel menguapkan Rp 1,4 T?!"</em></p>
        <p>Itulah kekuatan <strong>forward-looking</strong> PSAK 71: cadangan bukan cermin masa lalu, melainkan <strong>jendela ke masa depan</strong> — dan jendela itu terbuat dari <strong>ramalan ekonomi</strong>. Ramalan yang salah = cadangan yang salah = laba yang salah.</p>
        <p><strong>Twist-nya:</strong> tidak ada yang tahu masa depan — jadi standar mewajibkan <strong>beberapa skenario</strong> (bukan satu ramalan), dirata-ratakan berbobot. Lesson ini membedah mesinnya: dari variabel makro sampai overlay manusia.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="satelit">Model Satelit: Jembatan Makro → PD</h2>
      <p><strong>Definisi.</strong> <strong>Model satelit</strong> = model yang menghubungkan <strong>variabel makroekonomi</strong> (pengangguran, GDP, suku bunga, harga komoditas) ke <strong>parameter risiko</strong> (PD, LGD). Disebut "satelit" karena <strong>mengorbit</strong> model utama (scorecard): scorecard menilai <em>siapa</em>, satelit menyesuaikan <em>kapan</em> (kondisi ekonomi).</p>
      <p><strong>Cara kerja (3 langkah):</strong></p>
      <ol>
        <li><strong>Regresi historis:</strong> hubungkan default rate historis dengan variabel makro (misal: tiap +1% pengangguran → default rate +0,65%).</li>
        <li><strong>Proyeksi makro:</strong> ambil ramalan ekonomi (internal / BI / IMF) untuk 3 skenario.</li>
        <li><strong>Terjemahkan:</strong> masukkan proyeksi ke regresi → PD forward-looking per skenario.</li>
      </ol>
      <Tex math={String.raw`\text{PD}_{\text{skenario}} = f(\text{pengangguran}, \text{GDP}, \text{suku bunga}, \dots)`} block />
      <p><strong>Kepribadian:</strong> model satelit seperti <strong>penerjemah</strong> — ia menerjemahkan bahasa ekonom ("pengangguran 9%") menjadi bahasa risiko ("PD naik 2×"). Tanpa penerjemah ini, ramalan ekonomi dan cadangan bank bicara bahasa berbeda.</p>

      <PlotlyChart
        data={satelliteData}
        title="Model Satelit: Pengangguran vs Default Rate (ilustrasi)"
        layout={{ xaxis: { title: "Pengangguran (%)" }, yaxis: { title: "Default rate (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik biru = data historis (pengangguran vs default rate tiap tahun); garis merah putus-putus = model satelit (regresi).</p>
        <p><strong>Interpretasi:</strong> hubungan <strong>positif dan kuat</strong> — tiap 1% pengangguran ≈ +0,65% default rate. Model ini yang dipakai untuk menerjemahkan "pengangguran diproyeksi 9%" menjadi "default rate ≈ 4,35%". <strong>Kelemahan:</strong> hubungan historis bisa <strong>patah</strong> (misal: stimulus pemerintah memutus rantai pengangguran→default saat Covid) — model satelit butuh <em>judgment</em>, bukan autopilot.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> koefisien regresi (b = 0,65) adalah <strong>"beta makro"</strong> portofolio — ukuran kerapuhan terhadap resesi. Portofolio KUR (debitur rentan) punya beta besar; KPR PNS punya beta kecil. Analis yang tahu beta makro tiap segmen bisa menjawab: "resesi 2% pengangguran = ECL naik berapa?" — pertanyaan favorit direksi.</p>
      </div>

      <h2 id="skenario">Skenario &amp; Probability-Weighting</h2>
      <p><strong>Definisi.</strong> PSAK 71 melarang memakai <strong>satu ramalan tunggal</strong> — wajib <strong>beberapa skenario</strong> (minimal: optimis, baseline, pesimis) yang <strong>dirata-ratakan berbobot probabilitas</strong>:</p>
      <Tex math={String.raw`\text{ECL} = \sum_{\text{skenario}} P(\text{skenario}) \times \text{ECL}_{\text{skenario}}`} block />
      <p><strong>Artinya tiap simbol:</strong> untuk tiap skenario: kalikan probabilitasnya <Tex math={String.raw`P`} /> dengan ECL di skenario itu, lalu jumlahkan. Bobot harus <strong>jumlah 100%</strong> dan <strong>tidak bias</strong> (tidak boleh 90% optimis saat resesi di depan mata).</p>
      <p><strong>Mengapa tidak cukup baseline?</strong> Karena hubungan ekonomi→kerugian <strong>non-linear</strong> (cembung): kerugian di skenario pesimis <strong>jauh lebih besar</strong> dari penghematan di skenario optimis. Rata-rata dari 3 skenario &gt; skenario tengah saja. Mengabaikan ekstrem = underestimate sistematis.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>ECL per skenario: optimis Rp 8 M (prob 20%), baseline Rp 14 M (50%), pesimis Rp 28 M (30%).</p>
        <p><strong>Langkah 1</strong> — kalikan: 0,2×8 = 1,6; 0,5×14 = 7,0; 0,3×28 = 8,4.<br />
        <strong>Langkah 2</strong> — jumlahkan: <strong>Rp 17,0 M</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan dengan baseline saja (Rp 14 M): selisih <strong>+Rp 3 M (+21%)</strong> — "premi" untuk mengakui ketidakpastian. Inilah harga kejujuran.</p>
      </details>

      <PlotlyChart
        data={scenarioData}
        title="ECL per Skenario (Rp Miliar)"
        layout={{ xaxis: { title: "Skenario (probabilitas)" }, yaxis: { title: "ECL (Rp M)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = ECL di tiap skenario, dengan probabilitasnya.</p>
        <p><strong>Interpretasi:</strong> skenario pesimis (30% × Rp 28 M = Rp 8,4 M kontribusi) <strong>mendominasi</strong> ECL final meski probabilitasnya bukan yang terbesar — karena kerugiannya non-linear. <strong>Pelajaran governance:</strong> siapa yang menentukan 30% vs 20% untuk pesimis? <strong>Komite</strong> — bukan satu analis. Bobot skenario adalah keputusan paling sensitif di seluruh rantai ECL.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Skenario pesimis 30% terlalu besar — tidak realistis."</strong></p>
        <p><strong>Yang benar:</strong> skenario bukan ramalan "yang paling mungkin", melainkan <strong>cakupan ketidakpastian</strong>. Bahkan jika resesi "hanya" 10% mungkin, <em>dampaknya</em> begitu besar sehingga mengabaikannya = meremehkan risiko. Standar meminta skenario yang <strong>mewakili distribusi kemungkinan</strong>, bukan satu titik estimasi.</p>
      </div>

      <h2 id="overlay">Overlay Manajemen: Penilaian Manusia di Atas Model</h2>
      <p><strong>Definisi.</strong> <strong>Overlay</strong> (<em>management overlay/post-model adjustment</em>) = penyesuaian <strong>manual</strong> terhadap ECL hasil model, untuk risiko yang <strong>belum tertangkap model</strong> (misal: bencana alam baru terjadi, regulasi baru, anomali data).</p>
      <p><strong>Kapan sah:</strong> (1) ada <strong>alasan spesifik &amp; terdokumentasi</strong> ("banjir Kalimantan memukul 2.000 debitur, model belum mencakup"); (2) <strong>besaran dihitung</strong> (bukan angka cantik); (3) <strong>disetujui komite</strong>; (4) <strong>direview berkala</strong> (overlay harus luruh saat model diperbaiki).</p>
      <p><strong>Kapan menjadi manipulasi:</strong> overlay "pokoknya Rp 500 M" tanpa perhitungan, dipasang tiap kuartal untuk <strong>meratakan laba</strong> (<em>earnings smoothing</em>), atau tidak pernah dilepas. Auditor &amp; OJK sangat sensitif terhadap ini.</p>

      <PlotlyChart
        data={overlayData}
        title="ECL Model vs Overlay per Kuartal (Rp M) — Ilustrasi"
        layout={{ xaxis: { title: "Kuartal" }, yaxis: { title: "Rp Miliar" }, barmode: "stack", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang abu-abu = ECL model; kuning = overlay manajemen (ditumpuk).</p>
        <p><strong>Interpretasi:</strong> Q1–Q2 overlay stabil Rp 2 M (masuk akal: risiko spesifik). Q3–Q4 overlay melonjak ke Rp 5 M — <strong>pertanyaan audit</strong>: risiko apa yang tiba-tiba muncul? Atau laba yang sedang "diatur"? Overlay yang <strong>tumbuh tanpa penjelasan</strong> = red flag klasik.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> overlay yang sehat punya <strong>tanggal kedaluwarsa</strong>. Setiap overlay harus menjawab: "kapan ini dilepas?" (misal: setelah model satelit di-recalibrate dengan data banjir). Overlay abadi = model yang dibiarkan rusak + laba yang diatur manual.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Beta Makro Portofolio</h3>
      <p>Koefisien model satelit (misal: tiap +1% pengangguran → default rate +0,65%) adalah <strong>"beta makro"</strong> portofolio — ukuran kerapuhan terhadap resesi, analog dengan beta saham terhadap pasar. Portofolio KPR buruh pabrik punya beta tinggi (sensitif PHK); portofolio KPR PNS punya beta rendah. Analis yang tahu beta makro tiap segmen bisa menjawab pertanyaan direksi yang paling penting: <strong>"kalau resesi datang, segmen mana yang berdarah duluan?"</strong> — dan menyiapkan CKPN sebelum darahnya terlihat.</p>
      <p>Intuisi kedua: <strong>mengapa probability-weighting wajib, bukan sekadar baseline?</strong> Karena hubungan ekonomi → kerugian itu <strong>cembung (convex)</strong>: kerugian di skenario buruk jauh lebih besar dari penghematan di skenario baik. Rata-rata dari tiga skenario selalu lebih besar dari skenario tengah saja — selisihnya adalah "premi ketidakpastian" yang wajib diakui. PSAK 71 memaksa bank membayar premi ini — sebuah keputusan filosofis: <strong>ketidakpastian itu sendiri adalah biaya</strong>.</p>
      <p>Intuisi ketiga tentang overlay: setiap overlay harus punya <strong>tanggal kedaluwarsa</strong>. Overlay tanpa expiry = cadangan permanen yang tidak bisa dijelaskan — auditor akan menciumnya sebagai <em>earnings management</em>. Disiplin "kapan dilepas" membedakan judgment profesional dari manipulasi.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model satelit menerjemahkan "bahasa ekonom" menjadi "bahasa risiko". Analis yang bisa mengoperasikan kedua bahasa — membaca proyeksi BI lalu menerjemahkannya menjadi PD — adalah jembatan langka antara tim ekonomi dan tim risiko. Jembatan seperti ini yang dipromosikan.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Model Satelit</h2>
      <p>Terjemahkan ramalan pengangguran menjadi default rate — seperti analis ECL sungguhan.</p>
      <PyodideLab
        title="Lab 1 — Penerjemah Makro ke PD"
        hint="Coba ubah b (sensitivitas): 0.3 (portofolio kebal) vs 1.2 (portofolio rapuh). Lihat bagaimana skenario pesimis 'meledak' untuk portofolio rapuh — itulah beta makro."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Probability-Weighted ECL</h2>
      <p>Hitung ECL final dari 3 skenario — dan rasakan sensitivitasnya terhadap bobot.</p>
      <PyodideLab
        title="Lab 2 — Rata-rata Berbobot Skenario"
        hint="Coba: (1) prob pesimis 0.3 → 0.5 (seperti Q1 2020). (2) prob optimis 0.2 → 0.5 (manajemen terlalu optimis?). Bandingkan ECL final — selisihnya = 'harga' asumsi."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Overlay? Kapan Model?</h2>

      <div className="decision-card">
        <h3>1. Risiko baru belum di model (bencana, regulasi) → <strong>overlay sementara + rencana perbaikan model</strong></h3>
        <p><strong>Kondisi:</strong> banjir bandang memukul segmen perkebunan; model satelit belum mencakup variabel bencana.</p>
        <p><strong>Aksi:</strong> overlay dengan perhitungan eksposur terdampak + tanggal review. Paralel: kembangkan variabel bencana di model.</p>
      </div>

      <div className="decision-card">
        <h3>2. Model konsisten bias (backtest meleset 3 kuartal) → <strong>perbaiki model, bukan tambah overlay</strong></h3>
        <p><strong>Kondisi:</strong> ECL model selalu di bawah aktual.</p>
        <p><strong>Kenapa:</strong> overlay menutupi luka; rekalibrasi menyembuhkan. Overlay untuk bias sistematis = morfin, bukan obat.</p>
      </div>

      <div className="decision-card">
        <h3>3. Menetapkan bobot skenario → <strong>komite, bukan individu</strong></h3>
        <p><strong>Kondisi:</strong> revisi proyeksi ekonomi kuartalan.</p>
        <p><strong>Kenapa:</strong> sensitivitasnya triliunan (lihat Lab 2). Keputusan harus kolektif, terdokumentasi, dan konsisten dengan pandangan ekonomi resmi bank.</p>
      </div>

      <div className="decision-card">
        <h3>4. Overlay sudah 4 kuartal tidak berubah → <strong>tantang: lepas atau serap ke model</strong></h3>
        <p><strong>Kondisi:</strong> overlay "abadi".</p>
        <p><strong>Kenapa:</strong> overlay permanen = model cacat permanen + potensi earnings management. Setiap kuartal harus ada jawaban: masih relevan? kapan dilepas?</p>
      </div>

            <div className="decision-card">
        <h3>5. Proyeksi BI direvisi tajam 2× dalam sekuartal → <strong>jangan kejar setiap revisi; pakai koridor + trigger</strong></h3>
        <p><strong>Kondisi:</strong> proyeksi PDB direvisi dari 5% → 3% → 4,2% dalam 3 bulan. Setiap revisi mengubah ECL — tim akuntansi kelelahan, laba berayun liar.</p>
        <p><strong>Aksi:</strong> tetapkan <strong>koridor stabilitas</strong>: skenario dan probabilitas direview kuartalan (bukan tiap ada revisi), kecuali revisi melewati <strong>trigger</strong> yang disepakati (misal: perubahan proyeksi &gt;1,5 poin atau event luar biasa). Di antara review, pakai overlay untuk event spesifik. Tujuannya: ECL yang <strong>stabil tapi jujur</strong> — bukan ECL yang berayun mengikuti setiap headline. Governance skenario yang baik = prediktabilitas bagi direksi + kejujuran bagi auditor.</p>
        <p><strong>Contoh nyata:</strong> pada 2020, bank-bank yang merevisi skenario tiap minggu menghasilkan ECL yang "berisik" dan sulit dijelaskan ke OJK; yang memakai koridor + overlay terdokumentasi lolos dengan narasi yang jelas.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Satelit = penerjemah</strong> makro → PD. Kenali beta makro tiap segmen.</li>
          <li><strong>ECL = Σ prob × ECL skenario.</strong> Bukan skenario tunggal.</li>
          <li><strong>Bobot skenario = keputusan komite.</strong> Sensitivitasnya triliunan.</li>
          <li><strong>Overlay sah = spesifik + dihitung + disetujui + ada kedaluwarsa.</strong></li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Membangun Model Satelit yang Kredibel: 9 Langkah</h3>
      <p>Model satelit yang asal-asalan menghasilkan ECL asal-asalan. Sembilan langkah ini = standar minimum kredibilitas.</p>
      <ol>
        <li><strong>Pilih variabel makro per segmen (bukan satu untuk semua)</strong> — KPR → pengangguran + upah; KMK dagang → PDB + inflasi; tambang → harga komoditas; kartu kredit → pengangguran + suku bunga. Satu variabel untuk semua segmen = kemalasan metodologis.</li>
        <li><strong>Kumpulkan 10+ tahun data (mencakup 1 krisis)</strong> — Regresi dari 5 tahun data tenang = buta terhadap resesi. Minimal mencakup 2008, 2015, atau 2020 — tanpa preseden krisis, koefisienmu fiksi.</li>
        <li><strong>Uji lag yang benar</strong> — Pengangguran naik hari ini → default naik 6–12 bulan kemudian. Regresi tanpa lag = mengabaikan realitas transmisi. Uji lag 0–12 bulan, pilih yang paling kuat &amp; masuk akal.</li>
        <li><strong>Cek stabilitas koefisien</strong> — Beta 0,65 di 2010–2019 vs 0,40 di 2015–2024 = hubungan melemah (mungkin struktur ekonomi berubah). Koefisien yang tidak stabil = proyeksi yang tidak bisa dipercaya.</li>
        <li><strong>Dokumentasikan R² dan signifikansi</strong> — R² 0,3 = variabel menjelaskan 30% variasi default — sisanya faktor lain. Jujur soal keterbatasan = kredibel; mengklaim R² 0,95 = curiga overfit.</li>
        <li><strong>Tetapkan 3 skenario + probabilitas via governance</strong> — Bukan analis sendirian — melainkan komite (ekonomi + risiko + bisnis). Probabilitas didokumentasikan dengan alasan, direview kuartalan.</li>
        <li><strong>Tambahkan overlay untuk yang tidak tertangkap model</strong> — Event unprecedented, risiko spesifik sektor — overlay dengan dasar data + masa berlaku (CR4b). Model + overlay = ECL lengkap.</li>
        <li><strong>Backtest tiap tahun</strong> — Proyeksi 2023 vs realisasi 2024. Meleset sistematis = kalibrasi ulang. Model yang tidak pernah diuji = ramalan, bukan model.</li>
        <li><strong>Siapkan 'tombol darurat'</strong> — Prosedur tertulis: jika variabel makro bergerak &gt;2σ dalam sebulan, skenario di-review luar jadwal. 2020 mengajarkan: yang tidak punya tombol darurat = panik.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> jadikan ini SOP pembangunan &amp; review model satelit. Setiap langkah yang dilewati = asumsi yang tidak teruji = risiko yang tidak terlihat.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Forward-looking ECL di Indonesia diuji oleh dua guncangan besar: <strong>Covid-19</strong> dan <strong>volatilitas komoditas</strong>.</p>

      <h3>2020: Saat Semua Skenario Salah</h3>
      <p>Maret 2020: proyeksi ekonomi direvisi hampir tiap minggu. Model satelit bank-bank Indonesia — yang dikalibrasi dari data 2010–2019 (periode tenang) — <strong>tidak punya preseden</strong> untuk lockdown. Hasilnya: PD forward-looking melonjak liar, ECL meledak, dan manajemen terpaksa memakai <strong>overlay besar-besaran</strong> karena model "tidak masuk akal".</p>
      <p>Pelajaran yang dipetik industri: (1) model satelit butuh <strong>skenario stres yang ekstrem</strong> (bukan sekadar ±1% PDB), (2) overlay harus punya governance (bukan angka panik), (3) <strong>data frekuensi tinggi</strong> (mobility, transaksi harian) bisa menjadi leading indicator saat data makro resmi terlambat 1–2 bulan. Bank yang adaptif memakai indikator alternatif selamat lebih cepat.</p>

      <h3>Beta Makro per Segmen Indonesia</h3>
      <p>Variabel makro yang paling prediktif berbeda per segmen — analis Indonesia wajib tahu petanya:</p>
      <ul>
        <li><strong>KPR / konsumsi:</strong> tingkat pengangguran + pertumbuhan upah. PHK massal = default KPR melonjak 6–12 bulan kemudian (lag!).</li>
        <li><strong>KMK perdagangan:</strong> pertumbuhan PDB + daya beli (inflasi). Inflasi tinggi menggerus margin pedagang.</li>
        <li><strong>Korporasi komoditas (batubara, CPO, nikel):</strong> harga komoditas global — beta tertinggi. Harga batubara jatuh 50% = PD sektor melonjak (lihat CR18).</li>
        <li><strong>Kartu kredit:</strong> pengangguran + suku bunga (beban cicilan variabel).</li>
      </ul>
      <p>Model satelit yang memakai <strong>satu variabel untuk semua segmen</strong> = model yang malas. Segmentasi makro adalah standar praktik yang baik.</p>

      <h3>OJK dan Skenario: Uji Kecukupan yang Seragam</h3>
      <p>OJK secara berkala meminta bank melakukan <strong>stress test</strong> dengan skenario makro yang ditetapkan (atau divalidasi) regulator — memastikan bank-bank memakai asumsi yang <strong>sebanding</strong>. Bank tidak boleh memakai skenario "versi optimis sendiri" untuk ECL tanpa bisa mempertahankannya. Governance skenario (siapa menetapkan probabilitas, berapa sering direview) adalah bagian yang diaudit.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: ECL tertimbang skenario (klik untuk buka)</summary>
        <p>Portofolio KMK Rp 200 M. Model satelit menghasilkan PD per skenario: optimis 2% (prob 20%), baseline 4% (50%), pesimis 9% (30%). LGD 50%.</p>
        <p><strong>Langkah 1</strong> — ECL per skenario = PD × LGD × EAD:<br />
        Optimis: 0,02 × 0,5 × 200.000 = Rp 2.000 jt.<br />
        Baseline: 0,04 × 0,5 × 200.000 = Rp 4.000 jt.<br />
        Pesimis: 0,09 × 0,5 × 200.000 = Rp 9.000 jt.<br />
        <strong>Langkah 2</strong> — tertimbang: 0,2×2.000 + 0,5×4.000 + 0,3×9.000 = 400 + 2.000 + 2.700 = <strong>Rp 5.100 jt</strong>.<br />
        <strong>Langkah 3</strong> — bandingkan baseline saja (Rp 4.000 jt): premi ketidakpastian = <strong>+Rp 1.100 jt (+27,5%)</strong>.</p>
        <p><strong>Pelajaran:</strong> skenario pesimis (prob hanya 30%) menyumbang Rp 2.700 jt — <strong>lebih dari separuh</strong> ECL final. Inilah konveksitas: ekor buruk mendominasi.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Skenario pesimis dengan probabilitas 30% itu terlalu pesimis — tidak realistis."</strong></p>
        <p><strong>Yang benar:</strong> skenario bukan ramalan "paling mungkin" — melainkan <strong>cakupan ketidakpastian</strong>. Bahkan jika resesi "hanya" 10% mungkin terjadi, kerugiannya yang raksasa wajib tercermin (tertimbang 10%). Menghapus skenario buruk karena "tidak realistis" = menghapus premi ketidakpastian = ECL underestimate. PSAK 71 mewajibkan <em>unbiased probability-weighted</em> — bukan <em>most-likely</em>.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Overlay Rp 500 M yang Diperdebatkan</h2>
      <div className="callout">
        <p>Q4 2026, manajemen Bank Nusantara mengusulkan <strong>overlay Rp 500 M</strong> (menaikkan CKPN) dengan alasan "ketidakpastian ekonomi global". Fakta:</p>
        <ul>
          <li>Tidak ada <strong>perhitungan rinci</strong> — angka Rp 500 M "kesepakatan manajemen".</li>
          <li>Model ECL sudah mencakup 3 skenario dengan bobot yang disetujui komite.</li>
          <li>Overlay serupa Rp 400 M dipasang Q3 — <strong>belum pernah direview/dilepas</strong>.</li>
          <li>Laba tahun ini <strong>di atas target</strong> — analis curiga overlay dipakai "menabung" laba.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis risiko (bukan akuntan), apa posisimu? Susun argumen penolakan/persetujuan bersyarat.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tolak dalam bentuk saat ini; setujui bersyarat.</strong> Argumen:</p>
          <p>(1) <strong>Tidak spesifik:</strong> "ketidakpastian global" sudah tercakup di skenario pesimis model — overlay ganda = double counting.<br />
          (2) <strong>Tidak dihitung:</strong> Rp 500 M tanpa metodologi = angka politik, bukan risiko.<br />
          (3) <strong>Pola earnings management:</strong> overlay Q3 belum direview + laba di atas target = indikasi <em>cookie jar reserve</em> (menabung laba saat bagus, dipakai saat jelek).<br />
          (4) <strong>Solusi:</strong> jika memang ada risiko spesifik (misal: eksposur ke sektor tertentu), hitung <strong>bottom-up</strong> (eksposur × stress PD) + tetapkan tanggal review Q1. Overlay tanpa kedaluwarsa = bom audit.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Skenario Siapa yang Dipakai?</h2>
      <div className="callout">
        <p>Bank Nusantara, Q4 2026. Tim ekonomi internal memproyeksi PDB 2027: baseline 4,8%. BI memproyeksi 4,2%. IMF 3,9%. Kepala ekonom bank (optimis) mengusulkan probabilitas: optimis 40%, baseline 50%, pesimis 10%. Kamu sebagai analis risiko merasa probabilitas pesimis terlalu kecil.</p>
        <ul>
          <li>Dengan bobot usulan: ECL = Rp 12 M.</li>
          <li>Dengan bobotmu (optimis 20%, baseline 50%, pesimis 30%): ECL = Rp 15,5 M.</li>
          <li>Selisih Rp 3,5 M = selisih laba kuartal yang material. Direksi cenderung setuju usulan ekonom (labanya lebih bagus).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> bagaimana kamu mempertahankan bobotmu tanpa terlihat "sengaja menjelekkan laba"? Argumen apa yang paling kuat di depan komite?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Jangan debat soal "siapa lebih pintar meramal"</strong> — debat soal <strong>prinsip</strong>: (1) PSAK 71 menuntut <em>unbiased</em> — bobot harus mencerminkan ketidakpastian, bukan harapan. Tiga sumber resmi (internal, BI, IMF) menunjukkan <strong>rentang</strong> 3,9–4,8%: ketidakpastian lebar → bobot pesimis wajar besar. (2) Tunjukkan <strong>asimetri</strong>: jika optimis benar, bank "hanya" kelebihan cadangan Rp 3,5 M (bisa dilepas kuartal depan); jika pesimis benar dan cadangan kurang, bank menghadapi temuan OJK + restatement. (3) Usulkan <strong>kompromi metodologis</strong>: bobot berbasis sebaran historis forecast error (berapa sering proyeksi meleset 1%+?), bukan opini.</p>
          <p>Kalimat kunci: <em>"Saya tidak meramal resesi — saya menghargai ketidakpastian. Rp 3,5 M adalah premi asuransi, bukan vonis."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Apa fungsi model satelit dalam rantai ECL?"
        options={[
          "Menggantikan scorecard",
          "Penerjemah: mengubah ramalan makro (pengangguran, GDP) menjadi penyesuaian PD/LGD — scorecard menilai 'siapa', satelit menyesuaikan 'kapan'",
          "Menghitung bunga kredit",
          "Membuat laporan keuangan",
        ]}
        correct={1}
        explanation="Benar: satelit mengorbit model utama. Ia menjawab 'bagaimana kondisi ekonomi mengubah risiko?' — jembatan makro ke mikro."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. ECL: optimis Rp 8 M (20%), baseline Rp 14 M (50%), pesimis Rp 28 M (30%). ECL final?"
        options={[
          "Rp 14 M (pakai baseline saja)",
          "Rp 16,67 M (rata-rata biasa)",
          "Rp 17,0 M (0,2×8 + 0,5×14 + 0,3×28) — probability-weighted",
          "Rp 28 M (pakai yang terburuk)",
        ]}
        correct={2}
        explanation="Benar: 1,6 + 7,0 + 8,4 = Rp 17,0 M. Lebih besar dari baseline (Rp 14 M) karena kerugian non-linear — 'premi kejujuran' atas ketidakpastian."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Kapan overlay manajemen dianggap SAH?"
        options={[
          "Kapan saja — hak manajemen",
          "Jika spesifik (risiko belum di model), dihitung (bukan angka cantik), disetujui komite, dan ada tanggal review/kedaluwarsa",
          "Jika laba di atas target",
          "Tidak pernah — overlay selalu manipulasi",
        ]}
        correct={1}
        explanation="Benar: empat syarat itu. Overlay adalah alat sah untuk keterbatasan model — yang membuatnya menjadi manipulasi adalah ketiadaan perhitungan, persetujuan, dan kedaluwarsa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Bobot skenario pesimis dinaikkan 30% → 50% (seperti Q1 2020). Dampaknya?"
        options={[
          "Tidak ada — bobot hanya formalitas",
          "ECL final naik signifikan → CKPN melonjak → laba anjlok — dalam contoh kita dari Rp 17 M ke Rp 21 M (+24%)",
          "ECL turun",
          "Hanya mempengaruhi laporan, bukan laba",
        ]}
        correct={1}
        explanation="Benar: sensitivitas triliunan. Inilah mengapa penetapan bobot = keputusan komite, bukan analis sendirian — dan mengapa Q1 2020 laba bank anjlok 'tanpa ada yang macet'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Overlay Rp 400 M sudah 3 kuartal tidak direview, kini diusulkan tambah Rp 500 M tanpa perhitungan. Red flag-nya?"
        options={[
          "Tidak ada — manajemen berhak",
          "Pola cookie-jar reserve (earnings management): overlay abadi + tanpa metodologi + laba di atas target = menabung laba, bukan mencerminkan risiko",
          "Overlay selalu bagus",
          "Kurang besar overlay-nya",
        ]}
        correct={1}
        explanation="Benar: tiga ciri earnings management terpenuhi. Auditor/OJK akan membongkar ini — analis risiko yang diam ikut bertanggung jawab."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. ECL baseline Rp 14 M; ECL tertimbang 3 skenario Rp 17 M. Selisih Rp 3 M (+21%) disebut apa dan mengapa wajib diakui?"
        options={[
          "Kesalahan model — harus dikoreksi ke baseline",
          "Premi ketidakpastian — hubungan ekonomi→kerugian cembung sehingga rata-rata skenario > skenario tengah; PSAK 71 mewajibkan probability-weighting yang unbiased",
          "Overlay manajemen",
          "Laba yang disembunyikan",
        ]}
        correct={1}
        explanation="Benar: premi ketidakpastian. Karena konveksitas, skenario buruk menyumbang lebih dari yang dihemat skenario baik. Mengakui hanya baseline = mengabaikan biaya ketidakpastian itu sendiri."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Proyeksi ekonomi direvisi 3× dalam sekuartal. Praktik governance skenario yang sehat?"
        options={[
          "Revisi ECL setiap ada proyeksi baru — harus selalu terkini",
          "Koridor stabilitas: review kuartalan, kecuali revisi melewati trigger yang disepakati; overlay untuk event spesifik di antaranya",
          "Pakai proyeksi tahun lalu saja — stabil",
          "Serahkan ke auditor",
        ]}
        correct={1}
        explanation="Benar: koridor + trigger. ECL yang berayun tiap headline = berisik dan sulit dijelaskan. Review kuartalan dengan trigger untuk event luar biasa memberi stabilitas tanpa mengorbankan kejujuran."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Model satelit</strong> = penerjemah makro → PD/LGD. Kenali beta makro tiap segmen.</li>
          <li><strong>ECL = Σ P(skenario) × ECL(skenario)</strong> — wajib multi-skenario, bukan ramalan tunggal.</li>
          <li><strong>Non-linearitas</strong>: skenario pesimis mendominasi — mengabaikannya = underestimate.</li>
          <li><strong>Overlay sah</strong> = spesifik + dihitung + disetujui + berkedaluwarsa.</li>
          <li><strong>Bobot skenario = keputusan komite</strong> — sensitivitasnya triliunan rupiah.</li>
          <li>Kapan TIDAK menambah overlay: risiko sudah tercakup model (double counting) atau modelnya yang bias sistematis (perbaiki modelnya).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr10-pd-modeling" className="btn btn-secondary btn-sm">← CR10</Link>
        <Link href="/learn/cr12-lgd" className="btn btn-primary btn-sm">Next: CR12 →</Link>
      </div>
    </div>
  );
}
