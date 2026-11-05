"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A314Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const shapData = [
    {
      x: [-0.18, -0.12, 0.09, 0.14, 0.22, 0.31],
      y: ["Utilisasi rendah", "Skor baik", "Tunggakan ada", "LTV tinggi", "Rasio utang tinggi", "DPD 45 hari"],
      type: "bar",
      orientation: "h",
      name: "Kontribusi SHAP",
      marker: { color: ["#22c55e", "#22c55e", "#ef4444", "#ef4444", "#ef4444", "#ef4444"] },
    },
  ];

  const shapGlobalData = [
    {
      x: [0.28, 0.21, 0.16, 0.11, 0.08, 0.05],
      y: ["DPD", "Rasio utang", "Skor kredit", "Tunggakan 12m", "LTV", "Utilisasi"],
      type: "bar",
      orientation: "h",
      name: "Mean |SHAP|",
      marker: { color: "#2a7de1" },
    },
  ];

  const fairnessData = [
    {
      x: ["Grup A", "Grup B"],
      y: [8.2, 8.1],
      name: "Default rate aktual (%)",
      type: "bar",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Grup A", "Grup B"],
      y: [7.9, 14.5],
      name: "Tingkat penolakan model (%)",
      type: "bar",
      marker: { color: ["#22c55e", "#ef4444"] },
    },
  ];

  const tradeoffData = [
    {
      x: [0.70, 0.75, 0.80, 0.84, 0.87],
      y: [0.02, 0.05, 0.10, 0.18, 0.30],
      mode: "lines+markers",
      type: "scatter",
      name: "Disparitas vs AUC",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 10 },
    },
  ];

  const lab1Code = `# SHAP dari nol: Shapley value untuk model linear sederhana
# Shapley = rata-rata kontribusi marginal di SEMUA urutan koalisi.
# Untuk model LINEAR, ada rumus tertutup yang elegan:
#   phi_j = beta_j * (x_j - E[x_j])
import random, math
random.seed(111)

# Model PD (logit): skor sudah standar
# logit = -2.0 - 1.2*skor + 0.8*tunggakan + 0.5*util
beta = {"skor": -1.2, "tunggakan": 0.8, "util": 0.5}
b0 = -2.0
# rata-rata populasi (baseline)
mean_x = {"skor": 0.0, "tunggakan": 0.3, "util": 0.5}

def sigmoid(z): return 1/(1+math.exp(-z))

# Nasabah X: skor buruk (-1.5), ada tunggakan (1), util tinggi (0.9)
nasabah = {"skor": -1.5, "tunggakan": 1, "util": 0.9}

z_base = b0 + sum(beta[k]*mean_x[k] for k in beta)
z_x = b0 + sum(beta[k]*nasabah[k] for k in beta)
print(f"Baseline (rata2 populasi): logit={z_base:.2f} -> PD={sigmoid(z_base):.1%}")
print(f"Nasabah X              : logit={z_x:.2f} -> PD={sigmoid(z_x):.1%}")
print()

# SHAP (ruang logit, aditif sempurna): phi_j = beta_j*(x_j - mean_j)
print("Kontribusi SHAP (dalam logit):")
total = 0
for k in beta:
    phi = beta[k]*(nasabah[k]-mean_x[k])
    total += phi
    arah = "MENAIKKAN risiko" if phi > 0 else "menurunkan risiko"
    print(f"  {k:>10}: {phi:+.3f}  ({arah})")
print(f"  {'JUMLAH':>10}: {total:+.3f}  (cek: {z_x-z_base:+.3f} -> COCOK!)")
print()
print("SIFAT KUNCI (efficiency): jumlah SHAP = selisih dari baseline.")
print("Inilah yang membuat SHAP 'jujur': tidak ada kontribusi yang hilang")
print("atau ganda. Untuk model NONLINEAR (tree), dihitung via TreeSHAP.")
print()
print("COBA: ubah nasabah jadi profil baik (skor=1.5, tunggakan=0).")
print("Lihat kontribusi berbalik arah - penjelasan bersifat LOKAL.")`;

  const lab2Code = `# Fairness metrics dari nol: tiga definisi, satu konflik
# Grup A & B: default rate AKTUAL sama (8%), tapi model menolak B 2x lipat.
import random
random.seed(122)

def gen(n, base, bias_skor):
    # skor model: untuk grup B, skor digeser (model bias)
    y = [1 if random.random() < base else 0 for _ in range(n)]
    s = [random.gauss(0.5 if yi else -0.5, 1) + bias_skor for yi in y]
    return y, s

yA, sA = gen(2000, 0.08, 0.0)
yB, sB = gen(2000, 0.08, 0.6)   # model 'curiga' ke grup B

def metrics(y, s, thr=0.0):
    p = [1 if v > thr else 0 for v in s]
    tp = sum(1 for a, b in zip(y, p) if a == 1 and b == 1)
    fp = sum(1 for a, b in zip(y, p) if a == 0 and b == 1)
    fn = sum(1 for a, b in zip(y, p) if a == 1 and b == 0)
    tn = sum(1 for a, b in zip(y, p) if a == 0 and b == 0)
    tpr = tp/(tp+fn); fpr = fp/(fp+tn)
    prec = tp/(tp+fp) if tp+fp else 0
    return (tp+fp)/len(y), tpr, fpr, prec

rA, tprA, fprA, prA = metrics(yA, sA)
rB, tprB, fprB, prB = metrics(yB, sB)
print(f"{'':>14} | {'Grup A':>8} | {'Grup B':>8} | adil?")
print("-"*46)
print(f"{'tingkat tolak':>14} | {rA:>7.1%} | {rB:>7.1%} | {'TIDAK' if abs(rA-rB)>0.02 else 'ya'} (demographic parity)")
print(f"{'TPR (recall)':>14} | {tprA:>7.1%} | {tprB:>7.1%} | {'TIDAK' if abs(tprA-tprB)>0.05 else 'ya'} (equal opportunity)")
print(f"{'FPR':>14} | {fprA:>7.1%} | {fprB:>7.1%} | {'TIDAK' if abs(fprA-fprB)>0.05 else 'ya'} (equalized odds)")
print(f"{'precision':>14} | {prA:>7.1%} | {prB:>7.1%} | (sufficiency)")
print()
print("Tiga definisi keadilan SALING BERLAWANAN di sini - tidak bisa")
print("puas ketiganya sekaligus (impossibility theorem, kecuali kasus")
print("khusus). Memilih definisi = keputusan NILAI, bukan statistik.")
print()
print("COBA: hilangkan bias (0.6 -> 0.0). Semua metrik kini adil -")
print("ketidakadilan di simulasi ini 100% berasal dari model, bukan data.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A3.14 — Modeling &amp; ML Dasar</span>
        <h1 className="display-title">Explainability &amp; Fairness:<br />Membuka Kotak Hitam Sebelum Ia Membuka Masalah Hukum</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: &ldquo;Komputer Bilang Tidak&rdquo;</a></li>
          <li><a href="#taksonomi">Taksonomi Explainability: Global vs Lokal, Intrinsik vs Post-hoc</a></li>
          <li><a href="#shap">SHAP — Standar Emas Penjelasan</a></li>
          <li><a href="#fairness">Fairness — Tiga Definisi yang Bertengkar</a></li>
          <li><a href="#mitigasi">Mitigasi Bias: Pra, Dalam, Pasca Pemrosesan</a></li>
          <li><a href="#lab1">🔬 Lab 1: SHAP dari Nol (Shapley Value)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Tiga Metrik Fairness dari Nol</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Butuh Apa</a></li>
          <li><a href="#case">📋 Mini-Case: Audit Fairness Model KTA</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan penjelasan global vs lokal dan intrinsik vs post-hoc, serta memilih yang tepat per kebutuhan.</li>
          <li>Menjelaskan logika Shapley value dan membaca waterfall plot SHAP (lokal) dan beeswarm (global).</li>
          <li>Menghitung tiga metrik fairness (demographic parity, equal opportunity, sufficiency) dan menjelaskan mengapa ketiganya bisa bertentangan.</li>
          <li>Merancang strategi mitigasi bias (pre/in/post-processing) dan menjelaskan tradeoff fairness-accuracy.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: &ldquo;Komputer Bilang Tidak&rdquo;</h2>
      <div className="story">
        <p>2019, Apple Card diluncurkan. Tak lama, keluhan meledak: programmer David Heinemeier Hansson mendapat limit <strong>20× lebih kecil</strong> dari istrinya — padahal mereka berbagi rekening, aset, dan riwayat kredit yang <em>lebih buruk</em> darinya. &ldquo;Algoritma seksis!&rdquo; tuduhnya. Regulator New York membuka investigasi.</p>
        <p>Goldman Sachs (penerbit kartu) bersikeras: &ldquo;model tidak memakai gender sebagai variabel.&rdquo; Dan itu mungkin benar — tapi tidak cukup. Model bisa <strong>mempelajari proksi</strong>: pola belanja, nama depan, kode pos — yang berkorelasi dengan gender. Menghapus kolom &ldquo;gender&rdquo; tidak menghapus <em>informasi</em> gender dari 100 variabel lain yang saling berkaitan.</p>
        <p>Twist-nya: investigasi 2 tahun akhirnya <em>tidak</em> menemukan diskriminasi ilegal — tapi kerusakan reputasi sudah terjadi, dan pelajarannya permanen: <strong>&ldquo;kami tidak memakai variabel sensitif&rdquo; bukan pertahanan</strong>. Yang dibutuhkan: bukti <em>pengujian</em> fairness yang sistematis + kemampuan <em>menjelaskan</em> tiap keputusan individual. Lesson ini tentang keduanya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="taksonomi">Taksonomi Explainability: Global vs Lokal, Intrinsik vs Post-hoc</h2>
      <ul>
        <li><strong>Global</strong> = &ldquo;bagaimana model berpikir <em>secara umum</em>?&rdquo; (variabel apa yang penting). Untuk: validasi model, dokumentasi regulator, pemahaman bisnis.</li>
        <li><strong>Lokal</strong> = &ldquo;kenapa <em>nasabah ini</em> ditolak?&rdquo; Untuk: penjelasan ke nasabah (hak penjelasan di banyak yurisdiksi!), banding/keberatan, debugging kasus.</li>
        <li><strong>Intrinsik</strong> (<em>interpretable by design</em>): modelnya sendiri bisa dibaca — regresi logistik (koefisien), decision tree kecil, scorecard, GAM. <strong>Pilih ini jika memungkinkan!</strong></li>
        <li><strong>Post-hoc</strong>: penjelasan ditempel <em>setelah</em> model kompleks dilatih — SHAP, LIME, PDP/ICE. Berguna, tapi penjelasan ≠ model asli (aproksimasi!).</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ada hierarki kejujuran: <strong>model intrinsik &gt; SHAP (konsisten) &gt; LIME (aproksimasi lokal, tidak stabil)</strong>. Aturan praktis industri kredit: jika model intrinsik (logistik/scorecard) performanya <em>hampir</em> setara model kompleks, <strong>pilih yang intrinsik</strong> — regulator, auditor, dan nasabah lebih mudah menerimanya, dan kamu tidak butuh &ldquo;penerjemah&rdquo; yang bisa salah menerjemahkan. Kompleksitas harus <em>membayar</em> dirinya dengan akurasi yang material.</p>
      </div>

      <h2 id="shap">SHAP — Standar Emas Penjelasan</h2>
      <p><strong>Definisi.</strong> SHAP (<em>SHapley Additive exPlanations</em>) memakai <strong>Shapley value</strong> dari teori permainan: kontribusi tiap fitur = rata-rata kontribusi marginalnya di <strong>semua urutan koalisi</strong> yang mungkin:</p>
      <Tex math={String.raw`\phi_j = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!\,(|F|-|S|-1)!}{|F|!} \big[v(S \cup \{j\}) - v(S)\big]`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
        <li><Tex math={String.raw`F`} />: himpunan semua fitur; <Tex math={String.raw`S`} />: subset fitur yang sudah &ldquo;datang duluan&rdquo;</li>
        <li><Tex math={String.raw`v(S \cup \{j\}) - v(S)`} />: berapa prediksi berubah saat fitur <Tex math={String.raw`j`} /> <em>bergabung</em> ke koalisi <Tex math={String.raw`S`} /> — &ldquo;jasa marginal&rdquo;-nya</li>
        <li>Bobot faktorial = rata-rata adil di semua urutan kedatangan (seperti membagi bonus tim secara adil)</li>
      </ul>
      <p><strong>Tiga sifat yang membuatnya &ldquo;emas&rdquo;</strong> (satu-satunya metode yang memenuhi ketiganya sekaligus):</p>
      <ol>
        <li><strong>Efficiency:</strong> <Tex math={String.raw`\sum_j \phi_j = f(x) - E[f(x)]`} /> — jumlah kontribusi = selisih prediksi dari baseline. Tidak ada yang hilang/ganda.</li>
        <li><strong>Symmetry:</strong> dua fitur yang selalu berkontribusi sama → nilai sama. Adil.</li>
        <li><strong>Consistency:</strong> jika model berubah sehingga fitur <Tex math={String.raw`j`} /> makin penting, <Tex math={String.raw`\phi_j`} /> tidak boleh turun. (LIME melanggar ini!)</li>
      </ol>

      <PlotlyChart
        data={shapData}
        title="SHAP Lokal: kenapa nasabah ini ditolak? (waterfall)"
        layout={{ xaxis: { title: "Kontribusi SHAP (logit)" }, yaxis: { title: "" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = kontribusi satu fitur terhadap keputusan <em>nasabah ini</em>; merah = mendorong ke &ldquo;tolak&rdquo;, hijau = mendorong ke &ldquo;terima&rdquo;. Jumlah semua batang = selisih dari rata-rata populasi.</p>
        <p><strong>Interpretasi:</strong> penolakan ini terutama didorong DPD 45 hari (+0,31) dan rasio utang tinggi (+0,22) — <strong>alasan yang bisa disampaikan ke nasabah</strong>: &ldquo;pengajuan ditolak terutama karena keterlambatan 45 hari dan rasio utang.&rdquo; Perhatikan: ini penjelasan <em>lokal</em> — untuk nasabah lain, urutannya bisa beda total.</p>
      </div>

      <PlotlyChart
        data={shapGlobalData}
        title="SHAP Global: variabel paling berpengaruh (mean |SHAP|)"
        layout={{ xaxis: { title: "Rata-rata |SHAP|" }, yaxis: { title: "" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> rata-rata nilai absolut SHAP tiap fitur di seluruh data — &ldquo;seberapa besar pengaruh rata-rata fitur ini&rdquo;.</p>
        <p><strong>Interpretasi:</strong> DPD dominan (0,28), diikuti rasio utang dan skor. <strong>Untuk validasi model:</strong> bandingkan dengan ekspektasi bisnis — jika &ldquo;digit terakhir NIK&rdquo; muncul di top-5, ada yang salah (leakage/noise, A3.8!). <strong>Untuk regulator:</strong> ini bukti &ldquo;model didorong faktor risiko yang masuk akal&rdquo;.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;SHAP menunjukkan variabel penyebab keputusan.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> SHAP menunjukkan <strong>kontribusi terhadap prediksi model</strong> — bukan kausalitas di dunia nyata (A3.13)! SHAP besar untuk &ldquo;kode pos&rdquo; tidak berarti kode pos <em>menyebabkan</em> default — bisa jadi proksi kemiskinan wilayah. Jangan pernah menulis &ldquo;faktor penyebab&rdquo; di laporan; tulis &ldquo;faktor pendorong prediksi model&rdquo;. Beda satu kata, beda tanggung jawab hukum.</p>
      </div>

      <h2 id="fairness">Fairness — Tiga Definisi yang Bertengkar</h2>
      <p><strong>Definisi.</strong> Untuk grup sensitif A/B (gender, wilayah — yang <strong>dilarang</strong> dipakai diskriminasi), tiga definisi populer:</p>
      <ul>
        <li><strong>Demographic parity:</strong> <Tex math={String.raw`P(\hat{Y}=1|A) = P(\hat{Y}=1|B)`} /> — tingkat penolakan <em>sama</em> antar grup. <em>Masalah:</em> jika base rate default memang beda antar grup, parity memaksa menolak yang seharusnya diterima (atau sebaliknya).</li>
        <li><strong>Equal opportunity:</strong> <Tex math={String.raw`P(\hat{Y}=1|Y=1,A) = P(\hat{Y}=1|Y=1,B)`} /> — TPR (recall) sama: &ldquo;yang <em>seharusnya</em> tertangkap, tertangkap dengan peluang sama&rdquo;. Standar untuk <em>penegakan</em> (fraud, koleksi).</li>
        <li><strong>Sufficiency / calibration:</strong> <Tex math={String.raw`P(Y=1|\hat{Y}=s,A) = P(Y=1|\hat{Y}=s,B)`} /> — skor yang sama artinya risiko yang sama di semua grup (kalibrasi per grup, A3.6!). Standar untuk <em>pricing</em>.</li>
      </ul>
      <p><strong>Impossibility theorem</strong> (Kleinberg dkk.): ketiga definisi <strong>tidak bisa</strong> dipenuhi bersamaan kecuali kasus khusus (base rate sama atau prediksi sempurna). Memilih definisi = <strong>keputusan nilai &amp; hukum</strong>, bukan optimasi statistik.</p>

      <PlotlyChart
        data={fairnessData}
        title="Paradoks Fairness: default sama, penolakan beda 2×"
        layout={{ barmode: "group", xaxis: { title: "" }, yaxis: { title: "%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua pasang batang — kiri = default rate aktual (sama!), kanan = tingkat penolakan model.</p>
        <p><strong>Interpretasi:</strong> kedua grup <em>aktualnya</em> sama berisiko (8,2% vs 8,1%), tapi model menolak grup B <strong>2× lipat</strong> (14,5% vs 7,9%). Ini <strong>disparate impact</strong> yang nyata — melanggar demographic parity DAN equal opportunity. Model telah mempelajari proksi grup (lihat cerita Apple Card). <strong>Tindakan:</strong> bukan &ldquo;tweak threshold&rdquo; kosmetik — audit fitur proksi + mitigasi struktural.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> &ldquo;fairness through unawareness&rdquo; (buang variabel sensitif) <strong>gagal</strong> — proksi ada di mana-mana (kode pos ≈ ras/wilayah, pola belanja ≈ gender). Yang bekerja: (1) <strong>ukur</strong> disparitas dengan metrik eksplisit per grup; (2) <strong>putuskan</strong> definisi keadilan yang dipakai (bersama legal!); (3) <strong>mitigasi</strong> dan ukur ulang. Keadilan bukan &ldquo;tidak melihat&rdquo; — keadilan adalah &ldquo;melihat, mengukur, dan memperbaiki&rdquo;.</p>
      </div>

      <h2 id="mitigasi">Mitigasi Bias: Pra, Dalam, Pasca Pemrosesan</h2>
      <ul>
        <li><strong>Pre-processing:</strong> perbaiki <em>data</em> — reweighting (beri bobot agar representasi seimbang), hapus/transformasi proksi, kumpulkan data yang kurang terwakili. <em>Pro:</em> model downstream bebas pakai teknik apapun. <em>Kontra:</em> tidak menjamin output adil.</li>
        <li><strong>In-processing:</strong> <em>constraint</em> fairness saat training — optimasi akurasi <em>dengan batas</em> disparitas (misal adversarial debiasing). <em>Pro:</em> tradeoff eksplisit. <em>Kontra:</em> kompleks, butuh tuning.</li>
        <li><strong>Post-processing:</strong> sesuaikan <em>keputusan</em> — threshold berbeda per grup agar TPR sama (equal opportunity). <em>Pro:</em> sederhana, tidak perlu retrain. <em>Kontra:</em> <strong>kontroversial secara hukum</strong> di banyak yurisdiksi (perlakuan beda eksplisit = <em>disparate treatment</em>!) — konsultasikan legal dulu.</li>
      </ul>
      <p><strong>Tradeoff fairness-accuracy:</strong> umumnya ada — memaksa parity menurunkan AUC sedikit. Besarnya tergantung <em>sumber</em> bias: jika bias dari proksi yang bisa dibersihkan, tradeoff kecil; jika dari base rate yang memang beda, tradeoff besar dan keputusan menjadi normatif.</p>

      <PlotlyChart
        data={tradeoffData}
        title="Tradeoff Fairness-Accuracy: tidak ada makan siang gratis"
        layout={{ xaxis: { title: "AUC" }, yaxis: { title: "Disparitas penolakan antar grup" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = satu konfigurasi model; kanan = makin akurat, atas = makin tidak adil.</p>
        <p><strong>Interpretasi:</strong> kurva tradeoff (Pareto frontier): menaikkan AUC dari 0,80 ke 0,87 melipatgandakan disparitas (0,10 → 0,30). <strong>Titik operasional bukan &ldquo;AUC maksimal&rdquo;</strong> — melainkan titik di mana akurasi masih dapat diterima DAN disparitas di bawah ambang legal/etik. Pilihan titik = keputusan manajemen + legal, bukan grid search.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model yang akurat pasti adil — data tidak berbohong.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> data <em>mencerminkan</em> sejarah — termasuk sejarah diskriminasi (redlining, bias penagihan). Model yang &ldquo;akurat&rdquo; meniru pola historis <strong>termasuk</strong> ketidakadilannya. &ldquo;Data tidak berbohong&rdquo; justru masalahnya: ia jujur merekam ketidakadilan masa lalu, lalu model mengabadikannya sebagai &ldquo;pola&rdquo;. Fairness adalah koreksi sadar terhadap sejarah, bukan sifat alami data.</p>
      </div>

      <div className="callout callout-warning">
        <p><strong>Batasan SHAP yang wajib diketahui:</strong> (1) SHAP menjelaskan <em>model</em>, bukan dunia (bukan kausal!); (2) untuk fitur berkorelasi kuat, pembagian kontribusi antar fitur bisa <strong>arbitrer</strong> (mirip Lasso, A3.3) — jangan over-interpretasi urutan 3 vs 4; (3) SHAP bisa dimanipulasi (<em>fairwashing</em> — penjelasan yang terlihat adil untuk model yang bias); (4) komputasi mahal untuk model besar — pakai TreeSHAP untuk tree, sampling untuk yang lain.</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Explainability = &ldquo;buka kotak hitam sebelum ia memutuskan nasib orang&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: SHAP — &ldquo;mengapa ditolak?&rdquo;</summary>
              <p>Nasabah ditolak (skor 0,72 &gt; threshold 0,5). SHAP: dpd +0,25; penghasilan −0,10; usia +0,02; baseline 0,55. Jelaskan ke nasabah.</p>
              <p><strong>Langkah 1</strong> — baca: 0,55 (rata-rata) + 0,25 (dpd 45 hari!) − 0,10 (penghasilan tinggi menolong) + 0,02 = 0,72.<br />
              <strong>Langkah 2</strong> — narasi: &ldquo;Penolakan terutama karena riwayat telat 45 hari. Penghasilan Bapak membantu, tapi tidak cukup mengimbangi.&rdquo;<br />
              <strong>Langkah 3</strong> — <em>actionable</em>: &ldquo;Lunasi tunggakan &amp; jaga 6 bulan lancar → skor turun di bawah threshold.&rdquo;</p>
              <p>Pelajaran: SHAP = &ldquo;alokasi kredit&rdquo; prediksi ke fitur (additive!). Syarat regulasi (OJK: <em>right to explanation</em>!) + memperbaiki keputusan nasabah. Tanpa ini: &ldquo;komputer bilang tidak&rdquo; = tidak dapat diterima.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Fairness — equal opportunity</summary>
              <p>Model: TPR pria 80%, TPR wanita 60% (recall untuk yang <em>sebenarnya</em> layak!). Masalah?</p>
              <p><strong>Langkah 1</strong> — <strong>equal opportunity</strong> dilanggar: yang layak dari grup wanita 20 poin lebih jarang disetujui.<br />
              <strong>Langkah 2</strong> — akar: fitur berkorelasi gender (mis. &ldquo;cuti melahirkan&rdquo; → riwayat kerja terputus) atau label historis bias.<br />
              <strong>Langkah 3</strong> — obat: (a) buang/perbaiki fitur proxy, (b) threshold per grup (kontroversial!), (c) adversarial debiasing. Dan: <em>ukur dulu</em> — yang tidak diukur tidak diperbaiki.</p>
              <p>Pelajaran: &ldquo;buta gender&rdquo; (buang kolom gender) <em>tidak cukup</em> — proxy tetap bocor. Fairness butuh <em>metrik eksplisit</em> + monitoring per grup. Impossibility theorem: tidak semua definisi fairness bisa dipenuhi bersamaan — pilih sesuai konteks hukum/bisnis.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: SHAP dari Nol (Shapley Value)</h2>
      <p>Hitung Shapley value manual untuk model linear — buktikan sifat efficiency (jumlah = selisih dari baseline).</p>
      <PyodideLab
        title="Lab 1 — Shapley Value: Pembagian Bonus yang Adil"
        hint="Coba profil nasabah baik — kontribusi berbalik arah. Penjelasan SHAP selalu LOKAL."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Tiga Metrik Fairness dari Nol</h2>
      <p>Simulasikan model bias proksi. Hitung demographic parity, equal opportunity, sufficiency — saksikan ketiganya bertengkar.</p>
      <PyodideLab
        title="Lab 2 — Impossibility Theorem Live"
        hint="Hilangkan bias (0.6 → 0.0) — semua metrik adil. Ketidakadilan 100% dari model, bukan data."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Butuh Apa</h2>

      <div className="decision-card">
        <h3>1. Model untuk keputusan individual teregulasi → <strong>model intrinsik + SHAP lokal</strong></h3>
        <p><strong>Kondisi:</strong> penolakan kredit — nasabah berhak tahu alasannya.</p>
        <p><strong>Kenapa:</strong> penjelasan per nasabah (adverse action notice) adalah kewajiban hukum di banyak yurisdiksi.</p>
        <p><strong>Contoh nyata:</strong> surat penolakan KTA dengan 3 alasan utama dari SHAP.</p>
      </div>

      <div className="decision-card">
        <h3>2. Validasi &amp; dokumentasi model → <strong>SHAP global + PDP</strong></h3>
        <p><strong>Kondisi:</strong> meyakinkan validator/regulator bahwa model &ldquo;masuk akal&rdquo;.</p>
        <p><strong>Kenapa:</strong> bukti pendorong prediksi = faktor risiko yang dikenal, bukan artefak.</p>
        <p><strong>Contoh nyata:</strong> dokumen validasi model IRB.</p>
      </div>

      <div className="decision-card">
        <h3>3. Dugaan disparate impact → <strong>audit fairness per grup + mitigasi</strong></h3>
        <p><strong>Kondisi:</strong> metrik fairness menunjukkan disparitas material.</p>
        <p><strong>Kenapa:</strong> risiko hukum &amp; reputasi. Tentukan definisi (bersama legal), mitigasi, ukur ulang.</p>
        <p><strong>Contoh nyata:</strong> kasus Apple Card — investigasi regulator 2 tahun.</p>
      </div>

      <div className="decision-card">
        <h3>4. Model kompleks vs intrinsik hampir setara → <strong>pilih intrinsik</strong></h3>
        <p><strong>Kondisi:</strong> selisih AUC &lt; 1–2 poin.</p>
        <p><strong>Kenapa:</strong> kompleksitas harus membayar dirinya. Interpretabilitas = aset regulasi.</p>
        <p><strong>Contoh nyata:</strong> scorecard logistik vs boosting untuk PD ritel.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>SHAP menjelaskan model, bukan dunia.</strong> Tulis &ldquo;pendorong prediksi&rdquo;, bukan &ldquo;penyebab&rdquo;.</li>
          <li>Buang variabel sensitif ≠ adil. <strong>Ukur disparitas</strong> — selalu, per grup.</li>
          <li>Pilih definisi fairness <em>sebelum</em> optimasi — bersama legal, bukan sendirian.</li>
          <li>Kompleksitas harus membayar dirinya dengan akurasi material.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Audit Fairness Model KTA</h2>
      <div className="callout">
        <p>Kamu auditor independen model KTA. Temuan: (a) AUC 0,85, kalibrasi baik agregat; (b) SHAP global top-3: DPD, rasio utang, <strong>kode pos</strong>; (c) tingkat penolakan: wilayah X 18%, wilayah Y 7% — padahal default aktual X 9%, Y 8%; (d) tim model: &ldquo;kode pos penting untuk risiko geografis; kami tidak pakai variabel sensitif.&rdquo;</p>
        <p><strong>Pertanyaan:</strong> (a) Apa masalah dengan (b)+(c)? (b) Metrik fairness apa yang dilanggar? (c) Rekomendasi auditmu — termasuk ke tim model soal pembelaan (d)?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Kode pos = proksi wilayah yang berkorelasi dengan kelompok dilindungi</strong> (pola permukiman tersegregasi). SHAP membuktikan ia pendorong top-3 — model <em>menggunakan</em> geografi secara material. Penolakan 18% vs 7% dengan risiko aktual hampir sama (9% vs 8%) = disparate impact yang nyata.</p>
          <p>(b) <strong>Demographic parity</strong> dilanggar (18% vs 7%). <strong>Equal opportunity</strong> kemungkinan juga (TPR per grup perlu dihitung). <strong>Sufficiency</strong> mungkin <em>terpenuhi</em> (kalibrasi agregat baik) — inilah impossibility theorem: model bisa terkalibrasi tapi tidak adil menurut definisi lain!</p>
          <p>(c) <strong>Rekomendasi:</strong> (1) &ldquo;Tidak pakai variabel sensitif&rdquo; <strong>BUKAN pembelaan</strong> — proksi dihitung sebagai diskriminasi tidak langsung di banyak yurisdiksi. (2) Uji: buang kode pos → berapa AUC hilang? Jika &lt; 1 poin, buang (kompleksitas tidak membayar dirinya). Jika material, cari pengganti yang tidak berkorelasi dengan grup dilindungi + dokumentasikan <em>business necessity</em>. (3) Tetapkan definisi fairness resmi bersama legal + monitoring disparitas kuartalan. (4) Siapkan adverse action notice berbasis SHAP lokal.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>SHAP vs permutation importance — kapan masing-masing? (Lokal vs global.)</li>
              <li>Counterfactual: &ldquo;gaji Rp12jt → disetujui&rdquo;. Mengapa ini penjelasan yang <em>lebih baik</em> dari SHAP untuk nasabah?</li>
              <li>Demographic parity vs equalized odds — bisakah keduanya dipenuhi? (1 kalimat.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>SHAP</strong>: <em>lokal</em> (mengapa <em>nasabah ini</em> ditolak?) — untuk penjelasan individual &amp; regulasi. <strong>Permutation</strong>: <em>global</em> (fitur apa penting <em>umumnya</em>?) — untuk pemahaman model &amp; seleksi fitur. Keduanya dibutuhkan.</p>
              <p><strong>2.</strong> Counterfactual = <strong>recourse</strong>: memberi tahu <em>apa yang bisa diubah</em> (naikkan gaji) — actionable! SHAP memberi tahu <em>mengapa</em> (dpd tinggi) — informatif tapi belum tentu bisa diubah. Untuk nasabah: recourse &gt; atribusi.</p>
              <p><strong>3.</strong> <strong>Tidak</strong> (umumnya) — impossibility theorem: kecuali base rate sama atau prediktor sempurna, keduanya konflik. Pilih sesuai <em>prinsip hukum</em> yang berlaku (mis. equal opportunity untuk kredit di AS).</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 'Model kami adil karena tidak memakai gender sebagai variabel.' Kelemahan argumen?"
        options={[
          "Tidak ada — sudah cukup",
          "Proksi: 100 variabel lain (kode pos, pola belanja, nama) membawa informasi gender. Keadilan butuh PENGUKURAN disparitas, bukan kebutaan",
          "Gender harus dipakai",
          "Model pasti adil",
        ]}
        correct={1}
        explanation="Benar: fairness through unawareness gagal (kasus Apple Card). Informasi sensitif bocor via korelasi. Satu-satunya pertahanan: ukur metrik fairness per grup secara eksplisit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Sifat 'efficiency' SHAP menyatakan?"
        options={[
          "SHAP cepat dihitung",
          "Jumlah semua kontribusi = selisih prediksi dari baseline — tidak ada yang hilang atau ganda",
          "SHAP selalu kausal",
          "SHAP hanya untuk tree",
        ]}
        correct={1}
        explanation="Benar: efficiency = akuntansi yang lengkap. Inilah fondasi kepercayaan SHAP: penjelasannya 'menjumlah' dengan tepat ke prediksi model. (Tapi ingat: menjelaskan MODEL, bukan dunia!)"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Model terkalibrasi sempurna per grup (sufficiency ✓) tapi tingkat penolakan grup B 2× grup A (parity ✗). Mungkin?"
        options={[
          "Tidak mungkin — kontradiksi",
          "Mungkin — impossibility theorem: ketiga definisi fairness tidak bisa dipenuhi bersamaan (kecuali kasus khusus)",
          "Berarti kalibrasi salah hitung",
          "Berarti data salah",
        ]}
        correct={1}
        explanation="Benar: inilah inti impossibility theorem Kleinberg. Model bisa 'adil' menurut satu definisi dan 'tidak adil' menurut yang lain. Pilih definisi = keputusan nilai/hukum."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan model INTRINSIK (logistik/scorecard) lebih baik dari boosting + SHAP?"
        options={[
          "Tidak pernah — boosting selalu menang",
          "Jika selisih akurasi kecil (<1-2 poin AUC): interpretabilitas adalah aset regulasi; kompleksitas harus 'membayar' dirinya",
          "Hanya untuk data kecil",
          "SHAP selalu cukup",
        ]}
        correct={1}
        explanation="Benar: hierarki kejujuran = intrinsik > SHAP > LIME. Jika boosting hanya menang 0,5 poin AUC, harganya (kotak hitam + risiko fairwashing + penjelasan aproksimasi) tidak worth it untuk keputusan teregulasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Post-processing 'threshold berbeda per grup' untuk equal opportunity. Peringatan?"
        options={[
          "Tidak ada — solusi sempurna",
          "Kontroversial secara hukum: perlakuan eksplisit berbeda per grup bisa = disparate treatment. Konsultasikan legal dulu",
          "Selalu menaikkan akurasi",
          "Tidak perlu diukur ulang",
        ]}
        correct={1}
        explanation="Benar: ironisnya, 'memperbaiki' keadilan dengan aturan beda per grup bisa melanggar hukum anti-diskriminasi dari sisi lain. Fairness adalah wilayah hukum, bukan sekadar statistik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. SHAP menempatkan 'kode pos' di top-3 pendorong default. Tindakan analis?"
        options={[
          "Langsung buang kode pos",
          "Investigasi: apakah proksi grup dilindungi? Uji kontribusi marginalnya (berapa AUC hilang jika dibuang?) + diskusikan business necessity dengan legal",
          "Abaikan — SHAP pasti benar",
          "Tambah lebih banyak fitur geografis",
        ]}
        correct={1}
        explanation="Benar: SHAP adalah alarm, bukan vonis. Langkahnya: (1) cek korelasi dengan atribut dilindungi, (2) uji materialitas (AUC tanpa fitur itu), (3) keputusan bersama legal tentang business necessity vs risiko disparate impact."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Taksonomi:</strong> global vs lokal; intrinsik (pilih jika bisa!) vs post-hoc. Hierarki: intrinsik &gt; SHAP &gt; LIME.</li>
          <li><strong>SHAP:</strong> Shapley value — efficiency + symmetry + consistency. Menjelaskan <em>model</em>, bukan kausalitas dunia.</li>
          <li><strong>Fairness:</strong> demographic parity vs equal opportunity vs sufficiency — <strong>tidak bisa</strong> ketiganya sekaligus (impossibility).</li>
          <li><strong>Mitigasi:</strong> pre/in/post-processing. &ldquo;Buang variabel sensitif&rdquo; ≠ adil — proksi ada di mana-mana.</li>
          <li><strong>Jangan</strong> tulis &ldquo;penyebab&rdquo; dari SHAP; jangan perbaiki fairness tanpa legal; jangan kejar AUC buta disparitas.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a313-kausal" className="btn btn-secondary btn-sm">← A3.13</Link>
        <Link href="/" className="btn btn-primary btn-sm">Selesai: Daftar Materi →</Link>
      </div>
    </div>
  );
}
