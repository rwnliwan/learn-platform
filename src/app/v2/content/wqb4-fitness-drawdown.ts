import type { V2Lesson } from "../lib/types";

const FIG_DD = `<svg viewBox="0 0 520 280" role="img" aria-label="Kurva ekuitas dengan area drawdown diarsir antara puncak 110 dan lembah 102.">
<g font-family="var(--font-ui)">
<line x1="50" y1="20" x2="50" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="50" y1="240" x2="500" y2="240" stroke="var(--chart-text)" stroke-width="1.5"/>
<polygon points="230,80 320,80 320,108 230,108" fill="var(--c4)" opacity="0.25"/>
<polyline points="50,200 140,190 185,196 230,80 320,108 365,96 410,120 500,100" fill="none" stroke="var(--c1)" stroke-width="3"/>
<circle cx="230" cy="80" r="6" fill="var(--c3)"/>
<circle cx="320" cy="108" r="6" fill="var(--c4)"/>
<line x1="320" y1="80" x2="320" y2="108" stroke="var(--c4)" stroke-width="2" stroke-dasharray="5 4"/>
<text x="180" y="60" font-size="12" fill="var(--c3)" font-weight="bold">puncak 110</text>
<text x="330" y="130" font-size="12" fill="var(--c4)" font-weight="bold">lembah 102</text>
<text x="330" y="100" font-size="11" fill="var(--chart-text)">drawdown = (102-110)/110</text>
<text x="330" y="116" font-size="11" fill="var(--chart-text)">= -7,27%</text>
<text x="60" y="265" font-size="11" fill="var(--chart-text)">Max drawdown = penurunan TERDALAM dari puncak ke lembah: 7,27%.</text>
</g>
</svg>`;

const FIG_FIT = `<svg viewBox="0 0 520 260" role="img" aria-label="Batang fitness dua alpha ber-Sharpe sama: 2,19 vs 1,10, dengan garis ambang.">
<g font-family="var(--font-ui)">
<line x1="60" y1="200" x2="60" y2="20" stroke="var(--chart-text)" stroke-width="1.5"/>
<line x1="60" y1="200" x2="500" y2="200" stroke="var(--chart-text)" stroke-width="1.5"/>
<rect x="120" y="60" width="70" height="140" fill="var(--c1)" opacity="0.85"/>
<rect x="280" y="130" width="70" height="70" fill="var(--c4)" opacity="0.85"/>
<text x="155" y="50" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">2,19</text>
<text x="155" y="220" font-size="12" fill="var(--chart-text)" text-anchor="middle">Alpha P</text>
<text x="155" y="236" font-size="11" fill="var(--chart-text)" text-anchor="middle">TO 8%</text>
<text x="315" y="120" font-size="13" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">1,10</text>
<text x="315" y="220" font-size="12" fill="var(--chart-text)" text-anchor="middle">Alpha Q</text>
<text x="315" y="236" font-size="11" fill="var(--chart-text)" text-anchor="middle">TO 50%</text>
<line x1="60" y1="90" x2="500" y2="90" stroke="var(--c3)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="490" y="84" font-size="11" fill="var(--c3)" text-anchor="end">2,0 Excellent</text>
<line x1="60" y1="125" x2="500" y2="125" stroke="var(--c3)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="490" y="119" font-size="11" fill="var(--c3)" text-anchor="end">1,5 Good</text>
<line x1="60" y1="160" x2="500" y2="160" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="6 4"/>
<text x="490" y="154" font-size="11" fill="var(--chart-text)" text-anchor="end">1,0 syarat lolos</text>
<text x="80" y="252" font-size="11" fill="var(--chart-text)">Sharpe keduanya 2,0 — fitness-nya beda karena turnover.</text>
</g>
</svg>`;

export const wqb4: V2Lesson = {
  slug: "wqb4-fitness-drawdown",
  track: "WorldQuant Brain",
  module: "Fondasi: Dari Nol",
  title: "WQB4 — Fitness, Drawdown & Konsistensi",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sharpe kembar yang nasibnya beda",
      prose: [
        "Dua alpha masuk ruang review dengan Sharpe IDENTIK: 2,0. Alpha P: return 15% per tahun, volatilitas 7,5%. Alpha Q: return 15% per tahun, volatilitas 7,5%. 'Kembar identik,' gumam seorang reviewer, 'setujui keduanya.' Lalu kolom berikutnya terbuka: turnover. P: 8% per hari. Q: 50% per hari. Dan kolom berikutnya: maximum drawdown. P: 9%. Q: 22%.",
        "Reviewer senior menggeleng: 'Yang satu mesin presisi, yang satu mesin giling biaya.' Hitungan fitness mengonfirmasi: P = 2,19 (Excellent), Q = 1,10 (Average). P disubmit; Q dikembalikan untuk diobati turnover-nya. Dua Sharpe yang sama persis — satu lolos gemilang, satu nyaris gagal.",
        "Twist-nya: angka Sharpe 2,0 keduanya BENAR. Yang salah adalah kesimpulan 'Sharpe sama = sama bagus'. Sharpe hanya melihat return per unit risiko — ia buta terhadap BIAYA mencapai return itu (turnover) dan buta terhadap seberapa dalam luka terburuknya (drawdown). Fitness adalah kacamata yang melihat ketiganya sekaligus; drawdown adalah catatan rasa sakitnya. Lesson ini melengkapi kacamata itu.",
        "Setelah lesson ini kamu bisa: (1) menghitung maximum drawdown dari kurva ekuitas langkah demi langkah; (2) mengurai rumus fitness simbol per simbol dan menjelaskan fungsi lantai turnover 0,125; (3) menghitung fitness dari Sharpe, return, dan turnover; (4) membaca kategori WQB (Excellent > 2,0 · Good > 1,5 · Average < 1,5); (5) menjelaskan mengapa dua Sharpe sama bisa ber-fitness beda jauh.",
      ],
      tasks: [],
      note: {
        title: "Kacamata lengkap",
        body: "Sharpe menjawab 'seberapa efisien'. Turnover menjawab 'seberapa mahal'. Drawdown menjawab 'seberapa sakit'. Fitness menggabungkan ketiganya menjadi satu angka keputusan. Reviewer yang hanya membaca Sharpe = dokter yang hanya memeriksa tensi.",
      },
      reference: "Sharpe buta terhadap biaya & luka. Fitness + drawdown melengkapinya.",
    },
    {
      id: "drawdown",
      eyebrow: "Langkah 2 · Konsep",
      title: "Drawdown: mengukur rasa sakit",
      prose: [
        "Drawdown pada satu titik = penurunan ekuitas dari PUNCAK TERAKHIR ke titik itu, dalam persen: (lembah − puncak) / puncak. Maximum drawdown = drawdown TERDALAM sepanjang periode — 'luka terburuk' strategi. Ia menjawab pertanyaan investor yang paling jujur: 'kalau saya masuk di puncak tersial, seberapa dalam saya berdarah sebelum pulih?'",
        "Contoh terperinci — ekuitas: [100, 105, 103, 110, 102, 108]. Langkah 1, tandai puncak berjalan: hari ke-1 puncak 100; ke-2 puncak 105; ke-3 tetap 105; ke-4 puncak 110; ke-5 tetap 110; ke-6 tetap 110. Langkah 2, hitung drawdown tiap hari: ke-1: (100−100)/100 = 0%; ke-2: 0%; ke-3: (103−105)/105 = −1,90%; ke-4: 0% (puncak baru!); ke-5: (102−110)/110 = −7,27%; ke-6: (108−110)/110 = −1,82%. Langkah 3, ambil yang terdalam: −7,27%. Maximum drawdown = 7,27%. Perhatikan: dihitung dari puncak TERAKHIR (110), bukan dari modal awal (100) — inilah yang membuatnya jujur.",
        "Cara membaca figur: garis ekuitas naik-turun; titik hijau = puncak 110, titik merah = lembah 102, area arsir di antaranya = zona drawdown. Interpretasi: garis putus-putus vertikal menunjukkan dalamnya luka: (102−110)/110 = −7,27%. Investor yang masuk tepat di puncak 110 menanggung −7,27% sebelum pulih.",
        "Kepribadian konsep ini: drawdown adalah 'catatan rasa sakit' strategi. Sharpe bisa menutupinya dengan rata-rata yang indah — drawdown memaksanya mengaku.",
      ],
      formula: String.raw`\text{Drawdown}_t = \frac{\text{ekuitas}_t - \text{puncak}_t}{\text{puncak}_t} \times 100\%`,
      formulaNote: "puncak_t = nilai ekuitas TERTINGGI dari awal sampai hari ke-t (running maximum). Drawdown selalu ≤ 0%; maximum drawdown = nilai paling negatif (dilaporkan sebagai positif, mis. 7,27%).",
      figure: {
        svg: FIG_DD,
        alt: "Kurva ekuitas dengan puncak 110 dan lembah 102; area di antaranya diarsir sebagai drawdown 7,27%.",
        caption: "Drawdown = (102−110)/110 = −7,27%. Diukur dari puncak terakhir, bukan modal awal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Drawdown historis 9% berarti risiko maksimal 9%.' Drawdown historis = luka TERBURUK YANG TERCATAT, bukan luka terburuk yang MUNGKIN. Masa depan bisa lebih dalam — terutama jika strategi berubah atau rezim pasar berganti. Perlakukan max drawdown sebagai estimasi bawah, bukan jaminan atas.",
      },
      hints: [
        "💡 Puncak selalu diperbarui: setiap rekor baru me-reset drawdown ke 0%.",
        "Lacak dua angka: max drawdown (%) dan lama pemulihan (hari) — luka dalam yang cepat pulih beda dengan luka sedang yang tak pulih-pulih.",
      ],
      reference: "Max drawdown = penurunan terdalam dari puncak terakhir. Estimasi bawah, bukan jaminan.",
    },
    {
      id: "fitness",
      eyebrow: "Langkah 3 · Konsep",
      title: "Fitness: hakim agung tiga kriteria",
      prose: [
        "Rumus fitness WQB: Fitness ≈ Sharpe × √(|returns| / max(turnover, 0,125)). Bedah simbolnya. Sharpe = efisiensi return per risiko (sudah dikuasai). |returns| = return tahunan (annualized) dalam PERSEN — tulis 15 untuk 15%, bukan 0,15. turnover = turnover harian rata-rata dalam PERSEN — tulis 8 untuk 8%. max(turnover, 0,125) = NILAI TERBESAR antara turnover dan 0,125 — artinya turnover di bawah 12,5% diperlakukan SEOLAH 12,5%: inilah 'lantai turnover'. Akar kuadrat menormalkan skalanya agar fitness sebanding lintas strategi.",
        "Mengapa ada lantai 0,125? Tanpa lantai, strategi yang nyaris tidak pernah trading (turnover 1%) akan mendapat fitness raksasa semu — padahal portofolio nyaris statis bukanlah 'strategi aktif' yang bisa dipercaya dan diskalakan. Lantai berkata: 'di bawah 12,5%, tidak ada bonus tambahan untuk semakin malas trading.' Ia mencegah pemburu celah, bukan menghukum efisiensi.",
        "Contoh terperinci — Alpha P: Sharpe 2,0, returns 15%, turnover 8%. Langkah 1: max(8; 12,5) = 12,5 (lantai aktif!). Langkah 2: 15/12,5 = 1,2. Langkah 3: √1,2 = 1,0954. Langkah 4: 2,0 × 1,0954 = 2,19. Kategori: Excellent (> 2,0). Alpha Q: Sharpe 2,0, returns 15%, turnover 50%. Langkah 1: max(50; 12,5) = 50. Langkah 2: 15/50 = 0,3. Langkah 3: √0,3 = 0,5477. Langkah 4: 2,0 × 0,5477 = 1,10. Kategori: Average (< 1,5). Sharpe SAMA PERSIS — fitness beda 2x lipat, murni karena turnover. Inilah inti lesson ini.",
        "Kategori resmi: Excellent > 2,0 · Good > 1,5 · Average < 1,5. Dan syarat lolos submit: fitness > 1,0. Perhatikan Q: Sharpe 2,0 yang 'hebat' hanya menghasilkan fitness 1,10 — lolos tipis, nyaris gagal. Turnover adalah pembunuh diam-diam.",
        "Cara membaca figur: dua batang fitness — P setinggi 2,19 (biru, menembus garis Excellent), Q setinggi 1,10 (merah, di bawah garis Good). Tiga garis horizontal = ambang 2,0 / 1,5 / 1,0. Interpretasi: label di bawah tiap batang menunjukkan penyebabnya — turnover 8% vs 50% — dengan Sharpe yang sama (2,0). Satu gambar ini menjelaskan mengapa tim riset terobsesi menekan turnover.",
      ],
      formula: String.raw`\text{Fitness} \approx \text{Sharpe} \times \sqrt{\frac{|\text{returns}|}{\max(\text{turnover},\, 12{,}5)}}`,
      formulaNote: "|returns| = return tahunan dalam persen (tulis 15, bukan 0,15). turnover = turnover harian rata-rata dalam persen. max(turnover, 12,5) = lantai: turnover di bawah 12,5% dihitung sebagai 12,5%. Kategori: >2,0 Excellent · >1,5 Good · <1,5 Average; syarat lolos >1,0.",
      figure: {
        svg: FIG_FIT,
        alt: "Batang fitness: Alpha P 2,19 menembus garis Excellent, Alpha Q 1,10 di bawah garis Good; Sharpe keduanya 2,0.",
        caption: "Sharpe sama (2,0), fitness beda (2,19 vs 1,10) — pembedanya turnover 8% vs 50%.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "'Fitness tinggi = return tinggi.' Fitness 2,19 di contoh BUKAN dari return 15% yang luar biasa — melainkan dari kombinasi Sharpe 2,0 DAN turnover rendah. Alpha dengan return 10% tetapi turnover 10% bisa ber-fitness lebih tinggi dari alpha ber-return 25% dengan turnover 60%. Jangan membaca fitness sebagai 'return'.",
      },
      hints: [
        "💡 Cara cepat membaca fitness: di atas 2 = mesin presisi; 1–1,5 = butuh diet turnover; di bawah 1 = kembali ke papan gambar.",
        "💡 Turnover di bawah 12,5% tidak menambah fitness — jangan kejar 2% demi angka; kejar karena biaya.",
      ],
      reference: "Fitness = Sharpe × √(returns/maks(turnover, 12,5%)). Lantai mencegah bonus kemalasan.",
    },
    {
      id: "lab-fitness",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung drawdown & fitness",
      prose: [
        "Dua hitungan dalam satu lab. Pertama: dari 8 titik ekuitas, lacak puncak berjalan dan temukan maximum drawdown (target ≈ 7,27%). Kedua: dari Sharpe 2,0, return 15%, turnover 8%, hitung fitness dengan lantai 12,5% (target ≈ 2,19 — Excellent).",
        "Eksperimen setelah selesai: ubah turnover menjadi 50 dan lihat fitness jatuh ke ≈ 1,10. Satu angka diubah, dua kategori dilompati — itulah leverage turnover dalam rumus ini.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `max_dd` (desimal positif, mis. 0,0727)" },
        { id: "t2", text: "Hitung `fitness` dengan lantai turnover 12,5" },
      ],
      expected: "Max drawdown: 7.27%\nFitness: 2.19 (Excellent)",
      note: {
        title: "Jebakan satuan fitness",
        type: "pitfall",
        body: "'returns=0,15 dan turnover=0,08' — lalu heran fitness-nya 0,0069. Rumus ini memakai PERSEN sebagai angka (15 dan 8/12,5), bukan desimal. Konsisten: persen lawan persen. Campur satuan = hasil sampah.",
      },
      hints: [
        "puncak = max(puncak, ekuitas); dd = (ekuitas-puncak)/puncak; ambil yang paling negatif.",
        "eff_to = max(turnover, 12.5); fitness = sharpe * sqrt(ret/eff_to).",
      ],
      code: {
        starter: "import math  # (JANGAN UBAH)\nequity = [100, 105, 103, 110, 102, 108, 104, 112]  # JANGAN UBAH\nsharpe, ret, turnover = 2.0, 15.0, 8.0  # JANGAN UBAH (persen!)\n\n# TULIS KODEMU: max drawdown\npuncak = equity[0]\nmax_dd = 0.0\nfor e in equity:\n    \n    dd = \n    max_dd = min(max_dd, dd)\n\n# TULIS KODEMU: fitness\neff_to = \nfitness = \nkat = \"Excellent\" if fitness > 2.0 else (\"Good\" if fitness > 1.5 else \"Average\")\nprint(f\"Max drawdown: {-max_dd:.2%}\")\nprint(f\"Fitness: {fitness:.2f} ({kat})\")\n",
        lockLines: 3,
        solution: "import math  # (JANGAN UBAH)\nequity = [100, 105, 103, 110, 102, 108, 104, 112]  # JANGAN UBAH\nsharpe, ret, turnover = 2.0, 15.0, 8.0  # JANGAN UBAH (persen!)\n\n# TULIS KODEMU: max drawdown\npuncak = equity[0]\nmax_dd = 0.0\nfor e in equity:\n    puncak = max(puncak, e)\n    dd = (e - puncak) / puncak\n    max_dd = min(max_dd, dd)\n\n# TULIS KODEMU: fitness\neff_to = max(turnover, 12.5)\nfitness = sharpe * math.sqrt(ret / eff_to)\nkat = \"Excellent\" if fitness > 2.0 else (\"Good\" if fitness > 1.5 else \"Average\")\nprint(f\"Max drawdown: {-max_dd:.2%}\")\nprint(f\"Fitness: {fitness:.2f} ({kat})\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`max_dd` ≈ −0,0727", msg: "(102−110)/110.", name: "max_dd", value: -0.072727, tol: 0.0001 },
          { kind: "equal", task: "t2", label: "`fitness` ≈ 2,19", msg: "2,0 × √(15/12,5).", name: "fitness", value: 2.19089, tol: 0.001 },
          { kind: "stdout_matches", task: "t2", label: "Kategori Excellent tercetak", msg: "2,19 > 2,0.", pattern: "Fitness: 2\\.19 \\(Excellent\\)" }
        ],
      },
      reference: "Drawdown dari puncak berjalan; fitness dalam persen-dengan-persen + lantai 12,5.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Membaca rapor lengkap",
      prose: [
        "Satu: Sharpe 2,0, fitness 2,2, drawdown 9% → mesin presisi; submit. Dua: Sharpe 2,0, fitness 1,1, drawdown 22% → sinyal bagus, eksekusi boros; obati turnover (naikkan decay), jangan rombak sinyal. Tiga: fitness 1,8 tetapi drawdown 30% → angka bagus, luka mengerikan; cek apakah drawdown terkonsentrasi di satu rezim (2020? 2022?) — mungkin alpha yang rapuh. Empat: fitness 0,9 walau Sharpe 1,6 → turnover membunuh (hitung: butuh TO di bawah ~40% agar lolos); kembali ke papan gambar atau diet turnover agresif.",
        "Aturan praktis 10 detik: Sharpe × √(return/maks(turnover, 12,5%)) — kalau turnover di atas 50%, fitness butuh Sharpe dua kali lipat untuk selamat. Baca turnover dulu, Sharpe kemudian.",
      ],
      tasks: [],
      note: {
        title: "💡 Prioritas perbaikan",
        body: "Urutan obat yang paling murah: (1) naikkan decay — menekan turnover tanpa menyentuh sinyal; (2) sederhanakan expression — sinyal halus = turnover rendah; (3) baru rombak ide. Kebanyakan alpha 'gagal' sebenarnya hanya butuh obat nomor 1.",
      },
      reference: "Obati turnover dulu (decay), baru sinyal. TO >50% butuh Sharpe 2x lipat.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Sharpe 1,6 yang gagal lolos",
      prose: [
        "Data: alpha momentum sektoral — Sharpe 1,6 (lolos gerbang 1,25), return 10% per tahun, turnover 60% per hari, max drawdown 18%. Peneliti: 'Sharpe lolos, submit saja?'",
        "Pertanyaan: hitung fitness dan putuskan. Pembahasan: fitness = 1,6 × √(10/60) = 1,6 × √0,1667 = 1,6 × 0,4082 = 0,65. Jauh di bawah 1,0 — GAGAL, walau Sharpe lolos. Pelajaran angkanya: turnover 60% 'memangkas' fitness hingga 60% dari Sharpe-nya. Opsi: naikkan decay agar turnover turun ke 25% → fitness = 1,6 × √(10/25) = 1,6 × 0,6325 = 1,01 — lolos tipis. Keputusan: jangan submit versi sekarang; obati turnover dulu. Bonus pelajaran: drawdown 18% juga mengisyaratkan luka dalam — setelah diet turnover, verifikasi drawdown-nya ikut membaik.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Alpha seperti ini — Sharpe lolos, fitness gagal — adalah kandidat overfitting settings: godaannya menaikkan decay sampai angkanya lewat tanpa memahami sinyalnya. Batas tim: perubahan settings harus bisa dijelaskan secara ekonomi ('sinyal ini memang lambat, decay besar wajar'), bukan sekadar 'biar angkanya lolos'.",
      },
      reference: "Fitness 0,65 < 1,0: Sharpe lolos, turnover menggagalkan. Diet turnover → 1,01.",
    },
    {
      id: "lab-kategori",
      eyebrow: "Langkah 7 · Lab",
      title: "Bagi rapor: Excellent, Good, Average",
      prose: [
        "Lima kandidat dengan Sharpe, return, dan turnover. Tugasmu: hitung fitness tiap kandidat (ingat lantai turnover 12,5%), lalu bagi ke kategori WQB: Excellent (> 2,0), Good (> 1,5), Average (< 1,5). Perhatikan kandidat S: Sharpe 2,96 tetapi kategorinya? Dan kandidat T: Average tetapi fitness < 1,0 — apa artinya?",
        "Eksperimen setelah selesai: berapa turnover maksimum agar kandidat R (S 2,4, return 12) mencapai Excellent? Cari dengan mencoba angka.",
      ],
      tasks: [
        { id: "t1", text: "Tulis `fitness(S, R, TO)` dan `kategori(F)`" },
        { id: "t2", text: "Cetak fitness + kategori 5 kandidat" },
      ],
      expected: "P: F 2.19 -> Excellent\nQ: F 1.10 -> Average\nR: F 1.66 -> Good\nS: F 1.07 -> Average\nT: F 0.92 -> Average (gagal gerbang 1,0)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Average = gagal.” Bukan: Average (< 1,5) masih bisa lolos gerbang fitness > 1,0. Yang gagal = di bawah 1,0 (seperti T). Kategori = kualitas; gerbang = syarat minimum. Dua hal berbeda.",
      },
      hints: [
        "fitness = S * (R / max(TO, 12.5)) ** 0.5.",
        "Kategori: F > 2,0 Excellent; > 1,5 Good; sisanya Average. Tambahkan catatan bila F < 1,0.",
      ],
      code: {
        starter: "# (nama, Sharpe, return_%, TO_%). JANGAN UBAH.\nkandidat = [(\"P\", 2.0, 15, 8), (\"Q\", 2.0, 15, 50), (\"R\", 2.4, 12, 25),\n            (\"S\", 2.96, 12, 92), (\"T\", 1.6, 10, 30)]\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return  # S * sqrt(R / max(TO, 12.5))\n\ndef kategori(F):\n    return  # 'Excellent' / 'Good' / 'Average'\n\nfor nama, S, R, TO in kandidat:\n    F = fitness(S, R, TO)\n    k = kategori(F)\n    extra = \" (gagal gerbang 1,0)\" if F < 1.0 else \"\"\n    print(f\"{nama}: F {F:.2f} -> {k}{extra}\")\n",
        lockLines: 3,
        solution: "# (nama, Sharpe, return_%, TO_%). JANGAN UBAH.\nkandidat = [(\"P\", 2.0, 15, 8), (\"Q\", 2.0, 15, 50), (\"R\", 2.4, 12, 25),\n            (\"S\", 2.96, 12, 92), (\"T\", 1.6, 10, 30)]\n\n# TULIS KODEMU\ndef fitness(S, R, TO):\n    return S * ((R / max(TO, 12.5)) ** 0.5)\n\ndef kategori(F):\n    return \"Excellent\" if F > 2.0 else (\"Good\" if F > 1.5 else \"Average\")\n\nfor nama, S, R, TO in kandidat:\n    F = fitness(S, R, TO)\n    k = kategori(F)\n    extra = \" (gagal gerbang 1,0)\" if F < 1.0 else \"\"\n    print(f\"{nama}: F {F:.2f} -> {k}{extra}\")\n",
        checks: [
          { kind: "defined", task: "t1", label: "fungsi `kategori` ada", msg: "Definisikan def kategori(F).", name: "kategori" },
          { kind: "stdout_matches", task: "t2", label: "P Excellent", msg: "P: F 2,19 > 2,0.", pattern: "P: F 2\\.19 -> Excellent" },
          { kind: "stdout_matches", task: "t2", label: "S Average walau Sharpe 2,96", msg: "S: F 1,07 — paper champion.", pattern: "S: F 1\\.07 -> Average" },
          { kind: "stdout_matches", task: "t2", label: "T gagal gerbang", msg: "T: F 0,92 < 1,0.", pattern: "T: F 0\\.92 -> Average \\(gagal gerbang 1,0\\)" }
        ],
      },
      reference: "Kategori = kualitas; gerbang 1,0 = syarat minimum.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang hakim agung dan catatan rasa sakit.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: Sharpe kembar bisa punya nasib beda — drawdown mengukur rasa sakitnya",
        body: "Dua alpha dengan Sharpe 1,6 bisa memiliki nasib yang berlawanan: yang satu turun maksimal 5% lalu pulih dalam sebulan, yang lain pernah terperosok 25% selama setahun. Return per risiko boleh sama, tetapi pengalaman menjalaninya — dan modal yang bertahan — tidak. Drawdown adalah ukuran rasa sakit: seberapa dalam ekuitas jatuh dari puncaknya, dan seberapa lama ia tinggal di bawah air. Praktisi memakai drawdown sebagai tes kejujuran strategi: backtest yang tidak pernah drawdown lebih dari 3% biasanya bukan strategi hebat, melainkan strategi yang belum diuji kondisi sulit — atau overfit. Fitness menggabungkan ketiganya: Sharpe untuk efisiensi, konsistensi termasuk drawdown untuk ketahanan, dan turnover untuk disiplin biaya. Aturan praktisnya: Sharpe 1,6 yang gagal fitness hampir selalu gagal di turnover atau konsentrasi — biaya dan breadth, bukan return. Jangan mengoptimalkan Sharpe sendirian; ia butuh dua pendampingnya. Dan ingat: drawdown masa lalu adalah batas bawah rasa sakit masa depan, bukan batas atas. Strategi yang baik bukan yang tidak pernah sakit, melainkan yang sakitnya terukur dan sembuh.",
      },
      summary: [
        "Max drawdown = penurunan terdalam dari puncak terakhir — ukuran luka terburuk.",
        "Fitness ≈ Sharpe × √(|returns| / maks(turnover, 12,5%)) — persen lawan persen.",
        "Lantai 12,5% mencegah bonus semu untuk portofolio nyaris-statis.",
        "Kategori: >2,0 Excellent · >1,5 Good · <1,5 Average; syarat lolos >1,0.",
        "Sharpe sama + turnover beda = fitness beda jauh.",
      ],
      quiz: [
        {
          q: "Ekuitas: [100, 105, 103, 110, 102, 108]. Max drawdown?",
          options: [
            { text: "7,27%  ((102−110)/110)", why: "Benar — dari puncak terakhir 110, bukan modal awal.", correct: true },
            { text: "1,90%  ((103−105)/105)", why: "Itu drawdown hari ke-3 saja; yang terdalam adalah 7,27%." },
            { text: "2,00%  ((102−100)/100)", why: "Salah acuan: drawdown diukur dari puncak (110), bukan modal awal (100)." }
          ],
        },
        {
          q: "Sharpe 2,0 · return 15% · turnover 8%. Fitness?",
          options: [
            { text: "≈ 2,19  (lantai 12,5 aktif → 2,0×√(15/12,5))", why: "Tepat — Excellent.", correct: true },
            { text: "≈ 2,74  (2,0×√(15/8))", why: "Lupa lantai: turnover 8% < 12,5% harus dihitung sebagai 12,5%." },
            { text: "≈ 0,69  (2,0×√(0,15/0,08))", why: "Salah satuan: rumus memakai persen-sebagai-angka (15, bukan 0,15)." }
          ],
        },
        {
          q: "Mengapa ada lantai turnover 12,5%?",
          options: [
            { text: "Mencegah fitness meledak semu pada strategi yang nyaris tidak trading", why: "Benar — tanpa lantai, turnover 1% memberi bonus raksasa yang tak bermakna.", correct: true },
            { text: "Karena platform melarang turnover di bawah 12,5%", why: "Terbalik — turnover rendah BOLEH; hanya saja tidak dapat bonus fitness tambahan." },
            { text: "Agar perhitungannya lebih mudah", why: "Bukan soal kemudahan — ini anti-celah (anti-gaming) yang disengaja." }
          ],
        },
        {
          q: "Dua alpha Sharpe sama 2,0; fitness 2,19 vs 1,10. Penjelasan paling mungkin?",
          options: [
            { text: "Turnover berbeda jauh (8% vs 50%)", why: "Tepat — akar dari (return/turnover) adalah pembedanya.", correct: true },
            { text: "Return berbeda jauh", why: "Return 15% sama di contoh; return beda tidak cukup menjelaskan selisih sebesar ini." },
            { text: "Salah satu datanya salah hitung", why: "Bukan error — ini perilaku rumus yang memang dirancang menghukum turnover." }
          ],
        },
        {
          q: "Fitness 1,8 tetapi max drawdown 30%. Respons tepat?",
          options: [
            { text: "Selidiki konsentrasi drawdown per rezim sebelum submit", why: "Benar — angka bagus + luka dalam = kemungkinan rapuh di rezim tertentu.", correct: true },
            { text: "Submit saja — fitness di atas 1,5 sudah Good", why: "Mengabaikan catatan rasa sakit: investor kabur di drawdown 30% sebelum fitness sempat terbukti." },
            { text: "Tolak — drawdown di atas 10% selalu gagal", why: "Tidak ada ambang mutlak 10%; yang penting konteks: terkonsentrasi atau tersebar, pulih cepat atau tidak." }
          ],
        }
      ],
      reference: "Drawdown = luka terdalam dari puncak. Fitness = Sharpe × √(return/maks(TO,12,5%)).",
    },
  ],
};
