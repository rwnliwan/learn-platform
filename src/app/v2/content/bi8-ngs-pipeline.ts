import type { V2Lesson } from "../lib/types";

export const bi8: V2Lesson = {
  slug: "bi8-ngs-pipeline",
  track: "Bioinformatika",
  module: "NGS & Statistik",
  title: "BI8 · QC sampai Variant Calling: Pipeline NGS End-to-End",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Varian hantu Rp2 miliar",
      prose: [
        "Proyek sekuensing 500 pasien menelan Rp2 miliar. Hasil variant calling: 2 juta “varian langka kandidat penyakit”. Tim validasi Sanger 100 kandidat — 93 adalah artefak: adaptor tak ter-trim, mapping buruk di daerah repetitif, strand bias. Rp2 miliar menghasilkan 7 varian asli.",
        "Pipeline NGS bukan sekadar menjalankan tool berurutan — ia adalah rantai yang setiap sambungannya bisa bocor. Twist-nya: 93 artefak dari 100 itu sebenarnya kabar baik — hampir semuanya bisa ditangkap QC murah sebelum validasi mahal. FastQC 10 menit, cek strand bias, cek daerah repetitif: total biaya mendekati nol dibanding Rp2 miliar yang terbakar. Pipeline yang baik bukan yang paling canggih; ia yang gagal dengan keras dan cepat.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga sumber artefak pada kasus ini" },
        { id: "t2", text: "Jelaskan prinsip “fail fast” pada pipeline" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira pipeline = jalankan tool default berurutan. Default untuk data umum; datamu spesifik. Parameter trimming, referensi (hg19 vs hg38!), dan filter harus disesuaikan — dan kamu harus paham tiap tahap agar bisa mendiagnosis saat hasil aneh.",
      },
      reference: "Pipeline = rantai. Tiap sambungan bisa bocor; QC murah menangkapnya.",
    },
    {
      id: "teknologi",
      eyebrow: "Langkah 2 · Teknologi",
      title: "Short-read vs long-read",
      prose: [
        "Illumina (short-read): 150–300 bp, akurasi 99,9%, murah — standar SNP dan indel kecil. PacBio HiFi / ONT (long-read): 10 kb–1 Mb — membaca daerah repetitif dan varian struktural, tapi mahal dengan profil error berbeda.",
        "Analoginya: short-read seperti memotret mural lewat 1 juta foto close-up tajam — detail sempurna, tapi susah merakit gambar besarnya. Long-read seperti foto panorama: buram di detail, tapi struktur besarnya jelas. Kasus nyata: bayi penyakit langka dengan WES Illumina negatif — long-read menemukan delesi 5 kb yang short-read lewatkan. Negatif di satu teknologi ≠ tidak ada varian.",
      ],
      tasks: [
        { id: "t1", text: "Untuk SNP germline rutin, pilih teknologinya" },
        { id: "t2", text: "Untuk delesi besar yang dicurigai setelah WES negatif, pilih teknologinya" },
      ],
      reference: "Illumina = SNP/indel · long-read = struktural/repetitif · kanker kompleks = kombinasi.",
    },
    {
      id: "lab-qc",
      eyebrow: "Langkah 3 · Lab",
      title: "Simulasi QC dan trimming adaptor",
      prose: [
        "Adaptor yang tak terpotong → mapping ngaco di ujung → varian hantu. Di lab ini kamu mensimulasikan fastp/Trimmomatic versi 1 menit: potong adaptor yang menempel, lalu trim basa berkualitas rendah (Q<20) dari ujung 3'.",
        "Aturan: QC sebelum DAN sesudah trimming. Read yang tersisa terlalu pendek (<5 basa) dibuang.",
      ],
      tasks: [
        { id: "t1", text: "Potong adaptor dari sekuens bila menempel" },
        { id: "t2", text: "Trim ujung 3' ber-Q rendah" },
        { id: "t3", text: "Tandai read OK vs BUANG" },
      ],
      expected: "ACGTACGT OK (adaptor terpotong) · TTGGCC OK (ujung ter-trim) · GATTACA OK",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Trimming terlalu agresif sampai read menjadi terlalu pendek untuk mapping unik. Trimming adalah trade-off: buang kualitas buruk, tapi sisakan panjang yang cukup. Cek distribusi panjang setelah trimming, bukan cuma kualitas.",
      },
      hints: [
        "Cari posisi adaptor dengan seq.index(adaptor), potong sampai sana.",
        "Selama huruf kualitas terakhir < 20: potong 1 basa dari ujung.",
        "Kualitas per basa = ord(huruf) - 33.",
      ],
      code: {
        starter: `adaptor = 'AGATCGGAAGAG'\nreads = [\n    ('ACGTACGT' + adaptor, 'IIIIIIIIIIIIIIIIIIII'),\n    ('TTGGCCAA', 'IIIIII##'),\n    ('GATTACA', 'IIIIIII'),\n]\nTHR = 20\n\n# TULIS KODEMU: potong adaptor + trim ujung 3'\nfor seq, qual in reads:\n    if adaptor in seq:\n        i = \n        seq, qual = seq[:i], qual[:i]\n    while qual and (ord(qual[-1])-33) < THR:\n        seq, qual = \n    status = 'OK' if len(seq) >= 5 else 'BUANG (terlalu pendek)'\n    qmin = min((ord(c)-33) for c in qual) if qual else 0\n    print(f'{seq:<12} Qmin~{qmin:<3} {status}')`,
        lockLines: 6,
        solution: `adaptor = 'AGATCGGAAGAG'\nreads = [\n    ('ACGTACGT' + adaptor, 'IIIIIIIIIIIIIIIIIIII'),\n    ('TTGGCCAA', 'IIIIII##'),\n    ('GATTACA', 'IIIIIII'),\n]\nTHR = 20\n\n# TULIS KODEMU: potong adaptor + trim ujung 3'\nfor seq, qual in reads:\n    if adaptor in seq:\n        i = seq.index(adaptor)\n        seq, qual = seq[:i], qual[:i]\n    while qual and (ord(qual[-1])-33) < THR:\n        seq, qual = seq[:-1], qual[:-1]\n    status = 'OK' if len(seq) >= 5 else 'BUANG (terlalu pendek)'\n    qmin = min((ord(c)-33) for c in qual) if qual else 0\n    print(f'{seq:<12} Qmin~{qmin:<3} {status}')`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "ACGTACGT\\s+Qmin~40\\s+OK", label: "adaptor terpotong, read OK", msg: "ACGTACGT + adaptor → potong di index adaptor → 8 basa Q40 → OK." },
          { kind: "stdout_matches", task: "t2", pattern: "TTGGCC\\s+Qmin~40\\s+OK", label: "ujung buruk ter-trim", msg: "TTGGCCAA + 'IIIIII##' → trim 2 basa ujung (Q2) → TTGGCC Q40 → OK." },
          { kind: "stdout_matches", task: "t3", pattern: "GATTACA\\s+Qmin~40\\s+OK", label: "read bersih tetap OK", msg: "GATTACA tanpa adaptor dan kualitas baik → tidak berubah → OK." },
        ],
      },
      reference: "Potong adaptor + trim Q<20 dari ujung 3'. Inilah fastp versi 1 menit.",
    },
    {
      id: "lab-pileup",
      eyebrow: "Langkah 4 · Lab",
      title: "Panggil varian dari pileup: Bayes, bukan voting",
      prose: [
        "Variant caller modern (GATK) bukan menghitung suara — ia memakai model probabilistik: bukti read (likelihood) × pengetahuan populasi (prior). Kualitas tiap bacaan ikut menimbang.",
        "Diberikan pileup di satu posisi (ref=A): 4× A berkualitas tinggi, 2× G berkualitas tinggi. Hitung log-likelihood tiap genotipe (0/0, 0/1, 1/1) dan pilih yang terbaik. Rasakan bedanya dengan voting naif.",
      ],
      formula: String.raw`P(G|D) \propto P(D|G) \times P(G)`,
      formulaNote: "Posterior genotipe ∝ likelihood data × prior populasi. Inilah jantung variant calling.",
      tasks: [
        { id: "t1", text: "Lengkapi perhitungan peluang alel alt per bacaan" },
        { id: "t2", text: "Tentukan genotipe dengan log-likelihood tertinggi" },
      ],
      expected: "0/1 tertinggi (heterozigot) · 1/1 terendah",
      hints: [
        "Peluang error per bacaan: e = 10^(-q/10).",
        "p_alt = f*(1-e) + (1-f)*(e/3); pilih p_alt jika basa = 'G'.",
        "Jumlahkan log peluang tiap bacaan; pakai max(p, 1e-300).",
      ],
      code: {
        starter: `import math\npileup = [('A',35),('A',37),('G',35),('A',36),('G',34),('A',35)]\n\ndef likelihood(genotipe):\n    f = {'0/0': 0.0, '0/1': 0.5, '1/1': 1.0}[genotipe]\n    ll = 0.0\n    for basa, q in pileup:\n        e = 10**(-q/10)\n        # TULIS KODEMU: peluang melihat basa ini bila fraksi alt = f\n        p_alt = \n        p = p_alt if basa == 'G' else (1-p_alt)\n        ll += math.log(max(p, 1e-300))\n    return ll\n\nfor g in ['0/0', '0/1', '1/1']:\n    print(f'{g}: log-likelihood = {likelihood(g):.1f}')\nprint('Vonis = genotipe dengan likelihood tertinggi.')`,
        lockLines: 2,
        solution: `import math\npileup = [('A',35),('A',37),('G',35),('A',36),('G',34),('A',35)]\n\ndef likelihood(genotipe):\n    f = {'0/0': 0.0, '0/1': 0.5, '1/1': 1.0}[genotipe]\n    ll = 0.0\n    for basa, q in pileup:\n        e = 10**(-q/10)\n        # TULIS KODEMU: peluang melihat basa ini bila fraksi alt = f\n        p_alt = f*(1-e) + (1-f)*(e/3)\n        p = p_alt if basa == 'G' else (1-p_alt)\n        ll += math.log(max(p, 1e-300))\n    return ll\n\nfor g in ['0/0', '0/1', '1/1']:\n    print(f'{g}: log-likelihood = {likelihood(g):.1f}')\nprint('Vonis = genotipe dengan likelihood tertinggi.')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "0/1: log-likelihood = -4\\.2", label: "likelihood 0/1 ≈ −4.2", msg: "Dengan 4 A dan 2 G berkualitas tinggi, heterozigot paling mungkin. Cek rumus p_alt." },
          { kind: "stdout_matches", task: "t2", pattern: "1/1: log-likelihood = -\\d+\\.\\d", label: "likelihood 1/1 tercetak", msg: "1/1 harus jauh lebih rendah (4 bacaan A sulit dijelaskan homozigot alt)." },
        ],
      },
      reference: "Caller = hakim Bayes: likelihood × prior, menimbang kualitas tiap bacaan.",
    },
    {
      id: "coverage",
      eyebrow: "Langkah 5 · Coverage",
      title: "Aritmetika coverage yang menentukan segalanya",
      prose: [
        "Coverage = (jumlah read × panjang read) / ukuran genom target. Eksom manusia: ~30 juta basa; target 100x dengan read 150 bp → 20 juta read (10 juta pasang). WGS manusia: 3 miliar basa, target 30x → 600 juta read ≈ 90 miliar basa ≈ ~100 GB FASTQ.",
        "Di atas ~30x (WGS germline), tambahan coverage menaikkan biaya linear tapi akurasi hanya logaritmik — diminishing return. Uang lebih baik untuk tambah sampel. Pengecualian: somatik kanker butuh 100–500x karena varian langka di campuran sel.",
        "MAPQ mengukur keyakinan penempatan: 60 = 1:1.000.000 salah tempat; 0 = menempel di banyak tempat sama baiknya (repetitif!) — read ini tidak informatif untuk varian unik. Filter MAPQ≥20 adalah QC standar.",
      ],
      formula: String.raw`C = \frac{N \times L}{G}`,
      formulaNote: "C = coverage; N = jumlah read; L = panjang read; G = ukuran genom target.",
      tasks: [
        { id: "t1", text: "Hitung read yang dibutuhkan untuk WGS 30x manusia (read 150 bp)" },
        { id: "t2", text: "Jelaskan kenapa MAPQ 0 berbahaya untuk variant calling" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira makin dalam coverage makin baik tanpa batas. Di atas 30–50x (germline), tambahan coverage = uang terbuang. Lebih parah: coverage dalam tanpa filter MAPQ justru memperkuat artefak repetitif.",
      },
      reference: "30x = titik manis WGS germline. MAPQ≥20. BQSR sebelum calling.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: teknologi dan parameter pipeline apa?",
      prose: [
        "Lima skenario yang dihadapi bioinformatikawan:",
        "Skenario 1 — SNP germline rutin untuk diagnosis. → Short-read Illumina 150 bp. Alasan: akurasi 99,9% per basa, murah, dan standar untuk varian kecil. Contoh nyata: panel gen epilepsi 120 gen.",
        "Skenario 2 — Delesi besar dicurigai setelah WES negatif. → Long-read (PacBio HiFi/ONT). Alasan: hanya read yang lebih panjang dari varian yang bisa melihatnya; short-read buta terhadap struktural besar. Contoh nyata: delesi 40 kb penyebab penyakit yang lolos WES.",
        "Skenario 3 — Adaptor masih menempel dan ujung 3′ ber-Q rendah. → Trim/potong dulu, prinsip fail fast. Alasan: sampah di hulu menjadi artefak di hilir; pipeline yang baik berhenti di QC, bukan di laporan akhir. Contoh nyata: 12% read terbuang di QC menyelamatkan satu minggu debugging variant calling.",
        "Skenario 4 — Menentukan target coverage. → WGS germline 30x cukup; somatik kanker 100–500x. Alasan: di atas 30x, akurasi naik logaritmik sementara biaya naik linear — diminishing return; varian somatik 1% butuh depth, bukan harapan. Contoh nyata: panel tumor 500x menemukan mutasi terapi target yang 30x lewatkan.",
        "Skenario 5 — Read multi-map (MAPQ 0) menumpuk di region repetitif. → Buang untuk variant calling; genotipe dari log-likelihood, bukan hitungan mentah. Alasan: read yang bisa berasal dari 50 tempat tidak memberi bukti untuk satu tempat. Contoh nyata: “varian” di gen dengan pseudogen yang hilang setelah filter MAPQ.",
        "Aturan praktis 10 detik: germline rutin → short-read; struktural → long-read; QC gagal → berhenti; coverage di atas 30x = diminishing return kecuali somatik."
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menambah coverage 30x menjadi 60x berharap varian somatik 1% muncul — tidak akan; yang dibutuhkan depth target 100–500x plus caller somatik (Mutect2), bukan sekadar data lebih banyak.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Varian “patogenik” dari ujung read",
      prose: [
        "Pipeline memanggil varian nonsense kandidat penyakit. Validasi Sanger: negatif. Investigasi IGV: semua read pendukung varian menumpuk di ujung 3' read dengan kualitas menurun — dan hanya di satu strand.",
        "Artefak klasik: error sekuensing di ujung read berkualitas rendah + strand bias. Perbaikan: trimming lebih agresif (sliding window Q20); abaikan varian yang hanya didukung ujung read atau satu strand (filter FS/SOR GATK); naikkan threshold GQ untuk kandidat klinis; SOP: IGV spot-check SEMUA kandidat klinis sebelum lapor.",
        "Pelajaran: satu filter yang tepat (strand bias) menghemat 93 validasi Sanger sia-sia dari cerita pembuka. QC bukan birokrasi — ia adalah penghematan.",
      ],
      tasks: [
        { id: "t1", text: "Diagnosis: jelaskan dua tanda artefak pada kasus ini" },
        { id: "t2", text: "Sebutkan tiga perbaikan pipeline" },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Varian artefak yang lolos ke laporan klinis = diagnosis salah = terapi salah. Di risiko klinik, IGV spot-check kandidat adalah kontrol terakhir yang murah; melewatkannya menukar menit kerja dengan keselamatan pasien.",
      },
      reference: "Varian asli muncul di kedua strand. IGV untuk semua kandidat klinis.",
    },
    {
      id: "adv-qc-lanjut",
      eyebrow: "Langkah 8 · Advanced",
      title: "QC lanjutan: GC bias, duplikasi, dan kapan berhenti",
      prose: [
        "FastQC dasar (per-base quality) baru pembuka. QC lanjutan membaca tiga sinyal yang sering dilewatkan. Pertama, GC bias: plot coverage vs kandungan GC per window — library PCR-heavy menunjukkan coverage anjlok di daerah sangat AT-rich atau GC-rich (bias amplifikasi). Solusinya di hulu: library PCR-free hampir menghilangkan bias ini. Jika bias terlihat, variant calling di daerah ekstrem menjadi tidak andal: heterozigot di sana punya allelic balance yang miring.",
        "Kedua, laju duplikasi: pada WGS 30x manusia, duplikasi PCR > 20% adalah tanda library kompleksitas rendah (input DNA sedikit atau over-amplifikasi) — read duplikat tidak menambah informasi (mereka klon dari fragmen yang sama) dan wajib ditandai (Picard MarkDuplicates) sebelum variant calling. Aturan: duplikasi tinggi + coverage rendah = sekuensing ulang lebih murah daripada menganalisis noise.",
        "Ketiga, per-base sequence content dan adapter content: pola non-random di 10 basa pertama (bias random priming, normal pada RNA-seq) vs lonjakan adapter di ujung 3' (tanda insert pendek — wajib trim). Bedakan keduanya sebelum memangkas membabi buta.",
        "Prinsip “fail fast” yang profesional: agregatkan semua QC dengan MultiQC menjadi satu laporan HTML, tetapkan ambang go/no-go SEBELUM pipeline jalan (mis. Q30 > 80%, duplikasi < 20%, proper-pair > 85%), dan hentikan sampel yang gagal di QC — bukan setelah variant calling selesai. Biaya sekuensing ulang satu sampel jauh lebih murah daripada biaya menganalisis dan menjelaskan artefak selama berminggu-minggu.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa read duplikat tidak menambah informasi untuk variant calling" },
        { id: "t2", text: "Sampel WGS: duplikasi 35%, Q30 70%. Keputusanmu dan alasannya" },
      ],
      reference: "GC bias → curigai PCR · duplikasi >20% = library buruk · MultiQC + ambang go/no-go di awal.",
    },
    {
      id: "adv-depth-coverage",
      eyebrow: "Langkah 9 · Advanced",
      title: "Depth vs breadth: berapa dalam yang cukup?",
      prose: [
        "Coverage (C = N×L/G) punya dua dimensi: breadth (berapa % genom tercakup ≥1x) dan depth (rata-rata tumpukan per basa). Keduanya menjawab pertanyaan berbeda. Standar industri: WGS germline 30x (~90 Gb untuk manusia 3 Gb) — cukup untuk memanggil heterozigot dengan keyakinan tinggi di sebagian besar genom. Exome 100x — karena target kecil (1,5%) tapi capture tidak merata. Panel kanker/tumor-normal 500x+ — karena butuh mendeteksi varian somatik frekuensi rendah (5% VAF butuh ratusan read untuk dibedakan dari error).",
        "Diminishing returns itu nyata dan terukur: menaikkan WGS dari 30x ke 60x menggandakan biaya tapi hanya menambah ~1–2% sensitivitas heterozigot — kurva sensitivitas mendatar setelah ~30x untuk germline. Uang yang sama lebih baik dipakai untuk menambah SAMPEL (power asosiasi) daripada memperdalam sampel yang sama. Pengecualian: aplikasi yang memang butuh depth ekstrem — deteksi mosaic, ctDNA, atau heteroplasmi mitokondria.",
        "Breadth tanpa depth menipu: “tercakup 95% genom” pada 5x tidak cukup untuk genotipe andal — satu basa dengan 2 read tidak bisa membedakan heterozigot dari error sekuensing. Aturan: untuk genotipe, yang penting adalah % basa dengan depth ≥ 10–20x, bukan % basa dengan ≥ 1x.",
        "Aturan keputusan praktisi: sesuaikan depth dengan pertanyaan — skrining germline 30x WGS (atau 100x exome bila budget terbatas), somatik tumor-normal ≥ 100x tumor, validasi varian kandidat bisa Sanger (bukan NGS lebih dalam). Dan catat: depth yang dilaporkan selalu “setelah deduplikasi dan pemetaan” — depth mentah 40x bisa berarti 28x usable.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa 60x WGS jarang sebanding biayanya dibanding 30x untuk germline" },
        { id: "t2", text: "Untuk deteksi varian somatik VAF 5%, pilih depth dan alasannya" },
      ],
      reference: "Germline 30x · exome 100x · somatik 500x+ · depth usable = setelah dedup · breadth ≠ genotipe.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Tujuh pertanyaan campuran dari semua langkah. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: pipeline adalah pabrik, QC adalah satpamnya",
        body: "Empat heuristik operator pipeline NGS senior. Pertama, berpikir seperti pabrik: tiap tahap punya input, output, dan spesifikasi mutu — dan satpam (QC) berdiri DI ANTARA tahap, bukan hanya di ujung. Sampel yang gagal QC di tengah jalan dihentikan di tengah jalan; membiarkannya mengalir hanya memproduksi artefak yang mahal. Kedua, curigai angka yang terlalu bagus: duplikasi 0% pada library PCR, atau “100% terpetakan” — keduanya lebih sering menandakan parameter atau laporan yang salah daripada data sempurna. Ketiga, bedakan depth mentah dari depth usable: yang menentukan kualitas genotipe adalah depth setelah deduplikasi, pemetaan, dan filter kualitas — biasanya 20–30% lebih rendah dari angka brosur. Keempat, dokumentasikan SEMUA versi tool dan parameter (MultiQC menyimpan ini otomatis bila dikonfigurasi): pipeline yang tidak bisa dijalankan ulang dengan hasil sama bukan pipeline, melainkan kenangan. Reviewer, regulator, dan dirimu 2 tahun lagi akan menanyakan hal yang sama.",
      },
      summary: [
        "Pipeline: QC → trim → map → call → anotasi; checkpoint QC tiap tahap.",
        "Illumina untuk SNP/indel; long-read untuk struktural/repetitif.",
        "BWA untuk DNA, STAR untuk RNA (splice-aware); filter MAPQ.",
        "Caller = Bayes (likelihood × prior), bukan voting.",
        "Coverage >30–50x diminishing return (germline).",
        "Validasi kandidat kunci: IGV + orthogonal.",
      ],
      next: { label: "BI9 · RNA-seq: Gen Apa yang Berubah", href: "/v2/learn/bi9-rna-seq" },
      quiz: [
        {
          q: "Sampel WGS menunjukkan duplikasi 35% dan Q30 hanya 70%. Tindakan paling tepat?",
          options: [
            { text: "Lanjut variant calling — depth bisa dikompensasi filter ketat", why: "Filter tidak menciptakan informasi yang tidak ada; library buruk = data buruk." },
            { text: "Hentikan di QC dan sekuensing ulang — library kompleksitas rendah", why: "Duplikasi 35% berarti sepertiga read adalah klon tanpa info baru; Q30 70% di bawah standar. Fail fast.", correct: true },
            { text: "Naikkan depth komputasi dengan duplikasi read", why: "Menduplikasi read artifisial tidak menambah bukti independen — ini fabrikasi coverage." },
            { text: "Turunkan ambang Q30 menjadi Q20", why: "Mengubah ambang agar lolos adalah menyembunyikan masalah, bukan menyelesaikannya." },
          ],
        },
        {
          q: "Untuk skrining varian germline, tim mengusulkan WGS 60x untuk semua sampel dengan budget tetap. Evaluasimu?",
          options: [
            { text: "Setuju — semakin dalam semakin baik selalu", why: "Diminishing returns: 30x→60x hanya +~1–2% sensitivitas heterozigot dengan biaya 2x." },
            { text: "Tolak — 30x cukup untuk germline; sisa budget untuk tambah sampel (power)", why: "Kurva sensitivitas mendatar setelah ~30x. Untuk asosiasi, n lebih berharga daripada depth berlebih.", correct: true },
            { text: "Setuju — breadth 100% butuh 60x", why: "Breadth ≥1x bukan ukuran genotipe; yang penting % basa pada depth ≥10–20x." },
            { text: "Tolak — 60x terlalu dangkal untuk germline", why: "Terbalik: 60x lebih dari cukup; 30x adalah standar industri germline." },
          ],
        },
        {
          q: "Urutan pipeline NGS yang benar?",
          options: [
            { text: "Calling → mapping → QC", why: "Tidak bisa memanggil varian sebelum read ditempelkan." },
            { text: "QC → trimming → mapping → calling → anotasi", why: "Gerbang QC dulu, baru tempel, baru panggil, baru tafsir. Urutan = logika ketergantungan.", correct: true },
            { text: "Anotasi dulu", why: "Anotasi butuh daftar varian — ia di akhir." },
            { text: "Bebas", why: "Urutan menentukan validitas; acak = artefak." },
          ],
        },
        {
          q: "MAPQ = 0 artinya…",
          options: [
            { text: "Sempurna", why: "Sempurna justru MAPQ 60." },
            { text: "Read menempel di banyak tempat sama baiknya (repetitif) — tidak informatif", why: "Jangan panggil varian dari MAPQ 0 — itu sumber varian hantu.", correct: true },
            { text: "Error", why: "Bukan error; ia informasi tentang ambiguitas penempatan." },
            { text: "Belum di-mapping", why: "Itu flag unmapped (0x4), bukan MAPQ 0." },
          ],
        },
        {
          q: "Untuk RNA-seq, mapper yang tepat?",
          options: [
            { text: "BWA-MEM", why: "BWA tidak menangani lompatan intron (splice junction)." },
            { text: "STAR (splice-aware: menangani lompatan intron)", why: "Read RNA melintasi splice junction. Mapper DNA akan gagal/salah.", correct: true },
            { text: "Bowtie2 selalu", why: "Bowtie2 cepat tapi bukan splice-aware default untuk RNA." },
            { text: "BLAST", why: "BLAST untuk pencarian homologi, bukan mapping NGS." },
          ],
        },
        {
          q: "Variant caller modern memutuskan genotipe dengan…",
          options: [
            { text: "Voting mayoritas", why: "Voting mengabaikan kualitas bacaan — itu cara artefak lolos." },
            { text: "Model probabilistik (likelihood × prior) yang menimbang kualitas", why: "Hakim Bayes, bukan demokrasi. Kualitas, strand, dan prior ikut menimbang.", correct: true },
            { text: "Lempar koin", why: "Jelas bukan." },
            { text: "Panjang read", why: "Panjang read bukan penentu genotipe." },
          ],
        },
        {
          q: "Kapan long-read dipilih atas Illumina?",
          options: [
            { text: "Selalu", why: "Long-read lebih mahal dan error profilnya beda; bukan default." },
            { text: "Varian struktural, daerah repetitif, assembly — yang short-read buta", why: "Panorama vs close-up. Pilih sesuai pertanyaan, bukan tren.", correct: true },
            { text: "Tidak pernah", why: "Untuk struktural/repetitif, long-read tak tergantikan." },
            { text: "Hanya untuk RNA", why: "Long-read DNA justru aplikasi utamanya di sini." },
          ],
        },
      ],
    },
  ],
};
