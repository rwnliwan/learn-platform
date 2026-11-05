"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd4DesainStudiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd4DesignData = [{"x": ["Cross-sectional", "Case-control", "Kohort", "RCT"], "y": [2, 5, 8, 10], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Kekuatan bukti kausal", "text": [2, 5, 8, 10], "textposition": "outside"}, {"x": ["Cross-sectional", "Case-control", "Kohort", "RCT"], "y": [9, 7, 4, 2], "type": "bar", "marker": {"color": "#e8a838"}, "name": "Kecepatan/murah", "text": [9, 7, 4, 2], "textposition": "outside"}];
  const hd4DesignDataLayout = {"barmode": "group", "xaxis": {"title": "Desain"}, "yaxis": {"title": "Skor"}, "showlegend": true};

  const lab1Code = "import random\nrandom.seed(7)\nn = 20000\nrisk_dasar, risk_rokok = 0.05, 0.30  # rokok menaikkan risiko\nmentah = {'kopi_sakit': 0, 'kopi': 0, 'nokopi_sakit': 0, 'nokopi': 0}\nstrata = {}  # (kopi, rokok) -> [sakit, total]\nfor _ in range(n):\n    rokok = random.random() < 0.3\n    kopi = random.random() < (0.7 if rokok else 0.3)  # perokok lbh suka kopi\n    r = risk_dasar + (risk_rokok if rokok else 0.0)    # kopi: NOL efek\n    sakit = random.random() < r\n    k = 'kopi' if kopi else 'nokopi'\n    mentah[k+'_sakit'] += sakit; mentah[k] += 1\n    s = (kopi, rokok)\n    strata.setdefault(s, [0, 0])\n    strata[s][0] += sakit; strata[s][1] += 1\nrr_mentah = (mentah['kopi_sakit']/mentah['kopi']) / (mentah['nokopi_sakit']/mentah['nokopi'])\nprint(f'RR mentah kopi = {rr_mentah:.2f}  <- terlihat berbahaya!')\nprint('RR per strata rokok:')\nfor rokok in [False, True]:\n    a, na = strata[(True, rokok)]; c, nc = strata[(False, rokok)]\n    print(f\"  rokok={rokok}: RR = {(a/na)/(c/nc):.2f}  <- efek sebenarnya: 1.0\")\nprint()\nprint('Kesimpulan: asosiasi mentah 100% confounding oleh rokok.')";

  const lab2Code = "# (a=sakit terpapar, b=sehat terpapar, c=sakit tak terpapar, d=sehat tak terpapar)\nstrata = {'perokok': (36, 144, 8, 152), 'bukan': (4, 196, 2, 198)}\ndef OR(a, b, c, d):\n    return (a*d)/(b*c)\nprint('OR per strata:')\nfor nama, (a, b, c, d) in strata.items():\n    print(f'  {nama:<8} OR = {OR(a,b,c,d):.2f}')\nA = sum(v[0] for v in strata.values()); B = sum(v[1] for v in strata.values())\nC = sum(v[2] for v in strata.values()); D = sum(v[3] for v in strata.values())\nprint(f'OR mentah (gabungan): {OR(A,B,C,D):.2f}')\nprint()\nprint('Bila OR mentah jauh dari OR strata -> confounding oleh variabel strata.')\nprint('Solusi: laporkan per strata, atau Mantel-Haenszel / regresi (lihat HD10).')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD4 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Kohort vs Case-Control:<br />Desain Studi dan Jebakan Bias</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Kopi, Rokok, dan Kanker</a></li>
          <li><a href="#desain">Empat Desain — Empat Cara Bertanya</a></li>
          <li><a href="#bias">Tiga Bias Besar: Seleksi, Informasi, Confounding</a></li>
          <li><a href="#hill">Bradford Hill: Kapan Asosiasi Jadi Kausal</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Confounding</a></li>
          <li><a href="#lab2">🔬 Lab 2: OR Terkoreksi vs Mentah</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Memilih Desain</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Kapan Observasional Boleh Bicara Kausal</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: KLB Keracunan 48 Jam</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Membedah Confounding dengan Stratifikasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan <strong>kohort, case-control, cross-sectional, RCT</strong>: arah pertanyaan, ukuran efek yang valid, kekuatan dan kelemahan.</li>
          <li>Mengidentifikasi <strong>bias seleksi, bias informasi, dan confounding</strong> dalam skenario nyata.</li>
          <li>Menjelaskan mengapa <strong>adjustment</strong> (stratifikasi/regresi) bisa membalik kesimpulan.</li>
          <li>Menerapkan <strong>kriteria Bradford Hill</strong> untuk menilai klaim kausal dari studi observasional.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Kopi, Rokok, dan Kanker</h2>
      <div className="story">
        <p>Tahun 1980-an, studi observasional menemukan peminum kopi berisiko lebih tinggi terkena kanker pankreas. Media heboh. Lalu seseorang mengecek: peminum kopi berat ternyata juga <strong>lebih banyak merokok</strong> — dan rokoklah penyebab sebenarnya. Setelah memperhitungkan rokok, asosiasi kopi-kanker <strong>lenyap total</strong>.</p>
      <p>Inilah confounding: variabel ketiga yang menari di belakang layar, membuat dua hal yang tidak berhubungan terlihat berhubungan. Lesson ini melatih matamu melihat penari latar itu — skill yang membedakan analis yang dipercaya dokter dari analis yang ditertawakan di journal club.</p>
      <p><strong>Twist-nya:</strong> kopi ternyata <em>tidak bersalah</em> — tapi studi yang “menuduhnya” juga <em>tidak salah hitung</em>. Angkanya benar, statistiknya valid, kesimpulannya fatal. Confounding bukan kesalahan aritmetika; ia adalah <strong>kesalahan bertanya</strong>: studi itu menjawab “apakah peminum kopi lebih sering kena kanker” (ya, karena mereka merokok) padahal yang ditanyakan publik adalah “apakah kopi <em>menyebabkan</em> kanker” (tidak). Lesson ini melatihmu mendengar <em>pertanyaan yang sebenarnya dijawab</em> oleh setiap angka — skill yang tidak bisa digantikan software statistik apapun.</p>
      </div>

      <h2 id="desain">Empat Desain — Empat Cara Bertanya</h2>
      <p><strong>Definisi.</strong> <strong>Kohort</strong>: dari paparan → maju ke outcome (hitung RR). <strong>Case-control</strong>: dari outcome → mundur ke paparan (hitung OR). <strong>Cross-sectional</strong>: potret satu titik waktu (prevalensi). <strong>RCT</strong>: paparan diacak peneliti (standar emas kausalitas).</p>
      <details className="worked">
        <summary>📐 Contoh: memilih desain untuk “rokok vs TB”</summary>
        <p><strong>Kohort:</strong> rekrut 2.000 perokok + 2.000 bukan perokok sehat, ikuti 5 tahun, hitung insidens TB → RR. Mahal tapi temporal jelas.<br /><strong>Case-control:</strong> ambil 200 pasien TB + 200 kontrol sehat, tanya riwayat merokok → OR. Selesai 3 bulan, tapi ingatan bisa bias.<br /><strong>Cross-sectional:</strong> survei 5.000 orang sekaligus: status merokok + TB saat ini → prevalensi. Tidak bisa pastikan rokok dulu atau TB dulu.<br /><strong>RCT:</strong> acak orang jadi perokok?? <strong>Tidak etis</strong> — di sinilah observasional tak tergantikan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Kohort itu dokumenter yang mengikuti tokoh bertahun-tahun (mahal, lama, tapi alur jelas). Case-control itu detektif yang merekonstruksi masa lalu dari TKP (cepat, murah, tapi ingatan saksi bisa bias). Cross-sectional itu foto selfie (cepat, tapi tidak tahu mana dulu: ayam atau telur). RCT itu eksperimen lab (paling meyakinkan, paling mahal).</p>
      <p><strong>Kapan memakai:</strong> Penyakit jarang → case-control. Paparan jarang → kohort. Butuh cepat/murah/prevalensi → cross-sectional. Butuh bukti kausal kuat dan etis → RCT.</p>

      <PlotlyChart
        data={hd4DesignData}
        title="Trade-off Desain Studi (skor ilustratif 1–10)"
        layout={hd4DesignDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Biru = kekuatan bukti kausal, kuning = kecepatan/biaya murah. Baca per desain: tidak ada yang tinggi di keduanya.</p>
        <p><strong>Interpretasi:</strong> Hierarki bukti berbanding terbalik dengan kepraktisan: RCT paling meyakinkan tapi paling lambat/mahal; cross-sectional tercepat tapi paling lemah. Inilah kenapa dunia nyata didominasi observasional — dan kenapa skill membaca bias observasional sangat mahal harganya.</p>
      </div>

      <h2 id="bias">Tiga Bias Besar: Seleksi, Informasi, Confounding</h2>
      <p><strong>Definisi.</strong> <strong>Bias seleksi</strong>: sampel tidak mewakili (mis. healthy worker effect). <strong>Bias informasi</strong>: pengukuran salah (recall bias, misclassification). <strong>Confounding</strong>: variabel ketiga terkait paparan dan outcome, mengacaukan asosiasi.</p>
      <Tex math={String.raw`\text{Asosiasi teramati} = \text{efek sebenarnya} + \text{bias}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{efek sebenarnya}`} />: hubungan kausal yang ingin diukur</li>
          <li><Tex math={String.raw`\text{bias}`} />: distorsi dari seleksi/pengukuran/confounding — bisa positif atau negatif</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus konseptual ini mengingatkan: angka yang kamu hitung selalu campuran efek + bias. Tugas analis adalah memperkecil suku kedua, bukan berpura-pura ia nol.</p>
      <details className="worked">
        <summary>📐 Contoh: tiga bias dalam satu studi “HP vs sakit kepala”</summary>
        <p><strong>Seleksi:</strong> survei online hanya diisi yang peduli kesehatan → sampel tidak mewakili.<br /><strong>Informasi:</strong> responden sakit kepala melebih-lebihkan durasi main HP (recall bias).<br /><strong>Confounding:</strong> begadang terkait main HP <em>dan</em> sakit kepala — tanpa mengontrol begadang, HP terlihat bersalah.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bias seleksi itu penjaga pintu yang pilih-pilih tamu. Bias informasi itu saksi yang ingatannya kabur. Confounding itu dalang di balik tirai — yang paling berbahaya karena hasilnya terlihat meyakinkan.</p>
      <p><strong>Kapan memakai:</strong> Kritik studi/jurnal: cek ketiganya berurutan — siapa yang masuk studi, bagaimana diukur, apa yang tidak dikontrol.</p>

      <h2 id="hill">Bradford Hill: Kapan Asosiasi Boleh Naik Kelas</h2>
      <p><strong>Definisi.</strong> Sembilan kriteria untuk menilai apakah asosiasi observasional layak dianggap kausal: <strong>kekuatan, konsistensi, spesifisitas, temporalitas, gradien dosis-respons, plausibilitas, koherensi, eksperimen, analogi</strong>. Bukan checklist kaku — melainkan kerangka argumen.</p>
      <details className="worked">
        <summary>📐 Contoh: rokok → kanker paru (kasus Hill yang asli)</summary>
        <p><strong>Kekuatan:</strong> RR ~10–20 (sangat besar). <strong>Konsistensi:</strong> ditemukan di banyak negara. <strong>Temporalitas:</strong> merokok mendahului kanker puluhan tahun. <strong>Dosis-respons:</strong> makin banyak batang, makin tinggi risiko. <strong>Eksperimen:</strong> berhenti merokok menurunkan risiko. Lima kriteria kuat → vonis kausal, walau tanpa RCT (yang tidak etis).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Bradford Hill itu seperti dewan juri: tidak ada satu saksi yang memutuskan, tapi sembilan kesaksian yang saling menguatkan. Temporalitas (paparan mendahului outcome) adalah saksi kunci — tanpanya, kasusnya lemah.</p>
      <p><strong>Kapan memakai:</strong> Menilai klaim “X menyebabkan Y” dari media/jurnal observasional sebelum merekomendasikan kebijakan.</p>
      <div className="callout"><strong>Mnemonic 9 kriteria:</strong> “<strong>S</strong>emua <strong>T</strong>eman <strong>S</strong>uka <strong>T</strong>anya, <strong>G</strong>imana <strong>P</strong>rosesnya? <strong>K</strong>ok <strong>E</strong>ksperimen <strong>A</strong>da?” — Strength, Temporalitas, Spesifisitas, konsisTensi, Gradien, Plausibilitas, Koherensi, Eksperimen, Analogi.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Membedah Confounding dengan Stratifikasi</h2>
      <details className="worked">
        <summary>📐 Worked example: stratifikasi membunuh asosiasi palsu kopi–kanker (klik untuk buka)</summary>
        <p>Data: 1.000 orang. Secara kasar (crude): peminum kopi berat — 60 kanker dari 400 (15%); bukan peminum berat — 40 kanker dari 600 (6,7%). OR kasar ≈ 2,5. Media: “Kopi meningkatkan risiko kanker 2,5×!”</p>
        <p><strong>Langkah 1 — Stratifikasi per status merokok.</strong> Di kalangan <em>perokok</em> (n=500): peminum kopi 50 kanker/300 (16,7%), bukan peminum 25 kanker/200 (12,5%) → OR ≈ 1,4. Di kalangan <em>bukan perokok</em> (n=500): peminum kopi 10 kanker/100 (10%), bukan peminum 15 kanker/400 (3,75%) → OR ≈ 2,9? Tunggu — hitung ulang dengan hati-hati: odds peminum = 10/90 = 0,111; odds bukan peminum = 15/385 = 0,039; OR = 2,85. Hmm, masih ada efek?</p>
        <p><strong>Langkah 2 — Sadarilah jebakan stratum kecil.</strong> Stratum bukan-perokok + peminum kopi hanya n=100 dengan 10 kasus — interval kepercayaannya lebar (OR 2,85; 95% CI bisa 1,2–6,8). Estimasi gabungan Mantel–Haenszel memberi bobot lebih ke stratum besar: OR terkoreksi ≈ <strong>1,5</strong> — jauh di bawah 2,5.</p>
        <p><strong>Langkah 3 — Tambahkan confounder kedua.</strong> Setelah juga memperhitungkan alkohol, OR → <strong>1,0</strong>. Asosiasi lenyap total.</p>
        <p><strong>Langkah 4 — Kesimpulan untuk laporan.</strong> “Asosiasi kasar kopi–kanker (OR 2,5) sepenuhnya dijelaskan oleh confounding merokok dan alkohol; tidak ada bukti efek independen kopi.” Kalimat inilah yang membedakan analis dari penyebar hoaks berkedok statistik.</p>
        <p><strong>Pelajaran:</strong> OR kasar adalah <em>rumor</em>; OR terkoreksi adalah <em>hasil investigasi</em>. Jangan pernah mengutip rumor di laporan resmi.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — hierarki bukti bukan kasta, melainkan “harga” sebuah klaim:</strong> RCT di puncak bukan karena peneliti RCT lebih pintar, melainkan karena <em>randomisasi membeli satu hal mahal</em>: keseimbangan confounder yang bahkan tidak kamu ketahui namanya. Studi observasional bisa naik kelas (mendekati RCT) hanya bila ia bisa menunjukkan <em>dengan data</em> bahwa confounder kuncinya terukur dan terkontrol — inilah jembatan ke HD10 (target trial emulation). Aturan praktis: sebelum percaya klaim kausal dari data observasional, tanya “confounder apa yang <em>tidak terukur</em> di sini, dan ke arah mana ia membiaskan hasil?”</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — “jamu menurunkan risiko diabetes 40%”:</strong> Klaim semacam ini rutin muncul dari studi potong lintang: peminum jamu rutin vs bukan. Confounder klasiknya: peminum jamu rutin cenderung <strong>lebih peduli kesehatan</strong> (olahraga, diet, kontrol gula) — persis seperti “healthy user bias” pada suplemen di AS. Tanpa mengukur perilaku kesehatan umum, angka 40% itu mengukur <em>gaya hidup</em>, bukan <em>jamu</em>. Pelajaran untuk analis Indonesia: setiap klaim produk herbal berbasis survei harus dibaca sebagai “studi tentang siapa yang minum jamu”, bukan “studi tentang apa yang dilakukan jamu”.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Kapan Observasional Boleh Bicara Kausal</h2>
      <p>Bradford Hill (1965) tidak memberi “rumus kausalitas” — ia memberi <strong>daftar periksa kewarasan</strong> untuk menilai apakah asosiasi observasional layak dianggap kausal. Sembilan kriterianya, dengan contoh rokok–kanker paru (kasus yang memenangkannya):</p>
      <p><strong>1. Kekuatan (strength):</strong> RR perokok berat vs bukan ≈ 20–30× — asosiasi raksasa sulit dijelaskan confounder biasa (confounder harus 20× lebih umum di perokok <em>dan</em> 20× menaikkan risiko kanker — tidak ada kandidatnya). <strong>2. Konsistensi:</strong> ditemukan di puluhan negara, puluhan desain, puluhan dekade. <strong>3. Spesifisitas:</strong> rokok → kanker paru spesifik kuat (tidak “semua kanker sama rata”). <strong>4. Temporalitas:</strong> merokok <em>mendahului</em> kanker (satu-satunya kriteria yang wajib). <strong>5. Gradien biologis:</strong> makin banyak batang/hari, makin tinggi risiko (dose-response). <strong>6. Plausibilitas:</strong> karsinogen tembakau merusak DNA — mekanisme jelas. <strong>7. Koherensi:</strong> sejalan dengan biologi &amp; eksperimen hewan. <strong>8. Eksperimen:</strong> berhenti merokok → risiko turun (reversibilitas). <strong>9. Analogi:</strong> asbes → mesothelioma memperkuat pola “inhalasi karsinogen → kanker”.</p>
      <p><strong>Cara memakai yang benar:</strong> Hill bukan checklist “7 dari 9 = kausal”. Ia adalah <strong>kerangka argumen</strong>: tiap kriteria yang terpenuhi menambah beban bukti; tiap yang gagal menuntut penjelasan. Dalam laporanmu, tulis: “Asosiasi X–Y memenuhi 6 kriteria Hill (kekuatan, konsistensi, temporalitas, gradien, plausibilitas, eksperimen); yang belum: spesifisitas (X juga terkait Z) — kelemahan ini kami akui.” — <strong>Kejujuran tentang kriteria yang gagal</strong> justru memperkuat kredibilitasmu.</p>
      <p><strong>Senjata modern: natural experiment.</strong> Kadang alam mengacak untukmu: kebijakan yang berlaku di satu provinsi tapi tidak di tetangganya (diD), ambang batas usia program (regression discontinuity), atau lotre (benar-benar acak!). Desain-desain ini memberi <strong>variasi eksogen</strong> — perubahan paparan yang <em>tidak</em> dipilih subjek — dan inilah emas kausalitas observasional. Analis yang mengenali natural experiment di datanya (mis. “aturan baru berlaku 1 Januari — bandingkan Desember vs Februari”) bisa menjawab kausal tanpa RCT.</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> klaim kausal dari observasional = <strong>argumen hukum</strong>, bukan hasil satu uji. Bangun dengan banyak bukti (Hill), akui kelemahannya, dan cari natural experiment yang mengunci. Satu p-value tidak pernah cukup — tapi sembilan lapis bukti yang konsisten sulit dibantah.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Studi observasional tidak ada gunanya karena tidak bisa membuktikan kausalitas&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Banyak kausalitas terpenting (rokok-kanker, asbestos-mesothelioma) TIDAK PERNAH diuji dengan RCT karena tidak etis. Observasional yang dirancang baik + kriteria Hill + replikasi = bukti yang cukup untuk kebijakan. Yang tidak berguna adalah observasional yang dibaca naif.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau sudah dikontrol banyak variabel, pasti bebas confounding&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kontrol hanya bekerja untuk confounder yang <em>diukur dengan benar</em>. Confounding residual (variabel tak terukur/salah ukur) selalu tersisa. Klaim “sudah di-adjust” bukan sertifikat bebas bias — tanyakan: apa yang TIDAK diukur?</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Cross-sectional bisa menentukan sebab-akibat kalau sampelnya besar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tidak. Masalahnya bukan ukuran sampel, melainkan <em>waktu</em>: paparan dan outcome diukur bersamaan, jadi tidak tahu mana yang dulu (temporalitas gagal). Sampel 1 juta tidak memperbaiki ini.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Memilih Desain untuk Tiga Pertanyaan Dinkes</h2>
      <details className="worked">
        <summary>📐 Worked example: desain apa untuk pertanyaan apa (klik untuk buka)</summary>
        <p>Dinkes punya tiga pertanyaan dan satu anggaran terbatas. Tugasmu: pasangkan desain, dan bela pilihanmu.</p>
        <p><strong>Pertanyaan 1 — “Apakah pelatihan kader menurunkan kematian bayi di kabupaten ini?”</strong><br /><strong>Desain: quasi-eksperimen difference-in-differences.</strong> RCT tidak etis (tidak boleh menolak pelatihan ke kelompok kontrol). Ambil 10 kecamatan intervensi + 10 kontrol (karakteristik mirip), ukur AKB sebelum &amp; sesudah di keduanya. Efek = (sesudah−sebelum)<sub>intervensi</sub> − (sesudah−sebelum)<sub>kontrol</sub>. <strong>Asumsi kunci:</strong> tren paralel — tanpa intervensi, kedua kelompok bergerak searah. Uji dengan data pra-intervensi 3 tahun: jika trennya sudah beda, desain runtuh.</p>
        <p><strong>Pertanyaan 2 — “Faktor risiko apa yang terkait kejadian luar biasa (KLB) keracunan makanan kemarin?”</strong><br /><strong>Desain: kasus-kontrol (retrospektif, cepat).</strong> KLB = kejadian langka &amp; mendesak: ambil 30 yang keracunan (kasus) + 60 yang makan di tempat sama tapi sehat (kontrol), tanya riwayat konsumsi tiap menu. OR untuk “makan sate usus” = 8,2 → sumber KLB. <strong>Waspada:</strong> recall bias (yang sakit lebih ingat makan apa) — validasi dengan catatan pembelian bahan baku warung.</p>
        <p><strong>Pertanyaan 3 — “Berapa insidens TB per tahun di populasi ini?”</strong><br /><strong>Desain: kohort prospektif.</strong> Hanya kohort yang memberi <em>insidens</em> (kasus baru per person-time). Ambil 5.000 orang bebas TB, ikuti 2 tahun, hitung kasus baru. <strong>Harga:</strong> mahal &amp; lama — tapi tidak ada jalan pintas menuju insidens yang valid.</p>
        <p><strong>Pelajaran:</strong> ada <strong>tabel kebenaran desain</strong>: butuh insidens → kohort; penyakit langka + cepat → kasus-kontrol; evaluasi program tanpa RCT → quasi-eksperimen; klaim kausal kuat → RCT. Analis yang memilih desain <em>sebelum</em> melihat data menghemat 90% perdebatan.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Urutan kerja yang benar: <strong>pertanyaan → desain → data</strong>. Urutan yang salah (dan umum): <strong>data → analisis → cari pertanyaan yang cocok</strong> — inilah pabrik p-hacking dan klaim palsu. Jika datamu tidak cocok untuk pertanyaanmu, <em>akui</em> — jangan paksa.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Gambar <strong>DAG</strong> (directed acyclic graph) sebelum analisis: panah paparan → outcome, lalu tambahkan semua variabel ketiga. Confounder = panah masuk ke paparan DAN outcome. Latihan ini mencegah 80% kesalahan interpretasi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bedakan <strong>confounder vs mediator</strong>: confounder (rokok) harus dikontrol; mediator (tekanan darah di jalur obat→stroke) JANGAN dikontrol kalau ingin efek total. Mengontrol mediator = bunuh efek yang ingin diukur.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Saat membaca jurnal, lompat ke <strong>metode rekrutmen dan pengukuran</strong> dulu, baru hasil. Bias lahir di desain, bukan di tabel hasil.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Confounding — Kopi yang Tidak Bersalah</h2>
      <p>Simulasikan populasi di mana kopi TIDAK berpengaruh ke penyakit, tapi perokok lebih suka kopi dan rokok menyebabkan penyakit. Hitung asosiasi mentah vs terkontrol rokok.</p>
      <PyodideLab
        title="🔬 Lab 1: Confounding — Kopi yang Tidak Bersalah"
        hint="Ubah efek rokok (risk_rokok) dari 0.30 ke 0.10. Perhatikan asosiasi mentah kopi ikut menyusut — padahal kopi tidak pernah berpengaruh. Itulah confounding."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Stratifikasi — Menghitung OR Terkoreksi</h2>
      <p>Diberikan dua tabel 2×2 (perokok vs bukan), hitung OR mentah (gabungan) dan OR per strata. Lihat bagaimana penggabungan tanpa stratifikasi menipu (Simpson's paradox versi epidemiologi).</p>
      <PyodideLab
        title="🔬 Lab 2: Stratifikasi — Menghitung OR Terkoreksi"
        hint="Coba balik: buat OR per strata SAMA tapi OR mentah berbeda arah. Itulah Simpson's paradox — agregat berbohong, strata jujur."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: KLB Keracunan — Kasus-Kontrol dalam 48 Jam</h2>
      <p>Skenario nyata yang berulang tiap tahun di Indonesia: <strong>KLB keracunan makanan</strong> — hajatan, sekolah, pesantren. Dinkes harus menemukan sumbernya dalam hitungan hari, bukan bulan. Inilah panggung <strong>kasus-kontrol cepat</strong>.</p>
      <p><strong>Protokol 48 jam:</strong> (1) <strong>Definisi kasus</strong> — “mual/muntah/diare dalam 24 jam setelah acara X” (jelas, operasional). (2) <strong>Rekrut kasus</strong> — daftar dari puskesmas/RS + absensi acara. (3) <strong>Pilih kontrol</strong> — yang <em>hadir di acara yang sama</em> tapi tidak sakit (mengontrol paparan kesempatan). (4) <strong>Wawancara terstruktur</strong> — daftar semua menu, hitung OR per menu. (5) <strong>Keputusan</strong> — menu dengan OR tertinggi + plausibilitas (mis. sate usus yang disimpan suhu ruang 6 jam) → tarik/sita, periksa sampel lab.</p>
      <p><strong>Dua jebakan khas Indonesia:</strong> ① <strong>Kontrol yang salah</strong> — mengambil kontrol dari <em>luar</em> acara (“tetangga yang tidak ikut”) menghancurkan logika: mereka tidak punya kesempatan terpapar menu yang sama. Kontrol harus dari <strong>populasi sumber yang sama</strong>. ② <strong>Recall bias + tekanan sosial</strong> — di komunitas kecil, responden enggan menyebut warung tetangganya sebagai sumber (“tidak enak”). Pewawancara terlatih + jaminan anonimitas + triangulasi (catatan belanja, sisa makanan) mengurangi bias ini.</p>
      <p><strong>Kenapa ini penting untuk kariermu:</strong> investigasi KLB adalah <strong>wawancara kerja terbaik</strong> epidemiolog lapangan (FETP Indonesia melatih persis ini). Satu laporan investigasi KLB yang rapi — definisi kasus, kurva epidemi, tabel OR per paparan, kesimpulan + rekomendasi — adalah <strong>portofolio yang dibaca Kemenkes</strong>. Simpan templatenya dari lesson ini.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Dalam KLB, <strong>kecepatan mengalahkan presisi</strong>: OR kasar dalam 48 jam yang menghentikan sumber lebih berharga daripada OR terkoreksi sempurna dalam 2 bulan setelah semua orang sembuh (atau meninggal). Desain untuk keputusan, bukan untuk jurnal.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Penyakit jarang, butuh cepat → Case-control</h3>
        <p><strong>Kondisi:</strong> Outcome langka, waktu dan dana terbatas.</p>
        <p><strong>Kenapa:</strong> Efisien: mulai dari kasus yang sudah ada, tidak menunggu bertahun-tahun.</p>
        <p><strong>Contoh nyata:</strong> Faktor risiko kanker nasofaring (jarang) di Indonesia.</p>
      </div>
      <div className="decision-card">
        <h3>2. Paparan jarang, butuh insidens → Kohort</h3>
        <p><strong>Kondisi:</strong> Paparan langka tapi teridentifikasi; butuh urutan waktu jelas.</p>
        <p><strong>Kenapa:</strong> Bisa hitung insidens dan RR langsung; temporalitas terjaga.</p>
        <p><strong>Contoh nyata:</strong> Kohort pekerja tambang: paparan debu silika → TB paru.</p>
      </div>
      <div className="decision-card">
        <h3>3. Butuh prevalensi / survei cepat → Cross-sectional</h3>
        <p><strong>Kondisi:</strong> Pertanyaan “berapa banyak sekarang”, bukan “kenapa”.</p>
        <p><strong>Kenapa:</strong> Murah, cepat; cukup untuk perencanaan layanan.</p>
        <p><strong>Contoh nyata:</strong> Riskesdas: prevalensi stunting, hipertensi per provinsi.</p>
      </div>
      <div className="decision-card">
        <h3>4. Butuh bukti kausal terkuat &amp; etis → RCT</h3>
        <p><strong>Kondisi:</strong> Intervensi bisa diacak tanpa melanggar etik.</p>
        <p><strong>Kenapa:</strong> Randomisasi menyeimbangkan confounder terukur maupun tak terukur.</p>
        <p><strong>Contoh nyata:</strong> Uji efikasi vaksin DBD baru (lihat HD5).</p>
      </div>
      <div className="decision-card">
        <h3>5. RCT tidak etis/mungkin → Observasional + Hill + triangulasi</h3>
        <p><strong>Kondisi:</strong> Paparan berbahaya atau sudah terjadi.</p>
        <p><strong>Kenapa:</strong> Satu studi tak cukup; butuh konsistensi multi-desain dan kriteria Hill.</p>
        <p><strong>Contoh nyata:</strong> Rokok, polusi udara, diet — tidak ada RCT-nya, tapi vonis kausal tetap dijatuhkan.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tanya dulu: dari paparan maju, atau dari outcome mundur?</li>
          <li>Cek tiga bias: siapa masuk, bagaimana diukur, apa tak dikontrol.</li>
          <li>Confounder dikontrol; mediator jangan (untuk efek total).</li>
          <li>Klaim kausal tanpa temporalitas = jangan percaya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Minum Jamu Menurunkan Risiko Diabetes 40%”</h2>
      <div className="callout">
        <p>Studi cross-sectional 10.000 orang: peminum jamu rutin punya prevalensi diabetes <strong>40% lebih rendah</strong> (OR=0,6). Produsen jamu ingin memakai hasil ini di iklan. Kamu diminta Dinkes memberi second opinion.</p>
      <p>Detail metode: sampel dari pengunjung puskesmas (bukan populasi umum); status jamu dan diabetes diukur <strong>pada hari yang sama</strong> via kuesioner; tidak ada data aktivitas fisik, diet, atau pendapatan.</p>
        <p><strong>Pertanyaan:</strong> Sebutkan minimal 3 masalah desain dan kesimpulanmu untuk Dinkes.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Cross-sectional: tidak tahu mana dulu — bisa jadi penderita diabetes BERHENTI minum jamu manis setelah diagnosis (reverse causality). (2) Bias seleksi: pengunjung puskesmas ≠ populasi umum. (3) Confounding tak terkontrol: peminum jamu rutin mungkin lebih aktif, diet lebih baik, atau lebih kaya — semua terkait diabetes. (4) Bias informasi: kuesioner sekali ukur untuk kebiasaan bertahun-tahun. Kesimpulan: studi ini TIDAK mendukung klaim kausal; melarang klaim iklan tersebut; sarankan kohort prospektif bila produsen serius. Pelajaran: OR 0,6 yang menggiurkan runtuh setelah tiga pertanyaan desain.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Studi merekrut 200 pasien TB dan 200 kontrol sehat, lalu menelusuri riwayat merokok. Ini desain…"
        options={["Kohort",
          "Case-control",
          "Cross-sectional",
          "RCT"]}
        correct={1}
        explanation="Benar: berangkat dari outcome (kasus vs kontrol), mundur ke paparan = case-control. Ukuran valid: OR."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Peminum kopi terlihat berisiko kanker pankreas, tapi setelah mengontrol rokok asosiasi hilang. Rokok adalah…"
        options={["Mediator",
          "Confounder",
          "Collider",
          "Effect modifier"]}
        correct={1}
        explanation="Benar: rokok terkait kopi (paparan) dan kanker (outcome), bukan di jalur kausal kopi→kanker = confounder klasik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. RCT tidak etis untuk meneliti efek rokok. Alternatif bukti kausal terkuat?"
        options={["Satu cross-sectional besar",
          "Konsistensi multi-studi observasional + kriteria Bradford Hill",
          "Studi kasus tunggal",
          "Opini ahli"]}
        correct={1}
        explanation="Benar: triangulasi — banyak desain, banyak populasi, kriteria Hill. Vonis rokok-kanker dijatuhkan persis dengan cara ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Dalam studi obat→tekanan darah→stroke, tekanan darah adalah mediator. Jika ingin efek TOTAL obat, maka…"
        options={["Wajib mengontrol tekanan darah",
          "Jangan mengontrol tekanan darah",
          "Hapus data tekanan darah",
          "Ganti outcome"]}
        correct={1}
        explanation="Benar: mengontrol mediator memblokir jalur kausal yang ingin diukur (over-adjustment). Kontrol confounder, bukan mediator."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kelemahan utama cross-sectional untuk klaim kausal?"
        options={["Sampel selalu kecil",
          "Paparan dan outcome diukur bersamaan — temporalitas tidak jelas",
          "Tidak bisa hitung prevalensi",
          "Terlalu mahal"]}
        correct={1}
        explanation="Benar: masalahnya waktu, bukan ukuran. Ayam-telur tidak terselesaikan oleh n besar."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Recall bias termasuk jenis…"
        options={["Bias seleksi",
          "Bias informasi",
          "Confounding",
          "Bukan bias"]}
        correct={1}
        explanation="Benar: kesalahan pengukuran/ingatan = bias informasi. Kasus mengingat paparan lebih baik dari kontrol → OR terdistorsi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Kohort</strong>: paparan → outcome (RR). <strong>Case-control</strong>: outcome → paparan (OR). <strong>Cross-sectional</strong>: potret prevalensi. <strong>RCT</strong>: acak, standar emas.</li>
          <li>Tiga bias: <strong>seleksi</strong> (siapa masuk), <strong>informasi</strong> (bagaimana diukur), <strong>confounding</strong> (variabel ketiga).</li>
          <li>Asosiasi teramati = efek sebenarnya + bias. Tugasmu mengecilkan suku kedua.</li>
          <li>Kontrol <strong>confounder</strong>; jangan kontrol <strong>mediator</strong> untuk efek total.</li>
          <li><strong>Bradford Hill</strong>: 9 kriteria menilai klaim kausal; temporalitas adalah kunci.</li>
          <li>RCT tak etis ≠ tak ada bukti — triangulasi observasional bisa memvonis.</li>
          <li>Baca metode dulu (rekrutmen, pengukuran), baru percaya tabel hasil.</li>
          <li>Skill ini prasyarat HD5 (trial), HD6 (survival), HD10 (kausal observasional).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd3-epidemiologi" className="btn btn-secondary btn-sm">← HD3</Link>
        <Link href="/learn/hd5-uji-klinis" className="btn btn-primary btn-sm">HD5 →</Link>
      </div>
    </div>
  );
}
