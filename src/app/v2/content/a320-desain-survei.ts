import type { V2Lesson } from "../lib/types";

// ── Figure: komposisi populasi vs sampel + estimasi terbobot vs tak-terbobot ─
const SURVEY_SVG = `<svg viewBox=\"0 0 560 340\" role=\"img\" aria-label=\"Perbandingan komposisi populasi vs sampel dan estimasi kepuasan terbobot vs tak-terbobot\">
<text x=\"20\" y=\"22\" font-size=\"13\" font-weight=\"700\" font-family=\"var(--font-ui)\" fill=\"var(--text)\">Komposisi: populasi vs responden</text>
<g font-size=\"11\" font-family=\"var(--font-ui)\" fill=\"var(--text)\" text-anchor=\"end\">
<text x=\"86\" y=\"66\">Digital</text><text x=\"86\" y=\"110\">Cabang</text><text x=\"86\" y=\"154\">Agen</text>
</g>
<g>
<rect x=\"94\" y=\"50\" width=\"180\" height=\"14\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"94\" y=\"70\" width=\"240\" height=\"14\" fill=\"var(--c2)\" rx=\"3\"/>
<rect x=\"94\" y=\"94\" width=\"90\" height=\"14\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"94\" y=\"114\" width=\"45\" height=\"14\" fill=\"var(--c2)\" rx=\"3\"/>
<rect x=\"94\" y=\"138\" width=\"30\" height=\"14\" fill=\"var(--c1)\" rx=\"3\"/>
<rect x=\"94\" y=\"158\" width=\"15\" height=\"14\" fill=\"var(--c2)\" rx=\"3\"/>
</g>
<g font-size=\"10\" font-family=\"var(--font-ui)\" fill=\"var(--text-muted)\">
<text x=\"280\" y=\"61\">60%</text><text x=\"340\" y=\"81\">80%</text>
<text x=\"190\" y=\"105\">30%</text><text x=\"145\" y=\"125\">15%</text>
<text x=\"130\" y=\"149\">10%</text><text x=\"115\" y=\"169\">5%</text>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\">
<rect x=\"94\" y=\"196\" width=\"14\" height=\"14\" fill=\"var(--c1)\"/><text x=\"114\" y=\"208\" fill=\"var(--text)\">populasi (N=10.000)</text>
<rect x=\"250\" y=\"196\" width=\"14\" height=\"14\" fill=\"var(--c2)\"/><text x=\"270\" y=\"208\" fill=\"var(--text)\">responden (n=400)</text>
</g>
<text x=\"300\" y=\"248\" font-size=\"13\" font-weight=\"700\" font-family=\"var(--font-ui)\" fill=\"var(--text)\" text-anchor=\"middle\">Estimasi % puas</text>
<g>
<rect x=\"180\" y=\"262\" width=\"251\" height=\"26\" fill=\"var(--chart-grid)\" rx=\"3\"/>
<rect x=\"180\" y=\"296\" width=\"238\" height=\"26\" fill=\"var(--c1)\" rx=\"3\"/>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\" fill=\"var(--text)\" text-anchor=\"end\">
<text x=\"172\" y=\"280\">tak-terbobot</text><text x=\"172\" y=\"314\">terbobot</text>
</g>
<g font-size=\"11\" font-family=\"var(--font-ui)\" fill=\"var(--text)\">
<text x=\"437\" y=\"280\">83,7%</text><text x=\"424\" y=\"314\">79,4%</text>
</g>
<line x1=\"404\" y1=\"296\" x2=\"444\" y2=\"296\" stroke=\"var(--chart-text)\" stroke-width=\"2\"/>
<line x1=\"404\" y1=\"290\" x2=\"404\" y2=\"302\" stroke=\"var(--chart-text)\" stroke-width=\"2\"/>
<line x1=\"444\" y1=\"290\" x2=\"444\" y2=\"302\" stroke=\"var(--chart-text)\" stroke-width=\"2\"/>
<text x=\"452\" y=\"300\" font-size=\"10\" font-family=\"var(--font-ui)\" fill=\"var(--text-muted)\">±4,3</text>
<g fill=\"var(--text-muted)\" font-size=\"10\" font-family=\"var(--font-ui)\">
<text x=\"20\" y=\"330\">Agen: 10% populasi tetapi 5% sampel → bobot 2,0</text>
<text x=\"430\" y=\"330\">data sintetis lab</text>
</g>
</svg>`;

export const a320: V2Lesson = {
  slug: "a320-desain-survei",
  track: "Statistika",
  module: "Survei & Sampling",
  title: "A320 — Desain Survei: Kuesioner, Sampling, dan Weighting",
  estMinutes: 60,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Survei kepuasan 84% yang runtuh jadi 79%",
      prose: [
        "Bank Nusa mengumumkan dengan bangga: survei kepuasan nasabah 2026 menunjukkan 84% nasabah puas — naik dari 81% tahun lalu. Surveinya dikirim lewat aplikasi mobile banking ke 50.000 pengguna; 2.000 merespons. Direksi tersenyum. Lalu datang audit independen: tim riset menelepon 400 nomor yang diambil ACAK dari database registrasi (bukan dari pengguna aplikasi) — dan hasilnya 79% ± 4%. Direksi tidak tersenyum lagi.",
        "Twist-nya: kedua angka dihitung dengan benar dari datanya masing-masing. Yang berbeda adalah SIAPA yang bisa menjawab. Survei aplikasi hanya bisa dijawab nasabah Digital yang membuka aplikasi — nasabah Cabang dan Agen hampir tidak terwakili (mereka 40% populasi tetapi <20% responden). Dan nasabah yang paling puas terhadap layanan digital... ya jelas yang paling sering membuka aplikasi. Survei itu tidak mengukur kepuasan nasabah; ia mengukur kepuasan PENGGUNA APLIKASI yang rajin — lalu mengklaimnya sebagai kepuasan semua nasabah.",
        "Lesson ini tentang tiga penjaga kejujuran survei: sampling frame (daftar dari mana kamu mengambil sampel — kalau daftarnya salah, semua salah), stratified sampling (memastikan tiap kelompok terwakili secara proporsional), dan weighting (mengoreksi ketidakseimbangan setelah data terkumpul — dengan batasnya). Ditambah margin of error: cara jujur mengatakan seberapa presisi angkamu.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "Survei kepuasan, survei perilaku keuangan, dan credit bureau survey adalah early warning: penurunan kepuasan mendahului penurunan pembayaran. Tetapi survei yang bias memberi rasa aman palsu — seperti Bank Nusa yang mengira 84% padahal 79%. Dalam risk, rasa aman palsu lebih berbahaya daripada ketidaktahuan: ia membuat limit dilonggarkan tepat saat kualitas memburuk.",
      },
      reference: "Survei yang salah frame = mengukur orang yang salah dengan presisi tinggi. Tiga penjaga: frame, stratifikasi, weighting.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal prasyarat",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menilai apakah sampling frame sebuah survei valid; (2) merancang stratified sampling dengan alokasi proporsional; (3) menghitung bobot post-stratifikasi dan estimasi terbobot; (4) menghitung margin of error dengan koreksi populasi hingga; (5) menjelaskan kapan weighting TIDAK cukup dan survei harus didesain ulang.",
        "Rutenya: cerita, bekal ringkas, dua konsep (frame & stratifikasi; weighting & MoE), lab Pyodide (mesin koreksi survei), chart komposisi dengan panduan baca, peta keputusan, mini-case ukuran sampel, kuis, rangkuman. Estimasi 55 menit; lab-nya sekitar 12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, proporsi dan rata-rata terbobot: rata-rata dari rata-rata tiap kelompok, dibobot dengan ukuran kelompok. Kedua, standard error proporsi: SE = √(p(1−p)/n) — presisi tumbuh dengan akar n, bukan n (menggandakan presisi butuh 4x sampel). Ketiga, interval kepercayaan 95%: estimasi ± 1,96 × SE.",
      ],
      tasks: [],
      hints: [
        "Intuisi pembuka: survei yang baik seperti jajak pendapat pemilu yang benar — bukan yang respondennya paling banyak, tetapi yang paling MENYERUPAI pemilih. 400 orang yang mewakili > 10.000 yang tidak.",
      ],
      reference: "Bekal: (1) rata-rata terbobot; (2) SE = √(p(1−p)/n); (3) IK95% = estimasi ± 1,96·SE.",
    },
    {
      id: "konsep-frame",
      eyebrow: "Langkah 3 · Konsep",
      title: "Sampling Frame — Si Daftar Tamu",
      prose: [
        "Definisi: sampling frame = daftar (atau mekanisme) dari mana sampel diambil — harus mencakup SELURUH populasi target, satu kali tiap anggota. Stratified sampling = bagi populasi menjadi strata yang homogen (kanal layanan, region, umur), lalu ambil sampel acak DI DALAM tiap stratum. Alokasi proporsional: n_h = n × N_h/N — stratum 60% populasi mendapat 60% sampel. Hasilnya: tiap kelompok terwakili persis seperti populasinya, dan estimasi per stratum bisa dilaporkan terpisah.",
        "Kepribadiannya: frame seperti daftar tamu undangan — kalau namamu tidak ada di daftar, kamu tidak bisa masuk, seberapa pun kamu bagian dari 'keluarga'. Survei aplikasi Bank Nusa daftar tamunya = 'pengguna yang membuka aplikasi'; nasabah Agen yang tidak punya smartphone tidak pernah diundang. Stratifikasi seperti memastikan tiap meja (strata) terisi proporsional — bukan 8 orang menumpuk di meja Digital sementara meja Agen kosong. Kasus klasik: Literary Digest 1936 — 2,4 JUTA responden (sampel raksasa!) memprediksi Landon menang atas Roosevelt; frame-nya = pemilik telepon & mobil (orang kaya di era Depresi). Sampel raksasa dari frame yang salah = kesalahan yang presisi.",
        "Kapan memakai: (1) populasi heterogen dan kamu peduli tiap subkelompok (wajib stratifikasi); (2) ada daftar populasi yang lengkap (database nasabah, registrasi). Kapan tidak: populasi homogen (simple random cukup), atau frame tidak ada — survei jalanan/opini publik memakai area sampling atau RDD (random digit dialing) sebagai pengganti.",
      ],
      formula: String.raw`n_h = n\cdot\frac{N_h}{N}, \qquad \hat{p} = \sum_h W_h\,\hat{p}_h \;\; \text{dengan} \;\; W_h = \frac{N_h}{N}`,
      formulaNote: "n_h = sampel untuk stratum h; n = total sampel; N_h, N = ukuran stratum dan populasi. p̂ = estimasi proporsi populasi; W_h = bobot populasi stratum h; p̂_h = proporsi teramati di stratum h. Contoh lab: stratum Digital N = 6.000 dari N = 10.000 → W = 0,6; p̂_Digital = 0,88. Estimasi terbobot = 0,6×0,88 + 0,3×0,72 + 0,1×0,50 = 0,794.",
      tasks: [],
      note: {
        title: "🚨 Mitos: sampel besar = sampel benar",
        type: "pitfall",
        body: "Yang benar: bias TIDAK mengecil dengan n — ia KONSTAN. Literary Digest: n = 2,4 juta, bias frame ~19 poin, salah total. Rumus SE = √(p(1−p)/n) hanya mengukur variansi sampling (noise), bukan bias (kesalahan sistematis). Survei dengan n = 400 dari frame benar mengalahkan n = 10.000 dari frame salah — selalu. Tanya pertama ke survei mana pun bukan 'berapa n-nya?' melainkan 'siapa yang TIDAK BISA menjawab?'",
      },
      hints: [
        "💡 Intuisi: stratifikasi melakukan dua hal sekaligus — menjamin keterwakilan (tidak ada stratum kosong) DAN menaikkan presisi (variansi di dalam stratum homogen lebih kecil daripada variansi populasi).",
      ],
      reference: "Frame = siapa bisa terpilih. Stratifikasi = tiap kelompok terwakili proporsional. n besar tidak menyembuhkan bias.",
    },
    {
      id: "konsep-weighting",
      eyebrow: "Langkah 4 · Konsep",
      title: "Weighting & MoE — Si Penyeimbang Timbangan",
      prose: [
        "Definisi: post-stratification weighting mengoreksi sampel yang komposisinya meleset dari populasi. Bobot stratum h: w_h = (N_h/N) / (n_h/n) — pangsa populasi dibagi pangsa sampel. Responden Agen (10% populasi, 5% sampel) mendapat bobot 2,0: tiap suaranya dihitung dua kali. Estimasi terbobot memakai W_h populasi, bukan n_h sampel — sehingga komposisi sampel yang miring tidak lagi menentukan hasil.",
        "Kepribadiannya: weighting seperti wasit yang menyadari satu tim main dengan 9 orang — ia tidak menambah pemain, ia menghitung gol tim itu dua kali. Berguna untuk koreksi kecil (60/40 menjadi 55/45), berbahaya untuk koreksi besar: bobot 8,0 berarti SATU responden mewakili 8 orang populasi — opininya yang unik (atau salah paham soalnya) diperbesar 8x. Aturan praktis: bobot > 3 = lampu kuning (periksa), > 5 = lampu merah (desain ulang surveinya).",
        "Margin of error menutup kejujuran: MoE = 1,96 × SE × FPC, dengan n_efektif = (Σw)²/Σw² (bobot timpang MENGECILKAN sampel efektif — 400 responden berbobot bisa setara hanya 320 responden acak murni) dan FPC = √((N−n)/(N−1)) (koreksi populasi hingga; diabaikan bila n/N < 5%). Melaporkan 79,4% ± 4,3% jauh lebih jujur daripada mengklaim 84% tanpa MoE.",
      ],
      formula: String.raw`w_h = \frac{N_h/N}{\,n_h/n\,}, \qquad n_{\text{eff}} = \frac{(\sum w_i)^2}{\sum w_i^2}, \qquad \text{MoE} = 1{,}96\cdot\sqrt{\frac{\hat{p}(1-\hat{p})}{n_{\text{eff}}}}\cdot\frac{N-n}{N-1}`,
      formulaNote: "w_h = bobot stratum h (pangsa populasi ÷ pangsa sampel); n_eff = ukuran sampel efektif — bobot yang timpang menurunkan n_eff di bawah n; MoE = margin of error 95%: 1,96 × SE × FPC. Contoh lab: w_Agen = 0,10/0,05 = 2,0; n_eff = 400²/(320×0,75² + 60×2² + 20×2²) = 320; p̂ = 0,794 → MoE = 1,96×√(0,794×0,206/320)×√(9600/9999) ≈ 0,043.",
      tasks: [],
      note: {
        title: "🚨 Mitos: weighting bisa memperbaiki survei yang rusak",
        type: "pitfall",
        body: "Yang benar: weighting mengoreksi KOMPOSISI, bukan SELEKSI di dalam stratum. Bila responden Digital adalah pengguna paling aktif (bukan acak dari semua nasabah Digital), weighting membuat suara mereka mewakili SEMUA nasabah Digital — termasuk yang tidak pernah membuka aplikasi. Bias seleksi intra-stratum tidak bisa diobati bobot. Urutan yang benar: desain dulu (stratifikasi + upaya respons), bobot kemudian — bukan sebaliknya.",
      },
      hints: [
        "💡 Intuisi: n_eff adalah 'n yang sebenarnya'. 400 responden dengan bobot timpang = 320 responden jujur. Setiap kali melihat bobot, tanyakan berapa n_eff-nya — itulah presisi yang kamu bayar.",
        "💡 Intuisi: FPC adalah diskon kejujuran untuk populasi kecil — mensurvei 400 dari 10.000 (4%) hampir tidak dapat diskon; mensurvei 400 dari 800 (50%) MoE-nya menyusut drastis karena kamu hampir sensus.",
      ],
      reference: "Bobot = pangsa populasi ÷ pangsa sampel. Bobot timpang → n_eff turun. Laporkan selalu dengan MoE.",
    },
    {
      id: "lab-survei",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab — Koreksi survei yang miring",
      prose: [
        "Waktunya jadi auditor survei. Data di bawah = kasus Bank Nusa: populasi 10.000 nasabah (Digital 6.000, Cabang 3.000, Agen 1.000), tetapi survei aplikasi hanya menjaring 400 responden yang didominasi Digital. Tugasmu: hitung bobot tiap stratum, estimasi tak-terbobot vs terbobot, dan margin of error 95% untuk estimasi terbobot.",
        "Coba: setelah lolos, ubah responden Agen dari 20 menjadi 5 (mereka makin sulit dijangkau). Bobot Agen menjadi 8,0 — lihat apa yang terjadi pada n_eff dan MoE. Itulah pelajaran bobot ekstrem: satu responden mewakili 8 orang membuat estimasimu rapuh, dan MoE yang jujur akan berteriak.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `bobot` = dict stratum → w_h = (N_h/N)/(n_h/n), dibulatkan 4 desimal" },
        { id: "t2", text: "Hitung `est_tak_terbobot` (rata-rata berbobot n_h) dan `est_terbobot` (berbobot N_h), 4 desimal" },
        { id: "t3", text: "Hitung `n_eff`, lalu cetak `bobot`, kedua estimasi (3 desimal), dan `MoE95` (3 desimal)" },
      ],
      expected: "bobot={'Digital': 0.75, 'Cabang': 2.0, 'Agen': 2.0}\ntak_terbobot=0.837\nterbobot=0.794\nMoE95=0.043",
      code: {
        starter: `# Populasi 10.000 nasabah dalam 3 strata (JANGAN UBAH)
N = {"Digital": 6000, "Cabang": 3000, "Agen": 1000}
# Responden survei aplikasi (JANGAN UBAH) — perhatikan: Agen hampir tak merespons
n = {"Digital": 320, "Cabang": 60, "Agen": 20}
# Proporsi "puas" per stratum dari survei (JANGAN UBAH)
puas = {"Digital": 0.88, "Cabang": 0.72, "Agen": 0.50}

# TULIS KODEMU di bawah ini
bobot =
est_tak_terbobot =
est_terbobot =`,
        lockLines: 8,
        solution: `# Populasi 10.000 nasabah dalam 3 strata (JANGAN UBAH)
N = {"Digital": 6000, "Cabang": 3000, "Agen": 1000}
# Responden survei aplikasi (JANGAN UBAH) — perhatikan: Agen hampir tak merespons
n = {"Digital": 320, "Cabang": 60, "Agen": 20}
# Proporsi "puas" per stratum dari survei (JANGAN UBAH)
puas = {"Digital": 0.88, "Cabang": 0.72, "Agen": 0.50}

# TULIS KODEMU di bawah ini
Ntot = sum(N.values())
ntot = sum(n.values())
bobot = {s: round((N[s] / Ntot) / (n[s] / ntot), 4) for s in N}
est_tak_terbobot = round(sum(puas[s] * n[s] for s in N) / ntot, 4)
est_terbobot = round(sum(puas[s] * N[s] for s in N) / Ntot, 4)
n_eff = ntot ** 2 / sum(n[s] * bobot[s] ** 2 for s in N)
se = (est_terbobot * (1 - est_terbobot) / n_eff) ** 0.5
fpc = ((Ntot - ntot) / (Ntot - 1)) ** 0.5
moe = 1.96 * se * fpc
print(f"bobot={bobot}")
print(f"tak_terbobot={est_tak_terbobot:.3f}")
print(f"terbobot={est_terbobot:.3f}")
print(f"MoE95={moe:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "bobot", value: { Digital: 0.75, Cabang: 2.0, Agen: 2.0 }, label: "`bobot` post-stratifikasi benar", msg: "w_h = pangsa populasi ÷ pangsa sampel. Agen: 0,10/0,05 = 2,0." },
          { kind: "equal", task: "t2", name: "est_tak_terbobot", value: 0.837, tol: 0.001, label: "Estimasi tak-terbobot = 0,837", msg: "Rata-rata berbobot responden: (0,88×320 + 0,72×60 + 0,50×20)/400." },
          { kind: "equal", task: "t2", name: "est_terbobot", value: 0.794, tol: 0.001, label: "Estimasi terbobot = 0,794", msg: "Rata-rata berbobot populasi: 0,6×0,88 + 0,3×0,72 + 0,1×0,50." },
          { kind: "stdout_matches", task: "t3", pattern: "MoE95=0\\.043", label: "MoE95 tercetak = 0,043", msg: "n_eff = 320 (bukan 400!); MoE = 1,96 × SE × FPC." },
        ],
      },
      reference: "Koreksi komposisi via bobot; presisi jujur via n_eff dan MoE. Bobot > 3 = lampu kuning.",
    },
    {
      id: "chart-survei",
      eyebrow: "Langkah 6 · Chart",
      title: "Membaca kemiringan sampel seperti auditor",
      prose: [
        "Chart kiri: komposisi populasi (biru tua) vs komposisi responden (biru muda) per stratum. Chart kanan: estimasi % puas tak-terbobot vs terbobot — garis whisker pada estimasi terbobot = MoE 95%.",
        "Cara membaca: pada chart kiri, bandingkan panjang batang berpasangan per stratum — selisihnya adalah kemiringan seleksi. Digital: 60% populasi tetapi 80% sampel (kelebihan 20 poin); Agen: 10% populasi tetapi 5% sampel (kekurangan separuh). Pada chart kanan, baca posisi batang DAN whisker: batang tak-terbobot 83,7% tidak punya whisker (ketidakjujuran visual — presisi tanpa koreksi), batang terbobot 79,4% ± 4,3%.",
        "Interpretasi: kemiringan 20 poin pada stratum dengan kepuasan tertinggi (Digital 88%) menarik estimasi ke atas sebesar 4,3 poin — persis selisih kedua batang. Whisker ±4,3 berarti klaim 'naik dari 81% tahun lalu' tidak bisa dipertahankan: 79,4% ± 4,3% mencakup 81%. Pelajaran chart ini: tanpa bobot dan MoE, survei adalah mesin pembenar; dengan keduanya, survei menjadi alat ukur.",
      ],
      figure: {
        svg: SURVEY_SVG,
        alt: "Batang komposisi populasi vs sampel per stratum dan dua estimasi kepuasan dengan whisker MoE.",
        caption: "Kiri: kemiringan seleksi per stratum. Kanan: koreksi bobot menggeser estimasi 4,3 poin.",
      },
      tasks: [],
      note: {
        title: "Intuisi: chart kemiringan adalah lie detector survei",
        body: "Sebelum membaca HASIL survei mana pun, minta chart seperti panel kiri: komposisi sampel vs populasi untuk variabel yang diketahui (kanal, region, umur, gender). Tiga heuristik. Pertama: bila selisih > 10 poin pada stratum mana pun, hasil tak-terbobot tidak layak dikutip — minta versi terbobot. Kedua: whisker yang mencakup angka tahun lalu = 'tidak ada perubahan yang terbukti', apa pun kata siaran persnya. Ketiga: stratum dengan n kecil + bobot besar (Agen: n=20, w=2,0) adalah sumber kerapuhan — satu-dua responden yang salah paham soal bisa menggeser estimasi.",
      },
      reference: "Minta selalu: komposisi vs populasi + estimasi terbobot + MoE. Tanpa ketiganya, jangan kutip.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Sensus, stratifikasi, weighting, atau jangan survei?",
      prose: [
        "Lima skenario pemilihan desain:",
        "Skenario 1 — Populasi kecil (< 1.000) dan tiap individu penting (nasabah korporat, karyawan). → Sensus: hubungi semua. Alasan: biaya sensus ≈ biaya survei, dan sampling error menjadi nol.",
        "Skenario 2 — Populasi besar, heterogen, ada daftar lengkap (database nasabah). → Stratified random sampling, alokasi proporsional. Alasan: keterwakilan terjamin + presisi naik; biaya naik sedikit.",
        "Skenario 3 — Sampel sudah terlanjur miring tetapi tiap stratum masih terisi puluhan responden. → Post-stratification weighting + laporkan n_eff dan MoE. Alasan: koreksi kecil sah; yang tidak sah adalah menyembunyikan kemiringannya.",
        "Skenario 4 — Satu stratum hanya terisi < 10 responden (bobot akan > 5). → Desain ulang: oversample stratum itu / ganti kanal survei / gabung stratum. Alasan: bobot raksasa = satu orang mewakili ratusan; weighting di sini adalah riasan di atas luka.",
        "Skenario 5 — Yang ingin diukur adalah PERILAKU (apakah mereka membayar? mengklik?), bukan OPINI. → Jangan survei — pakai data perilaku. Alasan: survei mengukur apa yang orang KATAKAN; data transaksi mengukur apa yang mereka LAKUKAN. Keduanya sering berbeda jauh (stated vs revealed preference).",
        "Aturan praktis 10 detik: kecil → sensus; besar + daftar ada → stratifikasi; terlanjur miring → weighting + MoE jujur; stratum nyaris kosong → desain ulang; mau ukur perilaku → data transaksi, bukan survei.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: menaikkan n untuk 'memperbaiki' survei yang bias",
        type: "pitfall",
        body: "n = 400 → n = 4.000 mengecilkan MoE dari ±4,3% menjadi ±1,4% — tetapi estimasinya tetap 79,4% (atau tetap bias bila frame salah). Uang survei yang benar dihabiskan untuk MEMPERBAIKI FRAME dan RESPONSE RATE (telepon ulang non-responden, insentif, kanal ganda), bukan menambah responden dari sumber yang sama biasnya. Presisi tanpa akurasi = keyakinan yang salah.",
      },
      reference: "Perbaiki frame & respons dulu, tambah n kemudian. Bobot raksasa = desain ulang.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Berapa responden untuk MoE 3%?",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank Nusa (50.000 nasabah KTA) ingin survei kepuasan tahunan dengan margin of error MAKSIMAL ±3% pada tingkat kepercayaan 95%. Biaya survei telepon Rp15.000 per responden yang berhasil diwawancarai; response rate historis 40%. Populasi dibagi 5 region untuk stratifikasi.",
        "Pertanyaan analisis: (1) Hitung n minimal (pakai p = 0,5 untuk aman). (2) Berapa nomor yang harus dihubungi mengingat response rate 40%? (3) Berapa total biaya — dan bandingkan dengan sensus 50.000 nasabah.",
        "Pembahasan: (1) n = z²·p(1−p)/e² = 1,96² × 0,25 / 0,03² = 3,8416 × 0,25 / 0,0009 = 1.067,1 → 1.068 responden. (FPC: n/N = 2,1% < 5%, diabaikan.) Alokasi proporsional per region mengikuti pangsa nasabah region itu. (2) Nomor yang dihubungi = 1.068 / 0,40 = 2.670. (3) Biaya = 1.068 × Rp15.000 = Rp16,02 juta. Sensus = 50.000 × Rp15.000 = Rp750 juta — 47x lebih mahal untuk presisi yang untuk keputusan direksi tidak dibutuhkan. Inilah ekonomi survei: Rp16 juta membeli ±3% kejujuran; Rp750 juta membeli kesombongan.",
        "Catatan desain: p = 0,5 adalah pilihan konservatif (variansi maksimum). Bila dari tahun lalu p̂ ≈ 0,8, n bisa turun ke 1,96²×0,8×0,2/0,0009 ≈ 683 — tetapi jangan terlalu agresif: bila p sebenarnya bergeser, MoE jebol.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Rumus n yang sama dipakai untuk menentukan ukuran sampel audit portofolio: berapa file kredit harus di-review untuk mengestimasi NPL ±2%? Bedanya: di audit, 'response rate' diganti 'file tidak ditemukan' — dan file yang hilang justru yang paling berisiko (adverse selection arsip). Stratifikasi file audit berdasarkan risk rating, bukan acak murni.",
      },
      reference: "n = z²p(1−p)/e². Response rate menentukan berapa yang dihubungi. Sensus jarang sepadan.",
    },
    {
      id: "pendalaman-neyman",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "Alokasi Neyman & design effect: survei tingkat lanjut",
      prose: [
        "Alokasi proporsional bukan yang paling efisien bila variansi antar-stratum berbeda jauh. Alokasi Neyman: n_h ∝ N_h × S_h — stratum yang besar DAN bervariasi mendapat sampel lebih. Contoh: kepuasan Agen sangat bervariasi (S = 0,25) sementara Digital homogen (S = 0,08) → Neyman memberi Agen porsi lebih besar dari proporsional, karena di sanalah ketidakpastian terbesar. Syaratnya: butuh estimasi S_h dari pilot atau tahun lalu — tanpa itu, proporsional adalah default yang aman.",
        "Design effect (deff): pengali variansi akibat desain kompleks (cluster sampling, weighting). deff = 1 + (m−1)ρ untuk cluster — mensurvei 40 orang dari 10 kelurahan (m = 40, korelasi intra-cluster ρ = 0,05) memberi deff = 2,95: n_eff = n/2,95! Survei klaster yang terlihat besar bisa setara sepertiganya. Selalu tanyakan deff pada vendor survei — vendor yang tidak bisa menjawabnya tidak mengerti presisinya sendiri.",
        "Praktik senior: non-response BUKAN missing at random. Callback ganda pada sub-sampel non-responden (mis. 100 dari yang tidak menjawab, dengan insentif lebih besar) mengestimasi bias non-respons secara langsung — jauh lebih kredibel daripada asumsi. Aturan: response rate < 50% tanpa studi non-respons = survei yang hasilnya harus dibaca dengan helm.",
      ],
      formula: String.raw`n_h \propto N_h \cdot S_h, \qquad \text{deff} = 1 + (m-1)\rho`,
      formulaNote: "Alokasi Neyman: n_h = sampel stratum h proporsional terhadap N_h (ukuran) × S_h (simpangan baku di stratum). deff = design effect; m = ukuran klaster; ρ = korelasi intra-cluster. n_eff = n/deff. Contoh: 10 klaster × 40 orang, ρ = 0,05 → deff = 2,95 → n = 400 setara n_eff ≈ 136.",
      tasks: [],
      reference: "Neyman = alokasi ke variansi terbesar. deff = pajak desain kompleks atas presisi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan terakhir. Setiap opsi menjelaskan kenapa benar atau salah — baca semuanya, termasuk opsi yang tidak kamu pilih.",
      ],
      tasks: [],
      summary: [
        "Sampling frame menentukan siapa BISA terpilih — frame salah = bias permanen yang tidak sembuh oleh n besar.",
        "Stratified sampling: bagi populasi homogen per stratum, alokasi proporsional n_h = n·N_h/N.",
        "Post-stratification weighting: w_h = pangsa populasi ÷ pangsa sampel; koreksi komposisi, bukan seleksi intra-stratum.",
        "Bobot timpang menurunkan n_eff = (Σw)²/Σw²; laporkan selalu estimasi ± MoE (dengan FPC bila n/N ≥ 5%).",
        "Bobot > 3 = lampu kuning, > 5 = desain ulang. Untuk mengukur perilaku, pakai data transaksi — bukan survei.",
      ],
      quiz: [
        {
          q: "Di lab, bobot stratum Agen = 2,0. Artinya?",
          options: [
            { text: "Tiap responden Agen dihitung dua kali — karena mereka hanya 5% sampel padahal 10% populasi", why: "Benar: w = 0,10/0,05 = 2,0. Bobot adalah pengakuan jujur bahwa sampelmu miring, sekaligus koreksinya.", correct: true },
            { text: "Pendapat nasabah Agen dua kali lebih penting dari nasabah Digital", why: "Salah: bobot soal KETERWAKILAN, bukan soal pentingnya pendapat. Semua suara sama penting; bobot hanya menyeimbangkan porsi." },
            { text: "Survei harus mengulang pengambilan sampel Agen", why: "Salah: w = 2,0 masih di zona aman (< 3). Desain ulang baru dipertimbangkan bila bobot > 5." },
            { text: "Estimasi Agen tidak bisa dipakai", why: "Salah: n = 20 masih cukup untuk estimasi stratum dengan MoE yang dilaporkan jujur." },
          ],
        },
        {
          q: "Estimasi tak-terbobot 83,7% vs terbobot 79,4%. Mana yang dilaporkan ke direksi?",
          options: [
            { text: "83,7% — lebih tinggi, kabar baik", why: "Salah: memilih angka karena enak didengar adalah awal dari setiap skandal data. 83,7% mengukur komposisi sampel yang miring.", correct: false },
            { text: "79,4% ± 4,3% — estimasi terbobot dengan MoE jujur", why: "Benar: 79,4% mengoreksi kemiringan komposisi; ±4,3% mengakui presisinya. Direksi berhak atas angka yang benar, bukan yang enak.", correct: true },
            { text: "Rata-rata keduanya: 81,55%", why: "Salah: rata-rata dari angka benar dan angka bias = angka bias yang diencerkan. Tidak ada teori yang mendukungnya." },
            { text: "Keduanya, biar direksi pilih sendiri", why: "Salah: menyerahkan pilihan metodologi ke non-teknisi = abdicasi. Tugas analis adalah merekomendasikan yang benar dengan alasan." },
          ],
        },
        {
          q: "Berapa responden minimal untuk MoE ≤ 3% pada 95% (populasi besar, p = 0,5)?",
          options: [
            { text: "≈ 1.068 — dari n = 1,96² × 0,25 / 0,03²", why: "Benar: 3,8416 × 0,25 / 0,0009 = 1.067,1 → bulatkan ke atas 1.068. p = 0,5 = skenario variansi maksimum (aman).", correct: true },
            { text: "≈ 400 — standar industri", why: "Salah: 'standar industri' bukan rumus. n = 400 memberi MoE ≈ 4,9%, bukan 3%." },
            { text: "≈ 10.000 — 20% populasi", why: "Salah: presisi tumbuh dengan AKAR n; 10.000 responden untuk MoE 3% adalah pemborosan ~9x." },
            { text: "Tidak bisa dihitung tanpa data pilot", why: "Salah: p = 0,5 memberi batas atas yang aman tanpa pilot." },
          ],
        },
        {
          q: "Pelajaran utama Literary Digest 1936 (2,4 juta responden, prediksi salah) untuk survei modern?",
          options: [
            { text: "Jangan survei lewat telepon", why: "Salah: medianya bukan masalah; frame-nya yang salah (pemilik telepon/mobil = orang kaya era Depresi)." },
            { text: "Bias frame tidak sembuh oleh n besar — tanya dulu 'siapa yang tidak bisa menjawab?'", why: "Benar: 2,4 juta responden dengan bias 19 poin = kesalahan yang sangat presisi. n mengecilkan noise, bukan bias.", correct: true },
            { text: "Survei selalu tidak bisa dipercaya", why: "Salah: survei dengan frame benar dan metodologi jujur (seperti polling modern yang baik) bekerja. Nihilisme bukan pelajaran." },
            { text: "Harus selalu pakai weighting", why: "Salah: weighting tidak ada di 1936 dan tidak akan menyelamatkan frame yang separah itu." },
          ],
        },
        {
          q: "Ubah responden Agen di lab dari 20 menjadi 5. Apa yang terjadi?",
          options: [
            { text: "Bobot Agen menjadi 8,0; n_eff anjlok; MoE membengkak — estimasi rapuh", why: "Benar: w = 0,10/0,0125 = 8,0 — lima orang mewakili seribu. Satu responden yang salah paham soal menggeser segalanya. Inilah lampu merah.", correct: true },
            { text: "Tidak ada efek — weighting otomatis menanganinya", why: "Salah: weighting mengoreksi komposisi tetapi meledakkan variansi. 'Otomatis tertangani' adalah ilusi." },
            { text: "Estimasi menjadi lebih akurat karena bobot lebih besar", why: "Salah: bobot lebih besar = ketergantungan lebih besar pada sedikit orang = presisi lebih buruk, bukan lebih baik." },
            { text: "MoE mengecil karena stratum Agen lebih homogen", why: "Salah: tidak ada informasi tentang homogenitas; yang pasti n_eff turun." },
          ],
        },
        {
          q: "Kapan koreksi populasi hingga (FPC) benar-benar penting?",
          options: [
            { text: "Ketika n/N ≥ 5% — sampel adalah fraksi besar populasi (mendekati sensus)", why: "Benar: FPC = √((N−n)/(N−1)); n/N kecil → FPC ≈ 1 (diabaikan). n = 400 dari N = 800 → FPC ≈ 0,71, MoE menyusut 29%.", correct: true },
            { text: "Ketika populasi sangat besar (N > 1 juta)", why: "Salah: justru ketika N besar, n/N kecil dan FPC ≈ 1 — tidak penting." },
            { text: "Ketika response rate rendah", why: "Salah: response rate soal bias non-respons, bukan soal fraksi populasi." },
            { text: "FPC selalu penting dan wajib dihitung", why: "Salah: untuk survei nasional (n/N < 0,1%), FPC = 0,9995 — menghitungnya adalah presisi palsu." },
          ],
        },
      ],
      next: { label: "A321 — Marketing Mix Modeling", href: "/v2/learn/a321-marketing-mix-modeling" },
    },
  ],
};
