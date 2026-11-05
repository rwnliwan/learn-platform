import type { V2Lesson } from "../lib/types";

// -- Figure: conversion rate kontrol vs treatment + CI 95% (data lab) ------
const B21_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Conversion rate kontrol vs treatment dengan interval kepercayaan 95 persen"><g stroke="var(--chart-grid)" stroke-width="1"><line x1="70" y1="250.0" x2="500" y2="250.0"/><line x1="70" y1="186.7" x2="500" y2="186.7"/><line x1="70" y1="123.3" x2="500" y2="123.3"/><line x1="70" y1="60.0" x2="500" y2="60.0"/></g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="62" y="254.0">8%</text><text x="62" y="190.7">10%</text><text x="62" y="127.3">12%</text><text x="62" y="64.0">14%</text></g><rect x="155.0" y="174.0" width="70" height="76.0" fill="var(--c1)" opacity="0.75"/><line x1="190" y1="147.1" x2="190" y2="200.9" stroke="var(--chart-text)" stroke-width="2"/><line x1="176" y1="147.1" x2="204" y2="147.1" stroke="var(--chart-text)" stroke-width="2"/><line x1="176" y1="200.9" x2="204" y2="200.9" stroke="var(--chart-text)" stroke-width="2"/><text x="190" y="166.0" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">10.4%</text><text x="190" y="272" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">Kontrol</text><rect x="345.0" y="132.8" width="70" height="117.2" fill="var(--c2)" opacity="0.75"/><line x1="380" y1="104.7" x2="380" y2="161.0" stroke="var(--chart-text)" stroke-width="2"/><line x1="366" y1="104.7" x2="394" y2="104.7" stroke="var(--chart-text)" stroke-width="2"/><line x1="366" y1="161.0" x2="394" y2="161.0" stroke="var(--chart-text)" stroke-width="2"/><text x="380" y="124.8" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">11.7%</text><text x="380" y="272" text-anchor="middle" font-size="12" font-family="var(--font-ui)" fill="var(--chart-text)">Treatment</text><line x1="70" y1="142.3" x2="500" y2="142.3" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="6,4"/><text x="500" y="136.3" text-anchor="end" font-size="11" font-family="var(--font-ui)" fill="var(--chart-text)">MDE bisnis +1pp</text></svg>`;

export const b21: V2Lesson = {
  slug: "b21-ab-testing-terapan",
  track: "Probabilitas",
  module: "Inferensi Terapan",
  title: "A/B Testing Terapan: Dari Hipotesis ke Keputusan Ship",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "p = 0,038, tim bersorak — dan keputusannya tetap salah",
      prose: [
        "Rina, product analyst di sebuah bank digital, baru meluncurkan desain ulang tombol checkout. Tiga hari setelah eksperimen jalan, ia membuka dashboard: conversion naik dari 10,4% ke 11,7%, p-value 0,038. Di bawah ambang 5% — signifikan! Slack tim ramai: \"SHIP! 🚀\" Rina hampir menekan tombol rilis. Untung ia menunda satu jam untuk menuliskan dokumentasi — dan di jam itulah dua hal aneh muncul.",
        "Keanehan pertama: ia baru sadar dirinya membuka dashboard SETIAP HARI sejak eksperimen dimulai, dan hari ini adalah hari pertama angkanya hijau. Ia tidak merencanakan \"berhenti saat signifikan\" — tetapi itulah yang baru saja terjadi. Keanehan kedua: alokasi trafik ternyata 52/48, bukan 50/50 seperti yang direncanakan. Randomisasi yang bocor sedikit. Dua keanehan kecil, satu kesimpulan besar: p = 0,038 itu dihitung dengan asumsi SATU kali melihat data dan randomisasi sempurna. Kedua asumsi itu sudah dilanggar sebelum angka sempat dibaca.",
        "Twist-nya: tidak ada yang salah dengan aritmetikanya — z-test-nya benar, p-value-nya benar. Yang salah adalah KEPUTUSANNYA: memperlakukan angka yang lahir dari proses yang cacat seolah-olah ia lahir dari eksperimen yang bersih. Lesson ini tentang seluruh disiplin di sekitar satu rumus sederhana: menulis hipotesis sebelum data dilihat, menentukan efek minimum yang bermakna bisnis, menghitung ukuran sampel, menolak godaan mengintip, dan memeriksa integritas randomisasi. Rumusnya mudah; disiplinnya yang membedakan analis junior dari yang senior.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini penting untuk analis risiko",
        type: "risk",
        body: "A/B testing adalah cara industri mengambil keputusan berisiko dengan data: pricing, limit kredit, desain antifraud. Setiap keputusan ship yang diambil dari eksperimen cacat adalah risiko yang dibungkus kemasan statistik. Di credit risk, 'varian menang' yang sebenarnya noise bisa berarti menyetujui ribuan debitur berisiko — biaya kesalahannya bukan sekadar angka di dashboard.",
      },
      reference: "p-value yang valid butuh: satu kali baca hasil + randomisasi utuh. Langgar keduanya = angkanya hiasan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Lima hal yang bisa kamu lakukan setelah lesson ini: (1) menulis hipotesis nol/alternatif, metrik primer, metrik guardrail, dan MDE sebelum eksperimen berjalan; (2) menghitung ukuran sampel dari power yang diinginkan; (3) menjalankan z-test dua proporsi + selang kepercayaan selisih; (4) mendeteksi peeking dan SRM (sample ratio mismatch); (5) memutuskan ship/tidak dengan menggabungkan signifikansi statistik dan materialitas bisnis.",
        "Rutenya: cerita, bekal ringkas, tiga konsep (hipotesis & metrik; power & MDE; jebakan peeking & SRM), lab Pyodide (analisis eksperimen sintetis sampai vonis), chart CI dengan panduan baca, peta keputusan, mini-case limit transfer, kuis, rangkuman. Estimasi 58 menit; lab-nya sekitar 15 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Teorema Limit Pusat (dari B11): rata-rata sampel berukuran besar menyebar mendekati normal — inilah yang membenarkan z-test. Proporsi konversi adalah rata-rata dari variabel Bernoulli (1 = konversi, 0 = tidak), jadi untuk n ribuan, selisih dua proporsi juga mendekati normal. p-value = peluang melihat hasil seekstrim ini (atau lebih) JIKA hipotesis nol benar — bukan peluang hipotesis nol benar. Selang kepercayaan 95% = rentang nilai efek yang kompatibel dengan data.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: A/B testing = sidang pengadilan untuk ide produk. H0 = 'ide ini tidak berpengaruh' (terdakwa tak bersalah). p-value kecil = bukti kuat; tetapi bukti kuat untuk efek SEKECIL APA PUN bukan alasan menghukum — di sinilah MDE masuk sebagai 'ambang kerugian yang layak dituntut'.",
      ],
      reference: "Bekal: CLT → proporsi besar ≈ normal; p-value = P(data seekstrim ini | H0), bukan P(H0 | data).",
    },
    {
      id: "konsep-hipotesis",
      eyebrow: "Langkah 3 · Konsep",
      title: "Hipotesis, metrik primer, dan guardrail — Si Kontrak Tertulis",
      prose: [
        "Definisi: sebelum satu baris data eksperimen dilihat, tulis KONTRAK: H0 (tidak ada perbedaan, p_t = p_c), H1 (ada perbedaan), METRIK PRIMER (satu saja — yang menentukan menang/kalah, mis. conversion checkout), METRIK GUARDRAIL (yang tidak boleh memburuk, mis. complaint rate, refund rate), MDE — minimum detectable effect, efek terkecil yang bermakna bisnis (mis. +1pp), dan ATURAN BERHENTI (kapan eksperimen dibaca: setelah n tetap tercapai, bukan 'saat hijau').",
        "Kepribadiannya: kontrak ini seperti wasit yang ditunjuk SEBELUM pertandingan. Tanpa wasit, tim yang kalah bisa menggeser gawang setelah bola ditendang: ganti metrik primer ke yang hijau (HARKing — hypothesizing after results known), atau berhenti lebih awal saat angka bagus. Kontrak tertulis bukan birokrasi — ia satu-satunya yang membuat p-value jujur, karena p-value mengasumsikan aturan mainnya tetap.",
        "Kapan memakai: selalu, untuk setiap eksperimen. Contoh konkret: eksperimen tombol checkout — primer: conversion (transaksi/sesi); guardrail: complaint rate dan rata-rata nilai transaksi (jangan sampai conversion naik karena voucher disalahgunakan menurunkan nilai); MDE: +1pp (di bawah itu, biaya engineering tidak kembali); aturan berhenti: baca SEKALI setelah 10.000 sesi per varian tercapai. Tulis di dokumen, tandatangani (secara kiasan), baru jalankan.",
      ],
      tasks: [],
      note: {
        title: "🚨 Mitos: metrik primer boleh dipilih setelah melihat data",
        type: "pitfall",
        body: "Yang benar: memilih metrik pemenang SETELAH melihat hasil = menguji 10 hipotesis lalu melaporkan 1 yang signifikan. Peluang false positive bukan lagi 5% — dengan 10 metrik, peluang minimal satu yang 'signifikan' secara kebetulan ≈ 40%. Inilah p-hacking versi korporat. Solusinya: satu metrik primer ditulis di awal; metrik lain = eksplorasi, bukan vonis.",
      },
      hints: [
        "💡 Intuisi: guardrail adalah sabuk pengaman. Conversion naik 2pp tetapi complaint rate naik 5x = eksperimen yang 'menang' sambil membakar kepercayaan nasabah. Analis senior selalu melaporkan keduanya berdampingan — kemenangan tanpa guardrail adalah kemenangan yang belum diaudit.",
      ],
      reference: "Kontrak pra-eksperimen: H0/H1, 1 metrik primer, guardrail, MDE, aturan berhenti. Tulis dulu, baru jalan.",
    },
    {
      id: "konsep-power",
      eyebrow: "Langkah 4 · Konsep",
      title: "Power & MDE — Si Perencana yang Membosankan tapi Menyelamatkan",
      prose: [
        "Definisi: POWER = peluang eksperimenmu mendeteksi efek sebesar MDE jika efek itu memang ada (standar industri: 80%). MDE kecil = butuh sampel BESAR. Rumus ukuran sampel per grup untuk dua proporsi:",
      ],
      formula: String.raw`n = \frac{(z_{1-\alpha/2} + z_{1-\beta})^2 \cdot [p_1(1-p_1) + p_2(1-p_2)]}{\Delta^2}`,
      formulaNote: "n = sampel per grup; z_{1-α/2} = 1,96 untuk α = 5% (dua sisi); z_{1-β} = 0,84 untuk power 80%; p1, p2 = proporsi baseline dan target; Δ (MDE) = selisih terkecil yang bermakna bisnis. Contoh angka: baseline 10%, target 11% (Δ = 0,01) → n ≈ (1,96+0,84)² × [0,09 + 0,0979] / 0,0001 ≈ 14.700 per grup. Perhatikan Δ di penyebut DIKUADRATKAN: MDE setengahnya (0,5pp) → sampel EMPAT kali lipat. Inilah kenapa MDE ambisius tanpa trafik cukup = eksperimen yang ditakdirkan 'tidak signifikan'.",
      tasks: [],
      note: {
        title: "🚨 Mitos: 'tidak signifikan' = 'tidak ada efek'",
        type: "pitfall",
        body: "Yang benar: 'tidak signifikan' sering berarti 'sampel kurang untuk mendeteksi efek sebesar MDE'. Eksperimen underpowered tidak membuktikan apa-apa — ia hanya tidak punya cukup saksi. Sebelum menyimpulkan 'ide ini gagal', cek dulu: apakah n mencapai hitungan power? Bila tidak, vonis yang jujur adalah 'belum tahu', bukan 'tidak ada efek'.",
      },
      hints: [
        "💡 Intuisi: power analysis menjawab pertanyaan paling mahal dalam eksperimen: 'berapa lama kita harus menunggu?' Tanpa itu, tim terjebak di antara dua dosa — berhenti terlalu cepat (melewatkan pemenang) atau menunggu terlalu lama (membuang trafik pada ide pecundang).",
      ],
      reference: "Power 80% standar; MDE di penyebut kuadrat — MDE separuh → n empat kali lipat.",
    },
    {
      id: "konsep-jebakan",
      eyebrow: "Langkah 5 · Konsep",
      title: "Peeking & SRM — Dua Pembunuh Senyap Validitas",
      prose: [
        "PEEKING: mengecek hasil berkali-kali dan berhenti saat pertama hijau. Setiap pengecekan adalah kesempatan baru bagi noise untuk terlihat signifikan. Simulasi klasik: tanpa efek apa pun, cek 5 kali selama eksperimen → peluang false positive melonjak dari 5% menjadi ~14%. Peeking bukan 'rajin memantau' — ia p-hacking yang tidak disengaja. Obatnya: aturan berhenti tertulis + SATU kali baca hasil; bila butuh monitoring, pakai sequential testing yang benar (alpha spending), bukan intuisi.",
        "SRM — Sample Ratio Mismatch: alokasi trafik menyimpang dari rencana (mestinya 50/50, nyatanya 52/48). Uji: chi-square kesesuaian terhadap rasio yang direncanakan. SRM = alarm kebakaran randomisasi: bug redirect, bot yang hanya masuk satu varian, atau caching yang merusak assignment. Aturan keras: bila SRM terdeteksi, JANGAN baca hasil metriknya — datanya sudah terkontaminasi. Perbaiki pipa randomisasi, buang periode tercemar, ulangi. Membaca hasil di atas SRM seperti membaca termometer yang dicelup air panas.",
        "Contoh angka SRM: rencana 50/50 dari 10.000 sesi → harapan 5.000/5.000; realisasi 5.200/4.800. Chi-square = (5200−5000)²/5000 + (4800−5000)²/5000 = 16 → p < 0,001. Sangat signifikan — randomisasi pasti bocor. Eksperimen ini selesai sebelum dimulai.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: 'SRM kecil tidak apa-apa, kan cuma 2%'",
        type: "pitfall",
        body: "Yang benar: SRM 52/48 pada n = 10.000 adalah penyimpangan 4 standar deviasi — mustahil terjadi karena kebetulan (p < 0,001). 'Kecil' dalam persentase bisa 'besar' dalam bukti statistik. Dan arah biasnya tidak diketahui: varian yang kebanjiran trafik bisa jadi kebanjiran bot, kebanjiran jam sibuk, atau kebanjiran apa pun — efek yang terukur jadi tak terinterpretasi.",
      },
      hints: [
        "💡 Intuisi: urutan kerja analis eksperimen yang benar: (1) cek SRM — lolos? (2) cek guardrail — aman? (3) baru baca metrik primer. Kebanyakan analis melompat ke langkah 3 karena di sanalah 'kabar baiknya'. Disiplin = membaca kabar buruk dulu.",
      ],
      reference: "Peeking: cek berulang → false positive membengkak. SRM: rasio trafik ≠ rencana → buang eksperimen, jangan baca hasilnya.",
    },
    {
      id: "lab-uji",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Adili eksperimenmu sendiri",
      prose: [
        "Waktunya jadi wasit. Data di bawah mensimulasikan eksperimen tombol checkout: 5.000 sesi kontrol (520 konversi) vs 5.000 sesi treatment (585 konversi). MDE bisnis = 1pp, α = 5%. Tugasmu: hitung z-test dua proporsi (pooled SE di bawah H0), p-value dua sisi, selang kepercayaan 95% selisih (SE tak-terpool), lalu jatuhkan vonis: SHIP hanya bila signifikan DAN batas bawah CI melewati MDE.",
        "Coba: setelah lolos, ubah conv_t menjadi 620 lalu 560. Pada titik mana vonis berubah dari 'tidak material' menjadi 'ship'? Dan pada titik mana ia menjadi 'tidak signifikan'? Rasakan bedanya: signifikansi menjawab 'apakah efeknya nyata', materialitas menjawab 'apakah efeknya layak dibayar'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p_c`, `p_t`, `diff`, `p_pool`, `se` (pooled), dan `z`" },
        { id: "t2", text: "Hitung `p_value` dua sisi dari z memakai fungsi galat `erf`" },
        { id: "t3", text: "Hitung `ci_low` dan `ci_high`: CI 95% selisih dengan SE tak-terpool" },
        { id: "t4", text: "Tentukan `verdict`, `signifikan`, dan `material` sesuai aturan vonis di atas" },
      ],
      expected: "p_c=0.1040 p_t=0.1170 diff=0.0130\nz=2.073 p_value=0.0381\nCI95=(0.0007, 0.0253)\nverdict=TIDAK SHIP — lanjutkan eksperimen (signifikan=True, material=False)",
      code: {
        starter: `from math import erf, sqrt
# Data eksperimen sintetis (JANGAN UBAH)
n_c, conv_c = 5000, 520     # kontrol: tombol checkout lama
n_t, conv_t = 5000, 585     # treatment: tombol checkout baru
mde = 0.01                  # efek minimum yang bermakna bisnis: 1pp
alpha = 0.05                # ambang signifikansi

# TULIS KODEMU
p_c = ...
p_t = ...
diff = ...
p_pool = ...
se = ...
z = ...
Phi = lambda x: 0.5 * (1 + erf(x / sqrt(2)))
p_value = ...
se_diff = ...
ci_low = ...
ci_high = ...
signifikan = ...
material = ...
verdict = ...
print(f"p_c={p_c:.4f} p_t={p_t:.4f} diff={diff:.4f}")
print(f"z={z:.3f} p_value={p_value:.4f}")
print(f"CI95=({ci_low:.4f}, {ci_high:.4f})")
print(f"verdict={verdict} (signifikan={signifikan}, material={material})")`,
        lockLines: 7,
        solution: `from math import erf, sqrt
# Data eksperimen sintetis (JANGAN UBAH)
n_c, conv_c = 5000, 520     # kontrol: tombol checkout lama
n_t, conv_t = 5000, 585     # treatment: tombol checkout baru
mde = 0.01                  # efek minimum yang bermakna bisnis: 1pp
alpha = 0.05                # ambang signifikansi

# TULIS KODEMU
p_c = conv_c / n_c
p_t = conv_t / n_t
diff = p_t - p_c
p_pool = (conv_c + conv_t) / (n_c + n_t)
se = sqrt(p_pool * (1 - p_pool) * (1 / n_c + 1 / n_t))
z = diff / se
Phi = lambda x: 0.5 * (1 + erf(x / sqrt(2)))
p_value = 2 * (1 - Phi(abs(z)))
se_diff = sqrt(p_c * (1 - p_c) / n_c + p_t * (1 - p_t) / n_t)
ci_low = diff - 1.96 * se_diff
ci_high = diff + 1.96 * se_diff
signifikan = p_value < alpha
material = ci_low > mde
verdict = "SHIP" if (signifikan and material) else "TIDAK SHIP \\u2014 lanjutkan eksperimen"
print(f"p_c={p_c:.4f} p_t={p_t:.4f} diff={diff:.4f}")
print(f"z={z:.3f} p_value={p_value:.4f}")
print(f"CI95=({ci_low:.4f}, {ci_high:.4f})")
print(f"verdict={verdict} (signifikan={signifikan}, material={material})")`,
        checks: [
          { kind: "equal", task: "t1", name: "z", value: 2.0733, tol: 0.005, label: "`z` ≈ 2,073", msg: "z-test dua proporsi dengan pooled SE." },
          { kind: "equal", task: "t2", name: "p_value", value: 0.0381, tol: 0.001, label: "`p_value` ≈ 0,038", msg: "p-value dua sisi dari z via erf." },
          { kind: "equal", task: "t3", name: "ci_low", value: 0.0007, tol: 0.0005, label: "`ci_low` ≈ 0,0007", msg: "Batas bawah CI 95% selisih (SE tak-terpool)." },
          { kind: "defined", task: "t4", name: "verdict", label: "`verdict` terdefinisi", msg: "Tentukan vonis ship/tidak." },
          { kind: "stdout_matches", task: "t4", label: "Vonis TIDAK SHIP", msg: "Signifikan tapi tidak material → jangan ship.", pattern: "verdict=TIDAK SHIP" },
        ],
      },
      hints: [
        "💡 p-value dua sisi: 2 × (1 − Φ(|z|)), dengan Φ CDF normal standar dari erf. Jangan lupa abs — uji dua sisi peduli besar penyimpangan, bukan arahnya.",
        "💡 Dua SE berbeda untuk dua keperluan: pooled (di bawah H0, untuk z-test) vs tak-terpool (untuk CI selisih, tanpa asumsi H0). Tertukar = jawaban sedikit meleset; pahami kenapa keduanya ada.",
      ],
      reference: "z = diff / SE_pooled; p dua sisi via erf; CI pakai SE tak-terpool; ship = signifikan DAN material.",
    },
    {
      id: "chart-ci",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca ketidakpastian, bukan batangnya",
      prose: [
        "Chart di bawah memvisualkan hasil lab-mu: tinggi batang = estimasi conversion; garis vertikal (whisker) = selang kepercayaan 95%; garis putus-putus = ambang MDE bisnis (+1pp di atas kontrol).",
        "Cara membaca: batang treatment (11,7%) memang lebih tinggi dari kontrol (10,4%). Whisker menunjukkan rentang nilai yang kompatibel dengan data: kontrol 9,55–11,25%, treatment 10,81–12,59%. Perhatikan whisker keduanya BERTUMPANG TINDIH di zona 10,81–11,25% — secara visual, perbedaan kedua grup tidak meyakinkan. Garis MDE di 11,4%: estimasi titik treatment melewatinya, tetapi batas BAWAH whisker treatment (10,81%) berada di bawahnya.",
        "Interpretasi: inilah beda 'signifikan' vs 'material' dalam bentuk gambar. p = 0,038 berkata efeknya kemungkinan nyata (whisker nyaris tidak mencakup nol untuk SELISIH — CI selisih (0,07pp; 2,53pp) tidak memuat 0). Tetapi 'nyata' ≠ 'cukup besar': dengan keyakinan 95%, efek sebenarnya bisa sekecil 0,07pp — jauh di bawah MDE 1pp yang dibutuhkan bisnis. Vonis yang jujur: lanjutkan eksperimen sampai CI menyempit, atau terima bahwa ide ini pemenang kecil yang tidak layak dibayar. Chart ini juga mengajarkan kebiasaan membaca: analis junior membandingkan TINGGI BATANG; analis senior membandingkan WHISKER.",
      ],
      figure: {
        svg: B21_SVG,
        alt: "Diagram batang conversion kontrol 10,4% vs treatment 11,7% dengan whisker CI 95% yang bertumpang tindih, dan garis MDE +1pp.",
        caption: "Estimasi vs ketidakpastian: whisker bertumpang tindih, batas bawah CI treatment di bawah garis MDE (data sintetis lab).",
      },
      tasks: [],
      reference: "Batang = estimasi; whisker = ketidakpastian. Keputusan dibaca dari whisker, bukan batang.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Uji apa untuk masalah apa?",
      prose: [
        "Empat skenario pemilihan uji:",
        "Skenario 1 — Metrik berupa proporsi (conversion, click-through, default rate) dengan n ribuan per grup. → z-test dua proporsi (lab ini). Alasan: CLT membuat selisih proporsi mendekati normal; pooled SE tepat di bawah H0.",
        "Skenario 2 — Metrik berupa rata-rata kontinu (nilai transaksi, durasi sesi) dengan n besar. → t-test dua sampel (Welch). Alasan: varians kedua grup boleh beda; untuk n besar hasilnya ≈ z-test, tetapi t-test jujur soal derajat kebebasan.",
        "Skenario 3 — Event langka atau n kecil (fraud rate 0,1%, n ratusan). → Fisher exact test atau pendekatan Bayesian. Alasan: aproksimasi normal runtuh saat hitungan sukses < 5–10; z-test memberi p-value palsu yang terlalu optimistis.",
        "Skenario 4 — Butuh keputusan cepat / monitoring kontinu (rampung dalam hitungan jam). → Sequential testing dengan alpha spending (mis. O'Brien-Fleming). Alasan: satu-satunya cara 'mengintip' yang sah — total false positive tetap terkendali karena ambangnya disesuaikan di tiap interim.",
        "Aturan praktis 10 detik: tulis H0 + metrik primer + guardrail + MDE + n SEBELUM jalan; cek SRM dulu, guardrail kedua, primer terakhir; baca hasil SEKALI; ship = signifikan DAN material.",
      ],
      tasks: [],
      note: {
        title: "🚨 Sering salah: memakai z-test untuk event langka",
        type: "pitfall",
        body: "Contoh: fraud rate 3 dari 2.000 vs 7 dari 2.000 — z-test memberi p ≈ 0,20 yang 'kelihatan valid', tetapi aproksimasi normal di ekor tipis seperti ini tidak bisa dipercaya. Aturan jempol: bila np < 5 di grup mana pun, tinggalkan z-test. Pakai Fisher exact. Rumus yang salah konteks lebih berbahaya daripada tidak ada rumus.",
      },
      reference: "Proporsi+n besar → z; rata-rata → t; langka/kecil → Fisher/Bayes; monitoring → sequential.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Limit transfer baru: menang statistik, kalah bisnis?",
      prose: [
        "Skenario (sintetis, untuk latihan): Bank digital menguji kenaikan limit transfer harian dari Rp10 juta ke Rp25 juta. Hipotesis: limit lebih longgar → volume transaksi naik. Kontrak pra-eksperimen: primer = rata-rata volume transaksi per nasabah aktif; guardrail = fraud loss rate (tidak boleh naik); MDE = +Rp150 ribu per nasabah per bulan (di bawah itu, biaya risiko operasional tidak kembali); n = 20.000 per grup; baca SEKALI. Hasil setelah 2 minggu: selisih +Rp210 ribu, p = 0,03, CI 95% = (+Rp20 ribu; +Rp400 ribu). Guardrail: fraud loss rate naik dari 0,08% ke 0,11% (p = 0,04).",
        "Pertanyaan analisis: (1) Apakah eksperimen ini 'menang'? (2) Keputusan ship yang tepat? (3) Apa yang harus dicek sebelum vonis final?",
        "Pembahasan: (1) Secara sempit: ya — primer signifikan (p < 0,05) dan estimasi titik (+Rp210 ribu) melewati MDE. Tetapi CI bawah (+Rp20 ribu) jauh di bawah MDE +Rp150 ribu — efeknya mungkin nyata tetapi terlalu kecil untuk membayar biayanya. (2) Vonis: TIDAK SHIP dalam bentuk sekarang. Dua alasan independen: tidak material (CI bawah < MDE) DAN guardrail memburuk signifikan (fraud loss +37,5% relatif). Kemenangan primer yang dibayar dengan guardrail jebol bukan kemenangan. (3) Cek SRM (apakah limit baru bocor ke grup kontrol via nasabah multi-akun?), cek distribusi efek (apakah kenaikan volume datang dari segmen yang memang diinginkan, atau dari segmen berisiko?), dan hitung ulang dengan horizon lebih panjang — fraud sering lagging 1–2 bulan di belakang volume.",
        "Catatan: inilah pola keputusan yang membedakan analis risiko dari analis produk biasa — analis produk berhenti di 'primer hijau'; analis risiko menuntut guardrail hijau JUGA, lalu menanyakan 'efek ini datang dari nasabah yang seperti apa?' sebelum tanda tangan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di risk, guardrail BUKAN pelengkap — ia sering kali metrik yang lebih penting dari primer. Limit lebih longgar yang menaikkan volume 2% tetapi menggandakan fraud loss adalah bencana, bukan kemenangan. Aturan: setiap eksperimen yang menyentuh uang, kredit, atau limit WAJIB punya guardrail risiko dengan ambang yang ditulis SEBELUM eksperimen — bukan ditemukan setelah.",
      },
      reference: "Ship = primer signifikan + material + guardrail aman. Satu saja merah = tidak ship.",
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
        "Kontrak pra-eksperimen (H0/H1, 1 metrik primer, guardrail, MDE, aturan berhenti) adalah fondasi p-value yang jujur.",
        "Power 80% standar; ukuran sampel dihitung dari MDE — MDE separuh → n empat kali lipat.",
        "z = selisih / SE_pooled; p-value dua sisi via erf; CI selisih pakai SE tak-terpool.",
        "Peeking menggelembungkan false positive; SRM = randomisasi bocor → buang eksperimen.",
        "Ship = signifikan secara statistik DAN material secara bisnis DAN guardrail aman.",
      ],
      quiz: [
        {
          q: "Eksperimen: z = 2,07, p = 0,038, CI 95% selisih = (0,07pp; 2,53pp), MDE = 1pp. Keputusan yang tepat?",
          options: [
            { text: "TIDAK SHIP (dulu): signifikan, tetapi batas bawah CI 0,07pp < MDE 1pp — lanjutkan eksperimen atau terima efeknya kecil", why: "Benar: p < 0,05 hanya berkata efeknya kemungkinan nyata; CI berkata efeknya mungkin hanya 0,07pp — tidak cukup membayar biaya ship.", correct: true },
            { text: "SHIP: p < 0,05 berarti terbukti berhasil", why: "Salah: p-value tidak mengukur BESAR efek. 'Terbukti berhasil' butuh efek yang material, bukan sekadar signifikan." },
            { text: "TIDAK SHIP: p = 0,038 terlalu dekat ke 0,05, jadi tidak signifikan", why: "Salah: 0,038 < 0,05 = signifikan menurut aturan yang ditulis di awal. Menggeser ambang setelah melihat hasil = p-hacking." },
            { text: "Ulangi eksperimen dari nol karena hasilnya ambigu", why: "Salah: hasil tidak ambigu — ia informatif: efeknya kecil. Mengulang sampai hijau = peeking antar-eksperimen." },
          ],
        },
        {
          q: "Tim mengecek dashboard tiap hari dan berencana berhenti saat pertama kali p < 0,05. Tanpa efek sebenarnya, apa risikonya?",
          options: [
            { text: "False positive membengkak jauh di atas 5% — tiap pengecekan adalah kesempatan baru bagi noise untuk 'menang'", why: "Benar: dengan 5x cek, peluang minimal satu false positive ≈ 14%. Inilah peeking.", correct: true },
            { text: "Tidak ada — p-value sudah memperhitungkan pengecekan berulang", why: "Salah: p-value standar mengasumsikan SATU kali baca. Ia buta terhadap berapa kali kamu mengintip." },
            { text: "Power menurun sehingga efek asli terlewat", why: "Salah: masalahnya bukan power (peluang deteksi) melainkan false positive (tuduhan palsu) yang naik." },
            { text: "Hanya masalah jika berhenti di hari pertama", why: "Salah: berhenti 'saat pertama hijau' kapan pun = aturan berhenti yang bias, tidak peduli harinya." },
          ],
        },
        {
          q: "Rencana alokasi 50/50, realisasi 5.200/4.800 dari 10.000 sesi. Tindakan benar?",
          options: [
            { text: "SRM terdeteksi (chi-square = 16, p < 0,001) — jangan baca hasil metrik; perbaiki randomisasi dan ulangi", why: "Benar: penyimpangan 4 SD dari rencana = bukti kuat pipa bocor. Hasil di atas data tercemar tak terinterpretasi.", correct: true },
            { text: "Lanjut baca hasil — selisih 2% terlalu kecil untuk berpengaruh", why: "Salah: 'kecil' dalam persen ≠ kecil dalam bukti; dan arah biasnya tidak diketahui." },
            { text: "Bobot ulang data agar kembali 50/50 lalu baca hasilnya", why: "Salah: reweighting tidak memperbaiki SEBAB bocornya (bot? bug redirect?) — ia menyembunyikan gejala." },
            { text: "Gabungkan kedua grup dan analisis sebagai satu sampel", why: "Salah: menghancurkan seluruh desain eksperimen; tidak ada lagi pembanding kausal." },
          ],
        },
        {
          q: "Mengapa eksperimen limit transfer wajib punya guardrail fraud loss rate?",
          options: [
            { text: "Karena kemenangan primer bisa dibayar dengan kerugian risiko — guardrail memastikan kemenangan itu bersih", why: "Benar: di risk, guardrail sering lebih penting dari primer; limit longgar + volume naik + fraud meledak = bencana.", correct: true },
            { text: "Karena regulator mewajibkan dua metrik di setiap eksperimen", why: "Salah: ini praktik profesional, bukan (secara umum) kewajiban regulasi — alasannya ekonomi, bukan legal." },
            { text: "Agar p-value primer terlihat lebih meyakinkan", why: "Salah: guardrail tidak mengubah p-value primer sama sekali; ia mengubah KEPUTUSAN." },
            { text: "Tidak wajib — cukup jika primernya signifikan dan material", why: "Salah: primer yang hijau sambil guardrail jebol adalah definisi kemenangan semu berbiaya risiko." },
          ],
        },
        {
          q: "MDE diturunkan dari 1pp menjadi 0,5pp (baseline & power tetap). Apa konsekuensinya pada ukuran sampel?",
          options: [
            { text: "Naik ~4x lipat — Δ ada di penyebut dan dikuadratkan", why: "Benar: n ∝ 1/Δ². MDE separuh → n empat kali lipat. MDE ambisius tanpa trafik = eksperimen underpowered.", correct: true },
            { text: "Naik 2x lipat — berbanding lurus dengan penurunan MDE", why: "Salah: hubungannya kuadratik, bukan linear — intuisi 'separuh → dua kali' meleset 2x lipat." },
            { text: "Tetap — ukuran sampel hanya ditentukan power", why: "Salah: power dan MDE bersama menentukan n; mengecilkan MDE menaikkan n secara dramatis." },
            { text: "Turun — efek lebih kecil lebih mudah dideteksi", why: "Salah: terbalik total — efek lebih kecil justru LEBIH SULIT dideteksi dan butuh sampel lebih besar." },
          ],
        },
      ],
      next: { label: "B22 — Dari Regresi Logistik ke Credit Scorecard", href: "/learn/b22-regresi-scorecard" },
    },
  ],
};
