"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd13FairnessKesehatanPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd13BiasData = [{"x": ["Jakarta swasta", "Jawa RSUD", "Luar Jawa RSUD", "Puskesmas timur"], "y": [45, 30, 18, 7], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "30%", "18%", "7%"], "textposition": "outside"}];
  const hd13BiasDataLayout = {"xaxis": {"title": "Sumber"}, "yaxis": {"title": "% data training", "range": [0, 55]}, "showlegend": false};

  const lab1Code = "# (grup, skor, butuh_rujukan? 1/0)\nimport random\nrandom.seed(6)\ndata = []\nfor _ in range(2000):\n    timur = random.random() < 0.3\n    butuh = random.random() < (0.30 if timur else 0.15)\n    # model: sedikit bias — skor timur diredam (kurang terwakili di training)\n    skor = (0.7 if butuh else 0.2) + random.gauss(0, 0.15) - (0.12 if timur else 0)\n    data.append((timur, skor, butuh))\nTHR = 0.5\nprint(f\"{'grup':<8} {'TPR':>6} {'FPR':>6} {'PPV':>6}\")\nfor timur, nama in [(False, 'kota'), (True, 'timur')]:\n    g = [d for d in data if d[0] == timur]\n    tp = sum(1 for _, s, b in g if s >= THR and b == 1)\n    fn = sum(1 for _, s, b in g if s < THR and b == 1)\n    fp = sum(1 for _, s, b in g if s >= THR and b == 0)\n    tn = sum(1 for _, s, b in g if s < THR and b == 0)\n    print(f'{nama:<8} {tp/(tp+fn):>6.0%} {fp/(fp+tn):>6.0%} {tp/(tp+fp):>6.0%}')\nprint()\nprint('TPR timur jauh lebih rendah: yang butuh di timur lebih sering terlewat.')\nprint('Agregat menyembunyikan ini. Audit per grup = wajib.')";

  const lab2Code = "import random\nrandom.seed(6)\ndata = []\nfor _ in range(4000):\n    timur = random.random() < 0.3\n    butuh = random.random() < (0.30 if timur else 0.15)\n    skor = (0.7 if butuh else 0.2) + random.gauss(0, 0.15) - (0.12 if timur else 0)\n    data.append((timur, skor, butuh))\ndef metrik(subset, thr):\n    tp = sum(1 for s, b in subset if s >= thr and b == 1)\n    fn = sum(1 for s, b in subset if s < thr and b == 1)\n    fp = sum(1 for s, b in subset if s >= thr and b == 0)\n    tn = sum(1 for s, b in subset if s < thr and b == 0)\n    return tp/(tp+fn), fp/(fp+tn)\nkota = [(s, b) for t, s, b in data if not t]\ntimur = [(s, b) for t, s, b in data if t]\ntpr_kota, _ = metrik(kota, 0.5)\nprint(f'TPR kota @0.5 = {tpr_kota:.0%}')\n# cari threshold timur agar TPR menyamai kota\nfor thr in [0.5, 0.45, 0.4, 0.35, 0.3]:\n    tpr_t, fpr_t = metrik(timur, thr)\n    print(f'  thr timur={thr}: TPR={tpr_t:.0%}  FPR={fpr_t:.0%}')\nprint()\nprint('TPR setara TERCAPAI, tapi FPR timur naik.')\nprint('Keadilan ada harganya. Siapa yang membayar? -> keputusan klinis, bukan kode.')";

  const hd13ThrData = [{"x": ["Satu threshold (0,5)", "Threshold per grup"], "y": [25, 4], "type": "bar", "marker": {"color": ["#e8a838", "#2a7de1"]}, "name": "Disparitas TPR", "text": ["25%", "4%"], "textposition": "outside"}, {"x": ["Satu threshold (0,5)", "Threshold per grup"], "y": [0.82, 0.81], "type": "bar", "marker": {"color": "#94a3b8"}, "name": "AUC", "yaxis": "y2"}];
  const hd13ThrDataLayout = {"xaxis": {"title": "Strategi"}, "yaxis": {"title": "Disparitas TPR (%)"}, "yaxis2": {"title": "AUC", "overlaying": "y", "side": "right", "range": [0.7, 0.9]}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD13 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Fairness di Kesehatan:<br />Ketika AI Memihak</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Skor yang Rasis</a></li>
          <li><a href="#bias">Dari Mana Bias Datang</a></li>
          <li><a href="#metrik">Metrik Fairness &amp; Trade-off</a></li>
          <li><a href="#mitigasi">Mitigasi &amp; Explainability</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Audit Disparitas Model</a></li>
          <li><a href="#lab2">🔬 Lab 2: Threshold per Grup vs Satu Threshold</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Audit Fairness Model Rujukan</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Trade-off Nyata vs Palsu</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Disparitas Jawa vs Luar Jawa</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Mengaudit Label — Sumber Bias Paling Sunyi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 4 sumber bias AI kesehatan (<strong>data, label, representasi, deployment</strong>) dengan contoh nyata.</li>
          <li>Menghitung <strong>disparitas metrik antar grup</strong> (TPR, PPV, kalibrasi) dari output model.</li>
          <li>Menjelaskan mengapa <strong>metrik fairness bisa saling bertentangan</strong> (impossibility).</li>
          <li>Merancang <strong>strategi mitigasi</strong> per tahap (pre/in/post-processing) + explainability untuk klinisi.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Skor yang Rasis</h2>
      <div className="story">
        <p>2019, jurnal Science: algoritma yang dipakai RS AS untuk memprioritaskan perawatan <strong>meremehkan kebutuhan pasien kulit hitam secara sistematis</strong>. Penyebabnya bukan programmer rasis — melainkan label: model memprediksi <em>biaya kesehatan</em> sebagai proksi <em>kebutuhan kesehatan</em>. Karena pasien kulit hitam secara historis menerima layanan lebih sedikit (biaya lebih rendah), model menyimpulkan mereka “kurang butuh”.</p>
      <p>Label yang terlihat netral (“biaya”) membawa sejarah ketidakadilan ke dalam model. Di Indonesia, versi lokalnya: model yang dilatih di RS swasta Jakarta bisa gagal total untuk pasien puskesmas Papua — bukan karena AI jahat, tapi karena dunianya beda. Lesson ini tentang cara mengaudit keadilan sebelum AI menyakiti yang paling rentan.</p>
      <p><strong>Twist-nya:</strong> tidak ada programmer yang rasis di cerita ini — dan hasilnya <em>tetap rasis</em>. Itulah yang paling menakutkan: <strong>ketidakadilan tidak butuh niat jahat, cukup label yang ceroboh</strong>. “Biaya” terlihat netral dan objektif, tapi ia adalah cermin sejarah layanan yang timpang — model hanya memoles cermin itu menjadi keputusan. Fairness bukan fitur tambahan yang dipasang belakangan; ia adalah <strong>pertanyaan pertama</strong> sebelum model menyentuh pasien: “siapa yang dirugikan jika aku salah, dan apakah mereka yang selama ini sudah dirugikan?”</p>
      </div>

      <h2 id="bias">Dari Mana Bias Datang — Empat Pintu Masuk</h2>
      <p><strong>Definisi.</strong> <strong>Bias data</strong>: siapa yang tercatat (RS swasta ≠ puskesmas). <strong>Bias label</strong>: proksi yang membawa sejarah (biaya ≠ kebutuhan). <strong>Bias representasi</strong>: grup minoritas sedikit di training. <strong>Bias deployment</strong>: dipakai di populasi/waktu berbeda.</p>
      <details className="worked">
        <summary>📐 Contoh: empat pintu di model rujukan Indonesia</summary>
        <p><strong>Data:</strong> training dari 3 RS swasta Jakarta → tidak mewakili puskesmas timur Indonesia.<br /><strong>Label:</strong> “rujukan disetujui” sebagai proksi kebutuhan — padahal persetujuan terkait asuransi &amp; jarak.<br /><strong>Representasi:</strong> pasien &gt;70 tahun hanya 3% data.<br /><strong>Deployment:</strong> dipakai di RSUD dengan case-mix beda total.<br />Hasil: model menolak rujukan yang seharusnya diterima — merugikan yang paling jauh dari Jakarta.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bias itu seperti air: masuk lewat celah terkecil — celah pengumpulan, celah label, celah sampel, celah pemakaian. Menambal satu celah sambil mengabaikan tiga lainnya = tetap banjir.</p>
      <p><strong>Kapan memakai:</strong> Audit fairness: periksa keempat pintu BERURUTAN sebelum menyentuh metrik. Kebanyakan kasus nyata (termasuk Science 2019) akarnya di label, bukan di algoritma.</p>

      <PlotlyChart
        data={hd13BiasData}
        title="Komposisi Data Training vs Populasi Target (ilustratif)"
        layout={hd13BiasDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = proporsi data training dari tiap sumber. Bandingkan dengan populasi target nasional (yang seharusnya ~merata/demografis).</p>
        <p><strong>Interpretasi:</strong> 45% data dari RS swasta Jakarta yang melayani &lt;10% populasi. Model belajar “normal” = pasien Jakarta swasta. Saat dipakai di puskesmas timur (7% data), ia buta. Representasi bukan soal politik — soal validitas statistik.</p>
      </div>

      <h2 id="metrik">Metrik Fairness &amp; Trade-off — Si Mustahil Sempurna</h2>
      <p><strong>Definisi.</strong> <strong>Demographic parity</strong>: tingkat positif sama antar grup. <strong>Equalized odds</strong>: TPR &amp; FPR sama antar grup. <strong>Kalibrasi per grup</strong>: angka jujur di tiap grup. <strong>Teorema impossibility</strong>: bila base rate beda, ketiganya <strong>tidak bisa</strong> dipenuhi bersamaan (kecuali sempurna/acak).</p>
      <Tex math={String.raw`\text{Disparitas TPR} = |TPR_{grup A} - TPR_{grup B}|`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`TPR`} />: true positive rate: dari yang benar-benar butuh, berapa yang tertangkap</li>
          <li><Tex math={String.raw`\text{Disparitas}`} />: selisih antar grup — makin kecil makin adil menurut metrik ini</li>
      </ul>
      <p><strong>Interpretasi:</strong> Tidak ada metrik tunggal yang benar — pilih sesuai nilai klinis: untuk alokasi perawatan, equalized odds (kesempatan terdeteksi sama) lebih relevan dari demographic parity.</p>
      <details className="worked">
        <summary>📐 Contoh: impossibility dalam angka</summary>
        <p>Dua grup, base rate butuh-perawatan: A=10%, B=30%. Model sempurna terkalibrasi per grup.<br />Demographic parity menuntut tingkat rujukan SAMA → melanggar kalibrasi (salah satu grup dirujuk berlebihan/kurang).<br />Equalized odds + kalibrasi bisa jalan, tapi parity dikorbankan.<br /><strong>Pelajaran:</strong> jangan kejar semua metrik — pilih yang sesuai misi klinis dan nyatakan trade-off-nya eksplisit.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Metrik fairness itu seperti tiga orang yang menarik selimut: menutupi satu membuka yang lain. Tugasmu bukan memuaskan ketiganya — tapi memilih siapa yang boleh kedinginan, dan mempertanggungjawabkannya.</p>
      <p><strong>Kapan memakai:</strong> Audit model: hitung TPR/FPR/PPV/kalibrasi PER GRUP (etnis, gender, usia, wilayah, asuransi). Pilih metrik primer sesuai konteks klinis.</p>

      <h2 id="mitigasi">Mitigasi &amp; Explainability — Si Tukang Perbaiki</h2>
      <p><strong>Definisi.</strong> <strong>Pre-processing</strong>: perbaiki data/label (reweight, ganti proksi). <strong>In-processing</strong>: fairness constraint saat training. <strong>Post-processing</strong>: threshold per grup. <strong>Explainability</strong> (SHAP): tunjukkan alasan prediksi ke klinisi — transparansi memungkinkan contestability.</p>
      <details className="worked">
        <summary>📐 Contoh: memperbaiki kasus skor rujukan</summary>
        <p><strong>Pre:</strong> ganti label “biaya” → “kebutuhan klinis” (HbA1c tak terkontrol + komorbid). Tambah data puskesmas.<br /><strong>In:</strong> constraint equalized odds saat training.<br /><strong>Post:</strong> threshold rujukan per wilayah agar TPR setara.<br /><strong>SHAP:</strong> dokter melihat “skor tinggi karena: HbA1c 11% + riwayat stroke” — masuk akal, dipercaya.<br />Hasil: disparitas TPR 25% → 4%, dengan penurunan AUC hanya 0,01.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Mitigasi itu seperti memperbaiki rumah bocor: pre = perbaiki atap (data), in = pasang talang saat bangun (training), post = taruh ember (threshold). SHAP itu jendela kaca: penghuni (klinisi) bisa melihat ke dalam dan protes bila ada yang aneh.</p>
      <p><strong>Kapan memakai:</strong> Mulai dari pre (akar masalah); post-processing bila model sudah jadi dan terkunci. SHAP selalu untuk model klinis — dokter berhak tahu “kenapa”.</p>
      <div className="callout callout-warning"><strong>Batasan SHAP:</strong> menjelaskan model, bukan kebenaran kausal. Fitur penting di SHAP bisa jadi proksi bias (mis. “kode pos” sebagai proksi etnis/ekonomi). Explainability membantu menemukan bias — bukan sertifikat keadilan.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Mengaudit Label — Sumber Bias Paling Sunyi</h2>
      <details className="worked">
        <summary>📐 Worked example: audit label “biaya” sebagai proksi “kebutuhan” (klik untuk buka)</summary>
        <p>Model prioritas perawatan memprediksi <strong>biaya tahun depan</strong> (label Y). Data: 50.000 pasien, dua grup — A (mayoritas, akses baik) dan B (minoritas, akses terhambat).</p>
        <p><strong>Langkah 1 — Ukur disparitas outcome.</strong> Pada skor risiko yang sama (desil 8), pasien grup B punya <strong>26% lebih banyak kondisi kronis aktif</strong> (diukur dari biomarker/lab — <em>bukan</em> dari biaya) dibanding grup A. Artinya: label “biaya” <em>meremehkan</em> kebutuhan grup B secara sistematis.</p>
        <p><strong>Langkah 2 — Kuantifikasi dampak alokasi.</strong> Threshold program hanya menampung 10% populasi. Dengan label biaya, grup B mendapat <strong>17% lebih sedikit</strong> slot dibanding jika labelnya “beban penyakit aktual”. Ribuan pasien yang lebih sakit tersingkir oleh definisi label.</p>
        <p><strong>Langkah 3 — Ganti label, ukur ulang.</strong> Latih ulang dengan label <strong>jumlah kondisi kronis aktif</strong> (proksi kebutuhan yang lebih jujur): disparitas alokasi menyusut ke &lt;3%, tanpa penurunan akurasi klinis yang berarti. <strong>Memperbaiki label &gt; memperbaiki model.</strong></p>
        <p><strong>Langkah 4 — Audit metrik fairness.</strong> Cek <em>equal opportunity</em> (TPR per grup pada threshold operasional) dan <em>calibration within groups</em> (apakah skor 0,7 berarti risiko sama untuk kedua grup?). Model yang terkalibrasi global bisa <strong>miskalibrasi per grup</strong> — selalu audit per grup.</p>
        <p><strong>Pelajaran:</strong> 90% masalah fairness lahir di <strong>definisi label</strong>, bukan di arsitektur model. Audit label dulu — sebelum menyentuh hyperparameter.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — trade-off fairness tidak bisa dihindari, tapi bisa dipilih:</strong> Teorema impossibility (Chouldechova, Kleinberg) membuktikan: <em>equalized odds</em>, <em>calibration per grup</em>, dan <em>base rate berbeda</em> tidak bisa dipenuhi bersamaan. Jadi jangan cari metrik “yang benar” — <strong>pilih dengan sadar</strong>: untuk <em>skrining</em> (biaya miss = kematian), prioritaskan equal opportunity/TPR; untuk <em>alokasi sumber daya langka</em>, pertimbangkan calibration per grup agar skor berarti sama untuk semua. Dokumentasikan pilihanmu dan alasannya — itulah yang akan ditanya regulator dan jurnalis.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — model RS Jakarta vs puskesmas Papua:</strong> Model rujukan yang dilatih di RS swasta Jakarta (pasien mampu, alat lengkap, kode rapi) lalu dipakai di puskesmas Papua menghadapi <strong>tiga jurang</strong>: (1) <strong>pergeseran distribusi</strong> — pola penyakit dan ketersediaan pemeriksaan beda; (2) <strong>label bias</strong> — “biaya” di Jakarta mencerminkan daya beli, bukan kebutuhan; (3) <strong>fitur hilang</strong> — pemeriksaan yang jadi fitur andalan model tidak tersedia di puskesmas. Hasilnya bukan sekadar “akurasi turun” — melainkan <strong>model yang sistematis merugikan yang paling rentan</strong>. Aturan praktis: setiap deployment lintas-faskes wajib <strong>re-validasi per populasi</strong> dengan metrik fairness, bukan cuma AUC global.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Kapan Trade-off Fairness Nyata (dan Kapan Palsu)</h2>
      <p>“Fairness vs akurasi” sering dibingkai sebagai trade-off yang tak terhindarkan. Kenyataannya: <strong>kadang nyata, kadang palsu</strong> — dan membedakannya menghemat banyak perdebatan sia-sia.</p>
      <p><strong>Trade-off PALSU (bias yang bisa diperbaiki gratis):</strong> model tidak adil <em>karena</em> data buruk — label bias, representasi timpang, fitur proxy yang ceroboh. Memperbaiki label (biaya → kebutuhan klinis, lihat Pendalaman) <strong>menaikkan fairness DAN akurasi klinis sekaligus</strong>. Sebagian besar “trade-off” yang dilaporkan di industri sebenarnya <strong>kemalasan diagnosis</strong>: mereka mengorbankan fairness alih-alih memperbaiki data. Aturan: <strong>selalu perbaiki data dulu</strong>; hanya jika gap bertahan setelah data terbaik, bicarakan trade-off.</p>
      <p><strong>Trade-off NYATA (teorema impossibility):</strong> ketika base rate <em>benar-benar berbeda</em> antar grup (mis. prevalensi penyakit memang lebih tinggi di satu grup), tiga hal tidak bisa dipenuhi bersamaan: (1) <em>equalized odds</em> (TPR &amp; FPR sama), (2) <em>kalibrasi per grup</em> (skor berarti sama), (3) <em>prediksi berguna</em>. Bukti matematikanya (Chouldechova 2017, Kleinberg 2016) memaksa <strong>pilihan nilai</strong>: untuk <em>skrining penyakit mematikan</em>, pilih equal opportunity (jangan lewatkan yang sakit di grup manapun) — terima miskalibrasi; untuk <em>alokasi bantuan terbatas</em>, pilih kalibrasi per grup (skor harus berarti sama) — terima gap TPR. <strong>Tidak ada jawaban teknis; hanya ada keputusan etis yang didokumentasikan.</strong></p>
      <p><strong>Jebakan “fairness through blindness”:</strong> menghapus kolom ras/gender dari fitur <strong>tidak</strong> membuat model adil — informasi grup <em>bocor</em> lewat proxy (kode pos, nama, bahasa). Model “buta” justru <strong>tidak bisa diaudit</strong> (kamu tidak tahu grup siapa-siapa) dan <strong>tidak bisa dikoreksi</strong> (threshold per grup mustahil). Paradoksnya: <strong>untuk keadilan, kamu butuh melihat atribut sensitif</strong> — saat evaluasi dan mitigasi, dengan tata kelola privasi ketat (lihat HD18).</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> urutan kerja fairness: ① perbaiki data &amp; label (gratis), ② pilih metrik sesuai keputusan klinis (sadar), ③ mitigasi &amp; verifikasi (terukur), ④ dokumentasikan trade-off yang tersisa (jujur). — Lewati ① dan kamu membayar mahal untuk masalah yang sebenarnya gratis diperbaiki.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Menghapus variabel sensitif (etnis, gender) membuat model adil&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Justru sebaliknya seringnya: model mempelajari proksi (kode pos, nama, bahasa) yang berkorelasi dengan variabel sensitif — kini tanpa bisa diaudit per grup karena grupnya “tidak ada”. Fairness butuh mengukur per grup, yang butuh datanya. “Buta” ≠ “adil”.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Fairness hanya soal etnis/gender&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Di Indonesia, disparitas paling tajam sering berbentuk <strong>wilayah dan kelas faskes</strong>: model Jakarta vs Papua, RS swasta vs puskesmas. Audit fairness harus mencakup dimensi yang relevan lokal — bukan template AS.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Trade-off akurasi vs fairness selalu besar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Pada banyak kasus nyata, mitigasi menurunkan AUC &lt; 0,02 sambil memangkas disparitas drastis. Trade-off besar biasanya tanda masalahnya di label/data (pre-processing) — perbaiki akarnya, bukan terima trade-off-nya.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Audit Fairness Model Rujukan</h2>
      <details className="worked">
        <summary>📐 Worked example: menghitung disparitas dari tabel 2×2 per grup (klik untuk buka)</summary>
        <p>Model memprediksi “butuh rujukan spesialis” (ya/tidak). Evaluasi pada 2.000 pasien: Grup A (1.200, perkotaan) dan Grup B (800, pedesaan). Threshold operasional 0,5.</p>
        <p><strong>Langkah 1 — Tabel per grup.</strong> Grup A: TP=180, FN=60, FP=120, TN=840. Grup B: TP=90, FN=90, FP=60, TN=560.</p>
        <p><strong>Langkah 2 — Hitung metrik per grup.</strong> TPR (sensitivitas) A = 180/240 = <strong>75%</strong>; TPR B = 90/180 = <strong>50%</strong>. FPR A = 120/960 = 12,5%; FPR B = 60/620 = 9,7%. <strong>Kesenjangan TPR = 25 poin</strong> — model melewatkan separuh pasien Grup B yang butuh rujukan, vs seperempat di Grup A.</p>
        <p><strong>Langkah 3 — Diagnosis penyebab.</strong> Cek representasi training: Grup B hanya 15% data latih → model kurang belajar pola B. Cek label: “butuh rujukan” didefinisikan dari <em>rujukan yang benar-benar terjadi</em> — dan pasien B yang butuh rujukan <strong>lebih jarang dirujuk</strong> (akses!) → label B <em>under-ascertained</em>. Dua pintu bias sekaligus: <strong>representasi + label</strong>.</p>
        <p><strong>Langkah 4 — Mitigasi bertahap.</strong> (a) Perbaiki label: definisikan ulang “butuh” dari <em>kriteria klinis</em> (skor keparahan), bukan dari <em>rujukan historis</em>. (b) Tambah data B / bobot ulang. (c) Threshold per grup: turunkan threshold B hingga TPR B ≈ TPR A (equal opportunity) — dengan harga: FPR B naik. <strong>Tidak ada mitigasi gratis</strong>; pilih trade-off secara eksplisit.</p>
        <p><strong>Langkah 5 — Verifikasi pasca-mitigasi.</strong> Setelah label klinis + threshold disesuaikan: TPR A=74%, TPR B=72% (gap 2 poin ✓); kalibrasi per grup dicek — skor 0,6 berarti risiko sama di kedua grup ✓. <strong>Dokumentasikan</strong>: metrik sebelum–sesudah, keputusan threshold, dan sisa gap yang diakui.</p>
        <p><strong>Pelajaran:</strong> audit fairness = <strong>tabel 2×2 per grup + diagnosis penyebab + mitigasi + verifikasi</strong>. Empat langkah ini adalah standar minimum sebelum model menyentuh pasien.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu audit <strong>sebelum</strong> deploy — bukan setelah komplain. “Kami akan pantau setelah launch” untuk fairness = <strong>membiarkan pasien menjadi kelinci percobaan</strong> ketidakadilan modelmu.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Audit fairness <strong>sebelum</strong> optimasi akurasi. Menemukan bias setelah deploy = skandal; menemukannya saat development = engineering.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu tampilkan metrik <strong>per grup</strong> di dashboard monitoring, bukan cuma agregat. Agregat menyembunyikan penderitaan minoritas — secara matematis.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Libatkan <strong>komunitas yang terdampak</strong> dalam menentukan metrik fairness. Pilihan metrik adalah pilihan nilai — bukan keputusan teknis semata.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Audit Disparitas Model Rujukan</h2>
      <p>Model memprediksi butuh-rujukan. Hitung TPR, FPR, PPV per grup (kota vs timur). Buktikan agregat menipu.</p>
      <PyodideLab
        title="🔬 Lab 1: Audit Disparitas Model Rujukan"
        hint="Ubah threshold 0.5 → 0.3. Perhatikan disparitas TPR berubah — threshold netral tidak netral dampaknya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Threshold per Grup — Menyamakan TPR</h2>
      <p>Cari threshold per grup agar TPR setara (equalized odds). Lihat harga yang dibayar (FPR naik di satu grup) — trade-off impossibility secara langsung.</p>
      <PyodideLab
        title="🔬 Lab 2: Threshold per Grup — Menyamakan TPR"
        hint="Inilah dilema nyata: keadilan (TPR setara) vs efisiensi (FPR rendah). Tidak ada jawaban teknis — ini keputusan nilai. Diskusikan dengan klinisi, jangan putuskan sendiri."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Disparitas Jawa vs Luar Jawa dalam Model</h2>
      <p>Indonesia punya <strong>kesenjangan struktural</strong> yang menjadi “bahan bakar” bias model: 60% dokter spesialis di Jawa, alat diagnostik canggih menumpuk di kota besar, dan kualitas EHR berkorelasi dengan <strong>kemampuan RS</strong> — bukan kebutuhan pasien.</p>
      <p><strong>Skenario nyata:</strong> model prediksi risiko komplikasi kehamilan dilatih di 3 RS pendidikan Jawa (data rapi, USG rutin, lab lengkap). Diuji di RSUD luar Jawa: (1) <strong>fitur hilang massal</strong> — USG tidak rutin → kolom kosong 70%; (2) <strong>label bias</strong> — “komplikasi tercatat” lebih rendah bukan karena lebih sehat, melainkan karena <strong>tidak terdeteksi</strong> (tanpa USG, preeklampsia ringan lolos); (3) <strong>base rate beda</strong> — anemia &amp; KEK lebih tinggi → risiko dasar memang lebih tinggi.</p>
      <p><strong>Hasil tanpa mitigasi:</strong> model <em>underestimate</em> risiko ibu di luar Jawa secara sistematis — kelompok yang <strong>paling butuh</strong> justru paling <strong>diremehkan</strong>. Ini bukan bug teknis; ini <strong>ketidakadilan yang diotomatisasi</strong>.</p>
      <p><strong>Paket mitigasi Indonesia:</strong> (1) <strong>Desain fitur untuk setting terendah</strong> — model “versi puskesmas” (fitur: anamnesis + pemeriksaan fisik + Hb) terpisah dari “versi RS” (fitur: + USG + lab). (2) <strong>Validasi per wilayah</strong> — metrik fairness dihitung per provinsi/tipe faskes, bukan nasional saja. (3) <strong>Label yang tidak menghukum keterbatasan</strong> — definisikan outcome dari <em>kriteria klinis yang bisa diobservasi di semua setting</em>, bukan dari <em>diagnosis yang butuh alat mahal</em>. (4) <strong>Monitoring disparitas pasca-deploy</strong> — dashboard TPR per wilayah, tiap bulan.</p>
      <div className="tip">
        <p><strong>💡 Intuisi keadilan Indonesia:</strong> pertanyaan fairness lokal bukan “apakah model adil untuk ras X vs Y” (konteks AS), melainkan <strong>“apakah model adil untuk PBI vs umum, Jawa vs luar Jawa, RS vs puskesmas?”</strong> — Definisikan grup yang relevan dengan <em>struktur ketidakadilan Indonesia</em>, bukan impor definisi dari paper luar.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Dugaan bias label → Ganti proksi (pre-processing)</h3>
        <p><strong>Kondisi:</strong> Label membawa sejarah (biaya, persetujuan, kunjungan).</p>
        <p><strong>Kenapa:</strong> Akar masalah; tidak ada metrik yang memperbaiki label salah.</p>
        <p><strong>Contoh nyata:</strong> Biaya → kebutuhan klinis terukur (HbA1c, skor keparahan).</p>
      </div>
      <div className="decision-card">
        <h3>2. Training tidak mewakili → Tambah data + reweight</h3>
        <p><strong>Kondisi:</strong> Grup minoritas kecil di training.</p>
        <p><strong>Kenapa:</strong> Model buta pada yang jarang dilihat.</p>
        <p><strong>Contoh nyata:</strong> Oversampling puskesmas timur; reweight per wilayah.</p>
      </div>
      <div className="decision-card">
        <h3>3. Model terkunci, disparitas ada → Threshold per grup</h3>
        <p><strong>Kondisi:</strong> Tidak bisa retraining (vendor, regulasi).</p>
      <PlotlyChart
        data={hd13ThrData}
        title="Harga Keadilan: Disparitas Turun, AUC Hampir Tetap"
        layout={hd13ThrDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang warna = disparitas TPR antar grup (kiri vs kanan strategi). Abu-abu (sumbu kanan) = AUC keseluruhan.</p>
        <p><strong>Interpretasi:</strong> Threshold per grup memangkas disparitas 25% → 4% dengan AUC turun hanya 0,01. Trade-off akurasi-vs-fairness sering kecil — alasan “nanti akurasi turun” biasanya mitos untuk menunda audit.</p>
      </div>
        <p><strong>Kenapa:</strong> Post-processing: samakan TPR/FPR via threshold berbeda.</p>
        <p><strong>Contoh nyata:</strong> Threshold rujukan lebih rendah untuk wilayah timur.</p>
      </div>
      <div className="decision-card">
        <h3>4. Dokter harus percaya &amp; bisa protes → SHAP + dokumentasi</h3>
        <p><strong>Kondisi:</strong> Model dipakai dalam keputusan klinis.</p>
        <p><strong>Kenapa:</strong> Contestability: yang terdampak bisa mempertanyakan alasan.</p>
        <p><strong>Contoh nyata:</strong> Tampilkan 3 alasan utama tiap skor rujukan di dashboard.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Audit 4 pintu bias sebelum metrik.</li>
          <li>Ukur per grup; agregat menipu.</li>
          <li>Pilih metrik sesuai misi klinis; nyatakan trade-off.</li>
          <li>SHAP untuk transparansi, bukan sertifikat adil.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Skor Prioritas Vaksin: Siapa Didahulukan?</h2>
      <div className="callout">
        <p>Dinkes memakai skor AI untuk prioritas vaksin saat stok terbatas. Auditmu: TPR lansia 85%, TPR difabel 55% — difabel yang berisiko tinggi lebih sering terlewat. Vendor berdalih: “AUC keseluruhan 0,87, sudah bagus.”</p>
      <p>Akar: fitur mobilitas (langkah harian dari data) tidak tersedia untuk difabel → model mengandalkan proksi yang bias.</p>
        <p><strong>Pertanyaan:</strong> Susun rekomendasi 4 langkah: diagnosis, mitigasi, komunikasi, monitoring.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Diagnosis: disparitas TPR 30 poin = kegagalan equalized odds; akar di fitur (bukan label) — data mobilitas tak representatif untuk difabel. (2) Mitigasi: tambah fitur yang adil untuk difabel (komorbid, usia) + threshold per grup sementara + retraining dengan data difabel. (3) Komunikasi ke Dinkes: jelaskan dengan angka per grup, bukan AUC; nyatakan trade-off (menaikkan TPR difabel menaikkan FPR sedikit). (4) Monitoring: dashboard TPR per grup disabilitas/usia/wilayah bulanan + jalur protes. Tolak argumen “AUC bagus” — AUC agregat adalah tempat bersembunyi disparitas.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kasus Science 2019: model memakai BIAYA sebagai proksi KEBUTUHAN. Ini bias…"
        options={["Data",
          "Label",
          "Representasi",
          "Deployment"]}
        correct={1}
        explanation="Benar: labelnya yang membawa sejarah ketidakadilan. Algoritmanya “benar” memprediksi label yang salah konsep."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Menghapus variabel etnis dari fitur membuat model adil. Benar/salah?"
        options={["Benar",
          "Salah — proksi (kode pos, nama) tetap membawa info itu, kini tanpa bisa diaudit",
          "Tergantung",
          "Hanya untuk data kecil"]}
        correct={1}
        explanation="Benar: kebutaan ≠ keadilan. Fairness butuh pengukuran per grup."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Base rate beda antar grup. Yang BENAR tentang metrik fairness?"
        options={["Semua metrik bisa dipenuhi bersamaan",
          "Demographic parity + equalized odds + kalibrasi tak bisa bersamaan (impossibility) — pilih sesuai misi",
          "Cukup pakai akurasi",
          "Tidak ada metrik yang valid"]}
        correct={1}
        explanation="Benar: teorema impossibility. Pilih metrik sesuai nilai klinis dan nyatakan trade-off eksplisit."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Untuk alokasi perawatan yang adil, metrik paling relevan?"
        options={["Demographic parity",
          "Equalized odds (TPR/FPR setara) — kesempatan terdeteksi sama",
          "Akurasi agregat",
          "Ukuran model"]}
        correct={1}
        explanation="Benar: yang penting adalah yang benar-benar butuh punya peluang sama tertangkap, bukan tingkat rujukan sama."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. SHAP pada model klinis berguna untuk…"
        options={["Membuktikan model adil",
          "Transparansi & contestability — klinisi bisa melihat alasan dan protes",
          "Mengganti validasi",
          "Menambah akurasi"]}
        correct={1}
        explanation="Benar: SHAP menjelaskan model, bukan mensertifikasi keadilan. Fitur penting bisa jadi proksi bias."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Di Indonesia, dimensi fairness yang sering paling tajam?"
        options={["Hanya etnis",
          "Wilayah & kelas faskes (model Jakarta vs Papua, swasta vs puskesmas)",
          "Hanya gender",
          "Tidak ada disparitas"]}
        correct={1}
        explanation="Benar: audit harus relevan lokal. Template AS tidak otomatis cocok — ukur yang benar-benar timpang di sini."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Empat pintu bias: <strong>data, label, representasi, deployment</strong> — audit berurutan.</li>
          <li>Kasus klasik: <strong>proksi label</strong> (biaya ≠ kebutuhan) membawa sejarah ke model.</li>
          <li>Metrik: <strong>parity, equalized odds, kalibrasi per grup</strong> — tak bisa semua (impossibility).</li>
          <li>Ukur <strong>per grup</strong>; agregat menyembunyikan disparitas.</li>
          <li>Mitigasi: <strong>pre</strong> (label/data) &gt; <strong>in</strong> (constraint) &gt; <strong>post</strong> (threshold).</li>
          <li><strong>SHAP</strong> untuk transparansi &amp; contestability, bukan sertifikat adil.</li>
          <li>“Buta” ≠ adil. Dimensi lokal (wilayah, kelas faskes) wajib diaudit.</li>
          <li>Trade-off akurasi-fairness sering kecil — jangan jadikan alasan menunda.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd12-prediksi-klinis" className="btn btn-secondary btn-sm">← HD12</Link>
        <Link href="/learn/hd14-nlp-klinis" className="btn btn-primary btn-sm">HD14 →</Link>
      </div>
    </div>
  );
}
