"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR2Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const overlapData = [
    {
      x: ["Murni fraud", "Murni AML", "Murni cyber", "Fraud∩AML", "Fraud∩Cyber", "AML∩Cyber", "Ketiganya"],
      y: [30, 22, 25, 8, 9, 3, 3],
      type: "bar",
      marker: { color: ["#e05252", "#e8a838", "#2a7de1", "#b06fc9", "#6fb3c9", "#c9a06f", "#7bc96f"] },
    },
  ];

  const killchainLossData = [
    {
      x: ["Recon", "Weaponize", "Deliver", "Exploit", "Install", "C2", "Monetize"],
      y: [2, 3, 8, 15, 12, 20, 40],
      type: "bar",
      marker: { color: "#e05252" },
      text: ["2%", "3%", "8%", "15%", "12%", "20%", "40%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Teorema Bayes untuk analis fraud: kenapa 95% alert adalah false positive?
# Skenario: model mendeteksi 99% fraud (recall), false positive rate 1%.
p_fraud   = 0.002   # base rate: 0,2% transaksi adalah fraud (200 bps)
recall    = 0.99    # P(alert | fraud)
fpr       = 0.01    # P(alert | bukan fraud)

# P(fraud | alert) = P(alert|fraud)*P(fraud) / P(alert)
p_alert = recall * p_fraud + fpr * (1 - p_fraud)
precision = recall * p_fraud / p_alert

print(f"P(alert)              = {p_alert*100:.2f}%")
print(f"P(fraud | alert)      = {precision*100:.1f}%  <- presisi alert")
print(f"Artinya: dari 100 alert, hanya ~{precision*100:.0f} yang benar-benar fraud!")
print()
print("COBA UBAH: p_fraud 0.002 -> 0.02 (fraud 10x lipat, mis. serangan terkoordinasi).")
print("Presisi melonjak. Pelajaran: nilai sebuah alert BERGANTUNG pada base rate,")
print("bukan cuma 'akurasi model'. Inilah base rate fallacy.")`;

  const lab2Code = `# Simulasi: memotong kill chain di tahap berbeda
# Setiap tahap punya biaya intervensi & % serangan yang lolos ke tahap berikut
tahapan = [
    ("Recon (deteksi credential stuffing)",  5,  0.60),   # biaya, fraksi lolos
    ("Deliver (blokir phishing)",           10,  0.50),
    ("Exploit (OTP + device check)",        25,  0.30),
    ("Monetize (hold dana mencurigakan)",   60,  0.10),
]
serangan = 1000
print(f"{'Intervensi':38s} {'Lolos':>6s}  {'Biaya':>6s}")
for nama, biaya, lolos in tahapan:
    lolos_n = serangan * lolos
    dicegah = serangan - lolos_n
    print(f"{nama:38s} {lolos_n:6.0f}  Rp{biaya:4.0f} jt  -> {dicegah:.0f} serangan terhenti")
print()
print("COBA UBAH: naikkan biaya 'Monetize' jadi 200.")
print("Pelajaran: makin ke kanan (dekat uang), makin MAHAL intervensinya")
print("tapi makin SEDIKIT yang perlu ditangani. Inilah trade-off kill chain:") 
print("cegah di kiri = murah tapi berisik (banyak false positive);") 
print("cegah di kanan = tepat tapi mahal & berisiko telat.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR2 — Fraud / ML Analytics</span>
        <h1 className="display-title">Fraud vs AML vs Cyber:<br />Tiga Perang yang Sering Dianggap Satu</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Satu Kasus, Tiga Tim, Saling Lempar</a></li>
          <li><a href="#definisi">Definisi: Tiga Perang, Tiga Musuh, Tiga Kemenangan</a></li>
          <li><a href="#bayes">Base Rate Fallacy: Kenapa 95% Alert-mu False Positive (Bayes)</a></li>
          <li><a href="#killchain">Kill Chain: Peta Serangan 7 Tahap</a></li>
          <li><a href="#siklus">Siklus Fraud: Dari Recon sampai Monetize</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Presisi Alert dengan Bayes</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Biaya Memotong Kill Chain</a></li>
          <li><a href="#worked">📐 Worked Example: Bayes &amp; Kill Chain</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Dua Jam yang Berbeda</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Kasus Ini Milik Tim Mana?</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Fraud, AML, atau Keduanya?</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Dari Korupsi ke Properti via Layering</a></li>

          <li><a href="#case">📋 Mini-Case: Rp800 Juta Hilang — Siapa Bertanggung Jawab?</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Fraud vs AML</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>fraud, AML, dan cybersecurity</strong> dari definisi, tujuan, dan metrik kemenangannya.</li>
          <li>Menghitung <Tex math={String.raw`P(\text{fraud} \mid \text{alert})`} /> dengan teorema Bayes dan menjelaskan base rate fallacy ke non-teknis.</li>
          <li>Memetakan serangan ke <strong>7 tahap kill chain</strong> dan menunjukkan titik intervensi termurah vs paling tepat.</li>
          <li>Mengklasifikasikan kasus nyata ke tim yang tepat (fraud / AML / cyber) beserta alasannya.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Satu Kasus, Tiga Tim, Saling Lempar</h2>
      <div className="story">
        <p>Bank &ldquo;NusaBank&rdquo; kehilangan Rp800 juta. Kronologinya: nasabah menerima WA &ldquo;undangan pernikahan digital&rdquo; (APK), menginstal, lalu 20 menit kemudian saldonya terkuras lewat 14 transfer ke rekening-rekening baru. Tim <strong>cyber</strong> berkata: &ldquo;Ini malware, ranah kami.&rdquo; Tim <strong>fraud</strong> berkata: &ldquo;Ini ATO, ranah kami.&rdquo; Tim <strong>AML</strong> berkata: &ldquo;Dana diteruskan ke 14 rekening lalu ke luar negeri — ini layering, ranah kami.&rdquo;</p>
        <p>Ketiganya benar — dan ketiganya salah. Ini <strong>satu serangan, tiga lensa</strong>. Cyber melihat cara masuknya (malware). Fraud melihat pencurian dananya (uang nasabah hilang). AML melihat pelariannya (uang dicuci). Perusahaan yang tidak paham bedanya akan membangun tiga pertahanan yang tidak nyambung — dan penyerang lewat di celahnya.</p>
        <p>Twist-nya: kemenangan tiap tim <strong>diukur dengan metrik yang berbeda</strong>, bahkan bertentangan. Itu yang bikin mereka berantem — bukan egonya, tapi KPI-nya.</p>
      </div>

      <h2 id="definisi">Definisi: Tiga Perang, Tiga Musuh, Tiga Kemenangan</h2>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead><tr><th>Aspek</th><th>Fraud</th><th>AML</th><th>Cybersecurity</th></tr></thead>
          <tbody>
            <tr><td><strong>Pertanyaan inti</strong></td><td>&ldquo;Apakah transaksi ini <em>tidak sah</em>?&rdquo;</td><td>&ldquo;Apakah dana ini <em>hasil kejahatan</em>?&rdquo;</td><td>&ldquo;Apakah sistem ini <em>dibobol</em>?&rdquo;</td></tr>
            <tr><td><strong>Korban</strong></td><td>Nasabah / perusahaan (uang hilang <em>sekarang</em>)</td><td>Sistem keuangan (reputasi, denda regulator)</td><td>Perusahaan (data, layanan)</td></tr>
            <tr><td><strong>Musuh</strong></td><td>Penipu yang mencuri uang</td><td>Pencuci yang menyamarkan asal uang</td><td>Peretas yang membobol sistem</td></tr>
            <tr><td><strong>Metrik menang</strong></td><td>Loss turun, detection rate naik</td><td>STR tepat waktu, lolos audit OJK/PPATK</td><td>MTTD/MTTR turun, zero breach</td></tr>
            <tr><td><strong>Horizon</strong></td><td>Detik–menit (real-time!)</td><td>Hari–bulan (investigasi)</td><td>Menit–jam (respons insiden)</td></tr>
            <tr><td><strong>Regulator (ID)</strong></td><td>OJK (perlindungan konsumen)</td><td>PPATK + OJK (APU-PPT)</td><td>BSSN + OJK (ketahanan siber)</td></tr>
          </tbody>
        </table>
      </div>

      <p><strong>Kepribadian ketiganya:</strong> Fraud adalah <em>pemadam kebakaran</em> — uang terbakar sekarang, padamkan sekarang. AML adalah <em>detektif arsip</em> — menelusuri jejak uang berbulan-bulan untuk laporan ke PPATK. Cyber adalah <em>penjaga gerbang</em> — memastikan tembok tidak jebol. Kebakaran, arsip, dan gerbang adalah tiga masalah berbeda walau satu gedung yang sama.</p>

      <PlotlyChart
        data={overlapData}
        title="Distribusi Kasus per Domain (ilustrasi — % dari total kasus setahun)"
        layout={{ xaxis: { title: "Domain" }, yaxis: { title: "% kasus" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = domain kasus, tinggi batang = pangsa kasus. Tiga batang pertama adalah kasus murni satu domain; sisanya irisan.</p>
        <p><strong>Interpretasi:</strong> ~77% kasus murni satu domain — artinya spesialisasi tim <strong>masuk akal</strong>. Tapi 23% berada di irisan, dan justru di situlah kasus paling mahal (seperti NusaBank). <strong>Implikasi organisasi:</strong> butuh tim spesialis + satu &ldquo;meja bersama&rdquo; untuk kasus irisan, bukan tiga silo yang saling lempar.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau fraud-nya ketangkap, otomatis AML-nya beres.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> menghentikan fraud = menghentikan <em>pencurian</em>; AML = melacak <em>hasilnya</em> dan melapor ke PPATK. Kamu bisa menggagalkan 99% pencurian tapi tetap didenda OJK karena tidak melaporkan 1% yang lolos. Kemenangan fraud diukur dengan rupiah terselamatkan; kemenangan AML diukur dengan kepatuhan pelaporan.</p>
      </div>

      <h2 id="bayes">Base Rate Fallacy: Kenapa 95% Alert-mu False Positive</h2>
      <p>Ini konsep paling penting untuk bertahan hidup sebagai analis fraud. Modelmu punya recall 99% dan false positive rate cuma 1% — terdengar hebat. Tapi:</p>
      <Tex math={String.raw`P(\text{fraud} \mid \text{alert}) = \frac{P(\text{alert} \mid \text{fraud}) \cdot P(\text{fraud})}{P(\text{alert})}`} block />
      <ul>
        <li><Tex math={String.raw`P(\text{fraud} \mid \text{alert})`} />: peluang alert benar-benar fraud — inilah <strong>presisi</strong> yang dirasakan investigator.</li>
        <li><Tex math={String.raw`P(\text{alert} \mid \text{fraud})`} />: recall model (99%).</li>
        <li><Tex math={String.raw`P(\text{fraud})`} />: <strong>base rate</strong> — seberapa langka fraud (mis. 0,2%).</li>
        <li><Tex math={String.raw`P(\text{alert})`} />: total peluang alert berbunyi = <Tex math={String.raw`P(\text{alert}\mid\text{fraud})P(\text{fraud}) + P(\text{alert}\mid\text{bukan fraud})P(\text{bukan fraud})`} />.</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan langkah-demi-langkah</summary>
        <p>Base rate 0,2%, recall 99%, FPR 1%.</p>
        <p><strong>Langkah 1</strong> — <Tex math={String.raw`P(\text{alert}) = 0{,}99 \times 0{,}002 + 0{,}01 \times 0{,}998 = 0{,}00198 + 0{,}00998 = 0{,}01196`} />.<br />
        <strong>Langkah 2</strong> — presisi = <Tex math={String.raw`0{,}00198 / 0{,}01196 \approx 16{,}6\%`} />.</p>
        <p><strong>Artinya:</strong> dari 100 alert, hanya ~17 yang benar fraud. Model &ldquo;99% akurat&rdquo; menghasilkan 83% sampah — bukan karena modelnya jelek, tapi karena <strong>fraud-nya langka</strong>. Inilah base rate fallacy: intuisi manusia mengabaikan kelangkaan.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> presisi alert ditentukan <em>perkalian</em> kualitas model × base rate. Base rate 10× lipat (saat serangan terkoordinasi) membuat alert yang sama 10× lebih bisa dipercaya — tanpa model berubah sedikit pun. Analis senior membaca alert <strong>dengan konteks base rate saat itu</strong>, bukan dengan skor model mentah.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model dengan akurasi 99% pasti menghasilkan sedikit false positive.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> pada base rate 0,2%, model 99% akurat pun menghasilkan <strong>5× lebih banyak false positive daripada true positive</strong> (83 vs 17 dari 100 alert). &ldquo;Akurasi&rdquo; adalah metrik yang menipu untuk data imbalance — yang relevan adalah <strong>presisi</strong> (FR9).</p>
      </div>

      <h2 id="killchain">Kill Chain: Peta Serangan 7 Tahap</h2>
      <p><strong>Definisi.</strong> Cyber Kill Chain (Lockheed Martin) memecah serangan menjadi 7 tahap berurutan. Versi fraud-nya:</p>
      <ol>
        <li><strong>Reconnaissance</strong> — pengintaian: beli daftar email bocor, pilih target (phishing massal).</li>
        <li><strong>Weaponization</strong> — siapkan senjata: APK &ldquo;undangan nikah&rdquo;, situs phishing mirip bank.</li>
        <li><strong>Delivery</strong> — kirim: WA blast, SMS, iklan palsu.</li>
        <li><strong>Exploitation</strong> — korban klik/instal; kredensial/OTP dicuri.</li>
        <li><strong>Installation</strong> — malware menetap / sesi dibajak (ATO).</li>
        <li><strong>Command &amp; Control</strong> — penyerang kendalikan akun dari jauh.</li>
        <li><strong>Actions on Objectives (Monetize)</strong> — kuras dana, pecah ke mule, tarik tunai.</li>
      </ol>
      <p><strong>Aturan emas kill chain:</strong> penyerang harus berhasil di <em>semua</em> tahap; defender cukup menggagalkan <em>satu</em> tahap. Pertanyaannya: tahap mana yang paling murah digagalkan?</p>

      <PlotlyChart
        data={killchainLossData}
        title="Di Tahap Mana Uang Hilang? (distribusi loss per tahap — ilustrasi)"
        layout={{ xaxis: { title: "Tahap kill chain" }, yaxis: { title: "% dari total loss" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> sumbu horizontal = tahap serangan dari kiri (awal) ke kanan (akhir), tinggi batang = pangsa kerugian yang &ldquo;matang&rdquo; di tahap itu.</p>
        <p><strong>Interpretasi:</strong> 40% loss terjadi di tahap monetize — tapi saat itu uang sudah bergerak dan <strong>paling mahal dicegah</strong> (butuh hold dana = gesekan ke nasabah legit). Tahap kiri (recon–delivery) murah dicegah (blokir nomor, filter SMS) tapi berisik — banyak false positive. <strong>Strategi dewasa: pertahanan berlapis</strong> — filter murah di kiri untuk volume, kontrol mahal di kanan untuk yang lolos.</p>
      </div>

      <h2 id="siklus">Siklus Fraud: Dari Recon sampai Monetize</h2>
      <p>Siklus fraud adalah kill chain yang <strong>berputar</strong>: hasil monetize (uang + data curian) menjadi modal recon berikutnya. Kartu yang dicuri hari ini dipakai untuk phishing yang lebih meyakinkan bulan depan (data korban = umpan yang lebih personal). Mule yang &ldquo;sukses&rdquo; direkrut jadi perekrut mule baru.</p>
      <p><strong>Implikasi untuk analis:</strong> jangan analisis kasus sebagai kejadian tunggal. Tanyakan selalu: <em>&ldquo;kasus ini output dari siklus apa, dan akan jadi input untuk siklus apa?&rdquo;</em> — itulah cara menemukan ring, bukan sekadar kasus (jembatan ke FR12 graph analytics).</p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> defender berpikir dalam <em>kasus</em> (&ldquo;alert ini benar/salah?&rdquo;); attacker berpikir dalam <em>siklus</em> (&ldquo;modal Rp10 juta jadi Rp100 juta&rdquo;). Analis yang naik kelas adalah yang mulai berpikir seperti attacker: melacak <strong>aliran</strong>, bukan titik.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Hitung Presisi Alert dengan Bayes</h2>
      <p>Ubah base rate dan lihat presisi berubah — tanpa menyentuh model sama sekali.</p>
      <PyodideLab
        title="Lab 1 — Bayes: Presisi Alert vs Base Rate"
        hint="Coba: p_fraud 0.002 → 0.02 → 0.0002. Pada base rate berapa presisi menembus 50%? Itulah ambang 'alert layak diinvestigasi manual'."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Biaya Memotong Kill Chain</h2>
      <PyodideLab
        title="Lab 2 — Trade-off Intervensi per Tahap"
        hint="Ubah biaya dan fraksi lolos tiap tahap. Cari kombinasi termurah yang menahan >90% serangan. Itulah desain pertahanan berlapis."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Probabilitas &amp; Kecepatan Serangan</h2>
      <p>Dua perhitungan yang wajib dikuasai sebelum membedakan fraud dan AML secara operasional: <strong>berapa yakin kita saat sistem berteriak</strong> (Bayes), dan <strong>seberapa cepat kita harus bereaksi</strong> (kill chain).</p>

      <details className="worked">
        <summary>📐 Contoh 1: P(fraud | flag) — kenapa 99% akurasi bisa berarti 90% alarm palsu</summary>
        <p>Sistem mem-flag 1% transaksi. Diketahui: sensitivitas (recall) 80% — dari semua fraud, 80% ke-flag. Fraud rate populasi 0,2% (2 dari 1.000 transaksi).</p>
        <p><strong>Langkah 1 — terapkan Bayes.</strong></p>
        <Tex math={String.raw`P(	ext{fraud}|	ext{flag}) = rac{P(	ext{flag}|	ext{fraud}) 	imes P(	ext{fraud})}{P(	ext{flag})}`} block />
        <p><Tex math={String.raw`P(	ext{flag}|	ext{fraud})`} /> = 0,80 (recall); <Tex math={String.raw`P(	ext{fraud})`} /> = 0,002; <Tex math={String.raw`P(	ext{flag})`} /> = 0,01.</p>
        <p><strong>Langkah 2 — hitung.</strong> (0,80 × 0,002) / 0,01 = 0,0016/0,01 = <strong>0,16 = 16%</strong>.</p>
        <p><strong>Interpretasi:</strong> dari 100 alarm, hanya 16 yang benar-benar fraud — 84 adalah gangguan untuk investigator. Angka ini artinya: <strong>base rate yang kecil menghukum semua sistem deteksi</strong>, sebagus apa pun recall-nya. Inilah kenapa FR9 (evaluasi) dan FR11 (threshold) ada: pekerjaan sesungguhnya adalah mengelola 84 alarm palsu itu, bukan sekadar &ldquo;menaikkan akurasi&rdquo;.</p>
        <p><strong>Coba pikir:</strong> kalau fraud rate naik 10× lipat menjadi 2% (misal saat serangan terkoordinasi), P(fraud|flag) menjadi (0,80 × 0,02)/0,01 = <strong>160% → dibatasi 100%</strong>? Tidak — karena P(flag) juga ikut naik. Intuisinya: saat serangan massal, alarm yang sama menjadi jauh lebih bisa dipercaya. Konteks mengubah arti angka yang sama.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: kill chain — fraud butuh menit, AML butuh bulan</summary>
        <p><strong>Kasus fraud (card-not-present):</strong> 14.02 kartu curian dipakai checkout Rp8,5 juta → 14.03 barang dikirim (digital goods, instan) → 14.20 kartu dipakai lagi Rp12 juta → 16.45 pemilik asli sadar &amp; komplain → 17.00 chargeback diajukan. <strong>Total jendela aksi: ±3 jam</strong> dari serangan pertama sampai uang hilang tak kembali. Keputusan harus otomatis dalam <em>milidetik</em> — tidak ada waktu menunggu investigator.</p>
        <p><strong>Kasus AML (layering properti):</strong> Januari: dana hasil korupsi masuk ke rekening perusahaan cangkang → Februari–April: diputar lewat 14 rekening &amp; 3 negara → Mei: dipakai DP apartemen → Agustus: apartemen dijual, dana &ldquo;bersih&rdquo;. <strong>Total jendela: 8 bulan.</strong> Tidak ada keputusan milidetik — yang dibutuhkan adalah <em>rekonstruksi rantai lengkap</em> untuk laporan STR ke PPATK.</p>
        <p><strong>Pelajaran:</strong> fraud = <strong>perlombaan kecepatan</strong> (siapa lebih cepat: pencuri mencairkan, atau sistem memblokir). AML = <strong>perlombaan kelengkapan</strong> (siapa punya gambaran rantai lebih utuh: pelaku menyembunyikan, atau analis merekonstruksi). Dua olahraga berbeda — butuh atlet, lapangan, dan wasit yang berbeda.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Dua Jam yang Berbeda</h2>
      <p>Bayangkan dua jam dinding. <strong>Jam fraud berdetak dalam milidetik</strong> — setiap detik penundaan = rupiah yang hilang. <strong>Jam AML berdetak dalam bulan</strong> — setiap kesimpulan terburu-buru = jaringan yang gagal dipetakan + laporan yang lemah. Analis yang dipindah dari tim fraud ke tim AML tanpa adaptasi akan membuat dua kesalahan: di fraud ia terlalu lambat (menunggu &ldquo;kepastian&rdquo;), di AML ia terlalu cepat (memblokir sebelum jaringan terpetakan).</p>
      <p>Intuisi kedua: <strong>fraud adalah permainan jumlah, AML adalah permainan cerita</strong>. Menangkap 1.000 card fraud = statistik yang bagus. Menangkap 1 jaringan pencucian = <em>cerita</em> yang harus utuh: siapa, dari mana uangnya, ke mana perginya, apa buktinya — karena ujungnya adalah pengadilan atau PPATK, bukan dashboard. Dokumentasi AML dibaca oleh <em>manusia yang skeptis</em> (penyidik, hakim); dokumentasi fraud dibaca oleh <em>mesin</em> (model).</p>
      <p><strong>Kapan pembedaan ini TIDAK relevan:</strong> (1) di perusahaan kecil — satu orang mengerjakan keduanya, yang penting adalah <em>checklist</em> mana yang dipakai per kasus, bukan struktur organnya; (2) untuk <strong>pencegahan</strong> (KYC yang baik mencegah keduanya); (3) saat uangnya <em>sedang bergerak</em> — dalam 24 jam pertama, selamatkan dulu (logika fraud), klasifikasikan kemudian (logika AML). <strong>Kecepatan dulu, taksonomi kemudian</strong> — saat darurat.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanyakan pada setiap kasus: <strong>&ldquo;apakah saya berlomba dengan <em>waktu</em> atau berlomba dengan <em>kelengkapan</em>?&rdquo;</strong> Jawabannya menentukan segalanya: tools, kecepatan, dokumentasi, bahkan siapa yang harus dibangunkan tengah malam.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Kasus Ini Milik Tim Mana?</h2>

      <div className="decision-card">
        <h3>1. Uang nasabah hilang <em>sekarang</em>, transaksi tidak sah → <strong>Fraud (pemadam)</strong></h3>
        <p><strong>Kondisi:</strong> ATO, card fraud, APP scam yang baru terjadi. Korban menelepon panik.</p>
        <p><strong>Aksi:</strong> blokir akun, hold dana, blokir device — dalam hitungan menit. Metrik: loss terselamatkan.</p>
        <p><strong>Contoh nyata:</strong> nasabah lapor saldo terkuras → tim fraud hold 14 rekening tujuan dalam 20 menit, selamat Rp500 juta dari Rp800 juta.</p>
      </div>

      <div className="decision-card">
        <h3>2. Dana bergerak mencurigakan antar rekening, asal tidak jelas → <strong>AML (detektif)</strong></h3>
        <p><strong>Kondisi:</strong> pola structuring (setoran di bawah ambang lapor), fan-out ke banyak rekening, tujuan luar negeri.</p>
        <p><strong>Aksi:</strong> investigasi mendalam, kumpulkan bukti, ajukan STR ke PPATK. Metrik: laporan tepat waktu &amp; berkualitas.</p>
        <p><strong>Contoh nyata:</strong> 14 rekening mule NusaBank → analisis 2 minggu → STR ke PPATK + data untuk kepolisian.</p>
      </div>

      <div className="decision-card">
        <h3>3. Sistem dibobol / malware menyebar → <strong>Cyber (penjaga gerbang)</strong></h3>
        <p><strong>Kondisi:</strong> APK menyebar, server diretas, data bocor.</p>
        <p><strong>Aksi:</strong> isolasi, forensik, patch, takedown situs phishing. Metrik: MTTR, tidak ada breach ulang.</p>
        <p><strong>Contoh nyata:</strong> tim cyber takedown 30 situs phishing &ldquo;nusabank&rdquo; dan blokir distribusi APK di hari yang sama.</p>
      </div>

      <div className="decision-card">
        <h3>4. Ketiganya sekaligus (kasus NusaBank) → <strong>meja bersama, satu komandan</strong></h3>
        <p><strong>Kondisi:</strong> malware (cyber) → ATO (fraud) → layering (AML) dalam satu rangkaian.</p>
        <p><strong>Aksi:</strong> fraud hold dana dulu (menit), cyber bersihkan vektor (jam), AML susun STR (hari/minggu). Urutan penting: <strong>uang dulu, forensik kemudian, laporan terakhir</strong>.</p>
        <p><strong>Contoh nyata:</strong> war-room gabungan 3 tim selama 72 jam pertama — bukan tiga tiket yang saling lempar.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tanya dulu: <strong>uang hilang? (fraud) / asal uang? (AML) / sistem jebol? (cyber)</strong>.</li>
          <li>Satu kasus bisa jawab &ldquo;ya&rdquo; untuk ketiganya — maka butuh ketiganya, berurutan.</li>
          <li>Jangan ukur tim AML dengan metrik fraud (atau sebaliknya) — KPI yang bertentangan = perang saudara.</li>
          <li>Setiap alert dibaca <strong>dengan base rate-nya</strong> — skor model tanpa konteks = angka mati.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Masuk Tim Mana?</h2>
      <p>Di dunia nyata, satu kasus sering mengetuk dua pintu sekaligus. Tiga skenario routing yang paling sering salah ditangani:</p>
      <p><strong>Skenario A — mule account Rp500 juta/bulan.</strong> Tim fraud melihat &ldquo;rekening anomali&rdquo; dan ingin langsung bekukan. Tim AML melihat &ldquo;indikasi layering&rdquo; dan ingin pantau dulu untuk memetakan jaringan. Keduanya benar — urutan yang tepat: <strong>AML pantau 7–14 hari sambil kumpulkan graph</strong> (FR12), <em>lalu</em> bekukan serentak satu jaringan. Bekukan terlalu cepat = pelaku ganti rekening, jaringan tak terpetakan. Aturan: untuk jaringan, kesabaran 2 minggu mengalahkan kecepatan 2 jam.</p>
      <p><strong>Skenario B — kapan eskalasi ke PPATK (STR).</strong> Bukan setiap transaksi aneh. Kriteria praktis: (1) ada indikasi tindak pidana asal (hasil korupsi, narkotika, penipuan), (2) pola konsisten dengan tipologi pencucian (structuring, layering, fan-out cepat), (3) nilai material atau jaringan terorganisir. Transaksi janggal satu kali tanpa pola → pantau &amp; catat, belum STR. Mengirim STR untuk semua yang aneh = membanjiri PPATK dan mengundang pertanyaan balik soal kualitas sistemmu.</p>
      <p><strong>Skenario C — jebakan tipping-off.</strong> Nasabah yang sedang dipantau AML menelepon CS menanyakan kenapa transaksinya &ldquo;pending&rdquo;. Memberi tahu bahwa ia dalam pantauan = <strong>tipping-off</strong>, pelanggaran serius UU TPPU. Respons yang benar sudah disiapkan sebagai skrip: alasan generik prosedural (&ldquo;verifikasi rutin&rdquo;), tanpa menyebut investigasi, AML, atau PPATK. Ini bukan soal teknis — ini soal <em>pelatihan</em> semua staf yang berhadapan dengan nasabah.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;AML itu fraud yang nilainya besar.&rdquo;<br /><strong>Yang benar:</strong> beda objektif, bukan beda skala. Fraud = <strong>mencuri uang</strong> (korbannya pemilik dana). AML = <strong>menyembunyikan asal uang</strong> (uangnya sudah &ldquo;dimiliki&rdquo; pelaku kejahatan). Pencucian Rp50 juta tetap AML; pencurian Rp50 miliar tetap fraud. Skala tidak menentukan kategori — <em>arah aliran dan tujuannya</em> yang menentukan.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Pola Layering Korupsi → Properti</h2>
      <p>Pola yang berulang di banyak kasus korupsi Indonesia: dana hasil tindak pidana tidak langsung dibelanjakan — ia &ldquo;dicuci&rdquo; dulu lewat lapisan-lapisan agar terlihat legal. Berikut anatomi generiknya (kompilasi dari pola putusan TPPU):</p>
      <ol>
        <li><strong>Placement (bulan 1):</strong> Rp12 miliar dana proyek fiktif masuk ke rekening perusahaan kontraktor cangkang — perusahaan yang menang tender tapi tidak punya alat berat, kantor, atau karyawan riil.</li>
        <li><strong>Layering (bulan 2–5):</strong> dana dipecah ke 20+ rekening: sebagian ke rekening keluarga/kerabat (&ldquo;hibah&rdquo;), sebagian ke perusahaan kedua &amp; ketiga sebagai &ldquo;pembayaran jasa konsultansi&rdquo; dengan invoice fiktif, sebagian diputar lewat money changer.</li>
        <li><strong>Integration (bulan 6–9):</strong> dana yang sudah &ldquo;berlapis&rdquo; dipakai DP 3 unit apartemen + 1 ruko — dibeli atas nama kerabat/orang kepercayaan (nominee), bukan pelaku langsung.</li>
      </ol>
      <p><strong>Di mana fraud vs AML-nya?</strong> Proyek fiktifnya = <strong>fraud</strong> (penggelapan/pencurian dana). Semua langkah setelahnya = <strong>TPPU/AML</strong> (menyembunyikan asal). Tim yang berbeda, bukti yang berbeda, pasal yang berbeda (UU Tipikor vs UU No. 8/2010) — tapi <em>data transaksinya sama</em>. Inilah kenapa bank butuh kedua kapabilitas: sistem fraud menangkap anomalinya lebih awal (perusahaan cangkang menang tender Rp12 M tanpa histori), sistem AML merekonstruksi rantainya untuk penegak hukum.</p>
      <p><strong>Jejak data untuk model AML:</strong> rekening perusahaan baru langsung menerima dana besar dari APBD/proyek; invoice &ldquo;jasa konsultansi&rdquo; bernilai bulat dan berulang; pembelian properti tunai oleh nasabah yang profil penghasilannya tidak cocok; nominee dengan alamat sama untuk banyak aset.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dalam kasus gabungan, <strong>fraud adalah pintunya, AML adalah lorongnya</strong>. Menangkap fraud lebih awal (di placement) 10× lebih murah daripada merekonstruksi layering 9 bulan kemudian — tapi tanpa kapabilitas AML, kamu tidak bisa membuktikan kejahatannya di pengadilan. Keduanya dibutuhkan, berurutan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Rp800 Juta Hilang — Siapa Bertanggung Jawab?</h2>
      <div className="callout">
        <p>Kasus NusaBank: 14 transfer (total Rp800 juta) dari rekening korban ke rekening-rekening baru, dalam 20 menit, setelah korban menginstal APK &ldquo;undangan nikah&rdquo;. Tim fraud berhasil hold Rp500 juta. Rp300 juta sudah ditarik tunai dan diteruskan.</p>
        <p><strong>Pertanyaan:</strong> (a) Petakan ke 7 tahap kill chain — di tahap mana intervensi paling murah <em>seharusnya</em> bisa menggagalkan ini? (b) Rp300 juta yang hilang: apakah ini kegagalan fraud, AML, atau cyber? (c) Satu perbaikan proses apa yang paling berdampak untuk 90 hari ke depan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Tahap Delivery/Exploitation.</strong> APK disebar via WA blast — operator seluler + tim cyber bisa memblokir nomor/URL penyebar jauh sebelum korban menginstal. Biaya: murah (blokir nomor). Yang terjadi: tidak ada yang memonitor vektor WA karena &ldquo;bukan kanal resmi bank&rdquo;.</p>
          <p>(b) <strong>Kegagalan berlapis, bukan satu tim.</strong> Cyber gagal menutup vektor (delivery), fraud telat 20 menit (harusnya velocity rule menahan transfer ke-3, bukan ke-14), AML tidak punya daftar mule (14 rekening baru tanpa riwayat seharusnya flag). Menyalahkan satu tim = mengulanginya.</p>
          <p>(c) <strong>Velocity rule + hold otomatis untuk transfer ke rekening baru</strong>: &ldquo;lebih dari 3 transfer ke rekening &lt;7 hari dalam 1 jam → tahan 30 menit + notifikasi&rdquo;. Murah, langsung memotong tahap monetize, dan memberi waktu untuk (a) dan (b) bekerja. Ini jembatan ke FR5 (rule-based).</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Fraud vs AML</h2>
      <details className="worked">
        <summary>Q1: Bisakah satu tim menangani keduanya?</summary>
        <p>Bisa di perusahaan kecil/menengah — dengan <strong>dua topi yang jelas</strong>: SOP &ldquo;topi fraud&rdquo; (cepat, otomatis, selamatkan dana) dan SOP &ldquo;topi AML&rdquo; (teliti, dokumentasi, laporkan). Yang gagal adalah tim yang memakai <em>satu</em> SOP untuk keduanya: terlalu lambat untuk fraud, terlalu ceroboh untuk AML. Di skala besar, pisahkan — karena <em>skill &amp; temperamen</em> yang dibutuhkan berbeda: fraud butuh operator cepat, AML butuh investigator teliti.</p>
      </details>
      <details className="worked">
        <summary>Q2: STR ke PPATK vs laporan ke polisi — mana dulu?</summary>
        <p><strong>Keduanya, jalurnya beda.</strong> STR = kewajiban intelijen keuangan ke PPATK (bukan tuduhan, tapi &ldquo;ini mencurigakan&rdquo;). Laporan polisi = saat ada <em>tindak pidana konkret</em> dengan korban/kerugian (misal nasabah melapor dananya dicuri). STR tidak butuh korban; laporan polisi butuh. Praktik: STR jalan terus sebagai kewajiban; laporan polisi dibuat paralel jika ada unsur pidana yang jelas. Jangan menunggu yang satu untuk mengerjakan yang lain.</p>
      </details>
      <details className="worked">
        <summary>Q3: Kenapa investigasi AML lambat sekali — tidak bisa dipercepat dengan AI?</summary>
        <p>Sebagian bisa (graph analytics memetakan jaringan dalam jam, bukan minggu). Tapi <strong>bottleneck-nya bukan analisis — melainkan pembuktian</strong>: setiap klaim harus didukung dokumen yang tahan di pengadilan, setiap langkah harus legal (tidak boleh tipping-off, harus jaga chain of custody data). AI mempercepat <em>menemukan</em>; ia tidak mempercepat <em>membuktikan</em>. Ekspektasi yang benar: AI memotong 70% waktu eksplorasi, 0% waktu verifikasi hukum.</p>
      </details>
      <details className="worked">
        <summary>Q4: Contoh kasus yang 100% keduanya?</summary>
        <p><strong>Phishing + mule + layering:</strong> korban phishing kehilangan Rp800jt (fraud — pencurian). Dana masuk ke 12 rekening mule, diputar 3 bank, dibelikan kripto (AML — pencucian). Tim fraud bekerja di jam-jam pertama (bekukan, selamatkan sisa dana); tim AML bekerja di minggu-minggu berikutnya (petakan jaringan, STR). <strong>Satu uang, dua kejahatan, dua timeline</strong> — inilah kenapa lesson ini ada.</p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Model recall 99%, FPR 1%, base rate fraud 0,2%. Berapa presisi alert (P(fraud|alert))?"
        options={[
          "99% — sesuai recall",
          "Sekitar 17% — mayoritas alert adalah false positive",
          "50%",
          "1%",
        ]}
        correct={1}
        explanation="Benar: ~16,6%. P(alert) = 0,99×0,002 + 0,01×0,998 = 0,01196; presisi = 0,00198/0,01196 ≈ 17%. Inilah base rate fallacy — model '99% akurat' tetap menghasilkan 83% false positive saat fraud langka."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dana hasil penipuan dipecah ke 20 rekening lalu dikirim ke luar negeri. Ini ranah utama…"
        options={[
          "Fraud — karena uangnya hasil tipu",
          "Cyber — karena pakai internet banking",
          "AML — karena ini layering, fokusnya asal-usul dan pelaporan dana",
          "Customer service",
        ]}
        correct={2}
        explanation="Benar: AML. Pertanyaan AML bukan 'apakah uang ini dicuri?' (itu fraud) melainkan 'apakah asal dana ini disamarkan?' — dan jawabannya menuntut investigasi + STR ke PPATK."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam kill chain, mengapa tahap 'monetize' paling mahal untuk diintervensi?"
        options={[
          "Karena butuh antivirus mahal",
          "Karena uang sudah bergerak — menahannya berarti menggesek nasabah legit (friction) dan berpacu dengan waktu",
          "Karena tahap ini tidak penting",
          "Karena tidak ada datanya",
        ]}
        correct={1}
        explanation="Benar: di tahap monetize, tiap detik = uang hilang, dan intervensi (hold dana) mengganggu nasabah normal. Tahap kiri murah tapi berisik; tahap kanan tepat tapi mahal — makanya pertahanan harus berlapis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. 'Fraud = hacker membobol server bank.' Pernyataan ini…"
        options={[
          "Benar sepenuhnya",
          "Salah — sebagian besar fraud tidak membobol sistem; ia mengeksploitasi kepercayaan (phishing, socrek, mule)",
          "Benar untuk APP scam",
          "Tidak bisa ditentukan",
        ]}
        correct={1}
        explanation="Benar: salah. Pembobolan sistem adalah ranah cyber. Fraud modern mayoritas memakai jalur 'sah' — OTP yang diberikan korban sendiri, akun yang dibajak via phishing, transfer sukarela."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Tiga tim (fraud/AML/cyber) menangani satu kasus berlapis. Urutan respons yang benar…"
        options={[
          "AML dulu (laporan), baru fraud",
          "Cyber forensik dulu sampai tuntas, baru yang lain",
          "Fraud selamatkan uang (menit) → cyber tutup vektor (jam) → AML susun laporan (hari)",
          "Bersamaan tanpa koordinasi",
        ]}
        correct={2}
        explanation="Benar: uang dulu, forensik kemudian, laporan terakhir. Menunda hold dana demi 'forensik tuntas' berarti memberi penyerang waktu menarik uangnya."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Fraud</strong> = transaksi tidak sah (uang hilang sekarang); <strong>AML</strong> = asal dana disamarkan (lapor ke PPATK); <strong>Cyber</strong> = sistem dibobol. Tiga pertanyaan, tiga metrik, tiga horizon.</li>
          <li><strong>Base rate fallacy</strong>: <Tex math={String.raw`P(\text{fraud}\mid\text{alert})`} /> ditentukan model × base rate — model 99% pun menghasilkan 83% false positive saat fraud 0,2%.</li>
          <li><strong>Kill chain 7 tahap</strong>: penyerang harus lolos semua tahap, defender cukup gagalkan satu — kiri murah-berisik, kanan mahal-tepat.</li>
          <li><strong>Siklus fraud berputar</strong>: output serangan ini = modal serangan berikutnya. Analisis aliran, bukan titik.</li>
          <li>Kasus irisan butuh <strong>meja bersama</strong> dengan urutan: selamatkan uang → tutup vektor → susun laporan.</li>
          <li>Kapan TIDAK pakai lensa fraud: saat pertanyaannya soal kepatuhan pelaporan (AML) atau kebocoran sistem (cyber) — paksa masuk ke lensa fraud = salah obat.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr1-lanskap-fraud" className="btn btn-secondary btn-sm">← FR1</Link>
        <Link href="/learn/fr3-data-fraud" className="btn btn-primary btn-sm">Next: FR3 →</Link>
      </div>
    </div>
  );
}
