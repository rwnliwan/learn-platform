import type { V2Lesson } from "../lib/types";

const FIG_ECL = `<svg viewBox="0 0 480 250" role="img" aria-label="Batang ECL tiga stage: Stage 1 kecil, Stage 2 menengah, Stage 3 besar.">
<g font-family="var(--font-ui)">
<text x="10" y="52" font-size="12" fill="var(--chart-text)">Stage 1</text>
<rect x="90" y="36" width="5" height="26" fill="var(--c1)" opacity="0.9"/>
<text x="100" y="54" font-size="11" fill="var(--chart-text)">Rp1,08 M (12-month)</text>
<text x="10" y="112" font-size="12" fill="var(--chart-text)">Stage 2</text>
<rect x="90" y="96" width="62" height="26" fill="var(--c3)" opacity="0.9"/>
<text x="158" y="114" font-size="11" fill="var(--chart-text)">Rp13,5 M (lifetime)</text>
<text x="10" y="172" font-size="12" fill="var(--chart-text)">Stage 3</text>
<rect x="90" y="156" width="360" height="26" fill="var(--c4)" opacity="0.9"/>
<text x="240" y="174" font-size="11" fill="#fff" text-anchor="middle">Rp90 M (credit-impaired)</text>
<text x="240" y="215" font-size="11" fill="var(--chart-text)" text-anchor="middle">Stage 1 ke 2 = tebing: ECL naik 12x lipat dalam semalam.</text>
<text x="240" y="235" font-size="11" fill="var(--chart-text)" text-anchor="middle">Contoh: EAD Rp200 M, LGD 45%; PD 1,2% (12m) vs 15% (lifetime).</text>
</g>
</svg>`;

export const rr16: V2Lesson = {
  slug: "rr16-ecl-rwa",
  track: "Risk Reporting",
  module: "Angka Risiko & Regulasi",
  title: "RR16 — ECL (PSAK 109) & RWA Reporting",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp16,8 miliar yang hilang dalam semalam",
      prose: [
        "PT Sinar Abadi: kredit Rp200 miliar, lancar, Stage 1. ECL-nya Rp1,08 miliar — kecil, nyaris tidak terlihat di laporan laba. Lalu DPD menyentuh 35 hari + restrukturisasi disetujui. Dua pemicu itu = SICR (significant increase in credit risk). Esok paginya Sinar Abadi duduk di Stage 2 — dan ECL-nya Rp13,5 miliar. Laba kuartal bank turun Rp12,4 miliar dalam semalam.",
        "Twist-nya: debiturnya tidak berubah. Tidak ada gagal bayar baru, tidak ada kabar buruk. Yang berubah = klasifikasi. Inilah 'tebing staging' PSAK 109/IFRS 9: ECL Stage 1 memakai PD 12 bulan (1,2%), Stage 2 memakai PD lifetime (15%) — 12,5x lipat untuk debitur yang sama, hanya karena dua pemicu administratif.",
        "Lesson ini tentang dua angka yang menentukan laporan keuangan dan modal bank: ECL (cadangan kerugian ekspektasian — PSAK 109) dan RWA (aset tertimbang menurut risiko — penyebut CAR). Keduanya lahir dari PD×LGD×EAD yang sama, tetapi menjawab pertanyaan berbeda: 'berapa cadangannya?' vs 'berapa modalnya?'",
        "Setelah lesson ini kamu bisa: (1) menghitung ECL per stage dari PD×LGD×EAD; (2) menjelaskan tebing Stage 1→2; (3) menghitung RWA dan CAR dari bobot risiko; (4) menyusun laporan ECL per stage untuk komite.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Tebing staging = volatilitas laba yang tidak terlihat di neraca. Bank dengan banyak debitur di 'perbatasan SICR' (DPD 25–29 hari) duduk di atas ranjau: satu bulan buruk = ECL meledak. Laporan ECL yang baik selalu memuat 'watchlist SICR' — debitur yang 1 pemicu lagi jatuh ke Stage 2.",
      },
      reference: "ECL = PD×LGD×EAD. Stage menentukan PD mana yang dipakai.",
    },
    {
      id: "staging",
      eyebrow: "Langkah 2 · Konsep",
      title: "Tiga stage, satu rumus",
      prose: [
        "PSAK 109 membagi kredit ke 3 stage. Stage 1: performing — ECL 12-month (kerugian ekspektasian 12 bulan ke depan). Stage 2: SICR — ECL lifetime (seluruh sisa tenor). Stage 3: credit-impaired (gagal bayar) — ECL lifetime dengan PD 100%. Pemicu SICR standar: DPD > 30 hari, restrukturisasi, penurunan rating signifikan.",
        "Rumusnya satu: ECL = PD × LGD × EAD. PD = peluang gagal bayar; LGD = porsi yang hilang jika gagal (1 − recovery); EAD = eksposur saat gagal (termasuk plafond belum ditarik × CCF). Contoh Sinar Abadi Stage 1: 0,012 × 0,45 × 200 = Rp1,08 M. Stage 2: 0,15 × 0,45 × 200 = Rp13,5 M. Debitur sama, EAD sama, LGD sama — hanya PD yang melompat.",
        "Tiga miskonsepsi umum. Satu: 'ECL = CKPN lama dengan nama baru.' Bukan — CKPN lama menunggu kerugian terjadi (incurred); ECL mencadangkan sebelum terjadi (expected). Dua: 'Stage 2 = macet.' Bukan — Stage 2 masih membayar; ia naik stage karena RISIKONYA naik. Tiga: 'PD lifetime = PD 12-month × sisa tahun.' Bukan — PD lifetime dari kurva survival, bukan perkalian linear.",
        "Cara membaca figur: tiga batang = ECL tiga stage untuk eksposur yang sama. Interpretasi: tebing 1→2 (Rp1,08 M → Rp13,5 M) adalah risiko laba terbesar — bukan Stage 3 yang sudah pasti. Monitor 'jarak ke SICR', bukan hanya stage saat ini.",
      ],
      formula: String.raw`\text{ECL} = \text{PD} \times \text{LGD} \times \text{EAD}`,
      formulaNote: "PD = probability of default (12-month untuk Stage 1, lifetime untuk Stage 2/3); LGD = loss given default (porsi hilang); EAD = exposure at default (Rp). Contoh Stage 2: 0,15 × 0,45 × Rp200 M = Rp13,5 M. Interpretasi: ekspektasi kerugian — bukan kerugian pasti.",
      figure: {
        svg: FIG_ECL,
        alt: "Batang ECL tiga stage untuk eksposur yang sama.",
        caption: "Tebing staging: Stage 1→2 = ECL naik 12x. Watchlist SICR = ranjau laba.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Stage 2 berarti debitur sudah macet.” Stage 2 = risiko naik signifikan, bukan gagal bayar. Debitur Stage 2 masih membayar cicilan — tetapi model berkata peluang gagalnya naik. Mencampur keduanya membuat komite panik untuk hal yang salah.",
      },
      hints: [
        "Stage 1 → PD 12-month; Stage 2/3 → PD lifetime.",
        "SICR trigger: DPD > 30 hari, restrukturisasi, downgrade rating.",
      ],
      reference: "Satu rumus, tiga PD. Tebing = Stage 1→2.",
    },
    {
      id: "rwa",
      eyebrow: "Langkah 3 · Konsep",
      title: "RWA: mengapa Rp1.000 M tidak selalu Rp1.000 M",
      prose: [
        "RWA (Risk-Weighted Assets) = 'berat' tiap aset menurut risikonya. Kredit korporat Rp1.000 M × bobot 100% = RWA Rp1.000 M. KPR Rp1.000 M × 35% = RWA Rp350 M. SBN Rp1.000 M × 0% = RWA Rp0. Aset yang sama nominalnya, 'berat' modalnya beda — inilah cara Basel membuat bank memilih aset yang lebih aman.",
        "CAR (KPMM) = Modal / RWA × 100%, minimum 8% (+ buffer sesuai profil risiko). Lab menghitung: RWA Rp8.950 M, modal Rp1.600 M → CAR 17,9% — memenuhi. Perhatikan SBN: Rp4.000 M eksposur, RWA nol — tetapi konsentrasi ke satu penerbit tetap risiko (ingat limit top-20 di RR15).",
        "Kaitan ECL–RWA: ECL menggerus laba → menggerus modal (pembilang CAR); RWA = penyebut. Tebing staging menyerang keduanya sekaligus: ECL naik (modal turun) tepat saat risiko naik. Inilah mengapa laporan ECL dan RWA selalu dibaca berpasangan di laporan regulasi.",
        "Untuk laporan: regulator (OJK) butuh RWA per kategori + rekonsiliasi ke laporan keuangan; direksi butuh CAR + jarak ke minimum 8% + sensitivitas ('jika ECL naik Rp100 M, CAR turun berapa?').",
      ],
      formula: String.raw`\text{CAR} = \frac{\text{Modal}}{\text{RWA}} \times 100\% \quad ; \quad \text{RWA} = \sum \text{EAD}_i \times w_i`,
      formulaNote: "w_i = bobot risiko kategori aset (korporat 100%, SME 75%, KPR 35%, sovereign 0%). Contoh: Rp6.000 M × 100% + Rp3.000 M × 75% + Rp2.000 M × 35% = Rp8.950 M. CAR = 1.600/8.950 = 17,9%. Interpretasi: setiap Rp100 modal menopang Rp558 aset tertimbang.",
      tasks: [],
      note: {
        title: "Intuisi",
        body: "RWA adalah 'pajak risiko' atas neraca: aset berisiko membayar pajak modal lebih mahal. Bank yang paham ini tidak sekadar mengejar aset besar — ia mengejar aset dengan imbal hasil per RWA tertinggi.",
      },
      reference: "CAR = Modal/RWA ≥ 8%. ECL menggerus pembilang; risiko menggelembungkan penyebut.",
    },
    {
      id: "lab-ecl",
      eyebrow: "Langkah 4 · Lab",
      title: "Kalkulator ECL tiga stage",
      prose: [
        "Hitung ECL tiga debitur Bank Artha Dana: Sinar Abadi (Stage 1), Tunas Bangsa (Stage 2), Karya Fiktif (Stage 3, PD 100%). Perhatikan Stage 3: ECL = 1,0 × 0,60 × 50 = Rp30 M — lebih dari separuh total ECL portofolio mini ini.",
        "Eksperimen: pindahkan Tunas Bangsa ke Stage 1 (PD 12-month 2%) — ECL-nya menjadi 0,02×0,45×120 = Rp1,08 M, total turun Rp7 M. Inilah sensitivitas staging: satu keputusan SICR = Rp7 M laba.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ecl` tiap debitur dan `total`" },
        { id: "t2", text: "Jalankan dan pastikan total tercetak" },
      ],
      expected: "PT Sinar Abadi (Stage 1): ECL Rp1.08 M\nPT Tunas Bangsa (Stage 2): ECL Rp8.10 M\nPT Karya Fiktif (Stage 3): ECL Rp30.00 M\nTotal ECL: Rp39.18 M",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“PD Stage 2 = PD Stage 1 × 12.” Bukan perkalian linear — PD lifetime dari model survival/migrasi. Memakai perkalian kasar = ECL yang salah secara metodologi = temuan audit model.",
      },
      hints: [
        "ecl = pd * lgd * ead.",
        "Stage menentukan PD mana: 12-month vs lifetime.",
      ],
      code: {
        starter: "# (nama, stage, PD, LGD, EAD Rp M). Stage 1: PD 12-bulan; Stage 2/3: PD lifetime. JANGAN UBAH.\ndebitur = [(\"PT Sinar Abadi\", 1, 0.012, 0.45, 200.0),\n           (\"PT Tunas Bangsa\", 2, 0.15, 0.45, 120.0),\n           (\"PT Karya Fiktif\", 3, 1.00, 0.60, 50.0)]\n\n# TULIS KODEMU: ECL = PD x LGD x EAD\ntotal = 0.0\nfor nama, stage, pd, lgd, ead in debitur:\n    ecl =\n    total += ecl\n    print(f\"{nama} (Stage {stage}): ECL Rp{ecl:.2f} M\")\nprint(f\"Total ECL: Rp{total:.2f} M\")\n",
        lockLines: 7,
        solution: "# (nama, stage, PD, LGD, EAD Rp M). Stage 1: PD 12-bulan; Stage 2/3: PD lifetime. JANGAN UBAH.\ndebitur = [(\"PT Sinar Abadi\", 1, 0.012, 0.45, 200.0),\n           (\"PT Tunas Bangsa\", 2, 0.15, 0.45, 120.0),\n           (\"PT Karya Fiktif\", 3, 1.00, 0.60, 50.0)]\n\n# TULIS KODEMU: ECL = PD x LGD x EAD\ntotal = 0.0\nfor nama, stage, pd, lgd, ead in debitur:\n    ecl = pd * lgd * ead\n    total += ecl\n    print(f\"{nama} (Stage {stage}): ECL Rp{ecl:.2f} M\")\nprint(f\"Total ECL: Rp{total:.2f} M\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "ECL Sinar = 1,08", msg: "0,012×0,45×200.", name: "total", value: 39.18, tol: 0.01 },
          { kind: "stdout_matches", task: "t2", label: "Total ECL tercetak", msg: "1,08 + 8,10 + 30,00 = 39,18.", pattern: "Total ECL: Rp39\\.18 M" }
        ],
      },
      reference: "ECL = PD×LGD×EAD. Stage = PD mana yang dipakai.",
    },
    {
      id: "lab-rwa",
      eyebrow: "Langkah 5 · Lab",
      title: "RWA dan CAR bank mini",
      prose: [
        "Empat kategori eksposur, empat bobot. Hitung RWA total lalu CAR. Bank mini ini CAR 17,9% — jauh di atas minimum 8%. Tetapi ingat: minimum naik dengan buffer (conservation 2,5% + countercyclical) — dan OJK menilai per profil risiko bank.",
        "Eksperimen: pindahkan Rp2.000 M SBN ke korporat — RWA naik Rp2.000 M, CAR turun ke 14,6%. Sama-sama Rp2.000 M aset, 'pajak modal' beda Rp2.000 M RWA. Inilah mengapa treasurer dan CRO harus bicara tiap bulan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rwa` dan `car`" },
        { id: "t2", text: "Jalankan dan pastikan verdict tercetak" },
      ],
      expected: "Total RWA: Rp8950 M\nCAR: 17.9% -> MEMENUHI (minimum 8%)",
      note: {
        title: "Intuisi",
        body: "CAR 17,9% terlihat nyaman — tetapi tanyakan 'CAR setelah tebing staging?' Jika Rp500 M eksposur Stage 1 jatuh ke Stage 2, ECL naik ±Rp60 M → modal turun → CAR turun. Laporan CAR yang baik memuat sensitivitas, bukan sekadar angka.",
      },
      hints: [
        "rwa = jumlah ead*bobot.",
        "car = modal/rwa*100; minimum 8%.",
      ],
      code: {
        starter: "# (nama, EAD Rp M, bobot risiko). JANGAN UBAH.\neksposur = [(\"Korporat\", 6000.0, 1.00), (\"SME\", 3000.0, 0.75),\n            (\"KPR\", 2000.0, 0.35), (\"SBN\", 4000.0, 0.00)]\nmodal = 1600.0  # Rp M\n\n# TULIS KODEMU: RWA dan CAR\nrwa =\ncar =\nprint(f\"Total RWA: Rp{rwa:.0f} M\")\nprint(f\"CAR: {car:.1f}% -> {'MEMENUHI' if car >= 8 else 'KURANG'} (minimum 8%)\")\n",
        lockLines: 5,
        solution: "# (nama, EAD Rp M, bobot risiko). JANGAN UBAH.\neksposur = [(\"Korporat\", 6000.0, 1.00), (\"SME\", 3000.0, 0.75),\n            (\"KPR\", 2000.0, 0.35), (\"SBN\", 4000.0, 0.00)]\nmodal = 1600.0  # Rp M\n\n# TULIS KODEMU: RWA dan CAR\nrwa = sum(ead * bobot for _, ead, bobot in eksposur)\ncar = modal / rwa * 100\nprint(f\"Total RWA: Rp{rwa:.0f} M\")\nprint(f\"CAR: {car:.1f}% -> {'MEMENUHI' if car >= 8 else 'KURANG'} (minimum 8%)\")\n",
        checks: [
          { kind: "equal", task: "t1", label: "`rwa` = 8950", msg: "6.000+2.250+700+0.", name: "rwa", value: 8950, tol: 1e-09 },
          { kind: "stdout_matches", task: "t2", label: "CAR 17,9% MEMENUHI", msg: "1.600/8.950 = 17,9% ≥ 8%.", pattern: "CAR: 17\\.9% -> MEMENUHI" }
        ],
      },
      reference: "RWA = Σ EAD×bobot. CAR ≥ 8% (+buffer).",
    },
    {
      id: "peta",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Stage berapa, lapor apa",
      prose: [
        "Satu: DPD 35 hari + restrukturisasi → SICR → Stage 2, ECL lifetime; eskalasi ke komite karena dampak laba material. Dua: rating turun 2 notch tetapi DPD 0 → SICR kualitatif → Stage 2; dokumentasikan alasannya. Tiga: gagal bayar 90 hari → Stage 3, PD 100%; fokus ke recovery (LGD aktual). Empat: debitur di 'perbatasan SICR' (DPD 25–29 hari) → watchlist: hitung ECL pro-forma Stage 2 sebagai early warning laba.",
        "Aturan praktis 10 detik: ada pemicu SICR → Stage 2, hitung dampak labanya hari ini. Tidak ada pemicu tetapi dekat → watchlist + angka pro-forma.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Watchlist SICR adalah 'laporan laba masa depan': ia memberi tahu direksi 'kuartal depan ECL bisa naik RpX jika 5 debitur ini jatuh'. Direksi yang terkejut oleh tebing staging = direksi yang tidak pernah melihat watchlist.",
      },
      reference: "Pemicu → Stage 2. Dekat pemicu → watchlist + pro-forma.",
    },
    {
      id: "lab-3",
      eyebrow: "Lab 3 · Migrasi staging",
      title: "Berapa yang turun kasta?",
      prose: [
        "Lab 1–2 menghitung ECL per stage. Lab ini mengukur migrasi: dari 1.000 debitur Stage 1, dalam setahun 120 turun ke Stage 2 dan 30 langsung ke Stage 3. Tingkat migrasi 15% adalah input kunci model ECL — dan KRI yang dipantau OJK.",
        "Migrasi yang melonjak dari 15% ke 25% berarti kualitas portofolio memburuk sebelum NPL bergerak. Inilah keunggulan PSAK 109: ia memaksa bank mengakui pemburukan saat terjadi, bukan saat debitur sudah gagal bayar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung tingkat migrasi per stage" },
        { id: "t2", text: "Jalankan dan pastikan ringkasannya tercetak" },
      ],
      expected: "Stage 1 -> 2: 120/1000 = 12.0%\nStage 1 -> 3: 30/1000 = 3.0%\nTotal migrasi: 15.0%",
      note: {
        title: "Migrasi ≠ NPL.",
        type: "pitfall",
        body: "“Migrasi 15%, berarti NPL 15%.” Migrasi ke Stage 2 bukan gagal bayar — ia peningkatan risiko signifikan. Menyamakan keduanya menggelembungkan NPL dan memicu kepanikan yang tidak perlu.",
      },
      hints: [
        "tingkat = jumlah / total_awal.",
        "Format: f\"{tingkat:.1%}\".",
      ],
      code: {
        starter: "# Migrasi dari Stage 1 (1000 debitur). JANGAN UBAH.\nawal = 1000\nke_s2 = 120\nke_s3 = 30\n\n# TULIS KODEMU: tingkat migrasi",
        lockLines: 4,
        solution: "# Migrasi dari Stage 1 (1000 debitur). JANGAN UBAH.\nawal = 1000\nke_s2 = 120\nke_s3 = 30\n\n# TULIS KODEMU: tingkat migrasi\nprint(f\"Stage 1 -> 2: {ke_s2}/{awal} = {ke_s2/awal:.1%}\")\nprint(f\"Stage 1 -> 3: {ke_s3}/{awal} = {ke_s3/awal:.1%}\")\nprint(f\"Total migrasi: {(ke_s2+ke_s3)/awal:.1%}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Migrasi ke S2", msg: "12%.", pattern: "Stage 1 -\> 2: 120/1000 = 12\.0%" },
          { kind: "stdout_matches", task: "t2", label: "Total migrasi", msg: "15%.", pattern: "Total migrasi: 15\.0%" }
        ],
      },
      reference: "Migrasi = KRI dini. Melonjak 15% → 25% = portofolio memburuk sebelum NPL bergerak.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Kuartal yang berat: ECL + CAR",
      prose: [
        "Data kuartal: 3 debitur lab (total ECL Rp39,18 M, naik dari Rp22 M kuartal lalu — kenaikan Rp17,18 M karena Tunas Bangsa jatuh ke Stage 2). Modal awal Rp1.600 M; laba kuartal sebelum ECL Rp80 M; setelah ECL tambahan: modal menjadi Rp1.600 + 80 − 17,18 = Rp1.662,82 M. RWA Rp8.950 M → CAR = 18,6%.",
        "Pertanyaan: (a) Jelaskan ke direksi kenapa laba turun Rp17,18 M padahal tidak ada gagal bayar baru. (b) Apakah CAR aman? (c) Apa early warning kuartal depan? Pembahasan: (a) Tebing staging: Tunas Bangsa SICR → PD lifetime 15% vs 12-month 2% — ECL naik Rp7,02 M hanya dari reklasifikasi; sisanya dari pertumbuhan eksposur. (b) CAR 18,6% aman (>8%), tetapi turun 0,7 pp dari 19,3% — tren yang harus dijelaskan. (c) Watchlist: 4 debitur DPD 25–29 hari dengan EAD total Rp300 M — jika jatuh ke Stage 2, ECL naik ±Rp15 M lagi. Rekomendasi: intensifkan koleksi 4 debitur itu bulan ini; biaya koleksi Rp200 juta vs ECL Rp15 M = 75x.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "ECL menyerang laba (pembilang CAR) tepat saat risiko naik (penyebut). Bank yang tidak memonitor watchlist SICR = bank yang terkejut dua kali: laba turun DAN CAR turun, di kuartal yang sama.",
      },
      reference: "Jelaskan tebing dengan angka; CAR dengan tren; watchlist dengan biaya vs ECL.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — staging adalah soal logika, bukan hafalan.",
      ],
      tasks: [],
      summary: [
        "ECL = PD×LGD×EAD; Stage 1 = PD 12-month, Stage 2/3 = PD lifetime.",
        "Tebing Stage 1→2: debitur sama, ECL bisa 12x lipat — monitor watchlist SICR.",
        "RWA = Σ EAD×bobot; CAR = Modal/RWA ≥ 8% (+buffer).",
        "ECL menggerus modal (pembilang), risiko menggelembungkan RWA (penyebut) — baca berpasangan.",
        "Laporan: regulator = RWA per kategori + rekonsiliasi; direksi = CAR + jarak + sensitivitas.",
      ],
      next: { label: "RR17 — BCBS 239: Risk Data Aggregation", href: "/v2/learn/rr17-bcbs239" },
      quiz: [
        {
          q: "PT Sinar Abadi Rp200 M pindah Stage 1→Stage 2 (PD 1,2%→12-month menjadi 15% lifetime, LGD 45%). ECL baru?",
          options: [
            { text: "Rp13,5 M", why: "Benar: 0,15×0,45×200 = 13,5. Naik 12,5x dari Rp1,08 M.", correct: true },
            { text: "Rp1,08 M", why: "Itu ECL Stage 1 (PD 12-month). Stage 2 memakai PD lifetime." },
            { text: "Rp90 M", why: "Itu jika PD 100% (Stage 3). Stage 2 belum gagal bayar." }
          ],
        },
        {
          q: "Mana pemicu SICR yang valid?",
          options: [
            { text: "DPD 35 hari + restrukturisasi", why: "Benar: dua pemicu standar PSAK 109.", correct: true },
            { text: "Laba bank turun kuartal ini", why: "Laba bank bukan pemicu SICR debitur." },
            { text: "Suku bunga BI naik", why: "Makro memengaruhi PD model, bukan pemicu SICR individual." }
          ],
        },
        {
          q: "RWA: KPR Rp2.000 M (bobot 35%) + SBN Rp4.000 M (bobot 0%). Kontribusi RWA?",
          options: [
            { text: "Rp700 M", why: "Benar: 2.000×0,35 + 4.000×0 = 700.", correct: true },
            { text: "Rp6.000 M", why: "Itu nominal, bukan tertimbang." },
            { text: "Rp2.700 M", why: "Bobot KPR 35% bukan 135%." }
          ],
        },
        {
          q: "CAR 17,9%, minimum 8%. Pernyataan tepat?",
          options: [
            { text: "Memenuhi, tetapi laporkan jarak + sensitivitas tebing", why: "Benar. Angka tanpa jarak & sensitivitas = setengah laporan.", correct: true },
            { text: "Aman, tidak perlu dibahas lagi", why: "Jebakan comfort: tebing staging bisa menggerus 1–2 pp dalam sekuartal." },
            { text: "Kurang, harus segera tambah modal", why: "17,9% >> 8%: memenuhi dengan buffer lebar." }
          ],
        },
        {
          q: "Fungsi watchlist SICR (DPD 25–29 hari)?",
          options: [
            { text: "Early warning: ECL pro-forma Stage 2 sebagai peringatan laba", why: "Benar. Watchlist = 'laporan laba masa depan'.", correct: true },
            { text: "Daftar debitur yang akan dihapus buku", why: "Bukan hapus buku — mereka masih membayar." },
            { text: "Syarat pengajuan kredit baru", why: "Tidak terkait origination." }
          ],
        }
      ],
      reference: "ECL = staging + PD×LGD×EAD. RWA = bobot × EAD. CAR ≥ 8%.",
    },
  ],
};
