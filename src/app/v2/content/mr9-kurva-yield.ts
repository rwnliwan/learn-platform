import type { V2Lesson } from "../lib/types";

export const mr9: V2Lesson = {
  slug: "mr9-kurva-yield",
  track: "Market Risk",
  module: "Risiko Suku Bunga",
  title: "MR9 — Kurva Yield: Membaca Bahasa Suku Bunga Antar Waktu",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-resesi",
      eyebrow: "Langkah 1 · Bentuk kurva",
      title: "Cerita: kurva yang memprediksi resesi",
      prose: [
        "2006. Kurva yield AS inverted — yield 2 tahun (5,1%) lebih tinggi dari yield 10 tahun (4,7%). Para ekonom resah: setiap inversi sejak 1970-an didahului resesi dalam 12–18 bulan. Para trader obligasi bersorak: mereka membeli long bond dan untung besar saat The Fed akhirnya memangkas suku bunga. Risk manager sebuah bank mengabaikannya: itu cuma bentuk kurva — portofolio kami duration-netral.",
        "2008: resesi datang, kurva re-steepen brutal, dan posisi duration-netral mereka — yang ternyata bertaruh pada bentuk kurva (netral terhadap pergeseran paralel tetapi terekspos pada perubahan bentuknya) — berdarah. Twist-nya: kurva yield bukan sekadar grafik — ia agregat ekspektasi pasar tentang masa depan: ekspektasi suku bunga, inflasi, dan premi risiko, untuk setiap titik waktu. Membaca kurva = membaca pikiran kolektif pasar.",
        "Tiga bentuk utama: normal (menanjak) — yield naik dengan tenor, kompensasi risiko waktu + ekspektasi pertumbuhan, kondisi sehat biasa. Inverted — yield pendek > yield panjang: pasar berekspektasi suku bunga akan turun (biasanya karena resesi → bank sentral memangkas), prediktor resesi yang terkenal akurat. Flat/humped — transisi: pasar tidak yakin arah, atau ada tekanan beli/jual di segmen tertentu. Jangan hafal bentuk — baca ceritanya: ekspektasi + premi risiko = bentuk.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan makna ekonomi tiap bentuk kurva: normal, inverted, flat." },
        { id: "t2", text: "Kenapa inversi menjadi prediktor resesi?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mengira yield 10 tahun = ekspektasi suku bunga rata-rata 10 tahun. Yield = ekspektasi + premi risiko (term premium): investor meminta kompensasi ekstra untuk mengunci uang 10 tahun (risiko inflasi, likuiditas). Mengabaikan term premium membuatmu salah membaca ekspektasi pasar.",
        type: "pitfall",
      },
      reference: "Normal = sehat. Inverted = pasar mencium resesi. Flat = transisi/tidak yakin.",
    },
    {
      id: "bootstrapping",
      eyebrow: "Langkah 2 · Bootstrapping",
      title: "Dari par yield ke zero rate",
      prose: [
        "Pasar mengkuotasi par yield — yield obligasi berkupon yang harganya par (100). Tetapi untuk valuasi yang benar kita butuh zero rate z_t: rate untuk satu arus kas di waktu-t, tanpa kupon antara. Bootstrapping menurunkannya secara rekursif: 100 = Σ C/(1+z_i)^i + (100+C)/(1+z_t)^t, dengan C = kupon tahunan = par yield × 100.",
        "Cara kerja: mulai dari tenor terpendek (z_1 = par yield 1Y — tidak ada kupon antara), lalu untuk t=2 kupon tahun-1 didiskon dengan z_1 yang sudah diketahui, sisa persamaan diselesaikan untuk z_2. Begitu seterusnya — menarik diri dengan tali sepatu sendiri. Contoh: par 1Y = 5%, 2Y = 5,4%. Langkah 1: z_1 = 5%. Langkah 2: 100 = 5,4/1,05 + 105,4/(1+z_2)² → 105,4/(1+z_2)² = 94,857 → z_2 = 5,41%.",
        "Zero 2Y (5,41%) sedikit di atas par 2Y (5,40%) — pola umum untuk kurva menanjak (dan sebaliknya untuk inverted). Kenapa repot-repot? Mendiskon semua arus kas dengan satu YTM salah secara teori — tiap arus kas terjadi di waktu berbeda dan harus didiskon dengan rate tenornya masing-masing. Untuk obligasi biasa selisihnya kecil; untuk derivatif suku bunga dan valuasi presisi, zero curve adalah fondasi yang tidak bisa ditawar.",
      ],
      formula: String.raw`100 = \sum_{i=1}^{t-1} \frac{C}{(1+z_i)^i} + \frac{100 + C}{(1+z_t)^t}`,
      formulaNote: "100 = harga par obligasi; C = kupon tahunan (= par yield × 100); z_i = zero rate yang sudah diketahui dari langkah sebelumnya — kupon antara selalu didiskon dengan z_i; z_t = zero rate yang sedang dicari.",
      tasks: [
        { id: "t1", text: "Hitung `z2` (zero rate 2Y, desimal) dari par yield yang diberikan" },
        { id: "t2", text: "Cetak `z2` dalam persen dengan `print`" },
      ],
      expected: "z2=5.41%",
      note: {
        title: "Sering salah",
        body: "Mendiskon kupon tahun-1 dengan z_2 yang sedang dicari (persamaan melingkar). Kupon antara selalu didiskon dengan zero rate yang sudah diketahui dari langkah sebelumnya — itulah inti rekursi bootstrapping.",
        type: "pitfall",
      },
      hints: [
        "z1 = par_1y langsung (tidak ada kupon antara).",
        "Sisa untuk dilunasi di tahun-2: 100 − kupon_2y/(1+z1). Lalu z2 = sqrt(105.4/sisa) − 1.",
        "Perlu import math untuk sqrt.",
      ],
      code: {
        starter: `import math\n\npar_1y, par_2y = 0.05, 0.054  # par yield 1Y dan 2Y\nkupon_2y = par_2y * 100\n\n# TULIS KODEMU: zero rate 1Y dan 2Y (desimal)\nz1 = \nz2 = \n\nprint(f"z2={z2:.2%}")`,
        lockLines: 4,
        solution: `import math\n\npar_1y, par_2y = 0.05, 0.054  # par yield 1Y dan 2Y\nkupon_2y = par_2y * 100\n\n# TULIS KODEMU: zero rate 1Y dan 2Y (desimal)\nz1 = par_1y\nz2 = math.sqrt((100 + kupon_2y) / (100 - kupon_2y / (1 + z1))) - 1\n\nprint(f"z2={z2:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "z1", value: 0.05, tol: 1e-9, label: "`z1` seharusnya 0.05", msg: "z_1 = par yield 1Y langsung — tidak ada kupon antara." },
          { kind: "equal", task: "t1", name: "z2", value: 0.054108, tol: 0.0005, label: "`z2` seharusnya ~0.0541", msg: "√(105,4/94,857) − 1. Kupon tahun-1 didiskon dengan z_1." },
          { kind: "stdout_matches", task: "t2", pattern: "z2=5\\.41%", label: "`print` menampilkan z2", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Bootstrap: z_1 = par 1Y; z_t dari persamaan par dengan z_{<t} yang diketahui.",
    },
    {
      id: "nelson-siegel",
      eyebrow: "Langkah 3 · Nelson-Siegel",
      title: "Empat parameter untuk seluruh kurva",
      prose: [
        "Alih-alih menyimpan puluhan titik, model Nelson-Siegel memadatkan seluruh kurva menjadi 4 parameter: y(τ) = β_0 + β_1·(1−e^(−τ/λ))/(τ/λ) + β_2·((1−e^(−τ/λ))/(τ/λ) − e^(−τ/λ)). β_0 = level (yield jangka sangat panjang, tempat kurva bermuara); β_1 = slope (negatif → menanjak/normal, positif → inverted — tanda β_1 adalah tanda tangan bentuk kurva); β_2 = curvature (punuk di tenor menengah); λ = decay (seberapa cepat efek slope/curvature memudar, menentukan lokasi punuk).",
        "Kenapa 4 parameter cukup? Kurva yield dunia nyata halus dan berdimensi rendah — tidak bergerigi acak. Empat parameter menangkap semua bentuk ekonomis relevan sekaligus anti-noise: titik pasar yang anomali tidak merusak seluruh kurva. Kegunaan praktis: interpolasi (butuh rate 4,5Y? baca dari kurva), ekstrapolasi hati-hati ke tenor panjang, dan skenario — shock β_0/β_1/β_2 = skenario level/slope/curvature yang konsisten dan ekonomis (berguna untuk stress test skenario yang konsisten).",
        "Contoh: β_0=5%, β_1=−2%, β_2=1%, λ=2. Hitung yield 10 tahun: x = 10/2 = 5; faktor slope = (1−e^−5)/5 ≈ 0,1987; faktor curvature ≈ 0,1919; y(10) = 5% − 2%×0,1987 + 1%×0,1919 ≈ 4,79%. Kurvanya: y(1) ≈ 3,61%, y(10) ≈ 4,79%, y(30) ≈ 4,93% — normal menanjak yang memudar, persis intuisi β_1 negatif.",
      ],
      formula: String.raw`y(\tau) = \beta_0 + \beta_1\frac{1-e^{-\tau/\lambda}}{\tau/\lambda} + \beta_2\left(\frac{1-e^{-\tau/\lambda}}{\tau/\lambda} - e^{-\tau/\lambda}\right)`,
      formulaNote: "y(τ) = yield tenor τ; β_0 = level (yield jangka sangat panjang); β_1 = slope — negatif = kurva menanjak (normal), positif = inverted; β_2 = curvature (punuk tenor menengah); λ = decay — menentukan lokasi punuk.",
      tasks: [
        { id: "t1", text: "Hitung `y10` (yield 10Y, desimal) dari parameter Nelson-Siegel" },
        { id: "t2", text: "Cetak `y10` dalam persen dengan `print`" },
      ],
      expected: "y10=4.79%",
      note: {
        title: "Sering salah",
        body: "Memaksa fitting saat satu titik pasar jauh menyimpang (error besar di satu tenor). Seperti JPEG, Nelson-Siegel brilian untuk pola halus tetapi gagal untuk pola aneh (kink tajam karena regulasi). Kalau fit error besar di satu titik, jangan paksa — selidiki: mungkin ada informasi pasar di anomali itu.",
        type: "pitfall",
      },
      hints: [
        "x = tau/lam; f1 = (1-exp(-x))/x; f2 = f1 - exp(-x). Perlu import math.",
        "y10 = beta0 + beta1*f1 + beta2*f2.",
        "Beta1 negatif → kurva menanjak; hasilnya harus di bawah beta0 (5%).",
      ],
      code: {
        starter: `import math\n\nbeta0, beta1, beta2, lam = 0.05, -0.02, 0.01, 2.0\ntau = 10.0\n\n# TULIS KODEMU: yield Nelson-Siegel di tenor tau (desimal)\ny10 = \n\nprint(f"y10={y10:.2%}")`,
        lockLines: 4,
        solution: `import math\n\nbeta0, beta1, beta2, lam = 0.05, -0.02, 0.01, 2.0\ntau = 10.0\n\n# TULIS KODEMU: yield Nelson-Siegel di tenor tau (desimal)\nx = tau / lam\nf1 = (1 - math.exp(-x)) / x\nf2 = f1 - math.exp(-x)\ny10 = beta0 + beta1 * f1 + beta2 * f2\n\nprint(f"y10={y10:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "y10", value: 0.047946, tol: 0.0005, label: "`y10` seharusnya ~0.0479", msg: "5% − 2%×0,1987 + 1%×0,1919. Cek tanda beta1." },
          { kind: "stdout_matches", task: "t2", pattern: "y10=4\\.79%", label: "`print` menampilkan y10", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "β_0 level, β_1 slope (tanda = bentuk), β_2 curvature, λ decay. 4 parameter, anti-noise.",
    },
    {
      id: "pca",
      eyebrow: "Langkah 4 · PCA",
      title: "Tiga gerakan kurva",
      prose: [
        "PCA pada perubahan yield historis menemukan ~95%+ pergerakan kurva dijelaskan hanya 3 komponen: PC1 level (seluruh kurva naik/turun bersama = parallel shift, ~80–90% variasi), PC2 slope (short-end vs long-end berlawanan = twist/steepening/flattening, ~5–10%), PC3 curvature (tenor menengah vs ujung-ujung = butterfly, ~2–3%).",
        "Penting untuk risiko: alih-alih mensimulasikan 10 titik kurva yang berkorelasi rumit, cukup simulasikan 3 faktor independen (skor PCA) lalu petakan kembali ke kurva. Ini fondasi VaR Monte Carlo untuk risiko suku bunga yang efisien — dan penjelasan teoritis mengapa sensitivitas per titik tenor kunci (key-rate duration) bisa diringkas menjadi 3 angka. Stress test twist = shock PC2; butterfly = shock PC3.",
        "Perhatikan juga: PC1 ≈ parallel shift menjelaskan mengapa duration — ukuran sensitivitas yang mengasumsikan parallel shift — bekerja cukup baik sebagian besar waktu. Tetapi 10–15% sisanya adalah slope/curvature — dan justru di situlah hedge duration-netral jebol (seperti cerita pembuka tentang posisi duration-netral yang berdarah saat kurva re-steepen).",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan tiga komponen PCA dan porsi variasi masing-masing." },
        { id: "t2", text: "Kenapa mensimulasikan yield 10Y saja tidak cukup untuk risiko suku bunga?" },
      ],
      note: {
        title: "Sering salah",
        body: "Mensimulasikan satu titik kurva (misal yield 10Y) untuk risiko suku bunga = mengasumsikan korelasi sempurna antar tenor. PCA menunjukkan 10–15% pergerakan adalah slope/curvature — justru di situlah hedge duration-netral jebol. Simulasi yang benar memakai minimal 3 faktor PCA.",
        type: "pitfall",
      },
      reference: "PC1 level ~85%, PC2 slope ~7%, PC3 curvature ~3%. Simulasikan 3 faktor, bukan 30 titik.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kurva mana, kapan",
      prose: [
        "Tiga keputusan. Pertama, valuasi presisi atau derivatif suku bunga (pricing swap, opsi suku bunga) → zero curve via bootstrapping: tiap arus kas didiskon dengan rate tenornya — satu-satunya cara yang benar secara teori; YTM tunggal hanya aproksimasi.",
        "Kedua, interpolasi, skenario, atau reporting → Nelson-Siegel: 4 parameter anti-noise; shock β_0/β_1/β_2 = skenario level/slope/curvature yang ekonomis; standar bank sentral (ECB, Fed). Ketiga, simulasi risiko atau VaR suku bunga (Monte Carlo multi-tenor, agregasi risiko) → PCA 3 faktor: efisien dan stabil dibanding mensimulasikan puluhan titik berkorelasi.",
        "Aturan 10 detik: pricing presisi → zero curve; kurva halus untuk skenario/laporan → Nelson-Siegel; simulasi risiko → PCA. Dan ingat jangkarnya: untuk kurva menanjak, zero rate > par yield di tenor yang sama (hasil bootstrapping) — kebalikannya untuk inverted.",
      ],
      tasks: [
        { id: "t1", text: "Butuh rate 4,5Y untuk valuasi swap. Metode apa?" },
        { id: "t2", text: "Butuh skenario twist yang konsisten untuk stress test. Metode apa?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Inversi 2022–2024 menjadi ramalan resesi yang (hampir) gagal — pasar menunggu resesi yang tak kunjung datang dalam 12–18 bulan klasik. Pelajarannya: prediktor historis yang kuat pun bisa meleset ketika struktur ekonomi berubah. Gunakan kurva sebagai sinyal, bukan ramalan — selalu pasangkan dengan analisis fundamental.",
        type: "risk",
      },
      reference: "Pricing → zero. Skenario/laporan → NS. Simulasi → PCA.",
    },
    {
      id: "minicase-inverted",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Kurva inverted dan portofolio bank",
      prose: [
        "Bank memiliki aset 15Y fixed-rate (KPR dan obligasi panjang) yang didanai liabilitas 1Y (deposito dan wholesale funding). Kurva inverted: bank membayar mahal di sisi pendek (5,1%) sementara aset panjang hanya menghasilkan 4,7%. Negative carry — margin tergerus sekarang.",
        "Risiko utamanya tiga lapis: negative carry hari ini (bayar pendek mahal), risiko bentuk kurva (portofolio long-duration + short-funded = taruhan besar pada slope — jika kurva re-steepen brutal, nilai aset jatuh sementara biaya dana tetap tinggi), dan korelasi dengan risiko kredit (inversi memprediksi resesi — tepat saat margin tertekan, kredit macet naik). Risiko market dan credit menyerang berurutan.",
        "Tiga respons: ukur eksposur slope/curvature eksplisit (sensitivitas per bucket tenor seperti key-rate duration, plus skenario kurva yang curam kembali) — bukan cuma duration total; siapkan rencana pendanaan darurat untuk skenario wholesale funding kering; dan cadangkan pencadangan kredit lebih awal — inversi adalah peringatan 12–18 bulan, gunakan waktunya, jangan tunggu resesinya.",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan tiga lapis risiko bank dalam mini-case ini." },
        { id: "t2", text: "Tuliskan respons untuk tiap lapis risiko." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Analisis kurva tidak bisa dipisahkan dari konteks bisnis: inversi menekan margin SEKARANG dan memprediksi kredit macet NANTI. Risk manager yang hanya melihat risiko suku bunga melewatkan separuh cerita — pasangan market-credit inilah yang membunuh bank di 2008.",
        type: "risk",
      },
      reference: "Inverted + mismatch tenor = negative carry + taruhan slope + resesi credit di depan.",
    },
    {
      id: "forward-rate",
      eyebrow: "Langkah 7 · Forward rate",
      title: "Membaca ekspektasi pasar dari kurva: forward rate",
      prose: [
        "Zero curve tidak cuma untuk mendiskon — ia menyimpan ekspektasi pasar tentang suku bunga masa depan. Forward rate f(t,T) adalah suku bunga yang tersirat hari ini untuk periode t sampai T di masa depan, diturunkan dari zero rate: (1+z_T)^T = (1+z_t)^t · (1+f)^{T−t}. Contoh: z_1 = 5%, z_2 = 5,41% → f(1,2) = (1,0541²/1,05) − 1 ≈ 5,82%. Pasar hari ini menyiratkan suku bunga 1 tahun, satu tahun dari sekarang, sekitar 5,82%.",
        "Interpretasi yang benar: forward rate = ekspektasi pasar tentang suku bunga masa depan + premi risiko (term premium). Jangan baca 5,82% sebagai ramalan pasti — ia ekspektasi berpremi. Kegunaan praktisnya tiga. Pertama, pricing: suku bunga mengambang (FRN, interest rate swap) di-pricing dari forward — pembayaran kupon variabel periode depan memakai forward hari ini. Kedua, proyeksi biaya dana: bank dengan pendanaan yang jatuh tempo bertahap memakai forward untuk mengestimasi biaya rollover. Ketiga, membaca ekspektasi kebijakan: forward jangka pendek yang turun tajam berarti pasar mempricing pemangkasan suku bunga acuan.",
        "Konteks Indonesia: kurva SBN (Surat Berharga Negara) adalah kurva acuan rupiah — lelang SBN, ORI/Sukuk Ritel, dan SRBI membentuk titik-titiknya. Forward dari kurva SBN dibaca pasar untuk mengantisipasi langkah BI: jika forward 1Y turun di bawah BI rate kini, pasar bertaruh BI akan memangkas. Tetapi ingat pelajaran term premium — forward yang tinggi bisa berarti ekspektasi kenaikan, atau sekadar premi risiko yang membesar di tengah ketidakpastian. Selalu tanyakan: ini ekspektasi, atau ini premi?",
        "Jebakan praktis: forward bukan janji — ia harga konsensus hari ini yang akan berubah besok. Memakai forward sebagai proyeksi tunggal tanpa skenario adalah kesalahan yang sama dengan memakai VaR sebagai kerugian maksimal: mengira harga pasar adalah ramalan. Forward yang benar dipakai sebagai jangkar skenario — lalu di-shock ke atas dan bawah.",
      ],
      formula: String.raw`(1+z_T)^T = (1+z_t)^t \cdot (1+f_{t,T})^{T-t}`,
      formulaNote: "z_T, z_t = zero rate tenor T dan t (diketahui dari bootstrapping); f_{t,T} = forward rate untuk periode t sampai T — suku bunga masa depan yang tersirat hari ini = ekspektasi pasar + premi risiko.",
      tasks: [
        { id: "t1", text: "Hitung forward f(1,2) dari z_1 = 5% dan z_2 = 5,41%." },
        { id: "t2", text: "Jelaskan dua kegunaan forward rate dan satu jebakan dalam membacanya." },
      ],
      note: {
        title: "Intuisi: kurva adalah pasar yang berbicara tentang masa depan — dengarkan dengan koreksi premi",
        body: "Kurva yield adalah konsensus pasar yang terkuantifikasi — tetapi konsensus berpremi, bukan ramalan. Enam heuristik. Pertama: setiap angka forward = ekspektasi + premi risiko; jangan pernah membaca ekspektasi tanpa mengoreksi premi — forward tinggi bisa berarti pasar takut, bukan pasar yakin. Kedua: pakai forward sebagai jangkar skenario, bukan proyeksi tunggal — shock ke atas dan bawah, seperti VaR butuh stress test. Ketiga: untuk pricing (swap, FRN), forward adalah kebenaran arbitrase — tidak ada ruang opini; untuk forecasting, forward hanyalah titik mulai yang jujur. Keempat: perhatikan siapa yang membentuk kurva acuanmu — kurva SBN dibentuk lelang, kebutuhan pendanaan pemerintah, dan aksi BI; pergerakan kurva tidak selalu murni ekspektasi pasar. Kelima: inversi dan forward yang aneh adalah undangan riset, bukan vonis — selidiki premi vs ekspektasi sebelum bertindak. Keenam: forward jangka pendek adalah cermin ekspektasi kebijakan moneter yang paling jujur — jika forward 1Y jauh di bawah suku bunga acuan kini, pasar sedang bertaruh pada pemangkasan; posisikan pendanaanmu sebelum taruhan itu menjadi keputusan. Aturan 10 detiknya: baca forward, koreksi premi, jadikan jangkar skenario — dan jangan pernah mengira harga konsensus adalah ramalan.",
      },
      reference: "Forward = ekspektasi + premi. Jangkar skenario & pricing, bukan ramalan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah — baca semuanya sebelum lanjut.",
      ],
      tasks: [],
      summary: [
        "Tiga bentuk: normal (sehat), inverted (pasar mencium resesi — prediktor 12–18 bulan), flat (transisi).",
        "Yield = ekspektasi + term premium. Jangan baca ekspektasi tanpa mengoreksi premi.",
        "Bootstrapping: par yield → zero rate rekursif; tiap arus kas didiskon dengan rate tenornya.",
        "Nelson-Siegel: β_0 level, β_1 slope (tanda = bentuk), β_2 curvature, λ decay — kompresi anti-noise.",
        "PCA: 3 komponen (level/slope/curvature) menjelaskan 95%+ — fondasi simulasi VaR suku bunga.",
        "Untuk kurva menanjak: zero rate > par yield di tenor yang sama.",
      ],
      next: { label: "MR10 — IRRBB", href: "/v2/learn/mr10-irrbb" },
      quiz: [
        {
          q: "Kurva inverted (2Y > 10Y) secara ekonomi berarti?",
          options: [
            { text: "Pasar optimis pertumbuhan", why: "justru sebaliknya." },
            { text: "Pasar berekspektasi suku bunga turun (biasanya karena resesi di depan) — prediktor resesi klasik", why: "inversi = pasar bersedia menerima yield panjang lebih rendah karena yakin suku bunga pendek akan turun saat resesi.", correct: true },
            { text: "Tidak ada artinya", why: "rekam jejak prediksinya kuat sejak 1970-an." },
            { text: "Bank sentral pasti menaikkan suku bunga", why: "inversi justru mengantisipasi pemangkasan." },
          ],
        },
        {
          q: "Mengapa perlu bootstrapping dari par yield ke zero rate?",
          options: [
            { text: "Agar angkanya lebih besar", why: "bukan soal ukuran angka." },
            { text: "Tiap arus kas terjadi di waktu berbeda → harus didiskon dengan rate tenornya masing-masing; YTM tunggal salah secara teori", why: "zero rate = fondasi valuasi yang benar, tidak bisa ditawar untuk derivatif dan valuasi presisi.", correct: true },
            { text: "Regulator memaksa", why: "ini kebutuhan teori valuasi, bukan kepatuhan." },
            { text: "Supaya terlihat canggih", why: "ini kebutuhan teknis nyata." },
          ],
        },
        {
          q: "Dalam Nelson-Siegel, β₁ positif berarti?",
          options: [
            { text: "Kurva menanjak (normal)", why: "itu β₁ negatif." },
            { text: "Kurva inverted — komponen slope positif menaikkan yield pendek di atas level jangka panjang", why: "tanda β₁ adalah tanda tangan bentuk kurva — cara cepat membaca hasil fitting.", correct: true },
            { text: "Ada punuk besar", why: "punuk adalah β₂." },
            { text: "Kurva flat", why: "flat berarti β₁ ≈ 0." },
          ],
        },
        {
          q: "PCA kurva yield: 3 komponen menjelaskan 95%+ pergerakan. Implikasinya untuk simulasi VaR?",
          options: [
            { text: "Tetap simulasikan 30 titik kurva", why: "tidak efisien dan bermasalah korelasi." },
            { text: "Cukup simulasikan 3 faktor independen (level/slope/curvature) lalu petakan kembali — efisien dan stabil", why: "3 faktor menangkap hampir semua pergerakan — Monte Carlo jauh lebih efisien.", correct: true },
            { text: "PCA tidak berguna untuk risiko", why: "justru fondasi simulasi risiko suku bunga." },
            { text: "Hanya pakai PC1", why: "10–15% slope/curvature justru tempat hedge jebol." },
          ],
        },
        {
          q: "Untuk kurva menanjak, hubungan zero rate vs par yield di tenor yang sama?",
          options: [
            { text: "Zero < par", why: "arahnya terbalik." },
            { text: "Zero > par — kupon awal didiskon dengan rate pendek yang rendah, jadi rate panjang harus lebih tinggi agar harga tetap par", why: "konsekuensi matematis struktur arus kas dari bootstrapping.", correct: true },
            { text: "Sama persis", why: "hanya sama di tenor 1Y." },
            { text: "Acak", why: "hubungannya sistematis." },
          ],
        },
      ],
    },
  ],
};
