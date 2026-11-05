import type { V2Lesson } from "../lib/types";

// ── Figure: spend TV (pulsing) vs adstock TV (carryover menghaluskan) ─────
const ADSTOCK_SVG = `<svg viewBox=\"0 0 560 320\" role=\"img\" aria-label=\"Grafik garis belanja TV berdenyut vs adstock TV yang menghaluskan\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"60\" y1=\"260\" x2=\"530\" y2=\"260\"/><line x1=\"60\" y1=\"210\" x2=\"530\" y2=\"210\"/>
<line x1=\"60\" y1=\"160\" x2=\"530\" y2=\"160\"/><line x1=\"60\" y1=\"110\" x2=\"530\" y2=\"110\"/>
<line x1=\"60\" y1=\"60\" x2=\"530\" y2=\"60\"/>
</g>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"end\">
<text x=\"54\" y=\"263\">0</text><text x=\"54\" y=\"213\">80</text><text x=\"54\" y=\"163\">160</text>
<text x=\"54\" y=\"113\">240</text><text x=\"54\" y=\"63\">320</text>
</g>
<polyline points=\"70,135 109,223 148,135 187,223 226,135 265,223 304,135 343,223 382,135 421,223 460,135 499,223\" fill=\"none\" stroke=\"var(--chart-text)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/>
<polyline points=\"70,135 109,173 148,110 187,160 226,104 265,154 304,101 343,152 382,100 421,151 460,99 499,150\" fill=\"none\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<g font-size=\"11\" font-family=\"var(--font-ui)\">
<line x1=\"70\" y1=\"286\" x2=\"96\" y2=\"286\" stroke=\"var(--chart-text)\" stroke-width=\"2\" stroke-dasharray=\"6 4\"/>
<text x=\"102\" y=\"290\" fill=\"var(--text)\">belanja TV mingguan (berdenyut 200/60)</text>
<line x1=\"330\" y1=\"286\" x2=\"356\" y2=\"286\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<text x=\"362\" y=\"290\" fill=\"var(--text)\">adstock TV, λ=0,5</text>
</g>
<g fill=\"var(--text-muted)\" font-size=\"10\" font-family=\"var(--font-ui)\">
<text x=\"60\" y=\"20\">Rp juta</text><text x=\"430\" y=\"310\">data sintetis lab</text>
</g>
</svg>`;

export const a321: V2Lesson = {
  slug: "a321-marketing-mix-modeling",
  track: "Statistika",
  module: "Modeling Lanjutan",
  title: "A321 — Marketing Mix Modeling: Mengurai Kontribusi Kanal",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kemenangan digital yang mencuri kredit TV",
      prose: [
        "Brand FMCG 'Sari Rasa' memakai last-click attribution: setiap penjualan dikreditkan 100% ke klik terakhir sebelum checkout. Hasilnya tampak jelas: ROI iklan digital 4,2 vs ROI iklan TV 1,1. Keputusan direksi: potong budget TV 70%, alihkan ke digital. Kuartal berikutnya, penjualan turun 12%. Tim digital dituduh tidak becus; tim TV berkata 'sudah kami bilang'. Keduanya salah membaca masalahnya.",
        "Twist-nya terungkap dari data search: setiap kali iklan TV tayang, pencarian 'sari rasa beli dimana' melonjak — dan 60% pencarian itu diklik lewat... iklan digital (search ads). Last-click memberi seluruh kredit ke klik search, NOL ke TV yang memicu pencarian itu. TV bukan pecundang ber-ROI 1,1; ia adalah pemicu yang jasanya dicuri. Atribusi klik-terakhir menghukum kanal pemicu (TV, display) dan memberi medali ke kanal pemanen (search, marketplace).",
        "Lesson ini tentang Marketing Mix Modeling (MMM): regresi deret waktu yang mengurai penjualan menjadi kontribusi tiap kanal — dengan dua transformasi kunci: adstock (efek iklan menggema ke minggu-minggu berikut, tidak habis minggu ini) dan saturasi (jutaan rupiah ke-100 tidak seampuh jutaan pertama). Ditambah jebakan terbesarnya: multikolinearitas — dua kanal yang selalu bergerak bersama membuat koefisien tak teridentifikasi.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Salah atribusi = salah alokasi modal — dan itu risiko. Memotong kanal pemicu karena 'ROI rendah' seperti mencabut fondasi karena tidak terlihat dari luar: bangunan (penjualan) runtuh belakangan. MMM adalah alat risk management untuk budget marketing: ia menjawab 'apa yang terjadi pada penjualan bila kanal X dipotong?', bukan 'siapa dapat kredit?'.",
      },
      reference: "Last-click menghukum pemicu, memuja pemanen. MMM = regresi kontribusi dengan adstock + saturasi.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kenapa last-click attribution bias dan kapan ia berbahaya; (2) menerapkan transformasi adstock dan menjelaskan half-life-nya; (3) menjelaskan saturasi (diminishing returns) via fungsi Hill; (4) menjalankan regresi MMM via normal equation dan menghitung kontribusi per kanal; (5) mendiagnosis multikolinearitas dan menjelaskan kapan MMM tidak bisa menjawab.",
        "Rutenya: cerita, bekal ringkas, dua konsep (adstock & saturasi; regresi & kontribusi), lab Pyodide (mesin MMM), chart adstock dengan panduan baca, peta keputusan, mini-case pemotongan budget, kuis, rangkuman. Estimasi 60 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, regresi linear: y = Xβ + ε; solusi OLS β̂ = (XᵀX)⁻¹Xᵀy — meminimalkan jumlah kuadrat residual. Kedua, deret waktu: observasi berurutan (mingguan) dengan memori — nilai minggu ini dipengaruhi minggu lalu. Ketiga, korelasi: dua variabel yang selalu bergerak bersama (korelasi ≈ 1) membuat regresi tidak bisa memisahkan efek masing-masing.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: MMM menjawab pertanyaan CFO ('ke mana perginya Rp2,4 miliar budgetku?'), bukan pertanyaan analis klik ('iklan mana diklik terakhir?'). Beda pertanyaan, beda matematika.",
      ],
      reference: "Bekal: (1) OLS via normal equation; (2) memori deret waktu; (3) korelasi tinggi = efek tak terpisahkan.",
    },
    {
      id: "konsep-adstock",
      eyebrow: "Langkah 3 · Konsep",
      title: "Adstock & Saturasi — Si Gema dan Si Atap Kaca",
      prose: [
        "Definisi adstock: efek iklan tidak habis minggu ia tayang — ia menggema. A_t = x_t + λ·A_{t−1}: adstock minggu ini = belanja minggu ini + λ kali adstock minggu lalu. λ (0–1) = daya ingat: λ = 0 berarti tanpa memori (efek habis minggu ini juga), λ = 0,9 berarti gema panjang. Half-life = ln(0,5)/ln(λ): untuk λ = 0,5, separuh efek hilang tiap 1 minggu. Kampanye pulsing (200, 60, 200, 60...) dengan λ = 0,5 tidak pernah jatuh ke 60 — adstock-nya berayun di 160–306: gema minggu besar menutupi minggu kecil.",
        "Definisi saturasi: jutaan pertama lebih ampuh daripada jutaan ke-100 — diminishing returns. Fungsi Hill: S(x) = x^α/(x^α + K^α); α mengontrol kecuraman (α besar = atap kaca tiba-tiba), K = titik tengah (belanja di mana respons mencapai setengah maksimum). Tanpa saturasi, model menyarankan 'belanjakan tak hingga' — saran yang hanya benar di spreadsheet.",
        "Kepribadiannya: adstock seperti gema di aula — teriakan minggu lalu masih terdengar samar minggu ini. Saturasi seperti mengisi gelas — tetes pertama menaikkan permukaan banyak, tetes ke-1000 meluber sia-sia. Keduanya adalah cara statistik mengatakan 'iklan itu seperti manusia: punya ingatan dan punya batas kenyang'. Kapan memakai: (1) kanal dengan efek tunda (TV, OOH, influencer); (2) spend bervariasi cukup untuk mengestimasi kurva. Kapan tidak: search ads murni respons langsung (λ ≈ 0) — memaksakan adstock di sana hanya menambah noise.",
      ],
      formula: String.raw`A_t = x_t + \lambda\cdot A_{t-1}, \qquad S(x) = \frac{x^\alpha}{x^\alpha + K^\alpha}`,
      formulaNote: "A_t = adstock minggu t; x_t = belanja minggu t; λ = carryover (0–1); half-life = ln(0,5)/ln(λ) — untuk λ = 0,5, half-life = 1 minggu. S(x) = respons jenuh; α = kecuraman; K = belanja titik-tengah. Contoh lab: TV minggu ke-3 = 200, adstock minggu ke-2 = 160 → A_3 = 200 + 0,5×160 = 280.",
      tasks: [],
      note: {
        title: "🚨 Mitos: efek iklan habis di minggu yang sama",
        type: "pitfall",
        body: "Yang benar: untuk TV/OOH, 30–60% efek terjadi SETELAH minggu tayang (carryover). Model tanpa adstock meremehkan kanal pemicu secara sistematis — dan inilah salah satu alasan TV selalu 'kalah' di dashboard last-click: separuh jasanya terjadi minggu depan, di luar jendela atribusi. Selalu estimasi λ dari data (atau literatur kategori), jangan asumsikan nol.",
      },
      hints: [
        "💡 Intuisi: λ adalah 'daya ingat' kategori. FMCG impulsif: λ kecil (orang lupa cepat). Otomotif/properti: λ besar (orang menimbang berbulan-bulan). Salah λ = salah memori = salah kredit.",
        "💡 Intuisi: saturasi menjelaskan kenapa 'scale up yang menang' sering gagal — kanal yang jenuh tidak butuh lebih banyak uang, ia butuh istirahat (pulsing) atau kreatif baru.",
      ],
      reference: "Adstock = memori (λ, half-life). Saturasi = atap kaca (Hill: α, K). Tanpa keduanya, MMM buta.",
    },
    {
      id: "konsep-regresi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Regresi MMM — Si Akuntan Kanal",
      prose: [
        "Definisi: setelah transformasi, MMM adalah regresi linear: y_t = β_0 + Σ_k β_k·f_k(x_{k,t}) + ε, dengan f_k = adstock lalu saturasi. β_0 = basis (penjualan tanpa iklan — brand equity, distribusi). β_k = respons marginal kanal k: tiap Rp1 juta adstock tersaturasi menambah β_k juta penjualan. Kontribusi kanal k = β_k·Σf_k / Σy — pangsa penjualan yang 'dijelaskan' kanal itu. Inilah angka yang menjawab CFO.",
        "Kepribadiannya: regresi MMM seperti akuntan forensik — ia tidak percaya pengakuan (klaim atribusi tiap kanal), ia merekonstruksi dari jejak uang: kapan belanja naik, kapan penjualan ikut naik (dengan jeda adstock). Syaratnya: jejak itu harus BERVARIASI. Bila TV dan digital selalu naik-turun bersamaan (korelasi 0,99), akuntan ini angkat tangan — ia tidak bisa membedakan siapa menyebabkan apa. Itulah multikolinearitas: bukan masalah kecil, melainkan vonis 'data ini tidak bisa menjawab pertanyaanmu'.",
        "Kapan memakai: (1) data mingguan ≥ 1–2 tahun dengan variasi spend yang cukup (kampanye pulsing, hiatus, eksperimen); (2) tujuan = alokasi budget strategis. Kapan tidak: (1) spend datar terus (tak teridentifikasi); (2) butuh jawaban taktis mingguan (pakai eksperimen); (3) hanya ada data 3 bulan — MMM butuh musim penuh untuk memisahkan musiman dari efek iklan.",
      ],
      formula: String.raw`y_t = \beta_0 + \sum_k \beta_k\,f_k(x_{k,t}) + \varepsilon_t, \qquad \text{kontribusi}_k = \frac{\beta_k\sum_t f_k(x_{k,t})}{\sum_t y_t}`,
      formulaNote: "y_t = penjualan minggu t; β_0 = basis (tanpa iklan); β_k = respons marginal kanal k; f_k = transformasi adstock+saturasi; ε = noise. Kontribusi = pangsa penjualan yang dijelaskan kanal. Contoh lab: β_TV = 3,13 → tiap Rp1 juta adstock TV ≈ Rp3,13 juta penjualan; kontribusi TV = 3,13×Σadstock_TV/Σy ≈ 0,473 (47,3%).",
      tasks: [],
      note: {
        title: "🚨 Mitos: R² 0,99 berarti model MMM benar",
        type: "pitfall",
        body: "Yang benar: R² tinggi hanya berarti model MENJELASKAN pola masa lalu — bukan bahwa ia tahu PENYEBABNYA. Dua kanal yang selalu bergerak bersama memberi R² 0,99 dengan koefisien ngawur (TV 2,2 padahal sebenarnya 3,0; digital 3,5 padahal 2,0 — persis yang terjadi bila kamu menjalankan regresi pada data berkorelasi 0,99). Validasi MMM = stabilitas koefisien saat data digeser + konsistensi dengan eksperimen, bukan R².",
      },
      hints: [
        "💡 Intuisi: kontribusi (rata-rata) ≠ respons marginal (turunan). Kanal dengan kontribusi 47% bisa jadi sudah jenuh — rupiah BERIKUTNYA lebih baik ke kanal lain. Keputusan realokasi butuh kurva respons, bukan satu angka kontribusi.",
        "💡 Intuisi: multikolinearitas adalah cara data berkata 'beri aku variasi'. Solusinya bukan statistik yang lebih pintar, melainkan DESAIN: variasikan spend (pulsing, hiatus, geo-experiment) agar kanal-kanal berhenti bergerak beriringan.",
      ],
      reference: "β_k = respons marginal; kontribusi = pangsa penjualan. Korelasi antar-kanal ≈ 1 = tak teridentifikasi.",
    },
    {
      id: "lab-mmm",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin MMM mini",
      prose: [
        "Waktunya jadi modeler media. Data di bawah: 12 minggu belanja TV (kampanye pulsing 200/60) dan digital (stabil), plus penjualan mingguan. Perhatikan: TV SENGAJA dibuat berdenyut — itulah variasi yang membuat koefisien teridentifikasi. Tugasmu: terapkan adstock (λ = 0,5), selesaikan β via normal equation, hitung kontribusi tiap kanal, dan cek korelasi antar-kanal sebagai diagnostik.",
        "Coba: setelah lolos, ubah TV menjadi [150]*12 (datar) dan jalankan ulang — lihat apa yang terjadi pada β_TV dan korelasinya. Itulah multikolinearitas yang sesungguhnya: tanpa variasi, regresi menebak — dan tebakannya bisa terbalik (digital terlihat lebih ampuh dari TV padahal sebaliknya).",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `adstock(x, lam)`, hitung `ATV = adstock(TV)` dan `ADG = adstock(DG)`" },
        { id: "t2", text: "Susun `X` (kolom: 1, ATV, ADG), selesaikan `beta` via normal equation, uraikan `b0, bTV, bDG = beta`" },
        { id: "t3", text: "Hitung kontribusi tiap kanal (`kTV`, `kDG`, `kB`) = beta × jumlah adstock ÷ jumlah y, lalu cetak" },
        { id: "t4", text: "Hitung `korel` = korelasi ATV vs ADG (diagnostik multikolinearitas), lalu cetak" },
      ],
      requires: ["numpy"],
      expected: "adstock_TV_m3=280.0\nbeta_TV=3.13 beta_DG=2.12 beta_0=437.7\nkontribusi TV=0.473 Digital=0.254 Basis=0.273\nkorelasi_kanal=0.46",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(321)
# Belanja iklan mingguan (Rp juta). JANGAN UBAH.
TV = np.array([200,60,200,60,200,60,200,60,200,60,200,60], float)  # kampanye pulsing
DG = np.array([100,110,90,120,95,105,115,85,125,100,110,95], float)  # digital stabil
# Penjualan mingguan (Rp juta, data sintetis mengikuti model adstock). JANGAN UBAH.
y = np.array([1283.3,1310.5,1643.5,1472.8,1784.3,1534.2,1860.0,1502.5,1903.9,1539.3,1867.1,1543.6])

# TULIS KODEMU di bawah ini
def adstock(x, lam=0.5):
    out =
    return out

ATV =
ADG =
beta =`,
        lockLines: 10,
        solution: `import numpy as np
rng = np.random.default_rng(321)
# Belanja iklan mingguan (Rp juta). JANGAN UBAH.
TV = np.array([200,60,200,60,200,60,200,60,200,60,200,60], float)  # kampanye pulsing
DG = np.array([100,110,90,120,95,105,115,85,125,100,110,95], float)  # digital stabil
# Penjualan mingguan (Rp juta, data sintetis mengikuti model adstock). JANGAN UBAH.
y = np.array([1283.3,1310.5,1643.5,1472.8,1784.3,1534.2,1860.0,1502.5,1903.9,1539.3,1867.1,1543.6])

# TULIS KODEMU di bawah ini
def adstock(x, lam=0.5):
    out = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = v + lam * acc
        out[i] = acc
    return out

ATV = adstock(TV)
ADG = adstock(DG)
X = np.column_stack([np.ones(12), ATV, ADG])
beta = np.linalg.solve(X.T @ X, X.T @ y)
b0, bTV, bDG = beta
kTV = bTV * ATV.sum() / y.sum()
kDG = bDG * ADG.sum() / y.sum()
kB = b0 * 12 / y.sum()
korel = float(np.corrcoef(ATV, ADG)[0, 1])
print(f"adstock_TV_m3={ATV[2]:.1f}")
print(f"beta_TV={bTV:.2f} beta_DG={bDG:.2f} beta_0={b0:.1f}")
print(f"kontribusi TV={kTV:.3f} Digital={kDG:.3f} Basis={kB:.3f}")
print(f"korelasi_kanal={korel:.2f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "adstock_TV_m3=280\\.0", label: "Adstock benar (minggu ke-3 = 280)", msg: "A_3 = 200 + 0,5 × 160 = 280. Gema minggu ke-2 (160) masih terasa." },
          { kind: "equal", task: "t2", name: "bTV", value: 3.1349, tol: 0.01, label: "β_TV ≈ 3,13", msg: "Tiap Rp1 juta adstock TV ≈ Rp3,13 juta penjualan (normal equation)." },
          { kind: "equal", task: "t2", name: "bDG", value: 2.1245, tol: 0.01, label: "β_DG ≈ 2,12", msg: "Respons marginal digital lebih kecil dari TV pada data ini." },
          { kind: "stdout_matches", task: "t3", pattern: "kontribusi TV=0\\.473 Digital=0\\.254 Basis=0\\.273", label: "Kontribusi per kanal tercetak", msg: "TV 47,3% > digital 25,4% — kebalikan dari klaim last-click." },
          { kind: "equal", task: "t4", name: "korel", value: 0.4595, tol: 0.01, label: "Korelasi kanal = 0,46 (sehat)", msg: "Korelasi moderat = koefisien teridentifikasi. Di atas ~0,9 = waspada." },
        ],
      },
      reference: "Adstock dulu, regresi kemudian, kontribusi terakhir. Korelasi antar-kanal = cek kesehatan.",
    },
    {
      id: "chart-adstock",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca gema iklan seperti modeler media",
      prose: [
        "Chart di bawah: garis putus-putus = belanja TV mingguan (berdenyut 200/60), garis solid = adstock TV dengan λ = 0,5.",
        "Cara membaca: sumbu X = minggu 1–12, sumbu Y = Rp juta. Garis putus-putus melompat ekstrem tiap minggu; garis solid berayun halus di kisaran 160–306 — tidak pernah menyentuh 60.",
        "Interpretasi: pada minggu-minggu 'kecil' (belanja 60), adstock tetap di atas 200 — gema dari minggu besar sebelumnya menutupi kekosongan. Inilah kenapa kampanye pulsing bekerja: kamu membayar 60 tetapi menikmati efek ~210. Model tanpa adstock akan mengira minggu kecil = efek kecil, lalu menyimpulkan TV 'tidak konsisten' — padahal yang tidak konsisten adalah belanjanya, bukan efeknya. Keputusan: jangan menilai kanal pemicu dari grafik belanja-vs-penjualan mentah; transformasi dulu, baru nilai.",
      ],
      figure: {
        svg: ADSTOCK_SVG,
        alt: "Grafik garis: belanja TV berdenyut 200/60 vs adstock yang menghaluskan di kisaran 160-306.",
        caption: "Belanja berdenyut, efek menghalus — adstock menangkap memori iklan.",
      },
      tasks: [],
      note: {
        title: "Intuisi: chart ini menjelaskan kenapa TV selalu kalah di dashboard",
        body: "Dashboard last-click membandingkan belanja minggu ini vs penjualan minggu ini — ia mengasumsikan λ = 0. Untuk TV dengan λ = 0,5, separuh efek minggu ini datang dari belanja minggu LALU, dan separuh belanja minggu ini baru terasa minggu DEPAN. Tiga heuristik. Pertama: semakin besar λ kategorimu, semakin tidak adil jendela atribusi pendek terhadap kanal pemicu. Kedua: pulsing adalah desain eksperimen gratis — variasinya membuat koefisien teridentifikasi (lihat lab: korelasi 0,46, bukan 0,99). Ketiga: bila chart adstock-mu hampir identik dengan chart belanja (λ kecil), kanal itu memang respons-langsung — jangan paksakan memori yang tidak ada.",
      },
      reference: "Gema = efek minggu lalu yang masih hidup. Pulsing = variasi gratis untuk identifikasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "MMM, eksperimen, atau atribusi klik — kapan memakai apa?",
      prose: [
        "Lima skenario pemilihan alat ukur marketing:",
        "Skenario 1 — Alokasi budget tahunan antar-kanal (TV vs digital vs OOH). → MMM. Alasan: satu-satunya alat yang mengurai kontribusi jangka menengah-panjang dengan memori dan saturasi.",
        "Skenario 2 — Mengukur dampak inkremental kampanye spesifik ('apakah promo 11.11 benar-benar menambah penjualan?'). → Geo-experiment (matikan kanal di beberapa kota, bandingkan). Alasan: kausalitas butuh kontrol; MMM observasional selalu bisa dikalahkan confounder.",
        "Skenario 3 — Optimasi taktis harian (bid, budget harian search). → Atribusi klik / MTA. Alasan: butuh umpan balik cepat; bias last-click bisa diterima untuk keputusan kecil yang reversible.",
        "Skenario 4 — Kanal baru tanpa histori (TikTok Shop pertama kali). → Eksperimen kecil dulu, JANGAN MMM. Alasan: tanpa variasi histori, MMM tidak punya apa-apa untuk diestimasi — koefisiennya fiksi.",
        "Skenario 5 — Data < 1 tahun atau spend datar terus. → Jangan MMM (belum). Alasan: musiman tak terpisahkan dari efek iklan; spend datar = tak teridentifikasi. Kumpulkan dulu: variasikan spend (pulsing/hiatus) minimal setahun.",
        "Aturan praktis 10 detik: budget tahunan → MMM; kausalitas kampanye → geo-experiment; taktis harian → atribusi klik; kanal baru → eksperimen dulu; data < setahun / spend datar → tunda MMM.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memakai MMM untuk membenarkan budget yang sudah diputuskan",
        type: "pitfall",
        body: "MMM yang dijalankan SETELAH keputusan budget ('tolong buatkan model yang menunjukkan TV penting') bukan analisis — itu dekorasi. Model yang jujur kadang menjawab 'datamu tidak bisa menjawab ini' (korelasi 0,99, spend datar). Analis yang baik menyampaikan vonis itu; analis yang buruk mengutak-atik λ sampai jawabannya enak didengar.",
      },
      reference: "MMM = strategis. Eksperimen = kausal. Klik = taktis. Data miskin = jangan model.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "CFO bertanya: potong TV 50%?",
      prose: [
        "Skenario (sintetis, untuk latihan): Sari Rasa belanja iklan Rp2,4 miliar/tahun: TV Rp1,6 M, digital Rp0,8 M. Penjualan tahunan Rp19 M. MMM (seperti lab-mu, skala tahunan): kontribusi TV 47% (≈ Rp9,0 M), digital 25% (≈ Rp4,8 M), basis 27% (≈ Rp5,2 M). CFO mengusulkan: 'TV kan mahal — potong 50% (hemat Rp800 jt), toh digital ROI-nya lebih tinggi.'",
        "Pertanyaan analisis: (1) Dengan β_TV ≈ 3,1 (per Rp1 juta adstock), berapa perkiraan penurunan penjualan bila adstock TV turun ~40%? (2) Apa yang hilang dari perhitungan CFO? (3) Keputusan yang benar?",
        "Pembahasan: (1) Kontribusi TV ≈ Rp9,0 M; turun 40% → hilang ≈ Rp3,6 M penjualan untuk menghemat Rp800 jt — rasio 4,5:1 yang buruk. (Perhitungan kasar linear; saturasi membuat angka pastinya perlu kurva, tetapi arahnya jelas.) (2) Yang hilang: efek halo — TV memicu pencarian brand yang diklik via digital; memotong TV juga memotong 'panen' digital (kontribusi digital 25% sebagian adalah jasa TV yang tidak tercatat). Dan basis 28% bukan konstanta abadi — brand equity terkikis bila pemicu dihentikan bertahun-tahun. (3) Jangan potong 50% sekaligus. Jalankan geo-experiment: potong TV 50% di 3 kota, pertahankan di 3 kota kontrol, ukur 8 minggu — biarkan data kausal yang menjawab, bukan model observasional sendirian.",
        "Catatan desain: angka kontribusi adalah RATA-RATA (average), sedangkan keputusan potong/tambah butuh MARGINAL (turunan di titik sekarang). Kanal dengan kontribusi 47% bisa jadi sudah jenuh di margin — selalu baca kurva respons Hill sebelum realokasi, bukan satu angka kontribusi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini adalah credit-limit problem dalam kostum marketing: memotong 'eksposur' (budget TV) yang terlihat mahal tanpa mengukur kontribusi tak-terlihatnya (halo effect) = seperti menarik limit nasabah yang 'tidak pernah dipakai' — lalu kaget ketika ia pindah ke kompetitor dan NPL portofolio naik. Setiap pemotongan butuh analisis kontribusi PENUH, bukan rasio parsial.",
      },
      reference: "Kontribusi rata-rata ≠ respons marginal. Potong bertahap + geo-experiment, bukan tebas 50%.",
    },
    {
      id: "pendalaman-bayes-geo",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Bayesian MMM, kalibrasi geo-experiment & creative wear-out",
      prose: [
        "Tiga pendalaman untuk praktisi. Pertama, Bayesian MMM: alih-alih satu angka β, estimasi DISTRIBUSI posterior — 'β_TV antara 2,4 dan 3,8 dengan probabilitas 90%'. Prior bisa dimasukkan dari literatur (carryover TV FMCG biasanya 0,3–0,6) — berguna saat data sedikit. Keputusan di bawah ketidakpastian (potong vs tahan) menjadi eksplisit: berapa probabilitas keputusan ini salah?",
        "Kedua, kalibrasi dengan geo-experiment: MMM observasional dikalibrasi dengan 1–2 eksperimen geografis per tahun. Hasil eksperimen menjadi 'jangkar' — bila MMM bilang TV 47% tetapi eksperimen bilang 30%, percayai eksperimen untuk level, MMM untuk tren. Praktik industri (Google LightweightMMM, Meta Robyn) memang dirancang untuk alur ini.",
        "Ketiga, creative wear-out: β_k bukan konstanta abadi — materi iklan yang sama melemah seiring waktu (fatigue). Model lanjut memakai β_k(t) yang meluruh, atau memasukkan variabel 'umur kreatif'. Pelajaran umumnya: parameter marketing punya umur simpan; model yang tidak di-refresh tiap kuartal adalah fosil yang masih dipakai rapat.",
      ],
      formula: String.raw`p(\beta \mid \text{data}) \propto p(\text{data} \mid \beta)\cdot p(\beta)`,
      formulaNote: "Teorema Bayes untuk MMM: posterior keyakinan tentang β = likelihood data × prior. Prior = pengetahuan sebelum data (mis. λ TV 0,3–0,6 dari literatur). Dengan data sedikit, prior menstabilkan estimasi; dengan data banyak, data mendominasi. Inilah cara formal 'menggabungkan pengalaman industri dengan datamu'.",
      tasks: [],
      reference: "Posterior > titik. Eksperimen = jangkar kalibrasi. Parameter marketing kedaluwarsa tiap kuartal.",
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
        "Last-click attribution bias: menghukum kanal pemicu (TV), memuja kanal pemanen (search) — bahaya untuk keputusan budget.",
        "Adstock A_t = x_t + λ·A_{t−1} menangkap memori iklan; half-life = ln(0,5)/ln(λ). Saturasi Hill menangkap diminishing returns.",
        "MMM: y_t = β_0 + Σβ_k·f_k(x_{k,t}) + ε; kontribusi_k = β_k·Σf_k/Σy — menjawab CFO, bukan analis klik.",
        "Multikolinearitas (korelasi antar-kanal ≈ 1) membuat koefisien tak teridentifikasi — solusinya variasi spend via desain, bukan statistik lebih pintar.",
        "Kontribusi rata-rata ≠ respons marginal; validasi = stabilitas + eksperimen, bukan R².",
      ],
      quiz: [
        {
          q: "Belanja TV minggu ini Rp200 juta, adstock minggu lalu 160, λ = 0,5. Adstock minggu ini?",
          options: [
            { text: "280 — dari 200 + 0,5 × 160", why: "Benar: A_t = x_t + λ·A_{t−1} = 200 + 80 = 280. Persis angka lab minggu ke-3.", correct: true },
            { text: "360 — dari 200 + 160", why: "Salah: lupa mengalikan λ — itu sama dengan mengasumsikan λ = 1 (ingatan sempurna, tidak pernah).", correct: false },
            { text: "200 — hanya belanja minggu ini yang dihitung", why: "Salah: itu λ = 0 (tanpa memori) — asumsi last-click yang justru dikritik lesson ini." },
            { text: "230 — rata-rata keduanya", why: "Salah: adstock bukan rata-rata; ia akumulasi bergema." },
          ],
        },
        {
          q: "MMM lab: kontribusi TV 47,3%, digital 25,4%. CFO menyimpulkan 'TV dua kali lebih penting, gandakan budget TV'. Masalah?",
          options: [
            { text: "Tidak ada — ikuti angka", why: "Salah: kontribusi adalah RATA-RATA historis, bukan respons MARGINAL. Menggandakan budget TV bisa jadi mendorongnya ke zona jenuh (Hill).", correct: false },
            { text: "Kontribusi rata-rata ≠ respons marginal — keputusan tambah/kurang butuh kurva respons (saturasi), bukan satu angka pangsa", why: "Benar: inilah beda akuntan vs manajer. Akuntan melaporkan kemarin; manajer memutuskan besok — dan besok ditentukan turunan, bukan rata-rata.", correct: true },
            { text: "Angkanya pasti salah karena digital ROI lebih tinggi", why: "Salah: ROI last-click vs kontribusi MMM mengukur hal berbeda; 'pasti salah' tanpa argumen bukan analisis." },
            { text: "Sampel 12 minggu terlalu sedikit sehingga semua angka sampah", why: "Salah: 12 minggu sintetis memang mainan, tetapi prinsipnya sah — dan vonis 'sampah' membuang pelajaran bersama datanya." },
          ],
        },
        {
          q: "Dua kanal selalu naik-turun bersamaan (korelasi 0,99). Regresi memberi β_TV = 2,2 dan β_digital = 3,5. Penilaian?",
          options: [
            { text: "Digital memang lebih ampuh — ikuti koefisien", why: "Salah: dengan korelasi 0,99, koefisien TIDAK TERIDENTIFIKASI — angka-angkanya adalah artefak noise, bisa terbalik minggu depan.", correct: false },
            { text: "Koefisien tidak bisa dipercaya — variasikan spend (pulsing/hiatus/geo-experiment) agar kanal berhenti bergerak beriringan", why: "Benar: solusinya DESAIN, bukan statistik. Tanpa variasi independen, tidak ada matematika yang bisa memisahkan efeknya.", correct: true },
            { text: "Naikkan regularisasi (ridge) sampai angkanya masuk akal", why: "Salah: ridge menstabilkan angka tetapi tidak menciptakan informasi yang tidak ada — 'masuk akal' ≠ benar." },
            { text: "Buang salah satu kanal dari model", why: "Salah: membuang kanal = mengasumsikan kontribusinya nol — asumsi yang lebih kuat (dan lebih salah) daripada mengakui ketidakpastian." },
          ],
        },
        {
          q: "Model MMM mencapai R² = 0,99. Apakah model pasti benar?",
          options: [
            { text: "Ya — 99% variansi dijelaskan", why: "Salah: R² = fit masa lalu, bukan kebenaran kausal. Model dengan koefisien terbalik pun bisa R² 0,99 (lihatjebakan multikolinearitas).", correct: false },
            { text: "Belum tentu — validasi = stabilitas koefisien + konsistensi dengan eksperimen, bukan R²", why: "Benar: R² tinggi dengan data observasional adalah syarat perlu, bukan cukup. Tanya: apakah β stabil bila 3 bulan terakhir dibuang? Apakah sejalan dengan geo-experiment?", correct: true },
            { text: "Ya, bila residualnya normal", why: "Salah: residual normal = asumsi inferensi terpenuhi, bukan bukti kausalitas." },
            { text: "Tidak — R² tidak pernah informatif", why: "Salah: R² informatif sebagai cek kewarasan (R² 0,2 = modelmu melewatkan sesuatu yang besar); ia hanya bukan vonis kebenaran." },
          ],
        },
        {
          q: "Fungsi Hill S(x) = x^α/(x^α + K^α): apa peran α dan K?",
          options: [
            { text: "α = kecuraman transisi menuju jenuh; K = titik tengah (respons = setengah maksimum)", why: "Benar: α besar → atap kaca tiba-tiba; K menggeser kurva kanan-kiri. Keduanya diestimasi dari data, bukan ditebak.", correct: true },
            { text: "α = budget maksimum; K = konstanta normalisasi", why: "Salah: tidak ada 'budget maksimum' dalam Hill — saturasi itu asimtotik, bukan dinding.", correct: false },
            { text: "Keduanya = hyperparameter yang tidak bisa diestimasi", why: "Salah: bisa diestimasi via nonlinear least squares / Bayesian — dengan data yang cukup bervariasi." },
            { text: "α = carryover; K = basis penjualan", why: "Salah: itu parameter adstock (λ) dan β_0 — jangan campur kamus." },
          ],
        },
        {
          q: "Kapan MMM sebaiknya DITUNDA (belum dijalankan)?",
          options: [
            { text: "Data < 1 tahun atau spend datar terus — musiman tak terpisahkan, koefisien tak teridentifikasi", why: "Benar: MMM butuh musim penuh + variasi spend. Model yang dipaksa di atas data miskin menghasilkan angka fiksi yang terlihat meyakinkan — jenis kebohongan paling berbahaya.", correct: true },
            { text: "Ketika CFO tidak meminta", why: "Salah: analis yang baik mengusulkan alat yang tepat sebelum diminta.", correct: false },
            { text: "Ketika ada data harian (terlalu granular)", why: "Salah: data harian bisa diagregasi mingguan; granularitas bukan alasan menunda." },
            { text: "Ketika R² pilot di bawah 0,8", why: "Salah: R² rendah = sinyal ada yang belum dimodelkan (musiman? kompetitor?), bukan vonis mati — investigasi dulu." },
          ],
        },
      ],
      next: {
        label: "A322 — Geo-Experiment: Uji Pasar Saat Randomisasi Mustahil",
        href: "/learn/a322-geo-experiment",
      },
    },
  ],
};
