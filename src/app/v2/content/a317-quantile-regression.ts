import type { V2Lesson } from "../lib/types";

// ── Figure: OLS vs garis kuantil τ=0,9 pada data heteroskedastik ──────────
// garis OLS: y = 4,59 + 2,37x ; garis QR90: y = 5,86 + 3,03x (hasil lab, seed 317)
const QR_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Scatter dengan dua garis: OLS dan kuantil 0,9 yang melebar">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="250" x2="530" y2="250"/>
<line x1="60" y1="200" x2="530" y2="200"/><line x1="60" y1="150" x2="530" y2="150"/>
<line x1="60" y1="100" x2="530" y2="100"/><line x1="60" y1="50" x2="530" y2="50"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="253">0</text><text x="54" y="203">10</text><text x="54" y="153">20</text>
<text x="54" y="103">30</text><text x="54" y="53">40</text>
</g>
<g fill="var(--c1)" opacity="0.55">
<circle cx="84" cy="222" r="3.5"/><circle cx="98" cy="216" r="3.5"/><circle cx="112" cy="208" r="3.5"/>
<circle cx="126" cy="200" r="3.5"/><circle cx="140" cy="196" r="3.5"/><circle cx="154" cy="184" r="3.5"/>
<circle cx="168" cy="180" r="3.5"/><circle cx="182" cy="168" r="3.5"/><circle cx="196" cy="164" r="3.5"/>
<circle cx="210" cy="150" r="3.5"/><circle cx="224" cy="146" r="3.5"/><circle cx="238" cy="132" r="3.5"/>
<circle cx="252" cy="128" r="3.5"/><circle cx="266" cy="112" r="3.5"/><circle cx="280" cy="108" r="3.5"/>
<circle cx="294" cy="92" r="3.5"/><circle cx="308" cy="88" r="3.5"/><circle cx="322" cy="70" r="3.5"/>
<circle cx="336" cy="66" r="3.5"/><circle cx="350" cy="48" r="3.5"/><circle cx="364" cy="52" r="3.5"/>
<circle cx="300" cy="130" r="3.5"/><circle cx="340" cy="96" r="3.5"/><circle cx="380" cy="60" r="3.5"/>
<circle cx="395" cy="40" r="3.5"/><circle cx="410" cy="66" r="3.5"/><circle cx="425" cy="30" r="3.5"/>
<circle cx="440" cy="52" r="3.5"/><circle cx="455" cy="24" r="3.5"/><circle cx="470" cy="44" r="3.5"/>
<circle cx="150" cy="212" r="3.5"/><circle cx="230" cy="160" r="3.5"/><circle cx="360" cy="84" r="3.5"/>
</g>
<line x1="60" y1="227" x2="530" y2="106" stroke="var(--chart-text)" stroke-width="2.5"/>
<line x1="60" y1="220" x2="530" y2="65" stroke="var(--c2)" stroke-width="2.5"/>
<g font-size="11" font-family="var(--font-ui)">
<text x="500" y="122" text-anchor="end" fill="var(--chart-text)">OLS (rata-rata)</text>
<text x="500" y="82" text-anchor="end" fill="var(--c2)">kuantil t=0,9</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="20">kerugian (juta Rp)</text><text x="440" y="268">limit (juta Rp, data sintetis)</text>
</g>
</svg>`;

export const a317: V2Lesson = {
  slug: "a317-quantile-regression",
  track: "Statistika",
  module: "Modeling Lanjutan",
  title: "Quantile Regression: Memodelkan Ekor, Bukan Cuma Rata-rata",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rata-rata yang tidak dialami siapa pun",
      prose: [
        "Sebuah perusahaan asuransi kendaraan mengumumkan: rata-rata klaim tahun ini Rp10 juta per nasabah. Tim aktuaria memakai angka itu untuk mematok cadangan. Enam bulan kemudian cadangannya jebol — bukan karena rata-ratanya salah hitung, melainkan karena tidak ada nasabah yang klaimnya Rp10 juta. Kenyataannya: 90% klaim di bawah Rp2 juta (baret, spion), dan 1% klaim di atas Rp500 juta (total loss plus tuntutan pihak ketiga). Rata-rata Rp10 juta adalah fiksi statistik — angka yang benar secara matematis tetapi tidak dialami oleh siapa pun.",
        "Twist-nya: model regresi OLS yang dipakai tim itu dirancang untuk menjawab berapa rata-rata y untuk x tertentu — dan ia menjawabnya dengan sempurna. Masalahnya bukan modelnya, melainkan pertanyaannya. Yang dibutuhkan bisnis bukan rata-rata, melainkan ekor: berapa klaim maksimum yang masih wajar untuk 90% nasabah, dan seberapa buruk 1% terburuknya. OLS tidak bisa menjawab itu — ia hanya punya satu garis untuk seluruh distribusi.",
        "Lesson ini tentang regresi kuantil (Koenker dan Hallock, 2001): teknik yang memodelkan kuantil bersyarat — median, persentil-90, persentil-99 — langsung sebagai fungsi dari x. Setiap kuantil punya garisnya sendiri, dan garis-garis itu boleh melebar, menyempit, bahkan berbeda arah. Untuk analis risiko, ini adalah lensa yang tepat: risiko hidup di ekor, bukan di rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Hampir semua metrik risiko adalah kuantil: VaR 99% adalah kuantil 1% return terburuk; expected shortfall; LGD pada skenario stres; batas toleransi operasional. Regresi kuantil memodelkan angka-angka itu LANGSUNG sebagai fungsi karakteristik nasabah atau portofolio — bukan menebaknya dari rata-rata plus sekian simpangan baku dengan asumsi normalitas yang rapuh.",
      },
      reference: "OLS memodelkan rata-rata bersyarat E[y|x]. Regresi kuantil memodelkan kuantil bersyarat Q_tau(y|x) — langsung menjawab pertanyaan risiko.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan kenapa OLS gagal menjawab pertanyaan tentang ekor distribusi; (2) menulis dan menafsirkan fungsi pinball loss; (3) membaca koefisien regresi kuantil beta(tau) dan menjelaskan kenapa ia berubah terhadap tau; (4) menjalankan dan menafsirkan QuantReg serta tahu kapan IRLS manual diperlukan; (5) memilih kuantil yang tepat untuk pertanyaan bisnis (median vs tau=0,9 vs tau=0,99).",
        "Rutenya: cerita, bekal ringkas, dua konsep (pinball loss; QR vs OLS), lab Pyodide (mesin kuantil), chart kipas dengan panduan baca, peta keputusan, mini-case LGD, kuis, rangkuman. Estimasi 48 menit; lab-nya sekitar 12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Regresi OLS: meminimalkan jumlah kuadrat galat, yang menghasilkan penduga rata-rata bersyarat E[y|x]. Dua sifat OLS yang relevan di sini: (1) ia sangat sensitif terhadap pencilan — satu klaim Rp500 juta menarik garis rata-rata ke atas; (2) ia mengasumsikan efek x sama di seluruh distribusi y — slope-nya satu untuk semua. Regresi kuantil membuang kedua belenggu ini dengan mengganti fungsi kerugiannya.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: OLS bertanya ke mana pusat datanya; regresi kuantil bertanya di mana batas yang memisahkan 90% terbawah dari 10% teratas. Beda pertanyaan, beda garis, beda jawaban.",
      ],
      reference: "Bekal: OLS = minimisasi kuadrat menjadi rata-rata bersyarat; sensitif pencilan; satu slope untuk semua.",
    },
    {
      id: "konsep-pinball",
      eyebrow: "Langkah 3 · Konsep",
      title: "Pinball loss — Si Wasit yang Tidak Adil (dengan sengaja)",
      prose: [
        "Definisi: fungsi pinball loss (disebut juga check function) adalah rho_tau(u) = u kali (tau minus indikator{u lebih kecil dari 0}), dengan u = y minus y-topi adalah galat dan tau kuantil yang ditargetkan (misalnya 0,9). Baca aturannya: bila tebakan terlalu RENDAH (u positif, aktual di atas prediksi), kerugiannya tau kali u; bila tebakan terlalu TINGGI (u negatif), kerugiannya (1 minus tau) kali |u|. Untuk tau = 0,9: meremehkan dihukum 0,9 per rupiah, melebihkan hanya 0,1 per rupiah — wasit yang sengaja tidak adil, 9 kali lebih galak pada underestimasi.",
        "Kepribadiannya: pinball loss seperti manajer gudang menjelang Lebaran. Kehabisan stok (underestimate) berarti pelanggan marah dan hilang — mahal. Kelebihan stok (overestimate) berarti gudang penuh sebentar — murah. Maka ia menyuruhmu menyetok sampai persentil-90 permintaan: 90% aman, 10% kehabisan. Ketidakadilan 9 banding 1 itulah yang menggeser garis prediksi dari tengah distribusi ke ekornya — tepat ke titik di mana 90% data berada di bawah garis.",
        "Kapan memakai: tau = 0,5 memberi median (kasus khusus: regresi median atau LAD — kebal pencilan, alternatif robust untuk OLS); tau = 0,9 atau 0,95 untuk batas toleransi, VaR, cadangan; tau = 0,99 untuk skenario stres ekstrem. Sifat kunci yang dipakai di lab: garis yang meminimalkan pinball loss pada tau secara otomatis menempatkan sekitar tau fraksi data DI BAWAH garis — tidak perlu asumsi distribusi apa pun.",
      ],
      formula: String.raw`\rho_\tau(u) = u \, (\tau - 1_{\{u<0\}}), \qquad \hat{\beta}(\tau) = \arg\min_\beta \sum_{i=1}^{n} \rho_\tau(y_i - x_i'\beta)`,
      formulaNote: "rho_tau = pinball loss; u = y minus y-topi (galat); tau = kuantil target (0 sampai 1); indikator = 1 bila galat negatif, 0 bila positif. beta-topi(tau) = koefisien yang meminimalkan total pinball loss — PERHATIKAN: ia fungsi dari tau, jadi tiap kuantil punya koefisien sendiri. Untuk tau=0,5: rho = 0,5|u| — meminimalkan jumlah nilai absolut = regresi median. Tidak ada asumsi normalitas di mana pun dalam rumus ini — itulah kekuatannya.",
      tasks: [],
      note: {
        title: "Mitos: regresi kuantil tau=0,9 sama dengan OLS pada 10% data teratas",
        type: "pitfall",
        body: "Yang benar: regresi kuantil memakai SEMUA data — pinball loss-lah yang memberi bobot asimetris pada galat, bukan pemilihan subset data. Memotong data ke 10% teratas lalu OLS adalah kesalahan fatal: kamu membuang informasi tentang di mana batas 90% itu berada, dan estimasimu bias karena seleksi sampel (truncation).",
      },
      hints: [
        "Intuisi: rasio hukuman tau banding (1 minus tau) adalah harga kesalahan. tau=0,9 berarti meremehkan 9 kali lebih mahal daripada melebihkan — maka garis optimal bergeser ke atas sampai 90% data berada di bawahnya. Harga menentukan posisi.",
      ],
      reference: "Pinball loss = wasit asimetris; minimisasinya menempatkan sekitar tau fraksi data di bawah garis. tau=0,5 menjadi median.",
    },
    {
      id: "konsep-vs-ols",
      eyebrow: "Langkah 4 · Konsep",
      title: "QR vs OLS — Si Pelukis Kipas",
      prose: [
        "Definisi: regresi kuantil memodelkan kuantil bersyarat Q_tau(y|x) = x aksen beta(tau) — untuk tiap tau, satu garis (satu vektor koefisien). Pada data homoskedastik (sebaran y sama di semua x), garis-garis tau=0,1, 0,5, dan 0,9 sejajar — hanya intercept yang bergeser. Pada data heteroskedastik (sebaran melebar saat x besar — sangat umum di risiko: limit besar berarti variasi kerugian besar), garis-garisnya MEMBENTUK KIPAS: slope beta_1(tau) membesar seiring tau. Kipas inilah yang tidak bisa ditangkap OLS: OLS hanya memberi satu slope, yaitu slope rata-rata.",
        "Kepribadiannya: jika OLS adalah fotografer yang memotret kerumunan dari depan (satu garis tengah), regresi kuantil adalah pelukis yang menggambar kipas — ia menunjukkan bahwa efek limit terhadap kerugian bukan satu angka, melainkan spektrum: untuk nasabah tipikal efeknya landai, untuk 10% terburuk efeknya curam. Analis yang hanya melihat foto OLS akan menyimpulkan efeknya sedang-sedang saja — padahal di ekor, efeknya buas.",
        "Kapan memakai: (1) pertanyaanmu tentang ekor atau toleransi (VaR, cadangan, batas fraud); (2) data heteroskedastik atau skew — cek dengan plot residual OLS yang melebar; (3) pencilan merusak OLS tetapi kamu tidak mau membuangnya (pencilan di risiko justru informatif). Estimasi praktis: statsmodels dengan smf.quantreg lalu fit(q=0.9) — argumen q itulah tau. Di balik layar ia memakai IRLS (iteratively reweighted least squares), versi sederhana yang kamu tulis di lab.",
      ],
      formula: String.raw`Q_\tau(y \mid x) = x'\beta(\tau)`,
      formulaNote: "Q_tau(y|x) = kuantil ke-tau dari y given x (misalnya Q_0,9 = nilai yang 90% observasi berada di bawahnya, untuk x tertentu); beta(tau) = koefisien KHUSUS kuantil tau. Contoh angka dari lab (data heteroskedastik, y = kerugian): OLS menghasilkan y-topi = 4,59 + 2,37x; QR tau=0,9 menghasilkan Q-topi_0,9 = 5,86 + 3,03x. Slope kuantil-90 (3,03) LEBIH CURAM dari slope rata-rata (2,37): limit yang naik Rp1 juta menaikkan rata-rata kerugian Rp2,37 juta, tetapi menaikkan batas 90%-nya Rp3,03 juta. Untuk penetapan cadangan, angka kedua yang relevan — bukan yang pertama.",
      tasks: [],
      note: {
        title: "Mitos: kalau garis kuantil-90 di atas OLS, berarti modelnya overestimate",
        type: "pitfall",
        body: "Yang benar: garis kuantil-90 MEMANG harus di atas sebagian besar data — itu definisinya (90% di bawah garis). Overestimate hanya bermakna bila kamu membandingkannya dengan rata-rata; tetapi kuantil-90 tidak pernah berjanji menjadi rata-rata. Menilai QR dengan kacamata OLS adalah kategori kesalahan: seperti menilai termometer dengan penggaris.",
      },
      hints: [
        "Intuisi kipas: plot beberapa tau (0,1; 0,5; 0,9) sekaligus. Garis sejajar berarti efek x homogen, OLS cukup. Garis mengipas berarti efek x tergantung posisi di distribusi — di sinilah QR membayar harganya, dan di sinilah wawasan risikonya.",
        "Intuisi praktis: selalu mulai dari tau=0,5 (median) sebagai pembanding robust terhadap OLS. Bila median dan OLS jauh berbeda, datamu skew atau berpencilan — dan OLS sedang berbohong dengan sopan.",
      ],
      reference: "Q_tau(y|x) = x aksen beta(tau): satu garis per kuantil. Kipas = heteroskedastisitas = alasan memakai QR.",
    },
    {
      id: "lab-kuantil",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin kuantil",
      prose: [
        "Waktunya jadi analisnya. Data di bawah mensimulasikan kerugian (juta Rp) vs limit (juta Rp): y = 5 + 2x + noise yang melebar dan skew ke kanan saat x besar — pola klasik risiko kredit. Fungsi irls_qr (iteratively reweighted least squares) sudah disediakan di bagian terkunci. Tugasmu: tulis pinball loss, ukur kerugian OLS pada tau=0,9, pasang garis kuantil-90, lalu verifikasi sifat kuncinya: sekitar 90% data berada di bawah garis.",
        "Coba: setelah lolos, ganti TAU = 0.9 menjadi 0.5 lalu 0.99. Perhatikan bagaimana slope dan fraksi-di-bawah-garis berubah — dan tanyakan: untuk penetapan cadangan kerugian, tau mana yang pantas? (Petunjuk: bukan 0,99 — cadangan untuk 99% berarti 1% nasabah menanggung sisanya, terlalu ekstrem untuk operasional normal.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis `pinball_loss(y, yhat, tau)` = rata-rata dari u·(tau − (u<0)), dengan u = y − yhat" },
        { id: "t2", text: "Hitung `loss_ols` = pinball_loss pada garis OLS untuk TAU=0,9" },
        { id: "t3", text: "Pasang `beta_qr = irls_qr(X, y, TAU)` lalu hitung `loss_qr` = pinball_loss pada garis QR" },
        { id: "t4", text: "Hitung `frac_below` = fraksi data dengan y ≤ X@beta_qr (harus ≈ TAU)" },
      ],
      requires: ["numpy"],
      expected: "loss_ols=1.4692\nloss_qr=0.6740\nfrac_below=0.8967 (≈ 0.9)",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(317)
n = 300
x = rng.uniform(0, 10, n)
e = rng.standard_normal(n) * (1 + 0.5 * x)
e = e + rng.exponential(1.0, n) * 0.3 * x
y = 5 + 2 * x + e
X = np.column_stack([np.ones(n), x])
beta_ols = np.linalg.lstsq(X, y, rcond=None)[0]
TAU = 0.9

def irls_qr(X, y, tau, iters=60):
    beta = np.linalg.lstsq(X, y, rcond=None)[0]
    for _ in range(iters):
        u = y - X @ beta
        w = np.where(u >= 0, tau, 1 - tau) / (np.abs(u) + 1e-6)
        W = np.diag(w)
        beta = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)
    return beta

# TULIS KODEMU di bawah ini
def pinball_loss(y, yhat, tau):
    return

loss_ols =
beta_qr =
loss_qr =
frac_below =

print(f"loss_ols={loss_ols:.4f}")
print(f"loss_qr={loss_qr:.4f}")
print(f"frac_below={frac_below:.4f}")`,
        lockLines: 21,
        solution: `import numpy as np
rng = np.random.default_rng(317)
n = 300
x = rng.uniform(0, 10, n)
e = rng.standard_normal(n) * (1 + 0.5 * x)
e = e + rng.exponential(1.0, n) * 0.3 * x
y = 5 + 2 * x + e
X = np.column_stack([np.ones(n), x])
beta_ols = np.linalg.lstsq(X, y, rcond=None)[0]
TAU = 0.9

def irls_qr(X, y, tau, iters=60):
    beta = np.linalg.lstsq(X, y, rcond=None)[0]
    for _ in range(iters):
        u = y - X @ beta
        w = np.where(u >= 0, tau, 1 - tau) / (np.abs(u) + 1e-6)
        W = np.diag(w)
        beta = np.linalg.solve(X.T @ W @ X, X.T @ W @ y)
    return beta

# TULIS KODEMU di bawah ini
def pinball_loss(y, yhat, tau):
    u = y - yhat
    return float(np.mean(u * (tau - (u < 0))))

loss_ols = pinball_loss(y, X @ beta_ols, TAU)
beta_qr = irls_qr(X, y, TAU)
loss_qr = pinball_loss(y, X @ beta_qr, TAU)
frac_below = float(np.mean(y <= X @ beta_qr))

print(f"loss_ols={loss_ols:.4f}")
print(f"loss_qr={loss_qr:.4f}")
print(f"frac_below={frac_below:.4f}")`,
        checks: [
          { kind: "equal", task: "t2", name: "loss_ols", value: 1.4692, tol: 0.01, label: "`loss_ols` ≈ 1,4692", msg: "Pinball loss garis OLS pada tau=0,9 — garis rata-rata buruk untuk pertanyaan ekor." },
          { kind: "equal", task: "t3", name: "loss_qr", value: 0.674, tol: 0.01, label: "`loss_qr` ≈ 0,6740", msg: "Pinball loss garis QR harus JAUH lebih kecil — ia memang dioptimalkan untuk itu." },
          { kind: "equal", task: "t4", name: "frac_below", value: 0.8967, tol: 0.02, label: "`frac_below` ≈ 0,90", msg: "Sifat kunci QR: sekitar tau fraksi data berada di bawah garis kuantil-tau." },
          { kind: "stdout_matches", task: "t4", pattern: "frac_below=0\\.8", label: "Ringkasan tercetak", msg: "Baris frac_below harus tercetak di output." },
        ],
      },
      reference: "QR menang telak pada pinball loss-nya sendiri — dan frac_below ≈ tau tanpa asumsi distribusi.",
    },
    {
      id: "chart-kipas",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca kipas kuantil seperti aktuaria",
      prose: [
        "Chart di bawah memplot data lab-mu: titik-titik kerugian vs limit, garis abu-abu = OLS (rata-rata), garis biru = kuantil tau=0,9.",
        "Cara membaca: sumbu X = limit (juta Rp); sumbu Y = kerugian (juta Rp); sebaran titik MELEBAR ke kanan (heteroskedastik); garis biru selalu di atas garis abu-abu dan SELISIHNYA membesar ke kanan — itulah kipas.",
        "Interpretasi: untuk limit kecil, batas 90% hanya sedikit di atas rata-rata; untuk limit besar, batas 90% jauh melampaui rata-rata. Slope kuantil-90 (3,03) lebih besar dari slope OLS (2,37): tiap kenaikan limit Rp1 juta menaikkan rata-rata kerugian Rp2,37 juta tetapi menaikkan batas toleransi 90% Rp3,03 juta. Analis yang menetapkan cadangan dari garis OLS akan kekurangan cadangan tepat pada segmen limit besar — segmen yang kerugiannya paling menyakitkan. Pelajaran chart ini: kipas adalah foto ketidakadilan risiko — dan QR adalah kameranya.",
      ],
      figure: {
        svg: QR_SVG,
        alt: "Scatter kerugian vs limit yang melebar ke kanan; garis OLS di tengah dan garis kuantil 0,9 di atasnya dengan selisih yang membesar — membentuk kipas.",
        caption: "OLS (rata-rata) vs kuantil tau=0,9 pada data heteroskedastik (data sintetis lab).",
      },
      tasks: [],
      note: {
        title: "Intuisi: kipas adalah foto ketidakadilan risiko",
        body: "Bila garis-garis kuantil mengipas, rata-rata berbohong tentang ekor — dan ekor adalah tempat risiko tinggal. Tiga heuristik. Pertama: selalu plot tiga kuantil (0,1; 0,5; 0,9) sebelum memutuskan model. Garis sejajar = efek x homogen = OLS kemungkinan cukup; garis mengipas = efek x tergantung posisi di distribusi = regresi kuantil wajib. Plot ini murah dan menentukan segalanya. Kedua: kuantil ekstrem butuh data ekstrem — aturan kasar n kali (1 minus tau) ≥ 30. Jangan estimasi persentil-99 dari 200 baris; itu undian, bukan estimasi. Ketiga: tau dipilih oleh pertanyaan bisnis, bukan kebiasaan — cadangan = 0,9; skenario stres = 0,99; nilai tipikal = 0,5. Aturan praktis: nilai model kuantil dengan pinball loss pada tau yang SAMA — membandingkan R-kuadrat antar tau seperti membandingkan apel dengan durian: salah dimensi.",
      },
      reference: "Kipas melebar = slope kuantil > slope OLS = cadangan berbasis rata-rata tidak cukup di segmen besar.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kuantil mana untuk pertanyaan apa?",
      prose: [
        "Empat skenario pemilihan model dan kuantil:",
        "Skenario 1 — Data skew atau berpencilan, pertanyaan tentang nilai tipikal. → Regresi median (tau=0,5). Alasan: kebal terhadap klaim Rp500 juta yang menarik rata-rata; nilai tipikal yang jujur adalah median, bukan mean yang terkontaminasi.",
        "Skenario 2 — Penetapan cadangan kerugian, batas toleransi operasional, VaR. → QR tau=0,9 atau 0,95, dimodelkan langsung terhadap karakteristik nasabah. Alasan: cadangan adalah pertanyaan kuantil secara definisi; memodelkannya langsung menghindari asumsi normalitas rata-rata plus 1,65 sigma yang runtuh saat distribusi skew.",
        "Skenario 3 — Skenario stres atau modal ekonomi (seberapa buruk 1% terburuk?). → QR tau=0,99 — dengan catatan: butuh BANYAK data (kuantil ekstrem = sedikit observasi efektif di ekor). Alasan: ekor ekstrem tidak bisa diestimasi dari 200 baris; pastikan n kali (1 minus tau) ≥ 30 sampai 50 sebagai aturan kasar.",
        "Skenario 4 — Efek x homogen (garis-garis tau sejajar), pertanyaan tentang rata-rata. → OLS biasa. Alasan: bila kipas tidak ada, QR tidak menambah wawasan — OLS lebih efisien secara statistik untuk rata-rata. Selalu plot 3 kuantil dulu sebelum memutuskan.",
        "Aturan praktis 10 detik: pertanyaan rata-rata → OLS; pertanyaan tipikal + data kotor → median; pertanyaan batas/toleransi → tau=0,9/0,95; pertanyaan stres → tau=0,99 (cek kecukupan data); ragu → plot tau=0,1/0,5/0,9, lihat kipasnya.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: tau=0,99 dengan 150 baris data",
        type: "pitfall",
        body: "Kuantil 99% dari 150 observasi didukung oleh sekitar 1,5 observasi efektif di ekor — angkanya lebih mirip undian daripada estimasi. Aturan kasar n kali (1 minus tau) ≥ 30: untuk tau=0,99 butuh minimal sekitar 3.000 baris. Tidak punya datanya? Turunkan ke tau=0,95 dan katakan jujur keterbatasannya.",
      },
      reference: "Tau dipilih oleh pertanyaan bisnis; kecukupan data dipilih oleh n kali (1 minus tau).",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Cadangan yang jebol di segmen besar",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank memakai model OLS untuk cadangan kerugian: cadangan per debitur = prediksi OLS + 15% buffer. Setelah setahun, segmen limit di atas Rp50 juta jebol cadangannya 3 kali; segmen limit di bawah Rp10 juta malah kelebihan cadangan 40%. Model QR yang dipasang kemudian (pada data historis yang sama) menghasilkan: OLS y-topi = 4,6 + 2,37x; QR-90 Q-topi = 5,9 + 3,03x (x dalam juta Rp).",
        "Pertanyaan analisis: (1) Jelaskan secara mekanis kenapa pola jebol/kelebihan itu terjadi. (2) Untuk debitur limit Rp60 juta, berapa cadangan menurut OLS+15% vs menurut QR-90? (3) Apa risiko memakai QR-90 secara membabi buta untuk SEMUA segmen?",
        "Pembahasan: (1) Heteroskedastisitas: sebaran kerugian melebar dengan limit. Buffer 15% dari rata-rata cukup untuk segmen kecil (sebaran sempit) tetapi tidak untuk segmen besar (ekor jauh di atas rata-rata) — buffer proporsional terhadap rata-rata tidak bisa mengejar ekor yang tumbuh lebih cepat. (2) OLS+15%: (4,6 + 2,37 kali 60) kali 1,15 = 146,8 kali 1,15 ≈ Rp168,8 juta. QR-90: 5,9 + 3,03 kali 60 = Rp187,7 juta — selisih sekitar Rp19 juta per debitur; dikali ribuan debitur segmen besar, itulah lubang cadangannya. (3) QR-90 untuk segmen kecil memberi cadangan berlebih (over-reserving menggerus profitabilitas dan modal); kuantil harus diselaraskan dengan kebijakan risiko per segmen — bukan satu tau untuk semua.",
        "Catatan: angka-angka ini dari data sintetis lab, tetapi polanya — kipas, jebol di segmen besar, kelebihan di segmen kecil — adalah pola yang berulang di portofolio kredit nyata dengan distribusi kerugian skew.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Cadangan berbasis rata-rata + buffer adalah praktik yang umum — dan diam-diam regresif: ia memajak segmen kecil (kelebihan cadangan = modal menganggur) untuk mensubsidi kekurangan cadangan segmen besar. Regresi kuantil membuat subsidi silang ini terlihat dan terukur, sehingga komite risiko bisa memutuskan secara eksplisit, bukan tanpa sadar.",
      },
      reference: "Buffer persen dari rata-rata gagal saat ekor tumbuh lebih cepat dari rata-rata. Modelkan kuantilnya langsung.",
    },
    {
      id: "pendalaman-interval-crossing",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Interval prediksi, quantile crossing & conformal",
      prose: [
        "Regresi kuantil memberi hadiah kedua selain garis ekor: interval prediksi tanpa asumsi normalitas. Interval 90% = [Q_0,05(x), Q_0,95(x)] — dua garis kuantil yang di-fit terpisah. Keunggulannya: interval otomatis melebar di wilayah x yang berisik dan menyempit di wilayah yang tenang — heteroskedastisitas tertangkap tanpa dimodelkan eksplisit. Bandingkan dengan OLS ± 1,64 sigma: interval simetris dengan lebar konstan yang runtuh saat distribusi skew — presisi palsu di ekor yang justru paling penting.",
        "Tapi ada cacat yang wajib dicek: quantile crossing. Karena tiap tau di-fit terpisah, garis Q_0,9 bisa menyilang DI BAWAH garis Q_0,5 di wilayah x tertentu — mustahil secara logika (kuantil 90 tidak boleh di bawah median). Penyebab: data tipis di wilayah itu + estimasi independen per tau. Selalu plot dan cek silang sebelum interval disajikan. Obat: rearrangement (urutkan ulang garis-garisnya agar monotonik) atau estimasi simultan dengan kendala non-crossing.",
        "Saudara dekat kuantil: expectile. Expectile memakai kuadrat galat terbobot asimetris (mirip mean), sedangkan kuantil memakai absolut terbobot (mirip median). Konsekuensi: expectile sensitif terhadap pencilan seperti mean; kuantil robust seperti median. Untuk risiko operasional — di mana pencilan justru informatif tapi tidak boleh mendominasi — kuantil lebih jujur. Pilih expectile hanya bila ada alasan bisnis spesifik yang membutuhkan sifat seperti-mean.",
        "Standar modern untuk garansi cakupan: conformal prediction. Ia membungkus prediktor apapun (termasuk QR) dengan interval yang punya garansi cakupan marginal tanpa asumsi distribusi — memakai skor nonconformity di data kalibrasi terpisah. Rumus praktisnya: QR memberi interval yang adaptif bentuk mengikuti data; conformal memberi garansi bahwa sekitar (1 − alpha) observasi baru jatuh di dalamnya. Bila komite risiko menuntut garansi formal atas intervalmu, conformal adalah jawabannya — dan ia bekerja paling baik di atas garis kuantil yang sudah adaptif.",
      ],
      formula: String.raw`\text{PI}_{1-\alpha}(x) = \big[Q_{\alpha/2}(x),\; Q_{1-\alpha/2}(x)\big]`,
      formulaNote: "PI = prediction interval; Q_{α/2} dan Q_{1−α/2} = garis kuantil bawah dan atas. Contoh: interval 90% = [Q_0,05(x), Q_0,95(x)] — sekitar 90% observasi baru jatuh di dalamnya, tanpa asumsi normalitas. Selalu cek quantile crossing sebelum menyajikan.",
      tasks: [],
      reference: "Interval dari dua garis kuantil = adaptif tanpa asumsi. Cek crossing. Garansi formal = conformal.",
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
        "Regresi kuantil memodelkan kuantil bersyarat Q_tau(y|x) = x aksen beta(tau) — satu garis per kuantil, langsung menjawab pertanyaan risiko.",
        "Pinball loss: menghukum underestimasi sebesar tau dan overestimasi sebesar (1 minus tau); minimisasinya menaruh sekitar tau fraksi data di bawah garis.",
        "tau=0,5 = regresi median (robust); tau=0,9/0,95 = toleransi/VaR/cadangan; tau=0,99 = stres (butuh n kali (1 minus tau) ≥ 30).",
        "Garis-garis kuantil yang mengipas = heteroskedastisitas = efek x berbeda di ekor vs di tengah — yang tidak tertangkap OLS.",
        "QR memakai SEMUA data (bukan subset); penilaiannya dengan pinball loss, bukan R-kuadrat.",
      ],
      quiz: [
        {
          q: "Manajer gudang rugi 9 kali lebih besar saat kehabisan stok dibanding kelebihan stok. Kuantil permintaan yang optimal untuk disetok?",
          options: [
            { text: "tau=0,9 — rasio hukuman 9:1 persis memetakan ke kuantil 90%", why: "Benar: pinball loss dengan tau=0,9 menghukum underestimate 0,9 dan overestimate 0,1 — rasio 9:1 sama dengan rasio biaya manajer. Harga menentukan kuantil.", correct: true },
            { text: "tau=0,5 — median selalu paling aman", why: "Salah: median optimal bila biaya simetris. Di sini biaya sangat asimetris — median akan kehabisan stok terlalu sering." },
            { text: "Rata-rata + 9 kali simpangan baku", why: "Salah: mencampuradukkan rasio biaya dengan pengali simpangan baku — tidak ada teori yang menghubungkan keduanya." },
            { text: "tau=0,99 — semakin tinggi semakin aman", why: "Salah: menimbun sampai persentil-99 itu boros (gudang penuh terus). Optimal = seimbang dengan biaya, yaitu 0,9." },
          ],
        },
        {
          q: "Garis kuantil tau=0,9 hasil fitting menempatkan 62% data di bawahnya (n=5.000). Kesimpulan?",
          options: [
            { text: "Ada yang salah — seharusnya sekitar 90%; cek bug kode atau konvergensi IRLS", why: "Benar: sifat fundamental QR adalah sekitar tau fraksi di bawah garis. Deviasi sejauh ini (62% vs 90%) dengan n besar menandakan optimasi gagal, bukan sifat data.", correct: true },
            { text: "Normal — 62% masih dalam toleransi", why: "Salah: dengan n=5.000, fraksi harus sangat dekat ke 90%. 62% adalah kegagalan, bukan variasi sampling." },
            { text: "Datanya tidak cocok untuk regresi kuantil", why: "Salah: sifat sekitar-tau di bawah garis berlaku untuk distribusi apa pun bila optimasi benar. Jangan salahkan data sebelum cek kode." },
            { text: "Naikkan tau ke 0,95 untuk memperbaiki", why: "Salah: menaikkan tau tidak memperbaiki fitting yang rusak — ia hanya menggeser target yang juga akan meleset." },
          ],
        },
        {
          q: "Plot tau=0,1/0,5/0,9 menghasilkan tiga garis SEJAJAR. Artinya?",
          options: [
            { text: "Efek x homogen di seluruh distribusi — OLS kemungkinan cukup untuk pertanyaan rata-rata", why: "Benar: garis sejajar = hanya intercept bergeser, slope sama = tidak ada heteroskedastisitas yang material. Kipaslah yang membenarkan QR.", correct: true },
            { text: "Regresi kuantil gagal — harusnya mengipas", why: "Salah: garis sejajar adalah hasil yang valid dan informatif: ia memberi tahu bahwa efeknya homogen." },
            { text: "Harus memakai tau yang lebih ekstrem", why: "Salah: tau ekstrem tidak menciptakan kipas bila datanya memang homogen — hanya menambah noise estimasi." },
            { text: "Datanya pasti berdistribusi normal", why: "Salah: kesejajaran garis tidak membuktikan normalitas — hanya homogenitas efek x." },
          ],
        },
        {
          q: "Analis ingin mengestimasi kuantil 99% kerugian dengan 200 baris data historis. Masalahnya?",
          options: [
            { text: "Hanya sekitar 2 observasi efektif di ekor — estimasi sangat tidak stabil; butuh ribuan baris atau turunkan ke tau=0,95", why: "Benar: n kali (1 minus tau) = 2. Aturan kasar minimal 30–50. Melaporkan angka dari 2 observasi efektif sebagai estimasi menyesatkan komite risiko.", correct: true },
            { text: "Tidak ada masalah — IRLS bisa konvergen dengan data sedikit", why: "Salah: konvergensi optimasi bukan masalahnya; ketidakpastian statistiknyalah masalahnya." },
            { text: "Harus memakai OLS saja", why: "Salah: OLS juga tidak bisa menjawab pertanyaan kuantil-99 — masalahnya kecukupan data, bukan pilihan model." },
            { text: "Naikkan iterasi IRLS hingga 10.000", why: "Salah: iterasi tidak menciptakan informasi yang tidak ada di data." },
          ],
        },
        {
          q: "Kenapa R-kuadrat bukan metrik yang tepat untuk menilai model regresi kuantil?",
          options: [
            { text: "R-kuadrat mengukur kedekatan ke rata-rata; QR tidak memprediksi rata-rata — metrik yang selaras adalah pinball loss pada tau yang sama", why: "Benar: menilai QR dengan R-kuadrat seperti menilai pemanah dengan stopwatch — salah dimensi. Bandingkan pinball loss antar-model pada tau yang sama.", correct: true },
            { text: "R-kuadrat tidak bisa dihitung untuk QR secara matematis", why: "Salah: R-kuadrat bisa dihitung untuk prediksi apa pun — hanya saja tidak bermakna untuk tujuan kuantil." },
            { text: "QR selalu punya R-kuadrat = 1", why: "Salah: tidak ada hubungan seperti itu." },
            { text: "R-kuadrat hanya untuk data normal", why: "Salah: R-kuadrat tidak butuh normalitas; ia hanya tidak selaras dengan tujuan kuantil." },
          ],
        },
        {
          q: "Garis Q_0,9 hasil fitting menyilang di bawah garis Q_0,5 untuk x besar. Apa yang terjadi?",
          options: [
            { text: "Normal — kuantil boleh menyilang", why: "Salah: secara logika kuantil 90 tidak boleh di bawah median." },
            { text: "Quantile crossing: artefak estimasi terpisah per tau di wilayah data tipis. Cek plot; perbaiki dengan rearrangement atau kendala non-crossing", why: "Benar: jangan sajikan interval yang logikanya mustahil.", correct: true },
            { text: "Datanya tidak cocok untuk regresi kuantil", why: "Salah: ini soal metode estimasi, bukan kecocokan data." },
            { text: "Naikkan tau ke 0,95", why: "Salah: menggeser target tidak memperbaiki silang yang sudah terjadi." },
          ],
        },
        {
          q: "Interval 90% dari OLS (±1,64 sigma, lebar konstan) vs dari QR ([Q_0,05, Q_0,95]) pada data kerugian yang skew dan heteroskedastik. Mana lebih jujur?",
          options: [
            { text: "OLS — lebih sederhana dan baku", why: "Salah: kesederhanaan bukan kejujuran." },
            { text: "QR — intervalnya adaptif: melebar di wilayah berisik, menyempit di wilayah tenang, tanpa asumsi normalitas. OLS memberi presisi palsu di ekor", why: "Benar: ekor yang skew + heteroskedastik menghancurkan interval simetris.", correct: true },
            { text: "Sama saja keduanya", why: "Salah: perilakunya sangat berbeda di data seperti ini." },
            { text: "OLS — karena sigma mudah dihitung", why: "Salah: kemudahan hitung bukan kriteria kejujuran." },
          ],
        },
        {
          q: "Komite risiko menuntut garansi formal bahwa sekitar 90% observasi baru jatuh dalam interval prediksimu. Pendekatan modern?",
          options: [
            { text: "Perbanyak asumsi distribusi", why: "Salah: asumsi bukan garansi." },
            { text: "Conformal prediction di atas garis kuantil: interval dengan garansi cakupan tanpa asumsi distribusi, via skor nonconformity di data kalibrasi terpisah", why: "Benar: QR = adaptif bentuk; conformal = garansi cakupan.", correct: true },
            { text: "Naikkan interval ke 99%", why: "Salah: melebarkan interval bukan memberi garansi formal." },
            { text: "Pakai interval OLS yang lebih lebar", why: "Salah: tidak ada garansi distribusi-bebas di situ." },
          ],
        },
      ],
    },
  ],
};
