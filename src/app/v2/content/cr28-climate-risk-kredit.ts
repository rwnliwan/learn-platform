import type { V2Lesson } from "../lib/types";

const FIG_NGFS = `<svg viewBox="0 0 480 270" role="img" aria-label="Tiga skenario NGFS: orderly, disorderly, dan hot house world.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Skenario NGFS: tiga dunia, tiga tagihan</text>
<text x="10" y="52" font-size="11" fill="var(--chart-text)">Orderly (Net Zero 2050)</text>
<rect x="200" y="38" width="90" height="24" fill="var(--c1)" opacity="0.9"/>
<text x="296" y="55" font-size="11" fill="var(--chart-text)">syok dini, terkelola</text>
<text x="10" y="102" font-size="11" fill="var(--chart-text)">Disorderly (tertunda)</text>
<rect x="200" y="88" width="200" height="24" fill="var(--c4)" opacity="0.9"/>
<text x="406" y="105" font-size="11" fill="var(--chart-text)">syok telat, brutal</text>
<text x="10" y="152" font-size="11" fill="var(--chart-text)">Hot house (kebijakan kini)</text>
<rect x="200" y="138" width="150" height="24" fill="var(--c3)" opacity="0.9"/>
<text x="356" y="155" font-size="11" fill="var(--chart-text)">fisik kronis</text>
<text x="10" y="195" font-size="11" fill="var(--chart-text)">Panjang batang = beratnya tagihan risiko kredit.</text>
<text x="10" y="215" font-size="11" fill="var(--chart-text)">Disorderly paling mahal: transisi tiba-tiba + fisik menumpuk.</text>
<text x="10" y="245" font-size="10" fill="var(--chart-text)" opacity="0.75">Ilustrasi kerangka NGFS (Network for Greening the Financial System).</text>
</g>
</svg>`;

const FIG_TRANSMISI = `<svg viewBox="0 0 480 270" role="img" aria-label="Jalur transmisi risiko iklim ke PD dan LGD.">
<g font-family="var(--font-ui)">
<text x="10" y="28" font-size="13" fill="var(--chart-text)" font-weight="bold">Dari langit ke neraca: jalur transmisi</text>
<rect x="20" y="50" width="130" height="52" rx="8" fill="var(--c1)" opacity="0.25" stroke="var(--c1)" stroke-width="2"/>
<text x="85" y="72" font-size="11" fill="var(--chart-text)" text-anchor="middle">Risiko fisik</text>
<text x="85" y="90" font-size="10" fill="var(--chart-text)" text-anchor="middle">banjir, gagal panen</text>
<rect x="330" y="50" width="130" height="52" rx="8" fill="var(--c4)" opacity="0.25" stroke="var(--c4)" stroke-width="2"/>
<text x="395" y="72" font-size="11" fill="var(--chart-text)" text-anchor="middle">Risiko transisi</text>
<text x="395" y="90" font-size="10" fill="var(--chart-text)" text-anchor="middle">harga karbon, regulasi</text>
<text x="240" y="80" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="150" y="130" width="180" height="52" rx="8" fill="var(--c3)" opacity="0.2" stroke="var(--c3)" stroke-width="2"/>
<text x="240" y="152" font-size="11" fill="var(--chart-text)" text-anchor="middle">Arus kas debitur turun</text>
<text x="240" y="170" font-size="10" fill="var(--chart-text)" text-anchor="middle">biaya naik / aset terdampar</text>
<text x="240" y="202" font-size="14" fill="var(--chart-text)" text-anchor="middle">↓</text>
<rect x="120" y="215" width="240" height="36" rx="8" fill="var(--chart-text)" opacity="0.12" stroke="var(--chart-text)" stroke-width="2"/>
<text x="240" y="238" font-size="12" fill="var(--chart-text)" text-anchor="middle" font-weight="bold">PD naik · LGD naik · ECL naik</text>
</g>
</svg>`;

export const cr28: V2Lesson = {
  slug: "cr28-climate-risk-kredit",
  track: "Credit Risk",
  module: "Risiko Iklim & Kredit",
  title: "CR28 — Climate Risk untuk Kredit: Dari Langit ke Neraca",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Rp1,2 triliun yang muncul dari udara tipis",
      prose: [
        "2026, Bank Nusantara menelaah debitur batubaranya: PT Gali Terus, EBITDA Rp800 miliar, lancar, kolektibilitas 1. Di atas kertas, kredit Rp2 triliun ini sehat. Lalu tim climate risk memasukkan satu angka ke model: harga karbon Rp100.000 per ton — ilustrasi skenario transisi yang tidak muluk. Emisi Gali Terus 12 juta ton per tahun. Tagihannya: Rp1,2 triliun per tahun. Lebih besar dari seluruh EBITDA-nya.",
        "Twist-nya: tidak ada yang berubah di tambang itu. Tidak ada kecelakaan, tidak ada penurunan harga batubara. Yang berubah = dunia di sekitarnya memutuskan karbon ada harganya. Inilah risiko transisi: arus kas debitur bisa runtuh tanpa satu pun indikator kredit tradisional bergerak — karena indikator tradisional tidak mengukur atmosfer.",
        "Lesson ini tentang menerjemahkan risiko iklim menjadi bahasa kredit: PD, LGD, dan ECL. Setelah lesson ini kamu bisa: (1) membedakan risiko fisik vs transisi; (2) membaca tiga skenario NGFS; (3) menghitung guncangan biaya karbon terhadap coverage; (4) memetakan skenario ke dampak ECL portofolio.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Regulator global (NGFS, Basel) sudah memasukkan climate risk ke stress testing. Bank Indonesia dan OJK mengikuti. Analis kredit yang tidak bisa membaca skenario iklim akan buta terhadap satu kelas risiko yang tumbuh paling cepat — dan yang paling mungkin muncul di ujian sertifikasi serta wawancara kerja 2026.",
      },
      reference: "Iklim → arus kas → PD/LGD/ECL. Dua risiko, tiga skenario.",
    },
    {
      id: "fisik-transisi",
      eyebrow: "Langkah 2 · Konsep",
      title: "Dua risiko, satu neraca",
      prose: [
        "Risiko fisik: kerusakan langsung dari perubahan iklim — banjir merendam pabrik, kekeringan menggagalkan panen, badai menghentikan logistik. Dampaknya ke kredit: agunan rusak (LGD naik), operasional berhenti (PD naik). Ini risiko yang 'terlihat' — tetapi semakin sering dan semakin parah.",
        "Risiko transisi: biaya peralihan ke ekonomi rendah karbon — harga karbon, regulasi emisi, perubahan preferensi konsumen, teknologi yang membuat aset fosil usang (stranded assets). Dampaknya: biaya naik permanen, pendapatan menyusut, valuasi agunan berbasis fosil anjlok. Ini risiko yang 'tidak terlihat' di laporan keuangan sampai terlambat.",
        "Kepribadiannya berbeda. Risiko fisik seperti banjir bandang: datang tiba-tiba, merusak agunan, lalu surut — LGD yang melonjak. Risiko transisi seperti air pasang: naik perlahan, tidak pernah surut — PD yang merangkak naik tahun demi tahun. Bank butuh kacamata berbeda untuk keduanya.",
        "Tiga miskonsepsi. Satu: 'Climate risk = risiko reputasi/ESG saja.' Bukan — ia adalah risiko kredit finansial: PD dan LGD yang bergerak. Dua: 'Hanya sektor tambang yang kena.' Perkebunan (fisik), semen (transisi), properti pesisir (fisik), otomotif (transisi) — jaringannya luas. Tiga: 'Jangka panjang, nanti saja.' Skenario disorderly justru menghukum yang menunda: transisi tiba-tiba lebih brutal daripada transisi dini.",
      ],
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Portofolio kami tidak ada tambang — aman dari climate risk.” Cek lagi: debitur properti di dataran rendah (banjir), debitur perkebunan (kekeringan), debitur manufaktur dengan biaya energi tinggi (harga karbon). Climate risk bersembunyi di sektor yang tidak berlabel 'iklim'.",
      },
      hints: [
        "Petakan eksposur per sektor terhadap FISIK dan TRANSISI secara terpisah — matriks 2 sumbu.",
        "Agunan properti: cek elevasi dan riwayat banjir, bukan hanya NJOP.",
      ],
      reference: "Fisik = LGD melonjak tiba-tiba. Transisi = PD merangkak naik permanen.",
    },
    {
      id: "ngfs",
      eyebrow: "Langkah 3 · Konsep",
      title: "Tiga dunia NGFS",
      prose: [
        "NGFS (Network for Greening the Financial System) — jaringan bank sentral termasuk Bank Indonesia — merumuskan skenario standar agar bank bisa stress-test iklim dengan bahasa yang sama. Tiga dunia: Orderly (Net Zero 2050) — transisi dimulai dini dan bertahap; syok ekonomi moderat, risiko fisik terkendali. Disorderly — transisi tertunda lalu tiba-tiba dan brutal; syok ekonomi berat ditambah risiko fisik yang sempat menumpuk. Hot house world — kebijakan jalan di tempat; transisi minimal tetapi kerusakan fisik kronis dan parah.",
        "Untuk analis kredit, yang penting bukan suhunya — melainkan TAGIHANNYA per skenario. Orderly: biaya karbon naik gradual, debitur sempat beradaptasi. Disorderly: harga karbon melonjak tiba-tiba + aset fosil terdampar seketika — inilah skenario yang paling menghancurkan PD. Hot house: agunan fisik rusak berulang — LGD yang tergerus.",
        "Cara membaca figur: panjang batang = beratnya tagihan risiko kredit per skenario. Interpretasi: disorderly paling mahal karena menggabungkan yang terburuk dari dua dunia — transisi brutal DAN fisik yang menumpuk selama penundaan. Inilah mengapa 'nanti saja' adalah strategi termahal.",
        "Dua miskonsepsi. Satu: 'Skenario = ramalan.' Bukan — skenario adalah 'bagaimana jika', bukan prediksi. Gunanya untuk menguji ketahanan, bukan menebak masa depan. Dua: 'Cukup pakai satu skenario.' Regulator meminta beberapa — karena keputusan yang aman di orderly bisa fatal di disorderly.",
      ],
      figure: {
        svg: FIG_NGFS,
        alt: "Tiga skenario NGFS dengan berat tagihan berbeda.",
        caption: "Disorderly paling mahal: transisi brutal + fisik menumpuk.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Skenario NGFS adalah 'stress test dengan cerita': bukan sekadar angka shock, melainkan narasi yang konsisten (kebijakan → harga karbon → biaya → arus kas → PD). Cerita yang konsisten membuat asumsi bisa diaudit — dan diaudit berarti bisa dipertahankan di depan regulator.",
      },
      hints: [
        "Selalu pakai minimal 2 skenario (satu transisi-berat, satu fisik-berat) agar tidak buta satu sisi.",
        "Dokumentasikan asumsi harga karbon per skenario — itu angka yang akan ditanya pertama.",
      ],
      reference: "Orderly = dini-terkelola. Disorderly = telat-brutal. Hot house = fisik kronis.",
    },
    {
      id: "transmisi",
      eyebrow: "Langkah 4 · Konsep",
      title: "Jalur transmisi: dari langit ke ECL",
      prose: [
        "Rantai transmisinya mekanis: (1) Syok iklim → (2) arus kas debitur turun (biaya karbon naik, atau produksi terhenti) → (3) debt service coverage ratio (DSCR) turun → (4) PD naik; bila agunan ikut rusak, LGD naik → (5) ECL = PD × LGD × EAD naik. Setiap panah bisa dihitung — inilah yang membuat climate risk menjadi risiko kredit, bukan esai.",
        "Contoh Gali Terus: emisi 12 juta ton × Rp100.000 = biaya karbon Rp1,2 triliun per tahun vs EBITDA Rp800 miliar. Rasio coverage = 800/1200 = 0,67x — di bawah 1, artinya biaya karbon saja melampaui seluruh laba operasional. DSCR runtuh → PD melonjak. Inilah 'stranded asset' dalam bentuk paling konkret: tambang yang secara ekonomi tidak bisa beroperasi di dunia berharga karbon.",
        "Cara membaca figur: dua kotak atas (fisik, transisi) → arus kas turun → PD/LGD/ECL naik. Interpretasi: climate risk tidak punya 'rumus sendiri' — ia masuk lewat variabel yang sudah kamu kenal. Tugas analis adalah mengisi angka syoknya dengan jujur.",
      ],
      formula: String.raw`\text{Rasio coverage} = \frac{\text{EBITDA}}{\text{Emisi (ton)} \times \text{Harga karbon (Rp/ton)}}`,
      formulaNote: "Rasio < 1 = biaya karbon melampaui laba operasional (distress). Contoh: 800 / (10.000.000 × 100.000 / 10^9) = 800/1000 = 0,80x. Interpretasi: tiap Rp1 biaya karbon hanya tertutup Rp0,80 laba.",
      figure: {
        svg: FIG_TRANSMISI,
        alt: "Jalur transmisi risiko iklim ke PD, LGD, dan ECL.",
        caption: "Iklim tidak punya rumus sendiri — ia masuk lewat PD/LGD yang kamu kenal.",
      },
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Emisi kami kecil — aman.” Yang penting bukan emisi absolut, melainkan emisi RELATIF terhadap laba (intensitas). Perkebunan dengan emisi 500 ribu ton tetapi EBITDA Rp500 miliar (rasio 0,1x) jauh lebih aman daripada batubara 12 juta ton dengan EBITDA Rp800 miliar (rasio 0,67x terbalik). Selalu normalisasi ke arus kas.",
      },
      hints: [
        "Hitung intensitas emisi (ton per Rp miliar pendapatan) — metrik pembanding antar debitur.",
        "Untuk LGD: tanyakan 'apakah agunan ini laku di dunia transisi?' — bukan hanya nilainya hari ini.",
      ],
      reference: "Syok → arus kas → DSCR → PD/LGD → ECL. Normalisasi ke laba.",
    },
    {
      id: "lab-karbon",
      eyebrow: "Langkah 5 · Lab",
      title: "Siapa yang tenggelam duluan?",
      prose: [
        "Tiga emiten, satu harga karbon ilustratif Rp100.000/ton. Hitung biaya karbon tahunan (Rp miliar), rasio coverage (EBITDA/biaya), dan tandai yang distress (coverage < 1). Perhatikan: yang emisinya terkecil belum tentu paling aman — yang penting rasionya.",
        "Eksperimen: naikkan harga karbon ke Rp200.000/ton — Batubara jatuh ke 0,40x, Semen ke 0,38x; Perkebunan 5,0x tetap aman. Turunkan ke Rp50.000/ton — Batubara 1,60x dan Semen 1,50x lolos tipis. Inilah sensitivitas yang harus ada di laporan: pada harga karbon berapa tiap debitur jatuh?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `biaya` (Rp M), `coverage`, dan `distress` (bool)" },
        { id: "t2", text: "Jalankan dan pastikan ringkasannya tercetak" },
      ],
      expected: "Batubara: biaya Rp1000.0 M, coverage 0.80x -> DISTRESS\nSemen: biaya Rp800.0 M, coverage 0.75x -> DISTRESS\nPerkebunan: biaya Rp50.0 M, coverage 10.00x -> AMAN",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Semen emisinya 8 juta ton < 10 juta ton batubara — lebih aman.” Coverage Semen = 600/800 = 0,75x — tetap distress, dan hanya sedikit lebih baik dari batubara (0,80x). Peringkat emisi absolut menyesatkan; peringkat coverage yang menentukan siapa gagal bayar duluan.",
      },
      hints: [
        "biaya (Rp M) = emisi_ton × harga_per_ton / 1_000_000_000.",
        "coverage = ebitda / biaya; distress = coverage < 1.",
      ],
      code: {
        starter: "# (nama, emisi ton/tahun, EBITDA Rp M). Harga ilustratif. JANGAN UBAH.\nemiten = [(\"Batubara\", 10_000_000, 800.0),\n          (\"Semen\", 8_000_000, 600.0),\n          (\"Perkebunan\", 500_000, 500.0)]\nharga = 100_000  # Rp/ton\n\n# TULIS KODEMU: biaya (Rp M), coverage, distress\nfor nama, emisi, ebitda in emiten:\n    biaya =\n    coverage =\n    distress =\n    status = \"DISTRESS\" if distress else \"AMAN\"\n    print(f\"{nama}: biaya Rp{biaya:.1f} M, coverage {coverage:.2f}x -> {status}\")\n",
        lockLines: 6,
        solution: "# (nama, emisi ton/tahun, EBITDA Rp M). Harga ilustratif. JANGAN UBAH.\nemiten = [(\"Batubara\", 10_000_000, 800.0),\n          (\"Semen\", 8_000_000, 600.0),\n          (\"Perkebunan\", 500_000, 500.0)]\nharga = 100_000  # Rp/ton\n\n# TULIS KODEMU: biaya (Rp M), coverage, distress\nfor nama, emisi, ebitda in emiten:\n    biaya = emisi * harga / 1_000_000_000\n    coverage = ebitda / biaya\n    distress = coverage < 1\n    status = \"DISTRESS\" if distress else \"AMAN\"\n    print(f\"{nama}: biaya Rp{biaya:.1f} M, coverage {coverage:.2f}x -> {status}\")\n",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Batubara DISTRESS", msg: "0,80x < 1.", pattern: "Batubara: biaya Rp1000\\.0 M, coverage 0\\.80x -> DISTRESS" },
          { kind: "stdout_matches", task: "t2", label: "Perkebunan AMAN", msg: "10,00x.", pattern: "Perkebunan: biaya Rp50\\.0 M, coverage 10\\.00x -> AMAN" }
        ],
      },
      reference: "Coverage < 1 = distress. Peringkat coverage, bukan emisi.",
    },
    {
      id: "lab-skenario",
      eyebrow: "Langkah 6 · Lab",
      title: "ECL tiga dunia",
      prose: [
        "Portofolio Rp5 triliun, LGD 45%, PD awal 2%. Terapkan syok PD tiap skenario NGFS (ilustratif): Orderly +0,5 pp, Disorderly +2,0 pp, Hot house +1,2 pp. Hitung ECL tiap dunia — selisihnya adalah 'harga' memilih skenario yang salah.",
        "Eksperimen: naikkan syok disorderly menjadi +3,5 pp (transisi sangat brutal) — ECL menjadi Rp123,75 M, hampir 2,7x dari orderly. Inilah mengapa regulator meminta skenario berat: keputusan modal harus tahan terhadap dunia terburuk, bukan dunia rata-rata.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `ecl` tiap skenario (Rp M)" },
        { id: "t2", text: "Jalankan dan pastikan ketiganya tercetak" },
      ],
      expected: "Orderly: ECL Rp56.25 M\nDisorderly: ECL Rp90.00 M\nHot house: ECL Rp72.00 M",
      note: {
        title: "Intuisi",
        body: "Selisih Orderly–Disorderly (Rp33,75 M) adalah premi risiko iklim portofolio ini. Bank yang hanya menghitung ECL baseline Rp45 M (tanpa syok) meremehkan risiko sebesar 25–100% tergantung skenario. Stress test iklim = mengukur premi yang selama ini tak terlihat.",
      },
      hints: [
        "ECL = (pd_awal + shock)/100 × lgd × ead.",
        "Shock dalam poin persen — jangan lupa /100.",
      ],
      code: {
        starter: "# (skenario, shock PD dalam poin persen). Ilustratif. JANGAN UBAH.\nskenario = [(\"Orderly\", 0.5), (\"Disorderly\", 2.0), (\"Hot house\", 1.2)]\nead = 5000.0  # Rp M\nlgd = 0.45\npd_awal = 2.0  # persen\n\n# TULIS KODEMU: ECL tiap skenario\necl = {}\nfor nama, shock in skenario:\n    ecl[nama] =\n    print(f\"{nama}: ECL Rp{ecl[nama]:.2f} M\")\n",
        lockLines: 7,
        solution: "# (skenario, shock PD dalam poin persen). Ilustratif. JANGAN UBAH.\nskenario = [(\"Orderly\", 0.5), (\"Disorderly\", 2.0), (\"Hot house\", 1.2)]\nead = 5000.0  # Rp M\nlgd = 0.45\npd_awal = 2.0  # persen\n\n# TULIS KODEMU: ECL tiap skenario\necl = {}\nfor nama, shock in skenario:\n    ecl[nama] = (pd_awal + shock) / 100 * lgd * ead\n    print(f\"{nama}: ECL Rp{ecl[nama]:.2f} M\")\n",
        checks: [
          { kind: "stdout_matches", task: "t1", label: "ECL Disorderly = 90", msg: "4%×0,45×5000.", pattern: "Disorderly: ECL Rp90\\.00 M" },
          { kind: "stdout_matches", task: "t2", label: "Ketiga skenario tercetak", msg: "56,25 / 90,00 / 72,00.", pattern: "Hot house: ECL Rp72\\.00 M" }
        ],
      },
      reference: "ECL skenario = (PD+shock) × LGD × EAD. Selisih = premi risiko iklim.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 7 · Peta keputusan",
      title: "Kapan khawatir, kapan bertindak",
      prose: [
        "Satu: debitur coverage > 3x di semua skenario → monitor tahunan; climate risk bukan prioritasnya. Dua: coverage 1–3x → watchlist iklim: minta rencana transisi debitur (capex hijau, target emisi); pertimbangkan pricing (spread +25–50 bps). Tiga: coverage < 1 di skenario disorderly → aksi: batasi eksposur baru, minta mitigasi (asuransi, diversifikasi), siapkan strategi exit. Empat: agunan properti di zona banjir → revaluasi dengan haircut iklim; jangan tunggu appraisal 3 tahunan.",
        "Aturan praktis 10 detik: hitung coverage di harga karbon Rp100 ribu/ton — di bawah 1 = masalah hari ini, bukan masalah 2050.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Peta ini mengubah climate risk dari 'isu ESG' menjadi 'aturan kredit': ada ambang angka, ada tindakan. Komite kredit tidak butuh ceramah iklim — ia butuh tahu debitur mana yang coverage-nya jebol dan apa yang dilakukan bulan ini.",
      },
      reference: "Coverage >3x = monitor. 1–3x = watchlist + pricing. <1 = batasi + exit plan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 8 · Mini-case",
      title: "Komite kredit yang terbelah",
      prose: [
        "Bank Nusantara: eksposur batubara Rp2 triliun (Gali Terus, coverage 0,67x di Rp100 ribu/ton), semen Rp1,5 triliun (coverage 0,75x), perkebunan Rp1 triliun (coverage 10x). Account officer: 'Semuanya lancar, kenapa diributkan?' Climate risk: 'Di skenario disorderly, dua debitur pertama distress.'",
        "Pertanyaan: (a) Hitung ECL tambahan bila PD Gali Terus naik dari 1,5% ke 6% (LGD 45%, EAD Rp2 T). (b) Apa rekomendasi untuk tiap debitur? (c) Bagaimana menjawab account officer? Pembahasan: (a) ECL awal = 1,5%×45%×2000 = Rp13,5 M; ECL stress = 6%×45%×2000 = Rp54 M; tambahan Rp40,5 M. (b) Gali Terus & semen: watchlist iklim + pricing + batasi eksposur baru; perkebunan: monitor. (c) 'Lancar hari ini' ≠ 'aman': PD adalah probabilitas masa depan — dan masa depan kini punya harga karbon. Tugas komite adalah menilai masa depan, bukan memotret masa lalu.",
        "Satu hal yang sering terlewat: risiko iklim bukan hanya soal bencana alam. Risiko transisi \u2014 perubahan regulasi, teknologi, dan preferensi pasar menuju ekonomi rendah karbon \u2014 bisa sama merusaknya bagi portofolio kredit. Bayangkan debitur tambang batu bara yang tiba-tiba menghadapi pajak karbon dan hilangnya pembeli: arus kasnya runtuh bukan karena banjir, melainkan karena dunia berubah. Analis kredit yang hanya memantau risiko fisik akan buta terhadap separuh ancaman.",
        "Karena itu, kerangka penilaian risiko iklim yang lengkap selalu mencakup dua lensa: fisik dan transisi. Risiko fisik (acute dan chronic) mengancam agunan dan operasional debitur; risiko transisi mengancam model bisnis dan arus kas jangka panjang. Keduanya harus diterjemahkan ke dalam parameter kredit yang kamu kenal: PD naik ketika probabilitas gagal bayar meningkat akibat guncangan iklim; LGD naik ketika nilai agunan terdepresiasi; EAD bisa berubah ketika debitur menarik fasilitas darurat. Iklim bukan kategori risiko baru yang terpisah \u2014 ia adalah penguat (amplifier) dari risiko kredit yang sudah ada.",
        "Mulailah dari portofoliomu sendiri: petakan 10 debitur terbesar ke sektor dan lokasi, lalu tanyakan dua hal sederhana \u2014 seberapa terpapar mereka pada bencana fisik, dan seberapa siap mereka menghadapi transisi rendah karbon. Dua pertanyaan itu saja sudah menempatkanmu di depan kebanyakan analis kredit hari ini.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Perdebatan ini terjadi di bank-bank nyata 2024–2026. Analis yang bisa menghitung 'tambahan ECL Rp40,5 M' memenangkan argumen — karena komite memutuskan dengan angka, bukan dengan narasi iklim.",
      },
      reference: "Jawab dengan angka: ECL stress − ECL baseline = premi yang diperdebatkan.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Fokus pada why — climate risk adalah soal rantai sebab-akibat, bukan hafalan istilah.",
      ],
      tasks: [],
      summary: [
        "Risiko fisik = kerusakan langsung (banjir, kekeringan) → LGD melonjak. Risiko transisi = biaya peralihan (harga karbon) → PD merangkak naik.",
        "NGFS: Orderly (dini-terkelola), Disorderly (telat-brutal, paling mahal), Hot house (fisik kronis).",
        "Transmisi: syok → arus kas → DSCR → PD/LGD → ECL. Climate risk masuk lewat variabel kredit yang sudah dikenal.",
        "Coverage = EBITDA / (emisi × harga karbon); < 1 = distress. Peringkat coverage, bukan emisi absolut.",
        "Keputusan: >3x monitor, 1–3x watchlist + pricing, <1 batasi + exit plan.",
      ],
      next: { label: "CR29 — Sekuritisasi & Risiko Kredit Terstruktur", href: "/learn/cr29-sekuritisasi" },
      quiz: [
        {
          q: "Perbedaan utama risiko fisik vs transisi bagi analis kredit?",
          options: [
            { text: "Fisik: LGD melonjak tiba-tiba; transisi: PD merangkak naik permanen", why: "Benar: fisik merusak agunan/operasional seketika; transisi menggerus arus kas struktural.", correct: true },
            { text: "Fisik hanya untuk asuransi; transisi hanya untuk bank", why: "Keduanya memengaruhi kredit via PD/LGD." },
            { text: "Fisik jangka panjang; transisi jangka pendek", why: "Terbalik: fisik bisa tiba-tiba (banjir), transisi umumnya gradual." },
            { text: "Tidak ada bedanya — keduanya menaikkan ECL sama", why: "Jalur transmisinya beda → mitigasinya beda (asuransi vs pricing/transisi)." }
          ],
        },
        {
          q: "Mengapa skenario disorderly paling mahal bagi kredit?",
          options: [
            { text: "Transisi brutal yang tertunda + kerusakan fisik yang menumpuk", why: "Benar: mendapat yang terburuk dari dua dunia.", correct: true },
            { text: "Karena suhunya paling tinggi", why: "Hot house lebih panas; disorderly mahal karena syok ekonominya." },
            { text: "Karena tidak ada kebijakan sama sekali", why: "Itu hot house world." },
            { text: "Karena ECL-nya selalu dihitung paling akhir", why: "Urutan hitung tidak menentukan besaran." }
          ],
        },
        {
          q: "Debitur A emisi 10 juta ton/EBITDA Rp800 M; debitur B emisi 8 juta ton/EBITDA Rp600 M (harga karbon Rp100 rb/ton). Mana lebih berisiko?",
          options: [
            { text: "A (coverage 0,80x) sedikit lebih buruk dari B (0,75x) — keduanya distress", why: "Benar: 800/1000 = 0,80 vs 600/800 = 0,75; keduanya < 1.", correct: true },
            { text: "B, karena emisinya lebih kecil sehingga lebih mudah diatur", why: "Emisi absolut menyesatkan — yang penting coverage." },
            { text: "Sama saja — keduanya tambang", why: "Bukan keduanya tambang (B semen); dan coverage-nya memang beda." },
            { text: "Tidak bisa dinilai tanpa data NPL", why: "Coverage sudah cukup untuk menilai distress prospektif." }
          ],
        },
        {
          q: "Fungsi skenario NGFS bagi bank?",
          options: [
            { text: "'Bagaimana jika' yang konsisten untuk stress test — bukan ramalan", why: "Benar: menguji ketahanan, bukan memprediksi.", correct: true },
            { text: "Ramalan suhu 2050 untuk laporan tahunan", why: "Skenario ≠ ramalan." },
            { text: "Syarat sertifikasi analis", why: "Bukan syarat formal — ini alat kerja." },
            { text: "Pengganti model PD internal", why: "Skenario memberi syok; model PD tetap milik bank." }
          ],
        },
        {
          q: "Coverage debitur 0,8x di harga karbon Rp100 ribu/ton. Tindakan tepat?",
          options: [
            { text: "Watchlist iklim: batasi eksposur baru, minta rencana transisi, siapkan exit", why: "Benar: < 1 = distress prospektif → aksi, bukan monitor.", correct: true },
            { text: "Monitor tahunan seperti biasa", why: "Itu untuk coverage > 3x." },
            { text: "Langsung hapus buku kreditnya", why: "Terlalu ekstrem — debitur masih membayar; yang dibutuhkan mitigasi." },
            { text: "Naikkan suku bunga 5% sekaligus", why: "Repricing brutal mempercepat default — gunakan spread bertahap + kovenan." }
          ],
        }
      ],
      reference: "Fisik vs transisi. Tiga skenario. Coverage < 1 = bertindak.",
    },
  ],
};
