"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr4bPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const stageData = [
    {
      x: ["Stage 1", "Stage 2", "Stage 3"],
      y: [90, 7, 3],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444"] },
      text: ["90% (ECL 12 bln)", "7% (ECL lifetime)", "3% (ECL lifetime)"],
      textposition: "outside",
    },
  ];

  const eclJumpData = [
    {
      x: ["Stage 1\n(PD 12 bln)", "Stage 2\n(PD lifetime)"],
      y: [4.5, 38],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838"] },
      text: ["Rp 4,5 jt", "Rp 38 jt"],
      textposition: "outside",
    },
  ];

  const sicrMigrationData = [
    {
      x: ["Q1", "Q2", "Q3", "Q4"],
      y: [5.0, 5.8, 8.5, 7.2],
      type: "scatter",
      mode: "lines+markers",
      name: "% portofolio di Stage 2",
      line: { color: "#e8a838", width: 3 },
      marker: { size: 8 },
    },
  ];

  const lab1Code = `# Lab 1: Mesin SICR — kapan kredit pindah Stage?
# Ubah pd_awal / pd_kini, lalu jalankan.
pd_awal = 0.015   # PD saat kredit diberikan (origination)
pd_kini = 0.040   # PD saat ini (hasil monitoring)

rasio = pd_kini / pd_awal
dpd = 35  # hari keterlambatan saat ini

# Kriteria SICR (ilustrasi praktik umum bank):
# 1) PD naik >= 2x lipat, ATAU 2) DPD >= 30 hari
sicr = (rasio >= 2.0) or (dpd >= 30)

print(f"PD awal : {pd_awal*100:.1f}%")
print(f"PD kini : {pd_kini*100:.1f}%  ({rasio:.1f}x lipat)")
print(f"DPD     : {dpd} hari")
print(f"SICR?   : {'YA -> pindah Stage 2' if sicr else 'TIDAK -> tetap Stage 1'}")
print()
print("Coba 1: pd_kini = 0.025 (naik 1.7x), dpd = 0. Masih Stage 1?")
print("Coba 2: pd_kini = 0.020 (naik 1.3x), dpd = 35. Stage berapa?")
print("Pelajaran: backstop 30 hari bisa memicu Stage 2 BAHKAN")
print("saat model PD belum melihat masalah — jaring pengaman ganda.")`;

  const lab2Code = `# Lab 2: Lompatan ECL — Stage 1 vs Stage 2 vs Stage 3
# Kredit Rp 500 jt, tenor 5 tahun. Ubah lifetime_pd, lihat lompatannya.
ead = 500        # juta Rp
lgd = 0.45
pd_12m = 0.02
lifetime_pd = 0.09   # PD kumulatif selama sisa tenor

ecl_s1 = pd_12m * lgd * ead
ecl_s2 = lifetime_pd * lgd * ead
ecl_s3 = 1.0 * lgd * ead   # sudah default: PD = 100%

print(f"Stage 1 (PD 12 bln {pd_12m*100:.0f}%)      : Rp {ecl_s1:.1f} jt")
print(f"Stage 2 (lifetime PD {lifetime_pd*100:.0f}%)     : Rp {ecl_s2:.1f} jt  ({ecl_s2/ecl_s1:.1f}x!)")
print(f"Stage 3 (default, PD 100%)     : Rp {ecl_s3:.1f} jt")
print()
print("Coba: naikkan lifetime_pd jadi 0.15 (debitur makin parah).")
print("Rasio Stage2/Stage1 membesar — inilah 'cliff effect':")
print("perpindahan stage menghantam laba sekaligus, bukan bertahap.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR4b — Credit Risk Analyst • Regulasi Part 2</span>
        <h1 className="display-title">IFRS 9 / PSAK 71:<br />Stage 1-2-3, SICR, dan ECL</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Laba yang Menguap dalam Semalam</a></li>
          <li><a href="#revolusi">Revolusi: Dari "Sudah Rugi" ke "Akan Rugi"</a></li>
          <li><a href="#stage">Tiga Stage: Ruang Rawat Inap Kredit</a></li>
          <li><a href="#sicr">SICR — Detektor Dini yang Menentukan Nasib Laba</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mesin SICR</a></li>
          <li><a href="#lab2">🔬 Lab 2: Lompatan ECL antar Stage</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Pindah Stage?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Migrasi Massal ke Stage 2</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan perbedaan incurred loss (PSAK 55) vs expected credit loss (PSAK 71) dan mengapa perubahannya fundamental.</li>
          <li>Menentukan stage (1/2/3) suatu kredit berdasarkan kriteria SICR, termasuk backstop 30 hari.</li>
          <li>Menghitung ECL 12-bulan vs lifetime dan menjelaskan <em>cliff effect</em> perpindahan stage.</li>
          <li>Menganalisis dampak migrasi stage terhadap laba bank dan mengidentifikasi risiko manipulasi staging.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Laba yang Menguap dalam Semalam</h2>
      <div className="story">
        <p>Akhir 2019, Bank Nusantara membukukan laba <strong>Rp 2,1 triliun</strong> — direksi tersenyum, bonus cair. Tiga bulan kemudian, pandemi. Tim risiko menjalankan ulang model ECL: ribuan debitur yang tadinya Stage 1 <strong>bermigrasi ke Stage 2</strong> karena prospek ekonominya memburuk.</p>
        <p>Hasilnya: cadangan (CKPN) melonjak <strong>Rp 1,4 triliun dalam satu kuartal</strong>. Laba tahun berjalan langsung terpangkas dua pertiganya — <em>padahal belum ada satu pun debitur yang benar-benar macet</em>. Para direktur syok: <em>"Kok bisa rugi padahal belum ada yang gagal bayar?!"</em></p>
        <p>Jawabannya: <strong>PSAK 71</strong> (adopsi Indonesia dari IFRS 9, berlaku 1 Januari 2020). Cadangan tidak lagi menunggu kerugian <em>terjadi</em> — melainkan mencadangkan kerugian yang <em>diperkirakan akan terjadi</em>. Laba bank kini bergerak mengikuti <strong>ekspektasi masa depan</strong>, bukan cuma realisasi masa lalu.</p>
        <p><strong>Twist-nya:</strong> aturan akuntansi ini mengubah perilaku bank secara fundamental — dan menciptakan pekerjaan baru: analis ECL. Lesson ini adalah pintu masuknya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="revolusi">Revolusi: Dari "Sudah Rugi" ke "Akan Rugi"</h2>
      <p><strong>Definisi.</strong> Sebelum 2020 (PSAK 55, <em>incurred loss</em>): cadangan dibentuk <strong>setelah</strong> ada bukti objektif kerugian (telat bayar, bangkrut). Sejak 2020 (PSAK 71, <em>expected credit loss</em>): cadangan dibentuk berdasarkan <strong>ekspektasi kerugian masa depan</strong> — <em>sebelum</em> ada tunggakan.</p>
      <p><strong>Kepribadian:</strong> PSAK 55 seperti <strong>pemadam kebakaran</strong> — baru bergerak saat api terlihat. PSAK 71 seperti <strong>detektor asap</strong> — berbunyi saat mencium bau hangus. Detektor asap menyelamatkan lebih banyak rumah, tapi juga lebih sering <em>false alarm</em> — dan tiap alarm berbayar mahal (cadangan naik, laba turun).</p>
      <p><strong>Mengapa berubah?</strong> Krisis 2008 membuktikan incurred loss <strong>terlambat</strong>: bank-bank terlihat sehat sampai detik sebelum kolaps karena cadangannya baru dibentuk saat semuanya sudah terbakar. G20 memerintahkan perubahan global → IFRS 9 → PSAK 71.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "PSAK 71 hanya urusan akuntan — analis risiko tidak perlu paham."</strong></p>
        <p><strong>Yang benar:</strong> ECL = PD × LGD × EAD yang <strong>forward-looking</strong> — dan PD/LGD/EAD adalah <em>makanan sehari-hari analis risiko</em> (CR3, CR10–CR13). Di bank modern, tim risiko <strong>memasok modelnya</strong>, tim akuntansi <strong>mencatatnya</strong>. Analis yang tidak paham PSAK 71 tidak akan paham mengapa modelnya bisa menggerakkan laba bank Rp 1 triliun dalam sekuartal.</p>
      </div>

      <h2 id="stage">Tiga Stage: Ruang Rawat Inap Kredit</h2>
      <p><strong>Definisi.</strong> PSAK 71 membagi setiap kredit ke 3 stage berdasarkan <strong>perubahan risiko sejak awal diberikan</strong>:</p>
      <ul>
        <li><strong>Stage 1 — Sehat</strong> 🟢: risiko <em>tidak</em> meningkat signifikan sejak origination. Cadangan = <strong>ECL 12 bulan</strong> (PD 12-bulan × LGD × EAD).</li>
        <li><strong>Stage 2 — Risiko meningkat signifikan (SICR)</strong> 🟡: risiko naik signifikan TAPI belum default. Cadangan = <strong>ECL lifetime</strong> (PD selama sisa tenor × LGD × EAD) — <strong>melonjak berkali-kali lipat</strong>.</li>
        <li><strong>Stage 3 — Default / impaired</strong> 🔴: sudah gagal bayar (umumnya DPD &gt;90 atau kriteria unlikeliness-to-pay). Cadangan = <strong>ECL lifetime</strong> dengan PD = 100%.</li>
      </ul>
      <Tex math={String.raw`\text{ECL} = \sum_{t} \frac{\text{PD}_t \times \text{LGD}_t \times \text{EAD}_t}{(1+r)^t} \times \text{probabilitas skenario}`} block />
      <p><strong>Artinya tiap simbol:</strong> jumlahkan untuk tiap tahun <Tex math={String.raw`t`} /> ke depan: PD/LGD/EAD tahun itu, didiskonto dengan suku bunga <Tex math={String.raw`r`} /> (nilai waktu uang), lalu rata-ratakan berbobot atas beberapa <strong>skenario ekonomi</strong> (baseline, optimis, pesimis — detail di CR11/CR14). Stage 1 hanya menjumlah <Tex math={String.raw`t=1`} /> (12 bulan); Stage 2/3 menjumlah seluruh sisa tenor.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>KPR Rp 500 jt, LGD 45%, PD 12-bulan 2%, PD lifetime (sisa tenor) 9%.</p>
        <p><strong>Stage 1:</strong> ECL = 0,02 × 0,45 × 500 = <strong>Rp 4,5 jt</strong>.<br />
        <strong>Stage 2:</strong> ECL = 0,09 × 0,45 × 500 = <strong>Rp 20,25 jt</strong> — naik <strong>4,5× lipat</strong> hanya karena pindah stage!<br />
        <strong>Stage 3:</strong> ECL = 1,0 × 0,45 × 500 = <strong>Rp 225 jt</strong>.</p>
        <p>Perhatikan <strong>lompatannya tidak linear</strong> — inilah <em>cliff effect</em>: perpindahan stage menghantam laba sekaligus.</p>
      </details>

      <PlotlyChart
        data={stageData}
        title="Ilustrasi Distribusi Stage Portofolio Bank Sehat"
        layout={{ xaxis: { title: "Stage" }, yaxis: { title: "% portofolio" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiga batang = porsi portofolio di tiap stage (angka ilustratif bank sehat).</p>
        <p><strong>Interpretasi:</strong> 90% di Stage 1 (normal), 7% Stage 2, 3% Stage 3. Yang dipantau analis: <strong>tren Stage 2</strong>. Kenaikan 7% → 12% dalam sekuartal = sirene — cadangan akan melonjak meski NPL belum bergerak. Stage 2 adalah <strong>NPL-nya PSAK 71</strong>: indikator awal sebelum kredit benar-benar macet.</p>
      </div>

      <PlotlyChart
        data={eclJumpData}
        title="Cliff Effect: ECL Melonjak 8,4× Saat Pindah Stage 1 → 2"
        layout={{ xaxis: { title: "" }, yaxis: { title: "ECL (Rp juta)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = ECL kredit yang sama (Rp 500 jt) di Stage 1 vs Stage 2.</p>
        <p><strong>Interpretasi:</strong> kredit yang sama, debitur yang sama, belum ada tunggakan — tapi cadangannya melonjak <strong>8,4× lipat</strong> (Rp 4,5 jt → Rp 38 jt) hanya karena risiko <em>dinilai</em> meningkat. Inilah mengapa definisi SICR (bagian berikut) adalah <strong>keputusan paling politis</strong> di bank: menggeser ambang SICR sedikit = menggeser laba ratusan miliar.</p>
      </div>

      <h2 id="sicr">SICR — Detektor Dini yang Menentukan Nasib Laba</h2>
      <p><strong>Definisi.</strong> SICR (<em>Significant Increase in Credit Risk</em>) = kriteria yang menentukan kapan kredit pindah Stage 1 → Stage 2. Dua komponen wajib:</p>
      <ul>
        <li><strong>Kriteria kuantitatif:</strong> PD saat ini naik signifikan dibanding PD saat origination — praktik umum: <strong>naik ≥2× lipat</strong> (atau melewati ambang absolut). Bank menetapkan sendiri angkanya (dan mempertahankannya ke auditor/OJK).</li>
        <li><strong>Backstop 30 hari:</strong> DPD ≥ 30 hari <strong>otomatis</strong> dianggap SICR — jaring pengaman bila model PD telat merespons.</li>
      </ul>
      <p><strong>Kepribadian:</strong> SICR seperti <strong>termometer demam</strong> — 37,5°C vs 38°C, ambangnya bisa diperdebatkan, tapi harus konsisten. Bank yang ambangnya terlalu longgar = demam tidak terdeteksi (laba terlihat bagus, bom menumpuk). Terlalu ketat = semua orang dianggap demam (cadangan bengkak, laba anjlok, direksi marah).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> SICR membandingkan risiko <strong>relatif terhadap awal</strong>, bukan absolut. Kredit yang lahir berisiko (PD awal 8%) lalu membaik (PD kini 5%) = <strong>tetap Stage 1</strong> meski PD-nya lebih tinggi dari KPR prima (PD 2%). Yang diukur adalah <em>perubahan</em>, bukan <em>level</em>. Ini jebakan favorit soal ujian sertifikasi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Stage 2 = kredit bermasalah / akan macet."</strong></p>
        <p><strong>Yang benar:</strong> Stage 2 = risiko <em>meningkat signifikan</em>, bukan <em>macet</em>. Banyak kredit Stage 2 yang akhirnya sembuh kembali ke Stage 1 (disebut <em>curing</em>). Menyamakan Stage 2 dengan NPL = salah membaca laporan keuangan bank — seperti menyamakan "demam" dengan "kritis".</p>
      </div>

      <PlotlyChart
        data={sicrMigrationData}
        title="Ilustrasi Tren Migrasi Stage 2 (peringatan dini)"
        layout={{ xaxis: { title: "Kuartal" }, yaxis: { title: "% portofolio di Stage 2" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = porsi portofolio di Stage 2 per kuartal.</p>
        <p><strong>Interpretasi:</strong> lonjakan Q2 → Q3 (5,8% → 8,5%) = sinyal resesi sektoral atau pelonggaran underwriting 1–2 tahun lalu yang kini berbuah. Analis yang baik tidak menunggu Q4 — ia sudah menyelidiki <em>sebab</em> migrasi di Q3: segmen apa? wilayah mana? kohort pencairan kapan? (Menjawabnya butuh vintage analysis — CR6.)</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: ECL adalah Mesin Waktu Laba</h3>
      <p>Sebelum PSAK 71, laba bank adalah <strong>cerita masa lalu</strong>: bunga yang sudah diterima dikurangi kerugian yang sudah terbukti. Setelah PSAK 71, laba bank menjadi <strong>campuran masa lalu dan ramalan masa depan</strong> — karena ECL memakai PD forward-looking (CR11) yang berubah mengikuti prakiraan ekonomi. Konsekuensinya dalam: <strong>dua bank dengan portofolio identik bisa melaporkan laba berbeda</strong> hanya karena asumsi makro mereka beda. Analis yang membaca laporan keuangan bank kini wajib membaca juga "catatan asumsi ECL" — di sanalah optimisme/pesimisme manajemen disembunyikan.</p>
      <p>Intuisi kedua: <strong>PSAK 71 itu procyclical</strong> — ia memperdalam siklus. Saat ekonomi memburuk, PD forward-looking naik → ECL melonjak → laba anjlok → bank mengetatkan kredit → ekonomi makin memburuk. Saat ekonomi bagus, sebaliknya. Regulator sadar akan hal ini (itulah salah satu alasan ada <em>management overlay</em> dan buffer modal), tetapi belum ada obat sempurnanya. Analis yang paham procyclicality tidak akan panik saat ECL melonjak di awal resesi — ia tahu itu <strong>fitur akuntansi</strong>, bukan vonis.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> hafalkan rantai sebab-akibat ini: prakiraan PDB direvisi turun → PD forward-looking naik → SICR terpicu massal → migrasi Stage 1→2 → ECL melonjak 4–8× per kredit → laba kuartal anjlok. Satu revisi prakiraan ekonomi bisa menggerakkan laba bank ratusan miliar. Inilah mengapa tim risiko kini duduk sejajar dengan tim ekonomi dalam rapat direksi.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Mesin SICR</h2>
      <p>Simulasikan logika staging bank: PD naik berapa × dan DPD berapa yang memicu Stage 2?</p>
      <PyodideLab
        title="Lab 1 — Simulator Kriteria SICR"
        hint="Coba: (1) PD naik 1,9× tapi DPD 0 — stage berapa? (2) PD naik 1,1× tapi DPD 35 — stage berapa? Rasakan peran backstop 30 hari sebagai jaring pengaman."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Lompatan ECL antar Stage</h2>
      <p>Hitung sendiri cliff effect-nya — dari Rp 4,5 jt menjadi Rp 225 jt untuk kredit yang sama.</p>
      <PyodideLab
        title="Lab 2 — ECL Stage 1 vs 2 vs 3"
        hint="Coba naikkan lifetime_pd bertahap (0.05 → 0.09 → 0.15 → 0.25). Perhatikan rasio Stage2/Stage1 — inilah mengapa bank sangat berhati-hati menetapkan ambang SICR."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Pindah Stage?</h2>

      <div className="decision-card">
        <h3>1. PD naik &lt;2×, DPD 0, ekonomi stabil → <strong>tetap Stage 1</strong></h3>
        <p><strong>Kondisi:</strong> fluktuasi normal, tidak ada sinyal deteriorasi.</p>
        <p><strong>Kenapa:</strong> SICR mengukur perubahan <em>signifikan</em> — noise kecil tidak memicu. ECL tetap 12-bulan.</p>
      </div>

      <div className="decision-card">
        <h3>2. PD naik ≥2× sejak origination → <strong>pindah Stage 2</strong></h3>
        <p><strong>Kondisi:</strong> model PD mendeteksi penurunan kualitas (misal: skor perilaku turun, SLIK memburuk).</p>
        <p><strong>Kenapa:</strong> kriteria kuantitatif SICR terpenuhi. ECL menjadi lifetime — siapkan penjelasan ke direksi soal dampak laba.</p>
        <p><strong>Contoh nyata:</strong> debitur UKM yang mutasi rekeningnya turun 50% dalam 3 bulan — PD model naik 2,5×.</p>
      </div>

      <div className="decision-card">
        <h3>3. DPD ≥30 hari (apapun PD-nya) → <strong>pindah Stage 2 (backstop)</strong></h3>
        <p><strong>Kondisi:</strong> telat bayar 30+ hari.</p>
        <p><strong>Kenapa:</strong> backstop regulator — jaring pengaman bila model PD lambat. Tidak bisa di-override dengan "tapi model saya bilang aman".</p>
      </div>

      <div className="decision-card">
        <h3>4. DPD &gt;90 hari / unlikely to pay → <strong>Stage 3</strong></h3>
        <p><strong>Kondisi:</strong> memenuhi definisi default (detail CR5).</p>
        <p><strong>Kenapa:</strong> PD = 100%, ECL = LGD × EAD penuh. Bunga tidak lagi diakui penuh (unwinding).</p>
      </div>

      <div className="decision-card">
        <h3>5. Stage 2 membaik 6–12 bulan berturut-turut → <strong>curing kembali ke Stage 1</strong></h3>
        <p><strong>Kondisi:</strong> PD turun kembali, DPD 0 konsisten.</p>
        <p><strong>Kenapa:</strong> stage bisa dua arah. Tapi butuh <em>probation period</em> — tidak bisa naik-turun tiap bulan (mencegah manipulasi laba via staging).</p>
      </div>

            <div className="decision-card">
        <h3>6. Auditor menantang overlay Rp 50 M milikmu → <strong>pertahankan dengan dokumentasi, bukan otot</strong></h3>
        <p><strong>Kondisi:</strong> kamu mengusulkan management overlay Rp 50 M untuk sektor tekstil (data PHK massal). Auditor eksternal menilai overlay "terlalu besar dan subjektif" dan meminta dihapus.</p>
        <p><strong>Aksi:</strong> jangan berdebat soal "feeling" — tunjukkan metodologi: (1) dasar data (statistik PHK Disnaker, penurunan utilitas pabrik), (2) kalkulasi (skenario × probabilitas, bukan angka tunggal), (3) masa berlaku &amp; trigger review, (4) persetujuan komite risiko. Overlay yang metodologis <strong>bertahan di audit</strong>; overlay yang "kata saya sih segini" runtuh. Jika auditor tetap menolak, negosiasi besaran dengan skenario alternatif — bukan perang.</p>
        <p><strong>Contoh nyata:</strong> pada 2020–2021, bank-bank Indonesia yang overlay-nya didokumentasikan rapi lolos audit dengan mulus; yang overlay-nya "pokoknya tambah 30%" dipaksa merevisi dan menjelaskan ke OJK. Dokumentasi = nyawa overlay.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>SICR = perubahan relatif</strong> (vs saat lahir), bukan level absolut.</li>
          <li><strong>Backstop 30 hari tidak bisa dinegosiasi</strong> — DPD 30+ = Stage 2, titik.</li>
          <li><strong>Stage 2 ≠ macet.</strong> Jangan samakan dengan NPL.</li>
          <li><strong>Waspadai staging yang "terlalu rapi"</strong> — Stage 2 yang tidak pernah naik saat ekonomi memburuk = red flag audit.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Audit ECL 15 Menit</h3>
      <p>Diberi angka ECL bank? Jangan telan mentah-mentah. Lima belas menit, 7 pertanyaan — dan kamu tahu apakah angkanya jujur.</p>
      <ol>
        <li><strong>Asumsi makronya apa?</strong> — Cek catatan laporan: PDB, pengangguran, suku bunga per skenario. Terlalu optimis vs BI/IMF = ECL underestimate.</li>
        <li><strong>Bobot skenarionya wajar?</strong> — Pesimis di bawah 15% tanpa alasan kuat = 'menghapus' premi ketidakpastian. Minta justifikasi.</li>
        <li><strong>Migrasi Stage 2-nya masuk akal?</strong> — Stage 2 nol persen = tidak mungkin (pasti ada yang disembunyikan). Stage 2 melonjak tanpa penjelasan = ambang SICR berubah diam-diam?</li>
        <li><strong>Ada overlay? Berapa? Mengapa?</strong> — Overlay tanpa dokumentasi = angka ajaib. Overlay yang sehat: dasar data + metodologi + masa berlaku.</li>
        <li><strong>Bagaimana backtesting-nya?</strong> — ECL 12 bulan lalu vs realisasi kini. Sistematis underestimate = model harus dikalibrasi ulang.</li>
        <li><strong>Konsisten dengan kolektibilitas?</strong> — Kolek 1 massal + ECL raksasa (atau sebaliknya) = dua bahasa yang bertentangan. Minta rekonsiliasi.</li>
        <li><strong>Dibanding peer?</strong> — CoR/ECL jauh di bawah bank sejenis dengan portofolio mirip = terlalu optimis (atau terlalu pintar — verifikasi!).</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tujuh pertanyaan ini = due diligence ECL versi analis. Yang tidak bisa dijawab bank = temuanmu.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ ECL naik tajam padahal tidak ada yang macet — bagaimana menjelaskan ke direksi?</summary>
        <p>Kalimatnya: 'Tidak ada yang macet, tetapi <strong>risiko masa depan naik</strong> — prakiraan ekonomi memburuk → PD forward-looking naik → SICR terpicu → ECL naik. Ini <strong>fitur</strong> PSAK 71 (jujur lebih awal), bukan bug. Alternatifnya (tunggu macet dulu) = incurred loss yang terbukti gagal 2008.'</p>
      </details>
      <details className="worked">
        <summary>❓ Stage 2 besar — apakah banknya sekarat?</summary>
        <p>Belum tentu. Stage 2 = <strong>risiko meningkat</strong>, bukan macet — banyak yang sembuh (curing). Yang perlu ditanya: <strong>tren</strong> Stage 2 (naik terus?), <strong>penyebab</strong> (SICR massal karena model atau risiko riil?), dan <strong>coverage</strong>-nya. Stage 2 yang transparan + termonitor = bank jujur; Stage 2 nol persen = bank yang menyembunyikan.</p>
      </details>
      <details className="worked">
        <summary>❓ Bolehkah bank mengubah ambang SICR agar laba bagus?</summary>
        <p>Tidak — kecuali via <strong>kajian independen + persetujuan komisaris + dilaporkan ke OJK/auditor</strong>. Mengubah ambang untuk 'mengatur' laba = manipulasi = temuan berat. Ambang SICR adalah konstitusi, bukan tombol volume.</p>
      </details>
      <details className="worked">
        <summary>❓ Overlay tiap kuartal naik — wajar?</summary>
        <p>Wajar jika <strong>ada alasan spesifik + didokumentasikan + ada tanggal kedaluwarsa</strong>. Tidak wajar jika 'pokoknya tambah' tiap kuartal tanpa dasar — itu <em>earnings management</em> (atau ketidakpercayaan pada model sendiri, yang juga masalah). Audit overlay = audit kejujuran manajemen.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>PSAK 71 berlaku efektif <strong>1 Januari 2020</strong> di Indonesia — dan "kebetulan" 3 bulan kemudian pandemi datang. Tidak ada uji coba yang lebih brutal bagi standar akuntansi baru.</p>

      <h3>Day-1 Impact: Laba yang Menguap di Malam Tahun Baru</h3>
      <p>Saat transisi PSAK 55 → 71, bank wajib menghitung ulang cadangan dengan metode ECL — selisihnya langsung memotong <strong>saldo laba / ekuitas</strong> (bukan laba tahun berjalan, tetapi tetap mengurangi modal). Bank-bank besar Indonesia melaporkan kenaikan CKPN <strong>puluhan persen</strong> pada hari pertama penerapan. Analis yang membaca laporan tahunan 2020 dan melihat ekuitas bank "menyusut misterius" tanpa penjelasan — kini tahu penyebabnya: <em>day-1 impact</em> PSAK 71.</p>
      <p>Lalu Maret 2020 pandemi datang. PD forward-looking meledak (prakiraan ekonomi direvisi tajam), SICR terpicu di mana-mana, ECL melonjak — <strong>tepat saat pendapatan bank tertekan</strong>. Inilah procyclicality dalam bentuk paling murni: standar yang dirancang pasca-2008 agar bank "siap lebih awal" justru menghantam laba di momen terburuk. Perdebatan global pun meledak: apakah ECL terlalu procyclical? Jawabannya (sampai hari ini): ya, tetapi alternatifnya (incurred loss yang terlambat) terbukti lebih buruk pada 2008.</p>

      <h3>Management Overlay: Cadangan "Feeling" yang Legal</h3>
      <p>Model ECL tidak bisa menangkap segalanya — pandemi adalah <em>unprecedented event</em> di luar data historis. Maka lahir praktik <strong>management overlay</strong>: cadangan tambahan di luar output model, berdasarkan judgment manajemen (misal: "tambah 20% untuk sektor pariwisata yang modelnya belum mencerminkan lockdown"). Overlay ini <strong>legal dan lazim</strong>, tetapi wajib didokumentasikan, disetujui komite, dan bisa ditantang auditor/OJK.</p>
      <p>Bagi analis, overlay adalah jendela ke <strong>kejujuran manajemen</strong>: bank yang overlay-nya transparan dan metodologis = manajemen prudent; bank yang overlay-nya "angka ajaib" tanpa dasar = red flag. Saat membaca laporan keuangan, cari pengungkapan overlay di catatan ECL — bank yang baik menjelaskannya rinci.</p>

      <h3>Interaksi dengan Stimulus Covid</h3>
      <p>Ingat POJK 11/2020 (CR2)? Stimulus itu menciptakan tegangan menarik dengan PSAK 71: kolektibilitas boleh "lancar", tetapi <strong>ECL tetap wajib forward-looking</strong>. Artinya bank bisa melaporkan Kolek 1 sambil membentuk ECL besar — dua bahasa yang bercerita beda tentang kredit yang sama. Analis yang hanya membaca kolektibilitas (bahasa lama) tanpa membaca stage/ECL (bahasa baru) = membaca setengah cerita.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: menghitung overlay sederhana (klik untuk buka)</summary>
        <p>Portofolio pariwisata Rp 500 M. Model ECL (berbasis data 2015–2019, tanpa pandemi): PD 3%, LGD 45% → ECL = 0,03 × 0,45 × 500.000 = <strong>Rp 6.750 jt</strong>.</p>
        <p><strong>Langkah 1</strong> — manajemen menilai model belum mencerminkan lockdown: okupansi hotel anjlok 80%, data historis tidak relevan.<br />
        <strong>Langkah 2</strong> — overlay: tambah faktor 1,5× untuk sektor pariwisata → ECL overlay = 6.750 × 1,5 = <strong>Rp 10.125 jt</strong>.<br />
        <strong>Langkah 3</strong> — dokumentasi: "Overlay 50% untuk sektor pariwisata, dasar: penurunan okupansi 80% (data PHRI), berlaku hingga 2 kuartal, direview komite risiko."</p>
        <p><strong>Pelajaran:</strong> overlay bukan "angka asal" — ia punya dasar, besaran, dan masa berlaku. Overlay tanpa ketiganya = cadangan fiktif.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat krisis, bacalah laporan bank dalam urutan ini: (1) asumsi makro ECL — seberapa pesimis? (2) migrasi Stage 2 — seberapa besar? (3) overlay — seberapa jujur? Tiga angka ini lebih bercerita tentang kesehatan bank dibanding headline laba.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Migrasi Massal ke Stage 2</h2>
      <div className="callout">
        <p>Kuartal II 2026, Bank Nusantara: porsi Stage 2 melonjak <strong>6% → 11%</strong>. CKPN naik Rp 800 M, laba kuartal anjlok 40%. Direksi menuduh tim risiko "modelnya terlalu pesimis". Data investigasimu:</p>
        <ul>
          <li>80% migrasi berasal dari <strong>satu segmen</strong>: KMK perdagangan (terpukul lesunya daya beli).</li>
          <li>PD model KMK naik rata-rata 2,8× (dipicu penurunan mutasi rekening + kenaikan SLIK kolek 2).</li>
          <li>Tren ini <strong>konsisten 2 kuartal</strong> berturut-turut, bukan lonjakan sesaat.</li>
          <li>Bank kompetitor dengan segmen serupa melaporkan migrasi Stage 2 yang sebanding.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apakah model terlalu pesimis, atau staging-nya jujur? Apa 2 tindakanmu sebagai analis?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Staging-nya jujur.</strong> Bukti: (1) terkonsentrasi di segmen yang memang terpukul fundamental (bukan acak), (2) pemicu PD naik 2,8× — di atas ambang 2× yang ditetapkan bank sendiri, (3) konsisten 2 kuartal (bukan noise), (4) kompetitor mengalami hal serupa (bukan model ngawur sendiri).</p>
          <p><strong>Tindakan:</strong> (1) <strong>Pertahankan staging, jelaskan ke direksi</strong> dengan data: tunjukkan bahwa menahan migrasi = menunda bom (saat debitur benar-benar macet, Stage 3 menghantam lebih keras + teguran OJK/auditor). (2) <strong>Aksi bisnis:</strong> perketat origination KMK perdagangan sementara + intensifkan monitoring debitur Stage 2 (restrukturisasi dini lebih murah daripada menunggu default — CR22).</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Perbedaan fundamental PSAK 55 vs PSAK 71?"
        options={[
          "PSAK 71 tarif pajaknya lebih tinggi",
          "PSAK 55: cadangan setelah ada bukti kerugian (incurred); PSAK 71: cadangan berdasarkan ekspektasi kerugian masa depan (expected)",
          "Tidak ada bedanya, hanya ganti nama",
          "PSAK 71 menghapus CKPN",
        ]}
        correct={1}
        explanation="Benar: incurred → expected. PSAK 71 mencadangkan SEBELUM tunggakan terjadi — seperti detektor asap vs pemadam kebakaran."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kredit dengan PD awal 8% (saat lahir), PD kini 5%, DPD 0. Stage berapa?"
        options={[
          "Stage 2 — PD 5% masih tinggi",
          "Stage 1 — risiko MENURUN dibanding awal; SICR mengukur perubahan relatif, bukan level",
          "Stage 3",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Benar: Stage 1. SICR = peningkatan signifikan SEJAK ORIGINATION. PD turun 8%→5% = membaik, meski levelnya masih di atas KPR prima. Jebakan klasik!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Apa itu 'cliff effect' dalam PSAK 71?"
        options={[
          "ECL turun drastis saat pindah stage",
          "ECL melonjak berkali-kali lipat saat pindah Stage 1→2 (12-bulan → lifetime), menghantam laba sekaligus",
          "Bank jatuh dari tebing",
          "PD menjadi 0",
        ]}
        correct={1}
        explanation="Benar: lompatan 4–8× lipat dalam contoh kita. Inilah mengapa ambang SICR sangat politis — menggesernya sedikit = menggeser laba ratusan miliar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Debitur DPD 35 hari, tapi model PD bilang risikonya turun. Stage berapa?"
        options={[
          "Stage 1 — ikuti model",
          "Stage 2 — backstop 30 hari otomatis memicu SICR, tidak bisa di-override model",
          "Stage 3",
          "Tergantung direksi",
        ]}
        correct={1}
        explanation="Benar: Stage 2. Backstop 30 hari adalah jaring pengaman regulator — berlaku apapun kata model. Model bisa salah/lambat; DPD tidak berbohong."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Stage 2 bank tidak pernah naik meski ekonomi resesi 2 tahun. Sebagai auditor, reaksimu?"
        options={[
          "Bagus — manajemen risiko hebat",
          "Red flag — staging kemungkinan dimanipulasi menahan migrasi demi laba; minta bukti kriteria SICR dan backtesting",
          "Netral — stage tidak penting",
          "Naikkan gaji tim risikonya",
        ]}
        correct={1}
        explanation="Benar: red flag. Dalam resesi, sebagian portofolio PASTI mengalami SICR. Stage 2 yang datar = indikasi ambang SICR terlalu longgar atau override manual. Auditor/OJK akan membongkar ini."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Ekonomi memasuki resesi. Apa yang terjadi pada ECL dan mengapa disebut procyclical?"
        options={[
          "ECL turun — resesi membuat bank lebih hati-hati",
          "ECL melonjak (PD forward-looking naik, SICR massal) tepat saat laba tertekan — memperdalam siklus, itulah procyclicality",
          "ECL tidak berubah — akuntansi tidak peduli ekonomi",
          "ECL dihapus selama resesi",
        ]}
        correct={1}
        explanation="Benar: ECL forward-looking naik saat prakiraan ekonomi memburuk — menghantam laba di momen terburuk dan berpotensi mengetatkan kredit (memperdalam resesi). Itulah procyclicality: fitur yang disadari, belum ada obat sempurnanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Kapan management overlay dibenarkan, dan apa syaratnya?"
        options={[
          "Kapan saja — manajemen bebas menambah cadangan sesuai feeling",
          "Saat model tidak menangkap risiko material (misal event unprecedented); wajib ada dasar data, metodologi, persetujuan komite, dan masa berlaku",
          "Tidak pernah — overlay dilarang PSAK 71",
          "Hanya saat laba sedang tinggi (income smoothing)",
        ]}
        correct={1}
        explanation="Benar: overlay legal untuk risiko yang luput dari model, tetapi harus metodologis — dasar data, kalkulasi skenario, governance komite, dan review berkala. Overlay 'angka ajaib' tanpa dasar = red flag bagi auditor dan OJK."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>PSAK 71 = expected loss</strong>: cadangan dibentuk SEBELUM rugi terjadi (berlaku 1 Jan 2020).</li>
          <li><strong>Stage 1</strong> (ECL 12 bln) → <strong>Stage 2</strong> (SICR, ECL lifetime) → <strong>Stage 3</strong> (default, PD 100%).</li>
          <li><strong>SICR</strong>: PD naik signifikan (umumnya ≥2×) vs saat lahir + backstop DPD ≥30 hari.</li>
          <li><strong>Cliff effect</strong>: pindah stage = ECL melonjak 4–8× — pukulan langsung ke laba.</li>
          <li><strong>ECL</strong> = Σ PD×LGD×EAD per tahun, didiskonto, dirata-rata atas skenario ekonomi.</li>
          <li>Kapan TIDAK serta-merta percaya staging: Stage 2 yang datar saat resesi = red flag manipulasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr4a-basel-rwa-kpmm" className="btn btn-secondary btn-sm">← CR4a</Link>
        <Link href="/learn/cr5-definisi-default" className="btn btn-primary btn-sm">Next: CR5 →</Link>
      </div>
    </div>
  );
}
