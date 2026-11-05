"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd16SurveilansWabahPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd16AlertData = [{"x": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], "y": [4, 5, 3, 6, 5, 4, 7, 5, 6, 4, 5, 13, 15, 22, 35, 48, 60, 55, 40, 25], "type": "scatter", "mode": "lines+markers", "name": "Kasus mingguan", "line": {"color": "#2a7de1"}}, {"x": [1, 20], "y": [11, 11], "type": "scatter", "mode": "lines", "name": "Ambang alert", "line": {"dash": "dash", "color": "#e8a838"}}];
  const hd16AlertDataLayout = {"xaxis": {"title": "Minggu"}, "yaxis": {"title": "Kasus"}, "showlegend": true};

  const lab1Code = "N, I0 = 10000, 10\nbeta, gamma = 0.3, 0.1\ndef simulasi(hari_intervensi=None, potongan=0.4, hari=200):\n    S, I, R = N-I0, I0, 0\n    puncak, t_puncak, total = 0, 0, 0\n    for t in range(hari):\n        b = beta*(1-potongan) if (hari_intervensi and t >= hari_intervensi) else beta\n        baru = b*S*I/N\n        sembuh = gamma*I\n        S -= baru; I += baru-sembuh; R += sembuh\n        if I > puncak: puncak, t_puncak = I, t\n    return puncak, t_puncak, R\np0, t0, tot0 = simulasi()\np1, t1, tot1 = simulasi(30)\np2, t2, tot2 = simulasi(60)\nprint(f'tanpa intervensi : puncak {p0:.0f} (hari {t0}), total {tot0:.0f}')\nprint(f'intervensi hr-30 : puncak {p1:.0f} (hari {t1}), total {tot1:.0f}')\nprint(f'intervensi hr-60 : puncak {p2:.0f} (hari {t2}), total {tot2:.0f}')\nprint()\nprint(f'Keterlambatan 30 hari menambah {tot2-tot1:.0f} kasus.')\nprint('Flatten the curve = beli waktu untuk RS. Waktu = nyawa.')";

  const lab2Code = "import random\nrandom.seed(12)\nbaseline = [random.gauss(5, 2) for _ in range(52)]\n# wabah minggu 30-40\nfor t in range(30, 41):\n    baseline[t] += (t-29)*4\nkasus = [max(0, round(x)) for x in baseline]\nhist = kasus[:26]\nmean = sum(hist)/len(hist)\nsd = (sum((x-mean)**2 for x in hist)/len(hist))**0.5\nambang = mean + 2*sd\nprint(f'baseline: mean={mean:.1f}, SD={sd:.1f}, ambang={ambang:.1f}')\nalert, false_alarm, deteksi = 0, 0, None\nfor t in range(26, 52):\n    if kasus[t] > ambang and kasus[t+1] > ambang if t+1 < 52 else False:\n        alert += 1\n        if t < 30:\n            false_alarm += 1\n        elif deteksi is None:\n            deteksi = t\nprint(f'wabah mulai minggu 30; terdeteksi minggu {deteksi}')\nprint(f'false alarm sebelum wabah: {false_alarm}')\nprint()\nprint('Surveilans = seni menyeimbangkan cepat vs akurat.')";

  const hd16RtData = [{"x": ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"], "y": [2.1, 1.8, 1.4, 1.1, 0.9, 0.7, 0.6, 0.5], "type": "scatter", "mode": "lines+markers", "name": "Rt", "line": {"color": "#2a7de1"}}, {"x": ["M1", "M8"], "y": [1, 1], "type": "scatter", "mode": "lines", "name": "Ambang 1", "line": {"dash": "dash", "color": "#e8a838"}}];
  const hd16RtDataLayout = {"xaxis": {"title": "Minggu"}, "yaxis": {"title": "Rt"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD16 &mdash; Health Data Scientist</span>
        <h1 className="display-title">SIR &amp; Deteksi Wabah:<br />Matematika Penyebaran Penyakit</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 3 Kasus yang Menjadi 3.000</a></li>
          <li><a href="#surveilans">Surveilans &amp; Deteksi Sinyal</a></li>
          <li><a href="#sir">Model SIR — Tiga Kompartemen</a></li>
          <li><a href="#r0">R0, Rt &amp; Forecasting</a></li>
          <li><a href="#spasial">Analisis Spasial Wabah</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi SIR &amp; Dampak Intervensi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Deteksi Alert Kenaikan Kasus</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Menghitung Rt</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Model sebagai Peta</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: SKDR Indonesia</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Dari Sinyal ke Keputusan Intervensi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan sistem <strong>surveilans</strong> (indikator vs event-based) dan logika <strong>deteksi alert</strong>.</li>
          <li>Menjalankan dan menafsirkan <strong>model SIR</strong>: S, I, R, beta, gamma, dan efek intervensi.</li>
          <li>Menghitung dan menafsirkan <strong>R0 dan Rt</strong> serta ambang herd immunity.</li>
          <li>Membaca <strong>peta/klaster spasial</strong> kasus dan menghindari jebakan ecological fallacy.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 3 Kasus yang Menjadi 3.000</h2>
      <div className="story">
        <p>Minggu 1: 3 kasus demam berdarah di sebuah kecamatan. Petugas mencatat di buku — tidak ada alert. Minggu 4: 80 kasus. Minggu 8: 3.000 kasus, RS penuh, fogging darurat yang terlambat. Investigasi: pola kenaikan <strong>sudah terlihat di minggu 2</strong> bila ada yang menghitung.</p>
      <p>Surveilans adalah sistem saraf kesehatan masyarakat: ia harus merasakan demam sebelum tubuh terbakar. Lesson ini tentang cara mendengar sinyal itu — dan matematika sederhana yang memprediksi ke mana wabah bergerak.</p>
      <p><strong>Twist-nya:</strong> tragedi itu bukan karena datanya tidak ada — <strong>datanya ada, tercatat rapi di buku petugas, setiap minggu</strong>. Yang tidak ada adalah <em>seseorang yang menghitung</em>. Tiga kasus di minggu 1 bukan “terlalu sedikit untuk dianalisis”; dalam pertumbuhan eksponensial, 3 kasus <em>adalah</em> sinyal — karena minggu depan ia menjadi 6, lalu 12. <strong>Surveilans yang baik bukan tentang data besar, melainkan tentang kebiasaan menghitung hal kecil secara rutin.</strong> Matematikanya sederhana; yang sulit adalah disiplinnya.</p>
      </div>

      <h2 id="surveilans">Surveilans &amp; Deteksi Sinyal — Si Sistem Saraf</h2>
      <p><strong>Definisi.</strong> <strong>Surveilans indikator</strong>: laporan rutin terstruktur (EWARS/SKDR mingguan). <strong>Event-based</strong>: sinyal tak terstruktur (berita, media sosial, laporan warga). <strong>Deteksi alert</strong>: aturan statistik saat kenaikan dianggap sinyal, bukan noise.</p>
      <details className="worked">
        <summary>📐 Contoh: aturan alert DBD kabupaten</summary>
        <p>Data historis 3 tahun: rata-rata kasus mingguan per kecamatan = 5, SD = 3.<br /><strong>Aturan:</strong> alert bila kasus minggu ini &gt; rata-rata + 2×SD (= 11) selama 2 minggu berturut.<br />Minggu 12: 13 kasus. Minggu 13: 15 kasus → <strong>ALERT</strong> → investigasi + fogging fokus.<br />Trade-off: ambang rendah = cepat tapi banyak false alarm (kelelahan petugas); ambang tinggi = tenang tapi terlambat.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Surveilans indikator itu cek tensi rutin — terjadwal, sebanding. Event-based itu tetangga yang lapor “ada yang batuk-batuk sekampung” — cepat tapi berisik. Sistem yang baik punya keduanya: telinga resmi dan telinga jalanan.</p>
      <p><strong>Kapan memakai:</strong> Monitoring rutin penyakit prioritas (DBD, campak, diare) → indikator. Ancaman baru/tak terduga → event-based. Keduanya butuh ambang alert yang dikalibrasi.</p>

      <PlotlyChart
        data={hd16AlertData}
        title="Kasus DBD Mingguan — Alert di Minggu 12–13"
        layout={hd16AlertDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Garis biru = kasus per minggu; garis kuning putus-putus = ambang alert (11). Cari kapan biru menembus kuning.</p>
        <p><strong>Interpretasi:</strong> Minggu 1–11: fluktuasi normal di bawah ambang. Minggu 12–13: dua minggu berturut di atas ambang → alert valid, bukan noise sesaat. Respons di minggu 13 (bukan minggu 16 saat RS penuh) adalah seluruh nilai surveilans: <strong>deteksi dini membeli waktu</strong>.</p>
      </div>

      <h2 id="sir">Model SIR — Tiga Kompartemen</h2>
      <p><strong>Definisi.</strong> <strong>SIR</strong>: populasi dibagi <strong>S</strong> (susceptible/rentan), <strong>I</strong> (infectious/menular), <strong>R</strong> (recovered/kebal). Infeksi mengalir S→I→R dengan laju beta (penularan) dan gamma (kesembuhan).</p>
      <Tex math={String.raw`\frac{dS}{dt} = -\beta \frac{SI}{N}, \quad \frac{dI}{dt} = \beta \frac{SI}{N} - \gamma I, \quad \frac{dR}{dt} = \gamma I`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`S, I, R`} />: jumlah rentan, menular, sembuh/kebal pada waktu t</li>
          <li><Tex math={String.raw`\beta`} />: laju penularan (kontak × peluang infeksi per kontak)</li>
          <li><Tex math={String.raw`\gamma`} />: laju kesembuhan = 1/periode menular</li>
          <li><Tex math={String.raw`N`} />: total populasi (S+I+R)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Epidemi tumbuh bila infeksi baru (βSI/N) melebihi kesembuhan (γI). Intervensi bekerja via tiga tuas: turunkan β (masker, isolasi, fogging), naikkan γ (obati cepat), kecilkan S (vaksinasi → langsung ke R).</p>
      <details className="worked">
        <summary>📐 Contoh: membaca kurva SIR</summary>
        <p>Populasi 10.000, I awal 10, β=0,3, γ=0,1.<br />Kurva I naik eksponensial dulu (banyak S), mencapai puncak saat S menipis, lalu turun — membentuk <strong>lengkung epidemik</strong> klasik.<br />Intervensi: β turun 50% (pembatasan) → puncak <strong>lebih rendah dan lebih lambat</strong> (flatten the curve) — memberi RS waktu. Total terinfeksi akhir juga turun.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> SIR itu seperti model kebakaran hutan: S = pohon kering, I = api, R = abu. Api menyebar sebanding dengan (api × pohon). Memadamkan = kurangi pohon (sekat bakar/vaksin), siram api (obati), atau hambat angin (batasi kontak).</p>
      <p><strong>Kapan memakai:</strong> Memahami dinamika wabah, menguji skenario intervensi, komunikasi ke publik/pembuat kebijakan. Bukan untuk prediksi presisi jangka panjang — perilakunya terlalu sederhana untuk itu.</p>

      <h2 id="r0">R0, Rt &amp; Forecasting — Si Angka Terkenal</h2>
      <p><strong>Definisi.</strong> <strong>R0</strong> = rata-rata kasus sekunder dari 1 kasus pada populasi rentan penuh. <strong>Rt</strong> = versi saat-t (dengan intervensi/kekebalan). <strong>Herd immunity threshold</strong> = 1 − 1/R0.</p>
      <Tex math={String.raw`R_0 = \frac{\beta}{\gamma} \quad ; \quad \text{Herd immunity} = 1 - \frac{1}{R_0}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`R_0`} />: reproduction number dasar (sifat patogen + kontak normal)</li>
          <li><Tex math={String.raw`R_t`} />: reproduction number efektif saat t (bisa &lt; R0 karena intervensi)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rt &gt; 1 = wabah tumbuh; Rt &lt; 1 = padam. R0=3 → butuh 67% kebal untuk herd immunity. <strong>R0 bukan vonis mati</strong> — ia bisa diturunkan menjadi Rt&lt;1 via intervensi.</p>
      <details className="worked">
        <summary>📐 Contoh: R0 campak vs influenza</summary>
        <p>Campak R0 ≈ 12–18 → herd immunity 92–94% — itulah kenapa cakupan imunisasi harus &gt;95%.<br />Influenza R0 ≈ 1,3 → threshold ~23%, tapi mutasi membuat kekebalan cepat usang.<br />DBD: tidak ada R0 tunggal sederhana (vektor nyamuk!) — butuh model vektor. Pelajaran: angka tanpa konteks biologinya menyesatkan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> R0 itu selebritas epidemiologi: terkenal, sering dikutip, sering disalahpahami. Ia bukan kecepatan, bukan keganasan — melainkan <em>potensi beranak-pinak</em> dalam kondisi ideal. Rt adalah R0 yang sudah bekerja dan membayar pajak intervensi.</p>
      <p><strong>Kapan memakai:</strong> Komunikasi risiko, target cakupan vaksinasi, evaluasi apakah intervensi cukup (Rt&lt;1?).</p>
      <div className="callout callout-warning"><strong>Forecasting wabah:</strong> model mekanistik (SIR) bagus untuk skenario (“bagaimana jika”), model statistik/time-series bagus untuk jangka pendek (1–4 minggu). Keduanya runtuh bila perilaku berubah tiba-tiba. Selalu sajikan <strong>rentang skenario</strong>, bukan satu angka pasti — peramal wabah yang pede adalah peramal yang salah.</div>

      <h2 id="spasial">Analisis Spasial Wabah — Si Tukang Peta</h2>
      <p><strong>Definisi.</strong> Kasus dipetakan per wilayah/waktu untuk menemukan <strong>klaster</strong> (hotspot) via statistik spasial (scan statistic, Moran's I). Tujuannya: intervensi fokus, bukan semprot merata.</p>
      <details className="worked">
        <summary>📐 Contoh: hotspot DBD kota</summary>
        <p>Scan statistic menemukan klaster 5 kelurahan dengan kasus 3x ekspektasi (p&lt;0,01).<br />Cek: bukan artefak pelaporan (RS di sana tidak lebih rajin lapor — diverifikasi).<br />Aksi: fogging + PSN fokus 5 kelurahan; 20 kelurahan lain cukup monitoring.<br /><strong>Waspada ecological fallacy:</strong> kelurahan “kotor” tinggi kasus ≠ setiap rumah kotor berisiko — jangan stigmatisasi warga.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Peta wabah itu seperti foto termal: menunjukkan di mana apinya, bukan sekadar “ada api di kota ini”. Fogging merata saat api hanya di 3 RW = bakar uang + racun sia-sia.</p>
      <p><strong>Kapan memakai:</strong> Targeting intervensi vektor (DBD), alokasi tim investigasi, evaluasi cakupan per wilayah.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Dari Sinyal ke Keputusan Intervensi</h2>
      <details className="worked">
        <summary>📐 Worked example: kapan fogging “berhasil” vs “musiman” (klik untuk buka)</summary>
        <p>Kecamatan X: kasus DBD mingguan — M1: 12, M2: 18, M3: 31, M4: 55 (fogging massal dilakukan), M5: 40, M6: 22, M7: 10. Klaim: “fogging berhasil, kasus turun 80%!”</p>
        <p><strong>Langkah 1 — Plot ekspektasi tanpa intervensi.</strong> Rasio pertumbuhan M1→M4 ≈ 1,7×/minggu. Model SIR sederhana dengan Rt ≈ 1,7 memprediksi puncak alamiah di M5–M6 <em>tanpa</em> intervensi (populasi rentan menipis) — penurunan setelah M4 <strong>diharapkan</strong> bahkan jika fogging tidak dilakukan.</p>
        <p><strong>Langkah 2 — Cari pembanding.</strong> Kecamatan Y (tetangga, tanpa fogging): M1: 10, M4: 48, M7: 9 — pola <strong>identik</strong>. Jika fogging bekerja, X harus turun <em>lebih cepat/lebih dalam</em> dari Y. Tidak terjadi.</p>
        <p><strong>Langkah 3 — Pertimbangkan musiman.</strong> Data 5 tahun: DBD selalu puncak di bulan yang sama lalu turun — <strong>musim hujan selesai</strong>, bukan fogging, yang mengakhiri wabah. Fogging yang dilakukan <em>setelah</em> puncak selalu “terlihat berhasil”.</p>
        <p><strong>Langkah 4 — Evaluasi yang benar.</strong> Desain yang valid: bandingkan kecamatan yang difogging <em>sebelum</em> puncak vs kontrol — atau ukur <strong>kepadatan vektor</strong> (angka bebas jentik/ABJ) sebelum-sesudah, bukan cuma kasus. Fogging membunuh nyamuk dewasa <em>hari itu</em>; tanpa pemberantasan sarang, populasi pulih dalam 2 minggu.</p>
        <p><strong>Pelajaran:</strong> “sesudah fogging kasus turun” adalah <strong>post hoc ergo propter hoc</strong> — sesudahnya belum tentu karenanya. Selalu tanya: “apa yang terjadi di tempat yang <em>tidak</em> diintervensi?”</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — Rt adalah “termometer”, bukan “ramalan cuaca”:</strong> Rt &lt; 1 berarti wabah menyusut <em>jika kondisi tidak berubah</em> — tapi Rt dihitung dari data 1–2 minggu lalu (tertunda pelaporan), dan perilaku manusia berubah justru <em>karena</em> melihat Rt. Ini umpan balik: mengumumkan “Rt turun” bisa membuat orang lengah → Rt naik lagi. Gunakan Rt untuk <strong>menilai apakah intervensi kemarin bekerja</strong>, bukan untuk <strong>meramal bulan depan</strong>. Dan selalu laporkan interval kepercayaannya: Rt = 0,95 (95% CI: 0,7–1,3) berarti “tidak tahu” — bukan “terkendali”.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — EWARS/SKDR dan jebakan “data masuk = data benar”:</strong> Sistem Kewaspadaan Dini dan Respons (SKDR) Indonesia mengumpulkan laporan mingguan dari puskesmas — fondasi surveilans nasional. Tapi analisnya wajib tahu tiga distorsinya: (1) <strong>keterlambatan lapor</strong> — kasus minggu ini baru lengkap 2–3 minggu lagi (nowcasting dibutuhkan); (2) <strong>definisi sindromik</strong> — “demam” bukan “DBD terkonfirmasi”, sehingga sinyal tercampur penyakit lain; (3) <strong>insentif lapor</strong> — daerah dengan surveilans baik <em>terlihat</em> lebih banyak kasus (paradoks: yang rajin lapor tampak lebih parah). Analis yang membandingkan antar-kabupaten tanpa menormalkan kualitas pelaporan sedang <strong>menghukum yang jujur</strong>.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Model Adalah Peta — Jangan Tinggal di Dalamnya</h2>
      <p>Model SIR elegan: tiga kompartemen, dua parameter, kurva cantik. Tapi analis profesional tahu <strong>lima kebohongan</strong> yang ia ceritakan:</p>
      <p><strong>1. “Populasi tercampur sempurna.”</strong> SIR mengasumsikan tiap orang bertemu tiap orang lain dengan peluang sama — padahal penularan terjadi di <strong>jaringan</strong> (rumah, sekolah, pasar). Akibat: SIR <em>melebih-lebihkan</em> kecepatan awal (super-spreader tidak dimodelkan) dan <em>meremehkan</em> ekor wabah (kantong rentan terisolasi). Untuk keputusan lokal, <strong>model berbasis agen/jaringan</strong> atau minimal <strong>stratifikasi usia</strong> jauh lebih jujur.</p>
      <p><strong>2. “Parameter konstan.”</strong> β (laju penularan) berubah saat: musim hujan tiba, sekolah libur, masker diwajibkan, kepanikan menyebar. Model dengan β konstan yang di-fit ke 8 minggu lalu <strong>tidak berlaku</strong> untuk 8 minggu depan jika perilaku berubah. Solusi: <strong>estimasi β berjalan</strong> (time-varying) + skenario (“jika mobilitas naik 20%…”).</p>
      <p><strong>3. “Semua teramati.”</strong> Kasus tercatat = puncak gunung es (asimtomatik, tidak berobat, tidak dites). Model yang di-fit ke kasus tercatat tanpa <strong>faktor under-reporting</strong> meremehkan skala wabah 5–10×. Selalu estimasi <em>multiplier</em> dari survei seroprevalensi atau studi khusus.</p>
      <p><strong>4. “Satu R0 untuk semua.”</strong> R0 adalah <strong>sifat pasangan patogen-populasi-perilaku</strong>, bukan sifat virus semata. R0 campak 12–18 (di populasi tak divaksinasi); di populasi vaksinasi 95%, <em>Re efektif</em> &lt; 1. Mengutip “R0 COVID = 3” tanpa konteks populasi &amp; waktu = <strong>angka yatim</strong>.</p>
      <p><strong>5. “Model memprediksi masa depan.”</strong> Model wabah <strong>tidak meramal</strong> — ia <strong>memproyeksikan skenario</strong> (“<em>jika</em> β tetap, <em>maka</em>…”). Bedanya fundamental: ramalan diklaim benar/salah; proyeksi adalah <strong>alat berpikir</strong> untuk membandingkan intervensi. Analis yang mempresentasikan satu kurva “prediksi” tanpa skenario pembanding sedang <strong>berjualan kepastian palsu</strong>.</p>
      <div className="callout">
        <p><strong>Prinsip George Box untuk wabah:</strong> “Semua model salah, tapi beberapa berguna.” Model SIR berguna untuk: <strong>memahami dinamika</strong> (mengapa puncak terjadi), <strong>membandingkan intervensi</strong> (mana yang menekan Rt di bawah 1), <strong>komunikasi</strong> (menjelaskan eksponensial ke publik). Ia <strong>tidak</strong> berguna untuk: meramal tanggal puncak, mengklaim presisi desimal, menggantikan surveilans lapangan.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;R0 tinggi = penyakit lebih mematikan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> R0 mengukur penularan, bukan keparahan. Campak R0 15 tapi jarang mematikan dengan gizi baik; Ebola R0 ~2 tapi sangat mematikan. Jangan campuradukkan “cepat menyebar” dengan “mematikan” — kebijakan untuk keduanya berbeda.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model SIR bisa memprediksi puncak wabah dengan tepat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> SIR adalah model <em>skenario</em>, bukan kristal. Parameter (β) berubah saat perilaku berubah; data kasus underreported. Gunakan untuk “jika intervensi X, puncak bergeser seberapa” — bukan “puncak tanggal 17 Agustus”.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kasus turun = intervensi berhasil (atau sebaliknya)&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kurva epidemik turun sendiri saat S habis ( susceptible depletion) — bahkan tanpa intervensi. Klaim keberhasilan butuh pembanding: Rt sebelum vs sesudah, atau wilayah kontrol. Post hoc ergo propter hoc adalah fallacy favorit pasca-wabah.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Menghitung Rt dari Data Kasus Mingguan</h2>
      <details className="worked">
        <summary>📐 Worked example: Rt kecamatan — naik atau turun? (klik untuk buka)</summary>
        <p>Data kasus DBD mingguan kecamatan X: M1=12, M2=18, M3=31, M4=55, M5=40, M6=22. Interval serial DBD ≈ 2 minggu (waktu antar generasi kasus).</p>
        <p><strong>Langkah 1 — Prinsip Rt.</strong> Rt ≈ (kasus periode ini) / (kasus satu interval serial lalu). Dengan interval serial 2 minggu: Rt(M3) ≈ M3/M1 = 31/12 = <strong>2,6</strong>; Rt(M4) ≈ M4/M2 = 55/18 = <strong>3,1</strong>; Rt(M5) ≈ M5/M3 = 40/31 = <strong>1,3</strong>; Rt(M6) ≈ M6/M4 = 22/55 = <strong>0,4</strong>.</p>
        <p><strong>Langkah 2 — Baca trennya.</strong> Rt &gt; 1 (M3–M5): wabah <strong>tumbuh</strong> — tiap kasus menghasilkan &gt;1 kasus baru. Rt &lt; 1 (M6): wabah <strong>menyusut</strong>. Titik balik terjadi di M5–M6 — <strong>sebelum</strong> kasus turun drastis (kasus adalah <em>akibat</em> tertunda; Rt adalah <em>sinyal</em> kini).</p>
        <p><strong>Langkah 3 — Koreksi keterlambatan lapor (nowcasting).</strong> Data M6 “22” belum lengkap (laporan telat 1–2 minggu). Dari pola historis: laporan minggu berjalan rata-rata <strong>70% lengkap</strong> → estimasi terkoreksi M6 ≈ 22/0,7 ≈ 31 → Rt(M6) ≈ 31/55 = <strong>0,56</strong> — masih &lt;1, kesimpulan tidak berubah. <strong>Selalu nowcast sebelum menyimpulkan</strong> — Rt dari data mentah minggu terakhir hampir selalu <em>terlihat</em> turun (padahal datanya belum masuk).</p>
        <p><strong>Langkah 4 — Interval kepercayaan.</strong> Dengan kasus kecil, Rt(M3)=2,6 punya 95% CI mis. 1,4–4,2 — <strong>pasti &gt;1</strong> (sinyal kuat). Rt(M5)=1,3 dengan CI 0,8–2,1 — <strong>belum pasti</strong> (bisa masih tumbuh!). Jangan umumkan “terkendali” dari Rt yang CI-nya mencakup 1.</p>
        <p><strong>Langkah 5 — Keputusan.</strong> M3 (Rt 2,6, CI &gt;1): <strong>intervensi sekarang</strong> (PSN, larvasidasi) — jangan tunggu M4. M6 (Rt 0,56): <strong>pertahankan</strong> hingga 2 interval serial &lt;1 sebelum longgarkan. Inilah <strong>surveilans sebagai sistem saraf</strong>: merasakan di M3, bukan menyesal di M8.</p>
        <p><strong>Pelajaran:</strong> Rt bukan ramalan — ia adalah <strong>kecepatan saat ini</strong>. Dan kecepatan dihitung dari data yang <strong>sudah dikoreksi keterlambatannya</strong>, bukan data mentah.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bangun <strong>dashboard Rt mingguan</strong> untuk wilayahmu: kasus → nowcasting → Rt + CI → status (tumbuh/stabil/menyusut/tidak pasti). Satu dashboard ini lebih berguna daripada 10 laporan naratif.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bedakan <strong>tanggal onset vs tanggal lapor</strong>. Kurva berdasarkan tanggal lapor bergeser 1–2 minggu dari realita — keputusan dari kurva lapor = keputusan dari masa lalu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu tanyakan <strong>“berapa yang tidak tercatat?”</strong> Kasus ringan tidak berobat = underreporting. Estimasi dengan survei serologi atau capture-recapture bila penting.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk komunikasi publik: tunjukkan <strong>Rt dan tren</strong>, bukan R0 dan prediksi titik. “Rt 0,8 dan turun” menenangkan tanpa janji palsu.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi SIR &amp; Efek Intervensi</h2>
      <p>Simulasikan SIR diskret 200 hari. Bandingkan tanpa intervensi vs β turun 40% di hari 30. Lihat puncak bergeser dan total kasus turun.</p>
      <PyodideLab
        title="🔬 Lab 1: Simulasi SIR &amp; Efek Intervensi"
        hint="Coba intervensi lebih awal (hari 15) vs terlambat (hari 60). Selisih total kasusnya = harga keterlambatan. Inilah nilai surveilans dini secara kuantitatif."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Aturan Alert — Sensitivitas vs False Alarm</h2>
      <p>Bangkitkan 52 minggu kasus (baseline + satu wabah). Terapkan aturan alert (mean+2SD, 2 minggu berturut) dan ukur: deteksi minggu keberapa? berapa false alarm?</p>
      <PyodideLab
        title="🔬 Lab 2: Aturan Alert — Sensitivitas vs False Alarm"
        hint="Ubah ambang ke mean+1SD. Deteksi lebih cepat tapi false alarm naik — itulah trade-off yang harus dinegosiasikan dengan kapasitas petugas."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: SKDR — Sistem Saraf Indonesia</h2>
      <p><strong>SKDR</strong> (Sistem Kewaspadaan Dini dan Respons) adalah sistem surveilans nasional Indonesia: puskesmas melaporkan <strong>23 penyakit/sindrom prioritas</strong> setiap minggu — dari DBD, campak, hingga diare. Ditambah <strong>EWARS</strong> untuk situasi krisis/bencana. Inilah “sistem saraf” yang lesson ini ajarkan — dalam bentuk nyatanya.</p>
      <p><strong>Cara kerja ideal:</strong> laporan mingguan → agregasi kabupaten → <strong>ambang batas alert</strong> per penyakit (mis. DBD: kasus minggu ini &gt; rata-rata 5 tahun + 2 SD) → alert → investigasi &amp; respons (PSN, fogging fokus) dalam 24–48 jam.</p>
      <p><strong>Tiga distorsi yang wajib dipahami analis:</strong> ① <strong>Keterlambatan &amp; kelengkapan</strong> — tidak semua puskesmas lapor tepat waktu; “penurunan kasus minggu ini” sering berarti “laporan belum masuk”. Analis SKDR selalu menampilkan <strong>kurva kelengkapan laporan</strong> di samping kurva kasus. ② <strong>Sindromik, bukan etiologik</strong> — “demam” bisa DBD, tifoid, atau flu; sinyal SKDR = <strong>sinyal untuk investigasi</strong>, bukan diagnosis. Jangan umumkan “wabah DBD” dari sinyal demam. ③ <strong>Paradoks pelapor baik</strong> — kabupaten dengan surveilans rajin <em>terlihat</em> lebih banyak kasus → <strong>jangan peringkatkan</strong> kabupaten dari angka mentah SKDR; normalkan dengan <em>indikator kualitas surveilans</em> (kelengkapan, ketepatan waktu).</p>
      <p><strong>Keputusan fogging yang benar (lanjutan mini-case):</strong> fogging <strong>bukan</strong> respons rutin tiap ada kasus — ia untuk <strong>KLB terkonfirmasi</strong> dengan transmisi aktif, <em>fokus</em> radius 200m dari kasus, <em>ditambah</em> PSN (pemberantasan sarang — yang justru lebih penting). Fogging massal kota = <strong>teater kesehatan</strong>: membunuh nyamuk dewasa hari itu, jentik menetas minggu depan. Analis yang bisa menghitung “efektivitas fogging vs PSN per rupiah” mengubah anggaran Dinkes dari <strong>seremonial</strong> menjadi <strong>strategis</strong>.</p>
      <div className="tip">
        <p><strong>💡 Intuisi surveilans:</strong> nilai SKDR bukan di <em>datanya</em> (yang kasar dan telat) — melainkan di <strong>rutinitasnya</strong>: ribuan petugas yang menghitung tiap minggu membangun <strong>kebiasaan waspada</strong>. Analis memperkuat sistem ini bukan dengan model canggih, melainkan dengan <strong>umpan balik cepat</strong>: kembalikan analisis ke puskesmas (“kecamatanmu naik 3 minggu berturut-turut”) — <strong>data yang dibaca akan dilaporkan lebih baik</strong>.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Monitoring rutin penyakit prioritas → Surveilans indikator + alert</h3>
        <p><strong>Kondisi:</strong> Penyakit known, butuh tren konsisten.</p>
        <p><strong>Kenapa:</strong> Terstruktur, sebanding antar waktu/wilayah.</p>
        <p><strong>Contoh nyata:</strong> EWARS mingguan untuk DBD, campak, diare.</p>
      </div>
      <div className="decision-card">
        <h3>2. Ancaman baru/tak terduga → Event-based surveillance</h3>
        <p><strong>Kondisi:</strong> Belum ada definisi kasus mapan.</p>
        <p><strong>Kenapa:</strong> Cepat menangkap sinyal aneh.</p>
        <p><strong>Contoh nyata:</strong> Klaster pneumonia tak jelas penyebabnya (awal COVID).</p>
      </div>
      <div className="decision-card">
        <h3>3. Uji skenario intervensi → Model SIR/kompartemen</h3>
        <p><strong>Kondisi:</strong> Pertanyaan “bagaimana jika” untuk kebijakan.</p>
        <p><strong>Kenapa:</strong> Mekanistik, transparan, komunikatif.</p>
        <p><strong>Contoh nyata:</strong> Dampak cakupan vaksinasi 70% vs 90% terhadap puncak.</p>
      </div>
      <div className="decision-card">
        <h3>4. Prediksi jangka pendek (1–4 minggu) → Model statistik/time-series</h3>
        <p><strong>Kondisi:</strong> Butuh angka operasional (kebutuhan RS minggu depan).</p>
      <PlotlyChart
        data={hd16RtData}
        title="Rt Mingguan — Intervensi Menekan di Bawah 1"
        layout={hd16RtDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Garis biru = Rt per minggu; kuning putus-putus = ambang 1. Perhatikan kapan biru menembus ke bawah kuning.</p>
        <p><strong>Interpretasi:</strong> Rt turun dari 2,1 ke 0,5 dalam 8 minggu — intervensi bekerja (atau S habis; bedakan dengan data!). Menembus di bawah 1 = titik balik wabah. Inilah satu grafik yang paling berguna untuk rapat krisis.</p>
      </div>
        <p><strong>Kenapa:</strong> Lebih akurat jangka pendek; SIR terlalu kaku.</p>
        <p><strong>Contoh nyata:</strong> Proyeksi kebutuhan bed IGD minggu depan.</p>
      </div>
      <div className="decision-card">
        <h3>5. Targeting wilayah → Analisis spasial hotspot</h3>
        <p><strong>Kondisi:</strong> Sumber daya terbatas, sebaran tidak merata.</p>
        <p><strong>Kenapa:</strong> Fokus di mana api menyala.</p>
        <p><strong>Contoh nyata:</strong> Fogging/PSN fokus 5 kelurahan hotspot DBD.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Pakai tanggal onset, bukan tanggal lapor, untuk kurva.</li>
          <li>Tanya underreporting sebelum percaya angka.</li>
          <li>Rt untuk aksi; R0 untuk konteks.</li>
          <li>Skenario, bukan ramalan titik.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Fogging Massal: Berhasil atau Musiman?</h2>
      <div className="callout">
        <p>Kota melakukan fogging massal DBD di bulan Maret. Kasus turun 60% di April–Mei. Walikota mengklaim sukses dan menganggarkan fogging rutin tiap bulan.</p>
      <p>Kamu cek data 5 tahun: kasus DBD selalu turun di April–Mei (musim kemarau, nyamuk berkurang). Tidak ada wilayah kontrol. Rt sudah &lt; 1 sejak Februari (sebelum fogging).</p>
        <p><strong>Pertanyaan:</strong> Apakah fogging berhasil? Apa rekomendasi anggarannya?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tidak terbukti. Tiga masalah: (1) musiman — penurunan terjadi tiap tahun tanpa fogging; (2) Rt&lt;1 sebelum intervensi — wabah sudah padam sendiri (S habis/musim); (3) tanpa kontrol, tak ada pembanding (post hoc fallacy). Rekomendasi: JANGAN anggarkan fogging rutin bulanan (mahal, resistensi insektisida, dampak lingkungan); alihkan ke PSN (pemberantasan sarang nyamuk) + surveilans larva + fogging FOKUS saat alert hotspot (HD16). Uji fogging yang benar butuh desain stepped-wedge atau kontrol. Pelajaran: intervensi yang “berhasil” setiap musim adalah intervensi yang menunggangi musim.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Rt = 0,7 artinya…"
        options={["Wabah tumbuh cepat",
          "Tiap kasus menulari rata-rata 0,7 orang — wabah menyusut",
          "70% populasi kebal",
          "Tidak ada kasus"]}
        correct={1}
        explanation="Benar: di bawah 1 = padam. Di atas 1 = tumbuh. Inilah angka aksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Campak R0 ~15. Cakupan imunisasi untuk herd immunity sekitar…"
        options={["50%",
          "93%+",
          "20%",
          "100% pasti"]}
        correct={1}
        explanation="Benar: 1−1/15 ≈ 93%. Itulah kenapa target campak >95% — R0 tinggi = ambang tinggi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam SIR, intervensi masker/isolasi bekerja via…"
        options={["Menaikkan gamma",
          "Menurunkan beta (laju penularan)",
          "Menambah N",
          "Menghapus R"]}
        correct={1}
        explanation="Benar: β = kontak × peluang infeksi. Vaksinasi mengecilkan S; pengobatan cepat menaikkan γ."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kurva kasus berdasarkan tanggal LAPOR vs tanggal ONSET. Masalahnya?"
        options={["Tidak ada",
          "Kurva lapor terlambat 1–2 minggu dari realita — keputusan dari masa lalu",
          "Kurva lapor lebih akurat",
          "Onset tidak penting"]}
        correct={1}
        explanation="Benar: lag pelaporan menggeser persepsi. Rt dari data lapor = Rt dua minggu lalu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kasus turun setelah intervensi. Agar klaim “intervensi berhasil” valid, butuh…"
        options={["Siaran pers",
          "Pembanding: Rt sebelum vs sesudah / wilayah kontrol (waspadai penurunan alami & musiman)",
          "Anggaran lebih",
          "Tidak butuh apa-apa"]}
        correct={1}
        explanation="Benar: kurva turun sendiri saat S habis atau musim berganti. Tanpa kontrol = post hoc fallacy."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Fogging merata satu kota saat hotspot hanya di 3 RW adalah…"
        options={["Paling efektif",
          "Boros + risiko resistensi — gunakan analisis spasial untuk fokus",
          "Wajib regulasi",
          "Tidak ada alternatif"]}
        correct={1}
        explanation="Benar: peta hotspot menghemat sumber daya dan mengurangi dampak lingkungan. Presisi > volume."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Surveilans = <strong>indikator</strong> (rutin) + <strong>event-based</strong> (sinyal cepat); alert = trade-off cepat vs false alarm.</li>
          <li><strong>SIR</strong>: S→I→R; tiga tuas: turunkan β, naikkan γ, kecilkan S.</li>
          <li><strong>R0</strong> = potensi; <strong>Rt</strong> = realita untuk aksi; herd immunity = 1−1/R0.</li>
          <li>Model untuk <strong>skenario</strong>, bukan ramalan titik; sajikan rentang.</li>
          <li>Pakai <strong>tanggal onset</strong>; tanyakan underreporting.</li>
          <li>Klaim keberhasilan butuh <strong>pembanding</strong> (kontrol/musiman/Rt).</li>
          <li><strong>Spasial</strong>: fokus di hotspot; waspadai ecological fallacy.</li>
          <li>Deteksi dini membeli waktu — seluruh nilai surveilans ada di kecepatan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd15-imaging-medis" className="btn btn-secondary btn-sm">← HD15</Link>
        <Link href="/learn/hd17-ekonomi-kesehatan" className="btn btn-primary btn-sm">HD17 →</Link>
      </div>
    </div>
  );
}
