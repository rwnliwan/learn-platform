"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr19Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const psiData = [
    {
      x: ["300–450", "450–550", "550–650", "650–750", "750–850"],
      y: [5, 15, 35, 30, 15],
      type: "bar",
      name: "Distribusi training (%)",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["300–450", "350–550", "550–650", "650–750", "750–850"],
      y: [12, 25, 30, 22, 11],
      type: "bar",
      name: "Distribusi kini (%)",
      marker: { color: "#ef9244" },
    },
  ];

  const hlData = [
    {
      x: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
      y: [1.0, 1.5, 2.0, 2.8, 3.5, 4.5, 6.0, 8.0, 11.0, 15.0],
      type: "bar",
      name: "PD prediksi (%)",
      marker: { color: "#2a7de1" },
    },
    {
      x: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"],
      y: [0.8, 1.2, 1.8, 2.5, 5.5, 4.2, 5.8, 7.5, 14.0, 13.5],
      type: "scatter",
      mode: "markers",
      name: "Aktual (%)",
      marker: { color: "#ef4444", size: 10 },
    },
  ];

  const validationPillarsData = [
    {
      x: ["Diskriminasi", "Kalibrasi", "Stabilitas", "Benchmark"],
      y: [85, 60, 45, 70],
      type: "bar",
      marker: { color: ["#3aa655", "#e8a838", "#ef4444", "#2a7de1"] },
      text: ["Lolos", "Waspada", "Gagal", "Lolos"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: PSI — apakah populasi bergeser?
# PSI = jumlah (aktual% - ekspektasi%) * ln(aktual% / ekspektasi%)
import math

training = [5, 15, 35, 30, 15]   # % per band skor saat model dibangun
kini     = [12, 25, 30, 22, 11]  # % per band skor SAAT INI
bands    = ["300-450", "450-550", "550-650", "650-750", "750-850"]

psi = 0
print(f"{'Band':<10} {'Train%':>7} {'Kini%':>6} {'Kontribusi':>11}")
for b, t, k in zip(bands, training, kini):
    t, k = t/100, k/100
    kontrib = (k - t) * math.log(k / t)
    psi += kontrib
    print(f"{b:<10} {t*100:>6.0f}% {k*100:>5.0f}% {kontrib:>10.4f}")
print(f"\nPSI = {psi:.4f}")
print("Aturan: <0.10 OK; 0.10-0.25 waspada; >0.25 GESER SIGNIFIKAN.")
print()
print("Coba: ubah 'kini' jadi sama persis dengan training -> PSI = 0.")
print("Lalu ubah drastis (misal [30,30,20,10,10]) -> PSI meledak.")`;

  const lab2Code = `# Lab 2: Hosmer-Lemeshow — uji kalibrasi per desil
# Bagi prediksi ke 10 desil, bandingkan prediksi vs aktual per desil.
import math

pred = [1.0, 1.5, 2.0, 2.8, 3.5, 4.5, 6.0, 8.0, 11.0, 15.0]  # %
aktu = [0.8, 1.2, 1.8, 2.5, 5.5, 4.2, 5.8, 7.5, 14.0, 13.5]  # %
n = 1000  # observasi per desil

hl = 0
print(f"{'Desil':<6} {'Pred%':>6} {'Akt%':>6} {'Kontribusi':>11}")
for i, (p, a) in enumerate(zip(pred, aktu), 1):
    p, a = p/100, a/100
    e_bad, o_bad = n*p, n*a
    kontrib = (o_bad - e_bad)**2 / (e_bad * (1-p))
    hl += kontrib
    flag = " <-- !" if abs(a-p)/p > 0.3 else ""
    print(f"D{i:<5} {p*100:>5.1f}% {a*100:>5.1f}% {kontrib:>10.2f}{flag}")
print(f"\nStatistik HL = {hl:.2f} (df=8; kritis 5% = 15.5)")
print("HL > 15.5 -> TOLAK kecocokan (miskalibrasi).")
print()
print("Lihat D5: aktual 5.5% vs prediksi 3.5% (+57%!) — desil inilah")
print("yang membuat HL jebol. Investigasi: ada apa di band skor D5?")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR19 — Credit Risk Analyst</span>
        <h1 className="display-title">Validasi Model:<br />Gini, KS, PSI &amp; Ujian Kejujuran</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model Sempurna yang Menipu</a></li>
          <li><a href="#pilar">Empat Pilar Validasi</a></li>
          <li><a href="#diskriminasi">Pilar 1: Diskriminasi (Gini, KS)</a></li>
          <li><a href="#kalibrasi">Pilar 2: Kalibrasi (Hosmer-Lemeshow)</a></li>
          <li><a href="#stabilitas">Pilar 3: Stabilitas (PSI)</a></li>
          <li><a href="#benchmark">Pilar 4: Benchmark &amp; Dokumentasi</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung PSI</a></li>
          <li><a href="#lab2">🔬 Lab 2: Uji Hosmer-Lemeshow</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Lolos, Bersyarat, atau Tolak?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Validasi yang "Lolos" — Benarkah?</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 4 pilar validasi model: diskriminasi, kalibrasi, stabilitas, benchmark.</li>
          <li>Menghitung &amp; menginterpretasikan PSI dan uji Hosmer-Lemeshow.</li>
          <li>Membedakan validasi development vs validasi independen (model risk).</li>
          <li>Menyusun kerangka dokumentasi model yang memenuhi ekspektasi OJK/auditor.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Model Sempurna yang Menipu</h2>
      <div className="story">
        <p>Tim modeling Bank Nusantara merayakan: model PD baru mencapai <strong>Gini 0,72</strong> — tertinggi sepanjang sejarah! Deploy disetujui. Tiga bulan kemudian, CKPN meleset <strong>Rp 300 miliar</strong> dari proyeksi.</p>
        <p>Investigasi validator independen menemukan tiga dosa:</p>
        <ul>
          <li><strong>Gini dihitung dari data training</strong> — bukan out-of-time. Di data baru: 0,48.</li>
          <li><strong>Kalibrasi tidak pernah diuji</strong> — PD prediksi 4%, aktual 7%.</li>
          <li><strong>Populasi bergeser</strong> — PSI 0,31 (segmen baru masuk), tidak ada yang memantau.</li>
        </ul>
        <p>Gini 0,72 itu <strong>benar dihitung, salah dimaknai</strong> — seperti nilai ujian yang bocor soalnya.</p>
        <p><strong>Twist-nya:</strong> validasi bukan "cap stempel" — melainkan <strong>ujian kejujuran berlapis</strong>. Lesson ini mengajarkan 4 pilarnya — dan mengapa validator harus <strong>independen</strong> dari pembuat model (seperti wasit tidak boleh dari tim yang bertanding).</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="pilar">Empat Pilar Validasi</h2>
      <p><strong>Definisi.</strong> <strong>Validasi model</strong> = pengujian independen untuk memastikan model <strong>layak pakai</strong>. Empat pilar:</p>
      <ol>
        <li><strong>Diskriminasi</strong> — bisa membedakan bagus vs jelek? (Gini, KS, AUC)</li>
        <li><strong>Kalibrasi</strong> — angkanya benar? (Hosmer-Lemeshow, plot kalibrasi)</li>
        <li><strong>Stabilitas</strong> — masih relevan untuk populasi kini? (PSI, CSI)</li>
        <li><strong>Benchmark</strong> — lebih baik dari alternatif sederhana? (vs model naif/champion)</li>
      </ol>
      <p><strong>Prinsip emas:</strong> validasi dilakukan oleh <strong>pihak independen</strong> (bukan tim pembuat model) — standar global <strong>SR 11-7</strong> (model risk management). Di Indonesia: OJK mengawasi via ICAAP &amp; audit.</p>

      <PlotlyChart
        data={validationPillarsData}
        title="Dashboard Validasi: Empat Pilar (skor ilustrasi)"
        layout={{ xaxis: { title: "Pilar" }, yaxis: { title: "Skor kesehatan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = status satu pilar (label: lolos/waspada/gagal).</p>
        <p><strong>Interpretasi:</strong> diskriminasi lolos tapi <strong>stabilitas GAGAL</strong> — vonis keseluruhan: <strong>TOLAK bersyarat</strong> (atau batasi pakai). <strong>Pelajaran:</strong> validasi memakai <strong>aturan terlemah</strong> — satu pilar gagal = model tidak layak penuh. Seperti rantai: sekuat mata terlemah.</p>
      </div>

      <h2 id="diskriminasi">Pilar 1: Diskriminasi (Gini, KS)</h2>
      <p>Sudah dibahas di CR7b — <strong>rekap + peringatan validasi</strong>:</p>
      <ul>
        <li><strong>Gini</strong> = 2×AUC − 1. Patokan retail: 0,4–0,6 baik. <strong>Wajib out-of-time</strong> (bukan training!).</li>
        <li><strong>KS</strong> = jarak kumulatif maks Good vs Bad. Patokan: 20–60%.</li>
      </ul>
      <p><strong>Tiga dosa diskriminasi:</strong> (1) lapor Gini <strong>training</strong> (optimis palsu); (2) tidak bandingkan dengan <strong>baseline</strong> (model lama / skor biro kredit); (3) <strong>sample bias</strong> — Gini dihitung dari yang di-ACC saja (CR8!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> validator selalu bertanya: <strong>"Gini berapa di data yang BELUM PERNAH dilihat model?"</strong> (out-of-time: periode berbeda). Selisih Gini training vs OOT &gt;10 poin = <strong>overfitting</strong> — model menghafal, bukan belajar.</p>
      </div>

      <h2 id="kalibrasi">Pilar 2: Kalibrasi (Hosmer-Lemeshow)</h2>
      <p><strong>Definisi.</strong> <strong>Uji Hosmer-Lemeshow (HL)</strong> = uji statistik apakah PD prediksi <strong>cocok</strong> dengan default aktual <strong>per desil risiko</strong>. Cara: bagi populasi ke 10 desil (berdasarkan PD prediksi), hitung selisih prediksi vs aktual per desil:</p>
      <Tex math={String.raw`HL = \sum_{g=1}^{10} \frac{(O_g - E_g)^2}{E_g(1-\bar{p}_g)}`} block />
      <p><strong>Artinya tiap simbol:</strong> <Tex math={String.raw`O_g`} /> = jumlah default aktual di desil <Tex math={String.raw`g`} />; <Tex math={String.raw`E_g`} /> = jumlah default prediksi; <Tex math={String.raw`\bar{p}_g`} /> = rata-rata PD desil. HL besar = <strong>miskalibrasi</strong> (tolak kecocokan jika &gt;15,5 pada df=8, α=5%).</p>
      <p><strong>Kepribadian:</strong> HL seperti <strong>inspeksi timbangan pasar</strong> — tidak peduli timbangan bisa membedakan berat vs ringan (diskriminasi), tapi memastikan <strong>1 kg benar-benar 1 kg</strong> (kalibrasi). Timbangan yang "ranking benar tapi angka salah" menipu setiap transaksi.</p>

      <PlotlyChart
        data={hlData}
        title="Uji Kalibrasi per Desil: Prediksi vs Aktual"
        layout={{ xaxis: { title: "Desil risiko" }, yaxis: { title: "Default rate (%)" }, barmode: "group", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang biru = PD prediksi per desil; titik merah = aktual.</p>
        <p><strong>Interpretasi:</strong> desil D1–D4 &amp; D6–D10 cocok — tapi <strong>D5 meleset jauh</strong> (prediksi 3,5%, aktual 5,5%!). Inilah yang membuat HL jebol. <strong>Aksi validator:</strong> investigasi band skor D5 — ada apa di sana? (perubahan populasi? variabel rusak?). Kalibrasi yang baik = <strong>tidak ada desil yang meleset sistematis</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "HL lolos = model sempurna."</strong></p>
        <p><strong>Yang benar:</strong> HL hanya menguji <strong>kalibrasi rata-rata per desil</strong> — ia buta terhadap <em>ranking dalam desil</em> (diskriminasi) dan sensitif terhadap <strong>ukuran sampel</strong> (sampel raksasa = HL selalu "gagal" karena beda kecil jadi signifikan). Pakai HL <strong>bersama</strong> plot kalibrasi visual + Gini — tidak sendirian.</p>
      </div>

      <h2 id="stabilitas">Pilar 3: Stabilitas (PSI)</h2>
      <p><strong>Definisi.</strong> <strong>PSI</strong> (<em>Population Stability Index</em>) = ukuran <strong>pergeseran distribusi</strong> skor/variabel antara saat model dibangun vs kini:</p>
      <Tex math={String.raw`\text{PSI} = \sum_{\text{bin}} (\%\text{Kini} - \%\text{Training}) \times \ln\left(\frac{\%\text{Kini}}{\%\text{Training}}\right)`} block />
      <p><strong>Aturan:</strong> &lt;0,10 = stabil; 0,10–0,25 = waspada; &gt;0,25 = <strong>bergeser signifikan</strong> — model mungkin tidak relevan lagi.</p>
      <p><strong>Variannya:</strong> <strong>CSI</strong> (<em>Characteristic Stability Index</em>) = PSI per <strong>variabel input</strong> — menemukan <em>variabel mana</em> yang bergeser (misal: distribusi penghasilan berubah karena segmen baru).</p>

      <PlotlyChart
        data={psiData}
        title="Pergeseran Populasi: Training vs Kini (PSI = 0,31)"
        layout={{ xaxis: { title: "Band skor" }, yaxis: { title: "%" }, barmode: "group", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> biru = distribusi saat training; oranye = kini. Geser kiri = populasi memburuk.</p>
        <p><strong>Interpretasi:</strong> massa <strong>bergeser ke kiri</strong> (skor rendah): 300–450 naik 5%→12%. PSI = 0,31 &gt; 0,25 = <strong>tidak stabil</strong>. Model dilatih untuk "dunia kanan" tapi dipakai di "dunia kiri" — <strong>vonis: rekalibrasi/rebuild</strong>. (Hitung sendiri di Lab 1!)</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> PSI menjawab <strong>"apakah dunia masih sama?"</strong> — pertanyaan yang harus ditanyakan <strong>tiap bulan</strong>. Model dengan Gini sempurna tapi PSI 0,4 = mobil balap di jalan yang salah. Stabilitas adalah pilar yang paling sering diabaikan — dan paling sering membunuh model diam-diam.</p>
      </div>

      <h2 id="benchmark">Pilar 4: Benchmark &amp; Dokumentasi</h2>
      <p><strong>Benchmark:</strong> model baru harus <strong>dibandingkan</strong> dengan: (1) model lama (<em>champion</em>), (2) model sederhana (regresi 3 variabel), (3) skor biro kredit. Jika model ML kompleks hanya menang 1 poin Gini dari regresi logistik — <strong>pilih yang sederhana</strong> (mudah dijelaskan ke OJK!).</p>
      <p><strong>Dokumentasi</strong> (yang diperiksa OJK/auditor):</p>
      <ul>
        <li><strong>Tujuan &amp; ruang lingkup</strong> — untuk apa, untuk siapa, batasan.</li>
        <li><strong>Data &amp; metodologi</strong> — sumber, definisi default, window, asumsi.</li>
        <li><strong>Hasil validasi 4 pilar</strong> — lengkap dengan data &amp; kode.</li>
        <li><strong>Keterbatasan &amp; rencana monitoring</strong> — jujur soal kelemahan + trigger.</li>
        <li><strong>Persetujuan</strong> — komite + tanggal + versi.</li>
      </ul>
      <p><strong>Aturan SR 11-7:</strong> <em>"Jika tidak didokumentasikan, dianggap tidak dilakukan."</em></p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Dokumentasi = formalitas belaka."</strong></p>
        <p><strong>Yang benar:</strong> dokumentasi adalah <strong>bukti</strong> — satu-satunya yang dibaca OJK/auditor saat model dipertanyakan 3 tahun kemudian (saat pembuatnya sudah resign). Model tanpa dokumentasi = <strong>tidak bisa dipertahankan</strong> = tidak boleh dipakai untuk modal/CKPN.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Validator adalah Musuh yang Dibayar</h3>
      <p>Prinsip emas validasi — <strong>independen dari pembuat model</strong> — sering terasa tidak nyaman: "sudah capek membangun, malah dicari-cari salahnya." Tetapi inilah desain yang disengaja (standar global SR 11-7): <strong>pembuat model buta terhadap kebutaannya sendiri</strong>. Ia jatuh cinta pada modelnya (<em>confirmation bias</em>), ia tahu kelemahannya tetapi merasionalisasi ("ah, itu tidak penting"). Validator independen adalah <strong>musuh yang dibayar untuk menemukan apa yang kamu tidak bisa lihat</strong> — dan bank yang tidak punya fungsi ini sedang membiarkan model-modelnya hidup tanpa pemeriksaan.</p>
      <p>Intuisi kedua: <strong>empat pilar = empat pertanyaan yang tidak bisa saling menggantikan</strong>. Diskriminasi bagus + kalibrasi rusak = ranking benar, angka salah (CKPN salah). Kalibrasi bagus + diskriminasi rusak = angka rata-rata benar, tetapi tidak bisa membedakan siapa berisiko (cut-off tidak berguna). Stabilitas gagal = model untuk dunia yang sudah tidak ada. Benchmark gagal = model canggih yang kalah dari rata-rata sederhana (memalukan dan mahal). <strong>Satu pilar gagal = vonis bersyarat</strong> — tidak ada "rata-rata empat pilar".</p>
      <p>Intuisi ketiga tentang HL: uji Hosmer-Lemeshow sensitif terhadap <strong>ukuran sampel</strong> — dengan jutaan data, perbedaan kecil pun "signifikan" secara statistik (HL jebol padahal kalibrasi praktis baik-baik saja). Validator senior tidak membaca p-value HL secara membabi buta — ia melihat <strong>plot kalibrasi</strong>: seberapa besar deviasi aktual vs prediksi dalam <strong>satuan bisnis</strong> (basis poin PD)? Statistik tanpa konteks bisnis = angka tanpa makna.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Hitung PSI</h2>
      <p>Lima band skor, dua distribusi. Hitung sendiri PSI-nya.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator PSI"
        hint="Coba: (1) kini = training persis → PSI? (2) Ubah drastis → PSI? Rasakan ambang 0.10 dan 0.25. Pertanyaan: band mana kontribusinya terbesar? (Itulah yang diinvestigasi.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Uji Hosmer-Lemeshow</h2>
      <p>Sepuluh desil, satu statistik. Temukan desil yang "bocor".</p>
      <PyodideLab
        title="Lab 2 — Uji HL Manual"
        hint="Perhatikan kolom flag (!) — desil dengan selisih >30%. Coba perbaiki D5 (aktual 5.5 → 3.6): HL turun di bawah 15.5? Rasakan sensitivitasnya terhadap satu desil."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Lolos, Bersyarat, atau Tolak?</h2>

      <div className="decision-card">
        <h3>1. 4 pilar lolos → <strong>SETUJUI dengan monitoring</strong></h3>
        <p><strong>Kondisi:</strong> Gini OOT baik, HL lolos, PSI &lt;0,1, menang benchmark.</p>
        <p><strong>Aksi:</strong> deploy + monitoring bulanan (PSI, Gini OOT, bad rate per skor) + jadwal review tahunan.</p>
      </div>

      <div className="decision-card">
        <h3>2. Diskriminasi OK, kalibrasi gagal → <strong>REKALIBRASI (tidak perlu rebuild)</strong></h3>
        <p><strong>Kondisi:</strong> ranking benar, angka meleset.</p>
        <p><strong>Aksi:</strong> sesuaikan PD per grade/desil dengan faktor koreksi. Lebih murah &amp; cepat dari rebuild.</p>
      </div>

      <div className="decision-card">
        <h3>3. PSI &gt;0,25 → <strong>INVESTIGASI + siapkan rebuild</strong></h3>
        <p><strong>Kondisi:</strong> populasi bergeser.</p>
        <p><strong>Aksi:</strong> CSI per variabel — variabel mana bergeser? Sementara: batasi pakai / naikkan cut-off. Jangan "tunggu kembali normal".</p>
      </div>

      <div className="decision-card">
        <h3>4. Kalah benchmark dari model sederhana → <strong>PILIH SEDERHANA</strong></h3>
        <p><strong>Kondisi:</strong> ML kompleks ≈ regresi logistik.</p>
        <p><strong>Kenapa:</strong> kompleksitas harus "dibayar" dengan performa <em>signifikan</em> + explainability. OJK lebih mudah menerima yang sederhana.</p>
      </div>

      <div className="decision-card">
        <h3>5. Validator tidak independen → <strong>TOLAK prosesnya</strong></h3>
        <p><strong>Kondisi:</strong> yang memvalidasi = yang membuat.</p>
        <p><strong>Kenapa:</strong> SR 11-7: independensi = syarat mutlak. Wasit tidak boleh dari tim yang bertanding.</p>
      </div>

            <div className="decision-card">
        <h3>6. Model baru Gini 0,55 vs model lama 0,54 — tim model ingin mengganti → <strong>tolak penggantian (belum terbayar)</strong></h3>
        <p><strong>Kondisi:</strong> tim modeling membangun model ML baru (gradient boosting): Gini out-of-time 0,55 vs model logistik lama 0,54. Mereka bersemangat: "lebih baik!"</p>
        <p><strong>Aksi:</strong> <strong>jangan ganti</strong> — selisih 0,01 Gini tidak membayar biaya: (1) <strong>kompleksitas</strong> — GBM sulit dijelaskan ke OJK/auditor/nasabah (isu explainability, CR24); (2) <strong>risiko implementasi</strong> — pipeline baru, monitoring baru, dokumentasi baru; (3) <strong>stabilitas</strong> — model kompleks lebih rentan overfit pada pergeseran populasi. Aturan praktis: ganti model hanya jika <strong>perbaikan material</strong> (misal +0,03 Gini atau perbaikan kalibrasi signifikan) ATAU ada kebutuhan non-statistik (fitur baru, regulasi). "Sedikit lebih baik" bukan alasan mengganti — melainkan alasan <strong>tetap</strong>.</p>
        <p><strong>Contoh nyata:</strong> banyak bank Indonesia tetap memakai regresi logistik + WoE untuk scorecard justru karena alasan ini — bukan karena tidak bisa ML, melainkan karena <strong>trade-off explainability vs akurasi</strong> dimenangkan oleh yang sederhana. Kecanggihan yang tidak bisa dijelaskan = liabilitas regulasi.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>4 pilar:</strong> diskriminasi, kalibrasi, stabilitas, benchmark.</li>
          <li><strong>Selalu out-of-time.</strong> Gini training = dongeng.</li>
          <li><strong>PSI bulanan.</strong> Dunia berubah — model harus dicek.</li>
          <li><strong>Tidak didokumentasikan = tidak dilakukan.</strong></li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Membaca Laporan Validasi: Panduan 10 Menit</h3>
      <p>Diberi laporan validasi 100 halaman? Baca 10 menit dengan urutan ini — dari vonis ke bukti.</p>
      <ol>
        <li><strong>Menit 0–2: cari VONISNYA</strong> — Lolos / lolos bersyarat / tolak — langsung ke kesimpulan. Vonis menentukan segalanya; detail hanya menjelaskan.</li>
        <li><strong>Menit 2–4: baca SYARATNYA</strong> — Jika bersyarat: apa syaratnya? Syarat yang diabaikan = temuan tahun depan. Catat dengan deadline.</li>
        <li><strong>Menit 4–6: cek 4 pilar (traffic light)</strong> — Diskriminasi? Kalibrasi? Stabilitas? Benchmark? Satu merah = vonis bersyarat minimal. Dua merah = tolak.</li>
        <li><strong>Menit 6–8: cek independensi</strong> — Siapa validatornya? Tim sendiri = tidak independen = laporan tidak kredibel (SR 11-7).</li>
        <li><strong>Menit 8–10: cek tindak lanjut temuan lama</strong> — Temuan tahun lalu sudah diperbaiki? Tidak = masalah governance — model bermasalah DAN manajemennya.</li>
        <li><strong>Bonus: cek tanggal data</strong> — Validasi dari data 2 tahun lalu = kedaluwarsa saat terbit. Minta yang terkini.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> sepuluh menit untuk memilah laporan 100 halaman. Yang penting bukan tebalnya — melainkan vonis, syarat, dan tindak lanjutnya.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Validasi model di Indonesia diatur OJK dan dipraktikkan dengan tantangan data yang khas.</p>

      <h3>Regulasi: OJK Menuntut Validasi Independen</h3>
      <p>OJK mewajibkan bank (terutama yang memakai model internal untuk modal/ECL) memiliki <strong>fungsi validasi independen</strong> — terpisah dari tim pengembang model. Untuk bank yang mengajukan <strong>IRB</strong>, validasi adalah syarat persetujuan: OJK me-review metodologi, hasil validasi, dan governance sebelum mengizinkan. Praktiknya: bank-bank besar Indonesia punya <strong>tim validasi</strong> (atau memakai konsultan independen) yang menerbitkan <strong>laporan validasi tahunan</strong> per model.</p>
      <p>Empat pilar (diskriminasi, kalibrasi, stabilitas, benchmark) adalah <strong>bahasa umum</strong> validator Indonesia — laporan validasi yang tidak mencakup keempatnya dianggap tidak lengkap.</p>

      <h3>Tantangan Data Tipis: Validasi dengan Sampel Kecil</h3>
      <p>Masalah khas Indonesia: <strong>sedikit default</strong> untuk validasi. Uji HL butuh cukup default per desil — jika total default hanya 50, tiap desil punya ~5 default: uji statistiknya <strong>tidak bertenaga</strong> (<em>low power</em>). Praktik yang diterima:</p>
      <ul>
        <li><strong>Pooling data</strong> antar periode (out-of-time multi-tahun) untuk menambah sampel.</li>
        <li><strong>Benchmark eksternal:</strong> bandingkan dengan data Pefindo, data regional, atau <em>prior</em> literatur.</li>
        <li><strong>Uji kualitatif yang diperkuat:</strong> jika statistik lemah, dokumentasi <em>expert judgment</em> dan <em>reasonableness check</em> menjadi lebih penting — bukan diabaikan.</li>
        <li><strong>Margin of conservatism:</strong> jika validasi tidak konklusif karena data tipis, tambahkan margin konservatif pada PD — ketidakpastian dihargai, bukan diabaikan.</li>
      </ul>

      <h3>Tiga Dosa yang Paling Sering Ditemukan</h3>
      <p>Dari pengalaman validasi di industri:</p>
      <ul>
        <li><strong>Dosa 1 — Gini training:</strong> melaporkan Gini dari data latih (0,65!) tanpa out-of-time. Validator mengulang di data baru: 0,42. Vonis: <em>overfitting</em>.</li>
        <li><strong>Dosa 2 — PSI diabaikan:</strong> model 3 tahun tidak dimonitor, PSI 0,4 — populasi sudah berganti total. Vonis: model kedaluwarsa.</li>
        <li><strong>Dosa 3 — tidak ada benchmark:</strong> model ML canggih Gini 0,55 — ternyata regresi logistik sederhana Gini 0,54. Vonis: kompleksitas tidak terbayar — pakai yang sederhana (lebih mudah dijelaskan ke OJK).</li>
      </ul>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: membaca laporan validasi (klik untuk buka)</summary>
        <p>Ringkasan validasi scorecard KTA: Gini out-of-time 0,52 (training 0,58) ✓ | HL p-value 0,03 (jebol!) | PSI 0,18 (waspada) | Benchmark: model lama Gini 0,50.</p>
        <p><strong>Langkah 1 — diskriminasi:</strong> 0,52 out-of-time, turun tipis dari training — <strong>wajar</strong> (sedikit overfit, masih baik). Lebih baik dari model lama (0,50) — benchmark lolos.<br />
        <strong>Langkah 2 — kalibrasi:</strong> HL jebol (p&lt;0,05). Tetapi n = 2 juta — dengan sampel raksasa, deviasi kecil pun signifikan. <strong>Cek plot kalibrasi:</strong> deviasi maks 0,3 poin PD — <strong>tidak material</strong> secara bisnis. Vonis: kalibrasi OK dengan catatan.<br />
        <strong>Langkah 3 — stabilitas:</strong> PSI 0,18 = waspada — monitor kuartalan, siapkan rekalibrasi.<br />
        <strong>Langkah 4 — vonis keseluruhan:</strong> <strong>LOLOS BERSYARAT</strong> — boleh dipakai, dengan monitoring PSI kuartalan + rekalibrasi terjadwal 12 bulan.</p>
        <p><strong>Pelajaran:</strong> validasi bukan "lulus/gagal" biner — melainkan <strong>penilaian berlapis</strong> dengan syarat. Validator yang baik memberi jalan maju, bukan sekadar palu.</p>
      </details>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat membaca laporan validasi, cari kalimat vonisnya dulu ("lolos bersyarat"), lalu baca <strong>syaratnya</strong> — di sanalah pekerjaanmu. Syarat validasi yang diabaikan = temuan audit tahun depan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Validasi yang "Lolos" — Benarkah?</h2>
      <div className="callout">
        <p>Vendor model mengklaim: <strong>"Model kami lolos validasi!"</strong> dengan bukti:</p>
        <ul>
          <li>Gini <strong>0,68</strong> — dihitung dari <strong>data training</strong>.</li>
          <li>"Kalibrasi baik" — <strong>tanpa</strong> uji HL / plot kalibrasi.</li>
          <li>PSI <strong>tidak dihitung</strong> ("populasi pasti stabil").</li>
          <li>Validasi dilakukan oleh <strong>tim vendor sendiri</strong>.</li>
          <li>Harga: <strong>Rp 5 miliar</strong> + maintenance tahunan.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai kepala validasi independen, tulis 4 keberatan + keputusanmu.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Keputusan: TOLAK klaim "lolos" — minta validasi ulang independen.</strong> Empat keberatan:</p>
          <p>(1) <strong>Gini training 0,68 = tidak valid.</strong> Minta Gini out-of-time + bandingkan dengan model internal saat ini (benchmark).<br />
          (2) <strong>Kalibrasi tanpa bukti = tidak ada.</strong> Minta uji HL + plot kalibrasi per desil — untuk ECL, angka yang menentukan rupiah.<br />
          (3) <strong>PSI wajib dihitung</strong> — "pasti stabil" bukan argumen, melainkan asumsi yang harus diuji.<br />
          (4) <strong>Tidak independen</strong> — melanggar SR 11-7. Vendor memvalidasi produk sendiri = penjual menilai dagangannya.</p>
          <p>Pelajaran: <strong>"lolos validasi" tanpa 4 pilar + independensi = klaim pemasaran</strong>, bukan validasi.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Vonis Validasi — Lolos, Gagal, atau Bersyarat?</h2>
      <div className="callout">
        <p>Kamu validator independen. Laporan validasi model PD UKM:</p>
        <ul>
          <li>Diskriminasi: Gini out-of-time 0,47 (training 0,61) — turun 14 poin.</li>
          <li>Kalibrasi: HL lolos (p=0,35); plot kalibrasi cocok.</li>
          <li>Stabilitas: PSI 0,32 (distribusi skor bergeser kiri — populasi memburuk).</li>
          <li>Benchmark: vs model lama Gini 0,45 — sedikit lebih baik.</li>
          <li>Konteks: model dilatih 2021 (boom), divalidasi 2024 (perlambatan).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apa vonismu (lolos / lolos bersyarat / tolak)? Susun syarat/larangan yang konkret.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Vonis: LOLOS BERSYARAT KETAT — dengan pembatasan penggunaan.</strong></p>
          <p><strong>Analisis:</strong> (1) Gini turun 14 poin training→OOT = <strong>overfit signifikan</strong> + populasi bergeser (PSI 0,32 mengonfirmasi). (2) Kalibrasi lolos — angkanya masih bisa dipercaya rata-rata. (3) Benchmark: sedikit lebih baik dari model lama — tidak ada alasan kembali ke lama.</p>
          <p><strong>Syarat konkret:</strong> (a) <strong>larangan</strong> memakai model untuk segmen/portofolio baru sampai rebuild; (b) <strong>rekalibrasi + refit</strong> dengan data 2022–2024 dalam 6 bulan; (c) <strong>monitoring bulanan</strong> (bukan kuartalan) untuk Gini OOT dan PSI sampai rebuild selesai; (d) <strong>margin of conservatism</strong> +15% pada PD untuk ECL sementara (ketidakpastian dihargai); (e) laporkan ke komite risiko sebagai <strong>temuan</strong>, bukan catatan kaki.</p>
          <p><strong>Pelajaran:</strong> validator yang baik tidak hanya memvonis — ia memberi <strong>jalan maju yang aman</strong>. "Tolak" tanpa syarat = bank lumpuh; "lolos" tanpa syarat = bank buta. Bersyarat = bank berjalan dengan tongkat.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Vendor melaporkan Gini 0,68 dari data training. Reaksimu?"
        options={[
          "Bagus — beli!",
          "Minta Gini out-of-time — Gini training optimis palsu (overfitting); selisih >10 poin = model menghafal",
          "Gini tidak penting",
          "Minta didiskon",
        ]}
        correct={1}
        explanation="Benar: selalu out-of-time. Model yang 'sempurna' di data training tapi ambruk di data baru = menghafal, bukan belajar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Uji Hosmer-Lemeshow menguji apa?"
        options={[
          "Daya beda model (ranking)",
          "Kecocokan kalibrasi: apakah PD prediksi cocok dengan aktual per desil risiko — 'timbangan' model",
          "Stabilitas populasi",
          "Kecepatan komputasi",
        ]}
        correct={1}
        explanation="Benar: HL = inspeksi timbangan. Diskriminasi (Gini) = bisa membedakan; kalibrasi (HL) = angkanya benar. Keduanya wajib."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. PSI = 0,31. Artinya dan aksinya?"
        options={[
          "Stabil — lanjutkan",
          "Populasi bergeser signifikan (>0,25) — investigasi via CSI, siapkan rekalibrasi/rebuild; model dilatih untuk 'dunia lama'",
          "PSI tidak penting",
          "Naikkan cut-off saja",
        ]}
        correct={1}
        explanation="Benar: 0,31 > 0,25 = tidak stabil. Model = mobil balap di jalan yang salah. Cari tahu apa yang bergeser sebelum percaya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Model ML kompleks (Gini 0,61) vs regresi logistik (Gini 0,60). Pilih?"
        options={[
          "ML — lebih canggih",
          "Regresi logistik — selisih 1 poin tidak membayar kompleksitas + explainability; OJK lebih mudah menerima yang sederhana",
          "Gabungkan keduanya",
          "Buang keduanya",
        ]}
        correct={1}
        explanation="Benar: kompleksitas harus dibayar dengan performa signifikan. 1 poin Gini = tidak cukup untuk black box yang sulit dijelaskan ke regulator."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Mengapa validator harus independen dari pembuat model?"
        options={[
          "Supaya ada kerjaan",
          "SR 11-7: konflik kepentingan — pembuat model buta terhadap kelemahannya sendiri; wasit tidak boleh dari tim yang bertanding",
          "Agar lebih mahal",
          "Tidak perlu — buang waktu",
        ]}
        correct={1}
        explanation="Benar: independensi = syarat mutlak model risk management. Validasi sendiri = penjual menilai dagangannya sendiri."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Model ML baru Gini 0,55 vs model logistik lama 0,54. Tim model ingin mengganti. Keputusan validasi?"
        options={[
          "Setuju — lebih tinggi selalu lebih baik",
          "Tolak penggantian: selisih 0,01 tidak membayar biaya kompleksitas, risiko implementasi, dan isu explainability — ganti hanya jika perbaikan material",
          "Setuju — ML selalu lebih baik",
          "Serahkan ke direksi",
        ]}
        correct={1}
        explanation="Benar: trade-off explainability vs akurasi. Model sederhana yang bisa dijelaskan ke OJK/auditor/nasabah sering mengalahkan model canggih yang beda tipis. Ganti hanya jika perbaikan material atau ada kebutuhan non-statistik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Uji Hosmer-Lemeshow jebol (p&lt;0,05) pada n=2 juta, tetapi deviasi maks plot kalibrasi hanya 0,3 poin PD. Interpretasi?"
        options={[
          "Model gagal total — buang",
          "Dengan sampel raksasa, deviasi kecil pun signifikan statistik; yang penting materialitas bisnis — 0,3 poin tidak material → kalibrasi OK dengan catatan",
          "HL tidak pernah penting",
          "Naikkan PD 10% untuk aman",
        ]}
        correct={1}
        explanation="Benar: HL sensitif ukuran sampel. Validator senior membaca plot kalibrasi dalam satuan bisnis (basis poin), bukan sekadar p-value. Statistik tanpa konteks bisnis = angka tanpa makna."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>4 pilar</strong>: diskriminasi (Gini/KS), kalibrasi (HL), stabilitas (PSI/CSI), benchmark.</li>
          <li><strong>Selalu out-of-time</strong> — Gini training = dongeng.</li>
          <li><strong>HL</strong> = uji kecocokan per desil; <strong>PSI</strong> = pergeseran populasi (&gt;0,25 = bahaya).</li>
          <li><strong>Validator independen</strong> (SR 11-7) — bukan pembuat model.</li>
          <li><strong>Dokumentasi = bukti</strong> — tidak didokumentasikan = tidak dilakukan.</li>
          <li>Kapan TIDAK perlu validasi penuh: perubahan kecil (rekalibrasi) — tapi tetap uji dampaknya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr18-industry-country-risk" className="btn btn-secondary btn-sm">← CR18</Link>
        <Link href="/learn/cr20-monitoring-kri" className="btn btn-primary btn-sm">Next: CR20 →</Link>
      </div>
    </div>
  );
}
