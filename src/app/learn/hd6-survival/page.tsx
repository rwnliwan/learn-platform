"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd6SurvivalPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd6KmData = [{"x": [0, 3, 3, 6, 6, 12, 12], "y": [1.0, 1.0, 0.8, 0.8, 0.533, 0.533, 0.0], "type": "scatter", "mode": "lines", "name": "KM", "line": {"color": "#2a7de1", "shape": "hv"}}, {"x": [5, 8], "y": [0.8, 0.533], "type": "scatter", "mode": "markers", "name": "Tersensor", "marker": {"color": "#e8a838", "symbol": "x", "size": 10}}];
  const hd6KmDataLayout = {"xaxis": {"title": "Bulan"}, "yaxis": {"title": "Probabilitas survival", "range": [0, 1.05]}, "showlegend": true};

  const lab1Code = "data = [(3,1),(5,0),(6,1),(8,0),(12,1)]  # (waktu, 1=kejadian/0=sensor)\ndata.sort()\nn = len(data)\nS = 1.0\nprint(f\"{'waktu':>6} {'status':>8} {'n_risiko':>9} {'S(t)':>7}\")\nberisiko = n\nfor t, status in data:\n    if status == 1:\n        S *= (1 - 1/berisiko)\n        print(f'{t:>6}  kejadian {berisiko:>9} {S:>7.3f}')\n    else:\n        print(f'{t:>6}  tersensor {berisiko:>9} {S:>7.3f}  <- kurva tidak turun')\n    berisiko -= 1\nprint()\nprint(f'Survival akhir = {S:.3f}')";

  const lab2Code = "import random, statistics as st\nrandom.seed(3)\nlam, HR, n = 0.1, 0.7, 500  # hazard kontrol, HR obat, n per kelompok\np_sensor = 0.3\ndef bangkitkan(hazard):\n    out = []\n    for _ in range(n):\n        t = random.expovariate(hazard)          # waktu kejadian\n        c = random.expovariate(0.05)            # waktu sensor\n        out.append((min(t, c), 1 if t <= c else 0))\n    return out\nkontrol = bangkitkan(lam); obat = bangkitkan(lam*HR)\nmed = lambda d: st.median([t for t, s in d if s == 1])\nhr_est = med(kontrol)/med(obat)  # utk eksponensial: HR = median_kontrol/median_obat\nprint(f'median kontrol = {med(kontrol):.1f}, median obat = {med(obat):.1f}')\nprint(f'estimasi HR = {hr_est:.2f} (sebenarnya {HR})')\nprint(f'proporsi tersensor: kontrol {sum(1-s for _,s in kontrol)/n:.0%}, '\n      f'obat {sum(1-s for _,s in obat)/n:.0%}')";

  const hd6HrData = [{"y": ["Obat baru", "Usia (+10 thn)", "Diabetes", "Merokok"], "x": [0.7, 1.4, 1.8, 2.1], "type": "bar", "orientation": "h", "marker": {"color": ["#2a7de1", "#e8a838", "#e8a838", "#e8a838"]}, "text": ["0.70", "1.40", "1.80", "2.10"], "textposition": "outside"}];
  const hd6HrDataLayout = {"xaxis": {"title": "Hazard Ratio (garis 1 = netral)"}, "shapes": [{"type": "line", "x0": 1, "x1": 1, "y0": -0.5, "y1": 3.5, "line": {"dash": "dash", "color": "#94a3b8"}}], "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD6 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Kaplan-Meier &amp; Cox:<br />Analisis Waktu Kejadian</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Pasien yang “Hilang”</a></li>
          <li><a href="#sensor">Sensor &amp; Kurva Kaplan-Meier</a></li>
          <li><a href="#logrank">Log-Rank Test</a></li>
          <li><a href="#cox">Model Cox Proportional Hazards</a></li>
          <li><a href="#competing">Competing Risks</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Kurva KM Manual</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Hazard Ratio</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Dua Kurva Bersilangan</a></li>
          <li><a href="#wawasan">🧠 Wawasan: HR Bukan Risk Ratio</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Loss to Follow-Up TB</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Dari Tabel Hidup ke Hazard Ratio</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>sensor kanan</strong> dan mengapa menghapus pasien tersensor merusak analisis.</li>
          <li>Menghitung <strong>estimasi Kaplan-Meier</strong> langkah-demi-langkah dari data kecil.</li>
          <li>Menafsirkan <strong>kurva survival, median survival, dan hazard ratio Cox</strong> dengan bahasa sendiri.</li>
          <li>Mengenali kapan <strong>competing risks</strong> membuat KM standar menipu.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Pasien yang “Hilang”</h2>
      <div className="story">
        <p>Uji obat kanker: 100 pasien, follow-up 2 tahun. Di akhir, 30 meninggal, 20 <strong>hilang follow-up</strong> (pindah kota, berhenti kontrol), 50 masih hidup. Analis junior menghitung “mortalitas = 30/80 = 37,5%” dengan membuang yang hilang. Salah fatal: 20 pasien itu <em>hidup selama mereka terpantau</em> — membuangnya sama dengan menghapus bukti bahwa obat menahan mereka hidup selama itu.</p>
      <p>Data waktu-kejadian selalu punya “pasien yang hilang” — dan statistik punya cara elegan memakainya: <strong>analisis survival</strong>. Lesson ini mengajarkan cara membaca waktu, bukan sekadar menghitung mayat.</p>
      <p><strong>Twist-nya:</strong> 20 pasien yang “hilang” itu bukan sampah data — mereka adalah <strong>bukti obat bekerja yang nyaris dibuang</strong>. Setiap bulan mereka bertahan tanpa kabar adalah satu bulan bukti bahwa mereka <em>tidak mati</em> dalam periode itu. Analis junior membuangnya dan menghukum obat yang baik; analisis survival memakainya dan memberi tiap pasien “kredit waktu” yang jujur. <strong>Di statistik waktu-kejadian, ketiadaan kabar adalah kabar baik — dan membuang kabar baik adalah dosa analisis.</strong></p>
      </div>

      <h2 id="sensor">Sensor &amp; Kurva Kaplan-Meier — Si Akuntan Waktu</h2>
      <p><strong>Definisi.</strong> <strong>Sensor kanan</strong>: waktu kejadian tidak teramati penuh — pasien masih hidup saat studi berakhir atau hilang follow-up. <strong>Kaplan-Meier (KM)</strong>: estimasi probabilitas survival yang memakai informasi “selamat sampai waktu t” dari pasien tersensor.</p>
      <Tex math={String.raw`\hat{S}(t) = \prod_{t_i \leq t} \left(1 - \frac{d_i}{n_i}\right)`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\hat{S}(t)`} />: estimasi probabilitas bertahan hidup melewati waktu t</li>
          <li><Tex math={String.raw`d_i`} />: jumlah kejadian (kematian) pada waktu t_i</li>
          <li><Tex math={String.raw`n_i`} />: jumlah yang masih berisiko tepat sebelum t_i (termasuk yang lalu tersensor)</li>
          <li><Tex math={String.raw`\prod`} />: kalikan peluang bertahan di tiap titik kejadian — seperti rantai</li>
      </ul>
      <p><strong>Interpretasi:</strong> Kurva KM turun hanya saat ada kejadian; pasien tersensor <em>mengurangi n_i</em> setelahnya tanpa menurunkan kurva. Tiap anak tangga = peluang bersyarat bertahan melewati titik itu.</p>
      <details className="worked">
        <summary>📐 Contoh: KM 5 pasien</summary>
        <p>Waktu (bulan): 3 (meninggal), 5 (tersensor), 6 (meninggal), 8 (tersensor), 12 (meninggal).<br /><strong>t=3:</strong> n=5, d=1 → S = 1−(1/5) = <strong>0,80</strong>.<br /><strong>t=5:</strong> sensor — kurva tetap 0,80, tapi n turun jadi 3.<br /><strong>t=6:</strong> n=3, d=1 → S = 0,80 × (1−1/3) = <strong>0,533</strong>.<br /><strong>t=12:</strong> n=1, d=1 → S = 0,533 × 0 = <strong>0</strong>.<br />Perhatikan: pasien tersensor di bulan 5 <em>ikut menyangga</em> estimasi sampai bulan 5, lalu keluar dari pembagi.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> KM itu akuntan yang jujur: ia tidak mengarang nasib pasien yang hilang, tapi juga tidak menghapus kontribusi mereka. Setiap anak tangga kurva adalah kesaksian: “sejauh ini, yang bertahan sebanyak ini”.</p>
      <p><strong>Kapan memakai:</strong> Deskripsi survival satu/dua kelompok: survival kanker 5 tahun, waktu sampai readmission, durasi remisi. Selalu tampilkan jumlah berisiko (number at risk) di bawah kurva.</p>

      <PlotlyChart
        data={hd6KmData}
        title="Kurva Kaplan-Meier — Contoh 5 Pasien"
        layout={hd6KmDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Garis biru tangga = estimasi survival; turun hanya di bulan 3, 6, 12 (ada kematian). Tanda X kuning = pasien tersensor (bulan 5 dan 8): kurva tidak turun di sana.</p>
        <p><strong>Interpretasi:</strong> Visual dari rumus: anak tangga di tiap kejadian, datar saat sensor. Median survival = waktu saat kurva menyentuh 0,5 (di sini ~7 bulan). Perhatikan kurva makin “goyah” di kanan karena n_i mengecil — ekor kurva paling tidak bisa dipercaya.</p>
      </div>

      <h2 id="logrank">Log-Rank Test — Si Wasit Dua Kurva</h2>
      <p><strong>Definisi.</strong> <strong>Uji log-rank</strong> membandingkan dua (atau lebih) kurva survival secara keseluruhan: apakah perbedaan yang terlihat lebih besar dari yang diharapkan secara acak.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca hasil log-rank</summary>
        <p>Trial 200 pasien: kurva obat di atas kurva kontrol sepanjang 2 tahun. Uji log-rank: <strong>p = 0,03</strong>.<br />Artinya: jika obat sebenarnya tidak berpengaruh, perbedaan sebesar ini hanya terjadi 3% secara kebetulan — cukup bukti untuk menyatakan beda.<br />Tapi p tidak memberi tahu <em>seberapa besar</em> bedanya — untuk itu lihat selisih kurva atau HR dari Cox.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Log-rank itu wasit yang menonton seluruh pertandingan, bukan skor akhir saja. Ia bertanya di tiap titik waktu: “kematian yang terjadi vs yang diharapkan bila kedua tim sama kuat — selisihnya konsisten ke satu arah?”</p>
      <p><strong>Kapan memakai:</strong> Bandingkan survival dua kelompok (obat vs kontrol) tanpa asumsi distribusi. Untuk estimasi BESAR efek, lanjut ke Cox.</p>
      <div className="callout callout-warning"><strong>Batasan:</strong> log-rank paling kuat saat kurva tidak bersilangan (proportional hazards). Jika kurva bersilangan (obat buruk di awal, bagus belakangan — mis. imunoterapi), log-rank bisa gagal mendeteksi beda yang nyata. Selalu plot kurvanya!</div>

      <h2 id="cox">Model Cox — Si Penimbang Banyak Faktor</h2>
      <p><strong>Definisi.</strong> <strong>Model Cox proportional hazards</strong>: regresi untuk data survival yang mengestimasi pengaruh tiap variabel terhadap <em>laju kejadian</em> (hazard), tanpa perlu menentukan bentuk baseline hazard.</p>
      <Tex math={String.raw`h(t|X) = h_0(t) \cdot e^{\beta_1 X_1 + \beta_2 X_2 + \cdots}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`h(t|X)`} />: hazard: laju kejadian sesaat pada waktu t untuk pasien berkarakteristik X</li>
          <li><Tex math={String.raw`h_0(t)`} />: baseline hazard: laju dasar saat semua X = 0 (tidak perlu dispesifikasi!)</li>
          <li><Tex math={String.raw`\beta_j`} />: koefisien variabel j; HR = e^β</li>
          <li><Tex math={String.raw`e^{\beta_1 X_1 + \cdots}`} />: pengali risiko relatif — jantung model Cox</li>
      </ul>
      <p><strong>Interpretasi:</strong> HR = 0,7 untuk obat artinya: pada setiap saat, laju kematian kelompok obat 70% dari kontrol (risiko turun 30%), <em>setelah mengontrol variabel lain</em>. HR = 2 untuk merokok = laju kejadian 2x lipat.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca tabel Cox</summary>
        <p>Output: obat β = −0,36 (HR = e^−0,36 = 0,70; p=0,02); usia (per 10 tahun) HR = 1,4 (p&lt;0,001); diabetes HR = 1,8 (p=0,01).<br />Bacaan: obat menurunkan laju kematian 30% setelah mengontrol usia dan diabetes. Usia +10 tahun menaikkan laju 40%.<br /><strong>Cek asumsi:</strong> plot Schoenfeld residuals — jika HR berubah seiring waktu (kurva bersilangan), asumsi proportional hazards dilanggar → pakai model stratified/time-varying.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Cox itu seperti regresi logistik yang sabar: ia tidak bertanya “mati atau hidup?” melainkan “seberapa cepat?” — dan ia cerdik: tidak perlu tahu bentuk baseline hazard, cukup rasio antar pasien.</p>
      <p><strong>Kapan memakai:</strong> Analisis multivariabel waktu-kejadian: faktor prognostik kanker, efektivitas obat terkontrol confounder, risiko readmission (lihat HD20 capstone).</p>

      <h2 id="competing">Competing Risks — Si Pengingat Kematian Lain</h2>
      <p><strong>Definisi.</strong> <strong>Competing risk</strong>: kejadian yang mencegah kejadian utama teramati — mis. pasien meninggal karena stroke sebelum sempat kambuh kankernya. KM standar yang menyensor kematian lain <strong>melebih-lebihkan</strong> risiko kejadian utama.</p>
      <details className="worked">
        <summary>📐 Contoh: kekambuhan kanker prostat pada lansia</summary>
        <p>KM standar: risiko kekambuhan 5 tahun = <strong>25%</strong> (kematian non-kanker disensor).<br />CIF (competing risk): risiko kekambuhan = <strong>18%</strong> — karena 7% pasien meninggal duluan karena sebab lain.<br />Selisih 7 poin = pasien yang KM “hangatkan” seolah masih berisiko kambuh padahal sudah meninggal. Untuk konseling pasien, angka 18% yang jujur.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Competing risk itu seperti menghitung “peluang promosi” sambil mengabaikan bahwa karyawan bisa resign dulu. KM standar berandai-andai “seandainya tidak ada yang mati duluan” — dunia fantasi yang membengkakkan angka.</p>
      <p><strong>Kapan memakai:</strong> Populasi tua/multi-komorbid: risiko kekambuhan kanker (vs kematian lain), risiko readmission (vs kematian). Pakai cumulative incidence function (CIF) / model Fine-Gray.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Dari Tabel Hidup ke Hazard Ratio</h2>
      <details className="worked">
        <summary>📐 Worked example: Kaplan-Meier manual 10 pasien (klik untuk buka)</summary>
        <p>10 pasien kanker, waktu (bulan) hingga meninggal atau tersensor (tanda +). Data terurut: 3, 5, 5+, 8, 8, 12+, 14, 18+, 20, 24+.</p>
        <p><strong>Langkah 1 — Tabel hidup.</strong> Mulai S(0)=1, n=10. t=3: 1 meninggal → S = 1 × 9/10 = 0,90. t=5: 1 meninggal dari 9 berisiko → S = 0,90 × 8/9 = 0,80. t=5+: 1 tersensor → n berisiko turun jadi 7, <strong>S tidak berubah</strong> (inilah “kredit waktu”: ia sudah berkontribusi hingga bulan 5). t=8: 2 meninggal dari 7 → S = 0,80 × 5/7 = 0,571. t=12+: sensor, n→4. t=14: 1 meninggal dari 4 → S = 0,571 × 3/4 = 0,429.</p>
        <p><strong>Langkah 2 — Median survival.</strong> S(t) turun di bawah 0,5 pertama kali di t=14 → median ≈ <strong>14 bulan</strong>. Perhatikan: mean tidak bisa dihitung (3 pasien masih hidup di akhir) — inilah kenapa median, bukan mean, adalah bahasa survival.</p>
        <p><strong>Langkah 3 — Syarat sensor non-informatif.</strong> Seluruh perhitungan runtuh jika yang tersensor pergi <em>karena</em> memburuk (mis. pulang untuk meninggal di rumah). Selalu tanya: “kenapa mereka hilang?” — jawaban “pindah kota” aman; “berhenti kontrol karena memburuk” = bias.</p>
        <p><strong>Langkah 4 — Hazard ratio (HR).</strong> Bandingkan dua kurva: HR = 0,6 artinya pada <em>setiap</em> titik waktu, risiko kematian kelompok obat 60% dari kelompok kontrol — <strong>bukan</strong> “40% pasien terselamatkan”. HR adalah rasio kecepatan, bukan rasio orang.</p>
        <p><strong>Pelajaran:</strong> kurva KM yang turun curam di awal lalu datar menceritakan “banyak yang gugur dini, yang bertahan cenderung aman” — baca <em>bentuk</em> kurva, bukan cuma angka akhirnya.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — competing risks: “meninggal karena apa” itu penting:</strong> Studi “waktu hingga serangan jantung” pada lansia punya pesaing: kematian karena kanker/COVID. Kaplan-Meier standar memperlakukan kematian lain sebagai <em>sensor</em> — seolah pasien “hilang” — padahal ia tidak akan pernah kena serangan jantung lagi. Hasilnya: risiko serangan jantung <strong>terlebih-lebihkan</strong>. Untuk pertanyaan “berapa persen yang <em>benar-benar</em> mengalami event X”, pakai <strong>cumulative incidence function</strong> (model Fine-Gray), bukan 1 − KM. Aturan praktis: jika &gt;10% subjek mengalami “kematian lain”, KM standar sudah tidak jujur.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — klaim “program DM menurunkan kematian 40%”:</strong> Sebuah RS mengklaim program manajemen diabetesnya memangkas mortalitas 40% (HR 0,6). Sebelum tepuk tangan, audit tiga hal: (1) <strong>seleksi</strong> — peserta program mungkin yang lebih patuh/mampu (lihat HD4 &amp; HD10); (2) <strong>immortal time bias</strong> — pasien harus <em>bertahan cukup lama</em> untuk sempat didaftarkan ke program, sehingga kelompok program otomatis “kebal mati” di awal; (3) <strong>competing risks</strong> — apakah kematian non-DM diperlakukan benar. Klaim program RS tanpa ketiga audit ini adalah <em>iklan</em>, bukan <em>evaluasi</em> — dan analis yang menandatanganinya ikut bertanggung jawab.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Hazard Ratio Bukan Risk Ratio (dan Kenapa Itu Penting)</h2>
      <p>Kesalahan paling umum membaca literatur survival: mengartikan HR = 0,6 sebagai “risiko 40% lebih rendah” — seolah risk ratio. <strong>Salah, tapi “hampir benar”</strong> — dan “hampir benar” inilah yang berbahaya.</p>
      <p><strong>Apa sebenarnya HR:</strong> rasio <em>kecepatan kejadian sesaat</em> (hazard) antara dua kelompok, <strong>dengan asumsi rasio ini konstan sepanjang waktu</strong>. HR 0,6 = “pada setiap titik waktu, yang diobati mengalami kejadian dengan kecepatan 60% dari kontrol”. Ini <strong>bukan</strong> “60% peluang selamat” dan <strong>bukan</strong> “40% pasien terselamatkan”. Untuk menerjemahkan ke bahasa pasien (“berapa peluang saya hidup 5 tahun?”), butuh <strong>kurva KM absolut</strong> per kelompok — HR saja tidak cukup.</p>
      <p><strong>Kapan HR runtuh total:</strong> (1) <strong>Kurva bersilangan</strong> (lihat studi kasus di atas) — HR rata-rata tidak bermakna. (2) <strong>Efek memudar</strong> — vaksin yang proteksinya turun setelah 1 tahun: HR tahun-1 = 0,4, HR tahun-3 = 0,9; HR gabungan 0,65 menyembunyikan pemudaran. (3) <strong>Seleksi frailty</strong> — yang rentan mati duluan, sehingga kelompok yang tersisa makin “kuat”: HR <em>tampak</em> membaik seiring waktu padahal efek obatnya konstan — artefak seleksi, bukan biologi.</p>
      <p><strong>Senjata modern: RMST.</strong> Restricted Mean Survival Time = <strong>luas di bawah kurva KM</strong> hingga waktu τ — “rata-rata bulan hidup dalam 2 tahun ke depan”. Keunggulannya: <strong>tidak butuh asumsi proporsional</strong>, bermakna klinis langsung (“+2,1 bulan”), dan bisa dihitung dari kurva yang bersilangan. Regulator dan jurnal top kini <em>mendorong</em> pelaporan RMST berdampingan dengan HR. Analis yang melaporkan keduanya menunjukkan ia paham <em>keterbatasan</em> alatnya — tanda kedewasaan.</p>
      <div className="callout">
        <p><strong>Checklist membaca laporan survival:</strong> ① Ada kurva KM? ② Kurvanya bersilangan/menyatu? ③ Asumsi proporsional diuji? ④ HR diterjemahkan ke absolut (KM/RMST)? — Empat ya = laporan tepercaya.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pasien yang hilang follow-up (tersensor) sebaiknya dibuang dari analisis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Membuang = menghapus informasi “mereka bertahan selama terpantau” dan biasanya bias (yang hilang sering berbeda dari yang bertahan). KM justru dirancang untuk memakai kontribusi parsial mereka. Yang wajib dicek: apakah sensornya <em>informatif</em> (mis. yang memburuk berhenti kontrol → sensor terkait prognosis → asumsi violated).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Median survival = rata-rata umur pasien&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Median survival = waktu saat kurva KM menyentuh 50%: separuh pasien mengalami kejadian sebelum titik itu. Bukan rata-rata, bukan harapan hidup individu. Dan bila kurva tidak pernah turun sampai 0,5 (follow-up pendek), median <em>tidak terdefinisi</em> — laporkan survival rate di titik waktu tertentu sebagai gantinya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;HR = 2 artinya peluang kejadiannya dua kali lipat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> HR adalah rasio <em>laju sesaat</em> (hazard), bukan rasio probabilitas kumulatif. Pada follow-up panjang, rasio probabilitas bisa menyimpang dari HR. Baca HR sebagai “kecepatan kejadian relatif”, bukan “risiko dua kali lipat” mentah-mentah.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Dua Kurva yang Bersilangan</h2>
      <details className="worked">
        <summary>📐 Worked example: ketika hazard ratio “rata-rata” menipu (klik untuk buka)</summary>
        <p>Trial imunoterapi vs kemoterapi kanker: kurva KM <strong>bersilangan</strong> di bulan 6 — kemoterapi lebih baik di awal (kurvanya di atas), imunoterapi lebih baik setelahnya.</p>
        <p><strong>Langkah 1 — Baca bentuknya, bukan angkanya.</strong> 0–6 bulan: mortalitas imunoterapi <em>lebih tinggi</em> (efek lambat + toksisitas awal). &gt;6 bulan: kurva imunoterapi mendatar (plateau — sebagian pasien sembuh jangka panjang), kemoterapi terus turun. <strong>Dua rezim biologis berbeda</strong> dalam satu trial.</p>
        <p><strong>Langkah 2 — Kenapa HR tunggal gagal.</strong> Model Cox memberi HR = 0,85 (“risiko 15% lebih rendah”) — angka <em>rata-rata</em> yang <strong>tidak berlaku di periode manapun</strong>: di awal HR &gt; 1 (merugikan), di akhir HR ≈ 0,5 (sangat menguntungkan). Melaporkan 0,85 saja = menyembunyikan bahwa obat ini <em>berbahaya</em> di 6 bulan pertama untuk sebagian pasien.</p>
        <p><strong>Langkah 3 — Uji asumsi proportional hazards.</strong> Plot Schoenfeld residuals: pola sistematis (bukan acak) → asumsi <strong>dilanggar</strong>. Konfirmasi statistik dari apa yang mata sudah lihat di kurva bersilangan.</p>
        <p><strong>Langkah 4 — Alternatif yang jujur.</strong> (a) <strong>HR per periode</strong>: HR 0–6 bln = 1,25; HR &gt;6 bln = 0,55. (b) <strong>RMST</strong> (restricted mean survival time): selisih luas di bawah kurva hingga 24 bulan = +2,1 bulan hidup rata-rata — ukuran yang <strong>tidak butuh asumsi proporsional</strong>. (c) <strong>Milestone survival</strong>: proporsi hidup di 12 &amp; 24 bulan per kelompok.</p>
        <p><strong>Langkah 5 — Implikasi klinis.</strong> “Obat ini buruk di awal, luar biasa setelahnya” → keputusan: untuk pasien yang <em>bisa bertahan</em> 6 bulan pertama, imunoterapi unggul. Informasi ini <strong>hilang total</strong> jika hanya lapor HR 0,85.</p>
        <p><strong>Pelajaran:</strong> kurva yang bersilangan adalah <strong>alarm</strong>: berhenti, jangan rata-ratakan. Bentuk kurva adalah ceritanya — HR hanya judulnya.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap laporan survival yang hanya memberi HR tanpa <strong>kurva KM</strong> patut dicurigai — seperti resensi film tanpa sinopsis. Minta kurvanya; bacalah bentuknya sebelum angkanya.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu tampilkan <strong>number at risk</strong> di bawah kurva KM. Kurva tanpa itu seperti peta tanpa skala — ekor kanan bisa didasarkan pada 3 pasien.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Cek <strong>asumsi proportional hazards</strong> sebelum percaya HR: plot log-minus-log atau Schoenfeld. Kurva yang bersilangan = HR tunggal menipu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk outcome non-kematian pada populasi tua, tanya: <strong>“apa competing risk-nya?”</strong> sebelum memakai KM standar. Kebanyakan analisis readmission/kekambuhan mengabaikan ini.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Hitung Kurva Kaplan-Meier Manual</h2>
      <p>Implementasi rumus KM langkah-demi-langkah. Data: list (waktu, status) dengan 1=kejadian, 0=tersensor. Ubah data dan lihat bagaimana sensor memengaruhi n_i tanpa menurunkan kurva.</p>
      <PyodideLab
        title="🔬 Lab 1: Hitung Kurva Kaplan-Meier Manual"
        hint="Coba ubah status pasien bulan 5 dari 0 (sensor) menjadi 1 (kejadian). Bandingkan kurvanya — sensor vs kejadian di titik yang sama memberi hasil sangat beda."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Hazard Ratio Dua Kelompok</h2>
      <p>Bangkitkan waktu kejadian eksponensial untuk kontrol (hazard λ) dan obat (hazard λ×HR). Estimasi HR dari rasio median, dan lihat efek sensor acak.</p>
      <PyodideLab
        title="🔬 Lab 2: Simulasi Hazard Ratio Dua Kelompok"
        hint="Ubah HR dari 0.7 ke 1.0 (obat tidak manjur). Apakah estimasimu mendekati 1? Sekarang naikkan sensor ke 60% — apa yang terjadi pada presisi?"
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Loss to Follow-Up di Program TB</h2>
      <p>Program TB Indonesia (TOSS — Temukan, Obati, Sampai Sembuh) menghadapi masalah analisis survival yang klasik: <strong>loss to follow-up 10–20%</strong> — pasien berhenti berobat dan hilang dari catatan. Bagaimana analis menanganinya menentukan apakah program “terlihat berhasil”.</p>
      <p><strong>Masalahnya:</strong> analisis naif mengasumsikan yang hilang = tersensor acak (non-informatif). Padahal riset kualitatif menunjukkan yang hilang cenderung: <strong>merasa sudah sembuh</strong> (berhenti minum obat — berisiko kambuh/resisten), <strong>efek samping berat</strong>, atau <strong>pindah tanpa rujukan</strong>. Ketiganya berkorelasi dengan <em>outcome buruk</em> — sensornya <strong>informatif</strong>, dan KM standar <strong>melebih-lebihkan</strong> keberhasilan program.</p>
      <p><strong>Praktik analisis yang benar:</strong> (1) <strong>Lacak sampel</strong> — hubungi subset yang hilang (kader, telepon) untuk mengetahui status sebenarnya; koreksi estimasi. (2) <strong>Analisis sensitivitas skenario</strong> — laporkan rentang: “keberhasilan 85% jika yang hilang seperti yang terpantau; 72% jika setengahnya gagal.” (3) <strong>Bedakan jenis hilang</strong> — “pindah dengan rujukan” (sensor wajar) vs “mangkir tanpa kabar” (red flag) — jangan campur. (4) <strong>Competing risks</strong> — kematian selama pengobatan adalah <em>event kompeting</em>, bukan sensor: pakai cumulative incidence, bukan 1−KM.</p>
      <p><strong>Pelajaran kebijakan:</strong> angka “keberhasilan pengobatan TB 90%” yang tidak menyebut loss to follow-up dan penanganannya adalah <strong>angka seremonial</strong>. Analis yang berani menulis “85% (rentang 72–88% tergantung asumsi loss to follow-up)” memberi Dinkes sesuatu yang jauh lebih berharga: <strong>kejujuran yang bisa ditindaklanjuti</strong> (perkuat pelacakan mangkir!).</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Di setiap program kesehatan Indonesia (TB, HIV, DM), tanyakan dulu <strong>“berapa persen mangkir, dan apa yang kita asumsikan tentang mereka?”</strong> — jawaban atas pertanyaan ini lebih menentukan kesimpulan daripada model statistik apapun.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Deskripsi survival satu/dua kelompok → KM + log-rank</h3>
        <p><strong>Kondisi:</strong> Pertanyaan deskriptif/komparatif sederhana tanpa banyak kovariat.</p>
        <p><strong>Kenapa:</strong> Nonparametrik, visual, standar pelaporan klinis.</p>
        <p><strong>Contoh nyata:</strong> Survival 5 tahun kanker serviks per stadium.</p>
      </div>
      <div className="decision-card">
        <h3>2. Banyak faktor prognostik → Cox</h3>
        <p><strong>Kondisi:</strong> Butuh efek bersih tiap variabel sambil mengontrol yang lain.</p>
      <PlotlyChart
        data={hd6HrData}
        title="Forest Plot Sederhana: Hazard Ratio Model Cox"
        layout={hd6HrDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang horizontal = HR tiap variabel. Garis putus-putus di 1 = netral. Kiri garis = protektif, kanan = berbahaya.</p>
        <p><strong>Interpretasi:</strong> Obat baru (HR 0,7) satu-satunya yang protektif. Diabetes (1,8) dan merokok (2,1) menaikkan laju kejadian. Inilah cara standar melaporkan Cox: forest plot dengan garis netral 1.</p>
      </div>
        <p><strong>Kenapa:</strong> Regresi untuk waktu-kejadian; HR mudah diinterpretasi; cek proportional hazards.</p>
        <p><strong>Contoh nyata:</strong> Faktor risiko kematian TB: usia, HIV, resistansi obat.</p>
      </div>
      <div className="decision-card">
        <h3>3. Ada competing risk besar → CIF / Fine-Gray</h3>
        <p><strong>Kondisi:</strong> Kejadian lain mencegah outcome utama (populasi tua/komorbid).</p>
        <p><strong>Kenapa:</strong> KM standar melebih-lebihkan risiko kumulatif kejadian utama.</p>
        <p><strong>Contoh nyata:</strong> Risiko kekambuhan kanker pada lansia (vs kematian lain).</p>
      </div>
      <div className="decision-card">
        <h3>4. Kejadian berulang (reinfeksi, readmission ganda) → model recurrent event</h3>
        <p><strong>Kondisi:</strong> Satu pasien bisa mengalami kejadian berkali-kali.</p>
        <p><strong>Kenapa:</strong> KM/Cox standar untuk kejadian pertama saja; recurrent butuh Andersen-Gill/frailty.</p>
        <p><strong>Contoh nyata:</strong> Kekambuhan malaria berulang per pasien per tahun.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Jangan buang yang tersensor — pakai KM.</li>
          <li>Tampilkan number at risk di bawah kurva.</li>
          <li>HR = laju relatif, bukan peluang 2x lipat.</li>
          <li>Populasi tua → cek competing risk.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: RS Mengklaim “Program DM Menurunkan Kematian 40%”</h2>
      <div className="callout">
        <p>RS meluncurkan program pengelolaan diabetes. Setahun kemudian: mortalitas pasien program <strong>8%</strong> vs pasien non-program <strong>13%</strong>. Manajemen mengklaim program menurunkan kematian 40% dan minta anggaran diperbesar.</p>
      <p>Kamu tarik data: pasien program rata-rata <strong>10 tahun lebih muda</strong> dan dirujuk dari skrining (lebih sehat). Analisis yang dipakai: perbandingan proporsi mentah, tanpa survival, tanpa adjustment.</p>
        <p><strong>Pertanyaan:</strong> Apa yang salah dari klaim ini dan analisis apa yang seharusnya dilakukan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Klaim mengabaikan confounding by indication: yang masuk program lebih muda dan lebih sehat sejak awal — selisih 8% vs 13% bisa murni seleksi. Analisis benar: (1) Cox dengan adjustment usia, komorbid, keparahan awal → HR program yang sesungguhnya; (2) cek proportional hazards; (3) kalau ingin kausal lebih kuat, pertimbangkan propensity score (HD10) karena ini observasional. Kemungkinan besar HR terkoreksi jauh lebih dekat ke 1. Pelajaran: perbandingan mentah program sukarela hampir selalu memuji programnya sendiri.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Sensor kanan artinya…"
        options={["Pasien meninggal tepat saat studi berakhir",
          "Waktu kejadian tidak teramati penuh (masih hidup/hilang saat follow-up berakhir)",
          "Data pasien dihapus",
          "Pasien menolak berobat"]}
        correct={1}
        explanation="Benar: sensor = informasi parsial (“bertahan setidaknya sampai t”). Inilah yang membuat analisis survival istimewa."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Pada kurva KM, pasien tersensor menyebabkan…"
        options={["Kurva turun",
          "Kurva tetap, tapi n_i (berisiko) berkurang setelahnya",
          "Kurva naik",
          "Tidak ada efek sama sekali"]}
        correct={1}
        explanation="Benar: sensor tidak menurunkan kurva — ia hanya mengeluarkan pasien dari pembagi berikutnya. Kontribusi “bertahan sampai t” tetap dipakai."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Median survival adalah…"
        options={["Rata-rata waktu hidup pasien",
          "Waktu saat kurva KM menyentuh 0,5",
          "Waktu follow-up terpanjang",
          "Setengah dari total pasien"]}
        correct={1}
        explanation="Benar: titik saat separuh mengalami kejadian. Bukan rata-rata, dan tak terdefinisi bila kurva tak mencapai 0,5."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. HR = 0,7 pada model Cox untuk obat berarti…"
        options={["Peluang sembuh 70%",
          "Laju kejadian kelompok obat 70% dari kontrol (turun 30%), setelah dikontrol kovariat",
          "70% pasien sembuh",
          "Obat gagal"]}
        correct={1}
        explanation="Benar: HR = rasio hazard (laju sesaat), bukan probabilitas. Baca sebagai kecepatan relatif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kapan KM standar menipu dan butuh competing risks?"
        options={["Selalu",
          "Ketika kejadian lain (mis. kematian sebab lain) mencegah outcome utama teramati",
          "Ketika sampel kecil",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: KM menyensor competing event seolah “tidak terjadi” → melebih-lebihkan risiko kumulatif. Pakai CIF/Fine-Gray."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua kurva KM bersilangan (obat buruk di awal, bagus belakangan). Masalahnya?"
        options={["Tidak ada, log-rank tetap optimal",
          "Asumsi proportional hazards dilanggar; log-rank melemah, HR tunggal menipu",
          "Data harus dibuang",
          "Median tidak bisa dihitung"]}
        correct={1}
        explanation="Benar: efek yang berubah seiring waktu butuh model time-varying/stratified. Selalu plot kurvanya dulu."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Sensor kanan</strong> = info parsial yang tetap dipakai KM; jangan dibuang.</li>
          <li><strong>KM</strong>: S(t) = produk peluang bertahan; turun hanya saat kejadian.</li>
          <li><strong>Median survival</strong>: waktu kurva menyentuh 0,5. Tampilkan number at risk.</li>
          <li><strong>Log-rank</strong>: bandingkan kurva (uji beda); <strong>Cox</strong>: kuantifikasi efek (HR) multivariabel.</li>
          <li><strong>HR</strong> = rasio laju sesaat; cek asumsi proportional hazards.</li>
          <li><strong>Competing risks</strong>: KM standar melebih-lebihkan bila ada kejadian pencegah.</li>
          <li>Kejadian berulang butuh model recurrent, bukan KM biasa.</li>
          <li>Lesson ini fondasi HD12 (prediksi), HD16 (waktu wabah), dan HD20 (capstone).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd5-uji-klinis" className="btn btn-secondary btn-sm">← HD5</Link>
        <Link href="/learn/hd7-longitudinal" className="btn btn-primary btn-sm">HD7 →</Link>
      </div>
    </div>
  );
}
