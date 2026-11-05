"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd2StandarPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd2GranData = [{"x": ["ICD-10", "SNOMED CT", "Teks bebas dokter"], "y": [14000, 350000, 1000000], "type": "bar", "marker": {"color": ["#2a7de1", "#e8a838", "#94a3b8"]}, "text": ["14 rb", "350 rb+", "~tak hingga"], "textposition": "outside"}];
  const hd2GranDataLayout = {"xaxis": {"title": "Sistem"}, "yaxis": {"title": "Jumlah konsep", "type": "log"}, "showlegend": false};

  const lab1Code = "kamus = {'diabetes melitus': 'E11', 'dm tipe 2': 'E11', 'dm': 'E11?',\n         'tb paru': 'A15', 'tbc': 'A15', 'hipertensi': 'I10',\n         'darah tinggi': 'I10', 'pneumonia': 'J18.9'}\ndata = ['DM', 'diabetes melitus', 'kencing manis', 'TBC', 'tb paru',\n        'Hipertensi', 'darah tinggi', 'pneumonia', 'batuk pilek']\nok, ambigu, gagal = 0, 0, 0\nfor d in data:\n    kode = kamus.get(d.lower(), None)\n    if kode is None:\n        gagal += 1; status = 'GAGAL -> butuh manusia'\n    elif kode.endswith('?'):\n        ambigu += 1; status = f'AMBIGU ({kode})'\n    else:\n        ok += 1; status = f'OK ({kode})'\n    print(f'{d:<18} {status}')\nprint()\nprint(f'OK {ok}/{len(data)}, ambigu {ambigu}, gagal {gagal}')\nprint('Pelajaran: kamus tidak menyelesaikan ambiguitas singkatan.')\n";

  const lab2Code = "obs = {'resourceType': 'Observation',\n       'code': {'coding': [{'system': 'http://loinc.org',\n                             'code': '4548-4',\n                             'display': 'HbA1c'}]},\n       'subject': {'reference': 'Patient/123'},\n       'valueQuantity': {'value': 8.2, 'unit': '%'}}\nSTANDAR = {'http://loinc.org', 'http://snomed.info/sct',\n           'http://hl7.org/fhir/sid/icd-10'}\ndef validasi(o):\n    codings = o['code']['coding']\n    sistem = {c['system'] for c in codings}\n    if not sistem & STANDAR:\n        return 'GAGAL: tidak memakai terminologi standar'\n    if o['valueQuantity']['value'] <= 0:\n        return 'GAGAL: nilai tidak masuk akal'\n    return 'LOLOS: sintaks + terminologi standar'\nprint(validasi(obs))\nobs['code']['coding'][0]['system'] = 'kode-lokal-rs'\nprint(validasi(obs), '<- ubah system, langsung gagal')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD2 &mdash; Health Data Scientist</span>
        <h1 className="display-title">ICD, SNOMED, FHIR:<br />Bahasa Bersama Data Kesehatan</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: “DM” yang Berarti Tiga Hal</a></li>
          <li><a href="#icd">ICD — Si Kode Tagihan Sejuta Umat</a></li>
          <li><a href="#snomed">SNOMED CT — Si Perfeksionis Klinis</a></li>
          <li><a href="#loinc">LOINC, RxNorm &amp; OMOP</a></li>
          <li><a href="#fhir">HL7 FHIR &amp; SATUSEHAT</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Mapping Kode Berantakan</a></li>
          <li><a href="#lab2">🔬 Lab 2: Simulasi Pertukaran FHIR</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Kamus Mapping Kode Lokal</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Kode sebagai Kontrak Sosial</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: SATUSEHAT</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Ketika Standar Menjadi Senjata Dua Mata</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Membedakan peran <strong>ICD, SNOMED CT, LOINC, RxNorm</strong>: apa yang dikodekan masing-masing dan kapan dipakai.</li>
          <li>Menjelaskan konsep <strong>interoperabilitas</strong> (FHIR/SATUSEHAT) dan <strong>common data model</strong> (OMOP CDM) dengan bahasa sendiri.</li>
          <li>Melakukan <strong>mapping kode lokal ke standar</strong> dan mengidentifikasi kode yang ambigu.</li>
          <li>Menilai risiko analisis yang memakai kode billing (ICD) sebagai proksi diagnosis klinis.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: “DM” yang Berarti Tiga Hal</h2>
      <div className="story">
        <p>Di RS A, kolom diagnosis menulis &ldquo;DM&rdquo;. Di RS B, menulis &ldquo;Diabetes Mellitus&rdquo;. Di puskesmas C, menulis &ldquo;kencing manis&rdquo;. Analis junior menggabungkan tiga file dan menghitung pasien diabetes — hasilnya kacau: ada yang kehitung tiga kali, ada yang lolos. Padahal ketiganya maksudnya sama: <strong>E11</strong> (ICD-10: diabetes tipe 2).</p>
      <p>Standar kode kesehatan lahir untuk masalah sepele tapi mematikan ini: <strong>manusia menulis dengan bahasa, mesin butuh kode</strong>. Lesson ini memetakan siapa melakukan apa — karena memakai kode yang salah untuk pertanyaan yang salah adalah sumber bias paling sunyi di analitik kesehatan.</p>
      <p><strong>Twist-nya:</strong> ketiga penulis itu <em>tidak ada yang salah</em> — “DM”, “Diabetes Mellitus”, dan “kencing manis” semuanya benar secara klinis. Yang salah adalah analisnya: ia mengira <strong>standarisasi penulisan = standarisasi makna</strong>. Padahal standar kode kesehatan (ICD, SNOMED, LOINC) tidak menyamakan bahasa manusia — ia memberi tiap makna sebuah <em>nomor rumah</em> agar mesin bisa membedakan “DM si diabetes” dari “DM si dorsum manus”. Lesson ini tentang peta nomor rumah itu.</p>
      </div>

      <h2 id="icd">ICD — Si Kode Tagihan Sejuta Umat</h2>
      <p><strong>Definisi.</strong> <strong>ICD (International Classification of Diseases)</strong>, kini ICD-10 (Indonesia) dan ICD-11 (WHO), mengklasifikasikan diagnosis untuk statistik dan billing. Satu kode = satu kategori penyakit, mis. E11 = diabetes melitus tipe 2, A15 = TB paru terkonfirmasi.</p>
      <details className="worked">
        <summary>📐 Contoh: membaca kode ICD-10</summary>
        <p>Kode <strong>J18.9</strong> (pneumonia, unspecified):<br />Huruf <strong>J</strong> = bab penyakit pernapasan; <strong>18</strong> = pneumonia; <strong>.9</strong> = tidak dirinci.<br />Untuk analisis &ldquo;pneumonia&rdquo;, kamu agregasi J12–J18. Tapi J18.9 (&ldquo;unspecified&rdquo;) bisa jadi dokter tidak yakin — memakai semua J18.9 sebagai &ldquo;pasti pneumonia&rdquo; berisiko salah label.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> ICD itu seperti kode pos: cukup untuk mengantar surat (tagihan) ke kota yang benar, tapi tidak tahu isi rumahnya. Ia menjawab <em>kategori penyakit untuk dibayar</em> — bukan keparahan, bukan kepastian diagnosis.</p>
      <p><strong>Kapan memakai:</strong> Analisis utilisasi/biaya, statistik morbiditas nasional, grouping INA-CBG. Waspada saat dipakai sebagai label diagnosis pasti untuk model klinis.</p>
      <div className="callout callout-warning"><strong>Jebakan:</strong> kode ICD dipilih untuk <strong>maksimalkan klaim yang disetujui</strong>, bukan akurasi klinis. Fenomena &ldquo;upcoding&rdquo; (memilih kode berbayar lebih tinggi) nyata di sistem pembayaran prospektif seperti INA-CBG. Tren kenaikan suatu diagnosis di data klaim bisa berarti perubahan coding, bukan wabah.</div>

      <h2 id="snomed">SNOMED CT — Si Perfeksionis Klinis</h2>
      <p><strong>Definisi.</strong> <strong>SNOMED CT</strong> adalah terminologi klinis dengan 350.000+ konsep yang saling terhubung (ontologi): bukan sekadar kode, tapi jaringan makna — mis. &ldquo;diabetes tipe 2&rdquo; terkait dengan &ldquo;gangguan metabolik&rdquo;, &ldquo;pankreas&rdquo;, dan obat-obatnya.</p>
      <p><strong>Kepribadian konsep ini:</strong> Kalau ICD itu kode pos, SNOMED itu peta lengkap dengan setiap gang dan nomor rumah. Ia menjawab <em>apa yang sebenarnya terjadi secara klinis</em> — dengan harga: kompleksitas implementasi yang jauh lebih tinggi.</p>
      <p><strong>Kapan memakai:</strong> Fenotipe presisi untuk riset/model (mis. definisi kohort &ldquo;gagal jantung dengan fraksi ejeksi rendah&rdquo;), dokumentasi klinis terstruktur. Di Indonesia adopsinya masih bertahap — kenali, tapi jangan asumsikan datamu memakainya.</p>

      <PlotlyChart
        data={hd2GranData}
        title="Granularitas: Jumlah Konsep per Sistem (skala logaritmik konseptual)"
        layout={hd2GranDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Sumbu vertikal memakai skala logaritmik: tiap garis = kelipatan 10x. Bandingkan tinggi batang — makin tinggi, makin rinci kosakatanya.</p>
        <p><strong>Interpretasi:</strong> Lompatan granularitasnya masif: ICD 14 ribu kategori vs SNOMED 350 ribu konsep vs teks bebas yang tak terbatas. Trade-off-nya: makin rinci makin ekspresif, tapi makin sulit diisi konsisten oleh dokter sibuk. Inilah kenapa ICD tetap merajai data operasional.</p>
      </div>

      <h2 id="loinc">LOINC, RxNorm &amp; OMOP — Spesialis dan Penerjemah</h2>
      <p><strong>Definisi.</strong> <strong>LOINC</strong> menstandarkan nama tes lab dan pengukuran (mis. HbA1c punya satu kode LOINC walau tiap RS menyebutnya beda). <strong>RxNorm</strong> menstandarkan nama obat. <strong>OMOP CDM</strong> (OHDSI) adalah <em>common data model</em>: skema database standar agar data banyak RS bisa dianalisis dengan query yang sama.</p>
      <p><strong>Kepribadian konsep ini:</strong> LOINC/RxNorm adalah kamus untuk hal yang paling berantakan di RS: nama tes dan obat lokal. OMOP adalah penerjemah PBB-nya: sekali datamu diterjemahkan ke OMOP, analis di negara lain bisa menjalankan analisismu tanpa mengubah query.</p>
      <p><strong>Kapan memakai:</strong> Harmonisasi multi-sumber: gabung data 5 RS dengan nama lab berbeda → map ke LOINC; riset kolaboratif multi-situs → OMOP CDM.</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">Nama lokal RS          -&gt;  Standar
----------------------------------------
Gula darah puasa       -&gt;  LOINC 1558-6 (glukosa puasa)
HbA1c                  -&gt;  LOINC 4548-4 (HbA1c)
Metformin 500mg       -&gt;  RxNorm 6809 (metformin)
DM tipe 2              -&gt;  ICD-10 E11 / SNOMED 44054006</pre>

      <h2 id="fhir">HL7 FHIR &amp; SATUSEHAT — Tukang Pos Antar Sistem</h2>
      <p><strong>Definisi.</strong> <strong>HL7 FHIR</strong> adalah standar pertukaran data kesehatan berbasis API modern (REST + JSON): data dipecah jadi &ldquo;resources&rdquo; (Patient, Observation, Medication). <strong>SATUSEHAT</strong> adalah platform Indonesia yang mewajibkan faskes bertukar data via FHIR.</p>
      <Tex math={String.raw`\text{Interoperabilitas} = \text{standar sintaks (FHIR)} + \text{standar makna (terminologi)}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{standar sintaks}`} />: format pertukaran: FHIR resources, JSON</li>
          <li><Tex math={String.raw`\text{standar makna}`} />: kode yang dipakai di dalamnya: ICD/SNOMED/LOINC</li>
      </ul>
      <p><strong>Interpretasi:</strong> FHIR tanpa terminologi standar = amplop rapi berisi surat bahasa alien: terkirim, tapi tidak dimengerti. Interoperabilitas butuh keduanya.</p>
      <p><strong>Kepribadian konsep ini:</strong> FHIR itu seperti protokol pos modern: amplop standar, alamat standar, bisa dilacak. Ia tidak peduli isi suratnya bahasa apa — itu urusan ICD/SNOMED. Jangan tertukar antara &ldquo;datanya sampai&rdquo; dengan &ldquo;datanya bermakna sama&rdquo;.</p>
      <p><strong>Kapan memakai:</strong> Integrasi antar sistem (RS ↔ puskesmas → SATUSEHAT), aplikasi yang butuh data pasien real-time. Untuk analis: pahami strukturnya agar bisa query API, bukan sekadar file.</p>
      <div className="code-header"><span className="code-lang">json</span></div><pre className="codebox">&#123;
  "resourceType": "Observation",
  "code": &#123; "coding": [&#123; "system": "LOINC", "code": "4548-4" &#125;] &#125;,
  "subject": &#123; "reference": "Patient/123" &#125;,
  "valueQuantity": &#123; "value": 8.2, "unit": "%" &#125;
&#125;</pre>

      <h2 id="pendalaman">🔍 Pendalaman: Ketika Standar Menjadi Senjata Dua Mata</h2>
      <details className="worked">
        <summary>📐 Worked example: membedakan “kode billing” vs “kode kebenaran klinis” (klik untuk buka)</summary>
        <p>Kamu diberi dua file klaim RS untuk studi <strong>kejadian stroke</strong>: File 2022 memakai ICD-10 I63 (infark serebral), file 2023 tiba-tiba tren I63 <strong>naik 40%</strong>. Apakah ini wabah stroke?</p>
        <p><strong>Langkah 1 — Cek konteks coding, bukan pasiennya.</strong> Tanya ke bagian rekam medis: ternyata awal 2023 RS mengadakan <strong>pelatihan coding</strong> + insentif kelengkapan diagnosis sekunder. Pelatihan yang sama tidak mengubah jumlah pasien stroke yang datang.</p>
        <p><strong>Langkah 2 — Cari sidik jarinya.</strong> Bandingkan tren I63 dengan data independen yang tidak terpengaruh coding: <strong>kematian stroke</strong> di RS itu (dari catatan kematian) dan <strong>konsumsi alteplase</strong> (obat stroke, dari farmasi). Keduanya datar. Hanya I63 yang naik.</p>
        <p><strong>Langkah 3 — Simpulkan.</strong> Kenaikan 40% adalah <strong>artefak dokumentasi</strong>, bukan epidemiologi. Melaporkannya sebagai “lonjakan stroke” ke Dinkes akan memicu respons kesehatan masyarakat untuk masalah yang tidak ada.</p>
        <p><strong>Langkah 4 — Perbaiki desain.</strong> Untuk studi tren jangka panjang: definisikan kasus dengan <strong>aturan gabungan</strong> (I63 + bukti pendukung: CT scan kepala atau alteplase), dan selalu plot <strong>garis waktu perubahan kebijakan coding</strong> di samping tren penyakitmu.</p>
        <p><strong>Pelajaran:</strong> kode ICD adalah cermin billing yang memantulkan klinis — tapi cerminnya bisa diganti tanpa pasiennya berubah. Analis yang baik selalu mengecek cerminnya dulu.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — granularitas adalah keputusan analisis, bukan fakta alam:</strong> ICD-10 punya ~14.000 kode, ICD-11 ~55.000, SNOMED CT 350.000+ konsep. Makin granular, makin presisi — tapi makin jarang tiap kode muncul, makin berisik statistiknya. Memilih level agregasi (3-karakter vs 4-karakter ICD, “kelompok” vs “spesifik”) adalah keputusan <em>trade-off bias-varians</em> yang harus bisa kamu bela di depan reviewer: terlalu kasar = mencampur penyakit berbeda; terlalu halus = tiap sel tabel kosong melompong.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — INA-CBG dan “kode yang membayar”:</strong> Sistem pembayaran INA-CBG BPJS mengelompokkan ribuan kode ICD menjadi ~1.000 grup tarif. Konsekuensinya nyata: dua diagnosis yang <em>klinisnya beda jauh</em> bisa jatuh di grup tarif yang sama (tidak ada insentif membedakan), sementara diagnosis yang <em>klinisnya mirip</em> bisa dipisah grup tarif berbeda (ada insentif memilih yang mahal — “upcoding”). Peneliti Indonesia yang memakai data klaim BPJS <strong>wajib</strong> memetakan dulu struktur grup INA-CBG untuk penyakit yang diteliti — karena pola “epidemi” tertentu di data klaim ternyata peta tarif, bukan peta penyakit.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Kode adalah Kontrak Sosial (yang Bisa Kedaluwarsa)</h2>
      <p>Standar kode sering diajarkan sebagai “kamus”. Analogi yang lebih jujur: <strong>kontrak sosial</strong> — kesepakatan ribuan pihak tentang “kita sepakat menyebut X sebagai Y”. Dan seperti kontrak, ia bisa dinegosiasi ulang, dilanggar, dan kedaluwarsa.</p>
      <p><strong>Migrasi versi mematahkan tren.</strong> Indonesia memakai ICD-10; WHO mendorong ICD-11 (55.000 kode, struktur beda total). Saat migrasi terjadi, <strong>time series penyakit patah</strong>: kode lama tidak petakan 1-ke-1 ke kode baru. Analis yang membandingkan “tren 2015–2030” tanpa menjembatani versi sedang membandingkan apel dan arsitektur. Praktik benar: <strong>dual-coding</strong> selama periode transisi (kode ganda ICD-10 + ICD-11) + tabel jembatan terdokumentasi + <em>break marker</em> di setiap grafik tren (“metodologi berubah di sini”).</p>
      <p><strong>Tiga level makna — jangan campur.</strong> Level 1 <strong>kode</strong> (E11 = label untuk billing). Level 2 <strong>konsep</strong> (diabetes tipe 2 sebagai entitas klinis di SNOMED CT, dengan relasi ke pankreas, insulin, komplikasi). Level 3 <strong>fenotipe</strong> (aturan komputabel “pasien diabetes untuk studi ini” — lihat HD11). Kesalahan klasik: memakai level 1 untuk pertanyaan level 3 (“ambil semua E11 sebagai kohort diabetes”) — padahal E11 mencakup <em>rule-out</em>, salah kode, dan kasus historis. <strong>Naiklah minimal satu level</strong> dari kode mentah sebelum menjawab pertanyaan klinis.</p>
      <p><strong>Standar yang tidak dipakai = tidak ada standar.</strong> SNOMED CT hebat di atas kertas; jika RS-mu tidak mengimplementasikannya, datamu tidak memilikinya. Analis pragmatis: <strong>desain analisis untuk standar yang <em>benar-benar ada</em> di datamu</strong> (biasanya ICD-10 + teks bebas), sambil membangun jembatan ke standar masa depan (mapping lokal → SNOMED). Jangan menulis query SNOMED untuk database yang tidak punya kolomnya.</p>
      <div className="callout">
        <p><strong>Prinsip 10 detik:</strong> sebelum memakai kode apapun, jawab: <strong>versi berapa? siapa yang menulis? untuk tujuan apa?</strong> — tiga jawaban ini menentukan apakah kodemu adalah data atau dongeng.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Kalau datanya sudah pakai ICD-10 berarti diagnosisnya pasti benar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ICD-10 di data operasional dioptimasi untuk billing. Kode bisa dipilih agar klaim lolos (upcoding), diagnosis kerja yang belum pasti tetap diberi kode, dan &ldquo;unspecified&rdquo; (.9) sering berarti ketidakpastian. Untuk label model klinis, validasi silang dengan data lab/obat (lihat HD11 fenotipe).</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;FHIR/SATUSEHAT menyelesaikan masalah kualitas data&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> FHIR menyelesaikan masalah <em>pertukaran</em> (sintaks), bukan masalah <em>makna dan kelengkapan</em>. Data yang terkirim rapi via FHIR tetap bisa salah kode, tidak lengkap, atau tidak sebanding antar faskes. Interoperabilitas ≠ kualitas.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;SNOMED CT selalu lebih baik dari ICD, jadi semua harus pakai SNOMED&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Lebih rinci ≠ lebih baik untuk semua keperluan. SNOMED butuh dokumentasi klinis yang disiplin; di faskes sibuk, memaksanya menghasilkan kode asal-asalan yang lebih buruk dari ICD sederhana yang diisi benar. Pilih sesuai kapasitas pengisi.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membangun Kamus Mapping Kode Lokal</h2>
      <details className="worked">
        <summary>📐 Worked example: dari 500 tulisan dokter ke ICD-10 yang rapi (klik untuk buka)</summary>
        <p>RSUD ingin analisis tren pneumonia 5 tahun. Data: 500 tulisan diagnosis bebas dari IGD (“pneumonia”, “pnemonia” [typo], “pnu?”, “ISPA berat + infiltrat”, “bronchopneumonia”, …). Target: mapping ke ICD-10 J12–J18.</p>
        <p><strong>Langkah 1 — Normalisasi teks.</strong> Lowercase, hapus tanda baca, betulkan typo umum dengan kamus (“pnemonia” → “pneumonia”). Dari 500 tulisan unik → 120 bentuk unik. <strong>Jangan</strong> langsung regex: “pnu?” butuh keputusan manusia.</p>
        <p><strong>Langkah 2 — Aturan mapping berlapis.</strong> Lapis 1 (pasti): “bronchopneumonia” → J18.0. Lapis 2 (butuh konteks): “pneumonia” saja → J18.9 (unspecified) — <strong>catat</strong> bahwa ini “unspecified”, jangan perlakukan setara J18.0. Lapis 3 (ragu): “pnu?”, “ISPA berat + infiltrat” → <strong>flag untuk review dokter</strong>, bukan ditebak. Hasil: 78% otomatis, 22% review manual.</p>
        <p><strong>Langkah 3 — Ukur kualitas mapping.</strong> 100 sampel direview 2 dokter independen: kesepakatan mapping 91%, Cohen's kappa 0,83 (sangat baik). 9% tidak sepakat → analisis akar: singkatan ambigu (“TB” = tuberkulosis atau tulang belakang?). Tambahkan aturan konteks: “TB” di poli paru ≠ “TB” di poli ortopedi.</p>
        <p><strong>Langkah 4 — Dokumentasikan sebagai kamus versi.</strong> Simpan: teks asli → kode → aturan → tanggal → versi ICD. <strong>Kenapa versi penting:</strong> ICD-10 2019 vs 2024 punya revisi; tren 5 tahun yang “naik” bisa jadi artefak pembaruan kamus, bukan penyakit. Selalu catat <em>versi kamus</em> di samping <em>versi data</em>.</p>
        <p><strong>Langkah 5 — Aturan “unspecified”.</strong> J18.9 (“unspecified”) = 40% dari kasusmu. Keputusan analisis: (a) laporkan terpisah (“pneumonia unspecified”), (b) jangan gabung diam-diam ke “pneumonia pasti” — karena unspecified berkorelasi dengan <em>kualitas dokumentasi</em>, bukan keparahan. Analis yang menggabungnya sedang mencampur <strong>ketidakpastian dokter</strong> ke dalam <strong>prevalensi penyakit</strong>.</p>
        <p><strong>Pelajaran:</strong> mapping kode adalah <strong>pekerjaan 80/20</strong>: 80% mudah, 20% menentukan kualitas. 20% itulah yang membedakan analis dari script.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap kode “unspecified” (.9) adalah <strong>pesan dari dokter masa lalu</strong>: “saya tidak yakin / tidak sempat merinci”. Bacalah sebagai data tentang <em>proses dokumentasi</em> — tren kenaikan kode unspecified sering berarti <strong>beban kerja naik</strong> atau <strong>pelatihan coding kurang</strong>, bukan penyakit berubah.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Saat menerima dataset baru, hal pertama: <strong>identifikasi sistem kodenya</strong> (ICD-10? lokal? campuran?) sebelum menghitung apapun. Satu kolom &ldquo;diagnosis&rdquo; bisa berisi tiga sistem kode sekaligus.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bedakan <strong>kode billing vs kode klinis</strong> di kepalamu setiap saat. Kalau analisismu soal uang → ICD cukup. Kalau soal kebenaran medis → butuh validasi berlapis.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk proyek multi-RS, tanyakan: &ldquo;apakah ada <strong>mapping ke OMOP/LOINC</strong>?&rdquo; Kalau belum ada, alokasikan 30–50% waktu proyek untuk harmonisasi — ini normal, bukan kegagalan perencanaan.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Mapping Kode Diagnosis Berantakan</h2>
      <p>Diberikan daftar diagnosis teks bebas dari tiga faskes, petakan ke ICD-10 dengan kamus sederhana. Lihat berapa yang ambigu dan butuh adjudikasi manusia.</p>
      <PyodideLab
        title="🔬 Lab 1: Mapping Kode Diagnosis Berantakan"
        hint="Tambahkan varian tulisanmu sendiri (mis. 'kencing manis', 'DM2'). Hitung: berapa persen yang tidak ke-mapping? Itulah biaya tidak adanya standar di titik input."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Simulasi Resource FHIR Observation</h2>
      <p>Bangun dict JSON ala FHIR Observation untuk hasil HbA1c, lalu validasi: apakah code memakai sistem standar? Ubah system jadi teks bebas dan lihat validasi gagal.</p>
      <PyodideLab
        title="🔬 Lab 2: Simulasi Resource FHIR Observation"
        hint="Ganti 'system': 'http://loinc.org' menjadi 'system': 'lokal-rs'. Fungsi validasi harus menolaknya — itulah beda sintaks valid vs makna standar."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: SATUSEHAT — Tukang Pos Nasional</h2>
      <p>Platform <strong>SATUSEHAT</strong> Kemenkes adalah implementasi HL7 FHIR terbesar di Indonesia: ratusan faskes mengirim resource FHIR (Patient, Encounter, Observation, Medication, dsb.) ke platform nasional. Bagi analis, ini pertama kalinya data kesehatan Indonesia punya <strong>format antar-sistem yang seragam</strong>.</p>
      <p><strong>Apa yang berubah untuk analis:</strong> (1) <strong>Join antar-faskes jadi mungkin</strong> — pasien yang berobat di puskesmas A lalu dirujuk ke RS B kini bisa ditautkan via NIK (sebelumnya: dua dunia terpisah). (2) <strong>Definisi field konsisten</strong> — “tekanan darah” selalu Observation dengan LOINC 85354-9, bukan “TD”, “tensi”, atau kolom misterius. (3) <strong>Near real-time</strong> — data mengalir saat pelayanan terjadi, bukan rekap bulanan — membuka pintu surveilans real-time (lihat HD16).</p>
      <p><strong>Apa yang <em>tidak</em> berubah (jebakan optimisme):</strong> (1) <strong>Kualitas isi tetap mengikuti pengisi</strong> — FHIR menstandarkan <em>amplop</em>, bukan <em>suratnya</em>: diagnosis yang salah kode tetap salah, hanya kini salah secara terstandar. (2) <strong>Cakupan belum semesta</strong> — faskes yang belum terintegrasi = populasi yang hilang (bias seleksi geografis: daerah 3T tertinggal). (3) <strong>Variasi profil lokal</strong> — tiap daerah/RS bisa memakai “FHIR rasa lokal” (ekstensi berbeda) — analis tetap butuh kamus mapping (lihat studi kasus di atas).</p>
      <p><strong>Skill yang dibutuhkan:</strong> membaca resource FHIR (JSON), menulis query ke FHIR server, dan — yang paling langka — <strong>memahami profil Indonesia</strong> (SATUSEHAT memakai terminologi dan value set spesifik Indonesia). Analis yang menguasai ini adalah <strong>jembatan</strong> antara tim IT (yang mengirim FHIR) dan tim kebijakan (yang butuh insight) — posisi dengan suplai sangat sedikit.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap gelombang standardisasi (dulu ICD, kini FHIR) <strong>tidak menghapus</strong> masalah kualitas data — ia <strong>memindahkannya</strong> ke level yang lebih tinggi. Dulu masalahnya “format beda”; kini masalahnya “makna beda dalam format sama”. Analis yang hanya bisa parsing JSON akan kalah dari analis yang paham <em>semantik klinis</em> di balik JSON itu.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Analisis biaya/utilisasi → ICD-10 + INA-CBG</h3>
        <p><strong>Kondisi:</strong> Pertanyaan tentang uang dan volume layanan.</p>
        <p><strong>Kenapa:</strong> ICD adalah bahasa billing; grouping INA-CBG sudah terstandar nasional.</p>
        <p><strong>Contoh nyata:</strong> Rata-rata tarif klaim stroke per kelas RS.</p>
      </div>
      <div className="decision-card">
        <h3>2. Definisi kohort presisi → SNOMED CT + LOINC + RxNorm</h3>
        <p><strong>Kondisi:</strong> Pertanyaan klinis yang butuh kepastian: siapa benar-benar gagal jantung.</p>
        <p><strong>Kenapa:</strong> Butuh granularitas dan validasi silang antar domain (diagnosis + lab + obat).</p>
        <p><strong>Contoh nyata:</strong> Kohort “CKD stage 3”: eGFR (LOINC) + kode CKD, bukan sekadar ICD N18.</p>
      </div>
      <div className="decision-card">
        <h3>3. Gabung data multi-RS → OMOP CDM</h3>
        <p><strong>Kondisi:</strong> Banyak sumber, skema berbeda, analisis harus konsisten.</p>
        <p><strong>Kenapa:</strong> Sekali mapping ke OMOP, satu query jalan di semua situs (jaringan OHDSI).</p>
        <p><strong>Contoh nyata:</strong> Studi multi-RS: efek obat antihipertensi terhadap stroke.</p>
      </div>
      <div className="decision-card">
        <h3>4. Integrasi real-time antar sistem → FHIR / SATUSEHAT</h3>
        <p><strong>Kondisi:</strong> Data harus mengalir antar aplikasi/faskes, bukan file bulanan.</p>
        <p><strong>Kenapa:</strong> API standar, resources terdokumentasi, didukung regulasi nasional.</p>
        <p><strong>Contoh nyata:</strong> Aplikasi rujukan: puskesmas kirim ringkasan pasien ke RS via SATUSEHAT.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Identifikasi sistem kode dulu, hitung kemudian.</li>
          <li>ICD = bahasa uang; SNOMED = bahasa klinis.</li>
          <li>FHIR = amplop; terminologi = isi surat.</li>
          <li>Multi-situs? Tanya OMOP sebelum nulis query.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Tren TB “Naik” Setelah Pelatihan Coding</h2>
      <div className="callout">
        <p>Dinkes melaporkan: kasus TB (ICD A15–A19) di klaim naik <strong>40%</strong> dalam 6 bulan setelah pelatihan coding untuk petugas klaim. Media menulis “wabah TB”. Kamu diminta verifikasi sebelum anggaran darurat digelontorkan.</p>
      <p>Data yang kamu tarik: (a) klaim A15–A19 naik 40%; (b) <strong>resep OAT (obat anti-TB)</strong> di data farmasi naik hanya 5%; (c) <strong>hasil lab BTA positif</strong> di EHR naik 3%.</p>
        <p><strong>Pertanyaan:</strong> Apakah ini wabah TB? Apa penjelasan paling masuk akal dan apa rekomendasi aksimu?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Bukan wabah — ini artefak coding. Tiga sumber yang lebih dekat ke klinis (resep OAT, BTA positif) hampir datar, sementara kode billing melonjak tepat setelah pelatihan coding. Penjelasan: petugas kini memberi kode TB lebih agresif/lengkap (dulu mungkin terkode sebagai “batuk” atau ISPA). Rekomendasi: (1) batalkan narasi wabah; (2) tetapkan definisi kasus TB untuk surveilans berbasis BTA/resep, bukan klaim mentah; (3) catat periode pelatihan sebagai <em>breakpoint</em> di semua tren diagnosis ke depan. Pelajaran abadi: perubahan administratif meniru wabah di data klaim.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. E11 dalam ICD-10 adalah…"
        options={["Kode billing untuk diabetes tipe 2",
          "Kode LOINC untuk HbA1c",
          "Resource FHIR untuk observasi",
          "Konsep SNOMED untuk pankreas"]}
        correct={0}
        explanation="Benar: E11 = diabetes melitus tipe 2 di ICD-10. Ingat: ini kategori billing/statistik, bukan vonis klinis final."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Perbedaan utama SNOMED CT vs ICD?"
        options={["SNOMED untuk billing, ICD untuk klinis",
          "SNOMED adalah ontologi klinis 350rb+ konsep yang saling terkait; ICD adalah klasifikasi statistik ~14rb kategori",
          "Keduanya identik, hanya nama beda",
          "ICD lebih rinci dari SNOMED"]}
        correct={1}
        explanation="Benar. Analogi: ICD = kode pos, SNOMED = peta lengkap. Pilih sesuai kebutuhan: uang vs kebenaran klinis."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. LOINC dipakai untuk menstandarkan…"
        options={["Diagnosis penyakit",
          "Nama tes laboratorium dan pengukuran klinis",
          "Nama obat",
          "Struktur database"]}
        correct={1}
        explanation="Benar: LOINC = lab & observasi (HbA1c = 4548-4). Obat = RxNorm, diagnosis = ICD/SNOMED."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. FHIR menyelesaikan masalah interoperabilitas sintaks. Apa yang TIDAK diselesaikannya?"
        options={["Format pertukaran antar sistem",
          "Makna/kualitas kode di dalam resource (butuh terminologi standar)",
          "Pengiriman data real-time",
          "Struktur resource"]}
        correct={1}
        explanation="Benar: FHIR = amplop standar. Kalau isinya kode lokal ngawur, penerima tetap tidak paham. Butuh ICD/SNOMED/LOINC di dalamnya."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. OMOP CDM paling bernilai ketika…"
        options={["Satu RS menganalisis datanya sendiri",
          "Banyak RS dengan skema berbeda ingin menjalankan analisis yang sama",
          "Mengirim data via API",
          "Menghitung tarif INA-CBG"]}
        correct={1}
        explanation="Benar: OMOP = common data model untuk riset multi-situs (jaringan OHDSI). Sekali mapping, satu query untuk semua."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Klaim TB naik 40% pasca pelatihan coding, tapi resep OAT datar. Kesimpulan?"
        options={["Wabah TBConfirmed",
          "Artefak perubahan perilaku coding, bukan kenaikan kasus sebenarnya",
          "Resep OAT tidak relevan",
          "Pelatihan coding menyebabkan TB"]}
        correct={1}
        explanation="Benar: triangulasi dengan sumber yang lebih dekat ke klinis (resep, lab) membatalkan hipotesis wabah. Selalu curigai breakpoint administratif."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>ICD</strong>: klasifikasi diagnosis untuk billing/statistik (~14rb kategori).</li>
          <li><strong>SNOMED CT</strong>: ontologi klinis 350rb+ konsep untuk dokumentasi presisi.</li>
          <li><strong>LOINC</strong>: standar nama tes lab/pengukuran. <strong>RxNorm</strong>: standar nama obat.</li>
          <li><strong>FHIR/SATUSEHAT</strong>: standar <em>pertukaran</em> (sintaks); <strong>OMOP CDM</strong>: standar <em>model data</em> untuk riset multi-situs.</li>
          <li>Interoperabilitas = sintaks standar + makna standar. Satu saja tidak cukup.</li>
          <li>Kode billing (ICD) dioptimasi untuk pembayaran — validasi silang sebelum jadi label klinis.</li>
          <li>Perubahan administratif (pelatihan coding, ganti tarif) meniru wabah/tren di data klaim.</li>
          <li>Alokasikan 30–50% waktu proyek multi-RS untuk harmonisasi — itu normal.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd1-sistem-kesehatan" className="btn btn-secondary btn-sm">← HD1</Link>
        <Link href="/learn/hd3-epidemiologi" className="btn btn-primary btn-sm">HD3 →</Link>
      </div>
    </div>
  );
}
