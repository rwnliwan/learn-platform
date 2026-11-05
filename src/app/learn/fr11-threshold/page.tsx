"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR11Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const queueData = [
    {
      x: ["Skor 0,9+", "Skor 0,7-0,9", "Skor 0,5-0,7", "Skor 0,3-0,5", "Skor <0,3"],
      y: [82, 54, 28, 11, 3],
      type: "bar",
      marker: { color: ["#e05252", "#e05252", "#e8a838", "#2a7de1", "#94a3b8"] },
      text: ["82%", "54%", "28%", "11%", "3%"],
      textposition: "outside",
    },
  ];

  const capacityData = [
    {
      x: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
      y: [4200, 2600, 1500, 800, 380, 150, 50],
      type: "scatter",
      mode: "lines+markers",
      name: "Alert/hari",
      line: { color: "#e8a838", width: 3 },
      marker: { size: 8 },
    },
  ];

  const lab1Code = `# Antrian optimal: review dari skor TERTINGGI dulu (prioritas)
# 500 alert, kapasitas 100 review. Bandingkan: acak vs prioritas skor.
import random
random.seed(29)

# (skor, is_fraud). Skor tinggi ~ fraud (model lumayan).
alerts = [(random.gauss(0.75, 0.15) if random.random() < 0.25 else random.gauss(0.3, 0.15),
           1 if random.random() < 0.25 else 0) for _ in range(500)]
# perbaiki: fraud cenderung skor tinggi
alerts = []
for _ in range(500):
    is_f = random.random() < 0.25
    s = random.gauss(0.75, 0.15) if is_f else random.gauss(0.3, 0.15)
    alerts.append((max(0, min(1, s)), is_f))

KAPASITAS = 100
acak = random.sample(alerts, KAPASITAS)
prioritas = sorted(alerts, reverse=True)[:KAPASITAS]

tp_acak = sum(a[1] for a in acak)
tp_prior = sum(a[1] for a in prioritas)
print(f"Review ACAK        : {tp_acak} fraud tertangkap dari 100 review")
print(f"Review PRIORITAS   : {tp_prior} fraud tertangkap dari 100 review")
print(f"Peningkatan        : {(tp_prior/max(tp_acak,1)-1)*100:.0f}%")
print()
print("COBA UBAH: KAPASITAS 100 -> 30 (tim super sibuk).")
print("Selisih makin BESAR! Pelajaran: makin terbatas kapasitas,")
print("makin berharga prioritas yang benar. Inilah inti queue optimization.")`;

  const lab2Code = `# Threshold optimal dari kapasitas: cari ambang dgn alert <= kapasitas & recall maks
import random
random.seed(31)

# 20.000 transaksi/hari, 40 fraud. Skor model.
data = [(random.gauss(0.8, 0.12), 1) for _ in range(40)] + \
       [(random.gauss(0.25, 0.15), 0) for _ in range(19960)]

KAPASITAS_PER_HARI = 800  # 10 investigator x 80 review

def stats(ambang):
    flagged = [(s, y) for s, y in data if s >= ambang]
    tp = sum(y for _, y in flagged)
    return len(flagged), tp / 40 * 100

print(f"{'Ambang':>6s} {'Alert':>6s} {'Recall':>7s}  Status")
terbaik = None
for a in [0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.8]:
    n, r = stats(a)
    ok = "✅ muat" if n <= KAPASITAS_PER_HARI else "❌ jebol"
    print(f"{a:6.2f} {n:6d} {r:6.1f}%  {ok}")
    if n <= KAPASITAS_PER_HARI and (terbaik is None or r > terbaik[1]):
        terbaik = (a, r)
print(f"\nAmbang optimal: {terbaik[0]} (recall {terbaik[1]:.1f}% dalam kapasitas)")
print()
print("COBA UBAH: KAPASITAS 800 -> 200.")
print("Ambang optimal NAIK, recall TURUN. Pelajaran pahit tapi jujur:")
print("kapasitas menentukan recall MAKSIMAL yang bisa kamu klaim.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR11 — Fraud / ML Analytics</span>
        <h1 className="display-title">Threshold &amp; Kapasitas:<br />Matematika Antrian Investigator</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 2.125 Alert, 10 Manusia</a></li>
          <li><a href="#kontrak">Threshold = Kontrak dengan Kapasitas</a></li>
          <li><a href="#antrian">Prioritas Antrian: Skor Tertinggi Dulu</a></li>
          <li><a href="#biaya">Threshold dari Biaya: Rumus Ambang Optimal</a></li>
          <li><a href="#sla">SLA &amp; Aging: Antrian yang Menua</a></li>
          <li><a href="#lab1">🔬 Lab 1: Prioritas vs Acak</a></li>
          <li><a href="#lab2">🔬 Lab 2: Ambang Optimal dari Kapasitas</a></li>
          <li><a href="#worked">📐 Worked Example: Threshold dari Kurva &amp; Kapasitas</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Threshold adalah Anggaran Belanja</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Kebijakan Antrian</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Threshold Dinamis</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Weekend Attack &amp; Antrian Meledak</a></li>

          <li><a href="#case">📋 Mini-Case: Weekend Attack — Antrian Meledak</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Threshold</a></li>

          <li><a href="#latihan">Latihan Mandiri: Anggaran Threshold</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung <strong>alert rate maksimal</strong> dari kapasitas investigator dan menurunkan threshold yang sesuai.</li>
          <li>Merancang <strong>prioritas antrian</strong> (skor tertinggi dulu) dan mengukur peningkatannya.</li>
          <li>Menurunkan <strong>threshold optimal dari matriks biaya</strong> dengan rumus eksplisit.</li>
          <li>Merancang kebijakan <strong>SLA dan aging</strong> antrian yang realistis.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 2.125 Alert, 10 Manusia</h2>
      <div className="story">
        <p>Senin pagi di &ldquo;BankMega&rdquo;. Model baru (Vendor A dari FR9!) menghasilkan <strong>2.125 alert</strong> dalam 24 jam. Tim: 10 investigator, masing-masing sanggup 80 review/hari = <strong>800 slot</strong>. Pukul 11 siang, antrian sudah 1.400. Pukul 3 sore, investigator mulai <strong>melewatkan alert tanpa membaca</strong> — &ldquo;yang penting antrian bergerak.&rdquo;</p>
        <p>Ironisnya: di antara alert yang dilewati tanpa dibaca ada <strong>17 kasus fraud Rp1,1 juta</strong> — yang justru <em>ditangkap</em> model tapi <em>dibuang</em> manusia. Model bekerja; sistem mati. Bukan karena modelnya bodoh — tapi karena <strong>tidak ada yang menghitung kapasitas sebelum menentukan threshold</strong>.</p>
        <p>Twist-nya: solusinya bukan &ldquo;tambah investigator&rdquo; (mahal, lambat) — melainkan <strong>matematika</strong>: threshold yang tepat + antrian berprioritas. Dengan dua itu, 800 slot yang sama menangkap <strong>lebih banyak</strong> fraud daripada 2.125 alert yang berantakan. Lesson ini: <strong>fraud detection adalah masalah antrian, bukan sekadar masalah klasifikasi</strong>.</p>
      </div>

      <h2 id="kontrak">Threshold = Kontrak dengan Kapasitas</h2>
      <p>Hubungan fundamental yang sering diabaikan:</p>
      <Tex math={String.raw`\text{Alert/hari} = \text{Alert Rate}(\tau) \times \text{Volume} \leq \text{Kapasitas}`} block />
      <ul>
        <li><Tex math={String.raw`\tau`} />: threshold skor model.</li>
        <li><Tex math={String.raw`\text{Alert Rate}(\tau)`} />: % transaksi dengan skor ≥ <Tex math={String.raw`\tau`} /> — <strong>turun</strong> saat <Tex math={String.raw`\tau`} /> naik.</li>
        <li><strong>Kapasitas</strong> = investigator × review per orang per hari.</li>
      </ul>
      <p><strong>Prosedur menentukan threshold:</strong></p>
      <ol>
        <li>Hitung kapasitas: 10 orang × 80 = <strong>800 review/hari</strong>.</li>
        <li>Hitung alert rate maks: 800 ÷ 50.000 = <strong>1,6%</strong>.</li>
        <li>Dari kurva validasi, cari <Tex math={String.raw`\tau`} /> dengan alert rate ≤ 1,6% dan <strong>recall maksimal</strong>.</li>
        <li>Itulah threshold-mu. Bukan 0,5. Bukan &ldquo;yang AUC-nya bagus&rdquo;.</li>
      </ol>

      <PlotlyChart
        data={capacityData}
        title="Alert/hari vs Threshold (volume 50.000/hari)"
        layout={{ xaxis: { title: "Threshold" }, yaxis: { title: "Alert per hari" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = threshold (makin kanan = makin ketat), sumbu Y = alert yang dihasilkan per hari.</p>
        <p><strong>Interpretasi:</strong> threshold 0,3 → 4.200 alert/hari (5× kapasitas — kematian). Threshold 0,5 → 800 (pas!). Threshold 0,7 → 150 (kapasitas menganggur — fraud lolos sia-sia). <strong>Garis hidup-mati ada di 800</strong>: threshold adalah kenop yang memutar antara &ldquo;banjir&rdquo; dan &ldquo;kekeringan&rdquo;.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Threshold 0,5 itu standar — tinggal pakai.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 0,5 tidak tahu berapa investigatormu, berapa volumu, berapa biaya FP/FN-mu. Threshold adalah <strong>keputusan operasional</strong> yang diturunkan dari kapasitas dan biaya — bukan konstanta matematika. (Lihat juga FR7.)</p>
      </div>

      <h2 id="antrian">Prioritas Antrian: Skor Tertinggi Dulu</h2>
      <p>Kapasitas terbatas + alert berlebih = <strong>tidak semua alert bisa direview</strong>. Pertanyaannya bukan &ldquo;review semua&rdquo; (mustahil) tapi &ldquo;<strong>review yang mana dulu</strong>&rdquo;.</p>
      <p><strong>Aturan: urutkan antrian menurun berdasarkan skor (atau lift)</strong> — investigator selalu mengerjakan yang paling &ldquo;padat fraud&rdquo; dulu:</p>

      <PlotlyChart
        data={queueData}
        title="Hit Rate per Bucket Skor (%, ilustrasi)"
        layout={{ xaxis: { title: "Bucket skor" }, yaxis: { title: "Hit rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = sekelompok alert dengan rentang skor, tingginya = % yang benar fraud saat direview.</p>
        <p><strong>Interpretasi:</strong> bucket 0,9+ punya hit rate <strong>82%</strong> — hampir tiap review berbuah. Bucket &lt;0,3 cuma 3% — 97% waktu terbuang. <strong>Jika kapasitas hanya 100 dari 500 alert: ambil 100 teratas = panen 82-an; ambil 100 acak = panen ~25.</strong> Prioritas bukan &ldquo;optimasi kecil&rdquo; — ia melipatgandakan hasil kapasitas yang sama.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanpa prioritas, kapasitas terbuang di &ldquo;ekor&rdquo; antrian yang miskin fraud. Dengan prioritas, <strong>setiap slot investigator dihabiskan di tempat dengan expected value tertinggi</strong>. Ini adalah <em>knapsack problem</em>: maksimalkan fraud tertangkap dengan budget slot terbatas — solusinya selalu &ldquo;urutkan by value density&rdquo;.</p>
      </div>

      <h2 id="biaya">Threshold dari Biaya: Rumus Ambang Optimal</h2>
      <p>Dari FR7, threshold optimal meminimalkan biaya. Bentuk tertutupnya (untuk skor yang terkalibrasi sebagai probabilitas <Tex math={String.raw`p`} />):</p>
      <Tex math={String.raw`\tau^* = \frac{C_{FP}}{C_{FP} + C_{FN}}`} block />
      <ul>
        <li><Tex math={String.raw`C_{FP}`} />: biaya satu false positive (review sia-sia).</li>
        <li><Tex math={String.raw`C_{FN}`} />: biaya satu false negative (fraud lolos).</li>
        <li><strong>Tahan/transaksi</strong> jika <Tex math={String.raw`p > \tau^*`} /> — yaitu jika <em>expected loss</em> melebihi <em>expected cost review</em>.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh pengerjaan</summary>
        <p><Tex math={String.raw`C_{FP}`} /> = Rp25 rb, <Tex math={String.raw`C_{FN}`} /> = Rp1,1 jt.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`\tau^* = 25.000 / (25.000 + 1.100.000) = 0{,}022`} />.<br />
        <strong>Langkah 2</strong> — tahan jika peluang fraud &gt; <strong>2,2%</strong> — jauh di bawah 0,5!<br />
        <strong>Langkah 3</strong> — tapi cek kapasitas: jika alert rate pada 0,022 melebihi kapasitas, <strong>kapasitas menang</strong> — naikkan <Tex math={String.raw`\tau`} /> sampai muat (kendala operasional mengalahkan optimum teoretis).</p>
        <p><strong>Hierarki keputusan:</strong> (1) hitung <Tex math={String.raw`\tau^*`} /> dari biaya, (2) cek muat kapasitas, (3) jika tidak muat, naikkan sampai muat — dan <strong>laporkan</strong> &ldquo;recall yang dikorbankan karena kapasitas&rdquo; sebagai dasar minta tambah investigator.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Threshold optimal dari rumus biaya selalu bisa dipakai.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> rumus itu mengabaikan <strong>kendala kapasitas</strong>. <Tex math={String.raw`\tau^* = 0{,}022`} /> bisa menghasilkan 4.200 alert/hari untuk tim 800 slot — optimum teoretis yang tidak bisa dieksekusi = bukan optimum. Optimasi yang benar: <strong>minimalkan biaya DENGAN kendala alert ≤ kapasitas</strong>.</p>
      </div>

      <h2 id="sla">SLA &amp; Aging: Antrian yang Menua</h2>
      <p>Alert bukan barang awet — <strong>nilai investigasi meluruh seiring waktu</strong>:</p>
      <ul>
        <li><strong>SLA per bucket:</strong> skor 0,9+ → review &lt;1 jam; 0,7–0,9 → &lt;4 jam; 0,5–0,7 → &lt;24 jam. Skor tinggi = uang bergerak cepat = harus cepat.</li>
        <li><strong>Aging:</strong> alert &gt;48 jam yang belum direview → <strong>auto-eskalasi atau auto-release dengan catatan</strong>. Antrian yang dibiarkan menua = kuburan alert.</li>
        <li><strong>Cherry-picking guard:</strong> investigator cenderung memilih &ldquo;kasus mudah&rdquo; — sistem harus <strong>mengunci urutan prioritas</strong> (tidak bisa loncat ke bawah tanpa selesaikan atas).</li>
      </ul>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> antrian fraud seperti <strong>UGD rumah sakit</strong>: triase (skor) menentukan siapa ditangani dulu, bukan siapa datang dulu. &ldquo;First come first served&rdquo; di UGD = pasien kritis mati menunggu. Di fraud = uang hilang menunggu.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Prioritas vs Acak</h2>
      <p>Ukur sendiri nilai pengurutan antrian.</p>
      <PyodideLab
        title="Lab 1 — Queue Prioritization"
        hint="Ubah KAPASITAS 100 → 30. Makin sempit kapasitas, makin besar keunggulan prioritas — buktikan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Ambang Optimal dari Kapasitas</h2>
      <PyodideLab
        title="Lab 2 — Threshold = Fungsi Kapasitas"
        hint="Ubah KAPASITAS 800 → 200. Lihat ambang optimal naik dan recall turun. Itulah 'harga' kapasitas yang kecil."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Memilih Threshold Seperti Profesional</h2>
      <p>Threshold bukan angka tebakan — ia hasil perhitungan dari kurva validasi dan kendala operasional. Dua contohnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: membaca kurva alert-rate vs recall</summary>
        <p>Dari data validasi (skor model terkalibrasi), tim membuat tabel kandidat threshold:</p>
        <p>τ = 0,01 → alert rate 4,2%, recall 94%. τ = 0,03 → alert rate 2,4%, recall 88%. τ = 0,05 → alert rate 1,5%, recall 79%. τ = 0,10 → alert rate 0,7%, recall 61%. τ = 0,20 → alert rate 0,25%, recall 38%.</p>
        <p><strong>Langkah 1 — terapkan kendala kapasitas.</strong> Volume 50.000 trx/hari, 10 investigator × 80 review/hari = 800 review/hari = alert rate maksimal <strong>1,6%</strong>. Kandidat τ = 0,01 dan 0,03 <em>gugur</em> — bukan karena jelek, tapi karena <strong>tidak bisa dioperasikan</strong>.</p>
        <p><strong>Langkah 2 — pilih recall maksimal di sisa kandidat.</strong> τ = 0,05 (recall 79%) mengalahkan τ = 0,10 (61%). <strong>Threshold operasional = 0,05.</strong></p>
        <p><strong>Langkah 3 — bandingkan dengan threshold teoretis.</strong> Rumus biaya (FR7) memberi τ* = 0,022 — di bawah 0,05. Artinya: secara biaya, kita <em>ingin</em> lebih agresif (recall 88%), tapi kapasitas tidak mengizinkan. <strong>Threshold final = max(τ* biaya, τ kapasitas)</strong> — biaya bilang 0,022, kapasitas bilang 0,05, maka 0,05. Pelajaran: threshold adalah <em>negosiasi</em> antara matematika biaya dan realitas SDM — dan pemenangnya adalah yang lebih ketat.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: dua threshold — auto-block, review, auto-approve</summary>
        <p>Satu threshold membuang informasi: skor 0,06 dan skor 0,95 diperlakukan sama (&ldquo;review&rdquo;). Desain yang lebih baik memakai <strong>dua ambang</strong>:</p>
        <p><strong>Langkah 1 — tentukan τ_block.</strong> Dari kurva: pada τ = 0,70, precision = 82% — dari 100 yang diblokir, 82 benar fraud. Biaya 18 kesalahan blokir (kompensasi + CS) masih jauh di bawah nilai 82 fraud dicegah. → <strong>skor ≥ 0,70: auto-block</strong>.</p>
        <p><strong>Langkah 2 — tentukan τ_review.</strong> τ = 0,05 dari contoh 1 (batas kapasitas). → <strong>0,05 ≤ skor &lt; 0,70: review manual</strong>.</p>
        <p><strong>Langkah 3 — sisanya.</strong> Skor &lt; 0,05: <strong>auto-approve</strong> — tapi <em>catat &amp; sampling</em> 0,1% untuk audit blind spot (FR4).</p>
        <p><strong>Hasil operasional:</strong> dari 50.000 trx/hari: ~120 auto-block (precision 82%), ~680 review (pas kapasitas 800), sisanya lewat. Investigator tidak lagi membuang waktu untuk skor 0,95 yang &ldquo;sudah jelas&rdquo; — <strong>dua threshold mengubah antrian dari FIFO menjadi triage medis</strong>: yang kritis langsung operasi, yang sedang observasi, yang sehat pulang.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Threshold adalah Anggaran Belanja</h2>
      <p>Setiap threshold adalah <strong>anggaran belanja</strong>: &ldquo;dengan 800 slot review/hari, di mana kita belanjakan?&rdquo; Menaikkan threshold = memotong anggaran (lebih sedikit ditangkap, lebih hemat). Menurunkan = menambah belanja (lebih banyak ditangkap, lebih mahal). <strong>Tidak ada threshold yang &ldquo;benar&rdquo; — hanya ada alokasi yang bisa dipertanggungjawabkan.</strong> Dan seperti anggaran, ia harus ditinjau berkala — karena &ldquo;harga&rdquo; (biaya review, nilai fraud) berubah.</p>
      <p>Intuisi kedua: <strong>threshold yang baik tidak terlihat</strong> — nasabah legit tidak pernah tahu ia ada, penjahat merasa &ldquo;sial terus&rdquo;. Threshold yang buruk terlihat dari dua sisi: nasabah komplain diblokir (terlalu ketat) atau fraud merajalela (terlalu longgar). <strong>Keluhan adalah metrik threshold</strong> — monitor rasio komplain blokir sebagai sinyal, bukan sekadar gangguan.</p>
      <p><strong>Kapan satu threshold TIDAK cukup:</strong> (1) <strong>segmen dengan ekonomi berbeda</strong> (Rp50rb vs Rp50jt — worked example FR7); (2) <strong>kondisi serangan vs normal</strong> (mode darurat); (3) <strong>kanal dengan UX berbeda</strong> (QRIS tatap muka vs transfer online — biaya false positive-nya beda jauh). Setiap perbedaan ekonomi yang material = kandidat threshold terpisah. Tapi batasi: <strong>maksimal 3–5 threshold</strong> — lebih dari itu tidak ada yang bisa menjelaskan sistemnya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dokumentasikan setiap threshold dalam satu kalimat: <strong>&ldquo;0,05 karena kapasitas 800/hari; direview tiap kuartal; pemilik: [nama].&rdquo;</strong> Threshold tanpa pemilik = angka yatim yang tidak ada yang berani ubah — bahkan saat sudah jelas salah.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Kebijakan Antrian</h2>

      <div className="decision-card">
        <h3>1. Kapasitas cukup (alert ≤ 70% kapasitas) → <strong>threshold dari biaya (τ*)</strong></h3>
        <p><strong>Kenapa:</strong> kendala tidak mengikat — pakai optimum teoretis.</p>
        <p><strong>Contoh nyata:</strong> tim 20 orang, alert 800/hari → τ* = 0,022 bisa jalan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Kapasitas ketat (alert &gt; kapasitas) → <strong>naikkan threshold sampai muat + prioritas ketat</strong></h3>
        <p><strong>Kenapa:</strong> banjir alert = investigator mogok = sistem mati. Lebih baik sedikit tapi dikerjakan.</p>
        <p><strong>Laporkan:</strong> &ldquo;recall yang dikorbankan&rdquo; sebagai dasar pengajuan tambah headcount.</p>
      </div>

      <div className="decision-card">
        <h3>3. Serangan massal (volume alert meledak 10×) → <strong>mode darurat: bucket atas saja + auto-hold</strong></h3>
        <p><strong>Kenapa:</strong> saat serangan, prioritas ekstrem — selamatkan yang terbesar dulu.</p>
        <p><strong>Contoh nyata:</strong> weekend attack: hanya skor 0,9+ direview manual, sisanya auto-hold 24 jam.</p>
      </div>

      <div className="decision-card">
        <h3>4. Alert menua &gt;SLA → <strong>eskalasi atau release tercatat</strong></h3>
        <p><strong>Kenapa:</strong> antrian basi = keputusan basi. Lebih baik lepas dengan catatan daripada menumpuk.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Hitung kapasitas <strong>dulu</strong>, baru tentukan threshold.</li>
          <li>Antrian selalu <strong>terurut skor menurun</strong> — kunci agar tak bisa cherry-pick.</li>
          <li><Tex math={String.raw`\tau^* = C_{FP}/(C_{FP}+C_{FN})`} />, lalu cek muat kapasitas.</li>
          <li>Laporkan &ldquo;recall yang dikorbankan kapasitas&rdquo; — itu amunisi budget, bukan kegagalan.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Satu Threshold Tidak Cukup</h2>
      <p>Threshold global itu seperti satu ukuran sepatu untuk semua orang. Tiga skenario yang butuh lebih:</p>
      <p><strong>Skenario A — threshold per segmen nominal.</strong> Transaksi Rp50rb vs Rp50jt punya C_FN berbeda 1.000× lipat — rumus τ* (FR7) memberi ambang berbeda. Praktik: 3 tier (mikro &lt; Rp500rb: longgar; menengah: standar; besar &gt; Rp10jt: ketat). <em>Jangan</em> buat 50 segmen — tiap segmen butuh data validasi sendiri, dan segmen kecil = threshold tidak stabil.</p>
      <p><strong>Skenario B — threshold dinamis mengikuti serangan.</strong> Saat serangan terkoordinasi terdeteksi (flag rate naik 5× dalam 1 jam), turunkan threshold sementara 50% selama 4 jam — <em>mode darurat</em>. Ini kebalikan dari intuisi (&ldquo;kan kapasitas terbatas?&rdquo;): saat serangan, <strong>P(fraud|flag) naik drastis</strong> (FR2, contoh Bayes) sehingga tiap slot review jauh lebih berharga. Setelah serangan reda, kembalikan. Tanpa mode darurat, sistem &ldquo;tenang&rdquo; saat seharusnya &ldquo;siaga&rdquo;.</p>
      <p><strong>Skenario C — threshold vs kapasitas: negosiasi kuartalan.</strong> Jika threshold kapasitas (0,05) jauh lebih ketat dari threshold biaya (0,022), selisihnya = <strong>uang yang tertinggal di meja</strong>: fraud yang <em>menguntungkan untuk ditangkap</em> tapi tidak tertangkap karena kurang investigator. Hitung nilainya dalam rupiah (FR9) dan bawa ke direksi sebagai <em>business case</em> tambah headcount — bukan keluhan, tapi proposal investasi.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> threshold bukan angka sakti yang &ldquo;ditemukan&rdquo; sekali lalu abadi — ia <strong>kontrak dengan kapasitas</strong> yang dinegosiasi ulang tiap kuartal, tiap ada serangan, tiap ada perubahan biaya. Tim yang me-review threshold-nya berkala mengalahkan tim dengan model lebih bagus tapi threshold usang.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Serangan Sabtu Dini Hari</h2>
      <p>Pola yang dikenali tim fraud beberapa bank Indonesia: serangan terkoordinasi <strong>Sabtu 01.00–05.00</strong> — jam dengan investigator paling sedikit (shift malam weekend = 3 orang vs 15 di jam kerja).</p>
      <p><strong>Anatomi serangan (ilustratif):</strong> 02.10: 400 kartu curian mulai dipakai serentak, pola sama (e-commerce, nominal Rp1,8–2,2jt). Sistem dengan threshold normal mem-flag 380 → antrian 3 investigator langsung penuh (kapasitas 240/jam). 02.40: antrian 900+, SLA jebol. 03.00: pelaku sudah meraup ±Rp700jt sebelum tim darurat bangun.</p>
      <p><strong>Yang seharusnya terjadi (mode darurat threshold):</strong> (1) <strong>detektor serangan</strong>: flag rate &gt; 3× baseline 30 menit → otomatis aktifkan mode darurat; (2) <strong>threshold darurat</strong>: τ_block sementara diturunkan + pola serangan (merchant + nominal + jam yang sama) jadi rule auto-block sementara; (3) <strong>on-call</strong>: investigator cadangan dipanggil otomatis, bukan menunggu seseorang &ldquo;sadar&rdquo;.</p>
      <p><strong>Pelajaran:</strong> penjahat <em>membaca jadwal shiftmu</em> — mereka menyerang saat pertahanan paling tipis. Threshold statis = pertahanan yang tidak tahu hari Sabtu ada. Sistem yang baik punya <strong>dua kepribadian</strong>: tenang di hari kerja, siaga di jam sepi. Dan kepribadian siaga itu = threshold dinamis + detektor serangan + on-call — bukan sekadar angka.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Threshold 0,5 itu netral dan adil.&rdquo;<br /><strong>Yang benar:</strong> 0,5 hanya &ldquo;netral&rdquo; jika biaya salah positif = biaya salah negatif — yang <em>tidak pernah</em> terjadi di fraud (selisihnya 40×+). Threshold 0,5 di fraud bukan netral — ia <strong>keputusan bisnis yang ekstrem</strong> (sangat permisif) yang diambil tanpa sadar. Setiap threshold adalah keputusan; pastikan ia keputusan yang disengaja.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Weekend Attack — Antrian Meledak</h2>
      <div className="callout">
        <p>Sabtu 02:00, &ldquo;PayKu&rdquo; diserang carding massal: 12.000 alert dalam 6 jam (normal: 800/hari). Tim weekend: 4 investigator × 80 = <strong>320 slot/hari</strong>. Skor alert: 300 di antaranya &gt;0,9 (rata-rata loss Rp2 jt), 2.700 di 0,7–0,9 (Rp800 rb), sisanya &lt;0,7 (Rp300 rb).</p>
        <p><strong>Pertanyaan:</strong> rancang respons 24 jam: siapa direview, siapa auto-hold, siapa dilepas? Hitung ekspektasi uang terselamatkan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Prioritas ketat:</strong> 300 alert &gt;0,9 → review manual dulu (300 slot, sisa 20). Ekspektasi: hit rate bucket 0,9+ ≈ 82% → ~246 fraud × Rp2 jt = <strong>Rp492 jt terselamatkan</strong>.</p>
          <p><strong>Bucket 0,7–0,9 (2.700):</strong> tidak muat direview — <strong>auto-hold 24 jam</strong> (transaksi ditahan sementara, bukan dilepas!). Ini &ldquo;penyelamatan pasif&rdquo;: uang tidak hilang selama hold. Senin tim penuh (800 slot) melanjutkan.</p>
          <p><strong>Bucket &lt;0,7 (9.000):</strong> lepas dengan pencatatan + pantau velocity susulan. Expected loss per kasus kecil (Rp300 rb × hit rate 11% ≈ Rp33 rb) — biaya review (Rp25 rb) hampir setara; prioritas rendah dibenarkan.</p>
          <p><strong>Pelajaran:</strong> mode darurat = <strong>triage UGD</strong>: kritis ditangani, sedang distabilkan (hold), ringan diobservasi. Tanpa rencana ini, 4 investigator akan tenggelam di 12.000 alert acak dan kehilangan Rp492 jt yang &ldquo;mudah&rdquo; itu.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Threshold</h2>
      <details className="worked">
        <summary>Q1: Siapa yang seharusnya menentukan threshold — data scientist atau bisnis?</summary>
        <p><strong>Bersama, dengan peran jelas:</strong> data scientist menghitung <em>kandidat &amp; trade-off</em> (&ldquo;0,03 → recall 88%, butuh 1.200 review/hari&rdquo;); bisnis memutuskan <em>berdasarkan kendala nyata</em> (&ldquo;kita cuma punya 800&rdquo;). Yang gagal: data scientist menentukan sendirian (tidak tahu kendala operasional) atau bisnis menentukan tanpa data (tebak-tebakan). <strong>Threshold = titik temu matematika &amp; realitas.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: Seberapa sering threshold harus di-review?</summary>
        <p><strong>Kuartalan rutin + insidental saat pemicu:</strong> perubahan biaya (gaji investigator naik), perubahan volume (±20%), serangan besar, atau model baru deploy. Review = 1 jam: lihat kurva terbaru, cek apakah asumsi masih valid, putuskan ubah/tetap + catat alasannya. <strong>Threshold yang tidak pernah di-review = keputusan lama yang mengatur dunia baru.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Auto-block — kapan aman, kapan berbahaya?</summary>
        <p><strong>Aman jika tiga syarat:</strong> (1) precision di ambang itu &gt; 80% <em>stabil 90 hari</em>, (2) ada <strong>jalur banding cepat</strong> (&lt; 1 jam) untuk korban salah blokir, (3) <strong>nilai per keputusan terbatas</strong> atau asuransi menanggung. <strong>Berbahaya untuk:</strong> first-party (butuh penilaian niat), nasabah korporat (satu kesalahan = kontrak hilang), dan pola baru. Aturan: <em>otomatisasi yang jelas, manusia untuk yang abu-abu</em> (FR14).</p>
      </details>
      <details className="worked">
        <summary>Q4: Apakah threshold bisa &ldquo;tidak adil&rdquo; ke segmen tertentu?</summary>
        <p><strong>Bisa — dan harus diaudit.</strong> Threshold global bisa mem-flag segmen tertentu (misal pekerja malam, daerah tertentu) secara tidak proporsional. Audit: bandingkan <em>flag rate &amp; precision per segmen</em> tiap kuartal. Jika satu segmen di-flag 5× lipat dengan precision sama rendahnya → <strong>threshold per-segmen atau fitur yang lebih adil</strong> dibutuhkan. Ini bukan sekadar etika — di beberapa yurisdiksi, ini <em>hukum</em>.</p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Anggaran Threshold</h2>
      <p><strong>1.</strong> Volume 30.000 trx/hari, 8 investigator x 70 review/hari. Berapa alert rate maksimal? Jika kurva validasi: τ=0,04 → alert 2,1% recall 84%; τ=0,07 → alert 1,2% recall 72%. Threshold mana yang operasional?</p>
      <p><strong>2.</strong> C_FP=Rp20rb, C_FN=Rp2jt. Hitung τ* teoretis. Jika τ kapasitas = 0,06, berapa threshold final — dan apa artinya bagi direksi?</p>
      <p><strong>3.</strong> Rancang 2-threshold untuk QRIS tatap muka: kapan auto-block vs review vs approve? Pertimbangkan biaya false positive di kasir.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Kapasitas = 560/hari → alert rate maks = 560/30.000 = <strong>1,87%</strong>. τ=0,04 gugur (2,1% &gt; 1,87%). <strong>τ=0,07 operasional</strong> (recall 72%). Pelajaran: <em>kapasitas memveto matematika</em>.</p>
        <p><strong>2.</strong> τ* = 20.000/2.020.000 ≈ <strong>0,0099</strong>. Final = max(0,0099; 0,06) = <strong>0,06</strong>. Artinya: secara biaya kita <em>ingin</em> agresif, tapi SDM tidak cukup — <strong>selisihnya = business case tambah investigator</strong> (hitung rupiahnya!).</p>
        <p><strong>3.</strong> QRIS tatap muka: false positive = <strong>mempermalukan nasabah di kasir</strong> (mahal!). Maka: auto-block hanya untuk skor ekstrem (≥0,85, precision &gt;90%); sisanya <strong>approve-then-review</strong> (FR13) — jangan tahan orang di kasir. Threshold = f(ekonomi + UX).</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 10 investigator × 80 review/hari, volume 50.000 trx/hari. Alert rate maksimal dan artinya?"
        options={[
          "10% — bebas",
          "1,6% — threshold harus dipilih agar alert ≤800/hari; threshold adalah kontrak dengan kapasitas",
          "0,1% — seketat mungkin",
          "Tidak ada batas",
        ]}
        correct={1}
        explanation="Benar: 800/50.000 = 1,6%. Threshold yang menghasilkan alert di atas ini = investigator mogok = sistem mati. Kapasitas menentukan threshold, bukan sebaliknya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kapasitas 100 dari 500 alert. Mana yang menangkap fraud lebih banyak?"
        options={[
          "100 acak",
          "100 skor tertinggi — tiap slot dihabiskan di tempat expected value tertinggi (knapsack)",
          "100 pertama datang",
          "Sama saja",
        ]}
        correct={1}
        explanation="Benar: prioritas. Bucket atas hit rate 82% vs rata-rata ~25% — prioritas melipatgandakan hasil kapasitas yang sama. Makin sempit kapasitas, makin besar keunggulannya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. C_FP=Rp25rb, C_FN=Rp1,1jt. Threshold optimal teoretis?"
        options={[
          "0,5",
          "τ* = 25.000/(25.000+1.100.000) ≈ 0,022 — tahan jika peluang fraud >2,2%",
          "0,9",
          "0,1",
        ]}
        correct={1}
        explanation="Benar: 0,022. Tahan jika expected loss (p × 1,1jt) > expected cost review (25rb). Tapi tetap cek muat kapasitas — kendala operasional mengalahkan optimum teoretis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Alert >48 jam belum direview. Kebijakan terbaik?"
        options={[
          "Biarkan — nanti juga direview",
          "Auto-eskalasi atau auto-release tercatat — antrian basi = keputusan basi",
          "Hapus diam-diam",
          "Prioritaskan yang lama dulu (FIFO)",
        ]}
        correct={1}
        explanation="Benar: eskalasi/release tercatat. Nilai investigasi meluruh; menumpuk = kuburan alert. FIFO salah — UGD tidak melayani yang datang dulu, tapi yang paling kritis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Investigator cenderung memilih 'kasus mudah' (cherry-picking). Solusi sistem?"
        options={[
          "Percayakan saja",
          "Kunci urutan prioritas — tidak bisa loncat ke bawah tanpa selesaikan atas; ukur kepatuhan",
          "Hapus kasus sulit",
          "Kurangi gaji",
        ]}
        correct={1}
        explanation="Benar: kunci urutan. Cherry-picking menghancurkan matematika prioritas — sistem harus menegakkan disiplin antrian, bukan mengandalkan niat baik."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Threshold = kontrak kapasitas:</strong> alert rate(τ) × volume ≤ investigator × review/orang.</li>
          <li><strong>Antrian terurut skor menurun</strong> — knapsack: maksimalkan hasil per slot terbatas.</li>
          <li><strong>Threshold optimal:</strong> <Tex math={String.raw`\tau^* = C_{FP}/(C_{FP}+C_{FN})`} />, lalu <strong>cek muat kapasitas</strong>.</li>
          <li><strong>SLA per bucket + aging:</strong> skor tinggi = cepat; alert basi = eskalasi/release tercatat.</li>
          <li><strong>Kunci urutan</strong> — cegah cherry-picking yang merusak prioritas.</li>
          <li>Laporkan &ldquo;recall yang dikorbankan kapasitas&rdquo; sebagai amunisi budget headcount.</li>
          <li>Kapan TIDAK pakai threshold ketat: kapasitas longgar — pakai τ* dari biaya dan panen maksimal.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr10-drift" className="btn btn-secondary btn-sm">← FR10</Link>
        <Link href="/learn/fr12-graph-analytics" className="btn btn-primary btn-sm">Next: FR12 →</Link>
      </div>
    </div>
  );
}
