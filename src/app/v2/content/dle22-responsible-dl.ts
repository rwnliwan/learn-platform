import type { V2Lesson } from "../lib/types";

// Geometri serangan FGSM: satu titik bersih digeser ε·sign(gradien) melewati batas keputusan.
const FGSM_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram serangan FGSM: titik bersih di kanan batas keputusan digeser melewati batas menjadi titik adversarial.">
<g font-family="var(--font-ui)" font-size="12">
<line x1="300" y1="20" x2="300" y2="250" stroke="var(--chart-grid)" stroke-width="2" stroke-dasharray="8 6"/>
<text x="300" y="270" text-anchor="middle" fill="var(--text-muted)">batas keputusan (z = 0)</text>
<text x="120" y="40" text-anchor="middle" fill="var(--text-muted)">daerah "tolak / palsu"</text>
<text x="460" y="40" text-anchor="middle" fill="var(--text-muted)">daerah "terima / asli"</text>
<circle cx="380" cy="150" r="14" fill="var(--c1)" opacity="0.9"/>
<text x="380" y="185" text-anchor="middle" fill="var(--text)" font-size="11">x bersih</text>
<text x="380" y="200" text-anchor="middle" fill="var(--text-muted)" font-size="11">ditolak, yakin 99%</text>
<circle cx="240" cy="150" r="14" fill="var(--c4)" opacity="0.9"/>
<text x="240" y="185" text-anchor="middle" fill="var(--text)" font-size="11">x adversarial</text>
<text x="240" y="200" text-anchor="middle" fill="var(--text-muted)" font-size="11">lolos, yakin 91%</text>
</g>
<g stroke="var(--c4)" stroke-width="2" marker-end="url(#ahF)">
<defs><marker id="ahF" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--c4)"/></marker></defs>
<line x1="366" y1="150" x2="256" y2="150"/>
</g>
<g font-family="var(--font-ui)" font-size="12" fill="var(--text)">
<text x="311" y="135" text-anchor="middle">geser ε · sign(∇)</text>
<text x="311" y="120" text-anchor="middle" fill="var(--text-muted)" font-size="11">maks 0,2 per fitur</text>
</g>
</svg>`;

export const dle22: V2Lesson = {
  slug: "dle22-responsible-dl",
  track: "Deep Learning Engineer",
  module: "Etika & Keamanan",
  title: "DLE22 — Responsible DL: Bias, Serangan & Privasi",
  estMinutes: 60,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta lesson",
      title: "Peta lesson: tiga risiko yang tak terlihat di metrik",
      prose: [
        "Akurasi 98% menjawab satu pertanyaan: seberapa sering model benar di data uji. Ia tidak menjawab tiga pertanyaan yang justru menentukan nasib produkmu: siapa yang menanggung 2% kesalahan itu, siapa yang bisa sengaja membuat model salah, dan data siapa yang diam-diam tersimpan di dalam bobot model.",
        "Setelah lesson ini kamu bisa: (1) mengukur bias model per segmen dan membaca gap disparitasnya; (2) menjelaskan dan mendemonstrasikan serangan adversarial FGSM langsung dari gradien; (3) menjelaskan risiko privasi model — membership inference — dan konsep differential privacy; (4) mengaudit lisensi dan asal-usul dataset sebelum training dimulai.",
        "Rute lesson: cerita VerifKilat — model verifikasi dokumen yang “98,4% akurat” (langkah 2) → dari mana bias lahir dan cara mengukurnya (3) → serangan adversarial: satu gradien untuk membalik keputusan (4) → privasi dan lisensi data (5) → lab: menjatuhkan model linear dengan ε = 0,2 (6) → peta keputusan pertahanan (7) → mini-case: audit 48 jam sebelum launch (8) → checkpoint (9).",
        "Bekal yang dibutuhkan: intuisi gradien sebagai arah tercuram suatu fungsi. Setiap istilah — loss, softmax, epsilon — dijelaskan dari nol tepat di tempat ia dipakai. Tidak ada prasyarat lesson lain.",
      ],
      tasks: [],
      reference: "Tiga risiko di luar akurasi: bias per segmen, serangan adversarial, kebocoran privasi.",
    },
    {
      id: "cerita-verifikilat",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Model 98,4% akurat yang menolak orang yang salah",
      prose: [
        "Bank Artha Dana hendak meluncurkan VerifKilat: model deep learning yang memverifikasi foto KTP dari aplikasi HP, target 50.000 pengajuan per bulan. Di ruang direksi, tim data mempresentasikan angka kebanggaan: akurasi 98,4% pada 5.000 foto uji. Lampu hijau hampir diketuk.",
        "Seorang auditor meminta satu tabel tambahan: akurasi per segmen HP. Hasilnya membuat ruangan hening. 89% foto uji ternyata berasal dari HP flagship dengan pencahayaan bagus — segmen yang sama dengan data latih. Pada foto dari HP murah dengan cahaya remang — segmen mayoritas aplikan nyata — akurasinya 63%, dan false reject-nya 7,8% berbanding 1,2% di segmen flagship: 6,5 kali lipat. Yang ditolak salah sasaran: pendaftar lanjut usia dan berpenghasilan rendah, yang justru paling butuh layanan digital karena kantor cabang jauh.",
        "Twist kedua datang dari tim red-team. Mereka mengambil 200 KTP palsu yang semula 197 di antaranya terblokir (98,5%). Lalu mereka menambahkan noise ke tiap foto — maksimum 8/255 per piksel, tak terlihat mata manusia. Hasilnya: hanya 159 yang terblokir (79,5%). Sebanyak 41 KTP palsu lolos, disetujui dengan keyakinan rata-rata 91%. Model yang sama, data yang “sama”, keputusan berbalik.",
        "Dua twist, satu pelajaran: metrik yang dilaporkan tidak berbohong — ia hanya diukur di dunia yang salah. Test set mencerminkan data latih, bukan dunia nyata. Dan “tak terlihat manusia” tidak berarti “tak terlihat model”. Lesson ini memberimu tiga kacamata untuk melihat apa yang tidak terlihat di metrik: bias, serangan, dan privasi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Kasus seperti VerifKilat adalah risiko operasional + reputasi + regulasi sekaligus. OJK dan regulator global semakin menuntut fairness audit untuk model yang berdampak ke nasabah. Engineer yang bisa mengukur gap per segmen sebelum launch menyelamatkan bank dari denda dan headline.",
      },
      reference: "Angka ilustrasi kasus: akurasi global 98,4% menyembunyikan gap segmen 35 poin dan kerentanan adversarial.",
    },
    {
      id: "bias",
      eyebrow: "Langkah 3 · Bias",
      title: "Bias: model mewarisi dosa datanya",
      prose: [
        "Bias di sini bukan opini model — ia adalah kesalahan sistematis yang terkonsentrasi di segmen tertentu: kelompok usia, tipe perangkat, wilayah, atau gender. Model tidak menciptakan bias dari nol; ia mewarisi, lalu memperkuat, bias yang sudah ada di pipeline datanya.",
        "Sumber pertama: representasi data. Model hanya sebagus cermin datanya — dan cermin VerifKilat 89% memantulkan HP flagship. Segmen yang jarang muncul di data latih dipelajari setengah hati; error-nya menumpuk di sana. Sumber kedua: label. Jika data historis “disetujui/ditolak” dibuat manusia yang bias, model mempelajari pola penolakan historis itu sebagai kebenaran — diskriminasi masa lalu dikemas menjadi skor objektif.",
        "Sumber ketiga: sampling dan seleksi. Data latih sering berasal dari segmen yang paling mudah dijangkau (nasabah kota, pengguna awal), bukan dari populasi yang akan dilayani. Sumber keempat: feedback loop. Model menolak segmen A → segmen A tidak pernah menghasilkan data sukses → model makin yakin segmen A memang bermasalah. Lingkaran yang mengunci dirinya sendiri.",
        "Cara mengukurnya: lupakan sejenak akurasi global, hitung metrik per segmen (slice metrics). Untuk tiap segmen s, hitung error rate err_s, lalu baca gap-nya. Contoh VerifKilat: err_flagship = 1,6%, err_murah = 37% → gap = 35,4 poin. Satu angka ini lebih jujur daripada 98,4% di slide direksi.",
        "💡 Intuisi: akurasi global adalah rata-rata yang dibobot mayoritas. Jika 89% datamu dari satu segmen, akurasi 98% bisa berarti “sempurna di mayoritas, hancur di minoritas” — dan minoritas itu justru yang paling rentan. Selalu tanyakan: 2% error-nya menimpa siapa?",
        "Perbaikannya dimulai dari pengukuran: sampling ulang segmen yang kurang terwakili, reweighting loss per segmen, threshold keputusan per segmen, dan human review untuk penolakan di segmen rentan. Teknik lanjutan (adversarial debiasing, fairness constraints) ada — tapi tanpa pengukuran per segmen, semuanya menembak dalam gelap.",
      ],
      formula: String.raw`\mathrm{gap} = \max_s \, \mathrm{err}_s \;-\; \min_s \, \mathrm{err}_s`,
      formulaNote: "err_s = error rate (tingkat kesalahan) pada segmen s — mis. kelompok usia, tipe HP, atau wilayah. max_s = segmen dengan error tertinggi, min_s = terendah. gap = selisih keduanya dalam poin persentase. Aturan praktis: gap besar = model tidak adil, betapa pun tinggi akurasi globalnya.",
      tasks: [],
      note: {
        title: "🚨 Mitos: akurasi 98% berarti adil untuk semua orang",
        type: "pitfall",
        body: "Yang benar: akurasi adalah rata-rata — ia bisa 98% sementara satu segmen hancur total, asal segmen itu kecil. Keadilan bukan properti rata-rata; ia properti distribusi error. Yang harus dilaporkan ke direksi bukan satu angka, melainkan tabel per segmen plus gap-nya.",
      },
      reference: "Ukur err per segmen, baca gap = max − min. Perbaiki: sampling, reweight, threshold per segmen.",
    },
    {
      id: "adversarial",
      eyebrow: "Langkah 4 · Adversarial",
      title: "Adversarial: satu gradien untuk membalik keputusan",
      prose: [
        "Serangan adversarial: modifikasi input yang sangat kecil — tak terlihat manusia — namun cukup untuk membalik keputusan model. Bukan bug implementasi, melainkan konsekuensi arsitektur: model yang bisa dilatih dengan gradien bisa diserang dengan gradien yang sama.",
        "Serangan paling terkenal, FGSM (Fast Gradient Sign Method), bekerja dalam satu langkah. Idenya: hitung gradien loss terhadap INPUT (bukan terhadap bobot seperti saat training), lalu geser tiap fitur searah tanda gradien sebesar ε. Arah ini adalah arah tercepat menaikkan loss — model didorong menjauhi jawaban benar dengan anggaran perturbasi minimum.",
        "Kenapa gradien membuatnya mudah? Tiga alasan. Pertama, backprop yang dipakai training tersedia gratis untuk penyerang — satu backward pass memberi arah serangan untuk semua fitur sekaligus. Kedua, di sekitar tiap titik, network yang dalam pun berperilaku hampir linear; langkah kecil searah gradien hampir pasti menaikkan loss. Ketiga, efeknya terakumulasi: menggeser 10.000 piksel masing-masing sebesar ε searah gradien menghasilkan dorongan total yang besar, meski tiap piksel nyaris tak berubah.",
        "Varian iteratifnya disebut PGD: ulangi langkah FGSM kecil berkali-kali, tiap iterasi proyeksikan kembali ke dalam anggaran ε. PGD lebih kuat dari FGSM satu langkah — ia adalah standar emas untuk menguji ketahanan model, bukan sekadar noise acak.",
        "Cara membaca: garis putus-putus = batas keputusan; lingkaran biru = foto asli (ditolak sebagai palsu, yakin 99%); panah merah = geseran ε·sign(gradien), maksimum 0,2 per fitur; lingkaran merah = foto adversarial — hanya 0,2 lebih gelap per piksel, tapi sudah menyeberang batas dan diloloskan dengan yakin 91%.",
        "Interpretasi: serangan tidak perlu merusak gambar — cukup mendorongnya menyeberangi batas terdekat. Model dengan batas keputusan yang “berlekuk tajam” di dekat data adalah model yang rapuh, betapa pun tinggi akurasinya.",
        "💡 Intuisi: “tak terlihat manusia” ≠ “tak terlihat model”. Manusia membaca makna; model membaca pola piksel. Perturbasi adversarial dirancang di bahasa model, bukan bahasa manusia — karena itu ia tak kasatmata bagi kita tapi teriak bagi model.",
      ],
      formula: String.raw`x_{adv} = x + \varepsilon \cdot \mathrm{sign}\!\left(\nabla_x L(x, y)\right)`,
      formulaNote: "x = input asli; x_adv = input adversarial; ε (epsilon) = anggaran serangan, geser maksimum per fitur (contoh: 8/255 per piksel); ∇_x L = gradien loss terhadap INPUT — bukan terhadap bobot, inilah bedanya dengan training; sign = tanda tiap komponen gradien (+1/−1/0); y = label yang benar. Rumus ini memilih, dalam anggaran ε, perturbasi yang menaikkan loss paling cepat.",
      figure: {
        svg: FGSM_SVG,
        alt: "Diagram serangan FGSM: titik bersih di kanan batas keputusan digeser melewati batas menjadi titik adversarial.",
        caption: "Geometri FGSM: geser kecil searah tanda gradien, menyeberangi batas keputusan terdekat.",
      },
      tasks: [],
      note: {
        title: "🚨 Mitos: noise acak cukup untuk menguji ketahanan model",
        type: "pitfall",
        body: "Yang benar: noise acak mengarah ke semua arah — sebagian menaikkan loss, sebagian menurunkannya, efeknya saling menghapus. FGSM memilih satu arah terburuk untuk tiap fitur. Model yang selamat dari noise acak bisa runtuh total oleh FGSM dengan anggaran yang sama. Uji robustness wajib memakai serangan terarah (FGSM/PGD), bukan noise acak.",
      },
      reference: "x_adv = x + ε·sign(∇_x L). Gradien terhadap input = arah serangan gratis dari backprop.",
    },
    {
      id: "privasi-lisensi",
      eyebrow: "Langkah 5 · Privasi & lisensi",
      title: "Privasi: model yang mengingat terlalu banyak",
      prose: [
        "Model deep learning tidak hanya belajar pola — ia menghafal. Network besar bisa mengingat sampel latih individual, dan hafalan itu bisa diekstrak kembali. Inilah pintu masuk risiko privasi.",
        "Serangan paling dasar: membership inference. Penyerang bertanya: apakah data saya dipakai melatih model ini? Sinyalnya sederhana — model cenderung memberi loss lebih kecil dan confidence lebih ekstrem pada data yang pernah ia lihat saat training (jejak overfitting). Dengan melatih “shadow model” tiruan, penyerang mengkalibrasi pola respons itu, lalu menebak keanggotaan data target. Untuk data kesehatan atau keuangan, jawaban “ya” saja sudah merupakan kebocoran.",
        "Pertahanan berprinsip: differential privacy (DP). Intuisinya: output algoritma harus nyaris tak berubah andaikata satu baris data diganti — sehingga tidak ada output yang bisa membuktikan kehadiran satu individu. Caranya: tambahkan noise yang terkalibrasi ke gradien atau agregat saat training. Ada harga yang eksplisit: budget privasi ε (epsilon privasi — jangan tertukar dengan epsilon serangan di langkah 4). Makin kecil ε makin privat, tapi noise makin besar dan utilitas model turun. Privasi di sini bukan biner, melainkan anggaran yang dikelola.",
        "Sekilas federated learning: data tidak pernah keluar dari perangkat — yang dikirim hanya update model (gradien). Terdengar aman, tetapi gradien pun bisa di-inversi untuk merekonstruksi data (gradient inversion attack). Praktik yang benar: federated learning dikombinasikan dengan differential privacy, bukan menggantikannya.",
        "Risiko keempat: lisensi dan asal data. Dataset bukan barang bebas ambil — ia punya lisensi: Creative Commons non-komersial, klausul riset-saja, atau larangan redistribusi. Melatih model produk bank dengan dataset “riset saja” adalah pelanggaran lisensi, dan bobot model dianggap turunan dari data tersebut. Data hasil scraping menambah masalah: syarat layanan situs, PII yang ikut tersedot, dan karya berhak cipta.",
        "Sebelum training apa pun, tulis datasheet dataset: siapa mengumpulkan, untuk tujuan apa, atas persetujuan siapa, siapa yang terwakili dan siapa yang tidak, lisensi apa, dan keterbatasan apa. Lima belas menit dokumentasi di awal menghemat sengketa hukum di akhir. Checklist minimum: lisensi jelas dan kompatibel → PII difilter → asal-usul tercatat → keterbatasan representasi diakui tertulis.",
        "💡 Intuisi: model adalah kompresi data latih yang bisa bocor. Setiap kali kamu expose API yang mengembalikan confidence mentah, kamu memberi penyerang mikroskop untuk membaca hafalan model. Batasi apa yang keluar dari model — bukan hanya siapa yang boleh masuk.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: differential privacy = data 100% aman",
        type: "pitfall",
        body: "Yang benar: DP memberi jaminan probabilistik yang terukur — “peluang output berubah karena satu baris data dibatasi sekian” — bukan keamanan absolut. Budget ε yang diset longgar, implementasi noise yang salah, atau komposisi query yang tak terlacak membuat klaim DP menjadi kosmetik. DP yang benar = definisi matematis + budget tercatat + audit, bukan sekadar label.",
      },
      reference: "Hafalan model bisa diekstrak (membership inference). DP = noise terkalibrasi + budget. Dataset butuh lisensi & datasheet.",
    },
    {
      id: "lab-fgsm",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: menjatuhkan model linear dengan ε = 0,2",
      prose: [
        "Sekarang buktikan sendiri. Kamu diberi model linear mungil (z = w·x + b) yang mengklasifikasikan 200 titik dua kelas dengan akurasi bersih 99,0%. Tugasmu: terapkan FGSM persis seperti rumus di langkah 4 — gradien logistic loss terhadap input, ambil tandanya, geser sebesar ε = 0,2 — lalu ukur akurasinya.",
        "Perhatikan skalanya: tiap fitur hanya boleh bergeser maksimum 0,2 — seperlima rentang data. Tidak ada yang “merusak” data secara kasat mata. Hipotesismu sebelum menjalankan: berapa akurasi adversarial yang kamu harapkan?",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung prediksi bersih dan simpan akurasinya di `acc_clean` (persen)" },
        { id: "t2", text: "Terapkan FGSM (ε = 0,2) dan simpan akurasinya di `acc_adv` (persen)" },
        { id: "t3", text: "Cetak keduanya dengan 1 desimal" },
      ],
      expected: "akurasi_bersih=99.0%  akurasi_adversarial=24.0%",
      note: {
        title: "💡 Intuisi: kerapuhan bukan kebodohan",
        body: "Model ini “benar” secara statistik — batas keputusannya optimal untuk data bersih. Kerapuhannya datang dari geometri: banyak titik duduk dekat batas, sehingga geseran 0,2 searah gradien cukup menyeberangkannya. Akurasi tinggi dan kerapuhan adversarial bisa hidup berdampingan — itulah kenapa robustness harus diukur terpisah, bukan disimpulkan dari akurasi.",
      },
      hints: [
        "z = X @ w + b; prediksi = (z >= 0).astype(int); akurasi = 100 * rata-rata (prediksi == y).",
        "Gradien logistic loss thd x: (sigmoid(z) - y)[:, None] * w. Lalu X_adv = X + eps * np.sign(grad).",
        "Hitung ulang z dari X_adv untuk prediksi adversarial.",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(22)\n\nn = 100\nX0 = np.column_stack([np.random.normal(0.35, 0.06, n), np.random.normal(0.5, 0.06, n)])\nX1 = np.column_stack([np.random.normal(0.65, 0.06, n), np.random.normal(0.5, 0.06, n)])\nX = np.vstack([X0, X1])\ny = np.array([0]*n + [1]*n)\n\nw = np.array([1.0, 0.0]); b = -0.5\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: prediksi bersih & akurasinya\nz = \npred = \nacc_clean = \n\n# TULIS KODEMU: serangan FGSM (epsilon = 0.2)\neps = 0.2\ngrad = \nX_adv = \nz_adv = \npred_adv = \nacc_adv = \n\nprint(f"akurasi_bersih={acc_clean:.1f}%  akurasi_adversarial={acc_adv:.1f}%")`,
        lockLines: 15,
        solution: `import numpy as np\nnp.random.seed(22)\n\nn = 100\nX0 = np.column_stack([np.random.normal(0.35, 0.06, n), np.random.normal(0.5, 0.06, n)])\nX1 = np.column_stack([np.random.normal(0.65, 0.06, n), np.random.normal(0.5, 0.06, n)])\nX = np.vstack([X0, X1])\ny = np.array([0]*n + [1]*n)\n\nw = np.array([1.0, 0.0]); b = -0.5\n\ndef sigmoid(z):\n    return 1 / (1 + np.exp(-z))\n\n# TULIS KODEMU: prediksi bersih & akurasinya\nz = X @ w + b\npred = (z >= 0).astype(int)\nacc_clean = 100 * (pred == y).mean()\n\n# TULIS KODEMU: serangan FGSM (epsilon = 0.2)\neps = 0.2\ngrad = (sigmoid(z) - y)[:, None] * w\nX_adv = X + eps * np.sign(grad)\nz_adv = X_adv @ w + b\npred_adv = (z_adv >= 0).astype(int)\nacc_adv = 100 * (pred_adv == y).mean()\n\nprint(f"akurasi_bersih={acc_clean:.1f}%  akurasi_adversarial={acc_adv:.1f}%")`,
        checks: [
          { kind: "defined", task: "t1", name: "acc_clean", label: "`acc_clean` terdefinisi", msg: "Simpan akurasi prediksi bersih (persen) di acc_clean." },
          { kind: "equal", task: "t1", name: "acc_clean", value: 99.0, tol: 0.05, label: "`acc_clean` = 99.0", msg: "z = X @ w + b; pred = (z >= 0); akurasi = 100 x rata-rata (pred == y)." },
          { kind: "defined", task: "t2", name: "acc_adv", label: "`acc_adv` terdefinisi", msg: "Simpan akurasi setelah serangan FGSM di acc_adv." },
          { kind: "equal", task: "t2", name: "acc_adv", value: 24.0, tol: 0.05, label: "`acc_adv` = 24.0", msg: "grad = (sigmoid(z)-y)[:,None]*w; X_adv = X + 0.2*sign(grad); hitung ulang prediksi dari X_adv." },
          { kind: "stdout_matches", task: "t3", pattern: "akurasi_bersih=99\\.0%\\s+akurasi_adversarial=24\\.0%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "99,0% → 24,0% dengan geser maks 0,2 per fitur. Robustness ≠ akurasi.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: pertahanan apa untuk ancaman apa",
      prose: [
        "Skenario 1 — Input datang dari publik atau pihak yang tak dipercaya (upload dokumen, API terbuka). Ancaman: adversarial. → Pertahanan: adversarial training (latih dengan contoh FGSM/PGD), validasi dan sanitasi input, jangan expose confidence mentah di API, monitor distribusi input untuk deteksi drift serangan. Alasan: kamu tidak bisa mengontrol input musuh — kuatkan modelnya dan sempitkan permukaannya.",
        "Skenario 2 — Keputusan berdampak ke segmen rentan (kredit, rekrutmen, verifikasi identitas). Ancaman: bias. → Pertahanan: audit error per segmen tiap rilis dengan ambang gap maksimum, threshold keputusan per segmen, human-in-the-loop untuk penolakan di segmen rentan, dokumentasikan keterbatasan di model card. Alasan: yang tidak diukur tidak diperbaiki — gap adalah metrik rilis, bukan catatan kaki.",
        "Skenario 3 — Data latih sensitif (kesehatan, keuangan, biometrik). Ancaman: kebocoran privasi. → Pertahanan: training dengan differential privacy (DP-SGD), batasi output API (top-label saja, tanpa confidence penuh), rate limit query, kebijakan retensi dan penghapusan data. Alasan: sekali bobot bocor atau API dieksploitasi, hafalan model tidak bisa “di-unlearn” dengan murah.",
        "Skenario 4 — Dataset dari pihak ketiga atau hasil scraping. Ancaman: lisensi dan provenance. → Pertahanan: audit lisensi SEBELUM training (kompatibel komersial?), tulis datasheet dataset, filter PII otomatis + sampling manual, simpan bukti asal-usul tiap sumber. Alasan: gugatan lisensi datang setelah model menghasilkan uang — saat biaya penggantian dataset paling mahal.",
        "Aturan praktis 10 detik: (1) ukur error per segmen sebelum launch — gap besar = tunda; (2) uji dengan serangan terarah (FGSM/PGD), bukan noise acak; (3) data sensitif → DP + batasi output API; (4) dataset tanpa lisensi yang jelas = jangan training.",
      ],
      note: {
        title: "💡 Intuisi: pertahanan berlapis, bukan satu tameng",
        body: "Tidak ada satu teknik yang menutup semua risiko: adversarial training tidak memperbaiki bias, DP tidak menghentikan serangan input, audit lisensi tidak melindungi privasi. Responsible DL = lapisan pertahanan yang dipetakan per ancaman — seperti keamanan siber. Pilih lapisan dari skenario di atas sesuai ancaman dominan produkmu.",
      },
      tasks: [],
      reference: "Petakan ancaman → pertahanan: adversarial training, audit segmen, DP, audit lisensi.",
    },
    {
      id: "minicase-audit",
      eyebrow: "Langkah 8 · Mini-case",
      title: "VerifKilat: audit 48 jam sebelum launch",
      prose: [
        "Kamu auditor independen. 48 jam sebelum VerifKilat launch ke 50.000 pengajuan per bulan, kamu menerima paket angka audit (semua angka ilustrasi kasus ini). False reject: HP flagship 1,2%, HP murah 7,8%. Red-team: 200 KTP palsu → tanpa serangan 197 terblokir; dengan noise maksimum 8/255 per piksel, 41 lolos.",
        "Hitung dua angka kunci auditmu di bawah: rasio disparitas false reject, dan persentase KTP palsu yang TETAP terblokir di bawah serangan.",
        "Pembahasan: rasio 6,5× berarti aplikan HP murah — yang paling butuh layanan digital — ditolak salah 6,5 kali lebih sering. Blokir 79,5% di bawah serangan berarti 1 dari 5 KTP palsu yang diserang lolos; dengan 50.000 pengajuan per bulan, itu jalur fraud yang terbuka lebar. Tidak ada jawaban tunggal “launch atau tunda” — yang dinilai adalah penalaranmu: syarat apa yang kamu tetapkan? Paket mitigasi yang masuk akal: tunda launch umum → threshold per segmen + adversarial training + human review untuk semua penolakan → audit ulang dengan ambang gap maksimum (mis. gap ≤ 3 poin) dan uji PGD lolos ambang blokir. Keputusan tanpa angka adalah opini; keputusan dengan dua angka di atas adalah audit.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio` = false reject HP murah / HP flagship (1 desimal)" },
        { id: "t2", text: "Hitung `blokir_serangan` = % KTP palsu yang tetap terblokir di bawah serangan (1 desimal)" },
      ],
      expected: "rasio=6.5x  blokir_serangan=79.5%",
      hints: [
        "rasio = 7.8 / 1.2.",
        "Yang lolos = 41 dari 200; yang terblokir = 200 - 41. Ubah ke persen.",
        "Bulatkan 1 desimal dengan round(..., 1).",
      ],
      code: {
        starter: `# Angka audit VerifKilat (ilustrasi)\nfr_flagship, fr_murah = 1.2, 7.8   # false reject (%)\npalsu_total, palsu_lolos_serangan = 200, 41\n\n# TULIS KODEMU\nrasio = \nblokir_serangan = \n\nprint(f"rasio={rasio:.1f}x  blokir_serangan={blokir_serangan:.1f}%")`,
        lockLines: 6,
        solution: `# Angka audit VerifKilat (ilustrasi)\nfr_flagship, fr_murah = 1.2, 7.8   # false reject (%)\npalsu_total, palsu_lolos_serangan = 200, 41\n\n# TULIS KODEMU\nrasio = round(fr_murah / fr_flagship, 1)\nblokir_serangan = round((palsu_total - palsu_lolos_serangan) / palsu_total * 100, 1)\n\nprint(f"rasio={rasio:.1f}x  blokir_serangan={blokir_serangan:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "rasio", value: 6.5, tol: 0.05, label: "`rasio` = 6.5", msg: "7.8 / 1.2 = 6.5." },
          { kind: "equal", task: "t2", name: "blokir_serangan", value: 79.5, tol: 0.05, label: "`blokir_serangan` = 79.5", msg: "(200 - 41) / 200 x 100 = 79.5." },
          { kind: "stdout_matches", task: "t2", pattern: "rasio=6\\.5x\\s+blokir_serangan=79\\.5%", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Audit = dua angka + syarat mitigasi. Opini tanpa angka bukan audit.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan tentang bias, serangan adversarial, privasi, dan lisensi data. Perhatikan jebakan “sudah aman karena…” di tiap soal.",
      ],
      note: {
        title: "💡 Intuisi: tiga kacamata responsible DL",
        body: "Bias bertanya “siapa yang dirugikan?” — jawab dengan metrik per segmen. Adversarial bertanya “siapa yang bisa menyerang?” — jawab dengan uji serangan terarah. Privasi bertanya “data siapa yang bocor?” — jawab dengan DP dan pembatasan output. Tiga pertanyaan ini diajukan SEBELUM launch, bukan setelah insiden.",
      },
      tasks: [],
      summary: [
        "Bias = error sistematis per segmen; ukur dengan gap = error tertinggi − terendah, bukan akurasi global.",
        "FGSM: x_adv = x + ε·sign(∇_x L) — gradien terhadap input memberi arah serangan tercepat dalam anggaran ε.",
        "Model hampir linear secara lokal + ribuan fitur = perturbasi kecil terakumulasi menjadi pembalikan keputusan.",
        "Membership inference mengeksploitasi jejak overfitting; differential privacy = noise terkalibrasi + budget privasi, bukan keamanan absolut.",
        "Dataset butuh lisensi yang kompatibel dan datasheet; federated learning tetap butuh DP.",
      ],
      quiz: [
        {
          q: "Tim melaporkan akurasi 98,4%. Cara paling tepat menilai keadilan model?",
          options: [
            { text: "Audit error rate per segmen dan hitung gap disparitasnya", why: "Keadilan adalah properti distribusi error, bukan rata-rata — gap mengungkap segmen yang hancur di balik angka global.", correct: true },
            { text: "Menaikkan akurasi global ke 99%", why: "Akurasi lebih tinggi tidak mengubah ke mana error terkonsentrasi." },
            { text: "Menambah data latih secara acak", why: "Tanpa tahu segmen mana yang kurang terwakili, penambahan acak tidak memperbaiki representasi." },
            { text: "Mengganti ke arsitektur yang lebih dalam", why: "Kapasitas model tidak menghapus bias yang berasal dari data." },
          ],
        },
        {
          q: "Pada FGSM, arah perturbasi ε·sign(∇_x L) dipilih untuk…",
          options: [
            { text: "Menaikkan loss secepat mungkin dalam anggaran ε", why: "Gradien menunjuk arah tercuram; mengambil tandanya memaksimalkan kenaikan loss per satuan anggaran L_inf.", correct: true },
            { text: "Menurunkan loss seperti saat training", why: "Itu arah negatif gradien terhadap bobot — kebalikan dari serangan." },
            { text: "Mengacak prediksi model", why: "Keacakan tidak efisien; FGSM justru terarah ke titik terlemah." },
            { text: "Memperbesar bobot model", why: "Serangan tidak menyentuh bobot sama sekali — hanya input." },
          ],
        },
        {
          q: "Mengapa network yang sangat non-linear tetap mudah diserang FGSM satu langkah?",
          options: [
            { text: "Karena di sekitar tiap titik model berperilaku hampir linear dan perubahan kecil di ribuan fitur terakumulasi searah gradien", why: "Linearitas lokal + dimensi tinggi = dorongan total besar dari geseran per-fitur yang kecil.", correct: true },
            { text: "Karena ReLU membuat model linear secara global", why: "ReLU membuat model piecewise-linear, bukan linear global — serangan bekerja justru karena linearitas lokalnya." },
            { text: "Karena training-nya tidak konvergen", why: "Model yang konvergen sempurna pun tetap rentan — ini soal geometri, bukan kualitas training." },
            { text: "Karena noise selalu merusak prediksi", why: "Noise acak dengan anggaran sama hampir tidak berpengaruh; yang merusak adalah arahnya yang terarah." },
          ],
        },
        {
          q: "Membership inference attack memanfaatkan sinyal apa?",
          options: [
            { text: "Model memberi loss lebih kecil / confidence lebih ekstrem pada data latih — jejak overfitting", why: "Hafalan meninggalkan pola respons yang bisa dikalibrasi via shadow model untuk menebak keanggotaan.", correct: true },
            { text: "Arsitektur model yang dipakai", why: "Arsitektur tidak membocorkan keanggotaan sampel spesifik." },
            { text: "Jumlah parameter model", why: "Ukuran model tidak menyimpan informasi sampel individual yang bisa dibaca langsung." },
            { text: "Learning rate saat training", why: "Hiperparameter tidak meninggalkan jejak per-sampel." },
          ],
        },
        {
          q: "Pernyataan yang tepat tentang differential privacy (DP)?",
          options: [
            { text: "Menambah noise terkalibrasi agar output nyaris sama walau satu baris data diubah, dengan budget privasi yang terkuras tiap query", why: "DP adalah jaminan probabilistik terukur — privasi sebagai anggaran yang dikelola, bukan status biner.", correct: true },
            { text: "Menghapus semua PII dari dataset sebelum training", why: "Itu anonymization, bukan DP — dan anonymization sering gagal terhadap serangan linkage." },
            { text: "Mengenkripsi data latih agar tidak bisa dibaca", why: "Enkripsi melindungi penyimpanan, bukan informasi yang bocor lewat output model." },
            { text: "Menjamin data 100% aman dari semua serangan", why: "Tidak ada yang 100% — DP memberi batas matematis yang terukur, bukan keamanan absolut." },
          ],
        },
        {
          q: "Dataset berlisensi “non-komersial, riset saja” dipakai melatih model produk bank. Tindakan yang benar?",
          options: [
            { text: "Hentikan pemakaian, audit lisensi, ganti dataset atau negosiasi lisensi komersial, dan dokumentasikan asal data", why: "Bobot model adalah turunan dari data — pelanggaran lisensi tidak hilang karena yang dipakai “hanya modelnya”.", correct: true },
            { text: "Lanjutkan, karena yang dipakai produk adalah modelnya bukan datanya", why: "Secara hukum dan etika, model yang dilatih dari data berlisensi mewarisi batasan lisensi tersebut." },
            { text: "Hapus nama file dataset agar tidak terlacak", why: "Menghapus jejak memperburuk posisi hukum dan menghancurkan auditability." },
            { text: "Perkecil ukuran model agar tidak ketahuan", why: "Menyembunyikan pelanggaran bukan penyelesaian — dan tidak mengubah status lisensinya." },
          ],
        },
      ],
    },
  ],
};
