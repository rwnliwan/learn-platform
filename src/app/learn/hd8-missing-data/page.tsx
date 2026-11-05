"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd8MissingDataPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd8MechData = [{"x": ["MCAR", "MAR", "MNAR"], "y": [85, 60, 25], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["85%", "60%", "25%"], "textposition": "outside"}];
  const hd8MechDataLayout = {"xaxis": {"title": "Mekanisme"}, "yaxis": {"title": "% bias yang bisa dikoreksi", "range": [0, 100]}, "showlegend": false};

  const lab1Code = "import random, statistics as st\nrandom.seed(5)\nn, p_miss = 1000, 0.3\nasli = [random.gauss(100, 15) for _ in range(n)]\nteramati = [x for x in asli if random.random() > p_miss]\nmean_obs = st.mean(teramati)\nimput_mean = teramati + [mean_obs]*(n - len(teramati))\nprint(f'data asli      : mean={st.mean(asli):.1f}  SD={st.stdev(asli):.1f}')\nprint(f'hapus (MCAR)   : mean={st.mean(teramati):.1f}  SD={st.stdev(teramati):.1f}  n={len(teramati)}')\nprint(f'imputasi mean  : mean={st.mean(imput_mean):.1f}  SD={st.stdev(imput_mean):.1f}  n={n}')\nprint()\nprint('Imputasi mean: SD menyusut (data palsu tak bervariasi)')\nprint('-> SE kekecilan -> p-value terlalu optimis. Jangan!')";

  const lab2Code = "import random, statistics as st\nrandom.seed(9)\nn = 5000\ndata = []\nfor _ in range(n):\n    kerja = random.choice(['buruh', 'kantor'])\n    gaji = random.gauss(8 if kerja == 'buruh' else 15, 2)\n    data.append((kerja, gaji))\ntrue_mean = st.mean(g for _, g in data)\n# MAR: wiraswasta/buruh lebih sering missing, terkait variabel TERAMATI\nmar = [g for k, g in data if not (k == 'buruh' and random.random() < 0.5)]\n# MNAR: gaji tinggi lebih sering missing, terkait NILAI ITU SENDIRI\nmnar = [g for k, g in data if random.random() > (g/25)]\nprint(f'kebenaran        : {true_mean:.2f}')\nprint(f'MAR  teramati    : {st.mean(mar):.2f} (bias, tapi bisa dikoreksi via pekerjaan)')\nprint(f'MNAR teramati    : {st.mean(mnar):.2f} (bias, tak terlacak dari variabel lain)')\n# koreksi MAR via stratifikasi pekerjaan\nimport collections\nobs_kerja = collections.defaultdict(list)\nfor k, g in data:\n    if not (k == 'buruh' and random.random() < 0.5):\n        obs_kerja[k].append(g)\nprint(f'MAR terkoreksi   : {st.mean([st.mean(v) for v in obs_kerja.values()]):.2f} <- pulih!')";

  const hd8MiceData = [{"x": ["Imputasi mean", "MICE (m=20)"], "y": [11.2, 14.8], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "text": ["11.2", "14.8"], "textposition": "outside"}];
  const hd8MiceDataLayout = {"xaxis": {"title": "Metode"}, "yaxis": {"title": "SD"}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD8 &mdash; Health Data Scientist</span>
        <h1 className="display-title">MICE &amp; MNAR:<br />Ketika Data Klinis Berlubang</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kolom yang Hilang Justru Berbicara</a></li>
          <li><a href="#mekanisme">MCAR, MAR, MNAR — Tiga Cara Hilang</a></li>
          <li><a href="#mice">Multiple Imputation (MICE)</a></li>
          <li><a href="#mnar">MNAR: Lubang yang Tidak Bisa Ditambal Sempurna</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Imputasi Mean Merusak Variansi</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Mekanisme MAR vs MNAR</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Audit Missing End-to-End</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Imputasi Adalah Klaim</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: “Tidak Tahu” vs “Menolak”</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Kapan Lubang Bisa Ditambal (dan Kapan Tidak)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Mengklasifikasikan pola missing ke <strong>MCAR/MAR/MNAR</strong> dari skenario nyata.</li>
          <li>Menjelaskan mengapa <strong>imputasi mean tunggal</strong> merusak variansi dan mengapa <strong>MICE</strong> lebih baik.</li>
          <li>Menjalankan logika <strong>multiple imputation + Rubin's rules</strong> secara konseptual.</li>
          <li>Merancang <strong>analisis sensitivitas MNAR</strong> sederhana untuk temuan kunci.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kolom yang Hilang Justru Berbicara</h2>
      <div className="story">
        <p>RS menganalisis faktor risiko readmission. Kolom “skor nyeri saat pulang” kosong pada 30% pasien. Analis menghapus 30% itu dan melanjutkan. Reviewer bertanya satu kalimat: “Bagaimana kalau yang tidak mengisi justru yang nyerinya paling parah — karena terlalu sakit untuk mengisi formulir?” Hening.</p>
      <p>Data yang hilang bukan ketiadaan informasi — ia <em>adalah</em> informasi, hanya saja terenkripsi oleh alasannya hilang. Lesson ini mengajarkan tiga jenis enkripsi itu, dan kapan kamu bisa mendekripsinya.</p>
      <p><strong>Twist-nya:</strong> analis itu mengira ia membuang <em>sampah</em> — padahal ia membuang <strong>pasien yang paling menderita</strong>. Setelah 30% dibuang, “rata-rata nyeri saat pulang” turun — bukan karena pasien membaik, melainkan karena yang kesakitan tidak bisa mengisi formulir. Inilah kejamnya MNAR: <strong>cara kamu menangani data hilang menentukan <em>siapa</em> yang terwakili dalam kesimpulanmu</strong>. Menghapus baris kosong terlihat netral; sebenarnya ia adalah keputusan politik tentang siapa yang dihitung.</p>
      </div>

      <h2 id="mekanisme">MCAR, MAR, MNAR — Tiga Cara Hilang</h2>
      <p><strong>Definisi.</strong> <strong>MCAR</strong>: hilang murni acak (sensor rusak). <strong>MAR</strong>: hilang terkait variabel <em>teramati</em> (lansia lebih sering skip kuesioner online). <strong>MNAR</strong>: hilang terkait <em>nilai yang hilang itu sendiri</em> (yang paling sakit tidak mengisi skor nyeri).</p>
      <details className="worked">
        <summary>📐 Contoh: tiga mekanisme di satu RS</summary>
        <p><strong>MCAR:</strong> 2% hasil lab hilang karena server down acak semalam.<br /><strong>MAR:</strong> kolom pendapatan kosong 40% — tapi pola terkait <em>pekerjaan</em> yang tercatat (wiraswasta enggan mengisi). Bisa diprediksi dari pekerjaan.<br /><strong>MNAR:</strong> skor depresi kosong pada yang paling depresi — nilai yang hilang itulah penyebab hilangnya. Tidak bisa diprediksi penuh dari variabel lain.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> MCAR itu amplop hilang di kantor pos — sial tapi adil. MAR itu amplop hilang karena alamatnya di gang sempit (pola bisa dilacak dari data lain). MNAR itu surat yang sengaja tidak dikirim karena isinya memalukan — tidak ada cara melacak dari luar.</p>
      <p><strong>Kapan memakai:</strong> Diagnosis dulu sebelum terapi: MCAR → hapus masih OK; MAR → imputasi cerdas valid; MNAR → waspada + sensitivitas.</p>

      <PlotlyChart
        data={hd8MechData}
        title="Seberapa Baik Imputasi Bisa Memulihkan? (ilustratif)"
        layout={hd8MechDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tinggi batang = seberapa besar bias yang bisa dikoreksi imputasi cerdas pada tiap mekanisme.</p>
        <p><strong>Interpretasi:</strong> MCAR hampir pulih penuh; MAR sebagian besar bisa dikoreksi (karena polanya terlacak); MNAR hanya sedikit — sisanya butuh asumsi yang tidak bisa diuji dari data. Inilah kenapa diagnosis mekanisme adalah langkah pertama, bukan imputasi.</p>
      </div>

      <h2 id="mice">Multiple Imputation (MICE) — Si Jujur yang Ragu</h2>
      <p><strong>Definisi.</strong> <strong>MICE</strong>: buat <em>banyak</em> (m) versi dataset lengkap dengan imputasi berbeda (mencerminkan ketidakpastian), analisis tiap versi, lalu gabungkan dengan <strong>Rubin's rules</strong>.</p>
      <Tex math={String.raw`\bar{Q} = \frac{1}{m}\sum_{j=1}^{m} \hat{Q}_j \quad ; \quad Var = W + \left(1+\frac{1}{m}\right)B`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\hat{Q}_j`} />: estimasi (mis. koefisien) dari dataset imputasi ke-j</li>
          <li><Tex math={String.raw`\bar{Q}`} />: gabungan: rata-rata m estimasi</li>
          <li><Tex math={String.raw`W`} />: variansi DALAM imputasi (rata-rata SE² tiap dataset)</li>
          <li><Tex math={String.raw`B`} />: variansi ANTAR imputasi (seberapa beda hasil antar versi)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus variansi punya dua suku: W (ketidakpastian biasa) + B (ketidakpastian <em>akibat missing itu sendiri</em>). Imputasi tunggal (mean) menyembunyikan suku B — MICE menampakkannya dengan jujur.</p>
      <details className="worked">
        <summary>📐 Contoh: MICE 5 imputasi untuk efek obat</summary>
        <p>Estimasi efek dari 5 dataset: 8,2; 7,5; 9,1; 8,8; 7,9.<br />Gabungan = rata-rata = <strong>8,3</strong>.<br />W = rata-rata variansi tiap analisis; B = variansi antar lima angka (0,42).<br />SE akhir = akar(W + 1,2×B) — <strong>lebih besar</strong> dari SE imputasi tunggal. Itulah kejujuran: mengakui kita tidak tahu nilai yang hilang.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> MICE itu ilmuwan yang berkata “saya tidak tahu persis, tapi kemungkinannya berkisar ini” — lalu mengulang analisis di tiap kemungkinan. Imputasi mean tunggal itu dukun yang pede: satu angka, nol keraguan, salah dengan yakin.</p>
      <p><strong>Kapan memakai:</strong> Standar untuk MAR dengan missing substansial (&gt;5%). Sertakan <strong>semua variabel analisis + outcome</strong> dalam model imputasi (mengeluarkan outcome = melemahkan hubungan yang ingin diestimasi!).</p>

      <h2 id="mnar">MNAR: Lubang yang Tidak Bisa Ditambal Sempurna</h2>
      <p><strong>Definisi.</strong> Pada <strong>MNAR</strong>, mekanisme hilang terkait nilai tak teramati — tidak bisa diuji atau dikoreksi penuh dari data. Senjata yang tersisa: <strong>analisis sensitivitas</strong> (tipping-point): seberapa ekstrem MNAR harus terjadi agar kesimpulan berbalik?</p>
      <details className="worked">
        <summary>📐 Contoh: tipping-point untuk skor nyeri</summary>
        <p>Temuan: obat menurunkan nyeri 2 poin (MICE, MAR). Sensitivitas: asumsikan yang missing di kelompok obat sebenarnya 1, 2, 3 poin <em>lebih buruk</em> dari imputasi MAR.<br />Hasil: kesimpulan bertahan sampai asumsi +2,5 poin; berbalik pada +3.<br />Laporan jujur: “Temuan robust kecuali bila pasien missing 3+ poin lebih buruk dari prediksi — skenario yang kami nilai tidak plausibel karena…”</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> MNAR itu lubang hitam: kamu bisa mengorbitinya (sensitivitas), tapi tidak bisa melihat ke dalam (tidak teridentifikasi dari data). Ilmuwan jujur melaporkan seberapa dekat kesimpulanmu dengan tepi lubang.</p>
      <p><strong>Kapan memakai:</strong> Setiap temuan kunci dengan missing &gt;10%: laporkan analisis sensitivitas MNAR. Khususnya outcome yang <em>self-reported</em> (nyeri, depresi, kepuasan).</p>
      <div className="callout callout-warning"><strong>Jangan</strong> lakukan complete-case analysis diam-diam lalu berharap reviewer tidak bertanya. Laporkan: % missing per variabel kunci, mekanisme yang diasumsikan + alasannya, metode penanganan, dan sensitivitas. Transparansi &gt; kesempurnaan.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Kapan Lubang Bisa Ditambal (dan Kapan Tidak)</h2>
      <details className="worked">
        <summary>📐 Worked example: tiga mekanisme, tiga nasib (klik untuk buka)</summary>
        <p>RS punya 1.000 pasien; kolom <strong>skor nyeri pulang (0–10)</strong> kosong pada 300 pasien. Rata-rata dari 700 yang terisi: 3,2.</p>
        <p><strong>Langkah 1 — Uji MCAR.</strong> Bandingkan karakteristik 700 vs 300: usia, jenis kelamin, diagnosis, LOS — semua mirip (uji-t/chi-square tidak signifikan). <strong>Keputusan:</strong> plausibel MCAR → analisis lengkap-case (n=700) <em>tidak bias</em>, hanya kurang presisi. Lanjutkan dengan catatan.</p>
        <p><strong>Langkah 2 — Skenario MAR.</strong> Ternyata pasien <strong>lansia</strong> 2× lebih sering kosong (perawat melewatkan formulir pada pasien dengan banyak komorbiditas — tercatat di kolom lain). Karena “kelansiaan” <em>teramati</em>, mekanisme ini MAR → <strong>multiple imputation (MICE)</strong> memakai usia+komorbiditas bisa memulihkan estimasi tak bias. Imputasi tunggal dengan mean? <strong>Jangan</strong> — ia memalsukan presisi (SE kekecilan).</p>
        <p><strong>Langkah 3 — Skenario MNAR.</strong> Investigasi kualitatif: perawat bilang “yang nyerinya 8–10 biasanya menolak mengisi, terlalu sakit”. Kini <em>alasan hilang terkait nilai yang hilang itu sendiri</em> → MNAR. Tidak ada imputasi yang bisa menyelamatkanmu sepenuhnya: MICE akan mengisi skor rendah (karena pola pasien “mirip” yang terisi), <strong>meremehkan nyeri sebenarnya</strong>.</p>
        <p><strong>Langkah 4 — Analisis sensitivitas untuk MNAR.</strong> Asumsikan skenario terburuk: 300 yang hilang punya rata-rata nyeri 7 (bukan 3,2). Rata-rata gabungan = (700×3,2 + 300×7)/1000 = <strong>4,34</strong> — 36% lebih tinggi dari angka naif 3,2. Laporkan <em>rentang</em> (3,2–4,3) dengan asumsi eksplisit, bukan satu angka palsu presisi.</p>
        <p><strong>Pelajaran:</strong> MCAR = boleh lanjut; MAR = imputasi ganda; MNAR = jujur soal rentang. Yang membedakan ketiganya bukan statistik — melainkan <strong>investigasi lapangan</strong> (tanya perawat!).</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — indikator missing sebagai fitur:</strong> Dalam <em>model prediksi</em> (bukan estimasi kausal), kolom “apakah skor nyeri terisi?” sering justru <strong>prediktif</strong> — karena pola missing membawa informasi klinis (pasien terlalu sakit untuk mengisi). Jangan buru-buru menghapus indikator missing sebelum menguji nilai prediksinya. Tapi hati-hati: fitur ini rapuh terhadap <em>perubahan proses</em> (begitu RS mewajibkan pengisian, sinyalnya hilang — lihat HD12 soal drift). Bedakan “berguna hari ini” dari “stabil selamanya”.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — survei kepuasan RS “92% puas”:</strong> Mini-case lesson ini bukan fiksi: survei kepuasan RS Indonesia rutin melaporkan &gt;90% puas — dengan <strong>response rate 30–40%</strong>. Siapa yang tidak mengisi? Pasien yang kecewa (malas protes), yang tidak paham formulir (literasi rendah — justru kelompok paling rentan), dan yang meninggal. Angka 92% adalah “kepuasan di antara yang mau mengisi” — MNAR klasik. Analis yang melaporkan 92% tanpa response rate dan analisis non-responden sedang <strong>menjual ilusi kualitas</strong> ke direksi. Selalu pasangkan: “92% puas (dari 35% responden; profil non-responden: …)”.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Imputasi Adalah Klaim, Bukan Pembersihan</h2>
      <p>Kata “imputasi” terdengar seperti <em>membetulkan</em> data. Lebih jujur: imputasi adalah <strong>membuat klaim tentang data yang tidak kamu lihat</strong> — dan setiap klaim butuh pembelaan.</p>
      <p><strong>Mengapa imputasi tunggal berbohong:</strong> mengisi missing dengan mean membuat dataset <em>terlihat</em> lengkap — tapi ia <strong>menciptakan kepastian palsu</strong>: 300 nilai imputasi diperlakukan software sebagai 300 fakta, SE menyusut, p-value mengecil. Kamu tidak menambah informasi; kamu <strong>menambah keyakinan tanpa menambah bukti</strong> — definisi presisi palsu. Inilah mengapa MICE memakai <strong>m imputasi ganda</strong>: variasi antar-imputasi mengukur <em>ketidakpastian akibat missing</em> itu sendiri, dan Rubin's rules menggabungkannya ke SE akhir. <strong>Imputasi yang jujur <em>melebarkan</em> interval kepercayaan</strong> — karena mengakui ketidaktahuan adalah informasi.</p>
      <p><strong>Aturan emas MICE:</strong> model imputasi harus <strong>minimal sekaya</strong> model analisis — mencakup outcome + semua prediktor + variabel penolong (auxiliary). Imputasi tanpa menyertakan outcome = <strong>mengencerkan</strong> hubungan yang ingin kamu estimasi (bias menuju nol). Kesalahan klasik: imputasi X tanpa Y, lalu regresi Y~X — hasilnya bias, dan tidak ada yang sadar.</p>
      <p><strong>Kapan JANGAN imputasi:</strong> (1) <strong>Missing &gt; 50%</strong> pada variabel kunci — imputasi mayoritas = mengarang mayoritas; pertimbangkan buang variabel atau kumpulkan ulang. (2) <strong>MNAR tanpa analisis sensitivitas</strong> — imputasi standar memberi jawaban <em>salah dengan percaya diri</em>. (3) <strong>Untuk model prediksi deployment</strong> — jika di produksi kolomnya juga akan missing dengan pola sama, imputasi saat training dengan pola berbeda = <strong>train-serve skew</strong>; lebih baik latih dengan indikator missing (lihat tip di Pendalaman).</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> setiap nilai imputasi adalah <strong>hipotesis</strong>. Perlakukan sebagai hipotesis: uji sensitivitasnya, laporkan rentangnya, dan jangan pernah biarkan satu angka imputasi menentukan keputusan klinis sendirian.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Missing 5% boleh diabaikan, missing 30% tinggal dihapus saja yang bolong&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Ambang persen bukan penentunya — <em>mekanisme</em>lah. 5% MNAR pada outcome utama bisa membalik kesimpulan; 30% MCAR pada kovariat minor hampir tidak masalah. Hapus yang bolong (complete-case) valid hanya untuk MCAR — yang paling jarang terjadi di data klinis.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Imputasi = mengarang data, jadi tidak ilmiah&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Imputasi yang benar tidak mengarang <em>fakta</em> — ia memodelkan <em>ketidakpastian</em> secara eksplisit (lihat suku B di Rubin's rules). Yang tidak ilmiah adalah complete-case diam-diam: ia mengarang asumsi “MCAR” tanpa mengatakannya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;MICE menyelesaikan masalah MNAR&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> MICE mengasumsikan MAR. Pada MNAR, MICE tetap bias — hanya biasnya lebih kecil dan SE-nya lebih jujur. MNAR butuh model seleksi/pattern-mixture + sensitivitas, bukan MICE yang lebih banyak.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Audit Missing Data End-to-End</h2>
      <details className="worked">
        <summary>📐 Worked example: dataset 5.000 pasien, 4 kolom bermasalah (klik untuk buka)</summary>
        <p>Kamu menerima dataset EHR untuk model risiko diabetes. Empat kolom punya missing: <strong>berat badan</strong> (12%), <strong>merokok</strong> (35%), <strong>HbA1c</strong> (28%), <strong>pendapatan</strong> (41%). Langkah audit:</p>
        <p><strong>Langkah 1 — Peta pola missing.</strong> Buat matriks pola: apakah missing-nya <em>monoton</em> (yang hilang HbA1c juga hilang berat badan — pola kunjungan) atau <em>sembarang</em>? Temuan: missing HbA1c &amp; berat badan <strong>berkorelasi 0,7</strong> — keduanya hilang bersama → pola kunjungan (pasien yang jarang kontrol). Missing merokok <strong>tidak berkorelasi</strong> dengan lainnya → mekanisme berbeda.</p>
        <p><strong>Langkah 2 — Uji MCAR (Little's test).</strong> Berat badan: p = 0,34 → <strong>gagal tolak MCAR</strong> (plausibel acak — mungkin error input). Merokok: p &lt; 0,001 → <strong>tolak MCAR</strong>. HbA1c: p &lt; 0,001 → tolak. Pendapatan: p &lt; 0,001 → tolak.</p>
        <p><strong>Langkah 3 — Investigasi MAR vs MNAR per kolom.</strong> <em>Merokok:</em> missing 2× lebih sering pada pasien dengan diagnosis PPOK (tercatat!) — dokter melewatkan tanya rokok saat pasien sesak → <strong>MAR</strong> (dijelaskan variabel teramati). <em>HbA1c:</em> missing pada yang jarang kontrol (tercatat: jumlah kunjungan) → <strong>MAR</strong>. <em>Pendapatan:</em> wawancara kualitatif: yang berpenghasilan sangat rendah <em>dan</em> sangat tinggi menolak jawab → missing terkait <strong>nilai itu sendiri</strong> → <strong>MNAR</strong>.</p>
        <p><strong>Langkah 4 — Rencana penanganan per kolom.</strong> Berat badan (MCAR): complete-case OK untuk estimasi, tapi MICE tetap lebih efisien. Merokok &amp; HbA1c (MAR): <strong>MICE</strong> dengan prediktor (diagnosis, kunjungan, usia, dll), m = 20 imputasi. Pendapatan (MNAR): <strong>tidak bisa diselamatkan imputasi standar</strong> → (a) analisis sensitivitas (pattern-mixture: asumsikan yang hilang 20% lebih rendah/tinggi), (b) pertimbangkan <strong>buang kolom</strong> jika bukan variabel kunci, (c) laporkan rentang, bukan titik.</p>
        <p><strong>Langkah 5 — Validasi imputasi.</strong> Bandingkan distribusi nilai imputasi vs teramati: jika imputasi HbA1c menghasilkan 90% nilai “normal” padahal yang teramati 60% tidak normal → model imputasi salah spesifikasi (kurang prediktor keparahan). <strong>Imputasi yang tidak divalidasi = mengarang data.</strong></p>
        <p><strong>Pelajaran:</strong> “tangani missing data” bukan satu keputusan — melainkan <strong>empat keputusan berbeda untuk empat kolom berbeda</strong>. Audit per kolom adalah standar profesional.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Buat <strong>“laporan missing” satu halaman</strong> untuk setiap proyek: % missing per kolom, pola, hasil uji MCAR, klasifikasi mekanisme, rencana penanganan. Lampirkan di apendiks laporan. Reviewer yang melihatnya langsung menaikkan kepercayaan 2 tingkat — karena 90% analis <em>tidak pernah</em> melakukannya.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Buat <strong>indikator missing</strong> (kolom 1/0) untuk variabel kunci dan cek hubungannya dengan outcome. Kadang “hilangkan” itu sendiri prediktor kuat (pasien tanpa skor nyeri = lebih parah).</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Aturan praktis jumlah imputasi: <strong>m ≈ % missing</strong> (missing 30% → m=30). Komputasi murah dibanding malu di review.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Dokumentasikan <strong>asumsi mekanisme per variabel</strong> dalam satu tabel metode. Reviewer klinis menghargai kejujuran ini lebih dari teknik canggih.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Imputasi Mean Merusak Variansi</h2>
      <p>Bangkitkan data normal, hilangkan 30% secara MCAR, lalu bandingkan: hapus vs imputasi mean vs kebenaran. Lihat SD menyusut pada imputasi mean.</p>
      <PyodideLab
        title="🔬 Lab 1: Imputasi Mean Merusak Variansi"
        hint="Ubah proporsi missing 0.3 → 0.5. Perhatikan SD imputasi-mean makin menyusut sementara SE-nya terlihat makin “presisi” — presisi palsu!"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: MAR Bisa Dipulihkan, MNAR Tidak</h2>
      <p>Simulasikan pendapatan yang hilang karena (a) MAR: terkait pekerjaan teramati; (b) MNAR: terkait pendapatan itu sendiri. Bandingkan mean teramati vs kebenaran.</p>
      <PyodideLab
        title="🔬 Lab 2: MAR Bisa Dipulihkan, MNAR Tidak"
        hint="Pada skenario MAR, coba koreksi dengan rata-rata per pekerjaan (stratifikasi). Pada MNAR, tidak ada stratifikasi yang bisa — rasakan bedanya."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: “Tidak Tahu” dan “Menolak Jawab” di Survei Indonesia</h2>
      <p>Survei Indonesia (Riskesdas, Susenas, SDKI) punya dua jenis “missing” yang sering <strong>disamakan padahal beda jauh</strong>: <strong>“tidak tahu”</strong> dan <strong>“menolak jawab”</strong>.</p>
      <p><strong>“Tidak tahu” = informasi.</strong> Pada pertanyaan “apakah Anda tahu gejala TB?”, jawaban “tidak tahu” <strong>bukan missing</strong> — ia adalah <em>outcome</em> (pengetahuan rendah)! Mengkodekannya sebagai missing dan mengimputasi = <strong>menghapus temuan utama survei</strong>. Aturan: bedakan <em>item non-response karena tidak tahu</em> (analisis sebagai kategori sendiri) dari <em>non-response karena tidak ditanya</em> (skip pattern kuesioner — missing struktural, bukan missing data!).</p>
      <p><strong>“Menolak jawab” = MNAR klasik.</strong> Pertanyaan sensitif (pendapatan, perilaku seksual, KDRT): yang menolak <strong>sistematis berbeda</strong> dari yang menjawab. SDKI (Survei Demografi Kesehatan Indonesia) menangani ini dengan <strong>bobot non-response adjustment</strong> — tapi bobot hanya mengoreksi berdasarkan variabel teramati (MAR assumption). Untuk analis: <strong>selalu laporkan response rate per pertanyaan sensitif</strong>; jika &lt;70%, angka apapun darinya butuh peringatan keras.</p>
      <p><strong>Missing struktural ≠ missing data.</strong> Kuesioner: “jika tidak merokok, lewati 5 pertanyaan berikut” — 5 kolom kosong itu <strong>bukan missing</strong>, melainkan <em>tidak applicable</em>. Mengimputasinya = mengarang perokok dari bukan-perokok. Selalu baca <strong>skip logic kuesioner</strong> sebelum menyentuh missing — 30 menit membaca menghemat bencana.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Di data survei Indonesia, buat <strong>tiga kategori</strong> sebelum analisis: (1) terisi, (2) tidak tahu/menolak (analisis sebagai kategori — ini temuan!), (3) tidak applicable (biarkan kosong, jangan imputasi). Tiga kategori ini menghindarkan 90% kesalahan penanganan missing di data survei.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Missing &lt;5%, MCAR → Complete-case OK</h3>
        <p><strong>Kondisi:</strong> Sedikit, acak, bukan variabel kunci.</p>
        <p><strong>Kenapa:</strong> Bias minimal; kesederhanaan menang.</p>
        <p><strong>Contoh nyata:</strong> 2% tanggal lahir hilang karena typo acak.</p>
      </div>
      <div className="decision-card">
        <h3>2. MAR, missing substansial → MICE</h3>
        <p><strong>Kondisi:</strong> Pola terkait variabel teramati; variabel penting untuk analisis.</p>
      <PlotlyChart
        data={hd8MiceData}
        title="SD Estimasi: Imputasi Tunggal vs MICE (data asli SD=15)"
        layout={hd8MiceDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang kuning = SD setelah imputasi mean; biru = SD gabungan MICE. Garis acuan: SD asli 15.</p>
        <p><strong>Interpretasi:</strong> Imputasi mean menyusutkan SD ke 11,2 (palsu presisi); MICE mengembalikannya ke 14,8 — dekat kebenaran. Visual dari suku B Rubin's rules: ketidakpastian yang diakui, bukan disembunyikan.</p>
      </div>
        <p><strong>Kenapa:</strong> Gold standard: koreksi bias + SE jujur via Rubin's rules.</p>
        <p><strong>Contoh nyata:</strong> Pendapatan 30% hilang terkait pekerjaan tercatat.</p>
      </div>
      <div className="decision-card">
        <h3>3. Diduga MNAR → Sensitivitas tipping-point</h3>
        <p><strong>Kondisi:</strong> Missing terkait nilai itu sendiri (self-reported, drop-out sakit).</p>
        <p><strong>Kenapa:</strong> Tidak teridentifikasi dari data; yang bisa dilakukan = uji ketahanan kesimpulan.</p>
        <p><strong>Contoh nyata:</strong> Skor nyeri 30% hilang; uji sampai seberapa buruk skenario yang membalik hasil.</p>
      </div>
      <div className="decision-card">
        <h3>4. Missing pada outcome longitudinal → Mixed model / IPW-GEE</h3>
        <p><strong>Kondisi:</strong> Drop-out seiring waktu (HD7).</p>
        <p><strong>Kenapa:</strong> Mixed model valid di bawah MAR; GEE butuh pembobotan IPW.</p>
        <p><strong>Contoh nyata:</strong> Pasien berhenti kontrol setelah memburuk.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Diagnosis mekanisme dulu (MCAR/MAR/MNAR), terapi kemudian.</li>
          <li>Jangan imputasi mean tunggal. Jangan hapus diam-diam.</li>
          <li>MICE: sertakan outcome di model imputasi; m ≈ % missing.</li>
          <li>MNAR → tipping-point sensitivity, laporkan jujur.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Survei Kepuasan RS: 92% Puas?</h2>
      <div className="callout">
        <p>RS mengklaim “kepuasan pasien 92%” dari survei pulang: 5.000 dari 8.000 pasien mengisi (response 62,5%). Manajemen ingin memakai angka ini untuk akreditasi.</p>
      <p>Kamu cek: pengisi survei rata-rata rawat inap <strong>2 hari</strong>; yang tidak mengisi rata-rata <strong>6 hari</strong> (lebih kompleks/berat). Tidak ada data kepuasan dari yang tidak mengisi.</p>
        <p><strong>Pertanyaan:</strong> Apakah angka 92% bisa dipercaya? Rancang respons analis yang tepat.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tidak. Ini MNAR yang klasik: kepuasan (nilai yang hilang) terkait alasan tidak mengisi (pengalaman lebih berat/kurang puas). 92% adalah estimasi pada subpopulasi yang puas-cenderung-mengisi. Respons: (1) jangan laporkan 92% sebagai kepuasan RS; (2) bandingkan karakteristik pengisi vs bukan (sudah terlihat beda); (3) lakukan tipping-point: seberapa tidak puaskah kelompok non-responden agar angka gabungan turun di bawah standar akreditasi? (4) perbaiki desain: survei singkat di tempat tidur sebelum pulang + insentif, bukan link pasca-pulang. Pelajaran: response rate 62% dengan MNAR lebih berbahaya dari response 40% yang MCAR.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Skor depresi kosong justru pada yang paling depresi. Ini…"
        options={["MCAR",
          "MAR",
          "MNAR",
          "Bukan missing"]}
        correct={2}
        explanation="Benar: hilangnya terkait nilai yang hilang itu sendiri = MNAR. Tidak bisa dipulihkan penuh dari variabel lain."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Imputasi mean tunggal berbahaya karena…"
        options={["Mean selalu salah",
          "Menyusutkan variansi → SE kekecilan → p-value terlalu optimis",
          "Terlalu lambat",
          "Tidak bisa untuk data besar"]}
        correct={1}
        explanation="Benar: semua tambalan = angka sama → variasi palsu rendah. Lihat lab 1: SD 15 → 11,2."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Suku B dalam Rubin's rules mengukur…"
        options={["Bias",
          "Ketidakpastian akibat missing itu sendiri (variansi antar imputasi)",
          "Jumlah imputasi",
          "Kecepatan komputer"]}
        correct={1}
        explanation="Benar: B = seberapa beda hasil antar versi imputasi. Inilah kejujuran MICE yang disembunyikan imputasi tunggal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Variabel apa yang WAJIB masuk model imputasi MICE?"
        options={["Hanya variabel bebas",
          "Semua variabel analisis TERMASUK outcome",
          "Hanya yang lengkap",
          "Tidak ada aturan"]}
        correct={1}
        explanation="Benar: mengeluarkan outcome melemahkan hubungan yang ingin diestimasi (bias menuju nol). Masukkan semua."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Aturan praktis jumlah imputasi m?"
        options={["Selalu 5",
          "m ≈ % missing",
          "m = ukuran sampel",
          "1 cukup"]}
        correct={1}
        explanation="Benar: missing 30% → m≈30. Dulu 5 karena komputer lambat; sekarang murah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Untuk temuan kunci dengan dugaan MNAR, langkah tepat?"
        options={["Abaikan saja",
          "Analisis sensitivitas tipping-point: seberapa ekstrem skenario yang membalik kesimpulan",
          "Tambah imputasi sampai hilang",
          "Hapus variabelnya"]}
        correct={1}
        explanation="Benar: MNAR tak teridentifikasi — yang bisa dilakukan adalah menguji ketahanan kesimpulan terhadap skenario terburuk yang plausibel."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>MCAR</strong>: acak (hapus OK). <strong>MAR</strong>: terlacak via variabel teramati (MICE). <strong>MNAR</strong>: terkait nilai hilang (sensitivitas).</li>
          <li>Jangan imputasi mean tunggal; jangan complete-case diam-diam.</li>
          <li><strong>MICE</strong>: m dataset → analisis → gabung via Rubin's rules (W + B).</li>
          <li>Sertakan <strong>outcome</strong> dalam model imputasi; m ≈ % missing.</li>
          <li>Buat <strong>indikator missing</strong> — kadang hilangnya sendiri adalah sinyal.</li>
          <li><strong>MNAR</strong> butuh tipping-point sensitivity, bukan MICE lebih banyak.</li>
          <li>Laporkan: % missing, asumsi mekanisme + alasan, metode, sensitivitas.</li>
          <li>Prasyarat untuk HD11 (EHR kotor) dan HD12 (model dengan missing).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd7-longitudinal" className="btn btn-secondary btn-sm">← HD7</Link>
        <Link href="/learn/hd9-uji-diagnostik" className="btn btn-primary btn-sm">HD9 →</Link>
      </div>
    </div>
  );
}
