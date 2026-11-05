import type { V2Lesson } from "../lib/types";

// ── Figure: rata-rata mentah vs rata-rata susut (shrinkage), 8 cabang ──────
// data sintetis dari lab (seed 316): raw = rata-rata per cabang,
// shrunk = estimasi susut, garis = grand mean 9,8
const SHRINK_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Plot caterpillar: rata-rata mentah dan rata-rata susut delapan cabang">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="250" x2="530" y2="250"/>
<line x1="60" y1="200" x2="530" y2="200"/><line x1="60" y1="150" x2="530" y2="150"/>
<line x1="60" y1="100" x2="530" y2="100"/><line x1="60" y1="50" x2="530" y2="50"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="253">-5</text><text x="54" y="203">0</text><text x="54" y="153">5</text>
<text x="54" y="103">10</text><text x="54" y="53">15</text><text x="54" y="23">20</text>
</g>
<line x1="60" y1="103" x2="530" y2="103" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="526" y="95" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">grand mean 9,8</text>
<g stroke-width="2">
<line x1="120" y1="108" x2="120" y2="108" stroke="var(--c1)"/>
</g>
<g font-family="var(--font-ui)">
<g><line x1="110" y1="108" x2="130" y2="108" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="120" cy="108" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="120" cy="108" r="5" fill="var(--c1)"/><text x="120" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C1</text></g>
<g><line x1="175" y1="158" x2="195" y2="156" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="175" cy="158" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="195" cy="156" r="5" fill="var(--c1)"/><text x="185" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C2</text></g>
<g><line x1="240" y1="218" x2="260" y2="213" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="240" cy="218" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="260" cy="213" r="5" fill="var(--c1)"/><text x="250" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C3</text></g>
<g><line x1="305" y1="143" x2="325" y2="142" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="305" cy="143" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="325" cy="142" r="5" fill="var(--c1)"/><text x="315" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C4</text></g>
<g><line x1="370" y1="76" x2="390" y2="77" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="370" cy="76" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="390" cy="77" r="5" fill="var(--c1)"/><text x="380" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C5</text></g>
<g><line x1="435" y1="25" x2="455" y2="27" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="435" cy="25" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="455" cy="27" r="5" fill="var(--c1)"/><text x="445" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C6</text></g>
<g><line x1="500" y1="26" x2="520" y2="28" stroke="var(--chart-text)" stroke-width="2" opacity="0.6"/><circle cx="500" cy="26" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><circle cx="520" cy="28" r="5" fill="var(--c1)"/><text x="510" y="272" text-anchor="middle" font-size="10" fill="var(--text)">C7</text></g>
</g>
<g font-size="11" font-family="var(--font-ui)">
<circle cx="80" cy="286" r="5" fill="none" stroke="var(--chart-text)" stroke-width="2"/><text x="92" y="290" fill="var(--text)">rata-rata mentah cabang</text>
<circle cx="250" cy="286" r="5" fill="var(--c1)"/><text x="262" y="290" fill="var(--text)">rata-rata susut (shrinkage)</text>
<text x="470" y="296" fill="var(--text-muted)" font-size="10">data sintetis</text>
</g>
<text x="60" y="20" font-size="10" fill="var(--text-muted)" font-family="var(--font-ui)">skor risiko rata-rata per cabang</text>
</svg>`;

export const a316: V2Lesson = {
  slug: "a316-mixed-effects",
  track: "Statistika",
  module: "Modeling Lanjutan",
  title: "Mixed Effects Models: Satu Model untuk Data Berlapis (debitur dalam cabang, transaksi dalam nasabah)",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Cabang dengan rata-rata terbaik — dan 3 debitur",
      prose: [
        "Awal 2024, seorang analis risiko di sebuah bank multinasional mempresentasikan ranking 40 cabang berdasarkan rata-rata tunggakan debitur. Cabang di kota kecil “menang” dengan rata-rata tunggakan nyaris nol — direksi bertepuk tangan, bonus kinerja disiapkan. Tiga bulan kemudian audit internal menemukan faktanya: cabang itu hanya punya 3 debitur aktif, dan ketiganya kebetulan sedang lancar. Di ujung lain, cabang “terburuk” dengan rata-rata tunggakan tertinggi ternyata cabang dengan 2.000 debitur di wilayah yang baru dilanda banjir — rata-ratanya stabil dan jujur, tetapi terlihat jelek di samping angka cabang 3-debitur itu.",
        "Twist-nya: tidak ada angka yang salah hitung. Rata-rata 3 debitur itu benar secara aritmetika — tetapi salah secara makna, karena ia diperlakukan setara dengan rata-rata 2.000 debitur. Analis itu memakai regresi OLS biasa (satu garis untuk semua debitur), yang mengasumsikan setiap baris data independen dan setara. Padahal datanya berlapis: debitur tersarang di dalam cabang, cabang punya “karakter” sendiri — kebijakan kolektornya, kondisi ekonominya, bahkan keberuntungannya.",
        "Lesson ini tentang model yang menghormati lapisan itu: mixed effects model. Ia tidak memilih antara “satu model untuk semua” dan “satu model per cabang” — ia mengambil jalan tengah yang cerdas: cabang dengan sedikit data “dipinjamkan” kekuatan dari keseluruhan (disebut shrinkage), cabang dengan banyak data dibiarkan berbicara sendiri. Hasilnya: ranking yang tidak lagi dimenangkan oleh kebetulan 3 debitur.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Data risiko hampir selalu berlapis: debitur dalam cabang, cabang dalam region; transaksi dalam nasabah; klaim dalam agen asuransi; pengajuan dalam analis kredit. OLS biasa yang mengabaikan lapisan meremehkan ketidakpastian (standard error terlalu kecil, p-value terlalu optimistis) dan menghasilkan ranking antar-grup yang dikuasai noise. Setiap kali kamu melihat data dengan kolom “grup”, mixed effects harus masuk daftar pertimbangan.",
      },
      reference: "Data berlapis = observasi tersarang dalam grup; grup punya variasinya sendiri yang harus dimodelkan, bukan diabaikan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) mengenali struktur data berlapis dan menjelaskan kenapa OLS biasa gagal di sana (standard error bias ke bawah); (2) menulis model random intercept beserta asumsi tiap simbolnya; (3) menghitung dan menafsirkan ICC (intraclass correlation) serta estimasi susut (shrinkage); (4) memilih antara random intercept, random slope, dan fixed effects; (5) membaca output statsmodels MixedLM (REML vs ML) dan memutuskan kapan memakai yang mana.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep (random intercept, shrinkage & ICC, random slope + REML/ML) → lab Pyodide (mesin shrinkage) → chart caterpillar dengan panduan baca → peta keputusan → mini-case cabang → kuis → rangkuman. Estimasi 58 menit; lab-nya ±15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, regresi OLS: model y = Xβ + ε mengasumsikan galat ε independen dan berdistribusi identik (i.i.d.) — setiap baris data “berdiri sendiri” tanpa kekerabatan. Pelanggaran asumsi ini (misalnya debitur satu cabang saling mirip) membuat standard error koefisien bias ke bawah: kamu merasa lebih yakin dari yang seharusnya. Kedua, GLM/logistic: kerangka yang sama diperluas — bila responsnya biner (gagal bayar/tidak), bagian “fixed” model bisa memakai link logit, dan bagian “random”-nya tetap menangkap variasi antar-grup; itu disebut generalized linear mixed model.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: mixed effects = regresi biasa + “setiap grup boleh punya offset-nya sendiri, tetapi offset itu dianggap sampel acak dari suatu distribusi”. Satu asumsi tambahan itu mengubah segalanya.",
      ],
      reference: "Bekal: (1) OLS butuh galat i.i.d. — data berlapis melanggarnya; (2) GLM menangani respons non-normal; mixed model = keduanya digabung.",
    },
    {
      id: "konsep-intercept",
      eyebrow: "Langkah 3 · Konsep",
      title: "Random intercept — Si Pemberi Warisan Grup",
      prose: [
        "Definisi: model random intercept menulis skor debitur ke-i di cabang ke-j sebagai y_ij = β_0 + β_1 x_ij + u_j + ε_ij. Ada dua galat, bukan satu: u_j adalah “warisan” cabang j — offset acak yang sama untuk semua debitur di cabang itu, diambil dari distribusi Normal(0, σ_u²); ε_ij adalah noise individual debitur, dari Normal(0, σ_ε²). Koefisien β_0, β_1 adalah fixed effects (berlaku untuk semua cabang); u_j adalah random effects (berbeda tiap cabang, tetapi dianggap sampel dari satu populasi cabang).",
        "Kepribadiannya: random intercept seperti sistem warisan keluarga — setiap anak (debitur) punya usaha sendiri (β_1 x_ij + ε_ij), tetapi semua anak dalam satu keluarga mewarisi “nama keluarga” yang sama (u_j): ada keluarga yang namanya membuka pintu (cabang dengan kolektor hebat, u_j positif), ada yang namanya jadi beban (wilayah sulit, u_j negatif). Model ini tidak menghakimi satu keluarga dari satu anak yang kebetulan beruntung — ia memisahkan “efek keluarga” dari “usaha anak”.",
        "Kapan memakai: (1) datamu punya kolom grup yang jelas (cabang, region, analis, vintage) dengan ≥ 5–10 grup; (2) kamu peduli pada generalisasi ke grup BARU yang belum terlihat (cabang yang akan dibuka tahun depan) — random effects memodelkan populasi grup, bukan daftar grup yang ada; (3) ukuran grup tidak seimbang (ada cabang 3 debitur, ada yang 2.000). Estimasi praktis memakai statsmodels: `sm.MixedLM.from_formula(\"y ~ x\", data, groups=data[\"cabang\"]).fit()` — argumen `groups` itulah yang menyatakan lapisannya.",
      ],
      formula: String.raw`y_{ij} = \beta_0 + \beta_1 x_{ij} + u_j + \varepsilon_{ij}, \qquad u_j \sim \mathcal{N}(0, \sigma_u^2), \quad \varepsilon_{ij} \sim \mathcal{N}(0, \sigma_\varepsilon^2)`,
      formulaNote: "y_ij = skor debitur i di cabang j; β_0 = intersep global (fixed); β_1 = efek kovariat x (misalnya limit kredit, fixed); u_j = offset acak cabang j — SAMA untuk semua debitur di cabang itu, menyerap “karakter” cabang; ε_ij = noise individual. σ_u² = variansi antar-cabang (seberapa berbeda cabang satu sama lain); σ_ε² = variansi dalam-cabang (seberapa berisik debitur di cabang yang sama). Model mengestimasi KETIGA parameter variansi/koefisien ini sekaligus — itulah “mixed”: fixed + random.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Random effect = memasukkan dummy cabang satu per satu”",
        type: "pitfall",
        body: "Yang benar: dummy per cabang (fixed effects) mengestimasi 40 parameter bebas untuk 40 cabang — cabang 3-debitur dapat estimasi liar tanpa penalti. Random intercept hanya mengestimasi SATU parameter tambahan (σ_u²) dan menganggap tiap u_j sebagai sampel dari Normal(0, σ_u²): cabang kecil otomatis “ditarik” ke rata-rata global (shrinkage, lihat Langkah 4). Dummy = 40 angka bebas; random = 1 distribusi yang menertibkan 40 angka.",
      },
      hints: [
        "💡 Intuisi: tanya “apakah grup-grup ini sampel dari populasi yang lebih besar?” — kalau ya (cabang bank dari populasi cabang yang mungkin), pakai random. Kalau grupnya adalah seluruh populasi yang kamu peduli (misalnya hanya 4 region dan kamu hanya peduli keempatnya), fixed effects/dummy lebih jujur.",
      ],
      reference: "Random intercept: satu offset acak per grup, u_j ~ N(0, σ_u²). Grup kecil → estimasi ditarik ke global.",
    },
    {
      id: "konsep-shrinkage",
      eyebrow: "Langkah 4 · Konsep",
      title: "Shrinkage & ICC — Si Penjinak Kebetulan",
      prose: [
        "Definisi: shrinkage adalah kompromi optimal antara “percaya pada data grup” dan “percaya pada rata-rata global”. Estimasi susut rata-rata cabang j adalah μ̂_j = w_j · ȳ_j + (1 − w_j) · ȳ, dengan bobot w_j = σ_u² / (σ_u² + σ_ε²/n_j). Baca rumusnya: bila cabang punya banyak debitur (n_j besar), w_j mendekati 1 — percaya penuh pada rata-rata cabang. Bila n_j kecil, w_j mengecil — rata-rata cabang “disusutkan” menuju grand mean ȳ. Ini bukan trik kosmetik; ini adalah penduga yang meminimalkan kesalahan kuadrat rata-rata (hasil klasik: James–Stein).",
        "Kepribadiannya: shrinkage adalah orang tua yang bijak menanggapi laporan nilai anak. Anak pulang membawa nilai 100 dari SATU ulangan (n kecil) — orang tua mengangguk, tetapi tetap ingat rata-rata rapornya 75. Anak lain membawa rata-rata 92 dari 40 ulangan (n besar) — barulah orang tua percaya penuh. Shrinkage melakukan hal persis itu pada cabang: semakin sedikit bukti, semakin kuat tarikan ke rata-rata keluarga besar.",
        "Kapan memakai: ICC (intraclass correlation) = σ_u² / (σ_u² + σ_ε²) adalah kompasnya — proporsi total variansi yang “milik” perbedaan antar-grup. ICC ≈ 0 (misalnya 0,02): grup nyaris tidak berbeda, OLS biasa cukup, mixed model mubazir. ICC besar (misalnya 0,30): sepertiga variasi skor dijelaskan oleh “cabang mana”, mengabaikannya berarti standard error yang menipu. Aturan praktis: hitung ICC dulu; di atas ~0,05–0,10, mixed effects mulai membayar harganya.",
      ],
      formula: String.raw`\hat{\mu}_j = w_j \, \bar{y}_j + (1 - w_j) \, \bar{y}, \qquad w_j = \frac{\sigma_u^2}{\sigma_u^2 + \sigma_\varepsilon^2 / n_j}, \qquad \text{ICC} = \frac{\sigma_u^2}{\sigma_u^2 + \sigma_\varepsilon^2}`,
      formulaNote: "μ̂_j = estimasi susut cabang j; ȳ_j = rata-rata mentah cabang j; ȳ = grand mean semua data; n_j = jumlah debitur cabang j; σ_u², σ_ε² seperti di Langkah 3. Contoh angka dari lab: σ_u = 4, σ_ε = 3, n_j = 25 → w = 16/(16 + 9/25) ≈ 0,978 — dengan 25 debitur per cabang, data cabang dipercaya 97,8%. Coba di lab: turunkan n menjadi 3 dan lihat w anjlok — cabang 3-debitur hampir seluruhnya “dipinjamkan” angka dari global. ICC = 16/(16+9) = 0,64: 64% variasi skor adalah perbedaan antar-cabang — sangat layak dimodelkan.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Shrinkage memalsukan data — rata-rata cabang diubah-ubah”",
        type: "pitfall",
        body: "Yang benar: rata-rata mentah TETAP apa adanya sebagai statistik deskriptif — shrinkage hanya mengubah ESTIMASI untuk pengambilan keputusan. Rata-rata mentah menjawab “berapa rata-rata sampel ini?”; estimasi susut menjawab “berapa tebakan terbaik untuk karakter cabang ini?”. Untuk cabang 3-debitur, tebakan terbaik memang bukan 100% angka 3 orang itu — itu namanya overfitting berkedok deskriptif.",
      },
      hints: [
        "💡 Intuisi: bobot w_j adalah rasio “sinyal grup” terhadap “sinyal grup + noise rata-rata”. Noise rata-rata = σ_ε²/n_j mengecil seiring n_j — inilah alasan matematis kenapa cabang besar dipercaya dan cabang kecil tidak.",
      ],
      reference: "w_j → 1 saat n_j besar (percaya cabang); w_j → 0 saat n_j kecil (percaya global). ICC = kompas kapan model ini perlu.",
    },
    {
      id: "konsep-slope",
      eyebrow: "Langkah 5 · Konsep",
      title: "Random slope & REML — Si Tukang Bedakan Kemiringan",
      prose: [
        "Definisi: random slope memperluas model: bukan hanya intersep yang boleh beda antar-cabang, kemiringan (slope) pun boleh. Modelnya y_ij = β_0 + β_1 x_ij + u_{0j} + u_{1j} x_ij + ε_ij — cabang j punya offset sendiri (u_{0j}) DAN kepekaan sendiri terhadap x (u_{1j}). Contoh kredit: x = limit kredit; di cabang perkotaan limit besar menaikkan risiko perlahan (slope landai), di cabang perbatasan limit besar menaikkan risiko tajam (slope curam) — satu slope global akan meratakan perbedaan penting ini. Random slope butuh cukup data per grup (aturan kasar: ≥ 10–20 observasi per grup) karena tiap grup kini mengestimasi 2 hal.",
        "REML vs ML — dua cara mengestimasi parameter variansi, dan pilihannya penting saat kamu membandingkan model. ML (maximum likelihood) mengestimasi β dan variansi sekaligus; ia bias ke bawah untuk variansi karena “lupa” bahwa β sendiri diestimasi dari data yang sama (derajat bebas hilang). REML (restricted ML) mengoreksi ini dengan mengestimasi variansi dari residual setelah β disingkirkan — estimasi σ_u², σ_ε² lebih jujur, terutama saat grup sedikit. Konsekuensinya: untuk MEMBANDINGKAN model (uji rasio likelihood, AIC), pakai ML — karena REML mengubah “data” yang di-likelihood-kan tiap model beda, sehingga likelihood antar-model tidak comparable. Untuk LAPORAN AKHIR variansi/standard error, pakai REML. Di statsmodels: `.fit()` default REML=True; set `reml=False` saat seleksi model.",
        "Kapan TIDAK memakai mixed effects: (1) grup sedikit (< 5) — σ_u² tidak terestimasi stabil, pakai fixed effects; (2) kamu hanya peduli grup yang ada, bukan populasi grup; (3) ICC ≈ 0 — lapisan tidak menambah informasi; (4) struktur grup tidak jelas/banyak level silang yang tidak termodelkan (misalnya debitur pindah cabang tiap bulan) — model yang salah struktur lebih berbahaya daripada OLS jujur yang mengakui keterbatasannya.",
      ],
      formula: String.raw`y_{ij} = \beta_0 + \beta_1 x_{ij} + u_{0j} + u_{1j} x_{ij} + \varepsilon_{ij}`,
      formulaNote: "u_{0j} = random intercept cabang j (offset); u_{1j} = random slope cabang j (kemiringan tambahan khusus cabang itu). Keduanya biasanya dimodelkan berkorelasi: cabang dengan baseline risiko tinggi mungkin juga lebih sensitif terhadap limit — statsmodels mengestimasi matriks kovarians 2×2 ini. Di formula: `sm.MixedLM.from_formula(\"y ~ x\", data, groups=..., re_formula=\"~x\")` — re_formula menyatakan efek acak mana yang boleh punya slope.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan model REML dengan AIC/likelihood ratio test. REML likelihood dari dua model dengan fixed effects berbeda dihitung dari “data” yang berbeda (residual terhadap X yang berbeda) — perbandingannya tidak valid. Prosedur yang benar: seleksi struktur fixed effects dengan ML (reml=False), lalu refit model final dengan REML untuk estimasi dan inferensi. Urutan ini tertulis di dokumentasi statsmodels MixedLM dan dilanggar lebih sering dari yang diakui.",
      },
      hints: [
        "💡 Intuisi random slope: tanya “apakah hubungan x→y masuk akal jika berbeda antar-grup?” Kalau limit→risiko jelas beda antara cabang kota dan cabang perbatasan, satu slope global adalah kebohongan yang rapi.",
        "💡 Intuisi REML: ML itu seperti mengukur variansi nilai ulangan sambil lupa bahwa rata-rata kelas juga ditebak dari ulangan yang sama — REML mengembalikan “biaya menebak rata-rata” itu ke perhitungan.",
      ],
      reference: "Seleksi model → ML. Estimasi final → REML. Random slope hanya bila tiap grup cukup data.",
    },
    {
      id: "lab-shrinkage",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Bangun mesin shrinkage",
      prose: [
        "Waktunya jadi analisnya. Data di bawah mensimulasikan 8 cabang × 25 debitur: skor risiko y = 10 + 2·x + u_j + ε, dengan u_j ~ Normal(0, 4²) sebagai “karakter cabang” dan ε ~ Normal(0, 3²) sebagai noise debitur. Tugasmu: hitung rata-rata mentah per cabang, grand mean, bobot susut w, lalu estimasi susut tiap cabang — dan ICC-nya.",
        "Coba: setelah lolos, ubah `n = 25` menjadi `n = 3` (cabang mungil) lalu `n = 200` (cabang raksasa). Pada n berapa bobot w turun di bawah 0,5 — artinya estimasi cabang lebih banyak “pinjaman” dari global daripada datanya sendiri? Itulah titik di mana ranking mentah menjadi berbahaya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ybar_j` = rata-rata skor per cabang (axis=1), lalu `ybar_j0 = float(ybar_j[0])`" },
        { id: "t2", text: "Hitung `ybar` = grand mean seluruh debitur" },
        { id: "t3", text: "Hitung bobot `w` = σu²/(σu² + σε²/n), lalu `mu_j` = w·ybar_j + (1−w)·ybar dan `mu_j0 = float(mu_j[0])`" },
        { id: "t4", text: "Hitung `icc` = σu²/(σu² + σε²) dan cetak ringkasannya" },
      ],
      requires: ["numpy"],
      expected: "Cabang 0: mentah=9.05 susut=9.06\nw=0.978\nicc=0.64",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(316)
J, n = 8, 25                 # 8 cabang, n debitur per cabang
beta0, beta1 = 10.0, 2.0
sigma_u, sigma_e = 4.0, 3.0  # simpangan baku antar-cabang & dalam-cabang
x = rng.normal(0, 1, (J, n))
u = rng.normal(0, sigma_u, (J, 1))   # karakter cabang (tak terlihat analis)
e = rng.normal(0, sigma_e, (J, n))   # noise debitur
y = beta0 + beta1 * x + u + e        # skor risiko

# TULIS KODEMU di bawah ini
ybar_j =
ybar_j0 =
ybar =
w =
mu_j =
mu_j0 =
icc =

print(f"Cabang 0: mentah={ybar_j[0]:.2f} susut={mu_j[0]:.2f}")
print(f"w={w:.3f}")
print(f"icc={icc:.2f}")`,
        lockLines: 10,
        solution: `import numpy as np
rng = np.random.default_rng(316)
J, n = 8, 25                 # 8 cabang, n debitur per cabang
beta0, beta1 = 10.0, 2.0
sigma_u, sigma_e = 4.0, 3.0  # simpangan baku antar-cabang & dalam-cabang
x = rng.normal(0, 1, (J, n))
u = rng.normal(0, sigma_u, (J, 1))   # karakter cabang (tak terlihat analis)
e = rng.normal(0, sigma_e, (J, n))   # noise debitur
y = beta0 + beta1 * x + u + e        # skor risiko

# TULIS KODEMU di bawah ini
ybar_j = y.mean(axis=1)
ybar_j0 = float(ybar_j[0])
ybar = y.mean()
w = sigma_u**2 / (sigma_u**2 + sigma_e**2 / n)
mu_j = w * ybar_j + (1 - w) * ybar
mu_j0 = float(mu_j[0])
icc = sigma_u**2 / (sigma_u**2 + sigma_e**2)

print(f"Cabang 0: mentah={ybar_j[0]:.2f} susut={mu_j[0]:.2f}")
print(f"w={w:.3f}")
print(f"icc={icc:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ybar_j0", value: 9.048, tol: 0.01, label: "`ybar_j[0]` ≈ 9,05", msg: "ybar_j = y.mean(axis=1); nilai cabang 0 harus 9,048." },
          { kind: "equal", task: "t2", name: "ybar", value: 9.8012, tol: 0.01, label: "`ybar` ≈ 9,80", msg: "ybar = y.mean() — grand mean seluruh debitur." },
          { kind: "equal", task: "t3", name: "w", value: 0.978, tol: 0.005, label: "`w` ≈ 0,978", msg: "w = 16/(16 + 9/25). Dengan n=25, data cabang dipercaya 97,8%." },
          { kind: "equal", task: "t3", name: "mu_j0", value: 9.0646, tol: 0.01, label: "`mu_j[0]` ≈ 9,06", msg: "mu_j = w*ybar_j + (1-w)*ybar — estimasi susut cabang 0." },
          { kind: "equal", task: "t4", name: "icc", value: 0.64, tol: 0.001, label: "`icc` = 0,64", msg: "icc = 16/(16+9) = 0,64: 64% variasi adalah beda antar-cabang." },
          { kind: "stdout_matches", task: "t4", pattern: "icc=0\\.64", label: "Ringkasan tercetak", msg: "Baris ringkasan harus mencetak icc=0.64." },
        ],
      },
      reference: "w → 1 saat n besar; w → 0 saat n kecil. Shrinkage = kompromi optimal, bukan kosmetik.",
      note: {
        title: "Intuisi: shrinkage adalah pajak atas klaim berani dari data kecil",
        body: "Lima heuristik. Satu: baca w sebagai “seberapa percaya aku pada grup ini” — w mendekati 1 berarti datanya cukup untuk berdiri sendiri, w mendekati 0 berarti grup ini hidup dari subsidi global; ranking cabang dengan w kecil pada dasarnya adalah ranking keberuntungan. Dua: ICC kecil bukan vonis “lapisan tidak penting” — ICC 0,02 pada 40 cabang tetap bisa membiaskan standard error ke bawah secara material; yang menentukan adalah kombinasi ICC dan ukuran grup. Tiga: random effect bukan fixed effect yang malas — ia membawa asumsi exchangeability, yaitu grup-grup dianggap sampel dari suatu populasi; bila grupmu adalah seluruh provinsi di Indonesia yang tidak bisa dianggap sampel acak, fixed effects lebih jujur. Empat: REML untuk membandingkan struktur random, ML untuk membandingkan struktur fixed — tertukar menghasilkan uji yang bias karena ML meremehkan variansi. Lima: shrinkage bukan kosmetik — ia adalah kompromi optimal antara bias dan variansi; cabang kecil yang “ditarik” ke tengah bukan dimanipulasi, melainkan dilindungi dari kebisingannya sendiri.",
      },
    },
    {
      id: "chart-shrink",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca plot caterpillar seperti reviewer model",
      prose: [
        "Chart di bawah memplot hasil lab-mu untuk 8 cabang: lingkaran kosong = rata-rata mentah, titik berisi = rata-rata susut, garis putus-putus = grand mean 9,8.",
        "Cara membaca: sumbu X = cabang (C1–C8); sumbu Y = skor risiko rata-rata; garis pendek penghubung = seberapa jauh estimasi “ditarik” dari angka mentah menuju garis grand mean. Tarikan selalu menuju garis — tidak pernah menjauhinya.",
        "Interpretasi: cabang ekstrem (C3 di bawah, C6–C7 di atas) mengalami tarikan paling terlihat — persis cabang-cabang yang ranking mentahnya paling “mencurigakan”. Dengan n=25 tarikannya kecil (w=0,978) karena tiap cabang sudah punya cukup data; inilah kenapa lab memintamu mencoba n=3 — di sana garis penghubungnya akan panjang dan dramatis. Pelajaran chart ini: ranking mentah selalu melebih-lebihkan perbedaan antar-grup kecil; plot caterpillar menunjukkan seberapa besar koreksinya.",
      ],
      figure: {
        svg: SHRINK_SVG,
        alt: "Plot caterpillar 8 cabang: rata-rata mentah (lingkaran kosong) dan rata-rata susut (titik berisi) dengan garis grand mean 9,8. Estimasi susut selalu tertarik menuju garis.",
        caption: "Rata-rata mentah vs susut, 8 cabang (data sintetis lab). Garis putus-putus = grand mean.",
      },
      tasks: [],
      reference: "Cabang ekstrem + data sedikit = tarikan terbesar. Selalu plot keduanya sebelum membuat ranking.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Hierarki atau bukan — lalu model apa?",
      prose: [
        "Empat skenario yang dihadapi analis setiap kali melihat kolom “grup” di dataset:",
        "Skenario 1 — ICC ≈ 0,02; 40 cabang; kamu hanya butuh efek limit→risiko secara umum. → OLS biasa cukup. Alasan: lapisan nyaris tidak membawa informasi; mixed model menambah kompleksitas tanpa mengurangi bias berarti. Tetap laporkan ICC sebagai bukti kamu sudah mengecek.",
        "Skenario 2 — ICC = 0,30; cabang 3–2.000 debitur; direksi minta ranking cabang. → Random intercept + laporkan estimasi SUSUT, bukan rata-rata mentah. Alasan: ranking mentah dimenangkan noise; shrinkage memberi ranking yang stabil dan bisa dipertahankan di depan auditor.",
        "Skenario 3 — Efek limit→risiko diduga beda arah antar-region (kota vs perbatasan); tiap grup ≥ 20 observasi. → Random slope (re_formula=\"~x\"). Alasan: satu slope global meratakan perbedaan yang justru ingin kamu temukan; uji apakah variansi slope signifikan sebelum menyederhanakan.",
        "Skenario 4 — Hanya 4 region dan kamu TIDAK peduli generalisasi ke region kelima; atau tiap grup punya > 500 observasi dan efek grup ingin diinterpretasi satu per satu. → Fixed effects (dummy per grup). Alasan: dengan sedikit grup, σ_u² tidak terestimasi dengan baik; dengan grup besar, penalti shrinkage tidak dibutuhkan dan dummy memberi interpretasi langsung.",
        "Aturan praktis 10 detik: ada kolom grup? → hitung ICC → < 0,05: OLS; ≥ 0,05: mixed → grup < 5 atau tak peduli grup baru: fixed; slope diduga beda antar-grup dan data cukup: random slope → seleksi model pakai ML, laporan final pakai REML.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai mixed model lalu melaporkan rata-rata mentah grup di dashboard. Model dan laporan harus konsisten: kalau keputusan memakai estimasi susut, dashboard pun menampilkan estimasi susut (dengan intervalnya). Menampilkan angka mentah setelah bersusah payah memodelkan shrinkage adalah pemborosan — dan menyesatkan pengguna yang mengira angka dashboard = angka keputusan.",
      },
      reference: "ICC → pilih model → ML untuk seleksi → REML untuk laporan → dashboard tampilkan estimasi susut.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Dua cabang, dua cerita",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank memiliki Cabang Merdeka (1.800 debitur, rata-rata tunggakan mentah 4,2%, grand mean nasional 3,0%) dan Cabang Pelita (12 debitur, rata-rata tunggakan mentah 0,8%). Model mixed effects bank mengestimasi σ_u = 1,1% dan σ_ε = 2,5% (dalam satuan poin persen). Tim bisnis mengusulkan: tutup perhatian khusus ke Merdeka (angka terburuk) dan jadikan Pelita percontohan nasional (angka terbaik).",
        "Pertanyaan analisis: (1) Hitung bobot susut w untuk tiap cabang dan estimasi susutnya. (2) Apakah rekomendasi tim bisnis tepat? (3) Apa yang harus dilaporkan ke direksi sebagai pengganti ranking mentah?",
        "Pembahasan: (1) Untuk Merdeka: w = 1,21/(1,21 + 6,25/1800) ≈ 0,997 → estimasi susut ≈ 0,997·4,2 + 0,003·3,0 ≈ 4,20% — nyaris tidak berubah, datanya sangat dipercaya. Untuk Pelita: w = 1,21/(1,21 + 6,25/12) = 1,21/1,73 ≈ 0,70 → estimasi susut ≈ 0,70·0,8 + 0,30·3,0 ≈ 1,46% — “keajaiban” 0,8% terkoreksi naik hampir dua kali lipat. (2) Separuh tepat: Merdeka memang bermasalah (4,2% dengan 1.800 debitur = sinyal kuat). Menjadikan Pelita percontohan nasional berbahaya: estimasi terbaiknya 1,46%, dan dengan 12 debitur, satu gagal bayar mengubah segalanya. (3) Laporkan estimasi susut beserta interval kepercayaannya, bukan ranking mentah — dan beri label “data belum cukup” untuk cabang di bawah ambang n tertentu.",
        "Catatan risiko: keputusan alokasi kolektor, bonus cabang, bahkan penutupan cabang bisa bergantung pada ranking ini. Ranking mentah yang dimenangkan 12 debitur bukan sekadar salah statistik — ia salah alokasi sumber daya nyata.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator (OJK/Basel) menilai konsistensi metodologi antar-unit. Metodologi ranking yang berubah-ubah mengikuti ukuran sampel — cabang kecil diperlakukan sama dengan cabang besar — sulit dipertahankan saat ditanya “kenapa cabang ini dapat penalti?”. Estimasi susut memberi jawaban yang sama untuk semua cabang: “ini tebakan terbaik kami dengan bukti yang ada, dan ini ketidakpastiannya.”",
      },
      reference: "Cabang kecil: w kecil → jangan jadikan juara. Cabang besar: w ≈ 1 → angkanya bisa dipercaya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Mixed effects = fixed effects (berlaku global) + random effects (offset acak per grup, u_j ~ N(0, σ_u²)) untuk data berlapis.",
        "Random intercept memakai SATU parameter variansi σ_u² untuk menertibkan semua grup — beda dari dummy per grup yang liar untuk grup kecil.",
        "Shrinkage μ̂_j = w_j·ȳ_j + (1−w_j)·ȳ: grup besar dipercaya (w→1), grup kecil ditarik ke global (w→0).",
        "ICC = σ_u²/(σ_u²+σ_ε²): kompas kapan model ini perlu (< 0,05 OLS cukup; besar → mixed).",
        "Random slope untuk kemiringan yang beda antar-grup; seleksi model pakai ML, estimasi final pakai REML.",
      ],
      quiz: [
        {
          q: "Bank punya data 2.000 debitur di 40 cabang. OLS biasa menghasilkan p-value sangat kecil untuk efek limit. Masalah utamanya?",
          options: [
            { text: "Debitur dalam satu cabang tidak independen — standard error OLS bias ke bawah sehingga keyakinan palsu", why: "Benar: pelanggaran asumsi i.i.d. membuat SE terlalu kecil dan p-value terlalu optimistis. Inilah alasan pertama memakai mixed model.", correct: true },
            { text: "OLS tidak bisa dipakai bila ada lebih dari 1.000 baris data", why: "Salah: jumlah baris bukan masalah OLS — struktur kekerabatan antarbarislah masalahnya." },
            { text: "OLS selalu salah bila datanya dari bank", why: "Salah: OLS sah-sah saja bila asumsi terpenuhi; yang salah adalah mengabaikan struktur berlapis." },
            { text: "Harus memakai logistic regression karena datanya debitur", why: "Salah: pilihan OLS vs logistic ditentukan oleh jenis respons (kontinu vs biner), bukan oleh siapa subjeknya." },
          ],
        },
        {
          q: "Cabang A: 5 debitur, rata-rata tunggakan 0%. Cabang B: 2.000 debitur, rata-rata 3%. Grand mean 2,8%. Menurut logika shrinkage, mana pernyataan benar?",
          options: [
            { text: "Estimasi terbaik cabang A ditarik kuat ke 2,8% (w kecil); cabang B nyaris tetap 3% (w ≈ 1)", why: "Benar: w = σ_u²/(σ_u²+σ_ε²/n) — n=5 membuat penyebut besar sehingga w kecil; n=2000 membuat w ≈ 1. Cabang 5-debitur tidak boleh dipercaya mentah-mentah.", correct: true },
            { text: "Cabang A memang terbaik dan layak jadi percontohan", why: "Salah: 0% dari 5 debitur adalah noise, bukan prestasi. Inilah jebakan yang dibahas di cerita pembuka." },
            { text: "Kedua cabang harus diperlakukan sama karena rumusnya sama", why: "Salah: rumusnya sama tetapi bobotnya beda — itulah inti shrinkage: perlakuan berbeda berdasarkan banyaknya bukti." },
            { text: "Shrinkage hanya berlaku untuk cabang di atas 100 debitur", why: "Salah: shrinkage berlaku untuk semua; justru cabang kecil yang paling terbantu." },
          ],
        },
        {
          q: "ICC = 0,02 pada data debitur per cabang. Keputusan yang paling tepat?",
          options: [
            { text: "OLS biasa kemungkinan cukup; lapisan cabang nyaris tidak menambah informasi", why: "Benar: hanya 2% variasi yang milik antar-cabang. Mixed model tidak akan mengubah kesimpulan berarti — laporkan ICC sebagai bukti pengecekan.", correct: true },
            { text: "Wajib mixed model karena datanya berlapis", why: "Salah: struktur berlapis saja tidak cukup — harus ada variansi antar-grup yang material. Aturan tanpa angka = kargo kultus." },
            { text: "Hapus kolom cabang dari dataset", why: "Salah: menghapus informasi tidak pernah jadi solusi; abaikan secara sadar boleh, hapus jangan." },
            { text: "Naikkan jumlah cabang sampai ICC naik", why: "Salah: ICC adalah sifat data, bukan target yang bisa dikejar dengan menambah sampel." },
          ],
        },
        {
          q: "Kapan memakai ML (bukan REML) dalam workflow mixed model?",
          options: [
            { text: "Saat membandingkan dua model (uji rasio likelihood/AIC) dengan fixed effects berbeda", why: "Benar: likelihood REML dari model berbeda tidak comparable karena dihitung dari residual terhadap X yang berbeda. Seleksi → ML; laporan final → REML.", correct: true },
            { text: "Selalu — REML sudah usang", why: "Salah: REML memberi estimasi variansi yang lebih jujur (mengkoreksi derajat bebas untuk β). Keduanya punya peran." },
            { text: "Hanya bila datanya di atas 1 juta baris", why: "Salah: pilihan ML vs REML soal tujuan (seleksi vs estimasi), bukan ukuran data." },
            { text: "Saat ingin standard error yang lebih kecil", why: "Salah: memilih estimator demi SE kecil adalah p-hacking. Pilih berdasarkan validitas prosedur." },
          ],
        },
        {
          q: "Analis menemukan efek limit→risiko positif di cabang kota tetapi negatif di cabang perbatasan. Model yang tepat?",
          options: [
            { text: "Random slope: kemiringan dibiarkan berbeda antar-cabang", why: "Benar: ini kasus klasik random slope — bukan hanya level (intercept) yang beda, tetapi hubungan x→y-nya. Syaratnya tiap grup cukup data.", correct: true },
            { text: "Random intercept sudah cukup", why: "Salah: random intercept hanya menggeser garis naik-turun, tidak mengubah kemiringannya. Slope yang beda arah tidak tertangkap." },
            { text: "OLS dengan satu slope global", why: "Salah: satu slope akan meratakan efek positif dan negatif menjadi “tidak ada efek” — kesimpulan yang salah total." },
            { text: "Pisahkan dataset dan buat 40 model terpisah", why: "Salah: model terpisah kehilangan shrinkage — cabang kecil kembali liar. Random slope = jalan tengah yang meminjam kekuatan antar-cabang." },
          ],
        },
      ],
    },
  ],
};
