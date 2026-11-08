import type { V2Lesson } from "../lib/types";

export const hd1: V2Lesson = {
  slug: "hd1-sistem-kesehatan",
  track: "Health Data Science",
  module: "Fondasi Data Kesehatan",
  title: "HD1 EHR, Klaim & Registri: Dari Mana Data Kesehatan Berasal",
  estMinutes: 50,
  steps: [
    {
      id: "lima-cerita",
      eyebrow: "Langkah 1 · Sumber data",
      title: "Satu pasien, lima versi cerita",
      prose: [
        "Pak Budi, 58 tahun, diabetes. Di EHR puskesmas tercatat: gula darah 240, diberi metformin. Di klaim BPJS tercatat: satu kunjungan rawat jalan dengan tarif INA-CBG sekian rupiah — tanpa angka gula darahnya. Di registri diabetes (kalau ia terdaftar) tercatat: HbA1c tiap 6 bulan selama 5 tahun. Di smartwatch-nya: detak jantung dan langkah harian. Di hasil lab: file PDF terpisah.",
        "Lima sumber, lima versi cerita tentang orang yang sama — dan tidak ada satu pun yang lengkap sendirian. Data kesehatan terfragmentasi sejak lahir, karena tiap sumber dibuat untuk tujuan berbeda. Analis yang tidak paham tujuan asli tiap sumber akan menarik kesimpulan dari cerita yang salah.",
        "Twist-nya: sumber yang paling lengkap secara klinis (EHR) justru yang paling tidak bisa dipercaya untuk riset tanpa pembersihan — sementara sumber yang paling dangkal (klaim, tanpa satu pun angka lab) justru yang paling berguna untuk kebijakan populasi. Di data kesehatan, kelengkapan tidak sama dengan kebenaran.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira data EHR bisa langsung dipakai untuk riset karena digital dan lengkap. EHR dikumpulkan untuk melayani pasien, bukan untuk dianalisis: field yang penting untuk analis (gaya hidup, outcome jangka panjang) justru yang paling sering kosong, dan pengisiannya mengikuti insentif klinis atau billing.",
        type: "pitfall",
      },
      reference: "Tujuan asli pengumpulan data menentukan kolom mana yang bisa dipercaya.",
    },
    {
      id: "kelengkapan-ehr",
      eyebrow: "Langkah 2 · EHR",
      title: "EHR: catatan kaya tapi berlubang",
      prose: [
        "EHR (di Indonesia: RME/Rekam Medis Elektronik, mis. SATUSEHAT) adalah catatan klinis digital: diagnosis, tindakan, obat, hasil lab, dan narasi dokter. Tujuan aslinya melayani pasien, bukan untuk dianalisis.",
        "Ukur dulu kelengkapan tiap field sebelum memakainya. Contoh: dari 100 record rawat jalan, field “riwayat merokok” terisi di 35 record → kelengkapan 35%. Aturan praktis: field di bawah 70% jangan dipakai untuk analisis faktor risiko tanpa investigasi mekanisme missing-nya (lihat HD8).",
        "Pola yang universal: field administratif dan penagihan (diagnosis, obat) hampir 100% terisi karena memengaruhi pembayaran; field perilaku (merokok, alergi) jeblok di 35–40%. Data terisi mengikuti insentif pengisinya, bukan kebutuhan analismu.",
      ],
      formula: String.raw`\text{kelengkapan} = \frac{\text{field terisi}}{\text{field wajib}} \times 100\%`,
      formulaNote: "kelengkapan = persentase field yang terisi dari field yang wajib diisi — metrik kualitas data paling dasar. field terisi = jumlah record dengan field terisi nilai valid (bukan kosong, bukan “-”, bukan “tidak tahu”); field wajib = jumlah record × jumlah field yang seharusnya diisi menurut definisi. ×100% = jadikan persen. Interpretasi: kelengkapan 35% untuk “riwayat merokok” berarti analisis faktor risiko di atasnya berdiri di atas 35% data — laporkan angkanya, selidiki polanya (apakah yang kosong = yang tidak ditanya = bias?), jangan diam-diam menghapus.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira 35% dari 1.000 record (350 data) sudah cukup untuk analisis. Bahayanya bukan jumlahnya, tapi mekanismenya: dokter mencatat merokok saat relevan klinis, jadi missing-nya tidak acak dan menimbulkan bias sistematis.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Dari 200 record, field “aktivitas fisik” terisi di 90 record. Kelengkapannya dan implikasinya?",
          options: [
            { text: "45%; di bawah 70% — jangan dipakai untuk analisis faktor risiko tanpa investigasi", why: "90/200 = 45%. Di bawah ambang 70%, field ini butuh investigasi mekanisme missing sebelum dipakai.", correct: true },
            { text: "45%; tetap aman karena 90 record sudah banyak", why: "Jumlah bukan penentunya — mekanisme missing yang tidak acak bisa membiaskan 90 record itu." },
            { text: "55%; cukup untuk analisis apa pun", why: "Hitungannya salah: 90/200 = 45%, bukan 55%." },
            { text: "45%; bias hanya masalah bila data besar", why: "Bias sistematis tidak peduli ukuran data — 90 record yang missing-nya tidak acak tetap bias, sekecil apa pun datasetnya." },
          ],
        },
      ],
      reference: "Kelengkapan = terisi/wajib × 100%. Ambang lampu kuning: 70%.",
    },
    {
      id: "klaim-grain",
      eyebrow: "Langkah 3 · Klaim & grain",
      title: "Klaim: struk belanja sistem kesehatan",
      prose: [
        "Data klaim (di Indonesia: BPJS Kesehatan) mencatat apa yang ditagihkan: kode diagnosis (ICD-10), tindakan, dan tarif INA-CBG per episode perawatan. Tujuan aslinya pembayaran, bukan kebenaran klinis.",
        "Seperti struk belanja: rapi, terstandar, mencakup hampir seluruh populasi peserta — tapi hanya mencatat yang dibayar. Obat yang dibeli sendiri di apotek tidak ada. Pasien yang tidak berobat tidak ada. Klaim jujur soal uang, bisu soal kesehatan yang sebenarnya.",
        "Tulis grain tiap sumber dalam satu kalimat sebelum melaporkan angka: satu baris EHR = satu kunjungan, satu baris klaim = satu episode penagihan. Satu pasien bisa punya 5 kunjungan EHR tapi 2 episode klaim — “biaya rata-rata” bisa tiga angka berbeda tergantung pembaginya. Sebagian besar kesalahan analisis data kesehatan berakar dari salah grain, bukan salah model.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Menghitung prevalensi diabetes dari klaim BPJS hanya menangkap diabetes yang terdiagnosis dan berobat. Riskesdas 2018 menemukan prevalensi 10,9% sementara klaim hanya 4,2% — memakai angka klaim sebagai prevalensi akan meremehkan beban penyakit secara sistematis dan menyesatkan perencanaan program.",
        type: "risk",
      },
      quiz: [
        {
          q: "Untuk proyeksi beban biaya komplikasi diabetes per provinsi, sumber terbaik?",
          options: [
            { text: "Data klaim BPJS", why: "Klaim unggul di cakupan populasi dan biaya terstandar INA-CBG — tepat untuk pertanyaan beban biaya.", correct: true },
            { text: "Catatan narasi EHR satu RS", why: "Satu RS tidak mewakili provinsi; narasi EHR juga tidak terstandar untuk agregasi biaya." },
            { text: "Data smartwatch pasien", why: "Wearable memberi data fisiologis kontinu, bukan data biaya populasi." },
            { text: "Registri diabetes provinsi", why: "Registri dalam tapi cakupannya terbatas pada kasus terdaftar — untuk proyeksi biaya populasi provinsi, klaim BPJS tetap yang paling representatif." },
          ],
        },
      ],
      reference: "Klaim = utilisasi layanan, bukan potret kesehatan populasi.",
    },
    {
      id: "peta-sumber",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Memilih sumber untuk pertanyaanmu",
      prose: [
        "Enam sumber utama, masing-masing lahir untuk tujuan berbeda. Butuh perjalanan klinis detail per pasien (urutan gejala → diagnosis → respons obat)? Pakai EHR. Butuh biaya dan utilisasi populasi? Pakai klaim BPJS. Butuh outcome jangka panjang satu penyakit (survival kanker 5 tahun)? Pakai registri. Butuh sinyal cepat wabah? Pakai surveilans (EWARS). Butuh data fisiologis kontinu? Pakai wearable. Butuh data paling bersih untuk efikasi obat? Pakai trial klinis.",
        "Trade-off fundamentalnya: EHR dalam tapi sempit (satu faskes), klaim luas tapi dangkal (tanpa angka lab), registri dalam tapi hanya satu penyakit, surveilans cepat tapi kasar, trial bersih tapi populasinya terseleksi. Tidak ada sumber yang menang di semua dimensi — pilih berdasarkan pertanyaan, bukan berdasarkan data yang paling gampang diakses.",
        "Aturan praktis 10 detik: tanya tujuan asli pengumpulan data sebelum buka file; tulis grain dalam satu kalimat; cek kelengkapan per field (di bawah 70% = lampu kuning); ingat klaim = utilisasi, bukan kesehatan sebenarnya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira makin besar data kesehatan, makin benar kesimpulannya. Big data memperkecil sampling error tapi tidak menyentuh bias sistematis: satu juta record klaim tetap meremehkan prevalensi diabetes yang tidak terdiagnosis — biasnya justru makin presisi, salah dengan keyakinan tinggi.",
        type: "pitfall",
      },
      reference: "Pilih sumber dari pertanyaan, bukan dari ketersediaan data.",
    },
    {
      id: "minicase-diabetes",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Tiga angka diabetes yang bertengkar",
      prose: [
        "Kepala Dinkes menaruh tiga angka di mejamu: klaim BPJS 4,2%, Riskesdas 10,9%, skrining posbindu kabupaten 14,1%. Ia bertanya mana yang benar. Analis senior tidak memilih satu — ia menjelaskan ketiganya.",
        "Tulis definisi operasional tiap angka. Klaim 4,2% = peserta dengan kode E10–E14 dalam setahun (butuh: terdiagnosis + berobat ke faskes + terkode benar). Riskesdas 10,9% = sampel populasi yang dites gula darah langsung. Skrining posbindu 14,1% = pengunjung posbindu yang dites — bukan sampel acak, melainkan yang datang (self-selection), cenderung lansia dan merasa berisiko.",
        "Rantai seleksinya: dari 100 penderita sebenarnya, sekitar 60 tidak tahu dirinya sakit (hilang dari klaim); dari 40 yang tahu, sebagian berobat mandiri; sisanya terkode. Angka klaim adalah hasil perkalian empat filter, bukan cermin prevalensi. Untuk perencanaan anggaran obat pakai klaim (yang dibayar adalah yang berobat); untuk target skrining pakai Riskesdas (kesenjangan diagnosis ~6,7 poin persen adalah pekerjaan rumah skrining); untuk evaluasi posbindu pakai 14,1% sebagai yield program, bukan prevalensi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Menyajikan angka klaim 4,2% sebagai prevalensi ke Kepala Dinkes tanpa kualifikasi akan mengecilkan target skrining dan salah mengalokasikan anggaran program. Selalu pasangkan angka dengan definisi operasionalnya.",
        type: "risk",
      },
      reference: "Simpan kamus tiga angka per indikator: angka layanan, angka populasi, angka program.",
    },
    {
      id: "record-linkage",
      eyebrow: "Langkah 6 · Taut",
      title: "Record linkage: menyatukan lima cerita",
      prose: [
        "Lima sumber, lima cerita — dan analis harus menyatukannya per pasien. Record linkage adalah tekniknya, dengan dua mazhab: deterministic (cocok persis pada NIK, atau nama+tanggal lahir — presisi tinggi, recall rendah bila data kotor) vs probabilistic ala Fellegi-Sunter (skor kecocokan dari bobot tiap field: NIK cocok = bobot besar, nama mirip = bobot kecil; di atas ambang = match, di bawah ambang = non-match, di antaranya = review manual). Aturan kerja: mulai deterministic, ukur residunya, baru probabilistic untuk sisanya — jangan langsung fuzzy matching ke sejuta baris.",
        "Tiga jebakan linkage: (a) false match — dua orang berbeda tertaut (NIK salah ketik yang kebetulan cocok) → riwayat klinis tercampur, bisa fatal bila menyangkut alergi obat; (b) missed match — orang yang sama tak tertaut (“Siti” vs “Siti Rahayu”) → pasien terpecah dua, utilisasi dan biaya underestimated; (c) duplikat dalam satu sumber — satu orang dua nomor rekam medis. Ukur selalu: precision dan recall linkage pada sampel yang divalidasi manual (n=200 cukup) — bukan “kelihatannya cocok”.",
        "Konteks surveilans Kemenkes: data surveilans (SKDR/EWARS) dinilai bukan dari kelengkapan saja, melainkan tiga dimensi — completeness (berapa persen faskes melapor), timeliness (berapa persen melapor TEPAT WAKTU — laporan DBD yang datang 3 minggu terlambat tidak berguna untuk respons KLB), validity (berapa persen lolos cek logika). Laporan “kelengkapan 95%” yang 60%-nya terlambat adalah 95% yang menipu. Minta ketiganya, selalu.",
        "Infrastruktur jawabannya: Master Patient Index (MPI) — satu identitas per orang lintas sistem, dengan aturan survivorship (bila EHR dan klaim beda tanggal lahir, mana yang menang? tetapkan hierarki sumber). Tanpa MPI, setiap analisis multi-sumber mengulang linkage dari nol — dan setiap analis membuat keputusan berbeda. MPI adalah investasi sekali, dipakai selamanya; tanpanya, “satu pasien satu cerita” tetap slogan.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: tulis kebohongannya, tetapkan ambang, rekonsiliasi",
        body: "Setiap sumber data berbohong tentang sesuatu — tugasmu tahu tentang apa. EHR berbohong soal kelengkapan (yang tercatat rapi adalah yang ditagih); klaim berbohong soal klinis (kode dipilih untuk tarif); surveilans berbohong soal ketepatan waktu (yang melapor cepat belum tentu yang akurat); survei berbohong soal kejujuran (responden menyenangkan pewawancara). Heuristik praktisi: sebelum memakai sumber apa pun, tulis satu kalimat “kebohongan”nya — “klaim = utilisasi, bukan prevalensi” — dan tempel di atas setiap grafik yang kamu buat darinya. Heuristik kedua: linkage bukan soal teknologi, soal keputusan. Setiap ambang probabilistic adalah keputusan “berapa false match yang bisa kuterima?” — jawab dengan angka (mis. <1% false match untuk data klinis), bukan dengan “pakai default library”. Heuristik ketiga: bila dua sumber bertengkar (klaim 4,2% vs Riskesdas 10,9%), jangan pilih pemenang — jelaskan rantai seleksinya seperti di lesson ini; analis yang merekonsiliasi dipercaya, analis yang memilih satu angka dicurigai. Tiga kebiasaan — tulis kebohongannya, tetapkan ambang dengan angka, rekonsiliasi bukan memilih — membuat analis multi-sumber menjadi penerjemah yang dipercaya, bukan tukang sulap angka.",
      },
      quiz: [
        {
          q: "Untuk data klinis (riwayat alergi obat), linkage probabilistic menghasilkan 3% false match. Tindakan?",
          options: [
            { text: "Ketatkan ambang / tambah review manual — false match klinis bisa fatal", why: "Benar: tercampurnya riwayat alergi = risiko keselamatan pasien. <1% adalah target.", correct: true },
            { text: "Terima saja, 3% kecil", why: "3% dari sejuta pasien = 30.000 riwayat tercampur — tidak kecil." },
            { text: "Longgarkan ambang agar recall naik", why: "Itu menambah false match — arah yang salah untuk data klinis." },
            { text: "Hapus data yang ambigu", why: "Menghapus 3%+ data merusak representasi; perbaiki linkage-nya." },
          ],
        },
        {
          q: "Dinkes melaporkan “kelengkapan laporan DBD 95%”. Pertanyaan lanjut yang wajib?",
          options: [
            { text: "Berapa persen yang tepat waktu dan lolos validitas?", why: "Benar: completeness tanpa timeliness & validity = angka menipu untuk respons KLB.", correct: true },
            { text: "Sudah cukup, 95% bagus", why: "Bagus di atas kertas; KLB butuh kecepatan dan kebenaran." },
            { text: "Minta datanya dalam Excel", why: "Format tidak menjawab kualitas." },
            { text: "Bandingkan dengan tahun lalu", why: "Berguna, tapi tidak menggantikan tiga dimensi kualitas." },
          ],
        },
      ],
      reference: "Linkage = keputusan ambang dengan angka. Surveilans dinilai 3 dimensi: lengkap, tepat waktu, valid.",
    },
    {
      id: "lab-linkage",
      eyebrow: "Langkah 7 · Lab",
      title: "Hitung linkage rate dua arah",
      prose: [
        "EHR puskesmas: 1.000 pasien (dengan NIK). Klaim BPJS: 950 episode. Linkage deterministik via NIK menghasilkan 880 pasangan cocok. Tugasmu: hitung `link_ehr` (proporsi pasien EHR yang tertaut ke klaim) dan `link_klaim` (proporsi klaim yang tertaut ke EHR). Perhatikan asimetrinya — dan tanyakan: siapa 120 pasien EHR yang tak tertaut, dan siapa 70 klaim yang tak tertaut?",
        "Jawaban yang jujur: 120 pasien EHR tanpa klaim = kemungkinan pasien tunai/mandiri atau berobat di luar BPJS; 70 klaim tanpa EHR = kemungkinan salah ketik NIK di salah satu sisi (kandidat missed match untuk linkage probabilistic tahap dua). Linkage rate bukan nilai akhir — ia peta sisa pekerjaan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `link_ehr` (EHR → klaim)" },
        { id: "t2", text: "Hitung `link_klaim` (klaim → EHR)" },
      ],
      expected: "link_ehr=0.880 link_klaim=0.926",
      note: {
        title: "Sering salah",
        body: "Melaporkan satu angka “linkage 88%” tanpa arah. 88% dari sisi mana? Asimetri 88% vs 92,6% memberi tahu ke mana sisa pekerjaan: 120 pasien tunai vs 70 kandidat salah ketik — dua masalah yang obatnya berbeda.",
        type: "pitfall",
      },
      hints: [
        "link_ehr = cocok / n_ehr; link_klaim = cocok / n_klaim.",
        "880/1000 dan 880/950 — hitung keduanya.",
        "Bulatkan ke 3 desimal pada print.",
      ],
      code: {
        starter: `# EHR: 1000 pasien; klaim: 950; cocok via NIK: 880\n# TULIS KODEMU: link_ehr dan link_klaim\nlink_ehr = \nlink_klaim = \nprint(f"link_ehr={link_ehr:.3f} link_klaim={link_klaim:.3f}")`,
        lockLines: 1,
        solution: `# EHR: 1000 pasien; klaim: 950; cocok via NIK: 880\n# TULIS KODEMU: link_ehr dan link_klaim\nn_ehr, n_klaim, match = 1000, 950, 880\nlink_ehr = match / n_ehr\nlink_klaim = match / n_klaim\nprint(f"link_ehr={link_ehr:.3f} link_klaim={link_klaim:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "link_ehr", value: 0.88, tol: 0.001, label: "`link_ehr` seharusnya 0.880", msg: "880/1000 — 12% pasien EHR tak tertaut ke klaim." },
          { kind: "equal", task: "t2", name: "link_klaim", value: 0.926, tol: 0.002, label: "`link_klaim` seharusnya ≈ 0.926", msg: "880/950 — 70 klaim yatim, kandidat missed match." },
          { kind: "stdout_matches", task: "t2", pattern: "link_ehr=0\\.880 link_klaim=0\\.926", label: "`print` menampilkan kedua linkage rate", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "link_ehr=88% tapi link_klaim=92,6%. Interpretasi operasional?",
          options: [
            { text: "Sisa pekerjaan dua jenis: 120 pasien tunai + 70 kandidat salah ketik NIK", why: "Benar: asimetri memetakan dua masalah berbeda dengan dua obat berbeda.", correct: true },
            { text: "Linkage gagal total", why: "88–93% deterministic adalah awal yang baik; sisanya tahap probabilistic." },
            { text: "Pakai 88% saja untuk laporan", why: "Satu angka menyembunyikan arah dan sisa pekerjaan." },
            { text: "Data klaim lebih baik dari EHR", why: "Tidak bisa disimpulkan — beda arah, beda makna." },
          ],
        },
      ],
      reference: "Linkage rate selalu dua arah. Residu = peta pekerjaan tahap dua.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca alasannya walau jawabanmu benar.",
      ],
      tasks: [],
      summary: [
        "Enam sumber utama: EHR, klaim, registri, surveilans, trial, wearable/imaging — masing-masing lahir untuk tujuan berbeda.",
        "Tujuan asli pengumpulan memprediksi kolom mana yang bisa dipercaya; kelengkapan field mengikuti insentif pengisi.",
        "Klaim = utilisasi layanan, bukan potret kesehatan populasi.",
        "Big data mengecilkan sampling error, tidak menghilangkan bias sistematis.",
        "Tulis grain dalam satu kalimat sebelum melaporkan angka apa pun.",
      ],
      next: { label: "HD2 — ICD, SNOMED, FHIR", href: "/v2/learn/hd2-standar" },
      quiz: [
        {
          q: "Tujuan asli data klaim BPJS dikumpulkan adalah…",
          options: [
            { text: "Dasar pembayaran layanan kesehatan (billing)", why: "Klaim = struk pembayaran. Konsekuensinya: rapi dan luas, tapi hanya mencatat yang ditagihkan.", correct: true },
            { text: "Mendukung riset epidemiologi nasional", why: "Riset memakai klaim, tapi klaim tidak dikumpulkan untuk riset — itu sebabnya banyak jebakannya." },
            { text: "Surveilans wabah real-time", why: "Itu tugas surveilans (EWARS/SKDR), bukan klaim yang tanggalnya mengikuti administrasi." },
            { text: "Skrining penyakit tidak menular", why: "Skrining memakai data survei atau program, bukan data billing." },
          ],
        },
        {
          q: "Satu pasien: 5 kunjungan EHR, 2 episode klaim. “Biaya rata-rata per pasien” yang benar memakai pembagi…",
          options: [
            { text: "Tergantung definisi grain yang dilaporkan", why: "Per kunjungan, per episode, dan per pasien semuanya valid untuk pertanyaan berbeda — yang wajib adalah menulis grain yang dipakai.", correct: true },
            { text: "5 (kunjungan)", why: "Benar hanya jika pertanyaannya biaya per kunjungan. Untuk per pasien, pembaginya 1." },
            { text: "2 (episode)", why: "Benar hanya jika pertanyaannya biaya per episode klaim." },
            { text: "1 (pasien)", why: "Benar hanya jika pertanyaannya biaya per pasien — dan itu yang ditanyakan di sini, tapi tanpa grain eksplisit jawabannya ambigu." },
          ],
        },
        {
          q: "Lowongan Health Data Scientist meminta PySpark. Alasan paling masuk akal?",
          options: [
            { text: "Data klaim/EHR nasional berukuran ratusan GB–TB, melebihi kapasitas pandas di satu mesin", why: "Ini soal skala: volume + heterogenitas data nasional butuh pola pikir terdistribusi (partisi, agregasi).", correct: true },
            { text: "Spark membuat visualisasi lebih cantik", why: "Spark adalah mesin komputasi terdistribusi, bukan alat visualisasi." },
            { text: "Spark wajib untuk semua analisis kesehatan", why: "Untuk data kecil pandas tetap lebih praktis — jangan pakai meriam untuk nyamuk." },
            { text: "Python biasa dilarang di RS", why: "Tidak ada larangan seperti itu; alasannya murni skala data." },
          ],
        },
        {
          q: "Riskesdas menemukan prevalensi diabetes 10,9% sementara klaim BPJS 4,2%. Interpretasi tepat?",
          options: [
            { text: "Klaim hanya menangkap yang terdiagnosis dan berobat; 10,9% adalah estimasi prevalensi sebenarnya", why: "Riskesdas memeriksa sampel populasi langsung (menangkap yang tak terdiagnosis); selisih ~6,7 poin adalah kesenjangan diagnosis.", correct: true },
            { text: "Data klaim salah input", why: "Klaim tidak salah — ia hanya mengukur hal berbeda: utilisasi layanan, bukan prevalensi." },
            { text: "Riskesdas melebih-lebihkan", why: "Riskesdas memakai pemeriksaan biomedis langsung pada sampel berdesain, bukan tebakan." },
            { text: "Keduanya salah, abaikan saja", why: "Keduanya benar untuk pertanyaannya masing-masing — tugas analis adalah merekonsiliasi, bukan membuang." },
          ],
        },
        {
          q: "Field EHR “riwayat merokok” kelengkapannya 35% dipakai untuk analisis faktor risiko tanpa investigasi. Masalah utamanya?",
          options: [
            { text: "Missing-nya kemungkinan tidak acak sehingga menimbulkan bias sistematis", why: "Dokter mencatat merokok saat relevan klinis (MNAR, lihat HD8) — analisis naif akan bias.", correct: true },
            { text: "Tidak ada — 35% dari 1.000 record masih 350 data", why: "Jumlah bukan penentunya; mekanisme missing yang sistematis membiaskan 350 data itu." },
            { text: "Komputer tidak bisa memproses data tidak lengkap", why: "Komputer bisa memprosesnya — masalahnya adalah validitas kesimpulan, bukan komputasi." },
            { text: "Harus selalu dihapus saja", why: "Menghapus diam-diam justru bisa memperparah bias; yang dibutuhkan adalah investigasi mekanisme missing." },
          ],
        },
      ],
    },
  ],
};
