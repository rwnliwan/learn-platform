import type { V2Lesson } from "../lib/types";

export const mle23: V2Lesson = {
  slug: "mle23-matematika-ml",
  track: "Machine Learning Engineer",
  module: "Fondasi Produksi",
  title: "MLE23 — Matematika ML: Penyegar untuk Praktisi",
  estMinutes: 65,
  steps: [
    {
      id: "peta",
      eyebrow: "Langkah 1 · Peta",
      title: "Peta lesson dan tujuan",
      prose: [
        "Lesson ini bukan kuliah matematika. Ini kotak P3K: empat cabang matematika yang paling sering menjadi akar masalah model di produksi — dan cara mengenalinya langsung dari gejalanya, tanpa membuka buku teks.",
        "Asumsinya jujur: kamu bisa coding, kamu pernah training model, tetapi rumus-rumus kuliah dulu sudah berkarat. Setiap konsep di sini langsung dikaitkan ke pertanyaan praktis: 'di ML dipakai di mana, dan gejala apa yang muncul kalau intuisinya hilang?'",
        "Tujuan lesson ini:",
        "• Mengaitkan vektor, matriks, dan SVD ke embedding, PCA, dan fenomena kolaps representasi.",
        "• Membangun intuisi gradien dan chain rule sampai bisa membaca perilaku training dari bentuk kurva loss.",
        "• Memakai teorema Bayes, maximum likelihood, dan tradeoff bias-variance untuk mendiagnosis jurang train vs validasi.",
        "• Menjelaskan kenapa learning rate, saddle point, dan konveksitas menentukan nasib optimisasi.",
        "• Memutuskan, dari gejala yang terlihat di dashboard, cabang matematika mana yang harus dibuka duluan.",
        "Isi lesson: cerita tiga minggu tuning yang sia-sia → aljabar linear → kalkulus → lab gradient descent → probabilitas → optimisasi → peta keputusan → mini-case bank → checkpoint.",
      ],
      tasks: [
      ],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "Tiga minggu tuning untuk masalah yang tidak ada di kode",
      prose: [
        "Februari 2026. Dimas, ML engineer di sebuah fintech pembiayaan, menatap dashboard yang tidak masuk akal. Model fraud-nya: akurasi training 99,8%, akurasi validasi 71,3%. Jurang 28 poin.",
        "Respons pertamanya murni engineering: tambah 200 fitur baru hasil feature crossing, berharap model 'melihat lebih banyak'. Hasilnya? Validasi turun ke 68,1%. Respons kedua: naikkan learning rate dari 0,001 ke 0,05 supaya 'training lebih cepat'. Hasilnya: loss berosilasi liar, lalu NaN di epoch ke-3. Respons ketiga: tambah 2 juta baris data. Hasilnya: tidak ada perubahan sama sekali.",
        "Tiga minggu habis. Tiga 'perbaikan' gagal total. Lalu seorang senior meluangkan 20 menit dan menemukan tiga hal tanpa menyentuh satu baris kode pun: (1) jurang train-val 28 poin adalah variance klasik — menambah fitur justru memperparah, yang dibutuhkan regularisasi; (2) learning rate 50x lipat pada loss yang curam = langkah raksasa yang melompati lembah — kalkulus dasar; (3) dari 200 fitur baru, rank efektif matriks fiturnya hanya 12 — hampir semuanya kombinasi linear dari fitur lama, jadi model tidak pernah mendapat informasi baru.",
        "Twist-nya: tidak ada bug di kode Dimas. Kode-nya berjalan sempurna — ia mengoptimasi hal yang salah dengan sangat efisien. Setiap 'perbaikan' adalah solusi coding untuk masalah matematika.",
        "Lesson ini memastikan kamu tidak menjadi Dimas berikutnya. Empat cabang matematika, empat intuisi, masing-masing dengan gejalanya sendiri.",
      ],
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: masalah model = masalah kode, jadi solusinya selalu di kode",
        type: "pitfall",
        body: "Yang benar: sebagian kegagalan model yang paling mahal berakar pada matematika — rank matriks, ukuran langkah gradien, tradeoff bias-variance. Kode yang benar secara sintaks bisa menjalankan ide yang salah secara matematis dengan sangat cepat. Diagnosis yang tepat menghemat minggu kerja; tuning buta menghabiskannya.",
      },
    },
    {
      id: "aljabar-linear",
      eyebrow: "Langkah 3 · Aljabar linear",
      title: "Vektor & matriks: si penerjemah bentuk",
      prose: [
        "Bayangkan vektor sebagai daftar angka yang punya arah — embedding sebuah dokumen, misalnya, adalah vektor 384 angka yang menunjuk ke suatu 'makna' di ruang 384 dimensi. Matriks adalah mesin yang mengubah bentuk: ia memutar, meregangkan, atau memproyeksikan vektor ke ruang lain. Perkalian matriks `Ax` bukan sekadar aritmetika — ia adalah transformasi geometris.",
        "Dua alat dari aljabar linear muncul terus di ML. Pertama, eigendecomposition: beberapa arah 'selamat' dari transformasi — hanya diskalakan, tidak diputar. Arah-arah istimewa ini (eigenvectors) adalah fondasi PCA: proyeksikan data ke arah variansi terbesar, buang sisanya, dan kamu mereduksi dimensi tanpa kehilangan banyak informasi.",
        "Kedua, SVD (singular value decomposition): setiap matriks `A` bisa dibongkar menjadi putar–regang–putar. Nilai singularnya (`σ₁ ≥ σ₂ ≥ …`) mengukur seberapa besar tiap arah diregangkan — dan inilah alat diagnosisnya: kalau `σ₁` dan `σ₂` raksasa sedangkan sisanya ≈ 0, representasimu kolaps ke dua arah. Semua vektor menunjuk hampir ke arah yang sama; cosine similarity menjadi tidak bermakna.",
        "Di ML dipakai di mana: embedding & retrieval (kualitas = geometri ruang vektor), PCA & reduksi dimensi, diagnosis multikolinearitas (matriks fitur hampir singular → koefisien liar), dan inisialisasi bobot.",
        "Cara membaca rumus SVD: `A` matriks data (m×n); `U` dan `Vᵀ` adalah rotasi (matriks ortonormal); `Σ` diagonal berisi nilai singular `σ₁ ≥ σ₂ ≥ … ≥ 0`. Interpretasi: `σᵢ` besar = arah ke-i membawa banyak 'energi' data. Kalau 2 nilai singular menjelaskan 99% energi dari 384 dimensi, ruang representasimu praktis 2 dimensi — sisanya hiasan.",
      ],
      formula: String.raw`A = U\,\Sigma\,V^T`,
      formulaNote: "A = matriks data berukuran m×n (mis. m dokumen × n dimensi embedding); U = matriks ortonormal m×m (rotasi di ruang baris); Σ = matriks diagonal m×n berisi nilai singular σ₁ ≥ σ₂ ≥ … ≥ 0, yaitu 'seberapa besar' tiap arah diregangkan; Vᵀ = matriks ortonormal n×n yang ditransposekan (rotasi di ruang kolom). Diagnosis kolaps: σ₁, σ₂ ≫ σ₃, …, σₙ ≈ 0 berarti hampir semua vektor segaris — tambah data tidak memperbaiki geometri yang runtuh.",
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: eigenvectors adalah arah yang selamat dari transformasi",
        body: "Kebanyakan arah diputar matriks ke mana-mana. Eigenvectors tidak — mereka hanya memanjang atau memendek. PCA mencari arah-arah 'penyintas' ini pada matriks kovarians data: arah dengan eigenvalue terbesar = arah dengan variansi terbesar = informasi terbanyak. Reduksi dimensi yang cerdas = buang arah yang tidak selamat dengan eigenvalue kecil.",
      },
    },
    {
      id: "kalkulus",
      eyebrow: "Langkah 4 · Kalkulus",
      title: "Gradien: kompas, bukan peta",
      prose: [
        "Turunan parsial menjawab satu pertanyaan sempit: kalau satu variabel digeser sedikit — variabel lain ditahan — seberapa sensitif output-nya? Kumpulkan semua turunan parsial menjadi satu vektor, dan kamu dapat gradien `∇f`: arah kenaikan tercuram fungsi. Lawan arahnya adalah arah penurunan tercuram — dan seluruh training deep learning pada dasarnya adalah berjalan mengikuti kompas ini, selangkah demi selangkah.",
        "Chain rule adalah lem yang menyatukan semuanya. Jaringan neural adalah fungsi bersarang raksasa: loss bergantung pada aktivasi, aktivasi bergantung pada bobot lapisan atas, yang bergantung pada lapisan bawahnya. Chain rule menghitung gradien tiap parameter dengan mengalikan turunan tiap lapisan — dari luar ke dalam. Itulah backpropagation: chain rule yang dijalankan secara sistematis, bukan algoritma mistis.",
        "Contoh langkah-demi-langkah: `z = y²`, `y = 3x + 1`, hitung `dz/dx` di `x = 2`. (1) Di `x = 2`, `y = 3(2)+1 = 7`. (2) `dz/dy = 2y = 14` — sensitivitas z terhadap y. (3) `dy/dx = 3` — sensitivitas y terhadap x. (4) Kalikan: `dz/dx = 14 × 3 = 42`. Setiap lapisan hanya perlu tahu turunan lokalnya; chain rule merangkainya menjadi gradien global.",
        "Di ML dipakai di mana: semua training berbasis gradien, diagnosis loss (datar = gradien menghilang, meledak = gradien eksplosif), dan desain learning rate.",
      ],
      formula: String.raw`\frac{dz}{dx} = \frac{dz}{dy}\cdot\frac{dy}{dx}`,
      formulaNote: "z = output akhir (mis. loss); y = variabel perantara (mis. aktivasi satu lapisan); x = input yang diturunkan terhadapnya (mis. satu bobot). Rumus ini dibaca: sensitivitas total = sensitivitas z terhadap y DIKALI sensitivitas y terhadap x. Pada backprop, z = loss, y = aktivasi tiap lapisan, x = bobot — gradien 'mengalir mundur' lapis demi lapis lewat perkalian berantai ini.",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: gradien besar = progres besar, jadi learning rate boleh besar",
        type: "pitfall",
        body: "Yang benar: gradien hanya menjawab 'ke mana' (arah), bukan 'seberapa jauh'. Jarak langkah = learning rate × besar gradien. Learning rate terlalu besar membuat langkah melompati lembah minimum — loss berosilasi, lalu divergen (NaN). Itu yang menimpa Dimas di cerita pembuka: gradiennya benar, langkahnya yang bunuh diri.",
      },
    },
    {
      id: "lab-gd",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: turunkan bukit dengan mata tertutup",
      prose: [
        "Sekarang buktikan sendiri intuisi kompas itu. Kamu akan menurunkan fungsi kuadrat `f(x) = (x−3)² + 2` — sebuah 'bukit terbalik' (mangkuk) dengan minimum di `x = 3`. Kamu tidak boleh 'melihat' jawabannya; kamu hanya boleh bertanya ke gradien: 'dari sini, ke mana arah turun?'",
        "Tiga tugas: (1) tulis gradien analitik (turunan beneran) dan gradien numerik (beda pusat: `(f(x+ε)−f(x−ε)) / 2ε`), lalu bandingkan — kalau keduanya cocok, turunanmu benar; (2) jalankan gradient descent 50 iterasi dari `x = 0` dan lihat ia merayap ke 3; (3) ulangi di 2D pada `f(x,y) = (x−2)² + 4(y+1)²` — perhatikan, arah `y` (koefisien 4) turun LEBIH CEPAT. Itulah conditioning: kelengkungan tiap arah menentukan kecepatan.",
        "Eksplorasi setelah lolos: ubah `LR` menjadi 1.1 — apa yang terjadi? (Petunjuk: langkah = 1.1 × gradien; di mangkuk ini langkah stabil hanya bila `LR < 1`.) Lalu coba 0.01 — kenapa 50 iterasi tiba-tiba tidak cukup?",
      ],
      tasks: [
        { id: "t1", text: "Tulis `grad_analitik(x)` dan `grad_numerik(x)`; hitung `selisih` keduanya di x=0.5" },
        { id: "t2", text: "Gradient descent 1D: 50 iterasi dari x=0.0 dengan LR → `x_akhir`, `loss_akhir`" },
        { id: "t3", text: "Gradient descent 2D: 50 iterasi dari (0,0) → `x2_akhir`, `y2_akhir`" },
      ],
      expected: "selisih ≈ 0 (kedua gradien cocok); x_akhir ≈ 3.0, loss_akhir ≈ 2.0; titik 2D ≈ (2.0, −1.0) dengan y konvergen lebih dulu.",
      note: {
        title: "💡 Intuisi: gradien menjawab 'ke mana', learning rate menjawab 'seberapa jauh'",
        body: "Lab ini memisahkan dua keputusan yang sering dicampur. Arah selalu benar (lawan gradien). Jarak langkah — itulah yang membuat training sukses atau NaN. Setiap kali loss berosilasi, tanyakan dulu 'langkahku kebesaran?' sebelum menyalahkan arsitektur.",
      },
      hints: [
        "Turunan (x−3)² adalah 2(x−3). Beda pusat: (f(x+E) − f(x−E)) / (2*E).",
        "Satu iterasi: x = x − LR * grad_analitik(x). Ulangi 50x dalam for.",
        "2D: turunan f terhadap x adalah 2(x−2); terhadap y adalah 8(y+1). Update keduanya tiap iterasi.",
      ],
      code: {
        starter: `# === SEED TERKUNCI: jangan ubah 10 baris berikut ===
def f(x):
    return (x - 3.0) ** 2 + 2.0

def f2(x, y):
    return (x - 2.0) ** 2 + 4.0 * (y + 1.0) ** 2

LR = 0.1
E = 1e-6

# TUGAS 1: gradien analitik & numerik dari f, bandingkan di x = 0.5
def grad_analitik(x):
    ...

def grad_numerik(x):
    ...

selisih = abs(grad_analitik(0.5) - grad_numerik(0.5))
print(f"selisih={selisih:.2e}")

# TUGAS 2: gradient descent 1D — 50 iterasi dari x = 0.0
x = 0.0
for _ in range(50):
    ...

x_akhir = x
loss_akhir = f(x_akhir)
print(f"x_akhir={x_akhir:.4f} loss_akhir={loss_akhir:.4f}")

# TUGAS 3: gradient descent 2D — 50 iterasi dari (0.0, 0.0)
x, y = 0.0, 0.0
for _ in range(50):
    ...

x2_akhir, y2_akhir = x, y
print(f"titik_akhir=({x2_akhir:.4f}, {y2_akhir:.4f})")`,
        lockLines: 10,
        solution: `# === SEED TERKUNCI: jangan ubah 10 baris berikut ===
def f(x):
    return (x - 3.0) ** 2 + 2.0

def f2(x, y):
    return (x - 2.0) ** 2 + 4.0 * (y + 1.0) ** 2

LR = 0.1
E = 1e-6

# TUGAS 1: gradien analitik & numerik dari f, bandingkan di x = 0.5
def grad_analitik(x):
    return 2.0 * (x - 3.0)

def grad_numerik(x):
    return (f(x + E) - f(x - E)) / (2.0 * E)

selisih = abs(grad_analitik(0.5) - grad_numerik(0.5))
print(f"selisih={selisih:.2e}")

# TUGAS 2: gradient descent 1D — 50 iterasi dari x = 0.0
x = 0.0
for _ in range(50):
    x = x - LR * grad_analitik(x)

x_akhir = x
loss_akhir = f(x_akhir)
print(f"x_akhir={x_akhir:.4f} loss_akhir={loss_akhir:.4f}")

# TUGAS 3: gradient descent 2D — 50 iterasi dari (0.0, 0.0)
x, y = 0.0, 0.0
for _ in range(50):
    x = x - LR * 2.0 * (x - 2.0)
    y = y - LR * 8.0 * (y + 1.0)

x2_akhir, y2_akhir = x, y
print(f"titik_akhir=({x2_akhir:.4f}, {y2_akhir:.4f})")`,
        checks: [
          {
            "kind": "defined",
            "task": "t1",
            "label": "fungsi `grad_analitik` terdefinisi",
            "name": "grad_analitik",
            "msg": "Definisikan def grad_analitik(x): return 2.0 * (x - 3.0).",
          },
          {
            "kind": "defined",
            "task": "t1",
            "label": "fungsi `grad_numerik` terdefinisi",
            "name": "grad_numerik",
            "msg": "Definisikan def grad_numerik(x): return (f(x+E) - f(x-E)) / (2.0*E).",
          },
          {
            "kind": "equal",
            "task": "t1",
            "label": "`selisih` ≈ 0 (kedua gradien cocok)",
            "name": "selisih",
            "value": 0.0,
            "tol": 1e-6,
            "msg": "Beda pusat pada fungsi kuadrat hampir eksak; selisihnya orde 1e-16.",
          },
          {
            "kind": "stdout_matches",
            "task": "t1",
            "label": "`print` menampilkan selisih",
            "pattern": "selisih=\\d\\.\\d\\de-\\d+",
            "msg": "Format: selisih={selisih:.2e}.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`x_akhir` ≈ 3.0 (minimum mangkuk)",
            "name": "x_akhir",
            "value": 3.0,
            "tol": 1e-3,
            "msg": "50 iterasi LR=0.1 dari x=0 membawa x ke ~2.99996.",
          },
          {
            "kind": "equal",
            "task": "t2",
            "label": "`loss_akhir` ≈ 2.0",
            "name": "loss_akhir",
            "value": 2.0,
            "tol": 1e-6,
            "msg": "f(3) = 0 + 2 = 2, nilai minimum fungsi.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`x2_akhir` ≈ 2.0",
            "name": "x2_akhir",
            "value": 2.0,
            "tol": 1e-3,
            "msg": "Arah x (kelengkungan 1) konvergen lebih lambat dari arah y.",
          },
          {
            "kind": "equal",
            "task": "t3",
            "label": "`y2_akhir` ≈ −1.0",
            "name": "y2_akhir",
            "value": -1.0,
            "tol": 1e-3,
            "msg": "Arah y (kelengkungan 4) mencapai −1 praktis dalam belasan iterasi.",
          },
          {
            "kind": "stdout_matches",
            "task": "t3",
            "label": "`print` menampilkan titik akhir 2D",
            "pattern": "titik_akhir=\\(2\\.0000, -1\\.0000\\)",
            "msg": "Format: titik_akhir=({x2_akhir:.4f}, {y2_akhir:.4f}).",
          },
        ],
      },
      reference: "Beda pusat (central difference) orde galat O(ε²) — jauh lebih akurat dari beda maju. GD konvergen bila LR < 2/L dengan L kelengkungan maksimum.",
    },
    {
      id: "probabilitas",
      eyebrow: "Langkah 6 · Probabilitas",
      title: "Bayes: si pembaru keyakinan",
      prose: [
        "Probabilitas di ML bukan tentang dadu — melainkan tentang keputusan di bawah ketidakpastian. Dua idenya menempati posisi sentral. Pertama, maximum likelihood (MLE — bukan orangnya, prinsipnya): pilih parameter yang membuat data yang teramati menjadi PALING MUNGKIN terjadi. Fungsi loss cross-entropy yang kamu pakai tiap hari adalah negative log-likelihood yang disamarkan — training classifier = maximum likelihood estimation.",
        "Kedua, teorema Bayes: cara yang benar memadukan 'apa yang sudah dipercaya' (prior) dengan 'apa kata data' (likelihood). Contoh konkret dengan angka: 1% transaksi adalah fraud (prior). Modelmu punya recall 99% dan false positive rate 1%. Alarm berbunyi — berapa peluang transaksi itu benar-benar fraud? Hitung: (0.99 × 0.01) / (0.99 × 0.01 + 0.01 × 0.99) = 0.0099 / 0.0198 = 50%. Model '99% akurat' hanya benar separuh waktu saat alarm berbunyi, karena fraud sangat langka. Inilah base-rate fallacy — dan alasan threshold keputusan tidak bisa dibaca dari akurasi saja.",
        "Ketiga, tradeoff bias-variance: error = bias² + variance + noise yang tak tereduksi. Model terlalu sederhana = bias tinggi (gagal di train DAN val). Model terlalu kompleks = variance tinggi (train bagus, val jeblok — persis gejala Dimas: 99,8% vs 71,3%). Obat variance bukan tambah data melulu — melainkan kurangi kompleksitas, regularisasi, atau early stopping.",
        "Di ML dipakai di mana: kalibrasi probabilitas, penentuan threshold berbasis biaya, diagnosis train/val gap, dan semua yang bernama 'likelihood' di balik layar.",
      ],
      formula: String.raw`P(H|D) = \frac{P(D|H)\,P(H)}{P(D)}`,
      formulaNote: "H = hipotesis (mis. 'transaksi ini fraud'); D = data teramati (mis. 'alarm model berbunyi'); P(H) = prior — keyakinan sebelum melihat data (1% fraud); P(D|H) = likelihood — seberapa mungkin alarm berbunyi JIKA memang fraud (99%); P(D) = peluang alarm berbunyi secara keseluruhan (pembagi normalisasi). Hasil P(H|D) = posterior — keyakinan SETELAH melihat data. Pelajaran: posterior ditentukan prior × likelihood — akurasi model (likelihood) saja tidak cukup tanpa base rate (prior).",
      tasks: [
      ],
      note: {
        title: "🚨 Mitos: output softmax 0,97 = peluang 97%",
        type: "pitfall",
        body: "Yang benar: softmax menghasilkan skor kepercayaan yang belum tentu terkalibrasi — model modern terkenal overconfident. Angka 0,97 berarti 'model sangat yakin', bukan 'kejadian ini berpeluang 97%'. Keputusan bisnis (blokir transaksi? tolak kredit?) butuh probabilitas terkalibrasi dan threshold berbasis biaya false positive vs false negative, bukan sekadar argmax.",
      },
    },
    {
      id: "optimisasi",
      eyebrow: "Langkah 7 · Optimisasi",
      title: "Pendaki buta dan jebakan saddle",
      prose: [
        "Gradient descent adalah pendaki buta: ia hanya merasakan kemiringan di bawah kakinya (gradien), lalu melangkah berlawanan arah. Aturannya satu baris — dan seluruh nasib training ditentukan oleh satu angka di dalamnya: learning rate `η`.",
        "Kasus ideal adalah fungsi konveks: mangkuk mulus dengan tepat satu minimum — pendaki buta selalu sampai, seberapa pun butanya, asal langkahnya tidak terlalu besar. Jaringan deep tidak konveks: lanskapnya penuh lembah lokal, dataran, dan jebakan yang paling sering — saddle point.",
        "Saddle point adalah titik di mana gradien ≈ 0 tetapi BUKAN minimum: ke satu arah ia lembah, ke arah lain ia puncak (seperti pelana kuda). Di dimensi tinggi, saddle jauh lebih umum daripada minimum lokal — ada begitu banyak arah sehingga peluang semuanya 'ke atas' sangat kecil. Kabar baiknya: sedikit noise (dari SGD) atau momentum biasanya cukup untuk mendorong pendaki turun dari pelana.",
        "Cara membaca: sumbu-x = satu parameter, sumbu-y = loss. Kurva turun ke minimum lokal (lembah dangkal), mendatar di saddle (gradien ≈ 0 tetapi bukan lembah), lalu turun ke minimum global (lembah terdalam). Panah zigzag = learning rate terlalu besar: langkah melompati lembah dan berosilasi.",
        "Interpretasi: gradien ≈ 0 tidak selalu berarti 'sampai'. Kalau loss berhenti turun tetapi masih jauh dari target, curigai saddle atau dataran — bukan minimum. Solusinya bukan menambah epoch, melainkan mengubah dinamika: momentum, learning rate schedule, atau noise dari batch kecil.",
      ],
      formula: String.raw`x_{t+1} = x_t - \eta\,\nabla f(x_t)`,
      formulaNote: "x_t = posisi (vektor parameter) pada iterasi t; η (eta) = learning rate — SEBERAPA JAUH tiap langkah; ∇f(x_t) = gradien loss di titik itu — ke mana arah 'naik' tercuram. Tanda minus: melangkah BERLAWANAN dengan gradien = arah turun tercuram. Tiga kegagalan klasik: η terlalu besar → osilasi/divergen; η terlalu kecil → merangkak; ∇f ≈ 0 di saddle → berhenti padahal belum sampai.",
      figure: {
        svg: `<svg viewBox="0 0 480 230" role="img" aria-label="Lanskap loss: minimum lokal, saddle point, minimum global">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Lanskap loss: tidak semua titik datar adalah lembah</text>
<line x1="30" y1="200" x2="460" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="452" y="194" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">parameter x</text>
<text x="14" y="40" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">loss</text>
<path d="M 30,60 C 70,62 95,120 140,148 C 185,176 200,120 250,112 C 300,104 320,108 350,140 C 380,172 410,186 450,164" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="140" cy="148" r="5" fill="var(--c2)"/>
<text x="140" y="172" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">minimum lokal</text>
<circle cx="285" cy="108" r="5" fill="var(--c3)"/>
<text x="285" y="92" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">saddle: gradien ≈ 0</text>
<text x="285" y="80" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">bukan minimum!</text>
<circle cx="408" cy="184" r="5" fill="var(--c4)"/>
<text x="408" y="208" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">minimum global</text>
<path d="M 60,60 L 100,140 L 70,150 L 120,80" fill="none" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4,3" marker-end="none"/>
<text x="52" y="48" font-size="10" fill="var(--c2)" font-family="var(--font-ui)">lr kebesaran: melompati lembah</text>
</svg>`,
        alt: "Kurva loss dengan minimum lokal, saddle point (datar tetapi bukan lembah), dan minimum global; panah zigzag menunjukkan osilasi akibat learning rate terlalu besar.",
        caption: "Gradien ≈ 0 di saddle bukan tanda sampai — ia tanda berhenti di tempat yang salah. Di dimensi tinggi, saddle lebih umum daripada minimum lokal.",
      },
      tasks: [
      ],
      note: {
        title: "💡 Intuisi: di dimensi tinggi, 'terjebak di minimum lokal' jarang; 'terjebak di saddle' sering",
        body: "Butuh SEMUA arah mengarah ke atas untuk menjadi minimum lokal — di ruang 1 juta dimensi itu hampir mustahil secara statistik. Saddle hanya butuh campuran arah naik dan turun, yang sangat umum. Jadi kalau training macet di loss tinggi, jangan bayangkan 'lembah buntu' — bayangkan 'pelana': butuh dorongan (momentum, noise, schedule), bukan peta baru.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Gejala → cabang matematika yang mana",
      prose: [
        "Skenario 1 — Training 99%, validasi 70%: jurang besar dan konsisten → tradeoff bias-variance (probabilitas). Obat: regularisasi, kurangi kompleksitas, early stopping. BUKAN tambah fitur — itu memperlebar jurang.",
        "Skenario 2 — Loss berosilasi liar atau NaN setelah mengubah learning rate → kalkulus + optimisasi. Cek: turunkan lr 10x; kalau stabil, diagnosis terkonfirmasi. Skala fitur yang timpang memperparah (ingat lab: arah y 4x lebih curam).",
        "Skenario 3 — Tambah fitur tetapi metrik diam; koefisien raksasa dan berubah-ubah tiap retrain → aljabar linear. Cek korelasi antar fitur, VIF, atau condition number. Obat: buang fitur kolinear, standardisasi, regularisasi L2.",
        "Skenario 4 — Model 'yakin 99%' tetapi salah melulu di segmen tertentu → probabilitas (kalibrasi + Bayes). Cek reliability diagram; sesuaikan threshold dengan biaya kesalahan, bukan dengan 0,5 default.",
        "Skenario 5 — Retrieval/similarity search mendadak buruk setelah fine-tuning → aljabar linear (SVD embedding). Cek distribusi nilai singular; kalau kolaps, masalahnya geometri ruang — bukan data, bukan hyperparameter.",
        "Aturan praktis 10 detik: (1) Lihat gejalanya — jurang train/val, loss liar, koefisien liar, yakin-tapi-salah, atau retrieval rusak? (2) Petakan ke cabang: variance → probabilitas; langkah → kalkulus/optimisasi; fitur & geometri → aljabar linear; keyakinan → Bayes/kalibrasi. (3) Uji hipotesis termurah dulu: ubah SATU angka (lr, lambda regularisasi), lihat responsnya — persis seperti studi ablasi, tetapi untuk diagnosis.",
      ],
      tasks: [
      ],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Koefisien yang berubah pikiran tiap bulan",
      prose: [
        "Bank Nusa menjalankan model PD (probability of default) berbasis logistic regression dengan 60 fitur, di-retrain tiap bulan. Tiga bulan terakhir, koefisien 'pendapatan_bulanan' tercatat: −3,42 → +2,18 → −1,05. Tanda berubah-ubah, besarannya liar. Sementara itu AUC stagnan: 0,712 → 0,709 → 0,715. Model 'baik-baik saja' menurut metrik, tetapi tidak ada analis yang berani menjelaskan koefisiennya ke regulator.",
        "Investigasi: korelasi 'pendapatan_bulanan' vs 'limit_kartu_disetujui' = 0,97 — hampir segaris. VIF pendapatan = 18,4 (ambang waspada: 10). Condition number matriks fitur terstandar = 4,8×10⁶ (ambang sehat: < 30). Rank efektif: 41 dari 60 kolom.",
        "Pertanyaan: (a) Apa diagnosisnya? (b) Kenapa AUC tetap 'lumayan' padahal koefisiennya kacau? (c) Sebutkan tiga perbaikan konkret. (d) Metrik apa yang dipantau tiap retrain agar tidak terulang?",
        "Pembahasan: (a) Multikolinearitas berat — dua kolom hampir kombinasi linear satu sama lain, matriks fitur nyaris singular (aljabar linear, Langkah 3). (b) Prediksi = kombinasi linear; bobot individual tak teridentifikasi tetapi subspace prediksinya sama — skor stabil, penjelasan hancur. Inilah bahaya metrik tunggal: AUC tidak melihat kegilaan di dalam. (c) Buang satu dari tiap pasangan berkorelasi > 0,9; standardisasi fitur; regularisasi L2 (ridge) untuk menstabilkan inversi. (d) VIF maksimum, condition number, dan rentang koefisien antar retrain — ketiganya murah dihitung, mahal kalau diabaikan. Hasil setelah perbaikan: AUC 0,728 dan koefisien stabil dalam ±0,15 antar bulan.",
      ],
      tasks: [
      ],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator (OJK/Basel) menuntut model kredit yang dapat dijelaskan — koefisien liar adalah temuan audit, bukan sekadar masalah teknis. Multikolinearitas yang dibiarkan = model risk: keputusan kredit diambil dari bobot yang tidak stabil. VIF dan condition number adalah 'asuransi murah' tiap siklus retrain.",
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi menjelaskan alasannya.",
      ],
      tasks: [
      ],
      next: { label: "MLE24 — Software Engineering untuk ML", href: "/v2/learn/mle24-software-engineering-ml" },
      quiz: [
        {
          q: "Diketahui z = y² dan y = 3x + 1. Berapa dz/dx di x = 2?",
          options: [
            {
              text: "14",
              why: "Itu baru dz/dy = 2(7) = 14 — kamu lupa mengalikan dy/dx = 3 (chain rule).",
            },
            {
              text: "42",
              why: "Tepat: y(2) = 7, dz/dy = 14, dy/dx = 3, maka dz/dx = 14 × 3 = 42.",
              correct: true,
            },
            {
              text: "12",
              why: "Tidak ada jalur perhitungan yang menghasilkan 12 — cek lagi tiap lapisan.",
            },
            {
              text: "49",
              why: "Itu y² = 49, yaitu nilai z — bukan turunannya.",
            },
          ],
        },
        {
          q: "Setelah learning rate dinaikkan 0,001 → 0,05, loss berosilasi liar lalu NaN. Diagnosis yang tepat?",
          options: [
            {
              text: "Model kurang dalam, tambah lapisan",
              why: "Arsitektur tidak ada hubungannya dengan divergensi mendadak setelah mengubah lr.",
            },
            {
              text: "Learning rate terlalu besar: langkah melompati lembah minimum",
              why: "Tepat: jarak langkah = lr × gradien. Terlalu besar = osilasi → divergen. Turunkan lr dan uji ulang.",
              correct: true,
            },
            {
              text: "Data training kurang, tambah 2x lipat",
              why: "Data tidak memperbaiki langkah optimisasi yang terlalu besar.",
            },
            {
              text: "Training kurang lama, tambah epoch",
              why: "Menambah epoch pada training yang divergen hanya mempercepat kehancuran.",
            },
          ],
        },
        {
          q: "Akurasi training 99,8%, validasi 71,3%. Tindakan paling tepat?",
          options: [
            {
              text: "Tambah 200 fitur baru",
              why: "Itu yang dilakukan Dimas — memperparah variance, validasi turun ke 68,1%.",
            },
            {
              text: "Kurangi kompleksitas / tambah regularisasi",
              why: "Tepat: jurang train-val = variance tinggi. Obatnya menyederhanakan, bukan menambah.",
              correct: true,
            },
            {
              text: "Naikkan learning rate 50x",
              why: "Itu menyebabkan NaN di cerita pembuka — salah cabang matematika.",
            },
            {
              text: "Ganti optimizer terbaru",
              why: "Optimizer tidak menyembuhkan variance struktural dari model yang terlalu kompleks.",
            },
          ],
        },
        {
          q: "Model mengeluarkan softmax 0,97 untuk kelas 'fraud'. Interpretasi yang benar?",
          options: [
            {
              text: "Peluang fraud tepat 97%",
              why: "Softmax tidak terkalibrasi — 0,97 adalah skor kepercayaan, bukan peluang empiris.",
            },
            {
              text: "Skor kepercayaan yang belum tentu terkalibrasi; keputusan butuh threshold berbasis biaya",
              why: "Tepat: kalibrasi harus diverifikasi (reliability diagram), dan threshold mengikuti biaya FP vs FN.",
              correct: true,
            },
            {
              text: "Model pasti benar, langsung blokir",
              why: "Keyakinan model bukan kebenaran — apalagi tanpa kalibrasi dan konteks base rate.",
            },
            {
              text: "Model harus di-retrain dari nol",
              why: "Overconfidence adalah soal kalibrasi, tidak otomatis berarti modelnya rusak total.",
            },
          ],
        },
        {
          q: "Embedding 384 dimensi: 2 komponen SVD menjelaskan 99,3% variansi. Artinya?",
          options: [
            {
              text: "Embedding sangat efisien, tidak ada masalah",
              why: "Efisien bukan berarti benar — 382 dimensi mati = informasi yang hilang.",
            },
            {
              text: "Representasi kolaps ke ~2 arah; tambah data tidak memperbaiki geometrinya",
              why: "Tepat: nilai singular sisanya ≈ 0 berarti semua vektor hampir segaris — cosine similarity kehilangan makna.",
              correct: true,
            },
            {
              text: "Harus naikkan dimensi ke 1024",
              why: "Dimensi lebih besar tidak menolong kalau training terus mengkolapskannya.",
            },
            {
              text: "Ini normal untuk semua retrieval",
              why: "Retrieval yang sehat menyebar di banyak arah — kolaps adalah patologi, bukan norma.",
            },
          ],
        },
        {
          q: "Di jaringan dalam berdimensi tinggi, titik dengan gradien ≈ 0 paling sering adalah…",
          options: [
            {
              text: "Minimum global",
              why: "Terlalu optimistis — gradien nol tidak menjamin lembah terdalam.",
            },
            {
              text: "Saddle point — ada arah naik dan turun; momentum/noise membantu lolos",
              why: "Tepat: di dimensi tinggi, campuran arah naik-turun jauh lebih umum daripada semua-arah-naik.",
              correct: true,
            },
            {
              text: "Titik maksimum",
              why: "Maksimum butuh semua arah menurun — sama langkanya dengan minimum di dimensi tinggi.",
            },
            {
              text: "Tanda dataset rusak",
              why: "Saddle adalah sifat lanskap optimisasi, bukan sifat data.",
            },
          ],
        },
      ],
      summary: [
        "Matriks adalah transformasi geometris; SVD membongkarnya — nilai singular yang kolaps = representasi yang runtuh.",
        "Gradien adalah kompas (arah), learning rate adalah panjang langkah — NaN biasanya soal langkah, bukan arah.",
        "Chain rule merangkai turunan lokal tiap lapisan menjadi gradien global — itulah backpropagation.",
        "Bayes: posterior = prior × likelihood — akurasi 99% bisa berarti 50% tanpa base rate.",
        "Jurang train-val = variance: obatnya menyederhanakan, bukan menambah fitur atau data.",
        "Di dimensi tinggi, gradien ≈ 0 biasanya saddle — dorong dengan momentum/noise, bukan panik.",
      ],
    },
  ],
};
