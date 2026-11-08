import type { V2Lesson } from "../lib/types";

export const cr14b: V2Lesson = {
  slug: "cr14b-ecl-perhitungan",
  track: "Credit Risk",
  module: "LGD, EAD & ECL",
  title: "CR14B — ECL: Perhitungan, Jurnal & Backtest",
  estMinutes: 65,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Model statistik yang menggerakkan triliunan",
      prose: [
        "Rina menatap spreadsheet ECL-nya: satu debitur KPR, ECL Rp 11,3 juta. Dua baris itu — dikali 200.000 rekening KPR — menjadi Rp 2,26 triliun cadangan di neraca. Dan setiap rupiahnya mengurangi laba yang dilaporkan ke publik, ke OJK, ke pemegang saham.",
        "\"Gila,\" gumam Rina. \"Model statistikku menggerakkan laba bank triliunan. Kalau PD-ku salah 10%...\" Ia tidak menyelesaikan kalimatnya. Tidak perlu.",
        "ECL bukan latihan akademis — ia adalah jembatan antara statistik dan uang sungguhan. Part 2 ini menyeberangi jembatan itu sampai ke jurnal, lalu menguji: bagaimana mempertahankannya di depan direksi, auditor, dan OJK.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Urutan perhitungan itu kontrak — tidak bisa dibolak-balik. Diskonto setelah perkalian tahunan (bukan mendiskonto PD-nya). Bobot skenario paling akhir (bukan merata-ratakan PD dulu — karena non-linearitas!). Urutan salah = angka salah meski komponen benar.",
      },
      reference: "Rantai: staging → PD/EAD per tahun → kalikan & diskonto → jumlahkan → bobot skenario.",
    },
    {
      id: "end-to-end",
      eyebrow: "Langkah 2 · End-to-end",
      title: "Satu debitur, lima langkah",
      prose: [
        "Rantai lengkap (prasyarat: CR10 PD, CR12 LGD, CR13 EAD, CR11 skenario, CR14a staging/diskonto): (1) staging → tentukan 12-bulan vs lifetime (misal: Stage 2); (2) PD per tahun → dari model PIT + satelit, per skenario; (3) EAD per tahun → amortisasi pokok (menyusut!); (4) kalikan & diskonto → Σ PD_t × LGD × EAD_t / (1+r)^t; (5) bobot skenario → ECL final.",
        "Contoh: KPR Rp 500 jt, tenor 10 tahun, LGD 30%, r 8%, Stage 2. PD PIT: optimis 0,8%/tahun (20%), baseline 1,2% (50%), pesimis 2,5% (30%). Amortisasi 8%/tahun. Per skenario, jumlahkan 10 tahun dengan fungsi lab (EAD 500×0,92^(t−1), diskonto 8%): optimis Rp 6,0 jt; baseline Rp 9,0 jt; pesimis Rp 18,7 jt. Bobot: 0,2×6,0 + 0,5×9,0 + 0,3×18,7 = Rp 11,3 jt. Inilah ECL final satu debitur. × 200.000 rekening = Rp 2,26 T.",
        "Perhatikan: amortisasi memangkas ECL ~26% dibanding tanpa amortisasi — pada skenario optimis, Rp 8,05 jt tanpa amortisasi menjadi Rp 5,99 jt dengan amortisasi (dihitung dengan fungsi lab sendiri: (8,05−5,99)/8,05 = 25,6%). Struktur pembayaran adalah komponen ECL yang sah. KPR dengan balloon payment 60% di akhir tenor yang dihitung dengan asumsi amortisasi linear = ECL underestimate + risiko refinancing di ujung yang tidak tercakup.",
      ],
      formula: String.raw`\text{ECL} = \sum_s p_s \sum_{t=1}^{T} \frac{\text{PD}_{t,s} \times \text{LGD} \times \text{EAD}_t}{(1+r)^t}`,
      formulaNote: "s = skenario (bobot paling akhir), t = tahun. Diskonto setelah perkalian tahunan.",
      tasks: [],
      reference: "Urutan: staging → PD/EAD per tahun → kalikan & diskonto per tahun → jumlahkan → bobot skenario.",
    },
    {
      id: "lab-ecl",
      eyebrow: "Langkah 3 · Lab ECL",
      title: "ECL end-to-end satu debitur",
      prose: [
        "KPR Rp 500 jt, tenor 10 tahun, LGD 30%, r = 8%, amortisasi 8%/tahun (EAD × 0,92). PD PIT per skenario (flat per tahun): optimis 0,8% (prob 20%), baseline 1,2% (50%), pesimis 2,5% (30%). Fungsi hitung_ecl terkunci. Tugasmu: hitung ECL tiap skenario dan ECL tertimbang.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ecl_opt` dan `ecl_base` (juta Rp)" },
        { id: "t2", text: "Hitung `ecl_pes` dan `ecl_final` = 0,2×opt + 0,5×base + 0,3×pes" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "opt=6.0 base=9.0 pes=18.7 final=11.3",
      hints: [
        "Panggil hitung_ecl(pd_tahunan) dengan list 10 elemen.",
        "Probabilitas tiap skenario: 0.2, 0.5, 0.3.",
        "ecl_opt = hitung_ecl([0.008]*10)",
      ],
      code: {
        starter: `ead0, lgd, r = 500, 0.30, 0.08\n\ndef hitung_ecl(pd_tahunan):\n    ead, ecl_s = ead0, 0\n    for t, p in enumerate(pd_tahunan, 1):\n        ecl_s += p * lgd * ead / (1+r)**t\n        ead *= 0.92\n    return ecl_s\n\n# TULIS KODEMU: ECL tiap skenario + tertimbang\necl_opt = \necl_base = \necl_pes = \necl_final = \n\nprint(f"opt={ecl_opt:.1f} base={ecl_base:.1f} pes={ecl_pes:.1f} final={ecl_final:.1f}")`,
        lockLines: 8,
        solution: `ead0, lgd, r = 500, 0.30, 0.08\n\ndef hitung_ecl(pd_tahunan):\n    ead, ecl_s = ead0, 0\n    for t, p in enumerate(pd_tahunan, 1):\n        ecl_s += p * lgd * ead / (1+r)**t\n        ead *= 0.92\n    return ecl_s\n\n# TULIS KODEMU: ECL tiap skenario + tertimbang\necl_opt = hitung_ecl([0.008]*10)\necl_base = hitung_ecl([0.012]*10)\necl_pes = hitung_ecl([0.025]*10)\necl_final = 0.2*ecl_opt + 0.5*ecl_base + 0.3*ecl_pes\n\nprint(f"opt={ecl_opt:.1f} base={ecl_base:.1f} pes={ecl_pes:.1f} final={ecl_final:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ecl_opt", value: 6.0, tol: 0.15, label: "`ecl_opt` sekitar 6.0", msg: "Jumlahkan 10 tahun PD 0,8% dengan amortisasi + diskonto." },
          { kind: "equal", task: "t1", name: "ecl_base", value: 9.0, tol: 0.15, label: "`ecl_base` sekitar 9.0", msg: "PD 1,2% per tahun." },
          { kind: "equal", task: "t2", name: "ecl_pes", value: 18.7, tol: 0.2, label: "`ecl_pes` sekitar 18.7", msg: "PD 2,5% per tahun." },
          { kind: "equal", task: "t2", name: "ecl_final", value: 11.3, tol: 0.2, label: "`ecl_final` sekitar 11.3", msg: "0,2×6,0 + 0,5×9,0 + 0,3×18,7." },
          { kind: "stdout_matches", task: "t3", pattern: "opt=6\\.0\\s+base=9\\.0\\s+pes=18\\.7\\s+final=11\\.3", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Amortisasi memangkas ECL ~26% (8,05 → 5,99 jt pada skenario optimis) — struktur pembayaran adalah komponen ECL yang sah.",
    },
    {
      id: "jurnal",
      eyebrow: "Langkah 4 · Jurnal",
      title: "Dari model ke laba",
      prose: [
        "Ayat jurnal pembentukan CKPN: Dr. Beban kerugian kredit (CKPN) — Rp XX; Cr. Cadangan kerugian penurunan nilai (kontra-aset) — Rp XX. Dampak berantai: laba turun sebesar beban CKPN (langsung, kuartal berjalan); aset bersih turun (kontra-aset naik) → modal (ekuitas) turun → KPMM turun.",
        "Write-off: Dr. CKPN / Cr. Kredit yang diberikan — tidak memengaruhi laba lagi (sudah dicadangkan!), tetapi menurunkan NPL gross (ingat CR2!). Contoh: pembentukan Rp 250 M = beban laba kuartal ini. Write-off Rp 120 M = bukan beban baru (sudah dicadangkan dulu) — ia hanya \"membersihkan\" neraca. Pelajaran membaca laporan bank: \"beban CKPN naik\" = laba tertekan sekarang; \"write-off besar\" = laba sudah tertekan dulu.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Write-off Rp 120 M = rugi Rp 120 M kuartal ini.\" Rugi sudah diakui saat CKPN dibentuk (kuartal-kuartal sebelumnya). Write-off hanya memindahkan: Dr. CKPN / Cr. Kredit — netral terhadap laba. Bedakan \"beban CKPN\" (menggerakkan laba) dari \"write-off\" (membersihkan NPL).",
      },
      reference: "CKPN = kontra-aset. Beban CKPN ↔ laba; write-off ↔ NPL.",
    },
    {
      id: "sensitivitas",
      eyebrow: "Langkah 5 · Sensitivitas",
      title: "Uji guncang model",
      prose: [
        "Analisis sensitivitas = mengubah satu asumsi ±X% dan mengukur perubahan ECL. Tujuannya: (1) tahu asumsi mana paling kritis; (2) siapkan jawaban saat direksi/auditor bertanya \"bagaimana jika...?\"; (3) tentukan rentang wajar ECL (bukan satu angka kaku).",
        "Hasil ilustrasi (dihitung dengan fungsi lab yang sama — ECL final Rp 11,31 jt): bobot pesimis +10pp (diambil dari optimis, bobot jadi 10/50/40) → ECL +11% — paling sensitif! PD/LGD/EAD +10% → +10% (linear, sesuai rumus). Suku bunga +2pp (8%→10%) → ECL turun ~7% (diskonto lebih besar). Pelajaran: perdebatan metodologi seharusnya paling sengit di bobot skenario — bukan di detail teknis PD. Sensitivitas = peta prioritas: yang paling sensitif = yang paling butuh governance ketat.",
      ],
      tasks: [],
      reference: "Mengecilkan bobot pesimis agar ECL turun = manipulasi, bukan sensitivitas.",
    },
    {
      id: "lab-backtest",
      eyebrow: "Langkah 6 · Lab Backtest",
      title: "Mengadili model sendiri",
      prose: [
        "Backtest = bandingkan ECL yang diprediksi (dulu) dengan kerugian aktual (kini). Data indeks 5 tahun (terkunci): prediksi [100, 110, 95, 130, 105]; aktual [95, 125, 90, 150, 100]. Aturan: |selisih| <15% = OK; >15% = UNDER (aktual di atas prediksi) atau OVER. Tugasmu: hitung selisih 2022 & 2024 dan rata-rata bias.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `sel_2022` dan `sel_2024` (%) = (aktual−prediksi)/prediksi×100" },
        { id: "t2", text: "Hitung `rata_bias` (%) = rata-rata selisih 5 tahun" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "2022=+13.6 2024=+15.4 rata=+2.8",
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "2022 & 2024 UNDER bersamaan — selidiki: apakah model satelit telat menangkap guncangan? Bias konsisten satu arah 3+ tahun = model sakit: rekalibrasi sumbernya (bukan tambah overlay — overlay hanya morfin).",
      },
      hints: [
        "Indeks: 2021=0, 2022=1, ..., 2024=3.",
        "Selisih positif = UNDER (aktual di atas prediksi).",
        "sel_2022 = (aktual[1]-prediksi[1])/prediksi[1]*100",
      ],
      code: {
        starter: `prediksi = [100, 110, 95, 130, 105]\naktual   = [95, 125, 90, 150, 100]\n\n# TULIS KODEMU: selisih (%) 2022 & 2024, dan rata-rata bias\nsel_2022 = \nsel_2024 = \nrata_bias = \n\nprint(f"2022={sel_2022:+.1f} 2024={sel_2024:+.1f} rata={rata_bias:+.1f}")`,
        lockLines: 2,
        solution: `prediksi = [100, 110, 95, 130, 105]\naktual   = [95, 125, 90, 150, 100]\n\n# TULIS KODEMU: selisih (%) 2022 & 2024, dan rata-rata bias\nsel_2022 = (aktual[1]-prediksi[1])/prediksi[1]*100\nsel_2024 = (aktual[3]-prediksi[3])/prediksi[3]*100\nrata_bias = sum((a-p)/p*100 for p, a in zip(prediksi, aktual))/5\n\nprint(f"2022={sel_2022:+.1f} 2024={sel_2024:+.1f} rata={rata_bias:+.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "sel_2022", value: 13.6, tol: 0.2, label: "`sel_2022` sekitar +13.6", msg: "(125−110)/110 × 100 = 13.6 — masih OK (<15%)." },
          { kind: "equal", task: "t1", name: "sel_2024", value: 15.4, tol: 0.2, label: "`sel_2024` sekitar +15.4", msg: "(150−130)/130 × 100 = 15.4 — UNDER! Di atas ambang." },
          { kind: "equal", task: "t2", name: "rata_bias", value: 2.8, tol: 0.2, label: "`rata_bias` sekitar +2.8", msg: "Rata-rata 5 tahun +2.8% — wajar, dua arah." },
          { kind: "stdout_matches", task: "t3", pattern: "2022=\\+13\\.6\\s+2024=\\+15\\.4\\s+rata=\\+2\\.8", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Backtest ECL sulit (aktual 1 thn vs ECL lifetime) — praktik umum: backtest komponen (PD, LGD).",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "ECL naik Rp 800 M — jelaskan ke direksi",
      prose: [
        "Q3 2026, ECL Bank Nusantara naik Rp 800 M dalam sekuartal. Laba anjlok 35%. Direksi memanggilmu. Datamu: Rp 350 M — migrasi Stage 1→2 segmen KMK (dampak cliff effect; PD naik 2,3×, didorong data); Rp 250 M — revisi bobot pesimis 25%→35% (proyeksi ekonomi memburuk); Rp 200 M — pertumbuhan portofolio 8% (volume, bukan perburukan); backtest 3 tahun: bias rata-rata +4% (wajar, dua arah).",
        "Penjelasan 2 menit: \"Dari Rp 800 M, Rp 200 M sehat (portofolio tumbuh — ECL ikut tumbuh wajar). Rp 250 M antisipatif (revisi skenario — harga kejujuran atas ekonomi yang memburuk). Rp 350 M alarm (migrasi KMK — kualitas segmen menurun, didukung data PD naik 2,3×). Model teruji (backtest ±4%, tidak bias).\"",
        "Aksi: (1) segera — perketat origination KMK + intensifkan monitoring Stage 2 (intervensi dini lebih murah — CR9); (2) struktural — siapkan playbook jika skenario pesimis berlanjut (stress test — CR16). Pelajaran: analis yang membawa bedah komponen didengar; yang membawa satu angka dimarahi.",
      ],
      tasks: [],
      reference: "ECL 'terasa' terlalu kecil padahal NPL naik? Audit berlapis mulai dari input: DPD, staging, EIR — 9 dari 10 keajaiban ECL adalah kesalahan data.",
    },
    {
      id: "diskonto-jebakan",
      eyebrow: "Langkah 8 · Diskonto",
      title: "Diskonto: di mana, dengan apa, kapan",
      prose: [
        "ECL adalah nilai kini dari kekurangan kas (cash shortfalls) — selisih antara arus kas kontraktual dan arus kas yang benar-benar diharapkan diterima. Diskonto diterapkan pada kekurangan kas tiap tahun, memakai suku bunga efektif awal (EIR) kredit tersebut. Urutannya kaku: kalikan PD × LGD × EAD per tahun dulu, lalu diskonto per tahun, baru jumlahkan antar tahun. Mendiskonto PD-nya (bukan shortfall-nya), atau mendiskonto total ECL sekali di akhir dengan tenor rata-rata, menghasilkan angka yang salah meski komponennya benar.",
        "Contoh konkret — KUR Rp 50 jt, tenor 3 tahun, EIR 6% (bunga subsidi). Kekurangan kas yang diharapkan: tahun 1 Rp 4 jt, tahun 2 Rp 9 jt, tahun 3 Rp 14 jt (risiko menumpuk di belakang karena masa tenggang). Cara benar: 4/1,06 + 9/1,06² + 14/1,06³ = 3,77 + 8,01 + 11,75 = Rp 23,53 jt. Cara salah yang umum — jumlahkan dulu (Rp 27 jt) lalu diskonto 3 tahun penuh: 27/1,06³ = Rp 22,67 jt. Selisih Rp 0,86 jt per debitur; dikali 500.000 debitur KUR = Rp 430 M cadangan lenyap dari neraca. Kesalahan \"kecil\" di urutan operasi menjadi kesalahan raksasa di skala portofolio.",
        "Suku bunga yang dipakai juga jebakan. Standar mewajibkan EIR awal kredit — bukan BI rate hari ini, bukan rata-rata portofolio. KUR dengan EIR 6% didiskonto 6%; memakai BI rate 5,75% terlihat sepele, tetapi untuk tenor 10 tahun ia mengubah faktor diskonto tahun ke-10 dari 0,558 menjadi 0,572 — ECL naik sekitar 2,5% tanpa ada perubahan risiko sama sekali. Cara salah yang pernah terjadi: tim memakai \"suku bunga pasar saat ini\" agar ECL terlihat kecil ketika suku bunga naik. Itu bukan metodologi — itu manajemen laba.",
        "Aturan keputusan untuk meja kerja. Satu: diskonto selalu per periode, tidak pernah atas angka agregat. Dua: EIR dikunci saat origination — perubahan suku bunga pasar tidak mengubah EIR kredit lama. Tiga: untuk fasilitas dengan arus kas yang waktunya tidak pasti (revolving), pakai periode ekspektasi, bukan kontraktual. Empat: setiap perubahan asumsi diskonto wajib tercatat dengan alasan tertulis — karena inilah asumsi yang paling mudah dimanipulasi diam-diam dan paling sulit dideteksi auditor.",
        "Pengecualian yang sah atas aturan \"EIR dikunci\": kredit bunga mengambang. KPR floating yang bunganya mengikuti BI rate memakai EIR yang dimutakhirkan setiap repricing — karena arus kas kontraktualnya memang berubah. Jebakannya: tim lupa memutakhirkan dan tetap memakai EIR origination 8% padahal bunga berjalan sudah 11% — ECL jadi terlalu kecil (diskonto terlalu ringan untuk arus kas yang kini lebih besar). Atau sebaliknya: memutakhirkan EIR untuk kredit fixed-rate dengan dalih \"menyesuaikan pasar\" — itu dilarang. Uji cepatnya: tanyakan \"apakah arus kas kontraktual berubah?\" Ya (floating) → mutakhirkan; tidak (fixed) → kunci.",
      ],
      tasks: [],
      reference: "Diskonto per tahun atas shortfall, dengan EIR awal — urutannya tidak bisa dibolak-balik.",
    },
    {
      id: "bobot-menipu",
      eyebrow: "Langkah 9 · Bobot skenario",
      title: "Skenario yang terlihat netral tapi tidak",
      prose: [
        "Tiga skenario berbobot 20/50/30 terlihat \"netral\" — tetapi netralitasnya ilusi karena ECL tidak linear terhadap kondisi ekonomi. Saat ekonomi memburuk, PD naik DAN LGD naik bersamaan (agunan ikut jatuh harganya), sehingga ECL skenario pesimis bukan sekadar \"sedikit lebih besar\" — ia bisa 2–3× lipat baseline. Bobot 30% pada angka yang 2,5× lipat menyumbang porsi yang jauh lebih besar dari 30%. Inilah non-linearitas dari langkah 1: merata-ratakan PD dulu lalu menghitung ECL sekali menghancurkan convexity ini.",
        "Contoh dengan angka: satu debitur KPR. ECL optimis Rp 6,0 jt (bobot 20%), baseline Rp 9,0 jt (50%), pesimis Rp 18,7 jt (30%). ECL final = 0,2×6,0 + 0,5×9,0 + 0,3×18,7 = 1,20 + 4,50 + 5,61 = Rp 11,31 jt. Perhatikan: skenario pesimis menyumbang Rp 5,61 jt — hampir setengah total (49,7%) — dari bobot hanya 30%. Cara salah yang lazim: \"pesimis belum terjadi, pakai bobot 10% saja\" → ECL = 1,20 + 5,40 + 1,87 = Rp 8,47 jt. Cadangan susut Rp 2,84 jt per debitur (25%!) hanya karena satu angka judgmental digeser. Inilah mengapa analisis sensitivitas menempatkan bobot skenario sebagai asumsi paling kritis.",
        "Mode kegagalan kedua: double counting dengan overlay. Bank menambahkan overlay manajemen Rp 500 M \"untuk ketidakpastian\" DI ATAS ECL tertimbang yang skenario pesimisnya sudah mencakup ketidakpastian yang sama. Hasilnya cadangan ganda untuk risiko yang sama — terlihat konservatif, tetapi mengaburkan akuntabilitas: saat kondisi membaik, overlay \"lupa\" dilepas karena tidak ada yang ingat ia menutupi apa. Aturannya: setiap overlay wajib dipetakan ke celah model yang spesifik, lengkap dengan tanggal kedaluwarsa.",
        "Aturan keputusan. Satu: bobot harus berjumlah tepat 1,0 — auditor selalu mengecek ini pertama. Dua: dokumentasikan alasan tiap bobot dengan narasi ekonomi 2–3 kalimat (bukan \"berdasarkan judgment manajemen\"). Tiga: uji sensitivitas ±10pp pada bobot pesimis setiap kuartal dan laporkan ke komite risiko. Empat: bandingkan bobotmu dengan probabilitas implisit pasar (misalnya dari spread obligasi) setahun sekali — jika bobot pesimismu jauh lebih ringan dari yang dihargai pasar, bersiaplah menjelaskan ke auditor.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ECL adalah harga, bukan ramalan",
        body: "Berhentilah memikirkan ECL sebagai \"tebakan kerugian masa depan\" — pikirkan sebagai harga premi asuransi yang wajar untuk portofolio ini, hari ini. Penjual asuransi tidak meramal siapa yang sakit; ia menghitung harga dari peluang, keparahan, dan nilai waktu uang. Begitu cara berpikirnya berubah, urutan operasi menjadi intuitif: harga dihitung per periode lalu dibawa ke nilai kini, dan ketidakpastian harga (skenario) dibobot paling akhir. Heuristik yang jarang diajarkan: ketika dua analis menghasilkan ECL berbeda 30% dari data yang sama, perbedaannya hampir pasti bukan di data — melainkan di tiga asumsi judgmental: bobot skenario, EIR yang dipakai, dan LGD. Data adalah 20% pekerjaan; 80%-nya adalah asumsi yang bisa dipertahankan di depan auditor. Maka alokasikan waktumu terbalik dari insting: sedikit untuk query, banyak untuk dokumentasi asumsi. Dan ingat sifat ECL yang paling sering dilupakan: ia asimetris. ECL yang terlalu rendah 20% bisa memicu temuan audit, restatement, dan sanksi; ECL yang terlalu tinggi 20% hanya membuat laba terlihat konservatif. Asimetri ini bukan alasan untuk melebih-lebihkan — melainkan alasan mengapa governance atas asumsi judgmental harus lebih ketat daripada governance atas kode.",
      },
      reference: "Yang paling sensitif = yang paling judgmental = yang paling butuh governance.",
    },
    {
      id: "gap-g21-tabel-input-rekonsiliasi-ecl",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G21)",
      title: "Tabel input ke output: setiap rupiah ECL bisa dilacak ke asalnya",
      prose: [
        "ECL final Rp11,31 juta dari lab sebelumnya terlihat seperti angka ajaib bila tidak ada tabel yang menghubungkannya ke input. Tabel rekonsiliasi memecahnya menjadi rantai yang bisa diaudit baris per baris. Input: EAD awal Rp500 juta, LGD 30%, EIR 8%, amortisasi 8% per tahun, PD flat per skenario (optimis 0,8%, baseline 1,2%, pesimis 2,5%), bobot skenario 20% / 50% / 30%. Perantara: ECL tiap skenario dari fungsi yang sama — optimis Rp6,0 juta, baseline Rp9,0 juta, pesimis Rp18,7 juta. Output: kontribusi tiap skenario ke final — optimis 0,20 × 6,0 = Rp1,20 juta; baseline 0,50 × 9,0 = Rp4,50 juta; pesimis 0,30 × 18,7 = Rp5,61 juta; final = 1,20 + 4,50 + 5,61 = Rp11,31 juta.",
        "Tabel ini menjawab tiga pertanyaan audit dalam satu pandangan. Satu, dari mana angka final berasal — tiap rupiah punya induk (skenario) dan kakek (PD, LGD, EAD, diskonto). Dua, siapa penyumbang terbesar — skenario pesimis menyumbang Rp5,61 juta alias 49,6% dari final, walau bobotnya hanya 30%: ekornya yang mahal, bukan badannya. Tiga, apa yang berubah bila satu input berubah — naikkan PD pesimis 10%, ECL pesimis naik 10% (linear), final naik 0,56 juta. Tanpa tabel ini, ECL adalah kotak hitam; dengan tabel ini, direksi bisa bertanya dan analis bisa menjawab tanpa membuka kode.",
        "Disiplin tabel: satu, tulis SEMUA input dengan satuan dan sumbernya (PD dari model mana? LGD dari workout tahun berapa? EIR dari kontrak?). Dua, tunjukkan perantara, bukan hanya input dan output — ECL per skenario adalah jembatan yang membuat lompatan ke final bisa diperiksa. Tiga, jumlahkan dengan pembulatan yang konsisten: 1,20 + 4,50 + 5,61 = 11,31 — bila tabelmu menjumlah ke 11,30 karena pembulatan, tulis selisih pembulatannya, jangan sembunyikan.",
      ],
      formula: String.raw`\text{ECL final} = \sum_s w_s \times ECL_s = 1{,}20 + 4{,}50 + 5{,}61 = 11{,}31`,
      formulaNote: "Pesimis menyumbang 5,61 dari 11,31 (49,6%) walau bobotnya hanya 30%.",
      tasks: [
        { id: "t1", text: "Hitung `kontr_opt`, `kontr_base`, `kontr_pes` (kontribusi tiap skenario, juta Rp)" },
        { id: "t2", text: "Hitung `final` dan `share_pes` (persen final dari skenario pesimis)" },
      ],
      expected: "kontr_opt=1.2  kontr_base=4.5  kontr_pes=5.61  final=11.31  share_pes=49.6",
      hints: [
        "Kontribusi = bobot × ECL skenario: 0,2×6,0; 0,5×9,0; 0,3×18,7.",
        "Final = jumlah ketiga kontribusi.",
        "Share pesimis = kontribusi pesimis / final × 100.",
      ],
      code: {
        starter: `# Tabel rekonsiliasi ECL: ECL per skenario (juta Rp) + bobot.\necl_skenario = {"optimis": 6.0, "baseline": 9.0, "pesimis": 18.7}\nbobot = {"optimis": 0.20, "baseline": 0.50, "pesimis": 0.30}\n\n# TULIS KODEMU: kontribusi tiap skenario, final, share pesimis.\nkontr_opt = \nkontr_base = \nkontr_pes = \nfinal = \nshare_pes = \n\nprint(f"kontr_opt={kontr_opt}  kontr_base={kontr_base}  kontr_pes={kontr_pes}  final={final}  share_pes={share_pes:.1f}")`,
        lockLines: 3,
        solution: `# Tabel rekonsiliasi ECL: ECL per skenario (juta Rp) + bobot.\necl_skenario = {"optimis": 6.0, "baseline": 9.0, "pesimis": 18.7}\nbobot = {"optimis": 0.20, "baseline": 0.50, "pesimis": 0.30}\n\n# TULIS KODEMU: kontribusi tiap skenario, final, share pesimis.\nkontr_opt = round(bobot["optimis"] * ecl_skenario["optimis"], 2)\nkontr_base = round(bobot["baseline"] * ecl_skenario["baseline"], 2)\nkontr_pes = round(bobot["pesimis"] * ecl_skenario["pesimis"], 2)\nfinal = round(kontr_opt + kontr_base + kontr_pes, 2)\nshare_pes = kontr_pes / final * 100\n\nprint(f"kontr_opt={kontr_opt}  kontr_base={kontr_base}  kontr_pes={kontr_pes}  final={final}  share_pes={share_pes:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "kontr_opt", value: 1.2, tol: 0.01, label: "`kontr_opt` = Rp1,20 juta", msg: "0,20 × 6,0 = 1,20." },
          { kind: "equal", task: "t1", name: "kontr_base", value: 4.5, tol: 0.01, label: "`kontr_base` = Rp4,50 juta", msg: "0,50 × 9,0 = 4,50." },
          { kind: "equal", task: "t1", name: "kontr_pes", value: 5.61, tol: 0.01, label: "`kontr_pes` = Rp5,61 juta", msg: "0,30 × 18,7 = 5,61 — penyumbang terbesar." },
          { kind: "equal", task: "t2", name: "final", value: 11.31, tol: 0.01, label: "`final` = Rp11,31 juta", msg: "1,20 + 4,50 + 5,61 = 11,31 — sama dengan lab ECL." },
          { kind: "equal", task: "t2", name: "share_pes", value: 49.6, tol: 0.1, label: "`share_pes` = 49,6%", msg: "5,61/11,31 = 49,6% — ekornya yang mahal." },
          { kind: "stdout_matches", task: "t2", pattern: "kontr_opt=1.2\\s+kontr_base=4.5\\s+kontr_pes=5.61\\s+final=11.31\\s+share_pes=49.6", label: "`print` menampilkan kelima angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Auditor bertanya: 'Dari mana Rp11,31 juta ini?' Jawaban yang benar memakai tabel rekonsiliasi?",
          options: [
            { text: "Tunjukkan rantai: input (PD/LGD/EAD/EIR/bobot) → ECL per skenario → kontribusi → final 11,31", why: "Tepat: tiap rupiah bisa dilacak ke asalnya; pesimis menyumbang 49,6% walau bobotnya 30%.", correct: true },
            { text: "Tunjukkan kode fungsi hitung_ecl saja — kode adalah dokumentasi", why: "Salah: kode menunjukkan CARA hitung, bukan dari mana tiap rupiah berasal; tabel rekonsiliasi yang menjawab." },
            { text: "Jawab 'dari model' — model sudah divalidasi", why: "Salah: 'dari model' bukan jawaban audit; auditor butuh rantai input → perantara → output." },
            { text: "Tunjukkan ECL final kuartal lalu untuk perbandingan", why: "Salah: perbandingan historis tidak menjelaskan komposisi angka kuartal ini." },
          ],
        },
      ],
      reference: "Tabel rekonsiliasi ECL: input (PD/LGD/EAD/EIR/bobot) → ECL per skenario (6,0/9,0/18,7) → kontribusi (1,20/4,50/5,61) → final 11,31.",
    },
    {
      id: "gap-g22-lifetime-ecl-vs-pd",
      eyebrow: "Langkah tambahan · Gap ronde 6 (G22)",
      title: "Lifetime ECL vs definisi PD: marginal, kumulatif, dan 12-bulan bukan hal yang sama",
      prose: [
        "Tiga definisi PD yang tertukar adalah sumber paling umum ECL yang salah hitung. PD 12-bulan: peluang gagal dalam 12 bulan ke depan, dari hari ini. PD kumulatif: peluang gagal KAPAN SAJA sampai tahun ke-T. PD marginal: peluang gagal TEPAT di tahun ke-t, setelah selamat sampai tahun itu. Lifetime ECL memakai PD MARGINAL tiap tahun — bukan PD 12-bulan yang diulang, bukan PD kumulatif yang dipakai sekali.",
        "Contoh tiga tahun, PD kondisional per tahun 1,2%, 1,1%, 1,0% (peluang gagal di tahun itu bila selamat sampai awal tahun itu). PD marginal: tahun 1 = 1,200%; tahun 2 = 98,8% selamat × 1,1% = 1,087%; tahun 3 = 98,8% × 98,9% × 1,0% = 0,977%. Jumlah ketiganya = 3,264% — dan itu SAMA dengan PD kumulatif 3 tahun: 1 − (0,988 × 0,989 × 0,990) = 3,264%. Identitas ini adalah cek konsistensi: bila jumlah marginalmu tidak sama dengan kumulatif, ada yang salah hitung. ECL lifetime (LGD 45%, EAD Rp100 juta, EIR 5%): tahun 1 Rp514.286, tahun 2 Rp443.592, tahun 3 Rp379.838 — total Rp1.337.715.",
        "Kesalahan klasik: memakai PD 12-bulan 1,2% untuk ketiga tahun (flat). Totalnya menjadi Rp1.470.554 — lebih besar Rp132.839 (9,9%) dari yang benar — karena ia mengabaikan bahwa sebagian debitur sudah gagal di tahun sebelumnya dan tidak bisa gagal lagi. Kesalahan kedua: memakai PD kumulatif 3,264% sebagai PD satu tahun — ECL meledak tiga kali lipat. Aturan hafalan: lifetime ECL = jumlah atas tahun dari (PD marginal tahun itu × LGD × EAD tahun itu, didiskonto). PD 12-bulan hanya untuk Stage 1; begitu masuk Stage 2, ganti ke marginal.",
      ],
      formula: String.raw`PD^{marg}_t = S_{t-1} \times PD^{kond}_t \qquad \sum_t PD^{marg}_t = PD^{kum}_T \qquad ECL = \sum_t \frac{PD^{marg}_t \times LGD \times EAD}{(1+EIR)^t}`,
      formulaNote: "Marginal 1,200% / 1,087% / 0,977% — jumlah 3,264% = kumulatif. ECL lifetime Rp1.337.715.",
      tasks: [
        { id: "t1", text: "Hitung `marg2` dan `marg3` (PD marginal tahun 2 dan 3, desimal)" },
        { id: "t2", text: "Hitung `ecl_lifetime` (rupiah, didiskonto 5%) dan `kumulatif` (PD kumulatif 3 tahun)" },
      ],
      expected: "marg2=0.010868  marg3=0.009771  ecl_lifetime=1337715  kumulatif=0.03264",
      hints: [
        "Marginal tahun 2 = 0,988 × 0,011; tahun 3 = 0,988 × 0,989 × 0,010.",
        "ECL per tahun = marginal × 0,45 × 100.000.000 / 1,05^t; jumlahkan.",
        "Kumulatif = 1 − (0,988 × 0,989 × 0,990).",
      ],
      code: {
        starter: `# Lifetime ECL 3 tahun: PD kondisional 1,2% / 1,1% / 1,0%.\npd_kond = [0.012, 0.011, 0.010]\nlgd = 0.45\nead = 100_000_000\neir = 0.05\n\n# TULIS KODEMU: PD marginal, ECL lifetime, PD kumulatif.\nselamat = 1.0\nmarg = []\nfor p in pd_kond:\n    marg.append(selamat * p)\n    selamat *= (1 - p)\nmarg2 = \nmarg3 = \necl_lifetime = \nkumulatif = \n\nprint(f"marg2={marg2:.6f}  marg3={marg3:.6f}  ecl_lifetime={ecl_lifetime:.0f}  kumulatif={kumulatif:.5f}")`,
        lockLines: 8,
        solution: `# Lifetime ECL 3 tahun: PD kondisional 1,2% / 1,1% / 1,0%.\npd_kond = [0.012, 0.011, 0.010]\nlgd = 0.45\nead = 100_000_000\neir = 0.05\n\n# TULIS KODEMU: PD marginal, ECL lifetime, PD kumulatif.\nselamat = 1.0\nmarg = []\nfor p in pd_kond:\n    marg.append(selamat * p)\n    selamat *= (1 - p)\nmarg2 = marg[1]\nmarg3 = marg[2]\necl_lifetime = sum(p * lgd * ead / (1 + eir) ** (t + 1) for t, p in enumerate(marg))\nkumulatif = 1 - selamat\n\nprint(f"marg2={marg2:.6f}  marg3={marg3:.6f}  ecl_lifetime={ecl_lifetime:.0f}  kumulatif={kumulatif:.5f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "marg2", value: 0.010868, tol: 0.000001, label: "`marg2` = 1,0868%", msg: "0,988 × 1,1% = 1,0868% — bukan 1,1% mentah." },
          { kind: "equal", task: "t1", name: "marg3", value: 0.009771, tol: 0.000001, label: "`marg3` = 0,9771%", msg: "0,988 × 0,989 × 1,0% = 0,9771%." },
          { kind: "equal", task: "t2", name: "ecl_lifetime", value: 1337715, tol: 1, label: "`ecl_lifetime` = Rp1.337.715", msg: "514.286 + 443.592 + 379.838 = 1.337.715." },
          { kind: "equal", task: "t2", name: "kumulatif", value: 0.03264, tol: 0.00001, label: "`kumulatif` = 3,264%", msg: "Jumlah marginal = kumulatif — cek konsistensi lolos." },
          { kind: "stdout_matches", task: "t2", pattern: "marg2=0.010868\\s+marg3=0.009771\\s+ecl_lifetime=1337715\\s+kumulatif=0.03264", label: "`print` menampilkan keempat angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      quiz: [
        {
          q: "Analis menghitung lifetime ECL 3 tahun memakai PD 12-bulan 1,2% untuk tiap tahun. Apa yang terjadi?",
          options: [
            { text: "ECL kelebihan Rp132.839 (9,9%) — debitur yang sudah gagal dihitung gagal lagi", why: "Tepat: PD marginal tahun 2–3 lebih kecil dari 1,2% karena survival; flat mengabaikannya.", correct: true },
            { text: "ECL benar — PD 12-bulan memang dipakai untuk tiap tahun lifetime", why: "Salah: PD 12-bulan hanya untuk Stage 1 (satu tahun); lifetime memakai marginal per tahun." },
            { text: "ECL kekurangan — PD kumulatif lebih besar dari PD 12-bulan", why: "Salah: arahnya kebalik — flat 1,2% MELEBIHI marginal, jadi ECL kelebihan, bukan kekurangan." },
            { text: "Tidak ada efek — LGD dan EAD yang menentukan ECL", why: "Salah: PD marginal vs flat mengubah total Rp132.839 — PD menentukan ECL sama besarnya." },
          ],
        },
      ],
      reference: "Lifetime ECL memakai PD marginal per tahun (1,200% / 1,087% / 0,977%); jumlah marginal = PD kumulatif (3,264%) — cek konsistensi wajib.",
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
        "Urutan ECL = kontrak: staging → PD/EAD per tahun → kalikan & diskonto → jumlahkan → bobot skenario.",
        "Jurnal CKPN: Dr. Beban / Cr. Kontra-aset → laba turun. Write-off: netral laba, menurunkan NPL.",
        "Sensitivitas: bobot pesimis paling sensitif (+10pp → +18%) — governance terketat di sana.",
        "Backtest: |bias| <15% wajar; bias satu arah 3+ tahun = rekalibrasi, bukan overlay.",
        "Struktur pembayaran (balloon vs amortisasi) adalah parameter risiko EAD.",
      ],
      next: { label: "CR15 — Risiko Portofolio", href: "/v2/learn/cr15-risiko-portofolio" },
      quiz: [
        {
          q: "Urutan perhitungan ECL lifetime yang benar?",
          options: [
            { text: "Bobot skenario → diskonto → kalikan PD/LGD/EAD", why: "Urutan ini salah — bobot skenario harus paling akhir." },
            { text: "Staging → PD/EAD per tahun → kalikan & diskonto per tahun → jumlahkan → bobot skenario", why: "Urutan = kontrak. Mendiskonto PD atau membobot di awal menghasilkan angka salah meski komponen benar.", correct: true },
            { text: "Diskonto PD-nya dulu, baru kalikan", why: "Yang didiskonto = kontribusi tahunan, bukan PD." },
            { text: "Bebas — hasil sama saja", why: "Tidak sama — non-linearitas membuat urutan menentukan hasil." },
          ],
        },
        {
          q: "Ayat jurnal pembentukan CKPN Rp 100 M?",
          options: [
            { text: "Dr. Kas / Cr. Pendapatan", why: "Bukan itu." },
            { text: "Dr. Beban CKPN / Cr. CKPN (kontra-aset) — laba turun Rp 100 M", why: "Beban vs kontra-aset. Laba turun langsung.", correct: true },
            { text: "Dr. CKPN / Cr. Kredit — tidak pengaruhi laba", why: "Itu jurnal write-off — netral laba." },
            { text: "Tidak ada jurnal — CKPN otomatis", why: "CKPN dicatat via jurnal beban." },
          ],
        },
        {
          q: "Write-off Rp 120 M. Dampak ke laba kuartal ini?",
          options: [
            { text: "Laba turun Rp 120 M", why: "Rugi sudah diakui saat CKPN dibentuk dulu." },
            { text: "Netral — rugi sudah diakui saat CKPN dibentuk dulu; write-off hanya Dr. CKPN / Cr. Kredit", why: "Ini beda fundamental antara 'beban CKPN' (menggerakkan laba) dan 'write-off' (membersihkan NPL).", correct: true },
            { text: "Laba naik Rp 120 M", why: "Tidak ada kenaikan laba." },
            { text: "Tergantung direksi", why: "Aturannya jelas — netral." },
          ],
        },
        {
          q: "Backtest 3 tahun berturut-turut underestimate 20%+. Tindakan?",
          options: [
            { text: "Tambah overlay Rp 500 M", why: "Overlay hanya morfin — menutupi gejala." },
            { text: "Rekalibrasi model (perbaiki sumber bias) — overlay hanya morfin; dokumentasikan perubahan metodologi", why: "Bias satu arah konsisten = model sakit. Obati sumbernya.", correct: true },
            { text: "Ganti vendor model", why: "Terlalu drastis sebelum rekalibrasi." },
            { text: "Sembunyikan dari auditor", why: "Itu pelanggaran." },
          ],
        },
        {
          q: "ECL kuartal ini 'terasa' terlalu kecil padahal NPL naik. Langkah audit pertama yang paling tepat?",
          options: [
            { text: "Terima saja — mesin pasti benar", why: "Insting analis adalah sinyal validasi yang sah." },
            { text: "Cek input data (DPD, staging, EIR) — 9 dari 10 keajaiban ECL adalah kesalahan data, bukan model", why: "Audit berlapis mulai dari input: DPD salah catat? EIR nol? staging macet?", correct: true },
            { text: "Langsung ganti model", why: "Terlalu dini — cek data dulu." },
            { text: "Naikkan manual 20%", why: "Manual tanpa dasar = manipulasi." },
          ],
        },
      ],
    },
  ],
};
