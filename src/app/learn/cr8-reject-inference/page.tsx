"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr8Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const biasData = [
    {
      x: ["400–500", "500–600", "600–700", "700–800"],
      y: [25, 12, 5, 2],
      type: "bar",
      name: "Bad rate aktual (semua)",
      marker: { color: "#ef4444" },
    },
    {
      x: ["400–500", "500–600", "600–700", "700–800"],
      y: [0, 0, 5, 2],
      type: "bar",
      name: "Terlihat model (hanya yang ACC)",
      marker: { color: "#94a3b8" },
    },
  ];

  const methodsData = [
    {
      x: ["Ignore", "Parceling", "Augmentation", "Full model"],
      y: [1, 2, 3, 4],
      type: "bar",
      marker: { color: ["#ef4444", "#e8a838", "#2a7de1", "#3aa655"] },
      text: ["Berbahaya", "Praktis", "Populer", "Ideal (mahal)"],
      textposition: "outside",
    },
  ];

  const paradoxData = [
    {
      x: ["2022", "2023", "2024", "2025"],
      y: [4.2, 3.8, 3.1, 2.5],
      type: "scatter",
      mode: "lines+markers",
      name: "Bad rate terlihat (yang ACC)",
      line: { color: "#3aa655", width: 3 },
    },
    {
      x: ["2022", "2023", "2024", "2025"],
      y: [6.5, 7.2, 8.0, 9.1],
      type: "scatter",
      mode: "lines+markers",
      name: "Bad rate populasi penuh (estimasi)",
      line: { color: "#ef4444", width: 3, dash: "dash" },
    },
  ];

  const lab1Code = `# Lab 1: Simulasi selection bias — yang terlihat vs yang sebenarnya
# Bank hanya mengamati yang DI-ACC. Lihat bagaimana model "buta" di bawah cut-off.
import random, math
random.seed(5)

def true_pd(skor):
    return 1 / (1 + math.exp((skor - 550) / 45))

cutoff = 600
populasi = [int(random.gauss(600, 90)) for _ in range(20000)]

bands = [(400,500),(500,600),(600,700),(700,800)]
print(f"{'Band skor':<10} {'True bad':>9} {'Terlihat':>9}")
for lo, hi in bands:
    anggota = [s for s in populasi if lo <= s < hi]
    true_bad = sum(true_pd(s) for s in anggota) / len(anggota) * 100
    # yang terlihat: hanya yang >= cutoff (di-ACC)
    acc = [s for s in anggota if s >= cutoff]
    terlihat = (sum(true_pd(s) for s in acc) / len(acc) * 100) if acc else None
    t = f"{terlihat:.1f}%" if terlihat is not None else "TIDAK ADA DATA"
    print(f"{lo}-{hi:<6} {true_bad:>8.1f}% {t:>9}")
print()
print("Coba: turunkan cutoff jadi 550. Band 500-600 kini 'terlihat'.")
print("Bandingkan terlihat vs true — itulah bias yang selama ini tersembunyi.")`;

  const lab2Code = `# Lab 2: Augmentation — menimbang ulang yang di-ACC
# Ide: yang di-ACC di dekat cut-off "mewakili" yang ditolak.
# Beri bobot lebih pada mereka (inverse of approval probability).
import random, math
random.seed(9)

def true_pd(skor):
    return 1 / (1 + math.exp((skor - 550) / 45))

# Populasi + keputusan ACC (cutoff 600, dengan sedikit randomness)
data = []
for _ in range(20000):
    s = int(random.gauss(600, 90))
    acc_prob = 1 / (1 + math.exp(-(s - 600) / 15))  # peluang di-ACC naik dgn skor
    acc = random.random() < acc_prob
    bad = random.random() < true_pd(s)
    data.append((s, acc, bad, acc_prob))

# Bad rate NAIF (hanya yang ACC, tanpa bobot)
acc_saja = [(s,b) for s,a,b,p in data if a]
naif = sum(b for _,b in acc_saja)/len(acc_saja)*100

# Augmentation: bobot = 1 / P(ACC|skor) -> mewakili populasi penuh
terbobot_bad = sum(b/p for _,a,b,p in data if a)
terbobot_n = sum(1/p for _,a,b,p in data if a)
aug = terbobot_bad / terbobot_n * 100

# Kebenaran (simulasi tahu semua)
true = sum(true_pd(s) for s,_,_,_ in data)/len(data)*100

print(f"Bad rate NAIF (tanpa koreksi) : {naif:.2f}%")
print(f"Bad rate AUGMENTED (terbobot) : {aug:.2f}%")
print(f"Bad rate SEBENARNYA (populasi): {true:.2f}%")
print()
print("Augmentation mendekati kebenaran TANPA perlu data yang ditolak.")
print("Syarat: model P(ACC) harus benar — kalau salah, bobotnya salah juga.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR8 — Credit Risk Analyst</span>
        <h1 className="display-title">Reject Inference:<br />Dosa yang Tak Terlihat</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Rumah Sakit yang Hanya Merawat Orang Sehat</a></li>
          <li><a href="#masalah">Masalahnya: Kita Tak Pernah Tahu yang Ditolak</a></li>
          <li><a href="#dampak">Dampak: Model yang Buta di Bawah Cut-off</a></li>
          <li><a href="#metode">Empat Metode: Dari Abaikan sampai Ideal</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Selection Bias</a></li>
          <li><a href="#lab2">🔬 Lab 2: Augmentation (Pembobotan)</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Kapan Peduli Reject Inference?</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: "Model Kita Membaik!" — Benarkah?</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan selection bias: mengapa data latih scorecard (hanya yang di-ACC) tidak mewakili populasi aplikan.</li>
          <li>Mendemonstrasikan bagaimana bias ini membuat model buta di bawah cut-off dan meremehkan bad rate.</li>
          <li>Membandingkan 4 metode reject inference (ignore, parceling, augmentation, full model) — kapan memakai apa.</li>
          <li>Menghitung koreksi augmentation sederhana (inverse probability weighting).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Rumah Sakit yang Hanya Merawat Orang Sehat</h2>
      <div className="story">
        <p>Sebuah RS mengklaim: <em>"Tingkat kesembuhan pasien kami 99%!"</em> Wartawan menyelidiki — ternyata RS itu <strong>menolak semua pasien kritis</strong> di pintu masuk. Tentu saja yang dirawat (yang sehat-sehat) sembuh. Klaim 99% itu benar secara angka, <strong>bohong secara makna</strong>.</p>
        <p>Scorecard bank melakukan hal yang sama — secara struktural. Model dilatih <strong>hanya dari nasabah yang di-ACC</strong> (yang lolos cut-off). Nasabah yang ditolak? <strong>Tidak pernah diamati</strong> — tidak ada yang tahu apakah mereka benar-benar akan macet.</p>
        <p>Rina, analis Bank Nusantara, menyadarinya saat audit: <em>"Model kita tidak pernah melihat skor di bawah 600. Tapi kita memakai model ini untuk... menolak skor di bawah 600. Kita menolak berdasarkan ramalan tentang wilayah yang <strong>tidak pernah kita amati</strong>."</em></p>
        <p><strong>Twist-nya:</strong> ini bukan bug yang bisa di-patch — melainkan <strong>cacat bawaan</strong> setiap scorecard. Ilmu untuk mengatasinya bernama <strong>reject inference</strong>: menyimpulkan nasib "yang ditolak" dari jejak "yang diterima". Lesson ini membahasnya — topik yang membedakan analis senior dari junior di interview.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="masalah">Masalahnya: Kita Tak Pernah Tahu yang Ditolak</h2>
      <p><strong>Definisi.</strong> <strong>Selection bias</strong> = data latih (yang di-ACC) adalah <strong>sampel tidak acak</strong> dari populasi aplikan — melainkan sampel yang <strong>sudah disaring</strong> oleh kebijakan sebelumnya. <strong>Reject inference</strong> = teknik mengestimasi perilaku <strong>yang ditolak</strong> (<em>rejects</em>) agar model mewakili <strong>seluruh populasi</strong> (<em>through-the-door population</em>).</p>
      <p><strong>Kepribadian:</strong> seperti <strong>sejarawan yang hanya membaca arsip pemenang perang</strong> — ceritanya lengkap, tapi sepihak. Scorecard tanpa reject inference adalah sejarah yang ditulis para penyintas (yang di-ACC).</p>
      <p><strong>Mengapa tidak sekadar ACC semua orang untuk observasi?</strong> Itu namanya <strong>full model dengan eksperimen</strong> — mahal (harus menanggung kerugian dari yang seharusnya ditolak) dan butuh persetujuan direksi. Beberapa bank melakukannya terbatas (<em>champion-challenger</em> dengan sampel kecil di bawah cut-off).</p>

      <PlotlyChart
        data={biasData}
        title="Yang Terlihat vs Kenyataan: Bad Rate per Band Skor"
        layout={{ xaxis: { title: "Band skor" }, yaxis: { title: "Bad rate (%)" }, barmode: "group", showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> batang merah = bad rate SEBENARNYA (simulasi tahu semua); batang abu-abu = yang TERLIHAT model (hanya dari yang di-ACC, cut-off 600).</p>
        <p><strong>Interpretasi:</strong> di band 600+, keduanya cocok — model "tahu" wilayahnya. Di band <strong>di bawah 600: tidak ada batang abu-abu sama sekali</strong> — model buta total. Padahal di sanalah bad rate sebenarnya 12–25%! Keputusan menolak di wilayah buta ini didasarkan pada <strong>ekstrapolasi</strong>, bukan observasi.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> selection bias <strong>memburuk seiring waktu</strong>. Model v1 menolak skor &lt;600 → data latih v2 tidak punya skor &lt;600 → v2 makin yakin wilayah itu berbahaya → cut-off naik ke 620 → makin buta. Ini <strong>lingkaran setan</strong> yang hanya bisa diputus dengan sengaja mengamati wilayah tolak (sampel acak di bawah cut-off).</p>
      </div>

      <h2 id="dampak">Dampak: Model yang Buta di Bawah Cut-off</h2>
      <p>Tiga dampak praktis selection bias:</p>
      <ul>
        <li><strong>Bad rate underestimate:</strong> model mengira populasi berisiko X%, padahal (termasuk yang ditolak) risikonya X+Y%. Ekspansi cut-off berdasarkan angka underestimate = kejutan NPL.</li>
        <li><strong>Koefisien bias:</strong> variabel yang dipakai untuk keputusan sebelumnya (misal skor lama) terlihat "tidak prediktif" — karena variasinya sudah disaring habis. Fenomena ini disebut <strong><em>range restriction</em></strong>.</li>
        <li><strong>Ilusi perbaikan:</strong> bad rate "terlihat" turun tiap tahun (karena seleksi makin ketat), sementara risiko populasi sebenarnya naik — lihat chart berikut.</li>
      </ul>

      <PlotlyChart
        data={paradoxData}
        title="Paradoks: Bad Rate Terlihat Turun, Risiko Populasi Naik"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "Bad rate (%)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis hijau = bad rate yang terlihat (hanya yang di-ACC); garis merah putus-putus = estimasi populasi penuh (dengan reject inference).</p>
        <p><strong>Interpretasi:</strong> manajemen merayakan "risiko turun 4,2%→2,5%" — padahal itu <strong>efek seleksi makin ketat</strong>, bukan debitur membaik. Risiko populasi sebenarnya NAIK 6,5%→9,1% (ekonomi memburuk). Tanpa reject inference, direksi membuat keputusan dari <strong>cermin yang menipu</strong>.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Data kita besar (jutaan nasabah), jadi bias tidak masalah."</strong></p>
        <p><strong>Yang benar:</strong> selection bias bukan masalah <strong>ukuran sampel</strong>, melainkan <strong>keterwakilan</strong>. Sejuta data dari wilayah yang sama tetap buta terhadap wilayah lain. Seperti survei kepuasan yang hanya bertanya ke pelanggan yang <em>tidak</em> komplain — sejuta responden pun tetap bias.</p>
      </div>

      <h2 id="metode">Empat Metode: Dari Abaikan sampai Ideal</h2>
      <p><strong>1. Ignore (abaikan)</strong> — latih dari yang di-ACC saja. Praktik umum, berbahaya jika cut-off akan diubah. <em>"Berdoa biasnya kecil."</em></p>
      <p><strong>2. Parceling</strong> — bagi yang ditolak ke band skor, tetapkan bad rate <strong>asumsi</strong> per band (misal: 2× bad rate band yang di-ACC), lalu latih ulang. Sederhana, tapi asumsi = tebakan.</p>
      <p><strong>3. Augmentation (pembobotan)</strong> — beri bobot <Tex math={String.raw`w = \frac{1}{P(\text{ACC} \mid \text{skor})}`} /> pada yang di-ACC: yang "hampir ditolak" (dekat cut-off) diberi bobot besar karena mewakili banyak yang ditolak. Populer di industri — tanpa data rejects pun bisa.</p>
      <p><strong>Artinya rumus:</strong> peluang di-ACC kecil → bobot besar. Nasabah skor 605 (peluang ACC 55%) diberi bobot 1/0,55 ≈ 1,8 — ia "berbicara untuk" dirinya + 0,8 "hantu" yang ditolak.</p>
      <p><strong>4. Full model / Heckman</strong> — model dua tahap: (a) model siapa yang di-ACC, (b) model default dengan koreksi seleksi. Ideal secara teori, kompleks, jarang dipakai penuh di industri.</p>
      <p><strong>Praktik emas industri:</strong> <strong>sampel acak di bawah cut-off</strong> — ACC-kan 5–10% aplikan di bawah cut-off secara acak (dengan limit kecil) untuk observasi langsung. Mahal tapi jujur — "membeli" data kebenaran.</p>

      <PlotlyChart
        data={methodsData}
        title="Empat Metode Reject Inference: Biaya vs Kebenaran"
        layout={{ xaxis: { title: "Metode" }, yaxis: { title: "Tingkat kecanggihan" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = kecanggihan/ketepatan metode.</p>
        <p><strong>Interpretasi:</strong> ada trade-off jelas: makin benar makin mahal. <strong>Augmentation</strong> adalah sweet spot industri (murah, cukup baik). Tapi tidak ada yang mengalahkan <strong>data observasi langsung</strong> (sampel acak di bawah cut-off) — karena semua metode statistik pada dasarnya menebak yang tak teramati.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> reject inference <strong>paling penting saat cut-off akan diubah</strong>. Kalau cut-off tetap selamanya, biasnya "terkunci" dan model tetap berguna di wilayah operasinya. Masalah meledak saat ekspansi (cut-off turun) — keputusan justru diambil di wilayah paling buta. Aturan: <strong>mau ubah cut-off? Wajib reject inference dulu.</strong></p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Ketidaktahuan yang Terstruktur</h3>
      <p>Reject inference adalah pelajaran tentang <strong>epistemologi</strong> — ilmu tentang apa yang bisa kita ketahui. Kita tidak pernah tahu nasib yang ditolak, dan tidak akan pernah tahu (kecuali membayar mahal untuk eksperimen). Yang bisa kita lakukan: <strong>memodelkan ketidaktahuan itu sendiri</strong> — mengestimasi seberapa buta kita, dan ke arah mana kebutaan itu membiaskan keputusan. Analis yang berkata "model kita punya bad rate 3%" tanpa menyebut selection bias sedang berbohong dengan statistik — ia melaporkan angka yang hanya berlaku di "dunia yang di-ACC".</p>
      <p>Intuisi kedua: <strong>bias ini memburuk secara senyap dari generasi ke generasi</strong>. Model v1 menolak skor &lt;600 → data latih v2 tidak punya contoh skor &lt;600 → model v2 makin yakin bahwa "dunia hanya berisi skor 600+" → cut-off makin sulit dievaluasi. Ini <strong>spiral kebutaan</strong>: setiap generasi model mewarisi kebutaan generasi sebelumnya, ditambah kebutaannya sendiri. Satu-satunya pemutus spiral: data dari luar sistem — sampel acak di bawah cut-off, atau data eksternal (SLIK!).</p>
      <p>Intuisi ketiga — yang paling praktis: <strong>reject inference hanya penting saat kamu ingin mengubah wilayah keputusan</strong>. Cut-off tetap selamanya? Bias terkunci, model tetap valid <em>di wilayahnya</em>. Mau ekspansi ke segmen baru? Wajib reject inference. Ini seperti peta: peta Jawa akurat untuk Jawa — jangan pakai untuk berlayar ke Papua. Pertanyaan kuncinya bukan "apakah modelku bias?" (jawabannya selalu ya), melainkan <strong>"apakah aku akan memakai model di luar wilayah datanya?"</strong></p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Simulasi Selection Bias</h2>
      <p>20.000 aplikan simulasi. Lihat wilayah buta model dengan mata kepalamu sendiri.</p>
      <PyodideLab
        title="Lab 1 — Wilayah Buta di Bawah Cut-off"
        hint="Coba turunkan cutoff ke 550, lalu naikkan ke 650. Perhatikan: makin tinggi cut-off, makin LEBAR wilayah buta. Itulah harga seleksi ketat."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Augmentation (Pembobotan)</h2>
      <p>Koreksi bias tanpa data yang ditolak — dengan memberi bobot lebih pada yang "hampir ditolak".</p>
      <PyodideLab
        title="Lab 2 — Inverse Probability Weighting"
        hint="Bandingkan 3 angka: naif vs augmented vs sebenarnya. Augmentation mendekati kebenaran — tapi ingat syaratnya: model P(ACC) harus benar. Coba rusak model P(ACC) dan lihat apa yang terjadi."
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Kapan Peduli Reject Inference?</h2>

      <div className="decision-card">
        <h3>1. Cut-off tetap, model dipakai di wilayah yang sama → <strong>bias terkunci, boleh ignore (dengan sadar)</strong></h3>
        <p><strong>Kondisi:</strong> tidak ada rencana ekspansi/kontraksi.</p>
        <p><strong>Kenapa:</strong> model tetap valid di wilayah operasinya. Dokumentasikan asumsi ini — ia adalah "utang" yang jatuh tempo saat cut-off berubah.</p>
      </div>

      <div className="decision-card">
        <h3>2. Rencana turunkan cut-off (ekspansi) → <strong>WAJIB reject inference</strong></h3>
        <p><strong>Kondisi:</strong> bisnis minta approval naik.</p>
        <p><strong>Aksi:</strong> augmentation/parceling untuk estimasi bad rate di band baru. Tanpa ini, proyeksi NPL ekspansi = tebakan buta.</p>
      </div>

      <div className="decision-card">
        <h3>3. Punya budget &amp; dukungan direksi → <strong>sampel acak di bawah cut-off</strong></h3>
        <p><strong>Kondisi:</strong> bank serius soal kualitas model.</p>
        <p><strong>Cara:</strong> ACC-kan 5–10% aplikan di bawah cut-off secara acak dengan limit kecil + monitoring ketat. Data kebenaran termahal tapi terbaik.</p>
      </div>

      <div className="decision-card">
        <h3>4. Membangun model generasi baru → <strong>pakai augmentation sebagai standar</strong></h3>
        <p><strong>Kondisi:</strong> rebuild scorecard (tiap 1–2 tahun).</p>
        <p><strong>Kenapa:</strong> murah (tanpa eksperimen), cukup baik, dan menjadi praktik yang diharapkan validator/auditor. Dokumentasikan metode + asumsinya.</p>
      </div>

            <div className="decision-card">
        <h3>5. Direksi menolak budget eksperimen ("ngapain ACC-in yang diprediksi macet?") → <strong>tawarkan SLIK lookback sebagai alternatif gratis</strong></h3>
        <p><strong>Kondisi:</strong> kamu butuh reject inference untuk rencana ekspansi, tetapi direksi menolak eksperimen sampel acak — "terlalu mahal dan berisiko reputasi".</p>
        <p><strong>Aksi:</strong> jangan berdebat — tawarkan <strong>SLIK lookback</strong>: ambil 5.000 aplikan yang ditolak 12–24 bulan lalu, cek status kredit mereka di SLIK sekarang (di bank lain). Biaya ≈ nol (hanya kerja analis + biaya akses SLIK yang sudah ada). Hasilnya: estimasi bad rate populasi ditolak + bukti empiris untuk direksi bahwa "yang kita tolak memang sebagian besar bermasalah — TETAPI X% ternyata lancar, itulah peluang ekspansi yang hilang". Data ini sering justru <strong>meyakinkan direksi</strong> untuk menyetujui eksperimen kecil berikutnya.</p>
        <p><strong>Contoh nyata:</strong> bank menengah menemukan via SLIK lookback bahwa 35% aplikan yang ditolak ternyata lancar di bank lain — artinya cut-off terlalu ketat, ada peluang bisnis yang terbuang. Temuan ini menjadi dasar penurunan cut-off yang <strong>terukur</strong> (bukan asal turun).</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Model hanya tahu yang di-ACC.</strong> Di bawah cut-off = wilayah buta.</li>
          <li><strong>Mau ubah cut-off? Reject inference dulu.</strong> Tanpa terkecuali.</li>
          <li><strong>Data besar ≠ data mewakili.</strong> Sejuta sampel bias tetap bias.</li>
          <li><strong>Sampel acak di bawah cut-off</strong> = kebenaran termahal &amp; terbaik.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Kapan Peduli: Matriks Keputusan Reject Inference</h3>
      <p>Tidak semua situasi butuh reject inference penuh. Matriks ini menentukan level usaha yang tepat.</p>
      <ol>
        <li><strong>Cut-off tetap + populasi stabil → Level 0: sadari, dokumentasikan</strong> — Bias terkunci dan model valid di wilayahnya. Cukup catat asumsi + monitor — jangan buang budget.</li>
        <li><strong>Rencana turunkan cut-off → Level 3: wajib penuh</strong> — Ekspansi ke wilayah buta tanpa peta = bunuh diri. Augmentation + SLIK lookback + (idealnya) sampel acak.</li>
        <li><strong>Segmen/produk baru → Level 3: pilot dulu</strong> — Model lama buta total di populasi baru. Pilot limit kecil 12 bulan = harga data yang wajib dibayar.</li>
        <li><strong>Ada budget + dukungan direksi → Level 4: sampel acak</strong> — Standar emas. 5–10% di bawah cut-off, limit kecil, 12 bulan. Dokumentasikan sebagai 'program validasi model'.</li>
        <li><strong>Tidak ada budget → Level 2: SLIK lookback</strong> — Gratis dan sering cukup: cek 5.000 aplikan ditolak 12–24 bulan lalu di SLIK. Estimasi bias + amunisi untuk minta budget eksperimen.</li>
        <li><strong>Model generasi baru → Level 2: augmentation standar</strong> — Jadikan augmentation sebagai default pipeline — murah, otomatis, dan jauh lebih jujur dari 'ignore'.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> tanyakan satu pertanyaan kunci sebelum memutuskan level: 'apakah aku akan memakai model di LUAR wilayah datanya?' Ya = investasikan; tidak = dokumentasikan.</p>

      <h3>💬 Tanya Jawab Praktisi</h3>
      <p>Pertanyaan yang paling sering ditanyakan analis junior tentang topik ini — dijawab sejujurnya.</p>
      <details className="worked">
        <summary>❓ Augmentation vs ignore — bedanya seberapa besar praktisnya?</summary>
        <p>Tergantung seberapa ketat cut-off: makin ketat (banyak ditolak) = makin besar bias = makin besar bedanya. Untuk cut-off moderat, augmentation mengubah PD 5–15% — <strong>material untuk ECL dan pricing</strong>. Untuk cut-off sangat ketat (&gt;50% ditolak), 'ignore' bisa meleset 2× lipat. Aturan: <strong>makin banyak yang ditolak, makin wajib koreksi</strong>.</p>
      </details>
      <details className="worked">
        <summary>❓ Sampel acak di bawah cut-off — berapa besar yang dibutuhkan?</summary>
        <p>Praktik: <strong>5–10% dari yang ditolak</strong>, minimum beberapa ratus akun agar statistik bermakna, diamati 12 bulan. Limit kecil (risiko terkendali). Ini <strong>investasi data</strong> — biayanya (expected loss sampel) jauh lebih kecil dari biaya keputusan buta.</p>
      </details>
      <details className="worked">
        <summary>❓ Bisakah reject inference memakai data SLIK sepenuhnya (tanpa eksperimen)?</summary>
        <p>Sebagian — <strong>SLIK lookback</strong> hanya melacak yang di-ACC bank lain (sampel tidak acak: bank lain juga selektif!). Ia mengurangi kebutaan, bukan menghilangkannya. Kombinasi ideal: SLIK lookback (murah, sekarang) + sampel acak kecil (mahal, definitif).</p>
      </details>
      <details className="worked">
        <summary>❓ Model v2 dilatih dari data v1 (yang sudah bias) — bagaimana memutus spiral?</summary>
        <p>Tiga pemutus: (1) <strong>data luar sistem</strong> (sampel acak / SLIK lookback), (2) <strong>augmentation</strong> sebagai standar pipeline, (3) <strong>dokumentasi asumsi</strong> — tulis eksplisit 'model ini buta di bawah skor X' agar pengguna tahu batasnya. Spiral yang diakui &lt; kontrol dari spiral yang disangkal.</p>
      </details>

                        {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Di Indonesia, reject inference bukan masalah teoretis — ia muncul setiap kali bank berekspansi ke segmen yang belum dikenal.</p>

      <h3>Ekspansi ke Thin-File: Buta yang Mahal</h3>
      <p>Bank yang selama ini melayani karyawan formal (berslip gaji, ber-SLIK) lalu berekspansi ke <strong>UMKM informal / thin-file</strong> menghadapi reject inference ekstrem: model lamanya tidak punya data sama sekali untuk populasi baru. Praktik yang benar (dan mahal): <strong>program percontohan dengan limit kecil</strong> — ACC-kan sampel acak dengan plafon terbatas, amati 12 bulan, lalu latih model khusus segmen. Bank yang langsung "gaspol" ekspansi tanpa pilot = menjalankan eksperimen dengan uang nasabah — dan hasilnya terlihat 12–18 bulan kemudian sebagai NPL.</p>
      <p>Kasus yang berulang: <strong>digital lending 2021–2023</strong>. Banyak bank/fintech menurunkan cut-off agresif untuk mengejar pertumbuhan pengguna aplikasi — tanpa reject inference yang memadai untuk populasi digital yang baru. Hasilnya: NPL paylater/KTA digital melonjak 2023–2024, OJK memperketat pengawasan, beberapa pemain mundur. Pelajaran yang dibayar mahal: <strong>pertumbuhan tanpa pemahaman populasi = memanen risiko</strong>.</p>

      <h3>SLIK sebagai "Jendela ke yang Ditolak"</h3>
      <p>Ada satu sumber data yang mengurangi kebutaan: <strong>SLIK OJK</strong>. Nasabah yang kita tolak mungkin di-ACC bank lain — dan perilakunya tercatat di SLIK! Analis cerdas memakai ini: ambil sampel aplikan yang ditolak, cek 12 bulan kemudian di SLIK — berapa yang ternyata macet di bank lain? Ini <strong>reject inference gratis</strong> (dengan keterbatasan: hanya yang di-ACC bank lain yang terlacak). Bank-bank Indonesia yang rajin melakukan ini punya estimasi bias yang jauh lebih jujur dibanding yang tidak.</p>

      <h3>Regulasi: Eksperimen Butuh Izin</h3>
      <p>Metode ideal — sampel acak di bawah cut-off — berarti <strong>sengaja memberi kredit ke yang diprediksi macet</strong>. Di Indonesia, ini butuh persetujuan direksi dan kerangka governance yang jelas (limit kecil, monitoring ketat, periode terbatas), karena secara sadar mengambil expected loss. OJK tidak melarang — tetapi bank harus bisa menjelaskan bahwa ini <strong>investasi data</strong>, bukan kecerobohan. Dokumentasikan sebagai "program validasi model", bukan "pelonggaran kredit". Bahasa menentukan nasib proposal.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: augmentation sederhana (klik untuk buka)</summary>
        <p>Cut-off 600. Nasabah A skor 605 (peluang di-ACC 55%), nasabah B skor 800 (peluang di-ACC 98%). Keduanya lancar (good).</p>
        <p><strong>Langkah 1</strong> — hitung bobot = 1 / peluang di-ACC:<br />
        Bobot A = 1 / 0,55 ≈ <strong>1,82</strong>; Bobot B = 1 / 0,98 ≈ <strong>1,02</strong>.<br />
        <strong>Langkah 2</strong> — dalam training, A "berbicara" 1,82× lebih keras dari B.<br />
        <strong>Langkah 3</strong> — mengapa? A mewakili populasi "hampir ditolak" yang <strong>langka</strong> di data (kebanyakan yang seperti A ditolak) — suaranya harus diperkuat agar model belajar wilayah perbatasan.</p>
        <p><strong>Pelajaran:</strong> augmentation tidak menciptakan data baru — ia <strong>menyeimbangkan suara</strong> yang sudah ada. Murah, masuk akal, dan menjadi standar industri untuk alasan yang bagus.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Kalau cut-off tidak pernah diubah, reject inference tidak perlu dipikirkan."</strong></p>
        <p><strong>Yang benar:</strong> sebagian benar — bias "terkunci" jika wilayah keputusan tetap. Tetapi <strong>populasi bisa bergeser di bawah cut-off yang tetap</strong> (misal resesi membuat aplikan di semua skor lebih berisiko), dan strategi bisnis bisa berubah (produk baru, kanal baru). "Cut-off tetap" bukan jaminan abadi — monitoring (CR7b) tetap wajib, dan reject inference tetap relevan saat membaca ulang asumsi.</p>
      </div>

      <h2 id="case">📋 Mini-Case: "Model Kita Membaik!" — Benarkah?</h2>
      <div className="callout">
        <p>Tim modeling Bank Nusantara melaporkan dengan bangga: <strong>"Bad rate turun 4 tahun berturut-turut: 4,2% → 2,5%! Model makin jago!"</strong> Kamu diminta verifikasi independen. Temuanmu:</p>
        <ul>
          <li>Cut-off <strong>dinaikkan 3 kali</strong> dalam 4 tahun (600 → 620 → 640 → 660).</li>
          <li>Approval rate turun 70% → 45%.</li>
          <li>Tidak pernah ada reject inference — semua metrik dari data yang di-ACC saja.</li>
          <li>Data makro: pengangguran <strong>naik</strong>, daya beli <strong>turun</strong> dalam periode yang sama.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> apakah model benar-benar membaik? Apa yang sebenarnya terjadi, dan apa rekomendasi 2 poinmu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Tidak — ini ilusi seleksi.</strong> Bad rate turun karena <strong>penyaringan makin ketat</strong> (approval 70%→45%), bukan karena model makin pintar atau debitur membaik. Buktinya: ekonomi justru memburuk — jika model "membaik" sungguhan, ia harusnya mendeteksi risiko naik, bukan turun. Ini paradoks chart di atas: garis hijau turun, garis merah (populasi) naik.</p>
          <p><strong>Rekomendasi:</strong> (1) <strong>Lakukan reject inference</strong> (augmentation) untuk estimasi bad rate populasi penuh — sajikan dua angka (terlihat vs terkoreksi) ke direksi. (2) <strong>Pisahkan metrik:</strong> "kualitas seleksi" (bad rate yang di-ACC) vs "kualitas model" (Gini/KS out-of-time + bad rate populasi). Jangan biarkan seleksi ketat menyamar sebagai model hebat.</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Apa itu selection bias dalam scorecard?"
        options={[
          "Data latih terlalu sedikit",
          "Data latih (yang di-ACC) adalah sampel tersaring — tidak mewakili populasi aplikan — sehingga model buta di bawah cut-off",
          "Model memilih variabel yang salah",
          "Bias analis yang subjektif",
        ]}
        correct={1}
        explanation="Benar: masalah keterwakilan, bukan ukuran. Model belajar dari 'para penyintas' seleksi — wilayah tolak tidak pernah diamati."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Bank berencana menurunkan cut-off 650 → 620 untuk ekspansi. Langkah wajib sebelumnya?"
        options={[
          "Langsung turunkan — model pasti bisa",
          "Reject inference (augmentation/parceling) untuk estimasi bad rate di band 620–649 — keputusan diambil di wilayah buta",
          "Naikkan bunga",
          "Tunggu 1 tahun",
        ]}
        correct={1}
        explanation="Benar: ekspansi = masuk wilayah buta. Tanpa reject inference, proyeksi NPL-nya tebakan. Inilah aturan emas lesson ini."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam augmentation, nasabah skor 605 (peluang ACC 55%) diberi bobot 1/0,55 ≈ 1,8. Mengapa?"
        options={[
          "Agar totalnya genap",
          "Ia 'mewakili' dirinya + sebagian yang ditolak di sekitarnya — makin dekat cut-off, makin besar bobotnya",
          "Supaya model lebih cepat",
          "Tidak ada alasan",
        ]}
        correct={1}
        explanation="Benar: inverse probability weighting. Yang hampir ditolak adalah 'duta' terbaik untuk wilayah tolak — bobot besar mengkompensasi yang tak teramati."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Metode mana yang memberi 'kebenaran' terbaik tentang yang ditolak?"
        options={[
          "Ignore — paling sederhana",
          "Parceling — asumsinya fleksibel",
          "Sampel acak di bawah cut-off (observasi langsung) — data nyata mengalahkan semua tebakan statistik",
          "Augmentation — rumusnya elegan",
        ]}
        correct={2}
        explanation="Benar: observasi langsung. Semua metode statistik pada dasarnya menebak yang tak teramati — hanya eksperimen terkontrol yang benar-benar mengamatinya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Bad rate terlihat turun 4 tahun berturut-turut, tapi cut-off dinaikkan 3× dan ekonomi memburuk. Kesimpulan?"
        options={[
          "Model hebat — pertahankan",
          "Ilusi seleksi — penurunan berasal dari penyaringan makin ketat, bukan model/debitur membaik; verifikasi dengan reject inference",
          "Ekonomi tidak berpengaruh",
          "Naikkan cut-off lagi",
        ]}
        correct={1}
        explanation="Benar: jangan biarkan seleksi ketat menyamar sebagai model hebat. Pisahkan 'kualitas seleksi' dari 'kualitas model' — dan estimasi populasi penuh."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Bank ingin ekspansi ke segmen UMKM informal (thin-file) yang belum pernah dilayani. Pendekatan reject inference yang paling tepat?"
        options={[
          "Langsung gaspol — model lama pasti bisa dipakai",
          "Program percontohan: ACC sampel acak dengan limit kecil, amati 12 bulan, latih model khusus segmen",
          "Tolak semua — terlalu berisiko",
          "Pakai model lama tanpa perubahan",
        ]}
        correct={1}
        explanation="Benar: pilot dengan limit kecil. Model lama buta total di populasi baru — satu-satunya obat adalah data dari populasi itu sendiri. 'Gaspol' tanpa pilot = eksperimen dengan uang nasabah; hasilnya terlihat 12–18 bulan kemudian sebagai NPL."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Direksi menolak eksperimen sampel acak (mahal). Alternatif reject inference yang murah?"
        options={[
          "Tidak ada — menyerah saja",
          "SLIK lookback: cek status 12–24 bulan kemudian dari aplikan yang ditolak — yang di-ACC bank lain terlacak perilakunya",
          "Tebak saja bad rate-nya",
          "Naikkan cut-off supaya tidak perlu",
        ]}
        correct={1}
        explanation="Benar: SLIK lookback. Nasabah yang kita tolak mungkin di-ACC bank lain — perilakunya tercatat di SLIK. Ini reject inference 'gratis' (terbatas pada yang terlacak) yang sering cukup untuk mengestimasi bias dan meyakinkan direksi."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Selection bias</strong>: model hanya belajar dari yang di-ACC — buta di bawah cut-off.</li>
          <li><strong>Reject inference</strong>: teknik mengestimasi nasib yang ditolak (parceling, augmentation, full model, sampel acak).</li>
          <li><strong>Augmentation</strong>: bobot = 1/P(ACC|skor) — yang hampir ditolak mewakili yang ditolak.</li>
          <li><strong>Aturan emas</strong>: mau ubah cut-off → reject inference dulu.</li>
          <li><strong>Data besar ≠ mewakili</strong>; <strong>bad rate turun bisa ilusi seleksi</strong>.</li>
          <li>Kapan TIDAK wajib: cut-off tetap permanen di wilayah yang sama — tapi dokumentasikan "utang" ini.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr7b-application-scorecard-2" className="btn btn-secondary btn-sm">← CR7b</Link>
        <Link href="/learn/cr9-behavioral-scorecard" className="btn btn-primary btn-sm">Next: CR9 →</Link>
      </div>
    </div>
  );
}
