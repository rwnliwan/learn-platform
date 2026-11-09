import type { V2Lesson } from "../lib/types";

// ── Figure: histogram sampel MH vs densitas target campuran (seed 19) ──────
const MCMC_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Histogram sampel MCMC menempel pada densitas target dua punuk">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="60" y1="240" x2="530" y2="240"/>
<line x1="60" y1="180" x2="530" y2="180"/><line x1="60" y1="120" x2="530" y2="120"/>
<line x1="60" y1="60" x2="530" y2="60"/>
</g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="54" y="243">0</text><text x="54" y="183">0,1</text><text x="54" y="123">0,2</text><text x="54" y="63">0,3</text>
</g>
<g>
<rect x="61.5" y="239.4" width="36.2" height="0.6" fill="var(--c1)" opacity="0.75"/>
<rect x="100.7" y="230.4" width="36.2" height="9.6" fill="var(--c1)" opacity="0.75"/>
<rect x="139.8" y="184.8" width="36.2" height="55.2" fill="var(--c1)" opacity="0.75"/>
<rect x="179.0" y="90.6" width="36.2" height="149.4" fill="var(--c1)" opacity="0.75"/>
<rect x="218.2" y="96.6" width="36.2" height="143.4" fill="var(--c1)" opacity="0.75"/>
<rect x="257.3" y="178.8" width="36.2" height="61.2" fill="var(--c1)" opacity="0.75"/>
<rect x="296.5" y="227.4" width="36.2" height="12.6" fill="var(--c1)" opacity="0.75"/>
<rect x="335.7" y="214.8" width="36.2" height="25.2" fill="var(--c1)" opacity="0.75"/>
<rect x="374.8" y="177.6" width="36.2" height="62.4" fill="var(--c1)" opacity="0.75"/>
<rect x="414.0" y="181.8" width="36.2" height="58.2" fill="var(--c1)" opacity="0.75"/>
<rect x="453.2" y="220.2" width="36.2" height="19.8" fill="var(--c1)" opacity="0.75"/>
<rect x="492.3" y="237.0" width="36.2" height="3.0" fill="var(--c1)" opacity="0.75"/>
</g>
<polyline points="60.0,239.9 67.8,239.9 75.7,239.7 83.5,239.5 91.3,239.0 99.2,238.1 107.0,236.7 114.8,234.3 122.7,230.6 130.5,225.1 138.3,217.3 146.2,206.8 154.0,193.4 161.8,177.1 169.7,158.4 177.5,138.4 185.3,118.3 193.2,100.0 201.0,85.3 208.8,75.8 216.7,72.4 224.5,75.8 232.3,85.3 240.2,100.0 248.0,118.3 255.8,138.3 263.7,158.4 271.5,177.0 279.3,193.2 287.2,206.4 295.0,216.5 302.8,223.7 310.7,228.1 318.5,230.3 326.3,230.3 334.2,228.4 342.0,224.8 349.8,219.5 357.7,212.8 365.5,204.9 373.3,196.4 381.2,187.8 389.0,180.0 396.8,173.7 404.7,169.6 412.5,168.2 420.3,169.6 428.2,173.7 436.0,180.0 443.8,187.9 451.7,196.4 459.5,205.0 467.3,213.0 475.2,220.0 483.0,225.8 490.8,230.3 498.7,233.6 506.5,236.0 514.3,237.6 522.2,238.6 530.0,239.2" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<g font-size="11" font-family="var(--font-ui)">
<rect x="80" y="258" width="14" height="14" fill="var(--c1)" opacity="0.75"/><text x="100" y="270" fill="var(--text)">sampel MH (18.000)</text>
<line x1="250" y1="265" x2="280" y2="265" stroke="var(--c2)" stroke-width="2.5"/><text x="286" y="270" fill="var(--text)">densitas target</text>
</g>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)">
<text x="60" y="16">densitas</text><text x="440" y="290">x (data sintetis)</text>
</g>
</svg>`;

export const b19: V2Lesson = {
  slug: "b19-mcmc",
  track: "Probabilitas",
  module: "Bayesian",
  title: "MCMC: Sampling dari yang Tak Terhitung (Metropolis-Hastings & Gibbs)",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Integral yang membuat analis menyerah — lalu tidak jadi",
      prose: [
        "Seorang analis kredit ingin memakai Bayesian untuk mengestimasi probabilitas default portofolio. Ia menulis prior, menulis likelihood, lalu tiba di rumus posterior — dan berhenti. Penyebutnya adalah integral atas seluruh ruang parameter yang tidak punya bentuk tertutup: tidak bisa dihitung dengan kalkulus, tidak bisa dihitung dengan kuadratur numerik dalam dimensi 20. Ia menutup laptop dan kembali ke MLE dengan sedih. Posterior yang benar-benar ia butuhkan tergeletak tak tersentuh di balik integral itu.",
        "Twist-nya: seminggu kemudian seorang kolega menunjukkan bahwa integral itu TIDAK PERLU dihitung sama sekali. Untuk mengambil keputusan — estimasi, interval kredibel, prediksi — yang dibutuhkan bukanlah nilai posterior di tiap titik, melainkan SAMPEL dari posterior. Dan ada algoritma yang bisa menghasilkan sampel dari distribusi yang fungsi densitasnya pun tidak bisa dinormalisasi: ia hanya butuh rasio dua nilai fungsi, sehingga konstanta normalisasi yang mengerikan itu saling menghapus. Analis itu tidak perlu menaklukkan integral — ia hanya perlu mengakalinya.",
        "Lesson ini tentang MCMC — Markov Chain Monte Carlo (dengan materi dari buku Probabilistic Programming and Bayesian Methods for Hackers, bab 3): keluarga algoritma yang membangun rantai Markov yang distribusi stasionernya ADALAH posterior yang kamu incar. Dua anggotanya yang wajib dikenal: Metropolis-Hastings, si penjelajah serbaguna; dan Gibbs sampling, si spesialis yang efisien.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Model risiko modern (hierarkis, dengan banyak parameter acak) hampir tidak pernah punya posterior tertutup. Tanpa MCMC, analis terjebak pada model yang bisa dihitung — bukan model yang benar. MCMC membebaskan pilihan model dari belenggu keterhitungan analitik: pakai model yang sesuai masalahnya, biarkan algoritma yang mengurus integralnya.",
      },
      reference: "MCMC = bangun rantai Markov yang dalam jangka panjang mengunjungi tiap titik proporsional dengan posterior — tanpa pernah menghitung penyebutnya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan ide inti MCMC dan kenapa konstanta normalisasi tidak diperlukan; (2) menulis dan menjalankan algoritma Metropolis-Hastings; (3) menjelaskan Gibbs sampling dan kapan ia mengalahkan MH; (4) mendiagnosis rantai (burn-in, trace plot, acceptance rate, autokorelasi); (5) memakai sampel posterior untuk estimasi dan interval kredibel.",
        "Rutenya: cerita, bekal ringkas, dua konsep (MH; Gibbs + diagnosis), lab Pyodide (mesin MH), chart histogram-vs-target dengan panduan baca, peta keputusan, mini-case PD Bayesian, kuis, rangkuman. Estimasi 58 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, Monte Carlo: bila kamu punya SAMPEL dari suatu distribusi, ekspektasi apa pun bisa diestimasi dengan rata-rata sampel — hukum bilangan besar menjaminnya. MCMC adalah cara mendapatkan sampel itu ketika sampling langsung mustahil. Kedua, Bayesian praktis: posterior proporsional dengan prior kali likelihood — tanda proporsional inilah yang dimanfaatkan MCMC, karena rasio dua posterior saling menghapus konstanta yang tidak diketahui.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: MCMC memecah masalah mustahil (hitung integral 20-dimensi) menjadi jutaan masalah sepele (bandingkan dua titik, pilih yang lebih baik). Kemenangannya adalah kemenangan jumlah atas kerumitan.",
      ],
      reference: "Bekal: (1) Monte Carlo = rata-rata sampel mengestimasi ekspektasi; (2) posterior ∝ prior × likelihood — konstanta hilang dalam rasio.",
    },
    {
      id: "konsep-mh",
      eyebrow: "Langkah 3 · Konsep",
      title: "Metropolis-Hastings — Si Penjelajah Mabuk yang Bijak",
      prose: [
        "Definisi: Metropolis-Hastings (MH) membangun rantai sebagai berikut. Dari posisi kini x, usulkan posisi baru x' dari distribusi proposal q(x'|x) — misalnya Normal(x, sigma). Hitung rasio penerimaan alpha = pi(x')/pi(x), dengan pi adalah target TAK TERNORMALISASI (cukup prior × likelihood). Terima x' dengan peluang min(1, alpha): bila x' lebih baik (alpha > 1), selalu pindah; bila lebih buruk, pindah dengan peluang alpha — kadang-kadang mau ke tempat yang lebih jelek. Itulah yang membuat rantai menjelajah seluruh distribusi, bukan terjebak di puncak. Ulangi puluhan ribu kali; buang ribuan awal (burn-in); sisanya adalah sampel posterior.",
        "Kepribadiannya: MH seperti turis mabuk yang bijak di kota berbukit (lanskap = posterior). Ia melangkah acak ke sekitarnya; kalau langkahnya naik (ke tempat lebih baik), ia ambil; kalau turun, ia ambil KADANG-KADANG — dengan peluang proporsional seberapa buruk penurunannya. Turis yang selalu naik akan terjebak di bukit pertama (mode lokal); turis yang kadang turun akhirnya mengunjungi seluruh kota dengan frekuensi proporsional keindahannya. Proposal sigma adalah panjang langkahnya: terlalu kecil = merangkak, acceptance tinggi tetapi eksplorasi lambat; terlalu besar = melompat ke jurang terus, acceptance rendah. Target sehat: acceptance 20–50%.",
        "Kapan memakai: (1) posterior tanpa bentuk tertutup dan tanpa kondisional yang mudah disampel — MH selalu bisa dipakai karena hanya butuh evaluasi pi(x); (2) dimensi sedang (puluhan parameter); (3) kamu butuh solusi cepat yang benar secara asimtotik. Kelemahan: random walk lambat di dimensi tinggi dan pada distribusi berkorelasi kuat — di sinilah sampler modern (HMC/NUTS, dipakai Stan/PyMC) mengambil alih.",
      ],
      formula: String.raw`\alpha = \min\!\left(1, \, \frac{\pi(x')}{\pi(x)} \cdot \frac{q(x \mid x')}{q(x' \mid x)}\right)`,
      formulaNote: "alpha = peluang penerimaan; pi = target tak ternormalisasi (konstanta normalisasi yang menakutkan ADA di pembilang dan penyebut — saling menghapus!); q = distribusi proposal. Untuk proposal simetris (Normal(x, sigma): peluang melangkah x→x' sama dengan x'→x), suku q saling menghapus sehingga alpha = min(1, pi(x')/pi(x)) — inilah algoritma Metropolis murni. Praktik numerik: hitung dalam skala log, log-alpha = log-pi(x') − log-pi(x), terima bila log(uniform) < log-alpha — menghindari underflow.",
      tasks: [],
      note: {
        title: "🚨 Mitos: sampel MCMC = sampel independen dari posterior",
        type: "pitfall",
        body: "Yang benar: sampel MCMC BERKORELASI — tiap titik adalah tetangga titik sebelumnya (rantai Markov!). Rata-rata sampel tetap konsisten (ergodic theorem), tetapi effective sample size jauh lebih kecil dari jumlah iterasi. Jangan laporkan n=20.000 seolah 20.000 independen; hitung ESS atau setidaknya laporkan autokorelasinya. Mengabaikan ini = interval kredibel yang terlalu sempit = keyakinan palsu.",
      },
      hints: [
        "💡 Intuisi: tiga musuh MH — (1) burn-in: rantai butuh waktu lupa titik awal, buang awalnya; (2) proposal buruk: acceptance < 10% atau > 90% berarti setel ulang sigma; (3) multimodality: rantai bisa terjebak di satu punuk (lihat chart — target kita dua punuk, dan rantai harus melompat di antara keduanya).",
      ],
      reference: "MH = usulkan, bandingkan rasio, terima kadang-kadang. Konstanta normalisasi hilang dalam rasio.",
    },
    {
      id: "konsep-gibbs",
      eyebrow: "Langkah 4 · Konsep",
      title: "Gibbs sampling — Si Spesialis Kondisional",
      prose: [
        "Definisi: Gibbs sampling adalah MH dengan proposal yang sempurna. Untuk vektor parameter (theta_1, ..., theta_d), Gibbs mengupdate SATU komponen per satu waktu dengan mensampel dari distribusi KONDISIONAL PENUH-nya: theta_j^(baru) ~ pi(theta_j | theta_{-j}^(kini), data). Karena proposalnya persis kondisional target, rasio penerimaan selalu 1 — setiap usulan diterima! Syaratnya: kamu harus BISA mensampel dari tiap kondisional penuh (misalnya karena konjugasi atau bentuk yang dikenal).",
        "Kepribadiannya: jika MH adalah turis mabuk yang menawar setiap langkah, Gibbs adalah penghuni apartemen yang menata satu ruangan per hari — dan karena ia tahu persis tata letak ideal tiap ruangan given ruangan lain, setiap penataan langsung final tanpa ditawar. Jauh lebih efisien — tetapi hanya bisa dipakai bila kamu tahu tata letak ideal itu (kondisional yang bisa disampel). Untuk model hierarkis dengan konjugasi (lihat a316: u_j | lainnya sering Normal!), Gibbs adalah pilihan alami.",
        "Diagnosis rantai (berlaku untuk MH maupun Gibbs): (1) trace plot — plot nilai vs iterasi; rantai sehat terlihat seperti ulat berbulu acak tanpa tren; tren naik = belum konvergen, tambah burn-in; (2) acceptance rate MH: 20–50% (terlalu tinggi = langkah terlalu kecil, eksplorasi lambat); (3) jalankan BEBERAPA rantai dari titik awal berbeda — bila mereka tidak bercampur (R-hat jauh di atas 1), belum konvergen; (4) autokorelasi: thinning (ambil tiap ke-k) bila korelasi lag-1 sangat tinggi — atau biarkan, tetapi sesuaikan ESS.",
      ],
      formula: String.raw`\theta_j^{(t+1)} \sim \pi(\theta_j \mid \theta_1^{(t+1)}, \ldots, \theta_{j-1}^{(t+1)}, \theta_{j+1}^{(t)}, \ldots, \theta_d^{(t)}, \, \text{data})`,
      formulaNote: "theta_j^(t+1) = nilai baru komponen ke-j; di kanan adalah distribusi kondisional PENUH: komponen j given SEMUA komponen lain (yang sudah diupdate dipakai nilai baru, yang belum dipakai nilai lama) dan data. Siklus: j=1..d, ulangi. Tidak ada rasio penerimaan — tidak ada penolakan. Contoh: model campuran dua Normal — kondisional alokasi komponen tiap observasi adalah kategorik yang mudah disampel, sehingga Gibbs sangat cocok.",
      tasks: [],
      note: {
        title: "🚨 Mitos: burn-in yang panjang selalu memperbaiki hasil",
        type: "pitfall",
        body: "Yang benar: burn-in hanya membuang pengaruh titik awal — setelah rantai mencapai rezim stasioner, iterasi tambahan adalah SAMPEL BERHARGA, bukan sampah. Membuang 90% dari 100.000 iterasi yang sudah konvergen = membuang 90% informasimu. Diagnosis dulu (trace plot, R-hat); buang secukupnya, bukan sebanyak-banyaknya.",
      },
      hints: [
        "💡 Intuisi memilih: kondisional bisa disampel → Gibbs (selalu diterima, efisien). Tidak bisa → MH (umum, butuh setel proposal). Dimensi ratusan + korelasi kuat → HMC/NUTS (di luar lesson ini, tetapi ketahui namanya).",
        "💡 Intuisi praktis: mulai beberapa rantai dari titik awal yang BERBEDA JAUH. Bila semuanya berakhir di tempat yang sama, kepercayaanmu pada konvergensi naik berlipat — ini uji termurah dan paling jujur.",
      ],
      reference: "Gibbs = sampel dari kondisional penuh, terima 100%. Diagnosis: trace, acceptance, multi-rantai, autokorelasi.",
    },
    {
      id: "lab-mh",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Bangun mesin Metropolis-Hastings",
      prose: [
        "Waktunya jadi sampler. Target kita adalah campuran 0,7·Normal(−2,1) + 0,3·Normal(3,1) — distribusi DUA PUNUK yang sengaja menantang: rantai harus berani melompat lembah di antara punuk. Fungsi log_pi (log target tak ternormalisasi) sudah disediakan. Tugasmu: tulis rasio penerimaan log, aturan terima/tolak, lalu estimasi mean dan acceptance rate dari rantaimu.",
        "Coba: setelah lolos, ubah prop_sd = 1.5 menjadi 0.2 (langkah kerdil) lalu 8.0 (langkah raksasa). Bagaimana acceptance rate dan kualitas eksplorasinya? Pada nilai mana rantai berhenti mengunjungi punuk kecil di x=3? Itulah kenapa penyetelan proposal bukan detail sepele.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `log_alpha` = log_pi(x_new) − log_pi(x_cur) (rasio dalam skala log)" },
        { id: "t2", text: "Tulis `terima` = kondisi terima/tolak: True bila log(uniform(0,1)) < log_alpha" },
        { id: "t3", text: "Hitung `mean_est` = rata-rata sampel setelah burn-in (harus ≈ −0,5)" },
        { id: "t4", text: "Hitung `acc_rate` = n_accept / n_iter, lalu cetak ringkasannya" },
      ],
      requires: ["numpy"],
      expected: "mean_est=-0.5753 (benar −0,5)\nacc_rate=0.6296",
      code: {
        starter: `import numpy as np
rng = np.random.default_rng(19)
# Target: 0.7*N(-2,1) + 0.3*N(3,1); mean benar = 0.7*(-2) + 0.3*3 = -0.5
w1, m1, s1 = 0.7, -2.0, 1.0
w2, m2, s2 = 0.3, 3.0, 1.0

def log_pi(x):                       # log target TAK ternormalisasi
    g1 = -0.5*((x-m1)/s1)**2 - np.log(s1) - 0.5*np.log(2*np.pi)
    g2 = -0.5*((x-m2)/s2)**2 - np.log(s2) - 0.5*np.log(2*np.pi)
    a, b = np.log(w1)+g1, np.log(w2)+g2
    mx = max(a, b)
    return mx + np.log(np.exp(a-mx) + np.exp(b-mx))

n_iter, burn, prop_sd = 20000, 2000, 1.5

# TULIS KODEMU di bawah ini
x_cur = 0.0
samples = np.empty(n_iter)
n_accept = 0
for i in range(n_iter):
    x_new = rng.normal(x_cur, prop_sd)
    log_alpha =
    terima =
    if terima:
        x_cur = x_new
        n_accept += 1
    samples[i] = x_cur
mean_est =
acc_rate =

print(f"mean_est={mean_est:.4f} (benar −0,5)")
print(f"acc_rate={acc_rate:.4f}")`,
        lockLines: 16,
        solution: `import numpy as np
rng = np.random.default_rng(19)
# Target: 0.7*N(-2,1) + 0.3*N(3,1); mean benar = 0.7*(-2) + 0.3*3 = -0.5
w1, m1, s1 = 0.7, -2.0, 1.0
w2, m2, s2 = 0.3, 3.0, 1.0

def log_pi(x):                       # log target TAK ternormalisasi
    g1 = -0.5*((x-m1)/s1)**2 - np.log(s1) - 0.5*np.log(2*np.pi)
    g2 = -0.5*((x-m2)/s2)**2 - np.log(s2) - 0.5*np.log(2*np.pi)
    a, b = np.log(w1)+g1, np.log(w2)+g2
    mx = max(a, b)
    return mx + np.log(np.exp(a-mx) + np.exp(b-mx))

n_iter, burn, prop_sd = 20000, 2000, 1.5

# TULIS KODEMU di bawah ini
x_cur = 0.0
samples = np.empty(n_iter)
n_accept = 0
for i in range(n_iter):
    x_new = rng.normal(x_cur, prop_sd)
    log_alpha = log_pi(x_new) - log_pi(x_cur)
    terima = np.log(rng.random()) < log_alpha
    if terima:
        x_cur = x_new
        n_accept += 1
    samples[i] = x_cur
mean_est = float(np.mean(samples[burn:]))
acc_rate = n_accept / n_iter

print(f"mean_est={mean_est:.4f} (benar −0,5)")
print(f"acc_rate={acc_rate:.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "mean_est", value: -0.5753, tol: 0.1, label: "`mean_est` ≈ −0,58", msg: "Rata-rata sampel pasca burn-in harus dekat mean benar −0,5 (campuran 2 punuk)." },
          { kind: "equal", task: "t4", name: "acc_rate", value: 0.6296, tol: 0.03, label: "`acc_rate` ≈ 0,63", msg: "Acceptance rate dengan proposal sd=1,5 — sedikit tinggi, masih bisa bekerja." },
          { kind: "stdout_matches", task: "t4", pattern: "acc_rate=0\\.6", label: "Ringkasan tercetak", msg: "Baris acc_rate harus tercetak di output." },
        ],
      },
      reference: "MH = usulkan, hitung rasio log, terima kadang-kadang. 18.000 sampel pasca burn-in mengestimasi mean.",
    },
    {
      id: "chart-sampel",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca histogram MCMC seperti Bayesian",
      prose: [
        "Chart di bawah memplot 18.000 sampel pasca burn-in dari lab-mu (batang) melawan densitas target yang sebenarnya (kurva biru).",
        "Cara membaca: sumbu X = nilai x; sumbu Y = densitas; batang = histogram sampel MH; kurva = target campuran 0,7·N(−2,1)+0,3·N(3,1) yang TIDAK PERNAH dinormalisasi oleh algoritma — MH hanya memakai rasionya.",
        "Interpretasi: histogram menempel pada kurva di KEDUA punuk — termasuk punuk kecil di x=3 yang hanya menampung 30% massa. Inilah bukti visual bahwa rantai berhasil melompati lembah: turis mabuk kita tidak terjebak di bukit pertama. Pelajaran chart ini: MCMC mengubah masalah tak terhitung (integral 20-dimensi) menjadi masalah terhitung (rata-rata 18.000 angka) — dan chart ini adalah kwitansinya.",
      ],
      figure: {
        svg: MCMC_SVG,
        alt: "Histogram 18.000 sampel Metropolis-Hastings menempel pada kurva densitas target campuran dua punuk.",
        caption: "Sampel MH vs densitas target (tak ternormalisasi — tidak masalah bagi MH).",
      },
      tasks: [],
      reference: "Histogram menempel kurva = rantai menjelajah benar. Punuk kecil ikut terisi = lompatan antar-mode berhasil.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan MCMC, kapan yang lain?",
      prose: [
        "Empat skenario pemilihan metode inferensi Bayesian:",
        "Skenario 1 — Posterior punya bentuk tertutup (konjugat: Beta-Binomial, Normal-Normal). → Hitung langsung, tanpa MCMC. Alasan: solusi analitik selalu lebih cepat dan tepat; MCMC adalah senjata cadangan, bukan senjata utama.",
        "Skenario 2 — Posterior tak tertutup, kondisional penuh bisa disampel (model hierarkis konjugat). → Gibbs sampling. Alasan: acceptance 100%, tidak perlu menyetel proposal; tiap iterasi adalah langkah yang berguna.",
        "Skenario 3 — Posterior tak tertutup, kondisional tidak bisa disampel, dimensi puluhan. → Metropolis-Hastings dengan proposal yang disetel (acceptance 20–50%). Alasan: MH hanya butuh evaluasi pi(x) — syarat paling longgar dari semua sampler.",
        "Skenario 4 — Dimensi ratusan+, parameter berkorelasi kuat, butuh sampel efisien. → HMC/NUTS (Stan, PyMC). Alasan: random walk MH terlalu lambat di dimensi tinggi; HMC memakai gradien log-posterior untuk melangkah jauh dengan cerdas. Kenali batas MH — jangan memaksanya.",
        "Aturan praktis 10 detik: ada konjugat → analitik; kondisional bisa disampel → Gibbs; tidak bisa → MH (setel acceptance 20–50%); dimensi besar + korelasi → HMC/NUTS. Selalu: multi-rantai, cek trace, laporkan ESS.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: satu rantai panjang dianggap cukup",
        type: "pitfall",
        body: "Satu rantai bisa terlihat konvergen (trace plot rapi) padahal terjebak di satu mode dari posterior multi-mode — ia tidak pernah tahu ada mode lain. Multi-rantai dari titik awal berbeda adalah satu-satunya cara murah mendeteksi ini. R-hat mengukur ketidaksepakatan antar-rantai: jauh di atas 1 = jangan percaya siapa pun.",
      },
      reference: "Pilih sampler dari struktur masalah; validasi dengan multi-rantai + R-hat + ESS.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "PD portofolio dengan prior yang jujur",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank ingin mengestimasi probabilitas default (PD) segmen KTA baru dengan 40 observasi: 3 default. MLE memberi 3/40 = 7,5% — tetapi dengan 40 data, intervalnya lebar dan estimasi titiknya goyah. Tim memakai Bayesian: prior Beta(2, 38) (keyakinan setara 40 observasi historis dengan PD 5%) × likelihood Binomial(40, 3). Posteriornya Beta(5, 75) — tertutup, sebenarnya tak butuh MCMC. Tetapi untuk ilustrasi, mereka menjalankan MH dengan target pi(p) = p^4 (1−p)^74 (tak ternormalisasi, Beta-Binomial tanpa konstanta) selama 20.000 iterasi.",
        "Pertanyaan analisis: (1) Berapa mean posterior analitik, dan apa artinya dibanding MLE 7,5%? (2) Bagaimana memakai 18.000 sampel MH untuk interval kredibel 95%? (3) Kapan analogi ini butuh MCMC betulan (tak bisa analitik)?",
        "Pembahasan: (1) Mean Beta(5,75) = 5/80 = 6,25% — TERTARIK ke bawah dari MLE 7,5% menuju prior 5%: shrinkage Bayesian. Dengan 40 data, prior masih berpengaruh (bobot 40 vs 40). (2) Urutkan sampel; ambil persentil 2,5% dan 97,5% — itulah interval kredibel 95%, tanpa rumus, tanpa asumsi normalitas. (3) Begitu modelnya hierarkis (PD per cabang dengan prior bersama, seperti a316!) atau likelihood-nya non-standar, posterior tak lagi Beta — di sinilah MH/Gibbs menjadi satu-satunya jalan. Mini-case ini sengaja memakai kasus tertutup agar kamu bisa MEMVERIFIKASI MCMC terhadap kebenaran analitik: mean sampel ≈ 6,25% adalah kwitansi bahwa algoritmamu benar.",
        "Catatan: prior Beta(2,38) adalah pilihan yang harus bisa dipertahankan — prior bukan tempat menyembunyikan optimisme. Uji sensitivitas: ulangi dengan prior netral Beta(1,1) dan lihat seberapa jauh hasilnya bergeser.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator menyukai Bayesian untuk segmen data-tipis TETAPI membenci prior yang tidak bisa dipertahankan. Aturan mainnya: prior harus didokumentasikan sumbernya (data historis? expert judgement siapa?), dan laporan wajib menyertakan uji sensitivitas prior. MCMC yang sempurna dengan prior yang asal-asalan tetap menghasilkan keputusan yang asal-asalan.",
      },
      reference: "Verifikasi MCMC pada kasus tertutup dulu; prior harus bisa dipertahankan + uji sensitivitas.",
    },
    {
      id: "konsep-lanjutan",
      eyebrow: "Langkah 9 · Konsep lanjutan",
      title: "Membaca sampler seperti praktisi: ESS, R-hat, divergensi",
      prose: [
        "Rantai MCMC-mu punya 20.000 iterasi. Pertanyaan yang menentukan apakah angkanya bisa dipercaya bukanlah berapa iterasinya, melainkan berapa di antaranya yang benar-benar independen: effective sample size (ESS). Karena tiap titik berkorelasi dengan pendahulunya, ESS = N / (1 + 2 × jumlah autokorelasi lag). Contoh angka: rantai dengan autokorelasi lag-1 rho = 0,9 (khas MH dengan proposal terlalu kecil) — deret geometri menyederhanakan faktornya menjadi (1−rho)/(1+rho) = 0,1/1,9 ≈ 0,0526. ESS ≈ 20.000 × 0,0526 ≈ 1.053. Dari 20.000 iterasi, informasimu setara 1.053 sampel independen. Aturan praktis: ESS per parameter minimal 400 untuk estimasi mean yang stabil (Stan memberi peringatan di bawah itu), dan 1.000+ bila kamu melaporkan kuantil ekor seperti VaR posterior. Melaporkan n = 20.000 tanpa ESS adalah cara halus berbohong dengan angka besar. Contoh lanjutan: dua rantai MH untuk model yang sama — rantai A dengan rho = 0,5 memberi ESS ≈ 10.000 × 0,5/1,5 ≈ 3.333, rantai B dengan rho = 0,95 memberi ESS ≈ 10.000 × 0,05/1,95 ≈ 256. Rantai B butuh iterasi 13x lebih banyak untuk informasi yang sama — inilah mengapa penyetelan proposal (Langkah 3) langsung terbayar dalam ESS, bukan sekadar acceptance rate yang cantik.",
        "Satu rantai tidak bisa mendiagnosis dirinya sendiri — ia tidak tahu ada punuk yang belum dikunjungi. R-hat membandingkan BEBERAPA rantai dari titik awal yang jauh berbeda: ia mengukur variansi ANTAR-rantai versus variansi DALAM-rantai. R-hat ≈ 1,00 berarti rantai-rantai sudah bercampur dan lupa titik awalnya; R-hat > 1,01 untuk parameter APAPUN (termasuk yang ditransformasi) berarti belum konvergen — tambah iterasi atau perbaiki modelnya. Contoh: empat rantai memberi R-hat 1,00 untuk mean posterior tetapi 1,12 untuk sigma → jangan laporkan apa pun; masalahnya ada di geometri sigma, bukan di mean. R-hat adalah uji yang murah dan jujur: ia menghukum rantai yang terjebak di punuk berbeda, persis musuh ketiga dari Langkah 3.",
        "Cara membaca output sampler seperti praktisi: pertama buka TRACE plot (nilai parameter vs iterasi). Rantai sehat = ulat berbulu: acak stasioner tanpa tren, tanpa pola, keempat rantai saling menutupi seperti mie kusut. Pola berbahaya: tren naik atau turun (belum konvergen — tambah warmup), rantai berjalan di pita berbeda (multimodality — R-hat akan di atas 1,01), osilasi lambat (autokorelasi tinggi — ESS kecil). Kedua, lihat DENSITY plot per rantai: keempat kurva harus menumpuk nyaris identik. Bila satu rantai punya punuk yang tidak dimiliki lainnya, rantai itu menjelajah wilayah berbeda — hasil gabungannya menipu. Aturan 30 detik: trace kusut + density menumpuk + R-hat ≈ 1,00 = boleh lanjut; satu saja gagal = jangan percaya angkanya.",
        "Warmup dan sampling adalah dua FASE dengan fungsi berbeda — jangan dicampur. Warmup = fase adaptasi: sampler menyetel step size dan struktur geometri (pada HMC/NUTS), rantai belum tentu stasioner; hasilnya DIBUANG dan tidak masuk posterior. Sampling = fase produksi setelah adaptasi selesai; hasilnya DISIMPAN. Kesalahan klasik: menganggap warmup yang panjang memperbaiki sampel — tidak; warmup hanya menyiapkan sampler, kualitas posterior ditentukan oleh ESS fase sampling. Pada HMC/NUTS ada diagnosis yang lebih tajam: DIVERGENT transitions. Divergensi terjadi saat integrator numerik gagal mengikuti kelengkungan posterior (khas geometri corong pada model hierarkis). Bahkan SEDIKIT divergensi (misalnya 15 dari 4.000) berarti sampel bias — posterior yang dilaporkan bukan posterior yang benar. Solusinya bukan menambah iterasi, melainkan memperbaiki geometri: reparametrisasi (non-centered), prior yang lebih informatif, atau target acceptance lebih tinggi. Divergensi adalah sampler yang berteriak minta tolong — dengarkan, jangan abaikan.",
        "Penyetelan acceptance rate adalah seni yang punya angka. Untuk MH random-walk di dimensi tinggi, acceptance OPTIMAL ≈ 0,234 (hasil teori Roberts–Gelman–Gilks) — bukan 50%. Terlalu tinggi (90%+) berarti langkah terlalu kecil: rantai merangkak, autokorelasi mendekati 1, ESS runtuh. Terlalu rendah (di bawah 10%) berarti langkah terlalu besar: hampir semua usulan ditolak, rantai macet di tempat. Praktiknya: target 20–40% untuk MH dimensi sedang, dan biarkan NUTS menyetel sendiri (sekitar 80% adalah normal untuk HMC — jangan samakan dengan MH). Terakhir, kuantifikasi ketidakpastian estimasimu sendiri: Monte Carlo standard error, mcse = sd / akar(ESS). Contoh: sd posterior = 2,0 dan ESS = 400 → mcse = 0,1. Bila dua skenario kebijakan berbeda kurang dari 2 × mcse, perbedaan itu noise sampler — bukan temuan. Melaporkan mean posterior tanpa mcse sama seperti melaporkan survei tanpa margin of error. Satu catatan tentang thinning: mengambil tiap sampel ke-k untuk mengurangi autokorelasi jarang sepadan — ESS dari rantai penuh selalu ≥ ESS rantai yang di-thinning; thinning hanya menghemat memori. Bila memori bukan masalah, simpan semua dan biarkan ESS yang berbicara.",
      ],
      formula: String.raw`\text{ESS} = \frac{N}{1 + 2\sum_{k=1}^{\infty} \rho_k}`,
      formulaNote: "ESS = effective sample size; N = jumlah iterasi fase SAMPLING (setelah warmup dibuang); rho_k = autokorelasi lag-k rantai. Untuk rantai AR(1) dengan rho_1 = rho, penyebut menyederhanakan menjadi (1+rho)/(1−rho). Contoh: N = 20.000, rho = 0,9 → ESS ≈ 20.000 × 0,1/1,9 ≈ 1.053. Kasus ekstrem: rho = 0 (independen sempurna) → ESS = N; rho mendekati 1 → ESS runtuh ke 0. ESS adalah mata uang ketidakpastian MCMC — belanjakan untuk mean, kuantil, dan mcse.",
      tasks: [],
      note: {
        title: "Intuisi: membaca sampler seperti mekanik membaca mesin",
        body: "Tujuh heuristik bengkel sampler. Pertama, laporkan ESS, bukan N — N adalah bahan bakar yang dibakar, ESS adalah jarak yang ditempuh. Kedua, R-hat dihitung untuk SEMUA parameter termasuk yang tidak kamu pedulikan; parameter yang tidak konvergen meracuni yang lain lewat korelasi. Ketiga, trace plot selalu dibuka SEBELUM angka dipercaya — 30 detik melihat ulat berbulu versus tren menghemat 3 jam debugging. Keempat, divergensi HMC adalah satu-satunya diagnosis yang hampir pasti berarti modelnya yang salah, bukan samplernya — prioritaskan reparametrisasi di atas menambah iterasi. Kelima, jangan pernah membandingkan dua model dengan selisih skor lebih kecil dari beberapa kali mcse-nya — itu noise, bukan kemenangan. Keenam, warmup bukan tempat menabung sampel: setelah adaptasi selesai, hentikan warmup dan mulai fase sampling yang bersih; warmup 10.000 + sampling 1.000 hampir selalu kalah dari warmup 1.000 + sampling 10.000. Ketujuh, untuk model hierarkis selalu curigai geometri corong LEBIH DULU ketika divergensi muncul — centered parameterization pada variansi grup kecil adalah penyebab nomor satu; non-centered hampir selalu menjadi obat pertama yang dicoba.",
      },
      quiz: [
        {
          q: "Rantai MH: N = 10.000 iterasi sampling, autokorelasi lag-1 ≈ 0,8 (pola AR(1)). Perkiraan ESS?",
          options: [
            { text: "≈ 1.111 — ESS ≈ 10.000 × (1−0,8)/(1+0,8)", why: "Benar: faktor (1−rho)/(1+rho) = 0,2/1,8 ≈ 0,111; 10.000 × 0,111 ≈ 1.111.", correct: true },
            { text: "10.000 — semua iterasi terhitung", why: "Salah: mengabaikan autokorelasi; 10.000 iterasi berkorelasi jauh dari 10.000 independen." },
            { text: "≈ 8.000 — dikurangi 20% sebagai koreksi", why: "Salah: koreksinya bukan persentase arbitrer, melainkan 1/(1+2·jumlah rho_k) — jauh lebih besar dari 20%." },
            { text: "≈ 500 — setengah dari 1.000 minimal", why: "Salah: angka tebakan tanpa rumus; hitung dengan faktor (1−rho)/(1+rho)." },
          ],
        },
        {
          q: "Empat rantai: R-hat mean posterior = 1,00, tetapi R-hat sigma = 1,12. Tindakan yang benar?",
          options: [
            { text: "Jangan laporkan dulu — selidiki geometri sigma (reparametrisasi/tambah iterasi) sampai semua R-hat ≤ 1,01", why: "Benar: satu parameter tidak konvergen meracuni kesimpulan lewat korelasi; R-hat harus lolos untuk SEMUA parameter.", correct: true },
            { text: "Laporkan mean saja — R-hat mean sudah 1,00", why: "Salah: mean berkorelasi dengan sigma; ketidakkonvergenan sigma mencemari seluruh posterior." },
            { text: "Buang rantai yang menyimpang, pakai tiga sisanya", why: "Salah: membuang rantai yang tidak setuju adalah cherry-picking — R-hat justru dirancang untuk menghukum itu." },
            { text: "Naikkan burn-in 10x lipat", why: "Salah: burn-in membuang pengaruh titik awal; R-hat 1,12 setelah burn-in menandakan masalah geometri/eksplorasi, bukan titik awal." },
          ],
        },
        {
          q: "NUTS melaporkan 15 divergent transitions dari 4.000 iterasi sampling. Respons yang benar?",
          options: [
            { text: "Selidiki & perbaiki geometri (reparametrisasi non-centered / prior lebih informatif) — divergensi = sampel bias", why: "Benar: divergensi berarti integrator gagal mengikuti kelengkungan posterior; menambah iterasi tidak memperbaiki bias.", correct: true },
            { text: "Tambah iterasi sampai 40.000 — divergensi akan hilang sendiri", why: "Salah: divergensi adalah masalah geometri, bukan jumlah sampel; 40.000 iterasi bias tetap bias." },
            { text: "Abaikan — hanya 0,375% dari iterasi", why: "Salah: bahkan sedikit divergensi menandakan wilayah posterior yang gagal dijelajahi — biasnya tidak proporsional dengan jumlahnya." },
            { text: "Turunkan target acceptance rate ke 0,5", why: "Salah: menaikkan adapt_delta (target acceptance LEBIH tinggi, ~0,99) yang kadang membantu — menurunkannya memperparah." },
          ],
        },
      ],
      reference: "ESS = mata uang MCMC; R-hat ≤ 1,01 untuk semua parameter; divergensi = perbaiki model, bukan tambah iterasi.",
    },
    {
          id: "gap-r9-rhat",
          eyebrow: "Langkah tambahan · Gap ronde 9 (P2-G2)",
          title: "R-hat: apakah rantai-rantaimu sepakat?",
          prose: [
            "Langkah 9 mengajarkan ESS dan Monte Carlo standard error (mcse) — tetapi sebelum menghitung ESS dari SATU rantai, ada pertanyaan yang lebih mendasar: apakah beberapa rantai yang dijalankan dari titik awal berbeda sudah menuju distribusi yang SAMA? Itulah yang dijawab statistik R-hat (Gelman–Rubin). Idenya sederhana: bandingkan variansi ANTAR rantai dengan variansi DALAM rantai. Bila rantai-rantai belum sepakat, variansi antar-rantai besar dan R-hat jauh di atas 1; bila sudah konvergen, R-hat mendekati 1.",
            "Rumusnya: R-hat = √(((n−1)/n·W + B/n) / W), dengan W = rata-rata variansi dalam-rantai dan B = n × variansi antar-mean-rantai (n = panjang tiap rantai). Ambang praktis modern: R-hat < 1,01 untuk semua parameter sebelum hasil dipercaya (ambang lama 1,1 sudah dianggap longgar). R-hat TIDAK menggantikan ESS: empat rantai bisa sepakat pada jawaban yang salah (mis. semua terjebak di satu modus dari distribusi bimodal lesson ini) — jadi pakai keduanya: R-hat untuk kesepakatan antar-rantai, ESS/mcse untuk presisi.",
            "Contoh angka (4 rantai, masing-masing n = 1.000): mean rantai [0,10; 0,12; 0,09; 0,11], variansi dalam-rantai [0,04; 0,05; 0,04; 0,05]. W = 0,045. B = 1.000 × variansi([0,10; 0,12; 0,09; 0,11]) = 1.000 × 0,000167 = 0,167. V-hat = (999/1.000)×0,045 + 0,167/1.000 = 0,04512 → R-hat = √(0,04512/0,045) ≈ 1,0014 — jauh di bawah 1,01: keempat rantai sepakat. Sebaliknya, bila mean rantai tersebar [0,0; 0,5; 1,0; 1,5], B meledak dan R-hat ≫ 1,01 — jalankan lebih lama atau perbaiki proposal.",
          ],
          formula: String.raw`\hat{R} = \sqrt{\frac{\frac{n-1}{n}W + \frac{B}{n}}{W}} \qquad W = \bar{var}_{dalam}, \quad B = n \cdot var(\bar{x}_{rantai})`,
          formulaNote: "R-hat (Gelman–Rubin): bandingkan variansi antar-rantai (B) dengan dalam-rantai (W). < 1,01 = sepakat (ambang modern); > 1,1 = belum konvergen. Contoh angka: W = 0,045, B = 0,167 → R-hat ≈ 1,0014.",
          tasks: [
            { id: "t1", text: "Hitung `W` (rata-rata variansi dalam) dan `B` (n × variansi antar-mean)" },
            { id: "t2", text: "Hitung `Rhat` dan cetak ketiganya" },
          ],
          expected: "W=0.0450 B=0.1667 Rhat=1.0014",
          hints: [
            "statistics.variance memakai pembagi n−1 — untuk B, kalikan hasilnya dengan n.",
            "Vhat = ((n−1)/n)*W + B/n; Rhat = akar(Vhat/W).",
          ],
          code: {
            starter: `import statistics\nmeans = [0.10, 0.12, 0.09, 0.11]\nvars_in = [0.04, 0.05, 0.04, 0.05]\nn = 1000\n\n# TULIS KODEMU: R-hat Gelman-Rubin\nW = \nB = \nRhat = \n\nprint(f"W={W:.4f} B={B:.4f} Rhat={Rhat:.4f}")`,
            lockLines: 6,
            solution: `import statistics\nmeans = [0.10, 0.12, 0.09, 0.11]\nvars_in = [0.04, 0.05, 0.04, 0.05]\nn = 1000\n\n# TULIS KODEMU: R-hat Gelman-Rubin\nW = sum(vars_in) / len(vars_in)\nB = n * statistics.variance(means)\nVhat = ((n - 1) / n) * W + B / n\nRhat = (Vhat / W) ** 0.5\n\nprint(f"W={W:.4f} B={B:.4f} Rhat={Rhat:.4f}")`,
            checks: [
              { kind: "equal", task: "t1", name: "W", value: 0.045, tol: 0.001, label: "`W` seharusnya 0,045", msg: "Rata-rata variansi dalam-rantai." },
              { kind: "equal", task: "t1", name: "B", value: 0.1667, tol: 0.001, label: "`B` seharusnya 0,167", msg: "1.000 × variansi antar-mean rantai." },
              { kind: "equal", task: "t2", name: "Rhat", value: 1.0014, tol: 0.001, label: "`Rhat` seharusnya 1,0014", msg: "√(Vhat/W) — jauh di bawah ambang 1,01." },
              { kind: "stdout_matches", task: "t2", pattern: "W=0.0450\\s+B=0.1667\\s+Rhat=1.0014", label: "`print` menampilkan R-hat", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Empat rantai MCMC punya R-hat = 1,0008 untuk semua parameter, tetapi ESS hanya 120. Apa kesimpulannya?",
              options: [
                { text: "Rantai sepakat, tetapi presisi rendah — perpanjang rantai / kurangi autokorelasi", why: "Benar: R-hat menjawab kesepakatan antar-rantai, ESS menjawab presisi; keduanya harus lolos.", correct: true },
                { text: "Hasil sudah bisa dipercaya penuh", why: "Salah: R-hat bagus tidak menebus ESS 120 — mcse masih besar." },
                { text: "R-hat tidak valid bila ESS rendah", why: "Salah: keduanya mengukur hal berbeda dan saling melengkapi." },
              ],
            },
          ],
          reference: "R-hat = √(((n−1)/n·W + B/n)/W); < 1,01 = rantai sepakat; selalu pasangkan dengan ESS.",
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
        "MCMC membangun rantai Markov yang distribusi stasionernya = posterior — tanpa menghitung konstanta normalisasi (hilang dalam rasio).",
        "Metropolis-Hastings: usulkan x', terima dengan peluang min(1, pi(x')/pi(x)); kadang mau ke tempat lebih buruk agar menjelajah.",
        "Gibbs: sampel dari kondisional penuh tiap komponen — acceptance selalu 100%, tetapi butuh kondisional yang bisa disampel.",
        "Diagnosis wajib: burn-in, trace plot, acceptance 20–50%, multi-rantai (R-hat), autokorelasi/ESS.",
        "Sampel MCMC berkorelasi — laporkan ESS, bukan n mentah; verifikasi pada kasus tertutup bila memungkinkan.",
      ],
      quiz: [
        {
          q: "Kenapa MH tidak perlu menghitung konstanta normalisasi posterior?",
          options: [
            { text: "Karena yang dipakai hanya RASIO pi(x')/pi(x) — konstanta ada di pembilang dan penyebut lalu saling menghapus", why: "Benar: pi_takternormalisasi(x) = Z · pi_benar(x); rasionya = pi_benar(x')/pi_benar(x) — Z hilang. Inilah trik fundamental MCMC.", correct: true },
            { text: "Karena konstanta normalisasi selalu = 1", why: "Salah: konstanta normalisasi justru hampir tidak pernah 1 — ia adalah integral yang mengerikan itu." },
            { text: "Karena MH memakai prior saja, bukan posterior", why: "Salah: MH memakai target tak ternormalisasi = prior × likelihood (bentuk posterior tanpa Z) — bukan prior saja." },
            { text: "Karena burn-in menghapus konstanta", why: "Salah: burn-in membuang pengaruh titik awal, tidak ada hubungannya dengan normalisasi." },
          ],
        },
        {
          q: "Rantai MH dengan proposal sd sangat kecil menghasilkan acceptance 98%. Masalahnya?",
          options: [
            { text: "Langkah terlalu kecil: hampir semua usulan diterima tetapi rantai merangkak — eksplorasi lambat, autokorelasi ekstrem", why: "Benar: acceptance tinggi BUKAN kabar baik bila artinya langkah kerdil. Target sehat 20–50%: cukup berani melangkah, cukup sering diterima.", correct: true },
            { text: "Tidak ada masalah — acceptance tinggi berarti sampler bagus", why: "Salah: acceptance 98% dengan langkah mikro = rantai yang hampir diam. Efisiensi diukur dari ESS per detik, bukan acceptance." },
            { text: "Harus menaikkan burn-in", why: "Salah: burn-in tidak memperbaiki proposal yang buruk — rantai tetap merangkak setelah burn-in." },
            { text: "Ganti ke Gibbs sampling", why: "Salah: Gibbs bukan obat untuk proposal MH yang buruk — setel dulu proposalnya (atau memang Gibbs cocok karena kondisional tersedia, tetapi itu alasan berbeda)." },
          ],
        },
        {
          q: "Kapan Gibbs sampling lebih baik daripada Metropolis-Hastings?",
          options: [
            { text: "Ketika distribusi kondisional penuh tiap parameter bisa disampel langsung — acceptance selalu 100%", why: "Benar: Gibbs adalah MH dengan proposal sempurna. Syaratnya persis itu: kondisional yang bisa disampel (umum di model hierarkis konjugat).", correct: true },
            { text: "Selalu — Gibbs tidak pernah ditolak", why: "Salah: Gibbs HANYA bisa dipakai bila kondisionalnya bisa disampel. Bila tidak, tidak ada Gibbs yang bisa dijalankan." },
            { text: "Ketika dimensinya di atas 1.000", why: "Salah: Gibbs satu-per-satu justru lambat di dimensi sangat tinggi berkorelasi — di sana HMC/NUTS lebih baik." },
            { text: "Gibbs tidak pernah lebih baik dari MH", why: "Salah: pada model hierarkis konjugat, Gibbs jauh lebih efisien — itu alasan ia diajarkan." },
          ],
        },
        {
          q: "Tiga rantai dari titik awal berbeda: dua berkumpul di sekitar −2, satu di sekitar +3. R-hat = 2,1. Kesimpulan?",
          options: [
            { text: "Belum konvergen — posterior kemungkinan multi-mode dan rantai terjebak; jangan pakai sampelnya untuk keputusan", why: "Benar: R-hat jauh di atas 1 = rantai tidak sepakat. Satu rantai saja akan terlihat rapi dan menipu. Perlu rantai lebih panjang, tempering, atau reparametrisasi.", correct: true },
            { text: "Sudah konvergen — rata-ratakan ketiga rantai", why: "Salah: meratakan rantai yang tidak sepakat menghasilkan campuran yang tidak mewakili posterior mana pun dengan benar." },
            { text: "Buang rantai yang di +3 sebagai pencilan", why: "Salah: rantai bukan observasi yang bisa dibuang — ia mungkin menemukan mode yang sah. Investigasi, jangan hapus." },
            { text: "Naikkan burn-in hingga R-hat = 1", why: "Salah: burn-in tidak menyembuhkan jebakan mode — rantai yang terjebak tetap terjebak setelah burn-in berapa pun." },
          ],
        },
        {
          q: "Dari 20.000 sampel MCMC (autokorelasi lag-1 = 0,95), analis melaporkan n=20.000 untuk interval kredibel. Masalahnya?",
          options: [
            { text: "Sampel berkorelasi — effective sample size jauh di bawah 20.000; interval terlalu sempit (keyakinan palsu)", why: "Benar: dengan autokorelasi 0,95, ESS ≈ 20.000·(1−0,95)/(1+0,95) ≈ 513. Melaporkan n=20.000 melebih-lebihkan presisi ≈6,2× lipat (√(20.000/513) ≈ 6,2; angka 40× adalah rasio ukuran sampel N/ESS, bukan rasio presisi).", correct: true },
            { text: "Tidak ada masalah — 20.000 sampel tetap 20.000", why: "Salah: ergodic theorem menjamin konsistensi rata-rata, tetapi VARIANSI estimasi ditentukan ESS, bukan n mentah." },
            { text: "Harus thinning menjadi 513 sampel", why: "Salah: thinning membuang informasi tanpa manfaat untuk estimasi mean — yang benar adalah SESUAIKAN perhitungan SE dengan autokorelasi (pakai ESS), bukan membuang sampel." },
            { text: "MCMC tidak valid bila ada autokorelasi", why: "Salah: autokorelasi adalah sifat bawaan MCMC, bukan cacat — yang cacat adalah mengabaikannya." },
          ],
        },
      ],
    },
  ],
};
