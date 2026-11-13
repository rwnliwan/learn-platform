import type { V2Lesson } from "../lib/types";

export const bi23: V2Lesson = {
  slug: "bi23-pharmacogenomics",
  track: "Bioinformatika",
  module: "Genomik Klinis",
  title: "BI23 · Pharmacogenomics: Resep Obat dari DNA",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "Dosis yang benar, pasien yang salah",
      prose: [
        "Seorang anak menjalani operasi amandel — prosedur rutin. Dokter meresepkan kodein untuk nyeri pasca-operasi, dosis tepat sesuai brosur. Beberapa hari kemudian anak itu keracunan opioid: napas melambat, nyaris tidak tertolong.",
        "Investigasi menemukan penyebabnya bukan overdosis. Anak itu adalah CYP2D6 ultrarapid metabolizer — enzim hatinya mengubah kodein (prodrug) menjadi morfin jauh lebih cepat dari normal. Dosis 'benar' di brosur menjadi racun di tubuhnya. FDA akhirnya melarang kodein untuk anak pasca-tonsilektomi (2017).",
        "Twist-nya: kesalahan bukan di dosis, bukan di diagnosis — melainkan di asumsi bahwa semua tubuh memproses obat dengan cara sama. Pharmacogenomics (PGx) menghapus asumsi itu: resep ditulis dari DNA. Lesson ini mengajarkan bahasa PGx klinis: star allele, guideline CPIC, dan pipeline PharmCAT.",
        "Dua bekal yang kamu bawa: dari BI8, variant calling menghasilkan genotipe tiap pasien (inilah bahan mentah PGx — bukan sekuens mentah, melainkan varian yang sudah dipanggil). Dari BI12, frekuensi alel berbeda antar populasi — alasan kenapa panel PGx harus mencakup varian seperti NUDT15 yang penting di Asia tapi jarang di Eropa.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan mekanisme kodein → morfin pada ultrarapid metabolizer" },
        { id: "t2", text: "Jelaskan kenapa 'dosis sesuai brosur' bisa gagal total" },
      ],
      note: {
        title: "🚨 Mitos: PGx = tes DNA untuk tahu obat yang 'cocok'",
        type: "pitfall",
        body: "Yang benar: PGx tidak meramal obat 'terbaik' — ia memprediksi metabolisme dan risiko efek samping untuk obat SPESIFIK berdasarkan gen SPESIFIK. Hasil 'CYP2D6 normal metabolizer' tidak berarti semua obat aman; ia hanya berarti kodein/tamoxifen diproses normal. Klaim 'obat yang cocok untuk DNA-mu' ala iklan adalah penyederhanaan yang berbahaya.",
      },
      reference: "Obat yang sama, tubuh berbeda, nasib berbeda. PGx = resep dari genotipe.",
    },
    {
      id: "tujuan",
      eyebrow: "Langkah 2 · Tujuan & peta",
      title: "Yang bisa kamu lakukan setelah lesson ini",
      prose: [
        "1. Membaca nomenklatur star allele (*1, *2, *17) dan menjelaskan apa yang dikodekan tiap simbol.",
        "2. Menerjemahkan diplotipe → fenotipe metabolizer (poor/intermediate/normal/rapid/ultrarapid) memakai aturan CPIC.",
        "3. Menerapkan guideline CPIC pada pasangan obat-gen nyata (klopidogrel, kodein, tiopurin, karbamazepin).",
        "4. Menjelaskan pipeline PharmCAT: dari VCF ke laporan rekomendasi dalam 2 fase.",
        "5. Menyebutkan batas PGx: phenoconversion, bias ancestri, dan bedanya dengan prediksi ML umum (ranah HD12).",
        "Peta lesson: (3) Bahasa star allele · (4) CPIC: 29 guideline · (5) Lab 1: Named Allele Matcher mini · (6) Lab 2: kalkulator activity score · (7) Batas & jebakan · (8) Peta keputusan · (9) Mini-case: panel pre-emptif · (10) Checkpoint.",
      ],
      tasks: [
        { id: "t1", text: "Tulis ulang 5 tujuan di atas dengan kata-katamu sendiri" },
      ],
      reference: "5 tujuan: baca *alel → diplotipe→fenotipe → pakai CPIC → pahami PharmCAT → tahu batas.",
    },
    {
      id: "star",
      eyebrow: "Langkah 3 · Konsep inti 1",
      title: "Star allele: bahasa haplotipe PGx",
      prose: [
        "Definisi. Star allele adalah nama untuk satu haplotipe (kombinasi varian pada satu kromosom) gen farmakogenomik, ditulis *N: *1 = alel referensi (fungsi normal), *2, *3, … = haplotipe varian. Otoritas resminya PharmVar (pharmvar.org); basis data alel CYP lama dipensiunkan 2017.",
        "Kepribadian. Bayangkan tiap gen punya 'edisi': *1 edisi standar pabrik, *2 edisi cacat produksi (no function), *17 edisi turbo (increased function). Dua edisi yang kamu warisi (satu dari tiap orang tua) = diplotipe, mis. *1/*2.",
        "Tiap star allele punya nilai fungsi: no function = 0, decreased = 0,5, normal = 1 (CYP2D6; skala CPIC). Skor aktivitas = jumlah kedua alel, lalu dipetakan ke fenotipe: 0 → poor, 0,5–1 → intermediate, 1,5–2 → normal, >2 → ultrarapid metabolizer.",
        "Contoh konkret CYP2C19 (jalur klopidogrel): *2 (varian rs4244285) = no function; *17 (rs12248560) = increased function. Diplotipe *2/*2 → poor metabolizer: klopidogrel (prodrug) tidak diaktivasi → stent bisa tersumbat. Diplotipe *1/*17 → rapid: aktivasi lebih cepat.",
        "💡 Intuisi kunci: star allele mengompres puluhan varian menjadi SATU label haplotipe yang bisa dihitung. Tanpa ini, tiap lab melaporkan 'rs4244285 A/A' dengan bahasa sendiri dan dokter tidak bisa memakai guideline apa pun. Nomenklatur adalah infrastruktur klinis.",
      ],
      formula: String.raw`\text{Activity Score} = v(\text{alel}_1) + v(\text{alel}_2)`,
      formulaNote: "v = nilai fungsi alel (CYP2D6, skala CPIC): *1 = 1 (normal), alel decreased = 0,5, no function = 0, duplikasi fungsional = 2. Contoh: *1/*4 → 1 + 0 = 1 → intermediate metabolizer. Interpretasi: skor ini jembatan kuantitatif dari genotipe ke fenotipe — bukan ramalan nasib, melainkan estimasi kapasitas enzim.",
      tasks: [
        { id: "t1", text: "Hitung activity score & fenotipe: CYP2D6 *4/*4, *1/*1, *1/*1xN (duplikasi)" },
        { id: "t2", text: "Jelaskan kenapa *1 disebut alel referensi, bukan alel 'terbaik'" },
      ],
      reference: "*N = haplotipe. Diplotipe → skor aktivitas → fenotipe metabolizer.",
    },
    {
      id: "cpic",
      eyebrow: "Langkah 4 · Konsep inti 2",
      title: "CPIC: 29 guideline, satu pertanyaan",
      prose: [
        "CPIC (Clinical Pharmacogenetics Implementation Consortium, cpicpgx.org) menerbitkan 29 guideline (per 15 Oktober 2026) yang menjawab SATU pertanyaan: hasil genotipe SUDAH ada di tangan — apa yang harus dilakukan dengan resepnya? CPIC sengaja tidak menjawab 'apakah perlu tes' — itu ranah regulator dan penjamin.",
        "Tiap guideline: (1) cara menetapkan fenotipe dari genotipe, (2) rekomendasi peresepan per fenotipe dengan kekuatan rekomendasi, (3) level bukti A/B/C/D untuk tiap pasangan gen-obat. Semua gratis, peer-reviewed, dan dimutakhirkan berkala.",
        "Pasangan andalan yang wajib hafal polanya: CYP2C19–klopidogrel (poor/intermediate → hindari, ganti prasugrel/tikagrelor); CYP2D6–kodein/tramadol (ultrarapid → hindari; poor → tak mempan); CYP2D6–tamoxifen (poor → aktivasi endoksifen rendah); TPMT/NUDT15–tiopurin (poor → mielosupresi fatal, turunkan dosis drastis atau hindari; NUDT15 krusial di populasi Asia); HLA-B*15:02–karbamazepin (positif → kontraindikasi: risiko Stevens-Johnson); HLA-B*57:01–abakavir (positif → kontraindikasi: hipersensitivitas); SLCO1B1–simvastatin (fungsi menurun → risiko miopati); DPYD–fluoropirimidin (poor → toksisitas parah); CYP2C9/VKORC1–warfarin (dosis awal disesuaikan).",
        "Cara membaca chart: sumbu X = gen, tinggi batang = jumlah guideline CPIC yang menyebut gen itu (dari 29 guideline). CYP2D6 memimpin (7 guideline) — ia memetabolisme ~25% obat resep; CYP2C19 (5), CYP2C9 & HLA-B (4).",
        "Interpretasi: PGx klinis dikuasai segelintir gen sitokrom — bukan ratusan gen. Menguasai 5 gen teratas + HLA berarti menguasai >80% keputusan PGx sehari-hari.",
        "💡 Intuisi kunci: CPIC adalah 'if hasil = X then resep = Y' — logika yang bisa dikodekan. Itulah kenapa pipeline otomatis seperti PharmCAT mungkin: guideline-nya deterministik, bukan opini.",
      ],
      echart: {
        option: {
          title: { text: "Guideline CPIC per gen (29 guideline, cpicpgx.org)" },
          tooltip: { trigger: "axis" },
          xAxis: { type: "category", data: ["CYP2D6", "CYP2C19", "CYP2C9", "HLA-B", "CYP2B6", "CYP3A5", "TPMT", "DPYD"] },
          yAxis: { type: "value", name: "jumlah guideline" },
          series: [
            { type: "bar", data: [7, 5, 4, 4, 3, 2, 1, 1] },
          ],
        },
        caption: "Dihitung manual dari tabel guideline cpicpgx.org (diakses 15 Okt 2026). CYP2D6 memimpin — cerminan perannya memetabolisme ~25% obat resep.",
      },
      tasks: [
        { id: "t1", text: "Jelaskan perbedaan pertanyaan CPIC vs pertanyaan 'apakah perlu tes genetik'" },
        { id: "t2", text: "Pasien HLA-B*15:02 positif butuh karbamazepin — apa keputusanmu menurut CPIC?" },
      ],
      note: {
        title: "Intuisi: PGx adalah aturan klinis, bukan ramalan genetik",
        body: "Praktisi pharmacogenomics menyimpan lima heuristik. Satu: CPIC menjawab “hasil genotipe SUDAH ada — resepnya apa?”, bukan “apakah perlu tes?” — jangan tunda terapi menunggu hasil bila obatnya dibutuhkan sekarang; guideline memandu hasil yang ada, bukan memblokir terapi. Dua: sebelum percaya label metabolizer, rekonsiliasi daftar obat — phenoconversion itu nyata: inhibitor CYP2D6 kuat (mis. paroxetine) mengubah genotipe normal menjadi fenotipe poor; yang menang adalah obat lain, bukan DNA. Tiga: tanyakan varian APA yang diuji, bukan hanya apa hasilnya — panel yang hanya mencakup varian Eropa akan melewatkan NUDT15 (krusial untuk tiopurin di Asia) dan memberi false reassurance “normal metabolizer”. Empat: hafalkan dua arah bahaya prodrug — ultrarapid + prodrug (kodein → morfin berlebihan) = toksisitas; poor + prodrug (klopidogrel tak teraktivasi) = terapi gagal; keduanya mematikan dengan cara berlawanan. Lima: genotipe bukan takdir — kepatuhan minum obat, fungsi ginjal/hati, dan usia sering lebih menentukan daripada genotipe; PGx adalah satu variabel dalam persamaan klinis, bukan vonis. Heuristik gabungannya: label PGx yang bisa dipakai adalah yang lolos tiga saringan — varian kausalnya diuji, populasinya cocok, dan tidak ada phenoconversion dari obat lain.",
      },
      reference: "CPIC = 'hasil sudah ada → resep apa'. 29 guideline; 5 gen teratas ≈ 80% keputusan.",
    },

    {
      id: "lab-pharmcat",
      eyebrow: "Langkah 5 · Lab",
      title: "Named Allele Matcher mini: VCF → rekomendasi",
      prose: [
        "PharmCAT bekerja dalam 2 fase: (1) Named Allele Matcher — mencocokkan varian di VCF ke tabel definisi alel CPIC/PharmVar lalu menetapkan diplotipe (star allele); (2) pelaporan — diplotipe dipetakan ke fenotipe lalu ke rekomendasi CPIC/DPWG/label FDA. Kamu membangun versi mininya untuk CYP2C19 → klopidogrel.",
        "Data SINTETIS: 3 pasien dengan haplotipe ter-phase pada dua lokus penentu: rs4244285 (G>A → *2, no function) dan rs12248560 (C>T → *17, increased function). Tanpa varian itu → *1. Catatan jujur: CYP2C19 asli punya puluhan alel; lab ini memakai dua yang paling actionable — PharmCAT asli memakai tabel definisi lengkap.",
        "Tugas: (t1) `panggil_alel` — haplotipe → star allele; (t2) `fenotipe` — diplotipe → kategori metabolizer; (t3) `rekomendasi_klopidogrel` + cetak laporan tiga pasien.",
        "Coba: tambahkan pasien P4 dengan haplotipe (*17, *17) — fenotipe dan rekomendasinya apa? Lalu renungkan: kenapa ultrarapid TIDAK perlu penyesuaian dosis klopidogrel menurut CPIC?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `panggil_alel(hap)`" },
        { id: "t2", text: "Lengkapi `fenotipe(diplotipe)`" },
        { id: "t3", text: "Lengkapi `rekomendasi_klopidogrel` dan cetak laporan" },
      ],
      expected: "P1 *1/*1 normal → standar · P2 *1/*2 intermediate → hindari · P3 *2/*2 poor → hindari",
      hints: [
        "panggil_alel: cek rs4244285=='A' dulu → '*2'; lalu rs12248560=='T' → '*17'.",
        "fenotipe: ('*2','*2')→Poor; ('*1','*2') atau ('*17','*2')→Intermediate; ('*1','*1')→Normal.",
        "rekomendasi: Poor/Intermediate → hindari klopidogrel.",
      ],
      code: {
        starter: `# DATA SINTETIS: haplotipe CYP2C19 ter-phase (2 lokus penentu)\nPASIEN = {\n    'P1': [{'rs4244285': 'G', 'rs12248560': 'C'},\n           {'rs4244285': 'G', 'rs12248560': 'C'}],\n    'P2': [{'rs4244285': 'G', 'rs12248560': 'C'},\n           {'rs4244285': 'A', 'rs12248560': 'C'}],\n    'P3': [{'rs4244285': 'A', 'rs12248560': 'C'},\n           {'rs4244285': 'A', 'rs12248560': 'C'}],\n}\n\ndef panggil_alel(hap):\n    # TULIS KODEMU: haplotipe -> '*1' / '*2' / '*17'\n    if :\n        return '*2'\n    if :\n        return '*17'\n    return '*1'\n\ndef fenotipe(d):\n    # TULIS KODEMU: diplotipe (tuple terurut) -> kategori metabolizer\n    if :\n        return 'Poor Metabolizer'\n    if :\n        return 'Intermediate Metabolizer'\n    if :\n        return 'Normal Metabolizer'\n    return 'tak-terdefinisi'\n\ndef rekomendasi_klopidogrel(feno):\n    # TULIS KODEMU: fenotipe -> rekomendasi CPIC\n    if :\n        return 'HINDARI klopidogrel; ganti prasugrel/tikagrelor (bila tak ada kontraindikasi)'\n    return 'klopidogrel dosis standar'\n\nprint('LAPORAN PGx (CYP2C19 -> klopidogrel):')\nfor pid, haps in PASIEN.items():\n    alel = tuple(sorted(panggil_alel(h) for h in haps))\n    feno = fenotipe(alel)\n    print(f'  {pid}: {alel[0]}/{alel[1]} -> {feno} -> {rekomendasi_klopidogrel(feno)}')`,
        lockLines: 11,
        solution: `# DATA SINTETIS: haplotipe CYP2C19 ter-phase (2 lokus penentu)\nPASIEN = {\n    'P1': [{'rs4244285': 'G', 'rs12248560': 'C'},\n           {'rs4244285': 'G', 'rs12248560': 'C'}],\n    'P2': [{'rs4244285': 'G', 'rs12248560': 'C'},\n           {'rs4244285': 'A', 'rs12248560': 'C'}],\n    'P3': [{'rs4244285': 'A', 'rs12248560': 'C'},\n           {'rs4244285': 'A', 'rs12248560': 'C'}],\n}\n\ndef panggil_alel(hap):\n    # haplotipe -> star allele\n    if hap['rs4244285'] == 'A':\n        return '*2'\n    if hap['rs12248560'] == 'T':\n        return '*17'\n    return '*1'\n\ndef fenotipe(d):\n    # diplotipe (tuple terurut) -> kategori metabolizer\n    if d == ('*2', '*2'):\n        return 'Poor Metabolizer'\n    if d in (('*1', '*2'), ('*17', '*2')):\n        return 'Intermediate Metabolizer'\n    if d == ('*1', '*1'):\n        return 'Normal Metabolizer'\n    return 'tak-terdefinisi'\n\ndef rekomendasi_klopidogrel(feno):\n    # fenotipe -> rekomendasi CPIC\n    if feno in ('Poor Metabolizer', 'Intermediate Metabolizer'):\n        return 'HINDARI klopidogrel; ganti prasugrel/tikagrelor (bila tak ada kontraindikasi)'\n    return 'klopidogrel dosis standar'\n\nprint('LAPORAN PGx (CYP2C19 -> klopidogrel):')\nfor pid, haps in PASIEN.items():\n    alel = tuple(sorted(panggil_alel(h) for h in haps))\n    feno = fenotipe(alel)\n    print(f'  {pid}: {alel[0]}/{alel[1]} -> {feno} -> {rekomendasi_klopidogrel(feno)}')`,
        checks: [
          { kind: "stdout_matches", task: "t3", pattern: "P1: \\*1/\\*1 -> Normal Metabolizer -> klopidogrel dosis standar", label: "P1 normal → dosis standar", msg: "P1 (G/G, C/C) harus *1/*1 → Normal → standar." },
          { kind: "stdout_matches", task: "t3", pattern: "P2: \\*1/\\*2 -> Intermediate Metabolizer -> HINDARI klopidogrel", label: "P2 intermediate → hindari", msg: "P2 membawa satu *2 → Intermediate → hindari klopidogrel." },
          { kind: "stdout_matches", task: "t3", pattern: "P3: \\*2/\\*2 -> Poor Metabolizer -> HINDARI klopidogrel", label: "P3 poor → hindari", msg: "P3 *2/*2 → Poor → hindari klopidogrel." },
        ],
      },
      reference: "PharmCAT = VCF → star allele → fenotipe → rekomendasi. Lab ini fase 1+2 versi mini.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 6 · Lab 2/2",
      title: "Kalkulator activity score CYP2D6",
      prose: [
        "Star allele hanyalah label — keputusan klinis butuh ANGKA. Activity score (CPIC, untuk CYP2D6): tiap alel punya nilai fungsi (*1 = 1; decreased mis. *10 = 0,5; no function mis. *4 = 0; duplikasi *1xN = 2), skor = jumlah keduanya, lalu petakan: 0 → poor; 0,5–1 → intermediate; 1,5–2 → normal; >2 → ultrarapid.",
        "Data SINTETIS (nilai disederhanakan): 4 pasien dengan diplotipe berbeda. Lengkapi `fenotipe_as`, cetak skor tiap pasien, dan jawab: pasien mana yang harus dihindari dari kodein?",
        "Coba: tambahkan pasien E = ('*4', '*10') — skor dan fenotipenya apa? Lalu bandingkan dengan lab sebelumnya: kenapa CYP2C19 memakai kategori langsung, sedangkan CYP2D6 memakai skor dulu?",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi `fenotipe_as(skor)` sesuai ambang CPIC" },
        { id: "t2", text: "Cetak skor 4 pasien; tentukan siapa hindari kodein" },
      ],
      expected: "A 1,0 intermediate · B 0,0 poor · C 3,0 ultrarapid · D 1,0 intermediate",
      hints: [
        "skor == 0 → 'Poor Metabolizer'.",
        "0 < skor <= 1 → 'Intermediate Metabolizer'; 1 < skor <= 2 → 'Normal Metabolizer'.",
        "skor > 2 → 'Ultrarapid Metabolizer'.",
      ],
      code: {
        starter: `# NILAI FUNGSI ALEL CYP2D6 (skala CPIC, disederhanakan)\nNILAI = {'*1': 1.0, '*2': 1.0, '*4': 0.0, '*10': 0.5, '*1xN': 2.0}\nPASIEN = {'A': ('*1', '*4'), 'B': ('*4', '*4'), 'C': ('*1', '*1xN'), 'D': ('*10', '*10')}\n\ndef fenotipe_as(skor):\n    # TULIS KODEMU: skor -> kategori metabolizer (ambang CPIC)\n    if :\n        return 'Poor Metabolizer'\n    if :\n        return 'Intermediate Metabolizer'\n    if :\n        return 'Normal Metabolizer'\n    return 'Ultrarapid Metabolizer'\n\nprint('Skor aktivitas CYP2D6:')\nfor pid, (a1, a2) in PASIEN.items():\n    sk = NILAI[a1] + NILAI[a2]\n    print(f'  {pid} {a1}/{a2}: AS = {sk:.1f} -> {fenotipe_as(sk)}')\nprint('hindari kodein: poor (tak mempan) & ultrarapid (toksik)')`,
        lockLines: 5,
        solution: `# NILAI FUNGSI ALEL CYP2D6 (skala CPIC, disederhanakan)\nNILAI = {'*1': 1.0, '*2': 1.0, '*4': 0.0, '*10': 0.5, '*1xN': 2.0}\nPASIEN = {'A': ('*1', '*4'), 'B': ('*4', '*4'), 'C': ('*1', '*1xN'), 'D': ('*10', '*10')}\n\ndef fenotipe_as(skor):\n    # skor -> kategori metabolizer (ambang CPIC)\n    if skor == 0:\n        return 'Poor Metabolizer'\n    if skor <= 1:\n        return 'Intermediate Metabolizer'\n    if skor <= 2:\n        return 'Normal Metabolizer'\n    return 'Ultrarapid Metabolizer'\n\nprint('Skor aktivitas CYP2D6:')\nfor pid, (a1, a2) in PASIEN.items():\n    sk = NILAI[a1] + NILAI[a2]\n    print(f'  {pid} {a1}/{a2}: AS = {sk:.1f} -> {fenotipe_as(sk)}')\nprint('hindari kodein: poor (tak mempan) & ultrarapid (toksik)')`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "A \\*1/\\*4: AS = 1\\.0 -> Intermediate Metabolizer", label: "A intermediate (AS=1,0)", msg: "A: 1.0+0.0=1.0 → Intermediate (ambang: 0<skor≤1)." },
          { kind: "stdout_matches", task: "t2", pattern: "B \\*4/\\*4: AS = 0\\.0 -> Poor Metabolizer", label: "B poor (AS=0,0)", msg: "B: 0.0+0.0=0.0 → Poor." },
          { kind: "stdout_matches", task: "t2", pattern: "C \\*1/\\*1xN: AS = 3\\.0 -> Ultrarapid Metabolizer", label: "C ultrarapid (AS=3,0)", msg: "C: 1.0+2.0=3.0 → Ultrarapid (skor>2)." },
        ],
      },
      reference: "Activity score = jembatan angka genotipe → fenotipe. Ambang CPIC menentukan aksi.",
    },
    {
      id: "batas",
      eyebrow: "Langkah 7 · Batas & jebakan",
      title: "Yang tidak dikatakan genotipemu",
      prose: [
        "Jebakan 1 — Phenoconversion. Genotipe normal metabolizer bisa menjadi poor secara FENOTIPE bila pasien minum inhibitor enzim kuat (mis. paroxetine menghambat CYP2D6). Genotipe berkata 'normal', obat lain berkata 'poor' — yang menang adalah obat lain. Selalu rekonsiliasi daftar obat sebelum percaya label PGx.",
        "Jebakan 2 — Bias ancestri. Panel yang hanya menguji varian Eropa akan melewatkan NUDT15 (penting untuk tiopurin di Asia) atau CYP2C19*3 (Asia). 'Normal metabolizer' dari panel yang salah = false reassurance. Tanyakan: varian apa yang DIUJI, bukan hanya apa hasilnya.",
        "Jebakan 3 — Genotipe ≠ takdir. Kepatuhan minum obat, fungsi ginjal/hati, umur, dan interaksi obat sering lebih menentukan dari genotipe. PGx adalah satu variabel dalam persamaan klinis, bukan vonis.",
        "Batas ranah (vs HD12). Pharmacogenomics klinis memakai ATURAN deterministik dari bukti (CPIC: if genotipe = X then resep = Y) — bukan model machine learning yang perlu divalidasi performanya seperti di HD12. Keduanya bertemu di clinical decision support RS, tapi logikanya berbeda: guideline vs prediksi. Jangan mencampuradukkan 'model PGx' (aturan) dengan 'model prediktif' (ML).",
        "💡 Intuisi kunci: sebelum percaya label PGx, tanyakan tiga hal — (1) apakah varian KAUSALNYA yang diuji (bukan proxy)? (2) apakah populasinya cocok (frekuensi alel ancestri)? (3) adakah phenoconversion dari obat lain? Tiga 'ya' = label bisa dipakai.",
      ],
      tasks: [
        { id: "t1", text: "Jelaskan phenoconversion dengan contoh CYP2D6 + paroxetine" },
        { id: "t2", text: "Jelaskan beda 'aturan CPIC' vs 'model ML' dalam konteks HD12" },
      ],
      note: {
        title: "🚨 Mitos: hasil PGx normal = semua obat aman",
        type: "pitfall",
        body: "Yang benar: 'normal metabolizer' hanya berlaku untuk pasangan gen-obat yang diuji. CYP2D6 normal tidak mengatakan apa-apa tentang CYP2C19, tentang alergi obat, atau tentang dosis obat yang tidak dimetabolisme CYP2D6. Label PGx selalu berpasangan dengan gen dan obat spesifik — tidak pernah umum.",
      },
      reference: "Tiga jebakan: phenoconversion · bias ancestri · genotipe ≠ takdir. CPIC = aturan, bukan ML.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Kapan PGx mengubah resep",
      prose: [
        "Skenario 1 — Pasien akan dipasang stent, hasil CYP2C19 sudah ada → pakai guideline klopidogrel. Alasan: poor/intermediate = risiko trombosis stent; keputusan ada sebelum obat pertama diminum.",
        "Skenario 2 — Anak butuh analgesik pasca-operasi, CYP2D6 ultrarapid → hindari kodein/tramadol. Alasan: prodrug → morfin berlebihan. Pilih analgesik non-opioid atau non-prodrug.",
        "Skenario 3 — Hasil PGx belum ada, obat risiko rendah, pasien butuh terapi SEKARANG → jangan tunda menunggu tes. Alasan: CPIC bukan skrining wajib; ia memandu hasil yang sudah ada, bukan memblokir terapi.",
        "Skenario 4 — Genotipe normal tapi respons aneh (tak mempan / toksik) → curigai phenoconversion & interaksi obat, bukan 'tesnya salah'. Alasan: fenotipe aktual = genotipe × obat lain × organ.",
        "Aturan praktis 10 detik: (1) Hasil SUDAH ada? → buka CPIC. Belum? → jangan tunda terapi. (2) Poor/intermediate + prodrug → hindari/ganti. (3) HLA positif + karbamazepin/abakavir → kontraindikasi, tanpa kecuali. (4) Selalu cek interaksi obat (phenoconversion) sebelum final.",
      ],
      tasks: [
        { id: "t1", text: "Pasien *1/*1 CYP2C19 akan dipasang stent — keputusan resep?" },
        { id: "t2", text: "Pasien poor metabolizer TPMT butuh azathioprine — keputusan?" },
      ],
      echart: {
        option: {
          title: { text: "Pohon keputusan CYP2C19 → klopidogrel (CPIC)" },
          tooltip: { trigger: "item" },
          series: [
            {
              type: "tree",
              data: [
                {
                  name: "Hasil CYP2C19",
                  children: [
                    {
                      name: "Poor / Intermediate",
                      children: [
                        { name: "HINDARI klopidogrel" },
                        { name: "Prasugrel / tikagrelor\n(cek kontraindikasi)" },
                      ],
                    },
                    {
                      name: "Normal / Rapid / Ultrarapid",
                      children: [{ name: "Klopidogrel dosis standar" }],
                    },
                  ],
                },
              ],
              top: "12%",
              bottom: "12%",
              layout: "orthogonal",
              orient: "LR",
              symbolSize: 7,
            },
          ],
        },
        caption: "Cara membaca: mulai dari hasil genotipe (kiri), ikuti cabang fenotipe → aksi resep (kanan). Pohon ini adalah CPIC yang 'dikodekan' — persis logika yang dijalankan PharmCAT.",
      },
      reference: "Ada hasil → buka CPIC · prodrug + poor → ganti · HLA+ → kontraindikasi · cek interaksi.",
    },
    {
      id: "kasus",
      eyebrow: "Langkah 9 · Mini-case",
      title: "Panel pre-emptif di RS Jantung",
      prose: [
        "Kasus (angka ilustrasi, pola realistis): RS Jantung megenotipe pre-emptif 1.000 pasien (panel PGx saat masuk, hasil tersimpan di rekam medis). Sebuah studi PGRN menemukan 1 dari 4 hasil tes PGx berpotensi actionable klinis — proyeksi kasar: ~250 pasien punya ≥1 hasil yang mengubah resep.",
        "Dari 1.000 pasien, 60 direncanakan pemasangan stent + klopidogrel. Dengan asumsi ilustrasi 30% di antaranya CYP2C19 intermediate/poor metabolizer, 18 pasien dialihkan ke tikagrelor SEBELUM kejadian trombosis — bukan sesudah.",
        "Pertanyaan 1: hitung jumlah pasien yang dialihkan dan jelaskan kenapa pre-emptif mengalahkan reaktif di sini. Pertanyaan 2: sebutkan dua risiko panel pre-emptif. Pertanyaan 3: kapan pre-emptif TIDAK hemat biaya?",
        "Pembahasan 1: 60 × 30% = 18 pasien. Pre-emptif menang karena hasil sudah ada saat keputusan dibuat — tidak ada jeda 2 minggu menunggu lab saat stent sudah terpasang.",
        "Pembahasan 2: (a) varian tak tercakup panel → false reassurance 'normal'; (b) data genetik tersimpan = risiko privasi + temuan insidental yang harus dikelola.",
        "Pembahasan 3: bila populasi jarang memakai obat-obat PGx (mis. RS tanpa program kardiologi/onkologi), biaya panel tidak kembali — pre-emptif hemat bila obat PGx-nya sering diresepkan.",
      ],
      tasks: [
        { id: "t1", text: "Hitung ulang 18 pasien dan jelaskan keunggulan pre-emptif dalam 2 kalimat" },
        { id: "t2", text: "Sebutkan kapan panel pre-emptif tidak hemat biaya" },
      ],
      reference: "Pre-emptif = hasil siap saat keputusan dibuat. 1.000 pasien → ~250 actionable (ilustrasi).",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan penutup. Setiap opsi punya alasan — baca semuanya.",
      ],
      tasks: [],
      summary: [
        "Star allele (*N) = haplotipe; *1 referensi; otoritas: PharmVar.",
        "Diplotipe → activity score → fenotipe: poor/intermediate/normal/rapid/ultrarapid.",
        "CPIC (29 guideline): hasil sudah ada → resep apa; bukan 'perlu tes atau tidak'.",
        "Pasangan kunci: CYP2C19-klopidogrel, CYP2D6-kodein, TPMT/NUDT15-tiopurin, HLA-karbamazepin/abakavir.",
        "PharmCAT: VCF → star allele (Named Allele Matcher) → fenotipe → rekomendasi.",
        "Batas: phenoconversion, bias ancestri, genotipe ≠ takdir; CPIC = aturan, bukan ML.",
      ],
      next: { label: "Indeks Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "*1 pada CYP2D6*1 artinya…",
          options: [
            { text: "Alel terbaik/super", why: "*1 = referensi (fungsi normal populasi), bukan 'super'." },
            { text: "Alel referensi dengan fungsi normal — pembanding untuk varian lain", why: "Semua *N didefinisikan relatif terhadap *1.", correct: true },
            { text: "Tidak punya fungsi", why: "No function = *2, *4, dst. *1 justru yang normal." },
            { text: "Hasil tes gagal", why: "Hasil gagal dilaporkan sebagai 'no call', bukan *1." },
          ],
        },
        {
          q: "Pasien CYP2C19 *1/*2 akan dipasang stent. Keputusan CPIC?",
          options: [
            { text: "Klopidogrel dosis ganda", why: "Dosis ganda tidak mengatasi aktivasi yang gagal — masalahnya enzim, bukan jumlah." },
            { text: "Hindari klopidogrel; ganti prasugrel/tikagrelor bila tak ada kontraindikasi", why: "*1/*2 = intermediate → aktivasi klopidogrel turun → risiko trombosis stent.", correct: true },
            { text: "Tetap klopidogrel standar", why: "Itu untuk normal metabolizer; intermediate butuh pengalihan." },
            { text: "Batalkan pemasangan stent", why: "Stent tetap dipasang — yang diganti obat antiplateletnya." },
          ],
        },
        {
          q: "Pertanyaan yang dijawab guideline CPIC?",
          options: [
            { text: "Apakah pasien perlu tes genetik?", why: "CPIC eksplisit tidak menjawab ini — itu ranah regulator/penjamin." },
            { text: "Hasil genotipe sudah ada — resep apa yang tepat?", why: "Asumsi CPIC: genotyping pre-emptif makin umum; pandu hasil yang ada.", correct: true },
            { text: "Obat apa yang paling murah?", why: "CPIC soal keamanan/efikasi genetik, bukan farmakoekonomi." },
            { text: "Apakah obatnya bekerja untuk semua orang?", why: "Terlalu umum — CPIC selalu spesifik pasangan gen-obat." },
          ],
        },
        {
          q: "Input utama pipeline PharmCAT?",
          options: [
            { text: "Foto pasien", why: "Bukan biometrik — ini bioinformatika varian." },
            { text: "File VCF berisi variant calls", why: "Fase 1: Named Allele Matcher mencocokkan varian VCF ke definisi alel.", correct: true },
            { text: "Resep dokter", why: "Resep adalah output keputusan, bukan input pipeline." },
            { text: "Hasil lab darah rutin", why: "PGx butuh genotipe, bukan kimia darah." },
          ],
        },
        {
          q: "Pasien CYP2D6 *1/*1 (normal) tak merespons kodein, juga minum paroxetine. Penjelasan terbaik?",
          options: [
            { text: "Tes PGx-nya salah", why: "Jangan salahkan tes dulu — cek interaksi obat." },
            { text: "Phenoconversion: paroxetine menghambat CYP2D6 → fenotipe aktual = poor", why: "Genotipe normal × inhibitor kuat = fenotipe poor. Rekonsiliasi obat dulu.", correct: true },
            { text: "Kodein kedaluwarsa", why: "Spekulasi tanpa dasar; interaksi obat jauh lebih mungkin." },
            { text: "Pasien berbohong minum obat", why: "Kepatuhan mungkin, tapi phenoconversion dapat diverifikasi dari daftar obat." },
          ],
        },
      ],
    },
  ],
};
