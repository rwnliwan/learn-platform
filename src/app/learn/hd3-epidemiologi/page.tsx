"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd3EpidemiologiPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd3IpData = [{"x": ["2019", "2020", "2021", "2022", "2023"], "y": [8.2, 9.1, 10.5, 9.8, 8.9], "type": "scatter", "mode": "lines+markers", "name": "Insidens TB/100rb", "line": {"color": "#e8a838"}}, {"x": ["2019", "2020", "2021", "2022", "2023"], "y": [42, 48, 55, 58, 56], "type": "scatter", "mode": "lines+markers", "name": "Prevalensi DM/1.000", "yaxis": "y2", "line": {"color": "#2a7de1"}}];
  const hd3IpDataLayout = {"xaxis": {"title": "Tahun"}, "yaxis": {"title": "Insidens TB per 100rb"}, "yaxis2": {"title": "Prevalensi DM per 1.000", "overlaying": "y", "side": "right"}, "showlegend": true};

  const lab1Code = "a, b, c, d = 40, 160, 10, 190  # ubah sesukamu\nr1 = a/(a+b); r0 = c/(c+d)\nRR = r1/r0\nOR = (a*d)/(b*c)\nARR = r1 - r0\nNNT = 1/abs(ARR) if ARR != 0 else float('inf')\nprint(f'risiko terpapar     = {r1:.3f}')\nprint(f'risiko tak terpapar = {r0:.3f}')\nprint(f'RR  = {RR:.2f}  <- “risiko {RR:.1f}x lipat”')\nprint(f'OR  = {OR:.2f}  <- hanya ≈ RR bila penyakit jarang')\nprint(f'ARR = {ARR:.3f} ({ARR*100:.1f} poin persen)')\nprint(f'NNT = {NNT:.0f}  <- cegah paparan pada NNT orang = 1 kasus dicegah')";

  const lab2Code = "# kematian per kelompok umur (kasus, populasi)\nA = {'muda': (20, 8000), 'tua': (180, 2000)}\nB = {'muda': (30, 9000), 'tua': (90, 1000)}\nstd_pop = {'muda': 8500, 'tua': 1500}  # populasi standar\ndef kasar(d):\n    k = sum(v[0] for v in d.values()); p = sum(v[1] for v in d.values())\n    return k/p*1000\ndef standar(d):\n    return sum(v[0]/v[1]*std_pop[k] for k,v in d.items())/sum(std_pop.values())*1000\nprint(f'kasar  A={kasar(A):.1f}  B={kasar(B):.1f} per 1000  <- A terlihat lebih buruk')\nprint(f'standar A={standar(A):.1f}  B={standar(B):.1f} per 1000  <- setelah disetarakan umur')\nprint()\nprint('Kesimpulan: A hanya ‘terlihat’ buruk karena penduduknya lebih tua.')";

  const hd3OrRrData = [{"x": ["Penyakit jarang (2%)", "Penyakit umum (30%)"], "y": [2.1, 2.0], "type": "bar", "name": "RR", "marker": {"color": "#2a7de1"}}, {"x": ["Penyakit jarang (2%)", "Penyakit umum (30%)"], "y": [2.14, 3.5], "type": "bar", "name": "OR", "marker": {"color": "#e8a838"}}];
  const hd3OrRrDataLayout = {"barmode": "group", "xaxis": {"title": ""}, "yaxis": {"title": "Nilai"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD3 &mdash; Health Data Scientist</span>
        <h1 className="display-title">Insidens, Prevalensi, RR:<br />Bahasa Angka Epidemiologi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Desa A vs Desa B</a></li>
          <li><a href="#insidens">Insidens &amp; Prevalensi — Si Kembar yang Tertukar</a></li>
          <li><a href="#rr">RR, OR, HR — Si Pembanding Risiko</a></li>
          <li><a href="#nnt">NNT &amp; Standardisasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Hitung Insidens &amp; Prevalensi</a></li>
          <li><a href="#lab2">🔬 Lab 2: RR vs OR — Kapan Beda Jauh</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Dari “50%” ke NNT</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Tiga Ilusi Waktu</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Membaca Riskesdas</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Dari Tabel 2×2 ke Keputusan Nyata</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menghitung <strong>insidens, prevalensi, RR, OR, ARR, NNT</strong> dari tabel 2×2 dengan benar.</li>
          <li>Menjelaskan dengan bahasa sendiri kapan memakai RR vs OR vs HR.</li>
          <li>Menghitung <strong>angka terstandardisasi</strong> untuk membandingkan dua populasi berstruktur umur beda.</li>
          <li>Mendeteksi kesalahan umum: memakai prevalensi untuk klaim kausal, OR sebagai RR pada penyakit umum.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Desa A vs Desa B</h2>
      <div className="story">
        <p>Dua desa, masing-masing 1.000 penduduk. Desa A melaporkan <strong>50 kasus TB tahun ini</strong>, Desa B <strong>30 kasus</strong>. Kepala dinas menyimpulkan: “Desa A dua kali lebih parah, kirim tim ke sana!” Tapi epidemiolog meminta data mentah: ternyata di Desa A, 40 dari 50 kasus adalah <strong>kasus lama yang masih berobat</strong> (prevalensi), kasus <em>baru</em> hanya 10. Di Desa B, 25 dari 30 adalah kasus <strong>baru</strong> (insidens).</p>
      <p>Penularan aktif justru lebih panas di Desa B. Satu kata yang tertukar — insidens vs prevalensi — nyaris membuat intervensi salah sasaran. Lesson ini memastikan kamu tidak pernah menukar keduanya, plus seluruh kosakata angka epidemiologi yang dipakai di jurnal, laporan Dinkes, dan brosur obat.</p>
      <p><strong>Twist-nya:</strong> desa yang terlihat <em>lebih parah</em> (50 kasus) ternyata <em>lebih aman</em> — dan desa yang terlihat lebih baik justru tempat penularan aktif. Angka yang dilaporkan media (total kasus) mengukur <strong>beban masa lalu</strong>, sementara yang dibutuhkan untuk keputusan (kasus baru) mengukur <strong>api yang sedang menyala</strong>. Di epidemiologi, <strong>angka yang benar untuk pertanyaan yang salah adalah jawaban yang salah</strong> — dan lesson ini memastikan kamu selalu memasangkan angka dengan pertanyaan yang tepat.</p>
      </div>

      <h2 id="insidens">Insidens &amp; Prevalensi — Si Kembar yang Tertukar</h2>
      <p><strong>Definisi.</strong> <strong>Insidens</strong> = kasus <em>baru</em> per populasi berisiko per periode (mengukur kecepatan penularan/kejadian). <strong>Prevalensi</strong> = <em>seluruh</em> kasus (baru + lama) per populasi pada satu titik waktu (mengukur beban).</p>
      <Tex math={String.raw`\text{Insidens} = \frac{\text{kasus baru}}{\text{populasi berisiko}} \quad ; \quad \text{Prevalensi} = \frac{\text{semua kasus}}{\text{total populasi}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{kasus baru}`} />: orang yang pertama kali didiagnosis dalam periode amatan</li>
          <li><Tex math={String.raw`\text{populasi berisiko}`} />: orang yang <em>bisa</em> terkena (yang sudah sakit dikeluarkan dari pembagi!)</li>
          <li><Tex math={String.raw`\text{semua kasus}`} />: kasus baru + kasus lama yang masih ada</li>
      </ul>
      <p><strong>Interpretasi:</strong> Insidens menjawab “seberapa cepat penyakit menyebar”; prevalensi menjawab “berapa beban yang harus ditanggung sistem saat ini”. Keduanya benar — untuk pertanyaan berbeda.</p>
      <details className="worked">
        <summary>📐 Contoh: stunting di sebuah kecamatan</summary>
        <p>Populasi balita 2.000. Survei menemukan 400 balita stunting (200 kasus lama, 200 terdeteksi baru tahun ini).<br /><strong>Prevalensi</strong> = 400/2.000 = <strong>20%</strong> (beban saat ini).<br />Untuk insidens: populasi berisiko = 2.000 − 200 (yang sudah stunting tidak “berisiko jadi stunting”) = 1.800.<br /><strong>Insidens</strong> = 200/1.800 = <strong>11,1%</strong> per tahun (kecepatan kasus baru).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Insidens itu speedometer — mengukur laju. Prevalensi itu foto tangki bensin — mengukur isi saat ini. Kamu tidak menilai kecepatan mobil dari foto tangki, dan tidak menilai beban BBM dari speedometer.</p>
      <p><strong>Kapan memakai:</strong> Evaluasi penularan/intervensi pencegahan → insidens. Perencanaan kebutuhan layanan/obat → prevalensi.</p>

      <PlotlyChart
        data={hd3IpData}
        title="Insidens TB vs Prevalensi Diabetes (ilustratif, per 100rb / per 1.000)"
        layout={hd3IpDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Dua garis dengan sumbu kiri (kuning, insidens TB) dan kanan (biru, prevalensi DM). Baca tren masing-masing garis terhadap sumbunya sendiri — jangan bandingkan tinggi antar garis (satuannya beda!).</p>
        <p><strong>Interpretasi:</strong> Insidens TB naik-turun mengikuti dinamika penularan dan penemuan kasus; prevalensi diabetes bergerak lambat naik karena penyakit kronis menumpuk (kasus lama tidak sembuh). Inilah sifatnya: <strong>insidens lincah, prevalensi lembam</strong>. Program pencegahan dinilai dari insidens; kebutuhan layanan dari prevalensi.</p>
      </div>

      <h2 id="rr">RR, OR, HR — Si Pembanding Risiko</h2>
      <p><strong>Definisi.</strong> <strong>RR (Relative Risk)</strong> = rasio risiko terpapar vs tidak terpapar. <strong>OR (Odds Ratio)</strong> = rasio odds (bukan risiko). <strong>HR (Hazard Ratio)</strong> = versi RR untuk data waktu-kejadian (survival).</p>
      <Tex math={String.raw`RR = \frac{a/(a+b)}{c/(c+d)} \quad ; \quad OR = \frac{a/b}{c/d} = \frac{ad}{bc}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`a`} />: terpapar dan sakit</li>
          <li><Tex math={String.raw`b`} />: terpapar dan sehat</li>
          <li><Tex math={String.raw`c`} />: tidak terpapar dan sakit</li>
          <li><Tex math={String.raw`d`} />: tidak terpapar dan sehat</li>
          <li><Tex math={String.raw`ad/bc`} />: rumus cepat OR dari tabel 2×2</li>
      </ul>
      <p><strong>Interpretasi:</strong> RR = 2 artinya risiko kelompok terpapar <strong>dua kali lipat</strong>. OR ≈ RR hanya jika penyakitnya <strong>jarang</strong> (&lt;10%); pada penyakit umum OR melebih-lebihkan.</p>
      <details className="worked">
        <summary>📐 Contoh: merokok dan TB (tabel 2×2)</summary>
        <p>Tabel: perokok sakit 40 (a), perokok sehat 160 (b); bukan perokok sakit 10 (c), bukan perokok sehat 190 (d).<br />Risiko perokok = 40/200 = 0,20. Risiko bukan perokok = 10/200 = 0,05.<br /><strong>RR</strong> = 0,20/0,05 = <strong>4,0</strong> (risiko 4x lipat).<br /><strong>OR</strong> = (40×190)/(160×10) = 7600/1600 = <strong>4,75</strong>.<br />Karena TB relatif jarang di sampel ini, OR (4,75) dekat dengan RR (4,0) — tapi tidak sama.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> RR itu jujur dan intuitif (“risiko dua kali lipat”). OR itu akuntan yang licin — muncul karena matematika regresi logistik, lalu disalahartikan sebagai RR. HR adalah RR yang sabar: membandingkan kecepatan kejadian sepanjang waktu.</p>
      <p><strong>Kapan memakai:</strong> Kohort/RCT → RR (risiko bisa dihitung langsung). Case-control → OR (hanya OR yang valid). Data survival → HR.</p>
      <div className="callout callout-warning"><strong>Jebakan brosur obat:</strong> “Menurunkan risiko 50%!” (RRR = 50%) terdengar hebat — tapi jika risiko awal 2% menjadi 1%, penurunan absolutnya hanya <strong>1 poin persen</strong>. Selalu tanya risiko absolutnya (lihat NNT di bawah).</div>

      <h2 id="nnt">NNT &amp; Standardisasi — Si Penerjemah Keputusan</h2>
      <p><strong>Definisi.</strong> <strong>ARR</strong> (Absolute Risk Reduction) = selisih risiko absolut. <strong>NNT</strong> (Number Needed to Treat) = 1/ARR: berapa pasien harus diobati agar 1 pasien terbantu. <strong>Standardisasi</strong>: menyesuaikan angka agar dua populasi berstruktur umur beda bisa dibandingkan adil.</p>
      <Tex math={String.raw`NNT = \frac{1}{ARR} = \frac{1}{R_{kontrol} - R_{obat}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`R_{kontrol}`} />: risiko kejadian pada kelompok kontrol (angka absolut, mis. 0,02)</li>
          <li><Tex math={String.raw`R_{obat}`} />: risiko kejadian pada kelompok obat</li>
          <li><Tex math={String.raw`ARR`} />: selisih absolut — fondasi NNT</li>
      </ul>
      <p><strong>Interpretasi:</strong> NNT = 50 artinya obati 50 pasien agar 1 terhindar dari kejadian. Makin kecil NNT, makin “worth it” intervensinya. NNT menerjemahkan statistik ke bahasa anggaran.</p>
      <details className="worked">
        <summary>📐 Contoh: NNT obat pencegah stroke</summary>
        <p>Risiko stroke 5 tahun: kontrol 4% (0,04), obat 3% (0,03).<br />ARR = 0,04 − 0,03 = 0,01.<br /><strong>NNT</strong> = 1/0,01 = <strong>100</strong>.<br />Artinya: obati 100 pasien selama 5 tahun untuk mencegah 1 stroke. Klaim “efikasi 25%” (relatif) vs realita “100 orang diobati untuk 1 yang terbantu” — keduanya benar, yang kedua jujur untuk pengambil keputusan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> NNT adalah penerjemah: mengubah bahasa relatif ilmuwan (“50%!”) menjadi bahasa absolut bendahara (“100 orang, sekian miliar”). Standardisasi adalah wasit: memastikan pertandingan antar populasi adil walau komposisi umurnya beda.</p>
      <p><strong>Kapan memakai:</strong> Menilai kelayakan intervensi/program → NNT. Membandingkan angka kematian antar daerah dengan struktur umur beda → standardisasi (mis. AKI antar provinsi).</p>

      <h2 id="pendalaman">🔍 Pendalaman: Dari Tabel 2×2 ke Keputusan Nyata</h2>
      <details className="worked">
        <summary>📐 Worked example: RR vs OR dari satu tabel 2×2 (klik untuk buka)</summary>
        <p>Studi kohort: 2.000 orang diikuti 5 tahun. Paparan = merokok, outcome = stroke.</p>
        <p>Tabel 2×2: perokok — 80 stroke dari 1.000 (a=80, b=920); bukan perokok — 20 stroke dari 1.000 (c=20, d=980).</p>
        <p><strong>Langkah 1 — Risiko tiap kelompok.</strong> Risiko perokok = 80/1.000 = 8%. Risiko bukan perokok = 20/1.000 = 2%.</p>
        <p><strong>Langkah 2 — Relative Risk (RR).</strong> RR = 8%/2% = <strong>4,0</strong>. Artinya: perokok berisiko 4 kali lipat.</p>
        <p><strong>Langkah 3 — Odds Ratio (OR).</strong> Odds perokok = 80/920 = 0,087; odds bukan perokok = 20/980 = 0,0204. OR = 0,087/0,0204 = <strong>4,26</strong>.</p>
        <p><strong>Langkah 4 — Bandingkan.</strong> OR (4,26) sedikit lebih besar dari RR (4,0). Pada penyakit <em>langka</em> (&lt;10%), OR ≈ RR — boleh saling menggantikan. Pada penyakit <em>umum</em> (mis. 40% prevalensi), OR bisa 2× lipat RR: melaporkan OR sebagai “risiko 2× lipat” adalah pembesar-besaran.</p>
        <p><strong>Langkah 5 — Risiko absolut.</strong> Selisih risiko = 8% − 2% = 6 poin persen. NNT pencegahan ≈ 1/0,06 ≈ 17: cegah 17 orang berhenti merokok untuk mencegah 1 stroke. Inilah angka yang dipakai pembuat kebijakan — bukan “4 kali lipat”.</p>
        <p><strong>Pelajaran:</strong> RR menjawab “berapa kali lipat”, selisih risiko menjawab “berapa nyawa”. Jurnalis suka yang pertama; menteri kesehatan butuh yang kedua.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — standardisasi adalah “wasit” antar populasi:</strong> Membandingkan angka kematian kasar Jawa Barat vs Papua tanpa standardisasi umur itu seperti membandingkan kecepatan dua mobil di mana satu jalan di tol dan satu di jalan tanah — medannya beda. Standardisasi umur memaksa kedua populasi “berlomba di trek yang sama” (struktur umur referensi WHO). Aturan praktis: <strong>selalu curigai perbandingan antar wilayah/waktu yang tidak menyebut standardisasi</strong> — 9 dari 10 “peringkat provinsi” di media tidak melakukannya.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — membaca brosur obat dengan mata epidemiolog:</strong> Brosur suplemen di apotek: “Menurunkan risiko stroke <strong>50%</strong>!” Cek huruf kecil: risiko absolut turun dari 2% ke 1% (selisih 1 poin persen, NNT = 100). Klaim “50%” memakai RR; yang relevan bagimu adalah: dari 100 pembeli, 99 tidak mendapat manfaat tambahan apapun. BPOM mengatur klaim kesehatan, tapi <strong>literasi angka</strong> tetap tugasmu. Setiap kali melihat persen tanpa pembilang-penyebut, tulis sendiri tabel 2×2-nya — butuh 60 detik, menyelamatkanmu dari keputusan seumur hidup.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Tiga Ilusi Waktu dalam Angka Epidemiologi</h2>
      <p>Sebagian jebakan epidemiologi bukan soal rumus — melainkan soal <strong>waktu</strong>. Tiga ilusi ini menipu bahkan analis berpengalaman.</p>
      <p><strong>Ilusi 1 — Lead-time bias: skrining yang “memperpanjang hidup” tanpa menyembuhkan.</strong> Skrining menemukan kanker 2 tahun lebih awal; pasien “bertahan 5 tahun dari diagnosis” vs 3 tahun tanpa skrining — terlihat 2 tahun lebih lama. Tapi jika ia meninggal di <em>tanggal yang sama</em>, skrining hanya <strong>memajukan jam mulai</strong>, bukan mengundur jam kematian. Survival “5 tahun dari diagnosis” <strong>naik</strong> padahal tidak satu nyawa pun terselamatkan. Inilah kenapa evaluasi skrining memakai <strong>mortalitas populasi</strong> (kematian per 100.000), bukan survival dari diagnosis — mortalitas tidak bisa ditipu jam mulai.</p>
      <p><strong>Ilusi 2 — Length bias: skrining menemukan yang “jinak”.</strong> Tumor agresif tumbuh cepat → menimbulkan gejala di antara jadwal skrining (interval cancer). Tumor lambat → nongkrong lama di fase terdeteksi → tertangkap skrining. Maka kanker “hasil skrining” <strong>terlihat</strong> lebih jinak dan lebih bisa disembuhkan — bukan karena skrining menyembuhkan, melainkan karena skrining <strong>memilih</strong> yang lambat. Membandingkan survival “terdeteksi skrining” vs “terdeteksi gejala” tanpa koreksi = membandingkan kura-kura dengan cheetah lalu memuji jaringnya.</p>
      <p><strong>Ilusi 3 — Neyman bias (survival/incidence): yang mati cepat tidak sempat diwawancara.</strong> Studi kasus-kontrol merekrut pasien yang <em>masih hidup</em> saat studi dimulai. Paparan yang membunuh cepat (mis. rokok → serangan jantung fatal mendadak) <strong>kurang terwakili</strong> di antara kasus yang selamat — risikonya <strong>teremehkan</strong>. Solusi: desain insidens (rekrut kasus <em>baru</em> secepatnya) atau nested case-control dalam kohort.</p>
      <div className="callout">
        <p><strong>Aturan praktis:</strong> setiap angka epidemiologi yang melibatkan <em>waktu diagnosis</em> atau <em>seleksi siapa yang bertahan untuk diobservasi</em>, tanyakan: <strong>“apakah waktu/ketahanan ini bagian dari efek, atau bagian dari seleksi?”</strong> — Jika seleksi, angkamu ilusi.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;OR = RR, jadi bisa dibaca “risiko X kali lipat”&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Hanya jika penyakit jarang (&lt;10%). Pada penyakit umum (mis. hipertensi 30%), OR bisa jauh lebih besar dari RR. Jurnal yang teliti menulis “odds”, bukan “risiko”, saat melaporkan OR. Kalau kamu membaca OR sebagai RR pada penyakit umum, kamu melebih-lebihkan efek.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Prevalensi tinggi = penularan sedang tinggi&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Prevalensi tinggi bisa berarti: (a) banyak kasus baru, (b) kasus lama menumpuk karena tidak sembuh-sembuh (kronis), atau (c) skrining gencar menemukan kasus lama. Diabetes prevalensinya naik terus bukan karena penularannya meledak, tapi karena penderitanya hidup lama dengan penyakitnya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Angka kematian kasar antar daerah bisa langsung dibandingkan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Daerah dengan penduduk lebih tua otomatis angka kematian kasarnya lebih tinggi — walau layanan kesehatannya sama baik. Bandingkan dengan angka terstandardisasi umur (atau stratifikasi), иначе kamu menghukum daerah tua dan memuji daerah muda secara tidak adil.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Dari “50% Lebih Baik” ke NNT</h2>
      <details className="worked">
        <summary>📐 Worked example: membedah klaim trial statin (klik untuk buka)</summary>
        <p>Brosur: “Statin menurunkan risiko serangan jantung <strong>50%</strong>!” Data trial (5 tahun, n=10.000): kelompok statin — 100 serangan dari 5.000 (2%); plasebo — 200 dari 5.000 (4%).</p>
        <p><strong>Langkah 1 — Verifikasi klaim relatif.</strong> RR = 2%/4% = 0,50 → penurunan relatif 50%. Klaim <em>benar</em> secara matematis.</p>
        <p><strong>Langkah 2 — Hitung absolut (yang disembunyikan).</strong> Absolute Risk Reduction (ARR) = 4% − 2% = <strong>2 poin persen</strong>. Dari 100 orang minum statin 5 tahun, 2 terhindar dari serangan jantung; 98 lainnya: tidak ada bedanya (atau efek samping).</p>
        <p><strong>Langkah 3 — NNT.</strong> NNT = 1/ARR = 1/0,02 = <strong>50</strong>. Butuh 50 orang diobati 5 tahun untuk mencegah 1 serangan jantung.</p>
        <p><strong>Langkah 4 — NNH (Number Needed to Harm).</strong> Efek samping serius (mis. diabetes baru): statin 3%, plasebo 2% → ARI = 1% → NNH = 100. <strong>Rasio keputusan:</strong> tiap 100 orang diobati → 2 serangan dicegah, 1 diabetes baru muncul. Masih menguntungkan — tapi bukan “keajaiban 50%”.</p>
        <p><strong>Langkah 5 — Konteks risiko awal.</strong> NNT=50 ini untuk populasi risiko <em>sedang-tinggi</em>. Untuk populasi risiko rendah (risiko awal 1%): ARR = 0,5% → NNT = 200. <strong>NNT yang sama tidak berlaku untuk semua orang</strong> — selalu tanyakan “NNT pada risiko awal berapa?”</p>
        <p><strong>Langkah 6 — Sajikan ke pasien/Dinkes.</strong> “Dari 50 orang seperti Bapak yang minum statin 5 tahun, 1 terhindar dari serangan jantung; 49 tidak merasakan bedanya; 1 dari 100 berisiko diabetes baru.” — Inilah <strong>shared decision making</strong>: angka yang memungkinkan keputusan, bukan pemasaran.</p>
        <p><strong>Pelajaran:</strong> setiap kali melihat persen relatif tanpa absolut, hitung sendiri NNT-nya. Butuh 60 detik — dan mengubahmu dari target iklan menjadi penilai bukti.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Industri farmasi <strong>wajib</strong> melaporkan relatif (terlihat besar) dan <strong>tidak wajib</strong> menonjolkan absolut (terlihat kecil) — bukan konspirasi, melainkan regulasi iklan yang longgar. Tugas analis: <strong>selalu lengkapi pasangan angkanya</strong> sebelum meneruskan klaim.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kali melihat klaim “X% lebih rendah/tinggi”, tanya: <strong>relatif terhadap berapa absolutnya?</strong> 50% dari 2% dan 50% dari 40% adalah dunia yang berbeda.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Hafalkan jembatan ini: <strong>insidens → kecepatan, prevalensi → beban, RR → kohort, OR → case-control, HR → waktu, NNT → keputusan</strong>. Enam kata kunci, satu peta.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk data Indonesia: biasakan baca angka dalam satuan baku — insidens TB per 100.000, AKI per 100.000 kelahiran hidup, prevalensi stunting dalam persen. Satuan yang salah = salah tafsir orde besarnya.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Kalkulator Epidemiologi 2×2</h2>
      <p>Masukkan a, b, c, d dari tabel 2×2 (lihat konsep RR). Kode menghitung risiko, RR, OR, ARR, dan NNT sekaligus. Coba data merokok-TB di atas, lalu coba penyakit umum dan lihat OR vs RR.</p>
      <PyodideLab
        title="🔬 Lab 1: Kalkulator Epidemiologi 2×2"
        hint="Coba skenario penyakit UMUM: a=60,b=40,c=30,d=70. Bandingkan OR vs RR — selisihnya jauh! Itulah kenapa OR tidak boleh dibaca sebagai “risiko”."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Standardisasi Umur — Wasit yang Adil</h2>
      <p>Dua kabupaten: A (penduduk tua) dan B (penduduk muda). Angka kematian kasar A lebih tinggi. Hitung angka terstandardisasi dengan populasi standar dan buktikan siapa yang sebenarnya lebih baik.</p>
      <PyodideLab
        title="🔬 Lab 2: Standardisasi Umur — Wasit yang Adil"
        hint="Ubah angka kematian kelompok tua di A. Pada titik berapa kesimpulan berbalik? Itulah sensitivitas perbandingan tanpa standardisasi."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Membaca Riskesdas seperti Profesional</h2>
        <p><strong>Riskesdas</strong> (Riset Kesehatan Dasar) adalah survei kesehatan nasional Indonesia — sampel ratusan ribu rumah tangga, dengan <strong>pemeriksaan biomedis langsung</strong> (gula darah, tekanan darah, antropometri), bukan sekadar wawancara. Inilah “angka populasi” paling tepercaya yang dimiliki Indonesia.</p>
      <p><strong>Yang harus dipahami analis:</strong> (1) <strong>Desain sampling bertingkat</strong> — Riskesdas memakai multistage sampling dengan <strong>bobot sampling</strong>. Menghitung rata-rata polos tanpa bobot = salah; selalu pakai <em>survey weights</em> (paket <code>survey</code> di R / <code>statsmodels</code> di Python). (2) <strong>Periode, bukan titik waktu</strong> — Riskesdas 2018 vs 2023: metodologi bisa berubah (definisi, alat ukur) — bandingkan dengan catatan metodologi di tangan. (3) <strong>Granularitas terbatas</strong> — estimasi valid hingga level provinsi (kadang kabupaten/kota untuk indikator tertentu); angka “kecamatan” dari Riskesdas = <strong>tidak valid</strong>, jangan dipaksakan.</p>
      <p><strong>Tiga kesalahan klasik analis Indonesia:</strong> ① Memakai angka Riskesdas <strong>mentah tanpa bobot</strong> untuk “prevalensi kabupatenu” — salah desain. ② Membandingkan Riskesdas 2018 vs data klaim 2024 seolah setara — <strong>beda tahun, beda metode, beda makna</strong>. ③ Mengutip prevalensi nasional untuk <strong>perencanaan kabupaten</strong> — padahal variasi antar-kabupaten bisa 3× lipat; pakailah estimasi area kecil (small area estimation) atau survei lokal.</p>
      <p><strong>Contoh pemakaian yang benar:</strong> “Prevalensi diabetes nasional 10,9% (Riskesdas 2018, n=…, desain bertingkat berbobot) vs klaim BPJS 4,2% → kesenjangan diagnosis ~6,7 poin persen → justifikasi program skrining.” — Tiap angka punya <strong>sumber, tahun, metode</strong>. Tanpa ketiganya, angka adalah rumor.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Riskesdas terbit tiap ~5 tahun — <strong>jadwalkan</strong> analisismu mengikuti rilisnya. Analis Dinkes yang presentasi “data terbaru” 2 bulan setelah rilis Riskesdas baru (dengan metodologi yang sudah dipelajari) jauh lebih dipercaya daripada yang masih mengutip edisi 5 tahun lalu.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Nilai kecepatan penularan → Insidens</h3>
        <p><strong>Kondisi:</strong> Butuh tahu apakah wabah meluas atau program pencegahan bekerja.</p>
        <p><strong>Kenapa:</strong> Hanya kasus baru yang mencerminkan dinamika saat ini.</p>
        <p><strong>Contoh nyata:</strong> Insidens TB per 100.000 untuk menilai program penemuan kasus aktif.</p>
      </div>
      <div className="decision-card">
        <h3>2. Rencanakan kebutuhan layanan → Prevalensi</h3>
        <p><strong>Kondisi:</strong> Butuh tahu beban yang harus ditanggung sistem sekarang.</p>
        <p><strong>Kenapa:</strong> Mencakup semua kasus yang butuh layanan, baru + lama.</p>
        <p><strong>Contoh nyata:</strong> Prevalensi diabetes untuk proyeksi kebutuhan insulin dan klinik.</p>
      </div>
      <div className="decision-card">
        <h3>3. Data kohort/RCT → RR</h3>
        <p><strong>Kondisi:</strong> Mengikuti kelompok dari paparan ke outcome; risiko terhitung langsung.</p>
        <p><strong>Kenapa:</strong> RR intuitif dan valid karena pembagi (populasi berisiko) diketahui.</p>
        <p><strong>Contoh nyata:</strong> Kohort: apakah merokok menaikkan risiko TB (RR=4).</p>
      </div>
      <div className="decision-card">
        <h3>4. Data case-control → OR</h3>
        <p><strong>Kondisi:</strong> Berangkat dari outcome (kasus vs kontrol), menengok ke belakang.</p>
      <PlotlyChart
        data={hd3OrRrData}
        title="OR vs RR: Dekat saat Jarang, Jauh saat Umum"
        layout={hd3OrRrDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Dua skenario (kiri: penyakit jarang, kanan: penyakit umum). Biru = RR, kuning = OR. Bandingkan tinggi biru vs kuning dalam tiap skenario.</p>
        <p><strong>Interpretasi:</strong> Saat penyakit jarang, OR (2,14) hampir sama dengan RR (2,1) — aman dibaca mirip. Saat penyakit umum, OR (3,5) jauh melebih-lebihkan RR (2,0). Inilah visual dari aturan “OR ≈ RR hanya bila jarang”.</p>
      </div>
        <p><strong>Kenapa:</strong> Risiko tidak bisa dihitung (sampling berbasis outcome); hanya OR yang valid.</p>
        <p><strong>Contoh nyata:</strong> Case-control: riwayat kontak TB pada kasus vs kontrol.</p>
      </div>
      <div className="decision-card">
        <h3>5. Data waktu-kejadian → HR</h3>
        <p><strong>Kondisi:</strong> Outcome berupa waktu sampai kejadian dengan sensor (lihat HD6).</p>
        <p><strong>Kenapa:</strong> HR membandingkan laju kejadian sepanjang kurun follow-up.</p>
        <p><strong>Contoh nyata:</strong> Uji klinis: HR kematian obat baru vs standar = 0,7.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Kecepatan → insidens; beban → prevalensi.</li>
          <li>Kohort → RR; case-control → OR; survival → HR.</li>
          <li>OR dibaca sebagai “risiko” hanya bila penyakit jarang.</li>
          <li>Klaim relatif selalu tanyakan absolutnya (NNT).</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Brosur Obat: “Turunkan Risiko 50%!”</h2>
      <div className="callout">
        <p>Seorang sales farmasi menunjukkan brosur: obat baru menurunkan risiko kejadian jantung <strong>50%</strong> (RRR). Harganya Rp500 ribu/bulan. Kamu diminta Dinkes menilai apakah layak masuk formularium.</p>
      <p>Dari jurnalnya: risiko kejadian 5 tahun pada kontrol <strong>4%</strong>, pada obat <strong>2%</strong>. Efek samping serius: 1%.</p>
        <p><strong>Pertanyaan:</strong> Hitung ARR dan NNT. Apakah klaim 50% menyesatkan, dan apa rekomendasi formulariummu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>ARR = 4% − 2% = 2% = 0,02. NNT = 1/0,02 = 50: obati 50 pasien 5 tahun untuk mencegah 1 kejadian. Klaim “50%” benar secara relatif tapi menyesatkan untuk keputusan: biaya = 50 × Rp500rb × 60 bulan = Rp1,5 miliar per kejadian dicegah, plus 1% efek samping serius (≈ 0,5 kasus per kejadian dicegah). Rekomendasi: batasi untuk pasien risiko tinggi saja (risiko basal besar → NNT kecil), bukan populasi umum. Pelajaran: analis yang hanya membaca relatif akan meloloskan obat mahal yang tidak cost-effective.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Insidens mengukur…"
        options={["Total beban penyakit saat ini",
          "Kecepatan munculnya kasus baru per populasi berisiko",
          "Jumlah kematian",
          "Efektivitas obat"]}
        correct={1}
        explanation="Benar: insidens = kasus baru / populasi berisiko / periode. Untuk beban saat ini pakai prevalensi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Dalam tabel 2×2 (a=40,b=160,c=10,d=190), RR adalah…"
        options={["4,75",
          "4,0",
          "0,25",
          "2,0"]}
        correct={1}
        explanation="Benar: RR = (40/200)/(10/200) = 0,20/0,05 = 4,0. Yang 4,75 adalah OR = (40×190)/(160×10)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. OR boleh dibaca sebagai “risiko X kali lipat” ketika…"
        options={["Selalu boleh",
          "Penyakitnya jarang (<10%)",
          "Sampelnya besar",
          "Penelitinnya RCT"]}
        correct={1}
        explanation="Benar: hanya saat jarang OR ≈ RR. Pada penyakit umum, OR melebih-lebihkan — baca sebagai odds, bukan risiko."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Risiko kontrol 4%, obat 3%. NNT adalah…"
        options={["25",
          "33",
          "100",
          "75"]}
        correct={2}
        explanation="Benar: ARR = 0,01 → NNT = 100. Klaim relatif “25%” vs realita “100 diobati untuk 1 terbantu”."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Dua kabupaten dibandingkan angka kematian kasarnya. Kabupaten A (penduduk tua) lebih tinggi. Langkah benar?"
        options={["Langsung simpulkan layanan A lebih buruk",
          "Hitung angka terstandardisasi umur dulu",
          "Pakai prevalensi saja",
          "Abaikan perbedaan umur"]}
        correct={1}
        explanation="Benar: struktur umur mengacaukan perbandingan kasar. Standardisasi = wasit yang adil."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Studi case-control meneliti rokok dan kanker paru. Ukuran asosiasi yang valid?"
        options={["RR",
          "OR",
          "HR",
          "NNT"]}
        correct={1}
        explanation="Benar: case-control sampling berbasis outcome — risiko tak terhitung, hanya OR yang valid. (Untuk penyakit jarang, OR ≈ RR.)"
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Insidens</strong> = kecepatan kasus baru; <strong>prevalensi</strong> = beban total saat ini.</li>
          <li><strong>RR</strong> untuk kohort/RCT; <strong>OR</strong> untuk case-control; <strong>HR</strong> untuk data waktu-kejadian.</li>
          <li>OR ≈ RR hanya bila penyakit <strong>jarang</strong>.</li>
          <li><strong>ARR &amp; NNT</strong> menerjemahkan klaim relatif ke bahasa keputusan.</li>
          <li>Bandingkan populasi dengan <strong>standardisasi</strong> (umur) agar adil.</li>
          <li>Populasi berisiko = keluarkan yang sudah sakit dari pembagi insidens.</li>
          <li>Selalu tanya angka absolut di balik persen relatif.</li>
          <li>Kosakata ini dipakai di semua lesson HD berikutnya — di luar kepala, bukan di catatan.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd2-standar" className="btn btn-secondary btn-sm">← HD2</Link>
        <Link href="/learn/hd4-desain-studi" className="btn btn-primary btn-sm">HD4 →</Link>
      </div>
    </div>
  );
}
