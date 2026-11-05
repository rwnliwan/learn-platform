"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR18Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const pipelineData = [
    {
      x: ["Data", "Training", "Validasi", "Shadow", "Canary 5%", "Produksi 100%"],
      y: [100, 85, 70, 55, 40, 30],
      type: "bar",
      marker: { color: ["#2a7de1", "#2a7de1", "#e8a838", "#e8a838", "#e05252", "#7bc96f"] },
      text: ["100%", "85%", "70%", "55%", "40%", "30%"],
      textposition: "outside",
    },
  ];

  const retrainData = [
    {
      x: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6", "Minggu 7", "Minggu 8"],
      y: [0.80, 0.79, 0.77, 0.74, 0.70, 0.72, 0.78, 0.81],
      type: "scatter",
      mode: "lines+markers",
      name: "PR-AUC produksi",
      line: { color: "#2a7de1", width: 3 },
      marker: { size: 8 },
    },
  ];

  const lab1Code = `# Simulasi A/B test: model lama vs baru, siapa menang?
# Metrik: net rupiah per 10.000 transaksi (bukan AUC!).
import random
random.seed(53)

def simulasi(recall, precision, n=10000, fraud_rate=0.002):
    n_fraud = int(n * fraud_rate)
    tp = int(n_fraud * recall)
    alert = int(tp / precision) if precision else 0
    fp = alert - tp
    fn = n_fraud - tp
    net = tp * 1_100_000 - fp * 25_000 - fn * 1_100_000
    return net / 1e6  # juta Rp

# A = champion (produksi), B = challenger
hasil_A = [simulasi(0.70, 0.30) + random.gauss(0, 2) for _ in range(14)]  # 14 hari
hasil_B = [simulasi(0.75, 0.28) + random.gauss(0, 2) for _ in range(14)]

rata_A = sum(hasil_A) / len(hasil_A)
rata_B = sum(hasil_B) / len(hasil_B)
print(f"Champion  (A): net Rp{rata_A:.1f} jt/10rb trx")
print(f"Challenger(B): net Rp{rata_B:.1f} jt/10rb trx")
print(f"Selisih       : Rp{rata_B - rata_A:+.1f} jt  ({'B MENANG ✅' if rata_B > rata_A else 'A bertahan'})")
print()
print("COBA UBAH: precision B 0.28 -> 0.20.")
print("B recall lebih tinggi tapi net KALAH — biaya FP membunuhnya.")
print("Pelajaran A/B: bandingkan NET RUPIAH, bukan recall/AUC.")`;

  const lab2Code = `# Jadwal retrain: kapan 'cukup turun' untuk retrain?
# Aturan: retrain jika PR-AUC turun >10% dari baseline SELAMA 2 minggu berturut.
pr = [0.80, 0.79, 0.77, 0.74, 0.70, 0.72, 0.78, 0.81]
baseline = 0.80
AMBANG = 0.10  # 10%

print(f"Baseline: {baseline}, ambang turun: {AMBANG*100:.0f}%")
turun_berturut = 0
for i, v in enumerate(pr):
    drop = (baseline - v) / baseline
    turun_berturut = turun_berturut + 1 if drop > AMBANG else 0
    aksi = ""
    if turun_berturut >= 2:
        aksi = "🔴 RETRAIN!"
        turun_berturut = 0  # reset setelah aksi
    print(f"Minggu {i+1}: PR-AUC={v:.2f} (turun {drop*100:4.1f}%)  {aksi}")
print()
print("COBA UBAH: AMBANG 0.10 -> 0.05.")
print("Retrain lebih sering — tapi tiap retrain = biaya + risiko.")
print("Pelajaran: ambang retrain = trade-off biaya vs performa.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR18 — Fraud / ML Analytics</span>
        <h1 className="display-title">MLOps: Dari Notebook<br />ke Benteng Produksi</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Bekerja di Notebook, Mati di Produksi</a></li>
          <li><a href="#jurang">Jurang Notebook–Produksi</a></li>
          <li><a href="#tangga">Tangga Deployment: Shadow → Canary → Produksi</a></li>
          <li><a href="#ab">A/B Testing: Duel dalam Rupiah</a></li>
          <li><a href="#monitoring">Monitoring: 4 Dasbor yang Wajib Ada</a></li>
          <li><a href="#retrain">Retraining: Kapan &amp; Bagaimana</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi A/B Test</a></li>
          <li><a href="#lab2">🔬 Lab 2: Aturan Retrain</a></li>
          <li><a href="#worked">📐 Worked Example: Ukuran A/B Test &amp; Aturan Rollback</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Produksi adalah Hutan</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Respons Insiden Model</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Strategi Rilis</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Deploy Saat Harbolnas 10× Traffic</a></li>

          <li><a href="#case">📋 Mini-Case: Deploy Model Baru Tanpa Bunuh Bisnis</a></li>
          <li><a href="#faq">❓ Tanya Jawab: MLOps</a></li>

          <li><a href="#latihan">Latihan Mandiri: Deploy Tanpa Berjudi</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>jurang notebook–produksi</strong> dan 4 penyebab klasiknya.</li>
          <li>Merancang <strong>tangga deployment</strong>: shadow → canary → produksi penuh.</li>
          <li>Menjalankan <strong>A/B test</strong> model dengan metrik net rupiah.</li>
          <li>Menyusun <strong>monitoring 4 lapis</strong> dan aturan <strong>retraining</strong> yang disiplin.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model yang Bekerja di Notebook, Mati di Produksi</h2>
      <div className="story">
        <p>Data scientist &ldquo;DanaKita&rdquo; deploy model fraud barunya Jumat sore. PR-AUC validasi 0,91. Senin pagi: <strong>3.000 alert per jam</strong> (normal: 200), investigator mogok, call center kebanjiran komplain &ldquo;transaksi saya ditahan&rdquo;. Rollback darurat Senin siang. Kerugian: 1 hari chaos + kepercayaan tim hancur.</p>
        <p>Root cause-nya memalukan: di notebook, fitur <code className="inline">count_24h</code> dihitung dari <strong>database analitik</strong> (lengkap, tapi lambat). Di produksi, pipeline real-time menghitungnya dari <strong>stream</strong> — yang <strong>kehilangan 30% event</strong> karena bug consumer. Fitur yang sama, <strong>definisi yang beda</strong> → skor kacau → alert meledak.</p>
        <p>Twist-nya: tidak ada yang salah dengan <em>modelnya</em>. Yang salah: <strong>tidak ada yang pernah menjalankan model itu di kondisi produksi sebelum Jumat sore itu</strong>. Lesson ini: <strong>MLOps = disiplin agar &ldquo;yang bekerja di notebook&rdquo; juga bekerja di dunia nyata</strong> — dan disiplin itu punya nama: shadow, canary, monitoring, retrain.</p>
      </div>

      <h2 id="jurang">Jurang Notebook–Produksi</h2>
      <p>Empat penyebab klasik &ldquo;bekerja di notebook, mati di produksi&rdquo;:</p>
      <ol>
        <li><strong>Train-serving skew:</strong> fitur dihitung berbeda (kasus DanaKita!) — solusinya feature store (FR13).</li>
        <li><strong>Validasi bohong:</strong> random split, bukan time split (FR10).</li>
        <li><strong>Distribusi beda:</strong> data training dari periode promo; produksi = normal — atau sebaliknya.</li>
        <li><strong>Infrastruktur beda:</strong> library versi beda, timezone beda, missing handling beda (&ldquo;di notebook NaN, di produksi string kosong&rdquo;).</li>
      </ol>
      <p><strong>Obat generik:</strong> <strong>reproduksibilitas</strong> — training pipeline = serving pipeline (kode yang sama!), versi terkunci (data, kode, model, library), dan <strong>pengujian di kondisi produksi</strong> sebelum launch penuh.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> &ldquo;model&rdquo; yang di-deploy bukan file <code className="inline">.pkl</code> — melainkan <strong>sistem</strong>: data → fitur → model → keputusan → monitoring → retrain. Notebook hanya melahirkan 1 dari 6 komponen itu. MLOps = mengasuh 5 sisanya.</p>
      </div>

      <h2 id="tangga">Tangga Deployment: Shadow → Canary → Produksi</h2>

      <PlotlyChart
        data={pipelineData}
        title="Tangga Deployment: Risiko Menurun di Tiap Anak Tangga (ilustrasi)"
        layout={{ xaxis: { title: "Tahap" }, yaxis: { title: "Risiko relatif (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = risiko jika deploy langsung dari tahap itu (100% = deploy buta).</p>
        <p><strong>Interpretasi:</strong> tiap anak tangga <strong>memangkas risiko</strong>: validasi (85%) → shadow (55%) → canary 5% (40%) → produksi (30%, risiko residu tak pernah nol). <strong>Melompati tangga = membayar risiko penuh.</strong> DanaKita melompat dari &ldquo;validasi&rdquo; langsung ke &ldquo;produksi 100%&rdquo; — dan membayarnya Senin pagi.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Tahap</th><th>Apa yang terjadi</th><th>Yang diukur</th><th>Kriteria naik</th></tr></thead>
          <tbody>
            <tr><td><strong>Shadow</strong></td><td>Model baru skor tiap transaksi, <strong>keputusan tetap model lama</strong></td><td>Distribusi skor, alert rate hipotetis, latensi</td><td>Skor waras, alert ≤ kapasitas, latensi ≤ anggaran</td></tr>
            <tr><td><strong>Canary 5%</strong></td><td>5% traffic diputuskan model baru</td><td>Net rupiah, komplain, hit rate investigator</td><td>Net ≥ champion, komplain tidak meledak</td></tr>
            <tr><td><strong>Produksi 100%</strong></td><td>Semua traffic</td><td>Semua metrik + drift (FR10)</td><td>Monitoring hijau 2 minggu</td></tr>
          </tbody>
        </table>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Shadow mode = buang waktu; validasi sudah bagus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> validasi menguji model pada <em>data masa lalu</em>; shadow menguji <em>sistem</em> pada <em>data live</em> — termasuk bug pipeline, latensi, dan distribusi yang tak terduga. Kasus DanaKita (30% event hilang) <strong>hanya</strong> tertangkap di shadow. 2 minggu shadow &lt; 1 hari chaos produksi.</p>
      </div>

      <h2 id="ab">A/B Testing: Duel dalam Rupiah</h2>
      <p><strong>Definisi.</strong> A/B test model = bagi traffic (mis. 90/10): A = champion (produksi), B = challenger. Bandingkan <strong>net rupiah</strong> (FR9), bukan AUC:</p>
      <Tex math={String.raw`\text{Net} = TP \cdot \bar{L} - FP \cdot C_{\text{review}} - FN \cdot \bar{L}`} block />
      <p><strong>Aturan main:</strong></p>
      <ul>
        <li><strong>Randomisasi benar:</strong> bagi per <em>user/transaksi</em> acak — bukan per jam (jam sibuk ≠ jam sepi!).</li>
        <li><strong>Durasi cukup:</strong> minimal 1–2 minggu (tangkap pola harian + mingguan) atau sampai <strong>signifikansi</strong> tercapai.</li>
        <li><strong>Guardrail metrics:</strong> komplain nasabah, latensi p99, % timeout — B tidak boleh &ldquo;menang net&rdquo; tapi membunuh UX.</li>
        <li><strong>Keputusan:</strong> B menang signifikan + guardrail aman → promosi bertahap (10% → 50% → 100%).</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> A/B test adalah <strong>pengadilan</strong> bagi model: champion tidak digulingkan oleh &ldquo;AUC lebih tinggi di validasi&rdquo; (kesaksian), melainkan oleh &ldquo;net rupiah lebih tinggi di lapangan&rdquo; (bukti). Standar bukti yang tinggi = sistem yang stabil.</p>
      </div>

      <h2 id="monitoring">Monitoring: 4 Dasbor yang Wajib Ada</h2>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Lapis</th><th>Yang dipantau</th><th>Alarm jika</th></tr></thead>
          <tbody>
            <tr><td><strong>1. Data</strong></td><td>Volume event, % missing per fitur, PSI fitur (FR10)</td><td>Event drop &gt;5%, missing melonjak, PSI &gt;0,25</td></tr>
            <tr><td><strong>2. Model</strong></td><td>Distribusi skor, latensi p50/p99, % timeout</td><td>Skor mengumpul aneh, p99 &gt; anggaran, timeout &gt;1%</td></tr>
            <tr><td><strong>3. Bisnis</strong></td><td>Alert rate, hit rate, PR-AUC (label matang), net rupiah</td><td>Alert &gt; kapasitas, hit rate anjlok, net negatif</td></tr>
            <tr><td><strong>4. Feedback</strong></td><td>% keputusan jadi label, waktu loop, kesepakatan investigator</td><td>Label &lt;95% terkonfirmasi, loop &gt;7 hari</td></tr>
          </tbody>
        </table>
      </div>
      <p><strong>Prinsip:</strong> monitor <strong>dari hulu ke hilir</strong> — data → model → bisnis → feedback. Kebanyakan tim hanya monitor lapis 3 (bisnis) — padahal saat net rupiah anjlok, <strong>penyebabnya</strong> ada di lapis 1 atau 2. Dasbor 4 lapis = diagnosis 10 menit, bukan 10 hari.</p>

      <h2 id="retrain">Retraining: Kapan &amp; Bagaimana</h2>
      <p><strong>Kapan retrain</strong> (aturan disiplin, bukan feeling):</p>
      <ul>
        <li><strong>Terjadwal:</strong> mis. tiap bulan — dengan data yang <strong>sudah matang</strong> (ingat FR4: label butuh 90+ hari!).</li>
        <li><strong>Terpicu:</strong> PR-AUC turun &gt;10% dari baseline selama 2 minggu berturut, atau PSI &gt;0,25 terkonfirmasi drift musuh (FR10).</li>
      </ul>
      <p><strong>Bagaimana retrain yang aman:</strong></p>
      <ol>
        <li>Training data = window geser (mis. 12 bulan terakhir) dengan <strong>embargo</strong> 90 hari.</li>
        <li>Validasi = <strong>time split</strong> (FR10) — bukan random.</li>
        <li>Model baru → <strong>tangga deployment</strong> (shadow → canary) — retrain bukan alasan melompati tangga!</li>
        <li><strong>Versioning:</strong> tiap model tercatat (data versi X, kode versi Y, metrik Z) — bisa rollback kapan pun.</li>
      </ol>

      <PlotlyChart
        data={retrainData}
        title="Siklus Hidup Model: Turun, Retrain, Pulih (ilustrasi)"
        layout={{ xaxis: { title: "Minggu" }, yaxis: { title: "PR-AUC", range: [0.65, 0.85] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = PR-AUC produksi; minggu 5–6 turun di bawah ambang; minggu 7 = retrain + deploy.</p>
        <p><strong>Interpretasi:</strong> minggu 5–6: turun 12,5% &gt; ambang 10% selama 2 minggu → <strong>picu retrain</strong>. Minggu 7: model baru (data matang terbaru) → pulih ke 0,78–0,81. <strong>Pelajaran:</strong> tanpa aturan disiplin, minggu 5–6 akan jadi &ldquo;tunggu dulu, mungkin sementara&rdquo; — dan sementara itu uang hilang.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Retrain = latih ulang dengan data terbaru, langsung deploy.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> &ldquo;data terbaru&rdquo; = label belum matang (FR4!) — retrain buta mengajari model pola serangan sebagai &ldquo;normal&rdquo;. Dan &ldquo;langsung deploy&rdquo; = melompati tangga (kasus DanaKita). Retrain yang aman: <strong>data matang + time split + shadow + canary + versioning</strong>. Tidak ada jalan pintas.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi A/B Test</h2>
      <p>Duelkan champion vs challenger dalam rupiah.</p>
      <PyodideLab
        title="Lab 1 — A/B Test: Pengadilan Model"
        hint="Ubah precision B 0.28 → 0.20. Lihat B kalah walau recall lebih tinggi — biaya FP membunuhnya. Itulah kenapa metriknya net rupiah."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Aturan Retrain</h2>
      <PyodideLab
        title="Lab 2 — Kapan Cukup Turun untuk Retrain?"
        hint="Ubah AMBANG 0.10 → 0.05. Retrain lebih sering = biaya + risiko lebih sering. Rasakan trade-off-nya."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Mendeploy Model Tanpa Berjudi</h2>
      <p>MLOps = <strong>statistik + disiplin operasional</strong>. Dua perhitungan yang memisahkan deploy profesional dari &ldquo;coba-coba di produksi&rdquo;.</p>

      <details className="worked">
        <summary>📐 Contoh 1: berapa lama A/B test champion vs challenger?</summary>
        <p>Challenger diklaim menaikkan precision dari 20% ke 24% (di 1.000 flag/hari). Ingin bukti statistik: power 80%, signifikansi 95%.</p>
        <p><strong>Langkah 1 — rumus ukuran sampel per grup (proporsi).</strong></p>
        <Tex math={String.raw`n = \frac{2 \times \bar{p}(1-\bar{p}) \times (Z_{\alpha/2} + Z_{\beta})^2}{\delta^2}`} block />
        <p><Tex math={String.raw`\bar{p}`} /> = 0,22 (rata-rata), <Tex math={String.raw`\delta`} /> = 0,04 (selisih), Z = 1,96 + 0,84 = 2,80.</p>
        <p><strong>Langkah 2 — hitung.</strong> n = 2 × 0,22 × 0,78 × 7,84 / 0,0016 = 2,689/0,0016 ≈ <strong>1.681 flag per grup</strong>.</p>
        <p><strong>Langkah 3 — ke hari.</strong> Dengan split 50/50 dari 1.000 flag/hari → 500 flag/hari per grup → <strong>3,4 hari → bulatkan 7 hari</strong> (cakup pola mingguan!). Pelajaran: A/B test fraud yang &ldquo;3 hari cukup&rdquo; sering salah karena <strong>pola weekend ≠ weekday</strong> — selalu kelipatan 7 hari.</p>
        <p><strong>Langkah 4 — jebakan.</strong> Selama test, label fraud butuh waktu berminggu-minggu (FR4, label lag!) — jadi &ldquo;precision&rdquo; tidak bisa diukur langsung. Solusi: ukur <strong>proksi cepat</strong> (precision vs label investigator 7-hari, bukan label final) + <strong>metrik operasional</strong> (flag rate, review time). A/B test fraud = mengukur dengan proksi sambil menunggu kebenaran.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: aturan rollback yang objektif</summary>
        <p>Model v2.4 baru deploy 3 hari. Precision harian: hari-1: 19%, hari-2: 16%, hari-3: 14%. Baseline v2.3: 21% ± 2%.</p>
        <p><strong>Langkah 1 — tentukan ambang sebelum deploy</strong> (bukan setelah panik!). Aturan yang ditetapkan: rollback jika <em>precision 3 hari beruntun &gt; 2σ di bawah baseline</em> (2σ = 4 poin → ambang 17%) ATAU <em>flag rate naik &gt; 50%</em> ATAU <em>error pipeline</em>.</p>
        <p><strong>Langkah 2 — terapkan.</strong> Hari-2 (16%) = peringatan pertama. Hari-3 (14%) = <strong>hari kedua di bawah 17%</strong> — belum 3 hari, tapi tren jelas turun + flag rate naik 35%. Keputusan: <strong>rollback ke v2.3 sekarang</strong>, investigasi kemudian.</p>
        <p><strong>Langkah 3 — prinsipnya.</strong> Rollback harus <strong>murah &amp; cepat</strong> (&lt; 15 menit, satu perintah) — karena rollback yang ribet tidak akan dipakai saat dibutuhkan. Dan aturan rollback ditulis <em>sebelum</em> deploy, saat kepala dingin — bukan saat dashboard merah dan semua orang panik. <strong>Disiplin yang ditulis saat tenang menyelamatkanmu saat kacau.</strong></p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Produksi adalah Hutan</h2>
      <p>Notebook adalah <strong>kebun binatang</strong> — terkontrol, terjadwal, semua hewan jinak. Produksi adalah <strong>hutan</strong> — traffic 10x tiba-tiba, data rusak jam 3 pagi, dependency mati tanpa pamit. Model yang &ldquo;bagus&rdquo; di notebook tapi tidak punya monitoring, rollback, dan runbook = <strong>hewan kebun binatang yang dilepas ke hutan</strong> — ia tidak akan selamat seminggu.</p>
      <p>Intuisi kedua: <strong>MLOps adalah tentang <em>reversibilitas</em></strong>. Setiap deploy harus bisa dibatalkan dalam menit; setiap keputusan otomatis harus bisa diaudit; setiap eksperimen harus bisa dibandingkan. Organisasi yang tidak bisa rollback dengan cepat <em>tidak akan berani</em> berinovasi — dan yang tidak berani berinovasi akan dikalahkan oleh penjahat yang berinovasi tiap minggu. <strong>Kecepatan rollback menentukan kecepatan inovasi.</strong></p>
      <p><strong>Kapan disiplin MLOps penuh TIDAK sepadan:</strong> (1) <strong>prototipe &amp; eksplorasi</strong> — jangan bebani eksperimen dengan pipeline produksi; (2) <strong>model yang jarang berubah</strong> (rule stabil tahunan) — monitoring ringan cukup; (3) <strong>tim 1-2 orang</strong> — pilih 20% praktik dengan 80% manfaat (monitoring + rollback manual + dokumentasi), bukan platform MLOps enterprise. <strong>Sesuaikan zirah dengan medan perang.</strong></p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum deploy, jawab <strong>tiga pertanyaan runbook</strong>: (1) bagaimana tahu ia rusak? (monitoring), (2) bagaimana kembali ke yang lama dalam 15 menit? (rollback), (3) siapa yang dihubungi jam 3 pagi? (on-call). Tidak bisa jawab ketiganya = belum siap deploy.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Respons Insiden Model</h2>

      <div className="decision-card">
        <h3>1. Alert meledak tiba-tiba (seperti DanaKita) → <strong>rollback ke versi sebelumnya + investigasi lapis 1 (data)</strong></h3>
        <p><strong>Kenapa:</strong> ledakan mendadak = 90% masalah pipeline/fitur, bukan &ldquo;model tiba-tiba bodoh&rdquo;. Rollback dulu, diagnosis kemudian.</p>
      </div>

      <div className="decision-card">
        <h3>2. Performa turun pelan 2+ minggu → <strong>cek drift (FR10) → putuskan retrain vs rule darurat</strong></h3>
        <p><strong>Kenapa:</strong> penurunan pelan = drift. Jangan retrain buta — investigasi dulu (PSI = alarm asap, bukan perintah).</p>
      </div>

      <div className="decision-card">
        <h3>3. Model baru siap → <strong>tangga penuh: shadow 2 minggu → canary → produksi</strong></h3>
        <p><strong>Kenapa:</strong> tidak ada pengecualian — &ldquo;model bagus&rdquo; yang melompati tangga = Senin pagi yang chaos.</p>
      </div>

      <div className="decision-card">
        <h3>4. Komponen infrastruktur down → <strong>fallback yang sudah diputuskan (FR13)</strong></h3>
        <p><strong>Kenapa:</strong> MLOps mencakup kegagalan — bukan cuma keberhasilan.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Deploy = <strong>tangga</strong>: shadow → canary → produksi. Tidak ada lompatan.</li>
          <li>A/B test dalam <strong>net rupiah</strong> + guardrail (komplain, latensi).</li>
          <li>Monitor <strong>4 lapis</strong>: data → model → bisnis → feedback.</li>
          <li>Retrain: <strong>terjadwal + terpicu</strong>, data matang, time split, versioning, rollback siap.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Shadow, Canary, atau A/B Penuh?</h2>
      <p>Tiga strategi rilis model — pilih sesuai risiko:</p>
      <p><strong>Skenario A — shadow deployment.</strong> Model baru jalan <em>paralel</em>, skornya dicatat tapi <strong>tidak dipakai</strong> untuk keputusan. Cocok untuk: model generasi pertama, perubahan besar arsitektur. Keuntungan: nol risiko operasional + data perbandingan 2–4 minggu. Harga: biaya komputasi ganda. <strong>Selalu mulai dari sini</strong> untuk model penting.</p>
      <p><strong>Skenario B — canary 5%.</strong> Model baru dipakai untuk 5% traffic. Cocok untuk: iterasi minor (retrain rutin, tambah 2 fitur). Jika metrik 5% aneh → dampak terbatas, rollback mudah. Aturan: canary <em>acak</em> (bukan &ldquo;5% traffic pagi&rdquo; — bias waktu!).</p>
      <p><strong>Skenario C — A/B 50/50 penuh.</strong> Hanya jika: (1) shadow &amp; canary lolos, (2) butuh bukti statistik untuk keputusan besar (ganti vendor, arsitektur baru), (3) siap dengan ukuran sampel yang benar (contoh 1). Jangan A/B untuk setiap retrain minor — <em>overhead</em> eksperimennya lebih mahal daripada manfaatnya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model terbaik di notebook bisa jadi yang terburuk di produksi — yang menang adalah <strong>yang paling bisa dioperasikan</strong>: termonitor, bisa rollback, perilakunya dipahami. MLOps bukan birokrasi; ia <em>asuransi</em> terhadap malam-malam tanpa tidur.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Baru vs 10× Traffic Harbolnas</h2>
      <p>E-commerce Indonesia menjadwalkan deploy model fraud v3.0 — <strong>seminggu sebelum 11.11</strong>. Traffic Harbolnas: 10× normal. Yang terjadi adalah katalog bencana MLOps:</p>
      <ol>
        <li><strong>Latensi:</strong> model baru 2× lebih berat → p95 latensi 45ms → 120ms saat traffic 10×. Checkout melambat, konversi turun 3% = <strong>miliaran rupiah GMV</strong> menguap.</li>
        <li><strong>Drift perilaku:</strong> model dilatih di data normal — di Harbolnas, <em>perilaku legit sendiri</em> berubah (FR10) → false positive 6× lipat → tim review tenggelam.</li>
        <li><strong>Rollback macet:</strong> tidak ada runbook rollback yang dites — butuh 4 jam untuk kembali ke v2.0, di tengah puncak flash sale.</li>
      </ol>
      <p><strong>Aturan yang lahir dari insiden ini (praktik umum industri):</strong> (1) <strong>freeze deploy</strong> H-14 sampai H+7 event besar — tidak ada model baru, hanya tuning darurat; (2) <strong>load test 10×</strong> wajib sebelum deploy apa pun; (3) <strong>rollback drill</strong> tiap kuartal (seperti latihan kebakaran); (4) <strong>model &ldquo;mode hemat&rdquo;</strong>: versi ringan yang otomatis aktif saat traffic &gt; 5× — akurasi sedikit turun, tapi tidak pernah down.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;MLOps = urusan DevOps, bukan urusan data scientist.&rdquo;<br /><strong>Yang benar:</strong> data scientist yang tidak paham deploy = <strong>koki yang tidak tahu cara menyajikan</strong> — masakannya enak di dapur, tidak pernah sampai ke meja. Di fraud, model yang tidak termonitor = model yang diam-diam membusuk sambil tetap memblokir nasabah. <em>Ownership</em> model berakhir saat ia pensiun dengan baik, bukan saat ia deploy.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Deploy Model Baru Tanpa Bunuh Bisnis</h2>
      <div className="callout">
        <p>Model fraud baru &ldquo;PayKu&rdquo; v2.0: PR-AUC validasi (time split) 0,88 vs v1.0 0,81. Fitur baru: 3 fitur graph (FR12). Risiko: fitur graph dihitung dari pipeline baru yang belum pernah produksi. Direksi: &ldquo;Deploy minggu depan, katanya 0,88!&rdquo;</p>
        <p><strong>Pertanyaan:</strong> rancang rencana deploy 6 minggu yang aman. Kapan v2.0 boleh 100%?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Minggu 1–2 (shadow):</strong> v2.0 skor semua transaksi, keputusan tetap v1.0. Ukur: distribusi skor waras? Alert hipotetis ≤ kapasitas? Latensi fitur graph ≤ anggaran? <strong>Target utama: validasi pipeline graph</strong> (risiko terbesar!).</p>
          <p><strong>Minggu 3–4 (canary 5%):</strong> 5% traffic diputuskan v2.0. Ukur: net rupiah vs v1.0, komplain, hit rate investigator. Kriteria: net ≥ + guardrail aman.</p>
          <p><strong>Minggu 5 (canary 50%):</strong> perluas jika minggu 3–4 hijau. <strong>Minggu 6 (100%):</strong> hanya jika semua hijau 2 minggu berturut.</p>
          <p><strong>Jawaban ke direksi:</strong> &ldquo;0,88 validasi ≠ 0,88 produksi. 6 minggu = harga kepastian. Deploy buta minggu depan = judi dengan 1 juta transaksi/hari.&rdquo; <strong>Pelajaran:</strong> MLOps = keberanian untuk <em>melambat</em> demi tidak hancur.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: MLOps</h2>
      <details className="worked">
        <summary>Q1: Model tiba-tiba buruk di produksi — langkah pertama apa?</summary>
        <p><strong>Rollback dulu, investigasi kemudian.</strong> Urutan insiden: (1) kembalikan ke versi terakhir yang baik (&lt; 15 menit); (2) bekukan deploy; (3) baru investigasi: apakah data berubah? pipeline rusak? drift? <strong>Jangan debugging di produksi yang berdarah</strong> — hentikan pendarahannya dulu. Dan catat semuanya: insiden tanpa post-mortem = biaya sekolah yang tidak menghasilkan ijazah.</p>
      </details>
      <details className="worked">
        <summary>Q2: Shadow deployment — kapan wajib?</summary>
        <p><strong>Wajib untuk:</strong> model generasi pertama, perubahan arsitektur besar, atau model yang mengambil <em>keputusan otomatis berdampak</em> (auto-block). Shadow 2-4 minggu memberi data perbandingan <em>tanpa risiko</em>. <strong>Boleh dilewati untuk:</strong> retrain rutin dengan perubahan kecil + canary — tapi jangan pernah lewati keduanya. <em>Tidak ada yang namanya &ldquo;perubahan kecil yang pasti aman&rdquo; di produksi.</em></p>
      </details>
      <details className="worked">
        <summary>Q3: Metrik monitoring apa yang paling penting?</summary>
        <p><strong>Empat lapis:</strong> (1) <em>infra</em> — latensi, error rate, throughput; (2) <em>data</em> — PSI fitur, missing rate, schema check; (3) <em>model</em> — distribusi skor, precision vs label proksi; (4) <em>bisnis</em> — fraud loss, komplain blokir, biaya review. <strong>Lapis 4 adalah yang pertama dilihat direksi dan terakhir dipasang tim</strong> — pasang dari hari pertama.</p>
      </details>
      <details className="worked">
        <summary>Q4: Siapa yang on-call untuk model fraud?</summary>
        <p><strong>Tim yang bisa memperbaiki, bukan tim yang bisa menelepon.</strong> On-call ideal: rotasi di antara anggota tim model + satu engineer platform — dengan <em>runbook</em> yang jelas (kapan rollback, kapan eskalasi, kapan bangunkan siapa). On-call tanpa runbook = <strong>lembur terstruktur</strong>. Dan: setiap insiden on-call harus menghasilkan <em>perbaikan permanen</em> — jika insiden yang sama terjadi 3x, itu bukan kesialan, itu utang yang belum dibayar.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Deploy Tanpa Berjudi</h2>
      <p><strong>1.</strong> Tulis aturan rollback 2 baris untuk modelmu: kondisi kuantitatif + batas waktu. Kenapa harus ditulis <em>sebelum</em> deploy?</p>
      <p><strong>2.</strong> Model retrain rutin (tambah 1 bulan data, arsitektur sama). Pilih: langsung produksi / shadow / canary / A-B penuh — dan 1 kalimat alasan.</p>
      <p><strong>3.</strong> Precision turun 21% → 17% → 15% dalam 3 hari setelah deploy, flag rate naik 40%. Apa 3 langkah pertamamu jam ini juga?</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Contoh: &ldquo;Rollback jika precision 2 hari beruntun &gt;3 poin di bawah baseline ATAU flag rate naik &gt;50% ATAU error pipeline. Eksekusi &lt;15 menit.&rdquo; Ditulis sebelum deploy karena <strong>kepala dingin menulis aturan; kepala panik melanggarnya</strong>.</p>
        <p><strong>2.</strong> <strong>Canary 5%</strong> — perubahan kecil, risiko rendah; shadow overkill, A-B penuh mahal untuk iterasi rutin. <em>Sesuaikan zirah dengan medan.</em></p>
        <p><strong>3.</strong> (1) <strong>Rollback ke versi sebelumnya</strong> <em>sekarang</em>; (2) bekukan deploy &amp; umumkan insiden; (3) baru investigasi: data? pipeline? drift? <em>Hentikan pendarahan dulu, diagnosis kemudian.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model PR-AUC 0,91 di validasi; Senin pagi 3.000 alert/jam (normal 200). Root cause: fitur count_24h dihitung beda di notebook vs produksi. Ini masalah apa?"
        options={[
          "Model overfitting",
          "Train-serving skew — definisi fitur beda; solusinya feature store + shadow mode sebelum launch",
          "Data kurang",
          "Investigator malas",
        ]}
        correct={1}
        explanation="Benar: train-serving skew. Modelnya tidak salah — sistemnya yang tidak konsisten. Shadow mode 2 minggu akan menangkap 30% event hilang SEBELUM Senin pagi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Mengapa shadow mode TIDAK bisa digantikan validasi yang 'sudah bagus'?"
        options={[
          "Bisa digantikan",
          "Validasi menguji model pada data masa lalu; shadow menguji SISTEM (pipeline, latensi, distribusi live) pada data live — bug infrastruktur hanya tertangkap di sini",
          "Shadow lebih cepat",
          "Validasi tidak akurat",
        ]}
        correct={1}
        explanation="Benar: validasi ≠ sistem. Bug consumer yang menghilangkan 30% event tidak ada di data validasi — ia hanya ada di pipa produksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. A/B test champion vs challenger. Metrik keputusan yang benar?"
        options={[
          "AUC tertinggi",
          "Net rupiah + guardrail (komplain, latensi) — 'menang' yang membunuh UX bukan kemenangan",
          "Recall tertinggi",
          "Yang paling baru",
        ]}
        correct={1}
        explanation="Benar: net rupiah + guardrail. Challenger dengan recall lebih tinggi bisa KALAH net karena biaya FP — dan 'menang' dengan komplain meledak = kalah bisnis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Net rupiah anjlok tiba-tiba. Dasbor 4 lapis bilang mulai dari mana?"
        options={[
          "Langsung retrain",
          "Dari hulu: lapis 1 (data) → 2 (model) → 3 (bisnis) → 4 (feedback). Penyebab biasanya di hulu (event drop, fitur rusak)",
          "Salahkan investigator",
          "Matikan model",
        ]}
        correct={1}
        explanation="Benar: diagnosis hulu-ke-hilir. Anjlok mendadak = 90% masalah data/pipeline, bukan 'model tiba-tiba bodoh'. Dasbor 4 lapis = diagnosis 10 menit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Aturan retrain yang disiplin?"
        options={[
          "Retrain tiap ada data baru, langsung deploy",
          "Terjadwal (bulanan, data MATANG 90+ hari) + terpicu (turun >10% 2 minggu berturut) → time split → tangga deployment → versioning + rollback siap",
          "Tidak pernah retrain",
          "Retrain tiap hari",
        ]}
        correct={1}
        explanation="Benar: disiplin penuh. 'Data terbaru' = label belum matang (FR4); 'langsung deploy' = melompati tangga (kasus DanaKita). Tiap jalan pintas ada harganya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Jurang notebook–produksi:</strong> skew, validasi bohong, distribusi beda, infra beda — obatnya reproduksibilitas.</li>
          <li><strong>Tangga deployment:</strong> shadow → canary 5% → 50% → 100%. Tidak ada lompatan.</li>
          <li><strong>A/B test:</strong> net rupiah + guardrail; randomisasi benar; durasi cukup.</li>
          <li><strong>Monitoring 4 lapis:</strong> data → model → bisnis → feedback. Diagnosis hulu-ke-hilir.</li>
          <li><strong>Retrain:</strong> terjadwal + terpicu, data matang, time split, versioning, rollback siap.</li>
          <li>MLOps = keberanian <strong>melambat</strong> (tangga, shadow) agar tidak hancur.</li>
          <li>Kapan TIDAK perlu MLOps penuh: prototipe riset — tapi jangan sebut &ldquo;produksi&rdquo;.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr17-explainability" className="btn btn-secondary btn-sm">← FR17</Link>
        <Link href="/learn/fr19-nlp-phishing" className="btn btn-primary btn-sm">Next: FR19 →</Link>
      </div>
    </div>
  );
}
