import type { V2Lesson } from "../lib/types";

// Dua chart batang yang sama, sumbu berbeda: jujur (0-5) vs menyesatkan (2,5-3,5).
const FIG_AXIS = `<svg viewBox=\"0 0 480 280\" role=\"img\" aria-label=\"Perbandingan chart NPL dengan sumbu jujur mulai dari nol versus sumbu terpotong.\">
<g font-family=\"var(--font-ui)\" text-anchor=\"middle\">
<text x=\"120\" y=\"20\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Jujur: sumbu 0–5</text>
<g stroke=\"var(--chart-grid)\"><line x1=\"40\" y1=\"230\" x2=\"200\" y2=\"230\"/></g>
<rect x=\"60\" y=\"108\" width=\"50\" height=\"122\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<rect x=\"130\" y=\"83\" width=\"50\" height=\"147\" fill=\"var(--c1)\" opacity=\"0.9\"/>
<text x=\"85\" y=\"246\" font-size=\"11\" fill=\"var(--chart-text)\">2024</text>
<text x=\"155\" y=\"246\" font-size=\"11\" fill=\"var(--chart-text)\">2025</text>
<text x=\"85\" y=\"100\" font-size=\"11\" fill=\"var(--chart-text)\">2,8</text>
<text x=\"155\" y=\"75\" font-size=\"11\" fill=\"var(--chart-text)\">3,4</text>
<text x=\"120\" y=\"266\" font-size=\"11\" fill=\"var(--text-muted)\">naik 21% — terlihat proporsional</text>
<text x=\"360\" y=\"20\" font-size=\"13\" font-weight=\"600\" fill=\"var(--chart-text)\">Menyesatkan: sumbu 2,5–3,5</text>
<g stroke=\"var(--chart-grid)\"><line x1=\"280\" y1=\"230\" x2=\"440\" y2=\"230\"/></g>
<rect x=\"300\" y=\"161\" width=\"50\" height=\"69\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<rect x=\"370\" y=\"23\" width=\"50\" height=\"207\" fill=\"var(--c4)\" opacity=\"0.9\"/>
<text x=\"325\" y=\"246\" font-size=\"11\" fill=\"var(--chart-text)\">2024</text>
<text x=\"395\" y=\"246\" font-size=\"11\" fill=\"var(--chart-text)\">2025</text>
<text x=\"325\" y=\"153\" font-size=\"11\" fill=\"var(--chart-text)\">2,8</text>
<text x=\"395\" y=\"15\" font-size=\"11\" fill=\"var(--chart-text)\">3,4</text>
<text x=\"360\" y=\"266\" font-size=\"11\" fill=\"var(--text-muted)\">naik 21% — terlihat 3x lipat!</text>
</g>
</svg>`;

export const rr5: V2Lesson = {
  slug: "rr5-visualisasi",
  track: "Risk Reporting",
  module: "Komunikasi Risiko",
  title: "RR5 — Visualisasi untuk Komite",
  estMinutes: 55,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Chart yang menenangkan, lalu rapat darurat",
      prose: [
        "Slide komite menampilkan chart NPL dua tahun: dua batang yang tingginya hampir sama, dengan judul \u201CNPL stabil\u201D. Direksi tenang. Tiga minggu kemudian analis baru menggambar ulang chart yang sama — data persis sama — tetapi sumbunya mulai dari nol. Batang kedua ternyata 21% lebih tinggi. \u201CStabil\u201D berubah menjadi \u201Cnaik seperlima dalam setahun\u201D. Rapat darurat dijadwalkan sore itu juga.",
        "Twist-nya: tidak ada angka yang diubah. Chart pertama memakai sumbu Y 2,5–3,5 (terpotong), sehingga kenaikan 0,6 pp terlihat seperti riak kecil. Chart kedua memakai sumbu 0–5, sehingga proporsinya jujur. Keduanya \u201Cbenar\u201D secara teknis. Hanya satu yang jujur secara visual. Komite tidak memutuskan berdasarkan angka — mereka memutuskan berdasarkan apa yang mereka LIHAT.",
        "Setelah lesson ini kamu bisa: (1) menghitung lie factor sebuah chart; (2) memilih sumbu dan skala yang jujur; (3) memilih jenis chart yang tepat untuk tiap pesan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Chart menyesatkan = keputusan berdasarkan ilusi. Keterlambatan 3 minggu merespons kenaikan NPL 21% bisa berarti Rp puluhan miliar eksposur baru yang seharusnya dibekukan. Visualisasi adalah bagian dari pengendalian risiko.",
      },
      reference: "Komite memutuskan dari yang mereka lihat. Pastikan yang terlihat = yang sebenarnya.",
    },
    {
      id: "lie-factor",
      eyebrow: "Langkah 2 · Lie factor",
      title: "Mengukur kebohongan visual",
      prose: [
        "Edward Tufte merumuskan lie factor: perbandingan antara perubahan yang TERLIHAT di chart dengan perubahan data yang SEBENARNYA. Lie factor = 1 berarti jujur sempurna. Chart NPL tadi: data naik 21,4%, tetapi tinggi batang terlihat naik 200% (dari 0,3 menjadi 0,9 unit visual) — lie factor 9,3. Chart itu membesar-besarkan kenyataan 9 kali lipat.",
        "Tiga sumber lie factor paling umum di laporan risiko: (1) sumbu Y terpotong — pembesar kebohongan nomor satu; (2) sumbu ganda (dual axis) dengan skala yang bisa diatur sesukanya hingga dua garis terlihat \u201Cberkorelasi\u201D; (3) luas vs panjang — lingkaran/pie 3D di mana mata membaca luas, bukan angka.",
      ],
      formula: String.raw`\text{Lie factor} = \frac{\text{perubahan visual} / \text{visual awal}}{\text{perubahan data} / \text{data awal}}`,
      formulaNote: "Pembilang = seberapa besar perubahan terlihat di chart (mis. tinggi batang). Penyebut = seberapa besar perubahan data sebenarnya. Contoh: visual naik 200% (0,3→0,9), data naik 21,4% (2,8→3,4) → lie factor = 2,00/0,214 = 9,3. Interpretasi: > 1 = dibesar-besarkan, < 1 = dikecilkan, = 1 = jujur.",
      tasks: [],
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CChart default dari Excel pasti netral.\u201D Tidak. Default Excel/Sheets sering memotong sumbu otomatis \u201Cagar grafik terlihat bagus\u201D — persis yang membuat NPL terlihat stabil. Netral harus diusahakan; default adalah musuh.",
      },
      hints: [
        "Intuisi: tutup angkanya, lihat chart-nya saja. Cerita apa yang kamu tangkap dalam 3 detik? Itulah yang akan ditangkap direksi — pastikan sama dengan cerita angkanya.",
        "Dual axis hampir selalu dicurigai: dua skala bebas = kamu bisa membuat garis apa pun terlihat sejajar. Jika terpaksa, beri anotasi skala dengan jelas.",
      ],
      reference: "Lie factor = perubahan terlihat / perubahan nyata. Target = 1.",
    },
    {
      id: "lab-lie",
      eyebrow: "Langkah 3 · Lab",
      title: "Hitung lie factor chart NPL",
      prose: [
        "Rekonstruksi kasus komite dengan kode. Tinggi visual batang dihitung dari posisi sumbu: visual = (nilai − ymin) / (ymax − ymin). Dengan sumbu 2,5–3,5: batang 2,8 setinggi 0,3 dan batang 3,4 setinggi 0,9 — naik 200% secara visual. Bandingkan dengan kenaikan data 21,4%.",
        "Coba ubah ymin menjadi 0 setelah lab selesai (di kepalamu atau dengan mengedit): visual menjadi 0,56 → 0,68, naik 21,4% — lie factor tepat 1. Itulah bukti matematis mengapa sumbu nol itu jujur.",
      ],
      tasks: [
        { id: "t1", text: "Lengkapi perhitungan `vis_awal`, `vis_akhir`, `lf`" },
        { id: "t2", text: "Jalankan dan baca vonisnya" },
      ],
      expected: "Data naik 21.4%, visual naik 200.0% -> lie factor = 9.3 (MENYESATKAN)",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "\u201CSumbu tidak dari nol boleh asal konsisten.\u201D Konsisten menyesatkan tetap menyesatkan. Pengecualian sah: data dengan rentang alami sempit (mis. suhu tubuh 36–38°C) — tetapi wajib beri anotasi \u201Csumbu terpotong\u201D yang jelas, bukan diam-diam.",
      },
      hints: [
        "vis = (nilai - ymin) / (ymax - ymin).",
        "perubahan relatif = (akhir - awal) / awal.",
        "lf = vis_rel / data_rel. Vonis: lf > 1.05 atau < 0.95 = MENYESATKAN.",
      ],
      code: {
        starter: `# Kasus komite: NPL 2,8 -> 3,4 dengan sumbu 2,5-3,5. JANGAN UBAH baris ini.\nd0, d1, ymin, ymax = 2.8, 3.4, 2.5, 3.5\n\n# TULIS KODEMU\nvis_awal =\nvis_akhir =\nvis_rel =\ndata_rel =\nlf =\nvonis = "MENYESATKAN" if (lf > 1.05 or lf < 0.95) else "JUJUR"\nprint(f"Data naik {data_rel:.1%}, visual naik {vis_rel:.1%} -> lie factor = {lf:.1f} ({vonis})")`,
        lockLines: 2,
        solution: `# Kasus komite: NPL 2,8 -> 3,4 dengan sumbu 2,5-3,5. JANGAN UBAH baris ini.\nd0, d1, ymin, ymax = 2.8, 3.4, 2.5, 3.5\n\n# TULIS KODEMU\nvis_awal = (d0 - ymin) / (ymax - ymin)\nvis_akhir = (d1 - ymin) / (ymax - ymin)\nvis_rel = (vis_akhir - vis_awal) / vis_awal\ndata_rel = (d1 - d0) / d0\nlf = vis_rel / data_rel\nvonis = "MENYESATKAN" if (lf > 1.05 or lf < 0.95) else "JUJUR"\nprint(f"Data naik {data_rel:.1%}, visual naik {vis_rel:.1%} -> lie factor = {lf:.1f} ({vonis})")`,
        checks: [
          { kind: "equal", task: "t1", name: "lf", value: 9.3, tol: 0.1, label: "`lf` ≈ 9.3", msg: "(2.00) / (0.214) ≈ 9.3." },
          { kind: "stdout_matches", task: "t2", pattern: "lie factor = 9\\.3 \\(MENYESATKAN\\)", label: "Vonis MENYESATKAN tercetak", msg: "9.3 jauh di atas 1.05." },
        ],
      },
      reference: "vis = (nilai-ymin)/(ymax-ymin); lf = vis_rel / data_rel. Uji chart-mu sendiri.",
    },
    {
      id: "aturan",
      eyebrow: "Langkah 4 · Aturan",
      title: "Lima aturan chart jujur",
      prose: [
        "Aturan 1: sumbu Y mulai dari nol untuk batang — batang dibaca dari panjangnya, panjang butuh nol. Aturan 2: satu chart = satu pesan; dua pesan = dua chart. Aturan 3: beri konteks — garis batas, rata-rata historis, atau periode pembanding; angka tanpa pembanding = dekorasi (ingat RR2). Aturan 4: label langsung pada data, bukan legenda jauh — mata tidak boleh bolak-balik. Aturan 5: hindari 3D, pie > 5 irisan, dan dual axis tanpa anotasi.",
        "Cara membaca figur: kiri = chart jujur (sumbu 0–5), kenaikan terlihat proporsional 21%; kanan = sumbu terpotong (2,5–3,5), kenaikan terlihat 3x lipat. Interpretasi: data identik, keputusan berbeda. Chart kanan membuat direksi tenang; chart kiri membuat mereka bertindak. Pilihlah dengan sadar.",
      ],
      figure: {
        svg: FIG_AXIS,
        alt: "Perbandingan chart NPL dengan sumbu jujur mulai dari nol versus sumbu terpotong.",
        caption: "Data sama (2,8 → 3,4), sumbu beda, cerita beda. Kiri jujur, kanan menyesatkan (lie factor 9,3).",
      },
      tasks: [],
      hints: [
        "Intuisi: chart untuk komite bukan karya seni — ia alat keputusan. Keindahan yang mengorbankan kejujuran = sabotase.",
        "Sebelum mengirim: screenshot chart-mu, kirim ke rekan tanpa angka. Jika tebakannya tentang tren salah, chart-mu gagal.",
      ],
      reference: "Nol untuk batang; satu pesan per chart; konteks selalu; label langsung; hindari 3D/dual-axis.",
    },
    {
      id: "pendalaman",
      eyebrow: "Pendalaman · Distorsi",
      title: "Dual-axis dan lingkaran: kebohongan yang lolos sumbu nol",
      prose: [
        "Sumbu nol menyelesaikan lie factor chart batang — tetapi dua trik lolos dari aturan itu: dual-axis dan luas. Dual-axis dulu: NPL naik 3,0→4,0% sementara laba turun Rp100→80 miliar. Dengan sumbu kiri 0–5 dan kanan 0–200, dua garis turun sejajar — terlihat 'berkorelasi'. Ubah sumbu kanan menjadi 70–90: garis laba terjun bebas, garis NPL landai — korelasi visual lenyap. Data identik, skala beda, cerita beda.",
        "Aturan praktisnya keras: dua garis boleh berbagi chart hanya jika berbagi sumbu. Beda satuan → dua panel bertumpuk (masing-masing sumbu dari nol), atau normalisasi keduanya ke indeks 100. Jika seorang analis bersikeras memakai dual-axis, tanyakan motifnya — ia biasanya sedang menjual korelasi yang tidak ada.",
        "Kedua: lingkaran. Mata manusia membaca luas, bukan radius. NPL naik 2× (3% → 6%) digambar sebagai lingkaran dengan radius 2× → luasnya 4×. Lie factor = perubahan visual / perubahan data = 4/2 = 2,0: chart membesar-besarkan kenyataan dua kali lipat. Rumus umumnya: jika radius ∝ nilai, lie factor = rasio nilai. Solusinya bukan menghitung — melainkan tidak memakai lingkaran untuk perbandingan. Pakai batang.",
        "Lab menghitung lie factor lingkaran dari dua radius. Eksperimen setelahnya: coba r2 = 1,41 (√2 × r1) — lie factor menjadi 1,0 karena luas kini proporsional. Itu 'perbaikan' yang benar secara matematis tetapi tetap buruk secara persepsi: tidak ada pembaca yang mengestimasi luas lingkaran dengan akurat. Aturan tetap: lingkaran untuk dekorasi, batang untuk keputusan.",
      ],
      formula: String.raw`\text{Lie factor} = \frac{\text{perubahan visual}}{\text{perubahan data}} = \frac{(r_2/r_1)^2}{x_2/x_1}`,
      formulaNote: "r = radius lingkaran, x = nilai data. Contoh: r 1,0→2,0 dan x 3→6 → visual 4×, data 2× → lie factor 2,0. Interpretasi: chart membesar-besarkan kenaikan 2 kali lipat. Lie factor 1 = jujur.",
      tasks: [
        { id: "t1", text: "Hitung `visual`, `data`, `lie`, dan `vonis`" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Lie factor lingkaran: 2.0 -> MENYESATKAN",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "“Dua metrik beda satuan butuh dual-axis.” Tidak — butuh dua panel. Dual-axis memberi analis kebebasan mengatur skala sesukanya hingga dua garis terlihat berkorelasi. Kebebasan itu = kebebasan menyesatkan.",
      },
      hints: [
        "visual = (r2/r1)**2 karena luas ∝ radius².",
        "vonis memakai ambang |lie-1| < 0,05.",
      ],
      code: {
        starter: "# Data chart lingkaran (JANGAN UBAH).\nnilai1, nilai2 = 3.0, 6.0  # NPL %\nr1, r2 = 1.0, 2.0          # radius lingkaran\n\n# TULIS KODEMU: lie factor lingkaran\nvisual =\ndata =\nlie =\nvonis =  # \"JUJUR\" jika lie mendekati 1, selain itu \"MENYESATKAN\"\n\nprint(f\"Lie factor lingkaran: {lie:.1f} -> {vonis}\")",
        lockLines: 3,
        solution: "# Data chart lingkaran (JANGAN UBAH).\nnilai1, nilai2 = 3.0, 6.0  # NPL %\nr1, r2 = 1.0, 2.0          # radius lingkaran\n\n# TULIS KODEMU: lie factor lingkaran\nvisual = (r2 / r1) ** 2\ndata = nilai2 / nilai1\nlie = visual / data\nvonis = \"JUJUR\" if abs(lie - 1) < 0.05 else \"MENYESATKAN\"\n\nprint(f\"Lie factor lingkaran: {lie:.1f} -> {vonis}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`lie` = 2.0", msg: "Visual 4× / data 2× = 2,0.", name: "lie", value: 2.0, tol: 1e-09 },
          { kind: "equal", task: "t1", label: "`vonis` = MENYESATKAN", msg: "2,0 jauh dari 1.", name: "vonis", value: "MENYESATKAN" },
          { kind: "stdout_matches", task: "t2", label: "Vonis tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Lie factor lingkaran: 2\\.0 -> MENYESATKAN" }
        ],
      },
      reference: "Satu sumbu per chart; lingkaran untuk dekorasi, batang untuk keputusan.",
    },
    {
      id: "pendalaman-2",
      eyebrow: "Pendalaman 2 · Lie factor sumbu",
      title: "Sumbu yang dipotong = kebohongan 2x",
      prose: [
        "Lab pertama membongkar lingkaran 3D. Lab ini mengukur kebohongan sumbu-Y yang dipotong: dua bar 100 dan 115 terlihat beda 2,5x karena sumbu mulai dari 90, padahal data hanya beda 1,15x. Lie factor = efek visual / efek data = 2,2 — di atas ambang jujur 1,05.",
        "Aturan praktis Tufte: lie factor harus antara 0,95–1,05. Jika sumbu harus dipotong (mis. data 990–1010), tempelkan anotasi 'sumbu tidak dari nol' sebesar judulnya — bukan footnote 6pt. Atau pakai dot plot yang tidak mengandalkan panjang bar.",
      ],
      tasks: [
        { id: "t1", text: "Hitung lie factor = efek visual / efek data" },
        { id: "t2", text: "Jalankan dan pastikan vonis tercetak" },
      ],
      expected: "Lie factor: 2.2 -> MENYESATKAN",
      note: {
        title: "Anotasi kecil = pengakuan bersalah.",
        type: "pitfall",
        body: "“Sudah ada footnote 'sumbu dari 90'.” Footnote 6pt tidak menetralkan visual yang menipu — otak memproses gambar 60.000x lebih cepat dari teks. Jika perlu footnote untuk jujur, grafiknya yang salah, bukan pembacanya.",
      },
      hints: [
        "efek_visual = (v[1]-vmin)/(v[0]-vmin); efek_data = v[1]/v[0].",
        "Vonis MENYESATKAN bila lie factor > 1.05.",
      ],
      code: {
        starter: "# Dua nilai + awal sumbu. JANGAN UBAH.\nnilai = [100, 115]\nsumbu_min = 90\n\n# TULIS KODEMU: lie factor\ndef lie_factor(v, vmin):\n    efek_visual = \n    efek_data = \n    return efek_visual / efek_data\n\nlf = lie_factor(nilai, sumbu_min)\nprint(f\"Lie factor: {lf:.1f} -> {'MENYESATKAN' if lf > 1.05 else 'JUJUR'}\")",
        lockLines: 4,
        solution: "# Dua nilai + awal sumbu. JANGAN UBAH.\nnilai = [100, 115]\nsumbu_min = 90\n\n# TULIS KODEMU: lie factor\ndef lie_factor(v, vmin):\n    efek_visual = (v[1]-vmin)/(v[0]-vmin)\n    efek_data = v[1]/v[0]\n    return efek_visual / efek_data\n\nlf = lie_factor(nilai, sumbu_min)\nprint(f\"Lie factor: {lf:.1f} -> {'MENYESATKAN' if lf > 1.05 else 'JUJUR'}\")",
        checks: [
          { kind: "equal", task: "t1", label: "`lf` ≈ 2.2", msg: "Efek visual 2,5 / efek data 1,15.", name: "lf", value: 2.173913043478261 },
          { kind: "stdout_matches", task: "t2", label: "Vonis tercetak", msg: "Samakan format dengan Hasil yang diharapkan.", pattern: "Lie factor: 2\.2 -\> MENYESATKAN" }
        ],
      },
      reference: "Lie factor = visual/data; jujur = 0,95–1,05. Sumbu potong tanpa anotasi besar = menipu.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Chart apa untuk pesan apa",
      prose: [
        "Satu: tren waktu (NPL 12 bulan) → garis; mata membaca kemiringan dengan akurat. Dua: perbandingan kategori (NPL per segmen) → batang horizontal dengan sumbu nol. Tiga: komposisi (porsi segmen) → batang tersusun (stacked), bukan pie — pie gagal di atas 3 irisan. Empat: distribusi (sebaran DPD) → histogram; rata-rata tanpa distribusi = setengah cerita.",
        "Aturan praktis 10 detik: tanya \u201Capa yang harus terlihat dalam 3 detik?\u201D — tren → garis, ranking → batang, bagian dari keseluruhan → stacked bar. Jika butuh > 3 detik untuk paham, ganti jenis chart-nya.",
      ],
      tasks: [],
      note: {
        title: "Intuisi",
        body: "Untuk tren waktu pakai garis, untuk ranking pakai batang horizontal — tetapi untuk DUA metrik beda satuan, pakai dua panel bertumpuk, bukan dual-axis. Aturan 3 detik tetap berlaku per panel.",
      },
      reference: "Tren = garis. Kategori = batang. Komposisi = stacked. Distribusi = histogram.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Perbaiki chart \u201Cstabil\u201D",
      prose: [
        "Kamu menerima slide dengan chart batang: NPL 2024 = 2,8, NPL 2025 = 3,4, sumbu 2,5–3,5, judul \u201CNPL stabil\u201D. Tugas: (1) hitung lie factor-nya (jawaban: 9,3 — dari lab Langkah 3); (2) tulis ulang slide: sumbu 0–5, judul baru, satu kalimat narasi.",
        "Pembahasan: Judul baru: \u201CNPL naik 21% dalam setahun (2,8% → 3,4%)\u201D. Narasi satu kalimat: \u201CKenaikan 0,6 pp didorong segmen SME; usulan: bekukan limit baru sampai di bawah 3,0%.\u201D Perhatikan: judul tidak lagi \u201Cstabil\u201D — judul adalah keputusan editorial. Judul yang jujur = setengah dari chart yang jujur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Judul chart \u201Cstabil\u201D + sumbu terpotong = dua lapis penyesatan. Komite yang tenang 3 minggu = 3 minggu eksposur berjalan tanpa rem. Visualisasi adalah pengendalian risiko, bukan dekorasi slide.",
      },
      reference: "Judul = keputusan editorial. Tulis judul yang berani jujur.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan. Uji juga chart-chart di laporan kantormu setelah ini.",
      ],
      tasks: [],      note: {
        title: "Intuisi",
        body: "Sebelum mengirim chart, hitung lie factor-nya dalam 30 detik: perubahan visual / perubahan data. Jika bukan ~1, kamu sedang (mungkin tanpa sadar) menulis fiksi visual.",
      },

      summary: [
        "Lie factor = perubahan visual / perubahan data; target = 1.",
        "Sumbu Y batang mulai dari nol; waspadai sumbu terpotong, dual axis, 3D.",
        "Satu chart = satu pesan; beri konteks (batas/pembanding).",
        "Tren = garis, kategori = batang, komposisi = stacked, distribusi = histogram.",
        "Judul chart adalah keputusan editorial — tulis dengan jujur.",
      ],
      next: { label: "RR6 — Narasi & Storytelling Data", href: "/learn/rr6-narasi" },
      quiz: [
        {
          q: "Chart NPL 2,8→3,4 dengan sumbu 2,5–3,5 punya lie factor 9,3. Artinya?",
          options: [
            { text: "Chart 9,3x lebih akurat", why: "Terbalik — lie factor besar = semakin menyesatkan." },
            { text: "Perubahan terlihat 9,3x lebih besar dari kenyataan", why: "Tepat. Visual naik 200% padahal data naik 21%.", correct: true },
            { text: "Data salah 9,3%", why: "Data benar; yang salah penyajiannya." },
          ],
        },
        {
          q: "Kapan sumbu Y boleh tidak mulai dari nol?",
          options: [
            { text: "Tidak pernah", why: "Terlalu kaku — ada pengecualian sah seperti suhu tubuh." },
            { text: "Jika rentang alami sempit dan diberi anotasi jelas", why: "Benar. Syaratnya: alasan sah + anotasi eksplisit, bukan diam-diam.", correct: true },
            { text: "Jika ingin chart terlihat bagus", why: "\u201CTerlihat bagus\u201D dengan mengorbankan kejujuran = menyesatkan." },
          ],
        },
        {
          q: "Untuk tren NPL 12 bulan, chart yang tepat?",
          options: [
            { text: "Pie chart", why: "Pie untuk komposisi, bukan tren waktu." },
            { text: "Line chart (garis)", why: "Benar. Mata membaca kemiringan garis paling akurat untuk tren.", correct: true },
            { text: "3D bar chart", why: "3D mendistorsi proporsi — dilarang." },
          ],
        },
        {
          q: "Mengapa dual axis dicurigai?",
          options: [
            { text: "Karena warnanya jelek", why: "Bukan soal estetika." },
            { text: "Karena dua skala bebas bisa membuat garis tak terkait terlihat sejajar", why: "Tepat. Korelasi semu yang bisa diatur sesukanya.", correct: true },
            { text: "Karena tidak bisa dicetak", why: "Bisa dicetak — masalahnya kejujuran, bukan teknis." },
          ],
        },
        {
          q: "Tes 3 detik untuk chart komite bertujuan?",
          options: [
            { text: "Memastikan chart cukup indah", why: "Keindahan bukan tujuannya." },
            { text: "Memastikan pesan utama tertangkap sebelum angka dibaca", why: "Benar. Direksi memutuskan dari kesan visual pertama.", correct: true },
            { text: "Menghemat tinta printer", why: "Bukan soal cetak." },
          ],
        },
      ],
    },
  ],
};
