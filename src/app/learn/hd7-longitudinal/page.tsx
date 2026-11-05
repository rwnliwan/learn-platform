"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd7LongitudinalPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd7IccData = [{"x": [1, 2, 3, 4, 5], "y": [150, 148, 152, 149, 151], "type": "scatter", "mode": "lines+markers", "name": "Pasien A", "line": {"color": "#2a7de1"}}, {"x": [1, 2, 3, 4, 5], "y": [110, 112, 109, 111, 110], "type": "scatter", "mode": "lines+markers", "name": "Pasien B", "line": {"color": "#e8a838"}}, {"x": [1, 2, 3, 4, 5], "y": [135, 128, 142, 131, 139], "type": "scatter", "mode": "lines+markers", "name": "Pasien C", "line": {"color": "#94a3b8"}}];
  const hd7IccDataLayout = {"xaxis": {"title": "Kunjungan ke-"}, "yaxis": {"title": "Sistolik (mmHg)"}, "showlegend": true};

  const lab1Code = "import random, statistics as st\nrandom.seed(21)\nn_pasien, m = 50, 8\nsemua_x, semua_y = [], []\nrata = []  # rata-rata per pasien\nfor i in range(n_pasien):\n    u = random.gauss(0, 12)          # efek acak pasien (baseline)\n    obat = 1 if i % 2 == 0 else 0     # acak per pasien\n    ys = [140 + 0*obat + u + random.gauss(0, 5) for _ in range(m)]\n    semua_x += [obat]*m; semua_y += ys\n    rata.append((obat, st.mean(ys)))\n# regresi naif: anggap 400 independen\nmx = st.mean(semua_x)\nb_naif = sum((x-mx)*(y-st.mean(semua_y)) for x, y in zip(semua_x, semua_y))/sum((x-mx)**2 for x in semua_x)\n# agregat per pasien (n=50, pendekatan jujur sederhana)\ng1 = [y for o, y in rata if o == 1]; g0 = [y for o, y in rata if o == 0]\nprint(f'efek sebenarnya: 0 mmHg')\nprint(f'regresi naif (n=400): b = {b_naif:+.2f}  <- terlihat “eksak” tapi menipu')\nprint(f'beda rata2 pasien (n=50): {st.mean(g1)-st.mean(g0):+.2f} mmHg')\nprint()\nprint('Naif memakai n=400 -> SE kekecilan -> mudah “signifikan” palsu.')";

  const lab2Code = "n_total = 1000\nprint(f\"{'ICC':>5} {'m (ukur/pasien)':>16} {'n efektif':>10} {'info baru':>10}\")\nfor icc in [0.1, 0.5, 0.7, 0.9]:\n    for m in [2, 5, 10, 20]:\n        n_eff = n_total / (1 + (m-1)*icc)\n        print(f'{icc:>5} {m:>16} {n_eff:>10.0f} {n_eff/n_total:>9.0%}')\n    print()\nprint('Aturan: ICC tinggi -> tambah pengukuran nyaris tak menambah info.')\nprint('Desain lebih baik: tambah PASIEN, bukan tambah pengukuran.')";

  const hd7NeffData = [{"x": [2, 5, 10, 20], "y": [870, 625, 417, 244], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "ICC=0.1", "text": [870, 625, 417, 244], "textposition": "outside"}, {"x": [2, 5, 10, 20], "y": [526, 270, 137, 55], "type": "bar", "marker": {"color": "#e8a838"}, "name": "ICC=0.7", "text": [526, 270, 137, 55], "textposition": "outside"}];
  const hd7NeffDataLayout = {"barmode": "group", "xaxis": {"title": "Pengukuran per pasien"}, "yaxis": {"title": "n efektif"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD7 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Mixed Models &amp; GEE:<br />Data yang Diukur Berulang</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 1.000 Pengukuran, 100 Pasien</a></li>
          <li><a href="#korelasi">Korelasi Intra-Subjek — Si Kembar dalam Data</a></li>
          <li><a href="#mixed">Linear Mixed Models</a></li>
          <li><a href="#gee">GEE — Si Pragmatis Populasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Regresi Naif vs Rata-rata Subjek</a></li>
          <li><a href="#lab2">🔬 Lab 2: Efek Desain &amp; n Efektif</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Mixed vs GEE</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Korelasi sebagai Informasi</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Kohort Tumbuh Kembang</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: n Efektif — Menakar Saksi Asli</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan mengapa pengukuran berulang <strong>tidak independen</strong> dan apa akibatnya bila diabaikan.</li>
          <li>Membedakan <strong>efek tetap vs efek acak</strong> serta kapan memakai mixed model vs GEE.</li>
          <li>Menafsirkan <strong>ICC</strong> dan menghitung <strong>n efektif</strong> data berklaster.</li>
          <li>Memilih metode yang tepat untuk 4 skenario data longitudinal kesehatan.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 1.000 Pengukuran, 100 Pasien</h2>
      <div className="story">
        <p>Studi tekanan darah: 100 pasien, masing-masing diukur <strong>10 kali</strong> = 1.000 data. Analis junior menjalankan regresi biasa dengan n=1.000, dapat p &lt; 0,001, dan merayakan. Reviewer menolak: “Anda tidak punya 1.000 observasi independen — Anda punya 100 orang yang masing-masing diukur 10 kali. Tekanan darah saya jam 8 dan jam 9 <em>bukan dua orang berbeda</em>.”</p>
      <p>Regresi naif mengira punya 1.000 saksi independen, padahal 10 kesaksian dari orang yang sama saling membenarkan. Hasilnya: standar error kekecilan, keyakinan kebesaran. Lesson ini tentang cara menghitung yang jujur saat data berkelompok.</p>
      <p><strong>Twist-nya:</strong> analis itu tidak salah <em>menghitung</em> — ia salah <em>menghitung saksi</em>. Sepuluh kesaksian dari satu orang dihitung sebagai sepuluh orang — padahal di pengadilan manapun, itu satu saksi yang bicara sepuluh kali. Ironisnya, <strong>makin banyak kamu mengukur orang yang sama, makin yakin analis naif itu — padahal informasi barunya nyaris nol</strong>. Lesson ini mengajarkan cara menakar “kesaksian asli” dalam datamu: n efektif, bukan n mentah.</p>
      </div>

      <h2 id="korelasi">Korelasi Intra-Subjek — Si Kembar dalam Data</h2>
      <p><strong>Definisi.</strong> Pengukuran berulang pada subjek yang sama <strong>berkorelasi</strong>: nilai seseorang cenderung mirip dirinya sendiri dibanding orang lain. <strong>ICC (Intraclass Correlation)</strong> mengukur seberapa besar kemiripan itu (0–1).</p>
      <Tex math={String.raw`ICC = \frac{\sigma^2_{antar}}{\sigma^2_{antar} + \sigma^2_{dalam}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\sigma^2_{antar}`} />: variansi ANTAR subjek (beda orang)</li>
          <li><Tex math={String.raw`\sigma^2_{dalam}`} />: variansi DALAM subjek (fluktuasi pengukuran orang yang sama)</li>
      </ul>
      <p><strong>Interpretasi:</strong> ICC = 0,7 artinya 70% variasi berasal dari perbedaan antar orang — pengukuran satu orang sangat mirip dirinya. Makin tinggi ICC, makin “palsu” n besar dari pengukuran berulang.</p>
      <details className="worked">
        <summary>📐 Contoh: ICC tekanan darah</summary>
        <p>Variansi antar pasien = 140, variansi dalam pasien (antar kunjungan) = 60.<br />ICC = 140/(140+60) = <strong>0,70</strong>.<br />Artinya pengukuran ulang satu pasien 70% mencerminkan “siapa dia”, hanya 30% info baru. n efektif jauh di bawah 1.000 (lihat lab 2).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ICC itu meter kejujuran n: mendekati 1 berarti pengukuran ulang hampir tidak menambah informasi independen; mendekati 0 berarti tiap pengukuran seperti orang baru.</p>
      <p><strong>Kapan memakai:</strong> Langkah pertama SETIAP data longitudinal/berklaster: hitung ICC dulu untuk tahu seberapa parah masalahnya.</p>

      <PlotlyChart
        data={hd7IccData}
        title="Tekanan Darah Sistolik: 3 Pasien × 5 Kunjungan"
        layout={hd7IccDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Tiga garis = tiga pasien, lima titik = lima kunjungan. Perhatikan jarak ANTAR garis vs goyangan DALAM satu garis.</p>
        <p><strong>Interpretasi:</strong> Garis-garis terpisah jauh (beda orang besar) tapi tiap garis relatif datar (fluktuasi kecil) — inilah ICC tinggi secara visual. Regresi naif yang menganggap 15 titik ini independen sedang berhalusinasi punya 15 pasien.</p>
      </div>

      <h2 id="mixed">Linear Mixed Models — Si Adil per Individu</h2>
      <p><strong>Definisi.</strong> <strong>Mixed model</strong> memisahkan <strong>efek tetap</strong> (fixed: efek populasi, mis. pengaruh obat) dari <strong>efek acak</strong> (random: perbedaan baseline tiap subjek/klaster). Tiap subjek boleh punya intersep (bahkan slope) sendiri.</p>
      <Tex math={String.raw`Y_{ij} = \beta_0 + \beta_1 X_{ij} + u_i + \varepsilon_{ij}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`Y_{ij}`} />: pengukuran ke-j pada subjek i</li>
          <li><Tex math={String.raw`\beta_0, \beta_1`} />: efek tetap: intersep &amp; kemiringan populasi</li>
          <li><Tex math={String.raw`u_i`} />: efek acak subjek i: simpangan baseline orang itu dari rata-rata populasi</li>
          <li><Tex math={String.raw`\varepsilon_{ij}`} />: residu pengukuran individual</li>
      </ul>
      <p><strong>Interpretasi:</strong> u_i menangkap “kepribadian” tiap subjek (ada yang tensinya memang tinggi bawaan). β menjawab pertanyaan populasi; u_i memastikan standar error jujur.</p>
      <details className="worked">
        <summary>📐 Contoh: efek obat antihipertensi</summary>
        <p>Model: sistolik_ij = 140 − 8·obat_ij + u_i + ε_ij, dengan SD(u_i) = 12.<br />β_1 = −8: obat menurunkan 8 mmHg <strong>rata-rata populasi</strong>.<br />u_A = +15: pasien A tensinya 15 mmHg di atas rata-rata secara bawaan (efek acak).<br />Tanpa u_i, model mengira 1.000 pengukuran independen → SE kekecilan → p-value palsu signifikan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Mixed model itu guru yang adil: ia menilai kemajuan tiap murid relatif terhadap baseline murid itu sendiri, bukan memukul rata. Efek tetap = kurikulum untuk semua; efek acak = mengakui tiap murid beda titik awal.</p>
      <p><strong>Kapan memakai:</strong> Fokus pada efek individu/subjek, data hierarkis (pasien dalam RS dalam provinsi), atau ingin prediksi per subjek. Butuh asumsi distribusi efek acak (biasanya normal).</p>

      <h2 id="gee">GEE — Si Pragmatis Populasi</h2>
      <p><strong>Definisi.</strong> <strong>GEE (Generalized Estimating Equations)</strong> mengestimasi efek <strong>rata-rata populasi</strong> sambil mengoreksi korelasi intra-subjek via “working correlation” — tanpa memodelkan tiap individu.</p>
      <details className="worked">
        <summary>📐 Contoh: kapan GEE mengalahkan mixed model</summary>
        <p>Program: apakah posyandu menurunkan diare balita (ya/tidak, diukur 6x)?<br /><strong>GEE:</strong> “Rata-rata populasi, peluang diare turun OR=0,7” — jawaban untuk Dinkes.<br /><strong>Mixed model:</strong> “Untuk balita tertentu dengan frailty u_i…” — jawaban untuk dokter anak.<br />Pertanyaan kebijakan → GEE. Pertanyaan individual → mixed.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> GEE itu pragmatis: “Saya tidak peduli tiap orang seperti apa; saya mau jawaban populasi yang SE-nya jujur.” Ia memakai sandwich estimator — roti lapis yang tetap kokoh walau tebakan struktur korelasinya salah.</p>
      <p><strong>Kapan memakai:</strong> Fokus pada efek populasi (kebijakan!), outcome tidak normal (biner/count), atau tidak ingin asumsi distribusi efek acak. Standar untuk uji klinis longitudinal dan surveilans.</p>
      <div className="callout"><strong>Aturan praktis:</strong> efek <strong>populasi</strong> (policy, program) → GEE; efek <strong>subjek-spesifik</strong> atau prediksi individual → mixed model. Untuk data normal dan pertanyaan populasi, keduanya sering memberi β mirip — beda di interpretasi dan asumsi.</div>

      <h2 id="pendalaman">🔍 Pendalaman: n Efektif — Menakar Saksi Asli</h2>
      <details className="worked">
        <summary>📐 Worked example: dari n=1.000 ke n efektif (klik untuk buka)</summary>
        <p>Studi tekanan darah: 100 pasien × 10 pengukuran = 1.000 baris. Korelasi intra-kelas (ICC) tekanan darah antar pengukuran orang yang sama: ρ = 0,7 (tekanan darah orang cenderung stabil).</p>
        <p><strong>Langkah 1 — Efek desain.</strong> Design effect = 1 + (m − 1)ρ = 1 + 9 × 0,7 = <strong>7,3</strong>, dengan m = 10 pengukuran per pasien.</p>
        <p><strong>Langkah 2 — n efektif.</strong> n_efektif = 1.000 / 7,3 ≈ <strong>137</strong>. Bukan 1.000, bukan 100 — melainkan 137 “saksi independen setara”. Sembilan pengukuran tambahan per orang hanya menambah ~37% informasi di atas pengukuran pertama.</p>
        <p><strong>Langkah 3 — Dampak ke standar error.</strong> SE naif ∝ 1/√1000; SE jujur ∝ 1/√137 — artinya SE naif <strong>kekecilan 2,7×</strong>. Interval kepercayaan yang dilaporkan analis junior 2,7× lebih sempit dari seharusnya; p-value “0,001”-nya bisa jadi 0,08 bila dihitung jujur.</p>
        <p><strong>Langkah 4 — Kapan n mentah boleh dipakai.</strong> Hanya bila ρ ≈ 0 (pengukuran dalam orang sama sekali tidak berkorelasi — praktis tidak pernah untuk data fisiologis). Aturan praktis: <strong>selalu laporkan ICC</strong> di studi longitudinal; reviewer yang baik langsung menanyakannya.</p>
        <p><strong>Pelajaran:</strong> “n besar” tanpa ICC adalah klaim kosong. Tanyakan selalu: dari n ini, berapa yang benar-benar independen?</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — mixed model vs GEE: dua filsafat, satu data:</strong> Linear mixed model bertanya “bagaimana <em>rata-rata orang ini</em> berubah?” (efek subjek-spesifik: cocok untuk prediksi pasien individual). GEE bertanya “bagaimana <em>rata-rata populasi</em> berubah?” (efek populasi-rata-rata: cocok untuk kebijakan). Untuk model linear keduanya sama; untuk outcome biner (logit), keduanya <em>berbeda angka</em> — dan banyak analis melaporkan satu padahal butuh yang lain. Sebelum memilih, tulis dulu kalimat keputusanmu: “dokter akan memakai ini untuk pasien <em>ini</em>” → mixed; “Dinkes akan memakai ini untuk <em>populasi</em>” → GEE.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — aplikasi diet “turun 5 kg, p&lt;0,001!”:</strong> Iklan aplikasi kesehatan mengklaim penurunan berat badan signifikan dari data 10.000 pengguna yang menimbang tiap hari selama setahun (3,6 juta timbangan!). Red flag berlapis: (1) <strong>klasterisasi</strong> — 3,6 juta baris dari 10.000 orang dengan ICC berat badan ~0,9 → n efektif jauh lebih kecil; (2) <strong>seleksi</strong> — yang rajin menimbang adalah yang berhasil (survivor bias); (3) <strong>tanpa kontrol</strong> — regresi ke mean menjelaskan sebagian penurunan. Analis yang mengecek ketiga ini dalam 10 menit menghemat perusahaan dari klaim yang bisa dilaporkan ke YLKI.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Korelasi Bukan Gangguan — Ia Informasi</h2>
      <p>Analis pemula melihat korelasi antar-pengukuran sebagai <strong>masalah</strong> (mengacaukan SE). Analis senior melihatnya sebagai <strong>informasi</strong> — bahkan kadang sebagai <em>pertanyaan penelitiannya sendiri</em>.</p>
      <p><strong>Within vs between: dua cerita dalam satu data.</strong> Data longitudinal tekanan darah mengandung dua efek: <strong>within-subject</strong> (“saat <em>saya</em> naik berat badan, tekanan <em>saya</em> naik”) dan <strong>between-subject</strong> (“orang yang <em>rata-rata</em> lebih berat punya tekanan lebih tinggi”). Keduanya bisa <strong>berlawanan arah</strong>! Contoh klasik: dalam individu, olahraga menurunkan tekanan darah (within, negatif); antar individu, yang berolahraga rutin justru… juga negatif — oke contoh yang berlawanan: konsumsi garam harian vs tekanan: within-individu positif kuat, between-individu lemah (karena perbedaan genetik mendominasi). Regresi naif <strong>mencampur</strong> keduanya menjadi satu koefisien Frankenstein. Mixed model dengan <strong>dekomposisi within-between</strong> (person-mean centering) memisahkannya — dan sering menemukan bahwa “efek” yang dilaporkan literatur sebenarnya hanya between, <strong>tidak berlaku</strong> untuk perubahan individu (“dok, kalau saya kurangi garam, tekanan saya turun?” — butuh within!).</p>
      <p><strong>ICC sebagai temuan, bukan sekadar koreksi.</strong> ICC tekanan darah 0,7 bukan cuma “angka untuk koreksi SE” — ia <strong>temuan substantif</strong>: “tekanan darah adalah sifat orang yang stabil”. ICC kepatuhan minum obat 0,3 = “kepatuhan fluktuatif, tergantung keadaan”. Untuk perancang intervensi, ICC menjawab: <strong>targetkan orangnya atau momennya?</strong> ICC tinggi → intervensi personal (orangnya yang “begitu”); ICC rendah → intervensi situasional (ingatkan di momen yang tepat).</p>
      <p><strong>Jebakan ecological fallacy longitudinal:</strong> “negara dengan konsumsi garam tinggi punya hipertensi tinggi” (between-negara) <strong>tidak</strong> membuktikan “mengurangi garam menurunkan tekananmu” (within-individu). Setiap kali melompat level — individu ↔ kelompok ↔ negara — tanyakan: <strong>“efek di level mana yang aku ukur, dan keputusan di level mana yang akan diambil?”</strong></p>
      <div className="callout">
        <p><strong>Prinsip:</strong> data longitudinal bukan “data cross-sectional yang berulang” — ia adalah <strong>film</strong>, bukan <strong>kumpulan foto</strong>. Analisis yang mengabaikan alur waktu (dan korelasinya) sedang menonton film sebagai slideshow acak.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Pengukuran berulang = n besar = power besar, selalu menguntungkan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Power naik, tapi tidak sebesar yang dikira n mentah — n efektif = n/(1+(m−1)×ICC). Dengan ICC 0,7 dan 10 pengukuran, 1.000 data hanya setara ~150 independen. Yang lebih berbahaya: analisis naif memberi SE palsu kecil → temuan palsu signifikan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Mixed model dan GEE selalu memberi jawaban sama&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Untuk outcome linear dan pertanyaan populasi, sering mirip. Untuk outcome biner, koefisien mixed (subjek-spesifik) dan GEE (populasi) punya <em>interpretasi berbeda</em> dan nilainya bisa jauh beda (non-collapsibility OR). Pilih berdasarkan pertanyaan, bukan kebiasaan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cukup tambahkan ID pasien sebagai variabel dummy (fixed effect)&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Itu menghabiskan 99 derajat bebas untuk 100 pasien, tidak bisa generalisasi ke pasien baru, dan gagal untuk klaster bertingkat. Efek acak (random) justru dirancang untuk ini: hemat parameter + generalisasi ke populasi klaster.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Mixed Model vs GEE — Dua Pertanyaan, Dua Jawaban</h2>
      <details className="worked">
        <summary>📐 Worked example: efek obat tekanan darah — untuk siapa angkanya? (klik untuk buka)</summary>
        <p>Data: 200 pasien hipertensi, tekanan darah sistolik diukur tiap bulan selama 6 bulan. Intervensi: obat baru vs standar. Model: logit untuk “terkontrol (&lt;140 mmHg)” — di sinilah mixed dan GEE <strong>berbeda angka</strong>.</p>
        <p><strong>Langkah 1 — Mixed model (subjek-spesifik).</strong> Model: logit(P<sub>it</sub>) = β<sub>0</sub> + β<sub>1</sub>·obat + u<sub>i</sub>, dengan u<sub>i</sub> efek acak per pasien. Hasil: OR = <strong>2,8</strong>. Artinya: “untuk <em>pasien tertentu</em>, peluang terkontrol dengan obat baru 2,8× dibanding jika pasien <em>yang sama</em> memakai standar.” — Bahasa <strong>dokter</strong>: “untuk pasien di depan saya, obat ini…”</p>
        <p><strong>Langkah 2 — GEE (populasi-rata-rata).</strong> Hasil: OR = <strong>2,1</strong>. Artinya: “<em>rata-rata populasi</em> pengguna obat baru punya odds terkontrol 2,1× populasi standar.” — Bahasa <strong>Dinkes</strong>: “jika 10.000 pasien beralih, berapa yang terkontrol?”</p>
        <p><strong>Langkah 3 — Kenapa beda (dan keduanya benar).</strong> Pada model non-linear (logit), rata-rata dari efek individual ≠ efek pada rata-rata — <strong>ketidaksetaraan Jensen</strong>. OR mixed (2,8) selalu <em>lebih jauh dari 1</em> dibanding OR GEE (2,1). Bukan salah satu yang salah — mereka menjawab <strong>pertanyaan berbeda</strong>.</p>
        <p><strong>Langkah 4 — Pilih sesuai keputusan.</strong> Dokter meresepkan untuk <em>individu</em> → laporkan mixed (subjek-spesifik). Dinkes merencanakan untuk <em>populasi</em> → laporkan GEE. <strong>Kesalahan fatal:</strong> melaporkan OR mixed (2,8) ke Dinkes untuk proyeksi populasi — melebih-lebihkan dampak program 33%.</p>
        <p><strong>Langkah 5 — Catatan untuk outcome kontinu.</strong> Pada model <em>linear</em> (tekanan darah sebagai angka), mixed dan GEE memberi <strong>koefisien identik</strong> — perbedaan hanya muncul di model non-linear (logit, Poisson). Jadi: cek dulu jenis modelmu sebelum panik memilih.</p>
        <p><strong>Pelajaran:</strong> sebelum memilih mixed vs GEE, tulis kalimat keputusanmu: <strong>“siapa yang akan memakai angka ini untuk apa?”</strong> — Jawabannya memilihkan model untukmu.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Kebanyakan tutorial mengajarkan mixed <em>atau</em> GEE sebagai “cara benar”. Profesional mengajarkan <strong>keduanya sebagai jawaban untuk dua pertanyaan berbeda</strong> — dan bisa menjelaskan bedanya dalam 2 kalimat ke dokter.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Urutkan kerja: <strong>plot dulu</strong> (spaghetti plot per subjek) → <strong>hitung ICC</strong> → baru pilih model. Plot 3 pasien di chart atas sudah memberi tahu ICC tinggi sebelum satu baris kode model.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Tanya <strong>“efek untuk siapa?”</strong> sebelum pilih: rata-rata populasi (GEE) vs individu spesifik (mixed). Kebanyakan keputusan kesehatan masyarakat = populasi = GEE.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Waspadai <strong>missing tidak acak</strong> pada longitudinal: pasien yang memburuk berhenti kontrol (lihat HD8). Mixed model tahan terhadap MAR; GEE standar butuh MCAR kecuali dibobot (IPW).</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Regresi Naif vs Kebenaran Berklaster</h2>
      <p>Bangkitkan data 50 pasien × 8 kunjungan dengan efek obat NOL. Jalankan regresi naif (abaikan klaster) vs agregat per pasien. Lihat berapa sering regresi naif “menemukan” efek palsu.</p>
      <PyodideLab
        title="🔬 Lab 1: Regresi Naif vs Kebenaran Berklaster"
        hint="Jalankan beberapa kali (seed berbeda). Hitung: dari 20 ulangan, berapa kali p naif < 0.05 padahal efek sebenarnya NOL? Itulah harga mengabaikan korelasi."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: n Efektif — Berapa Saksi Aslimu?</h2>
      <p>Hitung n efektif = n / (1 + (m-1)×ICC) untuk berbagai ICC dan jumlah pengukuran. Lihat kapan menambah pengukuran sudah tidak worth it.</p>
      <PyodideLab
        title="🔬 Lab 2: n Efektif — Berapa Saksi Aslimu?"
        hint="Coba ICC=0.9 (pengukuran sangat mirip). Berapa n efektif dari 1.000 data? Sekarang ICC=0.1. Pelajaran: redundansi membunuh nilai tambah pengukuran ulang."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Kohort Tumbuh Kembang — Mengejar Stunting</h2>
      <p>Indonesia menjalankan berbagai <strong>kohort tumbuh kembang anak</strong> (mis. studi longitudinal 1.000 Hari Pertama Kehidupan): anak diukur berkala — berat, tinggi, lingkar kepala, asupan — dari lahir hingga 5 tahun. Tujuannya: memahami <strong>kapan</strong> stunting dimulai dan <strong>intervensi apa</strong> yang memutusnya. Ini laboratorium longitudinal yang sempurna — dan penuh jebakan HD7.</p>
      <p><strong>Jebakan 1 — Pengukuran tak beraturan &amp; informatif.</strong> Anak sakit ditimbang lebih sering (kunjungan posyandu + puskesmas); anak sehat hanya saat posyandu. Rata-rata “berat badan per anak” naif <strong>bias ke periode sakit</strong>. Solusi: model mixed dengan waktu sebagai prediktor + bobot inverse-probability untuk frekuensi kunjungan.</p>
      <p><strong>Jebakan 2 — Within vs between yang menentukan kebijakan.</strong> Temuan between: “desa dengan rata-rata asupan protein tinggi punya stunting rendah” → godaan kebijakan: “bagi-bagi telur ke semua desa”. Temuan within (yang benar-benar dibutuhkan): “<em>anak yang</em> asupannya membaik, <em>pertumbuhannya</em> mengejar” — butuh dekomposisi within-between. Jika efeknya hanya between (perbedaan antar-desa karena sanitasi/air, bukan telur), program telur <strong>gagal</strong> walau korelasinya cantik.</p>
      <p><strong>Jebakan 3 — Regresi ke mean pada “catch-up growth”.</strong> Anak yang terukur sangat pendek di bulan ke-6 cenderung “mengejar” di bulan ke-12 — <strong>sebagian</strong> adalah regresi ke mean statistik (pengukuran ekstrem cenderung kembali), bukan efek intervensi. Tanpa kelompok pembanding, setiap program mengklaim “catch-up” yang sebenarnya <strong>ilusi statistik</strong>.</p>
      <p><strong>Desain yang benar:</strong> stepped-wedge cluster RCT (kecamatan diacak <em>bertahap</em> menerima intervensi — etis karena semua akhirnya dapat) + mixed model + dekomposisi within-between + analisis sensitivitas missing data (HD8). Inilah <strong>paket lengkap analis longitudinal Indonesia</strong> — dan langka yang menguasainya.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Stunting adalah masalah <strong>akumulasi waktu</strong> — tidak bisa dipahami dari satu potret. Setiap analis stunting yang hanya memakai data cross-sectional sedang <strong>menilai film dari satu frame</strong>. Tuntut data longitudinal; analisis dengan hormat pada waktunya.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Efek rata-rata populasi, outcome apapun → GEE</h3>
        <p><strong>Kondisi:</strong> Pertanyaan kebijakan/program; tidak butuh prediksi individual.</p>
        <p><strong>Kenapa:</strong> Robust terhadap salah spesifikasi korelasi (sandwich SE); natural untuk biner/count.</p>
        <p><strong>Contoh nyata:</strong> Efek program posyandu terhadap diare balita (biner, 6 pengukuran).</p>
      </div>
      <div className="decision-card">
        <h3>2. Butuh prediksi/efek per subjek atau klaster bertingkat → Mixed model</h3>
        <p><strong>Kondisi:</strong> Pertanyaan individual atau hierarki (pasien &lt; RS &lt; provinsi).</p>
      <PlotlyChart
        data={hd7NeffData}
        title="n Efektif dari 1.000 Pengukuran (50 pasien)"
        layout={hd7NeffDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu X = berapa kali tiap pasien diukur. Biru = ICC rendah (0,1), kuning = ICC tinggi (0,7). Tinggi batang = n efektif.</p>
        <p><strong>Interpretasi:</strong> Dengan ICC 0,7, menaikkan pengukuran dari 2 ke 20 (10x biaya!) hanya menaikkan n efektif dari 526 ke 55?? — tunggu, justru TURUN relatif karena n total tetap 1.000 (pasien berkurang). Pelajaran desain: pada ICC tinggi, uang paling baik dibelanjakan untuk <strong>menambah pasien</strong>, bukan menambah pengukuran.</p>
      </div>
        <p><strong>Kenapa:</strong> Efek acak menangkap heterogenitas tiap level; bisa prediksi untuk subjek baru.</p>
        <p><strong>Contoh nyata:</strong> Prediksi tekanan darah pasien spesifik; variasi antar RS.</p>
      </div>
      <div className="decision-card">
        <h3>3. Hanya 2 waktu (pre-post) → ANCOVA / change score</h3>
        <p><strong>Kondisi:</strong> Desain sebelum-sesudah sederhana.</p>
        <p><strong>Kenapa:</strong> Mixed model overkill; ANCOVA (kontrol baseline) paling powerful.</p>
        <p><strong>Contoh nyata:</strong> Tekanan darah sebelum vs sesudah 3 bulan obat.</p>
      </div>
      <div className="decision-card">
        <h3>4. Tren waktu per individu → Random slope mixed model</h3>
        <p><strong>Kondisi:</strong> Tidak hanya baseline beda, kecepatan perubahan pun beda antar subjek.</p>
        <p><strong>Kenapa:</strong> Random intercept saja meremehkan heterogenitas tren.</p>
        <p><strong>Contoh nyata:</strong> Laju penurunan eGFR (ginjal) tiap pasien CKD berbeda.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Plot spaghetti dulu, hitung ICC, baru pilih model.</li>
          <li>Populasi → GEE; individu → mixed.</li>
          <li>ICC tinggi → tambah pasien, bukan pengukuran.</li>
          <li>Missing longitudinal jarang MCAR — cek polanya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Aplikasi Diet: “Turun 5 kg, p&lt;0,001!”</h2>
      <div className="callout">
        <p>Startup aplikasi diet mengklaim: 2.000 pengguna, berat ditimbang tiap minggu selama 12 minggu (24.000 data), rata-rata turun <strong>5 kg, p &lt; 0,001</strong> (uji-t biasa pada 24.000 data). Investor tertarik.</p>
      <p>Kamu audit: 40% pengguna berhenti menimbang setelah minggu ke-4 (kemungkinan yang gagal), analisis memakai semua titik tanpa koreksi klaster, tanpa kelompok kontrol.</p>
        <p><strong>Pertanyaan:</strong> Sebutkan minimal 3 cacat analisis dan apa analisis yang benar.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) n palsu: 24.000 titik dari 2.000 orang diperlakukan independen → SE kekecilan, p-value tidak valid (butuh mixed/GEE). (2) Drop-out informatif: yang berhenti kemungkinan gagal — analisis completers melebih-lebihkan (bias seleksi; butuh asumsi MAR + sensitivitas MNAR, lihat HD8). (3) Tanpa kontrol: penurunan bisa regresi ke mean atau musiman, bukan efek aplikasi. Analisis benar: mixed model/GEE dengan semua data (bukan completers saja), laporkan n efektif, dan — untuk klaim kausal — butuh pembanding. p&lt;0,001 dari n palsu adalah angka hiburan, bukan bukti.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. 100 pasien × 10 pengukuran dianalisis dengan regresi biasa (n=1.000). Masalah utama?"
        options={["Tidak ada, n besar = bagus",
          "Observasi tidak independen → SE kekecilan → p-value palsu signifikan",
          "Komputer lambat",
          "Harus selalu pakai n=100 saja"]}
        correct={1}
        explanation="Benar: korelasi intra-subjek dilanggar. n=1.000 adalah ilusi; n efektif jauh lebih kecil."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. ICC = 0,8 artinya…"
        options={["80% pasien sembuh",
          "80% variasi berasal dari perbedaan antar subjek — pengukuran ulang sangat redundan",
          "Korelasi 80% dengan outcome",
          "Model 80% akurat"]}
        correct={1}
        explanation="Benar: ICC tinggi = “siapa orangnya” mendominasi. Tambah pengukuran nyaris tak menambah info independen."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Penelitian ingin efek RATA-RATA POPULASI program posyandu (outcome biner, diukur 6x). Pilihan paling natural?"
        options={["Mixed model dengan random slope",
          "GEE",
          "Regresi biasa",
          "Uji-t"]}
        correct={1}
        explanation="Benar: pertanyaan populasi + outcome biner = habitat alami GEE (sandwich SE robust)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan mixed model lebih tepat dari GEE?"
        options={["Selalu",
          "Butuh prediksi/efek per subjek atau data hierarkis bertingkat",
          "Data kecil",
          "Tidak pernah"]}
        correct={1}
        explanation="Benar: efek acak menangkap heterogenitas tiap level dan memungkinkan prediksi individual."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Menambahkan ID pasien sebagai 99 variabel dummy fixed effect adalah…"
        options={["Solusi terbaik",
          "Boros derajat bebas dan tak bisa generalisasi ke pasien baru — pakai random effect",
          "Wajib untuk semua model",
          "Hanya untuk data kecil"]}
        correct={1}
        explanation="Benar: fixed effect per subjek = mahal + tidak generalisasi. Random effect dirancang untuk ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. n=1.000 (50 pasien × 20 pengukuran), ICC=0,7. n efektif sekitar…"
        options={["1.000",
          "500",
          "70",
          "20"]}
        correct={2}
        explanation="Benar: 1000/(1+19×0,7) = 1000/14,3 ≈ 70. Inilah “n palsu” secara kuantitatif."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Pengukuran berulang <strong>tidak independen</strong> — abaikan = SE palsu.</li>
          <li><strong>ICC</strong> mengukur redundansi; <strong>n efektif</strong> = n/(1+(m−1)ICC).</li>
          <li><strong>Mixed model</strong>: efek tetap (populasi) + efek acak (subjek) — untuk pertanyaan individual/hierarkis.</li>
          <li><strong>GEE</strong>: efek rata-rata populasi dengan SE robust — untuk pertanyaan kebijakan.</li>
          <li>Untuk biner, koefisien mixed vs GEE beda interpretasi (non-collapsibility).</li>
          <li>ICC tinggi → belanjakan anggaran untuk <strong>tambah subjek</strong>.</li>
          <li>Waspadai drop-out informatif pada data longitudinal (sambung ke HD8).</li>
          <li>Alur kerja: plot spaghetti → ICC → pilih model sesuai pertanyaan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd6-survival" className="btn btn-secondary btn-sm">← HD6</Link>
        <Link href="/learn/hd8-missing-data" className="btn btn-primary btn-sm">HD8 →</Link>
      </div>
    </div>
  );
}
