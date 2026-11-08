import type { V2Lesson } from "../lib/types";

export const cr14a: V2Lesson = {
  slug: "cr14a-ecl-staging",
  track: "Credit Risk",
  module: "LGD, EAD & ECL",
  title: "CR14A — ECL: Mesin Lima Komponen & Staging",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga tumpukan yang beda harga",
      prose: [
        "Gudang Bank Nusantara. Tiga tumpukan berkas kredit — nominalnya sama: Rp 500 juta per berkas. Tumpukan 1 (hijau): debitur sehat. \"Harganya\" (cadangan): Rp 4,5 juta per berkas. Tumpukan 2 (kuning): risiko naik. \"Harganya\": Rp 38 juta per berkas. Tumpukan 3 (merah): sudah macet. \"Harganya\": Rp 225 juta per berkas.",
        "Berkas yang sama persis — nominal sama, tenor sama — tetapi \"harganya\" beda 50× lipat. Yang membedakan bukan kertasnya, melainkan stage-nya: seberapa besar risiko meningkat sejak kredit lahir.",
        "ECL bukan satu rumus — melainkan mesin lima komponen yang outputnya ditentukan stage. Part 1 ini merakit mesinnya: staging → lifetime → diskonto. Part 2 (CR14b) menghitung sampai jurnal akuntansi.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "90% portofolio \"murah\" (Stage 1), tetapi 10% sisanya mendominasi CKPN: 0,07×38 + 0,03×225 = 9,41 vs 0,90×4,5 = 4,05 (rasio 2,32×) — untuk angka per-berkas lesson ini. Itu menunjukkan staging 10% ini BERPENGARUH BESAR, tetapi jangan baca sebagai kausalitas mutlak: kualitas ECL juga ditentukan PD, LGD, EAD, skenario, dan diskonto — staging adalah salah satu penentu besar, bukan satu-satunya.",
      },
      reference: "Stage = tumpukan harga: Rp 4,5 jt · Rp 38 jt · Rp 225 jt untuk berkas yang sama.",
    },
    {
      id: "mesin",
      eyebrow: "Langkah 2 · Mesin",
      title: "ECL: lima komponen",
      prose: [
        "ECL (Expected Credit Loss) = ekspektasi kerugian kredit yang didiskonto dan dibobot skenario. Lima komponennya: PD — peluang default per tahun (PIT, forward-looking) — CR10; LGD — porsi hilang saat default — CR12; EAD — exposure saat default (termasuk CCF) — CR13; Diskonto — nilai waktu uang (suku bunga efektif) — baru di lesson ini; Skenario — probability-weighting ekonomi — CR11.",
        "ECL seperti resep rendang — lima bumbu yang tak bisa dikurangi. PD/LGD/EAD adalah \"dagingnya\"; diskonto adalah \"santan\"-nya; skenario adalah \"api\"-nya. Kurang satu = bukan rendang.",
        "Sensitivitas: skenario (30%) dan EAD (25%) paling sensitif — kesalahan 10% di sana paling mahal. Angka 30%/25% ini ILUSTRASI lesson ini untuk portofolio contoh (bukan hasil studi atau angka universal): sensitivitas nyata bergantung pada portofolio, tenor, dan segmen — selalu hitung sensitivitas sendiri sebelum memutuskan fokus validasi. Prinsipnya tetap: validasi model jangan merata — fokuskan energi ke komponen paling sensitif. Inilah risk-based validation.",
      ],
      tasks: [],
      reference: "Komponen baru lesson ini: diskonto (EIR). Sisanya merangkum CR10–CR13 & CR11.",
    },
    {
      id: "staging",
      eyebrow: "Langkah 3 · Staging",
      title: "Menentukan tumpukan",
      prose: [
        "Staging = mengklasifikasikan tiap kredit ke Stage 1/2/3 (PSAK 109). Aturan praktis bank. Stage 1: tidak ada SICR → ECL = PD 12-bulan × LGD × EAD. Stage 2: SICR (PD naik ≥2× atau DPD ≥30) → ECL = PD lifetime × LGD × EAD. Stage 3: credit-impaired, mengikuti definisi default bank — DPD >90 hari adalah salah satu pemicu, bersama unlikely-to-pay dan restrukturisasi bermasalah; DPD >90 saja BUKAN definisi lengkap default → ECL = 100% × LGD × EAD.",
        "Halus tetapi penting: curing — kredit bisa kembali Stage 2→1 jika membaik (dengan masa percobaan, misal 6 bulan DPD 0). Stage bukan jalan satu arah — tetapi juga bukan pintu putar (tidak boleh naik-turun tiap bulan).",
        "Kolek 2 (DPK) vs Stage 2 (PSAK 109) — hubungannya tidak 1:1. Kolek 2 bisa Stage 1 atau 2 tergantung SICR. Analis Indonesia harus fasih dua bahasa: kolektibilitas (POJK, berbasis DPD + kualitatif) dan stage (PSAK 109, berbasis SICR) — dengan rekonsiliasi yang jelas.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"ECL Stage 1 = 1/5 dari ECL Stage 2 (12 bulan vs 60 bulan).\" Tidak selinier itu — karena PD marginal menurun seiring waktu (seasoning), EAD menyusut (amortisasi), serta diskonto. Rasio aktual biasanya 4–8×, bukan proporsional tenor.",
      },
      reference: "SICR: PD naik ≥2× sejak origination, atau backstop DPD ≥30 hari.",
    },
    {
      id: "lab-staging",
      eyebrow: "Langkah 4 · Lab Staging",
      title: "Mesin staging: data → stage → ECL",
      prose: [
        "Aturan terkunci: SICR jika PD naik ≥2× atau DPD ≥30; Stage 3 jika DPD >90. Fungsi tentukan_stage dan ecl terkunci. Empat kasus (LGD 45%, EAD Rp 500 jt; PD lifetime = PD kini × 4,5). Tugasmu: tentukan stage kasus B dan C, lalu hitung ECL kasus B.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan `stage_b` (PD 1,5%→3,5%, DPD 0) dan `stage_c` (PD 1,5%→1,8%, DPD 35)" },
        { id: "t2", text: "Hitung `ecl_b` (juta Rp) = ecl(stage_b, 0.035, 0.035×4.5, 0.45, 500)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "stage_b=2 stage_c=2 ecl_b=35.4",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Kasus C: PD naik cuma 1,2× TAPI DPD 35 → Stage 2. Backstop 30 hari adalah rebuttable presumption — jaring pengaman yang dapat dibantah dengan bukti yang wajar dan dapat didukung, bukan aturan mutlak; di lab ini ia diterapkan sebagai aturan karena tidak ada bukti pembantah.",
      },
      hints: [
        "Panggil tentukan_stage(pd_awal, pd_kini, dpd), ambil elemen pertama.",
        "Rasio PD B = 0.035/0.015 ≈ 2,33 ≥ 2 → SICR.",
        "ecl_b = ecl(stage_b, 0.035, 0.035*4.5, 0.45, 500)",
      ],
      code: {
        starter: `def tentukan_stage(pd_awal, pd_kini, dpd):\n    if dpd > 90:\n        return 3, "Default (DPD>90)"\n    if pd_kini / pd_awal >= 2.0 or dpd >= 30:\n        return 2, "SICR terpenuhi"\n    return 1, "Sehat"\n\ndef ecl(stage, pd_12m, pd_life, lgd, ead):\n    if stage == 1: return pd_12m * lgd * ead\n    if stage == 2: return pd_life * lgd * ead\n    return 1.0 * lgd * ead\n\n# TULIS KODEMU: kasus B (0.015->0.035, dpd 0) dan C (0.015->0.018, dpd 35)\nstage_b = \nstage_c = \necl_b = \n\nprint(f"stage_b={stage_b} stage_c={stage_c} ecl_b={ecl_b:.1f}")`,
        lockLines: 10,
        solution: `def tentukan_stage(pd_awal, pd_kini, dpd):\n    if dpd > 90:\n        return 3, "Default (DPD>90)"\n    if pd_kini / pd_awal >= 2.0 or dpd >= 30:\n        return 2, "SICR terpenuhi"\n    return 1, "Sehat"\n\ndef ecl(stage, pd_12m, pd_life, lgd, ead):\n    if stage == 1: return pd_12m * lgd * ead\n    if stage == 2: return pd_life * lgd * ead\n    return 1.0 * lgd * ead\n\n# TULIS KODEMU: kasus B (0.015->0.035, dpd 0) dan C (0.015->0.018, dpd 35)\nstage_b = tentukan_stage(0.015, 0.035, 0)[0]\nstage_c = tentukan_stage(0.015, 0.018, 35)[0]\necl_b = ecl(stage_b, 0.035, 0.035*4.5, 0.45, 500)\n\nprint(f"stage_b={stage_b} stage_c={stage_c} ecl_b={ecl_b:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "stage_b", value: 2, tol: 1e-9, label: "`stage_b` seharusnya 2", msg: "Rasio 2.33 ≥ 2 → SICR kuantitatif." },
          { kind: "equal", task: "t1", name: "stage_c", value: 2, tol: 1e-9, label: "`stage_c` seharusnya 2", msg: "DPD 35 ≥ 30 → backstop memicu Stage 2." },
          { kind: "equal", task: "t2", name: "ecl_b", value: 35.4, tol: 0.1, label: "`ecl_b` sekitar 35.4", msg: "0.1575 × 0.45 × 500 = 35.4." },
          { kind: "stdout_matches", task: "t3", pattern: "stage_b=2\\s+stage_c=2\\s+ecl_b=35\\.4", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Kasus A (1,5%→2%, DPD 0) = Stage 1, ECL 4,5. Kasus D (DPD 120) = Stage 3, ECL 225.",
    },
    {
      id: "lifetime-diskonto",
      eyebrow: "Langkah 5 · Lifetime & Diskonto",
      title: "Menjumlah masa depan, menghargai waktu",
      prose: [
        "ECL lifetime = jumlahkan ekspektasi kerugian tiap tahun sisa tenor. Untuk tiap tahun: kalikan PD/LGD/EAD tahun itu (EAD menyusut karena amortisasi!), bagi dengan (1+r)^t (diskonto), jumlahkan. Untuk multi-skenario: hitung per skenario lalu bobot (CR11).",
        "Tiga dinamika yang sering dilupakan: EAD menyusut (amortisasi) — KPR tahun ke-15 EAD-nya jauh lebih kecil dari tahun ke-1; PD marginal berubah — biasanya turun (seasoning), tetapi bisa naik jika ekonomi memburuk; LGD bisa berubah — agunan terdepresiasi (kendaraan!) → LGD naik seiring waktu.",
        "Diskonto: kerugian Rp 100 jt yang terjadi 5 tahun lagi tidak sama nilainya dengan Rp 100 jt hari ini — didiskonto dengan suku bunga efektif (EIR) kredit tersebut. Mengapa EIR (bukan BI rate)? Karena ECL mengukur nilai kini dari arus kas yang hilang dari kredit ini — dan \"harga waktu\" kredit ini adalah bunganya sendiri. KPR bunga 8% didiskonto 8%; KTA bunga 18% didiskonto 18%.",
      ],
      formula: String.raw`\text{ECL}_{\text{lifetime}} = \sum_{t=1}^{T} \frac{\text{PD}_t \times \text{LGD}_t \times \text{EAD}_t}{(1+r)^t}`,
      formulaNote: "r = suku bunga efektif (EIR) kredit. ECL lifetime BUKAN ECL 12-bulan × tenor.",
      tasks: [],
      reference: "ECL lifetime = 'film' per tahun, bukan 'foto' yang digandakan.",
    },
    {
      id: "lab-diskonto",
      eyebrow: "Langkah 6 · Lab Diskonto",
      title: "Rupiah masa depan lebih murah",
      prose: [
        "ECL Stage 2 = jumlah PD_t × LGD × EAD_t yang DIDISKONTO. Data: r = 10%, EAD awal Rp 500 jt (menyusut 15%/tahun), LGD 45%, PD tahunan [3%; 2,5%; 2%; 1,5%; 1,2%]. Tugasmu: hitung ECL tanpa diskonto dan dengan diskonto.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ecl_tanpa` = Σ kontribusi tanpa diskonto" },
        { id: "t2", text: "Hitung `ecl_diskon` = Σ kontribusi/(1+r)^t" },
        { id: "t3", text: "Cetak keduanya dengan `print`" },
      ],
      expected: "tanpa=18.3 diskon=14.8",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ECL KPR 20 tahun SANGAT sensitif terhadap asumsi suku bunga: tenor panjang + bunga tinggi = diskonto besar. Salah asumsi r sedikit = ECL meleset jauh.",
      },
      hints: [
        "Kontribusi tahun t = p × lgd × ead.",
        "Didiskonto = kontribusi / (1+r)**t; ead menyusut ×0.85 tiap tahun.",
        "Loop 5 tahun, akumulasikan dua total.",
      ],
      code: {
        starter: `r = 0.10\nead_awal = 500\nlgd = 0.45\npd_tahunan = [0.030, 0.025, 0.020, 0.015, 0.012]\n\n# TULIS KODEMU\necl_tanpa = \necl_diskon = \n\nprint(f"tanpa={ecl_tanpa:.1f} diskon={ecl_diskon:.1f}")`,
        lockLines: 4,
        solution: `r = 0.10\nead_awal = 500\nlgd = 0.45\npd_tahunan = [0.030, 0.025, 0.020, 0.015, 0.012]\n\n# TULIS KODEMU\necl_tanpa, ecl_diskon = 0, 0\nead = ead_awal\nfor t, p in enumerate(pd_tahunan, 1):\n    kontribusi = p * lgd * ead\n    ecl_tanpa += kontribusi\n    ecl_diskon += kontribusi / (1 + r) ** t\n    ead *= 0.85\n\nprint(f"tanpa={ecl_tanpa:.1f} diskon={ecl_diskon:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ecl_tanpa", value: 18.3, tol: 0.1, label: "`ecl_tanpa` sekitar 18.3", msg: "Jumlah kontribusi 5 tahun tanpa diskonto." },
          { kind: "equal", task: "t2", name: "ecl_diskon", value: 14.8, tol: 0.1, label: "`ecl_diskon` sekitar 14.8", msg: "Dengan diskonto 10% — selisih Rp 3,5 jt." },
          { kind: "stdout_matches", task: "t3", pattern: "tanpa=18\\.3\\s+diskon=14\\.8", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: r = 0.15 — ECL turun. Tenor panjang + bunga tinggi = diskonto besar.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Salah stage, salah triliunan",
      prose: [
        "Audit internal Bank Nusantara menemukan: 15.000 rekening KPR (total Rp 7,5 T) dengan DPD 30–60 hari masih tercatat Stage 1 — karena sistem staging cabang belum di-update mengikuti backstop 30 hari. ECL Stage 1 (PD 12-bln 1%): 0,01 × 0,3 × 7.500 M = Rp 22,5 M. ECL Stage 2 (lifetime PD ~6%): 0,06 × 0,3 × 7.500 M = Rp 135 M. Selisih: Rp 112,5 M CKPN kurang — dari satu kesalahan operasional.",
        "Pembahasan: akar masalah = governance + operasional — bukan model. Kriteria (backstop 30 hari) benar di atas kertas, tetapi eksekusi sistem di cabang tertinggal. Ini pola umum: bank punya kebijakan bagus, implementasi bolong.",
        "Tindakan: (1) staging terpusat & otomatis — tarik logika staging dari sistem cabang ke engine pusat; cabang tidak boleh override tanpa persetujuan; (2) rekonsiliasi staging bulanan — bandingkan DPD vs stage; setiap DPD ≥30 yang masih Stage 1 = exception yang harus dijelaskan. Pelajaran: rantai ECL sekuat mata rantai operasional terlemahnya.",
      ],
      tasks: [],
      reference: "Migrasi model vs migrasi risiko: setelah rekalibrasi, bedakan keduanya dan uji dampak staging sebelum go-live.",
    },
    {
      id: "sicr-kualitatif",
      eyebrow: "Langkah 8 · SICR kualitatif",
      title: "SICR yang tidak terlihat di DPD",
      prose: [
        "Rasio PD 2× dan backstop 30 hari adalah lantai, bukan seluruh bangunan. Standar mewajibkan informasi \"yang wajar dan dapat didukung\" — termasuk yang kualitatif: masuk daftar pantauan (watchlist), pelanggaran covenant, restrukturisasi ringan, industri debitur yang kolaps, hingga indikasi fraud. Kredit bisa mengalami SICR jauh sebelum DPD-nya bergerak, dan bank yang hanya menunggu angka model pada dasarnya menunda pengakuan.",
        "Contoh dengan angka: debitur KMK tekstil Rp 2 M. PD model naik 1,5% → 2,4% (1,6× — lolos dari jerat kuantitatif), DPD 0 (belum ada yang telat). Tetapi: DSCR breach dua kuartal berturut-turut + industri tekstil terpukul impor + masuk watchlist komite. SICR kualitatif → Stage 2. ECL Stage 1 = 0,024 × 0,45 × 2000 = Rp 21,6 jt; ECL Stage 2 (lifetime 4,5×) ≈ Rp 97 jt. Keputusan satu komite sore itu menambah Rp 75 jt cadangan untuk satu debitur — dan justru itulah gunanya komite.",
        "Cara salah yang klasik: \"belum 30 hari, jadi belum Stage 2\" — menjadikan backstop sebagai kebijakan. Backstop adalah jaring pengaman regulator untuk kegagalan model, bukan pengganti penilaian. Bank yang begitu akan selalu mengakui SICR terlambat, tepat saat kerugian sudah di depan mata — pola yang auditor sebut \"too little, too late\" dan denda dengan temuan.",
        "Aturan keputusan. Satu: susun daftar pemicu SICR kualitatif per segmen (korporasi: covenant + watchlist; ritel: restrukturisasi + EWS skor) dan review tiap bulan. Dua: setiap forbearance (keringanan) adalah INDIKATOR SICR yang kuat — bank wajib menilai apakah keringanan itu mencerminkan peningkatan risiko signifikan; bukan SICR otomatis tanpa penilaian, dan bukan tanpa perdebatan: dokumentasikan penilaiannya, termasuk bila diputuskan BUKAN SICR beserta buktinya. Tiga: dokumentasikan alasan \"mengapa TIDAK Stage 2\" untuk debitur watchlist yang dipertahankan di Stage 1 — beban pembuktiannya ada pada yang menahan, bukan yang memindahkan. Empat: uji konsistensi — dua debitur dengan profil sama harus mendapat stage sama; inkonsistensi adalah temuan audit.",
      ],
      tasks: [],
      reference: "Backstop 30 hari = lantai. Pemicu kualitatif = dindingnya.",
    },
    {
      id: "stage3-cure",
      eyebrow: "Langkah 9 · Stage 3 & cure",
      title: "Stage 3, cure, dan pintu putar",
      prose: [
        "Stage 3 = credit-impaired, mengikuti definisi default (DPD >90, unlikely-to-pay, restrukturisasi bermasalah). Dua hal berubah sekaligus: ECL memakai PD 100% atas lifetime, DAN pendapatan bunga diakui atas nilai tercatat neto (amortised cost dikurangi cadangan) — bukan atas bruto seperti Stage 1/2. Ini pukulan ganda ke laba: cadangan naik, pendapatan bunga turun bersamaan.",
        "Contoh dengan angka: KPR Rp 500 jt masuk Stage 3, LGD 60% → ECL = 1,0 × 0,6 × 500 = Rp 300 jt. Nilai neto = Rp 200 jt. Pendapatan bunga setahun pada 8%: atas neto = Rp 16 jt, vs Rp 40 jt jika masih dihitung atas bruto. Rp 24 jt pendapatan \"hilang\" per tahun per debitur — di atas Rp 300 jt cadangan yang sudah dibentuk. Inilah mengapa direksi sangat sensitif pada migrasi ke Stage 3: ia memukul laba dua kali.",
        "Arah sebaliknya — cure (kembali ke Stage 2 atau 1) — adalah tempat gaming terjadi. \"Stage shopping\": menahan kredit bermasalah di Stage 2 agar tidak masuk statistik Stage 3, atau mempercepat cure agar cadangan turun sebelum tutup buku. Pertahanannya: kriteria cure tertulis dan disetujui (misalnya 6 bulan DPD 0 berturut-turut + tanpa keringanan baru), masa percobaan yang ketat, dan aturan bahwa lompat langsung Stage 3 → 1 hanya boleh bila debitur sudah terbukti tidak lagi credit-impaired dan memenuhi kriteria cure — yang dilarang adalah lompat TANPA bukti cure, bukan transisinya sendiri.",
        "Aturan keputusan. Satu: setiap cure di atas Rp 1 M wajib lewat komite, bukan analis individu. Dua: lacak \"re-default dalam 12 bulan setelah cure\" — jika di atas 30%, kriteria cure-mu terlalu longgar. Tiga: auditor menguji matriks migrasi antar stage; migrasi Stage 2 → 1 yang melonjak di kuartal IV adalah bendera merah klasik. Empat: perlakukan Stage 3 sebagai status fakta (debitur memang default), bukan pilihan akuntansi — tidak ada \"kebijakan\" yang bisa menunda fakta.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: staging adalah triase, bukan vonis",
        body: "Pikirkan seperti triase di IGD: Stage 1 = rawat jalan (observasi rutin), Stage 2 = ruang observasi (diawasi ketat, sumber daya dialihkan ke sana), Stage 3 = ICU (penanganan intensif). Dokter IGD tidak menunggu pasien pingsan untuk memindahkan ke observasi — ia membaca tanda vital awal. SICR kualitatif adalah \"tanda vital\" itu. Heuristik yang jarang disadari: keputusan staging menggerakkan laba JAUH lebih besar daripada presisi PD. Pindah Stage 1 → 2 melipatgandakan ECL 4–8×; memperbaiki estimasi PD dari 2,1% ke 2,0% mengubah ECL 5%. Namun alokasi waktu analis justru terbalik: berjam-jam memperdebatkan desimal PD, lima menit menentukan stage. Balikkan proporsinya. Dan ingat sifat staging yang paling politis: ia adalah titik temu antara akuntansi dan perilaku manusia. Model PD tidak bisa \"bermain mata\" dengan target laba kuartalan; keputusan stage bisa. Itulah mengapa kontrol terkuat bukan rumusnya, melainkan aturan cure, backstop, dan dokumentasi \"mengapa tidak Stage 2\" — pagar untuk naluri manusia, bukan untuk matematika.",
      },
      reference: "Perdebatkan stage lebih lama daripada desimal PD — dampak labanya 100× lipat.",
    },
    {
      id: "rekonsiliasi-dual",
      eyebrow: "Langkah 10 · Rekonsiliasi",
      title: "Dua bahasa: kolektibilitas vs stage",
      prose: [
        "Analis Indonesia hidup dalam dua bahasa yang tidak sejajar. Kolektibilitas (POJK) berbasis DPD + penilaian kualitatif tiga pilar untuk komersial; stage (PSAK 109) berbasis SICR relatif terhadap origination. Kolek 2 (DPK — umumnya 1–90 hari, tetapi penentuan kolektibilitas juga memakai penilaian kualitatif, bukan DPD semata) bisa Stage 1 (telat 5 hari karena administrasi, PD tidak naik signifikan) atau Stage 2 (telat 40 hari + watchlist). Kolek 1 pun bisa Stage 2 — debitur korporasi DPD 0 yang industrinya kolaps dan masuk watchlist: kolektibilitas masih 1 (belum ada tunggakan), stage sudah 2 (SICR kualitatif).",
        "Contoh jebakan: laporan ke direksi menampilkan \"Kolek 1: 95% — portofolio sehat\", sementara 8% dari Kolek 1 itu sebenarnya Stage 2 dengan ECL lifetime. Direksi membaca kesehatan, akuntansi mencatat cadangan. Rekonsiliasi wajib: matriks 5 × 3 (kolektibilitas × stage) setiap bulan. Sel yang harus diinterogasi: Kolek 1 × Stage 2 yang membesar (SICR diam-diam menumpuk), dan Kolek 3+ × Stage 1/2 (seharusnya hampir kosong — jika terisi, definisi default-mu tidak selaras).",
        "Aturan keputusan. Satu: tidak ada kredit Kolek 3+ yang boleh Stage 1 — default akuntansi minimal seketat default regulasi. Dua: selisih definisi didokumentasikan dalam kebijakan, bukan di kepala analis. Tiga: saat OJK bertanya \"mengapa CKPN naik padahal NPL stabil?\", jawabanmu adalah matriks ini — Stage 2 tumbuh di dalam Kolek 1/2. Analis yang hanya fasih satu bahasa akan selalu kalah argumen dari yang fasih dua-duanya.",
      ],
      tasks: [],
      reference: "Matriks 5 × 3 tiap bulan: kolektibilitas × stage.",
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
        "ECL = 5 komponen: PD · LGD · EAD · diskonto (EIR) · skenario. Paling sensitif (ilustrasi lesson ini, bukan angka universal): skenario & EAD.",
        "Stage 1: ECL 12-bulan · Stage 2: ECL lifetime (SICR) · Stage 3: ECL lifetime PD 100%.",
        "SICR: PD naik ≥2× atau backstop DPD ≥30. Curing: bisa kembali 2→1 dengan masa percobaan.",
        "ECL lifetime = Σ(PD_t × LGD_t × EAD_t)/(1+r)^t — 'film', bukan 'foto × tenor'.",
        "Kolek 2 vs Stage 2 tidak 1:1 — fasih dua bahasa dengan rekonsiliasi.",
      ],
      next: { label: "CR14B — ECL: Perhitungan", href: "/v2/learn/cr14b-ecl-perhitungan" },
      quiz: [
        {
          q: "Kredit: PD awal 1,5%, PD kini 1,8%, DPD 35. Stage?",
          options: [
            { text: "Stage 1 — PD naik cuma 1,2×", why: "Rasio PD memang kecil, tetapi backstop DPD mengalahkan." },
            { text: "Stage 2 — backstop DPD ≥30 hari memicu SICR apapun kata PD", why: "Backstop 30 hari adalah rebuttable presumption — dapat dibantah dengan bukti yang wajar dan dapat didukung, bukan aturan mutlak.", correct: true },
            { text: "Stage 3", why: "Stage 3 butuh DPD >90 atau unlikely to pay." },
            { text: "Tidak bisa ditentukan", why: "Bisa: backstop jelas terpicu." },
          ],
        },
        {
          q: "Mengapa ECL lifetime BUKAN ECL 12-bulan × tenor?",
          options: [
            { text: "Karena malas menghitung", why: "Bukan soal kemalasan." },
            { text: "PD marginal berubah (seasoning), EAD menyusut (amortisasi), dan ada diskonto — ECL lifetime adalah 'film' per tahun, bukan 'foto' yang digandakan", why: "Tiga dinamika itu. Perkalian sederhana mengabaikan semuanya.", correct: true },
            { text: "Regulasi melarang perkalian", why: "Bukan larangan — ini soal kebenaran metodologi." },
            { text: "Tidak ada bedanya", why: "Bedanya besar: rasio aktual 4–8×, bukan proporsional tenor." },
          ],
        },
        {
          q: "ECL didiskonto dengan suku bunga apa?",
          options: [
            { text: "BI rate", why: "Bukan BI rate." },
            { text: "Suku bunga efektif (EIR) kredit itu sendiri — karena mengukur nilai kini arus kas yang hilang dari kredit tersebut", why: "'Harga waktu' tiap kredit = bunganya sendiri. KPR 8% dan KTA 18% punya diskonto berbeda.", correct: true },
            { text: "Inflasi", why: "Bukan inflasi." },
            { text: "Suka-suka bank", why: "Ada aturannya: EIR." },
          ],
        },
        {
          q: "15.000 rekening DPD 30–60 masih Stage 1 karena sistem cabang belum update. Ini masalah?",
          options: [
            { text: "Model", why: "Modelnya benar — backstop 30 hari sudah tepat." },
            { text: "Governance & operasional — kriteria benar tapi eksekusi bolong; solusinya staging terpusat + rekonsiliasi bulanan", why: "Rp 112,5 M CKPN kurang dari satu kesalahan implementasi — bukan dari model yang salah.", correct: true },
            { text: "Data makro", why: "Tidak ada hubungannya dengan makro." },
            { text: "Tidak masalah — DPD kecil", why: "DPD 30–60 = SICR; Rp 112,5 M bukan masalah kecil." },
          ],
        },
        {
          q: "Kolek 2 (DPK) vs Stage 2 (PSAK 109) — hubungannya?",
          options: [
            { text: "Sama persis — dua nama untuk satu hal", why: "Berbeda basis: DPD+kualitatif vs SICR." },
            { text: "Tidak 1:1 — Kolek 2 bisa Stage 1 atau 2 tergantung SICR; analis Indonesia harus fasih dua bahasa dengan rekonsiliasi yang jelas", why: "Dua bahasa paralel — laporan yang baik menyajikan keduanya.", correct: true },
            { text: "Stage 2 selalu lebih buruk dari Kolek 2", why: "Tidak selalu — tergantung SICR." },
            { text: "Kolektibilitas sudah tidak dipakai lagi", why: "Kolektibilitas (POJK) tetap dipakai." },
          ],
        },
      ],
    },
  ],
};
