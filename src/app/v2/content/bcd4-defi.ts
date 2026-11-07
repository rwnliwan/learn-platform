import type { V2Lesson } from "../lib/types";

// Kurva impermanent loss vs rasio harga (r = 0.25..4).
const IL_SVG = `<svg viewBox="0 0 480 230" role="img" aria-label="Kurva impermanent loss: nol saat harga tidak berubah, minus 5,7 persen saat harga dua kali lipat, minus 20 persen saat harga seperempat.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="40" y1="30" x2="440" y2="30"/><line x1="40" y1="80" x2="440" y2="80"/><line x1="40" y1="130" x2="440" y2="130"/><line x1="40" y1="180" x2="440" y2="180"/></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end"><text x="34" y="34">0%</text><text x="34" y="84">−10%</text><text x="34" y="134">−20%</text><text x="34" y="184">−30%</text></g>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle"><text x="88" y="200">0,25×</text><text x="200" y="200">1×</text><text x="312" y="200">2×</text><text x="424" y="200">4×</text></g>
<path d="M88,130 C140,60 170,32 200,30 C230,32 260,60 312,88 C360,112 400,128 424,138" fill="none" stroke="var(--c4)" stroke-width="3"/>
<circle cx="200" cy="30" r="5" fill="var(--c1)"/><text x="200" y="18" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">r=1: 0%</text>
<circle cx="312" cy="88" r="5" fill="var(--c4)"/><text x="330" y="80" font-size="11" fill="var(--text)" font-family="var(--font-ui)">r=2: −5,7%</text>
<circle cx="88" cy="130" r="5" fill="var(--c4)"/><text x="70" y="152" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">r=0,25: −20%</text>
<text x="240" y="216" text-anchor="middle" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">rasio harga vs saat deposit (r)</text>
</svg>`;

const BCD4_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Impermanent loss: harga naik 2x = 5,7 persen, 4x = 20 persen, 8x = 34,3 persen."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0%</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">17%</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">34%</text><rect x="72.5" y="153.4" width="86.4" height="26.6" rx="3" fill="var(--c2)"/><text x="115.7" y="147.4" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">5,7%</text><text x="115.7" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">r=2x</text><rect x="211.8" y="86.7" width="86.4" height="93.3" rx="3" fill="var(--c3)"/><text x="255.0" y="80.7" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">20%</text><text x="255.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">r=4x</text><rect x="351.1" y="20.0" width="86.4" height="160.0" rx="3" fill="var(--c4)"/><text x="394.3" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">34,3%</text><text x="394.3" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">r=8x</text><line x1="46" y1="63.4" x2="464" y2="63.4" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="57.4" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">fee 25%</text></svg>`;

export const bcd4: V2Lesson = {
  slug: "bcd4-defi",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "BCD4 — Analisis DeFi",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Untung 40%, ternyata kalah",
      prose: [
        "Dimas menaruh 10 ETH + 30.000 USDC ke pool likuiditas saat ETH $3.000. Setahun kemudian ETH $6.000 — naik 100%! Ia membuka dashboard pool dengan senyum lebar. Nilai posisinya: $68.485. Lalu ia iseng menghitung: 'kalau 10 ETH + 30.000 USDC itu saya pegang saja…' = $90.000. Senyumnya hilang. Ia 'untung' 14% dalam dolar, tetapi KALAH $21.515 dari sekadar hold.",
        "Twist-nya: pool likuiditas otomatis MENJUAL ETH-nya saat harga naik (agar rasio pool tetap seimbang) — persis kebalikan dari yang ia inginkan sebagai bull. Mekanisme yang memberinya fee trading adalah mekanisme yang sama yang memotong profitnya. Inilah impermanent loss: bukan 'rugi' dalam arti saldo berkurang, melainkan kalah dibandingkan alternatif paling malas sekalipun — diam saja.",
        "Lesson ini membedah tiga pilar analisis DeFi: TVL (berapa nilai terkunci — dan berapa yang ganda-dihitung), likuiditas pool (apakah cukup dalam untuk menampungmu), dan impermanent loss (harga diam-diam memakanmu). Tujuan: (1) menghitung TVL yang jujur; (2) menghitung IL dari data harga; (3) menilai kedalaman pool. Peta: cerita → TVL → pool & AMM → lab IL → fee vs IL → peta keputusan → mini-case → checkpoint.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan TVL, AMM x×y=k, dan impermanent loss dengan angka; (2) menghitung IL untuk kenaikan/penurunan harga tertentu; (3) menghitung titik impas LP (fee vs IL); (4) memutuskan kapan menjadi LP menguntungkan vs merugikan.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Pool saya naik 14% dalam dolar, berarti strategi LP berhasil.\" Benchmark yang benar bukan 'apakah dolar saya bertambah', melainkan 'apakah saya mengalahkan hold'. Hampir semua LP kalah dari hold saat harga bergerak jauh — dan menang tipis (dari fee) saat harga sideways. Evaluasi LP tanpa pembanding hold = menilai lari tanpa garis finis.",
      },
      reference: "Benchmark LP = hold, bukan 'saldo dolar naik'. IL = selisih vs hold.",
    },
    {
      id: "tvl",
      eyebrow: "Langkah 2 · TVL",
      title: "Total Value Locked: angka yang suka berbohong",
      prose: [
        "TVL = total nilai aset yang dikunci di smart contract sebuah protokol. Terdengar sederhana — sampai kamu tahu tiga cara ia berbohong. Satu: double counting — token LP dari protokol A di-stake lagi di protokol B, dihitung di keduanya. Dua: valuasi sirkular — governance token protokol dinilai dari harganya sendiri yang didongkrak TVL-nya. Tiga: 'TVL' yang sebenarnya bisa ditarik kapan saja (staking likuid ≠ kunci mati).",
        "TVL yang jujur: hitung hanya aset UNDERLYING (ETH, USDC — bukan token LP, bukan governance token), eliminasi duplikasi antar protokol, dan pisahkan 'kunci mati' (vesting/lock) dari 'parkir sementara' (bisa withdraw kapan saja).",
        "Aturan baca: TVL naik + harga token protokol naik = waspadai sirkularitas. TVL naik + jumlah user unik stagnan = kemungkinan besar wash deposit segelintir paus. TVL selalu dibaca BERSAMA user count dan komposisi aset.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi: TVL itu rekening koran, bukan kekayaan",
        body: "TVL mengukur 'berapa uang sedang parkir di sini', bukan 'berapa nilai yang diciptakan'. Parkir Rp10 triliun yang semuanya bisa pergi dalam 1 blok (seperti saat insiden depeg) = TVL rapuh. Analis yang baik bertanya: berapa persen TVL yang TERKUNCI betulan (tidak bisa kabur), dan berapa yang 'uang panas' mercenary capital yang pindah mengejar yield tertinggi tiap minggu? Kualitas TVL > besar TVL.",
      },
      reference: "TVL jujur = underlying saja, tanpa duplikasi, pisahkan lock vs parkir.",
    },
    {
      id: "amm",
      eyebrow: "Langkah 3 · Pool & AMM",
      title: "x × y = k: mesin penyeimbang otomatis",
      prose: [
        "Pool likuiditas AMM (contoh Uniswap v2) menyimpan dua token, mis. 10 ETH + 30.000 USDC, dengan aturan sakti: x × y = k (konstan). Harga ETH di pool = y/x = 3.000 USDC. Saat trader membeli ETH, x berkurang → harga naik otomatis. Pool selalu 'menyeimbangkan' dirinya — dan penyeimbangan inilah yang menjual ETH-mu saat harga naik (sumber IL).",
        "Kedalaman pool menentukan slippage: pool Rp600 miliar menelan order Rp5 miliar tanpa terasa; pool Rp6 miliar hancur oleh order yang sama. Metrik: slippage untuk ukuran trade standar (mis. $100 ribu) — inilah 'kedalaman yang bisa dipakai', bukan total pool.",
        "Cara membaca diagram IL di bawah: sumbu X = rasio harga vs saat deposit (r), sumbu Y = IL. Kurva menyentuh 0% tepat di r=1 (harga tidak berubah = tidak ada IL), turun ke −5,7% di r=2 (harga 2× lipat), dan −20% di r=0,25 (harga anjlok ke seperempat). Interpretasi: IL selalu negatif saat harga bergerak ke ARAH MANA PUN — dan kerugiannya membesar non-linear. Inilah 'pajak volatilitas' menjadi LP.",
      ],
      figure: {
        svg: IL_SVG,
        alt: "Kurva impermanent loss: nol saat harga tidak berubah, minus 5,7 persen saat harga dua kali lipat, minus 20 persen saat harga seperempat.",
        caption: "Impermanent loss vs rasio harga: 0% di r=1, −5,7% saat harga 2×, −20% saat harga 0,25×. Bergerak ke mana pun = bayar.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: LP = jual call + beli put tanpa premi",
        body: "Menjadi LP di pool 50/50 secara ekonomi mirip menjual opsi: saat harga naik kamu 'dipaksa jual' (pool menjual ETH-mu), saat harga turun kamu 'dipaksa beli' (pool menumpuk ETH murah). Bedanya dengan options desk: kamu tidak menerima premi di muka — kompensasimu hanya fee trading yang menetes pelan-pelan. Kalau fee < IL, kamu mensubsidi trader. Hitung break-even: fee terkumpul vs IL — sebelum masuk, bukan sesudah.",
      },
      reference: "x×y=k menyeimbangkan pool otomatis = mekanisme di balik IL. Slippage mengukur kedalaman pakai.",
    },
    {
      id: "lab-il",
      eyebrow: "Langkah 4 · Lab",
      title: "Menghitung pajak volatilitas",
      prose: [
        "Rumus IL untuk pool 50/50 dengan rasio harga r (harga akhir / harga awal): IL = 2√r/(1+r) − 1. Hasilnya negatif (atau nol) — selalu.",
        "Lab: deposit 10 ETH + 30.000 USDC saat ETH $3.000. Hitung IL untuk dua skenario: (a) ETH naik ke $6.000 (r=2); (b) ETH jatuh ke $750 (r=0,25). Bulatkan 1 desimal, dalam persen.",
      ],
      formula: String.raw`IL(r) = \frac{2\sqrt{r}}{1+r} - 1 \qquad r = \frac{P_{akhir}}{P_{awal}}`,
      formulaNote: "r = rasio harga token vs saat deposit (r=2 berarti harga 2× lipat). IL(r) = selisih relatif nilai LP terhadap hold: −0,057 artinya LP kalah 5,7% dari hold. Rumus ini untuk pool 50/50 tanpa fee.",
      tasks: [
        { id: "t1", text: "Hitung `il_naik` (r=2) dalam persen, 1 desimal" },
        { id: "t2", text: "Hitung `il_turun` (r=0,25) dalam persen, 1 desimal" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "il_naik=-5.7%  il_turun=-20.0%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"IL hanya terjadi kalau harga turun.\" Salah — rumus simetris: r=2 (naik 2×) memberi −5,7%, SAMA dengan r=0,5 (turun separuh). IL adalah pajak VOLATILITAS, bukan pajak kejatuhan. LP yang 'bullish ETH' justru paling terpukul saat ETH benar-benar bullish — pool menjual ETH-nya di tengah jalan naik.",
      },
      hints: [
        "import math; gunakan math.sqrt(r).",
        "IL dalam persen = (2*math.sqrt(r)/(1+r) - 1) * 100.",
        "Bulatkan: round(x, 1).",
      ],
      code: {
        starter: `import math\n\ndef impermanent_loss(r):\n    # r = rasio harga akhir / harga awal\n    return (2 * math.sqrt(r) / (1 + r) - 1) * 100\n\n# TULIS KODEMU: IL saat ETH $3.000 -> $6.000 (r=2) dan -> $750 (r=0,25)\nil_naik = \nil_turun = \n\nprint(f"il_naik={il_naik}%  il_turun={il_turun}%")`,
        lockLines: 5,
        solution: `import math\n\ndef impermanent_loss(r):\n    # r = rasio harga akhir / harga awal\n    return (2 * math.sqrt(r) / (1 + r) - 1) * 100\n\n# TULIS KODEMU: IL saat ETH $3.000 -> $6.000 (r=2) dan -> $750 (r=0,25)\nil_naik = round(impermanent_loss(2), 1)\nil_turun = round(impermanent_loss(0.25), 1)\n\nprint(f"il_naik={il_naik}%  il_turun={il_turun}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "il_naik", value: -5.7, tol: 0.05, label: "`il_naik` = -5.7%", msg: "2√2/3 − 1 = −5,72%. Cek rumus dan pembulatan." },
          { kind: "equal", task: "t2", name: "il_turun", value: -20.0, tol: 0.05, label: "`il_turun` = -20.0%", msg: "2√0,25/1,25 − 1 = −20%. Harga jatuh = IL lebih dalam." },
          { kind: "stdout_matches", task: "t3", pattern: "il_naik=-5\\.7%\\s+il_turun=-20\\.0%", label: "Output menampilkan keduanya", msg: "Samakan format print dengan contoh." },
        ],
      },
      reference: "IL(r) = 2√r/(1+r) − 1. Pajak volatilitas: naik maupun turun tetap bayar.",
    },
    {
      id: "fee-vs-il",
      eyebrow: "Langkah 5 · Fee vs IL",
      title: "Kapan LP menguntungkan?",
      prose: [
        "Keputusan LP = pertarungan dua angka: fee terkumpul (menetes per trade, sebanding volume × fee tier) vs IL (sekali bayar, sebanding volatilitas). LP untung jika dan hanya jika fee > |IL|.",
        "Tiga rezim. Satu — sideways + volume tinggi (stablecoin-stablecoin, mis. USDC/USDT): IL ≈ 0, fee menetes terus. Ini 'sawah' LP paling aman. Dua — tren kuat satu arah: IL dalam, fee tidak menutup. Ini kuburan LP. Tiga — volatilitas tinggi dua arah: fee besar TETAPI IL juga besar; hanya menang jika fee tier tinggi (mis. 1%) dan volume sangat besar.",
        "Metrik pantau: fee APR aktual (bukan yang diiklankan — hitung dari fee terkumpul 30 hari terakhir dibagi likuiditasmu) vs IL berjalan dari r harga saat ini. Dashboard LP yang jujur menampilkan KEDUANYA berdampingan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko LP yang jarang dihitung: saat pasar crash, IL dalam BERTEPATAN dengan penarikan massal (bank run pool) — likuiditas menipis, slippage melebar, dan kamu exit di harga terburuk dengan IL terdalam. Stress test LP = simulasikan r=0,25 + penarikan 50% pool. Kalau masih bisa tidur, baru masuk.",
      },
      reference: "Untung jika fee > |IL|. Rezim sideways+volume = sawah; tren kuat = kuburan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Masuk pool atau tidak",
      prose: [
        "Skenario 1 — Pool stablecoin/USDC-USDT, butuh parkir dana 3 bulan → MASUK (porsi wajar). IL ≈ 0 karena r ≈ 1; risiko utama = depeg, bukan IL.",
        "Skenario 2 — Pool ETH/USDC, kamu bullish ETH 6 bulan ke depan → JANGAN jadi LP (atau porsi kecil). Jika thesismu benar (ETH naik jauh), IL memakan profitmu; lebih baik hold + staking.",
        "Skenario 3 — Pool token baru/tidak likuid dengan APR 300% → WAJIB curiga. APR raksasa = kompensasi risiko raksasa (IL ekstrem + risiko rug + slippage exit). Hitung break-even: APR 300% butuh bertahan berapa lama sebelum IL + risiko menelan pokok?",
        "Skenario 4 — Treasury perusahaan ingin yield dari idle USDC → pilih pool stablecoin blue-chip + batasi 10–20% treasury + monitor depeg. Jangan kejar APR tertinggi.",
        "Aturan praktis 10 detik: (1) berapa r realistis selama periode? → hitung IL; (2) berapa fee APR aktual 30 hari? → bandingkan; (3) bisakah exit tanpa slippage >1%? → cek kedalaman. Tiga 'tidak' = jangan masuk.",
      ],
      tasks: [],
      reference: "IL vs fee APR aktual vs slippage exit. Tiga cek sebelum masuk pool.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "APR 120% yang menelan pokok",
      prose: [
        "Pool TOKEN/USDC baru menawarkan APR 120%. Rina masuk Rp600 juta (setara 50/50) saat TOKEN Rp10.000. Tiga bulan kemudian TOKEN Rp40.000 (r=4). Fee yang ia kumpulkan: Rp90 juta (APR aktual ≈ 60% disetahunkan untuk 3 bulan). Ia merasa menang.",
        "Hitung IL: r=4 → IL = 2√4/5 − 1 = 4/5 − 1 = −20%. Nilai hold-nya: Rp600 juta → TOKEN naik 4×: 300jt×4 + 300jt = Rp1,5 miliar. Nilai LP-nya ≈ Rp1,5 miliar × 0,8 = Rp1,2 miliar + fee Rp90 juta = Rp1,29 miliar. Ia kalah Rp210 juta dari hold — padahal 'APR 120%'.",
        "Pembahasan: APR iklan (120%) vs APR aktual (60%) vs IL (−20% dari basis yang membesar). Pelajaran: (a) APR iklan memakai periode terbaik/terbaru — selalu hitung dari data 30 hari; (b) IL dihitung dari nilai yang MEMBESAR, jadi persen kecil = rupiah besar; (c) untuk token volatil naik 4×, tidak ada fee yang menutup IL — LP adalah strategi sideways, bukan strategi bull.",
      ],
      tasks: [],
      reference: "Evaluasi LP: APR aktual (bukan iklan) vs IL dari basis yang membesar.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 8 · Pendalaman",
      title: "Titik impas LP: kapan fee mengalahkan IL",
      prose: [
        "Lesson ini menghitung IL: harga naik 2x → IL −5,7%; turun 50% → IL −20%. Tapi LP juga DAPAT fee. Pertanyaan sebenarnya: kapan fee > IL? Definisikan TITIK IMPAS: fee_kumulatif = |IL|. Contoh: pool ETH/USDC, kamu deposit $10.000 (50/50). APR fee 25% (pool ramai). Harga ETH naik 2x dalam setahun → IL = 5,7% × $10.000 = $570. Fee setahun = 25% × $10.000 = $2.500. $2.500 > $570 ✓ UNTUNG $1.930. Tapi jika harga naik 4x: IL = 2√4/5−1 = −20% = $2.000; fee $2.500 → untung tipis $500. Jika naik 8x: IL = −34,3% = $3.430 > $2.500 ✗ RUGI $930 meski `dapat fee 25%`!",
        "Rumus titik impas: fee_rate × t = |2√r/(1+r) − 1|, dengan r = rasio harga, t = waktu (tahun). Untuk r=2 (naik 2x): butuh fee 5,7%/tahun untuk impas — pool dengan APR > 6% sudah untung. Untuk r=0,5 (turun setengah): butuh 20%/tahun — hanya pool sangat ramai yang sampai. Untuk r=4: butuh 20%/tahun juga. Polanya: IL tumbuh CEPAT di awal (r=2 → 5,7%) lalu MELAMBAT (r=4 → 20%, r=8 → 34%). Volatilitas BESAR sekali = pembunuh LP; volatilitas sedang = masih bisa diimbangi fee.",
        "Jebakan APR: pool menampilkan `APR 120%` (mini-case lesson: APR 120% menelan pokok!). APR 120% dengan IL 34% (harga naik 8x): fee $12.000 vs IL $3.430 → untung $8.570?? Kok mini-case bilang rugi? Karena APR 120% TIDAK BERTAHAN — ia turun ke 15% dalam 2 bulan saat modal besar masuk (dilusi fee!). Hitung dengan APR REALISTIS (rata-rata tertimbang waktu), bukan APR iklan hari pertama. Aturan: ambil APR 30 hari terakhir, bukan APR saat ini. APR hari pertama = umpan; APR 30 hari = kenyataan.",
        "Contoh perhitungan jujur: deposit $10.000, APR 30-hari rata-rata 18%, harga naik 3x dalam setahun. IL(3) = 2√3/4−1 = −13,4% = $1.340. Fee = $1.800. Untung $460 (4,6%). Bandingkan HODL: $5.000 ETH →3x = $15.000 + $5.000 USDC = $20.000 (naik $10.000). LP: $10.000 + $460 = $10.460. LP `untung` $460 tapi KEHILANGAN $9.540 dibanding HODL! Inilah `biaya peluang` yang tidak terlihat di dashboard pool. Selalu bandingkan LP vs HODL, bukan LP vs nol.",
        "Tiga kondisi LP menguntungkan: (1) harga STABIL (stablecoin-stablecoin: r≈1, IL≈0, fee murni untung); (2) fee TINGGI & STABIL (APR 30-hari > 2x IL ekspektasi); (3) kamu BUTUH eksposur keduanya (rebalancing otomatis). Jika tidak ada satu pun — HODL saja. Data: 70% LP ritel di pool volatil MERUGI dibanding HODL (tidak sadar karena dashboard hanya menunjukkan `fee earned`, bukan `vs HODL`).",
        "Strategi `range order` (Uniswap v3): konsentrasikan likuiditas di rentang harga sempit → fee 3–4x lipat, TAPI IL juga terkonsentrasi (keluar range = 100% satu aset = IL maksimal). Contoh: range ±10%: fee 60%/tahun, tapi harga keluar range 2x setahun → tiap keluar, posisi jadi 100% aset yang turun (rugi maksimal). Untuk pemula: v2 (range penuh) lebih pemaaf; v3 hanya jika kamu AKTIF mengelola (rebalance mingguan). Pasif + v3 = cara cepat menjadi exit liquidity.",
      ],
      formula: String.raw`\text{impas} \iff fee \times t = \left| \frac{2\sqrt{r}}{1+r} - 1 \right|`,
      formulaNote: "fee = APR fee (pakai rata-rata 30 hari, bukan iklan!); t = waktu dalam tahun; r = rasio harga akhir/awal. Wajib juga bandingkan vs HODL: untung_vs_hodl = (1 + fee×t) × (2√r/(1+r)) − r/2 − 1/2 (untuk 50/50).",
      figure: {
        svg: BCD4_DEEP_SVG,
        alt: "Diagram batang IL: 5,7% (2x), 20% (4x), 34,3% (8x) vs garis fee 25%.",
        caption: "Cara membaca: tinggi batang = |IL| untuk kenaikan harga r; garis putus-putus = fee 25%/tahun. Interpretasi: fee 25% mengalahkan IL sampai ~5x kenaikan; di 8x, IL (34,3%) melampaui fee — LP rugi meski `dapat fee`. Dan ini BELUM termasuk biaya peluang vs HODL.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: bandingkan vs HODL, bukan vs nol",
        body: "Dashboard pool menunjukkan `fee earned: +$1.800` (hijau, senang). Yang tidak ditunjukkan: HODL akan memberi +$10.000. LP `untung` $460 tapi kehilangan $9.540 peluang. Selalu hitung untung_vs_hodl — jika negatif, pool-nya bukan untukmu.",
      },
      reference: "APR pakai rata-rata 30 hari. 3 kondisi LP untung: stabil, fee tinggi, butuh rebalancing.",
    },
    {
      id: "lending-utilisasi",
      eyebrow: "Tambahan · BC6",
      title: "Sisi lending DeFi: utilisasi, collateral ratio, dan ambang likuidasi",
      prose: [
        "Lesson ini sejauh ini bercerita tentang AMM dan LP — tetapi separuh risiko DeFi adalah risiko LENDING: protokol pinjam-meminjam tempat pengguna menitipkan agunan (collateral) dan meminjam aset lain. Tiga angka menguasai dunia ini. Satu: UTILISASI = total yang dipinjam dibagi total yang dititipkan. Contoh ilustratif: pool dititipi 10.000 (ribu USD) dan dipinjam 7.500 → utilisasi 75 persen. Utilisasi tinggi berarti bunga pinjaman tinggi (pemberi pinjaman dibayar mahal) TETAPI likuiditas penarikan menipis — bila semua orang menarik bersamaan, tidak ada yang tersisa untuk ditarik.",
        "Dua: COLLATERAL RATIO = nilai agunan dibagi nilai pinjaman. Posisi A (ilustratif): agunan 150, pinjaman 100 → rasio 150 persen. Posisi B: 120/100 = 120 persen. Posisi C: 200/90 = 222,2 persen. Tiga: HEALTH FACTOR = (agunan × liquidation threshold) dibagi pinjaman. Dengan ambang likuidasi (liquidation threshold) 80 persen untuk A dan C, 75 persen untuk B: HF A = 150 × 0,80 / 100 = 1,20; HF B = 120 × 0,75 / 100 = 0,90; HF C = 200 × 0,80 / 90 = 1,78. Aturannya: HF di atas 1 = aman; HF di bawah 1 = TERLIKUIDASI (agunan dilelang untuk menutup pinjaman). Posisi B (0,90) sudah lewat ambang — likuidator boleh mengeksekusinya.",
        "Harga likuidasi adalah harga agunan saat HF tepat 1. Contoh ilustratif: agunan 1 ETH seharga 3.000 USD, pinjaman 2.000 USD, ambang likuidasi 80 persen → harga likuidasi = 2.000 dibagi (1 × 0,80) = 2.500 USD. Bila harga ETH turun dari 3.000 ke 2.500, posisi terlikuidasi — padahal harga 'baru' turun 16,7 persen. Inilah yang membuat lending DeFi rapuh saat pasar jatuh: penurunan harga memicu likuidasi, likuidasi menjual agunan, penjualan menekan harga, harga yang turun memicu likuidasi berikutnya — spiral yang sama yang dijelaskan oracle di BCD15, tetapi dari sisi peminjam.",
        "Untuk analis: dashboard risiko lending (lihat BCD12, paruh dashboard) selalu menampilkan keempat angka ini — utilisasi pool, collateral ratio, health factor per posisi besar, dan jarak ke harga likuidasi. APY yang dibahas di BCD18 dan likuidasi di BCD15 kini punya rumahnya di sini: APY tinggi di pool dengan utilisasi 95 persen bukan 'peluang', melainkan kompensasi atas risiko penarikan yang macet.",
      ],
      formula: String.raw`\text{Utilisasi} = \frac{\text{Dipinjam}}{\text{Dititipkan}} \quad ; \quad \text{HF} = \frac{\text{Agunan} \times LT}{\text{Pinjaman}} \quad ; \quad P_{\text{lik}} = \frac{\text{Pinjaman}}{\text{Jumlah agunan} \times LT}`,
      formulaNote: "Semua angka ilustratif (ribu USD kecuali disebutkan): utilisasi 7.500/10.000 = 75%; HF A 150x0,80/100 = 1,20; HF B 120x0,75/100 = 0,90; HF C 200x0,80/90 = 1,78. Harga likuidasi contoh: 2.000/(1x0,80) = 2.500 USD. Interpretasi: HF < 1 = terlikuidasi; LT = liquidation threshold.",
      tasks: [
        { id: "t1", text: "Hitung `utilisasi`, `hf` per posisi, dan `flag` posisi yang terlikuidasi (HF < 1)" },
        { id: "t2", text: "Hitung `harga_likuidasi` contoh (1 ETH, pinjaman 2.000, LT 0,80) dan cetak ringkasan" },
      ],
      expected: "Utilisasi 75.0% | HF: A=1.20 B=0.90 C=1.78 | Terlikuidasi: B | Harga likuidasi: 2500 USD",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Collateral ratio 120 persen berarti aman.” Belum tentu — yang menentukan likuidasi adalah HEALTH FACTOR (agunan × ambang dibagi pinjaman), bukan rasio mentahnya. Posisi B berasio 120 persen tetapi HF-nya 0,90: sudah terlikuidasi.",
      },
      hints: [
        "utilisasi = dipinjam / dititipkan * 100.",
        "hf = agunan * lt / pinjaman untuk tiap posisi.",
        "harga_likuidasi = pinjaman / (jumlah_agunan * lt).",
      ],
      code: {
        starter: `# Data ilustratif (ribu USD). JANGAN UBAH baris ini.\ndititipkan, dipinjam = 10000, 7500\nposisi = {"A": (150, 100, 0.80), "B": (120, 100, 0.75), "C": (200, 90, 0.80)}  # (agunan, pinjaman, LT)\ncontoh = {"agunan_eth": 1, "pinjaman_usd": 2000, "lt": 0.80}\n\n# TULIS KODEMU\nutilisasi =\nhf = {}\nfor nama, (agunan, pinjaman, lt) in posisi.items():\n    hf[nama] = \nflag = \nharga_likuidasi = \n\nprint(f"Utilisasi {utilisasi:.1f}% | HF: A={hf['A']:.2f} B={hf['B']:.2f} C={hf['C']:.2f} | Terlikuidasi: {', '.join(flag) if flag else 'tidak ada'} | Harga likuidasi: {harga_likuidasi:.0f} USD")`,
        lockLines: 3,
        solution: `# Data ilustratif (ribu USD). JANGAN UBAH baris ini.\ndititipkan, dipinjam = 10000, 7500\nposisi = {"A": (150, 100, 0.80), "B": (120, 100, 0.75), "C": (200, 90, 0.80)}  # (agunan, pinjaman, LT)\ncontoh = {"agunan_eth": 1, "pinjaman_usd": 2000, "lt": 0.80}\n\n# TULIS KODEMU\nutilisasi = dipinjam / dititipkan * 100\nhf = {}\nfor nama, (agunan, pinjaman, lt) in posisi.items():\n    hf[nama] = agunan * lt / pinjaman\nflag = [nama for nama, v in hf.items() if v < 1]\nharga_likuidasi = contoh["pinjaman_usd"] / (contoh["agunan_eth"] * contoh["lt"])\n\nprint(f"Utilisasi {utilisasi:.1f}% | HF: A={hf['A']:.2f} B={hf['B']:.2f} C={hf['C']:.2f} | Terlikuidasi: {', '.join(flag) if flag else 'tidak ada'} | Harga likuidasi: {harga_likuidasi:.0f} USD")`,
        checks: [
          { kind: "equal", task: "t1", name: "utilisasi", value: 75.0, tol: 1e-9, label: "`utilisasi` = 75.0", msg: "7.500 / 10.000 × 100 = 75%." },
          { kind: "equal", task: "t1", name: "hf", value: {"A": 1.2, "B": 0.9, "C": 1.7777777777777777}, label: "`hf` per posisi benar", msg: "A 1,20; B 0,90; C 1,78." },
          { kind: "equal", task: "t1", name: "flag", value: ["B"], label: "`flag` = [B]", msg: "Hanya B yang HF-nya di bawah 1." },
          { kind: "equal", task: "t2", name: "harga_likuidasi", value: 2500.0, tol: 1e-9, label: "`harga_likuidasi` = 2500", msg: "2.000 / (1 × 0,80) = 2.500 USD." },
          { kind: "stdout_matches", task: "t2", pattern: "Utilisasi 75\\.0% \\| HF: A=1\\.20 B=0\\.90 C=1\\.78 \\| Terlikuidasi: B \\| Harga likuidasi: 2500 USD", label: "Ringkasan tercetak", msg: "Samakan format dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Utilisasi = dipinjam/dititipkan. HF = agunan×LT/pinjaman; HF < 1 = terlikuidasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Lending DeFi: utilisasi 75%, health factor A 1,20 / B 0,90 (terlikuidasi) / C 1,78; harga likuidasi contoh 2.500 USD.",
        "Benchmark LP = hold; IL = selisih vs hold, bukan 'saldo berkurang'.",
        "IL(r) = 2√r/(1+r) − 1: pajak volatilitas, simetris naik-turun.",
        "TVL jujur = underlying saja, tanpa double counting, pisahkan lock vs parkir.",
        "LP untung hanya jika fee terkumpul > |IL|.",
        "x×y=k: pool otomatis menjual saat harga naik — mekanisme di balik IL.",
      ],
      next: { label: "BCD5 — Tokenomics & Distribusi", href: "/learn/bcd5-token" },
      quiz: [
        {
          q: "ETH $3.000 → $6.000 (r=2) di pool 50/50. IL-nya?",
          options: [
            { text: "−5,7%", why: "2√2/3 − 1 = −5,72%. Pool menjual sebagian ETH saat harga naik.", correct: true },
            { text: "+5,7% (untung)", why: "IL tidak pernah positif — ini selisih vs hold, selalu ≤ 0." },
            { text: "0% — harga naik kan untung", why: "Untung dalam dolar ≠ menang vs hold. Itulah inti IL." },
            { text: "−50%", why: "Terlalu besar — itu level r ≈ 0,01, bukan r=2." },
          ],
        },
        {
          q: "Protokol A TVL $2 miliar, protokol B TVL $1,2 miliar, tapi $800 juta di B adalah token LP dari A yang di-stake ulang. TVL gabungan yang jujur?",
          options: [
            { text: "$3,2 miliar", why: "Itu double counting — $800 juta dihitung dua kali." },
            { text: "$2,4 miliar ($2M + $1,2M − $0,8M duplikasi)", why: "Eliminasi duplikasi: hitung underlying sekali saja.", correct: true },
            { text: "$2 miliar (hanya A)", why: "B punya $400 juta underlying asli yang valid." },
            { text: "Tidak bisa dihitung", why: "Bisa — dengan mengurangkan komponen yang tumpang tindih." },
          ],
        },
        {
          q: "Kapan menjadi LP paling masuk akal?",
          options: [
            { text: "Saat yakin harga akan naik 4×", why: "Itu saat IL terdalam — pool menjual di tengah jalan naik." },
            { text: "Pool stablecoin sideways + volume tinggi: IL ≈ 0, fee menetes", why: "r ≈ 1 → IL ≈ 0; fee jadi profit bersih.", correct: true },
            { text: "Saat APR iklan tertinggi", why: "APR iklan memakai periode terbaik dan mengabaikan IL." },
            { text: "Saat pasar crash", why: "IL dalam + bank run pool = exit terburuk." },
          ],
        },
        {
          q: "Mengapa pool otomatis 'menjual saat harga naik'?",
          options: [
            { text: "Karena LP-nya panik", why: "Tidak ada manusia di sini — ini mekanisme otomatis." },
            { text: "Arbitrageur membeli token yang murah di pool sampai x×y=k dan harga kembali seimbang", why: "Arbitrase memaksa pool kembali ke harga pasar — dengan menguras token yang naik.", correct: true },
            { text: "Karena smart contract butuh fee", why: "Fee terpisah dari mekanisme rebalancing." },
            { text: "Tidak benar — pool tidak pernah menjual", why: "Justru itu inti AMM: komposisi pool berubah mengikuti harga." },
          ],
        },
        {
          q: "Slippage 5% untuk order $100 ribu di sebuah pool artinya?",
          options: [
            { text: "Pool dalam dan sehat", why: "Kebalik — 5% untuk $100 ribu = pool dangkal." },
            { text: "Pool terlalu dangkal untuk ukuran itu — eksekusi kehilangan 5% ke harga", why: "Slippage = pajak kedalaman; 5% sangat mahal untuk $100 ribu.", correct: true },
            { text: "Fee pool-nya 5%", why: "Slippage ≠ fee; slippage dari dampak harga, fee terpisah." },
            { text: "Order-nya terlalu kecil", why: "$100 ribu bukan kecil — pool-nya yang kecil." },
          ],
        },
        {
          q: "Pool ETH/USDC: APR iklan 120% (hari pertama), harga ETH naik 8x dalam setahun. Evaluasi TEPAT?",
          options: [
            { text: "Ikut — APR 120% pasti mengalahkan IL", why: "APR hari pertama = umpan (turun ke ~15% dalam 2 bulan karena dilusi). IL 8x = 34,3%. Hitung dengan APR 30-hari, bukan APR iklan." },
            { text: "Jangan ikut: IL 34,3% + APR realistis ~15% = rugi; bandingkan vs HODL", why: "Tepat. IL(8) = 34,3%; fee realistis ~$1.500 < $3.430. Dan vs HODL kerugiannya 10x lipat. APR iklan + volatilitas ekstrem = jebakan LP.", correct: true },
            { text: "Ikut dengan setengah modal untuk diversifikasi", why: "Setengah modal = setengah kerugian. Diversifikasi tidak memperbaiki ekspektasi negatif — ia hanya mengecilkannya." },
            { text: "Ikut via Uniswap v3 range sempit untuk fee 3x", why: "Range sempit + volatilitas 8x = keluar range = 100% aset yang turun (rugi maksimal). v3 memperparah, bukan menyelamatkan." },
          ],
        },
      ],
    },
  ],
};
