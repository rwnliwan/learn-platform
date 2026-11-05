import type { V2Lesson } from "../lib/types";

const FIG_LAPISAN = `<svg viewBox="0 0 520 300" role="img" aria-label="Rantai kepemilikan berlapis yang menyembunyikan pemilik manfaat.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Empat lapis antara uang dan pemiliknya</text>
<rect x="200" y="50" width="120" height="36" rx="8" fill="var(--c2)" opacity="0.3" stroke="var(--c2)" stroke-width="2"/>
<text x="260" y="73" font-size="11" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">Pak Hendra</text>
<line x1="260" y1="86" x2="260" y2="106" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="275" y="100" font-size="9" fill="var(--chart-text)">60%</text>
<rect x="170" y="106" width="180" height="36" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="260" y="129" font-size="11" fill="var(--chart-text)" text-anchor="middle">PT Cahaya (nominee)</text>
<line x1="260" y1="142" x2="260" y2="162" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="275" y="156" font-size="9" fill="var(--chart-text)">100%</text>
<rect x="170" y="162" width="180" height="36" rx="8" fill="var(--c1)" opacity="0.3" stroke="var(--c1)" stroke-width="2"/>
<text x="260" y="185" font-size="11" fill="var(--chart-text)" text-anchor="middle">Trust Karibia</text>
<line x1="260" y1="198" x2="260" y2="218" stroke="var(--chart-text)" stroke-width="1.5"/>
<text x="275" y="212" font-size="9" fill="var(--chart-text)">45%</text>
<rect x="170" y="218" width="180" height="36" rx="8" fill="var(--c3)" opacity="0.3" stroke="var(--c3)" stroke-width="2"/>
<text x="260" y="241" font-size="11" fill="var(--chart-text)" text-anchor="middle">PT Target (nasabah bank)</text>
<text x="260" y="278" font-size="10" fill="var(--chart-text)" text-anchor="middle">Efektif: 60% × 100% × 45% = 27% → BO (≥25%)</text>
</g>
</svg>`;

export const aml20: V2Lesson = {
  slug: "aml20-beneficial-ownership-ubo",
  track: "Fraud & AML Analytics",
  module: "KYC & Uji Tuntas",
  title: "AML20 — Beneficial Ownership Deep-Dive: UBO, Shell Company & Trust",
  estMinutes: 53,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Pemilik yang tidak ada di dokumen mana pun",
      prose: [
        "Analis CDD memeriksa PT Maju Bersama yang mengajukan kredit Rp50 miliar. Dokumen lengkap: akta, NIB, laporan keuangan auditan, dan daftar pemegang saham — 100% dimiliki PT Cahaya Abadi. PT Cahaya Abadi dimiliki sebuah trust di yurisdiksi Karibia. Trustee-nya sebuah firma hukum. Beneficiary-nya? 'Belum ditentukan, sesuai diskresi trustee.' Analis bertanya: siapa manusia yang akhirnya menikmati uang ini? Jawaban resminya: tidak ada yang tercatat.",
        "Twist-nya: semua dokumen SAH dan lengkap — tetapi pemilik sebenarnya TIDAK ADA di dokumen mana pun. Inilah inti beneficial ownership: hukum mengenal 'pemilik tercatat' (siapa namanya di akta), tetapi kejahatan keuangan bersembunyi di 'pemilik manfaat' (siapa manusia yang akhirnya mengendalikan dan menikmati). Analis yang hanya membaca akta sedang membaca sampulnya saja.",
        "Setelah lesson ini kamu bisa: (1) menjelaskan definisi beneficial owner/UBO menurut FATF; (2) menghitung kepemilikan tidak langsung berlapis dan menentukan siapa BO; (3) mengenali struktur shell company dan trust yang menyembunyikan ownership; (4) menerapkan red flags dan teknik tracing hingga ke SAR. Konteks karir: 'walk me through how you identify the UBO' adalah pertanyaan standar wawancara analis KYC/AML — kandidat yang bisa menghitung kepemilikan berlapis di papan tulis langsung naik kelas.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "FATF Recommendation 24 mewajibkan negara memastikan informasi beneficial ownership tersedia akurat dan mutakhir — dan Indonesia dievaluasi terhadap standar ini. Bank yang gagal mengidentifikasi BO melanggar kewajiban CDD (di Indonesia: POJK APU PPT) dan berisiko memfasilitasi pencucian tanpa sadar.",
      },
      reference: "Pemilik tercatat ≠ pemilik manfaat. Carilah manusianya.",
    },
    {
      id: "definisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "BO dan UBO: siapa 'manusia terakhirnya'",
      prose: [
        "Beneficial owner (BO) = orang-perorangan (natural person) yang AKHIRNYA memiliki atau mengendalikan nasabah — langsung maupun tidak langsung. Ultimate beneficial owner (UBO) = BO di ujung rantai, tidak ada manusia lain di atasnya. Kuncinya: BO selalu manusia, bukan perusahaan. 'PT Cahaya Abadi' tidak bisa menjadi BO — ia hanya perantara; manusianya yang dicari.",
        "Ambang FATF: seseorang adalah BO bila memiliki/mengendalikan ≥ 25% saham atau hak suara, ATAU menjalankan kendali substantif (substantial control) — misal berhak mengangkat direksi, meski sahamnya 0%. Ambang 25% adalah LANTAI internasional: negara boleh lebih ketat. Amerika Serikat (Corporate Transparency Act, berlaku 1 Jan 2024) memakai 25% + substantial control dengan pelaporan ke database FinCEN; Uni Eropa memakai 25%; sejumlah yurisdiksi menetapkan 10-20% untuk sektor berisiko tinggi.",
        "Konteks Indonesia: Perpres 13/2018 mewajibkan korporasi mengenali dan melaporkan pemilik manfaatnya; bank umumnya menerapkan ambang 25% mengikuti standar FATF dalam prosedur CDD-nya. Praktiknya: bila tidak ada yang mencapai 25%, bank wajib mencatat upaya identifikasi dan dapat menetapkan direksi sebagai BO 'cadangan' — tetapi ini pilihan terakhir, bukan jalan pintas.",
        "Tiga miskonsepsi. Satu: 'Pemegang saham terbesar = BO.' Belum tentu — nominee bisa memegang 100% saham atas nama orang lain. Dua: 'Di bawah 25% = aman.' Kendali substantif (tanpa saham) juga menjadikan seseorang BO. Tiga: 'Sudah ada di akta = sudah CDD.' Akta mencatat legal owner; CDD menuntut beneficial owner — dua pekerjaan berbeda.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Ringkas fondasi KYC/CDD (prasyarat yang diasumsikan lesson ini): CDD mewajibkan bank mengidentifikasi nasabah dan memverifikasi identitasnya memakai dokumen tepercaya; untuk nasabah korporasi, CDD mencakup memahami struktur kepemilikan dan pengendalian — dan di sinilah identifikasi BO menjadi kewajiban, bukan tambahan. Lesson ini memperdalam bagian tersulit dari kewajiban itu.",
      },
      formula: String.raw`\text{kepemilikan tidak langsung} = 60\% \times 50\% = 30\%`,
      formulaNote: "Kalikan persentase di sepanjang rantai: A memiliki 60% dari B, B memiliki 50% dari C → A menguasai 30% C secara tidak langsung. Contoh lab: 60% × 100% × 45% = 27% ≥ 25% → BO. Interpretasi: angka ini menjawab 'berapa besar suara A di C bila semua perantara patuh padanya' — asumsi yang wajar untuk struktur yang dirancang satu pengendali. Bila hasilnya di bawah 25%, cek kendali substantif sebelum menyatakan bukan BO.",
      hints: [
        "Hafalkan: BO = manusia + (≥25% ATAU kendali substantif).",
        "Bila rantai bercabang, jumlahkan semua jalur tidak langsung orang yang sama.",
      ],
      reference: "BO selalu manusia. 25% atau kendali = BO.",
    },
    {
      id: "shell-trust",
      eyebrow: "Langkah 3 · Konsep",
      title: "Shell company, lapisan, dan trust: tiga alat penyamaran",
      prose: [
        "Satu: SHELL COMPANY — perusahaan yang hanya ada di atas kertas (tanpa operasi, karyawan, atau kantor nyata) tetapi memegang saham, rekening, atau aset. Shell bukan ilegal per se — ia legal untuk holding — tetapi menjadi alat favorit karena memutus rantai nama manusia dari aset. Dua: LAPISAN (layering) — menumpuk 3-7 perusahaan di beberapa yurisdiksi sehingga setiap dokumen hanya menunjukkan 'satu lapis ke atas'. Tiga: TRUST — settlor menyerahkan aset ke trustee untuk dikelola demi beneficiary; kepemilikan hukum (trustee) terpisah dari kenikmatan (beneficiary) — celah yang dieksploitasi bila beneficiary 'diskresioner' alias tidak bernama.",
        "Varian keempat: NOMINEE — orang yang namanya dipakai sebagai pemegang saham/direktur atas nama orang lain (dengan imbalan). FATF R.24 (revisi konsultasi) secara eksplisit menargetkan nominee: negara harus memastikan nominee mengungkapkan statusnya dan identitas pemberi kuasa — atau melarang praktiknya. Bearer shares (saham atas unjuk — siapa pegang fisiknya, dialah pemiliknya) juga dilarang diterbitkan baru.",
        "Contoh skema utuh (lihat gambar): Pak Hendra → 60% PT Cahaya (direkturnya nominee) → 100% Trust Karibia (beneficiary diskresioner) → 45% PT Target. Di akta PT Target hanya tertulis 'Trust Karibia 45%'. Efektif Hendra = 27% → BO, tetapi tidak ada dokumen bank yang menyebut namanya. Inilah yang harus ditemukan analis.",
        "Dua miskonsepsi. Satu: 'Trust selalu untuk kejahatan.' Trust adalah instrumen waris dan filantropi yang sah — red flag-nya bukan trust-nya, melainkan beneficiary yang tidak jelas + yurisdiksi secrecy + tanpa alasan bisnis. Dua: 'Banyak lapis = pasti curang.' Konglomerat sah juga berlapis; bedanya ada alasan bisnis yang bisa dijelaskan (pajak, liability, operasional) dan dokumennya transparan.",
      ],
      figure: {
        svg: FIG_LAPISAN,
        alt: "Rantai kepemilikan berlapis yang menyembunyikan pemilik manfaat.",
        caption: "Cara membaca: rantai atas→bawah = aliran kepemilikan; angka di panah = persen tiap lapis. Interpretasi: kalikan sepanjang rantai — 27% ≥ 25%, jadi Pak Hendra adalah BO meski namanya tak ada di akta PT Target.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNama di akta sudah cukup sebagai BO.\u201D Akta mencatat LEGAL owner. Bila legal owner-nya perusahaan lain atau nominee, pekerjaanmu BARU MULAI — telusuri sampai manusia. Analis yang berhenti di akta adalah analis yang dicari pencuci uang.",
      },
      hints: [
        "Untuk tiap 'PT' di struktur, tanya: 'siapa manusianya?' — ulangi sampai jawabannya nama orang.",
        "Trust: identifikasi settlor + trustee + beneficiary; ketiganya bisa berbeda orang.",
      ],
      reference: "Shell + lapis + trust + nominee = empat alat penyamaran.",
    },
    {
      id: "tracing",
      eyebrow: "Langkah 4 · Konsep",
      title: "Teknik tracing: memburu manusia terakhir",
      prose: [
        "Satu: REGISTRY BO — banyak negara kini punya register beneficial ownership (publik atau terbatas untuk otoritas/bank). Cocokkan struktur nasabah dengan registry; ketidakcocokan (discrepancy) adalah temuan yang wajib dilaporkan di banyak yurisdiksi. Dua: DOKUMEN LAPIS — minta akta + daftar pemegang saham TIAP lapis, bukan hanya lapis pertama; tolak struktur yang 'tidak bisa menyediakan dokumen lapis ke-3'. Tiga: NOMINEE HUNTING — cocokkan direktur/pemegang saham dengan database nominee yang diketahui; direktur yang menjabat di 200 perusahaan = nominee profesional.",
        "Empat: UJI KENDALI SUBSTANTIF — siapa yang menandatangani? Siapa yang dihubungi bank? Rekening dikendalikan dari IP/perangkat siapa? Jejak operasional sering lebih jujur daripada dokumen. Lima: SUMBER EKSTERNAL — laporan keuangan, berita, database sanksi, dan informasi PPATK/FIU; manusia yang berkuasa biasanya meninggalkan jejak di tempat lain.",
        "Dua miskonsepsi. Satu: 'Registry BO selalu benar.' Data registry bisa basi atau dipalsukan — ia titik AWAL verifikasi, bukan vonis. FATF menuntut data 'adequate, accurate, up-to-date' justru karena registry yang buruk = ilusi transparansi. Dua: 'Tracing selesai saat ketemu nama.' Nama tanpa verifikasi identitas (KTP/paspor + sumber independen) = nama di atas kertas lain.",
        "Prinsip penutup: dokumentasikan SETIAP langkah tracing — sumber, tanggal, hasil. Bila struktur ternyata terkait kejahatan, dokumentasimu adalah bukti uji tuntas; bila ternyata bersih, dokumentasimu adalah alasan penutupan yang bisa dipertahankan ke auditor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Standar verifikasi FATF: informasi BO harus adequate (cukup mengidentifikasi), accurate (terverifikasi dari sumber independen tepercaya), dan up-to-date (diperbarui maksimal ~1 bulan setelah perubahan). Tiga kata ini adalah checklist mutu setiap file CDD korporasi.",
      },
      hints: [
        "Aturan praktis: 'tidak ada dokumen lapis = tidak ada rekening'.",
        "Jejak operasional (tanda tangan, IP, kontak) > dokumen (yang bisa direkayasa).",
      ],
      reference: "Registry → dokumen lapis → nominee hunting → uji kendali → verifikasi.",
    },
    {
      id: "redflags",
      eyebrow: "Langkah 5 · Konsep",
      title: "Red flags untuk analis",
      prose: [
        "Tujuh red flags yang harus dihafal. (1) Lapisan ≥ 3 tanpa alasan bisnis yang jelas. (2) Nominee sebagai direktur/pemegang saham — terutama yang merangkap ratusan jabatan. (3) Yurisdiksi secrecy (tidak ada registry BO publik, kerahasiaan kuat) tanpa kaitan bisnis ke sana. (4) Bearer shares atau penolakan mengungkapkan beneficiary trust. (5) Perubahan kepemilikan mendadak menjelang transaksi besar. (6) Ketidakcocokan antara registry BO dan dokumen yang diserahkan ke bank. (7) Struktur jauh lebih kompleks daripada skala bisnisnya — warung beromzet Rp2 miliar tidak butuh 5 lapis perusahaan.",
        "Skor risiko struktur (lab kedua): tiap red flag diberi bobot; total ≥ ambang → EDD wajib; ≥ ambang tinggi → pertimbangkan penolakan + SAR. Tujuannya bukan menghukum kompleksitas, melainkan memaksa kompleksitas menjelaskan dirinya.",
        "Dua miskonsepsi. Satu: 'Satu red flag = langsung tolak.' Red flag = pemicu PENDALAMAN, bukan vonis. Konglomerat sah bisa punya 2-3 red flag yang semuanya terjelaskan. Dua: 'Red flag hanya untuk onboarding.' Perubahan struktur (M&A, penambahan lapis, ganti nominee) = trigger review ulang; CDD bukan pekerjaan sekali.",
        "Hubungan ke SAR: bila pendalaman tidak bisa menjelaskan red flags — atau penjelasannya tidak masuk akal — analis wajib mengajukan Suspicious Activity Report ke PPATK. 'Tidak bisa menemukan BO-nya' setelah upaya wajar ADALAH alasan SAR yang sah, bukan kegagalan analis.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CNasabah kooperatif = tidak ada masalah.\u201D Pencuci profesional justru PALING kooperatif — dokumen rapi, jawaban lancar, semua 'ada'. Kooperatif bukan bukti bersih; kelengkapan yang bisa DIVERIFIKASI-lah buktinya. Verifikasi, jangan terpesona.",
      },
      hints: [
        "Hafalkan 7 red flags; uji tiap file korporasi dengannya.",
        "'Tidak ketemu BO' setelah upaya wajar = dasar SAR, bukan kegagalan.",
      ],
      reference: "7 red flags. Skor → EDD → SAR bila tak terjelaskan.",
    },
    {
      id: "lab-ubo",
      eyebrow: "Langkah 6 · Lab",
      title: "Siapa BO-nya? Hitung kepemilikan berlapis",
      prose: [
        "PT Target dimiliki: PT Maju 50%, Budi 30% (langsung), Citra 20% (langsung). PT Maju dimiliki: Andi 60%, Dewi 40%. Hitung kepemilikan efektif tiap manusia (langsung + tidak langsung via semua jalur), lalu tentukan BO (≥ 25% atau kendali).",
        "Hasil: Andi = 60% × 50% = 30% → BO; Budi = 30% → BO; Dewi = 40% × 50% = 20% → bukan BO (ambang); Citra = 20% → bukan BO. Perhatikan Dewi: 20% di bawah ambang — TETAP catat dan cek kendali substantif sebelum menutup file. Eksperimen: ubah porsi Andi di PT Maju menjadi 40% — siapa BO sekarang? (Andi 20%, bukan BO; hanya Budi.)",
      ],
      tasks: [
        { id: "t1", text: "Hitung efektif tiap orang (langsung + tidak langsung)" },
        { id: "t2", text: "Tentukan BO (efektif >= 25), cetak 'nama: X% (BO/bukan)'" },
      ],
      expected: "Andi: 30.0% (BO)\nBudi: 30.0% (BO)\nDewi: 20.0% (bukan)\nCitra: 20.0% (bukan)",
      note: {
        title: "💡 Intuisi",
        body: "Perkalian rantai terlihat sepele — tetapi inilah perhitungan yang PALING sering salah di file CDD nyata, karena analis lupa menjumlahkan jalur tidak langsung. Satu perkalian yang terlewat = satu BO yang lolos.",
      },
      hints: [
        "efektif[orang] = langsung.get(orang,0) + sum(porsi_di_perantara * porsi_perantara_ke_target).",
        "BO bila efektif >= 25.",
      ],
      code: {
        starter: "# Struktur: target dimiliki perantara & langsung. JANGAN UBAH.\nlangsung = {\"Budi\": 30, \"Citra\": 20}          # % langsung di PT Target\nperantara = {\"PT Maju\": 50}                    # % PT Maju di PT Target\npemilik_perantara = {\"PT Maju\": {\"Andi\": 60, \"Dewi\": 40}}\n\n# TULIS KODEMU: efektif tiap orang + status BO\nefektif = {}\nfor orang, pct in langsung.items():\n    efektif[orang] = efektif.get(orang, 0) + pct\nfor pt, pct_pt in perantara.items():\n    for orang, pct in pemilik_perantara[pt].items():\n        efektif[orang] = efektif.get(orang, 0) + \nfor orang in sorted(efektif):\n    status = \n    print(f\"{orang}: {efektif[orang]:.1f}% ({status})\")\n",
        lockLines: 9,
        solution: "# Struktur: target dimiliki perantara & langsung. JANGAN UBAH.\nlangsung = {\"Budi\": 30, \"Citra\": 20}          # % langsung di PT Target\nperantara = {\"PT Maju\": 50}                    # % PT Maju di PT Target\npemilik_perantara = {\"PT Maju\": {\"Andi\": 60, \"Dewi\": 40}}\n\n# TULIS KODEMU: efektif tiap orang + status BO\nefektif = {}\nfor orang, pct in langsung.items():\n    efektif[orang] = efektif.get(orang, 0) + pct\nfor pt, pct_pt in perantara.items():\n    for orang, pct in pemilik_perantara[pt].items():\n        efektif[orang] = efektif.get(orang, 0) + pct / 100 * pct_pt\nfor orang in sorted(efektif):\n    status = \"BO\" if efektif[orang] >= 25 else \"bukan\"\n    print(f\"{orang}: {efektif[orang]:.1f}% ({status})\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "Andi 30% BO", msg: "60% x 50%.", pattern: "Andi: 30.0% .BO." },
          { kind: "stdout_matches", task: "t1", label: "Dewi 20% bukan", msg: "40% x 50%.", pattern: "Dewi: 20.0% .bukan." },
          { kind: "stdout_matches", task: "t2", label: "Budi 30% BO", msg: "Langsung 30%.", pattern: "Budi: 30.0% .BO." },
        ],
      },
      reference: "Kalikan tiap rantai; jumlahkan per orang; ≥25% = BO.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 7 · Lab",
      title: "Skor risiko struktur kepemilikan",
      prose: [
        "Empat nasabah korporasi dengan atribut red flag (lapisan>3, nominee, yurisdiksi secrecy, trust beneficiary tak jelas). Bobot: lapisan 2, nominee 3, secrecy 2, trust-tak-jelas 3. Hitung skor; ≥5 → EDD; ≥8 → TOLAK/LAPOR.",
        "Hasil: PT A (skor 2) → CDD normal; PT B (5) → EDD; PT C (7) → EDD; PT D (10) → TOLAK/LAPOR. Perhatikan PT C vs D: beda 3 poin = beda respons. Kalibrasi ambang adalah keputusan kebijakan bank — lab ini menunjukkan mekaniknya. Eksperimen: turunkan bobot nominee ke 2 — siapa yang berubah status?",
      ],
      tasks: [
        { id: "t1", text: "Hitung skor tiap nasabah (jumlah bobot flag aktif)" },
        { id: "t2", text: "Tentukan respons: <5 CDD, 5-7 EDD, >=8 TOLAK/LAPOR; cetak" },
      ],
      expected: "PT A: skor 2 -> CDD normal\nPT B: skor 5 -> EDD\nPT C: skor 7 -> EDD\nPT D: skor 10 -> TOLAK/LAPOR",
      note: {
        title: "💡 Intuisi",
        body: "Skor mengubah 'feeling' analis menjadi angka yang bisa diaudit. Regulator tidak meminta analis sempurna — ia meminta KONSISTEN: nasabah serupa diperlakukan serupa, dan alasannya tercatat.",
      },
      hints: [
        "skor = sum(bobot[f] for f, ada in flags.items() if ada).",
        "Respons: skor>=8 TOLAK/LAPOR; >=5 EDD; else CDD normal.",
      ],
      code: {
        starter: "# flags tiap nasabah: True = red flag aktif. JANGAN UBAH.\nbobot = {\"lapisan\": 2, \"nominee\": 3, \"secrecy\": 2, \"trust\": 3}\nnasabah = {\"PT A\": {\"lapisan\": True, \"nominee\": False, \"secrecy\": False, \"trust\": False},\n           \"PT B\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": False, \"trust\": False},\n           \"PT C\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": True, \"trust\": False},\n           \"PT D\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": True, \"trust\": True}}\n\n# TULIS KODEMU: skor + respons tiap nasabah\nfor nama, flags in nasabah.items():\n    skor = \n    if skor >= 8:\n        respons = \"TOLAK/LAPOR\"\n    elif skor >= 5:\n        respons = \"EDD\"\n    else:\n        respons = \"CDD normal\"\n    print(f\"{nama}: skor {skor} -> {respons}\")\n",
        lockLines: 12,
        solution: "# flags tiap nasabah: True = red flag aktif. JANGAN UBAH.\nbobot = {\"lapisan\": 2, \"nominee\": 3, \"secrecy\": 2, \"trust\": 3}\nnasabah = {\"PT A\": {\"lapisan\": True, \"nominee\": False, \"secrecy\": False, \"trust\": False},\n           \"PT B\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": False, \"trust\": False},\n           \"PT C\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": True, \"trust\": False},\n           \"PT D\": {\"lapisan\": True, \"nominee\": True, \"secrecy\": True, \"trust\": True}}\n\n# TULIS KODEMU: skor + respons tiap nasabah\nfor nama, flags in nasabah.items():\n    skor = sum(bobot[f] for f, ada in flags.items() if ada)\n    if skor >= 8:\n        respons = \"TOLAK/LAPOR\"\n    elif skor >= 5:\n        respons = \"EDD\"\n    else:\n        respons = \"CDD normal\"\n    print(f\"{nama}: skor {skor} -> {respons}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "PT B skor 5", msg: "2+3.", pattern: "PT B: skor 5 -> EDD" },
          { kind: "stdout_matches", task: "t2", label: "PT D tolak", msg: "2+3+2+3=10.", pattern: "PT D: skor 10 -> TOLAK/LAPOR" },
          { kind: "stdout_matches", task: "t2", label: "PT A CDD", msg: "Skor 2.", pattern: "PT A: skor 2 -> CDD normal" },
        ],
      },
      reference: "Bobot × flag → skor → respons bertingkat.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 8 · Peta keputusan",
      title: "Temuan BO: respons apa?",
      prose: [
        "Satu: BO teridentifikasi & terverifikasi, struktur wajar → CDD normal, catat dan monitor. Dua: struktur kompleks tetapi terjelaskan (alasan bisnis + dokumen lapis lengkap) → EDD: pahami tujuan struktur, monitor transaksi vs profil. Tiga: nominee/bearer/beneficiary tak terungkap → minta pengungkapan tertulis; menolak = tolak hubungan usaha. Empat: registry BO ≠ dokumen bank → discrepancy: klarifikasi; tak terjelaskan = EDD mendalam + pertimbangkan SAR.",
        "Lima: upaya wajar gagal menemukan BO → JANGAN 'asal isi nama direktur' — catat upaya, tetapkan status risiko tinggi, ajukan SAR bila indikasi mencurigakan. Mengarang BO lebih berbahaya daripada mengakui tidak ketemu.",
        "Aturan praktis 10 detik: ketemu + terverifikasi = jalan; kompleks = gali; tak terungkap = tolak; tak ketemu = catat + lapor. BO yang dikarang = bom waktu audit.",
        "Satu jebakan: 'nasabah besar, jangan dipersulit.' Tekanan bisnis nyata — tetapi denda regulator dan risiko reputasi dari satu kasus pencucian melampaui semua fee. Analis yang menolak dengan dokumentasi rapi dilindungi prosedur; analis yang meloloskan tanpa verifikasi tidak dilindungi siapa pun.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Di banyak yurisdiksi, bank wajib melaporkan discrepancy registry BO — dan kegagalan mengidentifikasi BO adalah temuan audit klasik yang berujung denda. File CDD yang baik menjawab tiga pertanyaan: siapa BO-nya, bagaimana kamu tahu, dan kapan terakhir diverifikasi.",
      },
      reference: "Ketemu=jln; kompleks=gali; tak terungkap=tolak; tak ketemu=lapor.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 9 · Mini-case",
      title: "PT Nusantara Abadi dan empat lapisnya",
      prose: [
        "PT Nusantara Abadi mengajukan fasilitas Rp80 miliar. Struktur: PT NA 100% dimiliki PT Holding X (Singapura); PT Holding X 70% dimiliki Trust Y (Karibia, beneficiary diskresioner) + 30% Tn. Lim; trustee Trust Y adalah firma hukum; direktur PT NA adalah Tn. Ahmad yang juga direktur di 140 perusahaan lain. Omzet PT NA: Rp15 miliar/tahun.",
        "Pertanyaan: (a) Hitung kepemilikan efektif Tn. Lim di PT NA. (b) Identifikasi red flags. (c) Langkah analis. Pembahasan: (a) 30% × 100% = 30% → Tn. Lim adalah BO (satu-satunya yang teridentifikasi). Trust Y 70% → beneficiary tak bernama = BO tak teridentifikasi untuk porsi mayoritas. (b) Red flags: 3 lapis + trust beneficiary diskresioner + yurisdiksi secrecy (Karibia) + nominee profesional (140 jabatan) + kompleksitas tak sebanding omzet Rp15 miliar. Skor: lapisan(2)+nominee(3)+secrecy(2)+trust(3) = 10 → TOLAK/LAPOR. (c) Minta pengungkapan beneficiary + dokumen tiap lapis; bila menolak → tolak fasilitas; ajukan SAR ke PPATK atas ketidakmampuan mengidentifikasi BO mayoritas. Pelajaran: satu BO yang ketemu (Tn. Lim) tidak menebus 70% yang gelap — mayoritas gelap = struktur gelap.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perhatikan jebakannya: analis junior sering 'puas' karena menemukan Tn. Lim (30%, BO sah) lalu menutup file. Standarnya: SEMUA BO material harus teridentifikasi. 70% yang gelap bukan detail — ia adalah inti kasusnya.",
      },
      reference: "Mayoritas gelap = struktur gelap. Satu BO tak menebus sisanya.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah. Target: skor ≥ 4 dari 5.",
      ],
      summary: [
        "BO = orang-perorangan yang akhirnya memiliki/mengendalikan; ambang FATF ≥ 25% kepemilikan ATAU kendali substantif — BO selalu manusia, bukan perusahaan.",
        "Kepemilikan tidak langsung dihitung dengan mengalikan persentase sepanjang rantai (contoh lab: 60% × 50% = 30% → BO); jumlahkan semua jalur orang yang sama.",
        "Empat alat penyamaran: shell company, pelapisan multi-yurisdiksi, trust (beneficiary diskresioner), dan nominee — FATF R.24 menuntut pengungkapan nominee dan melarang bearer shares baru.",
        "Teknik tracing: cocokkan registry BO, minta dokumen tiap lapis, buru nominee profesional, uji kendali substantif via jejak operasional, verifikasi dari sumber independen.",
        "Tujuh red flags → skor → respons bertingkat (CDD/EDD/TOLAK-LAPOR); 'tidak ketemu BO' setelah upaya wajar adalah dasar SAR yang sah, bukan kegagalan analis.",
      ],
      quiz: [
        {
          q: "PT Target: Andi 60% → PT Maju; PT Maju 50% → PT Target. Status Andi:",
          options: [
            { text: "BO — efektif 30% ≥ 25%", why: "Benar: 60% × 50% = 30%.", correct: true },
            { text: "Bukan BO — tidak tercatat di akta PT Target", why: "Akta mencatat legal owner; BO dihitung dari rantai." },
            { text: "Bukan BO — kepemilikannya tidak langsung", why: "Tidak langsung TETAP dihitung; justru itu inti UBO." },
            { text: "BO hanya bila sahamnya di atas 50%", why: "Ambangnya 25%, bukan 50%." },
          ],
        },
        {
          q: "Seseorang memegang 0% saham tetapi berhak mengangkat seluruh direksi. Statusnya:",
          options: [
            { text: "BO via kendali substantif", why: "Benar: substantial control = BO tanpa saham.", correct: true },
            { text: "Bukan BO — tanpa saham bukan pemilik", why: "Definisi BO mencakup pengendalian, bukan hanya saham." },
            { text: "Hanya saksi, bukan BO", why: "Hak angkat direksi = kendali nyata, bukan peran pasif." },
            { text: "BO hanya bila terdaftar di akta", why: "BO justru sering TIDAK di akta; itu masalahnya." },
          ],
        },
        {
          q: "Red flag PALING kuat dari sebuah trust:",
          options: [
            { text: "Beneficiary diskresioner (tak bernama) + yurisdiksi secrecy", why: "Benar: kombinasi ini = tidak ada manusia yang bisa diverifikasi.", correct: true },
            { text: "Trust digunakan untuk waris keluarga", why: "Itu penggunaan sah dengan beneficiary jelas." },
            { text: "Trustee adalah firma hukum ternama", why: "Reputasi trustee tidak menggantikan identifikasi beneficiary." },
            { text: "Trust didaftarkan resmi", why: "Terdaftar ≠ transparan beneficiary-nya." },
          ],
        },
        {
          q: "Setelah upaya wajar, analis tetap tidak bisa mengidentifikasi BO mayoritas. Tindakan benar:",
          options: [
            { text: "Catat upaya, tetapkan risiko tinggi, ajukan SAR bila indikasi mencurigakan", why: "Benar: 'tak ketemu' = dasar SAR yang sah.", correct: true },
            { text: "Isi nama direktur sebagai BO agar file lengkap", why: "Mengarang BO = pelanggaran serius, bom waktu audit." },
            { text: "Tutup file — bukan masalah analis", why: "Kegagalan identifikasi adalah temuan, bukan untuk diabaikan." },
            { text: "Minta nasabah menunjuk siapa saja sebagai BO", why: "BO adalah fakta, bukan penunjukan." },
          ],
        },
        {
          q: "Direktur yang menjabat di 140 perusahaan kemungkinan adalah:",
          options: [
            { text: "Nominee profesional — red flag yang harus ditelusuri", why: "Benar: pola klasik nominee-for-hire.", correct: true },
            { text: "Pengusaha sukses multibisnis", why: "140 jabatan direksi aktif tidak realistis dikelola satu orang." },
            { text: "Tidak relevan untuk CDD", why: "Justru indikator kunci penyamaran ownership." },
            { text: "Otomatis BO dari semua perusahaan itu", why: "Nominee justru BUKAN BO — ia boneka; cari pemberi kuasanya." },
          ],
        },
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CStruktur sudah diaudit akuntan — pasti bersih.\u201D Audit keuangan memeriksa KEWAJARAN laporan, bukan IDENTITAS pemilik manfaat. Auditor bisa menerbitkan opini wajar untuk perusahaan yang BO-nya gelap — dua pekerjaan berbeda dengan tujuan berbeda.",
      },
      hints: [
        "Uji cepat: hitung efektif 3-lapis tanpa kalkulator (misal 80%×60%×50%).",
        "Ingat: BO = manusia; 25% atau kendali; verifikasi dari sumber independen.",
      ],
      reference: "Cari manusianya. Verifikasi. Dokumentasikan.",
    },
  ],
};
