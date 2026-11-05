"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR5Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const hitRateData = [
    {
      x: ["R1: velocity", "R2: device baru", "R3: nominal besar", "R4: lokasi aneh", "R5: jam aneh", "R6: merchant baru"],
      y: [34, 28, 12, 22, 8, 15],
      type: "bar",
      marker: { color: "#e8a838" },
      text: ["34%", "28%", "12%", "22%", "8%", "15%"],
      textposition: "outside",
    },
  ];

  const tradeoffData = [
    {
      x: [1, 2, 3, 5, 8, 12, 20],
      y: [4, 9, 15, 26, 38, 52, 68],
      type: "scatter",
      mode: "lines+markers",
      name: "Detection rate (%)",
      marker: { color: "#e05252" },
    },
    {
      x: [1, 2, 3, 5, 8, 12, 20],
      y: [1, 2, 4, 9, 18, 32, 55],
      type: "scatter",
      mode: "lines+markers",
      name: "False positive (%)",
      marker: { color: "#2a7de1" },
    },
  ];

  const lab1Code = `# Rule engine mini: velocity rule + hit rate
# Data sintetis: 2000 transaksi (40 fraud). Rule: tahan jika >=N trx/jam
import random
random.seed(11)

# velocity per transaksi (fraud cenderung tinggi)
data = [(random.gauss(12, 4), 1) for _ in range(40)] + \
       [(random.gauss(2.5, 1.5), 0) for _ in range(1960)]
random.shuffle(data)

def evaluasi(ambang):
    ditahan = [(v, y) for v, y in data if v >= ambang]
    tp = sum(y for _, y in ditahan)
    fp = len(ditahan) - tp
    det = tp / 40 * 100                    # detection rate (recall)
    hit = tp / len(ditahan) * 100 if ditahan else 0  # hit rate (precision)
    return det, hit, len(ditahan)

print(f"{'Ambang':>6s} {'Ditahan':>7s} {'Detect%':>7s} {'Hit%':>6s}")
for a in [3, 5, 7, 9, 12]:
    d, h, n = evaluasi(a)
    print(f">={a:4d}/jam {n:7d} {d:6.1f}% {h:5.1f}%")
print()
print("COBA UBAH: ambang 5 -> 4 -> 6.")
print("Pelajaran: ambang RENDAH = tangkap banyak tapi hit rate anjlok")
print("(investigator tenggelam). Ambang TINGGI = presisi bagus tapi banyak lolos.")
print("Tidak ada ambang 'benar' — hanya trade-off. Pilih sesuai kapasitas (FR11).")`;

  const lab2Code = `# Champion vs Challenger: uji rule baru TANPA risiko produksi
# Champion: rule lama (ambang 5). Challenger: rule baru (ambang 5 + device baru).
import random
random.seed(23)

data = [(random.gauss(12, 4), random.choice([0,1]), 1) for _ in range(40)] + \
       [(random.gauss(2.5, 1.5), random.choice([0,1]), 0) for _ in range(1960)]
# (velocity, device_baru, is_fraud). Catatan: device_baru acak di sini disederhanakan.
random.shuffle(data)

def champion(d):   return d[0] >= 5
def challenger(d): return d[0] >= 5 and d[1] == 1

for nama, rule in [("Champion ", champion), ("Challenger", challenger)]:
    flagged = [d for d in data if rule(d)]
    tp = sum(d[2] for d in flagged)
    det = tp / 40 * 100
    hit = tp / len(flagged) * 100 if flagged else 0
    print(f"{nama}: ditahan={len(flagged):4d}  detect={det:5.1f}%  hit={hit:5.1f}%")
print()
print("COBA UBAH: challenger tambah syarat 'velocity >= 7'.")
print("Pelajaran: challenger diuji SHADOW (tidak menahan beneran) dulu.")
print("Naik produksi HANYA jika detect naik & hit tidak anjlok signifikan.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR5 — Fraud / ML Analytics</span>
        <h1 className="display-title">Rule-Based: Senjata Pertama<br />yang Tak Pernah Pensiun</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rule 3 Baris yang Mengalahkan Model Rp500 Juta</a></li>
          <li><a href="#anatomi">Anatomi Rule: Kondisi, Aksi, dan Prioritas</a></li>
          <li><a href="#velocity">Velocity: Rule Paling Mematikan</a></li>
          <li><a href="#hitrate">Hit Rate: Metrik Kejujuran Sebuah Rule</a></li>
          <li><a href="#tuning">Tuning: Seni Menggeser Ambang</a></li>
          <li><a href="#champion">Champion-Challenger: Cara Aman Mengganti Senjata</a></li>
          <li><a href="#lab1">🔬 Lab 1: Velocity Rule + Trade-off Ambang</a></li>
          <li><a href="#lab2">🔬 Lab 2: Champion vs Challenger</a></li>
          <li><a href="#worked">📐 Worked Example: Hit Rate, Tuning &amp; Champion-Challenger</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Rule adalah Bahasa, Bukan Sekadar Filter</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Rule Kapan, ML Kapan</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Siklus Hidup Rule</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Rule Velocity Membunuh Promo 11.11</a></li>

          <li><a href="#case">📋 Mini-Case: 6 Rule, Kapasitas 200 Review/Hari</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Rule-Based</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Merancang <strong>rule fraud</strong> yang lengkap: kondisi, aksi, prioritas, dan expiry.</li>
          <li>Menghitung <strong>hit rate</strong> dan menjelaskan trade-off-nya dengan detection rate.</li>
          <li>Melakukan <strong>tuning ambang</strong> berdasarkan kapasitas investigasi, bukan feeling.</li>
          <li>Menjalankan framework <strong>champion-challenger</strong> untuk mengganti rule dengan aman.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Rule 3 Baris yang Mengalahkan Model Rp500 Juta</h2>
      <div className="story">
        <p>Fintech &ldquo;BayarKu&rdquo; menghabiskan Rp500 juta membangun model ML fraud — 6 bulan kerja, 40 fitur, AUC 0,97. Minggu pertama produksi: model menangkap 12% fraud. Sementara itu, analis senior menulis rule 3 baris di sore hari: <em>&ldquo;Tahan jika &gt;5 transaksi/jam dari device baru ke merchant baru&rdquo;</em> — menangkap <strong>34%</strong> fraud sendirian.</p>
        <p>Bagaimana bisa? Model 0,97 AUC itu dilatih dengan label 4 bulan terakhir yang belum matang (FR4!) — ia belajar pola basi. Rule 3 baris itu lahir dari <strong>pengalaman investigator kemarin sore</strong>: &ldquo;serangan warming selalu begini polanya.&rdquo;</p>
        <p>Twist-nya: 2 tahun kemudian, rule 3 baris itu masih jalan — dimodifikasi 40×, tapi tidak pernah dimatikan. Model Rp500 juta sudah diganti 3×. Lesson ini: <strong>rule-based bukan &ldquo;teknologi kuno sebelum ML&rdquo; — ia adalah lapisan pertahanan yang tak tergantikan</strong>, dan analis yang bisa merancangnya adalah aset paling mahal di tim fraud.</p>
      </div>

      <h2 id="anatomi">Anatomi Rule: Kondisi, Aksi, dan Prioritas</h2>
      <p>Rule yang profesional punya 5 komponen — bukan sekadar &ldquo;jika X maka tahan&rdquo;:</p>
      <ol>
        <li><strong>Kondisi (condition):</strong> predikat yang bisa dievaluasi real-time. Contoh: <code className="inline">velocity_1h &gt; 5 AND device_age_days &lt; 7</code>.</li>
        <li><strong>Aksi (action):</strong> <em>block</em> (tolak), <em>hold</em> (tahan + review), <em>step-up</em> (minta verifikasi tambahan), <em>monitor</em> (catat saja).</li>
        <li><strong>Prioritas:</strong> urutan evaluasi. Rule &ldquo;block&rdquo; yang murah dievaluasi dulu; rule mahal (panggil API eksternal) belakangan.</li>
        <li><strong>Expiry / review date:</strong> setiap rule <strong>wajib</strong> punya tanggal kedaluwarsa review. Rule tanpa expiry = bom waktu (penipu sudah adaptasi, rule masih menahan nasabah normal).</li>
        <li><strong>Owner &amp; alasan:</strong> siapa yang membuat, berdasarkan kasus apa. Tanpa ini, 2 tahun kemudian tidak ada yang berani mematikan rule &ldquo;keramat&rdquo;.</li>
      </ol>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> aksi rule adalah <strong>spektrum gesekan</strong>, bukan biner tahan/lolos. <em>Step-up</em> (OTP tambahan) untuk skor menengah sering lebih optimal daripada <em>block</em>: menangkap fraud tanpa mengusir nasabah legit. Desain aksi = desain pengalaman nasabah.</p>
      </div>

      <h2 id="velocity">Velocity: Rule Paling Mematikan</h2>
      <p><strong>Definisi.</strong> Velocity = jumlah/​nilai transaksi dalam jendela waktu: <code className="inline">count_1h</code>, <code className="inline">sum_24h</code>, <code className="inline">distinct_merchant_10m</code>. Kenapa mematikan? Karena <strong>penipu berpacu dengan waktu</strong> — kartu curian harus dikuras sebelum diblokir; mule harus meneruskan sebelum hold. Kecepatan adalah sidik jari universal serangan.</p>
      <p><strong>Varian velocity yang penting:</strong></p>
      <ul>
        <li><strong>Count velocity:</strong> &gt;N transaksi per jam. Menangkap carding (uji kartu massal) dan warming.</li>
        <li><strong>Amount velocity:</strong> total &gt;RpX per 24 jam. Menangkap pengurasan.</li>
        <li><strong>Distinct-counterparty velocity:</strong> transfer ke &gt;N rekening berbeda per jam. Menangkap fan-out mule.</li>
        <li><strong>Velocity relatif:</strong> 5× lipat dari baseline user (bukan angka absolut!). Karyawan dengan gaji Rp50 juta/tahun yang tiba-tiba transfer Rp40 juta = anomali walau &ldquo;kecil&rdquo; secara absolut.</li>
      </ul>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Velocity rule = batasi N transaksi per jam untuk semua orang.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ambang absolut buta konteks — pedagang pasar yang terima 50 QRIS/jam adalah normal, tapi akun pribadi dengan 50 transfer/jam adalah mule. <strong>Velocity harus relatif terhadap baseline</strong> (per user, per segmen): <Tex math={String.raw`\text{flag jika } v_t > k \cdot \bar{v}_{\text{user}}`} /> dengan <Tex math={String.raw`k`} /> mis. 5. Inilah jembatan ke FR6 (baseline per user).</p>
      </div>

      <h2 id="hitrate">Hit Rate: Metrik Kejujuran Sebuah Rule</h2>
      <p>Dua metrik mengukur sebuah rule — dan keduanya bertentangan:</p>
      <Tex math={String.raw`\text{Hit Rate} = \frac{TP}{\text{total ditahan}} \quad (= \text{presisi rule})`} block />
      <Tex math={String.raw`\text{Detection Rate} = \frac{TP}{\text{total fraud}} \quad (= \text{recall rule})`} block />
      <ul>
        <li><strong>Hit rate</strong> menjawab: &ldquo;dari yang ditahan rule ini, berapa % yang <em>benar</em> fraud?&rdquo; — inilah yang dirasakan investigator. Hit rate 8% = dari 100 review, 92 sia-sia.</li>
        <li><strong>Detection rate</strong> menjawab: &ldquo;dari semua fraud, berapa % yang tertangkap rule ini?&rdquo;</li>
      </ul>

      <PlotlyChart
        data={hitRateData}
        title="Hit Rate 6 Rule Produksi (%, ilustrasi)"
        layout={{ xaxis: { title: "Rule" }, yaxis: { title: "Hit rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = satu rule, tingginya = hit rate (presisi).</p>
        <p><strong>Interpretasi:</strong> R1 (velocity, 34%) dan R2 (device baru, 28%) adalah tulang punggung — presisi tinggi. R5 (jam aneh, 8%) nyaris sampah: 92% review-nya sia-sia. <strong>Keputusan dewasa:</strong> jangan hapus R5 mentah-mentah — <em>kombinasikan</em> (&ldquo;jam aneh AND device baru&rdquo;) atau turunkan aksinya dari <em>hold</em> jadi <em>monitor</em>. Rule jelek sendirian bisa jadi fitur bagus dalam kombinasi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> hit rate &lt;10% bukan vonis mati — ia adalah <strong>sinyal harga</strong>. Rule itu &ldquo;mahal&rdquo; (menghabiskan kapasitas investigator). Pertanyaannya bukan &ldquo;bagus/jelek?&rdquo; melainkan &ldquo;<strong>apakah detection yang diberikannya sepadan dengan kapasitas yang dimakannya?</strong>&rdquo; — persis logika FR11.</p>
      </div>

      <h2 id="tuning">Tuning: Seni Menggeser Ambang</h2>
      <p>Tuning rule = memilih ambang pada kurva trade-off:</p>

      <PlotlyChart
        data={tradeoffData}
        title="Trade-off Ambang Velocity: Detection vs False Positive"
        layout={{ xaxis: { title: "Ambang (trx/jam)" }, yaxis: { title: "%" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu X = ambang rule (makin kanan = makin ketat). Garis merah = detection rate, biru = false positive rate.</p>
        <p><strong>Interpretasi:</strong> menggeser ambang dari 5 ke 3 menaikkan detection 26%→15%… eh, perhatikan arahnya: ambang <em>rendah</em> (kiri) = detection tinggi + FP tinggi. Tidak ada titik &ldquo;benar&rdquo; — <strong>titik optimal ditentukan kapasitas investigasi</strong> (FR11): jika timmu hanya sanggup 200 review/hari, pilih ambang yang menghasilkan ≤200 alert/hari dengan detection maksimal.</p>
      </div>

      <p><strong>Prosedur tuning yang benar:</strong></p>
      <ol>
        <li>Ukur baseline: hit rate &amp; detection rate rule saat ini (dari data historis berlabel matang — ingat FR4!).</li>
        <li>Simulasikan ambang kandidat pada data historis (seperti Lab 1).</li>
        <li>Pilih ambang dengan <strong>detection tertinggi</strong> yang <strong>volume alert-nya ≤ kapasitas tim</strong>.</li>
        <li>Dokumentasikan: ambang, alasan, tanggal review berikutnya.</li>
      </ol>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Tuning = cari ambang dengan akurasi tertinggi.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> akurasi tidak relevan untuk rule fraud (base rate kecil — lihat FR2). Yang relevan: <strong>detection rate pada budget false positive yang tersedia</strong>. Rule dengan &ldquo;akurasi 99%&rdquo; tapi menghasilkan 5.000 alert/hari untuk tim 10 orang = rule yang mati di hari pertama.</p>
      </div>

      <h2 id="champion">Champion-Challenger: Cara Aman Mengganti Senjata</h2>
      <p><strong>Definisi.</strong> Champion = rule yang sedang produksi. Challenger = rule kandidat pengganti. Challenger dijalankan dalam <strong>shadow mode</strong>: ia mengevaluasi tiap transaksi dan <em>mencatat</em> apa yang <em>akan</em> dilakukannya — tanpa benar-benar menahan.</p>
      <p><strong>Kriteria promosi</strong> (challenger naik produksi hanya jika):</p>
      <ul>
        <li>Detection rate ≥ champion (pada data matang), <strong>dan</strong></li>
        <li>Hit rate tidak turun signifikan (&gt;~20% relatif), <strong>dan</strong></li>
        <li>Volume alert ≤ kapasitas (tidak membanjiri investigator).</li>
      </ul>
      <p><strong>Kenapa tidak langsung ganti?</strong> Karena rule yang &ldquo;bagus di data historis&rdquo; bisa katastrofik di produksi: distribusi bergeser, penipu adaptasi, atau ada bug logika yang hanya muncul di edge case live. Shadow mode = uji coba tanpa korban.</p>

      <h2 id="lab1">🔬 Lab 1: Velocity Rule + Trade-off Ambang</h2>
      <p>Geser ambang, rasakan trade-off-nya.</p>
      <PyodideLab
        title="Lab 1 — Tuning Ambang Velocity"
        hint="Ubah ambang 5 → 4 → 6 → 3. Catat: pada ambang berapa hit rate jatuh di bawah 20%? Itulah batas 'investigator masih percaya rule ini'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Champion vs Challenger</h2>
      <PyodideLab
        title="Lab 2 — Uji Challenger dalam Shadow Mode"
        hint="Modifikasi challenger (tambah syarat). Kapan challenger layak promosi? Kapan ia 'terlihat bagus' tapi sebenarnya berbahaya?"
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menghitung &amp; Menyetel Rule</h2>
      <p>Rule bukan &ldquo;aturan asal&rdquo; — ia mesin keputusan yang bisa diukur, disetel, dan dipertandingkan. Dua contoh pengerjaannya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: tuning rule velocity — dari data ke ambang</summary>
        <p>Rule kandidat: <em>&ldquo;flag jika &gt; 5 transaksi dalam 10 menit&rdquo;</em>. Evaluasi di 7 hari data historis (2,1 juta transaksi):</p>
        <p><strong>Langkah 1 — hitung hit rate &amp; precision.</strong> Rule mem-flag 8.400 transaksi. Dari jumlah itu, 1.260 terkonfirmasi fraud. Precision = 1.260/8.400 = <strong>15%</strong>. Dari total 3.150 fraud di periode itu, yang ke-flag 1.260 → recall = <strong>40%</strong>.</p>
        <p><strong>Langkah 2 — terjemahkan ke biaya.</strong> 8.400 flag × Rp25rb biaya review = Rp210 juta/minggu biaya operasional. Fraud tertangkap: 1.260 × Rp1,1 jt = Rp1,39 miliar dicegah. Rasio 6,6× — rule ini <em>menguntungkan</em>.</p>
        <p><strong>Langkah 3 — coba ambang alternatif.</strong> Ambang &gt;3/10 mnt: flag 31.000 (biaya Rp775 jt), recall 58% (1.827 fraud, Rp2,0 M dicegah) — rasio turun ke 2,6× dan investigator kewalahan. Ambang &gt;8/10 mnt: flag 2.900 (biaya Rp72,5 jt), recall 22% (693 fraud, Rp762 jt) — rasio 10,5× tapi 78% fraud lolos.</p>
        <p><strong>Keputusan:</strong> pertahankan &gt;5/10 mnt sebagai <strong>auto-review</strong>, dan tambahkan varian &gt;8/10 mnt sebagai <strong>auto-block</strong> (precision di ambang ini 31% — cukup tinggi untuk blokir langsung). Pelajaran: satu rule bisa punya <em>dua ambang, dua tindakan</em>.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: champion vs challenger — kapan rule lama dipensiunkan?</summary>
        <p>Champion: rule &ldquo;negara asing + nominal &gt; Rp5jt&rdquo; (2 tahun beroperasi). Challenger: rule baru &ldquo;device baru + velocity + nominal di atas persentil-95 nasabah&rdquo;. Uji 30 hari paralel (challenger hanya logging, tidak bertindak):</p>
        <p>Hasil: champion menangkap 410 fraud dengan 3.900 flag (precision 10,5%). Challenger menangkap 388 fraud dengan 1.700 flag (precision 22,8%). <strong>Overlap:</strong> 290 fraud ditangkap keduanya; 120 hanya champion; 98 hanya challenger.</p>
        <p><strong>Analisis:</strong> challenger menangkap <em>lebih sedikit</em> fraud total (388 &lt; 410) — analis junior akan mempertahank champion. Tapi hitung biayanya: champion butuh 3.900 review (Rp97,5 jt), challenger 1.700 (Rp42,5 jt). Cost per fraud tertangkap: champion Rp238rb, challenger Rp110rb — <strong>2,2× lebih efisien</strong>.</p>
        <p><strong>Keputusan senior:</strong> promosikan challenger, TAPI jangan buang 120 fraud unik champion — ekstrak polanya: ternyata 80 dari 120 adalah transaksi travel legit-tapi-asing yang selama ini jadi false positive mahal. Kesimpulan akhir: challenger naik, champion pensiun, dan 40 kasus unik sisanya jadi bahan rule ketiga yang lebih spesifik. <strong>Rule tidak pernah &ldquo;kalah&rdquo; sia-sia — ia selalu meninggalkan pelajaran pola.</strong></p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Rule adalah Bahasa, Bukan Sekadar Filter</h2>
      <p>Rule yang baik bisa <strong>dibaca keras-keras</strong> dan dipahami CS, investigator, bahkan nasabah: &ldquo;kami menahan transaksi karena ada 9 transaksi dalam 10 menit dari perangkat baru.&rdquo; Inilah keunggulan yang tidak dimiliki model ML mana pun: <strong>rule adalah pengetahuan yang bisa diwariskan</strong>. Saat analis senior resign, rule-nya tetap tinggal dan tetap bisa dijelaskan. Model tanpa dokumentasi = pergi bersama orangnya.</p>
      <p>Intuisi kedua: <strong>setiap rule adalah hipotesis tentang dunia</strong> — dan hipotesis bisa salah atau kedaluwarsa. &ldquo;Transaksi &gt; Rp10jt dari luar negeri = curiga&rdquo; adalah hipotesis tahun 2018 yang masih benar; &ldquo;IP luar negeri = curiga&rdquo; adalah hipotesis yang mati sejak WFH massal 2020. Bedakan <em>rule</em> (implementasi) dari <em>hipotesis</em> (alasan) — saat dunia berubah, hipotesisnya yang diganti, bukan sekadar angkanya.</p>
      <p><strong>Kapan rule TIDAK boleh dipakai:</strong> (1) pola <strong>bermutasi lebih cepat dari siklus review</strong> (mingguan) — rule menjadi fosil; (2) keputusan butuh <strong>menimbang 10+ sinyal sekaligus</strong> — otak manusia tidak bisa menulis rule 10-dimensi yang benar; (3) sebagai <strong>satu-satunya pertahanan</strong> untuk serangan terorganisir — penjahat membaca rule-mu dari perilakunya (mereka tahu ambangmu dari trial-error) dan menari di bawahnya. Rule = pagar; pagar tidak menghentikan maling profesional — ia <em>memperlambat &amp; mencatat</em> mereka.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tulis setiap rule dalam format: <strong>HIPOTESIS → RULE → METRIK → KEDALUWARSA</strong>. Contoh: &ldquo;H: pencuri mengetes kartu dengan nominal kecil lalu menguras. R: flag velocity &gt; 5/10mnt + amount spike. M: precision &gt; 15%. Exp: review 2027-Q1.&rdquo; Rule tanpa tanggal kedaluwarsa = utang yang tidak tercatat.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Rule Kapan, ML Kapan</h2>

      <div className="decision-card">
        <h3>1. Pola serangan jelas &amp; stabil → <strong>rule (cepat, murah, bisa dijelaskan)</strong></h3>
        <p><strong>Kondisi:</strong> investigator sudah tahu polanya (&ldquo;warming selalu &gt;5 trx/jam dari device baru&rdquo;).</p>
        <p><strong>Kenapa rule:</strong> deploy dalam jam, tidak butuh label, bisa dijelaskan ke regulator/auditor. ML butuh bulan + label matang.</p>
        <p><strong>Contoh nyata:</strong> rule 3 baris BayarKu yang mengalahkan model Rp500 juta.</p>
      </div>

      <div className="decision-card">
        <h3>2. Pola kabur / banyak interaksi fitur → <strong>ML (FR7)</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada ambang tunggal yang jelas; sinyal lemah yang baru kuat saat dikombinasikan 20 fitur.</p>
        <p><strong>Kenapa ML:</strong> menemukan interaksi non-linear yang tak terlihat manusia. Rule akan meledak jadi ratusan cabang.</p>
        <p><strong>Contoh nyata:</strong> first-party fraud — tidak ada &ldquo;ambang ajaib&rdquo;, hanya pola perilaku halus.</p>
      </div>

      <div className="decision-card">
        <h3>3. Nol label / produk baru → <strong>rule pakar + unsupervised (FR8)</strong></h3>
        <p><strong>Kondisi:</strong> belum ada histori fraud (ingat FR4).</p>
        <p><strong>Kenapa:</strong> supervised butuh label; rule pakar + anomaly detection bisa jalan hari pertama.</p>
        <p><strong>Contoh nyata:</strong> fitur QRIS baru — 3 bulan pertama full rule-based.</p>
      </div>

      <div className="decision-card">
        <h3>4. Produksi jangka panjang → <strong>keduanya, berlapis</strong></h3>
        <p><strong>Kondisi:</strong> sistem matang dengan volume besar.</p>
        <p><strong>Kenapa:</strong> rule = firewall cepat untuk pola known; ML = jaring untuk pola unknown. Rule juga jadi <strong>fitur</strong> untuk ML (&ldquo;berapa rule yang terpicu&rdquo; adalah fitur kuat!).</p>
        <p><strong>Contoh nyata:</strong> arsitektur standar industri: rule layer → ML scoring → manual review.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Setiap rule: kondisi + aksi + prioritas + <strong>expiry</strong> + owner.</li>
          <li>Velocity relatif terhadap baseline, bukan absolut.</li>
          <li>Ukur hit rate tiap rule tiap bulan; &lt;10% = kandidat kombinasi/penurunan aksi.</li>
          <li>Challenger <strong>selalu</strong> lewat shadow mode dulu. Tidak ada pengecualian.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Kapan Rule Lahir, Kapan Mati</h2>
      <p>Rule punya siklus hidup. Tiga keputusan yang menentukan apakah arsenal rule-mu sehat atau jadi &ldquo;kuburan rule&rdquo;:</p>
      <p><strong>Skenario A — rule darurat 0-day.</strong> Serangan baru terdeteksi jam 09.00 (pola refund fiktif). Model butuh 2 minggu data. Respons benar: <strong>rule sementara dalam 2 jam</strong> (&ldquo;flag semua refund &gt; Rp2jt dari akun umur &lt; 7 hari&rdquo;), pasang tanggal kedaluwarsa 14 hari, tugaskan analis memantau hit rate harian. Rule darurat yang tidak diberi tanggal kedaluwarsa akan hidup selamanya dan 6 bulan kemudian tidak ada yang ingat kenapa ia ada.</p>
      <p><strong>Skenario B — kapan rule di-retire.</strong> Audit tiap kuartal dengan tiga metrik: (1) <em>fire rate</em> — rule yang tidak pernah fire 90 hari = kandidat hapus; (2) <em>precision trend</em> — turun 3 kuartal beruntun = pola sudah basi; (3) <em>overlap</em> — 95% tangkapannya juga ditangkap rule lain = redundan. Rule yang lolos ketiganya tapi precision &lt; 2% = &ldquo;pajak alarm&rdquo; — pertimbangkan ubah jadi logging saja.</p>
      <p><strong>Skenario C — kapan rule cukup, kapan butuh ML.</strong> Rule cukup jika: pola stabil &gt; 6 bulan, precision &gt; 20%, dan volume flag sesuai kapasitas. Butuh ML jika: pola bermutasi tiap minggu, fitur interaksi kompleks (device × jam × merchant × histori), atau precision rule mentok &lt; 5% padahal recall dibutuhkan tinggi. Aturan jujur: <strong>jangan bangun ML untuk masalah yang rule Rp0 bisa selesaikan</strong> — dan jangan pertahankan rule untuk masalah yang sudah jelas butuh ML.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> rule yang baik seperti <strong>pagar</strong> — murah, jelas, dan semua orang paham kenapa ia ada. ML seperti <strong>anjing penjaga</strong> — lebih pintar, tapi butuh dilatih, diberi makan (data), dan kadang menggonggong ke tamu. Rumah yang aman punya keduanya, dengan pagar dibangun lebih dulu.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Ketika Rule Ikut &ldquo;Belanja&rdquo; Saat Harbolnas</h2>
      <p>Pola yang terjadi di beberapa e-commerce lokal saat Harbolnas 11.11: rule velocity &ldquo;&gt; 10 transaksi/jam = fraud&rdquo; yang tenang sepanjang tahun tiba-tiba mem-flag <strong>ribuan pembeli legit</strong> — karena saat flash sale, manusia normal memang checkout 15× dalam 20 menit (berebut barang, gagal, coba lagi).</p>
      <p><strong>Angka ilustratif kerusakannya:</strong> 4.200 akun ter-flag dalam 6 jam; 3.900 di antaranya legit (precision anjlok ke 7%). Setiap akun yang terblokir salah = rata-rata keranjang Rp850rb batal + biaya CS Rp35rb + risiko churn. Total: ±Rp3,3 miliar GMV tertahan + Rp147 juta biaya CS — dalam <em>satu malam</em>, oleh rule yang &ldquo;bekerja sesuai spesifikasi&rdquo;.</p>
      <p><strong>Akar masalah:</strong> rule mengasumsikan distribusi perilaku <em>normal harian</em>, padahal Harbolnas adalah <strong>regime shift</strong> (FR10): perilaku legit sendiri berubah total. Tiga perbaikan yang benar: (1) <strong>kalender regime</strong> — ambang velocity dilonggarkan otomatis saat event besar (dengan kompensasi: perketat sinyal lain seperti device baru); (2) <strong>whitelist perilaku</strong> — akun berumur &gt; 1 tahun dengan histori bersih dapat ambang 3× lipat; (3) <strong>circuit breaker</strong> — jika flag rate naik &gt; 5× dalam 1 jam, rule otomatis turun ke mode review, bukan blokir.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Rule yang bagus tidak perlu diubah-ubah.&rdquo;<br /><strong>Yang benar:</strong> rule adalah <strong>foto pola serangan di satu titik waktu</strong> — dan penjahat terus berganti pose. Rule tanpa jadwal review kuartalan = foto usang yang dipajang sebagai cermin. Yang hebat bukan rule-nya, tapi <em>disiplin meninjau ulangnya</em>.</p>
      </div>

      <h2 id="case">📋 Mini-Case: 6 Rule, Kapasitas 200 Review/Hari</h2>
      <div className="callout">
        <p>Kamu mewarisi 6 rule (hit rate dari chart di atas). Kapasitas tim: <strong>200 review/hari</strong>. Volume alert saat ini:</p>
        <ul>
          <li>R1 (velocity, hit 34%): 120 alert/hari</li>
          <li>R2 (device baru, hit 28%): 90 alert/hari</li>
          <li>R3 (nominal besar, hit 12%): 60 alert/hari</li>
          <li>R4 (lokasi aneh, hit 22%): 70 alert/hari</li>
          <li>R5 (jam aneh, hit 8%): 150 alert/hari</li>
          <li>R6 (merchant baru, hit 15%): 40 alert/hari</li>
        </ul>
        <p>Total: 530 alert/hari — <strong>2,6× kapasitas</strong>. Investigator kelelahan, banyak alert dilewati tanpa dibaca.</p>
        <p><strong>Pertanyaan:</strong> rancang portofolio rule yang muat 200/hari dengan detection maksimal. Rule mana dipertahankan/diubah/dimatikan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Langkah 1 — hitung &ldquo;harga per detection&rdquo;:</strong> R5 memakan 150 slot (75% kapasitas!) dengan hit rate 8% — termahal dan terburuk. <strong>Langkah 2 — pertahankan yang efisien:</strong> R1 (120) + R2 (90) = 210, sudah sedikit di atas kapasitas dengan hit rate terbaik.</p>
          <p><strong>Rancangan:</strong> (a) <strong>R5: turunkan aksi</strong> dari <em>hold</em> → <em>monitor</em> (tidak makan kapasitas, tetap kumpulkan data); (b) <strong>R1+R2: ketatkan sedikit</strong> ambang agar total ~150/hari; (c) <strong>R4: gabungkan</strong> dengan R2 (&ldquo;device baru AND lokasi aneh&rdquo;) — kombinasi dua sinyal sedang jadi satu sinyal kuat, ~30/hari; (d) <strong>R3, R6: pertahankan</strong> sebagai monitor (total hold ≈ 180/hari ≤ 200).</p>
          <p><strong>Pelajaran:</strong> optimasi portofolio rule = knapsack problem — maksimalkan detection dengan budget kapasitas. Rule tidak dinilai sendirian, melainkan sebagai <strong>portofolio</strong>.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Rule-Based</h2>
      <details className="worked">
        <summary>Q1: Berapa banyak rule yang ideal?</summary>
        <p><strong>20–60 rule aktif</strong> untuk operasi menengah — cukup untuk cakupan, sedikit untuk dirawat. Tanda kebanyakan: tidak ada yang hafal semua rule, review kuartalan tidak pernah selesai, rule saling bertentangan. Tanda kekurangan: pola berulang lolos terus. Yang penting bukan jumlah — tapi <strong>setiap rule punya pemilik, metrik, dan tanggal review</strong>. Rule yatim piatu = rule mati berjalan.</p>
      </details>
      <details className="worked">
        <summary>Q2: &ldquo;ML sudah ada, kenapa masih butuh rule?&rdquo;</summary>
        <p>Empat alasan: (1) <strong>kecepatan</strong> — rule darurat deploy dalam jam, model butuh minggu; (2) <strong>kepastian</strong> — pola yang 100% fraud (device terkonfirmasi jahat) tidak butuh probabilitas; (3) <strong>kepatuhan</strong> — regulator/auditor paham rule; (4) <strong>cadangan</strong> — saat model down, rule adalah pertahanan terakhir. Arsitektur yang benar: <strong>rule + ML berlapis</strong>, bukan salah satu.</p>
      </details>
      <details className="worked">
        <summary>Q3: Siapa yang seharusnya memelihara rule — analis atau engineer?</summary>
        <p><strong>Analis menulis logika, engineer menjaga eksekusi.</strong> Analis tahu polanya (&ldquo;velocity berapa yang aneh?&rdquo;); engineer tahu biayanya (&ldquo;query ini 800ms, terlalu lambat&rdquo;). Kegagalan klasik: analis menulis rule tanpa tahu limitasi sistem (rule tidak pernah jalan) atau engineer mengubah rule tanpa paham logikanya (rule jalan tapi salah). <em>Pair review</em> tiap rule baru = murah dibanding insiden.</p>
      </details>
      <details className="worked">
        <summary>Q4: Rule darurat — seberapa &ldquo;kasar&rdquo; boleh?</summary>
        <p>Saat serangan aktif, <strong>presisi boleh turun sementara</strong> — false positive 2 jam lebih murah daripada kebocoran 2 jam. Tapi tiga syarat: (1) <strong>batas waktu eksplisit</strong> (auto-expire), (2) <strong>monitoring hit rate per jam</strong>, (3) <strong>jalur banding cepat</strong> untuk korban salah flag. Rule darurat tanpa ketiganya = kepanikan yang dilembagakan.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Mengapa setiap rule WAJIB punya expiry/review date?"
        options={[
          "Agar terlihat profesional",
          "Karena penipu beradaptasi — rule yang tidak direview akan menahan nasabah normal sambil meloloskan pola baru",
          "Karena database butuh dibersihkan",
          "Tidak wajib",
        ]}
        correct={1}
        explanation="Benar: adversarial adaptation (FR10). Rule adalah foto pola serangan di satu titik waktu; penipu bergerak, foto menjadi basi. Tanpa expiry, rule keramat menumpuk dan membebani."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Rule menahan 200 transaksi, 68 di antaranya benar fraud. Hit rate dan artinya?"
        options={[
          "17% — buruk, hapus rule-nya",
          "34% — dari tiap 100 yang ditahan, 34 benar fraud; bandingkan 'harga' kapasitasnya sebelum menilai",
          "68% — sangat bagus",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: 68/200 = 34%. Artinya tiap 100 review menghasilkan 34 temuan — bandingkan dengan 'harga' 100 slot kapasitas investigator. Hit rate 34% adalah rule yang sehat; di bawah ~10% baru jadi kandidat kombinasi/penurunan aksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Pedagang pasar terima 50 QRIS/jam (normal), akun pribadi transfer 50×/jam (mule). Kesimpulannya?"
        options={[
          "Blokir keduanya — 50/jam selalu mencurigakan",
          "Velocity harus relatif terhadap baseline per user/segmen, bukan ambang absolut",
          "Naikkan ambang jadi 100/jam",
          "Velocity tidak berguna",
        ]}
        correct={1}
        explanation="Benar: ambang absolut buta konteks. 50/jam normal untuk merchant, gila untuk akun pribadi. Rule yang benar: v_t > k × baseline_user."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan challenger boleh promosi menggantikan champion?"
        options={[
          "Begitu akurasinya lebih tinggi di data historis",
          "Setelah shadow mode: detection ≥ champion, hit rate tidak anjlok, volume ≤ kapasitas",
          "Atas perintah atasan",
          "Tidak pernah — champion abadi",
        ]}
        correct={1}
        explanation="Benar: tiga kriteria. 'Bagus di historis' saja tidak cukup — distribusi produksi bisa berbeda, dan volume alert adalah nyawa investigator."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan rule LEBIH tepat daripada ML?"
        options={[
          "Tidak pernah — ML selalu menang",
          "Pola serangan jelas & stabil, butuh deploy cepat, butuh penjelasan ke auditor, atau nol label",
          "Hanya untuk perusahaan kecil",
          "Hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: rule unggul saat pola known (cepat, murah, explainable) dan saat ML tidak bisa jalan (nol label). Arsitektur dewasa = keduanya berlapis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Rule profesional</strong> = kondisi + aksi (block/hold/step-up/monitor) + prioritas + <strong>expiry</strong> + owner.</li>
          <li><strong>Velocity</strong> (count/amount/distinct-counterparty, relatif terhadap baseline) = sinyal universal serangan.</li>
          <li><strong>Hit rate</strong> = presisi rule; <strong>detection rate</strong> = recall rule. Keduanya bertentangan — pilih via kapasitas.</li>
          <li><strong>Tuning</strong> = pilih ambang dengan detection maksimal pada budget alert ≤ kapasitas tim.</li>
          <li><strong>Champion-challenger</strong>: challenger wajib shadow mode; promosi hanya jika detection ≥, hit rate aman, volume muat.</li>
          <li>Rule jelek sendirian bisa jadi <strong>fitur bagus</strong> dalam kombinasi — nilai sebagai portofolio.</li>
          <li>Kapan TIDAK pakai rule: pola kabur multi-fitur (pakai ML) — dan jangan pernah ganti rule tanpa shadow mode.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr4-label-fraud" className="btn btn-secondary btn-sm">← FR4</Link>
        <Link href="/learn/fr6-feature-engineering" className="btn btn-primary btn-sm">Next: FR6 →</Link>
      </div>
    </div>
  );
}
