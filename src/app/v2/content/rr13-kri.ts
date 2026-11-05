import type { V2Lesson } from "../lib/types";

// Leading vs lagging: KRI naik duluan, KPI menyusul.
const FIG_LEAD = `<svg viewBox=\"0 0 480 280\" role=\"img\" aria-label=\"Dua kurva: KRI leading naik tiga bulan lebih awal dari NPL.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"50\" y1=\"230\" x2=\"450\" y2=\"230\"/><line x1=\"50\" y1=\"170\" x2=\"450\" y2=\"170\"/>
<line x1=\"50\" y1=\"110\" x2=\"450\" y2=\"110\"/><line x1=\"50\" y1=\"50\" x2=\"450\" y2=\"50\"/>
</g>
<path d=\"M50,200 C110,190 140,150 200,140 C260,130 300,120 450,110\" fill=\"none\" stroke=\"var(--c2)\" stroke-width=\"2.5\"/>
<path d=\"M50,215 C170,210 230,180 290,170 C350,160 400,140 450,130\" fill=\"none\" stroke=\"var(--c1)\" stroke-width=\"2.5\"/>
<g font-family=\"var(--font-ui)\" font-size=\"12\" font-weight=\"600\">
<text x=\"400\" y=\"100\" fill=\"var(--c2)\">KRI: restrukturisasi</text>
<text x=\"400\" y=\"160\" fill=\"var(--c1)\">KPI: NPL</text>
</g>
<line x1=\"200\" y1=\"60\" x2=\"200\" y2=\"230\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/>
<line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"230\" stroke=\"var(--c4)\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/>
<text x=\"260\" y=\"80\" font-size=\"12\" fill=\"var(--c4)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\" font-weight=\"600\">lead time: 3 bulan</text>
<text x=\"260\" y=\"98\" font-size=\"11\" fill=\"var(--text-muted)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">jendela untuk bertindak</text>
<g fill=\"var(--chart-text)\" font-size=\"10\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<text x=\"50\" y=\"246\">1</text><text x=\"150\" y=\"246\">4</text><text x=\"250\" y=\"246\">7</text><text x=\"350\" y=\"246\">10</text><text x=\"450\" y=\"246\">12</text>
</g>
<text x=\"250\" y=\"264\" font-size=\"11\" fill=\"var(--chart-text)\" font-family=\"var(--font-ui)\" text-anchor=\"middle\">Bulan</text>
</svg>`;

export const rr13: V2Lesson = {
  slug: "rr13-kri",
  track: "Risk Reporting",
  module: "Komunikasi Risiko",
  title: "RR13 — KPI vs KRI",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Training yang naik, NPL yang naik juga",
      prose: [
        "Laporan tahunan bank memamerkan: \u201Cjam training karyawan naik 40% — investasi pada kualitas SDM!\u201D Di halaman yang sama, NPL naik dari 3,1% ke 3,9%. Tidak ada yang menghubungkan keduanya — karena memang tidak berhubungan. \u201CJam training\u201D adalah vanity metric: terlihat bagus, tidak memprediksi apa-apa, tidak memicu tindakan apa-apa.",
        "Twist-nya: di data yang sama tersembunyi indikator yang benar-benar prediktif — pertumbuhan restrukturisasi kredit, yang mulai naik TIGA BULAN sebelum NPL bergerak. Tiga bulan = jendela untuk bertindak: memperketat penagihan, menambah CKPN, membekukan limit. Bank itu punya early warning system gratis di datanya sendiri — tetapi sibuk memamerkan jam training. Pelajaran: bukan soal punya indikator, melainkan punya indikator yang benar-benar memberi peringatan dini.",
        "Setelah lesson ini kamu bisa: (1) membedakan KPI dan KRI; (2) menguji lead time indikator dengan korelasi lag; (3) merancang KRI yang actionable.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Vanity metric = rasa aman palsu yang dilaporkan resmi. Tiga bulan jendela peringatan yang terbuang = tiga bulan eksposur berjalan tanpa rem. Memilih indikator yang salah = tidak punya indikator.",
      },
      reference: "Vanity metric memamerkan; KRI memperingatkan. Pilih yang kedua.",
    },
    {
      id: "kpi-kri",
      eyebrow: "Langkah 2 · KPI vs KRI",
      title: "Spion vs lampu depan",
      prose: [
        "KPI (Key Performance Indicator) = melihat ke belakang: NPL bulan ini, laba kuartal ini. Ia mengukur HASIL. KRI (Key Risk Indicator) = melihat ke depan: pertumbuhan restrukturisasi, penurunan coverage, konsentrasi top-20. Ia mengukur RISIKO YANG AKAN DATANG. Analogi: KPI = spion (melihat yang sudah lewat), KRI = lampu depan (melihat jalan di depan). Mobil butuh keduanya — tetapi untuk menghindari tabrakan, lampu depan yang menentukan.",
        "Syarat KRI yang baik — SMART-R: Spesifik (\u201Cpertumbuhan restrukturisasi SME\u201D, bukan \u201Ckualitas kredit\u201D), Measurable (ada angkanya tiap bulan), Actionable (bergerak → ada tindakan baku), Relevant (terbukti mendahului KPI), Timely (datang cukup awal untuk bertindak). \u201CJam training\u201D gagal di Actionable dan Relevant — makanya ia vanity.",
      ],
      tasks: [],
      formula: String.raw`r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}`,
      formulaNote: "r = korelasi Pearson (−1 sampai 1): x = KRI kandidat, y = NPL, x̄/ȳ = rata-ratanya. Uji pada lag 0–3 bulan: korelasi tertinggi di lag 3 = KRI mendahului NPL 3 bulan. Interpretasi: r > 0,7 pada lag > 0 = kandidat KRI yang kuat.",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKPI yang bagus = KRI yang bagus.\u201D NPL adalah KPI terbaik untuk kualitas kredit — dan KRI terburuk, karena ia bergerak SETELAH kerusakan terjadi. Indikator yang sempurna untuk menilai masa lalu biasanya buta terhadap masa depan. Jangan pakai spion sebagai lampu depan.",
      },
      hints: [
        "Intuisi: uji setiap KRI terhadap histori krisis — \u201Capakah indikator ini bergerak SEBELUM NPL naik tahun 2020?\u201D Tidak = bukan KRI.",
        "KRI tanpa tindakan baku = trivia. Setiap KRI wajib punya pasangan: \u201Cjika X > batas, maka Y\u201D.",
      ],
      reference: "KPI = hasil (spion). KRI = peringatan (lampu depan). SMART-R.",
    },
    {
      id: "lab-lead",
      eyebrow: "Langkah 3 · Lab",
      title: "Uji siapa yang leading: korelasi lag",
      prose: [
        "Dua kandidat KRI: A = pertumbuhan restrukturisasi, B = jumlah komplain nasabah. Lab menghitung korelasi Pearson tiap kandidat dengan NPL pada lag 0–3 bulan, lalu memilih lag dengan korelasi tertinggi sebagai lead time.",
        "Hasil: A lead 3 bulan (r = 1,00) — lampu depan yang sempurna. B lead 0 bulan (r = 0,89) — bergerak BERSAMAAN dengan NPL, alias spion kedua. Keputusan: adopsi A sebagai KRI resmi dengan threshold + tindakan baku; B tetap dipantau sebagai KPI layanan, bukan KRI risiko.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi fungsi `pearson` dan loop lag 0–3" },
        { id: "t2", text: "Jalankan dan tentukan KRI pemenangnya" },
      ],
      expected: "A-restrukturisasi: lead 3 bulan (r=1.00)\nB-komplain: lead 0 bulan (r=0.89)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CBanyak indikator = terpantau.\u201D 20 indikator tanpa lead time teruji = 20 vanity metric yang sibuk. Satu KRI dengan lead 3 bulan yang teruji > sepuluh indikator \u201Ckayaknya penting\u201D. Kualitas > kuantitas, selalu.",
      },
      hints: [
        "pearson: r = sxy / sqrt(sxx * syy).",
        "Untuk lag L: korelasikan k[:12-L] dengan npl[L:].",
        "Pilih lag dengan r tertinggi memakai max(range(4), key=...).",
      ],
      code: {
        starter: `# NPL 12 bulan + 2 kandidat KRI. JANGAN UBAH baris ini.\nnpl  = [2.8,2.8,2.8,2.9,3.0,3.1,3.2,3.3,3.4,3.4,3.5,3.5]\nkriA = [1.2,1.5,1.8,2.1,2.4,2.6,2.7,2.8,2.9,3.0,3.0,3.1]\nkriB = [5.1,5.0,5.2,5.1,5.3,5.2,5.4,5.3,5.5,5.6,5.8,6.0]\n\n# TULIS KODEMU: korelasi Pearson\ndef pearson(x, y):\n    n = len(x); mx = sum(x)/n; my = sum(y)/n\n    sxy = sum((a-mx)*(b-my) for a, b in zip(x, y))\n    sxx = sum((a-mx)**2 for a in x); syy = sum((b-my)**2 for b in y)\n    return\n\n# TULIS KODEMU: cari lead time (lag 0-3) tiap kandidat\nfor nama, k in [("A-restrukturisasi", kriA), ("B-komplain", kriB)]:\n    best =\n    r = pearson(k[:12-best], npl[best:])\n    print(f"{nama}: lead {best} bulan (r={r:.2f})")`,
        lockLines: 4,
        solution: `# NPL 12 bulan + 2 kandidat KRI. JANGAN UBAH baris ini.\nnpl  = [2.8,2.8,2.8,2.9,3.0,3.1,3.2,3.3,3.4,3.4,3.5,3.5]\nkriA = [1.2,1.5,1.8,2.1,2.4,2.6,2.7,2.8,2.9,3.0,3.0,3.1]\nkriB = [5.1,5.0,5.2,5.1,5.3,5.2,5.4,5.3,5.5,5.6,5.8,6.0]\n\n# TULIS KODEMU: korelasi Pearson\ndef pearson(x, y):\n    n = len(x); mx = sum(x)/n; my = sum(y)/n\n    sxy = sum((a-mx)*(b-my) for a, b in zip(x, y))\n    sxx = sum((a-mx)**2 for a in x); syy = sum((b-my)**2 for b in y)\n    return sxy / ((sxx * syy) ** 0.5)\n\n# TULIS KODEMU: cari lead time (lag 0-3) tiap kandidat\nfor nama, k in [("A-restrukturisasi", kriA), ("B-komplain", kriB)]:\n    best = max(range(4), key=lambda L: pearson(k[:12-L], npl[L:]))\n    r = pearson(k[:12-best], npl[best:])\n    print(f"{nama}: lead {best} bulan (r={r:.2f})")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "A-restrukturisasi: lead 3 bulan \\(r=1\\.0", label: "A lead 3 bulan", msg: "Restrukturisasi mendahului NPL 3 bulan — KRI sejati." },
          { kind: "stdout_matches", task: "t2", pattern: "B-komplain: lead 0 bulan \\(r=0\\.89\\)", label: "B lead 0 bulan", msg: "Komplain bergerak bersamaan — bukan early warning." },
        ],
      },
      reference: "Korelasi per lag; lag terbaik = lead time. r > 0.7 & lag > 0 = KRI kuat.",
    },
    {
      id: "merancang",
      eyebrow: "Langkah 4 · Merancang KRI",
      title: "Dari kandidat ke KRI resmi",
      prose: [
        "Langkah merancang: (1) daftar kandidat dari pengalaman + histori krisis; (2) uji lead time seperti lab Langkah 3 — minimal 12 bulan data; (3) tetapkan threshold dari distribusi historis (mis. persentil 90) + batas regulasi; (4) pasangkan tiap threshold dengan tindakan baku (\u201CKRI merah → bekukan limit, pemilik Kadiv\u201D); (5) review tahunan — KRI bisa basi saat bisnis berubah.",
        "Red flags vanity metric: selalu naik (tidak pernah memberi sinyal buruk), tidak ada yang bertindak saat ia bergerak, tidak bisa diuji terhadap histori (\u201Ckayaknya penting\u201D), dan — yang paling jelas — ia dipilih karena terlihat bagus di laporan tahunan, bukan karena memprediksi sesuatu.",
        "Cara membaca figur: kurva oranye (KRI) naik duluan; kurva biru (NPL) menyusul 3 bulan kemudian; pita putus-putus = jendela bertindak. Interpretasi: lebar jendela = nilai KRI. KRI dengan lead 1 minggu untuk risiko yang butuh 1 bulan respons = tidak berguna.",
      ],
      figure: {
        svg: FIG_LEAD,
        alt: "Dua kurva: KRI leading naik tiga bulan lebih awal dari NPL.",
        caption: "KRI (oranye) mendahului NPL (biru) 3 bulan — itulah jendela bertindak.",
      },
      tasks: [],
      hints: [
        "Intuisi: KRI yang baik membuatmu merasa \u201Ctidak nyaman duluan\u201D — ia berbunyi saat semua masih terlihat baik-baik saja. Jika KRI-mu selalu menenangkan, ia bukan KRI.",
        "Lead time harus > waktu respons. Peringatan 3 bulan untuk tindakan yang butuh 1 bulan = berguna. Peringatan 1 minggu = terlambat.",
      ],
      reference: "Kandidat → uji lead → threshold → tindakan baku → review tahunan.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Threshold",
      title: "Threshold dari distribusi: persentil, bukan tebakan",
      prose: [
        "Threshold 'angka bulat yang enak' (10%, 20%) = tebakan berseragam. Cara profesional: threshold merah = persentil 90 dari 24 bulan histori. Artinya hanya 10% bulan tersibuk yang menyala merah — langka = berarti. Di lab: 24 bulan pertumbuhan restrukturisasi diurutkan, p90 = 17%.",
        "Aturan status: bulan ini 21% > p90 (17%) → MERAH. Ditambah syarat persistensi dari RR7: merah dua bulan berturut-turut → tindakan baku (bekukan limit). Satu bulan merah = waspada; dua bulan = aksi. Ini mencegah alert berteriak karena satu data point.",
        "Gabungkan dengan batas regulasi: pakai yang LEBIH KETAT. Jika ketentuan menyebut 15% dan p90 internal 17% → threshold 15%. Distribusi memberi tahu 'normal untuk kita'; regulasi memberi tahu 'wajib'. Keduanya benar; yang ketat yang menang.",
        "Review tahunan wajib: distribusi bergeser saat bisnis berubah. Threshold 2024 yang dihitung dari data 2022–2023 bisa basi di 2026 — portofolio tumbuh, segmen berubah. Kalibrasi ulang threshold adalah bagian dari definisi KRI, bukan revisi darurat. Jadwalkan bersama review kamus metrik.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `p90`, `p75`, dan `status` bulan ini" },
        { id: "t2", text: "Jalankan dan pastikan status tercetak" },
      ],
      expected: "p90 = 17%, bulan ini 21% -> MERAH",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Threshold = angka bulat yang enak (10%, 20%).” Enak di lidah, sembarang di data. Threshold 20% saat p90-mu 12% = merah menyala tiap bulan = alert fatigue. Threshold dari distribusi = merah yang langka = merah yang berarti.",
      },
      hints: [
        "Urutkan dulu: s = sorted(hist).",
        "p90 = s[int(0.9 * len(s))].",
      ],
      code: {
        starter: "# 24 bulan histori pertumbuhan restrukturisasi % MoM (JANGAN UBAH).\nhist = [4,6,5,8,7,9,6,11,8,10,12,9,13,11,14,12,16,13,15,17,14,19,16,22]\nbulan_ini = 21\n\n# TULIS KODEMU: p90 + status bulan ini\ns =\np90 =\np75 =\nstatus =  # MERAH jika > p90, KUNING jika > p75, selain itu HIJAU\n\nprint(f\"p90 = {p90}%, bulan ini {bulan_ini}% -> {status}\")",
        lockLines: 3,
        solution: "# 24 bulan histori pertumbuhan restrukturisasi % MoM (JANGAN UBAH).\nhist = [4,6,5,8,7,9,6,11,8,10,12,9,13,11,14,12,16,13,15,17,14,19,16,22]\nbulan_ini = 21\n\n# TULIS KODEMU: p90 + status bulan ini\ns = sorted(hist)\np90 = s[int(0.9 * len(s))]\np75 = s[int(0.75 * len(s))]\nstatus = \"MERAH\" if bulan_ini > p90 else (\"KUNING\" if bulan_ini > p75 else \"HIJAU\")\n\nprint(f\"p90 = {p90}%, bulan ini {bulan_ini}% -> {status}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`p90` = 17", msg: "Nilai ke-22 dari 24 data terurut = 17.", name: "p90", value: 17, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "`status` = MERAH", msg: "21 > 17.", name: "status", value: "MERAH" },
          { kind: "stdout_matches", task: "t2", label: "Status tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "p90 = 17%, bulan ini 21% -> MERAH" }
        ],
      },
      reference: "Threshold merah = p90 histori 24 bulan; pakai yang lebih ketat vs regulasi.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Tren KRI",
      title: "Titik vs tren",
      prose: [
        "Lab pertama memakai persentil untuk threshold. Lab ini menambahkan dimensi waktu: KRI 12% → 15% → 21% menunjukkan tren NAIK dengan kenaikan 9 pp dalam 3 bulan. Satu titik 21% = MERAH; tren naik 3 bulan = MERAH yang memburuk — responsnya berbeda (investigasi vs intervensi).",
        "Aturan praktis: titik melewati ambang = waspada; 3 titik berturut-turut naik = eskalasi; 3 bulan di atas ambang = rencana aksi formal. KRI tanpa tren = foto; KRI dengan tren = film.",
      ],
      tasks: [
        { id: "t1", text: "Tentukan arah tren 3 bulan" },
        { id: "t2", text: "Jalankan dan pastikan tren tercetak" },
      ],
      expected: "Tren 3 bulan: [12, 15, 21] -> NAIK (+9 pp)",
      note: {
        title: "Tren pendek = noise.",
        type: "pitfall",
        body: "“Naik 2 bulan, pasti memburuk.” Dua titik tidak membuat tren — bisa noise musiman. Syarat minimum 3 titik searah, dan selalu cek kalender: kenaikan NPL tiap Desember adalah musiman, bukan kiamat.",
      },
      hints: [
        "NAIK bila kri[-1] > kri[-2] > kri[0].",
        "selisih = kri[-1] - kri[0].",
      ],
      code: {
        starter: "# KRI 3 bulan (%). JANGAN UBAH.\nkri = [12, 15, 21]\n\n# TULIS KODEMU: arah tren + selisih\ntren = \"NAIK\" if kri[-1] > kri[-2] > kri[0] else \"TIDAK JELAS\"\nselisih = \nprint(f\"Tren 3 bulan: {kri} -> {tren} (+{selisih} pp)\")",
        lockLines: 4,
        solution: "# KRI 3 bulan (%). JANGAN UBAH.\nkri = [12, 15, 21]\n\n# TULIS KODEMU: arah tren + selisih\ntren = \"NAIK\" if kri[-1] > kri[-2] > kri[0] else \"TIDAK JELAS\"\nselisih = kri[-1] - kri[0]\nprint(f\"Tren 3 bulan: {kri} -> {tren} (+{selisih} pp)\")",
        checks: [
          { kind: "equal", task: "t1", label: "`selisih` = 9", msg: "21 - 12 = 9 pp.", name: "selisih", value: 9 },
          { kind: "stdout_matches", task: "t2", label: "Tren tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Tren 3 bulan: \\[12, 15, 21\\] -> NAIK \\(\\+9 pp\\)" }
        ],
      },
      reference: "Titik = foto; tren = film. 3 titik searah = eskalasi; waspadai musiman.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kapan KPI cukup, kapan butuh KRI",
      prose: [
        "Satu: memantau kinerja masa lalu (evaluasi cabang) → KPI cukup; yang dinilai = hasil. Dua: mencegah kerugian masa depan (kualitas kredit) → KRI wajib; yang dibutuhkan = peringatan. Tiga: risiko bergerak cepat (likuiditas harian, fraud) → KRI real-time + alert otomatis. Empat: risiko lambat (konsentrasi portofolio) → KRI bulanan + review komite.",
        "Aturan praktis 10 detik: tanya \u201Cjika indikator ini bergerak, apakah saya masih sempat bertindak?\u201D Ya = KRI yang baik. Tidak = itu KPI berkedok KRI — ganti.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Risiko bergerak cepat (likuiditas harian, fraud) → KRI real-time dengan threshold p90 dari data harian. Risiko lambat (konsentrasi) → KRI bulanan. Kecepatan risiko menentukan granularitas threshold — bukan sebaliknya.",
      },
      reference: "Evaluasi = KPI. Pencegahan = KRI. Cepat = real-time. Lambat = bulanan.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Pilih KRI dari tiga kandidat",
      prose: [
        "Kandidat untuk KRI kualitas kredit SME: (A) pertumbuhan restrukturisasi — lead 3 bulan, r = 1,00 (dari lab); (B) jumlah komplain — lead 0 bulan, r = 0,89; (C) jam training analis kredit — tidak berkorelasi dengan NPL (r = 0,12), tetapi \u201Cterlihat bagus di laporan\u201D.",
        "Keputusan: adopsi A sebagai KRI resmi (threshold: pertumbuhan > 15% MoM selama 2 bulan berturut-turut → status MERAH → bekukan limit baru SME). B tetap sebagai KPI layanan pelanggan. C: buang dari laporan risiko (pindahkan ke laporan HRD jika perlu). Satu kalimat untuk direksi: \u201CKami mengganti 3 indikator pajangan dengan 1 indikator yang memberi peringatan 3 bulan lebih awal.\u201D",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Mempertahankan C (jam training) di laporan risiko = membayar \u201Cpajak vanity\u201D tiap bulan: waktu baca direksi untuk angka yang tidak memprediksi apa-apa. Pajak ini dibayar dengan perhatian — mata uang termahal direksi.",
      },
      reference: "Adopsi yang leading + actionable; buang yang vanity meski terlihat bagus.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Lalu audit satu indikator di laporan kantormu: KPI atau KRI?",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Audit satu indikator di laporan kantormu minggu ini: threshold-nya dari distribusi atau dari 'angka enak'? Jika yang kedua, hitung p90-nya dengan lab ini — 5 menit yang mengubah kualitas KRI-mu.",
      },

      summary: [
        "KPI = hasil masa lalu (spion); KRI = peringatan masa depan (lampu depan).",
        "KRI baik = SMART-R: spesifik, terukur, actionable, relevan, timely.",
        "Uji lead time dengan korelasi lag; r > 0,7 & lag > 0 = KRI kuat.",
        "Setiap KRI wajib punya threshold + tindakan baku + pemilik.",
        "Vanity metric: selalu menenangkan, tak teruji, tak actionable — buang.",
      ],
      next: { label: "RR14 — Capstone: Paket Laporan Bulanan CRO", href: "/learn/rr14-capstone" },
      quiz: [
        {
          q: "Mengapa NPL adalah KPI yang baik tetapi KRI yang buruk?",
          options: [
            { text: "Karena sulit dihitung", why: "NPL mudah dihitung — masalahnya bukan itu." },
            { text: "Karena ia bergerak setelah kerusakan terjadi — spion, bukan lampu depan", why: "Tepat. NPL menilai masa lalu dengan sempurna, masa depan tidak.", correct: true },
            { text: "Karena regulator tidak memakainya", why: "Regulator justru memakainya — sebagai KPI." },
          ],
        },
        {
          q: "Kandidat A lead 3 bulan (r=1,00), B lead 0 (r=0,89). Mana KRI?",
          options: [
            { text: "B, karena korelasinya juga tinggi", why: "Korelasi tinggi tanpa lead = bergerak bersamaan = bukan peringatan dini." },
            { text: "A, karena mendahului 3 bulan dengan korelasi sempurna", why: "Benar. Lead time adalah nyawa KRI.", correct: true },
            { text: "Keduanya sama baiknya", why: "B tidak memberi jendela bertindak — nilainya sebagai KRI nol." },
          ],
        },
        {
          q: "Ciri vanity metric?",
          options: [
            { text: "Selalu menenangkan, tak teruji terhadap histori, tak memicu tindakan", why: "Tepat — seperti \u201Cjam training\u201D di cerita pembuka.", correct: true },
            { text: "Angkanya selalu akurat", why: "Akurat ≠ berguna. Vanity metric bisa sangat akurat dan tetap tak berguna." },
            { text: "Susah dihitung", why: "Vanity metric biasanya justru mudah dihitung." },
          ],
        },
        {
          q: "KRI tanpa tindakan baku itu?",
          options: [
            { text: "Tetap berguna sebagai informasi", why: "Informasi tanpa aksi = trivia yang memakan perhatian direksi." },
            { text: "Trivia — setiap KRI wajib punya pasangan \u201Cjika X maka Y\u201D", why: "Benar. Actionable adalah syarat, bukan bonus.", correct: true },
          ],
        },
        {
          q: "Lead time 1 minggu untuk risiko yang butuh respons 1 bulan. Nilai KRI?",
          options: [
            { text: "Tetap berguna", why: "Peringatan yang datang setelah batas bertindak = bukan peringatan." },
            { text: "Tidak berguna — lead time harus melebihi waktu respons", why: "Tepat. Jendela yang lebih sempit dari waktu reaksi = ilusi.", correct: true },
          ],
        },
      ],
    },
  ],
};
