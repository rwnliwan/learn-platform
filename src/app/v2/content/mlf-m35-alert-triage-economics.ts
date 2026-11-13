import type { V2Lesson } from "../lib/types";

export const mlfM35: V2Lesson = {
  slug: "mlf-m35-alert-triage-economics",
  track: "Machine Learning Finance",
  module: "Unsupervised — fraud",
  title: "MLF-M3.5 — Alert Triage Economics: Antrean yang Paling Mahal Didahulukan",
  estMinutes: 55,
  steps: [
    {
      id: "mulai",
      eyebrow: "Langkah 1 · Mulai dari sini",
      title: "Peta lesson dan tujuan",
      prose: [
        "Modul M3 mengajarkan unsupervised learning untuk fraud: clustering, anomaly detection, dan cara menemukan pola yang tidak berlabel. Lesson ini memakai mesin yang sama — tapi pertanyaannya bukan «model apa?» melainkan «alert mana yang diperiksa dulu, kalau analisnya tidak cukup?». Itu alert triage economics: ekonomi antrean.",
        "Tujuan lesson ini:",
        "• Membaca antrean alert sebagai ranking: precision@k mengukur berapa banyak default di k alert teratas.",
        "• Menghitung expected value (EV) satu antrean: TP × biaya terlewat − k × biaya review — dengan biaya [ilustrasi] yang dilabeli.",
        "• Membuktikan ranking mengalahkan acak — 4,0x terhadap undian acak seed 7 (3,3x terhadap ekspektasi acak) pada angka kanonis notebook — dan tahu kenapa.",
        "• Membaca EV marginal: total EV naik dengan k, EV per alert turun — antrean optimal ditentukan biaya marginal, bukan angka bulat.",
        "• Mengaudit fairness alert per grup (SEX) dan menempelkan reason codes pada alert yang ditriase.",
        "• Membaca Siskamling sebagai sistem triase nyata: dua ambang, lapisan aturan keras, dan manusia pemegang vonis.",
        "• Mengintegrasikan semua sinyal M3 dalam capstone: fitur anomaly, cluster, graph, velocity, Benford, behavioral, peer, dan drift — dengan cutoff waktu yang keras — lalu membaca stabilitasnya antarperiode.",
        "• Membaca kurva keputusan EV(k): dari 8 titik antrean GBM M3.5, menentukan k dari biaya review dan kapasitas — bukan dari angka bulat.",
        "Isi lesson: cerita 10.000 alert → precision@k → expected value & ranking vs acak → EV marginal & antrean optimal → fairness alert → Siskamling → 2 lab → capstone integrasi → kurva keputusan → peta keputusan & mini-case → guided task di Colab → checkpoint.",
        "Angka acuan lesson ini datang dari notebook M3.5 [notebook]: dataset UCI 30.000 nasabah, test set 6.000 nasabah (1.327 default). Modelnya GBM M3.5 [notebook] — HistGradientBoostingClassifier default, train 24.000 / test 6.000, seed 42 — ROC-AUC test 0,7807. PERINGATAN: GBM M3.5 ini konfigurasinya BERBEDA dari GBM kanonis M2.3 (ROC-AUC 0,7823) — keduanya model gradient boosting yang berbeda konfigurasi, jadi JANGAN membandingkan TP/FP-nya dengan angka M2.3 seolah satu eksperimen.",
      ],
      tasks: [],
    },
    {
      id: "cerita",
      eyebrow: "Langkah 2 · Cerita pembuka",
      title: "10.000 alert, 20 analis, 1 hari — mana yang diperiksa dulu?",
      prose: [
        "Senin pagi. Sistem fraud bankmu menghasilkan 10.000 alert semalam — 10.000 transaksi atau nasabah yang ditandai «mencurigakan, perlu diperiksa manusia». Timmu 20 analis. Tiap analis sanggup memeriksa 50 alert sehari dengan teliti [ilustrasi]. Kapasitas hari ini: 20 × 50 = 1.000 alert. Sembilan ribu alert tidak akan tersentuh hari ini — dan sebagian dari mereka adalah fraud sungguhan.",
        "Pertanyaan lesson ini bukan «bagaimana membuat model yang lebih akurat?» — itu M2. Pertanyaannya: dari 10.000 alert itu, 1.000 yang mana yang diperiksa dulu? Urutan memeriksa adalah keputusan ekonomi: alert pertama yang diperiksa haruslah yang paling mungkin fraud — karena tiap jam analis yang dipakai untuk alert yang ternyata sah adalah jam yang tidak dipakai untuk menangkap fraud.",
        "Nilai: di test set UCI 6.000 nasabah, 1.327 di antaranya default (base rate 0,2212) [notebook]. Bila 1.000 alert dipilih acak, ekspektasinya hanya 221 default yang tertangkap. Bila 1.000 alert dipilih dari puncak ranking GBM M3.5 [notebook], yang tertangkap 606 default — hampir tiga kali lipat. Urutan memeriksa mengubah hasil tanpa mengubah modelnya sama sekali.",
        "Baik atau buruk: antrean yang diurutkan model bagus bila ranking-nya memang memisahkan — precision@100 0,8600 di notebook membuktikan 86 dari 100 alert teratas benar-benar default. Buruk bila antreannya diurutkan skor yang tidak terkalibrasi atau kedaluwarsa: analis memeriksa 1.000 alert «teratas» yang isinya nyaris acak, sementara fraud-nya duduk di bawah antrean.",
        "Mitigasi: ukur antrean dengan precision@k dan expected value — bukan dengan akurasi model — dan audit antrean per grup sebelum dipakai. Itulah isi lesson ini.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: model yang akurat otomatis menghasilkan antrean yang bagus",
        type: "pitfall",
        body: "Yang benar: akurasi dan ROC-AUC mengukur model atas SEMUA nasabah; antrean hanya memakai k teratas. Model dengan ROC-AUC tinggi bisa punya precision@100 yang buruk bila skornya menumpuk di tengah. Antrean harus diukur sendiri — dengan precision@k.",
      },
    },
    {
      id: "precision-k",
      eyebrow: "Langkah 3 · Alert queue & precision@k",
      title: "Antrean alert: urutkan, potong di k, hitung precision@k",
      prose: [
        "Alert queue adalah daftar alert yang diurutkan dari skor tertinggi ke terendah, lalu dipotong pada k — kapasitas analis hari itu. Precision@k menjawab satu pertanyaan: dari k alert teratas, berapa proporsi yang benar-benar default? Rumusnya sederhana: precision@k = (jumlah default di k teratas) / k.",
        "Nilai: GBM M3.5 [notebook] pada test set 6.000 nasabah (1.327 default). Precision@100 = 0,8600 — 86 default dari 100 alert teratas. Precision@500 = 0,7260 — 363 default dari 500. Precision@1000 = 0,6060 — 606 default dari 1.000. Tiga angka itu adalah isi antrean pada tiga ukuran antrean yang berbeda.",
        "Gambar mentalnya: bayangkan 6.000 nasabah berbaris dari yang paling dicurigai ke yang paling tidak. Seratus orang pertama di barisan itu 86 persen-nya default. Lima ratus pertama 72,60 persen-nya default. Seribu pertama 60,60 persen-nya default. Makin panjang antrean yang kau ambil, makin encer isinya — karena default yang «mudah» sudah habis di depan, dan yang tersisa makin mirip nasabah biasa.",
        "Baik atau buruk: precision@k bagus bila k-nya sama dengan kapasitas nyata analis — k = 100 bila tim hanya sanggup 100 pemeriksaan, k = 1.000 bila sanggup 1.000. Buruk bila k dipilih karena angkanya bulat atau karena «biasanya segitu»: antrean 1.000 yang kapasitasnya hanya 500 berarti 500 alert terbawah tidak pernah diperiksa — mereka hanya menunda antrean besok.",
        "Mitigasi: tetapkan k dari kapasitas (analis × pemeriksaan per analis), lalu laporkan precision@k itu — bukan precision pada k yang lain. Dan laporkan selalu bersama base rate-nya: base rate test 0,2212 [notebook] adalah pembanding «acak» — precision@100 0,8600 berarti 3,9 kali base rate.",
      ],
      formula: String.raw`\text{precision@k} = \frac{\text{jumlah default di } k \text{ alert teratas}}{k}`,
      formulaNote: "Precision@k: proporsi default di antara k alert teratas antrean. Base rate 0,2212 adalah precision@k yang diharapkan dari antrean acak.",
      tasks: [],
    },
    {
      id: "expected-value",
      eyebrow: "Langkah 4 · Expected value & ranking vs acak",
      title: "Expected value: harga satu antrean — dan mengapa ranking mengalahkan acak",
      prose: [
        "Precision@k bercerita tentang ketepatan; expected value (EV) bercerita tentang uang. Setiap alert yang diperiksa punya biaya review; setiap default yang terlewat (tidak masuk antrean) punya biaya kerugian. EV satu antrean berukuran k adalah: EV = TP × biaya terlewat − k × biaya review. TP adalah jumlah default yang tertangkap di antrean; sisanya adalah biaya.",
        "Nilai — biaya [ilustrasi]: biaya review NT$200 per alert [ilustrasi]; biaya default terlewat = LGD 45% × EAD proxy (mean LIMIT_BAL nasabah default di test = NT$137.579,26 [notebook]) = NT$61.910,67 [ilustrasi] (nilai eksak notebook 61.910,6677). Kedua biaya ini [ilustrasi] — angka pengajaran, bukan tarif bank sungguhan — dan setiap kemunculannya di lesson ini dilabeli [ilustrasi]. Derivasi EV di bawah memakai C = 61.910,67 (dua desimal); hasil EV dibulatkan dari C eksak notebook, jadi derivasi yang ditulis bisa berbeda NT$1 dari nilai yang tercetak — tempat itu ditandai ≈, bukan kesalahan hitung.",
        "Nilai — EV antrean GBM M3.5 [notebook]: top-100: 86 × 61.910,67 − 100 × 200 ≈ NT$5.304.317 (NT$53.043 per alert). Top-500: 363 × 61.910,67 − 500 × 200 ≈ NT$22.373.572 (NT$44.747 per alert). Top-1000: 606 × 61.910,67 − 1.000 × 200 ≈ NT$37.317.865 (NT$37.318 per alert). Total EV naik dengan k — antrean yang lebih panjang menangkap lebih banyak default — tapi EV per alert turun: 53.043 → 44.747 → 37.318. Pola itu adalah inti langkah 5.",
        "Sekarang bandingkan dengan antrean acak — baseline yang jujur. Random-500 (seed 7) [notebook]: 500 alert dipilih acak dari test set hanya menangkap 91 default — di bawah ekspektasi base rate 0,2212 × 500 = 110,6 (≈ −2,2 sd; undian ini kebetulan apes), dan jauh di bawah 363 milik ranking. EV-nya: 91 × 61.910,67 − 500 × 200 ≈ NT$5.533.871. Ranking ≈3,3x lebih bernilai dari ekspektasi acak (EV acak analitik 110,6 × 61.910,67 − 500 × 200 ≈ NT$6.747.320) dan 4,0x terhadap undian seed 7: NT$22.373.572 vs NT$5.533.871 — rasio 4,04. Selisih NT$16.839.701 itu adalah nilai tambah pengurutan: uang yang dihasilkan oleh urutan memeriksa, tanpa mengubah model, tanpa menambah analis.",
        "Kenapa ranking menang sebesar itu? Karena default tidak tersebar merata — 86 dari 1.327 default duduk di 100 alert teratas. Antrean acak mengambil dari mana saja, jadi isinya mengikuti base rate 0,2212; antrean ranking mengambil dari puncak, jadi isinya mengikuti precision@k yang jauh lebih tinggi. Selisih EV-nya adalah selisih jumlah default yang tertangkap dikali biaya terlewat: (363 − 91) × 61.910,67 = 272 × 61.910,67 ≈ NT$16.839.701 [notebook]. (Bukan selisih precision dikali k dikali biaya — itu mencampur ekspektasi base rate dengan undian aktual, dan hasilnya tidak menutup.)",
        "Baik atau buruk: EV bagus bila kedua biayanya dinyatakan eksplisit dan dilabeli — tanpa biaya, «antrean terbaik» tidak terdefinisi. Buruk bila biaya terlewat ditebak diam-diam atau biaya review diabaikan: antrean yang «menangkap paling banyak default» tanpa menghitung biaya review akan selalu memilih antrean sebesar-besarnya, termasuk alert yang biaya memeriksanya melebihi nilai yang diselamatkan.",
        "Mitigasi: tulis kedua biaya di samping setiap angka EV, beri label [ilustrasi] bila itu asumsi pengajaran, dan laporkan selalu baseline acaknya. EV tanpa baseline acak adalah angka yang tidak bisa dinilai — 22,37 juta terdengar besar sampai kau tahu undian acak seed 7 saja menghasilkan 5,53 juta (ekspektasi acaknya 6,75 juta).",
        "Satu pemetaan yang wajib jujur: «default» bukan «fraud». Label operasional yang dipakai untuk menilai antrean harus dibedakan [ilustrasi]: confirmed fraud = positif yang sudah dikonfirmasi investigasi; legitimate after review = negatif yang sudah diperiksa dan dinyatakan sah; unresolved = jangan langsung dinilai negatif — ia belum diputuskan; default tanpa bukti fraud = outcome credit risk, BUKAN fraud; chargeback = proxy fraud dengan caveat (tidak semua chargeback adalah fraud, tidak semua fraud berakhir chargeback).",
        "Contoh dua label, satu antrean [ilustrasi]: 500 alert. Bila «positif» = default, precision = 300/500 = 0,60 dan EV = 300 × 61.910,67 − 500 × 200 = NT$18.473.201. Bila «positif» = confirmed fraud, precision = 60/500 = 0,12 dan EV = 60 × 150.000 − 500 × 500 = NT$8.750.000 — dengan biaya berbeda (biaya fraud terlewat NT$150.000 [ilustrasi], biaya review fraud NT$500 [ilustrasi] karena investigasi lebih dalam). Selisihnya NT$9.723.201 — bukan karena antreannya berubah, melainkan karena label dan biayanya berbeda. Antrean yang «bagus» untuk default bisa jadi antrean yang biasa-biasa saja untuk fraud — dan angka precision/EV tanpa menyebut labelnya adalah angka yang tidak bisa dibandingkan.",
      ],
      formula: String.raw`EV(k) = TP_k \times C_{\text{terlewat}} - k \times C_{\text{review}}`,
      formulaNote: "Expected value antrean berukuran k — versi sederhana: tanpa biaya modal dan tanpa biaya waktu tunggu. C_terlewat = NT$61.910,67 [ilustrasi], C_review = NT$200 [ilustrasi].",
      tasks: [],
      note: {
        title: "Miskonsepsi: antrean dengan total EV tertinggi selalu yang terbaik",
        type: "pitfall",
        body: "Yang benar: total EV naik dengan k selama alert tambahannya masih menangkap default — tapi kapasitas analis terbatas. Antrean «terbaik» adalah yang memaksimalkan EV dalam kapasitas yang ada, bukan yang terbesar tanpa batas. Ukuran optimalnya ditentukan EV marginal — langkah 5.",
      },
    },
    {
      id: "marginal-ev",
      eyebrow: "Langkah 5 · EV marginal & antrean optimal",
      title: "EV marginal: total naik, per alert turun — di mana berhentinya?",
      prose: [
        "Tiga angka EV dari langkah 4 menyimpan pola yang menentukan ukuran antrean: total EV naik dengan k (5,30 jt → 22,37 jt → 37,32 jt), tapi EV per alert turun (53.043 → 44.747 → 37.318). Keduanya benar sekaligus — dan keduanya harus dibaca bersama.",
        "Nilai — EV per blok antrean [notebook]: 100 alert pertama menghasilkan NT$5.304.317, alias NT$53.043 per alert. Alert ke-101 sampai ke-500 (400 alert) menambah 277 default: EV tambahannya 277 × 61.910,67 − 400 × 200 ≈ NT$17.069.255, alias NT$42.673 per alert. Alert ke-501 sampai ke-1.000 (500 alert) menambah 243 default: EV tambahannya 243 × 61.910,67 − 500 × 200 ≈ NT$14.944.293, alias NT$29.889 per alert. Urutannya jelas: 53.043 → 42.673 → 29.889 per alert. Tiap blok antrean berikutnya lebih encer dari sebelumnya — diminishing returns dalam bentuk yang paling harfiah.",
        "Gambar di bawah menunjukkan EV per alert untuk ketiga ukuran antrean, beserta total EV-nya. Baca batangnya dari kiri ke kanan: batang memendek (nilai tiap alert turun), tapi total di bawahnya membesar (nilai seluruh antrean naik). Itulah ketegangan yang harus diputuskan: memanjangkan antrean menambah total nilai, tapi tiap alert tambahan bernilai lebih kecil dari alert sebelumnya.",
        "Kapan berhenti menambah antrean? Bukan pada angka bulat — 500 dan 1.000 hanyalah angka yang nyaman disebut. Berhentilah bila EV marginal satu alert tambahan tidak lagi melebihi biaya marginalnya: biaya review-nya, ditambah biaya waktu analis yang terpakai dan antrean lain yang tertunda. Selama satu alert tambahan masih diharapkan menangkap default senilai lebih dari biaya memeriksanya, antrean itu layak diperpanjang; begitu nilai harapannya jatuh di bawah biaya, berhenti — berapa pun angkanya. Dalam cerita pembuka, kapasitas 1.000 alert per hari adalah batas yang mengikat duluan: antrean top-1.000 (EV NT$37.317.865 [notebook]) adalah antrean hari itu, dan alert ke-1.001 menunggu besok.",
        "Baik atau buruk: EV marginal bagus bila dihitung per blok seperti di atas — ia menunjukkan ke mana nilai itu pergi. Buruk bila hanya total EV yang dilaporkan: total yang selalu naik menggoda untuk memperpanjang antrean tanpa batas, padahal alert tambahannya nyaris tidak bernilai.",
        "Mitigasi: laporkan selalu pasangan angkanya — total EV DAN EV per alert — dan tentukan k dari kapasitas atau dari titik EV marginal sama dengan biaya marginal, bukan dari angka bulat. Rumus EV di sini versi sederhana [ilustrasi]: tanpa biaya modal dan tanpa biaya waktu tunggu — di produksi, keduanya masuk ke biaya marginal.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar EV per alert: top-100 53.043, top-500 44.747, top-1000 37.318; total EV 5,30 juta, 22,37 juta, 37,32 juta">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EV per alert turun, total EV naik — GBM M3.5</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="147.3" x2="52" y2="147.3" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="150" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20.000</text>
<line x1="48" y1="88.7" x2="52" y2="88.7" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="92" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">40.000</text>
<line x1="48" y1="30" x2="52" y2="30" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60.000</text>
<rect x="90" y="50.4" width="60" height="155.6" fill="var(--c1)"/>
<text x="120" y="44" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">53.043</text>
<rect x="210" y="74.7" width="60" height="131.3" fill="var(--c2)"/>
<text x="240" y="68" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">44.747</text>
<rect x="330" y="96.5" width="60" height="109.5" fill="var(--c3)"/>
<text x="360" y="90" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">37.318</text>
<text x="120" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">top-100</text>
<text x="240" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">top-500</text>
<text x="360" y="220" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">top-1000</text>
<text x="120" y="234" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">total NT$5,30 jt</text>
<text x="240" y="234" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">total NT$22,37 jt</text>
<text x="360" y="234" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)">total NT$37,32 jt</text>
</svg>`,
        alt: "Bar EV per alert: top-100 53.043, top-500 44.747, top-1000 37.318; total EV 5,30 juta, 22,37 juta, 37,32 juta.",
        caption: "Cara membaca: tinggi batang = EV per alert (NT$) [notebook]; angka di bawah sumbu = total EV antrean itu. Interpretasi: batang memendek dari kiri ke kanan (53.043 → 44.747 → 37.318) sementara total membesar (5,30 jt → 22,37 jt → 37,32 jt) — diminishing returns: alert tambahan masih bernilai, tapi makin kecil.",
      },
      tasks: [],
    },
    {
      id: "fairness",
      eyebrow: "Langkah 6 · Fairness alert",
      title: "Fairness alert: siapa yang lebih sering kena alert — dan siapa yang lebih sering salah kena?",
      prose: [
        "Antrean yang menguntungkan belum tentu antrean yang adil. Threshold yang sama bisa memperlakukan grup berbeda secara berbeda — dan karena antrean dibentuk dari threshold (atau dari ranking yang dipotong), bias itu langsung menjadi antrean yang bias. Audit fairness alert bertanya dua hal per grup: seberapa sering grup itu masuk antrean (alert rate), dan seberapa sering alert itu salah (false positive rate, FPR).",
        "Nilai — threshold 0,10, GBM M3.5 [notebook]: confusion matrix keseluruhan TP 1.199, FP 2.963, TN 1.710, FN 128 — dari 6.000 nasabah, 4.162 masuk antrean alert (69,4 persen) dan 128 default lolos tanpa alert. Per grup SEX: laki-laki (SEX=1, n=2.402): alert rate 0,7469, FP 1.268, TP 526, FPR 0,6888. Perempuan (SEX=2, n=3.598): alert rate 0,6581, FP 1.695, TP 673, FPR 0,5985. FPR di sini = FP dibagi semua nasabah lancar di grup itu — proporsi orang lancar yang salah kena alert.",
        "Baca kedua selisih itu: laki-laki lebih sering kena alert (0,7469 vs 0,6581 — selisih 0,0888) DAN lebih sering false positive (0,6888 vs 0,5985 — selisih 0,0903). Dari 100 laki-laki yang sebenarnya lancar, hampir 69 kena alert yang salah; dari 100 perempuan yang sebenarnya lancar, hampir 60. Laki-laki menanggung beban pemeriksaan yang lebih besar — dan sebagian besar beban itu adalah pemeriksaan yang sia-sia.",
        "Baik atau buruk: alert rate yang berbeda antar grup belum otomatis berarti diskriminasi — bisa jadi base rate default-nya memang berbeda (laki-laki di test: 561 default dari 2.402, perempuan 766 dari 3.598 — default rate 0,2336 vs 0,2129). Tapi FPR yang berbeda adalah masalah yang lebih tajam: ia mengukur kesalahan, bukan risiko. Dua grup dengan risiko yang sama seharusnya tidak menanggung tingkat kesalahan yang berbeda jauh.",
        "Mitigasi: audit alert rate dan FPR per grup SEBELUM antrean dipakai — bukan sesudah ada komplain. Bila selisih FPR besar, pilihannya ada tiga: threshold berbeda per grup (dengan justifikasi yang didokumentasikan dan disetujui), perbaikan fitur/model untuk grup yang dirugikan, atau reason codes yang membuat tiap alert bisa dipertanggungjawabkan. Dan reason codes itu wajib untuk SEMUA alert yang ditriase — bukan hanya yang diprotes: tiap alert membawa 3 alasan utama berbahasa awam (misal «telat 2 bulan», «limit terpakai 95%», «pembayaran menurun») supaya analis memeriksa dengan konteks, bukan dengan skor buta. Tanpa reason codes, antrean adalah daftar nama; dengan reason codes, antrean adalah daftar kasus.",
      ],
      tasks: [],
      note: {
        title: "Miskonsepsi: fairness berarti alert rate harus sama persis antar grup",
        type: "pitfall",
        body: "Yang benar: alert rate yang sama persis bukan targetnya bila base rate-nya memang berbeda. Yang diaudit adalah kesalahan (FPR) dan alasan di balik tiap alert — dan selisih yang besar harus bisa dijelaskan, bukan disembunyikan.",
      },
    },
    {
      id: "siskamling",
      eyebrow: "Langkah 7 · Siskamling sebagai sistem triase nyata",
      title: "Siskamling: mesin mengurutkan, manusia memutuskan",
      prose: [
        "Semua konsep di atas — ranking, threshold, aturan keras, audit — hidup bersama di satu sistem nyata: Siskamling Digital, sistem triase smishing Indonesia. Ia bukan contoh buatan lesson; ia sistem yang dibangun, diuji, dan didokumentasikan dengan angka yang terverifikasi — dan lesson ini hanya memakai angka yang ada di README-nya, tidak lebih.",
        "Nilai — model operasional CHOSEN: Ensemble Top-3 Terkalibrasi — rata-rata probabilitas terkalibrasi tiga anggota (dua pipeline TF-IDF + LR dan DistilBERT). PR-AUC UCI Inggris 0,986 (test 0,986, val 0,982). Dua ambang: t_close = 0,010 / t_esc = 0,135. Polanya: «mesin mengurutkan, manusia memutuskan» — skor mengurutkan antrean triase, manusia pemegang vonis.",
        "Gambar di bawah adalah peta dua ambang itu. Skor di bawah 0,010 → TUTUP: model cukup yakin pesan itu sah. Skor di antara 0,010 dan 0,135 → PERIKSA: manusia yang memutuskan. Skor di atas 0,135 → ESKALASI. Perhatikan betapa kecilnya kedua ambang itu pada skala 0–1: sistem ini menutup hanya bila model sangat yakin sah, dan mengeskalasi begitu skor melewati 0,135 — sebagian besar rentang skor jatuh ke eskalasi, dan zona «periksa» yang sempit adalah tempat manusia paling dibutuhkan.",
        "Lapisan aturan keras (rules.py): tiga sinyal — S1 tautan, S2 permintaan OTP/PIN/kredensial, S3 ancaman + urgensi. Terpicu hanya bila ≥2 sinyal bersamaan, dan hanya MENAIKKAN band ke ESKALASI; tidak pernah menurunkan, tidak mengubah skor. Syarat ≥2 sinyal itu penting: satu sinyal saja — misal hanya ada tautan — tidak cukup mengeskalasi, karena tautan ada juga di pesan sah. Aturan ini adalah pengaman terhadap model yang terlalu bersemangat, bukan pengganti model.",
        "Sinyal penenang bekerja ke arah sebaliknya, sama konservatifnya: pola resmi berformat jelas (OTP standar tanpa tautan, domain resmi persis, notifikasi transaksi terstruktur) menurunkan band ESKALASI model tepat satu tingkat — tidak pernah AUTO-CLOSE — dan gugur total bila S2/S3 aktif. Pesan yang meminta OTP tidak pernah «ditenangkan», apa pun formatnya.",
        "Dan kejujuran yang wajib ditulis: bobot modelnya sendiri «belum siap produksi» (pernyataan README). PR-AUC 0,986 mengukur ranking pada dataset UCI Inggris — bukan jaminan di pesan Indonesia yang sebenarnya, dan bukan izin untuk menyerahkan vonis ke mesin. Itulah kenapa manusia tetap pemegang vonis, dan kenapa lapisan aturan dirancang hanya menaikkan, tidak pernah menurunkan.",
        "Baik atau buruk: dua ambang + aturan keras bagus bila tiap zona punya pemilik keputusan yang jelas — tutup otomatis hanya di zona model sangat yakin, eskalasi selalu melibatkan manusia, dan aturan tidak pernah bisa membebaskan pesan yang meminta OTP. Buruk bila ambang dipilih dari angka bulat atau aturan bisa menurunkan band: satu pesan smishing yang lolos karena «ditenangkan» lebih mahal dari seribu pesan sah yang diperiksa.",
        "Mitigasi: kunci ambang dari data (t_close dan t_esc di atas bukan angka bulat), kunci aturan agar hanya menaikkan, dan tulis keterbatasan model di samping prestasinya — PR-AUC 0,986 dan «belum siap produksi» adalah dua kalimat yang harus berdiri berdampingan.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Diagram dua ambang Siskamling: skor di bawah 0,010 tutup, 0,010 sampai 0,135 periksa, di atas 0,135 eskalasi">
<text x="240" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">Dua ambang Siskamling: tutup · periksa · eskalasi</text>
<text x="240" y="34" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Skor model 0–1 · skala linear · t_close = 0,010 · t_esc = 0,135</text>
<rect x="52" y="90" width="4.1" height="40" fill="var(--c3)"/>
<rect x="56.1" y="90" width="51.8" height="40" fill="var(--c2)"/>
<rect x="107.9" y="90" width="358.1" height="40" fill="var(--c4)"/>
<line x1="56.1" y1="70" x2="56.1" y2="150" stroke="var(--text)" stroke-width="2" stroke-dasharray="4 3"/>
<line x1="107.9" y1="70" x2="107.9" y2="150" stroke="var(--text)" stroke-width="2" stroke-dasharray="4 3"/>
<text x="56" y="58" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">t_close = 0,010</text>
<text x="108" y="58" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">t_esc = 0,135</text>
<text x="287" y="113" text-anchor="middle" font-size="12" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">ESKALASI</text>
<text x="52" y="146" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<text x="259" y="146" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<text x="466" y="146" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<text x="52" y="168" font-size="11" fill="var(--text)" font-family="var(--font-ui)">skor &lt; 0,010 → TUTUP (model yakin sah)</text>
<text x="52" y="186" font-size="11" fill="var(--text)" font-family="var(--font-ui)">0,010 ≤ skor &lt; 0,135 → PERIKSA manusia</text>
<text x="52" y="204" font-size="11" fill="var(--text)" font-family="var(--font-ui)">skor ≥ 0,135 → ESKALASI</text>
<text x="240" y="222" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Aturan ≥2 sinyal hanya MENAIKKAN ke ESKALASI.</text>
</svg>`,
        alt: "Diagram dua ambang Siskamling: skor di bawah 0,010 tutup, 0,010 sampai 0,135 periksa, di atas 0,135 eskalasi.",
        caption: "Cara membaca: batang = rentang skor 0–1 (skala linear); garis putus-putus = kedua ambang. Interpretasi: zona tutup dan periksa sangat sempit — sistem hanya menutup bila model sangat yakin sah; sebagian besar rentang skor jatuh ke eskalasi, dan zona periksa adalah tempat manusia memutuskan.",
      },
      tasks: [],
    },
    {
      id: "lab1",
      eyebrow: "Langkah 8 · Lab 1",
      title: "Lab: hitung EV antrean dari 10 alert ber-skor",
      prose: [
        "Sekarang giliranmu menghitung EV. Datanya 10 alert yang sudah diurutkan model dari skor tertinggi — 5 di antaranya benar-benar default, 5 lancar. Biaya yang dipakai di lab ini: biaya review NT$200 per alert [ilustrasi], biaya default terlewat NT$61.911 [ilustrasi] — angka BULAT, supaya bisa dihitung tangan. Perhatikan: prosa lesson memakai C = NT$61.910,67 (dua desimal, dari mean LIMIT_BAL eksak), sementara lab memakai 61.911 bulat — expected lab (185.133 / 246.444 / 307.555) dihitung dengan 61.911 dan sudah benar dengan angka itu; jangan campur keduanya.",
        "Skemanya eksplisit: hitung TP dan EV untuk k = 3, k = 6, dan k = 10. Perhatikan apa yang terjadi pada EV per alert: top-3 menangkap 3 default dari 3 alert — sempurna — sementara top-10 menangkap 5 default dari 10 alert. Total EV naik, EV per alert turun — pola yang sama dengan notebook 6.000 nasabah, pada skala yang bisa dihitung tangan.",
        "Tugas ini kecil sengaja: dengan 10 alert kau bisa memeriksa tiap barisnya sendiri, dan tiap angka expected di bawah bisa kau hitung ulang dengan kalkulator sebelum menjalankan kode.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi ev_top_k: TP = jumlah label 1 di alerts[:k], EV = TP × COST_MISSED − k × COST_REVIEW" },
        { id: "t2", text: "Jalankan untuk k = 3, 6, 10 dan baca EV serta EV per alert" },
        { id: "t3", text: "Bandingkan EV per alert ketiganya: total naik, per alert turun — tulis satu kalimat kenapa" },
      ],
      expected: "top-3: TP=3 EV=185133 EV_per_alert=61711.00\ntop-6: TP=4 EV=246444 EV_per_alert=41074.00\ntop-10: TP=5 EV=307555 EV_per_alert=30755.50",
      hints: [
        "TP di k teratas: sum(y for _, y in alerts[:k]).",
        "EV = TP × 61.911 − k × 200 — biaya [ilustrasi] yang sama dengan lesson.",
      ],
      code: {
        starter: `# 10 alert ber-skor, sudah diurutkan dari skor tertinggi (ranking model)
# (skor, label: 1 = default, 0 = lancar)
alerts = [
    (0.92, 1), (0.88, 1), (0.81, 1), (0.76, 0), (0.70, 0),
    (0.65, 1), (0.58, 0), (0.44, 0), (0.31, 1), (0.12, 0),
]
COST_REVIEW = 200       # NT$ per alert [ilustrasi]
COST_MISSED = 61911     # NT$ per default terlewat [ilustrasi]

def ev_top_k(alerts, k):
    tp = 0  # TODO: jumlah label 1 di alerts[:k]
    ev = 0  # TODO: tp * COST_MISSED - k * COST_REVIEW
    return tp, ev

tp3, ev3 = ev_top_k(alerts, 3)
tp6, ev6 = ev_top_k(alerts, 6)
tp10, ev10 = ev_top_k(alerts, 10)
print(f"top-3: TP={tp3} EV={ev3} EV_per_alert={ev3 / 3:.2f}")
print(f"top-6: TP={tp6} EV={ev6} EV_per_alert={ev6 / 6:.2f}")
print(f"top-10: TP={tp10} EV={ev10} EV_per_alert={ev10 / 10:.2f}")`,
        lockLines: 10,
        solution: `# 10 alert ber-skor, sudah diurutkan dari skor tertinggi (ranking model)
# (skor, label: 1 = default, 0 = lancar)
alerts = [
    (0.92, 1), (0.88, 1), (0.81, 1), (0.76, 0), (0.70, 0),
    (0.65, 1), (0.58, 0), (0.44, 0), (0.31, 1), (0.12, 0),
]
COST_REVIEW = 200       # NT$ per alert [ilustrasi]
COST_MISSED = 61911     # NT$ per default terlewat [ilustrasi]

def ev_top_k(alerts, k):
    tp = sum(y for _, y in alerts[:k])
    ev = tp * COST_MISSED - k * COST_REVIEW
    return tp, ev

tp3, ev3 = ev_top_k(alerts, 3)
tp6, ev6 = ev_top_k(alerts, 6)
tp10, ev10 = ev_top_k(alerts, 10)
print(f"top-3: TP={tp3} EV={ev3} EV_per_alert={ev3 / 3:.2f}")
print(f"top-6: TP={tp6} EV={ev6} EV_per_alert={ev6 / 6:.2f}")
print(f"top-10: TP={tp10} EV={ev10} EV_per_alert={ev10 / 10:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "tp3", value: 3, label: "`tp3` seharusnya 3", msg: "Tiga alert teratas semuanya default (skor 0,92, 0,88, 0,81)." },
          { kind: "equal", task: "t1", name: "ev3", value: 185133, label: "`ev3` seharusnya 185133", msg: "EV top-3 = 3 × 61.911 − 3 × 200 = 185.133." },
          { kind: "equal", task: "t2", name: "tp6", value: 4, label: "`tp6` seharusnya 4", msg: "Enam alert teratas menangkap 4 default — alert ke-4 dan ke-5 ternyata lancar." },
          { kind: "equal", task: "t2", name: "ev6", value: 246444, label: "`ev6` seharusnya 246444", msg: "EV top-6 = 4 × 61.911 − 6 × 200 = 246.444." },
          { kind: "stdout_matches", task: "t2", pattern: "top-10: TP=5 EV=307555 EV_per_alert=30755\\.50", label: "Output menampilkan EV top-10", msg: "EV top-10 = 5 × 61.911 − 10 × 200 = 307.555; per alert 30.755,50." },
        ],
      },
    },
    {
      id: "lab2",
      eyebrow: "Langkah 9 · Lab 2",
      title: "Lab: precision@k vs baseline acak",
      prose: [
        "Lab kedua mengukur nilai tambah ranking terhadap lawan yang jujur: acak. Datanya daftar yang sama — 10 alert, 5 default, base rate 0,5000. Antrean acak berukuran k diharapkan menangkap base rate × k default; antrean ranking menangkap TP yang sebenarnya.",
        "Hasilnya: pada k = 3, ranking menangkap 3 default sementara acak diharapkan hanya 1,50 — lift 2,00. Pada k = 6, ranking 4 vs acak 3,00 — lift 1,33. Pada k = 10, keduanya sama: precision 0,5000, lift 1,00 — karena pada k = 10 antreannya mencakup SEMUA alert, ranking tidak lagi punya pilihan. Lift terbesar ada di k kecil: di situlah ranking bekerja paling keras, dan di situlah kapasitas analis yang terbatas paling terbantu.",
        "Pelajaran lab ini: baseline acak bukan formalitas — ia menjawab «berapa yang kudapat tanpa model sama sekali?». Tanpa baseline itu, precision@k 0,6667 di k = 6 tampak lumayan; dengan baseline, kau tahu ia hanya 1,33 kali acak — sementara di k = 3 ia 2,00 kali acak.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi base_rate: proporsi label 1 di seluruh daftar" },
        { id: "t2", text: "Lengkapi per k: tp, precision, expected_random_TP, dan lift" },
        { id: "t3", text: "Bandingkan lift k = 3 vs k = 10: di mana ranking paling bernilai?" },
      ],
      expected: "base rate: 0.5000\nk=3: precision=1.0000 expected_random_TP=1.50 lift=2.00\nk=6: precision=0.6667 expected_random_TP=3.00 lift=1.33\nk=10: precision=0.5000 expected_random_TP=5.00 lift=1.00",
      hints: [
        "Base rate = jumlah label 1 dibagi jumlah alert.",
        "Expected random TP = base_rate × k; lift = precision / base_rate.",
      ],
      code: {
        starter: `# Daftar alert yang sama dengan Lab 1 (sudah terurut oleh model)
alerts = [
    (0.92, 1), (0.88, 1), (0.81, 1), (0.76, 0), (0.70, 0),
    (0.65, 1), (0.58, 0), (0.44, 0), (0.31, 1), (0.12, 0),
]
base_rate = 0.0  # TODO: proporsi label 1 di seluruh daftar
print(f"base rate: {base_rate:.4f}")

for k in (3, 6, 10):
    tp = 0  # TODO: jumlah label 1 di alerts[:k]
    prec = 0.0  # TODO: tp / k
    exp_random = 0.0  # TODO: base_rate * k
    lift = 0.0  # TODO: prec / base_rate
    print(f"k={k}: precision={prec:.4f} expected_random_TP={exp_random:.2f} lift={lift:.2f}")`,
        lockLines: 5,
        solution: `# Daftar alert yang sama dengan Lab 1 (sudah terurut oleh model)
alerts = [
    (0.92, 1), (0.88, 1), (0.81, 1), (0.76, 0), (0.70, 0),
    (0.65, 1), (0.58, 0), (0.44, 0), (0.31, 1), (0.12, 0),
]
base_rate = sum(y for _, y in alerts) / len(alerts)
print(f"base rate: {base_rate:.4f}")

for k in (3, 6, 10):
    tp = sum(y for _, y in alerts[:k])
    prec = tp / k
    exp_random = base_rate * k
    lift = prec / base_rate
    print(f"k={k}: precision={prec:.4f} expected_random_TP={exp_random:.2f} lift={lift:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "base_rate", value: 0.5, tol: 1e-9, label: "`base_rate` seharusnya 0.5", msg: "5 default dari 10 alert — base rate 0,5000." },
          { kind: "stdout_matches", task: "t2", pattern: "k=3: precision=1\\.0000 expected_random_TP=1\\.50 lift=2\\.00", label: "Output menampilkan precision@3 dan lift-nya", msg: "Ranking k = 3 sempurna (3 dari 3) vs acak 1,50 — lift 2,00." },
          { kind: "stdout_matches", task: "t2", pattern: "k=10: precision=0\\.5000 expected_random_TP=5\\.00 lift=1\\.00", label: "Output menampilkan precision@10 dan lift-nya", msg: "Pada k = 10 ranking sama dengan acak — lift 1,00, karena semua alert masuk antrean." },
        ],
      },
    },
    {
      id: "capstone",
      eyebrow: "Langkah 10 · Capstone integrasi",
      title: "Capstone: semua sinyal M3 dalam satu eksperimen — dan stabilitasnya antarperiode",
      prose: [
        "Capstone: semua sinyal M3 dipakai bersama — dalam satu eksperimen, satu cutoff, satu split. Data sintetis [ilustrasi] (seed 42): 2.000 akun, 60 hari, cutoff hari ke-30; SEMUA fitur hanya dari hari 1–30; 120.175 transaksi fitur. Fraud tanam: ring 40 akun (5 device) + burst 30 + drift 30 = 100 akun (5,0%). Train 1.500 (75 fraud) / test 500 (25 fraud), stratified seed 42. Catatan jujur: GBM «23 fitur» di lesson ini adalah fitur kredit kanonis (notebook M3.5) — BUKAN sinyal M3. Capstone ini membangun feature set sendiri dari sinyal M3: anomaly score, cluster profile, degree/component/community, velocity 1j/24j, Benford deviation per segmen, UTIL/PAY_RATIO/BILL_TREND, peer z-score, profile drift.",
        "Cek sinyal fitur dulu [ilustrasi]: max1h akun burst 4,7 vs normal 2,3; BILL_TREND akun drift 1,38 vs normal 1,04; degree akun ring 24,1 vs normal 12,2. Tiap keluarga sinyal memisahkan kelompoknya sendiri — itu prasyaratnya, bukan hasilnya.",
        "Nilai — model bertahap di test 500, periode P1 (hari 31–45) [ilustrasi]; EV100 pakai C 61.910,67 dan review NT$200 [ilustrasi]: (1) baseline transaksi: PR-AUC 0,6105, P@100 0,22, R@100 0,8800, EV100 NT$1.342.035, FPR@100 laki 0,2283 / perempuan 0,1237. (2) +behavioral: 0,6199, 0,21, 0,8400, NT$1.280.124, 0,2228/0,1306. (3) +graph: 0,8081, 0,24, 0,9600, NT$1.465.856, 0,2065/0,1306. (4) +velocity: 0,8415, 0,25, 1,0000, NT$1.527.767, 0,1957/0,1340. (5) +anomaly: 0,8577, 0,25, 1,0000, NT$1.527.767, 0,1902/0,1375. (6) full (+profile): 0,8397, 0,25, 1,0000, NT$1.527.767, 0,2011/0,1306.",
        "Baca bertahapnya: +behavioral nyaris tidak menambah (0,6105 → 0,6199); +graph melompat (+0,19) — ring terlihat dari device; +velocity menambah lagi (0,8415) — burst terlihat dari kecepatan; +anomaly sedikit lagi (0,8577). Dan full model TIDAK menang: 0,8397, di bawah +anomaly 0,8577 — profil peer/drift tidak menambah di atas velocity+anomaly di data ini. Lebih banyak fitur ≠ lebih baik; yang diukur adalah tambahan tiap keluarga fitur, bukan jumlahnya. Gambar di bawah membandingkan PR-AUC keenam tahap di P1.",
        "Stabilitas antarperiode — model yang sama, periode berikutnya P2 (hari 46–60) [ilustrasi]: label P2 = 90 fraud (ring 40 + burst 35 + drift 15); 25 akun berhenti (10 burst + 15 drift kembali normal), 15 akun baru (burst yang baru mulai). Model full: PR-AUC 0,4137 (dari 0,8397), P@100 0,20, R@100 0,8000, EV100 NT$1.218.213, FPR@100 laki 0,2077 / perempuan 0,1438. Di P2 pun +anomaly (0,4375) di atas full (0,4137). Penyebab jatuhnya: 15 akun burst BARU di P2 yang sinyalnya belum ada sebelum cutoff (model tidak bisa melihat masa depan), 25 akun yang berhenti, dan pola drift yang berubah. Dan satu pelajaran tentang ambang label: aturan sederhana «rata-rata nominal ≥1,5× baseline» menangkap 13 dari 30 drift di P1 dan 14 dari 15 di P2 — tapi 31 akun normal ikut melewati ambang di P2. Aturan yang dipakai mendefinisikan label harus diuji seperti model: dengan false positive-nya.",
        "Fairness: FPR@100 model full di P1 laki 0,2011 vs perempuan 0,1306; di P2 0,2077 vs 0,1438. Model TIDAK memakai SEX sebagai fitur — selisih ini muncul dari ranking dan komposisi test (500 akun, 25 fraud): dengan sampel sekecil ini, selisih 0,07 bisa jadi noise. Audit yang baik mencatat selisihnya, mengecek apakah ia bertahan di sampel yang lebih besar dan di periode berikutnya (di P2 selisihnya masih ada, dengan arah yang sama), dan baru menyimpulkan setelah itu — bukan langsung menyimpulkan diskriminasi, bukan pula mengabaikannya.",
        "Tiap alert membawa minimal 3 reason codes. Lima alert teratas model full di test [ilustrasi]: akun 105 (fraud, skor 1,000; 8 reason codes): degree 17 (median normal 11), UTIL 0,68, z UTIL 4,21, anomali 0,57 (top 5%), community 175, drift +4,7%. Akun 1853 (fraud, 1,000; 6 codes): velocity 1 jam 6, velocity 24 jam 11, degree 10, BILL_TREND 1,21, community 59. Akun 335 (fraud, 1,000; 7 codes): degree 25, BILL_TREND 2,04, UTIL 0,87, transaksi terbesar NT$109.305, anomali 0,63, community 52. Akun 1949 (fraud, 1,000; 8 codes): velocity 24 jam 10, degree 10, BILL_TREND 1,80, z 3,47, anomali 0,57, community 17, drift +2,6%. Akun 1374 (fraud, 0,999; 9 codes): degree 26, UTIL 0,57, PAY_RATIO 0,21, transaksi terbesar NT$155.789, z 3,07, anomali 0,65, community 44, drift +3,3%. Catatan: community sampai 175 karena jembatan second-device membentuk giant component — community size yang besar di sini bukan «kelompok padat», melainkan efek jembatan; itulah kenapa community_size selalu dibaca bersama internal_density (M3.2).",
        "Baik atau buruk: capstone bagus bila ia memaksa semua sinyal bersaing dalam satu eksperimen yang sama — cutoff, split, dan metrik yang sama — sehingga tambahan tiap keluarga fitur bisa dibaca. Buruk bila dibaca sebagai «model final»: ini data sintetis dengan 100 fraud tanam, dan stabilitas P2 menunjukkan model ini akan merosot di periode berikutnya bila pola fraud bergeser.",
        "Mitigasi: laporkan selalu pasangan P1 dan P2 berdampingan — model yang hanya bagus di satu periode belum terbukti stabil; audit FPR per grup di kedua periode; dan tempelkan reason codes pada tiap alert — tanpa itu, antrean adalah daftar nama.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Bar PR-AUC P1 per tahap capstone: baseline 0,6105; behavioral 0,6199; graph 0,8081; velocity 0,8415; anomaly 0,8577; full 0,8397">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">PR-AUC P1 per tahap — full tidak menang</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="162.0" x2="52" y2="162.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="165.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,25</text>
<line x1="48" y1="118.0" x2="52" y2="118.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="121.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text>
<line x1="48" y1="74.0" x2="52" y2="74.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="77.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0,75</text>
<line x1="48" y1="30.0" x2="52" y2="30.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="33.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1</text>
<rect x="66" y="98.6" width="40" height="107.4" fill="var(--c1)"/>
<text x="86" y="94.6" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6105</text>
<text x="86" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">1 base</text>
<rect x="118" y="96.9" width="40" height="109.1" fill="var(--c1)"/>
<text x="138" y="92.9" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,6199</text>
<text x="138" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">2 +beh</text>
<rect x="170" y="63.8" width="40" height="142.2" fill="var(--c1)"/>
<text x="190" y="59.8" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8081</text>
<text x="190" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">3 +graph</text>
<rect x="222" y="57.9" width="40" height="148.1" fill="var(--c1)"/>
<text x="242" y="53.9" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8415</text>
<text x="242" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">4 +vel</text>
<rect x="274" y="55.0" width="40" height="151.0" fill="var(--c4)"/>
<text x="294" y="51.0" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8577</text>
<text x="294" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">5 +anom</text>
<rect x="326" y="58.2" width="40" height="147.8" fill="var(--c2)"/>
<text x="346" y="54.2" text-anchor="middle" font-size="10" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">0,8397</text>
<text x="346" y="222" text-anchor="middle" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">6 full</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Test 500, P1 (hari 31–45) [ilustrasi] · +graph lompat +0,19; full (0,8397) di bawah +anomaly (0,8577).</text>
</svg>`,
        alt: "Bar PR-AUC P1 per tahap capstone: baseline 0,6105; behavioral 0,6199; graph 0,8081; velocity 0,8415; anomaly 0,8577; full 0,8397.",
        caption: "Cara membaca: tiap bar = PR-AUC test di P1 (hari 31–45) [ilustrasi]. Interpretasi: +graph melompat paling besar (+0,19); +anomaly tertinggi (0,8577); full model (0,8397) TIDAK menang — profil peer/drift tidak menambah di atas velocity+anomaly di data ini.",
      },
      tasks: [],
      note: {
        title: "Miskonsepsi: model full (semua fitur) pasti yang terbaik",
        type: "pitfall",
        body: "Yang benar: di capstone ini full 0,8397 di bawah +anomaly 0,8577 di P1, dan 0,4137 di bawah 0,4375 di P2. Fitur tambahan yang tidak membawa sinyal baru hanya menambah noise dan drift — model terbaik adalah yang tambahannya terbukti, bukan yang fiturnya terbanyak.",
      },
    },
    {
      id: "kurva-keputusan",
      eyebrow: "Langkah 11 · Kurva keputusan",
      title: "Kurva keputusan: EV(k) dari k = 100 sampai 6.000 — dan di mana berhentinya",
      prose: [
        "Langkah 4–5 memakai 3 titik (k = 100/500/1.000). Langkah ini memakai kurva penuh: GBM M3.5 yang sama, diurutkan 6.000 skornya, k dari 100 sampai 6.000 [notebook]. Tabel 8 titiknya [notebook, C eksak 61.910,6677 — bukan 61.910,67 dua desimal, supaya EV cocok dengan angka kanonis lesson]: k = 100: TP 86, P 0,8600, R 0,0648, EV 5.304.317, marginal/blok 53.043. k = 500: TP 363, P 0,7260, R 0,2735, EV 22.373.572, 42.673. k = 1.000: TP 606, P 0,6060, R 0,4567, EV 37.317.865, 29.889. k = 2.000: TP 875, P 0,4375, R 0,6594, EV 53.771.834, 16.454. k = 3.000: TP 1.055, P 0,3517, R 0,7950, EV 64.715.754, 10.944. k = 4.000: TP 1.180, P 0,2950, R 0,8892, EV 72.254.588, 7.539. k = 5.000: TP 1.277, P 0,2554, R 0,9623, EV 78.059.923, 5.805. k = 6.000: TP 1.327, P 0,2212, R 1,0000, EV 80.955.456, 2.896.",
        "Baca kurvanya: EV(k) NAIK terus sampai k = 6.000 (80,96 jt) — karena tiap alert tambahan masih menangkap default yang nilainya melebihi biaya review NT$200 [ilustrasi]. Tapi EV marginal per blok JATUH: 53.043 → 42.673 → 29.889 → 16.454 → 10.944 → 7.539 → 5.805 → 2.896. Dan recall naik 0,0648 → 1,0000: di k = 6.000 semua 1.327 default tertangkap — tapi dengan memeriksa SEMUA nasabah, precision = base rate 0,2212.",
        "Presisi impas = C_REV/C_MISS [ilustrasi]: NT$200 → 0,00323; NT$1.000 → 0,01615; NT$5.000 → 0,08076. Selama presisi lokal (sekitar k) di atas impas, alert tambahan masih menguntungkan. Presisi lokal jatuh di bawah impas pertama kali: review NT$200 → tidak pernah sampai k = 6.000 (kapasitas yang mengikat duluan); NT$1.000 → k = 5.725 (EV marginal −387); NT$5.000 → k = 2.845 (EV marginal −96). Biaya review yang naik 25× (200 → 5.000) memotong antrean optimal lebih dari separuh (6.000 → 2.845).",
        "Workload: @50 alert/analis/hari — k = 500 → 10 analis-hari; k = 1.000 → 20; k = 6.000 → 120. Di cerita pembuka (20 analis), k = 1.000 adalah satu hari kerja; k = 6.000 adalah 6 hari kerja. Kurva EV tidak menjawab «berapa k» sendirian — ia menjawab bersama kapasitas dan biaya.",
        "Lab kecil di langkah ini (tugas t1–t3 di bawah): dari tabel 8 titik, hitung EV(k) dengan C eksak, hitung EV marginal per blok dan temukan blok pertama yang di bawah NT$5.000, lalu pilih kebijakan (k + alasan bisnisnya) untuk kapasitas 1.000 alert/hari.",
        "Baik atau buruk: kurva keputusan bagus bila ia memaksa memilih k dengan angka — bukan dengan «biasanya». Buruk bila dibaca tanpa kapasitas: EV(k) yang terus naik menggoda memperpanjang antrean melewati kapasitas tim.",
        "Mitigasi: laporkan selalu tiga angka bersamaan — EV(k), EV marginal per blok, dan workload (analis-hari) — dan tentukan k dari biaya marginal DAN kapasitas, bukan dari angka bulat.",
      ],
      figure: {
        svg: `<svg viewBox="0 0 480 240" role="img" aria-label="Kurva EV total GBM M3.5: naik dari 5,30 juta di k=100 ke 80,96 juta di k=6000; garis kapasitas 500 dan 1000">
<text x="240.0" y="16" text-anchor="middle" font-size="13" fill="var(--text)" font-family="var(--font-ui)" font-weight="600">EV(k) naik terus — tapi EV marginal per blok jatuh</text>
<line x1="52" y1="30" x2="52" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="52" y1="206" x2="466" y2="206" stroke="var(--chart-text)" stroke-width="1"/>
<line x1="48" y1="206.0" x2="52" y2="206.0" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="209.0" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">0</text>
<line x1="48" y1="164.6" x2="52" y2="164.6" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="167.6" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">20 jt</text>
<line x1="48" y1="123.2" x2="52" y2="123.2" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="126.2" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">40 jt</text>
<line x1="48" y1="81.8" x2="52" y2="81.8" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="84.8" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">60 jt</text>
<line x1="48" y1="40.4" x2="52" y2="40.4" stroke="var(--chart-text)" stroke-width="1"/>
<text x="44" y="43.4" text-anchor="end" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">80 jt</text>
<line x1="86.5" y1="30" x2="86.5" y2="206" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="86.5" y="222" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">k=500</text>
<line x1="121" y1="30" x2="121" y2="206" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="121" y="222" text-anchor="middle" font-size="10" fill="var(--c4)" font-family="var(--font-ui)">k=1.000</text>
<polyline points="58.9,195.0 86.5,159.7 121,128.7 190,94.7 259,72.0 328,56.4 397,44.3 466,38.3" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<circle cx="58.9" cy="195.0" r="3.5" fill="var(--c1)"/>
<circle cx="86.5" cy="159.7" r="3.5" fill="var(--c1)"/>
<circle cx="121" cy="128.7" r="3.5" fill="var(--c1)"/>
<circle cx="190" cy="94.7" r="3.5" fill="var(--c1)"/>
<circle cx="259" cy="72.0" r="3.5" fill="var(--c1)"/>
<circle cx="328" cy="56.4" r="3.5" fill="var(--c1)"/>
<circle cx="397" cy="44.3" r="3.5" fill="var(--c1)"/>
<circle cx="466" cy="38.3" r="3.5" fill="var(--c1)"/>
<text x="58.9" y="186.0" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">5,30 jt</text>
<text x="190" y="86.0" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">53,77 jt</text>
<text x="397" y="36.0" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">78,06 jt</text>
<text x="466" y="30.0" text-anchor="middle" font-size="9" fill="var(--chart-text)" font-family="var(--font-ui)">80,96 jt</text>
<text x="240" y="236" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Garis putus-putus = kapasitas 500 dan 1.000 alert · EV naik, marginal per blok jatuh 53.043 → 2.896.</text>
</svg>`,
        alt: "Kurva EV total GBM M3.5: naik dari 5,30 juta di k=100 ke 80,96 juta di k=6000; garis kapasitas 500 dan 1000.",
        caption: "Cara membaca: sumbu X = ukuran antrean k, sumbu Y = total EV (NT$) [notebook]; garis putus-putus = kapasitas 500 dan 1.000 alert. Interpretasi: EV(k) naik terus sampai 80,96 jt di k = 6.000 — tapi EV marginal per blok jatuh 53.043 → 2.896, dan k = 6.000 berarti 120 analis-hari. Antrean optimal ditentukan biaya marginal dan kapasitas, bukan EV total.",
      },
      tasks: [
        { id: "t1", text: "Hitung EV(k) untuk 8 titik dengan C_MISS eksak 61.910,6677 dan C_REV 200 [ilustrasi]" },
        { id: "t2", text: "Hitung EV marginal per blok dan temukan blok pertama yang di bawah NT$5.000" },
        { id: "t3", text: "Pilih kebijakan: kapasitas 1.000 alert/hari, 50 alert/analis/hari — k berapa, recall berapa, EV berapa, workload berapa?" },
      ],
      expected: "k=100: TP=86 EV=5304317\nk=500: TP=363 EV=22373572\nk=1000: TP=606 EV=37317865\nk=2000: TP=875 EV=53771834\nk=3000: TP=1055 EV=64715754\nk=4000: TP=1180 EV=72254588\nk=5000: TP=1277 EV=78059923\nk=6000: TP=1327 EV=80955456\nblok pertama EV marginal < 5000: 5000->6000 (2.896 per alert)\nkebijakan: k=1000 recall=0.4567 EV=37317865 workload=20 analis-hari",
      hints: [
        "EV = TP × 61.910,6677 − k × 200 — C eksak notebook (bukan 61.910,67 dua desimal), bulatkan dengan round().",
        "EV marginal per blok = (EV[i] − EV[i−1]) / (k[i] − k[i−1]) — blok pertama di bawah 5.000 adalah 5000→6000.",
        "Kebijakan: kapasitas 1.000 mengikat duluan — k = 1.000, recall = 606/1.327, workload = 1.000/50 analis-hari.",
      ],
      code: {
        starter: `# Kurva keputusan GBM M3.5 [notebook]: 8 titik k, TP dari ranking
k_list = [100, 500, 1000, 2000, 3000, 4000, 5000, 6000]
tp_list = [86, 363, 606, 875, 1055, 1180, 1277, 1327]
COST_MISSED = 61910.6677  # NT$ eksak notebook [notebook]
COST_REVIEW = 200         # NT$ per alert [ilustrasi]
TOTAL_DEFAULT = 1327

def idr(n):
    return f"{n:,}".replace(",", ".")

ev_list = [0 for _ in k_list]  # TODO t1: EV tiap k = TP * COST_MISSED - k * COST_REVIEW (bulatkan)
for k, tp in zip(k_list, tp_list):
    print(f"k={k}: TP={tp} EV={ev_list[k_list.index(k)]}")
# EV marginal per blok
marg = [0 for _ in range(len(k_list) - 1)]  # TODO t2: (EV[i] - EV[i-1]) / (k[i] - k[i-1])
first_below = "?"  # TODO t2: blok pertama yang marginalnya < 5000, format "5000->6000"
print(f"blok pertama EV marginal < 5000: {first_below} ({idr(round(marg[-1]))} per alert)")
# Kebijakan: kapasitas 1.000 alert/hari [ilustrasi], 50 alert/analis/hari
k_pol = 1000  # TODO t3: pilih k (kapasitas mengikat duluan)
i_pol = k_list.index(k_pol)
rec = 0.0  # TODO t3: recall = TP / TOTAL_DEFAULT
print(f"kebijakan: k={k_pol} recall={rec:.4f} EV={ev_list[i_pol]} workload={k_pol // 50} analis-hari")`,
        lockLines: 9,
        solution: `# Kurva keputusan GBM M3.5 [notebook]: 8 titik k, TP dari ranking
k_list = [100, 500, 1000, 2000, 3000, 4000, 5000, 6000]
tp_list = [86, 363, 606, 875, 1055, 1180, 1277, 1327]
COST_MISSED = 61910.6677  # NT$ eksak notebook [notebook]
COST_REVIEW = 200         # NT$ per alert [ilustrasi]
TOTAL_DEFAULT = 1327

def idr(n):
    return f"{n:,}".replace(",", ".")

ev_list = [round(tp * COST_MISSED - k * COST_REVIEW) for tp, k in zip(tp_list, k_list)]
for k, tp in zip(k_list, tp_list):
    print(f"k={k}: TP={tp} EV={ev_list[k_list.index(k)]}")
# EV marginal per blok
marg = [(ev_list[i] - ev_list[i - 1]) / (k_list[i] - k_list[i - 1]) for i in range(1, len(k_list))]
first_below = ""
for i, m in enumerate(marg):
    if m < 5000:
        first_below = f"{k_list[i]}->{k_list[i + 1]}"
        break
print(f"blok pertama EV marginal < 5000: {first_below} ({idr(round(marg[-1]))} per alert)")
# Kebijakan: kapasitas 1.000 alert/hari [ilustrasi], 50 alert/analis/hari
k_pol = 1000
i_pol = k_list.index(k_pol)
rec = tp_list[i_pol] / TOTAL_DEFAULT
print(f"kebijakan: k={k_pol} recall={rec:.4f} EV={ev_list[i_pol]} workload={k_pol // 50} analis-hari")`,
        checks: [
          { kind: "equal", task: "t1", name: "ev_list", value: [5304317, 22373572, 37317865, 53771834, 64715754, 72254588, 78059923, 80955456], label: "`ev_list` seharusnya [5.304.317, 22.373.572, 37.317.865, 53.771.834, 64.715.754, 72.254.588, 78.059.923, 80.955.456]", msg: "EV(k) dengan C eksak 61.910,6677 — cocok dengan tabel kanonis lesson (dibulatkan)." },
          { kind: "equal", task: "t2", name: "first_below", value: "5000->6000", label: "`first_below` seharusnya \"5000->6000\"", msg: "Blok 5000→6000 pertama kali di bawah NT$5.000 per alert (2.896) — semua blok sebelumnya masih di atas 5.000." },
          { kind: "stdout_matches", task: "t3", pattern: "kebijakan: k=1000 recall=0\\.4567 EV=37317865 workload=20 analis-hari", label: "Output menampilkan kebijakan k=1000", msg: "Kapasitas 1.000 mengikat duluan: recall 0,4567, EV NT$37.317.865, workload 20 analis-hari." },
        ],
      },
    },
    {
      id: "peta-minicase",
      eyebrow: "Langkah 12 · Peta keputusan & mini-case",
      title: "Peta keputusan & mini-case: 1.000 alert hari ini",
      prose: [
        "Peta keputusan — kapan memakai apa. Kapasitas analis lebih kecil dari jumlah alert? Urutkan dengan ranking dan potong di kapasitas — jangan periksa acak, jangan periksa berdasarkan urutan datang. Tidak tahu ranking-nya bagus atau tidak? Ukur precision@k pada k = kapasitas, bukan ROC-AUC. Mau tahu antrean itu sepadan biayanya? Hitung EV dengan kedua biaya dinyatakan eksplisit [ilustrasi]. Mau tahu ukuran antrean yang optimal? Hitung EV marginal per blok — berhenti saat nilai harapan alert tambahan jatuh di bawah biaya marginalnya. Khawatir antrean bias? Audit alert rate dan FPR per grup sebelum dipakai, dan tempelkan reason codes pada tiap alert.",
        "Mini-case — kembali ke cerita pembuka: 10.000 alert, 20 analis, kapasitas 1.000 pemeriksaan sehari [ilustrasi]. Antrean top-1.000 dari GBM M3.5 [notebook] menangkap 606 default dengan EV NT$37.317.865 [notebook]. Bila 1.000 alert itu diisi acak, ekspektasinya 0,2212 × 1.000 = 221,2 default — EV ekspektasi 221,2 × 61.910,67 − 1.000 × 200 ≈ NT$13.494.640 [ilustrasi, ekspektasi]. Selisihnya ≈ NT$23,8 juta dalam satu hari — itulah harga urutan memeriksa.",
        "Dan keputusan keduanya: besok pagi, apakah antrean diperpanjang ke 1.500? Alert ke-1.001 sampai ke-1.500 punya precision yang lebih rendah dari blok 501–1.000 (29.889 per alert) — EV marginalnya masih positif dalam rumus sederhana ini, tapi kapasitas hari itu sudah habis di 1.000. Jawabannya bukan «tambah terus», melainkan «tambah analis, atau terima 1.000 sebagai antrean hari ini dan biarkan ranking menentukan 1.000 yang mana». Antrean optimal ditentukan kapasitas dan biaya marginal — bukan angka bulat, bukan pula «sebanyak-banyaknya».",
      ],
      tasks: [],
    },
    {
      id: "colab",
      eyebrow: "Langkah 13 · Guided task di Colab",
      title: "Guided task di Colab: antrean GBM M3.5 di data UCI 30.000 nasabah",
      prose: [
        "Lesson web ini mengajarkan konsep dan lab singkat pada 10 alert. Guided task-nya — langkah demi langkah dengan checks — tinggal di Colab, di notebook mlf-m35-guided-task.ipynb.",
        "Di notebook itu kamu memuat dataset UCI yang sesungguhnya (30.000 nasabah), melatih HistGradientBoostingClassifier default dengan 23 fitur (train 24.000 / test 6.000, seed 42), menghitung precision@100/500/1000 (0,8600 / 0,7260 / 0,6060), menghitung EV tiap antrean dengan biaya [ilustrasi] yang sama dengan lesson, membandingkannya dengan baseline acak seed 7 (91 default, EV NT$5.533.871), lalu mengaudit fairness alert per grup SEX pada threshold 0,10 — lengkap dengan checks yang menegaskan tiap langkah.",
        "Tautan Colab:",
        "https://colab.research.google.com/drive/1kSvpmi-hVoKizQPeS-m8NVEh0d0NdbC9",
        "Jalur file notebook: colab/mlf-m35-guided-task.ipynb.",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Langkah 14 · Checkpoint",
      title: "Checkpoint: antrean yang paling mahal didahulukan",
      prose: [
        "Rangkuman: antrean alert adalah ranking yang dipotong di kapasitas analis; precision@k mengukur isinya. EV antrean = TP × biaya terlewat − k × biaya review (biaya [ilustrasi]). Ranking 4,0x lebih bernilai dari undian acak seed 7 pada top-500 (NT$22.373.572 vs NT$5.533.871; 3,3x terhadap ekspektasi acak NT$6.747.320). Total EV naik dengan k tapi EV per alert turun (53.043 → 44.747 → 37.318) — antrean optimal ditentukan EV marginal, bukan angka bulat. Laki-laki lebih sering kena alert dan lebih sering false positive — audit per grup wajib sebelum antrean dipakai. Siskamling: dua ambang, aturan ≥2 sinyal yang hanya menaikkan, manusia pemegang vonis — dan bobot modelnya «belum siap produksi».",
      ],
      tasks: [],
      quiz: [
        {
          q: "Top-500 GBM M3.5 menangkap TP = 363 default. Biaya terlewat NT$61.910,67 [ilustrasi], biaya review NT$200 [ilustrasi] per alert. Berapa EV top-500?",
          options: [
            { text: "NT$22.473.573", why: "Itu 363 × 61.910,67 tanpa mengurangi biaya review — EV = TP × biaya terlewat − k × biaya review.", },
            { text: "NT$22.373.572", why: "Benar: 363 × 61.910,67 − 500 × 200 ≈ NT$22.373.572 (produknya 22.473.573, dikurangi 100.000; selisih NT$1 dari pembulatan C eksak — lihat langkah 4).", correct: true },
            { text: "NT$5.533.871", why: "Itu EV random-500 (91 default) — bukan EV top-500 ranking.", },
            { text: "NT$37.317.865", why: "Itu EV top-1.000 (606 default) — bukan top-500.", },
          ],
        },
        {
          q: "Mengapa antrean ranking top-500 (EV NT$22.373.572) bernilai 4,0x lipat dari undian acak-500 seed 7 (EV NT$5.533.871)?",
          options: [
            { text: "Karena ranking memeriksa 4x lebih banyak alert", why: "Keduanya memeriksa 500 alert yang sama banyaknya — yang berbeda isinya, bukan jumlahnya.", },
            { text: "Karena default menumpuk di puncak ranking, sementara acak hanya mendapat base rate", why: "Benar: ranking menangkap 363 default vs 91 milik acak — default tidak tersebar merata, dan ranking mengambil dari tempat mereka menumpuk.", correct: true },
            { text: "Karena biaya review antrean acak 4x lebih mahal", why: "Biaya review-nya sama: NT$200 per alert [ilustrasi] untuk keduanya.", },
            { text: "Karena model ranking memakai 4x lebih banyak fitur", why: "Keduanya memakai model dan fitur yang sama — yang berbeda hanya urutan memeriksa.", },
          ],
        },
        {
          q: "Total EV naik dari top-500 (NT$22,37 jt) ke top-1.000 (NT$37,32 jt) sementara EV per alert turun (44.747 → 37.318). Kapan berhenti menambah antrean?",
          options: [
            { text: "Berhenti di 500 karena EV per alert turun", why: "EV per alert yang turun bukan alasan berhenti — total EV masih naik 14,94 juta dari blok 501–1.000.", },
            { text: "Tambah sampai 1.000 karena itu angka bulat", why: "Angka bulat bukan alasan ekonomi — 1.000 dipilih karena kapasitas 20 analis × 50, bukan karena bulat.", },
            { text: "Selama EV marginal satu alert tambahan masih melebihi biaya marginalnya", why: "Benar: antrean optimal ditentukan biaya marginal — tambah selama nilai harapan alert berikutnya melebihi biaya memeriksanya (termasuk waktu analis).", correct: true },
            { text: "Periksa semua 6.000 nasabah — EV selalu positif", why: "Kapasitas analis terbatas (1.000/hari [ilustrasi]) dan rumus EV ini versi sederhana tanpa biaya waktu tunggu — «sebanyak-banyaknya» bukan keputusan.", },
          ],
        },
        {
          q: "Pada threshold 0,10, FPR laki-laki 0,6888 vs perempuan 0,5985. Apa artinya?",
          options: [
            { text: "68,88% laki-laki adalah default", why: "FPR bukan default rate — default rate laki-laki 0,2336. FPR mengukur kesalahan pada yang lancar.", },
            { text: "Dari laki-laki yang sebenarnya lancar, 68,88% salah kena alert — lebih tinggi dari perempuan (59,85%)", why: "Benar: FPR = FP dibagi semua yang lancar di grup itu. Laki-laki menanggung tingkat false positive yang lebih tinggi — audit sebelum antrean dipakai.", correct: true },
            { text: "Laki-laki 68,88% lebih sering default dari perempuan", why: "Default rate laki-laki 0,2336 vs perempuan 0,2129 — selisihnya kecil, bukan 68,88%.", },
            { text: "Alert rate laki-laki 68,88%", why: "Alert rate laki-laki 0,7469 — 0,6888 adalah FPR, bukan alert rate.", },
          ],
        },
        {
          q: "Di Siskamling, lapisan aturan keras terpicu bila ≥2 sinyal (S1/S2/S3) bersamaan. Apa yang dilakukannya?",
          options: [
            { text: "Menurunkan band ke TUTUP bila pesannya tampak sah", why: "Aturan keras tidak pernah menurunkan band — hanya menaikkan.", },
            { text: "Hanya menaikkan band ke ESKALASI; tidak pernah menurunkan, tidak mengubah skor", why: "Benar: ≥2 sinyal bersamaan hanya menaikkan band ke ESKALASI — satu sinyal saja tidak cukup, dan skor model tidak disentuh.", correct: true },
            { text: "Mengubah skor model menjadi 1,0", why: "Aturan tidak mengubah skor — skor tetap milik model; yang berubah hanya band kebijakannya.", },
            { text: "Menutup pesan otomatis bila S2 aktif", why: "Kebalikannya: S2 (permintaan OTP/PIN/kredensial) justru menggugurkan sinyal penenang — pesan seperti itu tidak pernah «ditenangkan».", },
          ],
        },
        {
          q: "Sinyal penenang di Siskamling menurunkan band ESKALASI model tepat satu tingkat. Kapan ia TIDAK berlaku?",
          options: [
            { text: "Bila pesannya mengandung tautan (S1) saja", why: "S1 saja tidak menggugurkan penenang — yang menggugurkan adalah S2/S3 aktif.", },
            { text: "Bila S2/S3 aktif — gugur total; dan ia tidak pernah AUTO-CLOSE", why: "Benar: penenang gugur total bila S2 (OTP/PIN/kredensial) atau S3 (ancaman + urgensi) aktif, dan penenang tidak pernah menutup pesan otomatis.", correct: true },
            { text: "Bila skor model di bawah t_close", why: "Di bawah t_close pesan sudah TUTUP oleh model — penenang tidak relevan di sana.", },
            { text: "Bila pesannya berbahasa Inggris", why: "Bahasa bukan syarat penenang — syaratnya pola resmi berformat jelas, dan tidak adanya S2/S3.", },
          ],
        },
        {
          q: "Precision@100 = 0,8600 tetapi precision@1.000 = 0,6060. Mengapa precision turun saat antrean diperpanjang?",
          options: [
            { text: "Karena modelnya memburuk pada k besar", why: "Modelnya sama — yang berubah adalah alert tambahannya: makin jauh dari puncak ranking, makin banyak yang lancar.", },
            { text: "Karena default yang «mudah» sudah habis di depan; alert tambahan makin mirip nasabah biasa", why: "Benar: 86 default teratas terkonsentrasi di 100 pertama; alert ke-501–1.000 hanya menambah 243 default dari 500 alert — encer.", correct: true },
            { text: "Karena base rate turun saat k naik", why: "Base rate test tetap 0,2212 berapa pun k-nya — yang turun adalah precision antrean.", },
            { text: "Karena biaya review naik per alert", why: "Biaya review tetap NT$200 per alert [ilustrasi] — yang berubah adalah komposisi alertnya.", },
          ],
        },
        {
          q: "Antrean top-100 menangkap 86 dari 1.327 default di test set. Berapa default yang TIDAK masuk antrean top-100?",
          options: [
            { text: "86", why: "86 adalah yang tertangkap — bukan yang terlewat.", },
            { text: "914", why: "914 tidak cocok: 1.327 − 86 = 1.241, bukan 914.", },
            { text: "1.241", why: "Benar: 1.327 − 86 = 1.241 default tidak masuk antrean top-100 — antrean yang pendek menghemat biaya review, tapi membiarkan sebagian besar default lolos.", correct: true },
            { text: "1.327", why: "1.327 adalah total default di test — 86 di antaranya sudah tertangkap.", },
          ],
        },
        {
          q: "Di capstone M3.5 [ilustrasi], model full (semua fitur M3) mencapai PR-AUC P1 0,8397 — DI BAWAH model +anomaly 0,8577 (P@100 keduanya 0,25 — 25 dari 100 alert teratas fraud). Apa pelajaran utamanya?",
          options: [
            { text: "Model full salah dilatih — harusnya selalu menang", why: "Salah: tidak ada hukum yang berkata model dengan fitur terbanyak harus menang — fitur yang tidak membawa sinyal baru hanya menambah noise." },
            { text: "Lebih banyak fitur ≠ lebih baik — profil peer/drift tidak menambah di atas velocity+anomaly di data ini; yang diukur adalah tambahan tiap keluarga fitur, bukan jumlahnya (P@100 keduanya 0,25 — 25 dari 100 alert teratas fraud)", why: "Benar: +behavioral nyaris tidak menambah (0,6105 → 0,6199), +graph melompat (+0,19), dan full (0,8397) di bawah +anomaly (0,8577) di P1 maupun P2 (0,4137 vs 0,4375).", correct: true },
            { text: "PR-AUC 0,8397 berarti model full gagal total", why: "Salah: 0,8397 tetap jauh di atas baseline 0,6105 — full bukan gagal, hanya bukan yang terbaik di data ini." },
            { text: "Capstone harus memakai GBM 23 fitur kredit, bukan fitur M3", why: "Salah: 23 fitur itu fitur kredit kanonis notebook M3.5 — capstone sengaja membangun feature set sendiri dari sinyal M3." },
          ],
        },
        {
          q: "Dengan biaya review NT$5.000 [ilustrasi], presisi lokal jatuh di bawah impas (0,0808) pertama kali di k = 2.845. Dengan biaya review NT$200, tidak pernah sampai k = 6.000. Apa yang menentukan antrean optimal?",
          options: [
            { text: "EV total — antrean optimal adalah k dengan EV tertinggi (6.000)", why: "Salah: EV total naik terus sampai 6.000, tapi k = 6.000 berarti 120 analis-hari — kapasitas tidak sanggup, dan di biaya review NT$5.000 alert ke-2.845 sudah merugi." },
            { text: "Biaya review dan kapasitas — biaya review yang naik 25× memotong antrean optimal lebih dari separuh (6.000 → 2.845); impas naik 0,00323 → 0,08076; EV(k) yang terus naik tidak menjawab sendirian", why: "Benar: presisi impas = C_REV/C_MISS — naiknya biaya review menaikkan impas (0,00323 → 0,08076) dan memotong k optimal; kapasitas 1.000/hari mengikat duluan di biaya review NT$200.", correct: true },
            { text: "Recall — antrean optimal adalah k dengan recall 1,0000", why: "Salah: recall 1,0000 butuh k = 6.000 (memeriksa semua nasabah) — precision-nya jatuh ke base rate 0,2212 dan workload-nya 120 analis-hari." },
            { text: "Angka bulat — 1.000, 2.000, atau 5.000", why: "Salah: angka bulat bukan alasan ekonomi — k ditentukan biaya marginal dan kapasitas, bukan kenyamanan menyebut." },
          ],
        },
        {
          q: "Satu antrean 500 alert [ilustrasi]: precision default 0,60 (EV NT$18.473.201) vs precision confirmed fraud 0,12 (EV NT$8.750.000). Apa kesimpulan yang tepat?",
          options: [
            { text: "Antreannya buruk — precision 0,12 terlalu rendah", why: "Salah: 0,12 adalah precision terhadap label confirmed fraud — label yang jauh lebih ketat; antrean yang sama punya precision 0,60 terhadap default." },
            { text: "Antrean yang «bagus» untuk default bisa jadi biasa saja untuk fraud — precision 0,60 terhadap default vs 0,12 terhadap confirmed fraud; label dan biayanya berbeda, jadi precision/EV tanpa menyebut labelnya tidak bisa dibandingkan", why: "Benar: selisih NT$9.723.201 bukan karena antreannya berubah — karena labelnya (default vs confirmed fraud) dan biayanya (61.910,67/200 vs 150.000/500) berbeda.", correct: true },
            { text: "EV fraud lebih kecil karena biaya review fraud lebih murah", why: "Salah, terbalik: biaya review fraud NT$500 LEBIH MAHAL dari NT$200 — dan biaya fraud terlewat NT$150.000 lebih besar; EV-nya lebih kecil karena hanya 60 confirmed fraud vs 300 default." },
            { text: "Default dan fraud adalah label yang sama, jadi salah satu angka pasti salah hitung", why: "Salah: default (gagal bayar) dan confirmed fraud (terbukti curang) adalah outcome yang berbeda — 300 default di antrean itu hanya 60 yang terkonfirmasi fraud." },
          ],
        },
      ],
      summary: [
        "Antrean alert adalah ranking yang dipotong di kapasitas analis; precision@k mengukur isinya (P@100 0,8600; P@500 0,7260; P@1.000 0,6060 [notebook]).",
        "EV antrean = TP × biaya terlewat − k × biaya review; biaya NT$61.910,67 dan NT$200 [ilustrasi].",
        "Ranking 4,0x lebih bernilai dari undian acak seed 7 pada top-500: NT$22.373.572 vs NT$5.533.871 [notebook] (3,3x terhadap ekspektasi acak NT$6.747.320).",
        "Total EV naik dengan k tapi EV per alert turun (53.043 → 44.747 → 37.318); antrean optimal ditentukan EV marginal, bukan angka bulat.",
        "Fairness alert threshold 0,10 [notebook]: laki-laki alert rate 0,7469 dan FPR 0,6888 vs perempuan 0,6581 dan 0,5985 — audit per grup wajib; tiap alert membawa reason codes.",
        "Siskamling: Ensemble Top-3 Terkalibrasi, PR-AUC 0,986; dua ambang t_close 0,010 / t_esc 0,135; aturan ≥2 sinyal hanya menaikkan ke ESKALASI; penenang turun satu tingkat, tidak pernah AUTO-CLOSE; bobot model «belum siap produksi».",
        "Lab: EV antrean 10 alert (top-3 185.133; top-6 246.444; top-10 307.555) dan lift ranking vs acak (2,00 di k=3; 1,00 di k=10).",
        "Pemetaan outcome [ilustrasi]: satu antrean 500 alert — precision default 0,60 (EV NT$18.473.201) vs precision confirmed fraud 0,12 (EV NT$8.750.000); selisih NT$9.723.201 karena label dan biayanya berbeda — default bukan fraud.",
        "Capstone [ilustrasi]: 2.000 akun, cutoff hari ke-30, train 1.500 / test 500 — PR-AUC P1: baseline 0,6105 → +behavioral 0,6199 → +graph 0,8081 → +velocity 0,8415 → +anomaly 0,8577 → full 0,8397 (full tidak menang); P2: full jatuh 0,8397 → 0,4137 (15 burst baru + 25 berhenti).",
        "Kurva keputusan [notebook]: EV(k) naik 5.304.317 → 80.955.456 (k = 100 → 6.000) tapi EV marginal per blok jatuh 53.043 → 2.896; impas 0,00323 (review 200) / 0,01615 (1.000) / 0,08076 (5.000); biaya review NT$5.000 memotong k optimal ke 2.845; workload k = 1.000 → 20 analis-hari.",
        "GBM M3.5 [notebook] ROC-AUC test 0,7807 — konfigurasi berbeda dari GBM kanonis M2.3 (0,7823); jangan bandingkan TP/FP-nya seolah satu eksperimen.",
      ],
      next: { label: "Lanjut: MLF-M4.1 — Random Forest & Ensembles", href: "/v2/learn/mlf-m41-random-forest-ensembles" },
    },
  ],
};
