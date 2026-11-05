"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR10Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const decayData = [
    {
      x: ["Bulan 1", "Bulan 2", "Bulan 3", "Bulan 4", "Bulan 5", "Bulan 6", "Bulan 7", "Bulan 8"],
      y: [0.93, 0.91, 0.88, 0.84, 0.79, 0.74, 0.69, 0.65],
      type: "scatter",
      mode: "lines+markers",
      name: "PR-AUC produksi",
      line: { color: "#e05252", width: 3 },
      marker: { size: 8 },
    },
    {
      x: ["Bulan 1", "Bulan 2", "Bulan 3", "Bulan 4", "Bulan 5", "Bulan 6", "Bulan 7", "Bulan 8"],
      y: [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93],
      type: "scatter",
      mode: "lines",
      name: "PR-AUC validasi (random split)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const splitData = [
    {
      x: ["Random split", "Time split"],
      y: [0.93, 0.81],
      name: "PR-AUC validasi",
      type: "bar",
      marker: { color: ["#7bc96f", "#e8a838"] },
      text: ["0,93", "0,81"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Random split vs time split: bukti kebocoran masa depan
# Data 12 bulan; pola fraud BERUBAH di bulan 7 (penipu adaptasi).
import random
random.seed(17)

bulan = []
for m in range(1, 13):
    for _ in range(1000):
        # pola lama (bulan 1-6): fraud = nominal besar. pola baru (7-12): fraud = nominal KECIL + velocity tinggi
        is_fraud = random.random() < 0.02
        if is_fraud:
            nominal = random.gauss(8, 2) if m <= 6 else random.gauss(1.5, 0.5)
        else:
            nominal = random.gauss(2, 1)
        bulan.append((m, nominal, is_fraud))
random.shuffle(bulan)

def skor(nominal):  # model sederhana: curigai nominal besar (pola lama)
    return nominal

def pr_auc(data):
    data = sorted(data, key=lambda d: skor(d[1]), reverse=True)
    n_fraud = sum(d[2] for d in data)
    tp = fp = 0; auc = 0.0; prev_r = 0.0
    for _, _, y in data:
        if y: tp += 1
        else: fp += 1
        r = tp / n_fraud; p = tp / (tp + fp)
        auc += (r - prev_r) * p; prev_r = r
    return auc

# Random split: train & validasi campur semua bulan (BOCOR: validasi 'melihat' pola baru)
train_r = [d for d in bulan if random.random() < 0.7]
val_r = [d for d in bulan if d not in train_r]
# Time split: train bulan 1-8, validasi bulan 9-12 (masa depan ASLI)
val_t = [d for d in bulan if d[0] >= 9]

print(f"Random split PR-AUC : {pr_auc(val_r):.3f}  <- 'bagus' tapi BOHONG")
print(f"Time split PR-AUC   : {pr_auc(val_t):.3f}  <- jujur: pola baru tak dikenal model")
print()
print("COBA UBAH: pola baru gauss(1.5,0.5) -> gauss(8,2) (tidak ada adaptasi).")
print("Selisih menghilang! Pelajaran: random split hanya jujur jika")
print("masa depan = masa lalu. Di fraud, itu tidak pernah benar.")`;

  const lab2Code = `# Deteksi drift: pantau distribusi skor model dari waktu ke waktu
# PSI (Population Stability Index): <0.1 aman, 0.1-0.25 waspada, >0.25 drift!
import math

def psi(expected, actual):
    # expected, actual: distribusi dalam 10 bucket (proporsi)
    total = 0.0
    for e, a in zip(expected, actual):
        e = max(e, 0.0001); a = max(a, 0.0001)
        total += (a - e) * math.log(a / e)
    return total

# Distribusi skor model saat training (baseline)
baseline = [0.40, 0.25, 0.15, 0.08, 0.05, 0.03, 0.02, 0.01, 0.005, 0.005]
# Bulan ini: penipu adaptasi -> skor mengumpul di tengah (menghindari ekstrem)
bulan_ini = [0.30, 0.25, 0.18, 0.10, 0.07, 0.04, 0.03, 0.015, 0.01, 0.005]

nilai = psi(baseline, bulan_ini)
status = "🔴 DRIFT" if nilai > 0.25 else ("🟡 WASPADA" if nilai > 0.1 else "🟢 AMAN")
print(f"PSI = {nilai:.3f}  {status}")
print()
print("COBA UBAH: bulan_ini = baseline (tidak ada perubahan).")
print("PSI ~ 0 = aman. Pelajaran: PSI adalah 'alarm asap' —")
print("ia tidak bilang ADA KEBAKARAN (fraud naik), hanya bilang")
print("'sesuatu BERUBAH'. Investigasi manual yang memastikan.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR10 — Fraud / ML Analytics</span>
        <h1 className="display-title">Validasi Temporal &amp; Drift:<br />Musuhmu Belajar dari Kekalahan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model yang Mati dalam 8 Bulan</a></li>
          <li><a href="#timesplit">Validasi Temporal: Jangan Biarkan Model Mencontek Masa Depan</a></li>
          <li><a href="#drift">Concept Drift: Saat Dunia Berubah di Bawah Kakimu</a></li>
          <li><a href="#adversarial">Adversarial Adaptation: Drift yang Disengaja</a></li>
          <li><a href="#psi">Mendeteksi Drift: PSI &amp; Alarm Asap</a></li>
          <li><a href="#lab1">🔬 Lab 1: Random Split vs Time Split</a></li>
          <li><a href="#lab2">🔬 Lab 2: Hitung PSI</a></li>
          <li><a href="#worked">📐 Worked Example: Menghitung PSI Manual</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Dunia Bergerak, Model Diam</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Strategi Validasi &amp; Monitoring</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Respons terhadap Drift</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Ramadan &amp; False Positive Massal</a></li>

          <li><a href="#case">📋 Mini-Case: Model Anjlok Bulan ke-5 — Apa yang Terjadi?</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Drift</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>mengapa random split tidak valid</strong> untuk fraud dan merancang time-based split yang benar.</li>
          <li>Membedakan <strong>concept drift, data drift, dan label drift</strong> beserta contohnya.</li>
          <li>Menjelaskan <strong>adversarial adaptation</strong> — mengapa drift di fraud bersifat disengaja dan lebih cepat.</li>
          <li>Menghitung <strong>PSI</strong> dan menetapkan ambang aksi monitoring.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model yang Mati dalam 8 Bulan</h2>
      <div className="story">
        <p>Model fraud &ldquo;PayKu&rdquo; diluncurkan Januari dengan PR-AUC validasi <strong>0,93</strong>. Perayaan. Bonus. Lalu grafik produksinya: Februari 0,91… April 0,84… Agustus <strong>0,65</strong>. Model yang sama, data yang &ldquo;sama&rdquo; — tapi performanya <strong>mati pelan-pelan</strong>.</p>
        <p>Yang terjadi bukan bug. Penipu <strong>belajar</strong>: bulan 1–2 mereka pakai nominal besar (ditangkap). Bulan 3 mereka pecah jadi nominal kecil (lolos sebagian). Bulan 5 mereka sewa mule dengan device &ldquo;bersih&rdquo; (lolos banyak). Setiap kekalahan mereka adalah <strong>pelajaran gratis</strong> — dan model PayKu tidak pernah ikut les.</p>
        <p>Twist-nya: validasi 0,93 itu sendiri <strong>bohong sejak awal</strong> — dihitung dengan random split, di mana data &ldquo;validasi&rdquo; berisi pola dari bulan-bulan yang sama dengan training. Model tidak diuji pada <em>masa depan</em>; ia diuji pada <em>masa lalu yang diacak</em>. Lesson ini: <strong>di fraud, waktu bukan sekadar kolom — ia adalah musuh</strong>.</p>
      </div>

      <h2 id="timesplit">Validasi Temporal: Jangan Biarkan Model Mencontek Masa Depan</h2>
      <p><strong>Masalah random split:</strong> mengacak data lalu split 80/20 berarti data validasi mengandung pola dari <em>periode yang sama</em> dengan training. Model &ldquo;validasi&rdquo; pada pola yang sudah dilihatnya — seperti ujian dengan soal yang sudah dibocorkan.</p>
      <p><strong>Time-based split yang benar:</strong></p>
      <ul>
        <li><strong>Train:</strong> bulan 1–8 (dengan <strong>embargo</strong> — ingat FR4: label harus matang!).</li>
        <li><strong>Validasi:</strong> bulan 9–10 (masa depan relatif terhadap train).</li>
        <li><strong>Test:</strong> bulan 11–12 (masa depan yang belum pernah dilihat).</li>
        <li><strong>Gap/embargo</strong> antara train dan validasi = maturation window (label validasi harus matang juga!).</li>
      </ul>

      <PlotlyChart
        data={splitData}
        title="Random Split vs Time Split: Selisih Kejujuran"
        layout={{ xaxis: { title: "Metode validasi" }, yaxis: { title: "PR-AUC", range: [0.7, 1.0] }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> dua batang = PR-AUC validasi model yang sama dengan dua metode split.</p>
        <p><strong>Interpretasi:</strong> random split 0,93 vs time split 0,81 — <strong>selisih 0,12 adalah ukuran kebohongan</strong>. Model yang &ldquo;0,93&rdquo; sebenarnya &ldquo;0,81&rdquo; saat menghadapi masa depan. <strong>Aturan keras:</strong> angka validasi dari random split untuk fraud = tidak valid. Titik.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> validasi menjawab <em>&ldquo;bagaimana model ini menghadapi masa depan?&rdquo;</em> Satu-satunya cara jujur mensimulasikannya: <strong>uji pada masa depan betulan</strong> (data yang terjadi setelah training). Random split menjawab pertanyaan yang salah (&ldquo;bagaimana model pada masa lalu yang diacak?&rdquo;) — dan jawaban yang salah itu berbahaya karena <em>terlihat</em> meyakinkan.</p>
      </div>

      <h2 id="drift">Concept Drift: Saat Dunia Berubah di Bawah Kakimu</h2>
      <p><strong>Definisi.</strong> Drift = perubahan hubungan antara fitur dan target seiring waktu. Tiga jenis:</p>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Jenis</th><th>Yang berubah</th><th>Contoh fraud</th></tr></thead>
          <tbody>
            <tr><td><strong>Concept drift</strong></td><td><Tex math={String.raw`P(y \mid x)`} /> — arti fitur berubah</td><td>&ldquo;Device baru&rdquo; dulu = 80% fraud; setelah edukasi massal + promo HP baru, jadi 30% fraud</td></tr>
            <tr><td><strong>Data drift</strong></td><td><Tex math={String.raw`P(x)`} /> — distribusi fitur berubah</td><td>Promo 11.11: volume 10×, nominal mengecil massal — model &ldquo;kaget&rdquo;</td></tr>
            <tr><td><strong>Label drift</strong></td><td><Tex math={String.raw`P(y)`} /> — base rate berubah</td><td>Serangan terkoordinasi: fraud rate 0,2% → 2% seminggu (ingat FR2: presisi ikut berubah!)</td></tr>
          </tbody>
        </table>
      </div>

      <PlotlyChart
        data={decayData}
        title="Kematian Model: PR-AUC Produksi vs Validasi (8 bulan)"
        layout={{ xaxis: { title: "Bulan produksi" }, yaxis: { title: "PR-AUC", range: [0.6, 1.0] }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = performa aktual di produksi per bulan; garis abu-abu putus-putus = angka validasi (random split) yang dilaporkan saat launch.</p>
        <p><strong>Interpretasi:</strong> validasi bilang 0,93 selamanya; realita turun ke 0,65 dalam 8 bulan. <strong>Dua pelajaran sekaligus:</strong> (1) validasi bohong (random split), (2) dunia berubah (drift). Model fraud tanpa retraining terjadwal = aset yang menyusut — seperti mobil yang tidak pernah diservis.</p>
      </div>

      <h2 id="adversarial">Adversarial Adaptation: Drift yang Disengaja</h2>
      <p>Inilah yang membuat fraud <strong>berbeda dari semua domain ML lain</strong>: drift-nya bukan acak (perubahan musim, tren pasar) — melainkan <strong>disengaja oleh lawan yang cerdas</strong>.</p>
      <p><strong>Siklus adaptasi musuh</strong> (biasanya 2–6 bulan per putaran):</p>
      <ol>
        <li><strong>Eksploitasi:</strong> penipu menemukan celah (mis. ambang velocity 5/jam).</li>
        <li><strong>Deteksi kita:</strong> rule/model menangkap pola → loss mereka naik.</li>
        <li><strong>Adaptasi mereka:</strong> pecah jadi 4/jam dari 2 device (di bawah ambang, di atas deteksi).</li>
        <li><strong>Deteksi kita lagi:</strong> analis melihat pola baru → rule baru.</li>
        <li>Kembali ke langkah 1. <strong>Selamanya.</strong></li>
      </ol>
      <p><strong>Implikasi desain:</strong></p>
      <ul>
        <li><strong>Jangan publikasikan ambangmu</strong> — penipu membaca juga (jangan tulis &ldquo;transaksi &gt;Rp1 juta ditahan&rdquo; di FAQ!).</li>
        <li><strong>Randomisasi pertahanan:</strong> ambang yang sedikit acak / step-up acak membuat adaptasi lebih mahal bagi penipu.</li>
        <li><strong>Retraining bukan opsional</strong> — jadwalkan (mis. bulanan) dengan data matang terbaru.</li>
        <li><strong>Fitur &ldquo;fisika&rdquo; lebih tahan lama</strong> (FR6): penipu bisa mengubah nominal, tidak bisa mengubah hukum fisika.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model yang bagus akan tetap bagus — kan sudah divalidasi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> di fraud, model yang tidak di-retrain = <strong>target latihan</strong> bagi penipu. Mereka justru <em>belajar dari modelmu</em>: tiap transaksi yang lolos mengajari mereka &ldquo;di sinilah batasnya&rdquo;. Model statis melawan musuh adaptif = kalah pasti, hanya soal waktu.</p>
      </div>

      <h2 id="psi">Mendeteksi Drift: PSI &amp; Alarm Asap</h2>
      <p><strong>Definisi.</strong> PSI (Population Stability Index) mengukur pergeseran distribusi:</p>
      <Tex math={String.raw`PSI = \sum_{i} (A_i - E_i) \cdot \ln\left(\frac{A_i}{E_i}\right)`} block />
      <ul>
        <li><Tex math={String.raw`E_i`} />: proporsi bucket ke-<Tex math={String.raw`i`} /> saat <strong>baseline</strong> (training).</li>
        <li><Tex math={String.raw`A_i`} />: proporsi bucket ke-<Tex math={String.raw`i`} /> <strong>saat ini</strong> (produksi).</li>
        <li><strong>Ambang aksi:</strong> &lt;0,1 aman; 0,1–0,25 waspada (investigasi); &gt;0,25 drift signifikan (bertindak).</li>
      </ul>
      <p><strong>Yang dipantau:</strong> distribusi <strong>skor model</strong>, fitur kunci (velocity, device age), dan <strong>base rate</strong> (fraud rate). Pantau ketiganya — drift bisa datang dari mana saja.</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> PSI adalah <strong>alarm asap, bukan pemadam</strong>. Ia bilang &ldquo;sesuatu berubah&rdquo; — bukan &ldquo;fraud naik&rdquo; atau &ldquo;model rusak&rdquo;. Promo 11.11 juga memicu PSI (data drift yang wajar!). Tugas analis: membedakan <em>drift wajar</em> (musiman, promo) dari <em>drift musuh</em> (adaptasi).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;PSI &gt; 0,25 = model harus di-retrain sekarang.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> PSI tinggi = <em>investigasi</em>, bukan <em>retrain otomatis</em>. Retrain pada data yang sedang diserang pola baru (label belum matang!) bisa <strong>mengajari model pola serangan</strong> sebagai &ldquo;normal&rdquo;. Urutan benar: investigasi → pahami → putuskan (rule darurat? retrain? tunggu label matang?).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Random Split vs Time Split</h2>
      <p>Buktikan kebocoran masa depan dengan tangan sendiri.</p>
      <PyodideLab
        title="Lab 1 — Validasi Bohong vs Validasi Jujur"
        hint="Ubah pola baru jadi sama dengan pola lama (tidak ada adaptasi). Selisih kedua split menghilang — buktikan bahwa masalahnya memang perubahan waktu."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Hitung PSI</h2>
      <PyodideLab
        title="Lab 2 — PSI: Alarm Asap Drift"
        hint="Ubah distribusi bulan_ini sedikit demi sedikit. Pada titik berapa PSI melewati 0,1? 0,25? Rasakan sensitivitasnya."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Mengukur Drift dengan Tangan</h2>
      <p>PSI (Population Stability Index) terlihat rumit sampai kamu menghitungnya sekali secara manual. Setelah itu, ia jadi intuisi.</p>

      <details className="worked">
        <summary>📐 Contoh 1: PSI distribusi nominal transaksi (10 bin)</summary>
        <p>Distribusi <em>expected</em> (training, Januari) vs <em>actual</em> (produksi, Oktober) untuk fitur nominal — disederhanakan ke 4 bin:</p>
        <p>Bin A (&lt;Rp100rb): exp 40%, act 38%. Bin B (Rp100–500rb): exp 35%, act 30%. Bin C (Rp500rb–2jt): exp 20%, act 22%. Bin D (&gt;Rp2jt): exp 5%, act 10%.</p>
        <p><strong>Langkah 1 — rumus per bin:</strong> <Tex math={String.raw`\text{PSI}_{bin} = (\text{act} - \text{exp}) \times \ln\left(\frac{\text{act}}{\text{exp}}\right)`} block /></p>
        <p><strong>Langkah 2 — hitung.</strong> A: (0,38−0,40)×ln(0,38/0,40) = (−0,02)×(−0,051) = 0,001. B: (−0,05)×ln(0,30/0,35) = (−0,05)×(−0,154) = 0,0077. C: (0,02)×ln(0,22/0,20) = 0,02×0,095 = 0,0019. D: (0,05)×ln(0,10/0,05) = 0,05×0,693 = <strong>0,0347</strong>.</p>
        <p><strong>Langkah 3 — total &amp; interpretasi.</strong> PSI = 0,045. Aturan umum: &lt; 0,1 = aman; 0,1–0,25 = waspada; &gt; 0,25 = drift signifikan. <strong>0,045 = aman</strong> — tapi perhatikan: <strong>77% PSI disumbang bin D</strong> (transaksi &gt; Rp2jt berlipat ganda dari 5% ke 10%). Intuisi: PSI total &ldquo;aman&rdquo; bisa menyembunyikan <em>pergeseran berbahaya di ekor distribusi</em> — dan ekor itulah tempat fraud tinggal. Selalu lihat kontribusi per bin, bukan cuma totalnya.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: drift vs serangan — membaca pola perubahan</summary>
        <p>Dua kejadian, sama-sama &ldquo;distribusi berubah&rdquo;, responsnya berlawanan:</p>
        <p><strong>Kejadian X:</strong> selama 3 minggu, proporsi transaksi &gt; Rp2jt naik perlahan 5% → 6% → 7% → 8%, tersebar di semua merchant, semua jam, semua device. <strong>Ini drift:</strong> gradual, menyebar, konsisten dengan musim (misal menjelang Lebaran daya beli naik). Respons: pantau, kalibrasi ulang threshold, jadwalkan retrain.</p>
        <p><strong>Kejadian Y:</strong> dalam 6 jam, proporsi transaksi &gt; Rp2jt melonjak 5% → 18%, terkonsentrasi di 40 merchant baru, jam 01.00–05.00, dari 200 device yang sama. <strong>Ini serangan</strong> (atau adversarial drift): tiba-tiba, terkonsentrasi, berkorelasi antar fitur. Respons: <em>bukan</em> retrain — tapi <strong>blokir darurat + investigasi</strong> (FR5 rule darurat). Me-retrain model dengan data serangan = mengajari model bahwa serangan adalah &ldquo;normal baru&rdquo;.</p>
        <p><strong>Pelajaran:</strong> deteksi drift menjawab &ldquo;<em>apakah</em> berubah&rdquo;; analisis pola menjawab &ldquo;<em>bagaimana</em> berubahnya&rdquo; — dan hanya yang kedua yang menentukan respons. Dashboard drift tanpa kolom &ldquo;konsentrasi &amp; kecepatan perubahan&rdquo; = alarm tanpa arti.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Dunia Bergerak, Model Diam</h2>
      <p>Model adalah <strong>foto dunia pada tanggal training</strong>. Dunia — perilaku nasabah, taktik penjahat, ekonomi, musim — terus bergerak setelah foto diambil. Drift bukan kegagalan; ia <strong>hukum fisika</strong> sistem ML. Pertanyaannya bukan &ldquo;apakah akan drift?&rdquo; tapi &ldquo;<em>seberapa cepat</em> dan <em>apakah kita melihatnya datang</em>?&rdquo;</p>
      <p>Intuisi kedua: <strong>tidak semua perubahan adalah drift yang butuh respons</strong>. Ada <em>noise</em> (fluktuasi harian — abaikan), <em>seasonality</em> (Ramadan, Harbolnas — jadwalkan), <em>drift gradual</em> (perilaku bergeser — kalibrasi), <em>drift tiba-tiba</em> (serangan/bug — respons darurat). Empat jenis, empat respons. Dashboard yang hanya berteriak &ldquo;DRIFT!&rdquo; tanpa klasifikasi = alarm kebakaran yang bunyi saat ada yang masak — lama-lama tidak didengar siapa pun.</p>
      <p><strong>Kapan monitoring drift ini TIDAK berguna:</strong> (1) <strong>tanpa baseline yang benar</strong> — membandingkan Oktober dengan Januari tanpa memperhitungkan musim = menemukan &ldquo;drift&rdquo; yang sebenarnya kalender; (2) <strong>tanpa aksi yang terdefinisi</strong> — alert yang tidak memicu siapa pun melakukan apa pun = spam; (3) <strong>saat yang berubah adalah <em>label</em>, bukan fitur</strong> (definisi fraud diubah) — itu masalah governance, bukan drift.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rancang monitoring dengan pertanyaan: <strong>&ldquo;jika angka ini merah jam 3 pagi, siapa yang bangun dan melakukan apa?&rdquo;</strong> Jika jawabannya &ldquo;tidak ada&rdquo; — metrik itu belum siap jadi alert; ia masih sekadar grafik.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Strategi Validasi &amp; Monitoring</h2>

      <div className="decision-card">
        <h3>1. Model baru mau launch → <strong>time-based split + embargo</strong></h3>
        <p><strong>Kenapa:</strong> satu-satunya validasi jujur. Random split = angka hiburan.</p>
        <p><strong>Contoh nyata:</strong> train bulan 1–8 (label matang), validasi 9–10, test 11–12.</p>
      </div>

      <div className="decision-card">
        <h3>2. Model sudah produksi → <strong>monitor PSI mingguan + PR-AUC bulanan (label matang)</strong></h3>
        <p><strong>Kenapa:</strong> PSI = alarm dini (tanpa butuh label); PR-AUC dengan label matang = vonis.</p>
        <p><strong>Aksi:</strong> PSI 0,1–0,25 → investigasi; &gt;0,25 → war-room; PR-AUC turun 10%+ → retrain.</p>
      </div>

      <div className="decision-card">
        <h3>3. Serangan pola baru terdeteksi → <strong>rule darurat dulu, retrain kemudian</strong></h3>
        <p><strong>Kenapa:</strong> retrain butuh label matang (90+ hari); serangan butuh respons hari ini. Rule darurat (FR5) menahan sambil menunggu.</p>
        <p><strong>Contoh nyata:</strong> pola &ldquo;patungan fiktif&rdquo; DanaKita → rule darurat minggu ke-2, model baru bulan ke-4.</p>
      </div>

      <div className="decision-card">
        <h3>4. Musuh adaptif kronis → <strong>pertahanan berlapis + randomisasi + fitur fisika</strong></h3>
        <p><strong>Kenapa:</strong> satu model statis akan dipelajari musuh. Lapisan (rule + ML + manual) + ambang acak + fitur yang tak bisa di-tune = adaptasi mahal bagi penipu.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Random split untuk fraud = tidak valid.</strong> Time split + embargo, selalu.</li>
          <li>Bedakan drift wajar (promo/musim) vs drift musuh (adaptasi) — responsnya beda.</li>
          <li>PSI = alarm asap; investigasi sebelum retrain.</li>
          <li>Retrain terjadwal (bulanan/kuartalan) — model statis = target latihan musuh.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Retrain, Recalibrate, atau Rollback?</h2>
      <p>Drift terdeteksi. Tiga respons, tiga situasi:</p>
      <p><strong>Skenario A — drift gradual &amp; perilaku legit berubah (musiman).</strong> Contoh: Ramadan — jam belanja bergeser ke malam hari, false positive naik 3×. Respons: <strong>recalibrate</strong> (sesuaikan threshold &amp; kalibrasi, bukan retrain penuh) + <strong>kalender regime</strong> (FR5). Retrain penuh dengan data Ramadan akan merusak performa di bulan normal — <em>drift musiman ≠ drift permanen</em>.</p>
      <p><strong>Skenario B — drift permanen (perilaku berubah selamanya).</strong> Contoh: QRIS menggantikan tunai di warung — pola nominal &amp; frekuensi berubah struktural. Respons: <strong>retrain terjadwal</strong> dengan data baru yang cukup (≥ 3 bulan), via champion-challenger (FR18), bukan replace buta. Tandanya: PSI &gt; 0,25 bertahan &gt; 2 bulan dan analis bisnis mengonfirmasi &ldquo;dunia memang berubah&rdquo;.</p>
      <p><strong>Skenario C — performa anjlok tiba-tiba setelah deploy.</strong> Bukan drift — kemungkinan <strong>bug pipeline</strong> (fitur salah hitung, timezone bergeser, join rusak). Respons: <strong>rollback dulu, investigasi kemudian</strong>. Aturan emas: <em>jangan pernah me-retrain untuk menutupi bug</em> — model baru yang dilatih dari data rusak = kerusakan yang dilembagakan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> model tidak kedaluwarsa karena <em>umur</em> — ia kedaluwarsa karena <strong>dunia berubah</strong>. Pertanyaan monitoring yang benar bukan &ldquo;model ini umur berapa?&rdquo; melainkan &ldquo;dunia hari ini masih sama dengan dunia saat ia dilatih?&rdquo;. PSI hanyalah cara mengukur jawaban pertanyaan itu.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Model Kaget Saat Ramadan</h2>
      <p>Pola yang dialami beberapa bank &amp; e-commerce Indonesia: model fraud yang tenang 11 bulan tiba-tiba mem-flag <strong>5–8× lipat</strong> transaksi normal di minggu pertama Ramadan.</p>
      <p><strong>Yang berubah (semuanya legit):</strong> jam belanja bergeser (buka puasa–sahur menjadi prime time), nominal naik (belanja Lebaran, THR), velocity naik (borong parsel), lokasi berubah (mudik — transaksi dari kota yang &ldquo;tidak biasa&rdquo; bagi nasabah), device baru (HP baru untuk Lebaran).</p>
      <p><strong>Angka ilustratif:</strong> flag harian normal 2.000 → melonjak ke 13.000. Precision anjlok dari 22% ke 4%. Tim 30 investigator butuh 6 hari untuk membersihkan backlog — sementara 11.000 nasabah legit menunggu review dengan transaksi tertahan. Biaya: CS overload + komplain viral di media sosial (&ldquo;bank X blokir THR saya!&rdquo;).</p>
      <p><strong>Solusi yang benar (diterapkan tahun berikutnya):</strong> (1) <strong>regime calendar</strong> — 2 minggu sebelum Ramadan, threshold otomatis dilonggarkan 30% dan bobot fitur &ldquo;jam tidak wajar&rdquo; diturunkan; (2) <strong>fitur musiman</strong> — tambahkan fitur &ldquo;deviasi dari pola Ramadan tahun lalu&rdquo;, bukan dari rata-rata tahunan; (3) <strong>komunikasi</strong> — notifikasi proaktif ke nasabah: &ldquo;transaksi besar Anda mungkin ditahan sebentar, hubungi kami&rdquo;. Pelajaran: <strong>drift yang bisa diprediksi kalendernya bukan drift — ia jadwal</strong>. Yang memalukan bukan modelnya kaget, tapi timnya tidak menyiapkan kalender.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Retrain tiap bulan pasti bikin model tetap segar.&rdquo;<br /><strong>Yang benar:</strong> retrain buta tiap bulan bisa <em>merusak</em>: melatih dengan data yang terkontaminasi label-lag (FR4), menghafal serangan sementara sebagai normal, dan menutupi bug pipeline. Retrain adalah <strong>obat dengan dosis</strong> — perlu diagnosis (jenis drift apa?) sebelum resep, bukan vitamin harian.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Model Anjlok Bulan ke-5 — Apa yang Terjadi?</h2>
      <div className="callout">
        <p>Model fraud &ldquo;KreditGo&rdquo;: PR-AUC validasi (time split!) 0,88 saat launch Januari. Produksi: Jan 0,87, Feb 0,86, Mar 0,85, Apr 0,83, Mei <strong>0,71</strong>. PSI skor: Jan–Apr &lt;0,1; Mei <strong>0,31</strong>. Distribusi fitur: <code className="inline">device_age_days</code> bulan Mei mengumpul di 20–30 hari (sebelumnya &lt;7 hari dominan).</p>
        <p><strong>Pertanyaan:</strong> (a) Jenis drift apa ini? (b) Apa yang kemungkinan dilakukan penipu? (c) Respons 2 minggu ke depan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Concept drift adversarial.</strong> Bukan data drift musiman (Mei bukan musim promo device) — dan <Tex math={String.raw`P(y|x)`} /> berubah: device &ldquo;berumur&rdquo; yang dulu = aman, kini = sarang.</p>
          <p>(b) <strong>Penipu adaptasi terhadap fitur device_age_days</strong> (pahlawan FR6!): mereka kini &ldquo;memelihara&rdquo; device/akun 20–30 hari sebelum menyerang (warming yang lebih sabar). Model yang mengandalkan &ldquo;umur muda = curiga&rdquo; jadi buta.</p>
          <p>(c) <strong>2 minggu:</strong> (1) rule darurat: &ldquo;device 20–30 hari + velocity tinggi&rdquo; → hold; (2) investigasi: konfirmasi pola via sampled review; (3) JANGAN retrain otomatis — label Mei belum matang; (4) rancang fitur baru yang tak bisa di-tune: mis. <em>konsistensi</em> perilaku selama 20–30 hari itu (akun yang &ldquo;tidur&rdquo; 25 hari lalu tiba-tiba agresif = pola baru). <strong>Pelajaran:</strong> tiap fitur punya &ldquo;umur simpan&rdquo; — musuh selalu menemukan cara memalsukannya. Pertahanan = evolusi tanpa henti.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Drift</h2>
      <details className="worked">
        <summary>Q1: Seberapa sering harus memonitor drift?</summary>
        <p><strong>Fitur &amp; prediksi: harian</strong> (otomatis, murah). <strong>Performa vs label: mingguan–bulanan</strong> (menunggu label matang). <strong>Review mendalam: kuartalan</strong> (manusia membaca tren + konteks bisnis). Yang penting bukan frekuensi — tapi <strong>setiap frekuensi punya pemilik &amp; aksi</strong>. Monitor harian tanpa pemilik = log yang tidak dibaca.</p>
      </details>
      <details className="worked">
        <summary>Q2: Ambang PSI 0,1 / 0,25 — harga mati?</summary>
        <p><strong>Tidak — itu titik awal.</strong> Kalibrasi dengan datamu: jalankan PSI historis 12 bulan, lihat distribusi &ldquo;normal&rdquo;-nya, set ambang di persentil-95 periode tenang. Untuk fitur kritis (velocity), ambang lebih ketat; untuk fitur musiman, bandingkan <em>year-over-year</em> bukan month-over-month. <strong>Ambang yang dikalibrasi &gt; ambang textbook.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Bagaimana membedakan drift vs seasonality?</summary>
        <p><strong>Tiga uji:</strong> (1) <em>apakah pernah terjadi di periode yang sama tahun lalu?</em> (ya → musiman); (2) <em>apakah kembali normal setelah periode berlalu?</em> (ya → musiman); (3) <em>apakah analis bisnis mengenalinya?</em> (&ldquo;oh, itu Ramadan&rdquo; → musiman). Jika ketiganya tidak → drift asli. Dan: <strong>musiman yang tidak dijadwalkan = drift yang memalukan</strong> — kalender regime (FR5) adalah obatnya.</p>
      </details>
      <details className="worked">
        <summary>Q4: Auto-retrain saat drift terdeteksi — boleh?</summary>
        <p><strong>Hampir tidak pernah fully-otomatis.</strong> Bahaya: melatih dengan data serangan (menormalkan serangan), data terkontaminasi label-lag, atau menutupi bug pipeline. Yang boleh otomatis: <em>recalibrasi threshold</em> dalam batas yang ditetapkan + <em>alert</em> ke manusia. Retrain = keputusan manusia dengan data mesin, bukan sebaliknya. <strong>Otomatisasi mempercepat eksekusi, bukan menghilangkan penilaian.</strong></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Mengapa random split TIDAK valid untuk validasi model fraud?"
        options={[
          "Terlalu lambat",
          "Data validasi mengandung pola dari periode yang sama dengan training — model 'mencontek masa depan', angka validasi bohong",
          "Tidak bisa dihitung",
          "Hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: kebocoran temporal. Validasi harus mensimulasikan 'menghadapi masa depan' — hanya time split yang jujur. Selisih 0,12 di contoh = ukuran kebohongan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. 'Device baru dulu 80% fraud, kini 30% fraud.' Ini jenis drift apa?"
        options={[
          "Data drift — P(x) berubah",
          "Concept drift — P(y|x) berubah: arti fitur yang sama berubah",
          "Label drift — P(y) berubah",
          "Bukan drift",
        ]}
        correct={1}
        explanation="Benar: concept drift. Fitur yang sama (device baru), makna yang berbeda. Model lama yang 'percaya' device baru = curiga akan salah arah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Apa yang membuat drift di fraud BERBEDA dari drift di domain lain (mis. prediksi cuaca)?"
        options={[
          "Tidak ada bedanya",
          "Adversarial adaptation — drift disengaja oleh lawan cerdas yang belajar dari modelmu; tiap kekalahan mereka = pelajaran gratis",
          "Drift fraud lebih lambat",
          "Drift fraud tidak bisa dideteksi",
        ]}
        correct={1}
        explanation="Benar: musuhnya adaptif. Cuaca tidak 'belajar' dari model prediksimu; penipu ya. Model statis = target latihan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. PSI = 0,31 pada distribusi skor model. Tindakan tepat?"
        options={[
          "Retrain otomatis sekarang juga",
          "Investigasi dulu: pahami apa yang berubah (wajar vs musuh), lalu putuskan — jangan retrain buta pada label yang belum matang",
          "Abaikan",
          "Matikan model",
        ]}
        correct={1}
        explanation="Benar: PSI = alarm asap, bukan perintah retrain. Retrain pada data serangan-berlabel-belum-matang bisa mengajari model bahwa serangan = normal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Pola serangan baru terdeteksi hari ini; label matang butuh 90 hari. Respons terbaik?"
        options={[
          "Tunggu 90 hari lalu retrain",
          "Rule darurat sekarang (tahan serangan) + investigasi + retrain setelah label matang",
          "Matikan semua pertahanan",
          "Naikkan threshold model lama",
        ]}
        correct={2}
        explanation="Benar: rule darurat = jembatan 90 hari. Menunggu = 90 hari kebobolan; retrain sekarang = label bohong. Lapisan pertahanan (FR5) memang dirancang untuk momen ini."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Random split tidak valid</strong> untuk fraud — pakai <strong>time-based split + embargo</strong>.</li>
          <li><strong>Tiga drift:</strong> concept (<Tex math={String.raw`P(y|x)`} />), data (<Tex math={String.raw`P(x)`} />), label (<Tex math={String.raw`P(y)`} />).</li>
          <li><strong>Adversarial adaptation:</strong> musuh belajar dari modelmu — siklus 2–6 bulan, selamanya.</li>
          <li><strong>PSI</strong> = alarm asap (&lt;0,1 aman; &gt;0,25 bertindak); investigasi sebelum retrain.</li>
          <li>Serangan baru → <strong>rule darurat dulu</strong>, retrain setelah label matang.</li>
          <li>Pertahanan awet: berlapis + randomisasi + fitur fisika yang tak bisa di-tune.</li>
          <li>Kapan TIDAK khawatir drift: pola stabil + retrain terjadwal + monitoring hijau — tapi tetap pantau.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr9-evaluasi" className="btn btn-secondary btn-sm">← FR9</Link>
        <Link href="/learn/fr11-threshold" className="btn btn-primary btn-sm">Next: FR11 →</Link>
      </div>
    </div>
  );
}
