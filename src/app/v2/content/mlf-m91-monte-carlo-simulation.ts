import type { V2Lesson } from "../lib/types";

export const mlfM91: V2Lesson = {
  slug: "mlf-m91-monte-carlo-simulation",
  track: "Machine Learning Finance",
  module: "Simulation, Backtesting & Validation",
  title: "MLF-M9.1 — Monte Carlo Simulation: Menghitung Risiko dari Dunia yang Belum Terjadi",
  estMinutes: 100,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "VaR 0,0286 dari 480 hari — dan 480 hari itu sampel kecil",
      prose: [
        "Governance selesai di M8.5 — model sudah divalidasi, diberi tier, didokumentasikan, dan disetujui lewat komite. Sekarang kita validasi lewat simulasi: M9 menguji apakah angka-angka yang sudah disetujui itu bertahan bila dunia diundi ulang.",
        "Bayangkan kamu duduk di komite risiko dengan satu angka di tangan: VaR95 historis portofolio 0,0286 — pada 95% hari, kerugian harian tidak melebihi 2,86% (Rp2.856.323 pada portofolio Rp100.000.000). Angka itu dihitung dari 480 hari perdagangan, 2024-11-04 sampai 2026-11-11 [M4]. Terdengar kokoh — sampai kamu bertanya: 480 hari itu berapa banyak «hari buruk» yang sempat terlihat? Kuantil 5% dari 480 hari hanya bersandar pada 24 hari terburuk (5% × 480 = 24). Seluruh penilaian ekormu — dan ES95 historis 0,0445 (Rp4.451.285), rata-rata kerugian pada 24 hari terburuk itu — berdiri di atas 24 observasi. Pasar punya lebih banyak cara untuk menjadi buruk daripada 24 hari yang sempat terjadi.",
        "Monte Carlo (MC) menjawab kekurangan itu dengan cara yang berani sekaligus jujur: bila sejarah terlalu pendek, SIMULASIKAN sejarah yang lain. Ambil distribusi return harian yang diestimasi dari 480 hari itu, lalu undi 100.000 «hari» baru dari distribusi tersebut — hari-hari yang tidak pernah terjadi, tapi COCOK dengan sifat statistik hari-hari yang pernah terjadi. VaR95 MC 1-hari (N=100.000) adalah 0,0329 (Rp3.290.000) [m9_canonical.json] — sedikit di atas VaR95 historis 0,0286 dan hampir sama dengan VaR95 parametrik 0,0328 [M4.2]. Tiga angka, tiga asumsi — dan lesson ini mengajarkanmu membaca ketiganya, bukan memilih satu lalu melupakan dua lainnya.",
        "Konvensi lesson ini (tulis eksplisit, karena seluruh angka bergantung padanya): risiko pasar = portofolio EQUAL-WEIGHT BBCA/KLBF/UNVR dengan SIMPLE daily returns (n=480, 2024-11-04→2026-11-11) — seri yang sama dengan M4.2 VaR dan M5. Simulasi GBM memakai LOG returns portofolio itu: μ_log −0,000752, σ_log 0,0198; μ_simple −0,000558, σ_simple 0,0196 [m9_canonical.json]. Konversi log→simple = expm1 (return simple = exp(log-return) − 1). Seed 42 di semua simulasi — angka yang sama, bila dihitung ulang dengan seed yang sama, memberi hasil yang sama. Semua angka MC di lesson ini berasal dari m9_canonical.json, dihitung dari data, bukan karangan.",
        "Peta lesson: cerita 480 hari dan 24 hari terburuk → model GBM dan asumsinya → satu hari, satu simulasi (tiga estimator VaR) → hukum 1/√N dan error antar-batch → jalan 10 hari dan kapan skala √10 berbohong → konvergensi: kapan berhenti menambah N → jebakan MC yang «terlalu bagus» → mini-case: mana yang dilaporkan ke komite → 2 lab → 2 figure → checkpoint.",
        "Nilai: Monte Carlo bagus karena ia mengubah pertanyaan «apa yang PERNAH terjadi?» menjadi «apa yang BISA terjadi, bila sifat statistik kemarin bertahan?». VaR historis hanya tahu 24 hari terburuk yang sempat terjadi; MC tahu 5.000 hari terburuk dari 100.000 hari simulasi (5% × 100.000) — ekornya diukur, bukan ditebak dari 24 titik.",
        "Baik atau buruk: MC bagus bila dibaca sebagai DISTRIBUSI yang dihasilkan asumsi yang eksplisit — kamu bisa menunjuk asumsi mana yang bertanggung jawab atas angka mana. Buruk bila dibaca sebagai «ramalan»: 100.000 hari simulasi tidak mengandung satu pun informasi baru tentang pasar — semuanya berasal dari μ_log dan σ_log yang diestimasi dari 480 hari yang sama. MC tidak menambah DATA; ia menambah ARITMETIKA.",
        "Mitigasi: setiap angka MC tuliskan BERSAMA asumsi dan N-nya: «VaR95 MC 0,0329 (N=100.000, log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), seed 42)». Tanpa baris itu, 0,0329 terlihat seperti fakta pasar — padahal ia fakta tentang MODEL.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR historis 0,0286 adalah «risiko pasar yang sebenarnya»",
        type: "pitfall",
        body: "Yang benar: 0,0286 adalah kuantil empiris dari 480 hari — estimasi dari sampel kecil, bukan sifat pasar. Kuantil 5%-nya hanya bersandar pada 24 hari terburuk. VaR parametrik 0,0328 [M4.2] dan VaR MC 0,0329 (N=100.000) [m9_canonical.json] mengestimasi besaran yang sama dengan asumsi yang berbeda — dan ketiganya harus dilaporkan bersama, bukan dipilih satu.",
      },
    },
    {
      id: "gbm",
      eyebrow: "Langkah 2 · GBM",
      title: "GBM: modelnya — satu persamaan, tiga asumsi, dua batas",
      prose: [
        "Model yang dipakai lesson ini adalah Geometric Brownian Motion (GBM) — model standar harga aset: dS/S = μ dt + σ dW, harga bergerak dengan drift μ dan guncangan acak σ dW (dW = gerak Brown). Dalam bentuk diskret yang dipakai simulasi: log-return satu hari berdistribusi Normal, log S(t+1) − log S(t) ~ Normal(μ_log, σ_log²), dengan μ_log −0,000752 dan σ_log 0,0198 [m9_canonical.json]. μ_log dan σ_log di sini adalah mean dan simpangan baku EMPIRIS dari log-return portofolio — bukan parameter teori: karena yang diestimasi langsung adalah mean log-return, tidak ada koreksi Itô yang perlu ditambahkan di simulasi diskret ini. Return SIMPLE diperoleh dengan expm1: r_simple = exp(r_log) − 1.",
        "Tiga asumsi yang kamu teken saat memakai model ini: (1) log-return berdistribusi NORMAL — ekornya ditentukan sepenuhnya oleh μ_log dan σ_log; (2) log-return INDEPENDEN antar hari (iid) — hari ini tidak mengingat kemarin; (3) volatilitas KONSTAN — σ_log yang sama untuk semua hari, tenang maupun panik. Ketiganya bisa — dan harus — diperiksa terhadap data, dan lesson ini memeriksa dua di antaranya sekarang, satu nanti.",
        "Pemeriksaan pertama — normalitas: distribusi SIMPLE return portofolio miring ke kiri (skew −0,5091) dan berekor tebal (excess kurtosis 6,0216) [m9_canonical.json]. Normal tidak punya kemiringan dan tidak punya ekor tebal — jadi asumsi (1) SUDAH salah secara deskriptif, sebelum simulasi apa pun dijalankan. Konsekuensinya terlihat di langkah 3: kuantil empiris 5% (0,0286) berada di bawah kuantil normal (0,0328), sementara ES historis (0,0445) berada DI ATAS ES parametrik (0,0410) — «bahu» 5%-nya lebih tipis dari normal, tapi ekor ekstremnya lebih tebal. Model normal meratakan bentuk ini menjadi satu kurva lonceng.",
        "Pemeriksaan kedua — volatilitas konstan: asumsi (3) juga salah secara deskriptif. Volatilitas BERGEROMBOL: autokorelasi lag-1 dari squared return adalah 0,1043 [M4.3] — hari yang bergejolak cenderung diikuti hari yang bergejolak. Model yang menangkap ini adalah EWMA dan GARCH [M4.3], bukan GBM dengan σ konstan. GBM di lesson ini adalah MODEL DASAR — titik awal yang asumsi-nya transparan, bukan model terakhir. Asumsi (2), independensi LEVEL return, adalah yang paling bisa dipertahankan di data ini — tetapi independensi level bukan independensi volatilitas, dan GBM mencampuradukkan keduanya bila dibaca tanpa hati-hati.",
        "Nilai: GBM bagus karena ia SATU-SATUNYA model di lesson ini yang asumsi-nya bisa ditulis dalam satu baris — dan karena itu satu-satunya yang kesalahannya bisa dilacak ke asumsi tertentu. Bila VaR MC meleset, kamu tahu persis ke mana harus menunjuk: normalitas, independensi, atau volatilitas konstan.",
        "Baik atau buruk: GBM bagus sebagai TITIK AWAL — ia memberi distribusi lengkap (bukan hanya satu kuantil) dari dua angka (μ_log, σ_log). Buruk bila dipakai sebagai TITIK AKHIR: σ konstan berarti model ini TIDAK TAHU bahwa pasar punya periode tenang dan periode panik — ia memberi jawaban yang sama untuk keduanya, yaitu jawaban rata-rata.",
        "Mitigasi: sebelum menjalankan satu simulasi pun, tulis tiga asumsi GBM dan satu baris bukti untuk tiap asumsi (normal? iid? vol konstan?). Bila satu asumsi gagal — dan di data ini ketiganya gagal — tulis itu di samping hasil simulasi, bukan di lampiran. Hasil MC tanpa daftar asumsi yang gagal adalah hasil yang menyesatkan.",
      ],
      tasks: [],
      formula: String.raw`\frac{dS}{S} = \mu\,dt + \sigma\,dW, \qquad \log S_{t+1} - \log S_t \sim \mathcal{N}(\mu_{\log},\, \sigma_{\log}^2), \quad \mu_{\log} = -0{,}000752,\ \sigma_{\log} = 0{,}0198`,
      formulaNote: "GBM dalam bentuk kontinu (kiri) dan bentuk diskret yang dipakai simulasi (kanan). μ_log dan σ_log adalah mean dan simpangan baku EMPIRIS log-return harian portofolio equal-weight BBCA/KLBF/UNVR (n=480) [m9_canonical.json] — karena yang diestimasi langsung adalah mean log-return, simulasi diskret tidak memakai koreksi Itô. Return simple = expm1(log-return).",
      note: {
        title: "Jebakan: GBM dibaca sebagai «model pasar yang sebenarnya»",
        type: "risk",
        body: "Yang benar: GBM adalah model dengan tiga asumsi (normal, iid, vol konstan) — dan ketiganya gagal di data ini: skew −0,5091 dan excess kurtosis 6,0216 [m9_canonical.json] menyangkal normalitas, dan autokorelasi squared return lag-1 0,1043 [M4.3] menyangkal DUA asumsi sekaligus — iid (bila return iid, squared return pun tak berkorelasi) dan volatilitas konstan (lihat EWMA/GARCH [M4.3]). Satu gejala, dua asumsi gugur — itulah volatility clustering. GBM adalah titik awal yang transparan — bukan vonis tentang pasar.",
      },
    },
    {
      id: "satu-hari",
      eyebrow: "Langkah 3 · Satu hari, satu simulasi",
      title: "Satu hari, satu simulasi: tiga angka VaR, tiga asumsi",
      prose: [
        "Definisi dulu, eksak: VaR95 adalah KUANTIL 95% dari distribusi KERUGIAN — kerugian yang hanya terlampaui pada 5% hari. Bukan «kerugian maksimum» (tidak ada maksimum pada distribusi yang tak terbatas), bukan «kerugian terburuk yang pernah terjadi» (itu satu observasi), dan bukan rata-rata kerugian. ES95 adalah rata-rata kerugian BEYOND VaR — rata-rata kerugian pada 5% hari terburuk saja. Dua definisi ini mengikat semua angka di lesson ini; bila kamu membacanya sebagai «maksimum», seluruh perbandingan di bawah ini runtuh.",
        "Sekarang tiga estimator untuk besaran yang sama, VaR95 1-hari portofolio. Historis [M4.2]: VaR95 0,0286, ES95 0,0445 — kuantil empiris dari 480 hari, tanpa asumsi distribusi apa pun, tapi hanya bersandar pada 24 hari terburuk. Parametrik [M4.2]: VaR95 0,0328, ES95 0,0410 — rumus normal dari μ_simple −0,000558 dan σ_simple 0,0196: VaR95 = −(μ_simple − 1,645 × σ_simple) = 0,000558 + 0,032240 = 0,0328 [turunan]. Monte Carlo joint-normal M4 [M4.2]: VaR95 0,0336, ES95 0,0424 — mensimulasikan ketiga saham bersama dengan korelasinya, lalu equal-weight. Dan Monte Carlo univariat lesson ini (normal pada LOG-return portofolio, seed 42): N=1.000 → VaR95 0,0335, ES95 0,0413; N=10.000 → 0,0332 / 0,0411; N=100.000 → 0,0329 / 0,0407 [m9_canonical.json].",
        "Bacalah pola itu seperti pemeriksa. MC univariat dan parametrik HAMPIR SAMA (0,0329 vs 0,0328; ES 0,0407 vs 0,0410) — dan memang harus sama: keduanya memakai asumsi yang sama (normal), yang satu lewat rumus, yang satu lewat undian. Selisih 0,0001 di antaranya adalah MC error (langkah 4), bukan perbedaan model. MC joint-normal M4 sedikit lebih tinggi (0,0336 vs 0,0329) — ia mensimulasikan tiga saham lalu menggabungkannya, sementara MC univariat mensimulasikan log-return portofolio langsung; keduanya menghampiri besaran yang sama dari dua arah, dan selisih 0,0007 di antaranya adalah ukuran seberapa besar «aproksimasi» itu — MC univariat mengaproksimasi log-return portofolio sebagai normal, sementara MC joint M4 mensimulasikan tiga saham. Yang BERBEDA adalah historis: VaR95 0,0286 — 0,0043 di bawah parametrik dan MC univariat — sementara ES95 historis 0,0445 — 0,0035–0,0038 DI ATAS parametrik dan MC univariat. MC joint M4 berdiri sedikit lebih jauh: VaR-nya 0,0050 di atas historis, ES-nya 0,0021 di bawah historis. Satu distribusi, dua arah perbedaan: «bahu» 5%-nya lebih tipis dari normal, ekor ekstremnya lebih tebal (skew −0,5091, excess kurtosis 6,0216 [m9_canonical.json]).",
        "Nilai: tiga estimator bagus karena mereka SALING MENJAGA — tidak satu pun yang boleh dibaca sendirian. Historis menjaga agar kamu tidak lupa bentuk empirisnya; parametrik menjaga agar angkanya bisa dihitung ulang dari dua angka; MC menjaga agar distribusi lengkapnya terlihat (termasuk ES dan peluang kejadian apa pun). Bila ketiganya berdekatan, kepercayaanmu naik; bila mereka berjauhan — seperti di sini, 0,0286 vs 0,0329 — jarak itu SENDIRI adalah informasi: ada sesuatu tentang bentuk distribusi yang tidak ditangkap normal.",
        "Baik atau buruk: perbandingan tiga estimator bagus bila tiap angka ditulis bersama asumsinya — «historis (tanpa asumsi, n=480)», «parametrik (normal, μ/σ)», «MC (normal pada log-return, N=100.000, seed 42)». Buruk bila satu angka dikutip tanpa label: «VaR95 adalah 0,0329» tanpa menyebut MC, N, dan asumsi adalah kalimat yang tidak bisa diperiksa — dan kalimat yang tidak bisa diperiksa adalah kalimat yang tidak bisa dipercaya.",
        "Mitigasi: di laporan risiko, tulis ketiganya dalam satu baris — hist 0,0286 / param 0,0328 / MC 0,0329 — beserta ES masing-masing (0,0445 / 0,0410 / 0,0407). Bila seseorang bertanya «jadi VaR-nya berapa?», jawabannya adalah baris itu, bukan satu angka di antaranya.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: VaR adalah «kerugian maksimum»",
        type: "pitfall",
        body: "Yang benar: VaR95 adalah KUANTIL distribusi kerugian — kerugian yang terlampaui pada 5% hari. Pada portofolio Rp100.000.000, VaR95 MC 0,0329 berarti kerugian melebihi Rp3.290.000 pada 5% hari — dan pada hari-hari itu kerugiannya BISA jauh lebih besar; rata-ratanya adalah ES95 0,0407 (Rp4.070.000). «Maksimum» tidak ada dalam definisi ini.",
      },
    },
    {
      id: "hukum-akar-n",
      eyebrow: "Langkah 4 · Hukum 1/√N",
      title: "Hukum 1/√N: menambah simulasi mengecilkan error — dengan kecepatan yang melambat",
      prose: [
        "Monte Carlo punya satu hukum yang tidak bisa ditawar: standard error (SE) sebuah estimasi menyusut dengan 1/√N — melipatgandakan N sepuluh kali hanya membagi SE dengan √10 ≈ 3,16. Untuk estimasi MEAN return harian (σ_simple 0,0196), SE = σ/√N: N=100 → 0,001962; N=1.000 → 0,000620; N=10.000 → 0,000196; N=100.000 → 0,000062 [m9_canonical.json]. Setiap nol tambahan pada N membeli pengurangan SE yang semakin kecil: dari N=100 ke 1.000, SE turun 0,001342; dari 10.000 ke 100.000, hanya turun 0,000134 — sepersepuluhnya, untuk komputasi sepuluh kali lipat.",
        "Realised MC mean error (selisih antara mean hasil simulasi dan mean sebenarnya, satu undian per N) menunjukkan sisi lain hukum ini: N=100 → −0,000149; N=1.000 → −0,000813; N=10.000 → −0,000118; N=100.000 → −0,000015 [m9_canonical.json]. Perhatikan dua baris ini sekaligus. Pada N=1.000, error yang terealisasi (−0,000813) LEBIH BESAR dari SE-nya (0,000620) — sekitar 1,3 SE — dan itu NORMAL: SE adalah ukuran TIPIKAL error, bukan batas maksimumnya. Pada N=100, error yang terealisasi (−0,000149) jauh LEBIH KECIL dari SE-nya (0,001962) — dan itu KEBERUNTUNGAN, bukan bukti N=100 sudah cukup: undian berikutnya bisa memberi error sebesar 0,002. SE mengatur ekspektasi; realised error adalah satu undian darinya. Jangan pernah menilai N dari satu realised error.",
        "Hukum yang sama berlaku untuk VaR — dengan ukuran yang diukur langsung, bukan dari rumus. 20 batch independen, masing-masing N=10.000, memberi VaR95 dengan mean 0,0326 (sd antar-batch 0,0004; SE 0,00009) dan range [0,0319; 0,0333] [m9_canonical.json]. SE di sini dihitung sebagai sd/√n = 0,0004/√20 ≈ 0,00009 — simpangan baku antar-batch adalah 0,0004, dan ketidakpastian atas RATA-RATA 20 batch itu adalah 0,00009; keduanya bukan hal yang sama (aturan keras lesson ini: jangan tulis «mean ± sd» sebagai ketidakpastian mean — tulis «mean (sd ...; SE ...)»). Bandingkan dengan mean simulasi 1-hari pada N=10.000: −0,0007 [m9_canonical.json] — dan perhatikan bahwa VaR95 antar-batch berayun 0,0014 dari ujung ke ujung (0,0333 − 0,0319), sementara selisih VaR95 MC N=10.000 (0,0332) vs N=100.000 (0,0329) hanya 0,0003 — di dalam ayunan antar-batch itu. Naik dari 10.000 ke 100.000 mengecilkan error, tetapi tidak mengubah keputusan apa pun di lesson ini.",
        "Nilai: hukum 1/√N bagus karena ia memberi HARGA pada ketelitian: tiap digit tambahan pada VaR punya biaya komputasi yang bisa dihitung. Tanpa hukum ini, «tambah N saja» terdengar gratis — dan orang menambah N sampai komputernya menyerah, tanpa pernah bertanya apakah error yang tersisa masih penting.",
        "Baik atau buruk: SE bagus bila ditulis bersama n-nya — «SE = 0,000196 (N=10.000)» — dan buruk bila ditulis sebagai «±» tanpa penjelasan, karena «±» menyembunyikan apakah angka di sebelahnya adalah sd, SE, atau setengah lebar CI. Dan buruk bila realised error satu undian dipakai sebagai bukti N sudah cukup: satu undian yang beruntung bukan bukti.",
        "Mitigasi: sebelum menambah N, hitung dulu SE yang kamu punya dan SE yang kamu BUTUHKAN. Bila SE-mu sudah 0,0002 dan keputusanmu hanya berubah bila VaR bergerak 0,002, menambah N sepuluh kali lipat adalah pemborosan — uang komputasi yang dibayar untuk ketelitian yang tidak dipakai.",
      ],
      tasks: [],
      formula: String.raw`\mathrm{SE}(\bar{r}) = \frac{\sigma}{\sqrt{N}}, \qquad \sigma = 0{,}0196 \ \text{(simple daily, portofolio)}`,
      formulaNote: "SE mean return harian menyusut dengan 1/√N: N=100 → 0,001962; N=1.000 → 0,000620; N=10.000 → 0,000196; N=100.000 → 0,000062 [m9_canonical.json]. Melipatgandakan N 10× hanya membagi SE dengan √10 ≈ 3,16. SE VaR95 diukur empiris dari 20 batch independen (langkah ini, paragraf 3) — bukan dari rumus ini.",
    },
    {
      id: "jalan-10-hari",
      eyebrow: "Langkah 5 · Jalan 10 hari",
      title: "Jalan 10 hari: satu path GBM, dan mengapa √10 berbohong",
      prose: [
        "Satu hari sudah selesai — sekarang jalan 10 hari. Satu path GBM 10 hari adalah 10 undian log-return independen yang dijumlahkan (log-return 10-hari = jumlah 10 log-return harian), lalu dikonversi ke simple dengan expm1. Dengan N=100.000 path (seed 42), distribusi return terminal 10-hari: mean −0,0053 (sd 0,0619), median −0,0074, VaR95 10-hari (p5, sebagai kerugian) 0,1038, VaR99 10-hari (p1) 0,1408, P(rugi > 10%) 0,0572, dan P(rugi > 0,0903) 0,0795 [m9_canonical.json]. Pada portofolio Rp100.000.000: kerugian 10-hari melebihi Rp10.380.000 pada 5% jendela 10-hari, dan melebihi Rp10.000.000 pada 5,72% jendela.",
        "Periksa dulu konsistensinya dengan aritmetika 1-hari — karena simulasi yang tidak konsisten dengan inputnya adalah simulasi yang rusak. Mean terminal −0,0053 melawan 10 × μ_simple = 10 × (−0,000558) = −0,00558 [turunan] — cocok (selisih 0,0003 adalah MC error). Simpangan baku terminal 0,0619 melawan σ_simple × √10 = 0,0196 × 3,1623 = 0,0620 [turunan] — cocok. Median −0,0074 BERADA DI BAWAH mean −0,0053 — distribusi terminal miring ke KANAN (lognormal): sebagian besar path berakhir sedikit di bawah mean, sementara sebagian kecil path berakhir jauh di atas. Inilah bentuk yang tidak dimiliki distribusi normal — dan bentuk inilah yang membuat penskalaan sederhana gagal.",
        "Sekarang perbandingan yang menjadi inti lesson ini. Aturan praktis industri: VaR 10-hari ≈ VaR 1-hari × √10. Diterapkan pada VaR95 historis 1-hari 0,0286: 0,0286 × √10 ≈ 0,0903 [M4.2] — nilai kanonis dihitung dari kuantil historis yang belum dibulatkan, jadi 0,0286 × √10 = 0,0904 dari angka bulatnya. MC 10-hari berkata 0,1038 — LEBIH BESAR 0,0135. Bila kamu memakai 0,0903 sebagai VaR95 10-harimu, peluang kerugian aktual melampaui 0,0903 adalah 0,0795 — bukan 0,05: kamu mengira terlampaui 5% jendela, nyatanya 7,95% jendela. Aturan √10 meremehkan ekor 10-hari. Kenapa? Uraikan selisih 0,0135 itu. Bagian TERBESAR berasal dari titik awalnya: VaR historis 1-hari (0,0286) berada 0,0043 di bawah VaR parametrik/MC 1-hari (0,0328/0,0329), dan selisih itu ikut membesar √10 kali menjadi ≈ 0,0136 [turunan]. Di atas itu, √10 mengasumsikan DRIFT NOL — padahal drift log −0,000752/hari terakumulasi LINEAR selama 10 hari (mean terminal −0,0075 dalam log), bukan √10 — dan drift negatif itu menambah kerugian sekitar 0,0075 dalam log [turunan]. Sementara itu kemiringan lognormal bekerja ke arah SEBALIKNYA: distribusi terminal yang miring ke kanan menekan kuantil kerugian sedikit ke bawah dibanding normal (batas bawah kerugian −100%) — jadi MC melampaui √10-hist DESPITE kemiringan lognormal, bukan karena kemiringan itu. Dekomposisi lengkapnya: titik awal 0,0136 + drift +0,0075 − kemiringan lognormal ≈0,0076 ⇒ net ≈0,0135 [turunan]. Dan sebagai pembanding: √10 dari VaR parametrik 1-hari (0,0328 × √10 = 0,1037 [turunan]) dan √10 dari VaR MC 1-hari (0,0329 × √10 = 0,1040 [turunan]) keduanya hampir sama dengan MC 10-hari 0,1038 — bila titik awalnya sudah VaR yang konsisten dengan asumsi normal, √10 hampir tepat; yang membuat √10-hist meremehkan adalah titik awal historisnya yang lebih rendah.",
        "Kapan √10 BENAR? Bila tiga syarat terpenuhi: return tidak berkorelasi (level) antar hari, drift nol (atau bisa diabaikan terhadap σ√t), dan kuantil yang diskalakan memang berskala √t (benar untuk normal, salah untuk distribusi yang kuantilnya tidak linear dalam t). Di data ini syarat pertama HAMPIR terpenuhi — hanya untuk korelasi LEVEL: iid penuh TIDAK terpenuhi, karena squared return berkorelasi (autokorelasi lag-1 0,1043 [M4.3]) — syarat kedua dilanggar secara eksplisit (drift negatif −0,000752/hari), dan syarat ketiga dilanggar oleh titik awal historis. √10 bukan aturan yang «salah» — ia aturan yang ASUMSI-nya harus diperiksa, sama seperti GBM.",
        "Nilai: simulasi 10-hari bagus karena ia memberi DISTRIBUSI LENGKAP, bukan satu angka yang diskalakan: dari distribusi yang sama kamu membaca VaR95 (0,1038), VaR99 (0,1408), dan peluang kejadian apa pun — P(rugi > 10%) 0,0572 — tanpa rumus tambahan. √10 hanya memberi satu titik; MC memberi seluruh kurva.",
        "Baik atau buruk: jalan 10-hari bagus bila tiap path-nya independen dan horizon-nya eksplisit — «10 hari perdagangan, N=100.000 path». Buruk bila 10 hari dibaca sebagai «10 hari kalender» (bukan — ini 10 hari perdagangan), atau bila terminal distribution dibaca sebagai «ramalan 10 hari ke depan» (bukan — ini distribusi BERSYARAT pada asumsi GBM dan μ/σ dari 480 hari kemarin).",
        "Mitigasi: jangan pernah melaporkan VaR multi-hari hasil penskalaan √10 tanpa menulis asumsi penskalaannya — dan tanpa membandingkannya sekali saja dengan simulasi jalurnya. Bila keduanya berbeda lebih dari 0,01, laporkan hasil SIMULASI sebagai angka utama dan √10 sebagai pembanding — bukan sebaliknya.",
      ],
      tasks: [],
      formula: String.raw`R_{10} = \exp\!\left(\sum_{t=1}^{10} r_{\log,t}\right) - 1, \qquad r_{\log,t} \overset{iid}{\sim} \mathcal{N}(-0{,}000752,\ 0{,}0198^2)`,
      formulaNote: "Return 10-hari = expm1 dari jumlah 10 log-return harian independen. Terminal: mean −0,0053 (sd 0,0619), median −0,0074, p5 (VaR95 10-hari) 0,1038, p1 (VaR99 10-hari) 0,1408 [m9_canonical.json]. Bandingkan: √10 × VaR95 hist 1-hari ≈ 0,0903 [M4.2] — dari kuantil tak-bulat 0,028563 (dari 0,0286 yang ditampilkan, hasilnya 0,0904); √10 × VaR95 param 1-hari = 0,1037 [turunan].",
      note: {
        title: "Jebakan: √10 dipakai tanpa memeriksa asumsinya",
        type: "risk",
        body: "Yang benar: √10 mengasumsikan return iid, drift nol, dan kuantil yang berskala √t. Di data ini drift log −0,000752/hari terakumulasi linear (bukan √10), dan titik awal historis 0,0286 berada di bawah VaR parametrik/MC 0,0328/0,0329 — hasilnya MC 10-hari 0,1038 vs √10-hist 0,0903, dan peluang melampaui 0,0903 adalah 0,0795, bukan 0,05. Penskalaan tanpa simulasi pembanding adalah tebakan yang terlihat seperti rumus.",
      },
    },
    {
      id: "konvergensi",
      eyebrow: "Langkah 6 · Konvergensi",
      title: "Konvergensi: kapan berhenti menambah N",
      prose: [
        "Langkah 4 memberimu hukumnya (SE ~ 1/√N); langkah ini memberimu KEPUTUSANNYA: kapan berhenti. Kriteria berhenti menambah N [kebijakan lesson ini]: berhenti bila simpangan baku antar-batch VaR95 ≤ 0,0005 — yaitu kurang dari seperempat simpangan baku bootstrap VaR95 (0,0022; lihat bawah) — karena di bawah itu, menambah N hanya mengecilkan error yang sudah BUKAN sumber ketidakpastian terbesarmu. Terapkan: pada N=10.000, sd antar-batch VaR95 adalah 0,0004 [m9_canonical.json] — SUDAH di bawah 0,0005. Kriteria terpenuhi pada N=10.000. N=100.000 di lesson ini dipakai untuk angka laporan (VaR95 0,0329) — ia melewati titik berhenti, dan itu disengaja sebagai cadangan ketelitian, bukan karena keputusan memerlukannya.",
        "Kenapa seperempat? Karena sumber ketidakpastian yang LEBIH BESAR adalah datanya sendiri — 480 hari itu. Bootstrap VaR95 historis (M9.5, B=10.000, dirujuk — bukan dihitung ulang di sini): IID bootstrap memberi mean 0,0284 (sd 0,0022) dengan CI95 [0,0229; 0,0322]; moving-block bootstrap (blok 10, menjaga dependensi jangka pendek) memberi mean 0,0285 (sd 0,0029) dengan CI95 [0,0223; 0,0340] [m9_canonical.json]. Bandingkan: sd MC antar-batch 0,0004 melawan sd bootstrap 0,0022 (iid) — ketidakpastian SAMPLING DATA sekitar 5,5× ketidakpastian SIMULASI (0,0022/0,0004 = 5,5 [turunan]). Menambah N dari 10.000 ke 100.000 mengecilkan 0,0004 menjadi ≈ 0,00013 — sementara 0,0022 dari data tidak bergerak satu digit pun. Itulah arti «konvergen» di lesson ini: bukan error nol, melainkan error simulasi yang sudah jauh lebih kecil dari error data.",
        "Satu pemeriksaan konsistensi terakhir: VaR95 MC 0,0329 berada DI DALAM CI95 block-bootstrap [0,0223; 0,0340] — konsisten dengan ketidakpastian sampling data. Ia berada sedikit DI ATAS batas atas CI95 iid [0,0229; 0,0322] — dan itu WAJAR, bukan alarm: bootstrap iid mengacak hari satu per satu dan memutus dependensi jangka pendek, sehingga CI-nya terlalu sempit; block bootstrap (blok 10) yang menghormati autokorelasi squared return 0,1043 [M4.3] memberi CI yang lebih lebar — dan lebih jujur. Pelajaran M9.5 yang sama, dibaca dari sisi MC: bila estimasimu jatuh di luar CI iid tapi di dalam CI block, jangan panik — periksa dulu CI mana yang menghormati struktur datamu.",
        "Nilai: kriteria berhenti bagus karena ia mengubah «tambah N sampai bosan» menjadi keputusan yang bisa diaudit: ambang 0,0005 ditulis dulu, sd antar-batch diukur, dan keputusannya mengikuti. Siapa pun bisa memeriksa apakah N=10.000 memang cukup — tanpa harus percaya pada perasaanmu.",
        "Baik atau buruk: kriteria ini bagus bila ambangnya DITURUNKAN dari ketidakpastian data (seperempat dari 0,0022) — dan buruk bila ambangnya ditebak («0,0005 terasa cukup kecil») tanpa pembanding. Buruk juga bila kriteria berhenti dibaca sebagai «N=10.000 selalu cukup»: ambang ini benar untuk VaR95 portofolio ini; untuk VaR99 atau ES99, ekornya lebih tipis dan N yang dibutuhkan lebih besar.",
        "Mitigasi: di setiap laporan MC, tulis satu baris konvergensi: «sd antar-batch VaR95 0,0004 (N=10.000, 20 batch) ≤ ambang 0,0005 [kebijakan lesson ini]; ketidakpastian sampling data (bootstrap sd 0,0022) ≈ 5,5× lebih besar». Bila baris itu tidak ada, pembaca tidak tahu apakah N-mu cukup — atau apakah kamu hanya berhenti karena lelah.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: «konvergen» berarti VaR berhenti berubah",
        type: "pitfall",
        body: "Yang benar: VaR MC TIDAK PERNAH berhenti berubah — tiap batch baru memberi angka baru (range antar-batch [0,0319; 0,0333] pada N=10.000). Konvergen berarti AYUNAN antar-batch sudah jauh lebih kecil dari ketidakpastian data (sd 0,0004 vs bootstrap sd 0,0022) — bukan berarti ayunannya nol. Yang berhenti adalah KEBUTUHAN menambah N, bukan perubahannya.",
      },
    },
    {
      id: "jebakan",
      eyebrow: "Langkah 7 · Jebakan",
      title: "Jebakan: MC yang «terlalu bagus» — input salah, output salah, presisi palsu",
      prose: [
        "Jebakan paling berbahaya di lesson ini bukan MC yang error-nya besar — itu terlihat. Yang berbahaya adalah MC yang error-nya KECIL dan input-nya SALAH: VaR95 0,0329 dengan empat desimal yang rapi, sd antar-batch 0,0004 yang meyakinkan — semuanya dihitung dengan benar dari σ_log yang salah. Contohnya: σ diestimasi dari PERIODE TENANG saja (mis. 120 hari terakhir yang kebetulan sepi), lalu dipakai untuk mensimulasikan «risiko» — VaR yang keluar terlalu kecil, dengan presisi yang membuat siapa pun percaya. MC tidak tahu σ-mu salah; ia hanya tahu cara mengundi dari distribusi yang kamu beri. Input salah → output salah — dan N yang besar hanya membuat output yang salah itu semakin PRESISI.",
        "Inilah bedanya MC error dengan MODEL error — dan kenapa keduanya harus ditulis terpisah. MC error (langkah 4–6) adalah error UNDIAN: ia menyusut dengan 1/√N dan bisa diukur dengan batch. Model error adalah error ASUMSI: normalitas yang gagal (skew −0,5091, excess kurtosis 6,0216), iid dan volatilitas konstan yang gagal (autokorelasi squared return 0,1043 [M4.3] menyangkal keduanya), σ yang diestimasi dari periode yang tidak mewakili. Model error TIDAK menyusut dengan N — N=100.000.000 dengan σ yang salah tetap memberi VaR yang salah, hanya dengan desimal yang lebih meyakinkan. Satu-satunya yang menangkap model error adalah VALIDASI — dan validasi MC adalah conceptual soundness [M8.1]: periksa inputnya (dari mana μ/σ berasal? periode apa? apakah mewakili?), periksa asumsinya (normal? iid? vol konstan?), dan BANDINGKAN dengan estimator yang asumsinya berbeda (historis 0,0286 vs param 0,0328 vs MC 0,0329 — bila ketiganya berjauhan, satu dari asumsi itu pasti bermasalah).",
        "Seberapa sensitif VaR terhadap σ yang salah? Dari rumus parametrik, VaR95 ≈ −μ_simple + 1,645 × σ_simple — hampir LINEAR dalam σ: bila σ yang dipakai 10% terlalu kecil, VaR95 ikut ≈ 10% terlalu kecil [ilustrasi]. Pada VaR95 0,0329, itu berarti 0,0033 terlalu rendah — LEBIH BESAR dari seluruh MC error antar-batch (range 0,0014) dan dari selisih MC vs param (0,0001). Dengan kata lain: satu kesalahan input 10% menenggelamkan seluruh ketelitian simulasi. Itulah kenapa validator [M8.1] memeriksa INPUT sebelum memeriksa OUTPUT — dan kenapa lesson ini menaruh langkah ini SETELAH konvergensi: ketelitian tanpa validasi input adalah presisi palsu.",
        "Nilai: jebakan ini bagus untuk diajarkan karena ia membalik intuisi «lebih banyak simulasi = lebih benar»: lebih banyak simulasi = lebih PRESISI, dan presisi atas input yang salah adalah cara tercepat untuk meyakinkan komite tentang angka yang salah. Satu-satunya penawarnya adalah membandingkan — tiga estimator, dua periode estimasi σ, satu uji sensitivitas.",
        "Baik atau buruk: MC bagus bila laporanmu menulis DARI MANA μ/σ berasal (480 hari, 2024-11-04→2026-11-11) dan APA YANG TERJADI bila σ salah 10%. Buruk bila laporanmu hanya menulis «VaR95 MC 0,0329 (N=100.000)» — N besar tanpa sumber input adalah angka yang tidak bisa diperiksa.",
        "Mitigasi: tiga baris wajib di setiap laporan MC — (1) sumber input: seri apa, periode apa, n berapa; (2) perbandingan tiga estimator (hist/param/MC); (3) satu uji sensitivitas: «bila σ 10% lebih besar, VaR menjadi …». Bila satu baris tidak bisa ditulis, simulasi belum siap dilaporkan.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: N besar memperbaiki model yang salah",
        type: "risk",
        body: "Yang benar: N besar hanya mengecilkan MC ERROR (error undian, ~1/√N). MODEL ERROR — σ dari periode tenang, asumsi normal yang gagal, iid dan volatilitas konstan yang gagal — tidak menyusut dengan N sama sekali. VaR95 0,0329 dari σ yang 10% terlalu kecil adalah ≈ 0,0033 terlalu rendah [ilustrasi] pada N berapa pun. Yang memperbaiki model error adalah validasi input dan perbandingan antar-estimator, bukan N.",
      },
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Mini-case: putuskan — VaR MC, historis, atau parametrik yang dilaporkan ke komite?",
      prose: [
        "Sekarang giliranmu menjadi analis risiko. Fakta di mejamu — semuanya dari angka kanonis yang sudah kamu lihat: portofolio equal-weight BBCA/KLBF/UNVR, Rp100.000.000, n=480 hari (2024-11-04→2026-11-11); VaR95 1-hari: historis 0,0286 (Rp2.856.323), parametrik 0,0328 (Rp3.280.000), MC univariat N=100.000 0,0329 (Rp3.290.000); ES95: historis 0,0445 (Rp4.451.285), parametrik 0,0410 (Rp4.100.000), MC 0,0407 (Rp4.070.000); MC joint-normal M4 0,0336/0,0424 [M4.2]; MC error antar-batch (20 batch, N=10.000): mean 0,0326 (sd 0,0004; SE 0,00009), range [0,0319; 0,0333]; bootstrap VaR95 (M9.5): CI95 iid [0,0229; 0,0322], block-10 [0,0223; 0,0340]; VaR95 10-hari MC 0,1038 (Rp10.380.000) vs √10-hist 0,0903 (Rp9.030.000). Komite bertanya satu hal: «jadi VaR kita berapa?»",
        "Putuskan — dan tulis jawabanmu sebelum membaca paragraf berikutnya. Jawaban yang SALAH ada tiga. Pertama: «MC 0,0329, karena N=100.000 paling besar» — salah: N besar mengecilkan MC error, bukan model error; MC memakai asumsi normal yang sudah terbukti gagal secara deskriptif (skew −0,5091, excess kurtosis 6,0216). Kedua: «historis 0,0286, karena tanpa asumsi» — salah: tanpa asumsi bukan tanpa kelemahan; kuantil 5%-nya hanya bersandar pada 24 hari, dan CI95 bootstrap-nya selebar [0,0223; 0,0340] (block-10) — 0,0286 adalah titik di tengah pita yang lebar. Ketiga: «parametrik 0,0328, karena ada rumusnya» — salah: rumus itu menyembunyikan asumsi normal di balik keanggunannya; ia bukan «yang benar», ia «yang paling ringkas».",
        "Jawaban yang BENAR: laporkan KETIGANYA — beserta ES, beserta alasan tiap angka berbeda. Baris laporanmu: «VaR95 1-hari: historis 0,0286 (tanpa asumsi distribusi; n=480, 24 hari terburuk), parametrik 0,0328 (normal; μ_simple −0,000558, σ_simple 0,0196), MC 0,0329 (normal pada log-return; N=100.000, seed 42). Ketiganya mengestimasi besaran yang sama; rentang tiga estimator utama [0,0286; 0,0329] adalah ukuran ketidaksepakatan antar-asumsi (bila MC joint M4 ikut, rentangnya [0,0286; 0,0336]), dan bootstrap CI95 block-10 [0,0223; 0,0340] adalah ukuran ketidakpastian sampling datanya. MC error antar-batch pada N=10.000: mean 0,0326 (sd 0,0004; SE 0,00009). ES95: historis 0,0445 — LEBIH BESAR dari parametrik/MC (0,0410/0,0407) — ekor ekstrem historis lebih tebal dari normal, jadi untuk batas kerugian ekstrem, angka historis-lah yang lebih waspada.» Dan untuk horizon 10 hari: laporkan MC 0,1038 sebagai angka utama, dengan √10-hist 0,0903 sebagai pembanding yang SUDAH TERBUKTI meremehkan (P(melampaui 0,0903) = 0,0795, bukan 0,05).",
        "Kenapa MC disebut «yang asumsi-nya paling transparan» — dan kenapa itu BUKAN berarti «yang benar»? Karena asumsi MC ditulis di depan (normal pada log-return, μ_log/σ_log dari data, seed 42) dan bisa DIGANTI satu per satu untuk melihat perubahan hasilnya — ganti distribusi log-return dengan distribusi empiris (bootstrap) dan lihat VaR bergerak ke arah historis; ganti σ konstan dengan GARCH [M4.3] dan lihat VaR bergerak. Transparansi berarti KESALAHANNYA BISA DILACAK — bukan berarti kesalahannya tidak ada. Model yang asumsinya transparan adalah model yang bisa diperbaiki; model yang asumsinya tersembunyi (parametrik yang «hanya rumus») adalah model yang kesalahannya tidak bisa ditemukan.",
        "Nilai: mini-case ini bagus karena jawabannya TIDAK ADA di angka mana pun secara sendirian — ia ada di PERBANDINGAN tiga angka dengan asumsinya. Itulah pekerjaan analis risiko: bukan memilih angka yang paling meyakinkan, melainkan melaporkan ketidaksepakatan antar-asumsi dengan jujur.",
        "Baik atau buruk: keputusan «laporkan ketiganya» bagus bila tiap angka datang dengan asumsi, N, dan ES-nya — dan buruk bila «ketiganya» hanya berarti tiga angka tanpa penjelasan, karena komite akan memilih yang terkecil (0,0286) dan pulang dengan rasa aman yang salah. Tulis juga SATU KALIMAT rekomendasi: «untuk batas 1-hari, pakai 0,0329 (MC) sebagai angka kerja — ia di tengah rentang atas dan asumsi-nya paling mudah diuji — dengan catatan ES historis 0,0445 untuk skenario ekstrem.»",
        "Mitigasi: setiap kali komite bertanya «VaR kita berapa?», jawab dengan TABEL tiga baris (estimator, asumsi, VaR, ES) plus satu baris ketidakpastian (bootstrap CI). Bila tabelmu hanya punya satu baris, laporanmu belum siap.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: MC adalah «yang benar» karena paling canggih",
        type: "pitfall",
        body: "Yang benar: MC bukan «yang benar» — ia «yang asumsi-nya paling transparan». MC 0,0329 dan parametrik 0,0328 memakai asumsi normal yang sama; historis 0,0286 memakai asumsi yang berbeda (tidak ada). Yang dilaporkan ke komite adalah KETIGANYA beserta asumsinya — dan rentang tiga estimator utama [0,0286; 0,0329] (bila M4 ikut, [0,0286; 0,0336]) adalah informasi, bukan masalah.",
      },
    },
    {
      id: "lab1",
      eyebrow: "Langkah 9 · Lab 1",
      title: "Lab: sweep N — VaR95 + SE, dari 1.000 sampai 100.000",
      prose: [
        "Sekarang jalankan sendiri sweep N yang menjadi tulang punggung lesson ini. Simulasi 1-hari: log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), konversi ke simple dengan expm1, seed 42 (generator baru per N agar hasilnya deterministik). Untuk tiap N ∈ {1.000, 10.000, 100.000}, hitung VaR95, ES95, dan SE mean (σ_simple/√N, σ_simple 0,0196). Semua angka memakai portofolio equal-weight BBCA/KLBF/UNVR yang sama dengan lesson.",
        "Hasil yang diharapkan [lab]: var95_N1000=0.0335; var95_N10000=0.0332; var95_N100000=0.0329; es95_N100000=0.0407; se_mean_N10000=0.000196; se_menyusut=True. Perhatikan baris terakhir: SE mean pada N=100.000 (0,000062) adalah sepersepuluh SE pada N=1.000 (0,000620) — karena N naik 100×, SE turun √100 = 10×. Dan perhatikan VaR95-nya: 0,0335 → 0,0332 → 0,0329 — bergerak 0,0006 dari ujung ke ujung, di dalam ayunan antar-batch (range [0,0319; 0,0333] pada N=10.000). Catatan: keluaran di mesinmu bisa berbeda ≈0,0001 dari angka kanonis (mis. 0,0336 vs 0,0335) karena urutan pemakaian stream RNG — itu MC error antar-stream, dan checks memakai tol 0,002 untuk itu. Sweep ini membuktikan langkah 4 dengan tanganmu sendiri: N besar mengecilkan error, tetapi pergerakannya kecil — dan keputusan tidak berubah.",
        "Setelah lab jalan, bandingkan dengan langkah 3: VaR95 MC N=100.000 (0,0329) melawan historis (0,0286) dan parametrik (0,0328) — dan tanyakan: bila lab ini memakai seed yang berbeda, berapa VaR95 N=100.000 yang kamu dapat? Jawabannya ada di langkah 4: ayunan antar-batch pada N=10.000 saja sudah 0,0014 — seed yang berbeda memberi angka yang berbeda, dan perbedaan itu ADALAH MC error, bukan kesalahanmu.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi var95_N1000, var95_N10000, var95_N100000 dari mc_1day" },
        { id: "t2", text: "Lengkapi es95_N100000 dan se_mean_N1000, se_mean_N10000, se_mean_N100000 (SD_SIMPLE / √N)" },
        { id: "t3", text: "Lengkapi se_menyusut: True bila SE mean N=100.000 < SE mean N=1.000" },
      ],
      expected: "var95_N1000=0.0335\nvar95_N10000=0.0332\nvar95_N100000=0.0329\nes95_N100000=0.0407\nse_mean_N10000=0.000196\nse_menyusut=True",
      hints: [
        "mc_1day(n) mengembalikan (var95, es95, mean): var95_N1000 = mc_1day(1000)[0], dan seterusnya — generator baru (seed 42) di tiap panggilan agar deterministik.",
        "SE mean = SD_SIMPLE / √N: N=1.000 → 0,0196/31,62 = 0,000620; N=10.000 → 0,000196; N=100.000 → 0,000062. ES95 = rata-rata kerugian BEYOND VaR — lihat definisi di mc_1day.",
        "se_menyusut = se_mean_N100000 < se_mean_N1000 → 0,000062 < 0,000620 → True. N naik 100×, SE turun 10× (√100).",
      ],
      code: {
        starter: `# Lab 1 — sweep N: VaR95 + ES95 + SE mean (MC 1 hari)
# Log-return ~ Normal(MU_LOG, SD_LOG^2), seed 42; konversi log -> simple: expm1.
# VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR.
import numpy as np

MU_LOG = -0.000752
SD_LOG = 0.0198
SD_SIMPLE = 0.0196
SEED = 42


def mc_1day(n, seed=SEED):
    rng = np.random.default_rng(seed)
    r = np.expm1(rng.normal(MU_LOG, SD_LOG, n))  # simple returns
    var95 = -np.quantile(r, 0.05)
    es95 = -r[r <= np.quantile(r, 0.05)].mean()
    return var95, es95, r.mean()


var95_N1000 = 0.0  # TODO: mc_1day(1000)[0]
var95_N10000 = 0.0  # TODO: mc_1day(10000)[0]
var95_N100000 = 0.0  # TODO: mc_1day(100000)[0]
es95_N100000 = 0.0  # TODO: mc_1day(100000)[1]
se_mean_N1000 = 0.0  # TODO: SD_SIMPLE / sqrt(1000)
se_mean_N10000 = 0.0  # TODO: SD_SIMPLE / sqrt(10000)
se_mean_N100000 = 0.0  # TODO: SD_SIMPLE / sqrt(100000)
se_menyusut = None  # TODO: True bila se_mean_N100000 < se_mean_N1000
print(f"var95_N1000={var95_N1000:.4f}")
print(f"var95_N10000={var95_N10000:.4f}")
print(f"var95_N100000={var95_N100000:.4f}")
print(f"es95_N100000={es95_N100000:.4f}")
print(f"se_mean_N1000={se_mean_N1000:.6f}")
print(f"se_mean_N10000={se_mean_N10000:.6f}")
print(f"se_mean_N100000={se_mean_N100000:.6f}")
print(f"se_menyusut={se_menyusut}")`,
        lockLines: 17,
        solution: `# Lab 1 — sweep N: VaR95 + ES95 + SE mean (MC 1 hari)
# Log-return ~ Normal(MU_LOG, SD_LOG^2), seed 42; konversi log -> simple: expm1.
# VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR.
import numpy as np

MU_LOG = -0.000752
SD_LOG = 0.0198
SD_SIMPLE = 0.0196
SEED = 42


def mc_1day(n, seed=SEED):
    rng = np.random.default_rng(seed)
    r = np.expm1(rng.normal(MU_LOG, SD_LOG, n))  # simple returns
    var95 = -np.quantile(r, 0.05)
    es95 = -r[r <= np.quantile(r, 0.05)].mean()
    return var95, es95, r.mean()


var95_N1000 = mc_1day(1000)[0]
var95_N10000 = mc_1day(10000)[0]
var95_N100000 = mc_1day(100000)[0]
es95_N100000 = mc_1day(100000)[1]
se_mean_N1000 = SD_SIMPLE / np.sqrt(1000)
se_mean_N10000 = SD_SIMPLE / np.sqrt(10000)
se_mean_N100000 = SD_SIMPLE / np.sqrt(100000)
se_menyusut = se_mean_N100000 < se_mean_N1000
print(f"var95_N1000={var95_N1000:.4f}")
print(f"var95_N10000={var95_N10000:.4f}")
print(f"var95_N100000={var95_N100000:.4f}")
print(f"es95_N100000={es95_N100000:.4f}")
print(f"se_mean_N1000={se_mean_N1000:.6f}")
print(f"se_mean_N10000={se_mean_N10000:.6f}")
print(f"se_mean_N100000={se_mean_N100000:.6f}")
print(f"se_menyusut={se_menyusut}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_N1000", value: 0.0335, tol: 0.002, label: "`var95_N1000` seharusnya 0.0335", msg: "VaR95 MC N=1.000 ≈ 0,0335 (tol 0,002 — MC error pada N kecil memang sebesar ini)." },
          { kind: "equal", task: "t1", name: "var95_N10000", value: 0.0332, tol: 0.002, label: "`var95_N10000` seharusnya 0.0332", msg: "VaR95 MC N=10.000 ≈ 0,0332 — sudah di dalam ayunan antar-batch [0,0319; 0,0333]." },
          { kind: "equal", task: "t1", name: "var95_N100000", value: 0.0329, tol: 0.002, label: "`var95_N100000` seharusnya 0.0329", msg: "VaR95 MC N=100.000 ≈ 0,0329 — angka laporan lesson ini; hampir sama dengan parametrik 0,0328." },
          { kind: "equal", task: "t2", name: "es95_N100000", value: 0.0407, tol: 0.002, label: "`es95_N100000` seharusnya 0.0407", msg: "ES95 MC N=100.000 ≈ 0,0407 — rata-rata kerugian pada 5% hari terburuk simulasi." },
          { kind: "equal", task: "t2", name: "se_mean_N10000", value: 0.000196, tol: 0.00002, label: "`se_mean_N10000` seharusnya 0.000196", msg: "SE mean = 0,0196/√10.000 = 0,000196 — hukum 1/√N, bukan tebakan." },
          { kind: "stdout_matches", task: "t3", pattern: "se_menyusut=True", label: "Output menampilkan se_menyusut=True", msg: "SE mean N=100.000 (0,000062) < SE mean N=1.000 (0,000620) — N naik 100×, SE turun 10×." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 10 · Lab 2",
      title: "Lab: GBM 10 hari — path, VaR95 10-hari, dan peluang rugi > 10%",
      prose: [
        "Lab kedua menjalankan jalan 10 hari dari langkah 5 — dengan satu perbedaan yang disengaja: lab memakai N=10.000 path (bukan 100.000) agar ringan di browser. Karena itu checks lab ini memakai toleransi LONGGAR (0,01) terhadap angka kanonis N=100.000: VaR95 10-hari kanonis 0,1038, P(rugi > 10%) 0,0572, P(rugi > 0,0903) 0,0795 [m9_canonical.json]. Bila hasil lab-mu berbeda 0,002–0,005 dari kanonis, itu BUKAN kesalahanmu — itu MC error pada N=10.000 path, pelajaran yang sama dengan langkah 4. Satu path = jumlah 10 log-return harian independen, lalu expm1.",
        "Hasil yang diharapkan [lab]: p5_10d=0.1038; p1_10d=0.1408; p_loss_gt_10=0.0572; p_loss_gt_0903=0.0795; p5_lebih_besar_dari_sqrt10=True. Bacalah baris terakhir dengan saksama: p5_10d (0,1038) LEBIH BESAR dari skala √10-hist (0,0903) — dan p_loss_gt_0903 (0,0795) membuktikannya dari sisi peluang: bila kamu memakai 0,0903 sebagai VaR95 10-harimu, kerugian melampauinya 7,95% jendela, bukan 5%. Lab ini juga hanya menghitung terminal distribution — ia tidak menguji konvergensi (langkah 6) dan tidak memvalidasi input (langkah 7); keduanya tetap tugasmu di laporan.",
        "Setelah lab jalan, tanyakan pada dirimu: bila lab ini dijalankan dengan N=100.000 path (seperti kanonis), seberapa dekat p5_10d ke 0,1038? Jawabannya ada di notebook (langkah 13 di Colab): N=100.000 memberi p5 ≈ 0,1042 pada stream seed 42 — selisih 0,0004 dari kanonis, yaitu MC error antar-stream. Stream yang berbeda memberi angka yang sedikit berbeda — dan toleransi 0,002 di notebook memang ditulis untuk itu. Bedakan keduanya: checks lab memakai tol 0,01 karena N=10.000 path, sementara notebook memakai tol 0,002 karena N=100.000 path — toleransi yang berbeda untuk N yang berbeda, bukan dua standar yang bertentangan.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi p5_10d dan p1_10d: kuantil 5% dan 1% distribusi terminal (sebagai kerugian)" },
        { id: "t2", text: "Lengkapi p_loss_gt_10 dan p_loss_gt_0903: peluang kerugian terminal melampaui 0,10 dan 0,0903" },
        { id: "t3", text: "Lengkapi p5_lebih_besar_dari_sqrt10: True bila p5_10d > SQRT10_HIST_VAR95" },
      ],
      expected: "p5_10d=0.1038\np1_10d=0.1408\np_loss_gt_10=0.0572\np_loss_gt_0903=0.0795\np5_lebih_besar_dari_sqrt10=True",
      hints: [
        "p5_10d = -np.quantile(terminal, 0.05); p1_10d = -np.quantile(terminal, 0.01) — tanda minus karena VaR dilaporkan sebagai KERUGIAN positif.",
        "Peluang = rata-rata indikator: p_loss_gt_10 = (terminal < -0.10).mean(); p_loss_gt_0903 = (terminal < -SQRT10_HIST_VAR95).mean().",
        "p5_lebih_besar_dari_sqrt10 = p5_10d > 0,0903 → True — MC 10-hari melampaui skala √10-hist; peluang melampaui 0,0903 adalah 0,0795, bukan 0,05.",
      ],
      code: {
        starter: `# Lab 2 — GBM 10 hari: N=10.000 path (browser) vs kanonik N=100.000
# Satu path = jumlah 10 log-return harian independen, lalu expm1.
# Toleransi checks LONGGAR (0,01): lab memakai N lebih kecil dari kanonis.
import numpy as np

MU_LOG = -0.000752
SD_LOG = 0.0198
SQRT10_HIST_VAR95 = 0.0903  # skala akar-10 VaR95 historis 1-hari [M4.2]
N_PATHS = 10000  # lab: 10.000 path (browser); kanonik: 100.000 path

rng = np.random.default_rng(42)
steps = rng.normal(MU_LOG, SD_LOG, (N_PATHS, 10))
terminal = np.expm1(steps.sum(axis=1))  # simple return 10-hari

p5_10d = 0.0  # TODO: -np.quantile(terminal, 0.05)
p1_10d = 0.0  # TODO: -np.quantile(terminal, 0.01)
p_loss_gt_10 = 0.0  # TODO: (terminal < -0.10).mean()
p_loss_gt_0903 = 0.0  # TODO: (terminal < -SQRT10_HIST_VAR95).mean()
p5_lebih_besar_dari_sqrt10 = None  # TODO: p5_10d > SQRT10_HIST_VAR95
print(f"p5_10d={p5_10d:.4f}")
print(f"p1_10d={p1_10d:.4f}")
print(f"p_loss_gt_10={p_loss_gt_10:.4f}")
print(f"p_loss_gt_0903={p_loss_gt_0903:.4f}")
print(f"p5_lebih_besar_dari_sqrt10={p5_lebih_besar_dari_sqrt10}")`,
        lockLines: 12,
        solution: `# Lab 2 — GBM 10 hari: N=10.000 path (browser) vs kanonik N=100.000
# Satu path = jumlah 10 log-return harian independen, lalu expm1.
# Toleransi checks LONGGAR (0,01): lab memakai N lebih kecil dari kanonis.
import numpy as np

MU_LOG = -0.000752
SD_LOG = 0.0198
SQRT10_HIST_VAR95 = 0.0903  # skala akar-10 VaR95 historis 1-hari [M4.2]
N_PATHS = 10000  # lab: 10.000 path (browser); kanonik: 100.000 path

rng = np.random.default_rng(42)
steps = rng.normal(MU_LOG, SD_LOG, (N_PATHS, 10))
terminal = np.expm1(steps.sum(axis=1))  # simple return 10-hari

p5_10d = -np.quantile(terminal, 0.05)
p1_10d = -np.quantile(terminal, 0.01)
p_loss_gt_10 = (terminal < -0.10).mean()
p_loss_gt_0903 = (terminal < -SQRT10_HIST_VAR95).mean()
p5_lebih_besar_dari_sqrt10 = p5_10d > SQRT10_HIST_VAR95
print(f"p5_10d={p5_10d:.4f}")
print(f"p1_10d={p1_10d:.4f}")
print(f"p_loss_gt_10={p_loss_gt_10:.4f}")
print(f"p_loss_gt_0903={p_loss_gt_0903:.4f}")
print(f"p5_lebih_besar_dari_sqrt10={p5_lebih_besar_dari_sqrt10}")`,
        checks: [
          { kind: "equal", task: "t1", name: "p5_10d", value: 0.1038, tol: 0.01, label: "`p5_10d` seharusnya 0.1038", msg: "VaR95 10-hari ≈ 0,1038 (tol 0,01 — lab memakai N=10.000 path, kanonis N=100.000; selisihnya adalah MC error)." },
          { kind: "equal", task: "t1", name: "p1_10d", value: 0.1408, tol: 0.01, label: "`p1_10d` seharusnya 0.1408", msg: "VaR99 10-hari ≈ 0,1408 (tol 0,01) — ekor 1% jendela 10-hari." },
          { kind: "equal", task: "t2", name: "p_loss_gt_10", value: 0.0572, tol: 0.01, label: "`p_loss_gt_10` seharusnya 0.0572", msg: "P(rugi 10-hari > 10%) ≈ 0,0572 (tol 0,01) — 5,72% jendela 10-hari kehilangan lebih dari Rp10.000.000." },
          { kind: "equal", task: "t2", name: "p_loss_gt_0903", value: 0.0795, tol: 0.01, label: "`p_loss_gt_0903` seharusnya 0.0795", msg: "P(rugi 10-hari > 0,0903) ≈ 0,0795 (tol 0,01) — bukan 0,05: skala √10-hist meremehkan ekor 10-hari." },
          { kind: "stdout_matches", task: "t3", pattern: "p5_lebih_besar_dari_sqrt10=True", label: "Output menampilkan p5_lebih_besar_dari_sqrt10=True", msg: "VaR95 10-hari MC (0,1038) > skala √10-hist (0,0903) — √10 meremehkan ekor 10-hari." },
        ],
      },
    },
    {
      id: "figure1",
      eyebrow: "Langkah 11 · Figure 1",
      title: "Figure 1: distribusi MC 1-hari — dan di mana ketiga VaR berdiri",
      prose: [
        "Figure ini menggambar distribusi return SIMPLE 1-hari hasil simulasi MC (N=100.000, log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), seed 42) sebagai kurva densitas — beserta tiga garis vertikal: VaR95 historis 0,0286 [M4.2] dan VaR95 parametrik 0,0328 / MC 0,0329 yang hampir berhimpit. Daerah yang diarsir di kiri garis MC adalah 5% hari terburuk — wilayah yang rata-ratanya adalah ES95 MC 0,0407. Sumbu-x adalah return harian (negatif = rugi, ke kiri); sumbu-y adalah densitas.",
        "Bacalah jarak antar-garis itu: garis historis (0,0286) berdiri 0,0043 di SEBELAH KANAN garis parametrik/MC (0,0328/0,0329) — kuantil empiris 5% lebih dekat ke nol daripada kuantil normal. Itulah selisih yang sama dengan langkah 3, digambar: «bahu» 5% distribusi empiris lebih tipis dari normal. Sebaliknya, ekor di kiri garis historis — 24 hari terburuk yang sesungguhnya — rata-ratanya 0,0445 (ES95 historis), LEBIH BESAR dari ES95 MC 0,0407: ekor ekstrem empiris lebih tebal. Satu gambar, dua arah perbedaan yang sama — dan keduanya hilang bila kamu hanya membaca satu angka VaR.",
        "Nilai: figure ini bagus karena ia membuat ABSTRAK menjadi SPASIAL: «VaR» bukan lagi angka di tabel, melainkan GARIS di atas kurva — dan «ES» bukan lagi rumus, melainkan RATA-RATA daerah yang diarsir. Siapa pun yang melihatnya langsung paham kenapa VaR tanpa ES menyesatkan: VaR adalah garis, ES adalah isi daerah di kiri garis itu.",
        "Baik atau buruk: figure bagus bila angkanya SAMA dengan prose — garis historis di 0,0286, garis param/MC di 0,0328/0,0329, daerah arsir 5% dengan ES 0,0407. Buruk bila kurvanya digambar dari «kira-kira normal» tanpa μ/σ yang sama dengan lesson: figure yang angkanya tidak sama dengan prose adalah figure yang berbohong dengan gambar.",
        "Mitigasi: setiap kali kamu menggambar distribusi, tulis μ/σ dan N di caption — dan periksa satu angka dengan mata: apakah garis VaR-mu berdiri di tempat yang prose-mu katakan? Bila tidak, yang salah adalah figure-nya atau prose-nya — dan salah satu harus diperbaiki sebelum lesson ini dibaca orang lain.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Distribusi MC 1-hari N sama dengan 100.000: garis VaR95 historis 0,0286, garis VaR95 parametrik 0,0328 dan MC 0,0329 yang hampir berhimpit, daerah 5 persen terburuk diarsir dengan ES95 MC 0,0407">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Distribusi MC 1-hari (N=100.000) — tiga VaR, satu kurva</text>
<line x1="40" y1="190" x2="460" y2="190" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="40" y1="30" x2="40" y2="190" stroke="var(--chart-text)" stroke-width="1"/>
<text x="40" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,09</text>
<text x="110" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,06</text>
<text x="180" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">−0,03</text>
<text x="250" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="320" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+0,03</text>
<text x="390" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+0,06</text>
<text x="460" y="206" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">+0,09</text>
<text x="250" y="222" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">return harian (simple) — negatif = rugi, ke kiri</text>
<polygon points="40,190 51.7,190 63.3,190 75,189.9 86.7,189.7 98.3,189.3 110,188.5 121.7,186.8 133.3,183.8 145,178.5 156.7,170.2 168.3,158 173.2,151.1 173.2,190" fill="var(--c2)" opacity="0.35"/>
<polyline points="40,190 51.7,190 63.3,190 75,189.9 86.7,189.7 98.3,189.3 110,188.5 121.7,186.8 133.3,183.8 145,178.5 156.7,170.2 168.3,158 180,141.5 191.7,121.1 203.3,98.3 215,75.7 226.7,56.4 238.3,43.8 250,40.1 261.7,45.9 273.3,60.3 285,80.5 296.7,103.5 308.3,125.9 320,145.5 331.7,161.1 343.3,172.4 355,179.9 366.7,184.6 378.3,187.3 390,188.7 401.7,189.4 413.3,189.8 425,189.9 436.7,190 448.3,190 460,190" fill="none" stroke="var(--c1)" stroke-width="2"/>
<line x1="183.3" y1="30" x2="183.3" y2="190" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="183.3" y="26" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">hist 0,0286</text>
<line x1="173.4" y1="30" x2="173.4" y2="190" stroke="var(--c2)" stroke-width="2"/>
<text x="173.4" y="26" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">param 0,0328 ≈ MC 0,0329</text>
<text x="100" y="120" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">5% terburuk</text>
<text x="155" y="134" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">ES95 MC 0,0407</text>
<text x="248.6" y="60" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">mean −0,0006 (sd 0,0196)</text>
</svg>`,
        alt: "Distribusi MC 1-hari N=100.000: garis VaR95 historis 0,0286, garis VaR95 parametrik 0,0328 dan MC 0,0329 yang hampir berhimpit, daerah 5 persen terburuk diarsir dengan ES95 MC 0,0407.",
        caption: "Cara membaca: kurva = densitas return simple 1-hari MC (N=100.000, log-return ~ Normal(μ_log −0,000752, σ_log 0,0198), seed 42). Garis putus-putus = VaR95 historis 0,0286 [M4.2]; garis tebal = VaR95 parametrik 0,0328 (x=173,4) — MC 0,0329 BUKAN garis tebal itu, melainkan batas kanan daerah arsir (x=173,2); keduanya hampir berhimpit karena memakai asumsi normal yang sama, tapi bukan garis yang sama. Daerah arsir = 5% hari terburuk; rata-rata kerugian di sana adalah ES95 MC 0,0407. Angka figure sama dengan prose langkah 3.",
      },
      tasks: [],
    },
    {
      id: "figure2",
      eyebrow: "Langkah 12 · Figure 2",
      title: "Figure 2: konvergensi VaR95 vs N — pita yang menyempit, garis yang tidak bergerak",
      prose: [
        "Figure ini menggambar konvergensi dari langkah 4 dan 6: VaR95 MC 1-hari pada N=1.000 (0,0335), N=10.000 (0,0332), N=100.000 (0,0329), masing-masing dengan pita ±1 sd antar-batch. Sumbu-x logaritmik (tiap langkah = 10× simulasi); sumbu-y VaR95. Dua garis acuan horizontal: VaR95 historis 0,0286 dan VaR95 parametrik 0,0328 [M4.2]. Pita pada N=10.000 adalah ±0,0004 — sd antar-batch yang DIUKUR dari 20 batch independen [m9_canonical.json]; pita pada N=1.000 (±0,0013) dan N=100.000 (±0,0001) adalah [turunan] dari sd itu dengan hukum 1/√N (0,0004 × √10 ≈ 0,0013; 0,0004 / √10 ≈ 0,0001).",
        "Bacalah figure ini dari kiri ke kanan: titik-titiknya bergerak SEDIKIT (0,0335 → 0,0332 → 0,0329 — total 0,0006), sementara pitanya menyempit DRASTIS (±0,0013 → ±0,0004 → ±0,0001). Itulah isi hukum 1/√N dalam satu gambar: yang konvergen bukan TITIKNYA — titiknya memang sudah dekat dari awal — melainkan KETIDAKPASTIAN di sekitarnya. Dan perhatikan garis parametrik 0,0328: ketiga titik berada di atasnya dalam jarak yang semakin kecil — MC menghampiri parametrik dari atas, persis seperti yang diharapkan dari dua estimator dengan asumsi normal yang sama. Garis historis 0,0286 berdiri jauh di bawah ketiganya — jarak itu BUKAN MC error (pita ±0,0004 tidak pernah menyentuhnya), melainkan perbedaan ASUMSI (langkah 3).",
        "Nilai: figure ini bagus karena ia memisahkan DUA hal yang sering dicampur: konvergensi (pita menyempit) dan kebenaran (titik mendekati garis yang benar). Pita yang menyempit membuktikan simulasimu konvergen; titik yang mendekati garis parametrik membuktikan asumsimu konsisten — dan jarak ke garis historis membuktikan asumsimu berbeda dari data empiris. Tiga pesan, satu gambar.",
        "Baik atau buruk: figure bagus bila pita yang DIUKUR (N=10.000, ±0,0004) dibedakan dari pita yang DITURUNKAN (N=1.000 dan N=100.000, [turunan] dari hukum 1/√N) — dan caption menuliskan pembedaan itu. Buruk bila semua pita digambar seolah-olah sama-sama diukur: figure yang menyembunyikan mana yang diukur dan mana yang diturunkan adalah figure yang melebih-lebihkan bukti.",
        "Mitigasi: setiap kali kamu menggambar pita ketidakpastian, tulis di caption: mana yang diukur langsung, mana yang diturunkan dari hukum, dan berapa n pengukurannya (di sini: 20 batch). Pita tanpa n adalah dekorasi.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Konvergensi VaR95 MC 1-hari versus N: 0,0335 pada N sama dengan 1.000, 0,0332 pada N sama dengan 10.000, 0,0329 pada N sama dengan 100.000; pita plus-minus 1 sd antar-batch menyempit dari 0,0013 menjadi 0,0004 menjadi 0,0001; garis acuan historis 0,0286 dan parametrik 0,0328">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Konvergensi VaR95 MC 1-hari vs N (sumbu-x log)</text>
<line x1="40" y1="40" x2="40" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="40" y1="200" x2="460" y2="200" stroke="var(--chart-text)" stroke-width="1"/>
<text x="34" y="43" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,036</text>
<text x="34" y="83" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,034</text>
<text x="34" y="123" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,032</text>
<text x="34" y="163" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,030</text>
<text x="34" y="203" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,028</text>
<line x1="40" y1="188" x2="460" y2="188" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="455" y="182" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">hist 0,0286</text>
<line x1="40" y1="104" x2="460" y2="104" stroke="var(--c2)" stroke-width="1.5" stroke-dasharray="4 3"/>
<text x="455" y="98" text-anchor="end" font-size="10" fill="var(--text)" font-family="var(--font-ui)">param 0,0328</text>
<line x1="80" y1="64" x2="80" y2="116" stroke="var(--c1)" stroke-width="3"/>
<line x1="70" y1="64" x2="90" y2="64" stroke="var(--c1)" stroke-width="2"/>
<line x1="70" y1="116" x2="90" y2="116" stroke="var(--c1)" stroke-width="2"/>
<line x1="240" y1="88" x2="240" y2="104" stroke="var(--c1)" stroke-width="3"/>
<line x1="230" y1="88" x2="250" y2="88" stroke="var(--c1)" stroke-width="2"/>
<line x1="230" y1="104" x2="250" y2="104" stroke="var(--c1)" stroke-width="2"/>
<line x1="400" y1="99" x2="400" y2="105" stroke="var(--c1)" stroke-width="3"/>
<line x1="390" y1="99" x2="410" y2="99" stroke="var(--c1)" stroke-width="2"/>
<line x1="390" y1="105" x2="410" y2="105" stroke="var(--c1)" stroke-width="2"/>
<polyline points="80,90 240,96 400,102" fill="none" stroke="var(--c1)" stroke-width="2"/>
<circle cx="80" cy="90" r="5" fill="var(--c2)"/>
<circle cx="240" cy="96" r="5" fill="var(--c2)"/>
<circle cx="400" cy="102" r="5" fill="var(--c2)"/>
<text x="80" y="78" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0335</text>
<text x="240" y="76" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0332</text>
<text x="400" y="88" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,0329</text>
<text x="80" y="132" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">±0,0013 [turunan]</text>
<text x="240" y="120" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">±0,0004 (20 batch)</text>
<text x="400" y="120" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">±0,0001 [turunan]</text>
<text x="80" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">N=1.000</text>
<text x="240" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">N=10.000</text>
<text x="400" y="216" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">N=100.000</text>
<text x="240" y="232" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">Titik bergerak 0,0006; pita menyempit 13× — yang konvergen adalah ketidakpastiannya.</text>
</svg>`,
        alt: "Konvergensi VaR95 MC 1-hari versus N: 0,0335 pada N=1.000, 0,0332 pada N=10.000, 0,0329 pada N=100.000; pita plus-minus 1 sd antar-batch menyempit dari 0,0013 menjadi 0,0004 menjadi 0,0001; garis acuan historis 0,0286 dan parametrik 0,0328.",
        caption: "Cara membaca: titik = VaR95 MC 1-hari (seed 42); pita vertikal = ±1 sd antar-batch. Pita N=10.000 (±0,0004) DIUKUR dari 20 batch independen [m9_canonical.json]; pita N=1.000 (±0,0013) dan N=100.000 (±0,0001) adalah [turunan] dari sd itu dengan hukum 1/√N. Garis putus-putus: historis 0,0286 dan parametrik 0,0328 [M4.2]. Titik bergerak hanya 0,0006 sementara pita menyempit 13× — yang konvergen adalah ketidakpastiannya, bukan titiknya.",
      },
      tasks: [],
    },
    {
      id: "memilih-generator",
      eyebrow: "Langkah 13 · Memilih generator",
      title: "Memilih generator: GBM, EWMA, GARCH, atau FHS — tujuh VaR, satu data",
      prose: [
        "Sejauh ini lesson ini memakai SATU generator: GBM — log-return ~ Normal(μ_log, σ_log) dengan σ KONSTAN. Ia bukan satu-satunya cara mengundi «hari yang belum terjadi». Tiga generator lain hidup dari data yang sama dan memberi VaR95 1-hari yang BERBEDA — semuanya dihitung dari 480 hari yang sama [notebook]: GBM normal (MC univariat N=100.000) 0,0329; parametrik 0,0328 [M4.2]; HS 0,0286 [M4.2]; EWMA-kondisional 0,0467; GARCH-kondisional 0,0310; FHS-GARCH 0,0270; FHS-EWMA 0,0435. Rentang ketujuhnya 0,0197 — dari yang terkecil (FHS-GARCH 0,0270) ke yang terbesar (EWMA 0,0467) — yaitu sekitar 73% dari nilai terkecilnya [turunan]. Memilih generator sama pentingnya dengan memilih N — dan lesson ini belum pernah mengajarkan cara memilihnya. Langkah ini memperbaikinya.",
        "EWMA (Exponentially Weighted Moving Average, λ=0,94): volatilitas hari ini = rata-rata tertimbang dari kuadrat return kemarin, dengan bobot yang meluruh λ tiap hari — rumusnya di bawah. Pada data ini σ EWMA terakhir (11 November 2026) adalah 0,0280 — sekitar 43% di atas σ tak-bersyarat 0,0196 [turunan] — karena guncangan Oktober 2026 masih «diingat»: bobot EWMA meluruh dengan half-life ≈11 hari [turunan], jadi sebulan sesudah crash pun σ-nya belum kembali normal. Rata-rata σ EWMA sepanjang 480 hari adalah 0,0186 — DI BAWAH σ tak-bersyarat — karena sebagian besar hari tenang. VaR95 EWMA-kondisional = 1,6449 × 0,0280 + 0,000558 ≈ 0,0467 [notebook] (0,0466 dari σ tampil; 0,0467 dari σ tak-bulat 0,028038 — selisih 0,0001 murni pembulatan) — VaR untuk «hari ini», bukan untuk «hari rata-rata».",
        "GARCH(1,1) — estimasi MLE manual atas LOG returns [notebook]: ω=0,00012, α=0,1094, β=0,5833, persistensi 0,6927, volatilitas jangka panjang 0,0197, volatilitas ramalan 1 hari ke depan 0,0184. VaR95 GARCH-kondisional = 1,6449 × 0,0184 + 0,000752 = 0,0310 [notebook]. Bandingkan dengan EWMA: σ ramalan GARCH (0,0184) JAUH di bawah σ EWMA terakhir (0,0280) — selisih 0,0096 [turunan] — karena ingatan GARCH jauh lebih pendek: persistensi 0,6927 berarti half-life guncangan ≈2 hari [turunan], melawan ≈11 hari pada EWMA. Dua model volatilitas kondisional yang sama-sama sah — yang satu masih mengingat Oktober, yang satu sudah melupakannya — dan VaR95 mereka berbeda 0,0157 [turunan]. Filtered Historical Simulation (FHS) mengambil jalan ketiga: standarkan tiap log-return dengan σ kondisionalnya (residu terstandar: skew −1,2390, excess kurtosis 10,8991 [notebook] — standardisasi menghilangkan GEROMBOLNYA, bukan EKORNYA), undi residu itu dengan pengembalian, lalu kalikan dengan σ ramalan saat ini. FHS-GARCH: VaR95 0,0270, ES95 0,0429 [notebook]; FHS-EWMA: VaR95 0,0435, ES95 0,0593 [notebook].",
        "Bacalah pola itu seperti pemeriksa. FHS-GARCH (0,0270) mendekati HS (0,0286) — selisih hanya 0,0016 [turunan] — karena keduanya memakai BENTUK empiris: FHS mengundi residu yang sesungguhnya, HS mengundi hari yang sesungguhnya; yang membedakan hanyalah σ saat ini (0,0184 vs 0,0196). FHS-EWMA (0,0435) mendekati EWMA-parametrik (0,0467) — selisih 0,0032 [turunan] — karena keduanya memakai σ saat ini yang tinggi (0,0280). Pelajarannya: yang menggerakkan VaR antar-generator BUKAN bentuk residunya — melainkan σ KONDISIONAL saat ini. Dan σ kondisional itu sendiri tergantung pada seberapa panjang ingatan modelmu: ≈11 hari (EWMA) vs ≈2 hari (GARCH).",
        "Nilai: perbandingan generator bagus karena ia mengubah «VaR MC 0,0329» dari SATU angka menjadi SATU PILIHAN yang bisa diaudit: tiap generator menulis asumsi volatilitasnya di depan — konstan (GBM), tertimbang-eksponensial (EWMA), GARCH, atau empiris (FHS) — dan VaR yang keluar bisa dilacak ke asumsi itu. Tanpa perbandingan ini, 0,0329 terlihat seperti «VaR pasar» — padahal ia «VaR menurut GBM».",
        "Baik atau buruk: generator bagus bila dipilih karena ASUMSINYA cocok dengan datamu — volatilitas bergerombol (autokorelasi squared return 0,1043 [M4.3]) menuntut generator kondisional; ekor tebal (excess kurtosis 6,0216) menuntut FHS atau HS, bukan normal. Buruk bila dipilih karena HASILNYA: «generator ini memberi VaR terkecil, jadi hemat modal» adalah cara memilih yang membalik logika — VaR kecil bukan VaR benar, dan generator yang dipilih karena angkanya nyaman adalah generator yang membohongimu dengan sopan.",
        "Mitigasi: sebelum memilih generator, tulis DUA baris — (1) berapa lama ingatan yang kamu butuhkan (rezim saat ini tenang atau baru saja crash?) dan (2) apakah ekor empiris harus dipertahankan (FHS/HS) atau boleh diganti normal (GBM/GARCH-parametrik). Dan satu aturan keras (lihat note): JANGAN pilih generator dari hasil backtest yang sama dengan yang dipakai memvalidasinya.",
      ],
      tasks: [],
      formula: String.raw`\sigma^2_t = \lambda \sigma^2_{t-1} + (1-\lambda) r^2_{t-1}, \qquad \lambda = 0{,}94, \qquad r_{\mathrm{sim}} = \mu_{\log} + \sigma_{\mathrm{forecast}} \cdot z^*, \quad z^* \sim \text{residu terstandar}`,
      formulaNote: "EWMA (kiri): varians hari ini = λ × varians kemarin + (1−λ) × kuadrat return kemarin; λ=0,94 → half-life bobot ≈11 hari [turunan] (ln(0,5)/ln(0,94) ≈ 11,2). FHS (kanan): undi residu terstandar z* dari 480 residu GARCH, kalikan dengan σ ramalan saat ini (GARCH 0,0184 atau EWMA 0,0280 [notebook]), tambah μ_log −0,000752, konversi ke simple dengan expm1. σ EWMA terakhir 0,0280 (tak-bulat 0,028038 [notebook]); dari σ tampil 0,0280, VaR95 EWMA = 0,0466 — kanonis 0,0467 dari σ tak-bulat, selisih 0,0001 murni pembulatan.",
      note: {
        title: "Aturan keras: jangan pilih generator dari backtest yang sama",
        type: "risk",
        body: "Yang benar: memilih generator karena backtest-nya paling bagus PADA 230 hari OOS yang sama (M9.3) adalah jebakan yang sama dengan «backtest yang dilatih» (M9.3 langkah 7): generator dipilih agar cocok dengan data validasi, sehingga validasi itu berhenti menjadi validasi — ia menjadi laporan kecocokan. Pemisahannya: PUTUSKAN generator dari pemeriksaan asumsi (clustering? ekor? rezim?) SEBELUM melihat backtest; atau, bila harus memakai backtest untuk memilih, BAGI jendela OOS menjadi dua — pilih pada paruh pertama, validasi pada paruh kedua yang belum pernah dipakai memilih. Generator yang dipilih dari backtest yang sama adalah generator yang «lolos» karena soalnya sudah dilihat jawabannya.",
      },
    },
    {
      id: "lab3",
      eyebrow: "Langkah 14 · Lab 3",
      title: "Lab: bandingkan generator — VaR95 tiap generator dari σ-nya",
      prose: [
        "Sekarang bandingkan sendiri ketujuh generator dari angka kanonis [notebook]. Konstanta di bawah ini adalah σ dan VaR tiap generator: EWMA_LAST_VOL 0,0280 (EWMA λ=0,94 atas SIMPLE returns, hari terakhir), GARCH_FORECAST_VOL 0,0184 (GARCH(1,1) atas LOG returns, ramalan 1 hari), FHS_GARCH_VAR95 0,0270 dan FHS_EWMA_VAR95 0,0435 (FHS, N=100.000), GBM_VAR95 0,0329 (MC univariat N=100.000), HS_VAR95 0,0286 dan PARAM_VAR95 0,0328 [M4.2].",
        "Hasil yang diharapkan [lab]: var95_ewma=0.0466; var95_garch=0.0310; spread=0.0196; fhs_ewma_lebih_besar=True; generator_dipilih_dari_backtest_yang_sama=False. Perhatikan: dari σ tampil 0,0280 lab memberi 0,0466 dan spread 0,0196 — kanonis 0,0467 dan 0,0197 dari σ tak-bulat 0,028038 — selisih 0,0001 murni pembulatan; checks memakai toleransi 0,0005 untuk itu. Dan baris terakhir: False BUKAN jawaban yang «gagal» — ia adalah aturan keras lesson ini: generator TIDAK BOLEH dipilih dari backtest yang sama.",
        "Setelah lab jalan, tanyakan pada dirimu: bila crash Oktober 2026 terjadi SETAHUN lalu (bukan sebulan lalu), generator mana yang VaR-nya paling berubah — EWMA atau GARCH? Jawabannya ada di half-life ingatannya: EWMA ≈11 hari [turunan] masih mengingat sebulan lalu; GARCH ≈2 hari sudah lupa seminggu kemudian. Generator yang ingatannya pendek memberi VaR yang tenang lebih cepat — dan «tenang» setelah crash belum tentu berarti «aman».",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi var95_ewma dan var95_garch dari rumus VaR parametrik (Z95 × σ − μ)" },
        { id: "t2", text: "Lengkapi spread (maks − min ketujuh VaR95) dan fhs_ewma_lebih_besar" },
        { id: "t3", text: "Lengkapi generator_dipilih_dari_backtest_yang_sama: False (aturan keras — generator dipilih dari asumsi, bukan dari backtest yang sama)" },
      ],
      expected: "var95_ewma=0.0466\nvar95_garch=0.0310\nspread=0.0196\nfhs_ewma_lebih_besar=True\ngenerator_dipilih_dari_backtest_yang_sama=False",
      hints: [
        "var95_ewma = Z95 × EWMA_LAST_VOL − MU_SIMPLE = 1,6449 × 0,0280 + 0,000558 ≈ 0,0467; var95_garch = Z95 × GARCH_FORECAST_VOL − MU_LOG = 1,6449 × 0,0184 + 0,000752 ≈ 0,0310.",
        "spread = max(GBM_VAR95, HS_VAR95, PARAM_VAR95, var95_ewma, var95_garch, FHS_GARCH_VAR95, FHS_EWMA_VAR95) − min(...) = 0,0466 − 0,0270 = 0,0196 [turunan] (kanonis 0,0197 dari σ tak-bulat; dalam toleransi 0,0005). fhs_ewma_lebih_besar = FHS_EWMA_VAR95 > FHS_GARCH_VAR95 → True.",
        "generator_dipilih_dari_backtest_yang_sama = False — generator dipilih dari pemeriksaan asumsi SEBELUM melihat backtest (atau bagi OOS jadi dua: pilih di paruh pertama, validasi di paruh kedua).",
      ],
      code: {
        starter: `# Lab 3 — bandingkan generator: VaR95 tiap generator dari sigma-nya
# Konstanta [notebook]: EWMA(0,94) atas SIMPLE returns; GARCH(1,1) atas
# LOG returns; FHS N=100.000. GBM/HS/param dari kanonis yang sudah ada.
# Rumus VaR parametrik: VaR95 = Z95 * sigma - mu (mu negatif -> ditambah).
EWMA_LAST_VOL = 0.0280
GARCH_FORECAST_VOL = 0.0184
FHS_GARCH_VAR95 = 0.0270
FHS_EWMA_VAR95 = 0.0435
GBM_VAR95 = 0.0329
HS_VAR95 = 0.0286
PARAM_VAR95 = 0.0328
MU_SIMPLE = -0.000558
MU_LOG = -0.000752
Z95 = 1.6449

var95_ewma = 0.0  # TODO: Z95 * EWMA_LAST_VOL - MU_SIMPLE
var95_garch = 0.0  # TODO: Z95 * GARCH_FORECAST_VOL - MU_LOG
all_var95 = [GBM_VAR95, HS_VAR95, PARAM_VAR95, var95_ewma, var95_garch,
             FHS_GARCH_VAR95, FHS_EWMA_VAR95]
spread = 0.0  # TODO: max(all_var95) - min(all_var95)
fhs_ewma_lebih_besar = None  # TODO: FHS_EWMA_VAR95 > FHS_GARCH_VAR95
generator_dipilih_dari_backtest_yang_sama = None  # TODO: False (aturan keras)
print(f"var95_ewma={var95_ewma:.4f}")
print(f"var95_garch={var95_garch:.4f}")
print(f"spread={spread:.4f}")
print(f"fhs_ewma_lebih_besar={fhs_ewma_lebih_besar}")
print(f"generator_dipilih_dari_backtest_yang_sama={generator_dipilih_dari_backtest_yang_sama}")`,
        lockLines: 13,
        solution: `# Lab 3 — bandingkan generator: VaR95 tiap generator dari sigma-nya
# Konstanta [notebook]: EWMA(0,94) atas SIMPLE returns; GARCH(1,1) atas
# LOG returns; FHS N=100.000. GBM/HS/param dari kanonis yang sudah ada.
# Rumus VaR parametrik: VaR95 = Z95 * sigma - mu (mu negatif -> ditambah).
EWMA_LAST_VOL = 0.0280
GARCH_FORECAST_VOL = 0.0184
FHS_GARCH_VAR95 = 0.0270
FHS_EWMA_VAR95 = 0.0435
GBM_VAR95 = 0.0329
HS_VAR95 = 0.0286
PARAM_VAR95 = 0.0328
MU_SIMPLE = -0.000558
MU_LOG = -0.000752
Z95 = 1.6449

var95_ewma = Z95 * EWMA_LAST_VOL - MU_SIMPLE
var95_garch = Z95 * GARCH_FORECAST_VOL - MU_LOG
all_var95 = [GBM_VAR95, HS_VAR95, PARAM_VAR95, var95_ewma, var95_garch,
             FHS_GARCH_VAR95, FHS_EWMA_VAR95]
spread = max(all_var95) - min(all_var95)
fhs_ewma_lebih_besar = FHS_EWMA_VAR95 > FHS_GARCH_VAR95
generator_dipilih_dari_backtest_yang_sama = False
print(f"var95_ewma={var95_ewma:.4f}")
print(f"var95_garch={var95_garch:.4f}")
print(f"spread={spread:.4f}")
print(f"fhs_ewma_lebih_besar={fhs_ewma_lebih_besar}")
print(f"generator_dipilih_dari_backtest_yang_sama={generator_dipilih_dari_backtest_yang_sama}")`,
        checks: [
          { kind: "equal", task: "t1", name: "var95_ewma", value: 0.0467, tol: 0.0005, label: "`var95_ewma` seharusnya 0.0467", msg: "VaR95 EWMA-kondisional ≈ 0,0467 — σ terakhir 0,0280 (crash Oktober masih diingat EWMA) memberi VaR tertinggi dari ketujuh generator." },
          { kind: "equal", task: "t1", name: "var95_garch", value: 0.031, tol: 0.0005, label: "`var95_garch` seharusnya 0.0310", msg: "VaR95 GARCH-kondisional ≈ 0,0310 — σ ramalan 0,0184 (ingatan GARCH ≈2 hari) memberi VaR di bawah parametrik 0,0328." },
          { kind: "equal", task: "t2", name: "spread", value: 0.0197, tol: 0.0005, label: "`spread` seharusnya 0.0197", msg: "Rentang ketujuh generator 0,0197 (0,0467 − 0,0270) — pilihan generator menggerakkan VaR95 lebih dari setengah nilainya." },
          { kind: "stdout_matches", task: "t2", pattern: "fhs_ewma_lebih_besar=True", label: "Output menampilkan fhs_ewma_lebih_besar=True", msg: "FHS-EWMA (0,0435) > FHS-GARCH (0,0270): bentuk residu yang sama, σ saat ini yang berbeda — σ kondisional-lah yang menggerakkan VaR." },
          { kind: "stdout_matches", task: "t3", pattern: "generator_dipilih_dari_backtest_yang_sama=False", label: "Output menampilkan generator_dipilih_dari_backtest_yang_sama=False", msg: "Aturan keras: generator dipilih dari pemeriksaan asumsi, BUKAN dari backtest yang sama — memilih dari backtest yang sama adalah jebakan M9.3 langkah 7." },
        ],
      },
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 15 · Checkpoint",
      title: "Checkpoint: simulasi memberi dunia yang belum terjadi — dengan asumsi yang tertulis",
      prose: [
        "Rangkuman: portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (n=480, 2024-11-04→2026-11-11); simulasi GBM memakai LOG returns (μ_log −0,000752, σ_log 0,0198; μ_simple −0,000558, σ_simple 0,0196), konversi log→simple = expm1, seed 42. GBM: dS/S = μdt + σdW; log-return 1-hari ~ Normal(μ_log, σ_log²) — tiga asumsi (normal, iid, vol konstan), ketiganya gagal deskriptif di data ini (skew −0,5091, excess kurtosis 6,0216 menyangkal normalitas; autokorelasi squared return lag-1 0,1043 [M4.3] menyangkal iid DAN vol konstan — lihat EWMA/GARCH [M4.3]). VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR. VaR95 1-hari: historis 0,0286 / parametrik 0,0328 / MC joint-normal M4 0,0336 / MC univariat N=1.000 0,0335, N=10.000 0,0332, N=100.000 0,0329; ES95: historis 0,0445 / parametrik 0,0410 / MC M4 0,0424 / MC univariat 0,0413 / 0,0411 / 0,0407. Hukum 1/√N: SE mean = σ/√N → 0,001962 / 0,000620 / 0,000196 / 0,000062 (N=100/1.000/10.000/100.000); realised MC mean error −0,000149 / −0,000813 / −0,000118 / −0,000015 — error satu undian bisa melebihi SE (N=1.000: 1,3 SE) dan bisa jauh di bawahnya karena beruntung (N=100). 20 batch independen N=10.000: VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009), range [0,0319; 0,0333]. GBM 10 hari (N=100.000 path): terminal mean −0,0053 (sd 0,0619), median −0,0074, VaR95 10-hari 0,1038, VaR99 10-hari 0,1408, P(rugi > 10%) 0,0572, P(rugi > 0,0903) 0,0795; √10-hist 0,0903 meremehkan ekor 10-hari (peluang melampaui 0,0903 adalah 0,0795, bukan 0,05) — terutama karena titik awal historis 0,0286 berada di bawah parametrik/MC 0,0328/0,0329, ditambah drift negatif yang terakumulasi linear; √10-param 0,1037 dan √10-MC 0,1040 hampir sama dengan MC 10-hari 0,1038. Konvergensi [kebijakan lesson ini]: berhenti bila sd antar-batch VaR95 ≤ 0,0005 (kurang dari seperempat bootstrap sd 0,0022) — terpenuhi pada N=10.000 (sd 0,0004); ketidakpastian sampling data (bootstrap VaR95 M9.5: iid CI95 [0,0229; 0,0322], block-10 CI95 [0,0223; 0,0340]) ≈ 5,5× ketidakpastian simulasi. Jebakan: N besar mengecilkan MC error, bukan model error — σ 10% terlalu kecil membuat VaR ≈ 10% terlalu kecil [ilustrasi]; validasi MC adalah conceptual soundness [M8.1] + perbandingan tiga estimator. Mini-case: laporkan KETIGANYA (hist/param/MC) beserta ES dan asumsinya — MC bukan «yang benar», ia yang asumsi-nya paling transparan. Memilih generator (langkah 13–14): EWMA-kondisional 0,0467 (σ terakhir 0,0280, ingatan ≈11 hari), GARCH-kondisional 0,0310 (σ ramalan 0,0184, ingatan ≈2 hari), FHS-GARCH 0,0270, FHS-EWMA 0,0435 [notebook] — rentang ketujuh generator 0,0197; generator dipilih dari pemeriksaan asumsi, BUKAN dari backtest yang sama (aturan keras). Lab: sweep N (var95_N100000 0,0329, se_menyusut True); GBM 10-hari N=10.000 path (p5_10d 0,1038, p_loss_gt_10 0,0572, p5 > √10-hist). Figure: distribusi MC 1-hari (tiga VaR) dan konvergensi VaR95 vs N.",
        "Guided task di Colab — notebook mlf-m91-guided-task.ipynb mereplikasi semua angka kanonis lesson ini dari data harga nyata: return portofolio dari data/m4_prices.csv (n=480), MC 1-hari sweep N, 20 batch independen + hukum 1/√N, GBM 10-hari N=100.000 path, kriteria berhenti konvergensi [kebijakan lesson ini], dan laporan tiga estimator untuk komite. Tautan Colab: https://colab.research.google.com/drive/1Nt2MSyof-aEwUE0eQ2RVh96NwVWXk02s",
        "Yang tersisa adalah kebiasaan: tiap kali seseorang membawakanmu angka simulasi dengan empat desimal yang rapi, tanyakan tiga hal — dari mana inputnya berasal, berapa error antar-batch-nya, dan apakah error itu masih lebih kecil dari ketidakpastian datanya. Bila satu jawabannya kosong, simulasinya belum menjadi keputusan.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Definisi yang eksak: apa itu VaR95?",
          options: [
            { text: "Kerugian maksimum yang mungkin terjadi pada portofolio", why: "Salah: tidak ada «maksimum» pada distribusi yang tak terbatas — VaR95 adalah kuantil, bukan maksimum. Kerugian bisa (dan pada 5% hari memang) melebihi VaR95.", correct: false },
            { text: "Kuantil 95% dari distribusi kerugian — kerugian yang hanya terlampaui pada 5% hari", why: "Benar: VaR95 0,0329 berarti kerugian melebihi Rp3.290.000 (pada Rp100.000.000) pada 5% hari — dan pada hari-hari itu kerugiannya bisa jauh lebih besar; rata-ratanya adalah ES95 0,0407.", correct: true },
            { text: "Rata-rata kerugian harian portofolio", why: "Salah: rata-rata kerugian harian adalah mean return (di sini −0,000558, alias keuntungan rata-rata negatif yang kecil) — bukan kuantil 95%. Rata-rata kerugian pada 5% hari terburuk adalah ES95, bukan VaR.", correct: false },
            { text: "Kerugian terburuk yang pernah terjadi dalam 480 hari", why: "Salah: itu satu observasi (hari terburuk historis) — bukan kuantil distribusi. VaR95 historis 0,0286 adalah kuantil empiris ke-24 dari 480 hari, bukan nilai minimumnya.", correct: false },
          ],
        },
        {
          q: "VaR95 1-hari: historis 0,0286, parametrik 0,0328, MC univariat N=100.000 0,0329. Mengapa MC hampir sama dengan parametrik, tapi di atas historis?",
          options: [
            { text: "Karena MC memakai N=100.000 hari — lebih banyak data daripada 480 hari historis, jadi lebih akurat", why: "Salah: 100.000 hari MC bukan DATA — semuanya diundi dari μ_log dan σ_log yang diestimasi dari 480 hari yang sama. MC tidak menambah data; ia menambah aritmetika.", correct: false },
            { text: "Karena MC dan parametrik memakai asumsi normal yang sama (yang satu lewat undian, yang satu lewat rumus); historis memakai kuantil empiris 480 hari tanpa asumsi distribusi", why: "Benar: MC ≈ param (0,0329 vs 0,0328, selisih 0,0001 = MC error) karena asumsinya sama. Historis berbeda (0,0286) karena bentuk empirisnya berbeda dari normal — «bahu» 5%-nya lebih tipis (skew −0,5091), walau ES historis 0,0445 lebih tebal dari ES parametrik 0,0410.", correct: true },
            { text: "Karena VaR historis salah hitung — seharusnya 0,0329 juga", why: "Salah: 0,0286 dihitung dengan benar dari data (kuantil empiris 5% dari 480 hari). Perbedaan 0,0043 bukan kesalahan hitung — melainkan perbedaan ASUMSI: empiris vs normal.", correct: false },
            { text: "Karena MC memakai log-return dan parametrik memakai simple return — log selalu memberi angka lebih besar", why: "Salah: MC memakai log-return lalu dikonversi ke simple dengan expm1 sebelum menghitung kuantil — jadi keduanya membandingkan return SIMPLE. Selisihnya bukan soal log vs simple, melainkan soal asumsi distribusi.", correct: false },
          ],
        },
        {
          q: "Hukum 1/√N: SE mean pada N=10.000 adalah 0,000196. Bila N naik 100× menjadi 1.000.000, SE menjadi?",
          options: [
            { text: "0,0000196 — SE dibagi √100 = 10", why: "Benar: SE = σ/√N; N ×100 → penyebut ×√100 = ×10 → SE ÷10: 0,000196/10 = 0,0000196. Setiap nol tambahan pada N membeli pengurangan SE yang semakin kecil.", correct: true },
            { text: "0,00000196 — SE dibagi 100", why: "Salah: SE menyusut dengan 1/√N, bukan 1/N. N ×100 membagi SE dengan √100 = 10, bukan 100. 0,000196/100 = 0,00000196 adalah jawaban untuk hukum 1/N — hukum yang tidak berlaku di sini.", correct: false },
            { text: "0,000196 — SE tidak berubah karena σ tetap 0,0196", why: "Salah: σ memang tetap, tetapi SE = σ/√N — penyebutnya √N yang membesar. σ adalah simpangan baku SATU observasi; SE adalah simpangan baku RATA-RATA N observasi.", correct: false },
            { text: "0,001960 — SE naik 10× karena simulasi lebih banyak", why: "Salah dan terbalik: menambah simulasi MENGECILKAN error, bukan membesarkannya. 0,000196 × 10 = 0,001960 adalah SE pada N=100 (0,001962) — arah yang salah.", correct: false },
          ],
        },
        {
          q: "20 batch independen (N=10.000) memberi VaR95 mean 0,0326 (sd antar-batch 0,0004). Berapa SE dari rata-rata 20 batch itu?",
          options: [
            { text: "0,0004 — itu sudah SE-nya", why: "Salah: 0,0004 adalah SIMPANGAN BAKU antar-batch (sebaran satu batch). SE rata-rata 20 batch = sd/√n = 0,0004/√20. Mencampuradukkan sd dan SE adalah kesalahan yang dilarang lesson ini («mean ± sd» sebagai ketidakpastian mean).", correct: false },
            { text: "0,0004/√20 ≈ 0,00009", why: "Benar: SE(mean) = sd/√n = 0,0004/4,4721 ≈ 0,000089 ≈ 0,00009. Yang benar ditulis «mean 0,0326 (sd antar-batch 0,0004; SE 0,00009)» — bukan «0,0326 ± 0,0004».", correct: true },
            { text: "0,0004/20 = 0,00002", why: "Salah: pembaginya √20, bukan 20. SE menyusut dengan 1/√n — 0,0004/20 = 0,00002 mengecilkan ketidakpastian 4,47× lebih dari yang benar.", correct: false },
            { text: "0,0004 × √20 ≈ 0,0018", why: "Salah dan terbalik: mengalikan dengan √20 MEMBESAR ketidakpastian — 0,0004 × 4,4721 ≈ 0,0018 adalah arah yang salah. Rata-rata dari 20 batch LEBIH pasti daripada satu batch, bukan kurang.", correct: false },
          ],
        },
        {
          q: "GBM 10 hari (N=100.000 path): VaR95 10-hari MC 0,1038, sementara skala √10 dari VaR95 historis 1-hari adalah 0,0903. Bila komite memakai 0,0903 sebagai VaR95 10-hari, berapa peluang kerugian aktual melampauinya?",
          options: [
            { text: "0,05 — sesuai definisi VaR95", why: "Salah: 0,05 adalah peluang yang DIASUMSIKAN oleh pemakai √10 — bukan peluang yang sebenarnya. MC mengukur peluang aktualnya: 0,0795.", correct: false },
            { text: "0,0572 — peluang rugi lebih dari 10%", why: "Salah: 0,0572 adalah P(rugi > 10%) — ambang yang BERBEDA (0,10, bukan 0,0903). Peluang melampaui 0,0903 lebih besar karena ambangnya lebih rendah: 0,0795.", correct: false },
            { text: "0,0795 — MC mengukur 7,95% jendela 10-hari melampaui 0,0903", why: "Benar: P(rugi > 0,0903) = 0,0795 [m9_canonical.json] — bukan 0,05. Memakai 0,0903 sebagai VaR95 berarti mengira terlampaui 5% jendela, padahal 7,95%: skala √10-hist meremehkan ekor 10-hari.", correct: true },
            { text: "0,1038 — itu VaR-nya, jadi itu peluangnya", why: "Salah: 0,1038 adalah BESARNYA VaR (dalam fraksi return), bukan peluang. Peluang adalah bilangan di sumbu yang lain: P(melampaui 0,0903) = 0,0795. Mencampuradukkan nilai kuantil dengan peluangnya adalah kesalahan satuan.", correct: false },
          ],
        },
        {
          q: "Konvergensi [kebijakan lesson ini]: berhenti menambah N bila sd antar-batch VaR95 ≤ 0,0005. Mengapa 0,0005 — dan mengapa N=10.000 sudah cukup?",
          options: [
            { text: "Karena 0,0005 «terasa cukup kecil» — ambang yang ditebak dari pengalaman", why: "Salah: ambang ini DITURUNKAN dari ketidakpastian data — kurang dari seperempat simpangan baku bootstrap VaR95 (0,0022). Ambang yang ditebak tanpa pembanding adalah ambang yang tidak bisa dipertahankan.", correct: false },
            { text: "Karena pada N=10.000 sd antar-batch sudah 0,0004 (≤ 0,0005), sementara ketidakpastian sampling data (bootstrap sd 0,0022) ≈ 5,5× lebih besar — menambah N tidak lagi mengurangi sumber ketidakpastian terbesar", why: "Benar: kriteria terpenuhi pada N=10.000 (sd 0,0004 ≤ 0,0005 [kebijakan lesson ini]). N=100.000 mengecilkan 0,0004 menjadi ≈ 0,00013 — sementara 0,0022 dari data (480 hari) tidak bergerak. Konvergen = error simulasi sudah jauh lebih kecil dari error data.", correct: true },
            { text: "Karena VaR95 berhenti berubah pada N=10.000 (0,0332 = 0,0329)", why: "Salah: VaR95 TIDAK berhenti berubah — 0,0332 vs 0,0329 berbeda 0,0003, dan tiap batch baru memberi angka baru (range [0,0319; 0,0333]). Konvergen berarti ayunannya sudah kecil dibanding error data — bukan berarti ayunannya nol.", correct: false },
            { text: "Karena N=100.000 selalu cukup untuk VaR berapa pun — termasuk VaR99", why: "Salah: ambang ini benar untuk VaR95 portofolio ini. VaR99/ES99 punya ekor lebih tipis dan butuh N lebih besar. «Selalu cukup» tanpa menghitung adalah klaim tanpa bukti.", correct: false },
          ],
        },
        {
          q: "Jebakan: σ diestimasi dari 120 hari terakhir yang kebetulan tenang, lalu dipakai mensimulasikan VaR. Apa yang terjadi — dan apa penawarnya?",
          options: [
            { text: "VaR menjadi terlalu kecil dengan presisi yang meyakinkan; penawarnya adalah menambah N sampai VaR naik", why: "Salah separuh: benar VaR menjadi terlalu kecil — tetapi menambah N TIDAK memperbaikinya. N hanya mengecilkan MC error; σ yang salah tetap salah pada N berapa pun. Itu presisi palsu.", correct: false },
            { text: "VaR menjadi terlalu kecil (σ 10% terlalu kecil → VaR ≈ 10% terlalu kecil); penawarnya adalah validasi input dan perbandingan tiga estimator (hist/param/MC) — conceptual soundness [M8.1]", why: "Benar: model error tidak menyusut dengan N — satu kesalahan input 10% (≈ 0,0033 pada VaR 0,0329) menenggelamkan seluruh MC error antar-batch (range 0,0014). Yang menangkapnya adalah memeriksa DARI MANA μ/σ berasal dan membandingkan estimator yang asumsinya berbeda.", correct: true },
            { text: "Tidak ada yang terjadi — MC memakai seed 42, jadi hasilnya selalu benar", why: "Salah: seed 42 hanya menjamin REPRODUCIBILITY (hasil yang sama bila dihitung ulang) — bukan kebenaran. Seed yang sama atas input yang salah memberi jawaban salah yang sama persis setiap kali.", correct: false },
            { text: "VaR menjadi terlalu besar — periode tenang memberi σ yang terlalu besar", why: "Terbalik: periode tenang memberi σ yang terlalu KECIL (sedikit gejolak yang teramati), sehingga VaR yang keluar terlalu kecil — risiko yang diremehkan, bukan dilebihkan.", correct: false },
          ],
        },
        {
          q: "Mini-case: komite bertanya «jadi VaR kita berapa?» — historis 0,0286, parametrik 0,0328, MC 0,0329. Keputusanmu?",
          options: [
            { text: "MC 0,0329 saja — N=100.000 paling besar, jadi paling benar", why: "Salah: N besar mengecilkan MC error, bukan model error — MC memakai asumsi normal yang sudah terbukti gagal deskriptif (skew −0,5091, excess kurtosis 6,0216). «Paling besar N» bukan «paling benar».", correct: false },
            { text: "Historis 0,0286 saja — tanpa asumsi berarti tanpa kelemahan", why: "Salah: tanpa asumsi bukan tanpa kelemahan — kuantil 5%-nya hanya bersandar pada 24 hari, dan CI95 bootstrap-nya selebar [0,0223; 0,0340] (block-10). 0,0286 adalah titik di tengah pita yang lebar.", correct: false },
            { text: "Laporkan ketiganya beserta ES dan asumsinya — MC bukan «yang benar», ia yang asumsi-nya paling transparan; rentang tiga estimator utama [0,0286; 0,0329] (bila M4 ikut, [0,0286; 0,0336]) + bootstrap CI adalah informasi, bukan masalah", why: "Benar: tiap estimator mengestimasi besaran yang sama dengan asumsi berbeda. Laporan yang jujur: hist 0,0286 (tanpa asumsi, n=480) / param 0,0328 (normal) / MC 0,0329 (normal pada log-return, N=100.000, seed 42) + ES (0,0445 / 0,0410 / 0,0407) + bootstrap CI95 block-10 [0,0223; 0,0340]. Untuk batas 1-hari, angka kerja 0,0329 dengan catatan ES historis 0,0445 untuk skenario ekstrem.", correct: true },
            { text: "Parametrik 0,0328 saja — ada rumusnya, jadi paling bisa dipertahankan", why: "Salah: rumus itu menyembunyikan asumsi normal di balik keanggunannya — ia «yang paling ringkas», bukan «yang benar». Model yang asumsinya tersembunyi adalah model yang kesalahannya tidak bisa dilacak.", correct: false },
          ],
        },
        {
          q: "ES95 MC (N=100.000) adalah 0,0407, sementara VaR95 MC adalah 0,0329. Apa arti 0,0407 — dan apa arti selisih 0,0078?",
          options: [
            { text: "0,0407 adalah rata-rata kerugian pada 5% hari terburuk simulasi (beyond VaR); 0,0078 hanyalah selisih hasil (0,0407 − 0,0329) pada simulasi ini — bukan definisi", why: "Benar: ES = rata-rata kerugian BEYOND VaR — pada portofolio Rp100.000.000, rata-rata kerugian pada 5% hari terburuk adalah Rp4.070.000. Selisih 0,0078 = 0,0407 − 0,0329 adalah aritmetika hasil, bukan rumus: ia berubah bila distribusinya berubah.", correct: true },
            { text: "0,0407 adalah kerugian maksimum simulasi; 0,0078 adalah «buffer» yang harus ditambahkan ke VaR", why: "Salah: kerugian maksimum simulasi jauh lebih besar dari 0,0407 (ekor normal tak terbatas). ES adalah RATA-RATA 5% terburuk, bukan maksimum — dan 0,0078 bukan «buffer» yang ditambahkan, melainkan selisih dua statistik.", correct: false },
            { text: "0,0407 adalah rata-rata kerugian SEMUA hari simulasi; 0,0078 adalah SE-nya", why: "Salah dua kali: rata-rata kerugian semua hari adalah mean return (−0,0006, alias −0,06%) — bukan 0,0407. Dan 0,0078 bukan SE (SE mean pada N=100.000 adalah 0,000062). ES hanya merata-ratakan 5% hari terburuk.", correct: false },
            { text: "0,0407 = VaR95 + 0,0078 — ES selalu VaR ditambah konstanta 0,0078", why: "Salah: 0,0078 bukan konstanta — ia selisih yang terealisasi pada distribusi INI (0,0407 − 0,0329 = 0,0078). Pada distribusi lain (mis. historis: 0,0445 − 0,0286 = 0,0159) selisihnya berbeda. ES didefinisikan sebagai rata-rata beyond VaR, bukan sebagai VaR + konstanta.", correct: false },
          ],
        },
        {
          q: "Tujuh generator memberi VaR95 1-hari yang berbeda atas data yang sama: GBM normal 0,0329; parametrik 0,0328; HS 0,0286; EWMA-kondisional 0,0467; GARCH-kondisional 0,0310; FHS-GARCH 0,0270; FHS-EWMA 0,0435. Mengapa EWMA (0,0467) jauh di atas GARCH (0,0310) — dan bagaimana cara memilih generator yang benar?",
          options: [
            { text: "Karena ingatannya berbeda: EWMA (λ=0,94, half-life ≈11 hari) masih mengingat guncangan Oktober 2026 (σ terakhir 0,0280), sementara GARCH (persistensi 0,6927, half-life ≈2 hari) sudah melupakannya (σ ramalan 0,0184) — selisih σ 0,0096 [turunan]; generator dipilih dari pemeriksaan asumsi, BUKAN dari backtest yang sama", why: "Benar: dua model volatilitas kondisional yang sama-sama sah bisa berbeda 0,0096 dalam σ karena ingatannya berbeda — dan generator dipilih dari asumsi (clustering? ekor? rezim?) SEBELUM melihat backtest, bukan dari backtest yang sama (aturan keras, M9.3 langkah 7).", correct: true },
            { text: "Karena EWMA salah hitung — dua model volatilitas kondisional yang benar harus memberi σ yang sama", why: "Salah: keduanya dihitung dengan benar; EWMA dan GARCH adalah model yang BERBEDA dengan ingatan yang berbeda (half-life ≈11 hari vs ≈2 hari [turunan]) — σ 0,0280 vs 0,0184 adalah hasil yang sah dari dua definisi «volatilitas saat ini» yang berbeda.", correct: false },
            { text: "Pilih generator yang backtest-nya paling bagus pada 230 hari OOS yang sama (M9.3)", why: "Salah dan DILARANG (aturan keras): memilih dari backtest yang sama adalah jebakan «backtest yang dilatih» (M9.3 langkah 7) — generator dipilih agar cocok dengan data validasi, sehingga validasi berhenti menjadi validasi.", correct: false },
            { text: "Pilih yang VaR-nya paling kecil — FHS-GARCH 0,0270 — karena paling hemat modal", why: "Salah: VaR kecil bukan VaR benar — 0,0270 memakai σ ramalan GARCH yang rendah (0,0184) karena ingatannya pendek; di rezim pasca-crash, «hemat modal» dari ingatan yang pendek adalah rasa aman yang palsu.", correct: false },
          ],
        },
      ],
      summary: [
        "Konvensi: risiko pasar = portofolio equal-weight BBCA/KLBF/UNVR, SIMPLE daily returns (n=480, 2024-11-04→2026-11-11); simulasi GBM memakai LOG returns (μ_log −0,000752, σ_log 0,0198; μ_simple −0,000558, σ_simple 0,0196); konversi log→simple = expm1; seed 42.",
        "GBM: dS/S = μdt + σdW; log-return 1-hari ~ Normal(μ_log, σ_log²) — tiga asumsi (normal, iid, vol konstan); ketiganya gagal deskriptif di data ini (skew −0,5091, excess kurtosis 6,0216 menyangkal normalitas; autokorelasi squared return lag-1 0,1043 [M4.3] menyangkal iid DAN vol konstan — lihat EWMA/GARCH [M4.3]).",
        "VaR = kuantil 95% distribusi KERUGIAN; ES = rata-rata kerugian BEYOND VaR. VaR95 1-hari: historis 0,0286 / parametrik 0,0328 / MC joint-normal M4 0,0336 / MC univariat N=1.000 0,0335, N=10.000 0,0332, N=100.000 0,0329; ES95: historis 0,0445 / parametrik 0,0410 / MC M4 0,0424 / MC univariat 0,0413 / 0,0411 / 0,0407.",
        "Hukum 1/√N: SE mean = σ/√N → 0,001962 / 0,000620 / 0,000196 / 0,000062 (N=100/1.000/10.000/100.000); realised MC mean error −0,000149 / −0,000813 / −0,000118 / −0,000015 — error satu undian bisa melebihi SE dan bisa jauh di bawahnya karena beruntung.",
        "20 batch independen N=10.000: VaR95 mean 0,0326 (sd antar-batch 0,0004; SE 0,00009), range [0,0319; 0,0333].",
        "GBM 10 hari (N=100.000 path): terminal mean −0,0053 (sd 0,0619), median −0,0074, VaR95 10-hari 0,1038, VaR99 10-hari 0,1408, P(rugi > 10%) 0,0572, P(rugi > 0,0903) 0,0795; √10-hist 0,0903 meremehkan ekor 10-hari — terutama karena titik awal historis 0,0286 di bawah parametrik/MC 0,0328/0,0329, ditambah drift negatif yang terakumulasi linear; √10-param 0,1037 dan √10-MC 0,1040 hampir sama dengan MC 10-hari 0,1038.",
        "Konvergensi [kebijakan lesson ini]: berhenti bila sd antar-batch VaR95 ≤ 0,0005 (kurang dari seperempat bootstrap sd 0,0022) — terpenuhi pada N=10.000 (sd 0,0004); ketidakpastian sampling data (bootstrap VaR95 M9.5: iid CI95 [0,0229; 0,0322], block-10 CI95 [0,0223; 0,0340]) ≈ 5,5× ketidakpastian simulasi.",
        "Jebakan: N besar mengecilkan MC error, bukan model error — σ 10% terlalu kecil membuat VaR ≈ 10% terlalu kecil [ilustrasi]; validasi MC adalah conceptual soundness [M8.1] + perbandingan tiga estimator.",
        "Mini-case: laporkan KETIGANYA (hist/param/MC) beserta ES dan asumsinya — MC bukan «yang benar», ia yang asumsi-nya paling transparan; untuk batas 1-hari, angka kerja 0,0329 dengan catatan ES historis 0,0445 untuk skenario ekstrem.",
        "Lab: sweep N (var95_N100000 0,0329, se_menyusut True); GBM 10-hari N=10.000 path (p5_10d 0,1038, p_loss_gt_10 0,0572, p5 > √10-hist).",
        "Figure: distribusi MC 1-hari (tiga VaR + ES 0,0407) dan konvergensi VaR95 vs N (pita ±1 sd menyempit 13× sementara titik bergerak 0,0006).",
        "Memilih generator [notebook]: EWMA-kondisional 0,0467 (σ terakhir 0,0280), GARCH-kondisional 0,0310 (σ ramalan 0,0184), FHS-GARCH 0,0270, FHS-EWMA 0,0435 — rentang ketujuh generator 0,0197; EWMA mengingat Oktober (half-life ≈11 hari), GARCH sudah lupa (≈2 hari).",
        "Aturan keras: JANGAN pilih generator dari backtest yang sama dengan yang dipakai memvalidasi (jebakan M9.3 langkah 7) — pilih dari pemeriksaan asumsi, atau bagi OOS jadi dua (pilih di paruh pertama, validasi di paruh kedua).",
      ],
      next: { label: "Lanjut: MLF-M9.2 — Scenario & Stress Testing", href: "/v2/learn/mlf-m92-scenario-stress-testing" },
    },
  ],
};
