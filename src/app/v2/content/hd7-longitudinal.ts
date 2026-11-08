import type { V2Lesson } from "../lib/types";

export const hd7: V2Lesson = {
  slug: "hd7-longitudinal",
  track: "Health Data Science",
  module: "Analisis Klinis Lanjutan",
  title: "HD7 Data Longitudinal: n Palsu dan Efek Acak",
  estMinutes: 50,
  steps: [
    {
      id: "n-palsu",
      eyebrow: "Langkah 1 · Korelasi intra",
      title: "1000 pengukuran, 50 pasien, berapa n?",
      prose: [
        "Studi tekanan darah: 50 pasien, masing-masing diukur 20 kali. Analis memasukkan 1000 baris ke regresi biasa dan melaporkan p<0,001 untuk efek obat. Reviewer menolak: 1000 pengukuran dari 50 orang bukan 1000 observasi independen — tekanan darah orang yang sama berkorelasi dengan dirinya sendiri.",
        "Intraclass correlation (ICC) mengukur seberapa mirip pengukuran dalam satu orang. n efektif = n / (1 + (m−1)×ICC): m = pengukuran per orang. Contoh: n=1000, m=20, ICC=0,7 → n_eff = 1000/(1+19×0,7) ≈ 70. Dari “1000” tinggal 70! CI yang dilaporkan 3,8× terlalu sempit — temuan “signifikan” bisa jadi artefak.",
        "Aturan praktis: jika ICC tinggi, tambah orang lebih berharga daripada tambah pengukuran. Dan selalu laporkan ICC — ia memberi tahu seberapa besar masalah korelasinya.",
      ],
      tasks: [],
      formula: String.raw`n_{\text{eff}} = \frac{n}{1 + (m-1)\,\text{ICC}}`,
      formulaNote: "n_eff = ukuran sampel EFEKTIF — “n yang jujur” setelah memperhitungkan korelasi dalam-subjek. n = total pengukuran (baris); m = pengukuran per orang; ICC = intraclass correlation — proporsi variansi total yang berasal dari perbedaan ANTAR-orang (0 = pengukuran dalam satu orang tak berkorelasi; 1 = identik). (m−1)×ICC = “biaya” korelasi. Interpretasi: n=1000, m=20, ICC=0,7 → n_eff = 1000/(1+19×0,7) ≈ 70 — seribu baris hanya sekuat 70 pasien independen. Aturan desain: bila ICC tinggi, tambah ORANG lebih berharga daripada tambah pengukuran.",
      note: {
        title: "Sering salah",
        body: "Mengira lebih banyak pengukuran = lebih banyak bukti. Dengan ICC tinggi, 20 pengukuran per orang hampir tidak menambah informasi baru — yang menambah adalah orang baru. Desain studi yang mengabaikan ini membuang budget pengukuran sia-sia.",
        type: "pitfall",
      },
      reference: "n baris ≠ n independen. Hitung n efektif sebelum percaya p-value.",
    },
    {
      id: "lab-neff",
      eyebrow: "Langkah 2 · Lab",
      title: "Hitung n efektif dua desain",
      prose: [
        "Bandingkan dua desain dengan total 1000 pengukuran dan ICC=0,7: Desain A — 100 pasien × 10 pengukuran; Desain B — 50 pasien × 20 pengukuran. Hitung n efektif masing-masing dengan rumus di atas.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `neff_a` (100 pasien × 10 pengukuran, ICC=0,7)" },
        { id: "t2", text: "Hitung `neff_b` (50 pasien × 20 pengukuran, ICC=0,7)" },
      ],
      expected: "neff_a≈136.99 neff_b≈69.93",
      note: {
        title: "Kaitan ke risk",
        body: "Studi dengan n palsu menghasilkan CI terlalu sempit → obat yang sebenarnya tidak efektif lolos sebagai “signifikan”. Regulator yang menemukan ini menolak seluruh dossier — kerugian miliaran rupiah.",
        type: "risk",
      },
      hints: [
        "Rumus: n_eff = n / (1 + (m−1) × ICC), dengan n=1000 untuk keduanya.",
        "Desain A: m=10 → penyebut = 1 + 9×0,7.",
        "Desain B: m=20 → penyebut = 1 + 19×0,7. Bandingkan: desain mana lebih efisien?",
      ],
      code: {
        starter: `# ICC = 0.7, total n = 1000 untuk kedua desain\n# TULIS KODEMU: n efektif desain A (m=10) dan B (m=20)\nneff_a = \nneff_b = \nprint(f"neff_a={neff_a:.2f} neff_b={neff_b:.2f}")`,
        lockLines: 1,
        solution: `# ICC = 0.7, total n = 1000 untuk kedua desain\n# TULIS KODEMU: n efektif desain A (m=10) dan B (m=20)\nneff_a = 1000/(1 + 9*0.7)\nneff_b = 1000/(1 + 19*0.7)\nprint(f"neff_a={neff_a:.2f} neff_b={neff_b:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "neff_a", value: 136.99, tol: 0.05, label: "`neff_a` seharusnya ≈ 136.99", msg: "1000/(1+9×0,7) = 1000/7,3." },
          { kind: "equal", task: "t2", name: "neff_b", value: 69.93, tol: 0.05, label: "`neff_b` seharusnya ≈ 69.93", msg: "1000/(1+19×0,7) = 1000/14,3." },
          { kind: "stdout_matches", task: "t2", pattern: "neff_a=136\\.99 neff_b=69\\.93", label: "`print` menampilkan neff_a dan neff_b", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ICC tinggi → tambah orang, bukan tambah pengukuran.",
    },
    {
      id: "mixed-gee",
      eyebrow: "Langkah 3 · Model",
      title: "Mixed model vs GEE",
      prose: [
        "Dua alat standar data longitudinal. Linear mixed model (LMM): Y = Xβ + Zu + ε — efek acak u menangkap perbedaan antar-orang (random intercept: tiap pasien punya baseline sendiri; random slope: tiap pasien punya laju perubahan sendiri). Menjawab pertanyaan level individu: “bagaimana tekanan darah pasien ini berubah?”",
        "GEE (generalized estimating equations): memodelkan rata-rata populasi sambil mengoreksi korelasi via working correlation structure. Menjawab pertanyaan level populasi: “rata-rata tekanan darah populasi turun berapa?” GEE robust terhadap salah spesifikasi struktur korelasi (dengan sandwich SE) — cocok untuk estimasi efek kebijakan.",
        "Kapan pakai apa: ingin prediksi per pasien / memahami heterogenitas → mixed. Ingin efek rata-rata populasi untuk kebijakan → GEE. Keduanya butuh penanganan missing yang benar (lihat HD8): mixed model valid di bawah MAR bila likelihood dipakai penuh; GEE standar butuh MCAR kecuali dibobot (IPW-GEE).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Memakai GEE lalu menginterpretasikan koefisiennya sebagai efek per individu. GEE = efek rata-rata populasi. Untuk “pasien ini”, pakai mixed model dengan efek acaknya.",
        type: "pitfall",
      },
      quiz: [
        {
          q: "Dinas kesehatan ingin tahu efek rata-rata program diet di populasi. Pilihan tepat?",
          options: [
            { text: "GEE — estimasi efek rata-rata populasi, robust terhadap struktur korelasi", why: "Benar: pertanyaan kebijakan = level populasi. GEE dengan sandwich SE aman.", correct: true },
            { text: "Mixed model dengan random slope", why: "Mixed menjawab level individu; untuk rata-rata populasi GEE lebih langsung." },
            { text: "Regresi biasa pada 1000 baris", why: "n palsu — CI terlalu sempit, p-value tidak valid." },
            { text: "Rata-rata saja tanpa model", why: "Tanpa koreksi korelasi, SE-nya salah." },
          ],
        },
      ],
      reference: "Individu → mixed. Populasi/kebijakan → GEE.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: memodelkan pengukuran berulang",
      prose: [
        "Lima situasi keputusan yang dihadapi analis data longitudinal — dengan model yang tepat untuk tiap pertanyaan:",
        "Skenario 1 — “Berapa n sebenarnya?” → Hitung n efektif dari korelasi intra (ICC) sebelum menghitung apa pun. Contoh: 200 pengguna × 12 minggu BUKAN n = 2.400 — pengukuran dari orang yang sama berkorelasi, dan mengabaikannya membuat p-value terlihat jauh lebih meyakinkan dari kenyataannya.",
        "Skenario 2 — “Untuk SIAPA intervensi ini bekerja?” (efek subjek-spesifik). → Mixed model dengan random intercept dan slope — tiap orang punya garisnya sendiri. Contoh: aplikasi diet rata-rata turun 1,2 kg, tetapi 30% pengguna turun >4 kg sementara 50% hampir tak berubah — insight bisnisnya ada di heterogenitas, bukan di rata-rata.",
        "Skenario 3 — “Berapa efek rata-rata untuk POPULASI?” (keputusan kebijakan). → GEE dengan struktur korelasi kerja yang masuk akal (exchangeable, AR-1, unstructured). GEE menjawab “rata-rata populasi”, mixed model menjawab “orang tipikal” — dua pertanyaan berbeda, dua jawaban yang bisa berbeda.",
        "Skenario 4 — “Apakah efek antar-orang sama dengan efek dalam-orang?” → Dekomposisi within-between. Contoh klasik: orang yang rata-rata lebih aktif lebih sehat (between), tetapi menambah aktivitas minggu ini belum tentu menurunkan berat minggu ini (within) — mencampurnya menghasilkan kesimpulan yang salah arah.",
        "Skenario 5 — “Banyak peserta drop-out di tengah jalan?” → Curigai MNAR: yang berhenti sering justru yang gagal (aplikasi diet: 40% berhenti di minggu 4 karena beratnya tak turun). Mixed model tahan terhadap MAR, tetapi MNAR butuh pemodelan eksplisit mekanisme drop-out — lihat HD8.",
        "Aturan praktis 10 detik: hitung n efektif dulu → subjek-spesifik = mixed, populasi = GEE → pisahkan within dari between → drop-out = curigai MNAR → laporkan heterogenitas, bukan cuma rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Melaporkan “rata-rata turun 3 kg, p<0,001” dari analisis naif — padahal yang bertahan hanya yang berhasil. Atau memakai GEE untuk menjawab “untuk siapa” — GEE tidak memberi efek per orang. Salah memilih model di sini bukan soal presisi, melainkan soal menjawab pertanyaan yang berbeda dari yang ditanyakan.",
        type: "pitfall",
      },
      reference: "n palsu → n efektif; subjek = mixed, populasi = GEE; within ≠ between; drop-out = MNAR.",
    },
    {
      id: "minicase-diet",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Aplikasi diet: siapa yang berhasil?",
      prose: [
        "Aplikasi diet mencatat berat 200 pengguna tiap minggu selama 12 minggu. Analisis naif: rata-rata turun 3 kg, p<0,001. Tapi 40% berhenti memakai aplikasi di minggu 4 — dan yang berhenti justru yang tidak turun beratnya (MNAR, lihat HD8).",
        "Analisis benar: mixed model dengan random intercept + slope — tiap pengguna punya laju penurunannya sendiri. Hasil: rata-rata turun 1,2 kg (bukan 3 kg); heterogenitas besar — 30% turun >4 kg, 50% hampir tidak berubah. Insight bisnisnya justru di sini: bukan “aplikasi berhasil rata-rata”, tapi “aplikasi berhasil untuk tipe pengguna X”.",
        "Pelajaran: data longitudinal yang dianalisis benar tidak hanya memberi angka yang jujur — ia memberi tahu untuk siapa intervensi bekerja. Itu jauh lebih berguna daripada satu rata-rata yang menipu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        body: "Melaporkan “rata-rata turun 3 kg” ke investor/publik padahal yang bertahan hanya yang berhasil adalah survivorship bias. Ketika uji independen gagal mereplikasi, kredibilitas perusahaan hancur — dan pengguna yang gagal merasa ditipu.",
        type: "risk",
      },
      reference: "Tanyakan selalu: untuk siapa efek ini bekerja? Lihat heterogenitas, bukan hanya rata-rata.",
    },
    {
      id: "struktur-korelasi",
      eyebrow: "Langkah 6 · Korelasi",
      title: "Struktur korelasi, confounding waktu, dan dropout",
      prose: [
        "Mixed model dan GEE di lesson ini menjawab “model apa?” — tapi ada pertanyaan yang lebih dulu: “korelasi seperti apa?” Working correlation structure adalah jawaban sementara yang kamu berikan ke GEE: exchangeable (semua pasangan pengukuran berkorelasi sama — cocok untuk pengukuran berulang tanpa urutan waktu, mis. mata kiri-kanan), AR(1) (korelasi meluruh dengan jarak waktu — tekanan darah harian), unstructured (setiap pasangan bebas — fleksibel tapi boros: untuk 10 waktu = 45 parameter korelasi). Kabar baik: GEE tetap konsisten walau struktur salah (robust SE) — tapi SE-nya paling tepat bila struktur mendekati benar. Pilih dengan QIC (analog AIC untuk GEE), bukan dengan firasat.",
        "Jebakan waktu kedua setelah n palsu: time-varying confounding — confounder yang berubah sekaligus memengaruhi treatment berikutnya DAN outcome. Contoh: pada studi obat hipertensi longitudinal, tekanan darah bulan lalu memengaruhi dosis bulan ini (dokter menaikkan dosis bila TD tinggi) sekaligus outcome stroke. Mengontrol TD bulan lalu sebagai kovariat biasa = mengontrol sebagian mediator (dosis→TD→stroke) → bias. Solusi: marginal structural model dengan IPTW yang dihitung per waktu, atau g-formula. Inilah alasan “jangan kontrol variabel yang dipengaruhi treatment” menjadi LEBIH rumit dalam data longitudinal.",
        "Jebakan ketiga: dropout informatif. Di mini-case diet lesson ini, 40% berhenti memakai aplikasi — dan yang berhenti bukan acak (yang gagal lebih sering berhenti). Mixed model di bawah MAR masih OK bila modelnya menyertakan outcome sebelumnya; tapi bila dropout bergantung pada nilai yang TAK teramati (berat badan saat berhenti yang tidak tercatat) = MNAR → butuh pattern-mixture atau selection model. Aturan: selalu laporkan pola dropout per grup + analisis sensitivitas — jangan hanya n akhir.",
        "Terakhir: desain mengalahkan analisis. Tiga keputusan desain yang menentukan segalanya: (a) frekuensi pengukuran — samakan dengan kecepatan fenomena (TD harian untuk efek obat harian; HbA1c 3-bulanan); (b) jendela waktu — terlalu pendek = efek belum muncul; terlalu panjang = dropout membunuh; (c) time zero yang sinkron — semua subjek dihitung dari momen yang sama (masuk studi), bukan dari kalender. Analisis longitudinal yang brilian tidak menyelamatkan desain yang malas.",
      ],
      tasks: [],
      formula: String.raw`\text{Corr}(Y_t, Y_s) = \rho^{|t-s|}`,
      formulaNote: "Struktur korelasi AR(1) (autoregressive order 1) — model kerja untuk korelasi antar pengukuran longitudinal. Y_t, Y_s = outcome pada waktu t dan s untuk orang yang sama; ρ (rho) = korelasi antar dua pengukuran BERURUTAN (0–1); |t−s| = jarak waktu. Interpretasi: korelasi MELURUH seiring jarak — pengukuran kemarin (ρ=0,7) lebih mirip daripada 5 waktu lalu (0,7⁵ ≈ 0,17). Cocok untuk pengukuran berjarak sama (TD harian); untuk jarak tak beraturan pakai varian spatial-power. GEE tetap konsisten walau struktur salah — tapi SE paling tepat bila struktur mendekati benar.",
      note: {
        title: "Intuisi: film bukan foto, curigai kalender, pisahkan within vs between",
        body: "Data longitudinal adalah film, bukan tumpukan foto — dan analis yang memperlakukannya sebagai foto (regresi biasa per baris) sedang menonton film dengan mata tertutup sebelah. Heuristik pertama: sebelum model apa pun, plot 20–30 trajektori individu (spaghetti plot). Pola yang terlihat mata — dropout massal di minggu 4, dua kelompok responder, satu outlier yang menarik rata-rata — tidak akan ditemukan oleh model yang langsung dipasang. Heuristik kedua: tanyakan “apa yang berubah BERSAMAAN dengan waktu?” — musim, protokol RS, versi aplikasi, pandemi — semua adalah confounder waktu yang tak tercatat dan penjelasan favorit untuk “efek” yang tiba-tiba muncul di bulan tertentu. Heuristik ketiga: untuk setiap efek yang kamu temukan, tanyakan versi within-person-nya — “apakah orang yang DOSISNYA NAIK mengalami perbaikan, atau orang yang dosisnya TINGGI memang beda orangnya?” Mixed model dengan centering within-between menjawab keduanya sekaligus; GEE hanya menjawab yang kedua. Kebanyakan pertanyaan klinis (“apakah menaikkan dosis membantu PASIEN INI?”) adalah pertanyaan within-person. Tiga kebiasaan — spaghetti dulu, curigai kalender, pisahkan within vs between — mengubah data longitudinal dari jebakan n palsu menjadi lensa kausal yang tajam.",
      },
      quiz: [
        {
          q: "Data tekanan darah harian 30 hari. Struktur korelasi kerja yang paling masuk akal untuk GEE?",
          options: [
            { text: "AR(1) — korelasi meluruh dengan jarak waktu", why: "Benar: TD kemarin lebih mirip daripada TD 20 hari lalu.", correct: true },
            { text: "Exchangeable — semua pasangan sama", why: "Tidak masuk akal untuk deret waktu: jarak seharusnya penting." },
            { text: "Unstructured — 435 parameter bebas", why: "Boros dan tidak perlu; AR(1) menangkap polanya dengan 1 parameter." },
            { text: "Independen — abaikan korelasi", why: "Itu kembali ke n palsu — justru yang dihindari lesson ini." },
          ],
        },
        {
          q: "Dokter bertanya: “apakah MENAIKKAN dosis membantu pasien INI?” Estimasi yang menjawab?",
          options: [
            { text: "Efek within-person (centering within-between pada mixed model)", why: "Benar: pertanyaan “bila dosisnya naik” = variasi dalam-orang, bukan perbandingan antar-orang.", correct: true },
            { text: "Efek between-person dari GEE", why: "Itu menjawab “apakah orang berdosis tinggi beda?” — pertanyaan populasi, bukan pasien ini." },
            { text: "Rata-rata keseluruhan", why: "Mencampur within dan between — jawaban kabur." },
            { text: "Korelasi Pearson dosis-TD", why: "Mengabaikan struktur longitudinal sepenuhnya." },
          ],
        },
      ],
      reference: "Pilih struktur korelasi dengan QIC. Within vs between = dua pertanyaan berbeda.",
    },
    {
      id: "lab-within-between",
      eyebrow: "Langkah 7 · Lab",
      title: "Between menipu, within jujur: paradoks dosis",
      prose: [
        "Simulasi 200 pasien × 5 waktu (seed 9). Kebenaran yang kita tetapkan: pasien yang lebih parah mendapat dosis rata-rata LEBIH TINGGI (dokter mengobati yang sakit), TAPI menaikkan dosis pada orang yang sama MENURUNKAN tekanan darah sebesar 2 mmHg per unit dosis. Tugasmu: hitung `slope_between` (regresi rata-rata pasien: TD̄ vs dosis̄) dan `slope_within` (regresi data yang di-demean per pasien). Saksikan tandanya berbalik — dan pahami mengapa “dosis tinggi → TD tinggi” di data observasional bukan bukti obat gagal.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `slope_between` (regresi antar-pasien)" },
        { id: "t2", text: "Hitung `slope_within` (regresi dalam-pasien, demeaned)" },
      ],
      expected: "slope_between≈3.18 slope_within≈-1.94",
      note: {
        title: "Kaitan ke risk",
        body: "Analisis between yang disalahartikan sebagai efek kausal (“dosis tinggi berhubungan dengan TD tinggi, jadi obatnya tidak bekerja”) bisa menghentikan obat yang sebenarnya manjur — keputusan formularium yang salah arah karena mencampur dua pertanyaan berbeda.",
        type: "risk",
      },
      hints: [
        "Bangkitkan: severity s~N(0,1); dosis̄=2+0,8s; dosis=dosis̄+N(0,0,5); TD=140+3s−2(dosis−dosis̄)+N(0,2).",
        "Slope OLS = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)².",
        "Between: satu titik per pasien (rata-rata). Within: kurangi rata-rata pasien dari tiap pengukuran dulu.",
      ],
      code: {
        starter: `import random\nfrom collections import defaultdict\nrandom.seed(9)\n# TULIS KODEMU: bangkitkan data, hitung slope_between & slope_within\nslope_between = \nslope_within = \nprint(f"slope_between={slope_between:.2f} slope_within={slope_within:.2f}")`,
        lockLines: 3,
        solution: `import random\nfrom collections import defaultdict\nrandom.seed(9)\n# TULIS KODEMU: bangkitkan data, hitung slope_between & slope_within\nn, m = 200, 5\npat = defaultdict(list)\nfor i in range(n):\n    s = random.gauss(0, 1)\n    dbar = 2 + 0.8 * s\n    for t in range(m):\n        d = dbar + random.gauss(0, 0.5)\n        y = 140 + 3 * s - 2 * (d - dbar) + random.gauss(0, 2)\n        pat[i].append((d, y))\ndef slope(xy):\n    xs = [x for x, y in xy]; ys = [y for x, y in xy]\n    mx, my = sum(xs) / len(xs), sum(ys) / len(ys)\n    return sum((x - mx) * (y - my) for x, y in xy) / sum((x - mx) ** 2 for x in xs)\nmeans = [(sum(d for d, y in v) / m, sum(y for d, y in v) / m) for v in pat.values()]\nslope_between = slope(means)\nwdm = []\nfor v in pat.values():\n    md = sum(d for d, y in v) / m; my = sum(y for d, y in v) / m\n    wdm += [(d - md, y - my) for d, y in v]\nslope_within = slope(wdm)\nprint(f"slope_between={slope_between:.2f} slope_within={slope_within:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "slope_between", value: 3.18, tol: 0.15, label: "`slope_between` seharusnya ≈ 3.18", msg: "Positif — yang parah dapat dosis tinggi DAN TD tinggi (confounding)." },
          { kind: "equal", task: "t2", name: "slope_within", value: -1.94, tol: 0.15, label: "`slope_within` seharusnya ≈ −1.94", msg: "Negatif ≈ −2 — menaikkan dosis MENURUNKAN TD. Tanda berbalik!" },
          { kind: "stdout_matches", task: "t2", pattern: "slope_between=3\\.18 slope_within=-1\\.94", label: "`print` menampilkan kedua slope", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "slope_between=+3,18 tapi slope_within=−1,94. Kesimpulan untuk dokter?",
          options: [
            { text: "Menaikkan dosis membantu (within); korelasi between tercemar keparahan", why: "Benar: within menjawab pertanyaan kausal “bila dosis naik”; between menjawab “siapa dapat dosis tinggi”.", correct: true },
            { text: "Obat gagal — dosis tinggi berhubungan dengan TD tinggi", why: "Itu membaca between sebagai kausal — persis jebakan lesson ini." },
            { text: "Hasil kontradiktif, buang studi", why: "Tidak kontradiktif — dua pertanyaan berbeda, dua jawaban yang konsisten." },
            { text: "Naikkan dosis semua pasien", why: "Keputusan klinis butuh lebih dari satu simulasi — tapi arah efeknya within." },
          ],
        },
      ],
      reference: "Between = siapa. Within = apa yang terjadi bila berubah. Jangan tukar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "n baris ≠ n independen: n_eff = n/(1+(m−1)×ICC).",
        "ICC tinggi → tambah orang lebih berharga dari tambah pengukuran.",
        "Mixed model = level individu; GEE = level populasi.",
        "Waspadai drop-out selektif (MNAR) — analisis naif = survivorship bias.",
      ],
      next: { label: "HD8 — Missing Data", href: "/v2/learn/hd8-missing-data" },
      quiz: [
        {
          q: "50 pasien × 20 pengukuran, ICC=0,7. n efektif?",
          options: [
            { text: "≈ 70", why: "Benar: 1000/(1+19×0,7) = 1000/14,3 ≈ 70.", correct: true },
            { text: "1000", why: "Itu n palsu — mengabaikan korelasi intra-orang." },
            { text: "50", why: "Terlalu pesimis: pengukuran berulang tetap menambah sedikit informasi." },
            { text: "20", why: "20 adalah pengukuran per orang, bukan n efektif." },
          ],
        },
        {
          q: "Dokter ingin memprediksi trajectory tekanan darah pasien individual. Model tepat?",
          options: [
            { text: "Mixed model dengan random intercept/slope", why: "Benar: efek acak menangkap trajectory per pasien.", correct: true },
            { text: "GEE", why: "GEE menjawab rata-rata populasi, bukan individu." },
            { text: "Regresi biasa", why: "Mengabaikan korelasi — SE salah." },
            { text: "Rata-rata per pasien lalu regresi", why: "Membuang informasi trajectory waktu." },
          ],
        },
        {
          q: "GEE standar (tanpa pembobotan) valid di bawah asumsi missing…",
          options: [
            { text: "MCAR", why: "Benar: GEE standar butuh MCAR; di bawah MAR pakai IPW-GEE atau mixed model.", correct: true },
            { text: "MAR", why: "GEE standar bias di bawah MAR — butuh pembobotan." },
            { text: "MNAR", why: "MNAR butuh model seleksi/pola campuran — GEE standar tidak cukup." },
            { text: "Bebas asumsi", why: "Tidak ada metode yang bebas asumsi missing." },
          ],
        },
        {
          q: "40% pengguna berhenti di minggu 4, dan yang berhenti = yang tidak turun beratnya. Analisis rata-rata sederhana akan…",
          options: [
            { text: "Melebih-lebihkan efek (survivorship bias)", why: "Benar: yang tersisa adalah yang berhasil — rata-rata terlihat lebih baik dari realita.", correct: true },
            { text: "Akurat", why: "Tidak: sampel akhir tidak mewakili sampel awal." },
            { text: "Meremehkan efek", why: "Terbalik: biasnya ke arah melebih-lebihkan." },
            { text: "Tidak bisa dihitung", why: "Bisa dihitung — tapi salah." },
          ],
        },
      ],
    },
  ],
};
