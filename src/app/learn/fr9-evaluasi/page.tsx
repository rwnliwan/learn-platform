"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR9Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const prData = [
    {
      x: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      y: [0.95, 0.9, 0.82, 0.74, 0.65, 0.55, 0.45, 0.35, 0.25, 0.15, 0.08],
      type: "scatter",
      mode: "lines",
      name: "Model A (bagus)",
      line: { color: "#2a7de1", width: 3 },
    },
    {
      x: [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      y: [0.7, 0.55, 0.4, 0.3, 0.22, 0.16, 0.12, 0.09, 0.06, 0.04, 0.02],
      type: "scatter",
      mode: "lines",
      name: "Model B (lemah)",
      line: { color: "#e05252", width: 3 },
    },
  ];

  const rocPrData = [
    {
      x: ["ROC-AUC", "PR-AUC"],
      y: [0.97, 0.62],
      name: "Model X",
      type: "bar",
      marker: { color: "#e8a838" },
    },
    {
      x: ["ROC-AUC", "PR-AUC"],
      y: [0.96, 0.41],
      name: "Model Y",
      type: "bar",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# PR-AUC vs ROC-AUC: kenapa ROC menipu di data imbalance
# Dua model, ROC-AUC mirip (0.97 vs 0.96), PR-AUC beda jauh.
import random
random.seed(13)

# Model X: skor fraud terpisah baik. Model Y: banyak false positive skor tinggi.
def skor(model, is_fraud):
    if model == "X":
        return random.gauss(0.8, 0.12) if is_fraud else random.gauss(0.2, 0.12)
    else:
        return random.gauss(0.7, 0.18) if is_fraud else random.gauss(0.25, 0.2)

def pr_auc(model, n_fraud=100, n_ok=50000):
    data = [(skor(model, True), 1) for _ in range(n_fraud)] + \
           [(skor(model, False), 0) for _ in range(n_ok)]
    data.sort(reverse=True)
    tp = fp = 0
    auc, prev_r = 0.0, 0.0
    for _, y in data:
        if y: tp += 1
        else: fp += 1
        r = tp / n_fraud
        p = tp / (tp + fp)
        auc += (r - prev_r) * p   # average precision (aproksimasi PR-AUC)
        prev_r = r
    return auc

for m in ["X", "Y"]:
    print(f"Model {m}: PR-AUC ≈ {pr_auc(m):.3f}")
print()
print("COBA UBAH: n_ok 50000 -> 5000 (imbalance berkurang).")
print("Selisih PR-AUC menyusut! Pelajaran: PR-AUC 'menghukum' false positive")
print("proporsional terhadap kelangkaan fraud. ROC-AUC tidak — ia 'terhibur'")
print("oleh 49.900 true negative yang mudah.")`;

  const lab2Code = `# Uang terselamatkan: metrik yang dimengerti direksi
# Skenario: 10.000 transaksi/bulan, 20 fraud @ Rp1,1 jt. Bandingkan 2 model.
import random
random.seed(21)

N, FRAUD, LOSS = 10000, 20, 1_100_000
COST_REVIEW = 25_000

def hasil(model):
    # model A: recall 80%, precision 25%. model B: recall 60%, precision 60%.
    r, p = (0.80, 0.25) if model == "A" else (0.60, 0.60)
    tp = int(FRAUD * r)
    alert = int(tp / p)
    fp = alert - tp
    fn = FRAUD - tp
    diselamatkan = tp * LOSS
    biaya = fp * COST_REVIEW + fn * LOSS
    return tp, fp, fn, diselamatkan, biaya

for m in ["A", "B"]:
    tp, fp, fn, selamat, biaya = hasil(m)
    print(f"Model {m}: TP={tp} FP={fp} FN={fn}")
    print(f"   Uang terselamatkan : Rp{selamat/1e6:6.1f} jt")
    print(f"   Total biaya (FP+FN) : Rp{biaya/1e6:6.1f} jt")
    print(f"   NET                 : Rp{(selamat-biaya)/1e6:6.1f} jt")
print()
print("COBA UBAH: precision model A 0.25 -> 0.10.")
print("Net-nya bisa NEGATIF — model 'mendeteksi banyak' tapi membakar uang")
print("di biaya review. Pelajaran: direksi tidak peduli recall-mu;")
print("mereka peduli NET RUPIAH.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR9 — Fraud / ML Analytics</span>
        <h1 className="display-title">Evaluasi: Berhenti Memuja Akurasi,<br />Mulai Menghitung Rupiah</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 0,97 yang Dipecat</a></li>
          <li><a href="#roc">ROC-AUC: Metrik yang Menipu di Data Imbalance</a></li>
          <li><a href="#pr">PR-AUC: Metrik Jujur untuk Kelas Langka</a></li>
          <li><a href="#recallfpr">Recall@FPR &amp; Alert Rate: Bahasa Kapasitas</a></li>
          <li><a href="#lift">Lift: &ldquo;Berapa Kali Lebih Baik dari Acak?&rdquo;</a></li>
          <li><a href="#rupiah">Uang Terselamatkan: Metrik yang Dimengerti Direksi</a></li>
          <li><a href="#lab1">🔬 Lab 1: PR-AUC vs ROC-AUC</a></li>
          <li><a href="#lab2">🔬 Lab 2: Net Rupiah per Model</a></li>
          <li><a href="#worked">📐 Worked Example: Confusion Matrix &amp; Metrik Rupiah</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Metrik adalah Kontrak</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Metrik Apa untuk Siapa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Metrik untuk Tiap Penonton</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Klaim Asuransi &amp; Biaya Investigasi</a></li>

          <li><a href="#case">📋 Mini-Case: Duel Dua Model di Ruang Direksi</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Evaluasi</a></li>

          <li><a href="#latihan">Latihan Mandiri: Dari Angka ke Keputusan</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>mengapa ROC-AUC menipu</strong> pada data imbalance ekstrem.</li>
          <li>Membaca <strong>kurva PR</strong> dan menghitung <strong>PR-AUC</strong> sebagai metrik utama model fraud.</li>
          <li>Menggunakan <strong>recall@FPR</strong> dan <strong>alert rate</strong> untuk menyelaraskan model dengan kapasitas tim.</li>
          <li>Menghitung <strong>lift</strong> dan <strong>net uang terselamatkan</strong> untuk keputusan bisnis.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model 0,97 yang Dipecat</h2>
      <div className="story">
        <p>Data scientist &ldquo;BankMega&rdquo; presentasi ke direksi dengan bangga: <em>&ldquo;Model fraud baru kami ROC-AUC 0,97!&rdquo;</em> Direksi mengangguk. Tiga bulan kemudian model itu <strong>dimatikan</strong>. Bukan karena tidak akurat — tapi karena investigator <strong>mogok</strong>: dari 1.000 alert per hari, hanya 40 yang benar fraud. Mereka berhenti membaca alert. Fraud lolos lebih banyak daripada sebelum ada model.</p>
        <p>Investigasi pasca-kematian: ROC-AUC 0,97 itu nyata — tapi <strong>tidak relevan</strong>. Dengan 50.000 transaksi normal per hari, &ldquo;sedikit&rdquo; false positive rate 2% = <strong>1.000 alert sampah per hari</strong>. ROC-AUC terhibur oleh 49.000 true negative yang mudah; yang menderita adalah 10 investigator manusia.</p>
        <p>Twist-nya: model penggantinya punya ROC-AUC <strong>lebih rendah</strong> (0,94) tapi PR-AUC jauh lebih tinggi — dan investigator kembali percaya. Lesson ini: <strong>metrik yang salah = mengoptimasi hal yang salah = sistem yang mati di tangan penggunanya</strong>.</p>
      </div>

      <h2 id="roc">ROC-AUC: Metrik yang Menipu di Data Imbalance</h2>
      <p><strong>Definisi cepat.</strong> Kurva ROC memplot TPR (recall) vs FPR di semua threshold; AUC = luas di bawahnya. Untuk data seimbang, ia metrik yang bagus.</p>
      <p><strong>Kenapa menipu di fraud:</strong></p>
      <Tex math={String.raw`FPR = \frac{FP}{FP + TN}`} block />
      <ul>
        <li>Penyebut FPR memuat <Tex math={String.raw`TN`} /> — <strong>puluhan ribu</strong> transaksi normal yang mudah diklasifikasi benar.</li>
        <li>Contoh: 50.000 normal, 100 fraud. Model dengan 1.000 FP → FPR = 1.000/50.000 = <strong>2%</strong> — terlihat kecil! Tapi 1.000 alert sampah/hari = <strong>investigator mati</strong>.</li>
        <li>ROC-AUC 0,97 bisa hidup berdampingan dengan precision 4% — dan precision 4% adalah kematian operasional.</li>
      </ul>

      <PlotlyChart
        data={rocPrData}
        title="ROC-AUC vs PR-AUC: Dua Model, Cerita Berbeda"
        layout={{ barmode: "group", yaxis: { title: "Skor", range: [0, 1] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua kelompok batang (ROC-AUC vs PR-AUC), dua model (X kuning, Y biru).</p>
        <p><strong>Interpretasi:</strong> ROC-AUC nyaris identik (0,97 vs 0,96) — &ldquo;keduanya hebat&rdquo;. PR-AUC membelahnya: X = 0,62, Y = 0,41. <strong>Model Y adalah model BankMega yang dipecat</strong> — ROC-nya menutupi banjir false positive. Pelajaran: untuk fraud, <strong>PR-AUC adalah metrik utama</strong>; ROC-AUC adalah pelengkap.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;AUC 0,97 = model bagus, titik.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> AUC <em>yang mana</em>? ROC-AUC 0,97 dengan PR-AUC 0,41 = model yang membunuh tim investigasi. Selalu tanyakan jenis AUC-nya — dan untuk kelas langka, PR-AUC yang bicara.</p>
      </div>

      <h2 id="pr">PR-AUC: Metrik Jujur untuk Kelas Langka</h2>
      <p><strong>Definisi.</strong> Kurva PR memplot <strong>Precision vs Recall</strong> di semua threshold:</p>
      <Tex math={String.raw`\text{Precision} = \frac{TP}{TP+FP}, \quad \text{Recall} = \frac{TP}{TP+FN}`} block />
      <ul>
        <li>Tidak ada <Tex math={String.raw`TN`} /> di rumusnya — <strong>kebal terhadap &ldquo;hiburan&rdquo; true negative massal</strong>.</li>
        <li>Baseline acak = fraud rate (0,2%), bukan 0,5 — PR-AUC 0,4 pada fraud 0,2% = <strong>200× lebih baik dari acak</strong>.</li>
        <li>PR-AUC = rata-rata precision tertimbang recall — &ldquo;seberapa presisi model di tiap level recall&rdquo;.</li>
      </ul>

      <PlotlyChart
        data={prData}
        title="Kurva Precision-Recall: Model A vs Model B"
        layout={{ xaxis: { title: "Recall" }, yaxis: { title: "Precision", range: [0, 1] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = recall (berapa % fraud tertangkap), sumbu Y = precision (berapa % alert yang benar). Tiap titik = satu threshold; ke kanan = threshold dilonggarkan.</p>
        <p><strong>Interpretasi:</strong> pada recall 50%, Model A masih precision 55% (biru) vs Model B 16% (merah). <strong>Cara memakai chart ini:</strong> tarik garis vertikal pada recall target bisnismu (mis. 70%) → baca precision-nya → kalikan volume = jumlah alert sampah. Inilah jembatan langsung ke kapasitas tim (FR11).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kurva PR adalah <strong>menu restoran</strong> untuk bisnis: &ldquo;recall 70% harganya precision 35%&rdquo;. Direksi tidak memilih &ldquo;model terbaik&rdquo; — mereka memilih <strong>titik di kurva</strong> yang sesuai budget investigator. Tugasmu: sajikan menunya dengan jujur.</p>
      </div>

      <h2 id="recallfpr">Recall@FPR &amp; Alert Rate: Bahasa Kapasitas</h2>
      <p>Dua metrik operasional yang menghubungkan model ke dunia nyata:</p>
      <ul>
        <li><strong>Recall@FPR tetap:</strong> &ldquo;dengan FPR maksimal 1% (budget false positive kami), recall-nya berapa?&rdquo; — mis. recall@FPR=1% = 68%. Ini <strong>kontrak</strong> antara model dan kapasitas.</li>
        <li><strong>Alert rate:</strong> <Tex math={String.raw`\text{Alert Rate} = \frac{TP+FP}{\text{total transaksi}}`} /> — % transaksi yang masuk antrian. Alert rate 2% dari 50.000 trx/hari = 1.000 alert/hari. <strong>Alert rate × volume = nyawa investigator.</strong></li>
      </ul>
      <p><strong>Aturan praktis:</strong> tetapkan alert rate maksimal dari kapasitas (<em>kapasitas ÷ volume</em>), lalu maksimalkan recall di bawahnya. Bukan sebaliknya.</p>

      <h2 id="lift">Lift: &ldquo;Berapa Kali Lebih Baik dari Acak?&rdquo;</h2>
      <Tex math={String.raw`\text{Lift} = \frac{\text{precision pada segmen}}{\text{fraud rate populasi}}`} block />
      <ul>
        <li>Contoh: ambil 10% transaksi dengan skor tertinggi; di dalamnya fraud rate 4% vs populasi 0,2% → lift = <strong>20×</strong>.</li>
        <li><strong>Kegunaan:</strong> bahasa untuk non-teknis (&ldquo;model ini 20× lebih baik dari menebak&rdquo;) dan untuk <strong>prioritasi antrian</strong> — review dari skor tertinggi dulu (FR11).</li>
        <li><strong>Cumulative lift chart:</strong> plot % fraud tertangkap vs % populasi di-skor-tertinggi — menunjukkan &ldquo;dengan memeriksa 5% teratas, kita dapat 60% fraud&rdquo;.</li>
      </ul>

      <h2 id="rupiah">Uang Terselamatkan: Metrik yang Dimengerti Direksi</h2>
      <p>Metrik pamungkas — terjemahkan semuanya ke rupiah:</p>
      <Tex math={String.raw`\text{Net} = TP \times \bar{L} - FP \times C_{\text{review}} - FN \times \bar{L}`} block />
      <ul>
        <li><Tex math={String.raw`TP \times \bar{L}`} />: uang terselamatkan (fraud tertangkap × rata-rata loss).</li>
        <li><Tex math={String.raw`FP \times C_{\text{review}}`} />: biaya review sia-sia.</li>
        <li><Tex math={String.raw`FN \times \bar{L}`} />: uang yang tetap hilang.</li>
      </ul>
      <p><strong>Contoh:</strong> TP=16, FP=48, FN=4, loss Rp1,1 jt, review Rp25 rb → diselamatkan Rp17,6 jt − biaya FP Rp1,2 jt − loss lolos Rp4,4 jt = <strong>net Rp12 jt/bulan per 10.000 trx</strong>. Angka inilah yang masuk slide direksi — bukan AUC.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> setiap metrik statistik punya &ldquo;terjemahan rupiah&rdquo;. Precision rendah = &ldquo;membakar RpX di review sia-sia&rdquo;. Recall rendah = &ldquo;membiarkan RpY hilang&rdquo;. Analis yang bisa menerjemahkan = analis yang didengarkan direksi.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model terbaik = metrik tertinggi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> model terbaik = <strong>net rupiah tertinggi dalam kendala kapasitas</strong>. Model B di Lab 2 punya recall lebih rendah tapi net lebih tinggi karena tidak membakar biaya review. Mengoptimasi recall buta = mengoptimasi kebangkrutan operasional.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: PR-AUC vs ROC-AUC</h2>
      <p>Buktikan sendiri bahwa ROC-AUC &ldquo;terhibur&rdquo; oleh true negative.</p>
      <PyodideLab
        title="Lab 1 — PR-AUC Menghukum, ROC-AUC Menghibur"
        hint="Ubah n_ok 50000 → 5000. Selisih PR-AUC menyusut saat imbalance berkurang — buktikan bahwa masalahnya memang imbalance."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Net Rupiah per Model</h2>
      <PyodideLab
        title="Lab 2 — Duel Model dalam Rupiah"
        hint="Ubah precision model A jadi 0.10. Kapan 'model yang menangkap banyak' justru merugi? Itulah kematian BankMega."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Dari Confusion Matrix ke Keputusan Bisnis</h2>
      <p>Metrik bukan hiasan laporan — tiap angka harus bisa diterjemahkan ke <strong>rupiah dan headcount</strong>. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca confusion matrix sampai tuntas</summary>
        <p>Hasil evaluasi 7 hari (100.000 transaksi): TP = 160, FP = 640, FN = 40, TN = 99.160.</p>
        <p><strong>Langkah 1 — metrik dasar.</strong> Precision = 160/(160+640) = <strong>20%</strong>. Recall = 160/(160+40) = <strong>80%</strong>. F1 = 2×(0,2×0,8)/(0,2+0,8) = <strong>0,32</strong>. Akurasi = (160+99.160)/100.000 = <strong>99,32%</strong> — angka yang terlihat hebat dan <em>tidak berguna</em>.</p>
        <p><strong>Langkah 2 — terjemahkan ke operasional.</strong> 800 flag → dengan 10 investigator × 80 review/hari = 800/hari: <strong>pas 1 hari kerja</strong> untuk 7 hari data. Artinya kapasitas review 7× lipat lebih besar dari kebutuhan — atau: threshold bisa dilonggarkan untuk recall lebih tinggi (FR11).</p>
        <p><strong>Langkah 3 — yang disembunyikan F1.</strong> F1 = 0,32 terlihat &ldquo;jelek&rdquo;. Tapi bandingkan dengan baseline acak: flag 800 acak dari 100.000 → ekspektasi TP = 800 × 0,2% = 1,6. Model menangkap 160 = <strong>100× lebih baik dari acak</strong>. Pelajaran: di imbalance ekstrem, <strong>bandingkan dengan baseline, bukan dengan 1,0</strong>.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: memilih model dengan metrik rupiah (bukan F1)</summary>
        <p>Dua model kandidat, dievaluasi di data yang sama (100.000 transaksi, 200 fraud aktual, biaya review Rp25rb, rata-rata loss per fraud Rp1,1jt):</p>
        <p><strong>Model A:</strong> precision 35%, recall 60% → TP=120, FP=223. <strong>Model B:</strong> precision 20%, recall 85% → TP=170, FP=680.</p>
        <p><strong>Langkah 1 — hitung nilai.</strong> Nilai = (TP × Rp1,1jt) − ((TP+FP) × Rp25rb). Model A: (120 × 1,1jt) − (343 × 25rb) = Rp132jt − Rp8,6jt = <strong>Rp123,4jt</strong>. Model B: (170 × 1,1jt) − (850 × 25rb) = Rp187jt − Rp21,25jt = <strong>Rp165,75jt</strong>.</p>
        <p><strong>Langkah 2 — keputusan.</strong> Model B menang <strong>Rp42jt per 100rb transaksi</strong> meski precision-nya lebih rendah dan F1-nya (0,32 vs 0,44) lebih jelek! Karena di fraud, <strong>satu fraud tertangkap (Rp1,1jt) bernilai 44× satu review sia-sia (Rp25rb)</strong> — recall dihargai jauh lebih mahal daripada precision.</p>
        <p><strong>Langkah 3 — syaratnya.</strong> Ini hanya benar jika kapasitas review mencukupi (850 flag vs 343). Jika tim hanya mampu 400 review, Model B tidak bisa dioperasikan — dan Model A menang secara <em>operasional</em>. <strong>Metrik terbaik = metrik yang menghormati kendala operasional.</strong></p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Metrik adalah Kontrak</h2>
      <p>Setiap kali kamu memilih metrik, kamu menandatangani <strong>kontrak perilaku</strong> dengan tim: &ldquo;optimasi akurasi&rdquo; = kontrak untuk mengabaikan minoritas; &ldquo;optimasi recall&rdquo; = kontrak untuk membanjiri investigator; &ldquo;optimasi rupiah&rdquo; = kontrak untuk berpikir seperti pemilik bisnis. <strong>Model mengikuti metrik seperti air mengikuti selokan</strong> — jadi pilih selokannya dengan sadar.</p>
      <p>Intuisi kedua: <strong>evaluasi yang baik itu adversarial</strong> — ia berusaha <em>membuktikan model salah</em>, bukan membuktikan model benar. Slice evaluation (per segmen: nominal, kanal, jam), stress test (bagaimana saat serangan 10×?), dan evaluasi dengan label tertunda adalah cara &ldquo;menyerang&rdquo; modelmu sendiri <em>sebelum</em> dunia nyata melakukannya. Tim yang jatuh cinta pada modelnya berhenti menguji; tim yang curiga padanya menemukan kelemahan saat masih murah diperbaiki.</p>
      <p><strong>Kapan evaluasi standar ini TIDAK cukup:</strong> (1) saat <strong>label evaluasi terkontaminasi</strong> (label lag FR4) — metrikmu mengukur masa lalu, bukan sekarang; pakai proksi + audit; (2) saat <strong>distribusi berubah</strong> (drift FR10) — evaluasi di data lama = nostalgia; (3) saat <strong>keputusan melibatkan manusia</strong> — metrik model ≠ metrik sistem (investigator bisa membatalkan/memperbaiki); ukur <em>end-to-end</em>, bukan model sendirian.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> sebelum menghitung metrik apa pun, tulis <strong>keputusan</strong> yang akan diambil dari angkanya. &ldquo;Jika precision &lt; 15%, kita naikkan threshold; jika &gt; 30%, kita tambah auto-block.&rdquo; Metrik tanpa keputusan = dekorasi dashboard.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Metrik Apa untuk Siapa</h2>

      <div className="decision-card">
        <h3>1. Bandingkan 2 model saat development → <strong>PR-AUC</strong></h3>
        <p><strong>Kenapa:</strong> jujur untuk kelas langka; tidak terhibur TN massal.</p>
        <p><strong>Catatan:</strong> tetap laporkan ROC-AUC sebagai pelengkap — reviewer yang hanya kenal ROC akan bertanya.</p>
      </div>

      <div className="decision-card">
        <h3>2. Selaraskan dengan kapasitas tim → <strong>recall@FPR + alert rate</strong></h3>
        <p><strong>Kenapa:</strong> &ldquo;recall 70% pada FPR 1%&rdquo; = kontrak operasional. Alert rate × volume = beban investigator.</p>
        <p><strong>Contoh nyata:</strong> tim 10 orang × 100 review/hari = 1.000; volume 50.000/hari → alert rate maks 2%.</p>
      </div>

      <div className="decision-card">
        <h3>3. Prioritaskan antrian review → <strong>lift / skor tertinggi dulu</strong></h3>
        <p><strong>Kenapa:</strong> investigator terbatas harus mulai dari yang paling &ldquo;padat fraud&rdquo; (FR11).</p>
      </div>

      <div className="decision-card">
        <h3>4. Minta budget ke direksi → <strong>net uang terselamatkan (rupiah)</strong></h3>
        <p><strong>Kenapa:</strong> direksi tidak menganggarkan &ldquo;AUC&rdquo; — mereka menganggarkan rupiah. Net = bahasa mereka.</p>
        <p><strong>Contoh nyata:</strong> &ldquo;Model ini net Rp144 jt/tahun setelah biaya operasional&rdquo; &gt; &ldquo;PR-AUC 0,62&rdquo;.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Fraud = <strong>PR-AUC</strong> dulu, ROC-AUC kemudian.</li>
          <li>Tetapkan <strong>alert rate dari kapasitas</strong>, bukan dari model.</li>
          <li>Setiap metrik harus bisa <strong>diterjemahkan ke rupiah</strong>.</li>
          <li>Model yang membunuh tim investigasi = model yang gagal, apapun AUC-nya.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Satu Model, Banyak Metrik</h2>
      <p>Metrik yang tepat tergantung <em>siapa yang bertanya</em> dan <em>keputusan apa</em> yang diambil:</p>
      <p><strong>Skenario A — ROC-AUC vs PR-AUC.</strong> Data imbalance 1:500 → pakai <strong>PR-AUC</strong>. ROC-AUC terlihat bagus karena TN raksasa &ldquo;mengencerkan&rdquo; FP. Aturan praktis: jika positif &lt; 5% dari data, ROC-AUC dilarang jadi metrik utama — ia menipu (lihat mitos FR7).</p>
      <p><strong>Skenario B — lift untuk meyakinkan bisnis.</strong> Direksi tidak paham F1. Katakan: &ldquo;Di 1% skor tertinggi, fraud 40× lebih pekat daripada rata-rata&rdquo; — itu <strong>lift@1% = 40</strong>. Lift menerjemahkan kualitas model ke bahasa <em>efisiensi operasional</em>: makin tinggi lift, makin sedikit investigator untuk hasil yang sama.</p>
      <p><strong>Skenario C — metrik rupiah untuk keputusan investasi.</strong> &ldquo;Model ini menghemat Rp165jt per 100rb transaksi&rdquo; (contoh 2) adalah satu-satunya metrik yang bisa menjawab &ldquo;layak tidak tambah 5 investigator?&rdquo;. Semua metrik statistik adalah <em>proksi</em>; rupiah adalah <em>tujuan</em>. Evaluasi yang berhenti di F1 belum selesai — ia baru setengah jalan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> <strong>evaluasi yang baik menjawab pertanyaan keputusan, bukan pertanyaan statistik.</strong> Sebelum menghitung metrik apa pun, tulis dulu keputusannya: &ldquo;model A vs B?&rdquo;, &ldquo;threshold berapa?&rdquo;, &ldquo;tambah headcount?&rdquo;. Metrik yang tidak mengubah keputusan apa pun = metrik hiasan.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Deteksi Klaim Fiktif Asuransi</h2>
      <p>Perusahaan asuransi umum Indonesia menerapkan model untuk memprioritaskan investigasi klaim kendaraan. Angka operasionalnya (pola umum industri):</p>
      <ol>
        <li><strong>Volume:</strong> 12.000 klaim/bulan, estimasi 4% bermasalah (fraud/ inflated).</li>
        <li><strong>Biaya investigasi:</strong> Rp1,5jt per klaim (surveyor + bengkel rekanan verifikasi).</li>
        <li><strong>Model:</strong> precision@500 = 38% — dari 500 klaim prioritas teratas, 190 terbukti bermasalah, rata-rata nilai yang diselamatkan Rp8jt per kasus = <strong>Rp1,52 M/bulan</strong>.</li>
        <li><strong>Biaya:</strong> 500 × Rp1,5jt = Rp750jt → <strong>net Rp770jt/bulan</strong>.</li>
      </ol>
      <p><strong>Yang menarik:</strong> recall model hanya 40% (290 kasus bermasalah lolos). Direksi awalnya kecewa — sampai analis menunjukkan matematikanya: mengejar recall 80% butuh investigasi 2.000 klaim (biaya Rp3 M) untuk menyelamatkan tambahan Rp1,16 M → <strong>rugi Rp1,84 M</strong>. Titik optimal <em>bukan</em> recall maksimal, melainkan <strong>di mana rupiah marginal investigasi = rupiah marginal penyelamatan</strong>.</p>
      <p><strong>Pelajaran evaluasi:</strong> &ldquo;model kurang bagus&rdquo; (recall 40%) ternyata adalah <strong>keputusan bisnis yang optimal</strong>. Evaluasi tanpa biaya = opini; evaluasi dengan biaya = keputusan. Inilah kenapa FR9 menutup dengan rupiah, bukan dengan F1.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Akurasi 99% berarti model bagus.&rdquo;<br /><strong>Yang benar:</strong> dengan 99,8% transaksi normal, model yang memprediksi &ldquo;semua normal&rdquo; mendapat akurasi 99,8% sambil <strong>tidak menangkap satu pun fraud</strong>. Akurasi di data imbalance bukan metrik — ia <em>jebakan</em>. Lihat precision, recall, dan rupiahnya.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Duel Dua Model di Ruang Direksi</h2>
      <div className="callout">
        <p>Dua vendor mempresentasikan model fraud untuk BankMega (50.000 trx/hari, fraud rate 0,2% = 100 fraud/hari, loss Rp1,1 jt, review Rp25 rb, kapasitas 1.000 review/hari):</p>
        <ul>
          <li><strong>Vendor A:</strong> ROC-AUC 0,97, PR-AUC 0,41. Pada threshold usulan: recall 85%, precision 4%.</li>
          <li><strong>Vendor B:</strong> ROC-AUC 0,94, PR-AUC 0,62. Pada threshold usulan: recall 70%, precision 35%.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> vendor mana yang kamu pilih? Hitung alert/hari, muat tidaknya kapasitas, dan net rupiah/hari.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Vendor A:</strong> TP=85, alert = 85/0,04 = 2.125/hari &gt; 1.000 ✗ <strong>kapasitas jebol 2×</strong>. FP=2.040 → biaya FP Rp51 jt/hari. Net = 85×1,1jt − 51jt − 15×1,1jt = 93,5 − 51 − 16,5 = <strong>Rp26 jt/hari</strong> — <em>jika</em> investigator sanggup (mereka tidak).</p>
          <p><strong>Vendor B:</strong> TP=70, alert = 70/0,35 = 200/hari ≤ 1.000 ✓ muat longgar. FP=130 → Rp3,25 jt. Net = 77 − 3,25 − 33 = <strong>Rp40,75 jt/hari</strong>.</p>
          <p><strong>Pilih B</strong> — net lebih tinggi DAN muat kapasitas. A adalah jebakan &ldquo;ROC-AUC tinggi&rdquo;: di kertas menang, di operasi membunuh. <strong>Pelajaran untuk karir:</strong> inilah analisis yang membedakan &ldquo;data scientist yang bisa modeling&rdquo; dari &ldquo;fraud analyst yang dipercaya bisnis&rdquo;.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Evaluasi</h2>
      <details className="worked">
        <summary>Q1: Satu metrik utama — apa yang paling direkomendasikan?</summary>
        <p><strong>Expected value dalam rupiah</strong> (worked example 2): ia satu-satunya metrik yang <em>langsung</em> menjawab keputusan bisnis. Untuk monitoring harian: <strong>precision@kapasitas</strong> (presisi pada volume flag yang bisa di-review). Untuk perbandingan model: <strong>PR-AUC</strong>. Tiga metrik, tiga fungsi — jangan paksa satu metrik melakukan semuanya.</p>
      </details>
      <details className="worked">
        <summary>Q2: PR-AUC vs ROC-AUC — kapan masing-masing?</summary>
        <p><strong>PR-AUC</strong> saat positif &lt; 5% (hampir selalu di fraud) — ia tidak &ldquo;diencerkan&rdquo; oleh TN raksasa. <strong>ROC-AUC</strong> hanya saat kelas seimbang atau untuk komunikasi dengan orang yang hanya kenal ROC. Aturan praktis: <em>jika kamu harus memilih satu, pilih PR-AUC</em> — dan selalu tampilkan berdampingan dengan precision@recall operasional agar tidak abstrak.</p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana memilih threshold dari kurva metrik?</summary>
        <p><strong>Tiga kandidat, pilih yang paling ketat:</strong> (1) threshold biaya τ* (FR7), (2) threshold kapasitas (FR11), (3) threshold kebijakan (misal &ldquo;precision minimal 20%&rdquo;). Final = max(ketiganya). Dan <em>dokumentasikan alasannya</em> — threshold tanpa dokumentasi akan dipertanyakan setiap ada insiden, dan kamu tidak ingin menjawab dari ingatan.</p>
      </details>
      <details className="worked">
        <summary>Q4: A/B test untuk model fraud — apa jebakannya?</summary>
        <p>Tiga jebakan khas: (1) <strong>label lag</strong> — hasil &ldquo;presisi&rdquo; baru valid berminggu-minggu kemudian; pakai proksi cepat + metrik operasional; (2) <strong>interferensi</strong> — challenger yang memblokir mengubah perilaku yang dilihat champion (tidak independen!); (3) <strong>musiman</strong> — test harus kelipatan 7 hari. A/B test fraud = eksperimen dengan <em>kebenaran yang tertunda</em> — rancang dengan sabar.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Dari Angka ke Keputusan</h2>
      <p><strong>1.</strong> Evaluasi: TP=90, FP=410, FN=60. Hitung precision, recall, F1. Model ini &ldquo;bagus&rdquo; atau tidak — dan untuk siapa?</p>
      <p><strong>2.</strong> Biaya review Rp30rb, loss per fraud Rp900rb. Model A: TP=120, FP=280. Model B: TP=150, FP=600. Mana yang menang dalam rupiah? Apakah jawabanmu berubah jika kapasitas review hanya 500/hari?</p>
      <p><strong>3.</strong> Direksi bertanya &ldquo;model kita bagus tidak?&rdquo; — tulis jawaban 2 kalimat tanpa menyebut F1/AUC.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Precision = 90/500 = <strong>18%</strong>; recall = 90/150 = <strong>60%</strong>; F1 = <strong>0,28</strong>. &ldquo;Bagus&rdquo; relatif: 90x lebih baik dari acak (base rate ~0,2%), tapi butuh 500 review untuk 90 fraud — <strong>hanya bagus jika kapasitas cukup</strong>.</p>
        <p><strong>2.</strong> A: 120x900rb - 400x30rb = Rp108jt - Rp12jt = <strong>Rp96jt</strong>. B: 150x900rb - 750x30rb = Rp135jt - Rp22,5jt = <strong>Rp112,5jt</strong> — B menang. Tapi jika kapasitas 500/hari, B butuh 750 review = <strong>tidak operasional</strong> → A menang secara operasional. <em>Metrik terbaik menghormati kendala.</em></p>
        <p><strong>3.</strong> Contoh: &ldquo;Dari 150 fraud, 90 tertangkap; biayanya 500 review (Rp15jt) untuk menyelamatkan Rp81jt — <strong>balik modal 5,4x</strong>.&rdquo; Angka keputusan, bukan angka statistik.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model: 50.000 normal, 100 fraud, 1.000 FP. FPR = 2% terlihat kecil. Masalahnya?"
        options={[
          "Tidak ada — 2% kecil",
          "1.000 alert sampah/hari membunuh tim investigator, walau FPR 'kecil' — penyebut TN menyembunyikan beban operasional",
          "Modelnya bagus",
          "FPR salah hitung",
        ]}
        correct={1}
        explanation="Benar: FPR = FP/(FP+TN) — 50.000 TN 'menghibur' metrik ini. Yang menderita adalah manusia: 1.000 review sia-sia per hari. Inilah kenapa ROC-AUC menipu di imbalance."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kapan PR-AUC WAJIB jadi metrik utama (bukan ROC-AUC)?"
        options={[
          "Selalu",
          "Kelas positif langka (fraud 0,2%) — ROC-AUC terhibur oleh TN massal, PR-AUC tidak",
          "Tidak pernah",
          "Hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: kelas langka. PR-AUC tidak memuat TN di rumusnya — ia mengukur 'di antara yang ditandai, berapa yang benar' vs 'berapa yang tertangkap', persis yang dirasakan operasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Tim 10 orang × 100 review/hari, volume 50.000 trx/hari. Alert rate maksimal?"
        options={[
          "10%",
          "2% (1.000 ÷ 50.000) — tetapkan dari kapasitas, lalu maksimalkan recall di bawahnya",
          "50%",
          "Tidak ada batas",
        ]}
        correct={1}
        explanation="Benar: 2%. Alert rate × volume = beban investigator. Menetapkan dari kapasitas = kontrak operasional; model yang melebihinya = mati di lapangan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Lift 20× pada 10% skor tertinggi artinya…"
        options={[
          "Model 20× lebih cepat",
          "Fraud rate di segmen itu 20× populasi — '20× lebih baik dari menebak', bahasa untuk non-teknis & dasar prioritas antrian",
          "Akurasi 2000%",
          "Tidak ada arti",
        ]}
        correct={1}
        explanation="Benar: lift = precision_segmen / fraud_rate_populasi. Bahasa bisnis untuk 'seberapa padat fraud di antrian teratas' — fondasi prioritas review."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua model: A (recall 85%, precision 4%), B (recall 70%, precision 35%). Kapasitas 1.000 review/hari, volume 50.000/hari, 100 fraud/hari. Pilih?"
        options={[
          "A — recall tertinggi",
          "B — alert 200/hari muat kapasitas + net rupiah lebih tinggi; A jebol kapasitas (2.125 alert/hari)",
          "Seri",
          "Tolak keduanya",
        ]}
        correct={1}
        explanation="Benar: B. A butuh 2.125 review/hari — investigator mogok, recall aktual anjlok. Metrik tertinggi ≠ model terbaik; yang terbaik = net rupiah tertinggi dalam kendala kapasitas."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ROC-AUC menipu</strong> di imbalance: <Tex math={String.raw`FPR = FP/(FP+TN)`} /> terhibur TN massal.</li>
          <li><strong>PR-AUC</strong> = metrik utama fraud — tanpa TN di rumus, baseline = fraud rate.</li>
          <li><strong>Recall@FPR + alert rate</strong> = kontrak dengan kapasitas tim. Tetapkan dari kapasitas.</li>
          <li><strong>Lift</strong> = precision_segmen / fraud_rate — bahasa bisnis &amp; dasar prioritas antrian.</li>
          <li><strong>Net rupiah</strong>: <Tex math={String.raw`TP\cdot\bar{L} - FP\cdot C - FN\cdot\bar{L}`} /> — metrik direksi.</li>
          <li>Model yang membunuh tim investigasi = model gagal, apapun AUC-nya.</li>
          <li>Kapan TIDAK pakai PR-AUC: kelas seimbang — di sana ROC-AUC baik-baik saja.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr8-unsupervised" className="btn btn-secondary btn-sm">← FR8</Link>
        <Link href="/learn/fr10-drift" className="btn btn-primary btn-sm">Next: FR10 →</Link>
      </div>
    </div>
  );
}
