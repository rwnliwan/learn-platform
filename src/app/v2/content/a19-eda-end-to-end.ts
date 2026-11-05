import type { V2Lesson } from "../lib/types";

export const a19: V2Lesson = {
  slug: "a19-eda-end-to-end",
  track: "Statistika",
  module: "Deskriptif",
  title: "A1.9 EDA End-to-End: Dari Data Mentah ke Keputusan Direksi",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-dini",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Model termahal kalah dari EDA 3 jam",
      prose: [
        "Bank Nusantara punya masalah: default kredit mikro naik. Tim data science dikerahkan — dua minggu tuning XGBoost, ratusan eksperimen, AUC mentok 0,71. Lalu Dini, analis senior yang baru kembali dari cuti, minta dataset mentahnya. Ia buka notebook kosong dan bertanya seperti detektif: satu baris ini sebenarnya apa? kolom ini kenapa 15% kosong? kenapa penghasilan ada yang 500 juta?",
        "Tiga jam kemudian ia kembali dengan tiga temuan: default terkonsentrasi di penghasilan < 5 juta (18% vs 4%), kredit konsumsi default 2× lipat dari modal kerja, dan pengajuan berpenghasilan kosong punya default 22% — pola yang cocok dengan aplikasi fiktif. Rekomendasinya tidak butuh model sama sekali. Enam bulan kemudian default turun 30%.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio` risiko segmen < 5 jt vs segmen > 10 jt" },
        { id: "t2", text: "Hitung `selisih_pp` = 18 − 4 (percentage points)" },
      ],
      expected: "rasio=4.5  selisih_pp=14",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "EDA bertanya data ini apa, bukan model apa yang cocok. Tiga temuan Dini langsung jadi kebijakan: verifikasi manual segmen < 5 jt, pricing dibedakan per tujuan kredit, penghasilan kosong masuk antrean investigasi — tanpa satu pun model.",
      },
      hints: [
        "rasio = 18 / 4.",
        "selisih_pp = 18 − 4.",
        "rasio = 18/4",
      ],
      code: {
        starter: `dr_rendah, dr_tinggi = 18, 4  # % default\n\n# TULIS KODEMU\nrasio = \nselisih_pp = \n\nprint(f"rasio={rasio}  selisih_pp={selisih_pp}")`,
        lockLines: 1,
        solution: `dr_rendah, dr_tinggi = 18, 4  # % default\n\n# TULIS KODEMU\nrasio = dr_rendah/dr_tinggi\nselisih_pp = dr_rendah-dr_tinggi\n\nprint(f"rasio={rasio}  selisih_pp={selisih_pp}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rasio", value: 4.5, tol: 1e-9, label: "`rasio` seharusnya 4.5", msg: "18/4 = 4,5× lipat." },
          { kind: "equal", task: "t2", name: "selisih_pp", value: 14, tol: 1e-9, label: "`selisih_pp` seharusnya 14", msg: "18 − 4 = 14 percentage points." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio=4\\.5\\s+selisih_pp=14", label: "`print` menampilkan keduanya", msg: "Format: rasio=...  selisih_pp=... ." },
        ],
      },
      reference: "Besaran efek (4,5×) + bahasa bisnis = EDA yang dibaca direksi.",
    },
    {
      id: "grain-kamus",
      eyebrow: "Langkah 2 · Grain dan kamus data",
      title: "Satu baris = apa? Kontrak makna dengan data",
      prose: [
        "Grain adalah jawaban atas pertanyaan satu baris = apa — unit observasi terkecil. Dataset 10.000 baris pengajuan dari 8.500 nasabah unik (1.500 mengajukan ulang). Analis junior mengira satu baris = satu nasabah → melapor 10.000 nasabah, lalu hitung rata-rata pengajuan per nasabah = 10.000/10.000 = 1. Salah total.",
        "Yang benar: grain = pengajuan. Nasabah unik = 8.500 (deduplikasi by ID). Rata-rata pengajuan per nasabah = 10.000/8.500 ≈ 1,18. COUNT, rata-rata, dan rate semuanya bergantung pada grain. Salah grain = semua angka di bawahnya salah arti — meski perhitungannya benar. Tulis grain di baris pertama notebook-mu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `nasabah` unik dari 10.000 baris (1.500 mengajukan ulang)" },
        { id: "t2", text: "Hitung `rata_pengajuan` per nasabah (2 desimal)" },
      ],
      expected: "nasabah=8500  rata_pengajuan=1.18",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Grain itu obvious — lihat saja datanya. Salah: grain hampir tidak pernah obvious. Tabel transaksi bisa per item, per struk, atau per hari-per-toko. Satu-satunya cara aman: tanya pemilik bisnis dan dokumentasikan. Asumsi grain yang salah adalah bug paling mahal — ia tidak error, hanya menghasilkan jawaban salah dengan percaya diri.",
      },
      hints: [
        "nasabah = 10.000 − 1.500.",
        "rata_pengajuan = 10.000 / nasabah.",
        "Bulatkan 2 desimal dengan round().",
      ],
      code: {
        starter: `baris = 10000\nulang = 1500\n\n# TULIS KODEMU\nnasabah = \nrata_pengajuan = \n\nprint(f"nasabah={nasabah}  rata_pengajuan={rata_pengajuan}")`,
        lockLines: 2,
        solution: `baris = 10000\nulang = 1500\n\n# TULIS KODEMU\nnasabah = baris - ulang\nrata_pengajuan = round(baris/nasabah, 2)\n\nprint(f"nasabah={nasabah}  rata_pengajuan={rata_pengajuan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nasabah", value: 8500, tol: 1e-9, label: "`nasabah` seharusnya 8500", msg: "10.000 − 1.500 = 8.500." },
          { kind: "equal", task: "t2", name: "rata_pengajuan", value: 1.18, tol: 0.01, label: "`rata_pengajuan` seharusnya 1.18", msg: "10.000/8.500 ≈ 1,18." },
          { kind: "stdout_matches", task: "t2", pattern: "nasabah=8500\\s+rata_pengajuan=1\\.18", label: "`print` menampilkan keduanya", msg: "Format: nasabah=...  rata_pengajuan=... ." },
        ],
      },
      reference: "Kamus data: dokumentasikan tiap kolom — tipe, skala (A1.1), definisi bisnis.",
    },
    {
      id: "audit-kualitas",
      eyebrow: "Langkah 3 · Audit kualitas",
      title: "Auditor: curigai semua, hakimi belakangan",
      prose: [
        "Audit kualitas memeriksa apakah data layak dianalisis: missing, duplikat, outlier, inkonsistensi. Prinsipnya: model canggih di atas data kotor = sampah yang meyakinkan. Missing rate = baris kosong / total baris × 100%. Penghasilan kosong di 1.500 dari 10.000 baris → 15%.",
        "Audit 10 menit: missing per kolom (penghasilan 15%, sisanya < 1%); duplikat (10.000 baris, 9.982 ID unik → 18 duplikat — pengajuan ganda di hari yang sama, gabungkan); outlier (umur max 250 → kemungkinan salah input 25; penghasilan 500 jt → mungkin pengusaha, tandai jangan hapus); konsistensi (tanggal lahir > tanggal pengajuan → error entry).",
      ],
      formula: String.raw`\text{missing rate} = \frac{n_{kosong}}{n_{total}} \times 100\%`,
      formulaNote: "missing rate = persentase nilai kosong; n_kosong = baris kosong pada kolom itu; n_total = total baris; audit 10 menit: hitung ini per kolom sebelum analisis apa pun.",
      tasks: [
        { id: "t1", text: "Hitung `miss_rate` penghasilan (1.500 dari 10.000)" },
        { id: "t2", text: "Hitung `duplikat` = 10.000 baris − 9.982 ID unik" },
      ],
      expected: "miss_rate=15.0  duplikat=18",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Missing = sampah, hapus saja barisnya. Salah: missing sering tidak acak — dan ketidakacakannya adalah informasi. Di case ini penghasilan kosong justru menandai risiko tertinggi (22% default). Menghapusnya = membuang sinyal terbaikmu. Perlakukan missing sebagai kandidat fitur.",
      },
      hints: [
        "miss_rate = 1500/10000 × 100.",
        "duplikat = baris − ID unik.",
        "duplikat = 10000 - 9982",
      ],
      code: {
        starter: `baris, id_unik = 10000, 9982\nkosong = 1500\n\n# TULIS KODEMU\nmiss_rate = \nduplikat = \n\nprint(f"miss_rate={miss_rate}  duplikat={duplikat}")`,
        lockLines: 2,
        solution: `baris, id_unik = 10000, 9982\nkosong = 1500\n\n# TULIS KODEMU\nmiss_rate = kosong/baris*100\nduplikat = baris - id_unik\n\nprint(f"miss_rate={miss_rate}  duplikat={duplikat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "miss_rate", value: 15.0, tol: 1e-9, label: "`miss_rate` seharusnya 15.0", msg: "1.500/10.000 × 100% = 15%." },
          { kind: "equal", task: "t2", name: "duplikat", value: 18, tol: 1e-9, label: "`duplikat` seharusnya 18", msg: "10.000 − 9.982 = 18." },
          { kind: "stdout_matches", task: "t2", pattern: "miss_rate=15(\\.0)?\\s+duplikat=18", label: "`print` menampilkan keduanya", msg: "Format: miss_rate=...  duplikat=... ." },
        ],
      },
      reference: "Jangan sentuh modeling sebelum kualitas data jelas.",
    },
    {
      id: "univariate",
      eyebrow: "Langkah 4 · Univariate",
      title: "Potret diri: kenali tiap variabel sebelum dipasangkan",
      prose: [
        "Analisis univariate memotret satu variabel: bentuknya, pusatnya, sebarannya. Penghasilan: massa menumpuk di 3–16 jt dengan ekor panjang ke kanan hingga 500 jt — right-skewed. Mean tertarik ke ekor; median (8 jt) mewakili tipikal. Outlier 500 jt diinvestigasi dulu, bukan auto-hapus.",
        "Tujuan kredit: bar chart frekuensi — 60% modal kerja, 25% konsumsi, 15% investasi. Portofolio didominasi kredit produktif — kabar baik, sampai kita lihat default rate-nya di langkah berikutnya. Bivariate tanpa univariate = kesimpulan di atas pasir: default rate tinggi di segmen > 100 jt ternyata hanya 3 orang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `prop_modal` = proporsi kredit modal kerja" },
        { id: "t2", text: "Hitung `selisih_pusat` = mean − median penghasilan (indikasi skew)" },
      ],
      expected: "prop_modal=0.6  selisih_pusat=8.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Univariate itu basa-basi — yang penting hubungan dengan target. Salah: hubungan dengan target tidak bisa diinterpretasi tanpa memahami tiap variabelnya. Variabel yang tidak kamu kenal bentuknya akan mengkhianatimu di tahap modeling.",
      },
      hints: [
        "prop_modal = 60/100.",
        "selisih_pusat = 17 − 8,5.",
        "Mean jauh di atas median → right-skewed → pakai median.",
      ],
      code: {
        starter: `# komposisi tujuan kredit (%) dan pusat penghasilan (jt)\nmodal, konsumsi, investasi = 60, 25, 15\nmean_inc, median_inc = 17, 8.5\n\n# TULIS KODEMU\nprop_modal = \nselisih_pusat = \n\nprint(f"prop_modal={prop_modal}  selisih_pusat={selisih_pusat}")`,
        lockLines: 3,
        solution: `# komposisi tujuan kredit (%) dan pusat penghasilan (jt)\nmodal, konsumsi, investasi = 60, 25, 15\nmean_inc, median_inc = 17, 8.5\n\n# TULIS KODEMU\nprop_modal = modal/100\nselisih_pusat = mean_inc - median_inc\n\nprint(f"prop_modal={prop_modal}  selisih_pusat={selisih_pusat}")`,
        checks: [
          { kind: "equal", task: "t1", name: "prop_modal", value: 0.6, tol: 1e-9, label: "`prop_modal` seharusnya 0.6", msg: "60/100 = 0,6." },
          { kind: "equal", task: "t2", name: "selisih_pusat", value: 8.5, tol: 1e-9, label: "`selisih_pusat` seharusnya 8.5", msg: "17 − 8,5 = 8,5 → mean tertarik ekor, pakai median." },
          { kind: "stdout_matches", task: "t2", pattern: "prop_modal=0\\.6\\s+selisih_pusat=8\\.5", label: "`print` menampilkan keduanya", msg: "Format: prop_modal=...  selisih_pusat=... ." },
        ],
      },
      reference: "Numerik → histogram + boxplot. Kategori → bar chart frekuensi.",
    },
    {
      id: "bivariate",
      eyebrow: "Langkah 5 · Bivariate vs target",
      title: "Matchmaker: variabel apa yang membedakan macet vs lancar?",
      prose: [
        "Bivariate memasangkan tiap variabel dengan target default_12m. Metrik utama: default rate per segmen = macet/total × 100%. Segmen penghasilan < 5 jt: 2.000 nasabah, 360 macet → DR 18%. Pola menurun monoton: 18% → 9% → 4%. Segmen < 5 jt risikonya 4,5× lipat dari segmen > 10 jt — temuan terkuat: besar efeknya, stabil polanya, langsung jadi kebijakan.",
        "Kredit konsumsi default 2× lipat modal kerja (12% vs 6%) — masuk akal: konsumsi tidak menghasilkan arus kas untuk membayar cicilan. Penghasilan kosong → default 22% vs 9% yang terisi: missing bukan acak, ia menandai pola berisiko. Dan waspadai multikolinearitas: plafon berkorelasi 0,92 dengan penghasilan — laporkan redundansinya, pilih satu atau buat rasio plafon/penghasilan.",
      ],
      formula: String.raw`DR = \frac{n_{macet}}{n_{total}} \times 100\%`,
      formulaNote: "DR = default rate per segmen; n_macet = debitur macet di segmen itu; n_total = total debitur segmen; metrik utama analisis bivariate untuk target biner.",
      tasks: [
        { id: "t1", text: "Hitung `dr_rendah` segmen < 5 jt (360 dari 2.000)" },
        { id: "t2", text: "Hitung `rasio` = dr_rendah / dr_tinggi (dr_tinggi = 4%)" },
      ],
      expected: "dr_rendah=18.0  rasio=4.5",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "EDA membuktikan X menyebabkan default. Salah: EDA menemukan asosiasi, bukan kausalitas. Penghasilan rendah berhubungan dengan default tinggi — tapi penyebabnya bisa variabel ketiga (pekerjaan informal). Jangan tulis menyebabkan di laporan — tulis terkonsentrasi pada atau berhubungan dengan.",
      },
      hints: [
        "dr = macet/total × 100.",
        "rasio = dr_rendah / 4.",
        "rasio = dr_rendah/dr_tinggi",
      ],
      code: {
        starter: `macet, total = 360, 2000\ndr_tinggi = 4  # % segmen > 10 jt\n\n# TULIS KODEMU\ndr_rendah = \nrasio = \n\nprint(f"dr_rendah={dr_rendah}  rasio={rasio}")`,
        lockLines: 2,
        solution: `macet, total = 360, 2000\ndr_tinggi = 4  # % segmen > 10 jt\n\n# TULIS KODEMU\ndr_rendah = macet/total*100\nrasio = dr_rendah/dr_tinggi\n\nprint(f"dr_rendah={dr_rendah}  rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dr_rendah", value: 18.0, tol: 1e-9, label: "`dr_rendah` seharusnya 18.0", msg: "360/2.000 × 100% = 18%." },
          { kind: "equal", task: "t2", name: "rasio", value: 4.5, tol: 1e-9, label: "`rasio` seharusnya 4.5", msg: "18/4 = 4,5× lipat." },
          { kind: "stdout_matches", task: "t2", pattern: "dr_rendah=18(\\.0)?\\s+rasio=4\\.5", label: "`print` menampilkan keduanya", msg: "Format: dr_rendah=...  rasio=... ." },
        ],
      },
      reference: "Urutkan temuan by besaran efek, bukan sekadar signifikan.",
    },
    {
      id: "penerjemah",
      eyebrow: "Langkah 6 · Penerjemah",
      title: "Dari angka ke kalimat yang dieksekusi direksi",
      prose: [
        "Tahap penerjemah mengubah temuan menjadi rekomendasi yang bisa dieksekusi: apa masalahnya, seberapa besar, apa yang harus dilakukan, siapa yang melakukannya. Formula kalimat: [siapa terdampak + berapa banyak] → [seberapa parah, dalam rasio] → [tindakan konkret + kapan] → [estimasi dampak + penanggung jawab].",
        "Versi junior: variabel penghasilan signifikan terhadap default (p < 0,001) → direksi: jadi ngapain? Versi penerjemah: 2.000 nasabah berpenghasilan di bawah 5 juta gagal bayar 4,5× lebih sering. Usulan: verifikasi slip gaji manual untuk segmen ini mulai bulan depan — estimasi memangkas 120 kasus macet per kuartal. Penanggung jawab: tim verifikasi → direksi: setuju, jalan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `dicegah` = kasus macet dicegah per kuartal jika DR segmen turun 18% → 12% (n = 2.000)" },
      ],
      expected: "dicegah=120",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Insight yang tidak mengubah keputusan adalah trivia. Sebelum menulis rekomendasi, tanya: kalau direksi setuju, apa yang berubah Senin pagi? Kalau jawabannya tidak ada, temuanmu belum matang — gali lagi atau buang. Direksi tidak membayar kecanggihan; mereka membayar kejelasan yang bisa dieksekusi.",
      },
      hints: [
        "Penurunan DR = 18% − 12% = 6 percentage points.",
        "dicegah = 2.000 × 0,06.",
        "dicegah = int(2000*(0.18-0.12))",
      ],
      code: {
        starter: `n_segmen = 2000\ndr_sebelum, dr_sesudah = 0.18, 0.12\n\n# TULIS KODEMU\ndicegah = \n\nprint(f"dicegah={dicegah}")`,
        lockLines: 2,
        solution: `n_segmen = 2000\ndr_sebelum, dr_sesudah = 0.18, 0.12\n\n# TULIS KODEMU\ndicegah = int(n_segmen*(dr_sebelum-dr_sesudah))\n\nprint(f"dicegah={dicegah}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dicegah", value: 120, tol: 1e-9, label: "`dicegah` seharusnya 120", msg: "2.000 × 0,06 = 120 kasus per kuartal." },
          { kind: "stdout_matches", task: "t1", pattern: "dicegah=120", label: "`print` menampilkan estimasi", msg: "Format: dicegah=120." },
        ],
      },
      reference: "Peta temuan→tindakan: outlier → investigasi; missing prediktif → jadikan fitur; korelasi 0,92 → waspadai redundansi; bimodal → segmentasi.",
    },
    {
      id: "minicase-mikro",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Proyek EDA kredit mikro 10.000 nasabah",
      prose: [
        "Kamu analis risiko di Bank Sejahtera. Dataset kredit_mikro_10k.csv — 10.000 baris, 15 kolom, Jan 2024–Des 2025. Kolom kunci: id_pengajuan, umur (max 250?!), penghasilan (15% missing), tujuan_kredit (60/25/15), plafon (korelasi 0,92 dengan penghasilan), penghasilan_missing (flag yang kamu buat), default_12m (target).",
        "Pembahasan. 1. Grain: 1 baris = 1 pengajuan. Nasabah unik = 8.500. 2. Audit: missing per kolom, duplikat ID, umur 250 → investigasi ke sistem sumber (kemungkinan salah input 25 — perbaiki, jangan hapus diam-diam), konsistensi tanggal. 3. Univariate: penghasilan → histogram (right-skewed → median); tujuan_kredit → bar chart. 4. Matchmaker — prioritas: (a) penghasilan (efek 4,5×), (b) tujuan_kredit (2×, actionable via pricing), (c) penghasilan_missing (22% — sinyal, bukan sampah). Plafon ditahan: korelasi 0,92 = redundan. 5. Penerjemah: verifikasi manual segmen < 5 jt (estimasi −120 kasus/kuartal, PIC tim verifikasi); penghasilan kosong masuk antrean investigasi fraud, jangan auto-approve (PIC tim risiko).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Checklist EDA: grain didokumentasikan; missing per kolom; distribusi tiap variabel (plot!); hubungan dengan target; outlier diinvestigasi (bukan langsung hapus); insight ditulis dalam bahasa bisnis. Lima langkah ini — bukan model — yang menurunkan default 30%.",
      },
      reference: "EDA yang sistematis adalah analisisnya, bukan pemanasan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Jawab satu per satu; setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Grain dulu — satu baris = apa? Tulis di baris pertama notebook sebelum analisis apapun.",
        "Audit sebelum analisis: missing, duplikat, outlier, konsistensi. Outlier diinvestigasi, bukan auto-hapus.",
        "Univariate sebelum bivariate: kenali tiap variabel sebelum dipasangkan dengan target.",
        "Laporkan besaran efek (4,5× lipat), bukan sekadar signifikan; missing prediktif = sinyal, bukan sampah.",
        "Akhiri dengan kalimat bisnis: siapa → apa → kapan → dampak. EDA menemukan asosiasi, bukan kausalitas.",
      ],
      next: { label: "A2.1 — Sampling & Bias", href: "/learn/a21-sampling-bias" },
      quiz: [
        {
          q: "Ditemukan: missing penghasilan punya default rate 22% (vs 9% rata-rata). Tindakan tepat?",
          options: [
            { text: "Hapus baris missing — datanya tidak lengkap", why: "Menghapus membuang sinyal terbaik dan membuat sampel bias." },
            { text: "Isi dengan mean lalu lupakan", why: "Mean-imputation menyembunyikan sinyal di balik angka rata-rata." },
            { text: "Perlakukan missing sebagai sinyal: buat indikator + investigasi polanya", why: "Missing yang prediktif adalah temuan berharga — jadikan feature.", correct: true },
            { text: "Abaikan — missing tidak penting", why: "22% vs 9% adalah perbedaan yang sangat penting." },
          ],
        },
        {
          q: "Manajer bertanya: jadi variabel apa yang paling menentukan default? Jawaban EDA yang tepat?",
          options: [
            { text: "Penghasilan — default 18% vs 4% (4,5x lipat), temuan terkuat dan stabil", why: "Besaran efek dalam bahasa bisnis — bukan sekadar signifikan.", correct: true },
            { text: "Umur — korelasi Pearson 0,3", why: "Korelasi 0,3 tanpa konteks efek tidak cukup untuk keputusan." },
            { text: "Semua variabel sama penting", why: "EDA memprioritaskan: 4,5× vs 2× vs 1,2× — tidak sama." },
            { text: "Tidak bisa disimpulkan dari EDA", why: "EDA menghasilkan hipotesis berprioritas — itu tugasnya." },
          ],
        },
        {
          q: "Boxplot penghasilan: median 8 jt, Q3 12 jt, whisker kanan memanjang sampai 500 jt. Interpretasi dan ukuran pusat yang tepat?",
          options: [
            { text: "Simetris — pakai mean", why: "Whisker kanan panjang = ekor kanan = tidak simetris." },
            { text: "Right-skewed dengan outlier — pakai median (8 jt), investigasi outlier 500 jt", why: "Mean tertarik ke ekor; median mewakili tipikal. Outlier 500 jt bisa pengusaha valid.", correct: true },
            { text: "Datanya rusak — hapus semua di atas 12 jt", why: "Hapus tanpa investigasi = temuan yang dibuang." },
            { text: "Distribusi normal — pakai mean dan SD saja", why: "Right-skewed jelas bukan normal." },
          ],
        },
        {
          q: "Plafon dan penghasilan berkorelasi 0,92. Untuk analisis risiko, tindakan tepat?",
          options: [
            { text: "Masukkan keduanya ke model — semakin banyak semakin baik", why: "Multikolinearitas mengacaukan koefisien regresi." },
            { text: "Waspadai multikolinearitas: laporkan redundansinya, pilih satu atau buat rasio plafon/penghasilan", why: "Keduanya membawa informasi hampir sama; rasio justru bisa lebih prediktif.", correct: true },
            { text: "Hapus keduanya — korelasi tinggi = tidak berguna", why: "Informasinya berguna — yang bermasalah redundansinya." },
            { text: "Abaikan korelasi antar prediktor, yang penting dengan target", why: "Korelasi antar prediktor merusak interpretasi model." },
          ],
        },
        {
          q: "Junior melapor rata-rata 1,18 pengajuan per nasabah dari 10.000 baris / 10.000 nasabah. Kesalahannya?",
          options: [
            { text: "Pembagiannya salah hitung", why: "10.000/10.000 = 1, bukan 1,18 — angkanya pun tidak konsisten." },
            { text: "Grain salah: 1 baris = 1 pengajuan, bukan 1 nasabah — nasabah uniknya 8.500", why: "Dengan 1.500 pengajuan ulang, yang benar 10.000/8.500 ≈ 1,18 — logikanya yang salah total.", correct: true },
            { text: "Harusnya pakai median, bukan mean", why: "Masalahnya grain, bukan pilihan ukuran pusat." },
            { text: "Tidak ada kesalahan", why: "Ada: grain salah membuat semua rate per nasabah salah arti." },
          ],
        },
      ],
      note: {
        title: "Intuisi: EDA adalah interogasi, bukan jalan-jalan",
        body: "Lima heuristik. Satu: tiga jam EDA mengalahkan dua minggu tuning — model tidak bisa memperbaiki pemahaman yang salah; temuan Dini (penghasilan di bawah 5 juta, kredit konsumsi, missing yang prediktif) bernilai lebih dari ratusan eksperimen XGBoost. Dua: missing bukan acak — pola siapa yang kosong sering lebih prediktif daripada nilai yang diimputasi; perlakukan missingness sebagai informasi, bukan sampah. Tiga: grain dulu, selalu — satu baris sama dengan apa? Salah grain berarti setiap COUNT dan rate salah sejak fondasi. Empat: univariate sebelum bivariate — kenali tiap variabel (bentuk, pusat, sebaran) sebelum dipasangkan dengan target; pasangan yang tidak saling kenal menghasilkan kesimpulan prematur. Lima: akhiri dengan kalimat eksekusi — temuan tanpa rekomendasi (“siapa melakukan apa”) hanyalah trivia; EDA selesai ketika direksi tahu apa yang harus diubah Senin pagi. Enam: EDA yang baik meninggalkan artefak — notebook yang bisa dijalankan ulang, kamus data yang diperbarui, dan daftar temuan bernomor; analisis yang tidak bisa direproduksi adalah anekdot.",
      },
    },
  ],
};
