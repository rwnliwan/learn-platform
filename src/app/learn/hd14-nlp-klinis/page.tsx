"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Hd14NlpKlinisPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const hd14NerData = [{"x": ["Penyakit", "Gejala", "Obat", "Dosis", "Negasi"], "y": [0.92, 0.85, 0.94, 0.88, 0.71], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["0,92", "0,85", "0,94", "0,88", "0,71"], "textposition": "outside"}];
  const hd14NerDataLayout = {"xaxis": {"title": "Tipe entitas"}, "yaxis": {"title": "F1", "range": [0, 1.05]}, "showlegend": false};

  const lab1Code = "gejala = ['nyeri dada', 'sesak napas', 'demam', 'batuk', 'mual']\nobat = ['aspirin', 'paracetamol', 'amoxicillin', 'metformin']\nnegasi = ['tidak ada', 'menyangkal', 'disangkal', 'tanpa']\nkalimat = [\n    'Pasien mengeluh nyeri dada sejak 3 hari, tidak ada sesak napas.',\n    'Diberi aspirin 80 mg dan paracetamol.',\n    'Menyangkal demam dan batuk.',\n]\nfor k in kalimat:\n    kl = k.lower()\n    ada_neg = any(n in kl for n in negasi)\n    print(f'Kalimat: {k}')\n    for g in gejala:\n        if g in kl:\n            print(f'  GEJALA: {g} -> {\"NEGATED (abaikan!)\" if ada_neg else \"present\"}')\n    for o in obat:\n        if o in kl:\n            print(f'  OBAT: {o}')\n    print()\nprint('Keterbatasan: negasi kalimat-level kasar; “tidak ada sesak, tapi demam”')\nprint('akan salah menandai demam sebagai negated. Butuh scope detection (ML).')";

  const lab2Code = "recall = 0.99       # NER de-id menemukan 99% identifier\nid_per_dok = 20     # rata-rata identifier per dokumen\nn_dok = 1000\nbocor_per_dok = id_per_dok * (1 - recall)\nprint(f'Recall NER de-id : {recall:.0%}')\nprint(f'Identifier bocor : {bocor_per_dok:.1f} per dokumen')\nprint(f'Total bocor      : {bocor_per_dok * n_dok:.0f} per {n_dok} dokumen')\nprint()\nprint('Satu nama bocor bisa cukup untuk re-identifikasi.')\nprint('-> De-id otomatis WAJIB + review sampel + perjanjian akses (DUA).')\nprint('-> Untuk LLM: de-id DULU sebelum kirim ke model manapun.')";

  const hd14RiskData = [{"x": ["Hapus nama saja", "+ generalisasi umur/tgl", "+ hapus quasi-id langka", "+ akses terbatas (DUA)"], "y": [45, 18, 6, 1], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["45%", "18%", "6%", "1%"], "textposition": "outside"}];
  const hd14RiskDataLayout = {"xaxis": {"title": "Lapisan"}, "yaxis": {"title": "Risiko sisa (%)", "range": [0, 55]}, "showlegend": false};

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">HD14 &mdash; Health Data Scientist</span>
        <h1 className="display-title">NER &amp; LLM Klinis:<br />Membaca Catatan Dokter</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: 80% Data yang Tak Terbaca</a></li>
          <li><a href="#ner">NER Klinis — Si Penambang Entitas</a></li>
          <li><a href="#deid">De-identifikasi — Si Penjaga Privasi</a></li>
          <li><a href="#llm">LLM untuk Data Klinis — Si Asisten Baru</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: NER Berbasis Aturan (Bahasa Indonesia)</a></li>
          <li><a href="#lab2">🔬 Lab 2: Evaluasi De-identifikasi</a></li>
          <li><a href="#studi-kasus">🔍 Studi Kasus: Kamus Singkatan RS</a></li>
          <li><a href="#wawasan">🧠 Wawasan: Bahasa Kedua Dokter</a></li>
          <li><a href="#indonesia">🇮🇩 Cerita Data: Bahasa Campur Indonesia</a></li>
          <li><a href="#pendalaman">🔍 Pendalaman: Tiga Jebakan NLP Klinis</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan pipeline <strong>NER klinis</strong>: tokenisasi, pengenalan entitas, normalisasi ke terminologi.</li>
          <li>Menerapkan teknik <strong>de-identifikasi</strong> (Safe Harbor) dan mengukur sisa risiko.</li>
          <li>Menilai kapan <strong>LLM/foundation model</strong> cocok untuk tugas klinis — dan batasannya (halusinasi, privasi).</li>
          <li>Merancang evaluasi ekstraksi: <strong>precision/recall/F1 per tipe entitas</strong>.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: 80% Data yang Tak Terbaca</h2>
      <div className="story">
        <p>Direktur RS bangga: “Kami punya 2 juta record EHR!” Analis membuka: 80% informasi klinis terkunci dalam <strong>catatan narasi bebas</strong> — “nyeri dada sejak 3 hari, menjalar ke lengan kiri…”, singkatan, typo, bahasa campuran. Kolom terstruktur hanya berisi kode billing. Semua pertanyaan menarik (“gejala awal pasien stroke”) jawabannya ada di teks yang tak terbaca mesin.</p>
      <p>NLP klinis adalah kunci gudang itu: mengubah narasi menjadi data terstruktur. Tapi kunci ini bergerigi — singkatan ambigu (“DM” = diabetes melitus atau dorsum manus?), negasi (“tidak ada nyeri dada”), dan privasi. Lesson ini mengajarkan membuka gudang tanpa membocorkan isinya.</p>
      <p><strong>Twist-nya:</strong> gudang data terbesar RS justru yang <strong>paling tidak bisa dibaca mesin</strong> — dan paling berbahaya bila dibaca sembarangan. “DM” bisa berarti diabetes melitus atau dorsum manus; “tidak ada nyeri dada” bisa berarti pasien sehat atau dokter lupa bertanya. NLP klinis bukan sekadar “mengubah teks jadi tabel” — ia adalah <strong>penerjemah bahasa dokter yang penuh kode, singkatan, dan keheningan yang bermakna</strong>. Salah terjemah satu negasi, dan pasien sehat bisa dilabeli sakit jantung.</p>
      </div>

      <h2 id="ner">NER Klinis — Si Penambang Entitas</h2>
      <p><strong>Definisi.</strong> <strong>NER (Named Entity Recognition)</strong>: menemukan dan mengklasifikasikan entitas di teks — penyakit, gejala, obat, dosis, prosedur. Dilanjut <strong>normalisasi</strong> (petakan ke ICD/SNOMED/RxNorm) dan <strong>deteksi negasi/ketidakpastian</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh: menambang satu kalimat</summary>
        <p>Kalimat: “Pasien mengeluh &lt;u&gt;nyeri dada&lt;/u&gt; sejak 3 hari, &lt;u&gt;tidak ada&lt;/u&gt; &lt;u&gt;sesak napas&lt;/u&gt;. Diberi &lt;u&gt;aspirin 80 mg&lt;/u&gt;.”<br /><strong>Entitas:</strong> nyeri dada (GEJALA, present), sesak napas (GEJALA, <strong>negated</strong> — jangan hitung sebagai gejala!), aspirin 80 mg (OBAT+dosis).<br /><strong>Normalisasi:</strong> nyeri dada → SNOMED 29857009; aspirin → RxNorm 1191.<br />Tanpa deteksi negasi, pasien ini salah tercatat “punya sesak napas” — error klasik NER naif.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> NER itu penambang yang memilah bijih (teks) menjadi emas (entitas) — tapi bijih klinis penuh jebakan: “tidak ada” membalik arti, singkatan bermuka dua, dan konteks menentukan segalanya.</p>
      <p><strong>Kapan memakai:</strong> Ekstraksi fenotipe dari narasi, pharmacovigilance (efek samping dari catatan), coding otomatis berbantuan.</p>

      <PlotlyChart
        data={hd14NerData}
        title="F1 NER per Tipe Entitas (ilustratif, Bahasa Indonesia)"
        layout={hd14NerDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = skor F1 ekstraksi per tipe entitas. Makin tinggi makin akurat.</p>
        <p><strong>Interpretasi:</strong> Obat dan penyakit (pola kaku) mudah — F1 0,9+. Negasi anjlok ke 0,71: bahasa negasi Indonesia bervariasi (“tidak ada”, “menyangkal”, “disangkal”). Inilah kenapa evaluasi HARUS per tipe entitas, bukan satu angka agregat — agregat menyembunyikan kelemahan fatal.</p>
      </div>

      <h2 id="deid">De-identifikasi — Si Penjaga Privasi</h2>
      <p><strong>Definisi.</strong> <strong>De-identifikasi</strong>: menghapus/menyamarkan 18 identifier HIPAA Safe Harbor (nama, tanggal lahir, alamat, NIK, dsb.) agar teks bisa dipakai riset. Di Indonesia: padankan dengan <strong>UU PDP</strong>.</p>
      <Tex math={String.raw`\text{Risiko} \approx \frac{1}{\text{ukuran kelompok anonimitas}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{ukuran kelompok anonimitas}`} />: jumlah orang dengan kombinasi quasi-identifier sama (k-anonymity, lihat HD18)</li>
      </ul>
      <p><strong>Interpretasi:</strong> Rumus intuisi: bila kombinasi “laki-laki, 45 th, kecamatan X, TB” hanya dimiliki 1 orang, ia teridentifikasi walau nama dihapus. De-identifikasi teks = NER terbalik: temukan identifier, lalu hapus/generalisasi.</p>
      <details className="worked">
        <summary>📐 Contoh: de-identifikasi satu kalimat</summary>
        <p>Asli: “Tn. Budi Santoso, 45 th, Jl. Mawar 10 Makassar, dirawat 12 Jan 2026 karena TB.”<br />De-id: “Tn. [NAMA], [45-50] th, [KOTA], dirawat [Jan 2026] karena TB.”<br />Nama → hapus; umur → rentang; alamat detail → kota; tanggal → bulan.<br /><strong>Trade-off:</strong> makin agresif makin aman tapi makin merusak utilitas riset (tanggal presisi hilang → analisis wabah terganggu).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> De-identifikasi itu sensor film: memblur wajah (nama) tapi cerita (klinis) tetap bisa diikuti. Blur terlalu tebal = film tidak bisa ditonton; terlalu tipis = wajah dikenali.</p>
      <p><strong>Kapan memakai:</strong> Sebelum teks klinis keluar dari RS untuk riset/analitik. Wajib: evaluasi sisa risiko + perjanjian penggunaan data (DUA).</p>
      <div className="callout callout-warning"><strong>LLM + data klinis = risiko privasi ganda:</strong> (1) prompt berisi data pasien bisa tersimpan di vendor; (2) model bisa menghafal dan membocorkan training data. Jangan kirim teks teridentifikasi ke API publik — gunakan deployment on-premise/privat atau de-identifikasi dulu.</div>

      <h2 id="llm">LLM untuk Data Klinis — Si Asisten Baru (yang Kadang Ngawur)</h2>
      <p><strong>Definisi.</strong> <strong>LLM/foundation model klinis</strong> (BioClinicalBERT, Med-PaLM, dsb.): model besar yang bisa ekstraksi, ringkasan, dan tanya-jawab dari teks klinis dengan sedikit/no training data — dengan risiko <strong>halusinasi</strong>.</p>
      <details className="worked">
        <summary>📐 Contoh: evaluasi LLM untuk ringkasan pulang</summary>
        <p>100 ringkasan LLM dinilai dokter: 85% akurat-lengkap, 10% ada <strong>halusinasi</strong> (alergi yang tidak ada di chart!), 5% menghilangkan info kritis.<br />Keputusan: deploy sebagai <strong>draf untuk dokter</strong> (hemat 40% waktu), BUKAN dokumen final otomatis.<br />Metrik yang benar: bukan BLEU/ROUGE semata, tapi <strong>factuality</strong> dinilai klinisi + tingkat halusinasi per 100 ringkasan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> LLM itu residen super-cepat yang membaca 1.000 chart per menit — tapi kadang mengarang temuan dengan percaya diri. Ia asisten, bukan dokter penanggung jawab: semua outputnya butuh verifikasi untuk keputusan klinis.</p>
      <p><strong>Kapan memakai:</strong> Cocok: ringkasan chart, ekstraksi awal untuk review manusia, coding berbantuan, tanya-jawab pengetahuan. JANGAN: diagnosis otonom, keputusan terapi tanpa verifikasi, memproses data teridentifikasi di API publik.</p>
      <div className="callout"><strong>Pola aman memakai LLM klinis:</strong> (1) de-identifikasi dulu; (2) retrieval-augmented (RAG) dengan sumber terkontrol untuk tanya-jawab; (3) human-in-the-loop untuk output yang berdampak ke pasien; (4) ukur halusinasi secara berkala, bukan sekali.</div>

      <h2 id="pendalaman">🔍 Pendalaman: Tiga Jebakan NLP Klinis</h2>
      <details className="worked">
        <summary>📐 Worked example: negasi &amp; ambiguitas dalam satu kalimat (klik untuk buka)</summary>
        <p>Catatan dokter: <em>“Nyeri dada sejak 3 hari, menjalar ke lengan kiri. Tidak ada keringat dingin. DM (+). Rujuk jantung?”</em></p>
        <p><strong>Langkah 1 — Ekstraksi entitas (NER).</strong> Kandidat: “nyeri dada” (gejala), “3 hari” (durasi), “lengan kiri” (lokasi), “keringat dingin” (gejala), “DM” (??), “jantung” (organ).</p>
        <p><strong>Langkah 2 — Resolusi negasi.</strong> “Tidak ada keringat dingin” → gejala <strong>disangkal</strong> (negated). NER naif yang mengabaikan negasi akan melabeli pasien <em>memiliki</em> keringat dingin — membalik makna klinis. Algoritma seperti NegEx mencari pola “tidak ada / tanpa / menyangkal … [gejala]” dalam jendela kata.</p>
        <p><strong>Langkah 3 — Disambiguasi singkatan.</strong> “DM” di catatan jantung kemungkinan besar <strong>diabetes melitus</strong> (faktor risiko), bukan dorsum manus. Aturan: pakai <em>konteks spesialisasi</em> + kamus singkatan lokal RS — singkatan tiap RS beda, jangan pakai kamus generik.</p>
        <p><strong>Langkah 4 — Ketidakpastian.</strong> “Rujuk jantung?” bertanda tanya = <strong>hipotesis dokter</strong>, bukan diagnosis. Sistem harus menandai <em>assertion status</em>: present / absent / possible / hypothetical. Menghitung “?” sebagai diagnosis pasti = inflasi kasus.</p>
        <p><strong>Langkah 5 — Evaluasi.</strong> Ukur presisi/recall <em>per jenis jebakan</em> (negasi, singkatan, hipotesis) — bukan cuma F1 global. F1 0,90 dengan recall negasi 0,60 = sistem yang percaya diri salah.</p>
        <p><strong>Pelajaran:</strong> dalam teks klinis, <strong>konteks 3 kata di sekitar entitas</strong> sering lebih penting dari entitasnya sendiri.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi lanjutan — LLM klinis: asisten brilian yang tidak boleh dipercaya buta:</strong> LLM hebat meringkas catatan dan mengekstrak entitas — tapi ia <strong>berhalusinasi dengan percaya diri</strong> (mengarang diagnosis yang tidak ada di teks) dan <strong>bocor privasi</strong> (menempel data pasien ke prompt cloud). Aturan deployment: (1) selalu <em>grounding</em> — minta LLM mengutip span teks sumber untuk tiap klaim; (2) jalankan <em>on-premise/lokal</em> untuk data pasien (UU PDP Indonesia melarang transfer data kesehatan ke luar tanpa dasar hukum); (3) manusia verifikasi untuk keputusan klinis — LLM untuk <em>draft</em>, dokter untuk <em>keputusan</em>. “LLM-first tanpa verifikasi” di data klinis bukan inovasi — itu malapraktik yang dioutsourcing.</p>
      </div>
      <div className="callout">
        <p><strong>🇮🇩 Konteks Indonesia — bahasa campur dan singkatan lokal:</strong> Catatan dokter Indonesia adalah <strong>kode-switching</strong>: “Pasien mengeluh <em>pusing</em> since 3 days, <em>mual muntah</em> (+), TD 150/95.” Model NLP klinis berbahasa Inggris gagal total di sini — ia tidak kenal “mual muntah” atau singkatan lokal (“KU” = keadaan umum, “KS” = kesadaran). Membangun NER klinis Indonesia butuh <strong>korpus anotasi lokal</strong> (mahal, langka) atau adaptasi multilingual + kamus singkatan per RS. Ini juga peluang karier: <em>sedikit</em> analis Indonesia yang bisa melakukan ini — dan <em>setiap</em> RS besar membutuhkannya.</p>
      </div>

      <h2 id="wawasan">🧠 Wawasan: Teks Klinis Adalah Bahasa Kedua</h2>
      <p>Dokter tidak menulis bahasa Indonesia — mereka menulis <strong>“bahasa klinis”</strong>: campuran bahasa Indonesia, Latin, Inggris, singkatan, angka, dan <em>keheningan yang bermakna</em>. Memahaminya butuh linguistik, bukan cuma regex.</p>
      <p><strong>Sifat 1 — Kepadatan informasi ekstrem.</strong> “DM2, HT, CKD st3, EF 35%, NYHA III” = 5 diagnosis + 2 angka prognostik dalam <strong>9 token</strong>. Model bahasa umum gagal karena <em>tidak pernah</em> melihat kepadatan ini saat pre-training. Solusi: <strong>pre-training lanjutan</strong> (continued pre-training) pada korpus klinis — atau minimal, tokenizer yang tidak memecah “NYHA” menjadi “NY” + “HA”.</p>
      <p><strong>Sifat 2 — Temporalitas implisit.</strong> “Nyeri dada sejak 3 hari, membaik setelah nitro, kambuh tadi malam” — tiga <em>waktu</em>, dua <em>perubahan status</em>, satu <em>respons terapi</em>. Mengekstrak “nyeri dada: ada” saja <strong>membuang 80% maknanya</strong>. Sistem yang baik mengekstrak <strong>event + waktu + status</strong> (onset, resolusi, kekambuhan) — inilah <em>clinical timeline extraction</em>, frontier riset NLP klinis.</p>
      <p><strong>Sifat 3 — Yang <em>tidak</em> ditulis sama pentingnya.</strong> Catatan “dalam batas normal” untuk 10 sistem organ = dokter <em>tidak menemukan</em> apa-apa — <strong>negatif yang informatif</strong>. Sebaliknya, tidak adanya catatan “alergi” bisa berarti “tidak ada alergi” ATAU “lupa ditanya” — <strong>ambigu</strong>. Aturan: bedakan <em>negasi eksplisit</em> (“tidak ada alergi” → aman) dari <em>ketidakhadiran catatan</em> (→ tidak diketahui). Mencampur keduanya = <strong>mengarang kepastian</strong>.</p>
      <p><strong>Sifat 4 — Copy-paste dan template.</strong> 30–50% teks EHR adalah <strong>copy-forward</strong> (copas dari kunjungan lalu) — “riwayat penyakit dahulu” yang 3 tahun tidak diperbarui. NER yang menghitungnya sebagai fakta <em>saat ini</em> sedang <strong>mendaur ulang masa lalu</strong>. Deteksi: kesamaan teks antar-kunjungan &gt;95% = curigai copas; beri <strong>timestamp kepercayaan</strong> per fakta.</p>
      <div className="callout">
        <p><strong>Prinsip:</strong> teks klinis bukan “data kotor” — ia adalah <strong>bahasa dengan tata bahasanya sendiri</strong> (singkatan, temporalitas, keheningan, copas). Hormati tata bahasanya, dan ia memberimu informasi yang <strong>tidak ada</strong> di kolom terstruktur manapun.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;LLM bisa menggantikan chart review manusia untuk label&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> LLM membuat kesalahan yang <em>percaya diri dan halus</em> — halusinasi alergi, dosis salah. Untuk label gold-standard, LLM adalah asisten pra-seleksi yang mempercepat, bukan pengganti adjudikasi manusia. Validasi: sampel output LLM tetap harus dinilai klinisi.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Teks sudah dihapus namanya = aman dibagikan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Quasi-identifier (umur+wilayah+diagnosis langka+tanggal) bisa mengidentifikasi ulang (lihat rumus risiko di atas). De-identifikasi butuh evaluasi sisa risiko (k-anonymity), bukan sekadar hapus nama. Teks klinis sangat kaya = sangat berisiko.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Model NLP Inggris bisa langsung dipakai untuk catatan Indonesia&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Catatan Indonesia: campur bahasa (“nyeri dada, no SOB”), singkatan lokal (“tensi”, “KU”), struktur SOAP yang longgar. Transfer langsung anjlok performanya — butuh adaptasi/fine-tuning dengan data lokal beranotasi.</p>
      </div>

      <h2 id="studi-kasus">🔍 Studi Kasus: Membangun Kamus Singkatan Satu RS</h2>
      <details className="worked">
        <summary>📐 Worked example: dari 2.000 singkatan ke kamus terpercaya (klik untuk buka)</summary>
        <p>RS ingin NER untuk “diagnosis + obat” dari catatan dokter. Hambatan utama: <strong>singkatan lokal</strong>. Proyek 4 minggu:</p>
        <p><strong>Minggu 1 — Ekstraksi kandidat.</strong> Ambil 50.000 catatan, ekstrak token huruf kapital 2–5 karakter + pola “huruf.angka” → 2.000 kandidat singkatan unik. <strong>Filter frekuensi</strong>: fokus 200 teratas (mencakup 85% kemunculan) — prinsip Pareto.</p>
        <p><strong>Minggu 2 — Anotasi oleh 2 dokter.</strong> Tiap singkatan: ekspansi + kategori (diagnosis/obat/tindakan/lain) + <strong>catat ambiguitas</strong> (“DM” = diabetes melitus 92% / dorsum manus 8% di catatan ortopedi). Kesepakatan antar-anotator: kappa 0,87. Yang tidak sepakat → <strong>aturan konteks</strong>, bukan tebakan mayoritas.</p>
        <p><strong>Minggu 3 — Aturan disambiguasi konteks.</strong> “DM” + (kata sekitar: gula, insulin, metformin) → diabetes. “DM” + (fraktur, nyeri punggung) → dorsum manus. Implementasi: <strong>jendela ±5 kata</strong> + daftar pemicu per makna. Uji pada 500 catatan gold: akurasi disambiguasi 94%.</p>
        <p><strong>Minggu 4 — Evaluasi &amp; dokumentasi.</strong> NER end-to-end: presisi 0,89, recall 0,84. <strong>Analisis error</strong>: 40% error = singkatan baru (dokter muda bawa singkatan kampus!), 30% = typo, 20% = negasi terlewat, 10% = lain-lain. <strong>Rencana pemeliharaan</strong>: kamus di-review tiap 6 bulan — karena bahasa dokter <strong>hidup dan bermutasi</strong>.</p>
        <p><strong>Pelajaran:</strong> NER klinis 80% adalah <strong>pekerjaan kamus</strong> (domain knowledge), 20% adalah model. Tim yang merekrut dokter 4 jam/minggu mengalahkan tim yang tuning hyperparameter 40 jam/minggu.</p>
      </details>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Setiap RS punya <strong>dialeknya sendiri</strong> — kamus singkatan RS A tidak berlaku di RS B. Jangan pernah deploy NER “generik” ke RS baru tanpa <strong>adaptasi dialek</strong> (minimal: uji 200 catatan lokal).</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Mulai NLP klinis dari <strong>aturan + kamus</strong> untuk kasus sempit sebelum ML. Aturan untuk “obat + dosis” sering F1 0,9+ dengan 1 hari kerja — baseline yang jujur sebelum model canggih.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Anotasi sedikit tapi <strong>berkualitas</strong>: 500 kalimat dengan 2 anotator + ukur agreement (kappa) &gt; 5.000 kalimat satu anotator ngawur. Kualitas anotasi = langit-langit modelmu.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk setiap proyek LLM klinis, definisikan <strong>“apa yang terjadi bila ia salah”</strong> dulu. Klasifikasi risiko ini menentukan seberapa ketat verifikasi yang dibutuhkan.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: NER Berbasis Aturan (Bahasa Indonesia)</h2>
      <p>Ekstraksi gejala/obat/negasi dari kalimat klinis Indonesia dengan kamus + pola sederhana. Lihat di mana aturan gagal (itulah kebutuhan ML).</p>
      <PyodideLab
        title="🔬 Lab 1: NER Berbasis Aturan (Bahasa Indonesia)"
        hint="Tambahkan kalimatmu sendiri dengan negasi (“menyangkal nyeri dada”). Apakah aturan menangkapnya? Variasikan pola negasi dan lihat kerapuhannya."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Evaluasi De-identifikasi</h2>
      <p>Simulasikan NER de-identifikasi dengan recall tertentu. Hitung berapa identifier bocor per 1.000 dokumen — kuantifikasi risiko sisa.</p>
      <PyodideLab
        title="🔬 Lab 2: Evaluasi De-identifikasi"
        hint="Recall 99% terdengar hebat — tapi dengan 20 identifier per dokumen, berapa yang bocor per 1.000 dokumen? Itulah kenapa de-id butuh lapisan pertahanan berlapis."
        defaultCode={lab2Code}
      />

      <h2 id="indonesia">🇮🇩 Cerita Data: Bahasa Campur Dokter Indonesia</h2>
      <p>Catatan dokter Indonesia adalah <strong>tiga bahasa dalam satu kalimat</strong>: “Pasien mengeluh <em>pusing berputar</em> since yesterday, <em>mual muntah</em> (+), TD 160/100, <em>riwayat</em> HT.” — Indonesia + Inggris + Latin/singkatan, kadang daerah (“mual” vs “enek”). Inilah <strong>tantangan yang tidak ada di paper NLP Barat</strong>.</p>
      <p><strong>Strategi praktis:</strong> (1) <strong>Normalisasi bertingkat</strong> — kamus sinonim lokal dulu (“pusing”, “pusing berputar”, “vertigo”, “dizzy” → konsep pusing), baru NER. (2) <strong>Model multilingual</strong> (mBERT, XLM-R) sebagai basis — bukan model Inggris murni. (3) <strong>Anotasi lokal</strong> — tidak ada jalan pintas: 2.000–5.000 kalimat anotasi dokter Indonesia adalah <strong>investasi minimum</strong> yang wajar. (4) <strong>Evaluasi per fenomena</strong> — ukur terpisah: code-switching, singkatan lokal, typo (“pnemonia”), negasi Indonesia (“tidak ada”, “tanpa”, “menyangkal”, “(-)”).</p>
      <p><strong>De-identifikasi versi Indonesia:</strong> nama Indonesia punya pola khas (nama depan + nama ayah, gelar “H.”/“Hj.”, nama daerah sebagai nama orang — “Wayan”, “Siti”). Sistem de-id Barat gagal mengenalinya. Plus: <strong>NIK 16 digit</strong> dan <strong>nomor BPJS 13 digit</strong> sebagai identifier numerik khas. Aturan: bangun <strong>pola regex + NER lokal</strong> untuk identifier Indonesia — jangan impor sistem Barat mentah-mentah.</p>
      <p><strong>Peluang:</strong> hampir <strong>tidak ada</strong> model NLP klinis Bahasa Indonesia yang publik dan bagus (2026). Siapa yang membangunnya — dengan korpus anotasi 5.000 kalimat + evaluasi ketat — akan menjadi <strong>rujukan nasional</strong>. Ini proyek 3–6 bulan yang layak jadi tesis/portofolio.</p>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Jangan menunggu “dataset besar”. Dalam NLP klinis lokal, <strong>2.000 kalimat anotasi berkualitas &gt; 2 juta kalimat tanpa anotasi</strong>. Kualitas anotasi (dokter asli, guideline jelas, adjudikasi) mengalahkan kuantitas — selalu.</p>
      </div>

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Ekstraksi sempit &amp; berpola → Aturan + kamus</h3>
        <p><strong>Kondisi:</strong> Entitas berpola kaku (obat+dosis, kode), butuh cepat.</p>
        <p><strong>Kenapa:</strong> Murah, transparan, F1 tinggi untuk pola kaku.</p>
        <p><strong>Contoh nyata:</strong> Ekstraksi resep dari catatan rawat jalan.</p>
      </div>
      <div className="decision-card">
        <h3>2. Ekstraksi luas (gejala, negasi kompleks) → Model ML/LLM + anotasi lokal</h3>
        <p><strong>Kondisi:</strong> Bahasa bervariasi, butuh konteks.</p>
        <p><strong>Kenapa:</strong> Aturan rapuh untuk variasi bahasa; butuh data anotasi Indonesia.</p>
        <p><strong>Contoh nyata:</strong> Fenotipe gejala awal stroke dari IGD.</p>
      </div>
      <div className="decision-card">
        <h3>3. Teks keluar RS → De-identifikasi + evaluasi risiko</h3>
        <p><strong>Kondisi:</strong> Riset/analitik di luar sistem klinis.</p>
      <PlotlyChart
        data={hd14RiskData}
        title="Estimasi Risiko Re-identifikasi per Lapisan Pertahanan (ilustratif)"
        layout={hd14RiskDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Empat lapisan pertahanan berurutan. Tinggi batang = estimasi risiko re-identifikasi yang tersisa.</p>
        <p><strong>Interpretasi:</strong> Hapus nama saja menyisakan risiko 45% — quasi-identifier bekerja. Tiap lapisan memangkas risiko; kombinasi mencapai ~1%. Pertahanan berlapis, bukan satu trik, adalah standar.</p>
      </div>
        <p><strong>Kenapa:</strong> Kewajiban privasi (UU PDP); teks kaya = risiko re-identifikasi tinggi.</p>
        <p><strong>Contoh nyata:</strong> Dataset riset catatan TB untuk universitas.</p>
      </div>
      <div className="decision-card">
        <h3>4. Tugas bahasa generatif → LLM dengan human-in-the-loop</h3>
        <p><strong>Kondisi:</strong> Ringkasan, draf surat, tanya-jawab.</p>
        <p><strong>Kenapa:</strong> Kuat tapi berhalusinasi; verifikasi manusia wajib untuk dampak klinis.</p>
        <p><strong>Contoh nyata:</strong> Draf ringkasan pulang untuk ditinjau dokter.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Deteksi negasi dulu sebelum hitung entitas.</li>
          <li>Evaluasi per tipe entitas, bukan agregat.</li>
          <li>De-id dulu sebelum teks keluar RS / masuk LLM.</li>
          <li>LLM = asisten berdraf, bukan penanggung jawab.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Chatbot Triase: “Kamu Kena Serangan Jantung!”</h2>
      <div className="callout">
        <p>Startup meluncurkan chatbot triase berbasis LLM: pasien chat gejala, bot menyarankan “ ke IGD / istirahat di rumah”. Tanpa uji klinis, langsung ke publik. Sebulan kemudian: pasien nyeri dada disarankan “istirahat dan minum air hangat” — ternyata infark.</p>
      <p>Investigasi: tidak ada evaluasi factuality, tidak ada batasan (bot boleh mendiagnosis), riwayat chat pasien tersimpan plaintext di server vendor.</p>
        <p><strong>Pertanyaan:</strong> Sebutkan kegagalan per lapisan (klinis, evaluasi, privasi) dan desain yang bertanggung jawab.</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>(1) Klinis: LLM boleh memberi <em>informasi umum</em>, bukan diagnosis/triase definitif — butuh disclaimer + eskalasi ke manusia untuk red flags (nyeri dada!). (2) Evaluasi: tidak ada uji factuality oleh klinisi, tidak ada pengukuran halusinasi, tidak ada uji pada kasus red-flag. (3) Privasi: data kesehatan di server vendor plaintext = pelanggaran prinsip UU PDP. Desain benar: de-id + enkripsi, LLM sebagai <em>pendukung</em> perawat triase (bukan pengganti), daftar red-flag berbasis aturan yang selalu eskalasi, audit halusinasi berkala, dan persetujuan etik. Pelajaran: kecepatan deploy tanpa evaluasi klinis = malpraktik berskala software.</p>
        </details>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Kalimat “tidak ada sesak napas”. Kesalahan NER naif?"
        options={["Tidak ada",
          "Mencatat “sesak napas” sebagai gejala yang dialami (gagal deteksi negasi)",
          "Gagal membaca huruf",
          "Terlalu lambat"]}
        correct={1}
        explanation="Benar: negasi membalik arti. NER klinis tanpa deteksi negasi menghasilkan fenotipe sampah."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Setelah NER, langkah “normalisasi” artinya…"
        options={["Merapikan huruf",
          "Memetakan entitas ke terminologi standar (SNOMED/RxNorm/ICD)",
          "Menghapus data",
          "Menerjemahkan"]}
        correct={1}
        explanation="Benar: “aspirin” → RxNorm 1191. Tanpa ini, “aspirin” dan “acetosal” jadi dua obat berbeda."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. De-identifikasi yang benar mencakup…"
        options={["Hapus nama saja",
          "18 identifier Safe Harbor + evaluasi sisa risiko quasi-identifier + perjanjian akses",
          "Ganti font",
          "Enkripsi nama saja"]}
        correct={1}
        explanation="Benar: nama hanyalah satu dari 18. Kombinasi umur+wilayah+diagnosis bisa mengidentifikasi ulang."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Kapan LLM cocok untuk data klinis?"
        options={["Diagnosis otonom",
          "Ringkasan draf + ekstraksi awal dengan human-in-the-loop, setelah de-identifikasi",
          "Mengganti dokter",
          "Kirim data mentah ke API publik"]}
        correct={1}
        explanation="Benar: asisten yang diawasi, bukan penanggung jawab. Privasi: jangan kirim teridentifikasi ke API publik."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Evaluasi NER yang benar?"
        options={["Satu angka F1 agregat",
          "Precision/recall/F1 PER TIPE ENTITAS (negasi sering paling lemah)",
          "Kecepatan saja",
          "Jumlah baris kode"]}
        correct={1}
        explanation="Benar: agregat menyembunyikan kelemahan fatal (negasi F1 0,71 vs obat 0,94)."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Catatan Indonesia (“nyeri dada, no SOB”, singkatan lokal). Tantangan utama transfer model Inggris?"
        options={["Tidak ada",
          "Campur bahasa + singkatan lokal + struktur longgar — butuh adaptasi data lokal",
          "Hanya font",
          "Terlalu cepat"]}
        correct={1}
        explanation="Benar: domain shift bahasa. Butuh anotasi lokal; evaluasi ulang, jangan asumsi."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li><strong>NER klinis</strong>: entitas + normalisasi (SNOMED/RxNorm) + deteksi negasi.</li>
          <li>Evaluasi <strong>per tipe entitas</strong>; negasi biasanya titik lemah.</li>
          <li><strong>De-identifikasi</strong>: 18 identifier + ukur sisa risiko + lapisan pertahanan.</li>
          <li>Jangan kirim teks teridentifikasi ke <strong>API LLM publik</strong>.</li>
          <li><strong>LLM</strong>: kuat untuk draf/ekstraksi awal; halusinasi = wajib human-in-the-loop.</li>
          <li>Mulai dari <strong>aturan + kamus</strong> sebagai baseline jujur.</li>
          <li>Anotasi sedikit berkualitas &gt; banyak ngawur (ukur kappa).</li>
          <li>Definisikan “apa bila salah” sebelum memilih tingkat otonomi.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/hd13-fairness-kesehatan" className="btn btn-secondary btn-sm">← HD13</Link>
        <Link href="/learn/hd15-imaging-medis" className="btn btn-primary btn-sm">HD15 →</Link>
      </div>
    </div>
  );
}
