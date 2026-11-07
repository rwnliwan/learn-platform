import type { V2Lesson } from "../lib/types";

// ── Figure: kalibrasi prediksi vs realisasi per bucket ─────────────────────
const KALIB_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Diagram batang kalibrasi: prediksi vs realisasi per bucket, selisih maks 10 poin">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="228" x2="500" y2="228"/>
<line x1="60" y1="178" x2="500" y2="178"/><line x1="60" y1="128" x2="500" y2="128"/>
<line x1="60" y1="78" x2="500" y2="78"/><line x1="60" y1="28" x2="500" y2="28"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="231">0</text><text x="54" y="181">25</text>
<text x="54" y="131">50</text><text x="54" y="81">75</text>
<text x="54" y="31">100%</text>
</g>
<g font-size="10" font-family="var(--font-ui)">
<g>
<rect x="80" y="208" width="26" height="20" fill="var(--c1)" opacity="0.9"/>
<rect x="108" y="218" width="26" height="10" fill="var(--c4)" opacity="0.9"/>
<text x="107" y="244" text-anchor="middle" fill="var(--text)">0–20</text>
</g>
<g>
<rect x="160" y="168" width="26" height="60" fill="var(--c1)" opacity="0.9"/>
<rect x="188" y="188" width="26" height="40" fill="var(--c4)" opacity="0.9"/>
<text x="187" y="244" text-anchor="middle" fill="var(--text)">20–40</text>
</g>
<g>
<rect x="240" y="128" width="26" height="100" fill="var(--c1)" opacity="0.9"/>
<rect x="268" y="148" width="26" height="80" fill="var(--c4)" opacity="0.9"/>
<text x="267" y="244" text-anchor="middle" fill="var(--text)">40–60</text>
</g>
<g>
<rect x="320" y="88" width="26" height="140" fill="var(--c1)" opacity="0.9"/>
<rect x="348" y="108" width="26" height="120" fill="var(--c4)" opacity="0.9"/>
<text x="347" y="244" text-anchor="middle" fill="var(--text)">60–80</text>
</g>
<g>
<rect x="400" y="48" width="26" height="180" fill="var(--c1)" opacity="0.9"/>
<rect x="428" y="68" width="26" height="160" fill="var(--c4)" opacity="0.9"/>
<text x="427" y="244" text-anchor="middle" fill="var(--text)">80–100</text>
</g>
</g>
<g font-size="11" font-family="var(--font-ui)">
<rect x="64" y="258" width="12" height="12" fill="var(--c1)"/><text x="80" y="268" fill="var(--text)">prediksi (tengah bucket)</text>
<rect x="230" y="258" width="12" height="12" fill="var(--c4)"/><text x="246" y="268" fill="var(--text)">realisasi gagal bayar</text>
</g>
</svg>`;

export const b24: V2Lesson = {
  slug: "b24-backtesting-monitoring-model",
  track: "Probabilitas",
  module: "Terapkan",
  title: "B24 — Backtesting & Monitoring Model Probabilistik",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model yang benar saat lahir, salah saat dewasa",
      prose: [
        "Tahun 2023, tim risiko sebuah multifinance meluncurkan scorecard kredit dengan AUC 0,78 di validasi — “model terbaik yang pernah kami buat”. 2024 berjalan mulus. Awal 2025, NPL naik 3% tanpa ada perubahan kebijakan. Tim menyalahkan “kondisi ekonomi”. Seorang analis junior iseng membandingkan prediksi vs realisasi per bucket skor: bucket “risiko 10%” ternyata gagal bayar 22% — model masih MEMERINGKAT dengan benar (yang skor buruk memang lebih buruk), tetapi ANGKA probabilitasnya sudah basi dua tahun. Model tidak “rusak” — ia hanya menua, dan tidak ada yang memasang alat untuk mendeteksinya.",
        "Twist-nya: semua metrik yang dipantau tim — AUC, approval rate, NPL agregat — terlihat “baik-baik saja” selama 18 bulan. AUC bahkan NAIK sedikit. Yang tidak dipantau: kalibrasi (apakah “10%” masih berarti 10%?) dan drift distribusi skor. Dua metrik yang murah dihitung, tetapi tidak ada di dashboard siapa pun. Lesson ini memasang kedua alat itu — dan aturan kapan model butuh rekalibrasi vs dibangun ulang.",
        "Tiga hal yang akan kamu kuasai: (1) backtest kalibrasi — membandingkan prediksi vs realisasi per bucket; (2) PSI — satu angka untuk drift distribusi skor; (3) sistem monitoring: ambang, frekuensi, dan keputusan rekalibrasi vs rebuild.",
      ],
      tasks: [],
      note: {
        title: "Catatan prasyarat (F2: mandiri)",
        type: "risk",
        body: "Lesson ini memakai dua bekal yang diringkas di sini agar mandiri: (1) probabilitas prediksi model kredit = angka 0–1 yang menyatakan peluang gagal bayar (lesson B21–B23 memakai konsep ini untuk scorecard & A/B testing); (2) logaritma natural ln dipakai di rumus PSI — yang perlu kamu tahu hanya sifatnya: ln(1) = 0, ln(x>1) positif, ln(x<1) negatif. Tidak perlu kalkulus.",
      },
      reference: "AUC bisa naik sementara kalibrasi basi. Pantau prediksi-vs-realisasi + drift, bukan hanya ranking.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal lesson ini",
      prose: [
        "Daftar isi: (1) Cerita scorecard yang menua. (2) Peta ini. (3) Konsep: backtest kalibrasi — Si Cermin Jujur. (4) Konsep: PSI — Si Termometer Distribusi. (5) Konsep: sistem monitoring — rekalibrasi vs rebuild. (6) Lab 1: hitung realisasi per bucket + vonis kalibrasi. (7) Lab 2: hitung PSI + vonis drift. (8) Chart: prediksi vs realisasi per bucket. (9) Peta keputusan: respons per sinyal. (10) Mini-case: dashboard monitoring scorecard. (11) Checkpoint: kuis + rangkuman.",
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) melakukan backtest kalibrasi dan membaca hasilnya; (2) menghitung PSI dan menafsirkan ambangnya; (3) merancang cadence monitoring model kredit; (4) memutuskan rekalibrasi vs rebuild dari bukti.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri: rata-rata dan pembagian; list Python; fungsi logaritma (math.log); pemahaman “bucket = kelompok skor”. Tidak perlu statistik lanjut.",
        "Rutenya: cerita → peta → tiga konsep inti → dua lab → chart kalibrasi → peta keputusan → mini-case → kuis. Estimasi 65 menit; dua lab ±18 menit.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: anggap model kredit sebagai ramalan cuaca. AUC = “apakah hari hujan diprediksi lebih basah dari hari cerah” (ranking — tetap benar walau angkanya meleset). Kalibrasi = “apakah ‘peluang hujan 10%’ benar-benar hujan 10 dari 100 kali” (angka — inilah yang basi). Ramalan yang bilang 10% tetapi hujan 22% masih meranking dengan benar — dan tetap menyesatkan semua keputusan yang memakai angkanya.",
      ],
      reference: "Tujuan: backtest kalibrasi + PSI + sistem monitoring + keputusan rekalibrasi/rebuild.",
    },
    {
      id: "konsep-kalibrasi",
      eyebrow: "Langkah 3 · Konsep",
      title: "Backtest Kalibrasi — Si Cermin Jujur",
      prose: [
        "Definisi: backtest kalibrasi mengelompokkan prediksi model ke dalam bucket (mis. 0–20%, 20–40%, …, 80–100%), lalu membandingkan rata-rata prediksi tiap bucket dengan TINGKAT KEJADIAN AKTUAL di bucket itu. Model terkalibrasi sempurna: bucket “10%” gagal bayar ≈ 10 dari 100. Selisihnya = calibration error per bucket; yang dilaporkan = maksimumnya.",
        "Kepribadiannya: kalibrasi adalah cermin jujur di kamar mandi — tidak memuji, tidak menghina, hanya menunjukkan apa adanya. AUC adalah fotografer yang pandai mengambil angle: ia bisa membuatmu terlihat baik (ranking benar) sementara cermin menunjukkan yang sebenarnya (angka meleset). Scorecard cerita pembuka: cerminnya menunjukkan bucket “10%” berisi 22% gagal bayar — fotografernya (AUC 0,78) tetap tersenyum.",
        "Kapan memakai: JALANKAN backtest kalibrasi tiap kali model dipakai untuk keputusan berbasis ANGKA (bukan sekadar ranking): penetapan bunga berbasis risiko, pencadangan (provisi), limit kredit. Tiga aturan cermin: (1) bucket harus cukup isi (≥30 observasi per bucket — bucket 5 observasi = cermin retak); (2) bandingkan dengan periode yang RELEVAN (out-of-time, bukan data training); (3) ambang aksi: error kalibrasi maksimum >15 poin → rekalibrasi wajib (lihat Langkah 5).",
      ],
      tasks: [],
      formula: String.raw`e_{max} = \max_b \lvert \bar{y}_b - \bar{p}_b \rvert`,
      formulaNote: "e_max = error kalibrasi maksimum; b = satu bucket; ȳ_b = tingkat kejadian aktual di bucket b (mis. 0,22 = 22% gagal bayar); p̄_b = rata-rata prediksi di bucket b (mis. 0,10). Contoh lab: bucket 0–20% → |0,05 − 0,10| = 0,05; maksimum kelima bucket = 0,10 (10 poin) → di bawah ambang 15 poin → model masih layak.",
      note: {
        title: "🚨 Mitos: “AUC tinggi = model sehat”",
        type: "pitfall",
        body: "Yang benar: AUC hanya mengukur RANKING (apakah yang buruk diranking lebih buruk). Model bisa punya AUC 0,80 sementara semua angka probabilitasnya meleset 2× lipat — dan setiap keputusan yang memakai angka (bunga, provisi, limit) ikut meleset. Kesehatan model = ranking (AUC/KS) DAN kalibrasi (cermin) DAN stabilitas (PSI). Satu metrik = satu sudut pandang.",
      },
      hints: [
        "💡 Intuisi bucket: jangan uji kalibrasi per individu (satu prediksi 10% tidak bisa “benar/salah” sendirian — ia hanya peluang). Kumpulkan 40 orang berprediksi 10%, hitung berapa yang benar-benar gagal bayar: 4 dari 40 = 10% → terkalibrasi. Peluang hanya bisa diuji secara berkelompok.",
      ],
      reference: "Kalibrasi = prediksi vs realisasi per bucket. Ambang aksi: error maks >15 poin → rekalibrasi.",
    },
    {
      id: "konsep-psi",
      eyebrow: "Langkah 4 · Konsep",
      title: "PSI — Si Termometer Distribusi",
      prose: [
        "Definisi: Population Stability Index (PSI) mengukur seberapa jauh distribusi skor SAAT INI bergeser dari distribusi SAAT MODEL DIBUAT (baseline). Rumusnya menjumlahkan per bucket: (selisih proporsi) × ln(rasio proporsi). Ambang industri: PSI < 0,1 = stabil (tidak ada pergeseran berarti); 0,1–0,25 = waspada (selidiki); > 0,25 = pergeseran signifikan (tindak lanjuti).",
        "Kepribadiannya: PSI adalah termometer ruangan — ia tidak bilang kamu sakit apa, hanya bilang suhunya berubah. Demam (PSI 0,3) bisa karena jendela terbuka (perubahan bauran nasabah yang sah) atau karena infeksi (perubahan perilaku yang merusak model) — termometer tidak membedakan, tetapi ia yang membuatmu MEMERIKSA. Scorecard cerita: termometernya mungkin sudah menunjukkan 0,15 setahun sebelum NPL naik — tetapi tidak ada yang memasangnya.",
        "Kapan memakai: hitung PSI tiap periode monitoring (bulanan/kuartalan) untuk (1) distribusi skor, (2) tiap fitur penting. Tiga aturan termometer: (1) PSI butuh BASELINE yang tetap — jangan geser baseline tiap bulan (“menggeser tiang gawang”); (2) bucket dengan 0 observasi → tambahkan epsilon kecil (0,0001) agar ln tidak meledak; (3) PSI tinggi + kalibrasi baik = populasi berubah tetapi model masih valid (pantau); PSI tinggi + kalibrasi buruk = rebuild.",
      ],
      tasks: [],
      formula: String.raw`PSI = \sum_b (A_b - E_b) \times \ln\left(\frac{A_b}{E_b}\right)`,
      formulaNote: "A_b = proporsi aktual (periode kini) di bucket b; E_b = proporsi ekspektasi (baseline saat model dibuat); ln = logaritma natural. Sifat penting: bila A_b = E_b, sukunya NOL (ln(1)=0) — bucket yang tak berubah tidak menyumbang. Contoh lab: 5 bucket → PSI = 0,0609 < 0,1 → stabil, tidak ada pergeseran berarti.",
      note: {
        title: "🚨 Mitos: “PSI tinggi = model rusak, buang saja”",
        type: "pitfall",
        body: "Yang benar: PSI hanya mengukur PERGESERAN POPULASI, bukan kualitas model. Pergeseran bisa sah (ekspansi ke segmen baru yang direncanakan) — model mungkin tetap kalibrasi dengan baik di populasi baru. Alur yang benar: PSI tinggi → cek kalibrasi → kalibrasi baik = catat & pantau; kalibrasi buruk = rekalibrasi/rebuild. Membuang model sehat karena PSI adalah pemborosan.",
      },
      hints: [
        "💡 Intuisi rumus: tiap bucket menyumbang (selisih) × ln(rasio). Bucket yang porsinya tetap → sumbangan nol. Bucket yang porsinya berubah BANYAK → sumbangan besar (ln memperbesar rasio ekstrem). PSI = total “kegelisahan” distribusi dalam satu angka.",
      ],
      reference: "PSI < 0,1 stabil; 0,1–0,25 waspada; > 0,25 tindak lanjut. Baseline jangan digeser-geser.",
    },
    {
      id: "konsep-monitoring",
      eyebrow: "Langkah 5 · Konsep",
      title: "Sistem Monitoring — Rekalibrasi vs Rebuild",
      prose: [
        "Definisi: sistem monitoring model adalah JADWAL + AMBANG + KEPUTUSAN yang berjalan otomatis: tiap bulan hitung (a) metrik ranking (AUC/KS), (b) backtest kalibrasi, (c) PSI skor + fitur top; bila ambang terlampaui, keputusan mengikuti pohon: kalibrasi buruk + ranking baik → REKALIBRASI (Platt scaling / isotonic: petakan ulang skor→probabilitas tanpa mengubah ranking); ranking buruk → REBUILD (fitur/model baru); PSI tinggi saja → SELIDIKI (mungkin populasi sah berubah).",
        "Kepribadiannya: monitoring adalah satpam gedung yang patroli tiap jam dengan checklist — bukan yang menunggu telepon “ada maling”. Rekalibrasi adalah menyetel ulang jam yang melambat 10 menit (angka diperbaiki, mesin tetap); rebuild adalah mengganti jamnya (mesin baru). Satpam yang baik tidak mengganti jam setiap kali melambat 1 menit — ia punya ambang: >15 poin baru disetel ulang.",
        "Kapan memakai: untuk SETIAP model produksi yang memengaruhi uang/risiko (skor kredit, fraud, churn). Tiga aturan satpam: (1) monitoring berjalan OTOMATIS terjadwal — “nanti kalau sempat” = tidak pernah; (2) ambang ditulis SEBELUM model live (agar tidak digeser saat hasil buruk); (3) setiap keputusan (rekalibrasi/rebuild/tetap) DICATAT dengan alasannya — audit model menanyakan ini.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: “Model yang sudah live tidak boleh diutak-atik”",
        type: "pitfall",
        body: "Yang benar: yang tidak boleh adalah MENGUBAH TANPA CATATAN DAN VALIDASI. Rekalibrasi terjadwal dengan ambang tertulis + backtest ulang justru TANDA model dikelola profesional — regulator (dan auditor) mengharapkan ini. Model yang “tidak pernah disentuh 3 tahun” bukan tanda stabil, melainkan tanda tidak dimonitor.",
      },
      hints: [
        "💡 Intuisi Platt scaling: bila ranking masih benar tetapi angka meleset 2×, kamu tidak perlu melatih ulang — cukup petakan ulang: skor 0,10 → 0,22 (sesuai realisasi). Seperti menyetel ulang jam: jarumnya (ranking) benar, angkanya (kalibrasi) digeser. Murah, cepat, terdokumentasi.",
      ],
      reference: "Kalibrasi buruk + ranking baik = rekalibrasi. Ranking buruk = rebuild. Ambang ditulis sebelum live.",
    },
    {
      id: "lab-kalibrasi",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab 1 — Backtest kalibrasi 100 debitur",
      prose: [
        "Waktunya praktik. Data 100 debitur dalam 5 bucket sudah tersedia: jumlah debitur n = [40, 30, 15, 10, 5] dan yang gagal bayar d = [2, 6, 6, 6, 4]. Prediksi tengah bucket p = [0,10, 0,30, 0,50, 0,70, 0,90]. Tugasmu: (1) hitung realisasi per bucket (d/n) ke realized; (2) hitung error maksimum |realisasi − prediksi| ke err_max (bulatkan 2 desimal); (3) vonis layak = True bila err_max ≤ 0,15. Inilah “cermin jujur” yang tidak dipasang tim cerita pembuka.",
        "Di produksi, angka-angka ini datang dari tabel monitoring bulanan — bukan ditulis manual. Logikanya identik.",
        "Coba: setelah lolos, ubah d menjadi [9, 9, 8, 7, 4] (krisis) — berapa err_max sekarang? Vonisnya berubah? Itulah beda model “layak” dan “basi”.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `realized` (list d/n per bucket, 5 angka)" },
        { id: "t2", text: "Hitung `err_max` (|realisasi − prediksi| maksimum, round 2)" },
        { id: "t3", text: "Vonis `layak` (True bila err_max ≤ 0,15)" },
      ],
      expected: "realisasi: [0.05, 0.2, 0.4, 0.6, 0.8] | err_max: 0.1 | layak: True",
      code: {
        starter: "# Data JANGAN UBAH.\nn = [40, 30, 15, 10, 5]\nd = [2, 6, 6, 6, 4]\np = [0.10, 0.30, 0.50, 0.70, 0.90]\n\n# TULIS KODEMU: t1 realisasi per bucket\nrealized =\n\n# t2: error kalibrasi maksimum (round 2)\nerr_max =\n\n# t3: vonis layak (ambang 0,15)\nlayak =\n\nprint(f\"realisasi: {realized} | err_max: {err_max} | layak: {layak}\")\n",
        lockLines: 4,
        solution: "# Data JANGAN UBAH.\nn = [40, 30, 15, 10, 5]\nd = [2, 6, 6, 6, 4]\np = [0.10, 0.30, 0.50, 0.70, 0.90]\n\n# TULIS KODEMU: t1 realisasi per bucket\nrealized = [di / ni for di, ni in zip(d, n)]\n\n# t2: error kalibrasi maksimum (round 2)\nerr_max = round(max(abs(r - pi) for r, pi in zip(realized, p)), 2)\n\n# t3: vonis layak (ambang 0,15)\nlayak = err_max <= 0.15\n\nprint(f\"realisasi: {realized} | err_max: {err_max} | layak: {layak}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "realized benar", msg: "[0.05, 0.2, 0.4, 0.6, 0.8] — cermin menunjukkan 5%/20%/40%/60%/80%.", name: "realized", value: [0.05, 0.2, 0.4, 0.6, 0.8], tol: 1e-9 },
          { kind: "equal", task: "t2", label: "err_max = 0,10", msg: "Selisih terbesar 10 poin — di bawah ambang 15.", name: "err_max", value: 0.1, tol: 0.01 },
          { kind: "equal", task: "t3", label: "layak = True", msg: "10 ≤ 15 poin: model masih layak, lanjut pantau.", name: "layak", value: true },
          { kind: "stdout_matches", task: "t3", label: "laporan tercetak", msg: "Realisasi, error, vonis.", pattern: "layak: True" },
        ],
      },
      reference: "Cermin: |realisasi − prediksi| maks = 0,10 ≤ 0,15 → layak. Bucket ≥30 isi agar cermin tidak retak.",
    },
    {
      id: "lab-psi",
      eyebrow: "Langkah 7 · Lab",
      title: "Lab 2 — Hitung PSI: termometer distribusi",
      prose: [
        "Lab kedua memasang termometer. Baseline (saat model dibuat): base = [0,40, 0,30, 0,15, 0,10, 0,05]; distribusi kini: cur = [0,30, 0,30, 0,20, 0,12, 0,08]. Tugasmu: (1) hitung PSI = Σ (cur − base) × ln(cur/base) ke psi (round 4); (2) vonis drift = \"stabil\" bila psi < 0,1, \"waspada\" bila < 0,25, \"tindak lanjut\" bila ≥ 0,25. Gunakan math.log (ln).",
        "Di produksi, base = snapshot distribusi saat model di-deploy (JANGAN digeser tiap bulan); cur = bulan berjalan.",
        "Coba: setelah lolos, ubah cur menjadi [0,10, 0,20, 0,20, 0,25, 0,25] (pergeseran besar) — berapa PSI? Vonisnya? Itulah termometer yang berbunyi.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `psi` (round 4) dari base & cur" },
        { id: "t2", text: "Vonis `drift`: stabil / waspada / tindak lanjut" },
      ],
      expected: "PSI: 0.0609 | vonis: stabil",
      code: {
        starter: "# Data JANGAN UBAH.\nimport math\nbase = [0.40, 0.30, 0.15, 0.10, 0.05]\ncur = [0.30, 0.30, 0.20, 0.12, 0.08]\n\n# TULIS KODEMU: t1 PSI = sum((cur-base) * ln(cur/base)), round 4\npsi =\n\n# t2: vonis drift dari ambang 0,1 / 0,25\ndrift =\n\nprint(f\"PSI: {psi} | vonis: {drift}\")\n",
        lockLines: 4,
        solution: "# Data JANGAN UBAH.\nimport math\nbase = [0.40, 0.30, 0.15, 0.10, 0.05]\ncur = [0.30, 0.30, 0.20, 0.12, 0.08]\n\n# TULIS KODEMU: t1 PSI = sum((cur-base) * ln(cur/base)), round 4\npsi = round(sum((c - b) * math.log(c / b) for b, c in zip(base, cur)), 4)\n\n# t2: vonis drift dari ambang 0,1 / 0,25\ndrift = \"stabil\" if psi < 0.1 else (\"waspada\" if psi < 0.25 else \"tindak lanjut\")\n\nprint(f\"PSI: {psi} | vonis: {drift}\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "psi = 0,0609", msg: "Di bawah 0,1 — termometer tidak berbunyi.", name: "psi", value: 0.0609, tol: 0.001 },
          { kind: "equal", task: "t2", label: "drift = stabil", msg: "Pergeseran kecil = populasi relatif sama.", name: "drift", value: "stabil" },
          { kind: "stdout_matches", task: "t2", label: "laporan tercetak", msg: "Satu angka, satu vonis.", pattern: "vonis: stabil" },
        ],
      },
      reference: "PSI 0,0609 < 0,1 → stabil. Bucket tak berubah menyumbang nol (ln(1)=0).",
    },
    {
      id: "chart-kalibrasi",
      eyebrow: "Langkah 8 · Chart",
      title: "Cermin jujur dalam 5 pasang batang",
      prose: [
        "Chart di bawah memvisualkan hasil Lab 1: prediksi (tengah bucket, terang) vs realisasi gagal bayar (gelap) untuk 5 bucket.",
        "Cara membaca: sumbu X = bucket skor; tiap pasang batang = prediksi vs realisasi di bucket itu; sumbu Y = persen gagal bayar.",
        "Interpretasi: pasangan batangnya selalu berdekatan — selisih terbesar hanya 10 poin (bucket 0–20: 10% vs 5%). Inilah wajah model yang TERKALIBRASI: cermin dan fotografer sepakat. Bandingkan dengan cerita pembuka: di sana pasangan bucket “10%” akan menunjukkan 10 vs 22 — batang gelap 2× lipat batang terang. Chart seperti itu di dashboard bulanan akan menangkap penuaan model 18 bulan lebih awal.",
      ],
      figure: {
        svg: KALIB_SVG,
        alt: "Diagram batang ganda: prediksi vs realisasi per bucket, selisih maks 10 poin.",
        caption: "Prediksi vs realisasi selalu berdekatan (selisih ≤10 poin). Inilah wajah model terkalibrasi.",
      },
      tasks: [],
      reference: "Selisih ≤10 poin = cermin dan fotografer sepakat. 10 vs 22 = tangkap 18 bulan lebih awal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 9 · Peta keputusan",
      title: "Peta keputusan: respons per sinyal monitoring",
      prose: [
        "Skenario 1 — Kalibrasi buruk (err_max >15 poin), ranking baik (AUC stabil). → Rekalibrasi (Platt/isotonic). Alasan: jarum benar, angka meleset — setel ulang jam, jangan ganti jam.",
        "Skenario 2 — Ranking buruk (AUC turun >5 poin) + kalibrasi buruk. → Rebuild (fitur/model baru). Alasan: mesinnya yang rusak, bukan angkanya — penyetelan tidak menyembuhkan ranking.",
        "Skenario 3 — PSI 0,1–0,25, kalibrasi masih baik. → Selidiki + catat, model tetap jalan. Alasan: populasi bergeser tetapi model masih valid — mungkin ekspansi segmen yang sah.",
        "Skenario 4 — PSI >0,25 + kalibrasi buruk. → Bekukan deployment baru + rebuild prioritas. Alasan: populasi berubah DAN angka meleset — model tidak lagi mewakili dunia.",
        "Skenario 5 — Semua metrik hijau 12 bulan berturut-turut. → Tetap jalankan monitoring; review ambang tahunan. Alasan: “tidak ada sinyal” bukan “tidak butuh satpam” — satpam patroli justru saat sepi.",
        "Aturan praktis 10 detik: ranking baik + angka meleset = rekalibrasi. Ranking rusak = rebuild. PSI saja = selidiki. Semua hijau = patroli terus.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membangun ulang model setiap kali PSI menyentuh 0,12 — lalu heran kenapa tim kelelahan dan tidak ada yang percaya dashboard. Ambang ada agar keputusan PROPORSIONAL: waspada = selidiki (bisa 2 jam kerja), bukan rebuild (2 bulan kerja). Satpam yang menelepon SWAT tiap ada bayangan akan segera diabaikan.",
      },
      reference: "Respons proporsional: rekalibrasi / rebuild / selidiki / patroli — sesuai sinyal, bukan panik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 10 · Mini-case",
      title: "Dashboard monitoring scorecard: rancangan 1 halaman",
      prose: [
        "Skenario (sintetis, angka konkret): kamu diminta merancang dashboard monitoring bulanan untuk scorecard kredit (100 ribu debitur aktif). Komite risiko memberi 1 halaman. Rancanganmu: (1) AUC + KS (ranking); (2) backtest kalibrasi 5 bucket + err_max (cermin); (3) PSI skor + 3 fitur top (termometer); (4) NPL per bucket vs ekspektasi (dampak bisnis). Ambang: err_max >15 poin → rekalibrasi; AUC turun >5 poin → rebuild; PSI >0,25 → investigasi.",
        "Pertanyaan analisis: (1) Kenapa NPL agregat SAJA tidak cukup? (2) Bulan ini: AUC stabil, err_max = 0,19, PSI = 0,08 — keputusanmu? (3) Bulan depan: AUC turun 7 poin, err_max = 0,22, PSI = 0,31 — keputusanmu?",
        "Pembahasan: (1) NPL agregat bisa “baik” sementara bucket-bucketnya salah arah (Simpson's paradox versi monitoring) — dan ia lagging (baru terlihat setelah kerugian terjadi); kalibrasi + PSI adalah leading indicator. (2) Rekalibrasi: ranking baik + angka meleset >15 poin + populasi stabil = setel ulang jam. (3) Rebuild prioritas + bekukan: ranking rusak + angka meleset + populasi bergeser = mesin tidak mewakili dunia.",
        "Kaitan ke karier: “merancang sistem monitoring model” adalah jawaban interview model-risk yang membedakan kandidat yang pernah deploy dari yang hanya pernah training — karena ia membuktikan kamu berpikir tentang model SETELAH ulang tahun pertamanya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model yang menua tanpa monitoring adalah risiko model (model risk) yang nyata — dan regulator menanyakannya: SR 11-7 (AS) dan pedoman OJK tentang manajemen risiko model mensyaratkan validasi dan pemantauan berkelanjutan. Dashboard 1 halaman ini bukan “nice to have”; ia adalah bukti tata kelola.",
      },
      reference: "1 halaman: AUC/KS + kalibrasi + PSI + NPL per bucket. Ambang tertulis sebelum live.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Backtest kalibrasi: prediksi vs realisasi per bucket; err_max >15 poin → rekalibrasi wajib.",
        "PSI = Σ(A−E)·ln(A/E); <0,1 stabil, 0,1–0,25 waspada, >0,25 tindak lanjut; baseline jangan digeser.",
        "AUC = ranking; kalibrasi = angka; keduanya + PSI = kesehatan model yang utuh.",
        "Rekalibrasi (angka meleset, ranking baik) vs rebuild (ranking rusak) vs selidiki (PSI saja).",
        "Monitoring otomatis terjadwal + ambang tertulis sebelum live + keputusan tercatat.",
      ],
      next: { label: "A1.10 Capstone Track 10: Pipeline Kredit dari SQL ke Python", href: "/v2/learn/a110-capstone-track-10" },
      quiz: [
        {
          q: "Bucket “risiko 10%” ternyata gagal bayar 22%, tetapi AUC tetap 0,78. Kesimpulan tepat?",
          options: [
            { text: "Kalibrasi basi (err 12 poin mendekati ambang) — ranking baik tidak menjamin angka benar", why: "Benar: inti cerita — cermin vs fotografer; keputusan berbasis angka ikut meleset.", correct: true },
            { text: "Model sehat — AUC 0,78 membuktikan semuanya baik", why: "Salah: mitos Langkah 3 — AUC hanya ranking; angka 2× lipat meleset tetap mungkin." },
            { text: "Model rusak total — harus rebuild segera", why: "Salah: ranking baik = mesin benar; yang perlu hanya rekalibrasi (setel ulang, bukan ganti). Respons harus proporsional." },
            { text: "Data salah input — 22% pasti kesalahan ETL", why: "Salah: menuduh data tanpa bukti; backtest kalibrasi justru alat untuk membedakan “data salah” vs “model menua”." },
          ],
        },
        {
          q: "PSI = 0,06 untuk distribusi skor bulan ini. Artinya?",
          options: [
            { text: "Stabil — di bawah 0,1, tidak ada pergeseran berarti; lanjutkan patroli", why: "Benar: angka lab — termometer tidak berbunyi.", correct: true },
            { text: "Waspada — sudah di atas nol sehingga harus diselidiki", why: "Salah: ambang “waspada” mulai 0,1; 0,06 = noise normal distribusi." },
            { text: "Model rusak — distribusi berubah pasti merusak model", why: "Salah: mitos Langkah 4 — PSI mengukur populasi, bukan kualitas model." },
            { text: "Tidak dapat disimpulkan tanpa AUC", why: "Salah: PSI berdiri sendiri sebagai ukuran stabilitas distribusi; AUC menjawab pertanyaan berbeda (ranking)." },
          ],
        },
        {
          q: "Dalam rumus PSI, bucket yang proporsinya TETAP (A = E) menyumbang?",
          options: [
            { text: "Nol — karena ln(1) = 0", why: "Benar: sifat kunci rumus; hanya perubahan yang “bersuara”.", correct: true },
            { text: "Proporsinya sendiri — tetap dihitung penuh", why: "Salah: (A−E) = 0 membuat seluruh suku nol — itulah elegansinya." },
            { text: "Nilai negatif kecil", why: "Salah: tidak ada suku negatif misterius; nol adalah nol." },
            { text: "Tak terdefinisi — pembagian nol", why: "Salah: tidak ada pembagian nol bila A = E > 0; yang butuh epsilon hanya bucket KOSONG." },
          ],
        },
        {
          q: "AUC turun 7 poin, err_max = 0,22, PSI = 0,31. Keputusan?",
          options: [
            { text: "Rebuild prioritas + bekukan deployment baru — ranking rusak, angka meleset, populasi bergeser", why: "Benar: skenario 4 peta + pembahasan mini-case — tiga sinyal merah bersamaan.", correct: true },
            { text: "Rekalibrasi cukup — Platt scaling memperbaiki semuanya", why: "Salah: rekalibrasi tidak menyembuhkan ranking yang rusak; AUC turun 7 poin = mesinnya bermasalah." },
            { text: "Tunggu bulan depan — mungkin noise", why: "Salah: tiga sinyal independen bersamaan bukan noise; menunda = membiarkan kerugian berjalan." },
            { text: "Naikkan ambang persetujuan agar NPL turun", why: "Salah: mengubah kebijakan bisnis untuk menutupi model rusak = mengobati gejala dengan mengorbankan pertumbuhan." },
          ],
        },
        {
          q: "Kenapa baseline PSI tidak boleh digeser tiap bulan?",
          options: [
            { text: "Menggeser baseline = menggeser tiang gawang — pergeseran tersembunyi, termometer selalu “normal”", why: "Benar: aturan Langkah 4 — baseline tetap adalah seluruh gunanya perbandingan.", correct: true },
            { text: "Karena komputasinya menjadi 2× lipat", why: "Salah: biaya komputasi bukan alasannya; integritas pengukuranlah." },
            { text: "Karena regulator melarang keras", why: "Salah: bukan soal larangan — soal logika: pembanding yang bergerak tidak bisa mendeteksi gerakan." },
            { text: "Boleh saja, asal dicatat", why: "Salah: pencatatan tidak memperbaiki logika yang rusak — pergeseran tetap tersembunyi." },
          ],
        },
        {
          q: "Kenapa NPL agregat SAJA tidak cukup sebagai monitoring?",
          options: [
            { text: "Ia lagging dan bisa menutupi bucket yang salah arah — kalibrasi + PSI adalah leading indicator", why: "Benar: pembahasan mini-case — kerugian terlihat setelah terjadi; cermin + termometer melihat lebih awal.", correct: true },
            { text: "NPL tidak ada hubungannya dengan model", why: "Salah: NPL adalah dampak bisnis model — hanya saja ia indikator yang lambat dan kasar." },
            { text: "NPL hanya untuk regulator, bukan internal", why: "Salah: NPL dipakai internal juga; masalahnya BUKAN audiensnya, melainkan kelambatannya." },
            { text: "NPL tidak bisa dihitung bulanan", why: "Salah: bisa dan memang dihitung — tetapi sebagai satu-satunya metrik ia buta terhadap kalibrasi dan drift." },
          ],
        },
      ],
    },
  ],
};
