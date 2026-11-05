import type { V2Lesson } from "../lib/types";

export const cr4b: V2Lesson = {
  slug: "cr4b-ifrs9-psak71",
  track: "Credit Risk",
  module: "Kinerja & Analisis Portofolio",
  title: "CR4B — IFRS 9 / PSAK 71: Cadangan Masa Depan",
  estMinutes: 45,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Laba yang menguap dalam semalam",
      prose: [
        "Akhir 2019, Bank Nusantara membukukan laba Rp 2,1 triliun — direksi tersenyum, bonus cair. Tiga bulan kemudian, pandemi. Tim risiko menjalankan ulang model ECL: ribuan debitur yang tadinya Stage 1 bermigrasi ke Stage 2 karena prospek ekonominya memburuk.",
        "Hasilnya: cadangan (CKPN) melonjak Rp 1,4 triliun dalam satu kuartal. Laba tahun berjalan langsung terpangkas dua pertiganya — padahal belum ada satu pun debitur yang benar-benar macet. Para direktur syok: \"Kok bisa rugi padahal belum ada yang gagal bayar?!\"",
        "Jawabannya: PSAK 71 (adopsi Indonesia dari IFRS 9, berlaku 1 Januari 2020). Cadangan tidak lagi menunggu kerugian terjadi — melainkan mencadangkan kerugian yang diperkirakan akan terjadi. Laba bank kini bergerak mengikuti ekspektasi masa depan, bukan cuma realisasi masa lalu.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Hafalkan rantai sebab-akibat ini: prakiraan PDB direvisi turun → PD forward-looking naik → SICR terpicu massal → migrasi Stage 1→2 → ECL melonjak 4–8× per kredit → laba kuartal anjlok. Satu revisi prakiraan ekonomi bisa menggerakkan laba bank ratusan miliar.",
      },
      reference: "PSAK 71 = IFRS 9 versi Indonesia, berlaku 1 Januari 2020.",
    },
    {
      id: "revolusi",
      eyebrow: "Langkah 2 · Revolusi",
      title: "Dari \"sudah rugi\" ke \"akan rugi\"",
      prose: [
        "Sebelum 2020 (PSAK 55, incurred loss): cadangan dibentuk setelah ada bukti objektif kerugian (telat bayar, bangkrut). Sejak 2020 (PSAK 71, expected credit loss): cadangan dibentuk berdasarkan ekspektasi kerugian masa depan — sebelum ada tunggakan. PSAK 55 seperti pemadam kebakaran — baru bergerak saat api terlihat. PSAK 71 seperti detektor asap — berbunyi saat mencium bau hangus. Detektor asap menyelamatkan lebih banyak rumah, tetapi juga lebih sering false alarm — dan tiap alarm berbayar mahal (cadangan naik, laba turun).",
        "Mengapa berubah? Krisis 2008 membuktikan incurred loss terlambat: bank-bank terlihat sehat sampai detik sebelum kolaps karena cadangannya baru dibentuk saat semuanya sudah terbakar. G20 memerintahkan perubahan global → IFRS 9 → PSAK 71.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"PSAK 71 hanya urusan akuntan — analis risiko tidak perlu paham.\" ECL = PD × LGD × EAD yang forward-looking — dan PD/LGD/EAD adalah makanan sehari-hari analis risiko (CR3, CR10–CR13). Di bank modern, tim risiko memasok modelnya, tim akuntansi mencatatnya.",
      },
      reference: "Incurred (PSAK 55): setelah bukti · Expected (PSAK 71): sebelum tunggakan.",
    },
    {
      id: "stage",
      eyebrow: "Langkah 3 · Stage",
      title: "Tiga stage: ruang rawat inap kredit",
      prose: [
        "PSAK 71 membagi setiap kredit ke 3 stage berdasarkan perubahan risiko sejak awal diberikan. Stage 1 — sehat: risiko tidak meningkat signifikan sejak origination. Cadangan = ECL 12 bulan (PD 12-bulan × LGD × EAD). Stage 2 — risiko meningkat signifikan (SICR): risiko naik signifikan TAPI belum default. Cadangan = ECL lifetime (PD selama sisa tenor × LGD × EAD) — melonjak berkali-kali lipat. Stage 3 — default/impaired: sudah gagal bayar (umumnya DPD >90 atau unlikely to pay). Cadangan = ECL lifetime dengan PD = 100%.",
        "Contoh: KPR Rp 500 jt, LGD 45%, PD 12-bulan 2%, PD lifetime (sisa tenor) 9%. Stage 1: ECL = 0,02 × 0,45 × 500 = Rp 4,5 jt. Stage 2: ECL = 0,09 × 0,45 × 500 = Rp 20,25 jt — naik 4,5× lipat hanya karena pindah stage! Stage 3: ECL = 1,0 × 0,45 × 500 = Rp 225 jt. Lompatannya tidak linear — inilah cliff effect: perpindahan stage menghantam laba sekaligus.",
        "SICR (Significant Increase in Credit Risk) = kriteria pindah Stage 1 → Stage 2. Kriteria kuantitatif: PD saat ini naik signifikan dibanding PD saat origination — praktik umum naik ≥2× lipat. Backstop 30 hari: DPD ≥ 30 hari otomatis dianggap SICR — jaring pengaman bila model PD telat merespons. SICR membandingkan risiko relatif terhadap awal, bukan absolut: kredit yang lahir berisiko (PD awal 8%) lalu membaik (PD kini 5%) = tetap Stage 1 meski levelnya masih di atas KPR prima.",
      ],
      formula: String.raw`\text{ECL} = \sum_{t} \frac{\text{PD}_t \times \text{LGD}_t \times \text{EAD}_t}{(1+r)^t} \quad \text{(berbobot skenario ekonomi)}`,
      formulaNote: "Stage 1 menjumlah 12 bulan; Stage 2/3 menjumlah seluruh sisa tenor, didiskonto dengan suku bunga r, dirata-ratakan atas skenario baseline/optimis/pesimis.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\"Stage 2 = kredit bermasalah / akan macet.\" Stage 2 = risiko meningkat signifikan, bukan macet. Banyak kredit Stage 2 yang akhirnya sembuh kembali ke Stage 1 (curing). Menyamakan Stage 2 dengan NPL seperti menyamakan \"demam\" dengan \"kritis\".",
      },
      reference: "Cliff effect: Stage 1→2 bisa melonjak 4–8× lipat per kredit.",
    },
    {
      id: "lab-sicr",
      eyebrow: "Langkah 4 · Lab SICR",
      title: "Mesin SICR: kapan pindah stage?",
      prose: [
        "Simulasikan logika staging bank. PD saat origination 1,5%, PD kini 4,0%, DPD 35 hari. Kriteria SICR (ilustrasi praktik umum): PD naik ≥2× lipat, ATAU DPD ≥30 hari. Tugasmu: hitung rasio kenaikan PD, tentukan apakah SICR terpicu, dan simpulkan stage-nya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `rasio` = pd_kini / pd_awal" },
        { id: "t2", text: "Tentukan `sicr` (boolean) dan `stage` (\"Stage 2\" jika SICR, \"Stage 1\" jika tidak)" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "rasio=2.7 sicr=True stage=Stage 2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Debitur DPD 35 hari tetapi model PD bilang risikonya turun → tetap Stage 2. Backstop 30 hari otomatis memicu SICR, tidak bisa di-override model. Model bisa salah atau lambat; DPD tidak berbohong.",
      },
      hints: [
        "Rasio = pembagian dua PD.",
        "SICR terpicu jika rasio ≥ 2.0 ATAU dpd ≥ 30.",
        "rasio = pd_kini / pd_awal; sicr = (rasio >= 2.0) or (dpd >= 30)",
      ],
      code: {
        starter: `pd_awal = 0.015   # PD saat kredit diberikan (origination)\npd_kini = 0.040   # PD saat ini (hasil monitoring)\ndpd = 35          # hari keterlambatan saat ini\n\n# TULIS KODEMU\nrasio = \nsicr = \nstage = \n\nprint(f"rasio={rasio:.1f} sicr={sicr} stage={stage}")`,
        lockLines: 3,
        solution: `pd_awal = 0.015   # PD saat kredit diberikan (origination)\npd_kini = 0.040   # PD saat ini (hasil monitoring)\ndpd = 35          # hari keterlambatan saat ini\n\n# TULIS KODEMU\nrasio = pd_kini / pd_awal\nsicr = (rasio >= 2.0) or (dpd >= 30)\nstage = "Stage 2" if sicr else "Stage 1"\n\nprint(f"rasio={rasio:.1f} sicr={sicr} stage={stage}")`,
        checks: [
          { kind: "equal", task: "t1", name: "rasio", value: 2.6667, tol: 0.01, label: "`rasio` sekitar 2.67", msg: "0.040 / 0.015 ≈ 2.67." },
          { kind: "equal", task: "t2", name: "stage", value: "Stage 2", label: "`stage` seharusnya Stage 2", msg: "Rasio ≥2× dan DPD ≥30 — dua-duanya memicu SICR." },
          { kind: "stdout_matches", task: "t3", pattern: "rasio=2\\.7\\s+sicr=True\\s+stage=Stage 2", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: pd_kini = 0.025 (naik 1,7×), dpd = 0 — masih Stage 1? Coba dpd = 35 dengan rasio 1,3×.",
    },
    {
      id: "lab-ecl",
      eyebrow: "Langkah 5 · Lab ECL",
      title: "Lompatan ECL antar stage",
      prose: [
        "Hitung sendiri cliff effect-nya. Kredit Rp 500 jt, LGD 45%, PD 12-bulan 2%, lifetime PD 9%. Tugasmu: hitung ECL Stage 1, Stage 2, Stage 3 (PD = 100%), dan rasio Stage 2 terhadap Stage 1.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ecl_s1` dan `ecl_s2`" },
        { id: "t2", text: "Hitung `ecl_s3` (PD = 1.0) dan `rasio` = ecl_s2 / ecl_s1" },
        { id: "t3", text: "Cetak semuanya dengan `print`" },
      ],
      expected: "s1=4.5 s2=20.25 s3=225.0 rasio=4.5",
      hints: [
        "ECL = PD × LGD × EAD untuk tiap stage.",
        "Stage 3 memakai PD = 1.0 (100%).",
        "ecl_s1 = pd_12m * lgd * ead",
      ],
      code: {
        starter: `ead = 500        # juta Rp\nlgd = 0.45\npd_12m = 0.02\nlifetime_pd = 0.09   # PD kumulatif selama sisa tenor\n\n# TULIS KODEMU\necl_s1 = \necl_s2 = \necl_s3 = \nrasio = \n\nprint(f"s1={ecl_s1:.1f} s2={ecl_s2:.2f} s3={ecl_s3:.1f} rasio={rasio:.1f}")`,
        lockLines: 4,
        solution: `ead = 500        # juta Rp\nlgd = 0.45\npd_12m = 0.02\nlifetime_pd = 0.09   # PD kumulatif selama sisa tenor\n\n# TULIS KODEMU\necl_s1 = pd_12m * lgd * ead\necl_s2 = lifetime_pd * lgd * ead\necl_s3 = 1.0 * lgd * ead\nrasio = ecl_s2 / ecl_s1\n\nprint(f"s1={ecl_s1:.1f} s2={ecl_s2:.2f} s3={ecl_s3:.1f} rasio={rasio:.1f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "ecl_s1", value: 4.5, tol: 1e-9, label: "`ecl_s1` seharusnya 4.5", msg: "0.02 × 0.45 × 500 = 4.5." },
          { kind: "equal", task: "t1", name: "ecl_s2", value: 20.25, tol: 1e-9, label: "`ecl_s2` seharusnya 20.25", msg: "0.09 × 0.45 × 500 = 20.25." },
          { kind: "equal", task: "t2", name: "ecl_s3", value: 225.0, tol: 1e-9, label: "`ecl_s3` seharusnya 225.0", msg: "1.0 × 0.45 × 500 = 225." },
          { kind: "equal", task: "t2", name: "rasio", value: 4.5, tol: 1e-9, label: "`rasio` seharusnya 4.5", msg: "20.25 / 4.5 = 4.5 — inilah cliff effect." },
          { kind: "stdout_matches", task: "t3", pattern: "s1=4\\.5\\s+s2=20\\.25\\s+s3=225\\.0\\s+rasio=4\\.5", label: "`print` menampilkan semuanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Coba: naikkan lifetime_pd jadi 0.15 — rasio Stage2/Stage1 membesar.",
    },
    {
      id: "procyclical",
      eyebrow: "Langkah 6 · Procyclical",
      title: "ECL memperdalam siklus",
      prose: [
        "PSAK 71 itu procyclical — ia memperdalam siklus. Saat ekonomi memburuk, PD forward-looking naik → ECL melonjak → laba anjlok → bank mengetatkan kredit → ekonomi makin memburuk. Saat ekonomi bagus, sebaliknya. Regulator sadar akan hal ini, tetapi belum ada obat sempurnanya. Analis yang paham procyclicality tidak panik saat ECL melonjak di awal resesi — ia tahu itu fitur akuntansi, bukan vonis.",
        "Dua hal yang diawasi ketat. Pertama, manipulasi staging: Stage 2 bank tidak pernah naik meski ekonomi resesi 2 tahun = red flag. Dalam resesi, sebagian portofolio pasti mengalami SICR. Stage 2 yang datar = indikasi ambang SICR terlalu longgar atau override manual — auditor dan OJK akan membongkar ini. Kedua, management overlay: saat model tidak menangkap risiko material (misal event unprecedented), manajemen boleh menambah cadangan — tetapi wajib ada dasar data, metodologi, persetujuan komite, dan masa berlaku. Overlay \"angka ajaib\" tanpa dasar = red flag.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ambang SICR sangat politis — menggesernya sedikit = menggeser laba ratusan miliar. Itulah mengapa kriteria SICR harus ditetapkan bank, dipertahankan ke auditor/OJK, dan diterapkan konsisten.",
      },
      reference: "Tren Stage 2 naik = sirene — cadangan melonjak meski NPL belum bergerak.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Migrasi massal ke Stage 2",
      prose: [
        "Kuartal II 2026, Bank Nusantara: porsi Stage 2 melonjak 6% → 11%. CKPN naik Rp 800 M, laba kuartal anjlok 40%. Direksi menuduh tim risiko \"modelnya terlalu pesimis\". Data investigasimu: 80% migrasi berasal dari satu segmen — KMK perdagangan (terpukul lesunya daya beli); PD model KMK naik rata-rata 2,8× (dipicu penurunan mutasi rekening + kenaikan SLIK kolek 2); tren ini konsisten 2 kuartal berturut-turut, bukan lonjakan sesaat; bank kompetitor dengan segmen serupa melaporkan migrasi Stage 2 yang sebanding.",
        "Pembahasan: staging-nya jujur. Bukti: (1) terkonsentrasi di segmen yang memang terpukul fundamental (bukan acak), (2) pemicu PD naik 2,8× — di atas ambang 2× yang ditetapkan bank sendiri, (3) konsisten 2 kuartal (bukan noise), (4) kompetitor mengalami hal serupa (bukan model ngawur sendiri).",
        "Tindakan: (1) pertahankan staging, jelaskan ke direksi dengan data — tunjukkan bahwa menahan migrasi = menunda bom (saat debitur benar-benar macet, Stage 3 menghantam lebih keras + teguran OJK/auditor); (2) aksi bisnis: perketat origination KMK perdagangan sementara + intensifkan monitoring debitur Stage 2 (restrukturisasi dini lebih murah daripada menunggu default — CR22).",
      ],
      tasks: [],
      reference: "Stage 2 adalah \"NPL-nya PSAK 71\": indikator awal sebelum kredit benar-benar macet.",
    },
    {
      id: "tebing-laba",
      eyebrow: "Langkah 8 · Tebing laba",
      title: "Anatomi Rp 240 M dalam satu kuartal",
      prose: [
        "Cliff effect menjadi nyata saat migrasi terjadi massal. Ilustrasi: portofolio Rp 5 T, 90% Stage 1 dengan ECL 12-bulan Rp 40 M. Resesi datang; 10% portofolio (Rp 500 M) mengalami SICR serentak dan pindah ke Stage 2 dengan ECL lifetime Rp 280 M. Kenaikan cadangan dalam SATU kuartal: Rp 240 M — setara menghapus setengah laba tahunan bank menengah. Dan NPL belum bergerak satu rupiah pun; yang bergerak hanya ekspektasi.",
        "Inilah sifat procyclical yang paling menyakitkan: migrasi bergerombol karena pemicunya sama (makro memburuk memukul banyak debitur sekaligus), sehingga tebingnya vertikal, bukan landai. Cara salah menghadapi ini: menunda pengakuan SICR agar laba kuartalan \"mulus\" — menggeser ambang, menahan override, menunggu DPD 30 hari. Itu earnings management; auditor dan OJK membacanya dari tren Stage 2 yang datar di tengah resesi, dan hukumannya lebih mahal daripada cadangannya.",
        "Cara benar: akui lebih awal, komunikasikan lebih jelas. Pasar menghukum kejutan, bukan provisi — bank yang menjelaskan \"Stage 2 naik 8pp karena skenario pesimis, ECL +Rp 240 M, ini ekspektasi bukan kerugian\" diperlakukan lebih baik daripada bank yang \"tiba-tiba\" restatement. Analis yang paham procyclicality menyiapkan narasi SEBELUM angka keluar, bukan sesudah.",
        "Aturan keputusan. Satu: monitor rasio Stage 2 mingguan saat indikator makro memburuk — jangan tunggu tutup kuartal untuk tahu tebingnya. Dua: siapkan penjelasan direksi dalam tiga kalimat: berapa yang migrasi, mengapa (pemicu), dan berapa dampak labanya. Tiga: di masa bagus, bangun buffer secara sadar (countercyclical thinking) — bukan karena akuntansi mewajibkan, melainkan karena tebing berikutnya pasti datang. Empat: tidak ada \"kebijakan\" yang boleh menunda fakta SICR; penundaan adalah manipulasi dengan nama lain.",
      ],
      tasks: [],
      reference: "Tebing ECL = migrasi massal × lompatan 4–8×. Akui awal, komunikasikan jelas.",
    },
    {
      id: "psak71-praktis",
      eyebrow: "Langkah 9 · Praktik",
      title: "PSAK 71 untuk bank kecil: jalan pintas yang sah",
      prose: [
        "Tidak semua bank butuh model satelit. Untuk BPR dan bank kecil dengan portofolio homogen, standar mengizinkan pendekatan sederhana: matriks provisi (provision matrix) — tarif kerugian per bucket DPD yang dikalibrasi dari sejarah sendiri, ditambah penyesuaian forward-looking yang sederhana. Sederhana bukan berarti asal; berarti proporsional dengan kompleksitas.",
        "Contoh dengan angka: BPR dengan kredit Rp 200 M. Lancar Rp 150 M × 1% = Rp 1,5 M; DPD 1–30 Rp 30 M × 5% = Rp 1,5 M; DPD 31–60 Rp 12 M × 15% = Rp 1,8 M; DPD 61–90 Rp 5 M × 40% = Rp 2 M; DPD 90+ Rp 3 M × 100% = Rp 3 M. ECL = Rp 11,8 M. Penyesuaian forward-looking: pengangguran regional naik 2 poin → overlay +20% = Rp 14,2 M, didokumentasikan satu paragraf (sumber data, alasan, masa berlaku). Selesai — patuh, sederhana, bisa dipertahankan.",
        "Cara salah: matriks yang tidak pernah diperbarui (\"tarif 2019 masih dipakai 2026\"), atau forward-looking yang diisi \"tidak ada perubahan\" tiap tahun tanpa analisis. Cara benar: kalibrasi ulang tarif tiap tahun dari realisasi sendiri, dan tulis penyesuaian forward-looking walau singkat — paragraf yang jujur mengalahkan model yang tidak ada.",
        "Aturan keputusan. Satu: sederhana ≠ statis — tarif matriks kedaluwarsa seperti model lainnya. Dua: segmentasikan minimal per produk (KUR vs umum vs karyawan) karena perilakunya beda. Tiga: simpan jejak realisasi vs tarif tiap tahun — itulah \"backtest\" versi bank kecil. Empat: saat bank tumbuh dan portofolio berdiversifikasi, rencanakan migrasi ke pendekatan model — matriks adalah jembatan, bukan tujuan akhir.",
      ],
      tasks: [],
      note: {
        title: "Intuisi: ECL memaksa berduka lebih awal",
        body: "Incurred loss (dulu) = menangis di pemakaman — cadangan dibentuk setelah kerugian terbukti. ECL (kini) = menangis saat diagnosis — cadangan dibentuk saat risiko tercium. Perubahan akuntansi ini terlihat teknis, tetapi perubahan perilakunya fundamental: biaya risiko kini dirasakan relationship manager SEJAK origination, bukan oleh tim remedial dua tahun kemudian. Ketika Stage 2 membuat deteriorasi dini mahal seketika (lompatan 4–8×), RM yang menyalurkan kredit marginal langsung \"membayar\" lewat ECL hari pertama — insentifnya selaras dengan risiko untuk pertama kalinya. Heuristik yang jarang disadari: ECL memindahkan harga risiko dari back-office ke front-office. Maka analis yang cerdas tidak hanya menghitung ECL untuk laporan — ia menggunakannya sebagai bahasa untuk bernegosiasi dengan bisnis: \"kredit ini menambah ECL Rp X di hari pertama; yakinkan aku imbal hasilnya sepadan.\" Akuntansi yang baik bukan pencatat yang pasif; ia adalah sistem insentif yang menyamar. Implikasinya untuk analis: jangan tunggu diminta menghitung ECL — hitung ECL hari pertama untuk setiap proposal kredit baru dan letakkan di samping proyeksi labanya. Proposal yang ECL-nya memakan separuh margin seharusnya tidak pernah sampai ke meja komite tanpa penjelasan. ECL yang dihitung di awal adalah rem; ECL yang dihitung di akhir hanyalah catatan kecelakaan.",
      },
      reference: "ECL = sistem insentif yang menyamar sebagai akuntansi.",
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
        "PSAK 55 = incurred (setelah bukti); PSAK 71 = expected (sebelum tunggakan), berlaku 1 Jan 2020.",
        "Stage 1: ECL 12 bulan · Stage 2: ECL lifetime (SICR) · Stage 3: ECL lifetime, PD 100%.",
        "SICR: PD naik ≥2× sejak origination, atau backstop DPD ≥30 hari. Yang diukur perubahan relatif, bukan level.",
        "Cliff effect: pindah Stage 1→2 melonjak 4–8× — ambang SICR sangat politis.",
        "ECL procyclical; waspadai manipulasi staging dan overlay tanpa dasar.",
      ],
      next: { label: "CR5 — Definisi Default", href: "/learn/cr5-definisi-default" },
      quiz: [
        {
          q: "Perbedaan fundamental PSAK 55 vs PSAK 71?",
          options: [
            { text: "PSAK 71 tarif pajaknya lebih tinggi", why: "Tidak ada hubungannya dengan tarif pajak." },
            { text: "PSAK 55: cadangan setelah ada bukti kerugian (incurred); PSAK 71: cadangan berdasarkan ekspektasi kerugian masa depan (expected)", why: "Incurred → expected. PSAK 71 mencadangkan SEBELUM tunggakan terjadi — detektor asap vs pemadam kebakaran.", correct: true },
            { text: "Tidak ada bedanya, hanya ganti nama", why: "Bedanya fundamental: kapan cadangan dibentuk." },
            { text: "PSAK 71 menghapus CKPN", why: "Justru CKPN menjadi lebih besar dan lebih awal." },
          ],
        },
        {
          q: "Kredit dengan PD awal 8% (saat lahir), PD kini 5%, DPD 0. Stage berapa?",
          options: [
            { text: "Stage 2 — PD 5% masih tinggi", why: "Level tinggi tidak cukup — SICR mengukur perubahan." },
            { text: "Stage 1 — risiko MENURUN dibanding awal; SICR mengukur perubahan relatif, bukan level", why: "PD turun 8%→5% = membaik, meski levelnya masih di atas KPR prima. Jebakan klasik!", correct: true },
            { text: "Stage 3", why: "Stage 3 butuh default — DPD 0, jauh dari itu." },
            { text: "Tidak bisa ditentukan", why: "Bisa: tidak ada SICR (risiko menurun) dan tidak default." },
          ],
        },
        {
          q: "Debitur DPD 35 hari, tapi model PD bilang risikonya turun. Stage berapa?",
          options: [
            { text: "Stage 1 — ikuti model", why: "Backstop regulator mengalahkan model." },
            { text: "Stage 2 — backstop 30 hari otomatis memicu SICR, tidak bisa di-override model", why: "Backstop 30 hari adalah jaring pengaman regulator — berlaku apapun kata model. DPD tidak berbohong.", correct: true },
            { text: "Stage 3", why: "Stage 3 butuh DPD >90 atau unlikely to pay." },
            { text: "Tergantung direksi", why: "Staging mengikuti kriteria yang ditetapkan, bukan selera direksi." },
          ],
        },
        {
          q: "Ekonomi memasuki resesi. Apa yang terjadi pada ECL dan mengapa disebut procyclical?",
          options: [
            { text: "ECL turun — resesi membuat bank lebih hati-hati", why: "Kehati-hatian tidak menurunkan ECL akuntansi." },
            { text: "ECL melonjak (PD forward-looking naik, SICR massal) tepat saat laba tertekan — memperdalam siklus, itulah procyclicality", why: "ECL forward-looking naik saat prakiraan memburuk — menghantam laba di momen terburuk.", correct: true },
            { text: "ECL tidak berubah — akuntansi tidak peduli ekonomi", why: "Justru PSAK 71 membuat akuntansi peduli pada prakiraan ekonomi." },
            { text: "ECL dihapus selama resesi", why: "Tidak ada penghapusan seperti itu." },
          ],
        },
        {
          q: "Kapan management overlay dibenarkan, dan apa syaratnya?",
          options: [
            { text: "Kapan saja — manajemen bebas menambah cadangan sesuai feeling", why: "Feeling tanpa dasar = red flag auditor." },
            { text: "Saat model tidak menangkap risiko material; wajib ada dasar data, metodologi, persetujuan komite, dan masa berlaku", why: "Overlay legal untuk risiko yang luput dari model, tetapi harus metodologis dan di-governance.", correct: true },
            { text: "Tidak pernah — overlay dilarang PSAK 71", why: "Overlay tidak dilarang — yang dilarang adalah overlay tanpa dasar." },
            { text: "Hanya saat laba sedang tinggi (income smoothing)", why: "Itu manipulasi laba, bukan overlay yang dibenarkan." },
          ],
        },
      ],
    },
  ],
};
