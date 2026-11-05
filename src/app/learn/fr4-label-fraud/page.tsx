"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR4Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const lagData = [
    {
      x: ["0-7 hari", "8-30 hari", "31-60 hari", "61-90 hari", "91-120 hari", ">120 hari"],
      y: [12, 28, 25, 18, 10, 7],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["12%", "28%", "25%", "18%", "10%", "7%"],
      textposition: "outside",
    },
  ];

  const labelQualityData = [
    {
      x: ["Label bersih", "Label terlambat", "Label salah (noise)", "Tidak berlabel"],
      y: [35, 30, 10, 25],
      type: "bar",
      marker: { color: ["#7bc96f", "#e8a838", "#e05252", "#94a3b8"] },
      text: ["35%", "30%", "10%", "25%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Simulasi chargeback lag: label yang kamu lihat HARI INI belum lengkap!
import random
random.seed(42)

# 1000 transaksi, 2% fraud. Chargeback datang 7-120 hari kemudian.
lag_hari = [random.choice([7]*12 + [20]*28 + [45]*25 + [75]*18 + [105]*10 + [150]*7)
            for _ in range(20)]

def label_terlihat(hari_ini):
    # berapa fraud yang SUDAH ketahuan pada hari ke-hari_ini?
    return sum(1 for lag in lag_hari if lag <= hari_ini)

for h in [7, 30, 60, 90, 120, 150]:
    terlihat = label_terlihat(h)
    print(f"Hari ke-{h:3d}: terlihat {terlihat:2d}/20 fraud ({terlihat/20*100:4.0f}%)")
print()
print("COBA UBAH: latih model pada 'hari ke-30' (label 40% lengkap).")
print("Pelajaran: training data fraud SELALU undercounted.")
print("Model yang dilatih dari label mentah = belajar dari 'setengah kebenaran'.")
print("Solusi produksi: EMBARGO — label < 90 hari dianggap 'belum pasti'.")`;

  const lab2Code = `# PU Learning inti: dari 'positif + tak berlabel' tebak P(y=1|x)
# Skenario: 1000 transaksi. 30 berlabel FRAUD (positif pasti).
# 970 'tak berlabel' — sebagian sebenarnya fraud yang belum ketahuan.
import random
random.seed(7)

# Data: (skor_risiko, label) — label 1 = positif pasti, 0 = tak berlabel
positif = [(random.gauss(75, 10), 1) for _ in range(30)]
tak_berlabel = [(random.gauss(30, 15), 0) for _ in range(920)] + \
               [(random.gauss(75, 10), 0) for _ in range(50)]  # 50 fraud tersembunyi!
data = positif + tak_berlabel
random.shuffle(data)

# Estimasi naif: anggap semua tak-berlabel = negatif
# Hitung 'recall' pada data tak-berlabel berskor tinggi (>=60)
ambang = 60
positif_tertangkap = sum(1 for s, l in data if l == 1 and s >= ambang)
takberlabel_skor_tinggi = sum(1 for s, l in data if l == 0 and s >= ambang)
print(f"Positif berlabel & skor>={ambang}: {positif_tertangkap}")
print(f"Tak-berlabel tapi skor>={ambang}  : {takberlabel_skor_tinggi} <- kandidat fraud tersembunyi")
print()
print("COBA UBAH: ambang 60 -> 80 -> 50.")
print("Pelajaran PU: 'negatif' dalam data fraud = 'BELUM terbukti positif'.")
print("Skor tinggi + tak berlabel = prioritas investigasi, BUKAN vonis.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR4 — Fraud / ML Analytics</span>
        <h1 className="display-title">Masalah Label: Kebenaran<br />yang Datang Terlambat</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 99% Akurat yang Salah Total</a></li>
          <li><a href="#lag">Chargeback Lag: Label yang Baru Lengkap 4 Bulan Kemudian</a></li>
          <li><a href="#noise">Noisy Label: Saat &ldquo;Fraud&rdquo; Ternyata Bukan</a></li>
          <li><a href="#pu">PU Learning: Belajar dari &ldquo;Positif + Tak Berlabel&rdquo;</a></li>
          <li><a href="#strategi">Strategi Label: Embargo, Maturation &amp; Feedback Loop</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Chargeback Lag</a></li>
          <li><a href="#lab2">🔬 Lab 2: Inti PU Learning</a></li>
          <li><a href="#worked">📐 Worked Example: Label Lag &amp; Estimasi Prior</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Label adalah Konsensus, Bukan Kebenaran</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Label Seperti Apa, Strategi Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Strategi Pelabelan</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Dispute Kartu Kredit &amp; Friendly Fraud</a></li>

          <li><a href="#case">📋 Mini-Case: Training Data 6 Bulan Terakhir — Pakai atau Buang?</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Label Fraud</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>chargeback lag</strong> dan dampaknya pada training data (undercounted positives).</li>
          <li>Mengidentifikasi 3 sumber <strong>label noise</strong> dan cara mengukurnya.</li>
          <li>Menjelaskan ide inti <strong>PU learning</strong> (Positive-Unlabeled): kapan dipakai dan asumsinya.</li>
          <li>Merancang strategi labeling yang defensibel: <strong>embargo window, maturation, dan feedback loop</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model 99% Akurat yang Salah Total</h2>
      <div className="story">
        <p>Data scientist &ldquo;PayKu&rdquo; bangga: model fraud barunya akurasi 99,2% di data training Januari–Maret. Deploy April. Mei: chargeback meledak 3× lipat — model tidak menangkap apa pun. Investigasi menemukan: <strong>label &ldquo;bukan fraud&rdquo; di data training ternyata 40%-nya adalah fraud yang chargeback-nya belum datang</strong> saat data diekstrak.</p>
        <p>Model itu tidak belajar &ldquo;bedakan fraud vs normal&rdquo;. Ia belajar &ldquo;bedakan <em>fraud yang cepat ketahuan</em> vs <em>campuran normal + fraud yang belum ketahuan</em>&rdquo;. Akurasi 99,2% adalah ilusi — diukur terhadap label yang salah.</p>
        <p>Twist-nya: masalahnya <strong>bukan di model</strong> — arsitekturnya sudah benar (gradient boosting, tuning rapi). Masalahnya di <strong>label</strong>: kebenaran yang datang terlambat, sebagian salah, dan sebagian tidak pernah datang. Lesson ini tentang fondasi yang paling sering diremehkan dalam ML fraud: <strong>kualitas label menentukan segalanya</strong>.</p>
      </div>

      <h2 id="lag">Chargeback Lag: Label yang Baru Lengkap 4 Bulan Kemudian</h2>
      <p><strong>Definisi.</strong> Chargeback lag = jeda antara transaksi fraud terjadi dan label &ldquo;fraud&rdquo; resmi tercatat (pemilik kartu komplain → bank proses → chargeback masuk). Lag tipikal: <strong>30–120 hari</strong>.</p>
      <p><strong>Konsekuensinya untuk ML:</strong> jika kamu ekstrak training data hari ini, label untuk 3–4 bulan terakhir <strong>belum matang</strong> (immature). Transaksi berlabel &ldquo;normal&rdquo; di periode itu = campuran normal + fraud-yang-belum-ketahuan.</p>

      <PlotlyChart
        data={lagData}
        title="Distribusi Chargeback Lag: Kapan Fraud Ketahuan? (ilustrasi)"
        layout={{ xaxis: { title: "Jeda transaksi → chargeback" }, yaxis: { title: "% kasus fraud" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = jeda waktu, tinggi batang = persen kasus fraud yang ketahuan pada rentang itu.</p>
        <p><strong>Interpretasi:</strong> hanya 12% ketahuan dalam seminggu; <strong>35% butuh lebih dari 60 hari</strong>. Artinya label &ldquo;normal&rdquo; untuk 2 bulan terakhir adalah dusta statistik. <strong>Aturan praktis industri:</strong> label dianggap matang setelah ~90–120 hari (maturation window); data yang lebih muda = <em>jangan</em> dipakai sebagai &ldquo;negatif pasti&rdquo;.</p>
      </div>

      <p>Secara formal, yang terjadi adalah <strong>undercounting sistematis</strong>:</p>
      <Tex math={String.raw`\hat{P}(\text{fraud}) = P(\text{fraud terdeteksi}) < P(\text{fraud sebenarnya})`} block />
      <ul>
        <li><Tex math={String.raw`\hat{P}`} />: fraud rate yang <em>terlihat</em> di data (lebih kecil dari aslinya).</li>
        <li>Akibat: model <strong>underestimate risiko</strong> — threshold yang &ldquo;optimal&rdquo; di data mentah akan terlalu longgar di produksi.</li>
        <li>Lebih parah: undercounting-nya <strong>tidak acak</strong> — fraud yang lambat ketahuan (synthetic identity, first-party) lebih ter-undercount daripada card fraud. Model jadi bias ke pola yang cepat ketahuan.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data 6 bulan terakhir cukup untuk training — makin fresh makin bagus.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 3–4 bulan terakhir labelnya <em>belum matang</em>. &ldquo;Fresh&rdquo; tanpa maturation = melatih model dengan label bohong. Praktik benar: <strong>embargo</strong> — training hanya pakai data yang umurnya &gt; maturation window (mis. &gt;120 hari), dan data fresh dipakai untuk <em>validasi tertunda</em>, bukan training.</p>
      </div>

      <h2 id="noise">Noisy Label: Saat &ldquo;Fraud&rdquo; Ternyata Bukan</h2>
      <p>Label tidak hanya terlambat — kadang <strong>salah</strong>. Tiga sumber noise utama:</p>
      <ol>
        <li><strong>Friendly fraud terbalik:</strong> nasabah komplain &ldquo;tidak merasa transaksi&rdquo; padahal ia sendiri yang belanja (lupa / anaknya yang pakai HP) → transaksi normal berlabel fraud.</li>
        <li><strong>Investigator error:</strong> investigator lelah/melewatkan bukti → fraud berlabel normal, atau terlalu agresif → normal berlabel fraud. Error ini <strong>berkorelasi dengan workload</strong> (makin sibuk, makin banyak salah).</li>
        <li><strong>Rule legacy yang salah:</strong> label historis dari rule lama yang sudah terbukti over-agresif → &ldquo;kebenaran&rdquo; masa lalu sebenarnya adalah opini rule yang salah.</li>
      </ol>
      <p><strong>Cara mengukur noise:</strong> ambil sampel 200–500 kasus, label ulang oleh 2 investigator senior independen (blind review). Tingkat ketidaksepakatan = estimasi noise. Industri tipikal: <strong>5–15%</strong> label bermasalah. Kalau modelmu &ldquo;akurasi 99%&rdquo; tapi noise 10% — akurasi itu fiktif.</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dalam fraud ML, <strong>label adalah produk sampingan proses bisnis</strong> (chargeback, investigasi) — bukan &ldquo;kebenaran objektif&rdquo;. Setiap label membawa bias proses yang menghasilkannya. Analis senior selalu bertanya: <em>&ldquo;label ini lahir dari proses apa?&rdquo;</em> sebelum memakainya.</p>
      </div>

      <h2 id="pu">PU Learning: Belajar dari &ldquo;Positif + Tak Berlabel&rdquo;</h2>
      <p><strong>Definisi.</strong> PU Learning (Positive-Unlabeled) adalah setting ML di mana data terdiri dari: <strong>P</strong> = contoh positif yang pasti (fraud terkonfirmasi), dan <strong>U</strong> = contoh tak berlabel (campuran normal + fraud tersembunyi). Tidak ada &ldquo;negatif pasti&rdquo;.</p>
      <p><strong>Ide intinya</strong> (satu kalimat): perlakukan U sebagai negatif <em>sementara</em>, latih classifier <Tex math={String.raw`g(x) = P(s=1 \mid x)`} /> (peluang <em>berlabel</em>), lalu koreksi dengan faktor <Tex math={String.raw`c = P(s=1 \mid y=1)`} /> (peluang positif sejati sampai berlabel):</p>
      <Tex math={String.raw`P(y=1 \mid x) = \frac{P(s=1 \mid x)}{c}`} block />
      <ul>
        <li><Tex math={String.raw`y`} />: status sejati (1 = fraud). <Tex math={String.raw`s`} />: status berlabel (1 = ketahuan &amp; dilabel).</li>
        <li><Tex math={String.raw`c`} />: &ldquo;seberapa banyak fraud yang berhasil kita labeli&rdquo; — diestimasi dari data (mis. via validasi silang pada sampel berlabel).</li>
        <li><strong>Asumsi kunci (SCAR):</strong> peluang fraud ketahuan <em>tidak bergantung pada x</em> — contoh berlabel adalah sampel acak dari semua fraud. Kalau dilanggar (fraud besar lebih cepat ketahuan — dan memang begitu!), estimasi bias. Kenali batasnya.</li>
      </ul>
      <p><strong>Kapan dipakai:</strong> label positif sedikit &amp; tepercaya (hasil investigasi), sisanya tak berlabel. <strong>Kapan TIDAK:</strong> kalau kamu punya negatif yang benar-benar tepercaya (mis. transaksi yang lolos audit manual penuh) — maka supervised biasa lebih baik.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;PU learning = anggap semua tak-berlabel sebagai negatif.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> itu justru kesalahan yang diperbaiki PU learning. Menganggap U = negatif adalah <em>langkah awal sementara</em>; koreksi pembagi <Tex math={String.raw`c`} />-lah yang mengubah &ldquo;peluang berlabel&rdquo; menjadi &ldquo;peluang fraud sejati&rdquo;. Tanpa koreksi, model underestimate sistematis.</p>
      </div>

      <h2 id="strategi">Strategi Label: Embargo, Maturation &amp; Feedback Loop</h2>
      <p>Tiga praktik yang memisahkan tim fraud dewasa dari amatir:</p>
      <ol>
        <li><strong>Embargo window:</strong> data &lt; 90–120 hari tidak boleh jadi &ldquo;negatif&rdquo; di training. Boleh dipakai sebagai fitur (agregat), tidak boleh sebagai label.</li>
        <li><strong>Maturation re-labeling:</strong> label ditulis ulang berkala — transaksi &ldquo;normal&rdquo; 4 bulan lalu dicek ulang apakah chargeback-nya akhirnya datang. Training set adalah <em>living dataset</em>.</li>
        <li><strong>Feedback loop investigator (pratinjau FR14):</strong> setiap keputusan investigator (benar/salah) kembali sebagai label baru. Tanpa loop ini, model membeku pada pengetahuan lama sementara penipu berevolusi.</li>
      </ol>

      <PlotlyChart
        data={labelQualityData}
        title="Komposisi Label di Dataset Fraud Tipikal (ilustrasi)"
        layout={{ xaxis: { title: "Kategori label" }, yaxis: { title: "% data" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> 100% data training dipecah ke 4 kategori kualitas label.</p>
        <p><strong>Interpretasi:</strong> hanya <strong>35% label yang benar-benar bersih</strong>. 65% bermasalah (terlambat/salah/tak berlabel). <strong>Inilah kenapa &ldquo;tuning model&rdquo; sering sia-sia:</strong> kamu mengoptimasi arsitektur di atas fondasi yang 65%-nya goyang. Perbaiki label dulu, baru tuning model.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> data scientist junior bertanya &ldquo;model apa yang dipakai?&rdquo;; senior bertanya &ldquo;label ini dari mana?&rdquo;. Dalam fraud, <strong>ROI memperbaiki label hampir selalu lebih besar daripada ROI mengganti algoritma</strong> — karena semua algoritma minum dari sumur yang sama.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi Chargeback Lag</h2>
      <p>Rasakan sendiri bagaimana label &ldquo;hari ini&rdquo; menipumu.</p>
      <PyodideLab
        title="Lab 1 — Chargeback Lag: Label Belum Lengkap"
        hint="Ubah distribusi lag (mis. semua 7 hari vs semua 150 hari). Kapan 'label hari ke-30' bisa dipercaya? Itulah logika maturation window."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Inti PU Learning</h2>
      <PyodideLab
        title="Lab 2 — Positive-Unlabeled: Temukan Fraud Tersembunyi"
        hint="Ubah ambang 60 → 80 → 50. Amati trade-off: ambang tinggi = sedikit kandidat tapi yakin; ambang rendah = banyak kandidat tapi berisik. Ini logika antrian investigasi (FR11)."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung dengan Label yang Terlambat</h2>
      <p>Label fraud tidak seperti label gambar kucing — ia datang terlambat, sebagian salah, sebagian tidak pernah datang. Dua contoh menghadapinya secara kuantitatif.</p>

      <details className="worked">
        <summary>📐 Contoh 1: contamination window — kapan data &ldquo;bersih&rdquo; boleh dipakai training?</summary>
        <p>Bank mencatat: transaksi Januari 2026, chargeback (label fraud) masuk bertahap — 40% di Februari, 35% di Maret, 20% di April, 5% di Mei. Artinya <strong>label lag hingga 4 bulan</strong>.</p>
        <p><strong>Langkah 1 — tentukan contamination window.</strong> Jika hari ini 13 Oktober 2026 dan kamu training dengan data hingga September, maka transaksi Agustus–September masih &ldquo;terkontaminasi&rdquo;: sebagian fraud-nya belum berlabel (masih tercatat sebagai normal). Model akan belajar bahwa pola fraud = normal.</p>
        <p><strong>Langkah 2 — hitung koreksinya.</strong> Dari distribusi lag: transaksi berumur 1 bulan baru 40% labelnya masuk; umur 2 bulan 75%; umur 3 bulan 95%. Aturan praktis: <strong>pakai data yang umurnya ≥ 3× median lag</strong>. Median lag di sini ±2 bulan → training hanya sampai April 2026 (umur ≥ 6 bulan, 100% label masuk).</p>
        <p><strong>Langkah 3 — harga yang dibayar.</strong> Mengorbankan 6 bulan data terbaru = model tidak melihat pola serangan terkini. Solusinya bukan &ldquo;pakai saja data baru&rdquo;, melainkan <strong>dua jalur</strong>: model utama dari data matang (6+ bulan) + rule adaptif / model ringan dari sinyal terbaru untuk menangkap drift (FR10). Analis senior tidak memilih satu — ia mengoperasikan keduanya.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: PU learning — mengestimasi berapa fraud yang belum ketahuan</summary>
        <p>Dari 1.000.000 transaksi, 2.000 terkonfirmasi fraud (label positif), 998.000 &ldquo;normal&rdquo; (unlabeled — campuran normal asli + fraud yang lolos). Berapa fraud sebenarnya?</p>
        <p><strong>Langkah 1 — estimasi prior dengan sampel audit.</strong> Ambil 5.000 transaksi &ldquo;normal&rdquo; secara acak, investigasi manual mendalam: ditemukan 38 fraud yang lolos. Estimasi fraud tersembunyi = 38/5.000 = 0,76% dari unlabeled.</p>
        <p><strong>Langkah 2 — total estimasi.</strong> 0,0076 × 998.000 ≈ <strong>7.585 fraud tersembunyi</strong> + 2.000 terkonfirmasi = <strong>±9.585 fraud aktual</strong> (0,96% dari total) — hampir <strong>5× lipat</strong> dari yang tercatat!</p>
        <p><strong>Interpretasi:</strong> angka ini artinya dua hal. Pertama, <em>recall operasionalmu</em> hanya 2.000/9.585 = 21% — dari 5 fraud, 4 lolos. Kedua, <strong>training dengan label mentah berarti 7.585 pola fraud diajarkan sebagai &ldquo;normal&rdquo;</strong> — modelmu disabotase oleh datanya sendiri. Inilah alasan teknik PU learning / noise-robust ada: bukan kemewahan akademik, tapi koreksi atas realitas lapangan.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Label adalah Konsensus, Bukan Kebenaran</h2>
      <p>Bayangkan 3 dokter mendiagnosis 1 pasien — mereka tidak selalu sepakat. Label fraud sama: <strong>ia adalah opini profesional yang didokumentasikan</strong>, bukan hasil lab yang objektif. Investigator A (5 tahun pengalaman, baru saja menangani kasus serupa) dan investigator B (6 bulan, lelah lembur) bisa memberi label berbeda untuk kasus yang sama — dan <em>keduanya</em> masuk ke training data-mu.</p>
      <p>Intuisi kedua: <strong>label adalah aset termahal dalam ML fraud</strong>. Satu label investigator = Rp25–50rb + waktu tunggu berminggu-minggu. Dataset 10.000 label = Rp250–500jt + 3 bulan. Maka setiap keputusan tentang label adalah keputusan <em>investasi</em>: label mana yang paling berharga? Jawabannya: <strong>label di daerah abu-abu</strong> (skor model 0,3–0,7) — bukan yang sudah jelas. Melabel yang sudah jelas = membayar untuk informasi yang sudah kamu miliki.</p>
      <p><strong>Kapan strategi label ini TIDAK berlaku:</strong> (1) untuk <strong>first-party fraud</strong> — label &ldquo;dispute&rdquo; bukan label &ldquo;fraud&rdquo;; campurkan keduanya dan modelmu menghukum pelanggan setia; (2) saat <strong>definisi berubah</strong> (kebijakan baru tentang apa itu fraud) — label lama harus di-audit ulang, bukan dipakai mentah; (3) untuk <strong>serangan baru</strong> — tidak ada label, jangan tunggu; pakai unsupervised + rule sementara (FR8, FR5).</p>
      <div className="myth">
        <p><strong>🚨 Mitos lapangan:</strong> &ldquo;Makin banyak label, makin bagus model.&rdquo;<br /><strong>Yang benar:</strong> 1.000 label <em>bersih &amp; di daerah abu-abu</em> mengalahkan 100.000 label <em>kotor &amp; bias seleksi</em>. Kualitas label = kualitas definisi + kualitas investigator + kualitas sampling. Kuantitas tanpa ketiganya = sampah yang mahal.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Label Seperti Apa, Strategi Apa</h2>

      <div className="decision-card">
        <h3>1. Label positif sedikit tapi tepercaya (hasil investigasi) → <strong>PU learning</strong></h3>
        <p><strong>Kondisi:</strong> 500 fraud terkonfirmasi, 10 juta transaksi tak berlabel.</p>
        <p><strong>Kenapa:</strong> tidak ada negatif pasti; PU learning mengoreksi bias &ldquo;anggap semua negatif&rdquo;.</p>
        <p><strong>Contoh nyata:</strong> deteksi mule — sedikit rekening terkonfirmasi, sisanya tak berlabel.</p>
      </div>

      <div className="decision-card">
        <h3>2. Ada negatif tepercaya (audit manual penuh) → <strong>supervised biasa + embargo</strong></h3>
        <p><strong>Kondisi:</strong> sampel transaksi diaudit menyeluruh (dipastikan normal).</p>
        <p><strong>Kenapa:</strong> negatifnya valid — supervised standar bekerja, asal data &lt; maturation window di-embargo.</p>
        <p><strong>Contoh nyata:</strong> card fraud dengan program audit chargeback yang disiplin.</p>
      </div>

      <div className="decision-card">
        <h3>3. Noise tinggi (&gt;10% label salah) → <strong>perbaiki proses label dulu</strong></h3>
        <p><strong>Kondisi:</strong> blind review menunjukkan investigator sering salah / rule legacy over-agresif.</p>
        <p><strong>Kenapa:</strong> model apa pun yang dilatih di atas noise 10%+ = sampah terstruktur. ROI label &gt; ROI model.</p>
        <p><strong>Contoh nyata:</strong> kalibrasi ulang guideline investigator + double-review untuk kasus ambigu.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tidak ada label sama sekali (produk baru) → <strong>mulai unsupervised + rule (FR5, FR8)</strong></h3>
        <p><strong>Kondisi:</strong> peluncuran fitur pembayaran baru, nol histori fraud.</p>
        <p><strong>Kenapa:</strong> tidak ada yang bisa dipelajari secara supervised. Mulai dari rule pakar + anomaly detection, kumpulkan label via investigator, <em>lalu</em> latih supervised.</p>
        <p><strong>Contoh nyata:</strong> QRIS cross-border baru — 3 bulan pertama full rule-based.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tanya <strong>&ldquo;label ini lahir dari proses apa?&rdquo;</strong> sebelum pakai.</li>
          <li>Embargo 90–120 hari: data muda ≠ negatif pasti.</li>
          <li>Ukur noise via blind review — jangan percaya akurasi di atas label kotor.</li>
          <li>Tidak ada label → unsupervised + rule dulu, kumpulkan label, baru supervised.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Dari Mana Label Datang?</h2>
      <p>Label punya &ldquo;pabrik&rdquo; yang berbeda-beda — dan tiap pabrik punya biasnya sendiri:</p>
      <p><strong>Skenario A — label dari chargeback nasabah.</strong> Murah &amp; otomatis, tapi bias ke <em>third-party fraud nominal besar</em> (yang kecil tidak dilaporkan nasabah) dan tercemar <em>friendly fraud</em> (nasabah berbohong). Cocok untuk: model deteksi card fraud prioritas. Tidak cocok untuk: first-party fraud (pelakunya justru yang melapor!).</p>
      <p><strong>Skenario B — label dari investigator.</strong> Paling akurat, tapi mahal (Rp25–50rb per review) dan bias ke <em>apa yang sistem flag</em> — investigator hanya melabel yang masuk antrian (selection bias). Model yang dilatih dari sini buta terhadap fraud yang tidak pernah di-flag. Koreksinya: <strong>selipkan sampel acak</strong> 5–10% ke antrian review untuk mengukur blind spot.</p>
      <p><strong>Skenario C — label dari konfirmasi merchant / data eksternal.</strong> Misal daftar kartu curian dari jaringan bank. Presisi tinggi, tapi <em>coverage</em> rendah dan datang terlambat berminggu-minggu. Cocok untuk: validasi &amp; kalibrasi, bukan training utama.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Label adalah kebenaran (ground truth).&rdquo;<br /><strong>Yang benar:</strong> label adalah <strong>opini investigator dengan delay dan bias seleksi</strong>. Dua investigator bisa tidak sepakat 10–20% kasus (disagreement rate normal). Model yang &ldquo;100% akurat terhadap label&rdquo; justru mencurigakan — ia menghafal bias investigator, bukan memahami fraud. Perlakukan label sebagai <em>perkiraan terbaik yang tersedia</em>, bukan kitab suci.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: 30% Dispute Ternyata &ldquo;Friendly&rdquo;</h2>
      <p>Bank penerbit kartu di Indonesia mencatat pola berulang tiap awal tahun: lonjakan dispute kartu kredit untuk transaksi travel &amp; elektronik 2–4 bulan sebelumnya. Investigasi mendalam menunjukkan komposisi yang mengejutkan banyak analis junior:</p>
      <p>Dari 1.000 dispute yang masuk, setelah investigasi: <strong>~550 third-party fraud asli</strong> (kartu dibobol), <strong>~300 friendly fraud</strong> (nasabah sendiri yang bertransaksi lalu menyangkal — &ldquo;lupa&rdquo;, &ldquo;tidak kenal merchant&rdquo;, atau buyer's remorse), <strong>~150 sengketa layanan murni</strong> (barang tidak datang, bukan fraud sama sekali).</p>
      <p><strong>Implikasi untuk pelabelan:</strong> jika semua 1.000 dispute otomatis dilabel &ldquo;fraud&rdquo;, maka 45% labelmu salah kategori — model belajar pola orang lupa &amp; kecewa sebagai pola pencurian. Tiga perlakuan berbeda yang benar: third-party → label fraud + blokir pola; friendly → label <em>first-party</em> terpisah (FR1) + edukasi/blacklist lunak; sengketa layanan → <strong>bukan label fraud</strong>, teruskan ke CS.</p>
      <p><strong>Jejak pembeda friendly vs third-party</strong> (fitur untuk FR6): friendly fraud biasanya dari <em>device &amp; alamat yang sama</em> dengan histori normal nasabah, nominal wajar, dan ada pola pemakaian sebelum sangkalan. Third-party: device baru, velocity aneh, alamat kirim asing. Label yang tidak membedakan keduanya = model yang menghukum pelanggan setia.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> kualitas label menentukan <em>batas atas</em> kualitas modelmu — model tidak bisa lebih pintar dari gurunya. Satu jam memperbaiki definisi label (apa itu fraud vs sengketa vs friendly) lebih berdampak daripada satu minggu tuning hyperparameter.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Training Data 6 Bulan Terakhir — Pakai atau Buang?</h2>
      <div className="callout">
        <p>Kamu mewarisi proyek model fraud di fintech &ldquo;PayKu&rdquo;. Data scientist sebelumnya melatih dengan <strong>seluruh data 6 bulan terakhir</strong> (termasuk 2 bulan terakhir), tanpa embargo. Akurasi validasi 99,2%. Di produksi, chargeback naik 3×.</p>
        <p>Data: 2 juta transaksi, 8.000 berlabel fraud. Blind review 300 sampel: 12% label salah. Chargeback lag median 45 hari.</p>
        <p><strong>Pertanyaan:</strong> (a) Apa 3 cacat fatal pipeline label ini? (b) Rancang ulang strategi training data (spesifik: window apa, perlakuan apa untuk 2 bulan terakhir?).</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tiga cacat:</strong> (1) <em>Tidak ada embargo</em> — 2 bulan terakhir (lag median 45 hari) penuh &ldquo;negatif palsu&rdquo;; (2) <em>Noise 12% tidak ditangani</em> — akurasi 99,2% fiktif, model belajar dari label salah; (3) <em>Tidak ada maturation re-labeling</em> — label dianggap final saat diekstrak.</p>
          <p>(b) <strong>Rancangan ulang:</strong> training = data berumur &gt;120 hari saja (matang). 2 bulan terakhir: <strong>jangan</strong> dipakai sebagai negatif — perlakukan sebagai <em>unlabeled</em> (PU learning) atau pakai hanya untuk monitoring drift. Terapkan blind review berkala untuk mengukur noise, dan perbaiki guideline investigator untuk 12% error itu. Validasi = time-based split (FR10), bukan random split.</p>
          <p><strong>Pelajaran:</strong> model tidak pernah lebih jujur dari labelnya. Perbaiki sumur sebelum menyalahkan pompa.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Label Fraud</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak label yang &ldquo;cukup&rdquo; untuk melatih model?</summary>
        <p>Aturan praktis: <strong>minimal 200–500 positif per kelas</strong> untuk model tabular sederhana; 1.000+ untuk GBM yang stabil. Tapi yang lebih penting dari jumlah: <em>keterwakilan</em> — 500 label yang mencakup semua pola (card, ATO, mule) &gt; 5.000 label yang semuanya card fraud. Jika satu pola tidak terwakili di label, model buta terhadapnya <em>selamanya</em> — audit distribusi label per pola tiap kuartal.</p>
      </details>
      <details className="worked">
        <summary>Q2: Siapa yang seharusnya memberi label — investigator senior atau junior?</summary>
        <p><strong>Keduanya, dengan peran beda:</strong> junior melabel volume (dengan SOP ketat + QA sampling), senior menangani <em>kasus abu-abu &amp; banding</em> + menjadi &ldquo;wasit&rdquo; saat junior tidak sepakat. Yang berbahaya: semua label dari 1–2 orang (bias individu menjadi &ldquo;kebenaran&rdquo; model) atau semua dari junior tanpa QA (noise). Diversifikasi pelabel = diversifikasi sudut pandang = model lebih robust.</p>
      </details>
      <details className="worked">
        <summary>Q3: Label lag 4 bulan — bagaimana model bisa &ldquo;up to date&rdquo;?</summary>
        <p>Dengan <strong>arsitektur dua kecepatan</strong> (FR4 worked example 1): model utama dari data matang (label lengkap, 6+ bulan) untuk stabilitas + lapisan adaptif (rule, model ringan, threshold dinamis) dari sinyal terbaru untuk respons. Jangan pernah &ldquo;mempercepat&rdquo; label dengan menebak — label tebakan = racun yang terlihat seperti data. Terima lag sebagai fakta fisika, rancang sistem di sekitarnya.</p>
      </details>
      <details className="worked">
        <summary>Q4: Bolehkah memakai label sintetis / data augmentation untuk fraud?</summary>
        <p><strong>Hati-hati besar.</strong> Augmentasi yang valid: <em>variasi teknis</em> dari pola yang sudah dipahami (misal nominal ±10%). Yang berbahaya: <em>menciptakan pola baru</em> dari imajinasi — model belajar halusinasi-mu, bukan dunia. Untuk imbalance, prefer <strong>class weighting</strong> (FR7) daripada SMOTE buta — weighting tidak menciptakan data palsu, hanya mengubah insentif.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Chargeback lag median 45 hari. Kamu ekstrak training data kemarin. Apa masalah terbesarnya?"
        options={[
          "Data terlalu sedikit",
          "Label 1-3 bulan terakhir belum matang — banyak 'negatif' sebenarnya fraud yang belum ketahuan",
          "Model akan overfitting",
          "Tidak ada masalah",
        ]}
        correct={1}
        explanation="Benar: immature labels. Transaksi 1-3 bulan terakhir yang berlabel 'normal' = campuran normal + fraud-yang-chargeback-nya-belum-datang. Solusi: embargo 90-120 hari."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam PU learning, apa peran faktor koreksi c = P(s=1|y=1)?"
        options={[
          "Menghapus data tak berlabel",
          "Mengubah 'peluang berlabel' menjadi 'peluang fraud sejati' — mengoreksi bias undercounting",
          "Menambah jumlah positif",
          "Tidak ada peran",
        ]}
        correct={1}
        explanation="Benar: c mengoreksi. Classifier awal hanya memprediksi P(berlabel|x); dibagi c menjadi P(fraud|x) sejati. Tanpa koreksi = underestimate sistematis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Blind review 300 sampel menunjukkan 12% label salah. Tindakan paling tepat?"
        options={[
          "Ganti ke model yang lebih kompleks",
          "Perbaiki proses labeling dulu (guideline, double-review) — ROI label > ROI model",
          "Hapus 12% data itu",
          "Abaikan, 12% kecil",
        ]}
        correct={1}
        explanation="Benar: perbaiki label dulu. Model apa pun di atas noise 12% = sampah terstruktur. Mengganti algoritma tanpa memperbaiki label = mengoptimasi ilusi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Produk pembayaran baru, nol histori fraud. Strategi awal terbaik?"
        options={[
          "Langsung latih supervised dengan label dummy",
          "Rule pakar + unsupervised anomaly detection; kumpulkan label via investigator; baru latih supervised",
          "Tunggu 1 tahun sampai ada label",
          "Tidak perlu deteksi",
        ]}
        correct={1}
        explanation="Benar: mulai dari rule + unsupervised. Supervised butuh label; tanpa label, paksa supervised = fiksi. Kumpulkan label lewat operasi, lalu naik kelas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. 'Maturation re-labeling' artinya…"
        options={[
          "Menunggu data menjadi basi",
          "Menulis ulang label berkala — transaksi 'normal' lama dicek ulang apakah chargeback-nya akhirnya datang",
          "Menghapus label lama",
          "Mengganti investigator",
        ]}
        correct={1}
        explanation="Benar: label adalah living dataset. Chargeback yang datang 4 bulan kemudian harus memperbarui label historis — kalau tidak, training set membeku dalam kebohongan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Chargeback lag</strong> (30–120 hari) membuat label 3–4 bulan terakhir belum matang → undercounted positives.</li>
          <li><strong>Embargo 90–120 hari</strong>: data muda boleh jadi fitur, tidak boleh jadi label &ldquo;negatif pasti&rdquo;.</li>
          <li><strong>Noisy label</strong> (5–15% tipikal): ukur via blind review; perbaiki proses sebelum tuning model.</li>
          <li><strong>PU learning</strong>: <Tex math={String.raw`P(y=1|x) = P(s=1|x)/c`} /> — untuk positif sedikit-tepercaya + sisanya tak berlabel; waspadai asumsi SCAR.</li>
          <li><strong>Label = produk sampingan proses bisnis</strong>, bukan kebenaran objektif. Tanya selalu: label ini lahir dari proses apa?</li>
          <li>ROI memperbaiki label &gt; ROI mengganti algoritma. Perbaiki sumur sebelum menyalahkan pompa.</li>
          <li>Kapan TIDAK pakai supervised: nol label (mulai unsupervised+rule) atau noise &gt;~15% (perbaiki dulu).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr3-data-fraud" className="btn btn-secondary btn-sm">← FR3</Link>
        <Link href="/learn/fr5-rule-based" className="btn btn-primary btn-sm">Next: FR5 →</Link>
      </div>
    </div>
  );
}
