import type { V2Lesson } from "../lib/types";

// Transfer learning: lapisan bawah beku (fitur umum), head dilatih (tugas baru).
const FREEZE_SVG = `<svg viewBox="0 0 560 260" role="img" aria-label="Tumpukan lapisan: bawah beku, head atas dilatih.">
<g font-family="var(--font-ui)" font-size="12" text-anchor="middle">
<rect x="200" y="20" width="160" height="40" rx="8" fill="var(--chart-grid)" opacity="0.5"/>
<text x="280" y="45" fill="var(--text-muted)">lapisan 1: tepi &amp; tekstur ❄ beku</text>
<rect x="200" y="68" width="160" height="40" rx="8" fill="var(--chart-grid)" opacity="0.4"/>
<text x="280" y="93" fill="var(--text-muted)">lapisan 2: pola &amp; bagian ❄ beku</text>
<rect x="200" y="116" width="160" height="40" rx="8" fill="var(--chart-grid)" opacity="0.3"/>
<text x="280" y="141" fill="var(--text-muted)">lapisan 3: objek ❄ beku</text>
<rect x="200" y="164" width="160" height="48" rx="8" fill="var(--c1)" opacity="0.9"/>
<text x="280" y="184" fill="#fff" font-weight="600">head baru: 5 kelas batik</text>
<text x="280" y="202" fill="#fff" font-size="11">✎ dilatih (650 parameter)</text>
</g>
<g font-family="var(--font-ui)" font-size="11" fill="var(--text-muted)" text-anchor="middle">
<text x="280" y="238">beku = bobot pretrained dikunci; hanya head yang belajar dari 500 gambarmu</text>
</g>
</svg>`;

export const dle7: V2Lesson = {
  slug: "dle7-transfer",
  track: "Deep Learning Engineer",
  module: "Arsitektur Modern",
  title: "DLE7 — Transfer Learning & Pretraining",
  estMinutes: 45,
  steps: [
    {
      id: "cerita-batik",
      eyebrow: "Langkah 1 · Cerita pembuka",
      title: "500 foto batik vs 14 juta foto ImageNet",
      prose: [
        "UMKM batik meminta klasifikasi motif: 500 foto, 5 kelas (parang, kawung, mega mendung, truntum, sidomukti). Engineer pertama melatih CNN dari nol: akurasi 41% — hanya sedikit di atas tebakan acak 20%. Kesimpulan cepat: datanya kurang, proyek mustahil.",
        "Engineer kedua mengambil ResNet yang sudah dilatih di ImageNet (14 juta foto), membekukan semua lapisan, mengganti head terakhir dengan 5 kelas batik, melatih 15 menit di laptop: akurasi 93%. Data yang sama, 500 foto yang sama — hasil berbeda 52 poin.",
        "Twist-nya: 500 foto memang tidak cukup untuk belajar melihat dari nol — tetapi cukup untuk belajar memakai mata yang sudah jadi. Lapisan awal ResNet sudah tahu tepi, tekstur, dan pola; yang perlu dipelajari hanya memetakan pola-pola itu ke motif batik. Lesson ini: kapan meminjam mata orang lain, dan kapan harus membangun sendiri.",
        "Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) memilih antara feature extraction dan fine-tuning dengan alasan; (2) menjelaskan mengapa pretraining bekerja (dengan analogi yang benar); (3) menghitung rasio data/parameter dan implikasinya; (4) mendeteksi dan menangani negative transfer.",
      ],
      tasks: [],
      note: {
        title: "Kaitan ke risk",
        type: "risk",
        body: "Pretrained model membawa bias dataset asalnya (ImageNet = foto Barat). Untuk domain kritis (medis, wajah), audit bias pretrained sebelum fine-tune — meminjam mata orang berarti meminjam kebutaannya juga.",
      },
      reference: "Data kecil + pretrained = layak. Data kecil + dari nol = mustahil. Itu perbedaannya.",
    },
    {
      id: "dua-strategi",
      eyebrow: "Langkah 2 · Dua strategi",
      title: "Feature extraction vs fine-tuning: sewa vs beli",
      prose: [
        "Feature extraction (linear probing): bekukan seluruh backbone pretrained, latih hanya head klasifikasi baru. Analogi: menyewa mata ahli, kamu hanya melatih penerjemahnya. Murah (650 parameter di lab vs 109.386 penuh — 168× lebih hemat), cepat, stabil. Cocok bila datamu kecil (< 5 ribu) dan mirip domain pretrained.",
        "Fine-tuning: latih juga sebagian/seluruh backbone dengan learning rate kecil (10× lebih kecil dari normal). Analogi: membeli matanya lalu melatih ulang perlahan agar cocok dengan duniamu. Lebih kuat bila data cukup (> 10 ribu) atau domain berbeda jauh (foto medis vs ImageNet) — tetapi berisiko catastrophic forgetting: pengetahuan lama terhapus bila lr terlalu besar.",
        "Protokol aman: (1) mulai feature extraction sebagai baseline; (2) bila underfit dan data cukup, unfreeze bertahap dari atas ke bawah dengan lr kecil; (3) monitor performa pada data yang mirip domain asal — bila anjlok, kamu menghapus pengetahuan berharga.",
        "💡 Intuisi: lapisan bawah = tata bahasa visual (tepi, tekstur) yang universal; lapisan atas = kosakata spesifik (hidung anjing, motif kawung). Makin jauh domainmu dari domain pretrained, makin dalam kamu perlu unfreeze. Batik vs ImageNet: unfreeze 1–2 blok atas cukup.",
        "💡 Intuisi: learning rate fine-tune harus kecil karena bobot pretrained sudah di lembah yang bagus — langkah besar melompat keluar lembah dan menghancurkan semuanya. Aturan: 10× lebih kecil dari lr training normal.",
        "Cara membaca: tiga balok abu-abu = lapisan pretrained yang dibekukan; balok biru paling bawah = head baru 5 kelas batik yang dilatih (650 parameter).",
        "Interpretasi: hampir seluruh network tidak bergerak — hanya head yang belajar. Inilah mengapa 500 foto cukup: yang dipelajari hanya penerjemah 650 parameter, bukan 23 juta parameter penglihatan.",
        "Strategi unfreeze BERTAHAP — yang paling aman. Tahap 1: bekukan SEMUA, latih head saja (5 epoch) — dapat baseline. Tahap 2: unfreeze 25 persen lapisan ATAS, LR kecil (1/10 normal), 5 epoch. Tahap 3: unfreeze 50 persen, dst. Setiap tahap = checkpoint + evaluasi. Jika akurasi TURUN di suatu tahap: berhenti, kembali ke tahap sebelumnya. Bertahap = tidak pernah kehilangan lebih dari 1 tahap kerja. Langsung unfreeze semua = judi dengan 14 juta parameter.",
        "Mengukur kemiripan domain — heuristik praktis. (1) Visual: apakah citra sumber dan target “terlihat” sekeluarga? (ImageNet→batik: ya; ImageNet→rontgen: samar-samar.) (2) Uji cepat: feature extraction baseline vs dari nol — jika baseline MENANG TELAK (>10 poin), domain cukup mirip. (3) CKA/korelasi fitur (lanjutan). Heuristik 80/20: uji 1 jam (baseline) menjawab “apakah transfer worth it?” lebih baik dari 1 hari teori.",
        "Learning rate diskriminatif — satu LR untuk semua = kasar. Lapisan BAWAH (fitur umum: tepi, tekstur): LR sangat kecil (1/100 normal) — jangan rusak fondasi. Lapisan ATAS (fitur spesifik): LR kecil (1/10). HEAD (baru): LR normal. Implementasi: parameter groups di optimizer. Hasil tipikal: +1–2 poin vs LR seragam, dan JAUH lebih stabil (tidak ada catastrophic forgetting). Tiga LR = tiga kecepatan belajar untuk tiga usia pengetahuan.",
      ],
      formula: String.raw`\theta_{\text{frozen}} = \text{tetap}, \qquad \theta_{\text{head}} \leftarrow \theta_{\text{head}} - \eta_{\text{kecil}}\,\nabla L`,
      formulaNote: "θ_frozen = bobot backbone pretrained yang dikunci (tidak diupdate); θ_head = bobot head baru; η_kecil = learning rate kecil (≈ 10× lebih kecil dari normal). Hanya head yang bergerak.",
      figure: {
        svg: FREEZE_SVG,
        alt: "Lapisan bawah beku, hanya head klasifikasi baru yang dilatih.",
        caption: "Feature extraction: pinjam mata yang sudah jadi, latih hanya penerjemahnya.",
      },
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `penuh` = parameter bila fine-tune semua (MLP [784,128,64,10])" },
        { id: "t2", text: "Hitung `head` = parameter bila hanya latih lapisan terakhir" },
        { id: "t3", text: "Hitung `hemat` = rasio penuh/head (1 desimal)" },
      ],
      expected: "penuh=109386  head=650  hemat=168.3x",
      note: {
        title: "🚨 Mitos: fine-tuning selalu mengalahkan feature extraction",
        type: "pitfall",
        body: "Yang benar: pada data kecil (< 5 ribu), fine-tuning penuh sering overfit dan kalah dari feature extraction yang stabil. Fine-tuning menang bila data cukup atau domain jauh berbeda. Selalu jadikan feature extraction sebagai baseline — ia murah dan sulit dikalahkan pada data kecil.",
      },
      hints: [
        "penuh = jumlah (masuk+1)*keluar semua lapisan.",
        "head = (64+1)*10, hanya lapisan terakhir.",
        "hemat = round(penuh/head, 1)",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(7)\n\nlapisan = [784, 128, 64, 10]\n\n# TULIS KODEMU: bandingkan parameter yang dilatih\npenuh = \nhead = \nhemat = \n\nprint(f"penuh={penuh}  head={head}  hemat={hemat}x")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(7)\n\nlapisan = [784, 128, 64, 10]\n\n# TULIS KODEMU: bandingkan parameter yang dilatih\npenuh = sum((lapisan[i]+1)*lapisan[i+1] for i in range(len(lapisan)-1))\nhead = (lapisan[-2]+1)*lapisan[-1]\nhemat = round(penuh/head, 1)\n\nprint(f"penuh={penuh}  head={head}  hemat={hemat}x")`,
        checks: [
          { kind: "equal", task: "t1", name: "penuh", value: 109386, tol: 1e-9, label: "`penuh` seharusnya 109386", msg: "Sama seperti DLE1: (784+1)x128 + (128+1)x64 + (64+1)x10." },
          { kind: "equal", task: "t2", name: "head", value: 650, tol: 1e-9, label: "`head` seharusnya 650", msg: "(64+1)x10 = 650. Hanya lapisan terakhir." },
          { kind: "equal", task: "t3", name: "hemat", value: 168.3, tol: 0.1, label: "`hemat` seharusnya 168.3", msg: "109386/650 = 168.3x lebih hemat." },
          { kind: "stdout_matches", task: "t3", pattern: "penuh=109386\\s+head=650\\s+hemat=168\\.3x", label: "`print` menampilkan ketiganya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "Feature extraction = latih head saja. Fine-tune = unfreeze bertahap, lr 10x lebih kecil.",
    },
    {
      id: "pretraining",
      eyebrow: "Langkah 3 · Pretraining",
      title: "Mengapa pretraining bekerja: sekolah sebelum kerja",
      prose: [
        "Pretraining melatih model pada tugas umum dengan data raksasa tanpa label mahal: prediksi kata berikutnya (GPT), tebak kata yang disensor (BERT), bedakan gambar asli vs versi crop-nya (SimCLR). Tugas-tugas ini memaksa model memahami struktur dunia — tata bahasa, tekstur, komposisi — yang kemudian berguna untuk hampir semua tugas spesifik.",
        "Syarat transfer berhasil: kemiripan domain. ImageNet → foto batik: berhasil (sama-sama foto objek). ImageNet → citra rontgen: sebagian berhasil (lapisan bawah berguna, atas harus dilatih ulang dalam). BERT Inggris → bahasa Indonesia: terbantu, tetapi model multilingual/Indonesia jauh lebih baik. Makin jauh domain, makin dalam unfreeze yang dibutuhkan.",
        "Kegagalan klasik: negative transfer — pretrained justru menurunkan performa karena domain terlalu berbeda atau head terlalu besar untuk data kecil. Obatnya: baseline feature extraction dulu; bila kalah dari training sederhana, curigai negative transfer dan kecilkan head atau tambah data.",
        "💡 Intuisi: pretraining = memindahkan biaya data ke masa lalu. Seseorang (sering komunitas open-source) sudah membayar jutaan dolar komputasi; kamu memanennya gratis. Sebagai engineer, keterampilan terpenting bukan melatih dari nol — melainkan memilih pretrained yang tepat dan mengadaptasinya dengan benar.",
      ],
      note: {
        title: "💡 Intuisi: pinjam, jangan bangun",
        body: "500 foto vs 14 juta foto ImageNet = 1:28.000. Melatih dari nol = membangun universitas untuk 500 murid; transfer learning = menyekolahkan 500 murid di universitas yang SUDAH ADA. Aturan: data <10 ribu = JANGAN dari nol (kecuali domain sangat unik); data >100 ribu = pertimbangkan. “Dari nol” = pilihan termahal, bukan yang paling keren.",
      },
      tasks: [],
      reference: "Pretraining memindahkan biaya data ke masa lalu. Pilih yang domainnya mirip.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 4 · Peta keputusan",
      title: "Peta keputusan: pinjam, beli, atau bangun?",
      prose: [
        "Skenario 1 — Data kecil (< 5 ribu), domain mirip pretrained (foto produk vs ImageNet). → Feature extraction. Alasan: 168× lebih hemat, stabil, sulit dikalahkan.",
        "Skenario 2 — Data sedang (5–50 ribu) atau domain agak jauh (citra medis). → Fine-tune bertahap: head dulu, unfreeze 1–2 blok atas, lr 10× kecil. Alasan: adaptasi tanpa menghapus pengetahuan dasar.",
        "Skenario 3 — Data besar (> 100 ribu) atau domain unik tanpa pretrained (bahasa daerah). → Training dari nol layak dipertimbangkan. Alasan: cukup sinyal untuk belajar representasi sendiri; pretrained yang jauh justru jadi beban.",
        "Skenario 4 — Tidak ada label sama sekali. → Self-supervised pretraining sendiri (bila data mentah > 1 juta) atau cari pretrained terdekat. Alasan: label mahal, data mentah murah — pretraining menukar keduanya.",
        "Skenario 5 — Hasil fine-tune lebih buruk dari baseline sederhana. → Curigai negative transfer: kecilkan head, bekukan lebih banyak, atau ganti pretrained. Alasan: bukan semua transfer membantu.",
        "Aturan praktis 10 detik: (1) cari pretrained yang domainnya mirip; (2) baseline = feature extraction; (3) unfreeze bertahap + lr kecil; (4) audit bias bawaan pretrained untuk domain kritis.",
      ],
      note: {
        title: "💡 Intuisi: waspadai transfer negatif",
        body: "Jika akurasi TURUN setelah fine-tuning (negative transfer), domain sumber terlalu beda (ImageNet → citra satelit hiperspektral?). Solusi bertingkat: (1) kembali ke feature extraction (bekukan semua); (2) unfreeze bertahap dari atas; (3) cari pretrained yang domainnya lebih dekat. Jangan memaksa: pengetahuan yang salah = lebih buruk dari tidak tahu.",
      },
      tasks: [],
      reference: "Baseline feature extraction dulu. Unfreeze bertahap, lr 10x kecil.",
    },
    {
      id: "minicase-umkm",
      eyebrow: "Langkah 5 · Mini-case",
      title: "500 foto, 5 motif: rancang strateginya",
      prose: [
        "Kembali ke UMKM batik: 500 foto, 5 kelas seimbang. Sebelum menyentuh kode, hitung dua angka dasar: foto per kelas = 100, dan baseline tebakan acak = 20%. Dua angka ini adalah pembanding jujur: model dari nol yang 41% hanya 21 poin di atas acak — memalukan; fine-tune 93% berarti 73 poin di atas acak — layak produksi.",
        "Strategi yang diusulkan: (1) feature extraction ResNet-50 + head 5 kelas sebagai baseline (15 menit); (2) bila akurasi < 85%, unfreeze blok atas dengan lr 1e-4; (3) augmentasi: rotasi ±15°, flip horizontal, crop acak — melipatgandakan 500 foto menjadi ~2.500 efektif; (4) evaluasi per kelas: motif truntum vs kawung yang mirip butuh perhatian khusus.",
        "Pembahasan: 100 foto per kelas cukup untuk head 650 parameter (6,5× lipat data vs parameter head — sehat), tetapi tidak cukup untuk 23 juta parameter ResNet penuh. Inilah alasan kuantitatif memilih feature extraction — bukan tebakan, melainkan aritmetika.",
      ],
      requires: ["numpy"],
      tasks: [
        { id: "t1", text: "Hitung `per_kelas` = foto per kelas" },
        { id: "t2", text: "Hitung `baseline` = akurasi tebakan acak (2 desimal)" },
      ],
      expected: "per_kelas=100  baseline=0.2",
      note: {
        title: "🚨 Mitos: makin banyak unfreeze makin bagus",
        type: "pitfall",
        body: "Yang benar: tiap lapisan yang di-unfreeze menambah jutaan parameter yang harus dipelajari dari datamu yang kecil. Unfreeze semua pada 500 foto = 23 juta parameter vs 500 sampel = hafalan instan. Unfreeze adalah keran: buka sedikit demi sedikit, tutup saat validasi berhenti membaik.",
      },
      hints: [
        "per_kelas = total foto // jumlah kelas.",
        "baseline = 1 / jumlah kelas.",
        "per_kelas = n // kelas",
      ],
      code: {
        starter: `import numpy as np\nnp.random.seed(7)\n\nn, kelas = 500, 5\n\n# TULIS KODEMU\nper_kelas = \nbaseline = \n\nprint(f"per_kelas={per_kelas}  baseline={baseline}")`,
        lockLines: 4,
        solution: `import numpy as np\nnp.random.seed(7)\n\nn, kelas = 500, 5\n\n# TULIS KODEMU\nper_kelas = n // kelas\nbaseline = round(1/kelas, 2)\n\nprint(f"per_kelas={per_kelas}  baseline={baseline}")`,
        checks: [
          { kind: "equal", task: "t1", name: "per_kelas", value: 100, tol: 1e-9, label: "`per_kelas` seharusnya 100", msg: "500 // 5 = 100." },
          { kind: "equal", task: "t2", name: "baseline", value: 0.2, tol: 1e-9, label: "`baseline` seharusnya 0.2", msg: "1/5 = 0.2." },
          { kind: "stdout_matches", task: "t2", pattern: "per_kelas=100\\s+baseline=0\\.2", label: "`print` menampilkan keduanya", msg: "Samakan formatnya dengan Hasil yang diharapkan." },
        ],
      },
      reference: "per_kelas = n/kelas. baseline = 1/kelas. Bandingkan model dengan baseline, bukan dengan nol.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Lima pertanyaan tentang transfer learning dan pretraining.",
      ],
      tasks: [],
      summary: [
        "Feature extraction: bekukan backbone, latih head saja — 168× hemat, baseline wajib untuk data kecil.",
        "Fine-tuning: unfreeze bertahap dari atas, lr 10× lebih kecil — adaptasi tanpa catastrophic forgetting.",
        "Lapisan bawah = tata bahasa universal; lapisan atas = kosakata spesifik domain.",
        "Transfer berhasil bila domain mirip; waspadai negative transfer dan bias bawaan pretrained.",
        "Pretraining memindahkan biaya data ke masa lalu — pilih yang tepat lebih penting dari melatih dari nol.",
      ],
      next: { label: "DLE8 — GPU & Mixed Precision", href: "/v2/learn/dle8-gpu" },
      quiz: [
        {
          q: "500 foto, 5 kelas, ada ResNet pretrained. Langkah pertama terbaik?",
          options: [
            { text: "CNN dari nol", why: "500 foto untuk jutaan parameter = hafalan; 41% membuktikannya." },
            { text: "Feature extraction: bekukan ResNet, latih head 5 kelas", why: "Murah, cepat, stabil — baseline yang sulit dikalahkan pada data kecil.", correct: true },
            { text: "Fine-tune semua lapisan dengan lr besar", why: "lr besar menghapus pengetahuan pretrained (catastrophic forgetting)." },
            { text: "Kumpulkan 14 juta foto dulu", why: "Tidak realistis; justru gunanya transfer learning adalah menghindari ini." },
          ],
        },
        {
          q: "Mengapa lr fine-tuning harus ~10× lebih kecil dari lr normal?",
          options: [
            { text: "Agar training lebih cepat", why: "lr kecil justru lebih lambat; tujuannya bukan kecepatan." },
            { text: "Bobot pretrained sudah di lembah bagus; langkah besar merusaknya", why: "Catastrophic forgetting: lompat keluar dari lembah pengetahuan yang sudah dipelajari.", correct: true },
            { text: "GPU tidak kuat", why: "Tidak terkait hardware (GPU/CPU tidak mengubah strategi transfer) — ini keputusan ARSITEKTUR dan DATA: seberapa mirip domain sumber-target, berapa data yang ada, dan berapa parameter yang dilatih. Hardware menentukan KECEPATAN, bukan STRATEGI. Jangan tertukar." },
            { text: "Aturan tanpa alasan", why: "Alasannya jelas: preservasi pengetahuan vs adaptasi." },
          ],
        },
        {
          q: "Fine-tune ImageNet untuk citra rontgen: strategi unfreeze?",
          options: [
            { text: "Bekukan semua, termasuk head", why: "Head harus diganti total — kelasnya berbeda." },
            { text: "Unfreeze bertahap dari atas; lapisan bawah (tepi/tekstur) tetap berguna", why: "Tata bahasa visual universal; kosakata objek spesifik yang perlu adaptasi.", correct: true },
            { text: "Unfreeze dari bawah saja", why: "Terbalik: yang paling perlu adaptasi justru lapisan atas." },
            { text: "Acak ulang semua bobot", why: "Itu sama dengan training dari nol — membuang gunanya pretrained." },
          ],
        },
        {
          q: "Gejala negative transfer?",
          options: [
            { text: "Training lebih cepat", why: "Itu gejala POSITIF (akurasi naik / loss turun) — bukan negative transfer. Negative transfer = akurasi TURUN setelah memakai pretrained. Bedakan arah: naik = transfer membantu; turun = transfer meracuni. Baca tandanya dengan benar sebelum bertindak." },
            { text: "Fine-tune kalah dari baseline sederhana/head kecil", why: "Pretrained yang domainnya terlalu jauh justru jadi beban; kecilkan head atau ganti pretrained.", correct: true },
            { text: "Loss turun mulus", why: "Itu TANDA BAIK (model belajar, generalisasi naik) — kebalikan dari masalah. Jika ini yang kamu amati, tidak ada yang perlu diperbaiki di sini; cari di tempat lain. Jangan mengobati pasien yang sehat." },
            { text: "Akurasi 93%", why: "Itu KEBERHASILAN (target tercapai), bukan gejala negative transfer. Negative transfer selalu ditandai PENURUNAN vs baseline. Jika angkanya membaik, rayakan — lalu pastikan peningkatannya nyata (evaluasi di data uji yang bersih, bukan validasi yang bocor)." },
          ],
        },
        {
          q: "Head 650 parameter dilatih dengan 500 foto. Rasio data/parameter head?",
          options: [
            { text: "0,77 — tidak sehat", why: "Terbalik: 500/650 < 1 memang, tetapi head kecil + backbone beku = setting ini justru sehat." },
            { text: "500/650 ≈ 0,77 tetapi sehat karena backbone beku memberi fitur matang", why: "Head hanya memetakan fitur jadi ke 5 kelas — tugas ringan yang 500 sampel cukup.", correct: true },
            { text: "Tidak bisa dihitung", why: "Bisa dihitung langsung: 500 foto / 650 parameter head = 0,77 foto per parameter — SANGAT KECIL (ideal >10). Artinya head pun rawan overfit jika dilatih penuh! Solusi: regularisasi kuat (dropout, weight decay), augmentasi agresif, atau head lebih kecil. Angka kecil = waspada besar." },
            { text: "Harus > 100", why: "Aturan praktis itu untuk training dari nol, bukan untuk head di atas fitur pretrained." },
          ],
        },
      ],
    },
  ],
};
