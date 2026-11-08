import type { V2Lesson } from "../lib/types";

const FIG_PILAR = `<svg viewBox="0 0 480 250" role="img" aria-label="Tiga pilar SR 11-7: pengembangan, validasi, tata kelola.">
<g font-family="var(--font-ui)">
<text x="240" y="22" font-size="13" fill="var(--chart-text)" text-anchor="middle">Tiga pilar SR 11-7 (2011)</text>
<rect x="20" y="40" width="135" height="120" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="87" y="70" font-size="12" fill="#fff" text-anchor="middle">1. Pengembangan</text>
<text x="87" y="90" font-size="10" fill="#fff" text-anchor="middle">Desain sehat,</text>
<text x="87" y="106" font-size="10" fill="#fff" text-anchor="middle">data berkualitas,</text>
<text x="87" y="122" font-size="10" fill="#fff" text-anchor="middle">dokumentasi lengkap</text>
<text x="87" y="142" font-size="10" fill="#fff" text-anchor="middle">Tim: model owner</text>
<rect x="172" y="40" width="135" height="120" rx="8" fill="var(--c3)" opacity="0.85"/>
<text x="240" y="70" font-size="12" fill="#fff" text-anchor="middle">2. Validasi</text>
<text x="240" y="90" font-size="10" fill="#fff" text-anchor="middle">Independen dari</text>
<text x="240" y="106" font-size="10" fill="#fff" text-anchor="middle">pengembang;</text>
<text x="240" y="122" font-size="10" fill="#fff" text-anchor="middle">effective challenge</text>
<text x="240" y="142" font-size="10" fill="#fff" text-anchor="middle">Tim: validator ≠ owner</text>
<rect x="325" y="40" width="135" height="120" rx="8" fill="var(--c4)" opacity="0.85"/>
<text x="392" y="70" font-size="12" fill="#fff" text-anchor="middle">3. Tata kelola</text>
<text x="392" y="90" font-size="10" fill="#fff" text-anchor="middle">Inventory, tiering,</text>
<text x="392" y="106" font-size="10" fill="#fff" text-anchor="middle">limitasi pakai,</text>
<text x="392" y="122" font-size="10" fill="#fff" text-anchor="middle">monitoring berkala</text>
<text x="392" y="142" font-size="10" fill="#fff" text-anchor="middle">Tim: komite + CRO</text>
<text x="240" y="195" font-size="11" fill="var(--chart-text)" text-anchor="middle">Satu pilar runtuh = seluruh kerangka dipertanyakan pemeriksa.</text>
<text x="240" y="215" font-size="11" fill="var(--chart-text)" text-anchor="middle">Revisi 2026: GenAI/agentic AI dikeluarkan dari cakupan — menunggu RFI.</text>
</g>
</svg>`;

const FIG_LIFECYCLE = `<svg viewBox="0 0 480 250" role="img" aria-label="Alur lifecycle model: inventory sampai pensiun dengan gerbang validasi.">
<g font-family="var(--font-ui)">
<text x="240" y="22" font-size="13" fill="var(--chart-text)" text-anchor="middle">Lifecycle model: tiap tahap punya gerbang</text>
<rect x="10" y="50" width="100" height="60" rx="8" fill="var(--c1)" opacity="0.85"/>
<text x="60" y="75" font-size="10" fill="#fff" text-anchor="middle">Inventory</text>
<text x="60" y="92" font-size="10" fill="#fff" text-anchor="middle">&amp; tiering</text>
<rect x="125" y="50" width="100" height="60" rx="8" fill="var(--c2)" opacity="0.85"/>
<text x="175" y="75" font-size="10" fill="#fff" text-anchor="middle">Develop</text>
<text x="175" y="92" font-size="10" fill="#fff" text-anchor="middle">+ dokumen</text>
<rect x="240" y="50" width="100" height="60" rx="8" fill="var(--c3)" opacity="0.85"/>
<text x="290" y="75" font-size="10" fill="#fff" text-anchor="middle">Validasi</text>
<text x="290" y="92" font-size="10" fill="#fff" text-anchor="middle">independen</text>
<rect x="355" y="50" width="115" height="60" rx="8" fill="var(--c4)" opacity="0.85"/>
<text x="412" y="75" font-size="10" fill="#fff" text-anchor="middle">Deploy</text>
<text x="412" y="92" font-size="10" fill="#fff" text-anchor="middle">+ monitoring</text>
<rect x="125" y="150" width="100" height="60" rx="8" fill="var(--c5)" opacity="0.85"/>
<text x="175" y="175" font-size="10" fill="#fff" text-anchor="middle">Pensiun /</text>
<text x="175" y="192" font-size="10" fill="#fff" text-anchor="middle">ganti</text>
<rect x="240" y="150" width="100" height="60" rx="8" fill="var(--chart-grid)" opacity="0.9"/>
<text x="290" y="175" font-size="10" fill="var(--chart-text)" text-anchor="middle">Revalidasi</text>
<text x="290" y="192" font-size="10" fill="var(--chart-text)" text-anchor="middle">berkala</text>
<text x="60" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">Gerbang 1</text>
<text x="175" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">Gerbang 2</text>
<text x="290" y="130" font-size="10" fill="var(--chart-text)" text-anchor="middle">Gerbang 3</text>
<text x="240" y="235" font-size="11" fill="var(--chart-text)" text-anchor="middle">Model tanpa entri inventory = model liar: tidak termonitor.</text>
</g>
</svg>`;

export const mr20: V2Lesson = {
  slug: "mr20-model-risk-ai",
  track: "Market Risk",
  module: "Tata Kelola & Validasi",
  title: "MR20 — Model Risk & AI Governance: Saat Modelnya Sendiri Jadi Risiko",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang lolos validasi, lalu diam-diam merugikan",
      prose: [
        "2024. Bank Nusantara meluncurkan model machine learning untuk pre-screening KPR: gradient boosting, AUC 0,91 di data validasi, lolos seluruh uji statistik tim validator. Direksi puas — proses persetujuan awal yang tadinya 5 hari menjadi 20 menit. Tidak ada yang salah dengan matematikanya.",
        "Awal 2026, tim kepatuhan menemukan pola: tingkat penolakan pemohon dari tiga kabupaten melonjak 3x lipat dibanding 2024 — bukan karena kualitas kredit mereka memburuk, melainkan karena data training 2020–2022 kekurangan sampel wilayah itu. Model tidak 'rusak'; ia dipakai di populasi yang tidak pernah ia pelajari. Tidak ada dashboard yang memantau pergeseran populasi. Tidak ada dokumen yang mencatat batas wilayah pakai model.",
        "Twist yang lebih besar datang dari regulator: pada April 2026, The Fed, OCC, dan FDIC merevisi panduan model risk management (penerus SR 11-7 yang terbit 2011) — dan secara eksplisit MENGELUARKAN generative AI dan agentic AI dari cakupan, sambil menjanjikan request for information terpisah. Artinya untuk teknologi paling transformatif yang dipakai bank hari ini, buku aturannya terbuka mengakui: 'kami belum punya aturannya — kalian jalan dulu sendiri.'",
        "Prasyarat ringkas — validasi statistik model (seperti untuk model VaR maupun model kredit): backtesting membandingkan prediksi vs realisasi, uji diskriminasi (AUC/KS) mengukur daya beda, dan uji stabilitas memeriksa parameter tidak berubah. Lesson ini membahas mengapa ketiganya TIDAK CUKUP: model bisa lolos semua uji statistik tetapi tetap berbahaya karena dipakai di luar batasnya, datanya bergeser diam-diam, atau tidak ada yang bisa menjelaskan keputusannya. Itulah ranah model risk management.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan tiga pilar SR 11-7 dan celah AI-nya; (2) membangun model inventory dengan tiering berbasis skor; (3) menghitung Population Stability Index (PSI) untuk mendeteksi data drift; (4) merancang paket governance minimum untuk model AI/ML termasuk aturan human-in-the-loop.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model risk adalah risiko 'meta': bukan rugi dari pasar, melainkan rugi dari ALAT pengukur pasar yang salah. VaR yang salah memberi rasa aman palsu; model kredit yang drift menolak nasabah yang layak. Kerugiannya sunyi — tidak ada alarm yang bunyi sampai pemeriksa atau nasabah yang menemukannya.",
      },
      reference: "SR 11-7 (2011): tiga pilar. Revisi 2026: GenAI di luar cakupan — governance AI jadi tanggung jawab bank.",
    },
    {
      id: "pilar",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga pilar SR 11-7: SIM-nya model",
      prose: [
        "SR 11-7 — Supervisory Guidance on Model Risk Management, diterbitkan bersama oleh The Fed dan OCC pada 4 April 2011 (lalu diadopsi FDIC) — mendefinisikan model secara luas: metode kuantitatif, sistem, atau pendekatan yang menerapkan teori statistik/ekonomi/finansial untuk mengubah input menjadi estimasi kuantitatif. VaR-mu adalah model. Skor kreditmu adalah model. Chatbot yang menyetujui limit kartu juga model.",
        "Kepribadiannya seperti SIM dan STNK untuk kendaraan: pilar 1 (pengembangan, implementasi, dan penggunaan yang sehat) memastikan mobilnya layak jalan — desain masuk akal, data berkualitas, dokumentasi yang bisa dibaca orang asing. Pilar 2 (validasi efektif) adalah uji kir yang INDEPENDEN: validator tidak boleh orang yang membangun modelnya, dan wajib melakukan 'effective challenge' — kritik tajam, bukan stempel. Pilar 3 (tata kelola, kebijakan, kontrol) adalah rambu lalu lintasnya: siapa boleh memakai model untuk apa, seberapa sering dimonitor, kapan ditarik.",
        "Agar sumber daya validasi tidak habis untuk model sepele, bank memakai tiering: tiap model diberi skor dari faktor-faktor risiko, lalu dikelompokkan ke Tier 1 (validasi penuh tahunan), Tier 2 (ringan), Tier 3 (tercatat saja). Rumus skornya sederhana — rata-rata berbobot — tetapi konsekuensinya besar: skor menentukan berapa mahal pengawasan sebuah model.",
        "Cara membaca figur: tiga kotak = tiga pilar; teks di bawah tiap kotak = siapa pemiliknya. Interpretasi: pilar 2 (validasi) adalah yang paling sering runtuh di praktik — validator kekurangan orang, atau 'independen' hanya di atas kertas karena validatornya mantan anggota tim pengembang. Jika pilar 2 runtuh, pilar 1 dan 3 kehilangan maknanya.",
        "🚨 Mitos: 'Model risk = risiko model salah hitung.' Yang benar: SR 11-7 menegaskan dua sumber kerugian — model yang salah secara teknis DAN model yang benar tetapi dipakai salah (use risk). Model PD yang akurat untuk KPR dipakai untuk KMK tanpa revalidasi = model risk, walau rumusnya sempurna.",
        "💡 Intuisi: tanyakan selalu 'model ini TIDAK BOLEH dipakai untuk apa?' sebelum 'model ini bisa dipakai untuk apa?'. Batasan pakai (limitasi) adalah separuh dari tata kelola — dan bagian yang paling sering kosong di dokumentasi.",
      ],
      formula: String.raw`\text{Skor}_{tier} = \sum_{i=1}^{n} w_i \cdot r_i`,
      formulaNote: "w_i = bobot faktor risiko ke-i (jumlah seluruh w_i = 1); r_i = rating faktor 1–5. Contoh: 0,35×5 (materialitas) + 0,25×4 (kompleksitas) + 0,25×4 (opasitas) + 0,15×2 (kualitas data) = 4,05 → Tier 1. Interpretasi: skor ≥ 4 = validasi penuh tahunan oleh tim independen; 2,5–4 = Tier 2; < 2,5 = Tier 3.",
      figure: {
        svg: FIG_PILAR,
        alt: "Tiga pilar SR 11-7: pengembangan, validasi independen, tata kelola.",
        caption: "Tiga pilar SR 11-7. Pilar 2 (validasi independen) = yang paling sering runtuh.",
      },
      tasks: [
        { id: "t1", text: "Sebutkan tiga pilar SR 11-7 dan siapa pemilik tiap pilar." },
        { id: "t2", text: "Jelaskan perbedaan 'model salah' vs 'model dipakai salah' dengan satu contoh." },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira validasi = backtesting. Backtesting hanya satu alat di pilar 2. Validasi penuh mencakup kecocokan konseptual (apakah teori di balik model masuk akal untuk kasus pakainya?), kualitas data, dan analisis hasil — termasuk 'apa yang terjadi jika asumsi kunci dilanggar'.",
      },
      hints: [
        "Definisi model SR 11-7 berbasis pakai, bukan teknik: jika output-nya menggerakkan keputusan bank, ia model.",
        "Effective challenge = kritik yang bisa menggagalkan deployment, bukan review administratif.",
      ],
      reference: "Tiga pilar: kembangkan dengan sehat, validasi secara independen, kelola pemakaiannya.",
    },
    {
      id: "lifecycle",
      eyebrow: "Langkah 3 · Konsep",
      title: "Lifecycle: KTP untuk setiap model",
      prose: [
        "Model inventory adalah daftar seluruh model bank beserta metadata: pemilik, tujuan pakai, tier, tanggal validasi terakhir, batasan, dan status. Tanpa inventory, bank tidak tahu berapa model yang ia miliki — dan model yang tidak tercatat = model yang tidak termonitor. Survei industri rutin menemukan bank besar dengan 2.000–5.000 model, sepertiganya 'model liar' yang ditemukan belakangan.",
        "Lifecycle-nya enam tahap dengan gerbang di antaranya. Inventory & tiering (gerbang 1: apakah model ini boleh dibangun untuk tujuan itu?). Development + dokumentasi (gerbang 2: apakah dokumentasinya cukup untuk direplikasi orang asing?). Validasi independen (gerbang 3: lolos effective challenge?). Deploy + monitoring berkala (apakah performanya masih seperti saat divalidasi?). Revalidasi berkala atau karena pemicu — dan pensiun: model yang diganti harus dicabut dari produksi, bukan dibiarkan hidup sebagai 'backup'.",
        "Kepribadiannya seperti rekam medis pasien: tiap model punya berkas yang mencatat kelahiran (tujuan, data training), pemeriksaan rutin (monitoring), dan surat kematian (pensiun). Bank yang tidak mempensiunkan model = rumah sakit yang membiarkan pasien pulang tanpa catatan — saat terjadi sesuatu, tidak ada yang tahu riwayatnya.",
        "🚨 Mitos: 'Setelah lolos validasi, model aman dipakai selamanya.' Yang benar: validasi adalah foto pada satu tanggal. Dunia bergerak — populasi nasabah berubah, perilaku fraud beradaptasi, regulasi berganti. Tanpa monitoring berkala dan revalidasi terjadwal, sertifikat validasi kedaluwarsa diam-diam.",
        "💡 Intuisi: gerbang termurah adalah gerbang 1. Menolak atau membatasi tujuan pakai model SEBELUM dibangun 100x lebih murah daripada memensiunkan model yang sudah dipakai 3 tahun oleh 5 divisi. Inventory yang baik mencatat 'dilarang untuk' sejak hari pertama.",
      ],
      figure: {
        svg: FIG_LIFECYCLE,
        alt: "Alur lifecycle model dari inventory sampai pensiun dengan tiga gerbang.",
        caption: "Lifecycle enam tahap, tiga gerbang. Model liar = model tanpa entri inventory.",
      },
      tasks: [
        { id: "t1", text: "Sebutkan enam tahap lifecycle dan apa yang diperiksa di tiap gerbang." },
        { id: "t2", text: "Mengapa 'model liar' (tanpa inventory) berbahaya? Beri satu skenario." },
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pemicu revalidasi wajib dicatat di inventory: drift data melewati ambang, perubahan regulasi, perluasan populasi pakai, atau insiden. Tanpa daftar pemicu tertulis, revalidasi hanya terjadi setelah insiden — yaitu terlambat.",
      },
      hints: [
        "Gerbang 1 paling murah: batasi tujuan pakai sebelum model dibangun.",
        "Pensiun = cabut dari produksi + arsipkan dokumentasi, bukan sekadar 'tidak dipakai lagi'.",
      ],
      reference: "Inventory + tiering → gerbang → monitoring → revalidasi → pensiun.",
    },
    {
      id: "ai-risk",
      eyebrow: "Langkah 4 · Konsep",
      title: "Mengapa validasi statistik tidak cukup untuk AI",
      prose: [
        "Validasi statistik (backtesting, AUC, stabilitas parameter) menjawab: 'apakah model ini akurat di data yang mirip training?' Tiga risiko AI/ML lolos dari pertanyaan itu. Pertama, data drift: distribusi input bergeser setelah deploy — model tetap 'akurat menurut rumusnya' tetapi dunianya berubah. Kasus Bank Nusantara di cerita pembuka: AUC 0,91 tidak mendeteksi pergeseran populasi wilayah.",
        "Kedua, opacity: model kompleks (gradient boosting, deep learning) sulit dijelaskan. Ketika model menolak KPR, bank wajib memberi alasan spesifik yang akurat — dan 'komputer bilang begitu' bukan jawaban yang sah. Regulator AS (CFPB, 2022) menegaskan: kompleksitas model BUKAN pembelaan untuk keputusan yang tidak bisa dijelaskan. Ketiga, retraining dan vendor: model yang retrain tiap minggu = 'model baru' tiap minggu menurut definisi SR 11-7 — validasi tahunan tidak mengejar; model vendor black-box tidak bisa di-challenge dari dalam, hanya dari luar via analisis hasil.",
        "Alat deteksi drift yang paling praktis adalah Population Stability Index (PSI): ia membandingkan distribusi skor/karakteristik saat ini vs saat training, bucket per bucket. Konvensi industri: PSI < 0,10 = tidak ada perubahan berarti; 0,10–0,25 = waspada, selidiki; > 0,25 = pergeseran signifikan, bekukan dan revalidasi. PSI bukan uji statistik formal — ia alarm asap, bukan vonis kebakaran.",
        "Kerangka yang mengisi kekosongan regulasi: NIST AI Risk Management Framework 1.0 (rilis 26 Januari 2023) dengan empat fungsi — Govern (budaya & akuntabilitas), Map (pahami konteks & risiko sistem), Measure (ukur: bias, drift, robustness), Manage (tindaklanjuti). Sifatnya sukarela, tetapi menjadi bahasa bersama tim legal, data, dan produk — dan memetakan ke ISO 42001 serta EU AI Act.",
        "🚨 Mitos: 'Model AI kami retrain otomatis tiap minggu, jadi selalu up-to-date.' Yang benar: retraining tanpa validasi ulang = model baru tanpa SIM tiap minggu. Drift yang diperbaiki otomatis tanpa tercatat justru menyembunyikan perubahan perilaku model dari pengawas.",
        "💡 Intuisi: untuk setiap model AI, tetapkan DUA ambang sebelum deploy: ambang alarm (selidiki) dan ambang beku (hentikan pakai). Model tanpa ambang beku tertulis = model yang tidak akan pernah dihentikan, apa pun yang terjadi.",
      ],
      formula: String.raw`\text{PSI} = \sum_{i=1}^{k} (A_i - E_i)\,\ln\!\left(\frac{A_i}{E_i}\right)`,
      formulaNote: "A_i = porsi aktual bucket ke-i (desimal, mis. 0,14); E_i = porsi ekspektasi/training bucket ke-i; k = jumlah bucket. Contoh lab: PSI = 0,1119 → zona 'waspada' (0,10–0,25): selidiki pergeseran populasi sebelum memutuskan. Interpretasi: PSI mengukur 'jarak' distribusi — makin besar, makin jauh dunia kini dari dunia training.",
      tasks: [
        { id: "t1", text: "Sebutkan tiga risiko AI yang lolos dari validasi statistik biasa." },
        { id: "t2", text: "PSI = 0,31. Tindakan governance apa yang dipicu? Mengapa bukan 'tunggu kuartal depan'?" },
      ],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai PSI sebagai satu-satunya monitor. PSI mendeteksi pergeseran DISTRIBUSI input, bukan penurunan AKURASI. Model bisa drift tanpa PSI bergerak (jika hubungan input-output yang berubah = concept drift) — karena itu monitoring wajib berpasangan: PSI + metrik performa aktual (default rate, loss rate).",
      },
      hints: [
        "A_i dan E_i dalam desimal (0,14 bukan 14) agar ln terdefinisi benar.",
        "Bucket dengan E_i = 0 membuat PSI tak terdefinisi — gabungkan bucket kosong.",
      ],
      reference: "Drift, opacity, retraining: tiga alasan validasi statistik tidak cukup. PSI = alarm asap.",
    },
    {
      id: "lab-psi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab 1: alarm asap PSI",
      prose: [
        "Distribusi skor model KPR: ekspektasi dari data training vs aktual 3 bulan terakhir (7 bucket, dalam persen). Hitung PSI dan klasifikasikan zonanya. Angka lab ini = 0,1119 → zona waspada.",
        "Eksperimen: ubah satu bucket aktual (mis. bucket terakhir 10 → 18) dan lihat PSI melonjak melewati 0,25. Satu segmen populasi yang bergeser cukup untuk memicu pembekuan — itulah gunanya alarm.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `psi` dari `expected` dan `actual` (desimal)" },
        { id: "t2", text: "Cetak PSI dan klasifikasinya" },
      ],
      expected: "PSI=0.1119 -> WASPADA (selidiki pergeseran populasi)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa mengubah persen ke desimal sebelum memakai ln. ln(14/20) ≠ ln(0,14/0,20) — hasilnya sama sebenarnya (rasio sama), tetapi (A_i − E_i) berbeda 100x lipat. Konsisten: pakai desimal untuk keduanya.",
      },
      hints: [
        "psi = jumlah (a - e) * math.log(a / e) untuk tiap bucket.",
        "Perlu import math. Ubah persen ke desimal (/100).",
        "Klasifikasi: < 0.10 STABIL; < 0.25 WASPADA; sisanya DRIFT.",
      ],
      code: {
        starter: "import math\n\n# Distribusi skor model (persen): training vs 3 bulan terakhir. JANGAN UBAH.\nexpected = [5, 10, 20, 30, 20, 10, 5]\nactual   = [3, 7, 14, 26, 26, 14, 10]\n\n# TULIS KODEMU: PSI = Σ (A - E) * ln(A / E) dalam desimal\npsi = \n\nzona = \"STABIL\" if psi < 0.10 else (\"WASPADA\" if psi < 0.25 else \"DRIFT\")\nprint(f\"PSI={psi:.4f} -> {zona} (selidiki pergeseran populasi)\" if zona != \"STABIL\" else f\"PSI={psi:.4f} -> {zona}\")\n",
        lockLines: 6,
        solution: "import math\n\n# Distribusi skor model (persen): training vs 3 bulan terakhir. JANGAN UBAH.\nexpected = [5, 10, 20, 30, 20, 10, 5]\nactual   = [3, 7, 14, 26, 26, 14, 10]\n\n# TULIS KODEMU: PSI = Σ (A - E) * ln(A / E) dalam desimal\npsi = sum((a/100 - e/100) * math.log((a/100) / (e/100)) for a, e in zip(actual, expected))\n\nzona = \"STABIL\" if psi < 0.10 else (\"WASPADA\" if psi < 0.25 else \"DRIFT\")\nprint(f\"PSI={psi:.4f} -> {zona} (selidiki pergeseran populasi)\" if zona != \"STABIL\" else f\"PSI={psi:.4f} -> {zona}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`psi` = 0,1119", msg: "Σ (A−E)·ln(A/E) dalam desimal; 7 bucket.", name: "psi", value: 0.1119, tol: 0.001 },
          { kind: "uses", task: "t1", label: "Memakai `log`", msg: "PSI butuh logaritma natural.", token: "log" },
          { kind: "stdout_matches", task: "t2", label: "Zona WASPADA tercetak", msg: "0,1119 ada di 0,10–0,25.", pattern: "PSI=0\\.1119 -> WASPADA" }
        ],
      },
      reference: "PSI = Σ (A−E)·ln(A/E). <0,10 stabil; 0,10–0,25 waspada; >0,25 drift.",
    },
    {
      id: "lab-tiering",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 2: tiering model berbasis skor",
      prose: [
        "Model pre-screening KPR: materialitas 5 (eksposur Rp2 triliun), kompleksitas 4 (gradient boosting), opasitas 4 (sulit dijelaskan), kualitas data 2 (kurasi baik = risiko rendah). Hitung skor tiering berbobot dan tentukan tier-nya.",
        "Eksperimen: turunkan opasitas ke 2 (mis. model diganti regresi logistik yang explainable) — skor menjadi 3,55 → Tier 2. Explainability bukan soal etika abstrak; ia mengubah biaya pengawasan model secara konkret.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `skor` = Σ w × rating, tentukan `tier`" },
        { id: "t2", text: "Cetak skor, tier, dan frekuensi validasinya" },
      ],
      expected: "Skor=4.05 -> Tier 1 (validasi penuh tahunan, tim independen)",
      note: {
        title: "Intuisi",
        body: "Bobot terbesar (0,35) ada di materialitas — dampak ke bank — bukan di kecanggihan teknik. Model sederhana yang menggerakkan Rp2 triliun LEBIH berbahaya daripada model canggih yang menggerakkan Rp2 miliar. Tiering yang benar menimbang akibat, bukan kekaguman teknis.",
      },
      hints: [
        "skor = 0.35*materialitas + 0.25*kompleksitas + 0.25*opasitas + 0.15*kualitas_data.",
        "Tier: skor >= 4 -> Tier 1; >= 2.5 -> Tier 2; selain itu Tier 3.",
      ],
      code: {
        starter: "# Rating faktor risiko model (1-5). JANGAN UBAH.\nmaterialitas = 5   # eksposur Rp2 T\nkompleksitas = 4   # gradient boosting\nopasitas = 4       # sulit dijelaskan\nkualitas_data = 2  # kurasi baik = risiko rendah\n\n# TULIS KODEMU: skor berbobot dan tier\nskor = \ntier = \n\nprint(f\"Skor={skor:.2f} -> Tier {tier} (validasi penuh tahunan, tim independen)\" if tier == 1 else f\"Skor={skor:.2f} -> Tier {tier}\")\n",
        lockLines: 6,
        solution: "# Rating faktor risiko model (1-5). JANGAN UBAH.\nmaterialitas = 5   # eksposur Rp2 T\nkompleksitas = 4   # gradient boosting\nopasitas = 4       # sulit dijelaskan\nkualitas_data = 2  # kurasi baik = risiko rendah\n\n# TULIS KODEMU: skor berbobot dan tier\nskor = 0.35*materialitas + 0.25*kompleksitas + 0.25*opasitas + 0.15*kualitas_data\ntier = 1 if skor >= 4 else (2 if skor >= 2.5 else 3)\n\nprint(f\"Skor={skor:.2f} -> Tier {tier} (validasi penuh tahunan, tim independen)\" if tier == 1 else f\"Skor={skor:.2f} -> Tier {tier}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`skor` = 4,05", msg: "0,35×5 + 0,25×4 + 0,25×4 + 0,15×2.", name: "skor", value: 4.05, tol: 1e-9 },
          { kind: "equal", task: "t1", label: "`tier` = 1", msg: "4,05 ≥ 4 → Tier 1.", name: "tier", value: 1, tol: 0 },
          { kind: "stdout_matches", task: "t2", label: "Tier 1 tercetak", msg: "Format: Skor=4.05 -> Tier 1 ...", pattern: "Skor=4\\.05 -> Tier 1" }
        ],
      },
      reference: "Skor = Σ w×r. ≥4 Tier 1; 2,5–4 Tier 2; <2,5 Tier 3.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Keputusan governance: model apa, perlakuan apa",
      prose: [
        "Empat keputusan. Satu: model Tier 1 baru (skor ≥ 4) → validasi penuh oleh tim independen SEBELUM deploy; tidak ada 'deploy dulu, validasi menyusul'. Dua: model vendor black-box untuk keputusan material → tolak mengandalkan dokumentasi vendor saja; wajib outcome analysis berkala + hak audit di kontrak + ambang beku tertulis.",
        "Tiga: PSI melewati 0,25 → bekukan pemakaian untuk populasi yang drift, revalidasi, dan catat di inventory sebagai insiden model. Empat: GenAI/agentic AI untuk keputusan teregulasi (kredit, trading) → perlakukan sebagai Tier 1 PLUS human-in-the-loop yang bermakna: manusia harus bisa menolak dan alasannya tercatat. Ingat CFPB 2022: kompleksitas bukan pembelaan.",
        "Aturan praktis 10 detik: sebelum model menyentuh keputusan, jawab tiga hal — tier berapa, ambang beku di angka berapa, siapa manusia yang bertanggung jawab. Tidak bisa jawab ketiganya = model belum siap deploy.",
      ],
      figure: {
        svg: FIG_LIFECYCLE,
        alt: "Alur lifecycle model dengan gerbang keputusan.",
        caption: "Peta keputusan mengikuti gerbang lifecycle: tiap gerbang = keputusan ya/tidak.",
      },
      tasks: [
        { id: "t1", text: "Model vendor black-box untuk limit kartu Rp500 M. Keputusan governance?" },
        { id: "t2", text: "PSI = 0,31 pada model scoring. Langkah pertama?" },
      ],
      note: {
        title: "Intuisi",
        body: "Governance terbaik adalah yang membuat keputusan SULIT menjadi keputusan MURAH: template tiering, ambang PSI baku, checklist deploy. Tanpa template, tiap keputusan governance menjadi negosiasi politik — dan model berisiko selalu menang negosiasi saat bisnis sedang ngebut.",
      },
      reference: "Tier 1 → validasi dulu. Vendor → outcome analysis + hak audit. PSI > 0,25 → beku. GenAI → human-in-the-loop.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "KPR Nusantara: drift yang berharga Rp60 miliar",
      prose: [
        "Data: model pre-screening KPR memproses 50.000 aplikasi/kuartal. Setelah drift populasi (kasus cerita pembuka), tingkat persetujuan turun 62% → 54%: 4.000 aplikasi tambahan ditolak per kuartal. Audit sampel 500 penolakan menemukan 70% sebenarnya layak (false reject). Margin bersih per KPR yang disetujui: Rp15 juta. Opportunity loss = 4.000 × 70% × Rp15 juta = Rp42 miliar per kuartal — plus risiko temuan regulator soal fairness.",
        "Pertanyaan: (a) Buktikan drift dengan angka (PSI per faktor wilayah = 0,31). (b) Keputusan governance apa yang seharusnya dipicu OTOMATIS oleh angka itu? (c) Rancang remediasi 90 hari. Pembahasan: (a) PSI 0,31 > 0,25 = drift signifikan pada faktor wilayah; distribusi aktual menyimpang dari training. (b) Pembekuan pemakaian untuk tiga kabupaten yang drift + revalidasi + pencatatan insiden model di inventory — semua seharusnya sudah tertulis sebagai ambang sebelum deploy, bukan diputuskan saat krisis. (c) 30 hari: batasi populasi pakai ke wilayah training + monitoring mingguan; 60 hari: retrain dengan sampel wilayah yang cukup + uji fairness per wilayah; 90 hari: revalidasi independen + update batasan pakai di inventory.",
        "Biaya remediasi (±Rp2 miliar: data, retrain, validasi) vs opportunity loss Rp42 miliar/kuartal = 21x. Governance yang 'mahal' selalu lebih murah daripada drift yang dibiarkan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "False reject massal = risiko finansial (opportunity loss) + risiko reputasi + risiko regulasi (fairness) sekaligus. Model risk jarang muncul sebagai satu jenis kerugian — ia muncul sebagai tiga sekaligus, itulah mengapa tiering menimbang materialitas paling berat.",
      },
      reference: "PSI 0,31 → beku + revalidasi. Biaya remediasi 21x lebih murah dari drift.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — governance adalah soal keputusan, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "SR 11-7 (The Fed + OCC, 4 April 2011): model = metode kuantitatif yang menggerakkan keputusan; tiga pilar — pengembangan sehat, validasi independen, tata kelola.",
        "Revisi April 2026 mengeluarkan GenAI/agentic AI dari cakupan (menunggu RFI) — governance AI kini tanggung jawab bank sendiri.",
        "Tiering: Skor = Σ w_i·r_i; ≥4 Tier 1 (validasi penuh tahunan), 2,5–4 Tier 2, <2,5 Tier 3.",
        "Lifecycle: inventory → develop → validasi → deploy → monitoring → revalidasi → pensiun; model tanpa inventory = model liar.",
        "Validasi statistik tidak cukup untuk AI: data drift, opacity, retraining/vendor. PSI = alarm asap (<0,10 stabil; 0,10–0,25 waspada; >0,25 beku).",
        "NIST AI RMF 1.0 (26 Jan 2023): Govern–Map–Measure–Manage; CFPB 2022: kompleksitas bukan pembelaan.",
      ],
      next: { label: "MR21 — Crypto Market Risk", href: "/v2/learn/mr21-crypto-market-risk" },
      quiz: [
        {
          q: "SR 11-7 diterbitkan oleh siapa, kapan?",
          options: [
            { text: "The Fed dan OCC, 4 April 2011", why: "Benar — panduan antar-lembaga AS; FDIC mengadopsi kemudian. Revisi April 2026 mengeluarkan GenAI dari cakupan.", correct: true },
            { text: "Basel Committee, 2008", why: "Basel mengatur modal, bukan panduan model risk management AS." },
            { text: "NIST, Januari 2023", why: "Itu AI RMF 1.0 — kerangka AI sukarela, bukan panduan model risk perbankan." },
            { text: "ISDA, September 2016", why: "Itu SIMM untuk initial margin derivatif — topik MR23, bukan governance model." },
          ],
        },
        {
          q: "Model PD lolos semua uji statistik, tetapi dipakai untuk segmen yang tidak ada di data training. Ini masalah apa?",
          options: [
            { text: "Use risk — bagian dari model risk menurut SR 11-7", why: "Benar: model benar tetapi dipakai di luar batasnya = model risk. Inilah kasus Bank Nusantara.", correct: true },
            { text: "Bukan masalah — akurasi statistik sudah cukup", why: "Akurasi di populasi A tidak menjamin apa-apa di populasi B." },
            { text: "Risiko pasar", why: "Tidak ada pergerakan harga di sini — ini risiko alat pengukurnya." },
            { text: "Risiko operasional biasa", why: "Terlalu umum; SR 11-7 memberi nama spesifik: model risk via incorrect use." },
          ],
        },
        {
          q: "PSI monitoring = 0,31. Tindakan yang tepat?",
          options: [
            { text: "Tunggu kuartal depan, mungkin kembali normal", why: ">0,25 = drift signifikan; menunggu = membiarkan keputusan salah berjalan." },
            { text: "Bekukan pemakaian untuk populasi yang drift + revalidasi + catat insiden", why: "Benar: 0,31 > ambang beku 0,25. Ambang seharusnya tertulis sebelum deploy.", correct: true },
            { text: "Retrain otomatis malam ini tanpa validasi", why: "Retraining tanpa validasi = model baru tanpa SIM tiap minggu." },
            { text: "Hapus bucket yang drift dari monitoring", why: "Menghapus alarm tidak memadamkan api — itu manipulasi monitoring." },
          ],
        },
        {
          q: "Bank memakai model credit scoring black-box dari vendor untuk portofolio Rp500 M. Langkah governance tepat?",
          options: [
            { text: "Percaya dokumentasi vendor — mereka ahlinya", why: "Vendor tidak menanggung kerugianmu; SR 11-7 menuntut effective challenge oleh bank." },
            { text: "Outcome analysis berkala + hak audit di kontrak + ambang beku tertulis", why: "Benar: model yang tidak bisa di-challenge dari dalam harus di-challenge dari luar.", correct: true },
            { text: "Minta source code vendor dibuka penuh", why: "Tidak realistis dan tidak perlu — yang dibutuhkan bukti perilaku, bukan resep dapur." },
            { text: "Turunkan tier karena 'sudah dipakai banyak bank'", why: "Popularitas bukan validasi; tiering menimbang materialitas di bankMU." },
          ],
        },
        {
          q: "Bank ingin memakai GenAI untuk keputusan persetujuan kredit. Implikasi revisi panduan 2026?",
          options: [
            { text: "Boleh bebas — tidak ada aturan yang melarang", why: "'Di luar cakupan panduan' ≠ bebas aturan; bank tetap bertanggung jawab penuh atas governance-nya." },
            { text: "Dilarang total sampai RFI selesai", why: "Revisi tidak melarang — ia mendelegasikan penentuan governance ke bank." },
            { text: "Perlakukan sebagai Tier 1 plus human-in-the-loop yang bermakna dan tercatat", why: "Benar: bank 'jalan sendiri' = standar harus lebih ketat, bukan lebih longgar. CFPB: kompleksitas bukan pembelaan.", correct: true },
            { text: "Cukup validasi statistik seperti model biasa", why: "Justru inti lesson ini: validasi statistik tidak cukup untuk AI." },
          ],
        }
      ],
      reference: "Tiga pilar, tiering, lifecycle, PSI, AI governance.",
    },
  ],
};
