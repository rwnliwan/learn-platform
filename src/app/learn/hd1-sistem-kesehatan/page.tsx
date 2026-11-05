"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd1SistemKesehatanPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd1CompleteData = [{"x": ["Diagnosis (ICD)", "Obat diresepkan", "Hasil lab", "Riwayat merokok", "Catatan gejala", "Alergi"], "y": [98, 92, 70, 35, 55, 40], "type": "bar", "marker": {"color": "#2a7de1"}, "text": [98, 92, 70, 35, 55, 40], "textposition": "outside"}];
  const hd1CompleteDataLayout = {"xaxis": {"title": "Field"}, "yaxis": {"title": "Kelengkapan (%)", "range": [0, 110]}, "showlegend": false};

  const lab1Code = "import random\nrandom.seed(42)\nn = 1000\nprob_isi = {'diagnosis_icd': 0.98, 'obat': 0.92, 'hasil_lab': 0.70,\n            'riwayat_merokok': 0.35, 'alergi': 0.40}\nprint(f\"{'field':<18} {'terisi':>7} {'kelengkapan':>12}\")\nfor field, p in prob_isi.items():\n    terisi = sum(1 for _ in range(n) if random.random() < p)\n    print(f\"{field:<18} {terisi:>7} {terisi/n*100:>10.1f}%\")\nprint()\nprint('Aturan: field < 70% -> JANGAN dipakai untuk analisis faktor risiko')\nprint('tanpa investigasi mekanisme missing-nya (lihat HD8).')";

  const lab2Code = "# grain: 1 baris = 1 kunjungan EHR; klaim menggabungkan kunjungan rawat inap\nkunjungan = [  # (pasien, jenis, biaya_jt)\n    ('P1','rajal',0.5), ('P1','rajal',0.4),\n    ('P2','ranap',8.0), ('P2','ranap',7.5), ('P2','kontrol',0.3),\n    ('P3','rajal',0.6),\n]\nn_kunj = len(kunjungan)\npasien = set(p for p,_,_ in kunjungan)\nepisode_klaim = 4  # 2 rajal P1+P3, 1 ranap gabungan P2, 1 kontrol P2\ntot = sum(b for _,_,b in kunjungan)\nprint(f'total biaya        = Rp{tot:.1f} jt')\nprint(f'per kunjungan EHR  = Rp{tot/n_kunj:.2f} jt  (n={n_kunj})')\nprint(f'per pasien         = Rp{tot/len(pasien):.2f} jt  (n={len(pasien)})')\nprint(f'per episode klaim  = Rp{tot/episode_klaim:.2f} jt  (n={episode_klaim})')\nprint()\nprint('Satu data, tiga jawaban. Tulis grain-mu SEBELUM lapor angka.')";

  const hd1DmData = [{"x": ["EHR", "Klaim", "Registri", "Surveilans", "Wearable"], "y": [9, 4, 8, 2, 6], "type": "bar", "marker": {"color": "#2a7de1"}, "name": "Detail klinis"}, {"x": ["EHR", "Klaim", "Registri", "Surveilans", "Wearable"], "y": [5, 10, 4, 7, 3], "type": "bar", "marker": {"color": "#e8a838"}, "name": "Cakupan populasi"}];
  const hd1DmDataLayout = {"barmode": "group", "xaxis": {"title": "Sumber"}, "yaxis": {"title": "Skor"}, "showlegend": true};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD1 &mdash; Health Data Scientist</span>
        <h1 className="display-title">EHR, Klaim &amp; Registri:<br />Dari Mana Data Kesehatan Berasal</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Satu Pasien, Lima Versi Cerita</a></li>
          <li><a href="#ehr">EHR — Si Pencatat Sibuk</a></li>
          <li><a href="#klaim">Data Klaim — Si Tukang Tagih</a></li>
          <li><a href="#registri">Registri, Surveilans &amp; Wearable</a></li>
          <li><a href="#skala">Skala Data: Kenapa Butuh Spark</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Kelengkapan Data EHR</a></li>
          <li><a href="#lab2">🔬 Lab 2: Grain Klaim vs EHR</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Merekonsiliasi Tiga Angka</a></li>
          <li><a href="#wawasan">🧠 Wawasan Analis Senior</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: JKN, 280 Juta Peserta</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Membaca Insentif di Balik Data</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyebutkan 6 sumber data kesehatan utama (EHR, klaim, registri, trial, wearable, imaging) beserta <strong>tujuan aslinya</strong> dikumpulkan.</li>
          <li>Menjelaskan mengapa data yang dikumpulkan untuk <strong>layanan/billing</strong> berbahaya jika langsung dipakai untuk <strong>riset</strong> tanpa penyesuaian.</li>
          <li>Menghitung <strong>kelengkapan data</strong> per field dan mengaitkannya dengan bias analisis.</li>
          <li>Memilih sumber data yang tepat untuk 5 skenario analisis (peta keputusan).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Satu Pasien, Lima Versi Cerita</h2>
      <div className="story">
        <p>Pak Budi, 58 tahun, diabetes. Di <strong>EHR</strong> puskesmas, tercatat: gula darah 240, diberi metformin. Di <strong>klaim BPJS</strong>, tercatat: satu kunjungan rawat jalan, tarif INA-CBG sekian rupiah — tanpa angka gula darahnya. Di <strong>registri diabetes</strong> (kalau ia terdaftar), tercatat: HbA1c tiap 6 bulan selama 5 tahun. Di <strong>smartwatch</strong>-nya: detak jantung dan langkah harian. Di <strong>hasil lab</strong>: file PDF terpisah.</p>
      <p>Lima sumber, lima versi cerita tentang <em>orang yang sama</em> — dan tidak ada satupun yang lengkap sendirian. Inilah realitas data kesehatan: <strong>terfragmentasi sejak lahir</strong>, karena tiap sumber dibuat untuk tujuan berbeda. Analis yang tidak paham tujuan asli tiap sumber akan menarik kesimpulan dari cerita yang salah.</p>
      <p><strong>Twist-nya:</strong> sumber data yang <em>paling lengkap secara klinis</em> (EHR) justru yang <em>paling tidak bisa dipercaya</em> untuk riset tanpa pembersihan — sementara sumber yang <em>paling dangkal</em> (klaim, tanpa satu pun angka lab) justru yang paling berguna untuk kebijakan populasi. Di data kesehatan, <strong>kelengkapan tidak sama dengan kebenaran</strong> — dan lesson ini mengajarkan cara membedakannya sebelum angka menipumu.</p>
      </div>

      <h2 id="ehr">EHR — Si Pencatat Sibuk</h2>
      <p><strong>Definisi.</strong> Electronic Health Record (di Indonesia: RME/Rekam Medis Elektronik, mis. SATUSEHAT) adalah catatan klinis digital: diagnosis, tindakan, obat, hasil lab, dan catatan narasi dokter. Tujuan aslinya: <strong>melayani pasien</strong>, bukan untuk dianalisis.</p>
      <Tex math={String.raw`\text{Kelengkapan} = \frac{\text{field terisi}}{\text{field wajib}} \times 100\%`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{field terisi}`} />: jumlah field yang benar-benar ada nilainya pada satu record</li>
          <li><Tex math={String.raw`\text{field wajib}`} />: jumlah field yang seharusnya diisi menurut SOP</li>
      </ul>
      <p><strong>Interpretasi:</strong> Kelengkapan 60% artinya 40% informasi hilang — dan hilangnya jarang acak: dokter sibuk cenderung melewatkan field yang tidak memengaruhi tindakan.</p>
      <details className="worked">
        <summary>📐 Contoh langkah-demi-langkah (klik untuk buka)</summary>
        <p>100 record pasien rawat jalan. Field &ldquo;riwayat merokok&rdquo; terisi di 35 record.<br /><strong>Langkah 1</strong> — field terisi = 35.<br /><strong>Langkah 2</strong> — field wajib = 100.<br /><strong>Langkah 3</strong> — kelengkapan = 35/100 × 100% = <strong>35%</strong>.</p><p>Kesimpulan: analisis &ldquo;pengaruh merokok&rdquo; dari EHR ini berbahaya — 65% data hilang, kemungkinan besar bukan acak.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> EHR itu seperti buku harian dokter yang ditulis sambil lari: kaya detail klinis, tapi berantakan, tidak konsisten antar dokter, dan penuh singkatan. Ia paling jujur soal <em>apa yang terjadi di ruang periksa</em> — dan paling berisik soal sisanya.</p>
      <p><strong>Kapan memakai:</strong> Butuh perjalanan klinis detail per pasien: urutan diagnosis, respons obat, catatan gejala. Syarat: siap membersihkan data narasi dan inkonsistensi.</p>

      <PlotlyChart
        data={hd1CompleteData}
        title="Kelengkapan Field EHR — Puskesmas X (n=1.000 record)"
        layout={hd1CompleteDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu horizontal = nama field, tinggi batang = persen record yang field-nya terisi. Bandingkan tinggi antar batang: makin pendek, makin banyak yang hilang.</p>
        <p><strong>Interpretasi:</strong> Field administratif/penagihan (diagnosis, obat) hampir 100% terisi — karena memengaruhi pembayaran. Field perilaku (merokok, alergi) jeblok di 35–40%. Pola ini universal: <strong>data terisi mengikuti insentif pengisinya</strong>, bukan kebutuhan analismu. Inilah kenapa analisis faktor risiko dari EHR mentah sering bias.</p>
      </div>

      <h2 id="klaim">Data Klaim — Si Tukang Tagih</h2>
      <p><strong>Definisi.</strong> Data klaim (di Indonesia: BPJS Kesehatan) mencatat <strong>apa yang ditagihkan</strong>: kode diagnosis (ICD-10), tindakan, dan tarif INA-CBG per episode perawatan. Tujuan aslinya: <strong>pembayaran</strong>, bukan kebenaran klinis.</p>
      <p><strong>Kepribadian konsep ini:</strong> Data klaim itu seperti struk belanja: rapi, terstandar, mencakup hampir seluruh populasi peserta — tapi hanya mencatat yang <em>dibayar</em>. Obat yang dibeli sendiri di apotek? Tidak ada. Pasien yang tidak berobat? Tidak ada. Ia jujur soal uang, bisu soal kesehatan yang sebenarnya.</p>
      <p><strong>Kapan memakai:</strong> Butuh gambaran utilisasi layanan dan biaya di level populasi: tren kunjungan, beban biaya per penyakit, perbandingan antar wilayah. Jangan pakai untuk prevalensi penyakit yang sebenarnya.</p>
      <div className="callout callout-warning"><strong>Jebakan klasik:</strong> menghitung prevalensi diabetes dari klaim BPJS hanya menangkap <em>diabetes yang terdiagnosis dan berobat</em>. Riskesdas 2018 menemukan sebagian besar diabetes di Indonesia <strong>tidak terdiagnosis</strong> — klaim akan meremehkan prevalensi sebenarnya secara sistematis.</div>

      <h2 id="registri">Registri, Surveilans &amp; Wearable — Para Spesialis</h2>
      <p><strong>Definisi.</strong> <strong>Registri</strong> mengikuti kohort penyakit spesifik dari waktu ke waktu (mis. registri kanker, TB). <strong>Surveilans</strong> (mis. SKDR/EWARS) memantau sinyal wabah secara rutin. <strong>Trial klinis</strong> menghasilkan data paling bersih karena protokolnya ketat. <strong>Wearable/imaging</strong> memberi data fisiologis kontinu dan citra.</p>
      <p><strong>Kepribadian konsep ini:</strong> Mereka spesialis: registri dalam tapi sempit (satu penyakit), surveilans cepat tapi kasar (sinyal, bukan diagnosis), trial bersih tapi artifisial (populasi terpilih), wearable kontinu tapi berisik (artefak gerakan). Pilih sesuai pertanyaan — jangan pukul paku dengan obeng.</p>
      <p><strong>Kapan memakai:</strong> Registri untuk outcome jangka panjang satu penyakit; surveilans untuk deteksi dini wabah; trial untuk efikasi obat; wearable untuk monitoring kontinu; imaging untuk diagnosis berbasis citra.</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">Sumber data        | Grain (1 baris =)      | Kekuatan utama
-------------------|------------------------|---------------------------
EHR / RME          | 1 kunjungan / 1 pasien | Detail klinis longitudinal
Klaim BPJS         | 1 episode penagihan    | Cakupan populasi, biaya
Registri penyakit  | 1 pasien terdaftar     | Follow-up outcome spesifik
Surveilans (EWARS) | 1 laporan mingguan     | Kecepatan sinyal wabah
Trial klinis       | 1 peserta              | Data bersih, terstandar
Wearable           | 1 pengukuran sensor    | Kontinu, real-world</pre>

      <h2 id="skala">Skala Data: Kenapa Lowongan Minta Spark</h2>
      <p><strong>Definisi.</strong> Satu RS besar menghasilkan jutaan record EHR per tahun; klaim BPJS mencakup ratusan juta peserta. Volume + heterogenitas ini membuat laptop dan pandas kewalahan — di sinilah <strong>komputasi terdistribusi (Apache Spark)</strong> dan cloud menjadi syarat di lowongan Health Data Scientist.</p>
      <Tex math={String.raw`\text{Waktu} \approx \frac{\text{Volume data}}{\text{Jumlah worker} \times \text{kecepatan per worker}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{Volume data}`} />: ukuran data, mis. 500 GB klaim 5 tahun</li>
          <li><Tex math={String.raw`\text{Jumlah worker}`} />: mesin paralel di cluster Spark</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus kasar ini menjelaskan intuisi paralelisme: 10 worker memproses kira-kira 10x lebih cepat (minus overhead). Skill-nya bukan menghafal Spark, tapi berpikir dalam <em>partisi dan agregasi terdistribusi</em>.</p>
      <p><strong>Kepribadian konsep ini:</strong> Data kesehatan itu 4V: volume besar, variety (teks, citra, kode, sinyal), velocity (streaming ICU/wearable), veracity (kualitas dipertanyakan). Analis yang hanya bisa Excel akan tenggelam di V pertama.</p>
      <p><strong>Kapan memakai:</strong> Data di atas ~10 GB, join multi-tabel ratusan juta baris, atau agregasi nasional: pikirkan Spark/pandas-terdistribusi, bukan loop Python.</p>

      <h2 id="pendalaman">🔍 Pendalaman: Membaca Insentif di Balik Data</h2>
      <details className="worked">
        <summary>📐 Worked example: mengaudit “siapa diuntungkan jika field ini terisi” (klik untuk buka)</summary>
        <p>Ambil satu tabel EHR: <strong>kunjungan_rawat_jalan</strong> (n = 10.000). Kamu diminta menilai apakah kolom <code>diagnosis_sekunder</code> layak dipakai untuk studi komorbiditas.</p>
        <p><strong>Langkah 1 — Tanya siapa pengisinya.</strong> Kolom diisi dokter di akhir kunjungan, bersamaan dengan pengajuan klaim. Dokter dibayar per episode INA-CBG yang tarifnya naik bila ada komorbiditas tercatat.</p>
        <p><strong>Langkah 2 — Petakan insentif.</strong> Dokter punya insentif <em>mencatat</em> komorbiditas (menaikkan tarif), dan <em>tidak</em> punya insentif mencatat komorbiditas yang tidak memengaruhi tarif. Maka: komorbiditas “mahal” cenderung <em>over-recorded</em>, komorbiditas “murah” <em>under-recorded</em>.</p>
        <p><strong>Langkah 3 — Uji dengan data.</strong> Hitung kelengkapan diagnosis sekunder per kuartil tarif: Q1 (termurah) 12% terisi, Q4 (termahal) 68% terisi. Pola monoton = konfirmasi insentif.</p>
        <p><strong>Langkah 4 — Keputusan.</strong> Kolom ini <strong>tidak netral</strong>: memakainya mentah untuk “prevalensi komorbiditas” akan melebihkan komorbiditas pada pasien mahal. Solusi: stratifikasi per kelompok tarif, atau pakai sumber independen (hasil lab) untuk validasi.</p>
        <p><strong>Pelajaran:</strong> audit insentif mengubahmu dari “penghitung angka” menjadi “detektif data” — dan detektif selalu bertanya <em>cui bono</em> (siapa diuntungkan) sebelum percaya.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — “data exhaust” vs “data designed”:</strong> Hampir semua data kesehatan adalah <em>data exhaust</em> (asap knalpot dari proses lain: layanan, billing) — bukan <em>data designed</em> (dirancang untuk pertanyaanmu, seperti survei Riskesdas). Analis junior memperlakukan exhaust seperti designed. Analis senior selalu bertanya: “Proses apa yang menghasilkan baris ini, dan apa yang proses itu <em>tidak</em> pedulikan?” Jawabannya biasanya adalah kolom yang paling berbahaya.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — SATUSEHAT dan jebakan “sudah digital = sudah beres”:</strong> Platform SATUSEHAT Kemenkes mengintegrasikan RME ratusan faskes — lompatan besar. Tapi digitalisasi <em>mempercepat</em> aliran data tanpa memperbaiki <em>kualitas</em> pengisian: studi implementasi RME di Indonesia berulang kali menemukan field perilaku dan outcome jangka panjang tetap bolong, sementara field billing rapi. Artinya: analis SATUSEHAT 2026 menghadapi masalah yang <em>sama persis</em> dengan analis EHR AS 2016 — beda skala, sama jebakannya. Skill audit insentif di lesson ini justru makin berharga saat datanya makin besar.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan Analis Senior: Tiga Pertanyaan Sebelum Buka File</h2>
      <p>Setelah 10 tahun di analitik kesehatan, analis senior tidak lagi membuka file duluan. Mereka menanyakan tiga hal — dan 80% jebakan terungkap sebelum satu baris kode ditulis.</p>
      <p><strong>Pertanyaan 1 — Siapa yang diuntungkan jika data ini salah dengan cara tertentu?</strong> Ini pertanyaan insentif (lihat Pendalaman di atas), tapi versi operasionalnya: <em>gambarkan panah uangnya</em>. Contoh: RS dibayar per episode INA-CBG → kode yang menaikkan tarif ditulis rajin, yang tidak menaikkan tarif ditulis malas. Contoh kedua: puskesmas dinilai dari cakupan imunisasi → angka cakupan “selalu” di atas 90%. <strong>Data yang menentukan insentif pengisinya tidak bisa dibaca polos.</strong> Selalu cari <em>sumber independen</em> untuk validasi silang: klaim vs survei, catatan vs hasil lab, laporan vs observasi lapangan.</p>
      <p><strong>Pertanyaan 2 — Siapa yang <em>tidak ada</em> di data ini?</strong> Ini pertanyaan denominator. EHR hanya berisi yang berobat; klaim hanya yang terdiagnosis dan ditagih; survei kepuasan hanya yang mau mengisi. Tiap dataset kesehatan adalah <strong>foto dari jendela yang sempit</strong> — analis senior selalu menggambar bingkai jendelanya: “data ini mewakili 40% populasi (peserta aktif berobat), bukan 100%.” Latihan: untuk tiap proyek, tulis satu kalimat <em>“siapa yang hilang”</em> di slide pertama presentasimu. Kalimat itu menyelamatkanmu dari 90% pertanyaan jebakan direksi.</p>
      <p><strong>Pertanyaan 3 — Kapan baris ini ditulis, relatif terhadap kejadian yang ia klaim?</strong> Ini pertanyaan temporalitas. Tanggal diagnosis di EHR ≠ tanggal sakit (bisa selisih bulan); tanggal klaim ≠ tanggal layanan (bisa selisih kuartal); tanggal laporan surveilans ≠ tanggal onset (lapor mingguan menumpuk). Analisis “tren bulanan” dari tanggal klaim sebenarnya menganalisis <strong>tren administrasi</strong>, bukan tren penyakit. Selalu tanyakan: “tanggal apa <em>ini</em>?” — dan jika memakai tanggal proksi, nyatakan eksplisit + uji sensitivitas dengan definisi tanggal alternatif.</p>
      <div className="callout">
        <p><strong>Checklist 60 detik</strong> (tempel di dinding): ① Insentif pengisi? ② Siapa yang hilang? ③ Tanggal apa ini? — Tiga pertanyaan ini tidak ada di software statistik manapun, dan justru itulah yang membedakan analis yang <em>dipercaya</em> dari analis yang <em>bisa coding</em>.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data EHR bisa langsung dipakai untuk riset karena digital dan lengkap&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> EHR dikumpulkan untuk layanan, bukan riset: field penting untuk analis (gaya hidup, outcome jangka panjang) justru yang paling sering kosong, dan pengisiannya mengikuti insentif klinis/billing. Selalu audit kelengkapan dan pahami alur kerja pengisi sebelum percaya.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data klaim BPJS = potret kesehatan populasi Indonesia&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Klaim hanya menangkap yang berobat dan terdiagnosis di faskes. Penyakit yang tidak terdiagnosis (banyak, menurut Riskesdas), berobat mandiri, atau di luar cakupan tidak tercatat. Klaim = potret <em>utilisasi layanan</em>, bukan potret <em>kesehatan</em>.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Makin besar data kesehatan, makin benar kesimpulannya&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Big data memperkecil <em>sampling error</em> tapi tidak menyentuh <em>bias sistematis</em>. Satu juta record klaim tetap meremehkan prevalensi diabetes yang tidak terdiagnosis — biasnya justru makin “presisi” (salah dengan keyakinan tinggi).</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Merekonsiliasi Tiga Angka yang “Bertengkar”</h2>
      <details className="worked">
        <summary>📐 Worked example: prevalensi diabetes versi klaim, survei, dan skrining lokal (klik untuk buka)</summary>
        <p>Kepala Dinkes menaruh tiga angka di mejamu dan bertanya “mana yang benar?”: <strong>klaim BPJS 4,2%</strong>, <strong>Riskesdas 10,9%</strong>, <strong>skrining posbindu kabupaten 14,1%</strong>. Analis junior memilih satu. Analis senior menjelaskan ketiganya.</p>
        <p><strong>Langkah 1 — Tulis definisi operasional tiap angka.</strong> Klaim 4,2% = peserta dengan kode E10–E14 dalam setahun (butuh: terdiagnosis + berobat ke faskes + dikode). Riskesdas 10,9% = sampel populasi dites gula darah langsung (butuh: terpilih sampel + bersedia dites). Skrining posbindu 14,1% = pengunjung posbindu yang dites (butuh: datang ke posbindu + dites).</p>
        <p><strong>Langkah 2 — Petakan rantai seleksinya.</strong> Dari 100 penderita diabetes sebenarnya: ~60 tidak tahu dirinya sakit (tidak terdiagnosis — hilang dari klaim); dari 40 yang tahu, ~25 berobat rutin ke faskes (15 hilang dari klaim karena berobat mandiri/beli obat bebas); dari 25 itu, ~22 terkode E10–E14 dengan benar. Maka klaim 4,2% ≈ 10,9% × 40% × 62% × 88% — <strong>angka klaim adalah hasil perkalian empat filter</strong>, bukan cermin prevalensi.</p>
        <p><strong>Langkah 3 — Jelaskan kenapa skrining posbindu tertinggi (14,1%).</strong> Pengunjung posbindu <em>bukan</em> sampel acak: yang datang cenderung lansia, perempuan, dan yang merasa berisiko (self-selection). 14,1% = prevalensi <em>di antara pengunjung posbindu</em>, bukan populasi. Men-generalisirnya ke kabupaten = <strong>selection bias</strong> klasik.</p>
        <p><strong>Langkah 4 — Tentukan “benar untuk apa”.</strong> Untuk <strong>perencanaan anggaran obat</strong>: pakai klaim (4,2%) + proyeksi tren — karena anggaran membayar yang berobat. Untuk <strong>target skrining</strong>: pakai Riskesdas (10,9%) — karena targetnya menemukan yang belum terdiagnosis (gap ≈ 6,7 poin persen ≈ ratusan ribu orang di satu provinsi). Untuk <strong>evaluasi posbindu</strong>: pakai 14,1% sebagai <em>yield</em> program, bukan prevalensi.</p>
        <p><strong>Langkah 5 — Sajikan sebagai narasi, bukan angka tunggal.</strong> “Diabetes kita: ~11% penduduk (survei), ~4% terjaring layanan (klaim), program kita menemukan 14% di antara yang datang (posbindu). Kesenjangan 7 poin persen adalah <strong>pekerjaan rumah skrining</strong> — bukan kesalahan data.” Satu kalimat ini mengubah rapat dari debat angka menjadi rencana kerja.</p>
        <p><strong>Pelajaran:</strong> analis senior tidak menjawab “mana yang benar” — ia menjawab <strong>“tiap angka benar untuk pertanyaannya masing-masing, dan inilah peta pertanyaannya.”</strong></p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Simpan “kamus tiga angka” untuk tiap indikator penting di wilayahmu: <strong>angka layanan</strong> (klaim/EHR), <strong>angka populasi</strong> (survei), <strong>angka program</strong> (skrining). Ketika ketiganya “bertengkar”, jangan pilih — <strong>rekonsiliasi</strong>. Kemampuan rekonsiliasi inilah yang membuat Dinkes meneleponmu, bukan analis lain.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Selalu tanya dulu: <strong>untuk apa data ini dikumpulkan?</strong> Jawabannya memprediksi kolom mana yang bisa dipercaya, kolom mana yang jebakan — sebelum kamu buka satu file pun.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Dokumentasikan <strong>grain</strong> tiap sumber dalam satu kalimat (“satu baris = satu episode klaim”). Sebagian besar kesalahan analisis data kesehatan berakar dari salah grain, bukan salah model.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk tiap proyek, buat <strong>kamus data mini</strong>: definisi tiap field, siapa pengisinya, insentif pengisiannya. Ini membedakan analis senior dari junior di mata hiring manager kesehatan.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Audit Kelengkapan Data EHR (Live Python)</h2>
      <p>Simulasikan 1.000 record EHR dengan pola missing yang realistis (field billing rapi, field perilaku bolong), lalu hitung kelengkapannya. Ubah probabilitasnya dan lihat field mana yang paling berbahaya untuk analisis faktor risiko.</p>
      <PyodideLab
        title="🔬 Lab 1: Audit Kelengkapan Data EHR (Live Python)"
        hint="Coba ubah prob_isi 'riwayat_merokok' dari 0.35 ke 0.9. Apakah masalahnya hilang? Sekarang ubah polanya: buat missing-nya bergantung pada usia (bukan acak) — apa yang terjadi pada interpretasimu?"
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Grain Klaim vs EHR — Jebakan Double Counting</h2>
      <p>Satu pasien bisa punya 3 kunjungan EHR tapi 1 episode klaim (rawat inap). Agregasikan ke level pasien dan lihat bagaimana salah grain mengubah angka “biaya rata-rata per pasien”.</p>
      <PyodideLab
        title="🔬 Lab 2: Grain Klaim vs EHR — Jebakan Double Counting"
        hint="Ubah jumlah kunjungan pasien ke-3. Perhatikan: rata-rata per *kunjungan* vs per *pasien* vs per *episode klaim* memberi tiga angka berbeda dari data yang sama."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: JKN, 280 Juta Peserta</h2>
      <p>Program JKN Indonesia adalah salah satu skema asuransi kesehatan tunggal terbesar di dunia: <strong>~280 juta peserta</strong>, puluhan juta klaim per tahun, ribuan faskes. Bagi analis kesehatan, ini tambang emas — dan ladang ranjau.</p>
      <p><strong>Apa yang bisa dilakukan (dan sudah dilakukan):</strong> (1) <strong>Deteksi fraud</strong> — pola klaim anomali: RS dengan rata-rata LOS jauh di atas sebaran grup INA-CBG-nya, lonjakan diagnosis “mahal” tiap akhir kuartal, atau pasien “hantu” (klaim tanpa kunjungan). Analitik fraud JKN memakai aturan statistik + ML pada data klaim — persis skill HD1+HD12. (2) <strong>Perencanaan kapasitas</strong> — peta utilisasi per kabupaten: mana yang overload, mana yang under-served; dasar redistribusi faskes. (3) <strong>Evaluasi kebijakan</strong> — mis. dampak perubahan tarif INA-CBG terhadap perilaku coding RS (lihat jebakan upcoding di HD2).</p>
      <p><strong>Apa yang <em>tidak</em> bisa dilakukan — dan sering dicoba:</strong> (1) Menghitung <strong>prevalensi penyakit sebenarnya</strong> dari klaim (lihat mini-case diabetes: klaim = utilisasi, bukan kesehatan). (2) Membandingkan <strong>kualitas antar-RS</strong> dari angka klaim mentah tanpa penyesuaian risiko — RS rujukan menangani kasus berat, angkanya “terlihat buruk” padahal ia menyelamatkan yang paling sulit. (3) Mengklaim <strong>kausalitas kebijakan</strong> dari tren klaim tanpa desain evaluasi (lihat HD10).</p>
      <p><strong>Struktur data yang wajib dipahami:</strong> peserta terbagi <strong>PBI</strong> (iuran dibayar pemerintah — fakir miskin), <strong>PPU</strong> (pekerja penerima upah), <strong>PBPU/BP</strong> (mandiri). Ketiganya punya <strong>pola utilisasi berbeda sistematis</strong>: PBI cenderung memakai faskes tingkat pertama dan terlambat dirujuk; PPU punya akses lebih baik. Analisis yang menggabungkan ketiganya tanpa stratifikasi sedang <strong>mencampur tiga populasi berbeda</strong> — stratifikasi segmen kepesertaan adalah langkah pertama setiap analisis JKN yang serius.</p>
      <div className="tip">
        <p><strong>💡 Intuisi karier:</strong> “Pernah menganalisis data JKN/BPJS” adalah baris CV yang membuka pintu ke Kemenkes, BPJS, konsultan kesehatan, dan startup health-tech Indonesia. Skill-nya bukan sekadar SQL — melainkan <strong>memahami struktur programnya</strong> (segmen peserta, INA-CBG, alur rujukan berjenjang). Lesson HD1–HD2 inilah fondasinya; bangun portofolio satu analisis JKN end-to-end dan kamu sudah di depan 90% pelamar.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh perjalanan klinis detail → EHR/RME</h3>
        <p><strong>Kondisi:</strong> Pertanyaan soal urutan kejadian klinis: gejala → diagnosis → obat → respons, per pasien.</p>
        <p><strong>Kenapa:</strong> Hanya EHR yang mencatat narasi dan hasil klinis longitudinal. Klaim tidak punya angka lab.</p>
        <p><strong>Contoh nyata:</strong> Membangun fenotipe “pasien TB resisten obat” dari riwayat hasil lab dan regimen.</p>
      </div>
      <div className="decision-card">
        <h3>2. Butuh biaya &amp; utilisasi populasi → Klaim BPJS</h3>
        <p><strong>Kondisi:</strong> Pertanyaan soal beban sistem: berapa biaya, berapa kunjungan, di mana menumpuk.</p>
      <PlotlyChart
        data={hd1DmData}
        title="Kekuatan Sumber Data (skor ilustratif 1–10)"
        layout={hd1DmDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Dua kelompok batang per sumber: biru = kedalaman klinis, kuning = cakupan populasi. Tidak ada sumber yang menang di keduanya.</p>
        <p><strong>Interpretasi:</strong> Trade-off fundamental: EHR dalam tapi sempit, klaim luas tapi dangkal. Pilih berdasarkan pertanyaan, bukan berdasarkan data yang paling gampang diakses.</p>
      </div>
        <p><strong>Kenapa:</strong> Cakupan populasi terluas, terstandar INA-CBG, siap agregasi nasional.</p>
        <p><strong>Contoh nyata:</strong> Proyeksi beban biaya komplikasi diabetes per provinsi untuk perencanaan anggaran.</p>
      </div>
      <div className="decision-card">
        <h3>3. Butuh outcome jangka panjang satu penyakit → Registri</h3>
        <p><strong>Kondisi:</strong> Pertanyaan soal prognosis: survival 5 tahun kanker, kekambuhan TB.</p>
        <p><strong>Kenapa:</strong> Registri dirancang untuk follow-up terstandar pada satu kondisi.</p>
        <p><strong>Contoh nyata:</strong> Analisis faktor yang memprediksi kekambuhan TB paru dalam 2 tahun.</p>
      </div>
      <div className="decision-card">
        <h3>4. Butuh sinyal cepat wabah → Surveilans</h3>
        <p><strong>Kondisi:</strong> Pertanyaan soal deteksi dini: apakah kasus DBD naik di suatu kabupaten minggu ini.</p>
        <p><strong>Kenapa:</strong> EWARS/SKDR dirancang untuk kecepatan, bukan akurasi diagnosis.</p>
        <p><strong>Contoh nyata:</strong> Alert otomatis kenaikan kasus demam berdarah per kecamatan (lihat HD16).</p>
      </div>
      <div className="decision-card">
        <h3>5. Butuh data fisiologis kontinu → Wearable / IoT klinis</h3>
        <p><strong>Kondisi:</strong> Pertanyaan soal monitoring: deteksi dini perburukan pasien rawat jalan.</p>
        <p><strong>Kenapa:</strong> Satu-satunya sumber dengan resolusi menit/jam di dunia nyata.</p>
        <p><strong>Contoh nyata:</strong> Prediksi dekompensasi gagal jantung dari tren detak jantung dan aktivitas harian.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Tanya tujuan asli pengumpulan data — sebelum buka file.</li>
          <li>Tulis grain dalam satu kalimat.</li>
          <li>Cek kelengkapan per field; &lt; 70% = lampu kuning.</li>
          <li>Klaim = utilisasi, bukan kesehatan sebenarnya.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Prevalensi Diabetes: Klaim vs Riskesdas</h2>
      <div className="callout">
        <p>Dinkes sebuah provinsi memintamu menghitung <strong>prevalensi diabetes</strong> penduduk dewasa. Kamu punya dua angka:</p>
      <ul><li><strong>Data klaim BPJS 2025:</strong> 4,2% peserta punya klaim dengan diagnosis diabetes (ICD-10 E10–E14).</li>
      <li><strong>Riskesdas 2018</strong> (survei dengan pemeriksaan gula darah): prevalensi diabetes 10,9%, dan <strong>mayoritas tidak terdiagnosis</strong>.</li></ul>
        <p><strong>Pertanyaan:</strong> Angka mana yang kamu laporkan sebagai prevalensi, dan bagaimana kamu menjelaskan selisihnya ke Kepala Dinkes yang awam statistik?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Laporkan 10,9% (Riskesdas) sebagai estimasi prevalensi sebenarnya, karena survei memeriksa langsung sampel populasi — menangkap yang tidak terdiagnosis. Angka klaim 4,2% = prevalensi <em>terdiagnosis dan berobat</em>. Selisihnya justru insight: kesenjangan diagnosis ~6,7 poin persen = peluang program skrining. Penjelasan ke Kadinkes: “Klaim itu seperti menghitung ikan dengan jala — yang tidak kena jala bukan berarti tidak ada ikannya.” Jangan pernah sajikan angka klaim sebagai prevalensi tanpa kualifikasi ini.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Tujuan asli data klaim BPJS dikumpulkan adalah…"
        options={["Mendukung riset epidemiologi nasional",
          "Dasar pembayaran layanan kesehatan (billing)",
          "Surveilans wabah real-time",
          "Skrining penyakit tidak menular"]}
        correct={1}
        explanation="Benar: klaim = struk pembayaran. Konsekuensinya: ia rapi dan luas, tapi hanya mencatat yang ditagihkan — bukan potret kesehatan sebenarnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Field EHR dengan kelengkapan 35% (mis. riwayat merokok) dipakai untuk analisis faktor risiko tanpa investigasi. Masalah utamanya?"
        options={["Tidak ada — 35% dari 1.000 record masih 350 data",
          "Missing-nya kemungkinan tidak acak sehingga menimbulkan bias sistematis",
          "Komputer tidak bisa memproses data tidak lengkap",
          "Harus selalu dihapus saja"]}
        correct={1}
        explanation="Benar: bahayanya bukan jumlah, tapi mekanisme. Dokter mencatat merokok saat relevan klinis — missing-nya terkait kondisi pasien (MNAR, lihat HD8). Analisis naif akan bias."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Untuk proyeksi beban biaya komplikasi diabetes per provinsi, sumber terbaik?"
        options={["Catatan narasi EHR satu RS",
          "Data klaim BPJS",
          "Data smartwatch pasien",
          "Hasil trial klinis obat diabetes"]}
        correct={1}
        explanation="Benar: klaim unggul di cakupan populasi + biaya terstandar INA-CBG. EHR satu RS tidak mewakili provinsi; trial terlalu terseleksi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Satu pasien: 5 kunjungan EHR, 2 episode klaim. “Biaya rata-rata per pasien” yang benar memakai pembagi…"
        options={["5 (kunjungan)",
          "2 (episode)",
          "1 (pasien)",
          "Tergantung definisi grain yang dilaporkan"]}
        correct={3}
        explanation="Benar: tidak ada jawaban tunggal yang selalu benar — ketiganya valid untuk pertanyaan berbeda. Yang wajib: tulis grain yang kamu pakai. Salah grain = salah cerita."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Lowongan Health Data Scientist meminta PySpark. Alasan paling masuk akal?"
        options={["Spark membuat visualisasi lebih cantik",
          "Data klaim/EHR nasional berukuran ratusan GB–TB, melebihi kapasitas pandas di satu mesin",
          "Spark wajib untuk semua analisis kesehatan",
          "Python biasa dilarang di RS"]}
        correct={1}
        explanation="Benar: ini soal skala. Skill intinya berpikir terdistribusi (partisi, agregasi). Untuk data kecil, pandas tetap lebih praktis — jangan pakai meriam untuk nyamuk."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Riskesdas menemukan prevalensi diabetes 10,9% sementara klaim BPJS 4,2%. Interpretasi tepat?"
        options={["Data klaim salah input",
          "Riskesdas melebih-lebihkan",
          "Klaim hanya menangkap yang terdiagnosis & berobat; selisihnya = kesenjangan diagnosis",
          "Keduanya tidak bisa dipakai"]}
        correct={2}
        explanation="Benar: keduanya benar untuk tujuannya masing-masing. Selisihnya bukan error — melainkan temuan kebijakan: banyak kasus belum terjaring layanan."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Enam sumber utama: <strong>EHR, klaim, registri, surveilans, trial, wearable/imaging</strong> — masing-masing lahir untuk tujuan berbeda.</li>
          <li><strong>Tujuan asli pengumpulan</strong> memprediksi kolom mana yang bisa dipercaya.</li>
          <li><strong>Klaim = utilisasi layanan</strong>, bukan potret kesehatan populasi.</li>
          <li>Kelengkapan field mengikuti <strong>insentif pengisi</strong>, bukan kebutuhan analis.</li>
          <li>Big data mengecilkan sampling error, <strong>tidak</strong> menghilangkan bias sistematis.</li>
          <li>Tulis <strong>grain</strong> dalam satu kalimat sebelum melaporkan angka apapun.</li>
          <li>Skala nasional butuh pola pikir <strong>terdistribusi</strong> (Spark); data kecil tetap pakai pandas.</li>
          <li>Setiap lesson berikutnya mengasumsikan kamu paham peta sumber data ini — tidak perlu dibaca ulang, cukup ingat trade-off-nya.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/" className="btn btn-secondary btn-sm">← Daftar Materi</Link>
        <Link href="/learn/hd2-standar" className="btn btn-primary btn-sm">HD2 →</Link>
      </div>
    </div>
  );
}
