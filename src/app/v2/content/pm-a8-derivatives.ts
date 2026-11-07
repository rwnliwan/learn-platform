import type { V2Lesson } from "../lib/types";

const PAYOFF_SVG = `<svg viewBox="0 0 520 250" role="img" aria-label="Payoff long call dan long put saat jatuh tempo: call naik setelah strike 100, put turun sebelum strike 100.">
<text x="260" y="18" font-size="12" fill="var(--text)" font-family="var(--font-ui)" text-anchor="middle" font-weight="600">Payoff opsi saat jatuh tempo (X = 100)</text>
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="20" x2="500" y2="20"/><line x1="60" y1="70" x2="500" y2="70"/><line x1="60" y1="120" x2="500" y2="120"/><line x1="60" y1="170" x2="500" y2="170"/><line x1="60" y1="220" x2="500" y2="220"/></g>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="24">40</text><text x="54" y="74">30</text><text x="54" y="124">20</text><text x="54" y="174">10</text><text x="54" y="224">0</text></g>
<text x="28" y="120" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle" transform="rotate(-90 28 120)">payoff</text>
<g fill="var(--chart-text)" font-size="10" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="240">60</text><text x="170" y="240">80</text><text x="280" y="240">100</text><text x="390" y="240">120</text><text x="500" y="240">140</text></g>
<line x1="280" y1="20" x2="280" y2="220" stroke="var(--chart-text)" stroke-width="1.5" stroke-dasharray="6,4"/>
<text x="286" y="32" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">strike X = 100</text>
<polyline points="60,220 280,220 500,20" fill="none" stroke="var(--c1)" stroke-width="2.5"/>
<polyline points="60,20 280,220 500,220" fill="none" stroke="var(--c2)" stroke-width="2.5"/>
<text x="446" y="68" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)">long call</text>
<text x="114" y="66" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="end">long put</text>
<text x="280" y="252" font-size="10" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">harga underlying S →</text>
</svg>`;

export const pma8: V2Lesson = {
  slug: "pm-a8-derivatives",
  track: "Portfolio Management",
  module: "CFA",
  title: "PM-A8 Derivatives: Forward, Swap & Opsi",
  estMinutes: 65,
  steps: [
    {
      id: "forward",
      eyebrow: "Langkah 1 · Forward & Futures",
      title: "Tidak hedging = spekulasi",
      prose: [
        "PT KopiNusa mengekspor kopi senilai USD 1 juta, dibayar 3 bulan lagi. Direktur keuangan \u201cbermain aman\u201d: tidak hedging — \u201ckan rupiah biasanya melemah, malah untung.\u201d Tiga bulan kemudian rupiah menguat 8% — pendapatan susut Rp1,3 miliar.",
        "Twist-nya: tidak hedging = keputusan spekulasi. Ia bertaruh rupiah melemah — tanpa premi, tanpa analisis, tanpa mandat. \u201cBermain aman\u201d yang sebenarnya = mengunci kurs via forward: biaya diketahui, tidur nyenyak. Derivatif bukan alat judi; tidak memakainya pun adalah posisi.",
        "Forward: kontrak custom (OTC) beli/jual aset di masa depan pada harga yang disepakati kini. No-arbitrage: F = S(1+r)^T. Futures: forward yang terstandar di bursa + marking to market harian \u2192 risiko kredit kecil. Forward = janji; futures = janji yang diawasi.",
      ],
      formula: String.raw`F = S(1+r)^T`,
      formulaNote: "F = harga forward; S = harga spot aset; r = suku bunga bebas risiko domestik; T = tenor dalam tahun. Interpretasi: F adalah harga “adil” tanpa arbitrase — BUKAN prediksi harga masa depan; ia hanya mencerminkan cost of carry. Contoh angka: S Rp16.000, r 6%, T 0,25 tahun → F = 16.000 × 1,06^0,25 ≈ Rp16.238. (Untuk FX dipakai selisih dua suku bunga — lihat rumus berikutnya.)",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201cHedging menghilangkan risiko\u201d — salah. Hedging menukar satu risiko dengan lainnya: forward menghilangkan risiko harga tetapi menciptakan opportunity cost (melepas upside) + counterparty risk. Tidak ada makan siang gratis.",
      },
      reference: "Forward = custom OTC. Futures = standar + margin harian. Tidak hedge = spekulasi.",
    },
    {
      id: "forward-harga",
      eyebrow: "Langkah 2 · Harga Forward",
      title: "Kunci kurs KopiNusa",
      prose: [
        "S = Rp16.000/USD, r_IDR = 6%, r_USD = 5%, T = 0,25 tahun. Forward FX memakai selisih dua suku bunga: F = 16.000 \u00d7 (1,06/1,05)^0,25 \u2248 Rp16.038.",
        "KopiNusa mengunci Rp16,038M untuk USD 1jt. Rupiah menguat ke 15.000? Tidak peduli — Rp16,038M pasti. Melemah ke 17.000? Juga Rp16,038M. Hedging = melepas upside demi kepastian.",
      ],
      formula: String.raw`F = S \times \left(\frac{1+r_d}{1+r_f}\right)^T`,
      formulaNote: "S = kurs spot (Rp16.000/USD); r_d = suku bunga domestik/IDR (6%); r_f = suku bunga asing/USD (5%); T = tenor tahun (0,25 = 3 bulan). Interpretasi: forward FX dikendalikan selisih suku bunga — negara berbunga lebih tinggi “harus” terdepresiasi forward-nya, atau muncul arbitrase. Contoh angka: 16.000 × ((1,06)/(1,05))^0,25 ≈ Rp16.038 — kurs yang dikunci KopiNusa.",
      tasks: [
        { id: "t1", text: "Hitung `fwd` forward 3 bulan (S=16000, r_IDR=6%, r_USD=5%)" },
        { id: "t2", text: "Cetak hasilnya (bulatkan)" },
      ],
      expected: "fwd=16038",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai satu rate (1,06^0,25) untuk FX forward. FX memakai rasio dua suku bunga: (1+r_d)/(1+r_f). Satu rate hanya untuk forward aset domestik.",
      },
      hints: [
        "Rumus FX: F = S \u00d7 ((1+r_d)/(1+r_f))^T.",
        "T = 0,25 untuk 3 bulan.",
        "fwd = s * ((1 + r_idr)/(1 + r_usd))**t",
      ],
      code: {
        starter: `s, r_idr, r_usd, t = 16000, 0.06, 0.05, 0.25\n\n# TULIS KODEMU\nfwd = \n\nprint(f"fwd={fwd:.0f}")`,
        lockLines: 1,
        solution: `s, r_idr, r_usd, t = 16000, 0.06, 0.05, 0.25\n\n# TULIS KODEMU\nfwd = s * ((1 + r_idr)/(1 + r_usd))**t\n\nprint(f"fwd={fwd:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "fwd", value: 16038, tol: 2, label: "`fwd` sekitar 16038", msg: "16.000 \u00d7 (1,06/1,05)^0,25 = 16.038. FX memakai selisih dua suku bunga." },
          { kind: "stdout_matches", task: "t2", pattern: "fwd=16038", label: "`print` menampilkan fwd", msg: "Format: fwd=... ." },
        ],
      },
      quiz: [
        {
          q: "Forward USD/IDR 1 tahun yang FAIR baru dibuat. Nilainya saat ini?",
          options: [
            { text: "Positif — pembeli selalu untung", why: "Salah: forward fair dirancang PV = 0 — tidak ada pihak yang \u201cuntung duluan\u201d." },
            { text: "Nol — forward fair dirancang PV=0 saat inisiasi", why: "Benar: nilai menjadi non-nol SETELAH pasar bergerak. Ini konsep yang paling sering menjebak di ujian derivatif.", correct: true },
            { text: "Negatif — penjual selalu untung", why: "Salah: kebalikan dari opsi pertama — keduanya salah." },
            { text: "Tidak bisa ditentukan", why: "Salah: justru bisa ditentukan — nol, karena fair." },
          ],
        },
      ],
      reference: "Forward FX = S \u00d7 ((1+r_d)/(1+r_f))^T. Nilai fair saat inisiasi = 0.",
    },
    {
      id: "swap",
      eyebrow: "Langkah 3 · Swap",
      title: "Tukar langganan bunga",
      prose: [
        "Interest rate swap (plain vanilla): tukar bunga tetap \u2194 mengambang atas notional yang sama — notional tidak dipertukarkan. Pihak bayar-fixed = \u2018membeli kepastian\u2019; bayar-floating = bertaruh rate turun.",
        "SinarAbadi: utang Rp400M floating (JIBOR+2%). Takut rate naik \u2192 swap: bayar fixed 8%, terima floating. Net: bayar ke bank (JIBOR+2%), terima dari swap (JIBOR), bayar ke swap (8%) \u2192 net = 10% fixed. Biaya bunga terkunci Rp40M/tahun. JIBOR naik ke 9%? Tetap bayar 10%. Turun ke 3%? Tetap 10% — kepastian ada harganya (upside dilepas).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `net`: bayar fixed 8%, utang JIBOR+2%, terima JIBOR (desimal)" },
        { id: "t2", text: "Cetak sebagai persen" },
      ],
      expected: "net=10%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Mengira notional dipertukarkan. Notional hanya dasar perhitungan bunga — yang berpindah hanya selisih arus bunga.",
      },
      hints: [
        "Net = fixed yang dibayar + spread utang.",
        "JIBOR yang dibayar ke bank dan diterima dari swap saling hapus.",
        "net = fixed + jibor_spread",
      ],
      code: {
        starter: `jibor_spread, fixed = 0.02, 0.08\n\n# TULIS KODEMU: net fixed yang dibayar (desimal)\nnet = \n\nprint(f"net={net:.0%}")`,
        lockLines: 1,
        solution: `jibor_spread, fixed = 0.02, 0.08\n\n# TULIS KODEMU: net fixed yang dibayar (desimal)\nnet = fixed + jibor_spread\n\nprint(f"net={net:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "net", value: 0.1, tol: 1e-9, label: "`net` seharusnya 0.10", msg: "8% + 2% = 10% fixed. JIBOR bayar dan terima saling meniadakan." },
          { kind: "stdout_matches", task: "t2", pattern: "net=10%", label: "`print` menampilkan persen", msg: "Format persen: net=10%." },
        ],
      },
      reference: "Swap = tukar fixed \u2194 floating. Notional tidak berpindah. Nilai fair awal = 0.",
    },
    {
      id: "opsi-payoff",
      eyebrow: "Langkah 4 · Payoff Opsi + chart",
      title: "Hak, bukan kewajiban — bentuk hoki",
      prose: [
        "Call = hak beli di strike X (untung jika S > X). Put = hak jual di X (untung jika S < X). Payoff call = max(S\u2212X, 0); put = max(X\u2212S, 0). Nilai opsi = intrinsic (payoff kini) + time value (peluang masa depan; \u2192 0 saat expiry).",
        "Contoh: beli put strike 100, premi 5. Harga jatuh tempo 80 \u2192 payoff = 100\u221280 = 20; P/L = 20 \u2212 5 = +15. (Tanpa put, pemegang saham rugi 20.) Bentuk \u201choki\u201d ini = esensi opsi: potong ekor kiri, biarkan ekor kanan.",
        "Cara membaca: sumbu X = harga underlying S saat jatuh tempo, sumbu Y = payoff; garis putus-putus vertikal = strike X = 100; dua garis patah membentuk hoki.",
        "Interpretasi: long call datar nol sampai S=100 lalu naik 1-untuk-1; long put sebaliknya. Contoh teks terbaca di sini: put X=100 saat S=80 memberi payoff 20 (baca titik S=80 di garis put). Ingat jebakan teks: payoff 20 bukan profit — kurangi premi 5 menjadi 15.",
      ],
      figure: {
        svg: PAYOFF_SVG,
        alt: "Payoff long call dan long put saat jatuh tempo: call naik setelah strike 100, put turun sebelum strike 100.",
        caption: "Bentuk hoki = esensi opsi: rugi pembeli terbatas pada premi, upside terbuka. Garis hanya menunjukkan payoff — P/L pembeli = payoff dikurangi premi.",
      },
      formula: String.raw`\text{Call} = \max(S-X, 0) \quad;\quad \text{Put} = \max(X-S, 0)`,
      formulaNote: "S = harga aset saat expiry; X = strike price. Interpretasi: bentuk “hoki” — call hanya bernilai jika S > X, put hanya jika S < X; selain itu nol. Inilah esensi opsi: rugi pembeli terbatas pada premi, upside terbuka. Contoh angka: put X = 100, premi 5, S jatuh tempo 80 → payoff = max(100 − 80, 0) = 20; P/L pembeli = 20 − 5 = +15.",
      tasks: [
        { id: "t1", text: "Hitung `payoff` put (X=100) saat harga 80" },
        { id: "t2", text: "Hitung `pnl` (kurangi premi 5), cetak keduanya" },
      ],
      expected: "payoff=20  pnl=15",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Lupa mengurangi premi. Payoff 20 \u2260 profit 15. Premi adalah harga asuransi — selalu dikurangkan dari payoff pembeli.",
      },
      hints: [
        "Payoff put = max(X \u2212 harga, 0).",
        "P/L pembeli = payoff \u2212 premi.",
        "payoff = max(x - s_t, 0)\npnl = payoff - premi",
      ],
      code: {
        starter: `x, premi, s_t = 100, 5, 80\n\n# TULIS KODEMU\npayoff = \npnl = \n\nprint(f"payoff={payoff}  pnl={pnl}")`,
        lockLines: 1,
        solution: `x, premi, s_t = 100, 5, 80\n\n# TULIS KODEMU\npayoff = max(x - s_t, 0)\npnl = payoff - premi\n\nprint(f"payoff={payoff}  pnl={pnl}")`,
        checks: [
          { kind: "equal", task: "t1", name: "payoff", value: 20, tol: 1e-9, label: "`payoff` seharusnya 20", msg: "max(100\u221280, 0) = 20." },
          { kind: "equal", task: "t2", name: "pnl", value: 15, tol: 1e-9, label: "`pnl` seharusnya 15", msg: "20 \u2212 5 = 15. Premi selalu dikurangkan." },
          { kind: "stdout_matches", task: "t2", pattern: "payoff=20\\s+pnl=15", label: "`print` menampilkan keduanya", msg: "Format: payoff=...  pnl=... ." },
        ],
      },
      reference: "Payoff put = max(X\u2212S, 0). Profit = payoff \u2212 premi.",
    },
    {
      id: "parity",
      eyebrow: "Langkah 5 · Put-Call Parity",
      title: "Satu persamaan mengikat semuanya",
      prose: [
        "Put-call parity (opsi Eropa): C + PV(X) = P + S. Jika dilanggar \u2192 arbitrase: jual sisi mahal, beli sisi murah.",
        "Contoh: C = 11,90, S = 100, X = 100, r = 5%, T = 1. PV(X) = 100/1,05 = 95,24. P = 11,90 \u2212 100 + 95,24 = 7,14. Cek: 11,90 + 95,24 = 107,14 = 7,14 + 100. Parity terpenuhi — tidak ada arbitrase.",
      ],
      formula: String.raw`C + \frac{X}{(1+r)^T} = P + S`,
      formulaNote: "C/P = harga call/put Eropa; X = strike; r = suku bunga; T = tenor; S = harga saham kini. Interpretasi: persamaan no-arbitrage — portofolio “call + kas” harus sama nilainya dengan “put + saham”; pelanggaran berarti mesin uang sesaat (jual sisi mahal, beli sisi murah). Berlaku hanya untuk opsi Eropa (tanpa early exercise). Contoh angka: C 11,90, S = X = 100, r 5%, T 1 → P = 11,90 − 100 + 100/1,05 = 7,14.",
      tasks: [
        { id: "t1", text: "Hitung `pvx` dan `put` dari parity (C=11.90, S=X=100, r=5%, T=1)" },
        { id: "t2", text: "Hitung `selisih` = |kiri \u2212 kanan|, cetak put 2 desimal dan selisih" },
      ],
      expected: "put=7.14  selisih=0.0000",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Memakai parity untuk opsi Amerika. Parity hanya berlaku untuk Eropa (tanpa early exercise). Untuk Amerika, yang berlaku adalah batas-batas ketidaksamaan.",
      },
      hints: [
        "Dari C + PV(X) = P + S, selesaikan P = C \u2212 S + PV(X).",
        "PV(X) = X / (1+r)^T.",
        "pvx = x / (1+r)**t\nput = call - s + pvx",
      ],
      code: {
        starter: `s, x, r, t, call = 100, 100, 0.05, 1, 11.90\n\n# TULIS KODEMU\npvx = \nput = \nkiri = call + pvx\nkanan = put + s\n\nprint(f"put={put:.2f}  selisih={abs(kiri-kanan):.4f}")`,
        lockLines: 1,
        solution: `s, x, r, t, call = 100, 100, 0.05, 1, 11.90\n\n# TULIS KODEMU\npvx = x / (1+r)**t\nput = call - s + pvx\nkiri = call + pvx\nkanan = put + s\n\nprint(f"put={put:.2f}  selisih={abs(kiri-kanan):.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "put", value: 7.14, tol: 0.01, label: "`put` sekitar 7.14", msg: "11,90 \u2212 100 + 95,24 = 7,14." },
          { kind: "stdout_matches", task: "t2", pattern: "put=7\\.14\\s+selisih=0\\.0000", label: "Parity terpenuhi (selisih 0)", msg: "Jika selisih \u2260 0, ada arbitrase: jual sisi mahal, beli sisi murah." },
        ],
      },
      reference: "Parity (Eropa): C + PV(X) = P + S. Pelanggaran = arbitrase.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: derivatif untuk lindung nilai atau spekulasi",
      prose: [
        "Skenario 1 — Eksposur mata uang sudah pasti (piutang USD terjadi). → Kunci dengan forward: biaya diketahui, tidur nyenyak. Tidak butuh upside — jangan bayar premi opsi.",
        "Skenario 2 — Eksposur belum pasti volumenya. → Opsi (put) lebih cocok: bayar premi, lindungi downside, simpan upside.",
        "Skenario 3 — Utang floating, takut suku bunga naik. → Interest rate swap: bayar fixed, terima floating — net terkunci. Kepastian ada harganya: upside dilepas.",
        "Skenario 4 — Ingin proteksi ekor kiri tetapi tetap ikut naik. → Beli put: payoff = max(X−S, 0) — potong ekor kiri, biarkan ekor kanan. Premi = harga bentuk 'hoki' ini.",
        "Skenario 5 — Harga opsi terlihat 'aneh'. → Cek put-call parity: C + PV(X) = P + S. Pelanggaran = mispricing, atau ekspektasi dividen / biaya pinjam saham yang salah.",
        "Aturan praktis 10 detik: eksposur pasti → forward; belum pasti → opsi; takut rate naik → swap; proteksi + upside → put; harga aneh → parity.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "'Tidak hedging = bermain aman.' Justru sebaliknya: tidak hedging adalah keputusan spekulasi — bertaruh rupiah melemah tanpa premi, tanpa analisis, tanpa mandat. KopiNusa membayar Rp1,3 miliar untuk pelajaran ini.",
      },
    },
    {
      id: "minicase-kopinusa",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kebijakan treasury yang mendamaikan",
      prose: [
        "KopiNusa: piutang USD 1jt/3 bulan, tidak hedging (\u201crupiah biasanya melemah\u201d). Rupiah menguat 8% \u2192 rugi Rp1,3M. Dewan terbelah: kubu A \u201chedging itu mahal & ribet\u201d, kubu B \u201cwajib hedge 100%\u201d.",
        "Rancangannya: jual USD 1jt forward @ ~Rp16.038 \u2192 terima Rp16,038M pasti. Bandingkan dengan put USD/IDR: bayar premi \u2248 1,5\u20132% (Rp240\u2013320jt) \u2192 lindungi downside tetapi simpan upside. Untuk piutang pasti (sudah terjadi) \u2192 forward lebih tepat; tidak butuh upside — piutangnya fixed.",
        "Kebijakan ideal: (1) eksposur > Rp5M dan > 1 bulan \u2192 wajib hedge minimal 50% via forward; (2) hedge ratio ditentukan komite, bukan individu; (3) review kuartalan: biaya hedge vs volatilitas yang dihindari. Kubu A puas (eksposur kecil tidak di-hedge), kubu B puas (eksposur besar terlindungi) — dan tidak ada lagi keputusan dadakan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Uji hedge vs spekulasi: jika harga bergerak menguntungkanmu, apakah posisi derivatifmu rugi? Jika ya \u2192 hedge (seimbang). Jika ikut untung \u2192 kamu doubling down, bukan hedging. Hedge melebihi eksposur = spekulasi.",
      },
      reference: "Forward untuk eksposur pasti; opsi untuk eksposur tidak pasti. Hedge ratio by policy.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran: forward, futures, opsi, parity, dan swap.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: hedge yang membuatmu ikut untung bukan hedge",
        body: "Uji hedge 10 detik: jika harga bergerak menguntungkanmu dan posisi derivatifmu ikut untung, itu bukan lindung nilai — itu taruhan ganda. Hedge sejati terasa membosankan dan sedikit menyebalkan: kamu melepas upside demi tidur nyenyak, seperti KopiNusa yang mengunci Rp16.038 dan merelakan potensi Rp17.000. Dua jebakan praktis. Satu: basis risk — futures yang kamu pakai tidak identik dengan eksposurmu (beda tenor, beda grade, beda lokasi); hedge 90% dengan basis yang liar bisa lebih berisiko daripada tidak hedge sama sekali — ukur dulu korelasi keduanya sebelum mengunci. Dua: counterparty risk — forward OTC adalah janji di atas kertas; di krisis 2008, janji-janji itulah yang pertama ingkar. Untuk eksposur besar dan berjangka panjang, bayar sedikit lebih mahal untuk kontrak bursa dengan margin harian daripada mengandalkan “hubungan baik”. Dan ingat simetrinya: tidak hedging adalah keputusan — catat alasannya tertulis seperti kamu mencatat alasan hedging, atau “keputusan” itu sebenarnya cuma kemalasan. Ketiga: ketidaksempurnaan hedge menciptakan volatilitas laporan keuangan — dokumentasikan hubungan lindung nilai sejak awal, atau fluktuasi mark-to-market derivatifmu akan mengacak-acak laba rugi. Hedge yang baik secara ekonomi bisa terlihat buruk secara akuntansi tanpa dokumentasi yang rapi.",
      },
      quiz: [
        {
          q: "S=16.000, r=6%, T=0,25. Harga forward wajar?",
          options: [
            { text: "16.000", why: "Salah: forward \u2260 spot kecuali r = 0." },
            { text: "\u2248 16.238", why: "Benar: 16.000\u00d71,06^0,25. (Untuk FX pakai selisih dua suku bunga — di sini disederhanakan satu rate.)", correct: true },
            { text: "15.800", why: "Salah: itu di bawah spot — tidak ada dasarnya." },
            { text: "17.000", why: "Salah: terlalu tinggi; hitung 16.000\u00d71,06^0,25." },
          ],
        },
        {
          q: "Bedakan forward vs futures.",
          options: [
            { text: "Sama saja", why: "Salah: mekanisme settlement dan risikonya berbeda." },
            { text: "Futures: terstandar di bursa + marking to market harian", why: "Benar: futures = forward versi bursa: standar + settlement harian \u2192 risiko kredit kecil. Forward = custom OTC, risiko counterparty.", correct: true },
            { text: "Forward diperdagangkan di bursa", why: "Salah: forward = OTC, futures = bursa." },
            { text: "Futures tidak ada risiko", why: "Salah: risiko harga tetap ada; yang kecil adalah risiko kredit." },
          ],
        },
        {
          q: "Beli put X=9.000 premi 300, saham jatuh ke 7.000. Net (pegang saham)?",
          options: [
            { text: "\u22123.000", why: "Salah: itu rugi saham tanpa put — put mengurangi kerugian." },
            { text: "\u22121.300 (asuransi bekerja)", why: "Benar: saham \u22123.000, put payoff +2.000, premi \u2212300 \u2192 net \u22121.300.", correct: true },
            { text: "+1.700", why: "Salah: itu jika tidak pegang saham (payoff 2.000 \u2212 premi 300)." },
            { text: "\u2212300", why: "Salah: itu cuma premi — lupakan rugi sahamnya." },
          ],
        },
        {
          q: "Put-call parity dilanggar (C+PV(X) > P+S). Tindakan?",
          options: [
            { text: "Diam", why: "Salah: pelanggaran parity = peluang arbitrase yang hilang dalam menit." },
            { text: "Arbitrase: jual sisi mahal, beli sisi murah", why: "Benar: parity = hubungan no-arbitrage. Jual call+kas (mahal), beli put+saham (murah).", correct: true },
            { text: "Beli keduanya", why: "Salah: membeli kedua sisi tidak mengeksploitasi mispricing." },
            { text: "Jual keduanya", why: "Salah: menjual kedua sisi juga tidak mengeksploitasi selisihnya." },
          ],
        },
        {
          q: "Perusahaan utang floating takut suku bunga naik. Solusi?",
          options: [
            { text: "Biarkan", why: "Salah: itu = spekulasi rate tidak naik." },
            { text: "IRS: bayar fixed, terima floating", why: "Benar: swap mengubah floating \u2192 fixed, mengunci biaya bunga. Seperti forward, tetapi untuk suku bunga.", correct: true },
            { text: "Beli call", why: "Salah: call = hak beli aset — tidak mengunci biaya bunga utang." },
            { text: "Jual saham", why: "Salah: tidak relevan dengan risiko suku bunga utang." },
          ],
        },
      ],
      summary: [
        "Forward: F = S(1+r)^T; custom OTC. Futures: standar + marking to market.",
        "Swap: tukar fixed \u2194 floating; notional tidak berpindah; nilai fair awal = 0.",
        "Opsi: call = hak beli, put = hak jual; payoff hockey stick; nilai = intrinsic + time.",
        "Put-call parity (Eropa): C + PV(X) = P + S.",
        "Tidak hedging = spekulasi — keputusan pasif tetap keputusan.",
      ],
      next: { label: "PM-A8B — Derivatives: Harga Opsi, Greeks & Strategi", href: "/v2/learn/pm-a8b-harga-opsi" },
    },
  ],
};
