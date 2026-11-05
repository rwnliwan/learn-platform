import type { V2Lesson } from "../lib/types";

const ALTERNATIF_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Scatter risiko-return enam kelas aset: kas, obligasi, properti, saham, komoditas, dan private equity.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="77" x2="500" y2="77"/><line x1="60" y1="149" x2="500" y2="149"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">14</text><text x="54" y="81">10</text><text x="54" y="153">5</text><text x="54" y="224">0</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">return harapan (%)</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">0</text><text x="207" y="240">10</text><text x="353" y="240">20</text><text x="500" y="240">30%</text></g>
<g><circle cx="82" cy="163" r="5.5" fill="var(--c1)"/><circle cx="133" cy="134" r="5.5" fill="var(--c2)"/><circle cx="207" cy="99" r="5.5" fill="var(--c3)"/><circle cx="295" cy="70" r="5.5" fill="var(--c4)"/><circle cx="353" cy="91" r="5.5" fill="var(--c5)"/><circle cx="324" cy="54" r="5.5" fill="var(--c6)"/></g>
<g font-size="10" font-family="var(--font-ui)" fill="var(--chart-text)"><text x="90" y="166">kas</text><text x="141" y="137">obligasi</text><text x="199" y="102" text-anchor="end">properti</text><text x="295" y="60" text-anchor="middle">saham</text><text x="361" y="94">komoditas</text><text x="324" y="44" text-anchor="middle">PE (IRR 11,6%)</text></g>
<text x="280" y="252" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">risiko (volatilitas, %) →</text>
</svg>`;

export const pma9: V2Lesson = {
  slug: "pm-a9-alternatives",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A9 Alternatives: di Luar Saham-Obligasi",
  estMinutes: 55,
  steps: [
    {
      id: "karakteristik",
      eyebrow: "Langkah 1 · Karakteristik + chart",
      title: "Private equity yang \u2018untung 3x\u2019 tapi kalah",
      prose: [
        "Bu Lina berinvestasi di private equity: \u201cmodal kembali 3x lipat!\u201d dalam 10 tahun. Ia pamer ke teman-temannya yang cuma dapat 2x dari reksadana saham. Twist-nya: 3x dalam 10 tahun = IRR ~11,6% — sementara reksadana saham temannya 2x dalam 6 tahun = IRR ~12,2%. Ditambah PE tidak likuid 10 tahun dan fee 2-and-20. \u201c3x\u201d terdengar hebat sampai dihitung per tahun dan disesuaikan likuiditas.",
        "Alternatif = di luar saham/obligasi/kas: real estate, PE, hedge fund, komoditas, infrastruktur, aset digital. Cirinya: illikuid (lockup tahunan), fee tinggi (2-and-20: 2% management + 20% performance di atas hurdle), valuasi appraisal (tidak mark-to-market harian \u2192 volatilitas tampak rendah = smoothing), J-curve (rugi di awal: fee + investasi, untung belakangan).",
        "Illiquidity premium: return ekstra sebagai kompensasi tidak bisa jual — harus > 0 agar worth it. PE mengunci modalmu 10 tahun; kompensasinya harus ~3\u20134% di atas return saham publik, setelah fee. Jika PE memberi 11,6% sementara saham memberi 12,2%, kamu membayar untuk dikunci — bukan dibayar.",
        "Cara membaca: sumbu X = risiko (volatilitas, %), sumbu Y = return harapan (%); setiap titik = satu kelas aset.",
        "Interpretasi: PE duduk paling tinggi (IRR 11,6% dari contoh teks) tetapi juga di kanan — return tinggi dengan risiko dan illikuiditas tinggi. Perhatikan jebakan teks: titik PE tampak 'tenang' karena NAV di-appraisal, bukan mark-to-market — volatilitas aslinya lebih ke kanan dari yang terlihat.",
      ],
      figure: {
        svg: ALTERNATIF_SVG,
        alt: "Scatter risiko-return enam kelas aset: kas, obligasi, properti, saham, komoditas, dan private equity.",
        caption: "Posisi titik adalah ilustrasi kecuali PE (IRR 11,6% = '3x dalam 10 tahun' dari teks). Pola umumnya benar: tidak ada return tinggi tanpa risiko/illikuiditas tinggi — dan volatilitas PE yang tampak rendah adalah artefak smoothing appraisal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cVolatilitas rendah = risiko rendah\u201d pada PE. NAV di-appraisal kuartalan (bukan harga pasar harian) \u2192 volatilitas tampak rendah \u2192 Sharpe tampak tinggi. Ini smoothing, bukan risiko rendah — saat krisis likuiditas, NAV bisa di-markdown 30\u201340% sekaligus.",
      },
      reference: "\u201c3x\u201d tanpa waktu = menipu. Selalu annualize (IRR) dan bandingkan dengan alternatif likuid.",
    },
    {
      id: "annualize",
      eyebrow: "Langkah 2 · Annualize",
      title: "Multiple tanpa waktu = angka pemasaran",
      prose: [
        "PE: 3x dalam 10 tahun \u2192 IRR = 3^(1/10) \u2212 1 = 11,6%. Saham: 2x dalam 6 tahun \u2192 2^(1/6) \u2212 1 = 12,2%. Saham menang — dengan likuiditas penuh. PE seharusnya memberi illiquidity premium ~3\u20134% di atas saham; di sini malah diskon.",
      ],
      formula: String.raw`IRR = \text{multiple}^{1/T} - 1`,
      formulaNote: "multiple = total return berganda (3x); T = horizon dalam tahun (10). Interpretasi: IRR adalah “bunga tahunan ekuivalen” — satu-satunya cara fair membandingkan multiple dengan horizon berbeda; “3x” tanpa waktu adalah angka pemasaran. Contoh angka: 3^(1/10) − 1 = 11,6% vs 2^(1/6) − 1 = 12,2% — multiple 3x kalah dari 2x karena horizonnya jauh lebih panjang.",
      tasks: [
        { id: "t1", text: "Hitung `irr_pe` (3x, 10 tahun) dan `irr_saham` (2x, 6 tahun), desimal" },
        { id: "t2", text: "Cetak keduanya dalam persen 1 desimal" },
      ],
      expected: "irr_pe=11.6%  irr_saham=12.2%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Membandingkan multiple langsung (3x vs 2x) tanpa memperhatikan horizon. 3x dalam 10 tahun kalah dari 2x dalam 6 tahun.",
      },
      hints: [
        "IRR = multiple^(1/T) \u2212 1.",
        "Cetak persen: kalikan 100, format 1 desimal.",
        "irr_pe = 3**(1/10) - 1\nirr_saham = 2**(1/6) - 1",
      ],
      code: {
        starter: `# TULIS KODEMU: IRR dari multiple\nirr_pe = \nirr_saham = \n\nprint(f"irr_pe={irr_pe*100:.1f}%  irr_saham={irr_saham*100:.1f}%")`,
        lockLines: 0,
        solution: `# TULIS KODEMU: IRR dari multiple\nirr_pe = 3**(1/10) - 1\nirr_saham = 2**(1/6) - 1\n\nprint(f"irr_pe={irr_pe*100:.1f}%  irr_saham={irr_saham*100:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "irr_pe", value: 0.1161, tol: 0.002, label: "`irr_pe` sekitar 0.116", msg: "3^(1/10)\u22121 = 11,6%. Pangkatkan 1/T, bukan bagi." },
          { kind: "equal", task: "t1", name: "irr_saham", value: 0.1225, tol: 0.002, label: "`irr_saham` sekitar 0.122", msg: "2^(1/6)\u22121 = 12,2%. Saham menang meski multiple-nya lebih kecil." },
          { kind: "stdout_matches", task: "t2", pattern: "irr_pe=11\\.6%\\s+irr_saham=12\\.2%", label: "`print` menampilkan keduanya", msg: "Format persen 1 desimal." },
        ],
      },
      reference: "IRR = multiple^(1/T) \u2212 1. Multiple tanpa waktu menipu.",
    },
    {
      id: "dpi-tvpi",
      eyebrow: "Langkah 3 · DPI vs TVPI",
      title: "Kas vs kertas",
      prose: [
        "Fund memanggil Rp100M. Sudah distribusikan Rp80M. NAV tersisa Rp90M. DPI = 80/100 = 0,8x (kas kembali); RVPI = 90/100 = 0,9x (kertas); TVPI = 0,8 + 0,9 = 1,7x.",
        "TVPI 1,7x terlihat bagus — tetapi DPI < 1,0x artinya kamu belum balik modal kas. NAV Rp90M adalah appraisal manajer sendiri (bisa optimis). Aturan LP berpengalaman: percaya DPI, curigai RVPI. Fund yang TVPI-nya tinggi tetapi DPI-nya macet = \u201ckaya di atas kertas\u201d.",
      ],
      formula: String.raw`TVPI = DPI + RVPI = \frac{\text{distribusi} + \text{NAV}}{\text{paid-in}}`,
      formulaNote: "distribusi = kas yang sudah kembali ke investor (Rp80 juta); NAV = nilai appraisal sisa (Rp90 juta — taksiran manajer, bisa optimis); paid-in = modal yang sudah disetor (Rp100 juta). Interpretasi: TVPI = DPI (kas nyata) + RVPI (janji kertas) — analis berpengalaman membayar mahal untuk DPI dan mencurigai RVPI. Contoh angka: DPI = 80/100 = 0,8x (belum balik modal kas!) padahal TVPI = (80+90)/100 = 1,7x terlihat bagus.",
      tasks: [
        { id: "t1", text: "Hitung `dpi` (distribusi/paid-in)" },
        { id: "t2", text: "Hitung `tvpi` ((distribusi+NAV)/paid-in), cetak keduanya" },
      ],
      expected: "dpi=0.8x  tvpi=1.7x",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "RS tidak menerima NAV appraisal sebagai pembayaran. Bu Lina butuh dana darurat Rp500jt di tahun ke-7 tetapi DPI fund-nya 0,8x — TVPI 1,7x tidak bisa dipakai berobat. Jangan kunci uang darurat di aset illikuid.",
      },
      hints: [
        "DPI = distribusi / paid-in.",
        "TVPI = (distribusi + NAV) / paid-in.",
        "dpi = dist / paid\ntvpi = (dist + nav) / paid",
      ],
      code: {
        starter: `paid, dist, nav = 100, 80, 90\n\n# TULIS KODEMU\ndpi = \ntvpi = \n\nprint(f"dpi={dpi:.1f}x  tvpi={tvpi:.1f}x")`,
        lockLines: 1,
        solution: `paid, dist, nav = 100, 80, 90\n\n# TULIS KODEMU\ndpi = dist / paid\ntvpi = (dist + nav) / paid\n\nprint(f"dpi={dpi:.1f}x  tvpi={tvpi:.1f}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "dpi", value: 0.8, tol: 1e-9, label: "`dpi` seharusnya 0.8", msg: "80/100 = 0,8x < 1 \u2192 kas belum kembali." },
          { kind: "equal", task: "t2", name: "tvpi", value: 1.7, tol: 1e-9, label: "`tvpi` seharusnya 1.7", msg: "(80+90)/100 = 1,7x — bagus di kertas." },
          { kind: "stdout_matches", task: "t2", pattern: "dpi=0\\.8x\\s+tvpi=1\\.7x", label: "`print` menampilkan keduanya", msg: "Format: dpi=...x  tvpi=...x." },
        ],
      },
      reference: "DPI = kas kembali. TVPI = DPI + RVPI. Percaya DPI, curigai RVPI.",
    },
    {
      id: "fee-drag",
      eyebrow: "Langkah 4 · Fee Drag",
      title: "2-and-20 memakan berapa?",
      prose: [
        "Gross return 12%, fee 2% + 20% carry di atas hurdle 8%. Langkah 1: setelah management fee: 12 \u2212 2 = 10%. Langkah 2: carry = 20% \u00d7 (10 \u2212 8) = 0,4%. Net = 9,6%.",
        "Fee drag = 2,4 poin (20% dari return) — harus dibayar dengan alpha. Fee adalah return yang pasti; alpha tidak. Tren modern: LP besar menuntut 1-and-10, hurdle rate, dan co-invest tanpa fee.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net`: gross 12%, mgmt 2%, hurdle 8%, carry 20% (desimal)" },
        { id: "t2", text: "Cetak sebagai persen 1 desimal" },
      ],
      expected: "net=9.6%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung carry dari gross (20% \u00d7 12%). Carry dihitung dari kelebihan di atas hurdle SETELAH management fee: 20% \u00d7 (10% \u2212 8%).",
      },
      hints: [
        "Setelah mgmt fee: gross \u2212 mgmt.",
        "Carry = 20% \u00d7 (hasil \u2212 hurdle), hanya jika positif.",
        "net = (gross - mgmt) - carry * ((gross - mgmt) - hurdle)",
      ],
      code: {
        starter: `gross, mgmt, hurdle, carry = 0.12, 0.02, 0.08, 0.20\n\n# TULIS KODEMU\nnet = \n\nprint(f"net={net*100:.1f}%")`,
        lockLines: 1,
        solution: `gross, mgmt, hurdle, carry = 0.12, 0.02, 0.08, 0.20\n\n# TULIS KODEMU\nnet = (gross - mgmt) - carry * ((gross - mgmt) - hurdle)\n\nprint(f"net={net*100:.1f}%")`,
        checks: [
          { kind: "equal", task: "t1", name: "net", value: 0.096, tol: 1e-9, label: "`net` seharusnya 0.096", msg: "(12%\u22122%) \u2212 20%\u00d7(10%\u22128%) = 9,6%. Carry dari kelebihan di atas hurdle." },
          { kind: "stdout_matches", task: "t2", pattern: "net=9\\.6%", label: "`print` menampilkan persen", msg: "Format persen: net=9.6%." },
        ],
      },
      reference: "Net = (gross \u2212 mgmt) \u2212 carry \u00d7 (kelebihan di atas hurdle). Fee pasti, alpha tidak.",
    },
    {
      id: "hf-komoditas",
      eyebrow: "Langkah 5 · Hedge Fund & Komoditas",
      title: "Kurva yang menggerogoti return",
      prose: [
        "Strategi hedge fund: long/short equity, event-driven (merger arb), relative value, macro/global. Kamu membayar 2-and-20 bukan untuk beta (itu gratis via ETF), melainkan alpha + proteksi downside. Uji: berapa return yang tidak dijelaskan pasar? Itulah yang kamu beli.",
        "Komoditas via futures: return datang dari roll yield. Contango (futures > spot \u2192 roll negatif, \u2018membayar\u2019 tiap gulir) vs backwardation (futures < spot \u2192 roll positif). Contoh: harga minyak spot naik 10% setahun, tetapi ETF futures tiap bulan roll ke kontrak 2% lebih mahal \u2192 roll drag \u2248 24%/tahun \u2192 ETF \u221214%. Spot naik, investor rugi — bukan salah ETF, tetapi salah paham instrumen.",
        "High-water mark melindungimu dari membayar dua kali untuk pemulihan yang sama: NAV 100 \u2192 120 (fee atas 20) \u2192 90 \u2192 110. HWM = 120; NAV 110 < 120 \u2192 fee tahun itu NOL, meski naik 22% dari 90. Selalu tanyakan: ada HWM? Ada hurdle?",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Aset digital: volatilitas ekstrem, korelasi tidak stabil — sizing \u2264 1\u20132% atau tolak untuk mandat konservatif. Anggap sebagai venture bet.",
      },
      quiz: [
        {
          q: "Spot minyak +10%, tetapi ETF futures \u221214%. Penjelasan?",
          options: [
            { text: "ETF rusak", why: "Salah: ETF bekerja sesuai desain — yang salah paham adalah investornya." },
            { text: "Contango: roll negatif menggerogoti return", why: "Benar: tiap roll ke kontrak lebih mahal (contango) = drag. Investasi komoditas via futures = taruhan pada kurva, bukan harga.", correct: true },
            { text: "Spot salah", why: "Salah: spot-nya benar naik 10%." },
            { text: "Tidak mungkin", why: "Salah: sangat mungkin — inilah roll drag." },
          ],
        },
      ],
      reference: "Komoditas via futures = taruhan pada kurva. Cek contango/backwardation dulu.",
    },
    {
      id: "due-diligence",
      eyebrow: "Langkah 6 · Due Diligence",
      title: "Checklist sebelum mengunci uang 10 tahun",
      prose: [
        "Checklist due diligence sebelum commit ke fund alternatif. (1) Track record per vintage — bukan IRR gabungan; satu vintage hebat bisa menutupi tiga vintage yang biasa-biasa saja, dan kondisi pasar tiap vintage berbeda. (2) Key-man clause — jika dua partner kunci keluar, kamu berhak menghentikan capital call; tanpa ini kamu terkunci pada tim yang sudah berganti. (3) Valuation policy tertulis — siapa yang meng-appraisal NAV, seberapa sering, dengan metodologi apa; “trust me” bukan metodologi. (4) Fee & alignment — hurdle rate, high-water mark, dan co-invest GP minimal 1–2%: uang manajer ikut dipertaruhkan di fund yang sama.",
        "Uji fee drag vs illiquidity premium dengan angka. Fund menjanjikan gross 14%, fee 2-and-20 dengan hurdle 8%: net ≈ (14 − 2) − 20% × (12 − 8) = 11,2%. Saham publik memberimu 9% dengan likuiditas penuh. Premi illikuiditas net = 2,2% — di bawah kompensasi wajar 3–4% untuk lock-up 10 tahun. Keputusan: tolak, kecuali fee dinegosiasi ke 1-and-10 → net ≈ (14 − 1) − 10% × (13 − 8) = 12,5% → premi 3,5% dan layak dipertimbangkan. Negosiasi fee sering memberi return lebih pasti daripada memilih manajer “terbaik”.",
        "Lock-up risk dan aturan sizing. Pasar sekunder untuk posisi PE ada, tetapi tipikalnya diskon 10–20% dari NAV — itu “biaya keluar darurat” yang harus kamu masukkan ke perhitungan. Aturan praktis: maksimal 15–20% portofolio di aset illikuid, dan semuanya dari “uang dingin” yang tidak dibutuhkan 10 tahun. Dana darurat, uang sekolah anak, modal usaha = dilarang dikunci, seberapa pun menarik pitch-nya. Bu Lina yang butuh Rp500 juta di tahun ke-7 dengan DPI 0,8x adalah contoh yang bisa diprediksi — dan dicegah — sejak hari pertama.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: di alternatif, yang pasti hanya fee-nya",
        body: "Heuristik LP berpengalaman: fee adalah return yang pasti, alpha tidak — jadi negosiasi fee (1-and-10, hurdle rate, co-invest tanpa fee) sering memberi return lebih pasti daripada berburu manajer “terbaik”. Kedua: jangan pernah mengunci uang yang mungkin kamu butuhkan — dana darurat di PE dengan DPI 0,3x adalah bencana yang bisa diprediksi; aturan praktisnya maksimal 15–20% portofolio di aset illikuid, dan itu pun dari uang dingin. Ketiga: curigai volatilitas yang terlalu tenang — NAV appraisal kuartalan membuat PE terlihat kalem di atas kertas; risiko sebenarnya muncul sekaligus saat likuiditas dibutuhkan (markdown 30–40% dalam satu kuartal krisis bukan hal aneh). Terakhir: vintage diversification — dana 2021 dan dana 2023 adalah dua dunia berbeda; jangan menilai manajer dari satu vintage, seperti jangan menilai nelayan dari satu kali melaut. Satu lagi: waktu terbaik menegosiasi fee adalah sebelum commit — setelah dana terkunci 10 tahun, daya tawarmu nol. Minta side letter untuk hurdle rate dan co-invest di awal; LP yang diam di awal membayar paling mahal di akhir.",
      },
      quiz: [
        {
          q: "Fund: gross 14%, fee 2-and-20, hurdle 8%. Saham publik 9%. Layak dikunci 10 tahun?",
          options: [
            { text: "Ya — gross 14% > 9%", why: "Salah: yang diterima investor adalah net, bukan gross. Gross 14% menyusut jadi 11,2% setelah fee." },
            { text: "Tidak — net 11,2%, premi illikuiditas cuma 2,2% (< 3–4% wajar)", why: "Benar: (14−2) − 20%×(12−8) = 11,2%. Premi 2,2% tidak cukup membayar lock-up 10 tahun.", correct: true },
            { text: "Ya — TVPI pasti tinggi", why: "Salah: TVPI mengandung RVPI (janji kertas appraisal); keputusan memakai net IRR vs alternatif likuid." },
            { text: "Tidak bisa dinilai tanpa DPI", why: "Salah: untuk keputusan alokasi prospektif, yang dibandingkan adalah ekspektasi net vs premi wajar." },
          ],
        },
      ],
      reference: "DD: vintage, key-man, valuation policy, fee & co-invest. Premi illikuiditas wajar 3–4% net. Maks 15–20% portofolio.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: layak mengunci uang 10 tahun?",
      prose: [
        "Skenario 1 — Fund pamer 'modal 3x lipat'. → Annualize jadi IRR: 3x dalam 10 tahun = 11,6%. Bandingkan dengan alternatif likuid (2x dalam 6 tahun = 12,2%) — multiple tanpa waktu = angka pemasaran.",
        "Skenario 2 — Menilai fund private equity. → Percaya DPI (kas yang benar-benar kembali), curigai RVPI (appraisal manajer sendiri). DPI < 1 = belum balik modal kas, seindah apa pun TVPI-nya.",
        "Skenario 3 — Menghitung fee 2-and-20. → Kurangi management fee dulu, lalu carry 20% di atas hurdle. Fee drag ~2–4 poin = return pasti yang harus dibayar dengan alpha yang tidak pasti.",
        "Skenario 4 — Memutuskan alokasi ke alternatif. → Tuntut illiquidity premium 3–4% di atas saham publik. Tidak sampai? Tolak — atau negosiasi ke 1-and-10.",
        "Skenario 5 — Investasi komoditas via futures. → Pahami roll yield: contango (futures > spot) menggerogoti return tiap gulir; backwardation menambah. Spot naik ≠ investor untung.",
        "Aturan praktis 10 detik: klaim multiple → IRR; fund PE → DPI; fee → hitung net; lock-up → minta premi 3–4%; komoditas → cek roll.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira volatilitas rendah dana alternatif = risiko rendah. Itu appraisal smoothing — valuasi yang jarang di-mark-to-market. Risiko likuiditasnya justru paling besar tepat saat kamu butuh dana darurat, seperti Bu Lina di tahun ke-7.",
      },
    },
    {
      id: "minicase-lina",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Biaya tersembunyi Bu Lina",
      prose: [
        "Bu Lina: PE 3x dalam 10 tahun (IRR 11,6%, illikuid, fee 2-and-20) vs teman: saham 2x dalam 6 tahun (IRR 12,2%, likuid). Di tahun ke-7, Bu Lina butuh dana darurat Rp500jt untuk berobat — tetapi modalnya terkunci. Fund melaporkan TVPI 1,7x, DPI 0,8x.",
        "Tiga biaya tersembunyi: (1) illikuiditas 10 tahun (tidak bisa rebalance/jual darurat); (2) fee drag (~2\u20134 poin); (3) appraisal smoothing (risiko tampak kecil). DPI 0,8x = dari Rp1M yang disetor, baru Rp800jt kembali sebagai kas.",
        "Secondary market bisa membantu: jual posisi PE di pasar sekunder — biasanya diskon 10\u201320% dari NAV. Rp900jt NAV \u2192 terima \u2248 Rp750jt. PE tetap layak jika: IRR net > saham + 3\u20134% (illiquidity premium), dana darurat terpisah sudah aman, vintage terdiversifikasi, dan fee dinegosiasi. Aturan: maksimal 15\u201320% portofolio di illikuid.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Denominator effect: target 10% PE; krisis membuat saham \u221240% tetapi PE (appraisal lambat) \u22125% \u2192 bobot PE melonjak ke 15% dan tidak bisa dijual. Target alokasi alternatif harus lebih rendah dari nyaman.",
      },
      reference: "PE layak jika IRR net > saham + premium, dana darurat aman, fee dinegosiasi.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: IRR, DPI, fee, contango, dan J-curve.",
      ],
      tasks: [],
      quiz: [
        {
          q: "PE: 3x dalam 10 tahun. IRR?",
          options: [
            { text: "30%", why: "Salah: itu 3x dibagi 10 — multiple tidak bisa dirata-rata linear." },
            { text: "11,6%", why: "Benar: 3^(1/10)\u22121 = 11,6%. \u201c3x\u201d tanpa waktu menipu — selalu annualize.", correct: true },
            { text: "20%", why: "Salah: tidak ada dasarnya." },
            { text: "3%", why: "Salah: cek rumus IRR = multiple^(1/T) \u2212 1." },
          ],
        },
        {
          q: "Paid-in 100, distribusi 40, NAV sisa 160. DPI & TVPI?",
          options: [
            { text: "DPI 2,0x", why: "Salah: itu TVPI (40+160)/100 — bukan DPI." },
            { text: "DPI 0,4x, TVPI 2,0x", why: "Benar: DPI = 40/100 = 0,4x (kas baru 40% kembali); TVPI = (40+160)/100 = 2,0x. Marketing pamer TVPI; analis tanya DPI.", correct: true },
            { text: "DPI 1,6x", why: "Salah: itu RVPI (160/100) — \u201cjanji kertas\u201d, bukan kas." },
            { text: "TVPI 0,4x", why: "Salah: tertukar — 0,4x adalah DPI." },
          ],
        },
        {
          q: "Gross 12%, fee 2-and-20, hurdle 8%. Net?",
          options: [
            { text: "10%", why: "Salah: itu setelah management fee saja — belum dikurangi carry." },
            { text: "\u2248 9,6%", why: "Benar: (12%\u22122%) = 10%; carry = (10%\u22128%)\u00d720% = 0,4% \u2192 net 9,6%. Fee memakan 2,4 poin.", correct: true },
            { text: "12%", why: "Salah: itu gross — fee belum dikurangkan." },
            { text: "8%", why: "Salah: itu hurdle-nya, bukan net." },
          ],
        },
        {
          q: "J-curve PE: tahun 1\u20133 negatif. Artinya?",
          options: [
            { text: "Fund gagal", why: "Salah: jangan nilai fund umur < 4 tahun dari IRR-nya." },
            { text: "Normal: capital call + fee dulu, exit belakangan", why: "Benar: J-curve = pola sehat PE. Syarat: modal memang dingin 10 tahun.", correct: true },
            { text: "Harus jual", why: "Salah: menjual di lembah J = merealisasi kerugian pola normal." },
            { text: "Appraisal salah", why: "Salah: J-curve soal arus kas, bukan appraisal." },
          ],
        },
        {
          q: "Fund: called Rp100M, distributed Rp80M, NAV Rp90M. DPI dan artinya?",
          options: [
            { text: "DPI 1,7x — sudah untung besar", why: "Salah: 1,7x adalah TVPI, bukan DPI." },
            { text: "DPI 0,8x — belum balik modal kas (TVPI 1,7x itu \u2018kertas\u2019)", why: "Benar: DPI = 80/100 = 0,8x < 1 \u2192 kas belum kembali. Percaya DPI, curigai RVPI.", correct: true },
            { text: "DPI 0,9x — impas", why: "Salah: 0,9x adalah RVPI (90/100)." },
            { text: "Tidak bisa dihitung tanpa IRR", why: "Salah: DPI tidak butuh IRR — cukup distribusi/paid-in." },
          ],
        },
      ],
      summary: [
        "Annualize multiple (IRR): \u201c3x\u201d tanpa waktu = pemasaran.",
        "DPI > TVPI dalam perhatian: kas > janji. Percaya DPI, curigai RVPI.",
        "Fee harus dibayar dengan alpha: 2-and-20 memakan ~20% return.",
        "Komoditas via futures: cek kurva (contango/backwardation) dulu.",
        "Tuntut illiquidity premium 3\u20134% di atas publik; maksimal 15\u201320% portofolio di illikuid.",
      ],
      next: { label: "PM-A10 — Portfolio Management: Diversifikasi, CAPM & IPS", href: "/learn/pm-a10-portfolio-mgmt" },
    },
  ],
};
