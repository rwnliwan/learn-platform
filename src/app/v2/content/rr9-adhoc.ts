import type { V2Lesson } from "../lib/types";

// Matriks triase 2x2: urgensi vs dampak.
const FIG_TRIAGE = `<svg viewBox=\"0 0 480 300\" role=\"img\" aria-label=\"Matriks triase dua kali dua: urgensi versus dampak.\">
<g stroke=\"var(--chart-grid)\" stroke-width=\"1\">
<line x1=\"240\" y1=\"30\" x2=\"240\" y2=\"250\"/><line x1=\"30\" y1=\"140\" x2=\"450\" y2=\"140\"/>
</g>
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<rect x=\"250\" y=\"40\" width=\"190\" height=\"90\" fill=\"var(--c4)\" opacity=\"0.85\" rx=\"8\"/>
<text x=\"345\" y=\"72\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">KERJAKAN</text>
<text x=\"345\" y=\"90\" font-size=\"11\" fill=\"#fff\">mendesak + berdampak</text>
<text x=\"345\" y=\"106\" font-size=\"11\" fill=\"#fff\">eksposur properti</text>
<rect x=\"40\" y=\"40\" width=\"190\" height=\"90\" fill=\"var(--c2)\" opacity=\"0.85\" rx=\"8\"/>
<text x=\"135\" y=\"72\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">JADWALKAN</text>
<text x=\"135\" y=\"90\" font-size=\"11\" fill=\"#fff\">berdampak, tak Mendesak</text>
<text x=\"135\" y=\"106\" font-size=\"11\" fill=\"#fff\">benchmark peer</text>
<rect x=\"250\" y=\"150\" width=\"190\" height=\"90\" fill=\"var(--c3)\" opacity=\"0.85\" rx=\"8\"/>
<text x=\"345\" y=\"182\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">DELEGASIKAN</text>
<text x=\"345\" y=\"200\" font-size=\"11\" fill=\"#fff\">Mendesak, dampak kecil</text>
<text x=\"345\" y=\"216\" font-size=\"11\" fill=\"#fff\">definisi ulang</text>
<rect x=\"40\" y=\"150\" width=\"190\" height=\"90\" fill=\"var(--text-muted)\" opacity=\"0.45\" rx=\"8\"/>
<text x=\"135\" y=\"182\" font-size=\"13\" font-weight=\"600\" fill=\"#fff\">TOLAK/TUNDA</text>
<text x=\"135\" y=\"200\" font-size=\"11\" fill=\"#fff\">tak Mendesak, dampak kecil</text>
<text x=\"135\" y=\"216\" font-size=\"11\" fill=\"#fff\">tren 5 tahun</text>
<text x=\"240\" y=\"272\" font-size=\"12\" fill=\"var(--chart-text)\">urgensi →</text>
<text x=\"16\" y=\"145\" font-size=\"12\" fill=\"var(--chart-text)\" transform=\"rotate(-90 16 145)\">dampak →</text>
</g>
</svg>`;

export const rr9: V2Lesson = {
  slug: "rr9-adhoc",
  track: "Risk Reporting",
  module: "Operasi & Regulasi",
  title: "RR9 — Menjawab Permintaan Adhoc dalam 2 Jam",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Satu jam sebelum rapat direksi",
      prose: [
        "Pukul 13:00, pesan masuk: \u201CDireksi butuh eksposur ke sektor properti, rapat jam 14:00.\u201D Andi panik. Ia menarik seluruh data kredit properti 5 tahun, membuat 4 tabel, 2 grafik — dan mengirim 7 menit sebelum rapat. Di rapat, direksi hanya bertanya satu hal: \u201Cjadi totalnya berapa, di atas batas atau tidak?\u201D Jawabannya — Rp380 miliar, 12% di bawah batas — ada di halaman 3, tidak terbaca. Keputusan ditunda.",
        "Twist-nya: Andi bekerja 55 menit untuk hal yang tidak ditanya, dan 5 menit untuk hal yang ditanya. Ia menjawab pertanyaan yang ia BAYANGKAN (\u201Cmereka pasti mau detail\u201D), bukan pertanyaan yang sebenarnya (\u201Cberapa angkanya dan apakah aman\u201D). Pelajaran: kecepatan tanpa triase = lembur yang tidak berguna. Analis adhoc yang baik bukan yang tercepat menghitung — melainkan yang tercepat memahami apa yang sebenarnya ditanya.",
        "Setelah lesson ini kamu bisa: (1) melakukan triase permintaan dalam 10 menit; (2) memprioritaskan antrean permintaan dengan skor; (3) mengirim jawaban 80% dengan caveat yang jujur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Jawaban adhoc yang salah arah = direksi memutuskan tanpa data yang benar. Lebih buruk: analis yang selalu \u201Csibuk detail\u201D kehilangan kepercayaan — permintaan berikutnya langsung ke orang lain, dan fungsi risk reporting kehilangan relevansinya.",
      },
      reference: "Pahami dulu apa yang ditanya, baru hitung. Triase > kecepatan.",
    },
    {
      id: "triase",
      eyebrow: "Langkah 2 · Triase 10 menit",
      title: "Tiga pertanyaan sebelum menyentuh data",
      prose: [
        "Pertanyaan 1: Keputusan apa yang akan diambil? (\u201Cmenyetujui limit\u201D butuh angka + rekomendasi; \u201Csekadar tahu\u201D butuh satu angka.) Pertanyaan 2: Seberapa presisi yang dibutuhkan? (Keputusan Rp200 miliar butuh rekonsiliasi; \u201Cgambaran kasar\u201D cukup estimasi + caveat.) Pertanyaan 3: Kapan benar-benar dibutuhkan, dan apa yang terjadi jika telat? (Rapat jam 14:00 = keras; \u201Ckapan-kapan\u201D = negosiasi.)",
        "Sepuluh menit triase menghemat 50 menit kerja salah arah. Rumus kasarnya: 10 menit bertanya > 60 menit menghitung buta. Analis senior bukan yang paling jago Python — melainkan yang paling berani bertanya balik ke direksi: \u201Cuntuk keputusan apa, Pak/Bu?\u201D",
      ],
      formula: String.raw`\text{Skor prioritas} = \frac{\text{urgensi} \times \text{dampak}}{\text{effort (jam)}}`,
      formulaNote: "urgensi 1–5 (seberapa Mendesak), dampak 1–5 (seberapa besar keputusan), effort = estimasi jam kerja. Contoh: eksposur properti = 5×5/1 = 25 (kerjakan sekarang); tren 5 tahun = 4×2/8 = 1 (tunda). Interpretasi: skor tinggi = kerjakan dulu; bukan soal siapa yang meminta paling keras.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CJawab persis yang ditanya, secepat mungkin.\u201D Yang ditanya sering bukan yang dibutuhkan. \u201CKirim data NPL 5 tahun\u201D biasanya berarti \u201Csaya khawatir tentang tren — tenangkan saya atau beri alasan khawatir\u201D. Menjawab literal tanpa klarifikasi = mengirim 5 tahun data ke orang yang butuh 1 kalimat.",
      },
      hints: [
        "Intuisi: permintaan adhoc = gejala; keputusan = penyakit. Obati keputusannya, bukan gejalanya.",
        "Kalimat ajaib: \u201CJika saya hanya bisa memberi satu angka dalam 1 jam, angka apa yang paling membantu keputusan Bapak/Ibu?\u201D",
      ],
      reference: "Keputusan apa? Seberapa presisi? Kapan? — 10 menit triase sebelum data.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 3 · Lab",
      title: "Mesin antrean: skor lima permintaan",
      prose: [
        "Lima permintaan menumpuk di mejamu. Lab ini menghitung skor prioritas tiap permintaan dan mengurutkannya. Perhatikan hasilnya: \u201CEksposur properti (direksi)\u201D skor 25 — kerjakan sekarang. \u201CTren 5 tahun (regulator)\u201D skor 1,0 — antre paling belakang meski pemintanya bergengsi.",
        "Poin penting: skor ini BUKAN soal siapa yang meminta paling senior — melainkan rasio nilai per jam kerjamu. Itu membuatnya bisa dipertahankan saat ada yang protes: \u201Cini antrean berdasarkan urgensi × dampak per effort, Pak — mau saya tunjukkan perhitungannya?\u201D",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi perhitungan `skor` dan pengurutan" },
        { id: "t2", text: "Jalankan dan baca urutan kerjanya" },
      ],
      expected: "25.0 Eksposur properti (direksi)\n5.3 NPL by cabang (komite)\n2.0 Definisi ulang (internal)\n1.5 Benchmark peer (CRO)\n1.0 Tren 5 tahun (regulator)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CKerjakan yang diminta orang paling senior dulu.\u201D Senioritas peminta ≠ prioritas pekerjaan. Skor membuat keputusanmu transparan dan bisa dipertahankan — termasuk saat harus berkata \u201Cpermintaan Bapak antre nomor 4\u201D.",
      },
      hints: [
        "skor = urgensi * dampak / effort untuk tiap tuple.",
        "Urutkan menurun: sorted(..., reverse=True).",
        "Format skor dengan :.1f.",
      ],
      code: {
        starter: `# (nama, urgensi, dampak, effort_jam). JANGAN UBAH baris ini.\nreq = [("Eksposur properti (direksi)", 5, 5, 1),\n       ("NPL by cabang (komite)", 4, 4, 3),\n       ("Benchmark peer (CRO)", 3, 3, 6),\n       ("Tren 5 tahun (regulator)", 4, 2, 8),\n       ("Definisi ulang (internal)", 2, 2, 2)]\n\n# TULIS KODEMU: hitung skor dan urutkan menurun\nantre = \nfor skor, nama in antre:\n    print(f"{skor:.1f} {nama}")`,
        lockLines: 6,
        solution: `# (nama, urgensi, dampak, effort_jam). JANGAN UBAH baris ini.\nreq = [("Eksposur properti (direksi)", 5, 5, 1),\n       ("NPL by cabang (komite)", 4, 4, 3),\n       ("Benchmark peer (CRO)", 3, 3, 6),\n       ("Tren 5 tahun (regulator)", 4, 2, 8),\n       ("Definisi ulang (internal)", 2, 2, 2)]\n\n# TULIS KODEMU: hitung skor dan urutkan menurun\nantre = sorted([(u * d / e, n) for n, u, d, e in req], reverse=True)\nfor skor, nama in antre:\n    print(f"{skor:.1f} {nama}")`,
        checks: [
          { kind: "stdout_matches", task: "t2", pattern: "25\\.0 Eksposur properti \\(direksi\\)", label: "Prioritas 1 benar", msg: "5×5/1 = 25.0 di urutan pertama." },
          { kind: "stdout_matches", task: "t2", pattern: "1\\.0 Tren 5 tahun \\(regulator\\)", label: "Prioritas terakhir benar", msg: "4×2/8 = 1.0 di urutan terakhir." },
          { kind: "stdout_matches", task: "t2", pattern: "5\\.3 NPL by cabang", label: "Urutan tengah benar", msg: "4×4/3 = 5.3 di urutan kedua." },
        ],
      },
      reference: "skor = urgensi × dampak / effort. Urutkan menurun, kerjakan dari atas.",
    },
    {
      id: "teknik",
      eyebrow: "Langkah 4 · Teknik 2 jam",
      title: "Versi 80% dengan caveat, bukan 100% yang terlambat",
      prose: [
        "Teknik timebox: bagi 2 jam menjadi 10 menit triase + 80 menit kerja + 30 menit review & tulis caveat. Aturan 80%: kirim jawaban yang 80% benar TEPAT WAKTU dengan caveat eksplisit (\u201Cangka sementara, belum rekonsiliasi cabang X\u201D), lalu susul versi 100% besok. Caveat bukan kelemahan — ia kejujuran yang membuat jawaban 80% bisa dipakai.",
        "Tiga kalimat caveat yang menyelamatkan karier: (1) \u201Cini angka sementara\u201D — status; (2) \u201Cbelum termasuk X\u201D — batasan; (3) \u201Cversi final besok jam 10\u201D — komitmen. Tanpa ketiganya, jawaban cepat = bom waktu yang meledak saat direksi mengutip angkamu sebagai fakta.",
      ],
      tasks: [],
      hints: [
        "Intuisi: direksi lebih memaafkan \u201Cangka sementara yang jujur\u201D daripada \u201Cangka final yang salah\u201D. Yang pertama bisa dikoreksi; yang kedua merusak kepercayaan.",
        "Jangan pernah mengirim jawaban adhoc tanpa menuliskan ASUMSI-mu. Asumsi yang tertulis bisa dikoreksi; asumsi diam-diam menjadi fakta.",
      ],
      reference: "10 + 80 + 30 menit. Kirim 80% + caveat 3 kalimat, susul 100%.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Estimasi",
      title: "Estimasi Fermi: jawaban 80% dalam 20 menit",
      prose: [
        "Pukul 13:00 direksi butuh eksposur properti untuk rapat 14:00; data detail butuh 3 jam. Jalan keluarnya: estimasi Fermi — pecah jadi faktor yang bisa ditebak, kalikan, beri rentang. Yang pasti: top-100 debitur total Rp2.000 miliar, 40 di antaranya properti dengan eksposur Rp800 miliar → rata-rata Rp20 miliar per debitur properti.",
        "Total debitur properti bank ± 120 (dari data cabang). Estimasi = 120 × Rp20 M = Rp2.400 M. Rentang wajar rata-rata Rp15–25 M → Rp1.800–3.000 M. Batas internal Rp3.500 M. Jawaban jam 13:50: 'Estimasi Rp2,4 triliun, rentang Rp1,8–3,0 triliun — di bawah batas Rp3,5 triliun. Angka pasti besok 10:00.' Keputusan 'lanjut/tahan' bisa diambil; presisi menyusul.",
        "Keesokan harinya angka aktual keluar: Rp2.650 M. Error = |2400 − 2650| / 2650 = 9,4%. Untuk keputusan biner 'di atas/bawah batas', error 9% tidak mengubah apa pun — itulah 80% yang cukup. Fermi bukan tebakan: ia aritmetika dari angka pasti + rasio masuk akal + rentang jujur.",
        "Aturan Fermi untuk adhoc: (1) mulai dari angka yang PASTI (top-100, bukan 'kira-kira'), (2) kalikan dengan rasio yang bisa dipertahankan, (3) selalu sertakan rentang + caveat + janji angka pasti. Estimasi tanpa rentang = tebakan; dengan rentang + komitmen = analisis yang bisa dipakai direksi.",
      ],
      formula: String.raw`\text{Estimasi} = \text{basis pasti} \times \text{rasio} \quad ; \quad \text{error} = \frac{|\text{estimasi} - \text{aktual}|}{\text{aktual}}`,
      formulaNote: "Basis pasti = angka yang sudah terverifikasi (mis. top-100), rasio = faktor pengali yang masuk akal. Contoh: 120 debitur × Rp20 M = Rp2.400 M; error vs aktual Rp2.650 M = 9,4%. Interpretasi: cukup akurat untuk keputusan di atas/bawah batas.",
      tasks: [
        { id: "t1", text: "Hitung `rata2`, `estimasi`, rentang, dan `error`" },
        { id: "t2", text: "Jalankan dan pastikan error tercetak" },
      ],
      expected: "Estimasi Rp2400 M (rentang Rp1800-3000 M), aktual Rp2650 M -> error 9.4%",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Estimasi = asal tebak.” Tebakan tidak punya basis pasti, tidak punya rentang, dan tidak pernah diuji terhadap aktual. Fermi punya ketiganya — dan error 9,4% yang terukur jauh lebih jujur daripada 'angka pasti' yang datang setelah keputusan diambil.",
      },
      hints: [
        "rata2 = 800 / 40 = Rp20 M per debitur.",
        "error = |estimasi - aktual| / aktual * 100.",
      ],
      code: {
        starter: "# Basis pasti (Rp miliar, JANGAN UBAH).\neksposur_properti_top100 = 800  # 40 debitur properti di top-100\nn_top100 = 40\ntotal_debitur = 120\naktual = 2650  # angka pasti keesokan harinya\n\n# TULIS KODEMU: estimasi Fermi + error\nrata2 =\nestimasi =\nlow, high =  # rentang: rata-rata Rp15-25 M\nerror =\n\nprint(f\"Estimasi Rp{estimasi:.0f} M (rentang Rp{low:.0f}-{high:.0f} M), aktual Rp{aktual} M -> error {error:.1f}%\")",
        lockLines: 5,
        solution: "# Basis pasti (Rp miliar, JANGAN UBAH).\neksposur_properti_top100 = 800  # 40 debitur properti di top-100\nn_top100 = 40\ntotal_debitur = 120\naktual = 2650  # angka pasti keesokan harinya\n\n# TULIS KODEMU: estimasi Fermi + error\nrata2 = eksposur_properti_top100 / n_top100\nestimasi = rata2 * total_debitur\nlow, high = 15 * total_debitur, 25 * total_debitur\nerror = abs(estimasi - aktual) / aktual * 100\n\nprint(f\"Estimasi Rp{estimasi:.0f} M (rentang Rp{low:.0f}-{high:.0f} M), aktual Rp{aktual} M -> error {error:.1f}%\")",
        checks: [
          { kind: "equal", task: "t1", label: "`estimasi` = 2400", msg: "120 × Rp20 M = Rp2.400 M.", name: "estimasi", value: 2400, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "`error` = 9.4", msg: "|2400-2650|/2650 = 9,4%.", name: "error", value: 9.433962264150944, tol: 0.05 },
          { kind: "stdout_matches", task: "t2", label: "Error tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "error 9\\.4%" }
        ],
      },
      reference: "Fermi = basis pasti × rasio masuk akal + rentang + janji angka pasti.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Kalibrasi rentang",
      title: "Apakah rentangmu bisa dipercaya?",
      prose: [
        "Lab pertama membuat estimasi Fermi dengan rentang. Lab ini mengkalibrasi: dari dua estimasi lama, mana yang rentangnya 'kena' (aktual di dalam rentang) dan mana yang 'meleset'. Estimator yang rentangnya selalu meleset ke bawah = bias optimis; selalu meleset ke atas = bias pesimis.",
        "Hasil: 'Kredit macet' KENA (Rp2.650 jt di dalam Rp1.800–3.000 jt); 'Biaya promo' MELESET (aktual Rp720 jt di atas rentang Rp400–600 jt). Satu meleset bukan vonis — tetapi pola meleset 5x berturut-turut berarti rentangmu terlalu sempit dan harus dilebarkan.",
      ],
      tasks: [
        { id: "t1", text: "Tulis pengecekan: aktual di dalam [lo, hi]?" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Kredit macet: rentang Rp1800-3000 jt, aktual Rp2650 jt -> KENA\nBiaya promo: rentang Rp400-600 jt, aktual Rp720 jt -> MELESET",
      note: {
        title: "Sekali kena ≠ kalibrasi.",
        type: "pitfall",
        body: "“Rentasngku kena, berarti estimasiku bagus.” Satu titik kena bisa kebetulan — kalibrasi butuh 20+ estimasi. Yang dinilai bukan satu rentang, melainkan: dari 20 rentang 80%-mu, berapa yang benar-benar menangkap aktual? Jawabannya harus ~16.",
      },
      hints: [
        "kena = lo <= aktual <= hi.",
        "Vonis: 'KENA' bila di dalam, 'MELESET' bila di luar.",
      ],
      code: {
        starter: "# (nama, lo, hi, aktual) dalam Rp jt. JANGAN UBAH.\nestimasi = [(\"Kredit macet\", 1800, 3000, 2650), (\"Biaya promo\", 400, 600, 720)]\n\n# TULIS KODEMU: cek aktual di dalam rentang?\nfor nama, lo, hi, aktual in estimasi:\n    vonis = \n    print(f\"{nama}: rentang Rp{lo}-{hi} jt, aktual Rp{aktual} jt -> {vonis}\")",
        lockLines: 4,
        solution: "# (nama, lo, hi, aktual) dalam Rp jt. JANGAN UBAH.\nestimasi = [(\"Kredit macet\", 1800, 3000, 2650), (\"Biaya promo\", 400, 600, 720)]\n\n# TULIS KODEMU: cek aktual di dalam rentang?\nfor nama, lo, hi, aktual in estimasi:\n    vonis = \"KENA\" if lo <= aktual <= hi else \"MELESET\"\n    print(f\"{nama}: rentang Rp{lo}-{hi} jt, aktual Rp{aktual} jt -> {vonis}\")",
        checks: [
          { kind: "stdout_matches", task: "t2", label: "Kredit macet KENA", msg: "Aktual di dalam rentang.", pattern: "Kredit macet: rentang Rp1800-3000 jt, aktual Rp2650 jt -\> KENA" },
          { kind: "stdout_matches", task: "t2", label: "Biaya promo MELESET", msg: "Aktual di luar rentang.", pattern: "Biaya promo: rentang Rp400-600 jt, aktual Rp720 jt -\> MELESET" }
        ],
      },
      reference: "Kalibrasi = pola 20+ estimasi, bukan satu titik. Meleset beruntun = rentang terlalu sempit.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Kerjakan, delegasikan, jadwalkan, atau tolak?",
      prose: [
        "Matriks triase 2×2 (lihat figur): Mendesak + berdampak → KERJAKAN sekarang. Berdampak tapi tak Mendesak → JADWALKAN (masuk antrean skor). Mendesak tapi dampak kecil → DELEGASIKAN ke junior/template. Tak Mendesak + dampak kecil → TOLAK atau tunda dengan sopan (\u201Cbisa kita bahas Senin?\u201D).",
        "Cara membaca figur: sumbu X = urgensi, sumbu Y = dampak; tiap kuadran = satu respons + contoh. Interpretasi: sebagian besar permintaan adhoc jatuh di \u201Cjadwalkan\u201D atau \u201Cdelegasikan\u201D — hanya sedikit yang benar-benar \u201Ckerjakan sekarang\u201D. Analis yang mengerjakan semua sebagai \u201Ckerjakan sekarang\u201D = analis yang lembur permanen.",
        "Aturan praktis 10 detik: sebelum membuka data, tentukan kuadrannya. Kuadran menentukan respons; skor menentukan urutan.",
      ],
      figure: {
        svg: FIG_TRIAGE,
        alt: "Matriks triase dua kali dua: urgensi versus dampak.",
        caption: "Matriks triase: Mendesak+berdampak = kerjakan; sisanya jadwalkan, delegasikan, atau tolak.",
      },
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Kuadran 'kerjakan sekarang' (mendesak + berdampak) sering tidak punya data lengkap — di sinilah Fermi masuk. Triase menentukan APA yang dikerjakan; Fermi menentukan BAGAIMANA menjawab cepat dengan jujur.",
      },
      reference: "Tentukan kuadran dulu, baru buka data.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Tiga permintaan, satu analis, dua jam",
      prose: [
        "Pukul 13:00 masuk tiga permintaan: (A) Direksi: eksposur properti untuk rapat 14:00 (urgensi 5, dampak 5, effort 1 jam). (B) Komite: NPL per cabang untuk rapat minggu depan (4, 4, 3 jam). (C) CRO: benchmark NPL peer untuk bahan presentasi lusa (3, 3, 6 jam). Kamu punya 2 jam sebelum rapat direksi.",
        "Rencana: 10 menit triase — telepon direksi: \u201Cuntuk keputusan apa?\u201D Jawaban: \u201Cmemastikan masih di bawah batas sebelum menyetujui limit baru.\u201D Maka A butuh: total eksposur + posisi vs batas + satu kalimat. Kerjakan A (50 menit) → kirim 1 slide + caveat. B masuk antrean (skor 5,3, kerjakan besok pagi). C dijadwalkan lusa (skor 1,5). Total: 1 jam kerja, 3 permintaan tertangani, 0 lembur. Itulah triase: bukan bekerja lebih keras, melainkan menolak dengan sistem.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Menjawab B dan C \u201Cseadanya\u201D dalam 2 jam = tiga jawaban mediocre, termasuk untuk rapat direksi yang paling penting. Fokus pada A = satu jawaban yang benar untuk keputusan terbesar. Kualitas mengikuti fokus.",
      },
      reference: "Triase 10 menit → kerjakan A → antrekan B, C. Tolak dengan sistem, bukan dengan panik.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Besok saat ada permintaan mendadak, coba triase 10 menit sungguhan.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Tiga kalimat caveat penyelamat karier: 'ini angka sementara' (status), 'belum termasuk X' (batasan), 'versi final besok jam 10' (komitmen). Estimasi Fermi tanpa ketiganya = bom waktu.",
      },

      summary: [
        "Triase 10 menit: keputusan apa? seberapa presisi? kapan?",
        "Skor prioritas = urgensi × dampak / effort; kerjakan dari skor tertinggi.",
        "Matriks 2×2: kerjakan, jadwalkan, delegasikan, tolak/tunda.",
        "Kirim 80% tepat waktu + caveat 3 kalimat; susul 100%.",
        "Tulis asumsimu — asumsi tertulis bisa dikoreksi.",
      ],
      next: { label: "RR10 — Dasar Regulasi Pelaporan OJK/BI", href: "/learn/rr10-regulasi" },
      quiz: [
        {
          q: "Kesalahan utama Andi dalam cerita pembuka?",
          options: [
            { text: "Bekerja terlalu lambat", why: "Ia justru bekerja 55 menit nonstop — masalahnya arah, bukan kecepatan." },
            { text: "Menjawab pertanyaan yang dibayangkan, bukan yang sebenarnya", why: "Tepat. Tanpa triase, 55 menit untuk hal yang tidak ditanya.", correct: true },
            { text: "Datanya salah", why: "Datanya benar — penyajiannya yang salah sasaran." },
          ],
        },
        {
          q: "Tiga pertanyaan triase sebelum menyentuh data?",
          options: [
            { text: "Siapa meminta, kapan meminta, via apa", why: "Itu administrasi, bukan triase." },
            { text: "Keputusan apa, seberapa presisi, kapan dibutuhkan", why: "Benar. Tiga ini menentukan isi, usaha, dan deadline.", correct: true },
            { text: "Berapa tabel, berapa grafik, berapa halaman", why: "Itu soal format — ditentukan SETELAH triase." },
          ],
        },
        {
          q: "Permintaan skor 1,0 dari atasan senior vs skor 25 dari manajer. Kerjakan mana dulu?",
          options: [
            { text: "Skor 25 — dan tunjukkan perhitungannya jika diprotes", why: "Benar. Skor membuat prioritas transparan dan bisa dipertahankan.", correct: true },
            { text: "Skor 1,0 karena pemintanya senior", why: "Senioritas ≠ prioritas. Itu jalan menuju lembur permanen." },
          ],
        },
        {
          q: "Caveat 3 kalimat yang wajib menyertai jawaban 80%?",
          options: [
            { text: "Status sementara, batasan, komitmen versi final", why: "Tepat: \u201Cangka sementara, belum termasuk X, final besok jam 10\u201D.", correct: true },
            { text: "Minta maaf, alasan, pembelaan diri", why: "Itu bukan caveat — itu defensif." },
            { text: "Tidak perlu caveat agar terlihat yakin", why: "Keyakinan palsu = bom waktu saat angka dikutip sebagai fakta." },
          ],
        },
        {
          q: "Permintaan Mendesak tapi dampak kecil sebaiknya?",
          options: [
            { text: "Dikerjakan segera bagaimanapun", why: "Itu kuadran delegasikan — waktumu terlalu mahal untuk ini." },
            { text: "Didelegasikan ke junior atau template", why: "Benar. Mendesak ≠ penting.", correct: true },
            { text: "Ditolak mentah-mentah", why: "Ditolak untuk kuadran tak-Mendesak-tak-berdampak; ini masih perlu dikerjakan seseorang." },
          ],
        },
      ],
    },
  ],
};
