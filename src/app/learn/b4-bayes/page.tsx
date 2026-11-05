import QuizSection from "@/components/QuizSection";
import StatsCalculator from "@/components/StatsCalculator";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";


export default function B4BayesPage() {
  const chart1 = [{"x": ["Prior: P(fraud)=0,1%", "Posterior: P(fraud|alarm)=9%"], "y": [0.001, 0.09], "type": "bar", "marker": {"color": ["#94a3b8", "#e8a838"]}, "text": ["0,1%", "9%"], "textposition": "outside"}];
  const chart2 = [{"x": ["Tetap di pintu awal", "Ganti pintu"], "y": [0.333, 0.667], "type": "bar", "marker": {"color": ["#94a3b8", "#2a7de1"]}, "text": ["33%", "67%"], "textposition": "outside"}];
  const lab1Code = String.raw`import random
random.seed(99)
N = 100000
base_rate = 0.001
sens = 0.99   # P(alarm | fraud)
false_alarm = 0.01  # P(alarm | bukan fraud)

alarm_benar = alarm_palsu = 0
for _ in range(N):
    fraud = random.random() < base_rate
    if fraud:
        if random.random() < sens: alarm_benar += 1
    else:
        if random.random() < false_alarm: alarm_palsu += 1

total_alarm = alarm_benar + alarm_palsu
print(f"Total alarm      : {total_alarm}")
print(f"Alarm benar      : {alarm_benar}")
print(f"Alarm palsu      : {alarm_palsu}")
print(f"P(fraud | alarm) = {alarm_benar/total_alarm:.2%}")
print()
print("Coba: base_rate = 0.10 (fraud 10%). Berapa P(fraud|alarm) sekarang?")
print("Kesimpulan: tes yang SAMA, kepercayaan beda jauh jika base rate beda.")`;
  const lab2Code = String.raw`import random
random.seed(5)
N = 50000
menang_tetap = menang_ganti = 0
for _ in range(N):
    mobil = random.randrange(3)
    pilih = random.randrange(3)
    # pembawa acara buka pintu kosong yang bukan pilihanmu
    buka = random.choice([p for p in range(3) if p != pilih and p != mobil])
    if pilih == mobil: menang_tetap += 1
    ganti = [p for p in range(3) if p != pilih and p != buka][0]
    if ganti == mobil: menang_ganti += 1
print(f"Tetap : {menang_tetap/N:.2%}")
print(f"Ganti : {menang_ganti/N:.2%}")
print()
print("Coba: 100 pintu, dibuka 98 kosong. Ganti menang berapa? (ubah range(3)->range(100))")`;
  const quizData = [{"question": "Tes 99% akurat, penyakit 0,1%. Hasil positif → peluang benar-benar sakit sekitar…", "options": ["99%", "50%", "9%", "0,1%"], "correct": 2, "explanation": "Benar: ~9%. False positive dari populasi sehat yang besar menenggelamkan true positive — base rate fallacy."}, {"question": "Dalam Bayes, &ldquo;prior&rdquo; adalah…", "options": ["Hasil akhir setelah bukti", "Keyakinan sebelum melihat bukti (base rate)", "Akurasi tes", "Jumlah sampel"], "correct": 1, "explanation": "Benar: prior = P(A) sebelum bukti. Tanpa prior yang jujur, posterior ikut ngawur."}, {"question": "Monty Hall: strategi optimal dan alasannya…", "options": ["Tetap — sudah 50:50", "Ganti — menang 2/3 karena bukti pembawa acara informatif", "Acak saja", "Tidak ada strategi"], "correct": 1, "explanation": "Benar: pembawa acara yang tahu &ldquo;membocorkan&rdquo; informasi lewat pilihannya — posterior pintu lain = 2/3."}, {"question": "Alarm fraud 8,7% posterior. Keputusan bisnis terbaik?", "options": ["Blokir otomatis semua", "Abaikan alarm", "Investigasi bertingkat proporsional dengan posterior", "Naikkan threshold sampai 99%"], "correct": 2, "explanation": "Benar: 91% false positive → blokir otomatis membunuh pelanggan sah. Eskalasi bertingkat = keputusan proporsional risiko."}, {"question": "Frekuensi natural (&ldquo;dari 1.000…&rdquo;) disarankan karena…", "options": ["Lebih presisi matematis", "Otak manusia lebih akurat menalar frekuensi daripada persen bersyarat", "Disyaratkan regulator", "Lebih cepat dihitung"], "correct": 1, "explanation": "Benar: riset kognitif menunjukkan dokter/analis jauh lebih tepat dengan frekuensi natural — trik komunikasi juga."}, {"question": "Kapan posterior ≈ prior (bukti tidak mengubah keyakinan)?", "options": ["Bukti sangat kuat", "Bukti tidak informatif: P(bukti|A) = P(bukti|¬A)", "Prior = 50%", "Sampel besar"], "correct": 1, "explanation": "Benar: jika bukti sama mungkin muncul baik saat A benar maupun salah, likelihood ratio = 1 → posterior = prior."}];

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">B4 — Probabilitas</span>
        <h1 className="display-title">Teorema Bayes: Membalik<br/>Arah Peluang</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 6 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">🎯 Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Tes 99% Akurat yang Menipu</a></li>
          <li><a href="#rumus">Teorema Bayes — Mesin Pembalik</a></li>
          <li><a href="#monty">Monty Hall — &ldquo;Ganti Pintu&rdquo; Menang 2/3</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Tes Fraud 100.000 Transaksi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Monty Hall 50.000x</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Berpikir Bayesian</a></li>
          <li><a href="#case">📋 Mini-Case: Blokir Otomatis atau Investigasi?</a></li>
          <li><a href="#latihan">✏️ Latihan Mandiri</a></li>
          <li><a href="#quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>

      <div className="callout"><ul><li>Menurunkan dan menerapkan <strong>teorema Bayes</strong> untuk membalik <Tex math={String.raw`P(B|A)`} /> menjadi <Tex math={String.raw`P(A|B)`} />.</li><li>Menjelaskan <strong>base rate fallacy</strong> dengan angka konkret — mengapa tes 99% akurat bisa menipu.</li><li>Mensimulasikan <strong>Monty Hall</strong> dan menjelaskan mengapa &ldquo;ganti pintu&rdquo; menang 2/3.</li><li>Menerapkan pola pikir Bayesian (prior → data → posterior) pada fraud alert dan skrining kredit.</li></ul></div>

      <h2 id="cerita">Cerita Pembuka: Tes 99% Akurat yang Menipu</h2>

      <div className="story"><p>Sebuah tes fraud diklaim <strong>99% akurat</strong>: jika transaksi fraud, 99% terdeteksi; jika bukan fraud, 99% dinyatakan bersih. Alarm berbunyi untuk transaksimu. <em>&ldquo;Berapa peluang transaksi ini benar-benar fraud?&rdquo;</em></p><p>Kebanyakan menjawab 99%. Jawaban yang benar: <strong>sekitar 9%</strong>.</p><p>Kok bisa? Karena fraud itu <strong>langka</strong> — hanya 1 dari 1.000 transaksi. Dari 1.000 transaksi: 1 fraud (terdeteksi, 99%) + 999 bukan fraud (1% salah alarm ≈ 10 alarm palsu). Total 11 alarm, hanya 1 yang benar → 1/11 ≈ 9%. Akurasi tes tidak sama dengan <em>kepercayaan pada hasil positif</em> — yang menentukan adalah <strong>base rate</strong>.</p><p>Teorema Bayes adalah mesin matematika untuk hitungan seperti ini — dan jebakan ini (base rate fallacy) memakan korban di medis, hukum, hiring, dan fraud detection.</p><p><strong>Twist-nya:</strong> tesnya memang 99% akurat — dan jawaban 9% juga benar. Keduanya benar karena menjawab <em>pertanyaan berbeda</em>: &ldquo;seberapa bagus tesnya&rdquo; vs &ldquo;seberapa percaya aku pada alarm ini&rdquo;. Kebanyakan orang (termasuk dokter dan hakim!) menjawab pertanyaan pertama padahal yang ditanya yang kedua. Bayes adalah mesin penerjemah di antara keduanya.</p></div>

      <h2 id="rumus">Teorema Bayes — Mesin Pembalik</h2>

      <p><Tex math={String.raw`P(A|B) = \frac{P(B|A)\,P(A)}{P(B)}`} block /></p>

      <ul>
<li><Tex math={String.raw`P(A)`} /> = <strong>prior</strong>: keyakinan sebelum melihat bukti (base rate!)</li>
<li><Tex math={String.raw`P(B|A)`} /> = <strong>likelihood</strong>: seberapa cocok bukti jika A benar</li>
<li><Tex math={String.raw`P(B)`} /> = <strong>evidence</strong>: total peluang melihat bukti (via hukum peluang total)</li>
<li><Tex math={String.raw`P(A|B)`} /> = <strong>posterior</strong>: keyakinan setelah melihat bukti</li>
</ul>

      <p>Bentuk lengkap dengan hukum peluang total di penyebut:</p>

      <p><Tex math={String.raw`P(A|B) = \frac{P(B|A)\,P(A)}{P(B|A)\,P(A) + P(B|A^c)\,P(A^c)}`} block /></p>

      <details className="worked">
<summary>📐 Contoh langkah-demi-langkah (tes fraud di cerita)</summary>
<p>Diketahui: base rate fraud <Tex math={String.raw`P(F)=0{,}001`} />, <Tex math={String.raw`P(+|F)=0{,}99`} /> (sensitivitas), <Tex math={String.raw`P(+|F^c)=0{,}01`} /> (false alarm).</p><p><strong>Langkah 1</strong> — penyebut (total peluang alarm): <Tex math={String.raw`P(+) = 0{,}99\times0{,}001 + 0{,}01\times0{,}999 = 0{,}00099 + 0{,}00999 = 0{,}01098`} />.</p><p><strong>Langkah 2</strong> — Bayes: <Tex math={String.raw`P(F|+) = \frac{0{,}99 \times 0{,}001}{0{,}01098} \approx 0{,}09`} /> = <strong>9%</strong>.</p><p>Perhatikan: pembilang kecil (fraud langka &times; tes bagus), penyebut didominasi <em>false alarm dari populasi besar yang bersih</em>. Itulah base rate fallacy dalam satu rumus.</p>
</details>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Tes 99% akurat → hasil positif berarti 99% benar.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Akurasi (sensitivitas) menjawab &ldquo;given sakit, berapa % terdeteksi&rdquo; — bukan &ldquo;given positif, berapa % sakit&rdquo;. Yang kedua butuh base rate. Pada penyakit langka (0,1%), bahkan tes 99% akurat menghasilkan mayoritas false positive. Jangan pernah menafsirkan hasil tes tanpa prevalensi.</p>
</div>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Berpikirlah dalam <strong>frekuensi natural</strong>: &ldquo;dari 1.000 transaksi…&rdquo; bukan &ldquo;P=0,001&rdquo;. Otak manusia (termasuk dokter dan analis!) jauh lebih akurat dengan frekuensi. Ini trik komunikasi juga: jelaskan Bayes ke direksi dengan &ldquo;dari 1.000…&rdquo;.</p>
</div>

      <h2 id="monty">Monty Hall — &ldquo;Ganti Pintu&rdquo; Menang 2/3</h2>

      <p>Tiga pintu, satu mobil. Kamu pilih pintu 1. Pembawa acara (yang <strong>tahu</strong> di mana mobil) membuka pintu 3 — kosong — lalu bertanya: tetap atau ganti ke pintu 2?</p>

      <p>Intuisi bilang 50:50. Bayes bilang <strong>ganti menang 2/3</strong>. Mengapa? Prior: mobil di pintu 1 = 1/3. Pembawa acara membuka pintu kosong <em>bukan acak</em> — tindakannya adalah <strong>bukti</strong> yang menggeser keyakinan. Jika mobil di pintu 2 (prob 2/3), ia <em>dipaksa</em> membuka pintu 3. Jadi &ldquo;ia membuka pintu 3&rdquo; justru mengonfirmasi pintu 2.</p>

      <p><strong>Kepribadian Bayes:</strong> bukan rumusnya yang pintar — melainkan disiplin bertanya <em>&ldquo;seberapa mungkin saya melihat bukti ini, jika hipotesis saya benar vs salah?&rdquo;</em></p>

      <div className="tip">
<p><strong>💡 Intuisi kunci:</strong> Prior yang jujur &gt; prior yang &ldquo;netral&rdquo;. Beta(1,1) (uniform) terlihat netral tapi bisa menyesatkan untuk kejadian langka — prior yang baik memakai <strong>pengetahuan domain</strong> (base rate historis). Bayes tidak menciptakan info dari nol; ia mengkombinasikan info lama + baru secara konsisten.</p>
</div>

      <div className="myth">
<p><strong className="t">🚨 Miskonsepsi: &ldquo;Setelah satu pintu dibuka, peluangnya 50:50.&rdquo;</strong></p>
<p><strong>Yang benar:</strong> Hanya jika pembuka <em>tidak tahu</em> dan membuka acak. Karena ia tahu dan menghindari mobil, buktinya informatif — posterior bergeser ke 2/3 untuk pintu lain. <strong>Informasi mengubah peluang</strong> (B3!), dan Bayes mengukurnya.</p>
</div>

      <PlotlyChart
  data={chart1}
  title="Prior → Posterior: Alarm 99% Akurat"
  layout={{"yaxis": {"title": "Peluang fraud", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Batang kiri = keyakinan sebelum alarm (base rate); batang kanan = setelah alarm positif dari tes 99% akurat.</p>
<p><strong>Interpretasi:</strong> Alarm menaikkan keyakinan 90x lipat (0,1% → 9%) — tesnya <em>berguna</em>! Tapi 9% ≠ 99%. <strong>Pelajaran operasional:</strong> setiap alarm fraud masih 91% false positive → butuh investigasi, bukan blokir otomatis. Inilah mengapa fraud punya tim investigator, bukan sekadar rule.</p>
</div>

      <PlotlyChart
  data={chart2}
  title="Monty Hall: Strategi Ganti vs Tetap"
  layout={{"yaxis": {"title": "Peluang menang", "tickformat": ".0%"}, "showlegend": false}}
/>

      <div className="chart-guide">
<p><strong>Cara membaca:</strong> Dua strategi, tinggi batang = peluang menang jangka panjang.</p>
<p><strong>Interpretasi:</strong> Ganti menang 2x lebih sering. Ini bukan sulap — ini Bayes: tindakan pembawa acara (bukti) + prior 1/3 menghasilkan posterior 2/3. <strong>Analogi bisnis:</strong> &ldquo;tetap&rdquo; = bertahan pada hipotesis awal; &ldquo;ganti&rdquo; = update keyakinan saat bukti baru datang.</p>
</div>

            {/* TAMBAHAN: BEDAH KASUS */}
            <h2 id="bedah">📐 Bedah Kasus Tambahan</h2>
            <p>Tiga kasus berangka untuk mengunci intuisi <em>sebelum</em> lab. Rumus Bayes hanya satu — yang berubah hanya ceritanya.</p>

            <details className="worked">
              <summary>📐 Kasus 1: Skrining penyakit langka</summary>
              <p>Prevalensi 2%. Tes: sensitivitas 95% (P(+|sakit) = 0,95), false positive 5% (P(+|sehat) = 0,05). Tesmu positif. Berapa peluang kamu benar-benar sakit?</p>
              <p><strong>Langkah 1</strong> — prior: P(sakit) = 0,02; P(sehat) = 0,98.<br />
              <strong>Langkah 2</strong> — pembilang: P(+|sakit)P(sakit) = 0,95 × 0,02 = 0,019.<br />
              <strong>Langkah 3</strong> — penyebut (peluang total): 0,019 + P(+|sehat)P(sehat) = 0,019 + 0,05×0,98 = 0,019 + 0,049 = 0,068.<br />
              <strong>Langkah 4</strong> — posterior: 0,019/0,068 ≈ <strong>27,9%</strong>.</p>
              <p>Pelajaran: tes &ldquo;95% akurat&rdquo; → kepercayaan 28%. Base rate rendah = mayoritas positif adalah false positive. Inilah alasan skrining massal penyakit langka butuh tes konfirmasi kedua.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 2: Monty Hall via Bayes</summary>
              <p>Tiga pintu, mobil di balik satu pintu. Kamu pilih pintu 1. Pembawa acara (tahu letak mobil) membuka pintu 3 — kosong. Haruskah ganti ke pintu 2?</p>
              <p><strong>Langkah 1</strong> — prior: P(mobil di 1) = P(mobil di 2) = 1/3.<br />
              <strong>Langkah 2</strong> — likelihood: P(buka 3 | mobil di 1) = 1/2 (ia bebas pilih 2 atau 3); P(buka 3 | mobil di 2) = 1 (ia <em>harus</em> buka 3, tidak boleh buka 2!).<br />
              <strong>Langkah 3</strong> — posterior ∝ prior × likelihood: pintu 1 ∝ (1/3)(1/2) = 1/6; pintu 2 ∝ (1/3)(1) = 1/3.<br />
              <strong>Langkah 4</strong> — normalisasi: P(mobil di 2 | buka 3) = (1/3)/(1/6+1/3) = <strong>2/3</strong>. Ganti!</p>
              <p>Pelajaran: intuisi bilang 50:50 — Bayes bilang 2:1. Kuncinya: pembawa acara <em>tahu</em>, sehingga pilihannya informatif. Informasi mengubah peluang (B3!) — Bayes mengukurnya.</p>
            </details>

            <details className="worked">
              <summary>📐 Kasus 3: Dua tes berantai</summary>
              <p>Lanjut kasus 1: tes pertama positif (posterior 27,9%). Kamu jalani tes kedua <em>independen</em> (spesifikasi sama) — positif lagi. Berapa peluang sakit sekarang?</p>
              <p><strong>Langkah 1</strong> — posterior lama jadi prior baru: P(sakit) = 0,279; P(sehat) = 0,721.<br />
              <strong>Langkah 2</strong> — pembilang: 0,95 × 0,279 = 0,265.<br />
              <strong>Langkah 3</strong> — penyebut: 0,265 + 0,05 × 0,721 = 0,265 + 0,036 = 0,301.<br />
              <strong>Langkah 4</strong> — posterior: 0,265/0,301 ≈ <strong>88%</strong>.</p>
              <p>Pelajaran: update Bayesian <em>berantai</em> — posterior kemarin = prior hari ini. Dua bukti independen yang konsisten melontarkan keyakinan 28% → 88%. Inilah cara belajar yang benar: inkremental, bukan all-or-nothing.</p>
            </details>


      <h2 id="lab1">🔬 Lab 1: Simulasi Tes Fraud 100.000 Transaksi</h2>

      <p>Simulasi 100.000 transaksi dengan base rate 0,1% dan tes 99% akurat. Hitung sendiri P(fraud|alarm).</p>

      <PyodideLab
  title="Lab 1 — Base Rate Fallacy (Bukti Angka)"
  hint="Ubah base_rate jadi 0,1 (skenario krisis fraud). Lihat posterior melonjak — base rate adalah raja."
  defaultCode={lab1Code}
/>

      <h2 id="lab2">🔬 Lab 2: Monty Hall 50.000x</h2>

      <p>Simulasi strategi tetap vs ganti. Intuisimu akan kalah dari angka.</p>

      <PyodideLab
  title="Lab 2 — Buktikan &amp;ldquo;Ganti&amp;rdquo; Menang"
  hint="Versi 100 pintu membuat intuisinya klik: pilihan awalmu hampir pasti salah (99%), jadi ganti hampir pasti benar."
  defaultCode={lab2Code}
/>

      <h2 id="peta">🗺️ Peta Keputusan: Kapan Berpikir Bayesian</h2>

      <div className="decision-card">
<h3>1. Ada hasil tes/alarm → <strong>tanya base rate dulu</strong></h3>
<p><strong>Kondisi data:</strong> Sensitivitas tes diketahui, tapi prevalensi kondisi tidak dipertimbangkan.</p>
<p><strong>Kenapa:</strong> Posterior didominasi base rate saat kondisi langka — tanpa itu, alarm 99% akurat pun 91% palsu.</p>
<p><strong>Contoh nyata:</strong> Alarm fraud, skrining penyakit langka, tes rekrutmen.</p>
</div>

      <div className="decision-card">
<h3>2. Keyakinan awal + bukti baru berdatangan → <strong>update sekuensial</strong></h3>
<p><strong>Kondisi data:</strong> Data datang bertahap (transaksi per transaksi, cicilan per bulan).</p>
<p><strong>Kenapa:</strong> Posterior hari ini = prior besok. Bayes adalah &ldquo;cara belajar&rdquo; yang konsisten — ini fondasi B17.</p>
<p><strong>Contoh nyata:</strong> Skor fraud nasabah diupdate tiap transaksi baru.</p>
</div>

      <div className="decision-card">
<h3>3. Bukti dihasilkan oleh agen yang tahu sesuatu → <strong>waspadai seleksi</strong></h3>
<p><strong>Kondisi data:</strong> Informasi tidak muncul acak (pembawa acara tahu, penjual tahu cacatnya).</p>
<p><strong>Kenapa:</strong> Likelihood P(bukti|hipotesis) harus memodelkan <em>proses menghasilkan bukti</em>, bukan sekadar bukti.</p>
<p><strong>Contoh nyata:</strong> Monty Hall; &ldquo;penjual hanya menunjukkan review bagus&rdquo;.</p>
</div>

      <div className="decision-card">
<h3>4. Dua arah tersedia → <strong>pilih arah yang menjawab keputusan</strong></h3>
<p><strong>Kondisi data:</strong> Punya P(B|A) tapi keputusan butuh P(A|B).</p>
<p><strong>Kenapa:</strong> Prediksi butuh P(hasil|info yang kupunya); diagnosis butuh arah sebaliknya. Bayes menjembatani.</p>
<p><strong>Contoh nyata:</strong> Dari &ldquo;90% gagal bayar dulu telat&rdquo; ke &ldquo;nasabah ini telat — berapa peluang gagal?&rdquo;.</p>
</div>

      <div className="callout">
<h3>🧭 Aturan praktis 10 detik</h3><ol><li>Dengar &ldquo;akurasi tes&rdquo; → langsung tanya: <strong>berapa base rate-nya?</strong></li><li>Ubah persen ke <strong>frekuensi natural</strong> (&ldquo;dari 1.000…&rdquo;) sebelum percaya intuisi.</li><li>Bukti baru → update keyakinan, jangan buang prior (dan jangan abaikan bukti).</li></ol>
</div>

      <h2 id="case">📋 Mini-Case: Blokir Otomatis atau Investigasi?</h2>

      <div className="callout">
<p>Startup paylater memakai rule: <em>&ldquo;skor fraud &gt; 0,8 → blokir otomatis&rdquo;</em>. Vendor mengklaim sensitivitas 95%, false positive 5%. Base rate fraud aktual: 0,5%.</p><p><strong>Pertanyaan:</strong> (a) Hitung P(fraud | skor &gt; 0,8). (b) Apakah blokir otomatis keputusan tepat? Apa alternatifnya?</p><details className="worked">
<summary>💡 Pembahasan (klik untuk buka)</summary>
<p>(a) P(+) = 0,95×0,005 + 0,05×0,995 = 0,00475 + 0,04975 = 0,0545. P(fraud|+) = 0,00475/0,0545 ≈ <strong>8,7%</strong>.</p><p>(b) <strong>Blokir otomatis salah.</strong> 91% yang diblokir adalah pelanggan sah — bencana churn + komplain. Alternatif Bayesian: gunakan posterior 8,7% sebagai <em>prior untuk investigasi bertingkat</em> — verifikasi ringan (OTP/biometrik) dulu, eskalasi hanya jika bukti tambahan menaikkan posterior. Inilah pola &ldquo;step-up authentication&rdquo; di industri: keputusan proporsional dengan posterior, bukan biner dari alarm mentah.</p>
</details>
</div>

            {/* TAMBAHAN: LATIHAN MANDIRI */}
            <h2 id="latihan">✏️ Latihan Mandiri</h2>
            <p>Tiga soal untuk dikerjakan <em>tanpa</em> mengintip pembahasan. Target: 10–12 menit.</p>
            <ol>
              <li>1% email adalah spam. Filter: P(flag|spam) = 98%, P(flag|bukan spam) = 2%. Emailmu di-flag. Berapa peluang ia benar-benar spam?</li>
              <li>Koin dipilih acak: 50% adil, 50% selalu angka. Dilempar 3×, hasilnya AAA. Berapa peluang koinnya yang curang?</li>
              <li>Di antara yang lolos tes pertama (kasus skrining di atas, posterior 27,9%), tes kedua <em>negatif</em>. Berapa posterior sekarang? (Petunjuk: pakai P(−|sakit) = 5%, P(−|sehat) = 95%.)</li>
            </ol>
            <details className="worked">
              <summary>💡 Pembahasan Latihan Mandiri (klik untuk buka)</summary>
              <p><strong>1.</strong> Pembilang: 0,98×0,01 = 0,0098. Penyebut: 0,0098 + 0,02×0,99 = 0,0296. Posterior = <strong>33,1%</strong>. Lagi-lagi base rate menang atas &ldquo;akurasi&rdquo;.</p>
              <p><strong>2.</strong> Prior 0,5/0,5. P(AAA|curang) = 1; P(AAA|adil) = 1/8. Posterior = 1×0,5/(1×0,5 + 0,125×0,5) = 0,5/0,5625 ≈ <strong>88,9%</strong>.</p>
              <p><strong>3.</strong> Prior 0,279/0,721. Pembilang: 0,05×0,279 = 0,01395. Penyebut: 0,01395 + 0,95×0,721 = 0,6989. Posterior ≈ <strong>2%</strong> — kembali ke prevalensi awal! Tes kedua yang negatif hampir menghapus bukti tes pertama. Bukti yang bertentangan = keyakinan kembali ke awal.</p>
            </details>


      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>

      <QuizSection quizzes={quizData} />

      <h2 id="rangkum">📝 Rangkuman</h2>

      <div className="callout"><ul><li><strong>Bayes = mesin pembalik:</strong> dari <Tex math={String.raw`P(B|A)`} /> ke <Tex math={String.raw`P(A|B)`} /> via prior.</li><li><strong>Base rate adalah raja:</strong> pada kondisi langka, mayoritas alarm positif adalah palsu.</li><li><strong>Frekuensi natural</strong> (&ldquo;dari 1.000&rdquo;) mengalahkan persen untuk intuisi.</li><li><strong>Posterior hari ini = prior besok</strong> — belajar sekuensial (fondasi B17).</li><li><strong>Jangan</strong> menafsirkan akurasi tes sebagai kepercayaan hasil — dan <strong>jangan</strong> blokir otomatis dari posterior 9%.</li></ul></div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/b3-peluang-bersyarat" className="btn btn-secondary btn-sm">← ← B3</Link>
        <Link href="/learn/b5-variabel-acak-ekspektasi" className="btn btn-primary btn-sm">Next: B5 →</Link>
      </div>
    </div>
  );
}
