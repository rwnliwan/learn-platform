import type { V2Lesson } from "../lib/types";

// Tiga keluarga generatif: VAE (kode->dekode), GAN (duel), difusi (denoise bertahap).
const GEN_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Tiga keluarga generatif: VAE, GAN, dan difusi.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<text x="100" y="24" fill="var(--text)" font-weight="600">VAE</text>
<rect x="40" y="40" width="60" height="36" rx="8" fill="var(--c1)" opacity="0.9"/><text x="70" y="63" fill="#fff" font-size="11">data</text>
<rect x="120" y="40" width="60" height="36" rx="8" fill="var(--c2)" opacity="0.9"/><text x="150" y="63" fill="#fff" font-size="11">z</text>
<rect x="30" y="100" width="140" height="30" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="100" y="120" fill="var(--text-muted)" font-size="11">kode lalu rekonstruksi</text>
<text x="280" y="24" fill="var(--text)" font-weight="600">GAN</text>
<rect x="230" y="40" width="60" height="36" rx="8" fill="var(--c3)" opacity="0.9"/><text x="260" y="63" fill="#fff" font-size="11">G</text>
<rect x="310" y="40" width="60" height="36" rx="8" fill="var(--c4)" opacity="0.9"/><text x="340" y="63" fill="#fff" font-size="11">D</text>
<rect x="220" y="100" width="160" height="30" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="300" y="120" fill="var(--text-muted)" font-size="11">pemalsu vs detektif</text>
<text x="470" y="24" fill="var(--text)" font-weight="600">Difusi</text>
<rect x="420" y="40" width="28" height="28" rx="6" fill="var(--chart-grid)" opacity="0.9"/>
<rect x="452" y="40" width="28" height="28" rx="6" fill="var(--chart-grid)" opacity="0.6"/>
<rect x="484" y="40" width="28" height="28" rx="6" fill="var(--chart-grid)" opacity="0.3"/>
<rect x="516" y="40" width="14" height="28" rx="6" fill="var(--c5)" opacity="0.9"/>
<rect x="410" y="100" width="130" height="30" rx="8" fill="var(--bg-panel)" stroke="var(--border)"/>
<text x="475" y="120" fill="var(--text-muted)" font-size="11">denoise bertahap</text>
</g>
<g stroke="var(--chart-grid)" stroke-width="1.5" marker-end="url(#ah4)">
<defs><marker id="ah4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="var(--chart-grid)"/></marker></defs>
<line x1="100" y1="76" x2="120" y2="58"/><line x1="150" y1="76" x2="100" y2="100"/>
<line x1="290" y1="76" x2="310" y2="58"/>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="280" y="170">VAE: belajar memampatkan + merekonstruksi (stabil, agak buram)</text>
<text x="280" y="190">GAN: generator menipu diskriminator (tajam, training labil)</text>
<text x="280" y="210">Difusi: belajar menghapus noise selangkah demi selangkah (tajam, lambat)</text>
<text x="280" y="240" font-size="12" fill="var(--text)">2026: difusi mendominasi kualitas; GAN untuk kecepatan; VAE untuk representasi</text>
</g>
</svg>`;

export const dle11: V2Lesson = {
  slug: "dle11-generative",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE11 — Generative: VAE, GAN, Diffusion",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-sintetis",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "6.400 fraud asli + 13.600 fraud palsu = model lebih baik",
      prose: [
        "Tim fraud punya 6.400 transaksi fraud asli — terlalu sedikit untuk melatih detektor yang kuat. Seorang engineer mengusulkan hal yang terdengar gila: latih model generatif pada 6.400 fraud itu, hasilkan 13.600 transaksi fraud sintetis, gabungkan, latih detektor pada 20.000 sampel. Recall naik dari 61% ke 78%.",
        "Keberatan pertama semua orang: bukankah itu mengarang data? Jawabannya bernuansa: model generatif tidak mengarang dari nol — ia mempelajari distribusi statistik fraud asli (pola jam, nominal, merchant) lalu mengambil sampel baru dari distribusi itu. Data sintetis = interpolasi cerdas di dalam wilayah fraud yang sudah diamati, bukan halusinasi bebas.",
        "Twist-nya: data palsu memperbaiki model asli — selama yang dipalsukan adalah variasi dalam distribusi, bukan di luarnya. Lesson ini membedah tiga mesin pembuat data: VAE si pemampat jujur, GAN si seniman labil, dan difusi si pemulung noise yang sabar.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan VAE, GAN, dan difusi beserta trade-off-nya; (2) menjelaskan kapan data sintetis benar-benar membantu (dan kapan tidak); (3) menghitung rasio data sintetis vs asli yang sehat; (4) memilih keluarga generatif untuk kasus fraud-mu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Data sintetis untuk kelas minoritas (fraud, default) adalah teknik legitimate — tetapi wajib divalidasi: uji detektor pada fraud ASLI yang belum pernah dilihat, bukan pada data sintetis. Validasi pada data sintetis = mengukur seberapa baik model menghafal generatornya sendiri.",
      },
      reference: "Generatif = belajar distribusi, lalu sampling. Sintetis valid bila di dalam distribusi.",
    },
    {
      id: "vae",
      eyebrow: "Langkah 2 · VAE",
      title: "VAE: memampatkan dengan jujur",
      prose: [
        "Variational Autoencoder: encoder memetakan data x menjadi distribusi laten (μ, σ), bukan satu titik; lalu sampel z = μ + σ⊙ε dengan ε ~ N(0,1) — reparameterization trick; decoder merekonstruksi x dari z. Loss = rekonstruksi + KL divergence (agar distribusi laten dekat N(0,1), rapi dan bisa di-sampling).",
        "Reparameterization trick adalah kunci yang memungkinkan backprop: sampling langsung z ~ N(μ,σ) tidak bisa diturunkan (sampling = operasi acak), tetapi z = μ + σ·ε memindahkan keacakan ke ε yang tidak punya parameter — gradien mengalir lewat μ dan σ. Lab: μ=0,5, σ=0,2, ε=1,3 → z = 0,76. Satu baris aritmetika yang membuat seluruh VAE bisa dilatih.",
        "Kelebihan: training stabil (satu loss jelas), laten terstruktur (interpolasi bermakna: geser z = ubah atribut halus). Kelemahan: sampel cenderung buram — loss rekonstruksi (MSE) menghukum rata-rata, dan rata-rata dari banyak wajah tajam = wajah buram.",
        "💡 Intuisi: VAE belajar peta wilayah data. Laten z = koordinat; decoder = peta dari koordinat ke data. KL divergence memastikan petanya padat dan kontinu — titik acak di peta selalu memetakan ke data yang masuk akal, bukan ke jurang.",
      ],
      formula: String.raw`\mathcal{L} = \underbrace{\mathbb{E}[\log p(x|z)]}_{\text{rekonstruksi}} - \underbrace{D_{KL}(q(z|x)\,\|\,p(z))}_{\text{latent rapi}}, \qquad z = \mu + \sigma \odot \epsilon`,
      formulaNote: "L = ELBO (batas bawah yang dimaksimalkan); suku pertama = seberapa baik rekonstruksi; D_KL = jarak distribusi laten ke N(0,1) (keteraturan); z = sampel laten via reparameterization; ε = noise N(0,1); ⊙ = kali elemen-per-elemen.",
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `z` = reparameterization trick (μ=0.5, σ=0.2, ε=1.3)" },
      ],
      expected: "z=0.76",
      note: {
        title: "🚨 Mitos: VAE menghasilkan sampel setajam GAN",
        type: "pitfall",
        body: "Yang benar: loss rekonstruksi MSE mendorong prediksi rata-rata → hasil buram. VAE unggul untuk representasi dan interpolasi laten, bukan untuk fotorealisme. Butuh tajam? GAN atau difusi. Butuh laten bermakna? VAE.",
      },
      hints: [
        "z = mu + sigma * eps.",
        "0.5 + 0.2*1.3 = ?",
        "Cetak dengan :.2f",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(11)\n\nmu, sigma, eps = 0.5, 0.2, 1.3\n\n# TULIS KODEMU: reparameterization trick\nz = \n\nprint(f"z={z:.2f}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(11)\n\nmu, sigma, eps = 0.5, 0.2, 1.3\n\n# TULIS KODEMU: reparameterization trick\nz = mu + sigma*eps\n\nprint(f"z={z:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 0.76, tol: 1e-9, label: "`z` seharusnya 0.76", msg: "0.5 + 0.2x1.3 = 0.76." },
          { kind: "stdout_matches", task: "t1", pattern: "z=0\\.76", label: "`print` menampilkan z", msg: "Format: z=0.76." },
        ],
      },
      reference: "z = μ + σ·ε: pindahkan acak ke ε agar gradien mengalir.",
    },
    {
      id: "gan",
      eyebrow: "Langkah 3 · GAN",
      title: "GAN: pemalsu vs detektif dalam duel abadi",
      prose: [
        "Generative Adversarial Network: dua network berduel. Generator G membuat data palsu dari noise; diskriminator D menebak asli vs palsu. Loss: min_G max_D [E log D(x) + E log(1 − D(G(z)))]. G ingin D tertipu (D(G(z)) → 1); D ingin tidak tertipu. Keseimbangan (Nash equilibrium) = G menghasilkan data tak terbedakan dari asli.",
        "Hasilnya bisa fotorealistik — tetapi training-nya terkenal labil: mode collapse (G hanya menghasilkan 3 variasi wajah yang selalu lolos — menipu D tanpa belajar keragaman), osilasi (keduanya saling mengalahkan bergantian tanpa konvergen), dan gradien hilang (D terlalu kuat → G tidak dapat sinyal). Melatih GAN = menstabilkan duel, bukan meminimalkan satu loss.",
        "Kapan masih dipakai? Saat butuh SATU sampel cepat dan tajam (real-time). Untuk kualitas tertinggi, difusi telah menyalip; untuk stabilitas, VAE. GAN kini spesialis kecepatan.",
        "💡 Intuisi: mode collapse = murid menyontek. G menemukan 3 jawaban yang selalu lolos dari D lalu berhenti belajar — seperti murid menghafal 3 soal ujian. Obatnya: minibatch discrimination, Wasserstein loss, atau pindah ke difusi.",
      ],
      formula: String.raw`\min_G \max_D\; \mathbb{E}_{x}[\log D(x)] + \mathbb{E}_{z}[\log(1 - D(G(z)))]`,
      formulaNote: "G = generator (noise z → data palsu); D = diskriminator (data → peluang asli); x = data asli; z = noise. D memaksimalkan (bedakan benar), G meminimalkan (tipu D). Duel = permainan minimaks.",
      tasks: [],
      note: {
        title: "🚨 Mitos: training GAN seperti training supervised biasa",
        type: "pitfall",
        body: "Yang benar: tidak ada satu loss yang turun monoton — dua loss berosilasi dan keseimbangan tidak dijamin. Metrik kemajuan GAN (FID score, inspeksi visual) terpisah dari loss training. Jangan samakan loss G yang turun dengan model yang membaik; ia bisa berarti D sedang lemah.",
      },
      reference: "GAN = duel minimaks. Tajam dan cepat, tetapi labil: waspadai mode collapse.",
    },
    {
      id: "difusi",
      eyebrow: "Langkah 4 · Difusi",
      title: "Difusi: dari noise murni ke data, selangkah demi selangkah",
      prose: [
        "Model difusi bekerja terbalik dari intuisi: proses forward menghancurkan data menjadi noise murni bertahap (x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε — rumus closed-form, bisa lompat ke langkah t mana pun tanpa simulasi); model belajar proses reverse: menghapus sedikit noise per langkah. Hasilkan gambar = mulai dari noise acak, denoise 20–1.000 langkah.",
        "Mengapa ini bekerja lebih baik dari GAN? Tiap langkah reverse adalah tugas mudah (hapus sedikit noise) dengan loss jelas (prediksi noise-nya) — tidak ada duel, tidak ada mode collapse. Harganya: sampling lambat (ratusan langkah vs satu forward pass GAN) — meski distilasi langkah (consistency models) terus memangkasnya.",
        "Lab: x_0 = 1,0, ε = 0,5, ᾱ_t = 0,9ᵗ. t=10: x_10 = √0,3487×1 + √0,6513×0,5 = 0,9940 — masih mirip data asli. t=100: x_100 = 0,5051 — didominasi noise (√ᾱ_100 ≈ 0,005). Kurva penghancuran yang mulus dan terkendali — inilah yang membuat reverse-nya bisa dipelajari.",
        "💡 Intuisi: difusi = memahat dari kabut. GAN mencoba melukis kanvas kosong sekaligus (sulit, labil); difusi mulai dari patung kasar lalu menghaluskan sedikit demi sedikit (mudah per langkah, stabil total). Kesabaran mengalahkan keberanian di sini.",
        "Cara membaca: tiga kolom = VAE (kiri), GAN (tengah), difusi (kanan); tiap kolom menampilkan diagram mekanisme di atas dan ciri khas di bawah.",
        "Interpretasi: VAE memampatkan lalu merekonstruksi (stabil, agak buram); GAN mempertemukan pemalsu vs detektif (tajam, labil); difusi menghapus noise bertahap (tajam, lambat). Pilih sesuai kebutuhan: kecepatan, kualitas, atau representasi.",
      ],
      formula: String.raw`q(x_t \mid x_0) = \mathcal{N}\!\left(\sqrt{\bar{\alpha}_t}\,x_0,\; (1-\bar{\alpha}_t)\mathbf{I}\right)`,
      formulaNote: "q = distribusi forward (diketahui, tanpa parameter); x_t = data setelah t langkah noise; x_0 = data asli; ᾱ_t (alpha-bar) = produk kumulatif (1−β) hingga t — jadwal noise; I = matriks identitas. Closed-form: lompat langsung ke t tanpa simulasi.",
      figure: {
        svg: GEN_SVG,
        alt: "Tiga keluarga generatif: VAE memampatkan, GAN berduel, difusi denoise bertahap.",
        caption: "Tiga filosofi membuat data: jujur (VAE), duel (GAN), sabar (difusi).",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `x10` = forward diffusion di t=10" },
        { id: "t2", text: "Hitung `x100` = forward diffusion di t=100" },
      ],
      expected: "x10=0.9940  x100=0.5051",
      note: {
        title: "🚨 Mitos: difusi hanya GAN yang lebih lambat",
        type: "pitfall",
        body: "Yang benar: keduanya keluarga berbeda secara fundamental — GAN = duel implisit tanpa likelihood, difusi = denoising eksplisit dengan loss jelas per langkah. Difusi menang kualitas dan stabilitas justru karena ia TIDAK berduel. Lambatnya sampling adalah harga arsitektur, bukan kemalasan implementasi.",
      },
      hints: [
        "a_t = 0.9**t; x_t = sqrt(a_t)*x0 + sqrt(1-a_t)*eps.",
        "Gunakan np.sqrt.",
        "x10 = np.sqrt(0.9**10)*1.0 + np.sqrt(1-0.9**10)*0.5",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(11)\n\nx0, eps = 1.0, 0.5  # data asli, noise\n\n# TULIS KODEMU: forward diffusion closed-form\nx10 = \nx100 = \n\nprint(f"x10={x10:.4f}  x100={x100:.4f}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(11)\n\nx0, eps = 1.0, 0.5  # data asli, noise\n\n# TULIS KODEMU: forward diffusion closed-form\nx10 = np.sqrt(0.9**10)*x0 + np.sqrt(1-0.9**10)*eps\nx100 = np.sqrt(0.9**100)*x0 + np.sqrt(1-0.9**100)*eps\n\nprint(f"x10={x10:.4f}  x100={x100:.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "x10", value: 0.994, tol: 0.001, label: "`x10` sekitar 0.9940", msg: "sqrt(0.3487)*1 + sqrt(0.6513)*0.5 = 0.9940. Masih mirip data." },
          { kind: "equal", task: "t2", name: "x100", value: 0.5051, tol: 0.001, label: "`x100` sekitar 0.5051", msg: "sqrt(2.7e-5)*1 + sqrt(~1)*0.5 = 0.5051. Sudah jadi noise." },
          { kind: "stdout_matches", task: "t2", pattern: "x10=0\\.9940\\s+x100=0\\.5051", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε. Maju = hancurkan; model belajar mundurnya.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: keluarga generatif apa?",
      prose: [
        "Skenario 1 — Butuh representasi/laten bermakna (interpolasi, deteksi anomali via rekonstruksi). → VAE. Alasan: laten terstruktur + training stabil; keburaman tidak masalah untuk skor anomali.",
        "Skenario 2 — Butuh satu sampel tajam real-time (filter kamera, game). → GAN. Alasan: satu forward pass; kecepatan tak tertandingi.",
        "Skenario 3 — Butuh kualitas tertinggi, waktu tidak kritis (data sintetis, konten). → Difusi. Alasan: SOTA kualitas + stabilitas training; bayar dengan waktu sampling.",
        "Skenario 4 — Augmentasi kelas minoritas (fraud, default). → VAE/difusi tabular; validasi pada data asli. Alasan: stabilitas lebih penting dari fotorealisme; yang diukur recall pada data nyata.",
        "Skenario 5 — Data sangat sedikit (< 1 ribu). → Jangan generatif dari nol; pakai pretrained generatif + fine-tune, atau augmentasi klasik. Alasan: generator yang dilatih pada data sedikit hanya menghafal dan mengulanginya.",
        "Aturan praktis 10 detik: (1) tajam-cepat = GAN; kualitas = difusi; representasi = VAE; (2) validasi sintetis pada data asli, bukan pada generator; (3) data sedikit = jangan dari nol.",
      ],
      note: {
        title: "💡 Intuisi: sintetis harus menambah variasi",
        body: "13.600 fraud sintetis membantu HANYA jika menambah VARIASI (pola baru), bukan mengulang 6.400 pola yang sama 3x (itu = overfit yang disamarkan). Uji: latih DENGAN vs TANPA sintetis pada data UJI yang benar-benar baru. Naik = variasi nyata; turun/tetap = pengulangan. Data sintetis = bumbu, bukan makanan utama.",
      },
      tasks: [],
      reference: "GAN = cepat-tajam. Difusi = kualitas. VAE = representasi. Validasi di data asli.",
    },
    {
      id: "minicase-augment",
      eyebrow: "Langkah 6 · Mini-case",
      title: "13.600 fraud sintetis: berapa rasionya?",
      prose: [
        "Kembali ke cerita pembuka: 6.400 fraud asli, target 20.000 sampel training. Hitung: sintetis dibutuhkan = 13.600; rasio sintetis/asli = 2,12. Artinya setiap fraud asli rata-rata diwakili 2,12 variasi sintetis — masih dalam batas wajar (praktik umum 1–5×; di atas 10×, model mulai belajar artefak generator).",
        "Protokol validasi yang benar: (1) bagi fraud asli 80/20 SEBELUM generate; (2) latih generator hanya pada 80%; (3) uji detektor pada 20% yang tidak pernah dilihat generator. Recall 61% → 78% pada data yang steril ini = klaim yang bisa dipertahankan ke auditor.",
        "Pembahasan: angka 2,12 bukan sekadar aritmetika — ia adalah batas kepercayaan. Terlalu banyak sintetis = detektor menghafal gaya generator, bukan pola fraud. Dokumentasikan rasio ini sebagai asumsi risiko model.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `sintetis` = sampel sintetis yang dibutuhkan" },
        { id: "t2", text: "Hitung `rasio` = sintetis/asli (2 desimal)" },
      ],
      expected: "sintetis=13600  rasio=2.12",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memvalidasi detektor pada data sintetis lalu mengklaim recall 95%. Itu mengukur seberapa baik detektor mengenali generatornya sendiri — sirkular dan menipu. Validasi harus pada data asli yang steril dari proses generate.",
      },
      hints: [
        "sintetis = target - asli.",
        "rasio = sintetis / asli, bulatkan 2 desimal.",
        "sintetis = 20000 - 6400",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(11)\n\nasli, target = 6400, 20000\n\n# TULIS KODEMU\nsintetis = \nrasio = \n\nprint(f"sintetis={sintetis}  rasio={rasio}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(11)\n\nasli, target = 6400, 20000\n\n# TULIS KODEMU\nsintetis = target - asli\nrasio = round(sintetis/asli, 2)\n\nprint(f"sintetis={sintetis}  rasio={rasio}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sintetis", value: 13600, tol: 1e-9, label: "`sintetis` seharusnya 13600", msg: "20000 - 6400 = 13600." },
          { kind: "equal", task: "t2", name: "rasio", value: 2.12, tol: 0.01, label: "`rasio` seharusnya 2.12", msg: "13600/6400 = 2.12." },
          { kind: "stdout_matches", task: "t2", pattern: "sintetis=13600\\s+rasio=2\\.12", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Rasio sintetis/asli 1-5x wajar. Validasi pada data asli yang steril.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang tiga keluarga generatif.",
      ],
      note: {
        title: "💡 Intuisi: GAN = duel yang bisa macet",
        body: "GAN = pemalsu vs detektif. Jika detektif TERLALU KUAT (diskriminator sempurna), pemalsu tidak belajar apa-apa (gradient nol) — duel macet. Tanda: loss diskriminator ~0 terus. Solusi: seimbangkan (latih generator lebih sering / arsitektur seimbang). Duel yang timpang = tidak ada yang belajar — di GAN maupun di organisasi.",
      },
      tasks: [],
      summary: [
        "VAE: z = μ + σ⊙ε (reparameterization) — stabil, laten bermakna, sampel agak buram.",
        "GAN: min_G max_D — tajam dan cepat, tetapi labil (mode collapse).",
        "Difusi: x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε — kualitas SOTA, sampling lambat.",
        "Pilih: GAN = cepat-tajam, difusi = kualitas, VAE = representasi.",
        "Data sintetis valid di dalam distribusi; validasi pada data asli yang steril.",
      ],
      next: { label: "DLE12 — Capstone: Fine-Tune Klasifier Teks & Pipeline OCR", href: "/v2/learn/dle12-capstone" },
      quiz: [
        {
          q: "Fungsi reparameterization trick z = μ + σ·ε?",
          options: [
            { text: "Mempercepat sampling", why: "Kecepatan bukan tujuannya." },
            { text: "Memindahkan keacakan ke ε agar gradien bisa mengalir lewat μ, σ", why: "Sampling langsung tak terdiferensiasi; trik ini membuat VAE bisa dilatih dengan backprop.", correct: true },
            { text: "Mengurangi parameter", why: "Parameter tetap sama." },
            { text: "Membuat sampel lebih tajam", why: "Ketajaman ditentukan loss rekonstruksi, bukan trik ini." },
          ],
        },
        {
          q: "Gejala mode collapse pada GAN?",
          options: [
            { text: "Loss tidak turun", why: "Loss GAN memang berosilasi; itu bukan gejalanya." },
            { text: "Generator hanya menghasilkan sedikit variasi yang selalu lolos", why: "G menemukan jalan pintas: 3 pola yang menipu D tanpa belajar keragaman.", correct: true },
            { text: "Training terlalu cepat", why: "Bukan gejala yang dikenal." },
            { text: "Sampel buram", why: "Itu gejala VAE, bukan GAN." },
          ],
        },
        {
          q: "Pada t=100 dengan ᾱ_t = 0,9ᵗ, x_100 ≈ 0,5051 untuk x_0=1, ε=0,5. Artinya?",
          options: [
            { text: "Data masih utuh", why: "√ᾱ_100 ≈ 0,005 — kontribusi data asli praktis nol." },
            { text: "Sudah menjadi noise yang didominasi ε", why: "Suku noise √(1−ᾱ)≈1 mendominasi; inilah tujuan forward process.", correct: true },
            { text: "Rumusnya salah", why: "Rumusnya tepat; hasilnya memang noise." },
            { text: "Harus diulang", why: "Tidak ada yang rusak." },
          ],
        },
        {
          q: "Butuh 1.000 gambar produk tajam dalam 1 detik. Pilihan?",
          options: [
            { text: "Difusi 1000 langkah", why: "Kualitas terbaik tetapi terlalu lambat untuk 1 detik." },
            { text: "GAN", why: "Satu forward pass per sampel — kecepatan tak tertandingi untuk real-time.", correct: true },
            { text: "VAE", why: "Cepat tetapi sampel cenderung buram." },
            { text: "Tidak mungkin", why: "GAN dirancang untuk ini." },
          ],
        },
        {
          q: "Validasi model yang dilatih dengan data sintetis harus dilakukan pada?",
          options: [
            { text: "Data sintetis juga", why: "Sirkular: mengukur kemampuan mengenali generator sendiri." },
            { text: "Data asli yang tidak pernah dilihat generator", why: "Satu-satunya bukti generalisasi ke dunia nyata.", correct: true },
            { text: "Data training asli", why: "Itu mengukur hafalan, bukan generalisasi." },
            { text: "Tidak perlu validasi", why: "Justru paling perlu: risiko artefak generator." },
          ],
        },
      ],
    },
  ],
};
