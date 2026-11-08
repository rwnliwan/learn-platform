import type { V2Lesson } from "../lib/types";

export const e10: V2Lesson = {
  slug: "e10-derivatif",
  track: "Financial Markets",
  module: "Derivatif",
  title: "E10. Forward, Futures & Opsi",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-pak-tani",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Pak Tani dan harga beras: forward paling purba",
      prose: [
        "Pak Tani akan panen 10 ton beras 3 bulan lagi. Harga hari ini Rp12.000/kg — tapi 3 bulan lagi bisa Rp10.000 (banjir panen) atau Rp15.000 (gagal panen). Seorang pedagang menawar: “Saya beli 10 ton hasil panenmu 3 bulan lagi, harga pasti Rp12.000/kg — deal?” Pak Tani setuju. Ia melepas peluang harga naik — demi kepastian.",
        "Inilah kontrak forward: menukar ketidakpastian dengan kepastian. Payoff long forward (pihak yang setuju membeli) = S_T − K: jika pasar di atas deal → untung; di bawah → rugi. Simetris, tak terbatas dua arah. Hitung untung-rugi Pak Tani (pihak jual = short) di dua skenario.",
      ],
      formula: String.raw`\text{Payoff long forward} = S_T - K`,
      formulaNote: "S_T = harga pasar saat jatuh tempo; K = harga deal. Short = kebalikannya.",
      tasks: [
        { id: "t1", text: "Hitung `untung_a` Pak Tani jika spot Rp10.000/kg" },
        { id: "t2", text: "Hitung `untung_b` Pak Tani jika spot Rp15.000/kg" },
      ],
      expected: "untung_a=20000000  untung_b=-30000000",
      note: {
        title: "Sering salah",
        body: "Mengira forward = “prediksi harga”. Forward = penguncian harga, bukan ramalan. Pak Tani tidak menebak harga — ia membeli ketenangan dengan melepas upside.",
      },
      hints: [
        "10 ton = 10.000 kg. Kontrak: jual @12.000/kg apapun spot.",
        "Untung Pak Tani = (12.000 − spot) × 10.000.",
        "Skenario B: spot 15.000 → ia “kehilangan peluang” Rp30 jt.",
      ],
      code: {
        starter: `kg = 10_000        # 10 ton\nharga_deal = 12_000  # Rp/kg\n\n# TULIS KODEMU: untung Pak Tani (short forward) di dua skenario spot\nuntung_a =   # spot 10.000\nuntung_b =   # spot 15.000\n\nprint(f"untung_a={untung_a:.0f}  untung_b={untung_b:.0f}")`,
        lockLines: 2,
        solution: `kg = 10_000        # 10 ton\nharga_deal = 12_000  # Rp/kg\n\n# TULIS KODEMU: untung Pak Tani (short forward) di dua skenario spot\nuntung_a = (harga_deal - 10_000) * kg  # spot 10.000\nuntung_b = (harga_deal - 15_000) * kg  # spot 15.000\n\nprint(f"untung_a={untung_a:.0f}  untung_b={untung_b:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "untung_a", value: 20000000, tol: 1, label: "`untung_a` = Rp20 jt", msg: "(12.000 − 10.000) × 10.000 = Rp20 jt vs jual spot." },
          { kind: "equal", task: "t2", name: "untung_b", value: -30000000, tol: 1, label: "`untung_b` = −Rp30 jt", msg: "(12.000 − 15.000) × 10.000 = −Rp30 jt. Itulah harga kepastian." },
          { kind: "stdout_matches", task: "t2", pattern: "untung_a=20000000\\s+untung_b=-30000000", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Forward = janji wajib eksekusi (OTC, custom); payoff simetris, zero-sum.",
    },
    {
      id: "futures-opsi",
      eyebrow: "Langkah 2 · Futures & opsi",
      title: "Forward naik kelas, dan hak yang bukan kewajiban",
      prose: [
        "Futures = forward yang distandarisasi (ukuran kontrak, tanggal baku) dan diperdagangkan di bursa dengan kliring terpusat + margin harian. Tiga beda kunci: bisa ditutup kapan saja di bursa; risiko counterparty nyaris nol; untung/rugi dicairkan tiap hari (variation margin) — akun tidak boleh di bawah maintenance margin, kalau tidak: margin call!",
        "Opsi = hak (bukan kewajiban!) untuk membeli (call) atau menjual (put) di harga strike sebelum/pada kedaluwarsa. Premi = intrinsic value + time value. Long call (strike 100, premi 5): rugi maksimal 5, untung tak terbatas, breakeven = 105. Long put: cerminnya, breakeven = K − premi.",
      ],
      formula: String.raw`\text{Payoff call} = \max(S_T - K, 0) - \text{premi} \qquad \text{breakeven} = K + \text{premi}`,
      formulaNote: "Payoff call = max(S_T − K, 0) − premi: S_T = harga underlying saat kedaluwarsa; K = strike; premi = harga opsi yang dibayar di muka. Rugi maksimal = premi (bila S_T ≤ K); untung tak terbatas. Breakeven = K + premi. Contoh: K 100, premi 5 → impas di 105; S_T 120 → payoff 15.",
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira beli opsi = beli saham “murah”. Opsi kedaluwarsa: benar arah tapi salah waktu = tetap hangus. Inilah jebakan waran: hak yang tidak dipakai sebelum kedaluwarsa hangus total — benar arah tetapi salah waktu = rugi 100%.",
      },
      reference: "Futures = standar + kliring + margin harian. Opsi = hak, bayar premi, bisa hangus total.",
    },
    {
      id: "payoff-parity",
      eyebrow: "Langkah 3 · Put-call parity",
      title: "Hukum kekekalan: C + PV(K) = P + S",
      prose: [
        "Untuk opsi Eropa dengan strike dan tenor sama: “call + kas sebesar PV(strike)” identik dengan “put + saham” — keduanya memberi payoff max(S_T, K). Jika pasar melanggar paritas → arbitrase: beli sisi murah, jual sisi mahal, kantongi selisih bebas risiko.",
        "S=100, K=100, r=6%, T=1, harga pasar C=8, P=10. Uji paritasnya: sisi mana yang murah?",
      ],
      formula: String.raw`C + PV(K) = P + S`,
      formulaNote: "C = harga call; P = harga put; PV(K) = strike didiskonto risk-free; S = harga saham kini.",
      tasks: [
        { id: "t1", text: "Hitung `kiri` (C + PV(K)) dan `kanan` (P + S)" },
        { id: "t2", text: "Tentukan `kesimpulan` (\"rusak\" jika selisih > 0,5)" },
      ],
      expected: "kiri=102.18  kanan=110.00  kesimpulan=rusak",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Paritas mengajarkan berpikir sintesis: butuh proteksi downside tapi put tidak likuid? Beli call + taruh kas = payoff sama. Trader profesional merakit payoff dari komponen termurah.",
      },
      hints: [
        "PV(K) = K / e^(rT). Gunakan math.exp.",
        "kiri = C + PV(K); kanan = P + S.",
        "kesimpulan = \"rusak\" if abs(kiri-kanan) > 0.5 else \"wajar\"",
      ],
      code: {
        starter: `import math\nS, K, r, T = 100, 100, 0.06, 1.0\nC, P = 8, 10  # harga pasar call & put\n\n# TULIS KODEMU: uji put-call parity\npv_k = \nkiri = \nkanan = \nkesimpulan = \n\nprint(f"kiri={kiri:.2f}  kanan={kanan:.2f}  kesimpulan={kesimpulan}")`,
        lockLines: 3,
        solution: `import math\nS, K, r, T = 100, 100, 0.06, 1.0\nC, P = 8, 10  # harga pasar call & put\n\n# TULIS KODEMU: uji put-call parity\npv_k = K / math.exp(r * T)\nkiri = C + pv_k\nkanan = P + S\nkesimpulan = "rusak" if abs(kiri - kanan) > 0.5 else "wajar"\n\nprint(f"kiri={kiri:.2f}  kanan={kanan:.2f}  kesimpulan={kesimpulan}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kiri", value: 102.18, tol: 0.01, label: "`kiri` sekitar 102,18", msg: "8 + 100/e^0,06 = 8 + 94,18 = 102,18." },
          { kind: "equal", task: "t1", name: "kanan", value: 110.0, tol: 1e-9, label: "`kanan` = 110,00", msg: "10 + 100 = 110." },
          { kind: "stdout_matches", task: "t2", pattern: "kesimpulan=rusak", label: "Kesimpulan = rusak", msg: "Selisih 7,82 > 0,5 → paritas rusak → arbitrase: jual sisi kanan (mahal), beli sisi kiri (murah)." },
        ],
      },
      reference: "Paritas rusak = arbitrase (tapi cepat hilang). C + PV(K) = P + S.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang hak vs kewajiban dan breakeven.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Perbedaan fundamental forward vs opsi?",
          options: [
            { text: "Tidak ada bedanya", why: "Salah: bedanya justru fundamental — kewajiban vs hak." },
            { text: "Forward: kedua pihak WAJIB eksekusi. Opsi: pemegang punya HAK (boleh tidak eksekusi)", why: "Benar: forward gratis di awal tapi payoff simetris; opsi bayar premi tapi rugi dibatasi.", correct: true },
            { text: "Forward lebih mahal", why: "Salah: forward tidak ada premi di awal; opsi yang bayar premi." },
            { text: "Opsi hanya untuk saham", why: "Salah: opsi ada untuk saham, indeks, FX, komoditas." },
          ],
        },
        {
          q: "Long call strike 100, premi 5. Breakeven?",
          options: [
            { text: "100", why: "Salah: di 100 payoff masih −5 (premi hangus)." },
            { text: "95", why: "Salah: itu breakeven untuk long PUT (K − premi)." },
            { text: "105 (strike + premi)", why: "Benar: harga harus menutup premi dulu sebelum untung.", correct: true },
            { text: "110", why: "Salah: di 110 sudah untung 5 — breakeven-nya lebih rendah." },
          ],
        },
      ],
    },
    {
      id: "minicase-eksportir",
      eyebrow: "Langkah 5 · Mini-case",
      title: "Andi vs Bimo: siapa hedging, siapa spekulasi?",
      prose: [
        "PT Ekspor Jaya akan terima USD 1 juta dalam 6 bulan. Kurs kini Rp16.000/USD. Andi (direktur keuangan) mengunci forward di Rp16.200. Bimo (kawannya, tanpa bisnis dolar) membeli call USD/IDR strike Rp16.200 premi Rp200 dengan modal Rp200 juta. 6 bulan kemudian kurs Rp17.500.",
        "Pertanyaan: (a) Hitung hasil masing-masing dalam rupiah. (b) Siapa hedging, siapa spekulasi — dan apa beda fundamentalnya? (c) Jika kurs malah jatuh ke Rp15.000, bagaimana nasib keduanya?",
        "Pembahasan: (a) Andi: 1 jt × 16.200 = Rp16,2 M (pasti, apapun kurs pasar). Bimo: (17.500−16.200) × 1 jt − Rp200 jt = +Rp1,1 M (untung 550% dari modal!). (b) Andi = hedging (punya eksposur USD riil; forward menghilangkan risiko). Bimo = spekulasi (tanpa eksposur; menciptakan eksposur ber-leverage). (c) Kurs 15.000: Andi tetap terima Rp16,2 M (melepas upside Rp1,3 M — harga kepastian). Bimo: call hangus → rugi 100% (Rp200 jt melayang).",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Instrumennya netral — niatnya yang menentukan apakah ini asuransi atau kasino. Ada eksposur → hedging. Tanpa eksposur → spekulasi. Jujur pada dirimu yang mana.",
      },
      reference: "Forward/futures = wajib eksekusi (simetris). Opsi = hak (asimetris, bayar premi).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Lindung nilai atau spekulasi? Empat skenario",
      prose: [
        "Punya eksposur nyata, mau kepastian penuh → forward: custom, tanpa premi; harganya = lepas upside + risiko counterparty bank. Butuh lindung nilai yang likuid dan bisa ditutup kapan saja → futures: bursa + kliring + margin harian; harganya = margin call harian bisa menekan kas.",
        "Mau proteksi tapi tetap ikut upside → long put (asuransi): rugi dibatasi premi; upside terbuka; premi hangus jika pasar tenang. Spekulasi arah dengan modal kecil → opsi (pahami premi dulu!): butuh benar arah, besar gerakan, DAN timing — tiga syarat sekaligus.",
        "Aturan 10 detik: ada eksposur → hedging; tanpa eksposur → spekulasi. Forward/futures = wajib eksekusi. Opsi = hak. C + PV(K) = P + S.",
      ],
      tasks: [],
      reference: "Jujur pada dirimu: hedging atau spekulasi? Instrumen boleh sama, tujuannya yang beda.",
    },
    {
      id: "derivatif-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: margin & hedging",
      title: "Margin, basis, dan lindung nilai yang tak sempurna",
      prose: [
        "Futures memungkinkanmu mengendalikan kontrak Rp1,65 miliar dengan margin awal mungkin Rp100 juta — leverage 16×. Sistemnya: initial margin (uang muka), maintenance margin (batas bawah), dan variation margin (untung-rugi dicairkan HARIAN). Begitu akun di bawah maintenance → margin call: setor dana atau posisimu dilikuidasi broker. Leverage ini yang membuat futures efisien untuk hedging — dan mematikan bagi spekulan yang salah arah: Metallgesellschaft rugi US$1,3 miliar (1993) dari strategi stack-and-roll yang kehabisan kas margin.",
        "Hedge yang “sempurna” di teori jarang sempurna di praktik karena basis risk: basis = harga spot − harga futures. Eksportir mengunci kurs forward Rp16.500, tetapi saat jatuh tempo spot Rp16.700 dan futures-nya Rp16.620 — basis bergerak, hedge bocor Rp120 per dolar. Ditambah ukuran kontrak yang baku (misalnya US$10.000) vs eksposur yang tidak bulat, dan tenor yang tidak pas — semuanya menambah selisih.",
        "Hedging praktis mengikuti tiga langkah: (1) hitung eksposur bersih (piutang − utang dalam valas); (2) N = eksposur ÷ ukuran kontrak — terima sedikit over/under-hedge; (3) pilih tenor kontrak terdekat SETELAH tanggal kebutuhan (kalau butuh 20 Juni, pakai kontrak Juli, bukan Juni — hindari delivery squeeze). Memperpanjang hedge = roll — dan setiap roll membayar spread lagi (roll risk).",
        "Aturan praktis: (1) hedge = membeli kepastian, menjual kejutan baik — eksportir yang “menyesal” karena rupiah menguat setelah hedging adalah hedger yang tidak paham tujuannya; (2) hitung basis historis sebelum mengklaim “terlindungi penuh”; (3) siapkan kas untuk margin call — hedge yang benar bisa mati karena likuiditas sebelum ia terbukti benar.",
      ],
      formula: String.raw`\text{basis} = S - F \qquad N = \frac{\text{eksposur}}{\text{ukuran kontrak}}`,
      formulaNote: "basis = harga spot (S) − harga futures (F); basis yang bergerak = hedge bocor. N = jumlah kontrak; eksposur = nilai yang dilindungi; ukuran kontrak = nilai per kontrak (misalnya US$10.000). Contoh: eksposur US$100.000 ÷ US$10.000 = 10 kontrak — pas genap; eksposur US$95.000 = terima over-hedge 5.000 atau under-hedge.",
      tasks: [
        { id: "t1", text: "Hitung `n_kontrak` untuk eksposur US$100.000" },
        { id: "t2", text: "Hitung `nilai_terkunci` (rupiah yang pasti diterima)" },
      ],
      expected: "n_kontrak=10  nilai_terkunci=1650000000",
      hints: [
        "n_kontrak = eksposur_usd ÷ ukuran_kontrak.",
        "nilai_terkunci = eksposur_usd × kurs_forward.",
      ],
      code: {
        starter: `eksposur_usd = 100_000     # piutang 3 bulan lagi\nukuran_kontrak = 10_000    # per kontrak futures USD/IDR\nkurs_forward = 16_500      # kurs terkunci\n\n# TULIS KODEMU\nn_kontrak = \nnilai_terkunci = \n\nprint(f"n_kontrak={n_kontrak:.0f}  nilai_terkunci={nilai_terkunci:.0f}")`,
        lockLines: 3,
        solution: `eksposur_usd = 100_000     # piutang 3 bulan lagi\nukuran_kontrak = 10_000    # per kontrak futures USD/IDR\nkurs_forward = 16_500      # kurs terkunci\n\n# TULIS KODEMU\nn_kontrak = eksposur_usd / ukuran_kontrak\nnilai_terkunci = eksposur_usd * kurs_forward\n\nprint(f"n_kontrak={n_kontrak:.0f}  nilai_terkunci={nilai_terkunci:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "n_kontrak", value: 10, tol: 1e-9, label: "`n_kontrak` seharusnya 10", msg: "100.000 ÷ 10.000 = 10 kontrak. Pas genap — tidak selalu seberuntung ini." },
          { kind: "equal", task: "t2", name: "nilai_terkunci", value: 1650000000, tol: 1, label: "`nilai_terkunci` seharusnya 1650000000", msg: "100.000 × 16.500 = Rp1,65 miliar. Pasti — itulah yang dibeli." },
          { kind: "stdout_matches", task: "t2", pattern: "n_kontrak=10\\s+nilai_terkunci=1650000000", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: lindung nilai = beli kepastian, bayar dengan kejutan baik",
        body: "Tujuan hedging bukan memaksimalkan hasil — melainkan membuat hasil bisa direncanakan. Empat heuristik. Pertama: hedger yang menyesal (“andaikan tidak di-hedge, dapat lebih!”) tidak paham produknya — kamu membeli asuransi, bukan tiket lotre; asuransi yang tidak diklaim bukan pembelian yang bodoh. Kedua: lindungi arus kas, bukan laporan laba — eksportir butuh kepastian rupiah yang diterima untuk membayar gaji dan supplier, bukan kurs “terbaik”; kepastian = bisa tidur. Ketiga: basis tidak pernah nol dan margin call tidak pernah sopan — hedge yang benar secara arah bisa mati karena kas margin habis di tengah jalan; siapkan likuiditas seperti menyiapkan premi, bukan sebagai sisa. Keempat: ukuran dulu, arah kemudian — N = eksposur ÷ ukuran kontrak; over-hedge 5% jauh lebih murah daripada salah tebak arah 100%; dan pilih tenor SETELAH tanggal kebutuhan untuk menghindari delivery squeeze. Aturan 10 detiknya: kalau kamu tidak bisa menjelaskan dalam satu kalimat risiko apa yang sedang kamu hilangkan, kamu bukan hedging — kamu berspekulasi dengan kostum hedging.",
      },
      reference: "Margin = leverage + borgol. Basis tak pernah nol. Hedge = beli kepastian.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Empat pertanyaan campuran dari seluruh lesson.",
      ],
      tasks: [],
      summary: [
        "Forward = janji wajib eksekusi (OTC, custom); payoff simetris.",
        "Futures = forward terstandarisasi di bursa + kliring + margin harian.",
        "Opsi = HAK (bukan kewajiban); premi = intrinsic + time value; bisa hangus total.",
        "Breakeven call = K + premi; put = K − premi.",
        "Put-call parity: C + PV(K) = P + S — mesin arbitrase dan sintesis posisi.",
      ],
      next: { label: "E11 — Black-Scholes", href: "/v2/learn/e11-black-scholes" },
      quiz: [
        {
          q: "Keunggulan futures dibanding forward OTC?",
          options: [
            { text: "Lebih murah selalu", why: "Salah: tidak selalu lebih murah — keunggulannya di struktur." },
            { text: "Standar, likuid (bisa ditutup kapan saja), risiko counterparty minimal via kliring", why: "Benar: standardisasi + bursa + kliring + margin harian. Harganya: kurang fleksibel + margin call.", correct: true },
            { text: "Tanpa margin", why: "Salah: justru ADA margin harian — itu ciri futures." },
            { text: "Bisa custom tanggal", why: "Salah: itu keunggulan FORWARD (OTC), bukan futures." },
          ],
        },
        {
          q: "Put-call parity: C + PV(K) = P + S. Jika kiri > kanan…",
          options: [
            { text: "Tidak ada artinya", why: "Salah: selisihnya = peluang arbitrase." },
            { text: "Ada peluang arbitrase: jual sisi kiri (mahal), beli sisi kanan (murah)", why: "Benar: keduanya mereplikasi payoff identik — selisihnya profit bebas risiko.", correct: true },
            { text: "Beli call saja", why: "Salah: arbitrase butuh kedua sisi — jual mahal, beli murah." },
            { text: "Pasar efisien sempurna", why: "Salah: justru pasar TIDAK efisien sesaat — itu yang dieksploitasi." },
          ],
        },
        {
          q: "Investor memegang saham Rp100 jt dan membeli put strike 100 premi 5%. Fungsi put ini?",
          options: [
            { text: "Spekulasi agar untung besar", why: "Salah: put di sini melindungi posisi yang sudah ada." },
            { text: "Asuransi: portofolio tidak bisa jatuh di bawah Rp95 jt", why: "Benar: protective put = asuransi portofolio; premi = biaya tidur nyenyak.", correct: true },
            { text: "Menambah dividen", why: "Salah: put tidak menambah dividen." },
            { text: "Menghindari pajak", why: "Salah: tidak ada kaitan dengan pajak." },
          ],
        },
        {
          q: "Bimo (tanpa bisnis dolar) beli call USD/IDR dengan leverage. Ini…",
          options: [
            { text: "Hedging", why: "Salah: hedging butuh eksposur yang dilindungi — Bimo tidak punya." },
            { text: "Spekulasi — menciptakan eksposur tanpa underlying exposure", why: "Benar: derivatif yang sama di tangan Andi (ada eksposur) = hedging.", correct: true },
            { text: "Arbitrase", why: "Salah: tidak ada mispricing yang dieksploitasi." },
            { text: "Investasi jangka panjang", why: "Salah: opsi berjangka pendek + leverage = bukan investasi." },
          ],
        },
      ],
    },
  ],
};
