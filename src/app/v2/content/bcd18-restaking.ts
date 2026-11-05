import type { V2Lesson } from "../lib/types";

// ── Figure: leverage restaking — kolateral vs total restake vs rugi slash ──
const RESTAKE_SVG = `<svg viewBox="0 0 560 300" role="img" aria-label="Diagram batang leverage restaking: kolateral vs total restake">
<g stroke="var(--chart-grid)" stroke-width="1">
<line x1="48" y1="240.0" x2="520" y2="240.0"/>
<line x1="48" y1="159.2" x2="520" y2="159.2"/>
<line x1="48" y1="78.5" x2="520" y2="78.5"/>
</g><g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end">
<text x="42" y="244.0">0 jt</text>
<text x="42" y="163.2">0.5 jt</text>
<text x="42" y="82.5">1.0 jt</text>
</g><g>
<text x="126.7" y="258" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">ETH</text>
<text x="126.7" y="272" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">kolateral</text>
<rect x="95.2" y="78.5" width="62.9" height="161.5" fill="var(--c1)" opacity="0.9"/>
<text x="126.7" y="70.5" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1.0 jt</text>
<text x="284.0" y="258" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">total</text>
<text x="284.0" y="272" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">restake</text>
<rect x="252.5" y="57.5" width="62.9" height="182.5" fill="var(--c3)" opacity="0.9"/>
<text x="284.0" y="49.5" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">1.13 jt</text>
<text x="441.3" y="258" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">rugi slash</text>
<text x="441.3" y="272" text-anchor="middle" font-size="11" fill="var(--text)" font-family="var(--font-ui)">5%</text>
<rect x="409.9" y="230.9" width="62.9" height="9.1" fill="var(--c2)" opacity="0.9"/>
<text x="441.3" y="222.9" text-anchor="middle" font-size="12" font-weight="600" fill="var(--text)">0.0565 jt</text>
</g>
<line x1="48" y1="78.5" x2="520" y2="78.5" stroke="var(--c2)" stroke-width="2" stroke-dasharray="6 4"/>
<text x="516" y="70.5" text-anchor="end" font-size="11" fill="var(--c2)" font-family="var(--font-ui)">1,0 jt ETH kolateral</text>
<g fill="var(--text-muted)" font-size="10" font-family="var(--font-ui)"><text x="48" y="14">leverage restaking = 1,13× (juta ETH, data ilustratif)</text></g></svg>`;

export const bcd18: V2Lesson = {
  slug: "bcd18-restaking",
  track: "Blockchain Data Scientist",
  module: "Fondasi On-Chain",
  title: "Restaking Analytics: Ketika Keamanan Dijual Dua Kali",
  estMinutes: 52,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Demam emas yang kehabisan bahan bakar",
      prose: [
        "Awalnya ia terlihat seperti inovasi paling elegan di Ethereum: ETH yang sudah di-stake untuk mengamankan jaringan — modal yang “tertidur” — bisa dipakai LAGI untuk mengamankan protokol lain (AVS: oracle, bridge, sequencer) dengan imbalan yield tambahan. EigenLayer memeloporinya, dan uang mengalir seperti demam emas: TVL EigenLayer melonjak hingga $19,7 miliar di puncaknya. “Keamanan sebagai layanan yang bisa disewakan” — siapa yang tidak tergiur?",
        "Lalu angkanya berbalik. Dilaporkan CoinDesk pada 28 September 2026 (“The restaking gold rush is over”): kategori restaking tinggal $10,02 miliar per 8 September (data DefiLlama) — separuh dari puncak EigenLayer — dan fee-nya hanya sekitar $100 ribu seminggu, sementara liquid staking biasa menghasilkan sekitar 53 kali lipat per dolar yang diamankan. Twist-nya: yang runtuh bukan cuma harga — melainkan NARASI-nya. Ternyata “menjual keamanan dua kali” juga berarti “membeli risiko dua kali”: satu ETH yang sama menjamin banyak protokol sekaligus, sehingga satu kegagalan bisa memicu slashing berantai — dan yield 8% itu ternyata harga dari risiko yang tidak dipahami pembelinya.",
        "Di lesson ini kamu menjadi analis yang seharusnya ada SEBELUM demamnya: mengukur leverage restaking, memodelkan skenario slashing berkorelasi, dan membaca metrik TVL tanpa tertipu harganya. Karena demam berikutnya — dalam bentuk apa pun — pasti datang lagi.",
      ],
      tasks: [],
      note: {
        title: "Kenapa ini pekerjaan data, bukan cuma pekerjaan DeFi",
        type: "risk",
        body: "Setiap klaim “yield X%” di restaking adalah klaim tentang distribusi risiko yang hanya bisa diverifikasi dari data on-chain: berapa leverage-nya, seberapa terkonsentrasi operatornya, berapa banyak AVS yang berbagi kolateral yang sama. Analis yang tidak menghitung ini sedang menjual (atau membeli) asuransi tanpa membaca polisnya.",
      },
      reference: "Restaking = sewa ulang keamanan ETH. Harga sewanya = yield; premi risikonya = slashing berlapis.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 2 · Peta",
      title: "Tujuan, rute, dan bekal dari lesson lain",
      prose: [
        "Empat hal yang bisa kamu lakukan setelah lesson ini: (1) menjelaskan mekanisme restaking — staker, operator, AVS, dan kondisi slashing; (2) menghitung leverage restaking dan memodelkan skenario kerugian slashing berkorelasi; (3) membaca metrik kesehatan ekosistem restaking (TVL, konsentrasi operator, jumlah AVS) tanpa tertipu efek harga; (4) menilai kapan restaking layak secara risk-adjusted — dan kapan ia sekadar leverage berbungkus yield.",
        "Rutenya: cerita → dua bekal ringkas → tiga konsep inti (mekanisme, leverage, metrik) → lab Pyodide (kalkulator eksposur slash) → chart leverage dengan panduan baca → peta keputusan → mini-case operator → kuis → rangkuman. Estimasi 52 menit; lab-nya ±12 menit.",
        "Bekal yang dibutuhkan, diringkas agar lesson ini mandiri. Pertama, dari DeFi: TVL (total value locked) mengukur modal yang dikunci di protokol; AMM seperti Uniswap memakai x·y=k untuk penentuan harga; yield farming memberi imbalan atas penyediaan likuiditas — tetapi yield selalu harga dari suatu risiko. Kedua, dari tokenomics: token mendistribusikan insentif (emisi, vesting, staking reward) untuk mengarahkan perilaku — restaking pada dasarnya adalah lapisan insentif BARU di atas insentif staking Ethereum yang sudah ada, dengan aturan main (slashing) yang ditulis per AVS.",
      ],
      tasks: [],
      hints: [
        "💡 Intuisi pembuka: staking biasa = kamu menyewakan satu apartemen ke satu penyewa. Restaking = kamu menyewakan apartemen YANG SAMA ke tiga penyewa sekaligus dan menagih tiga uang sewa — selama tidak ada yang menuntut ganti rugi di saat bersamaan, kamu kaya; saat ketiganya menuntut sekaligus, kamu bangkrut tiga kali dari satu apartemen.",
      ],
      reference: "Bekal: (1) TVL/yield DeFi — yield = harga risiko; (2) tokenomics = insentif berlapis; restaking = lapisan insentif baru + slashing per AVS.",
    },
    {
      id: "konsep-mekanisme",
      eyebrow: "Langkah 3 · Konsep",
      title: "Restaking — Si Penjual Asuransi Ganda",
      prose: [
        "Definisi: restaking memungkinkan ETH yang sudah di-stake (atau liquid staking token-nya) untuk “di-stake ulang” sebagai jaminan keamanan bagi AVS — Actively Validated Services: layanan yang butuh validasi terdesentralisasi seperti oracle, bridge, sequencer rollup, atau keeper network. Rantai perannya: restaker (pemilik ETH) mendelegasikan ke operator (menjalankan node validasi untuk AVS), operator mendaftar ke satu/beberapa AVS, tiap AVS menetapkan kondisi slashing-nya sendiri (mis. downtime, equivocation, data withholding). Imbalan: staking reward Ethereum + fee/reward dari tiap AVS.",
        "Kepribadiannya: restaking adalah penjual asuransi yang menjual polis yang sama ke banyak klien — model bisnis yang brilian selama klaim tidak datang bersamaan. Masalahnya: klaim di sini BERKORELASI. Bug pada software operator, serangan terhadap infrastruktur cloud yang sama, atau kegagalan satu AVS besar bisa memicu slashing di BANYAK AVS sekaligus — terhadap KOLATERAL YANG SAMA. Inilah bedanya dengan staking biasa: risikonya tidak independen, ia menumpuk pada satu titik kegagalan.",
        "Kapan memakai (sebagai analis, bukan investor): restaking layak dianalisis sebagai objek risiko kapan pun kamu menilai (a) protokol AVS — “apakah keamanannya nyata atau sewaan yang bisa ditarik?”, (b) operator — “berapa banyak AVS yang ia layani dengan kolateral yang sama?”, (c) portofolio — “berapa eksposur slash berkorelasiku?”. JANGAN menilai restaking hanya dari APY yang terpampang — APY tanpa peta slashing adalah brosur, bukan analisis.",
      ],
      formula: String.raw`\text{leverage} = \frac{\sum_i \text{restake}_i}{\text{kolateral ETH}}`,
      formulaNote: "restake_i = jumlah ETH yang dijaminkan ke AVS ke-i; kolateral ETH = total ETH dasar yang dimiliki/di-stake. Contoh: 1 juta ETH di-restake total 1,13 juta ETH ke 3 AVS → leverage 1,13×. Interpretasi: leverage > 1 berarti janji keamanan yang beredar LEBIH BESAR dari modal yang menjaminnya — setiap 0,13× di atas 1 adalah janji yang hanya bisa ditepati bila tidak semua AVS menagih sekaligus.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Restaking = staking dengan yield lebih tinggi, risikonya sama saja”",
        type: "pitfall",
        body: "Yang benar: risikonya STRUKTURAL berbeda. Staking biasa: slash hanya bila validator-mu sendiri nakal/offline. Restaking: slash bisa datang dari AVS mana pun yang kamu layani — termasuk bug di AVS yang tidak kamu tulis dan tidak kamu audit. Yield tambahannya adalah premi atas risiko berlapis dan berkorelasi yang tidak ada di staking biasa.",
      },
      hints: [
        "💡 Intuisi: dalam asuransi tradisional, menjual polis ganda untuk risiko berkorelasi (mis. semua rumah di satu zona banjir) adalah jalan menuju kebangkrutan — regulator melarangnya. Di restaking, tidak ada regulator; yang ada hanya analis yang menghitung.",
      ],
      reference: "Restaking = satu kolateral, banyak polis (AVS). Risiko berkorelasi = klaim bisa datang serentak.",
    },
    {
      id: "konsep-slash",
      eyebrow: "Langkah 4 · Konsep",
      title: "Slashing Berkorelasi — Si Penagih Serentak",
      prose: [
        "Definisi: slashing adalah penyitaan sebagian kolateral validator sebagai hukuman (offline, double-sign, atau pelanggaran aturan AVS). Yang membuat restaking unik: SATU kegagalan operasional bisa melanggar aturan BANYAK AVS sekaligus. Model kerugiannya: bila fraksi p dari total restake terkena slash secara berkorelasi, kerugian = total_restake × p — dan karena total_restake = leverage × kolateral, kerugian bisa melebihi “porsi wajar” satu AVS. Skenario stres standar analis: p = 5% (insiden sedang), 15% (insiden besar), 30% (kegagalan sistemik).",
        "Kepribadiannya: slashing berkorelasi adalah penagih utang yang datang beramai-ramai — bukan satu per satu. Dalam keuangan tradisional ini disebut wrong-way risk: tepat saat kamu paling butuh modal (krisis), modalmu disita. Operator yang melayani 5 AVS dengan kolateral sama tidak punya “5× risiko independen” — ia punya SATU risiko yang dibayar 5× lipat saat terjadi.",
        "Kapan memakai: model skenario ini WAJIB dijalankan sebelum (a) mendelegasikan ke operator (“tunjukkan distribusi AVS-mu”), (b) menilai AVS (“berapa banyak keamananmu adalah sewaan berleverage?”), (c) menyusun kebijakan treasury (“eksposur slash maksimum yang bisa kami tanggung?”). JANGAN memakai ekspektasi (rata-rata) saja — slashing adalah risiko EKOR: jarang, tetapi menghancurkan. Lihat skenario stresnya, bukan rata-ratanya.",
      ],
      formula: String.raw`\text{rugi}(p) = \left(\sum_i \text{restake}_i\right) \times p = \text{kolateral} \times \text{leverage} \times p`,
      formulaNote: "p = fraksi slash pada skenario stres (0,05 / 0,15 / 0,30). Contoh: kolateral 1 jt ETH, leverage 1,13 → total restake 1,13 jt; skenario p = 5% → rugi 56.500 ETH (≈ 5,65% dari kolateral — LEBIH BESAR dari 5% karena leverage). Interpretasi: leverage mengubah slash “5%” menjadi luka “5,65%” — pengali yang diam-diam membesar bersama leverage. Pada leverage 3×, slash 5% = 15% kolateral hilang.",
      tasks: [],
      note: {
        title: "🚨 Mitos: “Slash 5% ya rugi 5% — kecil”",
        type: "pitfall",
        body: "Yang benar: 5% DARI APA? Bila leverage 1,13×, rugi = 5,65% kolateral; bila leverage 3×, rugi = 15%. Dan itu skenario “sedang” — skenario sistemik 30% pada leverage 3× menghapus 90% kolateral. Analis yang melaporkan “risiko 5%” tanpa menyebut basisnya sedang menenangkan dengan angka yang salah.",
      },
      hints: [
        "💡 Intuisi: leverage adalah pengeras suara risiko — ia tidak mengubah probabilitas kejadian, tetapi mengubah VOLUME kerugiannya. Setiap 1× leverage tambahan = setiap skenario slash terdengar lebih keras.",
      ],
      reference: "Modelkan skenario stres (5/15/30%), bukan rata-rata. Rugi = kolateral × leverage × p.",
    },
    {
      id: "konsep-metrik",
      eyebrow: "Langkah 5 · Konsep",
      title: "Metrik Restaking — Si Termometer Demam",
      prose: [
        "Definisi: empat metrik yang dibaca analis setiap minggu: (1) TVL restaking (dalam ETH, BUKAN USD — agar tidak tertipu harga ETH); (2) pangsa restaking vs staking total (berapa % keamanan Ethereum yang “disewakan ulang”); (3) konsentrasi operator (HHI pangsa TVL — sedikit operator dominan = titik kegagalan); (4) jumlah & keragaman AVS (banyak AVS kecil heterogen vs sedikit AVS raksasa yang bila gagal mengguncang semua).",
        "Kepribadiannya: metrik adalah termometer — ia bilang kamu demam, bukan penyakitnya apa. TVL $19,7B→$10,02B (CoinDesk/DefiLlama, Sep 2026) terlihat seperti “kepercayaan hilang”, tetapi analis yang baik memecahnya: berapa yang keluar karena harga ETH turun (efek denominasi) vs penarikan sungguhan (efek kepercayaan)? Jawabannya menentukan narasi: deleveraging sehat vs krisis kepercayaan — dua penyakit dengan obat berbeda.",
        "Kapan memakai: metrik dibaca sebagai DERET WAKTU, bukan titik. Sinyal bahaya: TVL(ETH) turun sementara jumlah AVS naik (keamanan per AVS menipis); HHI operator naik (sentralisasi); yield AVS naik tajam (biasanya harga risiko yang naik, bukan “kesempatan”). Sinyal sehat: TVL stabil dalam ETH, operator terdiversifikasi, slashing insiden kecil dan transparan.",
      ],
      formula: String.raw`\text{TVL}_{\text{ETH}} = \frac{\text{TVL}_{\text{USD}}}{\text{harga ETH}}`,
      formulaNote: "Bukan rumus dalam — melainkan disiplin denominasi. Contoh ilustratif: TVL $20B pada ETH $4.000 = 5 jt ETH; TVL $10B pada ETH $2.000 = 5 jt ETH. Dalam USD terlihat turun 50%, dalam ETH tidak berubah sama sekali — yang runtuh hanya harga. Interpretasi: analis yang melaporkan TVL dalam USD sedang mencampuradukkan dua cerita (harga × arus modal); pisahkan dulu, baru simpulkan.",
      tasks: [],
      hints: [
        "💡 Intuisi: setiap metrik kripto punya “kembaran USD”-nya yang berbohong saat harga bergerak. Disiplin pertama analis on-chain: denominasikan dalam unit aslinya (ETH, bukan USD) sebelum membaca tren.",
      ],
      reference: "Baca TVL dalam ETH, pantau HHI operator, dan bedakan efek harga vs efek penarikan.",
    },
    {
      id: "lab-eksposur",
      eyebrow: "Langkah 6 · Lab",
      title: "Lab — Kalkulator eksposur slash",
      prose: [
        "Waktunya jadi analis risikonya. Di bawah ada posisi restaking sintetis: 1 juta ETH kolateral dipecah ke 3 AVS. Tugasmu: tulis tiga fungsi — `leverage(total, kolateral)`, `rugi_slash(total, pct)` (pct dalam persen), dan `sisa_kolateral(kolateral, rugi)` — lalu jalankan skenario stres 5%.",
        "Coba: setelah lolos, jalankan skenario 15% dan 30% (ubah argumennya). Pada leverage berapa rugi 30% menghapus SELURUH kolateral? Itulah leverage maksimum yang “masuk akal” — dan pasar pernah melampauinya.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `leverage(total, kolateral)`: `total / kolateral`" },
        { id: "t2", text: "Lengkapi `rugi_slash(total, pct)`: `total * pct / 100`" },
        { id: "t3", text: "Lengkapi `sisa_kolateral(kolateral, rugi)`: `kolateral − rugi`" },
        { id: "t4", text: "Jalankan skenario stres 5% dan pastikan tiga baris tercetak" },
      ],
      expected: "total_restake=1130000 leverage=1.13x\nrugi_slash_5%=56500.0 ETH\nsisa_kolateral=943500.0 ETH",
      hints: [
        "total = jumlahkan tiga AVS: 450.000 + 380.000 + 300.000.",
        "Skenario 15%: rugi = 169.500 ETH. Skenario 30%: rugi = 339.000 ETH — sepertiga kolateral hilang dalam satu insiden.",
      ],
      code: {
        starter: `# Posisi restaking SINTETIS (bukan data EigenLayer asli)
kolateral = 1_000_000  # ETH
avs = {"AVS-A": 450_000, "AVS-B": 380_000, "AVS-C": 300_000}

# TULIS KODEMU: tiga fungsi di bawah ini
def leverage(total, kolateral):
    return

def rugi_slash(total, pct):
    return

def sisa_kolateral(kolateral, rugi):
    return

total = sum(avs.values())
lev = leverage(total, kolateral)
rugi = rugi_slash(total, 5)
print(f"total_restake={total} leverage={lev:.2f}x")
print(f"rugi_slash_5%={rugi} ETH")
print(f"sisa_kolateral={sisa_kolateral(kolateral, rugi)} ETH")`,
        lockLines: 3,
        solution: `# Posisi restaking SINTETIS (bukan data EigenLayer asli)
kolateral = 1_000_000  # ETH
avs = {"AVS-A": 450_000, "AVS-B": 380_000, "AVS-C": 300_000}

# TULIS KODEMU: tiga fungsi di bawah ini
def leverage(total, kolateral):
    return total / kolateral

def rugi_slash(total, pct):
    return total * pct / 100

def sisa_kolateral(kolateral, rugi):
    return kolateral - rugi

total = sum(avs.values())
lev = leverage(total, kolateral)
rugi = rugi_slash(total, 5)
print(f"total_restake={total} leverage={lev:.2f}x")
print(f"rugi_slash_5%={rugi} ETH")
print(f"sisa_kolateral={sisa_kolateral(kolateral, rugi)} ETH")`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "leverage=1\\.13x", label: "Leverage = 1,13×", msg: "1.130.000 / 1.000.000 = 1,13." },
          { kind: "stdout_matches", task: "t2", pattern: "rugi_slash_5%=56500\\.0 ETH", label: "Rugi skenario 5% = 56.500 ETH", msg: "1.130.000 × 5% — lebih besar dari 5% kolateral karena leverage." },
          { kind: "stdout_matches", task: "t3", pattern: "sisa_kolateral=943500\\.0 ETH", label: "Sisa kolateral = 943.500 ETH", msg: "1.000.000 − 56.500." },
          { kind: "stdout_matches", task: "t4", pattern: "total_restake=1130000", label: "Total restake = 1.130.000", msg: "450.000 + 380.000 + 300.000." },
        ],
      },
      reference: "Leverage = total/kolateral. Rugi = total × p. Selalu skenariokan 5/15/30%.",
    },
    {
      id: "chart-leverage",
      eyebrow: "Langkah 7 · Chart",
      title: "Membaca batang leverage seperti manajer risiko",
      prose: [
        "Chart di bawah memplot hasil lab-mu: 1,0 jt ETH kolateral vs 1,13 jt total restake, plus batang mungil rugi skenario slash 5%.",
        "Cara membaca: sumbu Y = juta ETH; batang pertama = modal nyata yang dimiliki; batang kedua = total janji keamanan yang dijual; batang ketiga = kerugian bila 5% dari janji itu ditagih sekaligus. Garis putus-putus = level kolateral (1,0).",
        "Interpretasi: batang kedua LEBIH TINGGI dari garis kolateral — selisih 0,13 jt itulah janji tanpa modal. Batang ketiga terlihat mungil (0,0565 jt) — dan di situlah bahayanya: ia terlihat kecil sehingga mudah diremehkan, padahal ia 5,65% dari kolateral, bukan 5%. Sekarang bayangkan leverage 3×: batang kedua tiga kali garis, dan batang rugi 5% menjadi 0,15 jt — 15% kolateral lenyap dalam satu insiden “sedang”. Chart ini adalah alasan analis tidak pernah menilai restaking dari APY-nya.",
      ],
      figure: {
        svg: RESTAKE_SVG,
        alt: "Diagram batang: kolateral 1,0 juta ETH, total restake 1,13 juta ETH, rugi skenario slash 5% sebesar 0,0565 juta ETH.",
        caption: "Leverage 1,13×: janji (1,13 jt) melebihi modal (1,0 jt). Skenario slash 5% = 56.500 ETH.",
      },
      tasks: [],
      note: {
        title: "Intuisi: satu operator, satu titik gagal, banyak tagihan",
        body: "Restaking terlihat seperti diversifikasi — \"satu modal mengamankan banyak layanan\" — tetapi analis risiko membacanya terbalik: satu kegagalan operasional menagih ke banyak tempat sekaligus. Inilah leverage berlapis yang sesungguhnya, dan ia bekerja lewat operator: operator yang sama menjalankan validator untuk 5 AVS berarti satu kesalahan — misconfiguration, downtime — melanggar aturan 5 AVS serentak. Heuristik stresnya: jangan hitung eksposur per AVS seolah independen — kalikan. Rumus kasarnya: rugi skenario sama dengan kolateral dikali leverage dikali fraksi slash; pada leverage 1,13, slash \"5 persen\" berarti 5,65 persen kolateral lenyap, dan pada leverage 3, slash 5 persen yang sama berarti 15 persen kolateral hilang dalam satu insiden \"sedang\". Jebakan yang paling mahal adalah menilai dari APY: yield 8 persen terlihat menarik sampai kamu sadar ia dibayar dengan risiko ekor yang berkorelasi — wrong-way risk klasik: tepat saat pasar krisis dan kamu paling butuh modal, slash datang beramai-ramai. Aturan praktis analis: batasi leverage per operator (bukan per AVS), diversifikasi OPERATOR bukan sekadar AVS, dan selalu tanyakan \"kondisi slash apa yang overlap antar AVS yang kulayani?\" — karena yang menagih serentak bukan pasarnya, melainkan kontrak-kontrak yang ditandatangani oleh tangan yang sama.",
      },
      reference: "Batang janji > garis modal = leverage. Rugi selalu dihitung dari janji, bukan dari modal.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan restaking layak — dan kapan tidak?",
      prose: [
        "Lima skenario keputusan analis:",
        "Skenario 1 — Menilai AVS baru yang menawarkan yield 12%. → Hitung: berapa % keamanannya dari restake berleverage vs validator khusus? Cek HHI operatornya. Alasan: yield 12% dari keamanan sewaan tipis = premi risiko yang belum tentu cukup; AVS dengan keamanan “asli” (validator khusus, stake sendiri) layak dihargai berbeda.",
        "Skenario 2 — Memilih operator untuk delegasi. → Pilih operator dengan diversifikasi AVS yang heterogen (bukan 5 AVS yang semuanya bergantung pada satu klien software) + rekam jejak slashing nol + leverage per operator rendah. Alasan: korelasi adalah pembunuhnya — diversifikasi nama AVS tanpa diversifikasi risiko teknologinya adalah kosmetik.",
        "Skenario 3 — Treasury DAO mempertimbangkan restake 20% ETH-nya. → Jalankan skenario stres 5/15/30% (seperti lab) dan tetapkan batas: “eksposur slash maksimum X% dari treasury”. Alasan: keputusan alokasi tanpa batas kerugian yang ditulis adalah spekulasi, bukan manajemen risiko.",
        "Skenario 4 — TVL restaking (dalam ETH) turun 20% dalam sebulan. → Bedakan: penarikan operator (cek arus keluar per operator besar) vs efek harga (sudah didenominasi ETH — jadi ini penarikan SUNGGUHAN) vs migrasi ke AVS/protokol lain. Alasan: responsnya beda — penarikan karena takut vs rotasi biasa menuntut tindakan berbeda.",
        "Skenario 5 — Seseorang mengusulkan “restaking untuk Bitcoin/L2 lain”. → Tanya dulu: apa mekanisme slashing-nya dan siapa yang mengeksekusi? Alasan: tanpa slashing yang kredibel, “restaking” hanyalah staking biasa berbungkus narasi — keamanan yang tidak bisa disita bukan keamanan, melainkan janji.",
        "Aturan praktis 10 detik: hitung leverage → skenariokan slash 5/15/30% → cek konsentrasi operator → denominasikan TVL dalam ETH → baru bicara yield.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan APY restaking antar-protokol tanpa menormalisasi leverage dan risiko slash-nya — seperti membandingkan gaji tanpa melihat jam kerja dan bahayanya. APY 12% pada leverage 3× bisa jadi LEBIH BURUK secara risk-adjusted daripada APY 6% pada leverage 1,1×.",
      },
      reference: "Keputusan restaking = leverage + skenario slash + konsentrasi − baru yield. Urutannya tidak bisa dibalik.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Operator Merak dan lima polisnya",
      prose: [
        "Skenario (sintetis, untuk latihan): Operator Merak mengelola 100.000 ETH delegasi, di-restake ke 5 AVS @ 20.000 ETH — leverage 1,0× (terlihat “aman”). Kelima AVS itu ternyata semuanya memakai klien validator yang sama dan berjalan di dua region cloud yang sama. Suatu hari, bug konsensus pada klien itu menyebabkan downtime 6 jam yang melanggar aturan slashing 3 dari 5 AVS (masing-masing slash 3% dari stake yang didelegasikan ke mereka).",
        "Pertanyaan analisis: (1) Berapa kerugian total? (2) Apa yang salah dari penilaian “leverage 1,0× = aman”? (3) Bagaimana seharusnya analis menilai Merak SEBELUM insiden?",
        "Pembahasan: (1) 3 AVS × 20.000 × 3% = 1.800 ETH — 1,8% dari delegasi hilang dalam 6 jam karena SATU bug. (2) Leverage 1,0× hanya mengukur BESARNYA janji vs modal — ia tidak mengukur KORELASI antar-janji. Lima polis yang gagal karena satu sebab bukanlah “risiko terdiversifikasi”; ia satu risiko yang dihitung lima kali. (3) Sebelum insiden, analis harus memetakan matriks korelasi: klien software apa, infrastruktur apa, tim apa di balik tiap AVS — dan memberi “diskon diversifikasi” NOL untuk AVS yang berbagi tumpukan teknologi. Pertanyaan kuncinya bukan “berapa leverage-mu?” melainkan “apa yang bisa membuat SEMUA AVS-mu gagal sekaligus?”",
        "Pelajaran umum: dalam restaking, diversifikasi yang dihitung dari JUMLAH AVS adalah ilusi; diversifikasi yang nyata dihitung dari KEBEBASAN SEBAB kegagalan. Analis yang menghitung keduanya akan selalu lebih pesimis — dan lebih benar.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ini adalah wrong-way risk dalam bentuk paling murni: modal disita tepat saat kepercayaan pasar goyah (bug klien = berita buruk industri). Treasury yang tidak memodelkan korelasi akan menemukan “diversifikasinya” lenyap persis saat dibutuhkan.",
      },
      reference: "Diversifikasi restaking = kebebasan sebab kegagalan, bukan jumlah AVS.",
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
        "Restaking = ETH staked dipakai ulang menjamin AVS; imbalannya yield berlapis, harganya risiko slashing berlapis dan berkorelasi.",
        "Leverage = total restake / kolateral; rugi skenario = kolateral × leverage × p — leverage mengeraskan setiap skenario.",
        "Slashing berkorelasi = satu sebab, banyak polis: diversifikasi dihitung dari kebebasan sebab, bukan jumlah AVS.",
        "Metrik sehat: TVL dalam ETH (bukan USD), HHI operator rendah, keamanan per AVS tidak menipis; bedakan efek harga vs penarikan.",
        "Aturan pakai: hitung leverage → skenario 5/15/30% → cek konsentrasi → baru bicara yield. APY tanpa peta risiko = brosur.",
      ],
      quiz: [
        {
          q: "Kolateral 2 jt ETH, total restake 5 jt ETH. Skenario slash 5% berkorelasi. Kerugian?",
          options: [
            { text: "250.000 ETH (12,5% dari kolateral) — leverage 2,5× mengeraskan slash 5% menjadi 12,5%", why: "Benar: 5 jt × 5% = 250 rb; 250 rb / 2 jt = 12,5%. Inilah pengeras leverage bekerja.", correct: true },
            { text: "100.000 ETH (5% dari kolateral)", why: "Salah: 5% harus dihitung dari TOTAL JANJI (5 jt), bukan dari modal (2 jt). Kesalahan basis = kesalahan fatal." },
            { text: "500.000 ETH (25% dari kolateral)", why: "Salah: keliru menggandakan — 5% × 5 jt = 250 rb, bukan 500 rb. Cek aritmetikanya sebelum panik." },
            { text: "Tidak bisa dihitung tanpa tahu AVS-nya", why: "Salah: untuk skenario berkorelasi agregat, cukup total restake × p. Rincian AVS penting untuk analisis korelasi, bukan untuk angka agregat ini." },
          ],
        },
        {
          q: "TVL restaking turun dari $19,7B ke $10,02B. Analisis pertama yang benar?",
          options: [
            { text: "Denominasikan ulang dalam ETH untuk memisahkan efek harga dari penarikan sungguhan", why: "Benar: penurunan dalam USD mencampur efek harga ETH dan penarikan sungguhan — dua cerita berbeda (kepercayaan vs harga) dengan implikasi berbeda.", correct: true },
            { text: "Simpulkan kepercayaan pasar hilang 77%", why: "Salah: membaca angka USD mentah sebagai “kepercayaan” mencampuradukkan harga dan arus modal." },
            { text: "Beli saat murah — lagi diskon besar", why: "Salah: “murah” tanpa analisis sebab adalah narasi pedagang, bukan analis. Mungkin memang fundamentalnya rusak." },
            { text: "Abaikan — TVL bukan metrik penting", why: "Salah: TVL (dalam denominasi benar) adalah termometer utama ekosistem; mengabaikannya = menolak data." },
          ],
        },
        {
          q: "Operator melayani 5 AVS dengan klien software dan cloud yang sama. Diversifikasinya?",
          options: [
            { text: "Ilusi — satu bug bisa memicu slash di semuanya; diversifikasi nyata butuh kebebasan sebab kegagalan", why: "Benar: kasus Operator Merak di mini-case — 1.800 ETH hilang dari satu bug. Jumlah AVS tanpa kebebasan sebab = kosmetik.", correct: true },
            { text: "Baik — 5 AVS berarti risiko tersebar 5 arah", why: "Salah: tersebar ke 5 arah yang semuanya runtuh oleh guncangan yang sama bukanlah penyebaran." },
            { text: "Cukup — yang penting leverage-nya 1,0×", why: "Salah: leverage mengukur besar janji, bukan korelasinya. Keduanya harus dihitung." },
            { text: "Tidak relevan — slash AVS tidak mungkin berkorelasi", why: "Salah: justru sangat mungkin — shared software, shared infra, shared operator adalah norma, bukan pengecualian." },
          ],
        },
        {
          q: "Sebuah AVS baru menawarkan yield 12% — dua kali lipat AVS lain. Evaluasi analis yang benar?",
          options: [
            { text: "Curigai premi risiko: cek berapa % keamanannya dari restake berleverage, HHI operatornya, dan kondisi slashing-nya sebelum tergiur", why: "Benar: yield tinggi biasanya = harga risiko tinggi (keamanan tipis, operator terkonsentrasi, atau slashing longgar). Tugas analis adalah menemukan APA yang dibayar oleh 12% itu.", correct: true },
            { text: "Ambil — yield 2× lipat selalu layak", why: "Salah: “selalu layak” tanpa memeriksa risiko adalah cara tercepat menjadi korban adverse selection — yang menawarkan paling tinggi biasanya menyembunyikan paling banyak." },
            { text: "Tolak — yield di atas 6% pasti scam", why: "Salah: ambang magis 6% tidak ada dasarnya; ada AVS sehat beryield tinggi (risiko nyata tapi terukur) dan AVS beryield rendah yang rapuh." },
            { text: "Tunggu setahun dan lihat apakah masih hidup", why: "Salah: “tunggu dan lihat” bukan analisis — dan setahun dalam kripto bisa berarti melewatkan seluruh siklus. Analisis = ukur sekarang dengan data yang ada." },
          ],
        },
        {
          q: "Urutan analisis restaking yang benar sebelum bicara yield?",
          options: [
            { text: "Hitung leverage → skenariokan slash 5/15/30% → cek konsentrasi operator → denominasikan TVL dalam ETH", why: "Benar: urutan dari lesson — risiko dulu, harga belakangan. APY adalah kalimat terakhir laporan, bukan yang pertama.", correct: true },
            { text: "Bandingkan APY antar-protokol → pilih tertinggi", why: "Salah: memilih APY tertinggi tanpa risiko = memilih premi terbesar tanpa membaca polis — definisi adverse selection." },
            { text: "Cek harga token AVS → proyeksikan keuntungan", why: "Salah: harga token adalah spekulasi ganda di atas risiko yang belum diukur." },
            { text: "Tanya komunitas di media sosial", why: "Salah: sentimen bukan pengganti perhitungan — terutama di pasar yang TVL-nya pernah anjlok tajam." },
          ],
        },
      ],
    },
  ],
};
