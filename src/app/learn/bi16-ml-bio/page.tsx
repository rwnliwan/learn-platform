"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi16MlBioPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi16LambdaData = [{"x": [0.001, 0.01, 0.1, 1, 10], "y": [0.55, 0.72, 0.8, 0.76, 0.6], "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1", "width": 3}, "marker": {"size": 9}}];
  const bi16LambdaDataLayout = {"xaxis": {"title": "lambda (log)", "type": "log"}, "yaxis": {"title": "AUC (CV)"}, "showlegend": false};

  const lab1Code = "import random, statistics as st\nrandom.seed(5)\nn, p = 100, 1000\nX = [[random.gauss(0,1) for _ in range(p)] for _ in range(n)]\ny = [random.randint(0,1) for _ in range(n)]  # murni noise!\ndef kor2(xs, ys):\n    mx, my = st.mean(xs), st.mean(ys)\n    return abs(sum((a-mx)*(b-my) for a,b in zip(xs,ys)))\n# DOSA: seleksi fitur dari SEMUA data\nskor = sorted(range(p), key=lambda j: kor2([X[i][j] for i in range(n)], y), reverse=True)[:10]\n# CV 5-fold sederhana dengan 10 fitur “terbaik” (bocor)\nbenar = 0\nfor fold in range(5):\n    test = list(range(fold*20, (fold+1)*20))\n    train = [i for i in range(n) if i not in test]\n    # classifier 1-NN centroid sederhana\n    for t in test:\n        d0 = sum((X[t][j]-st.mean(X[i][j] for i in train if y[i]==0))**2 for j in skor)\n        d1 = sum((X[t][j]-st.mean(X[i][j] for i in train if y[i]==1))**2 for j in skor)\n        if (d1 < d0) == (y[t]==1): benar += 1\nprint(f'akurasi (seleksi BOCOR): {benar/n:.0%} <- dari NOISE MURNI!')\nprint()\nprint('Seleksi melihat test set -> 10 fitur “terbaik” dari noise.')\nprint('Yang benar: seleksi ULANG di tiap fold (nested).')";

  const lab2Code = "import random, statistics as st\nrandom.seed(21)\n# 10 pasien x 10 sampel; label ~ efek pasien (sidik jari), bukan penyakit\ndata = []\nfor pasien in range(10):\n    sidik = random.gauss(0, 3)  # efek pasien kuat\n    label = 1 if sidik > 0 else 0\n    for _ in range(10):\n        data.append((pasien, [sidik + random.gauss(0,1) for _ in range(5)], label))\ndef akurasi(train, test):\n    benar = 0\n    for _, xt, yt in test:\n        d0 = sum((a-st.mean(X[i][0] for i in range(len(train)) if train[i][2]==0))**2 for a in xt)\n        d1 = sum((a-st.mean(X[i][0] for i in range(len(train)) if train[i][2]==1))**2 for a in xt)\n        if (d1 < d0) == (yt==1): benar += 1\n    return benar/len(test)\nX = data\n# split acak\nidx = list(range(len(X))); random.shuffle(idx)\nacc_acak = akurasi([X[i] for i in idx[20:]], [X[i] for i in idx[:20]])\n# grouped by pasien\ntest_p = {0, 1}\nacc_group = akurasi([d for d in X if d[0] not in test_p], [d for d in X if d[0] in test_p])\nprint(f'CV acak           : {acc_acak:.0%} (model menghafal pasien!)')\nprint(f'grouped by pasien : {acc_group:.0%} (jujur)')\nprint()\nprint('Deployment = pasien BARU. Hanya grouped yang mengukurnya.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI16 &mdash; Bioinformatics</span>
        <h1 className="display-title">Leakage &amp; p &gt;&gt; n:<br />Machine Learning untuk Biologi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Model 99% yang Menipu</a></li>
          <li><a href="#ppn">Tantangan p &gt;&gt; n &amp; Seleksi Fitur</a></li>
          <li><a href="#leakage">Leakage: Homologi &amp; Batch</a></li>
          <li><a href="#cv">Validasi yang Benar: Grouped CV</a></li>
          <li><a href="#dl">Deep Learning Sekuens &amp; Protein LM</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Leakage Seleksi Fitur</a></li>
          <li><a href="#lab2">🔬 Lab 2: Grouped Split vs Acak</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Jebakan yang Tidak Ada di Textbook</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Audit Model Prediksi Patogenisitas</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan tantangan <strong>p &gt;&gt; n</strong> dan strategi seleksi fitur/regularisasi.</li>
          <li>Mengenali <strong>data leakage</strong> khas bio: homologi, batch, seleksi fitur di luar CV.</li>
          <li>Merancang <strong>validasi grouped</strong> (split by protein/pasien/studi).</li>
          <li>Menjelaskan aplikasi <strong>deep learning</strong>: CNN sekuens, protein language models.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Model 99% yang Menipu</h2>
      <div className="story">
        <p>Paper mengklaim model prediksi interaksi protein dengan akurasi 99%. Reproduksi oleh lab lain: <strong>62%</strong>. Investigasi: protein homolog (kerabat dekat) tersebar di train DAN test — model hanya menghafal keluarga protein, bukan belajar interaksi. 99% = hafalan, bukan kecerdasan.</p>
      <p>ML untuk biologi punya jebakan yang tidak ada di textbook ML umum: sekuens yang berkerabat, batch teknis, dan fitur 20.000 vs sampel 100. Lesson ini adalah panduan bertahan hidup — agar akurasimu nyata, bukan artefak leakage.</p>
      <p>Twist-nya: akurasi 99% itu sendiri adalah <strong>sinyal bahaya pertama</strong>. Di biologi, angka yang terlalu bagus hampir selalu berarti model menemukan jalan pintas — homologi antar protein, batch teknis, kekerabatan sampel — bukan pola biologi yang sesungguhnya. <em>Leakage</em> di sini tidak terlihat seperti kebocoran: ia menyamar sebagai “fitur yang sangat prediktif”. Ironisnya, model yang jujur (62%) jauh lebih berguna daripada model “99%” yang runtuh di dunia nyata. Di ML bio, skeptis pada angka bagus adalah skill bertahan hidup.</p>
      </div>

      <h2 id="ppn">Tantangan p &gt;&gt; n — Si Kutukan Dimensi</h2>
      <p><strong>Definisi.</strong> <strong>p &gt;&gt; n</strong>: fitur (20.000 gen) jauh melebihi sampel (100 pasien). Model fleksibel akan <strong>menghafal noise</strong> (overfit). Senjata: <strong>regularisasi</strong> (Lasso/Ridge), <strong>seleksi fitur</strong>, reduksi dimensi, model sederhana dulu.</p>
      <Tex math={String.raw`\min_\beta \|y - X\beta\|^2 + \lambda\|\beta\|_1`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\|\beta\|_1`} />: penalti L1: jumlah |koefisien| — memaksa sparsitas</li>
          <li><Tex math={String.raw`\lambda`} />: kekuatan regularisasi (dipilih via CV)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Lasso = kuadrat terkecil + denda untuk koefisien besar. L1 mendorong TEPAT nol (seleksi fitur otomatis). Lambda via CV: terlalu kecil = overfit, terlalu besar = underfit.</p>
      <details className="worked">
        <summary>📐 Contoh: Lasso untuk signature gen</summary>
        <p>100 pasien, 20.000 gen → prediksi respons obat.<br />Random forest mentah: AUC train 1,0, CV 0,55 (hafalan!).<br /><strong>Lasso</strong> (L1): memaksa sebagian besar koefisien = 0 → 15 gen terpilih, AUC CV 0,78.<br />15 gen = signature yang bisa divalidasi biologis — bukan 20.000 angka misterius.<br />Aturan: bila n&lt;200, model linear teregularisasi sering mengalahkan deep learning.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> p&gt;&gt;n itu seperti ujian dengan 20.000 soal pilihan ganda tapi cuma 100 murid: selalu ada murid yang “kebetulan” benar semua — bukan karena pintar, tapi karena soalnya banyak. Regularisasi adalah pengawas yang menghukum hafalan.</p>
      <p><strong>Kapan memakai:</strong> Semua ML omics. Mulai dari Lasso/logistik + CV; naik ke kompleks bila data mendukung.</p>

      <PlotlyChart
        data={bi16LambdaData}
        title="AUC vs Lambda (Lasso, ilustratif)"
        layout={bi16LambdaDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> X = kekuatan regularisasi (log), Y = performa validasi. Cari puncak kurva.</p>
        <p><strong>Interpretasi:</strong> Lambda kecil = overfit (AUC rendah di validasi meski train sempurna). Lambda besar = underfit. Puncak = sweet spot via CV. Inilah cara memilih kompleksitas model secara prinsipil — bukan tebak-tebakan.</p>
      </div>

      <h2 id="leakage">Leakage: Homologi &amp; Batch — Si Bocoran</h2>
      <p><strong>Definisi.</strong> <strong>Leakage</strong>: info test bocor ke train → performa ilusi. Khas bio: <strong>homologi</strong> (kerabat di kedua set), <strong>batch</strong> (test dari batch sama), <strong>seleksi fitur</strong> sebelum split, <strong>duplikat</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh: tiga leakage klasik</summary>
        <p>1. <strong>Homologi:</strong> prediksi fungsi protein — split acak menaruh homolog di train+test → 99% ilusi. Solusi: <strong>split by family</strong> (CD-HIT 40%) → 70% jujur.<br />2. <strong>Seleksi fitur:</strong> pilih 100 gen dari SEMUA data lalu CV → bias. Solusi: seleksi <strong>di dalam</strong> tiap fold (nested).<br />3. <strong>Batch:</strong> train batch A, test batch A → model belajar batch. Solusi: test di batch/studi INDEPENDEN.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Leakage itu seperti ujian bocor: murid (model) dapat soal sebelum ujian — nilainya 100 tapi tidak belajar apa-apa. Di biologi, soal bocor lewat kerabat (homologi): “soal nomor 5 mirip soal latihan nomor 3”.</p>
      <p><strong>Kapan memakai:</strong> Setiap ML bio. Audit wajib sebelum klaim performa.</p>
      <div className="callout callout-warning"><strong>Checklist anti-leakage</strong> (tempel di dinding): (1) split BERDASARKAN unit independen (pasien/protein/studi), bukan baris; (2) SEMUA preprocessing/seleksi di dalam fold; (3) test set disentuh SEKALI; (4) curigai akurasi &gt;95% di bio — verifikasi dengan split ketat.</div>

      <h2 id="cv">Validasi yang Benar: Grouped CV</h2>
      <p><strong>Definisi.</strong> <strong>Grouped CV</strong>: fold dibagi per grup (pasien, protein family, studi) — tidak ada grup yang muncul di train+test. <strong>Nested CV</strong>: loop dalam untuk tuning, luar untuk estimasi — tuning tidak mengontaminasi estimasi.</p>
      <details className="worked">
        <summary>📐 Contoh: prediksi respons obat per pasien</summary>
        <p>Data: 1.000 sampel dari 100 pasien (10 sampel/pasien).<br /><strong>CV acak:</strong> sampel pasien sama di train+test → AUC 0,95 (model mengenali pasien, bukan penyakit!).<br /><strong>Grouped by pasien:</strong> AUC 0,72 — jujur dan generalizable.<br />0,95 adalah kebohongan yang meyakinkan; 0,72 adalah kebenaran yang berguna.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Grouped CV itu seperti ujian antar-sekolah: murid sekolah A tidak boleh ada di soal latihan DAN ujian — kalau tidak, nilainya mengukur hafalan teman sekelas, bukan pemahaman.</p>
      <p><strong>Kapan memakai:</strong> Selalu bila ada struktur grup. Standar untuk klaim performa yang jujur.</p>

      <h2 id="dl">Deep Learning Sekuens &amp; Protein LM</h2>
      <p><strong>Definisi.</strong> <strong>CNN sekuens</strong>: deteksi motif (DeepBind). <strong>Protein language models</strong> (ESM, ProtT5): transformer dilatih jutaan sekuens → embedding untuk prediksi fungsi/struktur. <strong>Generatif</strong>: desain protein (RFdiffusion).</p>
      <details className="worked">
        <summary>📐 Contoh: ESM untuk prediksi fungsi</summary>
        <p>500 protein berlabel fungsi (sedikit!).<br />Training CNN dari nol: overfit parah.<br /><strong>ESM embedding</strong> (beku) + regresi logistik: AUC 0,85 ✓.<br />Pola: model besar pra-latih sebagai ekstraktor fitur; model kecil untuk tugas spesifik. Inilah cara DL bekerja di bio dengan n kecil.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Protein LM itu seperti LLM untuk protein: setelah “membaca” 250 juta sekuens, ia paham “tata bahasa” protein — mana yang “kalimat” wajar vs aneh. ESM embedding = representasi yang menangkap fungsi tanpa label.</p>
      <p><strong>Kapan memakai:</strong> Data besar (n&gt;10rb) atau transfer learning via embedding. Untuk n kecil: embedding beku + model linear &gt; training dari nol.</p>
      <div className="callout"><strong>Catatan lowongan:</strong> posting bioinformatika 2026 sering meminta “machine learning” + “Python/scikit-learn”; yang membedakan kandidat adalah pemahaman validasi bio-spesifik (leakage homologi, grouped CV) — persis lesson ini — bukan sekadar bisa memanggil fit().</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Akurasi 99% = model hebat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Di bio, &gt;95% hampir selalu patut dicurigai: leakage homologi/batch/duplikat. Model hebat = performa JUJUR di data independen, bukan angka besar di test bocor. Audit dulu, rayakan kemudian.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Deep learning selalu mengalahkan model klasik di bio&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Dengan n=100 dan p=20.000, Lasso/logistik sering menang — DL butuh data besar atau transfer learning. “State-of-the-art” tanpa mempertimbangkan n = cargo cult.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cross-validation standar cukup untuk data biologis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> CV acak gagal bila ada struktur (pasien, homologi, batch). Butuh grouped/nested CV. CV yang salah = estimasi performa yang salah = keputusan yang salah.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Mulai dari <strong>baseline sederhana</strong> (logistik/Lasso) sebelum DL. Bila DL tidak mengalahkan baseline secara bermakna, pakai baseline — lebih interpretable, lebih cepat.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Lakukan <strong>ablation leakage</strong>: bandingkan split acak vs grouped. Selisih besar = sinyal leakage — investigasi sebelum publikasi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan <strong>seed + versi data + kode</strong> (BI17). Klaim ML tanpa reproduksibilitas = anekdot mahal.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Leakage Seleksi Fitur — Buktikan Sendiri</h2>
      <p>Data murni noise (100 sampel, 1000 fitur acak). Seleksi 10 “terbaik” dari SEMUA data lalu CV → lihat akurasi ilusi. Lalu seleksi di dalam fold → jujur.</p>
      <PyodideLab
        title="🔬 Lab 1: Leakage Seleksi Fitur — Buktikan Sendiri"
        hint="Inilah dosa paling umum paper ML bio. Satu baris kode (seleksi di luar loop) = seluruh hasil tidak valid."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Grouped Split vs Acak</h2>
      <p>Simulasikan 10 pasien × 10 sampel dengan efek pasien kuat. Bandingkan CV acak vs grouped-by-pasien. Lihat ilusi 0,95 vs jujur 0,7.</p>
      <PyodideLab
        title="🔬 Lab 2: Grouped Split vs Acak"
        hint="Efek pasien = “sidik jari” teknis. Model yang mengenali pasien terlihat hebat tapi gagal di pasien baru — skenario deployment nyata."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. n kecil, p besar → Lasso/logistik + CV</h3>
        <p><strong>Kondisi:</strong> n&lt;1000; butuh interpretasi.</p>
        <p><strong>Kenapa:</strong> Sederhana, teregularisasi, interpretable.</p>
        <p><strong>Contoh nyata:</strong> Signature 15 gen respons obat.</p>
      </div>
      <div className="decision-card">
        <h3>2. Ada struktur grup → Grouped/nested CV</h3>
        <p><strong>Kondisi:</strong> Pasien/homologi/batch/studi.</p>
        <p><strong>Kenapa:</strong> Estimasi jujur generalisasi.</p>
        <p><strong>Contoh nyata:</strong> Split by protein family.</p>
      </div>
      <div className="decision-card">
        <h3>3. n besar / sekuens → DL / protein LM</h3>
        <p><strong>Kondisi:</strong> Data cukup atau transfer learning.</p>
        <p><strong>Kenapa:</strong> Menangkap pola kompleks.</p>
        <p><strong>Contoh nyata:</strong> ESM embedding + logistik.</p>
      </div>
      <div className="decision-card">
        <h3>4. Klaim performa → Validasi independen</h3>
        <p><strong>Kondisi:</strong> Sebelum publikasi/deploy.</p>
        <p><strong>Kenapa:</strong> CV internal tak cukup untuk klaim kuat.</p>
        <p><strong>Contoh nyata:</strong> Test di kohort/studi lain.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>p&gt;&gt;n → regularisasi; mulai sederhana.</li>
          <li>Curigai akurasi &gt;95%.</li>
          <li>Split by unit independen; seleksi di dalam fold.</li>
          <li>Test independen untuk klaim; simpan seed+versi.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Model Sepsis 97% Gagal di RS Lain</h2>
      <div className="callout">
        <p>Model prediksi sepsis dari data EHR+genomik: AUC 0,97 di RS A. Deploy di RS B: AUC 0,61. Investigasi: fitur top = kode alat lab spesifik RS A + batch sekuensing; split acak menaruh pasien sama di train/test.</p>
        <p><strong>Pertanyaan:</strong> Diagnosis lengkap + perbaikan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Triple failure: (1) leakage pasien (split acak), (2) fitur batch-spesifik (kode alat = proksi RS, bukan biologi), (3) tanpa validasi eksternal. Perbaikan: grouped split by pasien; buang fitur administratif/batch; validasi di RS B SEBELUM klaim; laporkan AUC jujur (~0,7). Pelajaran: 0,97 yang runtuh menjadi 0,61 = bukan model buruk, tapi EVALUASI buruk. Di ML klinis (HD12), evaluasi yang salah bisa membunuh — bukan sekadar memalukan.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Jebakan yang Tidak Ada di Textbook</h2>
      <p>Textbook ML mengajarkan leakage sebagai “fitur dari masa depan”. Di biologi, leakage menyamar sebagai <strong>struktur data yang wajar</strong> — kekerabatan, kedekatan genomik, batch teknis. Pendalaman ini adalah katalog penyamaran itu, plus cara validasi yang benar.</p>

      <h3>1. Homology leakage: kembaran di kedua sisi</h3>
      <p>Protein berkerabat (homolog, &gt;40% identitas) punya sifat mirip. Jika homolog tersebar di train dan test, model “memprediksi” dengan <strong>mengenali keluarga</strong>, bukan mempelajari aturan biologi. Di dunia nyata (protein baru tanpa kerabat), ia gagal — persis cerita pembuka (99% → 62%).</p>
      <details className="worked">
        <summary>📐 Contoh: split acak vs split homologi</summary>
        <p>Dataset 10.000 protein, tugas: prediksi fungsi. Split acak 80/20 → akurasi 94%.<br />
        Audit: 70% protein test punya homolog &gt;50% identitas di train.<br />
        Split ulang <strong>berbasis clustering homologi</strong> (cluster pada 30% identitas; seluruh cluster masuk train ATAU test, tidak terbelah) → akurasi <strong>71%</strong>.<br />
        <strong>Interpretasi:</strong> 23 poin akurasi adalah hafalan keluarga. Angka 71% memang menyakitkan — tapi ia adalah <strong>estimasi jujur</strong> performa pada protein baru. Pilih: terlihat pintar di paper, atau berguna di lab? (Lihat BI17: reproduksibilitas dimulai dari evaluasi yang jujur.)</p>
      </details>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Aturan split biologis</strong></p>
        <p>Split harus memutus <strong>jalur kebocoran biologis</strong>: homologi (cluster dulu), kekerabatan pasien (satu pasien = satu sisi), batch/waktu (split temporal untuk deployment nyata), posisi genomik (jangan train-test pada gen bertetangga — LD/keterkaitan!). Split acak adalah default yang salah untuk data biologi.</p>
      </div>

      <h3>2. Batch leakage: model belajar mesin, bukan biologi</h3>
      <p>Kasus klasik: data kanker dari mesin A, kontrol dari mesin B. Model mencapai 98% — dengan mempelajari <strong>artefak mesin</strong> (intensitas latar, pola noise), bukan kanker. Di deployment (semua sampel dari mesin C), akurasi = 50% (tebakan).</p>
      <ul>
        <li><strong>Deteksi:</strong> latih model memprediksi <em>batch</em> dari fitur — jika bisa (&gt;80%), fitur mengandung sinyal batch yang akan dipakai untuk “memprediksi” label.</li>
        <li><strong>Pencegahan:</strong> batch tercampur di train/test (stratifikasi), atau harmonisasi (ComBat) <strong>sebelum</strong> split — dengan parameter dari train saja!</li>
      </ul>

      <h3>3. p &gt;&gt; n: kutukan dimensi omics</h3>
      <p>RNA-seq: 20.000 fitur, 100 sampel. Model kompleks <strong>pasti</strong> bisa menghafal 100 sampel (VC dimension!). Akurasi train 100% = tidak informatif sama sekali.</p>
      <details className="worked">
        <summary>📐 Contoh: kenapa regularisasi bukan opsional</summary>
        <p>Regresi logistik tanpa regularisasi, 20.000 gen, 100 sampel (50/50): train 100%, CV 52% — <strong>hafalan murni</strong>.<br />
        Lasso (L1): memilih ~15 gen, CV 78%. Ridge + PCA (50 komponen): CV 76%.<br />
        <strong>Interpretasi:</strong> dengan n=100, hanya ~10–20 fitur yang bisa diestimasi andal. Model yang “memakai semua 20.000 gen” tidak lebih pintar — ia hanya lebih pandai menghafal. Kesederhanaan di sini bukan keterbatasan; ia adalah <strong>syarat statistik</strong>.<br />
        Aturan praktis: butuh ~10–20 sampel per fitur yang benar-benar dipakai. 100 sampel → maksimal ~10 fitur bebas. Selebihnya harus lewat reduksi dimensi atau prior biologi (pathway!).</p>
      </details>

      <h3>4. Deep learning: kapan layak, kapan overkill</h3>
      <p>DL bersinar di: sekuens (CNN/RNN untuk motif, mis. prediksi efek varian — Enformer), struktur (AlphaFold), gambar (patologi). DL gagal di: tabel klinis kecil (n=200, fitur=50) — di sana gradient boosting (XGBoost) hampir selalu menang: lebih sedikit data, lebih interpretable, lebih cepat.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Mulai dari baseline bodoh</strong></p>
        <p>Sebelum DL: (1) regresi logistik + fitur yang masuk akal, (2) XGBoost. Jika DL hanya menang 1–2% dari XGBoost dengan biaya 100x komputasi + hilang interpretabilitas — <strong>pilih XGBoost</strong>. Di klinik, dokter harus bisa bertanya “kenapa model bilang begitu?” — jawaban “layer ke-47” tidak diterima (lihat BI17: etika AI klinis).</p>
      </div>

      <h3>Kasus nyata: model sepsis yang “bekerja” sampai deployment</h3>
      <p>Model prediksi sepsis dari rekam medis: AUC 0,95 di validasi internal. Di RS lain: 0,68. Investigasi: model belajar <strong>pola pemesanan lab</strong> (pasien sakit → dokter memesan lab lebih sering → “banyak order lab” = prediktor kuat) — bukan fisiologi. Di RS baru dengan protokol order berbeda, sinyal hilang. <strong>Model tidak memprediksi sepsis; ia memprediksi perilaku dokter.</strong> Pelajaran: tanyakan selalu “jalur informasi apa yang dipakai model ini, dan apakah jalur itu ada saat deployment?” — pertanyaan yang tidak ada di textbook, tapi menentukan hidup-mati model.</p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Audit Model Prediksi Patogenisitas</h2>
      <p>Startup mengklaim model AI prediksi varian patogenik dengan <strong>akurasi 96%</strong> — dan ingin menjualnya ke lab klinik. Kamu dipekerjakan sebagai auditor independen. Misi: <strong>cari kebocorannya</strong>. (Ingat cerita pembuka: 99% → 62%.)</p>

      <h3>Audit 1: split dataset</h3>
      <p>Paper: “split acak 80/20”. Kamu cek: 65% varian test punya <strong>homolog &gt; 70% identitas</strong> di train (gen paralog dalam keluarga yang sama!). Model menghafal “keluarga gen kanker = patogenik” — bukan belajar efek varian.</p>
      <details className="worked">
        <summary>📐 Contoh: audit split homologi</summary>
        <p>Kamu bangun ulang evaluasi dengan <strong>split berbasis gen</strong> (semua varian satu gen → train ATAU test, tak terbelah):<br />
        Akurasi klaim: 96% → akurasi audit: <strong>74%</strong>.<br />
        Lebih jauh: pada gen <strong>tanpa homolog</strong> di train (skenario dunia nyata untuk gen jarang): <strong>61%</strong> — nyaris tebakan.<br />
        <strong>Interpretasi:</strong> 35 poin akurasi adalah hafalan keluarga gen. Untuk lab klinik yang menerima varian di <strong>gen jarang</strong> (kasus tersulit, paling butuh bantuan!), model ini hampir tak berguna. <strong>Angka 96% bukan sekadar optimistis — ia menyesatkan pembeli tentang kapan model bisa dipercaya.</strong></p>
      </details>

      <h3>Audit 2: label leakage</h3>
      <p>Fitur “frekuensi ClinVar” — model memakai <strong>jumlah submitter ClinVar</strong> sebagai fitur! Varian patogenik terkenal = banyak submitter = model “memprediksi” dari popularitas, bukan biologi. Untuk varian <strong>baru</strong> (nol submitter), fitur ini = 0 — model buta. <strong>Leakage klasik</strong>: fitur yang tidak ada saat deployment.</p>

      <h3>Audit 3: metrik yang tepat</h3>
      <p>Dataset 95% benign, 5% patogenik. Akurasi 96% bisa dicapai model yang <strong>selalu menebak “benign”</strong> (95%!) — nyaris tanpa kecerdasan. Metrik yang jujur: <strong>AUPRC</strong> (area under precision-recall curve) untuk kelas minoritas + <strong>sensitivitas pada spesifisitas 95%</strong> (ambang klinis: false positive mahal).</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Checklist audit model bio (5 menit)</strong></p>
        <p>(1) Bagaimana split? (homologi/kerabat/batch diputus?) (2) Apakah ada fitur yang tidak tersedia saat deployment? (3) Apakah metrik sesuai imbalance? (4) Apakah baseline sederhana (regresi logistik) dicoba? (5) Apakah diuji di <strong>kohort independen</strong>? Model yang gagal ≥1 = “menarik, belum bisa dipakai”. Model startup ini gagal 1, 2, dan 5.</p>
      </div>

      <h3>Verdict audit</h3>
      <p>“Model menunjukkan sinyal nyata (74% pada split jujur &gt; 50%), tapi <strong>tidak siap klinik</strong>. Rekomendasi: latih ulang dengan split-gen, buang fitur leakage, validasi di kohort independen, laporkan AUPRC. Estimasi performa deployment nyata: 60–75%, bukan 96%.” <strong>Audit yang jujur menyelamatkan startup dari gugatan</strong> — dan pasien dari keputusan berbasis angka palsu.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Strategi utama menghadapi p >> n?"
        options={["Kumpulkan fitur lagi",
          "Regularisasi (Lasso), seleksi fitur, model sederhana + CV",
          "Deep learning selalu",
          "Tanpa validasi"]}
        correct={1}
        explanation="Benar: hukum hafalan. 20.000 fitur vs 100 sampel butuh pengawas (lambda)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Leakage homologi terjadi ketika…"
        options={["Data sedikit",
          "Protein kerabat ada di train DAN test — model menghafal keluarga",
          "Fitur banyak",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: split by family (CD-HIT), bukan acak. 99% → 70% jujur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Seleksi fitur SEBELUM split CV menyebabkan…"
        options={["Lebih cepat",
          "Leakage: seleksi melihat test — performa ilusi bahkan dari noise",
          "Tidak apa",
          "Wajib"]}
        correct={1}
        explanation="Benar: lab 1 membuktikan — noise murni bisa “akurat”. Nested!"
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Grouped CV dibutuhkan ketika…"
        options={["Selalu acak saja",
          "Ada struktur grup (pasien/homologi/batch) — generalisasi = grup baru",
          "Data kecil",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: deployment = pasien baru. Hanya grouped yang mengukur itu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Untuk n=100, p=20.000, pilihan bijak?"
        options={["Transformer dari nol",
          "Lasso/logistik teregularisasi + CV",
          "Tanpa model",
          "Hafalkan data"]}
        correct={1}
        explanation="Benar: DL butuh data/transfer. Baseline sederhana sering menang di n kecil."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Cara memakai protein LM (ESM) dengan label sedikit?"
        options={["Training dari nol",
          "Embedding beku + model linear kecil (transfer learning)",
          "Jangan pakai",
          "Hafalkan embedding"]}
        correct={1}
        explanation="Benar: model besar sebagai ekstraktor fitur; model kecil untuk tugas. Pola standar n kecil."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>p &gt;&gt; n</strong>: regularisasi + seleksi + mulai sederhana.</li>
          <li><strong>Leakage</strong> bio: homologi, batch, seleksi-di-luar-fold, duplikat.</li>
          <li><strong>Grouped/nested CV</strong>: split by unit independen.</li>
          <li>Curigai <strong>akurasi &gt;95%</strong> — audit dulu.</li>
          <li>Validasi <strong>independen</strong> untuk klaim performa.</li>
          <li>DL: untuk n besar; <strong>transfer via embedding</strong> untuk n kecil.</li>
          <li>Baseline sederhana dulu; kalahkan baru naik kelas.</li>
          <li>Simpan <strong>seed + versi + kode</strong> (BI17).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi15-proteomik" className="btn btn-secondary btn-sm">← BI15</Link>
        <Link href="/learn/bi17-reprodusibilitas" className="btn btn-primary btn-sm">BI17 →</Link>
      </div>
    </div>
  );
}
