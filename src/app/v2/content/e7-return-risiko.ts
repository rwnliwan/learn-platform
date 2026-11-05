import type { V2Lesson } from "../lib/types";

export const e7: V2Lesson = {
  slug: "e7-return-risiko",
  track: "Financial Markets",
  module: "Return & Risiko",
  title: "E7. Return, Volatilitas & Sharpe",
  estMinutes: 55,
  steps: [
    {
      id: "cerita-fund-manager",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "“Untung 20%” yang menipu",
      prose: [
        "Seorang fund manager pamer: “Portofolioku naik 20% tahun ini!” Kamu cek datanya: Januari–Juni naik 60%, Juli–Desember turun 25%. 1,60 × 0,75 = 1,20 — benar 20%. Tapi sepanjang Juli–Desember investornya stres berat: dari puncak Rp160 juta, portofolio anjlok ke Rp120 juta. Banyak yang cut loss di tengah jalan dan tidak pernah merasakan “untung 20%” itu.",
        "Return tanpa risiko = setengah cerita. Simple return intuitif tapi tidak bisa dijumlah antar periode (+10% lalu −10% ≠ 0%, melainkan −1%!). Log return bisa dijumlah — jumlah log return = log return total. Simple = bahasa manusia (laporan); log = bahasa mesin (riset, pemodelan).",
      ],
      formula: String.raw`R_{\text{simple}} = \frac{P_t - P_{t-1}}{P_{t-1}} \qquad r_{\text{log}} = \ln\left(\frac{P_t}{P_{t-1}}\right)`,
      formulaNote: "R_simple = return satu periode (desimal); P_t = harga akhir, P_{t-1} = harga awal periode. r_log = log return = ln(P_t/P_{t-1}) — bisa DIJUMLAH antar periode (jumlah log return = log return total). Contoh: +10% lalu −10% → simple total −1% (1,1×0,9 = 0,99); log total = ln(1,1)+ln(0,9) = −0,01005.",
      tasks: [
        { id: "t1", text: "Hitung `total_simple` (jumlah simple return, desimal)" },
        { id: "t2", text: "Hitung `total_log` (jumlah log return, desimal)" },
      ],
      expected: "total_simple=0.00  total_log=-0.0101",
      note: {
        title: "Sering salah",
        body: "“Naik 10% lalu turun 10% = impas.” Salah: 1,10 × 0,90 = 0,99 — rugi 1%. Simple return menyesatkan jika dijumlah.",
      },
      hints: [
        "Harga: 100 → 110 → 99. Simple return tiap periode = P_t/P_{t-1} − 1.",
        "Log return = ln(P_t/P_{t-1}). Jumlahkan keduanya, jangan dirata-rata.",
        "Gunakan math.log untuk logaritma natural.",
      ],
      code: {
        starter: `import math\np = [100, 110, 99]  # naik 10%, lalu turun 10%\n\n# TULIS KODEMU: jumlah simple return dan log return (desimal)\ntotal_simple = \ntotal_log = \n\nprint(f"total_simple={total_simple:.4f}  total_log={total_log:.4f}")\nprint(f"aktual={(p[-1]/p[0]-1):.4f}")`,
        lockLines: 2,
        solution: `import math\np = [100, 110, 99]  # naik 10%, lalu turun 10%\n\n# TULIS KODEMU: jumlah simple return dan log return (desimal)\ntotal_simple = sum(p[i]/p[i-1] - 1 for i in range(1, len(p)))\ntotal_log = sum(math.log(p[i]/p[i-1]) for i in range(1, len(p)))\n\nprint(f"total_simple={total_simple:.4f}  total_log={total_log:.4f}")\nprint(f"aktual={(p[-1]/p[0]-1):.4f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "total_simple", value: 0.0, tol: 1e-9, label: "`total_simple` = 0,00", msg: "+10% + (−10%) = 0% — padahal harga akhir 99, bukan 100. Menyesatkan!" },
          { kind: "equal", task: "t2", name: "total_log", value: -0.01005, tol: 0.0002, label: "`total_log` ≈ −0,0101", msg: "9,53% + (−10,54%) = −1,01% — jujur: e^−0,0101 = 0,99." },
          { kind: "stdout_matches", task: "t2", pattern: "total_log=-0\\.010", label: "`print` menampilkan total_log", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Simple return untuk komunikasi; log return untuk agregasi/riset (aditif & jujur).",
    },
    {
      id: "volatilitas",
      eyebrow: "Langkah 2 · Volatilitas",
      title: "Pengukur guncangan: standar deviasi return",
      prose: [
        "Volatilitas = standar deviasi return, biasanya ditahunkan. Satuannya % per periode — “return tipikal menyimpang ±σ dari rata-ratanya”. Annualisasi: vol harian × √252; vol bulanan × √12.",
        "Return bulanan: +2%, −1%, +3%, −2%, +1%. Hitung σ bulanan lalu tahunkan.",
      ],
      formula: String.raw`\sigma = \sqrt{\frac{1}{n}\sum_{t=1}^{n}(r_t - \bar{r})^2} \qquad \sigma_{\text{tahunan}} = \sigma_{\text{bulanan}} \times \sqrt{12}`,
      formulaNote: "σ = standar deviasi return per periode (volatilitas); r_t = return periode t; r̄ = rata-rata return; n = jumlah observasi (populasi: bagi n, bukan n−1). Annualisasi pakai akar waktu: σ_bulanan × √12. Contoh: σ bulanan 2% → tahunan ≈ 2% × 3,464 = 6,93%.",
      tasks: [
        { id: "t1", text: "Hitung `sd_bulanan` (%, populasi: bagi n)" },
        { id: "t2", text: "Hitung `sd_tahunan` (annualisasi × √12)" },
      ],
      expected: "sd_bulanan=1.85  sd_tahunan=6.42",
      note: {
        title: "Sering salah",
        body: "Membagi dengan n−1 (sampel) vs n (populasi) lalu bingung kenapa beda dengan contoh. Untuk latihan ini pakai n — yang penting konsisten dan tahu bedanya.",
      },
      hints: [
        "Rata-rata dulu: (2−1+3−2+1)/5 = 0,6%.",
        "Variansi = rata-rata kuadrat simpangan dari rata-rata.",
        "sd_tahunan = sd_bulanan * math.sqrt(12)",
      ],
      code: {
        starter: `import math\nrets = [2, -1, 3, -2, 1]  # %, bulanan\n\n# TULIS KODEMU: SD bulanan dan tahunan\nmean = \nvar = \nsd_bulanan = \nsd_tahunan = \n\nprint(f"sd_bulanan={sd_bulanan:.2f}  sd_tahunan={sd_tahunan:.2f}")`,
        lockLines: 2,
        solution: `import math\nrets = [2, -1, 3, -2, 1]  # %, bulanan\n\n# TULIS KODEMU: SD bulanan dan tahunan\nmean = sum(rets) / len(rets)\nvar = sum((x - mean) ** 2 for x in rets) / len(rets)\nsd_bulanan = math.sqrt(var)\nsd_tahunan = sd_bulanan * math.sqrt(12)\n\nprint(f"sd_bulanan={sd_bulanan:.2f}  sd_tahunan={sd_tahunan:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sd_bulanan", value: 1.85, tol: 0.01, label: "`sd_bulanan` sekitar 1,85", msg: "Variansi = 17,2/5 = 3,44 → σ = √3,44 = 1,85%." },
          { kind: "equal", task: "t2", name: "sd_tahunan", value: 6.42, tol: 0.02, label: "`sd_tahunan` sekitar 6,42", msg: "1,85% × √12 = 6,42%/tahun." },
          { kind: "stdout_matches", task: "t2", pattern: "sd_bulanan=1\\.85\\s+sd_tahunan=6\\.42", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Volatilitas = SD return. Tahunan: ×√252 (harian) / ×√12 (bulanan).",
    },
    {
      id: "sharpe-sortino-drawdown",
      eyebrow: "Langkah 3 · Sharpe & kawan-kawan",
      title: "Wasit yang adil: return per satuan guncangan",
      prose: [
        "Sharpe ratio = (r̄ − rf)/σ: berapa kelebihan return di atas risk-free per satu satuan volatilitas. Cara baca: < 0 = lebih buruk dari deposito; 0–1 = lumayan; 1–2 = bagus; > 2 = luar biasa (atau strateginya belum ketemu masa sulitnya). Sortino = seperti Sharpe tapi hanya menghukum volatilitas downside. Max drawdown = penurunan terdalam dari puncak — mengukur pengalaman investor, bukan statistik abstrak.",
        "Reksa dana GEBYAR: return 13%/thn, vol 22%/thn. TENANG: return 10%/thn, vol 8%/thn. Risk-free 5%. Hitung Sharpe keduanya dan tentukan pemenangnya.",
      ],
      formula: String.raw`S = \frac{\bar{r}_p - r_f}{\sigma_p} \qquad DD_t = \frac{\text{Puncak}_t - \text{Nilai}_t}{\text{Puncak}_t}`,
      formulaNote: "S = Sharpe ratio = (r̄_p − r_f) ÷ σ_p — kelebihan return per satuan volatilitas; r̄_p = rata-rata return portofolio, r_f = risk-free, σ_p = volatilitas. DD_t = drawdown saat t = (puncak − nilai) ÷ puncak. Contoh: puncak Rp160 juta → Rp120 juta = DD 25%. Cara baca Sharpe: <0 kalah dari deposito; 1–2 bagus; >2 luar biasa (atau belum ketemu masa sulitnya).",
      tasks: [
        { id: "t1", text: "Hitung `sharpe_g` dan `sharpe_t`" },
        { id: "t2", text: "Tentukan `pemenang` (\"GEBYAR\" atau \"TENANG\")" },
      ],
      expected: "sharpe_g=0.36  sharpe_t=0.63  pemenang=TENANG",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Sharpe buta terhadap tail risk: strategi “jual asuransi” (untung kecil rutin, bangkrut sesekali) punya Sharpe tinggi sampai kiamatnya tiba. Selalu minta MaxDD dan underwater chart.",
      },
      hints: [
        "Sharpe = (return − risk-free) / vol.",
        "GEBYAR: (13−5)/22. TENANG: (10−5)/8.",
        "pemenang = yang Sharpe-nya lebih besar",
      ],
      code: {
        starter: `rf = 5  # risk-free %\n# (return, vol) per tahun\nG = (13, 22)  # GEBYAR\nT = (10, 8)   # TENANG\n\n# TULIS KODEMU: Sharpe keduanya dan pemenangnya\nsharpe_g = \nsharpe_t = \npemenang = \n\nprint(f"sharpe_g={sharpe_g:.2f}  sharpe_t={sharpe_t:.2f}  pemenang={pemenang}")`,
        lockLines: 4,
        solution: `rf = 5  # risk-free %\n# (return, vol) per tahun\nG = (13, 22)  # GEBYAR\nT = (10, 8)   # TENANG\n\n# TULIS KODEMU: Sharpe keduanya dan pemenangnya\nsharpe_g = (G[0] - rf) / G[1]\nsharpe_t = (T[0] - rf) / T[1]\npemenang = "GEBYAR" if sharpe_g > sharpe_t else "TENANG"\n\nprint(f"sharpe_g={sharpe_g:.2f}  sharpe_t={sharpe_t:.2f}  pemenang={pemenang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sharpe_g", value: 0.36, tol: 0.01, label: "`sharpe_g` sekitar 0,36", msg: "(13−5)/22 = 0,36." },
          { kind: "equal", task: "t1", name: "sharpe_t", value: 0.625, tol: 0.01, label: "`sharpe_t` sekitar 0,63", msg: "(10−5)/8 = 0,63. TENANG lebih efisien." },
          { kind: "stdout_matches", task: "t2", pattern: "pemenang=TENANG", label: "Pemenang = TENANG", msg: "Return GEBYAR lebih besar, tapi tiap persen guncangannya dibayar lebih buruk." },
        ],
      },
      reference: "Sharpe = (r̄ − rf)/σ. Sortino hanya menghukum downside. MaxDD = luka terdalam dari puncak.",
    },
    {
      id: "kuis-cepat",
      eyebrow: "Langkah 4 · Uji cepat",
      title: "Cek pemahaman sejauh ini",
      prose: [
        "Dua pertanyaan tentang asimetri rugi dan log return.",
      ],
      tasks: [],
      quiz: [
        {
          q: "Rp100 jt naik 50% lalu turun 50%. Nilai akhir?",
          options: [
            { text: "Rp100 jt (impas)", why: "Salah: 1,5 × 0,5 = 0,75 — bukan 1." },
            { text: "Rp75 jt — asimetri rugi!", why: "Benar: 100 × 1,5 = 150; 150 × 0,5 = 75. Rugi 50% butuh untung 100% untuk pulih.", correct: true },
            { text: "Rp125 jt", why: "Salah: itu jika +50% lalu +50% lagi." },
            { text: "Rp50 jt", why: "Salah: itu jika turun 50% dua kali." },
          ],
        },
        {
          q: "Kenapa analis kuantitatif memakai log return untuk agregasi?",
          options: [
            { text: "Karena lebih besar angkanya", why: "Salah: log return justru sedikit lebih kecil dari simple untuk gerakan naik." },
            { text: "Karena log return bisa dijumlah antar periode dengan benar", why: "Benar: jumlah log return = log return total. Simple return menyesatkan jika dijumlah.", correct: true },
            { text: "Karena wajib oleh OJK", why: "Salah: tidak ada ketentuan seperti itu." },
            { text: "Tidak ada alasan", why: "Salah: alasannya = aditivitas yang jujur." },
          ],
        },
      ],
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Metrik mana untuk apa?",
      prose: [
        "Bandingkan dua reksa dana sejenis → Sharpe ratio: menormalkan return terhadap guncangan — apel vs apel yang adil. Strategi return asimetris (proteksi downside) → Sortino: Sharpe menghukum upside; Sortino hanya menghukum downside.",
        "“Sanggupkah aku menahannya?” → Max drawdown + durasi pemulihan: statistik tidak begadang — manusia yang begadang. MaxDD = skenario terburuk historis yang harus kamu bayangkan terjadi padamu. Agregasi return multi-periode / riset → log return: aditif dan simetris.",
        "Aturan 10 detik: return tanpa risiko = dongeng. Selalu tanya: vol-nya? Sharpe-nya? MaxDD-nya? Rugi 50% butuh untung 100% untuk pulih — lindungi downside dulu.",
      ],
      tasks: [],
      reference: "Sharpe = efisiensi. Sortino = downside. MaxDD = pengalaman. Log return = agregasi.",
    },
    {
      id: "return-lanjut",
      eyebrow: "Langkah 6 · Pendalaman: geometris & Sharpe",
      title: "Geometris vs aritmatika: kapan Sharpe berbohong",
      prose: [
        "+60% lalu −25%: rata-rata aritmatikanya (60 − 25) ÷ 2 = 17,5% — terdengar hebat. Tapi uangmu: 1,60 × 0,75 = 1,20, alias CAGR (geometric mean) cuma 9,7%. Selisih 7,8 poin persentase itu bernama volatility drag — secara matematis, r_geometris ≈ r_aritmatika − σ²/2. Makin liar ayunannya, makin besar pajak yang dicuri volatilitas dari return-mu. Untuk horizon multi-periode, aritmatika adalah kebohongan yang sopan; geometris adalah kebenaran yang masuk kantong.",
        "Drawdown punya matematika yang kejam: turun 10% butuh naik 11% untuk pulih; turun 25% butuh 33%; turun 50% butuh 100%. Inilah kenapa manajer legendaris terobsesi bukan pada return, melainkan pada menghindari kerugian besar — “aturan nomor satu: jangan rugi” bukan gaya-gayaan, melainkan aritmatika.",
        "Kapan Sharpe menipu? Pertama, saat return tidak normal: strategi short-volatility bisa mencetak Sharpe 2,5 bertahun-tahun — premi kecil yang stabil — lalu −80% dalam sebulan (kecelakaan 2018 “Volmageddon”). Skew negatif + Sharpe tinggi = bom waktu berbungkus statistik cantik. Kedua, Sharpe disetahunkan dari data bulanan tanpa memperhatikan autokorelasi. Ketiga, survivorship: dana yang mati tidak ikut dihitung. Pelengkap wajib: Sortino (hanya menghukum downside) dan Calmar (return ÷ max drawdown) — tiga wasit lebih jujur dari satu.",
        "Aturan praktis: (1) horizon > 1 periode → selalu pakai geometris/CAGR; (2) Sharpe > 2 dengan skew negatif = selidiki ekornya sebelum kagum; (3) tanya max drawdown SEBELUM tanya return — drawdown adalah pengalaman investor, Sharpe hanyalah statistik.",
      ],
      formula: String.raw`r_{geo} \approx r_{arit} - \frac{\sigma^2}{2} \qquad \text{pulih dari } -x\% = \frac{x}{100-x} \times 100\%`,
      formulaNote: "r_geo = geometric mean (CAGR — yang masuk kantong); r_arit = rata-rata aritmatika; σ = volatilitas — makin besar σ, makin besar drag. Rumus pulih: turun 50% → 50÷50×100% = butuh naik 100%. Contoh: r_arit 17,5%, σ 42,5% → r_geo ≈ 17,5% − 9,0% = 8,5% (aktual 9,7% — aproksimasi, tetapi pesannya sama: drag itu nyata).",
      tasks: [],
      note: {
        title: "Intuisi: return yang tidak bisa dipegang = bukan return",
        body: "Laporan bisa memamerkan “rata-rata 17,5%”, tetapi yang bisa kamu belanjakan hanyalah CAGR — dan keduanya bisa beda jauh. Empat heuristik. Pertama: untuk uang multi-tahun, lupakan aritmatika — CAGR-lah yang menentukan saldo akhir; aritmatika hanya berguna untuk ekspektasi satu periode ke depan. Kedua: drawdown adalah pengalaman, bukan statistik — portofolio yang “akhirnya” untung 20% tetapi sempat −40% di tengah telah membuat sebagian investornya cut loss di dasar; return yang tidak bisa dipertahankan = return yang tidak pernah dinikmati. Ketiga: Sharpe tanpa skew itu setengah wasit — strategi yang “stabil” 5 tahun lalu hancur sebulan hampir selalu punya skew negatif yang bisa kamu lihat dari awal kalau mau; Volmageddon 2018 tidak datang tanpa peringatan, ia datang tanpa pembaca peringatan. Keempat: volatility drag itu pajak pasti — r_geo ≈ r_arit − σ²/2 berarti setiap tambahan ayunan mencuri return; dua dana dengan return rata-rata sama, yang lebih tenang menang. Aturan 10 detiknya: CAGR dulu, max drawdown kedua, Sharpe ketiga — urutan bertanya yang benar.",
      },
      reference: "CAGR = yang masuk kantong. Sharpe + skew negatif = selidiki ekornya.",
    },
    {
      id: "minicase-gebyar-tenang",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Dana GEBYAR vs Dana TENANG: siapa pemenang 3 tahun?",
      prose: [
        "Dana GEBYAR (agresif): +60%, −25%, +10% selama 3 tahun. Dana TENANG (konservatif): +12%, +11%, +13%. Brosur GEBYAR menonjolkan “rata-rata return 15% per tahun” (aritmatika) vs TENANG yang “hanya” 12%.",
        "Pertanyaan: (a) Hitung CAGR (geometric mean) masing-masing. (b) Berapa max drawdown GEBYAR? (c) Kamu menabung untuk pensiun 10 tahun lagi — pilih yang mana?",
        "Pembahasan: (a) GEBYAR: (1,60 × 0,75 × 1,10)^(1/3) − 1 = 9,7%. TENANG: (1,12 × 1,11 × 1,13)^(1/3) − 1 = 12,0%. “Rata-rata 15%” GEBYAR adalah ilusi aritmatika — uang nyatanya tumbuh 9,7%/tahun, KALAH dari TENANG. (b) Puncak 1,60 → lembah 1,20 = −25% — di titik itu banyak investor GEBYAR cut loss dan tidak pernah merasakan pemulihan. (c) TENANG: return LEBIH TINGGI dengan guncangan minimal — inilah kenapa profesional membandingkan CAGR dan drawdown, bukan rata-rata brosur.",
      ],
      tasks: [],
      reference: "Brosur memakai aritmatika; kantongmu memakai geometris.",
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
        "Simple return untuk komunikasi; log return untuk agregasi/riset (aditif & jujur).",
        "Volatilitas = SD return (tahunan: ×√252 harian / ×√12 bulanan) — pengukur guncangan.",
        "Sharpe = (r̄ − rf)/σ — return per satuan guncangan; >1 bagus, tapi buta tail risk.",
        "Sortino — seperti Sharpe tapi hanya menghukum downside. MaxDD — luka terdalam dari puncak; ukur juga durasi pemulihannya.",
        "Rugi 50% butuh untung 100% untuk pulih — lindungi downside dulu.",
      ],
      next: { label: "E8 — Markowitz", href: "/learn/e8-markowitz" },
      quiz: [
        {
          q: "Portofolio return 12%, vol 10%, risk-free 5%. Sharpe?",
          options: [
            { text: "1,2", why: "Salah: itu 12/10 — lupa mengurangkan risk-free." },
            { text: "0,7 ((12−5)/10)", why: "Benar: kelebihan return 7% dibagi vol 10%.", correct: true },
            { text: "1,7", why: "Salah: itu (12+5)/10 — risk-free dikurangkan, bukan ditambah." },
            { text: "0,5", why: "Salah: tidak ada dasarnya dari angka yang ada." },
          ],
        },
        {
          q: "Strategi punya Sharpe 2,5 tapi MaxDD tidak diketahui. Respons tepat?",
          options: [
            { text: "Langsung investasi — Sharpe luar biasa", why: "Salah: Sharpe tinggi + MaxDD tidak diketahui = curigai." },
            { text: "Curigai: minta underwater chart & MaxDD — Sharpe buta terhadap tail risk", why: "Benar: profil “jual asuransi” punya Sharpe tinggi sampai kiamatnya tiba.", correct: true },
            { text: "Sharpe tidak penting", why: "Salah: Sharpe penting — tapi tidak cukup sendirian." },
            { text: "Minta return-nya saja", why: "Salah: return tanpa risiko = dongeng." },
          ],
        },
        {
          q: "Kapan Sortino lebih tepat dari Sharpe?",
          options: [
            { text: "Selalu", why: "Salah: untuk return simetris, Sharpe sudah cukup." },
            { text: "Tidak pernah", why: "Salah: Sortino berguna untuk return asimetris." },
            { text: "Saat return asimetris — volatilitas ke atas adalah tujuan, hanya downside yang ditakuti", why: "Benar: Sortino hanya menghukum downside volatility.", correct: true },
            { text: "Saat risk-free nol", why: "Salah: risk-free nol tidak mengubah pilihan Sharpe vs Sortino." },
          ],
        },
        {
          q: "Underwater chart menunjukkan MaxDD −22% dengan pemulihan 7 bulan. Artinya…",
          options: [
            { text: "Strategi rugi 22% per tahun", why: "Salah: MaxDD bukan return tahunan." },
            { text: "Pernah ada periode jatuh 22% dari puncak dan butuh 7 bulan kembali ke puncak", why: "Benar: drawdown = jarak dari puncak terakhir — ukuran pengalaman investor.", correct: true },
            { text: "Strategi bangkrut", why: "Salah: −22% jauh dari bangkrut." },
            { text: "Volatilitas 22%", why: "Salah: drawdown ≠ volatilitas." },
          ],
        },
      ],
    },
  ],
};
