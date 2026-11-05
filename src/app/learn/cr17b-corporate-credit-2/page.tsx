"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Cr17bPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(7);
  const cashWaterfallData = [
    {
      x: ["EBITDA", "Pajak", "Modal kerja", "Capex", "Kas bebas", "Bunga", "Cicilan", "Sisa"],
      y: [162, -30, -70, -80, -18, -60, -40, -118],
      type: "bar",
      marker: { color: ["#2a7de1", "#ef9244", "#ef9244", "#ef9244", "#e8a838", "#ef4444", "#ef4444", "#8b1a1a"] },
      text: ["162", "−30", "−70", "−80", "−18", "−60", "−40", "−118"],
      textposition: "outside",
    },
  ];

  const ratingMapData = [
    {
      x: ["Kuantitatif (40%)", "Kualitatif (35%)", "Industri (15%)", "Negara (10%)"],
      y: [40, 35, 15, 10],
      type: "bar",
      marker: { color: ["#2a7de1", "#e8a838", "#3aa655", "#94a3b8"] },
      text: ["40%", "35%", "15%", "10%"],
      textposition: "outside",
    },
  ];

  const covenantData = [
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [2.8, 2.4, 1.9, 1.4, 1.05],
      type: "scatter",
      mode: "lines+markers",
      name: "DSCR aktual",
      line: { color: "#ef4444", width: 3 },
    },
    {
      x: ["2021", "2022", "2023", "2024", "2025"],
      y: [1.3, 1.3, 1.3, 1.3, 1.3],
      type: "scatter",
      mode: "lines",
      name: "Covenant min 1,3×",
      line: { color: "#2a7de1", width: 2, dash: "dash" },
    },
  ];

  const lab1Code = `# Lab 1: Air terjun kas — dari EBITDA ke "sisa untuk bank"
# PT Maju Jaya (Rp M). Ikuti alirannya sampai ke kewajiban utang.
ebitda = 162
pajak = 30
modal_kerja = 70   # piutang & persediaan membengkak = kas keluar!
capex = 80         # belanja modal ekspansi
bunga = 60
cicilan = 40

kas_operasi = ebitda - pajak - modal_kerja
kas_bebas = kas_operasi - capex
sisa_setelah_utang = kas_bebas - bunga - cicilan

print(f"EBITDA                    : Rp {ebitda} M")
print(f"- Pajak                   : Rp {pajak} M")
print(f"- Kenaikan modal kerja    : Rp {modal_kerja} M  <- laba terjebak!")
print(f"= Kas operasi             : Rp {kas_operasi} M")
print(f"- Capex                   : Rp {capex} M")
print(f"= Kas bebas (FCF)         : Rp {kas_bebas} M")
print(f"- Bunga + cicilan         : Rp {bunga+cicilan} M")
print(f"= SISA                    : Rp {sisa_setelah_utang} M  {'DEFISIT!' if sisa_setelah_utang<0 else 'surplus'}")
print()
print("Coba: set modal_kerja = 20 (manajemen rapi). Sisa jadi?")
print("Pelajaran: EBITDA 162 terlihat gagah — tapi setelah 'pajak air'")
print("(modal kerja + capex), yang tersisa untuk bank = negatif.")
print("Inilah mengapa analis memakai FCF, bukan EBITDA, untuk DSCR ketat.")`;

  const lab2Code = `# Lab 2: Covenant tester — kapan pelanggaran terjadi?
# Covenant: DSCR min 1,3x, diuji tiap kuartal. Simulasi skenario.
def cek_covenant(ebitda, bunga, cicilan, batas=1.3):
    dscr = ebitda / (bunga + cicilan)
    return dscr, dscr >= batas

skenario = [
    ("Baseline", 162),
    ("Penjualan -10%", 140),
    ("Penjualan -20%", 118),
    ("Bunga naik 3%", 162),  # bunga 60->78
]
bunga, cicilan = 60, 40
print(f"{'Skenario':<16} {'EBITDA':>7} {'DSCR':>6} {'Covenant':>10}")
for nama, ebit in skenario:
    b = 78 if "Bunga" in nama else bunga
    dscr, lolos = cek_covenant(ebit, b, cicilan)
    print(f"{nama:<16} {ebit:>7} {dscr:>6.2f} {'LOLOS' if lolos else 'LANGGAR!':>10}")
print()
print("Coba: turunkan batas jadi 1.1 (covenant longgar).")
print("Semua lolos — tapi apakah bank lebih aman? TIDAK: covenant")
print("longgar = alarm yang dimatikan. Ketat tapi realistis = ideal.")`;

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      {/* 1. COVER */}
      <div className="lesson-cover">
        <span className="eyebrow">CR17b — Credit Risk Analyst • Corporate Part 2</span>
        <h1 className="display-title">Kredit Korporasi Part 2:<br />Cash Flow, Covenant &amp; Memo Kredit</h1>
        <div className="meta">45–60 menit &bull; 2 lab interaktif &bull; 7 quiz &bull; 1 mini-case</div>
      </div>

      {/* 2. TOC */}
      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: EBITDA Rp 162 M yang Tidak Bisa Bayar Rp 100 M</a></li>
          <li><a href="#cashflow">Air Terjun Kas: Dari EBITDA ke Sisa</a></li>
          <li><a href="#covenant">Covenant: Sabuk Pengaman Kontrak</a></li>
          <li><a href="#rating">Rating Internal: Menilai yang Tak Terukur</a></li>
          <li><a href="#memo">Memo Kredit: Senjata Analis</a></li>
          <li><a href="#lab1">🔬 Lab 1: Air Terjun Kas</a></li>
          <li><a href="#lab2">🔬 Lab 2: Covenant Tester</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan: Struktur Kredit Korporasi</a></li>
          <li><a href="#realita">🏛️ Regulasi & Realita Indonesia</a></li>
          <li><a href="#case">📋 Mini-Case: Menulis Rekomendasi</a></li>
          <li><a href="#quiz">✏️ Quiz (7 soal)</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      {/* 3. TUJUAN */}
      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyusun air terjun kas: EBITDA → kas operasi → free cash flow → sisa untuk kewajiban utang.</li>
          <li>Menjelaskan 3 jenis covenant (affirmative, negative, financial) dan merancang covenant yang efektif.</li>
          <li>Menjelaskan komponen rating internal: kuantitatif + kualitatif + industri + negara.</li>
          <li>Menulis struktur memo kredit yang meyakinkan komite (rekomendasi + risiko + mitigasi).</li>
        </ul>
      </div>

      {/* 4. CERITA */}
      <h2 id="cerita">Cerita Pembuka: EBITDA Rp 162 M yang Tidak Bisa Bayar Rp 100 M</h2>
      <div className="story">
        <p>Rina menatap angka itu lama: <strong>EBITDA Rp 162 miliar</strong>. Kewajiban utang tahun ini: <strong>Rp 100 miliar</strong>. DSCR 1,62× — "aman", kata kalkulator.</p>
        <p>Tapi ia sudah belajar dari Part 1: EBITDA bukan kas. Ia susun air terjunnya: pajak Rp 30 M... modal kerja <strong>menyedot Rp 70 M</strong> (piutang tak tertagih)... capex Rp 80 M (pabrik setengah jadi)...</p>
        <p>Sisa untuk membayar utang Rp 100 M: <strong>minus Rp 18 miliar</strong>. Perusahaan dengan EBITDA 162 M <strong>tidak punya uang</strong> untuk membayar utangnya.</p>
        <p><strong>Twist-nya:</strong> DSCR berbasis EBITDA menipu — yang membayar utang adalah <strong>kas bebas</strong>, bukan EBITDA. Part 2 ini turun ke level yang lebih dalam: air terjun kas, lalu ke "senjata" analis korporasi: <strong>covenant</strong>, <strong>rating internal</strong>, dan <strong>memo kredit</strong>.</p>
      </div>

      {/* 5. KONSEP INTI */}
      <h2 id="cashflow">Air Terjun Kas: Dari EBITDA ke Sisa</h2>
      <p><strong>Definisi.</strong> <strong>Air terjun kas</strong> (<em>cash waterfall</em>) = urutan alokasi kas: tiap tingkat "mengambil" bagiannya, sisa mengalir ke bawah. Urutan baku:</p>
      <ol>
        <li><strong>EBITDA</strong> — titik awal (proksi kas kotor).</li>
        <li>− Pajak → <strong>− Δ modal kerja</strong> (piutang/persediaan naik = kas keluar!) → = <strong>Kas operasi</strong>.</li>
        <li>− Capex → = <strong>Free Cash Flow (FCF)</strong> — kas yang benar-benar bebas.</li>
        <li>− Bunga − cicilan pokok → = <strong>Sisa</strong> (untuk dividen/ekspansi/cadangan).</li>
      </ol>
      <p><strong>DSCR yang jujur</strong> memakai FCF (bukan EBITDA) untuk debitur dengan modal kerja/capex besar:</p>
      <Tex math={String.raw`\text{DSCR}_{\text{ketat}} = \frac{\text{Free Cash Flow}}{\text{Cicilan Pokok} + \text{Bunga}}`} block />

      <PlotlyChart
        data={cashWaterfallData}
        title="Air Terjun Kas PT Maju Jaya (Rp Miliar)"
        layout={{ xaxis: { title: "" }, yaxis: { title: "Rp Miliar" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> mulai dari EBITDA (biru), kurangi tiap "pajak air" (oranye/merah), lihat sisa akhir.</p>
        <p><strong>Interpretasi:</strong> EBITDA 162 → sisa <strong>−118</strong>?? Tunggu — ini versi <em>super ketat</em> (capex penuh + modal kerja penuh). Pelajaran: <strong>definisi DSCR menentukan vonis</strong>. DSCR EBITDA = 1,62 (lolos); DSCR FCF = negatif (mati). Analis senior memakai <strong>keduanya</strong> dan menjelaskan bedanya — bukan memilih yang enak.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> tanyakan selalu: <strong>"EBITDA ini jadi kas berapa?"</strong> Tiga pencuri terbesar: (1) <strong>modal kerja</strong> (tumbuh = kas tersedot), (2) <strong>capex pemeliharaan</strong> (pabrik tua = capex wajib), (3) <strong>pajak</strong>. Perusahaan "menguntungkan" yang kasnya habis untuk ketiganya = tidak bisa bayar utang <em>hari ini</em>, apapun labanya.</p>
      </div>

      <h2 id="covenant">Covenant: Sabuk Pengaman Kontrak</h2>
      <p><strong>Definisi.</strong> <strong>Covenant</strong> = janji debitur dalam perjanjian kredit. Tiga jenis:</p>
      <ul>
        <li><strong>Affirmative</strong> (harus dilakukan): laporan keuangan kuartalan, asuransi aset, bayar pajak.</li>
        <li><strong>Negative</strong> (dilarang): tidak boleh tambah utang melebihi X, tidak boleh jual aset inti, tidak boleh bagi dividen jika DSCR &lt; Y.</li>
        <li><strong>Financial</strong> (angka): DSCR min 1,3×; D/E maks 2,5×; current ratio min 1,2× — diuji tiap kuartal.</li>
      </ul>
      <p><strong>Kepribadian:</strong> covenant seperti <strong>sensor sabuk pengaman mobil</strong> — tidak mencegah kecelakaan, tapi <strong>berbunyi SEBELUM</strong> tabrakan (pelanggaran = hak bank untuk renegosiasi). Kredit tanpa covenant = mobil tanpa sensor: tahu ada masalah saat sudah menabrak.</p>
      <p><strong>Saat dilanggar:</strong> bukan otomatis default — melainkan <strong>hak bank</strong>: menaikkan bunga, meminta pelunasan dipercepat, atau renegosiasi syarat. Ini <strong>daya tawar</strong> — momen bank paling kuat.</p>

      <PlotlyChart
        data={covenantData}
        title="Pelanggaran Covenant: DSCR vs Batas 1,3× (ilustrasi)"
        layout={{ xaxis: { title: "Tahun" }, yaxis: { title: "DSCR (×)" }, showlegend: true }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> garis merah = DSCR aktual; garis biru putus-putus = batas covenant 1,3×.</p>
        <p><strong>Interpretasi:</strong> pelanggaran terjadi <strong>2024</strong> (1,4 → di bawah 1,3? — lihat: 2024 = 1,4 masih lolos tipis; <strong>2025 = 1,05 LANGGAR</strong>). Bank mendapat hak renegosiasi <strong>setahun SEBELUM</strong> default potensial. <strong>Inilah nilai covenant:</strong> ia memberi bank <em>kursi di meja</em> saat perusahaan mulai goyah — bukan setelah jatuh.</p>
      </div>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Covenant ketat = bank tidak percaya debitur."</strong></p>
        <p><strong>Yang benar:</strong> covenant adalah <strong>sistem peringatan dini kontraktual</strong> — justru <em>memungkinkan</em> bank memberi kredit ke perusahaan berisiko (dengan pengaman). Tanpa covenant, bank hanya berani ke yang super aman. Debitur yang menolak semua covenant biasanya menyembunyikan sesuatu.</p>
      </div>

      <h2 id="rating">Rating Internal: Menilai yang Tak Terukur</h2>
      <p><strong>Definisi.</strong> <strong>Rating internal</strong> = penilaian kredit bank atas debitur korporasi, mengombinasikan:</p>
      <ul>
        <li><strong>Kuantitatif (40%)</strong> — rasio keuangan (Part 1): DSCR, leverage, likuiditas.</li>
        <li><strong>Kualitatif (35%)</strong> — manajemen (track record, suksesi), posisi pasar, diversifikasi pelanggan, tata kelola.</li>
        <li><strong>Industri (15%)</strong> — siklus, kompetisi, regulasi sektor (jembatan ke CR18).</li>
        <li><strong>Negara (10%)</strong> — risiko negara (untuk lintas batas).</li>
      </ul>
      <p><strong>Mengapa kualitatif 35%?</strong> Karena angka tidak menangkap: direktur yang korup, pelanggan tunggal 80%, atau industri yang sekarat. <strong>Krisis terbesar selalu dimulai dari yang kualitatif</strong> — angka hanya mengkonfirmasi belakangan.</p>

      <PlotlyChart
        data={ratingMapData}
        title="Bobot Komponen Rating Internal (ilustrasi praktik bank)"
        layout={{ xaxis: { title: "Komponen" }, yaxis: { title: "Bobot (%)" }, showlegend: false }}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> tinggi batang = bobot tiap komponen dalam skor rating.</p>
        <p><strong>Interpretasi:</strong> <strong>kualitatif (35%) hampir sebesar kuantitatif (40%)</strong> — bank sadar angka saja tidak cukup. <strong>Pelajaran karir:</strong> analis yang hanya jago Excel (kuantitatif) = setengah analis. Kemampuan menilai manajemen &amp; industri (kualitatif) yang membedakan senior dari junior — dan ini didapat dari <strong>kunjungan lapangan</strong>, bukan spreadsheet.</p>
      </div>

      <div className="tip">
        <p><strong>💡 Intuisi kunci:</strong> uji kualitatif terbaik: <strong>"maukah saya menginvestasikan uang sendiri ke perusahaan ini?"</strong> Jika ragu karena direkturnya, pelanggannya, atau industrinya — tuliskan keraguan itu di memo. Keraguan kualitatif yang diabaikan adalah sumber "kejutan" terbesar di kredit korporasi.</p>
      </div>

      <h2 id="memo">Memo Kredit: Senjata Analis</h2>
      <p><strong>Definisi.</strong> <strong>Memo kredit</strong> (<em>credit proposal</em>) = dokumen rekomendasi analis ke <strong>komite kredit</strong>. Struktur baku:</p>
      <ol>
        <li><strong>Eksekutif summary</strong> — rekomendasi di 1 paragraf (ACC/tolak + syarat utama). <em>Ditulis terakhir, dibaca pertama.</em></li>
        <li><strong>Profil debitur &amp; kebutuhan</strong> — siapa, mau apa, berapa, untuk apa.</li>
        <li><strong>Analisis keuangan</strong> — tren rasio 5 tahun + air terjun kas (Part 1 + lesson ini).</li>
        <li><strong>Analisis kualitatif</strong> — manajemen, industri, posisi pasar.</li>
        <li><strong>Risiko &amp; mitigasi</strong> — tabel: risiko → dampak → mitigasi (covenant, agunan, pricing).</li>
        <li><strong>Struktur usulan</strong> — plafon, tenor, bunga, agunan, covenant.</li>
        <li><strong>Kesimpulan &amp; rekomendasi</strong> — tegas: ACC dengan syarat / tolak.</li>
      </ol>
      <p><strong>Aturan emas memo:</strong> (1) <strong>rekomendasi di depan</strong> — komite tidak punya waktu berburu; (2) <strong>jujur soal risiko</strong> — menyembunyikan = bunuh kredibilitas (dan karir); (3) <strong>angka + narasi</strong> — rasio tanpa cerita = mati, cerita tanpa rasio = dongeng.</p>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Memo yang bagus = memo yang membuat komite ACC."</strong></p>
        <p><strong>Yang benar:</strong> memo yang bagus = <strong>keputusan yang benar</strong> — termasuk menolak. Analis yang selalu "menjual" ACC akan kehilangan kepercayaan komite; sekali rekomendasinya macet, karirnya ikut macet. <strong>Kredibilitas analis = mata uang karirnya</strong> — dan ia dibangun dari keberanian bilang "tolak".</p>
      </div>

            <h3>🎯 Intuisi Lanjutan: Air Terjun Tidak Berbohong</h3>
      <p>Cash waterfall adalah <strong>tes kejujuran EBITDA</strong>. EBITDA Rp 162 M terlihat perkasa — sampai air terjun menunjukkan: pajak, modal kerja, capex, bunga, dan cicilan mengambil bagiannya masing-masing, dan sisanya negatif. Setiap "pajak air" adalah pertanyaan: <strong>apakah EBITDA ini benar-benar bisa dipakai membayar bank?</strong> Perusahaan dengan EBITDA besar tetapi modal kerja rakus (distributor, kontraktor) bisa tidak punya sisa untuk kreditur. DSCR yang jujur memakai <strong>FCF</strong>, bukan EBITDA — dan analis yang memakai EBITDA untuk perusahaan padat modal kerja sedang mengukur dengan penggaris yang salah.</p>
      <p>Intuisi kedua tentang covenant: <strong>covenant bukan tanda tidak percaya — melainkan harga kepercayaan</strong>. Justru karena bank bersedia memberi kredit ke perusahaan berisiko, ia meminta "sensor" kontraktual: laporan kuartalan, batas D/E, larangan dividen saat DSCR rendah. Tanpa covenant, bank hanya berani memberi ke perusahaan super aman — dan perusahaan berisiko tidak dapat kredit sama sekali. Covenant <strong>memperluas</strong> akses kredit, bukan mempersempitnya. Debitur yang menolak covenant pada dasarnya berkata: "saya tidak mau diawasi" — dan itu sendiri adalah informasi.</p>
      <p>Intuisi ketiga: <strong>pelanggaran covenant ≠ default otomatis</strong> — melainkan <strong>hak bank untuk bertindak</strong>. Inilah desain yang brilian: pelanggaran menjadi <strong>momen negosiasi</strong>, bukan vonis. Bank bisa menaikkan bunga (kompensasi risiko naik), meminta agunan tambahan, atau mempercepat pelunasan — <em>atau</em> memberikan waiver jika pelanggaran teknis dan sementara. Analis yang memahami ini memakai covenant sebagai <strong>alat manajemen hubungan</strong>, bukan palu hukuman.</p>

      {/* 7. LABS */}
      <h2 id="lab1">🔬 Lab 1: Air Terjun Kas</h2>
      <p>Dari EBITDA Rp 162 M sampai sisa — ikuti setiap tetesnya.</p>
      <PyodideLab
        title="Lab 1 — Cash Waterfall PT Maju Jaya"
        hint="Coba set modal_kerja=20 (efisien). Lalu coba capex=30 (pabrik tidak ekspansi). Pada kombinasi apa sisa jadi positif? Itulah 'ruang napas' perusahaan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Covenant Tester</h2>
      <p>Uji skenario terhadap covenant DSCR 1,3× — kapan alarm berbunyi?</p>
      <PyodideLab
        title="Lab 2 — Simulasi Pelanggaran Covenant"
        hint="Coba: (1) batas 1.1 vs 1.5 — mana yang memberi peringatan lebih dini? (2) Tambah skenario 'EBITDA 100'. Diskusikan: covenant ketat + realistis vs longgar — mana yang sebenarnya melindungi bank?"
        defaultCode={lab2Code}
      />

      {/* 9. PETA KEPUTUSAN */}
      <h2 id="peta">🗺️ Peta Keputusan: Struktur Kredit Korporasi</h2>

      <div className="decision-card">
        <h3>1. DSCR FCF &lt;1,2 → <strong>tuntut ekuitas dulu / tolak</strong></h3>
        <p><strong>Kondisi:</strong> kas bebas tidak menutup utang.</p>
        <p><strong>Kenapa:</strong> kredit bukan obat — perusahaan harus sehat dulu (injeksi modal), baru dibiayai.</p>
      </div>

      <div className="decision-card">
        <h3>2. ACC dengan risiko menengah → <strong>covenant financial + negative</strong></h3>
        <p><strong>Kondisi:</strong> DSCR 1,2–1,5, tren stabil.</p>
        <p><strong>Paket:</strong> DSCR min 1,25×, D/E maks 2,5×, larangan dividen jika di bawah ambang, lapor kuartalan. Covenant = harga dari risiko menengah.</p>
      </div>

      <div className="decision-card">
        <h3>3. Kualitatif merah (manajemen meragukan) → <strong>tolak, apapun angkanya</strong></h3>
        <p><strong>Kondisi:</strong> rasio OK tapi direksi bermasalah / pelanggan tunggal 80%.</p>
        <p><strong>Kenapa:</strong> angka bisa direkayasa, karakter tidak. 35% bobot kualitatif ada untuk dipakai.</p>
      </div>

      <div className="decision-card">
        <h3>4. Proyek baru (belum ada historis) → <strong>project finance: kas proyek + sponsor</strong></h3>
        <p><strong>Kondisi:</strong> SPV proyek infrastruktur.</p>
        <p><strong>Analisis:</strong> proyeksi arus kas proyek (bukan historis) + kekuatan sponsor + kontrak offtake. DSCR proyeksi min 1,3× dengan stress test.</p>
      </div>

            <div className="decision-card">
        <h3>5. Debitur minta waiver covenant D/E (3,2× vs batas 2,5×) karena "cuma sementara" → <strong>beri waiver bersyarat + harga, bukan gratis</strong></h3>
        <p><strong>Kondisi:</strong> D/E menyentuh 3,2× (batas 2,5×) karena akuisisi yang "strategis". Debitur minta waiver 1 tahun: "nanti juga turun sendiri."</p>
        <p><strong>Aksi:</strong> waiver <strong>bersyarat dan berbayar</strong>: (1) <strong>harga</strong> — bunga naik 50–100 bps selama waiver (kompensasi risiko naik); (2) <strong>batas waktu</strong> — 12 bulan, tidak diperpanjang otomatis; (3) <strong>rencana penurunan</strong> — debitur wajib menunjukkan roadmap D/E kembali &lt;2,5× (divestasi? rights issue?); (4) <strong>negative covenant tambahan</strong> — selama waiver, dilarang dividen dan akuisisi baru. Waiver gratis = covenant tidak ada harganya = debitur akan melanggar lagi. Setiap waiver harus membuat debitur <strong>merasa</strong> bahwa covenant itu nyata.</p>
        <p><strong>Contoh nyata:</strong> dalam restrukturisasi korporasi Indonesia, bank yang memberi waiver bertingkat dengan harga mempertahankan disiplin; yang memberi waiver gratis berulang akhirnya kehilangan posisi tawar saat benar-benar butuh (debitur sudah terbiasa "tidak apa-apa").</p>
      </div>

<div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li><strong>FCF membayar utang</strong> — bukan EBITDA, bukan laba.</li>
          <li><strong>Covenant = alarm kontraktual.</strong> Ketat tapi realistis.</li>
          <li><strong>Kualitatif 35%.</strong> Kunjungi, jangan cuma spreadsheet.</li>
          <li><strong>Memo jujur &gt; memo lolos.</strong> Kredibilitas = karir.</li>
        </ol>
      </div>

      <h3>📌 Framework Praktisi: Merancang Covenant: 8 Elemen Kontrak Kredit Sehat</h3>
      <p>Covenant yang baik = sensor yang tepat + konsekuensi yang jelas. Delapan elemen ini = anatomi perjanjian kredit yang melindungi.</p>
      <ol>
        <li><strong>Financial covenant: DSCR min</strong> — 1,2–1,3× dari KAS (bukan EBITDA untuk padat modal kerja!). Diuji kuartalan — bukan tahunan (tahunan = terlambat).</li>
        <li><strong>Financial covenant: D/E maks</strong> — 2,5–3× tergantung industri. Mencegah 'tumbuh dengan utang' tanpa batas.</li>
        <li><strong>Financial covenant: current ratio min</strong> — 1,1–1,2×. Menjaga likuiditas jangka pendek — gagal bayar sering karena likuiditas, bukan solvabilitas.</li>
        <li><strong>Negative: batas utang tambahan</strong> — Tidak boleh tambah utang &gt;X tanpa persetujuan. Mencegah dilusi posisi bank (subordinasi diam-diam).</li>
        <li><strong>Negative: larangan dividen saat tertekan</strong> — DSCR &lt;1,5× = dividen dilarang. Kas untuk kreditur dulu, pemegang saham kemudian.</li>
        <li><strong>Negative: change of control</strong> — Pemilik tidak boleh berganti tanpa persetujuan bank. Pemilik baru = risiko baru.</li>
        <li><strong>Affirmative: laporan + audit</strong> — Laporan kuartalan &lt;45 hari, audit WTP tahunan. Informasi adalah oksigen monitoring.</li>
        <li><strong>MAC clause + konsekuensi jelas</strong> — Hak bank saat dilanggar: naikkan bunga X bps / minta agunan tambahan / percepat pelunasan — TERTULIS, bukan 'nanti dibahas'.</li>
      </ol>
      <p><strong>💡 Cara memakai:</strong> delapan elemen ini = checklist review perjanjian kredit. Covenant yang tidak dimonitor kuartalan = sabuk pengaman yang tidak dipakai.</p>

            {/* 10. MINI-CASE */}
            {/* 9B. REALITA INDONESIA */}
      <h2 id="realita">🏛️ Regulasi & Realita Indonesia</h2>
      <p>Indonesia punya ekosistem covenant dan rating yang khas — dari Pefindo hingga PKPU.</p>

      <h3>Pefindo: Saksi Independen Indonesia</h3>
      <p><strong>PT Pemeringkat Efek Indonesia (Pefindo)</strong> adalah lembaga pemeringkat domestik utama — ratingnya (idAAA hingga idD) dipakai untuk obligasi korporasi dan menjadi <strong>referensi independen</strong> bagi analis bank. Praktik sehat: bandingkan <strong>rating internal bank vs rating Pefindo</strong> untuk debitur yang sama. Jika rating internal 2 notch lebih baik dari Pefindo secara konsisten = bank terlalu optimis (atau Pefindo terlalu konservatif — selidiki!). Perbedaan sistematis adalah temuan validasi.</p>
      <p>Catatan: tidak semua debitur bank diperingkat Pefindo (umumnya yang menerbitkan obligasi). Untuk yang tidak diperingkat, rating internal bank adalah satu-satunya kompas — sehingga <strong>kualitas metodologi internal</strong> menjadi kritis (dan diawasi OJK).</p>

      <h3>Covenant dalam Praktik Indonesia</h3>
      <p>Dokumen kredit korporasi Indonesia (dibuat notaris, mengacu pada perjanjian kredit) umumnya memuat:</p>
      <ul>
        <li><strong>Financial covenant:</strong> DSCR min 1,2–1,3×; D/E maks 2,5–3×; current ratio min 1,1–1,2× — diuji kuartalan/semesteran dari laporan keuangan.</li>
        <li><strong>Negative covenant:</strong> larangan menambah utang tanpa persetujuan, larangan menjual aset inti, larangan dividen jika covenant tertekan, <em>change of control clause</em> (pemilik tidak boleh ganti tanpa izin bank!).</li>
        <li><strong>MAC clause:</strong> bank boleh menahan pencairan jika terjadi perubahan material yang merugikan.</li>
      </ul>
      <p>Praktik yang sering longgar: <strong>monitoring covenant</strong>. Banyak bank mencantumkan covenant tetapi tidak mengujinya disiplin tiap kuartal — sehingga pelanggaran baru ketahuan saat sudah parah. Covenant yang tidak dimonitor = sabuk pengaman yang tidak dipakai.</p>

      <h3>PKPU: Arena Terakhir</h3>
      <p><strong>PKPU</strong> (Penundaan Kewajiban Pembayaran Utang) adalah proses hukum Indonesia untuk restrukturisasi — dipakai Garuda, Sritex, dan banyak korporasi. Bagi analis kredit, PKPU berarti: <strong>LGD ditentukan di meja perundingan, bukan di pasar</strong>. Hasilnya (homologasi) bisa berupa haircut, konversi utang jadi saham, atau perpanjangan tenor — semuanya memengaruhi recovery. Analis yang memonitor debitur bermasalah wajib memahami <strong>dinamika voting PKPU</strong> (kreditur separatis vs konkuren) karena posisi bank dalam voting menentukan hasil akhirnya.</p>

      <details className="worked">
        <summary>📐 Contoh pengerjaan: DSCR jujur vs DSCR EBITDA (klik untuk buka)</summary>
        <p>PT Distribusi (Rp M): EBITDA 100, pajak 15, kenaikan modal kerja 30 (piutang menumpuk), capex 20, bunga 12, cicilan pokok 18.</p>
        <p><strong>Langkah 1</strong> — DSCR versi EBITDA: 100 / (12+18) = <strong>3,33×</strong> — terlihat sangat aman!<br />
        <strong>Langkah 2</strong> — FCF = 100 − 15 − 30 − 20 = <strong>35</strong>.<br />
        <strong>Langkah 3</strong> — DSCR jujur (FCF): 35 / 30 = <strong>1,17×</strong> — mepet!</p>
        <p><strong>Pelajaran:</strong> 3,33× vs 1,17× — <strong>definisi mengubah vonis</strong>. Untuk distributor (modal kerja rakus), DSCR EBITDA adalah dongeng. Selalu tanyakan: "DSCR dari angka apa?" sebelum percaya.</p>
      </details>

      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: "Covenant dilanggar = bank langsung sita agunan."</strong></p>
        <p><strong>Yang benar:</strong> pelanggaran covenant memberi bank <strong>hak untuk bertindak</strong> — bukan kewajiban menyita. Praktik sehat: jadikan momen negosiasi (naikkan bunga, minta agunan tambahan, beri waiver bersyarat). Bank yang langsung sita untuk pelanggaran teknis kehilangan nasabah yang masih viable; bank yang selalu memberi waiver gratis kehilangan wibawa covenant-nya. Seni: <strong>tegas tetapi proporsional</strong>.</p>
      </div>

      <h2 id="case">📋 Mini-Case: Menulis Rekomendasi</h2>
      <div className="callout">
        <p>PT Sinar Abadi (tekstil, Bandung) mengajukan <strong>KMK Rp 50 M</strong> (tenor 1 tahun, revolving). Data:</p>
        <ul>
          <li>DSCR (EBITDA) 1,8×; DSCR (FCF) 1,35× — cukup, tidak lega.</li>
          <li>D/E 1,8×; tren stabil 3 tahun. Arus kas operasi = 90% laba bersih (sehat!).</li>
          <li>Kualitatif: direktur 20 tahun pengalaman, pelanggan tersebar (terbesar 15%), industri tekstil <strong>lesu</strong> (impor murah).</li>
          <li>Agunan: persediaan + piutang (fidusia) + tanah pabrik (HT).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> tulis rekomendasi 1 paragraf (gaya executive summary memo) + 3 covenant yang kamu syaratkan.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>Executive summary:</strong> <em>"Direkomendasikan ACC KMK Rp 50 M, 1 tahun revolving, dengan syarat covenant di bawah. DSCR FCF 1,35× mencukupi dengan buffer tipis; kualitas laba baik (kas operasi 90% laba); manajemen berpengalaman dengan diversifikasi pelanggan sehat. Risiko utama: industri tekstil lesu (impor) — dimitigasi dengan tenor pendek (1 tahun, review tahunan) dan covenant ketat. Pricing: bunga +0,5% di atas standar segmen sebagai kompensasi risiko industri."</em></p>
          <p><strong>3 covenant:</strong> (1) <strong>Financial:</strong> DSCR (FCF) min 1,2×, diuji kuartalan. (2) <strong>Negative:</strong> larangan capex &gt;Rp 10 M/tahun tanpa persetujuan + larangan dividen jika DSCR &lt;1,3×. (3) <strong>Affirmative:</strong> laporan keuangan kuartalan + laporan umur piutang bulanan (monitoring modal kerja — titik lemahnya).</p>
        </details>
      </div>

            <h2 id="case2">📋 Mini-Case 2: DSCR 3,3× yang Menipu</h2>
      <div className="callout">
        <p>PT Distribusi Maju mengajukan KMK Rp 30 M. Memo RM mencantumkan <strong>DSCR 3,33×</strong> (dari EBITDA) — "sangat layak!" Kamu meminta rincian air terjun kas:</p>
        <ul>
          <li>EBITDA Rp 100 M; pajak Rp 15 M; kenaikan modal kerja Rp 30 M/tahun (piutang ke 3 ritel besar); capex Rp 20 M; bunga Rp 12 M; cicilan pokok Rp 18 M.</li>
          <li>Tren: modal kerja naik 3 tahun berturut-turut (piutang makin lama tertagih).</li>
        </ul>
        <p><strong>Pertanyaan:</strong> hitung DSCR yang jujur, beri vonis, dan rancang covenant yang tepat untuk debitur ini.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p><strong>DSCR jujur (FCF):</strong> FCF = 100 − 15 − 30 − 20 = 35; DSCR = 35/30 = <strong>1,17×</strong> — bukan 3,33×! Memo RM memakai penggaris yang salah untuk distributor padat modal kerja.</p>
          <p><strong>Vonis:</strong> <strong>mepet, layak bersyarat</strong> — bukan "sangat layak". Tren modal kerja yang memburuk = red flag: pelanggan ritel besar menunda bayar, dan itu bisa memburuk tiba-tiba (jika satu ritel gagal bayar, piutang Rp puluhan M macet).</p>
          <p><strong>Covenant yang tepat:</strong> (1) DSCR dari <strong>kas operasi</strong> (bukan EBITDA!) min 1,2×, diuji kuartalan; (2) batas <strong>hari piutang</strong> (DSO) maks 90 hari — jika melampaui, wajib lapor + rencana aksi; (3) <strong>konsentrasi pelanggan</strong>: tidak ada pelanggan &gt;30% piutang tanpa persetujuan; (4) negative covenant: dilarang menambah utang bank lain tanpa izin (mencegah "gali lubang" silang).</p>
        </details>
      </div>

      {/* 11. QUIZ */}
      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (7 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. EBITDA Rp 162 M, tapi setelah pajak + modal kerja + capex + utang, sisa negatif. Pelajaran?"
        options={[
          "EBITDA salah hitung",
          "Yang membayar utang = free cash flow, bukan EBITDA — DSCR jujur memakai FCF untuk debitur padat modal kerja/capex",
          "Jangan pakai DSCR",
          "Tambah utang lagi",
        ]}
        correct={1}
        explanation="Benar: EBITDA → kas bebas ada 'pajak air' (modal kerja, capex). Analis senior menyajikan DSCR versi EBITDA DAN FCF — dan menjelaskan bedanya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Fungsi utama covenant financial (misal DSCR min 1,3×)?"
        options={[
          "Menghukum debitur",
          "Alarm dini kontraktual — memberi bank hak renegosiasi SEBELUM default, saat masih kuat",
          "Menaikkan bunga otomatis",
          "Formalitas",
        ]}
        correct={1}
        explanation="Benar: covenant = kursi di meja perundingan saat perusahaan mulai goyah. Tanpa covenant, bank tahu masalah saat sudah terlambat."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Dalam rating internal, komponen kualitatif berbobot 35%. Mengapa sebesar itu?"
        options={[
          "Agar analis ada kerjaan",
          "Krisis terbesar bermula dari yang kualitatif (manajemen, pelanggan tunggal, industri sekarat) — angka hanya mengkonfirmasi belakangan",
          "Regulasi mewajibkan 35% pas",
          "Kuantitatif tidak penting",
        ]}
        correct={1}
        explanation="Benar: angka = akibat, kualitatif = sebab. Analis yang hanya jago spreadsheet = setengah analis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Aturan emas memo kredit?"
        options={[
          "Buat komite selalu ACC",
          "Rekomendasi di depan, jujur soal risiko, angka + narasi — kredibilitas analis = mata uang karirnya",
          "Semakin tebal semakin baik",
          "Jangan cantumkan risiko",
        ]}
        correct={1}
        explanation="Benar: tiga aturan itu. Menyembunyikan risiko = bunuh kredibilitas; sekali rekomendasi macet, karir ikut macet."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Debitur melanggar covenant DSCR (1,05 vs min 1,3). Apa yang terjadi?"
        options={[
          "Otomatis default & disita",
          "Bank mendapat HAK (bukan kewajiban): renegosiasi, naikkan bunga, percepat pelunasan — momen daya tawar terkuat",
          "Tidak ada apa-apa",
          "Debitur dipenjara",
        ]}
        correct={1}
        explanation="Benar: pelanggaran covenant = hak, bukan vonis otomatis. Bank pintar memakai momen ini untuk memperbaiki posisinya (agunan tambahan, bunga lebih tinggi)."
      />

      {/* 12. RANGKUMAN */}
            <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. EBITDA 100, tetapi setelah pajak (15), modal kerja (30), dan capex (20), FCF tinggal 35. Bunga+cicilan = 30. Berapa DSCR yang jujur dan apa pelajarannya?"
        options={[
          "3,33× (dari EBITDA) — sangat aman",
          "1,17× (dari FCF) — mepet; definisi mengubah vonis: untuk perusahaan padat modal kerja, DSCR EBITDA adalah dongeng",
          "1,17× — tetap sangat aman",
          "Tidak bisa dihitung",
        ]}
        correct={1}
        explanation="Benar: 1,17×. 'DSCR dari angka apa?' adalah pertanyaan wajib — EBITDA mengabaikan tiga pencuri (pajak, modal kerja, capex) yang nyata bagi distributor/kontraktor. Selalu pakai FCF untuk mereka."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(6, ok)}
        question="7. Debitur melanggar covenant D/E dan minta waiver gratis 'cuma sementara'. Respons terbaik?"
        options={[
          "Beri gratis — jaga hubungan",
          "Tolak mentah — langsung sita",
          "Waiver bersyarat + berbayar: bunga naik, batas 12 bulan, roadmap penurunan D/E, larangan dividen/akuisisi selama waiver",
          "Abaikan — covenant tidak penting",
        ]}
        correct={2}
        explanation="Benar: waiver harus punya harga dan syarat. Gratis = covenant tidak ada wibawanya = akan dilanggar lagi. Tegas tetapi proporsional: pelanggaran adalah momen negosiasi, bukan vonis mati."
      />

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>Air terjun kas</strong>: EBITDA → kas operasi → FCF → sisa. FCF yang membayar utang.</li>
          <li><strong>Covenant</strong>: affirmative + negative + financial — alarm dini kontraktual.</li>
          <li><strong>Rating internal</strong>: kuantitatif 40% + kualitatif 35% + industri 15% + negara 10%.</li>
          <li><strong>Memo kredit</strong>: rekomendasi di depan, jujur soal risiko, angka + narasi.</li>
          <li><strong>Kredibilitas = karir</strong> — berani bilang "tolak".</li>
          <li>Kapan TIDAK pakai analisis historis: proyek baru/SPV — di sana proyeksi + sponsor + kontrak yang bicara.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/cr17a-corporate-credit-1" className="btn btn-secondary btn-sm">← CR17a</Link>
        <Link href="/learn/cr18-industry-country-risk" className="btn btn-primary btn-sm">Next: CR18 →</Link>
      </div>
    </div>
  );
}
