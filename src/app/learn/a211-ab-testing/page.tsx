"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function A211Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  // Chart 1: funnel konversi kontrol vs varian
  const funnelData = [
    {
      x: ["Kunjung", "Klik CTA", "Isi form", "Cair"],
      y: [100000, 12000, 3600, 1440],
      type: "bar",
      name: "Kontrol",
      marker: { color: "#94a3b8" },
    },
    {
      x: ["Kunjung", "Klik CTA", "Isi form", "Cair"],
      y: [100000, 13500, 4200, 1785],
      type: "bar",
      name: "Varian B",
      marker: { color: "#2a7de1" },
    },
  ];

  // Chart 2: lift harian dengan CI menyempit (kumulatif)
  const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const liftMean = [3.1, 2.4, 2.8, 1.9, 2.2, 1.7, 2.0, 1.8, 1.9, 1.7, 1.8, 1.6, 1.7, 1.65];
  const liftSe = [2.2, 1.6, 1.3, 1.1, 1.0, 0.9, 0.8, 0.75, 0.7, 0.65, 0.62, 0.6, 0.58, 0.55];
  const liftData = [
    {
      x: days,
      y: liftMean,
      type: "scatter",
      mode: "lines+markers",
      name: "Lift kumulatif (pp)",
      line: { color: "#2a7de1" },
      error_y: { type: "data", array: liftSe.map((s) => 1.96 * s), visible: true, color: "#94a3b8" },
    },
    {
      x: [1, 14],
      y: [0, 0],
      type: "scatter",
      mode: "lines",
      name: "Tidak ada efek",
      line: { dash: "dash", color: "#c2410c" },
    },
  ];

  // Chart 3: SRM check — split aktual vs ekspektasi 50/50
  const srmData = [
    {
      x: ["Ekspektasi<br>50/50", "Aktual<br>hari 1–3", "Aktual<br>hari 4–7"],
      y: [50, 50.2, 56.8],
      type: "bar",
      marker: { color: ["#94a3b8", "#16a34a", "#c2410c"] },
      text: ["50,0%", "50,2%", "56,8% ⚠️"],
      textposition: "outside",
    },
  ];

  const lab1Code = `import math

# Analisis A/B test end-to-end: uji dua proporsi + CI lift.
# Data: kontrol 1440/100000 cair (1.44%), varian 1785/100000 (1.785%)

def ab_test(x1, n1, x2, n2, alpha=0.05):
    p1, p2 = x1/n1, x2/n2
    # Uji z dua proporsi (pooled SE untuk H0)
    pp = (x1+x2)/(n1+n2)
    se0 = math.sqrt(pp*(1-pp)*(1/n1+1/n2))
    z = (p2-p1)/se0
    Phi = 0.5*(1+math.erf(abs(z)/math.sqrt(2)))
    pval = 2*(1-Phi)
    # CI lift (unpooled SE)
    se = math.sqrt(p1*(1-p1)/n1 + p2*(1-p2)/n2)
    lift = p2-p1
    zc = 1.96
    return p1, p2, z, pval, lift, lift-zc*se, lift+zc*se

p1, p2, z, pval, lift, lo, hi = ab_test(1440, 100000, 1785, 100000)
print(f"Kontrol: {p1:.3%}   Varian: {p2:.3%}")
print(f"Lift absolut = {lift*100:.3f} pp, 95% CI = ({lo*100:.3f}, {hi*100:.3f}) pp")
print(f"Lift relatif = {lift/p1:.1%}")
print(f"z = {z:.2f}, p-value = {pval:.4f}")
print()
print("Keputusan: p < 0.05 DAN batas bawah CI > MDE (misal 0.1pp)?")
print("Jika ya -> ship. Jika CI mencakup nilai di bawah MDE -> belum layak.")
print()
print("Coba: ubah n jadi 10000 per varian (skala proporsional).")
print("Lift sama, tapi CI melebar -> keputusan bisa berbalik!")`;

  const lab2Code = `import math

# SRM check: apakah split aktual masih 50/50? (chi-square goodness-of-fit)
# Skenario: bug tracking di hari ke-4 membuat varian dapat trafik lebih.

def srm_check(n1, n2, p_expected=0.5):
    n = n1+n2
    e1, e2 = n*p_expected, n*(1-p_expected)
    chi2 = (n1-e1)**2/e1 + (n2-e2)**2/e2
    # p-value chi-square df=1 via aproksimasi
    pval = 1 - math.erf(math.sqrt(chi2/2))
    return chi2, pval

for label, a, b in [("Hari 1-3 (normal)", 60240, 59760),
                    ("Hari 4-7 (bug?)", 68160, 51840)]:
    chi2, pval = srm_check(a, b)
    status = "OK " if pval > 0.05 else "SRM! BAHAYA"
    print(f"{label}: split {a/(a+b):.1%}/{b/(a+b):.1%}  chi2={chi2:.1f} p={pval:.4f} -> {status}")

print()
print("SRM = Sample Ratio Mismatch: bukti randomisasi rusak.")
print("Aturan: JANGAN ambil keputusan dari test yang SRM — perbaiki dulu,")
print("buang periode rusak, atau ulangi test.")
print("Coba: ubah hari 4-7 jadi 60500/59500. SRM hilang?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">A2.11 — Statistika Inferensial</span>
        <h1 className="display-title">Dari Hipotesis ke Keputusan Bisnis:<br />A/B Testing End-to-End</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* PRASYARAT KILAT */}
      <div className="callout">
        <p><strong>🧭 Prasyarat kilat (2 menit).</strong> A/B testing adalah <strong>orkestrasi</strong> dari hampir semua lesson track ini: <strong>uji hipotesis</strong> (kerangka keputusan), <strong>uji dua proporsi</strong> (mesinnya), <strong>effect size</strong> (penting vs signifikan), <strong>multiple testing</strong> (banyak metrik), dan <strong>power</strong> (berapa lama test berjalan). Jika lesson-lesson itu adalah alat-alat musik, lesson ini adalah konsernya — satu alur kerja utuh dari ide sampai keputusan ship/tidak.</p>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tombol $300 Juta</a></li>
          <li><a href="#hipotesis">Langkah 1 — Hipotesis &amp; Metrik</a></li>
          <li><a href="#desain">Langkah 2 — Desain: Randomisasi &amp; Ukuran Sampel</a></li>
          <li><a href="#jalan">Langkah 3 — Menjalankan: SRM &amp; Larangan Mengintip</a></li>
          <li><a href="#analisis">Langkah 4 — Analisis: Uji, CI &amp; Keputusan</a></li>
          <li><a href="#jebakan">Lima Jebakan A/B Testing</a></li>
          <li><a href="#lab1">🔬 Lab 1: Analisis A/B Test End-to-End</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi SRM</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Situasi A/B Testing</a></li>
          <li><a href="#case">📋 Mini-Case: Redesign Alur Pengajuan Kredit</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyusun <strong>hipotesis yang bisa diuji</strong> dan memilih <strong>metrik primer + guardrail</strong> untuk sebuah eksperimen.</li>
          <li>Menghitung <strong>durasi test</strong> dari MDE, baseline, dan trafik — serta menjelaskan mengapa berhenti awal dilarang.</li>
          <li>Mendeteksi <strong>Sample Ratio Mismatch (SRM)</strong> dengan chi-square dan menjelaskan tindak lanjutnya.</li>
          <li>Menganalisis hasil A/B test: <strong>uji dua proporsi + CI lift</strong> — dan mengambil keputusan ship/tidak berbasis MDE.</li>
          <li>Mengidentifikasi <strong>5 jebakan</strong> (peeking, novelty, multiple metrics, Simpson, underpower) pada kasus nyata.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Tombol $300 Juta</h2>
      <div className="story">
        <p>Tahun 2010, tim kampanye Obama menguji tombol &ldquo;Sign Up&rdquo; di halaman donasi. Varian pemenang — foto keluarga + tombol &ldquo;Learn More&rdquo; — menaikkan <em>sign-up rate</em> dari 8,26% ke 11,6%. Kenaikan relatif 40%. Nilai tambah donasi: <strong>$60 juta</strong>.</p>
        <p>Di sisi lain samudra, sebuah e-commerce menguji hal yang sama tanpa disiplin: mereka mengintip hasil tiap jam, berhenti saat &ldquo;menang&rdquo; di jam ke-6, dan me-rollout ke 100% trafik. Tiga minggu kemudian revenue <em>turun</em> 2%. &ldquo;Kemenangan&rdquo; itu adalah noise + novelty effect — pengguna mengklik karena <em>baru</em>, bukan karena <em>lebih baik</em>.</p>
        <p><strong>Twist-nya:</strong> A/B testing terlihat sederhana — &ldquo;bandingkan dua angka, pilih yang menang&rdquo; — tapi justru karena terlihat sederhana, ia menjadi <strong>sumber keputusan buruk yang paling produktif</strong> di perusahaan digital. Perbedaan antara $60 juta dan bencana bukanlah ide tombolnya, melainkan <strong>disiplin metodologinya</strong>. Lesson ini adalah disiplin itu, langkah demi langkah.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="hipotesis">Langkah 1 — Hipotesis &amp; Metrik</h2>
      <p><strong>Hipotesis yang bisa diuji</strong> punya 3 komponen: <strong>perubahan</strong> → <strong>mekanisme</strong> → <strong>dampak terukur</strong>. &ldquo;Tombol baru lebih bagus&rdquo; bukan hipotesis. &ldquo;Mengganti teks CTA menjadi &lsquo;Ajukan Sekarang&rsquo; <em>mengurangi keraguan</em> sehingga <em>klik CTA naik</em>&rdquo; adalah hipotesis — ia bisa salah, dan memberi tahu <em>mengapa</em> jika benar.</p>
      <p><strong>Metrik primer</strong> — SATU metrik keputusan (biasanya di ujung funnel: konversi cair, revenue per pengunjung). <strong>Metrik guardrail</strong> — yang tidak boleh rusak (komplain, chargeback, waktu loading): kemenangan yang merusak guardrail = kekalahan. <strong>Metrik diagnostik</strong> — di tengah funnel (klik CTA, isi form) untuk memahami <em>di mana</em> efek terjadi.</p>

      <PlotlyChart
        data={funnelData}
        title="Funnel: di Mana Lift Terjadi? (per 100 rb pengunjung)"
        layout={{ barmode: "group", xaxis: { title: "Tahap funnel" }, yaxis: { title: "Pengguna" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap tahap funnel, dua batang (kontrol vs varian). Ikuti dari kiri ke kanan: di tahap mana batang biru mulai menjauh?</p>
        <p><strong>Interpretasi:</strong> lift sudah terlihat di &ldquo;Klik CTA&rdquo; (13.500 vs 12.000) dan bertahan sampai &ldquo;Cair&rdquo;. <strong>Pola sehat:</strong> efek konsisten di sepanjang funnel sesuai hipotesis (&ldquo;mengurangi keraguan&rdquo;). <strong>Pola mencurigakan:</strong> lift hanya di klik tapi hilang di cair — berarti CTA baru menarik klik penasaran yang tidak konversi (clickbait internal).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tetapkan metrik primer <strong>sebelum</strong> test jalan — dan tulis. Fleksibilitas memilih metrik <em>setelah</em> melihat hasil = p-hacking dengan 10 metrik (ingat A2.8: peluang ≥1 &ldquo;menang&rdquo; palsu dari 10 metrik ≈ 40%). Satu primer + guardrail yang ditulis di awal adalah kontrak kejujuranmu.</p>
      </div>

      <h2 id="desain">Langkah 2 — Desain: Randomisasi &amp; Ukuran Sampel</h2>
      <p><strong>Unit randomisasi:</strong> siapa yang diacak? Idealnya <strong>pengguna</strong> (satu pengguna selalu lihat varian yang sama — konsistensi pengalaman). Randomisasi per <em>kunjungan</em> membuat pengguna melihat dua versi bergantian — membingungkan dan mencemari efek.</p>
      <p><strong>Ukuran sampel</strong> — dari A2.10, dengan MDE dari break-even bisnis:</p>
      <Tex math={String.raw`n_{\text{per varian}} = \frac{2\bar{p}(1-\bar{p})(z_{1-\alpha/2} + z_{1-\beta})^2}{\text{MDE}^2}`} block />
      <p><strong>Durasi = n / trafik harian</strong>, dibulatkan ke <strong>kelipatan minggu penuh</strong> (efek day-of-week: perilaku Senin ≠ Sabtu). Test 10 hari mencampur 2 Senin + 1 Sabtu — bias komposisi.</p>
      <p><strong>Kepribadian langkah ini:</strong> si perencana yang membosankan — 90% kualitas A/B test ditentukan <em>sebelum</em> test dimulai. Test yang didesain buruk tidak bisa diselamatkan oleh analisis brilian.</p>

      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah: desain test</summary>
        <p>Baseline konversi 12%, MDE 1,5 pp, trafik 4.000/hari, α=5%, power=80%.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`n = 2 \times 0{,}12 \times 0{,}88 \times 7{,}84 / 0{,}015^2 \approx 7.358`} /> per varian.<br />
        <strong>Langkah 2</strong> — total 14.716 / 4.000 ≈ 3,7 hari → <strong>7 hari</strong> (1 minggu penuh).<br />
        <strong>Langkah 3</strong> — tulis kontrak: primer = konversi cair; guardrail = komplain &amp; NPL 30 hari; berhenti hanya di hari ke-7 (kecuali guardrail jebol).</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Berhenti lebih awal kalau sudah signifikan — hemat waktu.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> berhenti saat &ldquo;menang&rdquo; adalah <strong>peeking</strong> — α efektifmu bukan lagi 5%. Efek yang terlihat di awal sering <strong>melebih-lebihkan</strong> efek sebenarnya (winner&rsquo;s curse): hanya fluktuasi ke atas yang memicu pemberhentian dini. Komitmen pada durasi yang dihitung — atau pakai desain sekuensial formal.</p>
      </div>

      <h2 id="jalan">Langkah 3 — Menjalankan: SRM &amp; Larangan Mengintip</h2>
      <p><strong>SRM (Sample Ratio Mismatch)</strong> — proporsi split aktual menyimpang dari desain (misal 56/44 padahal dirancang 50/50). Penyebab: bug tracking, bot, cache, redirect yang gagal. <strong>SRM = bukti randomisasi rusak</strong> → hasil tidak bisa dipercaya, titik.</p>
      <p><strong>Cek SRM:</strong> chi-square goodness-of-fit pada jumlah per varian vs ekspektasi:</p>
      <Tex math={String.raw`\chi^2 = \frac{(n_A - n/2)^2}{n/2} + \frac{(n_B - n/2)^2}{n/2}, \quad df = 1`} block />
      <p>Jika p &lt; 0,05 (atau lebih ketat: p &lt; 0,001 untuk n besar) → investigasi. <strong>Tindakan:</strong> perbaiki bug → buang periode rusak → atau ulangi test. Jangan &ldquo;adjust&rdquo; dan lanjut — fondasinya retak.</p>
      <p><strong>Aturan selama berjalan:</strong> (1) jangan intip hasil primer; (2) <strong>boleh</strong> pantau guardrail &amp; SRM (itu monitoring kesehatan, bukan keputusan); (3) jika guardrail jebol parah → hentikan demi keamanan (pre-defined stopping rule).</p>

      <PlotlyChart
        data={srmData}
        title="SRM Check: Split Aktual vs Desain 50/50"
        layout={{ yaxis: { title: "% trafik ke varian B", range: [0, 65] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = % trafik yang masuk varian B. Bandingkan dengan batang abu-abu (desain).</p>
        <p><strong>Interpretasi:</strong> hari 1–3 normal (50,2% — fluktuasi wajar). Hari 4–7: 56,8% — chi-square p &lt; 0,001 → <strong>SRM terkonfirmasi</strong>. Hasil hari 4–7 <em>tidak valid</em> (kemungkinan bug redirect). Keputusan: investigasi, buang periode rusak, perpanjang test. <strong>Analis yang melewatkan SRM mengambil keputusan dari data rusak.</strong></p>
      </div>

      <h2 id="analisis">Langkah 4 — Analisis: Uji, CI &amp; Keputusan</h2>
      <p><strong>Uji dua proporsi</strong> (untuk konversi):</p>
      <Tex math={String.raw`z = \frac{\hat{p}_B - \hat{p}_A}{\sqrt{\hat{p}(1-\hat{p})(1/n_A + 1/n_B)}}, \quad \hat{p} = \frac{x_A + x_B}{n_A + n_B}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`\hat{p}_A, \hat{p}_B`} /> konversi tiap varian; <Tex math={String.raw`\hat{p}`} /> proporsi gabungan (pooled, untuk SE di bawah H0). Untuk mean kontinu → uji-t Welch (A2.5).</p>
      <p><strong>Tapi keputusan bukan dari p-value saja</strong> — melainkan dari <strong>CI lift vs MDE</strong>:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Posisi 95% CI lift</th><th>Keputusan</th></tr></thead>
          <tbody>
            <tr><td>Seluruh CI &gt; MDE</td><td>✅ <strong>Ship</strong> — efek cukup besar &amp; meyakinkan</td></tr>
            <tr><td>CI mencakup 0, tapi batas atas &gt; MDE</td><td>⏳ <strong>Belum konklusif</strong> — tambah durasi / terima &ldquo;tidak cukup bukti&rdquo;</td></tr>
            <tr><td>Seluruh CI di (0, MDE)</td><td>❌ <strong>Jangan ship</strong> — &ldquo;signifikan&rdquo; tapi di bawah break-even</td></tr>
            <tr><td>CI mencakup nilai negatif besar</td><td>🛑 <strong>Kill</strong> — varian merugikan</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Kepribadian langkah ini:</strong> si hakim yang membaca tiga dokumen — p-value (&ldquo;apakah nyata?&rdquo;), CI (&ldquo;seberapa besar?&rdquo;), MDE (&ldquo;apakah cukup?&rdquo;). Vonis hanya sah jika ketiganya dibaca.</p>

      <PlotlyChart
        data={liftData}
        title="Lift Kumulatif + 95% CI Menyempit Seiring Waktu"
        layout={{ xaxis: { title: "Hari ke-" }, yaxis: { title: "Lift (poin %)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> titik = lift kumulatif sampai hari itu; garis error = 95% CI. Garis oranye = nol.</p>
        <p><strong>Interpretasi:</strong> hari 1–3: lift tampak besar (3 pp) tapi CI lebar &amp; mencakup nol — <strong>jangan bereaksi</strong>. Hari 7+: CI menyempit dan seluruhnya di atas nol; hari 14: lift 1,65 pp, CI (0,6, 2,7). <strong>Visualisasi larangan mengintip:</strong> keputusan di hari ke-2 (berdasarkan titik 2,4 pp) vs hari ke-14 (1,65 pp) — mengintip melebih-lebihkan.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> laporkan selalu <strong>lift relatif + absolut + CI</strong>. &ldquo;Naik 13,6% relatif&rdquo; terdengar besar; &ldquo;+1,65 pp (95% CI: 0,6–2,7)&rdquo; memberi gambaran jujur. Dan bandingkan batas bawah CI dengan MDE — bukan titik estimasi dengan nol.</p>
      </div>

      <h2 id="jebakan">Lima Jebakan A/B Testing</h2>
      <p><strong>1. Novelty &amp; primacy effect.</strong> Pengguna bereaksi terhadap <em>kebaruan</em> (klik karena baru) atau <em>kebiasaan</em> (menolak karena beda). Solusi: jalankan cukup lama (2+ minggu) agar efek kebaruan memudar; waspadai metrik yang &ldquo;menang di minggu 1, kalah di minggu 3&rdquo;.</p>
      <p><strong>2. Multiple metrics.</strong> 10 metrik → 40% peluang ≥1 &ldquo;menang&rdquo; palsu. Solusi: satu primer (ditulis di awal) + koreksi Holm untuk sekunder (A2.8).</p>
      <p><strong>3. Simpson&rsquo;s paradox.</strong> Varian menang di agregat tapi kalah di <em>setiap</em> segmen (atau sebaliknya) — karena komposisi segmen beda antar varian (sering akibat SRM tersembunyi). Solusi: cek hasil per segmen besar; pastikan randomisasi seimbang.</p>
      <p><strong>4. Network/spillover effect.</strong> Pengguna kontrol &ldquo;tertular&rdquo; perlakuan (misal fitur sosial, marketplace). Solusi: randomisasi per klaster (kota, grup) bukan per individu — atau akui keterbatasannya.</p>
      <p><strong>5. Underpower + peeking.</strong> Kombinasi paling umum: n kurang, lalu &ldquo;kompensasi&rdquo; dengan mengintip tiap hari. Hasilnya: false positive + estimasi bias ke atas. Solusi: hitung durasi di awal, komitmen.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;A/B test tidak signifikan = varian tidak lebih baik, kembali ke desain lama.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;tidak signifikan&rdquo; dengan CI (−0,2, +1,8) vs MDE 1,5 pp berarti <strong>belum konklusif</strong> — efek 1,5 pp masih mungkin! Keputusan yang benar: perpanjang test (jika murah) atau terima ketidakpastian. Hanya jika <em>seluruh</em> CI di bawah MDE kamu boleh menyimpulkan &ldquo;tidak cukup baik&rdquo;. &ldquo;Gagal menolak&rdquo; ≠ &ldquo;terbukti sama&rdquo; (A2.4).</p>
      </div>

      {/* 7. LABS */}
            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Dua kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. A/B testing = &ldquo;uji hipotesis dengan uang&rdquo;.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Peeking — dosa A/B testing</summary>
              <p>Test berjalan 7 hari (rencana 14 hari). Hari ke-7: p = 0,04! Hentikan &amp; luncurkan?</p>
              <p><strong>Langkah 1</strong> — <strong>jangan!</strong> Mengintip &amp; berhenti saat signifikan = <em>peeking</em>: peluang false positive bukan lagi 5%.<br />
              <strong>Langkah 2</strong> — intuisi: dari 14 hari, peluang <em>pernah</em> p &lt; 0,05 di bawah H0 ≈ 15–20% (bukan 5%) — seperti multiple testing waktu (A2.8!).<br />
              <strong>Langkah 3</strong> — yang benar: tentukan n <em>di muka</em> (power analysis, A2.10) &amp; patuhi. Atau pakai <em>sequential testing</em> (alpha spending) jika harus mengintip.</p>
              <p>Pelajaran: &ldquo;berhenti saat menang&rdquo; = strategi penjudi, bukan ilmuwan. Disiplin pre-registrasi memisahkan eksperimen dari p-hacking.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: SRM — randomisasi bocor</summary>
              <p>A/B test: grup A 100.200 pengguna, grup B 99.800 (target 50:50). Masalah?</p>
              <p><strong>Langkah 1</strong> — cek SRM (sample ratio mismatch): χ² = (200² + 200²)/100.000 = 0,8 &lt; 3,84 → <strong>OK</strong> (fluktuasi wajar).<br />
              <strong>Langkah 2</strong> — jika A=110.000, B=90.000: χ² = (10.000²×2)/100.000 = 2.000 → <strong>SRM!</strong> Randomisasi bocor (bot? bug redirect?).<br />
              <strong>Langkah 3</strong> — aturan: cek SRM <em>sebelum</em> baca hasil. SRM = &ldquo;alarm kebakaran&rdquo; eksperimen — hasil apapun setelahnya tidak dipercaya.</p>
              <p>Pelajaran: SRM 30 detik mencegah keputusan dari eksperimen rusak. Masukkan ke checklist setiap analisis A/B.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Analisis A/B Test End-to-End</h2>
      <p>Dari data mentah (konversi per varian) sampai keputusan: uji-z dua proporsi, CI lift, dan aturan keputusan berbasis MDE.</p>
      <PyodideLab
        title="Lab 1 — Uji Dua Proporsi + CI Lift (Live Python)"
        hint="⚡ Live Python. Coba: ubah n jadi 10.000 per varian (skala proporsional, lift sama). CI melebar — keputusan bisa berbalik dari 'ship' jadi 'belum konklusif'!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Deteksi SRM</h2>
      <p>Implementasikan SRM check dengan chi-square. Uji pada dua skenario: split normal vs split rusak — dan rasakan perbedaannya.</p>
      <PyodideLab
        title="Lab 2 — Sample Ratio Mismatch Check (Live Python)"
        hint="Coba: ubah hari 4–7 jadi 60500/59500. SRM hilang? Lalu coba 52000/48000 dengan n total 20.000 — SRM butuh n besar untuk terdeteksi?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Situasi A/B Testing</h2>

      <div className="decision-card">
        <h3>1. Trafik besar, metrik biner (konversi) → <strong>A/B klasik dua proporsi</strong></h3>
        <p><strong>Kondisi:</strong> ribuan pengunjung/hari, metrik ya/tidak.</p>
        <p><strong>Kenapa:</strong> uji-z dua proporsi + CI lift. Desain paling standar, tooling paling matang.</p>
        <p><strong>Contoh nyata:</strong> test CTA landing page (seperti contoh lesson ini).</p>
      </div>

      <div className="decision-card">
        <h3>2. Metrik kontinu &amp; miring (revenue/pengguna) → <strong>Welch atau bootstrap</strong></h3>
        <p><strong>Kondisi:</strong> revenue per pengguna — didominasi segelintir whale.</p>
        <p><strong>Kenapa:</strong> uji-t Welch untuk n besar (CLT), atau bootstrap untuk CI yang jujur. Pertimbangkan transformasi atau winsorize untuk stabilitas — tapi laporkan apa adanya juga.</p>
        <p><strong>Contoh nyata:</strong> test pricing terhadap ARPU.</p>
      </div>

      <div className="decision-card">
        <h3>3. Trafik kecil, butuh jawaban cepat → <strong>MDE realistis atau jangan test</strong></h3>
        <p><strong>Kondisi:</strong> 200 pengunjung/hari.</p>
        <p><strong>Kenapa:</strong> dengan trafik kecil, hanya efek BESAR yang terdeteksi. Hitung dulu: jika MDE bisnis butuh 6 bulan — batalkan test, pakai riset kualitatif / pre-post dengan kontrol.</p>
        <p><strong>Contoh nyata:</strong> fitur B2B dengan 50 pengguna — wawancara mendalam &gt; A/B test.</p>
      </div>

      <div className="decision-card">
        <h3>4. Banyak varian (&gt;2) → <strong>A/B/C dengan koreksi</strong></h3>
        <p><strong>Kondisi:</strong> 4 desain landing page sekaligus.</p>
        <p><strong>Kenapa:</strong> tiap perbandingan vs kontrol adalah satu uji → koreksi Holm (A2.8). Atau: eliminasi bertahap (test A vs B, pemenang vs C).</p>
        <p><strong>Contoh nyata:</strong> 5 subject line email — Holm untuk 4 perbandingan.</p>
      </div>

      <div className="decision-card">
        <h3>5. Efek jaringan / marketplace → <strong>randomisasi klaster atau geo-experiment</strong></h3>
        <p><strong>Kondisi:</strong> pengguna saling memengaruhi (sosial, driver-penumpang).</p>
        <p><strong>Kenapa:</strong> randomisasi individu tercemar spillover. Acak per kota/wilayah — harga: n efektif mengecil (butuh lebih banyak klaster).</p>
        <p><strong>Contoh nyata:</strong> test insentif driver per kota, bukan per driver.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik — checklist pre-launch</h3>
        <ol>
          <li><strong>Hipotesis tertulis</strong> (perubahan → mekanisme → dampak).</li>
          <li><strong>Satu metrik primer + guardrail</strong>, ditetapkan sebelum test.</li>
          <li><strong>n &amp; durasi dihitung</strong> dari MDE; durasi = kelipatan minggu.</li>
          <li><strong>Komitmen:</strong> tidak intip primer; SRM check jalan; stopping rule tertulis.</li>
          <li><strong>Keputusan dari CI vs MDE</strong> — bukan dari p-value saja.</li>
        </ol>
      </div>

      {/* 10. MINI-CASE */}
      <h2 id="case">📋 Mini-Case: Redesign Alur Pengajuan Kredit</h2>
      <div className="callout">
        <p>DanaKita mendesain ulang alur pengajuan kredit (5 langkah → 3 langkah). Desain test:</p>
        <ul>
          <li>Baseline konversi pengajuan→cair: 12%</li>
          <li>MDE (break-even Rp800 jt biaya): 1,5 pp</li>
          <li>Trafik: 4.000/hari → durasi 7 hari (dihitung)</li>
          <li>Primer: konversi cair; guardrail: NPL 30 hari &amp; komplain</li>
        </ul>
        <p>Hasil hari ke-7: kontrol 12,0% (3.360/28.000), varian 13,1% (3.668/28.000). p = 0,004. Guardrail aman. SRM check lolos.</p>
        <p><strong>Pertanyaan:</strong> (a) Hitung lift + 95% CI. (b) Keputusan ship/tidak? (c) Apa yang masih perlu diwaspadai pasca-ship?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) Lift = 1,1 pp. SE = √(0,12×0,88/28.000 × 2) ≈ 0,00275 → 95% CI = 1,1 ± 0,54 = <strong>(0,56 pp, 1,64 pp)</strong>. Lift relatif ≈ +9%.</p>
          <p>(b) <strong>Keputusan: belum ship penuh.</strong> p signifikan (0,004) TAPI seluruh CI (0,56–1,64) <strong>di bawah MDE 1,5 pp</strong> kecuali ujung atasnya — efeknya &ldquo;nyata tapi kemungkinan di bawah break-even&rdquo;. Opsi: (1) rollout bertahap 50% sambil pantau (mengumpulkan bukti tambahan murah); (2) terima bahwa redesign &ldquo;baik tapi tidak cukup baik&rdquo; dan cari ide berikutnya. <strong>Ini contoh textbook &ldquo;signifikan tapi tidak penting&rdquo;.</strong></p>
          <p>(c) <strong>Pasca-ship:</strong> (1) novelty effect — pantau 4 minggu, apakah lift bertahan? (2) NPL jangka panjang — konversi naik bisa berarti standar melonggar (guardrail 30 hari belum cukup untuk kredit!); (3) heterogenitas — apakah lift merata atau hanya di segmen berisiko tinggi? <strong>A/B test tidak berakhir saat ship — ia berakhir saat efeknya terbukti bertahan.</strong></p>
        </details>
      </div>

      {/* 11. QUIZ */}
            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>Novelty effect: fitur baru menang di minggu 1, kalah di minggu 4. Apa yang terjadi? Bagaimana desain test yang benar?</li>
              <li>10 metrik diukur, 1 signifikan (p=0,03). Keputusan?</li>
              <li>Guardrail metric vs primary metric — bedakan + beri contoh.</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> <strong>Novelty effect</strong>: pengguna mencoba karena baru, bukan karena lebih baik. Desain: jalankan cukup lama (≥ 2–4 minggu) + analisis <em>cohort baru vs lama</em> terpisah. Jangan luncurkan dari minggu 1.</p>
              <p><strong>2.</strong> <strong>Multiple testing!</strong> (A2.8) — ekspektasi false positive dari 10 uji = 0,5. Satu &ldquo;temuan&rdquo; = wajar sebagai noise. Koreksi (Holm/BH) atau tetapkan <em>primary metric tunggal</em> di muka.</p>
              <p><strong>3.</strong> <strong>Primary</strong>: yang ingin dinaikkan (konversi). <strong>Guardrail</strong>: yang tidak boleh turun (retensi, load time, complaint rate). Keputusan luncurkan = primary naik signifikan <em>dan</em> guardrail aman. Tanpa guardrail: &ldquo;menang&rdquo; yang merusak bisnis.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. SRM check menunjukkan split 57/43 (dirancang 50/50), p < 0,001, dengan hasil 'varian menang signifikan'. Tindakan tepat?"
        options={[
          "Ship — hasilnya signifikan",
          "Jangan ambil keputusan: SRM = bukti randomisasi rusak. Investigasi bug, buang periode rusak, atau ulangi test",
          "Adjust angkanya secara proporsional lalu ship",
          "Naikkan α jadi 10%",
        ]}
        correct={1}
        explanation="Benar. SRM berarti fondasi eksperimen (randomisasi) retak — 'kemenangan' bisa murni artefak bug (misal bot masuk varian). Tidak ada analisis yang menyelamatkan data dari randomisasi rusak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Hasil: lift 1,1 pp, 95% CI (0,56, 1,64), MDE = 1,5 pp, p = 0,004. Keputusan?"
        options={[
          "Ship — p signifikan",
          "Jangan ship penuh: signifikan tapi CI seluruhnya di bawah MDE (kecuali ujung) — efek 'nyata tapi kemungkinan di bawah break-even'",
          "Batalkan — tidak signifikan",
          "Ulangi test sampai CI di atas MDE",
        ]}
        correct={1}
        explanation="Benar. Ini inti 'keputusan dari CI vs MDE, bukan p-value'. p=0,004 hanya bilang efeknya nyata; CI bilang efeknya (0,56–1,64) kemungkinan di bawah 1,5 pp yang dibutuhkan. Opsi 4 adalah p-hacking."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa durasi test harus kelipatan minggu penuh?"
        options={[
          "Agar angkanya cantik",
          "Perilaku pengguna berbeda per hari (Senin ≠ Sabtu) — durasi non-kelipatan mencampur komposisi hari secara tidak seimbang",
          "Karena server restart tiap Senin",
          "Tidak perlu",
        ]}
        correct={1}
        explanation="Benar — day-of-week effect. Test 10 hari = 2 Senin + 1 Sabtu vs komposisi normal. Selalu bulatkan ke minggu penuh agar komposisi hari konsisten."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Varian 'menang' di agregat tapi kalah di setiap segmen usia. Fenomena apa dan kemungkinan penyebabnya?"
        options={[
          "Tidak mungkin terjadi",
          "Simpson's paradox — kemungkinan komposisi segmen tidak seimbang antar varian (randomisasi/SRM bermasalah). Cek hasil per segmen & SRM",
          "Varian memang lebih baik",
          "Data salah input",
        ]}
        correct={1}
        explanation="Benar. Agregat bisa berbalik jika satu varian kebetulan mendapat lebih banyak segmen 'mudah'. Ini sinyal bahaya randomisasi — jangan rayakan kemenangan agregat sebelum cek per segmen."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Test dengan 8 metrik sekunder tanpa koreksi, 1 'menang' (p=0,03). Reaksi tepat?"
        options={[
          "Ship berdasarkan metrik itu",
          "Curiga multiple testing: peluang ≥1 menang palsu dari 8 metrik ≈ 34%. Terapkan Holm; jika tidak lolos, anggap eksploratori",
          "Pilih metrik lain yang menang",
          "Naikkan α",
        ]}
        correct={1}
        explanation="Benar. 1−0,95⁸ ≈ 34%. Tanpa koreksi, 'kemenangan' tunggal dari banyak metrik sangat mungkin palsu. Disiplin: primer ditulis di awal; sekunder dikoreksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Trafik hanya 200/hari, MDE butuh 6 bulan test. Saran terbaik?"
        options={[
          "Jalankan 6 bulan — disiplin itu penting",
          "Jangan A/B test: hanya efek raksasa yang terdeteksi. Pakai riset kualitatif / pre-post dengan kontrol, atau terima MDE lebih besar",
          "Turunkan α jadi 20% agar cepat signifikan",
          "Intip tiap hari agar bisa berhenti cepat",
        ]}
        correct={1}
        explanation="Benar. A/B test bukan palu untuk semua paku. Dengan trafik kecil, test 6 bulan pun rentan seasonality & perubahan produk. Metode yang tepat > metode yang populer. Opsi 3–4 adalah pelanggaran metodologi."
      />

      {/* 12. RANGKUMAN */}
      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Alur:</strong> hipotesis teruji → metrik primer+guardrail → n dari MDE → durasi kelipatan minggu → pantau SRM → analisis (uji + CI) → keputusan dari CI vs MDE.</li>
          <li><strong>SRM check:</strong> chi-square split aktual vs desain — SRM = randomisasi rusak = jangan ambil keputusan.</li>
          <li><strong>Jangan intip</strong> hasil primer; komitmen pada durasi yang dihitung.</li>
          <li><strong>Keputusan:</strong> p-value (&ldquo;nyata?&rdquo;) + CI (&ldquo;seberapa?&rdquo;) + MDE (&ldquo;cukup?&rdquo;). &ldquo;Signifikan tapi di bawah MDE&rdquo; = jangan ship.</li>
          <li><strong>5 jebakan:</strong> novelty/primacy, multiple metrics, Simpson, spillover, underpower+peeking.</li>
          <li><strong>Test tidak berakhir saat ship</strong> — pantau apakah efek bertahan (novelty memudar? guardrail jangka panjang?).</li>
          <li><strong>Jangan:</strong> berhenti awal saat &ldquo;menang&rdquo;; memilih metrik setelah lihat hasil; A/B test saat trafik tak memadai.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/a210-power-sampel" className="btn btn-secondary btn-sm">← A2.10</Link>
        <Link href="/learn/a212-bayesian" className="btn btn-primary btn-sm">Next: A2.12 →</Link>
      </div>
    </div>
  );
}
