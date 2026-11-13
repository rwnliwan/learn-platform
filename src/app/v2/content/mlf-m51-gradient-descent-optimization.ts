import type { V2Lesson } from "../lib/types";

export const mlfM51: V2Lesson = {
  slug: "mlf-m51-gradient-descent-optimization",
  track: "Machine Learning Finance",
  module: "Optimization & portfolio construction",
  title: "MLF-M5.1 — Gradient Descent: Menuruni Bukit dengan Kompas Gradien",
  estMinutes: 55,
  steps: [
    {
      id: "optimasi",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Apa itu optimasi — fungsi tujuan, variabel keputusan, kendala",
      prose: [
        "Modul M5 adalah optimasi & konstruksi portofolio: dari «model apa yang dipakai» (M1–M4) ke «keputusan apa yang diambil» — bobot portofolio berapa, threshold berapa, parameter berapa. Lesson ini membuka modul itu dengan algoritma optimasi yang paling banyak dipakai di seluruh machine learning: gradient descent (GD). Hampir semua model yang kamu latih di M1–M4 — logistic regression dan neural network — umumnya dioptimasi dengan GD atau variannya (meski logistic regression juga lazim diselesaikan dengan Newton/IRLS); GBM adalah gradient descent di ruang fungsi, bukan GD pada parameter biasa.",
        "Optimasi punya tiga bahan. Fungsi tujuan (objective): angka yang mau diminimalkan atau dimaksimalkan — misal variansi portofolio, atau loss model. Variabel keputusan: angka-angka yang boleh kamu ubah — misal bobot tiap aset, atau koefisien model. Kendala (constraint): aturan yang harus dipatuhi — misal bobot harus berjumlah 1, atau tidak boleh short. Lesson ini fokus pada fungsi tujuan + variabel keputusan; kendala dibahas penuh di M5.2.",
        "Peta lesson: optimasi → gradien sebagai kompas → update rule & learning rate → worked example kuadratik dengan 4 learning rate → kapan berhenti (konvergensi) → momentum & Adam → GD vs closed-form → satu langkah GD pada portofolio min-variance (data nyata) → stochastic GD → jebakan → 2 lab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M5.1 dan file kanonis M5: harga BBCA, KLBF, UNVR (window pin 2024-11-01 s.d. 2026-11-12; file pin diunduh 2026-11-12), 480 hari return SIMPLE, 2024-11-04 s.d. 2026-11-11, rf = 0,05. Return tahunan: BBCA −0,2445, KLBF −0,2570, UNVR 0,0796; volatilitas tahunan: BBCA 0,3449, KLBF 0,4251, UNVR 0,5014. Korelasi BBCA–KLBF 0,3488.",
        "Nilai: optimasi adalah bahasa yang menyatukan dua dunia di track ini — melatih model (meminimalkan loss) dan membangun portofolio (meminimalkan variansi). Algoritma yang sama, fungsi tujuan yang berbeda. Bila kamu paham GD di satu dunia, kamu membawanya gratis ke dunia lain.",
        "Baik atau buruk: merumuskan masalah sebagai optimasi itu bagus — ia memaksa kamu menuliskan dengan jujur apa yang sebenarnya dimau (fungsi tujuan) dan apa yang boleh diubah (variabel keputusan). Buruk bila fungsi tujuannya salah: optimasi akan menemukan jawaban TERBAIK untuk pertanyaan yang SALAH — misal meminimalkan variansi tanpa peduli return menghasilkan portofolio yang «aman» tapi merugi (GMV di data ini return −0,1903).",
        "Mitigasi: sebelum memilih algoritma, tulis dulu fungsi tujuan dan kendalanya dalam satu kalimat. Bila kalimat itu tidak bisa ditulis, masalahnya belum siap dioptimasi — dan GD apa pun hanya akan mempercepatmu ke arah yang salah.",
      ],
      tasks: [],
    },
    {
      id: "gradien",
      eyebrow: "Langkah 2 · Gradien sebagai kompas",
      title: "Gradien: vektor yang menunjuk ke arah menanjak paling curam",
      prose: [
        "Bayangkan kamu berdiri di lereng bukit berkabut — tidak bisa melihat lembah, hanya bisa merasakan kemiringan tanah di bawah kakimu. Gradien adalah kompas itu: di tiap titik, gradien adalah vektor turunan parsial yang menunjuk ke arah fungsi NAIK paling curam, dan panjangnya mengukur seberapa curam kenaikan itu.",
        "Nilai: untuk f(x, y) = x² + 10y² [ilustrasi], gradiennya ∇f(x, y) = (2x, 20y). Di titik start (4, 4): ∇f = (8, 80) — komponen y sepuluh kali komponen x, karena koefisien y sepuluh kali lebih besar. Artinya: dari (4, 4), fungsi naik paling curam hampir sepenuhnya ke arah y. Nilai fungsi di start: f(4, 4) = 16 + 160 = 176.",
        "Baik atau buruk: gradien bagus karena ia hanya butuh informasi LOKAL — turunan di titikmu sekarang — untuk memberi arah yang berguna; kamu tidak perlu memetakan seluruh bukit. Buruk bila dibaca sebagai «arah ke lembah»: gradien menunjuk ke arah naik TERDEKAT, bukan ke minimum global. Di bukit dengan banyak lembah, mengikuti gradien membawamu ke lembah terdekat — belum tentu yang terdalam (langkah 5).",
        "Mitigasi: jangan percaya satu gradien buta-buta — gradien di titik yang jauh dari minimum bisa sangat besar dan menyesatkan (langkah 4: η = 0,12). Selalu pasangkan gradien dengan ukuran langkah yang masuk akal (learning rate, langkah 3).",
      ],
      formula: String.raw`\nabla f(x, y) = \left( \frac{\partial f}{\partial x},\, \frac{\partial f}{\partial y} \right)`,
      formulaNote: "Gradien f di satu titik: vektor turunan parsial. Arahnya = arah kenaikan tercuram; panjangnya = kecuraman. Gradient descent melangkah BERLAWANAN dengan gradien.",
      tasks: [],
      note: {
        title: "Miskonsepsi: gradien menunjuk ke minimum",
        type: "pitfall",
        body: "Yang benar: gradien menunjuk ke arah fungsi NAIK paling curam. Gradient descent melangkah ke arah BERLAWANAN — minus gradien. Lupa tanda minus berarti kamu mendaki, bukan menuruni bukit — dan fungsimu membesar, bukan mengecil.",
      },
    },
    {
      id: "update-rule",
      eyebrow: "Langkah 3 · Update rule & learning rate",
      title: "Update rule: satu baris yang melatih hampir semua model ML",
      prose: [
        "Update rule gradient descent hanya satu baris: posisi baru = posisi lama − learning rate × gradien. Learning rate (η) adalah ukuran langkah: seberapa jauh kamu melangkah mengikuti kompas di tiap iterasi. Ulangi baris itu sampai berhenti (langkah 5) — dan itulah seluruh algoritmanya.",
        "Nilai: dengan η = 0,05 pada f(x, y) = x² + 10y² dari (4, 4) [ilustrasi], langkah pertama: gradien (8, 80), langkah = 0,05 × (8, 80) = (0,4; 4,0), posisi baru (3,6; 0,0). Perhatikan: komponen y langsung NOL dalam satu langkah — karena 20η = 1, persis. Fungsi jatuh dari 176 ke 12,96 dalam SATU langkah. Itulah kekuatan sekaligus bahaya GD: satu langkah yang tepat bisa sangat besar.",
        "Baik atau buruk: η kecil bagus karena aman — langkah kecil hampir tidak pernah divergen. Buruk karena lambat: η = 0,01 butuh 52 langkah untuk mencapai f < 2, sementara η = 0,05 hanya butuh 10 langkah [ilustrasi]. η besar bagus karena cepat — bila tepat. Buruk karena rapuh: η = 0,12 membuat f MELEDAK ke 133.869,2748 dalam 10 langkah (langkah 4).",
        "Mitigasi: tidak ada η «benar» yang universal — η yang aman bergantung pada kecuraman fungsi (langkah 4 menunjukkan 0,05 manis, 0,12 fatal, pada fungsi yang SAMA). Aturan praktis: coba beberapa η dan lihat kurva fungsinya; bila f naik, η terlalu besar — kecilkan. Adam (langkah 6) mengotomasi sebagian dari pencarian ini.",
      ],
      formula: String.raw`\theta_{t+1} = \theta_t - \eta\, \nabla f(\theta_t)`,
      formulaNote: "Update rule gradient descent: θ = vektor parameter (di sini (x, y)); η = learning rate; ∇f(θ_t) = gradien di posisi sekarang. Ulangi sampai kriteria berhenti terpenuhi.",
      tasks: [],
    },
    {
      id: "worked-example",
      eyebrow: "Langkah 4 · Worked example",
      title: "Mangkuk kuadratik: empat learning rate, empat nasib",
      prose: [
        "Sekarang jalankan GD pada f(x, y) = x² + 10y² dari start (4, 4) selama 10 langkah, dengan empat learning rate [notebook]. Nilai awal f(4, 4) = 176. Hasil akhirnya:",
        "η = 0,01 → f = 12,5264. Lambat tapi stabil: x menyusut 2% per langkah (faktor 0,98), y menyusut 20% per langkah (faktor 0,8). Setelah 10 langkah posisi (3,2683; 0,4295) — masih jauh dari (0, 0). Butuh 52 langkah untuk mencapai f < 2.",
        "η = 0,05 → f = 1,9452. Terbaik setelah 10 langkah. y langsung nol di langkah pertama (20η = 1), lalu x menyusut 10% per langkah (faktor 0,9): posisi akhir (1,3947; 0,0000). Hanya butuh 10 langkah untuk f < 2 — lima kali lebih cepat dari η = 0,01.",
        "η = 0,09 → f = 2,1469. Sedikit lebih buruk dari 0,05 setelah 10 langkah — tapi jangan tertipu: y berosilasi (faktor 1 − 20η = −0,8; tanda y berbalik tiap langkah) sambil menyusut, dan pada langkah ke-11 f-nya 1,3838 — menyalip 0,05. «Terbaik setelah 10 langkah» bukan «terbaik selamanya».",
        "η = 0,12 → f = 133.869,2748. DIVERGEN. y berosilasi dengan faktor 1 − 20η = −1,4 — |y| membesar 40% tiap langkah: y akhir 115,7019 (dari 4!), x akhir 0,2572. Fungsi naik dari 176 ke 133.869 — GD berubah menjadi pendaki yang makin cepat. Inilah yang terjadi bila |1 − η × kelengkungan| > 1: langkah melompati lembah, lalu melompat makin jauh.",
        "Gambar di bawah memplot f per langkah untuk η = 0,01; 0,05; 0,09. η = 0,12 tidak diplot — nilainya (133.869) berada ±740 kali di atas skala gambar; ia dicatat di caption sebagai divergen.",
        "Baik atau buruk: mangkuk kuadratik bagus sebagai laboratorium — convex (satu minimum global di (0, 0)), gradiennya linear, dan keempat nasib η terlihat bersih: lambat, manis, berosilasi, meledak. Buruk bila dianggap mewakili semua masalah: di fungsi non-convex, GD bisa berhenti di minimum lokal atau saddle point (langkah 5 dan 10).",
        "Mitigasi: sebelum percaya satu run GD, plot f per langkah. Kurva yang turun mulus = sehat; kurva yang naik-turun = η terlalu besar atau fungsi terlalu curam di satu arah; kurva yang datar = η terlalu kecil atau gradien sudah mengecil (langkah 5).",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="f per langkah GD: eta 0,01 turun lambat ke 12,5264; eta 0,05 turun cepat ke 1,9452; eta 0,09 berosilasi ke 2,1469">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">f(x,y) = x² + 10y² per langkah GD — start f = 176</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="161.6" x2="52" y2="161.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="164.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">45</text>
<line x1="48" y1="117.1" x2="52" y2="117.1" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="120.1" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">90</text>
<line x1="48" y1="72.7" x2="52" y2="72.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="75.7" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">135</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">180</text>
<text x="259" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">langkah (0–10)</text>
<polyline points="52.0,33.9 93.4,90.9 134.8,127.5 176.2,151.1 217.6,166.4 259.0,176.4 300.4,183.0 341.8,187.3 383.2,190.3 424.6,192.3 466.0,193.8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="466.0" cy="193.8" r="3.5" fill="var(--c1)"/>
<polyline points="52.0,33.9 93.4,193.3 134.8,195.7 176.2,197.7 217.6,199.3 259.0,200.5 300.4,201.6 341.8,202.4 383.2,203.1 424.6,203.7 466.0,204.1" fill="none" stroke="var(--c4)" stroke-width="2"/>
<circle cx="466.0" cy="204.1" r="3.5" fill="var(--c4)"/>
<polyline points="52.0,33.9 93.4,95.4 134.8,134.8 176.2,160.2 217.6,176.6 259.0,187.1 300.4,193.8 341.8,198.1 383.2,200.9 424.6,202.7 466.0,203.9" fill="none" stroke="var(--c2)" stroke-width="2"/>
<circle cx="466.0" cy="203.9" r="3.5" fill="var(--c2)"/>
<line x1="120" y1="42" x2="140" y2="42" stroke="var(--c1)" stroke-width="2"/>
<text x="144" y="45" font-size="10" fill="var(--text)" font-family="var(--font-ui)">η = 0,01 → f = 12,5264 (lambat)</text>
<line x1="120" y1="56" x2="140" y2="56" stroke="var(--c4)" stroke-width="2"/>
<text x="144" y="59" font-size="10" fill="var(--text)" font-family="var(--font-ui)">η = 0,05 → f = 1,9452 (terbaik, 10 langkah)</text>
<line x1="120" y1="70" x2="140" y2="70" stroke="var(--c2)" stroke-width="2"/>
<text x="144" y="73" font-size="10" fill="var(--text)" font-family="var(--font-ui)">η = 0,09 → f = 2,1469 (berosilasi)</text>
</svg>`,
        alt: "f per langkah GD pada mangkuk kuadratik: eta 0,01 ke 12,5264; eta 0,05 ke 1,9452; eta 0,09 ke 2,1469; eta 0,12 divergen ke 133869,2748 (tidak diplot).",
        caption: "Cara membaca: sumbu-x = langkah 0–10, sumbu-y = nilai f dari 176 (start) ke 0. η = 0,05 jatuh tercepat; η = 0,01 merangkak; η = 0,09 berosilasi di arah y. η = 0,12 DIVERGEN (f = 133.869,2748 setelah 10 langkah [notebook]) — tidak diplot karena ±740× skala gambar.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: learning rate lebih besar selalu lebih cepat",
        type: "pitfall",
        body: "Yang benar: η = 0,09 memang menyalip η = 0,05 pada langkah ke-11 (f 1,3838 vs 1,5756, keduanya langkah ke-11) — tapi η = 0,12, hanya sedikit lebih besar, justru meledak ke 133.869,2748. Ada ambang batas: begitu |1 − η × kelengkungan| melewati 1 di satu arah, GD divergen. Lebih besar tidak selalu lebih cepat — kadang lebih besar berarti hancur.",
      },
    },
    {
      id: "konvergensi",
      eyebrow: "Langkah 5 · Konvergensi",
      title: "Kapan berhenti — dan convex vs non-convex",
      prose: [
        "GD tidak tahu kapan ia «sampai». Kamu yang harus memasang kriteria berhenti. Tiga yang umum: (1) gradien sudah sangat kecil, ‖∇f‖ < ε — lerengnya nyaris datar, jadi langkah berikutnya nyaris nol; (2) perubahan fungsi sudah sangat kecil, |f(θ_t) − f(θ_{t−1})| < ε — lembahnya sudah tidak menurun lagi; (3) batas langkah maksimum — pengaman agar loop tidak berjalan selamanya bila dua kriteria pertama tidak pernah tercapai.",
        "Nilai: pada mangkuk kuadratik dengan η = 0,05 [ilustrasi], setelah 10 langkah gradiennya (2×1,3947; 0) = (2,7894; 0) — belum nol, tapi f sudah 1,9452 dan terus turun ~10% per langkah. Dengan kriteria |Δf| < 0,01, GD berhenti sekitar langkah 29; dengan ‖∇f‖ < 0,1, sekitar langkah 42. Kriteria yang berbeda memberi titik berhenti yang berbeda — dan itu normal: «konvergen» adalah ambang yang kamu pilih, bukan sifat alamiah fungsi.",
        "Convex vs non-convex adalah pembeda yang menentukan apakah titik berhenti itu bisa dipercaya. Fungsi CONVEX (seperti mangkuk kuadratik: f(x, y) = x² + 10y²) hanya punya SATU minimum, dan itu minimum global — dari start mana pun, GD yang tidak divergen akan sampai di sana. Fungsi NON-CONVEX punya banyak minimum lokal dan saddle point: GD berhenti di lembah TERDEKAT, dan tidak ada yang menjamin itu lembah terdalam.",
        "Baik atau buruk: kriteria berhenti yang eksplisit bagus — tanpa itu, GD berjalan sampai batas langkah dan kamu tidak tahu apakah ia konvergen atau hanya kehabisan waktu. Buruk bila kriteria terlalu longgar: berhenti di f = 12,5264 (η = 0,01, langkah 10) dan mengira itu minimum adalah salah baca — gradiennya masih (6,5366; 8,5900), jauh dari nol.",
        "Mitigasi: di fungsi non-convex, jalankan GD dari BEBERAPA start berbeda dan bandingkan titik akhirnya — bila semua start berakhir di nilai f yang sama, keyakinanmu naik; bila berbeda-beda, kamu sedang melihat minimum-minimum lokal, dan GD sendirian tidak bisa memilih yang terdalam. Di deep learning, inilah alasan inisialisasi dan restart itu penting.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: gradien nol berarti sudah di minimum",
        type: "pitfall",
        body: "Yang benar: gradien nol juga terjadi di MAKSIMUM dan di SADDLE POINT. Contoh [ilustrasi]: f(x, y) = x² − y² — di (0, 0) gradiennya (0, 0), tapi itu bukan minimum: ke arah x fungsi naik, ke arah y fungsi TURUN. GD yang berhenti hanya karena gradien nol bisa berhenti di punggung kuda, bukan di lembah.",
      },
    },
    {
      id: "momentum-adam",
      eyebrow: "Langkah 6 · Momentum & Adam",
      title: "Momentum & Adam: GD yang belajar dari langkah sebelumnya",
      prose: [
        "GD polos punya dua kelemahan yang sudah kamu lihat: di lembah yang panjang dan sempit (seperti mangkuk x² + 10y² — arah y 10× lebih curam dari x), ia berosilasi di arah curam sambil merangkak di arah landai; dan satu η harus cocok untuk SEMUA arah sekaligus. Momentum dan Adam adalah dua perbaikan yang lahir dari kelemahan itu — konsepnya, tanpa rumus berat.",
        "Momentum: beri GD «kecepatan». Tiap langkah tidak hanya mengikuti gradien sekarang, tapi juga sebagian dari langkah sebelumnya — seperti bola yang menggelinding menuruni bukit dan mengumpulkan kecepatan di arah yang konsisten. Efeknya: osilasi di arah curam saling meniadakan (langkah bolak-balik dirata-rata), sementara gerakan di arah landai yang konsisten dipercepat. Di mangkuk kuadratik, momentum membuat η = 0,01 yang merangkak menjadi jauh lebih cepat — tanpa menaikkan η sampai ke zona divergen.",
        "Adam (Adaptive Moment Estimation): beri TIAP parameter learning rate-nya sendiri, yang menyesuaikan otomatis. Parameter yang gradiennya besar dan sering berubah-ubah mendapat langkah efektif lebih kecil; parameter yang gradiennya kecil dan stabil mendapat langkah efektif lebih besar. Adam juga memakai momentum (rata-rata gradien) plus rata-rata kuadrat gradien untuk menormalisasi langkah. Inilah alasan Adam menjadi default di hampir semua pelatihan neural network: ia mengurangi kebutuhan menyetel η dengan tangan.",
        "Nilai: tidak ada angka kanonis untuk momentum/Adam di lesson ini — keduanya diajarkan sebagai konsep, dan angka GD polos di langkah 4 adalah pembandingnya: η = 0,05 mencapai f = 1,9452 dalam 10 langkah; momentum/Adam dirancang untuk mencapai hasil sebanding TANPA harus menemukan η = 0,05 itu lewat coba-coba.",
        "Baik atau buruk: momentum bagus di lembah panjang-sempit dan di fungsi dengan gradien berisik (langkah 9). Buruk bila momentumnya terlalu besar: bola melompati lembah dan berosilasi di sisi lain — masalah yang sama dengan η besar, hanya berpindah tempat. Adam bagus sebagai default yang «jalan dulu». Buruk bila dianggap «tidak perlu disetel»: Adam masih punya η dan parameter lain, dan di beberapa masalah (misal generalisasi akhir) GD polos dengan η yang dijadwalkan dengan baik masih mengalahkannya.",
        "Mitigasi: mulai dari Adam bila kamu tidak tahu apa-apa tentang fungsinya; pindah ke GD + momentum (dengan learning-rate schedule) bila kamu butuh hasil akhir terbaik dan punya waktu menyetel. Dan apa pun optimizer-nya, plot f per langkah — optimizer yang bagus tetap bisa divergen bila η dasarnya terlalu besar.",
      ],
      tasks: [],
    },
    {
      id: "gd-vs-closed-form",
      eyebrow: "Langkah 7 · GD vs closed-form",
      title: "GD vs closed-form: kapan rumus analitik menang",
      prose: [
        "Tidak semua masalah optimasi butuh iterasi. Bila fungsi tujuannya kuadratik dan kendalanya sederhana, jawabannya punya RUMUS TERTUTUP (closed-form): satu perhitungan, langsung ke minimum — tanpa learning rate, tanpa iterasi, tanpa risiko divergen. Portofolio min-variance global (GMV) adalah contohnya: bobot GMV 3-aset (BBCA, KLBF, UNVR) dari rumus tertutup adalah (0,5518; 0,2698; 0,1785) [notebook] — variansi 0,2966², alias vol 0,2966.",
        "Kapan closed-form menang? Bila dimensinya kecil, fungsinya kuadratik (atau punya turunan yang bisa diselesaikan), dan tidak ada kendala aneh. GMV 3-aset memenuhi semuanya — GD di sini hanya latihan, bukan kebutuhan. Kapan GD menang? Bila tidak ADA rumus tertutup: risk parity (bobot yang menyamakan kontribusi risiko tiap aset — (0,3980; 0,3212; 0,2808) di data ini [notebook]) tidak punya rumus tertutup dan harus dicari iteratif; begitu pula max-Sharpe dengan kendala, dan semua loss neural network.",
        "Peringatan dari data: closed-form TANPA kendala bisa memberi jawaban yang benar secara matematis tapi absurd secara ekonomi. Max-Sharpe tanpa kendala (tanpa batas bobot) di data ini menghasilkan bobot (−3154,746; −3786,1043; 6941,8503) [notebook] — short raksasa yang saling meniadakan, return 2296,983, vol 3429,6914. Rumusnya «benar», keputusannya tidak bisa dieksekusi. Itulah mengapa M5.2 (kendala) ada: rumus yang baik + kendala yang benar, baru menjadi keputusan yang baik.",
        "Baik atau buruk: closed-form bagus — eksak, cepat, tanpa hyperparameter. Buruk bila dipakai di luar wilayahnya: begitu kendala «bobot tidak boleh negatif» atau «maksimal 40% per aset» masuk, rumus tertutup GMV tidak lagi berlaku dan kamu kembali butuh iterasi (M5.2). GD bagus — umum, bekerja di hampir semua fungsi. Buruk karena lambat dan butuh penyetelan η, momentum, dan kriteria berhenti.",
        "Mitigasi: sebelum menjalankan GD, tanyakan dulu «apakah masalah ini punya rumus tertutup?» Bila ya, pakai itu sebagai jawaban — atau setidaknya sebagai pembanding untuk memvalidasi GD-mu (notebook langkah 3 melakukan persis ini: GD diproyeksikan dibandingkan dengan GMV closed-form 2-aset (0,6565; 0,3435)). Bila GD dan rumus tertutup tidak sepakat, salah satunya salah — dan biasanya GD-nya.",
      ],
      tasks: [],
    },
    {
      id: "gd-portofolio",
      eyebrow: "Langkah 8 · GD pada portofolio",
      title: "Satu langkah GD pada portofolio min-variance (data nyata)",
      prose: [
        "Sekarang GD keluar dari mangkuk mainan dan masuk ke data nyata: portofolio 2 aset, BBCA + KLBF. Fungsi tujuan: variansi portofolio Var(w) = wᵀΣw — kuadratik, convex, punya minimum global (GMV 2-aset (0,6565; 0,3435) [notebook]). Variabel keputusan: bobot w = (w_BBCA, w_KLBF). Start: equal-weight w = (0,5; 0,5), η = 0,5, satu langkah.",
        "Matriks kovarians tahunan dari return SIMPLE 480 hari [notebook]: Σ = [[0,118956; 0,051145], [0,051145; 0,180734]]. Konteks per-aset: BBCA vol tahunan 0,3449 (variansi 0,118956), KLBF vol 0,4251 (variansi presisi 0,180734; vol sudah dibulatkan — 0,4251² = 0,180710), korelasi 0,3488 — KLBF lebih berisiko dan keduanya berkorelasi positif moderat — ρ mengukur kekuatan hubungan linear, bukan fraksi waktu bergerak searah.",
        "Gradien variansi di w: ∇Var = 2Σw = [0,1701; 0,2319] [notebook]. KLBF gradiennya lebih besar — variansi lebih sensitif terhadap bobot KLBF, karena KLBF lebih volatil. Satu langkah GD: w_mentah = (0,5; 0,5) − 0,5 × (0,1701; 0,2319) = (0,4149; 0,3841). Jumlahnya 0,7990 — bukan 1 lagi, karena GD tidak tahu soal kendala jumlah-bobot. Renormalisasi (bagi dengan jumlah): w_baru = (0,5193; 0,4807) [notebook].",
        "Hasilnya: variansi tahunan 0,1005 → 0,0994 [notebook] — turun 0,0011 dalam satu langkah. GMV 2-aset punya variansi 0,0957, jadi satu langkah ini menutup sekitar 23% jarak dari equal-weight ke GMV. Arahnya juga benar: bobot BBCA naik (0,5 → 0,5193) karena gradien BBCA lebih kecil — GD menggeser bobot KE aset yang variansinya kurang sensitif.",
        "Gambar di bawah membandingkan bobot sebelum dan sesudah satu langkah, dengan variansi di caption. Perhatikan: perubahannya kecil — satu langkah GD adalah langkah kecil; GMV baru tercapai setelah puluhan langkah (notebook langkah 3).",
        "Baik atau buruk: satu langkah GD bagus sebagai BUKTI KONSEP — dengan data nyata, gradien nyata, dan variansi yang benar-benar turun. Buruk bila dibaca sebagai «portofolio optimal»: (0,5193; 0,4807) masih jauh dari GMV (0,6565; 0,3435), dan renormalisasi di sini adalah jalan pintas, bukan penanganan kendala yang benar (lihat catatan jebakan di bawah).",
        "Mitigasi: untuk portofolio kecil seperti ini, pakai rumus tertutup GMV sebagai jawaban akhir — GD di sini adalah alat belajar, bukan alat produksi. Bila kamu tetap memakai GD untuk portofolio, tangani kendala jumlah-bobot dengan proyeksi gradien (notebook langkah 3), bukan renormalisasi mentah — M5.2 membahas ini penuh.",
      ],
      formula: String.raw`\nabla_w\, \mathrm{Var}(w) = 2\,\Sigma\, w, \qquad w \leftarrow w - \eta\, \nabla_w\, \mathrm{Var}(w)`,
      formulaNote: "Gradien variansi portofolio terhadap bobot: 2Σw. Satu langkah GD dengan η = 0,5 dari w = (0,5; 0,5) memberi w_mentah (0,4149; 0,3841), lalu renormalisasi ke jumlah 1: (0,5193; 0,4807).",
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bobot BBCA dan KLBF sebelum dan sesudah satu langkah GD: BBCA 0,5 ke 0,5193; KLBF 0,5 ke 0,4807; variansi 0,1005 ke 0,0994">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Satu langkah GD min-variance — bobot sebelum vs sesudah</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,40</text>
<line x1="48" y1="151.0" x2="52" y2="151.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="154.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,45</text>
<line x1="48" y1="96.0" x2="52" y2="96.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="99.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,50</text>
<line x1="48" y1="41.0" x2="52" y2="41.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="44.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,55</text>
<rect x="110" y="96.0" width="55" height="110.0" fill="var(--c1)"/>
<text x="137.5" y="92.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5000</text>
<text x="137.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">BBCA · awal</text>
<rect x="190" y="74.8" width="55" height="131.2" fill="var(--c4)"/>
<text x="217.5" y="70.8" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5193</text>
<text x="217.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">BBCA · baru</text>
<rect x="290" y="96.0" width="55" height="110.0" fill="var(--c1)"/>
<text x="317.5" y="92.0" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,5000</text>
<text x="317.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">KLBF · awal</text>
<rect x="370" y="117.2" width="55" height="88.8" fill="var(--c2)"/>
<text x="397.5" y="113.2" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,4807</text>
<text x="397.5" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">KLBF · baru</text>
</svg>`,
        alt: "Bobot BBCA 0,5000 ke 0,5193 dan KLBF 0,5000 ke 0,4807 setelah satu langkah GD; variansi 0,1005 ke 0,0994.",
        caption: "Cara membaca: bar gelap = bobot awal (0,5; 0,5), bar warna = bobot setelah satu langkah GD η = 0,5 + renormalisasi [notebook]. Interpretasi: bobot bergeser ke BBCA (gradiennya lebih kecil, 0,1701 vs 0,2319); variansi tahunan 0,1005 → 0,0994 — turun, tapi GMV (0,6565; 0,3435; variansi 0,0957) masih jauh.",
      },
      tasks: [],
      note: {
        title: "Jebakan: renormalisasi mentah — diulang, ia menuju jawaban yang SALAH",
        type: "pitfall",
        body: "Yang benar: satu langkah GD + renormalisasi di atas valid sebagai demonstrasi SATU langkah. Tapi bila diulang mentah-mentah (GD lalu bagi dengan jumlah, 200×, η = 0,5), iterasinya TIDAK menuju GMV — ia berhenti di w = (2,2950; −1,2950) dengan variansi 0,6256 [notebook], enam kali LEBIH BURUK dari titik awal. Renormalisasi mengubah arah langkah di tiap iterasi. Yang benar: proyeksikan gradien ke bidang jumlah-bobot-tetap (kurangi rata-rata gradien) — projected GD itu mencapai GMV (0,6565; 0,3435) dalam 100 langkah (notebook langkah 3). Penanganan kendala yang benar adalah topik M5.2.",
      },
    },
    {
      id: "sgd",
      eyebrow: "Langkah 9 · Stochastic GD & mini-batch",
      title: "SGD: gradien dari sampel, bukan dari seluruh data",
      prose: [
        "GD yang kamu pakai sejauh ini adalah BATCH gradient descent: tiap langkah menghitung gradien dari SELURUH data (atau seluruh fungsi). Bila datamu 480 hari return, itu murah. Bila datamu 30 ribu nasabah (seperti proyek credit scoring) atau jutaan baris, menghitung gradien penuh di tiap langkah menjadi mahal — dan di situlah stochastic gradient descent (SGD) masuk.",
        "SGD menghitung gradien dari SATU baris (atau satu mini-batch kecil, misal 32 baris) yang dipilih acak di tiap langkah. Gradiennya BERISIK — ia menunjuk kira-kira ke arah yang benar, tapi dengan kesalahan acak. Harganya: jalurnya bergetar di sekitar minimum, tidak pernah benar-benar diam. Keuntungannya: tiap langkah jauh lebih murah, dan kamu bisa meng-update model 30 ribu kali per epoch, bukan sekali.",
        "Nilai [ilustrasi]: pada f(x) = x² dari x = 3, η = 0,1, 30 langkah, gradien berisik 2x + ε dengan ε ~ N(0, 1), seed 7 — batch GD mencapai f = 0,000014 (nyaris nol, mulus); SGD mencapai f = 0,0626 dan berosilasi (rata-rata 10 langkah terakhir 0,1432); mini-batch 4 baris mencapai f = 0,0018 (rata-rata 10 terakhir 0,0030) — di antara keduanya. Polanya persis seperti teori: makin besar batch, makin kecil noise, makin dekat ke batch GD.",
        "Baik atau buruk: SGD bagus bila data besar dan kamu butuh banyak update murah — dan noise-nya kadang MEMBANTU: ia bisa menendang GD keluar dari minimum lokal yang dangkal atau saddle point (langkah 10). Buruk bila kamu butuh presisi akhir: SGD dengan η tetap tidak pernah konvergen ke titik — ia bergetar selamanya di sekitar minimum dengan amplitudo sebanding η × noise. Itulah mengapa dalam praktik η DITURUNKAN seiring waktu (learning-rate decay): besar di awal untuk bergerak cepat, kecil di akhir untuk mendarat tenang.",
        "Mitigasi: pakai mini-batch (32–256 baris) sebagai kompromi standar — noise cukup kecil untuk stabil, langkah cukup murah untuk cepat. Dan jadwalkan η menurun (misal bagi 10 tiap beberapa epoch) — SGD dengan η tetap adalah SGD yang tidak pernah selesai.",
      ],
      tasks: [],
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 10 · Jebakan",
      title: "Tiga jebakan GD: learning rate, skala fitur, saddle point",
      prose: [
        "Jebakan pertama — learning rate. Terlalu kecil: GD merangkak (η = 0,01 butuh 52 langkah untuk f < 2, sementara η = 0,05 butuh 10). Terlalu besar: GD divergen (η = 0,12 → f = 133.869,2748). Tidak ada η yang benar untuk semua fungsi — dan η yang sama bisa aman di satu arah tapi fatal di arah lain, bila kelengkungannya berbeda jauh.",
        "Jebakan kedua — skala fitur. Mangkuk f(x, y) = x² + 10y² [ilustrasi] adalah contoh skala yang buruk: arah y 10× lebih curam dari arah x, sehingga satu η tidak bisa cocok untuk keduanya — η yang pas untuk x terlalu kecil untuk y, η yang pas untuk y membuat x berosilasi. Di dunia nyata ini terjadi bila fitur tidak distandardisasi: harga saham dalam ribuan rupiah vs return dalam persen — gradiennya berbeda orde besaran, dan GD tersiksa. Mitigasinya: standardisasi fitur (kurangi mean, bagi standar deviasi) SEBELUM optimasi — atau pakai Adam, yang menyesuaikan langkah per parameter.",
        "Jebakan ketiga — saddle point. Di fungsi non-convex, ada titik di mana gradien NOL tapi bukan minimum: f(x, y) = x² − y² di (0, 0) [ilustrasi] — ke arah x naik, ke arah y turun. GD yang sampai di sana berhenti — gradiennya nol, kriterianya terpenuhi — padahal lembah sebenarnya ada di arah y. Di dimensi tinggi (neural network dengan jutaan parameter), saddle point jauh lebih umum daripada minimum lokal, dan inilah salah satu alasan noise SGD kadang membantu: ia menendangmu keluar dari punggung kuda.",
        "Baik atau buruk: mengenali ketiga jebakan ini bagus — sebagian besar «GD tidak bekerja» di praktik adalah salah satu dari ketiganya, bukan GD-nya yang rusak. Buruk bila kamu menyalahkan modelnya: «logistic regression-nya jelek» padahal fitur belum distandardisasi dan η terlalu besar.",
        "Mitigasi (ringkas): (1) plot f per langkah — naik berarti η terlalu besar, datar berarti terlalu kecil; (2) standardisasi fitur sebelum GD; (3) bila gradien nol tapi hasilnya buruk, curigai saddle point — coba start lain atau tambah noise (SGD).",
      ],
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 11 · Lab 1",
      title: "Lab: gradient descent pada mangkuk kuadratik",
      prose: [
        "Sekarang giliranmu menulis GD. Fungsinya f(x, y) = x² + 10y², start (4, 4), 10 langkah — sama seperti langkah 4. Tugasmu hanya dua baris: gradiennya dan update-nya. Sisanya sudah ditulis.",
        "Hasil yang diharapkan [lab]: η = 0,01 → f = 12,5264; η = 0,05 → f = 1,9452; η = 0,09 → f = 2,1469; η = 0,12 → f = 133.869,2748. Bila hasilmu berbeda, periksa dulu gradiennya: turunan f terhadap x adalah 2x, terhadap y adalah 20y — bukan 10y. Kesalahan paling umum di lab ini adalah menulis gradien y = 10y (lupa faktor 2 dari turunan x²) atau lupa tanda minus pada update.",
        "Setelah lab jalan, ubah-ubah η sendiri: coba 0,02, 0,07, 0,10, 0,11 — di mana tepatnya batas antara konvergen dan divergen? (Petunjuk: divergen bila |1 − 20η| > 1, yaitu η > 0,1.)",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi grad: turunan parsial f terhadap x dan y" },
        { id: "t2", text: "Lengkapi update di gd: x dan y bergerak berlawanan gradien sebesar eta" },
        { id: "t3", text: "Jalankan dan bandingkan f akhir keempat eta dengan angka kanonis (12,5264 / 1,9452 / 2,1469 / 133869,2748)" },
      ],
      expected: "eta=0.01 -> f=12.5264\neta=0.05 -> f=1.9452\neta=0.09 -> f=2.1469\neta=0.12 -> f=133869.2748",
      hints: [
        "Turunan x² terhadap x adalah 2x; turunan 10y² terhadap y adalah 20y.",
        "Update: x_baru = x - eta * gx; y_baru = y - eta * gy — jangan lupa tanda minus.",
        "Batas divergen: |1 - 20*eta| > 1, yaitu eta > 0,1 — jadi 0,12 meledak, 0,09 masih selamat.",
      ],
      code: {
        starter: `# Gradient descent pada f(x, y) = x^2 + 10y^2 — lengkapi gradien & update-nya
# Start (4, 4); 10 langkah; eta dicoba: 0.01, 0.05, 0.09, 0.12

def f(x, y):
    return x * x + 10 * y * y

def grad(x, y):
    return (0.0, 0.0)  # TODO: turunan parsial f terhadap x dan y

def gd(eta, steps=10):
    x, y = 4.0, 4.0
    for _ in range(steps):
        gx, gy = grad(x, y)
        x = x  # TODO: update x dengan learning rate eta
        y = y  # TODO: update y dengan learning rate eta
    return f(x, y)

f_005 = gd(0.05)
for eta in [0.01, 0.05, 0.09, 0.12]:
    print(f"eta={eta} -> f={gd(eta):.4f}")`,
        lockLines: 6,
        solution: `# Gradient descent pada f(x, y) = x^2 + 10y^2 — lengkapi gradien & update-nya
# Start (4, 4); 10 langkah; eta dicoba: 0.01, 0.05, 0.09, 0.12

def f(x, y):
    return x * x + 10 * y * y

def grad(x, y):
    return (2 * x, 20 * y)

def gd(eta, steps=10):
    x, y = 4.0, 4.0
    for _ in range(steps):
        gx, gy = grad(x, y)
        x = x - eta * gx
        y = y - eta * gy
    return f(x, y)

f_005 = gd(0.05)
for eta in [0.01, 0.05, 0.09, 0.12]:
    print(f"eta={eta} -> f={gd(eta):.4f}")`,
        checks: [
          { kind: "equal", task: "t3", name: "f_005", value: 1.9452, tol: 0.00005, label: "`f_005` seharusnya 1.9452", msg: "GD 10 langkah dengan eta 0,05 dari (4, 4): f akhir 1,9452." },
          { kind: "stdout_matches", task: "t3", pattern: "eta=0\\.01 -> f=12\\.5264", label: "Output menampilkan eta 0,01 → f 12,5264", msg: "eta 0,01: lambat tapi stabil, f = 12,5264 setelah 10 langkah." },
          { kind: "stdout_matches", task: "t3", pattern: "eta=0\\.05 -> f=1\\.9452", label: "Output menampilkan eta 0,05 → f 1,9452", msg: "eta 0,05: terbaik setelah 10 langkah, f = 1,9452." },
          { kind: "stdout_matches", task: "t3", pattern: "eta=0\\.12 -> f=133869\\.2748", label: "Output menampilkan eta 0,12 → f 133869,2748 (divergen)", msg: "eta 0,12: divergen — f meledak ke 133869,2748." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 12 · Lab 2",
      title: "Lab: satu langkah GD min-variance dari data pin",
      prose: [
        "Lab kedua memindahkan GD ke data nyata — dengan angka yang sama seperti langkah 8, tapi kamu yang menghitung. Matriks kovarians tahunan (return SIMPLE 480 hari, BBCA + KLBF, data pin) sudah diberikan sebagai konstanta [notebook]: Σ = [[0,118956; 0,051145], [0,051145; 0,180734]]. Start w = (0,5; 0,5), η = 0,5.",
        "Hasil yang diharapkan [lab]: gradien [0,1701; 0,2319]; w baru (0,5193; 0,4807); variansi 0,1005 → 0,0994. Tiga TODO: gradien = 2Σw (perkalian matriks 2×2 dengan vektor — tulis manual, tanpa numpy); satu langkah GD; renormalisasi (bagi tiap bobot dengan jumlahnya).",
        "Perhatikan urutannya: gradien DULU dari w lama, baru update — jangan menghitung gradien dari w yang sudah di-update setengah jalan. Dan renormalisasi dilakukan SETELAH langkah GD penuh, bukan sebelum.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi grad: gradien variansi = 2 * Sigma @ w (tulis perkalian matriks 2x2 manual)" },
        { id: "t2", text: "Lengkapi w_raw: satu langkah GD dari w dengan ETA = 0,5" },
        { id: "t3", text: "Lengkapi w_new: renormalisasi w_raw agar jumlah bobot = 1, lalu bandingkan variansi" },
      ],
      expected: "gradien: [0.1701, 0.2319]\nw baru: (0.5193, 0.4807)\nvariansi: 0.1005 -> 0.0994",
      hints: [
        "Sigma @ w untuk matriks 2x2: baris 0 = SIGMA[0][0]*w[0] + SIGMA[0][1]*w[1]; baris 1 = SIGMA[1][0]*w[0] + SIGMA[1][1]*w[1]; lalu kali 2.",
        "Satu langkah GD: w_raw[i] = w[i] - ETA * grad[i].",
        "Renormalisasi: jumlah = w_raw[0] + w_raw[1]; w_new[i] = w_raw[i] / jumlah.",
      ],
      code: {
        starter: `# Satu langkah GD min-variance, 2 aset (BBCA + KLBF), dari w = (0,5; 0,5), eta = 0,5
# Matriks kovarians tahunan (return SIMPLE 480 hari, data pin) [notebook]:
#   Sigma = [[0.118956, 0.051145], [0.051145, 0.180734]]
SIGMA = [[0.118956, 0.051145], [0.051145, 0.180734]]
w = [0.5, 0.5]
ETA = 0.5

def var(w):
    return (w[0] * w[0] * SIGMA[0][0] + 2 * w[0] * w[1] * SIGMA[0][1]
            + w[1] * w[1] * SIGMA[1][1])

grad = [0.0, 0.0]  # TODO: gradien variansi = 2 * Sigma @ w
w_raw = [0.0, 0.0]  # TODO: satu langkah GD: w - ETA * grad
w_new = [0.0, 0.0]  # TODO: renormalisasi agar jumlah bobot = 1
var1 = var(w_new)
print(f"gradien: [{grad[0]:.4f}, {grad[1]:.4f}]")
print(f"w baru: ({w_new[0]:.4f}, {w_new[1]:.4f})")
print(f"variansi: {var(w):.4f} -> {var1:.4f}")`,
        lockLines: 11,
        solution: `# Satu langkah GD min-variance, 2 aset (BBCA + KLBF), dari w = (0,5; 0,5), eta = 0,5
# Matriks kovarians tahunan (return SIMPLE 480 hari, data pin) [notebook]:
#   Sigma = [[0.118956, 0.051145], [0.051145, 0.180734]]
SIGMA = [[0.118956, 0.051145], [0.051145, 0.180734]]
w = [0.5, 0.5]
ETA = 0.5

def var(w):
    return (w[0] * w[0] * SIGMA[0][0] + 2 * w[0] * w[1] * SIGMA[0][1]
            + w[1] * w[1] * SIGMA[1][1])

grad = [2 * (SIGMA[0][0] * w[0] + SIGMA[0][1] * w[1]),
        2 * (SIGMA[1][0] * w[0] + SIGMA[1][1] * w[1])]
w_raw = [w[0] - ETA * grad[0], w[1] - ETA * grad[1]]
s = w_raw[0] + w_raw[1]
w_new = [w_raw[0] / s, w_raw[1] / s]
var1 = var(w_new)
print(f"gradien: [{grad[0]:.4f}, {grad[1]:.4f}]")
print(f"w baru: ({w_new[0]:.4f}, {w_new[1]:.4f})")
print(f"variansi: {var(w):.4f} -> {var1:.4f}")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "gradien: \\[0\\.1701, 0\\.2319\\]", label: "Output menampilkan gradien [0,1701; 0,2319]", msg: "Gradien variansi di w = (0,5; 0,5): [0,1701; 0,2319]." },
          { kind: "stdout_matches", task: "t3", pattern: "w baru: \\(0\\.5193, 0\\.4807\\)", label: "Output menampilkan w baru (0,5193; 0,4807)", msg: "Satu langkah GD + renormalisasi: w = (0,5193; 0,4807)." },
          { kind: "stdout_matches", task: "t3", pattern: "variansi: 0\\.1005 -> 0\\.0994", label: "Output menampilkan variansi 0,1005 → 0,0994", msg: "Variansi tahunan turun 0,1005 → 0,0994 dalam satu langkah." },
          { kind: "equal", task: "t3", name: "var1", value: 0.0994, tol: 0.00005, label: "`var1` seharusnya 0.0994", msg: "Variansi setelah satu langkah GD: 0,0994." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 13 · Checkpoint",
      title: "Checkpoint: menuruni bukit dengan kompas gradien",
      prose: [
        "Rangkuman: optimasi = fungsi tujuan + variabel keputusan (+ kendala, di M5.2). Gradien menunjuk ke arah naik tercuram; GD melangkah berlawanan dengannya: θ ← θ − η∇f(θ). Pada mangkuk f(x, y) = x² + 10y² dari (4, 4), f awal 176; setelah 10 langkah [notebook]: η = 0,01 → 12,5264 (52 langkah untuk f < 2); η = 0,05 → 1,9452 (terbaik, 10 langkah); η = 0,09 → 2,1469 (berosilasi, menyalip di langkah ke-11 dengan f 1,3838); η = 0,12 → 133.869,2748 (DIVERGEN — y meledak ke 115,7019). Berhenti bila ‖∇f‖ atau |Δf| sudah di bawah ambang; convex = satu minimum global, non-convex = banyak minimum lokal + saddle point. Momentum mempercepat arah yang konsisten; Adam memberi tiap parameter learning rate adaptif. Closed-form menang bila ada rumusnya (GMV 3-aset (0,5518; 0,2698; 0,1785)); GD menang bila tidak ada (risk parity (0,3980; 0,3212; 0,2808)); max-Sharpe tanpa kendala memberi bobot absurd (−3154,746; −3786,1043; 6941,8503) — rumus benar, keputusan tidak bisa dieksekusi. Satu langkah GD min-variance BBCA+KLBF (η = 0,5): gradien [0,1701; 0,2319], w (0,5; 0,5) → (0,5193; 0,4807), variansi 0,1005 → 0,0994 — menutup ~23% jarak ke GMV 2-aset (0,6565; 0,3435; variansi 0,0957). Tapi renormalisasi mentah yang diulang TIDAK menuju GMV — ia berhenti di (2,2950; −1,2950), variansi 0,6256; projected GD yang benar mencapai GMV dalam 100 langkah. SGD memakai gradien berisik dari mini-batch: murah dan kadang membantu keluar dari saddle point, tapi bergetar selamanya bila η tidak diturunkan [ilustrasi: batch f = 0,000014 vs SGD f = 0,0626 vs mini-batch(4) f = 0,0018 setelah 30 langkah]. Jebakan: learning rate, skala fitur (standardisasi dulu), saddle point.",
        "Guided task di Colab — notebook mlf-m51-guided-task.ipynb — mereplikasi semua angka kanonis lesson ini dari data pin: GD mangkuk kuadratik 4 learning rate; satu langkah GD min-variance; projected GD 100 langkah vs GMV closed-form 2-aset; SGD vs batch vs mini-batch. Jalur file notebook: colab/mlf-m51-guided-task.ipynb. Tautan Colab: https://colab.research.google.com/drive/1F-ZEKn45w69A7c88YhtmjQbVQA5Gf2ay",
        "Lanjut: MLF-M5.2 — Optimasi dengan Kendala: bagaimana menangani kendala jumlah-bobot, larangan short, dan batas per aset dengan benar — termasuk mengapa renormalisasi mentah gagal dan apa yang menggantikannya.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Fungsi [ilustrasi] f(x, y) = x² + y², start (2, 1), learning rate η = 0,25. Satu langkah gradient descent memberi posisi baru berapa?",
          options: [
            { text: "(1,0; 0,5)", why: "Benar: gradien di (2, 1) adalah (2×2, 2×1) = (4, 2); langkah = 0,25 × (4, 2) = (1,0; 0,5); posisi baru = (2 − 1,0; 1 − 0,5) = (1,0; 0,5). Nilai f turun dari 5 ke 1,25.", correct: true },
            { text: "(3,0; 1,5)", why: "Itu langkah SEARAH gradien (naik): (2 + 1,0; 1 + 0,5). GD melangkah BERLAWANAN dengan gradien — minus, bukan plus." },
            { text: "(−2,0; −1,0)", why: "Itu (2, 1) − gradien PENUH tanpa learning rate: (2 − 4, 1 − 2). Learning rate 0,25 harus dikalikan dulu: langkahnya (1,0; 0,5), bukan (4, 2)." },
            { text: "(0,0; 0,0)", why: "Itu hasil bila η = 0,5 — bukan 0,25. Dengan η = 0,25, langkahnya setengah dari itu: posisi baru (1,0; 0,5)." },
          ],
        },
        {
          q: "Pada mangkuk f(x, y) = x² + 10y² dari (4, 4), η = 0,12 membuat f meledak ke 133.869,2748 setelah 10 langkah. Mengapa?",
          options: [
            { text: "Karena fungsi itu non-convex dan GD terjebak di minimum lokal", why: "Mangkuk kuadratik itu convex — satu minimum global di (0, 0). Masalahnya bukan minimum lokal, melainkan langkah yang terlalu besar." },
            { text: "Karena faktor y per langkah |1 − 20η| = 1,4 > 1 — |y| membesar 40% tiap langkah dan berosilasi", why: "Benar: y_{t+1} = (1 − 20η)·y_t = −1,4·y_t — tanda berbalik dan besarnya tumbuh 40% per langkah; setelah 10 langkah y = 115,7019 dan f = 133.869,2748.", correct: true },
            { text: "Karena gradien di (4, 4) terlalu kecil untuk η = 0,12", why: "Terbalik: gradien di (4, 4) adalah (8, 80) — BESAR, terutama di arah y. Justru karena gradien y besar, η = 0,12 melompat terlalu jauh." },
            { text: "Karena start (4, 4) terlalu jauh dari minimum", why: "Start yang sama (4, 4) dengan η = 0,05 justru mencapai f = 1,9452 dalam 10 langkah. Jarak start bukan penyebab — η-nya yang melewati ambang divergen (η > 0,1)." },
          ],
        },
        {
          q: "Setelah 10 langkah GD pada mangkuk kuadratik, η mana yang memberi f TERKECIL?",
          options: [
            { text: "η = 0,01 — f = 12,5264", why: "η = 0,01 paling lambat: f masih 12,5264 setelah 10 langkah (butuh 52 langkah untuk f < 2)." },
            { text: "η = 0,05 — f = 1,9452", why: "Benar: η = 0,05 memberi f = 1,9452 — terkecil setelah 10 langkah, mengalahkan η = 0,09 (2,1469) dan η = 0,12 yang divergen (133.869,2748).", correct: true },
            { text: "η = 0,09 — f = 2,1469", why: "η = 0,09 memang menyalip 0,05 pada langkah ke-11 (f 1,3838), tapi SETELAH 10 langkah ia masih di 2,1469 — sedikit di atas 1,9452." },
            { text: "η = 0,12 — f = 133.869,2748", why: "Itu yang TERBESAR, bukan terkecil — η = 0,12 divergen." },
          ],
        },
        {
          q: "Apa yang ditunjuk oleh gradien ∇f di satu titik?",
          options: [
            { text: "Arah menuju minimum global", why: "Gradien tidak tahu di mana minimum global berada — ia hanya memakai informasi lokal di titik itu." },
            { text: "Arah fungsi naik paling curam; GD melangkah berlawanan dengannya", why: "Benar: gradien = vektor turunan parsial, arah kenaikan tercuram. GD memakai MINUS gradien untuk menuruni bukit.", correct: true },
            { text: "Arah fungsi turun paling curam", why: "Terbalik: arah turun paling curam adalah MINUS gradien. Gradien sendiri menunjuk ke atas." },
            { text: "Arah dengan learning rate terbesar", why: "Learning rate bukan arah — ia adalah ukuran langkah, dan sama untuk semua arah dalam GD polos." },
          ],
        },
        {
          q: "Apa perbedaan praktis utama momentum dan Adam dibanding GD polos?",
          options: [
            { text: "Keduanya menghilangkan kebutuhan akan fungsi tujuan", why: "Tidak — fungsi tujuan tetap dibutuhkan; yang berubah adalah cara melangkah menuruni fungsinya." },
            { text: "Momentum memakai langkah sebelumnya untuk meredam osilasi dan mempercepat arah yang konsisten; Adam memberi tiap parameter learning rate adaptif", why: "Benar: momentum = kecepatan yang dirata-rata dari langkah sebelumnya; Adam = langkah per parameter yang menyesuaikan dengan besar dan kestabilan gradiennya.", correct: true },
            { text: "Keduanya menjamin sampai di minimum global", why: "Tidak ada optimizer berbasis gradien yang menjamin minimum global di fungsi non-convex — momentum dan Adam hanya mengubah dinamika langkahnya." },
            { text: "Momentum hanya untuk portofolio, Adam hanya untuk neural network", why: "Keduanya optimizer umum — berlaku untuk fungsi apa pun, dari mangkuk kuadratik sampai loss neural network." },
          ],
        },
        {
          q: "Kapan closed-form (rumus tertutup) lebih baik daripada gradient descent?",
          options: [
            { text: "Bila fungsinya kuadratik, dimensinya kecil, dan tidak ada kendala aneh — misal GMV 3-aset langsung (0,5518; 0,2698; 0,1785)", why: "Benar: GMV punya rumus tertutup — satu perhitungan, eksak, tanpa learning rate dan tanpa risiko divergen. GD di sana hanya latihan.", correct: true },
            { text: "Bila datanya sangat besar (jutaan baris)", why: "Terbalik: data besar justru wilayah GD/SGD — rumus tertutup butuh matriks kovarians penuh dan inversi yang mahal." },
            { text: "Bila masalahnya risk parity — karena tidak ada rumus tertutupnya", why: "Terbalik: risk parity (0,3980; 0,3212; 0,2808) TIDAK punya rumus tertutup — ia harus dicari iteratif, itulah wilayah GD." },
            { text: "Selalu — rumus tertutup tidak pernah kalah dari iterasi", why: "Rumus tertutup tanpa kendala bisa memberi jawaban absurd: max-Sharpe tanpa kendala memberi bobot (−3154,746; −3786,1043; 6941,8503) — benar secara matematis, tidak bisa dieksekusi." },
          ],
        },
        {
          q: "Satu langkah GD min-variance BBCA+KLBF (η = 0,5) dari w = (0,5; 0,5): gradien [0,1701; 0,2319], w baru (0,5193; 0,4807), variansi 0,1005 → 0,0994. Apa bacaan yang benar?",
          options: [
            { text: "Bobot BBCA naik karena gradien BBCA lebih kecil — GD menggeser bobot ke aset yang variansinya kurang sensitif", why: "Benar: gradien BBCA 0,1701 < KLBF 0,2319, jadi langkah GD mengurangi bobot KLBF lebih banyak; setelah renormalisasi BBCA 0,5 → 0,5193 dan variansi turun 0,1005 → 0,0994.", correct: true },
            { text: "Portofolio sudah optimal karena variansi turun", why: "Variansi 0,0994 masih jauh dari GMV 2-aset 0,0957 — satu langkah baru menutup ~23% jarak dari equal-weight ke GMV." },
            { text: "Bobot KLBF seharusnya naik karena volatilitasnya lebih tinggi", why: "Terbalik: dalam min-variance, aset yang LEBIH volatil (KLBF 0,4251 vs BBCA 0,3449) justru bobotnya DIKURANGI — KLBF 0,5 → 0,4807." },
            { text: "Renormalisasi tidak diperlukan karena GD menjaga jumlah bobot = 1", why: "GD polos TIDAK menjaga jumlah bobot: w_mentah berjumlah 0,7990, bukan 1 — renormalisasi itulah yang mengembalikannya ke 1." },
          ],
        },
        {
          q: "SGD memakai gradien dari satu mini-batch acak di tiap langkah. Apa konsekuensi yang benar?",
          options: [
            { text: "SGD selalu konvergen ke titik minimum bila learning rate tetap", why: "Terbalik: dengan η tetap, SGD bergetar selamanya di sekitar minimum (f rata-rata 10 langkah terakhir 0,1432 pada demo [ilustrasi]) — η harus DITURUNKAN agar mendarat tenang." },
            { text: "Tiap langkah lebih murah, gradiennya berisik, jalurnya bergetar — tapi noise itu kadang membantu keluar dari saddle point", why: "Benar: mini-batch(4) mencapai f = 0,0018 vs batch 0,000014 dan SGD murni 0,0626 setelah 30 langkah [ilustrasi] — makin besar batch, makin kecil noise; dan noise acak bisa menendang GD keluar dari titik gradien-nol yang bukan minimum.", correct: true },
            { text: "SGD tidak pernah bisa mengalahkan batch GD dalam akurasi akhir", why: "Dengan learning-rate decay, SGD bisa mencapai akurasi yang sama — dan di data besar, batch GD tidak praktis karena tiap langkah menghitung gradien seluruh data." },
            { text: "Mini-batch yang lebih besar selalu lebih buruk daripada satu baris", why: "Terbalik: mini-batch(4) (f = 0,0018) jauh lebih baik daripada SGD satu baris (f = 0,0626) pada demo yang sama — batch lebih besar berarti noise lebih kecil." },
          ],
        },
      ],
      summary: [
        "Optimasi = fungsi tujuan + variabel keputusan (+ kendala, di M5.2). Gradien menunjuk ke arah naik tercuram; GD melangkah berlawanan: θ ← θ − η∇f(θ).",
        "Mangkuk f(x, y) = x² + 10y² dari (4, 4), f awal 176, 10 langkah [notebook]: η = 0,01 → 12,5264; η = 0,05 → 1,9452; η = 0,09 → 2,1469; η = 0,12 → 133.869,2748 (divergen).",
        "Berhenti bila ‖∇f‖ atau |Δf| di bawah ambang; convex = satu minimum global, non-convex = minimum lokal + saddle point (f = x² − y² di (0, 0) [ilustrasi]).",
        "Momentum meredam osilasi dan mempercepat arah konsisten; Adam memberi tiap parameter learning rate adaptif.",
        "Closed-form menang bila ada rumusnya (GMV 3-aset (0,5518; 0,2698; 0,1785)); GD menang bila tidak ada (risk parity (0,3980; 0,3212; 0,2808)); max-Sharpe tanpa kendala memberi bobot absurd (−3154,746; −3786,1043; 6941,8503).",
        "Satu langkah GD min-variance BBCA+KLBF (η = 0,5): gradien [0,1701; 0,2319], w (0,5; 0,5) → (0,5193; 0,4807), variansi 0,1005 → 0,0994 (~23% jarak ke GMV 2-aset (0,6565; 0,3435)).",
        "Renormalisasi mentah yang diulang TIDAK menuju GMV — berhenti di (2,2950; −1,2950), variansi 0,6256; projected GD mencapai GMV dalam 100 langkah.",
        "SGD: gradien berisik dari mini-batch — murah, bergetar, kadang membantu keluar dari saddle point; η harus diturunkan agar mendarat (batch f = 0,000014 vs SGD 0,0626 vs mini-batch(4) 0,0018 [ilustrasi]).",
        "Lab: GD kuadratik — η 0,01/0,05/0,09/0,12 → f 12,5264 / 1,9452 / 2,1469 / 133869,2748; GD min-variance — gradien [0,1701; 0,2319], w (0,5193; 0,4807), variansi 0,1005 → 0,0994.",
      ],
      next: { label: "Lanjut: MLF-M5.2 — Optimasi dengan Kendala", href: "/v2/learn/mlf-m52-constrained-optimization-lagrange" },
    },
  ],
};
