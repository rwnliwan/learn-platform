import type { V2Lesson } from "../lib/types";

const FIG_BOUND = `<svg viewBox="0 0 480 280" role="img" aria-label="Batas atas PD turun seiring bertambahnya data tanpa default.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Makin lama tanpa default, makin kecil batas PD</text>
<text x="10" y="55" font-size="11" fill="var(--chart-text)">n=50</text>
<rect x="90" y="42" width="200" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="296" y="59" font-size="11" fill="var(--chart-text)">2,77%</text>
<text x="10" y="95" font-size="11" fill="var(--chart-text)">n=100</text>
<rect x="90" y="82" width="100" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="196" y="99" font-size="11" fill="var(--chart-text)">1,39%</text>
<text x="10" y="135" font-size="11" fill="var(--chart-text)">n=200</text>
<rect x="90" y="122" width="50" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="146" y="139" font-size="11" fill="var(--chart-text)">0,69%</text>
<text x="10" y="175" font-size="11" fill="var(--chart-text)">n=500</text>
<rect x="90" y="162" width="20" height="24" fill="var(--c1)" opacity="0.6"/>
<text x="116" y="179" font-size="11" fill="var(--chart-text)">0,28%</text>
<text x="10" y="215" font-size="11" fill="var(--chart-text)">Nol default ≠ PD nol — batas atasnya menyusut dengan data.</text>
<text x="10" y="235" font-size="11" fill="var(--chart-text)">Keyakinan 75%: PD ≤ −ln(0,25)/n.</text>
<text x="10" y="262" font-size="10" fill="var(--chart-text)" opacity="0.75">Metode Pluto–Tasche (most prudent estimation), ilustrasi.</text>
</g>
</svg>`;

const FIG_BAYES = `<svg viewBox="0 0 480 250" role="img" aria-label="Prior dan posterior Beta setelah 200 observasi tanpa default.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Data menarik keyakinan ke bawah</text>
<text x="10" y="55" font-size="11" fill="var(--chart-text)">Prior: Beta(1, 99)</text>
<rect x="170" y="42" width="200" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="376" y="59" font-size="11" fill="var(--chart-text)">mean 1,00%</text>
<text x="10" y="105" font-size="11" fill="var(--chart-text)">+ 200 tanpa default</text>
<text x="235" y="100" font-size="18" fill="var(--chart-text)">↓</text>
<text x="10" y="135" font-size="11" fill="var(--chart-text)">Posterior: Beta(1, 299)</text>
<rect x="170" y="122" width="67" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="243" y="139" font-size="11" fill="var(--chart-text)">mean 0,33%</text>
<text x="10" y="175" font-size="11" fill="var(--chart-text)">200 observasi bersih memangkas estimasi 3x lipat — tetapi tidak ke nol.</text>
<text x="10" y="205" font-size="10" fill="var(--chart-text)" opacity="0.75">Posterior mean = a/(a+b) = 1/300. Keyakinan naik, PD turun terkendali.</text>
</g>
</svg>`;

export const cr31: V2Lesson = {
  slug: "cr31-low-default-portfolio",
  track: "Credit Risk",
  module: "Pemodelan PD Lanjut",
  title: "CR31 — Low Default Portfolios: PD Saat Tak Ada yang Gagal",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Nol default dalam sepuluh tahun",
      prose: [
        "Bank Nusantara punya portofolio pinjaman ke bank-bank kecil: 200 debitur-tahun, NOL default dalam sepuluh tahun. Analis muda mengusulkan: 'PD-nya 0% — ECL nol, modal nol.' Kepala model risk hampir tersedak. 'Kalau PD-nya nol, kenapa kita menagih bunga risiko?'",
        "Twist-nya: nol default justru adalah MASALAH statistik, bukan kabar baik. Dengan nol kejadian, data tidak memberi tahu seberapa kecil PD sebenarnya — hanya bahwa ia 'cukup kecil untuk tidak terlihat dalam 200 observasi'. PD 0% berarti 'mustahil gagal' — klaim yang tidak bisa dipertahankan untuk entitas apa pun. Regulator (Basel) eksplisit: PD tidak boleh nol; ada floor 0,03% untuk korporasi/bank.",
        "Ada analogi yang membuat ini intuitif: kamu melempar koin 200 kali dan tidak pernah dapat sisi gambar. Apakah koinnya 'pasti' dua sisi angka? Atau koinnya bias 99 banding 1? Data 200 lemparan tidak bisa membedakan 'pasti' dari 'hampir pasti' — dan perbedaan keduanya adalah seluruh isi lesson ini. Kredit LDP adalah koin yang belum pernah menunjukkan sisi gambarnya.",
        "Inilah low default portfolio (LDP): segmen dengan default historis nyaris nol — sovereign, bank, korporasi besar berperingkat tinggi. Lesson ini tentang mengestimasi PD secara jujur saat data 'diam'. Setelah lesson ini kamu bisa: (1) menjelaskan mengapa PD tidak boleh nol; (2) menghitung batas atas PD ala Pluto–Tasche; (3) melakukan update Bayesian atas PD; (4) memilih pendekatan untuk portofolio LDP.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "LDP adalah ujian kedewasaan model risk: model yang 'bagus' di portofolio ritel (data melimpah) bisa menjadi berbahaya di LDP bila analisnya tidak paham ketidakpastian estimasi. Regulator menguji ini lewat validasi model — dan analis yang bisa menjelaskan most prudent estimation lolos ujian itu.",
      },
      reference: "Nol default ≠ PD nol. Estimasi = batas atas yang jujur.",
    },
    {
      id: "masalah",
      eyebrow: "Langkah 2 · Konsep",
      title: "Mengapa nol adalah jawaban yang salah",
      prose: [
        "Argumen naif: 'tidak pernah gagal → PD = 0'. Argumen statistik: peluang tidak melihat default dalam n observasi bila PD sebenarnya p adalah (1−p)^n. Untuk n=200 dan p=1%: (0,99)^200 ≈ 13% — sangat mungkin tidak melihat default meski PD 1%! Data 'diam' kompatibel dengan banyak nilai PD — termasuk yang tidak nol.",
        "Argumen bisnis: PD 0% → ECL 0 → modal 0 → bunga risiko 0. Bila bank benar-benar percaya PD nol, ia harus memberi pinjaman tanpa spread risiko. Tidak ada bank yang mau — revealed preference membuktikan tidak ada yang percaya PD nol, termasuk yang mengusulkannya.",
        "Argumen regulasi: Basel menetapkan floor PD 0,03% untuk eksposur korporasi, sovereign, dan bank. Di bawah itu tidak boleh — berapa pun 'bersihnya' historimu. Floor adalah pengakuan resmi bahwa ketidakpastian estimasi tidak bisa dihilangkan.",
        "Tiga miskonsepsi. Satu: 'Data 10 tahun tanpa default = bukti PD nol.' Bukan bukti — hanya bukti PD cukup kecil untuk lolos 200 observasi. Dua: 'Floor 0,03% = PD sebenarnya.' Bukan — floor adalah batas bawah regulasi, bukan estimasi; estimasi yang jujur biasanya jauh di atasnya. Tiga: 'LDP tidak butuh model.' Justru butuh metodologi KHUSUS — inilah pelajarannya.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Kami pakai PD 0,03% (floor) — sudah konservatif.” Floor bukan estimasi konservatif — ia batas bawah. Estimasi konservatif yang benar (mis. 0,69% dari Pluto–Tasche untuk n=200) bisa 20x lipat dari floor. Memakai floor sebagai estimasi = meremehkan risiko 20x.",
      },
      hints: [
        "Uji cepat: bila PD usulanmu membuatmu nyaman memberi pinjaman tanpa spread, PD itu salah.",
        "Selalu laporkan n (obligor-tahun) bersama PD — tanpa n, angka PD LDP tidak bermakna.",
      ],
      reference: "(1−p)^n = peluang 'diam'. Floor 0,03% ≠ estimasi.",
    },
    {
      id: "pluto",
      eyebrow: "Langkah 3 · Konsep",
      title: "Pluto–Tasche: batas atas yang jujur",
      prose: [
        "Metode most prudent estimation (Pluto & Tasche): daripada menebak PD, hitung BATAS ATAS PD pada tingkat keyakinan tertentu. Logikanya: cari p terbesar sehingga peluang tidak melihat default dalam n observasi masih ≥ (1−γ). Rumusnya: PD ≤ −ln(1−γ)/n.",
        "Contoh: n=200 obligor-tahun tanpa default, keyakinan 75% (γ=0,75): PD ≤ −ln(0,25)/200 = 1,386/200 = 0,69%. Artinya: kita 75% yakin PD sebenarnya di bawah 0,69%. Bukan 'PD = 0,69%' — melainkan 'PD tidak lebih dari 0,69% dengan keyakinan 75%'. Kejujuran statistik dalam bentuk paling murni.",
        "Kepribadiannya: metode ini pesimis secara prinsip (most prudent = paling hati-hati) — ia memberi angka terbesar yang masih konsisten dengan data. Makin banyak data tanpa default (n besar), batasnya makin kecil: n=500 → 0,28%. Data 'membeli' keyakinan — tetapi tidak pernah membeli kepastian nol.",
        "Cara membaca figur: batang menyusut seiring n bertambah. Interpretasi: setiap 100 obligor-tahun bersih 'membayar' penurunan batas PD — inilah nilai ekonomi dari histori yang bersih. Bank dengan histori panjang boleh memakai PD lebih rendah — secara sah.",
      ],
      formula: String.raw`\text{PD}_{\text{upper}} = \frac{-\ln(1-\gamma)}{n}`,
      formulaNote: "γ = tingkat keyakinan (0,75); n = obligor-tahun tanpa default. Contoh: −ln(0,25)/200 = 0,69%. Interpretasi: batas atas, bukan estimasi titik — 'PD tidak melebihi ini' pada keyakinan γ.",
      figure: {
        svg: FIG_BOUND,
        alt: "Batas atas PD menyusut dengan bertambahnya n.",
        caption: "Nol default ≠ PD nol. Data membeli keyakinan, bukan kepastian.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        type: "risk",
        body: "Pluto–Tasche membalik pertanyaan: bukan 'berapa PD-nya?' melainkan 'berapa PD TERBESAR yang masih masuk akal?' Untuk LDP, pertanyaan kedua jauh lebih jujur — dan regulator menghargai kejujuran yang bisa dihitung.",
      },
      hints: [
        "γ=75% adalah standar praktik; γ lebih tinggi = batas lebih konservatif.",
        "n = obligor × tahun — 50 debitur × 4 tahun = 200, sama nilainya dengan 200 × 1 tahun.",
      ],
      reference: "PD ≤ −ln(1−γ)/n. Batas atas, bukan titik.",
    },
    {
      id: "bayes",
      eyebrow: "Langkah 4 · Konsep",
      title: "Bayesian: keyakinan yang diperbarui data",
      prose: [
        "Pendekatan kedua: Bayesian. Mulai dari prior — keyakinan awal tentang PD, mis. Beta(1, 99) dengan mean 1% ('kami pikir PD sekitar 1%, tetapi tidak yakin'). Lalu update dengan data: 200 observasi, 0 default. Posterior = Beta(1+0, 99+200) = Beta(1, 299), mean = 1/300 = 0,33%.",
        "Perhatikan yang terjadi: data yang 'diam' TETAP informatif — ia memangkas estimasi dari 1% menjadi 0,33%, tiga kali lipat. Tetapi tidak ke nol: prior yang jujur (tidak pernah yakin PD=0) + data = posterior yang tetap positif. Bayesian memaksa analis menyatakan keyakinan awalnya secara eksplisit — tidak bisa bersembunyi di balik 'data tidak ada'.",
        "Perbandingan dua metode: Pluto–Tasche memberi batas atas (0,69%) tanpa butuh prior — cocok bila tidak mau berdebat soal asumsi awal. Bayesian memberi estimasi titik (0,33%) tetapi butuh prior yang bisa dipertahankan. Praktik terbaik: pakai keduanya — bila Bayesian memberi angka jauh di bawah Pluto–Tasche, curigai priormu terlalu optimis.",
        "Dua miskonsepsi. Satu: 'Prior = tebakan bebas.' Prior harus bisa dipertahankan (data eksternal, rating, expert judgment terdokumentasi) — bukan angka sesuka hati. Dua: 'Bayesian selalu lebih baik.' Tanpa prior yang jujur, Bayesian hanya mengemas tebakan dengan matematika indah.",
      ],
      formula: String.raw`\text{Beta}(a,b): \quad \text{mean} = \frac{a}{a+b} \quad ; \quad a' = a + d, \; b' = b + (n-d)`,
      formulaNote: "a,b = parameter prior; d = jumlah default; n = observasi. Contoh: Beta(1,99) + 200 observasi 0 default → Beta(1,299), mean 1/300 = 0,33%. Interpretasi: data bersih menggeser keyakinan ke bawah, terkendali.",
      figure: {
        svg: FIG_BAYES,
        alt: "Prior Beta(1,99) menjadi posterior Beta(1,299).",
        caption: "200 observasi bersih memangkas estimasi 3x — tetapi tidak ke nol.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Posterior 0,33% < batas Pluto–Tasche 0,69% — pakai yang kecil saja.” Hati-hati: posterior sekecil itu HANYA valid bila prior 1% bisa dipertahankan. Bila prior asal-asalan, angka kecilnya adalah ilusi presisi. Aturan praktis: laporkan keduanya; bila selisihnya besar, selidiki priormu.",
      },
      hints: [
        "Prior Beta(1,99) ≈ 'satu default imajiner dalam 100' — cara intuitif menjelaskan prior ke komite.",
        "Semakin besar n, semakin kecil pengaruh prior — data akhirnya menang.",
      ],
      reference: "Prior jujur + data = posterior terkendali. Laporkan dua metode.",
    },
    {
      id: "lab-batas",
      eyebrow: "Langkah 5 · Lab",
      title: "Batas PD untuk n berapapun",
      prose: [
        "Hitung batas atas PD Pluto–Tasche untuk n = 50, 100, 200, 500 obligor-tahun tanpa default (keyakinan 75%). Perhatikan pola: menggandakan n hampir memangkas batas menjadi setengahnya — hubungan 1/n.",
        "Eksperimen: naikkan keyakinan menjadi 90% (γ=0,9) — batas n=200 menjadi 1,15%. Keyakinan lebih tinggi = harga lebih mahal (batas lebih besar). Inilah trade-off yang harus dijelaskan ke komite: 'mau yakin 75% atau 90%?'",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pd_up` (%) untuk tiap n" },
        { id: "t2", text: "Jalankan dan pastikan tabelnya tercetak" },
      ],
      expected: "n=50: PD <= 2.77%\nn=100: PD <= 1.39%\nn=200: PD <= 0.69%\nn=500: PD <= 0.28%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“n=500 → PD 0,28%? Kecil sekali — pakai 0,03% saja (floor).” Floor 0,03% adalah BATAS BAWAH regulasi, bukan estimasi. Estimasi yang jujur untuk n=500 adalah ≤0,28% — sembilan kali lipat floor. Jangan campuradukkan keduanya.",
      },
      hints: [
        "pd_up = -math.log(1 - gamma) / n * 100 (dalam persen).",
        "Jangan lupa import math sudah tersedia.",
      ],
      code: {
        starter: "# Obligor-tahun tanpa default. JANGAN UBAH.\nimport math\nn_list = [50, 100, 200, 500]\ngamma = 0.75\n\n# TULIS KODEMU: batas atas PD (%)\nfor n in n_list:\n    pd_up =\n    print(f\"n={n}: PD <= {pd_up:.2f}%\")\n",
        lockLines: 4,
        solution: "# Obligor-tahun tanpa default. JANGAN UBAH.\nimport math\nn_list = [50, 100, 200, 500]\ngamma = 0.75\n\n# TULIS KODEMU: batas atas PD (%)\nfor n in n_list:\n    pd_up = -math.log(1 - gamma) / n * 100\n    print(f\"n={n}: PD <= {pd_up:.2f}%\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "n=200 → 0,69%", msg: "−ln(0,25)/200.", pattern: "n=200: PD <= 0\\.69%" },
          { kind: "stdout_matches", task: "t2", label: "n=500 → 0,28%", msg: "−ln(0,25)/500.", pattern: "n=500: PD <= 0\\.28%" }
        ],
      },
      reference: "PD ≤ −ln(1−γ)/n. Gandakan n ≈ pangkas batas setengahnya.",
    },
    {
      id: "lab-bayes",
      eyebrow: "Langkah 6 · Lab",
      title: "Update keyakinanmu",
      prose: [
        "Prior Beta(1, 99) — 'satu default imajiner dalam 100'. Update dengan 200 observasi tanpa default. Hitung posterior dan mean-nya, lalu bandingkan dengan batas Pluto–Tasche 0,69%.",
        "Eksperimen: ubah prior menjadi Beta(1, 19) (mean 5% — lebih pesimis) — posterior menjadi Beta(1, 219), mean 0,45%. Prior pesimis + data sama = posterior lebih tinggi. Inilah mengapa prior harus dipertahankan: ia menggerakkan hasil.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `a_post`, `b_post`, `mean_post` (%)" },
        { id: "t2", text: "Jalankan dan pastikan hasilnya tercetak" },
      ],
      expected: "Posterior: Beta(1, 299), mean 0.33%",
      note: {
        title: "Intuisi",
        body: "Mean posterior 0,33% vs batas Pluto–Tasche 0,69%: keduanya 'benar' dengan makna berbeda — titik vs batas atas. Praktik sehat: pakai 0,69% untuk kehati-hatian modal, 0,33% untuk pricing — dan dokumentasikan mengapa berbeda.",
      },
      hints: [
        "a_post = a + d (d = jumlah default = 0).",
        "b_post = b + (n − d); mean = a_post/(a_post+b_post)*100.",
      ],
      code: {
        starter: "# Prior Beta(a, b); observasi n, default d. JANGAN UBAH.\na, b = 1, 99\nn, d = 200, 0\n\n# TULIS KODEMU: posterior dan mean (%)\na_post =\nb_post =\nmean_post =\nprint(f\"Posterior: Beta({a_post}, {b_post}), mean {mean_post:.2f}%\")\n",
        lockLines: 3,
        solution: "# Prior Beta(a, b); observasi n, default d. JANGAN UBAH.\na, b = 1, 99\nn, d = 200, 0\n\n# TULIS KODEMU: posterior dan mean (%)\na_post = a + d\nb_post = b + (n - d)\nmean_post = a_post / (a_post + b_post) * 100\nprint(f\"Posterior: Beta({a_post}, {b_post}), mean {mean_post:.2f}%\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "mean_post = 0,333", msg: "1/300.", name: "mean_post", value: 1/3, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Posterior tercetak", msg: "Beta(1, 299).", pattern: "Posterior: Beta\\(1, 299\\), mean 0\\.33%" }
        ],
      },
      reference: "Posterior = prior + data. Mean 0,33% — bukan nol.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Metode apa untuk portofolio apa",
      prose: [
        "Satu: n besar (>500) tanpa default → Pluto–Tasche memberi batas ketat; pakai batas sebagai PD konservatif. Dua: n kecil (<100) → data minim; andalkan pemetaan ke rating eksternal + expert judgment + margin konservatisme eksplisit. Tiga: ada data eksternal (agensi rating) → kalibrasi PD internal ke default rate eksternal untuk grade sepadan. Empat: diminta satu angka untuk pricing → Bayesian dengan prior terdokumentasi; untuk modal → batas Pluto–Tasche. Lima: regulator bertanya → tunjukkan floor 0,03% terpenuhi DAN metodologi di atasnya.",
        "Aturan praktis 10 detik: tidak ada default → jangan tulis 0%; tulis batas atas + n + metode. Tiga hal itu = jawaban lengkap.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Keputusan LDP selalu dua lapis: estimasi (berapa PD-nya) dan kejujuran (seberapa yakin kita). Metode yang baik menjawab keduanya sekaligus — Pluto–Tasche via keyakinan γ, Bayesian via prior eksplisit.",
      },
      reference: "n besar = Pluto–Tasche. n kecil = eksternal + judgment. Selalu > floor.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Auditor datang",
      prose: [
        "Validator model Bank Nusantara mempertanyakan PD 0,05% untuk portofolio bank kecil (n=200, 0 default 10 tahun). 'Dari mana angka ini?' Analis menjawab: 'Floor 0,03%, kami tambah margin.' Validator: 'Margin dari mana?'",
        "Pertanyaan: (a) Apa yang salah dengan jawaban analis? (b) Hitung angka yang bisa dipertahankan. (c) Bagaimana menjawab validator? Pembahasan: (a) 'Tambah margin' tanpa metodologi = angka karangan; floor bukan estimasi. (b) Pluto–Tasche: 0,69% (γ=75%); Bayesian: 0,33% (prior Beta(1,99)). Keduanya bisa dipertahankan — 0,05% tidak. (c) 'Kami memakai batas atas 0,69% pada keyakinan 75% karena n=200; angka 0,05% kami tarik.' Mengakui kesalahan dengan angka yang benar = kredibilitas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Skenario ini nyata dalam validasi model: validator tidak menguji apakah PD-mu 'benar' (tidak ada yang tahu) — ia menguji apakah metodologimu bisa dipertahankan. 'Margin' tanpa metode = temuan. Batas atas dengan rumus = lolos.",
      },
      reference: "Validator menguji metodologi, bukan angka. Punya rumus = lolos.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — LDP adalah soal kejujuran statistik, bukan hafalan rumus.",
      ],
      tasks: [],
      summary: [
        "Nol default ≠ PD nol: (1−p)^n menunjukkan data diam kompatibel dengan PD positif.",
        "Floor Basel 0,03% = batas bawah regulasi, bukan estimasi.",
        "Pluto–Tasche: PD ≤ −ln(1−γ)/n — batas atas yang jujur; n=200 → 0,69%.",
        "Bayesian: prior Beta + data → posterior; Beta(1,99)+200 bersih → mean 0,33%.",
        "Laporkan selalu: PD + n + metode. Untuk modal pakai batas; untuk pricing boleh titik.",
      ],
      next: { label: "CR26 — Private Credit", href: "/v2/learn/cr26-private-credit" },
      quiz: [
        {
          q: "200 obligor-tahun tanpa default. Klaim 'PD = 0%' salah karena?",
          options: [
            { text: "Peluang tidak melihat default dengan PD 1% adalah 13% — data diam kompatibel dengan PD positif", why: "Benar: (0,99)^200 ≈ 13%.", correct: true },
            { text: "Regulator melarang angka nol dalam laporan", why: "Ada floor 0,03%, tetapi alasan statistiknya lebih fundamental." },
            { text: "ECL tidak bisa dihitung dengan PD nol", why: "Bisa dihitung (hasilnya nol) — masalahnya klaimnya salah." },
            { text: "Karena belum 10 tahun penuh", why: "Durasi bukan inti — n=200 mau 2 tahun atau 10 tahun hasilnya sama." }
          ],
        },
        {
          q: "Batas Pluto–Tasche untuk n=200, γ=75%?",
          options: [
            { text: "0,69%", why: "Benar: −ln(0,25)/200.", correct: true },
            { text: "0,03%", why: "Itu floor regulasi, bukan batas estimasi." },
            { text: "1,39%", why: "Itu untuk n=100." },
            { text: "0%", why: "Justru yang dibuktikan salah oleh metode ini." }
          ],
        },
        {
          q: "Prior Beta(1,99) + 200 observasi 0 default. Posterior mean?",
          options: [
            { text: "0,33%", why: "Benar: 1/(1+299) = 1/300.", correct: true },
            { text: "1,00%", why: "Itu mean prior — data sudah menggesernya." },
            { text: "0%", why: "Bayesian tidak pernah sampai nol dengan prior jujur." },
            { text: "0,69%", why: "Itu batas Pluto–Tasche, bukan mean posterior." }
          ],
        },
        {
          q: "Analis memakai floor 0,03% sebagai estimasi PD. Masalahnya?",
          options: [
            { text: "Floor = batas bawah, bukan estimasi; estimasi jujur (0,69%) 20x lipatnya", why: "Benar: mencampuradukkan dua hal berbeda.", correct: true },
            { text: "Floor sudah kedaluwarsa", why: "Floor Basel masih berlaku." },
            { text: "Floor hanya untuk bank, bukan korporasi", why: "Floor 0,03% mencakup korporasi, sovereign, dan bank." },
            { text: "Tidak ada masalah — itu konservatif", why: "Justru tidak konservatif: 0,03% << 0,69%." }
          ],
        },
        {
          q: "Kapan memakai batas Pluto–Tasche vs mean Bayesian?",
          options: [
            { text: "Modal: batas (konservatif); pricing: mean (titik) — dokumentasikan keduanya", why: "Benar: tujuan berbeda, angka berbeda, keduanya sah.", correct: true },
            { text: "Selalu pakai yang terkecil agar kompetitif", why: "Cherry-picking metodologi = temuan validasi." },
            { text: "Selalu pakai Bayesian karena lebih modern", why: "Modern ≠ selalu tepat; tanpa prior jujur ia menyesatkan." },
            { text: "Pilih yang disukai direksi", why: "Metodologi dipilih berdasar tujuan, bukan preferensi." }
          ],
        }
      ],
      reference: "Nol default ≠ nol PD. Batas + titik + n + metode.",
    },
  ],
};
