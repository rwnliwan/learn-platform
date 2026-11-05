"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr14bPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const journalData = [
    {
      x: ["CKPN awal", "+ Pembentukan", "− Write-off", "CKPN akhir"],
      y: [800, 250, -120, 930],
      type: "bar",
      marker: { color: ["#94a3b8", "#ef4444", "#3aa655", "#2a7de1"] },
      text: ["800", "+250", "−120", "930"],
      textposition: "outside",
    },
  ];

  const backtestData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [100, 110, 95, 130, 105],
      type: "scatter",
      mode: "lines+markers",
      name: "ECL prediksi (indeks)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [95, 125, 90, 150, 100],
      type: "scatter",
      mode: "lines+markers",
      name: "Kerugian aktual (indeks)",
      line: { color: "#ef4444", width: 3, dash: "dash" },
    },
  ];

  const sensitivityData = [
    {
      x: ["PD +10%", "LGD +10%", "EAD +10%", "r +2%", "Bobot pesimis +10pp"],
      y: [10, 10, 10, -6, 18],
      type: "bar",
      marker: { color: ["#ef9244", "#ef9244", "#ef9244", "#3aa655", "#ef4444"] },
      text: ["+10%", "+10%", "+10%", "−6%", "+18%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: ECL end-to-end — satu debitur, dari data ke jurnal
# KPR Rp 500 jt, tenor 10 thn, Stage 2. Hitung sampai ayat jurnal.
import math

ead0, lgd, r = 500, 0.30, 0.08
# PD PIT per tahun per skenario (sudah forward-looking via satelit)
pd_skenario = {
    "Optimis (20%)":  [0.008]*10,
    "Baseline (50%)": [0.012]*10,
    "Pesimis (30%)":  [0.025]*10,
}
ecl_tertimbang = 0
print(f"{'Skenario':<15} {'ECL lifetime':>13}")
for nama, pds in pd_skenario.items():
    prob = float(nama.split("(")[1].strip("%)"))/100
    ead, ecl_s = ead0, 0
    for t, p in enumerate(pds, 1):
        ecl_s += p * lgd * ead / (1+r)**t
        ead *= 0.92  # amortisasi 8%/thn
    ecl_tertimbang += prob * ecl_s
    print(f"{nama:<15} Rp {ecl_s:>9.2f} jt")
print(f"\nECL FINAL (weighted) = Rp {ecl_tertimbang:.2f} jt")
print("\nAyat jurnal pembentukan CKPN:")
print(f"  Dr. Beban CKPN    Rp {ecl_tertimbang:.2f} jt")
print(f"      Cr. CKPN            Rp {ecl_tertimbang:.2f} jt")
print("  -> Laba turun sebesar ECL. Inilah 'harga' risiko di laporan keuangan.")
print()
print("Coba: ubah amortisasi 0.92 -> 1.0 (tanpa amortisasi, misal bullet).")
print("ECL naik — struktur pembayaran mempengaruhi cadangan!")`;

  const lab2Code = `# Lab 2: Backtest ECL — apakah model jujur?
# Bandingkan ECL prediksi vs kerugian aktual 5 tahun (indeks).
prediksi = [100, 110, 95, 130, 105]
aktual   = [95, 125, 90, 150, 100]

print(f"{'Thn':<5} {'Prediksi':>9} {'Aktual':>8} {'Selisih':>9} {'Status':>12}")
bias_total = 0
for i, (p, a) in enumerate(zip(prediksi, aktual), 2021):
    sel = (a - p) / p * 100
    bias_total += sel
    status = "OK" if abs(sel) < 15 else ("UNDER! (kurang)" if sel > 0 else "OVER (lebih)")
    print(f"{i:<5} {p:>9} {a:>8} {sel:>+8.1f}% {status:>12}")
print(f"\nRata-rata bias: {bias_total/5:+.1f}%")
print()
print("Aturan praktis: bias konsisten satu arah 3+ tahun = model perlu")
print("rekalibrasi. 2022 & 2024 UNDER bersamaan — selidiki: apakah")
print("model satelit telat menangkap guncangan? (pelajaran CR11)")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR14b — Credit Risk Analyst • ECL Part 2</span>
        <h1 className="display-title">ECL Part 2:<br />Dari Perhitungan sampai Jurnal</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rp 17 Juta yang Menjadi Ayat Jurnal</a></li>
          <li><a href="#hitung">Perhitungan End-to-End: Satu Debiturs</a></li>
          <li><a href="#jurnal">Jurnal &amp; Dampak Laba</a></li>
          <li><a href="#sensitivitas">Analisis Sensitivitas: Uji Guncang Model</a></li>
          <li><a href="#backtest">Backtest ECL: Mengadili Model Sendiri</a></li>
          <li><a href="#lab1">🔬 Lab 1: ECL End-to-End + Jurnal</a></li>
          <li><a href="#lab2">🔬 Lab 2: Backtest ECL</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Mempertahankan Angka ECL</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: ECL Naik Rp 800 M — Jelaskan ke Direksi</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung ECL lifetime lengkap: staging → PD per tahun → amortisasi → diskonto → probability-weighting.</li>
          <li>Menyusun ayat jurnal pembentukan CKPN dan menjelaskan dampaknya ke laba &amp; modal.</li>
          <li>Melakukan analisis sensitivitas dan mengidentifikasi asumsi paling kritis.</li>
          <li>Melakukan backtest ECL sederhana dan memutuskan kapan model perlu rekalibrasi.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Rp 17 Juta yang Menjadi Ayat Jurnal</h2>
      <div className="story">
        <p>Rina menatap spreadsheet-nya: ECL untuk satu KPR Pak Budi = <strong>Rp 17,02 juta</strong>. Angka desimal yang presisi. Lalu ia membuka sistem akuntansi dan mengetik:</p>
        <p><em>Dr. Beban CKPN — Rp 17.020.000</em><br /><em>Cr. CKPN KPR — Rp 17.020.000</em></p>
        <p>Dua baris itu — dikali <strong>200.000 rekening KPR</strong> — menjadi <strong>Rp 3,4 triliun</strong> cadangan di neraca. Dan setiap rupiahnya <strong>mengurangi laba</strong> yang dilaporkan ke publik, ke OJK, ke pemegang saham.</p>
        <p><em>"Gila,"</em> gumam Rina. <em>"Model statistikku menggerakkan laba bank triliunan. Kalau PD-ku salah 10%..."</em> Ia tidak menyelesaikan kalimatnya. Tidak perlu.</p>
        <p><strong>Twist-nya:</strong> ECL bukan latihan akademis — ia adalah <strong>jembatan antara statistik dan uang sungguhan</strong>. Part 2 ini menyeberangi jembatan itu sampai ke jurnal, lalu menguji: bagaimana mempertahankannya di depan direksi, auditor, dan OJK.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="hitung">Perhitungan End-to-End: Satu Debitur</h2>
      <p><strong>Rantai lengkap</strong> (prasyarat: CR10 PD, CR12 LGD, CR13 EAD, CR11 skenario, CR14a staging/diskonto):</p>
      <ol>
        <li><strong>Staging</strong> → tentukan 12-bulan vs lifetime (misal: Stage 2).</li>
        <li><strong>PD per tahun</strong> → dari model PIT + satelit, per skenario.</li>
        <li><strong>EAD per tahun</strong> → amortisasi pokok (menyusut!).</li>
        <li><strong>Kalikan &amp; diskonto</strong> → Σ PD_t × LGD × EAD_t / (1+r)^t.</li>
        <li><strong>Bobot skenario</strong> → ECL final.</li>
      </ol>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>KPR Rp 500 jt, tenor 10 thn, LGD 30%, r 8%, Stage 2. PD PIT: optimis 0,8%/thn (20%), baseline 1,2% (50%), pesimis 2,5% (30%). Amortisasi 8%/thn.</p>
        <p><strong>Langkah 1</strong> — per skenario, jumlahkan 10 tahun (lihat Lab 1): optimis Rp 8,1 jt; baseline Rp 12,2 jt; pesimis Rp 25,4 jt.<br />
        <strong>Langkah 2</strong> — bobot: 0,2×8,1 + 0,5×12,2 + 0,3×25,4 = <strong>Rp 15,3 jt</strong>.<br />
        <strong>Langkah 3</strong> — inilah ECL final satu debitur. × 200.000 rekening = Rp 3,06 T.</p>
        <p>Perhatikan: <strong>amortisasi</strong> memangkas ECL ~35% dibanding tanpa amortisasi — struktur pembayaran adalah komponen ECL yang sah.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> urutan perhitungan itu <strong>kontrak</strong> — tidak bisa dibolak-balik. Diskonto <em>setelah</em> perkalian tahunan (bukan mendiskonto PD-nya). Bobot skenario <em>paling akhir</em> (bukan merata-ratakan PD dulu — karena non-linearitas!). Urutan salah = angka salah meski komponen benar.</p>
      </div>

      <h2 id="jurnal">Jurnal &amp; Dampak Laba</h2>
      <p><strong>Ayat jurnal pembentukan CKPN:</strong></p>
      <div className="callout">
        <p><strong>Dr.</strong> Beban kerugian kredit (CKPN) — Rp XX<br />
        <strong>Cr.</strong> Cadangan kerugian penurunan nilai (kontra-aset) — Rp XX</p>
      </div>
      <p><strong>Dampak berantai:</strong></p>
      <ul>
        <li><strong>Laba turun</strong> sebesar beban CKPN (langsung, kuartal berjalan).</li>
        <li><strong>Aset bersih turun</strong> (kontra-aset naik) → <strong>modal (ekuitas) turun</strong> → <strong>KPMM turun</strong>.</li>
        <li><strong>Write-off:</strong> Dr. CKPN / Cr. Kredit yang diberikan — <strong>tidak</strong> memengaruhi laba lagi (sudah dicadangkan!), tapi <strong>menurunkan NPL gross</strong> (ingat CR2!).</li>
      </ul>

      <PlotlyChart
        data={journalData}
        title="Mutasi CKPN Satu Kuartal (Rp Miliar) — Ilustrasi"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Rp Miliar" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = komponen perubahan CKPN: saldo awal + pembentukan − write-off = saldo akhir.</p>
        <p><strong>Interpretasi:</strong> pembentukan Rp 250 M = <strong>beban laba kuartal ini</strong>. Write-off Rp 120 M = <strong>bukan beban baru</strong> (sudah dicadangkan dulu) — ia hanya "membersihkan" neraca. <strong>Pelajaran membaca laporan bank:</strong> "beban CKPN naik" = laba tertekan <em>sekarang</em>; "write-off besar" = laba <em>sudah</em> tertekan dulu.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Write-off Rp 120 M = rugi Rp 120 M kuartal ini."</strong></p>
        <p><strong>Yang benar:</strong> rugi sudah diakui <strong>saat CKPN dibentuk</strong> (kuartal-kuartal sebelumnya). Write-off hanya memindahkan: Dr. CKPN / Cr. Kredit — <strong>netral terhadap laba</strong>. Inilah mengapa analis membedakan "beban CKPN" (menggerakkan laba) dari "write-off" (membersihkan NPL).</p>
      </div>

      <h2 id="sensitivitas">Analisis Sensitivitas: Uji Guncang Model</h2>
      <p><strong>Definisi.</strong> <strong>Analisis sensitivitas</strong> = mengubah satu asumsi ±X% dan mengukur perubahan ECL. Tujuannya: (1) tahu asumsi mana paling kritis; (2) siapkan jawaban saat direksi/auditor bertanya "bagaimana jika...?"; (3) tentukan <strong>rentang wajar</strong> ECL (bukan satu angka kaku).</p>

      <PlotlyChart
        data={sensitivityData}
        title="Sensitivitas ECL: Dampak Perubahan Asumsi (tornado chart)"
        layout={{ xaxis: { title: "Perubahan ECL" }, yaxis: { title: "Asumsi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % perubahan ECL jika asumsi itu berubah sebesar yang tertera.</p>
        <p><strong>Interpretasi:</strong> <strong>bobot pesimis +10pp → ECL +18%</strong> — paling sensitif! PD/LGD/EAD +10% → +10% (linear, sesuai rumus). Suku bunga +2% → ECL <strong>turun</strong> 6% (diskonto lebih besar). <strong>Pelajaran:</strong> perdebatan metodologi seharusnya <strong>paling sengit di bobot skenario</strong> — bukan di detail teknis PD.</p>
      </div>

      <h2 id="backtest">Backtest ECL: Mengadili Model Sendiri</h2>
      <p><strong>Definisi.</strong> <strong>Backtest</strong> = bandingkan ECL yang <strong>diprediksi</strong> (dulu) dengan kerugian <strong>aktual</strong> (kini). Jika prediksi konsisten meleset satu arah → model bias → rekalibrasi.</p>
      <p><strong>Aturan praktis:</strong> selisih &lt;15% = wajar (noise); 15–30% = investigasi; &gt;30% atau bias satu arah 3+ tahun = rekalibrasi wajib. <strong>Catatan jujur:</strong> backtest ECL itu sulit — kerugian aktual 1 tahun vs ECL lifetime tidak <em>apple-to-apple</em>. Praktik umum: backtest <strong>komponen</strong> (PD 12-bulan vs default aktual; LGD vs recovery aktual) — lebih bersih.</p>

      <PlotlyChart
        data={backtestData}
        title="Backtest ECL: Prediksi vs Aktual (indeks, 100 = 2021)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Indeks" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = ECL prediksi; merah putus-putus = kerugian aktual.</p>
        <p><strong>Interpretasi:</strong> 2022 &amp; 2024: aktual <strong>di atas</strong> prediksi (underestimate!) — dua kali dalam 5 tahun. Polanya: model <strong>telat menangkap guncangan</strong> (kemungkinan satelit makro kurang responsif — pelajaran CR11). <strong>Aksi:</strong> investigasi komponen (PD? LGD?) lalu rekalibrasi — bukan menambah overlay (CR11: morfin vs obat).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> backtest yang <strong>selalu pas</strong> justru mencurigakan — seperti ramalan cuaca yang tidak pernah salah (mungkin datanya dimanipulasi). Model yang sehat <strong>kadang over, kadang under</strong> (noise dua arah). Yang berbahaya adalah <strong>bias satu arah yang konsisten</strong>.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Urutan adalah Kontrak</h3>
      <p>Rantai perhitungan ECL — staging → PD per tahun → EAD per tahun → kali &amp; diskonto → bobot skenario — terlihat seperti prosedur. Sesungguhnya ia adalah <strong>kontrak logika</strong>: tiap langkah memakai output langkah sebelumnya, dan membalik urutan menghasilkan angka yang salah secara halus. Contoh: mendiskonto <strong>sebelum</strong> mengalikan PD×EAD tahunan vs sesudahnya memberi hasil beda. Mendiskonto EAD-nya saja (bukan kerugiannya) juga salah. Analis yang membangun spreadsheet ECL wajib bisa menjelaskan <strong>mengapa urutan ini</strong> — bukan sekadar mengikuti template.</p>
      <p>Intuisi kedua: <strong>amortisasi adalah komponen ECL yang sah dan besar</strong>. Contoh di lesson ini: amortisasi memangkas ECL ~35%. Artinya struktur pembayaran (tenor, grace period, balloon payment) bukan sekadar fitur produk — melainkan <strong>parameter risiko</strong>. Kredit dengan <em>balloon payment</em> (pokok dibayar di akhir) punya EAD yang tidak menyusut → ECL lebih tinggi dari kredit angsuran biasa dengan nominal sama. Analis pricing yang mengabaikan ini memberi harga terlalu murah untuk struktur berisiko.</p>
      <p>Intuisi ketiga tentang jurnal: ayat <strong>Dr. Beban CKPN / Cr. CKPN</strong> adalah momen ketika <strong>risiko menjadi laba</strong> (atau tepatnya: menggerus laba). Setiap rupiah ECL yang dihitung di spreadsheet akhirnya muncul sebagai beban di laporan laba rugi — dan mengurangi modal. Rantai lengkapnya: model → angka → jurnal → laba → modal → KPMM → kapasitas tumbuh. <strong>Analis risiko yang menghitung ECL sesungguhnya sedang menulis masa depan laporan keuangan bank.</strong></p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: ECL End-to-End + Jurnal</h2>
      <p>Satu debitur, rantai penuh, sampai ayat jurnal. Rasakan bobotnya.</p>
      <PyodideLab
        title="Lab 1 — ECL Lengkap Satu Debitur"
        hint="Coba: (1) ubah amortisasi 0.92 → 1.0. (2) Ubah prob pesimis 30% → 50%. (3) Ubah r 8% → 15%. Mana yang paling menggerakkan ECL? (Bandingkan dengan tornado chart.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Backtest ECL</h2>
      <p>Adili modelmu sendiri: prediksi vs aktual 5 tahun.</p>
      <PyodideLab
        title="Lab 2 — Backtest Sederhana"
        hint="Ubah angka aktual/prediksi dan lihat status berubah. Pertanyaan: jika 2026 aktual = 160 (UNDER lagi 3×), apa keputusanmu? (Jawaban: rekalibrasi wajib — bias satu arah 3 tahun.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Mempertahankan Angka ECL</h2>

      <div className="decision-card">
        <h3>1. Direksi tanya "kenapa ECL naik?" → <strong>bedah per komponen (waterfall)</strong></h3>
        <p><strong>Kondisi:</strong> ECL naik Rp 800 M sekuartal.</p>
        <p><strong>Cara:</strong> tunjukkan kontribusi: migrasi stage (Rp X) + revisi skenario (Rp Y) + pertumbuhan portofolio (Rp Z). Angka tanpa bedah = tidak bisa dipertahankan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Auditor tanya "buktikan ECL wajar" → <strong>sensitivitas + backtest + benchmark</strong></h3>
        <p><strong>Kondisi:</strong> audit tahunan.</p>
        <p><strong>Senjata:</strong> tornado chart (asumsi kritis), backtest 5 tahun (track record), benchmark vs bank sejenis (coverage ratio). Tiga lapis pertahanan.</p>
      </div>

      <div className="decision-card">
        <h3>3. Backtest bias satu arah 3 tahun → <strong>rekalibrasi, bukan overlay</strong></h3>
        <p><strong>Kondisi:</strong> konsisten underestimate.</p>
        <p><strong>Kenapa:</strong> overlay menutupi; rekalibrasi menyembuhkan. Dokumentasikan perubahan metodologi + dampaknya.</p>
      </div>

      <div className="decision-card">
        <h3>4. Portofolio tumbuh cepat → <strong>pisahkan ECL "pertumbuhan" dari "perburukan"</strong></h3>
        <p><strong>Kondisi:</strong> ECL naik seiring ekspansi.</p>
        <p><strong>Kenapa:</strong> ECL naik karena volume ≠ ECL naik karena kualitas. Direksi perlu tahu bedanya — yang pertama sehat, yang kedua alarm.</p>
      </div>

            <div className="decision-card">
        <h3>5. Mesin ECL menghasilkan angka yang "terasa salah" (terlalu kecil) → <strong>percaya instingmu, audit mesinnya</strong></h3>
        <p><strong>Kondisi:</strong> ECL kuartal ini Rp 800 M — terasa terlalu kecil mengingat NPL naik dan ekonomi melambat. Tim IT berkata "mesin sudah berjalan benar".</p>
        <p><strong>Aksi:</strong> insting analis senior adalah <strong>sinyal validasi</strong>, bukan paranoia. Audit berlapis: (1) cek <strong>input</strong> — apakah DPD, staging, EIR benar? (seringkali salah di sini); (2) cek <strong>parameter</strong> — apakah PD/LGD masih kalibrasi lama?; (3) cek <strong>skenario</strong> — apakah probabilitas pesimis terlalu kecil?; (4) cek <strong>cakupan</strong> — apakah ada portofolio yang tidak masuk mesin? Sembilan dari sepuluh "keajaiban ECL" adalah <strong>kesalahan data</strong>, bukan keajaiban model. Jangan tanda tangani angka yang tidak bisa kamu jelaskan.</p>
        <p><strong>Contoh nyata:</strong> kasus klasik — EIR 0% untuk ribuan rekening KPR lama (data tidak termigrasi) membuat diskonto salah total dan ECL underestimate 20%. Ditemukan bukan oleh IT, melainkan oleh analis yang "merasa angkanya aneh". Insting + audit = pertahanan terakhir.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Urutan = kontrak:</strong> staging → PD/EAD per tahun → diskonto → bobot skenario.</li>
          <li><strong>CKPN = beban laba.</strong> Write-off ≠ beban baru.</li>
          <li><strong>Debat paling sengit di bobot skenario</strong> — paling sensitif.</li>
          <li><strong>Backtest komponen</strong> (PD, LGD) lebih bersih dari backtest ECL total.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Reasonableness Check ECL: 8 Tes Kewarasan</h3>
      <p>Sebelum menandatangani angka ECL, jalankan 8 tes kewarasan ini. Satu gagal = investigasi dulu, tanda tangan kemudian.</p>
      <ol>
        <li><strong>Tes arah:</strong> — ECL naik/turun — apakah arahnya cocok dengan NPL, DPK, dan kondisi ekonomi? Berlawanan tanpa penjelasan = red flag.</li>
        <li><strong>Tes skala:</strong> — ECL / total kredit = CoR. Masuk akal vs tahun lalu vs peer? Lonjakan 3× tanpa krisis = ada yang salah.</li>
        <li><strong>Tes staging:</strong> — Migrasi stage menjelaskan berapa % perubahan ECL? Jika 80% perubahan 'tidak bisa dijelaskan' = model bermasalah.</li>
        <li><strong>Tes skenario:</strong> — Berapa kontribusi skenario pesimis? Jika &lt;10% padahal ekonomi memburuk = probabilitas tidak jujur.</li>
        <li><strong>Tes overlay:</strong> — Overlay berapa % dari total? Naik tiap kuartal tanpa dilepas = cadangan permanen yang mencurigakan.</li>
        <li><strong>Tes segmen:</strong> — Segmen mana penggeraknya? Satu segmen mendominasi = drill-down wajib — jangan terima agregat.</li>
        <li><strong>Tes amortisasi:</strong> — Apakah EAD menyusut sesuai jadwal? Balloon payment dihitung sebagai amortisasi linear = underestimate (mini-case 2).</li>
        <li><strong>Tes input:</strong> — Sampel 20 rekening: DPD benar? Staging benar? EIR benar? 9 dari 10 keajaiban ECL = kesalahan data.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> delapan tes, 30 menit, sebelum setiap tutup buku. Analis yang menandatangani tanpa tes ini = menandatangani cek kosong.</p>

      <details className="worked">
        <summary>❓ Siapa yang 'memiliki' angka ECL di bank — risiko atau akuntansi?</summary>
        <p><strong>Keduanya, dengan pembagian jelas:</strong> tim risiko <strong>memiliki model &amp; parameter</strong> (PD/LGD/EAD, skenario); tim akuntansi <strong>memiliki pencatatan &amp; kepatuhan PSAK</strong> (jurnal, pengungkapan). Konflik klasik: akuntansi ingin angka 'stabil', risiko ingin angka 'jujur'. Governance yang sehat: <strong>komite bersama</strong> + dokumentasi + tidak ada yang bisa mengubah angka sendirian.</p>
      </details>
      <details className="worked">
        <summary>❓ ECL untuk komitmen yang belum ditarik (undrawn) — dicatat di mana?</summary>
        <p>ECL untuk undrawn <strong>tidak</strong> mengurangi aset kredit (belum ada asetnya!) — melainkan dicatat sebagai <strong>provisi/liabilitas</strong> (Dr. Beban CKPN / Cr. Provisi). Saat ditarik, provisi direklas ke CKPN aset. Detail akuntansi yang sering salah — dan ditanyakan auditor.</p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Perhitungan ECL di bank-bank Indonesia punya realitas operasional yang jarang dibahas di textbook.</p>

      <h3>Skala: Ratusan Ribu Rekening, Satu Mesin</h3>
      <p>Bank besar Indonesia menghitung ECL untuk <strong>ratusan ribu hingga jutaan rekening</strong> setiap bulan (atau kuartal). Ini bukan spreadsheet — melainkan <strong>mesin ECL</strong>: pipeline data dari core banking → staging engine → perhitungan PD/LGD/EAD per rekening → agregasi → jurnal otomatis. Membangun dan memeliharanya adalah proyek multi-tahun yang melibatkan tim risiko, IT, dan akuntansi.</p>
      <p>Implikasinya untuk analis: <strong>kualitas ECL = kualitas data</strong>. DPD yang salah catat sehari bisa mengubah staging ribuan rekening; EIR yang salah input mengubah diskonto. Analis ECL menghabiskan sebagian besar waktunya bukan untuk "menghitung" — melainkan untuk <strong>rekonsiliasi dan validasi data</strong>: apakah total ECL mesin cocok dengan ekspektasi? Apakah migrasi stage masuk akal? <em>Reasonableness check</em> adalah skill inti.</p>

      <h3>Analisis Sensitivitas: Bahasa Komunikasi dengan Direksi</h3>
      <p>Direksi tidak membaca rumus ECL — mereka membaca <strong>sensitivitas</strong>: "jika PDB turun 1% lagi, ECL naik berapa?" Tabel sensitivitas (seperti chart di lesson ini) adalah <strong>alat komunikasi</strong> yang menerjemahkan model menjadi keputusan: berapa buffer yang disiapkan, apakah dividen aman, apakah perlu rights issue. Analis yang hanya bisa menghitung ECL = teknisi; analis yang bisa menjelaskan sensitivitasnya = penasihat direksi.</p>

      <h3>Backtesting ECL: Apakah Ramalanmu Benar?</h3>
      <p>ECL adalah <strong>ekspektasi</strong> — ia harus diuji terhadap realisasi (<em>backtesting</em>): bandingkan ECL yang dibentuk 12 bulan lalu dengan kerugian aktual yang terjadi. Jika ECL sistematis lebih kecil dari realisasi = model underestimate = harus dikalibrasi ulang. OJK dan auditor menanyakan backtesting ini. Bank yang ECL-nya selalu "kebetulan pas" tanpa backtesting yang terdokumentasi = bank yang belum teruji.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: jurnal dan dampak berantai (klik untuk buka)</summary>
        <p>Bank membentuk CKPN Rp 250 M kuartal ini; modal awal Rp 10 T; RWA Rp 80 T (KPMM 12,5%).</p>
        <p><strong>Langkah 1</strong> — jurnal: Dr. Beban CKPN Rp 250 M / Cr. CKPN Rp 250 M.<br />
        <strong>Langkah 2</strong> — laba turun Rp 250 M → ekuitas turun Rp 250 M → modal Rp 9,75 T.<br />
        <strong>Langkah 3</strong> — KPMM baru = 9,75 / 80 = <strong>12,19%</strong> (turun 31 bps).<br />
        <strong>Langkah 4</strong> — jika kemudian write-off Rp 120 M: Dr. CKPN / Cr. Kredit — <strong>laba tidak bergerak</strong> (sudah dibebankan dulu), NPL gross turun.</p>
        <p><strong>Pelajaran:</strong> rantai "model → jurnal → laba → modal → KPMM" adalah satu tarikan napas. Analis ECL yang paham rantai ini bisa menjawab pertanyaan direksi yang sebenarnya: "berapa KPMM kita setelah ECL kuartal ini?"</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat me-review angka ECL bank, tanyakan tiga hal: (1) <strong>apakah masuk akal?</strong> (reasonableness — bandingkan dengan NPL, vintage, dan intuisi bisnis); (2) <strong>apa penggeraknya?</strong> (staging? skenario? overlay?); (3) <strong>bagaimana backtesting-nya?</strong> Tiga pertanyaan ini = audit ECL versi 10 menit.</p>
      </div>

      <h2 id="case">📋 Mini-Case: ECL Naik Rp 800 M — Jelaskan ke Direksi</h2>
      <div className="callout">
        <p>Q3 2026, ECL Bank Nusantara naik <strong>Rp 800 M</strong> dalam sekuartal. Laba anjlok 35%. Direksi memanggilmu. Datamu:</p>
        <ul>
          <li><strong>Rp 350 M</strong> — migrasi Stage 1→2 segmen KMK (dampak cliff effect; PD naik 2,3×, didorong data).</li>
          <li><strong>Rp 250 M</strong> — revisi bobot pesimis 25%→35% (proyeksi ekonomi memburuk).</li>
          <li><strong>Rp 200 M</strong> — pertumbuhan portofolio 8% (volume, bukan perburukan).</li>
          <li>Backtest 3 tahun: bias rata-rata <strong>+4%</strong> (wajar, dua arah).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> susun penjelasan 2 menit untuk direksi: mana yang "sehat", mana yang "alarm", dan apa aksimu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Penjelasan:</strong> "Dari Rp 800 M, <strong>Rp 200 M sehat</strong> (portofolio tumbuh — ECL ikut tumbuh wajar). <strong>Rp 250 M antisipatif</strong> (revisi skenario — harga kejujuran atas ekonomi yang memburuk). <strong>Rp 350 M alarm</strong> (migrasi KMK — kualitas segmen menurun, didukung data PD naik 2,3×). Model teruji (backtest ±4%, tidak bias)."</p>
          <p><strong>Aksi:</strong> (1) <strong>Segera:</strong> perketat origination KMK + intensifkan monitoring Stage 2 (intervensi dini lebih murah — CR9). (2) <strong>Struktural:</strong> siapkan playbook jika skenario pesimis berlanjut (stress test — CR16). Pelajaran: <strong>analis yang membawa bedah komponen didengar; yang membawa satu angka dimarahi</strong>.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Balloon Payment yang Terlupakan</h2>
      <div className="callout">
        <p>Bank menawarkan KPR "DP 0%, cicilan ringan 5 tahun pertama" — dengan <strong>balloon payment</strong>: 60% pokok dibayar di tahun ke-15. Tim bisnis menghitung ECL dengan asumsi amortisasi normal (EAD menyusut linear).</p>
        <ul>
          <li>Outstanding: Rp 500 jt, tenor 15 tahun, LGD 30%, PD flat 1,5%/tahun, r = 9%.</li>
          <li>ECL versi amortisasi normal: ~Rp 18 jt.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apa yang salah dengan perhitungan ini? Estimasi arah koreksinya dan jelaskan ke tim bisnis mengapa struktur pembayaran adalah parameter risiko.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Yang salah:</strong> EAD tidak menyusut linear — dengan balloon 60%, EAD tahun ke-10 masih ~70% dari awal (bukan ~33% seperti amortisasi normal). ECL yang benar memakai <strong>EAD aktual per tahun</strong> mengikuti jadwal pembayaran.</p>
          <p><strong>Arah koreksi:</strong> ECL naik signifikan (estimasi +40–60%) — karena exposure bertahan lama di tahun-tahun akhir, dan PD kumulatif di tahun akhir tetap berlaku atas EAD yang besar. Belum termasuk <strong>risiko refinancing</strong>: debitur harus membayar 60% sekaligus di tahun ke-15 — jika tidak bisa refinance, default di ujung (risiko yang tidak ada di amortisasi normal).</p>
          <p>Kalimat ke tim bisnis: <em>"Cicilan ringan di awal dibayar dengan risiko di akhir — ECL harus mencerminkan jadwal yang sebenarnya, bukan jadwal yang nyaman."</em></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Urutan perhitungan ECL lifetime yang benar?"
        options={[
          "Bobot skenario → diskonto → kalikan PD/LGD/EAD",
          "Staging → PD/EAD per tahun → kalikan & diskonto per tahun → jumlahkan → bobot skenario",
          "Diskonto PD-nya dulu, baru kalikan",
          "Bebas — hasil sama saja",
        ]}
        correct={1}
        explanation="Benar: urutan = kontrak. Mendiskonto PD (bukan kontribusi tahunan) atau membobot di awal (bukan akhir) menghasilkan angka salah meski komponen benar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Ayat jurnal pembentukan CKPN Rp 100 M?"
        options={[
          "Dr. Kas / Cr. Pendapatan",
          "Dr. Beban CKPN / Cr. CKPN (kontra-aset) — laba turun Rp 100 M",
          "Dr. CKPN / Cr. Kredit — tidak pengaruhi laba",
          "Tidak ada jurnal — CKPN otomatis",
        ]}
        correct={1}
        explanation="Benar: beban vs kontra-aset. Laba turun langsung. (Opsi 3 adalah jurnal write-off — netral laba.)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Write-off Rp 120 M. Dampak ke laba kuartal ini?"
        options={[
          "Laba turun Rp 120 M",
          "Netral — rugi sudah diakui saat CKPN dibentuk dulu; write-off hanya Dr. CKPN / Cr. Kredit",
          "Laba naik Rp 120 M",
          "Tergantung direksi",
        ]}
        correct={1}
        explanation="Benar: netral laba. Ini beda fundamental antara 'beban CKPN' (menggerakkan laba) dan 'write-off' (membersihkan NPL)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Analisis sensitivitas menunjukkan bobot pesimis +10pp → ECL +18% (paling sensitif). Implikasinya?"
        options={[
          "Abaikan — hanya 10pp",
          "Perdebatan metodologi & governance paling sengit seharusnya di bobot skenario — dan penetapannya harus level komite",
          "Fokus ke diskonto saja",
          "Kecilkan bobot pesimis agar ECL turun",
        ]}
        correct={1}
        explanation="Benar: sensitivitas = peta prioritas. Yang paling sensitif = yang paling butuh governance ketat. (Opsi 4 = manipulasi!)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Backtest 3 tahun berturut-turut underestimate 20%+. Tindakan?"
        options={[
          "Tambah overlay Rp 500 M",
          "Rekalibrasi model (perbaiki sumber bias) — overlay hanya morfin; dokumentasikan perubahan metodologi",
          "Ganti vendor model",
          "Sembunyikan dari auditor",
        ]}
        correct={1}
        explanation="Benar: bias satu arah konsisten = model sakit. Obati sumbernya (rekalibrasi komponen yang bias), bukan gejalanya."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. KPR dengan balloon payment 60% di akhir tenor dihitung ECL-nya dengan asumsi amortisasi linear. Apa masalahnya?"
        options={[
          "Tidak ada — ECL tidak peduli jadwal pembayaran",
          "EAD aktual jauh lebih besar di tahun-tahun akhir → ECL underestimate; plus risiko refinancing di ujung yang tidak tercakup",
          "ECL justru overestimate",
          "Balloon payment dilarang OJK",
        ]}
        correct={1}
        explanation="Benar: struktur pembayaran adalah parameter risiko. EAD mengikuti jadwal aktual — balloon = exposure bertahan lama. ECL dari amortisasi fiktif = underestimate + mengabaikan risiko refinancing."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. ECL kuartal ini 'terasa' terlalu kecil padahal NPL naik. Langkah audit pertama yang paling tepat?"
        options={[
          "Terima saja — mesin pasti benar",
          "Cek input data (DPD, staging, EIR) — 9 dari 10 keajaiban ECL adalah kesalahan data, bukan model",
          "Langsung ganti model",
          "Naikkan manual 20%",
        ]}
        correct={1}
        explanation="Benar: audit berlapis mulai dari input. Insting analis adalah sinyal validasi — tetapi jawabannya dicari di data dulu (DPD salah catat? EIR nol? staging macet?), baru ke parameter dan model."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Rantai ECL</strong>: staging → PD/EAD per tahun → × LGD → diskonto → Σ → bobot skenario.</li>
          <li><strong>Jurnal CKPN</strong>: Dr. Beban / Cr. Kontra-aset → laba &amp; modal turun. Write-off netral laba.</li>
          <li><strong>Sensitivitas</strong>: bobot skenario paling kritis → governance level komite.</li>
          <li><strong>Backtest</strong>: bias satu arah 3+ tahun = rekalibrasi; backtest komponen lebih bersih.</li>
          <li><strong>Bedah komponen</strong> (waterfall) = cara mempertahankan angka di depan direksi.</li>
          <li>Kapan TIDAK menambah ECL: pertumbuhan volume murni — pisahkan dari perburukan kualitas.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr14a-ecl-staging" className="btn btn-secondary btn-sm">← CR14a</Link>
        <Link href="/learn/cr15-risiko-portofolio" className="btn btn-primary btn-sm">Next: CR15 →</Link>
      </div>
    </div>
  );
}
