import type { V2Lesson } from "../lib/types";

// Dice vs threshold: 0.3 -> 0.77, 0.5 -> 0.79, 0.7 -> 0.84 (terbaik).
const FIG_DICE = `<svg viewBox="0 0 480 250" role="img" aria-label="Dice score vs threshold: terbaik di 0,7.">
<g stroke="var(--chart-grid)" stroke-width="1"><line x1="44" y1="205" x2="460" y2="205"/><line x1="44" y1="155" x2="460" y2="155"/><line x1="44" y1="105" x2="460" y2="105"/><line x1="44" y1="55" x2="460" y2="55"/></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="end"><text x="38" y="209">0,7</text><text x="38" y="159">0,75</text><text x="38" y="109">0,8</text><text x="38" y="59">0,85</text></g>
<polyline points="120,150 240,135 360,62" fill="none" stroke="var(--c1)" stroke-width="3"/>
<g fill="var(--c1)"><circle cx="120" cy="150" r="6"/><circle cx="240" cy="135" r="6"/><circle cx="360" cy="62" r="7" stroke="var(--text)" stroke-width="2"/></g>
<g fill="var(--text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="120" y="225">threshold 0,3</text><text x="240" y="225">threshold 0,5</text><text x="360" y="225">threshold 0,7 ✓</text></g>
<g fill="var(--chart-text)" font-size="11" font-family="var(--font-ui)" text-anchor="middle"><text x="120" y="140">0,77</text><text x="240" y="125">0,79</text><text x="360" y="52">0,84</text></g>
<text x="240" y="245" font-size="11" fill="var(--text-muted)" font-family="var(--font-ui)" text-anchor="middle">threshold bukan 0,5 selalu — ukur, jangan asumsikan</text>
</svg>`;

export const dle14: V2Lesson = {
  slug: "dle14-segmentasi-unet",
  track: "Deep Learning Engineer",
  module: "Training & Produksi",
  title: "DLE14 — Segmentasi (U-Net): Klasifikasi Tiap Piksel",
  estMinutes: 50,
  steps: [
    {
      id: "cerita-tumor",
      eyebrow: "Langkah 1 · Cerita",
      title: "Kotak yang tidak cukup presisi untuk pisau bedah",
      prose: [
        "RS memakai deteksi objek untuk tumor: kotak di sekitar tumor, IoU 0,85 — bagus. Tetapi dokter bedah bertanya: 'di mana TEPATNYA batas tumor vs jaringan sehat?' Kotak mencakup 40% jaringan sehat di sudut-sudutnya. Untuk diagnosis cukup; untuk operasi = tidak cukup. Bedah butuh BATAS PRESISI, bukan kotak.",
        "Tim beralih ke segmentasi: tiap PIKSEL diklasifikasi (tumor/bukan) — keluar 'mask' yang mengikuti lekuk tumor persis. Arsitekturnya U-Net (2015): bentuk U dengan 'jalan pintas' (skip connections) dari encoder ke decoder. Dice score 0,89 — batasnya akurat hingga 2 piksel.",
        "Twist-nya: segmentasi = klasifikasi yang 'zoom in' ke tiap piksel. Masalah yang sama (klasifikasi), resolusi berbeda (piksel vs citra). U-Net lahir untuk citra medis (30 sampel cukup!) — bukti bahwa arsitektur yang tepat mengalahkan data besar. Lesson ini = U-Net, Dice, dan kapan kotak tidak cukup.",
        "🎯 Tujuan pembelajaran — setelah lesson ini kamu bisa: (1) membedakan deteksi vs segmentasi semantik vs instance; (2) menjelaskan arsitektur U-Net (encoder-decoder + skip); (3) menghitung Dice score; (4) memilih loss untuk class imbalance; (5) memutuskan kapan segmentasi vs deteksi.",
        "🗺️ Isi lesson: Langkah 1 · Cerita — Langkah 2 · Tiga jenis segmentasi — Langkah 3 · Lab: Dice & threshold — Langkah 4 · U-Net mendalam — Langkah 5 · Peta keputusan — Langkah 6 · Mini-case — Langkah 7 · Pendalaman — Checkpoint.",
      ],
      tasks: [],
      reference: "Deteksi = kotak. Segmentasi = mask per piksel. Beda presisi, beda kegunaan.",
    },
    {
      id: "konsep-jenis",
      eyebrow: "Langkah 2 · Tiga jenis",
      title: "Semantik, instance, panoptic: seberapa detail?",
      prose: [
        "Segmentasi SEMANTIK: tiap piksel dapat label kelas ('tumor', 'sehat') — dua tumor bersebelahan = SATU blob (tidak dibedakan individu). Cukup untuk: luas area, batas operasi. Arsitektur: U-Net, DeepLab.",
        "Segmentasi INSTANCE: tiap INDIVIDU dibedakan (tumor-1 vs tumor-2, seperti Mask R-CNN = deteksi + mask per kotak). Perlu untuk: menghitung objek ('berapa tumor?'), tracking. Lebih mahal dari semantik.",
        "PANOPTIC: gabungan — tiap piksel punya (kelas + id individu). Standar autonomous driving (jalan + tiap mobil dibedakan). Paling lengkap, paling mahal.",
        "Metrik: Dice = 2×irisan/(prediksi+target) — mirip F1 untuk piksel. IoU juga dipakai (Dice = 2IoU/(1+IoU)). Contoh lab: prediksi vs lingkaran r=10 (305 piksel): Dice 0,79 di threshold 0,5; 0,84 di 0,7! Threshold BUKAN selalu 0,5.",
        "Kepribadian ketiganya: semantik = mewarnai peta (sawah hijau, kota abu); instance = memberi nomor rumah; panoptic = peta + nomor rumah. Pilih detail sesuai kebutuhan — jangan bayar panoptic untuk pertanyaan semantik.",
        "Focal loss — untuk imbalance ekstrem. (1−p)^γ × CE: piksel mudah (p≈1) → loss ≈ 0 (diabaikan!); piksel sulit → loss penuh. γ=2 standar. Efek: model berhenti 'puas' dengan background mudah, fokus ke batas tumor yang sulit. Pasangan Dice loss yang umum.",
        "Boundary loss — presisi tepi. Dice peduli AREA; boundary loss peduli JARAK tepi prediksi ke tepi asli. Untuk bedah (batas = segalanya): Dice + boundary. Metrik: Hausdorff distance (jarak maksimum tepi) — 'kesalahan terburuk', bukan rata-rata.",
        "Panoptic quality — metrik gabungan. PQ = segmentasi (IoU) × recognition (F1 deteksi). Satu angka untuk 'peta + nomor rumah'. Untuk autonomous driving: PQ > 0,6 = layak. Jangan ukur panoptic dengan Dice saja (buta individu!) atau mAP saja (buta piksel!).",
        "Annotation cost — realita. Segmentasi: 30 menit/citra (gambar mask!) vs deteksi 3 menit (kotak) vs klasifikasi 10 detik. 1.000 citra segmentasi = 500 jam = Rp100 juta. Karena itu: data sedikit + augmentasi (U-Net!) atau weak supervision (kotak → mask via SAM). Biaya anotasi = sering penentu arsitektur.",
      ],
      formula: String.raw`\text{Dice} = \frac{2|A \cap B|}{|A| + |B|} \qquad \text{Dice} = \frac{2\,\text{IoU}}{1 + \text{IoU}}`,
      formulaNote: "Dice = 2×irisan dibagi jumlah piksel prediksi+target; A = mask prediksi, B = mask asli. Contoh lab: irisan 260, |A|=310, |B|=305 → Dice = 520/615 = 0,845. Dice menghukum false positive+negative seimbang — ideal untuk mask.",
      figure: {
        svg: FIG_DICE,
        alt: "Dice score vs threshold binerisasi.",
        caption: "Dice vs threshold: 0,7 terbaik.",
      },
      tasks: [],
      note: {
        title: "🚨 Miskonsepsi",
        type: "pitfall",
        body: "'Akurasi piksel 99% = segmentasi bagus.' Salah — jika tumor hanya 1% piksel, model 'semua sehat' dapat 99% akurasi dengan Dice 0! Class imbalance ekstrem = akurasi menipu. Selalu ukur Dice/IoU untuk kelas minoritas. 99% yang buta = 0% yang berguna.",
      },
      reference: "Semantik (kelas), instance (+individu), panoptic (keduanya). Dice > akurasi piksel.",
    },
    {
      id: "lab-dice",
      eyebrow: "Langkah 3 · Lab Dice",
      title: "Lab: Dice 0,79 → 0,84 dengan threshold tepat",
      prose: [
        "Lingkaran tumor r=10 (305 piksel) di citra 32×32 + noise. Model mengeluarkan 'logit' (keyakinan per piksel). Implementasikan dice() dan sweep threshold [0,3; 0,5; 0,7] — mana terbaik?",
        "Hasil: t=0,5 → 0,7865; t=0,7 → 0,8449 (TERBAIK!). Mengapa 0,7 menang? Noise membuat banyak piksel 'agak yakin' (0,5-0,7) — threshold tinggi memangkas false positive. Coba ubah: noise 2,0 (lebih berisik) — lihat Dice anjlok dan threshold optimal bergeser. Noise = musuh yang mengubah aturan main.",
        "Cara membaca: best=(0,8449, 0,7) = 'kepercayaan diri yang tepat'. Interpretasi: threshold = kenop presisi-recall untuk mask — ukur, jangan asumsikan 0,5.",
      ],
      tasks: [
        { id: "t1", text: "Implementasikan `dice(pred, target)` = 2*irisan/(jumlah)" },
        { id: "t2", text: "Sweep threshold [0.3, 0.5, 0.7], tentukan terbaik, `print` hasilnya" },
      ],
      expected: "dice_t0.5=0.7865 best=(dice=0.8449, thresh=0.7)",
      requires: ["numpy"],
      note: {
        title: "💡 Intuisi",
        body: "Threshold 0,5 adalah 'default malas'. Untuk mask medis (false positive = operasi tak perlu!), threshold TINGGI lebih aman. Untuk deteksi cacat (false negative = produk rusak lolos!), threshold RENDAH. Threshold = cerminan biaya kesalahan — bukan konstanta matematika.",
      },
      hints: [
        "irisan = (pred*target).sum(); dice = 2*irisan/(pred.sum()+target.sum()+eps)",
        "prob = 1/(1+exp(-logits)); pred = (prob > t).astype(float)",
        "max dari [(dice(...), t) for t in [0.3,0.5,0.7]]",
      ],
      code: {
        starter: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(5)
H, W = 32, 32
yy, xx = np.mgrid[0:H, 0:W]
mask_true = ((xx-16)**2 + (yy-16)**2 < 100).astype(float)
logits = np.where(mask_true > 0, 2.0, -1.0) + rng.normal(0, 1.2, (H, W))

# TULIS KODEMU
def dice(pred, target, eps=1e-9):
    # TODO t1: 2*irisan / (jumlah pred + jumlah target)
    return 0.0

# TODO t2: sweep [0.3, 0.5, 0.7] -> best = (dice, threshold)
best = (0.0, 0.5)

# UJI (jangan ubah)
prob = 1/(1+np.exp(-logits))
print("dice_t0.5 =", dice((prob > 0.5).astype(float), mask_true))
print("best_thresh =", (round(best[0], 4), best[1]))
print("n_piksel_tumor =", int(mask_true.sum()))`,
        lockLines: 8,
        solution: `# SEED — jangan ubah
import numpy as np
rng = np.random.default_rng(5)
H, W = 32, 32
yy, xx = np.mgrid[0:H, 0:W]
mask_true = ((xx-16)**2 + (yy-16)**2 < 100).astype(float)
logits = np.where(mask_true > 0, 2.0, -1.0) + rng.normal(0, 1.2, (H, W))

# TULIS KODEMU
def dice(pred, target, eps=1e-9):
    inter = (pred * target).sum()
    return round(float(2*inter / (pred.sum() + target.sum() + eps)), 4)

best = max(((dice((1/(1+np.exp(-logits)) > t).astype(float), mask_true), t)
            for t in [0.3, 0.5, 0.7]), key=lambda x: x[0])

# UJI (jangan ubah)
prob = 1/(1+np.exp(-logits))
print("dice_t0.5 =", dice((prob > 0.5).astype(float), mask_true))
print("best_thresh =", (round(best[0], 4), best[1]))
print("n_piksel_tumor =", int(mask_true.sum()))`,
        checks: [
          { kind: "stdout_matches", task: "t1", pattern: "dice_t0\\.5\\s*=\\s*0\\.7865", label: "Dice@0.5 = 0.7865", msg: "Baseline threshold standar." },
          { kind: "stdout_matches", task: "t2", pattern: "best_thresh\\s*=\\s*\\(0\\.8449, 0\\.7\\)", label: "Terbaik = (0.8449, 0.7)", msg: "Threshold tinggi memangkas noise." },
          { kind: "stdout_matches", task: "t2", pattern: "n_piksel_tumor\\s*=\\s*305", label: "305 piksel tumor", msg: "Lingkaran r=10." },
        ],
      },
      reference: "Dice = F1 untuk piksel. Threshold = kenop biaya kesalahan.",
    },
    {
      id: "konsep-unet",
      eyebrow: "Langkah 4 · U-Net",
      title: "U-Net: huruf U dengan jalan pintas",
      prose: [
        "Arsitektur: ENCODER (kiri, turun) — konvolusi + pooling, citra 572×572 → 32×32 dengan 1.024 channel: 'apa' (semantik) tetapi kehilangan 'di mana' (resolusi). DECODER (kanan, naik) — upsampling kembali ke 572×572: 'di mana' pulih, tetapi detail halus hilang. SKIP CONNECTIONS — jalan pintas: salin feature map encoder (resolusi tinggi) langsung ke decoder selevel: detail + semantik BERSATU. Bentuk U = turun lalu naik dengan jembatan di tiap level.",
        "Mengapa skip penting: tanpa skip, decoder menebak detail dari 32×32 — batas kabur (Dice 0,70). Dengan skip: detail asli 572×572 tersedia — batas tajam (Dice 0,89). Ablasi membuktikan: skip = +19 poin. 'Jalan pintas' = fitur terpenting, bukan tempelan.",
        "Kelahiran U-Net (2015, Freiburg): untuk sel biomedis dengan HANYA 30 citra latih! Trik: augmentasi elastis agresif (deformasi) — 30 menjadi 3.000 efektif. Pelajaran: arsitektur + augmentasi > data besar. Untuk medis Indonesia (data sedikit!): U-Net + augmentasi = resep standar.",
        "Loss untuk imbalance: tumor 1% piksel → cross-entropy 'puas' dengan semua-sehat. Solusi: Dice loss (1 − Dice, optimasi langsung metriknya!) atau focal loss (fokus ke piksel sulit). Praktik: Dice + CE digabung (0,5×keduanya) = stabil + tajam.",
        "Kepribadian U-Net: seperti arsitek yang turun ke basement (encoder: paham struktur) lalu naik lagi (decoder: gambar denah) SAMBIL membawa foto tiap lantai (skip: detail tidak hilang). Turun-naik-bawa-foto = U.",
        "DeepLab vs U-Net — kapan. DeepLab (atrous convolution): konteks LUAS tanpa kehilangan resolusi — untuk citra besar (satelit, jalan). U-Net: presisi batas + data sedikit — untuk medis. Citra 4K jalanan? DeepLab. 30 citra tumor? U-Net. Konteks vs presisi = trade-off arsitektur.",
        "3D U-Net — untuk volume. CT/MRI = tumpukan 2D → 3D U-Net (konvolusi 3D) memakai konteks antar-slice. 10x compute, +5 poin Dice untuk tumor 3D. Data volumetrik? Jangan paksa 2D slice-by-slice (kehilangan konteks atas-bawah!).",
        "Test-time augmentation — gratis +2 poin. Prediksi 8 versi (flip/rotate) → rata-rata. 8x compute inference (murah!) untuk +2 Dice. Untuk kompetisi/ medis kritis: selalu. Untuk real-time: jangan (8x lambat).",
        "Ensemble 5-fold — +1,5 Dice. 5 model (fold berbeda) → rata-rata prediksi. 5x training (mahal!) untuk +1,5 poin. Untuk kompetisi: wajib. Untuk produksi: biasanya tidak worth (5x inference cost!). Pilih dari budget, bukan gengsi.",
      ],
      formula: String.raw`\mathcal{L}_{\text{Dice}} = 1 - \frac{2\sum p_i g_i + \epsilon}{\sum p_i + \sum g_i + \epsilon}`,
      formulaNote: "L_Dice = 1 − Dice (dioptimasi langsung!); p_i = probabilitas prediksi piksel i; g_i = ground truth (0/1); ε = stabilitas. Contoh: prediksi sempurna → L=0; semua-sehat (tumor 1%) → L≈0,99 (tidak 'puas' seperti CE!).",
      tasks: [],
      note: {
        title: "💡 Intuisi",
        body: "U-Net membuktikan 'lebih banyak data' bukan satu-satunya jawaban. 30 citra + augmentasi cerdas + arsitektur tepat = mengalahkan 3.000 citra + arsitektur salah. Untuk domain langka (medis, satelit Indonesia): invest di augmentasi + arsitektur, bukan berburu data mustahil.",
      },
      reference: "Encoder (apa) + decoder (di mana) + skip (detail). Dice loss untuk imbalance.",
    },
    {
      id: "peta-keputusan",
      eyebrow: "Langkah 5 · Peta keputusan",
      title: "Peta keputusan: kotak atau mask?",
      prose: [
        "Skenario 1 — butuh lokasi kasar, cepat (parkir, CCTV) → deteksi objek (kotak pembatas + label yang keluar dalam satu forward pass ala YOLO). Kotak cukup.",
        "Skenario 2 — butuh batas presisi (tumor, cacat las) → segmentasi semantik (U-Net).",
        "Skenario 3 — hitung individu (sel, kendaraan) → instance (Mask R-CNN).",
        "Skenario 4 — data sedikit (<100 citra) → U-Net + augmentasi elastis. Jangan detektor rakus data.",
        "Skenario 5 — real-time + presisi → YOLACT/YOLO-seg (segmentasi cepat). Kompromi.",
        "Aturan praktis 10 detik: (1) batas presisi? ya → segmentasi. (2) hitung individu? → instance. (3) ukur Dice, bukan akurasi piksel. (4) imbalance → Dice loss.",
        "Skenario 6 — video (bukan citra) → segmentasi per frame + temporal smoothing (atau video model). Flicker antar-frame = musuh; smoothing 3 frame = stabil.",
      ],
      tasks: [],
    },
    {
      id: "minicase-las",
      eyebrow: "Langkah 6 · Mini-case",
      title: "Mini-case: cacat las 10.000 citra/hari",
      prose: [
        "Pabrik: 10.000 citra las/hari, cacat = retak (tipis, 0,5% piksel!). Deteksi kotak: IoU 0,70 — kotak menutupi 60% area sehat → pengukuran panjang retak SALAH 40%. Segmentasi U-Net: Dice 0,87 — panjang retak akurat ±2 piksel → keputusan 'perbaiki vs buang' benar.",
        "Nilai: retak >5mm = buang (Rp500 ribu/unit). Salah ukur 40% → 200 unit/hari salah vonis × Rp500 ribu = Rp100 juta/hari! U-Net: salah vonis 20/hari = Rp10 juta. Hemat: Rp90 juta/hari. Biaya: training 1 GPU 2 hari (Rp400 ribu) + anotasi 500 citra (Rp25 juta sekali). ROI hari pertama: 3.500x.",
        "Pembahasan: 0,5% piksel = imbalance 200:1 — cross-entropy murni gagal total (prediksi semua-sehat, 'akurasi' 99,5%!). Dice loss = penyelamat. Pelajaran: metrik dan loss HARUS sadar imbalance.",
        "Cara membaca: presisi yang dibutuhkan (mm!) menentukan kotak vs mask. Tanya: 'seberapa presisi batas yang dibutuhkan?' — jawabannya memilih arsitektur.",
        "Interpretasi: segmentasi = 'penggaris piksel'. Untuk keputusan fisik (potong, buang, operasi), penggaris > kotak.",
        "Human-in-the-loop — 8% ragu → manusia. Aturan: Dice <0,7 atau confidence rendah → antrean review. 8% × 10.000 = 800/hari = 2 operator. Otomatisasi 92% + manusia 8% = sistem, bukan demo.",
        "Versi model — v1/v2 terdokumentasi. v2 (Dice 0,89) vs v1 (0,87): kapan v2 dipromosikan? Kriteria tertulis: Dice +0,01 di 200 citra uji BARU. Tanpa kriteria: 'terasa lebih baik' = bukan engineering.",
      ],
      tasks: [],
    },
    {
      id: "pendalaman-skip-loss",
      eyebrow: "Langkah 7 · Pendalaman",
      title: "Skip connections dalam, loss gabungan, dan perang melawan batas kabur",
      prose: [
        "Skip connections dalam — tiga generasi. U-Net klasik: skip concat sederhana per level (fitur encoder resolusi tinggi digabung ke decoder selevel). UNet++: skip BERSARANG (nested dense) — fitur dari berbagai kedalaman digabung sebelum sampai decoder, dengan deep supervision di tiap cabang; hasil +1–2 poin Dice dengan harga parameter dan memori naik, plus opsi pruning cabang untuk inference cepat. Attention U-Net: attention gate dipasang PADA skip connection — sebelum digabung, aktivasi background yang tidak relevan ditekan sehingga decoder fokus ke region target; sangat membantu untuk organ/tumor KECIL di citra besar yang background-nya dominan. Aturan pilih: klasik cukup untuk mayoritas kasus; attention bila target kecil + background bising; UNet++ bila budget compute longgar dan butuh poin terakhir (kompetisi).",
        "Dice vs cross-entropy — anatomi gradiennya. Cross-entropy: loss dihitung PER PIKSEL lalu dirata-rata — piksel background yang mudah (99% citra!) mendominasi gradien, sinyal dari 1% piksel tumor tenggelam. Dice loss: fungsi GLOBAL dari irisan prediksi-target — gradiennya terdistribusi berdasar kontribusi terhadap overlap, sehingga piksel tumor yang sedikit tetap 'bersuara'. Kenapa kombinasi 0,5·Dice + 0,5·CE menjadi resep standar: di awal training prediksi masih acak dan gradien Dice berisik/tidak stabil — CE menstabilkan; di akhir, Dice mempertajam overlap. Aturan praktis: kelas relatif seimbang → CE saja cukup; imbalance >10:1 → kombinasi; >100:1 → Dice + focal loss (focal menekan piksel mudah di dalam CE).",
        "Boundary-aware: kapan Dice membohongi. Dice mengukur AREA overlap — menggeser tepi tumor besar sejauh 2 piksel hampir tidak mengubah Dice (tetap ~0,98), padahal untuk pisau bedah 2 piksel = jaringan sehat terpotong atau tumor tersisa! Karena itu metrik klinis memakai: boundary loss saat training (menghukum jarak tepi prediksi ke tepi asli, bukan area), Hausdorff distance saat evaluasi (jarak MAKSIMUM antar tepi — mengukur 'kesalahan terburuk', bukan rata-rata), dan surface Dice (fraksi titik tepi yang berada dalam toleransi τ, mis. 2 piksel — 'berapa persen batasnya akurat secara klinis'). Aturan senior: bila output menggerakkan sesuatu di dunia fisik (bedah, potong laser, buang produk), laporkan surface Dice/Hausdorff — Dice saja = metrik yang buta terhadap yang paling penting.",
        "Resolusi vs memori — fisika training segmentasi. Aktivasi U-Net pada 512×512 float32 dengan batch kecil saja sudah menuntut GB memori; 1024×1024 = OOM di GPU 24GB. Teknik praktisi: (a) patch-based training — latih pada patch 256×256 dengan SAMPLING BERIMBANG (50% patch wajib mengandung kelas langka! patch acak murni akan 99% background dan model tak pernah belajar tumor); (b) overlap-tile inference — prediksi dengan stride 50% lalu blending untuk menghilangkan garis sambungan (seam); (c) mixed precision / AMP — hemat ~2x memori dengan Dice ±0. Trade-off yang sering dilupakan: patch terlalu kecil menghilangkan KONTEKS (tumor 300px terpotong patch 128px) — pilih patch minimal 2x diameter objek terbesar.",
        "Augmentasi medis & satelit — yang bekerja dan yang berbahaya. Elastic deformation (citra 'dilenyutkan' halus): jaringan biologis memang deformable sehingga ini augmentasi paling natural untuk medis — U-Net asli justru menang karena ini. Stain/color jitter TERBATAS: mensimulasikan variasi scanner/lab — tetapi JANGAN mengubah hue sampai sel kanker terlihat seperti sel sehat (augmentasi harus preserve label semantics!). Satelit: rotasi bebas + skala acak (objek tak berorientasi), tetapi hindari vertical flip pada citra jalan/kota bila arah bayangan konsisten (model bisa belajar artefak). Copy-paste augmentation: tempel objek langka ke citra lain — +recall kelas langka yang murah. Uji tiap augmentasi: 'apakah transformasi ini mungkin terjadi di dunia nyata?' — bila tidak, ia mengajarkan kebohongan.",
        "Failure modes dan penanganannya — katalog praktisi. (a) Lubang di dalam mask (tumor berlubang): post-processing largest-connected-component atau CRF refinement — murah dan efektif. (b) Kelas langka tak terdeteksi sama sekali: oversampling patch + focal + Dice, lalu CEK per-class Dice (rata-rata menutupi!). (c) Domain shift antar scanner/rumah sakit: normalisasi stain (mis. metode Macenko) + WAJIB uji di scanner berbeda — model yang hanya divalidasi di satu rumah sakit = bom waktu. (d) Batas kabur sistematis: tambah boundary loss, monitor surface Dice bukan cuma Dice. (e) Overconfidence di background: bila threshold dipakai untuk keputusan rujukan, kalibrasi (ECE) — model 'yakin 95%' harus benar ~95%.",
        "Aturan keputusan senior — urutan kerja segmentasi: (1) mulai U-Net klasik + combo loss 0,5/0,5 + augmentasi elastic — baseline ini mengalahkan 80% eksperimen eksotis; (2) bila target kecil di citra besar → Attention U-Net; (3) bila OOM → patch-based (sampling berimbang!) + AMP, bukan beli GPU dulu; (4) bila output menggerakkan fisik → tambah boundary loss + laporkan surface Dice/Hausdorff; (5) ensemble 5-fold (+1,5 Dice) hanya bila 5x biaya inference sebanding nilainya — untuk produksi biasanya TIDAK. Naik tingkat hanya bila metrik menunjukkan masalah spesifik — 'model lebih canggih' bukan diagnosis.",
      ],
      formula: String.raw`\mathcal{L} = \alpha\,\mathcal{L}_{\text{Dice}} + (1-\alpha)\,\mathcal{L}_{\text{CE}} \qquad \alpha = 0{,}5 \text{ (umum)}`,
      formulaNote: "Loss gabungan standar: α=0,5 artinya Dice dan cross-entropy berbobot sama. Contoh: tumor 1% piksel — CE saja memberi gradien yang didominasi background (model 'puas' semua-sehat), Dice memaksa gradien memperhatikan overlap. Praktik: mulai α=0,5; naikkan α bila kelas makin langka (>100:1 → pertimbangkan Dice + focal).",
      tasks: [],
      reference: "Skip: klasik → attention (target kecil) → UNet++ (poin terakhir). Loss: CE stabil, Dice tajam, combo standar. Batas kritis → surface Dice/Hausdorff. OOM → patch berimbang + AMP.",
    },
    {
      id: "checkpoint",
      eyebrow: "Checkpoint",
      title: "Uji pemahamanmu",
      prose: [
        "Delapan pertanyaan campuran dari semua langkah. Setiap opsi punya alasan kenapa benar atau salah.",
      ],
      tasks: [],
      summary: [
        "Segmentasi = klasifikasi per piksel; semantik (kelas), instance (+individu), panoptic (keduanya).",
        "Dice = 2×irisan/(jumlah); untuk imbalance, Dice > akurasi piksel (99% bisa = buta).",
        "U-Net: encoder (apa) + decoder (di mana) + skip connections (detail) = bentuk U.",
        "Dice loss (1−Dice) untuk imbalance; threshold ≠ selalu 0,5 — ukur!",
        "30 citra + augmentasi + U-Net bisa mengalahkan data besar + arsitektur salah.",
      ],
      next: { label: "Kembali ke Kurikulum", href: "/v2/learn" },
      quiz: [
        {
          q: "Tumor 1% piksel, model 'semua sehat' akurasi 99%. Dice-nya?",
          options: [
            { text: "0 — tidak ada irisan sama sekali", why: "Tepat: 99% akurasi dengan Dice 0 = buta total. Ukur Dice!", correct: true },
            { text: "0,99", why: "Itu akurasi — metrik yang menipu untuk imbalance.", correct: false },
            { text: "0,5", why: "Tidak ada prediksi positif = irisan nol.", correct: false },
            { text: "Tidak bisa dihitung", why: "Bisa: Dice = 2×0/(0+305) = 0 — tidak ada irisan, tidak ada skor.", correct: false },
          ],
        },
        {
          q: "Fungsi skip connections di U-Net?",
          options: [
            { text: "Menyalurkan detail resolusi tinggi ke decoder — batas tajam", why: "Tepat: +19 poin Dice dari ablasi.", correct: true },
            { text: "Mempercepat training", why: "Bukan fungsi utamanya — ini soal informasi, bukan kecepatan.", correct: false },
            { text: "Mengurangi parameter", why: "Justru menambah parameter (concat channel) — skip bukan penghematan, melainkan informasi.", correct: false },
            { text: "Hanya dekorasi", why: "Ablasi membuktikan krusial — tanpa skip, Dice anjlok 19 poin.", correct: false },
          ],
        },
        {
          q: "Threshold 0,7 mengalahkan 0,5 (Dice 0,84 vs 0,79). Mengapa?",
          options: [
            { text: "Memangkas false positive dari noise 'agak yakin'", why: "Tepat: threshold = kenop presisi-recall mask.", correct: true },
            { text: "0,7 selalu terbaik", why: "Tergantung noise dan biaya kesalahan — ukur!", correct: false },
            { text: "Kebetulan saja", why: "Sistematis: noise → threshold tinggi lebih baik.", correct: false },
            { text: "0,5 seharusnya menang", why: "0,5 hanya default — bukan hukum.", correct: false },
          ],
        },
        {
          q: "Butuh menghitung jumlah sel (bukan luas). Pilih?",
          options: [
            { text: "Instance segmentation (Mask R-CNN)", why: "Tepat: instance segmentation membedakan individu — itulah definisinya.", correct: true },
            { text: "Segmentasi semantik", why: "Blob menyatu — tidak bisa hitung individu.", correct: false },
            { text: "Deteksi kotak", why: "Bisa hitung, tetapi tumpang tindih = masalah.", correct: false },
            { text: "Klasifikasi citra", why: "Tidak ada informasi individu sama sekali.", correct: false },
          ],
        },
        {
          q: "Hanya 30 citra medis. Strategi terbaik?",
          options: [
            { text: "U-Net + augmentasi elastis agresif", why: "Tepat: resep asli U-Net 2015 — terbukti.", correct: true },
            { text: "Kumpulkan 30.000 dulu", why: "Mustahil untuk kasus langka — dan tidak perlu.", correct: false },
            { text: "Model raksasa dari nol", why: "30 citra = overfit pasti untuk model besar.", correct: false },
            { text: "Menyerah", why: "U-Net lahir untuk tepat kasus ini.", correct: false },
          ],
        },
        {
          q: "Tumor 0,5% piksel; cross-entropy murni menghasilkan prediksi 'semua sehat'. Perbaikan pertama yang paling tepat?",
          options: [
            { text: "Ganti ke Dice loss atau kombinasi Dice + cross-entropy", why: "Tepat: CE didominasi gradien background; Dice memaksa model memperhatikan overlap kelas langka.", correct: true },
            { text: "Tambah lebih banyak citra background", why: "Salah: memperparah imbalance — masalahnya bukan kurang data, melainkan loss yang buta.", correct: false },
            { text: "Naikkan learning rate", why: "Salah: mempercepat konvergensi ke solusi 'semua sehat' yang sama.", correct: false },
            { text: "Naikkan threshold ke 0,9", why: "Salah: threshold mengatur keputusan, bukan memperbaiki training yang gagal belajar.", correct: false },
          ],
        },
        {
          q: "GPU OOM pada citra 1024×1024; objek terbesar berdiameter 200px. Strategi paling tepat?",
          options: [
            { text: "Patch-based training 256–512px dengan sampling berimbang + overlap-tile inference", why: "Tepat: patch ≥2x objek terbesar menjaga konteks; sampling berimbang memastikan kelas langka terlihat.", correct: true },
            { text: "Perkecil citra ke 64×64", why: "Salah: detail batas (yang justru dicari segmentasi) hancur total.", correct: false },
            { text: "Naikkan batch size agar stabil", why: "Salah: batch lebih besar = memori lebih besar = OOM lebih parah.", correct: false },
            { text: "Beli GPU lebih besar dulu", why: "Salah: engineering (patch + AMP) menyelesaikan gratis sebelum belanja hardware.", correct: false },
          ],
        },
        {
          q: "Mask akan dipakai sebagai panduan bedah — batas 2 piksel menentukan jaringan yang dipotong. Metrik evaluasi utama?",
          options: [
            { text: "Surface Dice (toleransi 2px) dan/atau Hausdorff distance", why: "Tepat: keduanya mengukur kualitas TEPI — yang menentukan hasil bedah; Dice area buta terhadap geseran tepi kecil.", correct: true },
            { text: "Akurasi piksel", why: "Salah: 99% akurasi bisa berarti Dice 0 pada tumor kecil — menipu.", correct: false },
            { text: "Dice saja sudah cukup", why: "Salah: Dice 0,98 masih bisa berarti tepi bergeser 2px di semua sisi — fatal untuk bedah.", correct: false },
            { text: "mAP", why: "Salah: mAP adalah metrik deteksi kotak, bukan kualitas batas mask.", correct: false },
          ],
        },
      ],
    },
  ],
};
