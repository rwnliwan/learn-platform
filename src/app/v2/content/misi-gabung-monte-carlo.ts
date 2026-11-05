import type { V2Mission } from "../lib/types";

// ── MISI GABUNG MONTE CARLO (CAPSTONE C): Seribu Masa Depan ─────────────
// Dataset: 100% SINTETIS (seed 42) — params.csv (19 baris kunci-nilai:
// ekspektasi return, volatilitas, matriks korelasi 3 aset + fee drag 1%/tahun
// + bobot 3 alokasi). BUKAN data pasar nyata; dinyatakan SINTETIS di semua
// permukaan. File: public/misi/misi-gabung-monte-carlo/params.csv + METODE.md.
// Simulasi kanonis: GBM tahunan, T=10, N=10.000, seed 42 (numpy default_rng),
// korelasi via Cholesky, buy-and-hold, fee = faktor bruto − 0,01/tahun.

const BASE = "/misi/misi-gabung-monte-carlo";

export const misiGabungMonteCarlo: V2Mission = {
  slug: "misi-gabung-monte-carlo",
  track: "Probabilitas",
  module: "Misi",
  title: "Misi Seribu Masa Depan: Distribusi, Bukan Titik",
  estMinutes: 170,
  role: "Analis kuantitatif — penasihat alokasi portofolio ritel",
  client:
    "Klien ritel (Bu Ratna, 45 tahun, horizon 10 tahun, target dana 1,8× modal) ditawari 3 pilihan alokasi oleh wealth management — ia butuh rekomendasi berbasis DISTRIBUSI hasil, bukan satu angka janji",
  xp: 750,
  steps: [
    {
      id: "briefing",
      eyebrow: "Langkah 1 · Briefing misi",
      title: "Klienmu tidak butuh ramalan — ia butuh peta kemungkinan",
      prose: [],
      tasks: [],
      briefing: {
        role: "Analis kuantitatif independen yang disewa klien ritel untuk memeriksa tawaran wealth management",
        client:
          "Bu Ratna, 45 tahun. Ia punya modal yang harus tumbuh menjadi 1,8× lipat dalam 10 tahun untuk dana pensiunnya — sekitar 6% per tahun. Sebuah perusahaan wealth management menawarinya 3 pilihan alokasi (Konservatif, Seimbang, Agresif) lengkap dengan pitch deck yang mengklaim “hasil pasti 2,4× dalam 10 tahun”. Bu Ratna curiga pada kata “pasti” — dan menyewamu untuk menjawab satu pertanyaan: dari 10.000 masa depan yang mungkin, berapa banyak yang berakhir di bawah targetnya?",
        story: [
          "Kamis, 09:00. Di meja kerjamu: satu pitch deck mengilap dari wealth management — grafik mulus menanjak, angka “2,4×” dicetak tebal, dan satu kalimat yang membuat alismu terangkat: “Hasil pasti 2,4× dalam 10 tahun.” Di sampingnya, secarik catatan tangan Bu Ratna: “Saya tidak butuh janji. Saya butuh tahu: kalau saya pilih yang Agresif, seberapa besar peluang saya GAGAL mencapai 1,8×? Tolong jawab dengan jujur.”",
          "Kamu tahu persis masalahnya. Pasar tidak menghasilkan satu titik — ia menghasilkan distribusi. Setiap “ekspektasi return 10%” menyembunyikan ribuan jalur yang mungkin: sebagian berakhir 4× lipat, sebagian berakhir di bawah modal awal. Pitch deck itu hanya menunjukkan satu titik (yang paling manis), lalu menyebutnya “pasti”.",
          "Senjatamu: simulasi Monte Carlo. Kamu akan membangkitkan 10.000 masa depan untuk masing-masing dari 3 alokasi — dengan parameter yang TERBUKA (return, volatilitas, korelasi, fee) — lalu membaca distribusinya seperti peta: berapa probabilitas shortfall, seberapa dalam ekor terburuknya (VaR 5% dan expected shortfall), dan berapa banyak return yang dimakan fee 1% per tahun. Terakhir, kamu akan mengaudit pitch deck itu baris per baris.",
        ],
        objectives: [
          "Menjalankan simulasi Monte Carlo 10.000 jalur × 10 tahun (seed 42, deterministik) untuk 3 alokasi dari parameter sintetis params.csv.",
          "Menghitung per alokasi: probabilitas shortfall vs target 1,8×, VaR 5%, expected shortfall 5%, dan dampak fee 1% per tahun.",
          "Memilih satu alokasi untuk Bu Ratna dengan alasan distribusi (bukan titik), lalu menemukan 4 sabotase di pitch deck wealth management.",
          "Menulis rekomendasi klien satu halaman + pengungkapan risiko yang jujur.",
        ],
        prereqSummary:
          "Simulasi Monte Carlo = cara menjawab “bagaimana kalau” ribuan kali: bangkitkan return acak yang konsisten dengan asumsi (return rata-rata, volatilitas, korelasi antar-aset), majukan waktu 10 tahun, ulangi 10.000 kali — lalu hitung statistik dari 10.000 hasil akhirnya. Yang penting di sini bukan rumusnya, melainkan cara bacanya: probabilitas shortfall = “dari 10.000 masa depan, berapa yang gagal capai target”; VaR 5% = “ambang 5% hasil terburuk”; expected shortfall = “rata-rata nasibmu kalau kamu sial masuk 5% itu”. Seed 42 membuat semua acak ini 100% dapat diulang — angka yang sama untukmu, untukku, untuk auditor.",
        datasetNote:
          "Sumber: 100% SINTETIS — dibuat khusus untuk misi ini (seed 42), BUKAN data pasar nyata.\nFile: params.csv (19 baris: ekspektasi return & volatilitas 3 aset — obligasi, saham, emas; matriks korelasi; fee 1%/tahun; bobot 3 alokasi: Konservatif 60/20/20, Seimbang 35/50/15, Agresif 10/85/5).\nMetode: GBM tahunan, T=10 tahun, N=10.000 jalur, korelasi via Cholesky, buy-and-hold, fee drag = faktor bruto tahunan − 0,01. Lihat METODE.md di folder yang sama.\nKejujuran: parameter ini fiktif dan dipilih agar pola pedagogisnya jelas — JANGAN dipakai untuk keputusan investasi nyata.",
      },
    },
    {
      id: "dataroom",
      eyebrow: "Langkah 2 · Data room",
      title: "Satu file parameter, tiga masa depan",
      prose: [
        "Satu file menunggumu: `params.csv`. Isinya hanya 19 baris kunci-nilai — tiga angka ekspektasi return (mu), tiga angka volatilitas (sigma), tiga angka korelasi, satu angka fee, dan sembilan angka bobot alokasi. Dari 19 angka inilah 30.000 masa depan akan dibangkitkan (10.000 jalur × 3 alokasi).",
        "Perhatikan tiga hal sebelum lanjut: (1) saham punya ekspektasi return tertinggi (10%) TAPI volatilitas tertinggi (20%) — return dan risiko adalah satu paket; (2) korelasi saham–emas NEGATIF (−0,10) — inilah “bantal” diversifikasi yang sering dilupakan; (3) fee 1% per tahun terlihat kecil — sampai kamu mengalikannya 10 tahun dan melihatnya memakan hampir seperlima median hasil.",
        "Aturan main: (1) semua angka di misi ini SINTETIS — dilarang mengutipnya sebagai fakta pasar; (2) seed 42 DIKUNCI di starter lab — acak yang tidak dapat diulang bukan sains, melainkan sulap; (3) keputusan akhir memakai DISTRIBUSI (probabilitas, ekor), bukan satu angka “ekspektasi”.",
      ],
      tasks: [
        { id: "t1", text: "Buka `params.csv`: catat mu dan sigma ketiga aset" },
        { id: "t2", text: "Catat 3 angka korelasi dan bobot ketiga alokasi" },
      ],
      note: {
        title: "Miskonsepsi #1: return tinggi = pilihan terbaik",
        type: "pitfall",
        body: "“Saham ekspektasi 10%, tertinggi — jadi Agresif (85% saham) pasti terbaik.” SALAH — dan ini jebakan paling mahal di industri ritel. Ekspektasi 10% adalah RATA-RATA dari distribusi yang lebar: dengan vol 20%, sebagian jalur berakhir jauh di bawah target 1,8×. Pertanyaan yang benar bukan “berapa rata-ratanya” melainkan “berapa PELUANG gagalnya, dan seberapa DALAM kalau gagal”. Itulah kenapa misi ini menghitung shortfall dan ekor — bukan cuma mean.",
      },
      reference:
        "params.csv (19 baris, 100% SINTETIS, seed 42). Tiga alokasi: Konservatif (obligasi 60 / saham 20 / emas 20), Seimbang (35 / 50 / 15), Agresif (10 / 85 / 5). Target Bu Ratna: kekayaan akhir ≥ 1,8× modal.",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 3 · Konsep kunci",
      title: "Dari satu titik ke seribu masa depan",
      prose: [
        "Mesin di balik misi ini adalah Geometric Brownian Motion (GBM): model standar bagaimana harga aset bergerak — tumbuh dengan drift mu, bergoyang dengan volatilitas sigma, dan goyangannya BERKORELASI antar-aset (saham jatuh sering menarik obligasi/emas dengan pola tertentu). Satu jalur GBM = satu “masa depan”. Sepuluh ribu jalur = peta kemungkinan.",
        "Lihat grafik di bawah: TIGA distribusi hasil akhir (10.000 jalur, 10 tahun, setelah fee) untuk tiga alokasi. Cara membacanya — sumbu-x = kekayaan akhir (× modal awal), sumbu-y = jumlah jalur. Perhatikan BENTUKNYA, bukan cuma puncaknya: Konservatif ramping dan terkonsentrasi (pasti-pasti saja), Agresif melebar ke kanan (peluang kaya) TAPI ekor kirinya menjulur jauh ke bawah 1,0 (peluang miskin). Garis putus-putus di 1,8 = target Bu Ratna.",
        "Interpretasi: Agresif punya median TERTINGGI (1,99×) — tapi juga probabilitas shortfall 42,91% dan ekor terburuk rata-rata 0,67× (expected shortfall). Seimbang: median 1,87×, shortfall 45,21%, ekor 0,95×. Konservatif: median 1,69× (DI BAWAH target!), shortfall 62,03%, tapi ekornya paling dangkal — rata-rata 5% jalur terburuknya masih 1,11×, vs Agresif yang jatuh ke 0,67×. Tidak ada alokasi yang “menang di semua metrik” — dan justru itu inti pelajarannya: memilih alokasi = memilih BENTUK RISIKO mana yang bisa diterima klien, bukan memilih angka terbesar.",
      ],
      tasks: [
        { id: "t1", text: "Bandingkan lebar distribusi ketiga alokasi pada grafik" },
        { id: "t2", text: "Jawab kuis: metrik mana yang menjawab “seberapa dalam kalau gagal”?" },
      ],
      formula: String.raw`S_t = S_0 \exp\left(\left(\mu - \tfrac{1}{2}\sigma^2\right)t + \sigma W_t\right)`,
      formulaNote:
        "S_t = harga aset di tahun t; S_0 = harga awal; mu = ekspektasi return tahunan (mis. saham 0,10); sigma = volatilitas tahunan (mis. saham 0,20); W_t = gerak Brown — guncangan acak yang dikorelasikan antar-aset via matriks korelasi; suku −1/2·sigma² = koreksi Ito (volatilitas menggerus pertumbuhan majemuk — makin goyang, makin lambat tumbuhnya). Probabilitas shortfall = P(W_akhir < 1,8): fraksi dari 10.000 jalur yang gagal mencapai target.",
      note: {
        title: "Miskonsepsi #2: “hasil pasti 2,4×”",
        type: "pitfall",
        body: "Pitch deck mengklaim “hasil pasti 2,4×”. Tidak ada yang “pasti” dalam distribusi — bahkan alokasi Konservatif punya jalur yang berakhir di bawah 1,2×. Klaim titik atas distribusi adalah teknik penjualan tertua di industri: tunjukkan median (atau skenario baik), sebut “pasti”, sembunyikan ekornya. Setelah misi ini, setiap kali kamu melihat satu angka return tanpa distribusi, tanyakan: “di mana ekornya?”",
      },
      quiz: [
        {
          q: "Bu Ratna bertanya: “Kalau saya sial dan masuk 5% hasil terburuk, rata-rata saya dapat berapa?” Metrik apa yang menjawabnya?",
          options: [
            { text: "Probabilitas shortfall", why: "Itu menjawab “seberapa SERING gagal capai target” — bukan “seberapa DALAM kalau gagal”. Frekuensi vs kedalaman adalah dua pertanyaan berbeda." },
            { text: "Expected shortfall (5%)", why: "Tepat. Expected shortfall = rata-rata hasil pada 5% jalur terburuk — persis “rata-rata nasibmu kalau sial”. VaR 5% hanya memberi AMBANGnya (1,08× untuk Seimbang), ES memberi RATA-RATA di bawah ambang itu (0,95×).", correct: true },
            { text: "Median hasil akhir", why: "Median = “hasil tengah” (50% di atas, 50% di bawah) — tidak bilang apa-apa tentang nasib 5% terbawah. Jangan jawab pertanyaan ekor dengan angka tengah." },
          ],
        },
        {
          q: "Fee 1% per tahun “kecil”. Mengapa misi ini tetap menghitung dampaknya?",
          options: [
            { text: "Karena 1% × 10 tahun ≈ 10% — linear dan sepele", why: "Bukan linear: fee memakan basis majemuk setiap tahun. Hasil simulasi: fee 1%/tahun memangkas median Seimbang sebesar 0,18× modal (dari 2,06× menjadi 1,87×) — hampir seperlima modal awal hilang diam-diam." },
            { text: "Karena fee bersifat majemuk: ia memakan basis pertumbuhan tiap tahun", why: "Tepat. Fee 1% bukan “cuma 1%” — ia dipotong dari faktor pertumbuhan SETIAP tahun selama 10 tahun, sehingga efeknya berlipat. Di simulasi: median Seimbang turun 0,18× modal awal. Biaya kecil yang berulang > biaya besar sekali.", correct: true },
            { text: "Karena regulator mewajibkan pengungkapan fee", why: "Pengungkapan memang wajib, tapi alasan KUANTITATIFNYA adalah efek majemuk: 0,18× modal awal hilang dari median Seimbang. Itu alasan matematikanya, bukan administratifnya." },
          ],
        },
      ],
      echart: {
        option: {
          title: { text: "Distribusi kekayaan akhir — 10.000 jalur × 10 tahun (setelah fee)", left: "center", textStyle: { fontSize: 13 } },
          tooltip: { trigger: "axis" },
          legend: { data: ["Konservatif", "Seimbang", "Agresif"], bottom: 0 },
          xAxis: { type: "category", name: "kekayaan akhir (× modal)", data: ["<0.4","0.5","0.7","0.9","1.1","1.3","1.5","1.7","1.9","2.1","2.3","2.5","2.7","2.9","3.1","3.3","3.5","3.7","3.9","4.1","4.3","4.5","4.7","4.9","≥5.0"] },
          yAxis: { type: "value", name: "jumlah jalur" },
          series: [
            { name: "Konservatif", type: "bar", data: [0,0,1,44,454,1345,2152,2207,1698,1020,562,284,146,50,26,6,2,1,1,1,0,0,0,0,0] },
            { name: "Seimbang", type: "bar", data: [0,3,49,233,637,1052,1277,1270,1290,1039,847,651,443,318,239,190,149,94,57,54,28,28,12,12,28] },
            { name: "Agresif", type: "bar", data: [13,119,321,524,752,838,891,833,733,672,650,521,477,424,330,306,222,196,167,124,116,94,87,73,517] },
          ],
        },
        caption: "Histogram nyata dari simulasi kanonis (seed 42): 10.000 jalur per alokasi, horizon 10 tahun, setelah fee 1%/tahun. Bin terakhir “≥5.0” menampung ekor kanan; bin “<0.4” menampung ekor kiri.",
      },
    },
  ],
};

// ── lanjutan misiGabungMonteCarlo: langkah 4–14 ──────────────────────────
import type { V2Step } from "../lib/types";

const LANJUTAN_MC: V2Step[] = [
  {
    id: "lab-mc",
    eyebrow: "Langkah 4 · Lab 1 — Simulasi seribu masa depan",
    title: "Bangkitkan 10.000 masa depan untuk tiap alokasi",
    prose: [
      "Sekarang buktikan dengan tanganmu sendiri. Dari `params.csv`: bangun matriks korelasi 3×3 dan dekomposisi Cholesky-nya (cara mengubah guncangan acak independen menjadi guncangan yang berkorelasi), bangkitkan 10.000 jalur × 10 tahun dengan seed 42, lalu hitung untuk alokasi Seimbang: probabilitas shortfall vs target 1,8×, VaR 5%, expected shortfall 5%, dan fee drag.",
      "Rumus GBM tahunan per aset: r = (mu − sigma²/2) + sigma × z, dengan z = guncangan berkorelasi. Kekayaan akhir satu jalur = modal × produk dari faktor pertumbuhan tahunan portofolio (buy-and-hold: jumlah tertimbang dari exp(r) tiap aset), dikurangi fee 1% per tahun dari faktor brutonya.",
    ],
    tasks: [
      { id: "t1", text: "Muat `params.csv` → dict `P`; susun vektor `mu`, `sigma`, matriks korelasi `C`, dan `L` (Cholesky)" },
      { id: "t2", text: "Bangkitkan guncangan (seed 42) → `logret` → dict `jalur` berisi 10.000 kekayaan akhir per alokasi" },
      { id: "t3", text: "Hitung `prob_shortfall`, `var5`, `es5` untuk alokasi Seimbang (target 1,8×)" },
      { id: "t4", text: "Hitung `fee_drag` = median tanpa fee − median dengan fee (Seimbang)" },
    ],
    expected:
      "Seimbang: prob_shortfall=45,21%, var5=1,08×, es5=0,95×, fee_drag=0,18× modal (median turun dari 2,06× menjadi 1,87×)",
    formula: String.raw`P_{\text{shortfall}} = \frac{1}{N}\sum_{i=1}^{N}\mathbf{1}\{W_T^{(i)} < 1{,}8\}`,
    formulaNote:
      "N = 10.000 jalur; W_T^(i) = kekayaan akhir jalur ke-i (× modal awal); 1{...} = indikator (1 bila kondisi terpenuhi). Jadi prob_shortfall = fraksi jalur yang gagal mencapai target 1,8×. VaR 5% = persentil ke-5 dari W_T; expected shortfall = rata-rata W_T pada jalur-jalur di bawah VaR 5%.",
    note: {
      title: "Miskonsepsi #3: seed = “curang”",
      type: "pitfall",
      body: "“Kalau seed dikunci, hasilnya sudah ditentukan — buat apa simulasi?” Justru sebaliknya: seed 42 membuat 10.000 jalur ini DAPAT DIAUDIT. Bu Ratna, regulatormu, dan analis lain bisa menjalankan ulang kode yang sama dan mendapat angka yang sama persis. Acak yang tidak dapat diulang = sulap; acak yang dapat diulang = sains. Yang “acak” di sini adalah pasarnya, bukan metodemu.",
    },
    hints: [
      "Muat CSV: `df = pd.read_csv(open_url(URL))` lalu `P = dict(zip(df[\"kunci\"], df[\"nilai\"]))` — akses mis. `P[\"mu_saham\"]`.",
      "Matriks korelasi: baris/kolom berurutan [obligasi, saham, emas]; diagonal 1,0; `L = np.linalg.cholesky(C)`.",
      "Guncangan berkorelasi: `Zc = rng.standard_normal((n_jalur, TAHUN, 3)) @ L.T` — JANGAN ubah urutan operasi ini (menentukan angka).",
      "Faktor tahunan portofolio: `(w * np.exp(logret)).sum(axis=2)`; fee: kurangi `fee` dari faktornya, lalu `.prod(axis=1)`.",
    ],
    requires: ["numpy", "pandas"],
    code: {
      starter: [
        "import numpy as np",
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-gabung-monte-carlo/params.csv\"",
        "SEED = 42",
        "N_JALUR = 10000",
        "TAHUN = 10",
        "TARGET = 1.8  # target: modal tumbuh 80% dalam 10 tahun (~6%/tahun)",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "df = pd.read_csv(open_url(URL))",
        "",
        "P = ...  # dict kunci -> nilai dari df",
        "",
        "mu = ...     # array [mu_obligasi, mu_saham, mu_emas]",
        "sigma = ...  # array [sigma_obligasi, sigma_saham, sigma_emas]",
        "C = ...      # matriks korelasi 3x3, urutan [obligasi, saham, emas]",
        "L = ...      # dekomposisi Cholesky dari C",
        "",
        "w = ...  # dict: 'konservatif'/'seimbang'/'agresif' -> array bobot [obligasi, saham, emas]",
        "fee = ...",
        "n_jalur = ...",
        "",
        "rng = np.random.default_rng(SEED)",
        "Zc = ...  # guncangan berkorelasi: standard_normal((n_jalur, TAHUN, 3)) @ L.T",
        "logret = ...  # (mu - 0.5*sigma**2) + sigma*Zc",
        "",
        "jalur = {}  # kekayaan akhir (x modal) per alokasi",
        "for nama, ww in w.items():",
        "    faktor = ...  # faktor pertumbuhan tahunan portofolio (buy-and-hold)",
        "    jalur[nama] = ...  # produk 10 tahun SETELAH fee",
        "",
        "akhir = ...  # jalur alokasi 'seimbang'",
        "prob_shortfall = ...  # fraksi jalur dengan akhir < TARGET",
        "var5 = ...             # persentil ke-5 dari akhir",
        "es5 = ...              # rata-rata akhir pada jalur <= var5",
        "",
        "bruto = ...  # jalur seimbang TANPA fee (untuk pembanding)",
        "fee_drag = ...  # median(bruto) - median(akhir)",
        "",
        "print(\"prob_shortfall:\", round(prob_shortfall, 4))",
        "print(\"VaR5:\", round(var5, 4), \"| ES5:\", round(es5, 4))",
        "print(\"fee_drag:\", round(fee_drag, 4))",
      ].join("\n"),
      lockLines: 12,
      solution: [
        "import numpy as np",
        "import pandas as pd",
        "from pyodide.http import open_url",
        "",
        "URL = \"/misi/misi-gabung-monte-carlo/params.csv\"",
        "SEED = 42",
        "N_JALUR = 10000",
        "TAHUN = 10",
        "TARGET = 1.8  # target: modal tumbuh 80% dalam 10 tahun (~6%/tahun)",
        "",
        "# TUGASMU: lengkapi baris-baris bertanda ... di bawah",
        "df = pd.read_csv(open_url(URL))",
        "",
        "P = dict(zip(df[\"kunci\"], df[\"nilai\"]))",
        "",
        "mu = np.array([P[\"mu_obligasi\"], P[\"mu_saham\"], P[\"mu_emas\"]])",
        "sigma = np.array([P[\"sigma_obligasi\"], P[\"sigma_saham\"], P[\"sigma_emas\"]])",
        "C = np.array([",
        "    [1.0, P[\"corr_obligasi_saham\"], P[\"corr_obligasi_emas\"]],",
        "    [P[\"corr_obligasi_saham\"], 1.0, P[\"corr_saham_emas\"]],",
        "    [P[\"corr_obligasi_emas\"], P[\"corr_saham_emas\"], 1.0],",
        "])",
        "L = np.linalg.cholesky(C)",
        "",
        "w = {",
        "    \"konservatif\": np.array([P[\"w_kons_obligasi\"], P[\"w_kons_saham\"], P[\"w_kons_emas\"]]),",
        "    \"seimbang\": np.array([P[\"w_seim_obligasi\"], P[\"w_seim_saham\"], P[\"w_seim_emas\"]]),",
        "    \"agresif\": np.array([P[\"w_agr_obligasi\"], P[\"w_agr_saham\"], P[\"w_agr_emas\"]]),",
        "}",
        "fee = float(P[\"fee_tahunan\"])",
        "n_jalur = N_JALUR",
        "",
        "rng = np.random.default_rng(SEED)",
        "Zc = rng.standard_normal((n_jalur, TAHUN, 3)) @ L.T",
        "logret = (mu - 0.5 * sigma**2) + sigma * Zc",
        "",
        "jalur = {}",
        "for nama, ww in w.items():",
        "    faktor = (ww * np.exp(logret)).sum(axis=2)",
        "    jalur[nama] = (faktor - fee).prod(axis=1)",
        "",
        "akhir = jalur[\"seimbang\"]",
        "prob_shortfall = float((akhir < TARGET).mean())",
        "var5 = float(np.percentile(akhir, 5))",
        "es5 = float(akhir[akhir <= var5].mean())",
        "",
        "bruto = (w[\"seimbang\"] * np.exp(logret)).sum(axis=2).prod(axis=1)",
        "fee_drag = float(np.median(bruto) - np.median(akhir))",
        "",
        "print(\"prob_shortfall:\", round(prob_shortfall, 4))",
        "print(\"VaR5:\", round(var5, 4), \"| ES5:\", round(es5, 4))",
        "print(\"fee_drag:\", round(fee_drag, 4))",
      ].join("\n"),
      checks: [
        { kind: "defined", task: "t1", label: "`P` termuat dari CSV", name: "P", msg: "P harus dict kunci->nilai dari params.csv (19 baris)." },
        { kind: "equal", task: "t2", label: "`n_jalur` = 10000", name: "n_jalur", value: 10000, msg: "Simulasi memakai 10.000 jalur (N_JALUR)." },
        { kind: "defined", task: "t2", label: "`jalur` terisi 3 alokasi", name: "jalur", msg: "jalur harus dict dengan kunci konservatif/seimbang/agresif." },
        { kind: "equal", task: "t3", label: "`prob_shortfall` ≈ 0,4521", name: "prob_shortfall", value: 0.4521, tol: 0.005, msg: "Fraksi 10.000 jalur Seimbang di bawah target 1,8×. Cek urutan operasi guncangan (seed 42). " },
        { kind: "equal", task: "t3", label: "`var5` ≈ 1,0821", name: "var5", value: 1.0821, tol: 0.01, msg: "Persentil ke-5 kekayaan akhir Seimbang (× modal)." },
        { kind: "equal", task: "t3", label: "`es5` ≈ 0,9501", name: "es5", value: 0.9501, tol: 0.01, msg: "Rata-rata jalur Seimbang pada/di bawah var5." },
        { kind: "equal", task: "t4", label: "`fee_drag` ≈ 0,1847", name: "fee_drag", value: 0.1847, tol: 0.01, msg: "median(tanpa fee) − median(dengan fee) untuk Seimbang." },
      ],
    },
  },
  {
    id: "lab-sql",
    eyebrow: "Langkah 5 · Lab 2 — Membaca tabel skenario",
    title: "Tiga alokasi, satu query",
    prose: [
      "Hasil simulasi sudah diringkas ke tabel kecil ini — metrik per alokasi dari 10.000 jalur yang SAMA dengan Lab 1. Tugasmu: dengan SATU query, jawab pertanyaan Bu Ratna yang paling mendesak — “alokasi mana yang peluang gagalnya di bawah 50%, dan bagaimana ekornya?”",
      "Tabel `ringkasan(alokasi TEXT, prob_shortfall_pct REAL, var5_pct REAL, es5_pct REAL, median_akhir REAL, fee_drag_pct REAL)`. Kolom `*_pct` dalam persen dari modal awal (100 = modal utuh); `median_akhir` dalam × modal.",
    ],
    tasks: [
      { id: "t1", text: "Tulis query: alokasi dengan prob_shortfall_pct < 50, tampilkan alokasi + prob_shortfall_pct + var5_pct + median_akhir, urut dari shortfall terkecil" },
    ],
    expected: "2 baris — Agresif (42,91 | 82,03 | 1,99) lalu Seimbang (45,21 | 108,21 | 1,87). Konservatif tersaring (62,03 ≥ 50).",
    sqlLab: {
      task: "Saring alokasi dengan prob_shortfall_pct < 50. Tampilkan alokasi, prob_shortfall_pct, var5_pct, median_akhir — urut dari probabilitas shortfall terkecil.",
      schema: "CREATE TABLE ringkasan (alokasi TEXT, prob_shortfall_pct REAL, var5_pct REAL, es5_pct REAL, median_akhir REAL, fee_drag_pct REAL);",
      seedData: [
        "INSERT INTO ringkasan VALUES",
        "('konservatif',62.03,120.00,110.56,1.69,16.74),",
        "('seimbang',45.21,108.21,95.01,1.87,18.47),",
        "('agresif',42.91,82.03,66.61,1.99,19.69);",
      ].join("\n"),
      starter: "-- Tulis query-mu di sini\nSELECT alokasi, prob_shortfall_pct, var5_pct, median_akhir\nFROM ringkasan\n",
      solution: [
        "SELECT alokasi, prob_shortfall_pct, var5_pct, median_akhir",
        "FROM ringkasan",
        "WHERE prob_shortfall_pct < 50",
        "ORDER BY prob_shortfall_pct;",
      ].join("\n"),
      expectedColumns: ["alokasi", "prob_shortfall_pct", "var5_pct", "median_akhir"],
      expectedRows: [
        ["agresif", 42.91, 82.03, 1.99],
        ["seimbang", 45.21, 108.21, 1.87],
      ],
      orderMatters: true,
    },
    note: {
      title: "Baca tabelnya seperti analis, bukan seperti salesman",
      type: "risk",
      body: "Query-mu menyaring DUA kandidat — tapi perhatikan kolom var5_pct: Agresif 82,03 vs Seimbang 108,21. Agresif memang paling jarang gagal (42,91%), TAPI kalau gagal, ekornya jauh lebih dalam (5% terburuk di bawah 82% modal; expected shortfall-nya 66,61%). Inilah trade-off yang harus kamu jelaskan ke Bu Ratna di Langkah 6: frekuensi gagal vs kedalaman gagal. Salesman menjual frekuensi; analis menjelaskan keduanya.",
    },
  },
  {
    id: "keputusan",
    eyebrow: "Langkah 6 · Checkpoint keputusan",
    title: "Alokasi mana untuk Bu Ratna?",
    prose: [
      "Angkanya lengkap. Tiga distribusi, tiga bentuk risiko — tidak ada yang dominan di semua metrik. Bu Ratna menunggu rekomendasi SATU alokasi beserta alasan distribusinya. Ingat profilnya: 45 tahun, target 1,8× dalam 10 tahun, dan ia berkata “saya tidak butuh janji, saya butuh tahu peluang gagalnya”. Keputusan ini final — seperti rekomendasi yang sudah ditandatangani.",
    ],
    tasks: [],
    decision: {
      prompt:
        "Alokasi mana yang kamu rekomendasikan untuk Bu Ratna? (Keputusan final — pertahankan dengan angka distribusi.)",
      options: [
        {
          id: "opt-konservatif",
          label: "Konservatif — ekor paling dangkal, tidur paling nyenyak",
          rationale:
            "Probabilitas shortfall 62,03% memang tertinggi, tapi 5% skenario terburuk rata-rata masih 1,11× modal — tidak ada jalur bencana. Untuk klien yang takut rugi, kedalaman ekor lebih penting daripada frekuensi gagal.",
          nextStepId: "kons-konservatif",
          consequenceNote:
            "Bu Ratna menerima — ia menghargai kejujuranmu soal probabilitas 62%. Tapi dua tahun kemudian ia menelepon: “Portofolioku cuma tumbuh segini?” Median Konservatif 1,69× memang DI BAWAH target 1,8×-nya — kamu memilih ketenangan ekor dengan harga target yang kemungkinan besar tidak tercapai. Ia tidak marah; ia kecewa pada ekspektasinya sendiri.",
        },
        {
          id: "opt-seimbang",
          label: "Seimbang — kompromi yang bisa dijelaskan",
          rationale:
            "Shortfall 45,21% (di bawah 50%), median 1,87× (di atas target), ekor 5% terburuk rata-rata 0,95× — tidak sedalam Agresif. Alokasi yang setiap angkanya bisa dipertahankan di depan klien.",
          nextStepId: "kons-seimbang",
          consequenceNote:
            "Bu Ratna mengangguk pelan membaca tabelmu. “Jadi 45% kemungkinan saya gagal — tapi kalau gagal, rata-rata saya masih pegang 95% modal.” Ia memilih Seimbang. Tiga tahun berlalu, portofolionya di 1,12× — di bawah lintasan, tapi ia tidak panik: kamu sudah memberinya PETA, bukan janji. Itulah nilai analis: klien yang tidak terkejut.",
        },
        {
          id: "opt-agresif",
          label: "Agresif — probabilitas gagal terendah",
          rationale:
            "Shortfall 42,91% — terendah dari ketiganya — dan median tertinggi 1,99×. Horizon 10 tahun cukup panjang untuk menahan guncangan; Bu Ratna masih 45 tahun.",
          nextStepId: "kons-agresif",
          consequenceNote:
            "Bu Ratna memilih Agresif demi angka 42,91%. Tahun ke-4 pasar jatuh; portofolionya sempat di 0,71× modal. Ia menelepon dengan suara bergetar: “Katanya peluang gagalnya paling kecil?” Kamu menjelaskan expected shortfall 0,67× — tapi ia hanya ingat “paling kecil”. Pelajaran mahal: klien mengingat NARASI, bukan tabel. “Peluang gagal terendah” terdengar seperti “aman” — padahal ekornya yang paling dalam.",
        },
      ],
    },
  },
  {
    id: "kons-konservatif",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: Konservatif",
    prose: [
      "Bu Ratna menerima rekomendasi Konservatif — ia tidur nyenyak setiap malam. Tapi di tahun ke-6, dengan portofolio di 1,45× dan target 1,8× yang semakin jauh, ia bertanya pelan: “Apakah saya terlalu takut?”",
      "Keputusanmu jujur secara risiko (ekor paling dangkal, 1,11×) tapi mahal secara tujuan: median 1,69× memang di bawah targetnya sejak awal. Kamu melindunginya dari bencana — dengan harga peluang mencapai tujuannya hanya ~38%.",
    ],
    tasks: [],
    note: {
      title: "Risiko vs tujuan: dua sisi yang harus disebut",
      body: "Rekomendasi yang baik menyebut KEDUANYA: “Risikonya begini (ekor 1,11×), TAPI peluang mencapai targetmu hanya 38%.” Klien berhak tahu harga dari ketenangannya. Di deliverable-mu, setiap rekomendasi wajib memuat probabilitas mencapai target — bukan cuma ukuran risikonya.",
    },
  },
  {
    id: "kons-seimbang",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: Seimbang",
    prose: [
      "Tiga tahun berlalu. Portofolio Bu Ratna di 1,12× — di bawah lintasan ideal menuju 1,8×, tapi ia tidak panik. Ia ingat tabelmu: 45% kemungkinan gagal, dan kalau gagal rata-rata masih pegang 95% modal. Ia menelepon bukan untuk mengeluh, melainkan bertanya: “Apakah ini masih dalam peta yang kamu tunjukkan dulu?”",
      "“Masih,” jawabmu — dan itu jawaban yang hanya bisa diberikan oleh analis yang memberi DISTRIBUSI, bukan janji. Klien yang memegang peta tidak terkejut oleh jalan yang berbelok.",
    ],
    tasks: [],
    note: {
      title: "Nilai sebenarnya seorang analis",
      body: "Bukan memilihkan angka terbesar — melainkan membuat klien TIDAK TERKEJUT oleh realisasi apa pun. Distribusi adalah alat anti-kejutan: setiap hasil akhir, baik atau buruk, sudah “pernah dilihat” di peta 10.000 jalur. Tulis ini di deliverable-mu sebagai janji layanan, bukan janji hasil.",
    },
  },
  {
    id: "kons-agresif",
    goto: "audit",
    eyebrow: "Langkah 7 · Konsekuensi",
    title: "Diputuskan: Agresif",
    prose: [
      "Tahun ke-4 pasar jatuh. Portofolio Bu Ratna sempat di 0,71× modal — di dalam 5% ekor yang tabelmu tulis sebagai expected shortfall 0,67×. Ia menelepon dengan suara bergetar: “Katanya peluang gagalnya PALING KECIL?”",
      "Kamu benar secara angka (42,91% memang terendah) tapi kalah secara komunikasi: “paling kecil” ia dengar sebagai “aman”. Ekor Agresif yang dalam tidak pernah benar-benar masuk ke kepalanya — karena narasi mengalahkan tabel.",
    ],
    tasks: [],
    note: {
      title: "Komunikasi risiko = bagian dari risiko",
      body: "Angka yang benar tapi disalahpahami klien = rekomendasi yang gagal. Untuk klien ritel, SELALU terjemahkan ekor ke kalimat konkret: “5% kemungkinan terburuk: uang Ibu tinggal 67%.” Kalau kalimat itu membuatnya pucat, alokasinya salah — seberapa pun “rendah” probabilitasnya. Tulis kalimat-kalimat konkret ini di deliverable-mu.",
    },
  },
  {
    id: "audit",
    eyebrow: "Langkah 8 · Misi audit",
    title: "Dossier 16 slide: pitch deck yang terlalu manis",
    prose: [
      "Sebelum menulis rekomendasi final, satu misi audit. Di bawah ini 16 slide “Pitch Deck Wealth Management: Seribu Masa Depan” — dokumen yang mengklaim mensimulasikan 10.000 skenario untuk menjual alokasi Agresif ke Bu Ratna. Seseorang menyuntikkan 4 sabotase ke dalamnya. Senjatamu: params.csv asli dan angka Lab 1-mu sendiri.",
      "Ingat: sabotase di INPUT (vol, korelasi, fee, horizon) melahirkan angka OUTPUT yang manis — baris 7–9 yang “terlalu bagus” adalah GEJALA, bukan penyakitnya. Cari penyakitnya.",
    ],
    tasks: [],
    auditDossier: {
      version: "mc-capc-v1",
      snapshotDate: "2026-10-15",
      intro:
        "Dossier ini diklaim sebagai pitch deck wealth management berbasis “10.000 skenario Monte Carlo” yang merekomendasikan alokasi Agresif untuk semua klien.",
      columns: ["Slide", "Klaim", "Angka"],
      rows: [
        { rowId: 1, cells: { "Slide": "1 · Sampul", "Klaim": "Judul deck", "Angka": "Seribu Masa Depan: Portofolio Optimal 10 Tahun" }, claims: [{ label: "Klaim", value: "10.000 skenario disimulasikan" }] },
        { rowId: 2, cells: { "Slide": "2 · Metode", "Klaim": "Engine simulasi", "Angka": "Monte Carlo, seed 42, horizon 10 tahun" }, claims: [{ label: "Klaim", value: "Hasil dapat direproduksi" }] },
        { rowId: 3, cells: { "Slide": "3 · Asumsi vol", "Klaim": "Volatilitas tahunan", "Angka": "Saham 8% · Obligasi 6% · Emas 15%" }, claims: [{ label: "Sumber", value: "“Estimasi internal terkini”" }] },
        { rowId: 4, cells: { "Slide": "4 · Asumsi korelasi", "Klaim": "Korelasi antar-aset", "Angka": "0 — aset bergerak independen" }, claims: [{ label: "Alasan", value: "“Menyederhanakan perhitungan”" }] },
        { rowId: 5, cells: { "Slide": "5 · Biaya", "Klaim": "Fee manajemen", "Angka": "Diabaikan — negligible" }, claims: [{ label: "Catatan", value: "Gross = net" }] },
        { rowId: 6, cells: { "Slide": "6 · Horizon", "Klaim": "Periode analisis", "Angka": "5 tahun terbaik dari 10 tahun simulasi" }, claims: [{ label: "Metode", value: "“Fokus pada periode representatif”" }] },
        { rowId: 7, cells: { "Slide": "7 · Shortfall", "Klaim": "P(gagal capai target 1,8×)", "Angka": "Agresif 12% · Seimbang 18% · Konservatif 25%" }, claims: [{ label: "Klaim", value: "Semua di bawah 30%" }] },
        { rowId: 8, cells: { "Slide": "8 · VaR 5%", "Klaim": "Ambang 5% terburuk", "Angka": "Agresif 0,95× · Seimbang 1,30×" }, claims: [{ label: "Klaim", value: "Ekor terkendali" }] },
        { rowId: 9, cells: { "Slide": "9 · Median", "Klaim": "Hasil tengah", "Angka": "Agresif 2,6× · Seimbang 2,1× · Konservatif 1,9×" }, claims: [{ label: "Klaim", value: "Median = ekspektasi" }] },
        { rowId: 10, cells: { "Slide": "10 · Rekomendasi", "Klaim": "Pilihan untuk klien", "Angka": "Agresif — return tertinggi, risiko “rendah”" }, claims: [{ label: "Rekomendasi", value: "Untuk semua profil" }] },
        { rowId: 11, cells: { "Slide": "11 · Distribusi", "Klaim": "Bentuk hasil", "Angka": "“Hasil pasti 2,4× dalam 10 tahun”" }, claims: [{ label: "Klaim", value: "Titik, bukan rentang" }] },
        { rowId: 12, cells: { "Slide": "12 · Stress", "Klaim": "Skenario stres", "Angka": "Tidak ada — “sudah tercakup Monte Carlo”" }, claims: [{ label: "Klaim", value: "Cukup" }] },
        { rowId: 13, cells: { "Slide": "13 · Fee drag", "Klaim": "Dampak fee 10 tahun", "Angka": "0%" }, claims: [{ label: "Klaim", value: "Diabaikan" }] },
        { rowId: 14, cells: { "Slide": "14 · Perbandingan", "Klaim": "Pemenang", "Angka": "Agresif menang di semua metrik" }, claims: [{ label: "Klaim", value: "Dominan" }] },
        { rowId: 15, cells: { "Slide": "15 · Kesimpulan", "Klaim": "Vonis", "Angka": "Risiko terkendali — layak jual" }, claims: [{ label: "Klaim", value: "Final" }] },
        { rowId: 16, cells: { "Slide": "16 · Persetujuan", "Klaim": "Tanda tangan analis", "Angka": "—" }, claims: [{ label: "Status", value: "Menunggu analis independen (kamu)" }] },
      ],
      injections: [
        { key: "vol-direndahkan", rowIds: [3], title: "Volatilitas saham direndahkan", clue: "Deck menulis vol saham 8% — params.csv (dan Lab 1-mu) memakai 20%. Vol yang dikecilkan 2,5× membuat seluruh distribusi tampak ramping dan ekornya hilang.", danger: "Satu angka input yang “diestimasi ulang” tanpa jejak mengubah SEMUA output: shortfall 12% vs 42,91% aslinya. Klien membeli Agresif karena risikonya terlihat kecil — padahal risikonya disembunyikan di asumsi." },
        { key: "korelasi-nol", rowIds: [4], title: "Korelasi diasumsikan nol", clue: "“Menyederhanakan perhitungan” — padahal korelasi saham–emas −0,10 adalah bantal diversifikasi, dan korelasi obligasi–emas 0,20 menambah guncangan bersama. Nol korelasi = portofolio terlihat lebih terdiversifikasi dari aslinya.", danger: "Asumsi “penyederhanaan” yang mengubah hasil bukan penyederhanaan — itu manipulasi model. Setiap asumsi yang memudahkan HARUS diuji sensitivitasnya sebelum dipakai menjual." },
        { key: "fee-diabaikan", rowIds: [5, 13], title: "Fee 1%/tahun diabaikan", clue: "“Negligible” — padahal Lab 1-mu membuktikan fee memangkas median Seimbang 0,18× modal (dari 2,06× ke 1,87×). Slide 13 bahkan berani menulis dampak fee “0%”.", danger: "Biaya yang diabaikan = return yang dibesar-besarkan. 0,18× modal awal adalah uang nyata Bu Ratna — sekitar seperlima modalnya hilang diam-diam dalam 10 tahun." },
        { key: "horizon-cherry", rowIds: [6], title: "Horizon cherry-picked: 5 tahun terbaik", clue: "“Fokus pada periode representatif” — 5 tahun TERBAIK dari 10 tahun simulasi. Itu bukan analisis, itu memilih bingkai foto. Horizon penuh 10 tahun (sesuai kebutuhan Bu Ratna) memberi shortfall 42,91%, bukan 12%.", danger: "Cherry-picking horizon adalah survivorship bias versi waktu: buang separuh masa depan yang buruk, jual separuhnya yang manis. Horizon analisis WAJIB = horizon kebutuhan klien." },
      ],
    },
  },
  {
    id: "kasus-mini",
    eyebrow: "Langkah 9 · Mini-case",
    title: "Pak Budi dan “jaminan” 15%",
    prose: [
      "Mini-case — 10 menit, tanpa kode. Seorang agen asuransi unit-link menawarkan Pak Budi (50 tahun, pensiun 5 tahun lagi) produk dengan “jaminan return 15% per tahun”. Brosurnya menampilkan SATU grafik garis mulus menanjak dan SATU angka: 15%. Tidak ada distribusi, tidak ada probabilitas, tidak ada ekor, tidak ada fee.",
      "Tugasmu di kepala (tulis 3–4 kalimat di catatanmu): (1) Tiga pertanyaan distribusi apa yang HARUS ditanyakan Pak Budi sebelum tanda tangan? (2) Jika “jaminan” itu ternyata = median skenario baik, apa yang disembunyikan? (3) Bagaimana kamu menjelaskan expected shortfall ke Pak Budi dalam SATU kalimat tanpa kata “persentil”?",
      "Contoh jawaban yang lolos: “(1) Berapa peluang gagal capai target saya? Kalau gagal, rata-rata sisa berapa? Berapa fee per tahunnya? (2) Median skenario baik menyembunyikan ekor kiri — separuh masa depan di bawah angka itu, termasuk yang bencana. (3) ‘Kalau Bapak sial dan masuk 5% hasil terburuk, rata-rata uang Bapak tinggal segini.’”",
    ],
    tasks: [
      { id: "t1", text: "Tulis 3 pertanyaan distribusi untuk Pak Budi" },
      { id: "t2", text: "Tulis 1 kalimat expected shortfall tanpa kata “persentil”" },
    ],
    note: {
      title: "Pola yang harus kamu kenali di dunia nyata",
      type: "risk",
      body: "Satu angka + satu grafik mulus + kata “jaminan/pasti” + tidak ada fee + tidak ada ekor = LIMA tanda bahaya pitch produk ritel. Setelah misi ini, kamu punya refleks: minta distribusinya. Kalau penjualnya tidak bisa menunjukkan distribusi, ia tidak menjual investasi — ia menjual cerita.",
    },
  },
  {
    id: "deliverable",
    eyebrow: "Langkah 10 · Deliverable",
    title: "Rekomendasi untuk Bu Ratna + pengungkapan risiko",
    prose: [
      "Semua bukti di tangan. Tulis rekomendasi satu halaman untuk Bu Ratna — artefak portofoliomu. Rekomendasi yang baik untuk klien ritel punya dua wajah: ANGKA yang jujur (distribusi, bukan titik) dan BAHASA yang tidak disalahpahami (kalimat konkret, bukan jargon).",
    ],
    tasks: [],
    deliverable: {
      template: [
        "Rekomendasi alokasi (1 pilihan) + alasan distribusi: probabilitas shortfall, VaR 5%, expected shortfall — dalam angka DAN satu kalimat konkret per metrik (“5% kemungkinan terburuk: uang Ibu tinggal …”).",
        "Tabel perbandingan 3 alokasi: median, prob. shortfall, VaR 5%, expected shortfall, fee drag — semua dari Lab 1 (seed 42).",
        "Temuan audit pitch deck: 4 sabotase (vol, korelasi, fee, horizon) + bagaimana tiap sabotase mempermanis angka.",
        "Pengungkapan risiko: apa yang TIDAK dijamin (tidak ada “pasti”), batas model (parameter sintetis, GBM bukan ramalan pasar, tidak ada pajak/inflasi/rebalancing), dan kapan rekomendasi harus ditinjau ulang.",
        "Rencana komunikasi: bagaimana kamu memastikan Bu Ratna tidak salah paham (“peluang gagal terendah” ≠ “aman”) — tulis kalimat yang akan kamu ucapkan.",
      ],
      rubric: [
        { criterion: "Kebenaran angka distribusi", weight: 25, levels: ["Angka salah/tidak ada", "Sebagian angka benar", "prob_shortfall 62,03/45,21/42,91%, var5, es5, fee_drag — semua tepat (seed 42)"] },
        { criterion: "Deteksi sabotase", weight: 25, levels: ["Tidak menyebut sabotase", "Menyebut sebagian tanpa nomor slide", "Keempat sabotase disebut dengan nomor slide + efeknya pada angka"] },
        { criterion: "Bahasa klien", weight: 25, levels: ["Penuh jargon tanpa terjemahan", "Sebagian diterjemahkan", "Setiap metrik punya kalimat konkret tanpa “persentil”/“shortfall”"] },
        { criterion: "Kejujuran batas", weight: 25, levels: ["Mengklaim rekomendasi menjamin hasil", "Menyebut sebagian batas", "Batas (sintetis, GBM≠ramalan, tanpa pajak/inflasi) + jadwal tinjau ulang dinyatakan eksplisit"] },
      ],
    },
  },
  {
    id: "debrief",
    eyebrow: "Langkah 11 · Debrief",
    title: "Yang sebenarnya terjadi — dan kenapa ini penting",
    prose: [
      "Debrief dibuka. Empat sabotase di pitch deck:",
      "1) **Vol direndahkan** (slide 3): saham ditulis 8%, padahal params.csv 20%. Vol 2,5× lebih kecil = distribusi 2,5× lebih ramping = ekor bencana “hilang”. Shortfall Agresif yang asli 42,91% tampil sebagai 12%. Satu angka input, seluruh output berdusta.",
      "2) **Korelasi = 0** (slide 4): “menyederhanakan perhitungan”. Korelasi −0,10 saham–emas adalah bantal diversifikasi; 0,20 obligasi–emas adalah guncangan bersama. Nol korelasi membuat portofolio tampak lebih jinak dari aslinya — dan tidak ada uji sensitivitas yang menyertainya.",
      "3) **Fee diabaikan** (slide 5 & 13): “negligible”, bahkan ditulis “0%”. Lab 1-mu: fee 1%/tahun memangkas median Seimbang 0,18× modal — seperlima modal awal Bu Ratna hilang diam-diam. Biaya yang diabaikan = return yang dibesar-besarkan.",
      "4) **Horizon cherry-picked** (slide 6): 5 tahun TERBAIK dari 10 tahun simulasi. Buang separuh masa depan yang buruk, jual separuhnya yang manis — survivorship bias versi waktu. Horizon analisis wajib = horizon kebutuhan klien: 10 tahun.",
      "Dan ingat keputusan bercabangmu: tidak ada alokasi yang gratis. Konservatif = tidur nyenyak, target kemungkinan besar gagal (median 1,69× < 1,8×). Seimbang = peta yang jujur, klien tidak terkejut. Agresif = peluang gagal terendah (42,91%) dengan ekor terdalam (ES 0,67×) — dan narasi “paling kecil” yang mudah disalahpahami sebagai “aman”. Analis terbaik bukan yang memilihkan angka terbesar, melainkan yang memastikan klien tidak terkejut.",
      "Bahaya nyata terakhir: industri ritel menjual TITIK (“pasti 2,4×”, “jaminan 15%”) karena titik mudah dijual dan distribusi menakutkan. Setiap produk yang hanya menunjukkan satu angka tanpa probabilitas gagal, tanpa ekor, tanpa fee — sedang menyembunyikan sesuatu. Refleksmu mulai sekarang: “Tunjukkan distribusinya.”",
    ],
    tasks: [],
    note: {
      title: "Miskonsepsi #4: simulasi = ramalan",
      type: "risk",
      body: "Monte Carlo TIDAK meramal pasar — ia memetakan KONSEKUENSI dari asumsi. “Jika return, vol, dan korelasinya begini, maka distribusinya begitu.” Ganti asumsinya (seperti pitch deck: vol 8%), ganti petanya. Kekuatan sekaligus bahaya Monte Carlo: ia memberi jawaban yang presisi untuk asumsi yang mungkin salah. Itulah kenapa audit asumsi (Langkah 8) SAMA PENTINGNYA dengan simulasinya (Langkah 4).",
    },
  },
  {
    id: "rangkuman",
    eyebrow: "Langkah 12 · Rangkuman",
    title: "Poin penting misi ini",
    prose: [],
    tasks: [],
    summary: [
      "Simulasi Monte Carlo (seed 42, 10.000 jalur × 10 tahun): Seimbang → shortfall 45,21%, VaR5 1,08×, expected shortfall 0,95×, fee drag 0,18× modal; Agresif → shortfall 42,91% (terendah) tapi ekor terdalam (ES 0,67×); Konservatif → shortfall 62,03% tapi ekor terdangkal (ES 1,11×).",
      "Memilih alokasi = memilih BENTUK RISIKO, bukan angka terbesar: frekuensi gagal vs kedalaman gagal adalah trade-off yang harus dijelaskan dengan kalimat konkret ke klien ritel.",
      "Empat sabotase pitch deck: volatilitas direndahkan (8% vs 20%), korelasi diasumsikan nol, fee 1%/tahun diabaikan, horizon cherry-picked 5 tahun terbaik — sabotase di INPUT melahirkan angka OUTPUT yang manis.",
      "Fee 1%/tahun bukan “kecil”: efek majemuknya memangkas median Seimbang dari 2,06× menjadi 1,87× dalam 10 tahun.",
      "Refleks analis: setiap produk yang hanya menunjukkan satu angka tanpa distribusi, tanpa probabilitas gagal, tanpa ekor, tanpa fee — sedang menyembunyikan sesuatu. Minta distribusinya.",
      "Data: 100% SINTETIS (seed 42, params.csv 19 baris) — parameter fiktif untuk latihan logika distribusi, BUKAN fakta pasar; GBM memetakan konsekuensi asumsi, bukan meramal.",
    ],
  },
];

(misiGabungMonteCarlo.steps as V2Step[]).push(...LANJUTAN_MC);

export default misiGabungMonteCarlo;

