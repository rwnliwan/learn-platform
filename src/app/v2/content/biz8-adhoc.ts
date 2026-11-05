import type { V2Lesson } from "../lib/types";

// Waterfall: 300rb -> efek harga 0 -> volume -25rb -> mix -2rb -> 273rb.
const WATERFALL_SVG = `<svg viewBox="0 0 520 280" role="img" aria-label="Waterfall chart: revenue 300 ribu turun 27 ribu menjadi 273 ribu, didorong efek volume.">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="50" y1="40" x2="500" y2="40"/><line x1="50" y1="90" x2="500" y2="90"/><line x1="50" y1="140" x2="500" y2="140"/><line x1="50" y1="190" x2="500" y2="190"/><line x1="50" y1="240" x2="500" y2="240"/>
</g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">
<text x="44" y="44" text-anchor="end">300</text><text x="44" y="144" text-anchor="end">280</text><text x="44" y="244" text-anchor="end">260</text>
<text x="44" y="264" text-anchor="end" fill="var(--text-muted)">rb Rp</text>
</g>
<g font-family="var(--font-ui)">
<rect x="80" y="40" width="70" height="100" fill="var(--c1)" opacity="0.85"/>
<text x="115" y="30" text-anchor="middle" font-size="11" fill="var(--text)">Basis</text>
<text x="115" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg-app)">300</text>
<rect x="160" y="40" width="70" height="100" fill="var(--text-muted)" opacity="0.35"/>
<text x="195" y="30" text-anchor="middle" font-size="11" fill="var(--text)">Harga</text>
<text x="195" y="96" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">0</text>
<rect x="240" y="140" width="70" height="83" fill="var(--error)" opacity="0.85"/>
<text x="275" y="130" text-anchor="middle" font-size="11" fill="var(--text)">Volume</text>
<text x="275" y="186" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg-app)">-25</text>
<rect x="320" y="223" width="70" height="7" fill="var(--error)" opacity="0.55"/>
<text x="355" y="215" text-anchor="middle" font-size="11" fill="var(--text)">Mix</text>
<text x="355" y="245" text-anchor="middle" font-size="11" font-weight="700" fill="var(--error)">-2</text>
<rect x="400" y="63" width="70" height="167" fill="var(--c1)" opacity="0.85"/>
<text x="435" y="53" text-anchor="middle" font-size="11" fill="var(--text)">Kini</text>
<text x="435" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg-app)">273</text>
</g>
<g stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="4,3">
<line x1="150" y1="140" x2="240" y2="140"/><line x1="310" y1="223" x2="400" y2="223"/>
</g>
<text x="275" y="268" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">Volume menjelaskan 92,6% penurunan — bukan harga.</text>
</svg>`;

export const biz8: V2Lesson = {
  slug: "biz8-adhoc",
  track: "Business Intelligence",
  module: "Insight & Komunikasi",
  title: "BI8 — Analisis Adhoc yang Cepat & Benar",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "\u201CKenapa penjualan turun?\u201D — dijawab 4 jam, bukan 4 hari",
      prose: [
        "Jumat pagi, grup direksi bergetar: \u201CPenjualan turun 9% minggu ini. Kenapa?\u201D Analis lama butuh 4 hari: tarik data, bikin 12 chart, rapat klarifikasi. Analis baru menjawab 4 jam kemudian: \u201CVolume -25 ribu (92,6% penurunan), mix -2 ribu, harga 0. Bukan harga — traffic turun di 2 kota.\u201D",
        "Rahasianya bukan kecepatan mengetik, melainkan framework dekomposisi: setiap perubahan angka besar dipecah menjadi efek-efek yang MECE (saling lepas, kolektif lengkap). Begitu kerangkanya ada, data tinggal mengisi.",
        "Twist-nya: jawaban yang benar hampir tidak pernah SATU sebab. \u201CHarga turun\u201D adalah jawaban malas. Realita: tiga efek kecil yang masing-masing menuntut aksi berbeda — dan aksi yang salah (mis. potong harga saat masalahnya volume) justru memperparah.",
        "Di lesson ini kamu akan bisa: (1) mendekomposisi perubahan revenue menjadi efek harga, volume, mix; (2) memakai pohon hipotesis MECE; (3) timeboxing analisis adhoc; (4) tahu kapan \u201Ccukup benar\u201D lebih baik dari sempurna.",
      ],
      tasks: [],
    },    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menjalankan analisis ad-hoc yang menjawab 'kenapa' — bukan sekadar 'berapa'.",
        "(1) Menuliskan hipotesis sebagai prediksi pola SEBELUM melihat data (bukan menebak sesudahnya);",
        "(2) Mengeliminasi hipotesis dengan sum of squared errors terhadap kontribusi aktual per segmen;",
        "(3) Menguraikan efek harga, volume, dan mix dari sebuah penurunan revenue;",
        "(4) Menentukan kapan analisis ad-hoc selesai dan kapan ia harus menjadi dashboard (atau tidak).",
      ],
      tasks: [],
    },

    {
      id: "dekomposisi",
      eyebrow: "Langkah 3 · Dekomposisi",
      title: "Dekomposisi: belah angka sampai ia mengaku",
      prose: [
        "Revenue = Σ harga × qty. Maka setiap perubahan revenue PASTI berasal dari tiga sumber: harga berubah (price effect), qty berubah (volume effect), atau komposisi produk berubah (mix effect). Tidak ada sumber keempat — ini matematis, bukan opini.",
        "Rumusnya: efek harga = Σ (p1-p0)×q0 — \u201Cseandainya qty tetap, berapa dampak perubahan harga?\u201D Efek volume = Σ (q1-q0)×p0 — \u201Cseandainya harga tetap.\u201D Mix = sisa (interaksi Δp×Δq) — pergeseran ke produk murah/mahal.",
        "Di kasus kita: harga 0, volume -25.000, mix -2.000 dari total -27.000. Kesimpulan 10 detik: jangan sentuh harga — kejar volume. Tanpa dekomposisi, rapat akan habis debat \u201Capa harga kemahalan?\u201D yang jawabannya NOL.",
        "Kepribadian: dekomposisi adalah \u201Csi interogator\u201D — ia tidak menerima jawaban \u201Cturun 9%\u201D, ia memaksa angka itu menyebut nama: siapa (produk), apa (harga/volume/mix), berapa.",
        "💡 Intuisi kunci: selalu dekomposisi SEBELUM visualisasi. Chart dari angka agregat hanya memvisualkan kebingungan. Chart dari efek-efek (waterfall) memvisualkan jawaban.",
      ],
      formula: String.raw`\Delta R = \underbrace{\sum \Delta p \cdot q_0}_{\text{harga}} + \underbrace{\sum \Delta q \cdot p_0}_{\text{volume}} + \underbrace{\sum \Delta p \cdot \Delta q}_{\text{mix}}`,
      formulaNote:
        "ΔR = perubahan revenue total. Efek harga: perubahan harga × qty lama. Efek volume: perubahan qty × harga lama. Mix: interaksi keduanya (pergeseran komposisi). Ketiganya dijumlahkan = ΔR persis — tidak ada yang hilang, tidak ada yang ganda (MECE).",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: satu sebab untuk satu penurunan",
        body: "Otak suka narasi tunggal (\u201Ckompetitor banting harga!\u201D). Data jarang sesederhana itu. Dekomposisi memaksa kita melihat SEMUA efek sekaligus — dan sering yang terbesar bukanlah yang paling berisik di rapat.",
      },
    },
    {
      id: "pohon-hipotesis",
      eyebrow: "Langkah 4 · Pohon hipotesis",
      title: "Pohon hipotesis + timebox: cepat TANPA ngawur",
      prose: [
        "Pohon hipotesis: tulis 3-5 kemungkinan penyebab SEBELUM menyentuh data, susun MECE. Untuk \u201Cpenjualan turun\u201D: (1) traffic turun, (2) conversion turun, (3) avg ticket turun — lalu tiap cabang dipecah lagi (conversion: checkout error? promo berakhir?).",
        "Aturan main: uji cabang terbesar dulu (Pareto), bunuh hipotesis dengan SATU angka yang tajam (bukan 10 chart), catat yang gugur. Hipotesis yang gugur adalah kemajuan — bukan kegagalan.",
        "Timeboxing: \u201Cjam 12 harus ada jawaban 80% benar\u201D. Analisis adhoc yang sempurna tapi telat 3 hari bernilai nol — keputusan sudah diambil tanpa data. \u201CCukup benar\u201D = arah benar + orde besar benar + asumsi eksplisit.",
        "Cara membaca waterfall: batang pertama (300) = basis. Batang datar (0) = harga tidak berkontribusi. Batang merah turun (-25) = volume, pendorong utama. Batang kecil (-2) = mix. Batang terakhir (273) = kini. Garis putus-putus menunjukkan level lanjutan.",
        "Interpretasi: 92,6% penurunan dijelaskan volume. Aksi: investigasi traffic/conversion — BUKAN strategi harga. Waterfall mengubah \u201Cturun 9%\u201D yang abstrak menjadi daftar tersangka dengan porsinya.",
        "💡 Intuisi kunci: tulis hipotesis dulu untuk melawan confirmation bias. Yang membuka data tanpa hipotesis akan menemukan pola yang mendukung firasatnya — dan melewatkan pola yang tidak.",
      ],
      figure: {
        svg: WATERFALL_SVG,
        alt: "Waterfall chart dekomposisi: 300 ke 273 via efek harga 0, volume -25, mix -2.",
        caption: "Waterfall dekomposisi Δ revenue -27 ribu: harga 0, volume -25 (92,6%), mix -2. Aksi: kejar volume.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi: analisis cepat = analisis ceroboh",
        body: "Cepat karena BERSTRUKTUR (dekomposisi + hipotesis + timebox), bukan karena melompati validasi. Yang ceroboh adalah yang langsung visualisasi tanpa kerangka — 4 hari menghasilkan 12 chart yang tidak menjawab apa-apa.",
      },
    },
    {
      id: "lab-dekomposisi",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: interogasi penurunan 9%",
      prose: [
        "Data 3 produk (harga & qty basis vs kini) tersedia. Tugasmu: (1) hitung `rev0`, `rev1`, `delta`; (2) hitung `efek_harga`, `efek_volume`, `efek_mix`; (3) tentukan `tersangka` (efek dengan |nilai| terbesar) dan cetak semuanya.",
        "Coba juga: ubah harga produk A kini menjadi 90 (banting harga). Bagaimana komposisi efek berubah? Kapan efek harga menjadi tersangka utama? Mainkan angkanya sampai intuisimu tajam.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rev0`, `rev1`, `delta`" },
        { id: "t2", text: "Hitung `efek_harga`, `efek_volume`, `efek_mix`" },
        { id: "t3", text: "Tentukan `tersangka`, cetak hasil" },
      ],
      expected: "delta=-27000  tersangka=volume (-25000)",
      note: {
        title: "Sering salah",
        body: "Menghitung efek volume dengan harga KINI (Σ Δq × p1) — itu mencampur efek harga ke dalam volume (double counting dengan mix). Rumus baku: volume pakai harga LAMA (p0), harga pakai qty LAMA (q0), sisanya mix. Konsisten = MECE.",
      },
      hints: [
        "rev0 = Σ p0*q0; rev1 = Σ p1*q1; delta = rev1 - rev0.",
        "efek_harga = Σ (p1-p0)*q0; efek_volume = Σ (q1-q0)*p0; efek_mix = delta - efek_harga - efek_volume.",
        "tersangka = nama efek dengan abs() terbesar.",
      ],
      code: {
        starter: `# produk: (harga0, qty0, harga1, qty1)\nprod = {\n    "A": (100, 1000, 105, 800),\n    "B": (50, 2000, 50, 1500),\n    "C": (200, 500, 190, 600),\n}\n\n# TULIS KODEMU\nrev0 = 0\nrev1 = 0\ndelta = 0\nefek_harga = 0\nefek_volume = 0\nefek_mix = 0\ntersangka = ""\n\nprint(f"rev0={rev0}  rev1={rev1}  delta={delta}")\nprint(f"harga={efek_harga}  volume={efek_volume}  mix={efek_mix}  tersangka={tersangka}")`,
        lockLines: 6,
        solution: `# produk: (harga0, qty0, harga1, qty1)\nprod = {\n    "A": (100, 1000, 105, 800),\n    "B": (50, 2000, 50, 1500),\n    "C": (200, 500, 190, 600),\n}\n\n# TULIS KODEMU\nrev0 = sum(p0*q0 for p0, q0, p1, q1 in prod.values())\nrev1 = sum(p1*q1 for p0, q0, p1, q1 in prod.values())\ndelta = rev1 - rev0\nefek_harga = sum((p1-p0)*q0 for p0, q0, p1, q1 in prod.values())\nefek_volume = sum((q1-q0)*p0 for p0, q0, p1, q1 in prod.values())\nefek_mix = delta - efek_harga - efek_volume\nefek = {"harga": efek_harga, "volume": efek_volume, "mix": efek_mix}\ntersangka = max(efek, key=lambda k: abs(efek[k]))\n\nprint(f"rev0={rev0}  rev1={rev1}  delta={delta}")\nprint(f"harga={efek_harga}  volume={efek_volume}  mix={efek_mix}  tersangka={tersangka}")`,
        checks: [
          { kind: "equal", task: "t1", name: "delta", value: -27000, tol: 1e-9, label: "`delta` = -27000", msg: "273000 - 300000." },
          { kind: "equal", task: "t2", name: "efek_harga", value: 0, tol: 1e-9, label: "`efek_harga` = 0", msg: "Σ(p1-p0)*q0 = 5000 + 0 - 5000." },
          { kind: "equal", task: "t2", name: "efek_volume", value: -25000, tol: 1e-9, label: "`efek_volume` = -25000", msg: "Σ(q1-q0)*p0 dengan harga LAMA." },
          { kind: "equal", task: "t2", name: "efek_mix", value: -2000, tol: 1e-9, label: "`efek_mix` = -2000", msg: "Sisa: delta - harga - volume." },
          { kind: "equal", task: "t3", name: "tersangka", value: "volume", label: "`tersangka` = volume", msg: "|−25000| terbesar." },
          { kind: "stdout_matches", task: "t3", pattern: "tersangka=volume", label: "`print` menyebut tersangka", msg: "Cetak nama efek terbesar." },
        ],
      },
      reference: "MECE: Σ Δp·q0 + Σ Δq·p0 + Σ Δp·Δq = ΔR. Selalu pakai basis lama (p0, q0).",
    },    {
      id: "lab2-eliminasi-hipotesis",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab: eliminasi hipotesis dengan data",
      prose: [
        "Revenue turun 9% dan ada tiga tersangka: perang harga, stok kosong, kompetitor baru. Analis ad-hoc yang baik tidak menebak — ia menuliskan prediksi tiap hipotesis, lalu membiarkan data mengeliminasi.",
        "Tugasmu: hitung sum of squared errors tiap hipotesis terhadap kontribusi aktual per segmen. Hipotesis dengan error terkecil bertahan; sisanya gugur.",
        "Perhatikan H1_harga nyaris sempurna memprediksi pola fashion -5,2. Inilah beda 'analisis' vs 'opini': prediksi tertulis sebelum melihat data.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `error`: SSE tiap hipotesis vs aktual (2 desimal)" },
        { id: "t2", text: "Tentukan `hipotesis_benar` = error terkecil" },
        { id: "t3", text: "Tentukan `kontribusi_terbesar` = segmen paling negatif" },
      ],
      expected: "error={'H1_harga': 0.1, 'H2_stok': 34.5, 'H3_kompetitor': 14.1}",
      note: {
        title: "Sering salah",
        body: "Memilih hipotesis dari total error tanpa pola segmen ('kan totalnya sama-sama -9'). Total yang sama bisa lahir dari pola yang sangat berbeda — pola-lah buktinya.",
      },
      hints: [
        "SSE = sum((aktual[s]-pola[s])**2 for s in aktual).",
        "min(error, key=error.get) untuk hipotesis terbaik.",
        "Segmen paling negatif = min(aktual, key=aktual.get).",
      ],
      code: {
        starter: `# Revenue turun 9%. Kontribusi aktual per segmen (dalam poin %):\naktual = {"fashion": -5.2, "elektronik": -1.1, "groceries": -0.4, "lainnya": -2.3}\n# Tiga hipotesis: pola kontribusi yang DIPREDIKSI tiap hipotesis\nhipotesis = {\n    "H1_harga":      {"fashion": -5.0, "elektronik": -1.0, "groceries": -0.5, "lainnya": -2.5},\n    "H2_stok":       {"fashion": -1.0, "elektronik": -4.0, "groceries": -3.0, "lainnya": -1.0},\n    "H3_kompetitor": {"fashion": -2.0, "elektronik": -2.0, "groceries": -2.0, "lainnya": -3.0},\n}\n# TULIS KODEMU: error, hipotesis_benar, kontribusi_terbesar\nerror = {}\nhipotesis_benar = ''\nkontribusi_terbesar = ''\n`,
        lockLines: 8,
        solution: `# Revenue turun 9%. Kontribusi aktual per segmen (dalam poin %):\naktual = {"fashion": -5.2, "elektronik": -1.1, "groceries": -0.4, "lainnya": -2.3}\n# Tiga hipotesis: pola kontribusi yang DIPREDIKSI tiap hipotesis\nhipotesis = {\n    "H1_harga":      {"fashion": -5.0, "elektronik": -1.0, "groceries": -0.5, "lainnya": -2.5},\n    "H2_stok":       {"fashion": -1.0, "elektronik": -4.0, "groceries": -3.0, "lainnya": -1.0},\n    "H3_kompetitor": {"fashion": -2.0, "elektronik": -2.0, "groceries": -2.0, "lainnya": -3.0},\n}\n\n# TULIS KODEMU: error, hipotesis_benar, kontribusi_terbesar\nerror = {}\nfor h, pola in hipotesis.items():\n    error[h] = round(sum((aktual[s] - pola[s]) ** 2 for s in aktual), 2)\nhipotesis_benar = min(error, key=error.get)\nkontribusi_terbesar = min(aktual, key=aktual.get)\n\nprint(f"error={error}")\nprint(f"hipotesis_benar={hipotesis_benar}  kontribusi_terbesar={kontribusi_terbesar}")\n`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "'H1_harga': 0\\.1", label: "error H1 = 0,1", msg: "SSE hipotesis harga." },
          { kind: "equal", task: "t2", name: "hipotesis_benar", value: "H1_harga", label: "`hipotesis_benar` = H1_harga", msg: "Error terkecil." },
          { kind: "equal", task: "t3", name: "kontribusi_terbesar", value: "fashion", label: "`kontribusi_terbesar` = fashion", msg: "Segmen paling negatif: −5,2." },
        ],
      },
      reference: "Eliminasi hipotesis ala diagnosis medis: prediksi tertulis, lalu uji.",
    },

    {
      id: "intuisi",
      eyebrow: "Langkah 7 · Intuisi kunci",
      title: "💡 Intuisi kunci",
      prose: [
        "💡 Tulis hipotesismu SEBELUM query pertama dijalankan — di kertas, dengan angka prediksi. Analis yang 'menemukan pola' setelah melihat data sedang bercerita, bukan menganalisis.",
        "💡 Analisis ad-hoc yang baik diakhiri dengan kalimat 'maka ___ harus dilakukan'. Tanpa kalimat itu, kamu baru membuat laporan, belum melakukan analisis.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: kedalaman analisis mengikuti harga keputusan",
        body: "Kedalaman analisis yang tepat tidak ditentukan oleh rasa penasaranmu, melainkan oleh harga keputusannya. Praktisi ad-hoc yang matang mengklasifikasikan keputusan jadi dua: pintu dua arah (reversibel — bisa dibatalkan dengan murah, seperti mengubah copywriting tombol) dan pintu satu arah (hampir tidak bisa dibatalkan — menutup gerai, mengganti vendor utama, PHK). Untuk pintu dua arah, timebox 4 jam lalu kirim: biaya analisis berlebih lebih mahal daripada biaya salah kecil yang bisa diperbaiki minggu depan. Untuk pintu satu arah, tidak ada \"cukup cepat\" — tulis asumsimu secara eksplisit, minta satu orang mengkritiknya, dan dokumentasikan apa yang akan membuatmu berubah pikiran. Heuristik angkanya: kalau biaya keputusan di bawah Rp50 juta dan reversibel, analisis lebih dari 1 hari adalah pemborosan; kalau di atas Rp1 miliar atau irreversibel, analisis 4 jam adalah kelalaian. Jebakan yang paling sering kulihat: analis memperlakukan semua pertanyaan seperti pintu satu arah — \"kenapa penjualan turun?\" dijawab 2 minggu dengan presisi 99%, padahal keputusannya (eksperimen promo kecil) butuh jawaban 80% benar dalam 4 jam. Kebalikannya juga mematikan: keputusan mengganti vendor diambil dari analisis 2 jam tanpa satu pun asumsi tertulis. Maka sebelum query pertama, tulis satu kalimat: \"keputusan apa yang akan diambil dari jawaban ini, dan berapa harganya kalau salah?\" Kalimat itu menentukan seluruh strategimu — seberapa dalam menggali, seberapa cepat berhenti, dan seberapa berani menyimpulkan.",
      },
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Peta keputusan: seberapa dalam vs seberapa cepat",
      prose: [
        "Skenario 1 — Krisis, keputusan < 4 jam. → Dekomposisi 1 tingkat + 1 hipotesis terbesar. Jawaban 80% benar SEKARANG > 100% benar besok.",
        "Skenario 2 — Review mingguan, waktu 1 hari. → Dekomposisi 2 tingkat (efek → segmen) + waterfall. Cukup untuk alokasi aksi.",
        "Skenario 3 — Keputusan investasi besar (jutaan Rp). → Analisis penuh: dekomposisi + validasi silang + uji sensitivitas. Di sini \u201Ccukup benar\u201D tidak cukup.",
        "Skenario 4 — Pertanyaan berulang tiap bulan. → JANGAN adhoc lagi — bangun template/dashboard. Adhoc yang ketiga kalinya adalah proses yang belum diotomasi.",
        "Skenario 5 — Data belum tersedia / kualitas diragukan. → Jawab dengan asumsi EKSPLISIT + rentang (bukan satu angka) + rencana verifikasi. \u201CAntara -20rb dan -30rb, diverifikasi besok pagi.\u201D",
        "Aturan praktis 10 detik: tanya \u201Ckeputusan apa dan kapan?\u201D Lalu pilih kedalaman yang keputusan itu butuhkan — tidak lebih dalam.",
      ],
      tasks: [],
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Mini-case: conversion checkout anjlok",
      prose: [
        "Senin: conversion checkout turun dari 3,8% ke 3,2% (-15,8%). Pohon hipotesis: (a) traffic berubah komposisi, (b) error teknis, (c) promo berakhir. Timebox: jawaban 80% jam 12.",
        "Jam 10 — dekomposisi funnel: visitor 100rb → 105rb (+5%); add-to-cart 12% → 11,5%; cart-to-checkout 45% → 38% (-15,6%); payment success 98% → 97,5%. Tersangka: cart-to-checkout.",
        "Jam 11 — iris per device: mobile cart-to-checkout 42% → 30% (-28,6%), desktop stabil 48% → 47%. Cek deploy log: update aplikasi mobile Jumat malam mengubah tombol bayar. Satu angka (deploy log) membunuh hipotesis (a) dan (c).",
        "Jam 12 — jawaban: bug tombol bayar di mobile, estimasi 400 transaksi hilang/minggu ≈ Rp156 juta/minggu. Aksi: rollback + hotfix. Total: 4 jam dari pertanyaan ke aksi — karena kerangka (funnel × device) sudah ada sebelum data dibuka.",
        "💡 Intuisi kunci: kecepatan analisis adhoc 90% ditentukan SEBELUM data dibuka (punya framework), 10% saat coding. Investasi terbaik: hafalkan 5 pola dekomposisi (funnel, harga×volume, kohort, geografi, segmen).",
      ],
      tasks: [],
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang analisis adhoc. Ingat: dekomposisi dulu, visualisasi kemudian.",
      ],
      tasks: [],
      summary: [
        "ΔR = efek harga + efek volume + efek mix — MECE, tidak ada sumber keempat.",
        "Tulis pohon hipotesis MECE sebelum menyentuh data (lawan confirmation bias).",
        "Timebox: 80% benar sekarang > 100% benar setelah keputusan diambil.",
        "Waterfall memvisualkan jawaban, bukan kebingungan.",
        "Adhoc ketiga kalinya = proses yang harus diotomasi.",
      ],
      next: { label: "BI9 — Data Quality untuk BI", href: "/v2/learn/biz9-quality" },
      quiz: [
        {
          q: "Revenue -9%: harga 0, volume -25rb, mix -2rb. Aksi yang tepat?",
          options: [
            { text: "Potong harga untuk dongkrak penjualan", why: "Efek harga = 0 — masalahnya bukan harga. Potong harga hanya menggerus margin." },
            { text: "Investigasi volume (traffic/conversion), bukan harga", why: "Tepat: 92,6% penurunan dari volume.", correct: true },
            { text: "Fokus ke mix: setop produk murah", why: "Mix hanya -2rb (7,4%) — bukan pendorong utama." },
            { text: "Tunggu bulan depan, mungkin noise", why: "-27rb bukan noise; menunda = kehilangan waktu aksi." },
          ],
        },
        {
          q: "Kenapa efek volume memakai harga LAMA (p0), bukan harga kini?",
          options: [
            { text: "Supaya angkanya lebih kecil", why: "Bukan soal besar-kecil." },
            { text: "Agar dekomposisi MECE — tidak double counting dengan efek harga", why: "Tepat: p0 mengisolasi murni perubahan qty; sisanya ditampung mix.", correct: true },
            { text: "Karena harga kini belum final", why: "Tidak relevan dengan struktur rumus." },
            { text: "Tidak ada alasan, bebas pilih", why: "Ada: konsistensi basis menentukan MECE." },
          ],
        },
        {
          q: "Direksi butuh jawaban dalam 4 jam. Strategi terbaik?",
          options: [
            { text: "Tarik semua data lalu eksplorasi bebas", why: "Tanpa kerangka = 4 jam habis untuk 12 chart tanpa jawaban." },
            { text: "Pohon hipotesis + dekomposisi 1 tingkat + bunuh hipotesis satu per satu", why: "Tepat: struktur dulu, data mengisi.", correct: true },
            { text: "Minta perpanjangan 3 hari", why: "Keputusan tidak menunggu — jawaban telat = tidak ada jawaban." },
            { text: "Jawab dari firasat, data menyusul", why: "Firasat tanpa data = spekulasi berbiaya." },
          ],
        },
        {
          q: "Pertanyaan adhoc yang sama muncul ketiga kalinya bulan ini. Artinya?",
          options: [
            { text: "Analisnya populer", why: "Bukan ukuran yang relevan." },
            { text: "Bangun template/dashboard — ini proses yang harus diotomasi", why: "Tepat: adhoc berulang = kebutuhan rutin yang belum dilayani.", correct: true },
            { text: "Jawab lebih cepat lagi", why: "Kecepatan bukan solusi untuk kebutuhan struktural." },
            { text: "Tolak pertanyaan keempat", why: "Menolak tidak menyelesaikan kebutuhan bisnisnya." },
          ],
        },
        {
          q: "Data belum lengkap tapi keputusan harus hari ini. Pendekatan jujur?",
          options: [
            { text: "Beri satu angka pasti agar meyakinkan", why: "Angka pasti dari data tak lengkap = kebohongan presisi." },
            { text: "Rentang + asumsi eksplisit + rencana verifikasi", why: "Tepat: jujur tentang ketidakpastian, tetap bisa bertindak.", correct: true },
            { text: "Tolak menjawab sama sekali", why: "Menolak = keputusan diambil tanpa data sama sekali." },
            { text: "Tunda keputusan sampai data sempurna", why: "Data sempurna tidak ada; keputusan tetap harus diambil." },
          ],
        },
        {
          q: "Revenue turun, dan tiga hipotesis diajukan DALAM RAPAT setelah semua orang melihat chart. Masalahnya?",
          options: [
            { text: "Tidak ada — itu efisien", why: "Hipotesis yang lahir setelah melihat data bukan hipotesis — itu cerita yang dicocokkan ke pola. Ia tidak bisa salah, karena dibuat agar benar." },
            { text: "Hipotesis post-hoc tidak bisa diuji secara jujur; tulis prediksi SEBELUM lihat data", why: "Tepat: inilah beda analisis vs narasi. Prediksi tertulis + data = uji. Data dulu + cerita kemudian = dongeng dengan chart.", correct: true },
            { text: "Rapat terlalu lama", why: "Durasi bukan masalah; urutannya yang salah." },
            { text: "Chart-nya kurang bagus", why: "Chart tidak menyelamatkan metodologi yang terbalik." },
          ],
        },
      ],
    },
  ],
};
