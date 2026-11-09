import type { V2Lesson } from "../lib/types";

// Dua kurva equity walk-forward: strategi memakai angka OOS lab lesson ini
// (-4%, 14%, -3%, 6%, 8%, 21%, 8% -> kumulatif +58,8%); buy-and-hold =
// benchmark ilustrasi. Area arsir = drawdown strategi di window 1 (-4%).
const EQUITY_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Dua kurva equity walk-forward: strategi OOS berakhir plus 59 persen dengan drawdown 4 persen di awal, buy-and-hold plus 40 persen.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<polygon points="60,147 123,155 143,147" fill="var(--c4)" opacity="0.25"/>
<polyline points="60,147 123,140 186,129 249,133 311,118 374,104 437,85 500,75" fill="none" stroke="var(--c2)" stroke-width="2"/>
<polyline points="60,147 123,155 186,130 249,136 311,125 374,108 437,62 500,40" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<line x1="70" y1="32" x2="95" y2="32" stroke="var(--c1)" stroke-width="2.5"/><text x="100" y="36" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">strategi (OOS lab)</text>
<line x1="70" y1="48" x2="95" y2="48" stroke="var(--c2)" stroke-width="2"/><text x="100" y="52" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">buy-and-hold (ilustrasi)</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="44">160</text><text x="54" y="122">120</text><text x="54" y="192">80</text></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="123" y="240">W1</text><text x="186" y="240">W2</text><text x="249" y="240">W3</text><text x="311" y="240">W4</text><text x="374" y="240">W5</text><text x="437" y="240">W6</text><text x="500" y="240">W7</text></g>
<text x="492" y="32" font-size="10" fill="var(--text)" font-family="var(--font-ui)" text-anchor="end" font-weight="600">+59%</text>
<text x="492" y="90" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">+40%</text>
<text x="100" y="170" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">drawdown -4%</text>
<text x="280" y="14" font-size="11" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">walk-forward OOS: strategi vs buy-and-hold</text>
</svg>`;

export const pmd4: V2Lesson = {
  slug: "pm-d4-backtesting",
  track: "Portfolio Management",
  module: "Kuantitatif Terapan",
  title: "D4 — Backtesting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-strategi-sempurna",
      eyebrow: "Langkah 1 · Cerita",
      title: "Strategi \u2018sempurna\u2019 yang hancur live",
      prose: [
        "Quant menemukan strategi: backtest 10 tahun Sharpe 3,0! Live trading 6 bulan: −20%. Audit: strategi memakai data laporan keuangan yang dirilis 2 bulan setelah periode trading \u2014 lookahead bias (melihat masa depan!).",
        "Twist-nya: backtest tidak berbohong \u2014 quant-nya yang bertanya salah. \u2018Bagaimana jika saya tahu masa depan?\u2019 = pertanyaan yang selalu dijawab \u2018cuan!\u2019. Backtest jujur = pertanyaan jujur.",
        "Lesson ini tentang menginterogasi strategi sebelum pasar menginterogasi kamu: 3 dosa, overfitting, walk-forward.",
      ],
      tasks: [],
      reference: "Mati di lab, jangan di live.",
    },
    {
      id: "tiga-dosa",
      eyebrow: "Langkah 2 · Tiga dosa backtest",
      title: "Lookahead, survivorship, biaya",
      prose: [
        "Tiga dosa. Lookahead bias: pakai info belum tersedia saat itu (laporan keuangan, revisi data!). Audit quant: strategi \u2018beli setelah laba naik\u2019 pakai laporan tahunan final \u2014 tersedia Mei, tetapi \u2018trading\u2019 di Januari: melihat 4 bulan ke depan! Perbaikan: pakai vintage data (as-reported saat itu) → Sharpe 3,0 → 0,4. Strategi mati \u2014 lebih baik mati di lab daripada di pasar dengan uang beneran.",
        "Survivorship bias: universe = konstituen kini = hanya pemenang. Solusi: point-in-time. Biaya: backtest 20% tanpa biaya, turnover 500%, biaya 0,3% → biaya = 500% × 0,3% = 1,5% → net 18,5%! Selalu net. Aturannya: point-in-time data + delisted + biaya realistis \u2014 atau jangan backtest.",
        "Tujuh dosa lengkap untuk dihafal: (1) lookahead → vintage! (2) survivorship → point-in-time! (3) biaya → net! (4) overfit → sederhana! (5) data mining → deflate! (6) regime (hanya bull) → across! (7) liquidity (asumsi bisa beli) → realistis!",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018Sharpe tinggi = bagus, langsung live.\u2019 Salah. Audit dulu: lookahead? overfit? 1.000 trial → ekspektasi Sharpe ≈1,5 (deflated! — aturan praktis, tergantung panjang data). Backtest hebat + audit gagal = bom.",
      },
      reference: "Contoh audit (ilustratif, komposit kasus nyata): auditor tanya \u2018apakah info tersedia?\u2019 → lookahead 2 bulan → Sharpe 0,3 → batalkan sebelum live.",
    },
    {
      id: "lab-lookahead",
      eyebrow: "Langkah 3 · Lab lookahead",
      title: "Ujian dengan kunci jawaban",
      prose: [
        "Buktikan bagaimana \u2018melihat masa depan\u2019 menciptakan return palsu: bandingkan mode curang (tahu harga besok) vs jujur (momentum lampau). Ubah LOOKAHEAD menjadi False: return anjlok \u2014 itulah harga kejujuran!",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi logika `posisi` curang & jujur" },
        { id: "t2", text: "Cetak mode dan return total" },
      ],
      expected: "Mode: CURANG (lookahead)  Return total: 284%  (jujur: -12%)",
      hints: [
        "Curang: posisi = 1 jika harga[t+1] > harga[t] else −1 \u2014 tahu masa depan!",
        "Jujur: posisi = 1 jika harga[t] > harga[t−1] else −1 \u2014 hanya info lampau.",
        "cuan += posisi × (harga[t+1]−harga[t])/harga[t]; random.seed(99) jangan diubah.",
      ],
      code: {
        starter: `# Lookahead bias: trading dengan info masa depan vs jujur\nimport random\nrandom.seed(99)\nLOOKAHEAD = True   # ubah ke False!\nN = 120\nharga = [100.0]\nfor _ in range(N):\n    harga.append(harga[-1]*(1 + random.gauss(0.005, 0.03)))\n\ncuan = 0\nfor t in range(N-1):\n    # TULIS KODEMU\n    naik_besok = harga[t+1] > harga[t]\n    if LOOKAHEAD:\n        posisi = \n    else:\n        posisi = \n    cuan += posisi*(harga[t+1]-harga[t])/harga[t]\n\nprint(f"Mode: {'CURANG (lookahead)' if LOOKAHEAD else 'JUJUR'}")\nprint(f"Return total: {cuan:.0%}")\nprint()\nprint("Lookahead = ujian dengan kunci jawaban.")\nprint("Audit: 'apakah info ini tersedia SAAT ITU?'")`,
        lockLines: 6,
        solution: `# Lookahead bias: trading dengan info masa depan vs jujur\nimport random\nrandom.seed(99)\nLOOKAHEAD = True   # ubah ke False!\nN = 120\nharga = [100.0]\nfor _ in range(N):\n    harga.append(harga[-1]*(1 + random.gauss(0.005, 0.03)))\n\ncuan = 0\nfor t in range(N-1):\n    # TULIS KODEMU\n    naik_besok = harga[t+1] > harga[t]\n    if LOOKAHEAD:\n        posisi = 1 if naik_besok else -1   # curang: tahu masa depan!\n    else:\n        posisi = 1 if harga[t] > harga[t-1] else -1  # jujur: momentum lampau\n    cuan += posisi*(harga[t+1]-harga[t])/harga[t]\n\nprint(f"Mode: {'CURANG (lookahead)' if LOOKAHEAD else 'JUJUR'}")\nprint(f"Return total: {cuan:.0%}")\nprint()\nprint("Lookahead = ujian dengan kunci jawaban.")\nprint("Audit: 'apakah info ini tersedia SAAT ITU?'")`,
        checks: [
          { kind: "equal", task: "t1", name: "cuan", value: 2.8351, tol: 0.01, label: "`cuan` ≈ 2.84 (mode curang)", msg: "Tahu harga besok = return 284% (seed 99). Ujian dengan kunci jawaban!" },
          { kind: "stdout_matches", task: "t2", pattern: "Return total: 284%", label: "`print` menampilkan Return total 284%", msg: "Mode curang (LOOKAHEAD=True) harus mencetak 284%." },
        ],
      },
      reference: "Mode jujur pada data sama: −12%. Jurang 284% vs −12% = harga ketidakjujuran.",
    },
    {
      id: "lab-walk-forward",
      eyebrow: "Langkah 4 · Lab walk-forward",
      title: "Ujian susulan berkala",
      prose: [
        "Validasi strategi momentum sederhana dengan walk-forward: train 36 bulan → test 12 bulan, geser. Ubah WINDOW menjadi 12 (train pendek): OOS makin berisik \u2014 train butuh cukup data! Perhatikan decay antar window: menurun terus = edge sekarat.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi loop walk-forward (`sinyal`, `hasil`)" },
        { id: "t2", text: "Cetak OOS per window dan rata-rata" },
      ],
      expected: "OOS per window: ['-4%', '14%', '-3%', '6%', '8%', '21%', '8%']  Rata-rata OOS: 7.2%",
      hints: [
        "sinyal = 1 jika rata-rata train > 0 else −1.",
        "hasil = Σ sinyal×r untuk 12 bulan test; append ke oos; t += 12.",
        "Rata-rata dengan statistics.mean; format :.0% per window, :.1% rata-rata.",
      ],
      code: {
        starter: `# Walk-forward: train 36 bln -> test 12 bln, geser\nimport random\nrandom.seed(7)\nWINDOW = 36   # bulan train (ubah jadi 12!)\nN = 120\nrets = [random.gauss(0.008, 0.04) for _ in range(N)]\n\noos = []\nt = WINDOW\nwhile t + 12 <= N:\n    # TULIS KODEMU\n    train = \n    sinyal = \n    hasil = \n    oos.append(hasil)\n    t += 12\n\nimport statistics\nprint(f"OOS per window: {[f'{x:.0%}' for x in oos]}")\nprint(f"Rata-rata OOS: {statistics.mean(oos):.1%}")\nprint()\nprint("OOS murni = simulasi penggunaan nyata.")\nprint("Decay (menurun antar window) = edge sekarat.")`,
        lockLines: 6,
        solution: `# Walk-forward: train 36 bln -> test 12 bln, geser\nimport random\nrandom.seed(7)\nWINDOW = 36   # bulan train (ubah jadi 12!)\nN = 120\nrets = [random.gauss(0.008, 0.04) for _ in range(N)]\n\noos = []\nt = WINDOW\nwhile t + 12 <= N:\n    # TULIS KODEMU\n    train = rets[t-WINDOW:t]\n    sinyal = 1 if sum(train)/len(train) > 0 else -1\n    hasil = sum(sinyal*r for r in rets[t:t+12])\n    oos.append(hasil)\n    t += 12\n\nimport statistics\nprint(f"OOS per window: {[f'{x:.0%}' for x in oos]}")\nprint(f"Rata-rata OOS: {statistics.mean(oos):.1%}")\nprint()\nprint("OOS murni = simulasi penggunaan nyata.")\nprint("Decay (menurun antar window) = edge sekarat.")`,
        checks: [
          { kind: "equal", task: "t1", name: "oos", value: [-0.04, 0.14, -0.03, 0.06, 0.08, 0.21, 0.08], tol: 0.01, label: "`oos` = 7 window sesuai ekspektasi", msg: "7 window walk-forward (seed 7): −4%, 14%, −3%, 6%, 8%, 21%, 8%." },
          { kind: "stdout_matches", task: "t2", pattern: "Rata-rata OOS: 7\\.2%", label: "`print` menampilkan Rata-rata OOS 7.2%", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Strategi sehat: OOS mendekati IS. Jurang IS→OOS = overfitting.",
    },
    {
      id: "overfitting",
      eyebrow: "Langkah 5 · Overfitting",
      title: "Menghafal, bukan belajar",
      prose: [
        "Overfitting: strategi menghafal noise historis (banyak parameter!) → in-sample bagus, out-of-sample hancur. Deteksi: jurang IS→OOS (in-sample Sharpe 4,0, OOS 0,5 = overfit!), train/test split waktu, walk-forward, deflated Sharpe (koreksi jumlah trial!). Aturannya: parameter sedikit + logika ekonomi + out-of-sample wajib.",
        "Deflated Sharpe (Bailey & Lopez de Prado): probabilitas Sharpe benar > 0 setelah koreksi trial. Intuisinya: lempar koin 100×, dapat 70 kepala \u2014 hebat? Tidak, coba cukup banyak! Praktisnya: 1.000 trial → ekspektasi Sharpe ≈ 1,5 (bukan 0!) — aturan praktis untuk data harian ~5 tahun; makin pendek datanya, makin tinggi bar-nya: \u2018temuan\u2019 harus mengalahkan itu. Contoh: quant coba 1.000 kombinasi → terbaik Sharpe 2,0 → deflated = 60% (tidak meyakinkan!). Walk-forward 2015\u20132018 train → 2019 test: Sharpe 0,3. Mati.",
        "Pelajaran: \u2018terbaik dari 1.000\u2019 = juara menghafal. Lapor semua trial, bukan juaranya. Catat SEMUA trial \u2014 \u2018lupa\u2019 999 trial gagal = penipuan diri (p-hacking). Jurnal trial = kejujuran kuantitatif. Aturan praktis: Sharpe 2,0 dari 100 trial = lemah; Sharpe 1,5 dari 1 trial = kuat.",
      ],
      formula: String.raw`DSR = \Phi\left(\frac{(\hat{SR} - SR_0)\sqrt{T-1}}{\sqrt{1 - \gamma_3\hat{SR} + \frac{\gamma_4-1}{4}\hat{SR}^2}}\right)`,
      formulaNote: "SR_0 = ekspektasi Sharpe di bawah null \u2014 naik dengan JUMLAH TRIAL. Makin banyak dicoba, makin skeptis.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "\u2018In-sample bagus = cukup. Out-of-sample buang-buang data.\u2019 Salah. In-sample = murid menghafal. Tanpa OOS/walk-forward = tidak ada bukti belajar. \u2018Buang data\u2019 untuk OOS = premi asuransi termurah. Strategi tanpa OOS = cerita, bukan strategi.",
      },
      reference: "Studi: 90% strategi backtest gagal live \u2014 alasannya overfit & lookahead. Skeptis = bertahan.",
    },
    {
      id: "walk-forward",
      eyebrow: "Langkah 6 · Walk-forward + chart",
      title: "Ujian jujur",
      prose: [
        "Walk-forward: train [2015\u20132017] → test 2018; geser: train [2016\u20132018] → test 2019; ... → rangkai out-of-sample murni. Anchored (train bertambah) vs rolling (train tetap). Keunggulannya: mensimulasikan penggunaan nyata (re-estimasi berkala) + deteksi decay (strategi memburuk?).",
        "Contoh decay ketahuan: walk-forward 5 window, OOS Sharpe 1,5 → 1,2 → 0,8 → 0,4 → 0,1. Decay! \u2014 edge terkikis (crowding? regime berubah?). Keputusan: jangan live (atau ukuran kecil + stop-loss edge). Walk-forward = detektor kematian dini. Strategi yang sekarat di OOS = jangan dihidupkan dengan uang.",
        "Setelah backtest, sebelum live: paper trading \u2014 simulasi real-time tanpa uang, minimal 3 bulan (lebih baik 6+). Tangkap bug, uji operasional, rasakan drawdown. Rantai validasi: lab → paper → kecil → besar. Kesabaran = keuntungan; tergesa = kerugian. Backtest = hipotesis; validasi = disiplin.",
        "Cara membaca: sumbu X = 7 window walk-forward (tiap window: train 36 bulan → test 12 bulan); sumbu Y = indeks kekayaan (100 = modal awal). Garis biru = strategi momentum dari lab (return OOS per window: −4%, 14%, −3%, 6%, 8%, 21%, 8% — kumulatif +59%); garis abu = buy-and-hold sebagai pembanding. Area arsir = drawdown strategi di window 1.",
        "Interpretasi: strategi berakhir +59% vs buy-and-hold +40% — tetapi angka akhir menyembunyikan area arsir: di window 1 strategi −4% di bawah air sementara buy-and-hold naik. Walk-forward memaksamu melihat SETIAP window, bukan hanya angka akhir: strategi yang “rata-rata bagus” tetapi punya window-window berdarah (atau decay menurun antar window) tetap ditolak. Inilah bedanya backtest jujur dengan cerita — kurva, bukan satu angka.",
      ],
      figure: {
        svg: EQUITY_SVG,
        alt: "Dua kurva equity walk-forward: strategi OOS berakhir plus 59 persen dengan drawdown 4 persen di awal, buy-and-hold plus 40 persen.",
        caption: "Equity walk-forward: garis biru memakai return OOS lab (−4%, 14%, −3%, 6%, 8%, 21%, 8%); area arsir = drawdown. Lihat tiap window, bukan hanya angka akhir.",
      },
      tasks: [],
      reference: "Checklist audit: PIT? biaya? OOS? deflate? regime? liquid? sederhana? Tujuh cek = aman.",
    },
    {
      id: "minicase-sharpe30",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Sharpe 3,0",
      prose: [
        "Quant: backtest 10 tahun Sharpe 3,0. Live 6 bulan: −20%. Audit: data laporan keuangan dirilis 2 bulan setelah periode trading \u2014 lookahead bias.",
        "(a) Diagnosis: lookahead (teropong masa depan!) + mungkin overfit. Tanya: \u2018apakah info tersedia saat itu?\u2019 (b) Perbaikan: vintage data → Sharpe 3,0 → 0,4 → strategi mati di lab. (c) Pelajaran umum: backtest = laboratorium, bukan ramalan; Sharpe 3,0 → ekspektasi 1,0 (haircut 50%!); catat semua trial.",
        "(d) Kasus momentum: backtest 25%, live 5% \u2014 kenapa? Biaya diabaikan! Turnover 800%! (e) Kasus value: backtest 18%, live 12% \u2014 regime berubah! Value mati 10 tahun. Uji across regime: bagi data per regime, evaluasi terpisah; jika gagal di satu → waspada.",
      ],
      tasks: [],
      reference: "Knight Capital 2012: tanpa backtest/testing memadai → bug 45 menit → rugi USD 440jt → bangkrut. Test = wajib.",
    },
    {
      id: "biaya-indonesia",
      eyebrow: "Langkah 8 · Biaya Indonesia",
      title: "Fee, pajak, slippage: anatomi biaya riil IDX",
      prose: [
        "Backtest Indonesia yang jujur memakai biaya Indonesia — bukan angka textbook AS. Fee sekuritas: beli 0,15–0,19%, jual 0,25–0,29% (sudah termasuk levy BEI/KPEI/KSEI ±0,04%). Round-trip ≈ 0,4–0,5% — sebelum slippage. Pajak: PPh final 0,1% dari NILAI JUAL (bukan dari untung!) — jual Rp1M bayar Rp1jt pajak, rugi pun kena. Dividen kena PPh final 10%. Ini bukan detail kecil: di strategi turnover tinggi, pajak final menggerogoti dari sisi yang tidak diduga.",
        "Slippage — selisih harga eksekusi vs harga yang terlihat di layar. LQ45: bid-ask spread 0,1–0,3%, slippage ~0,1–0,2% per sisi. Lapis 3/saham gorengan: spread 2–5%+, slippage bisa 1–3% PER TRANSAKSI. Ditambah stale price: harga “terlihat” bukan harga “bisa dieksekusi” — backtest yang memakai harga tengah (mid-price) untuk saham tipis sedang berhalusinasi likuiditas.",
        "Contoh anatomi drag — strategi momentum turnover 300%/tahun di LQ45: fee round-trip 0,45% × 300% = 1,35%; pajak jual 0,1% × 300% = 0,30%; slippage 0,2% × 300% = 0,60%. Total drag 2,25%/tahun. Backtest gross 12% → net 9,75%. Strategi yang sama di saham lapis 3 (spread 3%): fee 1,35% + pajak 0,30% + slippage 9% = 10,65% drag → net 1,35%. “Edge” 12% berubah jadi impas — bukan karena strateginya bodoh, melainkan karena pasarnya mahal ditradingkan.",
        "Aturan keputusan: (1) model biaya konservatif — fee aktual sekuritasmu + spread 2× rata-rata historis (spread mekar tepat saat kamu paling butuh trading); (2) budget turnover: targetkan drag total < 1/3 dari edge harapan — jika biaya memakan lebih dari sepertiga, strategi tidak layak; (3) saham illiquid = backtest dengan spread aktual dari order book, bukan mid-price; (4) uji sensitivitas: naikkan semua biaya 2× — jika strategi mati, ia memang sudah mati, kamu hanya belum tahu.",
      ],
      formula: String.raw`R_{net} = R_{gross} - \text{turnover} \times (fee + pajak + slippage)`,
      formulaNote: "turnover = % nilai portofolio diperdagangkan per tahun (300% = 3× lipat); fee = round-trip sekuritas ≈ 0,45%; pajak = PPh final 0,1% × sisi jual; slippage ≈ ½ spread × 2 sisi. Contoh: 300% × (0,45% + 0,10% + 0,20%) = 2,25% drag/tahun. Gross − drag = angka yang jujur.",
      tasks: [],
      note: {
        title: "💡 Intuisi: backtest adalah pengacara pembela — sewa jaksa penuntut",
        body: "Setiap backtest bersalah atas optimisme sampai terbukti tidak bersalah — tugasmu adalah penuntutan, bukan pembelaan. Lima heuristik. Pertama: aturan “biaya 2×” — berapapun kata model biayamu, gandakan; spread mekar tepat saat semua orang trading, yaitu saat strategimu trading. Kedua: jika strategi hanya hidup dengan biaya nol, ia tidak hidup — strategi riil selamat dari biaya realistis dengan margin. Ketiga: walk-forward decay adalah EKG strategi — datar/menanjak = hidup, menurun konsisten = sekarat; jangan resusitasi dengan menambah parameter. Keempat: hitung trial-mu dengan JUJUR — termasuk 50 ide yang kamu buang bulan lalu; deflated Sharpe hanya bekerja jika jumlah trial-nya benar. Kelima: strategi yang “butuh” asumsi likuiditas sempurna = strategi untuk pasar yang tidak ada. Skeptis bukan pesimis — skeptis adalah cara bertahan hidup.",
      },
      reference: "Net of costs atau tidak sama sekali. Gross = fiksi, net = fakta.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: ["Tujuh pertanyaan campuran dari semua langkah."],
      tasks: [],
      summary: [
        "Tiga dosa: lookahead (→ vintage data), survivorship (→ point-in-time), biaya (→ selalu net).",
        "Overfitting: jurang IS→OOS; parameter sedikit + logika ekonomi + OOS wajib.",
        "Deflated Sharpe: koreksi jumlah trial \u2014 1.000 trial → bar ≈ 1,5, bukan 0.",
        "Walk-forward: train-test geser → OOS murni + deteksi decay; lalu paper trading.",
        "Aturan: catat semua trial, asumsikan biaya 2×, haircut 50%, skeptis selalu.",
      ],
      next: { label: "D5 \u2014 Metrik Kinerja", href: "/v2/learn/pm-d5-metrik-kinerja" },
      quiz: [
        {
          q: "Sinyal beli pakai laporan Q1 final (Mei) untuk \u2018trading\u2019 Januari. Backtest Sharpe 3,0. Masalah?",
          options: [
            { text: "Tidak ada \u2014 data akurat", why: "Salah: akurat ≠ tersedia. Januari tidak tahu Mei!" },
            { text: "Lookahead 4 bulan \u2014 pakai vintage data", why: "Tepat: laporan final tersedia Mei, dipakai Januari = melihat masa depan. Dengan vintage: Sharpe 0,4. Mati di lab.", correct: true },
            { text: "Survivorship bias", why: "Salah: masalahnya waktu ketersediaan info, bukan universe saham." },
            { text: "Biaya terlalu tinggi", why: "Salah: biaya masalah terpisah \u2014 di sini dosanya lookahead." },
          ],
        },
        {
          q: "In-sample Sharpe 4,0; out-of-sample 0,5. Diagnosis?",
          options: [
            { text: "Strategi hebat", why: "Salah: yang hebat = in-sample, yang jujur = out-of-sample 0,5." },
            { text: "Overfit \u2014 sederhanakan + walk-forward", why: "Tepat: jurang besar IS→OOS = menghafal noise, bukan belajar.", correct: true },
            { text: "Data kurang", why: "Salah: masalahnya bukan jumlah data \u2014 melainkan model menghafal noise." },
            { text: "Naikkan leverage", why: "Salah: leverage pada strategi overfit = mempercepat kehancuran." },
          ],
        },
        {
          q: "Sharpe 2,0 dari 100 trial vs Sharpe 1,5 dari 1 trial. Mana lebih kuat?",
          options: [
            { text: "2,0 \u2014 lebih tinggi", why: "Salah: 2,0 dari 100 trial = juara menghafal; deflated-nya lemah." },
            { text: "1,5 dari 1 trial \u2014 deflated lebih kuat", why: "Tepat: makin banyak dicoba, makin tinggi bar. Catat semua trial!", correct: true },
            { text: "Sama saja", why: "Salah: jumlah trial mengubah interpretasi statistik secara fundamental." },
            { text: "Keduanya lemah", why: "Salah: 1,5 dari 1 trial bisa signifikan \u2014 trial tunggal tidak butuh koreksi." },
          ],
        },
        {
          q: "Backtest 20% (tanpa biaya), turnover 500%, biaya 0,3%. Net?",
          options: [
            { text: "20%", why: "Salah: itu gross \u2014 biaya belum dikurangi." },
            { text: "18,5%", why: "Tepat: biaya = 500% × 0,3% = 1,5%; net = 20% − 1,5% = 18,5%. Selalu net!", correct: true },
            { text: "19,7%", why: "Salah: 0,3% = biaya per turnover, bukan total \u2014 kalikan dengan 500%." },
            { text: "21,5%", why: "Salah: biaya mengurangi, bukan menambah return." },
          ],
        },
        {
          q: "Walk-forward 5 window: OOS Sharpe 1,5 → 1,2 → 0,8 → 0,4 → 0,1. Keputusan?",
          options: [
            { text: "Live penuh \u2014 rata-rata masih positif", why: "Salah: tren menurun = edge sekarat; rata-rata menyembunyikan decay." },
            { text: "Jangan live \u2014 decay terdeteksi", why: "Tepat: edge terkikis (crowding? regime?). Walk-forward = detektor kematian dini.", correct: true },
            { text: "Tambah parameter", why: "Salah: menambah parameter pada edge yang decay = overfit, bukan obat." },
            { text: "Ulangi backtest in-sample", why: "Salah: in-sample sudah bagus \u2014 masalahnya justru OOS yang memburuk." },
          ],
        },
        {
          q: "Strategi turnover 300%/tahun: fee RT 0,45%, pajak jual 0,1%, slippage 0,2%. Total drag?",
          options: [
            { text: "2,25%/tahun", why: "Tepat: 300% × (0,45%+0,10%+0,20%) = 300% × 0,75% = 2,25%. Gross 12% → net 9,75%.", correct: true },
            { text: "0,75%/tahun", why: "Salah: 0,75% = drag per 100% turnover — kalikan dengan 300%." },
            { text: "0,45%/tahun", why: "Salah: itu hanya fee — pajak dan slippage ikut memakan." },
            { text: "3,0%/tahun", why: "Salah: cek aritmatika — 3 × 0,75% = 2,25%, bukan 3%." },
          ],
        },
        {
          q: "Strategi gross 12% di saham lapis-3 (spread 3%), turnover 300%. Verdict?",
          options: [
            { text: "Jalan — gross 12% besar", why: "Salah: drag = 300% × (0,45%+0,10%+3%) = 10,65% → net ±1,35%. Gross menipu." },
            { text: "Tolak — net ±1,35%, edge habis dimakan spread", why: "Tepat: di saham illiquid, slippage adalah pembunuh utama. Uji dengan spread aktual order book.", correct: true },
            { text: "Naikkan leverage 3×", why: "Salah: me-leverage net 1,35% dengan biaya pinjaman = rugi pasti." },
            { text: "Kurangi turnover jadi 0%", why: "Salah: turnover 0% = tidak trading = tidak ada strategi." },
          ],
        },
      ],
    },
  ],
};
