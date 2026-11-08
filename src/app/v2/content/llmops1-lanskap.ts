import type { V2Lesson } from "../lib/types";

const MAP_SVG = `<svg viewBox="0 0 480 216" role="img" aria-label="Peta tiga disiplin: MLOps untuk model klasik, AI Engineering untuk membangun aplikasi, LLMOps untuk operasi LLM di produksi.">
<rect x="8" y="8" width="150" height="200" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<rect x="165" y="8" width="150" height="200" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<rect x="322" y="8" width="150" height="200" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="83" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">MLOps</text>
<text x="240" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">AI Engineering</text>
<text x="397" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="var(--text)" font-family="var(--font-ui)">LLMOps</text>
<g font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)" text-anchor="middle">
<text x="83" y="62">model klasik</text><text x="83" y="80">tabular, deterministik</text><text x="83" y="106">data &#8594; train &#8594; deploy</text><text x="83" y="132">fokus: akurasi, drift</text><text x="83" y="158">milik sendiri,</text><text x="83" y="176">bisa di-retrain</text>
<text x="240" y="62">membangun aplikasi</text><text x="240" y="80">prompt, RAG, agent</text><text x="240" y="106">prototype &#8594; demo</text><text x="240" y="132">fokus: UX, iterasi cepat</text><text x="240" y="158">bisa pakai</text><text x="240" y="176">model vendor</text>
<text x="397" y="62">operasi LLM produksi</text><text x="397" y="80">nondeterministik</text><text x="397" y="106">eval &#8594; guardrail &#8594; cost</text><text x="397" y="132">fokus: keandalan,</text><text x="397" y="150">keamanan, biaya</text><text x="397" y="176">kontrak: golden set</text><text x="397" y="194">bukan benchmark vendor</text>
</g></svg>`;

const LLMOPS1_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Kurva R vs temperature: 0,02 pada 0,0; 0,08 pada 0,3; 0,45 pada 0,7; 0,78 pada 1,0. Ambang 0,10."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,5</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text><text x="46.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,0</text><text x="171.4" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,3</text><text x="338.6" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0,7</text><text x="464.0" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">1,0</text><polyline points="46.0,180.0 171.4,167.4 338.6,89.5 464.0,20.0" fill="none" stroke="var(--c1)" stroke-width="2.5"/><line x1="46" y1="163.2" x2="464" y2="163.2" stroke="var(--c4)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="460" y="157.2" text-anchor="end" font-size="11" fill="var(--c4)" font-family="var(--font-ui)">ambang 0,10</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">R = proporsi jawaban unik</text></svg>`;

export const llmops1: V2Lesson = {
  slug: "llmops1-lanskap",
  track: "LLMOps",
  module: "Fondasi",
  title: "LLMOps1 — Kenapa MLOps Tidak Cukup",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga jam yang tidak tercatat di dashboard vendor",
      prose: [
        "Jumat, 14 November 2026, pukul 09.40. Tim CS NusaBank panik: chatbot menjawab pertanyaan nasabah dengan format tanggal baru — `2026-11-14` — padahal parser laporan harian mengharapkan `14 Nov 2026`. Tiga jam berikutnya, 1.200 sesi gagal diproses dan antrean call center membludak. Penyebabnya bukan bug di kode mereka. Semalam, vendor meng-upgrade model di balik layar; prompt yang dikirim tim tidak berubah satu huruf pun.",
        "Twist-nya: dashboard vendor pagi itu tetap hijau — `akurasi 99,2% di benchmark internal`. Angka itu benar secara matematis. Tapi benchmark mengukur kemampuan menjawab soal pilihan ganda, bukan perilaku sistemmu: format output, gaya bahasa, kapan model menolak menjawab. Model yang `lebih pintar` justru merusak sistem yang mengandalkannya — dan tidak ada metrik vendor yang memperingatkanmu.",
        "Tim NusaBank sudah melakukan semua yang benar menurut buku MLOps: versioning dataset, evaluasi akurasi, pipeline CI/CD. Masalahnya, buku itu ditulis untuk model klasik — deterministik, dilatih sendiri, perilakunya stabil antar versi. LLM melanggar ketiga asumsi itu sekaligus. Lesson ini memetakan apa yang berubah, dan mengapa operasi LLM butuh disiplin tersendiri.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan tiga sifat LLM yang membuat MLOps klasik tidak cukup (nondeterministik, prompt = kode, model = dependensi) dengan contoh NusaBank; (2) mengukur nondeterminisme R = U/N dan menentukan ukuran sampel yang valid untuk klaim produksi; (3) membaca kurva R vs temperature dan menetapkan kebijakan temperature berbasis angka; (4) memetakan sebuah skenario ke disiplin yang tepat: MLOps, AI Engineering, atau LLMOps.",
      ],
      tasks: [],
      note: {
        title: "Mitos: model yang lebih pintar = sistem yang lebih baik",
        type: "pitfall",
        body: "Yang benar: sistem LLM = model + prompt + data retrieval + parser downstream. Upgrade model bisa memperbaiki kemampuan menjawab sambil merusak format output yang diparsing sistem lain. `Lebih pintar` di benchmark tidak menjamin `lebih cocok` untuk kontrak perilakumu.",
      },
      reference: "LLMOps = disiplin mengoperasikan aplikasi LLM di produksi: eval kontinu, guardrail, biaya, observability.",
    },
    {
      id: "sifat-nondeterministik",
      eyebrow: "Langkah 2 · Sifat LLM",
      title: "Sifat 1: LLM itu nondeterministik",
      prose: [
        "Model klasik itu deterministik: skor kredit yang sama untuk input yang sama, hari ini dan besok. LLM tidak. Dengan `temperature` di atas nol, model melempar dadu setiap kali memilih kata berikutnya — prompt identik bisa menghasilkan lima varian jawaban yang semuanya `benar` tapi berbeda format. Inilah akar dari separuh incident LLMOps.",
        "Tingkat nondeterminisme bisa diukur. Jalankan prompt yang sama sebanyak N kali, hitung U = jumlah jawaban unik, lalu R = U / N. R = 0 berarti deterministik penuh; R mendekati 1 berarti setiap run berbeda. Di lab berikut kamu akan mengukurnya langsung dengan mock.",
        "💡 Intuisi: nondeterminisme bukan bug yang harus dihilangkan — ia fitur yang harus dikontrak. Kamu tidak bisa memaksa LLM deterministik penuh, tapi kamu bisa menetapkan batas: `untuk 200 kasus golden set, format tanggal harus konsisten 100%`, lalu mengujinya setiap ada perubahan.",
      ],
      formula: String.raw`R = \frac{U}{N}`,
      formulaNote: "R = tingkat nondeterminisme (0 sampai 1); U = jumlah jawaban unik yang muncul; N = total run dengan prompt identik.",
      tasks: [],
      note: {
        title: "Mitos: temperature 0 = deterministik selamanya",
        type: "pitfall",
        body: "Yang benar: temperature 0 membuat sampling mendekati deterministik untuk model yang sama — tapi vendor tetap bisa mengubah bobot, tokenizer, atau infrastruktur di balik layar tanpa pemberitahuan. Determinisme hari ini bukan jaminan determinisme bulan depan. Satu-satunya kontrak yang bisa dipegang adalah hasil uji regresimu sendiri.",
      },
      reference: "Ukur R = jawaban unik / total run. Tetapkan batas R yang bisa diterima per use case.",
    },
    {
      id: "sifat-kode-dependensi",
      eyebrow: "Langkah 3 · Sifat LLM",
      title: "Sifat 2 & 3: prompt adalah kode, model adalah dependensi",
      prose: [
        "Sifat kedua: prompt adalah kode. `System prompt` + template + konfigurasi (`temperature`, `max_tokens`) adalah satu paket artefak yang menentukan perilaku sistem. Mengubah satu kata — `jawab singkat` menjadi `jawab singkat dan ramah` — bisa menggeser metrik sama seperti mengubah satu baris kode. Maka ia butuh perlakuan kode: version control, code review, dan test sebelum deploy. Mengedit prompt langsung di dashboard produksi sama berbahayanya dengan mengedit kode langsung di server produksi.",
        "Sifat ketiga: model adalah dependensi eksternal, bukan asetmu. Seperti library yang bisa merilis breaking change diam-diam, vendor bisa meng-upgrade, me-retire, atau mengubah perilaku model kapan saja. Bedanya dengan library biasa: tidak ada semantic versioning yang bisa diandalkan, dan `breaking change`-nya berbentuk pergeseran perilaku halus, bukan error kompilasi.",
        "💡 Intuisi: kalau mengubahnya bisa merusak produksi, itu kode — tidak peduli bentuknya teks biasa. Prompt yang tidak di-version sama dengan kode yang tidak di-commit.",
        "💡 Intuisi: changelog vendor itu nice-to-have; golden set-mu adalah kontrak yang sebenarnya. Vendor boleh berubah sesukanya — yang penting, sistemmu tahu dalam 10 menit apakah perubahan itu merusakmu.",
      ],
      tasks: [],
      note: {
        title: "Mitos: prompt itu cuma teks instruksi, bukan artefak engineering",
        type: "pitfall",
        body: "Yang benar: prompt menentukan perilaku sistem sekuat kode. Tim yang memperlakukan prompt sebagai `sekadar teks` akan mengeditnya tanpa review, tanpa test, tanpa rollback — lalu kaget saat metrik anjlok dan tidak ada yang tahu versi mana yang terakhir jalan.",
      },
      reference: "Paket artefak LLM = prompt + template + config. Semua di-version, semua di-test.",
    },
    {
      id: "lab-nondeterminisme",
      eyebrow: "Langkah 4 · Lab",
      title: "Ukur nondeterminisme dengan mock",
      prose: [
        "Lab ini mensimulasikan perilaku LLM: `mock_llm` menerima prompt, temperature, dan seed, lalu mengembalikan salah satu dari 5 varian jawaban. Pada temperature 0 ia selalu mengembalikan varian pertama (deterministik); pada temperature 0,7 ia mengundi dari 5 varian. Tugasmu: jalankan 20 kali tiap setting dan hitung jawaban uniknya.",
        "Coba eksplorasi: ubah temperature dari 0,7 menjadi 0,3 lalu 1,0. Pada titik berapa varian jawaban mulai muncul? Apa artinya ini untuk chatbot yang mem-parsing outputnya secara otomatis?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `distinct_07` = jawaban unik pada temperature 0,7" },
        { id: "t2", text: "Hitung `distinct_00` = jawaban unik pada temperature 0" },
        { id: "t3", text: "Hitung `rate_07` = distinct_07 / 20" },
      ],
      expected: "distinct_07=5  distinct_00=1  rate_07=0.25",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Menghitung rate dari angka tebakan. `rate_07` harus dihitung dari `distinct_07` yang kamu ukur — bukan dari angka yang kamu kira-kira. Selalu turunkan metrik dari data, bukan dari intuisi.",
      },
      hints: [
        "Jawaban unik = ubah list menjadi set, lalu hitung panjangnya.",
        "rate_07 = distinct_07 dibagi banyaknya run (20).",
        "distinct_07 = len(set(outs_07))",
      ],
      code: {
        starter: `import random\n\ndef mock_llm(prompt, temperature, seed):\n    rng = random.Random(seed * 31 + len(prompt))\n    varian = ["Rp1,2 jt", "Rp1.200.000", "1,2 juta rupiah", "sekitar 1,2 juta", "1.2jt"]\n    if temperature == 0:\n        return varian[0]\n    k = min(len(varian), 1 + int(temperature * 10))\n    return varian[rng.randrange(k)]\n\nprompt = "Berapa biaya admin transfer antarbank?"\nouts_07 = [mock_llm(prompt, 0.7, s) for s in range(20)]\nouts_00 = [mock_llm(prompt, 0.0, s) for s in range(20)]\n\n# TULIS KODEMU: hitung jawaban unik tiap setting\ndistinct_07 = \ndistinct_00 = \nrate_07 = \n\nprint(f"distinct_07={distinct_07}  distinct_00={distinct_00}  rate_07={rate_07:.2f}")`,
        lockLines: 15,
        solution: `import random\n\ndef mock_llm(prompt, temperature, seed):\n    rng = random.Random(seed * 31 + len(prompt))\n    varian = ["Rp1,2 jt", "Rp1.200.000", "1,2 juta rupiah", "sekitar 1,2 juta", "1.2jt"]\n    if temperature == 0:\n        return varian[0]\n    k = min(len(varian), 1 + int(temperature * 10))\n    return varian[rng.randrange(k)]\n\nprompt = "Berapa biaya admin transfer antarbank?"\nouts_07 = [mock_llm(prompt, 0.7, s) for s in range(20)]\nouts_00 = [mock_llm(prompt, 0.0, s) for s in range(20)]\n\n# TULIS KODEMU: hitung jawaban unik tiap setting\ndistinct_07 = len(set(outs_07))\ndistinct_00 = len(set(outs_00))\nrate_07 = distinct_07 / len(outs_07)\n\nprint(f"distinct_07={distinct_07}  distinct_00={distinct_00}  rate_07={rate_07:.2f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "distinct_07", value: 5, tol: 1e-9, label: "`distinct_07` seharusnya 5", msg: "20 run pada temperature 0,7 mengundi dari 5 varian — semuanya muncul." },
          { kind: "equal", task: "t2", name: "distinct_00", value: 1, tol: 1e-9, label: "`distinct_00` seharusnya 1", msg: "Temperature 0 selalu mengembalikan varian pertama." },
          { kind: "equal", task: "t3", name: "rate_07", value: 0.25, tol: 1e-9, label: "`rate_07` seharusnya 0.25", msg: "5 / 20 = 0,25. Hitung dari distinct_07 yang terukur." },
          { kind: "stdout_matches", task: "t3", pattern: "distinct_07=5\\s+distinct_00=1\\s+rate_07=0\\.25", label: "`print` menampilkan tiga angka", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "len(set(list)) = jawaban unik. Nondeterminisme diukur, bukan dirasakan.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "MLOps, AI Engineering, atau LLMOps?",
      prose: [
        "Lima skenario. Satu: model skor kredit tabular, retrain bulanan, output angka deterministik, model milik sendiri → MLOps klasik. Buku lamanya masih berlaku penuh. Dua: prototype chatbot baru, tim mengutak-atik prompt setiap hari untuk demo ke investor → AI Engineering: fokus membangun aplikasi, iterasi cepat, belum ada beban produksi.",
        "Tiga: chatbot sudah live melayani 10.000 user per hari → LLMOps: eval kontinu, guardrail, cost control, observability. Keempat: vendor mengumumkan upgrade model bulan depan → LLMOps: jalankan regression test golden set sebelum cutover, siapkan canary dan rollback. Kelima: data nasabah sensitif + budget ketat → LLMOps: evaluasi self-host vs vendor, guardrail PII, routing model besar/kecil.",
        "Aturan praktis 10 detik: tanyakan `siapa yang bisa mengubah perilaku sistem tanpa sepengetahuanku?` Kalau jawabannya `tidak ada` — MLOps klasik cukup. Kalau jawabannya `vendor, temperature, atau prompt yang diedit rekan tim` — itu wilayah LLMOps, dan kamu butuh kontrak perilaku (golden set) yang diuji otomatis.",
      ],
      figure: {
        svg: MAP_SVG,
        alt: "Peta tiga disiplin: MLOps untuk model klasik, AI Engineering untuk membangun aplikasi, LLMOps untuk operasi LLM di produksi.",
        caption: "Cara membaca: tiga kolom = tiga disiplin dengan wilayah berbeda. Kolom yang disorot (LLMOps) adalah fokus track ini. Interpretasi: pilih disiplin berdasarkan siapa yang bisa mengubah perilaku sistem — model milik sendiri yang deterministik = MLOps; aplikasi yang dibangun cepat = AI Engineering; LLM produksi yang perilakunya bisa bergeser = LLMOps.",
      },
      tasks: [],
      note: {
        title: "Mitos: LLMOps = MLOps + prompt",
        type: "pitfall",
        body: "Yang benar: perbedaannya bukan sekadar `ditambah prompt`, melainkan asumsi dasar yang runtuh — determinisme, kepemilikan model, dan makna evaluasi. Menempelkan pipeline MLOps ke sistem LLM tanpa adaptasi menghasilkan dashboard hijau yang tidak menangkap incident nyata (seperti NusaBank).",
      },
      reference: "Tanya: siapa bisa mengubah perilaku sistem tanpa sepengetahuanmu? Jawabannya menentukan disiplinmu.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Biaya tiga jam incident NusaBank",
      prose: [
        "Hitung biaya incident di cerita pembuka. Data: 1.200 sesi chatbot gagal diproses selama 3 jam. 15% dari user yang gagal beralih menelepon call center: 1.200 × 15% = 180 panggilan. Biaya per panggilan Rp25.000 → 180 × 25.000 = Rp4.500.000. Ditambah 4 orang tim × 3 jam × Rp150.000/jam = Rp1.800.000 untuk pemadaman. Total biaya langsung: Rp6.300.000 — untuk satu pagi, satu perubahan yang tidak mereka lakukan.",
        "Pertanyaan analisis: (a) komponen biaya mana yang paling bisa ditekan — dan kontrol LLMOps apa yang menekannya? (b) mengapa tidak ada satu pun metrik vendor yang memperingatkan sebelum incident? (c) jika kamu hanya boleh memasang SATU kontrol sebelum incident berikutnya, apa itu dan mengapa?",
        "Jawaban yang defensibel: (a) biaya call center (Rp4,5 juta, 71% dari total) — ditekan dengan deteksi dini: regression test golden set otomatis setiap ada sinyal perubahan model, plus canary deployment. (b) metrik vendor mengukur kemampuan model, bukan kontrak perilaku sistemmu — format output bukan bagian dari benchmark. (c) golden set + regression test terjadwal: murah, menangkap pergeseran perilaku apa pun penyebabnya, dan memberi bukti sebelum menyalahkan vendor.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Biaya incident LLM jarang tercatat sebagai `biaya model` — ia tersebar sebagai biaya call center, lembur tim, dan churn nasabah. Tanpa atribusi yang benar, manajemen akan selalu under-invest di operasi LLM karena `modelnya kan sudah bagus`. Tugas analis: kumpulkan biaya tersebar ini menjadi satu angka.",
      },
      reference: "Total Rp6,3 juta: Rp4,5 jt call center + Rp1,8 jt tim. Pencegah termurah = regression test golden set.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Mengukur R dengan benar: berapa N?",
      prose: [
        "Lesson ini mengukur nondeterminisme lewat R = U/N. Tapi R yang diukur dari N = 5 run hampir tidak berarti apa-apa. Contoh: prompt format tanggal NusaBank dijalankan 5x, muncul 2 varian unik → R = 0,40. Ulangi 5x lagi: 4 varian → R = 0,80. R mana yang benar? Keduanya `benar` untuk sampelnya — tapi sampelnya terlalu kecil untuk dipercaya. R adalah ESTIMASI proporsi, dan setiap estimasi butuh ukuran sampel yang memadai.",
        "Rumus ukuran sampel untuk proporsi: n = z²R(1−R)/e². Dengan z = 1,96 (kepercayaan 95%), R ≈ 0,5 (kasus terburuk), e = 0,05 (±5pp): n = 3,84 × 0,25 / 0,0025 = 384. Artinya: untuk mengklaim `R = 0,40 ± 0,05`, butuh 384 run! Lab lesson ini memakai N kecil (5–20) untuk INTUISI — cepat dan murah. Untuk klaim produksi (`temperature 0,3 cukup deterministik untuk format tanggal`), jalankan 384x. Intuisi dan bukti punya harga berbeda.",
        "Tapi 384 run × Rp500 = Rp192 ribu per pengukuran — mahal jika dilakukan tiap hari untuk tiap prompt. Solusinya: sequential testing. Jalankan 50 dulu: jika R terukur 0,90 (sangat nondeterministik), interval kepercayaannya sudah cukup untuk menyimpulkan `terlalu acak` tanpa butuh 384 run. Hanya ketika R berada DI SEKITAR ambang keputusan (mis. 0,15 vs ambang 0,10) kamu butuh sampel penuh. Aturan praktis: sampel kecil untuk skrining, sampel besar untuk keputusan yang dekat ambang.",
        "Contoh keputusan nyata: ambang operasional `R ≤ 0,10 untuk field yang diparsing mesin`. Temperature 0,3 diuji 50 run → R = 0,06 (3 varian). Apakah lolos? SE = √(0,06×0,94/50) ≈ 0,034; batas atas 95% = 0,06 + 1,96×0,034 ≈ 0,127 > 0,10 — BELUM bisa klaim lolos! Butuh n = 3,84×0,06×0,94/0,025² ≈ 346 run untuk margin ±0,025. Setelah 346 run, R = 0,055: batas atas = 0,055 + 0,024 = 0,079 < 0,10 ✓ LOLOS. Inilah bedanya `R kecil` dengan `TERBUKTI kecil` — dan bedanya menentukan apakah parser-mu rusak di produksi atau tidak.",
      ],
      formula: String.raw`n = \frac{z^2 \cdot R(1-R)}{e^2}`,
      formulaNote: "n = jumlah run minimum; z = 1,96 untuk kepercayaan 95%; R = estimasi awal proporsi jawaban unik; e = margin error yang ditoleransi. Untuk klaim produksi di dekat ambang keputusan, jangan pakai N kecil — hitung n, ukur dengan n itu, baru klaim.",
      tasks: [],
      note: {
        title: "💡 Intuisi: R dari 5 run itu gosip, dari 384 run itu bukti",
        body: "Lab memakai N kecil agar cepat memberi intuisi — dan itu benar untuk belajar. Tapi jangan bawa angka lab ke rapat arsitektur. Untuk keputusan produksi (temperature berapa? model mana?), hitung n dulu, ukur dengan n itu, baru klaim. Skrining boleh murah; keputusan harus mahal.",
      },
      reference: "Skrining: N kecil. Keputusan di dekat ambang: n penuh dari rumus.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Kurva R vs temperature: di mana lututnya",
      prose: [
        "Jalankan prompt tanggal pada temperature 0,0 / 0,3 / 0,7 / 1,0 — masing-masing 100 run. Hasil tipikal: R = 0,02 / 0,08 / 0,45 / 0,78. Bentuknya BUKAN garis lurus, melainkan huruf S (sigmoid): datar di bawah 0,3, MELEDAK di 0,3–0,7, jenuh di atas 0,7. Titik lutut (knee) sekitar 0,4–0,5 adalah BATAS OPERASIONAL: di kirinya, menaikkan temperature sedikit tidak banyak mengubah R; di kanannya, sedikit kenaikan = ledakan varian yang harus ditangani downstream.",
        "Angka ini langsung menjadi kebijakan temperature. Field yang diparsing mesin (tanggal, JSON, angka) → temperature ≤ 0,3 (R < 0,10, terbukti dengan n = 346). Teks bebas untuk manusia (ringkasan, saran) → 0,7 boleh (variasi = kekayaan bahasa, bukan bug). Temperature 1,0+ hanya untuk eksplorasi kreatif — JANGAN untuk produksi yang butuh konsistensi. Kebijakan tanpa angka R = selera pribadi; kebijakan dengan angka = kontrak yang bisa diuji (LLMOps3).",
        "Waspadai: kurva ini BERGESER tiap model dan tiap versi vendor. Model A lututnya di 0,5; model B yang lebih kecil lututnya di 0,3 (lebih cepat acak). Setiap upgrade model (LLMOps10) = ukur ulang kurva = bagian dari regression test. Tim yang `mewarisi` temperature 0,7 dari model lama ke model baru tanpa mengukur ulang sedang berjudi dengan R — dan taruhannya adalah parser yang rusak diam-diam.",
      ],
      figure: {
        svg: LLMOPS1_DEEP_SVG,
        alt: "Kurva R vs temperature berbentuk S: datar sampai 0,3, meledak di 0,3-0,7, jenuh setelahnya.",
        caption: "Cara membaca: sumbu X = temperature, sumbu Y = R (proporsi jawaban unik dari 100 run); garis putus-putus = ambang operasional 0,10 untuk field yang diparsing mesin. Interpretasi: kurva berbentuk S dengan lutut di ~0,45 — temperature ≤ 0,3 aman untuk format ketat; 0,7 hanya untuk teks bebas. Ukur ulang kurva ini setiap ganti model atau versi vendor.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: temperature adalah kenop risiko, bukan kenop kreativitas",
        body: "Di produksi, temperature bukan soal `kreatif vs kaku` — ia soal BERAPA BANYAK varian yang harus ditangani downstream (parser, checker, human review). Setiap +0,1 di atas lutut melipatgandakan biaya penanganan varian. Tetapkan temperature dari kurva R, bukan dari firasat.",
      },
      reference: "Kebijakan temperature = f(kurva R, ambang parsing). Ukur ulang tiap upgrade model.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Enam pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "LLM nondeterministik (R = jawaban unik / total run), prompt adalah kode, model adalah dependensi eksternal.",
        "MLOps = model klasik deterministik milik sendiri; AI Engineering = membangun aplikasi; LLMOps = operasi LLM produksi.",
        "Benchmark vendor mengukur kemampuan model, bukan kontrak perilaku sistemmu — golden set-mu yang menjadi kontrak.",
        "Prompt butuh version control, review, dan test seperti kode; edit langsung di dashboard produksi = edit kode di server produksi.",
        "Biaya incident LLM tersebar (call center, lembur, churn) — kumpulkan menjadi satu angka agar investasinya defensibel.",
      ],
      next: { label: "LLMOps2 — Prompt Management & Versioning", href: "/v2/learn/llmops2-prompt-mgmt" },
      quiz: [
        {
          q: "Prompt identik dikirim 20 kali ke LLM (temperature 0,7) menghasilkan 5 varian jawaban. Penjelasan yang tepat?",
          options: [
            { text: "Ada bug di API vendor", why: "Bukan bug — sampling stokastik adalah perilaku yang didesain pada temperature > 0." },
            { text: "Model melempar dadu tiap memilih kata berikutnya (sampling stokastik)", why: "Temperature mengontrol seberapa acak pemilihan token berikutnya. Prompt sama + sampling acak = output bervariasi.", correct: true },
            { text: "Cache vendor belum sinkron antar server", why: "Cache justru membuat output lebih konsisten, bukan lebih bervariasi." },
            { text: "Prompt-nya terlalu panjang", why: "Panjang prompt tidak menyebabkan variasi antar run identik." },
          ],
        },
        {
          q: "Vendor mengklaim akurasi 99% di benchmark. Mengapa ini tidak cukup untuk deploy aman?",
          options: [
            { text: "Benchmark pasti dimanipulasi vendor", why: "Tidak perlu menuduh manipulasi — masalahnya lebih mendasar dari itu." },
            { text: "Benchmark mengukur kemampuan menjawab soal, bukan kontrak perilaku sistemmu (format, gaya, penolakan)", why: "NusaBank membuktikannya: benchmark hijau, format tanggal berubah, parser rusak. Kontrak perilaku = golden set-mu sendiri.", correct: true },
            { text: "Akurasi 99% terlalu rendah untuk produksi", why: "99% bukan masalahnya — relevansi metriknya yang salah." },
            { text: "Benchmark hanya untuk model open-source", why: "Benchmark dipakai semua vendor; masalahnya bukan jenis modelnya." },
          ],
        },
        {
          q: "Apa arti praktis dari `prompt adalah kode`?",
          options: [
            { text: "Prompt harus ditulis dalam bahasa pemrograman", why: "Bentuknya tetap teks — yang berubah adalah perlakuannya." },
            { text: "Perubahan prompt butuh versioning, review, dan test seperti perubahan kode", why: "Karena prompt menentukan perilaku sistem sekuat kode: satu kata bisa menggeser metrik.", correct: true },
            { text: "Hanya programmer yang boleh menulis prompt", why: "Siapa pun boleh menulis — tapi perubahannya harus melewati proses yang sama." },
            { text: "Prompt harus di-compile sebelum dipakai", why: "Tidak ada kompilasi; analoginya soal disiplin perubahan, bukan tooling." },
          ],
        },
        {
          q: "Tim membangun model skor kredit tabular sendiri, retrain bulanan, output deterministik. Disiplin yang tepat?",
          options: [
            { text: "LLMOps penuh", why: "Tidak ada LLM di sini — tidak ada nondeterminisme, prompt, atau dependensi vendor model." },
            { text: "MLOps klasik", why: "Model deterministik milik sendiri dengan retrain terjadwal = wilayah klasik MLOps: data, training, drift monitoring.", correct: true },
            { text: "AI Engineering", why: "Tidak ada aplikasi LLM yang dibangun." },
            { text: "Tidak butuh operasi sama sekali", why: "Model produksi tetap butuh monitoring drift dan retrain — itu justru inti MLOps." },
          ],
        },
        {
          q: "Temperature 0 menjamin output identik selamanya. Benar atau salah?",
          options: [
            { text: "Benar — temperature 0 mematikan semua keacakan", why: "Hanya untuk model dan infrastruktur yang sama hari ini; vendor tetap bisa mengubah segalanya besok." },
            { text: "Salah — vendor bisa mengubah model/infrastruktur tanpa pemberitahuan", why: "Determinisme hari ini bukan kontrak masa depan. Regression test golden set adalah satu-satunya bukti yang bertahan.", correct: true },
            { text: "Benar — sudah dijamin di SLA semua vendor", why: "Tidak ada vendor yang menjamin determinisme bit-level selamanya di SLA." },
            { text: "Salah — temperature 0 tidak ada efeknya", why: "Temperature 0 memang membuat sampling mendekati deterministik; masalahnya adalah jaminan waktunya." },
          ],
        },
        {
          q: "Temperature 0,3 diuji 50 run → R = 0,06. Ambang operasional R ≤ 0,10 untuk field tanggal. Kesimpulan yang TEPAT?",
          options: [
            { text: "Lolos — 0,06 jelas di bawah 0,10", why: "0,06 adalah ESTIMASI dengan SE ≈ 0,034; batas atas 95% = 0,127 > 0,10. Angka titik di bawah ambang belum berarti TERBUKTI di bawah ambang." },
            { text: "Belum terbukti lolos; butuh ~346 run untuk kepastian di dekat ambang", why: "Tepat. Dengan n=50, interval kepercayaan masih melewati ambang 0,10. Keputusan di dekat ambang wajib sampel penuh — R kecil belum tentu terbukti kecil.", correct: true },
            { text: "Gagal — syaratnya harus R = 0,00", why: "Ambangnya 0,10, bukan nol. Nondeterminisme kecil masih wajar untuk LLM; yang dibutuhkan adalah BUKTI di bawah ambang, bukan kesempurnaan." },
            { text: "Naikkan ke temperature 0,7 agar jawabannya lebih kreatif", why: "0,7 memberi R ≈ 0,45 — format tanggal akan bervariasi liar dan parser rusak. Kreativitas bukan tujuan untuk field yang diparsing mesin." },
          ],
        },
      ],
    },
  ],
};
