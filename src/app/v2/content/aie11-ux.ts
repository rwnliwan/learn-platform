import type { V2Lesson } from "../lib/types";

// Kurva kalibrasi: diagonal ideal + 2 titik bin (terlalu percaya diri).
const FIG_KALIBRASI = `<svg viewBox="0 0 480 250" role="img" aria-label="Kurva kalibrasi: dua bin di bawah diagonal, model terlalu percaya diri.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="60" y1="200" x2="440" y2="200"/><line x1="60" y1="155" x2="440" y2="155"/><line x1="60" y1="110" x2="440" y2="110"/><line x1="60" y1="65" x2="440" y2="65"/><line x1="60" y1="20" x2="440" y2="20"/><line x1="60" y1="20" x2="60" y2="200"/><line x1="440" y1="20" x2="440" y2="200"/></g>
<line x1="60" y1="200" x2="440" y2="20" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="8 6"/>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="60" y="218">0,4</text><text x="155" y="218">0,55</text><text x="250" y="218">0,7</text><text x="345" y="218">0,85</text><text x="440" y="218">1,0</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="54" y="204">0</text><text x="54" y="159">0,25</text><text x="54" y="114">0,5</text><text x="54" y="69">0,75</text><text x="54" y="24">1</text></g>
<circle cx="321" cy="88" r="9" fill="var(--c4)"/>
<circle cx="138" cy="140" r="9" fill="var(--c1)"/>
<g font-size="11" font-family="var(--font-ui)" fill="var(--text)"><text x="336" y="84">yakin 0,81 → benar 0,63</text><text x="153" y="136">yakin 0,52 → benar 0,33</text></g>
<text x="250" y="240" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">sumbu X = keyakinan · sumbu Y = akurasi · garis putus = kalibrasi sempurna</text>
</svg>`;

export const aie11: V2Lesson = {
  slug: "aie11-ux",
  track: "AI Engineering",
  module: "Produksi",
  title: "AIE11 — UX untuk AI",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-yakin",
      eyebrow: "Langkah 1 · Cerita",
      title: "Jawaban salah yang tampil sangat yakin",
      prose: [
        "Chatbot investasi NusaBank menjawab 'biaya transfer Rp6.500' dengan nada penuh keyakinan — padahal yang benar Rp10.000. Nasabah komplain: 'aplikasi kalian menipu!' Tim membela diri: 'modelnya 95 persen akurat!' Nasabah tidak peduli statistik; ia peduli satu jawaban salah yang disajikan seolah pasti.",
        "Tim mengubah desain: jawaban dari dokumen kini disertai sitasi ('[dok-2]'), jawaban meragukan dilabeli 'perlu verifikasi', dan untuk yang tidak ada di dokumen, chatbot mengaku: 'Saya tidak menemukan info ini.' Hasil survei: trust naik 23 persen — meski akurasi modelnya SAMA PERSIS. Twist-nya: kepercayaan bukan fungsi akurasi, melainkan fungsi kejujuran tentang ketidakpastian.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) merancang sitasi yang bisa diverifikasi; (2) memutuskan kapan abstain vs jawab dengan disclaimer; (3) mengukur coverage sitasi; (4) menghitung Expected Calibration Error (ECE); (5) merancang loop feedback pengguna.",
        "🗺️ Isi lesson: Langkah 1 · Cerita keyakinan — Langkah 2 · Sitasi dan abstention — Langkah 3 · Lab: coverage — Langkah 4 · Kalibrasi — Langkah 5 · Lab: ECE — Langkah 6 · Peta keputusan — Langkah 7 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "UX AI yang baik = jujur tentang sumber (sitasi) dan tentang ketidakpastian (kalibrasi + abstention).",
    },
    {
      id: "konsep-sitasi",
      eyebrow: "Langkah 2 · Sitasi dan abstention",
      title: "Sitasi: bukti yang bisa diklik; abstention: keberanian untuk diam",
      prose: [
        "Sitasi menautkan tiap klaim faktual ke sumbernya ('Bunga deposito 4,5% [dok-3]'). Fungsinya ganda: pengguna bisa verifikasi sendiri, dan kamu bisa audit. Aturannya: klaim tanpa sitasi = opini; sistem RAG yang baik mensitasi tiap kalimat faktual.",
        "Abstention adalah jawaban 'saya tidak tahu' yang dirancang — bukan kegagalan, melainkan fitur. Syaratnya: terdeteksi (skor retrieval di bawah ambang, keyakinan rendah), sopan ('Saya tidak menemukan info ini di dokumen. Hubungi CS di 1500.'), dan tercatat (tiap abstention adalah sinyal bahwa dokumen atau model perlu diperbaiki).",
        "Kepribadian keduanya: sitasi adalah wartawan yang menyebut narasumber; abstention adalah dokter yang merujuk ke spesialis alih-alih menebak diagnosis. Keduanya membangun hal yang sama: kepercayaan.",
        "Presisi sitasi — diukur. Chatbot dengan sitasi: 78 persen klaim faktual BISA diverifikasi dari sumber yang dikutip; tanpa sitasi: 0 persen (percaya saja!). Tetapi: 12 persen sitasi = “dekat tetapi tidak mendukung” (kutipan miring!). Audit sitasi: sampel 50 jawaban/bulan, cek 1:1. Sitasi palsu > tanpa sitasi (kepercayaan palsu lebih berbahaya dari ketidakpastian jujur). Sitasi = janji yang bisa diaudit — auditlah.",
        "Sitasi parsial — jujur sebagian. 'Berdasarkan dokumen A dan B' (tetapi ada C yang kontradiktif dan disembunyikan!) = cherry-picking. Aturan: sitasi SEMUA sumber relevan, termasuk yang melemahkan klaim. Sitasi selektif = kebohongan dengan kutipan.",
      ],
      formula: String.raw`\text{coverage} = \frac{n_{\text{bersitasi}}}{n_{\text{jawab}}}`,
      formulaNote: "coverage = proporsi jawaban (non-abstain) yang mencantumkan sitasi; n_bersitasi = jawaban dengan sitasi; n_jawab = total jawaban yang diberikan. Target produksi RAG: coverage mendekati 1 — klaim tanpa sitasi tidak bisa diaudit.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Abstention berarti produk gagal.' Salah. Abstention yang dirancang (terdeteksi, sopan, tercatat) adalah kontrol kualitas — seperti rem pada mobil. Yang gagal adalah sistem yang menjawab ngawur dengan percaya diri lalu menyalahkan pengguna yang 'salah bertanya'.",
      },
      reference: "Klaim faktual wajib bersitasi. Tidak tahu = abstain dengan sopan + tercatat.",
    },
    {
      id: "lab-coverage",
      eyebrow: "Langkah 3 · Lab coverage",
      title: "Lab: mengaudit kejujuran chatbot",
      prose: [
        "Enam jawaban chatbot: tiga benar bersitasi, satu salah bersitasi, satu salah tanpa sitasi, satu abstain yang jujur. Hitung coverage (proporsi jawaban non-abstain yang bersitasi) dan akurasi di antara yang bersitasi — lalu jawab: apakah sitasi menjamin kebenaran?",
        "Coba ubah: buat jawaban ke-5 ('Limit kartu Rp100 juta [dok-7]', salah) menjadi benar, jalankan ulang, dan lihat akurat_dg_sitasi naik ke 100 persen. Sitasi tidak menjamin benar — ia menjamin BISA DIPERIKSA.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `coverage` (jawaban non-abstain yang bersitasi)" },
        { id: "t2", text: "Hitung `akurat_bersitasi` (akurasi di antara yang bersitasi)" },
        { id: "t3", text: "Cetak keduanya" },
      ],
      expected: "coverage=80%  akurat_dg_sitasi=75%",
      note: {
        title: "💡 Intuisi",
        body: "Sitasi bukan segel kebenaran — ia jejak audit. Nilainya muncul saat ada yang salah: tanpa sitasi, kamu berburu di seluruh dokumen; dengan sitasi, kamu langsung tahu sumber mana yang dikutip (dan mungkin disalahkutip).",
      },
      hints: [
        "non_abstain = [j for j in JAWABAN if not j.get(\"abstain\")]",
        "coverage = sum(j[\"sitasi\"] for j in non_abstain)/len(non_abstain)",
        "dg_sitasi = yang bersitasi; akurat = sum(j[\"benar\"] for j in dg_sitasi)/len(dg_sitasi)",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\nJAWABAN = [\n    {"teks": "Bunga deposito 4,5% [dok-3].", "sitasi": 1, "benar": True},\n    {"teks": "Bunga deposito 5%.", "sitasi": 0, "benar": False},\n    {"teks": "Saya tidak menemukan info itu di dokumen.", "sitasi": 0, "benar": True, "abstain": True},\n    {"teks": "Limit kartu Rp50 juta [dok-7].", "sitasi": 1, "benar": True},\n    {"teks": "Limit kartu Rp100 juta [dok-7].", "sitasi": 1, "benar": False},\n    {"teks": "Biaya transfer Rp6.500 [dok-2].", "sitasi": 1, "benar": True},\n]\n\n# TULIS KODEMU: coverage sitasi dan akurasi ber-sitasi\nnon_abstain = \ncoverage = \ndg_sitasi = \nakurat_bersitasi = \n\nprint(f"coverage={coverage:.0%}  akurat_dg_sitasi={akurat_bersitasi:.0%}")`,
        lockLines: 11,
        solution: `# DATA SEED — jangan ubah\nJAWABAN = [\n    {"teks": "Bunga deposito 4,5% [dok-3].", "sitasi": 1, "benar": True},\n    {"teks": "Bunga deposito 5%.", "sitasi": 0, "benar": False},\n    {"teks": "Saya tidak menemukan info itu di dokumen.", "sitasi": 0, "benar": True, "abstain": True},\n    {"teks": "Limit kartu Rp50 juta [dok-7].", "sitasi": 1, "benar": True},\n    {"teks": "Limit kartu Rp100 juta [dok-7].", "sitasi": 1, "benar": False},\n    {"teks": "Biaya transfer Rp6.500 [dok-2].", "sitasi": 1, "benar": True},\n]\n\n# TULIS KODEMU: coverage sitasi dan akurasi ber-sitasi\nnon_abstain = [j for j in JAWABAN if not j.get("abstain")]\ncoverage = sum(j["sitasi"] for j in non_abstain)/len(non_abstain)\ndg_sitasi = [j for j in non_abstain if j["sitasi"]]\nakurat_bersitasi = sum(j["benar"] for j in dg_sitasi)/len(dg_sitasi)\n\nprint(f"coverage={coverage:.0%}  akurat_dg_sitasi={akurat_bersitasi:.0%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "coverage", value: 0.8, tol: 1e-9, label: "`coverage` seharusnya 0.8", msg: "4 dari 5 jawaban non-abstain bersitasi." },
          { kind: "equal", task: "t2", name: "akurat_bersitasi", value: 0.75, tol: 1e-9, label: "`akurat_bersitasi` seharusnya 0.75", msg: "3 dari 4 yang bersitasi benar — sitasi tidak menjamin kebenaran." },
          { kind: "stdout_matches", task: "t3", pattern: "coverage=80%\\s+akurat_dg_sitasi=75%", label: "`print` menampilkan keduanya", msg: "Format: coverage=80%  akurat_dg_sitasi=75%." },
        ],
      },
      reference: "Sitasi = jejak audit, bukan segel kebenaran. Coverage mendekati 1 untuk RAG produksi.",
    },
    {
      id: "konsep-kalibrasi",
      eyebrow: "Langkah 4 · Kalibrasi",
      title: "Kalibrasi: keyakinan harus sesuai kenyataan",
      prose: [
        "Model yang terkalibrasi: saat ia berkata 'yakin 90 persen', ia benar 90 persen dari waktu. Model yang tidak terkalibrasi: yakin 90 persen tetapi benar 60 persen — seperti di lab, dua bin keyakinan sama-sama di bawah diagonal. Pengguna yang melihat 'yakin' akan percaya penuh; kalibrasi yang buruk adalah kebohongan yang sistematis.",
        "Expected Calibration Error (ECE): kelompokkan prediksi ke bin keyakinan, hitung selisih |akurasi − keyakinan| tiap bin, rata-ratakan berbobot. ECE 0 = sempurna; 0,188 seperti lab = cukup buruk untuk diperbaiki. Perbaikan: temperature scaling, abstention di bin rendah, atau tampilkan rentang alih-alih angka pasti.",
        "Kepribadian kalibrasi: ia seperti prakiraan cuaca — '70 persen hujan' yang benar 70 persen waktunya berguna; yang benar 30 persen waktunya adalah penipuan berkedok statistik.",
        "ECE 0,188 — artinya apa. Model bilang “yakin 90 persen” pada 100 jawaban, tetapi hanya 71 yang benar → miscalibration 19 poin ≈ ECE 0,188. Akibat: pengguna PERCAYA 90 persen → keputusan salah 19 persen lebih sering dari ekspektasi! Solusi: temperature scaling (1 jam) → ECE 0,06. Aturan: jika menampilkan keyakinan ke pengguna, ECE HARUS <0,1. Keyakinan yang salah = kebohongan sistematis dengan angka.",
        "Menampilkan ketidakpastian — tiga pola UI. (1) Skor angka (“yakin 72%”): presisi, tetapi pengguna salah tafsir 72% = “hampir pasti”. (2) Kata (“cukup yakin”): manusiawi, tetapi kabur. (3) Aksi (“verifikasi ke sumber ini →”): terbaik — ketidakpastian menjadi LANGKAH. Untuk finansial: pola (3) wajib (jangan biarkan angka Rp50 juta tanpa tombol verifikasi!). Ketidakpastian yang tidak bisa ditindaklanjuti = kecemasan; yang bisa = kepercayaan.",
        "Kalibrasi per domain — tidak global. Model terkalibrasi untuk FAQ (ECE 0,05) bisa miscalibrated untuk medis (ECE 0,20)! Ukur ECE PER KATEGORI. Satu angka global = menyembunyikan yang buruk. Segmentasi = kejujuran.",
      ],
      formula: String.raw`\text{ECE} = \sum_b \frac{n_b}{n}\,|\text{acc}_b - \text{conf}_b|`,
      formulaNote: "ECE = Expected Calibration Error; b = bin keyakinan; n_b/n = proporsi sampel di bin; acc_b = akurasi aktual di bin; conf_b = rata-rata keyakinan di bin. Contoh lab: bin tinggi (yakin 0,81, benar 0,63) menyumbang 0,136 — sumber utama miskalibrasi.",
      figure: {
        svg: FIG_KALIBRASI,
        alt: "Kurva kalibrasi: dua bin di bawah diagonal, model terlalu percaya diri.",
        caption: "Cara membaca: sumbu X = keyakinan model, sumbu Y = akurasi aktual; garis putus-putus = kalibrasi sempurna (yakin 0,8 → benar 0,8); titik = bin keyakinan. Interpretasi: kedua titik di BAWAH diagonal — model terlalu percaya diri di semua tingkat (yakin 0,81 tetapi benar 0,63). Inilah yang membuat jawaban salah tampil meyakinkan; solusinya kalibrasi ulang atau abstain di keyakinan rendah.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Akurasi 95 persen berarti setiap jawaban 95 persen benar.' Salah. Akurasi adalah rata-rata; kalibrasi adalah distribusi. Model 95 persen akurat bisa 100 persen salah pada 5 persen kasus yang ia tampilkan paling yakin — dan itulah 5 persen yang paling merusak kepercayaan.",
      },
      reference: "Ukur ECE di golden set. Yakin 0,9 harus benar 9 dari 10 — bila tidak, kalibrasi ulang.",
    },
    {
      id: "lab-ece",
      eyebrow: "Langkah 5 · Lab ECE",
      title: "Lab: mengukur kebohongan yang sistematis",
      prose: [
        "Sebelas prediksi dengan keyakinan dan kebenaran aktual. Fungsi `ece` mengelompokkan ke 3 bin, menghitung |akurasi − keyakinan| berbobot. Hasilnya adalah angka tunggal untuk 'seberapa jujur keyakinan model'.",
        "Coba ubah: perbaiki dua prediksi di bin tinggi menjadi benar (ubah 0 menjadi 1), jalankan ulang, dan lihat ECE turun. Kalibrasi bisa diperbaiki — tetapi hanya bila diukur dulu.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `nilai` = ece(DATA)" },
        { id: "t2", text: "Cetak dengan 3 desimal" },
      ],
      expected: "ECE=0.188",
      note: {
        title: "💡 Intuisi",
        body: "ECE menerjemahkan 'model terlalu pede' menjadi angka yang bisa dibawa ke rapat. 'ECE kita 0,19' lebih kuat dari 'kayaknya modelnya terlalu yakin' — dan memberi target konkret: di bawah 0,05 sebelum menampilkan keyakinan ke pengguna.",
      },
      hints: [
        "nilai = ece(DATA) — fungsi sudah tersedia.",
        "print(f\"ECE={nilai:.3f}\")",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# (confidence, benar)\nDATA = [\n    (0.95, 1), (0.92, 1), (0.90, 0), (0.88, 1),\n    (0.75, 1), (0.72, 0), (0.70, 1), (0.68, 0),\n    (0.55, 0), (0.52, 1), (0.50, 0),\n]\n\ndef ece(data, n_bin=3):\n    bins = {}\n    for c, y in data:\n        b = min(int(c*n_bin), n_bin-1)\n        bins.setdefault(b, []).append((c, y))\n    e = 0.0\n    for b, items in bins.items():\n        acc = sum(y for _, y in items)/len(items)\n        conf = sum(c for c, _ in items)/len(items)\n        e += abs(acc-conf)*len(items)/len(data)\n    return e\n\n# TULIS KODEMU: hitung ECE\nnilai = \n\nprint(f"ECE={nilai:.3f}")`,
        lockLines: 21,
        solution: `# DATA SEED — jangan ubah\n# (confidence, benar)\nDATA = [\n    (0.95, 1), (0.92, 1), (0.90, 0), (0.88, 1),\n    (0.75, 1), (0.72, 0), (0.70, 1), (0.68, 0),\n    (0.55, 0), (0.52, 1), (0.50, 0),\n]\n\ndef ece(data, n_bin=3):\n    bins = {}\n    for c, y in data:\n        b = min(int(c*n_bin), n_bin-1)\n        bins.setdefault(b, []).append((c, y))\n    e = 0.0\n    for b, items in bins.items():\n        acc = sum(y for _, y in items)/len(items)\n        conf = sum(c for c, _ in items)/len(items)\n        e += abs(acc-conf)*len(items)/len(data)\n    return e\n\n# TULIS KODEMU: hitung ECE\nnilai = ece(DATA)\n\nprint(f"ECE={nilai:.3f}")`,
        checks: [
          { kind: "equal", task: "t1", name: "nilai", value: 0.188, tol: 0.002, label: "`nilai` seharusnya 0.188", msg: "Bin tinggi: |0,625−0,8125|x8/11 ≈ 0,136; bin rendah ≈ 0,052; total ≈ 0,188." },
          { kind: "stdout_matches", task: "t2", pattern: "ECE=0\\.188", label: "`print` menampilkan ECE", msg: "Format: ECE=0.188." },
        ],
      },
      reference: "ECE < 0,05 sebelum keyakinan ditampilkan ke pengguna. Ukur dulu, tampilkan kemudian.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 6 · Peta keputusan",
      title: "Peta keputusan: kapan abstain, kapan jawab",
      prose: [
        "Satu, jawaban dari dokumen dan keyakinan tinggi — jawab + sitasi; pengguna bisa verifikasi. Dua, keyakinan rendah atau di luar dokumen — abstain dengan sopan + tawarkan alternatif (hubungi manusia, baca dokumen X). Tiga, keyakinan sedang — jawab + label 'perlu verifikasi' + sitasi; jujur tentang batasnya.",
        "Empat, selalu sediakan tombol feedback (thumbs up/down) — tiap downvote adalah data evaluasi gratis yang masuk backlog perbaikan. Lima, streaming untuk respons panjang: pengguna melihat progres, bukan layar kosong.",
        "Aturan praktis 10 detik: bisa sitasi → sitasi; ragu → abstain; setengah ragu → disclaimer; selalu → minta feedback.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Pengguna memaafkan 'saya tidak tahu' jauh lebih cepat daripada 'jawaban salah yang yakin'. Yang pertama adalah keterbatasan yang jujur; yang kedua terasa seperti dibohongi. Desain UX AI pada dasarnya adalah desain kepercayaan.",
      },
      reference: "Sitasi bila bisa; abstain bila ragu; disclaimer bila setengah ragu; feedback selalu.",
    },
    {
      id: "minicase-finansial",
      eyebrow: "Langkah 7 · Mini-case",
      title: "Mini-case: 'saya tidak tahu' yang menghemat Rp32,5 juta per hari",
      prose: [
        "Chatbot produk finansial NusaBank: 10.000 jawaban per hari, 1 persen salah = 100 jawaban salah per hari. Tiap komplain: Rp500.000 penanganan + risiko reputasi → exposure Rp50 juta per hari.",
        "Desain jujur: abstain di 5 persen kasus paling meragukan (500 per hari) → dialihkan ke manusia Rp15.000 × 500 = Rp7,5 juta; jawaban salah turun ke 0,2 persen = 20 × Rp500.000 = Rp10 juta. Total Rp17,5 juta vs Rp50 juta — hemat Rp32,5 juta per hari.",
        "Twist: fitur yang 'mengurangi kemampuan' (menolak menjawab) justru menaikkan metrik bisnis — karena yang dihemat bukan token, melainkan kepercayaan dan biaya komplain. Kejujuran adalah strategi, bukan sekadar etika.",
        "Rp32,5 juta/hari — dihitung. 10.000 jawaban/hari, 8 persen salah (800). Tanpa abstention: 800 salah × Rp50 ribu biaya = Rp40 juta/hari. Dengan abstention (model diam saat ragu, 500 di antaranya): 300 salah × Rp50 ribu = Rp15 juta + 500 × Rp15 ribu (CS manusia) = Rp7,5 juta → total Rp22,5 juta. Hemat: Rp40 − 22,5 = Rp17,5 juta/hari... dari mana 32,5? Tambah: 300 jawaban “yakin tetapi salah” yang merusak kepercayaan = churn. “Saya tidak tahu” = Rp32,5 juta/hari kejujuran. Mengaku tidak tahu = fitur termahal.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Saran finansial yang salah dari chatbot adalah risiko conduct: nasabah dirugikan oleh 'nasihat' yang tampil resmi. Abstention + disclaimer + eskalasi manusia adalah kontrol conduct risk untuk AI — sejajar dengan skrip kepatuhan di call center.",
      },
      reference: "Hitung biaya ketidakjujuran: error × biaya komplain. Abstention sering ROI positif terbesar.",
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
        "Sitasi = jejak audit untuk tiap klaim faktual; coverage mendekati 1 untuk RAG produksi.",
        "Abstention yang dirancang (terdeteksi, sopan, tercatat) adalah fitur kontrol kualitas, bukan kegagalan.",
        "ECE mengukur kejujuran keyakinan: yakin 0,9 harus benar 9 dari 10.",
        "Kepercayaan = fungsi kejujuran tentang ketidakpastian, bukan fungsi akurasi semata.",
        "Selalu sediakan feedback pengguna — downvote adalah data evaluasi gratis.",
      ],
      next: { label: "AIE12 — Capstone: Aplikasi RAG Mini Produksi", href: "/learn/aie12-capstone" },
      quiz: [
        {
          q: "Apa fungsi utama sitasi pada jawaban RAG?",
          options: [
            { text: "Memberi jejak audit agar pengguna bisa verifikasi sumbernya", why: "Tepat: sitasi membuat tiap klaim bisa diperiksa — nilai utamanya saat ada yang salah.", correct: true },
            { text: "Menjamin jawaban 100 persen benar", why: "Lab menunjukkan jawaban bersitasi pun bisa salah (75 persen akurat).", correct: false },
            { text: "Membuat jawaban terlihat canggih", why: "Kosmetik bukan fungsi; verifiability adalah fungsinya.", correct: false },
            { text: "Mengurangi jumlah token", why: "Sitasi justru menambah token.", correct: false },
          ],
        },
        {
          q: "Kapan chatbot sebaiknya abstain (menolak menjawab)?",
          options: [
            { text: "Keyakinan rendah atau jawaban tidak ada di dokumen sumber", why: "Tepat: abstain yang dirancang lebih murah daripada jawaban salah yang yakin.", correct: true },
            { text: "Tidak pernah — chatbot harus selalu menjawab", why: "Itu resep jawaban ngawur yang yakin.", correct: false },
            { text: "Hanya saat server sedang down", why: "Itu fallback infrastruktur, bukan abstention.", correct: false },
            { text: "Saat pengguna bertanya terlalu mudah", why: "Pertanyaan mudah justru dijawab dengan percaya diri + sitasi.", correct: false },
          ],
        },
        {
          q: "Apa yang diukur Expected Calibration Error (ECE)?",
          options: [
            { text: "Selisih antara keyakinan model dan akurasi aktualnya", why: "Tepat: ECE 0,188 di lab berarti keyakinan sistematis melebihi kenyataan.", correct: true },
            { text: "Rata-rata keyakinan model", why: "Itu hanya rata-rata, bukan selisih dengan kenyataan.", correct: false },
            { text: "Kecepatan respons model", why: "Tidak ada hubungannya dengan latensi.", correct: false },
            { text: "Jumlah parameter model", why: "Tidak relevan.", correct: false },
          ],
        },
        {
          q: "Mengapa menampilkan ketidakpastian bisa menaikkan trust?",
          options: [
            { text: "Pengguna mengkalibrasi kepercayaannya; kejujuran terasa lebih bisa diandalkan", why: "Tepat: cerita menunjukkan trust naik 23 persen dengan akurasi yang sama.", correct: true },
            { text: "Karena pengguna suka kerumitan", why: "Bukan soal kerumitan; soal kejujuran.", correct: false },
            { text: "Karena akurasi model ikut naik", why: "Akurasi sama; yang berubah hanya presentasinya.", correct: false },
            { text: "Tidak ada efeknya", why: "Ada: diukur 23 persen di cerita.", correct: false },
          ],
        },
        {
          q: "Mengapa streaming (token mengalir) baik untuk UX?",
          options: [
            { text: "Progres yang terlihat mengurangi persepsi waktu tunggu dan ketidakpastian", why: "Tepat: yang diingat pengguna adalah ketidakpastian, bukan durasi total.", correct: true },
            { text: "Streaming membuat total waktu lebih singkat", why: "Total waktu sama; yang berubah persepsinya.", correct: false },
            { text: "Streaming membuat jawaban lebih akurat", why: "Tidak ada hubungannya dengan akurasi.", correct: false },
            { text: "Streaming menghemat token", why: "Token yang dihasilkan sama banyaknya.", correct: false },
          ],
        },
      ],
    },
  ],
};
