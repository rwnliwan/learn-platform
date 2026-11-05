"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr7aPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const woeData = [
    {
      x: ["< 3 jt", "3–5 jt", "5–10 jt", "10–20 jt", "> 20 jt"],
      y: [-0.85, -0.32, 0.18, 0.62, 1.05],
      type: "bar",
      marker: { color: ["#ef4444", "#ef9244", "#e8a838", "#3aa655", "#2a7de1"] },
      text: ["-0,85", "-0,32", "+0,18", "+0,62", "+1,05"],
      textposition: "outside",
    },
  ];

  const ivData = [
    {
      x: ["Penghasilan", "DPD maks 12 bln", "Umur", "Tenor", "Status rumah"],
      y: [0.42, 0.38, 0.21, 0.08, 0.03],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#94a3b8", "#94a3b8"] },
      text: ["0,42", "0,38", "0,21", "0,08", "0,03"],
      textposition: "outside",
    },
  ];

  const logisticData = [
    {
      x: [400, 450, 500, 550, 600, 650, 700, 750, 800],
      y: [0.28, 0.2, 0.13, 0.08, 0.045, 0.025, 0.013, 0.007, 0.004],
      type: "scatter",
      mode: "lines+markers",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 7 },
      name: "PD vs skor",
    },
  ];

  const lab1Code = `# Lab 1: WoE & IV dari nol — pahami cara mesin "menilai"
# Data: 1000 aplikan, variabel PENGHASILAN (5 bin), target default (1/0).
bins = ["< 3 jt", "3-5 jt", "5-10 jt", "10-20 jt", "> 20 jt"]
total = [120, 210, 300, 230, 140]   # jumlah aplikan per bin
bad   = [36, 42, 42, 23, 7]          # yang default per bin

tot_bad = sum(bad); tot_good = sum(total) - tot_bad
print(f"{'Bin':<10} {'%Bad':>6} {'WoE':>7}")
iv = 0.0
for b, n, d in zip(bins, total, bad):
    g = n - d
    dist_bad = d / tot_bad
    dist_good = g / tot_good
    woe = __import__("math").log(dist_good / dist_bad)
    iv += (dist_good - dist_bad) * woe
    print(f"{b:<10} {d/n*100:>5.1f}% {woe:>+6.2f}")
print(f"\nIV penghasilan = {iv:.3f}")
print("Aturan: IV <0.02 tidak prediktif; 0.02-0.1 lemah; 0.1-0.3 sedang; >0.3 kuat.")
print()
print("Coba: ubah 'bad' bin '< 3 jt' dari 36 jadi 12 (penghasilan rendah")
print("ternyata aman). Lihat WoE & IV berubah — variabel jadi tidak prediktif!")`;

  const lab2Code = `# Lab 2: Regresi logistik mini — dari WoE ke peluang default
# Model: log-odds = -2.5 + 1.2*woe_penghasilan + 0.8*woe_dpd
import math

def predict(woe_penghasilan, woe_dpd):
    log_odds = -2.5 + 1.2 * woe_penghasilan + 0.8 * woe_dpd
    pd = 1 / (1 + math.exp(-log_odds))
    return pd

print(f"{'Profil':<28} {'PD':>7}")
print(f"{'Gaji 15jt, DPD max 0':<28} {predict(0.62, 0.50)*100:>6.2f}%")
print(f"{'Gaji 4jt, DPD max 0':<28} {predict(-0.32, 0.50)*100:>6.2f}%")
print(f"{'Gaji 15jt, DPD max 60':<28} {predict(0.62, -0.70)*100:>6.2f}%")
print(f"{'Gaji 4jt, DPD max 60':<28} {predict(-0.32, -0.70)*100:>6.2f}%")
print()
print("Coba: ubah koefisien 1.2 jadi 0.2 (penghasilan tidak penting).")
print("Lihat profil 1 vs 2 jadi mirip — itulah arti koefisien kecil.")
print()
print("Kenapa logistik (bukan linear)? Peluang harus 0-100%.")
print("Fungsi sigmoid memaksa output ke rentang itu — linear tidak bisa.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR7a — Credit Risk Analyst • Scorecard Part 1</span>
        <h1 className="display-title">Scorecard Part 1:<br />Binning, WoE/IV, dan Regresi Logistik</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 30 Detik Menentukan Rp 500 Juta</a></li>
          <li><a href="#konsep">Scorecard: 5C yang Dikuantifikasi</a></li>
          <li><a href="#binning">Binning — Mengelompokkan Dunia yang Kacau</a></li>
          <li><a href="#woe">WoE &amp; IV: Bahasa Mesin Menilai Risiko</a></li>
          <li><a href="#logreg">Regresi Logistik: Dari WoE ke Peluang</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung WoE &amp; IV dari Nol</a></li>
          <li><a href="#lab2">🔬 Lab 2: Regresi Logistik Mini</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Variabel Masuk atau Dibuang?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Variabel "Ajaib" yang Menipu</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa scorecard memakai binning + WoE (bukan variabel mentah).</li>
          <li>Menghitung WoE dan IV manual untuk satu variabel dan menginterpretasikan kekuatannya.</li>
          <li>Menjelaskan cara kerja regresi logistik: dari WoE → log-odds → peluang default (PD).</li>
          <li>Mengidentifikasi jebakan: overfitting bin, variabel bocor (leakage), dan IV palsu.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: 30 Detik Menentukan Rp 500 Juta</h2>
      <div className="story">
        <p>Dina mengajukan KTA Rp 50 juta via aplikasi. Ia mengisi form 3 menit, upload KTP, selfie. <strong>30 detik kemudian: "Pengajuan Anda disetujui."</strong> Tidak ada analis yang membaca berkasnya. Tidak ada telepon verifikasi.</p>
        <p>Yang terjadi di 30 detik itu: sistem menarik data SLIK, e-KTP, mutasi e-wallet — lalu menjalankan <strong>application scorecard</strong>: model yang mengubah ratusan data mentah menjadi <strong>satu angka</strong> (skor 720), membandingkannya dengan cut-off (650), dan memutuskan: ACC.</p>
        <p>Dina senang. Tapi di ruang risiko, Rina menatap dashboard dengan cemas: <em>"Approval naik 20% bulan ini. Modelnya masih valid? Atau kita sedang menyetujui bom waktu?"</em></p>
        <p><strong>Twist-nya:</strong> scorecard terlihat seperti "nilai ujian" sederhana — padahal di baliknya ada <strong>binning, WoE, regresi logistik, dan validasi</strong> yang masing-masing bisa salah dengan cara yang elegan. Part 1 ini membedah dapurnya: bagaimana data mentah disulap menjadi skor.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="konsep">Scorecard: 5C yang Dikuantifikasi</h2>
      <p><strong>Definisi.</strong> Application scorecard = model statistik yang memprediksi <strong>peluang default 12 bulan</strong> calon debitur <em>saat pengajuan</em>, lalu menerjemahkannya menjadi <strong>skor</strong> (misal 300–850). Dipakai untuk keputusan otomatis: skor ≥ cut-off → ACC.</p>
      <p><strong>Kepribadian:</strong> scorecard adalah <strong>5C versi robot</strong> (CR1) — character → riwayat SLIK, capacity → rasio penghasilan, capital → DP/LTV, conditions → variabel wilayah/makro. Bedanya: robot ini konsisten, tidak lelah, tidak bisa disuap — tapi juga tidak punya <em>common sense</em>. Ia hanya sebagus data latihnya.</p>
      <p><strong>Alur pembangunan (yang dibedah Part 1 &amp; 2):</strong></p>
      <ol>
        <li><strong>Binning</strong> — kelompokkan tiap variabel (Part 1, sekarang).</li>
        <li><strong>WoE/IV</strong> — ukur kekuatan tiap variabel (Part 1, sekarang).</li>
        <li><strong>Regresi logistik</strong> — gabungkan jadi peluang (Part 1, sekarang).</li>
        <li><strong>Scaling PDO</strong> — ubah peluang jadi skor cantik (Part 2).</li>
        <li><strong>Cut-off &amp; validasi</strong> — putuskan ambang ACC (Part 2).</li>
      </ol>

      <h2 id="binning">Binning — Mengelompokkan Dunia yang Kacau</h2>
      <p><strong>Definisi.</strong> Binning = memotong variabel kontinu menjadi <strong>kelompok (bin)</strong>: penghasilan → "&lt;3 jt", "3–5 jt", "5–10 jt", dst. Variabel kategorik juga bisa digabung (misal: 20 jenis pekerjaan → 4 kelompok risiko).</p>
      <p><strong>Mengapa tidak pakai angka mentah?</strong> Tiga alasan:</p>
      <ul>
        <li><strong>Non-linearitas:</strong> hubungan penghasilan vs default tidak garis lurus — naik dari 3→5 jt menurunkan risiko drastis, tapi 50→52 jt hampir tidak berpengaruh. Bin menangkap ini; garis lurus tidak.</li>
        <li><strong>Robust terhadap outlier:</strong> penghasilan Rp 500 jt masuk bin "&gt;20 jt" — tidak merusak model.</li>
        <li><strong>Missing bisa jadi bin sendiri:</strong> "penghasilan kosong" sering justru paling prediktif (ingat CR10-track: missing = sinyal!).</li>
      </ul>
      <p><strong>Kepribadian:</strong> binning seperti <strong>menyortir buah</strong> — tidak menilai tiap buah satu per satu, melainkan mengelompokkan ke keranjang "busuk", "biasa", "premium". Model kemudian menilai <em>keranjangnya</em>, bukan buahnya.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> bin yang baik punya <strong>monotonic trend</strong> (risiko naik/turun teratur antar bin) dan <strong>isi cukup</strong> (≥5% populasi per bin). Bin dengan 3 orang = bukan pola, melainkan kebetulan — model akan "menghafal" kebetulan itu (overfitting).</p>
      </div>

      <h2 id="woe">WoE &amp; IV: Bahasa Mesin Menilai Risiko</h2>
      <p><strong>Definisi.</strong> <strong>WoE</strong> (<em>Weight of Evidence</em>) = "nilai risiko" tiap bin. <strong>IV</strong> (<em>Information Value</em>) = "kekuatan" variabel secara keseluruhan.</p>
      <Tex math={String.raw`\text{WoE}_{\text{bin}} = \ln\left(\frac{\%\text{ Good di bin}}{\%\text{ Bad di bin}}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong> % Good = porsi nasabah <em>lancar</em> yang jatuh di bin ini (dari total lancar); % Bad = porsi nasabah <em>default</em> yang jatuh di bin ini (dari total default); ln = logaritma natural. WoE <strong>positif</strong> = bin ini "lebih banyak yang lancar" → aman. WoE <strong>negatif</strong> = "lebih banyak yang macet" → berisiko.</p>
      <Tex math={String.raw`\text{IV} = \sum_{\text{bin}} (\%\text{Good} - \%\text{Bad}) \times \text{WoE}`} block />
      <p><strong>Interpretasi IV:</strong> &lt;0,02 = sampah (tidak prediktif); 0,02–0,1 = lemah; 0,1–0,3 = sedang; &gt;0,3 = kuat; <strong>&gt;0,5 = curigai</strong> (terlalu bagus — mungkin bocor!).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah (klik untuk buka)</summary>
        <p>1.000 aplikan: 150 default (Bad), 850 lancar (Good). Bin penghasilan "&lt;3 jt": 120 orang, 36 default.</p>
        <p><strong>Langkah 1</strong> — % Bad di bin = 36/150 = 24%. % Good di bin = 84/850 = 9,9%.<br />
        <strong>Langkah 2</strong> — WoE = ln(9,9% / 24%) = ln(0,4125) = <strong>−0,89</strong> (negatif = berisiko ✓).<br />
        <strong>Langkah 3</strong> — kontribusi IV = (9,9% − 24%) × (−0,89) = <strong>0,126</strong>.<br />
        <strong>Langkah 4</strong> — jumlahkan semua bin → IV total. Kalau 0,42 = variabel <strong>kuat</strong>.</p>
      </details>

      <PlotlyChart
        data={woeData}
        title="WoE per Bin Penghasilan (negatif = berisiko)"
        layout={{ xaxis: { title: "Bin penghasilan" }, yaxis: { title: "WoE" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = WoE satu bin. Negatif (merah) = berisiko, positif (hijau/biru) = aman.</p>
        <p><strong>Interpretasi:</strong> pola <strong>monotonik naik</strong> — makin tinggi penghasilan, makin aman. Inilah binning yang sehat. Waspadai pola <strong>zig-zag</strong> (&lt;3 jt aman, 3–5 jt bahaya, 5–10 jt aman lagi) = biasanya artefak bin terlalu kecil, bukan pola nyata.</p>
      </div>

      <PlotlyChart
        data={ivData}
        title="IV: Kekuatan Tiap Variabel (mana yang masuk model?)"
        layout={{ xaxis: { title: "Variabel" }, yaxis: { title: "IV" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = IV. Garis imajiner: 0,02 (batas sampah), 0,1 (sedang), 0,3 (kuat).</p>
        <p><strong>Interpretasi:</strong> penghasilan (0,42) &amp; DPD historis (0,38) = kandidat utama. Tenor (0,08) lemah — mungkin dibuang. Status rumah (0,03) = sampah, buang. <strong>Tapi:</strong> IV tinggi bukan tiket otomatis — cek juga korelasi antar variabel (dua variabel kuat yang berkorelasi = double counting, pilih satu).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "IV di atas 0,5 = variabel super, langsung pakai!"</strong></p>
        <p><strong>Yang benar:</strong> IV &gt;0,5 justru <strong>mencurigakan</strong> — kemungkinan besar <strong>kebocoran target (<em>leakage</em>)</strong>: variabel yang "bocor" dari masa depan. Contoh klasik: "status collection" (sudah ditagih = sudah bermasalah) atau "tanggal default". Variabel seperti ini membuat model terlihat sempurna di data latih dan hancur di produksi. Selalu tanya: "apakah variabel ini <em>tersedia saat pengajuan</em>?"</p>
      </div>

      <h2 id="logreg">Regresi Logistik: Dari WoE ke Peluang</h2>
      <p><strong>Definisi.</strong> Regresi logistik menggabungkan WoE semua variabel menjadi <strong>peluang default (PD)</strong> via fungsi sigmoid:</p>
      <Tex math={String.raw`\text{PD} = \frac{1}{1 + e^{-(\beta_0 + \beta_1 \text{WoE}_1 + \beta_2 \text{WoE}_2 + \cdots)}}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\beta_0`} /> = konstanta dasar (risiko rata-rata populasi); <Tex math={String.raw`\beta_i`} /> = bobot variabel ke-<Tex math={String.raw`i`} /> (makin besar = makin berpengaruh); <Tex math={String.raw`\text{WoE}_i`} /> = WoE bin tempat aplikan jatuh; <Tex math={String.raw`e`} /> = bilangan Euler. Sigmoid memaksa hasil ke <strong>0–100%</strong> — tidak bisa negatif atau &gt;100%.</p>
      <p><strong>Kepribadian:</strong> regresi logistik seperti <strong>dewan juri</strong> — tiap variabel memberi "nilai" (β × WoE), lalu ketua dewan (sigmoid) mengubah total nilai menjadi vonis peluang. Juri yang bijak (β tepat) + bukti yang jujur (WoE benar) = vonis yang adil.</p>
      <p><strong>Mengapa logistik, bukan linear biasa?</strong> Regresi linear bisa menghasilkan "peluang −20%" atau "130%" — tidak masuk akal. Sigmoid = linear yang "ditekuk" agar selalu di 0–100%.</p>

      <PlotlyChart
        data={logisticData}
        title="Skor vs PD: Makin Tinggi Skor, Makin Kecil Peluang Default"
        layout={{ xaxis: { title: "Skor" }, yaxis: { title: "PD (peluang default)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = skor, Y = PD hasil model. Kurva menurun mulus.</p>
        <p><strong>Interpretasi:</strong> hubungan <strong>non-linear</strong>: dari skor 400→500, PD turun 28%→13% (15 poin!); dari 700→800, PD turun 1,3%→0,4% (cuma 0,9 poin). <strong>Pelajaran bisnis:</strong> menaikkan cut-off di daerah skor rendah <em>sangat</em> efektif menurunkan NPL; di daerah skor tinggi, efeknya kecil tapi mengorbankan banyak nasabah bagus. Inilah trade-off yang dihitung di Part 2.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> koefisien β bertanda <strong>positif</strong> artinya WoE positif (aman) → log-odds naik → PD <em>turun</em>? Hati-hati: dalam formula di atas, outputnya adalah peluang <strong>default</strong> — jadi β positif × WoE positif (aman) seharusnya <em>menurunkan</em> PD... Konvensi ini membingungkan! Praktik umum: model memprediksi <strong>peluang GOOD</strong> (lancar), atau WoE didefinisikan terbalik. <strong>Selalu cek definisi target</strong> sebelum menginterpretasikan tanda koefisien — kesalahan ini favorit di interview.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Binning adalah Penerjemah Bahasa Manusia</h3>
      <p>Model machine learning modern bisa menelan angka mentah. Scorecard klasik tidak — ia butuh binning. Mengapa industri kredit tetap setia pada binning setelah puluhan tahun? Karena binning menerjemahkan <strong>bahasa mesin menjadi bahasa manusia</strong>. "WoE bin penghasilan &lt;3 jt = −0,89" bisa dijelaskan ke direksi, auditor, OJK, bahkan ke nasabah yang protes ("penghasilan Bapak masuk kategori berisiko karena data historis menunjukkan..."). Coba jelaskan koefisien lapis ke-7 neural network ke auditor — selamat berjuang.</p>
      <p>Intuisi kedua: <strong>binning adalah tempat judgment analis masuk ke model</strong>. Keputusan menggabung bin "3–5 jt" dan "5–10 jt", memisahkan "penghasilan kosong" sebagai bin sendiri, atau memaksa monotonic trend — semua itu judgment manusia yang dibungkus statistik. Dua analis dengan data sama bisa menghasilkan binning berbeda — dan keduanya valid. Inilah mengapa dokumentasi binning ("mengapa bin ini digabung?") adalah bagian wajib validasi OJK: model harus <strong>bisa diceritakan</strong>, bukan sekadar bisa dihitung.</p>
      <p>Intuisi ketiga tentang WoE: perhatikan rumusnya — <strong>logaritma rasio</strong>. WoE positif = bin ini "lebih banyak orang baiknya" dibanding populasi; negatif = sebaliknya. Logaritma membuat skala simetris: WoE +0,69 (2× lebih baik) dan −0,69 (2× lebih buruk) berjarak sama dari nol. Inilah elegansi WoE: ia mengubah perbandingan "seberapa lebih berisiko" menjadi <strong>angka yang bisa dijumlahkan</strong> — fondasi regresi logistik di bagian berikut.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> IV mengukur "apakah variabel ini berguna", WoE mengukur "ke arah mana tiap kelompoknya". Variabel dengan IV tinggi tapi pola WoE zig-zag (tidak monotonik) = pisau bermata dua: kuat secara statistik, sulit dijelaskan secara bisnis. Analis senior memilih variabel yang <strong>kuat DAN masuk akal</strong> — karena model yang tidak bisa dijelaskan tidak akan lolos komite.</p>
      </div>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Hitung WoE &amp; IV dari Nol</h2>
      <p>Tidak ada library ajaib — hitung dengan tangan (via Python) agar paham mesinnya.</p>
      <PyodideLab
        title="Lab 1 — WoE & IV Manual"
        hint="Ubah angka 'bad' per bin dan amati: (1) kapan WoE berubah tanda? (2) kapan IV jatuh di bawah 0,02 (variabel jadi sampah)? (3) Buat pola zig-zag dan lihat apa yang terjadi."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Regresi Logistik Mini</h2>
      <p>Dua variabel, empat profil nasabah. Lihat bagaimana WoE menjadi PD.</p>
      <PyodideLab
        title="Lab 2 — Dari WoE ke PD (Sigmoid)"
        hint="Coba: (1) ubah koefisien 1.2 → 0.2 — apa yang terjadi pada perbedaan profil? (2) Buat profil 'gaji 4jt, DPD 60' vs 'gaji 15jt, DPD 0' — mana yang lebih menentukan: penghasilan atau riwayat? (Jawaban ada di koefisien.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Variabel Masuk atau Dibuang?</h2>

      <div className="decision-card">
        <h3>1. IV &gt;0,1, monotonik, tersedia saat apply → <strong>MASUK</strong></h3>
        <p><strong>Kondisi:</strong> variabel kuat, pola masuk akal, data ada di form pengajuan.</p>
        <p><strong>Contoh:</strong> penghasilan (IV 0,42), DPD maks 12 bulan (IV 0,38).</p>
      </div>

      <div className="decision-card">
        <h3>2. IV &lt;0,02 → <strong>BUANG</strong></h3>
        <p><strong>Kondisi:</strong> tidak prediktif.</p>
        <p><strong>Kenapa:</strong> menambah noise + kompleksitas + risiko overfitting tanpa manfaat. Contoh: status rumah (IV 0,03).</p>
      </div>

      <div className="decision-card">
        <h3>3. IV &gt;0,5 → <strong>SELIDIKI DULU (curiga leakage)</strong></h3>
        <p><strong>Kondisi:</strong> terlalu bagus untuk jadi kenyataan.</p>
        <p><strong>Aksi:</strong> audit: apakah variabel ini diketahui <em>setelah</em> pengajuan? Kalau ya → buang (bocor). Kalau tidak → jackpot, tapi verifikasi dengan data out-of-time.</p>
      </div>

      <div className="decision-card">
        <h3>4. Dua variabel kuat tapi berkorelasi tinggi → <strong>PILIH SATU</strong></h3>
        <p><strong>Kondisi:</strong> misal "penghasilan" dan "limit kartu kredit lain" berkorelasi 0,85.</p>
        <p><strong>Kenapa:</strong> double counting — model mengira ada dua bukti padahal satu. Pilih yang lebih stabil/murah didapat.</p>
      </div>

      <div className="decision-card">
        <h3>5. Variabel sensitif (SARA) → <strong>KONSULTASI LEGAL/COMPLIANCE</strong></h3>
        <p><strong>Kondisi:</strong> suku, agama, gender — meski IV tinggi.</p>
        <p><strong>Kenapa:</strong> risiko diskriminasi + regulasi (UU PDP, POJK fairness — CR24). Ada proxy-nya pun harus hati-hati.</p>
      </div>

            <div className="decision-card">
        <h3>6. Variabel "kepemilikan kendaraan" IV 0,35 tapi berkorelasi 0,85 dengan "penghasilan" → <strong>pilih satu, biasanya penghasilan</strong></h3>
        <p><strong>Kondisi:</strong> dua variabel kuat, tetapi korelasinya 0,85 — keduanya bercerita hal yang sama (kemampuan ekonomi). Memasukkan keduanya = multikolinearitas: koefisien tidak stabil, interpretasi rusak.</p>
        <p><strong>Kenapa penghasilan:</strong> (1) lebih langsung mengukur capacity (CR1), (2) tersedia untuk semua aplikan (kendaraan tidak dimiliki semua orang → missing besar), (3) lebih stabil antarwaktu. Pengecualian: jika targetnya segmen tanpa slip gaji (UMKM informal), "kepemilikan aset" bisa lebih terverifikasi daripada "penghasilan yang dilaporkan". Pilih variabel yang <strong>paling jujur untuk segmenmu</strong>, bukan yang IV-nya paling tinggi.</p>
        <p><strong>Contoh nyata:</strong> scorecard KUR mikro di bank BUMN: "omzet yang dilaporkan" (IV 0,4) vs "mutasi rekening 3 bulan" (IV 0,32, korelasi 0,8). Dipilih mutasi rekening — karena omzet yang dilaporkan pedagang pasar sering "angka cantik", sementara mutasi adalah fakta bank.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Bin dulu, baru nilai.</strong> WoE butuh bin yang monotonik &amp; berisi.</li>
          <li><strong>IV = saringan pertama.</strong> &lt;0,02 buang; &gt;0,5 curigai.</li>
          <li><strong>Leakage check:</strong> "apakah ini tersedia SAAT pengajuan?"</li>
          <li><strong>Korelasi check:</strong> dua variabel kuat yang kembar = pilih satu.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Checklist Variabel: 8 Ujian Sebelum Masuk Model</h3>
      <p>Setiap calon variabel scorecard wajib lulus 8 ujian ini. Gagal satu = dibuang atau diperbaiki dulu.</p>
      <ol>
        <li><strong>Tersedia saat aplikasi?</strong> — Jika dihitung dari masa depan = leakage. Pertanyaan sakti: 'apakah angka ini ada di meja analis SAAT keputusan dibuat?'</li>
        <li><strong>IV cukup?</strong> — &lt;0,02 = buang. 0,02–0,1 = lemah (pertimbangkan). &gt;0,5 = curigai leakage — jangan rayakan dulu.</li>
        <li><strong>WoE monotonik?</strong> — Zig-zag = sulit dijelaskan ke bisnis/auditor. Binning ulang atau buang — kecuali ada alasan bisnis yang kuat.</li>
        <li><strong>Stabil antarwaktu?</strong> — IV di data 2022 vs 2024 jauh beda = variabel musiman/siklus — berbahaya untuk model jangka panjang.</li>
        <li><strong>Tidak berkorelasi tinggi?</strong> — Korelasi &gt;0,7 dengan variabel lain = pilih satu (yang paling jujur/valid untuk segmen).</li>
        <li><strong>Lolos uji bisnis?</strong> — Arah hubungannya masuk akal? 'Makin tinggi penghasilan makin berisiko' = tolak, sekuat apapun statistiknya.</li>
        <li><strong>Lolos uji legal?</strong> — Bukan SARA langsung maupun proxy kuat (korelasi &gt;0,5 ke atribut sensitif = investigasi, CR24).</li>
        <li><strong>Bisa dijelaskan?</strong> — Sanggup menjelaskan ke direksi dalam 2 kalimat mengapa variabel ini ada? Jika tidak — belum siap produksi.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> jadikan ini gerbang: tidak ada variabel masuk model tanpa checklist ini ditandatangani. Dokumentasinya = tamengmu saat audit.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Berapa banyak variabel ideal untuk scorecard?</summary>
        <p>Praktik industri: <strong>8–15 variabel</strong>. Terlalu sedikit (&lt;5) = kurang daya beda; terlalu banyak (&gt;20) = noise, multikolinearitas, dan mimpi buruk maintenance. Kualitas &gt; kuantitas — 10 variabel kuat mengalahkan 30 variabel campur aduk.</p>
      </details>
      <details className="worked">
        <summary>❓ Binning manual vs otomatis (optimal binning)?</summary>
        <p>Otomatis untuk <strong>eksplorasi awal</strong>; manual untuk <strong>final</strong>. Algoritma tidak tahu konteks bisnis ('bin ini harus digabung karena kebijakan') dan bisa menghasilkan bin yang tidak masuk akal. Analis yang baik: biarkan algoritma mengusulkan, manusia memutuskan.</p>
      </details>
      <details className="worked">
        <summary>❓ Missing value — dibuang atau dibinning?</summary>
        <p>'Penghasilan kosong' sering <strong>paling prediktif</strong> (IV tinggi!) — jangan dibuang. Jadikan bin sendiri ('Tidak tersedia') dan pahami maknanya: untuk KTA, missing = berisiko; untuk KPR (data lengkap wajib), missing = error data. <strong>Konteks menentukan.</strong></p>
      </details>
      <details className="worked">
        <summary>❓ IV 0,4 tetapi arah WoE tidak masuk akal — pakai?</summary>
        <p>Jangan — atau <strong>selidiki dulu</strong>. Variabel kuat tetapi 'aneh' biasanya = leakage, proxy SARA, atau artefak data. Statistik tanpa logika bisnis = bom waktu. Aturan: <strong>kuat DAN masuk akal</strong>, atau tidak dipakai.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Scorecard bukan barang impor yang asing — ia adalah <strong>tulang punggung perkreditan massal Indonesia</strong>, dari KPR bank BUMN hingga paylater fintech.</p>

      <h3>SLIK: Bahan Bakar Scorecard Indonesia</h3>
      <p>Variabel terkuat di hampir semua application scorecard Indonesia adalah <strong>riwayat kredit di SLIK OJK</strong>: pernah telat? berapa kali? berapa dalam? Sejak SLIK mengonsolidasikan data seluruh lembaga keuangan (2018), kualitas scorecard Indonesia melompat — karena "character" (CR1) kini terukur nasional, bukan sekadar pengakuan nasabah.</p>
      <p>Tetapi ada keterbatasan yang wajib dipahami: SLIK mencatat <strong>perilaku kredit formal</strong> — ia buta terhadap penghasilan non-formal (mayoritas UMKM!), riwayat sewa, atau pembayaran listrik/air. Inilah mengapa scorecard untuk segmen <strong>thin-file</strong> (nasabah tanpa riwayat kredit — jutaan orang Indonesia) membutuhkan variabel alternatif: data telco, e-commerce, bahkan pola isi pulsa. Fintech P2P lending Indonesia adalah laboratoriumnya — dan bank konvensional mulai mengadopsi.</p>

      <h3>Regulasi: Model Harus Bisa Dipertanggungjawabkan</h3>
      <p>OJK tidak mengatur rumus scorecard — tetapi mengatur <strong>governance</strong>-nya: bank wajib mendokumentasikan pengembangan model, memvalidasi secara independen, dan memonitor kinerjanya. Dalam praktik, ini berarti setiap variabel di scorecard harus lolos tiga ujian:</p>
      <ul>
        <li><strong>Ujian statistik:</strong> IV cukup, WoE monotonik, signifikan di regresi (materi lesson ini).</li>
        <li><strong>Ujian bisnis:</strong> arah hubungannya masuk akal — penghasilan tinggi = risiko rendah. Variabel yang "kuat tapi aneh" ditolak.</li>
        <li><strong>Ujian legal:</strong> tidak boleh diskriminatif atas dasar SARA (detail CR24). Variabel seperti kode pos bisa menjadi <em>proxy</em> diskriminasi — wilayah berpenduduk mayoritas kelompok tertentu.</li>
      </ul>
      <p>Scorecard yang lolos ketiganya = <strong>model yang bisa dibela</strong> di depan direksi, auditor, OJK, dan pengadilan.</p>

      <h3>Leakage: Musuh Tak Terlihat</h3>
      <p>Kasus nyata yang berulang di bank-bank Indonesia: variabel "jumlah hari sejak aplikasi terakhir ditolak" punya IV 0,9 — luar biasa kuat! Ternyata variabel itu <strong>bocor dari masa depan</strong>: dihitung dari database yang sudah mencakup hasil aplikasi ini. Model dengan leakage terlihat sempurna di data latih, lalu <strong>hancur di produksi</strong> — karena di dunia nyata, variabel itu tidak tersedia saat keputusan dibuat. Aturan emas: setiap variabel wajib lolos pertanyaan <strong>"apakah angka ini sudah ada di meja analis PADA SAAT aplikasi diputuskan?"</strong> Kalau tidak — buang, sekuat apapun IV-nya.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: mendeteksi leakage dari IV (klik untuk buka)</summary>
        <p>Variabel "status kolektibilitas 6 bulan setelah pencairan" — IV = 1,2 (super kuat!).</p>
        <p><strong>Langkah 1</strong> — tanya: kapan variabel ini tersedia? 6 bulan SETELAH pencairan.<br />
        <strong>Langkah 2</strong> — kapan keputusan dibuat? SAAT aplikasi (sebelum pencairan).<br />
        <strong>Langkah 3</strong> — kesimpulan: <strong>LEAKAGE</strong>. Variabel ini "tahu masa depan" — ia pada dasarnya adalah target itu sendiri (kolektibilitas ≈ default).<br />
        <strong>Langkah 4</strong> — buang, lalu cari penggantinya yang tersedia saat aplikasi: misal "kolektibilitas fasilitas LAIN di SLIK saat aplikasi" (IV 0,35 — lebih rendah tapi jujur).</p>
        <p><strong>Pelajaran:</strong> IV tinggi bukan medali — kadang ia adalah alarm kebakaran. Selalu audit <em>timing</em> ketersediaan variabel sebelum merayakan.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Makin banyak variabel, makin bagus scorecard-nya."</strong></p>
        <p><strong>Yang benar:</strong> variabel tambahan yang lemah/berkorelasi justru menambah noise, multikolinearitas, dan biaya maintenance — tanpa menambah daya prediksi. Scorecard terbaik Indonesia biasanya memakai <strong>8–15 variabel</strong> yang kuat, stabil, dan bisa dijelaskan. Seperti tim sepak bola: 11 pemain yang kompak mengalahkan 30 pemain yang berebut bola.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Variabel "Ajaib" yang Menipu</h2>
      <div className="callout">
        <p>Tim modeling Bank Nusantara menemukan variabel <strong>"jumlah telepon dari tim collection"</strong> dengan IV <strong>0,68</strong> — tertinggi sepanjang sejarah! Model yang memakainya mencapai Gini 0,85 (biasanya 0,55). Tim bisnis ingin segera deploy.</p>
        <p><strong>Pertanyaan:</strong> boleh dipakai? Identifikasi masalahnya dan jelaskan mengapa Gini-nya "terlalu bagus".</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>TIDAK BOLEH. Ini leakage klasik.</strong> "Jumlah telepon dari collection" hanya ada <em>setelah</em> nasabah menunggak — ia adalah <strong>akibat</strong> dari masalah, bukan <strong>prediktor</strong> saat pengajuan. Saat model dipakai untuk aplikan baru, variabel ini <strong>selalu nol</strong> (belum ada yang menelepon) — modelnya lumpuh total di produksi.</p>
          <p>Gini 0,85 adalah <strong>fatamorgana</strong>: model "memprediksi" default dari jejak collection yang notabene terjadi <em>karena</em> (hampir) default. Aturan: <strong>setiap variabel harus lolos tes "apakah tersedia di detik pengajuan?"</strong>. Yang tidak lolos = sampah berbahaya, sebagus apapun IV-nya.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Bin penghasilan '<3 jt': WoE = −0,89. Artinya?"
        options={[
          "Bin ini aman — WoE negatif berarti bagus",
          "Bin ini berisiko — proporsi default di sini lebih tinggi dari populasi (WoE negatif = 'lebih banyak bad')",
          "WoE negatif = error hitung",
          "Tidak ada artinya",
        ]}
        correct={1}
        explanation="Benar: WoE negatif = %Bad > %Good di bin ini (relatif terhadap populasi) → berisiko. Tanda WoE adalah kompas risiko per bin."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Variabel dengan IV = 0,68. Reaksi pertama yang benar?"
        options={[
          "Langsung pakai — jackpot!",
          "Curiga leakage — audit apakah variabel tersedia saat pengajuan sebelum merayakan",
          "Buang — terlalu tinggi",
          "Kecilkan bin-nya",
        ]}
        correct={1}
        explanation="Benar: IV >0,5 = terlalu bagus, curigai bocor. Variabel 'ajaib' hampir selalu adalah akibat (bukan prediktor) — seperti 'jumlah telepon collection'."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa scorecard memakai binning + WoE, bukan angka mentah langsung ke regresi?"
        options={[
          "Supaya terlihat canggih",
          "Menangkap non-linearitas, robust terhadap outlier, dan missing bisa jadi bin sendiri yang informatif",
          "Regulasi melarang angka mentah",
          "Binning mempercepat komputer",
        ]}
        correct={1}
        explanation="Benar: tiga alasan praktis itu. Hubungan risiko jarang linear — bin + WoE mengubahnya menjadi bentuk yang bisa 'dimakan' regresi logistik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam regresi logistik, mengapa dipakai fungsi sigmoid (bukan linear biasa)?"
        options={[
          "Sigmoid lebih cepat dihitung",
          "Peluang harus di rentang 0–100% — linear bisa menghasilkan −20% atau 130% yang tidak bermakna",
          "Regulator mewajibkan sigmoid",
          "Tidak ada alasan khusus",
        ]}
        correct={1}
        explanation="Benar: sigmoid 'menekuk' output ke 0–1. Peluang −20% adalah omong kosong matematis — model yang menghasilkannya tidak bisa dipakai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua variabel kuat (IV 0,4 dan 0,35) berkorelasi 0,9. Tindakan terbaik?"
        options={[
          "Pakai keduanya — makin banyak makin bagus",
          "Pilih satu — double counting membuat model overconfident dan tidak stabil",
          "Buang keduanya",
          "Rata-ratakan IV-nya",
        ]}
        correct={1}
        explanation="Benar: pilih satu. Dua variabel kembar = model menghitung bukti yang sama dua kali → koefisien tidak stabil, performa out-of-time anjlok."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Variabel 'kolektibilitas 6 bulan setelah pencairan' punya IV 1,2 — tertinggi dari semua variabel. Tindakanmu?"
        options={[
          "Langsung pakai — IV tertinggi = variabel terbaik",
          "Buang — ini leakage: tidak tersedia saat keputusan aplikasi dibuat",
          "Pakai dengan bobot setengah",
          "Tanyakan ke direksi",
        ]}
        correct={1}
        explanation="Benar: leakage. Variabel dari masa depan tidak tersedia saat scoring — model akan terlihat sempurna di data latih dan hancur di produksi. Selalu audit timing ketersediaan variabel."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Dua variabel kuat (IV 0,35 dan 0,32) berkorelasi 0,85. Mengapa hanya boleh pilih satu?"
        options={[
          "Supaya model terlihat sederhana",
          "Multikolinearitas: koefisien tidak stabil, interpretasi rusak, maintenance mahal — keduanya bercerita hal yang sama",
          "OJK melarang lebih dari 10 variabel",
          "Komputer tidak kuat",
        ]}
        correct={1}
        explanation="Benar: multikolinearitas. Dua variabel yang 85% bercerita sama membuat koefisien regresi tidak stabil (sedikit perubahan data = koefisien lompat) dan model sulit dijelaskan. Pilih yang paling jujur/valid untuk segmenmu."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Scorecard</strong> = 5C yang dikuantifikasi: data mentah → skor → keputusan ACC/tolak.</li>
          <li><strong>Binning</strong>: kelompokkan variabel — tangkap non-linearitas, kebal outlier, missing jadi bin.</li>
          <li><strong>WoE</strong> = ln(%Good/%Bad) per bin — kompas risiko; <strong>IV</strong> = kekuatan variabel (&lt;0,02 buang, &gt;0,5 curigai).</li>
          <li><strong>Regresi logistik</strong>: PD = sigmoid(β₀ + Σ βᵢ·WoEᵢ) — peluang selalu 0–100%.</li>
          <li><strong>Leakage</strong>: variabel "ajaib" yang baru ada setelah pengajuan = racun model.</li>
          <li>Kapan TIDAK percaya IV tinggi: belum lolos tes "tersedia saat pengajuan?" dan cek korelasi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr6-analisis-portofolio" className="btn btn-secondary btn-sm">← CR6</Link>
        <Link href="/learn/cr7b-application-scorecard-2" className="btn btn-primary btn-sm">Next: CR7b →</Link>
      </div>
    </div>
  );
}
