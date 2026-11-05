import type { V2Lesson } from "../lib/types";

const ADAPTER_SVG = `<svg viewBox="0 0 480 190" role="img" aria-label="Siklus adapter fine-tune: dataset, training, evaluasi sebagai gerbang, registry, produksi.">
<g font-family="var(--font-ui)" font-size="11">
<rect x="10" y="60" width="90" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="55" y="86" text-anchor="middle" fill="var(--text)" font-weight="600">Dataset</text>
<text x="55" y="104" text-anchor="middle" fill="var(--chart-text)">versi + hash</text>
<rect x="120" y="60" width="90" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="165" y="86" text-anchor="middle" fill="var(--text)" font-weight="600">Training</text>
<text x="165" y="104" text-anchor="middle" fill="var(--chart-text)">adapter</text>
<rect x="230" y="60" width="90" height="60" rx="8" fill="none" stroke="var(--c4)" stroke-width="2.5"/>
<text x="275" y="86" text-anchor="middle" fill="var(--text)" font-weight="700">Evaluasi</text>
<text x="275" y="104" text-anchor="middle" fill="var(--chart-text)">GERBANG</text>
<rect x="340" y="60" width="60" height="60" rx="8" fill="none" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="370" y="86" text-anchor="middle" fill="var(--text)" font-weight="600">Registry</text>
<rect x="415" y="60" width="55" height="60" rx="8" fill="none" stroke="var(--c1)" stroke-width="2"/>
<text x="442" y="86" text-anchor="middle" fill="var(--text)" font-weight="600">Prod</text>
<line x1="100" y1="90" x2="118" y2="90" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="210" y1="90" x2="228" y2="90" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="320" y1="90" x2="338" y2="90" stroke="var(--chart-grid)" stroke-width="1.5"/>
<line x1="400" y1="90" x2="413" y2="90" stroke="var(--chart-grid)" stroke-width="1.5"/>
<text x="275" y="150" text-anchor="middle" fill="var(--c4)" font-weight="600">gagal gerbang = tidak naik ke registry, tidak peduli sebagus apa training loss-nya</text>
<text x="275" y="168" text-anchor="middle" fill="var(--chart-text)">syarat: skor &#8805; 85% dan tidak ada kategori turun &gt; 5 poin</text>
</g></svg>`;

const LLMOPS8_DEEP_SVG = `<svg viewBox="0 0 480 220" role="img" aria-label="Biaya per eksperimen: full fine-tune Rp540 ribu vs LoRA Rp24 ribu."><g stroke="var(--chart-grid)" stroke-width="1"><line x1="46" y1="180" x2="464" y2="180"/><line x1="46" y1="140" x2="464" y2="140"/><line x1="46" y1="100" x2="464" y2="100"/><line x1="46" y1="60" x2="464" y2="60"/><line x1="46" y1="20" x2="464" y2="20"/></g><text x="40" y="184.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">0</text><text x="40" y="104.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">270</text><text x="40" y="24.0" text-anchor="end" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">540</text><rect x="85.7" y="20.0" width="129.6" height="160.0" rx="3" fill="var(--c4)"/><text x="150.5" y="14.0" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp540 rb</text><text x="150.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">Full FT</text><rect x="294.7" y="172.9" width="129.6" height="7.1" rx="3" fill="var(--c1)"/><text x="359.5" y="166.9" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)" font-family="var(--font-ui)">Rp24 rb</text><text x="359.5" y="198" text-anchor="middle" font-size="11" fill="var(--chart-text)" font-family="var(--font-ui)">LoRA r=16</text><text x="464" y="14" text-anchor="end" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)">ribu rupiah / eksperimen</text></svg>`;

export const llmops8: V2Lesson = {
  slug: "llmops8-finetune",
  track: "LLMOps",
  module: "Operasi Harian",
  title: "LLMOps8 — Operasional Fine-Tuning",
  estMinutes: 50,
  steps: [
    {
      id: "cerita",
      eyebrow: "Langkah 1 · Cerita",
      title: "Sembilan adapter, tidak satu pun yang dipercaya",
      prose: [
        "Tim AI ProteksiKu rajin: tiap dua minggu mereka fine-tune model dengan data chat terbaru. Sembilan adapter menumpuk di storage. Lalu datang pertanyaan sederhana dari CTO: `adapter mana yang sedang jalan di produksi?` Hening. Tidak ada yang tahu pasti — deploy terakhir dilakukan manual oleh engineer yang sedang cuti. Lebih buruk lagi: adapter terbaru memperbaiki 3 kasus keluhan, tapi golden set turun 11 kasus. Fine-tune yang `sukses` di training ternyata merusak perilaku di tempat lain.",
        "Twist-nya: tim mengira fine-tune adalah `upgrade`. Secara operasional, fine-tune adalah `operasi berisiko` — seperti transplantasi: menyembuhkan satu organ bisa mengganggu organ lain (catastrophic forgetting). Tanpa evaluasi gerbang dan registry, fine-tune rutin berubah menjadi akumulasi risiko yang tidak terlacak.",
        "Lesson ini tentang operasional fine-tuning: kapan ia dibutuhkan (dan kapan tidak), bagaimana mengelola adapter sebagai artefak, dan gerbang evaluasi yang memisahkan `training sukses` dari `layak produksi`.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) menjelaskan kapan fine-tuning tepat vs RAG vs prompt (dengan angka); (2) menghitung parameter trainable LoRA dan penghematan memorinya; (3) merancang pipeline evaluasi fine-tune (regresi + forgetting check); (4) mengoperasikan siklus retrain model fine-tune tanpa catastrophic forgetting.",
      ],
      tasks: [],
      note: {
        title: "Mitos: fine-tune = model menjadi lebih pintar secara umum",
        type: "pitfall",
        body: "Yang benar: fine-tune menggeser distribusi perilaku — memperbaiki pola yang ada di data training sambil berisiko merusak pola yang tidak ada di sana. Ia bukan `upgrade`, melainkan `trade-off` yang harus diukur per kategori di golden set.",
      },
      reference: "Fine-tune = operasi berisiko. Gerbang evaluasi memisahkan training sukses dari layak produksi.",
    },
    {
      id: "kapan-finetune",
      eyebrow: "Langkah 2 · Konsep",
      title: "Kapan fine-tune, kapan bukan",
      prose: [
        "Fine-tune tepat untuk: perilaku dan format yang konsisten (nada CS, struktur laporan, gaya penolakan), pemahaman domain spesifik (istilah asuransi, produk bank), dan mengurangi prompt raksasa (perilaku yang kini butuh 2.000 token instruksi bisa `dibakar` ke bobot). Fine-tune TIDAK tepat untuk: pengetahuan yang berubah (itu RAG — jangan bakar fakta basi ke bobot), satu-dua contoh perilaku (itu prompt/few-shot), dan memperbaiki satu kasus spesifik (risiko forgetting tidak sepadan).",
        "Aturan seleksi data: dataset fine-tune adalah artefak berversi seperti kode — dengan hash, sumber, dan tanggal. Data beracun (jawaban salah, bias, PII) yang masuk ke training akan menjadi perilaku permanen yang sulit dihapus. Kurasi > volume: 500 contoh berkualitas mengalahkan 50.000 contoh berisik.",
        "💡 Intuisi: tanya `apakah pengetahuan ini akan basi?` Ya → RAG. `Apakah ini soal cara menjawab?` Ya → pertimbangkan fine-tune. Fine-tune membakar pengetahuan ke bobot — pastikan ia pengetahuan yang tahan lama.",
      ],
      formula: String.raw`\text{layak} \iff (s \geq 85\%) \land (\Delta_{\min} \geq -5)`,
      formulaNote: "s = skor golden set keseluruhan adapter; Δ_min = perubahan kategori terburuk vs baseline (negatif = turun). Lolos hanya jika keduanya terpenuhi.",
      tasks: [],
      note: {
        title: "Mitos: makin sering fine-tune = makin bagus",
        type: "pitfall",
        body: "Yang benar: tiap fine-tune adalah peluang forgetting dan drift perilaku. Sembilan adapter dalam 4 bulan tanpa gerbang evaluasi = sembilan peluang merusak yang tidak terukur. Frekuensi fine-tune seharusnya ditentukan oleh bukti kebutuhan (regresi perilaku yang tidak bisa di-fix prompt), bukan oleh jadwal.",
      },
      reference: "Pengetahuan berubah → RAG. Cara menjawab → fine-tune. Dataset berversi + terkurasi.",
    },
    {
      id: "registry-adapter",
      eyebrow: "Langkah 3 · Konsep",
      title: "Registry adapter dan gerbang evaluasi",
      prose: [
        "Setiap adapter yang dihasilkan training WAJIB tercatat di registry: nama, base model, hash dataset, hyperparameter, skor golden set per kategori, dan status (`evaluated`, `staging`, `production`, `retired`). Tanpa registry, kamu punya file-file misterius di storage — persis masalah ProteksiKu.",
        "Gerbang evaluasi sebelum promosi: (1) skor keseluruhan ≥ 85%, (2) tidak ada kategori yang turun > 5 poin dari baseline (anti-forgetting), (3) lolos uji keamanan (red team mini), (4) diff perilaku di-review manusia untuk kasus yang berubah. Adapter `ft-b` di lab berikut punya skor tertinggi (91%) tapi gagal gerbang karena satu kategori anjlok 8 poin — dan itulah gunanya gerbang: menangkap trade-off yang tersembunyi di balik angka agregat.",
        "💡 Intuisi: training loss turun = `model menghafal data training`. Golden set naik = `perilaku membaik`. Hanya yang kedua yang relevan untuk produksi — jangan pernah mempromosikan adapter berdasarkan training loss.",
        "💡 Intuisi: simpan adapter yang gagal gerbang JANGAN dihapus — beri status `retired` dengan alasan. Enam bulan lagi, seseorang akan bertanya `kenapa ft-b tidak dipakai?` dan jawabannya harus ada di registry, bukan di ingatan.",
      ],
      tasks: [],
      note: {
        title: "Mitos: skor agregat tertinggi = adapter terbaik",
        type: "pitfall",
        body: "Yang benar: agregat 91% dengan satu kategori −8 poin bisa berarti `lebih pandai menjawab FAQ tapi lupa cara menolak dengan sopan` — regresi keamanan yang tertutup angka bagus. Gerbang harus memeriksa distribusi, bukan hanya rata-rata.",
      },
      reference: "Registry: nama, base, hash data, skor per kategori, status. Gerbang: agregat + anti-forgetting.",
    },
    {
      id: "lab-adapter",
      eyebrow: "Langkah 4 · Lab",
      title: "Seleksi adapter dengan gerbang evaluasi (mock)",
      prose: [
        "Lab ini mensimulasikan registry ProteksiKu: 4 adapter dengan skor golden set dan penurunan kategori terburuk (`delta_min`). Terapkan gerbang: skor ≥ 85% DAN delta_min ≥ −5. Tugasmu: tentukan adapter mana yang lolos ke produksi.",
        "Coba eksplorasi: adapter mana yang paling `menipu` — skor tertinggi tapi gagal gerbang? Apa yang terjadi jika syarat kedua dihapus?",
      ],
      tasks: [
        { id: "t1", text: "Hitung `lolos` = daftar adapter yang lolos gerbang" },
        { id: "t2", text: "Hitung `n_lolos` = jumlahnya" },
      ],
      expected: "lolos=['ft-a', 'ft-d']  n_lolos=2",
      note: {
        title: "Sering salah",
        type: "pitfall",
        body: "Hanya memeriksa skor agregat. `ft-b` (91%) terlihat terbaik tapi delta_min −8 melanggar syarat anti-forgetting. Gerbang evaluasi selalu dua syarat — agregat tanpa distribusi = jebakan.",
      },
      hints: [
        "Syarat: v['skor'] >= 85 dan v['delta_min'] >= -5.",
        "Gunakan list comprehension dengan dua kondisi.",
        "lolos = [k for k, v in adapters.items() if v['skor'] >= 85 and v['delta_min'] >= -5]",
      ],
      code: {
        starter: `adapters = {\n    "ft-a": {"skor": 88, "delta_min": -2},\n    "ft-b": {"skor": 91, "delta_min": -8},\n    "ft-c": {"skor": 83, "delta_min": -1},\n    "ft-d": {"skor": 86, "delta_min": -4},\n}\n\n# TULIS KODEMU: seleksi dengan gerbang (skor >= 85 dan delta_min >= -5)\nlolos = \nn_lolos = \n\nprint(f"lolos={lolos}  n_lolos={n_lolos}")`,
        lockLines: 8,
        solution: `adapters = {\n    "ft-a": {"skor": 88, "delta_min": -2},\n    "ft-b": {"skor": 91, "delta_min": -8},\n    "ft-c": {"skor": 83, "delta_min": -1},\n    "ft-d": {"skor": 86, "delta_min": -4},\n}\n\n# TULIS KODEMU: seleksi dengan gerbang (skor >= 85 dan delta_min >= -5)\nlolos = [k for k, v in adapters.items() if v["skor"] >= 85 and v["delta_min"] >= -5]\nn_lolos = len(lolos)\n\nprint(f"lolos={lolos}  n_lolos={n_lolos}")`,
        checks: [
          { kind: "equal", task: "t2", name: "n_lolos", value: 2, tol: 1e-9, label: "`n_lolos` seharusnya 2", msg: "Hanya ft-a dan ft-d memenuhi kedua syarat." },
          { kind: "stdout_matches", task: "t2", pattern: "lolos=\\['ft-a', 'ft-d'\\]\\s+n_lolos=2", label: "`print` menampilkan daftar dan jumlah", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Gerbang = agregat ≥ 85% DAN tidak ada kategori turun > 5 poin.",
    },
    {
      id: "peta",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Siklus hidup adapter yang sehat",
      prose: [
        "Lima skenario. Satu: butuh nada CS konsisten di semua jawaban → fine-tune dengan 500–2000 contoh berkualitas, lalu gerbang evaluasi. Dua: butuh pengetahuan produk baru tiap bulan → JANGAN fine-tune; pakai RAG. Tiga: adapter lolos gerbang → catat di registry, deploy via canary (LLMOps10), pantau golden set live 2 minggu.",
        "Empat: adapter gagal gerbang → status `retired` + alasan di registry; analisis kategori yang turun untuk data training berikutnya. Lima: tidak ada yang tahu adapter mana di produksi → bekukan deploy, audit, tetapkan pointer produksi eksplisit — ini incident operasional, bukan masalah model.",
        "Aturan praktis 10 detik: `tidak ada adapter yang naik produksi tanpa melewati gerbang evaluasi dan tercatat di registry`. Jika prosesmu memungkinkan itu terjadi, prosesnya yang rusak — bukan adapternya.",
      ],
      figure: {
        svg: ADAPTER_SVG,
        alt: "Siklus adapter fine-tune: dataset, training, evaluasi sebagai gerbang, registry, produksi.",
        caption: "Cara membaca: alir kiri ke kanan; kotak Evaluasi disorot sebagai gerbang. Interpretasi: training bisa sukses (loss turun) tapi adapter tetap tidak naik — gerbang evaluasi adalah satu-satunya jalan ke registry dan produksi. ProteksiKu gagal tepat di sini: adapter naik tanpa gerbang.",
      },
      tasks: [],
      note: {
        title: "Mitos: adapter kecil (LoRA) tidak butuh tata kelola",
        type: "pitfall",
        body: "Yang benar: ukuran file tidak menentukan dampak perilaku. Adapter 50MB bisa mengubah cara model menolak permintaan sensitif. Tata kelola mengikuti dampak, bukan ukuran file.",
      },
      reference: "Dataset berversi → training → gerbang → registry → canary → produksi.",
    },
    {
      id: "minicase",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Rp27 juta untuk 2 adapter yang berguna",
      prose: [
        "Sembilan adapter × Rp3.000.000 biaya compute training = Rp27.000.000. Dari sembilan, hanya 2 yang akhirnya lolos gerbang evaluasi (jika gerbang diterapkan) = Rp6.000.000 yang produktif, Rp21.000.000 terbuang untuk eksperimen tanpa saringan. Lebih mahal lagi: 7 adapter tanpa gerbang sempat menyentuh produksi/staging dan masing-masing butuh investigasi regresi.",
        "Pertanyaan analisis: (a) bagaimana mengubah `Rp21 juta terbuang` menjadi biaya eksperimen yang sehat? (b) rancang `definition of done` untuk satu siklus fine-tune dalam 5 baris. (c) kapan harus BERHENTI fine-tune dan menerima perilaku base model + prompt?",
        "Jawaban yang defensibel: (a) eksperimen murah di awal (subset data, evaluasi cepat) + gerbang bertahap: hanya kandidat menjanjikan yang dapat training penuh. Buang Rp500rb di skrining ≠ buang Rp3jt di training penuh. (b) contoh: `1) dataset berversi + hash; 2) training tercatat; 3) lolos gerbang (85%, Δ≥−5); 4) registry + canary; 5) golden set live 2 minggu stabil.` (c) saat 2 siklus berturut-turut tidak lolos gerbang — sinyal bahwa masalahnya bukan di bobot, melainkan di data/prompt/arsitektur.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Fine-tune tanpa gerbang adalah risiko model yang tidak tercatat di risk register — karena `kan cuma training`. Setiap adapter yang menyentuh produksi tanpa evaluasi adalah perubahan model tanpa validasi. Daftarkan pipeline fine-tune sebagai aktivitas risiko model.",
      },
      reference: "Rp27jt total, Rp6jt produktif. Skrining murah + gerbang bertahap.",
    },
    {
      id: "pendalaman",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Matematika LoRA: 0,1% parameter, 99% hasil",
      prose: [
        "Fine-tune penuh model 8B parameter: 8 miliar × 2 byte (fp16) = 16GB bobot + 32GB optimizer state (Adam) + 16GB gradien = 64GB — butuh 1x A100 80GB (Rp45rb/jam) dan 12 jam = Rp540 ribu per eksperimen. LoRA (rank r=16): parameter trainable = 2 × r × d per layer. Untuk d=4096: 2×16×4096 = 131 ribu per matriks; × 32 layer × 2 matriks (q,v) ≈ 8,4 juta parameter = 0,1% dari 8B. Memori: 16GB (bobot beku, int8 → 8GB) + < 1GB optimizer = < 10GB — muat di 1x T4 (Rp8rb/jam), 3 jam = Rp24 ribu. 22x lebih murah per eksperimen.",
        "Kenapa 0,1% parameter bisa bekerja? Karena fine-tuning untuk ADAPTASI (gaya bahasa bank, format tanggal) bukan untuk PENGETAHUAN BARU. Adaptasi = perubahan kecil di `cara bicara`, yang hidup di subspace berdimensi rendah. Rank 16 menangkap 16 arah perubahan terpenting — cukup untuk gaya dan format. Untuk pengetahuan baru (fakta 2026), LoRA rank 16 KURANG — butuh rank 64+ atau RAG. Aturan: adaptasi perilaku → LoRA kecil; injeksi pengetahuan → RAG atau full fine-tune.",
        "Contoh angka NusaBank: LoRA r=16 pada 5.000 contoh format tanggal bank. Sebelum: 61% format benar. Sesudah: 97% (naik 36pp). Biaya: Rp24rb × 8 eksperimen (tuning) = Rp192 ribu total. Bandingkan prompt engineering 2 minggu (Rp20 juta gaji) yang hanya mencapai 83% — karena prompt tidak bisa MENGUBAH kebiasaan model, hanya memohon. Untuk pola yang harus KONSISTEN (format!), fine-tune > prompt. Untuk pengetahuan yang berubah (polis!), RAG > fine-tune.",
        "Operasionalnya: versioning ADAPTER (bukan model penuh!) — adapter LoRA hanya 20MB (8,4jt × 2 byte), murah disimpan per versi di registry (MLOps4). Deploy = model dasar + adapter v3 (digabung saat load, +2 detik startup). Rollback = ganti adapter (20MB, < 1 menit) — JAUH lebih cepat dari rollback model 16GB. Evaluasi tiap adapter: regression golden set (LLMOps3) + forgetting check (test pengetahuan umum — pastikan adaptasi tidak merusak kemampuan dasar).",
      ],
      formula: String.raw`P_{LoRA} = 2 \cdot r \cdot d \cdot L \cdot m`,
      formulaNote: "P_LoRA = parameter trainable; r = rank (16 untuk adaptasi gaya); d = dimensi hidden (4096); L = jumlah layer (32); m = matriks per layer yang diadaptasi (2: q,v). Contoh: 2×16×4096×32×2 ≈ 8,4 juta = 0,1% dari 8B.",
      tasks: [],
      note: {
        title: "💡 Intuisi: LoRA = les privat, full fine-tune = sekolah ulang",
        body: "Les privat (LoRA) murah dan cukup untuk memperbaiki `cara bicara` (gaya, format). Sekolah ulang (full) mahal dan hanya perlu jika otaknya harus diisi pengetahuan baru. Kebanyakan kebutuhan operasional = les privat. Jangan bayar sekolah ulang untuk masalah aksen.",
      },
      reference: "Versioning adapter (20MB) di registry; rollback < 1 menit. Forgetting check tiap versi.",
    },
    {
      id: "pendalaman-angka",
      eyebrow: "Langkah 8 · Membaca Angka",
      title: "Full vs LoRA: perbandingan biaya nyata",
      prose: [
        "Perbandingan 1 eksperimen (model 8B): full fine-tune = Rp540rb (A100, 12 jam, 64GB) vs LoRA = Rp24rb (T4, 3 jam, <10GB). Untuk 8 eksperimen tuning: Rp4,3 juta vs Rp192 ribu. Selisih Rp4,1 juta = 21x. Dan ini BELUM termasuk biaya GAGAL: eksperimen full yang divergen di jam ke-11 membuang Rp495rb; yang LoRA membuang Rp22rb. Murah = berani eksperimen lebih banyak = hasil akhir lebih baik. Biaya rendah mengubah PERILAKU tim, bukan cuma tagihan.",
        "Kapan LoRA TIDAK cukup (jujur): (1) pengetahuan baru yang besar (10.000 fakta baru — pakai RAG); (2) perubahan perilaku ekstrem (model kasar → sangat sopan di semua konteks — butuh rank 64+ atau full); (3) bahasa baru yang tidak ada di pretraining. Untuk 3 kasus ini, LoRA r=16 akan `bocor` (sebagian berhasil, sebagian tidak). Ukur: jika setelah LoRA metrik target < 90% dan menaikkan rank ke 64 tidak membantu > 2pp — masalahnya bukan kapasitas adapter, melainkan strategi (ganti ke RAG/full).",
        "Jadwal operasional: adapter di-retrain tiap ada 500+ contoh baru TERKURASI (bukan tiap ada feedback mentah — kualitas > kuantitas). Tiap retrain: regression golden set + forgetting check + canary adapter (LLMOps10: 5% traffic, bandingkan format compliance). Siklus tipikal NusaBank: 3–4 minggu. Adapter lama diarsipkan (20MB murah) — rollback 1 menit jika adapter baru bermasalah.",
      ],
      figure: {
        svg: LLMOPS8_DEEP_SVG,
        alt: "Diagram batang biaya per eksperimen: full fine-tune Rp540 ribu vs LoRA Rp24 ribu (22x lebih murah).",
        caption: "Cara membaca: tinggi batang = biaya SATU eksperimen fine-tune model 8B (ribu rupiah). Interpretasi: LoRA 22x lebih murah (Rp24rb vs Rp540rb) karena hanya 0,1% parameter yang dilatih dan muat di GPU kecil. Murah = tim berani 8x eksperimen = hasil akhir lebih baik. Tapi untuk pengetahuan baru yang besar, LoRA bukan jawabannya — pakai RAG.",
      },
      tasks: [],
      note: {
        title: "💡 Intuisi: biaya rendah mengubah perilaku, bukan cuma tagihan",
        body: "Eksperimen Rp540rb membuat tim takut mencoba (3x coba lalu `cukup`); Rp24rb membuat tim berani (8x coba + variasi). Kualitas akhir model ditentukan JUMLAH eksperimen yang berani dilakukan — dan itu ditentukan biaya per eksperimen. LoRA bukan cuma hemat; ia membuat tim lebih berani.",
      },
      reference: "Retrain tiap 500+ contoh terkurasi. Jika rank 64 tidak membantu > 2pp → ganti strategi.",
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
        "Fine-tune untuk cara menjawab (perilaku/format); RAG untuk pengetahuan yang berubah.",
        "Dataset berversi + terkurasi; kualitas > volume; data beracun = perilaku permanen.",
        "Gerbang: skor ≥ 85% DAN tidak ada kategori turun > 5 poin; training loss bukan kriteria.",
        "Registry: nama, base, hash data, skor per kategori, status (termasuk retired + alasan).",
        "Berhenti fine-tune saat 2 siklus gagal gerbang — masalahnya di tempat lain.",
      ],
      next: { label: "LLMOps9 — Safety Ops", href: "/learn/llmops9-safety" },
      quiz: [
        {
          q: "Pengetahuan produk berubah tiap bulan. Pendekatan yang benar?",
          options: [
            { text: "Fine-tune tiap bulan mengikuti perubahan", why: "Membakar fakta yang akan basi ke bobot = RAG basi versi mahal + risiko forgetting tiap bulan." },
            { text: "RAG dengan pipeline freshness", why: "Pengetahuan dinamis = update dokumen, bukan retrain. Jauh lebih murah dan aman.", correct: true },
            { text: "Prompt raksasa berisi semua produk", why: "Tidak scalable dan mahal per request; RAG lebih tepat." },
            { text: "Biarkan model mengarang, user akan koreksi", why: "Mengarang = halusinasi; bukan strategi operasional." },
          ],
        },
        {
          q: "Adapter ft-b: skor 91%, satu kategori turun 8 poin. Keputusan gerbang?",
          options: [
            { text: "Lolos — 91% tertinggi", why: "Agregat menyembunyikan regresi kategori; −8 poin bisa berarti lupa cara menolak dengan aman." },
            { text: "Gagal — melanggar syarat anti-forgetting (Δ ≥ −5)", why: "Gerbang dua syarat; distribusi sama pentingnya dengan agregat.", correct: true },
            { text: "Lolos dengan catatan", why: "`Catatan` tanpa mekanisme = lolos. Kategori yang turun tetap turun di produksi." },
            { text: "Training ulang dengan data lebih banyak", why: "Prematur — analisis dulu kategori apa yang turun dan mengapa sebelum mengulang." },
          ],
        },
        {
          q: "Training loss turun tajam tapi golden set stagnan. Artinya?",
          options: [
            { text: "Adapter siap produksi", why: "Loss mengukur hafalan data training, bukan perilaku. Golden set yang menentukan." },
            { text: "Model overfit ke data training; belum terbukti membaik secara perilaku", why: "Inilah tepatnya mengapa gerbang memakai golden set, bukan training loss.", correct: true },
            { text: "Data training terlalu sedikit", why: "Mungkin, tapi kesimpulan operasionalnya tetap: belum lolos gerbang." },
            { text: "Learning rate terlalu kecil", why: "Spekulasi hyperparameter tanpa bukti perilaku." },
          ],
        },
        {
          q: "CTO bertanya `adapter mana yang live?` dan tidak ada yang tahu. Respons operasional?",
          options: [
            { text: "Tebak dari tanggal file terbaru", why: "Menebak versi produksi = mengulangi masalah yang sama." },
            { text: "Bekukan deploy, audit, tetapkan pointer produksi eksplisit di registry", why: "Ini incident tata kelola. Perbaiki sistemnya, bukan tebakannya.", correct: true },
            { text: "Deploy ulang semuanya dari awal", why: "Berisiko dan tidak menjawab pertanyaan `mana yang live`." },
            { text: "Tidak masalah selama tidak ada komplain", why: "`Tidak ada komplain` ≠ `tidak ada masalah` — regresi diam-diam tetap berjalan." },
          ],
        },
        {
          q: "9 adapter × Rp3jt = Rp27jt, hanya 2 lolos gerbang. Biaya eksperimen yang sehat seharusnya?",
          options: [
            { text: "Tetap Rp27jt — eksperimen memang mahal", why: "Mahal tanpa saringan = pemborosan, bukan eksperimen." },
            { text: "Skrining murah bertahap: hanya kandidat menjanjikan yang dapat training penuh", why: "Gerbang bertahap memangkas biaya gagal dari Rp3jt menjadi ratusan ribu per kandidat.", correct: true },
            { text: "Berhenti fine-tune selamanya", why: "Berlebihan — 2 adapter lolos membuktikan ada nilai; yang diperbaiki prosesnya." },
            { text: "Naikkan budget training 2x lipat", why: "Menambah uang ke proses tanpa saringan = memperbesar pemborosan." },
          ],
        },
        {
          q: "Butuh model konsisten format tanggal bank (61% → target 97%). Prompt engineering 2 minggu hanya mencapai 83%. Langkah TEPAT?",
          options: [
            { text: "Teruskan prompt engineering — gratis, tinggal lebih kreatif", why: "2 minggu = Rp20 juta gaji untuk 83%. Prompt memohon, bukan mengubah kebiasaan. Untuk konsistensi FORMAT, ada batas inheren prompt." },
            { text: "LoRA r=16 pada 5.000 contoh format (Rp192rb total eksperimen)", why: "Tepat. Adaptasi perilaku (format/gaya) = kasus ideal LoRA: 97% tercapai, 100x lebih murah dari gaji 2 minggu prompt engineering. Versioning adapter 20MB, rollback 1 menit.", correct: true },
            { text: "Full fine-tune 8B agar maksimal", why: "Full fine-tune 21x lebih mahal (Rp4,3jt) untuk masalah yang LoRA selesaikan. Bayar sekolah ulang untuk masalah aksen = pemborosan." },
            { text: "Beli data 1 juta contoh lalu full fine-tune", why: "Overkill ganda: 1 juta contoh untuk format tanggal tidak perlu, dan full fine-tune tidak perlu. 5.000 contoh terkurasi + LoRA cukup." },
          ],
        },
      ],
    },
  ],
};
