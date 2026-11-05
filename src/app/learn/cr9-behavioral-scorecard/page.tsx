"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr9Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const behaviorData = [
    {
      x: ["Bl 1", "Bl 2", "Bl 3", "Bl 4", "Bl 5", "Bl 6"],
      y: [100, 98, 95, 70, 40, 15],
      type: "scatter",
      mode: "lines+markers",
      name: "Utilisasi limit (%) — Nasabah X",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["Bl 1", "Bl 2", "Bl 3", "Bl 4", "Bl 5", "Bl 6"],
      y: [30, 32, 28, 31, 29, 30],
      type: "scatter",
      mode: "lines+markers",
      name: "Nasabah normal",
      line: { color: "#3aa655", width: 3, dash: "dash" },
    },
  ];

  const ewsData = [
    {
      x: ["Mutasi turun >40%", "DPD 1–30 muncul", "Utilisasi >90%", "SLIK kolek 2 di bank lain", "Tarik tunai berulang"],
      y: [0.65, 0.58, 0.52, 0.71, 0.44],
      type: "bar",
      marker: { color: ["#ef9244", "#e8a838", "#e8a838", "#ef4444", "#94a3b8"] },
      text: ["0,65", "0,58", "0,52", "0,71", "0,44"],
      textposition: "outside",
    },
  ];

  const collectionData = [
    {
      x: ["Skor 750+", "Skor 700–749", "Skor 650–699", "Skor 600–649", "Skor <600"],
      y: [92, 78, 55, 30, 12],
      type: "bar",
      marker: { color: ["#3aa655", "#2a7de1", "#e8a838", "#ef9244", "#ef4444"] },
      text: ["92%", "78%", "55%", "30%", "12%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Behavioral score — perilaku bicara lebih keras dari form
# Skor perilaku dari 3 sinyal: utilisasi, tren mutasi, DPD historis.
def behavioral_score(utilisasi, tren_mutasi, dpd_max):
    # utilisasi: 0-100 (%), tren_mutasi: % perubahan 3 bln, dpd_max: hari
    skor = 700
    skor -= max(0, utilisasi - 30) * 1.2      # tiap % di atas 30% = -1.2
    skor += max(-60, min(60, tren_mutasi)) * 0.8  # mutasi naik = +
    skor -= dpd_max * 2.0                     # tiap hari DPD = -2
    return max(300, min(850, int(skor)))

print(f"{'Profil':<32} {'Skor':>5}")
print(f"{'Util 30%, mutasi +10%, DPD 0':<32} {behavioral_score(30, 10, 0):>5}")
print(f"{'Util 85%, mutasi -45%, DPD 0':<32} {behavioral_score(85, -45, 0):>5}")
print(f"{'Util 40%, mutasi -10%, DPD 25':<32} {behavioral_score(40, -10, 25):>5}")
print()
print("Coba: profil 'util 95%, mutasi -60%, DPD 15'.")
print("Skornya jatuh — PADAHAL belum ada tunggakan >30 hari.")
print("Itulah early warning: perilaku memburuk SEBELUM DPD.")`;

  const lab2Code = `# Lab 2: Strategi collection berbasis skor — alokasi yang optimal
# Budget collection terbatas: Rp 100 jt/bulan. Ke mana dialokasikan?
import random
random.seed(21)

# 1000 nasabah menunggak: skor perilaku + peluang bayar jika dihubungi
nasabah = []
for _ in range(1000):
    skor = int(random.gauss(650, 70))
    # peluang bayar: naik dengan skor, naik jika dihubungi intensif
    p_dihubungi = min(0.95, max(0.05, (skor - 500) / 400))
    p_dibiarkan = p_dihubungi * 0.4
    outstanding = random.uniform(5, 50)  # juta Rp
    nasabah.append((skor, p_dihubungi, p_dibiarkan, outstanding))

def alokasi(strategi):
    # strategi: 'acak' atau 'skor' (prioritaskan skor tertinggi)
    urutan = sorted(nasabah, key=lambda x: random.random() if strategi=='acak' else -x[0])
    budget, contacted = 100, 0  # Rp 100 jt, biaya Rp 0.5 jt/kontak
    recovery = 0
    for skor, p_hub, p_biar, out in urutan:
        if budget < 0.5: break
        budget -= 0.5; contacted += 1
        recovery += out * p_hub
    # yang tidak dihubungi: recovery alami
    for skor, p_hub, p_biar, out in urutan[contacted:]:
        recovery += out * p_biar
    return recovery, contacted

for s in ['acak', 'skor']:
    rec, n = alokasi(s)
    print(f"Strategi {s:<5}: recovery Rp {rec:>7.0f} jt dari {n} kontak")
print()
print("Strategi 'skor' menang — karena menghubungi yang PALING MUNGKIN")
print("bayar dulu. Inilah collection scorecard: bukan siapa menunggak,")
print("tapi siapa yang (a) mau bayar dan (b) butuh dorongan.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR9 — Credit Risk Analyst</span>
        <h1 className="display-title">Behavioral Scorecard &amp; Early Warning:<br />Membaca Nasabah dari Perilakunya</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Nasabah yang "Baik-baik Saja" — Sampai Tidak</a></li>
          <li><a href="#behavioral">Behavioral Scorecard: Raport Semester Berjalan</a></li>
          <li><a href="#ews">Early Warning: Detektor Asap Kredit</a></li>
          <li><a href="#collection">Collection Scorecard: Menagih dengan Otak</a></li>
          <li><a href="#lab1">🔬 Lab 1: Behavioral Score dari 3 Sinyal</a></li>
          <li><a href="#lab2">🔬 Lab 2: Alokasi Collection Berbasis Skor</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Sinyal Muncul — Apa Aksi?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Gelombang yang Terlewat</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan application, behavioral, dan collection scorecard (kapan dipakai, data apa).</li>
          <li>Mengidentifikasi 5+ sinyal early warning dan mengukur kekuatannya.</li>
          <li>Menjelaskan cara collection scorecard mengoptimalkan alokasi penagihan yang terbatas.</li>
          <li>Merancang aturan aksi berlapis: dari sinyal → skor → tindakan bisnis.</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Nasabah yang "Baik-baik Saja" — Sampai Tidak</h2>
      <div className="story">
        <p>Nasabah X: KTA Rp 100 juta, <strong>tidak pernah telat</strong> 6 bulan. Di dashboard: hijau semua. Lalu bulan ke-7: <strong>macet total</strong> — Rp 100 juta melayang. Tim risiko bengong: <em>"Kok tiba-tiba?"</em></p>
        <p>Rina membuka data perilaku 6 bulan terakhir — dan "tiba-tiba" itu ternyata <strong>tidak tiba-tiba sama sekali</strong>:</p>
        <ul>
          <li>Bulan 3: mutasi rekening <strong>turun 45%</strong> (gajinya berhenti masuk — PHK?).</li>
          <li>Bulan 4: utilisasi kartu kredit <strong>melonjak 30% → 85%</strong> (hidup dari utang).</li>
          <li>Bulan 5: <strong>tarik tunai</strong> 3× dari kartu kredit (sinyal kepepet klasik).</li>
          <li>Bulan 6: SLIK menunjukkan <strong>Kolek 2 di bank lain</strong>.</li>
        </ul>
        <p>Empat sirene menyala — tidak satu pun didengar, karena semua orang hanya memantau <strong>DPD</strong>. DPD = 0 sampai detik terakhir.</p>
        <p><strong>Twist-nya:</strong> application scorecard (CR7) menilai nasabah <strong>saat lahir</strong> — tapi manusia <strong>berubah</strong>. Behavioral scorecard menilai nasabah <strong>yang hidup</strong>: dari perilakunya bulan per bulan. Lesson ini tentang "CCTV" perilaku itu — dan sistem peringatan dininya.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="behavioral">Behavioral Scorecard: Raport Semester Berjalan</h2>
      <p><strong>Definisi.</strong> Behavioral scorecard = model yang memprediksi peluang default <strong>12 bulan ke depan</strong> untuk nasabah <strong>existing</strong>, memakai <strong>data perilaku</strong> (bukan data pengajuan):</p>
      <ul>
        <li><strong>Utilisasi limit</strong> — % limit yang dipakai. Melonjak = kepepet.</li>
        <li><strong>Tren mutasi</strong> — naik/turunnya arus kas rekening. Turun tajam = penghasilan terganggu.</li>
        <li><strong>Pola pembayaran</strong> — bayar penuh vs minimum vs telat. Bayar minimum terus = gali lubang.</li>
        <li><strong>DPD historis</strong> — pernah telat = prediktor kuat (perilaku berulang).</li>
        <li><strong>SLIK lintas bank</strong> — memburuk di bank lain = menular ke sini.</li>
      </ul>
      <p><strong>Kepribadian:</strong> application scorecard seperti <strong>nilai raport saat masuk sekolah</strong> — sekali ukur. Behavioral scorecard seperti <strong>raport tiap semester</strong> — diperbarui terus. Murid yang dulu pintar bisa menurun; nasabah yang dulu prima bisa kepepet.</p>
      <p><strong>Perbedaan kunci vs application:</strong> behavioral memakai <strong>time series perilaku</strong> (tren 3–6 bulan), bukan snapshot. Variabelnya: <em>perubahan</em> utilisasi, <em>volatilitas</em> mutasi, <em>frekuensi</em> tarik tunai — bukan nilainya sesaat.</p>

      <PlotlyChart
        data={behaviorData}
        title="Utilisasi Limit: Nasabah X vs Normal (6 bulan)"
        layout={{ xaxis: { title: "Bulan" }, yaxis: { title: "Utilisasi (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = utilisasi Nasabah X; garis hijau putus-putus = pola normal.</p>
        <p><strong>Interpretasi:</strong> bulan 1–3 normal (~30%), lalu <strong>bulan 4 meledak ke 85%</strong> — pola klasik "hidup dari kredit". Behavioral score yang baik menangkap <strong>perubahan</strong> ini di bulan 4, bukan menunggu DPD di bulan 7. <strong>Aturan praktis:</strong> utilisasi &gt;90% + tren naik 3 bulan = kirim ke daftar pantau.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> variabel behavioral terbaik adalah <strong>turunan pertama</strong> (perubahan), bukan <strong>level</strong>. Utilisasi 80% yang stabil 2 tahun ≠ utilisasi 80% yang melonjak dari 30% dalam 2 bulan. Yang pertama gaya hidup, yang kedua sirene. Model yang hanya pakai level akan menyamakan keduanya — dan salah besar.</p>
      </div>

      <h2 id="ews">Early Warning: Detektor Asap Kredit</h2>
      <p><strong>Definisi.</strong> <strong>EWS</strong> (<em>Early Warning System</em>) = aturan/model yang mengubah sinyal perilaku menjadi <strong>alert + aksi</strong> <em>sebelum</em> tunggakan terjadi. Bukan sekadar skor — melainkan <strong>sistem saraf</strong> yang terhubung ke tindakan: telepon, kunjungan, penurunan limit, restrukturisasi dini.</p>
      <p><strong>Lima sinyal terkuat</strong> (dari pengalaman industri Indonesia):</p>

      <PlotlyChart
        data={ewsData}
        title="Kekuatan Sinyal EWS (korelasi dengan default 6 bulan)"
        layout={{ xaxis: { title: "Sinyal" }, yaxis: { title: "Kekuatan (ilustratif)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = seberapa kuat sinyal memprediksi default 6 bulan ke depan.</p>
        <p><strong>Interpretasi:</strong> <strong>SLIK memburuk di bank lain (0,71)</strong> = sinyal terkuat — nasabah biasanya macet di bank lain <em>dulu</em> sebelum di sini (efek "pilih kasih bayar"). <strong>Mutasi turun &gt;40% (0,65)</strong> = PHK/usaha terganggu. Kombinasi 2–3 sinyal = alert merah. Satu sinyal = alert kuning (pantau).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "EWS = dashboard merah yang dilihat sebulan sekali."</strong></p>
        <p><strong>Yang benar:</strong> EWS tanpa <strong>aksi otomatis</strong> = hiasan. EWS yang bekerja: sinyal → alert → <strong>playbook</strong> (siapa menelepon, dalam berapa hari, tawaran apa). Bank dengan EWS terbaik bukan yang sinyalnya paling canggih, melainkan yang <strong>waktu reaksi tercepat</strong> dari sinyal ke tindakan.</p>
      </div>

      <h2 id="collection">Collection Scorecard: Menagih dengan Otak</h2>
      <p><strong>Definisi.</strong> Collection scorecard memprediksi — untuk nasabah yang <strong>sudah menunggak</strong> — dua hal:</p>
      <ul>
        <li><strong>Peluang bayar jika dihubungi</strong> (<em>propensity to pay</em>): siapa yang akan bayar kalau ditelepon/dikunjungi?</li>
        <li><strong>Responsivitas terhadap aksi</strong> (<em>uplift</em>): siapa yang <em>butuh</em> dihubungi (tidak akan bayar sendiri) vs yang akan bayar sendiri tanpa diganggu?</li>
      </ul>
      <p><strong>Kepribadian:</strong> seperti <strong>dokter triase di IGD</strong> — bukan "siapa paling sakit", melainkan "siapa yang paling terbantu oleh tindakan kita <em>sekarang</em>". Pasien yang akan sembuh sendiri tidak perlu dioperasi; yang tidak tertolong tidak perlu dihabiskan sumber daya.</p>
      <p><strong>Empat kuadran collection:</strong></p>
      <ul>
        <li><strong>Mau bayar + butuh diingatkan</strong> → telepon/SMS (murah, efektif).</li>
        <li><strong>Mau bayar + akan bayar sendiri</strong> → jangan ganggu (hemat biaya, jaga hubungan).</li>
        <li><strong>Tidak mau/tidak mampu + responsif terhadap negosiasi</strong> → kunjungan + restrukturisasi.</li>
        <li><strong>Tidak mampu total</strong> → alihkan ke remedial/legal (jangan buang biaya telepon).</li>
      </ul>

      <PlotlyChart
        data={collectionData}
        title="Peluang Bayar jika Dihubungi, per Skor Perilaku"
        layout={{ xaxis: { title: "Skor perilaku" }, yaxis: { title: "Peluang bayar (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = % nasabah menunggak yang membayar setelah dihubungi, per band skor.</p>
        <p><strong>Interpretasi:</strong> skor 750+ → 92% bayar setelah dihubungi (telepon murah = efektif). Skor &lt;600 → cuma 12% (telepon = buang pulsa; butuh strategi lain: kunjungan/restrukturisasi). <strong>Implikasi budget:</strong> dengan tim terbatas, hubungi dari skor tertinggi ke bawah — tiap rupiah collection menghasilkan recovery maksimum (buktikan di Lab 2).</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Collection = kejar yang tunggakannya paling besar."</strong></p>
        <p><strong>Yang benar:</strong> tunggakan besar + peluang bayar 5% = ekspektasi recovery kecil. Tunggakan sedang + peluang bayar 90% = ekspektasi recovery besar. Collection yang optimal memaksimalkan <strong>peluang × outstanding − biaya</strong>, bukan outstanding saja. Inilah bedanya "menagih" dan "mengelola portofolio tunggakan".</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tiga scorecard, tiga pertanyaan: <strong>Application</strong> = "layak diberi?" (saat lahir). <strong>Behavioral</strong> = "masih sehat?" (semasa hidup). <strong>Collection</strong> = "bagaimana menagih yang sakit?" (saat bermasalah). Bank yang hanya punya application = punya rapor masuk tapi tidak punya CCTV dan tidak punya IGD.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Perilaku adalah Pengakuan yang Jujur</h3>
      <p>Aplikasi kredit bisa berbohong — penghasilan bisa digelembungkan, dokumen bisa dipalsukan. Tetapi <strong>perilaku 6 bulan tidak bisa berbohong lama</strong>: mutasi rekening yang menyusut, utilisasi yang merangkak naik, pola bayar minimum yang menetap — semuanya adalah "pengakuan" yang ditulis tangan nasabah sendiri setiap hari. Behavioral scorecard unggul bukan karena matematikanya lebih canggih, melainkan karena <strong>datanya lebih jujur</strong>. Inilah mengapa PD behavioral (untuk existing) hampir selalu lebih akurat dari PD application (untuk calon).</p>
      <p>Intuisi kedua: <strong>turunan pertama mengalahkan level</strong>. Utilisasi 80% yang stabil 2 tahun (pengusaha yang memang memakai limit sebagai modal kerja) jauh lebih aman dari utilisasi yang naik 30% → 80% dalam 3 bulan (seseorang yang kepepet). Model yang hanya melihat level akan menyamakan keduanya — model yang melihat <strong>perubahan</strong> membedakannya. Prinsip ini berlaku umum dalam risk analytics: <strong>tren adalah sinyal, level adalah konteks</strong>.</p>
      <p>Intuisi ketiga tentang collection: empat kuadran collection adalah pelajaran <strong>alokasi sumber daya</strong>, bukan sekadar penagihan. Tim collection punya jam terbatas — menelepon nasabah yang "akan bayar sendiri" adalah pemborosan; tidak menelepon yang "mau bayar tapi butuh diingatkan" adalah kelalaian. Collection scorecard mengubah penagihan dari <strong>kerja otot</strong> (telepon semua) menjadi <strong>kerja otak</strong> (telepon yang tepat). Bank dengan collection cerdas bisa menekan NPL 0,5–1% tanpa menambah satu pun debt collector.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Behavioral Score dari 3 Sinyal</h2>
      <p>Tiga sinyal perilaku → satu skor. Lihat bagaimana "belum telat" bisa berarti "hampir macet".</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Behavioral Score"
        hint="Coba: (1) util 95, mutasi -60, dpd 15 — berapa skornya? (2) Bandingkan dengan 'util 30, mutasi +10, dpd 0'. (3) Mana lebih merusak skor: DPD 25 hari ATAU mutasi -45%? (Jawaban: lihat bobotnya.)"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Alokasi Collection Berbasis Skor</h2>
      <p>Budget Rp 100 jt, 1000 nasabah menunggak. Buktikan strategi berbasis skor mengalahkan acak.</p>
      <PyodideLab
        title="Lab 2 — Optimasi Alokasi Collection"
        hint="Jalankan beberapa kali (seed berbeda). Selisih 'skor' vs 'acak' konsisten menang — itulah nilai collection scorecard dalam rupiah. Pertanyaan: apa kelemahan strategi 'skor tertinggi dulu'? (Petunjuk: yang skor rendah tidak pernah dihubungi...)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Sinyal Muncul — Apa Aksi?</h2>

      <div className="decision-card">
        <h3>1. Satu sinyal kuning (misal utilisasi naik) → <strong>pantau + reminder halus</strong></h3>
        <p><strong>Kondisi:</strong> satu indikator memburuk, lainnya normal.</p>
        <p><strong>Aksi:</strong> masukkan watchlist, kirim edukasi/SMS. Jangan overreact — satu sinyal bisa noise.</p>
      </div>

      <div className="decision-card">
        <h3>2. 2–3 sinyal merah (mutasi turun + utilisasi melonjak + SLIK memburuk) → <strong>intervensi proaktif</strong></h3>
        <p><strong>Kondisi:</strong> kombinasi sinyal — pola "kepepet" klasik.</p>
        <p><strong>Aksi:</strong> telepon relationship manager, tawarkan restrukturisasi <em>sebelum</em> menunggak (lebih murah + nasabah kooperatif). Pertimbangkan penurunan limit preventif.</p>
        <p><strong>Contoh nyata:</strong> Nasabah X di cerita pembuka — intervensi bulan 4 bisa menyelamatkan Rp 100 jt.</p>
      </div>

      <div className="decision-card">
        <h3>3. Sudah menunggak, skor perilaku tinggi → <strong>hubungi segera (prioritas 1)</strong></h3>
        <p><strong>Kondisi:</strong> DPD 15, skor 760 — kemungkinan "lupa", bukan "tidak mampu".</p>
        <p><strong>Aksi:</strong> telepon/SMS otomatis. Recovery rate 90%+ dengan biaya Rp 50 ribu. ROI tertinggi di collection.</p>
      </div>

      <div className="decision-card">
        <h3>4. Sudah menunggak, skor perilaku rendah → <strong>kunjungan + negosiasi</strong></h3>
        <p><strong>Kondisi:</strong> DPD 45, skor 580 — tidak akan sembuh dengan telepon.</p>
        <p><strong>Aksi:</strong> kunjungan lapangan, pahami akar masalah, tawarkan restrukturisasi realistis. Kalau tidak mampu total → alihkan ke remedial.</p>
      </div>

            <div className="decision-card">
        <h3>5. Alert EWS berbunyi untuk 500 nasabah sekaligus (false alarm massal) → <strong>kalibrasi ulang, jangan matikan sistemnya</strong></h3>
        <p><strong>Kondisi:</strong> menjelang Lebaran, EWS memunculkan 500 alert utilisasi melonjak. Tim collection protes: "tidak mungkin hubungi 500 orang — sistemnya matikan saja."</p>
        <p><strong>Aksi:</strong> mematikan EWS = membuang radar karena berisik. Yang benar: (1) <strong>kalibrasi musiman</strong> — naikkan ambang alert utilisasi selama periode Lebaran (sudah diantisipasi), (2) <strong>prioritaskan</strong> — dari 500, saring yang punya 2+ sinyal (utilisasi + mutasi turun + SLIK memburuk) → mungkin tinggal 40 yang benar-benar prioritas, (3) <strong>tiered action</strong> — 40 prioritas ditelepon personal, sisanya dapat SMS edukasi otomatis. EWS yang baik bukan yang paling sensitif, melainkan yang <strong>paling bisa ditindaklanjuti</strong>.</p>
        <p><strong>Contoh nyata:</strong> bank yang EWS-nya menghasilkan 1.000 alert/bulan dengan 95% false alarm akan diabaikan tim dalam 3 bulan (alert fatigue). Bank yang EWS-nya menghasilkan 50 alert/bulan dengan 60% true positive akan dipatuhi — karena setiap alert terbukti "berisi". Kualitas mengalahkan kuantitas.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Pantau perubahan, bukan level.</strong> Turunan pertama = sinyal.</li>
          <li><strong>DPD = 0 bukan berarti aman.</strong> Perilaku bicara lebih dulu.</li>
          <li><strong>EWS tanpa playbook = hiasan.</strong> Sinyal → aksi dalam hitungan hari.</li>
          <li><strong>Collection = triase.</strong> Alokasikan ke (peluang × outstanding − biaya) tertinggi.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Playbook EWS: Dari Sinyal ke Aksi dalam 48 Jam</h3>
      <p>EWS tanpa playbook = alarm kebakaran tanpa tangga darurat. Ini SOP 48 jam dari sinyal muncul hingga aksi tuntas.</p>
      <ol>
        <li><strong>Jam 0–4: triase otomatis</strong> — Sistem mengklasifikasi: 1 sinyal kuning → pantau; 2–3 sinyal merah → intervensi; sudah menunggak → collection scorecard (CR9 kuadran).</li>
        <li><strong>Jam 4–24: verifikasi manusia</strong> — Analis memverifikasi 3 hal: apakah data benar? (bukan error sistem), apakah ada penjelasan jinak? (gaji telat 3 hari vs PHK), seberapa besar eksposur?</li>
        <li><strong>Jam 24–48: aksi tiered</strong> — Tier 1 (ringan): SMS/WA edukasi otomatis. Tier 2 (sedang): telepon personal + tawarkan penjadwalan. Tier 3 (berat): kunjungan + restrukturisasi antisipatif.</li>
        <li><strong>Hari 3–7: catat &amp; ukur</strong> — Setiap alert dicatat: sinyal apa, aksi apa, hasil apa. Tanpa ini, EWS tidak pernah belajar — dan tidak pernah membaik.</li>
        <li><strong>Bulanan: kalibrasi</strong> — Hitung true positive rate alert. Di bawah 40% = terlalu berisik (naikkan ambang / tambah syarat 2+ sinyal). Di atas 80% = mungkin terlalu longgar (banyak yang lolos).</li>
        <li><strong>Musiman: penyesuaian</strong> — Ambang Lebaran ≠ ambang biasa. Kalender risiko Indonesia (CR9) dimasukkan ke parameter — bukan dihafal analis.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> cetak playbook ini dan latih tim collection. EWS yang baik bukan yang paling sensitif — melainkan yang paling bisa ditindaklanjuti.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Behavioral score vs application score — mana yang dipakai untuk limit review tahunan?</summary>
        <p><strong>Behavioral</strong> — karena debitur sudah punya riwayat perilaku (data lebih jujur!). Application score 'kedaluwarsa' saat pencairan; behavioral score <strong>hidup</strong> bersama nasabah. Review limit tahunan tanpa behavioral score = memutuskan dengan foto lama.</p>
      </details>
      <details className="worked">
        <summary>❓ Berapa banyak sinyal untuk trigger intervensi?</summary>
        <p>Praktik: <strong>2–3 sinyal merah</strong> = intervensi proaktif; 1 sinyal kuning = pantau. Satu sinyal bisa noise; tiga sinyal independen yang bersamaan = pola. Jangan intervensi untuk 1 sinyal lemah — <strong>false alarm membunuh kepercayaan tim</strong> pada EWS.</p>
      </details>
      <details className="worked">
        <summary>❓ EWS untuk korporasi — sama dengan ritel?</summary>
        <p>Prinsip sama, <strong>sinyal beda</strong>: ritel = utilisasi, mutasi, SLIK; korporasi = covenant breach, penurunan rating, keterlambatan laporan keuangan, pergantian direksi/management, berita negatif. EWS korporasi lebih <strong>kualitatif</strong> — analisnya manusia, bukan sekadar model.</p>
      </details>
      <details className="worked">
        <summary>❓ Collection scorecard — etis menagih yang 'mau bayar tapi butuh diingatkan' duluan?</summary>
        <p>Justru <strong>paling etis</strong>: mereka dibantu (diingatkan) sebelum tunggakannya membesar dan biayanya naik. Yang tidak etis = menagih brutal yang tidak mampu, atau membiarkan yang 'lupa' menjadi macet karena tidak diingatkan. <strong>Prioritas = kebaikan</strong>, bukan kekejaman.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Di Indonesia, behavioral scoring dan EWS bukan kemewahan — melainkan <strong>kebutuhan bertahan hidup</strong> di tengah volatilitas ekonomi.</p>

      <h3>EWS dan Musim: Kalender Risiko Indonesia</h3>
      <p>Risiko kredit Indonesia punya <strong>musim</strong>: Lebaran (konsumsi melonjak, utilisasi kartu naik), tahun ajaran baru (pengeluaran pendidikan), musim paceklik/panen (untuk debitur agri), dan akhir tahun (bonus vs pengeluaran liburan). EWS yang baik <strong>dikalibrasi per musim</strong> — ambang alert utilisasi menjelang Lebaran berbeda dari bulan biasa. Bank yang memakai ambang tunggal sepanjang tahun akan kebanjiran false alarm tiap Lebaran, lalu tim collection mengabaikan alert ("ah, biasa, Lebaran") — termasuk alert yang benar-benar penting. <strong>Alert fatigue</strong> adalah pembunuh EWS yang paling umum.</p>

      <h3>SLIK sebagai Sinyal Terkuat</h3>
      <p>Pengalaman industri Indonesia: sinyal behavioral terkuat bukanlah data internal bank, melainkan <strong>perburukan SLIK di bank lain</strong>. Polanya konsisten — nasabah biasanya macet di bank lain dulu (yang limitnya lebih kecil / hubungannya lebih jauh) sebelum macet di bank utama. Artinya: <strong>monitoring SLIK berkala untuk debitur existing</strong> adalah EWS termurah dan terampuh. Bank yang hanya memonitor data internal seperti dokter yang hanya memeriksa satu gejala.</p>
      <p>Praktik yang berjalan: bank-bank besar me-<em>refresh</em> SLIK debitur prioritas secara berkala (dengan memperhatikan aturan privasi dan biaya akses). Perubahan kolektibilitas di bank lain → trigger review. Sederhana, murah, efektif.</p>

      <h3>Regulasi Penagihan: Otak Boleh, Otot Dibatasi</h3>
      <p>OJK mengatur <strong>tata cara penagihan</strong>: debt collector wajib bersertifikat, dilarang menagih dengan ancaman/kekerasan, dilarang menagih ke pihak yang bukan debitur/penjamin, dan ada batasan waktu penagihan. Pelanggaran = sanksi untuk bank, bukan hanya untuk collector. Implikasinya untuk collection scorecard: <strong>strategi "tekan terus sampai bayar" tidak hanya tidak efektif — tetapi ilegal</strong>. Kuadran "tidak mampu total" harus dialihkan ke remedial/legal, bukan ditekan. Collection yang cerdas = collection yang patuh.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: membaca tiga sinyal (klik untuk buka)</summary>
        <p>Nasabah kartu kredit, limit Rp 50 jt. Data 4 bulan:</p>
        <p>Bulan 1: utilisasi 25%, mutasi masuk Rp 20 jt, bayar penuh.<br />
        Bulan 2: utilisasi 40%, mutasi masuk Rp 18 jt, bayar penuh.<br />
        Bulan 3: utilisasi 65%, mutasi masuk Rp 12 jt, bayar minimum.<br />
        Bulan 4: utilisasi 88%, mutasi masuk Rp 8 jt, bayar minimum.</p>
        <p><strong>Langkah 1</strong> — baca turunan: utilisasi +63 poin dalam 3 bulan (meledak), mutasi −60% (penghasilan terganggu), pola bayar memburuk (penuh → minimum).<br />
        <strong>Langkah 2</strong> — klasifikasi: <strong>3 sinyal merah</strong> → intervensi proaktif (kuadran collection: hubungi, tawarkan restrukturisasi ringan).<br />
        <strong>Langkah 3</strong> — JANGAN tunggu tunggakan: pada titik ini nasabah masih "lancar" (bayar minimum = tidak telat). Menunggu DPD &gt; 0 = menunggu terlambat.</p>
        <p><strong>Pelajaran:</strong> behavioral score menangkap masalah <strong>saat masih bisa diselamatkan</strong> — 2–3 bulan sebelum tunggakan pertama. Itulah nilai ekonomi EWS.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Nasabah yang selalu bayar tepat waktu pasti aman."</strong></p>
        <p><strong>Yang benar:</strong> "bayar minimum tepat waktu" selama 6 bulan berturut-turut + utilisasi merangkak naik = <strong>pola gali lubang tutup lubang</strong> yang klasik. Ia "lancar" secara administratif tetapi memburuk secara ekonomi. Behavioral score yang baik menangkap ini; analis yang hanya melihat DPD tidak.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Gelombang yang Terlewat</h2>
      <div className="callout">
        <p>Q1 2026, NPL KTA Bank Nusantara melonjak 3% → 5,5%. Investigasi forensik menemukan:</p>
        <ul>
          <li>6 bulan sebelumnya, <strong>mutasi rekening 40% debitur KTA turun &gt;30%</strong> (gelombang PHK sektor tekstil).</li>
          <li>Utilisasi kartu kredit segmen yang sama <strong>naik 35% → 70%</strong>.</li>
          <li>SLIK menunjukkan <strong>Kolek 2 di bank lain naik 2× lipat</strong> untuk segmen ini.</li>
          <li>Semua sinyal <strong>tersedia di data warehouse</strong> — tapi tidak ada yang memantau; dashboard hanya menampilkan DPD.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> rancang EWS minimal (3 sinyal + ambang + aksi) yang bisa mencegah kejadian ini terulang. Berapa "harga" keterlambatan 6 bulan ini?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>EWS minimal:</strong> (1) <strong>Mutasi turun &gt;40% (3 bln)</strong> → alert kuning → RM menelepon dalam 7 hari. (2) <strong>Utilisasi &gt;80% + tren naik</strong> → alert oranye → tawarkan restrukturisasi dini / turunkan limit. (3) <strong>SLIK bank lain → Kolek 2</strong> → alert merah → bekukan penarikan + kunjungan.</p>
          <p><strong>Harga keterlambatan:</strong> NPL naik 2,5 poin dari portofolio KTA Rp 4 T = <strong>Rp 100 M</strong> tambahan bermasalah. Dengan intervensi dini (restrukturisasi saat masih DPD 0), studi industri menunjukkan 40–60% bisa diselamatkan = <strong>Rp 40–60 M</strong> potensi selamat. EWS yang "mahal" (tim + sistem Rp 2 M/tahun) vs Rp 50 M kerugian — ROI-nya tidak perlu dihitung dua kali.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Apa keunggulan utama behavioral scorecard dibanding application scorecard?"
        options={[
          "Lebih murah dibuat",
          "Menilai nasabah yang HIDUP dari perilaku terkini (tren utilisasi, mutasi) — menangkap perubahan SEBELUM tunggakan",
          "Tidak butuh data",
          "Selalu lebih akurat",
        ]}
        correct={1}
        explanation="Benar: application = foto saat lahir; behavioral = CCTV semasa hidup. Nasabah berubah — model harus ikut berubah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Nasabah DPD 0, tapi utilisasi melonjak 30%→85% dan mutasi turun 45%. Tindakan terbaik?"
        options={[
          "Abaikan — DPD 0 berarti aman",
          "Intervensi proaktif: hubungi, pahami sebab, tawarkan restrukturisasi dini — perilaku memburuk sebelum DPD",
          "Langsung bekukan rekening",
          "Naikkan limitnya",
        ]}
        correct={1}
        explanation="Benar: pola 'kepepet' klasik. Menunggu DPD = menunggu terlambat. Restrukturisasi saat DPD 0 jauh lebih murah dan kooperatif."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Mengapa 'perubahan utilisasi' lebih baik dari 'level utilisasi' sebagai variabel?"
        options={[
          "Level tidak bisa dihitung",
          "Perubahan (turunan pertama) menangkap dinamika: 80% stabil ≠ 80% yang melonjak dari 30% — yang kedua adalah sirene",
          "Regulator melarang level",
          "Tidak ada bedanya",
        ]}
        correct={1}
        explanation="Benar: level = foto, perubahan = film. Dua nasabah dengan level sama bisa berada di trayektori berlawanan — model butuh trayektorinya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Budget collection terbatas. Nasabah A: tunggakan Rp 100 jt, peluang bayar 10%. Nasabah B: tunggakan Rp 40 jt, peluang bayar 90%. Prioritaskan?"
        options={[
          "A — tunggakannya lebih besar",
          "B — ekspektasi recovery 36 jt vs 10 jt; collection memaksimalkan peluang × outstanding − biaya",
          "Bagi rata",
          "Acak saja",
        ]}
        correct={1}
        explanation="Benar: B (0,9×40=36 > 0,1×100=10). 'Kejar yang besar' adalah insting yang salah — triase memakai ekspektasi, bukan nominal."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. EWS bank berbunyi tiap hari tapi tidak ada yang menindaklanjuti. Masalahnya?"
        options={[
          "Sinyalnya kurang canggih",
          "EWS tanpa playbook & akuntabilitas = hiasan; yang menentukan adalah waktu reaksi sinyal→aksi, bukan kecanggihan model",
          "Butuh lebih banyak sinyal",
          "Matikan saja EWS-nya",
        ]}
        correct={1}
        explanation="Benar: EWS = sistem saraf, bukan sekadar sensor. Tanpa otot (playbook: siapa, kapan, apa), sensor secanggih apapun tidak menyelamatkan."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Dua nasabah kartu kredit utilisasi 80%: A stabil 2 tahun, B naik dari 30% ke 80% dalam 3 bulan + mutasi turun 50%. Mana lebih berisiko?"
        options={[
          "Sama — utilisasinya sama",
          "B jauh lebih berisiko — tren (turunan pertama) adalah sinyal; A stabil berarti pola usahanya memang begitu",
          "A lebih berisiko — sudah lama di 80%",
          "Tidak bisa dinilai tanpa SLIK",
        ]}
        correct={1}
        explanation="Benar: B. Prinsip behavioral scoring: tren mengalahkan level. Utilisasi stabil 80% (A) = pola usaha; utilisasi meledak + mutasi anjlok (B) = kepepet. Model yang hanya melihat level menyamakan keduanya — model yang baik tidak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. EWS memunculkan 500 alert sekaligus menjelang Lebaran. Respons yang benar?"
        options={[
          "Matikan EWS — jelas rusak",
          "Hubungi semua 500 — jangan sampai lolos",
          "Kalibrasi musiman + prioritaskan yang 2+ sinyal + tiered action (telepon prioritas, SMS massal sisanya)",
          "Abaikan — Lebaran selalu begitu",
        ]}
        correct={2}
        explanation="Benar: kalibrasi + prioritaskan. Mematikan EWS = membuang radar; menghubungi semua = tidak feasible; mengabaikan = alert fatigue. EWS yang baik adalah yang bisa ditindaklanjuti: saring ke prioritas nyata, tangani sisanya otomatis."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Application</strong> = layak diberi? (saat lahir) | <strong>Behavioral</strong> = masih sehat? (semasa hidup) | <strong>Collection</strong> = cara menagih? (saat sakit).</li>
          <li><strong>Variabel behavioral terbaik = perubahan</strong> (turunan pertama): tren utilisasi, tren mutasi.</li>
          <li><strong>Sinyal EWS terkuat</strong>: SLIK bank lain memburuk, mutasi turun &gt;40%, utilisasi melonjak.</li>
          <li><strong>EWS butuh playbook</strong>: sinyal → alert → aksi dalam hitungan hari.</li>
          <li><strong>Collection = triase</strong>: prioritaskan (peluang × outstanding − biaya), bukan nominal tunggakan.</li>
          <li>Kapan TIDAK mengandalkan behavioral: nasabah baru (belum ada perilaku) — di sana application scorecard berkuasa.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr8-reject-inference" className="btn btn-secondary btn-sm">← CR8</Link>
        <Link href="/learn/cr10-pd-modeling" className="btn btn-primary btn-sm">Next: CR10 →</Link>
      </div>
    </div>
  );
}
