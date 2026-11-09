import type { V2Lesson } from "../lib/types";

export const mr4: V2Lesson = {
  slug: "mr4-var-lanjut",
  track: "Market Risk",
  module: "VaR & Backtesting",
  title: "MR4 — VaR Lanjut: Filtered HS, Delta-Gamma, dan Bedah Kontribusi Risiko",
  estMinutes: 70,
  steps: [
    {
      id: "cerita-var-menyesatkan",
      eyebrow: "Langkah 1 · Dua masalah VaR",
      title: "Cerita: VaR yang benar tapi menyesatkan",
      prose: [
        "Desk derivatif sebuah bank melaporkan VaR 99% harian Rp12 miliar — dihitung dengan Historical Simulation 250 hari, sesuai prosedur. Angka itu lolos backtest, disetujui validator, dipakai untuk limit. Semua lampu hijau. Lalu datang hari di mana indeks jatuh 4%. Kerugian desk: Rp47 miliar — hampir 4× VaR.",
        "Investigasi menemukan dua hal sekaligus. Pertama, 250 hari data mereka 80%-nya berasal dari masa tenang — VaR mengencerkan krisis dengan ketenangan. Kedua, desk itu memegang opsi jual (short put) dalam jumlah besar: saat pasar jatuh, kerugian membesar kuadratik, bukan linear — sesuatu yang HS biasa tangkap hanya samar-samar, dan VaR delta-only tidak tangkap sama sekali.",
        "Twist-nya: tidak ada yang salah hitung. Metodenya benar untuk portofolio linear di rezim stabil — tetapi portofolio ini tidak linear dan rezimnya sudah berubah. Lesson ini tentang tiga senjata untuk dua masalah itu: Filtered HS (perbaiki rezim), delta-gamma (perbaiki non-linearitas), dan component VaR (bedah siapa menyumbang apa).",
      ],
      tasks: [
        { id: "t1", text: "Sebutkan dua akar masalah dari cerita di atas dengan kata-katamu." },
        { id: "t2", text: "Pasangkan tiap masalah dengan senjatanya: Filtered HS, delta-gamma, atau component VaR?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Metode yang benar untuk portofolio yang salah adalah metode yang salah. Setiap angka VaR wajib ditemani pertanyaan: apakah portofolioku masih linear, dan apakah rezim dataku masih mewakili hari ini? Dua pertanyaan ini menangkap sebagian besar kecelakaan VaR sebelum terjadi.",
        type: "risk",
      },
      reference: "Dua masalah: rezim berubah (→ Filtered HS) dan non-linearitas (→ delta-gamma).",
    },
    {
      id: "filtered-hs",
      eyebrow: "Langkah 2 · Filtered HS",
      title: "Filtered HS: HS yang sadar rezim",
      prose: [
        "HS biasa memakai return historis mentah — mencampur masa tenang dan masa krisis seenaknya. Filtered HS menyesuaikan tiap return historis ke volatilitas kini sebelum dijadikan skenario: r*_t = (σ_T/σ_t) · r_t. Return +5% di masa tenang (σ=1%) sebenarnya kejutan 5-sigma — luar biasa ekstrem; di masa krisis (σ=2,5%) ia hanya kejutan 2-sigma.",
        "Intuisinya: Filtered HS memisahkan dua hal yang HS biasa campur aduk — bentuk distribusi (diambil dari histori: tetap non-parametrik, tetap menangkap fat tail) dan level volatilitas (diambil dari kini via EWMA/GARCH). Kompromi elegan: kejujuran empiris HS plus kewaspadaan rezim EWMA.",
        "Hasilnya: VaR Filtered HS lebih jujur tentang risiko besok karena ia bertanya bagaimana jika pola historis terjadi dalam kondisi pasar hari ini. Contoh kecil: lima return historis [2,0, −1,5, 3,0, −2,5, 1,0]% dengan volatilitas saat itu [1,0, 1,0, 2,0, 2,0, 2,0] dan volatilitas kini 2,0 (rezim krisis). Return masa tenang ditiup ke skala kini.",
      ],
      formula: String.raw`r^*_t = \frac{\sigma_T}{\sigma_t} \cdot r_t`,
      formulaNote: "r*_t = return historis yang sudah disesuaikan ke rezim kini; σ_T = volatilitas kini; σ_t = volatilitas saat return itu terjadi; r_t = return historis mentah.",
      tasks: [
        { id: "t1", text: "Hitung `worst_raw` = kerugian terburuk dari `rets` mentah (angka positif)" },
        { id: "t2", text: "Hitung `worst_filt` = kerugian terburuk setelah diskalakan ke vol kini, lalu cetak keduanya" },
      ],
      expected: "worst_raw=2.5  worst_filt=3.0",
      note: {
        title: "Sering salah",
        body: "Mengira Filtered HS selalu memberi VaR lebih besar. Arah penyesuaian tergantung rezim kini vs rata-rata historis: jika kini sedang tenang setelah krisis (σ_T kecil), Filtered HS justru memperkecil VaR. Ia bukan versi konservatif — ia versi sadar-rezim.",
        type: "pitfall",
      },
      hints: [
        "Skalakan tiap return: filtered_i = (sig_T / sig_hist[i]) * rets[i].",
        "Kerugian terburuk = -min(...) dari return yang sudah diskalakan, jadikan positif.",
        "filtered = [(sig_T/s)*r for r, s in zip(rets, sig_hist)]",
      ],
      code: {
        starter: `# Return historis (%) dan volatilitas yang berlaku saat itu\nrets = [2.0, -1.5, 3.0, -2.5, 1.0]\nsig_hist = [1.0, 1.0, 2.0, 2.0, 2.0]\nsig_T = 2.0  # volatilitas kini: rezim krisis\n\n# TULIS KODEMU\nworst_raw = \nworst_filt = \n\nprint(f"worst_raw={worst_raw}  worst_filt={worst_filt}")`,
        lockLines: 3,
        solution: `# Return historis (%) dan volatilitas yang berlaku saat itu\nrets = [2.0, -1.5, 3.0, -2.5, 1.0]\nsig_hist = [1.0, 1.0, 2.0, 2.0, 2.0]\nsig_T = 2.0  # volatilitas kini: rezim krisis\n\n# TULIS KODEMU\nworst_raw = -min(rets)\nfiltered = [(sig_T / s) * r for r, s in zip(rets, sig_hist)]\nworst_filt = -min(filtered)\n\nprint(f"worst_raw={worst_raw}  worst_filt={worst_filt}")`,
        checks: [
          { kind: "equal", task: "t1", name: "worst_raw", value: 2.5, tol: 1e-9, label: "`worst_raw` seharusnya 2.5", msg: "Return terburuk mentah = −2,5 → kerugian 2,5." },
          { kind: "equal", task: "t2", name: "worst_filt", value: 3.0, tol: 1e-9, label: "`worst_filt` seharusnya 3.0", msg: "−1,5 × (2,0/1,0) = −3,0 → kerugian 3,0. Return masa tenang ditiup ke skala krisis." },
          { kind: "stdout_matches", task: "t2", pattern: "worst_raw=2\\.5\\s+worst_filt=3\\.0", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "r*_t = (σ_T/σ_t)·r_t. Bentuk dari histori, level dari kini.",
    },
    {
      id: "delta-gamma",
      eyebrow: "Langkah 3 · Delta-gamma",
      title: "Orde-2 untuk dunia non-linear",
      prose: [
        "Untuk portofolio ber-opsi, hubungan nilai vs faktor melengkung. Aproksimasi Taylor orde-2 (delta-gamma): ΔV ≈ δ·ΔS + ½Γ(ΔS)². Delta adalah kemiringan kurva nilai, gamma adalah kelengkungannya — seberapa cepat delta berubah saat harga bergerak. Catatan: rumus ini masih mengabaikan vega — risiko perubahan volatilitas implisit (ν·Δσ). Untuk opsi, pergerakan vol bisa sama pentingnya dengan pergerakan harga; bila vega material, tambahkan suku νΔσ (menjadi delta-gamma-vega) atau pakai full Monte Carlo.",
        "Suku ½Γ(ΔS)² tumbuh kuadratik: untuk pergerakan kecil ia bisa diabaikan, tetapi untuk pergerakan besar ia mendominasi. Portofolio short gamma (menjual opsi) rugi besar saat pasar bergerak liar ke arah mana pun — VaR linear tidak melihat ini sama sekali. Contoh: δ = −200, Γ = −150 (short call), skenario ΔS = −12. Suku delta: −200 × (−12) = +2.400 (terlihat untung!). Suku gamma: 0,5 × (−150) × 144 = −10.800 — empat kali suku delta. Total ΔV = −8.400: rugi besar yang disembunyikan aproksimasi linear.",
        "Delta = kecepatan, gamma = akselerasi. Mengukur risiko opsi hanya dengan delta seperti mengukur bahaya mobil hanya dari kecepatannya — tanpa melihat apakah ia menginjak rem atau gas. Long gamma = rem otomatis (untung dari pergerakan besar); short gamma = gas pol saat jurang di depan.",
      ],
      formula: String.raw`\Delta V \approx \delta \cdot \Delta S + \tfrac{1}{2}\,\Gamma \cdot (\Delta S)^2 + \nu \cdot \Delta\sigma`,
      formulaNote: "ΔV = perubahan nilai portofolio; δ (delta) = kemiringan kurva nilai; ΔS = pergerakan harga aset; Γ (gamma) = kelengkungan — suku kedua tumbuh kuadratik dan mendominasi saat pergerakan besar; ν (vega) = sensitivitas terhadap volatilitas implisit; Δσ = perubahan volatilitas — suku vega jangan dilupakan bila vol bergerak.",
      tasks: [
        { id: "t1", text: "Hitung `dV_delta` (aproksimasi linear saja) untuk skenario `dS`" },
        { id: "t2", text: "Hitung `dV_dg` (delta-gamma), lalu cetak keduanya dan bandingkan" },
      ],
      expected: "dV_delta=2400  dV_dg=-8400",
      note: {
        title: "Sering salah",
        body: "Mengira delta kecil berarti risiko kecil. Portofolio delta-neutral tetapi short gamma (misal jual straddle) terlihat aman untuk pergerakan kecil — padahal ia jebakan volatilitas: rugi kuadratik saat pasar bergerak besar. Banyak bencana derivatif berasal dari posisi delta kecil yang gamma-nya mematikan. Selalu cek orde-2 — dan ingat rumus di lab ini belum memuat vega: bila volatilitas bergerak, tambahkan suku νΔσ.",
        type: "pitfall",
      },
      hints: [
        "dV_delta = delta * dS. Perhatikan tanda: delta negatif × dS negatif = positif.",
        "dV_dg = delta*dS + 0.5*gamma*dS**2.",
        "Bandingkan: linear bilang untung 2.400, orde-2 bilang rugi 8.400.",
      ],
      code: {
        starter: `# Portofolio short call: delta negatif kecil, gamma negatif BESAR\ndelta = -200.0\ngamma = -150.0\ndS = -12.0  # skenario: pasar jatuh\n\n# TULIS KODEMU\ndV_delta = \ndV_dg = \n\nprint(f"dV_delta={dV_delta:.0f}  dV_dg={dV_dg:.0f}")`,
        lockLines: 4,
        solution: `# Portofolio short call: delta negatif kecil, gamma negatif BESAR\ndelta = -200.0\ngamma = -150.0\ndS = -12.0  # skenario: pasar jatuh\n\n# TULIS KODEMU\ndV_delta = delta * dS\ndV_dg = delta * dS + 0.5 * gamma * dS ** 2\n\nprint(f"dV_delta={dV_delta:.0f}  dV_dg={dV_dg:.0f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "dV_delta", value: 2400, tol: 1e-9, label: "`dV_delta` seharusnya 2400", msg: "−200 × (−12) = +2.400. Linear bilang untung — waspadai." },
          { kind: "equal", task: "t2", name: "dV_dg", value: -8400, tol: 1e-9, label: "`dV_dg` seharusnya −8400", msg: "2.400 + 0,5×(−150)×144 = 2.400 − 10.800. Suku gamma empat kali suku delta." },
          { kind: "stdout_matches", task: "t2", pattern: "dV_delta=2400\\s+dV_dg=-8400", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "ΔV ≈ δΔS + ½Γ(ΔS)² + νΔσ. Short gamma: rugi kuadratik dua arah; vega jangan dilupakan.",
    },
    {
      id: "component-var",
      eyebrow: "Langkah 4 · Component VaR",
      title: "Siapa menyumbang risiko?",
      prose: [
        "VaR total Rp80 miliar dari lima desk — desk mana yang paling berkontribusi? Component VaR menjawab dengan memecah VaR total menjadi kontribusi tiap desk yang jumlahnya pas sama dengan VaR total (aditif). Contoh: component VaR lima desk berjumlah Rp80 M = VaR total, dengan Desk Rates = Rp30 M.",
        "Artinya: kontribusi Desk Rates ke VaR total adalah Rp30 M setelah memperhitungkan diversifikasi — bukan rugi kemarin, bukan limitnya. Desk dengan component terbesar adalah kandidat pertama untuk dipotong saat de-risking bila tujuannya penghematan risiko ABSOLUT terbesar. Jangan samakan dengan marginal VaR tertinggi (penghematan PER RUPIAH yang dipotong): component VaR = bobot × marginal VaR — desk dengan component terbesar belum tentu marginal-nya tertinggi.",
        "Dua metrik terkait: marginal VaR = turunan VaR terhadap bobot posisi (∂VaR/∂w_i) — menjawab trader yang bertanya kalau saya tambah Rp10 M di posisi X, VaR naik berapa? Standalone VaR posisi X mengabaikan korelasi dan akan salah besar. Dan manfaat diversifikasi = jumlah standalone VaR (Rp131 M) − VaR total (Rp80 M) = Rp51 M — yang akan menyusut saat korelasi melonjak di tengah krisis. Jangan pernah mengandalkan Rp51 M itu penuh.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan beda component VaR, marginal VaR, dan standalone VaR dalam satu kalimat masing-masing." },
        { id: "t2", text: "Desk mana yang dipotong pertama saat de-risking, dan kenapa?" },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Manfaat diversifikasi Rp51 M dihitung dari korelasi masa tenang. Saat krisis korelasi → 1 dan manfaat menguap — persis saat kamu paling membutuhkannya. Alokasi limit yang mengandalkan penuh angka diversifikasi sedang membangun di atas pasir.",
        type: "risk",
      },
      reference: "Component VaR aditif = total. Marginal VaR = ∂VaR/∂w untuk perubahan kecil.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Teknik lanjutan mana, kapan",
      prose: [
        "Empat keputusan. Pertama, HS biasa memberi VaR yang terasa tidak mewakili rezim kini (terlalu kecil di awal krisis, terlalu besar lama setelah krisis lewat) → Filtered HS: skalakan return historis ke volatilitas kini, pertahankan bentuk distribusi empiris.",
        "Kedua, portofolio mengandung opsi dengan gamma/vega material → delta-gamma-vega VaR (tambahkan suku νΔσ) atau full Monte Carlo: aproksimasi linear tidak cukup, suku kuadratik mendominasi saat pasar bergerak besar. Ketiga, VaR total perlu dipecah untuk limit dan de-risking → component & marginal VaR: kontribusi aditif per desk, turunan untuk perubahan kecil.",
        "Keempat, kebutuhan modal regulator pasca-2008 → Stressed VaR: VaR dihitung ulang memakai data periode krisis 12 bulan, lalu dijumlahkan ke VaR normal (Basel 2.5) — bank tidak bisa lagi bersembunyi di balik data masa tenang. Aturan 10 detik: rezim berubah → filter; non-linear → orde-2; multi-desk → bedah kontribusi; modal → stressed.",
      ],
      tasks: [
        { id: "t1", text: "Portofolio linear tetapi datanya 80% masa tenang dan kini pasar bergejolak. Teknik apa?" },
        { id: "t2", text: "Desk delta-neutral tetapi short gamma besar melaporkan VaR kecil. Apa yang kamu curigai?" },
      ],
      note: {
        title: "Sering salah",
        body: "Memakai Stressed VaR sebagai pengganti VaR normal. Basel 2.5 menjumlahkan keduanya — stressed VaR adalah tambahan, bukan pengganti. Modal harus menutupi kondisi normal dan kondisi stres sekaligus.",
        type: "pitfall",
      },
      reference: "Rezim → Filtered HS. Non-linear → delta-gamma. Multi-desk → component. Modal → stressed.",
    },
    {
      id: "minicase-desk-opsi",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Desk opsi yang aman menurut VaR linear",
      prose: [
        "Desk menjual straddle (short call + short put) dalam jumlah besar. Delta ≈ 0 — VaR delta-only nyaris nol. Laporan risiko bulanan: hijau. Trader mendapat bonus. Lalu indeks bergerak 4% dalam sehari — dua arah tidak penting, yang penting besar.",
        "Suku gamma negatif menghantam dari kedua sisi: ΔV ≈ 0 × ΔS + ½Γ(ΔS)² dengan Γ negatif besar. Kerugian kuadratik, bukan linear. Inilah jebakan volatilitas: strategi short-vol terlihat aman untuk pergerakan kecil dan membayar premi manis setiap hari tenang — sampai satu hari besar menghapus premi setahun.",
        "Tiga pertanyaan yang seharusnya ditanyakan risk manager sebelum menyetujui limit desk ini: berapa gamma-nya (bukan cuma delta)? Berapa VaR delta-gamma vs VaR delta-only — dan seberapa besar selisihnya? Skenario pergerakan ±4% memberi kerugian berapa (stress, bukan VaR)? Desk yang hanya bisa menjawab pertanyaan pertama belum layak dapat limit.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan kenapa VaR delta-only ≈ 0 untuk straddle short tetapi risikonya besar." },
        { id: "t2", text: "Tuliskan tiga pertanyaan risk manager sebelum menyetujui limit desk short-vol." },
      ],
      note: {
        title: "Kaitan ke risk",
        body: "Strategi short-vol adalah mesin pencetak premi di masa tenang dan mesin penghancur modal di masa krisis — profil yang sama dengan menjual proteksi kredit (premi kecil rutin, kerugian besar saat default terjadi). Pengawasan khusus: batasi gamma absolut, bukan cuma delta; wajibkan stress skenario pergerakan besar dua arah.",
        type: "risk",
      },
      reference: "Short gamma: untung kecil setiap hari tenang, rugi kuadratik saat pasar bergerak besar.",
    },
    {
      id: "cornish-fisher",
      eyebrow: "Langkah 7 · Cornish-Fisher",
      title: "VaR parametrik untuk dunia berekor tebal",
      prose: [
        "VaR parametrik memakai kuantil normal z = 2,33 — tetapi return pasar nyata berekor lebih tebal dan sering miring (skew). Ekspansi Cornish-Fisher memperbaiki kuantil normal memakai skewness (S) dan kurtosis berlebih (K) dari data: z_CF = z + (z²−1)S/6 + (z³−3z)K/24 − (2z³−5z)S²/36, lalu VaR = μ + σ·z_CF. Untuk distribusi normal (S=0, K=0), z_CF = z — rumus ini mundur dengan elegan ke parametrik biasa.",
        "Contoh: portofolio Rp200 juta, σ harian 1,2%, skewness return S = −0,8 (ekor kiri lebih tebal — khas ekuitas), kurtosis berlebih K = 3. Kuantil kiri 1% (z = −2,33) dihitung dengan tanda yang benar: koreksi skew = (z²−1)S/6 = (5,43−1)×(−0,8)/6 ≈ −0,59; koreksi kurt = (z³−3z)K/24 = (−12,65+6,99)×3/24 ≈ −0,71; koreksi silang = −(2z³−5z)S²/36 = −(−25,30+11,65)×0,64/36 ≈ +0,24. Total z_CF ≈ −2,33 − 0,59 − 0,71 + 0,24 ≈ −3,39 — besaran kuantil kerugian |z_CF| ≈ 3,39 (bukan 2,21 dan bukan 2,85 — kedua angka lama itu salah hitung tanda). VaR = Rp200 jt × 1,2% × 3,39 ≈ Rp8,13 juta, naik dari VaR normal Rp5,59 juta. Moral: jangan hafal tanda — hitung dengan z bertanda (kuantil kiri = negatif) dan uji kewarasannya dengan HS. Dan satu koreksi atas moral lama: VaR CF TIDAK selalu ≥ VaR normal saat ekor tebal — CF bisa di bawah normal bila skew positif mendominasi (ekor kiri lebih tipis); arahnya tergantung tanda skew dan kurtosis, bukan sekadar “ekor tebal”.",
        "Kapan Cornish-Fisher bekerja: skew/kurtosis moderat dan distribusi unimodal — jembatan murah antara kecepatan parametrik dan kejujuran HS. Kapan ia gagal: ekor sangat ekstrem (koreksi orde-4 bisa membuat kuantil tidak monoton — z_CF turun saat α naik, hasil absurd), distribusi multimodal, atau risiko lompatan kredit (payoff diskrit tidak bisa didekati polinomial halus). Aturan praktisi: selalu bandingkan VaR CF dengan HS — selisih kecil = asumsi sehat; selisih besar = salah satunya bohong, investigasi. CF adalah tambalan cerdas untuk parametrik, bukan pengganti pemikiran tentang bentuk distribusi.",
      ],
      formula: String.raw`z_{CF} = z + \frac{z^2-1}{6}S + \frac{z^3-3z}{24}K - \frac{2z^3-5z}{36}S^2`,
      formulaNote: "z_CF = kuantil terkoreksi; z = kuantil normal (2,33 untuk 99%); S = skewness (negatif = ekor kiri tebal); K = kurtosis berlebih (0 = normal); VaR = μ + σ·z_CF — gagal bila ekor terlalu ekstrem (kuantil tidak monoton).",
      tasks: [
        { id: "t1", text: "Jelaskan kenapa VaR Cornish-Fisher BISA di atas atau di bawah VaR parametrik biasa — dan kapan ia di atas (skew negatif / kurtosis besar pada kuantil kiri)." },
        { id: "t2", text: "Sebutkan dua kondisi ketika Cornish-Fisher gagal dan apa yang dipakai sebagai gantinya." },
      ],
      note: {
        title: "Intuisi: tambal parametrik dengan bentuk ekor, bukan dengan angka lebih besar",
        body: "Cornish-Fisher adalah contoh pola pikir senior: perbaiki asumsi yang retak, jangan gemukkan angka. Enam heuristik. Pertama: VaR parametrik retak bukan karena angkanya kecil, melainkan karena bentuk distribusinya salah — obatnya koreksi bentuk (skew/kurtosis), bukan multiplier sembarang. Kedua: setiap koreksi aproksimasi punya wilayah validitas — CF bekerja untuk ekor moderat; di luar itu ia menghasilkan absurditas matematis (kuantil tidak monoton), jadi selalu uji kewarasan hasilnya. Ketiga: bandingkan minimal dua metode yang filosofinya berbeda (parametrik vs historis) — jika keduanya sepakat, kepercayaan naik; jika bertengkar, pertengkarannya adalah informasinya. Keempat: untuk portofolio ber-opsi, koreksi distribusi tidak menggantikan koreksi non-linearitas — CF memperbaiki z, delta-gamma memperbaiki ΔV; keduanya dibutuhkan, tidak saling menggantikan. Kelima: dokumentasikan kapan metode berhenti valid — tulis di samping angka VaR: berlaku untuk ekor moderat, gagal untuk lompatan kredit. Keenam: waspadai kuantil yang tidak monoton saat parameter ekstrem — jika z_CF turun padahal α naik, ekspansinya sudah keluar wilayah validitas; kembali ke HS. Angka tanpa batas validitas adalah jebakan untuk pembaca berikutnya. Aturan 10 detiknya: ekor tebal → koreksi bentuk dulu (CF), bandingkan dengan HS, dan curigai hasil yang terlalu rapi.",
      },
      reference: "CF = parametrik + koreksi skew/kurtosis. Valid untuk ekor moderat; bandingkan dengan HS.",
    },
        {
          id: "gap-r7-component-marginal-var",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P4-G1)",
          title: "Component vs marginal VaR: hubungan matematikanya",
          prose: [
            "Langkah 4 sudah memberi definisinya — component VaR = bobot × marginal VaR — tetapi belum pernah menghitung keduanya dari angka yang sama, sehingga hubungannya terasa seperti slogan. Lab ini menghitungnya. Portofolio Rp100 jt: A bobot 60% (σ 20%), B bobot 40% (σ 30%), korelasi 0,3, z99 = 2,33. Volatilitas portofolio σ_p = 19,35% → VaR total = Rp45,08 jt. Marginal VaR (turunan VaR terhadap bobot, ∂VaR/∂w): A = Rp37,57 jt, B = Rp56,36 jt. Component VaR (bobot × marginal): A = 0,6 × 37,57 = Rp22,54 jt; B = 0,4 × 56,36 = Rp22,54 jt. Jumlahnya pas Rp45,08 jt = VaR total (identitas Euler — component VaR selalu aditif).",
            "Perhatikan pelajarannya: component A dan B SAMA BESAR (22,54), tetapi marginal B 1,5× marginal A. Artinya: bila tujuanmu memotong VaR PER RUPIAH yang dipotong, potong B — tiap rupiah yang dikeluarkan dari B menghemat VaR 1,5× lipat dibanding dari A. Bila tujuanmu memotong VaR ABSOLUT terbesar dan kamu boleh memotong banyak, keduanya setara. Jangan samakan keduanya — lesson ini sudah memperingatkan, dan angka di sini membuktikannya. Pembanding: standalone VaR masing-masing Rp27,96 jt (jumlah Rp55,92 jt) — selisih Rp10,84 jt terhadap VaR total adalah manfaat diversifikasi, yang menyusut saat korelasi melonjak.",
          ],
          formula: String.raw`\text{Component VaR}_i = w_i \times \frac{\partial VaR}{\partial w_i} \qquad \sum_i \text{Component VaR}_i = VaR`,
          formulaNote: "A (w 0,6, σ 20%) / B (w 0,4, σ 30%), ρ = 0,3, V = Rp100 jt, z99 = 2,33: VaR 45,08; marginal 37,57 / 56,36; component 22,54 / 22,54.",
          tasks: [
            { id: "t1", text: "Hitung `sigma_p` dan `var_total`" },
            { id: "t2", text: "Hitung `marg_a`, `marg_b`, `comp_a`, `comp_b` — cek jumlahnya = VaR total" },
          ],
          expected: "sigma_p=0.1935 var_total=45.08 marg_a=37.57 marg_b=56.36 comp_a=22.54 comp_b=22.54",
          hints: [
            "σ_p² = w_A²σ_A² + w_B²σ_B² + 2·w_A·w_B·ρ·σ_A·σ_B.",
            "Marginal VaR_i = z·V·(Σw)_i / σ_p, dengan (Σw)_A = w_A·σ_A² + w_B·ρ·σ_A·σ_B.",
          ],
          code: {
            starter: `import math\n\n# Portofolio Rp100 jt: A bobot 0,6 sigma 20%; B bobot 0,4 sigma 30%; korelasi 0,3; z99 = 2,33\nw_a, w_b, s_a, s_b, rho, V, z = 0.6, 0.4, 0.20, 0.30, 0.3, 100, 2.33\n\n# TULIS KODEMU: VaR total, marginal VaR, component VaR\nsigma_p =\nvar_total =\nmarg_a =\nmarg_b =\ncomp_a =\ncomp_b =\n\nprint(f"sigma_p={sigma_p} var_total={var_total} marg_a={marg_a} marg_b={marg_b} comp_a={comp_a} comp_b={comp_b}")`,
            lockLines: 6,
            solution: `import math\n\n# Portofolio Rp100 jt: A bobot 0,6 sigma 20%; B bobot 0,4 sigma 30%; korelasi 0,3; z99 = 2,33\nw_a, w_b, s_a, s_b, rho, V, z = 0.6, 0.4, 0.20, 0.30, 0.3, 100, 2.33\n\n# TULIS KODEMU: VaR total, marginal VaR, component VaR\nsigma = math.sqrt(w_a ** 2 * s_a ** 2 + w_b ** 2 * s_b ** 2 + 2 * w_a * w_b * rho * s_a * s_b)\nsigma_p = round(sigma, 4)\nvar_total = round(z * sigma * V, 2)\ncov_a = w_a * s_a ** 2 + w_b * rho * s_a * s_b\ncov_b = w_b * s_b ** 2 + w_a * rho * s_a * s_b\nmarg_a = round(z * V * cov_a / sigma, 2)\nmarg_b = round(z * V * cov_b / sigma, 2)\ncomp_a = round(w_a * marg_a, 2)\ncomp_b = round(w_b * marg_b, 2)\n\nprint(f"sigma_p={sigma_p} var_total={var_total} marg_a={marg_a} marg_b={marg_b} comp_a={comp_a} comp_b={comp_b}")`,
            checks: [
              { kind: "equal", task: "t1", name: "sigma_p", value: 0.1935, tol: 0.0005, label: "`sigma_p` = 0,1935", msg: "√(0,0144 + 0,0144 + 0,00864) = 0,1935." },
              { kind: "equal", task: "t1", name: "var_total", value: 45.08, tol: 0.05, label: "`var_total` = 45,08", msg: "2,33 × 0,1935 × 100 = 45,08." },
              { kind: "equal", task: "t2", name: "marg_a", value: 37.57, tol: 0.05, label: "`marg_a` = 37,57", msg: "Turunan VaR terhadap bobot A." },
              { kind: "equal", task: "t2", name: "marg_b", value: 56.36, tol: 0.05, label: "`marg_b` = 56,36", msg: "Turunan VaR terhadap bobot B — 1,5× A." },
              { kind: "equal", task: "t2", name: "comp_a", value: 22.54, tol: 0.05, label: "`comp_a` = 22,54", msg: "0,6 × 37,57 = 22,54." },
              { kind: "equal", task: "t2", name: "comp_b", value: 22.54, tol: 0.05, label: "`comp_b` = 22,54", msg: "0,4 × 56,36 = 22,54 — jumlahnya pas 45,08 = VaR total." },
              { kind: "stdout_matches", task: "t2", pattern: "var_total=45\\.08\\s+marg_a=37\\.57\\s+marg_b=56\\.36\\s+comp_a=22\\.54\\s+comp_b=22\\.54", label: "`print` menampilkan keenamnya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "Component VaR A = component VaR B = 22,54, tetapi marginal B 1,5× marginal A. Potong Rp10 jt dari mana untuk hemat VaR terbesar?",
              options: [
                { text: "Dari B — marginal B 56,36 vs A 37,57 (component sama-sama 22,54)", why: "Tepat: marginal = ∂VaR/∂w. Component yang sama besar tidak berarti hemat per rupiah yang sama.", correct: true },
                { text: "Dari A — component-nya sama, jadi potong yang lebih besar bobotnya", why: "Salah: bobot sudah masuk ke dalam component. Yang menentukan hemat per rupiah adalah marginal (56,36 vs 37,57)." },
                { text: "Sama saja — component sama berarti hematnya sama", why: "Salah: itu justru jebakan yang dibuktikan lab ini — component sama, marginal beda 1,5×." },
                { text: "Dari keduanya setengah-setengah — diversifikasi", why: "Salah: membagi potongan bukan strategi hemat VaR; potong dari marginal tertinggi dulu." },
              ],
            },
          ],
          reference: "Component VaR = w × marginal VaR (aditif, jumlah = VaR total); marginal = hemat per rupiah; component sama ≠ marginal sama.",
        },
        {
          id: "gap-r7-vega-var",
          eyebrow: "Langkah tambahan · Gap ronde 7 (P4-G2)",
          title: "Vega: suku yang hilang dari delta-gamma",
          prose: [
            "Langkah 3 sudah mengakui rumusnya mengabaikan vega — tetapi belum pernah menunjukkan BERAPA BESAR yang diabaikan itu. Lab ini menghitungnya. Opsi dengan delta 0,6, gamma 0,05, vega 200 (Rp jt per 1,00 perubahan vol), σ_S = 10 (Rp jt), σ_vol = 0,05, z95 = 1,645. Kontribusi varians dari harga: δ²σ_S² = 0,36 × 100 = 36,0. Kontribusi varians dari volatilitas: ν²σ_vol² = 40.000 × 0,0025 = 100,0 — hampir 3× lipat kontribusi harga. VaR95 tanpa vega = 1,645 × 6 = Rp9,87 jt. VaR95 dengan vega = 1,645 × √136 = Rp19,18 jt — hampir 2× lipat (rasio 1,94).",
            "Aproksimasi delta-gamma yang 'lupa' vega bukan meremehkan sedikit — di sini ia meremehkan hampir separuh risiko. Aturan: bila vega material (opsi dengan tenor panjang, vol yang bergerak), pakai delta-gamma-VEGA (tambahkan suku νΔσ) atau full Monte Carlo. Dua catatan kejujuran. Satu: hitungan di atas memakai aproksimasi varians (delta dan vega sebagai dua sumber varians independen) dan mengabaikan suku gamma — gamma menambahkan pergeseran rata-rata ½Γσ_S² = Rp2,5 jt; distribusi lengkapnya butuh Monte Carlo. Dua: ΔS dan Δσ di dunia nyata berkorelasi (vol naik saat pasar jatuh) — asumsi independen di sini menyederhanakan; korelasi negatif keduanya justru memperbesar VaR.",
          ],
          formula: String.raw`\Delta V \approx \delta\,\Delta S + \tfrac{1}{2}\Gamma(\Delta S)^2 + \nu\,\Delta\sigma \qquad Var(\Delta V) \approx \delta^2\sigma_S^2 + \nu^2\sigma_{vol}^2`,
          formulaNote: "δ=0,6, ν=200, σ_S=10, σ_vol=0,05: var delta 36,0; var vega 100,0; VaR95 9,87 → 19,18 (rasio 1,94). Gamma menambah pergeseran rata-rata 2,5 (di luar aproksimasi ini).",
          tasks: [
            { id: "t1", text: "Hitung kontribusi varians: `var_delta` dan `var_vega`" },
            { id: "t2", text: "Hitung `var95_tanpa_vega`, `var95_dengan_vega`, dan `rasio`" },
          ],
          expected: "var_delta=36.0 var_vega=100.0 var95_tanpa_vega=9.87 var95_dengan_vega=19.18 rasio=1.94",
          hints: [
            "Varians dari suku delta = δ² × σ_S²; dari suku vega = ν² × σ_vol².",
            "VaR95 = 1,645 × simpangan baku total; tanpa vega hanya pakai simpangan baku delta.",
          ],
          code: {
            starter: `import math\n\n# Opsi: delta 0,6; gamma 0,05; vega 200 (Rp jt per 1,00 vol); sigma_S = 10; sigma_vol = 0,05; z95 = 1,645\ndelta, gamma, vega = 0.6, 0.05, 200\nsig_s, sig_vol, z = 10, 0.05, 1.645\n\n# TULIS KODEMU: kontribusi varians delta vs vega + VaR95 tanpa/dengan vega\nvar_delta =\nvar_vega =\nvar95_tanpa_vega =\nvar95_dengan_vega =\nrasio =\n\nprint(f"var_delta={var_delta} var_vega={var_vega} var95_tanpa_vega={var95_tanpa_vega} var95_dengan_vega={var95_dengan_vega} rasio={rasio}")`,
            lockLines: 7,
            solution: `import math\n\n# Opsi: delta 0,6; gamma 0,05; vega 200 (Rp jt per 1,00 vol); sigma_S = 10; sigma_vol = 0,05; z95 = 1,645\ndelta, gamma, vega = 0.6, 0.05, 200\nsig_s, sig_vol, z = 10, 0.05, 1.645\n\n# TULIS KODEMU: kontribusi varians delta vs vega + VaR95 tanpa/dengan vega\nvar_delta = round(delta ** 2 * sig_s ** 2, 1)\nvar_vega = round(vega ** 2 * sig_vol ** 2, 1)\nvar95_tanpa_vega = round(z * math.sqrt(var_delta), 2)\nvar95_dengan_vega = round(z * math.sqrt(var_delta + var_vega), 2)\nrasio = round(var95_dengan_vega / var95_tanpa_vega, 2)\n\nprint(f"var_delta={var_delta} var_vega={var_vega} var95_tanpa_vega={var95_tanpa_vega} var95_dengan_vega={var95_dengan_vega} rasio={rasio}")`,
            checks: [
              { kind: "equal", task: "t1", name: "var_delta", value: 36.0, tol: 0.1, label: "`var_delta` = 36,0", msg: "0,36 × 100 = 36." },
              { kind: "equal", task: "t1", name: "var_vega", value: 100.0, tol: 0.1, label: "`var_vega` = 100,0", msg: "40.000 × 0,0025 = 100 — hampir 3× kontribusi harga." },
              { kind: "equal", task: "t2", name: "var95_tanpa_vega", value: 9.87, tol: 0.05, label: "`var95_tanpa_vega` = 9,87", msg: "1,645 × 6 = 9,87." },
              { kind: "equal", task: "t2", name: "var95_dengan_vega", value: 19.18, tol: 0.05, label: "`var95_dengan_vega` = 19,18", msg: "1,645 × √136 = 19,18." },
              { kind: "equal", task: "t2", name: "rasio", value: 1.94, tol: 0.02, label: "`rasio` = 1,94", msg: "Vega hampir menggandakan VaR." },
              { kind: "stdout_matches", task: "t2", pattern: "var_delta=36\\.0\\s+var_vega=100\\.0\\s+var95_tanpa_vega=9\\.87\\s+var95_dengan_vega=19\\.18\\s+rasio=1\\.94", label: "`print` menampilkan kelimanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
            ],
          },
          quiz: [
            {
              q: "VaR delta-gamma = 9,87; dengan vega = 19,18. Kesimpulan yang benar?",
              options: [
                { text: "Risiko volatilitas mendominasi — aproksimasi tanpa vega meremehkan VaR hampir 2×", why: "Tepat: kontribusi varians vega (100) hampir 3× kontribusi harga (36). Bila vega material, tambahkan suku νΔσ atau pakai full Monte Carlo.", correct: true },
                { text: "Vega hanya koreksi kecil — 9,87 sudah cukup sebagai VaR", why: "Salah: selisihnya 9,31 jt — hampir sebesar VaR itu sendiri. Itu bukan koreksi kecil." },
                { text: "Gamma yang harus ditambahkan, bukan vega", why: "Salah: gamma menambahkan pergeseran rata-rata 2,5 — jauh lebih kecil dari kontribusi varians vega 100." },
                { text: "VaR 19,18 pasti benar karena memakai lebih banyak suku", why: "Salah: ini tetap aproksimasi (asumsi ΔS dan Δσ independen, gamma diabaikan) — distribusi lengkapnya butuh Monte Carlo." },
              ],
            },
          ],
          reference: "ΔV ≈ δΔS + ½Γ(ΔS)² + νΔσ — vega jangan dilupakan bila vol bergerak; di sini VaR 9,87 → 19,18.",
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
        "Filtered HS: r*_t = (σ_T/σ_t)·r_t — bentuk distribusi dari histori, level volatilitas dari kini. Sadar rezim, bukan selalu konservatif.",
        "Delta-gamma-vega: ΔV ≈ δΔS + ½Γ(ΔS)² + νΔσ — wajib untuk portofolio ber-opsi (vega jangan dilupakan); short gamma = rugi kuadratik dua arah.",
        "Component VaR aditif = VaR total; marginal VaR = ∂VaR/∂w untuk perubahan kecil; manfaat diversifikasi menyusut saat krisis.",
        "Stressed VaR (Basel 2.5): VaR krisis + VaR normal — modal menutupi dua kondisi.",
        "Aturan 10 detik: rezim berubah → filter; non-linear → orde-2; multi-desk → bedah kontribusi.",
      ],
      next: { label: "MR5 — Expected Shortfall", href: "/v2/learn/mr5-expected-shortfall" },
      quiz: [
        {
          q: "Dalam Filtered HS, r*_t = (σ_T/σ_t)·r_t. Jika σ_T > σ_t, apa yang terjadi pada return historis hari-t?",
          options: [
            { text: "Diperkecil — karena masa lalu lebih tenang", why: "arahnya terbalik — justru diperbesar." },
            { text: "Diperbesar — disesuaikan ke level volatilitas kini yang lebih tinggi", why: "σ_T/σ_t > 1 → return ditiup ke skala kini. Inilah cara FHS menjawab: bagaimana jika pola hari itu terjadi dalam kondisi pasar SEKARANG?", correct: true },
            { text: "Tidak berubah", why: "hanya tidak berubah jika σ_T = σ_t." },
            { text: "Dibuang dari sampel", why: "tidak ada data yang dibuang — hanya diskalakan." },
          ],
        },
        {
          q: "Portofolio delta-neutral (δ≈0) tetapi short gamma besar. VaR delta-only akan…",
          options: [
            { text: "Akurat — delta nol berarti tidak ada risiko", why: "jebakan klasik — delta nol menyembunyikan gamma." },
            { text: "Meremehkan risiko secara sistematis — mengabaikan kerugian kuadratik saat pasar bergerak besar", why: "delta ≈ 0 membuat VaR linear ≈ 0, padahal suku ½Γ(ΔS)² bisa sangat negatif.", correct: true },
            { text: "Melebih-lebihkan risiko", why: "arahnya terbalik — justru meremehkan." },
            { text: "Sama dengan VaR delta-gamma", why: "sama hanya jika gamma ≈ 0." },
          ],
        },
        {
          q: "Component VaR lima desk berjumlah Rp80 M = VaR total. Desk Rates = Rp30 M. Artinya?",
          options: [
            { text: "Desk Rates rugi Rp30 M kemarin", why: "component VaR bukan realisasi rugi." },
            { text: "Kontribusi Desk Rates ke VaR total adalah Rp30 M setelah diversifikasi — kandidat pertama untuk dipotong saat de-risking", why: "component VaR = kontribusi risiko yang aditif; desk terbesar memberi penghematan ABSOLUT terbesar saat dipotong — penghematan per rupiah adalah marginal VaR, metrik yang berbeda.", correct: true },
            { text: "Limit Desk Rates adalah Rp30 M", why: "component VaR bukan limit." },
            { text: "Desk Rates harus ditutup", why: "besar kontribusi bukan vonis penutupan." },
          ],
        },
        {
          q: "Kapan Filtered HS memberi VaR lebih kecil dari HS biasa?",
          options: [
            { text: "Tidak pernah — FHS selalu konservatif", why: "FHS bukan versi konservatif." },
            { text: "Saat volatilitas kini (σ_T) lebih rendah dari rata-rata historis — misal tenang setelah krisis", why: "σ_T kecil → return historis diperkecil → VaR turun. Ia mengikuti kini, bukan selalu menaikkan.", correct: true },
            { text: "Saat data historis pendek", why: "panjang data tidak menentukan arah penyesuaian." },
            { text: "Saat portofolio linear", why: "linearitas tidak menentukan arah penyesuaian." },
          ],
        },
        {
          q: "Jumlah standalone VaR 5 desk = Rp131 M, VaR total = Rp80 M. Selisih Rp51 M adalah…",
          options: [
            { text: "Kesalahan hitung", why: "selisih ini justru dihitung dengan benar." },
            { text: "Manfaat diversifikasi — yang akan menyusut saat korelasi melonjak di tengah krisis", why: "diversifikasi = agregasi naif − agregasi berkorelasi. Jangan pernah mengandalkan Rp51 M itu penuh.", correct: true },
            { text: "Cadangan modal", why: "bukan cadangan apa-apa." },
            { text: "Keuntungan yang belum direalisasi", why: "tidak ada hubungannya dengan keuntungan." },
          ],
        },
      ],
    },
  ],
};
