import type { V2Lesson } from "../lib/types";

const FIG_BOARD = `<svg viewBox="0 0 600 340" role="img" aria-label="Papan IS checks dua kandidat: Arus lolos semua, Kilat gagal dua.">
<g font-family="var(--font-ui)">
<text x="20" y="28" font-size="14" fill="var(--chart-text)" font-weight="bold">Papan IS checks</text>
<text x="330" y="28" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Kandidat Arus</text>
<text x="480" y="28" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Kandidat Kilat</text>
<g font-size="12" fill="var(--chart-text)">
<text x="20" y="62">Sharpe &ge; 1,25</text>
<text x="20" y="94">Fitness &ge; 1,0</text>
<text x="20" y="126">Turnover &le; 0,7</text>
<text x="20" y="158">Drawdown &le; 15%</text>
<text x="20" y="190">Long 40&ndash;60%</text>
<text x="20" y="222">Sub-univ Sharpe &ge; 1,0</text>
<text x="20" y="254">Self-corr &lt; 0,7</text>
</g>
<g font-size="13" text-anchor="middle">
<rect x="300" y="48" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="64" fill="#fff">&#10003;</text>
<rect x="450" y="48" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="480" y="64" fill="#fff">&#10003;</text>
<rect x="300" y="80" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="96" fill="#fff">&#10003;</text>
<rect x="450" y="80" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="480" y="96" fill="#fff">&#10003;</text>
<rect x="300" y="112" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="128" fill="#fff">&#10003;</text>
<rect x="450" y="112" width="60" height="22" rx="4" fill="#e5484d" opacity="0.9"/><text x="480" y="128" fill="#fff">&#10007;</text>
<rect x="300" y="144" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="160" fill="#fff">&#10003;</text>
<rect x="450" y="144" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="480" y="160" fill="#fff">&#10003;</text>
<rect x="300" y="176" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="192" fill="#fff">&#10003;</text>
<rect x="450" y="176" width="60" height="22" rx="4" fill="#e5484d" opacity="0.9"/><text x="480" y="192" fill="#fff">&#10007;</text>
<rect x="300" y="208" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="224" fill="#fff">&#10003;</text>
<rect x="450" y="208" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="480" y="224" fill="#fff">&#10003;</text>
<rect x="300" y="240" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="330" y="256" fill="#fff">&#10003;</text>
<rect x="450" y="240" width="60" height="22" rx="4" fill="var(--c2)" opacity="0.9"/><text x="480" y="256" fill="#fff">&#10003;</text>
</g>
<text x="330" y="292" font-size="13" fill="var(--c2)" text-anchor="middle" font-weight="bold">7/7 &rarr; LANJUT</text>
<text x="480" y="292" font-size="13" fill="#e5484d" text-anchor="middle" font-weight="bold">5/7 &rarr; BUANG</text>
<text x="300" y="318" font-size="11" fill="var(--chart-text)">Sharpe kembar (1,62 vs 1,61). Dua kotak merah Kilat = turnover 0,91 &amp; long 88%.</text>
</g>
</svg>`;

export const wqb11: V2Lesson = {
  slug: "wqb11-membaca-hasil",
  track: "WorldQuant Brain",
  module: "Praktik & Diagnosis",
  title: "WQB11 — Membaca Hasil Simulasi & IS Checks",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sharpe kembar, nasib beda",
      prose: [
        "Pagi itu meja riset menerima dua paket hasil simulasi. Kandidat pertama, sebut saja Arus: Sharpe 1,62, fitness 1,31. Kandidat kedua, Kilat: Sharpe 1,61, fitness 1,28. Dua angka headline nyaris identik. Analis junior mengusulkan keduanya masuk antrean submit — “rugi kalau yang sebagus ini dibuang.”",
        "Analis senior membuka panel lengkapnya. Arus: turnover 0,42, drawdown 6,1%, porsi long 52%. Kilat: turnover 0,91, drawdown 14,2%, porsi long 88%. Dua baris itu mengubah segalanya. Kilat gagal dua IS checks — turnover melewati batas dan portofolionya hampir long-only, bukan market-neutral. Arus lolos 7 dari 7. Keputusan: Arus lanjut, Kilat dibuang. Sharpe yang sama, nasib beda.",
        "Twist-nya: tidak ada yang salah dengan sinyal Kilat secara intuisi — idenya masuk akal, backtest-nya hijau. Yang membunuhnya adalah hal-hal yang tidak terlihat di angka headline: biaya implisit dari turnover 91% per hari akan menggerus return di live, dan bias long 88% berarti ia bukan alpha market-neutral melainkan taruhan arah pasar yang tersamar. Panel hasil simulasi ada untuk menangkap persis hal seperti ini.",
        "Konteks singkat sebelum mulai. WorldQuant Brain (WQB) = platform riset alpha kuantitatif crowdsourced: kamu menulis ekspresi sinyal, platform mensimulasikannya pada data historis. Hasilnya disebut in-sample (IS): kinerja di data yang sama dengan yang dipakai membangun sinyal. Alpha yang lolos IS checks boleh melaju ke tahap submit. Setelah lesson ini kamu bisa: (1) membaca tujuh angka di panel hasil simulasi; (2) menjelaskan arti tiap IS check beserta arti lolos/gagalnya; (3) menghitung Sharpe tahunan dan max drawdown dari deret return; (4) menjalankan pemeriksa IS checks otomatis dan memutuskan lanjut/buang.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Di tim riset alpha profesional, keputusan lanjut/buang HARUS bisa dijelaskan dalam 30 detik dari panel hasil — bukan dari 'feeling idenya bagus'. Lesson ini melatih otot itu: angka dulu, intuisi kemudian.",
      },
      reference: "Headline (Sharpe) = undangan; panel lengkap + IS checks = keputusan.",
    },
    {
      id: "panel",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tujuh angka di panel hasil",
      prose: [
        "Panel hasil simulasi WQB menampilkan kurva PnL kumulatif plus sederet metrik. Tujuh yang wajib dibaca: (1) PnL — total return kumulatif selama periode IS, mis. +38% dalam 5 tahun. Ia menjawab 'berapa hasilnya', tapi tidak menjawab 'seberapa mulus'. (2) Sharpe ratio — return per unit risiko, disetahunkan. Contoh: return harian rata-rata 0,0008 dengan std 0,008 → Sharpe = 0,1 × √252 ≈ 1,59. Ambang praktik: ≥ 1,25. (3) Fitness — skor gabungan ala WQB yang menggabungkan Sharpe, konsistensi, dan penalti biaya; ambang praktik ≥ 1,0. Anggap ia 'Sharpe yang sudah didisiplinkan'.",
        "(4) Turnover — rata-rata fraksi portofolio yang diputar tiap hari: turnover = mean(|w_t − w_{t−1}|). Nilai 0,42 = 42% portofolio berganti tiap hari. Batas praktik ≤ 0,7: di atas itu biaya transaksi dan slippage di live memakan return yang terlihat di backtest. (5) Max drawdown — penurunan puncak-ke-lembah terbesar kurva ekuitas, mis. 6,1%. Ia mengukur 'luka terdalam': alpha dengan Sharpe 1,8 tapi drawdown 25% = tidur tidak nyenyak. (6) Long/Short — porsi nilai long vs short, mis. 52/48 = netral. Rentang sehat 40–60% sisi long: di luar itu sinyalmu bukan market-neutral lagi. (7) Decay — seberapa cepat bobot sinyal meluruh; decay linear 5 hari berarti sinyal hari ini masih 80% berbobot besok. Decay terlalu cepat = turnover meledak; terlalu lambat = sinyal basi.",
        "Cara membaca panel yang benar: mulai dari Sharpe (apakah ≥ 1,25?), lalu sapu turnover–drawdown–long/short (apakah ada yang ekstrem?), baru lihat PnL dan fitness sebagai konfirmasi. Urutan ini penting — analis junior membaca PnL dulu dan jatuh cinta pada kurva yang menanjak; analis senior membaca 'pajak' (turnover) dan 'luka' (drawdown) dulu.",
        "Contoh angka pembanding: Arus — Sharpe 1,62 (lolos), turnover 0,42 (lolos), drawdown 6,1% (lolos), long 52% (lolos). Kilat — Sharpe 1,61 (lolos), turnover 0,91 (GAGAL, > 0,7), drawdown 14,2% (lolos tipis), long 88% (GAGAL, di luar 40–60%). Empat angka pertama identik; tiga angka terakhir memisahkan nasib.",
      ],
      formula: String.raw`\text{Sharpe}_{\text{tahunan}} = \frac{\bar{r}}{\sigma_r}\sqrt{252}`,
      formulaNote: "r̄ = rata-rata return harian, σ_r = std dev return harian, 252 = hari trading setahun. Contoh: r̄ = 0,0008, σ_r = 0,008 → (0,0008/0,008) × 15,87 ≈ 1,59. Sharpe mengukur return per unit risiko — 1,59 berarti tiap 1 unit volatilitas 'dibayar' 1,59 unit return.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“PnL +38% berarti alpha bagus.” PnL tanpa penyebut risiko = tidak informatif. +38% dengan drawdown 25% dan turnover 0,9 adalah alpha yang berbeda (dan lebih buruk) dari +38% dengan drawdown 6% dan turnover 0,4 — walau kurva PnL-nya terlihat sama menanjaknya.",
      },
      hints: [
        "Urutan baca: Sharpe → turnover/drawdown/long-short → PnL/fitness.",
        "Turnover 0,42 = tiap hari rata-rata 42% posisi berganti.",
      ],
      reference: "Sharpe = undangan; turnover, drawdown, long/short = pajak, luka, dan netralitas.",
    },
    {
      id: "checks",
      eyebrow: "Langkah 3 · Konsep",
      title: "IS checks: daftar periksa sebelum submit",
      prose: [
        "IS checks = daftar periksa otomatis yang dijalankan platform pada hasil in-sample. Tiap check punya ambang; lolos semua = boleh melaju. Tujuh check yang dipakai di busur ini: (1) Sharpe ≥ 1,25 — return per unit risiko memadai. Gagal = sinyal terlalu lemah untuk biaya live. (2) Fitness ≥ 1,0 — skor gabungan lolos; gagal = ada yang tidak beres di kombinasi metrik walau Sharpe terlihat oke. (3) Turnover ≤ 0,7 — biaya implisit terkendali; gagal = return backtest ilusi karena tidak memperhitungkan biaya putar posisi. (4) Drawdown ≤ 15% — luka terdalam masih wajar; gagal = strategi pernah 'mati' 15%+ di data historis, live kemungkinan mengulang.",
        "(5) Long 40–60% — market-neutral; gagal = alpha sebenarnya taruhan arah pasar (long bias) atau taruhan short. (6) Sub-universe Sharpe ≥ 1,0 — sinyal bekerja di semua segmen universe, bukan hanya satu ceruk; gagal = rapuh (didetailkan di WQB12). (7) Self-correlation < 0,7 — sinyal cukup unik dibanding alpha milikmu yang sudah disubmit; gagal = duplikat yang tidak bisa disubmit (didetailkan di WQB13).",
        "Sifat penting: check bersifat menggugurkan satu per satu — 6 lolos + 1 gagal = gagal. Tidak ada 'rata-rata'. Inilah yang membunuh Kilat: 5/7 tetap BUANG. Alasannya ekonomis: tiap check menjaga satu mode kegagalan di live (biaya, arah pasar, kerapuhan segmen, duplikasi). Satu mode kegagalan yang lolos = satu cara strategi mati di live.",
        "Cara membaca figur: tiap baris = satu check, kolom = dua kandidat cerita pembuka. Interpretasi: Arus 7/7 hijau → LANJUT. Kilat 5/7 — dua kotak merahnya tepat di turnover (0,91 > 0,7) dan long 88% (di luar 40–60%) → BUANG, walau Sharpe-nya 1,61. Figur ini adalah versi visual dari keputusan 30 detik analis senior.",
      ],
      figure: {
        svg: FIG_BOARD,
        alt: "Papan IS checks: Kandidat Arus lolos 7/7, Kandidat Kilat gagal turnover dan long/short.",
        caption: "Satu kotak merah = gugur. Kilat mati bukan di Sharpe, melainkan di turnover dan netralitas.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“6 dari 7 lolos, lumayan — poles sedikit pasti lolos.” Check yang gagal karena alasan struktural (turnover 0,91, long 88%) tidak sembuh dengan 'sedikit poles' — ia sembuh dengan mengganti logika sinyal. Membedakan gagal-struktural vs gagal-tipis adalah keterampilan inti lesson ini.",
      },
      hints: [
        "Check menggugurkan: 1 gagal = gagal total, tidak ada kompensasi.",
        "Kelompokkan: metrik kekuatan (Sharpe, fitness) vs metrik kelayakan live (turnover, drawdown, long/short, sub-univ, self-corr).",
      ],
      reference: "Tujuh check, tujuh mode kegagalan live. Satu merah = buang.",
    },
    {
      id: "lab-sharpe",
      eyebrow: "Langkah 4 · Lab",
      title: "Hitung Sharpe & drawdown dari return harian",
      prose: [
        "Sebelum memercayai angka panel, hitung sendiri sekali. Lab ini: 252 return harian (satu tahun trading) dari sebuah kandidat. Tugasmu: Sharpe tahunan = mean/std × √252, dan max drawdown dari kurva ekuitas kumulatif. Dua angka ini adalah fondasi seluruh panel — kalau kamu bisa menghitungnya dari nol, kamu tidak akan pernah tertipu angka headline lagi.",
        "Petunjuk implementasi: ekuitas kumulatif = kumulatif dari (1 + r). Peak berjalan = maksimum ekuitas sampai hari itu. Drawdown hari itu = (peak − ekuitas)/peak. Max drawdown = maksimumnya. Setelah selesai, ubah satu baris: kalikan semua return dengan 2 — Sharpe tidak berubah (mean dan std sama-sama ×2), tapi drawdown membesar. Itulah beda 'skala return' vs 'kualitas risiko'.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sharpe` tahunan dan `max_dd` (fraksi, mis. 0,067)" },
        { id: "t2", text: "Jalankan: pastikan dua baris tercetak" },
      ],
      expected: "Sharpe tahunan: 2.21\nMax drawdown: 6.7%",
      note: {
        title: "Intuisi",
        body: "Sharpe 2,21 dengan drawdown 6,7% = profil 'Arus': return dibayar mahal per unit risiko dan lukanya dangkal. Kalau drawdown yang keluar > 12% dengan Sharpe yang sama, profilnya berubah menjadi 'return bagus tapi tidur tidak nyenyak' — keputusan lanjut/buang ikut berubah.",
      },
      hints: [
        "mean = sum(rets)/len(rets); std = akar rata-rata kuadrat selisih dari mean (pembagi N).",
        "Ekuitas: e=1 lalu e *= (1+r) tiap hari; simpan tiap langkah.",
      ],
      code: {
        starter: "# 252 return harian sebuah kandidat (JANGAN UBAH).\nimport random\n_rng = random.Random(7)\nrets = [0.0008 + _rng.gauss(0, 0.008) for _ in range(252)]\n\n# TULIS KODEMU\nsharpe =  # Sharpe tahunan\nmax_dd =  # max drawdown sebagai fraksi\n\nprint(f\"Sharpe tahunan: {sharpe:.2f}\")\nprint(f\"Max drawdown: {max_dd:.1%}\")\n",
        lockLines: 4,
        solution: "# 252 return harian sebuah kandidat (JANGAN UBAH).\nimport random\n_rng = random.Random(7)\nrets = [0.0008 + _rng.gauss(0, 0.008) for _ in range(252)]\n\n# TULIS KODEMU\nimport math\nn = len(rets)\nmean = sum(rets) / n\nvar = sum((r - mean) ** 2 for r in rets) / n\nstd = math.sqrt(var)\nsharpe = mean / std * math.sqrt(252)\neq, peak, max_dd = 1.0, 1.0, 0.0\nfor r in rets:\n    eq *= (1 + r)\n    peak = max(peak, eq)\n    max_dd = max(max_dd, (peak - eq) / peak)\n\nprint(f\"Sharpe tahunan: {sharpe:.2f}\")\nprint(f\"Max drawdown: {max_dd:.1%}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Sharpe ≈ 2,21", msg: "mean/std*√252 dari 252 return seed 7.", pattern: "Sharpe tahunan: 2\\.21" },
          { kind: "stdout_matches", task: "t2", label: "Max DD ≈ 6,7%", msg: "Drawdown puncak-ke-lembah terbesar deret ini.", pattern: "Max drawdown: 6\\.7%" }
        ],
      },
      reference: "Sharpe = mean/std × √252. Max DD = max((peak − ekuitas)/peak).",
    },
    {
      id: "lab-checker",
      eyebrow: "Langkah 5 · Lab",
      title: "Pemeriksa IS checks otomatis",
      prose: [
        "Sekarang otomasi keputusan 30 detik analis senior. Diberikan dict hasil sebuah kandidat, periksa tujuh check satu per satu, cetak LOLOS/GAGAL tiap check, lalu putuskan LANJUT hanya jika semua lolos. Data lab ini = kandidat 'Sinar': Sharpe 1,48, fitness 1,12, turnover 0,55, drawdown 9,3%, long 47%, sub-universe Sharpe 1,05, self-corr 0,44.",
        "Setelah selesai, eksperimen: ubah turnover menjadi 0,75 dan long menjadi 63% — lihat dua GAGAL muncul dan keputusan berbalik menjadi BUANG. Inilah 'Kilat-ifikasi' Sinar: dua angka diubah, nasib berbalik. Rasakan betapa tipisnya garis antara lanjut dan buang — dan kenapa panel lengkap wajib dibaca.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `cek` untuk 7 checks" },
        { id: "t2", text: "Jalankan: pastikan 7 baris + keputusan tercetak" },
      ],
      expected: "Sharpe>=1.25: LOLOS\nFitness>=1.0: LOLOS\nTurnover<=0.7: LOLOS\nDrawdown<=15%: LOLOS\nLong 40-60%: LOLOS\nSub-univ>=1.0: LOLOS\nSelf-corr<0.7: LOLOS\nKeputusan: LANJUT (7/7)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Self-corr 0,44 aman, tidak perlu dipikirkan.” 0,44 memang lolos (< 0,7), tapi ia sinyal bahwa kandidat ini 'berkerabat' dengan sesuatu yang sudah kamu miliki. Catat kerabatnya — saat kamu memoles kandidat ini nanti, korelasinya bisa merangkak naik melewati ambang tanpa kamu sadari.",
      },
      hints: [
        "checks = list of (nama, lolos_bool).",
        "Keputusan LANJUT hanya jika all(lolos).",
      ],
      code: {
        starter: "# Hasil kandidat 'Sinar' (JANGAN UBAH).\nh = {\"sharpe\": 1.48, \"fitness\": 1.12, \"turnover\": 0.55,\n     \"drawdown\": 9.3, \"long\": 47.0, \"sub_univ\": 1.05, \"self_corr\": 0.44}\n\n# TULIS KODEMU: list (nama_check, lolos?)\nchecks = [\n    (\"Sharpe>=1.25\", ),\n    (\"Fitness>=1.0\", ),\n    (\"Turnover<=0.7\", ),\n    (\"Drawdown<=15%\", ),\n    (\"Long 40-60%\", ),\n    (\"Sub-univ>=1.0\", ),\n    (\"Self-corr<0.7\", ),\n]\n\nlolos = 0\nfor nama, ok in checks:\n    print(f\"{nama}: {'LOLOS' if ok else 'GAGAL'}\")\n    lolos += ok\nprint(f\"Keputusan: {'LANJUT' if lolos == 7 else 'BUANG'} ({lolos}/7)\")\n",
        lockLines: 4,
        solution: "# Hasil kandidat 'Sinar' (JANGAN UBAH).\nh = {\"sharpe\": 1.48, \"fitness\": 1.12, \"turnover\": 0.55,\n     \"drawdown\": 9.3, \"long\": 47.0, \"sub_univ\": 1.05, \"self_corr\": 0.44}\n\n# TULIS KODEMU: list (nama_check, lolos?)\nchecks = [\n    (\"Sharpe>=1.25\", h[\"sharpe\"] >= 1.25),\n    (\"Fitness>=1.0\", h[\"fitness\"] >= 1.0),\n    (\"Turnover<=0.7\", h[\"turnover\"] <= 0.7),\n    (\"Drawdown<=15%\", h[\"drawdown\"] <= 15),\n    (\"Long 40-60%\", 40 <= h[\"long\"] <= 60),\n    (\"Sub-univ>=1.0\", h[\"sub_univ\"] >= 1.0),\n    (\"Self-corr<0.7\", h[\"self_corr\"] < 0.7),\n]\n\nlolos = 0\nfor nama, ok in checks:\n    print(f\"{nama}: {'LOLOS' if ok else 'GAGAL'}\")\n    lolos += ok\nprint(f\"Keputusan: {'LANJUT' if lolos == 7 else 'BUANG'} ({lolos}/7)\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "7 check LOLOS", msg: "Semua ambang terpenuhi untuk Sinar.", pattern: "Self-corr<0\\.7: LOLOS" },
          { kind: "stdout_matches", task: "t2", label: "Keputusan LANJUT 7/7", msg: "Semua lolos → LANJUT.", pattern: "Keputusan: LANJUT \\(7/7\\)" }
        ],
      },
      reference: "Otomasi 30 detik: 7 checks → LANJUT hanya jika 7/7.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Lanjut, poles, atau buang",
      prose: [
        "Satu: 7/7 hijau → LANJUT ke antrean submit. Jangan poles lagi — tiap poles tambahan = satu kesempatan overfitting (WQB14). Dua: gagal struktural (turnover > 0,7 jauh, long di luar 40–60, self-corr ≥ 0,7) → BUANG. Poles tidak menyembuhkan struktur; ganti logika sinyal atau pindah family. Tiga: Sharpe 1,10–1,24 (di bawah ambang tapi dekat) dan semua check lain hijau → POLES TERBATAS: maksimal 3 tweak tercatat; bila tidak menembus 1,25 → buang. Empat: drawdown > 15% sendirian sementara lainnya hijau → INVESTIGASI dulu: petakan kapan luka terjadi — kalau terkonsentrasi di satu episode krisis (mis. Maret 2020), kandidat mungkin masih layak dengan catatan; kalau luka tersebar → buang.",
        "Dua tips praktik tim riset alpha. Pertama, putuskan dengan panel kemarin, bukan panel hari ini: simpan snapshot hasil tiap kandidat; keputusan yang berubah-ubah tiap ada tweak = tidak ada keputusan. Kedua, tulis alasan buang dalam satu kalimat ('buang: turnover 0,91 struktural') — arsip alasan buang adalah guru termurah; tim yang tidak mencatat akan mengulang kesalahan yang sama tiga bulan kemudian.",
        "Aturan praktis 10 detik: baca Sharpe (≥ 1,25?), sapu tujuh check; satu merah struktural = BUANG dalam 10 detik. Tidak ada diskusi, tidak ada 'tapi idenya bagus'.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Keputusan buang yang cepat BUKAN kekejaman — ia adalah anggaran riset. Tiap jam yang dihabiskan memoles kandidat gagal-struktural adalah jam yang tidak dipakai mencari kandidat sehat. Tim terbaik bukan yang paling jarang membuang, melainkan yang paling cepat membuang dengan alasan tercatat.",
      },
      reference: "7/7 = lanjut; merah struktural = buang; dekat ambang = 3 tweak lalu buang; drawdown sendirian = investigasi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Paket 'S': lanjut atau buang?",
      prose: [
        "Data paket 'S' (periode IS 5 tahun): Sharpe 1,52, fitness 1,08, turnover 0,62, max drawdown 8,4%, long 55%, sub-universe Sharpe 1,10, self-correlation 0,32. Tugas: putuskan LANJUT atau BUANG beserta alasan satu kalimat per check yang kritis.",
        "Pembahasan: Sharpe 1,52 ≥ 1,25 (lolos, margin 0,27 — nyaman). Fitness 1,08 ≥ 1,0 (lolos tipis — pantau, jangan poles membabi buta). Turnover 0,62 ≤ 0,7 (lolos, tapi hanya 0,08 dari batas — varian poles yang menaikkan turnover sedikit akan membunuhnya; catat sebagai constraint). Drawdown 8,4% ≤ 15% (lolos nyaman). Long 55% dalam 40–60 (lolos). Sub-univ 1,10 ≥ 1,0 (lolos). Self-corr 0,32 < 0,7 (lolos, jauh dari ambang — kandidat ini unik). Keputusan: LANJUT 7/7, dengan dua catatan kerja: (1) fitness dan turnover dekat batas → poles berikutnya dilarang menyentuh keduanya; (2) arsipkan alasan tiap check agar tiga bulan dari sekarang kamu tahu kenapa ia lolos.",
        "Bandingkan dengan Kilat: Sharpe S (1,52) bahkan LEBIH RENDAH dari Kilat (1,61) — tapi S lanjut dan Kilat dibuang. Inilah pelajaran lesson ini dalam satu kalimat: keputusan dibuat oleh panel, bukan oleh headline.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke praktik",
        type: "risk",
        body: "Catatan 'dekat batas' (fitness 1,08; turnover 0,62) adalah risk register mini. Tanpa catatan ini, poles berikutnya bisa menaikkan Sharpe menjadi 1,7 sambil menaikkan turnover menjadi 0,73 — headline membaik, kandidat mati. Tim yang baik merayakan Sharpe naik; tim yang hebat memeriksa pajaknya.",
      },
      reference: "S: 7/7 LANJUT — Sharpe 1,52 < Kilat 1,61, tapi panelnya sehat.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokusnya: membaca panel seperti analis senior — pajak dulu, headline kemudian.",
      ],
      tasks: [],
      summary: [
        "Panel hasil: PnL, Sharpe, fitness, turnover, drawdown, long/short, decay — baca Sharpe dulu, lalu pajak (turnover), luka (drawdown), netralitas (long/short).",
        "Sharpe tahunan = mean/std × √252; max drawdown = penurunan puncak-ke-lembah terbesar.",
        "Tujuh IS checks: Sharpe ≥ 1,25; fitness ≥ 1,0; turnover ≤ 0,7; drawdown ≤ 15%; long 40–60%; sub-univ Sharpe ≥ 1,0; self-corr < 0,7.",
        "Check bersifat menggugurkan: 1 gagal = gagal total; gagal struktural → buang, jangan poles.",
        "Aturan 10 detik: Sharpe ≥ 1,25, sapu tujuh check, satu merah struktural = buang.",
      ],
      next: { label: "WQB12 — Sub-Universe Sharpe: Ujian Ketat Kandidat Kuat", href: "/learn/wqb12-sub-universe" },
      quiz: [
        {
          q: "Kandidat Kilat: Sharpe 1,61 tapi turnover 0,91 dan long 88%. Keputusan benar?",
          options: [
            { text: "BUANG — gagal dua check struktural", why: "Benar. Turnover 0,91 > 0,7 dan long 88% di luar 40–60 = gagal struktural; check menggugurkan.", correct: true },
            { text: "LANJUT — Sharpe 1,61 di atas ambang", why: "Salah. Sharpe hanya undangan; dua check kelayakan live gagal = kandidat mati di live." },
            { text: "POLES — turunkan turnover sedikit", why: "Turnover 0,91 → ≤ 0,7 bukan 'sedikit poles' melainkan ganti logika sinyal. Ini gagal struktural." }
          ],
        },
        {
          q: "Turnover 0,91 berbahaya terutama karena…",
          options: [
            { text: "Biaya transaksi & slippage menggerus return di live", why: "Benar. 91% portofolio berganti tiap hari = return backtest ilusi tanpa biaya.", correct: true },
            { text: "Komputer tidak kuat menghitungnya", why: "Bukan soal komputasi — soal ekonomi: biaya riil memakan return." },
            { text: "Turnover tinggi selalu berarti overfitting", why: "Turnover tinggi = biaya tinggi; overfitting adalah masalah berbeda (WQB14)." }
          ],
        },
        {
          q: "Long 88% / short 12% gagal check netralitas. Artinya…",
          options: [
            { text: "Sinyal sebenarnya taruhan arah pasar, bukan alpha market-neutral", why: "Benar. 88% long = portofolio ikut naik-turun dengan pasar; bukan market-neutral.", correct: true },
            { text: "Sinyal terlalu bagus sehingga semua orang mau beli", why: "Long bias bukan ukuran kualitas — ini soal netralitas terhadap arah pasar." },
            { text: "Short 12% terlalu kecil untuk menutup biaya", why: "Masalahnya bukan biaya short, melainkan bias arah: bukan market-neutral." }
          ],
        },
        {
          q: "Paket 'S' (Sharpe 1,52, semua check lolos, turnover 0,62, fitness 1,08). Catatan kerja yang tepat?",
          options: [
            { text: "LANJUT; poles berikutnya dilarang menaikkan turnover / menurunkan fitness", why: "Benar. Keduanya dekat batas — constraint tercatat mencegah poles yang membunuh kandidat.", correct: true },
            { text: "BUANG — Sharpe 1,52 di bawah Kilat 1,61", why: "Salah total. Keputusan dibuat panel (7/7), bukan headline. S lanjut, Kilat dibuang." },
            { text: "LANJUT; poles bebas karena semua hijau", why: "Berbahaya: poles bebas bisa mendorong turnover melewati 0,7 tanpa disadari." }
          ],
        },
        {
          q: "Drawdown 18% sendirian (6 check lain hijau). Respons sesuai peta keputusan?",
          options: [
            { text: "INVESTIGASI: petakan kapan luka terjadi sebelum memutuskan", why: "Benar. Luka terkonsentrasi di satu episode krisis ≠ luka tersebar — bedakan dulu.", correct: true },
            { text: "BUANG langsung — check menggugurkan", why: "Terburu-buru. Drawdown sendirian = satu-satunya kasus yang layak investigasi dulu." },
            { text: "LANJUT — 6 dari 7 sudah bagus", why: "Tidak ada 'rata-rata' di IS checks; tapi drawdown sendirian memang jalur investigasi, bukan lanjut buta." }
          ],
        }
      ],
      reference: "Headline mengundang, panel memutuskan. Satu merah struktural = buang.",
    },
  ],
};
