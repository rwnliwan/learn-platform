"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd10KausalObservasionalPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd10PsData = [{"x": [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], "y": [2, 5, 9, 14, 18, 22, 25, 30, 38, 45], "type": "bar", "name": "Diobati", "marker": {"color": "#e8a838"}}, {"x": [0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95], "y": [48, 42, 35, 28, 22, 16, 10, 6, 3, 1], "type": "bar", "name": "Tidak diobati", "marker": {"color": "#2a7de1"}}];
  const hd10PsDataLayout = {"barmode": "stack", "xaxis": {"title": "Propensity score"}, "yaxis": {"title": "Jumlah pasien"}, "showlegend": true};

  const lab1Code = "import random\nrandom.seed(13)\nn = 10000\nhasil = {'obat': [0, 0], 'tanpa': [0, 0]}  # [meninggal, total]\nstrata = {}\nfor _ in range(n):\n    parah = random.random() < 0.3\n    # dokter meresepkan ke yang parah (confounding by indication)\n    obat = random.random() < (0.8 if parah else 0.2)\n    r_mati = 0.40 if parah else 0.05   # obat: NOL efek\n    mati = random.random() < r_mati\n    k = 'obat' if obat else 'tanpa'\n    hasil[k][0] += mati; hasil[k][1] += 1\n    s = (obat, parah)\n    strata.setdefault(s, [0, 0])\n    strata[s][0] += mati; strata[s][1] += 1\nm_obat = hasil['obat'][0]/hasil['obat'][1]\nm_tanpa = hasil['tanpa'][0]/hasil['tanpa'][1]\nprint(f'mortalitas mentah: obat {m_obat:.1%} vs tanpa {m_tanpa:.1%}')\nprint('-> obat TERLIHAT membunuh! (padahal efek NOL)')\nprint('Setelah stratifikasi keparahan:')\nfor parah in [False, True]:\n    a = strata[(True, parah)]; b = strata[(False, parah)]\n    print(f\"  parah={parah}: obat {a[0]/a[1]:.1%} vs tanpa {b[0]/b[1]:.1%} -> SAMA\")\nprint()\nprint('Pelajaran: di data observasional, obat selalu diberikan ke yang sakit.')\nprint('Tanpa adjustment, semua obat terlihat buruk.')";

  const lab2Code = "import random, statistics as st\nrandom.seed(17)\nn = 8000\ndata = []\nfor _ in range(n):\n    usia = random.gauss(60, 12)\n    parah = random.random() < 1/(1+2.718**(-(usia-60)/10))  # usia->parah\n    ps = 0.1 + 0.7*(1 if parah else 0) + (usia-60)/200      # propensity\n    ps = min(0.95, max(0.05, ps))\n    obat = random.random() < ps\n    # outcome: obat menurunkan risiko 5 poin (efek sebenarnya)\n    r = 0.30 + (0.25 if parah else 0) - (0.05 if obat else 0)\n    mati = random.random() < r\n    data.append((ps, obat, mati))\ndata.sort()\nm = len(data)//5\nefek_strata, bobot = [], []\nfor i in range(5):\n    s = data[i*m:(i+1)*m]\n    o = [x for x in s if x[1]]; t = [x for x in s if not x[1]]\n    e = st.mean(x[2] for x in o) - st.mean(x[2] for x in t)\n    efek_strata.append(e); bobot.append(len(s))\nefek_adj = sum(e*w for e, w in zip(efek_strata, bobot))/sum(bobot)\no_all = [x for x in data if x[1]]; t_all = [x for x in data if not x[1]]\nefek_mentah = st.mean(x[2] for x in o_all) - st.mean(x[2] for x in t_all)\nprint(f'efek sebenarnya : -0.050')\nprint(f'efek mentah      : {efek_mentah:+.3f} (bias: obat diberikan ke yg parah)')\nprint(f'efek terstratifikasi: {efek_adj:+.3f} <- jauh lebih dekat kebenaran')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD10 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Target Trial &amp; Propensity:<br />Kausalitas dari Data Observasional</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Obat yang Terlihat Membunuh</a></li>
          <li><a href="#target">Target Trial Emulation — Si Peniru RCT</a></li>
          <li><a href="#propensity">Propensity Score &amp; IPTW</a></li>
          <li><a href="#dag">DAG &amp; Immortal Time Bias</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Confounding by Indication</a></li>
          <li><a href="#lab2">🔬 Lab 2: Stratifikasi Propensity Sederhana</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Immortal Time Bias</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Tiga Asumsi Tak Teruji</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Evaluasi JKN dengan DiD</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Anatomi Target Trial Emulation</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>confounding by indication</strong> dan mengapa ia merajalela di data EHR/klaim.</li>
          <li>Merancang <strong>target trial emulation</strong>: eligibility, time zero, dan perlakuan yang jelas.</li>
          <li>Menjelaskan logika <strong>propensity score, matching, dan IPTW</strong> serta asumsi no-unmeasured-confounding.</li>
          <li>Mengenali <strong>immortal time bias</strong> dan collider bias dari DAG.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Obat yang Terlihat Membunuh</h2>
      <div className="story">
        <p>Analisis klaim BPJS: pasien yang menerima obat jantung X punya mortalitas <strong>lebih tinggi</strong> dari yang tidak. Kesimpulan naif: “obat X membunuh!” Lalu apoteker menjelaskan: obat X hanya diresepkan untuk pasien <strong>paling parah</strong> — yang memang lebih mungkin meninggal apapun obatnya.</p>
      <p>Inilah <strong>confounding by indication</strong>: alasan diberi obat (keparahan) juga menyebabkan outcome. Di data observasional, obat selalu terlihat “bersalah” karena ia diberikan kepada yang paling sakit. Lesson ini mengajarkan cara meniru RCT dari data observasional — sedekat mungkin dengan kebenaran tanpa mengacak pasien sungguhan.</p>
      <p><strong>Twist-nya:</strong> obat X <em>tidak</em> membunuh — ia justru diberikan kepada pasien yang <em>paling mungkin meninggal</em>, sehingga di data ia selalu tampak berdiri di samping mayat. Ini seperti menyimpulkan “pemadam kebakaran menyebabkan kebakaran” karena mereka selalu ada di lokasi api. Confounding by indication adalah <strong>ilusi optik data observasional</strong>: pengobatan dan keparahan bergerak bersama, dan mata telanjang tidak bisa memisahkan keduanya. Target trial emulation adalah kacamatanya — dan lesson ini mengajarkan cara memakainya.</p>
      </div>

      <h2 id="target">Target Trial Emulation — Si Peniru RCT</h2>
      <p><strong>Definisi.</strong> <strong>Target trial emulation</strong>: sebelum menyentuh data, tulis protokol RCT hipotetis yang <em>akan</em> menjawab pertanyaanmu (eligibility, perlakuan, time zero, outcome, follow-up) — lalu tiru sedekat mungkin dengan data observasional.</p>
      <details className="worked">
        <summary>📐 Contoh: efek statin pada stroke dari klaim</summary>
        <p><strong>Target trial:</strong> dewasa 40–75, tanpa stroke sebelumnya, LDL tinggi; perlakuan = mulai statin dalam 30 hari vs tidak; <strong>time zero</strong> = tanggal memenuhi eligibility; outcome = stroke 5 tahun.<br /><strong>Emulasi:</strong> tiru kriteria dari klaim; yang “mulai statin” = initiator; time zero SAMA untuk kedua kelompok (tanggal eligibility!).<br />Tanpa time zero yang sinkron, kelompok obat mendapat “waktu abadi” gratis (lihat immortal time bias).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Target trial itu sutradara yang memaksa analis observasional berakting seperti RCT: “Kalau ini RCT, siapa yang boleh ikut? Kapan jam mulai dihitung? Apa perlakuannya tepat?” Tanpa naskah ini, analisis observasional improvisasi — dan improvisasi melahirkan bias.</p>
      <p><strong>Kapan memakai:</strong> Setiap pertanyaan kausal dari EHR/klaim: efek obat, efek kebijakan, efek program. Tulis protokol dulu, query kemudian.</p>
      <div className="callout callout-warning"><strong>Tiga dosa emulation:</strong> (1) time zero beda antar kelompok; (2) eligibility memakai info masa depan (mis. “pasien yang bertahan 1 tahun”); (3) perlakuan didefinisikan dari perilaku pasca-time-zero (mis. “minum obat minimal 6 bulan” → yang mati cepat otomatis jadi kontrol!).</div>

      <h2 id="propensity">Propensity Score &amp; IPTW — Si Penyeimbang</h2>
      <p><strong>Definisi.</strong> <strong>Propensity score</strong> e(X) = peluang menerima perlakuan given karakteristik X. <strong>Matching</strong>: pasangkan yang diobati dengan yang tidak ber-skor mirip. <strong>IPTW</strong>: bobot tiap pasien dengan 1/e(X) (diobati) atau 1/(1−e(X)) (tidak) — menciptakan populasi pseudo-acak.</p>
      <Tex math={String.raw`e(X) = P(T=1|X) \quad ; \quad w_i = \frac{T_i}{e(X_i)} + \frac{1-T_i}{1-e(X_i)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`e(X)`} />: propensity score: peluang diobati given X</li>
          <li><Tex math={String.raw`T_i`} />: perlakuan aktual pasien i (1/0)</li>
          <li><Tex math={String.raw`w_i`} />: bobot IPTW: pasien langka di kelompoknya dibobot besar</li>
      </ul>
      <p><strong>Interpretasi:</strong> IPTW membuat kelompok seimbang: pasien yang “seharusnya tidak diobati tapi diobati” (e kecil, T=1) dapat bobot besar — ia paling informatif tentang efek kausal. Setelah dibobot, cek: apakah karakteristik seimbang (standardized mean difference &lt; 0,1)?</p>
      <details className="worked">
        <summary>📐 Contoh: IPTW untuk obat jantung X</summary>
        <p>Pasien parah: e(X)=0,9 diobati. Pasien ringan: e(X)=0,1.<br />Pasien ringan yang diobati: w = 1/0,1 = <strong>10</strong>. Pasien parah yang diobati: w = 1/0,9 = 1,11.<br />Setelah pembobotan, distribusi keparahan kedua kelompok setara — seolah diacak.<br /><strong>Asumsi kunci:</strong> tidak ada confounder tak terukur (unconfoundedness) + setiap pasien punya peluang &gt;0 diobati/tidak (positivity). Keduanya <strong>tidak bisa diuji dari data</strong> — harus diargumenkan dari pengetahuan domain.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Propensity itu mak comblang: memasangkan yang mirip agar perbandingan adil. IPTW itu timbangan keadilan: memberi suara lebih besar pada yang jarang. Keduanya jujur soal satu hal: mereka hanya menyeimbangkan yang <em>terukur</em>.</p>
      <p><strong>Kapan memakai:</strong> Efek perlakuan dari observasional dengan banyak confounder terukur. Selalu laporkan balance diagnostik + analisis sensitivitas unmeasured confounding (E-value).</p>

      <PlotlyChart
        data={hd10PsData}
        title="Distribusi Propensity Score per Kelompok (sebelum balancing)"
        layout={hd10PsDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu X = skor peluang diobati. Kuning = yang benar-benar diobati, biru = tidak. Lihat di mana massa masing-masing menumpuk.</p>
        <p><strong>Interpretasi:</strong> Yang diobati menumpuk di skor tinggi, yang tidak di skor rendah — bukti confounding by indication: dokter memilih yang parah. Area overlap (tengah) adalah “wilayah perbandingan adil”; ujung tanpa overlap = positivity dilanggar (tidak ada pembanding) → batasi/truncate. Setelah IPTW/matching, dua distribusi ini harus bertumpuk.</p>
      </div>

      <h2 id="dag">DAG &amp; Immortal Time Bias — Si Peta dan Si Hantu</h2>
      <p><strong>Definisi.</strong> <strong>DAG</strong>: graf panah sebab-akibat untuk memutuskan variabel apa dikontrol (tutup backdoor path, jangan sentuh mediator/collider). <strong>Immortal time bias</strong>: periode follow-up yang <em>wajib selamat</em> untuk bisa masuk kelompok perlakuan — membuat perlakuan terlihat protektif.</p>
      <details className="worked">
        <summary>📐 Contoh: “Olahraga menurunkan kematian 50%” yang palsu</summary>
        <p>Studi: kelompok “rajin olahraga” = yang tercatat ikut program gym minimal 1 tahun. Untuk ikut 1 tahun, mereka <strong>harus hidup 1 tahun</strong> — yang mati di bulan 3 otomatis jadi “tidak olahraga”.<br />Hasil: olahraga terlihat protektif 50%, padahal sebagian adalah artefak keabadian.<br /><strong>Perbaikan:</strong> time zero sinkron + perlakuan = “mulai program” (bukan “bertahan 1 tahun”) + analisis time-varying.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> DAG itu peta sebelum berlayar: tanpanya kamu mengontrol apa saja yang terlihat ‘berbeda’ dan menabrak karang collider. Immortal time itu hantu: waktu yang tidak nyata tapi ikut dihitung — pasien “harus hidup” 6 bulan untuk dikategorikan ‘minum obat 6 bulan’, lalu 6 bulan keabadian itu dikreditkan ke obat.</p>
      <p><strong>Kapan memakai:</strong> Selalu gambar DAG sebelum analisis kausal. Selalu curigai immortal time bila definisi perlakuan memakai durasi/kejadian pasca-time-zero.</p>
      <div className="callout"><strong>Aturan DAG 10 detik:</strong> kontrol <strong>confounder</strong> (panah ke paparan DAN outcome) ✓ &nbsp;|&nbsp; jangan kontrol <strong>mediator</strong> (di jalur kausal) ✗ &nbsp;|&nbsp; jangan kontrol <strong>collider</strong> (panah dari dua arah masuk) ✗ — mengontrol collider MEMBUKA bias baru!</div>

      <h2 id="pendalaman">🔍 Pendalaman: Anatomi Target Trial Emulation</h2>
      <details className="worked">
        <summary>📐 Worked example: meniru RCT obat jantung dari klaim BPJS (klik untuk buka)</summary>
        <p>Pertanyaan: apakah obat X menurunkan mortalitas 1 tahun pada pasien gagal jantung? Data: klaim BPJS 2020–2023, n=50.000.</p>
        <p><strong>Langkah 1 — Tulis protokol target trial <em>seolah</em> akan merandomisasi.</strong> Kriteria inklusi: diagnosis gagal jantung pertama kali, usia 40–80, tanpa riwayat obat X. “Waktu nol” = tanggal diagnosis pertama. Perlakuan: mulai obat X dalam 30 hari vs tidak. <strong>Aturan emas:</strong> semua kriteria harus bisa dicek <em>pada/ sebelum waktu nol</em> — memakai info masa depan = immortal time bias.</p>
        <p><strong>Langkah 2 — Emulasi randomisasi dengan IPTW.</strong> Hitung propensity score: P(dapat obat X | usia, keparahan, komorbiditas, RS). Bobot = 1/PS untuk yang diobati, 1/(1−PS) untuk kontrol. Cek keseimbangan: standardized mean difference tiap kovariat &lt; 0,1. Jika tidak tercapai → model PS salah spesifikasi, perbaiki.</p>
        <p><strong>Langkah 3 — Estimasi efek.</strong> Mortalitas 1 tahun terbobot: obat X 12%, kontrol 15% → risk difference −3 poin, RR 0,80. Bandingkan dengan angka <em>mentah</em> (obat X 18% vs kontrol 10% — terlihat membunuh!): pembalikan arah ini adalah <strong>tanda confounding by indication berhasil dikoreksi</strong>, bukan tanda analisis salah.</p>
        <p><strong>Langkah 4 — Uji kerapuhan.</strong> E-value: seberapa kuat confounder tak terukur harus ada untuk menjelaskan habis efek ini? Jika E-value kecil (mis. 1,3), kesimpulan rapuh — satu variabel tak terukur (mis. frailty yang tidak terkode) bisa membatalkannya. Laporkan selalu.</p>
        <p><strong>Pelajaran:</strong> target trial emulation bukan “teknik fancy” — ia adalah <strong>disiplin berpikir</strong>: memaksa analis menulis dulu trial idealnya sebelum menyentuh data. 80% nilainya ada di langkah 1, bukan di rumus IPTW.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — DAG adalah mesin pembuat keputusan variabel:</strong> Kebanyakan analis memilih kovariat untuk dikontrol dengan “masukkan semua yang signifikan” — cara yang bisa <em>menambah</em> bias (mengontrol mediator = membunuh efek yang ingin diukur; mengontrol collider = membuka jalur bias baru). DAG memaksa keputusan eksplisit: kontrol <strong>confounder</strong> (penyebab umum paparan & outcome), jangan sentuh <strong>mediator</strong> (jalan efek) dan <strong>collider</strong> (akibat bersama). Aturan 10 detik: gambar panah sebab-akibat di kertas sebelum buka software — 5 menit menggambar menghemat 5 minggu menyesali model.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — “vaksin meningkatkan risiko autoimun”:</strong> Klaim semacam ini (mini-case lesson ini) punya pola yang berulang di Indonesia pasca-vaksinasi massal COVID-19: laporan kejadian ikutan (KIPI) dibandingkan <em>mentah</em> antara yang divaksin vs tidak. Confounding by indication-nya: yang divaksin lebih dulu adalah <strong>lansia dan komorbid</strong> — kelompok yang <em>memang</em> lebih sering mengalami kejadian kesehatan apapun. Analisis Komnas KIPI yang benar memakai <strong>self-controlled case series</strong> (tiap orang jadi kontrol dirinya sendiri) atau pembanding periode — dan inilah mengapa klaim viral “X orang meninggal setelah vaksin” tidak pernah menjadi bukti kausal tanpa desain yang tepat. Analis yang paham ini bisa menjelaskan ke publik dalam 3 kalimat — skill komunikasi yang langka dan berharga.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Tiga Asumsi yang Tidak Bisa Diuji (Tapi Wajib Diakui)</h2>
      <p>Setiap estimasi kausal dari data observasional berdiri di atas tiga asumsi <strong>yang tidak bisa dibuktikan oleh data itu sendiri</strong>. Profesional tidak berpura-pura asumsi ini terpenuhi — mereka <strong>menyebutkannya, mengujinya sebisa mungkin, dan mengukur kerapuhannya</strong>.</p>
      <p><strong>1. Exchangeability (tidak ada confounding tak terukur).</strong> “Kelompok obat vs kontrol <em>akan</em> punya outcome sama jika perlakuan ditukar.” Tidak bisa diuji langsung — tapi bisa <strong>diserang</strong>: (a) <em>negative control outcome</em> — uji metodemu pada outcome yang <em>pasti tidak</em> dipengaruhi obat (mis. patah tulang untuk obat jantung): jika “efek” muncul di sana, confounding belum terkontrol. (b) <em>E-value</em> — seberapa kuat confounder tak terukur harus ada untuk membatalkan hasilmu; E-value 1,3 = rapuh, 3+ = kokoh.</p>
      <p><strong>2. Positivity (setiap orang punya peluang mendapat tiap perlakuan).</strong> Jika pasien sangat parah <em>selalu</em> dapat obat X (probabilitas → 1) dan yang ringan <em>tidak pernah</em> (→ 0), maka tidak ada <em>pembanding</em> — IPTW meledak (bobot raksasa), stratifikasi kosong. <strong>Solusi:</strong> batasi ke wilayah <em>overlap</em> (trimming propensity ekstrem) dan <strong>akui</strong> bahwa kesimpulan hanya berlaku untuk populasi “yang bisa diobati maupun tidak” — bukan semua pasien.</p>
      <p><strong>3. Consistency (perlakuan terdefinisi dengan baik).</strong> “Mendapat obat X” — dosis berapa? berapa lama? patuh atau tidak? Jika “terpapar” mencampur dosis 5mg dan 50mg, estimasi kausalmu adalah <strong>rata-rata dari hal yang berbeda</strong> — tidak bermakna untuk keputusan apapun (“resepkan dosis berapa, Dok?”). Definisikan perlakuan <strong>sepresisi resep dokter</strong>, atau akui estimasimu kabur.</p>
      <div className="callout">
        <p><strong>Standar pelaporan kausal:</strong> setiap analisis kausal observasional wajib punya paragraf <strong>“asumsi dan kerapuhan”</strong>: apa yang diasumsikan, apa negative control-nya, berapa E-value-nya, di populasi mana positivity berlaku. Tanpa paragraf ini, analisimu adalah <strong>klaim</strong>, bukan <strong>bukti</strong>.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Propensity score “memperbaiki” confounding seperti randomisasi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Tidak. Randomisasi menyeimbangkan yang tak terukur; propensity hanya yang terukur dan dimasukkan model. Asumsi unconfoundedness tidak bisa diuji — ia diargumenkan dari pengetahuan klinis + diuji ketahanannya via E-value/sensitivitas. Klaim “seolah RCT” tanpa caveat adalah overselling.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Semakin banyak variabel dikontrol, semakin kausal&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Mengontrol mediator menghilangkan efek yang ingin diukur; mengontrol collider MEMBUAT bias baru; mengontrol variabel yang dipengaruhi perlakuan merusak. DAG dulu, baru pilih — jumlah bukan kualitas.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Immortal time bias hanya masalah studi obat&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Ia muncul di mana saja definisi kelompok memakai masa depan: “pekerja yang bertahan 5 tahun lebih sehat” (healthy worker), “pasien yang menyelesaikan program”, “RS yang terakreditasi”. Polanya sama: syarat bertahan hidup dikreditkan sebagai efek.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membongkar Immortal Time Bias</h2>
      <details className="worked">
        <summary>📐 Worked example: “obat yang membuat pasien kebal mati 6 bulan” (klik untuk buka)</summary>
        <p>Studi klaim: pasien yang <strong>pernah</strong> menerima obat X dalam 1 tahun punya mortalitas <strong>jauh lebih rendah</strong> (HR 0,55). Obat ajaib?</p>
        <p><strong>Langkah 1 — Gambar garis waktunya.</strong> Definisi “pengguna obat X” = menerima ≥1 resep <em>kapan saja</em> dalam tahun follow-up. Pasien A: didiagnosis Januari, resep pertama <strong>Juli</strong>, hidup hingga Desember. Periode Januari–Juli = <strong>immortal time</strong>: ia <em>harus</em> hidup hingga Juli untuk bisa diklasifikasikan sebagai “pengguna” — kematian di periode ini <strong>mustahil</strong> secara definisi.</p>
        <p><strong>Langkah 2 — Hitung biasnya.</strong> Misal 1.000 “pengguna”: rata-rata immortal time 6 bulan × 1.000 = <strong>500 person-tahun kebal mati</strong> yang dikreditkan ke kelompok obat — padahal itu <em>bukan</em> efek obat, melainkan <em>syarat definisi</em>. Kelompok “non-pengguna” mencakup semua yang mati dini (yang tidak sempat dapat resep). HR 0,55 sebagian besar adalah <strong>artefak klasifikasi</strong>.</p>
        <p><strong>Langkah 3 — Perbaiki dengan desain yang benar.</strong> (a) <strong>Landmark analysis</strong>: tetapkan landmark (mis. 6 bulan); hanya pasien yang <em>hidup</em> hingga landmark yang masuk; klasifikasikan pengguna/non-pengguna <em>berdasarkan status di landmark</em>. (b) <strong>Time-varying exposure</strong>: model Cox dengan status obat sebagai kovariat <em>berubah-waktu</em> — tiap pasien berkontribusi sebagai “non-pengguna” hingga resep pertama, “pengguna” setelahnya. (c) <strong>Clone-censor-weight</strong> (emulasi trial formal): kloning tiap pasien ke kedua “lengan”, sensor saat menyimpang.</p>
        <p><strong>Langkah 4 — Hasil setelah koreksi.</strong> HR terkoreksi = <strong>0,92</strong> (tidak signifikan) — “keajaiban” lenyap. Inilah pola klasik: <strong>immortal time bias selalu menguntungkan kelompok “terpapar”</strong> — karena terpapar butuh waktu, dan waktu butuh hidup.</p>
        <p><strong>Langkah 5 — Aturan deteksi 10 detik.</strong> Setiap studi observasional dengan definisi paparan “pernah menerima X <em>selama</em> follow-up”: <strong>tanyakan “kapan waktu nol, dan apakah klasifikasi memakai info masa depan?”</strong> — Jika ya, asumsikan bias hingga terbukti tidak.</p>
        <p><strong>Pelajaran:</strong> immortal time bias adalah <strong>pembunuh senyap</strong> studi observasional — ia membuat obat tidak berguna terlihat menyelamatkan nyawa, dan ia bersembunyi di <em>definisi variabel</em>, bukan di rumus.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Prinsip target trial emulation yang paling sering dilanggar: <strong>“waktu nol, kriteria, dan klasifikasi perlakuan harus bisa ditentukan tanpa melihat masa depan.”</strong> Tempel prinsip ini di monitor — ia menangkap 80% bias desain.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Tulis <strong>protokol target trial satu halaman</strong> sebelum query apapun. Dokumen ini adalah perisai terbaikmu saat reviewer bertanya “kenapa time zero di sini?”</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setelah IPTW/matching, selalu tampilkan <strong>tabel balance</strong> (SMD sebelum vs sesudah). Tanpa bukti seimbang, angka efek tidak ada artinya.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hitung <strong>E-value</strong> untuk temuan kunci: seberapa kuat confounder tak terukur harus ada untuk menjelaskan habis efekmu. E-value kecil = temuan rapuh, katakan dengan jujur.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Confounding by Indication — Obat Terlihat Membunuh</h2>
      <p>Simulasikan: obat TIDAK berpengaruh, tapi hanya diresepkan ke yang parah. Hitung mortalitas mentah per kelompok, lalu stratifikasi keparahan. Saksikan vonis palsu runtuh.</p>
      <PyodideLab
        title="🔬 Lab 1: Confounding by Indication — Obat Terlihat Membunuh"
        hint="Ubah probabilitas resep pada yang parah dari 0.8 ke 0.5. Perhatikan bias mentah menyusut — confounding by indication melemah saat resep kurang selektif."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Stratifikasi Propensity (5 Strata)</h2>
      <p>Bagi pasien ke 5 strata propensity score, hitung efek per strata, lalu rata-ratakan berbobot. Ini versi sederhana dari IPTW/matching.</p>
      <PyodideLab
        title="🔬 Lab 2: Stratifikasi Propensity (5 Strata)"
        hint="Bandingkan efek mentah vs efek terstratifikasi. Selisihnya = besar confounding yang berhasil dikoreksi. Coba tambah confounder tak terukur (acak) — stratifikasi tak bisa mengoreksinya."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Mengevaluasi JKN dengan Difference-in-Differences</h2>
      <p>Pertanyaan kebijakan nyata: <strong>“Apakah JKN (2014) menurunkan kematian ibu/anak?”</strong> RCT tidak mungkin (tidak etis menolak asuransi). Inilah panggung <strong>difference-in-differences (DiD)</strong> — dan jebakannya khas Indonesia.</p>
      <p><strong>Desain:</strong> bandingkan perubahan outcome <em>sebelum–sesudah 2014</em> antara daerah dengan <strong>cakupan JKN tinggi</strong> vs <strong>rendah</strong> (atau: Indonesia vs negara tetangga dengan tren pra-2014 paralel). Efek = (sesudah−sebelum)<sub>tinggi</sub> − (sesudah−sebelum)<sub>rendah</sub>.</p>
      <p><strong>Jebakan 1 — Tren paralel yang tidak paralel.</strong> Daerah cakupan tinggi JKN (perkotaan, Jawa) <em>sudah</em> punya tren penurunan kematian lebih cepat sebelum 2014 (faskes lebih baik). DiD mentah <strong>melebih-lebihkan</strong> efek JKN. Solusi: uji tren pra-intervensi 5 tahun; jika tidak paralel → synthetic control (bangun “Indonesia sintetis” dari kombinasi daerah/negara pembanding).</p>
      <p><strong>Jebakan 2 — Treatment bertahap, bukan saklar.</strong> JKN tidak “menyala” 1 Januari 2014 serentak: pendaftaran bertahap, faskes bertahap, pemahaman bertahap. DiD dua-periode klasik bias; pakai <strong>staggered DiD</strong> (Callaway–Sant'Anna) yang menghormati waktu adopsi berbeda per daerah.</p>
      <p><strong>Jebakan 3 — Outcome yang salah ukur.</strong> “Kematian ibu tercatat” <em>naik</em> setelah JKN di beberapa daerah — bukan karena JKN membunuh, melainkan karena <strong>pencatatan membaik</strong> (dulu tidak tercatat, kini tercatat). Evaluasi yang memakai outcome administratif tanpa koreksi kualitas pencatatan akan <strong>menghukum program yang memperbaiki data</strong>. Selalu pisahkan “efek pada kejadian” dari “efek pada pencatatan”.</p>
      <div className="tip">
        <p><strong>💡 Intuisi kebijakan:</strong> Hampir <strong>semua</strong> evaluasi program kesehatan Indonesia (JKN, stunting, imunisasi) adalah quasi-eksperimen — karena RCT kebijakan jarang mungkin. Analis yang menguasai DiD + synthetic control + staggered design adalah <strong>penilai program</strong> yang dicari Bappenas, Kemenkes, dan lembaga donor. Ini skill dengan permintaan jauh melebihi suplai.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Banyak confounder terukur, overlap baik → IPTW</h3>
        <p><strong>Kondisi:</strong> Distribusi propensity kedua kelompok bertumpuk; ingin estimasi populasi.</p>
        <p><strong>Kenapa:</strong> Memakai semua data; balance bisa dicek via SMD.</p>
        <p><strong>Contoh nyata:</strong> Efek statin dari klaim dengan puluhan kovariat.</p>
      </div>
      <div className="decision-card">
        <h3>2. Overlap buruk di ujung → Matching + trim</h3>
        <p><strong>Kondisi:</strong> Ada wilayah propensity tanpa pembanding (positivity lemah).</p>
        <p><strong>Kenapa:</strong> Fokus pada wilayah yang benar-benar comparable; jujur soal generalisasi.</p>
        <p><strong>Contoh nyata:</strong> Obat baru yang hampir selalu untuk kasus berat.</p>
      </div>
      <div className="decision-card">
        <h3>3. Definisi perlakuan pakai masa depan → Perbaiki desain dulu</h3>
        <p><strong>Kondisi:</strong> Dugaan immortal time bias.</p>
        <p><strong>Kenapa:</strong> Tidak ada metode statistik yang memperbaiki time zero yang salah.</p>
        <p><strong>Contoh nyata:</strong> Ulangi dengan time zero sinkron + perlakuan time-varying.</p>
      </div>
      <div className="decision-card">
        <h3>4. Butuh argumen kausal ke pembuat kebijakan → Triangulasi</h3>
        <p><strong>Kondisi:</strong> Satu metode tak cukup meyakinkan.</p>
        <p><strong>Kenapa:</strong> IPTW + matching + outcome negatif kontrol + E-value: bila semua searah, argumen kuat.</p>
        <p><strong>Contoh nyata:</strong> Evaluasi program JKN terhadap mortalitas.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tulis protokol target trial dulu, query kemudian.</li>
          <li>Time zero harus sama untuk semua kelompok.</li>
          <li>Cek balance (SMD &lt; 0,1) setelah IPTW/matching.</li>
          <li>Laporkan E-value: seberapa rapuh temuanmu.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: “Vaksin Meningkatkan Risiko Autoimun”?</h2>
      <div className="callout">
        <p>Analisis EHR 500.000 orang: yang divaksinasi punya diagnosis autoimun <strong>lebih tinggi</strong> (HR=1,3) dalam 1 tahun. Grup antivaksin menyebarkan: “bukti vaksin berbahaya!” Kamu diminta verifikasi cepat.</p>
      <p>Cek desain: time zero = tanggal vaksinasi untuk kelompok vaksin, tapi <strong>tanggal awal studi</strong> untuk kontrol. Kelompok vaksin rata-rata 15 tahun lebih tua (program prioritas lansia). Tidak ada adjustment.</p>
        <p><strong>Pertanyaan:</strong> Identifikasi minimal 3 cacat fatal dan desain ulang yang benar.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Time zero tidak sinkron: kelompok vaksin memulai “jam” lebih lambat → immortal time + seleksi. (2) Confounding by indication: vaksin diprioritaskan untuk lansia/komorbid — yang memang berisiko autoimun lebih tinggi. (3) Tanpa adjustment apapun: HR mentah tidak bermakna. Desain ulang: target trial emulation — eligibility sama (mis. usia 18+, tanpa autoimun sebelumnya), time zero = tanggal eligibility untuk SEMUA, perlakuan = vaksinasi dalam 90 hari (time-varying), lalu Cox + IPTW dengan usia/komorbid, plus kontrol negatif (outcome yang tak mungkin dipengaruhi vaksin). Prediksi: HR terkoreksi mendekati 1. Pelajaran: HR mentah dari EHR adalah bahan hoaks yang sempurna.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Confounding by indication artinya…"
        options={["Obat menyebabkan indikasinya",
          "Alasan pemberian obat (keparahan) juga memengaruhi outcome — membuat obat terlihat buruk",
          "Indikasi obat selalu salah",
          "Pasien menolak obat"]}
        correct={1}
        explanation="Benar: dokter memberi obat ke yang paling sakit. Tanpa adjustment, semua obat di data observasional terlihat membunuh."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Langkah PERTAMA yang benar untuk pertanyaan kausal dari EHR?"
        options={["Langsung regresi",
          "Tulis protokol target trial (eligibility, time zero, perlakuan)",
          "Hapus outlier",
          "Pilih model ML"]}
        correct={1}
        explanation="Benar: naskah dulu, query kemudian. Sebagian besar bias observasional lahir dari desain yang improvisasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. IPTW memberi bobot besar kepada…"
        options={["Pasien termahal",
          "Pasien yang “jarang” di kelompoknya (mis. ringan tapi diobati) — paling informatif",
          "Pasien terbaru",
          "Pasien yang sembuh"]}
        correct={1}
        explanation="Benar: w=1/e(X). Mereka menciptakan keseimbangan semu; tapi hanya untuk confounder terukur."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Asumsi propensity yang TIDAK bisa diuji dari data?"
        options={["Positivity",
          "Tidak ada confounder tak terukur (unconfoundedness)",
          "Ukuran sampel",
          "Distribusi normal"]}
        correct={1}
        explanation="Benar: unconfoundedness adalah asumsi iman — diargumenkan dari pengetahuan domain + diuji via sensitivitas (E-value)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Immortal time bias terjadi ketika…"
        options={["Pasien abadi",
          "Definisi kelompok perlakuan mensyaratkan selamat selama periode tertentu — waktu “abadi” itu dikreditkan ke perlakuan",
          "Follow-up terlalu lama",
          "Obat kedaluwarsa"]}
        correct={1}
        explanation="Benar: “minum obat 6 bulan” mensyaratkan hidup 6 bulan. Perbaiki: time zero sinkron + perlakuan time-varying."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Mengontrol collider dalam DAG akan…"
        options={["Mengurangi bias",
          "MEMBUKA bias baru (jangan lakukan!)",
          "Tidak ada efek",
          "Menambah power"]}
        correct={1}
        explanation="Benar: collider = dua panah masuk. Dikontrol → membuka jalur palsu. Inilah kenapa “kontrol semua” berbahaya."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Confounding by indication</strong>: obat diberikan ke yang paling sakit — vonis palsu default data observasional.</li>
          <li><strong>Target trial emulation</strong>: tulis protokol RCT hipotetis dulu (eligibility, time zero sinkron, perlakuan jelas).</li>
          <li><strong>Propensity/matching/IPTW</strong>: seimbangkan yang terukur; cek SMD &lt; 0,1.</li>
          <li>Asumsi tak teruji: <strong>unconfoundedness + positivity</strong> — argumenkan, lalu E-value.</li>
          <li><strong>DAG</strong>: kontrol confounder; JANGAN sentuh mediator (efek total) dan collider.</li>
          <li><strong>Immortal time bias</strong>: definisi kelompok dari masa depan = waktu hantu.</li>
          <li>Triangulasi (multi-metode + kontrol negatif) untuk argumen kebijakan.</li>
          <li>Fondasi untuk HD12 (evaluasi model) dan membaca literatur observasional apa pun.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd9-uji-diagnostik" className="btn btn-secondary btn-sm">← HD9</Link>
        <Link href="/learn/hd11-wrangling-ehr" className="btn btn-primary btn-sm">HD11 →</Link>
      </div>
    </div>
  );
}
