import type { V2Lesson } from "../lib/types";

const FIG_TOFIT = `<svg viewBox="0 0 480 260" role="img" aria-label="Fitness dua alpha dengan Sharpe sama tetapi turnover berbeda.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Sharpe sama 2,4 — fitness beda jauh</text>
<text x="60" y="60" font-size="11" fill="var(--chart-text)">Alpha R · TO 25%</text>
<rect x="60" y="70" width="240" height="30" fill="var(--c2)" opacity="0.9"/>
<text x="306" y="90" font-size="12" fill="var(--chart-text)">F = 1,66</text>
<text x="60" y="126" font-size="11" fill="var(--chart-text)">Alpha S · TO 66%</text>
<rect x="60" y="136" width="148" height="30" fill="var(--c4)" opacity="0.9"/>
<text x="214" y="156" font-size="12" fill="var(--chart-text)">F = 1,02</text>
<line x1="60" y1="186" x2="380" y2="186" stroke="var(--chart-text)" stroke-width="1" stroke-dasharray="5 4"/>
<text x="384" y="190" font-size="11" fill="var(--chart-text)">ambang lolos 1,0</text>
<text x="16" y="222" font-size="11" fill="var(--chart-text)">Cara membaca: panjang batang = fitness. Alpha S nyaris gagal walau Sharpe-nya elit.</text>
<text x="16" y="240" font-size="11" fill="var(--chart-text)">Interpretasi: turnover 66% memakan hampir 40% fitness — sinyal sama, biaya beda.</text>
</g>
</svg>`;

const FIG_TODEF = `<svg viewBox="0 0 480 240" role="img" aria-label="Posisi portofolio tiga hari dan turnover yang dihitung darinya.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Turnover = rata-rata |perubahan posisi|</text>
<text x="16" y="52" font-size="12" fill="var(--chart-text)">Hari 1: posisi +100 → Hari 2: −60 → Hari 3: +40</text>
<text x="16" y="78" font-size="12" fill="var(--chart-text)">|Δ| hari 2 = |−60 − 100| = 160</text>
<text x="16" y="100" font-size="12" fill="var(--chart-text)">|Δ| hari 3 = |40 − (−60)| = 100</text>
<text x="16" y="126" font-size="12" fill="var(--chart-text)">Turnover = (160 + 100) / 2 = 130 (satuan posisi)</text>
<rect x="16" y="146" width="330" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="24" y="164" font-size="12" fill="var(--chart-text)">Putar-balik penuh = turnover raksasa</text>
<text x="16" y="200" font-size="11" fill="var(--chart-text)">Interpretasi: setiap pembalikan arah membayar dua kali — jual yang lama, beli yang baru.</text>
</g>
</svg>`;

export const wqb5: V2Lesson = {
  slug: "wqb5-turnover",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB5 — Turnover: Biaya Tersembunyi yang Membunuh Alpha",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Si kembar Sharpe 2,4 yang satu sekarat",
      prose: [
        "Dua alpha tiba di meja review dengan Sharpe IDENTIK: 2,4. Alpha R: return 12% per tahun, turnover 25% per hari. Alpha S: return 12% per tahun, turnover 66% per hari. 'Kembar,' kata analis junior. Reviewer senior menatap kolom fitness: R = 1,66 — nyaman di atas ambang. S = 1,02 — selisih 0,02 dari kegagalan.",
        "Ia memutar layar: 'Sinyalnya sama bagusnya. Bedanya, S berputar seperti gasing — setiap hari membalik separuh portofolio. Di dunia nyata, tiap putaran membayar komisi, spread, dan slippage. Sharpe menghitung return kotor; fitness memotong biayanya. R membawa pulang 12% dengan tenang. S membawa pulang 12% sambil membakar bahan bakar dua setengah kali lebih banyak.'",
        "Twist-nya: angka return 12% keduanya BENAR dan Sharpe 2,4 keduanya SAH. Yang salah adalah anggapan 'return sama = sama menguntungkan'. Di simulasi, trading itu gratis; di pasar, tidak. Turnover adalah jembatan antara dunia simulasi yang gratis dan dunia nyata yang berbayar — dan fitness adalah satu-satunya metrik meja ini yang menyeberangi jembatan itu.",
        "Setelah lesson ini kamu bisa: (1) menghitung turnover dari deret posisi langkah demi langkah; (2) menjelaskan tiga komponen biaya yang diwakili turnover; (3) menghitung penalti turnover pada fitness dengan contoh angka; (4) menerapkan cap 70% WQB dan ambang penalti internal 40%; (5) mendiagnosis alpha 'paper champion' yang Sharpe-nya tinggi tetapi turnover-nya mematikan.",
      ],
      tasks: [],
      note: {
        title: "Jembatan dua dunia",
        body: "Simulasi mengasumsikan trading gratis. Pasar mengenakan biaya per putaran. Turnover mengukur seberapa sering kamu menyeberang — dan fitness memotong ongkos penyeberangannya dari nilaimu.",
      },
      reference: "Return kotor menipu; return setelah biaya yang menentukan.",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Turnover: definisi yang bisa dihitung",
      prose: [
        "Turnover = rata-rata nilai absolut perubahan posisi per hari, dinormalisasi terhadap total modal. Intuisi: jika setiap hari kamu membalik seluruh portofolio (jual semua, beli semua yang berlawanan), turnover ≈ 200%. Jika kamu hampir tidak pernah menyentuh posisi, turnover mendekati 0%.",
        "Contoh terperinci. Modal 100, posisi tiga hari (dalam satuan modal): hari 1 = +100 (fully long), hari 2 = −60 (berbalik short sebagian), hari 3 = +40. Perubahan: |−60 − 100| = 160; |40 − (−60)| = 100. Rata-rata = (160 + 100) / 2 = 130 → turnover 130%. Putar-balik penuh memang mahal — angkanya langsung berteriak.",
        "Cara membaca figur: tiga baris = posisi tiga hari; dua selisih absolut dijumlah lalu dirata-rata. Interpretasi: pembalikan arah adalah pembunuh — ia membayar dua kali (keluar dari posisi lama, masuk ke posisi baru). Sinyal yang 'sedikit gelisah' setiap hari diam-diam menumpuk turnover raksasa.",
        "Kepribadian turnover: ia seperti odometer mobil — tidak peduli seberapa jauh kamu sampai (return), hanya mencatat seberapa banyak roda berputar. Odometer tinggi + jarak tempuh kecil = mobil boros.",
      ],
      formula: String.raw`\text{Turnover} = \frac{1}{T}\sum_{t=1}^{T} |w_t - w_{t-1}|`,
      formulaNote: "w_t = bobot posisi hari t (dalam satuan modal), T = jumlah hari. Nilai absolut memastikan pembalikan arah terhitung penuh, bukan saling menghapus. Hasil 0,66 dibaca '66% per hari'.",
      figure: {
        svg: FIG_TODEF,
        alt: "Posisi tiga hari dan turnover 130% yang dihitung dari perubahan absolut.",
        caption: "Turnover = rata-rata |perubahan posisi|. Pembalikan arah membayar dua kali.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Turnover 66% berarti 66% modal dipakai.” Bukan. Turnover 66% berarti rata-rata 66% dari modal DIPUTAR per hari — modal yang sama bisa berputar berkali-kali. Uang Rp100 juta dengan turnover 66% memindahkan Rp66 juta per hari, bukan memakai Rp66 juta.",
      },
      hints: [
        "Selalu pakai nilai absolut: |−60 − 100| = 160, bukan −160.",
        "Turnover > 100% itu normal untuk strategi agresif — bukan error hitung.",
      ],
      reference: "Turnover = odometer: mencatat putaran, bukan jarak tempuh.",
    },
    {
      id: "biaya",
      eyebrow: "Langkah 3 · Konsep",
      title: "Kenapa mahal: tiga tagihan per putaran",
      prose: [
        "Setiap putaran menagih tiga biaya. Satu: komisi broker — kecil per transaksi, raksasa bila dikali 250 hari × ratusan saham. Dua: bid-ask spread — kamu selalu membeli sedikit lebih mahal dan menjual sedikit lebih murah dari harga tengah. Tiga: slippage & market impact — order besarmu sendiri menggerakkan harga melawanmu; makin agresif strateginya, makin besar hukumannya.",
        "Platform WQB memodelkan ini lewat dua gerbang. Gerbang keras: turnover di atas 70% = alpha tidak memenuhi syarat, berapa pun Sharpe-nya. Gerbang lunak di fitness: rumus fitness membagi return dengan turnover — sinyal yang sama persis, diputar 2,6× lebih sering, fitness-nya anjlok dari 1,66 ke 1,02 seperti di cerita pembuka.",
        "Contoh angka (return 12%, Sharpe 2,4): Alpha R, TO 25%: F = 2,4 × √(12/25) = 2,4 × 0,693 = 1,66. Alpha S, TO 66%: F = 2,4 × √(12/66) = 2,4 × 0,426 = 1,02. Selisih 0,64 fitness — seluruhnya harga sebuah kebiasaan gelisah.",
        "Cara membaca figur: dua batang = fitness dua alpha dengan Sharpe identik; garis putus-putus = ambang lolos 1,0. Interpretasi: batang S hanya sejengkal di atas garis — satu hari buruk dan ia gugur. Turnover bukan detail teknis; ia penentu hidup-mati.",
      ],
      formula: String.raw`F = S \times \sqrt{\frac{|R|}{\max(TO, 12{,}5\%)}}`,
      formulaNote: "F = fitness, S = Sharpe, R = return (%), TO = turnover (%). Akar dari (return/turnover): turnover naik → penyebut naik → fitness turun. Lantai 12,5% mencegah bonus semu bagi yang nyaris tidak trading.",
      figure: {
        svg: FIG_TOFIT,
        alt: "Batang fitness 1,66 vs 1,02 untuk Sharpe sama 2,4 dengan turnover 25% vs 66%.",
        caption: "Sharpe sama, turnover beda → fitness beda 0,64. Biaya itu nyata.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Turnover tinggi tidak apa-apa selama Sharpe tinggi.” Sharpe tidak melihat biaya sama sekali. Alpha dengan Sharpe 2,96 dan turnover 92% adalah 'paper champion' — juara di kertas, gagal di gerbang 70%, dan mustahil dieksekusi tanpa biaya memakan return-nya.",
      },
      hints: [
        "Hafalkan dua angka: 70% = gerbang keras WQB; 40% = ambang penalti prioritas internal tim.",
        "Bandingkan fitness, bukan Sharpe, saat turnover berbeda.",
      ],
      reference: "Tiga tagihan per putaran: komisi, spread, slippage. Fitness memotong ketiganya.",
    },
    {
      id: "lab",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung turnover & fitness lima kandidat",
      prose: [
        "Lima kandidat fiktif dengan return, Sharpe, dan deret posisi 4 hari. Tugasmu: hitung turnover tiap kandidat dari deret posisinya, lalu fitness-nya, lalu putuskan: LOLOS / PENALTI (TO > 40%) / GAGAL (TO > 70% atau F < 1,0). Perhatikan kandidat D: Sharpe 2,96 yang memesona — hitung dulu turnover-nya sebelum terpesona.",
        "Eksperimen setelah selesai: ubah satu angka posisi kandidat D agar turnover-nya turun di bawah 70%, lalu lihat fitness-nya. Rasakan seberapa besar 'diet turnover' mengubah nasib sebuah alpha.",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi `turnover(pos)` → rata-rata |Δposisi|" },
        { id: "t2", text: "Tulis fungsi `fitness(S, R, TO)` sesuai rumus (TO dalam %)" },
        { id: "t3", text: "Jalankan: pastikan 5 verdict tercetak" },
      ],
      expected: "A: TO 15.0% F 2.15 -> LOLOS\nB: TO 45.0% F 1.24 -> PENALTI\nC: TO 30.0% F 1.14 -> LOLOS\nD: TO 92.0% F 1.07 -> GAGAL\nE: TO 55.0% F 1.12 -> PENALTI",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Rata-rata posisi, bukan rata-rata perubahan.” Turnover memakai selisih antar hari (|w_t − w_{t−1}|), bukan rata-rata |w_t|. Portofolio yang diam di +100% punya turnover 0 — bukan 100%.",
      },
      hints: [
        "turnover = sum(abs(pos[i]-pos[i-1]) for i) / (len(pos)-1).",
        "fitness = S * ((R / max(TO, 12.5)) ** 0.5); TO dalam persen.",
        "Urutan cek: GAGAL dulu (TO>70 atau F<1), lalu PENALTI (TO>40), sisanya LOLOS.",
      ],
      code: {
        starter: "# Data kandidat: (nama, Sharpe, return_%, posisi 4 hari dalam % modal)\n# JANGAN UBAH data di bawah.\nkandidat = [\n    (\"A\", 2.4, 12.0, [100, 90, 110, 95]),\n    (\"B\", 2.4, 12.0, [100, 55, 100, 55]),\n    (\"C\", 1.8, 12.0, [100, 120, 80, 110]),\n    (\"D\", 2.96, 12.0, [100, 8, 100, 8]),\n    (\"E\", 2.4, 12.0, [100, 45, 100, 45]),\n]\n\n# TULIS KODEMU\ndef turnover(pos):\n    return  # rata-rata |selisih| antar hari\n\ndef fitness(S, R, TO):\n    return  # S * sqrt(R / max(TO, 12.5))\n\nfor nama, S, R, pos in kandidat:\n    to = turnover(pos)\n    f = fitness(S, R, to)\n    if to > 70 or f < 1.0:\n        v = \"GAGAL\"\n    elif to > 40:\n        v = \"PENALTI\"\n    else:\n        v = \"LOLOS\"\n    print(f\"{nama}: TO {to:.1f}% F {f:.2f} -> {v}\")\n",
        lockLines: 9,
        solution: "# Data kandidat: (nama, Sharpe, return_%, posisi 4 hari dalam % modal)\n# JANGAN UBAH data di bawah.\nkandidat = [\n    (\"A\", 2.4, 12.0, [100, 90, 110, 95]),\n    (\"B\", 2.4, 12.0, [100, 55, 100, 55]),\n    (\"C\", 1.8, 12.0, [100, 120, 80, 110]),\n    (\"D\", 2.96, 12.0, [100, 8, 100, 8]),\n    (\"E\", 2.4, 12.0, [100, 45, 100, 45]),\n]\n\n# TULIS KODEMU\ndef turnover(pos):\n    return sum(abs(pos[i] - pos[i-1]) for i in range(1, len(pos))) / (len(pos) - 1)\n\ndef fitness(S, R, TO):\n    return S * ((R / max(TO, 12.5)) ** 0.5)\n\nfor nama, S, R, pos in kandidat:\n    to = turnover(pos)\n    f = fitness(S, R, to)\n    if to > 70 or f < 1.0:\n        v = \"GAGAL\"\n    elif to > 40:\n        v = \"PENALTI\"\n    else:\n        v = \"LOLOS\"\n    print(f\"{nama}: TO {to:.1f}% F {f:.2f} -> {v}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `turnover` ada", msg: "Definisikan def turnover(pos).", name: "turnover" },
          { kind: "stdout_matches", task: "t3", label: "D GAGAL (paper champion)", msg: "Sharpe 2,96 dengan TO 92% harus GAGAL.", pattern: "D: TO 92\\.0% F 1\\.07 -> GAGAL" },
          { kind: "stdout_matches", task: "t3", label: "B PENALTI", msg: "B: TO 45% > 40% → PENALTI.", pattern: "B: TO 45\\.0% F 1\\.24 -> PENALTI" },
          { kind: "stdout_matches", task: "t3", label: "A LOLOS", msg: "A: TO 15% → LOLOS.", pattern: "A: TO 15\\.0% F 2\\.15 -> LOLOS" }
        ],
      },
      reference: "Hitung dulu turnover-nya, baru kagumi Sharpe-nya.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Empat zona turnover",
      prose: [
        "Satu: TO < 25% → ZONA HIJAU: sinyal tenang, biaya ringan, fitness jujur. Prioritas riset dan submit. Dua: TO 25–40% → ZONA KUNING: masih sehat, tetapi setiap varian baru wajib diuji apakah turnover-nya bisa ditekan tanpa mengorbankan Sharpe. Tiga: TO 40–70% → ZONA PENALTI: hanya dilanjutkan bila Sharpe-nya luar biasa (≥ 2,5) dan ada rencana diet turnover konkret (decay lebih besar, smoothing, window lebih panjang). Empat: TO > 70% → ZONA MERAH: gagal gerbang WQB — buang atau selamatkan strukturnya, jangan submit apa adanya.",
        "Aturan praktis 10 detik: di bawah 25 santai; 25–40 waspada; 40–70 butuh alasan kuat + rencana diet; di atas 70 lupakan submit, selamatkan idenya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Turnover adalah satu-satunya metrik yang bisa kamu perbaiki tanpa menemukan sinyal baru: decay lebih besar, window lebih panjang, dan smoothing hampir selalu menurunkannya. 'Diet turnover' adalah pekerjaan termurah di meja riset.",
      },
      reference: "<25 hijau · 25–40 kuning · 40–70 penalti + rencana diet · >70 buang/submit mustahil.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Paper champion Sharpe 2,96",
      prose: [
        "Data: kandidat X — Sharpe 2,96 (tertinggi yang pernah tercatat tim), return 14%, turnover 92%, fitness 1,15, drawdown 11%. Seorang anggota tim mengusulkan: 'Sharpe tertinggi sepanjang sejarah kita — submit sekarang, mumpung belum ada yang punya.'",
        "Pertanyaan: keputusanmu? Pembahasan: (1) TO 92% > 70% → gagal gerbang keras WQB; submit = ditolak otomatis. (2) Fitness 0,87 < 1,0 → gagal gerbang kualitas juga. (3) Yang benar: SELAMATKAN strukturnya, bukan submit angkanya — buat varian 'diet': window ts_mean diperpanjang, decay dinaikkan, tambah smoothing; target TO < 70% (batas WQB), idealnya < 40%. (4) Pelajaran: Sharpe 2,96 dengan TO 92% bukan alpha — itu sinyal bagus yang dikemas dengan cara yang tidak bisa dieksekusi. Kemasan bisa diperbaiki; jangan buang sinyalnya.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Paper champion adalah risiko tata kelola riset: angka memesona menekan tim untuk meloloskan sesuatu yang aturannya jelas melarang. Keputusan berbasis ambang tertulis ada justru untuk momen seperti ini — saat emosi ingin mengalahkannya.",
      },
      reference: "Sharpe memesona + TO > 70% = selamatkan strukturnya, jangan submit angkanya.",
    },
    {
      id: "lab-diet",
      eyebrow: "Langkah 7 · Lab",
      title: "Diet turnover: dari 1,07 ke Excellent",
      prose: [
        "Kandidat D dari Lab 1 (Sharpe 2,96, return 12%, TO 92%, fitness 1,07) menjalani program diet: Tahap 1 — naikkan decay (TO 92 → 60). Tahap 2 — decay + smoothing (TO → 35). Tahap 3 — window lebih panjang (TO → 25). Tugasmu: hitung fitness tiap tahap + kategorinya (Excellent > 2,0 · Good > 1,5 · Average < 1,5), dan jawab: tahap berapa yang menembus Excellent?",
        "Eksperimen setelah selesai: berapa TO maksimum agar fitness-nya tepat 2,0? (Petunjuk: balik rumusnya — TO = R / (F/S)².)",
      ],
      tasks: [
        { id: "t1", text: "Tulis `fitness(S, R, TO)` dan `kategori(F)`" },
        { id: "t2", text: "Cetak fitness + kategori tiap tahap diet" },
      ],
      expected: "Tahap 0 (TO 92%): F 1.07 -> Average\nTahap 1 (TO 60%): F 1.32 -> Average\nTahap 2 (TO 35%): F 1.73 -> Good\nTahap 3 (TO 25%): F 2.05 -> Excellent",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Diet turnover pasti menurunkan Sharpe juga.” Tidak selalu: decay/smoothing yang tepat menenangkan posisi TANPA membunuh sinyal — Sharpe 2,96 dipakai konstan di lab ini, dan dalam praktik sering hanya turun sedikit sementara fitness melonjak. Itulah kenapa diet adalah pekerjaan termurah.",
      },
      hints: [
        "fitness = S * (R / max(TO, 12.5)) ** 0.5; S dan R konstan.",
        "Kategori: > 2,0 Excellent; > 1,5 Good; sisanya Average.",
      ],
      code: {
        starter: "# Kandidat D: Sharpe 2,96, return 12%. Tahap diet (TO %). JANGAN UBAH.\nS, R = 2.96, 12.0\ntahap = [(\"Tahap 0\", 92), (\"Tahap 1\", 60), (\"Tahap 2\", 35), (\"Tahap 3\", 25)]\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return  # S * sqrt(R / max(TO, 12.5))\n\ndef kategori(F):\n    return  # 'Excellent' / 'Good' / 'Average'\n\nfor nama, TO in tahap:\n    F = fitness(S, R, TO)\n    print(f\"{nama} (TO {TO}%): F {F:.2f} -> {kategori(F)}\")\n",
        lockLines: 3,
        solution: "# Kandidat D: Sharpe 2,96, return 12%. Tahap diet (TO %). JANGAN UBAH.\nS, R = 2.96, 12.0\ntahap = [(\"Tahap 0\", 92), (\"Tahap 1\", 60), (\"Tahap 2\", 35), (\"Tahap 3\", 25)]\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return S * ((R / max(TO, 12.5)) ** 0.5)\n\ndef kategori(F):\n    return \"Excellent\" if F > 2.0 else (\"Good\" if F > 1.5 else \"Average\")\n\nfor nama, TO in tahap:\n    F = fitness(S, R, TO)\n    print(f\"{nama} (TO {TO}%): F {F:.2f} -> {kategori(F)}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `kategori` ada", msg: "Definisikan def kategori(F).", name: "kategori" },
          { kind: "stdout_matches", task: "t2", label: "Tahap 0 = 1,07 Average", msg: "Titik awal paper champion.", pattern: "Tahap 0 \\(TO 92%\\): F 1\\.07 -> Average" },
          { kind: "stdout_matches", task: "t2", label: "Tahap 3 = 2,05 Excellent", msg: "Diet penuh menembus Excellent.", pattern: "Tahap 3 \\(TO 25%\\): F 2\\.05 -> Excellent" }
        ],
      },
      reference: "Diet turnover: pekerjaan termurah dengan bayaran terbesar.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang odometer yang menentukan hidup-mati alpha.",
      ],
      tasks: [],
      summary: [
        "Turnover = rata-rata |perubahan posisi| per hari — odometer, bukan jarak tempuh.",
        "Tiga tagihan per putaran: komisi, spread, slippage — fitness memotong ketiganya.",
        "70% = gerbang keras WQB; 40% = ambang penalti prioritas internal.",
        "Sharpe sama + turnover beda = fitness beda jauh (1,66 vs 1,02).",
        "Paper champion: selamatkan strukturnya lewat diet turnover, jangan submit angkanya.",
      ],
      quiz: [
        {
          q: "Posisi: [50, 50, 50, 50]. Turnover?",
          options: [
            { text: "0% — tidak ada perubahan posisi", why: "Benar. Turnover mengukur perubahan, bukan besar posisi.", correct: true },
            { text: "50% — rata-rata posisinya 50", why: "Itu rata-rata posisi, bukan turnover. Turnover = rata-rata |Δ|." },
            { text: "200% — 50 × 4 hari", why: "Tidak ada perkalian dengan jumlah hari; rumusnya rata-rata selisih." }
          ],
        },
        {
          q: "Sharpe 2,4 · return 12% · TO 66%. Fitness ≈ ?",
          options: [
            { text: "1,02  (2,4 × √(12/66))", why: "Tepat — nyaris gagal.", correct: true },
            { text: "1,66  (2,4 × √(12/25))", why: "Itu untuk TO 25% — baca lagi turnover soalnya." },
            { text: "2,40 — turnover tidak memengaruhi fitness", why: "Salah total: akar (return/turnover) adalah inti rumus fitness." }
          ],
        },
        {
          q: "Kandidat TO 75%, Sharpe 2,8. Keputusan?",
          options: [
            { text: "Buang/submit mustahil — di atas cap 70%; selamatkan strukturnya bila idenya bagus", why: "Benar. Gerbang keras tidak bisa dinegosiasi.", correct: true },
            { text: "Submit — Sharpe 2,8 terlalu bagus untuk dilewatkan", why: "Akan ditolak otomatis oleh gerbang 70%." },
            { text: "Turunkan manual angka turnover di laporan", why: "Manipulasi laporan = pelanggaran integritas." }
          ],
        },
        {
          q: "Cara termurah menurunkan turnover?",
          options: [
            { text: "Decay lebih besar / window lebih panjang / smoothing", why: "Benar — 'diet turnover' tanpa mencari sinyal baru.", correct: true },
            { text: "Mencari data field baru yang belum dipakai", why: "Itu mencari sinyal baru — mahal dan belum tentu menurunkan turnover." },
            { text: "Menaikkan leverage", why: "Leverage memperbesar posisi, bukan menenangkan perubahan posisi." }
          ],
        },
        {
          q: "Kenapa fitness memakai max(TO, 12,5%)?",
          options: [
            { text: "Mencegah bonus semu bagi strategi yang nyaris tidak trading", why: "Tepat — lantai anti-gaming.", correct: true },
            { text: "Karena turnover di bawah 12,5% dilarang", why: "Tidak dilarang — hanya tidak diberi bonus tambahan." },
            { text: "Agar semua alpha punya fitness minimal 1,0", why: "Tidak ada jaminan seperti itu; fitness bisa di bawah 1,0." }
          ],
        }
      ],
      reference: "Turnover = biaya per putaran. Di bawah 25 santai, di atas 70 lupakan.",
    },
  ],
};
