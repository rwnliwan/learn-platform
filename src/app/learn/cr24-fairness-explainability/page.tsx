"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr24Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const approvalGapData = [
    {
      x: ["Kelompok A", "Kelompok B"],
      y: [68, 41],
      type: "bar",
      marker: { color: ["#2a7de1", "#ef4444"] },
      text: ["68%", "41%"],
      textposition: "outside",
    },
  ];

  const proxyData = [
    {
      x: ["Kode pos", "Pekerjaan", "Pendidikan", "Usia", "Riwayat kredit"],
      y: [0.72, 0.58, 0.51, 0.33, 0.12],
      type: "bar",
      marker: { color: ["#ef4444", "#ef9244", "#e8a838", "#94a3b8", "#3aa655"] },
      text: ["0,72", "0,58", "0,51", "0,33", "0,12"],
      textposition: "outside",
    },
  ];

  const shapData = [
    {
      x: [0.35, -0.22, 0.18, -0.12, 0.08],
      y: ["DPD 12bln: 2×", "Penghasilan rendah", "Utilisasi 85%", "Tenor pendek", "SLIK bersih"],
      type: "bar",
      orientation: "h",
      marker: { color: ["#ef4444", "#3aa655", "#ef4444", "#3aa655", "#3aa655"] },
      text: ["+0,35", "−0,22", "+0,18", "−0,12", "+0,08"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Deteksi disparate impact — aturan 80%
# Equalized odds sederhana: bandingkan approval rate antar kelompok.
# Aturan praktis (EEOC): rasio < 0.8 = disparate impact -> investigasi.
import random
random.seed(42)

def simulasi(n, base_rate, bias=0.0):
    # bias: pengurang approval untuk kelompok B (misal via proxy kode pos)
    return sum(1 for _ in range(n) if random.random() < base_rate - bias)

n = 2000
app_A = simulasi(n, 0.68)
app_B = simulasi(n, 0.68, bias=0.27)  # kelompok B "dihukum" 27 poin
rate_A, rate_B = app_A/n, app_B/n
rasio = rate_B / rate_A

print(f"Approval A: {rate_A:.1%}  |  Approval B: {rate_B:.1%}")
print(f"Rasio B/A : {rasio:.2f}  {'-> DISPARATE IMPACT (< 0.8)!' if rasio < 0.8 else '-> OK'}")
print()
print("Coba: (1) bias=0.05 -> rasio? (2) bias=0.0 tapi base_rate B=0.5")
print("   (beda karakteristik riil, bukan bias model).")
print("Pelajaran: rasio < 0.8 MEMICU investigasi, bukan vonis —")
print("bedakan 'bias model' vs 'beda risiko riil' (butuh analisis lanjutan).")`;

  const lab2Code = `# Lab 2: Explainability sederhana — kontribusi fitur per keputusan
# Tiru cara kerja SHAP: tiap fitur "mendorong" skor ke atas/bawah.
# Skor akhir = base + sum(kontribusi). Tunjukkan ke nasabah yang ditolak.
base_score = 650  # skor rata-rata populasi
kontribusi = [
    ("DPD 12 bln terakhir: 2x",      -70),
    ("Utilisasi kartu 85%",          -45),
    ("Penghasilan < Rp 5 jt",        -30),
    ("SLIK bersih 3 thn",            +25),
    ("Pekerjaan tetap 5 thn",        +20),
]
skor = base_score + sum(k for _, k in kontribusi)
cutoff = 600
print(f"Skor dasar (rata-rata): {base_score}")
for nama, k in sorted(kontribusi, key=lambda x: x[1]):
    arah = "menurunkan" if k < 0 else "menaikkan"
    print(f"  {nama:<28} {k:+4d}  ({arah})")
print(f"Skor akhir: {skor}  vs cutoff {cutoff} -> {'DITOLAK' if skor < cutoff else 'DITERIMA'}")
print()
print("Penjelasan ke nasabah yang ditolak:")
top = sorted(kontribusi, key=lambda x: x[1])[:2]
print(f"  'Pengajuan ditolak terutama karena: {top[0][0]} dan {top[1][0]}.'")
print("Coba: ubah utilisasi jadi 30% (kontribusi -45 -> -10). Skor?")
print("Inilah 'adverse action notice' — hak nasabah yang ditolak.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR24 — Credit Risk Analyst</span>
        <h1 className="display-title">Fairness &amp; Explainability:<br />Model yang Adil &amp; Bisa Dijelaskan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Dua Lamaran, Satu Nasib Berbeda</a></li>
          <li><a href="#bias">Bias Model: Diskriminasi Tanpa Niat</a></li>
          <li><a href="#proxy">Proxy Discrimination: Jalan Tikus</a></li>
          <li><a href="#explain">Explainability: Hak untuk Tahu Alasan</a></li>
          <li><a href="#lab1">🔬 Lab 1: Deteksi Disparate Impact</a></li>
          <li><a href="#lab2">🔬 Lab 2: Penjelasan per Keputusan</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Uji Fairness Model</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Scorecard yang Rasis Tanpa Sadar</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan disparate impact dan aturan praktis 80% untuk mendeteksinya.</li>
          <li>Mengidentifikasi proxy discrimination (kode pos, pekerjaan) dalam fitur model.</li>
          <li>Menyusun penjelasan per keputusan (adverse action notice) ala SHAP.</li>
          <li>Menilai trade-off akurasi vs fairness dan mendokumentasikannya.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Dua Lamaran, Satu Nasib Berbeda</h2>
      <div className="story">
        <p>Dua sahabat, <strong>Rina dan Sari</strong>, melamar KTA di bank yang sama. Penghasilan sama. Riwayat kredit sama-sama bersih. <strong>Rina diterima, Sari ditolak.</strong> Bedanya satu: kode pos. Rina tinggal di kawasan perumahan; Sari di kawasan padat yang — menurut data historis — punya default rate lebih tinggi.</p>
        <p>Model tidak pernah diajari "diskriminasi". Ia hanya belajar: <em>kode pos X = berisiko</em>. Tapi kode pos X berkorelasi dengan <strong>kelompok etnis/ekonomi tertentu</strong>. Hasilnya: <strong>diskriminasi sistemik, tanpa satu pun manusia yang berniat jahat</strong>.</p>
        <p><strong>Twist-nya:</strong> ketika Sari protes, bank menjawab: <em>"Keputusan sistem, tidak bisa dijelaskan."</em> Di banyak yurisdiksi — dan dalam semangat perlindungan konsumen OJK — jawaban itu <strong>tidak cukup</strong>. Nasabah yang ditolak <strong>berhak tahu alasannya</strong>. Lesson ini tentang dua kewajiban modern analis: <strong>model yang adil</strong> dan <strong>model yang bisa menjelaskan dirinya</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="bias">Bias Model: Diskriminasi Tanpa Niat</h2>
      <p><strong>Definisi.</strong> <strong>Disparate impact</strong> = kebijakan yang netral di permukaan tapi <strong>merugikan kelompok tertentu secara tidak proporsional</strong>. Aturan praktis (dari praktik EEOC AS, diadopsi industri):</p>
      <Tex math={String.raw`\text{Rasio} = \frac{\text{Approval rate kelompok minoritas}}{\text{Approval rate kelompok mayoritas}} < 0{,}8 \Rightarrow \text{investigasi wajib}`} block />
      <p><strong>Artinya:</strong> jika kelompok B disetujui <strong>di bawah 80%</strong> dari tingkat kelompok A, model harus diaudit — bukan otomatis dinyatakan bersalah, tapi <strong>wajib dijelaskan</strong>.</p>
      <p><strong>Kepribadian:</strong> disparate impact seperti <strong>syarat tinggi badan</strong> untuk pekerjaan kantoran — netral di kertas, tapi menyingkirkan perempuan secara sistemik. Model kredit punya "syarat tinggi badan" versinya sendiri: variabel yang terlihat teknis tapi <strong>berpihak</strong>.</p>

      <PlotlyChart
        data={approvalGapData}
        title="Approval Rate per Kelompok (ilustrasi — rasio 0,60)"
        layout={{ xaxis: { title: "Kelompok" }, yaxis: { title: "Approval rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = approval rate tiap kelompok.</p>
        <p><strong>Interpretasi:</strong> rasio = 41/68 = <strong>0,60 &lt; 0,80</strong> — <strong>disparate impact terdeteksi</strong>. Ini <strong>memicu investigasi</strong>: apakah selisih karena risiko riil (kelompok B memang lebih berisiko — legitimate) atau karena bias model (fitur proxy)? <strong>Rasio tidak menjawab — ia bertanya.</strong></p>
      </div>

      <h2 id="proxy">Proxy Discrimination: Jalan Tikus</h2>
      <p><strong>Definisi.</strong> <strong>Proxy discrimination</strong> = model mendiskriminasi lewat <strong>variabel pengganti</strong> (<em>proxy</em>) yang berkorelasi dengan atribut sensitif (suku, agama, gender) — meski atribut itu <strong>tidak dipakai langsung</strong>.</p>
      <p><strong>Contoh proxy umum:</strong> kode pos (etnis/wilayah), pekerjaan tertentu (gender), nama (suku), riwayat pendidikan (kelas sosial).</p>

      <PlotlyChart
        data={proxyData}
        title="Korelasi Fitur dengan Atribut Sensitif (ilustrasi)"
        layout={{ xaxis: { title: "Fitur" }, yaxis: { title: "Korelasi" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang = seberapa kuat fitur berkorelasi dengan atribut sensitif (misal kelompok etnis).</p>
        <p><strong>Interpretasi:</strong> <strong>kode pos (0,72) = proxy berbahaya</strong> — hampir sama dengan memakai atribut sensitif langsung. Pekerjaan &amp; pendidikan = zona kuning. <strong>Aturan:</strong> fitur dengan korelasi tinggi ke atribut sensitif harus <strong>diuji ulang</strong>: apakah ia menambah <strong>prediksi risiko murni</strong>, atau hanya <strong>menyalurkan bias</strong>? Jika yang kedua → buang, apapun IV-nya (CR7a).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Model adil = buang semua variabel demografis."</strong></p>
        <p><strong>Yang benar:</strong> membuang variabel sensitif <strong>tidak cukup</strong> — proxy tetap menyalurkan bias (fairness through unawareness = gagal). Sebaliknya, <strong>memakai</strong> atribut sensitif untuk <strong>audit</strong> (mengukur disparitas) justru <strong>diperlukan</strong> — kamu tidak bisa memperbaiki yang tidak kamu ukur. Prinsip: <strong>jangan pakai untuk keputusan, wajib pakai untuk pengujian.</strong></p>
      </div>

      <h2 id="explain">Explainability: Hak untuk Tahu Alasan</h2>
      <p><strong>Definisi.</strong> <strong>Explainability</strong> = kemampuan menjelaskan <strong>mengapa</strong> model mengambil keputusan tertentu, dalam bahasa manusia. Standarnya: <strong>adverse action notice</strong> — nasabah yang ditolak menerima <strong>alasan spesifik utama</strong> (bukan "keputusan sistem").</p>
      <p><strong>Teknik:</strong> <strong>SHAP</strong> (<em>SHapley Additive exPlanations</em>) = tiap fitur diberi <strong>kontribusi +/-</strong> terhadap skor; jumlahnya = selisih dari rata-rata. Intuisi: seperti <strong>pembagian rapot</strong> — tiap mata pelajaran (fitur) menambah/mengurangi nilai akhir.</p>

      <PlotlyChart
        data={shapData}
        title="Kontribusi Fitur untuk Satu Keputusan (ala SHAP, ilustrasi)"
        layout={{ xaxis: { title: "Kontribusi terhadap skor" }, yaxis: { title: "Fitur" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang merah = mendorong skor turun (risiko); hijau = mendorong naik.</p>
        <p><strong>Interpretasi:</strong> penolakan ini <strong>terutama</strong> karena "DPD 2× dalam 12 bulan" (+0,35 risiko) dan "utilisasi 85%". Inilah yang ditulis di surat penolakan: <em>"ditolak karena riwayat keterlambatan dan utilisasi tinggi"</em> — <strong>spesifik, bisa ditindaklanjuti</strong> nasabah (bayar tepat waktu, turunkan utilisasi). "Keputusan sistem" = tidak bisa ditindaklanjuti = tidak adil.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> explainability bukan sekadar etika — melainkan <strong>kontrol kualitas</strong>. Model yang tidak bisa dijelaskan = <strong>tidak bisa diaudit</strong> = tidak bisa diperbaiki saat salah. <strong>Jika kamu tidak bisa menjelaskan penolakan ke nasabah, kamu juga tidak bisa mempertahankannya ke OJK.</strong></p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Keadilan adalah Manajemen Risiko</h3>
      <p>Fairness sering dibingkai sebagai "etika" — sesuatu yang dilakukan karena baik. Analis senior membingkainya sebagai <strong>manajemen risiko</strong>: model yang diskriminatif = <strong>risiko regulasi</strong> (sanksi OJK), <strong>risiko reputasi</strong> (viral di media sosial), dan <strong>risiko model</strong> (proxy yang berkorelasi dengan SARA biasanya juga tidak stabil — populasi bergeser, proxy rusak). Tiga risiko dalam satu. Bank yang mengabaikan fairness bukan bank yang "pragmatis" — melainkan bank yang <strong>menabung tiga bom waktu sekaligus</strong>.</p>
      <p>Intuisi kedua: <strong>"fairness through unawareness" = gagal total</strong>. Membuang variabel sensitif (etnis, gender, agama) dari model <strong>tidak</strong> membuat model adil — karena proxy (kode pos, pekerjaan, nama, pendidikan) tetap menyalurkan informasi yang sama melalui "jalan tikus". Ini seperti melarang seseorang melihat warna kulit tetapi membiarkannya melihat foto — informasinya tetap sampai. Keadilan butuh <strong>pengukuran aktif</strong> (disparate impact ratio, equalized odds), bukan pengabaian pasif.</p>
      <p>Intuisi ketiga tentang explainability: <strong>model yang tidak bisa dijelaskan = tidak bisa divalidasi, tidak bisa dipertahankan, tidak bisa diperbaiki</strong>. SHAP dan teknik sejenis bukan "kosmetik etika" — melainkan <strong>alat kontrol kualitas</strong>: mereka menunjukkan apakah model memakai alasan yang benar (DPD historis ✓) atau alasan yang mencurigakan (kode pos ✓ — bahaya!). Setiap penolakan kredit harus bisa dijelaskan dalam <strong>2–3 kalimat manusiawi</strong> — kepada nasabah, auditor, OJK, dan hakim. Jika tidak bisa — modelnya belum siap produksi.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji tiga kalimat untuk setiap model kredit: (1) <strong>bisakah dijelaskan?</strong> (explainability), (2) <strong>apakah adil?</strong> (disparate impact &lt; 0,8 = investigasi), (3) <strong>apakah stabil?</strong> (proxy bisa bergeser). Model yang gagal satu = model yang belum selesai. Keadilan bukan fitur tambahan — melainkan <strong>definisi selesai</strong>.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Deteksi Disparate Impact</h2>
      <p>Simulasikan approval dua kelompok — kapan rasio memicu investigasi?</p>
      <PyodideLab
        title="Lab 1 — Aturan 80%"
        hint="Ubah bias 0.27 → 0.05 → 0. Lalu base_rate B 0.68 → 0.5 (beda risiko riil). Diskusikan: rasio < 0.8 SELALU berarti diskriminasi? (Tidak — ia memicu investigasi, bukan vonis.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Penjelasan per Keputusan</h2>
      <p>Susun adverse action notice dari kontribusi fitur.</p>
      <PyodideLab
        title="Lab 2 — SHAP Sederhana"
        hint="Ubah utilisasi 85% → 30% (kontribusi -45 → -10). Apakah keputusan berubah? Diskusikan: penjelasan yang baik = yang bisa DITINDAKLANJUTI nasabah."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Uji Fairness Model</h2>

      <div className="decision-card">
        <h3>1. Sebelum launch → <strong>uji disparitas antar kelompok</strong></h3>
        <p><strong>Kondisi:</strong> setiap model scoring baru.</p>
        <p><strong>Aksi:</strong> hitung approval rate per kelompok sensitif (data audit, bukan fitur keputusan). Rasio &lt;0,8 → investigasi.</p>
      </div>

      <div className="decision-card">
        <h3>2. Fitur berkorelasi tinggi dengan atribut sensitif → <strong>uji nilai tambah murni</strong></h3>
        <p><strong>Kondisi:</strong> kode pos, pekerjaan, dsb.</p>
        <p><strong>Aksi:</strong> apakah fitur menambah prediksi <strong>di luar</strong> proxy-nya? Tidak → buang, apapun IV-nya.</p>
      </div>

      <div className="decision-card">
        <h3>3. Setiap penolakan → <strong>adverse action notice</strong></h3>
        <p><strong>Kondisi:</strong> operasional harian.</p>
        <p><strong>Aksi:</strong> 2–3 alasan spesifik utama (dari SHAP/kontribusi). "Keputusan sistem" = tidak dapat diterima.</p>
      </div>

      <div className="decision-card">
        <h3>4. Trade-off akurasi vs fairness → <strong>dokumentasikan pilihan</strong></h3>
        <p><strong>Kondisi:</strong> menghapus proxy menurunkan Gini 0,02.</p>
        <p><strong>Aksi:</strong> putuskan bersama komite, <strong>catat alasannya</strong>. Tidak ada jawaban universal — tapi harus ada jawaban yang terdokumentasi.</p>
      </div>

            <div className="decision-card">
        <h3>5. Variabel "kode pos" IV 0,3 tetapi korelasi 0,72 dengan etnis → <strong>buang, kecuali ada justifikasi kausal yang kuat</strong></h3>
        <p><strong>Kondisi:</strong> kode pos adalah variabel prediktif (IV 0,3) — wilayah tertentu memang default lebih tinggi. Tetapi audit menunjukkan korelasi 0,72 dengan keanggotaan etnis minoritas. Tim model ingin mempertahankannya ("kan prediktif!").</p>
        <p><strong>Aksi:</strong> <strong>buang sebagai default</strong> — kecuali bisa dibuktikan mekanisme kausal langsung (misal: kode pos menangkap <strong>harga properti wilayah</strong> yang memengaruhi LGD — maka ganti dengan variabel langsungnya: harga properti!). Prinsip: <strong>pakai penyebabnya, bukan alamatnya</strong>. Jika "wilayah X berisiko" karena pengangguran tinggi → pakai data pengangguran wilayah (kausal, netral). Jika hanya "wilayah X berisiko" tanpa mekanisme → itu stereotip geografis = proxy discrimination. Harga keadilan biasanya murah (Gini turun 0,01–0,02) — <strong>jauh lebih murah dari sanksi OJK + viral media sosial</strong>.</p>
        <p><strong>Contoh nyata:</strong> regulator global (CFPB di AS, OJK di Indonesia via POJK 6/2022) semakin agresif menindak diskriminasi tidak langsung. "Kan prediktif" bukan pembelaan hukum — pembelaannya adalah <strong>business necessity yang tidak bisa dipenuhi dengan cara yang lebih adil</strong>.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Rasio &lt; 0,8 = investigasi.</strong> Bukan vonis — tapi wajib.</li>
          <li><strong>Kode pos = proxy #1.</strong> Curigai selalu.</li>
          <li><strong>Ukur dengan atribut sensitif, jangan putuskan dengannya.</strong></li>
          <li><strong>Setiap tolak = alasan spesifik.</strong></li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Audit Fairness Model: 7 Langkah</h3>
      <p>Setiap model kredit harus diaudit fairness-nya sebelum produksi dan berkala setelahnya. Tujuh langkah ini = standar.</p>
      <ol>
        <li><strong>Langkah 1 — Kumpulkan atribut sensitif (terpisah!)</strong> — Data SARA dikumpulkan <strong>hanya untuk audit</strong>, disimpan terpisah, tidak dipakai scoring. Tanpa data ini = tidak bisa mengaudit = buta.</li>
        <li><strong>Langkah 2 — Hitung disparate impact ratio</strong> — Approval rate per kelompok. &lt;0,8 = investigasi wajib. Bukan vonis — melainkan pintu masuk.</li>
        <li><strong>Langkah 3 — Audit proxy per variabel</strong> — Korelasi tiap variabel dengan atribut sensitif. &gt;0,5 = investigasi; &gt;0,7 = hampir pasti proxy — buang atau ganti dengan kausal langsung.</li>
        <li><strong>Langkah 4 — Bedah penyebab selisih</strong> — Selisih karena <strong>risiko riil</strong> (data membuktikan) vs <strong>bias model</strong> (proxy)? Yang pertama bisa dibenarkan; yang kedua harus diperbaiki.</li>
        <li><strong>Langkah 5 — Uji alternatif yang lebih adil</strong> — Bisakah akurasi dipertahankan tanpa variabel bermasalah? Jika Gini turun &lt;0,02 = harga keadilan murah — bayar.</li>
        <li><strong>Langkah 6 — Dokumentasikan &amp; laporkan</strong> — Hasil audit + keputusan + alasan = dokumen. Ke OJK/auditor/manajemen. 'Sudah diaudit' tanpa dokumen = belum diaudit.</li>
        <li><strong>Langkah 7 — Monitor berkala</strong> — Fairness bisa <strong>rusak seiring waktu</strong> (populasi bergeser, proxy baru muncul). Audit tahunan minimum — kuartalan untuk model kritis.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tujuh langkah ini = bukti due diligence fairness. Di era POJK 6/2022 + UU PDP, ini bukan opsional — melainkan <strong>kepatuhan</strong>.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Modelku akurat TETAPI disparate impact 0,7 — boleh produksi?</summary>
        <p><strong>Belum</strong> — investigasi dulu (langkah 4): jika selisih karena risiko riil yang terbukti data = boleh, dengan dokumentasi kuat. Jika karena proxy = perbaiki dulu. Produksi tanpa investigasi = <strong>melanggar POJK 6/2022</strong> (diskriminasi tidak langsung).</p>
      </details>
      <details className="worked">
        <summary>❓ SHAP untuk 2 juta nasabah — feasible?</summary>
        <p><strong>Untuk monitoring agregat: ya</strong> (sampel). Untuk <strong>setiap keputusan individual</strong>: hitung SHAP per keputusan yang diprotes/ditolak (bukan semua). Praktik: precompute untuk band skor + on-demand untuk kasus. Yang wajib: <strong>setiap penolakan bisa dijelaskan</strong> — bukan setiap skor dihitung SHAP-nya.</p>
      </details>
      <details className="worked">
        <summary>❓ Nasabah protes 'diskriminasi' — bagaimana menangani?</summary>
        <p><strong>Serius, cepat, terdokumentasi:</strong> (1) dengarkan &amp; catat; (2) tarik penjelasan model untuk kasusnya (SHAP); (3) audit: apakah keputusannya bisa dibenarkan risiko?; (4) jawab tertulis dengan penjelasan yang memadai (POJK 6/2022!); (5) jika terbukti bias = perbaiki model + remediasi. <strong>Protes yang diabaikan = viral yang menunggu.</strong></p>
      </details>
      <details className="worked">
        <summary>❓ Fairness vs akurasi — harus pilih satu?</summary>
        <p><strong>Hampir tidak pernah.</strong> Pengalaman industri: menghilangkan proxy biasanya menurunkan Gini &lt;0,02 — harga yang murah. Trade-off besar hanya terjadi jika modelnya <strong>bergantung</strong> pada diskriminasi — dan itu justru bukti modelnya bermasalah. <strong>Model yang adil biasanya juga model yang lebih robust.</strong></p>
      </details>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Di Indonesia, fairness AI bukan wacana akademis — ia bersinggungan dengan <strong>hukum, regulasi, dan realitas sosial</strong>.</p>

      <h3>Perlindungan Konsumen: POJK 6/2022</h3>
      <p>OJK menerbitkan <strong>POJK 6/POJK.07/2022 tentang Perlindungan Konsumen</strong> — yang mewajibkan lembaga keuangan berlaku adil, transparan, dan tidak diskriminatif terhadap konsumen. Untuk perkreditan, implikasinya konkret:</p>
      <ul>
        <li><strong>Hak atas penjelasan:</strong> konsumen yang ditolak berhak mendapat penjelasan yang memadai — "komputer bilang tidak" <strong>bukan</strong> penjelasan yang memadai.</li>
        <li><strong>Larangan diskriminasi:</strong> perlakuan berbeda atas dasar SARA dilarang — termasuk diskriminasi <strong>tidak langsung</strong> via proxy.</li>
        <li><strong>Transparansi produk:</strong> biaya, bunga, dan syarat harus diungkap jelas — tidak boleh ada "jebakan" yang hanya menguntungkan bank.</li>
      </ul>
      <p>Pelanggaran = sanksi administratif hingga pencabutan izin. Analis yang membangun model wajib memastikan outputnya <strong>sesuai POJK ini</strong> — bukan sekadar akurat secara statistik.</p>

      <h3>Proxy Khas Indonesia: Yang Wajib Diwaspadai</h3>
      <p>Beberapa variabel yang <strong>netral di permukaan tetapi sensitif di Indonesia</strong>:</p>
      <ul>
        <li><strong>Kode pos / kelurahan:</strong> berkorelasi kuat dengan tingkat ekonomi wilayah — dan di Indonesia, dengan komposisi etnis/pendatang. IV tinggi + korelasi sensitif tinggi = <strong>bom</strong>.</li>
        <li><strong>Nama:</strong> nama Indonesia sering mengindikasikan suku/agama. Model NLP yang memakai nama = <strong>diskriminasi langsung yang terselubung</strong>.</li>
        <li><strong>Pekerjaan:</strong> pekerjaan tertentu berkorelasi dengan gender (misal: pekerja domestik, supir).</li>
        <li><strong>Pendidikan / almamater:</strong> berkorelasi dengan kelas sosial-ekonomi keluarga.</li>
      </ul>
      <p>Praktik sehat: <strong>audit proxy</strong> untuk setiap variabel — ukur korelasinya dengan atribut sensitif (yang dikumpulkan terpisah, <strong>hanya</strong> untuk audit fairness, bukan untuk scoring). Variabel dengan korelasi &gt;0,5 ke atribut sensitif = <strong>wajib justifikasi bisnis yang kuat</strong> atau dibuang.</p>

      <h3>Pinjol dan Pelajaran Kelam</h3>
      <p>Industri <strong>pinjaman online (pinjol)</strong> Indonesia menjadi laboratorium fairness — dengan hasil yang kelam: pinjol ilegal memakai data ponsel (kontak, galeri, lokasi) untuk <strong>menilai dan menagih</strong> — termasuk penyebaran data pribadi untuk mempermalukan. OJK dan Kominfo menindak ratusan pinjol ilegal. Pelajaran untuk analis <strong>legal</strong>: (1) <strong>data alternatif ada batasnya</strong> — privasi bukan barang dagangan; (2) <strong>persetujuan</strong> (<em>consent</em>) harus jelas dan spesifik; (3) model yang memakai data hasil "pencurian" = model yang <strong>ilegal sejak lahir</strong>, seakurat apapun.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: audit disparate impact (klik untuk buka)</summary>
        <p>Scorecard KTA: approval rate kelompok A (mayoritas) 68%, kelompok B (minoritas) 41%.</p>
        <p><strong>Langkah 1</strong> — disparate impact ratio = 41/68 = <strong>0,60</strong> &lt; 0,80 → <strong>terdeteksi</strong>, wajib investigasi.<br />
        <strong>Langkah 2</strong> — bedah penyebab: apakah selisih karena <strong>risiko riil</strong> (kelompok B memang PD lebih tinggi — data membuktikan) atau karena <strong>bias model</strong> (variabel proxy)?<br />
        <strong>Langkah 3</strong> — audit variabel: temukan "kode pos" berkontribusi 30% pada selisih, berkorelasi 0,72 dengan keanggotaan kelompok B → <strong>proxy discrimination</strong>.<br />
        <strong>Langkah 4</strong> — remediasi: buang/ganti kode pos dengan variabel kausal langsung (penghasilan, riwayat SLIK) → ratio naik ke 0,85, Gini turun hanya 0,01 (harga keadilan: murah!).</p>
        <p><strong>Pelajaran:</strong> disparate impact &lt;0,8 bukan vonis — melainkan <strong>pintu investigasi</strong>. Yang menentukan adalah <strong>apakah selisihnya bisa dibenarkan oleh risiko riil</strong> — dan audit proxy adalah caranya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Keadilan = memperlakukan semua orang sama persis."</strong></p>
        <p><strong>Yang benar:</strong> keadilan dalam perkreditan = <strong>memperlakukan risiko yang sama dengan sama</strong> — bukan membutakan diri terhadap perbedaan risiko riil. Jika kelompok B memang PD-nya lebih tinggi (terbukti data, bukan proxy), approval lebih rendah <strong>bisa</strong> dibenarkan — itulah pricing risiko, bukan diskriminasi. Yang dilarang: perbedaan perlakuan yang <strong>tidak bisa dijelaskan oleh risiko</strong> — itulah bias.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Scorecard yang Rasis Tanpa Sadar</h2>
      <div className="callout">
        <p>Scorecard KTA Bank Nusantara (Gini 0,45 — bagus!) lolos validasi teknis. Tapi audit fairness menemukan:</p>
        <ul>
          <li>Approval kelompok B = <strong>35%</strong> vs kelompok A = <strong>70%</strong> → rasio <strong>0,50</strong>.</li>
          <li>Fitur "kode pos" punya IV tertinggi kedua — dan berkorelasi 0,72 dengan kelompok.</li>
          <li>Tim model: <em>"Tapi Gini-nya bagus dan tidak ada variabel SARA!"</em></li>
          <li>LSM konsumen mengancam lapor ke OJK &amp; media.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> respons 3 langkah sebagai analis.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Gini bagus ≠ model boleh dipakai.</strong> Tiga langkah:</p>
          <p>(1) <strong>Akui &amp; bekukan:</strong> rasio 0,50 = disparate impact jelas. Hentikan deployment sambil investigasi — <strong>risiko reputasi &amp; hukum</strong> (perlindungan konsumen OJK) lebih besar dari Gini 0,45.<br />
          (2) <strong>Bedah proxy:</strong> uji model <strong>tanpa</strong> kode pos — jika Gini turun sedikit (0,45 → 0,43) tapi rasio naik ke 0,85, <strong>tukar</strong>: 0,02 Gini tidak sebanding dengan diskriminasi sistemik. Cari fitur pengganti yang legitimate (riwayat pembayaran, utilisasi).<br />
          (3) <strong>Bangun ulang dengan guardrail:</strong> fairness test <strong>otomatis</strong> di pipeline validasi (CR19) + adverse action notice untuk tiap penolakan + dokumentasi trade-off ke komite.</p>
          <p>Pelajaran: <strong>"tidak ada variabel SARA" bukan pertahanan</strong> — proxy adalah diskriminasi dengan topeng teknis. Dan <strong>model terbaik adalah yang berani kamu pertahankan di depan kamera.</strong></p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Pinjol Legal vs Ilegal — Batas Data Alternatif</h2>
      <div className="callout">
        <p>Fintech lending "CepatCair" (berizin OJK) ingin memakai <strong>data ponsel</strong> untuk credit scoring thin-file: daftar kontak, frekuensi isi pulsa, lokasi GPS, dan <strong>isi galeri foto</strong> ("AI bisa menilai gaya hidup dari foto!"). Tim data antusias: "IV-nya tinggi!"</p>
        <ul>
          <li>Regulasi: POJK perlindungan konsumen + UU Perlindungan Data Pribadi (UU PDP).</li>
          <li>Kompetitor ilegal memakai data serupa — dan viral karena penyalahgunaan.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis risiko + penasihat, variabel mana yang boleh dipakai, mana yang tidak? Susun kerangkanya.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Kerangka 3 lapis:</strong></p>
          <p><strong>Lapis 1 — Legalitas:</strong> isi galeri foto = <strong>DILARANG</strong> (pelanggaran privasi berat, tidak ada <em>consent</em> yang bisa membenarkannya untuk scoring; UU PDP). Daftar kontak untuk <strong>penagihan</strong> = dilarang (meneror kontak = pelanggaran OJK). Data yang diambil tanpa <em>consent</em> spesifik = ilegal sejak lahir.</p>
          <p><strong>Lapis 2 — Fairness:</strong> lokasi GPS berkorelasi dengan wilayah/etnis → <strong>audit proxy wajib</strong>. Frekuensi isi pulsa: relatif netral, boleh dengan <em>consent</em> — tetapi stabilitasnya rendah (perilaku berubah cepat).</p>
          <p><strong>Lapis 3 — Bisnis:</strong> dari yang legal dan adil, pilih yang <strong>stabil dan kausal</strong> — riwayat isi pulsa (konsistensi pembayaran = proxy character yang masuk akal) lebih baik dari "jumlah aplikasi terinstal" (noise).</p>
          <p><strong>Kesimpulan:</strong> boleh: pola isi pulsa + data transaksi (dengan <em>consent</em> jelas). Tidak boleh: galeri foto, daftar kontak untuk tagih, dan apapun yang diambil diam-diam. <strong>IV tinggi tidak mengalahkan hukum.</strong></p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Approval A 70%, B 52%. Rasio 0,74. Artinya?"
        options={[
          "Diskriminasi terbukti — model harus dibuang",
          "Disparate impact terdeteksi (< 0,8) → investigasi wajib: bedakan bias model vs beda risiko riil",
          "Aman — di atas 0,5",
          "Naikkan approval B secara manual",
        ]}
        correct={1}
        explanation="Benar: 0,74 < 0,8 = picu investigasi, bukan vonis. Mungkin risiko riil beda — tapi harus dibuktikan, bukan diasumsikan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Model tidak memakai variabel SARA sama sekali. Apakah pasti adil?"
        options={[
          "Ya — pasti adil",
          "Tidak: proxy discrimination — kode pos/pekerjaan bisa menyalurkan bias tanpa variabel sensitif langsung (fairness through unawareness gagal)",
          "Ya jika Gini tinggi",
          "Tidak, tapi tidak bisa diperbaiki",
        ]}
        correct={1}
        explanation="Benar: menghapus variabel sensitif ≠ menghapus bias. Proxy = jalan tikus. Audit butuh data sensitif (untuk pengujian, bukan keputusan)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Nasabah ditolak. Respons yang benar?"
        options={[
          "'Keputusan sistem, tidak bisa dijelaskan'",
          "Adverse action notice: 2-3 alasan spesifik utama (misal riwayat DPD + utilisasi tinggi) yang bisa ditindaklanjuti",
          "Diam saja",
          "Terima semua agar adil",
        ]}
        correct={1}
        explanation="Benar: hak nasabah = tahu alasan. Penjelasan yang baik = spesifik + actionable. 'Keputusan sistem' tidak dapat diterima."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Menghapus kode pos menurunkan Gini 0,45 → 0,43 tapi rasio fairness 0,50 → 0,85. Keputusan?"
        options={[
          "Pertahankan kode pos — Gini lebih penting",
          "Tukar: 0,02 Gini tidak sebanding dengan diskriminasi sistemik + risiko hukum/reputasi — putuskan via komite & dokumentasikan",
          "Sembunyikan hasil audit",
          "Naikkan cutoff agar rasio naik",
        ]}
        correct={1}
        explanation="Benar: trade-off didokumentasikan. 0,02 Gini = harga kecil untuk keadilan + kepatuhan. Menaikkan cutoff = manipulasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa atribut sensitif tetap dikumpulkan untuk audit?"
        options={[
          "Untuk dipakai sebagai fitur keputusan",
          "Untuk MENGUKUR disparitas — tidak bisa memperbaiki yang tidak diukur. Prinsip: jangan pakai untuk keputusan, wajib pakai untuk pengujian",
          "Untuk dipublikasikan",
          "Tidak perlu dikumpulkan",
        ]}
        correct={1}
        explanation="Benar: ukur vs putuskan adalah dua hal berbeda. Tanpa data audit, disparate impact tidak terdeteksi."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Variabel 'kode pos' prediktif (IV 0,3) tetapi berkorelasi 0,72 dengan etnis minoritas. Keputusan?"
        options={[
          "Pertahankan — kan prediktif",
          "Buang sebagai default; ganti dengan penyebab kausal langsung (misal harga properti/pengangguran wilayah) — 'kan prediktif' bukan pembelaan hukum",
          "Sembunyikan dari dokumentasi",
          "Pakai tetapi jangan bilang siapa-siapa",
        ]}
        correct={1}
        explanation="Benar: pakai penyebabnya, bukan alamatnya. Proxy dengan korelasi 0,72 = diskriminasi tidak langsung. Pembelaan hukum = business necessity yang tidak bisa dipenuhi cara lebih adil — bukan 'kan prediktif'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Fintech ingin memakai 'isi galeri foto' untuk scoring (katanya IV tinggi). Penilaianmu?"
        options={[
          "Boleh — IV tinggi = boleh",
          "Dilarang — pelanggaran privasi berat (UU PDP); tidak ada consent yang membenarkan; IV tinggi tidak mengalahkan hukum",
          "Boleh asal tidak ketahuan",
          "Boleh untuk thin-file saja",
        ]}
        correct={1}
        explanation="Benar: dilarang. Data alternatif ada batasnya — privasi bukan barang dagangan, dan model dari data curian = ilegal sejak lahir. Pilih data yang legal, adil (lolos audit proxy), dan stabil."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Disparate impact</strong>: rasio &lt;0,8 → investigasi wajib.</li>
          <li><strong>Proxy discrimination</strong>: kode pos dkk = diskriminasi bertopeng. Uji nilai tambah murni.</li>
          <li><strong>Fairness through unawareness gagal.</strong> Ukur dengan data sensitif; jangan putuskan dengannya.</li>
          <li><strong>Explainability (SHAP)</strong>: tiap tolak = alasan spesifik + actionable.</li>
          <li><strong>Trade-off akurasi vs fairness</strong> diputuskan komite + didokumentasikan.</li>
          <li>Standar: <strong>model yang berani dipertahankan di depan kamera.</strong></li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr23-regulasi-indonesia" className="btn btn-secondary btn-sm">← CR23</Link>
        <Link href="/learn/cr25-capstone" className="btn btn-primary btn-sm">Next: CR25 Capstone →</Link>
      </div>
    </div>
  );
}
