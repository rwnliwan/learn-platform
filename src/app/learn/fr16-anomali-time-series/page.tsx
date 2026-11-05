"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function FR16Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(5);
  const tsData = [
    {
      x: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
      y: [42, 45, 40, 44, 48, 30, 25, 43, 46, 41, 180, 210, 195, 45],
      type: "scatter",
      mode: "lines+markers",
      name: "Transaksi/jam (ribu)",
      line: { color: "#2a7de1", width: 2 },
      marker: { size: 6 },
    },
  ];

  const decomposeData = [
    {
      x: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
      y: [100, 105, 103, 108, 112, 110, 115, 118, 250, 260, 255, 120],
      type: "scatter",
      mode: "lines+markers",
      name: "Volume (aktual)",
      line: { color: "#2a7de1", width: 2 },
    },
    {
      x: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
      y: [100, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124],
      type: "scatter",
      mode: "lines",
      name: "Tren (ekspektasi)",
      line: { color: "#94a3b8", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Deteksi anomali time series: residual = aktual - ekspektasi
# Data: volume transaksi harian merchant (12 hari). Hari 9-11 = serangan?
import statistics as st

vol = [100, 105, 103, 108, 112, 110, 115, 118, 250, 260, 255, 120]

# Ekspektasi sederhana: rata-rata 8 hari pertama (baseline 'normal')
baseline = vol[:8]
mu = st.mean(baseline)
sd = st.stdev(baseline)
print(f"Baseline: mean={mu:.1f}, sd={sd:.1f}")
print()
for i, v in enumerate(vol):
    z = (v - mu) / sd
    status = "🚨 ANOMALI" if abs(z) > 3 else "✅ normal"
    print(f"Hari {i+1:2d}: {v:3d}  z={z:+5.1f}  {status}")
print()
print("COBA UBAH: baseline vol[:8] -> vol[:5] (lebih pendek).")
print("mu/sd berubah, ambang ikut berubah. Pelajaran: 'normal' = PILIHAN")
print("jendela baseline. Pilih yang mewakili 'rezim' saat ini (lihat change-point).")`;

  const lab2Code = `# Change-point: kapan 'rezim' berubah? (CUSUM sederhana)
# CUSUM: jumlahkan deviasi kumulatif dari rata-rata; belok tajam = change-point.
data = [10, 11, 9, 10, 12, 11, 10, 9, 25, 27, 26, 28, 27, 26]
import statistics as st

mu = st.mean(data[:8])  # rata-rata rezim awal
cusum_pos, cusum_neg = 0, 0
print(f"Rata-rata rezim awal: {mu:.1f}")
print(f"{'Hari':>4s} {'Nilai':>5s} {'CUSUM+':>7s}  Status")
for i, x in enumerate(data):
    cusum_pos = max(0, cusum_pos + (x - mu - 1))
    cusum_neg = min(0, cusum_neg + (x - mu + 1))
    status = "🔴 CHANGE?" if cusum_pos > 8 else ""
    print(f"{i+1:4d} {x:5d} {cusum_pos:7.1f}  {status}")
print()
print("COBA UBAH: data hari 9-14 jadi [12,11,10,9,10,11] (tidak ada perubahan).")
print("CUSUM tetap ~0 = tidak ada alarm. Pelajaran: CUSUM mendeteksi")
print("PERGESERAN LEVEL yang bertahan, bukan spike sesaat.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">FR16 — Fraud / ML Analytics</span>
        <h1 className="display-title">Anomali Time Series:<br />Saat &ldquo;Kapan&rdquo; Sama Pentingnya dengan &ldquo;Apa&rdquo;</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 5 quiz &bull; 1 mini-case &bull; 2 worked example &bull; 1 kasus nyata &bull; FAQ</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Lonjakan 180 Ribu yang &ldquo;Normal&rdquo;</a></li>
          <li><a href="#dekomposisi">Dekomposisi: Tren + Musiman + Residual</a></li>
          <li><a href="#residual">Deteksi via Residual: Anomali = Sisa yang Tak Terjelaskan</a></li>
          <li><a href="#changepoint">Change-Point: Kapan Rezim Berganti</a></li>
          <li><a href="#cusum">CUSUM: Alarm Pergeseran Level</a></li>
          <li><a href="#lab1">🔬 Lab 1: Deteksi via Residual</a></li>
          <li><a href="#lab2">🔬 Lab 2: CUSUM Change-Point</a></li>
          <li><a href="#worked">📐 Worked Example: Residual &amp; CUSUM Manual</a></li>

          <li><a href="#intuisi">🧭 Intuisi Lapangan: Waktu Punya Memori</a></li>

          <li><a href="#peta">🗺️ Peta Keputusan: Metode untuk Pola Apa</a></li>
          <li><a href="#peta-lanjut">🗺️ Peta Keputusan Lanjutan: Jenis Anomali</a></li>
          <li><a href="#kasus-nyata">🇮🇩 Kasus Nyata: Settlement Tengah Malam</a></li>

          <li><a href="#case">📋 Mini-Case: ATM Mendadak Ramai Jam 3 Pagi</a></li>
          <li><a href="#faq">❓ Tanya Jawab: Anomali Time Series</a></li>

          <li><a href="#latihan">Latihan Mandiri: Membaca Deret Waktu</a></li>

          <li><a href="#quiz">✏️ Quiz (5 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mendekomposisi time series menjadi <strong>tren + musiman + residual</strong> dan menjelaskan peran tiap komponen.</li>
          <li>Mendeteksi anomali dari <strong>residual</strong> (aktual − ekspektasi) dengan ambang z-score.</li>
          <li>Menjelaskan <strong>change-point detection</strong> dan perbedaannya dengan deteksi spike.</li>
          <li>Mengimplementasikan <strong>CUSUM</strong> sederhana untuk pergeseran level.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Lonjakan 180 Ribu yang &ldquo;Normal&rdquo;</h2>
      <div className="story">
        <p>Tim monitoring &ldquo;PayKu&rdquo; punya alert sederhana: &ldquo;transaksi/jam &gt; 100 ribu = anomali&rdquo;. Kamis jam 14:00: <strong>180 ribu</strong> — alert berbunyi, investigator dikerahkan. Hasil? <strong>Promo 11.11</strong>. False alarm yang menghabiskan 3 jam kerja tim.</p>
        <p>Jumat jam 03:00: <strong>45 ribu</strong> transaksi/jam — di bawah ambang, tidak ada alert. Hasil? <strong>Serangan carding massal</strong> — 45 ribu di jam 3 pagi adalah <strong>10× lipat</strong> dari normal jam segitu (4 ribu). Lolos tanpa suara.</p>
        <p>Twist-nya: <strong>ambang absolut buta terhadap waktu</strong>. 180 ribu di jam promo = normal; 45 ribu di jam 3 pagi = serangan. Keduanya salah dinilai karena sistem tidak paham <strong>konteks temporal</strong>: jam berapa, hari apa, ada event apa. Lesson ini: <strong>anomali time series = penyimpangan dari EKSPEKTASI pada titik waktu itu</strong> — bukan dari angka absolut.</p>
      </div>

      <h2 id="dekomposisi">Dekomposisi: Tren + Musiman + Residual</h2>
      <p><strong>Definisi.</strong> Setiap time series = gabungan tiga komponen:</p>
      <Tex math={String.raw`Y_t = T_t + S_t + R_t`} block />
      <ul>
        <li><Tex math={String.raw`T_t`} /> (<strong>tren</strong>): arah jangka panjang — bisnis tumbuh 2%/minggu.</li>
        <li><Tex math={String.raw`S_t`} /> (<strong>musiman</strong>): pola berulang — ramai jam 12 &amp; 19, sepi jam 3 pagi; ramai akhir bulan (gajian).</li>
        <li><Tex math={String.raw`R_t`} /> (<strong>residual</strong>): sisa yang tak dijelaskan tren+musiman — <strong>di sinilah anomali bersembunyi</strong>.</li>
      </ul>

      <PlotlyChart
        data={decomposeData}
        title="Aktual vs Tren: Anomali = Jarak ke Ekspektasi"
        layout={{ xaxis: { title: "Minggu" }, yaxis: { title: "Volume (ribu)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis biru = volume aktual, garis abu-abu putus-putus = tren ekspektasi (tumbuh wajar).</p>
        <p><strong>Interpretasi:</strong> minggu 9–11 <strong>meledak jauh di atas tren</strong> (250 vs ekspektasi ~118) — anomali jelas. Tapi perhatikan minggu 12: kembali ke 120, <em>di bawah</em> tren 124 — <strong>bukan anomali</strong>, hanya kembali normal. <strong>Pelajaran:</strong> tanpa garis ekspektasi, kamu tidak bisa membedakan &ldquo;ledakan&rdquo; dari &ldquo;pertumbuhan&rdquo;.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> dekomposisi adalah <strong>kacamata</strong>: ia memisahkan &ldquo;yang seharusnya terjadi&rdquo; (tren+musiman) dari &ldquo;yang mengejutkan&rdquo; (residual). Analis yang langsung melihat data mentah = melihat dengan mata telanjang; analis yang mendekomposisi = melihat dengan mikroskop.</p>
      </div>

      <h2 id="residual">Deteksi via Residual: Anomali = Sisa yang Tak Terjelaskan</h2>
      <p>Prosedur standar:</p>
      <ol>
        <li>Estimasi <Tex math={String.raw`T_t + S_t`} /> (mis. rata-rata bergerak mingguan + pola jam/hari historis).</li>
        <li>Hitung residual: <Tex math={String.raw`R_t = Y_t - (T_t + S_t)`} />.</li>
        <li>Tandai anomali jika <Tex math={String.raw`|R_t| > k \cdot \sigma_R`} /> (biasanya <Tex math={String.raw`k=3`} />).</li>
      </ol>
      <p><strong>Kenapa ini menyelesaikan cerita PayKu:</strong> ekspektasi jam 3 pagi = 4 ribu → aktual 45 ribu → residual raksasa → <strong>tertangkap</strong>. Ekspektasi jam promo = 175 ribu → aktual 180 ribu → residual kecil → <strong>tidak ditandai</strong>. Satu rumus, dua kasus benar.</p>

      <PlotlyChart
        data={tsData}
        title="Transaksi per Jam 14 Hari: Spike vs Konteks"
        layout={{ xaxis: { title: "Hari" }, yaxis: { title: "Transaksi/jam (ribu)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap titik = volume transaksi per jam; perhatikan pola harian (puncak siang, lembah malam).</p>
        <p><strong>Interpretasi:</strong> lonjakan hari ke-11–13 (180–210 ribu) terlihat &ldquo;anomali&rdquo; — tapi cek konteks: apakah ada promo/event? Sebaliknya titik 45 ribu di jam sepi (hari ke-14) <strong>lebih mencurigakan</strong> relatif terhadap ekspektasinya. <strong>Pelajaran visual:</strong> jangan nilai titik dari ketinggiannya — nilailah dari <em>jaraknya ke pola</em>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Anomali = nilai ekstrem.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> anomali = <strong>penyimpangan dari ekspektasi kontekstual</strong>. Nilai ekstrem bisa normal (promo), nilai sedang bisa anomali (jam 3 pagi). Definisi &ldquo;ekstrem&rdquo; tanpa konteks waktu = definisi yang salah.</p>
      </div>

      <h2 id="changepoint">Change-Point: Kapan Rezim Berganti</h2>
      <p><strong>Definisi.</strong> Change-point = titik waktu di mana <strong>rezim</strong> data berubah: rata-rata, variansi, atau tren bergeser <strong>dan bertahan</strong>. Berbeda dari spike (sesuatu yang <em>sementara</em>):</p>
      <ul>
        <li><strong>Spike:</strong> &ldquo;ada yang aneh <em>kemarin</em>&rdquo; — serangan carding 1 malam.</li>
        <li><strong>Change-point:</strong> &ldquo;<em>sejak</em> tanggal X, semuanya berbeda&rdquo; — penipu menemukan celah baru dan pola serangan berubah permanen.</li>
      </ul>
      <p><strong>Kenapa penting untuk fraud:</strong> change-point menandai <strong>awal era baru</strong> — baseline lama tidak berlaku lagi (ingat FR6: baseline harus dihitung ulang!), model perlu retrain (FR10), dan rule perlu ditinjau (FR5).</p>

      <h2 id="cusum">CUSUM: Alarm Pergeseran Level</h2>
      <p><strong>Definisi.</strong> CUSUM (Cumulative Sum) mengakumulasi deviasi dari rata-rata; saat akumulasi melewati ambang = <strong>level bergeser</strong>:</p>
      <Tex math={String.raw`S^+_t = \max(0, S^+_{t-1} + (x_t - \mu_0 - k)), \quad \text{alarm jika } S^+_t > h`} block />
      <ul>
        <li><Tex math={String.raw`\mu_0`} />: rata-rata rezim awal (baseline).</li>
        <li><Tex math={String.raw`k`} />: &ldquo;toleransi&rdquo; — deviasi kecil diabaikan (biasanya <Tex math={String.raw`\sigma/2`} />).</li>
        <li><Tex math={String.raw`h`} />: ambang alarm (biasanya <Tex math={String.raw`4\sigma`} />-<Tex math={String.raw`5\sigma`} />).</li>
        <li><strong>Intuisi:</strong> deviasi kecil yang <strong>konsisten ke satu arah</strong> menumpuk jadi alarm — CUSUM menangkap &ldquo;pergeseran pelan tapi pasti&rdquo; yang lolos dari deteksi spike.</li>
      </ul>
      <p><strong>Kapan CUSUM vs spike detection:</strong> spike = &ldquo;ledakan sesaat&rdquo; (carding); CUSUM = &ldquo;air pasang yang naik pelan&rdquo; (penipu yang perlahan menaikkan volume agar tak terdeteksi ambang). <strong>Penipu pintar menghindari spike — mereka menciptakan change-point.</strong></p>

      <div className="tip">
        <p><strong>💡 Intuisi:</strong> spike detection = alarm kebakaran (reaktif, keras); CUSUM = termometer (mendeteksi demam yang naik pelan). Serangan canggih tidak membunyikan alarm kebakaran — ia menaikkan suhu 0,5° per hari. Tanpa termometer, kamu sadar saat sudah kritis.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Change-point = anomali yang besar.&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> change-point bisa <strong>kecil per hari</strong> tapi <strong>bertahan</strong> — total pergeserannya besar. Justru itulah yang berbahaya: ia lolos dari semua detektor spike. &ldquo;Besar&rdquo; bukan syarat change-point; &ldquo;bertahan&rdquo; adalah.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Deteksi via Residual</h2>
      <p>Bangun detektor residual dan rasakan peran jendela baseline.</p>
      <PyodideLab
        title="Lab 1 — Residual: Aktual vs Ekspektasi"
        hint="Ubah baseline vol[:8] → vol[:5]. Lihat ambang berubah — 'normal' adalah pilihan jendela, bukan fakta alam."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: CUSUM Change-Point</h2>
      <PyodideLab
        title="Lab 2 — CUSUM: Menangkap Pergeseran Pelan"
        hint="Ubah data jadi tanpa perubahan level. CUSUM diam — buktikan ia menangkap 'rezim berganti', bukan 'spike sesaat'."
        defaultCode={lab2Code}
      />

      <h2 id="worked">📐 Worked Example: Menemukan Anomali dari Deret Waktu</h2>
      <p>Time series anomaly detection = <strong>ramalkan yang wajar, curigai selisihnya</strong>. Dua contoh manualnya.</p>

      <details className="worked">
        <summary>📐 Contoh 1: dekomposisi &amp; residual dari 7 titik</summary>
        <p>Settlement harian merchant M (Rp juta): Sen 12, Sel 13, Rab 11, Kam 14, Jum 45, Sab 13, Min 12.</p>
        <p><strong>Langkah 1 — baseline.</strong> Rata-rata 7 hari = 17,1. Tapi Jumat terlihat aneh — pakai <strong>median</strong> (robust): median = 13. Atau rata-rata tanpa Jumat = 12,5. Pilih baseline 12,5–13.</p>
        <p><strong>Langkah 2 — residual.</strong> Residual = aktual − baseline. Jumat: 45 − 12,5 = <strong>+32,5</strong> (260% di atas normal). Hari lain: residual ±1,5.</p>
        <p><strong>Langkah 3 — ambang.</strong> Standar deviasi hari normal ≈ 1,1. Skor z Jumat = 32,5/1,1 ≈ <strong>29σ</strong> — bukan &ldquo;sedikit aneh&rdquo;, tapi <em>mustahil</em> secara statistik. Inilah kekuatan residual: mengubah &ldquo;45 terlihat besar&rdquo; (subjektif) menjadi &ldquo;29 standar deviasi&rdquo; (objektif &amp; bisa dibandingkan lintas merchant).</p>
        <p><strong>Langkah 4 — konteks.</strong> Cek kalender: Jumat itu bukan Harbolnas, bukan gajian. Cek pola: 45jt dari 3 transaksi @15jt jam 02.00–03.00. <strong>Anomali statistik + konteks mencurigakan = eskalasi.</strong> Anomali statistik tanpa konteks = mungkin cuma promo.</p>
      </details>

      <details className="worked">
        <summary>📐 Contoh 2: CUSUM — menangkap pergeseran kecil yang persisten</summary>
        <p>CUSUM mendeteksi <strong>perubahan level kecil tapi terus-menerus</strong> — yang tidak terlihat sebagai satu titik ekstrem. Cocok untuk: pencurian bertahap (skimming), fee fraud.</p>
        <p>Data: refund rate harian merchant (%): 2,1; 2,3; 2,0; 2,4; 2,2; 3,1; 3,3; 3,0; 3,4; 3,2. Target (rata-rata historis) = 2,2%.</p>
        <p><strong>Langkah 1 — hitung deviasi kumulatif.</strong> <Tex math={String.raw`S_h = \max(0, S_{h-1} + (x_h - \text{target} - k))`} />, dengan k = 0,5×σ ≈ 0,2 (toleransi noise).</p>
        <p><strong>Langkah 2 — jalankan.</strong> Hari 1–5: deviasi kecil → S tetap 0. Hari 6: (3,1−2,2−0,2)=0,7 → S=0,7. Hari 7: +0,9 → S=1,6. Hari 8: +0,6 → S=2,2. Hari 9: +1,0 → S=3,2. Hari 10: +0,8 → S=4,0.</p>
        <p><strong>Langkah 3 — ambang.</strong> Dengan batas h = 3, alarm menyala di <strong>hari ke-9</strong> — padahal tidak satu pun hari yang &ldquo;ekstrem&rdquo; sendirian (maks 3,4%). Inilah keunggulan CUSUM: <strong>ia mengingat</strong>. Anomali titik (point) butuh satu hari gila; anomali level (seperti ini) butuh ingatan kumulatif. Pilih metode sesuai <em>bentuk</em> serangan yang kamu takutkan.</p>
      </details>

      <h2 id="intuisi">🧭 Intuisi Lapangan: Waktu Punya Memori</h2>
      <p>Data tabular memperlakukan setiap baris sebagai independen — tapi <strong>waktu punya memori</strong>: transaksi jam 9 pagi berkaitan dengan jam 8 pagi; Senin berkaitan dengan Senin lalu. Anomali deret waktu yang baik bukan yang pintar statistik — tapi yang <strong>menghormati memori waktu</strong>: musiman, tren, autokorelasi. Model yang mengabaikan ini akan &ldquo;menemukan anomali&rdquo; setiap Senin pagi — padahal itu hanya akhir pekan yang berakhir.</p>
      <p>Intuisi kedua: <strong>pilih metode sesuai <em>bentuk</em> serangan yang ditakuti</strong>. Takut drain kilat? → deteksi point (residual/z-score). Takut pencurian bertahap (skimming)? → CUSUM. Takut pola terkoordinasi? → fitur kolektif (entropy, count). Tidak ada &ldquo;metode terbaik&rdquo; — hanya ada <strong>metode yang cocok dengan bentuk musuh</strong>. Tanyakan dulu: &ldquo;serangan seperti apa yang <em>bisa</em> lolos dari metodeku saat ini?&rdquo; — itulah blind spot-mu.</p>
      <p><strong>Kapan anomaly detection deret waktu TIDAK cocok:</strong> (1) <strong>data terlalu pendek</strong> (&lt; 2 siklus musiman) — baseline tidak terbentuk; (2) <strong>perilaku memang acak</strong> (tidak ada pola = tidak ada &ldquo;normal&rdquo;); (3) <strong>sebagai satu-satunya pertahanan</strong> — anomali butuh konteks (FR16 kasus: promo vs sindikat terlihat sama di angka); (4) <strong>tanpa resolusi waktu yang tepat</strong> — serangan 3 jam tidak terlihat di agregat harian.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> selalu monitor dalam <strong>multi-resolusi</strong>: per-jam untuk serangan kilat, harian untuk tren, mingguan untuk musiman. <strong>Satu resolusi = satu blind spot.</strong> Penjahat memilih resolusi yang tidak kamu pantau.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan: Metode untuk Pola Apa</h2>

      <div className="decision-card">
        <h3>1. Spike sesaat (carding 1 malam) → <strong>deteksi residual (z-score)</strong></h3>
        <p><strong>Kenapa:</strong> cepat, sederhana, real-time friendly.</p>
        <p><strong>Syarat:</strong> ekspektasi (tren+musiman) terestimasi dengan baik.</p>
      </div>

      <div className="decision-card">
        <h3>2. Pergeseran bertahan (pola baru) → <strong>CUSUM / change-point</strong></h3>
        <p><strong>Kenapa:</strong> menangkap &ldquo;air pasang&rdquo; yang lolos detektor spike.</p>
        <p><strong>Aksi:</strong> hitung ulang baseline + tinjau rule/model (FR5, FR10).</p>
      </div>

      <div className="decision-card">
        <h3>3. Pola musiman kuat (gajian, promo) → <strong>dekomposisi dulu, baru deteksi</strong></h3>
        <p><strong>Kenapa:</strong> tanpa dekomposisi, setiap promo = false alarm; setiap serangan di jam sepi = lolos.</p>
      </div>

      <div className="decision-card">
        <h3>4. Butuh konteks bisnis (event, kampanye) → <strong>kalender event sebagai fitur</strong></h3>
        <p><strong>Kenapa:</strong> &ldquo;anomali&rdquo; yang bisa dijelaskan kalender = bukan anomali. Masukan kalender promo ke ekspektasi.</p>
      </div>

      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Anomali = <strong>penyimpangan dari ekspektasi kontekstual</strong>, bukan nilai ekstrem.</li>
          <li>Dekomposisi dulu (tren+musiman), deteksi dari <strong>residual</strong>.</li>
          <li>Spike → z-score; pergeseran bertahan → <strong>CUSUM</strong>.</li>
          <li>Change-point = sinyal untuk <strong>hitung ulang baseline &amp; tinjau model</strong>.</li>
        </ol>
      </div>

      <h2 id="peta-lanjut">🗺️ Peta Keputusan Lanjutan: Point, Contextual, atau Collective?</h2>
      <p>Tiga jenis anomali deret waktu — salah identifikasi jenis = salah metode:</p>
      <p><strong>Skenario A — point anomaly.</strong> Satu titik ekstrem (settlement 29σ seperti contoh 1). Metode: residual + z-score. Respons: investigasi langsung — <em>satu titik</em> sudah cukup bukti untuk bertanya. Cocok untuk: drain akun, transaksi tunggal jumbo.</p>
      <p><strong>Skenario B — contextual anomaly.</strong> Nilai normal di konteks salah: transaksi Rp2jt siang hari = biasa; Rp2jt <strong>jam 3 pagi</strong> dari akun yang tidak pernah transaksi malam = anomali. Metode: model dengan fitur konteks (jam, hari, musim). Jebakan terbesar: model tanpa konteks akan mem-flag semua transaksi malam (termasuk pekerja shift) atau tidak mem-flag apa pun. <strong>Konteks bukan aksesori — ia separuh definisi anomali.</strong></p>
      <p><strong>Skenario C — collective anomaly.</strong> Tiap titik normal, <em>koleksinya</em> aneh: 50 transaksi Rp900rb berurutan (tidak satu pun ekstrem, tapi polanya robotik). Metode: fitur agregat window (count, entropy, autokorelasi) + CUSUM. Ini pola <strong>structuring &amp; skimming</strong> — penjahat yang tahu cara menghindari deteksi titik. Jika sistemmu hanya punya deteksi point, penjahat yang cerdas <em>tidak akan pernah</em> terlihat.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> anomali tanpa konteks waktu = <strong>alarm palsu yang rajin</strong>. Selalu tanyakan tiga hal sebelum eskalasi: (1) aneh dibanding <em>apa</em>? (baseline yang tepat), (2) aneh di <em>konteks</em> apa? (jam/hari/musim), (3) aneh <em>seberapa lama</em>? (titik vs pola). Tiga jawaban ini mengubah angka menjadi cerita.</p>
      </div>
      <h2 id="kasus-nyata">🇮🇩 Kasus Nyata Indonesia: Merchant yang &ldquo;Panen&rdquo; Jam 2 Pagi</h2>
      <p>Temuan monitoring agregator pembayaran (pola umum): merchant kuliner di kota kecil — yang normalnya settlement Rp2–5jt/hari di jam makan — tiba-tiba mencatat settlement <strong>Rp180jt dalam 3 jam (01.00–04.00)</strong>.</p>
      <p><strong>Analisis deret waktunya:</strong> (1) <em>point anomaly</em>: 180jt vs baseline 3,5jt = 51× lipat; (2) <em>contextual</em>: jam 01.00–04.00 vs jam operasional 08.00–22.00 — mustahil ada pelanggan; (3) <em>collective</em>: 120 transaksi @Rp1,5jt seragam — entropy nominal mendekati nol (manusia tidak belanja seseragam itu).</p>
      <p><strong>Hasil investigasi:</strong> merchant &ldquo;disewa&rdquo; sindikat — EDC/QRIS-nya dipakai menggesek kartu-kartu curian semalaman, dana settlement dibagi. Kerugian: Rp180jt − fee ≈ <strong>Rp175jt dalam satu malam</strong> dari satu merchant. Tanpa deteksi deret waktu, pola ini baru ketahuan berminggu-minggu kemudian saat chargeback masuk — dan uangnya sudah cair.</p>
      <p><strong>Pelajaran desain:</strong> monitor <strong>per-merchant</strong>, bukan cuma agregat platform. Agregat 10.000 merchant menyembunyikan 1 merchant gila (sinyalnya tenggelam). Dan monitor dalam <strong>multi-resolusi</strong>: harian untuk tren, per-jam untuk serangan kilat. Serangan ini selesai dalam 3 jam — dashboard harian baru &ldquo;melihatnya&rdquo; keesokan pagi, saat uang sudah pergi.</p>
      <div className="myth">
        <p><strong>🚨 Mitos:</strong> &ldquo;Anomali = fraud, jadi langsung blokir.&rdquo;<br /><strong>Yang benar:</strong> anomali deret waktu juga dipicu <strong>promo, viral, musim, bug data</strong>. Merchant yang settlement-nya 50× lipat karena masuk TV nasional <em>terlihat identik</em> dengan merchant yang disewa sindikat — di angka mentahnya. Bedanya ada di <em>konteks</em> (pola nominal, jam, histori). Blokir otomatis dari anomali murni = menghukum kesuksesan.</p>
      </div>

      <h2 id="case">📋 Mini-Case: ATM Mendadak Ramai Jam 3 Pagi</h2>
      <div className="callout">
        <p>Monitoring ATM &ldquo;BankNusa&rdquo;: 20 ATM di Jakarta. Senin 03:00–04:00: 3 ATM mencatat <strong>45 penarikan</strong> (normal jam segitu: 2–3). Nominal: Rp2,5 jt setiap penarikan (maksimum!). Kartu: 45 kartu berbeda, semuanya terbit 2 minggu lalu dari 1 cabang.</p>
        <p><strong>Pertanyaan:</strong> (a) Ini spike atau change-point? (b) Rancang detektornya (ekspektasi + metode + ambang). (c) Respons operasional 1 jam ke depan?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(a) <strong>Spike</strong> — ledakan 1 jam, bukan pergeseran bertahan. (Tapi waspadai: jika berlanjut 3 malam = change-point → pola baru!)</p>
          <p>(b) <strong>Detektor:</strong> ekspektasi = rata-rata penarikan jam 03:00–04:00 hari kerja 30 hari terakhir per ATM (≈2,5; musiman: akhir pekan sedikit lebih ramai). Residual z-score, <Tex math={String.raw`k=3`} />. 45 vs ekspektasi 2,5 → z raksasa → <strong>alarm</strong>. Bonus: fitur &ldquo;kartu seumuran dari 1 cabang&rdquo; = sinyal farming (FR6).</p>
          <p>(c) <strong>1 jam:</strong> bekukan 45 kartu sementara + cek CCTV + hubungi cabang penerbit (apakah pembukaan massal legitimate?) + pantau 17 ATM lain (apakah menyebar?). <strong>Pelajaran:</strong> detektor yang baik + respons yang cepat = serangan berhenti di 45 kartu, bukan 450.</p>
        </details>
      </div>

      <h2 id="faq">❓ Tanya Jawab: Anomali Time Series</h2>
      <details className="worked">
        <summary>Q1: Bagaimana menangani musiman (Ramadan, Harbolnas) di deteksi anomali?</summary>
        <p><strong>Tiga lapis:</strong> (1) <em>dekomposisi</em> — pisahkan musiman dari residual, deteksi di residual; (2) <em>baseline musiman</em> — bandingkan dengan periode yang sama tahun lalu, bukan rata-rata tahunan; (3) <em>kalender regime</em> — ambang otomatis menyesuaikan saat event (FR5, FR10). Yang gagal: model yang menganggap Desember = Januari. <strong>Musiman bukan anomali — ia jadwal.</strong></p>
      </details>
      <details className="worked">
        <summary>Q2: CUSUM vs ML modern — mana yang dipakai?</summary>
        <p><strong>Keduanya, untuk musuh berbeda:</strong> CUSUM untuk <em>pergeseran level kecil-persisten</em> (skimming, fee fraud) — sederhana, bisa dijelaskan, terbukti 50+ tahun. ML (LSTM/autoencoder) untuk <em>pola kompleks multivariat</em> — tapi butuh data besar &amp; sulit dijelaskan. Aturan: <em>mulai dari CUSUM + residual</em>; naik ke ML hanya jika bentuk seranganmu memang kompleks. <strong>Kesederhanaan yang tepat &gt; kecanggihan yang tidak perlu.</strong></p>
      </details>
      <details className="worked">
        <summary>Q3: Multivariate — kapan 1 deret tidak cukup?</summary>
        <p>Saat <strong>anomali hanya terlihat dari <em>hubungan</em> antar deret</strong>: settlement naik + refund rate tetap 0% (tidak ada pelanggan sungguhan); volume naik + nominal rata-rata turun drastis (structuring). Deteksi univariat per deret akan melewatkannya. Praktik: mulai univariat (murah), tambah <em>rasio/korelasi antar deret</em> sebagai fitur — baru ke model multivariat penuh jika dibutuhkan.</p>
      </details>
      <details className="worked">
        <summary>Q4: Alert fatigue — bagaimana agar tim tidak mengabaikan alarm?</summary>
        <p><strong>Empat obat:</strong> (1) <em>tiering</em> — kritis membangunkan orang, sisanya antre; (2) <em>deduplikasi</em> — 1 insiden = 1 alert (bukan 50); (3) <em>konteks di alert</em> — &ldquo;51× baseline, jam 02.00, 120 trx seragam&rdquo; bukan &ldquo;anomali terdeteksi&rdquo;; (4) <em>ukur precision alert</em> — jika &lt; 10% benar, perbaiki detektornya, jangan salahkan timnya. <strong>Alarm yang 90% salah = alarm yang 100% diabaikan.</strong></p>
      </details>

      <details className="worked">
        <summary>Q5: Z-score vs IQR — kapan memakai yang mana untuk ambang?</summary>
        <p><strong>Z-score</strong> saat data mendekati normal &amp; tanpa outlier ekstrem (ia memakai mean/std yang sensitif outlier). <strong>IQR</strong> (1,5 x IQR) saat data skew / banyak outlier — karena median &amp; kuartil <em>robust</em>. Untuk data finansial (skew kanan ekstrem): <strong>IQR atau persentil</strong> hampir selalu lebih aman. <em>Aturan: jika mean dan median jauh berbeda, jangan pakai z-score.</em></p>
      </details>
      <details className="worked">
        <summary>Q6: Data sparse (banyak nol, misal transaksi merchant kecil) — bagaimana?</summary>
        <p><strong>Jangan deteksi anomali di data mentah yang sparse</strong> — nol bukan anomali, ia normal. Agregasikan dulu ke resolusi yang lebih kasar (harian → mingguan) sampai deretnya &ldquo;terisi&rdquo;, atau pakai model <em>zero-inflated</em>. Alternatif: deteksi di <strong>level agregat</strong> (kelompok merchant sejenis) bukan per merchant. <em>Anomali butuh baseline; baseline butuh data.</em></p>
      </details>

      <h2 id="latihan">Latihan Mandiri: Membaca Deret Waktu</h2>
      <p><strong>1.</strong> Settlement 6 hari (Rp jt): 5, 6, 5, 7, 6, 42. Hitung baseline robust, residual hari ke-6, dan z-score (σ hari normal ≈ 0,8). Klasifikasikan: point/contextual/collective?</p>
      <p><strong>2.</strong> Refund rate: target 3%, k=0,3, batas h=2,5. Data: 3,1; 3,0; 3,8; 4,0; 3,9. Jalankan CUSUM — di hari keberapa alarm menyala?</p>
      <p><strong>3.</strong> Merchant settlement naik 40x di minggu Harbolnas. Anomali atau bukan? Tulis 2 langkah verifikasimu sebelum eskalasi.</p>
      <details className="worked">
        <summary>Kunci jawaban (klik untuk buka)</summary>
        <p><strong>1.</strong> Median = <strong>6</strong>; residual = 42-6 = <strong>36</strong>; z = 36/0,8 = <strong>45σ</strong> — <strong>point anomaly</strong> ekstrem. Eskalasi langsung.</p>
        <p><strong>2.</strong> S: hari1 (3,1-3-0,3)&lt;0→0; hari2→0; hari3 (0,5)→0,5; hari4 (0,7)→1,2; hari5 (0,6)→1,8. <strong>Tidak menyala</strong> (1,8 &lt; 2,5) — butuh 1-2 hari lagi. <em>CUSUM sabar; itu kekuatannya.</em></p>
        <p><strong>3.</strong> <strong>Belum tentu</strong> — Harbolnas = regime shift. Verifikasi: (1) bandingkan dengan <em>Harbolnas tahun lalu</em> (baseline musiman); (2) cek pola pendukung: nominal seragam? jam aneh? refund 0%? <em>Konteks dulu, vonis kemudian.</em></p>
      </details>

      <p><strong>4.</strong> Dua merchant naik 10x: A bertahap selama 2 minggu, B dalam 2 jam. Metode deteksi mana untuk masing-masing — dan kenapa metodenya tidak bisa ditukar?</p>
      <details className="worked">
        <summary>Jawaban</summary>
        <p>A → <strong>CUSUM</strong> (pergeseran kecil-persisten; z-score harian tidak akan &ldquo;berteriak&rdquo;). B → <strong>residual/z-score</strong> (point ekstrem, butuh respons jam ini juga). Ditukar = A tidak terdeteksi 2 minggu (CUSUM terlalu lambat untuk B? tidak — z-score untuk A: tiap hari &ldquo;sedikit aneh&rdquo; tapi tak pernah melewati ambang → lolos terus). <em>Metode mengikuti bentuk serangan.</em></p>
      </details>

      <h2 id="quiz">✏️ Quiz — Uji Pemahamanmu (5 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 180 ribu trx/jam saat promo (tidak ditandai) vs 45 ribu jam 3 pagi (serangan). Pelajaran?"
        options={[
          "Ambang 100 ribu sudah benar",
          "Anomali = penyimpangan dari ekspektasi kontekstual (tren+musiman), bukan nilai absolut",
          "Promo harus dilarang",
          "Tidak ada pelajaran",
        ]}
        correct={1}
        explanation="Benar: 180 ribu ≈ ekspektasi promo (residual kecil); 45 ribu vs ekspektasi 4 ribu = residual raksasa. Ambang absolut buta waktu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam dekomposisi Y_t = T_t + S_t + R_t, di mana anomali 'bersembunyi'?"
        options={[
          "Di tren",
          "Di residual R_t — sisa yang tak dijelaskan tren+musiman",
          "Di musiman",
          "Tidak ada",
        ]}
        correct={1}
        explanation="Benar: residual. Tren+musiman = 'yang seharusnya terjadi'; anomali = yang mengejutkan setelah keduanya diperhitungkan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Perbedaan spike vs change-point?"
        options={[
          "Tidak ada bedanya",
          "Spike = sesaat ('aneh kemarin'); change-point = rezim berganti dan bertahan ('sejak tanggal X semuanya beda')",
          "Change-point selalu lebih besar",
          "Spike lebih berbahaya",
        ]}
        correct={1}
        explanation="Benar: durasi & persistensi. Change-point menuntut hitung ulang baseline + tinjau model; spike menuntut respons insiden."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan CUSUM lebih tepat daripada deteksi spike (z-score)?"
        options={[
          "Tidak pernah",
          "Pergeseran level pelan tapi bertahan — deviasi kecil konsisten menumpuk jadi alarm; lolos dari detektor spike",
          "Selalu",
          "Hanya untuk data kecil",
        ]}
        correct={1}
        explanation="Benar: CUSUM = termometer untuk 'demam pelan'. Penipu pintar menghindari spike (alarm kebakaran) dan menciptakan change-point."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Change-point terdeteksi: pola serangan berubah permanen sejak 2 minggu lalu. Tindakan?"
        options={[
          "Abaikan — nanti kembali normal",
          "Hitung ulang baseline (FR6), tinjau rule (FR5), jadwalkan retrain (FR10) — era baru butuh pertahanan baru",
          "Naikkan ambang spike",
          "Tunggu 3 bulan",
        ]}
        correct={1}
        explanation="Benar: change-point = sinyal sistemik. Baseline lama tidak berlaku; model/rule yang mengandalkannya buta. Respons = evolusi pertahanan."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Dekomposisi:</strong> <Tex math={String.raw`Y_t = T_t + S_t + R_t`} /> — anomali bersembunyi di residual.</li>
          <li><strong>Deteksi residual:</strong> <Tex math={String.raw`|R_t| > k\sigma_R`} /> — anomali = penyimpangan dari ekspektasi kontekstual.</li>
          <li><strong>Spike</strong> = sesaat; <strong>change-point</strong> = rezim berganti dan bertahan.</li>
          <li><strong>CUSUM</strong> menangkap pergeseran pelan yang lolos detektor spike.</li>
          <li>Change-point → <strong>hitung ulang baseline + tinjau rule/model</strong>.</li>
          <li>Kalender event (promo/gajian) = bagian dari ekspektasi, bukan pengecualian.</li>
          <li>Kapan TIDAK pakai time series: anomali tanpa pola temporal — pakai metode cross-sectional (FR8).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/fr15-aml" className="btn btn-secondary btn-sm">← FR15</Link>
        <Link href="/learn/fr17-explainability" className="btn btn-primary btn-sm">Next: FR17 →</Link>
      </div>
    </div>
  );
}
