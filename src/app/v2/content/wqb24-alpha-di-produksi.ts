import type { V2Lesson } from "../lib/types";

const FIG_OS_DECAY = `<svg viewBox="0 0 560 310" role="img" aria-label="Line chart Sharpe OS 12 bulan yang decay vs referensi IS.">
<g font-family="var(--font-ui)">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600">Sharpe OS 12 bulan vs Sharpe IS (ilustratif)</text>
<line x1="60" y1="40" x2="60" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="60" y1="260" x2="540" y2="260" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="28" y="70" font-size="10" fill="var(--chart-text)">2,0</text>
<text x="28" y="140" font-size="10" fill="var(--chart-text)">1,25</text>
<text x="34" y="210" font-size="10" fill="var(--chart-text)">0,5</text>
<line x1="60" y1="58" x2="540" y2="58" stroke="var(--c4)" stroke-width="2" stroke-dasharray="8 5"/>
<text x="545" y="62" font-size="11" fill="var(--c4)" font-weight="600">IS 1,8</text>
<line x1="60" y1="128" x2="540" y2="128" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="545" y="132" font-size="11" fill="#e11d48">ambang 1,25</text>
<polyline points="60,58 100,66 140,80 180,88 220,104 260,120 300,140 340,158 380,176 420,192 460,204 500,216" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="300" cy="140" r="4" fill="#e11d48"/>
<text x="300" y="165" font-size="10" fill="var(--chart-text)" text-anchor="middle">bulan 6: tembus ambang</text>
<circle cx="500" cy="216" r="4" fill="#e11d48"/>
<text x="470" y="240" font-size="10" fill="var(--chart-text)" text-anchor="middle">bulan 12: 0,4</text>
<text x="60" y="292" font-size="11" fill="var(--chart-text)">Bulan 1–12 pasca-submit · OS terisi harian di tab OS halaman My Alphas</text>
</g>
</svg>`;

const FIG_PETA_DECAY = `<svg viewBox="0 0 520 380" role="img" aria-label="Flowchart respons terhadap decay OS.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Peta respons: rasio OS/IS</text>
<rect x="180" y="40" width="160" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="60" font-size="12" fill="var(--chart-text)" text-anchor="middle">Alpha ACTIVE, OS terisi</text>
<polygon points="260,82 360,116 260,150 160,116" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="120" font-size="11" fill="var(--chart-text)" text-anchor="middle">OS/IS ≥ 0,7?</text>
<text x="376" y="100" font-size="11" fill="var(--chart-text)">ya → TAHAN + pantau</text>
<polygon points="260,162 360,196 260,230 160,196" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="200" font-size="11" fill="var(--chart-text)" text-anchor="middle">OS/IS 0,4–0,7?</text>
<text x="376" y="178" font-size="11" fill="var(--chart-text)">ya → DIAGNOSIS</text>
<rect x="150" y="242" width="220" height="56" fill="var(--c4)" opacity="0.9"/>
<text x="260" y="262" font-size="11" fill="var(--chart-text)" text-anchor="middle">OS/IS &lt; 0,4 bertahan →</text>
<text x="260" y="282" font-size="11" fill="var(--chart-text)" text-anchor="middle">PENSIUNKAN (jangan kloning)</text>
<rect x="150" y="310" width="220" height="56" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="330" font-size="11" fill="var(--chart-text)" text-anchor="middle">Dataset dipensiunkan →</text>
<text x="260" y="350" font-size="11" fill="var(--chart-text)" text-anchor="middle">DECOMMISSIONED otomatis</text>
</g>
</svg>`;

export const wqb24: V2Lesson = {
  slug: "wqb24-alpha-di-produksi",
  track: "WorldQuant Brain",
  module: "Operasi Alpha",
  title: "WQB24 — Alpha di Produksi: Membaca Tab OS & Merespons Decay",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Enam bulan setelah tombol submit",
      prose: [
        "Kamu menekan Submit Alpha pada bulan Januari. Status berubah: UNSUBMITTED → ACTIVE. Di halaman My Alphas, tab OS yang tadinya kosong mulai terisi — satu baris statistik baru setiap hari, seperti rapor yang ditulis waktu secara real-time. Tiga bulan pertama indah: Sharpe OS 1,7, nyaris sama dengan Sharpe IS 1,8. Kamu mulai menghitung-hitung dalam hati.",
        "Bulan keempat: 1,4. Bulan kelima: 1,1. Bulan keenam: 0,9 — di bawah ambang submit 1,25. Panik? Kebanyakan orang melakukan satu dari dua kesalahan: (a) langsung membuat 10 varian 'perbaikan' dan mensubmitnya — mengkloning alpha yang sedang sekarat; atau (b) tidak melakukan apa-apa sambil berharap 'nanti juga balik'. Keduanya salah, dan keduanya mahal.",
        "Twist-nya: decay bukanlah vonis — ia adalah INFORMASI. Alpha yang OS-nya turun ke 0,9 tetapi stabil di sana selama setahun masih bisa berkontribusi; alpha yang OS-nya jatuh ke 0,2 dalam dua bulan memberi tahu sesuatu yang spesifik tentang sinyalmu (atau tentang datasetnya). Orang yang membaca tab OS dengan benar tidak bertanya 'apakah alpha saya masih bagus?' — ia bertanya 'apa yang dikatakan pola penurunannya?'",
        "Setelah lesson ini kamu bisa: (1) menjelaskan lifecycle UNSUBMITTED → ACTIVE → DECOMMISSIONED dan apa yang terjadi di tiap status; (2) membedakan IS, Semi-OS, dan Real OS serta membaca tab OS; (3) menghitung rasio decay OS/IS dan mengklasifikasikan tingkat keparahannya; (4) menerapkan peta respons 4 skenario saat OS melemah; (5) menjelaskan mengapa mengkloning alpha yang decay adalah kesalahan termahal.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Self-correlation mengukur kemiripan PnL alpha-mu dengan alpha lain yang sudah kamu submit (batas < 0,7, atau Sharpe 10% lebih tinggi dari yang berkorelasi). Membaca hasil simulasi berarti memeriksa IS Summary: Sharpe, fitness, turnover, margin, drawdown, dan status check sebelum submit. Overfitting adalah penyakit alpha yang bagus di data latih tetapi runtuh di data baru — decay OS yang brutal adalah gejalanya yang paling jujur.",
      },
      reference: "Submit bukan garis finis — melainkan awal masa percobaan.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga status, tiga jendela waktu",
      tasks: [],
      prose: [
        "Lifecycle resmi alpha punya tiga status. UNSUBMITTED: simulasi sukses tetapi belum disubmit — alpha masih milik pribadimu, belum dinilai. ACTIVE: sudah disubmit, lolos tes, memenuhi syarat OS testing — mulai mengakumulasi weight dan (untuk konsultan) berkontribusi pada pembayaran kuartalan. DECOMMISSIONED: dataset yang dipakainya dipensiunkan ATAU performanya di OS buruk berkepanjangan — tidak lagi mengakumulasi weight. Status ini dipertahankan sampai dataset didekomision atau WorldQuant mendekomision alpha atas kebijakannya.",
        "Tiga jendela waktu datanya: IS (In-Sample) — 5 tahun rolling untuk pengguna biasa, 10 tahun untuk konsultan; periode yang bisa kamu lihat dan utak-atik. Semi-OS — 2 tahun TERBARU yang disembunyikan untuk scoring dan testing; kamu tidak bisa mengintipnya. Real OS — performa nyata SETELAH submit, terisi harian di tab OS halaman My Alphas seiring data baru tersedia. Hanya alpha yang DISUBMIT yang dipertimbangkan untuk scoring — yang tidak disubmit tidak pernah masuk OS.",
        "Kepribadian tab OS: ia adalah cermin yang tidak bisa dibohongi. IS bisa kamu utak-atik sampai cantik (itulah overfitting); Semi-OS disembunyikan agar kamu tidak bisa mengutak-atiknya; OS adalah wasit yang tidak kenal kompromi. Alpha yang 'bagus' versi IS tetapi hancur versi OS sedang memberitahumu satu hal: kecantikan IS-nya adalah riasan, bukan wajah asli.",
        "Kapan memakai pembacaan OS: rutin, bukan saat panik. Kebiasaan profesional: cek tab OS berkala (misalnya mingguan), catat rasio OS/IS per alpha, dan miliki ambang respons SEBELUM decay terjadi — bukan ambang yang dibuat saat panik. Peta respons di langkah 6 adalah ambang yang siap pakai.",
        "Satu nasihat resmi yang jarang dipatuhi: jangan submit alpha segera setelah ia lolos cutoff performa. Perbaiki idenya sampai versi terbaik — dari sisi performa DAN korelasi. Tetapi jangan juga menghabiskan waktu luar biasa untuk satu ide: mencoba ide baru berkorelasi rendah umumnya lebih baik daripada memoles alpha berkorelasi tinggi. Korelasi rendah lebih penting daripada kenaikan performa kecil.",
      ],
      formula: String.raw`\text{Rasio Decay} = \frac{\text{Sharpe}_{OS}}{\text{Sharpe}_{IS}}`,
      formulaNote: "Sharpe_OS = Sharpe yang terakumulasi di tab OS (real out-of-sample); Sharpe_IS = Sharpe dari hasil simulasi in-sample. Rasio 1,0 = OS menyamai IS (langka dan indah); 0,7 = melemah 30%; 0,4 = sekarat. Klasifikasi langkah 6 memakai rasio ini.",
      note: {
        title: "Intuisi",
        body: "Pikirkan tiga jendela sebagai tiga ujian: IS = ujian di rumah dengan kunci jawaban di meja (bisa overfit); Semi-OS = ujian tertutup yang nilainya menentukan kelulusan (tidak bisa diintip); OS = dunia kerja setelah lulus (tidak ada yang peduli nilaimu dulu). Alpha yang hanya 'pintar di rumah' tidak akan survive di dunia kerja.",
      },
      reference: "UNSUBMITTED → ACTIVE → (dataset pensiun / OS buruk lama) → DECOMMISSIONED.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 3 · Angka",
      title: "Membedah lima tes sebelum tombol submit",
      prose: [
        "Saat kamu menekan Check Submission atau Submit Alpha, platform menjalankan tes BERURUTAN — dan berhenti di tes pertama yang gagal dengan pesan yang sesuai. Urutannya: (1) Weight test — bobot maksimum pada satu instrumen > 10%, ATAU bobot terlalu terkonsentrasi / terlalu sedikit instrumen diberi bobot → 'Maximum weight on an instrument is greater than 10%'. (2) Correlation test → 'Reduce max correlation'. (3) Fitness test → 'Improve fitness'. (4) Untuk alpha Delay-0: checkDelay1Sharpe → 'Alpha better suited for Delay 1' (alpha D0 yang gagal di sini disarankan pindah ke D1). (5) Sub-universe test → 'Improve Sharpe in SubUniverse'.",
        "Contoh konkret: alpha dengan Sharpe 2,9, fitness 2,2, tetapi satu saham memegang 30% bobot — ia GAGAL di tes nomor 1 (weight), dan kamu tidak akan pernah tahu apakah ia lolos tes 2–5 sampai bobotnya diperbaiki. Urutan ini penting untuk diagnosis: pesan error-nya memberitahu LANGKAH PERTAMA yang harus diperbaiki, bukan semua masalahnya.",
        "Angka ambang submit yang terverifikasi: fitness minimal 'Average' (> 1,3 untuk Delay-0, > 1 untuk Delay-1); Sharpe > 2 untuk Delay-0 atau > 1,25 untuk Delay-1; turnover 1%–70%; bobot maks per saham < 10%; self-correlation PnL < 0,7 (atau Sharpe minimal 10% lebih tinggi dari semua alpha berkorelasi yang sudah disubmit — misalnya alpha X Sharpe 3,18 bisa 'dilampaui' oleh alpha Y berkorelasi tinggi bila Y Sharpe ≥ 3,5).",
        "Catatan khusus ATOM (dari seksi Special Alpha Types — detail penuh di wqb25): alpha ATOM boleh melewati IS Ladder Sharpe test, tetapi WAJIB lolos tes IS reguler dan 2Y Sharpe test. Tidak ada jalan pintas dari tes inti — hanya dari tangga.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Gagal submit = alpha jelek.” Belum tentu — gagal di tes weight (satu saham 30%) adalah masalah KONSTRUKSI (perbaiki dengan truncate/rank), bukan masalah sinyal. Sebaliknya lolos semua tes juga bukan jaminan OS bagus (itulah gunanya lesson ini). Tes submit = gerbang minimum, bukan sertifikat mutu.",
      },
      hints: [
        "Hafalkan urutannya dengan mnemonik: W-C-F-D-S (Weight, Correlation, Fitness, Delay-1-check, Sub-universe).",
      ],
      reference: "Pesan error = langkah pertama yang harus diperbaiki, bukan vonis total.",
    },
    {
      id: "lab-gerbang",
      eyebrow: "Langkah 4 · Lab",
      title: "Simulator lima gerbang submit",
      prose: [
        "Implementasikan fungsi `cek_submit(a)` yang menerima dict alpha (sharpe, fitness, turnover, max_weight, max_corr, delay, sub_universe_ok) dan mengembalikan (True, 'LOLOS') atau (False, pesan_tes_pertama_yang_gagal) mengikuti urutan W-C-F-D-S: weight (max_weight > 0,10), correlation (max_corr ≥ 0,7), fitness (< 1,0 untuk D1 / < 1,3 untuk D0), delay-0 check (delay == 0 dan sharpe < 2,0 → 'Alpha better suited for Delay 1'), sub-universe (tidak ok).",
        "Jalankan pada 6 alpha dan cocokkan dengan hasil yang diharapkan. Perhatikan A4: ia gagal di DUA tes (weight & correlation) — tetapi fungsi harus melaporkan HANYA weight, karena itulah yang akan dilihat pengguna di platform.",
        "Eksperimen setelah selesai: ubah A4 max_weight menjadi 0,08 — tes apa yang kini gagal pertama? Inilah gunanya simulator: kamu bisa memprediksi 'pesan berikutnya' sebelum memperbaikinya di platform.",
      ],
      tasks: [
        { id: "t1", text: "Tulis cek_submit dengan urutan W-C-F-D-S" },
        { id: "t2", text: "Jalankan pada 6 alpha" },
      ],
      expected: "A1: LOLOS\nA2: GAGAL @ weight\nA3: GAGAL @ correlation\nA4: GAGAL @ weight\nA5: GAGAL @ delay1check\nA6: GAGAL @ subuniverse",
      note: {
        title: "Intuisi",
        body: "Simulator ini meniru 'pikiran' tombol Check Submission. Nilai praktisnya: sebelum submit, jalankan checklist ini di kepalamu — setiap 'GAGAL @ X' yang bisa kamu prediksi sendiri adalah satu putaran submit-gagal-perbaiki yang tidak perlu terjadi.",
      },
      hints: [
        "Ambang fitness tergantung delay: D0 -> 1.3, D1 -> 1.0.",
        "Kembalikan tuple (False, 'weight') dst; cetak format 'A1: LOLOS' / 'A2: GAGAL @ weight'.",
      ],
      code: {
        starter: "# dict alpha. JANGAN UBAH.\nalphas = [\n    {\"id\": \"A1\", \"sharpe\": 2.4, \"fitness\": 1.8, \"turnover\": 0.25, \"max_weight\": 0.06, \"max_corr\": 0.4, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A2\", \"sharpe\": 2.9, \"fitness\": 2.2, \"turnover\": 0.20, \"max_weight\": 0.30, \"max_corr\": 0.3, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A3\", \"sharpe\": 2.1, \"fitness\": 1.7, \"turnover\": 0.30, \"max_weight\": 0.07, \"max_corr\": 0.85, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A4\", \"sharpe\": 2.6, \"fitness\": 2.0, \"turnover\": 0.22, \"max_weight\": 0.15, \"max_corr\": 0.90, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A5\", \"sharpe\": 1.6, \"fitness\": 1.5, \"turnover\": 0.18, \"max_weight\": 0.05, \"max_corr\": 0.2, \"delay\": 0, \"sub_ok\": True},\n    {\"id\": \"A6\", \"sharpe\": 2.2, \"fitness\": 1.9, \"turnover\": 0.28, \"max_weight\": 0.06, \"max_corr\": 0.5, \"delay\": 1, \"sub_ok\": False},\n]\n\n# TULIS KODEMU\ndef cek_submit(a):\n    return (True, \"LOLOS\")  # atau (False, \"weight\"/\"correlation\"/...)\n\nfor a in alphas:\n    ok, msg = cek_submit(a)\n    print(f\"{a['id']}: {'LOLOS' if ok else 'GAGAL @ ' + msg}\")\n",
        lockLines: 9,
        solution: "# dict alpha. JANGAN UBAH.\nalphas = [\n    {\"id\": \"A1\", \"sharpe\": 2.4, \"fitness\": 1.8, \"turnover\": 0.25, \"max_weight\": 0.06, \"max_corr\": 0.4, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A2\", \"sharpe\": 2.9, \"fitness\": 2.2, \"turnover\": 0.20, \"max_weight\": 0.30, \"max_corr\": 0.3, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A3\", \"sharpe\": 2.1, \"fitness\": 1.7, \"turnover\": 0.30, \"max_weight\": 0.07, \"max_corr\": 0.85, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A4\", \"sharpe\": 2.6, \"fitness\": 2.0, \"turnover\": 0.22, \"max_weight\": 0.15, \"max_corr\": 0.90, \"delay\": 1, \"sub_ok\": True},\n    {\"id\": \"A5\", \"sharpe\": 1.6, \"fitness\": 1.5, \"turnover\": 0.18, \"max_weight\": 0.05, \"max_corr\": 0.2, \"delay\": 0, \"sub_ok\": True},\n    {\"id\": \"A6\", \"sharpe\": 2.2, \"fitness\": 1.9, \"turnover\": 0.28, \"max_weight\": 0.06, \"max_corr\": 0.5, \"delay\": 1, \"sub_ok\": False},\n]\n\n# TULIS KODEMU\ndef cek_submit(a):\n    if a[\"max_weight\"] > 0.10:\n        return (False, \"weight\")\n    if a[\"max_corr\"] >= 0.7:\n        return (False, \"correlation\")\n    f_min = 1.3 if a[\"delay\"] == 0 else 1.0\n    if a[\"fitness\"] < f_min:\n        return (False, \"fitness\")\n    if a[\"delay\"] == 0 and a[\"sharpe\"] < 2.0:\n        return (False, \"delay1check\")\n    if not a[\"sub_ok\"]:\n        return (False, \"subuniverse\")\n    return (True, \"LOLOS\")\n\nfor a in alphas:\n    ok, msg = cek_submit(a)\n    print(f\"{a['id']}: {'LOLOS' if ok else 'GAGAL @ ' + msg}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "A1 lolos", msg: "Semua tes terpenuhi.", pattern: "A1: LOLOS" },
          { kind: "stdout_matches", task: "t2", label: "A2 gagal weight", msg: "Bobot 30% > 10%.", pattern: "A2: GAGAL @ weight" },
          { kind: "stdout_matches", task: "t2", label: "A4 lapor weight dulu", msg: "Urutan: weight sebelum correlation.", pattern: "A4: GAGAL @ weight" },
          { kind: "stdout_matches", task: "t2", label: "A5 gagal delay1check", msg: "D0 Sharpe 1,6 < 2,0.", pattern: "A5: GAGAL @ delay1check" },
          { kind: "stdout_matches", task: "t2", label: "A6 gagal subuniverse", msg: "Tes terakhir.", pattern: "A6: GAGAL @ subuniverse" }
        ],
      },
      reference: "W-C-F-D-S: urutan platform, urutan diagnosis.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 5 · Chart",
      title: "Membaca kurva decay di tab OS",
      prose: [
        "Cara membaca: sumbu X = 12 bulan pasca-submit; sumbu Y = Sharpe; garis putus-putus hijau = Sharpe IS 1,8 (referensi 'masa jaya'); garis merah = ambang 1,25; garis biru = Sharpe OS aktual per bulan. Titik merah menandai momen penting: bulan 6 menembus ambang, bulan 12 di 0,4.",
        "Interpretasi: tiga fase terlihat jelas. Fase 1 (bulan 1–3): OS menempel IS — masa bulan madu, rasio ~0,95. Fase 2 (bulan 4–6): penurunan stabil menembus ambang — ini fase DIAGNOSIS (langkah 6), bukan fase panik. Fase 3 (bulan 7–12): stabil di zona 0,4–0,8 — alpha tidak mati total, tetapi tidak lagi layak diandalkan. Pola 'turun lalu datar' seperti ini khas sinyal yang edge-nya terkikis kompetisi, bukan sinyal yang rusak total.",
        "Yang TIDAK boleh disimpulkan dari chart ini: 'alpha-nya jelek dari awal' — tiga bulan pertamanya membuktikan ia nyata. Yang BOLEH disimpulkan: edge-nya punya umur simpan ~6 bulan pada level ambang, dan keputusan di bulan 6 (diagnosis, bukan kloning, bukan diam) menentukan nasib kuartal berikutnya.",
      ],
      figure: {
        svg: FIG_OS_DECAY,
        alt: "Line chart Sharpe OS 12 bulan menurun dari 1,8 ke 0,4, menembus ambang 1,25 di bulan 6.",
        caption: "Tiga fase OS: bulan madu (1–3), tembus ambang (4–6), zona sekarat stabil (7–12).",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Chart OS yang sehat pun menurun — pertanyaan bukan 'apakah decay?' (jawabannya selalu ya, cepat atau lambat), melainkan 'seberapa cepat dan apa polanya?'. Alpha tanpa decay sama sekali justru patut dicurigai: mungkin datanya bocor (lookahead).",
      },
      reference: "Decay bukan vonis — ia informasi berpola.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta respons: 4 skenario decay",
      prose: [
        "Skenario 1 — Rasio OS/IS ≥ 0,7: TAHAN + PANTAU. Fluktuasi normal. Lanjutkan monitoring mingguan; tidak ada tindakan. Contoh: IS 1,8, OS 1,5 → rasio 0,83.",
        "Skenario 2 — Rasio 0,4–0,7: DIAGNOSIS. Jangan kloning, jangan diam — selidiki. Checklist: (a) apakah SELURUH alpha-mu melemah bersamaan? → kemungkinan rezim pasar berubah, bukan sinyalmu yang rusak; (b) cek self-correlation — apakah alpha 'saudara' yang mirip juga melemah? → edge family-nya yang terkikis; (c) ada pengumuman dataset? → bisa jadi perubahan definisi field; (d) bandingkan dengan Semi-OS bila tersedia — bila Semi-OS juga lemah, overfitting IS kemungkinan besar.",
        "Skenario 3 — Rasio < 0,4 bertahan: PENSIUNKAN. Berhenti mengandalkannya untuk kontribusi; JANGAN membuat 10 varian 'perbaikan' — mengkloning alpha sekarat hanya mengkloning kematiannya (dan membuang slot submit harianmu yang terbatas: 4 alpha + 1 SuperAlpha per hari untuk konsultan). Alihkan energi ke ide baru berkorelasi rendah — nasihat resmi: korelasi rendah lebih penting daripada memoles yang sekarat.",
        "Skenario 4 — Dataset dipensiunkan: DECOMMISSIONED OTOMATIS. Bukan salahmu — tetapi idenya bisa 'pindah rumah': bila logika sinyalnya generik, bangun ulang di atas dataset pengganti yang masih hidup, lalu simulasikan dari nol (jangan copy-paste bobot lama).",
        "Cara membaca figur: hitung dulu rasio OS/IS-mu, lalu masuk ke belah ketupat yang sesuai — tiap jalur berakhir pada TINDAKAN, bukan pada perasaan. Interpretasi: peta ini memindahkan keputusan dari 'panik vs berharap' menjadi 'ukur vs selidiki vs pensiunkan'.",
        "Aturan praktis 10 detik: rasio ≥ 0,7 tahan · 0,4–0,7 selidiki (rezim? saudara? dataset?) · < 0,4 pensiunkan, jangan kloning · dataset pensiun = pindah rumah, bukan berkabung.",
      ],
      figure: {
        svg: FIG_PETA_DECAY,
        alt: "Flowchart respons decay: tahan, diagnosis, pensiunkan, atau decommissioned otomatis.",
        caption: "Empat skenario: ukur rasionya, ikuti jalurnya, bertindak — bukan panik.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“OS melemah = saya harus segera submit versi 'diperbaiki'.” Ini kesalahan termahal: varian yang dibuat panik dari alpha yang decay biasanya (a) berkorelasi tinggi dengan alpha aslinya (gagal correlation test), dan (b) mengulangi overfitting yang sama. Aturan resmi justru sebaliknya: ide BARU berkorelasi rendah > polesan alpha sekarat.",
      },
      reference: "Ukur, selidiki, pensiunkan — jangan kloning yang sekarat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kasus: tiga alpha, satu yang berdarah",
      prose: [
        "Portofoliomu: Alpha P (IS 2,0, OS bulan-8: 1,6), Alpha Q (IS 1,9, OS bulan-8: 0,8), Alpha R (IS 2,2, OS bulan-8: 0,3 — dan SEMUA alpha berbasis dataset yang sama juga melemah bulan ini). Tentukan respons per alpha (tahan/diagnosis/pensiunkan + satu kalimat) SEBELUM membaca pembahasan.",
        "Pembahasan: P — TAHAN (rasio 0,8 ≥ 0,7; fluktuasi normal). Q — DIAGNOSIS (rasio 0,42; masuk zona 0,4–0,7; selidiki: cek 'saudara' sefamily dan rezim — bila saudaranya juga melemah, edge family terkikis). R — DIAGNOSIS DATASET DULU (rasio 0,14 < 0,4, TETAPI semua alpha datasetnya melemah → tersangka utama = dataset, bukan sinyal; cek pengumuman dekomision/perubahan field sebelum mempensiunkan sinyalnya). Satu kalimat tiap alpha — itulah disiplin meja operasi.",
        "Perhatikan jebakannya: tanpa info 'semua alpha datasetnya melemah', R langsung dipensiunkan. DENGAN info itu, vonisnya berubah total — dari 'sinyalmu mati' menjadi 'rumahnya kebakaran'. Inilah mengapa diagnosis (skenario 2) selalu mendahului pensiun (skenario 3): vonis tanpa konteks adalah fitnah terhadap sinyalmu sendiri.",
        "Variasi: bagaimana bila Q ternyata punya 'saudara' self-correlation 0,85 yang OS-nya masih 1,7? Maka tersangka bergeser: bukan family-nya yang mati, melainkan SESUATU yang spesifik pada Q (mungkin overfit pada detail implementasi). Diagnosis yang baik mempersempit tersangka, bukan memperlebar kepanikan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Pola 'rumah kebakaran vs penghuni sakit' ini universal di risk: saat banyak metrik melemah bersamaan, selidiki faktor BERSAMA dulu (data, rezim, infrastruktur) sebelum menyalahkan tiap model satu per satu. Ini menghemat 90% waktu investigasi insiden.",
      },
      reference: "Diagnosis dulu: rumah kebakaran atau penghuni sakit?",
    },
    {
      id: "lab-decay",
      eyebrow: "Langkah 8 · Lab",
      title: "Monitor decay: tulis penjaga OS",
      prose: [
        "Tulis fungsi `status_os(sharpe_is, deret_os)` yang menerima Sharpe IS dan list Sharpe OS bulanan, lalu untuk tiap bulan menghitung rasio dan mengembalikan list status: 'TAHAN' (rasio ≥ 0,7), 'DIAGNOSIS' (0,4–0,7), 'PENSIUNKAN' (< 0,4). Cetak tabel bulan, Sharpe OS, rasio, status untuk alpha contoh.",
        "Eksperimen setelah selesai: ubah ambang menjadi 0,8/0,5 (lebih ketat) — berapa bulan lebih awal vonis 'PENSIUNKAN' muncul? Diskusikan trade-off-nya: ambang ketat = pensiun dini (mungkin membuang alpha yang akan pulih) vs ambang longgar = menahan mayat (membuang slot dan perhatian). Tidak ada ambang sempurna — yang ada hanya ambang yang KONSISTEN.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi status_os" },
        { id: "t2", text: "Cetak tabel 12 bulan + hitung bulan vonis" },
      ],
      expected: "bulan 6: DIAGNOSIS pertama\nbulan 10: PENSIUNKAN pertama",
      note: {
        title: "Intuisi",
        body: "Fungsi ini adalah 'asisten jaga malam' portofoliomu: ia tidak lelah, tidak panik, tidak berharap — hanya mengukur dan melapor. Di operasi nyata, inilah spreadsheet atau dashboard yang kamu buka tiap Senin pagi sebelum kopi kedua.",
      },
      hints: [
        "rasio = os / sharpe_is; status via if/elif berurutan.",
        "Cari indeks pertama tiap status untuk vonis pertama.",
      ],
      code: {
        starter: "# Sharpe IS & deret OS 12 bulan. FIKTIF. JANGAN UBAH.\nsharpe_is = 1.8\nos = [1.75, 1.70, 1.72, 1.55, 1.40, 1.15, 1.00, 0.90, 0.75, 0.62, 0.55, 0.50]\n\n# TULIS KODEMU\ndef status_os(sharpe_is, deret_os):\n    return []  # list 'TAHAN'/'DIAGNOSIS'/'PENSIUNKAN' per bulan\n\nstatus = status_os(sharpe_is, os)\nfor i, (o, s) in enumerate(zip(os, status), start=1):\n    print(f\"bulan {i}: OS={o:.2f} rasio={o / sharpe_is:.2f} -> {s}\")\n",
        lockLines: 3,
        solution: "# Sharpe IS & deret OS 12 bulan. FIKTIF. JANGAN UBAH.\nsharpe_is = 1.8\nos = [1.75, 1.70, 1.72, 1.55, 1.40, 1.15, 1.00, 0.90, 0.75, 0.62, 0.55, 0.50]\n\n# TULIS KODEMU\ndef status_os(sharpe_is, deret_os):\n    out = []\n    for o in deret_os:\n        r = o / sharpe_is\n        if r >= 0.7:\n            out.append(\"TAHAN\")\n        elif r >= 0.4:\n            out.append(\"DIAGNOSIS\")\n        else:\n            out.append(\"PENSIUNKAN\")\n    return out\n\nstatus = status_os(sharpe_is, os)\nfor i, (o, s) in enumerate(zip(os, status), start=1):\n    print(f\"bulan {i}: OS={o:.2f} rasio={o / sharpe_is:.2f} -> {s}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "bulan 1 TAHAN", msg: "Rasio 0,97.", pattern: "bulan 1: OS=1\\.75 rasio=0\\.97 -> TAHAN" },
          { kind: "stdout_matches", task: "t2", label: "bulan 6 DIAGNOSIS", msg: "Rasio 0,64 masuk zona diagnosis.", pattern: "bulan 6: OS=1\\.15 rasio=0\\.64 -> DIAGNOSIS" },
          { kind: "stdout_matches", task: "t2", label: "bulan 12 PENSIUNKAN", msg: "Rasio 0,28.", pattern: "bulan 12: OS=0\\.50 rasio=0\\.28 -> PENSIUNKAN" }
        ],
      },
      reference: "Penjaga OS: ukur tiap bulan, vonis tanpa drama.",
    },
    {
      id: "rekonsiliasi",
      eyebrow: "Langkah 9 · Konsep",
      title: "Rekonsiliasi: 7 IS checks vs 5 tes submit",
      prose: [
        "Track ini memberimu dua daftar gerbang: 7 IS checks di WQB11 dan 5 tes submit di langkah 3 lesson ini. Keduanya benar — tetapi keduanya bukan daftar yang sama, dan tidak pernah dijelaskan hubungannya sampai sekarang. Ini rekonsiliasinya.",
        "Yang tumpang tindih (satu syarat, dua nama). Fitness: IS check nomor 2 (fitness 1,0 atau lebih) adalah tes submit nomor 3 — angka yang sama, diperiksa dua kali di dua momen (saat membaca hasil, dan saat menekan submit). Korelasi: IS check nomor 7 (self-correlation di bawah 0,7) adalah inti tes submit nomor 2 — tetapi tes submit lebih luas: ia juga memeriksa korelasi terhadap alpha produksi WorldQuant, bukan hanya terhadap milikmu sendiri. Sub-universe: IS check nomor 6 (Sharpe minimum segmen 1,0 atau lebih) adalah tes submit nomor 5 — syarat yang sama, ditegakkan di pintu terakhir.",
        "Yang hanya ada di IS checks (WQB11): Sharpe 1,25 atau lebih, turnover 0,7 atau kurang, drawdown 15 persen atau kurang, dan long 40–60 persen. Keempatnya adalah penilaian kualitas HASIL simulasi — platform tidak mengulanginya sebagai tes bernama saat submit, tetapi tiga di antaranya hidup di dalam tes lain: turnover dijaga lewat rumus fitness (turnover tinggi menekan fitness), Sharpe dijaga lewat fitness dan lewat delay-1-check, drawdown dan long-short tetap menjadi bagian dari pemeriksaan hasil sebelum tombol submit ditekan.",
        "Yang hanya ada di tes submit (lesson ini): weight test — bobot maksimum satu saham di atas 10 persen — dan delay-1-check — alpha Delay-0 yang Sharpe-nya di bawah 2,0 disarankan pindah ke Delay-1. Weight test tidak muncul di IS checks karena ia bukan soal kualitas sinyal, melainkan soal konstruksi portofolio: satu saham tidak boleh mendominasi buku. Delay-1-check tidak muncul di IS checks karena ia soal pilihan setting, bukan soal hasil.",
        "Catatan kejujuran tentang ambang Delay-0 (W1): angka ambang Delay-0 di lesson ini (Sharpe di atas 2, fitness di atas 1,3) adalah versi yang diajarkan track ini — angka ambang di WQB3, WQB4, dan WQB11 TIDAK diubah, dan angka di sini juga TIDAK diubah. Alasannya: dokumentasi resmi WorldQuant Brain tidak mempublikasikan angka ambang Delay-0 secara terbuka — tinjauan independen (Quantt, 2026) menyatakan dokumentasi resmi hanya menyebut kriteria 'bervariasi sedikit tergantung region dan Delay', tanpa angka Delay-0. Yang terverifikasi dari banyak sumber komunitas hanyalah ambang Delay-1 (Sharpe 1,25, fitness 1,0). Ketegangan dengan WQB6 ('platform memaksakan delay 1') dijelaskan begini: default kerja track ini adalah Delay-1; Delay-0 ada sebagai setting simulasi dengan gerbang yang lebih ketat versi track — sebelum mensubmit alpha Delay-0, verifikasi gerbang yang berlaku di platform saat itu, jangan jadikan angka track ini sebagai kutipan resmi platform.",
      ],
      tasks: [],
      note: {
        title: "Cara memakai dua daftar",
        type: "risk",
        body: "IS checks = daftar periksa saat MEMBACA hasil (apakah kandidat ini bagus?). Tes submit = gerbang saat MENEKAN tombol (apakah kandidat ini boleh masuk?). Kandidat bisa lolos 7/7 IS checks tetapi gagal weight test — dan itu bukan kontradiksi: ia bagus sebagai sinyal, tetapi dibangun dengan konstruksi yang terlalu terkonsentrasi. Perbaiki konstruksinya (truncate/rank sizing), bukan sinyalnya.",
      },
      reference: "Tumpang tindih: fitness, korelasi, sub-universe. Hanya IS: Sharpe, turnover, drawdown, long. Hanya submit: weight, delay-1-check.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi masa produksi",
      prose: [
        "Lima pertanyaan — jawab sebagai operator, bukan sebagai penonton.",
      ],
      tasks: [],
      summary: [
        "Lifecycle: UNSUBMITTED → ACTIVE → DECOMMISSIONED (dataset pensiun / OS buruk lama).",
        "IS 5thn (konsultan 10thn) terlihat; Semi-OS 2thn disembunyikan; Real OS terisi harian di tab OS.",
        "Lima tes berurutan: Weight → Correlation → Fitness → Delay-1-check → Sub-universe.",
        "Rasio OS/IS: ≥0,7 tahan; 0,4–0,7 diagnosis; <0,4 pensiunkan — jangan kloning yang sekarat.",
        "Nasihat resmi: sempurnakan sebelum submit, tetapi ide baru berkorelasi rendah > polesan alpha sekarat.",
        "Bila semua alpha satu dataset melemah bersamaan: selidiki dataset dulu, bukan sinyalnya.",
        "Rekonsiliasi: fitness, korelasi, sub-universe ada di kedua daftar; Sharpe/turnover/drawdown/long hanya di IS checks; weight + delay-1-check hanya di tes submit. Ambang Delay-0 (Sharpe > 2, fitness > 1,3) adalah versi track — tidak terverifikasi dari dokumen resmi; verifikasi di platform sebelum submit D0.",
      ],
      quiz: [
        {
          q: "Alpha ACTIVE menjadi DECOMMISSIONED karena?",
          options: [
            { text: "Dataset dipensiunkan atau OS buruk berkepanjangan", why: "Tepat — dua pemicu resmi.", correct: true },
            { text: "Sharpe IS turun di bawah 1,25", why: "IS tidak berubah pasca-submit; yang dinilai adalah OS." },
            { text: "Konsultan lupa login 4 jam", why: "Sesi login tidak memengaruhi status alpha." },
            { text: "Alpha tidak disubmit ulang tiap kuartal", why: "Tidak ada kewajiban submit ulang; ACTIVE bertahan sampai pemicu resmi." }
          ],
        },
        {
          q: "Urutan tes saat menekan Submit Alpha?",
          options: [
            { text: "Weight → Correlation → Fitness → Delay-1-check → Sub-universe", why: "Benar — W-C-F-D-S.", correct: true },
            { text: "Fitness → Sharpe → Turnover → Weight → Correlation", why: "Itu campuran metrik, bukan urutan tes platform." },
            { text: "Sub-universe → Weight → Correlation → Fitness", why: "Sub-universe adalah tes TERAKHIR, bukan pertama." },
            { text: "Correlation → Weight → Sub-universe → Fitness", why: "Weight selalu pertama." }
          ],
        },
        {
          q: "Alpha IS 1,8, OS bulan-8 = 0,9. Respons benar?",
          options: [
            { text: "DIAGNOSIS — rasio 0,5; selidiki rezim/saudara/dataset", why: "Tepat — zona 0,4–0,7.", correct: true },
            { text: "Langsung PENSIUNKAN", why: "0,5 > 0,4 — belum zona pensiun." },
            { text: "TAHAN tanpa tindakan", why: "0,5 < 0,7 — butuh diagnosis, bukan didiamkan." },
            { text: "Buat 10 varian perbaikan dan submit", why: "Kesalahan termahal — kloning yang sekarat." }
          ],
        },
        {
          q: "Semua alphamu berbasis satu dataset melemah bulan ini. Tersangka utama?",
          options: [
            { text: "Dataset-nya — selidiki pengumuman/perubahan field dulu", why: "Benar — faktor bersama sebelum menyalahkan tiap sinyal.", correct: true },
            { text: "Semua sinyalmu rusak bersamaan", why: "Tidak masuk akal — kegagalan serentak menunjuk faktor bersama." },
            { text: "Kamu kurang beruntung bulan ini", why: "'Sial' bukan diagnosis; cari penyebab sistematis." },
            { text: "Segera ganti semua ke dataset lain", why: "Terburu-buru — selidiki dulu sebelum migrasi." }
          ],
        },
        {
          q: "Nasihat resmi soal timing submit?",
          options: [
            { text: "Jangan submit segera setelah lolos cutoff — sempurnakan dulu, tetapi utamakan ide baru berkorelasi rendah", why: "Tepat — dua sisi nasihat resmi.", correct: true },
            { text: "Submit secepatnya — siapa cepat dia dapat", why: "Bertentangan dengan nasihat resmi." },
            { text: "Poles satu alpha sampai sempurna sebelum coba ide lain", why: "Nasihat resmi: jangan habiskan waktu luar biasa untuk satu ide." },
            { text: "Korelasi tidak penting selama Sharpe tinggi", why: "Resmi: korelasi rendah LEBIH penting dari kenaikan performa kecil." }
          ],
        }
      ],
      reference: "Produksi = masa percobaan yang tidak pernah berakhir.",
    },
  ],
};
