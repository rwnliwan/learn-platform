"use client";
import Quiz from "@/components/Quiz";
import PlotlyChart from "@/components/PlotlyChart";
import PyodideLab from "@/components/PyodideLab";
import Tex from "@/components/Tex";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { useQuizScore } from "@/components/QuizScore";


export default function Bi2DatabasePage() {
  const { handleAnswer, scoreDisplay } = useQuizScore(6);
  const bi2TrustData = [{"x": ["GenBank (primer)", "TrEMBL (otomatis)", "Ensembl", "Swiss-Prot (manual)", "PDB"], "y": [2, 4, 7, 9, 9], "type": "bar", "marker": {"color": "#2a7de1"}, "text": ["2", "4", "7", "9", "9"], "textposition": "outside"}];
  const bi2TrustDataLayout = {"xaxis": {"title": "Database"}, "yaxis": {"title": "Kepercayaan per entri", "range": [0, 11]}, "showlegend": false};

  const lab1Code = "# simulasi mapping NCBI Gene (nama -> ID stabil)\ngenedb = {\n    'TP53': {'id': 7157, 'ensembl': 'ENSG00000141510', 'uniprot': 'P04637'},\n    'BRCA1': {'id': 672, 'ensembl': 'ENSG00000012048', 'uniprot': 'P38398'},\n}\nalias = {'p53': 'TP53', 'trp53': 'TP53 (tikus!)', 'brca1': 'BRCA1'}\nquery = ['p53', 'TP53', 'trp53', 'BRCA1', 'genX']\nfor q in query:\n    resmi = alias.get(q, q)\n    info = genedb.get(resmi)\n    if info:\n        print(f'{q:<8} -> {resmi:<12} ID:{info[\"id\"]} {info[\"ensembl\"]}')\n    else:\n        print(f'{q:<8} -> TIDAK DITEMUKAN / AMBIGU (bahaya!)')\nprint()\nprint('trp53 = gen TIKUS, bukan manusia! Tanpa ID spesies, analisis')\nprint('lintas-spesies tercampur. Selalu sertakan taksonomi.')";

  const lab2Code = "varian = [\n    ('rs1', 0.30, 'jinak'), ('rs2', 0.0001, 'patogenik'),\n    ('rs3', 0.005, 'VUS'), ('rs4', 0.00001, 'patogenik'),\n    ('rs5', 0.02, 'konflik'), ('rs6', 0.0005, 'kemungkinan patogenik'),\n    ('rs7', 0.15, 'jinak'), ('rs8', 0.0002, 'VUS'),\n    ('rs9', 0.001, 'jinak'), ('rs10', 0.00005, 'patogenik'),\n]\nTHR = 0.01\nprint(f\"{'varian':<8} {'freq':>8} {'clinvar':<20} status\")\nkandidat = []\nfor rs, f, cv in varian:\n    if f >= THR:\n        status = 'BUANG (terlalu umum)'\n    elif cv == 'jinak':\n        status = 'BUANG (jinak)'\n    else:\n        status = 'KANDIDAT'; kandidat.append(rs)\n    print(f'{rs:<8} {f:>8.5f} {cv:<20} {status}')\nprint(f'\\nKandidat: {kandidat}')\nprint('VUS & konflik -> butuh kurasi manual + bukti fungsional.')\nprint('Ini pipeline standar diagnosis genomik (lihat BI1 case).')";

  return (
    <div className="container-read" style={{ paddingTop: "var(--sp-8)", paddingBottom: "var(--sp-16)" }}>
      <ProgressBar />
      <Link href="/" className="text-small">← Daftar Materi</Link>

      <div className="lesson-cover">
        <span className="eyebrow">BI2 &mdash; Bioinformatics</span>
        <h1 className="display-title">NCBI, Ensembl, UniProt:<br />Perpustakaan Data Biologi</h1>
        <div className="meta">45–60 menit • 2 lab interaktif • 6 quiz • 1 mini-case</div>
      </div>

      <div className="toc">
        <h3>📑 Daftar Isi</h3>
        <ol>
          <li><a href="#tujuan">Tujuan Pembelajaran</a></li>
          <li><a href="#cerita">Cerita Pembuka: Gen yang Punya 5 Nama</a></li>
          <li><a href="#primer">Database Primer: Arsip Mentah Dunia</a></li>
          <li><a href="#kurasi">Database Kurasi: Pengetahuan yang Dimasak</a></li>
          <li><a href="#variasi">Database Variasi &amp; Populasi</a></li>
          <li><a href="#miskonsepsi">🚨 Miskonsepsi Umum</a></li>
          <li><a href="#tips">💡 Intuisi Kunci</a></li>
          <li><a href="#lab1">🔬 Lab 1: Simulasi Query Entrez</a></li>
          <li><a href="#lab2">🔬 Lab 2: Anotasi Varian dengan Frekuensi Populasi</a></li>
          <li><a href="#peta">🗺️ Peta Keputusan</a></li>
          <li><a href="#case">📋 Mini-Case</a></li>
          <li><a href="#pendalaman">🔎 Pendalaman: Menilai Kepercayaan</a></li>
          <li><a href="#kasus2">🏥 Kasus Lapangan: Memilih Senjata Database yang Tepat</a></li>
          <li><a href="#quiz">✏️ Quiz</a></li>
          <li><a href="#rangkum">📝 Rangkuman</a></li>
        </ol>
      </div>

      <h2 id="tujuan">🎯 Tujuan Pembelajaran</h2>
      <div className="callout">
        <ul>
          <li>Menyebutkan peran tiap database utama: <strong>NCBI/ENA/DDBJ, Ensembl, UCSC, UniProt, PDB, GEO/SRA, TCGA, gnomAD, ClinVar</strong>.</li>
          <li>Membedakan <strong>database primer vs kurasi</strong> dan implikasinya untuk kepercayaan data.</li>
          <li>Menggunakan <strong>aksesi ID</strong> (bukan nama gen!) sebagai identifier stabil.</li>
          <li>Memilih database yang tepat untuk 5 pertanyaan riset tipikal.</li>
        </ul>
      </div>

      <h2 id="cerita">Cerita Pembuka: Gen yang Punya 5 Nama</h2>
      <div className="story">
        <p>Gen p53 — penjaga genom terkenal — punya nama resmi TP53, nama lama p53, ID Ensembl ENSG00000141510, ID UniProt P04637, dan ID NCBI Gene 7157. Analis junior menggabungkan dua dataset: satu pakai “p53”, satu pakai “TP53” — hasilnya: gen terhitung dua kali, analisis berantakan.</p>
      <p>Database biologi lahir untuk kekacauan penamaan ini. Tapi ada belasan database besar, masing-masing dengan filosofi beda. Lesson ini adalah peta perpustakaannya: arsip mentah di lantai 1, pengetahuan kurasi di lantai 2, dan katalog variasi di lantai 3.</p>
      <p>Twist-nya: kekacauan penamaan hanyalah permukaan. Database yang “resmi” pun bisa bertentangan satu sama lain: RefSeq dan Ensembl mendefinisikan transkrip yang berbeda untuk gen yang sama, dan ClinVar pernah mengubah klasifikasi varian dari “patogenik” menjadi “tidak pasti” setelah bukti baru masuk — mengubah rekomendasi klinis pasien. Database bukan kitab suci; ia adalah <strong>konsensus sementara dengan jejak versi</strong>. Lesson ini bukan daftar situs untuk dihafal — ini peta cara menilai seberapa percaya kamu boleh pada tiap klaim.</p>
      </div>

      <h2 id="primer">Database Primer: Arsip Mentah Dunia — Lantai 1</h2>
      <p><strong>Definisi.</strong> <strong>INSDC</strong> (NCBI GenBank / ENA / DDBJ): arsip sekuens mentah yang disubmit peneliti — sinkron tiap hari. <strong>SRA</strong>: arsip bacaan mentah NGS. <strong>GEO</strong>: arsip data ekspresi fungsional.</p>
      <details className="worked">
        <summary>📐 Contoh: menemukan data RNA-seq publik</summary>
        <p>Pertanyaan: ekspresi gen X pada kanker paru.<br />1. Cari di <strong>GEO</strong>: “lung cancer RNA-seq” → seri GSE12345.<br />2. Cek metadata: platform, n sampel, desain.<br />3. Download count matrix (sudah diproses) atau SRA mentah (proses sendiri, BI8).<br />Prinsip: data publik = replikasi gratis. Selalu cek kualitas sebelum percaya (lihat BI10 batch effect!).</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Database primer itu seperti arsip nasional: menyimpan SEMUA dokumen yang masuk, tanpa menilai benar-salah. Kaya, mentah, dan kadang berantakan — tugas menilainya ada padamu.</p>
      <p><strong>Kapan memakai:</strong> Download data mentah untuk analisis ulang; submit datamu sendiri (kewajiban publikasi!).</p>
      <div className="code-header"><span className="code-lang">text</span></div><pre className="codebox">Butuh sekuens gen?      -&gt; NCBI Nucleotide / Ensembl
Butuh bacaan mentah?     -&gt; SRA (Sequence Read Archive)
Butuh data ekspresi?     -&gt; GEO (Gene Expression Omnibus)
ID stabil selalu: aksesi (NM_000059), BUKAN nama!</pre>

      <h2 id="kurasi">Database Kurasi: Pengetahuan yang Dimasak — Lantai 2</h2>
      <p><strong>Definisi.</strong> <strong>Ensembl</strong>: anotasi genom otomatis + manual (gen, transkrip, varian). <strong>UniProt</strong>: protein terkurasi (Swiss-Prot = manual, TrEMBL = otomatis). <strong>PDB</strong>: struktur protein 3D eksperimental. <strong>Gene Ontology (GO) / KEGG</strong>: fungsi gen dan pathway.</p>
      <Tex math={String.raw`\text{Kepercayaan} \propto \frac{\text{kurasi manual}}{\text{volume}}`} block />
      <p><strong>Artinya tiap simbol:</strong></p>
      <ul>
          <li><Tex math={String.raw`\text{kurasi manual}`} />: diteliti manusia ahli (Swiss-Prot, RefSeq)</li>
          <li><Tex math={String.raw`\text{volume}`} />: jumlah entri total</li>
      </ul>
      <p><strong>Interpretasi:</strong> Trade-off abadi: UniProt Swiss-Prot (kurasi manual, ~570rb entri) sangat dipercaya tapi kecil; TrEMBL (otomatis, 250jt+) lengkap tapi berisik. Pilih sesuai kebutuhan: hipotesis klinis → kurasi; screening luas → volume.</p>
      <details className="worked">
        <summary>📐 Contoh: anotasi gen baru ditemukan</summary>
        <p>Gen kandidat dari GWAS (BI12):<br />1. <strong>Ensembl</strong>: posisi, transkrip, varian di sekitarnya.<br />2. <strong>UniProt</strong>: fungsi protein, domain, pathway.<br />3. <strong>GO/KEGG</strong>: pathway apa yang diperkaya (lihat BI9 GSEA).<br />4. <strong>PDB/AlphaFold</strong>: struktur 3D untuk tebakan fungsi (BI15).<br />Empat langkah ini = “anotasi fungsional” standar tiap temuan.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> Database kurasi itu seperti ensiklopedia yang ditulis pustakawan ahli: tidak selengkap arsip, tapi tiap kalimat bisa dipertanggungjawabkan. Untuk klaim yang masuk paper/klinik, rujukannya ke sini.</p>
      <p><strong>Kapan memakai:</strong> Anotasi fungsional, interpretasi varian, enrichment pathway — semua yang butuh “apa arti biologisnya”.</p>

      <PlotlyChart
        data={bi2TrustData}
        title="Tingkat Kurasi vs Kepercayaan (skor ilustratif 1–10)"
        layout={bi2TrustDataLayout}
      />
      <div className="chart-guide">
        <p><strong>Cara membaca:</strong> Batang = seberapa bisa dipercaya satu entri tipikal. Kiri = arsip mentah, kanan = kurasi manual/eksperimental.</p>
        <p><strong>Interpretasi:</strong> Trade-off jelas: makin ke kanan makin dipercaya tapi makin kecil cakupannya. Aturan praktis: eksplorasi boleh dari kiri, kesimpulan harus didukung dari kanan.</p>
      </div>

      <h2 id="variasi">Database Variasi &amp; Populasi — Lantai 3</h2>
      <p><strong>Definisi.</strong> <strong>gnomAD</strong>: frekuensi varian di 800rb+ orang (filter patogenik!). <strong>ClinVar</strong>: interpretasi klinis varian (patogenik vs jinak) dari lab dunia. <strong>TCGA</strong>: atlas genomik kanker multi-omics. <strong>dbSNP</strong>: katalog varian (arsip, bukan vonis).</p>
      <details className="worked">
        <summary>📐 Contoh: menilai varian BRCA1</summary>
        <p>Varian c.123A&gt;T di BRCA1:<br /><strong>gnomAD:</strong> frekuensi 0,0001 (sangat langka) ✓ lolos filter.<br /><strong>ClinVar:</strong> 5 lab: 3 “patogenik”, 2 “VUS” (uncertain) → konflik! Perlu kurasi manual + data fungsional.<br /><strong>dbSNP:</strong> ada rsID — tapi rsID BUKAN vonis, hanya nomor arsip.<br />Pelajaran: tidak ada satu database yang memvonis sendirian.</p>
      </details>
      <p><strong>Kepribadian konsep ini:</strong> gnomAD itu sensus penduduk: ia memberi tahu “varian ini umum atau langka di manusia normal”. ClinVar itu pengadilan: mengumpulkan vonis “patogenik/jinak” dari banyak lab — kadang vonisnya bertentangan, dan itu info penting.</p>
      <p><strong>Kapan memakai:</strong> Interpretasi varian klinis: frekuensi (gnomAD) + vonis (ClinVar) adalah dua pilar. Riset kanker: TCGA.</p>
      <div className="callout callout-warning"><strong>Jebakan dbSNP:</strong> punya rsID tidak berarti varian itu penting/patogenik — dbSNP adalah katalog, bukan pengadilan. Vonis klinis = ClinVar + frekuensi + bukti fungsional + pedoman ACMG.</div>

      <h2 id="miskonsepsi">🚨 Miskonsepsi Umum</h2>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Nama gen cukup sebagai identifier&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Nama berubah (p53 → TP53), ambigu antar spesies, dan satu nama bisa merujuk beberapa lokus. Selalu pakai <strong>aksesi stabil</strong>: Ensembl ID (ENSG...), UniProt (P04637), RefSeq (NM_...). Nama untuk manusia, ID untuk mesin.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;Data di database pasti benar&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> Database primer = arsip tanpa kurasi (salah anotasi, kontaminasi ada). Bahkan kurasi bisa usang. Selalu cek: versi database, tanggal, bukti pendukung (experimental vs predicted). Sitasi database tanpa versi = tidak reproducible.</p>
      </div>
      <div className="myth">
        <p><strong className="t">🚨 Miskonsepsi: &ldquo;ClinVar bilang patogenik = pasti patogenik&rdquo;</strong></p>
        <p><strong>Yang benar:</strong> ClinVar agregat submisi dengan kualitas bervariasi; entri konflik (VUS vs patogenik) umum. Cek: jumlah submitter, bintang review, tanggal. Untuk keputusan klinis, ikuti pedoman ACMG dengan kurasi ahli — bukan satu baris database.</p>
      </div>

      <h2 id="tips">💡 Intuisi Kunci</h2>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Bangun kebiasaan <strong>ID-first</strong>: setiap kali menyebut gen/protein/varian, sertakan ID stabilnya. Ini mencegah 90% kekacauan merge dataset.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Catat <strong>versi database + tanggal akses</strong> di setiap analisis (Ensembl 110, gnomAD v4). Database berubah; hasil tanpa versi tidak bisa direplikasi.</p>
      </div>
      <div className="tip">
        <p><strong>💡 Intuisi:</strong> Untuk eksplorasi cepat pakai web; untuk analisis serius pakai <strong>API/download</strong> (NCBI E-utilities, Ensembl REST, UniProt API). Klik manual tidak scalable dan tidak reproducible.</p>
      </div>

      <h2 id="lab1">🔬 Lab 1: Simulasi Query ID Gen</h2>
      <p>Simulasikan mapping nama → ID stabil dengan kamus. Lihat bagaimana nama ambigu (“p53”) gagal tanpa ID, dan bagaimana versi database memengaruhi hasil.</p>
      <PyodideLab
        title="🔬 Lab 1: Simulasi Query ID Gen"
        hint="Tambahkan nama alias lain (‘TP53’, ‘p53’, ‘TRP53’ tikus). Tanpa ID, merge dataset = tebak-tebakan."
        defaultCode={lab1Code}
      />

      <h2 id="lab2">🔬 Lab 2: Filter Varian ala gnomAD + ClinVar</h2>
      <p>Diberikan 10 varian (frekuensi gnomAD + vonis ClinVar), terapkan pipeline filter diagnosis: frekuensi &lt;1%, vonis tidak “jinak”, prioritaskan patogenik.</p>
      <PyodideLab
        title="🔬 Lab 2: Filter Varian ala gnomAD + ClinVar"
        hint="Ubah threshold frekuensi 0.01 → 0.001. Berapa kandidat tersisa? Inilah kenapa penyakit ultra-langka butuh threshold ketat."
        defaultCode={lab2Code}
      />

      <h2 id="peta">🗺️ Peta Keputusan</h2>
      <div className="decision-card">
        <h3>1. Butuh sekuens/data mentah → NCBI/SRA/GEO</h3>
        <p><strong>Kondisi:</strong> Analisis ulang atau download skala besar.</p>
        <p><strong>Kenapa:</strong> Arsip primer terlengkap; metadata menyertai.</p>
        <p><strong>Contoh nyata:</strong> Download RNA-seq kanker paru publik (GSE...).</p>
      </div>
      <div className="decision-card">
        <h3>2. Butuh anotasi fungsi → Ensembl/UniProt/GO/KEGG</h3>
        <p><strong>Kondisi:</strong> Pertanyaan “apa arti biologisnya”.</p>
        <p><strong>Kenapa:</strong> Kurasi; terhubung ke pathway dan struktur.</p>
        <p><strong>Contoh nyata:</strong> Anotasi gen kandidat GWAS.</p>
      </div>
      <div className="decision-card">
        <h3>3. Interpretasi varian klinis → gnomAD + ClinVar</h3>
        <p><strong>Kondisi:</strong> Vonis patogenik/jinak.</p>
        <p><strong>Kenapa:</strong> Dua pilar: frekuensi populasi + interpretasi lab.</p>
        <p><strong>Contoh nyata:</strong> Filter WES bayi sakit (BI1).</p>
      </div>
      <div className="decision-card">
        <h3>4. Riset kanker multi-omics → TCGA (+ cBioPortal)</h3>
        <p><strong>Kondisi:</strong> Butuh genomik + ekspresi + klinis kanker terintegrasi.</p>
        <p><strong>Kenapa:</strong> Atlas terkurasi dengan data klinis.</p>
        <p><strong>Contoh nyata:</strong> Subtipe molekuler kanker payudara.</p>
      </div>
      <div className="decision-card">
        <h3>5. Struktur protein → PDB / AlphaFold DB</h3>
        <p><strong>Kondisi:</strong> Butuh bentuk 3D.</p>
        <p><strong>Kenapa:</strong> PDB = eksperimental; AlphaFold = prediksi (lihat BI15).</p>
        <p><strong>Contoh nyata:</strong> Tebak efek mutasi pada kantong obat.</p>
      </div>
      <div className="callout" style={{ background: "var(--bg-subtle)", border: "1px solid var(--accent)" }}>
        <h3>🧭 Aturan praktis 10 detik</h3>
        <ol>
          <li>ID stabil, bukan nama gen.</li>
          <li>Catat versi database + tanggal.</li>
          <li>Primer untuk eksplorasi, kurasi untuk kesimpulan.</li>
          <li>rsID ≠ vonis patogenik.</li>
        </ol>
      </div>

      <h2 id="case">📋 Mini-Case: Varian “Patogenik” yang Ternyata Umum di Papua</h2>
      <div className="callout">
        <p>Lab melaporkan varian “patogenik” (ClinVar, 2 submitter) pada pasien Indonesia timur. Dokter panik. Kamu cek gnomAD: frekuensi global 0,0001 — tapi <strong>tidak ada data Papua</strong> di gnomAD (populasi underrepresented).</p>
      <p>Kamu sekuensing 200 kontrol sehat lokal: frekuensi varian <strong>8%</strong> — umum dan tidak terkait penyakit di populasi ini.</p>
        <p><strong>Pertanyaan:</strong> Apa yang terjadi dan apa pelajarannya untuk Indonesia?</p>
        <details className="worked">
          <summary>💡 Pembahasan (klik untuk buka)</summary>
          <p>Vonis “patogenik” berdasarkan populasi Eropa tidak berlaku universal — varian ini polimorfisme lokal yang jinak. Pelajaran ganda: (1) database global bias Eropa; Indonesia butuh referensi genomik sendiri (proyek genom nasional); (2) frekuensi populasi LOKAL adalah filter yang lebih relevan dari vonis impor; (3) untuk pasien Indonesia timur, “tidak ada di gnomAD” ≠ “langka” — bisa jadi “tidak disampling”. Analis bioinformatika Indonesia harus paranoid terhadap bias representasi database — ini isu keadilan juga (lihat HD13).</p>
        </details>
      </div>

      <h2 id="pendalaman">🔎 Pendalaman: Menilai Kepercayaan, Bukan Menghafal Situs</h2>
      <p>Daftar database bisa di-google dalam 10 detik. Yang tidak bisa di-google adalah <strong>penilaian</strong>: kapan mempercayai sebuah entri, kapan mencurigainya, dan apa yang dicatat agar analis lain bisa memverifikasi. Tiga pendalaman ini tentang itu.</p>

      <h3>1. Database bertentangan satu sama lain — dan itu normal</h3>
      <p>RefSeq (NCBI) dan Ensembl adalah dua anotasi genom referensi paling dipakai — dan mereka <strong>tidak sepakat</strong> tentang banyak hal: batas ekson, jumlah transkrip per gen, bahkan simbol gen untuk lokus yang sama. Keduanya benar menurut filosofinya masing-masing (RefSeq konservatif-kurasi manual; Ensembl agresif-otomatis).</p>
      <p>Contoh dampak nyata: kamu menganalisis varian kandidat penyakit memakai anotasi Ensembl, kolega memakai RefSeq — varian yang “missense di ekson 4” versimu bisa jadi “intronik” versinya, karena definisi eksonnya beda. Analisis yang sama, kesimpulan beda, tanpa satu pun yang “salah hitung”.</p>
      <details className="worked">
        <summary>📐 Contoh: jebakan liftover GRCh37 → GRCh38</summary>
        <p>Genom referensi manusia diperbarui: GRCh37 (2009) → GRCh38 (2013). Koordinat <strong>bergeser</strong>: varian di chr1:123.456 (GRCh37) bisa menjadi chr1:145.678 (GRCh38) karena sekuens tambahan/disempurnakan.<br />
        Skenario nyata: database klinik lama mencatat varian patogenik dalam koordinat GRCh37. Kamu memetakan pasien baru (GRCh38) tanpa <em>liftover</em> → varian tidak cocok → pasien “negatif” padahal positif.<br />
        Aturan kerja: <strong>selalu catat assembly</strong> (GRCh37 vs GRCh38 vs T2T-CHM13) di setiap file, setiap laporan, setiap gambar. Koordinat tanpa assembly = alamat tanpa kota.</p>
      </details>

      <h3>2. Klasifikasi varian bisa berubah — catat versinya</h3>
      <p>ClinVar (arsip interpretasi varian klinis) mereklasifikasi ribuan varian tiap tahun. Varian yang 2018 diklaim “patogenik” bisa menjadi “tidak pasti” (VUS) di 2023 setelah data populasi besar (gnomAD) menunjukkan ia terlalu umum untuk menjadi penyebab penyakit langka. Pasien yang dulu “terdiagnosis” tiba-tiba “belum terdiagnosis”.</p>
      <p>Angka konkret: gnomAD v4 mencakup &gt;800.000 eksom/genom. Varian penyebab penyakit Mendel langka seharusnya <strong>jarang</strong> di populasi umum — jika frekuensi alelnya &gt;1% di gnomAD, klaim “penyebab penyakit langka dominan” hampir pasti salah. Inilah gunanya Lab 2 (anotasi frekuensi populasi): ia adalah filter skeptis pertama.</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Jejak versi adalah kejujuran</strong></p>
        <p>Setiap kali mengambil data dari database, catat tiga hal: <strong>nama database + versi/rilis + tanggal akses</strong>. “ClinVar, rilis 2026-01, diakses 2026-10-13”. Tanpa ini, analis lain (termasuk kamu 6 bulan lagi) tidak bisa mereproduksi kesimpulanmu — melanggar prinsip BI17.</p>
      </div>

      <h3>3. Arsip vs pengetahuan: dua lantai, dua cara baca</h3>
      <p>Ingat metafora lantai dari cerita pembuka. Lantai 1 (arsip: SRA, GenBank) menyimpan <strong>data mentah apa adanya</strong> — termasuk yang jelek. Lantai 2 (kurasi: UniProt/Swiss-Prot, RefSeq) menyimpan <strong>konsensus yang dinilai manusia</strong>. Kesalahan pemula: memperlakukan keduanya sama.</p>
      <ul>
        <li>Di arsip: satu sampel RNA-seq bisa gagal QC total — itu bukan “data”, itu sampah yang terdokumentasi. Cek metadata (jumlah read, kualitas) sebelum percaya.</li>
        <li>Di kurasi: entri UniProt bertanda “reviewed” (Swiss-Prot) vs “unreviewed” (TrEMBL, prediksi otomatis) — beda langit-bumi kepercayaannya. Selalu cek badge-nya.</li>
      </ul>
      <details className="worked">
        <summary>📐 Contoh: membaca badge kepercayaan UniProt</summary>
        <p>Kamu mencari protein TP53 manusia:<br />
        <strong>P04637</strong> — badge “Reviewed (Swiss-Prot)”, 393 asam amino, ada sitasi literatur, anotasi fungsi manual. → Percaya untuk laporan klinis.<br />
        Entri TrEMBL acak “A0A…” — “Unreviewed”, prediksi otomatis dari genom, tanpa sitasi. → Boleh untuk eksplorasi, <strong>jangan</strong> untuk kesimpulan akhir.<br />
        Aturan 10 detik: sebelum mengutip angka/fungsi dari database, tanya “reviewed atau unreviewed? versi berapa?” — dua pertanyaan ini menyaring 80% kesalahan kutip.</p>
      </details>

      <h2 id="kasus2">🏥 Kasus Lapangan: Memilih Senjata Database yang Tepat</h2>
      <p>Kamu menerima varian kandidat dari pipeline: <strong>chr2:47.845.211 C&gt;T</strong> (GRCh38), di gen yang dicurigai terkait kardiomiopati. Atasan bertanya: “patogenik atau bukan?” Jawabanmu bergantung pada <strong>database mana yang kamu tanya, dan bagaimana kamu menilainya</strong>. Simulasi keputusan:</p>

      <h3>Putaran 1: gnomAD — “apakah ini umum?”</h3>
      <p>gnomAD v4: frekuensi alel = <strong>0,003%</strong> (3 dari 100.000). Sangat langka — lolos filter frekuensi untuk penyakit langka dominan. Tapi 3 pembawa sehat ada — apakah mereka benar-benar sehat, atau belum bergejala (kardiomiopati onset dewasa!)? <strong>gnomAD bukan kohort “sehat”</strong> — ia kohort populasi umum. Langka ≠ patogenik; ia hanya berarti “tidak bisa dibuang lewat frekuensi”.</p>

      <h3>Putaran 2: ClinVar — “apa kata klinik?”</h3>
      <p>ClinVar: 2 submitter bilang <strong>“Likely pathogenic”</strong> (2021), 1 submitter bilang <strong>“Uncertain”</strong> (2023, lab besar). Konflik! Kamu buka detailnya: yang “likely pathogenic” berbasis 1 keluarga; yang “uncertain” mereview setelah data gnomAD baru menunjukkan frekuensi sedikit lebih tinggi dari perkiraan awal.</p>
      <details className="worked">
        <summary>📐 Contoh: menilai konflik ClinVar</summary>
        <p>Checklist penilaian:<br />
        (1) <strong>Tanggal:</strong> 2023 &gt; 2021 — bukti baru menang.<br />
        (2) <strong>Jumlah bukti:</strong> 1 keluarga vs review berbasis populasi besar — populasi menang untuk klaim frekuensi.<br />
        (3) <strong>Bintang review:</strong> entri tanpa bintang = submitter tunggal tanpa panel ahli.<br />
        Kesimpulan sementara: <strong>VUS condong ke likely pathogenic</strong> — butuh bukti fungsional (mis. uji kanal jantung di sel) sebelum vonis.<br />
        <strong>Interpretasi:</strong> ClinVar adalah <strong>arsip klaim</strong>, bukan vonis. Tugasmu menimbang klaim — persis seperti juri menimbang kesaksian.</p>
      </details>

      <h3>Putaran 3: OMIM + literatur — “apakah gennya masuk akal?”</h3>
      <p>OMIM: gen ini menyandi protein sarkomer jantung; mutasi missense di domain yang sama → kardiomiopati hipertrofik (fenotip cocok dengan pasien!). PubMed: paper 2022 melaporkan varian <strong>di kodon bersebelahan</strong> dengan efek fungsional terbukti (patch-clamp menunjukkan arus abnormal).</p>
      <div className="tip">
        <p><strong className="t">💡 Intuisi: Segitiga bukti varian</strong></p>
        <p>Keputusan varian berdiri di tiga kaki: <strong>populasi</strong> (langka? — gnomAD), <strong>klinik</strong> (dilaporkan? — ClinVar), <strong>fungsi</strong> (merusak protein? — prediksi + literatur). Satu kaki goyah = VUS. Tiga kaki kokoh = patogenik. Tidak ada database tunggal yang memberi ketiganya — analis yang hanya membuka satu situs = juri yang hanya mendengar satu saksi.</p>
      </div>

      <h3>Keputusan akhir &amp; dokumentasi</h3>
      <p>Verdict: <strong>Likely pathogenic</strong> (langka + domain fungsional + fenotip cocok + tetangga kodon terbukti merusak), dengan catatan: butuh segregasi keluarga (apakah anggota keluarga yang sakit membawa varian ini?). Laporan mencantumkan: <strong>gnomAD v4.0 (diakses 2026-10-13), ClinVar 2026-01, GRCh38</strong> — jejak versi yang memungkinkan siapa pun memverifikasi 2 tahun lagi saat klasifikasinya mungkin sudah berubah.</p>

      <h2 id="quiz">✏️ Quiz — Uji Judgment-mu (6 soal)</h2>
      {scoreDisplay}

      <Quiz
        onAnswer={(ok) => handleAnswer(0, ok)}
        question="1. Untuk ID gen yang stabil lintas analisis, pakai…"
        options={["Nama umum (p53)",
          "Aksesi ID (ENSG00000141510 / 7157)",
          "Nama panggilan lab",
          "Nomor urut"]}
        correct={1}
        explanation="Benar: nama berubah dan ambigu; ID stabil. Nama untuk manusia, ID untuk mesin."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(1, ok)}
        question="2. Perbedaan database primer vs kurasi?"
        options={["Tidak ada",
          "Primer = arsip mentah tanpa penilaian; kurasi = diteliti/dianotasi ahli",
          "Kurasi lebih besar",
          "Primer lebih dipercaya"]}
        correct={1}
        explanation="Benar: GenBank/SRA = arsip; Swiss-Prot/RefSeq = kurasi. Eksplorasi dari kiri, kesimpulan dari kanan."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(2, ok)}
        question="3. Varian punya rsID di dbSNP. Artinya…"
        options={["Pasti patogenik",
          "Terdaftar di katalog — BUKAN vonis klinis",
          "Jinak",
          "Tidak ada arti"]}
        correct={1}
        explanation="Benar: dbSNP = nomor arsip. Vonis = ClinVar + frekuensi + bukti fungsional + ACMG."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(3, ok)}
        question="4. Filter PERTAMA paling kuat untuk varian penyakit langka?"
        options={["Warna mata pasien",
          "Frekuensi di gnomAD (harus langka di populasi sehat)",
          "Panjang gen",
          "Jumlah ekson"]}
        correct={1}
        explanation="Benar: penyakit langka ≠ varian umum. Filter frekuensi memangkas 99% kandidat seketika."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(4, ok)}
        question="5. ClinVar: 3 lab patogenik, 2 lab VUS untuk satu varian. Sikap?"
        options={["Ikut mayoritas",
          "Konflik = butuh kurasi manual + bukti tambahan, jangan vonis buta",
          "Abaikan",
          "Pilih yang terbaru"]}
        correct={1}
        explanation="Benar: agregat ≠ kebenaran. Cek bintang review, tanggal, dan bukti pendukung."
      />

      <Quiz
        onAnswer={(ok) => handleAnswer(5, ok)}
        question="6. gnomAD minim data Indonesia timur. Implikasinya?"
        options={["Tidak masalah",
          "“Tidak ada di gnomAD” bisa berarti tak disampling — butuh referensi lokal; waspadai vonis impor",
          "Jangan pakai gnomAD",
          "Semua varian patogenik"]}
        correct={1}
        explanation="Benar: bias representasi database = isu validitas DAN keadilan. Indonesia butuh data genomik sendiri."
      />

      <div className="callout">
        <p><strong>Skor target:</strong> lulus jika ≥ 5 dari 6 benar. Kalau ada yang salah, baca lagi feedback-nya — di situlah pelajarannya.</p>
      </div>

      <h2 id="rangkum">📝 Rangkuman</h2>
      <div className="callout">
        <ul>
          <li>Primer (<strong>INSDC, SRA, GEO</strong>): arsip mentah; kurasi (<strong>Ensembl, UniProt, PDB</strong>): pengetahuan tepercaya.</li>
          <li>Selalu pakai <strong>ID stabil</strong> (aksesi), catat <strong>versi + tanggal</strong>.</li>
          <li>Interpretasi varian = <strong>gnomAD</strong> (frekuensi) + <strong>ClinVar</strong> (vonis) + bukti.</li>
          <li>rsID ≠ patogenik. Konflik ClinVar = kurasi manual.</li>
          <li>Waspadai <strong>bias populasi</strong> database global untuk pasien Indonesia.</li>
          <li>API/download untuk analisis serius; web untuk eksplorasi.</li>
          <li>Anotasi fungsional standar: posisi → protein → pathway → struktur.</li>
          <li>Fondasi untuk BI3 (format), BI6 (alignment), BI9 (RNA-seq).</li>
        </ul>
      </div>

      <hr className="divider-fancy" />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/learn/bi1-biologi-molekuler" className="btn btn-secondary btn-sm">← BI1</Link>
        <Link href="/learn/bi3-format-data" className="btn btn-primary btn-sm">BI3 →</Link>
      </div>
    </div>
  );
}
