import type { V2Lesson } from "../lib/types";

// Batang horizontal skala log: full fine-tune 2,1B vs LoRA 8,4M parameter.
const FIG_LORA = `<svg viewBox="0 0 480 190" role="img" aria-label="Full fine-tune 2,1 miliar parameter vs LoRA 8,4 juta parameter, skala logaritmik.">
<g fill="var(--chart-text)" font-size="12" font-family="var(--font-ui)"><text x="10" y="62">full fine-tune</text><text x="10" y="132">LoRA r=8</text></g>
<rect x="150" y="42" width="300" height="30" fill="var(--c4)"/>
<rect x="150" y="112" width="110" height="30" fill="var(--c1)"/>
<g font-size="12" font-family="var(--font-ui)"><text x="150" y="32" fill="var(--text)" font-weight="600">2,1 miliar parameter (100%)</text><text x="150" y="102" fill="var(--text)" font-weight="600">8,4 juta parameter (0,39%)</text></g>
<text x="240" y="172" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">panjang batang dalam skala logaritmik — selisih sebenarnya 250x lipat</text>
</svg>`;

export const aie5: V2Lesson = {
  slug: "aie5-finetuning",
  track: "AI Engineering",
  module: "RAG & Retrieval",
  title: "AIE5 — Fine-Tuning: Kapan dan Bagaimana",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-tiga-minggu",
      eyebrow: "Langkah 1 · Cerita",
      title: "Tiga minggu fine-tuning yang kalah dari dua hari RAG",
      prose: [
        "Tim NusaBank menghabiskan tiga minggu men-fine-tune model agar 'tahu' 200 halaman SOP: kumpulkan data, sewa GPU, tuning hyperparameter. Hasilnya: 78 persen. Tim sebelah membangun RAG dalam dua hari: chunk, embed, retrieve — 87 persen. Rapat evaluasi itu sunyi.",
        "Twist-nya: fine-tuning tidak menambah pengetahuan — ia mengubah perilaku dan format. Model fine-tune tetap tidak bisa mengutip pasal, tetap tidak tahu SOP yang berubah minggu lalu. Pengetahuan yang dinamis adalah pekerjaan retrieval; perilaku yang konsisten adalah pekerjaan fine-tuning. Tiga minggu itu kalah bukan karena timnya bodoh, melainkan karena mereka memakai palu untuk memotong kue.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memutuskan kapan RAG cukup dan kapan fine-tune diperlukan; (2) menjelaskan konsep LoRA dan menghitung parameter latihnya; (3) menilai kebutuhan data dan biaya fine-tuning; (4) mewaspadai catastrophic forgetting dan cara mengevaluasinya.",
        "🗺️ Isi lesson: Langkah 1 · Cerita tiga minggu — Langkah 2 · RAG vs fine-tune — Langkah 3 · Lab: matematika LoRA — Langkah 4 · Lab: skor keputusan — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Checkpoint.",
      ],
      tasks: [],
      reference: "RAG = pengetahuan dinamis + sitasi. Fine-tune = perilaku/format konsisten. Jangan tertukar.",
    },
    {
      id: "konsep-rag-vs-ft",
      eyebrow: "Langkah 2 · RAG vs fine-tune",
      title: "Dua alat, dua pekerjaan",
      prose: [
        "RAG mengambil pengetahuan dari luar saat inference: dokumen bisa diperbarui kapan saja, jawaban bisa disertai sitasi, tidak ada training. Kelemahannya: tiap request membayar token konteks, dan kualitas bergantung pada retrieval. Fine-tuning menanam perilaku ke dalam bobot: format konsisten, tidak perlu contoh panjang di prompt, inference murah. Kelemahannya: mahal di awal, pengetahuan membeku di tanggal training, dan berisiko catastrophic forgetting — kemampuan lama tergerus oleh data baru.",
        "LoRA (Low-Rank Adaptation) adalah jalan tengah yang populer: alih-alih melatih seluruh matriks bobot, latih dua matriks kecil (A dan B) yang hasil kalinya ditambahkan ke bobot asli. Dengan rank r=8 pada model 7B, parameter latih turun ke 0,39 persen — bisa jalan di satu GPU, bukan klaster.",
        "Kepribadian keduanya: RAG seperti pustakawan cekatan — selalu baca buku terbaru, tapi lambat dan cerewet. Fine-tuning seperti kursus kilat — mengubah kebiasaan bicara, tetapi tidak menambah isi kepala.",
        "Break-even RAG vs fine-tune — dihitung tuntas. Fine-tune: Rp20 juta sekali + Rp2 juta/bulan maintenance. RAG: Rp1,35 juta/hari retrieval + prompt panjang (dari minicase aie2). Selisih harian: Rp1,35 juta − Rp0,07 juta (amortisasi FT) = Rp1,28 juta/hari. Break-even: Rp20 juta / Rp1,28 juta = 16 hari! Setelah 16 hari, fine-tune menang TELAK. Tetapi: jika pengetahuan BERUBAH tiap hari (harga saham) → RAG selamanya (fine-tune tiap hari = Rp20 juta/hari!). Statis → fine-tune; dinamis → RAG. Sifat DATA menentukan, bukan preferensi.",
        "Catastrophic forgetting — angka risikonya. Fine-tune pada 1.000 contoh gaul: akurasi gaul 60→92 persen, TETAPI akurasi formal 95→81 persen (lupa 14 poin!). Solusi: campur 20 persen data lama (replay) → formal kembali 93 persen, gaul 90 persen. Biaya: 20 persen compute tambahan. Tanpa replay: model “pindah” bukan “bertambah”. Fine-tune = operasi plastik: perbaiki hidung, jangan rusak mata.",
        "Data flywheel — setelah fine-tune. Model v1 live → kumpulkan 1.000 koreksi/bulan dari CS → fine-tune v2 (Rp5 juta, bukan Rp20 juta — lanjutkan dari v1!) → akurasi +2 poin → ulang. Tiap iterasi: 1/4 biaya, +2 poin. Setelah 4 iterasi: 91→99 persen. Flywheel = keunggulan yang MENUMPUK; kompetitor tanpa flywheel stuck di v1. Fine-tune sekali = proyek; flywheel = strategi. Rancang loop-nya SEBELUM v1 launch.",
        "Evaluasi fine-tune — jangan hanya akurasi target. Ukur TIGA: (1) target naik? (gaul 68→92 ✓); (2) kemampuan lama turun? (formal 95→93, toleransi 2 poin); (3) generalisasi? (uji di 200 contoh BARU, bukan validasi lama). Yang hanya ukur (1): “berhasil” yang melupakan 14 poin formal. Tiga metrik = vonis jujur. Fine-tune tanpa (2) dan (3) = operasi tanpa cek pasca.",
      ],
      formula: String.raw`P_{\text{LoRA}} = r \times (d + k)`,
      formulaNote: "P_LoRA = parameter latih per matriks bobot; r = rank (mis. 8); d, k = dimensi matriks (mis. 4096 x 4096). Total = P_LoRA x jumlah matriks. Contoh lab: 8 x 8192 x 128 matriks = 8,4 juta — 0,39 persen dari 2,1 miliar.",
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Fine-tuning membuat model tahu data training-ku.' Salah — setidaknya untuk fakta. Model fine-tune menghafal gaya dan pola, bukan ensiklopedia; fakta baru yang andal tetap butuh retrieval. Kalau butuh 'tahu dokumen terbaru', jawabannya RAG, bukan fine-tune.",
      },
      reference: "Pengetahuan dinamis → RAG. Perilaku konsisten → fine-tune. LoRA = fine-tune murah (0,39 persen parameter).",
    },
    {
      id: "lab-lora",
      eyebrow: "Langkah 3 · Lab LoRA",
      title: "Lab: menghitung 0,39 persen",
      prose: [
        "Model imajiner: matriks attention 4096x4096, 32 layer, 4 matriks per layer (q, k, v, o). Hitung total parameter bila full fine-tune, lalu parameter LoRA dengan rank 8 — dan persentasenya. Angka inilah yang menjelaskan mengapa LoRA muat di satu GPU.",
        "Coba ubah: naikkan R menjadi 64, jalankan ulang, dan lihat persentase tetap di bawah 4 persen. Rank adalah kenop trade-off: makin besar makin ekspresif, makin mahal.",
      ],
      figure: {
        svg: FIG_LORA,
        alt: "Full fine-tune 2,1 miliar parameter vs LoRA 8,4 juta parameter, skala logaritmik.",
        caption: "Cara membaca: panjang batang dalam skala LOGARITMIK (bukan linear); label menunjukkan parameter latih absolut dan persentasenya. Interpretasi: LoRA melatih 250x lebih sedikit parameter (8,4 juta vs 2,1 miliar) — cukup untuk mengubah perilaku/format di banyak tugas, dengan biaya GPU yang jauh lebih kecil. Inilah alasan fine-tuning modern tidak lagi butuh klaster.",
      },
      tasks: [
        { id: "t1", text: "Hitung `full` (semua parameter) dan `lora` (parameter LoRA)" },
        { id: "t2", text: "Hitung `pct` = proporsi parameter LoRA" },
        { id: "t3", text: "Cetak ketiganya dengan `print`" },
      ],
      expected: "full=2.1B  lora=8.4M  pct=0.39%",
      note: {
        title: "💡 Intuisi",
        body: "LoRA bekerja karena perubahan perilaku hanya butuh 'arah' kecil di ruang bobot — seperti menyetel kemudi, bukan mengganti mesin. Rank 8 artinya: 8 arah penyesuaian per matriks ternyata cukup untuk sebagian besar tugas format dan gaya.",
      },
      hints: [
        "full = D*D*L*M (tiap matriks D x D, ada L*M matriks).",
        "lora = R*(D+D)*L*M (dua matriks kecil r x d dan r x k).",
        "pct = lora/full. Format: f\"full={full/1e9:.1f}B  lora={lora/1e6:.1f}M  pct={pct:.2%}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# Matriks bobot attention 4096x4096, 32 layer, tiap layer 4 matriks (q,k,v,o)\nD, L, M = 4096, 32, 4\nR = 8  # rank LoRA\n\n# TULIS KODEMU: parameter full vs LoRA\nfull = \nlora = \npct = \n\nprint(f"full={full/1e9:.1f}B  lora={lora/1e6:.1f}M  pct={pct:.2%}")`,
        lockLines: 6,
        solution: `# DATA SEED — jangan ubah\n# Matriks bobot attention 4096x4096, 32 layer, tiap layer 4 matriks (q,k,v,o)\nD, L, M = 4096, 32, 4\nR = 8  # rank LoRA\n\n# TULIS KODEMU: parameter full vs LoRA\nfull = D*D*L*M\nlora = R*(D+D)*L*M\npct = lora/full\n\nprint(f"full={full/1e9:.1f}B  lora={lora/1e6:.1f}M  pct={pct:.2%}")`,
        checks: [
          { kind: "equal", task: "t1", name: "full", value: 2147483648, tol: 1, label: "`full` seharusnya 2147483648", msg: "4096 x 4096 x 32 x 4 = 2.147.483.648." },
          { kind: "equal", task: "t1", name: "lora", value: 8388608, tol: 1, label: "`lora` seharusnya 8388608", msg: "8 x 8192 x 32 x 4 = 8.388.608." },
          { kind: "equal", task: "t2", name: "pct", value: 0.00390625, tol: 1e-6, label: "`pct` seharusnya 0.39%", msg: "8.388.608 / 2.147.483.648 = 0,00390625." },
          { kind: "stdout_matches", task: "t3", pattern: "full=2\\.1B\\s+lora=8\\.4M\\s+pct=0\\.39%", label: "`print` menampilkan ketiganya", msg: "Format: full=2.1B  lora=8.4M  pct=0.39%." },
        ],
      },
      reference: "LoRA: latih r x (d+k) per matriks. Rank = kenop trade-off ekspresivitas vs biaya.",
    },
    {
      id: "lab-skor",
      eyebrow: "Langkah 4 · Lab skor",
      title: "Lab: memutuskan dengan skor, bukan firasat",
      prose: [
        "Keputusan RAG vs fine-tune bisa dibuat eksplisit: beri skor 1–5 untuk tiap kriteria (biaya, kecepatan delivery, akurasi fakta, konsistensi gaya), kalikan dengan bobot, jumlahkan. Di sini bobot menekankan biaya dan akurasi fakta — profil khas proyek dokumen dinamis.",
        "Coba ubah: pindahkan bobot ke 'gaya' (0,4) dan lihat pemenangnya berbalik. Tidak ada jawaban universal — hanya jawaban yang sesuai prioritasmu. Engineer yang baik menulis bobotnya, bukan menyembunyikannya.",
        "Membaca skor keputusan — contoh. Skor RAG: biaya 9/10 (murah), akurasi 7/10, freshness 10/10. Skor FT: biaya 5/10, akurasi 9/10, freshness 3/10. Bobot bisnismu: freshness 50 persen (data berubah harian!) → RAG menang 8,5 vs 5,5. Ganti bobot (freshness 10 persen, akurasi 60 persen) → FT menang. Skor TANPA bobot = angka hampa; bobot = strategi bisnismu. Tulis bobotmu eksplisit — itulah keputusan yang sebenarnya.",
      ],
      tasks: [
        { id: "t1", text: "Hitung `s_rag` dan `s_ft` dengan fungsi `skor`" },
        { id: "t2", text: "Tentukan `menang` (\"RAG\" bila s_rag lebih besar)" },
        { id: "t3", text: "Cetak ketiganya" },
      ],
      expected: "RAG=4.30  FT=2.90  menang=RAG",
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Fine-tuning selalu lebih akurat dari RAG.' Salah. Untuk fakta dinamis, RAG menang karena membaca dokumen terbaru; fine-tune menjawab dari hafalan beku. Akurasi adalah fungsi kecocokan alat dan masalah, bukan kasta teknologi.",
      },
      hints: [
        "s_rag = skor(RAG); s_ft = skor(FT)",
        "menang = \"RAG\" if s_rag > s_ft else \"FT\"",
        "Format: f\"RAG={s_rag:.2f}  FT={s_ft:.2f}  menang={menang}\"",
      ],
      code: {
        starter: `# DATA SEED — jangan ubah\n# Skor 1-5 per kriteria\nBOBOT = {"biaya": 0.3, "kecepatan": 0.2, "akurasi_fakta": 0.3, "gaya": 0.2}\nRAG = {"biaya": 5, "kecepatan": 5, "akurasi_fakta": 4, "gaya": 3}\nFT  = {"biaya": 2, "kecepatan": 2, "akurasi_fakta": 3, "gaya": 5}\n\ndef skor(s):\n    return sum(s[k]*BOBOT[k] for k in BOBOT)\n\n# TULIS KODEMU: skor terbobot RAG vs fine-tune\ns_rag = \ns_ft = \nmenang = \n\nprint(f"RAG={s_rag:.2f}  FT={s_ft:.2f}  menang={menang}")`,
        lockLines: 10,
        solution: `# DATA SEED — jangan ubah\n# Skor 1-5 per kriteria\nBOBOT = {"biaya": 0.3, "kecepatan": 0.2, "akurasi_fakta": 0.3, "gaya": 0.2}\nRAG = {"biaya": 5, "kecepatan": 5, "akurasi_fakta": 4, "gaya": 3}\nFT  = {"biaya": 2, "kecepatan": 2, "akurasi_fakta": 3, "gaya": 5}\n\ndef skor(s):\n    return sum(s[k]*BOBOT[k] for k in BOBOT)\n\n# TULIS KODEMU: skor terbobot RAG vs fine-tune\ns_rag = skor(RAG)\ns_ft = skor(FT)\nmenang = "RAG" if s_rag > s_ft else "FT"\n\nprint(f"RAG={s_rag:.2f}  FT={s_ft:.2f}  menang={menang}")`,
        checks: [
          { kind: "equal", task: "t1", name: "s_rag", value: 4.3, tol: 1e-9, label: "`s_rag` seharusnya 4.30", msg: "5x0,3 + 5x0,2 + 4x0,3 + 3x0,2 = 4,30." },
          { kind: "equal", task: "t1", name: "s_ft", value: 2.9, tol: 1e-9, label: "`s_ft` seharusnya 2.90", msg: "2x0,3 + 2x0,2 + 3x0,3 + 5x0,2 = 2,90." },
          { kind: "stdout_matches", task: "t3", pattern: "RAG=4\\.30\\s+FT=2\\.90\\s+menang=RAG", label: "`print` menampilkan ketiganya", msg: "Format: RAG=4.30  FT=2.90  menang=RAG." },
        ],
      },
      reference: "Tulis kriteria, bobot, dan skormu. Keputusan eksplisit bisa diaudit; firasat tidak.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: kapan RAG cukup, kapan fine-tune",
      prose: [
        "Satu, pengetahuan berubah cepat atau jawaban butuh sitasi — RAG; dokumen diperbarui tanpa training ulang. Dua, butuh gaya atau format yang konsisten pada volume besar — fine-tune; bayar sekali di awal, hemat token selamanya. Tiga, model sama sekali tidak bisa melakukan tugasnya (bahasa sangat spesifik, struktur output aneh) — fine-tune, atau naik ke model yang lebih besar.",
        "Empat, data berlabel kurang dari 100 contoh — jangan fine-tune; few-shot atau RAG dulu. Fine-tune dengan data sedikit seperti mengajar dengan buku setengah halaman: model menghafal noise, bukan pola.",
        "Aturan praktis 10 detik: RAG dulu selalu — ia cepat, murah, dan bisa sitasi. Fine-tune hanya bila prompt sudah mentok DAN perilakunya harus konsisten di skala besar.",
        "Matematika LoRA rank — 0,39 persen dari mana. Model 7B: tiap matriks attention 4096×4096 = 16,8 juta parameter. LoRA rank 8: 2 × 4096 × 8 = 65.536 per matriks (0,39 persen!). Total ~32 matriks → 2,1 juta parameter trainable (0,03 persen dari 7B!). Rank 8 vs 64: 8x parameter, biasanya +1–2 poin. Aturan: mulai rank 8; naikkan jika underfit. 0,39 persen = fine-tune di laptop, bukan cluster.",
        "Ambang keputusan — tiga angka. (1) Data <1.000 contoh → JANGAN fine-tune (overfit pasti); RAG/prompt saja. (2) Perubahan pengetahuan >1x/minggu → RAG (fine-tune basi). (3) Butuh gaya/perilaku baru (bukan fakta) → fine-tune (RAG tidak mengubah perilaku!). Tiga ambang ini menjawab 90 persen “RAG atau FT?” dalam 1 menit. Sisanya = hitung break-even.",
      ],
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "Uji mentoknya prompt SEBELUM fine-tune: golden set 100+ kasus, few-shot terbaik, dan retrieval terbaik. Banyak tim menemukan 'batas model' ternyata batas prompt mereka — dan menghemat berminggu-minggu GPU.",
      },
      reference: "RAG dulu. Fine-tune bila: perilaku konsisten + volume besar + prompt mentok + data cukup.",
    },
    {
      id: "minicase-gaul",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: sentimen bahasa gaul dan break-even 2 bulan",
      prose: [
        "NusaBank ingin klasifikasi sentimen ulasan aplikasi dalam bahasa gaul Indonesia. Opsi FT: label 500 contoh x Rp10.000 = Rp5 juta; GPU 8 jam x $4 ≈ Rp512 ribu; 3 hari engineer ≈ Rp4,5 juta. Total ±Rp10 juta, akurasi 91 persen. Opsi RAG+few-shot: 0 training, akurasi 89 persen — selisih 2 poin.",
        "Twist: hitung opex-nya. Few-shot menambah 600 token per request: 1 juta request per bulan x 600/1e6 x $0,5 = $300 ≈ Rp4,8 juta per bulan, selamanya. Fine-tune (zero-shot, tanpa contoh): hemat Rp4,8 juta tiap bulan. Break-even: Rp10 juta / Rp4,8 juta ≈ 2 bulan. Setelah itu fine-tune lebih murah — DAN lebih konsisten.",
        "Keputusan: bila volume kecil, RAG+few-shot menang (tanpa capex). Bila volume jutaan per bulan dan format harus konsisten, fine-tune adalah investasi yang balik modal dalam 2 bulan. Sekali lagi: ini perhitungan ekonomi, bukan agama teknologi.",
        "Bahasa gaul — mengapa ini kasus fine-tune. “Woy min, saldo gw kok kepotong mulu dah” — RAG tidak membantu (bukan soal FAKTA, melainkan GAYA bahasa!). Fine-tune 2.000 contoh gaul → akurasi intent 68→92 persen. Break-even 2 bulan: biaya FT Rp20 juta vs biaya CS manual Rp15 juta/bulan untuk tiket gaul yang gagal. Setelah 2 bulan: hemat Rp15 juta/bulan selamanya. Perilaku (gaya) → fine-tune; fakta (saldo) → RAG. Klasifikasi ini = setengah keputusan.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Model fine-tune yang 'membeku' di tanggal training adalah risiko model (model risk): bila bahasa gaul bergeser, akurasinya turun diam-diam. Wajib ada monitoring berkala dan jadwal retraining — seperti validasi berkala model kredit.",
      },
      reference: "Fine-tune = capex di awal, hemat opex selamanya. Hitung break-even terhadap volume.",
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
        "RAG = pengetahuan dinamis + sitasi; fine-tune = perilaku/format konsisten. Jangan tertukar.",
        "LoRA melatih r x (d+k) parameter per matriks — 0,39 persen pada contoh lab, muat di satu GPU.",
        "RAG dulu selalu; fine-tune bila prompt mentok DAN volume besar DAN data cukup (>100 contoh).",
        "Waspadai catastrophic forgetting: eval kemampuan lama sebelum dan sesudah fine-tune.",
        "Keputusan RAG vs fine-tune adalah perhitungan ekonomi (capex vs opex, break-even) — tulis bobotnya.",
      ],
      next: { label: "AIE6 — Structured Output dan Function Calling", href: "/learn/aie6-structured" },
      quiz: [
        {
          q: "Kapan RAG lebih tepat daripada fine-tuning?",
          options: [
            { text: "Pengetahuan berubah cepat dan jawaban butuh sitasi", why: "Tepat: dokumen diperbarui tanpa training; sitasi datang gratis dari chunk.", correct: true },
            { text: "Butuh format output yang konsisten di 1 juta request per bulan", why: "Itu kasus fine-tune: bayar sekali, hemat token selamanya.", correct: false },
            { text: "Model sama sekali tidak memahami tugasnya", why: "Ini justru kandidat fine-tune (atau model lebih besar).", correct: false },
            { text: "Tidak ada dokumen sumber sama sekali", why: "Tanpa dokumen, RAG tidak punya apa-apa untuk diambil.", correct: false },
          ],
        },
        {
          q: "Apa itu LoRA?",
          options: [
            { text: "Melatih seluruh bobot model dari nol", why: "Itu full fine-tune / pretraining — mahal dan butuh klaster.", correct: false },
            { text: "Melatih dua matriks kecil rank-rendah yang ditambahkan ke bobot asli", why: "Tepat: 0,39 persen parameter pada contoh lab, muat di satu GPU.", correct: true },
            { text: "Teknik kompresi model setelah training", why: "Itu kuantisasi/pruning — tahap berbeda dari training.", correct: false },
            { text: "Cara membuat prompt lebih pendek", why: "LoRA tidak ada hubungannya dengan prompt.", correct: false },
          ],
        },
        {
          q: "Miskonsepsi umum tentang fine-tuning?",
          options: [
            { text: "Fine-tuning membutuhkan data berlabel", why: "Itu benar, bukan miskonsepsi.", correct: false },
            { text: "Fine-tuning menambah pengetahuan/fakta baru ke model secara andal", why: "Tepat: ini miskonsepsinya — fine-tune mengubah perilaku, bukan ensiklopedia. Fakta andal = RAG.", correct: true },
            { text: "Fine-tuning membutuhkan GPU", why: "Benar, terutama full fine-tune.", correct: false },
            { text: "Fine-tuning memakan waktu", why: "Benar — justru itu alasan menimbang RAG dulu.", correct: false },
          ],
        },
        {
          q: "Mengapa data kurang dari 100 contoh tidak disarankan untuk fine-tuning?",
          options: [
            { text: "Karena GPU menolak dataset kecil", why: "GPU tidak peduli ukuran dataset.", correct: false },
            { text: "Model menghafal noise, bukan pola — overfitting", why: "Tepat: sedikit contoh = model menghafal contohnya, gagal generalisasi.", correct: true },
            { text: "Karena LoRA tidak bisa dipakai di bawah 100 contoh", why: "LoRA bisa dipakai; masalahnya statistik, bukan teknis.", correct: false },
            { text: "Karena 100 adalah syarat lisensi", why: "Tidak ada syarat seperti itu.", correct: false },
          ],
        },
        {
          q: "Apa itu catastrophic forgetting dan mitigasinya?",
          options: [
            { text: "Model lupa kemampuan lama setelah fine-tune; mitigasi: eval kemampuan lama sebelum dan sesudah", why: "Tepat: ukur regresi di golden set lama, bukan hanya skor tugas baru.", correct: true },
            { text: "Model lupa prompt sistem; mitigasi: prompt lebih panjang", why: "Bukan itu definisinya.", correct: false },
            { text: "Data training hilang; mitigasi: backup", why: "Itu masalah operasional biasa, bukan forgetting.", correct: false },
            { text: "GPU kehabisan memori; mitigasi: LoRA", why: "Itu masalah memori, bukan forgetting.", correct: false },
          ],
        },
      ],
    },
  ],
};
