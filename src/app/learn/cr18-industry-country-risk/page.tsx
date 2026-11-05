"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr18Page() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const industryData = [
    {
      x: ["Teknologi", "Kesehatan", "Konsumsi", "Manufaktur", "Properti", "Batubara", "Tekstil"],
      y: [1.2, 1.5, 2.0, 3.2, 5.5, 7.8, 8.5],
      type: "bar",
      marker: { color: ["#3aa655", "#3aa655", "#2a7de1", "#e8a838", "#ef9244", "#ef4444", "#8b1a1a"] },
      text: ["1,2%", "1,5%", "2%", "3,2%", "5,5%", "7,8%", "8,5%"],
      textposition: "outside",
    },
  ];

  const cycleData = [
    {
      x: ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      y: [120, 90, 70, 85, 110, 60, 180, 350, 280, 150, 130],
      type: "scatter",
      mode: "lines+markers",
      name: "Harga batubara (USD/ton, ilustrasi)",
      line: { color: "#2a7de1", width: 3 },
    },
  ];

  const countryData = [
    {
      x: ["Risiko transfer", "Risiko konversi", "Risiko sovereign", "Risiko makro lokal"],
      y: [25, 20, 30, 25],
      type: "bar",
      marker: { color: ["#ef4444", "#ef9244", "#8b1a1a", "#e8a838"] },
      text: ["25%", "20%", "30%", "25%"],
      textposition: "outside",
    },
  ];

  const lab1Code = `# Lab 1: Skor industri — dari lima faktor ke satu vonis
# Nilai tiap faktor 1 (buruk) - 5 (bagus), lalu bobot.
faktor = {
    "Siklus & volatilitas harga": {"skor": 2, "bobot": 0.25},
    "Kompetisi & hambatan masuk": {"skor": 2, "bobot": 0.20},
    "Regulasi & kebijakan":       {"skor": 3, "bobot": 0.20},
    "Tren permintaan":            {"skor": 2, "bobot": 0.20},
    "ESG / transisi energi":      {"skor": 1, "bobot": 0.15},
}
total = sum(f["skor"] * f["bobot"] for f in faktor.values())
print(f"{'Faktor':<28} {'Skor':>5} {'Bobot':>6}")
for nama, f in faktor.items():
    print(f"{nama:<28} {f['skor']:>5} {f['bobot']*100:>5.0f}%")
print(f"\nSkor industri BATUBARA = {total:.2f} / 5.0")
if total < 2.5: vonis = "BERISIKO TINGGI - batasi eksposur"
elif total < 3.5: vonis = "SEDANG - selektif"
else: vonis = "RENDAH - boleh ekspansi"
print("Vonis:", vonis)
print()
print("Coba: ubah 'ESG' jadi 4 (perusahaan pivot ke mineral kritis).")
print("Skor naik — tapi apakah pivotnya kredibel? Itulah penilaian kualitatif.")`;

  const lab2Code = `# Lab 2: Early warning korporasi — dashboard 5 lampu
# Setiap lampu: hijau/kuning/merah. 2+ merah = komite darurat.
def lampu(nama, nilai, ambang_kuning, ambang_merah, terbalik=False):
    # terbalik=True: makin KECIL makin bahaya (misal DSCR)
    if not terbalik:
        st = "HIJAU " if nilai < ambang_kuning else ("KUNING " if nilai < ambang_merah else "MERAH!!")
    else:
        st = "HIJAU " if nilai > ambang_kuning else ("KUNING " if nilai > ambang_merah else "MERAH!!")
    return nama, st, nilai

lampu_list = [
    lampu("DSCR", 1.15, 1.5, 1.2, terbalik=True),
    lampu("Harga komoditas vs BEP", 0.95, 1.2, 1.0, terbalik=True),  # rasio harga/BEP
    lampu("Konsentrasi pelanggan top-1", 55, 30, 50),  # %
    lampu("Rumor pasar / berita negatif", 1, 1, 2),   # jumlah/bulan
    lampu("Keterlambatan lapor keuangan", 45, 15, 30),  # hari
]
merah = 0
print(f"{'Indikator':<32} {'Nilai':>8} {'Status':>8}")
for nama, st, nilai in lampu_list:
    print(f"{nama:<32} {nilai:>8} {st:>8}")
    if "MERAH" in st: merah += 1
print(f"\nLampu merah: {merah}")
print("Keputusan:", "KOMITE DARURAT" if merah >= 2 else ("PANTAU KETAT" if merah == 1 else "NORMAL"))
print()
print("Coba: perbaiki DSCR jadi 1.6. Berapa lampu merah tersisa?")
print("EWS korporasi = gabungan ANGKA + KUALITATIF (berita, keterlambatan).")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR18 — Credit Risk Analyst</span>
        <h1 className="display-title">Industry &amp; Country Risk:<br />Risiko di Luar Perusahaan</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Perusahaan Sehat di Industri Sekarat</a></li>
          <li><a href="#industri">Industry Risk: Kolam Menentukan Ikan</a></li>
          <li><a href="#siklus">Siklus Komoditas: Roller Coaster Batubara</a></li>
          <li><a href="#negara">Country Risk: Batas Negara, Batas Risiko</a></li>
          <li><a href="#esg">ESG &amp; Iklim: Risiko Baru yang Nyata</a></li>
          <li><a href="#lab1">🔬 Lab 1: Skor Industri</a></li>
          <li><a href="#lab2">🔬 Lab 2: Dashboard Early Warning</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Batas Eksposur</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Tambang di Tengah Transisi Energi</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan 5 faktor industry risk dan memberi skor industri.</li>
          <li>Menganalisis dampak siklus komoditas terhadap PD debitur tambang.</li>
          <li>Membedakan 4 komponen country risk (transfer, konversi, sovereign, makro lokal).</li>
          <li>Merancang dashboard early warning korporasi (indikator angka + kualitatif).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: Perusahaan Sehat di Industri Sekarat</h2>
      <div className="story">
        <p>PT Tekstil Jaya: manajemen terbaik di kelasnya, DSCR 2,0×, D/E 1,2×, pelanggan tersebar. <strong>Di atas kertas: debitur idaman.</strong> Bank memberi Rp 100 miliar.</p>
        <p>Dua tahun kemudian: <strong>default</strong>. Bukan karena manajemennya — melainkan karena <strong>banjir impor tekstil murah</strong> menghantam <em>seluruh industri</em>. Harga jual jatuh 30%, semua pabrik merugi, termasuk yang terbaik sekalipun.</p>
        <p>Rina, yang merekomendasikan kredit itu, membela diri: <em>"Rasionya bagus!"</em> Kepala risikonya menjawab dingin: <em>"Ikan paling sehat pun mati kalau <strong>kolamnya beracun</strong>."</em></p>
        <p><strong>Twist-nya:</strong> analisis perusahaan (CR17) hanya separuh cerita. Separuh lainnya: <strong>industri dan negara</strong> tempat perusahaan berenang. Lesson ini tentang "kolamnya" — dan cara mengukurnya sebelum menceburkan uang.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="industri">Industry Risk: Kolam Menentukan Ikan</h2>
      <p><strong>Definisi.</strong> <strong>Industry risk</strong> = risiko yang melekat pada <strong>sektor usaha</strong>, terlepas dari kualitas perusahaan individual. Lima faktor penilaiannya:</p>
      <ol>
        <li><strong>Siklus &amp; volatilitas</strong> — seberapa liar naik-turunnya? (komoditas: liar; kesehatan: stabil).</li>
        <li><strong>Kompetisi &amp; hambatan masuk</strong> — mudah dimasuki pendatang baru? (tekstil: mudah; pelabuhan: sulit).</li>
        <li><strong>Regulasi &amp; kebijakan</strong> — diatur/dilindungi/dipajaki? (tambang: royalti &amp; larangan ekspor; fintech: POJK ketat).</li>
        <li><strong>Tren permintaan</strong> — tumbuh, stagnan, atau sekarat? (EV: tumbuh; batubara PLTU: menurun struktural).</li>
        <li><strong>ESG &amp; transisi</strong> — terancam transisi energi/iklim? (detail di bawah).</li>
      </ol>
      <p><strong>Kepribadian:</strong> industry risk seperti <strong>cuaca di kolam</strong> — nelayan terbaik pun tidak bisa memancing saat badai. Analis yang hanya menilai "nelayannya" (perusahaan) tanpa melihat "cuacanya" (industri) = setengah buta.</p>

      <PlotlyChart
        data={industryData}
        title="Default Rate Historis per Industri (ilustrasi Indonesia)"
        layout={{ xaxis: { title: "Industri" }, yaxis: { title: "Default rate (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = rata-rata default rate historis sektor itu.</p>
        <p><strong>Interpretasi:</strong> tekstil (8,5%) vs teknologi (1,2%) — <strong>beda 7× lipat</strong>! Artinya: debitur tekstil "terbaik" bisa lebih berisiko dari debitur teknologi "biasa". <strong>Implikasi pricing:</strong> bunga harus mencerminkan <em>risiko industri</em>, bukan cuma rasio perusahaan (CR21).</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> saat menilai debitur, tanyakan <strong>tiga lapis</strong>: (1) perusahaannya sehat? (CR17), (2) industrinya sehat? (lesson ini), (3) negaranya stabil? (di bawah). <strong>Kelemahan di lapis mana pun menular ke atas.</strong> Perusahaan hebat + industri sekarat = tetap berisiko.</p>
      </div>

      <h2 id="siklus">Siklus Komoditas: Roller Coaster Batubara</h2>
      <p>Indonesia = ekonomi komoditas. Batubara, sawit, nikel menentukan nasib ribuan debitur. Pola siklusnya:</p>

      <PlotlyChart
        data={cycleData}
        title="Harga Batubara 2015–2025: Roller Coaster (USD/ton, ilustrasi)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "USD/ton" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis = harga batubara per tahun. Perhatikan amplitudonya.</p>
        <p><strong>Interpretasi:</strong> dari 60 (2020) ke 350 (2022) lalu ke 130 (2025) — <strong>naik-turun 5× lipat dalam 5 tahun</strong>! Perusahaan tambang dengan BEP 100: tahun 2022 untung besar (bagi dividen jor-joran), tahun 2020 hampir mati. <strong>Pelajaran kredit:</strong> (1) uji DSCR pada <strong>harga konservatif</strong> (bukan harga puncak!); (2) waspadai <strong>perilaku boom</strong> — dividen besar &amp; ekspansi agresif di puncak = bom waktu; (3) covenant berbasis harga komoditas.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Harga komoditas sedang tinggi — saatnya ekspansi kredit tambang."</strong></p>
        <p><strong>Yang benar:</strong> harga puncak = <strong>waktu TERBURUK</strong> untuk ekspansi agresif (membeli di puncak siklus). Disiplin kredit komoditas: nilai kelayakan pada <strong>harga through-the-cycle</strong> (rata-rata jangka panjang), bukan harga spot. Bank yang ekspansi di 2022 (harga 350) menanggung default 2024–2025.</p>
      </div>

      <h2 id="negara">Country Risk: Batas Negara, Batas Risiko</h2>
      <p><strong>Definisi.</strong> <strong>Country risk</strong> = risiko akibat <strong>kondisi negara</strong> tempat debitur beroperasi (untuk kredit lintas batas atau debitur terpapar valuta asing). Empat komponen:</p>
      <ul>
        <li><strong>Risiko transfer</strong> — pemerintah membatasi aliran devisa keluar (debitur <em>mau</em> bayar, tapi <em>tidak bisa</em> kirim dolar).</li>
        <li><strong>Risiko konversi</strong> — depresiasi tajam mata uang lokal (utang dolar membengkak dalam rupiah).</li>
        <li><strong>Risiko sovereign</strong> — pemerintah gagal bayar / krisis politik.</li>
        <li><strong>Risiko makro lokal</strong> — resesi, inflasi, suku bunga negara tersebut.</li>
      </ul>
      <p><strong>Aturan praktis:</strong> rating debitur <strong>tidak boleh melampaui</strong> rating sovereign negaranya (<em>sovereign ceiling</em>) — kecuali ada mitigasi kuat (pendapatan ekspor dominan, jaminan luar negeri).</p>

      <PlotlyChart
        data={countryData}
        title="Komposisi Country Risk (ilustrasi pembobotan analis)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "Bobot (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tiap batang = bobot komponen dalam penilaian country risk.</p>
        <p><strong>Interpretasi:</strong> sovereign (30%) paling berat — jika negaranya gagal bayar, semua debitur ikut terseret. <strong>Untuk Indonesia:</strong> country risk domestik relatif moderat, tapi analis wajib memantau: defisit transaksi berjalan, cadangan devisa, dan stabilitas politik — karena ketiganya menentukan <em>ceiling</em> semua debitur.</p>
      </div>

      <h2 id="esg">ESG &amp; Iklim: Risiko Baru yang Nyata</h2>
      <p><strong>Definisi.</strong> <strong>ESG risk</strong> = risiko dari faktor <strong>lingkungan</strong> (iklim, polusi), <strong>sosial</strong> (tenaga kerja, komunitas), dan <strong>tata kelola</strong>. Dua jalur ke risiko kredit:</p>
      <ul>
        <li><strong>Risiko fisik</strong> — banjir, kebakaran hutan, kekeringan merusak aset/operasional debitur (perkebunan, properti pantai).</li>
        <li><strong>Risiko transisi</strong> — kebijakan iklim (pajak karbon, larangan PLTU batubara) membuat aset <strong>terlantar</strong> (<em>stranded assets</em>): tambang batubara yang tidak bisa ditambang lagi.</li>
      </ul>
      <p><strong>Status 2026:</strong> OJK dan bank global mulai mewajibkan <strong>pelaporan &amp; stress test iklim</strong>. Analis kredit perlu: (1) petakan eksposur ke sektor berisiko transisi; (2) tanyakan rencana transisi debitur; (3) pertimbangkan dalam tenor panjang (KPR 20 tahun &gt; risiko fisik!).</p>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> ESG bukan "kosmetik laporan tahunan" — ia adalah <strong>risiko kredit dengan horizon panjang</strong>. Kredit 15 tahun ke PLTU batubara = bertaruh melawan transisi energi global. Analis yang mengabaikan ESG untuk tenor panjang seperti membangun rumah di garis pantai tanpa melihat peta tsunami.</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Tiga Lapis Pertanyaan</h3>
      <p>Analis amatir bertanya satu lapis: "perusahaannya sehat?" Analis profesional bertanya <strong>tiga lapis</strong>: (1) perusahaannya sehat? (CR17), (2) <strong>industrinya</strong> sehat? (lesson ini), (3) <strong>negaranya</strong> sehat? (lesson ini). Debitur terbaik di industri sekarat = ikan terbaik di kolam beracun — ia bertahan lebih lama, tetapi tetap keracunan. Kasus tekstil Indonesia: perusahaan dengan manajemen bagus pun tumbang saat industri digempur produk impor murah. <strong>Analisis individual tanpa konteks industri = memotret tanpa latar.</strong></p>
      <p>Intuisi kedua: <strong>harga puncak = waktu terburuk ekspansi</strong>. Ini melawan insting: saat harga batubara 350 (2022), semua tambang untung, semua proposal terlihat bagus, semua analis tergoda. Tetapi harga puncak berarti <strong>ekspektasi sudah maksimal</strong> — satu-satunya arah adalah turun. Disiplin kredit komoditas: nilai proyek dengan <strong>harga jangka panjang konservatif</strong> (misal rata-rata 5 tahun, bukan harga spot), dan waspadai vintage yang dicairkan di puncak siklus (CR6!). Bank yang ekspansi tambang agresif di 2022 menuai NPL-nya di 2024–2025.</p>
      <p>Intuisi ketiga tentang sovereign ceiling: <strong>rating debitur ≤ rating sovereign</strong> (kecuali mitigasi kuat). Logikanya: jika negaranya gagal bayar / krisis, hampir semua debitur ikut terseret — tidak ada perusahaan yang sepenuhnya kebal dari negaranya. Untuk Indonesia (investment grade), ceiling ini jarang mengikat; tetapi untuk kredit ke negara berperingkat rendah, ia menjadi <strong>batas keras</strong> yang menentukan pricing dan limit.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Skor Industri</h2>
      <p>Lima faktor, satu vonis. Nilai industri batubara — lalu tantang asumsimu.</p>
      <PyodideLab
        title="Lab 1 — Kalkulator Skor Industri"
        hint="Coba: (1) ubah semua jadi 4 — vonis apa? (2) Bandingkan batubara vs 'teknologi' (semua 4-5). Selisih skor = selisih 'harga' risiko industri (lihat chart default rate)."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Dashboard Early Warning Korporasi</h2>
      <p>Lima lampu: angka + kualitatif. Berapa merah = darurat?</p>
      <PyodideLab
        title="Lab 2 — EWS Korporasi 5 Lampu"
        hint="Coba perbaiki satu per satu dan lihat kapan status berubah. Diskusikan: indikator KUALITATIF (berita, keterlambatan laporan) sering menyala DULUAN dibanding angka — mengapa? (Jawaban: angka = akibat, perilaku = sebab.)"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Batas Eksposur</h2>

      <div className="decision-card">
        <h3>1. Industri skor &lt;2,5 (berisiko tinggi) → <strong>batasi eksposur + pricing premium</strong></h3>
        <p><strong>Kondisi:</strong> batubara, tekstil di masa sulit.</p>
        <p><strong>Aksi:</strong> limit sektor (% portofolio), bunga +2–3%, tenor pendek, covenant harga komoditas. Bukan larangan total — tapi "harga" yang jujur.</p>
      </div>

      <div className="decision-card">
        <h3>2. Harga komoditas di puncak → <strong>uji pada harga through-the-cycle</strong></h3>
        <p><strong>Kondisi:</strong> boom komoditas.</p>
        <p><strong>Aksi:</strong> DSCR dihitung pada harga konservatif (rata-rata 5 tahun), bukan spot. Tolak ekspansi yang hanya layak di harga puncak.</p>
      </div>

      <div className="decision-card">
        <h3>3. Debitur lintas negara / berutang valas → <strong>analisis country risk + lindung nilai</strong></h3>
        <p><strong>Kondisi:</strong> pendapatan rupiah, utang dolar.</p>
        <p><strong>Aksi:</strong> wajib hedging (atau buktikan natural hedge dari ekspor); rating ≤ sovereign ceiling.</p>
      </div>

      <div className="decision-card">
        <h3>4. Tenor &gt;10 tahun ke sektor transisi → <strong>pertimbangkan risiko iklim</strong></h3>
        <p><strong>Kondisi:</strong> PLTU batubara, properti pantai.</p>
        <p><strong>Aksi:</strong> tanyakan rencana transisi debitur; stress test skenario kebijakan iklim; pertimbangkan tenor lebih pendek.</p>
      </div>

            <div className="decision-card">
        <h3>5. Proposal smelter nikel Rp 500 M, DSCR 2× di harga kini, di kawasan industri klaster → <strong>setujui dengan uji skenario ganda</strong></h3>
        <p><strong>Kondisi:</strong> smelter di klaster Morowali: DSCR 2× pada harga nikel kini, teknologi bagus, offtaker jelas. Tetapi: 80% smelter sejenis berada di 2 klaster yang sama (risiko klaster), dan harga nikel turun 30% dari puncak.</p>
        <p><strong>Aksi:</strong> uji <strong>tiga skenario</strong>: (1) harga −30% (DSCR?); (2) gangguan pasokan listrik klaster 3 bulan (risiko konsentrasi geografis — satu pemadaman = semua berhenti); (3) perubahan kebijakan ekspor/hilirisasi. Setujui hanya jika DSCR &gt;1,3× di <strong>semua</strong> skenario + covenant: DSCR min 1,3× diuji semesteran, larangan ekspansi kapasitas tanpa persetujuan (mencegah overbuild klaster), dan asuransi gangguan usaha. <strong>Risiko klaster</strong> = risiko yang tidak terlihat di analisis satu perusahaan — ia baru muncul saat dilihat dari ketinggian portofolio.</p>
        <p><strong>Contoh nyata:</strong> klaster industri yang tumbuh terlalu cepat (smelter, tekstil di masa lalu) selalu berakhir dengan overcapacity → perang harga → margin anjlok → NPL klaster. Analis yang melihat klaster, bukan sekadar perusahaan, menghindari jebakan ini.</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>Tiga lapis:</strong> perusahaan → industri → negara. Lemah satu = risiko.</li>
          <li><strong>Uji di harga through-the-cycle</strong> — bukan puncak.</li>
          <li><strong>Sovereign ceiling:</strong> debitur ≤ negaranya.</li>
          <li><strong>EWS = angka + kualitatif.</strong> Berita menyala duluan.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Analisis Industri: 9 Lensa Sektor</h3>
      <p>Sebelum menilai perusahaan, nilai kolamnya. Sembilan lensa ini = analisis industri lengkap dalam 2 jam.</p>
      <ol>
        <li><strong>Siklus &amp; posisi kini</strong> — Di mana dalam siklus? Puncak (waspada!), lembah (peluang), tengah? Harga puncak = waktu terburuk ekspansi.</li>
        <li><strong>Struktur kompetisi</strong> — Kompetitif sempurna (margin tipis selamanya) vs oligopoli (margin terjaga)? Hambatan masuk tinggi = baik untuk incumbent.</li>
        <li><strong>Kekuatan pembeli &amp; pemasok</strong> — Pelanggan terkonsentrasi (2 buyer = 80% penjualan) = risiko. Pemasok tunggal = risiko. Rantai yang rapuh = DSCR yang rapuh.</li>
        <li><strong>Ancaman substitusi/teknologi</strong> — EV vs BBM, digital vs konvensional — disrupsi membunuh industri dalam 5–10 tahun. Apakah debiturmu di sisi yang benar?</li>
        <li><strong>Regulasi &amp; kebijakan</strong> — Royalti, DMO, larangan ekspor, tarif — peta regulasi 3 tahun ke depan. Regulasi berubah = DSCR berubah.</li>
        <li><strong>Tren permintaan struktural</strong> — Tumbuh (EV, kesehatan), stagnan, atau sekarat (batubara PLTU, tekstil)? Jangan biayai industri sekarat kecuali operator terbaik + harga murah.</li>
        <li><strong>ESG &amp; transisi</strong> — Risiko fisik (banjir, karhutla) + risiko transisi (karbon). Aset stranded = agunan yang menguap.</li>
        <li><strong>Konsentrasi geografis klaster</strong> — 80% industri di 2 klaster = risiko klaster (pemadaman, overcapacity). Lihat dari ketinggian portofolio.</li>
        <li><strong>Default rate historis sektor</strong> — Tekstil 8,5% vs teknologi 1,2% — angka ini = 'pajak' industri yang harus di-pricing. Jangan samakan harga untuk kolam berbeda.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> sembilan lensa, 2 jam, 1 halaman ringkasan per sektor. Update tahunan — industri bergerak, analis harus ikut.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia adalah ekonomi komoditas — industry risk di sini bukan teori, melainkan <strong>mata pencaharian ribuan debitur</strong>.</p>

      <h3>Batubara: Roller Coaster 60 → 350 → 130</h3>
      <p>Harga batubara acuan: ~US$60/ton (2020) → ~US$350 (2022, krisis energi global) → ~US$130 (2025). <strong>Naik-turun 5× dalam 5 tahun.</strong> Dampaknya ke kredit:</p>
      <ul>
        <li><strong>2022 (puncak):</strong> semua tambang untung besar, proposal kredit membanjir, analis tergoda. Bank yang disiplin memakai harga konservatif untuk DSCR; yang tidak — memakai harga spot 350 untuk proyeksi 10 tahun.</li>
        <li><strong>2024–2025 (turun):</strong> tambang biaya tinggi ( stripping ratio jelek, jauh dari pelabuhan) mulai merugi. Kredit yang dicairkan di puncak dengan asumsi harga 350 = <strong>vintage beracun</strong>.</li>
        <li><strong>Larangan ekspor &amp; DMO:</strong> kebijakan pemerintah (larangan ekspor sementara, kewajiban pasok domestik/DMO dengan harga khusus) menambah <strong>risiko regulasi</strong> — analis tambang wajib memodelkan skenario kebijakan, bukan hanya harga.</li>
      </ul>

      <h3>Sawit (CPO) &amp; Nikel: Dua Wajah Komoditas</h3>
      <ul>
        <li><strong>Sawit:</strong> harga volatil + <strong>risiko ESG</strong> (deforestasi, sertifikasi ISPO/RSPO) + kebijakan (pungutan ekspor, biodiesel B35/B40 yang menyerap pasokan domestik). Analisis kredit sawit = analisis harga + regulasi + ESG sekaligus.</li>
        <li><strong>Nikel:</strong> larangan ekspor ore (2020) memaksa hilirisasi — smelter tumbuh pesat didanai kredit jumbo. Risikonya: <strong>kelebihan pasokan global</strong> menekan harga + ketergantungan pada satu pasar ekspor. Konsentrasi geografis (Morowali, Weda Bay) = <strong>risiko klaster</strong>.</li>
      </ul>

      <h3>Tekstil: Industri yang Sekarat Pelan-pelan</h3>
      <p>Tekstil Indonesia (Sritex cs.) menghadapi <strong>structural decline</strong>: gempuran produk impor murah, biaya energi/tenaga kerja naik, otomasi tertinggal. Default rate historis tekstil ~8,5% vs teknologi 1,2% — <strong>beda 7× lipat</strong>. Pelajaran: debitur tekstil "terbaik" bisa lebih berisiko dari debitur teknologi "rata-rata". <strong>Industry adjustment</strong> dalam rating internal (CR17b: bobot 15%) ada untuk ini — jangan nilai ikan tanpa melihat kolamnya.</p>

      <h3>Risiko Iklim Fisik: Banjir &amp; Karhutla</h3>
      <p>Indonesia rawan <strong>risiko fisik iklim</strong>: banjir (Jakarta, Semarang — mengancam agunan properti &amp; operasional debitur), kebakaran hutan/lahan (Sumatera, Kalimantan — mengancam perkebunan, memicu denda/larangan), kekeringan (mengancam pertanian &amp; PLTA). Analis modern memetakan <strong>eksposur geografis</strong> portofolio terhadap risiko fisik — dan OJK mulai memperhatikan pengungkapan risiko iklim perbankan. Ini bukan "ESG kosmetik" — melainkan <strong>LGD yang menunggu terjadi</strong> (agunan kebanjiran = nilai jatuh).</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: DSCR tambang di tiga harga (klik untuk buka)</summary>
        <p>Tambang batubara: produksi 1 jt ton/tahun, cash cost US$80/ton, utang US$100 jt, cicilan+bunga US$15 jt/tahun.</p>
        <p><strong>Harga US$350 (puncak 2022):</strong> margin 270/ton → kas US$270 jt → DSCR = 270/15 = <strong>18×</strong> (terlihat gila bagusnya!).<br />
        <strong>Harga US$130 (2025):</strong> margin 50/ton → kas US$50 jt → DSCR = 50/15 = <strong>3,3×</strong> (masih OK).<br />
        <strong>Harga US$90 (stres):</strong> margin 10/ton → kas US$10 jt → DSCR = 10/15 = <strong>0,67×</strong> (gagal bayar!).</p>
        <p><strong>Pelajaran:</strong> di harga puncak, <strong>semua tambang terlihat layak</strong> — bahkan yang biaya produksinya buruk. Disiplin: uji dengan harga <strong>konservatif jangka panjang</strong> (misal US$90–100), bukan spot. Kredit yang lolos di US$90 = kredit yang selamat; yang hanya lolos di US$350 = bom waktu.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Harga komoditas sedang tinggi — saatnya ekspansi kredit ke sektor itu."</strong></p>
        <p><strong>Yang benar:</strong> harga puncak = waktu <strong>terburuk</strong> untuk ekspansi agresif (membeli di puncak siklus). Yang benar: ekspansi saat harga rendah ke operator biaya rendah (membeli di lembah), dengan DSCR diuji di harga stres. <strong>Berani saat takut, takut saat berani</strong> — itulah disiplin kredit komoditas.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Tambang di Tengah Transisi Energi</h2>
      <div className="callout">
        <p>PT Batu Bara Sejahtera mengajukan <strong>kredit investasi Rp 300 M</strong> tenor 10 tahun untuk tambang baru. Data:</p>
        <ul>
          <li>DSCR (harga spot 130) = 2,2×; DSCR (harga TTC 90) = <strong>1,15×</strong>.</li>
          <li>BEP 85 USD/ton; cadangan 15 tahun; manajemen berpengalaman.</li>
          <li>Harga spot 130, tapi tren 3 tahun <strong>menurun</strong> (350 → 130).</li>
          <li>Pemerintah: <strong>pajak karbon</strong> diwacanakan 2028; beberapa negara tujuan ekspor mengumumkan <strong>phase-out batubara 2035</strong>.</li>
        </ul>
        <p><strong>Pertanyaan:</strong> putuskan dengan 3 argumen + struktur mitigasi jika ACC.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Keputusan: TOLAK tenor 10 tahun; pertimbangkan maksimal 5 tahun dengan mitigasi berat — atau tolak total.</strong></p>
          <p>(1) <strong>DSCR TTC 1,15×</strong> — di bawah ambang aman 1,25×; hanya layak di harga spot yang sedang <em>menurun</em>.<br />
          (2) <strong>Risiko transisi:</strong> tenor 10 tahun melewati phase-out 2035 + pajak karbon 2028 — aset berisiko <em>stranded</em> sebelum lunas.<br />
          (3) <strong>Siklus:</strong> ekspansi di tren turun = membeli di "puncak yang lewat".</p>
          <p><strong>Jika direksi memaksa ACC:</strong> tenor 5 tahun + DSCR covenant pada harga 90 + <em>cash sweep</em> (kelebihan kas saat harga tinggi untuk percepat pelunasan) + pricing +2%. Pelajaran: <strong>analisis industri yang jujur kadang berarti menolak uang</strong> — dan itulah pekerjaan analis.</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: Ekspansi di Puncak — Jebakan 2022</h2>
      <div className="callout">
        <p>Tahun 2022, harga batubara US$350/ton. PT Tambang Jaya mengajukan kredit investasi Rp 200 M untuk ekspansi. Data:</p>
        <ul>
          <li>Cash cost US$110/ton (termasuk tinggi — tambang dalam, jauh dari pelabuhan).</li>
          <li>Produksi 500 ribu ton/tahun. Cicilan+bunga: US$12 jt/tahun.</li>
          <li>DSCR di harga kini (350): (350−110)×0,5 jt / 12 jt = <strong>10×</strong> — "sangat layak!"</li>
          <li>Tren harga 5 tahun: 60 → 120 → 350 (lonjakan 1 tahun terakhir).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> sebagai analis, apa vonismu? Hitung DSCR di harga konservatif dan jelaskan mengapa "DSCR 10×" justru mencurigakan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>DSCR di harga konservatif (US$100, rata-rata jangka panjang):</strong> (100−110)×0,5 jt = <strong>negatif</strong> — perusahaan <strong>rugi kas</strong> di harga normal! DSCR tidak terdefinisi (di bawah 1×, bahkan negatif).</p>
          <p><strong>Vonis: TOLAK.</strong> "DSCR 10×" mencurigakan karena: (1) cash cost US$110/ton = <strong>operator biaya tinggi</strong> — ia hanya hidup di harga puncak; (2) seluruh kelayakan bergantung pada harga yang <strong>naik 3× dalam setahun</strong> — bukan fundamental; (3) di harga normal ia rugi — artinya kredit ini adalah <strong>taruhan harga komoditas</strong>, bukan kredit investasi.</p>
          <p><strong>Aturan disiplin:</strong> untuk komoditas, DSCR diuji di <strong>harga stres</strong> (misal persentil 25 historis 10 tahun). Lolos di sana = layak; hanya lolos di puncak = tolak. "Berani saat takut, takut saat berani."</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Debitur tekstil terbaik (DSCR 2,0) vs debitur teknologi biasa (DSCR 1,5). Mana berisiko lebih tinggi?"
        options={[
          "Teknologi — DSCR lebih rendah",
          "Tekstil — default rate industrinya 7× lipat; 'kolam beracun' mengalahkan 'ikan sehat'",
          "Sama saja",
          "Tidak bisa dibandingkan",
        ]}
        correct={1}
        explanation="Benar: industry risk bisa mendominasi. Perusahaan terbaik di industri sekarat tetap berisiko — inilah 'tiga lapis' analisis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Harga batubara di puncak (350). Kapan waktu tepat ekspansi kredit tambang?"
        options={[
          "Sekarang — harga bagus",
          "Tidak sekarang — uji kelayakan pada harga through-the-cycle (90); ekspansi di puncak = membeli di puncak siklus",
          "Tunggu harga 500",
          "Selalu tepat",
        ]}
        correct={1}
        explanation="Benar: disiplin through-the-cycle. Bank yang ekspansi di puncak menanggung default di lembah — pola klasik kredit komoditas."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Perusahaan Indonesia berpendapatan rupiah, berutang dolar AS. Risiko utamanya?"
        options={[
          "Tidak ada — dolar stabil",
          "Risiko konversi: depresiasi rupiah membengkakkan utang dalam rupiah; butuh hedging atau natural hedge",
          "Risiko transfer saja",
          "Hanya risiko suku bunga",
        ]}
        correct={1}
        explanation="Benar: mismatch mata uang. Tanpa hedge, depresiasi 20% = cicilan naik 20% dalam rupiah — DSCR jebol."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Apa itu 'sovereign ceiling'?"
        options={[
          "Batas utang pemerintah",
          "Rating debitur umumnya tidak boleh melampaui rating sovereign negaranya — kecuali ada mitigasi kuat",
          "Plafon kredit bank",
          "Batas BMPK",
        ]}
        correct={1}
        explanation="Benar: negara yang gagal bayar menyeret semua. Pengecualian: eksportir dominan, jaminan luar negeri — dengan justifikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Kredit 15 tahun ke PLTU batubara. Risiko ESG yang paling relevan?"
        options={[
          "Tidak ada — ESG hanya kosmetik",
          "Risiko transisi: pajak karbon & phase-out batubara bisa membuat aset stranded sebelum kredit lunas",
          "Hanya risiko fisik banjir",
          "ESG tidak mempengaruhi kredit",
        ]}
        correct={1}
        explanation="Benar: risiko transisi. Tenor panjang = terpapar kebijakan iklim masa depan. Analis tenor panjang wajib memasukkan ini."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Tambang cash cost US$110/ton mengajukan ekspansi saat harga US$350 (DSCR 10×). Di harga normal US$100 ia rugi kas. Vonis?"
        options={[
          "Setujui — DSCR 10× sangat layak",
          "Tolak — ini taruhan harga komoditas, bukan kredit investasi; uji DSCR di harga stres, bukan puncak",
          "Setujui dengan tenor pendek",
          "Minta agunan tambahan lalu setujui",
        ]}
        correct={1}
        explanation="Benar: tolak. DSCR di puncak menipu — operator biaya tinggi hanya hidup saat harga abnormal. Disiplin kredit komoditas: uji di harga konservatif jangka panjang. Lolos di sana = layak."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Mengapa analis harus menilai 'klaster' (misal 80% smelter di 2 kawasan) di luar analisis satu perusahaan?"
        options={[
          "Tidak perlu — perusahaan dinilai individual",
          "Risiko klaster (pemadaman, overcapacity, perang harga) tidak terlihat di satu perusahaan — baru muncul dari ketinggian portofolio; korelasinya tinggi",
          "Klaster selalu aman",
          "Hanya untuk memenuhi OJK",
        ]}
        correct={1}
        explanation="Benar: risiko klaster = korelasi tersembunyi. Satu pemadaman listrik menghentikan semua; overbuild klaster → perang harga → margin anjlok bersamaan. Analisis individual buta terhadap ini."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Industry risk</strong>: 5 faktor (siklus, kompetisi, regulasi, tren, ESG) — "kolam menentukan ikan".</li>
          <li><strong>Komoditas</strong>: uji pada harga through-the-cycle, bukan puncak; waspadai perilaku boom.</li>
          <li><strong>Country risk</strong>: transfer, konversi, sovereign, makro lokal. Sovereign ceiling.</li>
          <li><strong>ESG</strong>: risiko fisik + transisi — material untuk tenor panjang.</li>
          <li><strong>EWS korporasi</strong>: angka + kualitatif (berita, keterlambatan laporan menyala duluan).</li>
          <li>Kapan TIDAK terlalu khawatir industri: debitur dengan diversifikasi usaha/wilayah kuat — tapi verifikasi, jangan asumsi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr17b-corporate-credit-2" className="btn btn-secondary btn-sm">← CR17b</Link>
        <Link href="/learn/cr19-validasi-model" className="btn btn-primary btn-sm">Next: CR19 →</Link>
      </div>
    </div>
  );
}
