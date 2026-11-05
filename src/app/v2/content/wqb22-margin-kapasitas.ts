import type { V2Lesson } from "../lib/types";

const FIG_MARGIN = `<svg viewBox="0 0 560 300" role="img" aria-label="Bar chart margin enam alpha vs garis biaya.">
<g font-family="var(--font-ui)">
<text x="16" y="22" font-size="13" fill="var(--chart-text)" font-weight="600">Margin (bps) vs garis biaya 4 bps</text>
<line x1="60" y1="40" x2="60" y2="250" stroke="var(--chart-grid)" stroke-width="1"/>
<line x1="60" y1="250" x2="540" y2="250" stroke="var(--chart-grid)" stroke-width="1"/>
<text x="22" y="62" font-size="10" fill="var(--chart-text)">24</text>
<text x="22" y="125" font-size="10" fill="var(--chart-text)">16</text>
<text x="28" y="188" font-size="10" fill="var(--chart-text)">8</text>
<text x="28" y="248" font-size="10" fill="var(--chart-text)">0</text>
<rect x="80" y="218" width="52" height="32" fill="var(--c2)" opacity="0.85"/>
<text x="106" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">A</text>
<text x="106" y="212" font-size="10" fill="var(--chart-text)" text-anchor="middle">3,97</text>
<rect x="152" y="190" width="52" height="60" fill="var(--c4)" opacity="0.85"/>
<text x="178" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">B</text>
<text x="178" y="184" font-size="10" fill="var(--chart-text)" text-anchor="middle">7,44</text>
<rect x="224" y="52" width="52" height="198" fill="var(--c4)" opacity="0.85"/>
<text x="250" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">C</text>
<text x="250" y="46" font-size="10" fill="var(--chart-text)" text-anchor="middle">24,6</text>
<rect x="296" y="233" width="52" height="17" fill="var(--c2)" opacity="0.85"/>
<text x="322" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">D</text>
<text x="322" y="227" font-size="10" fill="var(--chart-text)" text-anchor="middle">2,08</text>
<rect x="368" y="205" width="52" height="45" fill="var(--c4)" opacity="0.85"/>
<text x="394" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">E</text>
<text x="394" y="199" font-size="10" fill="var(--chart-text)" text-anchor="middle">5,56</text>
<rect x="440" y="172" width="52" height="78" fill="var(--c4)" opacity="0.85"/>
<text x="466" y="265" font-size="11" fill="var(--chart-text)" text-anchor="middle">F</text>
<text x="466" y="166" font-size="10" fill="var(--chart-text)" text-anchor="middle">9,72</text>
<line x1="60" y1="218" x2="540" y2="218" stroke="#e11d48" stroke-width="2" stroke-dasharray="8 5"/>
<text x="545" y="222" font-size="11" fill="#e11d48" font-weight="600">biaya 4 bps</text>
<text x="60" y="292" font-size="11" fill="var(--chart-text)">A &amp; D (merah pudar) mati di bawah garis biaya · sisanya hidup</text>
</g>
</svg>`;

const FIG_PETA_MARGIN = `<svg viewBox="0 0 520 360" role="img" aria-label="Flowchart keputusan margin dan turnover.">
<g font-family="var(--font-ui)">
<text x="16" y="24" font-size="13" fill="var(--chart-text)" font-weight="600">Peta keputusan: margin × turnover</text>
<rect x="180" y="40" width="160" height="30" fill="var(--c1)" opacity="0.9"/>
<text x="260" y="60" font-size="12" fill="var(--chart-text)" text-anchor="middle">Kandidat lolos gerbang Sharpe</text>
<polygon points="260,82 350,116 260,150 170,116" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="120" font-size="11" fill="var(--chart-text)" text-anchor="middle">Margin ≥ 8 bps?</text>
<text x="366" y="100" font-size="11" fill="var(--chart-text)">ya → SUBMIT-READY</text>
<polygon points="260,162 350,196 260,230 170,196" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="200" font-size="11" fill="var(--chart-text)" text-anchor="middle">Margin 3–8 bps?</text>
<text x="366" y="178" font-size="11" fill="var(--chart-text)">ya → DIET turnover</text>
<polygon points="260,242 350,276 260,310 170,276" fill="var(--c2)" opacity="0.9"/>
<text x="260" y="280" font-size="11" fill="var(--chart-text)" text-anchor="middle">TO di 1%–70%?</text>
<text x="366" y="258" font-size="11" fill="var(--chart-text)">tidak → BUANG</text>
<rect x="180" y="318" width="160" height="30" fill="var(--c4)" opacity="0.9"/>
<text x="260" y="338" font-size="11" fill="var(--chart-text)" text-anchor="middle">Margin &lt; 3 → REWORK/BUANG</text>
</g>
</svg>`;

export const wqb22: V2Lesson = {
  slug: "wqb22-margin-kapasitas",
  track: "WorldQuant Brain",
  module: "Ekonomi Alpha",
  title: "WQB22 — Margin & Kapasitas: Kapan Alpha Lolos Semua Tes tapi Mati di Biaya",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Alpha yang lolos semua tes — lalu mati di kasir",
      prose: [
        "Ada dua alpha di meja review. Alpha A: Sharpe 2,1, fitness 1,8, turnover 30% — lolos semua gerbang simulasi, rating Good. Alpha B: Sharpe 1,4, fitness 1,3, turnover 8% — biasa saja, nyaris Average. Semua orang di ruangan memilih A. Lalu seseorang membuka kolom yang jarang dibaca orang: Margin. A: 3,97 bps. B: 7,44 bps. Biaya trading realistis: 4 bps per dolar yang diperdagangkan.",
        "Hitung kasarnya: A menghasilkan PnL $600 ribu setahun, tetapi memperdagangkan $1,5 miliar dolar dalam setahun untuk mendapatkannya. Setelah biaya 4 bps: $600 ribu − $605 ribu = minus $5 ribu. Alpha A — yang Sharpe-nya 2,1 — menghasilkan nol. B: PnL $300 ribu, biaya $161 ribu, sisa $139 ribu. Yang 'biasa saja' hidup; yang 'bintang' mati.",
        "Twist-nya: tidak ada satu pun tes platform yang menangkap ini. Gerbang Sharpe lolos. Fitness lolos. Turnover 30% masih di bawah batas 70%. Alpha A adalah alpha yang sempurna di atas kertas dan mayat di kasir. Margin adalah metrik yang menanyakan satu hal yang tidak ditanyakan metrik lain: untuk setiap dolar yang kamu perdagangkan, berapa sen yang benar-benar kamu kantongi?",
        "Setelah lesson ini kamu bisa: (1) menghitung margin alpha dari angka IS Summary dalam bps; (2) menentukan break-even cost — biaya maksimum yang masih bisa ditanggung alpha; (3) menjelaskan mengapa menurunkan turnover menaikkan margin tanpa mengubah sinyal; (4) menerapkan peta keputusan margin × turnover sebelum submit; (5) membedakan alpha 'lolos tes' dari alpha 'lolos ekonomi'.",
      ],
      tasks: [],
      note: {
        title: "Prasyarat ringkas",
        body: "Turnover = fraksi book yang diperdagangkan per hari (nilai traded dibagi book size $20 juta); gerbang submit menuntut 1% < turnover < 70%. Fitness = Sharpe × akar(|returns| / maks(turnover, 0,125)) — skor kualitas gabungan; ambang 'Average' untuk Delay-1 adalah fitness > 1. IS Summary adalah blok statistik hasil simulasi (Sharpe, fitness, returns, turnover, margin, PnL, drawdown per tahun) yang kamu baca sebelum menekan Check Submission.",
      },
      reference: "Margin = pertanyaan kasir: berapa sen per dolar traded yang kamu kantongi?",
    },
    {
      id: "konsep",
      eyebrow: "Langkah 2 · Konsep",
      title: "Margin — Si Penjaga Kasir",
      tasks: [],
      prose: [
        "Margin mengukur berapa banyak profit yang diekstrak alpha per dolar yang diperdagangkan — profitabilitas per unit turnover. Di kolom IS Summary, margin didefinisikan sebagai PnL dibagi total dolar yang diperdagangkan pada periode tersebut. Satuan standarnya: basis points (bps), seperseratus persen.",
        "Rumusnya menghubungkan tiga angka yang sudah kamu kenal: returns (return tahunan = PnL tahunan dibagi setengah book size), turnover (fraksi book yang ditradingkan per hari), dan margin sebagai turunannya. Intuisi rumusnya: returns memberitahu seberapa besar kue-nya, turnover memberitahu berapa kali kamu membayar ongkos untuk memotong kue itu.",
        "Kepribadian Margin: ia adalah kasir yang tidak peduli seberapa brilian idemu. Ia hanya menanyakan satu hal — setelah semua ongkos keluar, berapa yang tersisa? Alpha dengan Sharpe 3 tetapi margin 2 bps adalah koki bintang yang bahan bakunya lebih mahal dari harga jual makanannya. Restorannya tutup bukan karena makanannya tidak enak.",
        "Kapan memakai margin: selalu, sebagai saringan TERAKHIR sebelum submit — setelah gerbang Sharpe, fitness, turnover, dan sub-universe lolos. Margin menjawab pertanyaan yang tidak dijawab keempatnya: apakah edge ini cukup tebal untuk bertahan di dunia nyata yang mengenakan biaya?",
        "Saudara kembar margin adalah IC — Information Coefficient: korelasi cross-sectional antara forecast alpha hari ini dan realized forward return besok. Mean IC 0,02–0,05 yang KONSISTEN (IR of IC tinggi) sering lebih berharga daripada IC besar yang erratic. Versi rank-based (Spearman) paling robust terhadap outlier. IC menjawab 'apakah sinyalmu memprediksi?', margin menjawab 'apakah prediksimu cukup murah untuk ditradingkan?' — alpha butuh keduanya.",
      ],
      formula: String.raw`\text{Margin} = \frac{\text{Total PnL}}{\text{Total Dollar Traded}} = \frac{\text{Mean Returns}}{\text{Turnover}} \times 10^{4}\ \text{(bps)}`,
      formulaNote: "Total PnL = profit/loss dolar periode itu; Total Dollar Traded = seluruh nilai yang diperdagangkan (beli+jual) periode itu; Mean Returns = return rata-rata; Turnover = fraksi book yang ditradingkan; ×10⁴ mengubah rasio menjadi basis points. Contoh: returns 6% dan turnover 30% → 0,06/0,30 × 10⁴ = 2.000... tunggu, itu salah — lihat langkah 3 untuk hitungan yang benar dengan angka tahunan.",
      note: {
        title: "Intuisi",
        body: "Margin NAIK ketika turnover TURUN — PnL yang sama diperoleh dengan lebih sedikit trading. Inilah mengapa decay, trade_when, dan hump adalah 'mesin kasir': mereka tidak menambah edge, mereka mengurangi ongkos mengambil edge yang sama. Over-decay melewati titik jenuh (turnover < 12,5% tidak lagi menaikkan fitness) hanya mengorbankan responsivitas sinyal.",
      },
      reference: "Margin = PnL / $ traded. Kasir tidak peduli Sharpe-mu.",
    },
    {
      id: "angka",
      eyebrow: "Langkah 3 · Angka",
      title: "Hitungan tangan: dari IS Summary ke vonis kasir",
      prose: [
        "Ambil Alpha A dari cerita. IS Summary-nya: annual PnL $600.000, book size $20 juta (konstan; return dihitung dari basis $10 juta), turnover 30% per hari. Langkah 1 — dolar yang diperdagangkan per hari: 30% × $20 juta = $6 juta. Langkah 2 — setahun (252 hari trading): $6 juta × 252 = $1,512 miliar. Langkah 3 — margin: $600.000 / $1.512.000.000 = 0,0003968 = 3,97 bps.",
        "Sekarang vonis kasirnya. Biaya realistis 4 bps per dolar traded (komisi + slippage + market impact — angka ilustratif, bukan angka resmi platform): 0,0004 × $1,512 miliar = $604.800. Net PnL = $600.000 − $604.800 = −$4.800. Alpha A mati — bukan karena sinyalnya jelek, melainkan karena ia membayar $1,01 biaya untuk setiap $1 profit kotor.",
        "Bandingkan Alpha B: PnL $300.000, turnover 8%. Traded per hari: 8% × $20 juta = $1,6 juta; setahun $403,2 juta. Margin: $300.000 / $403,2 juta = 7,44 bps. Biaya 4 bps: $161.280. Net: +$138.720. B hidup dengan nyaman.",
        "Rumus break-even yang bisa kamu pakai selamanya: biaya maksimum yang masih bisa ditanggung = margin itu sendiri. Margin 3,97 bps artinya alpha impas tepat di biaya 3,97 bps — setiap bps di atasnya adalah kerugian. Aturan praktis meja review: jangan submit alpha yang margin-nya kurang dari 2× biaya realistis; buffer itu adalah ruang napasmu saat slippage memburuk.",
        "Catatan batas pengetahuan: platform tidak mempublikasikan model biaya pastinya — angka 4 bps di lesson ini ilustratif untuk melatih intuisi, bukan konstanta resmi. Yang resmi dan terverifikasi adalah definisi margin (PnL / total dollar traded) dan gerbang turnover 1%–70%.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Margin tinggi = Sharpe tinggi.” Salah arah. Margin = returns/turnover — alpha dengan Sharpe 1,3 dan turnover 8% bisa punya margin 2× lipat alpha Sharpe 2,5 dengan turnover 45%. Sharpe mengukur return per unit RISIKO; margin mengukur return per unit TRADING. Keduanya penting, keduanya berbeda.",
      },
      hints: [
        "Cek cepat: margin (bps) ≈ (returns% / turnover%) × 100. A: 6/30 × 100 = 20? Salah — returns 6% = PnL/(book/2), sedangkan turnover memakai book penuh. Pakai rumus lengkap langkah 3, jangan jalan pintas.",
      ],
      reference: "Break-even cost = margin. Margin < 2× biaya → jangan submit.",
    },
    {
      id: "lab-margin",
      eyebrow: "Langkah 4 · Lab",
      title: "Kalkulator kasir: tulis fungsi margin",
      prose: [
        "Tulis fungsi `margin_bps(pnl, turnover, book=20_000_000, days=252)` yang mengembalikan margin dalam bps: pnl / (turnover × book × days) × 10.000. Lalu terapkan pada 6 alpha dan tentukan mana yang selamat dari biaya 4 bps.",
        "Eksperimen setelah selesai: ubah biaya menjadi 2 bps dan 6 bps — pada titik berapa Alpha A hidup kembali? Dan berapa turnover maksimum yang masih bisa ditoleransi Alpha A bila ia ingin margin 8 bps dengan PnL yang sama? (Petunjuk: balik rumusnya — turnover = pnl / (margin_target × book × days).)",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi margin_bps" },
        { id: "t2", text: "Hitung margin 6 alpha, vonis vs biaya 4 bps" },
      ],
      expected: "A: 3.97 bps -> MATI\nB: 7.44 bps -> HIDUP\nC: 24.60 bps -> HIDUP\nD: 2.08 bps -> MATI\nE: 5.56 bps -> HIDUP\nF: 9.72 bps -> HIDUP",
      note: {
        title: "Intuisi",
        body: "Perhatikan C: margin 24,6 bps dengan turnover hanya 5% — alpha 'malas' yang jarang trading tetapi tiap trading-nya tebal. Inilah profil yang paling disukai kasir: sedikit transaksi, tiap transaksi bernilai. Lawannya D: 2,1 bps — sibuk trading, tipis untung.",
      },
      hints: [
        "margin = pnl / (turnover * book * days) * 10000. turnover dalam fraksi (0.30, bukan 30).",
        "Vonis: 'HIDUP' bila margin >= 4.0, else 'MATI'.",
      ],
      code: {
        starter: "# (nama, annual_pnl_usd, turnover_fraksi). JANGAN UBAH.\nalpha = [\n    (\"A\", 600_000, 0.30), (\"B\", 300_000, 0.08), (\"C\", 620_000, 0.05),\n    (\"D\", 420_000, 0.40), (\"E\", 560_000, 0.20), (\"F\", 490_000, 0.10),\n]\nBIAYA = 4.0  # bps, ilustratif\nBOOK, DAYS = 20_000_000, 252\n\n# TULIS KODEMU\ndef margin_bps(pnl, turnover, book=BOOK, days=DAYS):\n    return  # pnl / (turnover*book*days) * 10000\n\nfor nama, pnl, to in alpha:\n    m = margin_bps(pnl, to)\n    print(f\"{nama}: {m:.2f} bps -> {'HIDUP' if m >= BIAYA else 'MATI'}\")\n",
        lockLines: 7,
        solution: "# (nama, annual_pnl_usd, turnover_fraksi). JANGAN UBAH.\nalpha = [\n    (\"A\", 600_000, 0.30), (\"B\", 300_000, 0.08), (\"C\", 620_000, 0.05),\n    (\"D\", 420_000, 0.40), (\"E\", 560_000, 0.20), (\"F\", 490_000, 0.10),\n]\nBIAYA = 4.0  # bps, ilustratif\nBOOK, DAYS = 20_000_000, 252\n\n# TULIS KODEMU\ndef margin_bps(pnl, turnover, book=BOOK, days=DAYS):\n    return pnl / (turnover * book * days) * 10000\n\nfor nama, pnl, to in alpha:\n    m = margin_bps(pnl, to)\n    print(f\"{nama}: {m:.2f} bps -> {'HIDUP' if m >= BIAYA else 'MATI'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "A mati (3,97 bps)", msg: "Margin A = 600000/(0.30*20jt*252)*10000 = 3,97.", pattern: "A: 3\\.97 bps -> MATI" },
          { kind: "stdout_matches", task: "t2", label: "B hidup (7,44 bps)", msg: "Margin B = 300000/(0.08*20jt*252)*10000 = 7,44.", pattern: "B: 7\\.44 bps -> HIDUP" },
          { kind: "stdout_matches", task: "t2", label: "D mati (2,08 bps)", msg: "Margin D paling tipis.", pattern: "D: 2\\.08 bps -> MATI" },
          { kind: "stdout_matches", task: "t2", label: "C hidup (24,60 bps)", msg: "Margin C paling tebal.", pattern: "C: 24\\.60 bps -> HIDUP" }
        ],
      },
      reference: "Kasir menghitung dulu, kagum kemudian.",
    },
    {
      id: "chart",
      eyebrow: "Langkah 5 · Chart",
      title: "Membaca bar chart margin",
      prose: [
        "Cara membaca: sumbu X = enam alpha (A–F); tinggi batang = margin dalam bps; garis merah putus-putus = biaya realistis 4 bps. Batang di atas garis = selamat; di bawah garis = mati. Warna pudar (A, D) menandai yang mati.",
        "Interpretasi: hanya 4 dari 6 alpha yang hidup di biaya 4 bps — dan yang mati termasuk A, alpha dengan PnL kotor terbesar ($600 ribu). Pola umumnya: batang-batang pendek (margin tipis) hampir selalu milik alpha turnover tinggi. C (24,6 bps, TO 5%) adalah profil ideal kasir: jarang trading, tiap trading tebal. Pelajaran chart ini: PnL kotor tanpa margin adalah angka mentah — yang menentukan hidup-mati adalah jarak batang ke garis merah.",
        "What-if: geser garis biaya ke 6 bps (pasar stres, slippage memburuk) — E (5,6) ikut mati, tinggal B, C, F. Inilah mengapa aturan 'margin ≥ 2× biaya' ada: buffer 2× membuat alpha selamat bukan hanya di biaya normal, tetapi juga saat biaya memburuk 50%.",
      ],
      figure: {
        svg: FIG_MARGIN,
        alt: "Bar chart margin enam alpha; A dan D di bawah garis biaya 4 bps.",
        caption: "Margin 6 alpha vs biaya 4 bps — A & D mati walau PnL kotor A terbesar.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Chart ini adalah versi visual dari satu kalimat: 'jangan jatuh cinta pada PnL kotor'. Tempel pola pikirnya ke setiap review: cari dulu garis biayanya, baru kagumi batangnya.",
      },
      reference: "Batang di bawah garis merah = mayat berjalan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta margin × turnover: 4 skenario",
      prose: [
        "Skenario 1 — Margin ≥ 8 bps, turnover 1%–70%: KASIR AMAN. Alpha lolos ekonomi dengan buffer ≥ 2× biaya 4 bps. Lanjut ke saringan klaster & korelasi. Contoh: C (24,6 bps).",
        "Skenario 2 — Margin 3–8 bps: DIET TURNOVER. Edge-nya nyata tetapi ongkosnya menggerogoti. Terapkan decay lebih besar, trade_when kondisional, atau hump untuk menekan perubahan kecil — lalu ukur ulang margin. Target: tembus 8 bps. Contoh: E (5,6 bps) → diet dari TO 20% ke ~12% bila PnL bertahan.",
        "Skenario 3 — Margin < 3 bps: REWORK ATAU BUANG. Di bawah biaya realistis — alpha ini mensubsidi broker. Jangan diet membabi-buta (over-decay membunuh sinyal); pertimbangkan ulang sinyalnya atau buang. Contoh: D (2,1 bps).",
        "Skenario 4 — Turnover di luar 1%–70%: GAGAL GERBANG OTOMATIS. Di atas 70%: terlalu boros, buang atau diet drastis. Di bawah 1%: terlalu jarang trading — juga gagal submit (dan patut dicurigai: apakah simulasinya masuk akal?).",
        "Cara membaca figur: mulai dari kotak kandidat di atas, jawab tiap belah ketupat berurutan — margin dulu, baru turnover. Interpretasi: hanya jalur 'ya-ya' yang mencapai SUBMIT-READY; tiga jalur lain adalah vonis dengan resep (diet / rework / buang), bukan vonis tanpa harapan.",
        "Aturan praktis 10 detik: margin < 2× biaya → jangan submit · turnover > 40% → diet dulu · turnover > 70% → buang · margin ≥ 8 bps → lanjut saringan klaster.",
      ],
      figure: {
        svg: FIG_PETA_MARGIN,
        alt: "Flowchart keputusan: margin ≥ 8 submit-ready; 3–8 diet; < 3 rework; turnover di luar 1–70% buang.",
        caption: "Empat skenario: kasir aman, diet, rework/buang, gagal gerbang.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        body: "“Turnover rendah selalu bagus.” Tidak — gerbang bawah 1% ada karena alpha yang hampir tidak pernah trading patut dicurigai (sinyal macet? universe salah?). Dan ingat lantai fitness: di bawah turnover 12,5%, menurunkan turnover lagi tidak menaikkan fitness — diet melewati titik itu hanya mengorbankan responsivitas tanpa imbalan.",
      },
      reference: "Margin dulu, turnover kemudian, klaster terakhir.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kasus: dua kandidat, satu slot submit",
      prose: [
        "Kamu punya satu slot submit hari ini. Kandidat X: Sharpe 2,6, fitness 2,1 (Excellent), turnover 55%, annual PnL $780 ribu, book $20 juta. Kandidat Y: Sharpe 1,5, fitness 1,6 (Good), turnover 9%, annual PnL $330 ribu. Biaya realistis 4 bps. Mana yang disubmit? Tulis jawaban + satu kalimat alasan SEBELUM membaca pembahasan.",
        "Pembahasan: hitung margin X — traded/hari = 55% × $20jt = $11jt; setahun $2,772 miliar; margin = $780rb / $2,772M = 2,81 bps. Di bawah biaya 4 bps → X MATI di kasir (net −$329rb). Margin Y — traded/hari $1,8jt; setahun $453,6jt; margin = $330rb / $453,6jt = 7,27 bps → net +$148rb. Jawaban: submit Y. Satu kalimat: 'X Excellent di kertas tetapi margin 2,81 bps < biaya 4 bps — ia membayar untuk trading; Y Good tetapi margin 7,27 bps dengan buffer 1,8×.'",
        "Perhatikan betapa menyakitkannya ini: X adalah kandidat TERBAIK di paket berdasarkan semua metrik simulasi (Sharpe 2,6! Excellent!). Menahannya terasa seperti membuang uang — padahal mensubmitnya justru membuang uang beneran. Disiplin kasir > nafsu angka.",
        "Variasi untuk mengasah: bagaimana bila X didiet dari TO 55% ke 25% dan PnL-nya turun 20% (menjadi $624rb)? Margin baru = $624rb / (0,25×$20jt×252 = $1,26M) = 4,95 bps — masih di bawah 2× biaya (8 bps) tetapi sudah di atas biaya. Vonis: dari BUANG menjadi TAHAN + diet lanjutan, belum SUBMIT. Diet bukan tiket otomatis — ia hanya mengubah vonis bila angkanya ikut berubah.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Logika ini identik dengan analisis biaya transaksi di market risk dan execution: gross alpha tanpa net-of-cost adalah fiksi. Bedanya, di WQB kamu memegang kalkulatornya sendiri — tidak ada tim eksekusi yang menghitung untukmu.",
      },
      reference: "Excellent yang mati di kasir tetap mayat.",
    },
    {
      id: "lab-kapasitas",
      eyebrow: "Langkah 8 · Lab",
      title: "Stress test biaya: siapa selamat saat pasar stres?",
      prose: [
        "Biaya tidak konstan — saat volatilitas meledak, slippage memburuk. Tulis fungsi `net_pnl(pnl, turnover, cost_bps)` yang mengembalikan PnL bersih: pnl − (cost_bps/10.000) × turnover × book × days. Terapkan pada 6 alpha untuk skenario biaya [2, 4, 6] bps dan cetak tabelnya.",
        "Lalu jawab: alpha mana yang selamat di SEMUA skenario? Itulah definisi 'kapasitas ekonomi' versi kasir — bukan seberapa besar PnL kotornya, melainkan seberapa dalam biaya bisa memburuk sebelum ia mati.",
        "Eksperimen: tambahkan skenario 8 bps. Pada titik ini bahkan C pun tertekan — diskusikan: apakah ini berarti C jelek, atau berarti 8 bps adalah rezim biaya yang tidak realistis untuk strategi apa pun? (Petunjuk: pikirkan biaya sebagai cerminan kapasitas — strategi berbiaya 8 bps butuh edge yang luar biasa tebal.)",
      ],
      tasks: [
        { id: "t1", text: "Tulis fungsi net_pnl" },
        { id: "t2", text: "Cetak tabel net PnL 3 skenario biaya" },
      ],
      expected: "skenario 2bps: semua HIDUP\nskenario 4bps: A,D MATI\nskenario 6bps: A,D,E MATI",
      note: {
        title: "Intuisi",
        body: "Stress test ini adalah 'uji kapasitas' paling jujur: bukan berapa besar bukunya, melainkan berapa besar guncangan biaya yang bisa ditahannya. Alpha yang selamat di 6 bps punya 'kapasitas ekonomi' 3× lipat alpha yang mati di 2 bps — dan itu jauh lebih penting daripada selisih Sharpe 0,5.",
      },
      hints: [
        "net = pnl - (cost_bps/10000) * turnover * 20000000 * 252.",
        "Loop cost dalam [2, 4, 6]; untuk tiap alpha cetak selamat/mati.",
      ],
      code: {
        starter: "# (nama, annual_pnl_usd, turnover_fraksi). JANGAN UBAH.\nalpha = [\n    (\"A\", 600_000, 0.30), (\"B\", 300_000, 0.08), (\"C\", 620_000, 0.05),\n    (\"D\", 420_000, 0.40), (\"E\", 560_000, 0.20), (\"F\", 490_000, 0.10),\n]\nBOOK, DAYS = 20_000_000, 252\n\n# TULIS KODEMU\ndef net_pnl(pnl, turnover, cost_bps):\n    return  # pnl - (cost_bps/10000)*turnover*BOOK*DAYS\n\nfor c in [2, 4, 6]:\n    mati = [n for n, p, t in alpha if net_pnl(p, t, c) < 0]\n    print(f\"skenario {c}bps: {', '.join(mati) if mati else 'semua HIDUP'}\")\n",
        lockLines: 7,
        solution: "# (nama, annual_pnl_usd, turnover_fraksi). JANGAN UBAH.\nalpha = [\n    (\"A\", 600_000, 0.30), (\"B\", 300_000, 0.08), (\"C\", 620_000, 0.05),\n    (\"D\", 420_000, 0.40), (\"E\", 560_000, 0.20), (\"F\", 490_000, 0.10),\n]\nBOOK, DAYS = 20_000_000, 252\n\n# TULIS KODEMU\ndef net_pnl(pnl, turnover, cost_bps):\n    return pnl - (cost_bps / 10000) * turnover * BOOK * DAYS\n\nfor c in [2, 4, 6]:\n    mati = [n for n, p, t in alpha if net_pnl(p, t, c) < 0]\n    print(f\"skenario {c}bps: {', '.join(mati) if mati else 'semua HIDUP'}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "2bps: semua hidup", msg: "Biaya ringan — semua selamat.", pattern: "skenario 2bps: semua HIDUP" },
          { kind: "stdout_matches", task: "t2", label: "4bps: A,D mati", msg: "A margin 3,97 < 4; D margin 2,10 < 4.", pattern: "skenario 4bps: A, D" },
          { kind: "stdout_matches", task: "t2", label: "6bps: A,D,E mati", msg: "E margin 5,60 < 6 ikut mati.", pattern: "skenario 6bps: A, D, E" }
        ],
      },
      reference: "Kapasitas ekonomi = seberapa buruk biaya boleh menjadi sebelum alpha mati.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Refleksi kasir",
      prose: [
        "Lima pertanyaan — tidak ada jawaban 'feeling', hanya hitungan.",
      ],
      tasks: [],
      summary: [
        "Margin = PnL / total dollar traded (bps); break-even cost = margin itu sendiri.",
        "Menurunkan turnover menaikkan margin — PnL sama, ongkos lebih sedikit.",
        "Aturan meja: margin ≥ 2× biaya realistis; turnover 1%–70% (gerbang submit).",
        "Sharpe tinggi ≠ selamat: A (S 2,1) mati di 4 bps, B (S 1,4) hidup.",
        "Stress test biaya = uji kapasitas ekonomi: siapa selamat saat biaya memburuk.",
        "IC kecil-konsisten (0,02–0,05, IR tinggi) > IC besar-erratic; versi rank paling robust.",
      ],
      quiz: [
        {
          q: "Definisi margin di IS Summary WQB?",
          options: [
            { text: "PnL dibagi total dolar yang diperdagangkan, dalam bps", why: "Tepat — profit per dollar traded.", correct: true },
            { text: "PnL dibagi book size", why: "Itu returns (PnL tahunan / setengah book), bukan margin." },
            { text: "Sharpe dibagi turnover", why: "Tidak ada definisi seperti itu; margin tidak melibatkan Sharpe." },
            { text: "Rata-rata return harian dalam persen", why: "Itu komponen return, bukan profit per dolar traded." }
          ],
        },
        {
          q: "Alpha A margin 3,97 bps, biaya realistis 4 bps. Vonis?",
          options: [
            { text: "MATI — biaya per dolar melebihi profit per dolar", why: "Benar: net = 600rb − 604,8rb < 0.", correct: true },
            { text: "HIDUP — Sharpe 2,1 menjamin profit", why: "Sharpe tidak membayar biaya; margin yang menentukan." },
            { text: "HIDUP — fitness 1,8 di atas ambang", why: "Fitness lolos gerbang simulasi, bukan gerbang kasir." },
            { text: "TAHAN — tunggu biaya turun", why: "Biaya tidak menunggu; vonisnya mati kecuali didiet." }
          ],
        },
        {
          q: "Cara paling langsung menaikkan margin tanpa mengubah sinyal inti?",
          options: [
            { text: "Turunkan turnover via decay / trade_when / hump", why: "Tepat — PnL sama, dolar traded lebih sedikit.", correct: true },
            { text: "Naikkan leverage book", why: "Book size konstan $20jt; leverage tidak mengubah margin." },
            { text: "Ganti universe ke yang lebih besar", why: "Universe tidak masuk rumus margin." },
            { text: "Naikkan delay simulasi", why: "Delay mengubah timing informasi, bukan biaya per dolar." }
          ],
        },
        {
          q: "Gerbang turnover untuk submit alpha?",
          options: [
            { text: "1% < turnover < 70%", why: "Benar — di luar rentang ini gagal otomatis.", correct: true },
            { text: "Turnover harus di bawah 12,5%", why: "12,5% adalah lantai fitness, bukan gerbang submit." },
            { text: "Semakin rendah semakin baik, tanpa batas", why: "Di bawah 1% juga gagal gerbang." },
            { text: "Turnover harus di atas 70%", why: "Terbalik — di atas 70% gagal." }
          ],
        },
        {
          q: "Soal IC: sinyal X mean IC 0,03 dengan IR tinggi; sinyal Y mean IC 0,08 tetapi erratic. Mana lebih berharga?",
          options: [
            { text: "X — IC kecil yang konsisten lebih berharga", why: "Tepat — konsistensi (IR of IC) yang menentukan.", correct: true },
            { text: "Y — IC lebih besar selalu menang", why: "IC besar yang erratic = prediksi tidak bisa diandalkan." },
            { text: "Keduanya sama — yang penting rata-ratanya", why: "Volatilitas IC menentukan kegunaan praktisnya." },
            { text: "Tidak bisa dibandingkan tanpa Sharpe", why: "IC dan Sharpe mengukur hal berbeda; perbandingan IC valid." }
          ],
        }
      ],
      reference: "Kasir menghitung dulu, kagum kemudian.",
    },
  ],
};
