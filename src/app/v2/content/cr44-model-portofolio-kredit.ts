import type { V2Lesson } from "../lib/types";

export const cr44: V2Lesson = {
  slug: "cr44-model-portofolio-kredit",
  track: "Credit Risk",
  module: "Risiko Portofolio",
  title: "CR44 — Model Portofolio Kredit Bernama: CreditMetrics, CreditRisk+, dan KMV",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Dua portofolio, EL sama Rp10 miliar — yang satu butuh modal Rp54 miliar lebih banyak",
      prose: [
        "Bank Nusantara punya dua portofolio kredit, masing-masing Rp1.000 miliar, PD rata-rata 2 persen, LGD 50 persen. EL keduanya: 1.000 × 0,02 × 0,5 = Rp10 miliar — identik. Tetapi portofolio A (100 debitur tersebar) punya VaR 99 persen Rp64,3 miliar — UL Rp54,3 miliar. Portofolio B (10 debitur besar yang berkorelasi) punya VaR 99 persen Rp120 miliar — UL Rp110 miliar. EL yang sama, modal yang berbeda dua kali lipat. CR15 sudah mengajarkan pelajaran ini lewat simulasi (UL 100 debitur vs 5 debitur) — tetapi tidak pernah memberi NAMA modelnya.",
        "Nama-nama itu penting — karena regulator, auditor, dan vendor memakai mereka. CreditMetrics (J.P. Morgan, 1997): portofolio dihitung dari matriks migrasi rating dan korelasi ekuitas. CreditRisk+ (Credit Suisse, 1997): portofolio dihitung dari distribusi Poisson dan faktor sektoral — tanpa korelasi eksplisit. KMV Portfolio Manager (Moody's KMV): portofolio dihitung dari model struktural Merton — jarak default tiap debitur dan korelasi asetnya. Tiga model, tiga filosofi — dan tiga jawaban yang berbeda untuk portofolio yang sama.",
        "Lesson ini membangun topik yang mendapat NOL hit di seluruh track Credit Risk: 'CreditMetrics', 'CreditRisk+', 'KMV Portfolio', dan 'CreditPortfolioView' tidak pernah muncul di file cr mana pun. CR15 mengajarkan konsep EL vs UL dan konsentrasi lewat simulasi; CR41 mengajarkan Merton/KMV untuk SATU debitur. Lesson ini membangun model PORTFOLIO bernama itu — dan menunjukkan kapan memakai yang mana. Setelah lesson ini kamu bisa: (1) menjelaskan tiga model portofolio bernama dan filosofinya; (2) menghitung VaR portofolio dengan model satu faktor Vasicek; (3) menjelaskan matriks migrasi CreditMetrics; (4) menjelaskan Poisson dan faktor sektoral CreditRisk+; (5) memilih model sesuai portofolio.",
      ],
      tasks: [],
      note: {
        title: "Yang sudah ada vs yang baru di sini",
        body: "CR15 mengajarkan EL vs UL, konsentrasi, dan korelasi lewat simulasi Monte Carlo (UL 100 debitur Rp75,7 juta vs 5 debitur Rp143,8 juta) — tetapi tanpa nama model. CR41 mengajarkan Merton/KMV untuk SATU debitur (d2, PD, DD). Grep menyeluruh: CreditMetrics, CreditRisk+, KMV Portfolio, dan CreditPortfolioView mendapat NOL hit di seluruh track Credit Risk. Lesson ini membangun ketiga model portofolio bernama itu dari nol.",
      },
      reference: "Portofolio Rp1.000 miliar, PD 2 persen, LGD 50 persen, korelasi 0,2. PD bersyarat 99 persen 12,86 persen; VaR 99 persen Rp64,30 miliar; EL Rp10 miliar; UL Rp54,30 miliar.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan",
      title: "Tujuan pembelajaran",
      prose: [
        "Setelah lesson ini, kamu bisa menyebut nama model portofolio kredit — dan tahu apa yang diasumsikannya.",
        "(1) Menjelaskan CreditMetrics, CreditRisk+, dan KMV Portfolio Manager serta filosofinya;",
        "(2) Menghitung VaR portofolio dengan model satu faktor Vasicek;",
        "(3) Menjelaskan matriks migrasi rating CreditMetrics;",
        "(4) Menjelaskan distribusi Poisson dan faktor sektoral CreditRisk+;",
        "(5) Memilih model sesuai jenis portofolio dan data yang tersedia.",
      ],
      tasks: [],
    },
    {
      id: "tiga-model",
      eyebrow: "Langkah 3 · Teori",
      title: "Tiga model, tiga filosofi",
      prose: [
        "CreditMetrics (J.P. Morgan, 1997) memandang kredit lewat RATING. Setiap debitur punya rating hari ini dan matriks migrasi — probabilitas pindah ke tiap rating (termasuk default) dalam setahun. Contoh: debitur BBB punya probabilitas 90 persen tetap BBB, 5 persen naik ke A, 3 persen turun ke BB, 2 persen gagal. Nilai portofolio dihitung dari nilai tiap obligasi di tiap rating (didiskonto dengan kurva rating itu) — dan korelasi antar debitur diambil dari korelasi RETURN EKUITAS mereka (proksi korelasi aset). Kelebihannya: memakai data rating yang tersedia luas. Kelemahannya: butuh matriks migrasi yang stabil — dan korelasi ekuitas bukan korelasi aset yang sebenarnya.",
        "CreditRisk+ (Credit Suisse, 1997) memandang kredit lewat JUMLAH gagal bayar. Jumlah default dalam setahun dimodelkan Poisson — distribusi untuk kejadian langka. Korelasi tidak dimodelkan eksplisit — melainkan lewat FAKTOR SEKTORAL: tiap sektor punya faktor acak (misalnya 'sektor tambang sedang buruk') yang menaikkan PD semua debitur di sektor itu bersamaan. Kelebihannya: hanya butuh PD dan LGD — data minimal, perhitungan analitis cepat. Kelemahannya: tidak memakai informasi rating dan tidak memodelkan migrasi — hanya default, bukan penurunan rating.",
        "KMV Portfolio Manager (Moody's KMV) memandang kredit lewat NILAI ASET (model struktural Merton, CR41). Setiap debitur punya distance-to-default (DD) — berapa standar deviasi nilai asetnya di atas titik default. Korelasi antar debitur adalah korelasi RETURN ASET mereka — diestimasi dari model faktor (industri, negara, ukuran). Kelebihannya: memakai informasi pasar (harga saham) yang bergerak harian — paling responsif. Kelemahannya: butuh perusahaan tercatat dengan harga saham — tidak bisa dipakai untuk UKM tanpa harga pasar.",
        "Ketiganya menjawab pertanyaan yang sama — 'berapa distribusi kerugian portofolio?' — dengan data yang berbeda. CreditMetrics butuh rating dan matriks migrasi; CreditRisk+ butuh PD, LGD, dan sektor; KMV butuh harga saham dan DD. Bank dengan portofolio korporat tercatat memakai KMV; bank dengan portofolio ritel besar memakai CreditRisk+; bank dengan portofolio obligasi memakai CreditMetrics. Tidak ada yang 'terbaik' — hanya yang paling cocok dengan data dan portofoliomu.",
        "Model keempat yang namanya muncul di cerita tetapi belum dibangun di lesson ini: CreditPortfolioView (McKinsey). Ia memandang kredit lewat EKONOMI MAKRO: PD dan migrasi rating tiap segmen dimodelkan sebagai fungsi variabel makro (pertumbuhan PDB, pengangguran, suku bunga, harga komoditas) — misalnya logit(PD) = a + b×PDB + c×pengangguran. Dalam resesi, PD semua segmen naik bersamaan karena faktor makronya memburuk — korelasi muncul dari makro yang sama, bukan dari korelasi aset eksplisit. Kelebihannya: terhubung langsung ke skenario makro dan stress test (skenario 'PDB −2%' langsung memberi PD baru). Kelemahannya: butuh deret waktu makro dan default yang panjang untuk mengestimasi koefisien — dan hubungan makro-PD bisa berubah antar rezim. CreditPortfolioView adalah jembatan antara model portofolio dan stress test makro (MR7).",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira ketiga model memberi jawaban yang sama. Untuk portofolio yang sama, ketiganya bisa memberi VaR yang berbeda 2 kali lipat — karena asumsinya berbeda (migrasi vs default saja, korelasi ekuitas vs faktor sektoral). Selalu laporkan model yang dipakai bersama hasilnya — angka tanpa nama model adalah angka tanpa arti.",
      },
      reference: "CreditMetrics: migrasi rating + korelasi ekuitas. CreditRisk+: Poisson + faktor sektoral. KMV: distance-to-default + korelasi aset.",
    },
    {
      id: "vasicek",
      eyebrow: "Langkah 4 · Teori",
      title: "Model satu faktor Vasicek: VaR portofolio dalam satu rumus",
      prose: [
        "Model satu faktor Vasicek (yang mendasari formula modal Basel, CR4a) adalah versi paling sederhana dari ketiga model — dan yang paling penting untuk dipahami. Asumsinya: semua debitur dipengaruhi SATU faktor bersama (ekonomi) plus faktor idiosinkratik masing-masing. Korelasi antar debitur = rho (misalnya 0,2). PD bersyarat pada skenario buruk (kuantil 99 persen faktor bersama) dihitung dengan rumus: PD_bersyarat = N((N^-1(PD) + akar(rho) × N^-1(0,99)) / akar(1 − rho)). Penting: rumus ini memakai asumsi GRANULARITAS TAK-HINGGA — portofolio dianggap sangat besar dengan debitur yang sangat kecil-kecil, sehingga risiko idiosinkratik terdiversifikasi sempurna dan hanya risiko sistematis yang tersisa. Untuk portofolio FINITE dengan debitur besar (seperti portofolio B di cerita: 10 debitur), rumus ini MEREMEHKAN VaR — dibutuhkan granularity adjustment yang menambahkan modal untuk konsentrasi nama tunggal. Angka Rp64,3 miliar di lesson ini adalah batas asimtotik untuk portofolio granular; portofolio yang terkonsentrasi butuh modal lebih.",
        "Hitung contoh cerita pembuka: PD 2 persen, rho 0,2, LGD 50 persen, eksposur Rp1.000 miliar. N^-1(0,02) = minus 2,0537. N^-1(0,99) = 2,3263. Akar 0,2 = 0,4472; akar 0,8 = 0,8944. Pembilang: minus 2,0537 + 0,4472 × 2,3263 = minus 2,0537 + 1,0403 = minus 1,0134. Dibagi 0,8944 = minus 1,1330. N(minus 1,1330) = 0,1286 — PD bersyarat 12,86 persen. VaR 99 persen = 12,86 persen × 50 persen × 1.000 = Rp64,30 miliar. EL = 2 persen × 50 persen × 1.000 = Rp10 miliar. UL = 64,30 − 10 = Rp54,30 miliar. Itulah modal yang harus dipegang untuk portofolio ini.",
        "Perhatikan sensitivitasnya: bila rho naik dari 0,2 ke 0,4 (korelasi krisis), PD bersyarat naik menjadi sekitar 19 persen dan VaR menjadi Rp95 miliar — UL hampir dua kali lipat. Inilah yang diajarkan CR15 lewat simulasi dan E37 lewat krisis: korelasi naik saat stres — dan model yang memakai korelasi masa tenang meremehkan modal yang dibutuhkan. Basel memakai rho 0,12–0,24 tergantung segmen — angka yang konservatif, tetapi tetap satu angka untuk semua kondisi.",
        "Vasicek juga menjelaskan kenapa diversifikasi bekerja — dan kapan berhenti bekerja. Dengan 100 debitur dan rho 0,2, UL Rp54,3 miliar. Dengan 1.000 debitur dan rho yang sama, UL per rupiah TIDAK turun ke nol — ia mendekati batas yang ditentukan rho: risiko sistematis (faktor bersama) tidak bisa didiversifikasi. Inilah 'satu-satunya makan siang gratis' yang terbatas: diversifikasi menghilangkan risiko idiosinkratik, tetapi risiko sistematis tetap — dan modal membayar risiko sistematis itu.",
      ],
      tasks: [],
      formula: String.raw`PD_{99} = N\left(\frac{N^{-1}(PD) + \sqrt{\rho}\, N^{-1}(0{,}99)}{\sqrt{1-\rho}}\right) \qquad \text{VaR}_{99} = PD_{99} \times LGD \times EAD`,
      formulaNote: "PD 2 persen, rho 0,2: N^-1(0,02) = −2,0537; N^-1(0,99) = 2,3263; PD bersyarat = N(−1,1330) = 12,86 persen. VaR 99 persen = 12,86 persen × 50 persen × 1.000 = 64,30. UL = 64,30 − 10 = 54,30.",
      reference: "PD bersyarat 12,86 persen; VaR 99 persen Rp64,30 miliar; EL Rp10 miliar; UL Rp54,30 miliar.",
    },
    {
      id: "lab-vasicek",
      eyebrow: "Langkah 5 · Lab",
      title: "Lab: mesin VaR portofolio Vasicek",
      prose: [
        "Lab ini membangun mesin VaR portofolio satu faktor: dari PD, korelasi, LGD, dan eksposur — hitung PD bersyarat 99 persen, VaR 99 persen, EL, dan UL.",
        "Hitung dulu di kepala. N^-1(0,02) = minus 2,0537; N^-1(0,99) = 2,3263. Pembilang: minus 2,0537 + 0,4472 × 2,3263 = minus 1,0134. Dibagi 0,8944 = minus 1,1330. N(minus 1,1330) = 0,1286. VaR = 0,1286 × 0,5 × 1.000 = Rp64,30 miliar. EL = 0,02 × 0,5 × 1.000 = Rp10 miliar. UL = 64,30 − 10 = Rp54,30 miliar.",
        "Tugas lab: tulis fungsi yang memakai distribusi normal (statistics.NormalDist) untuk menghitung PD bersyarat, VaR, EL, dan UL. Empat angka ini adalah modal portofolio dalam satu baris. Catatan: fungsi invers normal tersedia sebagai NormalDist().inv_cdf dan CDF sebagai NormalDist().cdf.",
        "Setelah lolos, coba eksperimen: naikkan rho menjadi 0,4 dan lihat VaR melonjak ke sekitar Rp95 miliar — lalu tanyakan: berapa modal yang kamu pegang bila korelasi krisis dua kali lipat korelasi tenang?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `pd_bersyarat` (Vasicek 99 persen)" },
        { id: "t2", text: "Hitung `var99` (PD bersyarat dikali LGD dikali eksposur)" },
        { id: "t3", text: "Hitung `el` dan `ul` (EL = PD x LGD x EAD; UL = VaR - EL)" },
      ],
      expected: "pd_bersyarat=0.1286\nvar99=64.30\nel=10.0\nul=54.30",
      hints: [
        "Gunakan statistics.NormalDist: inv_cdf untuk N^-1, cdf untuk N.",
        "PD bersyarat = N((N^-1(PD) + akar(rho) x N^-1(0,99)) / akar(1-rho)).",
        "VaR = PD bersyarat x LGD x EAD; UL = VaR - EL.",
      ],
      code: {
        starter: `# Portofolio: PD 2%, rho 0,2, LGD 50%, eksposur Rp1.000 miliar.\nimport math\nfrom statistics import NormalDist\npd = 0.02\nrho = 0.2\nlgd = 0.5\nead = 1000.0  # miliar rupiah\n\n# TULIS KODEMU: hitung pd_bersyarat, var99, el, ul.\n# Cetak, per baris: pd_bersyarat, var99, el, ul.\n\n`,
        lockLines: 7,
        solution: `# Portofolio: PD 2%, rho 0,2, LGD 50%, eksposur Rp1.000 miliar.\nimport math\nfrom statistics import NormalDist\npd = 0.02\nrho = 0.2\nlgd = 0.5\nead = 1000.0  # miliar rupiah\n\n\nnd = NormalDist()\nz = (nd.inv_cdf(pd) + math.sqrt(rho) * nd.inv_cdf(0.99)) / math.sqrt(1 - rho)\npd_bersyarat = nd.cdf(z)\nvar99 = pd_bersyarat * lgd * ead\nel = pd * lgd * ead\nul = var99 - el\nprint(f"pd_bersyarat={pd_bersyarat:.4f}")\nprint(f"var99={var99:.2f}")\nprint(f"el={el:.1f}")\nprint(f"ul={ul:.2f}")\n`,
        checks: [
          { kind: "equal", task: "t1", name: "pd_bersyarat", value: 0.1286, tol: 0.001, label: "PD bersyarat 12,86 persen", msg: "N(-1,1330) = 0,1286. Di skenario buruk 1-dalam-100, PD melonjak dari 2 persen ke 12,86 persen." },
          { kind: "equal", task: "t2", name: "var99", value: 64.3, tol: 0.05, label: "VaR 99 persen Rp64,30 miliar", msg: "0,1286 x 0,5 x 1.000 = 64,30." },
          { kind: "equal", task: "t3", name: "el", value: 10.0, tol: 0.01, label: "EL Rp10 miliar", msg: "0,02 x 0,5 x 1.000 = 10. Rata-rata kerugian — yang dibayar pencadangan." },
          { kind: "equal", task: "t3", name: "ul", value: 54.3, tol: 0.05, label: "UL Rp54,30 miliar", msg: "64,30 - 10 = 54,30. Sebaran kerugian — yang dibayar modal." },
        ],
      },
      reference: "PD bersyarat 12,86 persen; VaR 99 persen Rp64,30 miliar; EL Rp10 miliar; UL Rp54,30 miliar.",
    },
    {
      id: "memilih",
      eyebrow: "Langkah 6 · Teori",
      title: "Memilih model: data, portofolio, dan tujuan",
      prose: [
        "Memilih model portofolio mengikuti tiga pertanyaan. Pertama, data apa yang kamu punya? Rating dan matriks migrasi → CreditMetrics. Hanya PD, LGD, dan sektor → CreditRisk+. Harga saham dan DD → KMV. Data menentukan model — bukan sebaliknya. Bank yang memaksakan KMV pada portofolio UKM tanpa harga saham sedang memaksakan model pada data yang tidak ada.",
        "Kedua, portofolio apa yang kamu punya? Obligasi korporat yang diperdagangkan → CreditMetrics (migrasi memengaruhi nilai pasar obligasi). Kredit ritel massal (KPR, KTA) → CreditRisk+ (ribuan debitur kecil, PD sektoral). Korporat besar tercatat → KMV (informasi pasar harian). Portofolio campuran → gabungkan: KMV untuk korporat tercatat, CreditRisk+ untuk ritel, lalu agregasi dengan korelasi antar segmen.",
        "Ketiga, untuk apa model itu? Modal regulator (Basel) memakai formula Vasicek — bukan ketiga model ini — karena regulator butuh formula standar yang bisa diaudit. Manajemen internal memakai ketiga model untuk alokasi modal dan pricing (CR21/CR45). Stress test memakai semuanya — dan membandingkan: bila ketiga model memberi VaR yang sangat berbeda, itu BELUM TENTU berarti salah satu asumsinya salah — perbedaan bisa berasal dari asumsi yang berbeda-beda namun masing-masing masuk akal (migrasi vs default saja, korelasi ekuitas vs faktor sektoral). Yang salah adalah mengabaikan perbedaan itu tanpa investigasi — perbedaannya sendiri adalah informasi.",
        "Satu peringatan terakhir: semua model portofolio mengasumsikan korelasi yang STABIL — dan korelasi naik saat stres (E37). Model yang tidak di-stress-test dengan korelasi krisis adalah model yang menipu diri sendiri. Selalu hitung VaR dengan rho tenang DAN rho krisis — dan pegang modal untuk yang lebih besar.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        body: "Mengira model portofolio yang canggih menggantikan pemahaman portofolio. Model memberi angka; pemahaman memberi tahu apakah angka itu masuk akal. Portofolio 10 debitur besar yang berkorelasi tidak bisa 'didiversifikasi' oleh model apa pun — hanya oleh pengurangan konsentrasi yang nyata.",
      },
      reference: "Pilih berdasarkan data, portofolio, dan tujuan. Basel memakai Vasicek untuk modal regulator.",
    },
    {
      id: "mini-case",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: dua vendor, dua VaR, satu portofolio",
      prose: [
        "Bank Nusantara meminta dua vendor menghitung VaR 99 persen portofolio yang sama (Rp1.000 miliar, PD 2 persen, LGD 50 persen). Vendor A (CreditMetrics) berkata Rp58 miliar. Vendor B (KMV) berkata Rp71 miliar. Selisih Rp13 miliar — 22 persen. Direksi bertanya: 'Mana yang benar?' Jawaban yang benar: 'Keduanya — dengan asumsinya masing-masing.' Vendor A memakai matriks migrasi 10 tahun dan korelasi ekuitas 0,15. Vendor B memakai DD dari harga saham dan korelasi aset 0,25. Asumsi korelasi yang berbeda memberi VaR yang berbeda — dan keduanya masuk akal.",
        "Keputusan: bank memakai Vasicek dengan rho 0,2 sebagai angka resmi (Rp64,3 miliar) — di tengah-tengah keduanya — dan melaporkan ketiganya ke direksi dengan asumsinya. Modal dipegang untuk angka TERBESAR (Rp71 miliar) sebagai bantalan kehati-hatian. Dan tim risiko diminta menginvestigasi: kenapa korelasi KMV lebih tinggi — apakah karena portofolio memang terkonsentrasi di sektor yang sama?",
        "Investigasi menemukan: 60 persen portofolio berada di dua sektor yang berkorelasi tinggi (tambang dan energi). Korelasi KMV yang lebih tinggi ternyata LEBIH BENAR — dan bank mengurangi konsentrasi sektor itu 10 poin dalam setahun. Perbedaan model bukan masalah — ia adalah detektor yang menemukan konsentrasi yang disembunyikan angka rata-rata.",
      ],
      tasks: [],
      note: {
        title: "Pembahasan",
        body: "Tiga hal yang membuat keputusan ini benar. Pertama, perbedaan model dipakai sebagai informasi — bukan sebagai alasan memilih yang terkecil. Kedua, modal dipegang untuk angka terbesar (kehati-hatian). Ketiga, perbedaan diinvestigasi sampai ke akar (konsentrasi sektor) — bukan didiamkan.",
      },
      reference: "CreditMetrics Rp58 miliar; KMV Rp71 miliar; Vasicek Rp64,3 miliar. Modal dipegang untuk Rp71 miliar. Konsentrasi 60 persen di dua sektor ditemukan.",
    },
    {
      id: "kuis",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan dari semua langkah. Setiap opsi punya alasan — baca semuanya, jebakannya halus.",
      ],
      tasks: [],
      summary: [
        "PD bersyarat 12,86 persen; VaR 99 persen Rp64,30 miliar; EL Rp10 miliar; UL Rp54,30 miliar.",
        "CreditMetrics: migrasi rating + korelasi ekuitas. CreditRisk+: Poisson + faktor sektoral. KMV: DD + korelasi aset.",
        "Vasicek: satu faktor bersama + idiosinkratik; mendasari formula modal Basel.",
        "Korelasi naik saat stres — hitung VaR dengan rho tenang DAN rho krisis.",
        "Pilih model berdasarkan data, portofolio, dan tujuan — bukan berdasarkan kecanggihan.",
      ],
      next: { label: "CR45 — CVA dari Sisi Kredit: Harga, Modal, dan Wrong-Way Risk", href: "/v2/learn/cr45-cva-kredit" },
      quiz: [
        {
          q: "Portofolio Rp1.000 miliar, PD 2 persen, rho 0,2, LGD 50 persen. Berapa PD bersyarat 99 persen, VaR, EL, dan UL (Vasicek)?",
          options: [
            { text: "PD 12,86 persen; VaR Rp64,30 miliar; EL Rp10 miliar; UL Rp54,30 miliar", why: "Tepat: N(−1,1330) = 0,1286; 0,1286 × 0,5 × 1.000 = 64,30; EL 10; UL 54,30.", correct: true },
            { text: "PD 2 persen; VaR Rp10 miliar; EL Rp10 miliar; UL Rp0", why: "Salah: itu mengasumsikan tidak ada risiko sistematis — PD bersyarat sama dengan PD. Vasicek justru mengukur PD di skenario buruk." },
            { text: "PD 12,86 persen; VaR Rp128,60 miliar; EL Rp10 miliar; UL Rp118,60 miliar", why: "Salah: VaR memakai LGD 50 persen — 0,1286 × 1.000 = 128,6 mengabaikan LGD." },
            { text: "PD 19 persen; VaR Rp95 miliar; EL Rp10 miliar; UL Rp85 miliar", why: "Salah: itu hasil rho 0,4 (korelasi krisis) — bukan rho 0,2 yang ditanyakan." },
          ],
        },
        {
          q: "Apa beda utama CreditMetrics dan CreditRisk+?",
          options: [
            { text: "CreditMetrics memakai migrasi rating dan korelasi ekuitas; CreditRisk+ memakai Poisson dan faktor sektoral tanpa korelasi eksplisit", why: "Tepat: CreditMetrics memodelkan perubahan nilai dari migrasi; CreditRisk+ memodelkan jumlah default dengan faktor sektoral.", correct: true },
            { text: "CreditMetrics untuk ritel; CreditRisk+ untuk korporat", why: "Salah: terbalik dalam praktik — CreditRisk+ cocok untuk ritel massal (data minimal), CreditMetrics untuk obligasi korporat." },
            { text: "CreditMetrics tidak memakai korelasi; CreditRisk+ memakai korelasi ekuitas", why: "Salah: terbalik. CreditMetrics memakai korelasi ekuitas; CreditRisk+ TIDAK memakai korelasi eksplisit (diganti faktor sektoral)." },
            { text: "Keduanya identik — hanya nama vendor yang berbeda", why: "Salah: filosofinya berbeda — migrasi vs jumlah default — dan hasilnya bisa berbeda 2 kali lipat." },
          ],
        },
        {
          q: "Kenapa KMV Portfolio Manager tidak bisa dipakai untuk portofolio UKM?",
          options: [
            { text: "Karena UKM tidak punya rating", why: "Salah: bukan soal rating — KMV tidak memakai rating. Ia memakai harga saham dan distance-to-default." },
            { text: "Karena KMV butuh harga saham untuk mengestimasi nilai aset dan DD — UKM tidak tercatat", why: "Tepat: model struktural butuh informasi pasar. Tanpa harga saham, DD tidak bisa dihitung.", correct: true },
            { text: "Karena UKM selalu gagal bayar", why: "Salah: UKM tidak selalu gagal — mereka hanya tidak punya harga pasar yang bisa dipakai model struktural." },
            { text: "Karena KMV hanya untuk obligasi pemerintah", why: "Salah: KMV untuk korporat tercatat — justru bukan untuk pemerintah." },
          ],
        },
        {
          q: "Rho naik dari 0,2 ke 0,4 (korelasi krisis). Apa yang terjadi pada VaR portofolio?",
          options: [
            { text: "VaR turun — korelasi tinggi berarti diversifikasi lebih baik", why: "Salah: terbalik. Korelasi tinggi berarti debitur gagal BERSAMAAN — sebaran kerugian melebar, VaR naik." },
            { text: "VaR naik dari Rp64,3 miliar ke sekitar Rp95 miliar — UL hampir dua kali lipat", why: "Tepat: korelasi krisis menaikkan PD bersyarat. Model dengan rho tenang meremehkan modal.", correct: true },
            { text: "VaR tidak berubah — rho tidak memengaruhi VaR", why: "Salah: rho adalah inti rumus Vasicek. Tanpa rho, tidak ada risiko sistematis." },
            { text: "EL naik — karena PD rata-rata naik", why: "Salah: EL tidak berubah (PD rata-rata tetap 2 persen). Yang berubah adalah SEBARAN (UL) — bukan rata-rata." },
          ],
        },
        {
          q: "Dua vendor memberi VaR Rp58 miliar (CreditMetrics) dan Rp71 miliar (KMV) untuk portofolio yang sama. Apa respons yang benar?",
          options: [
            { text: "Pilih yang terkecil — modal lebih hemat", why: "Salah: memilih yang terkecil karena hemat adalah memilih asumsi yang paling nyaman, bukan yang paling benar." },
            { text: "Selidiki perbedaan asumsi (korelasi, data), laporkan ketiganya, pegang modal untuk yang terbesar", why: "Tepat: perbedaan model adalah informasi. Investigasi menemukan konsentrasi sektor 60 persen yang disembunyikan rata-rata.", correct: true },
            { text: "Buang keduanya — model yang berbeda berarti keduanya salah", why: "Salah: perbedaan tidak berarti keduanya salah — keduanya benar dengan asumsinya masing-masing." },
            { text: "Rata-ratakan keduanya dan lupakan perbedaannya", why: "Salah: rata-rata menyembunyikan informasi. Perbedaan 22 persen adalah sinyal yang harus diinvestigasi." },
          ],
        },
      ],
    },
  ],
};
