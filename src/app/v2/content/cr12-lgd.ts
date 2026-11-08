import type { V2Lesson } from "../lib/types";

export const cr12: V2Lesson = {
  slug: "cr12-lgd",
  track: "Credit Risk",
  module: "LGD, EAD & ECL",
  title: "CR12 — LGD: Dari Agunan ke Recovery",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Agunan Rp 800 juta ≠ recovery Rp 800 juta",
      prose: [
        "Pak Bambang mengajukan kredit Rp 500 juta dengan agunan rumah \"senilai Rp 800 juta\". Tim bisnis: \"Agunan 160% dari utang — aman.\" Tiga tahun kemudian, realisasinya: rumah laku lelang Rp 280 juta di tahun ke-1 dan Rp 40 juta di tahun ke-2 (total Rp 320 juta dari nilai Rp 800 juta — pasar turun + lelang selalu diskon); Pak Bambang mencicil Rp 45 juta selama proses; klaim asuransi Rp 25 juta; biaya lelang, hukum, appraisal: Rp 50 juta; nilai waktu: recovery tahun ke-2 didiskonto (diskonto Rp 18,05 juta).",
        "Arus masuk total Rp 390 juta (lelang 280 + 40, cicilan 45, asuransi 25) — tetapi itu angka KOTOR, bukan recovery bersih. Setelah biaya Rp 50 juta dan diskonto Rp 18,05 juta, recovery bersih didiskonto = Rp 321,95 juta ≈ Rp 322 juta. LGD = 1 − 322/500 = 35,6% — sama dengan hasil lab berikut, karena ini contoh yang sama. Bukan 0% seperti dibayangkan — dan ini kasus bagus (ada agunan properti!).",
        "Di antara agunan dan recovery ada diskon lelang, biaya, waktu, dan ekonomi — empat pencuri yang memakan recovery. Lesson ini menghitung jejak mereka satu per satu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tiga potongan antara nilai agunan dan recovery: (1) haircut pasar — lelang < nilai pasar, apalagi saat krisis; (2) biaya — hukum/lelang bisa 10–20%; (3) waktu — diskonto 2–3 tahun. Analis yang memakai nilai agunan mentah sedang berhalusinasi.",
      },
      reference: "Haircut agunan = (800−320)/800 = 60% — agunan 'menyusut' sebelum dipakai.",
    },
    {
      id: "workout",
      eyebrow: "Langkah 2 · Workout",
      title: "Akuntansi penyelamatan",
      prose: [
        "Workout LGD = 1 − (recovery bersih / EAD), di mana recovery bersih = semua arus masuk (lelang agunan, cicilan, klaim asuransi) dikurangi biaya (hukum, lelang, collection) dan didiskonto ke nilai kini. Alternatif: market LGD — dari harga pasar obligasi/kredit macet (untuk korporasi besar yang diperdagangkan).",
        "Contoh cerita pembuka: EAD Rp 500 jt; arus masuk: lelang Rp 280 jt (thn 1) + Rp 40 jt (thn 2), cicilan Rp 45 jt, klaim asuransi Rp 25 jt; biaya Rp 50 jt; diskonto waktu. Recovery bersih didiskonto ≈ Rp 322 jt → recovery rate 64% → LGD ≈ 35,6%. (Hitung sendiri di lab berikut.)",
        "Workout LGD seperti laporan keuangan proyek penyelamatan — tiap rupiah masuk dan keluar dicatat, waktu dihargai. Bank yang tidak mendiskonto recovery 3 tahun = mengklaim \"kembali Rp 100\" padahal nilai kini cuma Rp 75.",
      ],
      formula: String.raw`\text{LGD} = 1 - \frac{\sum_t \frac{\text{Recovery}_t - \text{Biaya}_t}{(1+r)^t}}{\text{EAD}}`,
      formulaNote: "r = tingkat diskonto — untuk ECL (PSAK 109) dipakai EIR awal kredit; untuk workout LGD praktiknya memakai EIR atau biaya modal. Tingkat diskonto recovery TIDAK harus sama dengan suku bunga kredit — sebutkan r yang dipakai dan alasannya. Recovery rate = 1 − LGD.",
      tasks: [],
      reference: "Bank memakai nilai likuidasi (bukan nilai pasar) saat menilai agunan di awal.",
    },
    {
      id: "lab-lgd",
      eyebrow: "Langkah 3 · Lab LGD",
      title: "Kalkulator LGD workout",
      prose: [
        "Kredit Rp 500 jt default. Arus masuk: lelang Rp 280 jt (thn 1), Rp 40 jt (thn 2); cicilan Rp 45 jt; klaim asuransi Rp 25 jt. Biaya: lelang & hukum Rp 30 jt, collection Rp 20 jt. Diskonto waktu (penyederhanaan): 40×0,17 + 45×0,25. Tugasmu: hitung recovery bersih dan LGD (%).",
      ],
      tasks: [
        { id: "t1", text: "Hitung `recovery_bersih` = total masuk − total biaya − diskonto" },
        { id: "t2", text: "Hitung `lgd` (%) = (1 − recovery_bersih/ead) × 100" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "bersih=321.9 lgd=35.6",
      hints: [
        "Jumlahkan dulu total arus masuk dan total biaya.",
        "Diskonto sudah dirumuskan: 40*0.17 + 45*0.25.",
        "recovery_bersih = total_masuk - total_biaya - diskonto",
      ],
      code: {
        starter: `ead = 500  # juta Rp\n\narus_masuk = [280, 40, 45, 25]   # lelang thn1, lelang thn2, cicilan, asuransi\nbiaya = [30, 20]                 # lelang & hukum, collection\ndiskonto = 40 * 0.17 + 45 * 0.25  # penyederhanaan nilai waktu\n\n# TULIS KODEMU\nrecovery_bersih = \nlgd = \n\nprint(f"bersih={recovery_bersih:.1f} lgd={lgd:.1f}")`,
        lockLines: 4,
        solution: `ead = 500  # juta Rp\n\narus_masuk = [280, 40, 45, 25]   # lelang thn1, lelang thn2, cicilan, asuransi\nbiaya = [30, 20]                 # lelang & hukum, collection\ndiskonto = 40 * 0.17 + 45 * 0.25  # penyederhanaan nilai waktu\n\n# TULIS KODEMU\nrecovery_bersih = sum(arus_masuk) - sum(biaya) - diskonto\nlgd = (1 - recovery_bersih / ead) * 100\n\nprint(f"bersih={recovery_bersih:.1f} lgd={lgd:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "recovery_bersih", value: 321.95, tol: 0.5, label: "`recovery_bersih` sekitar 321.9", msg: "390 − 50 − 18.05 = 321.95." },
          { kind: "equal", task: "t2", name: "lgd", value: 35.6, tol: 0.2, label: "`lgd` sekitar 35.6", msg: "(1 − 321.95/500) × 100 ≈ 35.6." },
          { kind: "stdout_matches", task: "t3", pattern: "bersih=321\\.9\\s+lgd=35\\.6", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: naikkan 'Biaya lelang' jadi 80 (sengketa hukum) — LGD naik.",
    },
    {
      id: "curve",
      eyebrow: "Langkah 4 · Recovery Curve",
      title: "Waktu adalah pencuri",
      prose: [
        "Recovery curve = % kumulatif yang berhasil dipulihkan per bulan sejak default. Bentuk umum: curam di awal, mendatar kemudian — yang mudah kembali duluan (cicilan sukarela, agunan likuid), sisanya alot.",
        "50% kembali dalam 24 bulan pertama — kecepatan adalah segalanya. Setelah bulan 36, kurva mendatar: tiap bulan tambahan hanya menambah 1–2%. Implikasi bisnis: investasi di kecepatan eksekusi (lelang cepat, hukum efisien) sering lebih menguntungkan daripada \"menunggu harga bagus\". Waktu yang dihemat = diskonto yang dihemat.",
        "Keputusan: eksekusi cepat di zona curam (0–24 bulan); penantian panjang mahal (diskonto + biaya) dengan tambahan minimal. Recovery curve mendatar setelah bulan 36: bulan 36–60 hanya menambah ~7%.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Semakin lama menunggu, semakin tinggi harga jual agunan.\" Menunggu = diskonto waktu + biaya penitipan + risiko harga turun. Kecuali ada alasan kuat (pasar sedang crash sementara), eksekusi cepat hampir selalu menang secara nilai kini.",
      },
      reference: "Kecepatan adalah strategi LGD.",
    },
    {
      id: "downturn",
      eyebrow: "Langkah 5 · Downturn",
      title: "Saat semua menjual bersamaan",
      prose: [
        "Downturn LGD = LGD pada kondisi ekonomi buruk — dipakai untuk modal (Basel/IRB). Logikanya: saat resesi, PD naik DAN LGD naik bersamaan (korelasi default–LGD): agunan properti jatuh tepat saat banyak debitur macet dan semua bank melelang bareng.",
        "Aturan Basel: LGD untuk modal = max(LGD rata-rata jangka panjang, LGD downturn) — ambil yang lebih konservatif. Tidak boleh memakai LGD masa boom untuk modal. Contoh: LGD melonjak 35% → 55% saat resesi — hampir 60% lebih buruk. Kombinasikan dengan PD yang juga naik 2× (CR10): EL saat resesi bisa 3× lipat normal. Inilah korelasi PD–LGD yang membuat krisis begitu brutal — dua mesin kerugian menyala bersamaan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Agunan jatuh tepat saat default membludak — modal harus disiapkan untuk skenario itu, bukan untuk masa indah. Memakai LGD masa boom untuk modal = modal kurang tepat saat paling dibutuhkan.",
      },
      reference: "LGD modal = max(rata-rata jangka panjang, downturn).",
    },
    {
      id: "lab-bimodal",
      eyebrow: "Langkah 6 · Lab Bimodal",
      title: "Rata-rata menipu",
      prose: [
        "1000 kasus default disimulasikan (terkunci): 25% sembuh/agunan bagus (LGD 0–10%), 15% sebagian (10–70%), 60% hilang total (70–100%). Tugasmu: hitung rata-rata, median, dan P90 LGD — lalu lihat betapa menipunya rata-rata.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rata` dan `median` LGD" },
        { id: "t2", text: "Hitung `p90` (persentil 90)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "rata=58.8 median=75.5 p90=95.7",
      hints: [
        "Urutkan list untuk median dan persentil.",
        "Median = elemen tengah list terurut.",
        "s = sorted(lgd_list); median = s[500]; p90 = s[900]",
      ],
      code: {
        starter: `import random\nrandom.seed(33)\n\nlgd_list = []\nfor _ in range(1000):\n    r = random.random()\n    if r < 0.25:\n        lgd_list.append(random.uniform(0, 10))\n    elif r < 0.40:\n        lgd_list.append(random.uniform(10, 70))\n    else:\n        lgd_list.append(random.uniform(70, 100))\n\n# TULIS KODEMU\nrata = \nmedian = \np90 = \n\nprint(f"rata={rata:.1f} median={median:.1f} p90={p90:.1f}")`,
        lockLines: 10,
        solution: `import random\nrandom.seed(33)\n\nlgd_list = []\nfor _ in range(1000):\n    r = random.random()\n    if r < 0.25:\n        lgd_list.append(random.uniform(0, 10))\n    elif r < 0.40:\n        lgd_list.append(random.uniform(10, 70))\n    else:\n        lgd_list.append(random.uniform(70, 100))\n\n# TULIS KODEMU\nrata = sum(lgd_list) / len(lgd_list)\ns = sorted(lgd_list)\nmedian = s[500]\np90 = s[900]\n\nprint(f"rata={rata:.1f} median={median:.1f} p90={p90:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rata", value: 58.8, tol: 0.5, label: "`rata` sekitar 58.8", msg: "Rata-rata aritmetika 1000 kasus." },
          { kind: "equal", task: "t1", name: "median", value: 75.5, tol: 0.5, label: "`median` sekitar 75.5", msg: "Median jauh di atas rata-rata — distribusi miring." },
          { kind: "equal", task: "t2", name: "p90", value: 95.7, tol: 0.5, label: "`p90` sekitar 95.7", msg: "10% kasus terburuk di atas 95.7%." },
          { kind: "stdout_matches", task: "t3", pattern: "rata=58\\.8\\s+median=75\\.5\\s+p90=95\\.7", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Hampir tidak ada kasus yang LGD-nya tepat di rata-rata. Model LGD: dua tahap (sembuh/tidak, lalu berapa).",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Peta keputusan: mengestimasi LGD yang realistis",
      prose: [
        "Skenario 1 — Kredit dengan agunan properti. → Hitung dari nilai LIKUIDASI (lelang cepat), bukan appraisal marketing; kurangi biaya lelang/hukum; diskonto ke nilai kini. Contoh nyata: ruko 'senilai Rp 1 M' → likuidasi Rp 600 M → recovery kini Rp 446 jt → LGD 44%, bukan 'aman'. LTV menipu: 80% (klaim) vs 133% (realita).",
        "Skenario 2 — Agunan di kawasan sepi / tidak likuid. → Tambahkan haircut likuiditas: 3 ruko sebelahnya 2 tahun tidak laku = agunan yang tidak bisa dijual saat dibutuhkan. Nilai tanpa likuiditas = angka di atas kertas.",
        "Skenario 3 — Menghitung modal (IRB). → Pakai downturn LGD = max(rata-rata jangka panjang, LGD saat resesi). Contoh nyata: LGD 35% → 55% saat resesi; dikombinasikan PD yang naik 2×, EL saat krisis bisa 3× lipat normal — dua mesin kerugian menyala bersamaan.",
        "Skenario 4 — Recovery sudah berjalan 36 bulan dan kurva mendatar. → Hentikan: tiap bulan tambahan hanya menambah 1–2% dengan biaya penuh. Investasi di kecepatan eksekusi (0–24 bulan) hampir selalu mengalahkan 'menunggu harga bagus' — kecuali ada alasan kuat yang dibuktikan data (misal pasar sedang crash sementara dan diperkirakan pulih), bukan sekadar harapan harga naik.",
        "Skenario 5 — Kredit tanpa agunan (KTA, kartu kredit). → Terima LGD 80–90% dan harga harus mencerminkan: bunga 2–3% per bulan bukan keserakahan — melainkan aritmetika LGD 86% (contoh: recovery Rp 7 jt dari Rp 50 jt).",
        "Aturan praktis 10 detik: LGD = 1 − recovery bersih kini / EAD; pakai nilai likuidasi bukan pasar; waktu dan biaya adalah empat pencuri recovery — diskonto mereka.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "'Agunan 160% dari utang — aman.' Tiga tahun kemudian: lelang Rp 320 jt (280 + 40, diskon pasar turun), cicilan Rp 45 jt, asuransi Rp 25 jt, biaya Rp 50 jt, diskonto Rp 18,05 jt — recovery bersih Rp 322 jt dari Rp 500 jt, LGD 35,6%. Dan itu kasus BAGUS. Agunan bukan recovery; agunan adalah janji recovery yang dipotong empat pencuri.",
      },
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Agunan \"senilai\" Rp 1 M",
      prose: [
        "PT Maju Jaya mengajukan kredit Rp 800 juta dengan agunan ruko \"senilai Rp 1 M\" (appraisal internal marketing). Tim bisnis: \"LTV 80%, aman!\" Kamu verifikasi: appraisal independen — nilai pasar Rp 850 juta; nilai likuidasi (lelang cepat): Rp 600 juta. Ruko di kawasan yang sepi — 3 ruko sebelahnya sudah 2 tahun tidak laku. Estimasi biaya lelang + hukum: Rp 60 juta; waktu eksekusi 2 tahun (r = 10%).",
        "Pembahasan: recovery realistis = 600 − 60 = Rp 540 jt, didiskonto 2 tahun @10% ≈ Rp 446 jt. LGD = 1 − 446/800 = 44% — bukan \"aman\"! LTV menipu: 800/1000 = 80% (klaim marketing) vs 800/600 = 133% (realita likuidasi) — kredit ini under-collateralized.",
        "Tiga pelajaran: (1) appraisal harus independen (marketing punya insentif); (2) pakai nilai likuidasi, bukan pasar; (3) likuiditas agunan (kawasan sepi) sama pentingnya dengan nilainya. Rekomendasi: tolak, atau turunkan plafon ke Rp 400 jt + agunan tambahan.",
      ],
      tasks: [],
      reference: "Coverage di atas kertas bukan jaminan — yang menentukan adalah nilai likuidasi bersih kini.",
    },
    {
      id: "pendalaman-penjual",
      eyebrow: "Langkah 9 · Pendalaman",
      title: "LGD dari sisi penjual",
      prose: [
        "Contoh terapan kedua — bandingkan dua produk yang LGD-nya bak langit dan bumi. KPR Rp 800 juta dengan agunan rumah (LTV 80%): debitur default di tahun ke-3, sisa utang Rp 720 juta. Rumah laku lelang Rp 750 juta (haircut 25% dari nilai pasar Rp 1 M karena lelang + pasar lesu), biaya lelang & hukum Rp 60 juta, waktu eksekusi 2 tahun (diskonto 10% → faktor 0,826). Recovery bersih kini = (750 − 60) × 0,826 ≈ Rp 570 juta. LGD = 1 − 570/720 = 21%. Bandingkan KTA tanpa agunan Rp 50 juta: recovery hanya dari cicilan parsial + collection — Rp 8 juta dalam 18 bulan, didiskonto ≈ Rp 7 juta. LGD = 1 − 7/50 = 86%. Pelajarannya: LGD bukan sifat debitur — ia sifat STRUKTUR (ada agunan? seberapa likuid? berapa lama eksekusinya?). Dua debitur yang sama-sama \"macet\" bisa punya LGD 21% vs 86% hanya karena struktur transaksinya beda. Inilah kenapa pricing KTA (bunga 2–3% per bulan) jauh di atas KPR.",
        "Kontras cara salah vs benar yang paling sering menjebak analis junior: \"agunan bagus = LGD rendah, titik.\" Cara salah: kredit Rp 800 juta dengan agunan ruko \"senilai Rp 1 M\" → LGD diasumsikan 10% → CKPN kecil → bunga murah. Cara benar: tanyakan tiga hal sebelum percaya agunan. Satu: likuiditas — berapa lama ruko sejenis laku di kawasan itu? (3 ruko sebelahnya 2 tahun tidak laku = agunan tidak likuid.) Dua: korelasi — apakah nilai agunan jatuh BERSAMAAN dengan default debitur? Ruko di kawasan industri yang sepi saat pabrik-pabrik tutup = wrong-way collateral: agunan rusak tepat saat dibutuhkan. Tiga: eksekusi — berapa lama proses lelang + sengketa di yurisdiksi ini? Di Indonesia eksekusi Hak Tanggungan yang disengketakan bisa 2–4 tahun; tiap tahun = diskonto ~10% + biaya penitipan. Agunan yang bagus di atas kertas tetapi tidak likuid, berkorelasi, dan lama dieksekusi = LGD 44% seperti di mini-case — bukan 10%.",
        "Mode kegagalan nyata: \"agunan siluman\" — agunan yang nilainya evaporasi tepat saat krisis. Contoh: kredit modal kerja dengan agunan persediaan (stok elektronik). Saat debitur sehat, stok Rp 500 juta terlihat solid. Saat debitur default (biasanya karena penjualan jeblok), stok yang sama ternyata: separuh usang (model lama tidak laku), seperempat hilang (tidak ada stock opname 2 tahun), sisanya laku setengah harga karena dijual buru-buru. Recovery riil: Rp 120 juta dari klaim Rp 500 juta. Aturan keputusan: untuk agunan non-properti, wajib ada (1) stock opname independen minimal tahunan, (2) haircut minimal 50% untuk persediaan (bukan 20–30% seperti properti), (3) asuransi yang meng-cover. Dan prinsip umumnya: semakin likuid agunan dalam kondisi STRES (bukan kondisi normal), semakin rendah LGD-nya. Nilai agunan dalam kondisi normal adalah dongeng; yang penting adalah nilainya saat semua orang menjual bersamaan.",
        "Pendalaman rumus yang selama ini hanya disebut sekilas: Expected Loss. EL = PD × LGD × EAD. Tiga simbolnya: PD (Probability of Default) — peluang debitur default dalam 12 bulan; LGD — % yang hilang JIKA default; EAD (Exposure at Default) — sisa utang saat default terjadi. Contoh konkret: KTA Rp 50 juta, PD 4%, LGD 86%, EAD Rp 50 juta → EL = 0,04 × 0,86 × 50 juta = Rp 1,72 juta per debitur. Untuk 10.000 debitur = Rp 17,2 miliar expected loss per tahun — inilah angka yang menjadi CKPN dan dasar pricing (bunga harus menutup EL + biaya + margin). Interpretasinya: EL adalah \"harga wajar\" risiko — bank yang memberi bunga di bawah EL + biaya operasional sedang mensubsidi debitur berisiko dengan uang pemegang saham. Dan hubungan ketiganya: PD × LGD berarti risiko = (seberapa mungkin gagal) × (seberapa parah jika gagal) — dua dimensi yang independen dan harus diukur terpisah. Bank yang hanya mengukur PD sedang mengemudi dengan satu mata.",
        "Aturan keputusan LGD yang ditempel di dinding. Satu: selalu pakai nilai LIKUIDASI (lelang cepat), bukan nilai pasar — selisihnya 20–40% untuk properti, 50%+ untuk persediaan/kendaraan. Dua: appraisal harus independen — marketing/appraisal internal punya insentif melebihkan. Tiga: hitung waktu eksekusi realistis per yurisdiksi (Indonesia: 1–2 tahun normal, 2–4 tahun jika disengketakan) dan diskonto dengan suku bunga kredit itu sendiri. Empat: untuk modal (Basel), pakai max(LGD rata-rata, LGD downturn) — jangan pernah pakai LGD masa boom. Lima: agunan yang nilainya berkorelasi dengan kesehatan debitur (saham perusahaan sendiri, ruko di kawasan usahanya) = wrong-way collateral — haircut dobel atau tolak sebagai agunan utama. Lima aturan ini mengubah LGD dari \"angka di model\" menjadi \"uang yang benar-benar kembali\".",
        "Contoh angka downturn LGD — kenapa Basel memaksa konservatisme. Portofolio KPR: LGD rata-rata jangka panjang 20%, PD 2% → EL normal = 0,02 × 0,20 = 0,4% dari eksposur. Saat resesi properti: harga rumah turun 30% (haircut lelang membesar), waktu eksekusi molor 1 → 3 tahun, biaya hukum naik — LGD downturn 38%; PD naik ke 5% (PHK massal). EL resesi = 0,05 × 0,38 = 1,9% — hampir 5× lipat EL normal! Inilah korelasi PD–LGD: dua mesin kerugian menyala bersamaan. Bank yang mencadangkan modal hanya untuk EL normal (0,4%) akan kekurangan modal tepat saat paling dibutuhkan. Aturan Basel max(rata-rata, downturn) memastikan modal disiapkan untuk 1,9%, bukan 0,4%. Analis yang memakai LGD masa boom untuk pricing juga salah: bunga yang \"kompetitif\" hari ini = kerugian yang terealisasi saat resesi. Pricing yang jujur memakai through-the-cycle LGD, bukan point-in-time yang manis.",
        "Satu senjata yang jarang dipakai bank Indonesia: collateral maintenance covenant. Untuk kredit korporasi dengan agunan properti/saham, perjanjian bisa mewajibkan LTV tidak melebihi 80% SEPANJANG tenor — jika nilai agunan turun (re-appraisal tahunan) hingga LTV >80%, debitur wajib top-up agunan atau cicil dipercepat (margin call versi kredit). Contoh: kredit Rp 800 juta, agunan dinilai ulang turun Rp 1 M → Rp 850 juta → LTV 94% → trigger: debitur setor Rp 130 juta atau tambah agunan dalam 90 hari. Tanpa covenant ini, bank baru sadar under-collateralized saat debitur sudah default — terlambat 2 tahun. Covenant ini murah (satu klausul + appraisal tahunan Rp 5–10 juta) tetapi mengubah LGD ekspektasi secara material: ia memaksa masalah muncul saat masih bisa diperbaiki. Agunan yang tidak dimonitor nilainya = asuransi yang tidak pernah dicek masih berlaku.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: LGD bukan soal agunan, soal siapa menjual, kapan, dan berapa lama",
        body: "Analis junior bertanya: \"agunannya apa dan nilainya berapa?\" Analis senior bertanya: \"SIAPA yang akan menjual agunan ini, KAPAN ia bisa dijual, dan BERAPA LAMA prosesnya?\" Heuristiknya: nilai agunan = harga × probabilitas terjual × kecepatan eksekusi. Rumah di Jakarta Selatan: harga tinggi, probabilitas terjual 90% dalam 6 bulan → LGD rendah. Ruko di kawasan sepi: harga \"Rp 1 M\" di brosur, probabilitas terjual 30% dalam 2 tahun → LGD tinggi. Pabrik khusus (mesin tekstil): hanya 3 pembeli potensial di Indonesia → harganya fiksi sampai ada pembeli. Maka aturan praktisnya: sebelum menerima agunan, tulis satu kalimat — \"jika debitur default besok, siapa pembelinya dan berapa lama lakunya?\" Jika tidak bisa menjawab dalam satu kalimat konkret, agunan itu dekorasi, bukan mitigasi. LGD yang jujur selalu dihitung dari skenario penjualan stres, bukan dari brosur appraisal. Satu kebiasaan yang membedakan senior: sebelum menyetujui kredit beragunan, telepon bagian remedial dan tanya \"eksekusi terakhir sejenis butuh berapa lama dan kembali berapa persen?\" — jawaban mereka adalah LGD-mu yang sebenarnya, bukan angka di model.",
      },
      reference: "Sebelum terima agunan, tulis satu kalimat: jika default besok, siapa pembelinya dan berapa lama lakunya?",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Workout LGD = 1 − recovery bersih/EAD. Recovery bersih = arus masuk − biaya, didiskonto.",
        "Tiga potongan: haircut pasar, biaya, waktu. Pakai nilai likuidasi, bukan pasar.",
        "Recovery curve: curam di awal, mendatar setelah bulan 36 — kecepatan = uang.",
        "Downturn LGD untuk modal: max(rata-rata, downturn) — PD & LGD naik bersamaan saat resesi.",
        "Distribusi LGD bimodal: rata-rata menipu untuk kasus individual — model dua tahap.",
      ],
      next: { label: "CR13 — EAD & CCF", href: "/v2/learn/cr13-ead-ccf" },
      quiz: [
        {
          q: "EAD Rp 500 jt, recovery bersih didiskonto Rp 322 jt. LGD?",
          options: [
            { text: "64,4%", why: "Itu recovery rate-nya (322/500), bukan LGD." },
            { text: "35,6% (1 − 322/500)", why: "Ingat: recovery sudah bersih (dikurangi biaya) dan didiskonto — bukan angka kotor (390 jt adalah arus masuk kotor).", correct: true },
            { text: "110%", why: "LGD tidak melebihi 100% dalam kasus ini." },
            { text: "0%", why: "Recovery tidak penuh — LGD tidak nol." },
          ],
        },
        {
          q: "Mengapa Basel mewajibkan downturn LGD untuk modal?",
          options: [
            { text: "Agar bank untung", why: "Bukan soal keuntungan." },
            { text: "PD dan LGD naik bersamaan saat resesi (korelasi) — memakai LGD masa boom = modal kurang tepat saat paling dibutuhkan", why: "Agunan jatuh tepat saat default membludak — modal harus disiapkan untuk skenario itu.", correct: true },
            { text: "Supaya perhitungan rumit", why: "Bukan soal kerumitan." },
            { text: "Tidak ada alasan", why: "Ada: korelasi PD–LGD." },
          ],
        },
        {
          q: "Distribusi LGD bimodal. Implikasi untuk modeling?",
          options: [
            { text: "Pakai rata-rata saja — cukup", why: "Rata-rata hampir tidak pernah terjadi pada kasus individual." },
            { text: "Model dua tahap (sembuh/tidak, lalu berapa) — satu regresi linear salah alat karena jarang ada kasus di tengah", why: "Regresi linear memprediksi angka tengah untuk semua — angka yang hampir tidak pernah terjadi.", correct: true },
            { text: "LGD tidak bisa dimodelkan", why: "Bisa — dengan model dua tahap." },
            { text: "Pakai median", why: "Median juga satu angka — tidak menangkap dua rezim." },
          ],
        },
        {
          q: "Agunan dinilai Rp 800 jt (pasar). Untuk estimasi LGD yang jujur, pakai?",
          options: [
            { text: "Rp 800 jt — nilai pasar", why: "Nilai pasar ≠ nilai likuidasi." },
            { text: "Nilai likuidasi (lelang cepat) dikurangi biaya dan didiskonto — karena itulah yang benar-benar kembali", why: "Tiga potongan (haircut, biaya, waktu) memisahkan 'nilai di kertas' dari 'uang kembali'.", correct: true },
            { text: "Rp 0 — agunan tidak berguna", why: "Agunan tetap punya nilai likuidasi." },
            { text: "Nilai saat akad 10 tahun lalu", why: "Nilai historis tidak relevan untuk recovery kini." },
          ],
        },
        {
          q: "Agunan dinilai KJPP Rp 1 M untuk utang Rp 800 jt (coverage 125%). Setelah haircut lelang 25%, biaya Rp 60 jt, dan diskonto 2 tahun (r=10%), LGD-nya?",
          options: [
            { text: "0% — agunan lebih besar dari utang", why: "Coverage di atas kertas ≠ recovery bersih." },
            { text: "~29% — tiga potongan + pencuri waktu bekerja", why: "1000→750 (haircut), →690 (biaya), →570 nilai kini (diskonto) → recovery 71% → LGD 29%.", correct: true },
            { text: "125%", why: "Itu coverage, bukan LGD." },
            { text: "Tidak bisa dihitung", why: "Bisa — tiga potongannya diketahui." },
          ],
        },
      ],
    },
  ],
};
