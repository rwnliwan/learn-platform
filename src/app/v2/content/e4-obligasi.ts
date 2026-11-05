import type { V2Lesson } from "../lib/types";

export const e4: V2Lesson = {
  slug: "e4-obligasi",
  track: "Financial Markets",
  module: "Obligasi & Kredit",
  title: "E4. Obligasi: Harga, Yield, Duration",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-budi",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Kupon 6%, kok rugi?",
      prose: [
        "Tahun 2022, Budi membeli ORI kupon 6% seharga Rp100 juta. “Enak, tiap tahun dapat Rp6 juta pasti,” pikirnya. Setahun kemudian BI menaikkan suku bunga — obligasi baru terbit dengan kupon 7,5%. Budi butuh uang dan menjual ORI-nya… laku cuma Rp94 juta. Padahal kuponnya tetap dibayar 6% penuh! Kok bisa rugi padahal “dijanjikan” 6%?",
        "Karena harga obligasi yang sudah beredar ditentukan pasar, bukan kuponnya. Saat bunga pasar naik, obligasi lama berkupon kecil jadi kurang menarik — harganya harus turun sampai yield-nya bersaing. Inilah hukum besi obligasi: harga dan yield bergerak berlawanan arah. Harga wajar obligasi = present value seluruh arus kasnya (kupon + pokok), didiskonto dengan yield pasar.",
      ],
      formula: String.raw`P = \sum_{t=1}^{n}\frac{C}{(1+y)^t} + \frac{F}{(1+y)^n}`,
      formulaNote: "P = harga wajar; C = kupon per periode; F = nilai nominal; y = yield pasar (bukan kupon!); n = periode.",
      tasks: [
        { id: "t1", text: "Hitung `h_8` — harga obligasi 10 thn, kupon 6%, saat yield 8% (dalam juta)" },
        { id: "t2", text: "Tentukan `status` (\"diskon\", \"par\", atau \"premium\")" },
      ],
      expected: "h_8=86.6  status=diskon",
      note: {
        title: "Sering salah",
        body: "“Kupon 6% berarti return-ku 6%.” Return sebenarnya = YTM: tingkat diskonto yang membuat harga pasar = PV arus kas. Kupon masa lalu, yield masa kini.",
      },
      hints: [
        "PV kupon = anuitas: 6 × (1 − 1,08^−10)/0,08. PV pokok = 100/1,08^10.",
        "Harga = PV kupon + PV pokok, dalam juta rupiah.",
        "status = \"diskon\" jika harga < 100",
      ],
      code: {
        starter: `# Obligasi: nominal Rp100 jt, kupon 6%/thn, tenor 10 thn, yield pasar 8%\nC, F, n, y = 6, 100, 10, 0.08  # dalam juta rupiah\n\n# TULIS KODEMU: harga wajar dan statusnya\nh_8 = \nstatus = \n\nprint(f"h_8={h_8:.1f}  status={status}")`,
        lockLines: 2,
        solution: `# Obligasi: nominal Rp100 jt, kupon 6%/thn, tenor 10 thn, yield pasar 8%\nC, F, n, y = 6, 100, 10, 0.08  # dalam juta rupiah\n\n# TULIS KODEMU: harga wajar dan statusnya\nh_8 = C * (1 - (1 + y) ** -n) / y + F / (1 + y) ** n\nstatus = "diskon" if h_8 < 100 else ("par" if abs(h_8 - 100) < 0.01 else "premium")\n\nprint(f"h_8={h_8:.1f}  status={status}")`,
        checks: [
          { kind: "equal", task: "t1", name: "h_8", value: 86.58, tol: 0.05, label: "`h_8` sekitar 86,6", msg: "PV kupon 40,4 + PV pokok 46,2 = 86,6 jt. Yield naik → harga turun." },
          { kind: "stdout_matches", task: "t2", pattern: "status=diskon", label: "Status = diskon", msg: "Harga 86,6 < nominal 100 = diskon. Harga diskon ⟺ YTM > kupon." },
        ],
      },
      reference: "Harga = PV(kupon + pokok) dengan diskonto = yield pasar. Yield naik → harga turun. Selalu.",
    },
    {
      id: "duration",
      eyebrow: "Langkah 2 · Duration",
      title: "Speedometer risiko bunga",
      prose: [
        "Duration mengukur seberapa sensitif harga obligasi terhadap perubahan yield. Modified duration = persen perubahan harga per 1% perubahan yield. Tiga aturan (hafalkan!): makin panjang tenor → makin besar duration; makin kecil kupon → makin besar duration; makin tinggi yield → makin kecil duration.",
        "Bandingkan tiga obligasi (kupon 6%) saat yield naik 1% (dari 6% ke 7%): tenor 2, 5, dan 10 tahun. Hitung perubahan harga dan duration obligasi 10 tahun.",
      ],
      formula: String.raw`\frac{\Delta P}{P} \approx -D_{\text{mod}} \times \Delta y`,
      formulaNote: "D_mod = modified duration; Δy = perubahan yield (0,01 = 1%).",
      tasks: [
        { id: "t1", text: "Hitung `chg_10` (% perubahan harga obligasi 10 thn)" },
        { id: "t2", text: "Hitung `dur_10` (modified duration ≈ −chg / Δy)" },
      ],
      expected: "chg_10=-7.02  dur_10=7.0",
      note: {
        title: "Sering salah",
        body: "Mengira duration = tenor. Duration 10 tahun ≠ 10 tahun — obligasi 10 tahun kupon 6% punya duration ~7, bukan 10. Duration = rata-rata tertimbang waktu penerimaan kas.",
      },
      hints: [
        "Hitung harga di yield 6% (h0) dan 7% (h1) dengan fungsi harga.",
        "chg = (h1 − h0)/h0 × 100. dur = −chg / 1 (untuk Δy = 1%).",
        "Pakai rumus harga dari langkah 1 untuk tiap yield.",
      ],
      code: {
        starter: `def harga(n, kr, y, nom=100):\n    return kr * nom * (1 - (1 + y) ** -n) / y + nom / (1 + y) ** n\n\ny0, y1 = 0.06, 0.07\n\n# TULIS KODEMU: perubahan % dan duration obligasi 10 thn, kupon 6%\nh0 = \nh1 = \nchg_10 = \ndur_10 = \n\nprint(f"chg_10={chg_10:.2f}  dur_10={dur_10:.1f}")`,
        lockLines: 4,
        solution: `def harga(n, kr, y, nom=100):\n    return kr * nom * (1 - (1 + y) ** -n) / y + nom / (1 + y) ** n\n\ny0, y1 = 0.06, 0.07\n\n# TULIS KODEMU: perubahan % dan duration obligasi 10 thn, kupon 6%\nh0 = harga(10, 0.06, y0)\nh1 = harga(10, 0.06, y1)\nchg_10 = (h1 - h0) / h0 * 100\ndur_10 = -chg_10 / ((y1 - y0) * 100)\n\nprint(f"chg_10={chg_10:.2f}  dur_10={dur_10:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "chg_10", value: -7.02, tol: 0.05, label: "`chg_10` sekitar −7,02", msg: "Harga jatuh 100 → 93,0 = −7,02%. Bandingkan: obligasi 2 tahun hanya −1,8%." },
          { kind: "equal", task: "t2", name: "dur_10", value: 7.0, tol: 0.1, label: "`dur_10` sekitar 7,0", msg: "−(−7,02)/1 = 7,0. Artinya tiap 1% kenaikan yield ≈ 7% kerugian." },
          { kind: "stdout_matches", task: "t2", pattern: "chg_10=-7\\.02\\s+dur_10=7\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Duration = % perubahan harga per 1% perubahan yield. Tenor panjang + kupon kecil = sensitif.",
    },
    {
      id: "convexity-yieldcurve",
      eyebrow: "Langkah 3 · Convexity & yield curve",
      title: "Kelengkungan dan peta suku bunga",
      prose: [
        "Duration mengasumsikan hubungan harga–yield lurus. Padahal kurvanya melengkung (konveks). Convexity mengoreksi kelengkungan itu — dan memberi asimetri menguntungkan: rugi lebih kecil saat yield naik, untung lebih besar saat yield turun. Untuk perubahan yield besar (>1%), atau membandingkan dua obligasi ber-duration sama, pilih convexity lebih tinggi.",
        "Yield curve = grafik yield vs tenor untuk obligasi sejenis (biasanya SBN). Normal (naik) = sehat. Inverted (turun: tenor pendek yield lebih tinggi) = sinyal bahaya klasik — pasar bertaruh suku bunga akan turun karena resesi datang. Flat = transisi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Inversi yield curve mendahului resesi 6–24 bulan (rekor AS 8-dari-8 sejak 1976). Manajer risiko memakainya sebagai sirene — bukan ramalan pasti, tapi alasan menyiapkan likuiditas.",
      },
      reference: "Convexity = koreksi kelengkungan; asimetri menguntungkan. Inverted curve = waspada resesi.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang hukum besi obligasi dan duration.",
      ],
      tasks: [],
      quiz: [
        {
          q: "BI menaikkan suku bunga. Apa yang terjadi pada harga ORI yang sudah beredar?",
          options: [
            { text: "Naik, karena kuponnya ikut naik", why: "Salah: kupon obligasi lama TIDAK berubah — yang berubah yield pasar." },
            { text: "Turun — yield pasar naik membuat kupon lama kurang menarik", why: "Benar: harga harus turun agar yield-nya bersaing. Inilah cerita Budi di pembuka.", correct: true },
            { text: "Tetap, karena kupon tidak berubah", why: "Salah: harga ditentukan pasar (yield saat ini), bukan kupon historis." },
            { text: "Naik, karena pemerintah menjamin", why: "Salah: jaminan = kepastian pembayaran, bukan kepastian harga pasar." },
          ],
        },
        {
          q: "Obligasi dengan modified duration 8. Yield naik 0,5%. Estimasi perubahan harga?",
          options: [
            { text: "Naik 4%", why: "Salah: yield naik → harga TURUN, tidak pernah naik." },
            { text: "Turun ≈ 4%", why: "Benar: ΔP/P ≈ −8 × 0,005 = −4%. Duration = speedometer harga.", correct: true },
            { text: "Turun 8%", why: "Salah: 8% = untuk kenaikan yield 1%, bukan 0,5%." },
            { text: "Tidak berubah", why: "Salah: duration 8 = sangat sensitif terhadap yield." },
          ],
        },
      ],
    },
    {
      id: "minicase-sbn-deposito",
      eyebrow: "Langkah 5 · Mini-case",
      title: "SBN vs deposito: Rp100 juta, 3 tahun",
      prose: [
        "Sari punya Rp100 juta untuk 3 tahun. Opsi A: deposito 5%/tahun (bunga diambil tiap tahun, pokok utuh). Opsi B: SBN 3 tahun kupon 6,2%, harga pasar Rp101,5 juta (premium!), YTM 5,6%.",
        "Pertanyaan: (a) Mana return lebih tinggi jika dipegang sampai jatuh tempo? (b) Jika setahun kemudian Sari butuh uang mendadak dan yield pasar naik ke 8%, opsi mana yang lebih “menyakiti”? (c) Kapan deposito justru pilihan lebih baik?",
        "Pembahasan: (a) SBN (YTM 5,6% > 5%). Jangan tertipu kupon 6,2% — karena beli di harga premium Rp101,5 juta, return sebenarnya 5,6%. Tetap menang dari deposito 5%. (b) SBN. Deposito bisa dicairkan (denda kecil, pokok kembali). SBN harus dijual di harga pasar yang jatuh karena yield naik — dengan duration ±2,8, kerugian ≈ 2,8% × 2,4% ≈ 6,7%. Inilah harga likuiditas dan risiko bunga. (c) Jika mungkin butuh uang sebelum 3 tahun atau yakin bunga akan naik tajam — deposito (pokok dijamin LPS s.d. batas, bisa break) lebih fleksibel.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Risiko likuiditas pribadi (butuh uang mendadak) mengubah pilihan instrumen yang “terbaik”. Return tertinggi di atas kertas bisa jadi pilihan terburuk jika kamu terpaksa jual di waktu yang salah.",
      },
      reference: "Pegang sampai jatuh tempo → fokus YTM & risiko default, abaikan gejolak harga.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Obligasi mana untuk pandanganmu?",
      prose: [
        "Yakin suku bunga akan TURUN → duration panjang: yield turun → harga naik, dan duration panjang melipatgandakan kenaikan. Takut suku bunga NAIK → duration pendek: harga hampir tidak bergerak, kupon bisa di-reinvestasi di bunga baru yang lebih tinggi.",
        "Butuh kepastian arus kas dan pegang sampai jatuh tempo → abaikan harga pasar: kamu terima kupon + pokok penuh apapun gejolak di tengah jalan. Dua obligasi duration sama → pilih convexity lebih tinggi untuk asimetri gratis.",
        "Aturan 10 detik: yield naik → harga turun, selalu, tanpa kecuali. Duration = persen rugi per 1% kenaikan yield — tanya angka ini sebelum beli obligasi apapun.",
      ],
      tasks: [],
      reference: "View turun → duration panjang. Takut naik → duration pendek. Pegang s.d. jatuh tempo → fokus YTM.",
    },
    {
      id: "obligasi-lanjut",
      eyebrow: "Langkah 7 · Pendalaman: obligasi lanjut",
      title: "Kurva SBN, key-rate duration, dan kupon yang dipajaki",
      prose: [
        "Kurva imbal hasil (yield curve) SBN memetakan yield terhadap tenor: 2Y 6,1%, 5Y 6,4%, 10Y 6,8%, 20Y 7,0% — normal, menanjak karena investor menuntut kompensasi menunggu lebih lama. Kurva bisa mendatar atau terbalik (inverted): saat pasar yakin suku bunga akan turun (biasanya karena resesi mengintip), yield panjang jatuh di bawah yield pendek. Bentuk kurva adalah ramalan kolektif pasar obligasi — dan ia sering lebih jujur dari analis.",
        "Duration mengukur sensitivitas terhadap pergeseran paralel yield — tetapi yield jarang bergeser paralel. Key-rate duration memecahnya per titik tenor: portofoliomu mungkin netral terhadap pergerakan 10Y tetapi berdarah-darah saat 2Y naik (twist). Dua obligasi dengan duration sama bisa berperilaku beda total saat kurva berubah bentuk — inilah kenapa manajer obligasi profesional tidak pernah hanya melihat satu angka duration.",
        "Risiko yang jarang dibahas: reinvestment risk. YTM 7% yang kamu hitung diam-diam mengasumsikan setiap kupon yang diterima diinvestasikan kembali di 7% juga. Kalau suku bunga turun ke 5%, kupon-kuponmu hanya beranak di 5% — return realisasimu di bawah YTM yang dijanjikan. Makin tinggi kupon dan makin panjang tenor, makin besar kebohongan asumsi ini. Obligasi zero-coupon imun terhadapnya — ia tidak punya kupon untuk diinvestasikan ulang.",
        "Lalu pajak memotong lagi. Bunga obligasi kena PPh final 10%: kupon 7% dari nominal Rp1 miliar = Rp70 juta, dipotong Rp7 juta, bersih Rp63 juta (6,3% efektif). Bandingkan apel dengan apel: deposito kena PPh final 20% — deposito 5% = bersih 4%. Obligasi menang bukan cuma dari kuponnya, melainkan juga dari pajaknya. Aturan praktis: (1) selalu hitung yield after-tax sebelum membandingkan; (2) cocokkan duration dengan horizon — butuh dana 3 tahun lagi, jangan pegang duration 8; (3) saat yield turun, waspadai reinvestment — YTM yang kamu lihat bukan yang kamu dapat.",
      ],
      formula: String.raw`\Delta P \approx -D_{mod} \times \Delta y \times P`,
      formulaNote: "ΔP = perkiraan perubahan harga; D_mod = modified duration (sensitivitas harga per 1% perubahan yield); Δy = perubahan yield (desimal); P = harga awal. Contoh: D_mod 7,5, yield naik 1% → harga turun ≈ 7,5%. Tanda negatif = jungkat-jungkit harga vs yield — yield naik, harga turun, selalu.",
      tasks: [
        { id: "t1", text: "Hitung `kupon_bersih` (setelah PPh final 10%)" },
        { id: "t2", text: "Hitung `harga_baru` jika yield naik 100 bps" },
      ],
      expected: "kupon_bersih=63000  harga_baru=943500",
      hints: [
        "kupon_bersih = nominal × 7% × (1 − 0,10).",
        "harga_baru = harga × (1 − D_mod × Δy); Δy = 0,01.",
      ],
      code: {
        starter: `nominal = 1_000_000\nharga = 1_020_000\nkupon_pct = 0.07\ndur_mod = 7.5\ndy = 0.01  # yield naik 100 bps\n\n# TULIS KODEMU\nkupon_bersih = \nharga_baru = \n\nprint(f"kupon_bersih={kupon_bersih:.0f}  harga_baru={harga_baru:.0f}")`,
        lockLines: 5,
        solution: `nominal = 1_000_000\nharga = 1_020_000\nkupon_pct = 0.07\ndur_mod = 7.5\ndy = 0.01  # yield naik 100 bps\n\n# TULIS KODEMU\nkupon_bersih = nominal * kupon_pct * (1 - 0.10)\nharga_baru = harga * (1 - dur_mod * dy)\n\nprint(f"kupon_bersih={kupon_bersih:.0f}  harga_baru={harga_baru:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kupon_bersih", value: 63000, tol: 1, label: "`kupon_bersih` seharusnya 63000", msg: "1.000.000 × 0,07 × 0,9 = 63.000. PPh final obligasi = 10%." },
          { kind: "equal", task: "t2", name: "harga_baru", value: 943500, tol: 1, label: "`harga_baru` seharusnya 943500", msg: "1.020.000 × (1 − 7,5×0,01) = 943.500. Naik 1% = turun 7,5%." },
          { kind: "stdout_matches", task: "t2", pattern: "kupon_bersih=63000\\s+harga_baru=943500", label: "`print` menampilkan dua angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      note: {
        title: "Intuisi: obligasi = jungkat-jungkit harga vs yield",
        body: "Harga dan yield duduk di ujung berlawanan — satu naik, satunya turun, selalu. Empat heuristik. Pertama: duration adalah “umur risiko”, bukan umur obligasi — obligasi 10 tahun berkupon besar bisa berisiko seperti obligasi 7 tahun. Makin besar kupon, makin pendek duration: kas kembali lebih cepat = risiko lebih kecil. Kedua: jangan kejar kupon, kejar yield after-tax — kupon 8% dengan PPh dan harga premium bisa kalah dari kupon 6% yang dibeli di bawah par; yang masuk kantong = kupon − pajak ± (par − harga)/tenor. Ketiga: YTM berbohong dua kali — ia mengasumsikan kamu memegang sampai jatuh tempo DAN menginvestasikan ulang semua kupon di YTM yang sama; dua-duanya jarang terjadi, dan saat suku bunga turun, reinvestment-lah yang menggerogoti. Keempat: kurva bukan garis lurus — key-rate duration mengingatkan bahwa yield 2Y dan 10Y bisa bergerak berlawanan; portofolio “duration netral” bisa tetap berdarah saat kurva twist. Aturan 10 detiknya: butuh uang 3 tahun lagi → duration ≤ 3; selain itu kamu berspekulasi arah suku bunga, bukan berinvestasi.",
      },
      reference: "Kurva = ramalan kolektif. Key-rate > satu duration. After-tax dulu, baru bandingkan.",
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
        "Harga obligasi = PV(kupon + pokok) dengan diskonto = yield pasar. Kupon masa lalu, yield masa kini.",
        "Yield naik → harga turun. Selalu. Hubungannya melengkung (konveks), tidak lurus.",
        "YTM = return sebenarnya (bukan kupon!) jika dipegang sampai jatuh tempo.",
        "Duration = % perubahan harga per 1% perubahan yield. Tenor panjang + kupon kecil = sensitif.",
        "Yield curve: normal = sehat; inverted = waspada resesi; flat = transisi.",
      ],
      next: { label: "E5 — Credit Spread", href: "/learn/e5-credit-spread" },
      quiz: [
        {
          q: "Obligasi kupon 6% diperdagangkan di harga DISKON (di bawah nominal). Apa artinya?",
          options: [
            { text: "YTM < 6%", why: "Salah: itu ciri harga premium (di atas nominal)." },
            { text: "YTM = 6%", why: "Salah: YTM = kupon hanya saat harga = par." },
            { text: "YTM > 6% — pasar meminta yield lebih tinggi dari kupon", why: "Benar: harga diskon = pasar mendiskonto lebih berat.", correct: true },
            { text: "Obligasi pasti default", why: "Salah: diskon = soal yield pasar, bukan vonis default." },
          ],
        },
        {
          q: "Mana yang PALING sensitif terhadap perubahan suku bunga?",
          options: [
            { text: "Obligasi 3 tahun kupon 8%", why: "Salah: tenor pendek = duration pendek = tidak sensitif." },
            { text: "Obligasi 10 tahun kupon 8%", why: "Salah: tenor panjang benar, tapi kupon besar memperpendek duration." },
            { text: "Obligasi 10 tahun kupon 2%", why: "Benar: tenor panjang + kupon kecil = duration terpanjang.", correct: true },
            { text: "Deposito 1 tahun", why: "Salah: deposito tenor pendek, hampir tidak sensitif." },
          ],
        },
        {
          q: "Yield curve inverted (tenor pendek yield lebih tinggi) biasanya menandakan…",
          options: [
            { text: "Ekonomi super sehat", why: "Salah: itu ciri kurva normal." },
            { text: "Pasar bertaruh suku bunga akan turun — sering mendahului resesi", why: "Benar: sinyal bahaya klasik; pasar yakin bank sentral akan memangkas bunga.", correct: true },
            { text: "Inflasi nol", why: "Salah: inversi soal ekspektasi bunga, bukan inflasi nol." },
            { text: "Tidak ada artinya", why: "Salah: rekornya 8-dari-8 mendahului resesi AS sejak 1976." },
          ],
        },
        {
          q: "Dua obligasi ber-duration sama, A convexity lebih tinggi dari B. Jika yield bergerak besar…",
          options: [
            { text: "Pilih B — lebih stabil", why: "Salah: untuk gerakan besar, convexity tinggi menang di kedua arah." },
            { text: "Pilih A — asimetri menguntungkan: untung lebih saat yield turun, rugi lebih kecil saat naik", why: "Benar: convexity = bonus kelengkungan.", correct: true },
            { text: "Sama saja", why: "Salah: duration sama ≠ perilaku sama saat yield bergerak besar." },
            { text: "Pilih yang kuponnya lebih besar", why: "Salah: kupon bukan kriteria — convexity-nya yang dibandingkan." },
          ],
        },
      ],
    },
  ],
};
