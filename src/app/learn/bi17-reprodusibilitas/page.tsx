"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi17ReprodusibilitasPage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi17ReproData = [{"x": ["Kode saja", "+ versi tool", "+ container", "+ workflow"], "y": [15, 40, 70, 90], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["15%", "40%", "70%", "90%"], "textposition": "outside"}];
  const bi17ReproDataLayout = {"xaxis": {"title": "Tingkat dokumentasi"}, "yaxis": {"title": "Berhasil direproduksi (%)"}, "showlegend": false};

  const bi17IdentData = [{"x": [10, 30, 50, 80, 100], "y": [5, 60, 85, 97, 99], "type": "scatter", "mode": "lines+markers", "line": {"color": "#2a7de1", "width": 3}, "marker": {"size": 9}}];
  const bi17IdentDataLayout = {"xaxis": {"title": "Jumlah SNP acak"}, "yaxis": {"title": "Teridentifikasi unik (%)"}, "showlegend": false};

  const lab1Code = "checklist = ['kode tersedia', 'versi tool', 'parameter tercatat',\n             'seed tercatat', 'data terdeposit (aksesi)', 'workflow/container',\n             'README cara jalan', 'lisensi jelas']\npaperA = [1,1,1,1,1,1,1,1]\npaperB = [1,0,0,0,0,0,1,0]  # “kode di github, data atas permintaan”\nfor nama, p in [('Paper A (lengkap)', paperA), ('Paper B (tipikal)', paperB)]:\n    skor = sum(p)/len(p)\n    print(f'{nama}: {skor:.0%}')\n    kurang = [c for c, v in zip(checklist, p) if not v]\n    if kurang:\n        print(f'   kurang: {kurang}')\nprint()\nprint('Jurnal top 2026: butuh ~100% untuk metode komputasional.')\nprint('Paper B = cerita pembuka lesson ini (tak terreproduksi).')";

  const lab2Code = "import random\nrandom.seed(42)\nN, TOTAL_SNP = 2000, 200\n# database: tiap individu = vektor genotipe acak\ndb = [[random.randint(0,2) for _ in range(TOTAL_SNP)] for _ in range(N)]\ntarget = db[0]\nfor n_snp in [5, 10, 20, 30, 50]:\n    cocok = sum(1 for ind in db if ind[:n_snp] == target[:n_snp])\n    unik = 'UNIK -> TERIDENTIFIKASI' if cocok == 1 else f'{cocok} kandidat'\n    print(f'{n_snp:>3} SNP: {unik}')\nprint()\nprint('Puluhan SNP acak = sidik jari. Hapus nama tidak membantu.')\nprint('Kesimpulan: data genetik = identifiable, selalu.')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI17 &mdash; Bioinformatics</span>
        <h1 className="display-title">FAIR &amp; Etika Genetik:<br />Reprodusibilitas Bioinformatika</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Paper yang Tak Bisa Dijalankan</a></li>
          <li><a href="#repro">Reprodusibilitas: Workflow + Container</a></li>
          <li><a href="#fair">Prinsip FAIR untuk Data</a></li>
          <li><a href="#etika">Privasi Genetik &amp; Etika</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Audit Reprodusibilitas</a></li>
          <li><a href="#lab2">🔬 Lab 2: Risiko Re-identifikasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Membangun Analisis yang Tahan Waktu</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Mereproduksi Paper Sebelum Mengandalkannya</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menjelaskan <strong>krisis reproduksibilitas</strong> dan solusinya: workflow manager + container.</li>
          <li>Menerapkan <strong>prinsip FAIR</strong> pada data dan kode.</li>
          <li>Menjelaskan risiko <strong>privasi genetik</strong> (re-identifikasi) dan mitigasinya.</li>
          <li>Menyebutkan kerangka <strong>etika riset genomik</strong> (consent, return of results).</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Paper yang Tak Bisa Dijalankan</h2>
      <div className="story">
        <p>Paper Nature mengklaim metode baru. Tiga lab mencoba mereproduksi: <strong>tidak satu pun berhasil</strong>. Penyebab: parameter tak dilaporkan, versi tool beda, script “final_v2_REAL.py” hilang, data “tersedia atas permintaan” (tidak pernah dibalas). Metode brilian yang tidak bisa dipakai = tidak ada.</p>
      <p>Bioinformatika punya masalah reproduksibilitas akut: pipeline rapuh, dependensi neraka, data privat. Lesson ini mengajarkan cara membangun analisis yang TAHAN WAKTU — plus sisi etiknya: data genetik adalah data paling pribadi yang ada.</p>
      <p>Twist-nya: frasa “data tersedia atas permintaan” ternyata hampir selalu berarti <strong>tidak tersedia</strong> — studi menunjukkan sebagian besar permintaan email tak pernah dibalas, dan sebagian data “tersedia” sudah hilang bersama laptop mantan mahasiswa. Reproduksibilitas bukan soal niat baik; ia soal <strong>infrastruktur</strong> (container, workflow manager, repositori FAIR) yang membuat kejujuran menjadi pilihan termudah. Dan ada twist etis: genommu <strong>tidak bisa dianonimkan penuh</strong> — 30-80 SNP acak cukup mengidentifikasi satu orang dari database publik. Data paling pribadi yang ada menuntut standar paling ketat.</p>
      </div>

      <h2 id="repro">Reprodusibilitas: Workflow + Container</h2>
      <p><strong>Definisi.</strong> <strong>Workflow manager</strong> (Nextflow, Snakemake): pipeline sebagai kode berversi — tiap langkah, parameter, input tercatat. <strong>Container</strong> (Docker/Singularity): lingkungan beku — tool versi X berjalan sama di mana pun. Kombinasi = analisis yang bisa dijalankan ulang 5 tahun kemudian.</p>
      <details className="worked">
        <summary>📐 Contoh: anatomi pipeline reproduksibel</summary>
        <p>Analisis RNA-seq: Snakefile mendefinisikan trim → map → count; tiap rule: container (biocontainers/star:2.7.10a), parameter, input/output.<br /><strong>5 tahun kemudian:</strong> `snakemake --use-singularity` → hasil IDENTIK (atau error jelas bila data hilang).<br />Tanpa ini: “STAR versi berapa? parameter apa?” — tidak terjawab, tidak terreproduksi.<br />Standar minimal: <strong>kode + versi tool + parameter + seed + data (atau akses)</strong>.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Analisis tanpa workflow itu seperti resep masakan yang ditulis di tisu: “masak sampai matang” — tidak ada yang bisa mengulanginya. Nextflow + Docker adalah buku resep standar dengan foto tiap langkah dan oven yang sama.</p>
      <p><strong>Kapan memakai:</strong> Setiap analisis &gt;1 langkah atau dishare. Untuk HPC: Singularity/Apptainer (BI4).</p>

      <PlotlyChart
        data={bi17ReproData}
        title="Peluang Reproduksi vs Kelengkapan (ilustratif)"
        layout={bi17ReproDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = peluang lab lain berhasil menjalankan ulang analisismu pada tiap tingkat kelengkapan.</p>
        <p><strong>Interpretasi:</strong> Kode saja = 15% (dependensi neraka). Tiap lapisan (versi, container, workflow) melipatgandakan peluang. Investasi 1 hari menulis workflow menghemat 1 bulan orang lain — termasuk dirimu 6 bulan lagi.</p>
      </div>

      <h2 id="fair">Prinsip FAIR untuk Data</h2>
      <p><strong>Definisi.</strong> <strong>FAIR</strong>: Findable (metadata + DOI/aksesi), Accessible (repositori, bukan “atas permintaan”), Interoperable (format standar — BI3!), Reusable (lisensi + dokumentasi jelas).</p>
      <details className="worked">
        <summary>📐 Contoh: FAIR checklist publikasi</summary>
        <p><strong>F:</strong> GEO GSE12345 + metadata MIAME lengkap.<br /><strong>A:</strong> SRA publik saat publikasi (bukan embargo abadi).<br /><strong>I:</strong> count matrix TSV + format standar (BI3).<br /><strong>R:</strong> lisensi CC-BY + README + Snakefile.<br />Reviewer 2026: tidak ada aksesi = tidak lolos review. “Tersedia atas permintaan” = red flag (studi: 90%+ tidak dibalas).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> FAIR itu seperti perpustakaan yang benar: buku berkatalog (findable), bisa dipinjam (accessible), berbahasa umum (interoperable), boleh difotokopi dengan aturan jelas (reusable). Data di harddisk pribadi = buku di gudang terkunci.</p>
      <p><strong>Kapan memakai:</strong> Setiap publikasi: deposit data (GEO/SRA/ENA), kode (GitHub/Zenodo+DOI), workflow. Syarat jurnal top sekarang.</p>

      <h2 id="etika">Privasi Genetik &amp; Etika — Si Penjaga Terakhir</h2>
      <p><strong>Definisi.</strong> DNA adalah <strong>identifier pamungkas</strong>: 30–80 SNP acak cukup mengidentifikasi individu; kerabat bisa diidentifikasi via database genealogi (kasus Golden State Killer!). <strong>Mitigasi</strong>: controlled access (dbGaP/EGA), de-identifikasi, Data Access Committee, consent luas vs spesifik.</p>
      <Tex math={String.raw`N_{\text{profil}} = 3^k \gg N_{\text{manusia}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`k`} />: jumlah SNP acak yang diketahui</li>
          <li><Tex math={String.raw`N_{\text{profil}}`} />: jumlah profil genotipe yang mungkin (3 genotipe per SNP)</li>
          <li><Tex math={String.raw`N_{\text{manusia}}`} />: populasi manusia (~8 miliar)</li>
      </ul>
      <p><strong>Interpretasi:</strong> 3^30 ≈ 2×10^14 kemungkinan profil vs 8 miliar manusia → profil 30 SNP praktis unik. Inilah matematika di balik “puluhan SNP = sidik jari” — bukan opini, tapi kombinatorik.</p>
      <details className="worked">
        <summary>📐 Contoh: dilema return of results</summary>
        <p>Sekuensing riset menemukan varian BRCA1 patogenik pada partisipan yang consent “untuk riset saja”.<br /><strong>Pertanyaan etik:</strong> beri tahu? (menyelamatkan nyawa vs melanggar otonomi + consent terbatas).<br />Praktik baik: <strong>consent berlapis</strong> sejak awal (“maukah diberi tahu temuan kesehatan penting?”) + jalur validasi klinis + konseling genetik.<br /><strong>Aturan:</strong> temuan riset ≠ diagnosis klinis — butuh validasi lab tersertifikasi sebelum dikomunikasikan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Data genetik itu seperti sidik jari yang tidak bisa diganti DAN milik seluruh keluargamu. Membagikannya = membagikan sebagian identitas orang tuamu, saudaramu, anakmu — tanpa mereka ikut tanda tangan.</p>
      <p><strong>Kapan memakai:</strong> Setiap riset genomik manusia: IRB/ethics approval, consent, rencana data sharing SEBELUM kumpul data.</p>
      <div className="callout callout-warning"><strong>Untuk Indonesia:</strong> keragaman genetik = kekayaan riset TAPI juga kerentanan: eksploitasi (biopiracy) bila sampel mengalir tanpa tata kelola. Pastikan: Material Transfer Agreement, persetujuan etik nasional, dan manfaat balik ke komunitas. Data genetik Indonesia harus dikelola untuk Indonesia.</div>

      <PlotlyChart
        data={bi17IdentData}
        title="SNP Acak vs Peluang Identifikasi (ilustratif)"
        layout={bi17IdentDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> X = jumlah SNP acak yang diketahui, Y = peluang cocok unik ke satu individu di database.</p>
        <p><strong>Interpretasi:</strong> Hanya 30–80 SNP acak — dari 10 juta! — cukup mengidentifikasi seseorang. “Anonimisasi” dengan menghapus nama = ilusi untuk data genetik. Inilah kenapa controlled access (dbGaP/EGA) bukan paranoia, tapi keharusan.</p>
      </div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Hapus nama = data genetik anonim&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> 30–80 SNP mengidentifikasi individu; kerabat teridentifikasi via genealogi. Anonimisasi klasik GAGAL untuk DNA. Perlakukan data genetik sebagai identifiable SELALU — controlled access + perjanjian.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Reprodusibilitas = jalankan ulang dapat angka sama persis&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Ada tingkat: <strong>reproducible</strong> (kode+data sama → hasil sama), <strong>replicable</strong> (data baru → kesimpulan sama). Keduanya berharga; jangan menuntut bit-identical untuk data stokastik — tuntut kesimpulan yang bertahan.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Etik = urusan komite, bukan bioinformatikawan&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Kamu yang menulis pipeline yang memproses data manusia. Consent, akses, dan keamanan ADA di tanganmu (enkripsi, kontrol akses, audit). “Saya cuma analisis” bukan pembelaan.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Mulai SETIAP proyek dengan <strong>repo + README + environment</strong> (conda env / container). 1 jam di awal menghemat 1 minggu di akhir.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> <strong>Version-kan data</strong> juga (DVC / checksum). Kode berversi + data tak berversi = setengah reproduksibel.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk data manusia: <strong>threat-model</strong> sebelum analisis — siapa bisa akses apa, di mana disimpan, berapa lama. Tulis dalam protokol etik.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Audit Reprodusibilitas Paper</h2>
      <p>Diberikan checklist 8 item, nilai dua “paper” (A: lengkap, B: tipikal). Hitung skor dan putuskan mana yang lolos standar jurnal top.</p>
      <PyodideLab
        title="🔬 Lab 1: Audit Reprodusibilitas Paper"
        hint="Gunakan checklist ini untuk analisismu sendiri SEBELUM submit. Reviewer 2026 memeriksanya — jadilah reviewer pertamamu."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Berapa SNP untuk Mengidentifikasi?</h2>
      <p>Simulasikan database 10.000 individu × SNP acak. Lihat berapa SNP dibutuhkan agar satu profil menjadi unik. Rasakan kenapa “anonim” itu ilusi.</p>
      <PyodideLab
        title="🔬 Lab 2: Berapa SNP untuk Mengidentifikasi?"
        hint="Hasilnya kecil (puluhan!). Inilah argumen matematis untuk controlled access — bukan opini, tapi kombinatorik."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Analisis dishare/dipublikasi → Workflow + container + FAIR</h3>
        <p><strong>Kondisi:</strong> Setiap publikasi/kolaborasi.</p>
        <p><strong>Kenapa:</strong> Standar jurnal; tahan waktu.</p>
        <p><strong>Contoh nyata:</strong> Snakemake + Singularity + GEO.</p>
      </div>
      <div className="decision-card">
        <h3>2. Data genomik manusia → Controlled access + etik</h3>
        <p><strong>Kondisi:</strong> Selalu; tanpa kecuali.</p>
        <p><strong>Kenapa:</strong> Identifiable; consent; hukum.</p>
        <p><strong>Contoh nyata:</strong> EGA + Data Access Committee.</p>
      </div>
      <div className="decision-card">
        <h3>3. HPC cluster → Singularity/Apptainer</h3>
        <p><strong>Kondisi:</strong> Docker tidak diizinkan (root).</p>
        <p><strong>Kenapa:</strong> Aman untuk multi-user HPC.</p>
        <p><strong>Contoh nyata:</strong> Nextflow + Singularity di cluster.</p>
      </div>
      <div className="decision-card">
        <h3>4. Temuan klinis dari riset → Validasi + konseling</h3>
        <p><strong>Kondisi:</strong> Varian patogenik pada partisipan.</p>
        <p><strong>Kenapa:</strong> Riset ≠ diagnosis; otonomi.</p>
        <p><strong>Contoh nyata:</strong> BRCA1: validasi lab + konselor.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>Kode + versi + parameter + seed + data.</li>
          <li>Workflow + container = tahan waktu.</li>
          <li>FAIR: bukan “atas permintaan”.</li>
          <li>DNA = identifiable, selalu.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Database “Anonim” yang Bocor Identitas</h2>
      <div className="callout">
        <p>Biobank merilis 5.000 genom “teranonimkan” (nama dihapus) sebagai open access. Peneliti menunjukkan 40% bisa diidentifikasi via database genealogi publik + metadata usia/wilayah.</p>
        <p><strong>Pertanyaan:</strong> Respons tata kelola yang benar?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Tarik rilis terbuka; migrasi ke controlled access (aplikasi + komite + perjanjian). Audit: siapa mengunduh? Notifikasi partisipan (kewajiban etik). Perbaiki SOP: (1) tidak ada genom manusia sebagai open download — summary stats boleh; (2) threat modeling SEBELUM rilis; (3) consent harus mencakup risiko re-identifikasi (jujur, bukan “anonim”). Pelajaran: sekali rilis, tidak bisa ditarik dari internet. Keputusan akses data adalah SATU ARAH — buat dengan standar tertinggi di awal, bukan setelah insiden.</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Membangun Analisis yang Tahan Waktu</h2>
      <p>Reproduksibilitas sering disalahartikan sebagai “moralitas” — padahal ia adalah <strong>teknik</strong>. Ada tumpukan teknologi yang membuat analisis tahan 5 tahun, dan tiap lapisan menyelesaikan satu cara spesifik untuk gagal. Pendalaman ini tentang tumpukannya.</p>

      <h3>1. Tumpukan reproduksibilitas: 4 lapis</h3>
      <ul>
        <li><strong>Lapis 1 — Kode berversi (Git):</strong> “script final_v2_REAL.py” diganti commit <code>a3f9c1d</code>. Setiap hasil bisa dilacak ke kode persis yang menghasilkannya. Tanpa ini, “coba ulangi analisis 2023” = arkeologi.</li>
        <li><strong>Lapis 2 — Environment terkunci (conda/Docker):</strong> <code>conda env export</code> atau Dockerfile mengunci versi tiap tool. Analisis 2021 yang memakai samtools 1.9 tetap jalan identik di 2026 — tanpa ini, update tool diam-diam mengubah hasil (pernah terjadi: versi aligner baru mengubah 3% variant calls!).</li>
        <li><strong>Lapis 3 — Workflow manager (Snakemake/Nextflow):</strong> alur sebagai kode: input → aturan → output. Rerun parsial otomatis, paralelisme gratis, dan — penting — <strong>alur bisa dibaca orang lain</strong> sebagai dokumentasi.</li>
        <li><strong>Lapis 4 — Data FAIR:</strong> Findable (DOI, repositori), Accessible (bukan “email saya”), Interoperable (format standar), Reusable (metadata lengkap). Data di laptop = tidak FAIR.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: audit reproduksibilitas 10 menit</summary>
        <p>Diberi paper + repo GitHub. Checklist:<br />
        (1) Apakah ada environment.yml/Dockerfile? Tidak → <strong>gagal lapis 2</strong> (hasil bergantung pada “mesin penulis”).<br />
        (2) Apakah README menjelaskan perintah run end-to-end? Tidak → gagal lapis 3.<br />
        (3) Apakah data di SRA/GEO dengan aksesi? “Tersedia atas permintaan” → <strong>gagal lapis 4</strong>.<br />
        (4) Apakah ada seed acak tercatat? Tidak → hasil stokastik (ML, bootstrap) tidak bisa direplikasi persis.<br />
        Skor 1/4 = paper yang “tidak bisa dipakai” seperti cerita pembuka. <strong>Gunakan checklist ini sebelum mengandalkan metode orang lain</strong> — menghemat bulan mencoba mereproduksi yang tidak bisa direproduksi.</p>
      </details>

      <h3>2. Krisis reproduksibilitas: angkanya</h3>
      <p>Survei Nature (2016): &gt;70% peneliti gagal mereproduksi eksperimen peneliti lain; &gt;50% gagal mereproduksi <strong>eksperimennya sendiri</strong>. Di komputasi, penyebab utamanya bukan niat buruk — melainkan <strong>detail yang tidak tercatat</strong>: parameter default yang berubah antar versi, urutan langkah yang “jelas” bagi penulis, dan preprocessing manual di Excel yang tidak terdokumentasi.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Musuh nomor satu = langkah manual</strong></p>
        <p>Setiap klik GUI, edit Excel manual, atau “bersihkan dulu di spreadsheet” adalah lubang reproduksibilitas — tidak tercatat, tidak terulang, tidak teraudit. Aturan: <strong>jika dilakukan lebih dari sekali, jadikan script; jika sekali tapi penting, catat persis langkahnya</strong>. Analisis yang baik bisa dijalankan ulang oleh orang asing dengan satu perintah.</p>
      </div>

      <h3>3. Etika data genetik: anonimitas yang mustahil</h3>
      <p>Twist cerita pembuka layak diperdalam: 30–80 SNP acak cukup mengidentifikasi seseorang dari database publik (Gymrek et al., Science 2013 — mengidentifikasi donor “anonim” 1000 Genomes lewat database genealogi Y-chromosome + usia). <strong>Genom adalah identifier biometrik permanen</strong> — tidak seperti password, tidak bisa diganti saat bocor.</p>
      <ul>
        <li><strong>Implikasi consent:</strong> “data dianonimkan” untuk genom = klaim yang hampir pasti salah. Consent harus menjelaskan risiko re-identifikasi — bukan menjanjikan anonimitas.</li>
        <li><strong>Keluarga ikut terdampak:</strong> genommu 50% sama dengan orang tuamu/anakmu. Membagikan genom sendiri = membagikan setengah genom keluarga <strong>tanpa persetujuan mereka</strong>.</li>
        <li><strong>Solusi praktik:</strong> akses terkontrol (dbGaP: komite etik menyetujui tiap penggunaan), <em>data enclave</em> (analisis di dalam, hanya hasil agregat keluar), dan prinsip <strong>data minimization</strong> (minta hanya varian yang dibutuhkan, bukan genom utuh).</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: dilema dbGaP dalam praktik</summary>
        <p>Kamu ingin memakai 5.000 genom dbGaP untuk studi baru (di luar tujuan consent awal).<br />
        Jalur benar: ajukan <em>data access request</em> — jelaskan tujuan, dapatkan persetujuan komite (2–8 minggu), analisis di enclave, laporkan publikasi kembali.<br />
        Jalur salah: “kan sudah diunduh lab sebelah, pinjam saja”. Ini pelanggaran perjanjian akses — sanksinya nyata: <strong>institusi bisa kehilangan seluruh akses dbGaP</strong> (pernah terjadi).<br />
        Pelajaran: etika data bukan hiasan — ia adalah <strong>infrastruktur kepercayaan</strong> yang membuat 5.000 orang berani mendonorkan genomnya. Satu pelanggaran merusak kolam untuk semua.</p>
      </details>

      <h3>Kasus nyata: paper yang mati karena “final_v2_REAL.py”</h3>
      <p>Metode assembly genom baru, paper Nature, sitasi 500+. Tiga lab gagal reproduksi. Investigasi 2 tahun kemudian: script hilang bersama laptop PhD yang lulus; parameter kunci (“k=77”) hanya di ingatan; versi tool tidak tercatat. Metode itu <strong>mungkin brilian</strong> — tapi sains tidak bisa memakai “mungkin”. Hari ini jurnal top mewajibkan <strong>code + data availability statement</strong> yang diverifikasi, dan reviewer yang baik benar-benar mengklik link-nya. <strong>Reproduksibilitas bukan beban administrasi — ia adalah cara sains membedakan pengetahuan dari anekdot.</strong></p>

      <h2 id="kasus2">🏥 Kasus Lapangan: Mereproduksi Paper Sebelum Mengandalkannya</h2>
      <p>Lab-mu ingin memakai metode <em>cell-type deconvolution</em> baru dari paper Nature Methods (sitasi 300+) untuk proyek Rp1 miliar. PI memintamu: <strong>“reproduksi dulu hasil utamanya sebelum kita commit”</strong>. Dua minggu waktu. Ini jurnal forensikmu:</p>

      <h3>Hari 1–2: audit ketersediaan</h3>
      <ul>
        <li><strong>Kode:</strong> GitHub ada ✓, tapi commit terakhir 2 tahun lalu, issue “tidak jalan di Python 3.10” <strong>tidak dijawab</strong> ✗.</li>
        <li><strong>Environment:</strong> tidak ada environment.yml/Dockerfile — README bilang “install dependencies” tanpa versi ✗.</li>
        <li><strong>Data:</strong> “tersedia atas permintaan” ✗ (email dikirim hari 1 — belum dibalas hari 14).</li>
        <li><strong>Dokumen run:</strong> tidak ada perintah end-to-end; notebook contoh memakai path lokal penulis ✗.</li>
      </ul>
      <p>Skor: 0/4 lapis tumpukan reproduksibilitas. <strong>Keputusan hari 2: jangan commit proyek Rp1 miliar ke metode ini</strong> — tapi coba reproduksi parsial untuk memastikan.</p>

      <h3>Hari 3–10: reproduksi parsial heroik</h3>
      <details className="worked">
        <summary>📐 Contoh: biaya “sedikit” yang tidak tercatat</summary>
        <p>Kamu menebak-nebak versi library (coba 6 kombinasi!), memperbaiki 4 baris kode yang rusak di numpy baru, dan memakai <strong>data simulasi sendiri</strong> (data asli tak kunjung datang).<br />
        Hasil: metode jalan, tapi akurasi pada datamu <strong>15% di bawah</strong> klaim paper.<br />
        Penyebab mungkin: (a) datamu beda karakteristik, (b) parameter tak tercatat yang penulis set manual, (c) <em>overfitting</em> paper ke dataset mereka.<br />
        <strong>Interpretasi:</strong> 8 hari kerja untuk jawaban “mungkin bekerja 15% lebih buruk, mungkin lebih”. Jika metode ini dipakai buta di proyek Rp1 miliar, 15% itu = ratusan juta rupiah analisis yang dipertanyakan. <strong>Upaya reproduksi BUKAN waktu terbuang — ia adalah asuransi termurah.</strong></p>
      </details>

      <h3>Keputusan akhir &amp; pelajaran sistemik</h3>
      <p>Rekomendasi ke PI: “Metode menjanjikan tapi <strong>belum layak produksi</strong>. Opsi: (a) pakai metode lama yang terreproduksi untuk proyek ini, (b) alokasikan 1 bulan untuk mem-validasi metode baru di data kita dengan benchmark independen.” PI memilih (a) + (b) paralel.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Aturan 2 minggu</strong></p>
        <p>Sebelum mengandalkan metode/paper apa pun untuk proyek besar: <strong>alokasikan 2 minggu upaya reproduksi</strong>. Jika dalam 2 minggu tidak bisa mereproduksi hasil utama — itu BUKAN kegagalanmu; itu <strong>informasi</strong>: metode ini belum matang untuk diandalkan. Aturan ini menyelamatkan lebih banyak budget daripada semua optimasi kode.</p>
      </div>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Komponen minimal analisis reproduksibel?"
        options={["Kode saja",
          "Kode + versi tool + parameter + seed + data/akses",
          "Paper PDF",
          "Tidak ada standar"]}
        correct={1}
        explanation="Benar: lima komponen. Kurang satu = teka-teki untuk penerusmu."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Kenapa container (Docker/Singularity) penting?"
        options={["Lebih cepat",
          "Lingkungan beku: versi tool sama di mana pun, kapan pun",
          "Gratis",
          "Wajib hukum"]}
        correct={1}
        explanation="Benar: dependensi neraka adalah pembunuh reproduksibilitas #1."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. FAIR: ‘A’ (Accessible) berarti…"
        options={["Gratis",
          "Di repositori dengan akses jelas — bukan ‘atas permintaan’",
          "Tanpa login",
          "Mudah dibaca"]}
        correct={1}
        explanation="Benar: 90%+ “atas permintaan” tidak dibalas. Akses = mekanisme, bukan janji."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Berapa SNP acak untuk identifikasi unik?"
        options={["Jutaan",
          "Puluhan (30–80) — cukup dari 10 juta",
          "Semua",
          "Tidak mungkin"]}
        correct={1}
        explanation="Benar: kombinatorik. Anonimisasi nama = ilusi untuk DNA."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. Temuan BRCA1 patogenik di data riset. Langkah tepat?"
        options={["Langsung telepon partisipan",
          "Ikuti protokol consent: validasi lab tersertifikasi + konseling genetik",
          "Abaikan",
          "Publikasikan nama"]}
        correct={1}
        explanation="Benar: riset ≠ diagnosis. Otonomi + validitas sebelum komunikasi."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. Untuk HPC multi-user, container yang tepat?"
        options={["Docker (butuh root)",
          "Singularity/Apptainer (aman tanpa root)",
          "Tanpa container",
          "VM"]}
        correct={1}
        explanation="Benar: Docker daemon butuh root = ditolak admin HPC. Singularity dirancang untuk ini."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Reprodusibilitas = <strong>workflow + container + versi + seed + data</strong>.</li>
          <li><strong>Nextflow/Snakemake</strong> + <strong>Docker/Singularity</strong> = standar.</li>
          <li><strong>FAIR</strong>: Findable, Accessible, Interoperable, Reusable.</li>
          <li>“Tersedia atas permintaan” = tidak tersedia.</li>
          <li>DNA <strong>selalu identifiable</strong> (puluhan SNP cukup).</li>
          <li>Data manusia → <strong>controlled access + etik + consent</strong> sejak awal.</li>
          <li>Keputusan rilis data <strong>satu arah</strong> — standar tertinggi di awal.</li>
          <li>Tata kelola genetik Indonesia: <strong>untuk Indonesia</strong>.</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi16-ml-bio" className="btn btn-secondary btn-sm">← BI16</Link>
        <Link href="/learn/bi18-capstone-de" className="btn btn-primary btn-sm">BI18 →</Link>
      </div>
    </div>
  );
}
